/* ─────────────────────────────────────────────────────────────
 * book/ruth.js —— 路得记 · 路得（路得记 1 — 4）
 *
 * 士师秉政的时候，国中遭遇饥荒。摩押地：一间小屋，三座坟，三个寡妇；犹大的田只剩干裂的垄沟。
 * 「耶和华眷顾自己的百姓，赐粮食与他们」——天光破云落在伯利恒，一阵雨，青草自东向西铺开，田里发出青苗；
 * 三个妇人上路。「愿耶和华恩待你们」——哭声；俄珥巴亲嘴而别，回到摩押的小屋；路得舍不得拿俄米：
 * 「你往哪里去，我也往那里去……你的神就是我的神」，二人手牵着手往伯利恒去。
 * 城门口的妇女：「这是拿俄米吗？」——「拿俄米」的名散去，以暗色聚成「玛拉」；正是动手割大麦的时候，田转金黄。
 * 波阿斯的田（本卷的签名之景）：金色的大麦在风里一浪一浪，收割的人弯腰挥镰，禾捆一个个立起，
 * 路得在收割的人身后拾取麦穗；「愿耶和华与你们同在！」「愿耶和华赐福与你！」——一道光掠过全田；
 * 「你来投靠耶和华以色列神的翅膀下」——一对光的翅膀在她头上展开（第二幅签名之景）；
 * 吃饼、烘了的穗子、故意抽出的麦穗，一伊法大麦；「愿那人蒙耶和华赐福」；收完了大麦和小麦。
 * 禾场的夜：簸扬的糠秕、麦堆旁的灯；「求你用你的衣襟遮盖我」——翅膀的回影；天快亮，六簸箕大麦，
 * 「你不可空手回去见你的婆婆」；城门口的十位长老，脱鞋为证，「我们作见证」；婚筵的灯；
 * 「耶和华使她怀孕生了一个儿子」；拿俄米把孩子抱在怀中，「拿俄米」的名以金光重新聚成；俄备得——
 * 暮色里，法勒斯到大卫的名字一颗接一颗亮在伯利恒的天上，末一颗「大卫」最亮。
 *
 * 画面的方位：左（东）= 摩押（坡上的小屋、三座坟），一堆界石；右（西）= 伯利恒（城门、城中的房屋、城门口的石座），
 *            中间是波阿斯的田（大麦）与禾场；中丘上、城边另有别人的一块田。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'ruth';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('ruVisit', 'exp', 0.45);   // 耶和华眷顾自己的百姓（1:6）：破云而下的天光
  W.defineLevel('ruWing', 'exp', 0.42);    // 耶和华以色列神的翅膀下（2:12）
  W.defineLevel('ruKanaf', 'exp', 0.5);    // 求你用你的衣襟遮盖我（3:9）：翅膀的回影
  W.defineLevel('ruLamp', 'exp', 0.5);     // 婚筵的灯（4:13）
  W.defineLevel('ruLine', 'exp', 0.45);    // 法勒斯到大卫：天上一串名字（4:18–22）
  W.defineLevel('ruDry', 'exp', 0.4);      // 饥荒：天是干的，暖而昏黄的霾（1:1）

  // ── 地上的位置（画面宽度的比例）：左 = 东（摩押），右 = 西（伯利恒）──
  // 摩押在近地的最东头（坡上），界石之后才是犹大的田；别人的田在中丘上、城边
  const X = {
    house: 0.43, graves: 0.479, naomi0: 0.515, orpah0: 0.53, ruth0: 0.545, cairn: 0.586,
    fieldB0: 0.615, fieldB1: 0.83, fieldO0: 0.64, fieldO1: 0.775,
    floor: 0.69, gate: 0.852, door: 0.898, town0: 0.874, town1: 1.05,
    bench0: 0.757, seatB: 0.815, seatK: 0.785, seatV: 0.28,
  };
  const ROBE = {
    naomi: [88, 82, 100], ruth: [178, 92, 74], orpah: [122, 104, 134], boaz: [52, 78, 132],
    overseer: [146, 122, 88], kin: [112, 100, 86],
  };
  const LINEN = [[206, 190, 160], [182, 164, 132], [168, 148, 116], [196, 178, 146], [156, 136, 108], [214, 200, 172]];
  // 使女：素麻、灰蓝、赭黄——与路得暖红的衣裳分得开
  const MAID = [[122, 136, 152], [186, 160, 106], [150, 146, 132], [104, 118, 132], [172, 164, 140]];
  const ELDER = [[128, 112, 92], [110, 100, 88], [140, 126, 104], [96, 90, 84], [150, 132, 100], [120, 116, 124]];
  const WOMEN = [[170, 120, 104], [132, 110, 140], [186, 150, 112], [150, 100, 96], [118, 118, 142], [176, 140, 132]];
  const GENE = ['法勒斯', '希斯仑', '兰', '亚米拿达', '拿顺', '撒门', '波阿斯', '俄备得', '耶西', '大卫'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { line: 0, winnow: 0, full: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  // 物件的尺度与人物相配（人物模块在七日之后把人画大些，手机上再大些）
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.3 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const port = () => W.w < W.h * 0.9;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x, layer) { if (has(id)) C().place(id, x, layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { VT.delete(id); if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function babe(id, what) { const c = C(); if (c.carry && has(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.holdHands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (!has(a) || !has(b)) return; if (c.embrace) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  // 一群人：建成后逐一打扮（性别、年岁、衣袍、纵深）
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  const woman = (pal, v0, v1) => (m, i, n) => { m.sex = 'f'; m.age = 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.hairOpt = null; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };
  const man = (pal, v0, v1, age) => (m, i, n) => { m.sex = 'm'; m.age = age || 'adult'; m.robe = pal[i % pal.length]; m.accent = null; if (age === 'elder') { m.prop = null; m.beardOpt = true; } if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };

  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.75, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - 34 * LS(l) * k];
  }
  // 名字在人的上方、干净的天上以光（或以暗）聚成（不压在房屋与地平线上）
  function nameOver(b, id, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const h = headOf(id, 1), n = Array.from(str).length, u = SU();
    const size = Math.min(o.size || 54 * u, (W.w * 0.7) / (n * 1.08));
    const bottom = Math.min(h[1] - 110 * u, W.horizonY - 40 * u);
    let cy = bottom - size * 0.55;
    cy = Math.max(cy, (port() ? W.h * 0.36 : W.h * 0.14) + size * 0.5);
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(h[0], half + 8, W.w - half - 8);
    const src = o.src || (() => [h[0] + (Math.random() - 0.5) * 44 * u, h[1] + (Math.random() - 0.3) * 30 * u]);
    const hold = o.hold || 2.4;
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 226, 160], src, { hold, dark: !!o.dark });
    // 暗的名：身后一片淡淡的亮，天上、海上都看得清
    if (o.dark) FXL.push({ type: 'halo', t: 0, dur: 1.7 + hold + 2 + n * 0.12, x: cx, y: cy, r: size * (n * 0.62 + 0.5) });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 各物件缓动的量（每秒的线性步长）：a 显隐 · grow 长出 · gold 黄熟 · reap 收割 · k、k2 各物自己的状态 · fire 火 · lit 光
  const EASE = { a: 0.9, grow: 0.14, gold: 0.2, reap: 0.034, k: 0.45, k2: 0.4, fire: 0.7, lit: 0.6 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  // prop(id, kind, { x, x0, x1, v, layer, size, label, show, grow, gold, reap, k, k2, fire, lit, tone })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, v: 0, layer: 2, size: 1, label: '', seed: hashStr(id) };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'x0', 'x1', 'v', 'layer', 'size', 'label', 'tone', 'big']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.now) for (const k in EASE) if (k !== 'a' && o[k] != null) p[k] = p['t' + k];
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (W.replaying) snap(p);
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); sortedN = -1; return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  let sorted = [], sortedN = -1;
  const ORDER = { town: 0, house: 1, graves: 2, cairn: 2, gate: 2, field: 3, floor: 4, seats: 5 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, layer, o) {                // 自天而降的一道光，落在某处
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l, v: o.v || 0, w: (o.w || 70) * SU() * (l === 2 ? 1 : 0.7), k: o.k || 1 });
    if (o.ring !== false && fx()) fx().ring(xf * W.w, baseY(l, xf, o.v || 0) - 16 * LS(l), o.rgb || [255, 236, 190], M() * (o.r || 0.28), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, Object.assign({ v: f.v }, o)); }
  function sparkleOn(b, id, n, rgb) {
    if (b.instant || !fx()) return;
    const h = headOf(id, 0.6);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }

  // ── 精灵图（离屏预绘）───────────────────────────────────────
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * 0.32));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
        pale: radial([226, 230, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
      };
      // 自天而降的光柱
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      // 破云而下的天光：上窄下宽、两头淡去的一束
      const r = cnv(64, 256), q = r.getContext('2d');
      const rz = q.createLinearGradient(0, 0, 64, 0);
      rz.addColorStop(0, 'rgba(255,236,196,0)'); rz.addColorStop(0.5, 'rgba(255,240,206,1)'); rz.addColorStop(1, 'rgba(255,236,196,0)');
      q.fillStyle = rz; q.fillRect(0, 0, 64, 256);
      q.globalCompositeOperation = 'destination-in';
      const rv = q.createLinearGradient(0, 0, 0, 256);
      rv.addColorStop(0, 'rgba(0,0,0,0)'); rv.addColorStop(0.25, 'rgba(0,0,0,0.9)'); rv.addColorStop(0.8, 'rgba(0,0,0,0.6)'); rv.addColorStop(1, 'rgba(0,0,0,0)');
      q.fillStyle = rv; q.fillRect(0, 0, 64, 256);
      SP.ray = r;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;   // 当前绘制的画布（glowAt 用）
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.2, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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

  // ════════════════════════════════════════════════════════════
  //  画：摩押的小屋与三座坟
  // ════════════════════════════════════════════════════════════
  // 一间平顶的土屋：屋身、背光的一面、屋顶的矮墙、门与窗；夜里门窗透出灯光
  function house(ctx, l, x, y, w, h, tone, o) {
    o = o || {};
    const s = LS(l);
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    // 背光的一面
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), l, 0.9);
    const sw = w * 0.22;
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - sw, y - h, sw, h);
    // 屋顶：稍出檐的一道
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.3), l);
    ctx.fillRect(x - w / 2 - 1.2 * s, y - h - 1.8 * s, w + 2.4 * s, 2 * s);
    // 门与窗
    const dx = x + (o.door != null ? o.door : 0) * w, dw = 4.4 * s, dh = Math.min(h * 0.62, 9 * s);
    ctx.fillStyle = css([28, 22, 18], l);
    if (o.door !== false) ctx.fillRect(dx - dw / 2, y - dh, dw, dh);
    const wx = x + (o.win != null ? o.win : 0.28) * w * d, wy = y - h * 0.72;
    if (o.win !== false) ctx.fillRect(wx - 1.5 * s, wy - 1.5 * s, 3 * s, 3 * s);
    // 迎光的边
    ctx.strokeStyle = css([255, 240, 214], l, 0.42 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 1.2 * s, y - h - 1.8 * s); ctx.lineTo(x + w / 2 + 1.2 * s, y - h - 1.8 * s);
    if (d > 0) { ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); } else { ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2, y); }
    ctx.stroke();
    // 灯（夜里、婚筵时）——画完把透明度还回去（否则后面的房屋都成了幽灵）
    const lk = (o.lamp || 0) * Math.min(1, nightK() * 1.1 + (o.lampDay || 0));
    if (lk > 0.02 && SP) {
      const a0 = ctx.globalAlpha;
      const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + x * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lk * fl * 0.85) * a0;
      ctx.fillStyle = 'rgb(255,178,98)';
      if (o.win !== false) ctx.fillRect(wx - 1.5 * s, wy - 1.5 * s, 3 * s, 3 * s);
      if (o.door !== false) { ctx.globalAlpha = Math.min(1, lk * fl * 0.5) * a0; ctx.fillRect(dx - dw / 2, y - dh, dw, dh); }
      glowAt(SP.warm, o.door !== false ? dx : wx, y - dh * 0.6, (o.door !== false ? 22 : 12) * s, lk * fl * 0.45 * a0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a0;
    }
  }
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, w = 28 * s;
    // 坡上的屋：屋基取高的一边，低的一边砌一段石台接到地
    const gl = gY(l, p.x - w / (2 * W.w)), gr = gY(l, p.x + (w / 2 + 28 * s) / W.w), gm = gY(l, p.x);
    const y = Math.min(gl, gm) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([132, 114, 92], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 3 * s, y);
    ctx.lineTo(x + w / 2 + 30 * s, y);
    ctx.lineTo(x + w / 2 + 30 * s, Math.max(y, gr + 3 * s));
    ctx.lineTo(x, Math.max(y, gm + 3 * s));
    ctx.lineTo(x - w / 2 - 6 * s, Math.max(y, gl + 3 * s));
    ctx.closePath(); ctx.fill();
    // 院子的矮墙
    ctx.fillStyle = css([128, 104, 80], l);
    ctx.fillRect(x + 12 * s, y - 5 * s, 16 * s, 5 * s);
    ctx.fillRect(x + 26 * s, y - 6 * s, 2.4 * s, 6 * s);
    house(ctx, l, x, y, w, 18 * s, p.tone || [154, 124, 94], { door: -0.12, win: 0.26, lamp: 0.8 });
    ctx.globalAlpha = 1;
  }
  // 界石：摩押与犹大之间的一小堆石（她们在这里分手，1:8–17）
  function drawCairn(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    const ST = [[-5, 0, 3.4, 2.2], [0.5, 0, 3.8, 2.4], [5.6, 0.2, 2.8, 1.9], [-2.4, -3.4, 3, 2], [2.8, -3.6, 2.7, 1.9], [0.2, -6.6, 2.3, 1.7]];
    for (let i = 0; i < ST.length; i++) {
      const q = ST[i];
      ctx.fillStyle = css(mix([134, 124, 110], [160, 150, 134], hsh(i * 3.7)), l);
      ctx.beginPath(); ctx.ellipse(x + q[0] * s, y + q[1] * s - q[3] * s * 0.6, q[2] * s, q[3] * s, 0, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = css([236, 226, 206], l, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.arc(x + 0.2 * s, y - 7.6 * s, 2 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 三座坟：石堆，各立一块石（1:3–5）；在坡上，堆的两脚各随其地
  function drawGraves(ctx, p) {
    const l = p.layer, s = LS(l) * p.size;
    ctx.globalAlpha = p.a;
    for (let i = 0; i < 3; i++) {
      const xf = p.x + (i - 1) * 0.017, x = xf * W.w, y = gY(l, xf) + 2.5 * s, w = (8 + (i === 0 ? 1.5 : 0)) * s;
      const yl = gY(l, xf - w / W.w) + 2.5 * s, yr = gY(l, xf + w / W.w) + 2.5 * s;
      ctx.fillStyle = css([118, 108, 96], l);
      ctx.beginPath(); ctx.moveTo(x - w, yl); ctx.quadraticCurveTo(x - w * 0.5, y - 4.4 * s, x, y - 4.8 * s); ctx.quadraticCurveTo(x + w * 0.6, y - 4.2 * s, x + w, yr); ctx.lineTo(x, y + 2 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([150, 140, 126], l);
      for (let k = 0; k < 5; k++) {
        const sx = x + (hsh(i * 9 + k) - 0.5) * w * 1.3, sy = y - 1.5 * s - hsh(i * 7 + k * 3) * 2.2 * s, r = (1.1 + hsh(i * 3 + k * 5) * 1.1) * s;
        ctx.beginPath(); ctx.ellipse(sx, sy, r * 1.3, r, 0, 0, TAU); ctx.fill();
      }
      // 立着的石
      ctx.fillStyle = css([136, 128, 118], l);
      ctx.beginPath(); ctx.moveTo(x - 2 * s, y - 3.5 * s); ctx.lineTo(x - 1.6 * s, y - 11 * s); ctx.quadraticCurveTo(x, y - 12.6 * s, x + 1.6 * s, y - 11 * s); ctx.lineTo(x + 2 * s, y - 3.5 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([236, 226, 206], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath(); ctx.moveTo(x - 1.6 * s, y - 11 * s); ctx.quadraticCurveTo(x, y - 12.6 * s, x + 1.6 * s, y - 11 * s); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：伯利恒——城中的房屋、城门与城门口的座位
  // ════════════════════════════════════════════════════════════
  function townModel(p) {
    const r = U.mulberry32(p.seed * 7 + 3), hs = [];
    const n = p.layer === 2 ? 7 : 8;
    for (let i = 0; i < n; i++) {
      const xf = p.x0 + (p.x1 - p.x0) * (i + 0.15 + r() * 0.7) / n;
      hs.push({ xf, w: 20 + r() * 12, h: 13 + r() * 10, lift: r() < 0.55 ? 5 + r() * 12 : 0, door: (r() - 0.5) * 0.5, win: r() < 0.85 ? (r() - 0.5) * 0.7 : false, tone: r(), fixed: false });
    }
    if (p.layer === 2) {
      // 拿俄米的家：门正对着 X.door 稍右
      hs.push({ xf: X.door + 0.014, w: 26, h: 17, lift: 0, door: -0.18, win: 0.28, tone: 0.55, fixed: true });
    }
    hs.sort((a, b) => b.lift - a.lift || (a.fixed ? 1 : 0) - (b.fixed ? 1 : 0));
    return { hs };
  }
  function drawTown(ctx, p) {
    if (!p.model) p.model = townModel(p);
    const l = p.layer, s = LS(l) * p.size;
    ctx.globalAlpha = p.a;
    const lamp = clamp(0.55 + W.lv.ruLamp * 0.8, 0, 1.4), lampDay = W.lv.ruLamp * 0.5;
    for (const q of p.model.hs) {
      if (q.fixed && l !== 2) continue;
      ctx.globalAlpha = p.a;
      const x = q.xf * W.w, g = gY(l, q.xf) + 2 * s, lift = q.lift * s, h = q.h * s + lift, w = q.w * s;
      const tone = mix([188, 170, 140], [216, 202, 174], q.tone);
      house(ctx, l, x, g, w, h, tone, { door: lift > 0 ? false : q.door, win: q.win, lamp: lamp * (q.win === false ? 0.6 : 1), lampDay });
    }
    ctx.globalAlpha = 1;
  }
  // 城门：两座门楼夹着门洞；门楼左边是城门口的石座（长老坐在那里，4:1–2）
  function gateDims(p) { const s = LS(2) * p.size; return { s, x: p.x * W.w, y: gY(2, p.x) + 2 * s }; }
  function drawGate(ctx, p) {
    const { s, x, y } = gateDims(p);
    const stone = [178, 160, 130], dark = mix(stone, [40, 32, 28], 0.32);
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    // 城门口的石座：沿着地势、顺着城墙的一条长石台（十位长老坐在这里，4:2）
    const bx0 = X.bench0, bx1 = p.x - 13 * s / W.w;
    const NB = 8;
    // 石座后面一段矮城墙（门楼左边），叫人看得出这是城门口
    const wx0 = bx0 - 0.008;
    ctx.fillStyle = css(mix(stone, [96, 84, 70], 0.22), 2);
    ctx.beginPath();
    for (let i = 0; i <= NB; i++) { const xf = lerp(wx0, bx1, i / NB); const yy = gY(2, xf) + 1 * s - (14 - 3 * (1 - i / NB)) * s; if (i) ctx.lineTo(xf * W.w, yy); else ctx.moveTo(xf * W.w, yy); }
    for (let i = NB; i >= 0; i--) { const xf = lerp(wx0, bx1, i / NB); ctx.lineTo(xf * W.w, gY(2, xf) + 1 * s); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([240, 226, 200], 2, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i <= NB; i++) { const xf = lerp(wx0, bx1, i / NB); const yy = gY(2, xf) + 1 * s - (14 - 3 * (1 - i / NB)) * s; if (i) ctx.lineTo(xf * W.w, yy); else ctx.moveTo(xf * W.w, yy); }
    ctx.stroke();
    ctx.fillStyle = css([164, 146, 116], 2);
    ctx.beginPath();
    for (let i = 0; i <= NB; i++) { const xf = lerp(bx0, bx1, i / NB); const yy = gY(2, xf) + 1.5 * s - 8.6 * s; if (i) ctx.lineTo(xf * W.w, yy); else ctx.moveTo(xf * W.w, yy); }
    for (let i = NB; i >= 0; i--) { const xf = lerp(bx0, bx1, i / NB); ctx.lineTo(xf * W.w, gY(2, xf) + 2.5 * s); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([240, 226, 200], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i <= NB; i++) { const xf = lerp(bx0, bx1, i / NB); const yy = gY(2, xf) + 1.5 * s - 8.6 * s; if (i) ctx.lineTo(xf * W.w, yy); else ctx.moveTo(xf * W.w, yy); }
    ctx.stroke();
    // 城墙（门楼右边连到城中的房屋）
    ctx.fillStyle = css(mix(stone, [90, 80, 66], 0.15), 2);
    ctx.fillRect(x + 12 * s, y - 17 * s, 22 * s, 17 * s);
    // 门洞上的墙与门楣
    ctx.fillStyle = css(stone, 2);
    ctx.fillRect(x - 8 * s, y - 27 * s, 16 * s, 9 * s);
    // 门洞（暗）
    ctx.fillStyle = css([22, 18, 15], 2);
    ctx.beginPath(); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 6 * s, y - 14 * s); ctx.quadraticCurveTo(x, y - 20.5 * s, x + 6 * s, y - 14 * s); ctx.lineTo(x + 6 * s, y); ctx.closePath(); ctx.fill();
    // 两座门楼
    for (const side of [-1, 1]) {
      const tx = x + side * 11 * s, tw = 10 * s, th = 32 * s;
      ctx.fillStyle = css(stone, 2);
      ctx.fillRect(tx - tw / 2, y - th, tw, th);
      ctx.fillStyle = css(dark, 2, 0.85);
      ctx.fillRect(d * side > 0 ? tx - tw / 2 : tx + tw / 2 - tw * 0.3, y - th, tw * 0.3, th);
      // 垛口
      ctx.fillStyle = css(stone, 2);
      for (let k = 0; k < 3; k++) ctx.fillRect(tx - tw / 2 + k * tw * 0.4 - 0.2 * s, y - th - 3 * s, tw * 0.24, 3 * s);
      ctx.fillStyle = css([30, 24, 20], 2);
      ctx.fillRect(tx - 1 * s, y - th * 0.7, 2 * s, 4 * s);
      ctx.strokeStyle = css([255, 240, 214], 2, 0.4 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(tx - tw / 2, y - th); ctx.lineTo(tx + tw / 2, y - th); ctx.stroke();
    }
    // 夜里门洞里的一盏灯
    const nk = nightK() * 0.9 + W.lv.ruLamp * 0.4;
    if (nk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, x, y - 9 * s, 22 * s, Math.min(1, nk) * 0.5);
      flame(ctx, x - 4.2 * s, y - 11.5 * s, 3.2 * s, Math.min(1, nk), 3.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：麦田——长出、黄熟、在风里一浪一浪；收割、禾捆；本卷的签名之景
  // ════════════════════════════════════════════════════════════
  // 田在地的纵深里一行一行（竖屏上近地很深，田就浅一些）；人站在 v 0.04–0.42。
  // v ≥ FSPLIT 的几行画在一切人之前；站在田里的人，身前的几行再在他那一窄条里补画一遍（人就站在麦子里，而不是站在麦子上）。
  // 每一行两端斜斜地没入地里，散出几根禾秆；只有开镰的那一面是齐的。
  const ROWS = 16, FV0 = 0.04, FSPLIT = 0.44, SAMP = 20, DU = 0.016, TAP = 0.05;
  const fv1 = () => (port() ? 0.54 : 0.7);
  const rowV = r => FV0 + ((r + 0.5) / ROWS) * (fv1() - FV0);
  const endK = (u, ua, ub) => smoothstep(0, TAP, u - ua) * smoothstep(0, TAP, ub - u);
  const rgbS = c => 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';
  const rgbaS = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a.toFixed(3) + ')';
  function fieldModel(p) {
    const r = U.mulberry32(p.seed * 31 + 7);
    const byRow = [], edge = [], stray = [], ends = [];
    const ph1 = r() * TAU, ph2 = r() * TAU;
    // 田边：随行缓缓起伏，另加每行一点参差
    for (let k = 0; k < ROWS; k++) {
      byRow.push([]);
      edge.push([0.012 * Math.sin(k * 0.55 + ph1) + 0.006 * Math.sin(k * 1.7 + ph2) + (r() - 0.5) * 0.034,
        0.012 * Math.sin(k * 0.47 + ph2) + 0.006 * Math.sin(k * 1.9 + ph1) + (r() - 0.5) * 0.034,
        r() * TAU, 0.5 + 0.5 * Math.sin(k * 0.8 + ph1)]);
      // 两端散出去的几根禾秆：[边, 离端多远, 高, 斜, 穗]
      const st = [], ns = 2 + Math.floor(r() * 3);
      for (let i = 0; i < ns; i++) st.push([i % 2 ? 1 : -1, 0.003 + r() * 0.022, 0.28 + r() * 0.45, (r() - 0.5) * 0.7, r()]);
      stray.push(st);
    }
    for (let k = 0; k < ROWS; k++) {
      const vv = (k + 0.5) / ROWS, E = edge[k];
      const round = 0.12 * Math.pow(1 - Math.sin(Math.PI * clamp(vv, 0, 1)), 1.2) + 0.015 * E[3];
      ends.push([clamp(round + E[0], 0, 1), clamp(1 - round + E[1], 0, 1)]);
    }
    const n = p.big ? 520 : 260;
    for (let i = 0; i < n; i++) { const row = Math.floor(r() * ROWS); byRow[row].push([r(), r(), r()]); }
    // 最前一行脚下的禾秆与草：[u, 高, 斜, 类]
    const fringe = [];
    for (let i = 0, nf = p.big ? 170 : 80; i < nf; i++) fringe.push([r(), r(), r() - 0.5, r()]);
    for (const b of byRow) b.sort((a, c) => a[0] - c[0]);
    const sh = [];
    const ns = p.big ? 26 : 10;
    for (let i = 0; i < ns; i++) sh.push({ u: (i + 0.2 + r() * 0.6) / ns, row: Math.floor((0.08 + r() * 0.8) * ROWS), tilt: (r() - 0.5) * 0.16, k: 0.85 + r() * 0.3, seed: r() * 10 });
    const shRow = [];
    for (let k = 0; k < ROWS; k++) shRow.push(sh.filter(q => q.row === k));
    return { byRow, edge, stray, ends, fringe, shRow, sh, RX: new Float32Array(SAMP + 1), RB: new Float32Array(SAMP + 1), RF: new Float32Array(SAMP + 1),
      gf: -1, gw: 0, gh: 0, G: new Array(ROWS).fill(null), SG: new Array(ROWS).fill(null), ff: -1, fw: 0, F: null };
  }
  // 田的地势：沿田的宽度取样地面（每帧一次）
  function fieldGeom(p) {
    const m = p.model, l = p.layer;
    if (m.gf === W.frame && m.gw === W.w && m.gh === W.h) return m;
    for (let i = 0; i <= SAMP; i++) {
      const xf = lerp(p.x0, p.x1, i / SAMP), g = gY(l, xf);
      m.RX[i] = xf * W.w; m.RB[i] = g; m.RF[i] = fieldH(l, g) * 0.8;
    }
    m.gf = W.frame; m.gw = W.w; m.gh = W.h;
    return m;
  }
  function fAt(m, u, v, out) {
    const f = clamp(u, 0, 1) * SAMP, i = Math.min(SAMP - 1, Math.floor(f)), t = f - i;
    out[0] = m.RX[i] + (m.RX[i + 1] - m.RX[i]) * t;
    out[1] = m.RB[i] + (m.RB[i + 1] - m.RB[i]) * t + v * (m.RF[i] + (m.RF[i + 1] - m.RF[i]) * t);
    return out;
  }
  const xAt = (m, u) => { const f = clamp(u, 0, 1) * SAMP, i = Math.min(SAMP - 1, Math.floor(f)); return m.RX[i] + (m.RX[i + 1] - m.RX[i]) * (f - i); };
  const PT = [0, 0];
  // 风吹麦浪：随 x 与时间行进的波
  const waveAt = (x, r) => Math.sin(W.t * 1.1 - x * 0.014 / SU() + r * 0.3);
  const SOIL = [112, 88, 62], FURROW = [84, 64, 46], GREEN_B = [66, 100, 46], GREEN_L = [120, 152, 78], GOLD_B = [170, 122, 58], GOLD_L = [236, 190, 104];
  const HEAD_G = [140, 168, 92], HEAD_Y = [240, 206, 126], STUB_B = [176, 146, 96], STUB_L = [214, 188, 132], STALK = [150, 110, 56];
  const GST = [0, 0.17, 0.34, 0.5, 0.67, 0.84, 1];
  // 这一帧的光下，田的各样颜色（每帧只算一次；补画时共用）
  function fieldFrame(p, m) {
    if (m.ff === W.frame && m.fw === W.w && m.F) return m.F;
    const F = m.F || (m.F = {});
    const l = p.layer, dp = DEP(l), grow = p.grow, gold = p.gold;
    const gK = smoothstep(0.04, 0.55, grow);
    F.l = l; F.dp = dp; F.s = LS(l); F.grow = grow; F.gold = gold; F.gK = gK;
    F.far = l !== 2; F.du = F.far ? 0.04 : DU;
    F.amp = (0.7 + 0.6 * Math.abs(W.wind || 0)) * (0.3 + 0.7 * gK) * (l === 2 ? 1 : 0.5);
    F.q2 = (W.quality || 1) < 0.75 ? 2 : 1;
    const bDark = mix(mix(FURROW, GREEN_B, gK), GOLD_B, gold), bLite = mix(mix(SOIL, GREEN_L, gK), GOLD_L, gold);
    const lit = 0.03 + 0.1 * gold;
    F.lit = lit;
    F.sD3 = W.shade(bDark, dp, 0); F.sL3 = W.shade(bLite, dp, lit); F.sD = rgbS(F.sD3);
    // 穗画成不透明的（补画一遍也不会变亮）：预先与身子的颜色调和
    const mid = mix(F.sD3, F.sL3, 0.55), hk = 0.3 + 0.7 * gK;
    F.headA = rgbS(mix(mid, W.shade(mix(HEAD_G, HEAD_Y, gold), dp, lit), 0.75 * hk));
    F.headB = rgbS(mix(mid, W.shade(mix(mix(HEAD_G, [200, 222, 150], 0.5), [255, 234, 170], gold), dp, lit + 0.06), 0.9 * hk));
    F.stalk = rgbS(mix(F.sD3, W.shade(mix(bLite, STALK, 0.35), dp, lit), 0.6));
    F.stalkDk = rgbS(W.shade(mix(bDark, [60, 42, 22], 0.25), dp, 0));
    F.grass = rgbS(W.shade([96, 124, 62], dp, 0));
    F.awn = rgbS(mix(mid, W.shade(mix(HEAD_G, [250, 222, 150], gold), dp, lit + 0.04), 0.7));
    // 麦茬：与地相近的淡麦秆色（不像一块高起的台）
    F.stub3 = W.shade(mix(mix(STUB_B, STUB_L, 0.2), [150, 134, 94], 0.3), dp, 0.02);
    F.stubStalk = rgbS(W.shade(mix(STUB_L, [236, 214, 160], 0.3), dp, 0.05));
    F.shBody = rgbS(W.shade(mix(GOLD_B, [255, 230, 160], 0.2), dp, 0.08));
    F.shHead = rgbS(W.shade(HEAD_Y, dp, 0.12));
    F.shBand = rgbS(W.shade([120, 90, 56], dp, 0));
    F.gap = (fv1() - FV0) / ROWS;
    F.dark = W.shade([0, 0, 0], dp, 0);
    m.ff = W.frame; m.fw = W.w;
    return F;
  }
  // 一行麦子的身子：随风的明暗（渐变按整行的两端定，隔一帧重算一次）
  function bodyGrad(ctx, m, F, r, ua, ub) {
    const x0 = xAt(m, ua), x1 = xAt(m, ub);
    if (x1 - x0 < 2) return F.sD;
    const c = m.G[r];
    if (c && c.x0 === x0 && c.x1 === x1 && W.frame >= c.f && W.frame - c.f < 2) return c.g;
    const vv = (r + 0.5) / ROWS, g = ctx.createLinearGradient(x0, 0, x1, 0), D = F.sD3, L = F.sL3;
    for (const t of GST) {
      const x = lerp(x0, x1, t), w = 0.5 + 0.5 * waveAt(x, r), k = 0.25 + 0.6 * w * (0.45 + 0.55 * vv) + 0.12 * w * F.gold;
      g.addColorStop(t, 'rgb(' + (D[0] + (L[0] - D[0]) * k | 0) + ',' + (D[1] + (L[1] - D[1]) * k | 0) + ',' + (D[2] + (L[2] - D[2]) * k | 0) + ')');
    }
    m.G[r] = { g, x0, x1, f: W.frame };
    return g;
  }
  // 一行麦茬：两端淡入地里（与还立着的麦子相接的一面不淡）
  function stubGrad(ctx, m, F, r, ua, rr, openR) {
    const x0 = xAt(m, ua), x1 = xAt(m, rr);
    const c = m.SG[r];
    if (c && c.x0 === x0 && c.x1 === x1 && c.o === openR && W.frame >= c.f && W.frame - c.f < 2) return c.g;
    const E = m.edge[r], vv = (r + 0.5) / ROWS;
    const k = 0.94 + 0.05 * (1 - vv) + 0.04 * Math.sin(r * 0.9 + E[2]);
    const col = [F.stub3[0] * k, F.stub3[1] * k, F.stub3[2] * k];
    const L = Math.max(1, x1 - x0), fd = Math.min(0.45, (0.035 * (m.RX[SAMP] - m.RX[0])) / L);
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, rgbaS(col, 0)); g.addColorStop(fd, rgbaS(col, 1));
    if (openR) { g.addColorStop(1 - fd, rgbaS(col, 1)); g.addColorStop(1, rgbaS(col, 0)); } else g.addColorStop(1, rgbaS(col, 1));
    m.SG[r] = { g, x0, x1, o: openR, f: W.frame };
    return g;
  }
  const HB = new Float32Array(4 * 160);
  // 画一行（uw0..uw1：只画这一段，给人身前补画用）
  function drawRow(ctx, p, m, F, r, A, uw0, uw1, standOnly) {
    const s = F.s, v = rowV(r), vv = (r + 0.5) / ROWS, E = m.edge[r];
    const H = (8 + 15 * vv) * s * (0.1 + 0.9 * F.grow);
    const ua = m.ends[r][0], ub = m.ends[r][1];
    const front = p.reap;
    // 自东（左）向城（右）收割：u < front 已割，u > front 还立着
    const ss = Math.max(ua, front), rr = Math.min(ub, front);
    const hs = m.byRow[r], last = r === ROWS - 1;
    ctx.globalAlpha = A;
    // ── 割过的：贴地的一片麦茬（补画时不画：它贴着地，遮不住人，却会盖住禾场）
    if (!standOnly && rr > ua + 0.003 && F.grow > 0.2) {
      const a = Math.max(ua, uw0), b = Math.min(rr, uw1);
      if (b > a + 0.0008) {
        const openR = rr >= ub - 0.001;
        const n = Math.max(2, Math.ceil((b - a) / (last ? 0.008 : 0.03)));
        ctx.fillStyle = stubGrad(ctx, m, F, r, ua, rr, openR);
        if (last) ctx.globalAlpha = A * 0.8;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) { const u = lerp(a, b, i / n); fAt(m, u, v, PT); const y = PT[1] - H * 0.09; if (i) ctx.lineTo(PT[0], y); else ctx.moveTo(PT[0], y); }
        // 最前面一行的下沿参差（割过的地没有一道齐边）
        const vb = v + F.gap * (last ? 0.25 : 1.02);
        for (let i = n; i >= 0; i--) { const u = lerp(a, b, i / n); fAt(m, u, vb, PT); ctx.lineTo(PT[0], PT[1] + (last ? (hsh(i * 3.7 + 11) - 0.35) * 2.6 * s : 0)); }
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = A;
        // 一根根的麦茬
        ctx.strokeStyle = F.stubStalk;
        ctx.lineWidth = Math.max(0.5, 0.6 * s);
        ctx.beginPath();
        for (let i = 0; i < hs.length; i += F.q2) {
          const h = hs[i], u = lerp(ua, ub, h[0]);
          if (u > rr || u > b) break;
          if (u < a) continue;
          const ek = smoothstep(0, 0.035, u - ua) * (openR ? smoothstep(0, 0.035, ub - u) : 1);
          if (ek < 0.25) continue;
          fAt(m, u, v, PT);
          ctx.moveTo(PT[0], PT[1]); ctx.lineTo(PT[0] + (h[2] - 0.5) * 1.5 * s, PT[1] - H * (0.1 + 0.08 * h[1]) * ek);
        }
        ctx.stroke();
      }
    }
    // ── 还立着的：一行的身子（随风的明暗一浪一浪），两端斜斜地没入地里，顶上是穗
    if (ub > ss + 0.003) {
      const a = Math.max(ss, uw0), b = Math.min(ub, uw1);
      if (b > a + 0.0005) {
        const cutL = front > ua + 0.001;
        const n = Math.max(2, Math.ceil((b - a) / F.du));
        const wv = F.amp * 1.2 * s;
        ctx.fillStyle = bodyGrad(ctx, m, F, r, ua, ub);
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const u = lerp(a, b, i / n); fAt(m, u, v, PT);
          const ek = endK(u, ua, ub);
          const y = PT[1] - ek * (H * (0.92 + 0.05 * Math.sin(u * 41 + E[2]) + 0.03 * Math.sin(u * 97 + E[2] * 1.7)) - waveAt(PT[0], r) * wv);
          if (i) ctx.lineTo(PT[0], y); else ctx.moveTo(PT[0], y);
        }
        const bot = last ? 0.42 : 0.3;
        for (let i = n; i >= 0; i--) {
          const u = lerp(a, b, i / n); fAt(m, u, v, PT);
          ctx.lineTo(PT[0], PT[1] - H * bot * endK(u, ua, ub));
        }
        // 割开的一面：齐齐的一道，落到麦茬上
        if (cutL && a <= ss + 1e-6) { fAt(m, ss, v, PT); ctx.lineTo(PT[0], PT[1] - H * 0.08); }
        ctx.closePath(); ctx.fill();
        // 最前面的一行：身子下面不是一堵墙——一层淡淡的影，一丛细细的禾秆与草，脚下透出地来
        if (last && F.grow > 0.3) {
          ctx.globalAlpha = A * 0.3;
          ctx.fillStyle = F.sD;
          ctx.beginPath();
          for (let i = 0; i <= n; i++) { const u = lerp(a, b, i / n); fAt(m, u, v, PT); const y = PT[1] - H * 0.44 * endK(u, ua, ub); if (i) ctx.lineTo(PT[0], y); else ctx.moveTo(PT[0], y); }
          for (let i = n; i >= 0; i--) { const u = lerp(a, b, i / n); fAt(m, u, v, PT); ctx.lineTo(PT[0], PT[1] - H * (0.05 + 0.2 * hsh(i * 7.3 + r * 31)) * endK(u, ua, ub)); }
          ctx.closePath(); ctx.fill();
          const fr = m.fringe, lw = Math.max(0.45, 0.5 * s);
          ctx.lineWidth = lw;
          for (let pass = 0; pass < 3; pass++) {
            ctx.globalAlpha = A * (pass === 0 ? 0.5 : pass === 1 ? 0.7 : 0.55);
            ctx.strokeStyle = pass === 0 ? F.stalkDk : pass === 1 ? F.stalk : F.grass;
            ctx.beginPath();
            for (let i = 0; i < fr.length; i++) {
              const q = fr[i];
              if ((q[3] < 0.3 ? 2 : q[3] < 0.72 ? 0 : 1) !== pass) continue;
              const u = lerp(ua, ub, q[0]);
              if (u < Math.max(ss, a) || u > b) continue;
              const ek = endK(u, ua, ub);
              if (ek < 0.08) continue;
              fAt(m, u, v, PT);
              const hgt = (pass === 2 ? H * (0.1 + 0.14 * q[1]) : H * (0.3 + 0.3 * q[1])) * ek;
              const lean = q[2] * hgt * 0.35 + waveAt(PT[0], r) * F.amp * hgt * 0.06;
              ctx.moveTo(PT[0], PT[1] + (0.3 + 0.9 * q[1]) * s); ctx.lineTo(PT[0] + lean, PT[1] - hgt);
            }
            ctx.stroke();
          }
          ctx.globalAlpha = A;
        }
        // 两端散出去的几根禾秆（开镰的那一面没有）
        let nh = 0;
        const st = m.stray[r];
        if (F.grow > 0.3 && !F.far) {
          ctx.strokeStyle = F.stalk;
          ctx.lineWidth = Math.max(0.5, 0.6 * s);
          ctx.beginPath();
          for (const q of st) {
            if (q[0] < 0 && cutL) continue;
            const u = q[0] < 0 ? ua - q[1] : ub + q[1];
            if (u < uw0 || u > uw1) continue;
            fAt(m, u, v, PT);
            const hgt = H * q[2], lean = q[3] * hgt * 0.35 + waveAt(PT[0], r) * wv * 0.6;
            const tx = PT[0] + lean, ty = PT[1] - hgt;
            ctx.moveTo(PT[0], PT[1] + 0.6 * s); ctx.quadraticCurveTo(PT[0] + lean * 0.2, PT[1] - hgt * 0.55, tx, ty);
            if (nh < 150) { HB[nh * 4] = tx; HB[nh * 4 + 1] = ty; HB[nh * 4 + 2] = lean * 0.08; HB[nh * 4 + 3] = q[4] > 0.5 ? 1 : 0; nh++; }
          }
          ctx.stroke();
        }
        // 穗：垂着头，随风摆；浪头经过处更亮（两批：菱形的小穗）
        if (F.grow > 0.35) {
          const hw = (0.45 + 0.45 * vv) * s, hh = (1.3 + 1.6 * vv) * s * (0.4 + 0.6 * F.grow);
          for (let i = 0; i < hs.length && nh < 150; i += F.q2) {
            const h = hs[i], u = lerp(ua, ub, h[0]);
            if (u < Math.max(ss, a) || u > b) continue;
            const ek = endK(u, ua, ub);
            if (ek < 0.3) continue;
            fAt(m, u, v, PT);
            const w0 = waveAt(PT[0], r);
            const top = PT[1] - ek * (H * (0.9 + 0.22 * h[1]) - w0 * wv);
            const sw = w0 * F.amp * H * 0.1 + (h[2] - 0.5) * 1.6 * s;
            HB[nh * 4] = PT[0] + sw; HB[nh * 4 + 1] = top; HB[nh * 4 + 2] = sw; HB[nh * 4 + 3] = w0 > 0.5 ? 1 : 0; nh++;
          }
          for (let pass = 0; pass < 2; pass++) {
            ctx.fillStyle = pass ? F.headB : F.headA;
            ctx.beginPath();
            for (let j = 0; j < nh; j++) {
              if (HB[j * 4 + 3] !== pass) continue;
              const hx = HB[j * 4], top = HB[j * 4 + 1], tl = hh * (0.35 + HB[j * 4 + 2] * 0.04);
              ctx.moveTo(hx + tl, top - hh); ctx.lineTo(hx + hw, top); ctx.lineTo(hx - tl * 0.3, top + hh); ctx.lineTo(hx - hw, top); ctx.closePath();
            }
            ctx.fill();
          }
          // 大麦的芒：穗上一根根细细的刺，叫田的上沿毛茸茸的
          if (F.gold > 0.2 && !F.far) {
            ctx.strokeStyle = F.awn;
            ctx.lineWidth = Math.max(0.4, 0.45 * s);
            ctx.beginPath();
            for (let j = r & 1; j < nh; j += 2) {
              const hx = HB[j * 4], top = HB[j * 4 + 1], sw = HB[j * 4 + 2];
              ctx.moveTo(hx + hh * 0.3, top - hh * 0.8); ctx.lineTo(hx + hh * 0.9 + sw * 0.3, top - hh * 2.7);
            }
            ctx.stroke();
          }
        }
      }
    }
    // 这一行的禾捆（立在割过的地上）
    if (p.k2 > 0.01 && m.shRow[r].length) drawSheaves(ctx, m, F, r, v, vv, front, A * p.k2, s);
  }
  // mode：'back'（人之后的几行）、'fore'（人之前的几行）、'all'（中丘上的田）
  function drawField(ctx, p, mode) {
    const A = p.a;
    if (A < 0.01) return;
    if (!p.model) p.model = fieldModel(p);
    const m = fieldGeom(p), F = fieldFrame(p, m);
    // 垄沟（饥荒时只见土）
    if (mode !== 'fore' && F.grow < 0.6) {
      ctx.globalAlpha = A * 0.5 * (1 - smoothstep(0.2, 0.6, F.grow));
      ctx.fillStyle = css(SOIL, F.l);
      ctx.beginPath();
      const e0 = m.ends[0], e1 = m.ends[ROWS - 1];
      for (let i = 0; i <= SAMP; i++) { fAt(m, lerp(e0[0], e0[1], i / SAMP), FV0 - 0.01, PT); if (i) ctx.lineTo(PT[0], PT[1]); else ctx.moveTo(PT[0], PT[1]); }
      for (let i = SAMP; i >= 0; i--) { fAt(m, lerp(e1[0], e1[1], i / SAMP), fv1(), PT); ctx.lineTo(PT[0], PT[1]); }
      ctx.closePath(); ctx.fill();
    }
    // 中丘上远处的田：隔一行画一行就够了
    for (let r = F.far ? 1 : 0; r < ROWS; r += F.far ? 2 : 1) {
      const fr = rowV(r) >= FSPLIT;
      if ((mode === 'back' && fr) || (mode === 'fore' && !fr)) continue;
      drawRow(ctx, p, m, F, r, A, 0, 1);
    }
    ctx.globalAlpha = 1;
  }
  // 站在田里的人：他身前的几行（到 FSPLIT 为止）在他那一窄条里再画一遍
  const OCC = [], IV = [], IVT = [];
  function ivCut(a, b) {
    IVT.length = 0;
    for (let i = 0; i < IV.length; i += 2) {
      const x0 = IV[i], x1 = IV[i + 1];
      if (b <= x0 || a >= x1) { IVT.push(x0, x1); continue; }
      if (a > x0) IVT.push(x0, a);
      if (b < x1) IVT.push(b, x1);
    }
    IV.length = 0;
    for (let i = 0; i < IVT.length; i++) IV.push(IVT[i]);
  }
  const GR = [];   // 按"身前从哪一行起"分组：同一组的人一起补画（一组一次裁剪）
  function drawFieldOcclusion(ctx, p) {
    if (p.layer !== 2 || p.a < 0.05 || !p.model || p.grow < 0.15 || p.reap >= 0.999) return;
    const c = C();
    if (!c || !c.people || !c.crowds) return;
    const m = fieldGeom(p), F = fieldFrame(p, m);
    const xa = m.RX[0], xb = m.RX[SAMP], Wd = Math.max(1, xb - xa), xf = xAt(m, p.reap);
    OCC.length = 0;
    const take = e => {
      if (!e || !e._vis || e.isAnimal || e.alpha < 0.05 || (e.layer != null && e.layer !== 2)) return;
      // 只有站在还立着的麦子里（或跟前）的人才要补画
      if (e._x + e._h * 0.4 < xf || e._x < xa - 16 || e._x > xb + 16 || (e.v || 0) >= FSPLIT - 0.004) return;
      OCC.push(e);
    };
    for (const e of c.people.values()) take(e);
    for (const g of c.crowds.values()) for (let i = 0; i < g.members.length; i++) take(g.members[i]);
    if (!OCC.length) return;
    GR.length = 0;
    for (const e of OCC) {
      const v = e.v || 0;
      let r0 = 0;
      while (r0 < ROWS && rowV(r0) <= v + 0.002) r0++;
      if (r0 >= ROWS || rowV(r0) >= FSPLIT) continue;
      const hw = e._h * 0.36 + 2 * F.s;
      IV.length = 0; IV.push(e._x - hw, e._x + hw);
      // 在他前面的人不被他身前的麦子遮住
      for (const o of OCC) {
        if (o === e || (o.v || 0) <= v + 0.015) continue;
        const ow = o._h * 0.32;
        ivCut(o._x - ow, o._x + ow);
        if (!IV.length) break;
      }
      if (!IV.length) continue;
      let g = null;
      for (const q of GR) if (q.r0 === r0) { g = q; break; }
      if (!g) { g = { r0, rects: [], x0: Infinity, x1: -Infinity }; GR.push(g); }
      const top = e._y - e._h * 1.3, hgt = e._h * 1.3 + 70 * F.s;
      for (let i = 0; i < IV.length; i += 2) { g.rects.push(IV[i], top, IV[i + 1] - IV[i], hgt); g.x0 = Math.min(g.x0, IV[i]); g.x1 = Math.max(g.x1, IV[i + 1]); }
    }
    for (const g of GR) {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < g.rects.length; i += 4) ctx.rect(g.rects[i], g.rects[i + 1], g.rects[i + 2], g.rects[i + 3]);
      ctx.clip();
      const uw0 = (g.x0 - xa) / Wd - 0.01, uw1 = (g.x1 - xa) / Wd + 0.01;
      for (let r = g.r0; r < ROWS && rowV(r) < FSPLIT; r++) drawRow(ctx, p, m, F, r, p.a, uw0, uw1, true);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  // 禾捆：十几根禾秆在腰间捆住，下端散开立在地上，上端的穗子向四面垂开
  function drawSheaves(ctx, m, F, r, v, vv, front, A, s) {
    const list = m.shRow[r];
    const ua = m.ends[r][0], ub = m.ends[r][1];
    const hgt = (11 + 9 * vv) * s;
    for (let pass = 0; pass < 3; pass++) {
      ctx.beginPath();
      let any = false;
      for (const q of list) {
        const u = lerp(ua, ub, q.u);
        const k = 1 - smoothstep(front - 0.06, front - 0.012, u);
        if (k < 0.05) continue;
        fAt(m, u, v, PT);
        const h = hgt * q.k * (0.55 + 0.45 * k), x = PT[0], y = PT[1] + 1 * s, t = q.tilt;
        any = true;
        if (pass === 0) {
          // 禾秆的一束：下宽、腰细、上散
          ctx.moveTo(x - 0.22 * h, y);
          ctx.lineTo(x - 0.07 * h + t * h * 0.4, y - 0.45 * h);
          ctx.quadraticCurveTo(x - 0.3 * h + t * h, y - 0.8 * h, x - 0.2 * h + t * h, y - 0.95 * h);
          ctx.lineTo(x + 0.22 * h + t * h, y - 0.95 * h);
          ctx.quadraticCurveTo(x + 0.3 * h + t * h, y - 0.8 * h, x + 0.07 * h + t * h * 0.4, y - 0.45 * h);
          ctx.lineTo(x + 0.22 * h, y);
          ctx.closePath();
        } else if (pass === 1) {
          // 上端向四面垂开的五个穗（菱形，比椭圆省）
          for (let i = 0; i < 5; i++) {
            const kx = (i - 2) / 2, ex = x + t * h + kx * 0.26 * h, ey = y - 0.98 * h + Math.abs(kx) * 0.1 * h;
            const ca = Math.cos(kx * 0.7), sa = Math.sin(kx * 0.7), rw = 0.055 * h, rh = 0.11 * h;
            ctx.moveTo(ex - sa * rh, ey - ca * rh); ctx.lineTo(ex + ca * rw, ey - sa * rw);
            ctx.lineTo(ex + sa * rh, ey + ca * rh); ctx.lineTo(ex - ca * rw, ey + sa * rw); ctx.closePath();
          }
        } else {
          ctx.rect(x - 0.08 * h + t * h * 0.4, y - 0.49 * h, 0.16 * h, 0.06 * h);
        }
      }
      if (!any) return;
      ctx.globalAlpha = A;
      ctx.fillStyle = pass === 0 ? F.shBody : pass === 1 ? F.shHead : F.shBand;
      ctx.fill();
    }
  }

  // 禾场：一片压实的圆地，一圈石，麦堆，旁边一盏灯（3:2–7）
  function floorPos(p) { const s = LS(2) * p.size; return { s, x: p.x * W.w, y: baseY(2, p.x, p.v) }; }
  function drawFloor(ctx, p) {
    const { s, x, y } = floorPos(p);
    const rx = 30 * s, ry = 6 * s, lampK = p.fire * nightK();
    ctx.globalAlpha = p.a * p.grow;
    ctx.fillStyle = css([178, 154, 112], 2, 1, 0.04 + 0.28 * lampK);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([120, 100, 74], 2, 0.8); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.stroke();
    // 夜里：灯照亮的一圈场边
    if (lampK > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.grow * 0.4 * lampK;
      ctx.strokeStyle = 'rgb(255,186,108)'; ctx.lineWidth = Math.max(0.8, 1.3 * s);
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0.05 * Math.PI, 0.95 * Math.PI); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a * p.grow;
    }
    ctx.fillStyle = css([138, 128, 114], 2);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rx, y + Math.sin(a) * ry, 1.6 * s, 1.1 * s, 0, 0, TAU); ctx.fill();
    }
    // 麦堆
    const hk = p.k;
    if (hk > 0.01) {
      const hx = x + 7 * s, hw = 15 * s * (0.5 + 0.5 * hk), hh = 11 * s * hk;
      ctx.fillStyle = css([204, 164, 88], 2, 1, 0.08 + 0.5 * lampK);
      ctx.beginPath(); ctx.moveTo(hx - hw, y + 1 * s); ctx.quadraticCurveTo(hx - hw * 0.35, y - hh * 1.25, hx + hw * 0.1, y - hh); ctx.quadraticCurveTo(hx + hw * 0.6, y - hh * 0.9, hx + hw, y + 1 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([250, 222, 150], 2, 0.6 * dayA() + 0.3 * p.fire * nightK(), 0.2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(hx - hw * 0.8, y - hh * 0.5); ctx.quadraticCurveTo(hx - hw * 0.35, y - hh * 1.25, hx + hw * 0.1, y - hh); ctx.stroke();
      ctx.fillStyle = css([236, 204, 130], 2, 0.8, 0.1);
      for (let i = 0; i < 10; i++) ctx.fillRect(hx + (hsh(i * 3.1) - 0.5) * hw * 1.4, y - hh * hsh(i * 7.7) * 0.8, 0.9 * s, 0.9 * s);
    }
    // 灯：放在两人之间、场的前沿
    if (p.fire > 0.01) {
      const { lx, ly } = lampPos(p);
      ctx.fillStyle = css([150, 104, 70], 2);
      ctx.beginPath(); ctx.ellipse(lx, ly - 1.2 * s, 3 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP && SP.warm, lx, ly - 6 * s, 50 * s, p.a * p.fire * (0.16 + 0.34 * nightK()), 0.55);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, lx + 2 * s, ly - 2 * s, 4.5 * s, p.a * p.fire, 7.1);
    }
    ctx.globalAlpha = 1;
  }
  function lampPos(p) { const { s, x, y } = floorPos(p); return { s, lx: x - 5 * s, ly: y + 5 * s }; }
  // 夜里灯光照在场上的人身上（在人之前画，用"加亮"）
  function drawFloorGlow(ctx) {
    const p = getP('floor');
    if (!p || !SP || p.fire < 0.01) return;
    const k = p.a * p.fire * nightK();
    if (k < 0.02) return;
    const { s, lx, ly } = lampPos(p);
    const fl = 0.9 + 0.1 * Math.sin(W.t * 7.3) + 0.05 * Math.sin(W.t * 13.1);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, lx, ly - 12 * s, 40 * s, k * 0.34 * fl, 0.8);
    glowAt(SP.amber, lx, ly - 4 * s, 16 * s, k * 0.3 * fl, 0.7);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：天光、翅膀、衣襟、天上的名字
  // ════════════════════════════════════════════════════════════
  // 耶和华眷顾自己的百姓（1:6）：几束天光破云，落在伯利恒一带（在一切陆地之后）
  function drawVisitSky(ctx) {
    const k = W.lv.ruVisit;
    if (k < 0.01 || !SP) return;
    const sx = 0.8 * W.w, sy = -0.3 * W.h;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const tx = (0.56 + i * 0.075) * W.w, ty = W.horizonY + 0.08 * W.h;
      const dx = tx - sx, dy = ty - sy, L = Math.hypot(dx, dy), ang = Math.atan2(dx, dy);
      const w = (26 + 30 * hsh(i * 2.7)) * SU() * (1 + 0.6 * (L / W.h));
      ctx.save();
      ctx.translate(sx, sy); ctx.rotate(-ang);
      ctx.globalAlpha = k * (0.14 + 0.1 * Math.sin(W.t * 0.35 + i * 1.9)) * (0.4 + 0.6 * W.daylight);
      ctx.drawImage(SP.ray, -w / 2, 0, w, L);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 地上被照亮的一片（在人之后）
  function drawVisitLand(ctx) {
    const k = W.lv.ruVisit;
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const x = 0.82 * W.w, y = gY(2, 0.82);
    glowAt(SP.gold, x, y, 0.3 * W.w, k * 0.2 * (0.4 + 0.6 * W.daylight), 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 翅膀（2:12）：一对光的翅膀，自她头上拱起，两翼垂到地——她坐在一道光的拱下。
  // 只是光，没有身形：翼根处暖白，向翼尖淡去，只留一道淡淡的前缘；白天"盖上"一层光，夜里才"加亮"。
  // 衣襟（3:9）是它小而淡的回影。
  // 一片羽：细长的叶形（没有描边，只是一片淡光；几片叠在一起，靠臂处就浓些）
  function plume(ctx, x, y, dx, dy, L, w) {
    const nx = dy, ny = -dx, ex = x + dx * L, ey = y + dy * L;
    ctx.beginPath();
    ctx.moveTo(x + nx * w * 0.35, y + ny * w * 0.35);
    ctx.quadraticCurveTo(x + dx * L * 0.8 + nx * w * 1.2, y + dy * L * 0.8 + ny * w * 1.2, ex, ey);
    ctx.quadraticCurveTo(x + dx * L * 0.8 - nx * w, y + dy * L * 0.8 - ny * w, x - nx * w * 0.35, y - ny * w * 0.35);
    ctx.closePath();
    ctx.fill();
  }
  function drawWings(ctx, k, cx, fy, h, S, rgb) {
    if (k < 0.01 || !SP) return;
    const open = smoothstep(0, 0.9, k), br = Math.sin(W.t * 0.7) * 0.012;
    const nk = nightK(), lit = nk > 0.45;
    // 两翼的肩在她（站着时）头的高处，腕稍稍拱起，羽自臂、自腕垂到地——她跪在翼下的拱里
    const ry = fy - h * 0.95, lift = (0.04 + 0.1 * open + br) * S;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, cx, fy - h * 0.4, S * 0.4, k * (0.16 + 0.22 * nk), 0.85);
    const g = ctx.createRadialGradient(cx, ry - lift * 0.5, S * 0.02, cx, ry + (fy - ry) * 0.15, Math.max(S * 0.46, (fy - ry + lift) * 1.4));
    g.addColorStop(0, rgbaS(rgb, 1)); g.addColorStop(0.6, rgbaS(rgb, 0.72)); g.addColorStop(1, rgbaS(rgb, 0));
    ctx.globalCompositeOperation = lit ? 'lighter' : 'source-over';
    ctx.fillStyle = g;
    const aF = Math.min(1, k) * (lit ? 0.24 : 0.26);
    for (let sd = -1; sd <= 1; sd += 2) {
      const Ax = cx + sd * S * 0.012, Ay = ry;
      const Kx = cx + sd * S * 0.04, Ky = ry - lift * 1.2;
      const Bx = cx + sd * S * (0.1 + 0.12 * open), By = ry - lift;               // 腕
      const Q = t => { const a = 1 - t; PT[0] = a * a * Ax + 2 * a * t * Kx + t * t * Bx; PT[1] = a * a * Ay + 2 * a * t * Ky + t * t * By; return PT; };
      ctx.globalAlpha = aF;
      // 次级飞羽：自臂下垂，近根处短（她头上留出一道拱），近腕处长到地
      for (let i = 0; i < 7; i++) {
        const t = 0.26 + 0.74 * (i / 6);
        Q(t);
        const x = PT[0], y = PT[1], L = (fy - y) * (0.34 + 0.68 * t), an = (0.08 + 0.24 * t) * (0.5 + 0.5 * open);
        plume(ctx, x, y, sd * Math.sin(an), Math.cos(an), L, S * 0.05);
      }
      // 初级飞羽：自腕向外、向下扇开，垂到地
      for (let j = 0; j < 6; j++) {
        const q = j / 5, an = (0.12 + 0.55 * q) * (0.45 + 0.55 * open);
        const L = Math.min((fy - By) / Math.max(0.35, Math.cos(an)) * (1.02 - 0.22 * q), S * 0.55);
        plume(ctx, Bx, By, sd * Math.sin(an), Math.cos(an), L, S * (0.046 - 0.008 * q));
      }
      // 覆羽：顺着臂的一条（前缘）
      ctx.globalAlpha = aF * 1.3;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) { Q(i / 10); if (i) ctx.lineTo(PT[0], PT[1]); else ctx.moveTo(PT[0], PT[1]); }
      for (let i = 10; i >= 0; i--) { Q(i / 10); ctx.lineTo(PT[0] + sd * S * 0.01, PT[1] + S * (0.02 + 0.035 * (i / 10))); }
      ctx.closePath(); ctx.fill();
    }
    // 前缘一道淡淡的亮线
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgbaS([Math.min(255, rgb[0] + 8), Math.min(255, rgb[1] + 8), Math.min(255, rgb[2] + 12)], 1);
    ctx.lineWidth = Math.max(0.8, S * 0.007);
    ctx.globalAlpha = Math.min(1, k) * (lit ? 0.4 : 0.28);
    ctx.beginPath();
    for (let sd = -1; sd <= 1; sd += 2) {
      ctx.moveTo(cx + sd * S * 0.012, ry);
      ctx.quadraticCurveTo(cx + sd * S * 0.04, ry - lift * 1.2, cx + sd * S * (0.1 + 0.12 * open), ry - lift);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function wingSpan(f) { return Math.min(W.w * 0.36, 190 * SU()) * (f || 1); }
  // 翅膀随着她（她走开，翅膀也不留在空田上）
  function drawShelter(ctx) {
    const k1 = W.lv.ruWing, k2 = W.lv.ruKanaf;
    if (k1 < 0.01 && k2 < 0.01) return;
    const f = fig('ruth');
    if (!f || !f._vis || f.alpha < 0.05) return;
    const h = f._h || 40 * LS(2);
    if (k1 > 0.01) drawWings(ctx, k1 * f.alpha, f._x, f._y, h, wingSpan(1), [255, 238, 196]);
    if (k2 > 0.01) drawWings(ctx, k2 * f.alpha * 0.85, f._x, f._y, h * 0.85, wingSpan(0.62), [228, 230, 255]);
  }
  // 法勒斯到大卫：一串名字在天上亮起（4:18–22）——自左下（久远）升到伯利恒的上空（大卫）
  const LA = new Float32Array(GENE.length);
  let GP = null;
  function genePts() {
    const key = W.w + 'x' + W.h;
    if (GP && GP.key === key) return GP.pts;
    const pr = port();
    const p0 = pr ? [0.1, 0.565] : [0.5, 0.53], c = pr ? [0.44, 0.34] : [0.6, 0.15], p2 = pr ? [0.86, 0.37] : [0.9, 0.145];
    const B = t => { const a = 1 - t; return [(a * a * p0[0] + 2 * a * t * c[0] + t * t * p2[0]) * W.w, (a * a * p0[1] + 2 * a * t * c[1] + t * t * p2[1]) * W.h]; };
    // 按弧长等分，名与名之间一样远
    const N = 200, acc = [0];
    let prev = B(0);
    for (let i = 1; i <= N; i++) { const q = B(i / N); acc.push(acc[i - 1] + Math.hypot(q[0] - prev[0], q[1] - prev[1])); prev = q; }
    const pts = [];
    for (let k = 0; k < GENE.length; k++) {
      const target = acc[N] * (k / (GENE.length - 1));
      let j = 0; while (j < N && acc[j + 1] < target) j++;
      const t = (j + (acc[j + 1] > acc[j] ? (target - acc[j]) / (acc[j + 1] - acc[j]) : 0)) / N;
      const q = B(t), q2 = B(Math.min(1, t + 0.01)), q1 = B(Math.max(0, t - 0.01));
      const dx = q2[0] - q1[0], dy = q2[1] - q1[1], L = Math.hypot(dx, dy) || 1;
      // 法线（朝左上的一侧）
      let nx = dy / L, ny = -dx / L;
      if (ny > 0) { nx = -nx; ny = -ny; }
      pts.push([q[0], q[1], nx, ny]);
    }
    GP = { key, pts };
    return pts;
  }
  // 名字的离屏字样（带一点暗影），按字号缓存；字体载入后重写一次
  const TS = new Map(), TS_K = 2;
  let tsFontsOK = false;
  function textSprite(str, size, last) {
    if (!tsFontsOK && document.fonts && document.fonts.check && document.fonts.check('16px "GS Kai"', str)) { tsFontsOK = true; TS.clear(); }
    const key = str + '|' + size.toFixed(1);
    let c = TS.get(key);
    if (c) return c;
    try {
      const fs = size * TS_K, n = Array.from(str).length;
      c = cnv(Math.ceil(fs * (n * 1.1 + 0.6)), Math.ceil(fs * 1.6));
      const g = c.getContext('2d');
      g.font = fs.toFixed(1) + 'px ' + GFONT;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = 'rgba(40,24,10,0.55)';
      g.fillText(str, c.width / 2 + TS_K, c.height / 2 + TS_K);
      g.fillStyle = last ? 'rgb(255,232,176)' : 'rgb(250,226,178)';
      g.fillText(str, c.width / 2, c.height / 2);
      TS.set(key, c);
    } catch (e) { c = null; }
    return c;
  }
  const GFONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  function drawLine(ctx) {
    const k = W.lv.ruLine;
    if (k < 0.01 || !SP) return;
    const pts = genePts(), nk = 0.55 + 0.45 * nightK(), u = SU();
    ctx.globalCompositeOperation = 'lighter';
    // 连起来的一道细光
    ctx.strokeStyle = 'rgb(255,226,160)';
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (let i = 1; i < pts.length; i++) {
      const a = Math.min(LA[i - 1], LA[i]) * k * nk * 0.3;
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
    }
    // 自怀中的孩子升到「俄备得」的一线光
    if (LA[7] > 0.01) {
      const f = fig('naomi');
      if (f && f.carry === 'baby' && f._vis) {
        const bx = f._x + (f.fd || 1) * f._h * 0.12, by = f._y - f._h * 0.55, t = pts[7];
        const gr = ctx.createLinearGradient(bx, by, t[0], t[1]);
        gr.addColorStop(0, 'rgba(255,230,170,0.5)'); gr.addColorStop(1, 'rgba(255,230,170,0.08)');
        ctx.strokeStyle = gr;
        ctx.globalAlpha = LA[7] * k * nk * 0.8;
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - (bx - t[0]) * 0.2, (by + t[1]) / 2, t[0], t[1]); ctx.stroke();
      }
    }
    // 星与名
    for (let i = 0; i < pts.length; i++) {
      const a = LA[i] * k;
      if (a < 0.01) continue;
      const last = i === pts.length - 1, x = pts[i][0], y = pts[i][1];
      const tw = 0.85 + 0.15 * Math.sin(W.t * (1.2 + (i % 4) * 0.3) + i * 1.7);
      const r = (last ? 3.4 : 1.9) * u;
      glowAt(SP.gold, x, y, r * (last ? 9 : 6), a * nk * (last ? 0.55 : 0.4) * tw);
      ctx.globalAlpha = a * tw;
      ctx.fillStyle = last ? 'rgb(255,240,200)' : 'rgb(255,236,196)';
      ctx.beginPath(); ctx.arc(x, y, r * 0.6, 0, TAU); ctx.fill();
      ctx.globalAlpha = a * tw * 0.45;
      ctx.fillRect(x - r * 3, y - 0.5, r * 6, 1);
      ctx.fillRect(x - 0.5, y - r * 3, 1, r * 6);
    }
    ctx.globalCompositeOperation = 'source-over';
    // 名（预先写在离屏画布上）
    for (let i = 0; i < pts.length; i++) {
      const a = LA[i] * k;
      if (a < 0.02) continue;
      const last = i === pts.length - 1, x = pts[i][0], y = pts[i][1];
      const size = last ? Math.max(20, 30 * W.unit) : Math.max(12, 16 * W.unit);
      // 名字在星的两侧交替（沿法线），末一个「大卫」在上
      const sd = last ? 1 : (i % 2 ? 1 : -1), off = size * (last ? 0.95 : 0.8) + 5 * u;
      const tx = x + pts[i][2] * off * sd * (last ? 0.3 : 1), ty = y + (last ? -off : pts[i][3] * off * sd);
      const img = textSprite(GENE[i], size, last);
      if (!img) continue;
      ctx.globalAlpha = a * (0.6 + 0.4 * nk);
      ctx.drawImage(img, tx - img.width / (2 * TS_K), ty - img.height / (2 * TS_K), img.width / TS_K, img.height / TS_K);
    }
    ctx.globalAlpha = 1;
  }

  // 收割的人手里的镰刀：弯腰时手里一弯亮刃，随手挥动（在麦子之前画，身前的麦子会遮住它；
  // 站在路得、波阿斯等人后面的，不画——免得刀画到前面的人身上）
  const FRONTS = ['ruth', 'boaz', 'overseer'];
  function drawSickles(ctx) {
    const ms = cmembers('reapers');
    if (!ms.length) return;
    const glint = 0.35 + 0.65 * W.daylight;
    const steel = css([222, 224, 230], 2, 1, 0.12), wood = css([92, 66, 42], 2);
    ctx.lineCap = 'round';
    for (const m of ms) {
      if (!m._vis || m.alpha < 0.05 || m.pose !== 'bow' || m.tx != null) continue;
      const h = m._h, d = m.fd >= 0 ? 1 : -1, sw = Math.sin(W.t * 2.4 + m.ord * 1.3);
      const hx = m._x + d * h * 0.3, hy = m._y - h * 0.3;
      let hid = false;
      for (const id of FRONTS) {
        const o = fig(id);
        if (o && o._vis && (o.v || 0) > (m.v || 0) + 0.02 && Math.abs(o._x - hx) < o._h * 0.45 + h * 0.2) { hid = true; break; }
      }
      if (hid) continue;
      ctx.save();
      ctx.translate(hx, hy); ctx.rotate(d * sw * 0.45); ctx.scale(d, 1);
      ctx.globalAlpha = m.alpha;
      ctx.strokeStyle = wood; ctx.lineWidth = Math.max(1, h * 0.035);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(h * 0.03, h * 0.06); ctx.stroke();
      ctx.strokeStyle = steel; ctx.lineWidth = Math.max(1, h * 0.03);
      ctx.beginPath(); ctx.moveTo(h * 0.03, h * 0.06); ctx.quadraticCurveTo(h * 0.17, h * 0.12, h * 0.17, -h * 0.02); ctx.stroke();
      ctx.restore();
      if (glint > 0.2 && sw > 0.75 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.white, hx + d * h * 0.12, hy + h * 0.06, h * 0.14, m.alpha * glint * (sw - 0.75) * 3);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
  }
  // 簸扬（3:2）：麦粒落下，糠秕随晚风飘去
  function drawChaff(ctx) {
    if (!S.winnow || !SP) return;
    const f = fig('boaz'), p = getP('floor');
    if (!f || !f._vis || !p) return;
    const s = LS(2), x = f._x + (f.fd || 1) * f._h * 0.15, top = f._y - f._h * 1.15, nk = nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) {
      const ph = U.fract(W.t * 0.45 + i / 26);
      const px = x - ph * (70 + 40 * hsh(i)) * s, py = top - Math.sin(ph * Math.PI) * 12 * s + ph * 22 * s;
      ctx.globalAlpha = (1 - ph) * 0.55 * (0.5 + 0.5 * nk) * p.a;
      ctx.fillStyle = 'rgb(255,226,170)';
      ctx.fillRect(px, py, 1.3 * s, 1.3 * s);
    }
    for (let i = 0; i < 10; i++) {
      const ph = U.fract(W.t * 0.9 + i / 10);
      ctx.globalAlpha = (1 - ph) * 0.8 * p.a;
      ctx.fillStyle = 'rgb(255,206,120)';
      ctx.fillRect(x + (hsh(i * 5) - 0.5) * 6 * s, top + ph * (f._y - top), 1.1 * s, 1.6 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 满满的：路得背着的大麦发出暖光（3:15–17 你不可空手回去）
  function drawFull(ctx) {
    if (!S.full || !SP) return;
    const f = fig('ruth');
    if (!f || !f._vis || f.prop !== 'bundle') return;
    ctx.globalCompositeOperation = 'lighter';
    const pulse = 0.8 + 0.2 * Math.sin(W.t * 1.6);
    glowAt(SP.gold, f._x - (f.fd || 1) * f._h * 0.14, f._y - f._h * 0.6, f._h * 0.7, 0.45 * pulse * f.alpha);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 怀中的孩子：一团暖光，叫人一眼看得出是个孩子（4:13–16）
  function drawBabes(ctx) {
    if (!SP) return;
    for (const id of ['ruth', 'naomi']) {
      const f = fig(id);
      if (!f || !f._vis || f.carry !== 'baby' || f.alpha < 0.05) continue;
      const pulse = 0.85 + 0.15 * Math.sin(W.t * 1.9), d = f.fd || 1;
      const bx = f._x + d * f._h * 0.1, by = f._y - f._h * 0.56;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, bx, by, f._h * 0.36, 0.5 * pulse * f.alpha);
      glowAt(SP.white, bx, by, f._h * 0.11, 0.55 * pulse * f.alpha);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 饥荒：天是干的——一层暖而昏黄的霾压在地平线上（1:1；眷顾的话一出就散去）
  function drawDry(ctx) {
    const k = W.lv.ruDry;
    if (k < 0.01) return;
    const hy = W.horizonY;
    const g = ctx.createLinearGradient(0, hy * 0.25, 0, hy + 4);
    g.addColorStop(0, 'rgba(236,196,140,0)');
    g.addColorStop(0.6, 'rgba(232,190,132,' + (0.2 * k * (0.35 + 0.65 * W.daylight)).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(226,182,124,' + (0.36 * k * (0.35 + 0.65 * W.daylight)).toFixed(3) + ')');
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.fillRect(0, hy * 0.25, W.w, hy * 0.75 + 4);
  }

  // 转瞬的光
  function drawTransients(ctx, pass) {
    if (!FXL.length || !SP) return;
    ctxA = ctx;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = baseY(e.l, e.xf, e.v) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.4 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        const g = e.w * 1.6;
        glowAt(SP.gold, x, y - g * 0.2, g, env * e.k * 0.45);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'wave' && pass === 'air') {
        // 一道光掠过全田（「愿耶和华赐福与你」、正是动手割大麦的时候）
        const p = getP(e.id);
        if (!p || !p.model) continue;
        const m = fieldGeom(p), env = Math.sin(Math.PI * q);
        ctx.globalCompositeOperation = 'lighter';
        for (let j = 0; j < 3; j++) {
          const u = clamp((e.dir > 0 ? q : 1 - q) * 1.2 - 0.1 - j * 0.06, 0, 1);
          fAt(m, u, 0.34, PT);
          glowAt(SP.gold, PT[0], PT[1] - 10 * LS(2), (0.05 + j * 0.02) * W.w, env * (0.26 - j * 0.07), 0.45);
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'pour' && pass === 'air') {
        // 六簸箕大麦：一簸箕一簸箕倒进她的外衣（3:15）
        const p = getP('floor'), f = fig('ruth');
        if (!p || !f || !f._vis) continue;
        const fp = floorPos(p), s = fp.s, hx = fp.x + 7 * s, hy = fp.y - 8 * s;
        const tx = f._x, ty = f._y - f._h * 0.62;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,222,150)';
        for (let j = 0; j < 6; j++) {
          for (let g = 0; g < 9; g++) {
            const ph = (e.t - j * 0.7 - g * 0.04) / 0.65;
            if (ph <= 0 || ph >= 1) continue;
            const x = lerp(hx, tx, ph) + (hsh(j * 13 + g) - 0.5) * 5 * s, y = lerp(hy, ty, ph) - Math.sin(ph * Math.PI) * 16 * s + (hsh(j * 7 + g * 3) - 0.5) * 3 * s;
            ctx.globalAlpha = 0.85 * Math.sin(ph * Math.PI);
            ctx.fillRect(x, y, 1.4 * s, 1.4 * s);
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'drop' && pass === 'air') {
        // 故意从捆里抽出的麦穗，落在她前面（2:16）
        const f = fig('ruth');
        if (!f || !f._vis) continue;
        const s = LS(2), env = 1 - smoothstep(0.8, 1, q);
        ctx.strokeStyle = 'rgb(255,220,140)';
        ctx.lineWidth = Math.max(0.7, 0.9 * s);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 9; i++) {
          const ph = U.fract(e.t * 0.55 + i / 9);
          const x = f._x + (hsh(i * 3.3) - 0.2) * 44 * s * (f.fd || 1), y0 = f._y - f._h * (0.9 + 0.3 * hsh(i)), y = lerp(y0, f._y + 2 * s, Math.min(1, ph * 1.4));
          const a = Math.min(1, ph * 1.4) >= 1 ? 1 - ph : 1;
          ctx.globalAlpha = env * 0.7 * a;
          const ang = ph * 4 + i;
          ctx.beginPath(); ctx.moveTo(x - Math.cos(ang) * 4 * s, y - Math.sin(ang) * 1.5 * s); ctx.lineTo(x + Math.cos(ang) * 4 * s, y + Math.sin(ang) * 1.5 * s); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'halo' && pass === 'air') {
        // 暗的名字身后淡淡的一片亮
        const env = smoothstep(0, 1.4, e.t) * (1 - smoothstep(e.dur - 1.6, e.dur, e.t));
        ctx.globalCompositeOperation = 'source-over';
        glowAt(SP.pale, e.x, e.y, e.r, env * 0.34, 0.5);
      } else if (e.type === 'sandal' && pass === 'air') {
        // 脱鞋为证（4:7–8）：鞋从那人手里递到波阿斯手里
        const a = fig(e.from), b = fig(e.to);
        if (!a || !b || !a._vis || !b._vis) continue;
        const s = LS(2), ph = smoothstep(0.1, 0.8, q);
        const x0 = a._x, y0 = a._y - a._h * 0.45, x1 = b._x, y1 = b._y - b._h * 0.55;
        const x = lerp(x0, x1, ph), y = lerp(y0, y1, ph) - Math.sin(ph * Math.PI) * 26 * s;
        ctx.globalAlpha = 1 - smoothstep(0.85, 1, q);
        ctx.fillStyle = css([150, 110, 70], 2, 1, 0.15);
        ctx.beginPath(); ctx.ellipse(x, y, 3.6 * s, 1.4 * s, -0.2, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.gold, x, y, 12 * s, 0.55 * (1 - smoothstep(0.85, 1, q)));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  // 城门口给波阿斯与那至近的亲属的两块石座（4:1–2）
  function drawSeats(ctx, p) {
    const s = LS(2);
    ctx.globalAlpha = p.a;
    for (const xf of [p.x0, p.x1]) {
      const x = xf * W.w, y = baseY(2, xf, p.v) + 1.5 * s, w = 7 * s, hh = 6.6 * s;
      ctx.fillStyle = css([150, 134, 108], 2);
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - w * 0.9, y - hh); ctx.lineTo(x + w * 0.9, y - hh * 1.05); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([176, 160, 132], 2, 1, 0.05);
      ctx.fillRect(x - w * 0.92, y - hh * 1.05 - 1.2 * s, w * 1.84, 1.6 * s);
    }
    ctx.globalAlpha = 1;
  }
  const DRAW = { house: drawHouse, graves: drawGraves, cairn: drawCairn, town: drawTown, gate: drawGate, seats: drawSeats, floor: drawFloor,
    field: (ctx, p) => drawField(ctx, p, p.layer === 2 ? 'back' : 'all') };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  let winT = 0;
  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 人在纵深里的前后
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.09 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
      // 天上的名字一颗一颗亮起
      for (let i = 0; i < LA.length; i++) { const tg = i < S.line ? 1 : 0; if (LA[i] !== tg) LA[i] = approachLin(LA[i], tg, 0.8 * f); }
      // 簸扬：扬起、落下（只是装饰；情节的下一拍会把他放下）
      if (S.winnow && !W.replaying) {
        winT += f;
        const b = fig('boaz');
        if (b && b.tx == null && winT > 1.25) { winT = 0; C().pose('boaz', b.pose === 'raise' ? 'bow' : 'raise'); }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { drawDry(ctx); drawVisitSky(ctx); drawLine(ctx); return; }
      if (pass === 'air') {
        U.safe('ruth.sickles', () => drawSickles(ctx));
        for (const p of sortProps()) {
          if (p.kind !== 'field' || p.layer !== 2 || p.a < 0.005) continue;
          U.safe('ruth.field.occl', () => drawFieldOcclusion(ctx, p));
          U.safe('ruth.field.fore', () => drawField(ctx, p, 'fore'));
        }
        drawVisitLand(ctx);
        drawFloorGlow(ctx);
        drawChaff(ctx);
        drawFull(ctx);
        drawBabes(ctx);
        U.safe('ruth.wings', () => drawShelter(ctx));
        drawTransients(ctx, 'air');
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW[p.kind];
        if (fn) U.safe('ruth.' + p.kind, () => fn(ctx, p));
      }
    },
    draw() {},
    reset() { P.clear(); FXL.length = 0; VT.clear(); sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
      for (let i = 0; i < LA.length; i++) LA[i] = i < S.line ? 1 : 0;
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.ta, r2(p.tgrow), r2(p.tgold), r2(p.treap), r2(p.tk), r2(p.tk2), r2(p.tfire), p.label].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1);
        if (p.kind === 'field') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, baseY(p.layer, xf, 0.3) - 14 * s); }
        else if (p.kind === 'town') { const xf = p.layer === 2 ? 0.95 : (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, gY(p.layer, xf) - 22 * s); }
        else if (p.kind === 'floor') { const fp = floorPos(p); consider(p.label, fp.x, fp.y - 8 * s); }
        else if (p.kind === 'gate') consider(p.label, p.x * W.w, gY(2, p.x) - 26 * s);
        else consider(p.label, p.x * W.w, gY(p.layer, p.x) - 12 * s);
      }
      if (W.lv.ruLine > 0.3) {
        const pts = genePts();
        for (let i = 0; i < pts.length; i++) if (LA[i] > 0.5) consider(GENE[i], pts[i][0], pts[i][1]);
      }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; VT.clear(); sorted = []; sortedN = -1;
    S = fresh();
    for (let i = 0; i < LA.length; i++) LA[i] = 0;
    winT = 0;
  }

  // ── 几件常用的事 ────────────────────────────────────────────
  // 波阿斯的田里收割到哪里了（0..1，自城那边向东）；收割的人与使女随之挪动
  // 收割的人沿着开镰的一线散开（一些已在还立着的麦子里），使女在他们身后捆禾；都在田的后半（v 0.06–0.22）。
  // 路得在使女身后、田的前面（v 0.4）拾取麦穗——一眼看得出她。
  const frontX = reap => X.fieldB0 + reap * (X.fieldB1 - X.fieldB0);
  const REAP = [-0.026, 0.04], MAIDS = [-0.06, -0.036], GLEAN_DX = -0.076, RUTH_V = 0.4;
  const gleanX = reap => frontX(reap) + GLEAN_DX;     // 路得拾取麦穗之处（比末一个使女再往后约 0.016，且在她们前面）
  function reapTo(b, reap, o) {
    o = o || {};
    prop('fieldB', null, { reap });
    const fx0 = frontX(reap);
    cwalk('reapers', fx0 + REAP[0], fx0 + REAP[1], { speed: o.speed || 0.012, pose: 'bow' });
    cwalk('maids', fx0 + MAIDS[0], fx0 + MAIDS[1], { speed: o.speed || 0.012, pose: 'bow' });
    cface('reapers', 1);
    cface('maids', 1);
  }
  function wave(b, id, dir) { flash(b, { type: 'wave', id, dir: dir || -1, dur: 2.6 }); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：士师秉政的时候，国中遭遇饥荒；摩押地的三个寡妇
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 饥荒：地是枯黄的，花隐去；天是干的（没有雨云，只有一层暖黄的霾）
    W.set('bare', 0.75, true); W.set('bloom', 0.1, true); W.set('storm', 0, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.4, herbs: 0.3, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      ruVisit: 0, ruWing: 0, ruKanaf: 0, ruLamp: 0, ruLine: 0, ruDry: 1 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    // 青草自摩押（东）一带而起；那棵树长在摩押的坡上，荫着坟与小屋
    W.setOrigin('grass', W.w * 0.47, W.ridgeBaseY(2, W.w * 0.47));
    W.setOrigin('herbs', W.w * 0.47, W.ridgeBaseY(2, W.w * 0.47));
    W.setOrigin('trees', W.w * 0.37, W.ridgeBaseY(2, W.w * 0.37));
    W.goTo(0.33, 0, true);
    const lx = W.w * 0.44, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 24, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 摩押（最东头的坡上）：小屋、三座坟；一堆界石；伯利恒：城门与房屋（中丘上也有几间）；犹大的田：干裂的垄沟
    prop('house', 'house', { x: X.house, label: '摩押地' });
    prop('graves', 'graves', { x: X.graves, label: '三座坟' });
    prop('cairn', 'cairn', { x: X.cairn });
    prop('townM', 'town', { x0: 0.8, x1: 0.97, layer: 1, label: '伯利恒' });
    prop('town', 'town', { x0: X.town0, x1: X.town1, label: '伯利恒' });
    prop('gate', 'gate', { x: X.gate, label: '城门' });
    prop('fieldB', 'field', { x0: X.fieldB0, x1: X.fieldB1, big: true, grow: 0.02, gold: 0, reap: 0, k2: 1, label: '波阿斯的田' });
    prop('fieldO', 'field', { x0: X.fieldO0, x1: X.fieldO1, layer: 1, grow: 0.02, gold: 0, reap: 0, k2: 1, label: '别人的田' });
    const c = C();
    c.clear({ fade: false });
    add('naomi', { label: '拿俄米', sex: 'f', age: 'elder', x: X.naomi0, facing: -1, pose: 'sit', robe: ROBE.naomi, glow: 0.35, prop: null });
    add('orpah', { label: '俄珥巴', sex: 'f', x: X.orpah0, facing: -1, pose: 'weep', robe: ROBE.orpah, glow: 0.2 });
    add('ruth', { label: '路得', sex: 'f', x: X.ruth0, facing: -1, pose: 'kneel', robe: ROBE.ruth, glow: 0.3, accent: [236, 214, 186] });
    // 中丘上伯利恒的羊群（只是点缀）
    if (c.herd) U.safe('cast.herd', () => c.herd('flock', { kind: 'sheep', n: 6, x0: 0.53, x1: 0.62, layer: 1, from: 'none', mill: true }));
    avoid([0.38, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒；情节里补充的经文排在其后。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:6 耶和华眷顾自己的百姓：天光、雨、青苗；三个妇人上路 ─────
    {
      kind: 'act', utter: '耶和华眷顾自己的百姓，赐粮食与他们', cmd: 'visit 犹大 && provide 粮食  # 伯利恒 = 粮食之家', ref: '1:6',
      verse: [
        { text: '她就与两个儿妇起身，要从摩押地归回；<br>因为她在摩押地听见耶和华眷顾自己的百姓，赐粮食与他们。', ref: '路得记 1:6', hold: 7 },
        { text: '于是她和两个儿妇起行离开所住的地方，要回犹大地去。', ref: '路得记 1:7', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('ruVisit', 1, b.instant); W.set('ruDry', 0, b.instant);
            W.set('clouds', 0.62, b.instant); W.set('rain', 0.3, b.instant); W.set('storm', 0.12, b.instant);
            beam(b, 0.8, 2, { dur: 6, w: 150, r: 0.34 });
            sfx(b, 'harp'); sfx(b, 'rain', { soft: true });
          }],
          [1.4, () => { pose('naomi', 'stand'); face('naomi', 1); }],
          [2.4, b => {
            prop('fieldB', null, { grow: 1 }); prop('fieldO', null, { grow: 1 });
            W.set('bare', 0.26, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 0.7, b.instant); W.set('bloom', 0.45, b.instant);
            pose('naomi', 'gaze');
          }],
          [4.2, () => { pose('orpah', 'stand'); pose('ruth', 'stand'); face('orpah', 1); face('ruth', 1); }],
          [6, b => { W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.32, b.instant); W.goTo(0.37, 6, b.instant); sfx(b, 'bird', { soft: true }); }],
          // 起行：走到摩押地的边上、界石跟前
          [8.3, () => {
            walk('naomi', 0.568, { speed: 0.024 });
            walk('orpah', 0.553, { speed: 0.022 });
            walk('ruth', 0.539, { speed: 0.02 });
            avoid([0.38, 1]);
          }],
          [13.6, b => { W.set('ruVisit', 0.12, b.instant); }],
        ]);
      },
    },

    // ── 1:8 愿耶和华恩待你们：哭声；俄珥巴回去；路得的誓 ─────────
    {
      kind: 'bless', utter: '愿耶和华恩待你们', cmd: 'bless --each 俄珥巴 路得 --with 恩待', ref: '1:8',
      verse: [
        { text: '拿俄米对两个儿妇说：「你们各人回娘家去吧。<br>愿耶和华恩待你们，像你们恩待已死的人与我一样！」', ref: '路得记 1:8', hold: 6.5 },
        { text: '两个儿妇又放声而哭，俄珥巴与婆婆亲嘴而别，<br>只是路得舍不得拿俄米。', ref: '路得记 1:14', hold: 6 },
        { text: '路得说：「不要催我回去不跟随你。你往哪里去，我也往那里去；你在哪里住宿，我也在那里住宿；<br>你的国就是我的国，你的神就是我的神。', ref: '路得记 1:16', hold: 7 },
        { text: '你在哪里死，我也在那里死，也葬在那里。<br>除非死能使你我相离！不然，愿耶和华重重地降罚与我。」', ref: '路得记 1:17', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.set('ruVisit', 0, b.instant); face('naomi', -1); pose('naomi', 'raise'); face('orpah', 1); face('ruth', 1); }],
          [1.2, b => {
            glow('orpah', 0.6); glow('ruth', 0.6);
            if (!b.instant && fx()) { const h = headOf('orpah', 0.5); fx().ring(h[0] - 8 * SU(), h[1], [255, 232, 190], M() * 0.12, 2, 1.6); }
            sparkleOn(b, 'orpah', 14); sparkleOn(b, 'ruth', 14);
          }],
          [3.8, b => { pose('naomi', 'weep', { weep: true }); pose('orpah', 'weep', { weep: true }); pose('ruth', 'weep', { weep: true }); sfx(b, 'weep'); }],
          [7.8, () => { embrace('orpah', 'naomi', { weep: true }); }],
          [11.2, () => {
            pose('orpah', 'stand'); pose('naomi', 'stand'); glow('orpah', 0.15);
            walk('orpah', X.house + 0.028, { speed: 0.026 });
          }],
          [12.2, () => { embrace('ruth', 'naomi', { weep: true }); }],
          [15.6, b => { pose('ruth', 'kneel'); glow('ruth', 0.85); sparkleOn(b, 'ruth', 24); sfx(b, 'harp', { soft: true }); }],
          [18.6, () => { rm('orpah'); }],
          [20.4, b => {
            pose('ruth', 'stand'); pose('naomi', 'stand'); face('naomi', 1); face('ruth', 1);
            hands('ruth', 'naomi', true); glow('ruth', 0.55); glow('naomi', 0.45);
            beamOn(b, 'ruth', { dur: 4, w: 90, r: 0.16 });
          }],
          // 过了界石，往犹大地去
          [22.4, () => { walk('naomi', 0.648, { speed: 0.022 }); walk('ruth', 0.633, { speed: 0.022 }); }],
        ]);
      },
    },

    // ── 1:21 耶和华使我空空地回来：城门口的妇女；拿俄米 → 玛拉；大麦黄熟 ─
    {
      kind: 'act', utter: '耶和华使我空空地回来', cmd: 'mv 拿俄米 玛拉  # 满满地出去，空空地回来', ref: '1:21',
      verse: [
        { text: '于是二人同行，来到伯利恒。她们到了伯利恒，合城的人就都惊讶。<br>妇女们说：「这是拿俄米吗？」', ref: '路得记 1:19', hold: 6.5 },
        { text: '拿俄米对她们说：「不要叫我拿俄米，要叫我玛拉，因为全能者使我受了大苦。<br>我满满地出去，耶和华使我空空地回来。……」', ref: '路得记 1:20–21', hold: 8 },
        { text: '拿俄米和她儿妇摩押女子路得，从摩押地回来到伯利恒，<br>正是动手割大麦的时候。', ref: '路得记 1:22', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.6, 9, b.instant);
            walk('naomi', X.gate - 0.03, { speed: 0.03 }); walk('ruth', X.gate - 0.046, { speed: 0.03 });
            avoid([0.38, 1]);
          }],
          [2.6, b => {
            crowd('women', { n: 6, x0: X.gate + 0.004, x1: X.gate + 0.07, layer: 2, label: '妇女们' }, woman(WOMEN, 0.02, 0.16));
            cwalk('women', X.gate - 0.012, X.gate + 0.045, { speed: 0.03 });
            sfx(b, 'crowd', { soft: true });
          }],
          [6.2, () => { cface('women', -1); }],
          [7.8, b => { nameOver(b, 'naomi', '拿俄米', { hold: 2.2 }); }],
          [9.4, () => { pose('naomi', 'weep'); pose('ruth', 'bow'); }],
          // 「拿俄米」散去时，以暗色聚成「玛拉」（在同一处）
          [12.2, b => { nameOver(b, 'naomi', '玛拉', { dark: true, hold: 2.6, rgb: [60, 30, 34] }); sfx(b, 'weep', { soft: true }); }],
          [17.1, b => {
            prop('fieldB', null, { gold: 1, reap: 0.1 }); prop('fieldO', null, { gold: 1 });
            W.set('bare', 0.34, b.instant);
            W.goTo(0.7, 6, b.instant);
            pose('naomi', 'stand'); pose('ruth', 'gaze'); face('naomi', -1); face('ruth', -1);
            wave(b, 'fieldB', -1);
            sfx(b, 'wind', { soft: true });
          }],
          [20.5, () => { cwalk('women', X.door + 0.03, X.door + 0.12, { speed: 0.03 }); }],
          // 天黑了，二人进城回家
          [22.6, b => { walk('naomi', X.door, { speed: 0.024 }); walk('ruth', X.door - 0.018, { speed: 0.024 }); hands('ruth', 'naomi', false); W.goTo(0.95, 5, b.instant); }],
          [24, () => { crm('women'); }],
        ]);
      },
    },

    // ── 2:4 愿耶和华与你们同在：波阿斯的田（签名之景）─────────────
    {
      kind: 'bless', utter: '愿耶和华与你们同在', cmd: 'harvest --field 波阿斯 --glean 路得  # 恰巧', ref: '2:4',
      verse: [
        { text: '摩押女子路得对拿俄米说：「容我往田间去，我蒙谁的恩，就在谁的身后拾取麦穗。」<br>拿俄米说：「女儿啊，你只管去。」', ref: '路得记 2:2', hold: 7 },
        { text: '路得就去了，来到田间，在收割的人身后拾取麦穗。<br>她恰巧到了以利米勒本族的人波阿斯那块田里。', ref: '路得记 2:3', hold: 6.5 },
        { text: '波阿斯正从伯利恒来，对收割的人说：「愿耶和华与你们同在！」<br>他们回答说：「愿耶和华赐福与你！」', ref: '路得记 2:4', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 过了一夜，第二天清早（上一句话在夜里结束，这里很快天亮）
          [0, b => {
            W.goTo(0.3, 3, b.instant);
            crm('women', true);
            place('naomi', X.door); place('ruth', X.door - 0.018);
            pose('naomi', 'sit'); face('naomi', -1); face('ruth', 1);
            prop('fieldB', null, { reap: 0.3 }); prop('fieldO', null, { reap: 0.3 });
            avoid([0.38, 1]);
          }],
          [2.2, b => {
            const f0 = frontX(0.3);
            crowd('reapers', { n: 6, x0: f0 + REAP[0], x1: f0 + REAP[1], layer: 2, label: '收割的人', pose: 'bow' }, man(LINEN, 0.06, 0.22));
            crowd('maids', { n: 4, x0: f0 + MAIDS[0], x1: f0 + MAIDS[1], layer: 2, label: '使女', pose: 'bow' }, woman(MAID, 0.08, 0.2));
            cface('reapers', 1); cface('maids', 1);
            sfx(b, 'wind', { soft: true });
          }],
          [3.2, () => { pose('ruth', 'stand'); face('naomi', 1); pose('naomi', 'raise'); }],
          [5.4, () => { pose('naomi', 'sit'); }],
          // 路得在收割的人、使女的身后拾取麦穗——在田的前面，暖红的衣裳，一道淡淡的光
          [8.3, b => {
            walk('ruth', gleanX(0.45), { speed: 0.034, pose: 'bow' }); sink('ruth', RUTH_V); glow('ruth', 0.5);
            reapTo(b, 0.45, { speed: 0.006 });
          }],
          // 波阿斯从城里来，站在田的另一头（他身前的麦子齐腰）
          [14.2, b => {
            add('boaz', { label: '波阿斯', x: X.gate + 0.004, facing: -1, robe: ROBE.boaz, glow: 0.45, accent: [214, 180, 110] });
            add('overseer', { label: '监管收割的仆人', x: X.gate + 0.03, facing: -1, robe: ROBE.overseer, glow: 0.1 });
            walk('boaz', 0.805, { speed: 0.03, pose: 'raise' }); walk('overseer', 0.782, { speed: 0.03 });
            sink('boaz', 0.32); sink('overseer', 0.24);
          }],
          [18.4, b => { beamOn(b, 'boaz', { dur: 4, w: 90, r: 0.2 }); sfx(b, 'harp'); }],
          [20.2, b => { cpose('reapers', 'raise'); cpose('maids', 'raise'); face('ruth', 1); wave(b, 'fieldB', 1); sfx(b, 'crowd', { soft: true }); }],
          [23, () => { cpose('reapers', 'bow'); cpose('maids', 'bow'); pose('boaz', 'stand'); }],
        ]);
      },
    },

    // ── 2:12 愿你满得他的赏赐：翅膀下（第二幅签名之景）──────────────
    {
      kind: 'promise', utter: '愿你满得他的赏赐', cmd: 'shelter 路得 --under 翅膀  # 耶和华以色列神的', ref: '2:12',
      verse: [
        { text: '波阿斯问监管收割的仆人说：「那是谁家的女子？」<br>监管收割的仆人回答说：「是那摩押女子，跟随拿俄米从摩押地回来的。」', ref: '路得记 2:5–6', hold: 7 },
        { text: '路得就俯伏在地叩拜，对他说：<br>「我既是外邦人，怎么蒙你的恩，这样顾恤我呢？」', ref: '路得记 2:10', hold: 6 },
        { text: '「愿耶和华照你所行的赏赐你。<br>你来投靠耶和华以色列神的翅膀下，愿你满得他的赏赐。」', ref: '路得记 2:12', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.42, 6, b.instant); face('boaz', -1); face('overseer', -1); pose('boaz', 'point'); }],
          [2.6, () => { pose('overseer', 'point'); pose('boaz', 'stand'); }],
          // 收割的人往前割去；波阿斯走到她跟前，二人单独在麦茬地里
          [4.2, b => { reapTo(b, 0.66, { speed: 0.008 }); }],
          [6, () => { pose('overseer', 'stand'); }],
          [8.3, () => { walk('boaz', gleanX(0.45) + 0.04, { speed: 0.02 }); sink('boaz', RUTH_V - 0.02); pose('ruth', 'stand'); face('ruth', 1); }],
          [10.2, b => { pose('ruth', 'fall'); sfx(b, 'weep', { soft: true }); }],
          [13, () => { face('boaz', -1); }],
          [15.6, b => {
            W.set('ruWing', 1, b.instant);
            glow('ruth', 0.8);
            walk('boaz', gleanX(0.45) + 0.078, { speed: 0.012 }); face('boaz', -1);
            sfx(b, 'wings', { soft: true }); sfx(b, 'angel', { soft: true });
            sparkleOn(b, 'ruth', 30, [255, 240, 200]);
          }],
          [18.4, () => { pose('ruth', 'kneel'); }],
          [22.4, b => { W.set('ruWing', 0.55, b.instant); }],
        ]);
      },
    },

    // ── 2:20 愿那人蒙耶和华赐福：吃饼；故意抽出的麦穗；一伊法大麦；收完了 ─
    {
      kind: 'bless', utter: '愿那人蒙耶和华赐福', cmd: 'drop --on-purpose 麦穗 --for 路得  # 不可叱吓她', ref: '2:20',
      verse: [
        { text: '到了吃饭的时候，波阿斯对路得说：「你到这里来吃饼，将饼蘸在醋里。」<br>……她吃饱了，还有余剩的。', ref: '路得记 2:14', hold: 6 },
        { text: '这样，路得在田间拾取麦穗，直到晚上，<br>将所拾取的打了，约有一伊法大麦。', ref: '路得记 2:17', hold: 5.5 },
        { text: '拿俄米对儿妇说：「愿那人蒙耶和华赐福，因为他不断地恩待活人死人。」<br>拿俄米又说：「那是我们本族的人，是一个至近的亲属。」', ref: '路得记 2:20', hold: 7 },
        { text: '于是路得与波阿斯的使女常在一处拾取麦穗，直到收完了大麦和小麦。<br>路得仍与婆婆同住。', ref: '路得记 2:23', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 正午：众人坐下吃饭
          [0, b => {
            W.goTo(0.5, 4, b.instant); W.set('ruWing', 0, b.instant);
            cpose('reapers', 'sit'); cpose('maids', 'sit');
            pose('boaz', 'point'); pose('ruth', 'stand');
          }],
          // 她在收割的人旁边坐下（在使女们前面）
          [1.6, () => { walk('ruth', gleanX(0.45) + 0.046, { speed: 0.02, pose: 'sit' }); sink('ruth', RUTH_V); pose('boaz', 'stand'); }],
          [4.2, b => { if (!b.instant && fx()) { const h = headOf('boaz', 0.5), r = headOf('ruth', 0.4); fx().sow(h[0], h[1], [[r[0], r[1], 1.6], [r[0] + 3, r[1] - 2, 1.4], [r[0] - 2, r[1] + 1, 1.5]], [255, 214, 140], { pass: 'top', dur: 1.2, stagger: 0.4 }); } }],
          // 又拾取；从捆里抽出的麦穗留在地下
          [7.3, b => {
            cpose('reapers', 'bow'); cpose('maids', 'bow');
            reapTo(b, 0.85, { speed: 0.009 });
            walk('ruth', gleanX(0.85), { speed: 0.008, pose: 'bow' });
            flash(b, { type: 'drop', dur: 6 });
            W.goTo(0.73, 7, b.instant);
          }],
          // 晚上：打了，约有一伊法；带进城去
          [12.4, () => { pose('ruth', 'kneel'); }],
          [13.4, b => { hold('ruth', 'bundle'); sparkleOn(b, 'ruth', 20, [255, 220, 150]); sfx(b, 'build', { soft: true }); }],
          [14.2, () => { walk('ruth', X.door - 0.018, { speed: 0.042 }); sink('ruth', 0); glow('ruth', 0.55); pose('naomi', 'stand'); face('naomi', -1); }],
          [18.8, b => { pose('naomi', 'raise'); face('ruth', 1); hold('ruth', null); }],
          [19.8, b => { nameOver(b, 'boaz', '波阿斯', { hold: 2.2 }); beamOn(b, 'boaz', { dur: 4, w: 80, r: 0.14 }); }],
          [21.8, () => { pose('naomi', 'stand'); }],
          // 收完了大麦和小麦
          [22.4, b => {
            reapTo(b, 1, { speed: 0.02 });
            prop('fieldO', null, { reap: 1 });
            W.goTo(0.78, 6, b.instant); W.set('ruWing', 0, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          [27.6, () => { crm('reapers'); crm('maids'); rm('overseer'); pose('boaz', 'stand'); }],
        ]);
      },
    },

    // ── 3:10 女儿啊，愿你蒙耶和华赐福：禾场的夜 ─────────────────
    {
      kind: 'bless', utter: '女儿啊，愿你蒙耶和华赐福', cmd: 'spread 衣襟 --over 路得  # 至近的亲属', ref: '3:10',
      verse: [
        { text: '波阿斯吃喝完了，心里欢畅，就去睡在麦堆旁边。<br>路得便悄悄地来掀开他脚上的被，躺卧在那里。', ref: '路得记 3:7', hold: 6.5 },
        { text: '到了夜半，那人忽然惊醒……他就说：「你是谁？」<br>回答说：「我是你的婢女路得。求你用你的衣襟遮盖我，因为你是我一个至近的亲属。」', ref: '路得记 3:8–9', hold: 8 },
        { text: '波阿斯说：「女儿啊，愿你蒙耶和华赐福。你末后的恩比先前更大……<br>女儿啊，现在不要惧怕，凡你所说的，我必照着行；我本城的人都知道你是个贤德的女子。」', ref: '路得记 3:10–11', hold: 8 },
      ],
      apply(c) {
        T(c, [
          // 黄昏：禾捆都运到禾场上；波阿斯簸大麦（3:2）
          [0, b => {
            W.goTo(0.84, 4, b.instant);
            crm('reapers', true); crm('maids', true); rm('overseer', true);
            prop('fieldB', null, { k2: 0, reap: 1 }); prop('fieldO', null, { k2: 0, reap: 1 });
            prop('floor', 'floor', { x: X.floor, v: 0.12, grow: 1, k: 1, fire: 1, label: '禾场' });
            walk('boaz', X.floor + 0.024, { speed: 0.03, pose: 'raise' }); sink('boaz', 0.1);
            glow('boaz', 0.5); glow('ruth', 0.5);
            crowd('feast', { n: 4, x0: X.floor + 0.04, x1: X.floor + 0.075, layer: 2, label: '收割的人', pose: 'sit' }, man(LINEN, 0.14, 0.3));
            avoid([0.46, 1]);
          }],
          [1.2, () => { S.winnow = 1; }],
          [3, b => { W.goTo(0.97, 7, b.instant); cwalk('feast', 0.95, 1.08, { speed: 0.03 }); }],
          [2, () => { walk('ruth', X.floor - 0.016, { speed: 0.036, pose: 'lie' }); sink('ruth', 0.14); pose('naomi', 'sit'); }],
          [5, b => { S.winnow = 0; walk('boaz', X.floor + 0.01, { speed: 0.02, pose: 'lie' }); face('boaz', 1); }],
          [8.6, () => { crm('feast'); }],
          // 夜半：你是谁？
          [9.4, b => { pose('boaz', 'sit'); face('boaz', -1); sfx(b, 'wind', { soft: true }); }],
          [10.8, () => { pose('ruth', 'kneel'); face('ruth', 1); }],
          [12.6, b => { W.set('ruKanaf', 1, b.instant); sfx(b, 'wings', { soft: true }); sfx(b, 'harp', { soft: true }); }],
          [17.1, b => { pose('boaz', 'raise'); glow('ruth', 0.9); sparkleOn(b, 'ruth', 26, [236, 232, 255]); sfx(b, 'harp'); }],
          [21.5, b => { pose('boaz', 'sit'); W.set('ruKanaf', 0.45, b.instant); }],
        ]);
      },
    },

    // ── 3:13 我指着永生的耶和华起誓：天快亮；六簸箕大麦 ─────────────
    {
      kind: 'name', utter: '永生的耶和华', cmd: 'swear --by 永生的耶和华 && give 大麦 ×6  # 不可空手回去', ref: '3:13',
      verse: [
        { text: '「你今夜在这里住宿，明早他若肯为你尽亲属的本分，就由他吧！<br>倘若不肯，我指着永生的耶和华起誓，我必为你尽了本分，你只管躺到天亮。」', ref: '路得记 3:13', hold: 7.5 },
        { text: '路得便在他脚下躺到天快亮，人彼此不能辨认的时候就起来了。……<br>波阿斯就撮了六簸箕大麦，帮她扛在肩上，她便进城去了。', ref: '路得记 3:14–15', hold: 7 },
        { text: '又说：「那人给了我六簸箕大麦，对我说：<br>『你不可空手回去见你的婆婆。』」', ref: '路得记 3:17', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { pose('boaz', 'raise'); beamOn(b, 'boaz', { dur: 4, w: 70, r: 0.14 }); sfx(b, 'seal', { soft: true }); }],
          [3.6, b => { pose('boaz', 'lie'); pose('ruth', 'lie'); W.set('ruKanaf', 0.2, b.instant); }],
          [5, b => { W.goTo(0.215, 6, b.instant); }],
          // 天快亮，人彼此不能辨认的时候
          [9.6, b => { pose('ruth', 'stand'); pose('boaz', 'stand'); W.set('ruKanaf', 0, b.instant); }],
          [11, b => { flash(b, { type: 'pour', dur: 4.8 }); sfx(b, 'build', { soft: true }); prop('floor', null, { k: 0.72 }); }],
          [14.4, b => { hold('ruth', 'bundle'); S.full = 1; }],
          [15.2, b => {
            walk('ruth', X.door - 0.018, { speed: 0.042 }); sink('ruth', 0);
            prop('floor', null, { fire: 0 });
            W.goTo(0.3, 6, b.instant);
          }],
          [16.4, () => { pose('naomi', 'stand'); face('naomi', -1); }],
          [20.4, b => { face('ruth', 1); embrace('ruth', 'naomi', { at: X.door - 0.009 }); sparkleOn(b, 'ruth', 22, [255, 222, 150]); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 4:12 愿耶和华从这少年女子赐你后裔：城门口；脱鞋为证 ─────────
    {
      kind: 'bless', utter: '愿耶和华从这少年女子赐你后裔', cmd: 'redeem 以利米勒的地 --witness 长老×10  # 脱鞋为证', ref: '4:12',
      verse: [
        { text: '波阿斯到了城门，坐在那里，恰巧波阿斯所说的那至近的亲属经过……<br>波阿斯又从本城的长老中拣选了十人，对他们说：「请你们坐在这里。」他们就都坐下。', ref: '路得记 4:1–2', hold: 7 },
        { text: '那人对波阿斯说：「你自己买吧！」于是将鞋脱下来了。', ref: '路得记 4:8', hold: 4.5 },
        { text: '波阿斯对长老和众民说：「你们今日作见证……<br>又娶了玛伦的妻摩押女子路得为妻，好在死人的产业上存留他的名……」', ref: '路得记 4:9–10', hold: 6.5 },
        { text: '在城门坐着的众民和长老都说：「我们作见证。……<br>愿耶和华从这少年女子赐你后裔，使你的家像她玛从犹大所生法勒斯的家一般。」', ref: '路得记 4:11–12', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 城门口：长老坐在城墙下的长石座上，波阿斯与那人坐在他们面前的两块石上
          [0, b => {
            W.goTo(0.38, 5, b.instant);
            S.full = 0; hold('ruth', null);
            pose('ruth', 'stand'); pose('naomi', 'stand');
            prop('seats', 'seats', { x0: X.seatK, x1: X.seatB, v: X.seatV });
            walk('boaz', X.seatB, { speed: 0.04, pose: 'seat' }); sink('boaz', X.seatV); face('boaz', -1);
            unprop('floor');
            avoid([0.38, 1]);
          }],
          [0.8, () => {
            add('kin', { label: '那至近的亲属', x: 1.06, v: X.seatV, facing: -1, robe: ROBE.kin, glow: 0.12 });
            walk('kin', X.seatK, { speed: 0.04, pose: 'seat' }); face('kin', 1);
          }],
          [3.4, b => {
            crowd('elders', { n: 10, x0: 0.93, x1: 1.04, layer: 2, label: '长老', pose: 'stand' }, man(ELDER, 0, 0.07, 'elder'));
            cwalk('elders', X.bench0 + 0.008, X.gate - 0.016, { speed: 0.045, pose: 'seat' });
            sfx(b, 'crowd', { soft: true });
          }],
          [7.8, b => { pose('kin', 'stand'); face('kin', 1); }],
          [9, b => { flash(b, { type: 'sandal', from: 'kin', to: 'boaz', dur: 1.8 }); sfx(b, 'seal', { soft: true }); }],
          [11.2, () => { walk('kin', 1.08, { speed: 0.035 }); }],
          // 众民聚在城门里边、房屋前；路得走到城门口
          [13.6, b => {
            pose('boaz', 'raise'); face('boaz', -1);
            crowd('folk', { n: 8, x0: 0.905, x1: 0.985, layer: 2, label: '众民' }, (m, i) => { m.robe = WOMEN[i % WOMEN.length]; m.v = 0.04 + ((i * 0.618) % 1) * 0.14; });
            cface('folk', -1);
            walk('ruth', X.gate + 0.018, { speed: 0.02 }); sink('ruth', 0.3);
            sfx(b, 'crowd');
          }],
          [16.4, () => { rm('kin'); pose('boaz', 'stand'); }],
          [20.9, b => {
            cpose('elders', 'raise'); cpose('folk', 'raise');
            beamOn(b, 'ruth', { dur: 5, w: 90, r: 0.2 }); beamOn(b, 'boaz', { dur: 5, w: 90, r: 0.2 });
            glow('ruth', 0.8); glow('boaz', 0.7);
            sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
          }],
          [25.6, () => { cpose('elders', 'sit'); cpose('folk', 'stand'); }],
        ]);
      },
    },

    // ── 4:13 耶和华使她怀孕生了一个儿子：婚筵的灯；孩子 ────────────
    {
      kind: 'act', utter: '耶和华使她怀孕生了一个儿子', cmd: 'fork 俄备得 --from 路得 --blessed', ref: '4:13',
      verse: [
        { text: '于是，波阿斯娶了路得为妻……耶和华使她怀孕生了一个儿子。', ref: '路得记 4:13', hold: 6 },
        { text: '妇人们对拿俄米说：「耶和华是应当称颂的！因为今日没有撇下你，使你无至近的亲属。……<br>有这儿妇比有七个儿子还好！」', ref: '路得记 4:14–15', hold: 7.5 },
        { text: '拿俄米就把孩子抱在怀中，作他的养母。', ref: '路得记 4:16', hold: 5 },
      ],
      apply(c) {
        T(c, [
          // 婚筵：黄昏，城中点起灯来
          [0, b => {
            W.goTo(0.77, 4, b.instant); W.set('ruLamp', 1, b.instant);
            crm('elders'); crm('folk'); unprop('seats');
            pose('boaz', 'stand'); sink('boaz', 0.1); sink('ruth', 0.1);
            add('ruth', { accent: [246, 222, 160] });
            crowd('lamps', { n: 6, x0: 0.7, x1: 0.78, layer: 2, label: '使女', prop: 'torch' }, woman(MAID, 0.04, 0.3));
            cwalk('lamps', 0.8, 0.87, { speed: 0.035 });
            sfx(b, 'harp');
          }],
          [1.6, () => { walk('boaz', X.door - 0.004, { speed: 0.035 }); }],
          [3.6, () => { face('ruth', 1); face('boaz', -1); hands('ruth', 'boaz', true); }],
          // 夜
          [4.6, b => { W.goTo(0.02, 3, b.instant); rm('boaz'); rm('ruth'); cpose('lamps', 'stand'); }],
          // 夜里：一年过去——田又青了
          [6.4, () => {
            prop('fieldB', null, { reap: 0, grow: 0.2, gold: 0, k2: 0, now: true });
            prop('fieldO', null, { reap: 0, grow: 0.2, gold: 0, k2: 0, now: true });
          }],
          [6.6, () => { crm('lamps'); }],
          // 早晨：孩子；田里的大麦又长起来，黄熟了
          [7.6, b => {
            W.goTo(0.33, 3.5, b.instant); W.set('ruLamp', 0.3, b.instant);
            prop('fieldB', null, { grow: 1, gold: 1 }); prop('fieldO', null, { grow: 1, gold: 1 });
          }],
          [9.6, b => {
            add('ruth', { label: '路得', sex: 'f', x: X.door - 0.02, facing: 1, pose: 'stand', robe: ROBE.ruth, glow: 0.7, accent: [246, 222, 160] });
            babe('ruth', 'baby');
            add('boaz', { label: '波阿斯', x: X.door + 0.03, facing: -1, robe: ROBE.boaz, glow: 0.45, accent: [214, 180, 110] });
            beamOn(b, 'ruth', { dur: 5, w: 100, r: 0.2 });
            sfx(b, 'angel', { soft: true });
          }],
          [11.4, b => {
            crowd('neighbors', { n: 6, x0: 0.79, x1: 0.86, layer: 2, label: '邻舍的妇人' }, woman(WOMEN, 0.04, 0.26));
            cface('neighbors', 1);
            sfx(b, 'crowd', { soft: true });
          }],
          [13.4, b => { cpose('neighbors', 'raise'); face('naomi', -1); }],
          [15.6, () => { face('naomi', 1); }],
          [16.8, b => {
            babe('ruth', null); babe('naomi', 'baby'); glow('naomi', 0.8);
            if (!b.instant && fx()) { const h = headOf('naomi', 0.5); fx().ring(h[0], h[1], [255, 230, 180], M() * 0.14, 2.2, 1.6); }
            sparkleOn(b, 'naomi', 26, [255, 236, 190]);
            sfx(b, 'harp', { soft: true });
          }],
          [19, () => { cpose('neighbors', 'stand'); }],
        ]);
      },
    },

    // ── 4:14 愿这孩子在以色列中得名声：俄备得；法勒斯到大卫 ─────────
    {
      kind: 'bless', utter: '耶和华是应当称颂的', cmd: 'git log 法勒斯..大卫 --oneline', ref: '4:14',
      verse: [
        { text: '邻舍的妇人说：「拿俄米得孩子了！」就给孩子起名叫俄备得。<br>这俄备得是耶西的父，耶西是大卫的父。', ref: '路得记 4:17', hold: 7 },
        { text: '法勒斯的后代记在下面：<br>法勒斯生希斯仑；希斯仑生兰；兰生亚米拿达；亚米拿达生拿顺；', ref: '路得记 4:18–20', hold: 6 },
        { text: '拿顺生撒门；撒门生波阿斯；<br>波阿斯生俄备得；俄备得生耶西；耶西生大卫。', ref: '路得记 4:20–22', hold: 6.5 },
      ],
      apply(c) {
        const beats = [
          [0, b => { W.goTo(0.772, 8, b.instant); W.set('ruLamp', 0.8, b.instant); W.set('ruLine', 1, b.instant); cpose('neighbors', 'raise'); }],
          [0.8, b => { nameOver(b, 'naomi', '拿俄米', { hold: 2, rgb: [255, 230, 170] }); sfx(b, 'laugh', { soft: true }); }],
          [3.8, b => { nameOver(b, 'naomi', '俄备得', { hold: 2.6, rgb: [255, 238, 196] }); }],
          [6.4, () => { cpose('neighbors', 'stand'); }],
        ];
        // 名字随经文一颗一颗亮起：法勒斯……拿顺随第二行，撒门……大卫随第三行
        for (let i = 0; i < GENE.length; i++) {
          beats.push([i < 5 ? 8.8 + i * 1.1 : 15.9 + (i - 5) * 1.2, b => {
            S.line = i + 1;
            if (!b.instant) {
              const p = genePts()[i];
              if (fx()) fx().sparkle(p[0], p[1], i === GENE.length - 1 ? 40 : 12, [255, 232, 180], (i === GENE.length - 1 ? 18 : 8) * SU(), 'top');
              sfx(b, 'stars', { soft: i < GENE.length - 1 });
            }
          }]);
        }
        beats.push([21.4, b => {
          pose('naomi', 'gaze'); pose('ruth', 'gaze'); pose('boaz', 'gaze'); cpose('neighbors', 'gaze');
          sfx(b, 'harp');
        }]);
        T(c, beats);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '路得记', books: [8], title: '路得', sub: '路得记 1 — 4', tint: [255, 226, 170], music: 'jacob',
    outro: 18,
    intro: [
      { text: '当士师秉政的时候，国中遭遇饥荒。<br>在犹大的伯利恒，有一个人带着妻子和两个儿子往摩押地去寄居。', ref: '路得记 1:1', hold: 6.5 },
      { text: '后来拿俄米的丈夫以利米勒死了……这两个儿子娶了摩押女子为妻，一个名叫俄珥巴，一个名叫路得……<br>玛伦和基连二人也死了，剩下拿俄米，没有丈夫，也没有儿子。', ref: '路得记 1:3–5', hold: 8.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '拿俄米': { text: '拿俄米就把孩子抱在怀中，作他的养母。', ref: '路得记 4:16' },
      '路得': { text: '你往哪里去，我也往那里去；你在哪里住宿，我也在那里住宿；<br>你的国就是我的国，你的神就是我的神。', ref: '路得记 1:16' },
      '俄珥巴': { text: '两个儿妇又放声而哭，俄珥巴与婆婆亲嘴而别，只是路得舍不得拿俄米。', ref: '路得记 1:14' },
      '波阿斯': { text: '拿俄米的丈夫以利米勒的亲族中，有一个人名叫波阿斯，是个大财主。', ref: '路得记 2:1' },
      '监管收割的仆人': { text: '监管收割的仆人回答说：「是那摩押女子，跟随拿俄米从摩押地回来的。」', ref: '路得记 2:6' },
      '收割的人': { text: '波阿斯正从伯利恒来，对收割的人说：「愿耶和华与你们同在！」<br>他们回答说：「愿耶和华赐福与你！」', ref: '路得记 2:4' },
      '使女': { text: '于是路得与波阿斯的使女常在一处拾取麦穗，直到收完了大麦和小麦。', ref: '路得记 2:23' },
      '妇女们': { text: '于是二人同行，来到伯利恒。她们到了伯利恒，合城的人就都惊讶。<br>妇女们说：「这是拿俄米吗？」', ref: '路得记 1:19' },
      '那至近的亲属': { text: '那人说：「这样我就不能赎了，恐怕于我的产业有碍。你可以赎我所当赎的，我不能赎了。」', ref: '路得记 4:6' },
      '长老': { text: '波阿斯又从本城的长老中拣选了十人，对他们说：「请你们坐在这里。」他们就都坐下。', ref: '路得记 4:2' },
      '众民': { text: '在城门坐着的众民和长老都说：「我们作见证。」', ref: '路得记 4:11' },
      '邻舍的妇人': { text: '邻舍的妇人说：「拿俄米得孩子了！」就给孩子起名叫俄备得。', ref: '路得记 4:17' },
      '摩押地': { text: '在犹大的伯利恒，有一个人带着妻子和两个儿子往摩押地去寄居。', ref: '路得记 1:1' },
      '三座坟': { text: '玛伦和基连二人也死了，剩下拿俄米，没有丈夫，也没有儿子。', ref: '路得记 1:5' },
      '伯利恒': { text: '又愿你在以法他得亨通，在伯利恒得名声。', ref: '路得记 4:11' },
      '城门': { text: '波阿斯到了城门，坐在那里，恰巧波阿斯所说的那至近的亲属经过。', ref: '路得记 4:1' },
      '波阿斯的田': { text: '路得就去了，来到田间，在收割的人身后拾取麦穗。<br>她恰巧到了以利米勒本族的人波阿斯那块田里。', ref: '路得记 2:3' },
      '别人的田': { text: '拿俄米对儿妇路得说：「女儿啊，你跟着他的使女出去，不叫人遇见你在别人田间，这才为好。」', ref: '路得记 2:22' },
      '禾场': { text: '路得就下到场上，照她婆婆所吩咐她的而行。', ref: '路得记 3:6' },
      '法勒斯': { text: '法勒斯的后代记在下面：法勒斯生希斯仑；', ref: '路得记 4:18' },
      '希斯仑': { text: '希斯仑生兰；兰生亚米拿达；', ref: '路得记 4:19' },
      '兰': { text: '希斯仑生兰；兰生亚米拿达；', ref: '路得记 4:19' },
      '亚米拿达': { text: '亚米拿达生拿顺；拿顺生撒门；', ref: '路得记 4:20' },
      '拿顺': { text: '亚米拿达生拿顺；拿顺生撒门；', ref: '路得记 4:20' },
      '撒门': { text: '撒门生波阿斯；波阿斯生俄备得；', ref: '路得记 4:21' },
      '俄备得': { text: '这俄备得是耶西的父，耶西是大卫的父。', ref: '路得记 4:17' },
      '耶西': { text: '俄备得生耶西；耶西生大卫。', ref: '路得记 4:22' },
      '大卫': { text: '俄备得生耶西；耶西生大卫。', ref: '路得记 4:22' },
    },
  });
})(window.GS);
