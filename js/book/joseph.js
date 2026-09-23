/* ─────────────────────────────────────────────────────────────
 * book/joseph.js —— 卷 · 约瑟（创世记 37:1 — 50:26）：全书的末卷
 *
 * 彩衣与两个梦（禾捆下拜；日、月与十一个星下拜）；多坍的坑，二十舍客勒银子，米甸的驼队；
 * 染了血的彩衣，雅各的哀哭；犹大（38 章，一句）；一夜之间，左边的地化作埃及：沙色的地、尼罗河、
 * 棕树、远处中丘上的金字塔；波提乏的家——「耶和华与他同在」（一道与他同行的光）；监牢——
 * 「耶和华与约瑟同在，向他施恩」；酒政与膳长的梦（葡萄树、三筐白饼）；法老的梦：七只肥壮的母牛、
 * 七只干瘦的母牛从河里上来，七个好穗子、七个被东风吹焦的穗子；「神已将所要做的事指示法老了」；
 * 七个丰年：田里金黄，仓廪充满；七个荒年：草木枯干，天下的人都来籴粮；众兄长脸伏于地（梦的回影）；
 * 便雅悯与银杯，犹大的恳求；「我是约瑟」——放声大哭；别是巴的夜：「我要和你同下埃及去」；
 * 车辆、七十人、歌珊；以法莲与玛拿西（交叉的手）；十二支派——十二颗星升上天空；雅各归到列祖，
 * 葬在麦比拉洞；「神的意思原是好的」；「神必定看顾你们」——约瑟收殓在棺材里，停在埃及：
 * 全书最后的画面，安静而有盼望。
 *
 * 画面的方位：右 = 迦南（希伯仑：雅各的帐棚、麦比拉洞；别是巴在迦南与埃及之间），
 *            中 = 歌珊（最靠近迦南）与埃及的城（约瑟的家、仓城、监、波提乏的家），
 *            左 = 法老的宫与尼罗河（自远处流向观者），西岸的棕树；远处中丘上是金字塔。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'joseph';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('jsEgypt', 'exp', 0.32);    // 埃及：沙色的地、尼罗河、棕树、金字塔
  W.defineLevel('jsNile', 'exp', 0.35);     // 尼罗河的水（饥荒时低落）
  W.defineLevel('jsFamine', 'exp', 0.28);   // 饥荒：尘雾、枯干（41:54）
  W.defineLevel('jsGoshen', 'exp', 0.3);    // 歌珊的草场（47:27）
  W.defineLevel('jsDream', 'exp', 0.8);     // 梦的帷幕
  W.defineLevel('jsWith', 'exp', 0.5);      // 与约瑟同在的光（39:2，21）
  W.defineLevel('jsTribes', 'exp', 0.3);    // 十二颗星——十二支派（49:28）
  W.defineLevel('jsPromise', 'exp', 0.22);  // 应许之地的路（50:24）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 迦南
    tentJ: 0.905, tentB: 0.952, cave: 0.978, jacob: 0.884, dream: 0.79,
    pit: 0.604, beersheba: 0.838,
    // 埃及
    nileT: 0.5, nileB: 0.442, palace: 0.548, throne: 0.578, potiphar: 0.614, prison: 0.674,
    gran: 0.618, seat: 0.648, jhouse: 0.7,
    // 歌珊
    goshen0: 0.716, goshen1: 0.8, tentG1: 0.742, tentG2: 0.782, bed: 0.756, coffin: 0.735,
  };
  const ROBE = {
    jacob: [98, 106, 140], joseph: [206, 172, 116], benjamin: [184, 162, 128],
    reuben: [138, 98, 76], simeon: [112, 92, 80], levi: [118, 110, 142], judah: [158, 124, 72], dan: [104, 96, 84],
    naphtali: [118, 132, 100], gad: [132, 104, 96], asher: [156, 142, 100], issachar: [112, 100, 124], zebulun: [94, 120, 134],
    sack: [78, 70, 60], linen: [238, 232, 216], slave: [170, 150, 118], pharaoh: [242, 236, 216], potiphar: [228, 220, 198],
    wife: [236, 226, 208], cup: [218, 196, 146], baker: [200, 182, 150], keeper: [122, 106, 86], steward: [210, 200, 176],
    trader: [150, 112, 74], trader2: [120, 92, 66], asenath: [240, 232, 214],
  };
  const GOLD = [236, 194, 96], LAPIS = [64, 98, 160];
  const BROS = ['reuben', 'simeon', 'levi', 'judah', 'dan', 'naphtali', 'gad', 'asher', 'issachar', 'zebulun'];
  const BRO_CN = { reuben: '流便', simeon: '西缅', levi: '利未', judah: '犹大', dan: '但', naphtali: '拿弗他利', gad: '迦得', asher: '亚设', issachar: '以萨迦', zebulun: '西布伦' };
  const SONS12 = BROS.concat(['joseph', 'benjamin']);
  // 众兄长在纵深里的前后（v 越大越靠前）——站成一群，而不是一条线
  const BRO_V = { reuben: 0.1, simeon: 0.28, levi: 0.04, judah: 0.2, dan: 0.34, naphtali: 0.12, gad: 0.3, asher: 0.06, issachar: 0.22, zebulun: 0.38 };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { withId: null, inPit: 0, inPrison: 0, soulIn: 0, lampFeast: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  // 近地纵深里的一点：v 0 = 地的轮廓线，1 = 画面底
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g); };

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(3726); for (let i = 0; i < 1024; i++) RT.push(r()); })();
  const rt = i => RT[((i % 1024) + 1024) % 1024];

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (!fig(id)) return; const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function place(id, x, layer) { if (fig(id)) C().place(id, x, layer); }
  function relabel(id, label) { const f = fig(id); if (f) f.label = label; }
  function hold(id, what) {
    const c = C();
    if (!fig(id)) return;
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, what || null)); return; }
    const f = fig(id); if (f) f.prop = what || null;
  }
  function carry(id, what) {
    const c = C();
    if (!fig(id)) return;
    if (c.carry) { U.safe('cast.carry', () => c.carry(id, what || null)); return; }
    const f = fig(id); if (f) f.carry = what || null;
  }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function unfollow(id) { const f = fig(id); if (f) f.follow = null; }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function embrace(a, b, o) {
    const c = C();
    if (!fig(a) || !fig(b)) return;
    if (c.embrace) { U.safe('cast.embrace', () => c.embrace(a, b, o)); return; }
    const A = fig(a), B = fig(b);
    const mid = (A.nx + B.nx) / 2;
    walk(a, mid - 0.004, { pose: 'stand', speed: 0.07 }); walk(b, mid + 0.004, { pose: 'stand', speed: 0.07 });
  }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function say(b, lines, delay) {           // 情节中途的旁白（重演时不放）
    if (b.instant) return;
    GS.ui.narrate(lines, { replace: false, delay: delay || 0 });
  }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 众兄长
  function bros(fn, list) { (list || BROS).forEach((id, i) => { if (fig(id)) fn(id, i); }); }
  // 一群人走到 [x0, x1] 之间，各在各的位置（先后略有参差）
  function spread(ids, x0, x1, o) {
    o = o || {};
    const live = ids.filter(id => fig(id)), n = live.length;
    live.forEach((id, i) => {
      const x = n > 1 ? lerp(x0, x1, i / (n - 1)) : (x0 + x1) / 2;
      walk(id, x, { speed: (o.speed || 0.03) * (0.85 + 0.3 * rt(i * 7 + (o.seed || 0))), pose: o.pose, run: o.run });
    });
  }
  function poseAll(ids, p, o) { ids.forEach(id => pose(id, p, o)); }
  function faceAll(ids, d) { ids.forEach(id => face(id, d)); }

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = f.isAnimal ? 20 * LS(l) : 34 * LS(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    return [x, y - h * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某人头上聚成一个名字（微尘自 src 而来）
  function nameOver(b, id, str, rgb, src, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.7, W.h * 0.8];
    const size = (o.size || 0.045) * M(), n = Array.from(str).length;
    const c = nameAt(p[0], p[1] - size * (o.lift || 0.95) - 6, size, n);
    const from = src || (() => [p[0] + rand(-50, 50) * SU(), p[1] + rand(-20, 40) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, from, { hold: o.hold || 2.4, dot: o.dot, delay: o.delay });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  const srcAround = (id, r) => () => { const p = figPt(id, 0.5) || [W.w * 0.7, W.h * 0.8]; const k = (r || 60) * SU(); return [p[0] + rand(-k, k), p[1] + rand(-k * 0.6, k * 0.4)]; };

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.8, grow: 0.3, lit: 0.6, fire: 0.6, gold: 0.45, dry: 0.25, fill: 0.3, open: 0.8, seal: 0.5, stain: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, { x, layer, size, label, flip, show, grow, lit, fire, gold, dry, fill, open, seal, stain, tx, spd })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind: kind || 'tent', x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02, flip: 1, ph: 0, fd: 1, v: 0 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'size', 'label', 'spd', 'flip', 'v', 'variant']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.tx != null) { p.tx = o.tx; p.fd = o.tx >= p.x ? 1 : -1; }
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
  const ORDER = { field: -4, palm: -1, pyramid: -2, cave: 0, palace: 0, prison: 0, house: 0, granary: 0, tent: 1, throne: 2, dais: 2, pit: 3, altar: 3, bed: 4, cloth: 5, coffin: 5, bier: 6, chariot: 7 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
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
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
      pale: radial([228, 222, 255], 1), smoke: radial([132, 124, 118], 0.8, 0.55), silver: radial([226, 234, 250], 1),
      dream: radial([196, 188, 255], 1), dust: radial([214, 176, 120], 0.9, 0.5), green: radial([168, 214, 132], 1),
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
    return SP;
  }

  // ════════════════════════════════════════════════════════════
  //  画：火与烟、柔光
  // ════════════════════════════════════════════════════════════
  const COAT = [[184, 58, 50], [226, 172, 60], [66, 104, 168], [84, 140, 82], [146, 80, 146], [228, 206, 150]];
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  const dayA = () => 0.3 + 0.7 * W.daylight;
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
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
    const N = 10, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.075 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.4 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 灯：门口、窗里的暖光（夜里或筵席时）
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  画：迦南的物件
  // ════════════════════════════════════════════════════════════
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, hw = 30 * s, h = 22 * s;
    const k0 = 0.86 + 0.1 * rt(p.seed), k1 = 1 + 0.08 * rt(p.seed + 1), k2 = 0.84 + 0.1 * rt(p.seed + 2), tilt = (rt(p.seed + 3) - 0.5) * 0.06;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k0 * h * 0.86); ctx.lineTo(x - 1.36 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k2 * h * 0.84); ctx.lineTo(x + 1.34 * hw, y);
    ctx.stroke();
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k0], [-0.3, -0.74], [0.02, -k1 - 0.06], [0.32, -0.76], [0.62, -0.86 * k2], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css([54, 44, 40], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([84, 70, 60], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.66, -0.34, 0.34, 0.66]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.74 - Math.abs(f) * 0.06) * h); }
    ctx.stroke();
    const dw = 0.2 * hw, dh = 0.62 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    const lk = clamp(nightK() * 1.05, 0, 1) * 0.8 + p.lit;
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * Math.min(1, lk) * 0.5;
      ctx.fillStyle = 'rgb(255,168,90)';
      ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, y - dh * 0.5, hw * (1.1 + p.lit), p.a * Math.min(1, lk), p.seed);
    }
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const a0 = d > 0 ? 4 : 1, a1 = d > 0 ? 7 : 4;
    for (let i = a0; i <= a1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * tilt) * hw, Y1 = y + q[1] * h; if (i === a0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 麦比拉洞：幔利前的一座石丘，洞口；安葬时微光，随后封上（23:19；49:30；50:13）
  function drawCave(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s, hw = 30 * s, h = 30 * s;
    if (!p.model) {
      const r = U.mulberry32(p.seed + 99), pts = [];
      for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([-1 + 2 * t, -Math.sin(t * Math.PI) * (0.78 + r() * 0.22) - (r() - 0.5) * 0.08]); }
      p.model = { pts };
    }
    const m = p.model;
    ctx.globalAlpha = p.a;
    // 两棵柏树
    ctx.fillStyle = css([40, 58, 40], l);
    ctx.beginPath();
    for (const t of [[-1.25, 1.2], [1.18, 1.45]]) {
      const tx = x + t[0] * hw, ty = gY(l, tx / W.w) + 2 * s, th = t[1] * h;
      ctx.moveTo(tx, ty - th); ctx.quadraticCurveTo(tx + 5 * s, ty - th * 0.45, tx + 2.5 * s, ty); ctx.lineTo(tx - 2.5 * s, ty); ctx.quadraticCurveTo(tx - 5 * s, ty - th * 0.45, tx, ty - th);
    }
    ctx.fill();
    ctx.fillStyle = css([118, 110, 98], l);
    ctx.beginPath();
    m.pts.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([214, 200, 172], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    let pen = false;
    m.pts.forEach(q => { if (q[0] * d < -0.25) { pen = false; return; } const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (pen) ctx.lineTo(X1, Y1); else { ctx.moveTo(X1, Y1); pen = true; } });
    ctx.stroke();
    const mx = x - 0.1 * hw, mw = 0.28 * hw, mh = 0.46 * h;
    ctx.fillStyle = css([16, 12, 10], l);
    ctx.beginPath(); ctx.moveTo(mx - mw, y); ctx.quadraticCurveTo(mx - mw, y - mh * 1.3, mx, y - mh * 1.3); ctx.quadraticCurveTo(mx + mw, y - mh * 1.3, mx + mw, y); ctx.closePath(); ctx.fill();
    if (p.lit > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, mx, y - mh * 0.55, mw * 2.6, p.a * p.lit * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    if (p.seal > 0.01) {
      const sx = mx + mw * 1.9 * (1 - p.seal);
      ctx.fillStyle = css([134, 122, 106], l);
      ctx.beginPath(); ctx.ellipse(sx, y - mh * 0.62, mw * 1.08, mh * 0.66, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 多坍的坑：石圈围着的一个空坑，里头没有水（37:24）；约瑟在里面时，坑里有一点光
  function drawPit(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 5 * s, R = 11 * s, r = 3.4 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([72, 60, 48], l);
    ctx.beginPath(); ctx.ellipse(x, y, R, r, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([10, 9, 9], l);
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.3, R * 0.9, r * 0.72, 0, 0, TAU); ctx.fill();
    // 石圈
    ctx.fillStyle = css([132, 120, 102], l);
    ctx.beginPath();
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * TAU, sx = x + Math.cos(a) * R * 1.08, sy = y + Math.sin(a) * r * 1.28, rr = (2.2 + rt(p.seed + k) * 1.2) * s;
      ctx.moveTo(sx + rr, sy); ctx.ellipse(sx, sy, rr, rr * 0.6, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([220, 206, 180], l, 0.35 * dayA(), 0.2);
    ctx.beginPath();
    for (let k = 8; k < 14; k++) {
      const a = (k / 14) * TAU, sx = x + Math.cos(a) * R * 1.08, sy = y + Math.sin(a) * r * 1.28 - 0.5 * s, rr = (1.2 + rt(p.seed + k) * 0.8) * s;
      ctx.moveTo(sx + rr, sy); ctx.ellipse(sx, sy, rr, rr * 0.45, 0, 0, TAU);
    }
    ctx.fill();
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const br = 0.8 + 0.2 * Math.sin(W.t * 1.4);
      glowSp(ctx, SP.gold, x, y + r * 0.2, R * 1.6, p.a * p.lit * 0.55 * br);
      ctx.fillStyle = U.rgba(255, 236, 196, p.a * p.lit * 0.5 * br);
      ctx.beginPath(); ctx.ellipse(x, y + r * 0.35, R * 0.35, r * 0.28, 0, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 地上的衣裳：约瑟的彩衣（染了血，37:31）/ 丢在妇人手里的衣裳（39:12）
  function drawCloth(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s + (p.v || 0) * 10 * s, w = 8 * s, h = 3 * s;
    ctx.globalAlpha = p.a;
    const shape = () => {
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.85, y - h * 1.2, x - w * 0.2, y - h);
      ctx.quadraticCurveTo(x + w * 0.3, y - h * 1.45, x + w * 0.85, y - h * 0.6); ctx.quadraticCurveTo(x + w * 1.05, y - h * 0.1, x + w, y); ctx.closePath();
    };
    if (p.variant === 'coat') {
      ctx.save(); shape(); ctx.clip();
      for (let i = 0; i < 6; i++) { ctx.fillStyle = css(COAT[i], l); ctx.fillRect(x - w + i * (w / 3) - 0.3, y - h * 1.6, w / 3 + 0.6, h * 1.7); }
      if (p.stain > 0.01) {
        ctx.fillStyle = css([64, 16, 16], l, 0.62 * p.stain);
        ctx.beginPath(); ctx.ellipse(x + w * 0.1, y - h * 0.45, w * 0.62, h * 0.9, 0.2, 0, TAU); ctx.fill();
      }
      ctx.restore();
    } else {
      ctx.fillStyle = css([230, 222, 204], l); shape(); ctx.fill();
    }
    ctx.strokeStyle = css([255, 244, 222], l, 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x - w * 0.85, y - h * 1.0); ctx.quadraticCurveTo(x - w * 0.2, y - h * 1.2, x + w * 0.5, y - h * 1.0); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 别是巴的坛（46:1）
  function drawAltar(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, u = 11 * s;
    if (!p.model) {
      const r = U.mulberry32(p.seed * 131 + 7), st = [];
      [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => { for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.48 + (r() - 0.5) * 0.08, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.27 + r() * 0.06, 0.19 + r() * 0.04, (r() - 0.5) * 0.4]); });
      p.model = { st };
    }
    const m = p.model, n = m.st.length, shown = p.grow * n;
    if (shown <= 0.01) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.beginPath();
    for (let i = 0; i < n && i < shown; i++) {
      const q = m.st[i], k = clamp(shown - i, 0, 1), cx = x + q[0] * u, cy = y + q[1] * u - (1 - k) * 6 * s;
      ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * k, q[4], 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      const top = y - 0.98 * u;
      smoke(ctx, x, top - 6 * s, p.fire * p.a, 130 * s + W.h * 0.1, 7 * s, p.seed);
      flame(ctx, x, top + 1 * s, 12 * s, p.fire * p.a, p.seed);
    }
  }

  // 床（47:31；48:2；49:33）：雅各坐在床上、躺在床上
  function bedTop(p) { const s = LS(p.layer) * p.size; return [p.x * W.w + (p.flip || 1) * 1.5 * s, gY(p.layer, p.x) + 2 * s - 7.6 * s]; }
  function drawBed(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, f = p.flip || 1, hw = 13 * s, top = y - 6.2 * s;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([92, 68, 46], l); ctx.lineWidth = Math.max(0.8, 1.4 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const q of [-0.9, -0.55, 0.55, 0.9]) { ctx.moveTo(x + q * hw, top + 1 * s); ctx.lineTo(x + q * hw, y); }
    ctx.stroke();
    ctx.fillStyle = css([104, 78, 52], l);
    ctx.fillRect(x - hw, top, hw * 2, 1.8 * s);
    ctx.fillStyle = css([222, 208, 182], l);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.98, top); ctx.quadraticCurveTo(x, top - 2.4 * s, x + hw * 0.98, top); ctx.closePath(); ctx.fill();
    // 头枕
    const hx = x - f * hw * 0.92;
    ctx.fillStyle = css([150, 112, 72], l);
    ctx.beginPath(); ctx.moveTo(hx, top); ctx.lineTo(hx - f * 0.6 * s, top - 4.4 * s); ctx.quadraticCurveTo(hx + f * 1.8 * s, top - 5.4 * s, hx + f * 3.2 * s, top - 4 * s); ctx.lineTo(hx + f * 2.4 * s, top); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([250, 236, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.9, top - 0.4 * s); ctx.quadraticCurveTo(x, top - 2.6 * s, x + hw * 0.9, top - 0.4 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 抬尸的架（白布覆盖）：自歌珊抬往迦南（50:7–13）
  function drawBier(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) - 15 * s, len = 30 * s;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([80, 60, 44], l); ctx.lineWidth = Math.max(0.8, 1.3 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - len * 0.62, y + 1.5 * s); ctx.lineTo(x + len * 0.62, y + 1.5 * s); ctx.stroke();
    ctx.fillStyle = css([226, 218, 202], l, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(x - len * 0.5, y); ctx.quadraticCurveTo(x - len * 0.45, y - 5 * s, x - len * 0.15, y - 4.6 * s);
    ctx.quadraticCurveTo(x + len * 0.3, y - 4 * s, x + len * 0.45, y - 5.6 * s); ctx.quadraticCurveTo(x + len * 0.55, y - 2 * s, x + len * 0.5, y); ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y - 2 * s, len * 0.6, p.a * 0.25);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：埃及的物件
  // ════════════════════════════════════════════════════════════
  // 棕树
  function drawPalm(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, g = p.grow;
    if (g < 0.01 || p.a < 0.01) return;
    const H = 50 * s * (0.8 + 0.35 * rt(p.seed)) * g, lean = (rt(p.seed + 1) - 0.5) * 0.4 * (p.flip || 1);
    const sway = W.wind * 1.6 * s + Math.sin(W.t * 0.9 + p.seed) * 0.6 * s;
    const tx = x + lean * H + sway, ty = y - H, cxp = x + lean * H * 0.15, cyp = y - H * 0.5;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([110, 86, 60], l);
    ctx.beginPath();
    ctx.moveTo(x - 2.3 * s, y); ctx.quadraticCurveTo(cxp - 1.7 * s, cyp, tx - 1.2 * s, ty);
    ctx.lineTo(tx + 1.2 * s, ty); ctx.quadraticCurveTo(cxp + 1.7 * s, cyp, x + 2.3 * s, y); ctx.closePath(); ctx.fill();
    if (l === 2) {
      ctx.strokeStyle = css([78, 60, 42], l, 0.8); ctx.lineWidth = Math.max(0.4, 0.55 * s);
      ctx.beginPath();
      for (let i = 1; i < 10; i++) { const t = i / 10, px = qb(x, cxp, tx, t), py = qb(y, cyp, ty, t), w = 2.1 * s * (1 - t * 0.4); ctx.moveTo(px - w, py); ctx.lineTo(px + w, py - 0.9 * s); }
      ctx.stroke();
    }
    // 果（枣）
    ctx.fillStyle = css([176, 104, 48], l);
    ctx.beginPath(); ctx.ellipse(tx + 1.5 * s, ty + 3 * s, 2.2 * s * g, 3 * s * g, 0.3, 0, TAU); ctx.fill();
    // 叶
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    ctx.fillStyle = css([66, 104, 56], l);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const a = (ANG[i] + (rt(p.seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      const L = (19 + 8 * rt(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + p.seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L;
      const mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L;
      const wd = 2.3 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    // 迎光的叶边
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 236, 170], l, 0.35 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const a = (ANG[i] + (rt(p.seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      if (ux * d < -0.2) continue;
      const L = (19 + 8 * rt(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + p.seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      const wd = 2.3 * s, mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, tx + ux * L + sw, ty + (uy * 0.5 + 0.48) * L);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 金字塔：远处中丘上的三座（受日光一面亮、一面暗）
  function drawPyramid(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2.5 * s, a = p.a;
    if (a < 0.01) return;
    const hw = 40 * s, h = hw * 0.92, ax = x + hw * 0.16;
    const sunR = litX() >= x;
    const LIT = [232, 204, 150], SHD = [168, 134, 96];
    ctx.globalAlpha = a;
    ctx.fillStyle = css(sunR ? SHD : LIT, l, 1, sunR ? 0 : 0.08);
    ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(ax, y - h); ctx.lineTo(ax, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(sunR ? LIT : SHD, l, 1, sunR ? 0.08 : 0);
    ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax, y - h); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    // 一层层的石
    ctx.strokeStyle = css([120, 96, 70], l, 0.18);
    ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 1; i < 7; i++) { const k = i / 7, yy = y - h * k; ctx.moveTo(lerp(x - hw, ax, k), yy); ctx.lineTo(lerp(x + hw, ax, k), yy); }
    ctx.stroke();
    // 塔尖的金光
    if (W.daylight > 0.2) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, ax, y - h, 6 * s + 3, a * 0.35 * W.daylight);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 埃及人的房屋：粉白的墙、平顶、檐下彩绘、带柱的廊（波提乏的家 / 约瑟的家）
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const f = p.flip || 1, hw = 25 * s, h = 19 * s * g;
    const WALL = [232, 220, 194], TRIM = [214, 198, 166], DARK = [44, 34, 28];
    ctx.globalAlpha = p.a;
    // 屋顶的风斗
    ctx.fillStyle = css(TRIM, l);
    ctx.fillRect(x + f * hw * 0.35 - 5 * s, y - h - 7 * s * g, 10 * s, 7.5 * s * g);
    ctx.fillStyle = css(WALL, l);
    ctx.fillRect(x - hw, y - h, 2 * hw, h);
    // 背光的一侧
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([150, 136, 112], l, 0.5);
    ctx.fillRect(d > 0 ? x - hw : x + hw - 5 * s, y - h, 5 * s, h);
    // 檐与彩绘的带
    ctx.fillStyle = css(TRIM, l);
    ctx.fillRect(x - hw - 1.4 * s, y - h - 2.4 * s, 2 * hw + 2.8 * s, 2.8 * s);
    const n = Math.max(4, Math.round(hw / (2.6 * s)));
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = css(i % 2 ? LAPIS : [176, 72, 52], l, 0.85);
      ctx.fillRect(x - hw + (i + 0.2) * (2 * hw / n), y - h + 0.6 * s, (2 * hw / n) * 0.6, 1.4 * s);
    }
    // 廊：暗的里面，四根莲花柱
    const px0 = f > 0 ? x - hw * 0.88 : x + hw * 0.08, px1 = f > 0 ? x - hw * 0.08 : x + hw * 0.88, py0 = y - h * 0.78;
    ctx.fillStyle = css([96, 80, 64], l);
    ctx.fillRect(px0, py0, px1 - px0, y - py0);
    ctx.fillStyle = css(WALL, l, 1, 0.05);
    for (let i = 0; i < 4; i++) {
      const cx = lerp(px0 + 2.2 * s, px1 - 2.2 * s, i / 3);
      ctx.fillRect(cx - 1.1 * s, py0 + 1.6 * s, 2.2 * s, y - py0 - 1.6 * s);
      ctx.beginPath(); ctx.moveTo(cx - 2.2 * s, py0); ctx.lineTo(cx + 2.2 * s, py0); ctx.lineTo(cx + 1.1 * s, py0 + 2 * s); ctx.lineTo(cx - 1.1 * s, py0 + 2 * s); ctx.closePath(); ctx.fill();
    }
    // 门与高窗
    const dx = x + f * hw * 0.5;
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(dx - 3 * s, y - h * 0.62, 6 * s, h * 0.62);
    for (const q of [0.28, 0.72]) ctx.fillRect(x + f * hw * q - 1.2 * s, y - h * 0.9, 2.4 * s, 1.8 * s);
    // 灯：夜里、筵席时
    const lk = Math.max(nightK() * 0.8, p.lit);
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 176, 96, p.a * Math.min(1, lk) * 0.55);
      ctx.fillRect(dx - 3 * s, y - h * 0.62, 6 * s, h * 0.62);
      ctx.fillRect(px0, py0, px1 - px0, y - py0);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, (px0 + px1) / 2, y - h * 0.4, hw * (0.9 + p.lit * 0.9), p.a * Math.min(1, lk), p.seed);
      lamp(ctx, dx, y - h * 0.3, hw * 0.6, p.a * Math.min(1, lk), p.seed + 3);
    }
    ctx.globalAlpha = p.a * 0.55;
    ctx.strokeStyle = css([255, 244, 222], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - hw - 1.4 * s, y - h - 2.4 * s); ctx.lineTo(x + hw + 1.4 * s, y - h - 2.4 * s);
    ctx.moveTo(x + d * hw, y - h); ctx.lineTo(x + d * hw, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 法老的宫：塔门（两座梯形的塔、门楣、旗杆与旗）与其后的柱厅
  function drawPalace(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const STONE = [230, 210, 168], SHD = [178, 154, 116], DARK = [40, 32, 26];
    ctx.globalAlpha = p.a;
    const d = litX() >= x ? 1 : -1;
    // 柱厅
    const hx0 = x + 6 * s, hx1 = x + 44 * s, hh = 17 * s * g;
    ctx.fillStyle = css(STONE, l);
    ctx.fillRect(hx0, y - hh, hx1 - hx0, hh);
    ctx.fillStyle = css([92, 76, 60], l);
    ctx.fillRect(hx0 + 3 * s, y - hh + 3 * s, hx1 - hx0 - 6 * s, hh - 3 * s);
    ctx.fillStyle = css(STONE, l, 1, 0.04);
    for (let i = 0; i < 7; i++) {
      const cx = lerp(hx0 + 5 * s, hx1 - 4 * s, i / 6);
      ctx.fillRect(cx - 1.4 * s, y - hh + 3 * s, 2.8 * s, hh - 3 * s);
      ctx.beginPath(); ctx.moveTo(cx - 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 1.4 * s, y - hh + 5.4 * s); ctx.lineTo(cx - 1.4 * s, y - hh + 5.4 * s); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([218, 198, 158], l);
    ctx.fillRect(hx0 - 1 * s, y - hh - 2.2 * s, hx1 - hx0 + 2 * s, 2.6 * s);
    // 塔门
    const TH = 34 * s * g, gw = 4 * s;
    const tower = (cx, sgn) => {
      const bw = 10 * s, tw = 7.6 * s;
      ctx.beginPath(); ctx.moveTo(cx - bw, y); ctx.lineTo(cx - tw, y - TH); ctx.lineTo(cx + tw, y - TH); ctx.lineTo(cx + bw, y); ctx.closePath(); ctx.fill();
      return [cx, bw, tw];
    };
    // 旗杆（在塔之前）
    const flags = [[x - 13 * s, [176, 60, 48]], [x + 13 * s, LAPIS]];
    ctx.fillStyle = css(STONE, l);
    const tl = tower(x - 12 * s), tr = tower(x + 12 * s);
    ctx.fillStyle = css(SHD, l, 0.55);
    ctx.fillRect(d > 0 ? tl[0] - tl[2] : tl[0] + tl[2] - 3 * s, y - TH, 3 * s, TH);
    ctx.fillRect(d > 0 ? tr[0] - tr[2] : tr[0] + tr[2] - 3 * s, y - TH, 3 * s, TH);
    // 门
    ctx.fillStyle = css([222, 202, 160], l);
    ctx.fillRect(x - gw - 2 * s, y - TH * 0.66, (gw + 2 * s) * 2, 3 * s);
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(x - gw, y - TH * 0.6, gw * 2, TH * 0.6);
    // 塔上的浮雕与檐
    ctx.fillStyle = css([236, 220, 180], l);
    ctx.fillRect(tl[0] - tl[2] - 0.8 * s, y - TH - 1.8 * s, tl[2] * 2 + 1.6 * s, 2.2 * s);
    ctx.fillRect(tr[0] - tr[2] - 0.8 * s, y - TH - 1.8 * s, tr[2] * 2 + 1.6 * s, 2.2 * s);
    ctx.strokeStyle = css([150, 124, 90], l, 0.4); ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) for (let i = 1; i <= 3; i++) { const yy = y - TH * (0.25 + 0.2 * i), w = lerp(t[1], t[2], 0.25 + 0.2 * i) * 0.7; ctx.moveTo(t[0] - w, yy); ctx.lineTo(t[0] + w, yy); }
    ctx.stroke();
    // 旗杆与旗
    ctx.strokeStyle = css([120, 96, 66], l); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (const fl of flags) { ctx.moveTo(fl[0], y); ctx.lineTo(fl[0], y - TH - 12 * s * g); }
    ctx.stroke();
    for (let i = 0; i < flags.length; i++) {
      const fx0 = flags[i][0], fy = y - TH - 12 * s * g + 0.5 * s, wv = Math.sin(W.t * 2.2 + i * 1.7) * 1.4 * s, dir = W.wind >= 0 ? 1 : -1;
      ctx.fillStyle = css(flags[i][1], l, 1, 0.05);
      ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.quadraticCurveTo(fx0 + dir * 4 * s, fy + wv, fx0 + dir * 8 * s, fy + 1.2 * s + wv * 0.6);
      ctx.lineTo(fx0 + dir * 7 * s, fy + 3.2 * s + wv * 0.4); ctx.quadraticCurveTo(fx0 + dir * 3.6 * s, fy + 3.4 * s + wv, fx0, fy + 3.4 * s); ctx.closePath(); ctx.fill();
    }
    // 灯
    const lk = Math.max(nightK() * 0.85, p.lit);
    if (lk > 0.02) {
      lamp(ctx, x, y - TH * 0.3, 16 * s * (1 + p.lit), p.a * Math.min(1, lk), p.seed);
      lamp(ctx, (hx0 + hx1) / 2, y - hh * 0.5, 22 * s * (0.8 + p.lit), p.a * Math.min(1, lk) * 0.8, p.seed + 2);
    }
    ctx.globalAlpha = p.a * 0.55;
    ctx.strokeStyle = css([255, 244, 222], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) { ctx.moveTo(t[0] + d * t[1], y); ctx.lineTo(t[0] + d * t[2], y - TH); }
    ctx.moveTo(hx0, y - hh - 2.2 * s); ctx.lineTo(hx1, y - hh - 2.2 * s);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 宝座：金色的椅子与华盖（法老坐在其上）
  function drawThrone(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, f = p.flip || 1;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([150, 118, 66], l); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - 9 * s, y); ctx.lineTo(x - 9 * s, y - 30 * s); ctx.moveTo(x + 9 * s, y); ctx.lineTo(x + 9 * s, y - 30 * s); ctx.stroke();
    ctx.fillStyle = css([236, 228, 206], l);
    ctx.beginPath(); ctx.moveTo(x - 11 * s, y - 30 * s); ctx.lineTo(x + 11 * s, y - 30 * s); ctx.lineTo(x + 10 * s, y - 27 * s); ctx.lineTo(x - 10 * s, y - 27 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(GOLD, l, 1, 0.08);
    ctx.fillRect(x - 5 * s, y - 9.6 * s, 10 * s, 2 * s);
    ctx.fillRect(x - f * 5 * s - (f > 0 ? 1.8 * s : 0), y - 19 * s, 1.8 * s, 11 * s);
    ctx.fillRect(x - 4.4 * s, y - 8 * s, 1.4 * s, 8 * s);
    ctx.fillRect(x + 3 * s, y - 8 * s, 1.4 * s, 8 * s);
    ctx.globalAlpha = 1;
  }

  // 监：矮而厚的石屋，一道重门、一扇有栅的高窗；约瑟在里面时，窗与门缝里透出光（39:21）
  function drawPrison(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, hw = 21 * s, h = 17 * s * p.grow;
    if (h < 0.5) return;
    const STONE = [150, 136, 116];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(STONE, l);
    ctx.fillRect(x - hw, y - h, 2 * hw, h);
    ctx.fillRect(x - hw - 1 * s, y - h - 2 * s, 2 * hw + 2 * s, 2.6 * s);
    // 石块
    ctx.strokeStyle = css([96, 86, 74], l, 0.5); ctx.lineWidth = Math.max(0.4, 0.55 * s);
    ctx.beginPath();
    for (let r = 1; r < 5; r++) {
      const yy = y - h + r * h / 5; ctx.moveTo(x - hw, yy); ctx.lineTo(x + hw, yy);
      for (let c = 0; c < 6; c++) { const xx = x - hw + ((c + (r % 2) * 0.5) / 6) * 2 * hw; ctx.moveTo(xx, yy); ctx.lineTo(xx, yy - h / 5); }
    }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([90, 80, 68], l, 0.45);
    ctx.fillRect(d > 0 ? x - hw : x + hw - 5 * s, y - h, 5 * s, h);
    // 门
    const dx = x + hw * 0.35, dw = 4.4 * s, dh = h * 0.66;
    ctx.fillStyle = css([12, 10, 9], l);
    ctx.fillRect(dx - dw, y - dh, dw * 2, dh);
    const op = p.open;
    ctx.fillStyle = css([88, 64, 44], l);
    ctx.fillRect(dx - dw + op * dw * 1.5, y - dh, dw * 2 * (1 - op * 0.75), dh);
    ctx.strokeStyle = css([56, 44, 34], l); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); for (const q of [0.25, 0.6]) { ctx.moveTo(dx - dw + op * dw * 1.5, y - dh * q); ctx.lineTo(dx + dw, y - dh * q); } ctx.stroke();
    // 高窗与栅
    const wx = x - hw * 0.45, wy = y - h * 0.72, ww = 3.4 * s, wh = 2.6 * s;
    ctx.fillStyle = css([10, 9, 9], l);
    ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
    // 里面的光
    const lk = p.lit;
    if (lk > 0.01) {
      SP || sprites();
      const br = 0.85 + 0.15 * Math.sin(W.t * 1.1 + p.seed);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 226, 160, p.a * lk * 0.85 * br);
      ctx.fillRect(wx - ww, wy - wh, ww * 2, wh * 2);
      if (op > 0.05) ctx.fillRect(dx - dw, y - dh, dw * 1.5 * op, dh);
      else ctx.fillRect(dx - dw, y - 0.9 * s, dw * 2, 0.9 * s);
      glowSp(ctx, SP.gold, wx, wy, 30 * s, p.a * lk * 0.5 * br);
      glowSp(ctx, SP.warm, dx, y - 2 * s, 26 * s, p.a * lk * 0.3 * br);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    ctx.strokeStyle = css([40, 34, 30], l); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); for (let i = -1; i <= 1; i++) { ctx.moveTo(wx + i * ww * 0.55, wy - wh); ctx.lineTo(wx + i * ww * 0.55, wy + wh); } ctx.stroke();
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([240, 226, 200], l, 1, 0.2); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - hw - 1 * s, y - h - 2 * s); ctx.lineTo(x + hw + 1 * s, y - h - 2 * s); ctx.moveTo(x + d * hw, y - h); ctx.lineTo(x + d * hw, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 仓城：一簇泥砖的圆顶仓（41:48），建起、装满；门开时（41:56）粮的金光
  const GRANS = [[-26, 8.5, 1.0], [-11, 10.5, 1.18], [5, 9.2, 1.06], [19, 11, 1.22], [33, 8, 0.94]];
  function drawGranary(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const MUD = [190, 150, 104];
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    for (let i = 0; i < GRANS.length; i++) {
      const q = GRANS[i], cx = x + q[0] * s, r = q[1] * s, hh = (7 + q[2] * 7) * s * clamp(g * 1.4 - i * 0.08, 0, 1);
      if (hh < 0.3) continue;
      const cy = y - hh;
      ctx.fillStyle = css(MUD, l);
      ctx.beginPath(); ctx.moveTo(cx - r, y); ctx.lineTo(cx - r, cy); ctx.ellipse(cx, cy, r, r * 1.05 * clamp(g * 1.2, 0, 1), 0, Math.PI, TAU); ctx.lineTo(cx + r, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([140, 106, 72], l, 0.5);
      ctx.beginPath(); ctx.moveTo(cx + d * -r, y); ctx.lineTo(cx + d * -r, cy); ctx.quadraticCurveTo(cx + d * -r, cy - r * 0.9, cx + d * -r * 0.3, cy - r * 1.02); ctx.quadraticCurveTo(cx + d * -r * 0.62, cy - r * 0.2, cx + d * -r * 0.55, y); ctx.closePath(); ctx.fill();
      // 顶上的口、腰间的小门
      ctx.fillStyle = css([40, 30, 24], l);
      ctx.fillRect(cx - 1.4 * s, cy - r * 1.02 * clamp(g * 1.2, 0, 1) + 0.6 * s, 2.8 * s, 1.6 * s);
      ctx.fillRect(cx - 1.8 * s, y - 5.2 * s, 3.6 * s, 5.2 * s);
      ctx.strokeStyle = css([255, 236, 200], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 1.05 * clamp(g * 1.2, 0, 1), 0, d > 0 ? -Math.PI * 0.5 : Math.PI, d > 0 ? 0 : -Math.PI * 0.5); ctx.stroke();
      // 粮：门口与顶口的金光
      if (p.fill > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        const k = p.fill * (0.45 + 0.55 * p.open);
        ctx.fillStyle = U.rgba(255, 214, 120, p.a * Math.min(1, k) * 0.7);
        ctx.fillRect(cx - 1.4 * s, cy - r * 1.02 * clamp(g * 1.2, 0, 1) + 0.6 * s, 2.8 * s, 1.6 * s);
        if (p.open > 0.02) ctx.fillRect(cx - 1.8 * s, y - 5.2 * s, 3.6 * s, 5.2 * s);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.a;
      }
    }
    // 粮堆
    if (p.fill > 0.02) {
      ctx.fillStyle = css([226, 184, 96], l, 1, 0.1);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const cx = x + (-18 + i * 20) * s, r = (4 + 3 * rt(p.seed + i)) * s * p.fill;
        ctx.moveTo(cx - r * 1.4, y + 1 * s); ctx.quadraticCurveTo(cx, y - r * 1.3, cx + r * 1.4, y + 1 * s); ctx.closePath();
      }
      ctx.fill();
    }
    // 围墙
    ctx.fillStyle = css([176, 138, 96], l);
    ctx.fillRect(x - 36 * s, y - 3.4 * s * g, 80 * s, 3.4 * s * g);
    ctx.strokeStyle = css([255, 236, 200], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - 36 * s, y - 3.4 * s * g); ctx.lineTo(x + 44 * s, y - 3.4 * s * g); ctx.stroke();
    if (p.fill > 0.3 && p.open > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y - 10 * s, 50 * s, p.a * p.open * 0.35 * p.fill);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 田：尼罗河边的禾稼——长出、金黄（丰年）、枯干（荒年）
  function drawField(ctx, p) {
    const g = p.grow * p.a;
    if (g < 0.01) return;
    if (!p.model) { const r = U.mulberry32(p.seed + 5), tuft = []; for (let i = 0; i < 150; i++) tuft.push([r(), r(), r()]); p.model = { tuft }; }
    const s = LS(2), cx = p.x * W.w, top = gY(2, p.x) + 5 * s, bot = top + (W.h - top) * 0.6;
    const hwT = 0.045 * W.w * p.size, hwB = 0.075 * W.w * p.size;
    ctx.globalAlpha = g * 0.36;
    ctx.fillStyle = css(U.mixRGB([92, 70, 46], [150, 120, 80], p.dry), 2);
    ctx.beginPath();
    ctx.moveTo(cx - hwT, top); ctx.quadraticCurveTo(cx, top - 2 * s, cx + hwT, top);
    ctx.lineTo(cx + hwB, bot); ctx.quadraticCurveTo(cx, bot + 8 * s, cx - hwB, bot);
    ctx.closePath(); ctx.fill();
    const tuft = p.model.tuft, ROWS = 12, dry = p.dry, gold = p.gold * (1 - dry), stepQ = (W.quality || 1) < 0.75 ? 2 : 1;
    const hgt = p.grow * (0.45 + 0.55 * Math.max(gold, 0.5)) * (1 - 0.55 * dry);
    const sway = W.wind * 2.2 * s * (1 - 0.6 * dry);
    const lit = 0.04 + 0.14 * gold;
    for (let pass = 0; pass < 2; pass++) {
      let col = pass ? U.mixRGB([104, 142, 70], [238, 198, 104], gold) : U.mixRGB([70, 104, 52], [198, 150, 70], gold);
      col = U.mixRGB(col, pass ? [168, 138, 90] : [130, 104, 70], dry);
      ctx.strokeStyle = css(col, 2, 1, lit);
      ctx.lineWidth = Math.max(0.6, 0.85 * s);
      ctx.globalAlpha = g * 0.95;
      ctx.beginPath();
      for (let i = pass; i < tuft.length; i += 2 * stepQ) {
        const q = tuft[i];
        if (dry > 0.3 && q[2] < dry * 0.6) continue;
        const f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        if (Math.abs(u) > 0.88 && q[2] < 0.6) continue;
        const y = lerp(top, bot, Math.pow(f, 1.3)) + (q[2] - 0.5) * 2 * s, x = cx + u * lerp(hwT, hwB, f);
        const th = lerp(4, 12, f) * s * hgt * (0.7 + 0.5 * q[2]);
        const sw = sway * (0.3 + f) + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.6 * s + dry * (q[2] - 0.5) * 5 * s;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - th * 0.6, x + sw, y - th);
      }
      ctx.stroke();
    }
    if (gold > 0.15) {
      ctx.fillStyle = css([246, 214, 130], 2, 1, 0.12);
      ctx.globalAlpha = g * smoothstep(0.15, 0.8, gold);
      ctx.beginPath();
      for (let i = 0; i < tuft.length; i += 2 * stepQ) {
        const q = tuft[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        if (Math.abs(u) > 0.88 && q[2] < 0.6) continue;
        const y = lerp(top, bot, Math.pow(f, 1.3)) + (q[2] - 0.5) * 2 * s, x = cx + u * lerp(hwT, hwB, f);
        const th = lerp(4, 12, f) * s * hgt * (0.7 + 0.5 * q[2]);
        const sw = sway * (0.3 + f) + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.6 * s, r = lerp(0.7, 1.4, f) * s;
        ctx.rect(x + sw - r * 0.6, y - th - r * 2.4, r * 1.2, r * 2.8);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 约瑟的座：两级的台，上有布篷（42:6 粜粮给那地众民的就是他）
  function daisTop(p) { const s = LS(p.layer) * p.size; return [p.x * W.w, gY(p.layer, p.x) + 3 * s - 6.4 * s]; }
  function drawDais(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([214, 196, 158], l);
    ctx.fillRect(x - 14 * s, y - 3.2 * s, 28 * s, 3.2 * s);
    ctx.fillStyle = css([226, 210, 174], l);
    ctx.fillRect(x - 9 * s, y - 6.4 * s, 18 * s, 3.2 * s);
    ctx.strokeStyle = css([128, 98, 64], l); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - 8 * s, y - 6.4 * s); ctx.lineTo(x - 8 * s, y - 36 * s); ctx.moveTo(x + 8 * s, y - 6.4 * s); ctx.lineTo(x + 8 * s, y - 36 * s); ctx.stroke();
    ctx.fillStyle = css([236, 226, 204], l);
    ctx.beginPath(); ctx.moveTo(x - 11 * s, y - 36 * s); ctx.lineTo(x + 11 * s, y - 36 * s); ctx.lineTo(x + 10 * s, y - 32.5 * s); ctx.lineTo(x - 10 * s, y - 32.5 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(LAPIS, l, 0.9);
    ctx.fillRect(x - 10 * s, y - 33.2 * s, 20 * s, 0.9 * s);
    ctx.strokeStyle = css([255, 244, 222], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - 14 * s, y - 3.2 * s); ctx.lineTo(x + 14 * s, y - 3.2 * s); ctx.moveTo(x - 9 * s, y - 6.4 * s); ctx.lineTo(x + 9 * s, y - 6.4 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 棺材（50:26）：停在埃及。头朝迦南（右）；约瑟的一点光仍在其中——等候「神必定看顾你们」
  function drawCoffin(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2.5 * s, L = 30 * s;
    ctx.globalAlpha = p.a;
    // 低矮的架
    ctx.strokeStyle = css([74, 54, 38], l); ctx.lineWidth = Math.max(0.8, 1.2 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - L * 0.5, y - 3.2 * s); ctx.lineTo(x + L * 0.5, y - 3.2 * s);
    for (const q of [-0.42, 0.42]) { ctx.moveTo(x + q * L, y - 3.2 * s); ctx.lineTo(x + q * L, y); }
    ctx.stroke();
    // 人形的棺：脚在左，头在右（向着迦南）
    const b = y - 4 * s;
    const pts = [[-0.5, 0], [-0.52, -3.2], [-0.4, -4.4], [-0.1, -4.0], [0.16, -4.8], [0.3, -5.2], [0.38, -6.6], [0.48, -6.8], [0.54, -5.2], [0.53, 0]];
    ctx.fillStyle = css([96, 66, 42], l);
    ctx.beginPath();
    pts.forEach((q, i) => { const X1 = x + q[0] * L, Y1 = b + q[1] * s; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    // 金带与头部
    ctx.fillStyle = css(GOLD, l, 1, 0.12);
    ctx.beginPath(); ctx.ellipse(x + 0.44 * L, b - 3.8 * s, 0.1 * L, 3 * s, 0, 0, TAU); ctx.fill();
    for (const q of [-0.3, -0.1, 0.1]) ctx.fillRect(x + q * L - 0.5 * s, b - 4.4 * s, 1.1 * s, 4.4 * s);
    ctx.fillStyle = css(LAPIS, l, 0.9);
    ctx.fillRect(x + 0.24 * L, b - 4.8 * s, 0.07 * L, 4.8 * s);
    ctx.strokeStyle = css([255, 236, 190], l, 0.45 * dayA() + 0.2 * p.lit, 0.3); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); pts.slice(1, 9).forEach((q, i) => { const X1 = x + q[0] * L, Y1 = b + q[1] * s; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }); ctx.stroke();
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const br = 0.8 + 0.2 * Math.sin(W.t * 0.9);
      const breath = 0.8 + 0.2 * Math.sin(W.t * 0.55);
      glowSp(ctx, SP.warm, x + 0.1 * L, b - 4 * s, L * 2.1, p.a * p.lit * 0.22 * breath * (0.3 + 0.7 * nightK()));
      glowSp(ctx, SP.gold, x + 0.1 * L, b - 3 * s, L * 1.35, p.a * p.lit * 0.42 * br * (0.45 + 0.55 * nightK()));
      ctx.fillStyle = U.rgba(255, 220, 160, p.a * p.lit * 0.1 * br * (0.4 + 0.6 * nightK()));
      ctx.beginPath(); ctx.ellipse(x, y + 1 * s, L * 0.95, 4.5 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = U.rgba(255, 238, 200, p.a * p.lit * 0.75 * br);
      ctx.beginPath(); ctx.arc(x + 0.12 * L, b - 4.6 * s, Math.max(0.8, 1.1 * s), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 车（41:43 副车；46:29 约瑟套车往歌珊去）：两轮的车，一匹白马；在"空中层"画，车厢挡住站在车上的人的腿
  function chariotFloor(p) { const s = LS(p.layer) * p.size; return [p.x * W.w - (p.fd || 1) * 1 * s, gY(p.layer, p.x) + 2 * s - 6.5 * s]; }
  function drawChariot(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, d = p.fd || 1;
    const moving = p.tx != null;
    ctx.globalAlpha = p.a;
    const HORSE = [222, 214, 200], HD = [150, 140, 128];
    // 马
    const hx = x + d * 24 * s, hy = y - 13 * s, ph = p.ph;
    const gait = moving ? 1 : 0;
    ctx.strokeStyle = css(HD, l); ctx.lineWidth = Math.max(0.8, 1.6 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    const legs = [[-6.5, 0], [-5, Math.PI], [5.5, Math.PI * 0.5], [7, Math.PI * 1.5]];
    for (const [ox, o] of legs) {
      const sw = Math.sin(ph + o) * 3.2 * s * gait, lift = Math.max(0, Math.cos(ph + o)) * 2 * s * gait;
      const kx = hx + d * (ox * s + sw * 0.5), ky = hy + 6.5 * s - lift * 0.5;
      ctx.moveTo(hx + d * ox * s, hy + 1 * s); ctx.lineTo(kx, ky); ctx.lineTo(hx + d * (ox * s + sw), y - lift);
    }
    ctx.stroke();
    ctx.fillStyle = css(HORSE, l);
    ctx.beginPath(); ctx.ellipse(hx, hy, 9.5 * s, 4.4 * s, 0, 0, TAU); ctx.fill();
    const bob = Math.sin(ph * 2) * 0.6 * s * gait;
    ctx.beginPath();
    ctx.moveTo(hx + d * 5 * s, hy - 2.5 * s); ctx.quadraticCurveTo(hx + d * 9 * s, hy - 9 * s + bob, hx + d * 12.5 * s, hy - 12 * s + bob);
    ctx.lineTo(hx + d * 15.5 * s, hy - 8.4 * s + bob); ctx.lineTo(hx + d * 13.4 * s, hy - 7.6 * s + bob);
    ctx.quadraticCurveTo(hx + d * 10 * s, hy - 5 * s, hx + d * 8.5 * s, hy + 1.5 * s); ctx.closePath(); ctx.fill();
    // 鬃、尾、羽饰
    ctx.strokeStyle = css([120, 110, 100], l); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    ctx.moveTo(hx + d * 5.5 * s, hy - 3.5 * s); ctx.quadraticCurveTo(hx + d * 8.5 * s, hy - 9.5 * s + bob, hx + d * 11.5 * s, hy - 12.5 * s + bob);
    ctx.moveTo(hx - d * 9 * s, hy - 1 * s); ctx.quadraticCurveTo(hx - d * 12.5 * s, hy + 2 * s, hx - d * 12 * s + Math.sin(W.t * 3) * s, hy + 7 * s);
    ctx.stroke();
    ctx.strokeStyle = css([196, 70, 56], l); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(hx + d * 12.5 * s, hy - 12 * s + bob); ctx.lineTo(hx + d * 12 * s, hy - 16 * s + bob); ctx.stroke();
    // 辕
    ctx.strokeStyle = css([150, 118, 70], l); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 4 * s, y - 5.5 * s); ctx.quadraticCurveTo(x + d * 12 * s, y - 8 * s, hx - d * 3 * s, hy - 2 * s); ctx.stroke();
    // 轮
    const r = 5.6 * s, wx = x - d * 1 * s, wy = y - r;
    ctx.strokeStyle = css([120, 90, 52], l); ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath(); ctx.arc(wx, wy, r, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const a = -ph * 0.6 * d + (i / 3) * Math.PI; ctx.moveTo(wx - Math.cos(a) * r, wy - Math.sin(a) * r); ctx.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); }
    ctx.stroke();
    // 车厢（金）
    ctx.fillStyle = css([222, 184, 104], l, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(x - d * 4 * s, y - 6.5 * s); ctx.lineTo(x + d * 5 * s, y - 6.5 * s); ctx.quadraticCurveTo(x + d * 6.5 * s, y - 12 * s, x + d * 3 * s, y - 16 * s);
    ctx.lineTo(x + d * 1.6 * s, y - 15.4 * s); ctx.quadraticCurveTo(x + d * 3.4 * s, y - 11.6 * s, x - d * 1.6 * s, y - 11 * s); ctx.lineTo(x - d * 4 * s, y - 11 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(LAPIS, l, 0.9);
    ctx.fillRect(Math.min(x - d * 4 * s, x + d * 4.6 * s), y - 8.6 * s, 8.6 * s, 1 * s);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：埃及的地、尼罗河、歌珊、应许之路、天上的尘与十二星
  // ════════════════════════════════════════════════════════════
  const SAND = [[208, 180, 138], [216, 182, 130], [224, 188, 128]];
  const XB = [0.7, 0.74, 0.78];              // 沙地的边界（远 / 中 / 近）
  function landPath(ctx, l, x0f, x1f, N) {
    const bot = l === 2 ? W.h + 6 : W.waterlineY(l);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const xf = lerp(x0f, x1f, i / N), y = Math.min(gY(l, xf), bot);
      if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y);
    }
    ctx.lineTo(x1f * W.w, bot); ctx.lineTo(x0f * W.w, bot); ctx.closePath();
  }
  function drawDesert(ctx, l) {
    const e = W.lv.jsEgypt, fam = W.lv.jsFamine;
    if (e < 0.01 && fam < 0.01) return;
    const xb = XB[l], dep = DEP(l);
    const Ae = Math.max(0.84 * e, 0.62 * fam), Af = 0.34 * fam;
    const c = W.shade(U.mixRGB(SAND[l], [188, 160, 118], fam * 0.35), dep, 0.06);
    const col = a => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    g.addColorStop(0, col(Ae)); g.addColorStop(clamp(xb - 0.03, 0, 1), col(Ae));
    g.addColorStop(clamp(xb + 0.03, 0, 1), col(Math.max(Af, Ae * 0.55)));
    g.addColorStop(clamp(xb + 0.075, 0, 1), col(Math.max(Af, Ae * 0.18)));
    g.addColorStop(clamp(xb + 0.11, 0, 1), col(Af)); g.addColorStop(1, col(Af));
    ctx.fillStyle = g;
    landPath(ctx, l, 0.25, 1.0, l === 2 ? 56 : 40);
    ctx.fill();
    // 沙地的亮边与风纹（近地）
    if (e > 0.01) {
      const x1 = xb + 0.02;
      const hi = W.shade([252, 226, 178], dep, 0.2);
      ctx.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.5 * e * dayA());
      ctx.lineWidth = Math.max(0.6, 1.1 * LS(l));
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) { const xf = lerp(0.3, x1, i / 30), y = gY(l, xf); if (i) ctx.lineTo(xf * W.w, y + 0.8); else ctx.moveTo(xf * W.w, y + 0.8); }
      ctx.stroke();
      if (l === 2) {
        const dk = W.shade([170, 136, 92], 0, 0);
        ctx.strokeStyle = U.rgba(dk[0], dk[1], dk[2], 0.2 * e);
        ctx.lineWidth = Math.max(0.6, 1.4 * LS(2));
        ctx.beginPath();
        for (let k = 0; k < 7; k++) {
          const v = 0.14 + k * 0.12, ph = rt(k * 11) * 6;
          for (let i = 0; i <= 22; i++) {
            const xf = lerp(0.34 + k * 0.012, x1 - 0.03, i / 22), y = fieldY(xf, v) + Math.sin(xf * 34 + ph) * 3 * LS(2);
            if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y);
          }
        }
        ctx.stroke();
      }
    }
  }
  // 歌珊：一片草场（在沙地之上）
  function drawGoshen(ctx) {
    const k = W.lv.jsGoshen * (1 - 0.7 * W.lv.jsFamine);
    if (k < 0.01) return;
    const c = W.shade([104, 142, 72], 0, 0.02);
    const col = a => U.rgba(c[0], c[1], c[2], a);
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    const a = X.goshen0, b = X.goshen1;
    g.addColorStop(clamp(a - 0.03, 0, 1), col(0)); g.addColorStop(a + 0.015, col(0.6 * k));
    g.addColorStop(b - 0.02, col(0.6 * k)); g.addColorStop(clamp(b + 0.03, 0, 1), col(0));
    ctx.fillStyle = g;
    landPath(ctx, 2, a - 0.03, b + 0.03, 24);
    ctx.fill();
    const s = LS(2), bl = W.shade([150, 190, 100], 0, 0.1);
    ctx.strokeStyle = U.rgba(bl[0], bl[1], bl[2], 0.55 * k);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const nT = (W.quality || 1) < 0.75 ? 24 : 44;
    for (let i = 0; i < nT; i++) {
      const xf = lerp(a, b, rt(i * 3 + 400)), v = rt(i * 3 + 401) * 0.8, y = fieldY(xf, v), h = (2 + 3 * rt(i * 3 + 402)) * s * (0.6 + v);
      const sw = W.wind * 1.2 * s + Math.sin(W.t * 1.6 + i) * 0.5 * s;
      ctx.moveTo(xf * W.w, y); ctx.lineTo(xf * W.w + sw, y - h);
    }
    ctx.stroke();
  }
  // 尼罗河：自远处的地的轮廓流向观者（左），两岸泥滩与芦荻；饥荒时水落
  function nilePt(t) {
    const x0 = X.nileT * W.w, y0 = gY(2, X.nileT) + 0.5, x3 = X.nileB * W.w, y3 = W.h + 8;
    const x1 = 0.468 * W.w, y1 = lerp(y0, y3, 0.38), x2 = 0.514 * W.w, y2 = lerp(y0, y3, 0.72), u = 1 - t;
    const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2), L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const nileW = (t, k) => (0.006 + 0.07 * Math.pow(t, 1.4)) * W.w * k;
  function drawNile(ctx) {
    const k = W.lv.jsNile;
    if (k < 0.01) return;
    const N = 26, fam = W.lv.jsFamine;
    const wk = (0.25 + 0.75 * k) * (1 - 0.3 * fam);
    const edge = (mul, add) => {
      const Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) { const t = i / N, p = nilePt(t), w = nileW(t, wk) * mul / 2 + add * (0.3 + t); Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      ctx.beginPath();
      Lp.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      for (let i = Rp.length - 1; i >= 0; i--) ctx.lineTo(Rp[i][0], Rp[i][1]);
      ctx.closePath();
    };
    const s = LS(2);
    ctx.globalAlpha = Math.min(1, k * 1.4);
    // 湿沙与泥滩
    ctx.globalAlpha = Math.min(1, k * 1.4) * 0.35;
    ctx.fillStyle = css(U.mixRGB([150, 124, 86], [190, 160, 116], fam), 2);
    edge(1.7, 6 * s * (1 + fam));
    ctx.fill();
    ctx.globalAlpha = Math.min(1, k * 1.4);
    ctx.fillStyle = css(U.mixRGB([116, 96, 66], [150, 126, 90], fam), 2);
    edge(1.28, 2.5 * s * (1 + fam * 2));
    ctx.fill();
    // 水
    const y0 = gY(2, X.nileT), y2 = W.h;
    const top = W.shade(U.mixRGB([150, 186, 196], [170, 170, 150], fam), 0.45, 0.05), bot = W.shade(U.mixRGB([44, 100, 122], [96, 100, 80], fam * 0.6), 0, 0.02);
    const gr = ctx.createLinearGradient(0, y0, 0, y2);
    gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
    ctx.fillStyle = gr;
    edge(1, 0);
    ctx.fill();
    // 天光的倒影（夜里是月光）
    ctx.globalCompositeOperation = 'lighter';
    const night = W.night > 0.5;
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = (night ? 0.35 * W.lv.moon : 0.45 * W.daylight) * k;
    if (ga > 0.01) {
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let i = 0; i < 26; i++) {
        const t = U.fract(rt(i * 5 + 700) + W.t * 0.018 * (0.7 + 0.6 * rt(i * 5 + 701)));
        const p = nilePt(t), w = nileW(t, wk) / 2, off = (rt(i * 5 + 702) * 2 - 1) * 0.7 * w, len = w * (0.25 + 0.3 * rt(i * 5 + 703));
        const tw = 0.5 + 0.5 * Math.sin(W.t * (1.5 + rt(i) * 2) + i * 3);
        ctx.globalAlpha = ga * tw * smoothstep(0, 0.15, t);
        const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off;
        ctx.beginPath(); ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // 芦荻（41:2）
    ctx.globalAlpha = Math.min(1, k * 1.4);
    const rc = U.mixRGB([88, 124, 62], [150, 132, 88], fam);
    ctx.strokeStyle = css(rc, 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const nR = (W.quality || 1) < 0.75 ? 32 : 64;
    for (let i = 0; i < nR; i++) {
      const t = 0.08 + 0.9 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = nilePt(t), w = nileW(t, wk) * 0.62 + 2 * s;
      const bx = p[0] + p[2] * w * side, by = p[1] + p[3] * w * side;
      const h = (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t) * (1 - 0.5 * fam);
      const sw = W.wind * 1.5 * s + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + sw * 0.3, by - h * 0.6, bx + sw, by - h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 应许之路：自歌珊往迦南（右）的地上，一道微光（50:24）
  function drawPromise(ctx) {
    const k = W.lv.jsPromise;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 90; i++) {
      const f = rt(i * 4 + 1200), xf = lerp(X.coffin + 0.02, 1.0, f), v = 0.16 + 0.1 * Math.sin(f * 7) + (rt(i * 4 + 1201) - 0.5) * 0.08;
      const y = fieldY(xf, v), tw = 0.5 + 0.5 * Math.sin(W.t * (0.8 + rt(i * 4 + 1202) * 1.6) + i * 2.3);
      const reach = smoothstep(f - 0.2, f, k * 1.2);
      ctx.globalAlpha = k * tw * reach * (0.35 + 0.45 * nightK());
      const sz = (0.8 + rt(i * 4 + 1203)) * u;
      ctx.fillRect(xf * W.w - sz / 2, y - sz / 2, sz, sz);
    }
    // 迦南的山上一抹晨光似的暖色
    const cx = 0.93 * W.w, cy = gY(1, 0.93) - 10 * u;
    glowSp(ctx, SP.gold, cx, cy, M() * 0.22, k * (0.12 + 0.18 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天上：埃及的暖色尘雾、饥荒的昏黄
  function drawSkyHaze(ctx) {
    const e = W.lv.jsEgypt, fam = W.lv.jsFamine;
    if (e < 0.01 && fam < 0.01) return;
    const hz = W.horizonY, top = hz - W.h * 0.34;
    const a = (0.16 * e + 0.14 * fam) * (0.35 + 0.65 * W.daylight);
    if (a < 0.004) return;
    const c = U.mixRGB([246, 210, 156], [214, 170, 110], fam);
    const g = ctx.createLinearGradient(0, top, 0, hz + 4);
    g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], a));
    ctx.fillStyle = g;
    ctx.fillRect(0, top, W.w, hz - top + 4);
    if (fam > 0.01) {
      ctx.fillStyle = U.rgba(196, 160, 110, 0.08 * fam * (0.3 + 0.7 * W.daylight));
      ctx.fillRect(0, 0, W.w, hz);
    }
  }
  // 十二颗星：以色列的十二支派（49:28）——呼应「十一个星向我下拜」
  const TRIBE = [];
  for (let i = 0; i < 12; i++) TRIBE.push([lerp(0.6, 0.955, i / 11), 0.215 - 0.085 * Math.sin(Math.PI * i / 11) + (rt(i * 9 + 50) - 0.5) * 0.02]);
  function drawTribes(ctx) {
    const k = W.lv.jsTribes;
    if (k < 0.01) return;
    SP || sprites();
    const A = k * (0.18 + 0.82 * clamp(W.night * 1.3 + W.dusk * 0.5, 0, 1));
    const u = Math.max(0.7, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const x = TRIBE[i][0] * W.w, y = TRIBE[i][1] * W.h, tw = 0.85 + 0.15 * Math.sin(W.t * 1.2 + i * 1.9);
      const big = i === 10 ? 1.25 : 1;
      ctx.globalAlpha = A * tw;
      ctx.fillStyle = 'rgb(255,246,226)';
      ctx.beginPath(); ctx.arc(x, y, 1.7 * u * big, 0, TAU); ctx.fill();
      ctx.globalAlpha = A * tw * 0.4;
      ctx.fillRect(x - 7 * u * big, y - 0.5, 14 * u * big, 1); ctx.fillRect(x - 0.5, y - 7 * u * big, 1, 14 * u * big);
      glowSp(ctx, SP.gold, x, y, 9 * u * big, A * tw * 0.45);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 与约瑟同在的光：约瑟在哪里，一道柔和的光就在哪里（在坑里、在监里时，在坑口、在窗里）
  function drawWith(ctx) {
    const k = W.lv.jsWith;
    if (k < 0.01) return;
    const p = fig('joseph') && !fig('joseph').dying ? figPt('joseph', 0.55) : null;
    if (!p) return;
    SP || sprites();
    const u = SU(), br = 0.88 + 0.12 * Math.sin(W.t * 0.9);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], 46 * u, k * (0.16 + 0.32 * nightK()) * br);
    glowSp(ctx, SP.white, p[0], p[1] - 4 * u, 18 * u, k * (0.1 + 0.2 * nightK()) * br);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光与梦（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, e) { if (b && b.instant) return null; e.t = 0; FXL.push(e); return e; }
  function beam(b, xf, o) {
    o = o || {};
    if (!fxAdd(b, { type: 'beam', dur: o.dur || 7, xf, w: (o.w || 70) * SU(), k: o.k || 1, white: !!o.white })) return;
    if (o.ring !== false) fx().ring(xf * W.w, gY(2, xf) - 16 * LS(2), o.white ? [226, 232, 255] : [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  const mote = (b, from, to, c, dur) => fxAdd(b, { type: 'mote', dur: dur || 3, a: from, b: to, c: c || [255, 226, 160] });
  const glint = (b, id, c) => fxAdd(b, { type: 'glint', dur: 3.2, id, c: c || [236, 242, 255] });
  const soul = (b, id, dur) => { const p = figPt(id, 0.5); if (p) fxAdd(b, { type: 'soul', dur: dur || 5.5, x0: p[0] / W.w, y0: p[1] / W.h }); };

  // ── 梦的画：禾捆 ────────────────────────────────────────────
  // 一捆禾稼：十几根禾秆在腰间捆住，下端散开立在地上，上端的穗子向四面垂开
  function sheaf(ctx, x, y, h, tilt, a, bright) {
    if (a < 0.01) return;
    SP || sprites();
    glowSp(ctx, SP.gold, x + Math.sin(tilt) * h * 0.55, y - h * 0.55, h * (0.85 + 0.4 * bright), a * (0.22 + 0.33 * bright));
    ctx.save();
    ctx.translate(x, y); ctx.rotate(tilt);
    ctx.globalAlpha = a;
    const N = 13, lw = Math.max(0.6, h * 0.022);
    ctx.strokeStyle = U.rgba(255, 214, 128, 0.62 + 0.3 * bright);
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const k = (i - (N - 1) / 2) / ((N - 1) / 2);
      const bx = k * 0.17 * h, tx = k * 0.045 * h, ex = k * 0.3 * h + Math.sin(W.t * 1.3 + i) * 0.01 * h, ey = -0.86 * h + Math.abs(k) * 0.14 * h;
      ctx.moveTo(bx, 0); ctx.lineTo(tx, -0.42 * h); ctx.quadraticCurveTo(tx + k * 0.02 * h, -0.62 * h, ex, ey);
    }
    ctx.stroke();
    // 穗
    ctx.fillStyle = U.rgba(255, 238, 186, 0.7 + 0.3 * bright);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const k = (i - (N - 1) / 2) / ((N - 1) / 2);
      const ex = k * 0.3 * h + Math.sin(W.t * 1.3 + i) * 0.01 * h, ey = -0.86 * h + Math.abs(k) * 0.14 * h, ang = k * 0.9;
      const cx = ex + Math.sin(ang) * 0.06 * h, cy = ey - Math.cos(ang) * 0.06 * h;
      ctx.moveTo(cx + 0.03 * h, cy); ctx.ellipse(cx, cy, 0.028 * h, 0.085 * h, ang, 0, TAU);
    }
    ctx.fill();
    // 腰间的捆绳
    ctx.fillStyle = U.rgba(255, 246, 220, 0.85);
    ctx.fillRect(-0.075 * h, -0.45 * h, 0.15 * h, 0.055 * h);
    ctx.restore();
  }
  // 禾捆之梦（37:7）：我的捆起来站着，你们的捆来围着我的捆下拜
  function drawSheaves(ctx, e, alpha) {
    const t = e.t, u = SU();
    const cx = e.xf * W.w, cy = e.cy != null ? e.cy * W.h : fieldY(e.xf, 0.34);
    const h = (e.h || 44) * LS(2);
    const fin = e.ghost ? 1 : 0;
    const fade = e.ghost ? Math.sin(clamp(t / e.dur, 0, 1) * Math.PI) : smoothstep(0, 2, t) * (1 - smoothstep(e.dur - 3, e.dur, t));
    const rise = fin || smoothstep(2.2, 4.5, t), gather = fin || smoothstep(4.5, 8.5, t), bow = fin || smoothstep(7.5, 10.5, t);
    const A = fade * alpha;
    if (A < 0.01) return;
    const rx = Math.max(50 * u, 0.075 * W.w) * (e.ghost ? 0.8 : 1), ry = 18 * u;
    const list = [];
    for (let i = 0; i < 11; i++) {
      const sx = cx + (i - 5) * rx * 0.2 + (i < 5 ? -rx * 0.35 : rx * 0.35), sy = cy + (rt(i + 300) - 0.5) * 4 * u;
      const th = Math.PI * 0.5 + (i / 11) * TAU;
      const ex = cx + Math.cos(th) * rx, ey = cy + Math.sin(th) * ry;
      const x = lerp(sx, ex, U.easeInOut(gather)), y = lerp(sy, ey, U.easeInOut(gather));
      const dx = x - cx;
      const tilt = -Math.sign(dx) * Math.min(1, Math.abs(dx) / (rx * 0.6)) * 0.48 * bow;
      list.push([y, x, tilt, 0.88 - 0.12 * bow]);
    }
    list.push([cy + 0.1, cx, 0, 0.9 + 0.3 * rise, true]);
    list.sort((a, b) => a[0] - b[0]);
    ctx.globalCompositeOperation = 'lighter';
    for (const q of list) sheaf(ctx, q[1], q[0], h * q[3], q[2], A * (q[4] ? 1 : 0.8), q[4] ? 0.5 + 0.5 * rise : 0.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 梦的画：日、月与十一个星（37:9）──────────────────────────
  function star4(ctx, x, y, r, a) {
    if (a < 0.01) return;
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 3); ctx.quadraticCurveTo(x + r * 0.3, y - r * 0.3, x + r * 3, y); ctx.quadraticCurveTo(x + r * 0.3, y + r * 0.3, x, y + r * 3);
    ctx.quadraticCurveTo(x - r * 0.3, y + r * 0.3, x - r * 3, y); ctx.quadraticCurveTo(x - r * 0.3, y - r * 0.3, x, y - r * 3);
    ctx.fill();
  }
  function heavensLayout(e, t, focal) {
    const u = SU(), R = Math.max(62 * u, M() * 0.15);
    const fin = e.ghost ? 1 : 0;
    const gather = fin || U.easeInOut(smoothstep(3, 8.5, t)), bow = fin || smoothstep(7.5, 10.5, t);
    const out = [];
    // 0 = 日，1 = 月，2.. = 十一个星
    for (let i = 0; i < 13; i++) {
      let sx, sy;
      if (i === 0) { sx = 0.66; sy = 0.15; } else if (i === 1) { sx = 0.8; sy = 0.1; }
      else { const k = (i - 2) / 10; sx = lerp(0.5, 0.97, k); sy = 0.3 - 0.16 * Math.sin(Math.PI * k) + (rt(i + 60) - 0.5) * 0.04; }
      // 在约瑟上方排成拱形
      const ang = i === 0 ? -Math.PI * 0.62 : i === 1 ? -Math.PI * 0.38 : -Math.PI * (0.06 + 0.88 * ((i - 2) / 10));
      const rr = R * (i < 2 ? 0.62 : 1) * (1 - 0.3 * bow);
      const ex = focal[0] + Math.cos(ang) * rr * 1.25, ey = focal[1] + Math.sin(ang) * rr + bow * R * 0.18;
      out.push([lerp(sx * W.w, ex, gather), lerp(sy * W.h, ey, gather), bow]);
    }
    return out;
  }
  function drawHeavens(ctx, e, alpha) {
    const t = e.t, u = SU();
    const jp = figPt(e.id || 'joseph', 0.9) || [0.87 * W.w, W.h * 0.8];
    const focal = [clamp(jp[0], W.w * 0.2, W.w * 0.85), Math.max(jp[1] - 34 * u, W.h * 0.42)];
    const fade = e.ghost ? Math.sin(clamp(t / e.dur, 0, 1) * Math.PI) : smoothstep(0, 2.5, t) * (1 - smoothstep(e.dur - 3.5, e.dur, t));
    const A = fade * alpha;
    if (A < 0.01) return;
    SP || sprites();
    const L = heavensLayout(e, t, focal);
    ctx.globalCompositeOperation = 'lighter';
    // 日
    const sn = L[0], sr = 9 * u;
    glowSp(ctx, SP.gold, sn[0], sn[1], sr * 5, A * 0.7);
    ctx.globalAlpha = A;
    ctx.fillStyle = 'rgb(255,226,150)';
    ctx.beginPath(); ctx.arc(sn[0], sn[1], sr, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,232,170,0.6)'; ctx.lineWidth = Math.max(0.6, 1 * u);
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU + W.t * 0.1; ctx.moveTo(sn[0] + Math.cos(a) * sr * 1.4, sn[1] + Math.sin(a) * sr * 1.4); ctx.lineTo(sn[0] + Math.cos(a) * sr * (2 + (i % 2) * 0.6), sn[1] + Math.sin(a) * sr * (2 + (i % 2) * 0.6)); }
    ctx.stroke();
    // 月（一弯）
    const mn = L[1], mr = 7 * u;
    glowSp(ctx, SP.silver, mn[0], mn[1], mr * 4, A * 0.55);
    ctx.globalAlpha = A * 0.95;
    ctx.fillStyle = 'rgb(226,232,250)';
    ctx.beginPath(); ctx.arc(mn[0], mn[1], mr, -Math.PI * 0.5, Math.PI * 0.5, true); ctx.ellipse(mn[0], mn[1], mr * 0.42, mr, 0, Math.PI * 0.5, -Math.PI * 0.5, true); ctx.closePath(); ctx.fill();
    // 十一个星
    ctx.fillStyle = 'rgb(246,244,255)';
    for (let i = 2; i < 13; i++) {
      const q = L[i], tw = 0.8 + 0.2 * Math.sin(W.t * 2 + i * 1.3);
      glowSp(ctx, SP.pale, q[0], q[1], 10 * u, A * 0.5 * tw);
      ctx.fillStyle = 'rgb(246,244,255)';
      star4(ctx, q[0], q[1], (1.3 + 0.5 * q[2]) * u, A * tw);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 梦的画：葡萄树与杯（40:9–11）；三筐白饼与飞鸟（40:16–17）──
  function drawVine(ctx, e) {
    const t = e.t, u = SU(), s = LS(2) * 1.55;
    const pr = getP('prison');
    const bx = ((pr ? pr.x : X.prison) - 0.05) * W.w, by = gY(2, pr ? pr.x : X.prison) - 26 * s;
    const A = smoothstep(0, 1.5, t) * (1 - smoothstep(e.dur - 2.5, e.dur, t));
    if (A < 0.01) return;
    SP || sprites();
    const H = 40 * s, stem = smoothstep(0, 2.5, t), br = smoothstep(2, 4, t), bud = smoothstep(4, 5.5, t), bloom = smoothstep(5.5, 7, t) * (1 - smoothstep(7.5, 9, t)), grape = smoothstep(7.5, 9.5, t);
    const cup = smoothstep(9, 10.5, t), juice = smoothstep(10, 12, t);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.dream, bx, by - H * 0.6, H * 1.2, A * 0.35);
    ctx.globalAlpha = A;
    ctx.strokeStyle = 'rgba(206,236,170,0.8)'; ctx.lineWidth = Math.max(0.8, 1.6 * s);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - 4 * s, by - H * 0.5 * stem, bx, by - H * stem); ctx.stroke();
    const tips = [];
    for (let i = 0; i < 3; i++) {
      const a = -Math.PI * (0.22 + 0.28 * i), L = 17 * s * br, ox = bx, oy = by - H;
      const ex = ox + Math.cos(a) * L, ey = oy + Math.sin(a) * L * 0.8;
      if (br > 0.01) { ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(ox + Math.cos(a) * L * 0.5, oy + Math.sin(a) * L * 0.5 - 3 * s, ex, ey); ctx.stroke(); }
      tips.push([ex, ey]);
    }
    for (const q of tips) {
      if (bud > 0.01 && grape < 0.5) { ctx.fillStyle = 'rgba(236,255,214,0.9)'; ctx.globalAlpha = A * bud * (1 - grape); ctx.beginPath(); ctx.arc(q[0], q[1], (1 + 2.4 * bloom) * s, 0, TAU); ctx.fill(); }
      if (bloom > 0.01) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.globalAlpha = A * bloom; for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU + t; ctx.beginPath(); ctx.arc(q[0] + Math.cos(a) * 2.2 * s, q[1] + Math.sin(a) * 2.2 * s, 1.3 * s, 0, TAU); ctx.fill(); } }
      if (grape > 0.01) {
        ctx.globalAlpha = A * grape;
        ctx.fillStyle = 'rgba(176,120,236,0.85)';
        for (let k = 0; k < 7; k++) { const gx = q[0] + (k % 3 - 1) * 1.8 * s, gy = q[1] + 2 * s + Math.floor(k / 3) * 1.8 * s * grape; ctx.beginPath(); ctx.arc(gx + (Math.floor(k / 3) % 2) * 0.9 * s, gy, 1.2 * s * grape, 0, TAU); ctx.fill(); }
      }
    }
    if (cup > 0.01) {
      const cx = bx + 22 * s, cy = by - H * 0.35;
      ctx.globalAlpha = A * cup;
      glowSp(ctx, SP.gold, cx, cy, 14 * s, A * cup * 0.6);
      ctx.globalAlpha = A * cup;
      ctx.fillStyle = 'rgba(255,220,140,0.9)';
      ctx.beginPath(); ctx.moveTo(cx - 5 * s, cy - 4 * s); ctx.quadraticCurveTo(cx, cy + 3 * s, cx + 5 * s, cy - 4 * s); ctx.closePath(); ctx.fill();
      ctx.fillRect(cx - 0.6 * s, cy, 1.2 * s, 5 * s); ctx.fillRect(cx - 3 * s, cy + 5 * s, 6 * s, 1 * s);
      if (juice > 0.01 && juice < 1) {
        ctx.fillStyle = 'rgba(210,140,255,0.9)';
        for (let k = 0; k < 5; k++) { const q = U.fract(juice * 3 + k / 5), jx = lerp(tips[0][0], cx, q), jy = lerp(tips[0][1] + 4 * s, cy - 4 * s, q) - Math.sin(q * Math.PI) * 6 * s; ctx.globalAlpha = A * Math.sin(q * Math.PI); ctx.fillRect(jx - 0.8 * s, jy - 0.8 * s, 1.6 * s, 1.6 * s); }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawBaskets(ctx, e) {
    const t = e.t, s = LS(2) * 1.45;
    const pr = getP('prison');
    const bx = ((pr ? pr.x : X.prison) + 0.05) * W.w, by = gY(2, pr ? pr.x : X.prison) - 30 * s;
    const A = smoothstep(0, 1.5, t) * (1 - smoothstep(e.dur - 3, e.dur, t));
    if (A < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.pale, bx, by - 8 * s, 30 * s, A * 0.25);
    for (let i = 0; i < 3; i++) {
      const yy = by - i * 6.2 * s, w = 7 * s;
      ctx.globalAlpha = A * 0.6;
      ctx.fillStyle = 'rgba(214,206,190,0.8)';
      ctx.beginPath(); ctx.moveTo(bx - w, yy - 4 * s); ctx.lineTo(bx + w, yy - 4 * s); ctx.lineTo(bx + w * 0.75, yy); ctx.lineTo(bx - w * 0.75, yy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(248,244,236,0.8)';
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(bx + (k - 1) * 3.6 * s, yy - 4.6 * s, 1.9 * s, 1.1 * s, 0, 0, TAU); ctx.fill(); }
    }
    ctx.globalCompositeOperation = 'source-over';
    // 飞鸟：盘旋，落下来啄食最上的筐
    const birds = smoothstep(2, 4, t);
    ctx.strokeStyle = U.rgba(30, 26, 34, 0.85 * A * birds); ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.beginPath();
    for (let k = 0; k < 4; k++) {
      const a = W.t * 1.3 + k * 1.6, dive = smoothstep(5, 8, t) * (0.5 + 0.5 * Math.sin(W.t * 2 + k));
      const r = lerp(22, 6, dive) * s, x = bx + Math.cos(a) * r, y = by - 16 * s - Math.sin(a) * r * 0.4 - (1 - dive) * 10 * s;
      const wg = Math.sin(W.t * 9 + k) * 1.6 * s;
      ctx.moveTo(x - 3.2 * s, y - wg); ctx.quadraticCurveTo(x - 1.2 * s, y - 1 * s, x, y); ctx.quadraticCurveTo(x + 1.2 * s, y - 1 * s, x + 3.2 * s, y - wg);
    }
    ctx.stroke();
    // 末了，幽暗掩过
    const dk = smoothstep(7.5, 9.5, t) * A;
    if (dk > 0.01) { ctx.fillStyle = U.rgba(8, 6, 14, 0.5 * dk); ctx.beginPath(); ctx.ellipse(bx, by - 8 * s, 26 * s, 22 * s, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  // ── 梦的画：七只母牛从河里上来（41:2–4）──────────────────────
  // 肥壮的：金色的光；干瘦的：暗影，边上一道惨白
  function cowShape(ctx, x, y, s, d, fat, ph, gait) {
    const bl = 30 * s, bh = (fat ? 12.5 : 8) * s, leg = (fat ? 10.5 : 12) * s;
    const by = y - leg - bh * 0.5;
    ctx.beginPath();
    // 腿
    const L4 = [[-0.36, 0], [-0.26, Math.PI], [0.3, Math.PI * 0.5], [0.4, Math.PI * 1.5]];
    for (const [ox, o] of L4) {
      const sw = Math.sin(ph + o) * 3 * s * gait, lift = Math.max(0, Math.cos(ph + o)) * 1.6 * s * gait, lx = x + d * ox * bl, w = (fat ? 1.7 : 1.1) * s;
      ctx.moveTo(lx - w, by + bh * 0.2); ctx.lineTo(lx + d * sw - w * 0.6, y - lift); ctx.lineTo(lx + d * sw + w * 0.6, y - lift); ctx.lineTo(lx + w, by + bh * 0.2); ctx.closePath();
    }
    // 身
    if (fat) {
      ctx.moveTo(x + bl * 0.5, by); ctx.ellipse(x, by, bl * 0.5, bh * 0.56, 0, 0, TAU);
    } else {
      const bk = by - bh * 0.5;
      ctx.moveTo(x - d * bl * 0.5, by);
      ctx.quadraticCurveTo(x - d * bl * 0.46, bk - 1.8 * s, x - d * bl * 0.32, bk - 1.4 * s);   // 髋骨
      ctx.quadraticCurveTo(x, bk + 1.4 * s, x + d * bl * 0.3, bk - 0.6 * s);
      ctx.quadraticCurveTo(x + d * bl * 0.5, bk, x + d * bl * 0.46, by);
      ctx.quadraticCurveTo(x + d * bl * 0.2, by + bh * 0.3, x, by + bh * 0.05);            // 瘪下的肚腹
      ctx.quadraticCurveTo(x - d * bl * 0.3, by + bh * 0.3, x - d * bl * 0.5, by);
      ctx.closePath();
    }
    // 颈与头、角
    const nx = x + d * bl * 0.42, ny = by - bh * 0.25, hx = x + d * bl * 0.66, hy = by - bh * 0.05 + (fat ? 2 : 3) * s;
    ctx.moveTo(nx - d * 2 * s, ny - bh * 0.3); ctx.quadraticCurveTo(hx - d * 2 * s, hy - 5 * s, hx + d * 1.5 * s, hy - 3 * s);
    ctx.lineTo(hx + d * 3.2 * s, hy + 2.2 * s); ctx.lineTo(hx - d * 1.4 * s, hy + 2.4 * s); ctx.quadraticCurveTo(nx, ny + bh * 0.3, nx - d * 4 * s, ny + bh * 0.35); ctx.closePath();
    ctx.moveTo(hx - d * 0.5 * s, hy - 3.6 * s); ctx.quadraticCurveTo(hx - d * 4.5 * s, hy - 9 * s, hx - d * 1 * s, hy - 10 * s);
    ctx.lineTo(hx - d * 0.2 * s, hy - 9.2 * s); ctx.quadraticCurveTo(hx - d * 3 * s, hy - 8 * s, hx + d * 0.6 * s, hy - 3.4 * s); ctx.closePath();
    // 尾
    const tx = x - d * bl * 0.5;
    ctx.moveTo(tx, by - bh * 0.3); ctx.quadraticCurveTo(tx - d * 2 * s, by + bh * 0.2, tx - d * 1.4 * s, by + bh * 0.8); ctx.lineTo(tx - d * 0.6 * s, by + bh * 0.8); ctx.quadraticCurveTo(tx - d * 1 * s, by + bh * 0.2, tx + d * 0.6 * s, by - bh * 0.3); ctx.closePath();
  }
  function drawCows(ctx, e) {
    const t = e.t, s = LS(2) * 1.3, u = SU();
    SP || sprites();
    const A = smoothstep(0, 1, t) * (1 - smoothstep(e.dur - 3.5, e.dur, t));
    if (A < 0.01) return;
    const rp = nilePt(0.84), riverX = rp[0], riverY = rp[1];
    const slot = (i, lean) => { const xf = (lean ? 0.522 : 0.505) + i * 0.034 + (rt(i * 7 + (lean ? 90 : 40)) - 0.5) * 0.012; return [xf * W.w, fieldY(xf, (lean ? 0.34 : 0.56) + (rt(i * 7 + (lean ? 91 : 41)) - 0.5) * 0.16)]; };
    const cows = [];
    for (let k = 0; k < 14; k++) {
      const lean = k >= 7, i = k % 7, t0 = (lean ? 8 : 0.8) + i * 0.8, q = clamp((t - t0) / 3, 0, 1);
      if (t < t0) continue;
      const tg = slot(i, lean);
      let x = lerp(riverX + (lean ? -4 : 6) * u, tg[0], U.easeInOut(q)), y = lerp(riverY + 6 * u, tg[1], U.easeOut(q));
      let a = smoothstep(0, 0.35, q), dim = 1;
      if (!lean) { const eat = smoothstep(15 + i * 0.25, 17.5 + i * 0.25, t); a *= 1 - eat; dim = 1 - eat; }
      else { const go = smoothstep(14.5 + i * 0.25, 17 + i * 0.25, t); const f = slot(i, false); x = lerp(x, lerp(tg[0], f[0], 0.6), go); y = lerp(y, lerp(tg[1], f[1], 0.6), go); }
      const emerge = smoothstep(0, 0.25, q);
      cows.push({ x, y, lean, a: a * A, gait: q > 0 && q < 1 ? 1 : 0, ph: q * 14 + k, emerge, dim });
    }
    cows.sort((a, b) => a.y - b.y);
    for (const c of cows) {
      if (c.a < 0.01) continue;
      const sink = (1 - c.emerge) * 10 * s;
      ctx.save();
      if (c.emerge < 1) { ctx.beginPath(); ctx.rect(c.x - 60 * s, c.y - 60 * s, 120 * s, 60 * s + 0.5 - sink); ctx.clip(); }
      if (!c.lean) {
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, c.x, c.y + sink - 14 * s, 26 * s, c.a * 0.45);
        ctx.globalAlpha = c.a;
        ctx.fillStyle = 'rgba(255,220,150,0.62)';
        cowShape(ctx, c.x, c.y + sink, s, 1, true, c.ph, c.gait);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = c.a * 0.85;
        ctx.fillStyle = 'rgb(34,28,44)';
        cowShape(ctx, c.x, c.y + sink, s, 1, false, c.ph, c.gait);
        ctx.fill();
        ctx.globalAlpha = c.a * 0.55;
        ctx.strokeStyle = 'rgb(206,200,226)'; ctx.lineWidth = Math.max(0.5, 0.7 * s);
        ctx.stroke();
      }
      ctx.restore();
    }
    // 肥牛的光被吞进瘦牛里
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const q = smoothstep(15 + i * 0.25, 17.5 + i * 0.25, t);
      if (q <= 0.01 || q >= 0.99) continue;
      const f = slot(i, false), l0 = slot(i, true);
      for (let k = 0; k < 6; k++) {
        const r = U.fract(q + k / 6), x = lerp(f[0], lerp(l0[0], f[0], 0.6), r), y = lerp(f[1] - 14 * s, l0[1] - 12 * s, r) - Math.sin(r * Math.PI) * 8 * s;
        ctx.globalAlpha = A * 0.7 * Math.sin(r * Math.PI);
        ctx.fillStyle = 'rgb(255,226,160)';
        ctx.fillRect(x - 1.2 * u, y - 1.2 * u, 2.4 * u, 2.4 * u);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 梦的画：一棵麦子长了七个穗子（41:5–7）；东风吹焦了 ─────────
  function drawEars(ctx, e) {
    const t = e.t, u = SU();
    SP || sprites();
    const A = smoothstep(0, 1, t) * (1 - smoothstep(e.dur - 3.5, e.dur, t));
    if (A < 0.01) return;
    const Hs = Math.min(W.h * 0.3, 190 * u);
    const stalk = (xf, grow, thin) => {
      const x = xf * W.w, y = fieldY(xf, 0.62), top = y - Hs * grow;
      const bend = thin ? 10 * u * (0.5 + 0.5 * W.wind) + smoothstep(8, 12, t) * 8 * u : 3 * u;
      return { x, y, top, bend, pt: k => [x + bend * k * k, lerp(y, top, k)] };
    };
    const gA = smoothstep(0, 2.5, t), eA = smoothstep(2, 5, t), gB = smoothstep(6, 8.5, t), eB = smoothstep(8, 10, t), sw = smoothstep(12, 15, t);
    const SA = stalk(0.585, gA, false), SB = stalk(0.66, gB, true);
    const drawStalk = (S, w, col, a) => {
      if (a < 0.01) return;
      ctx.strokeStyle = col; ctx.lineWidth = w; ctx.globalAlpha = a;
      ctx.beginPath(); for (let i = 0; i <= 12; i++) { const p = S.pt(i / 12); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); } ctx.stroke();
    };
    // 好穗子
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, SA.x, (SA.y + SA.top) / 2, Hs * 0.6, A * gA * 0.35 * (1 - sw * 0.8));
    drawStalk(SA, Math.max(1, 2.2 * u), 'rgba(230,214,140,0.8)', A * (1 - sw * 0.7));
    for (let i = 0; i < 7; i++) {
      const k = 0.52 + i * 0.07, p = SA.pt(k), side = i % 2 ? 1 : -1, a = A * smoothstep(i * 0.12, i * 0.12 + 0.3, eA) * (1 - smoothstep(i * 0.08, i * 0.08 + 0.5, sw));
      if (a < 0.01) continue;
      const r = 5.5 * u * (1 - 0.3 * sw);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(255,214,120,0.85)';
      ctx.beginPath(); ctx.ellipse(p[0] + side * r * 0.8, p[1] - r * 0.8, r * 0.62, r * 1.7, side * 0.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,236,190,0.6)'; ctx.lineWidth = Math.max(0.5, 0.6 * u);
      ctx.beginPath(); for (let k2 = 0; k2 < 3; k2++) { const ax = p[0] + side * r * (0.9 + k2 * 0.2), ay = p[1] - r * (1.8 + k2 * 0.3); ctx.moveTo(ax, ay); ctx.lineTo(ax + side * r * 0.8, ay - r * 1.6); } ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 细弱的、被东风吹焦的穗子（暗）
    drawStalk(SB, Math.max(0.7, 1.2 * u), 'rgba(92,70,54,0.9)', A * gB);
    for (let i = 0; i < 7; i++) {
      const k = 0.55 + i * 0.065, p = SB.pt(k), side = i % 2 ? 1 : -1, a = A * smoothstep(i * 0.12, i * 0.12 + 0.3, eB);
      if (a < 0.01) continue;
      const r = 4.4 * u, droop = 0.9 + smoothstep(8, 12, t) * 0.5;
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(70,50,40)';
      ctx.beginPath(); ctx.ellipse(p[0] + side * r * 0.9, p[1] - r * 0.2, r * 0.28, r * 1.6, side * droop, 0, TAU); ctx.fill();
      ctx.strokeStyle = U.rgba(236, 150, 90, 0.5 * a); ctx.lineWidth = Math.max(0.5, 0.6 * u);
      ctx.stroke();
    }
    // 东风：自东（左）吹来的热沙
    const wk = smoothstep(7.5, 9, t) * (1 - smoothstep(12.5, 14, t)) * A;
    if (wk > 0.01) {
      ctx.strokeStyle = 'rgba(236,190,130,0.5)'; ctx.lineWidth = Math.max(0.6, 1 * u);
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const f = U.fract(rt(i * 3 + 500) + W.t * (0.25 + 0.2 * rt(i * 3 + 501))), x = lerp(0.3, 1.0, f) * W.w, y = lerp(SB.top, SB.y, rt(i * 3 + 502)) + Math.sin(f * 9 + i) * 4 * u;
        ctx.moveTo(x, y); ctx.lineTo(x + (8 + 10 * rt(i)) * u, y - 1 * u);
      }
      ctx.globalAlpha = wk; ctx.stroke();
    }
    // 细穗子吞了好穗子
    if (sw > 0.01 && sw < 0.99) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,220,150)';
      for (let i = 0; i < 7; i++) {
        const q = U.fract(sw * 1.6 + i / 7), a = SA.pt(0.52 + i * 0.07), b = SB.pt(0.55 + i * 0.065);
        const x = lerp(a[0], b[0], q), y = lerp(a[1], b[1], q) - Math.sin(q * Math.PI) * 12 * u;
        ctx.globalAlpha = A * Math.sin(q * Math.PI) * 0.8;
        ctx.fillRect(x - 1.3 * u, y - 1.3 * u, 2.6 * u, 2.6 * u);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 七个丰年、七个荒年（41:29–30）：天上一弯十四个光 ─────────
  function drawYears(ctx, e) {
    const t = e.t, u = SU();
    SP || sprites();
    const A = 1 - smoothstep(e.dur - 2, e.dur, t);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) {
      const good = i < 7, x = lerp(0.3, 0.95, i / 13) * W.w, y = (0.24 - 0.09 * Math.sin(Math.PI * i / 13)) * W.h;
      let a = smoothstep(i * 0.45, i * 0.45 + 0.8, t) * A;
      if (good) a *= 1 - smoothstep(8 + i * 0.2, 10 + i * 0.2, t) * 0.85;
      if (a < 0.01) continue;
      glowSp(ctx, good ? SP.gold : SP.pale, x, y, (good ? 18 : 12) * u, a * (good ? 0.7 : 0.25));
      ctx.globalAlpha = a * (good ? 0.95 : 0.45);
      ctx.fillStyle = good ? 'rgb(255,226,150)' : 'rgb(150,146,160)';
      ctx.beginPath(); ctx.arc(x, y, (good ? 3.4 : 2.6) * u, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      switch (e.type) {
        case 'sheaves': drawSheaves(ctx, e, e.ghost ? 0.4 : 1); break;
        case 'heavens': drawHeavens(ctx, e, e.ghost ? 0.4 : 1); break;
        case 'vine': drawVine(ctx, e); break;
        case 'baskets': drawBaskets(ctx, e); break;
        case 'cows': drawCows(ctx, e); break;
        case 'ears': drawEars(ctx, e); break;
        case 'years': drawYears(ctx, e); break;
        case 'beam': {
          const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
          const x = e.xf * W.w, y = gY(2, e.xf);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = env * 0.5 * e.k;
          ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
          glowSp(ctx, e.white ? SP.white : SP.gold, x, y - e.w * 0.3, e.w * 1.2, env * 0.55 * e.k);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'mote': {
          const A = figPt(e.a, 0.62), B = figPt(e.b, 0.55);
          if (!A || !B) break;
          const k = U.easeInOut(q), x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k) - Math.sin(k * Math.PI) * 26 * u;
          const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.85, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.gold, x, y, 17 * u, env * 0.8);
          ctx.globalAlpha = env; ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
          ctx.fillRect(x - 1.5 * u, y - 1.5 * u, 3 * u, 3 * u);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'coins': {
          const A = e.pa || figPt(e.a, 0.5), B = e.pb || figPt(e.b, 0.5);
          if (!A || !B) break;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgb(232,238,250)';
          for (let i = 0; i < 20; i++) {
            const k = clamp((q - i * 0.02) / 0.6, 0, 1);
            if (k <= 0 || k >= 1) continue;
            const x = lerp(A[0], B[0], U.easeInOut(k)), y = lerp(A[1], B[1], k) - Math.sin(k * Math.PI) * (14 + rt(i) * 10) * u;
            ctx.globalAlpha = Math.sin(k * Math.PI) * 0.9;
            ctx.fillRect(x - 1.1 * u, y - 1.1 * u, 2.2 * u, 2.2 * u);
          }
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'glint': {
          const p = figPt(e.id, 0.45);
          if (!p) break;
          const env = Math.sin(q * Math.PI), L = 7 * u;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = env * 0.95; ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
          ctx.fillRect(p[0] - L, p[1] - 0.5, L * 2, 1); ctx.fillRect(p[0] - 0.5, p[1] - L, 1, L * 2);
          glowSp(ctx, SP.silver, p[0], p[1], L * 1.6, env * 0.7);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'soul': {
          const k = U.easeInOut(q), x = e.x0 * W.w + Math.sin(q * 6) * 6 * u * (1 - q), y = lerp(e.y0 * W.h, e.y0 * W.h - W.h * (e.up || 0.34), k);
          const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.7, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.pale, x, y, 22 * u, env * 0.75);
          ctx.globalAlpha = env; ctx.fillStyle = 'rgb(246,244,255)';
          ctx.fillRect(x - 1.3 * u, y - 1.3 * u, 2.6 * u, 2.6 * u);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'rise': {
          // 自众子身上升起，归于天上的十二颗星
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < e.ids.length; i++) {
            const k = clamp((q - i * 0.035) / 0.6, 0, 1);
            if (k <= 0 || k >= 1) continue;
            const p = figPt(e.ids[i], 0.55); if (!p) continue;
            const tg = TRIBE[i], kk = U.easeInOut(k);
            const x = lerp(p[0], tg[0] * W.w, kk) + Math.sin(k * 5 + i) * 10 * u * (1 - k), y = lerp(p[1], tg[1] * W.h, kk);
            glowSp(ctx, SP.gold, x, y, 12 * u, Math.sin(k * Math.PI) * 0.8);
            ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = 'rgb(255,244,220)';
            ctx.fillRect(x - 1.3 * u, y - 1.3 * u, 2.6 * u, 2.6 * u);
          }
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'seventy': {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgb(255,238,200)';
          for (let i = 0; i < 70; i++) {
            const k = clamp((q - rt(i + 800) * 0.35) / 0.6, 0, 1);
            if (k <= 0 || k >= 1) continue;
            const xf = lerp(e.x0, e.x1, rt(i + 870)), g = fieldY(xf, rt(i + 940) * 0.3);
            const x = xf * W.w + Math.sin(k * 4 + i) * 6 * u, y = lerp(g - 10 * u, g - (60 + 90 * rt(i + 30)) * u, U.easeOut(k));
            ctx.globalAlpha = Math.sin(k * Math.PI) * 0.8;
            ctx.fillRect(x - 1 * u, y - 1 * u, 2 * u, 2 * u);
          }
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'grace': {
          // 「神的意思原是好的」：一道温暖的光自约瑟向全地展开
          const p = figPt(e.id, 0.5) || [W.w * 0.7, W.h * 0.8];
          const R = U.easeOut(q) * W.w * 0.9, env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.6, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgb(255,232,176)';
          for (let i = 0; i < 120; i++) {
            const side = rt(i * 3 + 1500) * 2 - 1, xf = p[0] / W.w + side * R / W.w;
            if (xf < 0.3 || xf > 1.02) continue;
            const y = fieldY(xf, rt(i * 3 + 1501) * 0.85), tw = Math.max(0, Math.sin(W.t * (2 + rt(i * 3 + 1502) * 3) + i));
            ctx.globalAlpha = env * tw * (1 - smoothstep(0.6, 1, Math.abs(side))) * 0.8;
            const sz = (0.9 + rt(i + 77) * 1.3) * u;
            ctx.fillRect(xf * W.w - sz / 2, y - sz / 2, sz, sz);
          }
          glowSp(ctx, SP.gold, p[0], p[1], 60 * u + R * 0.25, env * 0.35);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'dust': {
          // 荒年：自东吹来的尘沙
          const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.7, 1, q));
          ctx.strokeStyle = 'rgba(214,176,120,0.45)'; ctx.lineWidth = Math.max(0.6, 1.1 * u);
          ctx.globalAlpha = env;
          ctx.beginPath();
          for (let i = 0; i < 60; i++) {
            const f = U.fract(rt(i * 3 + 600) + W.t * (0.12 + 0.12 * rt(i * 3 + 601))), x = lerp(0.2, 1.05, f) * W.w, y = lerp(W.horizonY - W.h * 0.08, W.h, rt(i * 3 + 602));
            ctx.moveTo(x, y); ctx.lineTo(x + (10 + 14 * rt(i)) * u, y - 1.5 * u);
          }
          ctx.stroke();
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'tent': drawTent(ctx, p); break;
      case 'cave': drawCave(ctx, p); break;
      case 'pit': drawPit(ctx, p); break;
      case 'cloth': drawCloth(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'bed': drawBed(ctx, p); break;
      case 'bier': drawBier(ctx, p); break;
      case 'palm': drawPalm(ctx, p); break;
      case 'pyramid': drawPyramid(ctx, p); break;
      case 'house': drawHouse(ctx, p); break;
      case 'palace': drawPalace(ctx, p); break;
      case 'throne': drawThrone(ctx, p); break;
      case 'prison': drawPrison(ctx, p); break;
      case 'granary': drawGranary(ctx, p); break;
      case 'field': drawField(ctx, p); break;
      case 'dais': drawDais(ctx, p); break;
      case 'coffin': drawCoffin(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const HGT = { tent: 18, cave: 18, pit: 2, cloth: 3, altar: 8, bed: 7, bier: 18, palm: 44, pyramid: 30, house: 20, palace: 30, throne: 16, prison: 16, granary: 18, field: -8, dais: 8, coffin: 6, chariot: 14 };
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.tx != null) {
          const d = p.tx - p.x, v = p.spd * f;
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else { p.x += Math.sign(d) * v; p.fd = Math.sign(d); p.ph += v * W.w / (6 * LS(p.layer)); }
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawSkyHaze(ctx); drawTribes(ctx); return; }
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        drawDesert(ctx, l);
        if (l === 2) { drawGoshen(ctx); drawNile(ctx); }
        const list = sortProps();
        for (const p of list) {
          if (p.layer !== l || p.a < 0.005 || p.kind === 'chariot' || p.kind === 'coffin' || p.kind === 'bier') continue;
          drawKind(ctx, p);
        }
        if (l === 2) { drawPromise(ctx); drawWith(ctx); }
        return;
      }
      if (pass === 'air') {
        for (const p of sortProps()) if (p.kind === 'chariot' && p.a >= 0.005) drawChariot(ctx, p);
        const fam = W.lv.jsFamine;
        if (fam > 0.01) {
          const g = ctx.createLinearGradient(0, W.horizonY - W.h * 0.1, 0, W.h);
          g.addColorStop(0, U.rgba(206, 170, 112, 0)); g.addColorStop(0.5, U.rgba(206, 168, 108, 0.1 * fam)); g.addColorStop(1, U.rgba(170, 132, 84, 0.16 * fam));
          ctx.fillStyle = g; ctx.fillRect(0, W.horizonY - W.h * 0.1, W.w, W.h);
        }
        const dr = W.lv.jsDream;
        if (dr > 0.01) { ctx.fillStyle = U.rgba(10, 8, 28, 0.34 * dr); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
        drawFX(ctx);
      }
    },
    draw(ctx, pass) {
      // 棺材与抬尸的架：在走兽之后、人之前画（不被游荡的牛挡住）
      if (!isCur() || pass !== 'near') return;
      for (const p of sortProps()) {
        if (p.layer !== 2 || p.a < 0.005) continue;
        if (p.kind === 'coffin') drawCoffin(ctx, p); else if (p.kind === 'bier') drawBier(ctx, p);
      }
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1), px = p.x * W.w, gy = gY(p.layer, p.x);
        const py = gy - (HGT[p.kind] || 10) * s;
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 10 * s, d };
      }
      // 尼罗河
      if (W.lv.jsNile > 0.5) {
        const q = nilePt(0.7), d = Math.hypot(q[0] - x, q[1] - y);
        if (d < r && (!best || d < best.d)) best = { label: '尼罗河', x: q[0], y: q[1] - 12, d };
      }
      if (W.lv.jsTribes > 0.5) {
        for (let i = 0; i < 12; i++) {
          const sx = TRIBE[i][0] * W.w, sy = TRIBE[i][1] * W.h, d = Math.hypot(sx - x, sy - y);
          if (d < r * 0.6 && (!best || d < best.d)) best = { label: '以色列的十二支派', x: sx, y: sy - 10, d };
        }
      }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const PALMS = [
    ['palmW1', 0.392, 2, 0.95, 1], ['palmW2', 0.419, 2, 1.12, -1], ['palmW3', 0.371, 2, 0.8, 1], ['palmE1', 0.511, 2, 1.06, 1],
    ['palmE2', 0.728, 2, 0.92, -1], ['palmM1', 0.522, 1, 1.35, 1], ['palmM2', 0.545, 1, 1.1, -1], ['palmM3', 0.672, 1, 1.2, 1], ['palmM4', 0.7, 1, 1.0, -1],
  ];
  function egyptProps() {
    prop('palace', 'palace', { x: X.palace, label: '法老的宫' });
    prop('potiphar', 'house', { x: X.potiphar, label: '波提乏的家' });
    for (const q of PALMS) prop(q[0], 'palm', { x: q[1], layer: q[2], size: q[3], flip: q[4], label: '棕树' });
    prop('pyr1', 'pyramid', { x: 0.568, layer: 1, size: 1.25, label: '金字塔' });
    prop('pyr2', 'pyramid', { x: 0.607, layer: 1, size: 0.92, label: '金字塔' });
    prop('pyr3', 'pyramid', { x: 0.635, layer: 1, size: 0.6, label: '金字塔' });
  }
  function landLevels(b, o) {                 // 地上的草木：迦南的青草自右而来，埃及是沙地（bare / bloom 由大地模块提供，缺则略过）
    for (const k in o) if (!W.hasLevel || W.hasLevel(k)) W.set(k, o[k], b.instant);
  }
  const FIELDS = ['fieldW', 'fieldE1', 'fieldE2'];
  function fields(o) { FIELDS.forEach(id => prop(id, null, o)); }
  const ALLSONS = () => SONS12.filter(id => fig(id));
  const eleven = () => BROS.concat(['benjamin']);
  const noSimeon = () => BROS.filter(id => id !== 'simeon');
  function ridden(id) { const f = fig(id); return !!(f && f.mount); }
  function onDais(on) {
    if (on) attach('joseph', () => { const p = getP('dais'); return p ? daisTop(p) : null; });
    else attach('joseph', null);
  }
  function onBed(id, on) {
    if (on) attach(id, () => { const p = getP('bed'); return p ? bedTop(p) : null; });
    else attach(id, null);
  }
  function onChariot(id, cid) {
    if (cid) attach(id, () => { const p = getP(cid); return p ? chariotFloor(p) : null; });
    else attach(id, null);
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：希伯仑谷的清晨（37:1–4）
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 1, herbs: 1, trees: 0.42, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.15,
      jsEgypt: 0, jsNile: 0, jsFamine: 0, jsGoshen: 0, jsDream: 0, jsWith: 0, jsTribes: 0, jsPromise: 0, bare: 0, bloom: 1 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.32, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 100, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 3, lx, ly, true);
    W.setPop('beast', 1, lx, ly, true);
    W.setPop('creeper', 20, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    prop('tentJ', 'tent', { x: X.tentJ, label: '雅各的帐棚' });
    prop('tentB', 'tent', { x: X.tentB, size: 0.86, label: '帐棚' });
    prop('cave', 'cave', { x: X.cave, size: 0.9, label: '麦比拉洞' });
    const c = C();
    c.clear({ fade: false });
    add('jacob', { label: '雅各', sex: 'm', age: 'elder', x: X.jacob, facing: -1, robe: ROBE.jacob, glow: 0.4, from: 'none' });
    add('joseph', { label: '约瑟', sex: 'm', age: 'adult', scale: 0.92, x: X.jacob - 0.024, facing: 1, robe: ROBE.joseph, glow: 0.42, prop: 'coat', from: 'none' });
    add('benjamin', { label: '便雅悯', sex: 'm', age: 'child', x: X.jacob + 0.017, facing: -1, robe: ROBE.benjamin, glow: 0.3, from: 'none' });
    BROS.forEach((id, i) => add(id, { label: BRO_CN[id], sex: 'm', age: 'adult', x: 0.645 + i * 0.011, facing: rt(i * 5) < 0.5 ? 1 : -1, robe: ROBE[id], glow: 0.16, v: BRO_V[id], from: 'none' }));
    herd('flockC', { kind: 'sheep', n: 8, x0: 0.6, x1: 0.76, label: '羊群', from: 'none' });
  }

  // ════════════════════════════════════════════════════════════
  //  经文（和合本）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '雅各住在迦南地，就是他父亲寄居的地。', ref: '创世记 37:1', hold: 5 },
    { text: '雅各的记略如下。约瑟十七岁与他哥哥们一同牧羊……', ref: '创世记 37:2', hold: 5.5 },
    { text: '以色列原来爱约瑟过于爱他的众子，因为约瑟是他年老生的；<br>他给约瑟做了一件彩衣。', ref: '创世记 37:3', hold: 7 },
    { text: '约瑟的哥哥们见父亲爱约瑟过于爱他们，<br>就恨约瑟，不与他说和睦的话。', ref: '创世记 37:4', hold: 6.5 },
  ];
  const V1 = [
    { text: '约瑟做了一梦，告诉他哥哥们，他们就越发恨他。', ref: '创世记 37:5', hold: 5.5 },
    { text: '约瑟对他们说：「请听我所做的梦：我们在田里捆禾稼，<br>我的捆起来站着，你们的捆来围着我的捆下拜。」', ref: '创世记 37:6–7', hold: 8 },
    { text: '他的哥哥们回答说：「难道你真要作我们的王吗？难道你真要管辖我们吗？」<br>他们就因为他的梦和他的话越发恨他。', ref: '创世记 37:8', hold: 8 },
  ];
  const V2 = [
    { text: '后来他又做了一梦，也告诉他的哥哥们说：<br>「看哪，我又做了一梦，梦见太阳、月亮与十一个星向我下拜。」', ref: '创世记 37:9', hold: 11 },
    { text: '约瑟将这梦告诉他父亲和他哥哥们，他父亲就责备他说：<br>「你做的这是什么梦！难道我和你母亲、你弟兄果然要来俯伏在地，向你下拜吗？」', ref: '创世记 37:10', hold: 9 },
    { text: '他哥哥们都嫉妒他，他父亲却把这话存在心里。', ref: '创世记 37:11', hold: 5.5 },
  ];
  const V3 = [
    { text: '约瑟的哥哥们往示剑去放他们父亲的羊。以色列对约瑟说：<br>「你哥哥们不是在示剑放羊吗？你来，我要打发你往他们那里去。」约瑟说：「我在这里。」', ref: '创世记 37:12–13', hold: 9 },
    { text: '……约瑟就去追赶他哥哥们，遇见他们在多坍。', ref: '创世记 37:17', hold: 5 },
    { text: '他们远远地看见他，趁他还没有走到跟前，大家就同谋要害死他。', ref: '创世记 37:18', hold: 6 },
    { text: '彼此说：「你看！那做梦的来了。来吧！我们将他杀了，丢在一个坑里，<br>就说有恶兽把他吃了。我们且看他的梦将来怎么样。」', ref: '创世记 37:19–20', hold: 8 },
    { text: '流便听见了，要救他脱离他们的手，说：「我们不可害他的性命。」<br>又说：「不可流他的血，可以把他丢在这野地的坑里，不可下手害他。」', ref: '创世记 37:21–22', hold: 8.5 },
    { text: '约瑟到了他哥哥们那里，他们就剥了他的外衣，就是他穿的那件彩衣，<br>把他丢在坑里；那坑是空的，里头没有水。', ref: '创世记 37:23–24', hold: 8 },
  ];
  const V4 = [
    { text: '他们坐下要吃饭，举目观看，见有一伙米甸的以实玛利人从基列来，<br>用骆驼驮着香料、乳香、没药，要带下埃及去。', ref: '创世记 37:25', hold: 8.5 },
    { text: '犹大对众弟兄说：「我们杀我们的兄弟，藏了他的血，有什么益处呢？<br>我们不如将他卖给以实玛利人，不可下手害他，因为他是我们的兄弟，我们的骨肉。」', ref: '创世记 37:26–27', hold: 9 },
    { text: '有些米甸的商人从那里经过，哥哥们就把约瑟从坑里拉上来，<br>讲定二十舍客勒银子，把约瑟卖给以实玛利人。他们就把约瑟带到埃及去了。', ref: '创世记 37:28', hold: 9 },
    { text: '流便回到坑边，见约瑟不在坑里，就撕裂衣服，', ref: '创世记 37:29', hold: 5.5 },
  ];
  const V5 = [
    { text: '他们宰了一只公山羊，把约瑟的那件彩衣染了血，<br>打发人送到他们的父亲那里……', ref: '创世记 37:31–32', hold: 7 },
    { text: '他认得，就说：「这是我儿子的外衣，有恶兽把他吃了，约瑟被撕碎了！撕碎了！」', ref: '创世记 37:33', hold: 7.5 },
    { text: '雅各便撕裂衣服，腰间围上麻布，为他儿子悲哀了多日……<br>说：「我必悲哀着下阴间到我儿子那里。」约瑟的父亲就为他哀哭。', ref: '创世记 37:34–35', hold: 9 },
    { text: '那时，犹大离开他弟兄下去……<br>犹大承认说：「她比我更有义……」', ref: '创世记 38:1、26', hold: 7 },
    { text: '约瑟被带下埃及去。有一个埃及人，是法老的内臣——护卫长波提乏，<br>从那些带下他来的以实玛利人手下买了他去。', ref: '创世记 39:1', hold: 8 },
  ];
  const V6 = [
    { text: '约瑟住在他主人埃及人的家中，耶和华与他同在，他就百事顺利。', ref: '创世记 39:2', hold: 6.5 },
    { text: '他主人见耶和华与他同在，又见耶和华使他手里所办的尽都顺利，<br>约瑟就在主人眼前蒙恩……主人派他管理家务，把一切所有的都交在他手里。', ref: '创世记 39:3–4', hold: 9 },
    { text: '……耶和华就因约瑟的缘故赐福与那埃及人的家；<br>凡家里和田间一切所有的都蒙耶和华赐福。', ref: '创世记 39:5', hold: 7.5 },
    { text: '这事以后，约瑟主人的妻以目送情给约瑟……<br>「……我怎能作这大恶，得罪神呢？」', ref: '创世记 39:7–9', hold: 7.5 },
    { text: '……约瑟把衣裳丢在妇人手里，跑到外边去了。', ref: '创世记 39:12', hold: 5.5 },
    { text: '……把约瑟下在监里，就是王的囚犯被囚的地方。于是约瑟在那里坐监。', ref: '创世记 39:20', hold: 7 },
  ];
  const V7 = [
    { text: '但耶和华与约瑟同在，向他施恩，使他在司狱的眼前蒙恩。', ref: '创世记 39:21', hold: 6.5 },
    { text: '司狱就把监里所有的囚犯都交在约瑟的手下……<br>因为耶和华与约瑟同在；耶和华使他所做的尽都顺利。', ref: '创世记 39:22–23', hold: 8 },
    { text: '这事以后，埃及王的酒政和膳长得罪了他们的主埃及王……<br>就把他们下在护卫长府内的监里，就是约瑟被囚的地方。', ref: '创世记 40:1–3', hold: 8 },
    { text: '他们对他说：「我们各人做了一梦，没有人能解。」<br>约瑟说：「解梦不是出于神吗？请你们将梦告诉我。」', ref: '创世记 40:8', hold: 8 },
    { text: '酒政便将他的梦告诉约瑟说：「我梦见在我面前有一棵葡萄树，<br>树上有三根枝子，好像发了芽，开了花，上头的葡萄都成熟了……」', ref: '创世记 40:9–10', hold: 8.5 },
    { text: '约瑟对他说：「……三根枝子就是三天；<br>三天之内，法老必提你出监，叫你官复原职……」', ref: '创世记 40:12–13', hold: 7.5 },
    { text: '膳长……就对约瑟说：「我在梦中见我头上顶着三筐白饼……<br>有飞鸟来吃我头上筐子里的食物。」', ref: '创世记 40:16–17', hold: 7.5 },
    { text: '到了第三天，是法老的生日……<br>使酒政官复原职，他仍将杯递在法老手中；把膳长挂起来，正如约瑟向他们所解的话。', ref: '创世记 40:20–22', hold: 9 },
    { text: '酒政却不记念约瑟，竟忘了他。', ref: '创世记 40:23', hold: 5.5 },
  ];
  const V8 = [
    { text: '过了两年，法老做梦，梦见自己站在河边，', ref: '创世记 41:1', hold: 5 },
    { text: '有七只母牛从河里上来，又美好又肥壮，在芦荻中吃草。', ref: '创世记 41:2', hold: 6 },
    { text: '随后又有七只母牛从河里上来，又丑陋又干瘦……<br>这又丑陋又干瘦的七只母牛吃尽了那又美好又肥壮的七只母牛。法老就醒了。', ref: '创世记 41:3–4', hold: 9 },
    { text: '他又睡着，第二回做梦，梦见一棵麦子长了七个穗子，又肥大又佳美，<br>随后又长了七个穗子，又细弱又被东风吹焦了。', ref: '创世记 41:5–6', hold: 8.5 },
    { text: '这细弱的穗子吞了那七个又肥大又饱满的穗子。法老醒了，不料是个梦。', ref: '创世记 41:7', hold: 6.5 },
    { text: '到了早晨，法老心里不安，就差人召了埃及所有的术士和博士来……<br>却没有人能给法老圆解。', ref: '创世记 41:8', hold: 7.5 },
    { text: '那时酒政对法老说：「我今日想起我的罪来……」', ref: '创世记 41:9', hold: 5 },
    { text: '法老遂即差人去召约瑟，他们便急忙带他出监，<br>他就剃头，刮脸，换衣裳，进到法老面前。', ref: '创世记 41:14', hold: 7.5 },
  ];
  const V9 = [
    { text: '法老对约瑟说：「我做了一梦，没有人能解，我听见人说，你听了梦就能解。」<br>约瑟回答法老说：「这不在乎我，神必将平安的话回答法老。」', ref: '创世记 41:15–16', hold: 9 },
    { text: '约瑟对法老说：「法老的梦乃是一个，神已将所要做的事指示法老了。」', ref: '创世记 41:25', hold: 6.5 },
    { text: '「埃及遍地必来七个大丰年；随后又要来七个荒年，<br>甚至在埃及地都忘了先前的丰收，全地必被饥荒所灭。」', ref: '创世记 41:29–30', hold: 8 },
    { text: '法老对臣仆说：「像这样的人，有神的灵在他里头，我们岂能找得着呢？」', ref: '创世记 41:38', hold: 6.5 },
    { text: '法老又对约瑟说：「我派你治理埃及全地。」<br>法老就摘下手上打印的戒指，戴在约瑟的手上，给他穿上细麻衣，把金链戴在他的颈项上；', ref: '创世记 41:41–42', hold: 9 },
    { text: '又叫约瑟坐他的副车，喝道的在前呼叫说：「跪下。」<br>这样，法老派他治理埃及全地。', ref: '创世记 41:43', hold: 7 },
  ];
  const V10 = [
    { text: '约瑟见埃及王法老的时候年三十岁。他从法老面前出去，遍行埃及全地。', ref: '创世记 41:46', hold: 6.5 },
    { text: '七个丰年之内，地的出产极丰极盛。约瑟聚敛埃及地七个丰年一切的粮食，<br>把粮食积存在各城里……', ref: '创世记 41:47–48', hold: 8 },
    { text: '约瑟积蓄五谷甚多，如同海边的沙，无法计算，因为谷不可胜数。', ref: '创世记 41:49', hold: 6.5 },
    { text: '荒年未到以前，安的祭司波提非拉的女儿亚西纳给约瑟生了两个儿子。<br>约瑟给他的长子起名叫玛拿西，因为他说：「神使我忘了一切的困苦和我父的全家。」', ref: '创世记 41:50–51', hold: 9.5 },
    { text: '他给次子起名叫以法莲，因为他说：「神使我在受苦的地方昌盛。」', ref: '创世记 41:52', hold: 6.5 },
  ];
  const V11 = [
    { text: '埃及地的七个丰年一完，七个荒年就来了，正如约瑟所说的。<br>各地都有饥荒，惟独埃及全地有粮食。', ref: '创世记 41:53–54', hold: 8 },
    { text: '当时饥荒遍满天下，约瑟开了各处的仓，粜粮给埃及人。在埃及地饥荒甚大。', ref: '创世记 41:56', hold: 7.5 },
    { text: '各地的人都往埃及去，到约瑟那里籴粮，因为天下的饥荒甚大。', ref: '创世记 41:57', hold: 6.5 },
    { text: '雅各见埃及有粮，就对儿子们说：「你们为什么彼此观望呢？」<br>又说：「我听见埃及有粮，你们可以下去，从那里为我们籴些来，使我们可以存活，不至于死。」', ref: '创世记 42:1–2', hold: 9.5 },
    { text: '于是，约瑟的十个哥哥都下埃及籴粮去了。<br>但约瑟的兄弟便雅悯，雅各没有打发他和哥哥们同去……', ref: '创世记 42:3–4', hold: 7.5 },
  ];
  const V12 = [
    { text: '当时治理埃及地的是约瑟，粜粮给那地众民的就是他。<br>约瑟的哥哥们来了，脸伏于地，向他下拜。', ref: '创世记 42:6', hold: 8 },
    { text: '约瑟认得他哥哥们，他们却不认得他。<br>约瑟想起从前所做的那两个梦，就对他们说：「你们是奸细，来窥探这地的虚实。」', ref: '创世记 42:8–9', hold: 8.5 },
    { text: '他们彼此说：「我们在兄弟身上实在有罪。他哀求我们的时候，我们见他心里的愁苦，<br>却不肯听，所以这场苦难临到我们身上。」', ref: '创世记 42:21', hold: 9 },
    { text: '约瑟转身退去，哭了一场，又回来对他们说话，<br>就从他们中间挑出西缅来，在他们眼前把他捆绑。', ref: '创世记 42:24', hold: 8 },
    { text: '约瑟吩咐人把粮食装满他们的器具，把各人的银子归还在各人的口袋里……', ref: '创世记 42:25', hold: 6.5 },
    { text: '他们的父亲雅各对他们说：「你们使我丧失我的儿子：约瑟没有了，西缅也没有了，<br>你们又要将便雅悯带去，这些事都归到我身上了。」', ref: '创世记 42:36', hold: 9 },
  ];
  const V13 = [
    { text: '那地的饥荒甚大。', ref: '创世记 43:1', hold: 4.5 },
    { text: '「但愿全能的神使你们在那人面前蒙怜悯，释放你们的那弟兄和便雅悯回来。<br>我若丧了儿子，就丧了吧！」', ref: '创世记 43:14', hold: 8.5 },
    { text: '于是，他们拿着那礼物，又手里加倍地带银子，并且带着便雅悯，<br>起身下到埃及，站在约瑟面前。', ref: '创世记 43:15', hold: 8 },
    { text: '约瑟举目看见他同母的兄弟便雅悯，就说：「你们向我所说那顶小的兄弟就是这位吗？」<br>又说：「小儿啊，愿神赐恩给你！」', ref: '创世记 43:29', hold: 9 },
    { text: '约瑟爱弟之情发动，就急忙寻找可哭之地，进入自己的屋里，哭了一场。', ref: '创世记 43:30', hold: 7 },
    { text: '……但便雅悯所得的比别人多五倍。他们就与约瑟一同宴饮，喝得舒畅。', ref: '创世记 43:34', hold: 7 },
  ];
  const V14 = [
    { text: '天一亮就打发那些人带着驴走了。', ref: '创世记 44:3', hold: 4.5 },
    { text: '家宰就搜查，从年长的起，到年幼的为止，那杯竟在便雅悯的口袋里搜出来。', ref: '创世记 44:12', hold: 7 },
    { text: '他们就撕裂衣服，各人把驮子抬在驴上，回城去了。', ref: '创世记 44:13', hold: 5.5 },
    { text: '犹大说：「我们对我主说什么呢？还有什么话可说呢？我们怎能自己表白出来呢？<br>神已经查出仆人的罪孽了……」', ref: '创世记 44:16', hold: 8.5 },
    { text: '「现在求你容仆人住下，替这童子作我主的奴仆，叫童子和他哥哥们一同上去。」', ref: '创世记 44:33', hold: 7.5 },
    { text: '「若童子不和我同去，我怎能上去见我父亲呢？恐怕我看见灾祸临到我父亲身上。」', ref: '创世记 44:34', hold: 7.5 },
  ];
  const V15 = [
    { text: '约瑟在左右站着的人面前情不自禁，吩咐一声说：「人都要离开我出去！」……<br>他就放声大哭，埃及人和法老家中的人都听见了。', ref: '创世记 45:1–2', hold: 9 },
    { text: '约瑟对他弟兄们说：「我是约瑟。我的父亲还在吗？」<br>他弟兄不能回答，因为在他面前都惊惶。', ref: '创世记 45:3', hold: 8 },
    { text: '约瑟又对他弟兄们说：「请你们近前来。」他们就近前来。<br>他说：「我是你们的兄弟约瑟，就是你们所卖到埃及的。」', ref: '创世记 45:4', hold: 8 },
    { text: '「现在，不要因为把我卖到这里自忧自恨，<br>这是神差我在你们以先来，为要保全生命。」', ref: '创世记 45:5', hold: 7.5 },
    { text: '「这样看来，差我到这里来的不是你们，乃是神。」', ref: '创世记 45:8', hold: 5.5 },
    { text: '于是约瑟伏在他兄弟便雅悯的颈项上哭，便雅悯也在他的颈项上哭。<br>他又与众弟兄亲嘴，抱着他们哭，随后他弟兄们就和他说话。', ref: '创世记 45:14–15', hold: 9 },
    { text: '……约瑟照着法老的吩咐给他们车辆和路上用的食物。', ref: '创世记 45:21', hold: 5.5 },
    { text: '告诉他说：「约瑟还在，并且作埃及全地的宰相。」雅各心里冰凉，因为不信他们……<br>他父亲雅各又看见约瑟打发来接他的车辆，心就苏醒了。', ref: '创世记 45:26–27', hold: 9 },
    { text: '以色列说：「罢了！罢了！我的儿子约瑟还在，趁我未死以先，我要去见他一面。」', ref: '创世记 45:28', hold: 7 },
  ];
  const V16 = [
    { text: '以色列带着一切所有的，起身来到别是巴，就献祭给他父亲以撒的神。', ref: '创世记 46:1', hold: 6.5 },
    { text: '夜间，神在异象中对以色列说：「雅各！雅各！」他说：「我在这里。」', ref: '创世记 46:2', hold: 6.5 },
    { text: '神说：「我是神，就是你父亲的神。你下埃及去不要害怕，<br>因为我必使你在那里成为大族。', ref: '创世记 46:3', hold: 8 },
    { text: '我要和你同下埃及去，也必定带你上来；约瑟必给你送终。」', ref: '创世记 46:4', hold: 6.5 },
    { text: '雅各就从别是巴起行；以色列的儿子们使他们的父亲雅各和他们的妻子、孩子都坐在法老为雅各送来的车上……<br>雅各和他的一切子孙都一同来了。', ref: '创世记 46:5–6', hold: 9.5 },
    { text: '……雅各家来到埃及的共有七十人。', ref: '创世记 46:27', hold: 5 },
    { text: '约瑟套车往歌珊去，迎接他父亲以色列，及至见了面，<br>就伏在父亲的颈项上，哭了许久。', ref: '创世记 46:29', hold: 8 },
    { text: '以色列对约瑟说：「我既得见你的面，知道你还在，就是死我也甘心。」', ref: '创世记 46:30', hold: 6.5 },
  ];
  const V17 = [
    { text: '约瑟领他父亲雅各进到法老面前，雅各就给法老祝福。', ref: '创世记 47:7', hold: 6 },
    { text: '雅各对法老说：「我寄居在世的年日是一百三十岁，我平生的年日又少又苦……」', ref: '创世记 47:9', hold: 7 },
    { text: '以色列人住在埃及的歌珊地。他们在那里置了产业，并且生育甚多。', ref: '创世记 47:27', hold: 7 },
    { text: '雅各住在埃及地十七年，雅各平生的年日是一百四十七岁。', ref: '创世记 47:28', hold: 6 },
    { text: '以色列年纪老迈，眼睛昏花，不能看见。<br>约瑟领他两个儿子到他跟前，他就和他们亲嘴，抱着他们。', ref: '创世记 48:10', hold: 8 },
    { text: '以色列伸出右手来，按在以法莲的头上——以法莲乃是次子，<br>又剪搭过左手来，按在玛拿西的头上——玛拿西原是长子。', ref: '创世记 48:14', hold: 8.5 },
    { text: '他就给约瑟祝福说：「愿我祖亚伯拉罕和我父以撒所事奉的神，就是一生牧养我直到今日的神，<br>救赎我脱离一切患难的那使者，赐福与这两个童子……」', ref: '创世记 48:15–16', hold: 10 },
    { text: '以色列又对约瑟说：「我要死了，但神必与你们同在，领你们回到你们列祖之地。」', ref: '创世记 48:21', hold: 7.5 },
  ];
  const V18 = [
    { text: '雅各叫了他的儿子们来，说：「你们都来聚集，我好把你们日后必遇的事告诉你们。<br>雅各的儿子们，你们要聚集而听，要听你们父亲以色列的话。」', ref: '创世记 49:1–2', hold: 9.5 },
    { text: '「圭必不离犹大，杖必不离他两脚之间……万民都必归顺。」', ref: '创世记 49:10', hold: 6.5 },
    { text: '「约瑟是多结果子的树枝，是泉旁多结果子的枝子；他的枝条探出墙外。」', ref: '创世记 49:22', hold: 7 },
    { text: '这一切是以色列的十二支派；这也是他们的父亲对他们所说的话，为他们所祝的福，<br>都是按着各人的福分为他们祝福。', ref: '创世记 49:28', hold: 9 },
    { text: '雅各嘱咐众子已毕，就把脚收在床上，气绝而死，归到他列祖那里去了。', ref: '创世记 49:33', hold: 7.5 },
    { text: '约瑟伏在他父亲的面上哀哭，与他亲嘴。', ref: '创世记 50:1', hold: 5.5 },
    { text: '薰尸的常例是四十天，那四十天就满了。埃及人为他哀哭了七十天。', ref: '创世记 50:3', hold: 6.5 },
    { text: '他的儿子们将他搬到迦南地，葬在幔利前、麦比拉田间的洞里……', ref: '创世记 50:13', hold: 7 },
  ];
  const V19 = [
    { text: '约瑟的哥哥们见父亲死了，就说：<br>「或者约瑟怀恨我们，照着我们从前待他一切的恶足足地报复我们。」', ref: '创世记 50:15', hold: 8 },
    { text: '……他们对约瑟说这话，约瑟就哭了。<br>他的哥哥们又来俯伏在他面前，说：「我们是你的仆人。」', ref: '创世记 50:17–18', hold: 8 },
    { text: '约瑟对他们说：「不要害怕，我岂能代替神呢？<br>从前你们的意思是要害我，但神的意思原是好的，要保全许多人的性命，成就今日的光景。', ref: '创世记 50:19–20', hold: 10 },
    { text: '现在你们不要害怕，我必养活你们和你们的妇人孩子。」<br>于是约瑟用亲爱的话安慰他们。', ref: '创世记 50:21', hold: 7.5 },
    { text: '约瑟和他父亲的眷属都住在埃及。约瑟活了一百一十岁。<br>约瑟得见以法莲第三代的孩子。玛拿西的孙子、玛吉的儿子也养在约瑟的膝上。', ref: '创世记 50:22–23', hold: 9.5 },
  ];
  const V20 = [
    { text: '约瑟对他弟兄们说：「我要死了，但神必定看顾你们，领你们从这地上去……」<br>约瑟叫以色列的子孙起誓，说：「……你们要把我的骸骨从这里搬上去。」', ref: '创世记 50:24–25', hold: 8.5 },
    { text: '约瑟死了，正一百一十岁。人用香料将他薰了，<br>把他收殓在棺材里，停在埃及。', ref: '创世记 50:26', hold: 6.5 },
  ];

  // 一整个昼夜（dur 秒）：时辰走到次日的同一刻
  function passDay(b, dur) {
    const t0 = U.fract(W.cycling ? W.clockTo : W.clock);
    W.goTo(t0 < 0.5 ? t0 + 0.5 : t0 - 0.5, dur * 0.5, b.instant);
    W.goTo(t0, dur, b.instant);
  }
  // 丰年的收成：田里的粮如光点飞入仓中
  function harvestFX() {
    const g = getP('gran');
    if (!g) return;
    const s = LS(2), gx = g.x * W.w, gy = gY(2, g.x) - 16 * s;
    for (const id of FIELDS) {
      const p = getP(id);
      if (!p) continue;
      const tg = [];
      for (let k = 0; k < 9; k++) tg.push([gx + rand(-26, 30) * s, gy + rand(-6, 6) * s, 1.3]);
      fx().sow(p.x * W.w, fieldY(p.x, 0.25), tg, [255, 220, 140], { pass: 'near', dur: 1.9, stagger: 0.9 });
    }
  }
  const fromOf = b => (b.instant ? 'none' : 'fade');
  const KIDS = [['gk1', 0.716, '以法莲的子孙', 'm'], ['gk2', 0.745, '以法莲的子孙', 'f'], ['gk3', 0.724, '玛吉的儿子', 'm'], ['gk4', 0.752, '玛吉的儿子', 'f']];

  const STAGES = [
    // ── 1 · 约瑟做了一梦（37:5–8）────────────────────────────
    {
      kind: 'act', utter: '约瑟做了一梦', cmd: 'dream --seed 禾捆  # 我的捆起来站着', ref: '37:5',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.94, 5, b.instant);
            walk('joseph', 0.846, { speed: 0.02, pose: 'lie' });
            walk('jacob', X.tentJ - 0.012, { speed: 0.016, pose: 'sit' });
            walk('benjamin', X.tentJ + 0.013, { speed: 0.02, pose: 'sit' });
            bros((id, i) => pose(id, i % 3 ? 'sit' : 'lie'));
            crowdPose('flockC', 'lie');
            sfx(b, 'harp');
          }],
          [3, b => { W.set('jsDream', 1, b.instant); fxAdd(b, { type: 'sheaves', dur: 14.5, xf: X.dream }); }],
          [15, b => { W.set('jsDream', 0, b.instant); W.goTo(0.29, 5, b.instant); }],
          [17, () => { pose('joseph', 'stand'); walk('joseph', 0.772, { speed: 0.03 }); crowdPose('flockC', 'graze'); }],
          [L[2] + 2, () => { bros(id => pose(id, 'stand')); faceAll(BROS, 1); pose('joseph', 'point'); }],
          [L[2] + 5.5, () => { pose('joseph', 'stand'); faceAll(BROS, -1); }],
          [L[2] + 8.5, () => walk('joseph', 0.852, { speed: 0.022 })],
        ]);
      },
    },

    // ── 2 · 梦见太阳、月亮与十一个星（37:9–11）─────────────────
    {
      kind: 'act', utter: '梦见太阳、月亮与十一个星', cmd: 'render 日 月 十一星 --pose 下拜  # 父亲把这话存在心里', ref: '37:9', tint: [226, 230, 255],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.96, 5, b.instant);
            walk('joseph', 0.846, { speed: 0.025, pose: 'lie' });
            bros((id, i) => pose(id, i % 2 ? 'sit' : 'lie'));
            crowdPose('flockC', 'lie');
            sfx(b, 'harp');
          }],
          [1.5, b => { W.set('jsDream', 1, b.instant); fxAdd(b, { type: 'heavens', dur: 13, id: 'joseph' }); }],
          [11.5, b => { W.set('jsDream', 0, b.instant); W.goTo(0.3, 5, b.instant); }],
          [13.5, () => {
            pose('joseph', 'stand'); walk('joseph', X.jacob - 0.022, { speed: 0.03 });
            pose('jacob', 'stand'); walk('jacob', X.jacob, { speed: 0.02 });
            bros(id => pose(id, 'stand')); spread(BROS, 0.745, 0.835, { speed: 0.03, seed: 3 });
            crowdPose('flockC', 'graze');
          }],
          [L[1] + 4, () => { face('joseph', 1); face('jacob', -1); pose('jacob', 'point'); faceAll(BROS, 1); }],
          [L[1] + 8, () => pose('jacob', 'stand')],
          [L[2], b => { spread(BROS, 0.645, 0.75, { speed: 0.025, seed: 5 }); mote(b, 'joseph', 'jacob', [255, 230, 170], 3.5); }],
          [L[2] + 3.5, () => { glow('jacob', 0.6); walk('jacob', X.tentJ - 0.012, { speed: 0.015, pose: 'sit' }); }],
          [L[2] + 6, () => face('jacob', -1)],
        ]);
      },
    },

    // ── 3 · 要救他脱离他们的手（37:12–24）─────────────────────
    {
      kind: 'act', utter: '要救他脱离他们的手', cmd: 'guard 约瑟 --by 流便  # 不可流他的血', ref: '37:21',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.42, 4, b.instant);
            prop('pit', 'pit', { x: X.pit, label: '坑' });
            spread(BROS, 0.5, 0.585, { speed: 0.03, seed: 7 });
            crowdWalk('flockC', 0.44, 0.56, { speed: 0.028 });
          }],
          [3, () => { pose('jacob', 'stand'); walk('joseph', X.jacob - 0.02, { speed: 0.03 }); }],
          [6, () => { face('jacob', -1); pose('jacob', 'point'); }],
          [L[1], () => { pose('jacob', 'stand'); walk('joseph', 0.664, { speed: 0.024 }); }],
          [L[2], () => { faceAll(BROS, 1); poseAll(['levi', 'simeon'], 'point'); }],
          [L[3], () => { poseAll(['levi', 'simeon'], 'stand'); poseAll(['dan', 'gad'], 'point'); }],
          [L[3] + 3, () => walk('joseph', 0.628, { speed: 0.02 })],
          [L[4], () => { poseAll(['dan', 'gad'], 'stand'); walk('reuben', 0.612, { speed: 0.03, pose: 'raise' }); }],
          [L[4] + 1.5, () => face('reuben', -1)],
          [L[4] + 6, () => pose('reuben', 'stand')],
          [L[5], b => {
            hold('joseph', null);
            prop('coat', 'cloth', { variant: 'coat', x: 0.636, label: '彩衣' });
            if (!b.instant) { const p = figPt('joseph', 0.5); if (p) fx().sparkle(p[0], p[1], 18, [255, 226, 170], 8, 'near'); }
            walk('simeon', 0.62, { speed: 0.03 }); walk('levi', 0.645, { speed: 0.03 });
          }],
          [L[5] + 3, () => walk('joseph', X.pit + 0.004, { speed: 0.02 })],
          [L[5] + 5, b => { rm('joseph'); prop('pit', null, { lit: 1 }); sfx(b, 'thud'); }],
          [L[5] + 7, () => { walk('reuben', 0.47, { speed: 0.022, pose: 'sit' }); walk('simeon', 0.556, { speed: 0.025 }); walk('levi', 0.568, { speed: 0.025 }); }],
        ]);
      },
    },

    // ── 4 · 他们就把约瑟带到埃及去了（37:25–29）──────────────
    {
      kind: 'act', utter: '他们就把约瑟带到埃及去了', cmd: 'export 约瑟 --to 埃及 --price "二十舍客勒"', ref: '37:28',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => { W.goTo(0.56, 6, b.instant); bros(id => { if (id !== 'reuben') pose(id, 'sit'); }); }],
          [2, b => {
            const f = fromOf(b);
            add('tr1', { label: '以实玛利人', x: 1.02, facing: -1, robe: ROBE.trader, accent: [206, 186, 150], glow: 0.08, from: f });
            animal('cam1', 'camel', 1.05, { facing: -1, from: f, label: '骆驼' });
            animal('cam2', 'camel', 1.09, { facing: -1, from: f, follow: 'cam1', dx: 0.034, label: '骆驼' });
            animal('cam3', 'camel', 1.13, { facing: -1, from: f, follow: 'cam2', dx: 0.034, label: '骆驼' });
            add('tr2', { label: '以实玛利人', x: 1.16, facing: -1, robe: ROBE.trader2, accent: [180, 150, 110], glow: 0.08, from: f });
            follow('tr2', 'cam3', 0.024);
            walk('tr1', 0.686, { speed: 0.028 }); walk('cam1', 0.706, { speed: 0.028 });
            sfx(b, 'camel');
          }],
          [L[1], () => { pose('judah', 'stand'); face('judah', 1); pose('judah', 'point'); }],
          [L[1] + 4, () => pose('judah', 'stand')],
          [L[2], b => {
            add('joseph', { label: '约瑟', sex: 'm', age: 'adult', scale: 0.92, x: X.pit + 0.004, facing: 1, robe: ROBE.joseph, glow: 0.42, prop: null, from: fromOf(b) });
            prop('pit', null, { lit: 0 });
            bros(id => { if (id !== 'reuben') pose(id, 'stand'); });
            walk('judah', 0.672, { speed: 0.03 });
          }],
          [L[2] + 3, b => { fxAdd(b, { type: 'coins', dur: 3, a: 'tr1', b: 'judah' }); sfx(b, 'coins'); }],
          [L[2] + 4, () => walk('joseph', 0.694, { speed: 0.03 })],
          [L[2] + 7.5, () => {
            walk('tr1', 0.3, { speed: 0.036 }); follow('joseph', 'tr1', 0.016);
            walk('cam1', 0.334, { speed: 0.036 });
            walk('judah', 0.6, { speed: 0.025 });
          }],
          [L[3], () => walk('reuben', X.pit + 0.013, { speed: 0.03, pose: 'weep' })],
          [L[2] + 19, () => { ['tr1', 'tr2', 'cam1', 'cam2', 'cam3', 'joseph'].forEach(id => rm(id)); }],
        ]);
      },
    },

    // ── 5 · 约瑟被带下埃及去（37:31–39:1）────────────────────
    {
      kind: 'act', utter: '约瑟被带下埃及去', cmd: 'deploy 约瑟 --env 埃及  # 护卫长波提乏', ref: '39:1',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.7, 8, b.instant);
            prop('coat', null, { stain: 1 });
            unprop('pit');
            pose('reuben', 'stand');
            spread(BROS, 0.775, 0.855, { speed: 0.032, seed: 11 });
            crowdWalk('flockC', 0.8, 0.95, { speed: 0.03 });
            sfx(b, 'bleat');
          }],
          [3, () => unprop('coat')],
          [L[1], () => {
            prop('coat2', 'cloth', { variant: 'coat', x: X.jacob - 0.02, stain: 1, label: '染了血的彩衣' });
            pose('jacob', 'stand'); walk('jacob', X.jacob, { speed: 0.02 });
            walk('judah', X.jacob - 0.034, { speed: 0.02 });
          }],
          [L[1] + 2.5, b => { face('jacob', -1); pose('jacob', 'weep'); sfx(b, 'weep'); }],
          [L[2], b => {
            add('jacob', { robe: ROBE.sack });
            pose('jacob', 'sit', { weep: true });
            walk('benjamin', X.jacob + 0.014, { speed: 0.02, pose: 'kneel' });
            spread(['dan', 'naphtali', 'gad', 'asher'], 0.855, 0.872, { speed: 0.02, pose: 'kneel', seed: 2 });
            W.goTo(0.95, 9, b.instant);
          }],
          [L[3], () => walk('judah', 1.03, { speed: 0.035 })],
          [L[3] + 2, b => {
            // 一夜之间：左边的地化作埃及
            W.set('jsEgypt', 1, b.instant); W.set('jsNile', 1, b.instant);
            landLevels(b, { grass: 0.3, herbs: 0.26, trees: 0.28, clouds: 0.22, bare: 0.2, bloom: 0.6 });
            egyptProps();
            unprop('coat2');
          }],
          [L[3] + 5.5, () => walk('judah', 0.846, { speed: 0.03 })],
          [L[4] - 3, b => W.goTo(0.3, 6, b.instant)],
          [L[4], b => {
            const f = fromOf(b);
            add('tr1', { label: '以实玛利人', x: 0.37, facing: 1, robe: ROBE.trader, accent: [206, 186, 150], glow: 0.08, from: f });
            add('joseph', { label: '约瑟', sex: 'm', age: 'adult', scale: 0.94, x: 0.355, facing: 1, robe: ROBE.slave, glow: 0.42, prop: null, from: f });
            animal('cam1', 'camel', 0.33, { facing: 1, from: f, label: '骆驼' });
            animal('cam2', 'camel', 0.3, { facing: 1, from: f, follow: 'cam1', dx: 0.034, label: '骆驼' });
            animal('cam3', 'camel', 0.27, { facing: 1, from: f, follow: 'cam2', dx: 0.034, label: '骆驼' });
            add('tr2', { label: '以实玛利人', x: 0.25, facing: 1, robe: ROBE.trader2, accent: [180, 150, 110], glow: 0.08, from: f });
            follow('tr2', 'cam3', 0.022);
            follow('joseph', 'tr1', 0.016);
            walk('tr1', 0.588, { speed: 0.032 }); walk('cam1', 0.552, { speed: 0.032 });
            add('potiphar', { label: '波提乏', sex: 'm', age: 'adult', x: X.potiphar + 0.02, facing: -1, robe: ROBE.potiphar, accent: [176, 72, 52], glow: 0.12, from: f });
          }],
          [L[4] + 7.5, b => {
            unfollow('joseph'); walk('joseph', X.potiphar - 0.004, { speed: 0.02 });
            fxAdd(b, { type: 'coins', dur: 3, a: 'potiphar', b: 'tr1' });
          }],
          [L[4] + 10, () => {
            ['cam2', 'cam3', 'tr2'].forEach(unfollow);
            walk('tr2', 0.27, { speed: 0.034 }); walk('cam3', 0.295, { speed: 0.034 }); walk('cam2', 0.325, { speed: 0.034 });
            walk('cam1', 0.355, { speed: 0.034 }); walk('tr1', 0.38, { speed: 0.034 });
            face('joseph', 1);
          }],
          [L[4] + 19, () => { ['tr1', 'tr2', 'cam1', 'cam2', 'cam3'].forEach(id => rm(id)); }],
        ]);
      },
    },

    // ── 6 · 耶和华与他同在，他就百事顺利（39:2–20）─────────────
    {
      kind: 'act', utter: '耶和华与他同在，他就百事顺利', cmd: 'with (耶和华) { 约瑟.run() }  # 百事顺利', ref: '39:2', tint: [255, 232, 180],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.42, 4, b.instant);
            W.set('jsWith', 1, b.instant);
            const f = fig('joseph'); if (f) beam(b, f.nx, { dur: 7, w: 60 });
            sfx(b, 'harp');
          }],
          [L[1], b => {
            add('joseph', { robe: [216, 206, 182] });
            crowd('servP', { n: 4, x0: X.potiphar - 0.045, x1: X.potiphar + 0.05, layer: 2, label: '仆人', robe: ROBE.linen, from: fromOf(b), mill: true });
            pose('potiphar', 'point');
            walk('joseph', X.potiphar - 0.028, { speed: 0.02 });
          }],
          [L[1] + 3, () => pose('potiphar', 'stand')],
          [L[2], b => {
            prop('fieldP', 'field', { x: X.potiphar - 0.012, size: 0.75, grow: 1, gold: 0.65, label: '田' });
            prop('potiphar', null, { lit: 0.25 });
            if (!b.instant) { const p = figPt('joseph', 0.5); if (p) fx().ring(p[0], p[1], [255, 232, 180], M() * 0.35, 2.4, 2); }
            crowdPose('servP', 'carry');
          }],
          [L[3], b => {
            W.goTo(0.74, 6, b.instant);
            add('pwife', { label: '波提乏的妻', sex: 'f', age: 'adult', x: X.potiphar + 0.012, facing: -1, robe: ROBE.wife, accent: [224, 194, 126], glow: 0.08, from: fromOf(b) });
            walk('potiphar', 0.565, { speed: 0.02 });
            crowdPose('servP', 'stand');
          }],
          [L[3] + 3.5, () => face('joseph', -1)],
          [L[4], b => {
            prop('garment', 'cloth', { x: X.potiphar - 0.01, label: '约瑟的衣裳' });
            add('joseph', { robe: ROBE.slave });
            run('joseph', 0.564, {});
            pose('pwife', 'point');
          }],
          [L[5], b => {
            W.goTo(0.93, 8, b.instant);
            walk('potiphar', X.potiphar - 0.022, { speed: 0.025, pose: 'point' });
            prop('prison', 'prison', { x: X.prison, grow: 1, label: '监' });
          }],
          [L[5] + 2.5, () => { walk('joseph', X.prison + 0.012, { speed: 0.025 }); rm('pwife'); unprop('garment'); }],
          [L[5] + 5, () => prop('prison', null, { open: 1 })],
          [L[5] + 7.5, b => { rm('joseph'); prop('prison', null, { lit: 1, open: 0 }); pose('potiphar', 'stand'); sfx(b, 'gate'); }],
        ]);
      },
    },

    // ── 7 · 耶和华与约瑟同在，向他施恩（39:21–40:23）───────────
    {
      kind: 'act', utter: '耶和华与约瑟同在，向他施恩', cmd: 'sudo -u 司狱 chown -R 约瑟 监  # 向他施恩', ref: '39:21', tint: [255, 232, 180],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.36, 5, b.instant);
            prop('prison', null, { lit: 1, open: 1 });
            beam(b, X.prison, { dur: 7, w: 64 });
            add('keeper', { label: '司狱', sex: 'm', age: 'adult', x: X.prison + 0.034, facing: -1, robe: ROBE.keeper, glow: 0.1, from: fromOf(b) });
            crowd('prisoners', { n: 3, x0: X.prison - 0.034, x1: X.prison + 0.012, layer: 2, label: '囚犯', robe: [98, 86, 74], pose: 'sit', from: fromOf(b), mill: false });
          }],
          [2.5, b => {
            add('joseph', { label: '约瑟', sex: 'm', age: 'adult', scale: 0.94, x: X.prison + 0.012, facing: -1, robe: ROBE.slave, glow: 0.42, prop: null, from: fromOf(b) });
            walk('joseph', X.prison - 0.004, { speed: 0.015 });
          }],
          [5, () => pose('keeper', 'bow')],
          [L[1], () => { pose('keeper', 'stand'); pose('joseph', 'point'); }],
          [L[1] + 3, () => { pose('joseph', 'stand'); prop('prison', null, { open: 0 }); }],
          [L[2], b => {
            add('cupbearer', { label: '酒政', sex: 'm', age: 'adult', x: X.palace + 0.03, facing: 1, robe: ROBE.cup, glow: 0.14, from: fromOf(b) });
            add('baker', { label: '膳长', sex: 'm', age: 'adult', x: X.palace + 0.044, facing: 1, robe: ROBE.baker, glow: 0.14, from: fromOf(b) });
            walk('cupbearer', X.prison - 0.03, { speed: 0.025 }); walk('baker', X.prison - 0.019, { speed: 0.025 });
          }],
          [L[2] + 6, b => { W.goTo(0.96, 4, b.instant); poseAll(['cupbearer', 'baker', 'joseph'], 'lie'); crowdPose('prisoners', 'lie'); }],
          [L[3] + 2, b => W.goTo(0.3, 5, b.instant)],
          [L[3] + 4, () => { poseAll(['cupbearer', 'baker'], 'sit'); pose('joseph', 'stand'); face('joseph', -1); crowdPose('prisoners', 'sit'); }],
          [L[4] - 1, b => { W.set('jsDream', 0.55, b.instant); fxAdd(b, { type: 'vine', dur: 16 }); sfx(b, 'harp'); }],
          [L[5], b => { mote(b, 'joseph', 'cupbearer', [255, 226, 160], 3); pose('joseph', 'raise'); }],
          [L[5] + 3.5, () => pose('joseph', 'stand')],
          [L[6] - 1, b => { fxAdd(b, { type: 'baskets', dur: 11.5 }); face('joseph', 1); }],
          [L[7] - 1, b => { W.set('jsDream', 0, b.instant); W.goTo(0.46, 4, b.instant); }],
          [L[7], () => {
            prop('palace', null, { lit: 1 });
            pose('cupbearer', 'stand'); walk('cupbearer', X.palace + 0.028, { speed: 0.03 });
            pose('baker', 'stand'); walk('baker', 0.52, { speed: 0.022 }); glow('baker', 0.02);
          }],
          [L[7] + 6.5, () => rm('baker')],
          [L[8], b => { W.goTo(0.74, 7, b.instant); prop('palace', null, { lit: 0 }); walk('joseph', X.prison - 0.012, { speed: 0.015, pose: 'sit' }); }],
          [L[8] + 2, () => face('joseph', -1)],
        ]);
      },
    },

    // ── 8 · 有七只母牛从河里上来（41:1–14）───────────────────
    {
      kind: 'act', utter: '有七只母牛从河里上来', cmd: 'dream --pharaoh 7×肥牛 7×瘦牛 7×好穗 7×细穗', ref: '41:2', tint: [255, 224, 170],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.97, 4, b.instant);
            add('pharaoh', { label: '法老', sex: 'm', age: 'adult', x: X.throne, facing: -1, robe: ROBE.pharaoh, accent: GOLD, glow: 0.2, pose: 'lie', from: fromOf(b) });
            pose('joseph', 'lie'); crowdPose('prisoners', 'lie'); pose('keeper', 'sit');
          }],
          [2, b => { W.set('jsDream', 1, b.instant); fxAdd(b, { type: 'cows', dur: 23 }); sfx(b, 'harp'); }],
          [21.5, () => pose('pharaoh', 'sit')],
          [24.5, () => pose('pharaoh', 'lie')],
          [25.5, b => fxAdd(b, { type: 'ears', dur: 19 })],
          [L[5] - 1, b => { W.set('jsDream', 0, b.instant); W.goTo(0.33, 5, b.instant); }],
          [L[5] + 1, b => {
            pose('pharaoh', 'stand');
            prop('throne', 'throne', { x: X.throne, label: '法老的宝座' });
            crowd('magi', { n: 5, x0: X.palace - 0.036, x1: X.palace + 0.004, layer: 2, label: '术士与博士', robe: [66, 60, 86], from: fromOf(b), mill: false });
            pose('joseph', 'sit'); crowdPose('prisoners', 'sit'); pose('keeper', 'stand');
          }],
          [L[5] + 3, () => { pose('pharaoh', 'seat'); crowdFace('magi', 1); }],
          [L[5] + 6, () => crowdPose('magi', 'bow')],
          [L[6], () => { walk('cupbearer', X.throne - 0.02, { speed: 0.02, pose: 'bow' }); }],
          [L[6] + 3, () => { face('cupbearer', 1); pose('cupbearer', 'point'); }],
          [L[7], () => { prop('prison', null, { open: 1 }); pose('joseph', 'stand'); walk('keeper', X.prison + 0.022, { speed: 0.02 }); }],
          [L[7] + 1.5, b => {
            add('joseph', { robe: ROBE.linen, accent: [228, 218, 198] });
            if (!b.instant) { const p = figPt('joseph', 0.5); if (p) fx().sparkle(p[0], p[1], 22, [255, 240, 210], 10, 'near'); }
            walk('joseph', X.throne + 0.026, { speed: 0.026 });
            pose('cupbearer', 'stand'); walk('cupbearer', X.palace - 0.012, { speed: 0.02 });
          }],
          [L[7] + 4, () => { uncrowd('magi'); prop('prison', null, { open: 0 }); }],
          [L[7] + 7, () => { face('joseph', -1); face('pharaoh', 1); }],
        ]);
      },
    },

    // ── 9 · 神已将所要做的事指示法老了（41:15–45）───────────────
    {
      kind: 'act', utter: '神已将所要做的事指示法老了', cmd: 'explain 梦 --by 神  # 这不在乎我', ref: '41:25', tint: [255, 234, 186],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.44, 4, b.instant);
            crowd('court', { n: 5, x0: X.palace - 0.042, x1: X.palace - 0.006, layer: 2, label: '法老的臣仆', robe: ROBE.linen, from: fromOf(b), mill: false });
            crowdFace('court', 1);
          }],
          [3, () => pose('joseph', 'gaze')],
          [7, () => pose('joseph', 'stand')],
          [L[1], b => { pose('joseph', 'raise'); const f = fig('joseph'); if (f) beam(b, f.nx, { dur: 8, w: 56, white: true }); sfx(b, 'harp'); }],
          [L[1] + 4, () => pose('joseph', 'point')],
          [L[2] - 1, b => fxAdd(b, { type: 'years', dur: 13 })],
          [L[2] + 4, () => pose('joseph', 'stand')],
          [L[3], () => pose('pharaoh', 'stand')],
          [L[3] + 1.5, () => { pose('pharaoh', 'point'); crowdPose('court', 'bow'); }],
          [L[4], b => {
            pose('pharaoh', 'stand');
            add('joseph', { robe: ROBE.linen, accent: GOLD, glow: 0.55 });
            glint(b, 'joseph', [255, 226, 150]);
            if (!b.instant) { const p = figPt('joseph', 0.6); if (p) fx().ring(p[0], p[1], [255, 226, 160], M() * 0.3, 2.2, 2); }
          }],
          [L[5] - 3, b => {
            crowd('people', { n: 8, x0: 0.635, x1: 0.735, layer: 2, label: '埃及人', robe: [228, 218, 198], from: fromOf(b), mill: false });
            prop('chariot', 'chariot', { x: X.throne + 0.05, spd: 0.028, label: '副车' });
          }],
          [L[5], () => walk('joseph', X.throne + 0.047, { speed: 0.02 })],
          [L[5] + 1.5, () => { onChariot('joseph', 'chariot'); prop('chariot', null, { tx: 0.718 }); pose('pharaoh', 'seat'); crowdPose('court', 'stand'); }],
          [L[5] + 2.5, b => { crowdPose('people', 'kneel'); sfx(b, 'crowd'); }],
        ]);
      },
    },

    // ── 10 · 七个丰年之内，地的出产极丰极盛（41:46–52）──────────
    {
      kind: 'act', utter: '七个丰年之内，地的出产极丰极盛', cmd: 'for (年 of 七个丰年) 仓.push(五谷)  # 不可胜数', ref: '41:47', tint: [255, 222, 140],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        const beats = [
          [0, b => {
            W.goTo(0.4, 4, b.instant);
            onChariot('joseph', null); place('joseph', 0.712); pose('joseph', 'stand');
            unprop('chariot');
            crowdPose('people', 'stand');
            unprop('potiphar'); unprop('prison'); unprop('fieldP');
            rm('potiphar'); rm('keeper'); rm('cupbearer'); uncrowd('prisoners'); uncrowd('servP'); uncrowd('court');
          }],
          [1.5, () => walk('joseph', 0.662, { speed: 0.025 })],
          [2, () => {
            prop('fieldW', 'field', { x: 0.405, size: 0.72, grow: 1, gold: 0, label: '田' });
            prop('fieldE1', 'field', { x: 0.585, size: 0.9, grow: 1, gold: 0, label: '田' });
            prop('fieldE2', 'field', { x: 0.672, size: 0.85, grow: 1, gold: 0, label: '田' });
            prop('gran', 'granary', { x: X.gran, grow: 1, label: '仓城' });
          }],
        ];
        for (let i = 0; i < 7; i++) {
          const t0 = 5.5 + i * 4.6;
          beats.push([t0, () => fields({ gold: 1 })]);
          beats.push([t0 + 2.7, b => {
            fields({ gold: 0.12 });
            prop('gran', null, { fill: (i + 1) / 7 });
            if (!b.instant) harvestFX();
            crowdWalk('people', i % 2 ? 0.6 : 0.64, i % 2 ? 0.665 : 0.735, { speed: 0.03, pose: i % 2 ? 'stand' : 'carry' });
            sfx(b, 'build');
          }]);
        }
        beats.push([5.5 + 7 * 4.6, () => fields({ gold: 0.55 })]);
        beats.push([L[3] - 3, b => {
          prop('jhouse', 'house', { x: X.jhouse, flip: -1, grow: 1, label: '约瑟的家' });
          add('asenath', { label: '亚西纳', sex: 'f', age: 'adult', x: X.jhouse + 0.012, facing: -1, robe: ROBE.asenath, accent: GOLD, glow: 0.3, from: fromOf(b) });
          walk('joseph', X.jhouse - 0.008, { speed: 0.025 });
        }]);
        beats.push([L[3] + 1, b => { carry('asenath', 'baby'); nameOver(b, 'asenath', '玛拿西', [255, 226, 176], srcAround('asenath', 50), { size: 0.036 }); }]);
        beats.push([L[4], b => {
          carry('asenath', null);
          add('manasseh', { label: '玛拿西', sex: 'm', age: 'child', x: X.jhouse + 0.026, facing: -1, robe: [226, 214, 190], glow: 0.25, from: fromOf(b) });
        }]);
        beats.push([L[4] + 1, b => { carry('asenath', 'baby'); nameOver(b, 'asenath', '以法莲', [214, 236, 176], srcAround('asenath', 50), { size: 0.036 }); }]);
        T(c, beats);
      },
    },

    // ── 11 · 七个荒年就来了（41:53–42:5）─────────────────────
    {
      kind: 'act', utter: '七个荒年就来了', cmd: 'while (荒年 < 7) 仓.open()  # 天下的人都来籴粮', ref: '41:54', tint: [236, 206, 150],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.5, 4, b.instant);
            W.set('jsFamine', 1, b.instant); W.set('jsNile', 0.7, b.instant);
            landLevels(b, { grass: 0.16, herbs: 0.04, trees: 0.14, clouds: 0.08, bare: 1, bloom: 0 });
            fields({ dry: 1, gold: 0 });
            fxAdd(b, { type: 'dust', dur: 14 });
            sfx(b, 'wind');
            carry('asenath', null);
            add('ephraim', { label: '以法莲', sex: 'm', age: 'child', x: X.jhouse + 0.036, facing: -1, robe: [214, 204, 176], glow: 0.25, from: fromOf(b) });
            add('benjamin', { age: 'adult', scale: 0.95 });
            crowdPose('people', 'stand');
          }],
          [3, () => { prop('dais', 'dais', { x: X.seat, label: '约瑟的座' }); walk('joseph', X.seat, { speed: 0.025 }); }],
          [5.5, () => { onDais(true); face('joseph', 1); }],
          [L[1], b => {
            prop('gran', null, { open: 1 });
            if (!b.instant) { const g = getP('gran'); if (g) fx().ring(g.x * W.w, gY(2, g.x) - 12 * LS(2), [255, 220, 150], M() * 0.3, 2.2, 2); }
            crowdWalk('people', 0.585, 0.64, { speed: 0.03, pose: 'carry' });
          }],
          [L[2], b => {
            crowd('hungry', { n: 9, x0: 0.92, x1: 1.04, layer: 2, label: '籴粮的人', from: fromOf(b), mill: false });
            crowdWalk('hungry', 0.668, 0.76, { speed: 0.03 });
            sfx(b, 'crowd');
          }],
          [L[3], () => {
            add('jacob', { robe: ROBE.jacob });
            pose('jacob', 'stand'); walk('jacob', X.jacob, { speed: 0.015 });
            spread(BROS, 0.8, 0.866, { speed: 0.02, seed: 13 });
          }],
          [L[3] + 3.5, () => { face('jacob', -1); pose('jacob', 'point'); faceAll(BROS, 1); }],
          [L[4], b => {
            pose('jacob', 'stand');
            const f = fromOf(b);
            animal('don1', 'donkey', 0.86, { facing: -1, from: f, pack: false, label: '驴' });
            animal('don2', 'donkey', 0.875, { facing: -1, from: f, pack: false, label: '驴' });
            animal('don3', 'donkey', 0.89, { facing: -1, from: f, pack: false, label: '驴' });
            follow('don1', 'judah', 0.02); follow('don2', 'levi', 0.02); follow('don3', 'zebulun', 0.02);
            spread(BROS, 0.765, 0.84, { speed: 0.022, seed: 17 });
            walk('benjamin', X.jacob + 0.014, { speed: 0.02 });
          }],
        ]);
      },
    },

    // ── 12 · 约瑟想起从前所做的那两个梦（42:6–38）──────────────
    {
      kind: 'act', utter: '约瑟想起从前所做的那两个梦', cmd: 'diff 梦 现实  # 脸伏于地，向他下拜', ref: '42:9', tint: [255, 226, 176],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, () => { crowdWalk('hungry', 0.46, 0.58, { speed: 0.03 }); spread(BROS, 0.664, 0.742, { speed: 0.03, seed: 19 }); }],
          [2.5, () => uncrowd('hungry')],
          [5, b => {
            faceAll(BROS, -1); poseAll(BROS, 'fall');
            fxAdd(b, { type: 'sheaves', ghost: true, dur: 9, xf: 0.7, cy: 0.66, h: 30 });
            sfx(b, 'harp');
          }],
          [L[1], b => fxAdd(b, { type: 'heavens', ghost: true, dur: 9, id: 'joseph' })],
          [L[1] + 3, () => { pose('joseph', 'point'); poseAll(BROS, 'kneel'); }],
          [L[1] + 6, () => pose('joseph', 'stand')],
          [L[2], () => BROS.forEach((id, i) => { face(id, i % 2 ? 1 : -1); if (i % 3 === 1) pose(id, 'bow'); })],
          [L[3], () => { onDais(false); walk('joseph', 0.616, { speed: 0.03, pose: 'weep' }); }],
          [L[3] + 5, () => walk('joseph', X.seat, { speed: 0.03 })],
          [L[3] + 7.5, () => { onDais(true); face('joseph', 1); faceAll(BROS, -1); poseAll(BROS, 'stand'); }],
          [L[3] + 9, () => { walk('simeon', 0.598, { speed: 0.02, pose: 'kneel' }); glow('simeon', 0.04); }],
          [L[3] + 12, () => face('simeon', 1)],
          [L[4], b => {
            ['don1', 'don2', 'don3'].forEach(id => animal(id, 'donkey', null, { pack: true }));
            glint(b, 'don1', [236, 242, 255]);
          }],
          [L[4] + 3, () => spread(noSimeon(), 0.82, 0.87, { speed: 0.03, seed: 23 })],
          [L[5], () => { pose('jacob', 'sit', { weep: true }); walk('benjamin', X.jacob + 0.012, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 13 · 但愿全能的神使你们在那人面前蒙怜悯（43）───────────
    {
      kind: 'bless', utter: '但愿全能的神使你们在那人面前蒙怜悯', cmd: 'retry 下埃及 --with 便雅悯  # 愿神赐恩给你', ref: '43:14', tint: [255, 236, 196],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, () => { pose('jacob', 'stand'); face('jacob', -1); }],
          [L[1], b => { pose('jacob', 'raise'); const f = fig('jacob'); if (f) beam(b, f.nx, { dur: 7, w: 54 }); sfx(b, 'harp'); }],
          [L[1] + 5, () => pose('jacob', 'stand')],
          [L[2], b => {
            walk('benjamin', 0.714, { speed: 0.034 });
            spread(noSimeon(), 0.724, 0.79, { speed: 0.032, seed: 29 });
            onDais(false); walk('joseph', X.jhouse - 0.02, { speed: 0.025 });
            add('steward', { label: '家宰', sex: 'm', age: 'adult', x: X.jhouse + 0.008, facing: 1, robe: ROBE.steward, glow: 0.1, from: fromOf(b) });
          }],
          [L[2] + 6, () => { glow('simeon', 0.16); pose('simeon', 'stand'); walk('simeon', 0.728, { speed: 0.03 }); }],
          [L[3], () => walk('joseph', 0.7, { speed: 0.02 })],
          [L[3] + 2, b => { face('joseph', 1); pose('joseph', 'raise'); mote(b, 'joseph', 'benjamin', [255, 232, 180], 2.8); }],
          [L[3] + 6, () => pose('joseph', 'stand')],
          [L[4], () => walk('joseph', 0.676, { speed: 0.035, pose: 'weep' })],
          [L[4] + 5.5, () => walk('joseph', 0.699, { speed: 0.03 })],
          [L[5], b => {
            W.goTo(0.77, 6, b.instant);
            prop('jhouse', null, { lit: 1 });
            spread(['benjamin'].concat(BROS), 0.712, 0.795, { speed: 0.03, pose: 'sit', seed: 31 });
            pose('joseph', 'sit');
            sfx(b, 'harp');
          }],
          [L[5] + 2.5, b => { face('joseph', 1); mote(b, 'joseph', 'benjamin', [255, 226, 150], 2.5); }],
          [L[5] + 4, b => glint(b, 'benjamin', [255, 226, 150])],
        ]);
      },
    },

    // ── 14 · 神已经查出仆人的罪孽了（44）──────────────────────
    {
      kind: 'act', utter: '神已经查出仆人的罪孽了', cmd: 'grep 银杯 便雅悯的口袋  # 犹大愿替他为奴', ref: '44:16',
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            W.goTo(0.29, 4, b.instant);
            prop('jhouse', null, { lit: 0 });
            pose('joseph', 'stand');
            ['don1', 'don2', 'don3'].forEach(id => animal(id, 'donkey', null, { pack: true }));
            follow('don2', 'benjamin', 0.02);
            glint(b, 'don2', [236, 242, 255]);
            poseAll(eleven(), 'stand');
            spread(eleven(), 0.79, 0.86, { speed: 0.03, seed: 37 });
          }],
          [3.5, () => run('steward', 0.78, {})],
          [L[1], () => { poseAll(eleven(), 'stand'); faceAll(eleven(), -1); }],
          [L[1] + 1.5, () => walk('steward', 0.845, { speed: 0.018 })],
          [L[1] + 5, b => {
            glint(b, 'benjamin', [236, 242, 255]);
            if (!b.instant) { W.flash = 0.25; const p = figPt('benjamin', 0.5); if (p) fx().ring(p[0], p[1], [226, 234, 255], M() * 0.25, 2, 2); }
          }],
          [L[2], b => { poseAll(eleven(), 'weep'); sfx(b, 'weep'); }],
          [L[2] + 3, () => { spread(eleven(), 0.716, 0.79, { speed: 0.034, seed: 41 }); walk('steward', X.jhouse + 0.008, { speed: 0.03 }); }],
          [L[3], () => { walk('joseph', 0.698, { speed: 0.02 }); poseAll(eleven(), 'fall'); }],
          [L[3] + 2, () => face('joseph', 1)],
          [L[4], () => { walk('judah', 0.708, { speed: 0.02, pose: 'kneel' }); glow('judah', 0.35); }],
          [L[4] + 1.5, () => face('judah', -1)],
          [L[5], () => pose('judah', 'pray')],
        ]);
      },
    },

    // ── 15 · 神差我在你们以先来（45）─────────────────────────
    {
      kind: 'act', utter: '神差我在你们以先来', cmd: 'reveal 约瑟  # 我是约瑟。我的父亲还在吗？', ref: '45:7', tint: [255, 230, 186],
      verse: V15,
      apply(c) {
        const L = starts(V15);
        T(c, [
          [0, () => { walk('steward', 0.6, { speed: 0.03 }); crowdWalk('people', 0.5, 0.6, { speed: 0.03 }); pose('judah', 'kneel'); }],
          [1.5, b => { pose('joseph', 'weep'); sfx(b, 'weep'); }],
          [4, () => { rm('steward'); uncrowd('people'); }],
          [L[1], b => {
            pose('joseph', 'stand');
            nameOver(b, 'joseph', '约瑟', [255, 230, 180], () => [rand(0.35, 1) * W.w, rand(0.05, 0.95) * W.h], { size: 0.06, hold: 3.2, lift: 1.2 });
            if (!b.instant) { const p = figPt('joseph', 0.6); if (p) fx().ring(p[0], p[1], [255, 232, 190], M() * 0.45, 2.6, 2.4); W.flash = 0.2; }
            poseAll(eleven(), 'kneel');
          }],
          [L[1] + 3, () => eleven().forEach((id, i) => { const f = fig(id); if (f && i % 2) walk(id, f.nx + 0.008, { speed: 0.03, pose: 'kneel' }); })],
          [L[2], () => pose('joseph', 'raise')],
          [L[2] + 2, () => { poseAll(eleven(), 'stand'); spread(eleven(), 0.716, 0.77, { speed: 0.02, seed: 43 }); pose('joseph', 'stand'); }],
          [L[3], b => { const f = fig('joseph'); if (f) beam(b, f.nx, { dur: 9, w: 70 }); sfx(b, 'harp'); }],
          [L[5], () => embrace('joseph', 'benjamin', { weep: true })],
          [L[5] + 5, () => eleven().forEach(id => { if (id !== 'benjamin') pose(id, 'weep'); })],
          [L[5] + 9, () => { poseAll(eleven(), 'stand'); pose('joseph', 'stand'); }],
          [L[6], b => {
            const f = fromOf(b);
            animal('ox1', 'ox', 0.742, { facing: 1, from: f, label: '牛' });
            animal('wagon1', 'wagon', 0.712, { facing: 1, from: f, follow: 'ox1', dx: 0.03, label: '车' });
            animal('ox2', 'ox', 0.692, { facing: 1, from: f, label: '牛' });
            animal('wagon2', 'wagon', 0.662, { facing: 1, from: f, follow: 'ox2', dx: 0.03, label: '车' });
          }],
          [L[6] + 3, () => {
            spread(eleven(), 0.815, 0.87, { speed: 0.03, seed: 47 });
            walk('ox1', 0.965, { speed: 0.03 }); walk('ox2', 0.93, { speed: 0.03 });
            walk('joseph', X.jhouse - 0.01, { speed: 0.02 });
          }],
          [L[7], () => { faceAll(eleven(), 1); pose('jacob', 'sit'); face('jacob', -1); }],
          [L[7] + 5, b => { pose('jacob', 'stand'); glow('jacob', 0.6); if (!b.instant) { const p = figPt('jacob', 0.5); if (p) fx().ring(p[0], p[1], [255, 236, 200], M() * 0.3, 2.2, 2); } }],
          [L[8], () => pose('jacob', 'raise')],
          [L[8] + 5, () => pose('jacob', 'stand')],
        ]);
      },
    },

    // ── 16 · 我要和你同下埃及去（46）── 神的话 ─────────────────
    {
      kind: 'promise', utter: '我要和你同下埃及去', cmd: 'mv 以色列家 埃及/歌珊 --count 70  # 也必定带你上来', ref: '46:4', tint: [255, 240, 206],
      verse: V16,
      apply(c) {
        const L = starts(V16);
        T(c, [
          [0, b => {
            W.goTo(0.76, 6, b.instant);
            crowd('house', { n: 12, x0: 0.9, x1: 0.99, layer: 2, label: '雅各的家眷', from: fromOf(b), mill: false });
            crowdWalk('house', 0.865, 0.96, { speed: 0.02 });
            prop('altar', 'altar', { x: X.beersheba, grow: 1, label: '别是巴的坛' });
            walk('jacob', X.beersheba + 0.014, { speed: 0.018, pose: 'kneel' });
            walk('benjamin', X.beersheba + 0.032, { speed: 0.02 });
          }],
          [4, () => prop('altar', null, { fire: 1 })],
          [L[1], b => {
            W.goTo(0.97, 5, b.instant);
            pose('jacob', 'pray');
            crowdPose('house', 'sit'); bros(id => pose(id, 'sit')); pose('benjamin', 'sit');
          }],
          [L[1] + 2, () => {
            // 夜里：牛调过头来，车朝着埃及
            ['wagon1', 'wagon2'].forEach(unfollow);
            place('ox1', 0.905); place('wagon1', 0.935); place('ox2', 0.87); place('wagon2', 0.9);
            ['ox1', 'wagon1', 'ox2', 'wagon2'].forEach(id => face(id, -1));
            follow('wagon1', 'ox1', 0.03); follow('wagon2', 'ox2', 0.03);
          }],
          [L[1] + 3, b => { beam(b, X.beersheba + 0.014, { dur: 20, w: 80, white: true, k: 1.1 }); W.set('jsDream', 0.4, b.instant); sfx(b, 'harp'); }],
          [L[3], b => { if (!b.instant) { const p = figPt('jacob', 0.5); if (p) fx().ring(p[0], p[1], [255, 240, 210], M() * 0.5, 2.8, 2); } }],
          [L[4] - 3, b => { W.set('jsDream', 0, b.instant); W.goTo(0.3, 5, b.instant); prop('altar', null, { fire: 0.15 }); }],
          [L[4] - 1, () => { pose('jacob', 'stand'); walk('jacob', 0.93, { speed: 0.04 }); }],
          [L[4] + 1.5, () => ride('jacob', 'wagon1')],
          [L[4] + 2, () => {
            walk('ox1', 0.765, { speed: 0.022 }); walk('ox2', 0.735, { speed: 0.022 });
            crowdPose('house', 'stand'); crowdWalk('house', 0.74, 0.805, { speed: 0.022 });
            spread(eleven(), 0.745, 0.8, { speed: 0.022, seed: 53 });
            crowdWalk('flockC', 0.735, 0.79, { speed: 0.022 });
          }],
          [L[5], b => fxAdd(b, { type: 'seventy', dur: 8, x0: 0.72, x1: 0.81 })],
          [L[6], () => {
            prop('chariot2', 'chariot', { x: X.jhouse - 0.01, spd: 0.03, label: '车' });
            onChariot('joseph', 'chariot2');
            prop('chariot2', null, { tx: 0.724 });
          }],
          [L[6] + 2.5, () => { ride('jacob', null); walk('jacob', 0.752, { speed: 0.018 }); }],
          [L[6] + 3.5, () => { onChariot('joseph', null); place('joseph', 0.73); embrace('joseph', 'jacob', { weep: true }); }],
          [L[7], () => { pose('joseph', 'stand'); pose('jacob', 'raise'); }],
          [L[7] + 4.5, () => pose('jacob', 'stand')],
        ]);
      },
    },

    // ── 17 · 一生牧养我直到今日的神（47–48）────────────────────
    {
      kind: 'bless', utter: '一生牧养我直到今日的神', cmd: 'bless 以法莲 玛拿西 --cross-hands  # 右手按在次子的头上', ref: '48:15', tint: [255, 234, 200],
      verse: V17,
      apply(c) {
        const L = starts(V17);
        T(c, [
          [0, b => {
            W.goTo(0.42, 4, b.instant);
            unprop('chariot2'); unprop('altar');
            pose('jacob', 'stand'); pose('joseph', 'stand');
            walk('jacob', X.throne + 0.026, { speed: 0.03 }); walk('joseph', X.throne + 0.042, { speed: 0.03 });
            pose('pharaoh', 'seat'); face('pharaoh', 1);
          }],
          [5.5, b => {
            face('jacob', -1); pose('jacob', 'raise');
            if (!b.instant) { const p = figPt('pharaoh', 0.6); if (p) fx().ring(p[0], p[1], [255, 236, 200], M() * 0.25, 2, 2); }
          }],
          [L[1] + 2, () => pose('jacob', 'stand')],
          [L[2], b => {
            walk('jacob', X.bed + 0.02, { speed: 0.03 }); walk('joseph', X.jhouse - 0.004, { speed: 0.03 });
            W.set('jsGoshen', 1, b.instant); W.set('jsFamine', 0, b.instant); W.set('jsNile', 1, b.instant);
            landLevels(b, { grass: 0.3, herbs: 0.26, trees: 0.3, clouds: 0.3, bare: 0.2, bloom: 0.75 });
            fields({ dry: 0, gold: 0.5 });
            prop('tentG1', 'tent', { x: X.tentG1, size: 0.88, label: '以色列人的帐棚' });
            prop('tentG2', 'tent', { x: X.tentG2, size: 0.8, label: '以色列人的帐棚' });
            crowdWalk('house', 0.77, 0.815, { speed: 0.02 });
            crowdWalk('flockC', 0.765, 0.81, { speed: 0.02 });
            spread(eleven(), 0.772, 0.82, { speed: 0.02, seed: 59, pose: 'sit' });
          }],
          [L[2] + 3, b => {
            crowd('house2', { n: 9, x0: 0.775, x1: 0.83, layer: 2, label: '以色列人', from: fromOf(b) }); sfx(b, 'bleat');
            ['ox1', 'ox2', 'wagon1', 'wagon2', 'don1', 'don2', 'don3'].forEach(id => rm(id));
          }],
          [L[3], b => { passDay(b, 6); prop('bed', 'bed', { x: X.bed, label: '雅各的床' }); }],
          [L[3] + 3, () => walk('jacob', X.bed, { speed: 0.02 })],
          [L[3] + 4.5, () => { onBed('jacob', true); pose('jacob', 'sit'); face('jacob', -1); }],
          [L[4], () => {
            add('manasseh', { age: 'adult', scale: 0.86 }); add('ephraim', { age: 'adult', scale: 0.84 });
            walk('joseph', X.bed - 0.036, { speed: 0.025 });
            walk('manasseh', X.bed - 0.022, { speed: 0.025 }); walk('ephraim', X.bed - 0.013, { speed: 0.025 });
          }],
          [L[4] + 4, b => {
            face('manasseh', 1); face('ephraim', 1);
            if (!b.instant) { const p = figPt('jacob', 0.5); if (p) fx().ring(p[0], p[1], [255, 236, 206], M() * 0.2, 2, 2); }
          }],
          [L[5], b => {
            pose('jacob', 'pray');
            mote(b, 'jacob', 'ephraim', [255, 222, 140], 2.6); mote(b, 'jacob', 'manasseh', [230, 236, 255], 3.2);
          }],
          [L[5] + 3, b => {
            if (!b.instant) {
              const e = figPt('ephraim', 1.05), m = figPt('manasseh', 1.05);
              if (e) fx().ring(e[0], e[1], [255, 226, 150], M() * 0.12, 2, 2);
              if (m) fx().ring(m[0], m[1], [226, 232, 255], M() * 0.09, 2, 1.5);
            }
            glow('ephraim', 0.45); glow('manasseh', 0.38);
          }],
          [L[6], b => { beam(b, X.bed, { dur: 9, w: 60 }); sfx(b, 'harp'); }],
          [L[7], () => { pose('jacob', 'sit'); }],
          [L[7] + 1, () => { face('jacob', 1); pose('jacob', 'point'); }],
          [L[7] + 5.5, () => { pose('jacob', 'sit'); face('jacob', -1); }],
        ]);
      },
    },

    // ── 18 · 这一切是以色列的十二支派（49–50:14）───────────────
    {
      kind: 'bless', utter: '这一切是以色列的十二支派', cmd: 'fork 以色列 --into 十二支派  # 按着各人的福分', ref: '49:28', tint: [236, 232, 255],
      verse: V18,
      apply(c) {
        const L = starts(V18);
        const POS = { reuben: 0.704, simeon: 0.712, levi: 0.72, judah: 0.728, dan: 0.736, naphtali: 0.776, gad: 0.784, asher: 0.792, issachar: 0.8, zebulun: 0.808, joseph: 0.743, benjamin: 0.769 };
        T(c, [
          [0, b => {
            W.goTo(0.74, 7, b.instant);
            pose('jacob', 'sit');
            walk('manasseh', 0.69, { speed: 0.02 }); walk('ephraim', 0.682, { speed: 0.02 });
            SONS12.forEach(id => { pose(id, 'stand'); walk(id, POS[id], { speed: 0.025 }); });
            crowdWalk('house', 0.815, 0.86, { speed: 0.02 }); crowdWalk('house2', 0.82, 0.87, { speed: 0.02 });
          }],
          [6, () => SONS12.forEach(id => face(id, POS[id] < X.bed ? 1 : -1))],
          [L[1], b => { mote(b, 'jacob', 'judah', [255, 214, 120], 3); }],
          [L[1] + 3, b => glint(b, 'judah', [255, 220, 140])],
          [L[2], b => mote(b, 'jacob', 'joseph', [196, 236, 150], 3)],
          [L[3], b => { fxAdd(b, { type: 'rise', dur: 8, ids: SONS12.slice() }); sfx(b, 'harp'); SONS12.forEach(id => glow(id, 0.3)); }],
          [L[3] + 4.5, b => W.set('jsTribes', 1, b.instant)],
          [L[4], () => { pose('jacob', 'lie'); glow('jacob', 0.05); }],
          [L[4] + 2, b => { soul(b, 'jacob', 6); W.goTo(0.96, 7, b.instant); }],
          [L[5], b => {
            walk('joseph', X.bed - 0.012, { speed: 0.02 });
            pose('joseph', 'kneel', { weep: true });
            SONS12.forEach(id => { if (id !== 'joseph') pose(id, 'bow'); });
            sfx(b, 'weep');
          }],
          [L[6], b => {
            W.goTo(0.4, 6, b.instant);
            crowd('mourners', { n: 6, x0: 0.62, x1: 0.69, layer: 2, label: '哀哭的埃及人', robe: ROBE.linen, pose: 'bow', from: fromOf(b), mill: false });
            crowdFace('mourners', 1);
          }],
          [L[7], () => {
            onBed('jacob', false); rm('jacob');
            prop('bier', 'bier', { x: X.bed, spd: 0.026, label: '雅各' });
            unprop('bed');
            SONS12.forEach(id => pose(id, 'stand'));
          }],
          [L[7] + 2, () => {
            prop('bier', null, { tx: X.cave - 0.03 });
            SONS12.forEach((id, i) => walk(id, lerp(0.9, 0.95, i / 11), { speed: 0.024 }));
            prop('cave', null, { lit: 1 });
          }],
          [L[7] + 11, b => { unprop('bier'); prop('cave', null, { seal: 1 }); sfx(b, 'seal'); }],
          [L[7] + 14, () => {
            prop('cave', null, { lit: 0 });
            SONS12.forEach((id, i) => walk(id, lerp(0.705, 0.8, i / 11), { speed: 0.03 }));
            uncrowd('mourners');
          }],
        ]);
      },
    },

    // ── 19 · 神的意思原是好的（50:15–23）──────────────────────
    {
      kind: 'act', utter: '神的意思原是好的', cmd: 'rebase 恶 --onto 好  # 要保全许多人的性命', ref: '50:20', tint: [255, 226, 160],
      verse: V19,
      apply(c) {
        const L = starts(V19);
        T(c, [
          [0, b => { W.goTo(0.56, 5, b.instant); walk('joseph', 0.703, { speed: 0.025 }); spread(eleven(), 0.724, 0.79, { speed: 0.025, seed: 61 }); }],
          [5.5, () => { faceAll(eleven(), -1); face('joseph', 1); }],
          [L[1], b => { pose('joseph', 'weep'); sfx(b, 'weep'); }],
          [L[1] + 3, b => { poseAll(eleven(), 'fall'); fxAdd(b, { type: 'heavens', ghost: true, dur: 9, id: 'joseph' }); }],
          [L[2], () => pose('joseph', 'stand')],
          [L[2] + 3, b => { pose('joseph', 'raise'); fxAdd(b, { type: 'grace', dur: 11, id: 'joseph' }); W.goTo(0.64, 9, b.instant); sfx(b, 'harp'); }],
          [L[2] + 7, () => { pose('joseph', 'stand'); poseAll(eleven(), 'kneel'); }],
          [L[3], () => { poseAll(eleven(), 'stand'); walk('joseph', 0.714, { speed: 0.02 }); }],
          [L[3] + 2, () => embrace('joseph', 'reuben', {})],
          [L[3] + 6.5, () => { pose('joseph', 'stand'); pose('reuben', 'stand'); }],
          [L[4], b => {
            passDay(b, 6);
            ['joseph', 'benjamin', 'manasseh', 'ephraim'].concat(BROS).forEach(id => { if (fig(id)) add(id, { age: 'elder' }); });
            add('asenath', { age: 'elder' });
          }],
          [L[4] + 3, b => {
            walk('joseph', 0.732, { speed: 0.02, pose: 'sit' });
            KIDS.forEach(([id, x, label, sex], i) => add(id, { label, sex, age: 'child', x, facing: x < 0.732 ? 1 : -1, robe: [206 - i * 8, 178 + i * 4, 140], glow: 0.2, v: 0.12 + 0.08 * i, from: fromOf(b) }));
          }],
          [L[4] + 6, () => { carry('joseph', 'baby'); face('joseph', 1); }],
        ]);
      },
    },

    // ── 20 · 神必定看顾你们（50:24–26）── 全书的最后一句 ──────────
    {
      kind: 'promise', utter: '神必定看顾你们', cmd: 'await 神.看顾(以色列)  # 停在埃及，等候', ref: '50:24', tint: [255, 238, 206], hold: 2.6,
      verse: V20,
      apply(c) {
        const L = starts(V20);
        T(c, [
          [0, b => {
            carry('joseph', null); pose('joseph', 'stand'); face('joseph', 1);
            W.goTo(0.72, 11, b.instant);
            spread(eleven(), 0.764, 0.812, { speed: 0.02, seed: 67 });
            KIDS.forEach(([id], i) => walk(id, 0.698 + i * 0.006, { speed: 0.02 }));
            crowdWalk('house', 0.815, 0.855, { speed: 0.02 }); crowdWalk('house2', 0.825, 0.875, { speed: 0.02 });
          }],
          [1.2, b => { pose('joseph', 'point'); W.set('jsPromise', 1, b.instant); sfx(b, 'harp'); }],
          [4, () => { poseAll(eleven(), 'raise'); KIDS.forEach(k => face(k[0], 1)); }],
          [7, () => { poseAll(eleven(), 'stand'); pose('joseph', 'stand'); }],
          [L[1], b => { pose('joseph', 'lie'); W.set('jsWith', 0, b.instant); }],
          [L[1] + 1.2, b => { const p = figPt('joseph', 0.3); if (p) fxAdd(b, { type: 'soul', dur: 4.5, x0: p[0] / W.w, y0: p[1] / W.h, up: 0.06 }); }],
          [L[1] + 2.6, () => {
            rm('joseph');
            prop('coffin', 'coffin', { x: X.coffin, size: 1.2, lit: 1, label: '约瑟的棺材' });
            poseAll(eleven(), 'bow'); crowdPose('house', 'bow'); crowdPose('house2', 'bow');
            KIDS.forEach(k => pose(k[0], 'bow'));
            ['manasseh', 'ephraim', 'asenath'].forEach(id => pose(id, 'bow'));
          }],
          [L[1] + 4.5, b => W.goTo(0.778, 14, b.instant)],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, title: '约瑟', sub: '创世记 37:1 — 50:26', tint: [255, 222, 164], outro: 18,
    intro: INTRO,
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._joseph = { get S() { return S; }, P, X, FXL, TRIBE };
})(window.GS);
