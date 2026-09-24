/* ─────────────────────────────────────────────────────────────
 * book/ezra.js —— 以斯拉记 · 归回（以斯拉记 1 — 10）
 *
 * 巴比伦的河边：城墙、伊施塔尔的蓝门、七层的庙塔在中丘上；被掳的人坐在柳树下，琴挂在枝上。
 * 塞鲁士的诏书在城门上发光（1:1–3）。「一切被神激动他心的人」——一个一个起来，胸中的光点亮；
 * 四围的人送来金银、牲畜（1:5–6）。「愿神与这人同在」——耶和华殿的器皿如一道金流从城门出来，
 * 交在设巴萨手中，利未人抬着，驼队向西而行，日落（1:7–11）。「使你们仍回此地」（耶 29:10）——
 * 黎明时到了耶路撒冷的废墟：焦木与乱石；七月如同一人聚集，在原有的根基上筑坛，火点起来（2—3:6）。
 * 「所罗巴伯的手立了这殿的根基」（亚 4:9）——香柏木的筏子浮海而来，根基一层一层立定，房角石发光；
 * 祭司穿礼服吹号，亚萨的子孙敲钹（3:7–10）。
 * ★ 本卷的签名之景：「他本为善，他向以色列人永发慈爱」——欢呼的声音是金色的环，老年人哭号的声音是银色的环，
 *   一环一环自殿基升起，越过群山与海；到末了金与银合为一色，不能分辨，「声音听到远处」（3:11–13）。
 * 「这殿仍然荒凉……」（该 1:4）——那地的民使他们的手发软，奏本往来，工程停止；人都去盖自己的房屋，
 * 年复一年，根基上长了草（4）。「你们都当刚强做工，因为我与你们同在」（该 2:4）——哈该与撒迦利亚，
 * 众人回来动工；总督达乃来问，「神的眼目看顾犹大的长老」——长老们头上一圈安静的光（5）。
 * 「他的手也必完成这工」（亚 4:9）——亚马他城宫内寻得的一卷在东方的天上展开，飞到殿上化作金光；
 * 殿墙升起：三层大石头，一层新木头（6:4）；亚达月初三日，这殿修成了（6:1–15）。
 * 「耶和华使他们欢喜」——奉献的礼，十二点火照以色列支派的数目；逾越节的夜，家家有灯（6:16–22）。
 * 以斯拉：手里是律法书，「他神施恩的手帮助他」——一片暖光如手掌覆在他上面；亚哈瓦河边的帐棚（7）。
 * 禁食的夜，「他就应允了我们」——光柱降在营上；黎明起行，山上埋伏的暗影退去，金银交在殿里（8）。
 * 晚祭的时候，以斯拉撕裂衣服而坐，跪下举手；「我们的神仍没有丢弃我们」——圣所里一颗钉子般的光，
 * 耶路撒冷残破的城墙上描出一道金线（9）。大雨中的会众，「以色列人还有指望」——一道光穿过雨云（10）。
 *
 * 画面的方位：左（东）= 巴比伦（中丘上的城，近地左端的河与柳树、亚哈瓦河边）；右（西）= 耶路撒冷
 *            （近地上的殿址、坛与院；中丘右边是残破的城墙与后来的房屋）。
 * 十三句话：以斯拉记里论神作为的话（kind 'act'：1:5，3:11，6:22，7:9，8:23，9:9，10:2）、以神的名的祝福（1:3），
 * 以及以斯拉记亲口提到的先知所传神自己的话——耶利米（拉 1:1 → 耶 29:10）、哈该与撒迦利亚（拉 5:1，6:14 →
 * 该 1:4，2:4；亚 4:9）。十章每章都有经文讲到。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'ezra';
  const isCur = () => GS.book.current(ACT);
  const sm = (a, b, x) => U.smoothstep(a, b, x);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    ezDecree: ['exp', 0.6],    // 塞鲁士的诏书（城门上一卷发光的书，1:1–4）
    ezStir: ['exp', 0.5],      // 被神激动的心（河边升起的微光，1:5）
    ezHarps: ['exp', 0.5],     // 柳树上挂着的琴；起来的时候取下
    ezGifts: ['exp', 0.8],     // 四围的人送来的金银财物（1:6）
    ezRuin: ['lin', 0.12],     // 殿址上的乱石与焦木
    ezAltar: ['lin', 0.25],    // 在原有的根基上筑坛（3:3）
    ezFire: ['exp', 0.7],      // 坛上的火（早晚献燔祭）
    ezRaft: ['lin', 0.085],    // 香柏树浮海运到约帕（3:7）：0..1 漂来，1..1.5 卸下、散去
    ezBeams: ['exp', 0.6],     // 运到殿址的香柏木
    ezFound: ['lin', 0.085],   // 殿的根基（3:10）
    ezStone: ['exp', 0.6],     // 房角石的光
    ezPlay: ['exp', 1.0],      // 吹号、敲钹
    ezPraise: ['exp', 0.6],    // 欢呼的声音（金色的环）
    ezWeep: ['exp', 0.5],      // 哭号的声音（银色的环）
    ezMix: ['exp', 0.35],      // 不能分辨欢呼的声音和哭号的声音（3:13）
    ezFar: ['exp', 0.3],       // 声音听到远处
    ezWeeds: ['lin', 0.08],    // 这殿仍然荒凉：根基上长了草（4:24）
    ezHouses: ['lin', 0.12],   // 各住在自己的城里；天花板的房屋
    ezScaf: ['exp', 0.5],      // 脚手架
    ezBuild: ['lin', 0.07],    // 殿墙：三层大石头，一层新木头（6:4）
    ezEye: ['exp', 0.5],       // 神的眼目看顾犹大的长老（5:5）
    ezScroll: ['exp', 0.6],    // 在亚马他城的宫内寻得一卷（6:2）
    ezScrollGo: ['lin', 0.14], // 那一卷从东方到耶路撒冷
    ezLamp: ['exp', 0.5],      // 殿里、家里的灯（逾越节的夜）
    ezTribes: ['exp', 0.5],    // 照以色列支派的数目（6:17）：十二点火
    ezJoy: ['exp', 0.5],       // 欢欢喜喜（6:16，22）
    ezTents: ['exp', 0.5],     // 亚哈瓦河边（8:15）
    ezHand: ['exp', 0.45],     // 神施恩的手（7:9；8:31）
    ezAnswer: ['exp', 0.5],    // 他就应允了我们（8:23）
    ezPeg: ['exp', 0.5],       // 如钉子钉在他的圣所（9:8）
    ezWall: ['exp', 0.3],      // 在犹大和耶路撒冷有墙垣（9:9）
    ezHope: ['exp', 0.4],      // 以色列人还有指望（10:2）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有一套）────────────────────
  const LAYL = {
    camp0: 0.482, camp1: 0.575,                        // 河边被掳的人
    riv: [[0.478, 0], [0.47, 0.25], [0.448, 0.55], [0.414, 1]],   // 河（近地纵深 v：0 地平线 · 1 画面底）
    wil: [[0.5, 0.03, 0.92], [0.558, 0.0, 0.8]],       // 柳树 [x, v, 大小]
    bab0: 0.503, bab1: 0.69, zig: 0.566, gate: 0.643, king: 0.643,
    jer0: 0.745, jer1: 0.995,
    tx0: 0.8,                                          // 殿的前沿（廊；门朝东 = 左）
    tents: [0.44, 0.487, 0.53, 0.568],
    scroll0: [0.33, 0.27], scroll1: [0.87, 0.42],     // 大流士寻得的那一卷：东方的天 → 殿上
    glyph: [0.74, 0.27],                               // 赞美的字
  };
  const LAYP = {
    camp0: 0.475, camp1: 0.6,
    riv: [[0.476, 0], [0.466, 0.25], [0.44, 0.55], [0.405, 1]],
    wil: [[0.49, 0.03, 1], [0.575, 0.0, 0.82]],
    bab0: 0.5, bab1: 0.7, zig: 0.572, gate: 0.648, king: 0.648,
    jer0: 0.75, jer1: 0.995,
    tx0: 0.735,
    tents: [0.45, 0.51, 0.565],
    scroll0: [0.36, 0.42], scroll1: [0.84, 0.5],
    glyph: [0.62, 0.47],
  };
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];

  // ── 小工具 ──────────────────────────────────────────────────
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.3 : 1) * (LK[l] || 1);
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * (LK[l] || 1);    // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fieldH(2, g); };
  const lit = c => [Math.min(255, c[0] * 1.2 + 22), Math.min(255, c[1] * 1.17 + 18), Math.min(255, c[2] * 1.12 + 14)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const mix = (a, b, t) => U.mixRGB(a, b, clamp(t, 0, 1));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const say = (b, lines) => { if (!b.instant && GS.ui) U.safe('ez.narrate', () => GS.ui.narrate(lines, { replace: false })); };
  function sfx(b, name, o) {
    if ((b && b.instant) || W.replaying) return;
    const a = au();
    if (a && a.sfx) U.safe('ez.sfx', () => a.sfx(name, o || {}));
  }
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };

  // ── 人物（皆经人物模块）────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : (o && o.from) || 'fade' }, o, W.replaying ? { from: 'none' } : {})); }
  const walk = (id, x, o) => { if (has(id)) C().walk(id, x, o); };
  const pose = (id, p, o) => { if (has(id)) C().pose(id, p, o); };
  const face = (id, d) => { if (has(id)) C().face(id, d); };
  const rm = (id, now) => { if (has(id)) C().remove(id, now ? { fade: false } : undefined); };
  const glow = (id, v) => { if (has(id)) C().glow(id, v); };
  const place = (id, x, l) => { if (has(id)) C().place(id, x, l); };
  function animal(id, o) {
    const c = C();
    if (!c || !c.animal) return null;
    return U.safe('ez.animal', () => c.animal(id, Object.assign({ layer: 2, from: W.replaying ? 'none' : 'fade' }, o)));
  }
  // 一群人：建成后逐一打扮（性别、年岁、衣袍、纵深——皆按序号，不用随机）
  function crowd(gid, o, dressFn) {
    const c = C();
    if (!c || !c.crowd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  const cmembers = gid => { const c = C(); const g = hasCrowd(gid) && c.crowds.get(gid); return g ? g.members : []; };
  const cwalk = (gid, x0, x1, o) => { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); };
  const cpose = (gid, p) => { if (hasCrowd(gid)) C().crowdPose(gid, p); };
  const crm = (gid, now) => { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); };
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      m.facing = d;
      if (W.replaying) m.fd = d;
    }
  }
  function crelabel(gid, label) { for (const m of cmembers(gid)) m.label = label; }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  // 衣袍
  const LINEN = [236, 232, 218], LINEN2 = [224, 218, 200], ROYAL = [120, 58, 104], PERSIAN = [96, 70, 128];
  const EXILE = [[132, 104, 78], [110, 88, 72], [150, 118, 90], [98, 84, 76], [124, 104, 88], [108, 98, 112], [142, 100, 82], [158, 138, 108], [118, 110, 96]];
  const WOMEN = [[170, 120, 104], [132, 110, 140], [186, 150, 112], [150, 100, 96], [118, 118, 142], [176, 140, 132]];
  const BABY = [[168, 72, 60], [70, 96, 150], [176, 132, 66], [120, 60, 96], [60, 110, 120]];     // 巴比伦人的衣袍
  const DARK = [[70, 62, 66], [60, 56, 64], [82, 70, 66], [66, 60, 58]];
  const golden = i => ((i * 0.6180339) % 1);
  // 打扮：众百姓（男女老少按序号）
  const folk = (v0, v1, label) => (m, i) => {
    const r = golden(i + 1);
    m.sex = i % 3 === 1 ? 'f' : 'm';
    m.age = i % 7 === 5 ? 'child' : 'adult';
    m.robe = m.sex === 'f' ? WOMEN[i % WOMEN.length] : EXILE[i % EXILE.length];
    m.accent = null; m.hairOpt = null; m.prop = null;
    m.scale = 0.92 + 0.12 * golden(i + 7);
    m.v = lerp(v0, v1, r);
    if (label) m.label = label;
  };
  const elders = (v0, v1) => (m, i) => {
    m.sex = 'm'; m.age = 'elder'; m.robe = EXILE[(i * 3 + 2) % EXILE.length]; m.accent = null; m.hairOpt = null;
    m.prop = 'staff'; m.beardOpt = true; m.v = lerp(v0, v1, golden(i + 3)); m.scale = 0.95;
  };
  const priests = (v0, v1, rb) => (m, i) => {
    m.sex = 'm'; m.age = 'adult'; m.robe = rb || (i % 2 ? LINEN2 : LINEN); m.hairOpt = 'cloth'; m.accent = rb ? [220, 206, 176] : [120, 104, 160];
    m.prop = null; m.v = lerp(v0, v1, golden(i + 5)); m.scale = 0.98;
  };
  const dressed = (pal, v0, v1, sex) => (m, i) => {
    m.sex = sex || (i % 3 === 2 ? 'f' : 'm'); m.age = 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.hairOpt = null; m.prop = null;
    m.v = lerp(v0, v1, golden(i + 2));
  };

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, (l === 2 ? vY(f.nx, f.v || 0) : gY(l, f.nx)) - PH(l) * frac];
  }
  // 一群人的中心（像素）与头顶
  function crowdPt(gid) {
    const ms = cmembers(gid).filter(m => !m.dying);
    if (!ms.length) return null;
    let x = 0, top = Infinity, x0 = Infinity, x1 = -Infinity;
    for (const m of ms) {
      const px = m._vis ? m._x : m.nx * W.w;
      const py = m._vis ? m._y - m._h : vY(m.nx, m.v || 0) - PH(m.layer == null ? 2 : m.layer);
      x += px; top = Math.min(top, py); x0 = Math.min(x0, px); x1 = Math.max(x1, px);
    }
    return { x: x / ms.length, top, x0, x1 };
  }
  const ptOf = key => { if (!key) return null; if (hasCrowd(key)) { const c = crowdPt(key); return c ? [c.x, c.top, c.x1 - c.x0] : null; } const p = figPt(key, 1); return p ? [p[0], p[1], PH(2) * 0.6] : null; };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  function fresh() {
    return {
      vessels: null,    // 谁抬着殿的器皿（人群的名）：器皿的金光在他们手上
      instr: false,     // 祭司的号、利未人的钹
      hand: null,       // 神施恩的手覆在谁上面（人名或人群名）
      eyeX: 0.68,       // 神的眼目看顾的长老在哪里
      scroll: null,     // 谁手里拿着律法书
      rain: false,
    };
  }
  let S = fresh();

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * 0.32));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function vbeam(rgbC, rgbE, headFade) {
    const w = 64, h = 256, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const vy = Math.min(1, v / (headFade || 0.08)) * (v > 0.82 ? Math.pow(Math.max(0, 1 - (v - 0.82) / 0.18), 1.5) : 1);
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1;
        const core = Math.exp(-hx * hx * 12), edge = Math.exp(-hx * hx * 3.4);
        const a = vy * (edge * 0.7 + core * 0.3);
        const i = (y * w + x) * 4;
        d[i] = lerp(rgbE[0], rgbC[0], core); d[i + 1] = lerp(rgbE[1], rgbC[1], core); d[i + 2] = lerp(rgbE[2], rgbC[2], core);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      silver: radial([200, 220, 255], 1), smoke: radial([132, 124, 118], 0.8, 0.55), pearl: radial([252, 246, 236], 1),
      beam: vbeam([255, 250, 232], [255, 230, 176], 0.1), cool: vbeam([236, 242, 255], [196, 214, 255], 0.2),
    };
    return SP;
  }
  function glowAt(ctx, spr, x, y, r, a, sy) {
    if (a <= 0.004 || r <= 0.5) return;
    ctx.globalAlpha = clamp(a, 0, 1);
    const ry = r * (sy || 1);
    ctx.drawImage(spr, x - r, y - ry, r * 2, ry * 2);
  }
  // 火（坛上）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.2, k * (0.28 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3];
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9, y - H * 0.55, sx + Math.sin(W.t * 8 + seed + i) * w * 0.45, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function smoke(ctx, x, y, k, H, w, seed) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 10, day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.5 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  巴比伦（中丘）：城墙、伊施塔尔的蓝门、七层的庙塔、棕树
  // ════════════════════════════════════════════════════════════
  const BRICK = [184, 140, 98], BRICK_D = [146, 106, 76], BITUMEN = [96, 74, 60], GLAZE = [48, 88, 164], GOLD = [236, 194, 104];
  let BAB = null;
  function babModel() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (BAB && BAB.key === key) return BAB;
    const r = U.mulberry32(1515), x0 = X('bab0'), x1 = X('bab1'), zx = X('zig'), gx = X('gate');
    const houses = [];
    const n = 15;
    for (let i = 0; i < n; i++) {
      const xf = lerp(x0 + 0.012, x1 - 0.01, (i + 0.5 + (r() - 0.5) * 0.7) / n);
      const w = 0.6 + r() * 0.7, h = 0.95 + r() * 0.95, dome = r() < 0.16, win = r() < 0.65, dx = r(), garden = r() < 0.18;
      if (Math.abs(xf - zx) < 0.018 || Math.abs(xf - gx) < 0.012) continue;
      houses.push({ xf, w, h, dome, win, dx, garden });
    }
    return (BAB = { key, houses });
  }
  function drawPalm(ctx, l, xf, s, flip) {
    const hm = PH(l), x = xf * W.w, g = gY(l, xf) + 0.1 * hm, H = 1.7 * hm * s;
    const lean = 0.18 * flip * hm * s;
    ctx.strokeStyle = css([88, 70, 52], l);
    ctx.lineWidth = Math.max(0.8, 0.09 * hm * s);
    ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x + lean * 0.2, g - H * 0.5, x + lean, g - H); ctx.stroke();
    ctx.fillStyle = css([58, 86, 52], l);
    const tx = x + lean, ty = g - H;
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.48 + Math.sin(W.t * 0.8 + xf * 30 + i) * 0.04;
      const L = 0.62 * hm * s * (i === 0 || i === 6 ? 0.8 : 1);
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.6 + L * 0.36;
      const mx = tx + Math.cos(a) * L * 0.5, my = ty + Math.sin(a) * L * 0.6 - L * 0.05;
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(mx - Math.sin(a) * L * 0.08, my, ex, ey);
      ctx.quadraticCurveTo(mx + Math.sin(a) * L * 0.08, my + L * 0.06, tx, ty);
    }
    ctx.fill();
  }
  function drawBabylon(ctx) {
    const l = 1, hm = PH(1), un = Math.max(0.5, W.unit), B = babModel();
    const x0 = X('bab0'), x1 = X('bab1'), zx = X('zig'), gx = X('gate');
    const sunL = litX() < W.w * zx;
    const nk = nightK();
    // 棕树（城后）
    drawPalm(ctx, l, x0 - 0.004, 0.9, -1);
    drawPalm(ctx, l, x1 + 0.012, 1.0, 1);
    // 城中的房屋
    const body = css(BRICK, l), side = css(BRICK_D, l), rim = css(lit(BRICK), l, rimA(), 0.08);
    const R = [];
    for (const h of B.houses) {
      const x = h.xf * W.w, w = h.w * hm, g = gY(l, h.xf) + 0.1 * hm, hh = h.h * hm;
      R.push([x - w / 2, g - hh, w, hh + 3 * un, h]);
    }
    ctx.fillStyle = body;
    ctx.beginPath();
    for (const q of R) ctx.rect(q[0], q[1], q[2], q[3]);
    ctx.fill();
    ctx.fillStyle = side;
    ctx.beginPath();
    for (const q of R) { const sw = q[2] * 0.26; ctx.rect(sunL ? q[0] + q[2] - sw : q[0], q[1], sw, q[3]); }
    ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath();
    for (const q of R) if (q[4].dome) { const r0 = q[2] * 0.34; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
    ctx.fill();
    // 空中的园子
    ctx.fillStyle = css([70, 104, 60], l);
    ctx.beginPath();
    for (const q of R) if (q[4].garden) { for (let k = 0; k < 3; k++) { const cx = q[0] + q[2] * (0.2 + 0.3 * k); ctx.moveTo(cx + hm * 0.14, q[1]); ctx.arc(cx, q[1], hm * 0.14, 0, Math.PI, true); } }
    ctx.fill();
    ctx.strokeStyle = rim; ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (const q of R) { const ex = sunL ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.6); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] / 2, q[1]); }
    ctx.stroke();
    // 窗与夜里的灯
    ctx.fillStyle = css([40, 30, 24], l);
    ctx.beginPath();
    for (const q of R) if (q[4].win) { const s = Math.max(1, hm * 0.09); ctx.rect(q[0] + q[2] * (0.3 + 0.4 * q[4].dx), q[1] + q[3] * 0.28, s, s * 1.5); }
    ctx.fill();
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 190, 110, 0.8 * nk);
      ctx.beginPath();
      for (const q of R) if (q[4].win) { const s = Math.max(1, hm * 0.09); ctx.rect(q[0] + q[2] * (0.3 + 0.4 * q[4].dx), q[1] + q[3] * 0.28, s, s * 1.5); }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    // 七层的庙塔
    drawZiggurat(ctx, zx, hm, un, sunL);
    // 城墙与城楼
    const wall = css(mix(BRICK, [200, 170, 130], 0.25), l), wallD = css(BRICK_D, l);
    const wh = 0.78 * hm, cren = Math.max(1.5, hm * 0.16);
    ctx.fillStyle = wall;
    ctx.beginPath();
    let x = x0 * W.w, i = 0;
    const xe = x1 * W.w;
    while (x < xe) {
      const seg = cren * 2, xn = Math.min(xe, x + seg), g0 = gY(l, x / W.w) + 0.14 * hm;
      ctx.rect(x, g0 - wh, xn - x + 0.5, wh + 4 * un);
      ctx.rect(x, g0 - wh - cren * 0.62, cren, cren * 0.62 + 1);
      x = xn; i++;
    }
    const towers = [x0 + 0.004, x0 + (x1 - x0) * 0.36, x1 - 0.004];
    for (const tf of towers) {
      const tx = tf * W.w, g0 = gY(l, tf) + 0.14 * hm, th = wh * 1.45, w = hm * 0.5;
      ctx.rect(tx - w / 2, g0 - th, w, th + 4 * un);
      ctx.rect(tx - w / 2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1);
      ctx.rect(tx + w * 0.2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1);
    }
    ctx.fill();
    ctx.fillStyle = wallD;
    ctx.beginPath();
    x = x0 * W.w;
    while (x < xe) { const g0 = gY(l, x / W.w) + 0.14 * hm; ctx.rect(x, g0 - wh * 0.36, Math.min(cren * 2, xe - x) + 0.5, 1.2 * un); x += cren * 2; }
    ctx.fill();
    // 伊施塔尔的蓝门：两座城楼夹着拱门，釉砖上一行行金色的兽
    const gxx = gx * W.w, gg = gY(l, gx) + 0.14 * hm, gw = 0.95 * hm, gh = wh * 1.75;
    ctx.fillStyle = css(GLAZE, l);
    ctx.fillRect(gxx - gw / 2, gg - gh, gw, gh + 3 * un);
    ctx.fillRect(gxx - gw / 2, gg - gh - cren * 0.62, gw * 0.24, cren * 0.62 + 1);
    ctx.fillRect(gxx - gw * 0.12, gg - gh - cren * 0.62, gw * 0.24, cren * 0.62 + 1);
    ctx.fillRect(gxx + gw * 0.26, gg - gh - cren * 0.62, gw * 0.24, cren * 0.62 + 1);
    ctx.fillStyle = css(GOLD, l, 0.85, 0.1);
    ctx.beginPath();
    for (let row = 0; row < 3; row++) {
      const ry = gg - gh * (0.3 + 0.22 * row);
      for (let k = 0; k < 4; k++) { const rx = gxx - gw * 0.4 + k * gw * 0.26 + (row % 2) * gw * 0.12; ctx.rect(rx, ry, Math.max(1, hm * 0.1), Math.max(0.8, hm * 0.05)); }
    }
    ctx.fill();
    const aw = gw * 0.36, ah = gh * 0.52;
    ctx.fillStyle = css([26, 22, 26], l);
    ctx.beginPath();
    ctx.moveTo(gxx - aw / 2, gg + 1); ctx.lineTo(gxx - aw / 2, gg - ah + aw / 2); ctx.arc(gxx, gg - ah + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(gxx + aw / 2, gg + 1); ctx.closePath();
    ctx.fill();
    if (nk > 0.05 || lv('ezDecree') > 0.05) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, gxx, gg - ah * 0.4, aw * 2.2, 0.5 * Math.max(nk, lv('ezDecree') * 0.6));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = css(lit(GLAZE), l, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    const ex = sunL ? gxx - gw / 2 : gxx + gw / 2;
    ctx.moveTo(ex, gg - gh * 0.3); ctx.lineTo(ex, gg - gh); ctx.lineTo(gxx, gg - gh);
    ctx.stroke();
    // 城前的棕树
    drawPalm(ctx, l, x0 + 0.012, 0.8, 1);
    drawPalm(ctx, l, gx + 0.03, 0.9, -1);
  }
  function drawZiggurat(ctx, zf, hm, un, sunL) {
    const l = 1, x = zf * W.w, g = gY(l, zf) + 0.14 * hm;
    const tiers = [3.6, 2.95, 2.35, 1.82, 1.36, 0.95], th = 0.64 * hm;
    const cols = [BITUMEN, BRICK_D, BRICK, mix(BRICK, [214, 178, 128], 0.4), mix(BRICK, [224, 190, 140], 0.6), [206, 172, 128]];
    let y = g;
    for (let i = 0; i < tiers.length; i++) {
      const w = tiers[i] * hm, h = i === 0 ? th * 1.2 : th;
      ctx.fillStyle = css(cols[i], l);
      ctx.beginPath();
      ctx.moveTo(x - w / 2, y + (i === 0 ? 3 * un : 0)); ctx.lineTo(x - w / 2 + 0.06 * hm, y - h); ctx.lineTo(x + w / 2 - 0.06 * hm, y - h); ctx.lineTo(x + w / 2, y + (i === 0 ? 3 * un : 0));
      ctx.closePath(); ctx.fill();
      // 背光的一面
      ctx.fillStyle = css(dim(cols[i], 0.72), l);
      const sw = w * 0.2;
      ctx.beginPath();
      if (sunL) { ctx.moveTo(x + w / 2 - sw, y); ctx.lineTo(x + w / 2 - sw, y - h); ctx.lineTo(x + w / 2 - 0.06 * hm, y - h); ctx.lineTo(x + w / 2, y); }
      else { ctx.moveTo(x - w / 2 + sw, y); ctx.lineTo(x - w / 2 + sw, y - h); ctx.lineTo(x - w / 2 + 0.06 * hm, y - h); ctx.lineTo(x - w / 2, y); }
      ctx.closePath(); ctx.fill();
      // 迎光的边
      ctx.strokeStyle = css(lit(cols[i]), l, rimA(), 0.08);
      ctx.lineWidth = Math.max(0.5, 0.8 * un);
      ctx.beginPath(); ctx.moveTo(x - w / 2 + 0.06 * hm, y - h); ctx.lineTo(x + w / 2 - 0.06 * hm, y - h); ctx.stroke();
      y -= h;
    }
    // 正面的阶梯
    ctx.fillStyle = css(mix(BRICK, [226, 196, 150], 0.45), l, 0.9);
    ctx.beginPath();
    ctx.moveTo(x - 0.16 * hm, g + 2 * un); ctx.lineTo(x - 0.1 * hm, g - th * 3.2); ctx.lineTo(x + 0.1 * hm, g - th * 3.2); ctx.lineTo(x + 0.16 * hm, g + 2 * un);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(BRICK_D, l, 0.6);
    ctx.lineWidth = Math.max(0.4, 0.5 * un);
    ctx.beginPath();
    for (let k = 1; k < 10; k++) { const yy = lerp(g, g - th * 3.2, k / 10), hw = lerp(0.16, 0.1, k / 10) * hm; ctx.moveTo(x - hw, yy); ctx.lineTo(x + hw, yy); }
    ctx.stroke();
    // 塔顶的小庙（蓝釉）
    const sw = 0.62 * hm, sh = 0.52 * hm;
    ctx.fillStyle = css(GLAZE, l);
    ctx.fillRect(x - sw / 2, y - sh, sw, sh + 1);
    ctx.fillStyle = css(GOLD, l, 0.9, 0.1);
    ctx.fillRect(x - sw / 2, y - sh, sw, Math.max(1, 0.06 * hm));
    const nk = nightK(), far = lv('ezFar');
    if (nk > 0.05 || far > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x, y - sh * 0.5, sw * 1.6, 0.4 * nk);
      glowAt(ctx, SP.pearl, x, y - sh * 0.6, sw * 3.2, 0.55 * far * (0.7 + 0.3 * Math.sin(W.t * 2.2)));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷（中丘右边）：残破的城墙、焦黑的房屋；后来有了房屋；9:9 城墙上的一道金线
  // ════════════════════════════════════════════════════════════
  const STONE = [214, 200, 172], STONE_D = [168, 152, 124], SOOT = [66, 58, 52], CEDAR = [128, 86, 54], TIMBER = [112, 80, 52];
  let JER = null;
  function jerModel() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (JER && JER.key === key) return JER;
    const x0 = X('jer0'), x1 = X('jer1'), hm = PH(1), cren = Math.max(1.5, hm * 0.16) * 2;
    const segs = [];
    let x = x0 * W.w, i = 0;
    while (x < x1 * W.w) {
      const xn = Math.min(x1 * W.w, x + cren);
      const r = hsh(i * 3.7 + 11);
      segs.push({ x, xn, broken: r < 0.58, h: r < 0.58 ? 0.1 + 0.4 * hsh(i + 5) : 0.8 + 0.2 * hsh(i + 7), crest: r > 0.8 });
      x = xn; i++;
    }
    const houses = [];
    for (let k = 0; k < 8; k++) houses.push({ xf: lerp(x0 + 0.02, x1 - 0.02, (k + 0.5) / 8 + (hsh(k * 9 + 1) - 0.5) * 0.06), w: 0.7 + 0.5 * hsh(k + 21), h: 0.8 + 0.5 * hsh(k + 33), th: hsh(k * 5 + 2) * 0.85, dx: hsh(k + 44) });
    const shells = [];
    for (let k = 0; k < 6; k++) shells.push({ xf: lerp(x0 + 0.03, x1 - 0.03, (k + 0.3 + hsh(k + 70) * 0.4) / 6), w: 0.8 + 0.6 * hsh(k + 80), h: 0.6 + 0.6 * hsh(k + 90) });
    return (JER = { key, segs, houses, shells });
  }
  function drawJerusalem(ctx) {
    const l = 1, hm = PH(1), un = Math.max(0.5, W.unit), J = jerModel(), hs = lv('ezHouses'), wl = lv('ezWall');
    const sunL = litX() < W.w * 0.85, nk = nightK();
    // 焦黑的房屋空壳
    ctx.fillStyle = css(mix(STONE_D, SOOT, 0.55), l);
    ctx.beginPath();
    for (const s of J.shells) {
      const x = s.xf * W.w, w = s.w * hm, g = gY(l, s.xf) + 0.1 * hm, h = s.h * hm;
      ctx.moveTo(x - w / 2, g + 2);
      for (let k = 0; k <= 4; k++) ctx.lineTo(x - w / 2 + w * k / 4, g - h * (0.4 + 0.6 * hsh(s.xf * 99 + k)));
      ctx.lineTo(x + w / 2, g + 2); ctx.closePath();
    }
    ctx.fill();
    // 归回的人重新住下的房屋（平顶，门前有灯）
    if (hs > 0.01) {
      const R = [];
      for (const h of J.houses) {
        const v = clamp((hs - h.th) / 0.15, 0, 1);
        if (v <= 0) continue;
        const x = h.xf * W.w, w = h.w * hm, g = gY(l, h.xf) + 0.1 * hm, hh = h.h * hm * U.easeOut(v);
        R.push([x - w / 2, g - hh, w, hh + 3 * un, h, v]);
      }
      const HOUSE = [230, 212, 176];
      ctx.fillStyle = css(HOUSE, l);
      ctx.beginPath();
      for (const q of R) ctx.rect(q[0], q[1], q[2], q[3]);
      ctx.fill();
      ctx.fillStyle = css(dim(HOUSE, 0.8), l);
      ctx.beginPath();
      for (const q of R) { const sw = q[2] * 0.24; ctx.rect(sunL ? q[0] + q[2] - sw : q[0], q[1], sw, q[3]); }
      ctx.fill();
      ctx.fillStyle = css(CEDAR, l);
      ctx.beginPath();
      for (const q of R) if (q[5] > 0.9) ctx.rect(q[0] - 0.6 * un, q[1] - 1.4 * un, q[2] + 1.2 * un, 1.6 * un);
      ctx.fill();
      ctx.fillStyle = css([40, 30, 24], l);
      ctx.beginPath();
      for (const q of R) if (q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.14); ctx.rect(q[0] + q[2] * (0.3 + 0.4 * q[4].dx) - dw / 2, q[1] + q[3] - 3 * un - hm * 0.38, dw, hm * 0.38); }
      ctx.fill();
      const lamp = Math.max(nk, lv('ezLamp')) * 0.9;
      if (lamp > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 196, 120, 0.85 * lamp);
        ctx.beginPath();
        for (const q of R) if (q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.14); ctx.rect(q[0] + q[2] * (0.3 + 0.4 * q[4].dx) - dw / 2, q[1] + q[3] - 3 * un - hm * 0.38, dw, hm * 0.38); }
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 残破的城墙
    const wh = 0.72 * hm, cr = Math.max(1.5, hm * 0.16);
    const wc = mix(mix(STONE, STONE_D, 0.6), SOOT, 0.5);
    ctx.fillStyle = css(wc, l);
    ctx.beginPath();
    for (const s of J.segs) {
      const g0 = gY(l, s.x / W.w) + 0.14 * hm, h = wh * s.h;
      if (s.broken) {
        ctx.moveTo(s.x, g0 + 3 * un); ctx.lineTo(s.x, g0 - h * hsh(s.x)); ctx.lineTo((s.x + s.xn) / 2, g0 - h); ctx.lineTo(s.xn, g0 - h * 0.7 * hsh(s.x + 1)); ctx.lineTo(s.xn, g0 + 3 * un); ctx.closePath();
      } else {
        ctx.rect(s.x, g0 - h, s.xn - s.x + 0.5, h + 3 * un);
        if (s.crest) ctx.rect(s.x, g0 - h - cr * 0.6, cr * 0.9, cr * 0.6 + 1);
      }
    }
    ctx.fill();
    // 乱石堆（缺口处）
    ctx.fillStyle = css(mix(STONE_D, SOOT, 0.3), l);
    ctx.beginPath();
    for (const s of J.segs) if (s.broken) { const cx = (s.x + s.xn) / 2, g0 = gY(l, cx / W.w) + 0.16 * hm, r0 = (s.xn - s.x) * 0.9; ctx.moveTo(cx + r0, g0 + 2); ctx.ellipse(cx, g0 + 2, r0, r0 * 0.5, 0, 0, Math.PI, true); }
    ctx.fill();
    // 9:9 「使我们在犹大和耶路撒冷有墙垣」：一道金线沿着城墙描出（越过缺口）
    if (wl > 0.01) {
      SP || sprites();
      const n = J.segs.length, upto = Math.max(1, Math.round(n * clamp(wl * 1.15, 0, 1)));
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const pass of [[3.2, 0.14], [1.1, 0.75]]) {
        ctx.strokeStyle = U.rgba(255, 222, 150, pass[1] * wl);
        ctx.lineWidth = Math.max(0.6, pass[0] * un);
        ctx.beginPath();
        for (let i = 0; i < upto; i++) {
          const s = J.segs[i], g0 = gY(l, s.x / W.w) + 0.14 * hm;
          if (i) ctx.lineTo(s.x, g0 - wh); else ctx.moveTo(s.x, g0 - wh);
          ctx.lineTo(s.xn, g0 - wh);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  河（近地）：自巴比伦那边流来，往前流向观者；柳树，树上挂着琴
  // ════════════════════════════════════════════════════════════
  function riverPts() {
    const P = X('riv'), out = [];
    const N = 24;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      // 折线上按段插值（平滑）
      const segN = P.length - 1, f = t * segN, k = Math.min(segN - 1, Math.floor(f)), u = f - k;
      const a = P[Math.max(0, k - 1)], b = P[k], c = P[k + 1], d = P[Math.min(segN, k + 2)];
      const cr = (p0, p1, p2, p3) => 0.5 * ((2 * p1) + (-p0 + p2) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
      const xf = cr(a[0], b[0], c[0], d[0]), v = cr(a[1], b[1], c[1], d[1]);
      out.push([xf, clamp(v, 0, 1.02)]);
    }
    return out;
  }
  function drawRiver(ctx) {
    const pts = riverPts(), un = Math.max(0.5, W.unit), wk = tall() ? 1.5 : 1;
    const L = [], R = [];
    for (const p of pts) {
      const y = vY(p[0], p[1]) + (p[1] >= 1 ? 4 : 0), w = (0.005 + 0.045 * Math.pow(p[1], 1.15)) * W.w * wk;
      L.push([p[0] * W.w - w * 0.9, y]); R.push([p[0] * W.w + w * 1.1, y]);
    }
    const y0 = L[0][1], y1 = L[L.length - 1][1];
    const far = mix(W.shade([120, 156, 190], 0), W.haze || [160, 180, 200], 0.45), near = W.shade([44, 78, 108], 0);
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, U.rgb(far[0], far[1], far[2])); g.addColorStop(1, U.rgb(near[0], near[1], near[2]));
    // 泥岸（比水宽一点）
    ctx.fillStyle = W.shadeCSS([92, 80, 58], 0, 0.55);
    ctx.beginPath();
    L.forEach((q, i) => (i ? ctx.lineTo(q[0] - 2 * un - i * 0.12 * un, q[1]) : ctx.moveTo(q[0] - 1, q[1])));
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0] + 2 * un + i * 0.12 * un, R[i][1]);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = g;
    ctx.beginPath();
    L.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath(); ctx.fill();
    // 水上的光纹（远处细密，近处疏长）
    const hi = mix(W.shade([200, 220, 236], 0), [255, 244, 214], W.dusk * 0.6);
    ctx.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.45 + 0.2 * W.daylight);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (let i = 1; i < pts.length - 1; i++) {
      const ph = U.fract(W.t * 0.1 + hsh(i) * 3);
      const a = L[i], b = R[i], x = lerp(a[0], b[0], 0.2 + 0.6 * hsh(i * 7 + Math.floor(W.t * 0.1 + hsh(i) * 3))), w = (b[0] - a[0]) * (0.08 + 0.12 * Math.sin(Math.PI * ph));
      ctx.moveTo(x - w, a[1]); ctx.lineTo(x + w, a[1]);
    }
    ctx.stroke();
    // 岸边的芦苇
    ctx.strokeStyle = css([112, 126, 74], 2, 0.9);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    const hm = PH(2);
    for (let i = 2; i < pts.length; i += 2) {
      for (const side of [L, R]) {
        const q = side[i], k = pts[i][1], h = hm * (0.18 + 0.3 * k) * (0.7 + 0.5 * hsh(i * 3 + (side === L ? 1 : 2)));
        for (let j = -1; j <= 1; j++) {
          const sway = Math.sin(W.t * 1.1 + i + j) * h * 0.08;
          ctx.moveTo(q[0] + j * 2 * un, q[1]); ctx.quadraticCurveTo(q[0] + j * 3 * un, q[1] - h * 0.6, q[0] + j * 4 * un + sway, q[1] - h);
        }
      }
    }
    ctx.stroke();
    // 被激动的心：河边升起的微光（1:5）
    const st = lv('ezStir');
    if (st > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 16; i++) {
        const ph = U.fract(W.t * 0.09 + hsh(i));
        const xf = lerp(X('camp0'), X('camp1'), hsh(i * 3 + 1)), v = 0.1 + 0.4 * hsh(i * 7 + 2);
        const x = xf * W.w + Math.sin(W.t * 0.8 + i) * 6 * un, y = vY(xf, v) - ph * PH(2) * 2.4;
        glowAt(ctx, SP.gold, x, y, (3 + 3 * hsh(i + 9)) * un, st * (1 - ph) * Math.min(1, ph * 5) * 0.9);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 河边的柳树（诗 137:2：「我们把琴挂在那里的柳树上」）
  function drawWillow(ctx, xf, v, s) {
    const hm = PH(2), x = xf * W.w, g = vY(xf, v) + 2, H = 2.6 * hm * s, un = Math.max(0.5, W.unit);
    const lean = 0.12 * hm * s;
    // 树干与三根大枝
    ctx.strokeStyle = css([66, 52, 40], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 0.15 * hm * s);
    ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x - 0.1 * hm * s, g - H * 0.35, x + lean, g - H * 0.55); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, 0.07 * hm * s);
    ctx.beginPath();
    const cx = x + lean, cy = g - H * 0.55;
    for (const a of [-2.2, -1.57, -0.9]) { ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + Math.cos(a) * H * 0.18, cy + Math.sin(a) * H * 0.3, cx + Math.cos(a) * H * 0.32, cy + Math.sin(a) * H * 0.34); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 树冠：几团柔软的绿
    const top = g - H * 0.86, cw = H * 0.46;
    ctx.fillStyle = css([92, 112, 70], 2, 0.95);
    ctx.beginPath();
    for (let k = 0; k < 5; k++) {
      const ex = cx + (k - 2) * cw * 0.34, ey = top + Math.abs(k - 2) * H * 0.07, rx = cw * (0.36 - 0.03 * Math.abs(k - 2)), ry = H * 0.13;
      ctx.moveTo(ex + rx, ey); ctx.ellipse(ex, ey, rx, ry, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([124, 146, 92], 2, 0.8, 0.04);
    ctx.beginPath();
    for (let k = 0; k < 4; k++) { const ex = cx + (k - 1.5) * cw * 0.3 + (litX() > x ? cw * 0.06 : -cw * 0.06), ey = top - H * 0.05 + Math.abs(k - 1.5) * H * 0.05; ctx.moveTo(ex + cw * 0.2, ey); ctx.ellipse(ex, ey, cw * 0.2, H * 0.07, 0, 0, TAU); }
    ctx.fill();
    // 垂下的柳条
    ctx.strokeStyle = css([132, 156, 96], 2, 0.9, 0.03);
    ctx.lineWidth = Math.max(0.6, 0.95 * un);
    ctx.beginPath();
    const n = 24, ends = [];
    for (let j = 0; j < n; j++) {
      const u = j / (n - 1), sx = cx + (u - 0.5) * cw * 1.6, sy = top + H * 0.08 + Math.sin(u * Math.PI) * H * 0.05;
      const L = H * (0.42 + 0.34 * hsh(j * 5 + xf * 50)) * (1 - 0.3 * Math.abs(u - 0.5));
      const sway = Math.sin(W.t * 0.9 + j * 0.7 + xf * 20) * 0.05 * hm;
      ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + sway, sy + L * 0.5, sx + sway * 2 + (u - 0.5) * 0.1 * hm, sy + L);
      ends.push([sx + sway, sy + L * 0.45]);
    }
    ctx.stroke();
    // 琴挂在柳树上（被激动的心起来以后就取下了）
    const hp = lv('ezHarps');
    if (hp > 0.02) {
      ctx.globalAlpha = hp;
      for (const j of [4, 12]) {
        const t = ends[j], hh = 0.26 * hm * s, sway = Math.sin(W.t * 0.7 + j) * 0.06;
        ctx.save(); ctx.translate(t[0], t[1]); ctx.rotate(sway);
        ctx.strokeStyle = css([150, 108, 64], 2, 1, 0.05); ctx.lineWidth = Math.max(0.7, 0.05 * hm);
        ctx.beginPath(); ctx.moveTo(-hh * 0.3, 0); ctx.quadraticCurveTo(-hh * 0.42, hh * 0.55, -hh * 0.14, hh); ctx.lineTo(hh * 0.14, hh); ctx.quadraticCurveTo(hh * 0.42, hh * 0.55, hh * 0.3, 0); ctx.lineTo(-hh * 0.3, 0); ctx.stroke();
        ctx.strokeStyle = css([232, 222, 196], 2, 0.45); ctx.lineWidth = Math.max(0.35, 0.35 * un);
        ctx.beginPath(); for (let q = -1; q <= 1; q++) { ctx.moveTo(q * hh * 0.1, hh * 0.05); ctx.lineTo(q * hh * 0.07, hh * 0.95); } ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
  }
  // 四围的人送来的金银、财物（1:6）
  function drawGifts(ctx) {
    const k = lv('ezGifts');
    if (k < 0.01) return;
    const hm = PH(2), un = Math.max(0.5, W.unit);
    SP || sprites();
    const spots = [[0.02, 0.3], [0.045, 0.18], [0.07, 0.36]];
    for (let i = 0; i < spots.length; i++) {
      const xf = X('camp1') - spots[i][0], y = vY(xf, spots[i][1]), x = xf * W.w, w = 0.3 * hm;
      ctx.globalAlpha = k;
      ctx.fillStyle = css([150, 118, 84], 2);
      ctx.beginPath(); ctx.ellipse(x, y - w * 0.3, w * 0.6, w * 0.34, 0, 0, TAU); ctx.fill();     // 包袱
      ctx.fillStyle = css([226, 186, 96], 2, 1, 0.12);
      ctx.beginPath(); ctx.ellipse(x + w * 0.4, y - w * 0.12, w * 0.24, w * 0.12, 0, 0, TAU); ctx.fill();   // 金器
      ctx.fillStyle = css([212, 216, 226], 2, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(x - w * 0.46, y - w * 0.1, w * 0.2, w * 0.1, 0, 0, TAU); ctx.fill();    // 银器
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x + w * 0.4, y - w * 0.2, w * (0.7 + 0.2 * Math.sin(W.t * 3 + i)), k * 0.45 * (0.5 + 0.5 * W.daylight));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    void un;
  }
  // 亚哈瓦河边的帐棚（8:15）
  function drawTents(ctx) {
    const k = lv('ezTents');
    if (k < 0.01) return;
    const hm = PH(2), un = Math.max(0.5, W.unit), nk = nightK();
    const xs = X('tents');
    xs.forEach((xf, i) => {
      const v = 0.02 + 0.06 * hsh(i + 3), x = xf * W.w, y = vY(xf, v) + 2, hw = 0.62 * hm * (0.9 + 0.2 * hsh(i)), h = 0.62 * hm;
      ctx.globalAlpha = k;
      ctx.fillStyle = css(i % 2 ? [74, 60, 52] : [92, 74, 60], 2);
      ctx.beginPath();
      ctx.moveTo(x - hw, y); ctx.lineTo(x - hw * 0.62, y - h * 0.82); ctx.lineTo(x, y - h); ctx.lineTo(x + hw * 0.62, y - h * 0.84); ctx.lineTo(x + hw, y); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = css([24, 18, 14], 2);
      ctx.beginPath(); ctx.moveTo(x - hw * 0.16, y); ctx.lineTo(x, y - h * 0.62); ctx.lineTo(x + hw * 0.16, y); ctx.closePath(); ctx.fill();
      if (nk > 0.05) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = k * nk * 0.6;
        ctx.fillStyle = 'rgb(255,170,90)';
        ctx.beginPath(); ctx.moveTo(x - hw * 0.16, y); ctx.lineTo(x, y - h * 0.62); ctx.lineTo(x + hw * 0.16, y); ctx.closePath(); ctx.fill();
        glowAt(ctx, SP.warm, x, y - h * 0.3, hw * 1.3, k * nk * 0.4);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = k * 0.5;
      ctx.strokeStyle = css([220, 196, 160], 2, 1, 0.2); ctx.lineWidth = Math.max(0.5, un);
      ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + hw * 0.62, y - h * 0.84); ctx.lineTo(x + hw, y); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  殿址（近地）：乱石焦木 → 坛 → 根基 → 殿墙（三层大石头，一层新木头）→ 灯
  // ════════════════════════════════════════════════════════════
  let TG = null;
  function temple() {
    if (TG && TG.f === W.frame && TG.w === W.w && TG.h === W.h) return TG;
    const hm = PH(2), tu = 3.6 * hm, x0 = X('tx0') * W.w, x1 = x0 + tu;
    let gMin = Infinity, gMax = -Infinity;
    for (let i = 0; i <= 10; i++) { const g = gY(2, (x0 - 0.12 * tu + (i / 10) * 1.16 * tu) / W.w); gMin = Math.min(gMin, g); gMax = Math.max(gMax, g); }
    const top = gMin - 0.075 * tu;
    const ax = x0 - 0.25 * tu, ag = gY(2, ax / W.w) + 0.04 * hm;
    return (TG = { f: W.frame, w: W.w, h: W.h, hm, tu, x0, x1, top, gMax, hH: 0.5 * tu, hP: 0.66 * tu, ax, ag, aw: 0.21 * tu, ah: 0.13 * tu, px0: x0 - 0.1 * tu, px1: x1 + 0.03 * tu });
  }
  const altX = () => { const t = temple(); return t.ax / W.w; };
  const cornX = () => { const t = temple(); return t.px0 / W.w; };
  const courtR = () => [altX() - (tall() ? 0.19 : 0.2), altX() - 0.035];
  // 石的块：一行一行（x0..x1，y 自 yTop 往下到地）
  function courses(ctx, t, yTop, rows, col, joint, glowK) {
    const un = Math.max(0.5, W.unit), rh = 0.028 * t.tu;
    ctx.strokeStyle = joint;
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let r = 0; r < rows; r++) {
      const y = yTop + r * rh;
      if (y > t.gMax + 2) break;
      ctx.moveTo(t.px0, y); ctx.lineTo(t.px1, y);
      const bw = (0.07 + 0.02 * (r % 2)) * t.tu;
      for (let x = t.px0 + (r % 2) * bw * 0.5; x < t.px1; x += bw) { ctx.moveTo(x, y); ctx.lineTo(x, y + rh); }
    }
    ctx.stroke();
    if (glowK > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 214, 130, 0.5 * glowK);
      ctx.lineWidth = Math.max(0.6, 0.9 * un);
      ctx.beginPath(); ctx.moveTo(t.px0, yTop); ctx.lineTo(t.px1, yTop); ctx.stroke();
      ctx.restore();
    }
    void col;
  }
  function groundPoly(ctx, t, yTopFn) {
    // 自地面（沿坡）到 yTop 的多边形
    const n = 16;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(t.px0, t.px1, i / n); const g = gY(2, x / W.w) + 3; if (i) ctx.lineTo(x, g); else ctx.moveTo(x, g); }
    for (let i = n; i >= 0; i--) { const x = lerp(t.px0, t.px1, i / n); ctx.lineTo(x, Math.min(gY(2, x / W.w) + 3, yTopFn(x))); }
    ctx.closePath();
  }
  function drawSite(ctx) {
    const t = temple(), un = Math.max(0.5, W.unit), hm = t.hm, tu = t.tu;
    const ruin = lv('ezRuin'), fd = lv('ezFound'), b = lv('ezBuild'), weeds = lv('ezWeeds');
    const sunL = litX() < t.x0 + tu * 0.5;
    // ── 根基（殿台）：一层一层立定 ──
    if (fd > 0.004) {
      const yF = lerp(t.gMax + 2, t.top, fd);
      const body = mix(STONE, [196, 180, 150], 0.35);
      ctx.fillStyle = css(body, 2);
      groundPoly(ctx, t, () => yF);
      ctx.fill();
      ctx.save();
      groundPoly(ctx, t, () => yF); ctx.clip();
      courses(ctx, t, yF, 12, body, css(dim(body, 0.66), 2, 0.55), lv('ezStone') * (1 - weeds));
      ctx.restore();
      // 台阶（在廊前）
      if (fd > 0.7) {
        const s0 = t.px0 - 0.07 * tu, s1 = t.px0, n = 4;
        ctx.fillStyle = css(dim(body, 0.92), 2);
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const yy = lerp(gY(2, s0 / W.w) + 2, yF, (i + 1) / n);
          const xa = lerp(s0, s1, i / n);
          ctx.rect(xa, yy, s1 - xa + 1, gY(2, xa / W.w) + 3 - yy);
        }
        ctx.fill();
      }
      ctx.strokeStyle = css(lit(body), 2, rimA(), 0.1);
      ctx.lineWidth = Math.max(0.8, 1.2 * un);
      ctx.beginPath(); ctx.moveTo(t.px0, yF); ctx.lineTo(t.px1, yF); ctx.stroke();
      // 房角石
      const st = lv('ezStone');
      const cx = t.px0 + 0.035 * tu, cy = yF + 0.028 * tu;
      ctx.fillStyle = css(mix(body, [240, 226, 190], 0.35), 2, 1, 0.08 * st);
      ctx.fillRect(t.px0, yF, 0.075 * tu, Math.min(0.056 * tu, t.gMax - yF));
      if (st > 0.02 && weeds < 0.9) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, cx, cy, 0.22 * tu * (0.9 + 0.1 * Math.sin(W.t * 2)), st * 0.7 * (1 - weeds));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    // ── 殿墙 ──
    if (b > 0.004) drawWalls(ctx, t, b, sunL);
    // ── 乱石与焦木（被掳之前的殿的废墟）──
    if (ruin > 0.01) drawRuin(ctx, t, ruin);
    // ── 荒凉：根基上的草与荆棘 ──
    if (weeds > 0.01) {
      ctx.strokeStyle = css([96, 118, 64], 2, 0.9 * weeds);
      ctx.lineWidth = Math.max(0.6, 0.9 * un);
      ctx.beginPath();
      const yF = lerp(t.gMax + 2, t.top, fd);
      for (let i = 0; i < 34; i++) {
        const x = lerp(t.px0 + 0.02 * tu, t.px1 - 0.02 * tu, hsh(i * 1.7 + 3)), base = Math.min(yF, gY(2, x / W.w)) + 1;
        const h = (0.03 + 0.06 * hsh(i + 7)) * tu * weeds;
        for (let j = -1; j <= 1; j++) { ctx.moveTo(x, base); ctx.quadraticCurveTo(x + j * 0.01 * tu, base - h * 0.6, x + j * 0.02 * tu, base - h); }
      }
      ctx.stroke();
      ctx.strokeStyle = css([70, 58, 44], 2, 0.8 * weeds);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const x = lerp(t.px0 + 0.1 * tu, t.px1 - 0.1 * tu, hsh(i * 5.1 + 1)), base = Math.min(yF, gY(2, x / W.w)) + 1, r0 = 0.05 * tu * weeds;
        for (let j = 0; j < 6; j++) { const a = -Math.PI * (0.1 + 0.8 * j / 5); ctx.moveTo(x, base); ctx.lineTo(x + Math.cos(a) * r0, base + Math.sin(a) * r0 * 0.8); }
      }
      ctx.stroke();
    }
    // ── 香柏木（堆在殿台的右边）──
    const bm = lv('ezBeams');
    if (bm > 0.01) {
      const bx = t.px1 + 0.02 * tu, by = gY(2, bx / W.w) + 2, L = 0.34 * tu, r0 = 0.018 * tu;
      ctx.globalAlpha = bm;
      for (let row = 0; row < 3; row++) {
        for (let k = 0; k < 4 - row; k++) {
          const cx = bx + (k + row * 0.5) * r0 * 2.1, cy = by - r0 - row * r0 * 1.8;
          ctx.fillStyle = css(CEDAR, 2);
          ctx.fillRect(cx - r0, cy - r0, L * 0.05 + r0 * 0.2, r0 * 2);
          ctx.fillStyle = css([196, 150, 106], 2, 1, 0.05);
          ctx.beginPath(); ctx.ellipse(cx - r0, cy, r0 * 0.5, r0, 0, 0, TAU); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    // ── 坛（在原有的根基上）──
    drawAltar(ctx, t);
    // ── 十二点火（6:17）──
    const tr = lv('ezTribes');
    if (tr > 0.01) {
      const yF = lerp(t.gMax + 2, t.top, fd);
      for (let i = 0; i < 12; i++) {
        const x = lerp(t.px0 + 0.1 * tu, t.px1 - 0.06 * tu, i / 11);
        flame(ctx, x, Math.min(yF, gY(2, x / W.w)) + 0.5, 0.075 * tu * clamp(tr * 1.3 - i * 0.025, 0, 1), tr, i * 3.1);
      }
    }
    // ── 圣所里的一颗钉子般的光（9:8）──
    const pg = lv('ezPeg');
    if (pg > 0.01 && b > 0.9) {
      SP || sprites();
      const px = t.x0 + 0.11 * tu, py = t.top - t.hP * 0.62;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, px, py, 0.5 * tu * (0.9 + 0.1 * Math.sin(W.t * 1.6)), pg * 0.55);
      glowAt(ctx, SP.white, px, py, 0.08 * tu, pg);
      ctx.strokeStyle = U.rgba(255, 244, 214, 0.55 * pg);
      ctx.lineWidth = Math.max(0.6, 0.8 * un);
      ctx.beginPath();
      const r1 = 0.2 * tu * (1 + 0.08 * Math.sin(W.t * 2.3));
      ctx.moveTo(px - r1, py); ctx.lineTo(px + r1, py); ctx.moveTo(px, py - r1 * 1.2); ctx.lineTo(px, py + r1 * 0.7);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  function drawRuin(ctx, t, k) {
    const tu = t.tu, un = Math.max(0.5, W.unit);
    ctx.globalAlpha = clamp(k * 1.2, 0, 1);
    // 两段残墙
    ctx.fillStyle = css(mix(STONE_D, SOOT, 0.45), 2);
    ctx.beginPath();
    for (const w of [[0.28, 0.2, 0.09], [0.74, 0.3, 0.07]]) {
      const x = t.x0 + w[0] * tu, g = gY(2, x / W.w) + 2, h = w[1] * tu * k, ww = w[2] * tu;
      ctx.moveTo(x - ww / 2, g); ctx.lineTo(x - ww / 2, g - h * 0.7); ctx.lineTo(x - ww * 0.1, g - h); ctx.lineTo(x + ww * 0.2, g - h * 0.8); ctx.lineTo(x + ww / 2, g - h * 0.55); ctx.lineTo(x + ww / 2, g);
      ctx.closePath();
    }
    ctx.fill();
    // 焦木
    ctx.strokeStyle = css([40, 32, 28], 2);
    ctx.lineWidth = Math.max(1, 0.018 * tu);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const x = lerp(t.px0 + 0.1 * tu, t.px1 - 0.1 * tu, hsh(i * 4.3 + 2)), g = gY(2, x / W.w) + 1, L = (0.12 + 0.1 * hsh(i + 1)) * tu * k, a = -Math.PI / 2 + (hsh(i + 8) - 0.5) * 1.6;
      ctx.moveTo(x, g); ctx.lineTo(x + Math.cos(a) * L, g + Math.sin(a) * L);
    }
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 乱石
    for (let i = 0; i < 30; i++) {
      const u = hsh(i * 2.3 + 1), x = lerp(t.px0, t.px1, u), g = gY(2, x / W.w) + 2;
      const pile = Math.sin(Math.PI * u) * 0.07 * tu * hsh(i + 13) * k;
      const r0 = (0.022 + 0.03 * hsh(i + 5)) * tu, y = g - pile - r0 * 0.4;
      ctx.fillStyle = css(mix(STONE_D, SOOT, 0.2 + 0.4 * hsh(i + 17)), 2);
      ctx.beginPath();
      ctx.moveTo(x - r0, y + r0 * 0.5); ctx.lineTo(x - r0 * 0.7, y - r0 * 0.4); ctx.lineTo(x + r0 * 0.5, y - r0 * 0.55); ctx.lineTo(x + r0, y + r0 * 0.4); ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = css([90, 116, 60], 2, 0.7);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (let i = 0; i < 20; i++) { const x = lerp(t.px0, t.px1, hsh(i * 3.9 + 4)), g = gY(2, x / W.w) + 2, h = 0.05 * tu * hsh(i + 2); ctx.moveTo(x, g); ctx.lineTo(x + 0.01 * tu, g - h); ctx.moveTo(x, g); ctx.lineTo(x - 0.012 * tu, g - h * 0.8); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawWalls(ctx, t, b, sunL) {
    const tu = t.tu, un = Math.max(0.5, W.unit), top = t.top;
    const hk = clamp(b / 0.86, 0, 1), pk = clamp((b - 0.08) / 0.86, 0, 1);
    const hH = t.hH * hk, hP = t.hP * pk;
    const hx0 = t.x0 + 0.2 * tu, hx1 = t.x1, px0 = t.x0, px1 = t.x0 + 0.22 * tu;
    const body = STONE, bodyD = dim(STONE, 0.8);
    // 殿身
    if (hH > 0.5) {
      ctx.fillStyle = css(body, 2);
      ctx.fillRect(hx0, top - hH, hx1 - hx0, hH + 1);
      ctx.fillStyle = css(bodyD, 2);
      const sw = (hx1 - hx0) * 0.12;
      ctx.fillRect(sunL ? hx1 - sw : hx0, top - hH, sw, hH + 1);
    }
    if (hP > 0.5) {
      ctx.fillStyle = css(sunL ? lit(body) : bodyD, 2, null, sunL ? 0.03 : 0);
      ctx.fillRect(px0, top - hP, px1 - px0, hP + 1);
    }
    // 三层大石头，一层新木头（6:4）
    const band = t.hH / 12;
    ctx.fillStyle = css(TIMBER, 2);
    ctx.beginPath();
    for (let j = 3; j < 13; j += 4) {
      const y = top - (j + 1) * band;
      if (top - y > hH + 0.5) break;
      ctx.rect(hx0, y, hx1 - hx0, band * 0.8);
    }
    for (let j = 3; j < 16; j += 4) {
      const y = top - (j + 1) * band;
      if (top - y > hP + 0.5) break;
      ctx.rect(px0, y, px1 - px0, band * 0.8);
    }
    ctx.fill();
    ctx.strokeStyle = css(dim(body, 0.66), 2, 0.3);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let y = top - band; y > top - Math.max(hH, hP); y -= band) {
      if (top - y <= hH) { ctx.moveTo(hx0, y); ctx.lineTo(hx1, y); }
      if (top - y <= hP) { ctx.moveTo(px0, y); ctx.lineTo(px1, y); }
    }
    ctx.stroke();
    // 竣工：檐、门、窗
    const done = sm(0.9, 1, b);
    const lamp = clamp(lv('ezLamp') + nightK() * 0.35 * done, 0, 1);
    if (done > 0.01) {
      ctx.globalAlpha = done;
      ctx.fillStyle = css(lit(body), 2, null, 0.05);
      ctx.fillRect(hx0 - 0.01 * tu, top - t.hH - 0.03 * tu, hx1 - hx0 + 0.02 * tu, 0.03 * tu);
      ctx.fillRect(px0 - 0.015 * tu, top - t.hP - 0.035 * tu, px1 - px0 + 0.03 * tu, 0.035 * tu);
      ctx.fillStyle = css(dim(body, 0.6), 2, 0.6);
      ctx.fillRect(hx0, top - t.hH, hx1 - hx0, 0.01 * tu);
      ctx.fillRect(px0, top - t.hP, px1 - px0, 0.01 * tu);
      // 窗
      ctx.fillStyle = css([36, 28, 24], 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) { const wx = lerp(hx0 + 0.1 * tu, hx1 - 0.08 * tu, i / 5); ctx.rect(wx - 0.008 * tu, top - t.hH * 0.8, 0.016 * tu, t.hH * 0.2); }
      ctx.fill();
      // 门
      const dw = 0.09 * tu, dh = 0.3 * tu, dx = (px0 + px1) / 2;
      ctx.fillStyle = css(dim(body, 0.7), 2);
      ctx.fillRect(dx - dw / 2 - 0.02 * tu, top - dh - 0.03 * tu, dw + 0.04 * tu, dh + 0.03 * tu);
      const inner = clamp(0.25 + 0.75 * lamp, 0, 1);
      ctx.fillStyle = U.rgba(lerp(38, 255, inner * 0.9), lerp(30, 206, inner * 0.9), lerp(24, 128, inner * 0.9), 1);
      ctx.fillRect(dx - dw / 2, top - dh, dw, dh);
      if (lamp > 0.02) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 214, 130, 0.8 * lamp);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) { const wx = lerp(hx0 + 0.1 * tu, hx1 - 0.08 * tu, i / 5); ctx.rect(wx - 0.008 * tu, top - t.hH * 0.8, 0.016 * tu, t.hH * 0.2); }
        ctx.fill();
        glowAt(ctx, SP.warm, dx, top - dh * 0.5, dh * 1.4, lamp * 0.55 * done);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
    // 迎光的边
    ctx.strokeStyle = css(lit(body), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.8, 1.2 * un);
    ctx.beginPath();
    if (hP > 0.5) { if (sunL) { ctx.moveTo(px0, top); ctx.lineTo(px0, top - hP); } ctx.moveTo(px0, top - hP); ctx.lineTo(px1, top - hP); }
    if (hH > 0.5) { ctx.moveTo(px1, top - hH); ctx.lineTo(hx1, top - hH); if (!sunL) ctx.lineTo(hx1, top); }
    ctx.stroke();
    // 脚手架
    const sc = lv('ezScaf');
    if (sc > 0.01) {
      const yT = top - Math.max(hH, hP) - 0.08 * tu;
      ctx.globalAlpha = sc * 0.8;
      ctx.strokeStyle = css([104, 78, 54], 2);
      ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath();
      const xs = [];
      for (let i = 0; i <= 6; i++) xs.push(lerp(t.x0 - 0.03 * tu, t.x1 + 0.02 * tu, i / 6));
      for (const x of xs) { ctx.moveTo(x, top); ctx.lineTo(x, Math.min(top - 0.1 * tu, yT)); }
      for (let y = top - 0.12 * tu; y > yT; y -= 0.12 * tu) { ctx.moveTo(xs[0], y); ctx.lineTo(xs[xs.length - 1], y); }
      for (let i = 0; i < xs.length - 1; i += 2) { ctx.moveTo(xs[i], top - 0.12 * tu); ctx.lineTo(xs[i + 1], Math.max(yT, top - 0.24 * tu)); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  function drawAltar(ctx, t) {
    const k = lv('ezAltar');
    if (k < 0.01) return;
    const un = Math.max(0.5, W.unit), x = t.ax, g = t.ag, w = t.aw, h = t.ah * clamp(k, 0, 1);
    // 未经凿的石头，一层一层垒起
    const rows = 4, rh = t.ah / rows;
    for (let r = 0; r < rows; r++) {
      const y0 = g - r * rh;
      if (g - y0 >= h) break;
      const hh = Math.min(rh, h - (g - y0));
      const n = 3 + (r % 2);
      for (let i = 0; i < n; i++) {
        const xa = x - w / 2 + (i / n) * w, xb = x - w / 2 + ((i + 1) / n) * w, jit = (hsh(r * 7 + i) - 0.5) * 0.12 * rh;
        ctx.fillStyle = css(mix(STONE_D, [150, 136, 112], hsh(r * 3 + i * 5)), 2);
        ctx.beginPath();
        ctx.moveTo(xa + 0.5, y0); ctx.lineTo(xa + 0.8, y0 - hh + jit); ctx.lineTo(xb - 0.8, y0 - hh - jit); ctx.lineTo(xb - 0.5, y0); ctx.closePath();
        ctx.fill();
      }
    }
    ctx.strokeStyle = css(lit(STONE_D), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.7, un);
    ctx.beginPath(); ctx.moveTo(x - w / 2, g - h); ctx.lineTo(x + w / 2, g - h); ctx.stroke();
    // 火与烟
    const f = lv('ezFire');
    if (f > 0.01 && k > 0.9) {
      smoke(ctx, x, g - h - 0.04 * t.tu, f * (S.rain ? 0.4 : 1), 0.9 * t.tu, 0.05 * t.tu, 2.1);
      flame(ctx, x, g - h + 1, 0.15 * t.tu * Math.min(1.3, f), Math.min(1, f), 1.3);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  海上：香柏树的筏子（3:7）
  // ════════════════════════════════════════════════════════════
  function raftPos(i) {
    const u = clamp(lv('ezRaft') * 1.25 - i * 0.12, 0, 1.7);
    const e = U.easeInOut ? U.easeInOut(Math.min(1, u)) : Math.min(1, u);
    const x0 = (tall() ? 0.47 : 0.462) * W.w, y0 = W.horizonY + 0.012 * W.h;
    const xs = (tall() ? 0.455 : 0.447) + i * 0.004;
    const x1 = xs * W.w, y1 = gY(2, xs) - 1.5 * Math.max(0.5, W.unit);
    const x = lerp(x0, x1, e), y = lerp(y0, y1, e * e * 0.6 + e * 0.4);
    const a = u <= 1 ? Math.min(1, u * 6) : clamp(1 - (u - 1.2) * 2.5, 0, 1);
    return { x, y, a, u };
  }
  function drawRafts(ctx, pass) {
    if (lv('ezRaft') < 0.004) return;
    const un = Math.max(0.5, W.unit);
    for (let i = 0; i < 3; i++) {
      const r = raftPos(i);
      if (r.a < 0.01 || W.seaBand(r.y) !== pass) continue;
      const s = W.seaScale(r.y) * (W.w < 600 ? 2.2 : 1.5), L = 40 * s, H = 5 * s;
      ctx.globalAlpha = r.a;
      const dep = 0.6 * (1 - W.seaDepth(r.y));
      ctx.fillStyle = W.shadeCSS(CEDAR, dep);
      for (let k = 0; k < 4; k++) ctx.fillRect(r.x - L / 2 + k * 0.6 * s, r.y - H + k * H * 0.25, L, H * 0.28);
      ctx.strokeStyle = W.shadeCSS([80, 58, 40], dep, 0.8);
      ctx.lineWidth = Math.max(0.4, 0.5 * s);
      ctx.beginPath(); for (let k = 0; k < 3; k++) { const x = r.x - L / 2 + (k + 0.5) * L / 3; ctx.moveTo(x, r.y - H); ctx.lineTo(x, r.y); } ctx.stroke();
      // 撑筏的人
      ctx.strokeStyle = W.shadeCSS([60, 46, 38], dep);
      ctx.lineWidth = Math.max(0.6, 1.2 * s);
      ctx.beginPath(); ctx.moveTo(r.x + L * 0.25, r.y - H); ctx.lineTo(r.x + L * 0.25, r.y - H - 9 * s); ctx.stroke();
      ctx.beginPath(); ctx.arc(r.x + L * 0.25, r.y - H - 10.5 * s, 1.6 * s, 0, TAU); ctx.fillStyle = W.shadeCSS([60, 46, 38], dep); ctx.fill();
      ctx.lineWidth = Math.max(0.4, 0.6 * s);
      ctx.beginPath(); ctx.moveTo(r.x + L * 0.1, r.y - H - 12 * s); ctx.lineTo(r.x + L * 0.45, r.y + 2 * s); ctx.stroke();
      // 水纹
      ctx.strokeStyle = U.rgba(236, 244, 255, 0.35 * r.a);
      ctx.lineWidth = Math.max(0.4, 0.6 * s);
      ctx.beginPath(); ctx.moveTo(r.x - L * 0.6, r.y + 1); ctx.lineTo(r.x + L * 0.6, r.y + 1); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    void un;
  }

  // ════════════════════════════════════════════════════════════
  //  声音的环（签名之景）：欢呼是金的，哭号是银的；末了合为一色，听到远处
  // ════════════════════════════════════════════════════════════
  const JOY = [255, 204, 112], WEEP = [172, 206, 255], PEARL = [252, 246, 234];
  function ringSrc() {
    const cr = courtR();
    const xf = (cr[0] + cr[1]) / 2 + 0.02;
    return [xf * W.w, vY(xf, 0.1) - PH(2) * 0.9];
  }
  function ringCol(k, mixK) {
    const base = k % 2 ? WEEP : JOY;
    return mix(base, PEARL, mixK);
  }
  // 天上：一环一环的穹（在群山之后升起）
  function drawDomes(ctx) {
    const pr = lv('ezPraise'), wp = lv('ezWeep'), jy = lv('ezJoy') * 0.5;
    if (pr + wp + jy < 0.01) return;
    const [cx, cy] = ringSrc(), mk = lv('ezMix'), far = lv('ezFar');
    const big = Math.max(pr, wp);
    const Rmax = Math.hypot(W.w, W.h) * lerp(0.36, 0.5 + 0.62 * far, clamp(big * 1.5, 0, 1)), N = 6, un = Math.max(0.5, W.unit);
    const vis = 0.55 + 0.45 * (1 - W.daylight) + 0.35 * W.dusk;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < N; k++) {
      const ph = U.fract(W.t * 0.13 + k / N);
      const amp = k % 2 ? wp : Math.max(pr, jy);
      if (amp < 0.01) continue;
      const a = amp * Math.pow(1 - ph, 1.2) * Math.min(1, ph * 6) * vis;
      if (a < 0.01) continue;
      const r = 24 * un + ph * Rmax, c = ringCol(k, mk);
      for (const q of [[8, 0.12], [1.8, 0.5]]) {
        ctx.strokeStyle = U.rgba(c[0], c[1], c[2], Math.min(1, a * q[1]));
        ctx.lineWidth = Math.max(0.6, q[0] * un * (1 - ph * 0.45));
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * clamp(W.h / Math.max(1, W.w) * 0.7, 0.56, 1.25), 0, Math.PI, TAU);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  // 地上：贴着地与海扩散开的环（在人之后）
  function drawRipples(ctx) {
    const pr = lv('ezPraise'), wp = lv('ezWeep'), jy = lv('ezJoy');
    if (pr + wp + jy < 0.01) return;
    const [cx, cy0] = ringSrc(), cy = cy0 + PH(2) * 0.95, mk = lv('ezMix'), far = lv('ezFar');
    const Rmax = W.w * (0.36 + 0.5 * far), N = 6, un = Math.max(0.5, W.unit);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < N; k++) {
      const ph = U.fract(W.t * 0.13 + k / N + 0.02);
      const amp = k % 2 ? wp : Math.max(pr, jy * 0.6);
      if (amp < 0.01) continue;
      const a = amp * Math.pow(1 - ph, 2) * Math.min(1, ph * 6) * 0.3;
      if (a < 0.01) continue;
      const r = 12 * un + ph * Rmax, c = ringCol(k, mk);
      ctx.strokeStyle = U.rgba(c[0], c[1], c[2], a);
      ctx.lineWidth = Math.max(0.6, 1.2 * un);
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.09, 0, 0, Math.PI);
      ctx.stroke();
      ctx.strokeStyle = U.rgba(c[0], c[1], c[2], a * 0.35);
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.09, 0, Math.PI, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  光：诏书与书卷、神施恩的手、神的眼目、应允的光柱、指望的光
  // ════════════════════════════════════════════════════════════
  function drawScrollAt(ctx, x, y, s, open, a, seal) {
    if (a < 0.01) return;
    SP || sprites();
    const w = s * (0.25 + 0.75 * open), h = s * 0.62, un = Math.max(0.5, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, s * 1.5, a * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(246,234,204)';
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.strokeStyle = 'rgba(150,118,80,0.55)';
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const yy = y - h * 0.3 + i * h * 0.15; ctx.moveTo(x - w * 0.36, yy); ctx.lineTo(x + w * (0.36 - 0.1 * (i % 2)), yy); }
    ctx.stroke();
    ctx.fillStyle = 'rgb(150,108,64)';
    ctx.fillRect(x - w / 2 - s * 0.06, y - h * 0.58, s * 0.1, h * 1.16);
    ctx.fillRect(x + w / 2 - s * 0.04, y - h * 0.58, s * 0.1, h * 1.16);
    if (seal) { ctx.fillStyle = seal; ctx.beginPath(); ctx.arc(x + w * 0.3, y + h * 0.28, s * 0.07, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function drawDecree(ctx) {
    const k = lv('ezDecree');
    if (k < 0.01) return;
    const f = fig('cyrus'), hm = PH(1);
    const x = f && f._vis ? f._x : X('king') * W.w, g = f && f._vis ? f._y : gY(1, X('king'));
    drawScrollAt(ctx, x, g - hm * 2.5 - Math.sin(W.t * 1.3) * 1.5, Math.max(10, hm * 0.95), clamp(k, 0, 1), clamp(k, 0, 1), 'rgb(168,52,44)');
  }
  function drawDariusScroll(ctx) {
    const k = lv('ezScroll');
    if (k < 0.01) return;
    const go = lv('ezScrollGo'), e = go * go * (3 - 2 * go);
    const p0 = X('scroll0'), p1 = X('scroll1');
    const x = lerp(p0[0], p1[0], e) * W.w, y = (lerp(p0[1], p1[1], e) - Math.sin(e * Math.PI) * 0.06) * W.h;
    const s = Math.max(28, 0.1 * M()) * (1 - 0.3 * e);
    // 飞过时身后一串金光
    if (go > 0.01 && go < 0.99) {
      SP || sprites();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i <= 12; i++) {
        const g2 = clamp(go - i * 0.018, 0, 1), e2 = g2 * g2 * (3 - 2 * g2);
        const tx = lerp(p0[0], p1[0], e2) * W.w, ty = (lerp(p0[1], p1[1], e2) - Math.sin(e2 * Math.PI) * 0.06) * W.h;
        glowAt(ctx, SP.gold, tx, ty, s * (0.5 - i * 0.03), k * (1 - i / 13) * 0.55);
      }
      ctx.restore();
    }
    drawScrollAt(ctx, x, y + Math.sin(W.t * 1.1) * 2, s, clamp(k * 1.3, 0, 1), clamp(k, 0, 1), 'rgb(176,60,48)');
  }
  function drawLawScroll(ctx) {
    if (!S.scroll) return;
    const f = fig(S.scroll);
    if (!f || !f._vis || f.alpha < 0.3) return;
    const h = f._h, fc = f.fd || f.facing || 1;
    const lift = f.pose === 'raise' || f.pose === 'pray' ? 0.95 : 0.6;
    const x = f._x + fc * h * 0.15, y = f._y - h * lift;
    SP || sprites();
    ctx.globalAlpha = f.alpha;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, h * 0.35, 0.35 + 0.25 * nightK());
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = 'rgb(240,226,192)';
    ctx.fillRect(x - h * 0.07, y - h * 0.045, h * 0.14, h * 0.09);
    ctx.fillStyle = 'rgb(140,100,60)';
    ctx.fillRect(x - h * 0.09, y - h * 0.06, h * 0.035, h * 0.12);
    ctx.fillRect(x + h * 0.055, y - h * 0.06, h * 0.035, h * 0.12);
    ctx.globalAlpha = 1;
  }
  // 神施恩的手：一片暖光覆在他（他们）上面，如掌心向下的荫庇
  function drawHand(ctx) {
    const k = lv('ezHand');
    if (k < 0.01 || !S.hand) return;
    const p = ptOf(S.hand);
    if (!p) return;
    SP || sprites();
    const hm = PH(2), w = Math.max(hm * 1.6, p[2] * 0.75 + hm), cx = p[0], cy = p[1] - hm * 0.75;
    const br = 0.85 + 0.15 * Math.sin(W.t * 1.4);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy, w * 1.15, k * 0.34 * br, 0.42);
    // 下垂的光（落在他们身上）
    ctx.globalAlpha = k * 0.28 * br;
    ctx.drawImage(SP.beam, cx - w * 0.55, cy - hm * 0.1, w * 1.1, hm * 2.2);
    // 覆着的弧
    const un = Math.max(0.5, W.unit);
    for (const q of [[5, 0.16], [1.5, 0.62]]) {
      ctx.strokeStyle = U.rgba(255, 228, 170, k * q[1] * br);
      ctx.lineWidth = Math.max(0.6, q[0] * un);
      ctx.beginPath(); ctx.ellipse(cx, cy + hm * 0.25, w * 0.62, hm * 0.62, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    }
    ctx.restore();
  }
  // 神的眼目看顾（5:5）：长老们头上一圈安静的光
  function drawEye(ctx) {
    const k = lv('ezEye');
    if (k < 0.01) return;
    SP || sprites();
    const hm = PH(2), x = S.eyeX * W.w, y = vY(S.eyeX, 0.2) - hm * 3.1, un = Math.max(0.5, W.unit);
    const r = hm * 1.1 * (1 + 0.04 * Math.sin(W.t * 1.2));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pearl, x, y, r * 2.6, k * 0.42, 0.6);
    ctx.globalAlpha = k * 0.3;
    ctx.drawImage(SP.cool, x - r * 1.2, y, r * 2.4, hm * 2.6);
    for (const q of [[6, 0.06], [1.1, 0.26]]) {
      ctx.strokeStyle = U.rgba(246, 240, 226, k * q[1]);
      ctx.lineWidth = Math.max(0.6, q[0] * un);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.42, 0, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }
  // 他就应允了我们（8:23）：夜里一道光柱降在营上
  function drawAnswer(ctx) {
    const k = lv('ezAnswer');
    if (k < 0.01) return;
    SP || sprites();
    const xs = X('tents'), xf = (xs[0] + xs[xs.length - 1]) / 2, g = vY(xf, 0.15), w = Math.max(60, 0.16 * W.w);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.5;
    ctx.drawImage(SP.beam, xf * W.w - w / 2, -W.h * 0.05, w, g + W.h * 0.07);
    glowAt(ctx, SP.gold, xf * W.w, g - PH(2) * 0.5, w * 0.9, k * 0.45, 0.45);
    ctx.restore();
  }
  // 以色列人还有指望（10:2）：一道光穿过雨云，落在会众身上
  function drawHope(ctx) {
    const k = lv('ezHope');
    if (k < 0.01) return;
    SP || sprites();
    const cr = courtR(), xf = (cr[0] + cr[1]) / 2, gx = xf * W.w, gy = vY(xf, 0.25);
    const sx = gx + W.w * 0.16, sy = -W.h * 0.05, L = Math.hypot(gx - sx, gy - sy), ang = Math.atan2(gy - sy, gx - sx) - Math.PI / 2;
    const w = Math.max(70, 0.2 * W.w);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(sx, sy); ctx.rotate(ang);
    ctx.globalAlpha = k * 0.55;
    ctx.drawImage(SP.beam, -w / 2, 0, w, L * 1.05);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, gx, gy - PH(2) * 0.4, w * 0.8, k * 0.35, 0.4);
    ctx.restore();
  }
  // 器皿：抬着的人手上一点一点金光
  function drawVessels(ctx) {
    if (!S.vessels) return;
    SP || sprites();
    const ms = cmembers(S.vessels);
    ctx.save();
    for (let i = 0; i < ms.length; i++) {
      const m = ms[i];
      if (!m._vis || m.alpha < 0.2 || (m.pose !== 'carry' && m.pose !== 'walk' && m.pose !== 'stand')) continue;
      const h = m._h, fc = m.fd || m.facing || 1, x = m._x + fc * h * 0.17, y = m._y - h * 0.66;
      ctx.globalAlpha = m.alpha;
      ctx.fillStyle = i % 3 === 1 ? 'rgb(214,218,228)' : 'rgb(232,190,98)';
      ctx.beginPath(); ctx.ellipse(x, y, h * 0.085, h * 0.04, 0, 0, Math.PI); ctx.fill();
      ctx.fillRect(x - h * 0.02, y - h * 0.01, h * 0.04, h * 0.02);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, y, h * (0.22 + 0.05 * Math.sin(W.t * 4 + i)), m.alpha * (0.35 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
  }
  // 号与钹（3:10）
  function drawInstruments(ctx) {
    if (!S.instr) return;
    const pk = lv('ezPlay'), un = Math.max(0.5, W.unit);
    SP || sprites();
    ctx.save();
    ctx.lineCap = 'round';
    for (const m of cmembers('priests')) {
      if (!m._vis || m.alpha < 0.2) continue;
      const h = m._h, fc = m.fd || m.facing || 1, up = m.pose === 'raise' ? 1 : 0;
      const hx = m._x + fc * h * 0.06, hy = m._y - h * 0.9;
      const ang = up ? -0.8 : 0.9, L = h * 0.36;
      const hx2 = m._x + fc * h * 0.1, hy2 = m._y - h * (up ? 0.86 : 0.55);
      const ex = hx2 + fc * Math.cos(ang) * L, ey = hy2 + Math.sin(ang) * L;
      ctx.globalAlpha = m.alpha;
      ctx.strokeStyle = W.shadeCSS([206, 212, 222], 0, 1, 0.1);
      ctx.lineWidth = Math.max(0.7, h * 0.024);
      ctx.beginPath(); ctx.moveTo(hx2, hy2); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = W.shadeCSS([226, 230, 238], 0, 1, 0.12);
      ctx.beginPath();
      const nx = -Math.sin(ang) * fc, ny = Math.cos(ang) * 1, bl = h * 0.07, bw = h * 0.05;
      ctx.moveTo(ex - fc * Math.cos(ang) * bl * 0.2, ey - Math.sin(ang) * bl * 0.2);
      ctx.lineTo(ex + fc * Math.cos(ang) * bl + nx * bw, ey + Math.sin(ang) * bl + ny * bw);
      ctx.lineTo(ex + fc * Math.cos(ang) * bl - nx * bw, ey + Math.sin(ang) * bl - ny * bw); ctx.closePath(); ctx.fill();
      void hx; void hy;
      if (pk > 0.3 && up) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.silver, ex, ey, h * 0.28 * (0.8 + 0.2 * Math.sin(W.t * 6 + m.ord)), m.alpha * pk * 0.5);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    for (const m of cmembers('levites')) {
      if (!m._vis || m.alpha < 0.2) continue;
      const h = m._h, up = m.pose === 'raise' ? 1 : 0;
      const beat = up ? Math.abs(Math.sin(W.t * 3.2 + m.ord)) : 0.8;
      const cx = m._x, cy = m._y - h * (up ? 1.12 : 0.62), gap = h * 0.08 * beat + h * 0.02;
      ctx.globalAlpha = m.alpha;
      ctx.fillStyle = 'rgb(226,186,96)';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * gap, cy, h * 0.03, h * 0.09, 0, 0, TAU); ctx.fill(); }
      if (pk > 0.3 && up && beat < 0.25) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, cx, cy, h * 0.4, m.alpha * pk * 0.6);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
    void un;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  const flash = (b, o) => { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); };
  // 自天而降的一道光落在某处（layer 1 = 中丘）
  const beam = (b, xf, layer, o) => flash(b, Object.assign({ type: 'beam', xf, layer: layer == null ? 2 : layer, v: 0.15, w: 90, dur: 4, a: 0.5 }, o));
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, Object.assign({ v: f.v || 0 }, o)); }
  function sparkleOn(b, key, n, rgb) {
    if (b.instant || !fx()) return;
    if (hasCrowd(key)) { for (const m of cmembers(key)) { if (!m._vis) continue; fx().sparkle(m._x, m._y - m._h * 0.6, n || 6, rgb || [255, 232, 170], 8 * SU(), 'air'); } return; }
    const p = figPt(key, 0.6);
    if (p) fx().sparkle(p[0], p[1], n || 16, rgb || [255, 232, 170], 10 * SU(), 'air');
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.25, dur || 2.2, 1.6); }
  // 在天上聚成几个字
  function glyphs(b, str, rgb, o) {
    if (b.instant || !fx() || !fx().nameStr) return;
    o = o || {};
    const g = X('glyph'), size = Math.max(22, (o.size || (tall() ? 0.075 : 0.05)) * (tall() ? W.w : M()));
    const cx = (o.x != null ? o.x : g[0]) * W.w, cy = (o.y != null ? o.y : g[1]) * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * W.w * 0.3, W.h * 0.8 + (Math.random() - 0.5) * 40]);
    fx().nameStr(str, cx, cy, size, rgb || [255, 226, 160], src, { hold: o.hold || 3, delay: o.delay || 0 });
    const a = au();
    if (a && a.nameChime) U.safe('ez.nameChime', () => a.nameChime(str[0]));
  }
  // 书信：一卷小书在城与城之间飞过
  function letter(b, from, to, o) { flash(b, Object.assign({ type: 'letter', from, to, dur: 3.2 }, o)); }
  // 一道金流：自巴比伦的城门流到某人手中
  function stream(b, from, to, o) { flash(b, Object.assign({ type: 'stream', from, to, dur: 4.5 }, o)); }
  function ptFrom(p) {
    if (Array.isArray(p)) return [p[0] * W.w, p[1] * W.h];
    if (p === 'gate') return [X('gate') * W.w, gY(1, X('gate')) - PH(1) * 0.6];
    if (p === 'site') { const t = temple(); return [t.x0 + 0.1 * t.tu, t.top - 0.3 * t.tu]; }
    if (p === 'door') { const t = temple(); return [t.x0 + 0.11 * t.tu, t.top - 0.15 * t.tu]; }
    const q = ptOf(p);
    return q ? [q[0], q[1] + PH(2) * 0.4] : [W.w * 0.7, W.h * 0.7];
  }
  function drawFXL(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    ctx.save();
    for (const e of FXL) {
      const u = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const a = e.a * Math.sin(Math.PI * u), x = e.xf * W.w, g = e.layer === 2 ? vY(e.xf, e.v) : gY(e.layer, e.xf), w = e.w * SU() * (e.layer === 1 ? 0.6 : 1);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a;
        ctx.drawImage(SP.beam, x - w / 2, -W.h * 0.04, w, g + W.h * 0.05);
        glowAt(ctx, SP.gold, x, g - PH(e.layer) * 0.5, w * 0.8, a * 0.5, 0.5);
      } else if (e.type === 'letter' && pass === 'air') {
        const A = ptFrom(e.from), B = ptFrom(e.to), eu = u * u * (3 - 2 * u);
        const x = lerp(A[0], B[0], eu), y = lerp(A[1], B[1], eu) - Math.sin(Math.PI * eu) * W.h * 0.12;
        const a = Math.min(1, u * 6, (1 - u) * 6), s = Math.max(10, 0.03 * M());
        ctx.globalCompositeOperation = 'source-over';
        drawScrollAt(ctx, x, y, s, 0.3, a * 0.9, e.seal || 'rgb(120,40,36)');
      } else if (e.type === 'stream' && pass === 'air') {
        const A = ptFrom(e.from || 'gate'), B = ptFrom(e.to);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 22; i++) {
          const s = clamp(u * 1.5 - i / 22 * 0.5, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const x = lerp(A[0], B[0], s), y = lerp(A[1], B[1], s) - Math.sin(Math.PI * s) * W.h * 0.07 + Math.sin(i * 2.1 + e.t * 3) * 3;
          glowAt(ctx, SP.gold, x, y, (4 + 3 * hsh(i)) * SU(), 0.85 * Math.sin(Math.PI * s));
        }
      } else if (e.type === 'rain' && pass === 'air') {
        // 那一卷化作金光落在殿上
        const t = temple();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 26; i++) {
          const ph = clamp(u * 1.4 - hsh(i) * 0.4, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const x = t.x0 + hsh(i * 3 + 1) * t.tu, y = lerp(t.top - t.tu * 1.2, t.top - t.hH * 0.3, ph);
          glowAt(ctx, SP.gold, x, y, (3 + 3 * hsh(i + 5)) * SU(), 0.8 * Math.sin(Math.PI * ph));
        }
      } else if (e.type === 'flash' && pass === 'air') {
        const a = (e.a || 0.7) * Math.pow(1 - u, 1.5) * Math.min(1, u * 8);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP[e.spr || 'gold'], e.x, e.y, e.r, a);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // 欢呼的金尘、老年人的泪（装饰，随机无妨）
  const MOTE = [];
  function spawnMotes(dt) {
    if (W.replaying || GS.debug && GS.debug.noDraw) return;
    const pr = Math.max(lv('ezPraise'), lv('ezJoy')), wp = lv('ezWeep');
    if (pr > 0.2 && MOTE.length < 70) {
      for (const gid of ['ex1', 'ex2', 'ex3', 'priests', 'levites']) {
        for (const m of cmembers(gid)) {
          if (!m._vis || m.pose !== 'raise' || Math.random() > dt * 0.35 * pr) continue;
          MOTE.push({ x: m._x + (Math.random() - 0.5) * m._h * 0.3, y: m._y - m._h * 1.05, vy: -(18 + 20 * Math.random()) * SU(), vx: (Math.random() - 0.5) * 8, t: 0, dur: 2.2 + Math.random() * 1.6, c: 'gold', r: (1.8 + Math.random() * 2) * SU() });
        }
      }
    }
    if (wp > 0.2 && MOTE.length < 70) {
      for (const m of cmembers('elders')) {
        if (!m._vis || m.pose !== 'weep' || Math.random() > dt * 0.8 * wp) continue;
        const fc = m.fd || m.facing || 1;
        MOTE.push({ x: m._x + fc * m._h * 0.1, y: m._y - m._h * 0.8, vy: (10 + 8 * Math.random()) * SU(), vx: 0, t: 0, dur: 1.3 + Math.random(), c: 'silver', r: (1.5 + Math.random()) * SU() });
      }
    }
  }
  function drawMotes(ctx) {
    if (!MOTE.length) return;
    SP || sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const mk = lv('ezMix');
    for (const p of MOTE) {
      const u = p.t / p.dur, a = Math.sin(Math.PI * u) * 0.9;
      glowAt(ctx, mk > 0.6 ? SP.pearl : SP[p.c], p.x, p.y, p.r * 2.4, a);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { BAB = null; JER = null; TG = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; if (MOTE.length) MOTE.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      spawnMotes(f);
      for (let i = MOTE.length - 1; i >= 0; i--) {
        const p = MOTE[i];
        p.t += f; p.x += p.vx * f; p.y += p.vy * f;
        if (p.t >= p.dur) MOTE.splice(i, 1);
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawDomes(ctx); return; }
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') { drawRafts(ctx, pass); return; }
      if (pass === 'mid') { U.safe('ez.babylon', () => drawBabylon(ctx)); U.safe('ez.jer', () => drawJerusalem(ctx)); return; }
      if (pass === 'near') {
        U.safe('ez.river', () => drawRiver(ctx));
        for (const w of X('wil')) drawWillow(ctx, w[0], w[1], w[2]);
        drawTents(ctx);
        drawGifts(ctx);
        U.safe('ez.site', () => drawSite(ctx));
        return;
      }
      if (pass === 'air') {
        drawRipples(ctx);
        drawInstruments(ctx);
        drawVessels(ctx);
        drawLawScroll(ctx);
        drawHand(ctx);
        drawEye(ctx);
        drawAnswer(ctx);
        drawHope(ctx);
        drawDecree(ctx);
        drawDariusScroll(ctx);
        drawMotes(ctx);
        drawFXL(ctx, 'air');
      }
    },
    draw() {},
    reset() { FXL.length = 0; MOTE.length = 0; },
    restore() { FXL.length = 0; MOTE.length = 0; TG = null; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const t = temple();
      if (lv('ezBuild') > 0.9) consider('神的殿', t.x0 + 0.5 * t.tu, t.top - t.hH * 0.8);
      else if (lv('ezFound') > 0.6) consider('殿的根基', t.x0 + 0.4 * t.tu, t.top - 0.02 * t.tu);
      else consider('耶和华殿的地方', t.x0 + 0.4 * t.tu, t.top);
      if (lv('ezAltar') > 0.8) consider('坛', t.ax, t.ag - t.ah);
      consider('巴比伦', X('zig') * W.w, gY(1, X('zig')) - PH(1) * 3);
      consider('耶路撒冷', (X('jer0') + X('jer1')) / 2 * W.w, gY(1, (X('jer0') + X('jer1')) / 2) - PH(1) * 0.6);
      const rp = riverPts()[8];
      consider(lv('ezTents') > 0.3 ? '亚哈瓦河' : '巴比伦的河边', rp[0] * W.w, vY(rp[0], rp[1]));
      if (lv('ezBeams') > 0.5) consider('香柏树', t.px1 + 0.1 * t.tu, gY(2, (t.px1 + 0.1 * t.tu) / W.w) - 0.05 * t.tu);
      if (lv('ezHouses') > 0.5) consider('天花板的房屋', (X('jer0') + 0.05) * W.w, gY(1, X('jer0') + 0.05) - PH(1) * 0.6);
      if (lv('ezPeg') > 0.5 && lv('ezBuild') > 0.9) consider('圣所', t.x0 + 0.11 * t.tu, t.top - t.hP * 0.62);
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const nn = k => (tall() ? Math.max(2, Math.round(k * 0.62)) : k);
  const EXG = ['ex1', 'ex2', 'ex3'];
  const exAll = fn => EXG.forEach((g, i) => fn(g, i));
  // 众百姓在院子里的位置（三群，自左而右），与老年人（在前排）
  function exSpots() {
    const [a, b] = courtR(), w = b - a;
    return { ex1: [a, a + w * 0.3], ex2: [a + w * 0.3, a + w * 0.6], ex3: [a + w * 0.6, b - w * 0.12], elders: [a + w * 0.18, a + w * 0.55] };
  }
  // 一群人都朝向某处（画面比例）
  function cfaceTo(gid, xf) {
    for (const m of cmembers(gid)) {
      const d = xf >= (m.tx != null ? m.tx : m.nx) ? 1 : -1;
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null; m.facing = d; if (W.replaying) m.fd = d;
    }
  }
  function mkExiles(pose) {
    const c0 = X('camp0'), c1 = X('camp1'), w = c1 - c0;
    crowd('ex1', { n: nn(5), x0: c0 + 0.004, x1: c0 + w * 0.34, layer: 2, label: '被掳的人', pose }, folk(0.14, 0.5));
    crowd('ex2', { n: nn(5), x0: c0 + w * 0.34, x1: c0 + w * 0.67, layer: 2, label: '被掳的人', pose }, folk(0.1, 0.46));
    crowd('ex3', { n: nn(5), x0: c0 + w * 0.67, x1: c1, layer: 2, label: '被掳的人', pose }, folk(0.06, 0.4));
    crowd('elders', { n: nn(4), x0: c0 + w * 0.2, x1: c0 + w * 0.75, layer: 2, label: '老年人', pose }, elders(0.42, 0.6));
  }
  function mkPriests(from) {
    const [a] = [altX()];
    crowd('priests', { n: nn(6), x0: a - 0.078, x1: a - 0.036, layer: 2, label: '祭司', from }, priests(0.02, 0.14));
    crowd('levites', { n: nn(4), x0: a - 0.118, x1: a - 0.084, layer: 2, label: '亚萨的子孙', from }, priests(0.04, 0.16, [178, 164, 196]));
    cface('priests', 1); cface('levites', 1);
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：巴比伦的河边（诗 137:1），塞鲁士元年
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; MOTE.length = 0; S = fresh(); TG = null; BAB = null; JER = null; }
  function setup() {
    W.set('bare', 0.3, true); W.set('bloom', 0.45, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.7, herbs: 0.4, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('ezDecree', 1, true); W.set('ezHarps', 1, true); W.set('ezRuin', 1, true);
    W.freeClock = false;
    const ox = W.w * 0.64, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', W.w * 0.36, W.ridgeBaseY(2, W.w * 0.36));
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    add('cyrus', { label: '塞鲁士', layer: 1, x: X('king'), facing: -1, robe: ROYAL, hair: 'cloth', accent: GOLD, glow: 0.45, prop: null });
    add('jeshua', { label: '耶书亚', x: X('camp1') - 0.012, facing: -1, robe: LINEN, hair: 'cloth', accent: [110, 90, 160], glow: 0.3, pose: 'sit', v: 0.08, prop: null });
    add('zerub', { label: '所罗巴伯', x: X('camp1') + 0.006, facing: -1, robe: [86, 104, 146], accent: [214, 190, 120], glow: 0.3, pose: 'sit', v: 0.16, prop: null });
    mkExiles('sit');
    exAll(g => cface(g, -1));
    cpose('elders', 'weep');
    cpose('ex2', 'weep');
    avoid([0.4, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒；情节里补充的经文排在其后。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:5 一切被神激动他心的人：河边的人一个一个起来；四围的人送来礼物 ─────
    {
      kind: 'act', utter: '一切被神激动他心的人', cmd: 'wake --heart 被掳的人  # 七十年满了', ref: '1:5', tint: [255, 230, 176],
      verse: [
        { text: '在你们中间凡作他子民的，可以上犹大的耶路撒冷，<br>在耶路撒冷重建耶和华以色列神的殿（只有他是神）。', ref: '以斯拉记 1:3', hold: 7 },
        { text: '于是，犹大和便雅悯的族长、祭司、利未人，<br>就是一切被神激动他心的人，都起来要上耶路撒冷去建造耶和华的殿。', ref: '以斯拉记 1:5', hold: 8 },
        { text: '他们四围的人就拿银器、金子、财物、牲畜、珍宝帮助他们，<br>另外还有甘心献的礼物。', ref: '以斯拉记 1:6', hold: 6.5 },
      ],
      apply(c) {
        const c1 = X('camp1');
        T(c, [
          [0, b => {
            W.set('ezStir', 1, b.instant); W.goTo(0.36, 8, b.instant);
            beam(b, (X('camp0') + c1) / 2, 2, { v: 0.25, w: 150, dur: 6, a: 0.45 });
            sfx(b, 'harp');
          }],
          [1.4, b => { pose('jeshua', 'stand'); pose('zerub', 'stand'); glow('jeshua', 0.6); glow('zerub', 0.6); sparkleOn(b, 'jeshua', 14); sparkleOn(b, 'zerub', 14); }],
          [3.2, b => { cpose('ex1', 'stand'); cglow('ex1', 0.35); sparkleOn(b, 'ex1', 5); }],
          [4.6, b => { cpose('ex2', 'stand'); cglow('ex2', 0.35); sparkleOn(b, 'ex2', 5); }],
          [6, b => { cpose('ex3', 'stand'); cpose('elders', 'stand'); cglow('ex3', 0.35); cglow('elders', 0.35); sparkleOn(b, 'ex3', 5); sfx(b, 'crowd', { soft: true }); }],
          [7.4, b => { W.set('ezHarps', 0, b.instant); exAll(g => cface(g, 1)); cface('elders', 1); face('jeshua', 1); face('zerub', 1); }],
          [9, () => { exAll(g => cpose(g, 'gaze')); }],
          [11, () => {
            crowd('nbr', { n: nn(5), x0: c1 + 0.03, x1: c1 + 0.07, layer: 2, label: '四围的人', pose: 'carry' }, dressed(BABY, 0.05, 0.3));
            cwalk('nbr', c1 - 0.03, c1 + 0.02, { speed: 0.02, pose: 'bow' });
          }],
          [15.8, b => {
            cpose('nbr', 'bow');
            W.set('ezGifts', 1, b.instant);
            animal('camel1', { kind: 'camel', x: c1 + 0.035, facing: -1, pack: true, label: '骆驼', v: 0.04 });
            animal('camel2', { kind: 'camel', x: c1 + 0.06, facing: -1, pack: true, label: '骆驼', v: 0.12 });
            animal('donkey1', { kind: 'donkey', x: c1 + 0.047, facing: -1, pack: true, label: '驴', v: 0.3 });
            animal('donkey2', { kind: 'donkey', x: c1 + 0.08, facing: -1, pack: true, label: '驴', v: 0.2 });
            sfx(b, 'camel', { soft: true });
            if (!b.instant && fx()) { const p = crowdPt('nbr'); if (p) fx().sparkle(p.x, p.top + PH(2) * 0.8, 24, [255, 226, 150], 30 * SU(), 'air'); }
          }],
          [18.6, () => { exAll(g => cpose(g, 'stand')); cpose('nbr', 'stand'); }],
          [20.4, () => { cwalk('nbr', c1 + 0.05, c1 + 0.1, { speed: 0.02 }); }],
          [23.4, () => { crm('nbr'); }],
        ]);
      },
    },

    // ── 1:3 愿神与这人同在：殿的器皿如一道金流交在设巴萨手中；驼队向西而行 ─────
    {
      kind: 'bless', utter: '愿神与这人同在', cmd: 'checkout 器皿 --from 巴比伦的庙 --count 5400  # 设巴萨带上来', ref: '1:3', tint: [255, 228, 170],
      verse: [
        { text: '塞鲁士王也将耶和华殿的器皿拿出来，<br>这器皿是尼布甲尼撒从耶路撒冷掠来、放在自己神之庙中的。', ref: '以斯拉记 1:7', hold: 7.5 },
        { text: '波斯王塞鲁士派库官米提利达将这器皿拿出来，按数交给犹大的首领设巴萨。', ref: '以斯拉记 1:8', hold: 6.5 },
        { text: '金银器皿共有五千四百件。<br>被掳的人从巴比伦上耶路撒冷的时候，设巴萨将这一切都带上来。', ref: '以斯拉记 1:11', hold: 7 },
      ],
      apply(c) {
        const c0 = X('camp0'), c1 = X('camp1');
        T(c, [
          [0, b => { pose('cyrus', 'raise'); W.set('ezDecree', 0.55, b.instant); beam(b, X('gate'), 1, { w: 110, dur: 5, a: 0.45 }); sfx(b, 'gate', { soft: true }); }],
          [1.6, () => {
            add('shesh', { label: '设巴萨', x: c1 + 0.028, facing: 1, robe: [150, 96, 70], accent: [226, 196, 130], glow: 0.4, v: 0.1, prop: null });
            crowd('bearers', { n: nn(4), x0: c1 + 0.008, x1: c1 + 0.03, layer: 2, label: '利未人' }, priests(0.18, 0.34, [196, 186, 206]));
            cface('bearers', 1);
          }],
          [3.4, b => { stream(b, 'gate', 'shesh'); sfx(b, 'chime'); }],
          [5.4, b => { sfx(b, 'chime', { soft: true }); }],
          [8.6, b => { S.vessels = 'bearers'; cpose('bearers', 'carry'); pose('shesh', 'raise'); sparkleOn(b, 'bearers', 8); sfx(b, 'harp', { soft: true }); }],
          [10.8, b => { pose('cyrus', 'stand'); pose('shesh', 'stand'); W.set('ezDecree', 0.15, b.instant); W.set('ezGifts', 0, b.instant); W.set('ezStir', 0.3, b.instant); }],
          [12.4, b => {
            W.goTo(0.74, 12, b.instant);
            const d = 0.06, sp = { speed: 0.007 };
            walk('zerub', c1 + d + 0.05, sp); walk('jeshua', c1 + d + 0.04, sp); walk('shesh', c1 + d + 0.03, sp);
            cwalk('bearers', c1 + d, c1 + d + 0.022, { speed: 0.007, pose: 'carry' });
            cwalk('ex3', c0 + (c1 - c0) * 0.67 + d, c1 + d - 0.005, sp);
            cwalk('ex2', c0 + (c1 - c0) * 0.34 + d, c0 + (c1 - c0) * 0.67 + d, sp);
            cwalk('ex1', c0 + d, c0 + (c1 - c0) * 0.34 + d, sp);
            cwalk('elders', c0 + (c1 - c0) * 0.2 + d, c0 + (c1 - c0) * 0.75 + d, sp);
            walk('camel1', c0 + d - 0.01, sp); walk('camel2', c0 + d - 0.035, sp); walk('donkey1', c0 + d + 0.01, sp); walk('donkey2', c0 + d - 0.05, sp);
            avoid([0.4, 1]);
          }],
          [22.6, () => { rm('cyrus'); }],
        ]);
      },
    },

    // ── 耶 29:10 使你们仍回此地：黎明到了耶路撒冷的废墟；如同一人；筑坛，火点起来 ─────
    {
      kind: 'promise', utter: '向你们成就我的恩言，使你们仍回此地', cmd: 'git revert 被掳 --since 七十年  # 各归本城', ref: '耶利米书 29:10', tint: [255, 236, 196],
      verse: [
        { text: '巴比伦王尼布甲尼撒从前掳到巴比伦之犹大省的人，<br>现在他们的子孙从被掳到之地回耶路撒冷和犹大，各归本城。', ref: '以斯拉记 2:1', hold: 7 },
        { text: '到了七月，以色列人住在各城；那时他们如同一人，聚集在耶路撒冷。', ref: '以斯拉记 3:1', hold: 6.5 },
        { text: '他们在原有的根基上筑坛，因惧怕邻国的民，<br>又在其上向耶和华早晚献燔祭。', ref: '以斯拉记 3:3', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            rm('cyrus');
            W.goTo(0.29, 7.5, b.instant); W.set('ezDecree', 0, b.instant); W.set('ezStir', 0, b.instant);
            const sp = exSpots(), s = { speed: 0.012 }, a = altX();
            cwalk('ex1', sp.ex1[0], sp.ex1[1], s); cwalk('ex2', sp.ex2[0], sp.ex2[1], s); cwalk('ex3', sp.ex3[0], sp.ex3[1], s);
            cwalk('elders', sp.elders[0], sp.elders[1], s);
            cwalk('bearers', a - 0.03, a - 0.005, { speed: 0.012, pose: 'carry' });
            walk('shesh', a - 0.042, s); walk('zerub', a - 0.052, s); walk('jeshua', a - 0.062, s);
            const k0 = courtR()[0];
            walk('camel1', k0 - 0.02, s); walk('camel2', k0 - 0.045, s); walk('donkey1', k0 - 0.03, s); walk('donkey2', k0 - 0.06, s);
            avoid([0.4, 1]);
          }],
          [7.6, b => {
            exAll(g => cface(g, 1)); cface('elders', 1);
            cpose('elders', 'weep'); cpose('ex2', 'kneel');
            sfx(b, 'weep', { soft: true });
            W.set('grass', 0.85, b.instant); W.set('bloom', 0.6, b.instant); W.set('bare', 0.18, b.instant);
          }],
          [9.2, b => {
            W.set('ezHouses', 0.3, b.instant);
            stream(b, 'bearers', 'site', { dur: 3.6 });
            S.vessels = null; cpose('bearers', 'bow');
            exAll(g => crelabel(g, '被掳归回的人'));
          }],
          [11.4, b => {
            exAll(g => cpose(g, 'stand')); cpose('elders', 'stand');
            crm('bearers');
            if (!b.instant) { const p = ringSrc(); flash(b, { type: 'flash', x: p[0], y: p[1] + PH(2) * 0.3, r: M() * 0.22, dur: 2.6, a: 0.55 }); }
            sfx(b, 'crowd', { soft: true });
          }],
          [12.8, () => { const a = altX(); walk('jeshua', a - 0.022, { speed: 0.025 }); walk('zerub', a + 0.024, { speed: 0.025 }); face('shesh', 1); }],
          [16.2, b => {
            pose('jeshua', 'bow'); pose('zerub', 'bow');
            W.set('ezRuin', 0.62, b.instant); W.set('ezAltar', 1, b.instant);
            sfx(b, 'build'); 
          }],
          [18.2, b => { sfx(b, 'build', { soft: true }); }],
          [20.4, b => {
            W.set('ezFire', 1, b.instant);
            pose('jeshua', 'raise'); pose('zerub', 'stand');
            exAll(g => cpose(g, 'bow'));
            if (!b.instant) { const t = temple(); flash(b, { type: 'flash', x: t.ax, y: t.ag - t.ah - t.tu * 0.05, r: t.tu * 0.6, dur: 2.4, spr: 'warm', a: 0.9 }); }
            sfx(b, 'fire');
          }],
          [23.4, () => { pose('jeshua', 'stand'); exAll(g => cpose(g, 'stand')); }],
        ]);
      },
    },

    // ── 亚 4:9 所罗巴伯的手立了这殿的根基：香柏木浮海而来；根基立定；祭司、利未人各站其位 ─────
    {
      kind: 'promise', utter: '所罗巴伯的手立了这殿的根基', cmd: 'lay 根基 --by 所罗巴伯的手  # 香柏木 via 约帕', ref: '撒迦利亚书 4:9', tint: [255, 232, 186],
      verse: [
        { text: '他们又将银子给石匠、木匠，把粮食、酒、油给西顿人、泰尔人，<br>使他们将香柏树从黎巴嫩运到海里，浮海运到约帕，是照波斯王塞鲁士所允准的。', ref: '以斯拉记 3:7', hold: 8.5 },
        { text: '第二年二月，撒拉铁的儿子所罗巴伯，约萨达的儿子耶书亚和其余的弟兄……都兴工建造；<br>又派利未人，从二十岁以外的，督理建造耶和华殿的工作。', ref: '以斯拉记 3:8', hold: 8.5 },
        { text: '匠人立耶和华殿根基的时候，祭司皆穿礼服吹号，亚萨的子孙利未人敲钹，<br>照以色列王大卫所定的例，都站着赞美耶和华。', ref: '以斯拉记 3:10', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('ezRaft', 1.5, b.instant); W.goTo(0.42, 6, b.instant);
            cpose('ex1', 'sit'); cpose('ex3', 'sit');
            sfx(b, 'wind', { soft: true });
          }],
          [3, b => { sfx(b, 'splash', { soft: true }); }],
          [9.4, () => {
            const s0 = tall() ? 0.462 : 0.47;
            crowd('porters', { n: nn(3), x0: s0, x1: s0 + 0.02, layer: 2, label: '石匠、木匠', prop: 'wood', pose: 'carry' }, dressed(EXILE, 0.05, 0.2, 'm'));
            const a = altX();
            cwalk('porters', a + 0.012, a + 0.04, { speed: 0.028, pose: 'bow' });
            cface('porters', 1);
          }],
          [9.8, b => {
            const t = temple();
            walk('zerub', (t.px0 + 0.02 * t.tu) / W.w, { speed: 0.02, pose: 'bow' });
            W.set('ezRuin', 0, b.instant); W.set('ezFound', 1, b.instant);
            sfx(b, 'build');
          }],
          [12.6, b => { sfx(b, 'build'); cpose('ex2', 'stand'); }],
          [15.4, b => { sfx(b, 'build', { soft: true }); }],
          [17, b => {
            W.set('ezStone', 1, b.instant); pose('zerub', 'raise');
            if (!b.instant) { const t = temple(); ringAt(b, t.px0 + 0.035 * t.tu, t.top, [255, 226, 160], t.tu * 1.2, 2.4); }
            sfx(b, 'chime');
          }],
          [19.6, b => {
            W.set('ezBeams', 1, b.instant);
            for (const m of cmembers('porters')) m.prop = null;
            mkPriests(b.instant ? 'none' : 'fade');
            S.instr = true; W.set('ezPlay', 0.3, b.instant);
            pose('zerub', 'stand');
          }],
          [21.5, () => { cwalk('porters', courtR()[1] + 0.02, courtR()[1] + 0.05, { speed: 0.02 }); }],
          [23.2, () => { exAll(g => { cpose(g, 'gaze'); cface(g, 1); }); crm('porters'); }],
        ]);
      },
    },

    // ── 3:11 他本为善，他向以色列人永发慈爱（签名之景）：金与银的环，听到远处 ─────
    {
      kind: 'act', utter: '他本为善，他向以色列人永发慈爱', cmd: 'echo "他本为善" | tee 欢呼 哭号  # 不能分辨', ref: '3:11', tint: [255, 226, 160],
      verse: [
        { text: '他们彼此唱和，赞美称谢耶和华说：他本为善，他向以色列人永发慈爱。<br>他们赞美耶和华的时候，众民大声呼喊，因耶和华殿的根基已经立定。', ref: '以斯拉记 3:11', hold: 8.5 },
        { text: '然而有许多祭司、利未人、族长，就是见过旧殿的老年人，<br>现在亲眼看见立这殿的根基，便大声哭号，也有许多人大声欢呼，', ref: '以斯拉记 3:12', hold: 8 },
        { text: '甚至百姓不能分辨欢呼的声音和哭号的声音；<br>因为众人大声呼喊，声音听到远处。', ref: '以斯拉记 3:13', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('ezPlay', 1, b.instant); W.set('ezPraise', 1, b.instant); W.goTo(0.755, 13, b.instant);
            cpose('priests', 'raise'); cpose('levites', 'raise');
            sfx(b, 'angel'); sfx(b, 'crowd');
          }],
          [1.2, b => { glyphs(b, '他本为善', [255, 224, 150], { hold: 3.4 }); }],
          [2.2, () => { exAll(g => cpose(g, 'raise')); pose('zerub', 'raise'); pose('jeshua', 'raise'); pose('shesh', 'raise'); }],
          [5.4, b => { const g = X('glyph'); glyphs(b, '永发慈爱', [255, 232, 176], { hold: 3.2, y: g[1] + (tall() ? 0.08 : 0.1) }); }],
          [6.6, b => { W.set('ezStone', 1.4, b.instant); sparkleOn(b, 'zerub', 20); sfx(b, 'crowd', { soft: true }); }],
          [9.8, b => { cpose('elders', 'weep'); W.set('ezWeep', 1, b.instant); sfx(b, 'weep'); }],
          [12.5, b => { cpose('ex2', 'weep'); sfx(b, 'weep', { soft: true }); }],
          [15.2, b => { cpose('ex2', 'raise'); sfx(b, 'crowd'); }],
          [19.1, b => { W.set('ezMix', 1, b.instant); W.set('ezFar', 1, b.instant); sfx(b, 'crowd', { far: true }); sfx(b, 'angel', { soft: true }); }],
          [24.5, b => { W.set('ezPlay', 0.7, b.instant); }],
        ]);
      },
    },

    // ── 该 1:4 这殿仍然荒凉：那地的民使他们手软；奏本往来；工程停止；根基上长了草 ─────
    {
      kind: 'ask', utter: '这殿仍然荒凉，你们自己还住天花板的房屋吗？', cmd: 'while (荒凉) { 自己的房屋.panel(天花板) }  # 殿呢？', ref: '哈该书 1:4', tint: [220, 214, 232],
      verse: [
        { text: '那地的民，就在犹大人建造的时候，使他们的手发软，扰乱他们；<br>从波斯王塞鲁士年间，直到波斯王大流士登基的时候，贿买谋士，要败坏他们的谋算。', ref: '以斯拉记 4:4–5', hold: 9 },
        { text: '于是，在耶路撒冷神殿的工程就停止了，直停到波斯王大流士第二年。', ref: '以斯拉记 4:24', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            for (const k of ['ezPraise', 'ezWeep', 'ezMix', 'ezFar', 'ezPlay']) W.set(k, 0, b.instant);
            W.set('ezStone', 0.5, b.instant);
            S.instr = false;
            cpose('priests', 'stand'); cpose('levites', 'stand'); exAll(g => cpose(g, 'stand')); cpose('elders', 'stand');
            pose('zerub', 'stand'); pose('jeshua', 'stand'); pose('shesh', 'stand');
            W.set('clouds', 0.6, b.instant);
          }],
          [1.2, () => {
            crowd('foes', { n: nn(5), x0: 1.0, x1: 1.05, layer: 2, label: '那地的民' }, dressed(DARK, 0.3, 0.56, 'm'));
            cglow('foes', 0);
            cwalk('foes', 0.8, 0.92, { speed: 0.028 });
          }],
          [5.4, b => {
            cpose('foes', 'point'); cface('foes', -1);
            exAll(g => cpose(g, 'sit')); cpose('priests', 'bow'); cpose('levites', 'bow');
            sfx(b, 'crowd', { soft: true, low: true });
          }],
          [7.2, b => { letter(b, 'site', 'gate', { seal: 'rgb(60,40,36)' }); }],
          [8.6, b => { letter(b, 'site', 'gate', { seal: 'rgb(60,40,36)', dur: 3 }); }],
          [11, b => { letter(b, 'gate', 'site', { seal: 'rgb(170,40,36)', dur: 3 }); }],
          [14.2, b => {
            W.set('ezStone', 0, b.instant);
            cwalk('priests', 0.96, 1.06, { speed: 0.03 }); cwalk('levites', 0.96, 1.06, { speed: 0.03 });
            cwalk('foes', 1.02, 1.1, { speed: 0.03 });
            sfx(b, 'seal', { soft: true });
          }],
          [15.6, b => {
            W.goTo(0.96, 5, b.instant); W.set('ezHouses', 1, b.instant); W.set('clouds', 0.66, b.instant);
            exAll(g => cwalk(g, 0.9, 1.06, { speed: 0.03 })); cwalk('elders', 0.9, 1.06, { speed: 0.025 });
            walk('shesh', 1.05, { speed: 0.03 });
          }],
          [18.5, () => {
            crm('priests'); crm('levites'); crm('foes');
            for (const id of ['camel1', 'camel2', 'donkey1', 'donkey2']) rm(id);
          }],
          [20.4, b => {
            W.goTo(0.37, 6, b.instant); W.set('ezWeeds', 1, b.instant); W.set('ezFire', 0.45, b.instant); W.set('bare', 0.3, b.instant);
            exAll(g => crm(g)); crm('elders'); rm('shesh');
            pose('zerub', 'sit'); pose('jeshua', 'sit'); glow('zerub', 0.2); glow('jeshua', 0.2);
          }],
        ]);
      },
    },

    // ── 该 2:4 你们都当刚强做工，因为我与你们同在：哈该与撒迦利亚；动工；神的眼目看顾 ─────
    {
      kind: 'promise', utter: '你们都当刚强做工，因为我与你们同在', cmd: 'resume 建殿 --with 我  # 虽然如此，你当刚强', ref: '哈该书 2:4', tint: [255, 236, 190],
      verse: [
        { text: '那时，先知哈该和易多的孙子撒迦利亚奉以色列神的名<br>向犹大和耶路撒冷的犹大人说劝勉的话。', ref: '以斯拉记 5:1', hold: 7.5 },
        { text: '于是撒拉铁的儿子所罗巴伯和约萨达的儿子耶书亚都起来动手建造耶路撒冷神的殿，<br>有神的先知在那里帮助他们。', ref: '以斯拉记 5:2', hold: 8 },
        { text: '神的眼目看顾犹大的长老，以致总督等没有叫他们停工，<br>直到这事奏告大流士，得着他的回谕。', ref: '以斯拉记 5:5', hold: 7.5 },
      ],
      apply(c) {
        const cr = courtR(), mid = (cr[0] + cr[1]) / 2;
        T(c, [
          [0, b => {
            W.set('clouds', 0.35, b.instant); W.goTo(0.42, 4, b.instant); W.set('bare', 0.2, b.instant);
            add('haggai', { label: '哈该', sex: 'm', age: 'elder', x: cr[0] + 0.03, facing: 1, robe: [120, 110, 150], glow: 0.7, from: 'light' });
            add('zech', { label: '撒迦利亚', sex: 'm', x: cr[0] + 0.058, facing: 1, robe: [96, 124, 132], glow: 0.7, from: 'light', prop: null });
            pose('haggai', 'raise'); pose('zech', 'raise');
            beam(b, cr[0] + 0.044, 2, { w: 120, dur: 5 });
            sfx(b, 'harp');
          }],
          [2.6, b => { pose('zerub', 'stand'); pose('jeshua', 'stand'); glow('zerub', 0.6); glow('jeshua', 0.6); face('zerub', -1); face('jeshua', -1); sparkleOn(b, 'zerub', 12); sparkleOn(b, 'jeshua', 12); }],
          [4.6, () => {
            const sp = exSpots();
            crowd('ex1', { n: nn(4), x0: 0.96, x1: 1.03, layer: 2, label: '犹大人' }, folk(0.3, 0.55));
            crowd('ex3', { n: nn(4), x0: 0.93, x1: 1.0, layer: 2, label: '犹大人' }, folk(0.26, 0.5));
            crowd('elders', { n: nn(3), x0: 0.95, x1: 1.02, layer: 2, label: '犹大的长老' }, elders(0.38, 0.56));
            cwalk('ex1', sp.ex2[0], sp.ex3[0], { speed: 0.03 }); cwalk('ex3', sp.ex3[0], sp.ex3[1] + 0.01, { speed: 0.03 });
            cwalk('elders', mid - 0.02, mid + 0.02, { speed: 0.028 });
          }],
          [8.8, b => {
            W.set('ezWeeds', 0, b.instant); W.set('ezScaf', 1, b.instant); W.set('ezBuild', 0.32, b.instant); W.set('ezFire', 1, b.instant);
            pose('haggai', 'stand'); pose('zech', 'point');
            const t = temple();
            walk('zerub', (t.px0 + 0.02 * t.tu) / W.w, { speed: 0.02, pose: 'bow' }); face('jeshua', 1);
            sfx(b, 'build');
          }],
          [11.4, b => { sfx(b, 'build'); exAll(g => cface(g, 1)); }],
          [13.4, () => {
            add('tattenai', { label: '达乃', x: cr[0] - 0.07, facing: 1, robe: PERSIAN, hair: 'cloth', accent: [214, 186, 120], glow: 0.15, prop: null });
            crowd('retinue', { n: nn(3), x0: cr[0] - 0.1, x1: cr[0] - 0.075, layer: 2, label: '达乃的同党' }, dressed([[110, 84, 130], [90, 96, 138], [128, 92, 96]], 0.12, 0.3, 'm'));
            walk('tattenai', cr[0] - 0.005, { speed: 0.02 }); cwalk('retinue', cr[0] - 0.045, cr[0] - 0.02, { speed: 0.02 });
          }],
          [14.6, b => { sfx(b, 'build', { soft: true }); }],
          [18.1, b => {
            pose('tattenai', 'point'); face('tattenai', 1);
            S.eyeX = mid; W.set('ezEye', 1, b.instant);
            cglow('elders', 0.5);
            sfx(b, 'harp', { soft: true });
          }],
          [22.6, b => { pose('tattenai', 'stand'); letter(b, 'tattenai', 'gate', { seal: 'rgb(110,70,140)' }); }],
        ]);
      },
    },

    // ── 亚 4:9 他的手也必完成这工：亚马他城的一卷；殿墙升起；亚达月初三日殿修成了 ─────
    {
      kind: 'promise', utter: '他的手也必完成这工', cmd: 'grep 塞鲁士 /亚马他/典籍库 && build 殿 --finish', ref: '撒迦利亚书 4:9', tint: [255, 230, 176],
      verse: [
        { text: '于是大流士王降旨，要寻察典籍库内，就是在巴比伦藏宝物之处；<br>在米底亚省亚马他城的宫内寻得一卷……', ref: '以斯拉记 6:1–2', hold: 8 },
        { text: '犹大长老因先知哈该和易多的孙子撒迦利亚所说劝勉的话就建造这殿，凡事亨通。<br>他们遵着以色列神的命令和波斯王塞鲁士、大流士、亚达薛西的旨意，建造完毕。', ref: '以斯拉记 6:14', hold: 8.5 },
        { text: '大流士王第六年，亚达月初三日，这殿修成了。', ref: '以斯拉记 6:15', hold: 6 },
      ],
      apply(c) {
        const cr = courtR();
        T(c, [
          [0, b => { W.set('ezEye', 0.25, b.instant); W.set('ezScroll', 1, b.instant); sfx(b, 'seal'); sfx(b, 'chime', { soft: true }); }],
          [3, b => { W.goTo(0.52, 9, b.instant); }],
          [5, b => { W.set('ezScrollGo', 1, b.instant); }],
          [9.3, b => {
            W.set('ezBuild', 1, b.instant);
            pose('haggai', 'raise'); pose('zech', 'raise'); pose('tattenai', 'bow');
            exAll(g => cpose(g, 'bow'));
            sfx(b, 'build');
          }],
          [12.4, b => { W.set('ezScroll', 0, b.instant); flash(b, { type: 'rain', dur: 3.6 }); sfx(b, 'build'); sfx(b, 'chime', { soft: true }); }],
          [15, b => { sfx(b, 'build'); }],
          [17.4, b => { sfx(b, 'build', { soft: true }); pose('tattenai', 'stand'); }],
          [19.1, b => {
            W.set('ezScaf', 0, b.instant); W.set('ezEye', 0, b.instant);
            pose('zerub', 'raise'); pose('jeshua', 'raise'); exAll(g => cpose(g, 'raise')); cpose('elders', 'raise');
            if (!b.instant) { const t = temple(); flash(b, { type: 'flash', x: t.x0 + 0.5 * t.tu, y: t.top - t.hH * 0.6, r: t.tu * 1.3, dur: 3, a: 0.75, spr: 'pearl' }); ringAt(b, t.x0 + 0.5 * t.tu, t.top - t.hH * 0.5, [255, 238, 200], t.tu * 2.2, 2.6); }
            sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
          }],
          [21.8, () => {
            walk('tattenai', cr[0] - 0.14, { speed: 0.025 }); cwalk('retinue', cr[0] - 0.18, cr[0] - 0.15, { speed: 0.025 });
            pose('zerub', 'stand'); pose('jeshua', 'stand');
          }],
          [24.6, () => { rm('tattenai'); crm('retinue'); }],
        ]);
      },
    },

    // ── 6:22 耶和华使他们欢喜：奉献的礼；十二点火；逾越节的夜，家家有灯 ─────
    {
      kind: 'act', utter: '耶和华使他们欢喜', cmd: 'passover --days 7 --joy  # 使亚述王的心转向他们', ref: '6:22', tint: [255, 222, 150],
      verse: [
        { text: '以色列的祭司和利未人，并其余被掳归回的人都欢欢喜喜地行奉献神殿的礼。', ref: '以斯拉记 6:16', hold: 7 },
        { text: '正月十四日，被掳归回的人守逾越节。', ref: '以斯拉记 6:19', hold: 5 },
        { text: '欢欢喜喜地守除酵节七日；因为耶和华使他们欢喜，<br>又使亚述王的心转向他们，坚固他们的手，作以色列神殿的工程。', ref: '以斯拉记 6:22', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            rm('tattenai'); crm('retinue');
            mkPriests(b.instant ? 'none' : 'fade');
            cpose('priests', 'raise');
            W.set('ezFire', 1.35, b.instant); W.set('ezTribes', 1, b.instant);
            sfx(b, 'fire'); sfx(b, 'angel', { soft: true });
          }],
          [2.6, b => { W.set('ezJoy', 1, b.instant); exAll(g => cpose(g, 'raise')); cpose('elders', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [6, () => { cpose('priests', 'stand'); cpose('levites', 'stand'); }],
          [8.3, b => {
            W.goTo(0.93, 6, b.instant); W.set('ezLamp', 1, b.instant); W.set('ezTribes', 0.35, b.instant);
            exAll(g => cpose(g, 'sit')); cpose('elders', 'sit');
            pose('haggai', 'sit'); pose('zech', 'sit');
          }],
          [14.6, b => {
            exAll(g => cpose(g, 'raise')); pose('zerub', 'raise'); pose('jeshua', 'raise');
            W.set('ezJoy', 1, b.instant);
            if (!b.instant) { const p = ringSrc(); glyphs(b, '欢喜', [255, 220, 150], { hold: 3, x: (tall() ? 0.62 : 0.72), y: (tall() ? 0.47 : 0.3) }); void p; }
            sfx(b, 'crowd'); sfx(b, 'harp', { soft: true });
          }],
          [20.2, () => { exAll(g => cpose(g, 'stand')); pose('zerub', 'stand'); pose('jeshua', 'stand'); pose('haggai', 'stand'); pose('zech', 'stand'); cpose('elders', 'stand'); }],
        ]);
      },
    },

    // ── 7:9 因他神施恩的手帮助他：以斯拉与律法书；王的谕旨；亚哈瓦河边 ─────
    {
      kind: 'act', utter: '因他神施恩的手帮助他', cmd: 'sudo -u 亚达薛西 grant 以斯拉 --all  # 神施恩的手', ref: '7:9', tint: [255, 228, 176],
      verse: [
        { text: '这以斯拉从巴比伦上来，他是敏捷的文士，通达耶和华以色列神所赐摩西的律法书。<br>王允准他一切所求的，是因耶和华他神的手帮助他。', ref: '以斯拉记 7:6', hold: 9 },
        { text: '以斯拉定志考究遵行耶和华的律法，又将律例典章教训以色列人。', ref: '以斯拉记 7:10', hold: 7 },
        { text: '以斯拉说：「耶和华我们列祖的神是应当称颂的！<br>因他使王起这心意修饰耶路撒冷耶和华的殿……」', ref: '以斯拉记 7:27', hold: 8 },
      ],
      apply(c) {
        const c0 = X('camp0'), c1 = X('camp1');
        T(c, [
          [0, b => {
            W.goTo(0.33, 5, b.instant);
            for (const k of ['ezJoy', 'ezTribes']) W.set(k, 0, b.instant);
            W.set('ezLamp', 0, b.instant); W.set('ezFire', 0.8, b.instant);
            for (const id of ['haggai', 'zech', 'zerub', 'jeshua']) rm(id);
            crm('levites'); crm('elders'); crm('ex3');
            cpose('priests', 'stand'); cpose('ex1', 'stand'); cpose('ex2', 'stand');
            crelabel('ex1', '被掳归回的人'); crelabel('ex2', '被掳归回的人');
          }],
          [4, () => {
            add('artax', { label: '亚达薛西', layer: 1, x: X('king'), facing: -1, robe: ROYAL, hair: 'cloth', accent: GOLD, glow: 0.45, prop: null });
            add('ezra', { label: '以斯拉', x: c0 + (c1 - c0) * 0.5, facing: 1, robe: [206, 196, 170], hair: 'cloth', accent: [96, 84, 130], glow: 0.45, prop: null, v: 0.12 });
            S.scroll = 'ezra';
            crowd('band2', { n: nn(7), x0: c0, x1: c1, layer: 2, label: '从巴比伦上来的人' }, folk(0.2, 0.55));
          }],
          [6.6, b => { S.hand = 'ezra'; W.set('ezHand', 1, b.instant); beamOn(b, 'ezra', { w: 110, dur: 5 }); sfx(b, 'harp'); }],
          [10.3, () => { pose('ezra', 'point'); cfaceTo('band2', c0 + (c1 - c0) * 0.5); cpose('band2', 'gaze'); }],
          [13.6, b => { pose('artax', 'raise'); letter(b, 'gate', 'ezra', { seal: 'rgb(214,170,60)', dur: 3.4 }); }],
          [17.2, () => { pose('ezra', 'stand'); pose('artax', 'stand'); }],
          [18.6, b => { pose('ezra', 'pray'); cpose('band2', 'bow'); sfx(b, 'harp', { soft: true }); }],
          [22.8, b => { W.set('ezTents', 1, b.instant); pose('ezra', 'stand'); cpose('band2', 'stand'); }],
        ]);
      },
    },

    // ── 8:23 他就应允了我们：亚哈瓦河边禁食的夜；光柱；黎明起行；埋伏的暗影退去 ─────
    {
      kind: 'act', utter: '他就应允了我们', cmd: 'fast && pray --at 亚哈瓦河边 && await 应允  # 平坦的道路', ref: '8:23', tint: [236, 232, 255],
      verse: [
        { text: '那时，我在亚哈瓦河边宣告禁食，为要在我们神面前克苦己心，<br>求他使我们和妇人孩子，并一切所有的，都得平坦的道路。', ref: '以斯拉记 8:21', hold: 8.5 },
        { text: '因我曾对王说：「我们神施恩的手必帮助一切寻求他的……」<br>所以我们禁食祈求我们的神，他就应允了我们。', ref: '以斯拉记 8:22–23', hold: 8 },
        { text: '正月十二日，我们从亚哈瓦河边起行，要往耶路撒冷去。<br>我们神的手保佑我们，救我们脱离仇敌和路上埋伏之人的手。', ref: '以斯拉记 8:31', hold: 8 },
      ],
      apply(c) {
        const cr = courtR();
        T(c, [
          [0, b => { W.goTo(0.97, 6, b.instant); W.set('ezHand', 0.35, b.instant); cpose('band2', 'kneel'); pose('ezra', 'pray'); sfx(b, 'wind', { soft: true }); }],
          [4.6, () => { rm('artax'); cpose('ex1', 'sit'); cpose('ex2', 'sit'); }],
          [9.8, b => { W.set('ezAnswer', 1, b.instant); W.set('ezHand', 1, b.instant); cpose('band2', 'bow'); sfx(b, 'angel'); sfx(b, 'harp', { soft: true }); }],
          [13.2, () => { cpose('band2', 'stand'); pose('ezra', 'raise'); }],
          [14.6, b => {
            W.goTo(0.29, 5, b.instant);
            crowd('ambush', { n: nn(4), x0: 0.698, x1: 0.736, layer: 1, label: '路上埋伏之人', pose: 'kneel' }, dressed(DARK, 0, 0.3, 'm'));
            cglow('ambush', 0); cface('ambush', -1);
          }],
          [17.2, b => { W.set('ezAnswer', 0, b.instant); pose('ezra', 'stand'); }],
          [19.1, b => {
            W.set('ezTents', 0, b.instant);
            S.hand = 'band2'; S.vessels = 'band2';
            cwalk('band2', cr[0] + 0.005, cr[0] + 0.075, { speed: 0.014, pose: 'carry' });
            walk('ezra', cr[0] + 0.09, { speed: 0.014 });
            cpose('ex1', 'stand'); cpose('ex2', 'stand');
            sfx(b, 'camel', { soft: true });
          }],
          [21.2, () => { cpose('ambush', 'fall'); }],
          [22.6, () => { crm('ambush'); }],
          [24.4, () => { cfaceTo('ex1', cr[0]); cfaceTo('ex2', cr[0]); cpose('ex1', 'raise'); }],
          [25.8, b => {
            stream(b, 'band2', 'door', { dur: 3.6 });
            S.vessels = null; W.set('ezHand', 0.5, b.instant);
            cpose('band2', 'stand'); cpose('ex1', 'stand');
            sfx(b, 'chime');
          }],
        ]);
      },
    },

    // ── 9:9 我们的神仍没有丢弃我们：晚祭的时候，跪下举手；圣所里一颗钉子般的光；城墙上的金线 ─────
    {
      kind: 'act', utter: '我们的神仍没有丢弃我们', cmd: 'catch (罪) { 跪下(); 举手(); }  # 稍微复兴', ref: '9:9', tint: [232, 226, 250],
      verse: [
        { text: '我一听见这事，就撕裂衣服和外袍，拔了头发和胡须，惊惧忧闷而坐。', ref: '以斯拉记 9:3', hold: 7 },
        { text: '献晚祭的时候我起来，心中愁苦，穿着撕裂的衣袍，双膝跪下向耶和华我的神举手，<br>说：「我的神啊，我抱愧蒙羞，不敢向我神仰面……」', ref: '以斯拉记 9:5–6', hold: 9 },
        { text: '我们是奴仆，然而在受辖制之中，我们的神仍没有丢弃我们，<br>在波斯王眼前向我们施恩，叫我们复兴，能重建我们神的殿……', ref: '以斯拉记 9:9', hold: 8.5 },
      ],
      apply(c) {
        const cr = courtR(), mid = (cr[0] + cr[1]) / 2;
        T(c, [
          [0, b => {
            W.goTo(0.745, 9, b.instant); W.set('ezHand', 0, b.instant); S.hand = null;
            walk('ezra', mid + 0.01, { speed: 0.02, pose: 'sit' });
            add('ezra', { robe: [150, 140, 122] });
            cpose('band2', 'stand'); cpose('ex1', 'stand'); cpose('ex2', 'stand');
          }],
          [2.4, b => { pose('ezra', 'weep', { weep: true }); sfx(b, 'weep', { soft: true }); }],
          [3.6, () => {
            cwalk('band2', mid - 0.05, mid + 0.06, { speed: 0.02, pose: 'sit' });
            cfaceTo('band2', mid + 0.01);
            crelabel('band2', '为以色列神言语战兢的');
          }],
          [8.3, b => { W.set('ezFire', 1.3, b.instant); pose('ezra', 'kneel'); face('ezra', 1); sfx(b, 'fire', { soft: true }); }],
          [10.4, () => { pose('ezra', 'pray'); }],
          [13, () => { cpose('band2', 'kneel'); }],
          [18.6, b => {
            W.set('ezPeg', 1, b.instant); W.set('ezWall', 1, b.instant);
            glow('ezra', 0.65);
            beamOn(b, 'ezra', { w: 90, dur: 5, a: 0.4 });
            if (!b.instant) { const t = temple(); flash(b, { type: 'flash', x: t.x0 + 0.11 * t.tu, y: t.top - t.hP * 0.62, r: t.tu * 0.7, dur: 3, a: 0.8, spr: 'white' }); }
            sfx(b, 'chime'); sfx(b, 'harp', { soft: true });
          }],
          [23.6, () => { cpose('band2', 'bow'); }],
        ]);
      },
    },

    // ── 10:2 以色列人还有指望：会众痛哭；示迦尼；大雨中战兢；「我们必照着你的话行」；光穿过雨云 ─────
    {
      kind: 'act', utter: '以色列人还有指望', cmd: 'hope.push(以色列)  # 虽下大雨', ref: '10:2', tint: [230, 236, 255],
      verse: [
        { text: '以斯拉祷告，认罪，哭泣，俯伏在神殿前的时候，<br>有以色列中的男女孩童聚集到以斯拉那里，成了大会，众民无不痛哭。', ref: '以斯拉记 10:1', hold: 8 },
        { text: '属以拦的子孙、耶歇的儿子示迦尼对以斯拉说：<br>「我们在此地娶了外邦女子为妻，干犯了我们的神，然而以色列人还有指望。……」', ref: '以斯拉记 10:2', hold: 7.5 },
        { text: '……那日正是九月二十日，众人都坐在神殿前的宽阔处；<br>因这事，又因下大雨，就都战兢。', ref: '以斯拉记 10:9', hold: 7.5 },
      ],
      apply(c) {
        const cr = courtR(), mid = (cr[0] + cr[1]) / 2, a = altX();
        T(c, [
          [0, b => {
            W.goTo(0.4, 4.5, b.instant); W.set('ezFire', 0.9, b.instant);
            add('ezra', { robe: [150, 140, 122] });
            walk('ezra', a - 0.03, { speed: 0.02, pose: 'fall' });
            cwalk('band2', mid - 0.02, a - 0.05, { speed: 0.02, pose: 'weep' });
            cwalk('ex1', cr[0], mid - 0.02, { speed: 0.02, pose: 'weep' });
            cwalk('ex2', cr[0] + 0.02, mid + 0.02, { speed: 0.02, pose: 'weep' });
            crelabel('band2', '会众'); crelabel('ex1', '会众'); crelabel('ex2', '会众');
            sfx(b, 'weep');
          }],
          [4.4, () => { crowd('ex3', { n: nn(4), x0: cr[0] - 0.05, x1: cr[0] - 0.01, layer: 2, label: '会众', pose: 'weep' }, folk(0.3, 0.6)); cface('ex3', 1); }],
          [9.3, b => {
            add('shecan', { label: '示迦尼', x: mid, facing: 1, robe: [112, 98, 136], glow: 0.5, v: 0.22, prop: null });
            pose('shecan', 'raise');
            W.set('ezHope', 0.55, b.instant);
            sfx(b, 'harp');
          }],
          [13.2, b => {
            pose('ezra', 'stand'); face('ezra', -1);
            for (const g of ['band2', 'ex1', 'ex2', 'ex3']) cpose(g, 'raise');
            if (!b.instant) { const p = ringSrc(); flash(b, { type: 'flash', x: p[0], y: p[1] + PH(2) * 0.3, r: M() * 0.22, dur: 2.4, a: 0.55 }); }
            sfx(b, 'seal', { soft: true });
          }],
          [16, b => {
            W.set('ezHope', 0, b.instant);
            W.set('clouds', 0.95, b.instant); W.set('storm', 0.66, b.instant); W.set('rain', 0.85, b.instant); W.set('gale', 0.2, b.instant);
            S.rain = true;
            pose('shecan', 'stand');
            sfx(b, 'rain'); sfx(b, 'thunder', { soft: true, far: true });
          }],
          [18.1, () => { for (const g of ['band2', 'ex1', 'ex2', 'ex3']) cpose(g, 'sit'); pose('shecan', 'sit'); }],
          [21.8, () => { pose('ezra', 'raise'); }],
          [25.8, b => {
            say(b, [{ text: '会众都大声回答说：「我们必照着你的话行……」', ref: '以斯拉记 10:12', hold: 4.5 }]);
            for (const g of ['band2', 'ex1', 'ex2', 'ex3']) cpose(g, 'raise');
            pose('shecan', 'raise'); pose('ezra', 'stand');
            sfx(b, 'crowd');
          }],
          [28.4, b => { W.set('rain', 0.12, b.instant); W.set('storm', 0.15, b.instant); W.set('gale', 0, b.instant); W.set('ezHope', 1, b.instant); sfx(b, 'harp'); }],
          [30.6, b => {
            W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.42, b.instant); S.rain = false;
            for (const g of ['band2', 'ex1', 'ex2', 'ex3']) cpose(g, 'stand');
            pose('shecan', 'stand');
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '以斯拉记', books: [15], title: '归回', sub: '以斯拉记 1 — 10', tint: [240, 228, 200], music: 'jacob',
    outro: 16,
    intro: [
      { text: '波斯王塞鲁士元年，耶和华为要应验藉耶利米口所说的话，<br>就激动波斯王塞鲁士的心，使他下诏通告全国说：', ref: '以斯拉记 1:1', hold: 7 },
      { text: '「波斯王塞鲁士如此说：『耶和华天上的神已将天下万国赐给我，<br>又嘱咐我在犹大的耶路撒冷为他建造殿宇。……』」', ref: '以斯拉记 1:2', hold: 7.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '塞鲁士': { text: '波斯王塞鲁士元年，耶和华为要应验藉耶利米口所说的话，就激动波斯王塞鲁士的心……', ref: '以斯拉记 1:1' },
      '耶书亚': { text: '约萨达的儿子耶书亚和他的弟兄众祭司……都起来建筑以色列神的坛，<br>要照神人摩西律法书上所写的，在坛上献燔祭。', ref: '以斯拉记 3:2' },
      '所罗巴伯': { text: '所罗巴伯的手立了这殿的根基，他的手也必完成这工。', ref: '撒迦利亚书 4:9' },
      '设巴萨': { text: '波斯王塞鲁士派库官米提利达将这器皿拿出来，按数交给犹大的首领设巴萨。', ref: '以斯拉记 1:8' },
      '被掳的人': { text: '巴比伦王尼布甲尼撒从前掳到巴比伦之犹大省的人，<br>现在他们的子孙从被掳到之地回耶路撒冷和犹大，各归本城。', ref: '以斯拉记 2:1' },
      '被掳归回的人': { text: '会众共有四万二千三百六十名。', ref: '以斯拉记 2:64' },
      '老年人': { text: '然而有许多祭司、利未人、族长，就是见过旧殿的老年人，<br>现在亲眼看见立这殿的根基，便大声哭号，也有许多人大声欢呼。', ref: '以斯拉记 3:12' },
      '四围的人': { text: '他们四围的人就拿银器、金子、财物、牲畜、珍宝帮助他们，另外还有甘心献的礼物。', ref: '以斯拉记 1:6' },
      '利未人': { text: '金银器皿共有五千四百件。被掳的人从巴比伦上耶路撒冷的时候，设巴萨将这一切都带上来。', ref: '以斯拉记 1:11' },
      '骆驼': { text: '骆驼四百三十五只，驴六千七百二十匹。', ref: '以斯拉记 2:67' },
      '驴': { text: '骆驼四百三十五只，驴六千七百二十匹。', ref: '以斯拉记 2:67' },
      '石匠、木匠': { text: '他们又将银子给石匠、木匠……使他们将香柏树从黎巴嫩运到海里，浮海运到约帕。', ref: '以斯拉记 3:7' },
      '祭司': { text: '匠人立耶和华殿根基的时候，祭司皆穿礼服吹号。', ref: '以斯拉记 3:10' },
      '亚萨的子孙': { text: '亚萨的子孙利未人敲钹，照以色列王大卫所定的例，都站着赞美耶和华。', ref: '以斯拉记 3:10' },
      '那地的民': { text: '那地的民，就在犹大人建造的时候，使他们的手发软，扰乱他们。', ref: '以斯拉记 4:4' },
      '哈该': { text: '那时，先知哈该和易多的孙子撒迦利亚奉以色列神的名向犹大和耶路撒冷的犹大人说劝勉的话。', ref: '以斯拉记 5:1' },
      '撒迦利亚': { text: '犹大长老因先知哈该和易多的孙子撒迦利亚所说劝勉的话就建造这殿，凡事亨通。', ref: '以斯拉记 6:14' },
      '犹大人': { text: '于是撒拉铁的儿子所罗巴伯和约萨达的儿子耶书亚都起来动手建造耶路撒冷神的殿，有神的先知在那里帮助他们。', ref: '以斯拉记 5:2' },
      '犹大的长老': { text: '神的眼目看顾犹大的长老，以致总督等没有叫他们停工。', ref: '以斯拉记 5:5' },
      '达乃': { text: '当时河西的总督达乃和示他‧波斯乃，并他们的同党来问说：「谁降旨让你们建造这殿，修成这墙呢？」', ref: '以斯拉记 5:3' },
      '达乃的同党': { text: '于是，河西总督达乃和示他‧波斯乃，并他们的同党，因大流士王所发的命令，就急速遵行。', ref: '以斯拉记 6:13' },
      '以斯拉': { text: '以斯拉定志考究遵行耶和华的律法，又将律例典章教训以色列人。', ref: '以斯拉记 7:10' },
      '亚达薛西': { text: '「诸王之王亚达薛西，达于祭司以斯拉通达天上神律法大德的文士，云云。」', ref: '以斯拉记 7:12' },
      '从巴比伦上来的人': { text: '当亚达薛西王年间，同我从巴比伦上来的人，他们的族长和他们的家谱记在下面。', ref: '以斯拉记 8:1' },
      '路上埋伏之人': { text: '我们神的手保佑我们，救我们脱离仇敌和路上埋伏之人的手。', ref: '以斯拉记 8:31' },
      '为以色列神言语战兢的': { text: '凡为以色列神言语战兢的，都因这被掳归回之人所犯的罪聚集到我这里来。', ref: '以斯拉记 9:4' },
      '示迦尼': { text: '你起来，这是你当办的事，我们必帮助你，你当奋勉而行。', ref: '以斯拉记 10:4' },
      '会众': { text: '会众都大声回答说：「我们必照着你的话行。」', ref: '以斯拉记 10:12' },
      '巴比伦': { text: '只因我们列祖惹天上的神发怒，神把他们交在迦勒底人巴比伦王尼布甲尼撒的手中，<br>他就拆毁这殿，又将百姓掳到巴比伦。', ref: '以斯拉记 5:12' },
      '巴比伦的河边': { text: '我们曾在巴比伦的河边坐下，一追想锡安就哭了。', ref: '诗篇 137:1' },
      '亚哈瓦河': { text: '我招聚这些人在流入亚哈瓦的河边，我们在那里住了三日。', ref: '以斯拉记 8:15' },
      '耶和华殿的地方': { text: '有些族长到了耶路撒冷耶和华殿的地方，便为神的殿甘心献上礼物，要重新建造。', ref: '以斯拉记 2:68' },
      '坛': { text: '他们在原有的根基上筑坛，因惧怕邻国的民，又在其上向耶和华早晚献燔祭。', ref: '以斯拉记 3:3' },
      '殿的根基': { text: '他们赞美耶和华的时候，众民大声呼喊，因耶和华殿的根基已经立定。', ref: '以斯拉记 3:11' },
      '神的殿': { text: '大流士王第六年，亚达月初三日，这殿修成了。', ref: '以斯拉记 6:15' },
      '耶路撒冷': { text: '在波斯王眼前向我们施恩，叫我们复兴，能重建我们神的殿，修其毁坏之处，<br>使我们在犹大和耶路撒冷有墙垣。', ref: '以斯拉记 9:9' },
      '香柏树': { text: '使他们将香柏树从黎巴嫩运到海里，浮海运到约帕，是照波斯王塞鲁士所允准的。', ref: '以斯拉记 3:7' },
      '天花板的房屋': { text: '这殿仍然荒凉，你们自己还住天花板的房屋吗？', ref: '哈该书 1:4' },
      '圣所': { text: '现在耶和华我们的神暂且施恩与我们，给我们留些逃脱的人，使我们安稳如钉子钉在他的圣所，<br>我们的神好光照我们的眼目，使我们在受辖制之中稍微复兴。', ref: '以斯拉记 9:8' },
    },
  });
})(window.GS);
