/* ─────────────────────────────────────────────────────────────
 * book/cain.js —— 卷「该隐」：创世记 4:1 — 5:32
 *
 * 园子之外：地更硬、更暗，东边一丛丛荆棘；右边（西）远远的丘陵上，伊甸东门那一点火焰还在闪。
 * 亚当和夏娃的帐棚立在近岸的西头。
 *   4:1–2   夏娃怀中先后有了该隐、亚伯（夜过去两回，孩子长成）；该隐犁出一片田，亚伯领着羊群。
 *   4:3–5   两座石坛：亚伯的烟笔直上升、被一道自天而降的光接住；该隐的烟压下来，贴着地爬开。
 *   4:6–8   「你为什么发怒呢？」——罪像一团蹲伏的暗影伏在该隐身后；二人往田间去，
 *           黑暗合拢（不画暴力：只有光的熄灭），光再回来时，亚伯仆倒在田里。
 *   4:9     「你兄弟亚伯在哪里？」——夜里一道寻找的光走过田野，停在亚伯身上。
 *   4:10–12 血的声音：红金色的微光从地里升起，地开了口把他接去；该隐的田枯槁，荆棘爬进犁沟。
 *   4:13–22 记号落在该隐额上；黎明时他往东去，到远方的丘陵上建了以诺城（帐棚、琴箫、炉火）。
 *   4:25–26 塞特——亚伯倒下之处开出白花；以挪士；黄昏里众人跪在亚伯的旧坛前，光柱降下。
 *   5:1–24  亚当死了（一堆石头）；一代一代如季节经过，名字在他们头上聚成又散去；
 *           以诺与神同行（身旁一团微光），神将他取去——他升入光中，不在世了。
 *   5:25–32 玛土撒拉、拉麦；黎明，挪亚生了，名字由受咒诅之地的尘土聚成；闪、含、雅弗。
 *
 * 规矩：本卷的一切状态都只在 setup / apply / 情节（beats）里设定——瞬间重演时得到同样的世界。
 *       布景只在本卷进行时绘制（GS.book.current('cain')）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, smoothstep, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio, ui = () => GS.ui;
  const ACT = 'cain';
  const LV = W.lv;
  const safe = U.safe;

  // ── 本卷的程度（与世界的其余程度一样逐帧趋近目标，恢复时一并对齐）──
  W.defineLevel('cainField', 'lin', 0.085);   // 该隐的田：犁沟与庄稼
  W.defineLevel('cainAltar', 'lin', 0.3);     // 两座石坛
  W.defineLevel('cainFireA', 'exp', 0.7);     // 亚伯坛上的火
  W.defineLevel('cainFireC', 'exp', 0.7);     // 该隐坛上的火
  W.defineLevel('cainAccept', 'exp', 0.35);   // 耶和华看中了亚伯和他的供物
  W.defineLevel('cainShadow', 'exp', 0.4);    // 罪伏在门前
  W.defineLevel('cainDark', 'exp', 0.55);     // 田间：光熄灭
  W.defineLevel('cainSearch', 'exp', 0.45);   // 「你兄弟亚伯在哪里？」寻找的光
  W.defineLevel('cainBlood', 'exp', 0.4);     // 血的声音
  W.defineLevel('cainGround', 'exp', 0.5);    // 地开了口
  W.defineLevel('cainWither', 'lin', 0.07);   // 地不再给你效力
  W.defineLevel('cainMark', 'exp', 0.5);      // 记号
  W.defineLevel('cainCity', 'lin', 0.055);    // 以诺城
  W.defineLevel('cainArts', 'exp', 0.35);     // 帐棚、琴箫、铜铁
  W.defineLevel('cainBloom', 'lin', 0.12);    // 亚伯倒下之处开出白花
  W.defineLevel('cainCall', 'exp', 0.35);     // 求告耶和华的名
  W.defineLevel('cainWalk', 'exp', 0.5);      // 与神同行
  W.defineLevel('cainTaken', 'exp', 0.45);    // 神将他取去
  W.defineLevel('cainComfort', 'exp', 0.3);   // 安慰
  const MY = ['cainField', 'cainAltar', 'cainFireA', 'cainFireC', 'cainAccept', 'cainShadow', 'cainDark', 'cainSearch', 'cainBlood',
    'cainGround', 'cainWither', 'cainMark', 'cainCity', 'cainArts', 'cainBloom', 'cainCall', 'cainWalk', 'cainTaken', 'cainComfort'];

  // 本卷的局部状态（只在 setup / apply / 情节里设定）
  function fresh() {
    return {
      acceptT0: -1e9, searchT0: -1e9, markT0: -1e9, callT0: -1e9, takenT0: -1e9,
      enochX: 0.6,         // 以诺被取去之处（画面比例）
      cairns: [],          // 坟上的石堆 [{ x, t0, label }]
    };
  }
  let S = fresh();

  // ── 颜色 ────────────────────────────────────────────────────
  const HIDE = { m: [124, 88, 58], f: [138, 98, 66] };
  const ROBE = {
    cain: [124, 80, 56], abel: [170, 152, 122], seth: [116, 104, 92], sethW: [150, 112, 100],
    gen: [[124, 104, 86], [112, 98, 92], [128, 106, 80], [106, 96, 100]], enoch: [206, 192, 160], methu: [120, 106, 92],
    lamech: [128, 100, 76], lamechW: [152, 114, 98], noah: [142, 116, 86], line: [122, 76, 60],
    sons: [[118, 98, 80], [142, 94, 64], [96, 104, 124]],
  };
  const STONE = [148, 138, 124], SOIL = [96, 68, 44], SOIL_DRY = [104, 90, 74], MUD = [170, 134, 98], TENT = [112, 84, 60];
  const GRAIN = [150, 150, 70], RIPE = [214, 180, 96], DEAD = [118, 108, 96], THORN = [92, 76, 60];
  const GLOW = {
    warm: [255, 214, 150], fire: [255, 146, 64], pale: [226, 234, 255], gold: [255, 228, 170], blood: [255, 92, 56],
    dark: [5, 4, 9], smoke: [172, 168, 160], ash: [66, 58, 54],
  };

  // ── 小工具 ──────────────────────────────────────────────────
  const cur = () => GS.book.current(ACT);
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const M = () => Math.min(W.w, W.h);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const narrow = () => (W.w < 600 ? 1.15 : 1);
  const hNear = () => 34 * W.layerScale(2) * narrow();     // 近岸层上一个人的身高（像素）
  const hMid = () => 34 * W.layerScale(1) * narrow();      // 中丘层上一个人的身高
  function gY(px, layer) {
    const l = layer == null ? 2 : layer;
    const x = clamp(px, 0, W.w);
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  const fY = (px, v) => { const g = gY(px); return g + v * Math.max(0, W.h - g); };
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  const since = t0 => (W.t - t0) * (W.fast || 1);             // 情节里的秒数（随 fast 加速）
  function walk(id, x, sp, pose) { cast().walk(id, x, { speed: sp || 0.03, pose: pose || 'stand' }); }
  function sfx(name, b, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) safe('cain.sfx', () => a.sfx(name, o || {}));
  }
  function say(b, lines, delay) {
    if (inst(b)) return;
    safe('cain.say', () => ui().narrate(lines, { replace: false, delay: delay || 0 }));
  }
  function chime(ch) { const a = au(); if (a && a.nameChime) safe('cain.chime', () => a.nameChime(ch)); }
  function herd(gid, o) { const C = cast(); if (C && C.herd) safe('cain.herd', () => C.herd(gid, o)); }

  // 人物的身形（像素）：脚下、身高、头的高度
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function body(id) {
    const p = cast().get(id);
    if (!p) return null;
    const layer = p.layer == null ? 2 : p.layer;
    const x = p.nx * W.w;
    const h = 34 * W.layerScale(layer) * (AGE_H[p.age] || 1) * (p.scale || 1) * narrow() * (1 + 0.35 * (p.v || 0));
    const y = p.ny != null ? p.ny * W.h : (p._vis && isFinite(p._y) ? p._y : gY(x, layer));
    const ps = p.pose;
    const k = ps === 'lie' || ps === 'fall' ? 0.14 : ps === 'kneel' || ps === 'pray' || ps === 'sit' ? 0.6 : ps === 'bow' ? 0.72 : 0.9;
    return { p, x, y, h, head: y - h * k, a: p.alpha == null ? 1 : p.alpha, dir: p.fd || p.facing || 1 };
  }
  // 从某人身上升起的光尘（生、死、祝福）
  function sparkAt(id, n, col, spread) {
    const b = body(id);
    if (!b) return;
    const pass = b.p.layer === 1 ? 'mid' : 'near';
    fx().sparkle(b.x, b.y - b.h * 0.55, n || 20, col || [255, 236, 206], (spread || 0.3) * b.h, pass);
  }
  // 名字在人头上由光尘聚成（一代一代如季节经过）
  function nameOver(str, id, col, o) {
    const b = body(id);
    if (!b) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = o.size || Math.max(14, M() * 0.04);
    const cx = clamp(b.x, size * n * 0.6 + 4, W.w - size * n * 0.6 - 4);
    const cy = Math.max(size, b.head - b.h * 0.35 - size * (o.lift || 1.1));
    fx().nameStr(str, cx, cy, size, col || [255, 236, 200],
      o.src || (() => [b.x + rnd(-1, 1) * b.h * 0.35, b.y - rnd(0, 1) * b.h, col || [255, 230, 196]]), { hold: o.hold || 1.8, dot: o.dot || 2 });
    chime(Array.from(str)[0]);
  }

  // ════════════════════════════════════════════════════════════
  //  布局：一切以近岸大地的"跨度"比例安放（随屏幕缩放）
  // ════════════════════════════════════════════════════════════
  const SPOT = {
    flock0: 0.13, flock1: 0.3, altarA: 0.37, altarC: 0.48, field0: 0.56, field1: 0.86, fall: 0.7,
    tent: 0.968, adam: 0.855, eve: 0.885, city0: 0.02, city1: 0.22,
  };
  const FIELD_V = 0.3;           // 田在近地纵深里的深度
  const P = { w: 0, h: 0, L0: 0.32, L1: 1, M0: 0.5, M1: 1, s: 1 };
  let GEO = null;
  function layout() {
    if (GEO && P.w === W.w && P.h === W.h) return P;
    P.w = W.w; P.h = W.h;
    const sp = W.landSpan(2, W.h * 0.02);
    P.L0 = sp ? sp[0] / W.w : 0.32; P.L1 = sp ? Math.min(1, sp[1] / W.w) : 1;
    const sm = W.landSpan(1, W.h * 0.012);
    P.M0 = sm ? sm[0] / W.w : 0.5; P.M1 = sm ? Math.min(1, sm[1] / W.w) : 1;
    const u = Math.max(0.3, W.unit || 1);
    P.s = u < 0.75 ? u * (1 + (0.75 - u) * 0.8) : u;
    build();
    return P;
  }
  const at = f => { layout(); return P.L0 + (P.L1 - P.L0) * f; };      // 近岸跨度的比例 → 画面比例
  const atM = f => { layout(); return P.M0 + (P.M1 - P.M0) * f; };     // 中丘跨度的比例 → 画面比例
  const side = () => (hNear() * 0.62) / Math.max(1, W.w);              // 站在坛旁的距离（画面比例）

  // ── 几何（一次生成，确定的随机）──────────────────────────────
  function build() {
    const R = U.mulberry32(4041);
    GEO = { stalks: [], rows: 6, thorns: [], fieldThorns: [], houses: [], flowers: [], crack: [] };
    // 犁沟上的庄稼
    const fw = (at(SPOT.field1) - at(SPOT.field0)) * W.w;
    const gap = Math.max(2.4, 5.2 * P.s) / Math.max(0.5, W.quality || 1);
    const per = clamp(Math.round(fw / gap), 8, 90);
    for (let r = 0; r < GEO.rows; r++) {
      for (let i = 0; i < per; i++) {
        const f = (i + 0.5 + (R() - 0.5) * 0.6) / per;
        if (f < 0.03 || f > 0.97) continue;
        GEO.stalks.push({ f, r, h: 0.8 + R() * 0.45, lean: (R() - 0.5) * 0.35, ph: R() * TAU, dead: R() });
      }
    }
    // 荆棘：东边（左）一丛丛，其余零星
    const bush = (arr, f, sz, v) => {
      const stems = [];
      const n = 4 + Math.floor(R() * 4);
      for (let i = 0; i < n; i++) stems.push({ a: (R() - 0.5) * 1.9, l: sz * (0.55 + R() * 0.5), b: (R() - 0.5) * 0.7, th: R() * 0.5 });
      arr.push({ f, v, stems });
    };
    for (let i = 0; i < 7; i++) bush(GEO.thorns, 0.02 + R() * 0.12, 0.34 + R() * 0.32, R() * 0.12);
    for (let i = 0; i < 4; i++) { const f = [0.33, 0.52, 0.9, 0.99][i] + (R() - 0.5) * 0.02; bush(GEO.thorns, f, 0.18 + R() * 0.16, 0.02 + R() * 0.1); }
    // 受咒诅之后爬进犁沟的荆棘
    for (let i = 0; i < 9; i++) bush(GEO.fieldThorns, SPOT.field0 + 0.02 + (SPOT.field1 - SPOT.field0 - 0.04) * (i + R() * 0.8) / 9, 0.22 + R() * 0.22, 0.03 + R() * 0.2);
    // 以诺城的房屋（由中间往外建）
    const nH = 10;
    for (let i = 0; i < nH; i++) {
      GEO.houses.push({ f: (i + 0.2 + R() * 0.6) / nH, w: 0.9 + R() * 0.8, h: 0.75 + R() * 0.6 + (i === 4 ? 0.9 : 0), door: (R() - 0.5) * 0.5,
        tone: R() < 0.5 ? 1 : 0, win: R() < 0.7, ord: 0 });
    }
    GEO.houses.map((hs, i) => [Math.abs(hs.f - 0.45) + R() * 0.08, i]).sort((a, b) => a[0] - b[0]).forEach((o, k) => { GEO.houses[o[1]].ord = k; });
    // 亚伯倒下之处的白花
    for (let i = 0; i < 7; i++) GEO.flowers.push({ dx: (R() - 0.5) * 1.3, v: 0.01 + R() * 0.07, h: 0.18 + R() * 0.16, c: R() < 0.7 ? [246, 241, 231] : [244, 222, 150], t: R() * 0.5 });
    // 地开了口：一道参差的裂缝
    for (let i = 0; i <= 10; i++) GEO.crack.push([i / 10 - 0.5, (R() - 0.5) * (i % 2 ? 1 : 0.4)]);
  }

  // ── 预渲染的光 / 暗 / 烟 ────────────────────────────────────
  const SPR = {}, BEAM = {};
  function sprite(key) {
    if (SPR[key]) return SPR[key];
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const col = GLOW[key] || [255, 255, 255];
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(col, 1));
    gr.addColorStop(0.38, rgba(col, 0.5));
    gr.addColorStop(0.7, rgba(col, 0.14));
    gr.addColorStop(1, rgba(col, 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    SPR[key] = c;
    return c;
  }
  function glow(ctx, key, x, y, rx, ry, a) {
    if (!(a > 0.004) || !(rx > 0.5) || !(ry > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sprite(key), x - rx, y - ry, rx * 2, ry * 2);
    ctx.globalAlpha = 1;
  }
  // 自天而降的光柱（横向高斯、下端更亮）
  function beamSprite(key) {
    if (BEAM[key]) return BEAM[key];
    const c = document.createElement('canvas');
    c.width = 32; c.height = 128;
    const g = c.getContext('2d');
    const img = g.createImageData(32, 128), col = GLOW[key] || [255, 255, 255];
    for (let y = 0; y < 128; y++) {
      const ver = 0.25 + 0.75 * Math.pow(y / 127, 1.4);
      for (let x = 0; x < 32; x++) {
        const dx = (x + 0.5) / 16 - 1, i = (y * 32 + x) * 4;
        img.data[i] = col[0]; img.data[i + 1] = col[1]; img.data[i + 2] = col[2];
        img.data[i + 3] = Math.round(255 * Math.exp(-dx * dx * 5) * ver);
      }
    }
    g.putImageData(img, 0, 0);
    BEAM[key] = c;
    return c;
  }
  function beam(ctx, key, x, y0, y1, w, a) {
    if (!(a > 0.004) || !(y1 - y0 > 1) || !(w > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(beamSprite(key), x - w / 2, y0, w, y1 - y0);
    ctx.globalAlpha = 1;
  }
  // 迎光一侧的描边（日、月，夜里灵是唯一的灯）
  function lightSide(x) {
    if (W.daylight > 0.25) return W.core.x < x ? -1 : 1;
    if (W.moon.vis > 0.3 && W.moon.elev > 0) return W.moon.x < x ? -1 : 1;
    return W.spirit.x < x ? -1 : 1;
  }
  const rimA = () => clamp(0.22 + 0.55 * W.dusk + 0.3 * W.daylight, 0, 0.85);

  // ── 瞬时的微光（只为画：血的声音、琴声、炉火的火星、求告时升起的光尘）──
  const MOTES = [];
  const MAXM = 260;
  let shadowX = null;       // 罪的暗影（平滑后的位置，像素）——只为画
  function mote(p) { if (MOTES.length < MAXM) MOTES.push(p); }
  let bloodAcc = 0, callAcc = 0, forgeAcc = 0, noteT = 0, buildT = 0;
  function stepMotes(dt) {
    const q = W.quality || 1;
    // 血的声音：红金色的微光从地里升起
    const bl = LV.cainBlood;
    if (bl > 0.02) {
      bloodAcc += dt * 16 * bl * q;
      const x = at(SPOT.fall) * W.w, y = gY(x), h = hNear();
      while (bloodAcc >= 1) {
        bloodAcc -= 1;
        mote({ k: 'blood', x: x + rnd(-0.45, 0.45) * h, y: y - rnd(0, 2), vx: rnd(-4, 4) * P.s, vy: -rnd(12, 30) * P.s, life: 0, max: rnd(3, 6.5), s: rnd(0.7, 1.7) * Math.max(0.75, P.s), ph: rnd(0, TAU), pass: 'air' });
      }
    }
    // 求告耶和华的名：光尘自跪着的人中间升起
    const cl = LV.cainCall;
    if (cl > 0.05) {
      callAcc += dt * 12 * cl * q;
      const x = at(SPOT.altarA) * W.w, y = gY(x), h = hNear();
      while (callAcc >= 1) {
        callAcc -= 1;
        mote({ k: 'call', x: x + rnd(-2.6, 2.6) * h, y: y - rnd(0.2, 0.8) * h, vx: 0, vy: -rnd(10, 26) * P.s, life: 0, max: rnd(3, 5.5), s: rnd(0.6, 1.4) * Math.max(0.75, P.s), ph: rnd(0, TAU), pass: 'air' });
      }
    }
    // 土八该隐的炉火：火星
    const ar = LV.cainArts;
    if (ar > 0.3) {
      forgeAcc += dt * 5 * ar * q;
      const hm = hMid(), x = atM(SPOT.city0 + 0.14 * (SPOT.city1 - SPOT.city0)) * W.w, y = gY(x, 1) - hm * 0.3;
      while (forgeAcc >= 1) {
        forgeAcc -= 1;
        mote({ k: 'spark', x: x + rnd(-0.3, 0.3) * hm, y, vx: rnd(-10, 10) * P.s, vy: -rnd(14, 34) * P.s, life: 0, max: rnd(0.6, 1.4), s: rnd(0.5, 1.1), ph: 0, pass: 'mid' });
      }
      // 犹八的琴声：几粒金色的音从城中飘起
      noteT -= dt;
      if (noteT <= 0) {
        noteT = rnd(1.6, 3.4);
        const cx = atM(lerp(SPOT.city0, SPOT.city1, rnd(0.3, 0.8))) * W.w, cy = gY(cx, 1) - hm * 0.9;
        for (let i = 0; i < 3; i++) mote({ k: 'note', x: cx + i * hm * 0.25, y: cy - i * hm * 0.12, vx: rnd(3, 8) * P.s, vy: -rnd(5, 10) * P.s, life: -i * 0.35, max: rnd(2.5, 3.5), s: rnd(0.7, 1.1), ph: rnd(0, TAU), pass: 'mid' });
      }
      // 敲打铜铁之声
      buildT -= dt;
      if (buildT <= 0) { buildT = rnd(6, 11); sfx('build', null, { soft: true, far: true }); }
    }
    for (let i = MOTES.length - 1; i >= 0; i--) {
      const m = MOTES[i];
      m.life += dt;
      if (m.life < 0) continue;
      if (m.life >= m.max) { MOTES.splice(i, 1); continue; }
      m.x += (m.vx + Math.sin(W.t * 1.3 + m.ph) * 4 * P.s) * dt;
      m.y += m.vy * dt;
      if (m.k === 'spark') m.vy += 40 * dt;
    }
  }
  function drawMotes(ctx, pass) {
    if (!MOTES.length) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < MOTES.length; i++) {
      const m = MOTES[i];
      if (m.pass !== pass || m.life < 0) continue;
      const u = m.life / m.max;
      let c, a;
      if (m.k === 'blood') { c = mix([255, 90, 56], [255, 214, 150], u); a = Math.sin(u * Math.PI) * 0.8; }
      else if (m.k === 'call') { c = mix([255, 236, 196], [255, 250, 236], u); a = Math.sin(u * Math.PI) * 0.7; }
      else if (m.k === 'spark') { c = mix([255, 210, 120], [255, 110, 40], u); a = (1 - u) * 0.9; }
      else { c = [255, 226, 160]; a = Math.sin(u * Math.PI) * 0.55; }
      a *= 0.75 + 0.25 * Math.sin(W.t * 7 + m.ph);
      if (a < 0.02) continue;
      ctx.fillStyle = rgba(c, a);
      const s = m.s;
      if (m.k === 'note') {                                   // 音：一点与一道小尾
        ctx.fillRect(m.x - s, m.y - s, s * 2, s * 2);
        ctx.fillRect(m.x + s - 0.4, m.y - s * 4, 0.8, s * 3.4);
      } else ctx.fillRect(m.x - s, m.y - s, s * 2, s * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景：近岸
  // ════════════════════════════════════════════════════════════
  // 园外的地：比园中更硬、更暗
  function drawHardGround(ctx) {
    const x0 = P.L0 * W.w, n = 40;
    const c = W.shade([50, 38, 28], 0);
    const grd = ctx.createLinearGradient(x0, 0, W.w, 0);
    grd.addColorStop(0, rgba(c, 0));
    grd.addColorStop(0.1, rgba(c, 0.2));
    grd.addColorStop(0.6, rgba(c, 0.14));
    grd.addColorStop(1, rgba(c, 0.1));
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(x0, W.h + 2);
    for (let i = 0; i <= n; i++) { const x = lerp(x0, W.w, i / n); ctx.lineTo(x, gY(x) + 0.6); }
    ctx.lineTo(W.w + 2, gY(W.w) + 0.6);
    ctx.lineTo(W.w + 2, W.h + 2);
    ctx.closePath();
    ctx.fill();
  }

  // 荆棘：弯曲的枝与刺
  function drawThornSet(ctx, arr, grow) {
    if (grow <= 0.01 || !arr.length) return;
    const h = hNear();
    const stem = W.shadeCSS(THORN, 0, null, 0.04), rim = W.shadeCSS([255, 214, 170], 0, null, 0.35);
    const ra = rimA();
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      if (pass === 0 && ra < 0.05) continue;
      ctx.beginPath();
      for (const bu of arr) {
        const g = clamp((grow - bu.stems[0].th * 0.5) * 1.6, 0, 1);
        if (g <= 0.01) continue;
        const x = at(bu.f) * W.w, y = fY(x, bu.v) + 0.5;
        const ox = pass === 0 ? lightSide(x) * 0.8 : 0, oy = pass === 0 ? -0.8 : 0;
        for (const s of bu.stems) {
          const L = s.l * h * U.easeOut(g);
          const tx = x + Math.sin(s.a) * L, ty = y - Math.cos(s.a) * L;
          const cx = x + Math.sin(s.a + s.b) * L * 0.55, cy = y - Math.cos(s.a + s.b) * L * 0.55;
          ctx.moveTo(x + ox, y + oy);
          ctx.quadraticCurveTo(cx + ox, cy + oy, tx + ox, ty + oy);
          if (pass === 1 && g > 0.4) {
            // 刺
            for (const k of [0.35, 0.6, 0.85]) {
              const px = (1 - k) * (1 - k) * x + 2 * (1 - k) * k * cx + k * k * tx, py = (1 - k) * (1 - k) * y + 2 * (1 - k) * k * cy + k * k * ty;
              const sp = h * 0.07, sa = s.a + (k > 0.5 ? 1.2 : -1.2);
              ctx.moveTo(px, py);
              ctx.lineTo(px + Math.sin(sa) * sp, py - Math.cos(sa) * sp);
            }
          }
        }
      }
      if (pass === 0) { ctx.strokeStyle = rim; ctx.globalAlpha = ra * 0.6; ctx.lineWidth = Math.max(0.6, 0.9 * P.s); }
      else { ctx.strokeStyle = stem; ctx.globalAlpha = 1; ctx.lineWidth = Math.max(0.8, 1.25 * P.s); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 该隐的田：犁沟一行行，庄稼长起；受咒诅后枯槁、倒伏
  function drawField(ctx) {
    const f = LV.cainField;
    if (f <= 0.002) return;
    const wi = LV.cainWither;
    const x0 = at(SPOT.field0) * W.w, x1 = at(SPOT.field1) * W.w;
    const soil = W.shade(mix(SOIL, SOIL_DRY, wi), 0), furrow = W.shade(mix([58, 40, 26], [70, 60, 50], wi), 0);
    const plough = smoothstep(0, 0.35, f);
    const n = 28, R = GEO.rows;
    const vs = [];
    for (let r = 0; r <= R; r++) vs.push(FIELD_V * Math.pow(r / R, 1.3));
    for (let r = 0; r < R; r++) {
      // 犁开的地只到当前的进度（自右向左，一行一行）
      const reach = clamp(plough * 1.25 - r * 0.04, 0, 1);
      if (reach <= 0) continue;
      const xa = lerp(x1, x0, reach);
      const grd = ctx.createLinearGradient(x0, 0, x1, 0);
      const a = (r % 2 ? 0.62 : 0.8) * (1 - 0.45 * (r / R));
      const col = r % 2 ? furrow : soil;
      grd.addColorStop(0, rgba(col, 0));
      grd.addColorStop(0.07, rgba(col, a));
      grd.addColorStop(0.93, rgba(col, a));
      grd.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = lerp(xa, x1, i / n); const y = fY(x, vs[r]) + (r === 0 ? 0.5 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let i = n; i >= 0; i--) { const x = lerp(xa, x1, i / n); ctx.lineTo(x, fY(x, vs[r + 1])); }
      ctx.closePath();
      ctx.fill();
    }
    // 庄稼
    const grow = smoothstep(0.35, 1, f);
    if (grow <= 0.01) return;
    const h = hNear(), sway = W.wind * 0.12;
    const stalkC = W.shadeCSS(mix(GRAIN, DEAD, wi), 0, null, 0.02), headC = W.shadeCSS(mix(RIPE, DEAD, wi), 0, null, 0.08);
    const rimC = W.shadeCSS([255, 226, 170], 0, null, 0.4);
    ctx.lineCap = 'round';
    const heads = [];
    ctx.beginPath();
    for (const s of GEO.stalks) {
      const x = lerp(x0, x1, s.f);
      const v = (vs[s.r] + vs[s.r + 1]) * 0.5;
      const y = fY(x, v);
      const depthK = 1 + 1.4 * v;
      const edge = smoothstep(0, 0.08, s.f) * smoothstep(1, 0.92, s.f);
      const dead = wi * (0.55 + 0.45 * s.dead);
      const H = h * 0.3 * s.h * depthK * grow * edge * (1 - 0.45 * dead);
      if (H < 0.6) continue;
      const bend = s.lean + sway * Math.sin(W.t * 1.6 + s.ph) + dead * (s.lean >= 0 ? 1.1 : -1.1);
      const tx = x + Math.sin(bend) * H, ty = y - Math.cos(bend) * H;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.sin(bend) * H * 0.2, y - H * 0.6, tx, ty);
      if (grow > 0.55) heads.push(tx, ty, bend, depthK);
    }
    ctx.strokeStyle = stalkC;
    ctx.lineWidth = Math.max(0.6, 0.85 * P.s);
    ctx.stroke();
    if (heads.length) {
      const hl = h * 0.075;
      ctx.beginPath();
      for (let i = 0; i < heads.length; i += 4) {
        const tx = heads[i], ty = heads[i + 1], b = heads[i + 2], k = heads[i + 3];
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + Math.sin(b + 0.15) * hl * k, ty - Math.cos(b + 0.15) * hl * k);
      }
      ctx.strokeStyle = headC;
      ctx.lineWidth = Math.max(1.2, 2.0 * P.s);
      ctx.stroke();
      const ra = rimA() * (1 - wi * 0.6);
      if (ra > 0.05) { ctx.strokeStyle = rimC; ctx.globalAlpha = ra * 0.45; ctx.lineWidth = Math.max(0.5, 0.7 * P.s); ctx.stroke(); ctx.globalAlpha = 1; }
    }
  }

  // 石坛：粗石垒成（石头一块一块落下）
  const STONES = [[-0.36, 0.17, 0.18, 0.18], [-0.12, 0.16, 0.17, 0.17], [0.13, 0.17, 0.18, 0.17], [0.37, 0.16, 0.16, 0.16],
    [-0.24, 0.46, 0.18, 0.15], [0.01, 0.47, 0.19, 0.15], [0.25, 0.46, 0.17, 0.15], [-0.13, 0.74, 0.21, 0.13], [0.14, 0.74, 0.2, 0.13]];
  const altarDims = () => { const h = hNear(); return { w: h * 0.95, h: h * 0.52 }; };
  function altarTop(which) {
    const x = at(which === 'A' ? SPOT.altarA : SPOT.altarC) * W.w;
    return [x, gY(x) - altarDims().h * 0.86];
  }
  function drawAltar(ctx, fx0, tone) {
    const al = LV.cainAltar;
    if (al <= 0.01) return;
    const x = at(fx0) * W.w, y = gY(x) + 1, D = altarDims();
    const n = STONES.length, side0 = lightSide(x);
    ctx.fillStyle = 'rgba(8,10,16,0.22)';
    ctx.beginPath(); ctx.ellipse(x, y + 0.5, D.w * 0.62, Math.max(1, D.h * 0.1), 0, 0, TAU); ctx.fill();
    const ra = rimA();
    for (let i = 0; i < n; i++) {
      const g = clamp(al * n - i, 0, 1);
      if (g <= 0) continue;
      const s = STONES[i];
      const sx = x + s[0] * D.w, sy = y - s[1] * D.h - (1 - U.easeOut(g)) * D.h * 0.5;
      const rx = s[2] * D.w, ry = s[3] * D.h * 1.9;
      const k = (i * 37 % 5) / 5 - 0.4;
      ctx.globalAlpha = g;
      ctx.fillStyle = W.shadeCSS(mix(STONE, tone, 0.25).map(c => c + k * 22), 0);
      ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, TAU); ctx.fill();
      if (ra > 0.05) {
        ctx.strokeStyle = W.shadeCSS([255, 232, 200], 0, null, 0.3);
        ctx.globalAlpha = g * ra * 0.7;
        ctx.lineWidth = Math.max(0.6, 0.8 * P.s);
        ctx.beginPath();
        ctx.ellipse(sx, sy, rx, ry, 0, side0 < 0 ? Math.PI * 1.05 : Math.PI * 1.55, side0 < 0 ? Math.PI * 1.5 : Math.PI * 1.95);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  // 坛上的火
  function drawFire(ctx, x, y, h, a, seed) {
    if (a <= 0.01) return;
    const t = W.t + seed;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'fire', x, y - h * 0.3, h * 2.4, h * 1.7, 0.32 * a * (0.85 + 0.15 * Math.sin(t * 9.1)) * (0.6 + 0.6 * (1 - W.daylight)));
    for (let k = 0; k < 3; k++) {
      const ph = t * (4.6 + k * 1.3) + k * 2.1;
      const fh = h * (0.72 + 0.22 * Math.sin(ph) + 0.1 * Math.sin(ph * 2.3)) * (k === 1 ? 1 : 0.68) * Math.min(1, a * 1.3);
      const bx = x + (k - 1) * h * 0.2, sw = Math.sin(ph * 0.8) * h * 0.08;
      ctx.fillStyle = k === 1 ? rgba([255, 222, 150], 0.85 * a) : rgba([255, 140, 60], 0.75 * a);
      ctx.beginPath();
      ctx.moveTo(bx - h * 0.15, y);
      ctx.quadraticCurveTo(bx - h * 0.13, y - fh * 0.55, bx + sw, y - fh);
      ctx.quadraticCurveTo(bx + h * 0.13, y - fh * 0.55, bx + h * 0.15, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 烟：亚伯的笔直上升、发光；该隐的压下来，贴着地爬开
  function drawSmoke(ctx, x, y, amt, acc, abel, seed) {
    if (amt < 0.02) return;
    const N = ((W.quality || 1) < 0.75 ? 10 : 16) + (abel ? Math.round(14 * acc) : 0);
    const H0 = W.h * 0.17, H1 = W.h * (abel ? 0.5 : 0.05);
    const lit = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const u = U.fract(W.t * 0.075 + i / N + seed);
      const fade = Math.pow(Math.sin(u * Math.PI), 0.8) * amt;
      let r = lerp(3, 17, u) * Math.max(0.6, P.s);
      const nx = x + Math.sin(u * 4 + i * 1.3 + W.t * 0.3) * u * 8 * P.s + W.wind * u * u * 34 * P.s;
      const ny = y - u * H0;
      if (abel) {
        const px = lerp(nx, x + Math.sin(u * 6 + W.t * 0.8) * 1.4 * P.s, acc), py = lerp(ny, y - u * H1, acc);
        const rr = r * lerp(1, 0.7, acc);
        glow(ctx, 'smoke', px, py, rr, rr * 0.9, fade * 0.3 * (1 - acc) * lit);
        if (acc > 0.02) {
          ctx.globalCompositeOperation = 'lighter';
          glow(ctx, 'gold', px, py, rr * 1.2, rr * 1.1, fade * 0.42 * acc);
          ctx.globalCompositeOperation = 'source-over';
        }
      } else {
        const rx = x + u * W.w * 0.09 + Math.sin(u * 5 + i) * 3 * P.s;
        const bump = Math.sin(clamp(u / 0.28, 0, 1) * Math.PI / 2);
        const low = smoothstep(0.25, 0.7, u);
        const ry = lerp(y - H1 * bump, gY(rx) - r * 0.3, low);
        const px = lerp(nx, rx, acc), py = lerp(ny, ry, acc);
        r *= lerp(1, 1.3, acc);
        const flat = lerp(0.9, 0.5, acc * low);
        glow(ctx, 'smoke', px, py, r, r * flat, fade * 0.3 * (1 - acc) * lit);
        glow(ctx, 'ash', px, py, r, r * flat, fade * 0.55 * acc * (0.55 + 0.45 * lit));
      }
    }
  }

  // 帐棚（亚当的家）
  function drawTent(ctx) {
    const x = at(SPOT.tent) * W.w, y = gY(x) + 1, h = hNear();
    const w = h * 1.02, H = h * 1.12;
    const ls = lightSide(x);
    ctx.fillStyle = 'rgba(8,10,16,0.2)';
    ctx.beginPath(); ctx.ellipse(x, y + 0.5, w * 1.1, Math.max(1, h * 0.05), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = W.shadeCSS(TENT, 0);
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.42, y - H * 0.5, x - w * 0.06, y - H);
    ctx.lineTo(x + w * 0.06, y - H);
    ctx.quadraticCurveTo(x + w * 0.42, y - H * 0.5, x + w, y);
    ctx.closePath();
    ctx.fill();
    // 背光的一面
    ctx.fillStyle = W.shadeCSS(mix(TENT, [30, 22, 16], 0.4), 0, 0.55);
    ctx.beginPath();
    const sx = -ls;
    ctx.moveTo(x + sx * w * 0.06, y - H);
    ctx.quadraticCurveTo(x + sx * w * 0.42, y - H * 0.5, x + sx * w, y);
    ctx.lineTo(x + sx * w * 0.3, y);
    ctx.closePath();
    ctx.fill();
    // 门
    ctx.fillStyle = W.shadeCSS([38, 28, 22], 0);
    ctx.beginPath(); ctx.moveTo(x - w * 0.28, y); ctx.lineTo(x - w * 0.05, y - H * 0.64); ctx.lineTo(x + w * 0.14, y); ctx.closePath(); ctx.fill();
    // 杆与绳
    ctx.strokeStyle = W.shadeCSS([66, 50, 36], 0);
    ctx.lineWidth = Math.max(1, h * 0.035);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.03, y - H); ctx.lineTo(x - w * 0.15, y - H * 1.2);
    ctx.moveTo(x + w * 0.03, y - H); ctx.lineTo(x + w * 0.16, y - H * 1.17);
    ctx.stroke();
    ctx.lineWidth = Math.max(0.5, h * 0.012);
    ctx.beginPath(); ctx.moveTo(x - w * 0.5, y - H * 0.66); ctx.lineTo(x - w * 1.45, y); ctx.stroke();
    // 迎光的边
    const ra = rimA();
    if (ra > 0.05) {
      ctx.strokeStyle = W.shadeCSS([255, 226, 186], 0, null, 0.3);
      ctx.globalAlpha = ra * 0.8;
      ctx.lineWidth = Math.max(0.7, 1 * P.s);
      ctx.beginPath();
      ctx.moveTo(x + ls * w * 0.06, y - H);
      ctx.quadraticCurveTo(x + ls * w * 0.42, y - H * 0.5, x + ls * w, y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // 夜里门口一盏小灯
    const nt = W.night + W.dusk * 0.4;
    if (nt > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'warm', x - w * 0.05, y - H * 0.25, h * 0.8, h * 0.5, 0.28 * nt * (0.9 + 0.1 * Math.sin(W.t * 5.3)));
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // 坟上的石堆
  const CAIRN = [[-0.2, 0.07, 0.12, 0.075], [0, 0.065, 0.13, 0.08], [0.19, 0.065, 0.11, 0.07], [-0.09, 0.17, 0.11, 0.07], [0.09, 0.17, 0.1, 0.065], [0, 0.26, 0.08, 0.06]];
  function drawCairns(ctx) {
    if (!S.cairns.length) return;
    const h = hNear(), ra = rimA();
    for (const c of S.cairns) {
      const k = clamp(since(c.t0) / 2.5, 0, 1);
      if (k <= 0) continue;
      const x = c.x * W.w, y = gY(x) + 1, ls = lightSide(x);
      CAIRN.forEach((s, i) => {
        const g = clamp(k * CAIRN.length - i, 0, 1);
        if (g <= 0) return;
        const sx = x + s[0] * h, sy = y - s[1] * h, rx = s[2] * h, ry = s[3] * h;
        ctx.globalAlpha = g;
        ctx.fillStyle = W.shadeCSS(STONE.map(v => v - 18 + (i % 3) * 10), 0);
        ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, 0, TAU); ctx.fill();
        if (ra > 0.05) {
          ctx.strokeStyle = W.shadeCSS([255, 232, 200], 0, null, 0.3);
          ctx.globalAlpha = g * ra * 0.6;
          ctx.lineWidth = Math.max(0.5, 0.7 * P.s);
          ctx.beginPath(); ctx.ellipse(sx, sy, rx, ry, 0, ls < 0 ? Math.PI * 1.05 : Math.PI * 1.55, ls < 0 ? Math.PI * 1.5 : Math.PI * 1.95); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
    }
  }

  // 亚伯倒下之处开出的白花（塞特之后）
  function drawBloom(ctx) {
    const f = LV.cainBloom;
    if (f <= 0.01) return;
    const x0 = at(SPOT.fall) * W.w, h = hNear();
    const stem = W.shadeCSS([74, 104, 58], 0);
    ctx.lineCap = 'round';
    for (const fl of GEO.flowers) {
      const g = clamp((f - fl.t) / (1 - fl.t) * 1.2, 0, 1);
      if (g <= 0.01) continue;
      const x = x0 + fl.dx * h * 0.6, y = fY(x, fl.v), H = fl.h * h * U.easeOut(g);
      ctx.strokeStyle = stem;
      ctx.lineWidth = Math.max(0.6, 0.8 * P.s);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + H * 0.15, y - H * 0.5, x + H * 0.05, y - H); ctx.stroke();
      const r = Math.max(1, h * 0.045) * g;
      ctx.fillStyle = W.shadeCSS(fl.c, 0, null, 0.25);
      for (let k = 0; k < 5; k++) {
        const a = k / 5 * TAU + fl.dx;
        ctx.beginPath(); ctx.arc(x + H * 0.05 + Math.cos(a) * r, y - H + Math.sin(a) * r * 0.8, r * 0.75, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = W.shadeCSS([240, 200, 90], 0, null, 0.2);
      ctx.beginPath(); ctx.arc(x + H * 0.05, y - H, r * 0.45, 0, TAU); ctx.fill();
    }
    // 夜里它们微微发光
    const nt = W.night;
    if (nt > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'pale', x0, fY(x0, 0.04) - h * 0.15, h * 0.9, h * 0.35, 0.18 * nt * f);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // 地开了口：一道参差的红金色裂缝（亚伯被接去的地方）
  function drawCrack(ctx) {
    const g = LV.cainGround;
    if (g < 0.01) return;
    const x = at(SPOT.fall) * W.w, y = fY(x, 0.035), h = hNear();
    const w = h * 1.1 * U.easeOut(clamp(g, 0, 1));
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'blood', x, y, w * 0.9, h * 0.14, 0.35 * g);
    ctx.strokeStyle = rgba([255, 168, 110], 0.65 * g);
    ctx.lineWidth = Math.max(0.8, 1.2 * P.s);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    GEO.crack.forEach((c, i) => { const px = x + c[0] * w, py = y + c[1] * h * 0.05 * g; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  // 罪伏在门前：一团蹲伏的暗影，伏在该隐身后，头向着他（不画面目；只是暗，像烟）
  const SHB = [[-0.42, 0.1, 0.24], [-0.18, 0.18, 0.3], [0.08, 0.2, 0.3], [0.34, 0.2, 0.24], [0.5, 0.28, 0.18], [0.0, 0.06, 0.4]];
  function drawSin(ctx) {
    const a = LV.cainShadow;
    if (a < 0.01 || shadowX == null) return;
    const b = body('cain');
    if (!b) return;
    const dir = Math.sign(b.x - shadowX) || 1;
    const k = (1 + 1.5 * LV.cainDark) * U.easeOut(clamp(a, 0, 1));
    const w = b.h * 1.3 * k, gy = gY(shadowX) + 1;
    const br = Math.sin(W.t * 1.1) * 0.025, lean = Math.sin(W.t * 0.45) * 0.03;
    // 周围的暗雾
    for (let i = 0; i < SHB.length; i++) {
      const s = SHB[i], wob = Math.sin(W.t * (0.7 + i * 0.13) + i * 1.9);
      glow(ctx, 'dark', shadowX + dir * (s[0] + 0.04 * wob) * w, gy - s[1] * w, s[2] * w * 1.5, s[2] * w * 1.1, 0.32 * a);
    }
    // 蹲伏的形：低低的背，抬起的头向着他
    ctx.save();
    ctx.translate(shadowX, gy);
    ctx.scale(dir * w, w);
    ctx.beginPath();
    ctx.moveTo(-0.56, 0.02);
    ctx.bezierCurveTo(-0.52, -0.16, -0.32, -(0.33 + br), -0.06, -(0.32 + br));
    ctx.bezierCurveTo(0.12, -(0.31 + br), 0.2, -0.22, 0.28 + lean, -0.25);
    ctx.bezierCurveTo(0.34 + lean, -0.35, 0.46 + lean, -0.37, 0.52 + lean, -0.29);
    ctx.bezierCurveTo(0.57 + lean, -0.21, 0.55, -0.12, 0.6, -0.05);
    ctx.lineTo(0.68, 0.02);
    ctx.closePath();
    ctx.fillStyle = rgba([7, 5, 11], 0.7 * a);
    ctx.fill();
    // 夜里一道冷暗的边，免得它在黑暗里完全看不见
    ctx.strokeStyle = rgba([120, 80, 110], (0.1 + 0.25 * W.night) * a);
    ctx.lineWidth = 1.2 / w;
    ctx.stroke();
    ctx.restore();
    // 自背上升起的暗缕
    for (let i = 0; i < 6; i++) {
      const u = U.fract(W.t * 0.22 + i / 6);
      const px = shadowX + dir * (-0.4 + i * 0.16 + Math.sin(u * 4 + i) * 0.05) * w, py = gy - (0.26 + u * 0.55) * w;
      glow(ctx, 'dark', px, py, (0.07 + u * 0.1) * w, (0.07 + u * 0.1) * w, 0.45 * a * Math.sin(u * Math.PI));
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'blood', shadowX + dir * 0.2 * w, gy - 0.05 * w, w * 0.8, w * 0.2, 0.06 * a * (0.4 + W.night));
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景：中丘（挪得之地的以诺城；西边远处伊甸东门的一点火焰）
  // ════════════════════════════════════════════════════════════
  function drawCity(ctx) {
    const c = LV.cainCity, ar = LV.cainArts;
    if (c < 0.01 && ar < 0.01) return;
    const hm = hMid(), depth = W.LAYERS[1].depth;
    const x0 = atM(SPOT.city0) * W.w, x1 = atM(SPOT.city1) * W.w;
    const nH = GEO.houses.length, ls = lightSide((x0 + x1) / 2), ra = rimA();
    const wallA = W.shadeCSS(MUD, depth), wallB = W.shadeCSS(mix(MUD, [60, 44, 32], 0.25), depth);
    const shade = W.shadeCSS(mix(MUD, [30, 22, 18], 0.5), depth), door = W.shadeCSS([40, 30, 24], depth);
    const rim = W.shadeCSS([255, 230, 196], depth, null, 0.3);
    const nt = W.night + W.dusk * 0.3;
    // 城墙
    if (c > 0.5) {
      const g = smoothstep(0.5, 0.9, c), n = 16, wh = hm * 0.34 * g;
      ctx.fillStyle = wallB;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = lerp(x0 - hm * 0.4, x1 + hm * 0.4, i / n); const y = gY(x, 1) - wh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      for (let i = n; i >= 0; i--) { const x = lerp(x0 - hm * 0.4, x1 + hm * 0.4, i / n); ctx.lineTo(x, gY(x, 1) + hm * 0.2); }
      ctx.closePath();
      ctx.fill();
    }
    const lights = [];
    for (const hs of GEO.houses) {
      const g = clamp(c * nH - hs.ord, 0, 1);
      if (g <= 0) continue;
      const hx = lerp(x0, x1, hs.f), gy = gY(hx, 1) + hm * 0.2;
      const ww = hs.w * hm, hh = hs.h * hm * U.easeOut(g) + hm * 0.2;
      const L = hx - ww / 2, top = gy - hh;
      ctx.fillStyle = hs.tone ? wallA : wallB;
      ctx.fillRect(L, top, ww, hh);
      ctx.fillStyle = shade;                                      // 背光的一面
      if (ls > 0) ctx.fillRect(L, top, ww * 0.22, hh); else ctx.fillRect(L + ww * 0.78, top, ww * 0.22, hh);
      const pw = Math.max(1, hm * 0.06);
      ctx.fillStyle = wallB;
      ctx.fillRect(L - pw * 0.5, top - pw, ww + pw, pw);          // 屋顶的矮墙
      if (g > 0.9) {
        ctx.fillStyle = door;
        ctx.fillRect(hx + hs.door * ww - hm * 0.09, gy - hm * 0.2 - hm * 0.36, hm * 0.18, hm * 0.36);
        if (hs.win && hh > hm * 0.9) lights.push(hx - hs.door * ww * 0.8, top + hh * 0.35);
      }
      if (ra > 0.05) {
        ctx.fillStyle = rim;
        ctx.globalAlpha = ra * 0.7;
        ctx.fillRect(L - pw * 0.5, top - pw, ww + pw, Math.max(0.6, pw * 0.5));
        ctx.fillRect(ls > 0 ? L + ww - 0.8 : L, top, 0.8, hh);
        ctx.globalAlpha = 1;
      }
    }
    // 雅八：住帐棚、牧养牲畜
    if (ar > 0.01) {
      const tentC = W.shadeCSS([74, 58, 48], depth), tentD = W.shadeCSS([34, 26, 22], depth);
      for (const f of [0.24, 0.285, 0.33]) {
        const x = atM(f) * W.w, y = gY(x, 1) + 1, w = hm * 0.62 * ar, H = hm * 0.78 * ar;
        ctx.fillStyle = tentC;
        ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.4, y - H * 0.55, x, y - H); ctx.quadraticCurveTo(x + w * 0.4, y - H * 0.55, x + w, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = tentD;
        ctx.beginPath(); ctx.moveTo(x - w * 0.22, y); ctx.lineTo(x, y - H * 0.55); ctx.lineTo(x + w * 0.18, y); ctx.closePath(); ctx.fill();
      }
    }
    // 窗里的灯、土八该隐的炉火
    ctx.globalCompositeOperation = 'lighter';
    if (nt > 0.05 && c > 0.6) {
      const s = Math.max(0.8, hm * 0.08);
      for (let i = 0; i < lights.length; i += 2) {
        ctx.fillStyle = rgba([255, 206, 130], 0.75 * nt);
        ctx.fillRect(lights[i] - s, lights[i + 1] - s, s * 2, s * 2);
        glow(ctx, 'warm', lights[i], lights[i + 1], hm * 0.5, hm * 0.4, 0.25 * nt);
      }
    }
    if (ar > 0.05) {
      const fx0 = atM(SPOT.city0 + 0.14 * (SPOT.city1 - SPOT.city0)) * W.w, fy0 = gY(fx0, 1) - hm * 0.25;
      const fl = 0.8 + 0.2 * Math.sin(W.t * 11) * Math.sin(W.t * 6.7 + 1);
      glow(ctx, 'fire', fx0, fy0, hm * 1.3, hm * 0.9, 0.45 * ar * fl * (0.5 + 0.5 * (1 - W.daylight)));
      glow(ctx, 'warm', fx0, fy0, hm * 0.35, hm * 0.3, 0.7 * ar * fl);
    }
    ctx.globalCompositeOperation = 'source-over';
    // 城中两缕炊烟
    if (c > 0.7) {
      const lit = 0.3 + 0.7 * W.daylight;
      for (const [f, sd] of [[0.3, 0.1], [0.72, 0.55]]) {
        const x = lerp(x0, x1, f), y = gY(x, 1) - hm * 1.2;
        for (let i = 0; i < 7; i++) {
          const u = U.fract(W.t * 0.06 + i / 7 + sd);
          const r = lerp(1.5, 6, u) * Math.max(0.6, P.s);
          glow(ctx, 'smoke', x + W.wind * u * u * 20 * P.s + Math.sin(u * 5 + i) * 2, y - u * hm * 3, r, r * 0.9, Math.sin(u * Math.PI) * 0.22 * lit * (c - 0.7) / 0.3);
        }
      }
    }
  }

  // 伊甸东门：西边（右）远处丘陵上那一点四面转动的火焰
  function drawEdenGate(ctx) {
    const x = W.w * 0.992, y = gY(x, 1) - hMid() * 0.55;
    if (!(y < W.waterlineY(1))) return;
    const f = 0.8 + 0.2 * Math.sin(W.t * 13) * Math.sin(W.t * 7.3 + 2);
    const a = (0.1 + 0.4 * W.night + 0.25 * W.dusk) * f;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'fire', x, y, hMid() * 0.9, hMid() * 0.9, a * 0.55);
    glow(ctx, 'warm', x, y, hMid() * 0.18, hMid() * 0.3, a);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  光与暗（air / top）
  // ════════════════════════════════════════════════════════════
  // 耶和华看中了亚伯和他的供物：一道光自天而降，接住那烟
  function drawAccept(ctx) {
    const a = LV.cainAccept;
    if (a < 0.01) return;
    const [x, y] = altarTop('A'), h = hNear();
    const k = clamp(since(S.acceptT0) / 2.4, 0, 1), e = U.easeOut(k);
    const settle = clamp((since(S.acceptT0) - 3) / 9, 0, 1);
    const al = a * 0.55 * (1 - U.easeInOut(settle)) * (0.9 + 0.1 * Math.sin(W.t * 1.3));
    if (al < 0.004) return;
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, 'gold', x, -4, lerp(0, y, e), h * 1.6, al);
    glow(ctx, 'gold', x, y, h * 1.2, h * 0.7, al * 0.9 * e);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 寻找的光：一道淡光走过田野，停在亚伯身上
  function drawSearch(ctx) {
    const a = LV.cainSearch;
    if (a < 0.01) return;
    const u = clamp(since(S.searchT0) / 9, 0, 1), e = U.easeInOut(u);
    const xa = at(SPOT.fall) * W.w, xs = at(0.12) * W.w;
    const x = lerp(xs, xa, e) + Math.sin(W.t * 0.6) * (1 - e) * W.w * 0.03;
    const g = gY(x), h = hNear();
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, 'pale', x, -4, g + h * 0.1, h * 1.7, a * 0.3);
    glow(ctx, 'pale', x, g + h * 0.02, h * 2, h * 0.45, a * 0.6);
    glow(ctx, 'pale', x, g - h * 0.3, h * 0.9, h * 0.7, a * 0.18);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 血的声音
  function drawBlood(ctx) {
    const b = LV.cainBlood;
    if (b < 0.01) return;
    const x = at(SPOT.fall) * W.w, y = gY(x), h = hNear();
    const pulse = 0.72 + 0.28 * Math.sin(W.t * 1.7) * Math.sin(W.t * 0.53 + 1);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'blood', x, y + h * 0.04, h * 1.9, h * 0.45, 0.55 * b * pulse);
    glow(ctx, 'blood', x, y - h * 0.9, h * 0.8, h * 1.6, 0.12 * b * pulse);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 记号：该隐额上一点光，一圈淡淡的环护着他
  function drawMark(ctx) {
    const m = LV.cainMark;
    if (m < 0.01) return;
    for (const id of ['cain', 'cainN']) {
      const b = body(id);
      if (!b || b.a < 0.05) continue;
      const hx = b.x + b.dir * b.h * 0.035, hy = b.head;
      const pulse = 0.8 + 0.2 * Math.sin(W.t * 1.4);
      const k = clamp(since(S.markT0) / 3, 0, 1);
      const A = m * b.a;
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'gold', hx, hy, b.h * 0.45, b.h * 0.45, A * (0.3 + 0.6 * (1 - k)) * pulse);
      glow(ctx, 'gold', b.x, b.y - b.h * 0.5, b.h * 0.8, b.h * 0.9, A * 0.08 * pulse);
      const d = Math.max(0.9, b.h * 0.03);
      ctx.fillStyle = rgba([255, 244, 214], 0.95 * A);
      ctx.fillRect(hx - d, hy - d, d * 2, d * 2);
      ctx.strokeStyle = rgba([255, 232, 190], 0.35 * A * pulse);
      ctx.lineWidth = Math.max(0.6, 0.8 * P.s);
      ctx.beginPath(); ctx.arc(hx, hy, b.h * 0.17, 0, TAU); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 求告耶和华的名：光柱降在亚伯的旧坛上
  function drawCall(ctx) {
    const c = LV.cainCall;
    if (c < 0.01) return;
    const [x, y] = altarTop('A'), h = hNear();
    const k = U.easeOut(clamp(since(S.callT0) / 3, 0, 1));
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, 'gold', x, -4, lerp(0, y, k), h * 2.2, c * (0.24 + 0.05 * Math.sin(W.t * 0.9)));
    glow(ctx, 'warm', x, y + h * 0.3, h * 3, h * 1, c * 0.22 * k);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 与神同行：以诺身旁的一团微光；神将他取去：光柱
  function drawEnoch(ctx) {
    const wk = LV.cainWalk, tk = LV.cainTaken;
    if (wk > 0.01) {
      const b = body('enoch');
      if (b) {
        const bob = Math.sin(W.t * 1.2) * b.h * 0.06;
        const x = b.x + b.dir * b.h * 0.5, y = b.head + b.h * 0.1 + bob;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'gold', x, y, b.h * 0.7, b.h * 0.7, 0.4 * wk * b.a);
        glow(ctx, 'pale', x, y, b.h * 0.2, b.h * 0.2, 0.8 * wk * b.a);
        glow(ctx, 'gold', b.x, b.y - b.h * 0.5, b.h * 0.9, b.h, 0.1 * wk * b.a);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    if (tk > 0.01) {
      const x = S.enochX * W.w, g = gY(x), h = hNear();
      const fl = clamp(1 - (since(S.takenT0) - 6) / 8, 0, 1);
      const k = U.easeOut(clamp(since(S.takenT0) / 2.5, 0, 1));
      ctx.globalCompositeOperation = 'lighter';
      beam(ctx, 'gold', x, -4, lerp(0, g, k), h * 1.8, tk * (0.2 + 0.3 * fl));
      glow(ctx, 'gold', x, g, h * 1.6, h * 0.4, tk * (0.2 + 0.25 * fl) * k);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 安慰：挪亚一家身上温暖的光
  function drawComfort(ctx) {
    const c = LV.cainComfort;
    if (c < 0.01) return;
    const b = body('lamechW') || body('noah');
    if (!b) return;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'warm', b.x, b.y - b.h * 0.5, b.h * 2.4, b.h * 1.4, c * (0.2 + 0.14 * (1 - W.daylight)));
    glow(ctx, 'gold', b.x, b.y - b.h * 0.55, b.h * 0.8, b.h * 0.8, c * 0.16);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 田间：光熄灭（不画暴力；只有黑暗合拢，又退去）
  function drawDark(ctx) {
    const d = LV.cainDark;
    if (d < 0.005) return;
    const x = at(SPOT.fall) * W.w, y = gY(x) - hNear() * 0.5;
    const R = Math.hypot(W.w, W.h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, R * 0.85);
    g.addColorStop(0, 'rgba(3,3,8,' + (0.86 * d).toFixed(3) + ')');
    g.addColorStop(0.2, 'rgba(3,3,8,' + (0.74 * d).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(3,3,8,' + (0.5 * d).toFixed(3) + ')');
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
  }

  function drawUnder(ctx, pass) {
    if (!cur()) return;
    layout();
    ctx.save();
    if (pass === 'mid') {
      drawEdenGate(ctx);
      drawCity(ctx);
      drawMotes(ctx, 'mid');
    } else if (pass === 'near') {
      drawHardGround(ctx);
      drawThornSet(ctx, GEO.thorns, 1);
      drawField(ctx);
      drawThornSet(ctx, GEO.fieldThorns, LV.cainWither);
      drawTent(ctx);
      drawAltar(ctx, SPOT.altarA, [170, 160, 140]);
      drawAltar(ctx, SPOT.altarC, [128, 110, 96]);
      drawCairns(ctx);
      drawBloom(ctx);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawOver(ctx, pass) {
    if (!cur()) return;
    layout();
    ctx.save();
    if (pass === 'near') {
      drawCrack(ctx);
      const h = hNear();
      if (LV.cainAltar > 0.5) {
        const A = altarTop('A'), C = altarTop('C');
        drawSmoke(ctx, A[0], A[1] - h * 0.2, LV.cainFireA, LV.cainAccept, true, 0);
        drawSmoke(ctx, C[0], C[1] - h * 0.2, LV.cainFireC, LV.cainAccept, false, 0.37);
        drawFire(ctx, A[0], A[1], h * 0.5, LV.cainFireA, 0);
        drawFire(ctx, C[0], C[1], h * 0.5, LV.cainFireC, 3.1);
      }
      drawSin(ctx);
    } else if (pass === 'air') {
      drawAccept(ctx);
      drawSearch(ctx);
      drawBlood(ctx);
      drawMotes(ctx, 'air');
      drawCall(ctx);
      drawEnoch(ctx);
      drawComfort(ctx);
      drawMark(ctx);
    } else if (pass === 'top') {
      drawDark(ctx);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function update(dt) {
    if (!cur()) {
      if (MOTES.length) MOTES.length = 0;
      shadowX = null;
      return;
    }
    layout();
    // 暗影伏在该隐身后，慢一步地跟着他
    const b = LV.cainShadow > 0.005 ? body('cain') : null;
    if (b) {
      const tx = b.x - (b.p.facing || 1) * b.h * 0.75;
      shadowX = shadowX == null ? tx : shadowX + (tx - shadowX) * (1 - Math.exp(-dt * 1.3 * Math.max(0.5, W.fast || 1)));
    } else shadowX = null;
    if (!W.replaying) stepMotes(dt);
  }

  function pick(x, y, r) {
    if (!cur() || !GEO) return null;
    let best = null;
    const test = (label, px, py) => {
      const d = Math.hypot(px - x, py - y);
      if (isFinite(d) && d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const h = hNear();
    if (LV.cainAltar > 0.5) {
      const A = altarTop('A'), C = altarTop('C');
      test(LV.cainCall > 0.3 ? '坛 · 求告耶和华的名' : '亚伯的坛', A[0], A[1] + h * 0.2);
      test('该隐的坛', C[0], C[1] + h * 0.2);
    }
    if (LV.cainField > 0.3) {
      const fx0 = at((SPOT.field0 + SPOT.field1) / 2) * W.w;
      test(LV.cainWither > 0.4 ? '受咒诅的地' : '该隐的田', fx0, fY(fx0, 0.08));
    }
    const tx = at(SPOT.tent) * W.w;
    test('帐棚', tx, gY(tx) - h * 0.6);
    if (LV.cainCity > 0.3) { const cx = atM((SPOT.city0 + SPOT.city1) / 2) * W.w; test('以诺城', cx, gY(cx, 1) - hMid() * 0.8); }
    for (const c of S.cairns) { const cx = c.x * W.w; test(c.label, cx, gY(cx) - h * 0.1); }
    const fx1 = at(SPOT.fall) * W.w;
    if (LV.cainBloom > 0.4) test('亚伯倒下之处', fx1, gY(fx1) - h * 0.1);
    else if (LV.cainBlood > 0.2) test('亚伯的血', fx1, gY(fx1) - h * 0.1);
    const ex = W.w * 0.992;
    if (W.night + W.dusk > 0.3) test('伊甸园的东边', ex, gY(ex, 1) - hMid() * 0.55);
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function spiritRing(c, col) { if (!c.instant) safe('cain.ring', () => fx().ring(c.x, c.y, col || [255, 232, 200], M() * 0.3, 2, 1.4)); }
  function cairn(b, x, label) {
    S.cairns.push({ x, t0: inst(b) ? -1e9 : W.t, label });
    if (!inst(b)) { const px = x * W.w; fx().sparkle(px, gY(px) - hNear() * 0.3, 22, [255, 238, 210], hNear() * 0.4, 'near'); }
  }
  const GENS = [['enosh', '以挪士'], ['kenan', '该南'], ['mahalalel', '玛勒列'], ['jared', '雅列'], ['enoch', '以诺']];
  const GEN_F = [0.745, 0.665, 0.585, 0.505, 0.425];

  // ════════════════════════════════════════════════════════════
  //  卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, title: '该隐', sub: '创世记 4:1 — 5:32', tint: [240, 196, 160],
    outro: 42,

    setup() {

      // 地必为你的缘故受咒诅：土更硬、草更黄，花也稀了

      GS.W.set('bare', 0.38, true); GS.W.set('bloom', 0.2, true);
      S = fresh();
      MOTES.length = 0;
      shadowX = null;
      // 园子之外的世界（与上一卷怎样结束无关）：地更硬，树少，只在西边（右）还有几棵
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 1, land: 1, grass: 0.62, herbs: 0.5, trees: 0.42,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      for (const k of MY) W.set(k, 0, true);
      P.w = 0;
      layout();
      const gx = W.w * 0.96, hx = W.w * 0.94, tx = W.w * 0.995;
      W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('herbs', hx, W.ridgeBaseY(2, hx));
      W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
      W.freeClock = false;
      W.goTo(0.3, 0, true);                       // 早晨：光从东方（左）来
      const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
      W.setPop('fish', 140, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 3, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 40, W.w * 0.6, W.h * 0.3, true);
      W.setPop('cattle', 3, lx, ly, true);
      W.setPop('beast', 1, lx, ly, true);
      W.setPop('creeper', 16, lx, ly, true);
      W.setPop('human', 0, lx, ly, true);
      cast().clear({ fade: false });
      cast().add('adam', { label: '亚当', sex: 'm', age: 'adult', layer: 2, x: at(SPOT.adam), facing: 1, pose: 'stand', robe: HIDE.m, glow: 0.34, from: 'none' });
      cast().add('eve', { label: '夏娃', sex: 'f', age: 'adult', layer: 2, x: at(SPOT.eve), facing: -1, pose: 'stand', robe: HIDE.f, glow: 0.34, from: 'none' });
    },

    stages: [
      // ── 4:1–2 该隐与亚伯 ─────────────────────────────────────
      {
        kind: 'act', utter: '夏娃就怀孕，生了该隐', cmd: 'spawn 该隐 && spawn 亚伯  # 耶和华使我得了一个男子', ref: '4:1–2',
        verse: [
          { text: '有一日，那人和他妻子夏娃同房，夏娃就怀孕，生了该隐（就是得的意思），<br>便说：「耶和华使我得了一个男子。」', ref: '创世记 4:1', hold: 8.5 },
          { text: '又生了该隐的兄弟亚伯。<br>亚伯是牧羊的；该隐是种地的。', ref: '创世记 4:2', hold: 8 },
        ],
        apply(c) {
          spiritRing(c, [255, 226, 196]);
          const E = at(SPOT.eve), A = at(SPOT.adam);
          T(c, [
            [0, b => { cast().pose('eve', 'sit', { stop: true }); cast().face('adam', 'eve'); if (!inst(b)) sfx('harp', b, { soft: true }); }],
            [2.2, b => {
              cast().carry('eve', 'baby');
              if (!inst(b)) {
                sparkAt('eve', 26, [255, 232, 206], 0.3);
                const e = body('eve'); if (e) fx().ring(e.x, e.y - e.h * 0.45, [255, 226, 196], M() * 0.14, 2.2, 1.2);
                nameOver('该隐', 'eve', [255, 230, 196], { hold: 2.2, lift: 1.6 });
              }
            }],
            [3.4, () => walk('adam', E - 0.022, 0.02, 'kneel')],
            [5, b => W.goTo(0.99, 3.6, inst(b))],
            [8.6, b => {
              // 夜里：怀中的婴孩长成了孩子（该隐），夏娃怀中又有了亚伯
              cast().add('cain', { label: '该隐', sex: 'm', age: 'child', layer: 2, x: E - 0.045, facing: 1, pose: 'stand', robe: ROBE.cain, glow: 0.4, from: 'fade' });
              cast().pose('eve', 'stand', { stop: true });
              cast().pose('adam', 'stand', { stop: true });
              if (!inst(b)) { sparkAt('eve', 18, [255, 236, 214], 0.25); nameOver('亚伯', 'eve', [236, 240, 255], { hold: 2, lift: 1.6 }); }
            }],
            [9, b => W.goTo(0.3, 3.6, inst(b))],
            [13.2, b => W.goTo(0.99, 3.4, inst(b))],
            [16.6, () => {
              // 又一夜：两个孩子都长大了
              cast().carry('eve', null);
              cast().add('cain', { age: 'adult' });
              cast().place('cain', E - 0.05);
              cast().add('abel', { label: '亚伯', sex: 'm', age: 'adult', layer: 2, x: A - 0.05, facing: -1, pose: 'stand', robe: ROBE.abel, glow: 0.42, from: 'fade', prop: 'staff' });
              cast().face('adam', -1); cast().face('eve', -1);
            }],
            [17, b => W.goTo(0.36, 4.2, inst(b))],
            [19.6, b => {
              walk('abel', at(0.24), 0.032);
              herd('cain:flock', { kind: 'sheep', n: 7, x0: at(SPOT.flock0), x1: at(SPOT.flock1), layer: 2, label: '亚伯的羊', from: 'fade' });
              if (!inst(b)) sfx('bleat', b, { soft: true });
            }],
            [20.2, () => walk('cain', at(SPOT.field1) - 0.012, 0.03)],
            [21.5, b => lv('cainField', 1, b)],
            [23, () => cast().pose('cain', 'bow')],
            [27, () => walk('cain', at(SPOT.field0) + 0.05, 0.012, 'bow')],
            [33, () => cast().pose('cain', 'stand')],
          ]);
        },
      },

      // ── 4:3–5 两样供物 ──────────────────────────────────────
      {
        kind: 'act', utter: '耶和华看中了亚伯和他的供物', cmd: 'review 供物 --accept 亚伯  # 该隐：rejected', ref: '4:3–5',
        verse: [
          { text: '有一日，该隐拿地里的出产为供物献给耶和华；', ref: '创世记 4:3', hold: 6 },
          { text: '亚伯也将他羊群中头生的和羊的脂油献上。<br>耶和华看中了亚伯和他的供物，', ref: '创世记 4:4', hold: 7.5 },
          { text: '只是看不中该隐和他的供物。<br>该隐就大大地发怒，变了脸色。', ref: '创世记 4:5', hold: 7.5 },
        ],
        apply(c) {
          spiritRing(c);
          const xA = at(SPOT.altarA), xC = at(SPOT.altarC), d = side();
          T(c, [
            [0, b => {
              W.goTo(0.6, 20, inst(b));
              lv('cainAltar', 1, b);
              if (!inst(b)) {
                for (const f of [SPOT.altarA, SPOT.altarC]) { const x = at(f) * W.w; fx().dust(x, gY(x), 18, [200, 180, 150], hNear() * 0.5); }
                sfx('build', b, { soft: true });
              }
            }],
            [0.6, () => { cast().prop('cain', 'bundle'); walk('cain', xC + d, 0.03, 'stand'); }],
            [1.2, () => { cast().carry('abel', 'lamb'); walk('abel', xA - d, 0.03, 'stand'); }],
            [6.6, b => {
              cast().face('cain', -1); cast().face('abel', 1);
              cast().prop('cain', null); cast().carry('abel', null);
              cast().pose('cain', 'kneel', { stop: true }); cast().pose('abel', 'kneel', { stop: true });
              lv('cainFireA', 1, b); lv('cainFireC', 1, b);
              if (!inst(b)) {
                for (const w of ['A', 'C']) { const t = altarTop(w); fx().sparkle(t[0], t[1], 16, [255, 200, 130], hNear() * 0.2, 'near'); }
                sfx('fire', b, { soft: true });
              }
            }],
            [9, () => cast().pose('abel', 'pray')],
            [11.5, b => {
              lv('cainAccept', 1, b);
              S.acceptT0 = inst(b) ? -1e9 : W.t;
              if (!inst(b)) { const t = altarTop('A'); fx().ring(t[0], t[1], [255, 236, 190], M() * 0.25, 2.6, 1.4); sfx('harp', b); }
            }],
            [20, () => { cast().pose('cain', 'stand', { stop: true }); cast().face('cain', 1); cast().glow('cain', 0.08); }],
            [21.6, () => cast().pose('cain', 'bow')],
          ]);
        },
      },

      // ── 4:6–8 你为什么发怒呢？……二人正在田间 ─────────────────
      {
        kind: 'ask', utter: '你为什么发怒呢？', cmd: 'warn 该隐  # 罪就伏在门前，你却要制伏它', ref: '4:6–8', hold: 2.8,
        verse: [
          { text: '耶和华对该隐说：「你为什么发怒呢？<br>你为什么变了脸色呢？', ref: '创世记 4:6', hold: 6.5 },
          { text: '你若行得好，岂不蒙悦纳？你若行得不好，罪就伏在门前。<br>它必恋慕你，你却要制伏它。」', ref: '创世记 4:7', hold: 10 },
        ],
        apply(c) {
          spiritRing(c, [255, 236, 214]);
          const fall = at(SPOT.fall);
          T(c, [
            [0, b => { W.goTo(0.735, 17, inst(b)); cast().pose('cain', 'stand', { stop: true }); if (!inst(b)) sfx('wind', b, { soft: true }); }],
            [7.9, b => { lv('cainShadow', 1, b); if (!inst(b)) sfx('wind', b, { low: true }); }],
            [10, b => { lv('cainFireC', 0, b); lv('cainFireA', 0.3, b); }],
            [18, () => { cast().pose('abel', 'stand', { stop: true }); cast().face('abel', 1); }],
            [19.4, b => {
              cast().face('cain', 'abel');
              say(b, [{ text: '该隐与他兄弟亚伯说话；二人正在田间，<br>该隐起来打他兄弟亚伯，把他杀了。', ref: '创世记 4:8', hold: 12.5 }]);
            }],
            [20.6, () => { walk('cain', fall + 0.022, 0.03); walk('abel', fall - 0.004, 0.029); }],
            [28.6, b => {
              cast().face('cain', -1); cast().face('abel', 1);
              lv('cainDark', 1, b);
              if (!inst(b)) sfx('wind', b, { low: true });
            }],
            [31.4, b => {
              cast().pose('abel', 'fall', { stop: true });
              cast().glow('abel', 0.03);
              cast().crowdWalk('cain:flock', at(0.05), at(0.2), { run: true, pose: 'stand' });
              if (!inst(b)) sfx('thunder', b, { soft: true, low: true, far: true });
            }],
            [33.6, b => { lv('cainShadow', 0, b); lv('cainDark', 0.15, b); lv('cainFireA', 0.12, b); }],
            [34.5, b => W.goTo(0.86, 9, inst(b))],
            [35.5, () => { cast().face('cain', 1); cast().pose('cain', 'stand', { stop: true }); }],
            [38, () => { cast().pose('adam', 'sit'); cast().pose('eve', 'sit'); }],
          ]);
        },
      },

      // ── 4:9 你兄弟亚伯在哪里？ ────────────────────────────────
      {
        kind: 'ask', utter: '你兄弟亚伯在哪里？', cmd: 'whereis 亚伯  # → 我不知道', ref: '4:9', hold: 3,
        verse: [
          { text: '耶和华对该隐说：「你兄弟亚伯在哪里？」<br>他说：「我不知道！我岂是看守我兄弟的吗？」', ref: '创世记 4:9', hold: 10 },
        ],
        apply(c) {
          spiritRing(c, [226, 234, 255]);
          T(c, [
            [0, b => {
              lv('cainDark', 0, b);
              W.goTo(0.96, 10, inst(b));
              lv('cainSearch', 1, b);
              S.searchT0 = inst(b) ? -1e9 : W.t;
              if (!inst(b)) sfx('wind', b, { soft: true });
            }],
            [1.2, () => walk('cain', at(SPOT.altarC) + side() * 1.6, 0.026)],
            [8, () => { cast().face('cain', -1); cast().pose('cain', 'stand', { stop: true }); }],
            [9, () => cast().crowdPose('cain:flock', 'stand')],
          ]);
        },
      },

      // ── 4:10–12 血的声音 ───────────────────────────────────
      {
        kind: 'judge', utter: '你兄弟的血有声音从地里向我哀告', cmd: 'listen 地 --voice 血 && curse 该隐的田', ref: '4:10–12', hold: 3.6,
        tint: [236, 150, 124],
        verse: [
          { text: '耶和华说：「你作了什么事呢？<br>你兄弟的血有声音从地里向我哀告。', ref: '创世记 4:10', hold: 7.5 },
          { text: '地开了口，从你手里接受你兄弟的血。<br>现在你必从这地受咒诅。', ref: '创世记 4:11', hold: 7.5 },
          { text: '你种地，地不再给你效力；<br>你必流离飘荡在地上。」', ref: '创世记 4:12', hold: 7.5 },
        ],
        apply(c) {
          spiritRing(c, [255, 190, 160]);
          T(c, [
            [0, b => {
              lv('cainBlood', 1, b); lv('cainSearch', 0.35, b);
              W.goTo(0.02, 22, inst(b));
              if (!inst(b)) sfx('weep', b, { soft: true, low: true });
            }],
            [1, () => { cast().face('cain', 1); }],
            [9, b => {
              lv('cainGround', 1, b);
              cast().remove('abel');
              if (!inst(b)) {
                const x = at(SPOT.fall) * W.w;
                fx().sparkle(x, gY(x) - hNear() * 0.1, 40, [255, 150, 100], hNear() * 0.6, 'near');
                W.shake = Math.max(W.shake, 0.35);
              }
            }],
            [12, () => { cast().pose('eve', 'weep', { stop: true }); cast().face('adam', 'eve'); cast().pose('adam', 'bow', { stop: true }); }],
            [17.4, b => {
              lv('cainWither', 1, b);
              cast().face('cain', 1);
              cast().pose('cain', 'kneel', { stop: true });
              if (!inst(b)) sfx('wind', b, { low: true });
            }],
            [26, b => { lv('cainGround', 0.45, b); lv('cainBlood', 0.5, b); lv('cainSearch', 0, b); }],
          ]);
        },
      },

      // ── 4:13–22 记号；挪得之地；以诺城 ───────────────────────
      {
        kind: 'promise', utter: '凡杀该隐的，必遭报七倍', cmd: 'protect 该隐 --mark && mv 该隐 ./挪得  # 伊甸之东', ref: '4:13–22', hold: 3.2,
        verse: [
          { text: '该隐对耶和华说：「我的刑罚太重，过于我所能当的。<br>你如今赶逐我离开这地，以致不见你面；<br>我必流离飘荡在地上，凡遇见我的必杀我。」', ref: '创世记 4:13–14', hold: 10.5 },
          { text: '耶和华对他说：「凡杀该隐的，必遭报七倍。」<br>耶和华就给该隐立一个记号，免得人遇见他就杀他。', ref: '创世记 4:15', hold: 9 },
        ],
        apply(c) {
          spiritRing(c, [255, 232, 190]);
          const sx = c.x, sy = c.y;
          T(c, [
            [0, () => { cast().face('cain', 1); cast().pose('cain', 'pray', { stop: true }); }],
            [11.9, b => {
              lv('cainMark', 1, b);
              S.markT0 = inst(b) ? -1e9 : W.t;
              cast().pose('cain', 'kneel', { stop: true });
              if (!inst(b)) {
                const cb = body('cain');
                if (cb) {
                  const tg = [];
                  for (let i = 0; i < 26; i++) tg.push([cb.x + cb.dir * cb.h * 0.035 + rnd(-1.5, 1.5), cb.head + rnd(-1.5, 1.5), rnd(0.8, 1.6)]);
                  fx().sow(clamp(sx, 0, W.w), clamp(sy, 0, W.h), tg, [255, 236, 200], { stagger: 0.8, dur: 1.9, pass: 'air' });
                  fx().ring(cb.x, cb.head, [255, 232, 190], M() * 0.12, 2.4, 1.2);
                }
                sfx('seal', b);
              }
            }],
            [14, b => W.goTo(0.26, 16, inst(b))],
            [19.5, () => { cast().pose('cain', 'stand', { stop: true }); cast().face('cain', -1); }],
            [21.5, () => walk('cain', at(0.03), 0.028)],
            [23.2, b => say(b, [{ text: '于是该隐离开耶和华的面，去住在伊甸东边挪得之地。', ref: '创世记 4:16', hold: 7.5 }])],
            [24, () => { cast().pose('eve', 'stand', { stop: true }); cast().pose('adam', 'stand', { stop: true }); cast().face('eve', -1); cast().face('adam', -1); }],
            [33.5, b => {
              cast().remove('cain');
              const x0 = atM(SPOT.city0) - 0.02;
              cast().add('cainN', { label: '该隐', sex: 'm', age: 'adult', layer: 1, x: x0, facing: 1, pose: 'stand', robe: ROBE.cain, glow: 0.12, from: 'fade' });
              cast().add('cainW', { label: '该隐的妻子', sex: 'f', age: 'adult', layer: 1, x: x0 - 0.012, facing: 1, pose: 'stand', robe: [140, 96, 84], glow: 0.12, from: 'fade' });
              walk('cainN', atM(lerp(SPOT.city0, SPOT.city1, 0.35)), 0.02);
              cast().follow('cainW', 'cainN', 0.014);
              lv('cainCity', 1, b);
              if (!inst(b)) sfx('build', b, { soft: true, far: true });
            }],
            [34.5, b => say(b, [{ text: '该隐与妻子同房，他妻子就怀孕，生了以诺。<br>该隐建造了一座城，就按着他儿子的名将那城叫做以诺。', ref: '创世记 4:17', hold: 9 }])],
            [40, () => cast().add('enochC', { label: '以诺', sex: 'm', age: 'child', layer: 1, x: atM(lerp(SPOT.city0, SPOT.city1, 0.42)), facing: -1, pose: 'stand', robe: [130, 96, 76], glow: 0.2, from: 'fade' })],
            [44, b => {
              if (inst(b)) return;
              const cx = atM((SPOT.city0 + SPOT.city1) / 2) * W.w, cy = gY(cx, 1), hm = hMid();
              const size = Math.max(14, M() * 0.04);
              fx().nameStr('以诺', clamp(cx, size * 1.4, W.w - size * 1.4), cy - hm * 2.2 - size, size, [255, 222, 176],
                () => [cx + rnd(-1, 1) * hm * 2.4, cy - rnd(0, 1.2) * hm, [230, 190, 140]], { hold: 2.6 });
              chime('以');
            }],
            [47, b => {
              lv('cainArts', 1, b);
              cast().crowd('cain:line', { n: 6, x0: atM(SPOT.city0 + 0.02), x1: atM(SPOT.city1 + 0.04), layer: 1, label: '该隐的后裔', robe: ROBE.line, glow: 0.06 });
              herd('cain:cattle', { kind: 'cow', n: 3, x0: atM(0.25), x1: atM(0.34), layer: 1, label: '雅八的牲畜', from: 'fade' });
              if (!inst(b)) sfx('harp', b, { soft: true, far: true });
            }],
            [48.5, b => say(b, [{ text: '亚大生雅八；雅八就是住帐棚、牧养牲畜之人的祖师。<br>雅八的兄弟名叫犹八；他是一切弹琴吹箫之人的祖师。', ref: '创世记 4:20–21', hold: 9.5 }])],
          ]);
        },
      },

      // ── 4:25–26 塞特；求告耶和华的名 ─────────────────────────
      {
        kind: 'act', utter: '立了一个儿子代替亚伯', cmd: 'spawn 塞特 --in-place-of 亚伯 && call 耶和华的名', ref: '4:25–26', hold: 2.8,
        verse: [
          { text: '亚当又与妻子同房，她就生了一个儿子，起名叫塞特，<br>意思说：「神另给我立了一个儿子代替亚伯，因为该隐杀了他。」', ref: '创世记 4:25', hold: 10 },
        ],
        apply(c) {
          spiritRing(c, [255, 240, 214]);
          const xA = at(SPOT.altarA), d = side();
          T(c, [
            [0, b => {
              W.goTo(0.42, 8, inst(b));
              cast().add('adam', { age: 'elder' });
              cast().add('eve', { age: 'elder' });
              cast().pose('adam', 'stand', { stop: true });
              cast().pose('eve', 'sit', { stop: true });
              cast().face('adam', 'eve');
            }],
            [2.6, b => {
              cast().carry('eve', 'baby');
              lv('cainBlood', 0, b); lv('cainGround', 0, b); lv('cainBloom', 1, b);
              if (!inst(b)) {
                sparkAt('eve', 26, [255, 240, 214], 0.3);
                nameOver('塞特', 'eve', [255, 236, 206], { hold: 2.4, lift: 1.6 });
                const x = at(SPOT.fall) * W.w;
                fx().sparkle(x, gY(x) - hNear() * 0.15, 30, [246, 241, 231], hNear() * 0.5, 'near');
                sfx('harp', b);
              }
            }],
            [5, () => cast().crowdWalk('cain:flock', at(SPOT.flock0), at(SPOT.flock1), { pose: 'stand' })],
            [12, b => W.goTo(0.99, 3, inst(b))],
            [15, b => {
              // 夜里：塞特长大，娶妻；以挪士生了
              cast().carry('eve', null);
              cast().pose('eve', 'stand', { stop: true });
              cast().add('seth', { label: '塞特', sex: 'm', age: 'adult', layer: 2, x: at(0.8), facing: -1, pose: 'stand', robe: ROBE.seth, glow: 0.4, from: 'fade' });
              cast().add('sethW', { label: '塞特的妻子', sex: 'f', age: 'adult', layer: 2, x: at(0.77), facing: -1, pose: 'stand', robe: ROBE.sethW, glow: 0.35, from: 'fade', carry: 'baby' });
              if (!inst(b)) { sparkAt('sethW', 16, [255, 236, 210], 0.3); nameOver('以挪士', 'sethW', [236, 240, 255], { hold: 2, lift: 1.6 }); }
            }],
            [15.4, b => W.goTo(0.71, 5, inst(b))],
            [18, () => {
              walk('seth', xA + d, 0.03);
              walk('sethW', xA + d * 2.2, 0.03);
              walk('adam', xA - d, 0.03);
              walk('eve', xA - d * 2.1, 0.03);
              cast().crowd('cain:folk', { n: 4, x0: at(0.5), x1: at(0.62), layer: 2, label: '亚当的子孙', glow: 0.14 });
            }],
            [22.4, b => say(b, [{ text: '塞特也生了一个儿子，起名叫以挪士。<br>那时候，人才求告耶和华的名。', ref: '创世记 4:26', hold: 9.5 }])],
            [23.5, b => {
              cast().face('seth', -1); cast().face('sethW', -1); cast().face('adam', -1); cast().face('eve', -1);
              cast().face('adam', 1); cast().face('eve', 1);
              cast().pose('seth', 'pray'); cast().pose('sethW', 'kneel'); cast().pose('adam', 'kneel'); cast().pose('eve', 'kneel');
              cast().crowdPose('cain:folk', 'kneel');
              lv('cainFireA', 1, b);
              if (!inst(b)) { const t = altarTop('A'); fx().sparkle(t[0], t[1], 18, [255, 210, 140], hNear() * 0.2, 'near'); }
            }],
            [25, b => {
              lv('cainCall', 1, b);
              S.callT0 = inst(b) ? -1e9 : W.t;
              if (!inst(b)) { const t = altarTop('A'); fx().ring(t[0], t[1], [255, 236, 196], M() * 0.35, 3, 1.4); sfx('harp', b); }
            }],
          ]);
        },
      },

      // ── 5:1–24 亚当的后代；以诺与神同行 ────────────────────
      {
        kind: 'act', utter: '以诺与神同行，神将他取去', cmd: 'git log 亚当..以诺 && take 以诺  # 与神同行', ref: '5:1–24', hold: 3.2,
        verse: [
          { text: '亚当的后代记在下面。当神造人的日子，是照着自己的样式造的，<br>并且造男造女。在他们被造的日子，神赐福给他们，称他们为人。', ref: '创世记 5:1–2', hold: 10 },
          { text: '亚当共活了九百三十岁就死了。', ref: '创世记 5:5', hold: 6 },
        ],
        apply(c) {
          spiritRing(c, [255, 236, 206]);
          const xAd = at(SPOT.altarA) - side();          // 亚当在坛边坐下，死在那里
          const beats = [
            [0, b => {
              lv('cainCall', 0, b); lv('cainFireA', 0.15, b);
              W.goTo(0.5, 6, inst(b));
              cast().removeCrowd('cain:folk');
              for (const id of ['seth', 'sethW', 'adam', 'eve']) cast().pose(id, 'stand', { stop: true });
            }],
            [1.5, () => {
              walk('seth', at(0.82), 0.03);
              cast().remove('sethW');
              cast().pose('adam', 'sit');
              cast().pose('eve', 'sit');
            }],
            [11.4, () => { cast().place('adam', xAd); cast().pose('adam', 'lie', { stop: true }); cast().face('eve', 'adam'); }],
            [13.5, b => {
              cast().remove('adam');
              cairn(b, xAd, '亚当的坟');
              cast().pose('eve', 'kneel', { stop: true, weep: true });
              if (!inst(b)) sfx('weep', b, { soft: true });
            }],
            [16.6, b => W.passDay(6.5, inst(b))],                    // 一夜过去
            [19.5, () => cast().remove('eve')],
            [23.2, b => W.goTo(0.6, 13, inst(b))],
            [33.6, b => say(b, [{ text: '雅列活到一百六十二岁，生了以诺。', ref: '创世记 5:18', hold: 5 }])],
            [37.6, b => W.goTo(0.735, 8, inst(b))],
          ];
          // 一代一代如季节经过：子出现在父的东边（左），名字在他头上聚成；父老了，渐渐隐去
          GENS.forEach(([id, name], k) => {
            const t = 23.4 + k * 3, prev = k ? GENS[k - 1][0] : 'seth';
            beats.push([t, b => {
              cast().add(id, { label: name, sex: 'm', age: 'adult', layer: 2, x: at(GEN_F[k]), facing: -1, pose: 'stand',
                robe: id === 'enoch' ? ROBE.enoch : ROBE.gen[k % ROBE.gen.length], glow: id === 'enoch' ? 0.6 : 0.42, from: 'light' });
              cast().add(prev, { age: 'elder' });
              if (!inst(b)) nameOver(name, id, [255, 234, 200], { hold: 1.8, lift: k % 2 ? 2.4 : 1.1 });
            }]);
            beats.push([t + 2.3, () => cast().remove(prev)]);
          });
          beats.push(
            [38.4, b => {
              cast().add('methu', { label: '玛土撒拉', sex: 'm', age: 'adult', layer: 2, x: at(0.4), facing: 1, pose: 'stand', robe: ROBE.methu, glow: 0.4, from: 'light' });
              lv('cainWalk', 1, b);
              say(b, [{ text: '以诺生玛土撒拉之后，与神同行三百年，并且生儿养女。', ref: '创世记 5:22', hold: 8 }]);
              if (!inst(b)) sfx('harp', b, { soft: true });
            }],
            [39.2, () => walk('enoch', at(0.62), 0.014)],
            [48.8, b => {
              S.enochX = at(0.62);
              lv('cainTaken', 1, b);
              S.takenT0 = inst(b) ? -1e9 : W.t;
              cast().face('methu', 1);
              say(b, [{ text: '以诺与神同行，神将他取去，他就不在世了。', ref: '创世记 5:24', hold: 9 }]);
              if (!inst(b)) sfx('harp', b);
            }],
            [50, () => { cast().place('enoch', at(0.62)); cast().pose('enoch', 'gaze', { stop: true }); }],
            [51, () => { cast().pose('enoch', 'raise', { stop: true }); cast().fly('enoch', at(0.62), 0.14, { dur: 6.5, pose: 'raise' }); }],
            [57, b => {
              const eb = body('enoch');
              cast().remove('enoch');
              lv('cainWalk', 0, b);
              if (!inst(b) && eb) { fx().sparkle(eb.x, eb.y - eb.h * 0.5, 50, [255, 244, 220], eb.h * 0.8, 'top'); fx().ring(eb.x, eb.y - eb.h * 0.5, [255, 238, 200], M() * 0.3, 2.6, 1.2); }
            }],
            [58.4, b => { lv('cainTaken', 0.22, b); cast().pose('methu', 'gaze'); }],
          );
          T(c, beats);
        },
      },

      // ── 5:25–32 挪亚 ────────────────────────────────────────
      {
        kind: 'act', utter: '给他起名叫挪亚', cmd: 'name 挪亚  # 必为我们的劳苦安慰我们', ref: '5:25–32', hold: 2.8,
        tint: [255, 222, 176],
        verse: [
          { text: '玛土撒拉活到一百八十七岁，生了拉麦。', ref: '创世记 5:25', hold: 6 },
          { text: '拉麦活到一百八十二岁，生了一个儿子，给他起名叫挪亚，说：<br>「这个儿子必为我们的操作和手中的劳苦安慰我们；<br>这操作劳苦是因为耶和华咒诅地。」', ref: '创世记 5:28–29', hold: 11.5 },
        ],
        apply(c) {
          spiritRing(c, [255, 226, 186]);
          const xL = at(0.5), xW = at(0.545);
          T(c, [
            [0, b => { lv('cainTaken', 0, b); W.goTo(0.99, 4.5, inst(b)); cast().pose('methu', 'stand', { stop: true }); }],
            [4.6, () => {
              cast().add('methu', { age: 'elder' });
              cast().place('methu', at(0.44));
              cast().face('methu', 1);
              cast().add('lamech', { label: '拉麦', sex: 'm', age: 'adult', layer: 2, x: xL, facing: 1, pose: 'stand', robe: ROBE.lamech, glow: 0.4, from: 'fade' });
              cast().add('lamechW', { label: '拉麦的妻子', sex: 'f', age: 'adult', layer: 2, x: xW, facing: -1, pose: 'stand', robe: ROBE.lamechW, glow: 0.38, from: 'fade' });
            }],
            [5.2, b => W.goTo(0.27, 10, inst(b))],
            [7.6, b => {
              cast().pose('lamechW', 'sit', { stop: true });
              cast().carry('lamechW', 'baby');
              lv('cainComfort', 1, b);
              if (!inst(b)) { sparkAt('lamechW', 28, [255, 232, 196], 0.3); sfx('harp', b, { soft: true }); }
            }],
            [10.4, b => {
              cast().pose('lamech', 'kneel', { stop: true });
              if (!inst(b)) {
                // 挪亚的名：由受咒诅之地的尘土聚成，渐渐转成金色
                const x0 = at(SPOT.field0) * W.w, x1 = at(SPOT.field1) * W.w;
                const lb = body('lamechW');
                const size = Math.max(18, M() * 0.06);
                const cx = lb ? lb.x : (xL + xW) / 2 * W.w, cy = (lb ? lb.head : W.h * 0.7) - (lb ? lb.h : 30) * 0.9 - size;
                fx().nameStr('挪亚', clamp(cx, size * 1.4, W.w - size * 1.4), Math.max(size, cy), size, [255, 226, 170],
                  () => { const x = rnd(x0, x1); return [x, fY(x, rnd(0, FIELD_V)), [222, 186, 138]]; }, { hold: 3.4 });
                chime('挪');
              }
            }],
            [19.6, () => cast().pose('methu', 'sit')],
            [21.2, b => say(b, [{ text: '玛土撒拉共活了九百六十九岁就死了。', ref: '创世记 5:27', hold: 6 }])],
            [23, () => cast().pose('methu', 'lie')],
            [25.4, b => {
              cast().remove('methu');
              cairn(b, at(0.44), '玛土撒拉的坟');
              cast().face('lamech', -1);
              if (!inst(b)) sfx('weep', b, { soft: true });
            }],
            [27.6, b => W.goTo(0.99, 3, inst(b))],
            [30.6, b => {
              // 夜里：挪亚长大；到五百岁，生了闪、含、雅弗
              cast().carry('lamechW', null);
              cast().remove('lamechW');
              cast().add('lamech', { age: 'elder' });
              cast().pose('lamech', 'stand', { stop: true });
              cast().add('noah', { label: '挪亚', sex: 'm', age: 'adult', layer: 2, x: xW, facing: -1, pose: 'stand', robe: ROBE.noah, glow: 0.5, from: 'fade' });
              cast().add('shem', { label: '闪', sex: 'm', age: 'child', layer: 2, x: xW - 0.03, facing: -1, pose: 'stand', robe: ROBE.sons[0], glow: 0.36, from: 'light' });
              cast().add('ham', { label: '含', sex: 'm', age: 'child', layer: 2, x: xW + 0.026, facing: -1, pose: 'stand', robe: ROBE.sons[1], glow: 0.36, from: 'light' });
              cast().add('japheth', { label: '雅弗', sex: 'm', age: 'child', layer: 2, x: xW + 0.05, facing: -1, pose: 'stand', robe: ROBE.sons[2], glow: 0.36, from: 'light' });
              say(b, [{ text: '挪亚五百岁生了闪、含、雅弗。', ref: '创世记 5:32', hold: 8 }]);
            }],
            [31, b => W.goTo(0.33, 5, inst(b))],
            [33.4, b => { if (!inst(b)) nameOver('闪', 'shem', [255, 232, 200], { hold: 1.8, size: Math.max(12, M() * 0.03) }); }],
            [33.9, b => { if (!inst(b)) nameOver('含', 'ham', [255, 232, 200], { hold: 1.8, size: Math.max(12, M() * 0.03) }); }],
            [34.4, b => { if (!inst(b)) nameOver('雅弗', 'japheth', [255, 232, 200], { hold: 1.8, size: Math.max(12, M() * 0.03) }); }],
            [38, () => { cast().face('noah', -1); cast().pose('noah', 'gaze', { stop: true }); cast().face('lamech', -1); }],
          ]);
        },
      },
    ],

    scene: {
      init() { safe('cain.sprites', () => { for (const k in GLOW) sprite(k); beamSprite('gold'); beamSprite('pale'); }); },
      resize() { P.w = 0; GEO = null; MOTES.length = 0; shadowX = null; },
      update,
      drawUnder,
      draw: drawOver,
      reset() { MOTES.length = 0; shadowX = null; },
      restore() { MOTES.length = 0; shadowX = null; bloodAcc = callAcc = forgeAcc = 0; },
      pick,
      _S: () => S,
      get debug() {
        return {
          P: Object.assign({}, P), S: JSON.parse(JSON.stringify(S)), motes: MOTES.length, shadowX,
          lv: MY.reduce((o, k) => { o[k] = +W.lv[k].toFixed(3); return o; }, {}),
        };
      },
    },
  });
})(window.GS);
