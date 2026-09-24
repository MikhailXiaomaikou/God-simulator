/* ─────────────────────────────────────────────────────────────
 * book/glory.js —— 四福音 · 登山变像（马太福音 16 — 21 · 路加福音 18 — 19 · 马可福音 12）
 *
 * 同一片地：左边是海（加利利海），东方（左）日出；近地是加利利北边的山地，
 * 其后是往耶路撒冷去的路、耶利哥、橄榄山与耶路撒冷——近地的右边渐渐换成一座山城。
 *
 * 凯撒利亚‧腓立比：一块大磐石，石下一个幽暗的洞口；「你们说我是谁？」——人的猜测在天上化成淡淡的名字又散去；
 *   彼得跪下：「你是基督，是永生神的儿子」——一道光自上而下落在耶稣身上（父指示的）。
 *   「我要把我的教会建造在这磐石上」——磐石里透出金光，洞口的阴影退去；光沿着地流向远山，一处一处点亮。
 * ★ 登山变像（签名之景）：过了六天，黄昏，耶稣带着彼得、雅各、约翰上了高山（近地右边的大山）；
 *   他的衣裳洁白如光，满身光芒；摩西、以利亚如光的人显现在他左右。夜里，一朵光明的云彩降下遮盖他们，
 *   天上一道光柱——「这是我的爱子，我所喜悦的。你们要听他！」——门徒俯伏在地。
 *   「起来，不要害怕！」云彩升去，只见耶稣；黎明时他们下山。
 * 迦百农的黄昏：彼得问「到七次可以吗？」——七盏小光；「乃是到七十个七次」——四百九十盏光散满全地和天空。
 * 早晨，有人抱着婴孩、领着小孩子来，门徒拦阻；「让小孩子到我这里来」——孩子们跑到他跟前，满了暖光。
 * 早晨将尽，一个少年人牵着驮满财物的骆驼来，跪在耶稣面前问永生（太 19:16）；
 * 正午：「可去变卖你所有的，分给穷人」——天上显出一簇金光（财宝在天上）；他忧忧愁愁地牵着骆驼走出画面，天上的光淡下去；
 *   「骆驼穿过针的眼，比财主进神的国还容易呢」；「在神凡事都能」。
 * 午后：「看哪，我们上耶路撒冷去」——北方的高山和磐石退入远处，远远的中丘上现出耶路撒冷，殿在日光里闪亮。
 * 耶利哥：棕树、平顶的房屋、路旁一棵大桑树；身量矮小的撒该跑到前头爬上桑树；「撒该，快下来！」——
 *   他急忙下来，欢欢喜喜地领耶稣回家。黄昏在撒该家里：他把一半给穷人（几道金光流向穷人）；
 *   「今天救恩到了这家」——他的家满了光。
 * 夜过去，早晨在橄榄山：门徒牵来驴和驴驹；「看哪，你的王来到你这里」——耶稣骑着驴驹，众人把衣服和树枝铺在路上，
 *   手里举着树枝喊「和散那」，一路到城门。
 * 圣殿的院：兑换银钱的桌子、卖鸽子的凳子；桌凳被推倒，钱散落，鸽子飞上天；「我的殿必称为祷告的殿」；
 *   瞎子看见（衣袍恢复颜色），瘸子站起来。
 * ★ 黄昏：银库前，财主投下许多钱；一个穷寡妇投下两个小钱——两点小小的光升起来，亮过一切；殿院的灯点亮。
 *   本幕在耶路撒冷的黄昏里落幕。
 *
 * 父从不画出形像：只有从天上来的光、光明的云彩与声音（经文）。人都没有面目；耶稣以 GS.cast.LOOK.jesus 为样子，
 * 只在山上变像时衣裳洁白、发光，其后复原。一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'glory';
  const isCur = () => GS.book.current(ACT);
  const sm = (a, b, x) => U.smoothstep(a, b, x);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    glRock: ['exp', 0.5],       // 凯撒利亚‧腓立比的磐石（1 在 → 0 退去）
    glRockLit: ['exp', 0.45],   // 磐石里透出的光（16:18）
    glGrotto: ['exp', 0.35],    // 洞口的阴影（阴间的权柄）
    glChurch: ['lin', 0.13],    // 光自磐石流向远方（0 → 1）
    glChurchA: ['exp', 0.4],    // 远方点亮的光的显隐
    glReveal: ['exp', 0.7],     // 父指示的光：自上而下落在耶稣身上（16:17）
    glMount: ['exp', 0.4],      // 高山（1 在 → 0 退去）
    glTrans: ['exp', 0.55],     // 变像的光（17:2）
    glCloud: ['exp', 0.4],      // 光明的云彩（17:5）
    glVoice: ['exp', 0.6],      // 从天上来的光柱
    glSeven: ['exp', 0.8],      // 七盏光（18:21）
    glSeventy: ['lin', 0.12],   // 七十个七次：光散开（0 → 1）
    glSevenA: ['exp', 0.45],    // 四百九十盏光的显隐
    glKids: ['exp', 0.6],       // 祝福小孩子的暖光
    glTreasure: ['exp', 0.5],   // 天上的财宝（19:21）
    glFar: ['exp', 0.35],       // 远处的耶路撒冷（中丘）
    glJericho: ['exp', 0.55],   // 耶利哥：棕树、房屋、桑树
    glClimb: ['exp', 0.9],      // 撒该在树上（0 地上 → 1 枝上）
    glHouse: ['exp', 0.5],      // 撒该的家（0.35 灯 → 1 满了光）
    glCity: ['exp', 0.5],       // 耶路撒冷（近地）
    glWall: ['exp', 0.6],       // 城墙与城门（1）→ 殿院（0）
    glCourt: ['exp', 0.6],      // 殿院：铺石、柱廊
    glCloaks: ['lin', 0.075],   // 铺在路上的衣服与树枝（0 → 1 沿路铺开）
    glBranches: ['exp', 0.8],   // 众人手中的树枝
    glTables: ['exp', 0.6],     // 桌子、凳子、鸽笼的显隐
    glTumble: ['lin', 0.9],     // 推倒（0 立 → 1 倒）
    glChest: ['exp', 0.6],      // 银库
    glMites: ['exp', 0.3],      // 两个小钱的光（12:42）
    glLamps: ['exp', 0.5],      // 殿院的灯
    glRoad: ['exp', 0.5],       // 上耶路撒冷去的路
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有几处）────────────────────
  const LAYL = {
    rock: 0.47,
    m0: 0.652, ms: 0.82, m1: 1.06, mH: 0.4,
    j1: 0.565, p1: 0.615, ja1: 0.648, jn1: 0.682, c10: 0.628, c11: 0.745,
    moU: -0.19, elU: 0.19, peU: -0.3, jaU: -0.62, jnU: -0.46, peO: 0, jaO: 0.34, jnO: 0.14,
    foot0: 0.585, foot1: 0.69,
    j5: 0.655, p5: 0.618, ja5: 0.59, jn5: 0.69, c50: 0.51, c51: 0.6,
    kid0: 0.36, kid1: 0.44, kidA: 0.515, kidB: 0.59, mom0: 0.455, mom1: 0.51,
    j7: 0.625, rich: 0.725, poor1: 0.488, poor2: 0.515, treas: [0.7, 0.2],
    j9: 0.61, p9: 0.563, ja9: 0.54, jn9: 0.585, c90: 0.43, c91: 0.52,
    far0: 0.775, farT: 0.9,
    syc: 0.752, zh: 0.9, palms: [0.535, 0.605, 0.965], mpalms: [0.66, 0.79, 0.93], houses: [0.628, 0.672],
    jer0: 0.63, jer1: 0.86, zac0: 0.668, j10: 0.728, j11: 0.855, z11: 0.815, pb1: 0.735, pb2: 0.762,
    olives: [0.425, 0.478, 0.54], road0: 0.445, gate: 0.7, hill0: 0.655, temple: 0.885,
    colt0: 0.475, ho0: 0.515, ho1: 0.68,
    tables: [0.765, 0.835, 0.9], bench: 0.96, j13: 0.79, blind: 0.715, lame: 0.738,
    chest: 0.815, j14: 0.69, lamps: [0.722, 0.866, 0.968], widow0: 0.96,
  };
  const LAYP = {
    rock: 0.425,
    m0: 0.545, ms: 0.76, m1: 1.06, mH: 0.25,
    j1: 0.52, p1: 0.585, ja1: 0.625, jn1: 0.665, c10: 0.6, c11: 0.8,
    moU: -0.2, elU: 0.2, peU: -0.3, jaU: -0.74, jnU: -0.52, peO: 0, jaO: 0.55, jnO: 0.22,
    foot0: 0.52, foot1: 0.62,
    j5: 0.63, p5: 0.585, ja5: 0.545, jn5: 0.675, c50: 0.43, c51: 0.53,
    kid0: 0.3, kid1: 0.38, kidA: 0.47, kidB: 0.575, mom0: 0.38, mom1: 0.45,
    j7: 0.62, rich: 0.74, poor1: 0.43, poor2: 0.475, treas: [0.66, 0.42],
    j9: 0.6, p9: 0.54, ja9: 0.505, jn9: 0.565, c90: 0.39, c91: 0.485,
    far0: 0.72, farT: 0.87,
    syc: 0.745, zh: 0.9, palms: [0.46, 0.57, 0.985], mpalms: [0.63, 0.78, 0.94], houses: [0.6, 0.655],
    jer0: 0.58, jer1: 0.9, zac0: 0.63, j10: 0.708, j11: 0.84, z11: 0.78, pb1: 0.68, pb2: 0.71,
    olives: [0.4, 0.465, 0.53], road0: 0.49, gate: 0.655, hill0: 0.615, temple: 0.865,
    colt0: 0.52, ho0: 0.545, ho1: 0.74,
    tables: [0.73, 0.82, 0.905], bench: 0.965, j13: 0.76, blind: 0.68, lame: 0.705,
    chest: 0.8, j14: 0.655, lamps: [0.69, 0.86, 0.975], widow0: 0.97,
  };
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];

  // ── 小工具 ──────────────────────────────────────────────────
  const LK = [1.1, 1.2, 1.3];
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.55 : 1) * (LK[l] || 1);    // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const gB = (l, xf) => { const y = W.ridgeBaseY(l, xf * W.w); return isFinite(y) ? y : gY(l, xf); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fieldH(2, g) * 0.8; };
  const lit = c => [Math.min(255, c[0] * 1.2 + 22), Math.min(255, c[1] * 1.17 + 18), Math.min(255, c[2] * 1.12 + 14)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const mix = (a, b, t) => U.mixRGB(a, b, clamp(t, 0, 1));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const UN = () => Math.max(0.5, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const say = (b, lines) => { if (!b.instant && GS.ui) U.safe('gl.narrate', () => GS.ui.narrate(lines, { replace: false })); };
  function sfx(b, name, o) {
    if ((b && b.instant) || W.replaying) return;
    const a = au();
    if (a && a.sfx) U.safe('gl.sfx', () => a.sfx(name, o || {}));
  }
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };
  const nn = k => (tall() ? Math.max(2, Math.round(k * 0.6)) : k);
  void say;

  // ── 人物（皆经人物模块）────────────────────────────────────
  const C = () => cast();
  const LOOK = id => ((GS.cast && GS.cast.LOOK && GS.cast.LOOK[id]) || {});
  const DROBES = () => ((GS.cast && GS.cast.DISCIPLE_ROBES) || [[122, 104, 84], [104, 92, 80], [138, 116, 92], [96, 104, 118], [132, 98, 82], [112, 118, 96], [146, 128, 104], [100, 88, 96], [126, 110, 120], [140, 104, 88], [108, 100, 86]]);
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : (o && o.from) || 'fade' }, o, W.replaying ? { from: 'none' } : {})); }
  const walk = (id, x, o) => { if (has(id)) C().walk(id, x, o); };
  const pose = (id, p, o) => { if (has(id)) C().pose(id, p, o); };
  const face = (id, d) => { if (has(id)) C().face(id, d); };
  const place = (id, x) => { if (has(id)) C().place(id, x); };
  const rm = (id, now) => { if (has(id)) C().remove(id, now ? { fade: false } : undefined); };
  const glow = (id, v) => { if (has(id)) C().glow(id, v); };
  const attach = (id, fn) => { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); };
  const ride = (id, m) => { const c = C(); if (c.ride && fig(id)) c.ride(id, m); };
  const follow = (id, o, dx) => { const c = C(); if (c.follow && fig(id)) c.follow(id, o, dx); };
  function animal(id, o) {
    const c = C();
    if (!c || !c.animal) return null;
    return U.safe('gl.animal', () => c.animal(id, Object.assign({ layer: 2, from: W.replaying ? 'none' : 'fade' }, o, W.replaying ? { from: 'none' } : {})));
  }
  // 一群人：建成后逐一打扮（性别、年岁、衣袍、纵深——皆按序号，不用随机）
  function crowd(gid, o, dressFn) {
    const c = C();
    if (!c || !c.crowd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o, W.replaying ? { from: 'none' } : {})) || [];
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
      const dd = d === 1 || d === -1 ? d : (d >= (m.tx != null ? m.tx : m.nx) ? 1 : -1);
      if (m.tx != null && !W.replaying) { m.faceEnd = dd; continue; }
      m.faceEnd = null;
      m.facing = dd;
      if (W.replaying) m.fd = dd;
    }
  }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  // 衣袍
  const FOLK = [[132, 104, 78], [110, 88, 72], [150, 118, 90], [98, 84, 76], [124, 104, 88], [108, 98, 112], [142, 100, 82], [158, 138, 108], [118, 110, 96]];
  const WOMEN = [[170, 120, 104], [132, 110, 140], [186, 150, 112], [150, 100, 96], [118, 118, 142], [176, 140, 132]];
  const KIDS = [[196, 150, 96], [150, 170, 196], [206, 132, 112], [170, 190, 140], [210, 186, 130], [178, 140, 176]];
  const RICHR = [[112, 66, 104], [70, 88, 132], [128, 58, 60]];
  const POOR = [[104, 98, 90], [96, 92, 86], [112, 104, 94]];
  const golden = i => ((i * 0.6180339) % 1);
  const disciples = (v0, v1) => (m, i) => {
    const R = DROBES();
    m.sex = 'm'; m.age = 'adult'; m.robe = R[(i + 2) % R.length]; m.accent = null; m.hairOpt = null; m.beardOpt = i % 4 !== 3;
    m.prop = null; m.propDefault = false; m.glow = 0.16; m.label = '门徒';
    m.scale = 0.95 + 0.08 * golden(i + 7); m.v = lerp(v0, v1, golden(i + 1));
  };
  const folk = (v0, v1, label) => (m, i) => {
    m.sex = i % 3 === 1 ? 'f' : 'm';
    m.age = i % 7 === 5 ? 'child' : 'adult';
    m.robe = m.sex === 'f' ? WOMEN[i % WOMEN.length] : FOLK[i % FOLK.length];
    m.accent = null; m.hairOpt = null; m.prop = null; m.propDefault = false; m.carry = null;
    m.scale = 0.93 + 0.1 * golden(i + 7);
    m.v = lerp(v0, v1, golden(i + 1));
    if (label) m.label = label;
  };
  const kidsDress = (v0, v1) => (m, i) => {
    m.sex = i % 2 ? 'f' : 'm'; m.age = 'child'; m.robe = KIDS[i % KIDS.length];
    m.accent = null; m.hairOpt = null; m.prop = null; m.propDefault = false; m.carry = null; m.v = lerp(v0, v1, golden(i + 5)); m.scale = 1; m.glow = 0.2;
    m.label = '小孩子';
  };
  const momsDress = (v0, v1) => (m, i) => {
    m.sex = 'f'; m.age = 'adult'; m.robe = WOMEN[(i + 1) % WOMEN.length]; m.accent = null; m.hairOpt = null; m.prop = null; m.propDefault = false;
    m.carry = 'baby'; m.v = lerp(v0, v1, golden(i + 3)); m.scale = 0.97; m.label = '抱着婴孩的人';
  };
  const richDress = (m, i) => {
    m.sex = 'm'; m.age = i === 1 ? 'elder' : 'adult'; m.robe = RICHR[i % RICHR.length]; m.accent = [222, 186, 110]; m.hairOpt = null;
    m.prop = null; m.propDefault = false; m.v = 0.12 + 0.1 * golden(i + 2); m.scale = 1.02; m.label = '财主';
  };
  const traderDress = (m, i) => {
    m.sex = 'm'; m.age = i % 4 === 3 ? 'elder' : 'adult'; m.robe = [[150, 118, 72], [118, 96, 84], [136, 88, 70], [104, 100, 92], [160, 128, 88]][i % 5];
    m.accent = [196, 164, 110]; m.hairOpt = 'cloth'; m.prop = null; m.propDefault = false; m.v = 0.06 + 0.3 * golden(i + 4); m.scale = 0.98;
    m.label = '做买卖的人';
  };

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    // 站在山上、树上的人：位置由 attach 每一步算出（在人被画出之前也是对的）
    if (f.attach && f._ax != null && isFinite(f._ax) && isFinite(f._ay)) return [f._ax, f._ay - (f._h > 1 ? f._h : PH(l)) * frac];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    return [f.nx * W.w, (l === 2 ? vY(f.nx, f.v || 0) : gY(l, f.nx)) - PH(l) * frac];
  }
  function crowdPt(gid) {
    const ms = cmembers(gid).filter(m => !m.dying);
    if (!ms.length) return null;
    let x = 0, top = Infinity, foot = 0;
    for (const m of ms) {
      const px = m._vis ? m._x : m.nx * W.w;
      const py = m._vis ? m._y : vY(m.nx, m.v || 0);
      const hh = m._vis ? m._h : PH(2);
      x += px; foot += py; top = Math.min(top, py - hh);
    }
    return { x: x / ms.length, foot: foot / ms.length, top };
  }

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  function fresh() {
    return {
      where: 'caesarea',  // caesarea · mount · road · jericho · zhouse · olives · temple
      trans: false,       // 耶稣的衣裳洁白如光
      tables: 'up',       // 桌凳：up 立着 · down 推倒 · gone 收去
      healed: false,      // 瞎子、瘸子得了医治
      mites: 0,           // 寡妇投下的小钱
      zacUp: false,       // 撒该在桑树上
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
  // 柔和的一团（云）：中间实，边缘渐隐
  function puff(rgb) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 1));
    gr.addColorStop(0.45, U.rgba(rgb[0], rgb[1], rgb[2], 0.8));
    gr.addColorStop(0.75, U.rgba(rgb[0], rgb[1], rgb[2], 0.25));
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
  // 一道光芒：左端为根，向右渐宽、渐淡
  function rayCanvas() {
    const w = 256, h = 32, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1), half = 0.12 + 0.88 * u;
      const along = U.smoothstep(0, 0.12, u) * Math.pow(1 - u, 1.6);
      for (let y = 0; y < h; y++) {
        const dy = Math.abs((y + 0.5) / h * 2 - 1) / half;
        const a = dy >= 1 ? 0 : along * Math.exp(-dy * dy * 3);
        const i = (y * w + x) * 4;
        d[i] = 255; d[i + 1] = 252; d[i + 2] = lerp(236, 250, u);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  // 一盏小光：金色的晕，白色的心（一张图画完，四百九十盏也不费力）
  function spark() {
    const c = cnv(64, 64), g = c.getContext('2d');
    let gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,226,160,0.5)'); gr.addColorStop(0.35, 'rgba(255,226,160,0.16)'); gr.addColorStop(1, 'rgba(255,226,160,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    gr = g.createRadialGradient(32, 32, 0, 32, 32, 9);
    gr.addColorStop(0, 'rgba(255,255,250,1)'); gr.addColorStop(0.4, 'rgba(255,252,236,0.45)'); gr.addColorStop(1, 'rgba(255,250,230,0)');
    g.globalCompositeOperation = 'lighter';
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  // 淡金的一层（source-over）：光明的云彩里，衬出洁白的人
  function tone() {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(200,150,76,0.72)'); gr.addColorStop(0.5, 'rgba(210,164,92,0.38)'); gr.addColorStop(1, 'rgba(222,184,120,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([246, 248, 255], 1),
      pearl: radial([252, 248, 238], 1), silver: radial([206, 222, 255], 1), dark: radial([30, 30, 40], 0.9, 0.6),
      cloud: puff([250, 248, 240]), cloudG: puff([255, 238, 200]),
      beam: vbeam([255, 252, 240], [255, 236, 196], 0.12), ray: rayCanvas(), spark: spark(), tone: tone(),
    };
    return SP;
  }
  function glowAt(ctx, spr, x, y, r, a, sy) {
    if (a <= 0.004 || r <= 0.5 || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = clamp(a, 0, 1);
    const ry = r * (sy || 1);
    ctx.drawImage(spr, x - r, y - ry, r * 2, ry * 2);
  }
  // 火（灯）
  const FIRE4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.26, 0.68, 'rgb(255,162,66)', 0.75], [0.24, 0.72, 'rgb(255,142,58)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.4, k * (0.22 + 0.5 * nightK()));
    for (let i = 0; i < 4; i++) {
      const q = FIRE4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = clamp(k * q[3], 0, 1);
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
  //  凯撒利亚‧腓立比的磐石：石下一个幽暗的洞口（16:18）
  // ════════════════════════════════════════════════════════════
  const ROCK = [168, 150, 120], ROCK_D = [118, 104, 86];
  let RK = null;
  function rockGeo() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (RK && RK.key === key) return RK;
    const ph = PH(2), cx = X('rock') * W.w, w = (tall() ? 2.7 : 3.1) * ph, h = 2.15 * ph;
    const N = 34, top = [], base = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N, x = cx - w / 2 + u * w;
      const g = gB(2, x / W.w) + 0.08 * ph;
      let k = Math.pow(Math.sin(Math.PI * u), 0.6) * (0.8 + 0.12 * Math.sin(u * 6.3 + 1.2)) + 0.2 * Math.exp(-Math.pow((u - 0.38) / 0.12, 2));
      k += (hsh(i * 3.7 + 11) - 0.5) * 0.07 * Math.sin(Math.PI * u);
      top.push([x, g - h * clamp(k, 0, 1.25)]);
      base.push([x, g]);
    }
    const cvx = cx - 0.06 * w, cvg = gB(2, cvx / W.w) + 0.08 * ph;
    const cave = { x: cvx, y: cvg, w: 0.66 * ph, h: 0.86 * ph };
    const r = U.mulberry32(1618), cracks = [];
    const topAt = x => { const f = clamp((x - (cx - w / 2)) / w, 0, 1) * N, i = Math.min(N - 1, Math.floor(f)), t = f - i; return lerp(top[i][1], top[i + 1][1], t); };
    for (let i = 0; i < 8; i++) {
      let x = cx + (r() - 0.5) * w * 0.72;
      let y = topAt(x) + (0.1 + r() * 0.2) * h;
      const pts = [[x, y]];
      for (let j = 0; j < 4; j++) { x += (r() - 0.5) * 0.36 * ph; y += (0.18 + r() * 0.2) * ph; pts.push([x, y]); }
      cracks.push(pts);
    }
    const strata = [];
    for (let i = 0; i < 4; i++) strata.push([0.12 + r() * 0.3, 0.55 + r() * 0.35, 0.3 + i * 0.15 + r() * 0.05]);
    RK = { key, cx, w, h, ph, top, base, cave, cracks, strata, topAt };
    return RK;
  }
  function rockPath(ctx, G) {
    ctx.beginPath();
    ctx.moveTo(G.base[0][0], G.base[0][1] + 2);
    for (const p of G.top) ctx.lineTo(p[0], p[1]);
    for (let i = G.base.length - 1; i >= 0; i--) ctx.lineTo(G.base[i][0], G.base[i][1] + 2);
    ctx.closePath();
  }
  function drawRock(ctx) {
    const a = lv('glRock');
    if (a < 0.01) return;
    SP || sprites();
    const G = rockGeo(), ph = G.ph, un = UN(), sunL = litX() < G.cx;
    ctx.save();
    ctx.globalAlpha = clamp(a * 1.2, 0, 1);
    // 石身：迎光一侧亮，背光一侧暗
    const gr = ctx.createLinearGradient(G.cx - G.w / 2, 0, G.cx + G.w / 2, 0);
    gr.addColorStop(0, css(sunL ? lit(ROCK) : ROCK_D, 2, null, sunL ? 0.03 : 0));
    gr.addColorStop(0.5, css(ROCK, 2));
    gr.addColorStop(1, css(sunL ? ROCK_D : lit(ROCK), 2, null, sunL ? 0 : 0.03));
    ctx.fillStyle = gr;
    rockPath(ctx, G); ctx.fill();
    ctx.save();
    rockPath(ctx, G); ctx.clip();
    // 石层
    ctx.strokeStyle = css(dim(ROCK, 0.72), 2, 0.45);
    ctx.lineWidth = Math.max(0.6, 0.9 * un);
    ctx.beginPath();
    for (const s of G.strata) {
      const x0 = G.cx - G.w / 2 + s[0] * G.w, x1 = G.cx - G.w / 2 + s[1] * G.w;
      for (let i = 0; i <= 10; i++) {
        const x = lerp(x0, x1, i / 10), y = lerp(G.topAt(x), G.base[0][1], s[2]) + Math.sin(i * 1.3 + s[0] * 9) * 0.03 * ph;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
    }
    ctx.stroke();
    // 裂缝（磐石发光时透出金光）
    ctx.strokeStyle = css(dim(ROCK, 0.55), 2, 0.6);
    ctx.lineWidth = Math.max(0.6, 0.8 * un);
    ctx.beginPath();
    for (const c of G.cracks) { ctx.moveTo(c[0][0], c[0][1]); for (let i = 1; i < c.length; i++) ctx.lineTo(c[i][0], c[i][1]); }
    ctx.stroke();
    const L = lv('glRockLit');
    if (L > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp(a * L, 0, 1);
      ctx.strokeStyle = 'rgba(255,214,140,0.9)';
      ctx.lineWidth = Math.max(1, 1.6 * un);
      ctx.beginPath();
      for (const c of G.cracks) { ctx.moveTo(c[0][0], c[0][1]); for (let i = 1; i < c.length; i++) ctx.lineTo(c[i][0], c[i][1]); }
      ctx.stroke();
      glowAt(ctx, SP.gold, G.cx, G.base[0][1] - G.h * 0.45, G.w * 0.7, a * L * (0.35 + 0.25 * nightK()), 0.7);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    // 洞口
    const cv = G.cave;
    const cavePath = () => {
      ctx.beginPath();
      ctx.moveTo(cv.x - cv.w / 2, cv.y + 2);
      ctx.bezierCurveTo(cv.x - cv.w * 0.55, cv.y - cv.h * 0.7, cv.x - cv.w * 0.25, cv.y - cv.h, cv.x + cv.w * 0.05, cv.y - cv.h);
      ctx.bezierCurveTo(cv.x + cv.w * 0.35, cv.y - cv.h, cv.x + cv.w * 0.58, cv.y - cv.h * 0.6, cv.x + cv.w / 2, cv.y + 2);
      ctx.closePath();
    };
    ctx.globalAlpha = clamp(a * 1.2, 0, 1);
    ctx.fillStyle = css([30, 26, 24], 2);
    cavePath(); ctx.fill();
    if (L > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp(a * L * 0.75, 0, 1);
      ctx.fillStyle = 'rgb(255,196,120)';
      cavePath(); ctx.fill();
      glowAt(ctx, SP.warm, cv.x, cv.y - cv.h * 0.4, cv.w * 1.4, a * L * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 洞口冷冷的阴影（阴间的权柄）：一团暗雾，光来时退回去
    const gk = lv('glGrotto') * a;
    if (gk > 0.01) {
      for (let i = 0; i < 6; i++) {
        const ph2 = U.fract(W.t * 0.05 + i / 6);
        const x = cv.x + Math.sin(W.t * 0.4 + i * 2.1) * cv.w * 0.4 - ph2 * cv.w * 0.5, y = cv.y - cv.h * (0.3 + 0.6 * ph2);
        glowAt(ctx, SP.dark, x, y, cv.w * (0.5 + ph2 * 0.9), gk * 0.3 * Math.sin(Math.PI * ph2));
      }
    }
    // 迎光的边
    ctx.globalAlpha = clamp(a * 1.2, 0, 1);
    ctx.strokeStyle = css(lit(ROCK), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.8, 1.2 * un);
    ctx.beginPath();
    const n = G.top.length, i0 = sunL ? 0 : Math.floor(n * 0.45), i1 = sunL ? Math.ceil(n * 0.6) : n - 1;
    for (let i = i0; i <= i1; i++) { const p = G.top[i]; if (i === i0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const rockTop = () => { const G = rockGeo(); return [G.cx, G.topAt(G.cx) + 0.1 * G.ph]; };

  // ── 远方点亮的光（教会建造在这磐石上）──────────────────────
  let CH = null;
  function churchGeo() {
    const key = W.w + 'x' + W.h;
    if (CH && CH.key === key) return CH;
    const pts = [], [rx] = rockTop();
    // 只落在有地的地方（远地、中地之间有海：取不到地的点换一处，再不行就落到中地上）
    const onLand = (l, xf) => xf > 0 && xf < 1 && W.hasLandBase(l, xf * W.w, W.h * 0.012) && gY(l, xf) < W.waterlineY(l) - 2;
    for (let i = 0; i < 16; i++) {
      let layer = i % 3 === 0 ? 0 : 1, xf = -1;
      for (let pass = 0; pass < 2 && xf < 0; pass++) {
        const sp = W.landSpan(layer, W.h * 0.012);
        if (sp) {
          for (let j = 0; j < 12; j++) {
            const x = lerp(sp[0] / W.w + 0.02, Math.min(sp[1] / W.w - 0.01, X('m0') - 0.03), hsh(i * 5.3 + 2 + j * 17.13));
            if (onLand(layer, x)) { xf = x; break; }
          }
        }
        if (xf < 0) layer = 1;
      }
      if (xf < 0) continue;
      pts.push({ layer, xf, d: Math.abs(xf * W.w - rx) / W.w + (layer === 0 ? 0.25 : 0) + hsh(i * 2.2) * 0.1 });
    }
    if (pts.length < 2) pts.push({ layer: 2, xf: X('rock') + 0.08, d: 0 }, { layer: 2, xf: X('rock') + 0.14, d: 0.1 });
    pts.sort((a, b) => a.d - b.d);
    pts.forEach((p, i) => { p.tau = 0.1 + 0.85 * (i / (pts.length - 1)); });
    return (CH = { key, pts });
  }
  function drawChurch(ctx) {
    const A = lv('glChurchA'), k = lv('glChurch');
    if (A < 0.01 || k < 0.01) return;
    SP || sprites();
    const G = churchGeo(), R = rockTop();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of G.pts) {
      const x = p.xf * W.w, y = gY(p.layer, p.xf) - PH(p.layer) * 0.3;
      const on = sm(p.tau, p.tau + 0.06, k);
      if (k > p.tau - 0.14 && k < p.tau + 0.02) {
        const s = clamp((k - (p.tau - 0.14)) / 0.14, 0, 1), e = ease(s);
        const mx = lerp(R[0], x, e), my = lerp(R[1], y, e) - Math.sin(Math.PI * e) * 0.1 * W.h;
        glowAt(ctx, SP.gold, mx, my, 9 * SU(), A * 0.9);
        glowAt(ctx, SP.white, mx, my, 3.5 * SU(), A);
      }
      if (on > 0.01) {
        const tw = 0.8 + 0.2 * Math.sin(W.t * 2.3 + p.xf * 40);
        glowAt(ctx, SP.gold, x, y, (p.layer ? 14 : 9) * SU(), A * on * 0.55 * tw);
        glowAt(ctx, SP.white, x, y, (p.layer ? 3.5 : 2.5) * SU(), A * on * 0.9);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  高山（登山变像）：近地右边的一座大山，宽阔的山顶
  // ════════════════════════════════════════════════════════════
  const MPROF = [[-1, 0], [-0.9, 0.1], [-0.81, 0.23], [-0.73, 0.38], [-0.66, 0.54], [-0.61, 0.66], [-0.57, 0.74], [-0.52, 0.775], [-0.44, 0.79], [-0.36, 0.81],
    [-0.3, 0.86], [-0.24, 0.93], [-0.16, 0.975], [-0.06, 0.997], [0.04, 1], [0.14, 0.99], [0.24, 0.96], [0.33, 0.9], [0.43, 0.8], [0.54, 0.66], [0.65, 0.5], [0.76, 0.33], [0.88, 0.15], [1, 0]];
  const MJIT = [];
  (function () { const r = U.mulberry32(5151); for (let i = 0; i <= 120; i++) MJIT.push(r() - 0.5); })();
  function kOf(u) {
    if (u <= -1 || u >= 1) return 0;
    let i = 1;
    while (i < MPROF.length - 1 && MPROF[i][0] < u) i++;
    const a = MPROF[i - 1], b = MPROF[i], t = (u - a[0]) / (b[0] - a[0]);
    const e = t * t * (3 - 2 * t);
    const k = a[1] + (b[1] - a[1]) * lerp(t, e, 0.5);
    const f = (u + 1) * 60, j = Math.floor(f), jt = f - j;
    const jit = lerp(MJIT[j] || 0, MJIT[j + 1] || 0, jt);
    const flat = (u > -0.22 && u < 0.2) || (u > -0.54 && u < -0.34) ? 0.15 : 1;
    return Math.max(0, k + jit * 0.025 * (1 - Math.pow(Math.abs(u), 4)) * flat);
  }
  let MT = null;
  function mt() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (MT && MT.key === key) return MT;
    const cx = X('ms') * W.w, hwL = (X('ms') - X('m0')) * W.w, hwR = (X('m1') - X('ms')) * W.w;
    const gc = gB(2, X('ms'));
    const H = Math.min(X('mH') * W.h, 1.45 * hwL);
    MT = { key, cx, hwL, hwR, gc, H };
    // 山的细部（以 u / 高度比例记）
    const r = U.mulberry32(9151), scrub = [], spurs = [];
    for (let i = 0; i < 46; i++) scrub.push([-0.92 + r() * 1.84, 0.06 + r() * 0.82, 0.5 + r() * 0.9]);
    for (const q of [[-0.08, -0.46, 0.97, 0.4], [-0.22, -0.72, 0.93, 0.22], [-0.44, -0.9, 0.8, 0.1], [0.1, 0.42, 0.97, 0.5], [0.3, 0.7, 0.9, 0.3], [0.52, 0.9, 0.75, 0.12]]) spurs.push(q);
    MT.scrub = scrub; MT.spurs = spurs;
    MT.path = [[-0.95, 0.03], [-0.8, 0.2], [-0.7, 0.3], [-0.74, 0.4], [-0.64, 0.52], [-0.58, 0.64], [-0.62, 0.72], [-0.5, 0.8], [-0.34, 0.9], [-0.26, 0.94], [-0.14, 0.98]];
    return MT;
  }
  const mX = u => MT.cx + u * (u < 0 ? MT.hwL : MT.hwR);
  const mU = x => (x - MT.cx) / (x < MT.cx ? MT.hwL : MT.hwR);
  const mHk = () => Math.pow(sm(0, 1, lv('glMount')), 0.6);          // 山退去时渐渐沉下
  function mSurf(x) {
    mt();
    const u = mU(x), g = gB(2, x / W.w);
    if (u <= -1 || u >= 1) return g;
    return g - kOf(u) * (g - (MT.gc - MT.H)) * mHk();
  }
  function mPt(u, kk) { mt(); const x = mX(u), g = gB(2, x / W.w), top = mSurf(x); return [x, g - (g - top) * kk]; }
  const mountY = (xf, v) => Math.min(vY(xf, v || 0), mSurf(xf * W.w));
  // 站在山上：三个门徒各有一点下移（站在山的近坡上，俯伏时不叠成一堆）；近山脚处渐渐归零
  const MOFF = { peter: 'peO', james: 'jaO', john: 'jnO' };
  function onMount(id) {
    attach(id, () => {
      const f = fig(id);
      if (!f) return null;
      const y = mountY(f.nx, f.v), off = MOFF[id] ? X(MOFF[id]) || 0 : 0;
      if (!off) return [f.nx * W.w, y];
      mt();
      const rise = clamp((vY(f.nx, f.v) - y) / Math.max(1, 0.3 * MT.H), 0, 1);
      return [f.nx * W.w, y + off * PH(2) * rise];
    });
  }
  const uX = u => { mt(); return mX(u) / W.w; };
  const MOUNT = [128, 124, 102], MOUNT_D = [86, 88, 76], SCRUB = [70, 94, 58];
  function drawMount(ctx) {
    const m = lv('glMount');
    if (m < 0.01) return;
    mt();
    const un = UN(), sunL = litX() < MT.cx, N = 90;
    const pts = [];
    for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N, x = mX(u); pts.push([x, mSurf(x)]); }
    ctx.save();
    ctx.globalAlpha = clamp(m * 1.25, 0, 1);
    const gr = ctx.createLinearGradient(MT.cx - MT.hwL, 0, MT.cx + MT.hwR * 0.8, 0);
    gr.addColorStop(0, css(sunL ? lit(MOUNT) : MOUNT_D, 2, null, sunL ? 0.02 : 0));
    gr.addColorStop(0.45, css(MOUNT, 2));
    gr.addColorStop(1, css(sunL ? MOUNT_D : lit(MOUNT), 2, null, sunL ? 0 : 0.02));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], gB(2, pts[0][0] / W.w) + 3);
    for (const p of pts) ctx.lineTo(p[0], p[1]);
    for (let i = N; i >= 0; i--) ctx.lineTo(pts[i][0], gB(2, clamp(pts[i][0] / W.w, 0, 1)) + 3);
    ctx.closePath();
    ctx.fill();
    // 山脊：一受光、一背光
    const hk = mHk();
    if (hk > 0.05) {
      for (const q of MT.spurs) {
        const n2 = 10, A = [];
        for (let i = 0; i <= n2; i++) { const t = i / n2; A.push(mPt(lerp(q[0], q[1], t), lerp(q[2], q[3], t))); }
        const left = q[1] < q[0];
        const shadeSide = left === sunL;
        ctx.fillStyle = css(shadeSide ? MOUNT_D : lit(MOUNT), 2, 0.28 * hk, shadeSide ? 0 : 0.02);
        ctx.beginPath();
        ctx.moveTo(A[0][0], A[0][1]);
        for (const p of A) ctx.lineTo(p[0], p[1]);
        const end = A[A.length - 1];
        ctx.lineTo(end[0] + (left ? 1 : -1) * MT.hwL * 0.08, gB(2, end[0] / W.w));
        ctx.lineTo(A[0][0] + (left ? 1 : -1) * MT.hwL * 0.03, A[0][1] + MT.H * 0.05);
        ctx.closePath(); ctx.fill();
      }
      // 小树丛
      ctx.fillStyle = css(SCRUB, 2, 0.9);
      ctx.beginPath();
      for (const s of MT.scrub) {
        const p = mPt(s[0], s[1]), r = (0.05 + 0.04 * s[2]) * PH(2) * (0.6 + 0.4 * hk);
        ctx.moveTo(p[0] + r, p[1]); ctx.ellipse(p[0], p[1], r, r * 0.62, 0, 0, TAU);
      }
      ctx.fill();
      // 上山的小路
      ctx.strokeStyle = css([206, 190, 156], 2, 0.45 * hk);
      ctx.lineWidth = Math.max(0.6, 1 * un);
      ctx.setLineDash([3 * un, 2.5 * un]);
      ctx.beginPath();
      MT.path.forEach((q, i) => { const p = mPt(q[0], q[1]); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // 迎光的山脊线
    ctx.strokeStyle = css(lit(MOUNT), 2, rimA() * 0.9, 0.06);
    ctx.lineWidth = Math.max(0.8, 1.3 * un);
    ctx.beginPath();
    const i0 = sunL ? 4 : Math.floor(N * 0.45), i1 = sunL ? Math.ceil(N * 0.58) : N - 4;
    for (let i = i0; i <= i1; i++) { const p = pts[i]; if (i === i0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 变像的人（17:2）：人物模块把静止的人缓存为一组路径（按衣袍、头手、发、须分色）；
  //    这里以同一组路径重新填色——衣裳洁白如光，头与手如日头的淡金，一道金边使白衣在白云里仍显出身形。
  //    （只读人物模块的缓存；缓存不合当下的位置、朝向、姿势时不用，改以白光罩身。）
  const TRANS_COL = { robe: 'rgb(255,255,252)', arm: 'rgb(255,255,252)', back: 'rgb(255,243,216)', acc: 'rgb(255,234,186)' };
  function figShape(f) {
    const c = f && f._cc;
    if (!c || !c.union || !c.paths || !c.pk || !(c.pn > 0) || !f._vis) return null;
    if (c.k0 !== f._x || c.k1 !== f._y || c.k2 !== f._h) return null;
    const d = c.k3 - f.fd * 2;
    if (d !== 0 && d !== 1) return null;
    if (!(f.poseT >= 1) || f.gait > 0.003 || f.emerge < 1 || f._seat) return null;
    return c;
  }
  function transFig(ctx, f, k, h) {
    const c = figShape(f);
    if (!c || f.alpha < 0.05) return false;
    const a = clamp(k * f.alpha, 0, 1);
    ctx.save();
    // 金边（先以整个身形向四方稍偏各填一次）
    const e = Math.max(1.1, 0.034 * h);
    ctx.globalAlpha = a * 0.9;
    ctx.fillStyle = 'rgb(206,148,58)';
    for (let i = 0; i < 4; i++) {
      const dx = i === 0 ? e : i === 1 ? -e : 0, dy = i === 2 ? e : i === 3 ? -e * 0.6 : 0;
      ctx.translate(dx, dy); ctx.fill(c.union); ctx.translate(-dx, -dy);
    }
    // 发留着淡淡的金褐；衣袍、头手、须与腰带成白与淡金
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(226,190,132)';
    ctx.fill(c.union);
    for (let i = 0; i < c.pn; i++) {
      const col = TRANS_COL[c.pk[i]];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fill(c.paths[i]);
    }
    ctx.restore();
    return true;
  }
  // ── 变像的光（17:2）：满身光芒；父指示的光（16:17）；光明的云彩（17:5）；光柱 ──
  // 在人之后（part 'back'）：满身光芒、四射的光；在人之前（'front'）：只一层柔光，使人仍看得见
  function drawGlory(ctx, part) {
    const k = lv('glTrans');
    if (k < 0.01) return;
    SP || sprites();
    const p = figPt('jesus', 0.55);
    if (!p) return;
    const ph = PH(2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (part === 'front') {
      // 衣裳洁白如光：人本身成了白的（按人物模块画出的身形重新填色）；身形不在手边时（正走着），以白光罩住全身
      const f = fig('jesus'), h = f && f._h > 1 ? f._h : ph, q = figPt('jesus', 0.5);
      // 先是身周的柔光，再把人画成白的（金边不被光冲淡）
      if (q) glowAt(ctx, SP.white, q[0], q[1], h * 0.42, 0.4 * k, 1.5);
      glowAt(ctx, SP.white, p[0], p[1], h * 1.15, 0.22 * k);
      ctx.globalCompositeOperation = 'source-over';
      // 云里：他身后叠满了的白染上一层淡金（source-over），洁白的人便是云中最亮的
      const cl = lv('glCloud');
      if (cl > 0.02 && q) {
        ctx.globalAlpha = clamp(cl * k, 0, 1);
        const rx = h * 1.25, ry = h * 1.5;
        ctx.drawImage(SP.tone, q[0] - rx, q[1] - ry, rx * 2, ry * 2);
      }
      const shaped = transFig(ctx, f, k, h);
      if (q && !shaped) {
        ctx.globalCompositeOperation = 'lighter';
        const a = k * (0.8 + 0.2 * nightK());
        glowAt(ctx, SP.white, q[0], q[1] + 0.04 * h, h * 0.35, a, 1.5);
        glowAt(ctx, SP.white, q[0], q[1] + 0.04 * h, h * 0.3, a, 1.55);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    // 光明的云彩降下时，身后的白光收一些：云里最亮的仍是他
    const cl = lv('glCloud');
    glowAt(ctx, SP.white, p[0], p[1], ph * 6.5, 0.36 * k * (1 - 0.55 * cl));
    const n = 22, rot = W.t * 0.035;
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * TAU + 0.12 * Math.sin(W.t * 0.3 + i);
      const len = ph * (3.2 + 2.4 * hsh(i * 1.7)) * (0.9 + 0.1 * Math.sin(W.t * 0.8 + i * 2));
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.rotate(a);
      ctx.globalAlpha = clamp(k * (0.26 + 0.2 * hsh(i * 3.3)), 0, 1);
      ctx.drawImage(SP.ray, ph * 0.2, -ph * 0.16, len, ph * 0.32);
      ctx.restore();
    }
    glowAt(ctx, SP.pearl, p[0], p[1], ph * 1.9, 0.5 * k * (1 - 0.5 * cl));
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 山顶被光照亮（变像与光明的云彩）
  function drawSummitLight(ctx) {
    const k = Math.max(lv('glTrans'), lv('glCloud') * 0.9);
    if (k < 0.01 || lv('glMount') < 0.05) return;
    SP || sprites();
    mt();
    const top = MT.gc - MT.H * mHk();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, MT.cx, top + MT.H * 0.12, MT.hwL * 0.95, k * (0.18 + 0.3 * nightK()), 0.7);
    glowAt(ctx, SP.pearl, MT.cx, top, MT.hwL * 0.45, k * (0.12 + 0.25 * nightK()), 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawReveal(ctx) {
    const k = lv('glReveal');
    if (k < 0.01) return;
    SP || sprites();
    const p = figPt('jesus', 0.5);
    if (!p) return;
    const w = PH(2) * 2.4;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * 0.5, 0, 1);
    ctx.drawImage(SP.beam, p[0] - w / 2, -W.h * 0.04, w, p[1] + PH(2) * 0.6 + W.h * 0.04);
    glowAt(ctx, SP.gold, p[0], p[1], PH(2) * 1.6, k * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const CLB = [];
  (function () {
    const r = U.mulberry32(5171);
    for (let i = 0; i < 30; i++) {
      const a = r() * TAU, rr = 0.35 + 0.75 * Math.sqrt(r());
      CLB.push([Math.cos(a) * rr * 1.25, Math.sin(a) * rr * 0.55 - 0.05, 0.3 + 0.35 * r(), r() * TAU]);
    }
  })();
  function cloudC() { mt(); return [MT.cx, MT.gc - MT.H * mHk() - PH(2) * 0.55]; }
  // 光明的云彩：云身在人之后（人在光里显出身形），人之前只有一层薄薄的光雾
  function drawCloud(ctx, part) {
    const k = lv('glCloud');
    if (k < 0.01) return;
    SP || sprites();
    const ph = PH(2), R = tall() ? Math.max(1.9 * ph, 0.17 * W.w) : Math.max(2.1 * ph, 0.1 * W.w);
    const c = cloudC(), cx = c[0], cy = c[1] - (1 - k) * 0.3 * W.h;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (part === 'front') {
      for (let i = 0; i < CLB.length; i += 2) {
        const b = CLB[i];
        const rr = Math.hypot(b[0] / 1.25, b[1] / 0.55);
        if (rr < 0.6) continue;
        const x = cx + b[0] * R * 1.1 + Math.sin(W.t * 0.17 + b[3]) * 0.07 * R;
        const y = cy + b[1] * R * 1.1 + Math.cos(W.t * 0.13 + b[3] * 1.3) * 0.04 * R;
        glowAt(ctx, SP.cloud, x, y, b[2] * R * 1.6, k * 0.1, 0.7);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    glowAt(ctx, SP.gold, cx, cy, R * 3, 0.26 * k);
    for (let i = 0; i < CLB.length; i++) {
      const b = CLB[i];
      const x = cx + b[0] * R + Math.sin(W.t * 0.17 + b[3]) * 0.07 * R;
      const y = cy + b[1] * R + Math.cos(W.t * 0.13 + b[3] * 1.3) * 0.04 * R;
      glowAt(ctx, i % 3 ? SP.cloud : SP.cloudG, x, y, b[2] * R * 1.7, k * 0.12, 0.72);
    }
    glowAt(ctx, SP.gold, cx, cy + 0.15 * R, R * 1.3, 0.16 * k, 0.8);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawVoice(ctx) {
    const k = lv('glVoice');
    if (k < 0.01) return;
    SP || sprites();
    const c = cloudC(), w = PH(2) * (tall() ? 3.2 : 4.2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * 0.55, 0, 1);
    ctx.drawImage(SP.beam, c[0] - w / 2, -W.h * 0.04, w, c[1] + W.h * 0.06);
    ctx.globalAlpha = clamp(k * 0.35, 0, 1);
    ctx.drawImage(SP.beam, c[0] - w * 0.18, -W.h * 0.04, w * 0.36, c[1] + W.h * 0.08);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  七十个七次（18:22）：七盏光，化作四百九十盏，散满全地与天空
  // ════════════════════════════════════════════════════════════
  let SEV = null;
  function sevGeo() {
    const key = W.w + 'x' + W.h;
    if (SEV && SEV.key === key) return SEV;
    const ph = PH(2), cx = (X('j5') - 0.02) * W.w, cy = gB(2, X('j5')) - (tall() ? 4.2 : 3.9) * ph;
    const seeds = [];
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; seeds.push([cx + Math.cos(a) * 1.9 * ph * (tall() ? 1.2 : 1), cy + Math.sin(a) * 1.1 * ph + 1.1 * ph]); }
    const L = [];
    const y0 = tall() ? 0.33 : 0.07, y1 = tall() ? 0.86 : 0.84;
    for (let i = 0; i < 490; i++) {
      let tx = 0.02 + 0.97 * hsh(i * 1.37 + 0.5), ty = lerp(y0, y1, Math.pow(hsh(i * 2.91 + 5), 1.25));
      // 经文在海上（宽屏的左下）：那里的光少些、淡些
      if (!tall() && tx < 0.5 && ty > 0.58) ty = lerp(0.1, 0.56, hsh(i * 7.3));
      const land = tx > 0.34 && ty > 0.8;
      L.push({ s: i % 7, tx: tx * W.w, ty: land ? gB(2, tx) - ph * (0.2 + hsh(i) * 0.8) : ty * W.h, d: hsh(i * 7.7 + 1) * 0.55, r: 0.7 + 0.6 * hsh(i * 4.1), ph: hsh(i * 9.1) * TAU });
    }
    return (SEV = { key, seeds, L });
  }
  function drawSeventy(ctx) {
    const A = lv('glSevenA');
    if (A < 0.01) return;
    SP || sprites();
    const G = sevGeo(), a7 = lv('glSeven'), sp = lv('glSeventy'), su = SU();
    ctx.globalCompositeOperation = 'lighter';
    if (a7 > 0.01) {
      for (let i = 0; i < 7; i++) {
        const s = G.seeds[i], tw = 0.85 + 0.15 * Math.sin(W.t * 2 + i);
        glowAt(ctx, SP.gold, s[0], s[1], 24 * su, A * a7 * 0.7 * tw);
        glowAt(ctx, SP.white, s[0], s[1], 6 * su, A * a7);
      }
    }
    if (sp > 0.001) {
      for (const q of G.L) {
        const p = clamp((sp - q.d) / 0.45, 0, 1);
        if (p <= 0) continue;
        const e = ease(p), s = G.seeds[q.s];
        const x = lerp(s[0], q.tx, e) + Math.sin(W.t * 0.4 + q.ph) * 3 * su * p;
        const y = lerp(s[1], q.ty, e) - Math.sin(Math.PI * e) * 0.05 * W.h + Math.cos(W.t * 0.33 + q.ph) * 2 * su * p;
        const tw = 0.7 + 0.3 * Math.sin(W.t * (1.2 + q.r) + q.ph);
        glowAt(ctx, SP.spark, x, y, 7 * su * q.r, A * tw * sm(0, 0.2, p));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 天上的财宝（19:21）──────────────────────────────────────
  const TRS = [];
  (function () { const r = U.mulberry32(2121); for (let i = 0; i < 26; i++) { const a = r() * TAU, rr = Math.sqrt(r()); TRS.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.55, 0.6 + r() * 0.8, r() * TAU]); } })();
  function drawTreasure(ctx) {
    const k = lv('glTreasure');
    if (k < 0.01) return;
    SP || sprites();
    const c = X('treas'), cx = c[0] * W.w, cy = c[1] * W.h, R = (tall() ? 0.16 : 0.07) * W.w, su = SU();
    ctx.globalCompositeOperation = 'lighter';
    const day = 1 + 0.6 * W.daylight;
    glowAt(ctx, SP.gold, cx, cy, R * 1.9, 0.34 * k * day, 0.7);
    for (const q of TRS) {
      const tw = 0.7 + 0.3 * Math.sin(W.t * 1.7 + q[3]);
      const x = cx + q[0] * R, y = cy + q[1] * R + Math.sin(W.t * 0.5 + q[3]) * 2;
      glowAt(ctx, SP.gold, x, y, 13 * su * q[2], k * 0.6 * tw * day);
      glowAt(ctx, SP.white, x, y, 3.2 * su * q[2], k);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // ── 祝福小孩子的暖光 ─────────────────────────────────────────
  function drawKids(ctx) {
    const k = lv('glKids');
    if (k < 0.01) return;
    SP || sprites();
    const c = crowdPt('kids'), p = figPt('jesus', 0.5), ph = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    if (c) glowAt(ctx, SP.gold, c.x, c.foot - ph * 0.3, ph * 2.6, 0.35 * k, 0.55);
    if (p) glowAt(ctx, SP.warm, p[0], p[1], ph * 1.6, 0.3 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  远处的耶路撒冷（中丘的右边）
  // ════════════════════════════════════════════════════════════
  const LIME = [214, 198, 164], LIME_D = [174, 156, 122], HILLC = [150, 134, 102], CEDAR = [130, 88, 56], GOLD = [238, 198, 106];
  function drawFarCity(ctx) {
    const k = lv('glFar');
    if (k < 0.01) return;
    SP || sprites();
    const ph = PH(1), un = UN(), x0 = X('far0'), tx = X('farT'), sunL = litX() < tx * W.w;
    ctx.save();
    ctx.globalAlpha = clamp(k, 0, 1);
    // 城所在的山
    const N = 24, hill = [];
    for (let i = 0; i <= N; i++) {
      const xf = lerp(x0, 1.02, i / N), g = gY(1, Math.min(1, xf));
      hill.push([xf * W.w, g - ph * 1.05 * sm(x0, x0 + 0.05, xf) * (0.7 + 0.3 * Math.exp(-Math.pow((xf - tx) / 0.07, 2)))]);
    }
    ctx.fillStyle = css(HILLC, 1);
    ctx.beginPath();
    ctx.moveTo(hill[0][0], gY(1, x0) + 2);
    for (const p of hill) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(W.w + 4, gY(1, 1) + 2);
    ctx.closePath(); ctx.fill();
    const hAt = xf => { const f = clamp((xf - x0) / (1.02 - x0), 0, 1) * N, i = Math.min(N - 1, Math.floor(f)); return lerp(hill[i][1], hill[i + 1][1], f - i); };
    // 城墙
    const wx0 = (x0 + 0.02) * W.w, WH = 0.42 * ph, cr = Math.max(1, 0.1 * ph);
    ctx.fillStyle = css(LIME, 1);
    ctx.beginPath();
    for (let x = wx0; x < W.w + 4; x += cr * 2) {
      const g = gY(1, Math.min(1, x / W.w)) - 0.05 * ph;
      ctx.rect(x, g - WH, cr * 2 + 0.5, WH + 2);
      ctx.rect(x, g - WH - cr * 0.8, cr, cr * 0.8 + 1);
    }
    ctx.fill();
    // 房屋
    ctx.fillStyle = css(mix(LIME, [190, 170, 136], 0.3), 1);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const xf = lerp(x0 + 0.03, 1.0, hsh(i * 3.7 + 1)), yb = lerp(gY(1, Math.min(1, xf)), hAt(xf), 0.3 + 0.5 * hsh(i * 1.3));
      if (Math.abs(xf - tx) < 0.035) continue;
      const w = (0.28 + 0.2 * hsh(i + 4)) * ph, h = (0.22 + 0.2 * hsh(i + 9)) * ph;
      ctx.rect(xf * W.w - w / 2, yb - h, w, h + 1);
    }
    ctx.fill();
    // 殿（在日光里闪亮）
    const tX = tx * W.w, tY = hAt(tx) + 0.05 * ph, tw = 0.95 * ph, th = 0.62 * ph;
    ctx.fillStyle = css([240, 232, 210], 1, null, 0.08);
    ctx.fillRect(tX - tw * 0.8, tY - th * 0.3, tw * 1.6, th * 0.3 + 1);
    ctx.fillRect(tX - tw / 2, tY - th, tw, th);
    ctx.fillRect(tX - tw * 0.14, tY - th * 1.3, tw * 0.28, th * 0.4);
    ctx.fillStyle = css(GOLD, 1, 0.9, 0.15);
    ctx.fillRect(tX - tw / 2 - 1, tY - th - 0.06 * ph, tw + 2, 0.06 * ph);
    ctx.strokeStyle = css(lit(LIME), 1, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, 0.8 * un);
    ctx.beginPath(); ctx.moveTo(sunL ? tX - tw / 2 : tX + tw / 2, tY); ctx.lineTo(sunL ? tX - tw / 2 : tX + tw / 2, tY - th); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, tX, tY - th * 0.8, ph * 1.5, k * (0.25 + 0.35 * W.dusk + 0.2 * nightK()));
    glowAt(ctx, SP.white, tX - tw * 0.1, tY - th, ph * 0.4, k * 0.5 * (0.6 + 0.4 * Math.sin(W.t * 1.3)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶利哥：棕树、平顶的房屋、桑树、撒该的家
  // ════════════════════════════════════════════════════════════
  const MUD = [184, 150, 110], MUD_D = [150, 118, 86], PALM = [66, 102, 60], TRUNK = [104, 82, 60], SYC = [74, 108, 66];
  function drawPalm(ctx, xf, layer, s, seed) {
    const ph = PH(layer), x = xf * W.w, g = gY(layer, xf) + 0.05 * ph, H = s * ph, lean = (hsh(seed) - 0.5) * 0.5 * ph * s;
    const cx = x + lean, cy = g - H;
    ctx.strokeStyle = css(TRUNK, layer);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 0.1 * ph * s * 0.6);
    ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x + lean * 0.2, g - H * 0.5, cx, cy); ctx.stroke();
    // 树干的节
    ctx.strokeStyle = css(dim(TRUNK, 0.7), layer, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.03 * ph * s);
    ctx.beginPath();
    for (let i = 1; i < 7; i++) { const t = i / 7, px = lerp(x, cx, t * t * 0.6 + t * 0.4), py = lerp(g, cy, t), w = 0.06 * ph * s * 0.6; ctx.moveTo(px - w, py); ctx.lineTo(px + w, py + 0.02 * ph); }
    ctx.stroke();
    // 叶：自树冠垂下的长叶
    const sway = Math.sin(W.t * 0.9 + seed) * 0.05;
    ctx.strokeStyle = css(PALM, layer);
    ctx.lineWidth = Math.max(0.8, 0.07 * ph * s * 0.7);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.42 + sway, L = (0.75 + 0.2 * hsh(seed + i)) * ph * s * 0.62;
      const ex = cx + Math.cos(a) * L * 1.1, ey = cy + Math.sin(a) * L * 0.45 + L * 0.55 * Math.abs(Math.cos(a));
      ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx + Math.cos(a) * L * 0.6, cy + Math.sin(a) * L * 0.8, ex, ey);
    }
    ctx.stroke();
    ctx.strokeStyle = css(lit(PALM), layer, rimA() * 0.7, 0.04);
    ctx.lineWidth = Math.max(0.5, 0.025 * ph * s);
    ctx.beginPath();
    for (let i = 2; i < 6; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.42 + sway, L = (0.75 + 0.2 * hsh(seed + i)) * ph * s * 0.62;
      ctx.moveTo(cx, cy - 1); ctx.quadraticCurveTo(cx + Math.cos(a) * L * 0.6, cy + Math.sin(a) * L * 0.8 - 1, cx + Math.cos(a) * L * 1.1, cy + Math.sin(a) * L * 0.45 + L * 0.55 * Math.abs(Math.cos(a)) - 1);
    }
    ctx.stroke();
    // 枣
    ctx.fillStyle = css([150, 96, 52], layer, 0.9);
    ctx.beginPath(); ctx.ellipse(cx, cy + 0.08 * ph * s, 0.07 * ph * s, 0.1 * ph * s, 0, 0, TAU); ctx.fill();
    ctx.lineCap = 'butt';
  }
  function house(ctx, xf, w, h, seed, lamp) {
    const ph = PH(2), un = UN(), x = xf * W.w, g = gB(2, xf) + 0.1 * ph, W2 = w * ph, H = h * ph, sunL = litX() < x;
    ctx.fillStyle = css(MUD, 2);
    ctx.fillRect(x - W2 / 2, g - H, W2, H + 2);
    ctx.fillStyle = css(MUD_D, 2);
    ctx.fillRect(sunL ? x + W2 / 2 - W2 * 0.2 : x - W2 / 2, g - H, W2 * 0.2, H + 2);
    // 屋顶的矮墙与木梁
    ctx.fillStyle = css(MUD, 2);
    ctx.fillRect(x - W2 / 2 - 0.02 * ph, g - H - 0.14 * ph, W2 + 0.04 * ph, 0.14 * ph);
    ctx.fillStyle = css(CEDAR, 2, 0.9);
    for (let i = 0; i < 4; i++) ctx.fillRect(x - W2 / 2 + W2 * (0.15 + i * 0.22), g - H + 0.02 * ph, 0.05 * ph, 0.05 * ph);
    // 门与窗
    const dw = 0.3 * ph, dh = 0.62 * ph, dx = x + (hsh(seed) - 0.5) * W2 * 0.3;
    ctx.fillStyle = css([38, 30, 24], 2);
    ctx.fillRect(dx - dw / 2, g - dh, dw, dh);
    const wx = x + (dx < x ? 1 : -1) * W2 * 0.26, wy = g - H * 0.72, ws = 0.14 * ph;
    ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.3);
    if (lamp > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp(lamp, 0, 1);
      ctx.fillStyle = 'rgb(255,190,110)';
      ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.3);
      ctx.globalAlpha = clamp(lamp * 0.85, 0, 1);
      ctx.fillRect(dx - dw / 2, g - dh, dw, dh);
      glowAt(ctx, SP.warm, dx, g - dh * 0.5, dh * 1.4, lamp * 0.5);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = css(lit(MUD), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.6, 0.9 * un);
    ctx.beginPath();
    const ex = sunL ? x - W2 / 2 : x + W2 / 2;
    ctx.moveTo(ex, g); ctx.lineTo(ex, g - H - 0.14 * ph); ctx.lineTo(x, g - H - 0.14 * ph);
    ctx.stroke();
    return { x, g, W2, H, dx, dw, dh };
  }
  // 桑树（路 19:4）：短而粗的干，低处分出几条大枝，宽阔的树冠
  let SY = null;
  function sycGeo() {
    const key = W.w + 'x' + W.h;
    if (SY && SY.key === key) return SY;
    const ph = PH(2), x = X('syc') * W.w, g = gB(2, X('syc')) + 0.06 * ph, s = tall() ? 1.05 : 1;
    const H = 3.3 * ph * s, cw = 2.15 * ph * s;
    const r = U.mulberry32(7717), leaves = [];
    for (let i = 0; i < 56; i++) {
      const a = r() * TAU, rr = Math.sqrt(r());
      leaves.push([x + Math.cos(a) * rr * cw, g - H * 0.74 + Math.sin(a) * rr * 0.62 * ph * s - (1 - rr) * 0.25 * ph, (0.22 + 0.16 * r()) * ph * s, r()]);
    }
    const branch = [x - 0.66 * ph * s, g - H * 0.6];     // 撒该坐的那条枝
    return (SY = { key, x, g, H, cw, ph, s, leaves, branch });
  }
  function drawSycamore(ctx, a) {
    const G = sycGeo(), ph = G.ph, x = G.x, g = G.g, H = G.H;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = css([92, 78, 60], 2);
    ctx.beginPath();
    ctx.moveTo(x - 0.26 * ph, g + 2);
    ctx.bezierCurveTo(x - 0.16 * ph, g - H * 0.2, x - 0.22 * ph, g - H * 0.3, x - 0.12 * ph, g - H * 0.38);
    ctx.lineTo(x + 0.14 * ph, g - H * 0.38);
    ctx.bezierCurveTo(x + 0.2 * ph, g - H * 0.28, x + 0.16 * ph, g - H * 0.18, x + 0.26 * ph, g + 2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([92, 78, 60], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.4, 0.13 * ph);
    ctx.beginPath();
    ctx.moveTo(x - 0.05 * ph, g - H * 0.36); ctx.quadraticCurveTo(x - 0.3 * ph, g - H * 0.44, G.branch[0] - 0.15 * ph, G.branch[1] + 0.02 * ph);
    ctx.moveTo(x, g - H * 0.37); ctx.quadraticCurveTo(x + 0.05 * ph, g - H * 0.55, x + 0.1 * ph, g - H * 0.78);
    ctx.moveTo(x + 0.05 * ph, g - H * 0.36); ctx.quadraticCurveTo(x + 0.4 * ph, g - H * 0.45, x + 0.85 * ph, g - H * 0.6);
    ctx.stroke();
    ctx.lineWidth = Math.max(0.8, 0.07 * ph);
    ctx.beginPath();
    ctx.moveTo(G.branch[0] - 0.1 * ph, G.branch[1] + 0.01 * ph); ctx.lineTo(G.branch[0] - 0.55 * ph, G.branch[1] - 0.12 * ph);
    ctx.stroke();
    ctx.lineCap = 'butt';
    const leaf = SYC;
    ctx.fillStyle = css(dim(leaf, 0.8), 2);
    ctx.beginPath();
    for (const q of G.leaves) { ctx.moveTo(q[0] + q[2], q[1] + q[2] * 0.25); ctx.ellipse(q[0], q[1] + q[2] * 0.25, q[2], q[2] * 0.66, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(leaf, 2);
    ctx.beginPath();
    for (const q of G.leaves) { const r2 = q[2] * 0.8; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.1); ctx.ellipse(q[0], q[1] - q[2] * 0.1, r2, r2 * 0.6, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(lit(leaf), 2, rimA() * 0.9, 0.05);
    ctx.beginPath();
    for (const q of G.leaves) { if (q[3] < 0.55) continue; const r2 = q[2] * 0.5; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.3); ctx.ellipse(q[0], q[1] - q[2] * 0.3, r2, r2 * 0.4, 0, Math.PI, TAU); }
    ctx.fill();
    // 无花果般的小果
    ctx.fillStyle = css([170, 120, 70], 2, 0.85);
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const q = G.leaves[(i * 5) % G.leaves.length], ox = q[0] + (hsh(i) - 0.5) * q[2], oy = q[1] + q[2] * 0.4; ctx.moveTo(ox + 0.035 * ph, oy); ctx.arc(ox, oy, 0.035 * ph, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const branchPt = () => { const G = sycGeo(); return [G.branch[0], G.branch[1]]; };
  // 撒该爬上桑树：自树下（地上）到枝上（按程度混合，重演时一样）
  function zacPt() {
    const f = fig('zac');
    const k = lv('glClimb'), B = branchPt(), G = sycGeo();
    const gx = f ? f.nx * W.w : G.x - 0.3 * G.ph;
    const base = [gx, gY(2, gx / W.w)];
    const up = sm(0, 1, k);
    return [lerp(base[0], B[0], up), lerp(base[1], B[1], up) - Math.sin(Math.PI * up) * 0.15 * G.ph];
  }
  function drawJericho(ctx, pass) {
    const a = lv('glJericho');
    if (a < 0.01) return;
    ctx.save();
    if (pass === 'mid') {
      ctx.globalAlpha = clamp(a, 0, 1);
      X('mpalms').forEach((xf, i) => drawPalm(ctx, xf, 1, 2.2 + 0.4 * hsh(i + 3), 40 + i));
      ctx.restore();
      ctx.globalAlpha = 1;
      return;
    }
    ctx.globalAlpha = clamp(a, 0, 1);
    X('houses').forEach((xf, i) => house(ctx, xf, 1.1 + 0.25 * i, 1.05 + 0.2 * hsh(i + 5), i + 2, 0.5 * nightK()));
    // 撒该的家：大些，外有石阶
    const zh = house(ctx, X('zh'), 1.9, 1.5, 9, clamp(lv('glHouse'), 0, 1) * 0.95 + 0.4 * nightK());
    ctx.fillStyle = css(MUD_D, 2);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const sx = zh.x + zh.W2 / 2 - 0.02 * zh.W2, sw = (4 - i) * 0.12 * PH(2); ctx.rect(sx, zh.g - (i + 1) * zh.H * 0.2, sw, zh.H * 0.2 + 1); }
    ctx.fill();
    X('palms').forEach((xf, i) => drawPalm(ctx, xf, 2, 3.1 + 0.5 * hsh(i + 1), 10 + i));
    drawSycamore(ctx, a);
    ctx.restore();
    ctx.globalAlpha = 1;
    // 满了光的家
    const hk = lv('glHouse');
    if (hk > 0.4) {
      SP || sprites();
      const k2 = (hk - 0.4) / 0.6;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, zh.x, zh.g - zh.H * 0.6, zh.W2 * 2.4, a * k2 * 0.6, 0.75);
      glowAt(ctx, SP.warm, zh.x, zh.g - zh.H * 0.4, zh.W2 * 1.2, a * k2 * 0.45, 0.8);
      glowAt(ctx, SP.white, zh.dx, zh.g - zh.dh * 0.5, zh.dh * 1.3, a * k2 * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  const zhouseDoor = () => { const ph = PH(2); return [X('zh') * W.w, gB(2, X('zh')) - 0.3 * ph]; };

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷（近地）：橄榄山、路、城门与城墙、山上的城与殿、殿院
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  const HN = 60;
  function city() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (CITY && CITY.key === key) return CITY;
    const ph = PH(2), x0 = X('hill0'), x1 = 1.04, tx = X('temple'), gx = X('gate');
    const gro = new Float32Array(HN + 1), top = new Float32Array(HN + 1);
    const H = (tall() ? 1.9 : 1.75) * ph, rw = tall() ? 0.09 : 0.06, bw = tall() ? 0.13 : 0.09;
    for (let i = 0; i <= HN; i++) {
      const xf = lerp(x0, x1, i / HN), g = gB(2, Math.min(1, xf));
      const rise = sm(x0, x0 + rw, xf), bump = Math.exp(-Math.pow((xf - tx) / bw, 2));
      gro[i] = g;
      top[i] = g - H * rise * (0.52 + 0.48 * bump + 0.03 * Math.sin(xf * 57));
    }
    const at = (arr, xf) => {
      if (xf <= x0) return gB(2, Math.max(0, xf));
      if (xf >= x1) return arr[HN];
      const f = (xf - x0) / (x1 - x0) * HN, i = Math.min(HN - 1, Math.floor(f)), k = f - i;
      return arr[i] + (arr[i + 1] - arr[i]) * k;
    };
    const Cm = { key, ph, x0, x1, tx, gx, gro, top, H };
    Cm.g = xf => at(gro, xf); Cm.t = xf => at(top, xf);
    const r = U.mulberry32(8123), HS = [];
    const K = [0.86, 0.56, 0.28];
    for (let row = 0; row < 3; row++) {
      let x = (gx + 0.015 + row * 0.01) * W.w + r() * 0.3 * ph;
      while (x < 1.01 * W.w) {
        const w = (0.5 + 0.4 * r()) * ph, xf = (x + w / 2) / W.w;
        const dx = Math.abs(xf - tx) * W.w;
        const skip = (row === 0 && dx < 2.2 * ph) || (row === 1 && dx < 1.5 * ph);
        if (!skip) HS.push({ xf, w: w / W.w, row, k: K[row], h: 0.4 + 0.3 * r() + (r() < 0.1 ? 0.28 : 0), win: r(), dome: r() < 0.14, lampT: r() });
        x += w + (0.06 + 0.26 * r()) * ph;
      }
    }
    Cm.houses = HS;
    Cm.rows = [0, 1, 2].map(rr => HS.filter(h => h.row === rr));
    const TW = [];
    TW.push({ x: gx - 0.6 * ph / W.w, gate: true }, { x: gx + 0.6 * ph / W.w, gate: true });
    let t = gx + 0.6 * ph / W.w + 3 * ph / W.w;
    while (t < 1.02) { TW.push({ x: t, gate: false }); t += 3 * ph / W.w; }
    Cm.towers = TW;
    Cm.wx0 = gx - 0.95 * ph / W.w;
    return (CITY = Cm);
  }
  function drawHill(ctx, Cm) {
    const un = UN();
    ctx.fillStyle = css(HILLC, 2);
    ctx.beginPath();
    ctx.moveTo(Cm.x0 * W.w, Cm.gro[0] + 3);
    for (let i = 0; i <= HN; i++) ctx.lineTo(lerp(Cm.x0, Cm.x1, i / HN) * W.w, Cm.top[i]);
    for (let i = HN; i >= 0; i--) ctx.lineTo(lerp(Cm.x0, Cm.x1, i / HN) * W.w, Cm.gro[i] + 3);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(lit(HILLC), 2, rimA() * 0.8, 0.05);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath();
    for (let i = 0; i <= HN; i++) { const x = lerp(Cm.x0, Cm.x1, i / HN) * W.w; if (i) ctx.lineTo(x, Cm.top[i]); else ctx.moveTo(x, Cm.top[i]); }
    ctx.stroke();
  }
  function houseRect(Cm, h) {
    const ph = Cm.ph, x = h.xf * W.w, w = h.w * W.w, b = lerp(Cm.g(h.xf), Cm.t(h.xf), h.k) + 0.06 * ph, hh = h.h * ph;
    return [x - w / 2, b - hh, w, hh];
  }
  function drawHouses(ctx, Cm, row) {
    const ph = Cm.ph, un = UN(), sunL = litX() < Cm.tx * W.w, nk = nightK();
    const hs = Cm.rows[row];
    const body = mix(LIME, [196, 180, 150], row * 0.15);
    ctx.fillStyle = css(body, 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h); ctx.rect(q[0], q[1], q[2], q[3] + 0.3 * ph); }
    ctx.fill();
    ctx.fillStyle = css(dim(body, 0.76), 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), sw = q[2] * 0.24; ctx.rect(sunL ? q[0] + q[2] - sw : q[0], q[1], sw, q[3] + 0.3 * ph); }
    ctx.fill();
    ctx.fillStyle = css(body, 2);
    ctx.beginPath();
    for (const h of hs) if (h.dome) { const q = houseRect(Cm, h), r0 = q[2] * 0.3; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
    ctx.fill();
    ctx.fillStyle = css(CEDAR, 2, 0.85);
    ctx.beginPath();
    for (const h of hs) if (!h.dome) { const q = houseRect(Cm, h); ctx.rect(q[0] - 0.5 * un, q[1] - 1.2 * un, q[2] + un, 1.4 * un); }
    ctx.fill();
    ctx.strokeStyle = css(lit(body), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), ex = sunL ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] / 2, q[1]); }
    ctx.stroke();
    const wr = (q, h) => { const s = Math.max(1, ph * 0.09); return [q[0] + q[2] * (0.2 + 0.55 * h.win), q[1] + q[3] * 0.28, s, s * 1.5]; };
    ctx.fillStyle = css([40, 30, 24], 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), r1 = wr(q, h); ctx.rect(r1[0], r1[1], r1[2], r1[3]); }
    ctx.fill();
    const la = nk * (0.5 + 0.5 * lv('glLamps'));
    if (la > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 196, 118, clamp(0.9 * la, 0, 1));
      ctx.beginPath();
      for (const h of hs) { if (h.lampT > 0.7) continue; const q = houseRect(Cm, h), r1 = wr(q, h); ctx.rect(r1[0], r1[1], r1[2], r1[3]); }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 城墙、城楼、城门（渐隐时露出殿院）
  function block(ctx, x, yb, w, h, cren) {
    ctx.rect(x, yb - h, w, h + 2);
    if (cren) {
      const n = Math.max(1, Math.floor(w / (cren * 2)));
      const off = (w - (n * 2 - 1) * cren) / 2;
      for (let i = 0; i < n; i++) ctx.rect(x + off + i * cren * 2, yb - h - cren * 0.7, cren, cren * 0.7 + 1);
    }
  }
  function drawWall(ctx, Cm, a) {
    if (a < 0.01) return;
    const ph = Cm.ph, un = UN(), sunL = litX() < Cm.gx * W.w;
    const wc = mix(LIME, [190, 170, 132], 0.3), WH = 0.9 * ph, TWH = 1.28 * ph, tw = 0.5 * ph, cren = Math.max(1.4, 0.14 * ph);
    const gl = (Cm.gx - 0.6 * ph / W.w) * W.w, gr = (Cm.gx + 0.6 * ph / W.w) * W.w;
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = css(wc, 2);
    ctx.beginPath();
    const xa = Cm.wx0 * W.w;
    block(ctx, xa, Cm.g(Cm.wx0) + 0.05 * ph, gl - xa, WH * 0.9, cren);
    let x = gr;
    while (x < W.w + 20) {
      const xn = Math.min(W.w + 20, x + 1.6 * ph), g = Cm.g(Math.min(1, (x + xn) / 2 / W.w)) + 0.05 * ph;
      block(ctx, x, g, xn - x + 0.5, WH, cren);
      x = xn;
    }
    for (const t of Cm.towers) { const tx = t.x * W.w, g = Cm.g(t.x) + 0.05 * ph; block(ctx, tx - tw / 2, g, tw, t.gate ? TWH * 1.08 : TWH, cren); }
    ctx.fill();
    const gxx = Cm.gx * W.w, gg = Cm.g(Cm.gx) + 0.05 * ph, aw = 0.52 * ph, ah = 0.78 * ph;
    ctx.fillStyle = css(wc, 2);
    ctx.fillRect(gl, gg - WH * 1.05, gr - gl, WH * 1.05 + 2);
    ctx.fillStyle = css([34, 28, 24], 2);
    ctx.beginPath();
    ctx.moveTo(gxx - aw / 2, gg + 2); ctx.lineTo(gxx - aw / 2, gg - ah + aw / 2); ctx.arc(gxx, gg - ah + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(gxx + aw / 2, gg + 2); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(dim(wc, 0.7), 2, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let k = 1; k < 4; k++) { const yy = k / 4; x = xa; while (x < W.w) { const g = Cm.g(Math.min(1, x / W.w)) + 0.05 * ph; ctx.moveTo(x, g - WH * yy); ctx.lineTo(x + ph * 0.5, g - WH * yy); x += ph * 0.5; } }
    ctx.stroke();
    ctx.strokeStyle = css(lit(wc), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    for (const t of Cm.towers) { const tx = t.x * W.w, g = Cm.g(t.x) + 0.05 * ph, ex = sunL ? tx - tw / 2 : tx + tw / 2; ctx.moveTo(ex, g - WH * 0.9); ctx.lineTo(ex, g - TWH); }
    ctx.stroke();
    const la = nightK() * 0.6;
    if (la > 0.03) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, gxx, gg - ah * 0.45, aw * 1.8, la * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 殿：台、廊、殿身、金边；门里是幔子（蓝色、紫色、朱红色）
  function tgeo() {
    const Cm = city(), ph = Cm.ph, x = Cm.tx * W.w, y = Cm.t(Cm.tx) + 0.1 * ph;
    return { x, y, ph, pw: 3.4 * ph, pH: 0.32 * ph, hw: 2.3 * ph, hh: 1.1 * ph, fw: 1.05 * ph, fh: 1.7 * ph };
  }
  function drawTemple(ctx) {
    const G = tgeo(), ph = G.ph, un = UN(), sunL = litX() < G.x, y0 = G.y - G.pH;
    const body = [236, 228, 206];
    ctx.fillStyle = css(LIME_D, 2);
    ctx.fillRect(G.x - G.pw / 2, G.y - G.pH, G.pw, G.pH + 0.8 * ph);
    const cx = G.x - G.hw * 0.08, hx0 = G.x - G.hw * 0.46, hx1 = G.x + G.hw * 0.54, fx0 = cx - G.fw / 2, fx1 = cx + G.fw / 2;
    ctx.fillStyle = css(body, 2);
    ctx.fillRect(hx0, y0 - G.hh, hx1 - hx0, G.hh + 1);
    ctx.fillStyle = css(dim(body, 0.8), 2);
    const sw = (hx1 - hx0) * 0.14;
    ctx.fillRect(sunL ? hx1 - sw : hx0, y0 - G.hh, sw, G.hh + 1);
    ctx.fillStyle = css(sunL ? lit(body) : body, 2, null, sunL ? 0.03 : 0);
    ctx.fillRect(fx0, y0 - G.fh, fx1 - fx0, G.fh + 1);
    // 石层
    ctx.strokeStyle = css(dim(body, 0.64), 2, 0.28);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    const band = G.hh / 9;
    for (let yy = y0 - band; yy > y0 - G.fh; yy -= band) {
      if (y0 - yy <= G.hh) { ctx.moveTo(hx0, yy); ctx.lineTo(fx0, yy); ctx.moveTo(fx1, yy); ctx.lineTo(hx1, yy); }
      ctx.moveTo(fx0, yy); ctx.lineTo(fx1, yy);
    }
    ctx.stroke();
    // 檐与金边
    ctx.fillStyle = css(lit(body), 2, null, 0.05);
    ctx.fillRect(hx0 - 0.04 * ph, y0 - G.hh - 0.07 * ph, hx1 - hx0 + 0.08 * ph, 0.07 * ph);
    ctx.fillRect(fx0 - 0.05 * ph, y0 - G.fh - 0.08 * ph, fx1 - fx0 + 0.1 * ph, 0.08 * ph);
    ctx.fillStyle = css(GOLD, 2, 1, 0.12);
    ctx.fillRect(fx0 - 0.05 * ph, y0 - G.fh - 0.11 * ph, fx1 - fx0 + 0.1 * ph, 0.035 * ph);
    ctx.fillRect(hx0 - 0.04 * ph, y0 - G.hh - 0.1 * ph, hx1 - hx0 + 0.08 * ph, 0.03 * ph);
    // 窄窗
    ctx.fillStyle = css([36, 28, 24], 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const wx = lerp(fx1 + 0.14 * ph, hx1 - 0.12 * ph, i / 4); ctx.rect(wx - 0.035 * ph, y0 - G.hh * 0.84, 0.07 * ph, G.hh * 0.22); }
    ctx.fill();
    // 门与门里的幔子
    const dw = 0.34 * G.fw, dh = 0.5 * G.fh;
    ctx.fillStyle = css(dim(body, 0.66), 2);
    ctx.fillRect(cx - dw / 2 - 0.05 * ph, y0 - dh - 0.05 * ph, dw + 0.1 * ph, dh + 0.05 * ph);
    const VEIL = [[64, 72, 150], [110, 60, 118], [168, 48, 52]];
    for (let i = 0; i < 6; i++) { ctx.fillStyle = css(VEIL[i % 3], 2, null, 0.02); ctx.fillRect(cx - dw / 2 + dw * i / 6, y0 - dh, dw / 6 + 0.5, dh); }
    ctx.fillStyle = css(GOLD, 2, 0.8, 0.1);
    ctx.fillRect(cx - dw / 2, y0 - dh, dw, 0.04 * ph);
    // 迎光的边
    ctx.strokeStyle = css(lit(body), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.8, 1.1 * un);
    ctx.beginPath();
    ctx.moveTo(fx0, y0 - G.fh); ctx.lineTo(fx1, y0 - G.fh);
    if (sunL) { ctx.moveTo(fx0, y0); ctx.lineTo(fx0, y0 - G.fh); }
    ctx.moveTo(fx1, y0 - G.hh); ctx.lineTo(hx1, y0 - G.hh);
    if (!sunL) ctx.lineTo(hx1, y0);
    ctx.stroke();
    // 殿在日光与灯光里
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, y0 - G.fh * 0.6, G.fh * 1.2, 0.08 + 0.2 * W.dusk + 0.22 * nightK() * (0.4 + 0.6 * lv('glLamps')));
    ctx.globalCompositeOperation = 'source-over';
  }
  // 殿院：铺石的院子与柱廊
  function drawCourt(ctx, Cm, a) {
    if (a < 0.01) return;
    const ph = Cm.ph, un = UN(), x0 = (Cm.gx - 0.02) * W.w, sunL = litX() < W.w * 0.8;
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1);
    // 柱廊（所罗门的廊）
    const colH = 1.55 * ph, pw = 0.13 * ph, step = 0.72 * ph;
    const base = x => Cm.g(Math.min(1, x / W.w)) + 0.05 * ph;
    ctx.fillStyle = css([222, 210, 182], 2);
    ctx.beginPath();
    for (let x = x0 + step * 0.5; x < W.w + step; x += step) { const g = base(x); ctx.rect(x - pw / 2, g - colH, pw, colH + 2); }
    ctx.fill();
    ctx.fillStyle = css([200, 186, 156], 2);
    ctx.beginPath();
    for (let x = x0; x < W.w + step; x += step * 0.5) { const g = base(x); ctx.rect(x, g - colH - 0.2 * ph, step * 0.5 + 0.5, 0.2 * ph); }
    ctx.fill();
    ctx.fillStyle = css(CEDAR, 2, 0.9);
    ctx.beginPath();
    for (let x = x0; x < W.w + step; x += step * 0.5) { const g = base(x); ctx.rect(x, g - colH - 0.28 * ph, step * 0.5 + 0.5, 0.08 * ph); }
    ctx.fill();
    ctx.strokeStyle = css(lit([222, 210, 182]), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.6, 0.9 * un);
    ctx.beginPath();
    for (let x = x0 + step * 0.5; x < W.w + step; x += step) { const g = base(x), ex = sunL ? x - pw / 2 : x + pw / 2; ctx.moveTo(ex, g); ctx.lineTo(ex, g - colH); }
    ctx.stroke();
    // 铺石的院子（近地）
    const N = 26, gyL = [];
    for (let i = 0; i <= N; i++) { const x = lerp(x0 - 0.02 * W.w, W.w + 4, i / N); gyL.push([x, gY(2, Math.min(1, x / W.w))]); }
    ctx.fillStyle = css([206, 192, 162], 2, 0.9);
    ctx.beginPath();
    ctx.moveTo(gyL[0][0], gyL[0][1]);
    for (const p of gyL) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(W.w + 4, W.h + 4); ctx.lineTo(gyL[0][0] + 0.08 * W.w, W.h + 4);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([160, 146, 118], 2, 0.4);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let r = 1; r < 6; r++) {
      const v = r / 6;
      for (let i = 0; i <= N; i++) { const p = gyL[i], y = p[1] + v * (W.h - p[1]); const x = p[0] + v * (i === 0 ? 0.08 * W.w : 0); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    }
    for (let i = 1; i < N; i += 1) { const p = gyL[i]; ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + (p[0] - W.w * 0.7) * 0.25, W.h); }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 橄榄山上的橄榄树
  function drawOlive(ctx, xf, s) {
    const ph = PH(2) * s, x = xf * W.w, g = gY(2, xf) + 0.06 * ph, H = 1.8 * ph;
    ctx.fillStyle = css([88, 72, 58], 2);
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * ph, g + 1);
    ctx.bezierCurveTo(x - 0.04 * ph, g - H * 0.18, x - 0.2 * ph, g - H * 0.3, x - 0.07 * ph, g - H * 0.44);
    ctx.lineTo(x + 0.09 * ph, g - H * 0.44);
    ctx.bezierCurveTo(x + 0.01 * ph, g - H * 0.3, x + 0.16 * ph, g - H * 0.18, x + 0.15 * ph, g + 1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 72, 58], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(0.8, 0.07 * ph);
    ctx.beginPath();
    for (const q of [[-0.42, 0.66], [0.02, 0.8], [0.4, 0.68]]) { ctx.moveTo(x, g - H * 0.42); ctx.quadraticCurveTo(x + q[0] * ph * 0.4, g - H * 0.55, x + q[0] * ph, g - H * q[1]); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    const leaf = [134, 148, 116], n = 22, P = [];
    for (let i = 0; i < n; i++) {
      const ang = i * 2.39996, rr = Math.sqrt((i + 0.5) / n);
      P.push([x + Math.cos(ang) * rr * 0.75 * ph, g - H * 0.74 + Math.sin(ang) * rr * 0.32 * ph, (0.15 + 0.07 * hsh(i * 1.3 + xf * 9)) * ph]);
    }
    ctx.fillStyle = css(dim(leaf, 0.8), 2);
    ctx.beginPath();
    for (const q of P) { ctx.moveTo(q[0] + q[2], q[1] + q[2] * 0.2); ctx.ellipse(q[0], q[1] + q[2] * 0.2, q[2], q[2] * 0.62, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(leaf, 2);
    ctx.beginPath();
    for (const q of P) { const r2 = q[2] * 0.78; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.12); ctx.ellipse(q[0], q[1] - q[2] * 0.12, r2, r2 * 0.58, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(lit(leaf), 2, rimA(), 0.06);
    ctx.beginPath();
    for (const q of P) { if (q[1] > g - H * 0.74) continue; const r2 = q[2] * 0.55; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.3); ctx.ellipse(q[0], q[1] - q[2] * 0.3, r2, r2 * 0.4, 0, Math.PI, TAU); }
    ctx.fill();
  }
  // 上耶路撒冷去的路：近地上一条浅色的土路
  function drawPath(ctx) {
    const a = lv('glRoad');
    if (a < 0.01) return;
    const ph = PH(2), x0 = X('road0'), x1 = lv('glCity') > 0.5 ? X('gate') : 1.02, N = 36;
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [w, c, al] of [[0.3, [150, 128, 96], 0.55], [0.16, [196, 176, 136], 0.5]]) {
      ctx.strokeStyle = css(c, 2, al);
      ctx.lineWidth = Math.max(1, w * ph);
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const xf = lerp(x0, x1, i / N), y = vY(Math.min(1, xf), ROADV + 0.012 * Math.sin(i * 0.7));
        if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y);
      }
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 路上铺的衣服与树枝（21:8）
  const CLOAK = [[176, 62, 58], [70, 96, 150], [196, 150, 70], [120, 70, 110], [80, 120, 90], [214, 196, 160], [150, 96, 70]];
  const ROADV = 0.34;
  function drawRoad(ctx) {
    const k = lv('glCloaks');
    if (k < 0.005) return;
    const ph = PH(2), x0 = X('road0'), x1 = X('gate') - 0.01, n = Math.max(8, Math.round((x1 - x0) * W.w / (0.5 * ph)));
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, a = sm(u - 0.04, u + 0.02, k);
      if (a < 0.01) continue;
      const xf = lerp(x0, x1, u), x = xf * W.w, y = vY(xf, ROADV + 0.07 * (hsh(i * 3.3) - 0.5));
      ctx.globalAlpha = a;
      if (i % 3 === 2) {
        // 树枝
        ctx.strokeStyle = css([72, 110, 58], 2);
        ctx.lineWidth = Math.max(0.7, 0.05 * ph);
        ctx.beginPath();
        const L = 0.5 * ph, ang = (hsh(i) - 0.5) * 0.5;
        ctx.moveTo(x - L * Math.cos(ang), y - L * Math.sin(ang) * 0.3); ctx.lineTo(x + L * Math.cos(ang), y + L * Math.sin(ang) * 0.3);
        for (let j = -3; j <= 3; j++) { const px = x + j * L * 0.28 * Math.cos(ang); ctx.moveTo(px, y); ctx.lineTo(px + 0.08 * ph, y - 0.07 * ph); ctx.moveTo(px, y); ctx.lineTo(px + 0.08 * ph, y + 0.05 * ph); }
        ctx.stroke();
      } else {
        const c = CLOAK[(i * 3 + 1) % CLOAK.length], w = (0.42 + 0.14 * hsh(i + 2)) * ph, h = 0.1 * ph;
        ctx.fillStyle = css(c, 2);
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, (hsh(i * 5) - 0.5) * 0.12, 0, TAU);
        ctx.fill();
        ctx.fillStyle = css(lit(c), 2, 0.5, 0.04);
        ctx.beginPath(); ctx.ellipse(x - w * 0.15, y - h * 0.3, w * 0.6, h * 0.35, 0, 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 众人手中的树枝（在人之前画）
  function drawBranches(ctx) {
    const k = lv('glBranches');
    if (k < 0.02) return;
    const ms = cmembers('hosanna');
    ctx.save();
    ctx.lineCap = 'round';
    ms.forEach((m, i) => {
      if (!m._vis || m.alpha < 0.1 || (m.age === 'child' && i % 2)) return;
      const h = m._h, f = m.fd >= 0 ? 1 : -1, up = m.pose === 'raise' ? 1 : 0;
      const hx = m._x + f * h * 0.16, hy = m._y - h * (0.6 + 0.32 * up);
      const sway = Math.sin(W.t * (1.6 + 0.8 * up) + i * 1.7) * (0.12 + 0.2 * up);
      const L = h * 0.58, ang = -Math.PI / 2 + f * (0.3 + 0.15 * hsh(i)) + sway;
      const tx = hx + Math.cos(ang) * L, ty = hy + Math.sin(ang) * L;
      const bx = hx + Math.cos(ang) * L * 0.5 + f * h * 0.06, by = hy + Math.sin(ang) * L * 0.5;
      ctx.globalAlpha = clamp(k * m.alpha, 0, 1);
      ctx.strokeStyle = css([86, 124, 62], 2);
      ctx.lineWidth = Math.max(0.6, 0.03 * h);
      ctx.beginPath();
      ctx.moveTo(hx, hy); ctx.quadraticCurveTo(bx, by, tx, ty);
      // 两旁下垂的小叶
      for (let j = 2; j <= 8; j++) {
        const t = j / 9, u = 1 - t;
        const px = u * u * hx + 2 * u * t * bx + t * t * tx, py = u * u * hy + 2 * u * t * by + t * t * ty;
        const ll = h * 0.17 * (1 - t * 0.55);
        for (const sd of [-1, 1]) {
          const a2 = ang + sd * 2.2;
          ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a2) * ll, py + Math.sin(a2) * ll + ll * 0.35);
        }
      }
      ctx.stroke();
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 殿院里的桌子、凳子与鸽笼；银库；灯；两个小钱 ────────────
  const WOODT = [128, 94, 62];
  function drawTables(ctx) {
    const a = lv('glTables');
    if (a < 0.01) return;
    const ph = PH(2), un = UN(), k = lv('glTumble');
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1);
    X('tables').forEach((xf, i) => {
      const x = xf * W.w, g = vY(xf, 0.1), w = 1.05 * ph, h = 0.46 * ph, rot = ease(clamp(k * 1.2 - i * 0.1, 0, 1));
      ctx.save();
      const pivot = [x + w * 0.5 * (i % 2 ? -1 : 1), g];
      ctx.translate(pivot[0], pivot[1]);
      ctx.rotate(rot * (i % 2 ? -1.45 : 1.45));
      ctx.translate(-pivot[0], -pivot[1]);
      ctx.fillStyle = css(WOODT, 2);
      ctx.fillRect(x - w / 2, g - h, w, 0.08 * ph);
      ctx.fillRect(x - w / 2 + 0.06 * ph, g - h, 0.06 * ph, h);
      ctx.fillRect(x + w / 2 - 0.12 * ph, g - h, 0.06 * ph, h);
      ctx.fillStyle = css(lit(WOODT), 2, rimA(), 0.05);
      ctx.fillRect(x - w / 2, g - h, w, 0.025 * ph);
      if (rot < 0.3) {
        // 一摞一摞的钱
        ctx.fillStyle = css([226, 190, 104], 2, 1 - rot * 3, 0.1);
        for (let j = 0; j < 4; j++) { const cx = x - w * 0.3 + j * w * 0.2, n = 2 + (j + i) % 3; for (let q = 0; q < n; q++) ctx.fillRect(cx - 0.05 * ph, g - h - (q + 1) * 0.03 * ph, 0.1 * ph, 0.025 * ph); }
      }
      ctx.restore();
      if (rot > 0.2) {
        // 散落在地上的钱
        ctx.fillStyle = css([230, 196, 110], 2, clamp((rot - 0.2) * 1.5, 0, 1), 0.12);
        ctx.beginPath();
        for (let j = 0; j < 14; j++) { const cx = x + (hsh(i * 20 + j) - 0.5) * w * 2 * rot, cy = g + (hsh(i * 30 + j) - 0.3) * 0.18 * ph; ctx.moveTo(cx + 0.03 * ph, cy); ctx.ellipse(cx, cy, 0.03 * ph, 0.015 * ph, 0, 0, TAU); }
        ctx.fill();
      }
    });
    // 卖鸽子的凳子与鸽笼
    const bx = X('bench') * W.w, bg = vY(X('bench'), 0.08), bw = 0.9 * ph, bh = 0.34 * ph, rot = ease(clamp(k * 1.2 - 0.3, 0, 1));
    ctx.save();
    ctx.translate(bx - bw / 2, bg); ctx.rotate(-rot * 1.3); ctx.translate(-(bx - bw / 2), -bg);
    ctx.fillStyle = css(WOODT, 2);
    ctx.fillRect(bx - bw / 2, bg - bh, bw, 0.07 * ph);
    ctx.fillRect(bx - bw / 2 + 0.05 * ph, bg - bh, 0.06 * ph, bh);
    ctx.fillRect(bx + bw / 2 - 0.11 * ph, bg - bh, 0.06 * ph, bh);
    ctx.restore();
    for (let j = 0; j < 2; j++) {
      const cx0 = bx - bw * 0.22 + j * bw * 0.44, cy0 = bg - bh;
      const cx = lerp(cx0, cx0 - (0.4 + j * 0.5) * ph, rot), cy = lerp(cy0, bg + 0.02 * ph, rot), r = 0.2 * ph, tilt = rot * (j ? 1.4 : -1.1);
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(tilt);
      ctx.strokeStyle = css([150, 118, 76], 2);
      ctx.lineWidth = Math.max(0.6, 0.03 * ph);
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI, TAU);
      for (let q = -2; q <= 2; q++) { ctx.moveTo(q * r * 0.4, 0); ctx.quadraticCurveTo(q * r * 0.45, -r * 0.9, 0, -r); }
      ctx.moveTo(-r, 0); ctx.lineTo(r, 0);
      ctx.stroke();
      if (rot < 0.5) {
        ctx.fillStyle = css([236, 234, 226], 2, 1 - rot * 2, 0.05);
        ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.26, r * 0.18, 0, 0, TAU); ctx.ellipse(r * 0.3, -r * 0.35, r * 0.24, r * 0.17, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    void un;
  }
  const BRONZE = [176, 122, 72];
  function chestGeo() { const ph = PH(2), xf = X('chest'); return { x: xf * W.w, g: vY(xf, 0.08), w: 0.62 * ph, h: 0.5 * ph, ph }; }
  function drawChest(ctx) {
    const a = lv('glChest');
    if (a < 0.01) return;
    const G = chestGeo(), ph = G.ph, un = UN(), sunL = litX() < G.x;
    ctx.save();
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.fillStyle = css(dim(BRONZE, 0.8), 2);
    ctx.fillRect(G.x - G.w / 2, G.g - G.h, G.w, G.h);
    ctx.fillStyle = css(BRONZE, 2);
    ctx.fillRect(G.x - G.w / 2, G.g - G.h, G.w, 0.08 * ph);
    // 喇叭形的口
    ctx.fillStyle = css(BRONZE, 2);
    ctx.beginPath();
    ctx.moveTo(G.x - 0.08 * ph, G.g - G.h);
    ctx.quadraticCurveTo(G.x - 0.1 * ph, G.g - G.h - 0.35 * ph, G.x - 0.26 * ph, G.g - G.h - 0.52 * ph);
    ctx.lineTo(G.x + 0.26 * ph, G.g - G.h - 0.52 * ph);
    ctx.quadraticCurveTo(G.x + 0.1 * ph, G.g - G.h - 0.35 * ph, G.x + 0.08 * ph, G.g - G.h);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 30, 22], 2);
    ctx.beginPath(); ctx.ellipse(G.x, G.g - G.h - 0.52 * ph, 0.26 * ph, 0.06 * ph, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(lit(BRONZE), 2, rimA() + 0.15, 0.12);
    ctx.lineWidth = Math.max(0.7, un);
    ctx.beginPath();
    const ex = sunL ? G.x - G.w / 2 : G.x + G.w / 2;
    ctx.moveTo(ex, G.g); ctx.lineTo(ex, G.g - G.h);
    ctx.moveTo(G.x + (sunL ? -0.26 : 0.26) * ph, G.g - G.h - 0.52 * ph); ctx.quadraticCurveTo(G.x + (sunL ? -0.1 : 0.1) * ph, G.g - G.h - 0.35 * ph, G.x + (sunL ? -0.08 : 0.08) * ph, G.g - G.h);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const chestMouth = () => { const G = chestGeo(); return [G.x, G.g - G.h - 0.52 * G.ph]; };
  function drawMites(ctx) {
    const k = lv('glMites');
    if (k < 0.01) return;
    SP || sprites();
    const m = chestMouth(), ph = PH(2), su = SU(), up = ease(clamp(k, 0, 1));
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 2; i++) {
      const x = m[0] + (i ? 1 : -1) * (0.08 + 0.14 * up) * ph + Math.sin(W.t * 0.7 + i * 2) * 1.5 * su;
      const y = m[1] - (0.25 + 2.3 * up) * ph + Math.cos(W.t * 0.6 + i) * 1.5 * su;
      const tw = 0.85 + 0.15 * Math.sin(W.t * 2.1 + i * 1.3);
      glowAt(ctx, SP.gold, x, y, (10 + 17 * up) * su, k * 0.7 * tw);
      glowAt(ctx, SP.warm, x, y, (5 + 5 * up) * su, k * 0.45);
      glowAt(ctx, SP.white, x, y, (2.6 + 2.6 * up) * su, k);
    }
    glowAt(ctx, SP.gold, m[0], m[1] - (0.25 + 2.3 * up) * ph, 3 * ph, k * (0.16 + 0.14 * nightK()));
    // 细细的光自小钱垂到银库
    ctx.globalAlpha = clamp(k * 0.25 * up, 0, 1);
    ctx.drawImage(SP.beam, m[0] - 0.5 * ph, m[1] - (0.25 + 2.3 * up) * ph, ph, (0.25 + 2.3 * up) * ph);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawLamps(ctx) {
    const a = lv('glCourt');
    if (a < 0.05) return;
    const ph = PH(2), k = lv('glLamps');
    X('lamps').forEach((xf, i) => {
      const x = xf * W.w, g = vY(xf, 0.02), H = 1.5 * ph;
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.fillStyle = css(BRONZE, 2);
      ctx.fillRect(x - 0.03 * ph, g - H, 0.06 * ph, H);
      ctx.fillRect(x - 0.16 * ph, g - 0.04 * ph, 0.32 * ph, 0.05 * ph);
      ctx.beginPath(); ctx.ellipse(x, g - H, 0.15 * ph, 0.05 * ph, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      flame(ctx, x, g - H - 0.02 * ph, 0.28 * ph, k * a, i * 3.1);
    });
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  const flash = (b, o) => { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); };
  function sparkleOn(b, key, n, rgb) {
    if (b.instant || !fx()) return;
    if (hasCrowd(key)) { for (const m of cmembers(key)) { if (!m._vis) continue; fx().sparkle(m._x, m._y - m._h * 0.6, n || 6, rgb || [255, 232, 170], 8 * SU(), 'air'); } return; }
    const p = figPt(key, 0.6);
    if (p) fx().sparkle(p[0], p[1], n || 16, rgb || [255, 232, 170], 10 * SU(), 'air');
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().ring(x, y, rgb || [255, 236, 200], Math.min(r || M() * 0.2, M() * 0.22), dur || 2.2, 1.6); }
  function ringOn(b, id, rgb, r) { const p = figPt(id, 0.55); if (p) ringAt(b, p[0], p[1], rgb, r, 2.2); }
  // 在天上聚成几个字（淡淡的，不相叠）
  function glyphs(b, str, rgb, o) {
    if (b.instant || !fx() || !fx().nameStr) return;
    o = o || {};
    const size = Math.max(22, (o.size || (tall() ? 0.085 : 0.042)) * (tall() ? W.w : M()));
    const n = Array.from(str).length, half = size * 1.08 * (n - 1) / 2 + size * 0.6;
    const cx = clamp(o.x * W.w, half + 8, W.w - half - 8), cy = o.y * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * W.w * 0.2, W.h * 0.8 + (Math.random() - 0.5) * 40]);
    fx().nameStr(str, cx, cy, size, rgb || [255, 226, 160], src, { hold: o.hold || 3, delay: o.delay || 0, step: 3, dot: size > 40 ? 2.4 : 2 });
    const a = au();
    if (a && a.nameChime && !o.quiet) U.safe('gl.nameChime', () => a.nameChime(str[0]));
  }
  // 一道金流：自 A 流到 B（像素点或函数）
  const ptv = p => (typeof p === 'function' ? p() : p);
  function stream(b, A, B, o) { flash(b, Object.assign({ type: 'stream', A, B, dur: 3.5 }, o)); }
  function drawFXL(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    ctx.save();
    for (const e of FXL) {
      const u = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'stream') {
        const A = ptv(e.A), B = ptv(e.B);
        if (!A || !B) continue;
        ctx.globalCompositeOperation = 'lighter';
        const n = e.n || 16;
        for (let i = 0; i < n; i++) {
          const s = clamp(u * 1.5 - i / n * 0.5, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const x = lerp(A[0], B[0], s), y = lerp(A[1], B[1], s) - Math.sin(Math.PI * s) * (e.arc != null ? e.arc : 0.06) * W.h + Math.sin(i * 2.1 + e.t * 3) * 2;
          glowAt(ctx, SP[e.spr || 'gold'], x, y, (4 + 3 * hsh(i)) * SU(), 0.85 * Math.sin(Math.PI * s));
        }
      } else if (e.type === 'halo') {
        const a = (e.a || 0.3) * U.smoothstep(0, 0.2, u) * (1 - U.smoothstep(0.72, 1, u));
        ctx.globalCompositeOperation = 'lighter';
        const P = ptv(e.P) || [e.x, e.y];
        glowAt(ctx, SP[e.spr || 'gold'], P[0], P[1], e.r, a, e.sy || 1);
      } else if (e.type === 'flash') {
        const a = (e.a || 0.7) * Math.pow(1 - u, 1.5) * Math.min(1, u * 8);
        ctx.globalCompositeOperation = 'lighter';
        const P = ptv(e.P) || [e.x, e.y];
        glowAt(ctx, SP[e.spr || 'gold'], P[0], P[1], e.r, a);
      } else if (e.type === 'bloom') {
        // 瞎子的眼睛开了：颜色自他身上绽开
        const P = ptv(e.P);
        if (!P) continue;
        const r = e.r * ease(u), a = 0.5 * (1 - u);
        ctx.globalCompositeOperation = 'lighter';
        const cols = ['gold', 'warm', 'silver', 'white'];
        for (let i = 0; i < 8; i++) {
          const ang = i / 8 * TAU + u * 0.8;
          glowAt(ctx, SP[cols[i % 4]], P[0] + Math.cos(ang) * r * 0.6, P[1] + Math.sin(ang) * r * 0.35, r * 0.45, a);
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 飞起的鸽子（装饰，随机无妨）
  const DOVES = [];
  function releaseDoves(b) {
    if (b.instant || W.replaying) return;
    const x0 = X('bench') * W.w, y0 = vY(X('bench'), 0.08) - PH(2) * 0.4;
    for (let i = 0; i < 9; i++) DOVES.push({ x: x0 + (Math.random() - 0.5) * PH(2), y: y0, vx: -(20 + Math.random() * 50) * SU(), vy: -(40 + Math.random() * 40) * SU(), t: 0, ph: Math.random() * TAU, s: (0.8 + Math.random() * 0.4) * SU() });
  }
  function drawDoves(ctx) {
    if (!DOVES.length) return;
    ctx.save();
    for (const d of DOVES) {
      const a = clamp(1 - d.t / 7, 0, 1);
      if (a <= 0) continue;
      const f = Math.sin(d.ph) * 0.9, s = 5 * d.s;
      ctx.globalAlpha = a;
      ctx.fillStyle = W.shadeCSS([240, 238, 232], 0.1, 1, 0.1);
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, s * 0.9, s * 0.4, d.vx < 0 ? 0.2 : -0.2, 0, TAU);
      ctx.moveTo(d.x - s * 0.2, d.y); ctx.lineTo(d.x - s * 1.1, d.y - s * 1.3 * f); ctx.lineTo(d.x + s * 0.3, d.y - s * 0.1);
      ctx.moveTo(d.x + s * 0.2, d.y); ctx.lineTo(d.x + s * 1.0, d.y - s * 1.2 * f); ctx.lineTo(d.x - s * 0.2, d.y - s * 0.1);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的调度
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { RK = null; MT = null; CH = null; SEV = null; SY = null; CITY = null; },
    update(dt) {
      if (!isCur()) { FXL.length = 0; DOVES.length = 0; return; }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += dt; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (let i = DOVES.length - 1; i >= 0; i--) {
        const d = DOVES[i];
        d.t += dt; d.ph += dt * 16; d.x += d.vx * dt; d.y += d.vy * dt; d.vy *= Math.pow(0.7, dt); d.vx *= Math.pow(0.95, dt);
        if (d.t > 7) DOVES.splice(i, 1);
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'mid') {
        U.safe('gl.far', () => drawFarCity(ctx));
        U.safe('gl.jmid', () => drawJericho(ctx, 'mid'));
        return;
      }
      if (pass === 'near') {
        U.safe('gl.mount', () => drawMount(ctx));
        U.safe('gl.rock', () => drawRock(ctx));
        const ck = lv('glCity');
        if (ck > 0.01) {
          U.safe('gl.city', () => {
            const Cm = city();
            ctx.save();
            ctx.globalAlpha = clamp(ck, 0, 1);
            drawHill(ctx, Cm);
            drawTemple(ctx);
            drawHouses(ctx, Cm, 0); drawHouses(ctx, Cm, 1); drawHouses(ctx, Cm, 2);
            ctx.restore();
            ctx.globalAlpha = 1;
            drawCourt(ctx, Cm, ck * lv('glCourt'));
            drawWall(ctx, Cm, ck * lv('glWall'));
            ctx.globalAlpha = clamp(ck, 0, 1);
            X('olives').forEach((xf, i) => drawOlive(ctx, xf, 0.95 + 0.12 * hsh(i + 7)));
            ctx.globalAlpha = 1;
          });
        }
        U.safe('gl.path', () => drawPath(ctx));
        U.safe('gl.road', () => drawRoad(ctx));
        U.safe('gl.jericho', () => drawJericho(ctx, 'near'));
        U.safe('gl.tables', () => drawTables(ctx));
        U.safe('gl.chest', () => drawChest(ctx));
        U.safe('gl.lamps', () => drawLamps(ctx));
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { U.safe('gl.voice', () => drawVoice(ctx)); return; }
      if (pass === 'near') {
        // 在人之前画的布景之后、人之前：山顶的光、变像的光芒、云身
        U.safe('gl.summit', () => drawSummitLight(ctx));
        U.safe('gl.cloudB', () => drawCloud(ctx, 'back'));
        U.safe('gl.gloryB', () => drawGlory(ctx, 'back'));
        return;
      }
      if (pass === 'air') {
        U.safe('gl.church', () => drawChurch(ctx));
        U.safe('gl.reveal', () => drawReveal(ctx));
        U.safe('gl.glory', () => drawGlory(ctx, 'front'));
        U.safe('gl.cloud', () => drawCloud(ctx, 'front'));
        U.safe('gl.seventy', () => drawSeventy(ctx));
        U.safe('gl.treasure', () => drawTreasure(ctx));
        U.safe('gl.kids', () => drawKids(ctx));
        U.safe('gl.branches', () => drawBranches(ctx));
        U.safe('gl.mites', () => drawMites(ctx));
        U.safe('gl.doves', () => drawDoves(ctx));
        U.safe('gl.fxl', () => drawFXL(ctx));
      }
    },
    reset() { FXL.length = 0; DOVES.length = 0; },
    restore() { FXL.length = 0; DOVES.length = 0; RK = null; MT = null; CH = null; SEV = null; SY = null; CITY = null; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (isFinite(d) && d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const ph = PH(2);
      if (lv('glRock') > 0.5) { const G = rockGeo(); consider('磐石', G.cx, G.topAt(G.cx) + G.h * 0.3); }
      if (lv('glMount') > 0.5) { mt(); consider('高山', MT.cx, MT.gc - MT.H * 0.7); }
      if (lv('glCloud') > 0.5) { const c = cloudC(); consider('光明的云彩', c[0], c[1]); }
      if (lv('glTreasure') > 0.3) { const c = X('treas'); consider('天上的财宝', c[0] * W.w, c[1] * W.h); }
      if (lv('glFar') > 0.5) consider('耶路撒冷', X('farT') * W.w, gY(1, X('farT')) - PH(1));
      if (lv('glJericho') > 0.5) {
        const G = sycGeo(); consider('桑树', G.x, G.g - G.H * 0.7);
        consider('撒该的家', X('zh') * W.w, gB(2, X('zh')) - ph);
        consider('棕树', X('palms')[0] * W.w, gY(2, X('palms')[0]) - ph * 2.6);
      }
      if (lv('glCity') > 0.5) {
        const G = tgeo(); consider('圣殿', G.x, G.y - G.fh * 0.6);
        if (lv('glWall') > 0.5) { const Cm = city(); consider('城门', Cm.gx * W.w, Cm.g(Cm.gx) - 0.6 * ph); }
        consider('橄榄山', X('olives')[1] * W.w, gY(2, X('olives')[1]) - ph * 1.4);
      }
      if (lv('glTables') > 0.5) consider('兑换银钱之人的桌子', X('tables')[1] * W.w, vY(X('tables')[1], 0.1) - ph * 0.4);
      if (lv('glChest') > 0.5) { const G = chestGeo(); consider('银库', G.x, G.g - G.h); }
      if (lv('glMites') > 0.5) { const m = chestMouth(); consider('两个小钱', m[0], m[1] - 1.7 * ph); }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  人物的样子与站位
  // ════════════════════════════════════════════════════════════
  const JESUS_ROBE = () => (LOOK('jesus').robe || [232, 224, 206]);
  const JESUS_GLOW = () => (LOOK('jesus').glow != null ? LOOK('jesus').glow : 0.32);
  function mkJesus(x, o) { return add('jesus', Object.assign({}, LOOK('jesus'), { x, layer: 2, v: 0.3, prop: null }, o || {})); }
  function mkPeter(x, o) { return add('peter', Object.assign({}, LOOK('peter'), { x, layer: 2, v: 0.34, prop: null }, o || {})); }
  function mkJohn(x, o) { return add('john', Object.assign({}, LOOK('john'), { x, layer: 2, v: 0.26, prop: null }, o || {})); }
  function mkJames(x, o) { return add('james', Object.assign({}, LOOK('disciple'), { label: '雅各', robe: DROBES()[0], x, layer: 2, v: 0.3, prop: null }, o || {})); }
  function mkDisc(x0, x1, pose, v0, v1) {
    crowd('disc', { n: nn(9), x0, x1, layer: 2, label: '门徒', pose: pose || 'stand' }, disciples(v0 == null ? 0.02 : v0, v1 == null ? 0.2 : v1));
  }
  const THREE = ['peter', 'james', 'john'];
  const NIGHT_GLOW = { jesus: 0.45, peter: 0.34, james: 0.32, john: 0.34 };
  function nightGlow(on) { for (const id in NIGHT_GLOW) glow(id, on ? NIGHT_GLOW[id] : (id === 'jesus' ? JESUS_GLOW() : id === 'james' ? (LOOK('disciple').glow || 0.14) : (LOOK(id).glow || 0.2))); cglow('disc', on ? 0.3 : 0.16); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：凯撒利亚‧腓立比，早晨；北方的高山在右边
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; DOVES.length = 0; S = fresh(); RK = null; MT = null; CH = null; SEV = null; SY = null; CITY = null; }
  function setup() {
    W.set('bare', 0, true); W.set('bloom', 0.55, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.38, land: 1, grass: 0.82, herbs: 0.6, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('glRock', 1, true); W.set('glMount', 1, true); W.set('glGrotto', 1, true); W.set('glWall', 1, true);
    W.freeClock = false;
    const ox = W.w * 0.02, oy = W.ridgeBaseY(0, ox);
    W.setOrigin('grass', W.w * 0.55, W.ridgeBaseY(2, W.w * 0.55)); W.setOrigin('herbs', W.w * 0.5, W.ridgeBaseY(2, W.w * 0.5)); W.setOrigin('trees', ox, oy);
    W.goTo(0.34, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.55, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 3, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    mkJesus(X('j1'), { facing: 1 });
    mkPeter(X('p1'), { facing: -1 }); mkJames(X('ja1'), { facing: -1 }); mkJohn(X('jn1'), { facing: -1 });
    mkDisc(X('c10'), X('c11'), 'stand');
    cface('disc', -1);
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 凯撒利亚‧腓立比：「你们说我是谁？」（太 16:13–16）─────
    {
      kind: 'ask', utter: '你们说我是谁？', cmd: 'whoami --asked-by 门徒  # 你是基督，是永生神的儿子', ref: '16:15', tint: [240, 232, 214],
      verse: [
        { text: '耶稣到了凯撒利亚‧腓立比的境内，就问门徒说：<br>「人说我人子是谁？」', ref: '马太福音 16:13', hold: 6 },
        { text: '他们说：「有人说是施洗的约翰；有人说是以利亚；<br>又有人说是耶利米或是先知里的一位。」', ref: '马太福音 16:14', hold: 6.5 },
        { text: '耶稣说：「你们说我是谁？」<br>西门‧彼得回答说：「你是基督，是永生神的儿子。」', ref: '马太福音 16:15–16', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.38, 6, b.instant);
            S.where = 'caesarea';
            face('jesus', 1);
            cface('disc', -1);
            for (const id of THREE) face(id, -1);
          }],
          [1.2, () => { pose('james', 'point'); cface('disc', 1); }],
          // 人的猜测：天上淡淡的名字，一个一个散去
          [7.4, b => {
            const gy = tall() ? 0.36 : 0.2;
            glyphs(b, '施洗的约翰', [214, 206, 190], { x: tall() ? 0.6 : 0.64, y: gy, hold: 3, quiet: true });
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [9, b => { glyphs(b, '以利亚', [214, 206, 190], { x: tall() ? 0.42 : 0.86, y: tall() ? 0.45 : 0.3, hold: 3, quiet: true }); }],
          [10.6, b => { glyphs(b, '耶利米', [214, 206, 190], { x: tall() ? 0.72 : 0.72, y: tall() ? 0.53 : 0.38, hold: 3, quiet: true }); pose('james', 'stand'); cface('disc', -1); }],
          // 彼得回答：他走到耶稣面前跪下；一道光自上而下落在耶稣身上
          [15, () => { walk('peter', X('j1') + 0.028, { speed: 0.03, pose: 'kneel' }); }],
          [17.2, b => {
            W.set('glReveal', 1, b.instant);
            face('jesus', 1);
            sfx(b, 'harp', { soft: true });
          }],
          [20.5, () => { cpose('disc', 'kneel'); }],
          [23, b => { W.set('glReveal', 0.25, b.instant); }],
        ]);
      },
    },

    // ── 2 · 「我要把我的教会建造在这磐石上」（太 16:17–18，24）─────
    {
      kind: 'promise', utter: '我要把我的教会建造在这磐石上', cmd: 'build 教会 --on 磐石  # 阴间的权柄不能胜过他', ref: '16:18', tint: [255, 226, 168],
      verse: [
        { text: '耶稣对他说：「西门‧巴‧约拿，你是有福的！<br>因为这不是属血肉的指示你的，乃是我在天上的父指示的。', ref: '马太福音 16:17', hold: 7 },
        { text: '我还告诉你，你是彼得，我要把我的教会建造在这磐石上；<br>阴间的权柄不能胜过他。」', ref: '马太福音 16:18', hold: 7 },
        { text: '于是耶稣对门徒说：「若有人要跟从我，<br>就当舍己，背起他的十字架来跟从我。」', ref: '马太福音 16:24', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.44, 10, b.instant);
            W.set('glReveal', 0, b.instant);
            pose('peter', 'stand'); cpose('disc', 'stand');
          }],
          [2, () => { walk('peter', X('rock') + 0.035, { speed: 0.025 }); }],
          [5, () => { face('peter', 1); walk('jesus', X('rock') + 0.07, { speed: 0.02 }); }],
          // 磐石发光，洞口的阴影退去
          [8.3, b => {
            W.set('glRockLit', 1, b.instant); W.set('glGrotto', 0, b.instant);
            if (!b.instant) { const G = rockGeo(); flash(b, { type: 'flash', x: G.cx, y: G.base[0][1] - G.h * 0.5, r: G.w * 1.1, a: 0.6, dur: 2.4 }); }
            sfx(b, 'build', { soft: true }); sfx(b, 'harp');
          }],
          // 光沿着地流向远方，一处一处点亮
          [10.5, b => { W.set('glChurchA', 1, b.instant); W.set('glChurch', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          [16.6, () => { face('jesus', 1); cwalk('disc', X('rock') + 0.1, X('c11') - 0.04, { speed: 0.02 }); walk('john', X('rock') + 0.13, { speed: 0.02 }); walk('james', X('rock') + 0.16, { speed: 0.02 }); }],
          [20, () => { cface('disc', -1); face('john', -1); face('james', -1); }],
          [22.5, b => { W.set('glChurchA', 0, b.instant); W.set('glRockLit', 0.35, b.instant); }],
        ]);
      },
    },

    // ── 3 · 登山变像（太 17:1–4）：黄昏上了高山，衣裳洁白如光；摩西、以利亚显现 ─────
    {
      kind: 'act', utter: '就在他们面前变了形象', cmd: 'transfigure --face 如日头 --robe 洁白如光', ref: '17:2', tint: [250, 250, 255],
      verse: [
        { text: '过了六天，耶稣带着彼得、雅各，和雅各的兄弟约翰，暗暗地上了高山，<br>就在他们面前变了形象，脸面明亮如日头，衣裳洁白如光。', ref: '马太福音 17:1–2', hold: 9 },
        { text: '忽然，有摩西、以利亚向他们显现，同耶稣说话。', ref: '马太福音 17:3', hold: 5.5 },
        { text: '彼得对耶稣说：「主啊，我们在这里真好！<br>你若愿意，我就在这里搭三座棚，一座为你，一座为摩西，一座为以利亚。」', ref: '马太福音 17:4', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.745, 7, b.instant);
            S.where = 'mount';
            W.set('glRockLit', 0.2, b.instant); W.set('glChurch', 0, b.instant);
            // 其余的门徒在山脚下坐着等候
            cwalk('disc', X('foot0'), X('foot1'), { speed: 0.03, pose: 'sit' });
            for (const id of ['jesus', ...THREE]) onMount(id);
            walk('jesus', uX(0), { speed: 0.042 });
            walk('peter', uX(X('peU')), { speed: 0.04 });
            walk('james', uX(X('jaU')), { speed: 0.04 });
            walk('john', uX(X('jnU')), { speed: 0.04 });
            sfx(b, 'wind', { soft: true });
          }],
          [8.2, b => {
            S.trans = true;
            face('jesus', -1);
            add('jesus', { robe: [255, 255, 250], glow: 1 });
            W.set('glTrans', 1, b.instant);
            for (const id of THREE) face(id, 1);
            nightGlow(true); glow('jesus', 1);
            if (!b.instant) { const p = figPt('jesus', 0.55); if (p) { flash(b, { type: 'flash', x: p[0], y: p[1], r: PH(2) * 5, a: 0.9, dur: 2.6, spr: 'white' }); ringAt(b, p[0], p[1], [255, 255, 250], M() * 0.18, 2.6); } }
            sfx(b, 'angel');
          }],
          [11.2, b => {
            add('moses', { label: '摩西', angel: true, x: uX(X('moU')), layer: 2, facing: 1, glow: 0.9, from: 'light', prop: null });
            add('elijah', { label: '以利亚', angel: true, x: uX(X('elU')), layer: 2, facing: -1, glow: 0.9, from: 'light', prop: null });
            onMount('moses'); onMount('elijah');
            sfx(b, 'harp', { soft: true });
          }],
          [14, () => { face('jesus', 1); }],
          [18.5, () => { pose('peter', 'raise'); }],
          [23, () => { pose('peter', 'kneel'); pose('james', 'kneel'); pose('john', 'kneel'); }],
        ]);
      },
    },

    // ── 4 · 光明的云彩，云里的声音（太 17:5–6）─────
    {
      kind: 'name', utter: '这是我的爱子，我所喜悦的。你们要听他', cmd: 'echo "这是我的爱子" | listen  # 你们要听他', ref: '17:5', tint: [255, 250, 236],
      verse: [
        { text: '说话之间，忽然有一朵光明的云彩遮盖他们，<br>且有声音从云彩里出来，说：「这是我的爱子，我所喜悦的。你们要听他！」', ref: '马太福音 17:5', hold: 9 },
        { text: '门徒听见，就俯伏在地，极其害怕。', ref: '马太福音 17:6', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.805, 9, b.instant);
            W.set('glCloud', 1, b.instant);
            for (const id of THREE) glow(id, 0.45);
            pose('peter', 'kneel');
            sfx(b, 'wind', { soft: true });
          }],
          [2.2, b => {
            W.set('glVoice', 1, b.instant);
            if (!b.instant) { const cc = cloudC(); flash(b, { type: 'flash', x: cc[0], y: cc[1], r: M() * 0.4, a: 0.6, dur: 3.5, spr: 'white' }); }
            sfx(b, 'angel');
          }],
          [10.4, b => {
            // 只有山上的三个门徒俯伏（其余的在山脚下坐着等候）
            for (const id of THREE) pose(id, 'fall');
            sfx(b, 'quake', { soft: true, far: true });
          }],
          [13, b => { W.set('glVoice', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 5 · 「起来，不要害怕！」云彩升去，只见耶稣；黎明下山（太 17:7–9）─────
    {
      kind: 'cmd', utter: '起来，不要害怕！', cmd: 'touch 门徒 && stand --fear 0', ref: '17:7', tint: [255, 242, 214],
      verse: [
        { text: '耶稣进前来，摸他们，说：「起来，不要害怕！」', ref: '马太福音 17:7', hold: 5.5 },
        { text: '他们举目不见一人，只见耶稣在那里。', ref: '马太福音 17:8', hold: 5.5 },
        { text: '下山的时候，耶稣吩咐他们说：<br>「人子还没有从死里复活，你们不要将所看见的告诉人。」', ref: '马太福音 17:9', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            face('jesus', -1);
            walk('jesus', uX(-0.3), { speed: 0.02 });
            W.set('glVoice', 0, b.instant);
          }],
          [2.4, b => {
            for (const id of THREE) pose(id, 'stand');
            cpose('disc', 'sit');
            sfx(b, 'harp', { soft: true });
          }],
          [4.2, b => {
            W.set('glCloud', 0, b.instant);
            rm('moses'); rm('elijah');
            for (const id of THREE) face(id, 1);
          }],
          [7.4, b => {
            S.trans = false;
            W.set('glTrans', 0, b.instant);
            add('jesus', { robe: JESUS_ROBE(), glow: JESUS_GLOW() });
            glow('jesus', 0.45);
          }],
          [8.6, b => { W.goTo(0.3, 9, b.instant); }],
          // 下山
          [12.4, () => {
            walk('jesus', X('j5'), { speed: 0.03 });
            walk('peter', X('p5'), { speed: 0.03 });
            walk('james', X('ja5'), { speed: 0.03 });
            walk('john', X('jn5'), { speed: 0.03 });
          }],
          [14.5, () => { cpose('disc', 'stand'); cwalk('disc', X('c50'), X('c51'), { speed: 0.025 }); }],
          [20.5, () => {
            for (const id of ['jesus', ...THREE]) attach(id, null);
            nightGlow(false);
            face('jesus', -1); face('peter', 1); face('james', 1); face('john', -1);
            cface('disc', 1);
          }],
        ]);
      },
    },

    // ── 6 · 迦百农的黄昏：「不是到七次，乃是到七十个七次」（太 18:21–22）─────
    {
      kind: 'cmd', utter: '不是到七次，乃是到七十个七次', cmd: 'forgive --times $((70 * 7))  # 不是到七次', ref: '18:22', tint: [255, 222, 160],
      verse: [
        { text: '那时，彼得进前来，对耶稣说：<br>「主啊，我弟兄得罪我，我当饶恕他几次呢？到七次可以吗？」', ref: '马太福音 18:21', hold: 7.5 },
        { text: '耶稣说：「我对你说，不是到七次，乃是到七十个七次。」', ref: '马太福音 18:22', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.785, 7, b.instant);
            S.where = 'capernaum';
            W.set('glRockLit', 0, b.instant);
            face('jesus', -1);
            // 黄昏入夜：人各有一点光，认得出谁在问、谁在答
            nightGlow(true); glow('jesus', 0.5);
          }],
          [1.2, () => { walk('peter', X('j5') - 0.03, { speed: 0.02 }); face('john', -1); }],
          [4.6, b => {
            face('peter', 1); pose('peter', 'point');
            W.set('glSevenA', 1, b.instant); W.set('glSeven', 1, b.instant);
            sfx(b, 'bell', { soft: true });
          }],
          [8.8, b => {
            pose('peter', 'stand');
            W.set('glSeventy', 1, b.instant);
            sfx(b, 'stars'); sfx(b, 'harp', { soft: true });
          }],
          [12, () => { pose('peter', 'gaze'); cpose('disc', 'gaze'); pose('john', 'gaze'); pose('james', 'gaze'); }],
          [15.8, () => { pose('jesus', 'raise'); }],
          [18.5, () => { pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 7 · 早晨：「让小孩子到我这里来，不要禁止他们」（路 18:15–17）；一个少年人牵着骆驼来（太 19:16）─────
    {
      kind: 'call', utter: '让小孩子到我这里来，不要禁止他们', cmd: 'chmod +x 小孩子 && allow --to 耶稣  # 不要禁止他们', ref: '路加福音 18:16', tint: [255, 230, 190],
      verse: [
        { text: '有人抱着自己的婴孩来见耶稣，要他摸他们；<br>门徒看见就责备那些人。', ref: '路加福音 18:15', hold: 6 },
        { text: '耶稣却叫他们来，说：「让小孩子到我这里来，不要禁止他们，<br>因为在神国的正是这样的人。」', ref: '路加福音 18:16', hold: 7 },
        { text: '「我实在告诉你们，凡要承受神国的，<br>若不像小孩子，断不能进去。」', ref: '路加福音 18:17', hold: 5.5 },
        { text: '有一个人来见耶稣，说：<br>「夫子，我该做什么善事才能得永生？」', ref: '马太福音 19:16', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 夜很快过去（不在黑里久留）
            W.goTo(0.36, 4, b.instant);
            S.where = 'judea';
            W.set('glSevenA', 0, b.instant); W.set('glSeven', 0, b.instant);
            for (const id of ['peter', 'john', 'james']) pose(id, 'stand');
            cpose('disc', 'stand');
            pose('jesus', 'stand');
            // 早晨：耶稣与门徒站开些；众门徒在他左边（右边留给后来的少年人与骆驼）
            walk('jesus', X('j7'), { speed: 0.02 });
            walk('peter', X('j7') - 0.075, { speed: 0.022 });
            walk('james', X('j7') - 0.1, { speed: 0.022 });
            walk('john', X('j7') + 0.035, { speed: 0.02 });
            cwalk('disc', X('j7') - 0.2, X('j7') - 0.11, { speed: 0.03 });
          }],
          [2.8, b => {
            nightGlow(false);
            crowd('moms', { n: nn(3), x0: X('kid0') - 0.03, x1: X('kid0') + 0.02, layer: 2, label: '抱着婴孩的人' }, momsDress(0.18, 0.4));
            crowd('kids', { n: nn(6), x0: X('kid0'), x1: X('kid1'), layer: 2, label: '小孩子' }, kidsDress(0.22, 0.55));
            cwalk('moms', X('mom0'), X('mom1'), { speed: 0.022 });
            cwalk('kids', X('kid1') - 0.02, X('kid1') + 0.04, { speed: 0.024 });
            face('jesus', -1);
            sfx(b, 'laugh', { soft: true });
          }],
          [5.2, () => { face('peter', -1); face('james', -1); pose('peter', 'point'); pose('james', 'point'); cface('disc', -1); }],
          // 耶稣叫他们来：门徒让开，孩子们跑到他跟前
          [8.2, b => {
            pose('peter', 'stand'); pose('james', 'stand');
            walk('peter', X('j7') + 0.058, { speed: 0.03 }); walk('james', X('j7') + 0.08, { speed: 0.03 });
            pose('jesus', 'raise');
            sfx(b, 'harp', { soft: true });
          }],
          [9.6, b => {
            cwalk('kids', X('kidA'), X('kidB'), { run: true, speed: 0.07 });
            cwalk('moms', X('mom0') + 0.02, X('mom1') + 0.02, { speed: 0.02 });
            cface('disc', 1);
            sfx(b, 'laugh');
          }],
          [12.6, b => {
            cface('kids', X('j7')); cface('moms', X('j7'));
            W.set('glKids', 1, b.instant);
            cglow('kids', 0.55);
            pose('jesus', 'raise');
            sparkleOn(b, 'kids', 6, [255, 226, 170]);
            face('peter', -1); face('james', -1);
          }],
          [16.5, () => { cpose('kids', 'sit'); pose('jesus', 'stand'); }],
          // 一个富足的少年人牵着驮满财物的骆驼来，跪在耶稣面前（太 19:16）
          [17.2, b => {
            add('rich', { label: '少年人', sex: 'm', age: 'adult', x: 1.04, layer: 2, facing: -1, robe: [118, 72, 108], accent: [226, 190, 110], hair: 'cloth', beard: false, glow: 0.18, v: 0.52, prop: null });
            animal('camel', { kind: 'camel', x: 1.12, label: '骆驼', facing: -1, pack: true, v: 0.12 });
            walk('rich', X('rich'), { speed: 0.05, pose: 'kneel' });
            walk('camel', X('rich') + 0.09, { speed: 0.05 });
            sfx(b, 'camel', { soft: true });
          }],
          [21.2, b => { W.set('glKids', 0.3, b.instant); face('jesus', 1); face('peter', 1); face('james', 1); face('john', 1); }],
        ]);
      },
    },

    // ── 8 · 正午：「可去变卖你所有的，分给穷人」；骆驼穿过针的眼（太 19:21–26）─────
    {
      kind: 'cmd', utter: '可去变卖你所有的，分给穷人', cmd: 'sell --all | give 穷人 && follow 耶稣  # 财宝在天上', ref: '19:21', tint: [255, 226, 150],
      verse: [
        { text: '耶稣说：「你若愿意作完全人，可去变卖你所有的，分给穷人，<br>就必有财宝在天上；你还要来跟从我。」', ref: '马太福音 19:21', hold: 7 },
        { text: '那少年人听见这话，就忧忧愁愁地走了，因为他的产业很多。', ref: '马太福音 19:22', hold: 5.5 },
        { text: '耶稣对门徒说：「我实在告诉你们，财主进天国是难的。<br>我又告诉你们，骆驼穿过针的眼，比财主进神的国还容易呢！」', ref: '马太福音 19:23–24', hold: 8 },
        { text: '耶稣看着他们，说：「在人这是不能的，在神凡事都能。」', ref: '马太福音 19:26', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.48, 8, b.instant);
            W.set('glKids', 0, b.instant);
            cglow('kids', 0.2);
            cwalk('kids', X('kid0') - 0.06, X('kid0'), { speed: 0.03 });
            cwalk('moms', X('kid0') - 0.07, X('kid0') - 0.02, { speed: 0.02 });
            face('jesus', 1);
            if (!has('rich')) add('rich', { label: '少年人', sex: 'm', age: 'adult', x: X('rich'), layer: 2, facing: -1, robe: [118, 72, 108], accent: [226, 190, 110], hair: 'cloth', beard: false, glow: 0.18, v: 0.52, prop: null, pose: 'kneel' });
            if (!has('camel')) animal('camel', { kind: 'camel', x: X('rich') + 0.09, label: '骆驼', facing: -1, pack: true, v: 0.12 });
            pose('rich', 'kneel');
          }],
          [2.6, b => {
            crm('kids'); crm('moms');
            add('poor1', { label: '穷人', sex: 'm', age: 'elder', x: X('poor1'), layer: 2, facing: 1, robe: POOR[0], glow: 0.12, v: 0.45, prop: 'staff', pose: 'sit' });
            add('poor2', { label: '穷人', sex: 'f', age: 'adult', x: X('poor2'), layer: 2, facing: 1, robe: POOR[1], glow: 0.12, v: 0.5, prop: null, pose: 'sit' });
            void b;
          }],
          // 就必有财宝在天上
          [4.6, b => {
            W.set('glTreasure', 1, b.instant);
            pose('jesus', 'point'); face('jesus', -1);
            sfx(b, 'stars', { soft: true });
          }],
          [7.4, () => { pose('jesus', 'stand'); face('jesus', 1); pose('rich', 'stand'); }],
          // 他忧忧愁愁地牵着骆驼走了（走出画面）；天上的光淡下去
          [8.6, b => {
            face('rich', 1);
            walk('camel', 1.16, { speed: 0.022 });
            walk('rich', 1.1, { speed: 0.025 });
            W.set('glTreasure', 0.3, b.instant);
            sfx(b, 'camel', { soft: true, far: true });
          }],
          // 耶稣对门徒说：骆驼穿过针的眼……
          [15.4, () => {
            face('jesus', -1); pose('jesus', 'point');
            cface('disc', 1); face('peter', -1); face('james', -1); face('john', -1);
          }],
          [19.5, () => { pose('jesus', 'stand'); cpose('disc', 'gaze'); pose('peter', 'gaze'); }],
          // 在神凡事都能
          [24.2, b => {
            face('jesus', 1);
            W.set('glTreasure', 0.75, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [27.5, () => { rm('rich'); rm('camel'); cpose('disc', 'stand'); pose('peter', 'stand'); }],
        ]);
      },
    },

    // ── 9 · 「看哪，我们上耶路撒冷去」（太 20:17–19，28）─────
    {
      kind: 'call', utter: '看哪，我们上耶路撒冷去', cmd: 'cd ~/耶路撒冷  # 第三日他要复活', ref: '20:18', tint: [255, 222, 170],
      verse: [
        { text: '耶稣上耶路撒冷去的时候，在路上把十二个门徒带到一边，对他们说：', ref: '马太福音 20:17', hold: 5.5 },
        { text: '「看哪，我们上耶路撒冷去，人子要被交给祭司长和文士。他们要定他死罪，<br>又交给外邦人，将他戏弄，鞭打，钉在十字架上；第三日他要复活。」', ref: '马太福音 20:18–19', hold: 9 },
        { text: '「正如人子来，不是要受人的服事，乃是要服事人，<br>并且要舍命，作多人的赎价。」', ref: '马太福音 20:28', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.61, 9, b.instant);
            S.where = 'road';
            W.set('glTreasure', 0, b.instant);
            rm('rich'); rm('camel');
            rm('poor1'); rm('poor2');
            W.set('glMount', 0, b.instant); W.set('glRock', 0, b.instant); W.set('glRockLit', 0, b.instant);
            W.set('glRoad', 1, b.instant);
            face('jesus', -1);
            sfx(b, 'wind', { soft: true });
          }],
          // 带到一边：门徒围到他身边
          [1.5, () => {
            walk('peter', X('p9'), { speed: 0.03 }); walk('james', X('ja9'), { speed: 0.03 }); walk('john', X('jn9'), { speed: 0.03 });
            walk('jesus', X('j9'), { speed: 0.02 });
            cwalk('disc', X('c90'), X('c91'), { speed: 0.03 });
          }],
          [6.5, b => { W.set('glFar', 1, b.instant); }],
          [9, () => { face('jesus', -1); for (const id of THREE) face(id, 1); cface('disc', 1); }],
          // 门徒默然：彼得、约翰低头；众门徒望着远处的耶路撒冷
          [15.2, () => { pose('john', 'bow'); pose('peter', 'bow'); cface('disc', 1); cpose('disc', 'gaze'); }],
          [18.5, () => { for (const id of THREE) pose(id, 'stand'); cpose('disc', 'stand'); face('jesus', 1); }],
          [20.6, () => { for (const id of THREE) face(id, 1); cface('disc', 1); pose('jesus', 'gaze'); }],
          [23.5, () => { pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 10 · 耶利哥：「撒该，快下来！今天我必住在你家里」（路 19:2–6）─────
    {
      kind: 'call', utter: '撒该，快下来！今天我必住在你家里', cmd: 'call 撒该 --from 桑树 --today', ref: '路加福音 19:5', tint: [255, 228, 170],
      verse: [
        { text: '有一个人名叫撒该，作税吏长，是个财主。……只因人多，他的身量又矮，所以不得看见，<br>就跑到前头，爬上桑树，要看耶稣，因为耶稣必从那里经过。', ref: '路加福音 19:2–4', hold: 9 },
        { text: '耶稣到了那里，抬头一看，对他说：<br>「撒该，快下来！今天我必住在你家里。」', ref: '路加福音 19:5', hold: 6.5 },
        { text: '他就急忙下来，欢欢喜喜地接待耶稣。', ref: '路加福音 19:6', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.66, 8, b.instant);
            S.where = 'jericho';
            W.set('glJericho', 1, b.instant); W.set('glFar', 0.45, b.instant); W.set('glClimb', 0, b.instant);
            crowd('jericho', { n: nn(8), x0: X('jer0'), x1: X('jer1'), layer: 2, label: '众人' }, folk(0.02, 0.2, '众人'));
            cface('jericho', -1);
            add('zac', { label: '撒该', sex: 'm', age: 'adult', x: X('zac0'), layer: 2, facing: -1, robe: [150, 116, 72], accent: [214, 176, 96], hair: 'cloth', beard: true, glow: 0.24, v: 0.08, scale: 0.78, prop: null });
            avoid([0.36, 1]);
            sfx(b, 'crowd', { soft: true });
          }],
          [2.2, () => { face('zac', -1); pose('zac', 'gaze'); }],
          [3.8, () => { walk('zac', X('syc') - 0.012, { run: true, speed: 0.07 }); }],
          [5.6, b => {
            attach('zac', zacPt);
            W.set('glClimb', 1, b.instant);
            pose('zac', 'sit'); face('zac', -1);
            S.zacUp = true;
          }],
          [3, () => {
            walk('jesus', X('j10'), { speed: 0.03 });
            walk('peter', X('j10') - 0.05, { speed: 0.03 }); walk('john', X('j10') - 0.075, { speed: 0.03 }); walk('james', X('j10') - 0.1, { speed: 0.03 });
            cwalk('disc', X('j10') - 0.2, X('j10') - 0.11, { speed: 0.03 });
          }],
          [10.4, b => {
            face('jesus', 1); pose('jesus', 'gaze');
            cface('jericho', X('syc'));
            sfx(b, 'harp', { soft: true });
          }],
          // 他急忙下来
          [16.4, b => {
            W.set('glClimb', 0, b.instant);
            pose('zac', 'stand');
            pose('jesus', 'stand');
            S.zacUp = false;
          }],
          [18, b => {
            attach('zac', null);
            place('zac', X('syc') - 0.012);
            pose('zac', 'raise'); face('zac', -1);
            ringOn(b, 'zac', [255, 226, 170], M() * 0.08);
            sfx(b, 'laugh', { soft: true });
          }],
          [20.5, b => {
            pose('zac', 'stand');
            walk('zac', X('z11'), { speed: 0.028 }); walk('jesus', X('j11'), { speed: 0.028 });
            walk('peter', X('j11') - 0.2, { speed: 0.028 }); walk('john', X('j11') - 0.225, { speed: 0.028 }); walk('james', X('j11') - 0.25, { speed: 0.028 });
            cwalk('disc', X('j11') - 0.37, X('j11') - 0.27, { speed: 0.028 });
            cface('jericho', X('zh'));
            sfx(b, 'crowd', { soft: true });
          }],
        ]);
      },
    },

    // ── 11 · 黄昏在撒该家里：「今天救恩到了这家」（路 19:7–10）─────
    {
      kind: 'bless', utter: '今天救恩到了这家', cmd: 'salvation --arrive 这家 --today  # 寻找、拯救失丧的人', ref: '路加福音 19:9', tint: [255, 222, 150],
      verse: [
        { text: '众人看见，都私下议论说：「他竟到罪人家里去住宿。」', ref: '路加福音 19:7', hold: 5.5 },
        { text: '撒该站着对主说：「主啊，我把所有的一半给穷人；<br>我若讹诈了谁，就还他四倍。」', ref: '路加福音 19:8', hold: 7 },
        { text: '耶稣说：「今天救恩到了这家，因为他也是亚伯拉罕的子孙。<br>人子来，为要寻找、拯救失丧的人。」', ref: '路加福音 19:9–10', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.775, 11, b.instant);
            S.where = 'zhouse';
            W.set('glClimb', 0, b.instant);
            attach('zac', null);
            walk('zac', X('z11'), { speed: 0.03 }); walk('jesus', X('j11'), { speed: 0.03 });
            cwalk('jericho', X('jer0') - 0.27, X('jer0') - 0.16, { speed: 0.03 });
            cwalk('disc', X('j11') - 0.37, X('j11') - 0.27, { speed: 0.02 });
          }],
          [2, b => { cface('jericho', 1); W.set('glHouse', 0.35, b.instant); sfx(b, 'crowd', { soft: true, far: true }); }],
          [6.8, () => { face('zac', 1); face('jesus', -1); pose('zac', 'raise'); }],
          [8.6, b => {
            add('pb1', { label: '穷人', sex: 'm', age: 'elder', x: X('pb1') - 0.1, layer: 2, facing: 1, robe: POOR[2], glow: 0.14, v: 0.44, prop: 'staff' });
            add('pb2', { label: '穷人', sex: 'f', age: 'adult', x: X('pb2') - 0.11, layer: 2, facing: 1, robe: POOR[1], glow: 0.14, v: 0.52, prop: null });
            walk('pb1', X('pb1'), { speed: 0.02 }); walk('pb2', X('pb2'), { speed: 0.02 });
            void b;
          }],
          [11.4, b => {
            pose('zac', 'stand'); face('zac', -1);
            if (!b.instant) {
              stream(b, () => figPt('zac', 0.55), () => figPt('pb1', 0.55), { n: 14, arc: 0.05 });
              stream(b, () => figPt('zac', 0.55), () => figPt('pb2', 0.55), { n: 14, arc: 0.08 });
            }
            sfx(b, 'coins', { soft: true });
          }],
          [13.5, () => { pose('pb1', 'raise'); pose('pb2', 'raise'); glow('pb1', 0.35); glow('pb2', 0.35); }],
          // 救恩到了这家：他的家满了光
          [15, b => {
            face('zac', 1);
            W.set('glHouse', 1, b.instant);
            if (!b.instant) { const d = zhouseDoor(); flash(b, { type: 'flash', x: d[0], y: d[1], r: PH(2) * 4, a: 0.7, dur: 3 }); }
            glow('zac', 0.6);
            sfx(b, 'harp'); sfx(b, 'bell', { soft: true });
          }],
          [9.5, () => { crm('jericho'); }],
          [18, () => { pose('pb1', 'stand'); pose('pb2', 'stand'); face('pb1', 1); face('pb2', 1); }],
        ]);
      },
    },

    // ── 12 · 夜过去，橄榄山；骑着驴驹进耶路撒冷（太 21:4–10）─────
    {
      kind: 'promise', utter: '看哪，你的王来到你这里', cmd: 'ride 驴驹 --into 耶路撒冷 --meek  # 和散那', ref: '21:5', tint: [255, 232, 180],
      verse: [
        { text: '这事成就是要应验先知的话，说：<br>要对锡安的居民说：看哪，你的王来到你这里，<br>是温柔的，又骑着驴，就是骑着驴驹子。', ref: '马太福音 21:4–5', hold: 8 },
        { text: '牵了驴和驴驹来，把自己的衣服搭在上面，耶稣就骑上。<br>众人多半把衣服铺在路上；还有人砍下树枝来铺在路上。', ref: '马太福音 21:7–8', hold: 7.5 },
        { text: '前行后随的众人喊着说：和散那归于大卫的子孙！<br>奉主名来的是应当称颂的！高高在上和散那！', ref: '马太福音 21:9', hold: 6.5 },
        { text: '耶稣既进了耶路撒冷，合城都惊动了，说：「这是谁？」', ref: '马太福音 21:10', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.34, 9, b.instant);
            S.where = 'olives';
            crm('jericho');
            rm('pb1'); rm('pb2'); rm('zac');
            for (const id of ['jesus', ...THREE]) rm(id);
            crm('disc');
          }],
          // 夜里换了地方：耶利哥退去，耶路撒冷在近处立起
          [2.6, () => {
            // 夜最深时换了布景（立即，不渐变）
            W.set('glJericho', 0, true); W.set('glHouse', 0, true); W.set('glFar', 0, true);
            W.set('glCity', 1, true); W.set('glWall', 1, true); W.set('glCourt', 0, true);
          }],
          [4.5, b => {
            mkJesus(X('colt0') - 0.03, { facing: 1 });
            // 竖屏：都站在平地上（不挤在临海的崖边），纵深浅些
            const tl = tall();
            mkPeter(X('colt0') - 0.06, { facing: 1, v: tl ? 0.2 : 0.34 }); mkJames(X('colt0') - 0.085, { facing: 1, v: tl ? 0.12 : 0.3 }); mkJohn(X('colt0') - 0.035, { facing: 1, v: tl ? 0.2 : 0.45 });
            mkDisc(X('road0') - 0.03, X('road0') + 0.02, 'stand', 0.02, 0.15);
            cface('disc', 1);
            animal('donkey', { kind: 'donkey', x: X('colt0') + 0.02, label: '驴', facing: -1, v: tl ? 0.14 : 0.24 });
            animal('colt', { kind: 'donkey', x: X('colt0') + 0.045, label: '驴驹', facing: -1, scale: 0.8, v: tl ? 0.2 : 0.34 });
            avoid([0.3, 1]);
            void b;
          }],
          // 牵来驴和驴驹；衣服搭在上面，耶稣骑上
          [10.1, b => {
            face('jesus', 1);
            place('colt', X('colt0')); face('colt', 1);
            ride('jesus', 'colt');
            follow('donkey', 'colt', -0.035);
            sfx(b, 'donkey', { soft: true });
          }],
          [11.3, b => {
            walk('colt', X('gate') - 0.025, { speed: tall() ? 0.0068 : 0.0115 });
            follow('peter', 'colt', 0.05); follow('james', 'colt', 0.075); follow('john', 'colt', 0.03);
            cwalk('disc', X('road0') + 0.02, X('road0') + 0.1, { speed: 0.012 });
            crowd('hosanna', { n: nn(11), x0: X('ho0'), x1: X('ho1'), layer: 2, label: '众人' }, (m, i) => { folk(0, 0.1, '众人')(m, i); m.v = 0.01 + 0.1 * golden(i); });
            W.set('glCloaks', 1, b.instant);
            sfx(b, 'crowd');
          }],
          [13.3, b => { W.set('glBranches', 1, b.instant); cface('hosanna', X('colt0')); }],
          [18.9, b => { cpose('hosanna', 'raise'); sfx(b, 'shout'); sfx(b, 'sing', { soft: true }); }],
          [23.4, () => { cpose('hosanna', 'stand'); cface('hosanna', 1); }],
          [25.9, b => { cpose('hosanna', 'raise'); sfx(b, 'shout', { soft: true }); }],
          // 到了城门：跟随的人各站定（不再跟着走）
          [29.2, () => {
            const G = X('gate') - 0.025;
            for (const [id, dx] of [['donkey', 0.035], ['peter', -0.05], ['james', -0.075], ['john', -0.03]]) { follow(id, null); walk(id, G + dx, { speed: 0.02 }); }
          }],
        ]);
      },
    },

    // ── 13 · 圣殿的院：「我的殿必称为祷告的殿」（太 21:12–14）─────
    {
      kind: 'judge', utter: '我的殿必称为祷告的殿', cmd: 'rm -r 买卖 --from 殿 && pray  # 瞎子、瘸子都得了医治', ref: '21:13', tint: [255, 236, 200],
      verse: [
        { text: '耶稣进了神的殿，赶出殿里一切做买卖的人，<br>推倒兑换银钱之人的桌子，和卖鸽子之人的凳子，', ref: '马太福音 21:12', hold: 7 },
        { text: '对他们说：「经上记着说：我的殿必称为祷告的殿，<br>你们倒使它成为贼窝了。」', ref: '马太福音 21:13', hold: 6.5 },
        { text: '在殿里有瞎子、瘸子到耶稣跟前，他就治好了他们。', ref: '马太福音 21:14', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.47, 8, b.instant);
            S.where = 'temple';
            W.set('glCloaks', 0, b.instant); W.set('glBranches', 0, b.instant); W.set('glRoad', 0, b.instant);
            W.set('glWall', 0, b.instant); W.set('glCourt', 1, b.instant);
            W.set('glTables', 1, b.instant); W.set('glTumble', 0, b.instant);
            S.tables = 'up';
            crm('hosanna');
            ride('jesus', null);
            rm('colt'); rm('donkey');
            for (const id of THREE) follow(id, null);
            crowd('traders', { n: nn(5), x0: X('tables')[0] + 0.02, x1: X('bench') - 0.01, layer: 2, label: '做买卖的人' }, traderDress);
            cface('traders', -1);
            add('blind', { label: '瞎子', sex: 'm', age: 'adult', x: X('blind'), layer: 2, facing: 1, robe: [92, 90, 88], accent: [120, 116, 110], glow: 0.05, v: 0.42, prop: 'staff' });
            add('lame', { label: '瘸子', sex: 'm', age: 'adult', x: X('lame'), layer: 2, facing: 1, robe: [98, 92, 86], glow: 0.05, v: 0.5, prop: null, pose: 'sit' });
            place('jesus', X('gate') + 0.01);
            place('peter', X('gate') - 0.03); place('james', X('gate') - 0.055); place('john', X('gate') - 0.015);
            cwalk('disc', X('gate') - 0.16, X('gate') - 0.07, { speed: 0.02 });
            sfx(b, 'coins', { soft: true }); sfx(b, 'dove', { soft: true });
          }],
          [2.2, () => { walk('jesus', X('j13'), { speed: 0.03 }); }],
          // 推倒桌子和凳子：钱散落，鸽子飞上天，做买卖的人散去
          [4.8, b => {
            W.set('glTumble', 1, b.instant);
            S.tables = 'down';
            releaseDoves(b);
            if (!b.instant && fx()) { for (const xf of X('tables')) fx().sparkle(xf * W.w, vY(xf, 0.1) - PH(2) * 0.3, 14, [255, 222, 140], 14 * SU(), 'air'); }
            sfx(b, 'collapse', { soft: true }); sfx(b, 'coins'); sfx(b, 'wings');
          }],
          [6.2, () => { cwalk('traders', 0.97, 1.08, { speed: 0.05 }); }],
          [9, b => {
            face('jesus', 1); pose('jesus', 'point');
            if (!b.instant) { const G = tgeo(); flash(b, { type: 'flash', x: G.x, y: G.y - G.fh * 0.6, r: G.fh * 1.6, a: 0.45, dur: 3 }); }
            sfx(b, 'harp', { soft: true });
          }],
          [12.5, () => { crm('traders'); pose('jesus', 'stand'); face('jesus', -1); }],
          // 瞎子、瘸子到他跟前，他就治好了他们
          [16, () => { walk('blind', X('j13') - 0.04, { speed: 0.02 }); pose('lame', 'kneel'); face('jesus', -1); }],
          [18.4, b => {
            S.healed = true;
            add('blind', { robe: [150, 112, 82], accent: [214, 186, 140], glow: 0.35 });
            pose('lame', 'stand');
            glow('lame', 0.35);
            if (!b.instant) { flash(b, { type: 'bloom', P: () => figPt('blind', 0.8), r: PH(2) * 3, dur: 2.6 }); ringOn(b, 'lame', [255, 236, 200], M() * 0.07); }
            sfx(b, 'harp');
          }],
          [20, () => { pose('lame', 'raise'); pose('blind', 'raise'); C().prop && C().prop('blind', null); }],
        ]);
      },
    },

    // ── 14 · 黄昏：寡妇的两个小钱（可 12:41–44）─────
    {
      kind: 'bless', utter: '这穷寡妇投入库里的，比众人所投的更多', cmd: 'echo $((2 * 小钱)) > 银库  # 比众人所投的更多', ref: '马可福音 12:43', tint: [255, 226, 160],
      verse: [
        { text: '耶稣对银库坐着，看众人怎样投钱入库。有好些财主往里投了若干的钱。<br>有一个穷寡妇来，往里投了两个小钱，就是一个大钱。', ref: '马可福音 12:41–42', hold: 9 },
        { text: '耶稣叫门徒来，说：「我实在告诉你们，<br>这穷寡妇投入库里的，比众人所投的更多。', ref: '马可福音 12:43', hold: 6.5 },
        { text: '因为，他们都是自己有余，拿出来投在里头；<br>但这寡妇是自己不足，把她一切养生的都投上了。」', ref: '马可福音 12:44', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.745, 14, b.instant);
            S.where = 'treasury';
            W.set('glTables', 0, b.instant); S.tables = 'gone';
            W.set('glChest', 1, b.instant);
            rm('blind'); rm('lame');
            walk('jesus', X('j14'), { speed: 0.03, pose: 'sit' }); face('jesus', 1);
            cwalk('disc', X('j14') - 0.2, X('j14') - 0.11, { speed: 0.02 });
            walk('peter', X('j14') - 0.07, { speed: 0.02 }); walk('james', X('j14') - 0.095, { speed: 0.02 }); walk('john', X('j14') - 0.045, { speed: 0.02 });
            crowd('givers', { n: 3, x0: X('chest') + 0.06, x1: X('chest') + 0.16, layer: 2, label: '财主' }, richDress);
            cface('givers', -1);
          }],
          [2.4, b => { cwalk('givers', X('chest') + 0.025, X('chest') + 0.06, { speed: 0.02 }); void b; }],
          [4.2, b => {
            if (!b.instant && fx()) { const m = chestMouth(); fx().sparkle(m[0], m[1], 18, [255, 214, 120], 10 * SU(), 'air'); }
            sfx(b, 'coins');
          }],
          [3, () => {
            add('widow', { label: '穷寡妇', sex: 'f', age: 'elder', x: X('widow0'), layer: 2, facing: -1, robe: [84, 82, 84], accent: [150, 146, 140], hair: 'veil', glow: 0.22, v: 0.14, prop: null });
            walk('widow', X('chest') + 0.022, { speed: 0.022, pose: 'bow' });
          }],
          [5.6, b => {
            if (!b.instant && fx()) { const m = chestMouth(); fx().sparkle(m[0], m[1], 14, [255, 214, 120], 10 * SU(), 'air'); }
            sfx(b, 'coins', { soft: true });
            cwalk('givers', 0.99, 1.1, { speed: 0.03 });
          }],
          // 两个小钱：两点小小的光
          [9.6, b => {
            S.mites = 2;
            W.set('glMites', 1, b.instant);
            if (!b.instant) { const m = chestMouth(); flash(b, { type: 'flash', x: m[0], y: m[1], r: PH(2) * 1.4, a: 0.8, dur: 2 }); }
            sfx(b, 'bell', { soft: true });
          }],
          [11.2, b => {
            crm('givers');
            pose('jesus', 'stand');
            pose('widow', 'stand');
            walk('peter', X('j14') + 0.03, { speed: 0.025 }); walk('john', X('j14') + 0.055, { speed: 0.025 });
            cwalk('disc', X('j14') - 0.13, X('j14') - 0.02, { speed: 0.025 });
            face('jesus', -1);
          }],
          [14.5, b => { face('jesus', 1); pose('jesus', 'point'); W.set('glLamps', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [18.5, () => { pose('jesus', 'stand'); walk('widow', 1.06, { speed: 0.01 }); cface('disc', 1); face('peter', 1); face('john', 1); }],
          [24.5, () => { rm('widow'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '登山变像', sub: '马太福音 16 — 21 · 路加福音 18 — 19 · 马可福音 12', tint: [236, 240, 255], music: 'sinai',
    outro: 24,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '耶稣': { text: '就在他们面前变了形象，脸面明亮如日头，衣裳洁白如光。', ref: '马太福音 17:2' },
      '彼得': { text: '西门‧彼得回答说：「你是基督，是永生神的儿子。」', ref: '马太福音 16:16' },
      '雅各': { text: '过了六天，耶稣带着彼得、雅各，和雅各的兄弟约翰，暗暗地上了高山，', ref: '马太福音 17:1' },
      '约翰': { text: '过了六天，耶稣带着彼得、雅各，和雅各的兄弟约翰，暗暗地上了高山，', ref: '马太福音 17:1' },
      '门徒': { text: '他们举目不见一人，只见耶稣在那里。', ref: '马太福音 17:8' },
      '摩西': { text: '忽然，有摩西、以利亚向他们显现，同耶稣说话。', ref: '马太福音 17:3' },
      '以利亚': { text: '忽然，有摩西、以利亚向他们显现，同耶稣说话。', ref: '马太福音 17:3' },
      '磐石': { text: '我还告诉你，你是彼得，我要把我的教会建造在这磐石上；阴间的权柄不能胜过他。', ref: '马太福音 16:18' },
      '高山': { text: '过了六天，耶稣带着彼得、雅各，和雅各的兄弟约翰，暗暗地上了高山，', ref: '马太福音 17:1' },
      '光明的云彩': { text: '说话之间，忽然有一朵光明的云彩遮盖他们，且有声音从云彩里出来，说：「这是我的爱子，我所喜悦的。你们要听他！」', ref: '马太福音 17:5' },
      '小孩子': { text: '耶稣说：「让小孩子到我这里来，不要禁止他们；因为在天国的，正是这样的人。」', ref: '马太福音 19:14' },
      '抱着婴孩的人': { text: '有人抱着自己的婴孩来见耶稣，要他摸他们；门徒看见就责备那些人。', ref: '路加福音 18:15' },
      '少年人': { text: '那少年人听见这话，就忧忧愁愁地走了，因为他的产业很多。', ref: '马太福音 19:22' },
      '骆驼': { text: '我又告诉你们，骆驼穿过针的眼，比财主进神的国还容易呢！', ref: '马太福音 19:24' },
      '天上的财宝': { text: '耶稣说：「你若愿意作完全人，可去变卖你所有的，分给穷人，就必有财宝在天上；你还要来跟从我。」', ref: '马太福音 19:21' },
      '穷人': { text: '撒该站着对主说：「主啊，我把所有的一半给穷人；我若讹诈了谁，就还他四倍。」', ref: '路加福音 19:8' },
      '耶路撒冷': { text: '耶稣上耶路撒冷去的时候，在路上把十二个门徒带到一边，对他们说：', ref: '马太福音 20:17' },
      '撒该': { text: '他就急忙下来，欢欢喜喜地接待耶稣。', ref: '路加福音 19:6' },
      '桑树': { text: '就跑到前头，爬上桑树，要看耶稣，因为耶稣必从那里经过。', ref: '路加福音 19:4' },
      '撒该的家': { text: '耶稣说：「今天救恩到了这家，因为他也是亚伯拉罕的子孙。」', ref: '路加福音 19:9' },
      '棕树': { text: '耶稣进了耶利哥，正经过的时候，', ref: '路加福音 19:1' },
      '众人': { text: '前行后随的众人喊着说：和散那归于大卫的子孙！奉主名来的是应当称颂的！高高在上和散那！', ref: '马太福音 21:9' },
      '驴驹': { text: '看哪，你的王来到你这里，是温柔的，又骑着驴，就是骑着驴驹子。', ref: '马太福音 21:5' },
      '驴': { text: '门徒就照耶稣所吩咐的去行，牵了驴和驴驹来，把自己的衣服搭在上面，耶稣就骑上。', ref: '马太福音 21:6–7' },
      '橄榄山': { text: '耶稣和门徒将近耶路撒冷，到了伯法其，在橄榄山那里。', ref: '马太福音 21:1' },
      '城门': { text: '耶稣既进了耶路撒冷，合城都惊动了，说：「这是谁？」', ref: '马太福音 21:10' },
      '圣殿': { text: '经上记着说：我的殿必称为祷告的殿，你们倒使它成为贼窝了。', ref: '马太福音 21:13' },
      '做买卖的人': { text: '耶稣进了神的殿，赶出殿里一切做买卖的人，推倒兑换银钱之人的桌子，和卖鸽子之人的凳子，', ref: '马太福音 21:12' },
      '兑换银钱之人的桌子': { text: '推倒兑换银钱之人的桌子，和卖鸽子之人的凳子，', ref: '马太福音 21:12' },
      '瞎子': { text: '在殿里有瞎子、瘸子到耶稣跟前，他就治好了他们。', ref: '马太福音 21:14' },
      '瘸子': { text: '在殿里有瞎子、瘸子到耶稣跟前，他就治好了他们。', ref: '马太福音 21:14' },
      '财主': { text: '因为，他们都是自己有余，拿出来投在里头；', ref: '马可福音 12:44' },
      '银库': { text: '耶稣对银库坐着，看众人怎样投钱入库。有好些财主往里投了若干的钱。', ref: '马可福音 12:41' },
      '穷寡妇': { text: '有一个穷寡妇来，往里投了两个小钱，就是一个大钱。', ref: '马可福音 12:42' },
      '两个小钱': { text: '但这寡妇是自己不足，把她一切养生的都投上了。', ref: '马可福音 12:44' },
    },
  });
})(window.GS);
