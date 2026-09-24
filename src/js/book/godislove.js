/* ─────────────────────────────────────────────────────────────
 * book/godislove.js —— 普通书信 · 神就是爱（约翰一书 · 约翰二书 · 约翰三书 · 犹大书）
 *
 * 书信没有情节：一日一夜又一个清早，海边一座城外的小院里，作长老的约翰坐在矮桌旁，一盏泥灯、一卷书信。
 * 人一个一个来到桌旁——暖光在地上围成一圈，人越聚越多，那一圈光也越来越大（本幕贯穿始终的一景）。
 *   约一 1:5  「神就是光，在他毫无黑暗」——天将亮未亮；一道光自上头落在院中，光一圈一圈铺开，日头出来；
 *             两家的门开了，人走进光里，彼此相交。
 *   约一 1:9  「神是信实的，是公义的，必要赦免我们的罪」——一个穿灰衣的人从海边上来，跪下认罪；
 *             光如水浇下，灰衣洗成白衣；老约翰走去扶他起来，领他进到圈里。
 *   约一 2:8  「黑暗渐渐过去，真光已经照耀」——少年人背转身走开（恨弟兄的在黑暗里），一团冷暗的影裹住他；
 *             他那蒙赦免的哥哥跑去抱住他，影就渐渐散了。
 *   约一 3:1  「你看父赐给我们是何等的慈爱」——孩子们从屋里跑出来，跑到老约翰跟前；上头的光落在他们身上：神的儿女。
 *   约一 3:16 「主为我们舍命，我们从此就知道何为爱」——远山上一个十字架的剪影，光在它背后；
 *             路旁坐着一个穷乏的弟兄——该犹走去，把自己的外衣和饼给他，领他回来。
 *   约一 4:8  「神就是爱」——众人围着矮桌坐下（爱席）；地上那一圈光大放光明，天上聚成一个「爱」字；
 *             一点光自天顶降到桌中间（神差他独生子到世间来），一缕缕进到各人心里，遍地开花。
 *   约一 4:18 「爱里没有惧怕」——黄昏，一堵冷暗的雾自海上涌来，孩子们害怕；众人站起来手拉手，
 *             那一圈光向外一涨，就把惧怕除去。
 *   约一 4:19 「我们爱，因为神先爱我们」——一道光先落在约翰手中，点着他的灯；火一个传一个；城中的窗一扇扇亮起来。
 *   约一 5:14 「我们若照他的旨意求什么，他就听我们」——夜，众人把灯放在脚前，跪下祷告；一点点光升上天去；应允如光雨落下。
 *   约二 1:6  「我们若照他的命令行，这就是爱」——蒙拣选的太太和她的女儿提着灯从路上来，身后留下一路光的脚踪；
 *             老约翰迎上去，当面相见。
 *   约三 1:11 「行善的属乎神」——子夜，一只船靠岸，两个作客旅的弟兄上来叩门；该犹开门接待，打水给他们洗脚，领进圈里。
 *   犹 1:21   「保守自己常在神的爱中」——黎明前的风暴：没有雨的云彩、海里的狂浪、流荡的星；少年人起了疑心走向海边，
 *             灯灭了；众人跪下祷告，一座爱的光穹罩住他们；他的哥哥和该犹去把他领回来。
 *   犹 1:24   「那能保守你们不失脚」——风停了，天亮了；荣光自上头临到，那一圈光铺满全地；城里又有信的人来；
 *             众人站着举手：愿荣耀、威严、能力、权柄归与他。阿们！
 *
 * 父不显为人形：只有自上头来的光与旁白的声音；子不在场上（远山上的十字架只是一个剪影）；圣灵是玩家自己的那点光。
 * 惧怕、风暴只是冷暗的雾、云与浪，不是什么活物。人都无面目。
 * 画面的方位（桌面）：海在左；中丘上是城（剧场、廊柱、房屋）；近地上——该犹的家（0.565）、矮桌（0.70）、
 *   一家人的屋子（0.905），右边的路通到城里，左边的坡下到海边。竖屏另有一套位置（SL 的后两项）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ease = U.easeInOut;
  const ACT = 'godislove';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    glLamp: ['exp', 1.0],     // 桌上的泥灯（清早之前）
    glPillar: ['exp', 0.7],   // 自上头落到院中的光
    glFront: ['lin', 0.2],    // 光一圈圈铺开（0 → 1，五秒）
    glShade: ['lin', 0.28],   // 裹住少年人的冷暗的影
    glRing: ['exp', 0.45],    // 地上那一圈爱的光（明暗）
    glRingR: ['exp', 0.4],    // 那一圈光的大小（> 1 时铺满全地）
    glCross: ['exp', 0.5],    // 远山上十字架的剪影与其后的光
    glFeast: ['exp', 0.9],    // 桌上的饼与杯
    glDescent: ['lin', 0.2],  // 一点光自天顶降下（0 → 1，五秒）
    glLove: ['exp', 0.45],    // 爱：那一圈光大放光明
    glFear: ['lin', 0.16],    // 冷暗的雾涌来（0 → 1）
    glCast: ['lin', 0.3],     // 爱把惧怕除去（0 → 1）
    glCity: ['lin', 0.1],     // 城中亮着的窗
    glLamps: ['exp', 0.5],    // 众人脚前的灯
    glPray: ['lin', 0.1],     // 祷告的光升上天去（0 → 1，十秒）
    glAnswer: ['exp', 0.6],   // 应允：光雨
    glPath: ['exp', 0.5],     // 光的脚踪
    glDoor: ['exp', 0.9],     // 该犹的门开了
    glBoat: ['lin', 0.2],     // 船靠岸
    glWander: ['exp', 0.5],   // 流荡的星
    glKeep: ['exp', 0.55],    // 神的爱：一座光穹
    glGlory: ['exp', 0.35],   // 荣光
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 位置：[桌面 x, v, 竖屏 x, v]（x 为画面宽度的比例；v 为近地纵深里靠前的量；竖屏 x < 0：这人不出场）──
  const SL = {
    table: [0.700, 0, 0.690, 0], gHouse: [0.565, 0, 0.525, 0], fHouse: [0.905, 0, 0.918, 0],
    theatre: [0.795, 0, 0.80, 0], boat: [0.35, 0.925, 0.30, 0.9] /* 船：第二、四项是画面高度的比例 */, cross: [0.845, 0, 0.82, 0],
    // 圈里的座位（各人自来到之后就站在 / 坐在这里）
    john: [0.738, 0.02, 0.742, 0.04],
    gaius: [0.648, 0.05, 0.622, 0.08],
    youth: [0.618, 0.17, 0.578, 0.34],
    father: [0.800, 0.03, 0.838, 0.06],
    mother: [0.772, 0.15, 0.795, 0.3],
    forgiven: [0.596, 0.03, 0.555, 0.18],
    child1: [0.706, 0.22, 0.688, 0.42],
    child2: [0.678, 0.31, -1, 0],
    poor: [0.862, 0.10, 0.905, 0.46],
    lady: [0.830, 0.30, 0.872, 0.58],
    kid: [0.802, 0.37, 0.745, 0.6],
    trav1: [0.575, 0.21, 0.505, 0.44],
    trav2: [0.552, 0.31, -1, 0],
    // 途中的位置
    sinA: [0.418, 0.10, 0.395, 0.14], sinK: [0.528, 0.24, 0.475, 0.3], johnK: [0.556, 0.2, 0.515, 0.26],
    // 恨弟兄的在黑暗里：走到屋前的空地上（不贴着屋墙）
    youthOut: [0.82, 0.26, 0.80, 0.4], embY: [0.81, 0.26, 0.79, 0.4],
    // 路旁穷乏的弟兄：坐在屋前开阔的地上
    poorA: [0.842, 0.30, 0.86, 0.5], gaiusP: [0.815, 0.28, 0.80, 0.46],
    ladyA: [1.05, 0.2, 1.07, 0.3], kidA: [1.08, 0.26, 1.1, 0.38], ladyM: [0.848, 0.2, 0.87, 0.3], kidM: [0.872, 0.26, 0.93, 0.38],
    embL: [0.83, 0.2, 0.84, 0.3], pathEnd: [0.83, 0.2, 0.84, 0.3],
    travA: [0.4, 0.10, 0.378, 0.12], trav2A: [0.378, 0.16, -1, 0],
    trav1D: [0.536, 0.16, 0.47, 0.24], trav2D: [0.512, 0.24, -1, 0], gaiusD: [0.563, 0.10, 0.526, 0.12], embT: [0.548, 0.14, 0.497, 0.2],
    // 洗脚：两位客旅坐在开着的门前的门槛上，该犹跪在他们脚前
    trav1W: [0.571, 0.05, 0.522, 0.1], trav2W: [0.555, 0.08, -1, 0], gaiusW: [0.535, 0.12, 0.47, 0.16],
    // 存疑心的少年人：走到树前开阔的坡上（圈外）
    doubt: [0.468, 0.22, 0.45, 0.3], embD: [0.482, 0.22, 0.462, 0.32], fetch: [0.508, 0.24, 0.49, 0.36],
  };
  const X = {}, V = {};
  let PORT = false;
  function layout() {
    PORT = W.w < W.h * 0.9;
    for (const k in SL) { const q = SL[k]; X[k] = PORT ? q[2] : q[0]; V[k] = PORT ? q[3] : q[1]; }
    CITY = null;
  }

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  // carry：谁把自己的泥灯拿在手里（不在座位前）
  function fresh() { return { washed: 0, gave: 0, lamps: [], out: [], fetched: 0, guests: 0, carry: null }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = () => 34 * LS(2);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldH = g => Math.max(10, W.h - g);
  // 近地上某处（x 比例、纵深 v）的地面 y
  const groundV = (xf, v) => { const g = gY(2, xf); return g + (v || 0) * fieldH(g) * 0.8; };

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) {
    const p = C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o));
    if (p && o && o.v != null) p._gv = o.v;
    return p;
  }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } }
  function sfx(b, name, o) { if (b && b.instant) return; const a = au(); if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o)); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 纵深（v）慢慢移过去；重演时立即到位
  function setV(id, v) { const f = fig(id); if (!f) return; f._gv = v; if (W.replaying) f.v = v; }
  // 走到某个位置（x 与纵深）
  function go(id, key, o) { if (!has(id)) return; setV(id, V[key]); walk(id, X[key], o); }
  function faceTable(ids) { for (const id of ids || present()) face(id, X.table); }

  const ALL = ['john', 'gaius', 'youth', 'father', 'mother', 'forgiven', 'child1', 'child2', 'poor', 'lady', 'kid', 'trav1', 'trav2'];
  const KIDS = { child1: 1, child2: 1, kid: 1 };
  const present = () => ALL.filter(id => has(id));
  const grown = () => present().filter(id => !KIDS[id]);
  const skip = id => PORT && SL[id] && SL[id][2] < 0;

  // 人身上的一点（像素）：k 0 = 脚，1 = 头顶
  function figPt(id, k) {
    const f = fig(id);
    if (!f) return null;
    const kk = k == null ? 1 : k;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || PH()) * kk];
    return [f.nx * W.w, groundV(f.nx, f.v) - PH() * kk];
  }
  // 名字（光聚成的字）：在干净的天上
  function nameAt(b, str, xf, yf, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || (PORT ? 0.058 * W.w : 40 * u), (W.w * 0.8) / (n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 6, W.w - half - 6), cy = yf * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * 60 * u, cy + 40 * u + Math.random() * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 226, 180], src, { hold: o.hold || 3.4 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function ringAt(b, x, y, r, rgb, dur, w) {
    if (b.instant || !fx()) return;
    fx().ring(x, y, rgb || [255, 236, 204], M() * (r || 0.2), dur || 2.4, w || 1.6);
  }
  function sparkleAt(b, x, y, n, rgb, spread) {
    if (b.instant || !fx()) return;
    fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], (spread || 14) * SU(), 'top');
  }
  function ringOn(b, id, r, rgb, k) { const p = figPt(id, k == null ? 0.55 : k); if (p) ringAt(b, p[0], p[1], r, rgb); }
  function sparkleOn(b, id, n, rgb, k) { const p = figPt(id, k == null ? 0.6 : k); if (p) sparkleAt(b, p[0], p[1], n, rgb); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
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
        warm: radial([255, 176, 96], 1), gold: radial([255, 224, 160], 1), white: radial([246, 246, 255], 1),
        pale: radial([226, 234, 255], 1), lamp: radial([255, 150, 60], 1, 0.22), rose: radial([255, 196, 170], 1, 0.4),
        fog: radial([26, 32, 48], 1, 0.62), cold: radial([140, 164, 206], 1, 0.3), cloud: radial([255, 250, 238], 1, 0.6),
        grey: radial([128, 128, 128], 1, 0.6), smoke: radial([150, 150, 158], 1, 0.5),
      };
      // 自天而降的光柱：上淡、中亮、下渐隐
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.12)'); vt.addColorStop(0.72, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      // 一圈柔和的光带（中空）：光向外铺开时用
      const r2 = cnv(128, 128), g2 = r2.getContext('2d'), gb = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
      gb.addColorStop(0, 'rgba(255,236,196,0)'); gb.addColorStop(0.6, 'rgba(255,236,196,0)'); gb.addColorStop(0.82, 'rgba(255,236,196,0.55)');
      gb.addColorStop(0.9, 'rgba(255,240,210,1)'); gb.addColorStop(1, 'rgba(255,236,196,0)');
      g2.fillStyle = gb; g2.fillRect(0, 0, 128, 128);
      SP.band = r2;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火苗（灯）
  function flame(ctx, x, y, h, k, seed, lean) {
    if (k < 0.01 || !SP || !(h > 0.3)) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.6, k * (0.26 + 0.5 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    const ln = (lean || 0) * h;
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3];
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9 + ln * 0.4, y - H * 0.55, sx + ln + Math.sin(W.t * 8 + seed + i) * w * 0.45, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9 + ln * 0.4, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一盏泥灯（放在地上或桌上）
  function clayLamp(ctx, x, y, s, lit, seed, l, lean) {
    ctx.fillStyle = css([170, 116, 76], l == null ? 2 : l, 1, 0.05 + 0.4 * lit * nightK());
    ctx.beginPath(); ctx.ellipse(x, y - 1.3 * s, 3 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 1.8 * s, y - 1.6 * s); ctx.lineTo(x + 4.1 * s, y - 2.1 * s); ctx.lineTo(x + 2.1 * s, y - 0.3 * s); ctx.closePath(); ctx.fill();
    if (lit > 0.01) flame(ctx, x + 3.7 * s, y - 2 * s, 4.4 * s, lit, seed, lean || 0);
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function trans(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  城（中丘）：房屋、廊柱、半圆的剧场；夜里窗中的灯
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function cityModel() {
    if (CITY) return CITY;
    const r = U.mulberry32(6202), s = LS(1);
    const hs = [];
    const x0 = 0.548 * W.w, x1 = W.w * 1.01;
    for (const back of [1, 0]) {
      let x = x0 + (back ? 4 : 0) * s;
      while (x < x1) {
        const w = (back ? 12 : 10) + r() * (back ? 11 : 9), h = (back ? 11 : 8) + r() * (back ? 10 : 7);
        const f = (x + (w * s) / 2) / W.w;
        const nearTh = Math.abs(f - X.theatre) < (PORT ? 0.1 : 0.05);
        const nw = r() < 0.25 ? 0 : r() < 0.7 ? 1 : 2, wins = [];
        for (let i = 0; i < nw; i++) {
          const dx = nw === 1 ? (r() - 0.5) * 0.4 : (i ? 0.22 : -0.22);
          const rank = clamp(Math.abs(f - X.table) / 0.5, 0, 1) * 0.8 + r() * 0.2;
          wins.push({ dx, dy: 0.42 + r() * 0.2, rank, ph: r() * TAU });
        }
        if (!(nearTh && !back)) hs.push({ f, w, h: nearTh ? h * 0.6 : h, back, roof: r() < 0.5 ? 1 : 0, tone: r(), wins });
        x += (w + 0.6 + r() * (back ? 2.5 : 4.5)) * s;
      }
    }
    CITY = { hs };
    return CITY;
  }
  function drawCity(ctx) {
    const l = 1, s = LS(l), m = cityModel(), nk = nightK();
    const d = litX() >= W.w * 0.75 ? 1 : -1;
    const ST = [220, 206, 178], ST2 = [192, 176, 148], ROOF = [170, 150, 122], TILE = [156, 92, 68], MB = [226, 218, 200];
    // 剧场：凿在山坡上的半圆，一层层的座位（山坡在它后面隆起）
    const tx = X.theatre * W.w, ty = gY(l, X.theatre) + 2 * s, R = (PORT ? 34 : 32) * s, RH = 16 * s;
    const theatre = () => {
      ctx.fillStyle = css([112, 136, 92], l);
      ctx.beginPath(); ctx.ellipse(tx, ty + 2 * s, R * 1.55, RH * 1.9, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(mul(MB, 0.72), l);
      ctx.beginPath(); ctx.ellipse(tx, ty - 1 * s, R + 2.4 * s, RH + 3 * s, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(MB, l, 1, 0.04);
      ctx.beginPath(); ctx.ellipse(tx, ty - 1 * s, R, RH, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css(mul(MB, 0.68), l, 0.9); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      for (let i = 1; i <= 5; i++) { const k = 1 - i * 0.15; ctx.moveTo(tx - R * k, ty - 1 * s); ctx.ellipse(tx, ty - 1 * s, R * k, RH * k, 0, Math.PI, TAU); }
      for (const a of [-1.1, -0.55, 0, 0.55, 1.1]) { ctx.moveTo(tx + Math.sin(a) * R * 0.25, ty - 1 * s - Math.cos(a) * RH * 0.25); ctx.lineTo(tx + Math.sin(a) * R, ty - 1 * s - Math.cos(a) * RH); }
      ctx.stroke();
      ctx.strokeStyle = css([252, 242, 220], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.ellipse(tx, ty - 1 * s, R + 2.4 * s, RH + 3 * s, 0, Math.PI * 1.02, TAU * 0.99); ctx.stroke();
      // 戏台的墙
      ctx.fillStyle = css(mix(MB, ST2, 0.5), l);
      ctx.fillRect(tx - R * 0.78, ty - 7 * s, R * 1.56, 7.5 * s);
      ctx.fillStyle = css(mul(MB, 0.6), l, 0.8);
      for (let i = -3; i <= 3; i++) ctx.fillRect(tx + i * R * 0.21 - 0.9 * s, ty - 5.8 * s, 1.8 * s, 4.4 * s);
    };
    // 房屋（先画后排，再画剧场，再画前排）
    const wins = [];
    let thDone = false;
    for (const h of m.hs) {
      if (!h.back && !thDone) { theatre(); thDone = true; }
      const x = h.f * W.w, gy = gY(l, h.f) + 2 * s - (h.back ? 6 * s : 0), w = h.w * s, hh = h.h * s;
      const tone = mix(ST, ST2, h.tone);
      ctx.fillStyle = css(tone, l, 1, h.back ? -0.04 : 0);
      ctx.fillRect(x - w / 2, gy - hh, w, hh + (h.back ? 6 * s : 2 * s));
      ctx.fillStyle = css(mul(tone, 0.72), l, 0.8);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.24, gy - hh, w * 0.24, hh);
      if (h.roof) {
        ctx.fillStyle = css(TILE, l);
        ctx.beginPath(); ctx.moveTo(x - w / 2 - 1 * s, gy - hh + 0.4 * s); ctx.lineTo(x, gy - hh - w * 0.2); ctx.lineTo(x + w / 2 + 1 * s, gy - hh + 0.4 * s); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = css(ROOF, l);
        ctx.fillRect(x - w / 2 - 0.6 * s, gy - hh - 1.2 * s, w + 1.2 * s, 1.4 * s);
      }
      for (const q of h.wins) wins.push([x + q.dx * w, gy - hh * q.dy, q.rank, q.ph]);
    }
    if (!thDone) theatre();
    // 廊柱的大街（自城中下到港口）
    const c0 = PORT ? 0.56 : 0.572, c1 = PORT ? 0.7 : 0.672;
    ctx.fillStyle = css(MB, l);
    const n = PORT ? 7 : 9;
    for (let i = 0; i <= n; i++) {
      const f = lerp(c0, c1, i / n), x = f * W.w, gy = gY(l, f) + 3 * s;
      ctx.fillRect(x - 0.8 * s, gy - 9 * s, 1.6 * s, 9 * s);
    }
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const f = lerp(c0, c1, i / n), gy = gY(l, f) + 3 * s - 10.2 * s; if (i) ctx.lineTo(f * W.w, gy); else ctx.moveTo(f * W.w, gy); }
    for (let i = n; i >= 0; i--) { const f = lerp(c0, c1, i / n); ctx.lineTo(f * W.w, gY(l, f) + 3 * s - 8.8 * s); }
    ctx.closePath(); ctx.fill();
    // 窗中的灯（夜里；glCity 决定亮几扇：离院子近的先亮）
    const lit = lv('glCity');
    if (nk > 0.03 && SP && lit > 0.005) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of wins) {
        const on = clamp((lit - q[2]) / 0.05, 0, 1);
        if (on <= 0.01) continue;
        const fl = 0.8 + 0.2 * Math.sin(W.t * 3 + q[3]);
        ctx.globalAlpha = Math.min(1, nk * fl * on);
        ctx.fillStyle = 'rgb(255,190,110)';
        ctx.fillRect(q[0] - 0.8 * s, q[1] - 0.9 * s, 1.6 * s, 1.8 * s);
        glowAt(ctx, SP.lamp, q[0], q[1], 7 * s, nk * fl * 0.45 * on);
      }
      // 剧场里也点起灯来
      const on = clamp((lit - 0.5) / 0.2, 0, 1);
      if (on > 0.01) for (let i = 0; i < 7; i++) { const a = -1.2 + i * 0.4; glowAt(ctx, SP.lamp, tx + Math.sin(a) * R * 0.8, ty - 1 * s - Math.cos(a) * RH * 0.8, 6 * s, 0.5 * on * nk); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  近地：该犹的家、一家人的屋子、矮桌
  // ════════════════════════════════════════════════════════════
  function houseG(key, wU, hU) {
    const s = LS(2) * (PORT ? 0.8 : 1), cx = X[key] * W.w, w = wU * s, x0 = cx - w / 2, x1 = cx + w / 2;
    const y = Math.max(gY(2, x0 / W.w), gY(2, x1 / W.w), gY(2, X[key])) + 3 * s;
    return { s, cx, w, x0, x1, y, h: hU * s };
  }
  const gHouseG = () => houseG('gHouse', 64, 36);
  const fHouseG = () => houseG('fHouse', 52, 30);
  function drawHouse(ctx, G, o) {
    const s = G.s, l = 2, nk = nightK();
    const d = litX() >= G.cx ? 1 : -1;
    const PL = o.plaster, top = G.y - G.h;
    ctx.fillStyle = css(PL, l);
    ctx.fillRect(G.x0, top, G.w, G.h + 2 * s);
    ctx.fillStyle = css(mul(PL, 0.74), l, 0.85);
    ctx.fillRect(d > 0 ? G.x0 : G.x1 - G.w * 0.18, top, G.w * 0.18, G.h + 2 * s);
    if (o.tile) {
      const TILE = [152, 88, 64];
      ctx.fillStyle = css(TILE, l);
      ctx.beginPath();
      ctx.moveTo(G.x0 - 6 * s, top + 1 * s); ctx.lineTo(G.cx, top - 11 * s); ctx.lineTo(G.x1 + 6 * s, top + 1 * s);
      ctx.lineTo(G.x1 + 6 * s, top + 3 * s); ctx.lineTo(G.x0 - 6 * s, top + 3 * s);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css(mul(TILE, 0.7), l, 0.7); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      for (let i = 1; i < 9; i++) { const f = i / 9; ctx.moveTo(lerp(G.x0 - 6 * s, G.x1 + 6 * s, f), top + 2 * s); ctx.lineTo(lerp(G.x0 - 6 * s, G.x1 + 6 * s, f) * 0.8 + G.cx * 0.2, lerp(top + 2 * s, top - 9 * s, 1 - Math.abs(f - 0.5) * 2)); }
      ctx.stroke();
      ctx.strokeStyle = css([252, 238, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(G.x0 - 6 * s, top + 1 * s); ctx.lineTo(G.cx, top - 11 * s); ctx.lineTo(G.x1 + 6 * s, top + 1 * s); ctx.stroke();
    } else {
      // 平顶与矮墙（东方的屋顶）
      ctx.fillStyle = css(mul(PL, 0.9), l);
      ctx.fillRect(G.x0 - 2 * s, top - 2.4 * s, G.w + 4 * s, 2.6 * s);
      ctx.fillRect(G.x0 - 2 * s, top - 6 * s, 2.4 * s, 4 * s); ctx.fillRect(G.x1 - 0.4 * s, top - 6 * s, 2.4 * s, 4 * s);
      ctx.strokeStyle = css([252, 238, 210], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(G.x0 - 2 * s, top - 2.4 * s); ctx.lineTo(G.x1 + 2 * s, top - 2.4 * s); ctx.stroke();
    }
    // 门：门框；门里暗暗的暖色；夜里一盏灯；门开时满是暖光
    const open = o.open || 0;
    const dw = 12 * s, dh = 24 * s, dx = G.cx + (o.doorDx || 0) * s - dw / 2, dy = G.y - dh;
    ctx.fillStyle = css([96, 72, 52], l);
    ctx.fillRect(dx - 1.6 * s, dy - 1.8 * s, dw + 3.2 * s, dh + 1.8 * s);
    const inK = clamp(nk * (0.55 + 0.45 * (o.lamp == null ? 1 : o.lamp)) + open * 0.6, 0, 1);
    const IN = mix([54, 40, 30], [196, 128, 64], inK);
    ctx.fillStyle = U.rgba(IN[0] | 0, IN[1] | 0, IN[2] | 0, 1);
    ctx.fillRect(dx, dy, dw, dh);
    // 门扇：关着时盖住门洞；开时只剩一条
    const leaf = dw * (1 - 0.82 * open);
    ctx.fillStyle = css([112, 82, 56], l, 1, 0.04);
    ctx.fillRect(dx, dy, leaf, dh);
    if (leaf > 2 * s) {
      ctx.fillStyle = css([80, 58, 40], l, 0.8);
      ctx.fillRect(dx + leaf * 0.5 - 0.3 * s, dy + 1.2 * s, 0.6 * s, dh - 2.4 * s);
    }
    // 窗
    for (const q of o.wins) {
      const wx = G.cx + q[0] * G.w, wy = top + q[1] * G.h;
      ctx.fillStyle = css([96, 72, 52], l);
      ctx.fillRect(wx - 4 * s, wy - 4 * s, 8 * s, 8 * s);
      ctx.fillStyle = U.rgba(IN[0] | 0, IN[1] | 0, IN[2] | 0, 1);
      ctx.fillRect(wx - 3 * s, wy - 3 * s, 6 * s, 6 * s);
    }
    if (SP && (nk > 0.05 || open > 0.02)) {
      ctx.globalCompositeOperation = 'lighter';
      const k = clamp(nk * (o.lamp == null ? 1 : o.lamp) * 0.8 + open * (0.4 + 0.6 * nk), 0, 1.4);
      glowAt(ctx, SP.warm, dx + dw / 2, dy + dh * 0.45, dw * (0.75 + 0.6 * open), 0.55 * k, 1.7);
      glowAt(ctx, SP.lamp, dx + dw / 2, dy + dh * 0.3, dw * 0.35, 0.6 * k);
      for (const q of o.wins) { const wx = G.cx + q[0] * G.w, wy = top + q[1] * G.h; glowAt(ctx, SP.warm, wx, wy, 3.4 * s, 0.7 * nk); glowAt(ctx, SP.lamp, wx, wy, 11 * s, 0.25 * nk); }
      if (open > 0.02) glowAt(ctx, SP.warm, dx + dw / 2, G.y + 3 * s, dw * 2.6, 0.4 * open * (0.35 + 0.65 * nk), 0.28);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 矮桌：书信（卷着）、一盏泥灯；爱席时——两个饼、一只杯
  function tableG() { const s = LS(2) * (PORT ? 0.85 : 1), x = X.table * W.w, y = gY(2, X.table) + 1.5 * s; return { s, x, y }; }
  function drawTable(ctx) {
    const { s, x, y } = tableG(), l = 2;
    const WD = [132, 98, 66];
    ctx.fillStyle = css(mul(WD, 0.82), l);
    ctx.fillRect(x - 11 * s, y - 6.2 * s, 3 * s, 6.2 * s); ctx.fillRect(x + 8 * s, y - 6.2 * s, 3 * s, 6.2 * s);
    ctx.fillStyle = css(WD, l);
    ctx.fillRect(x - 13 * s, y - 8.4 * s, 26 * s, 2.4 * s);
    ctx.strokeStyle = css([252, 236, 204], l, 0.3 * dayA(), 0.15); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath(); ctx.moveTo(x - 13 * s, y - 8.4 * s); ctx.lineTo(x + 13 * s, y - 8.4 * s); ctx.stroke();
    const ty = y - 8.4 * s;
    // 书信：一卷（两端的轴）
    const PAP = [232, 218, 186];
    ctx.fillStyle = css(PAP, l, 1, 0.08 + 0.3 * lv('glLamp') * nightK());
    ctx.fillRect(x - 10.5 * s, ty - 2.6 * s, 6.4 * s, 2.4 * s);
    ctx.fillStyle = css([150, 118, 84], l);
    ctx.beginPath(); ctx.arc(x - 10.5 * s, ty - 1.4 * s, 1.35 * s, 0, TAU); ctx.arc(x - 4.1 * s, ty - 1.4 * s, 1.35 * s, 0, TAU); ctx.fill();
    // 饼与杯
    const fk = lv('glFeast');
    if (fk > 0.01) {
      ctx.globalAlpha = fk;
      ctx.fillStyle = css([206, 160, 102], l, 1, 0.06);
      ctx.beginPath(); ctx.ellipse(x - 1 * s, ty - 1.4 * s, 3 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 3.6 * s, ty - 1.3 * s, 2.6 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([176, 140, 96], l, 1, 0.1);
      ctx.fillRect(x + 7.4 * s, ty - 4.2 * s, 2.6 * s, 3.2 * s);
      ctx.fillRect(x + 8.2 * s, ty - 1.2 * s, 1 * s, 1.2 * s);
      ctx.fillStyle = 'rgba(150,40,50,' + (0.8 * fk).toFixed(3) + ')';
      ctx.fillRect(x + 7.6 * s, ty - 4 * s, 2.2 * s, 0.7 * s);
      ctx.globalAlpha = 1;
    }
    // 泥灯
    clayLamp(ctx, x + 10 * s, ty, s * 0.9, lv('glLamp'), 1.3, l, (W.lv.gale || 0) * 0.8);
  }

  // ════════════════════════════════════════════════════════════
  //  地上：爱的那一圈光、光的脚踪、众人脚前的灯
  // ════════════════════════════════════════════════════════════
  function ringG() {
    const r = lv('glRingR'), cx = X.table * W.w, g = gY(2, X.table), fh = fieldH(g);
    const k = clamp(r, 0, 1), over = Math.max(0, r - 1);
    const rx = W.w * (PORT ? lerp(0.08, 0.3, k) : lerp(0.045, 0.19, k)) * (1 + over * 2.2);
    const cy = g + fh * (PORT ? 0.2 : 0.13) * 0.8;
    const ry = fh * lerp(0.06, PORT ? 0.3 : 0.2, k) * (1 + over * 0.7);
    return { cx, cy, rx, ry, g, fh };
  }
  function drawRing(ctx) {
    const k = lv('glRing');
    if (k < 0.005 || !SP) return;
    const G = ringG(), nk = nightK(), day = 1 - nk, love = lv('glLove'), fear = clamp(lv('glFear') * (1 - lv('glCast')), 0, 1);
    // 白天也要看得见：有一份不随夜色的底
    const a = k * (0.34 + 0.14 * nk) * (1 + 0.9 * love) * (1 - 0.5 * fear);
    const n = PORT ? 26 : 40;
    const dot = (i, sc) => {
      const th = (i / n) * TAU + W.t * 0.05 * (i % 2 ? 1 : -0.7);
      return [G.cx + Math.cos(th) * G.rx, G.cy + Math.sin(th) * G.ry, Math.max(0.8, (1.1 + 0.8 * hsh(i)) * SU() * sc), th];
    };
    // 那一圈光铺满全地时（glRingR > 1），圈的边就化开了，不再有一道线横过海面
    const edge = 1 - clamp((lv('glRingR') - 1) * 2.2, 0, 1);
    // 白天：暖金的一圈细线与圈上的点，直接画在草地上（不只靠 lighter 提亮，草是亮绿的）
    if (day > 0.04 && edge > 0.01) {
      ctx.globalCompositeOperation = 'source-over';
      const back = 0.45;   // 远的半圈（在人后面）淡一些
      ctx.strokeStyle = 'rgb(255,222,156)';
      for (const [t0, t1, m] of [[Math.PI, TAU, back], [0, Math.PI, 1]]) {
        ctx.globalAlpha = Math.min(1, a * 0.42 * day * m * edge);
        ctx.lineWidth = Math.max(2, 6 * SU() * boost());
        ctx.beginPath(); ctx.ellipse(G.cx, G.cy, G.rx, G.ry, 0, t0, t1); ctx.stroke();
        ctx.globalAlpha = Math.min(1, a * 1.25 * day * m * edge);
        ctx.lineWidth = Math.max(1, 1.5 * SU() * boost());
        ctx.strokeStyle = 'rgb(255,236,190)';
        ctx.beginPath(); ctx.ellipse(G.cx, G.cy, G.rx, G.ry, 0, t0, t1); ctx.stroke();
        ctx.strokeStyle = 'rgb(255,222,156)';
      }
      ctx.fillStyle = 'rgb(255,244,214)';
      for (let i = 0; i < n; i++) {
        const [x, y, r, th] = dot(i, 1.25);
        const tw = 0.55 + 0.45 * Math.sin(W.t * 1.3 + i * 2.1);
        ctx.globalAlpha = Math.min(1, a * 1.6 * tw * day * edge * (Math.sin(th) < 0 ? 0.6 : 1));
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, G.cx, G.cy, G.rx * 1.2, a * 0.7, (G.ry / G.rx) * 1.15);
    glowAt(ctx, SP.gold, G.cx, G.cy, G.rx * 0.75, a * 0.45, (G.ry / G.rx) * 1.15);
    // 沿着那一圈的点点暖光，缓缓绕行
    ctx.fillStyle = 'rgb(255,226,170)';
    for (let i = 0; i < n; i++) {
      const [x, y, r] = dot(i, 1);
      const tw = 0.55 + 0.45 * Math.sin(W.t * 1.3 + i * 2.1);
      ctx.globalAlpha = Math.min(1, a * 1.3 * tw * (0.25 + 0.75 * edge));
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 圈上的暖光照着众人（画在人之上，夜里更显）
  function drawRingAir(ctx) {
    if (!SP) return;
    const k = lv('glRing'), love = lv('glLove');
    if (k < 0.005 && love < 0.005) return;
    const G = ringG(), nk = nightK(), fear = clamp(lv('glFear') * (1 - lv('glCast')), 0, 1);
    ctx.globalCompositeOperation = 'lighter';
    const a = k * (0.1 + 0.16 * nk) * (1 - 0.5 * fear);
    glowAt(ctx, SP.warm, G.cx, G.cy - PH() * 0.7, G.rx * 1.25, a, 0.62);
    if (love > 0.01) {
      glowAt(ctx, SP.rose, G.cx, G.cy - PH() * 0.9, G.rx * 1.4, love * (0.2 + 0.08 * nk) * (1 - 0.6 * fear), 0.7);
      // 微尘缓缓上升
      ctx.fillStyle = 'rgb(255,228,184)';
      for (let i = 0; i < 22; i++) {
        const sp = 0.03 + 0.03 * hsh(i * 3.9), t = (W.t * sp + hsh(i * 1.3)) % 1;
        const x = G.cx + (hsh(i * 7.7) - 0.5) * 2 * G.rx * 0.9 + Math.sin(W.t * 0.5 + i) * 4 * SU();
        const y = G.cy - t * PH() * 3.2;
        ctx.globalAlpha = love * 0.5 * Math.sin(Math.PI * t) * (0.4 + 0.6 * nk);
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, 1.3 * SU()), 0, TAU); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 光的脚踪：蒙拣选的太太从路上走来，身后一路光
  function drawPath(ctx) {
    const k = lv('glPath');
    if (k < 0.01 || !SP) return;
    const f = fig('lady');
    const x1 = W.w * 1.03, lx = f ? Math.max(f.nx, X.pathEnd) : X.pathEnd;
    const x0 = lx * W.w;
    if (x0 >= x1) return;
    const step = 7 * SU() * boost(), vis = 0.4 + 0.6 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    let i = 0;
    for (let x = x1; x > x0 + step * 0.5; x -= step, i++) {
      const xf = x / W.w, y = groundV(xf, V.pathEnd) + (i % 2 ? 1.6 : -1.6) * SU();
      const fade = clamp((x - x0) / (W.w * 0.03), 0.35, 1);
      glowAt(ctx, SP.gold, x, y, 5 * SU() * boost(), 0.5 * k * vis * fade, 0.45);
      ctx.globalAlpha = 0.8 * k * vis * fade;
      ctx.fillStyle = 'rgb(255,240,200)';
      ctx.beginPath(); ctx.ellipse(x, y, 1.6 * SU() * boost(), 0.7 * SU() * boost(), 0, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 众人脚前的灯（放下时的位置记在 S.lamps 里：各人的座位前）
  function lampPos(id) {
    const dir = X[id] <= X.table ? 1 : -1, s = LS(2);
    const x = X[id] * W.w + dir * 6 * s * (1 + 0.35 * V[id]), y = groundV(X[id], V[id] + 0.04);
    return [x, y, s * (1 + 0.35 * V[id])];
  }
  function drawLamps(ctx) {
    const k = lv('glLamps');
    if (k < 0.01 || !S.lamps.length) return;
    const gale = (W.lv.gale || 0) * (1 - 0.8 * lv('glKeep'));
    S.lamps.forEach((id, i) => {
      if (skip(id) || id === S.carry) return;
      const [x, y, s] = lampPos(id);
      const out = S.out.indexOf(id) >= 0;
      ctx.globalAlpha = Math.min(1, k * 1.5);
      clayLamp(ctx, x, y, s * 0.75, out ? 0 : k * (1 - gale * 0.3 * (0.6 + 0.4 * Math.sin(W.t * 11 + i))), 2.1 + i * 1.7, 2, gale * 0.9);
      ctx.globalAlpha = 1;
    });
  }
  // 拿在手里的泥灯（犹 1:21–22：存疑心的少年人拿着自己的灯走开；风里灯灭了）
  function carriedPt(id) {
    const f = fig(id);
    if (!f || !f._vis || !isFinite(f._x)) return null;
    const h = f._h || PH(), d = f.fd || f.facing || 1;
    const walking = f.tx != null;
    return [f._x + d * h * (walking ? 0.16 : 0.22), f._y - h * (walking ? 0.46 : 0.56), h];
  }
  // 火苗所在（传火时用）
  function carriedFlame(id) { const p = carriedPt(id); if (!p) return null; const s = p[2] / 34 * 0.8; return [p[0] + 3.7 * s, p[1] - 3.5 * s]; }
  function lampFlame(id) { const [x, y, s] = lampPos(id); const ss = s * 0.75; return [x + 3.7 * ss, y - 3.5 * ss]; }
  function drawCarried(ctx) {
    const id = S.carry;
    if (!id || !SP || lv('glLamps') < 0.01) return;
    const p = carriedPt(id);
    if (!p) return;
    const [x, y, h] = p, s = h / 34;
    const out = S.out.indexOf(id) >= 0;
    const gale = (W.lv.gale || 0) * (1 - 0.8 * lv('glKeep'));
    // 灭了：冷冷的月光照在他身上（看得出是谁、站在哪里）
    if (out) {
      const f = fig(id);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.cold, f._x, f._y - h * 0.55, h * 0.95, 0.34 * (0.4 + 0.6 * nightK()), 1.25);
      glowAt(ctx, SP.pale, f._x - (f.fd || 1) * h * 0.08, f._y - h * 0.62, h * 0.32, 0.22 * nightK(), 1.8);
      ctx.globalCompositeOperation = 'source-over';
    }
    const lit = out ? 0 : 1 - gale * 0.25 * (0.6 + 0.4 * Math.sin(W.t * 11));
    // 拿在手里的灯照着他（一团暖光：远远就看得出他手里有灯）
    if (lit > 0.01) {
      const fp = carriedFlame(id), fl = 0.85 + 0.15 * Math.sin(W.t * 13) * Math.sin(W.t * 5.1);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, fp[0], fp[1], h * 0.62 * fl, lit * (0.25 + 0.4 * nightK()));
      glowAt(ctx, SP.warm, fp[0], fp[1], h * 0.16, lit * 0.8);
      ctx.globalCompositeOperation = 'source-over';
    }
    clayLamp(ctx, x, y, s * 0.8, lit, 5.3, 2, gale * 0.9);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天与海：远山上的十字架、船、流荡的星、荣光
  // ════════════════════════════════════════════════════════════
  function drawCross(ctx) {
    const k = lv('glCross');
    if (k < 0.005 || !SP) return;
    const s = LS(0) * (PORT ? 1.4 : 1.25), x = X.cross * W.w, y = gY(0, X.cross) + 1.5 * s, h = 30 * s, w = 15 * s;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - h * 0.6, h * 3.4, 0.55 * k);
    glowAt(ctx, SP.white, x, y - h * 0.66, h * 1.1, 0.5 * k);
    ctx.strokeStyle = 'rgb(255,240,206)'; ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + W.t * 0.02, L = h * (1.6 + 0.9 * hsh(i * 2.7));
      ctx.globalAlpha = 0.12 * k; ctx.lineWidth = Math.max(0.8, 1.2 * SU());
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * h * 0.3, y - h * 0.66 + Math.sin(a) * h * 0.3); ctx.lineTo(x + Math.cos(a) * L, y - h * 0.66 + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    ctx.fillStyle = css([58, 46, 40], 0, 1, -0.05);
    ctx.fillRect(x - 1.1 * s, y - h, 2.2 * s, h);
    ctx.fillRect(x - w / 2, y - h * 0.74, w, 2 * s);
    ctx.globalAlpha = 1;
  }
  // 船：子夜顺着月光的倒影驶来，停在坡脚（约三 1:5–8 作客旅的弟兄）；风暴来时又驶回海上
  function boatPt() {
    const k = lv('glBoat'), e = ease(clamp(k, 0, 1));
    return [lerp(-0.12, X.boat, e) * W.w, W.h * lerp(V.boat - 0.012, V.boat, e)];
  }
  function drawBoat(ctx) {
    const k = lv('glBoat');
    if (k < 0.005) return;
    const e = ease(clamp(k, 0, 1)), nk = nightK();
    const s = LS(2) * (PORT ? 0.8 : 0.9) * lerp(0.86, 1, e);
    const bp = boatPt(), x = bp[0], y = bp[1] + Math.sin(W.t * 1.3) * 1.2 * s;
    const rock = Math.sin(W.t * 1.1) * 0.03 + (W.lv.gale || 0) * Math.sin(W.t * 2.3) * 0.08;
    const moonL = W.lv.moon > 0.2 ? nk : 0, md = W.moon && isFinite(W.moon.x) ? (W.moon.x < x ? -1 : 1) : -1;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rock);
    // 夜里的颜色直接给（W.shade 的夜色太暗，船会没在黑海里）
    const nite = (rgb, nc) => { const c = W.shade(rgb, DEP(1), 0.1 * nk), m = mix(c, nc, nk * 0.85); return U.rgb(m[0] | 0, m[1] | 0, m[2] | 0); };
    // 船身：月光下有一道冷亮的边
    ctx.fillStyle = nite([112, 84, 60], [74, 62, 62]);
    ctx.beginPath();
    ctx.moveTo(-26 * s, -7 * s); ctx.quadraticCurveTo(-20 * s, 3 * s, 0, 3 * s); ctx.quadraticCurveTo(20 * s, 3 * s, 27 * s, -8 * s);
    ctx.lineTo(24 * s, -5 * s); ctx.lineTo(-23 * s, -4.5 * s); ctx.closePath(); ctx.fill();
    if (moonL > 0.05) {
      ctx.strokeStyle = 'rgba(206,222,255,' + (0.75 * moonL).toFixed(3) + ')';
      ctx.lineWidth = Math.max(0.8, 1.1 * s);
      ctx.beginPath(); ctx.moveTo(-23 * s, -4.8 * s); ctx.lineTo(24 * s, -5.2 * s); ctx.stroke();
      ctx.beginPath();
      if (md < 0) { ctx.moveTo(-26 * s, -7 * s); ctx.quadraticCurveTo(-20 * s, 3 * s, 0, 3 * s); }
      else { ctx.moveTo(27 * s, -8 * s); ctx.quadraticCurveTo(20 * s, 3 * s, 0, 3 * s); }
      ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1;
    }
    ctx.fillStyle = nite([92, 70, 50], [70, 62, 66]);
    ctx.fillRect(-1 * s, -36 * s, 1.8 * s, 32 * s);
    ctx.fillRect(-12 * s, -32 * s, 24 * s, 1.2 * s);
    // 收起的帆：淡色的帆布受着月光
    ctx.fillStyle = nite([236, 228, 206], [150, 158, 184]);
    ctx.beginPath();
    ctx.moveTo(-12 * s, -31.4 * s); ctx.quadraticCurveTo(0, -27 * s, 12 * s, -31.4 * s); ctx.lineTo(12 * s, -33 * s); ctx.lineTo(-12 * s, -33 * s); ctx.closePath(); ctx.fill();
    // 船头的灯
    const lx = 21 * s, ly = -11 * s;
    ctx.fillStyle = nite([92, 70, 50], [70, 62, 66]);
    ctx.fillRect(lx - 0.5 * s, ly, 1 * s, 5 * s);
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.88 + 0.12 * Math.sin(W.t * 9) * Math.sin(W.t * 3.7);
      glowAt(ctx, SP.lamp, lx, ly, 18 * s, (0.2 + 0.7 * nk) * fl);
      glowAt(ctx, SP.warm, lx, ly, 5 * s, 0.9 * fl);
      glowAt(ctx, SP.white, lx, ly, 1.8 * s, 0.9);
      // 灯照在帆布与船身上
      glowAt(ctx, SP.warm, 6 * s, -18 * s, 16 * s, 0.22 * nk * fl, 1.3);
      if (moonL > 0.05) glowAt(ctx, SP.pale, 0, -31 * s, 16 * s, 0.35 * moonL, 0.35);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    // 灯在水面的倒影
    if (SP && nk > 0.1) {
      ctx.globalCompositeOperation = 'lighter';
      const rx = x + Math.cos(rock) * lx, ry0 = y + 5 * s;
      for (let i = 0; i < 4; i++) glowAt(ctx, SP.lamp, rx + Math.sin(W.t * 2 + i * 1.7) * 2 * s, ry0 + i * 3.2 * s, (5 - i * 0.8) * s, 0.4 * nk * (1 - i * 0.2), 0.35);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 犹 1:13「海里的狂浪」：大风时海上一道道白浪（经文区里淡一些）
  function drawCaps(ctx, pass) {
    const k = W.lv.gale || 0;
    if (k < 0.12) return;
    const kk = clamp((k - 0.12) / 0.5, 0, 1), lt = 0.45 + 0.55 * W.daylight;
    const y0 = pass === 'seaMid' ? W.waterlineY(0) : W.waterlineY(1), y1 = pass === 'seaMid' ? W.waterlineY(1) : W.h;
    if (!(y1 - y0 > 2)) return;
    const N = pass === 'seaNear' ? 60 : 30, seed = pass === 'seaMid' ? 9.3 : 0, tops = [];
    const textK = (x, y) => (!PORT && x < W.w * 0.5 && y > W.h * 0.62 && y < W.h * 0.86 ? 0.3 : 1);
    const paths = [new Path2D(), new Path2D()];
    for (let i = 0; i < N; i++) {
      const y = y0 + (y1 - y0) * Math.pow(hsh(i * 1.37 + seed), 1.15), s = W.seaScale ? W.seaScale(y) : 1;
      const Tm = W.t * (0.32 + 0.12 * hsh(i * 4.1 + seed)) + hsh(i * 2.1 + seed), cyc = Math.floor(Tm), ph = Tm - cyc;
      const x = hsh(i * 3.3 + cyc * 7.1 + seed) * W.w - ph * 18 * s;
      if (!W.isSea(x, y)) continue;
      const len = (26 + 40 * hsh(i * 5.5 + seed)) * s * (0.6 + 0.6 * kk) * Math.sin(ph * Math.PI);
      if (len < 1) continue;
      const P = paths[textK(x, y) < 1 ? 1 : 0];
      P.moveTo(x - len / 2, y + 0.8 * s); P.quadraticCurveTo(x - len * 0.15, y - 4.5 * s, x + len / 2, y + 1.2 * s);
      if (ph > 0.3 && ph < 0.7) tops.push([x - len * 0.1, y - 1.8 * s, s, textK(x, y)]);
    }
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 2.2 * SU() * (pass === 'seaNear' ? 1 : 0.7));
    // 夜里是月光下灰白的浪花（W.shade 的夜色会把白沫压成黑的）
    const fc = mix(W.shade([244, 248, 252], 0.05, 0.35), [150, 166, 198], nightK()), fcs = a => U.rgba(fc[0] | 0, fc[1] | 0, fc[2] | 0, a);
    ctx.strokeStyle = fcs(0.75 * kk); ctx.stroke(paths[0]);
    ctx.strokeStyle = fcs(0.75 * kk * 0.3); ctx.stroke(paths[1]);
    ctx.lineCap = 'butt';
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const [x, y, s, t] of tops) glowAt(ctx, SP.white, x, y, 7 * s, 0.4 * kk * lt * t);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 流荡的星（犹 1:13）：几颗冷白的星拖着尾巴乱走
  function drawWander(ctx) {
    const k = lv('glWander');
    if (k < 0.01 || !SP) return;
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(214,226,255)'; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const sp = 0.012 + 0.01 * hsh(i * 3.3);
      const P = t => {
        const ph = t * sp + hsh(i * 1.7);
        return [(0.12 + 0.86 * ((ph % 1 + 1) % 1)) * W.w + Math.sin(t * 0.4 + i * 2) * W.w * 0.04,
          (0.06 + 0.24 * hsh(i * 5.1) + 0.06 * Math.sin(t * 0.23 + i)) * W.h];
      };
      const p0 = P(W.t);
      ctx.lineWidth = Math.max(0.7, 1.1 * u);
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]);
      let jump = false;
      for (let j = 1; j <= 8; j++) { const q = P(W.t - j * 0.35); if (Math.abs(q[0] - p0[0]) > W.w * 0.3) { jump = true; break; } ctx.lineTo(q[0], q[1]); }
      ctx.globalAlpha = 0.28 * k * (jump ? 0.5 : 1);
      ctx.stroke();
      glowAt(ctx, SP.pale, p0[0], p0[1], 7 * u, 0.7 * k);
      glowAt(ctx, SP.white, p0[0], p0[1], 2.2 * u, 0.9 * k);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 荣光：天顶的光芒（在天的一层）
  function gloryPt() { return [X.table * W.w, (PORT ? 0.34 : -0.03) * W.h]; }
  function drawGlorySky(ctx) {
    const k = lv('glGlory');
    if (k < 0.005 || !SP) return;
    const [x, y] = gloryPt(), m = M();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, m * 0.7, 0.3 * k, 0.8);
    glowAt(ctx, SP.white, x, y, m * 0.22, 0.4 * k);
    ctx.strokeStyle = 'rgb(255,240,206)'; ctx.lineCap = 'round';
    for (let i = 0; i < 24; i++) {
      const a = Math.PI * (0.08 + 0.84 * (i / 23)) + Math.sin(W.t * 0.1 + i) * 0.01;
      const L = m * (0.45 + 0.35 * hsh(i * 2.3));
      ctx.globalAlpha = 0.08 * k * (0.7 + 0.3 * Math.sin(W.t * 0.7 + i * 1.3));
      ctx.lineWidth = Math.max(1, (2 + 3 * hsh(i * 4.1)) * SU());
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * m * 0.05, y + Math.sin(a) * m * 0.05); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  空中：光柱、铺开的光、冷影、降下的光、惧怕的雾、祷告、光穹、荣光……
  // ════════════════════════════════════════════════════════════
  function beamAt(ctx, xf, yBot, w, a) {
    if (a < 0.005 || !SP) return;
    const x = xf * W.w;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, x - w / 2, -10, w, yBot + 10);
    glowAt(ctx, SP.white, x, yBot, w * 0.8, 0.5 * a, 0.45);
  }
  function drawPillar(ctx) {
    const k = lv('glPillar');
    if (k < 0.005 || !SP) return;
    const { y } = tableG();
    ctx.globalCompositeOperation = 'lighter';
    beamAt(ctx, X.table, y - 4, M() * (PORT ? 0.2 : 0.13) * (0.7 + 0.3 * k), 0.62 * k);
    glowAt(ctx, SP.gold, X.table * W.w, y - PH() * 0.5, PH() * 2.2, 0.35 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 光一圈一圈铺开（约一 1:5）
  function drawFront(ctx) {
    const k = lv('glFront');
    if (k < 0.002 || k > 0.998 || !SP) return;
    const e = ease(k), env = Math.sin(Math.PI * k);
    const cx = X.table * W.w, g = gY(2, X.table), fh = fieldH(g), cy = g + fh * 0.25;
    const R = e * W.w * 0.75, m = M();
    ctx.globalCompositeOperation = 'lighter';
    // 光自院中向两边铺开：沿着大地的两团光（左边到了海边就淡去，不照到海上的经文）
    for (const sd of [-1, 1]) {
      const x = cx + sd * R, fade = sd < 0 ? clamp((x / W.w - 0.34) / 0.12, 0, 1) : 1;
      if (fade <= 0.01) continue;
      const gy = gY(2, clamp(x / W.w, 0.36, 1));
      glowAt(ctx, SP.gold, x, gy + fh * 0.1, m * 0.22, 0.34 * env * fade, 0.55);
      glowAt(ctx, SP.white, x, gy - PH() * 0.3, m * 0.07, 0.3 * env * fade, 1.6);
    }
    glowAt(ctx, SP.gold, cx, cy, Math.max(4, R * 0.9), 0.14 * env, 0.3);
    // 天上也有一道向外扩开的光
    glowAt(ctx, SP.white, cx, W.h * 0.3, Math.max(4, R * 0.8), 0.08 * env, 0.7);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 裹住少年人的冷暗的影（约一 2:9–11）
  function drawShade(ctx) {
    const k = lv('glShade');
    if (k < 0.005 || !SP) return;
    const p = figPt('youth', 0.5), f = fig('youth');
    if (!p || !f) return;
    const h = f._h || PH(), day = W.daylight;
    // 白天更浓、更大：在亮绿的草地与白墙前也看得出他在黑暗里
    const A = lerp(0.36, 0.6, day) * k, big = lerp(1, 1.3, day);
    // 先把他身上的颜色褪去（灰暗的一层），再裹上冷暗的影
    ctx.globalCompositeOperation = 'saturation';
    glowAt(ctx, SP.grey, p[0], p[1], h * 0.75 * big, 0.9 * k, 1.5);
    ctx.globalCompositeOperation = 'source-over';
    glowAt(ctx, SP.fog, p[0], p[1], h * 0.7 * big, 0.5 * A, 1.4);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU + W.t * 0.35 * (i % 2 ? 1 : -1);
      const r = h * (0.35 + 0.25 * hsh(i * 2.2)) * (0.7 + 0.3 * k) * big;
      const x = p[0] + Math.cos(a) * h * 0.32 * big + U.noise1(W.t * 0.3 + i) * h * 0.12, y = p[1] + Math.sin(a) * h * 0.4 * big;
      glowAt(ctx, SP.fog, x, y, r, A, 1.1);
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.cold, p[0], p[1], h * 0.9 * big, 0.07 * k, 1.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一点光自天顶降到桌中间（约一 4:9）
  function drawDescent(ctx) {
    const k = lv('glDescent');
    if (k < 0.002 || k > 0.999 || !SP) return;
    const { y: ty } = tableG(), x = X.table * W.w;
    const y0 = -0.04 * W.h, y1 = ty - PH() * 1.05;
    const yy = lerp(y0, y1, ease(k));
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.22 * Math.min(1, k * 4);
    ctx.drawImage(SP.beam, x - M() * 0.03, y0, M() * 0.06, Math.max(1, yy - y0));
    glowAt(ctx, SP.gold, x, yy, PH() * 1.6, 0.55, 1);
    glowAt(ctx, SP.white, x, yy, PH() * 0.4, 0.95, 1);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 惧怕：一堵冷暗的雾自海上涌来；爱一涨，雾就退去（约一 4:18）
  function drawFear(ctx) {
    const f = lv('glFear');
    if (f < 0.005 || !SP) return;
    const c = lv('glCast'), m = M();
    const reach = PORT ? 0.6 : 0.63;
    const front0 = lerp(-0.12, reach, ease(f)) * W.w;
    const front = lerp(front0, -0.35 * W.w, ease(c));
    const A = (1 - c) * Math.min(1, f * 2.2);
    if (A > 0.004) {
      const top = W.horizonY - W.h * 0.03;
      // 冷暗：雾后面的一切都暗下来
      const gr = ctx.createLinearGradient(front - m * 0.25, 0, front + m * 0.04, 0);
      gr.addColorStop(0, 'rgba(14,18,30,' + (0.46 * A).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(14,18,30,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(-20, W.horizonY + 1, Math.max(0, front + m * 0.04 + 20), W.h - W.horizonY + 20);
      // 低低地贴着海面与地面滚来的雾团
      for (let i = 0; i < 54; i++) {
        const u = Math.pow(hsh(i * 1.37), 0.45);
        const x = lerp(-0.25 * W.w, front, u) + U.noise1(W.t * 0.12 + i * 1.9) * m * 0.04;
        const y = lerp(W.horizonY + W.h * 0.03, W.h * 1.02, Math.pow(hsh(i * 2.71), 0.8)) + U.noise1(W.t * 0.1 + i * 3.1) * m * 0.02;
        const r = m * (0.07 + 0.08 * hsh(i * 4.3)) * (0.7 + 0.5 * u);
        glowAt(ctx, SP.fog, x, y, r, 0.42 * A, 0.6);
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 7; j++) glowAt(ctx, SP.cold, front - m * 0.02, lerp(top + m * 0.03, W.h, (j + 0.5) / 7), m * 0.07, 0.06 * A, 1.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 爱的光一涨：一道暖光的波把雾推回海上
    if (c > 0.002 && c < 0.998) {
      const env = Math.sin(Math.PI * c);
      const G = ringG();
      const R = lerp(G.rx, W.w * 0.9, ease(c)), ry = Math.min(R * 0.16, G.fh * 0.95);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, G.cx, G.cy - PH() * 0.4, R, 0.26 * env, 0.42);
      glowAt(ctx, SP.band, G.cx, G.cy, R, 0.55 * env, ry / R);
      glowAt(ctx, SP.gold, front + m * 0.03, W.h * 0.78, m * 0.16, 0.28 * env, 1.6);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 祷告的光升上天去；应允如光雨落下（约一 5:14）
  function drawPrayer(ctx) {
    const k = lv('glPray'), an = lv('glAnswer');
    if ((k < 0.002 || k > 0.999) && an < 0.01) return;
    if (!SP) return;
    ctx.globalCompositeOperation = 'lighter';
    if (k > 0.002 && k < 0.999) {
      const ids = grown().concat(present().filter(id => KIDS[id]));
      ids.forEach((id, i) => {
        const st = figPt(id, 0.62);
        if (!st) return;
        const p = clamp((k - i * 0.035) / 0.62, 0, 1);
        if (p <= 0 || p >= 1) return;
        const e = ease(p), y = lerp(st[1], W.h * 0.04, e);
        const x = st[0] + Math.sin(p * 5 + i * 1.3) * PH() * 0.35 * p;
        const a = Math.sin(Math.PI * p);
        glowAt(ctx, SP.gold, x, y, 9 * SU() * boost(), 0.5 * a);
        glowAt(ctx, SP.white, x, y, 2.6 * SU() * boost(), 0.85 * a);
      });
    }
    if (an > 0.01) {
      const G = ringG();
      ctx.fillStyle = 'rgb(255,242,214)';
      for (let i = 0; i < 40; i++) {
        const sp = 0.07 + 0.05 * hsh(i * 2.9), t = (W.t * sp + hsh(i * 1.1)) % 1;
        const x = G.cx + (hsh(i * 6.3) - 0.5) * 2.3 * G.rx + Math.sin(W.t * 0.6 + i) * 3;
        const y = lerp(W.h * 0.05, G.cy - PH() * 0.3, t);
        ctx.globalAlpha = an * 0.55 * Math.sin(Math.PI * t);
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, 1.2 * SU()), 0, TAU); ctx.fill();
      }
      glowAt(ctx, SP.gold, G.cx, G.cy - PH() * 0.6, G.rx * 1.2, 0.12 * an, 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 神的爱：罩住那一圈人的光穹（犹 1:21）
  function drawKeep(ctx) {
    const k = lv('glKeep');
    if (k < 0.005 || !SP) return;
    const G = ringG(), vis = 0.35 + 0.65 * nightK();
    const R = G.rx * 1.12, H = Math.min(R * (PORT ? 0.9 : 0.62), G.cy - W.h * 0.2);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, G.cx, G.cy - H * 0.4, R * 1.05, 0.2 * k * vis, 0.7);
    ctx.strokeStyle = 'rgb(255,226,180)';
    for (let j = 0; j < 3; j++) {
      ctx.globalAlpha = k * vis * (0.3 - j * 0.08) * (0.85 + 0.15 * Math.sin(W.t * 1.1 + j));
      ctx.lineWidth = Math.max(0.8, (2.6 - j * 0.6) * SU());
      ctx.beginPath(); ctx.ellipse(G.cx, G.cy, R + j * 4 * SU(), H + j * 4 * SU(), 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 荣光临到那一圈人（犹 1:24）
  function drawGloryAir(ctx) {
    const k = lv('glGlory');
    if (k < 0.005 || !SP) return;
    const { y } = tableG(), G = ringG();
    ctx.globalCompositeOperation = 'lighter';
    beamAt(ctx, X.table, y - 4, M() * (PORT ? 0.34 : 0.26), 0.3 * k);
    glowAt(ctx, SP.gold, G.cx, G.cy - PH(), Math.min(W.w * 0.7, G.rx * 1.3), 0.14 * k, 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光：光柱、如水浇下的光、传递的火、一缕缕进到人心里的光
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const q of FXL) {
      if (q.t < 0) continue;
      const u = q.t / q.dur, env = Math.sin(Math.PI * clamp(u, 0, 1));
      if (q.type === 'beam') {
        const p = q.id ? figPt(q.id, 0.1) : null;
        const xf = p ? p[0] / W.w : q.xf, yb = p ? p[1] : q.y;
        beamAt(ctx, xf, yb, q.w, 0.55 * env);
      } else if (q.type === 'sweep') {
        // 真光照耀：一道柔和的金光自海边扫过大地
        const x = lerp(0.36, 1.1, ease(clamp(u, 0, 1))) * W.w, g = gY(2, clamp(x / W.w, 0.4, 1));
        glowAt(ctx, SP.gold, x, g - PH() * 0.6, W.w * 0.16, 0.34 * env, 1.1);
        glowAt(ctx, SP.white, x, g - PH() * 0.5, W.w * 0.06, 0.22 * env, 2.2);
      } else if (q.type === 'wash') {
        const p = figPt(q.id, 0.5), f = fig(q.id);
        if (!p || !f) continue;
        const h = f._h || PH();
        ctx.strokeStyle = 'rgb(236,244,255)'; ctx.lineCap = 'round';
        for (let j = 0; j < 14; j++) {
          const x = p[0] + (hsh(j * 3.3) - 0.5) * h * 0.9;
          const ph = (u * 2.2 + hsh(j * 7.1)) % 1;
          const yh = lerp(p[1] - h * 1.6, p[1] + h * 0.5, ph);
          ctx.globalAlpha = 0.5 * env;
          ctx.lineWidth = Math.max(0.8, 1.3 * SU());
          ctx.beginPath(); ctx.moveTo(x, yh - h * 0.3); ctx.lineTo(x, yh); ctx.stroke();
        }
        glowAt(ctx, SP.pale, p[0], p[1], h * 0.9, 0.35 * env, 1.3);
      } else if (q.type === 'pass') {
        const a = q.fromPt ? q.fromPt() : figPt(q.from, 0.62), b = q.toPt ? q.toPt() : figPt(q.to, 0.62);
        if (!a || !b) continue;
        const e = ease(clamp(u * 1.2, 0, 1));
        const x = lerp(a[0], b[0], e), y = lerp(a[1], b[1], e) - Math.sin(Math.PI * e) * PH() * 0.5;
        glowAt(ctx, SP.lamp, x, y, 12 * SU(), 0.9 * (1 - u * 0.5));
        glowAt(ctx, SP.white, x, y, 3 * SU(), 0.9 * (1 - u * 0.5));
      } else if (q.type === 'stream') {
        const b = figPt(q.to, 0.62);
        if (!b) continue;
        const a = q.from();
        const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - PH() * (0.5 + 0.3 * hsh(q.seed));
        for (let j = 0; j < 6; j++) {
          const tt = clamp(u * 1.4 - j * 0.05, 0, 1);
          if (tt <= 0 || tt >= 1) continue;
          const mt = 1 - tt;
          const x = mt * mt * a[0] + 2 * mt * tt * mx + tt * tt * b[0], y = mt * mt * a[1] + 2 * mt * tt * my + tt * tt * b[1];
          glowAt(ctx, SP.gold, x, y, (6 - j * 0.7) * SU(), 0.8 * (1 - j / 7));
        }
        if (u > 0.68) glowAt(ctx, SP.gold, b[0], b[1], PH() * 0.4, 0.5 * Math.sin(Math.PI * clamp((u - 0.68) / 0.32, 0, 1)));
      } else if (q.type === 'guide') {
        // 约一 2:1 中保：一点光自天上降下，走在蒙赦免的人前头，引他进到圈里（不是约翰领他）
        const p = figPt(q.id, 0.7);
        if (!p) continue;
        const dest = X[q.dest] * W.w, dir = dest >= p[0] ? 1 : -1;
        const ahead = Math.min(Math.abs(dest - p[0]), PH() * 0.9) * dir;
        const down = ease(clamp(u / 0.22, 0, 1)), fade = clamp((1 - u) / 0.18, 0, 1);
        const tx = p[0] + ahead, ty = p[1] - PH() * 0.25;
        const x = tx, y = lerp(-0.02 * W.h, ty, down);
        // 自天上的一道淡光
        ctx.globalAlpha = 0.22 * fade * Math.min(1, u * 6);
        ctx.drawImage(SP.beam, x - M() * 0.025, -10, M() * 0.05, Math.max(1, y + 10));
        const pl = 0.9 + 0.1 * Math.sin(W.t * 5);
        glowAt(ctx, SP.gold, x, y, PH() * 0.8 * pl, 0.5 * fade);
        glowAt(ctx, SP.white, x, y, PH() * 0.2, 0.95 * fade);
        // 光照在他身上
        glowAt(ctx, SP.gold, p[0], p[1] + PH() * 0.2, PH() * 0.7, 0.3 * fade * down, 1.3);
      } else if (q.type === 'gutter') {
        // 灯在风里扑闪几下，灭了；一缕烟
        const p = carriedPt(q.id);
        if (!p) continue;
        const s = p[2] / 34, fx0 = p[0] + 3.7 * s * 0.8, fy0 = p[1] - 2 * s * 0.8;
        if (u < 0.3) {
          // 扑闪：忽明忽暗，越来越弱
          const fl = (1 - u / 0.3) * (0.35 + 0.65 * Math.abs(Math.sin(W.t * 23) * Math.sin(W.t * 7.7)));
          glowAt(ctx, SP.lamp, fx0, fy0 - 3 * s, p[2] * 0.62, fl * (0.25 + 0.4 * nightK()));
          ctx.globalCompositeOperation = 'source-over';
          flame(ctx, fx0, fy0, 4.4 * s * 0.8 * (0.6 + 0.6 * fl), Math.min(1, fl * 1.4), 5.3, 1.2);
          ctx.globalCompositeOperation = 'lighter';
        }
        ctx.globalCompositeOperation = 'source-over';
        for (let j = 0; j < 8; j++) {
          const t = clamp((u - 0.22 - j * 0.06) / 0.62, 0, 1);
          if (t <= 0 || t >= 1) continue;
          const sx = fx0 + Math.sin(t * 5 + j) * 3 * s + t * 14 * s * (W.lv.gale > 0.3 ? -1 : 0.3);
          glowAt(ctx, SP.smoke, sx, fy0 - t * 30 * s, (2.5 + 7 * t) * s, 0.6 * Math.sin(Math.PI * t) * (1 - j * 0.09));
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (q.type === 'shimmer') {
        // 洗脚的水：脚前一片淡淡的水光
        const x = q.x * W.w, y = groundV(q.x, q.v);
        const env2 = Math.sin(Math.PI * clamp(u, 0, 1));
        glowAt(ctx, SP.pale, x, y, PH() * 0.6, 0.55 * env2, 0.4);
        glowAt(ctx, SP.white, x, y - PH() * 0.03, PH() * 0.18, 0.7 * env2, 0.5);
        ctx.fillStyle = 'rgb(236,246,255)';
        for (let j = 0; j < 9; j++) {
          const t = (u * 3 + hsh(j * 2.3)) % 1;
          ctx.globalAlpha = 0.8 * env2 * Math.sin(Math.PI * t);
          ctx.beginPath(); ctx.arc(x + (hsh(j * 5.1) - 0.5) * PH() * 0.7, y - t * PH() * 0.35, Math.max(0.8, 1.1 * SU()), 0, TAU); ctx.fill();
        }
      } else if (q.type === 'flare') {
        // 脚前的灯一齐亮起来（约一 5:12 人有了神的儿子就有生命）
        for (const id of S.lamps) {
          if (skip(id) || id === S.carry || S.out.indexOf(id) >= 0) continue;
          const [x, y, s] = lampPos(id), d = clamp((u - (q.stagger || 0) * S.lamps.indexOf(id)) / 0.5, 0, 1);
          const e2 = Math.sin(Math.PI * d);
          glowAt(ctx, SP.lamp, x + 3 * s, y - 4 * s, 16 * s, 0.7 * e2);
          glowAt(ctx, SP.gold, x + 3 * s, y - 6 * s, 6 * s, 0.8 * e2);
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { layout(); },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 纵深慢慢移过去（只是画面；不入状态）
      const c = C();
      if (c && c.get) for (const id of ALL) { const p = c.get(id); if (p && p._gv != null && Math.abs(p.v - p._gv) > 1e-3) p.v = U.approach(p.v, p._gv, 1.6, f); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { U.safe('gl.glory', () => drawGlorySky(ctx)); U.safe('gl.wander', () => drawWander(ctx)); return; }
      if (pass === 'far') { U.safe('gl.cross', () => drawCross(ctx)); return; }
      if (pass === 'mid') { U.safe('gl.city', () => drawCity(ctx)); return; }
      if (pass === 'seaMid') { U.safe('gl.caps', () => drawCaps(ctx, pass)); return; }
      if (pass === 'seaNear') { U.safe('gl.caps', () => drawCaps(ctx, pass)); U.safe('gl.boat', () => drawBoat(ctx)); return; }
      if (pass === 'near') {
        U.safe('gl.houseG', () => drawHouse(ctx, gHouseG(), { plaster: [214, 200, 174], tile: true, wins: [[-0.3, 0.32], [0.3, 0.32]], open: lv('glDoor'), lamp: 0.7 }));
        U.safe('gl.houseF', () => drawHouse(ctx, fHouseG(), { plaster: [204, 190, 164], tile: false, wins: [[0.26, 0.34]], doorDx: -6, lamp: 0.8 }));
        U.safe('gl.ring', () => drawRing(ctx));
        U.safe('gl.path', () => drawPath(ctx));
        U.safe('gl.table', () => drawTable(ctx));
        return;
      }
      if (pass === 'air') {
        U.safe('gl.ringAir', () => drawRingAir(ctx));
        U.safe('gl.lamps', () => drawLamps(ctx));
        U.safe('gl.carried', () => drawCarried(ctx));
        U.safe('gl.shade', () => drawShade(ctx));
        U.safe('gl.pillar', () => drawPillar(ctx));
        U.safe('gl.front', () => drawFront(ctx));
        U.safe('gl.descent', () => drawDescent(ctx));
        U.safe('gl.prayer', () => drawPrayer(ctx));
        U.safe('gl.keep', () => drawKeep(ctx));
        U.safe('gl.gloryAir', () => drawGloryAir(ctx));
        U.safe('gl.fear', () => drawFear(ctx));
        U.safe('gl.trans', () => drawTransients(ctx));
      }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const g1 = gHouseG(); consider('该犹的家', g1.cx, g1.y - g1.h - 6 * g1.s);
      const tg = tableG(); consider('书信', tg.x - 7 * tg.s, tg.y - 12 * tg.s);
      consider('以弗所', X.theatre * W.w, gY(1, X.theatre) - 14 * LS(1));
      if (lv('glBoat') > 0.5) { const bp = boatPt(); consider('船', bp[0], bp[1] - 14 * LS(2)); }
      if (lv('glCross') > 0.3) consider('十字架', X.cross * W.w, gY(0, X.cross) - 16 * LS(0));
      return best;
    },
  };

  function resetScene() { FXL.length = 0; S = fresh(); CITY = null; }

  // ════════════════════════════════════════════════════════════
  //  人
  // ════════════════════════════════════════════════════════════
  const GREY = [98, 96, 102], LINEN = [236, 232, 220], RAGS = [98, 90, 82], CLOAK = [150, 114, 80];
  const PEOPLE = {
    gaius: { label: '该犹', sex: 'm', age: 'adult', robe: [128, 100, 76], accent: [214, 196, 160], beard: true, prop: null },
    youth: { label: '少年人', sex: 'm', age: 'adult', robe: [92, 116, 134], accent: [210, 196, 170], beard: false, prop: null },
    father: { label: '父老', sex: 'm', age: 'elder', robe: [138, 126, 108], accent: [214, 206, 190], beard: true },
    mother: { label: '母亲', sex: 'f', age: 'adult', robe: [156, 104, 96], accent: [232, 218, 198] },
    forgiven: { label: '认罪的人', sex: 'm', age: 'adult', robe: GREY, accent: [124, 122, 124], beard: true, prop: null },
    child1: { label: '孩子', sex: 'f', age: 'child', robe: [204, 158, 112] },
    child2: { label: '孩子', sex: 'm', age: 'child', robe: [128, 152, 176] },
    poor: { label: '穷乏的弟兄', sex: 'm', age: 'adult', robe: RAGS, accent: [82, 74, 66], beard: true, prop: null },
    lady: { label: '蒙拣选的太太', sex: 'f', age: 'adult', robe: [120, 92, 140], accent: [236, 226, 210] },
    kid: { label: '她的儿女', sex: 'f', age: 'child', robe: [190, 146, 160] },
    trav1: { label: '低米丢', sex: 'm', age: 'adult', robe: [112, 106, 92], accent: [196, 180, 150], beard: true, prop: 'staff' },
    trav2: { label: '作客旅的弟兄', sex: 'm', age: 'adult', robe: [126, 98, 78], accent: [200, 176, 140], beard: false, prop: 'bundle' },
  };
  function person(id, key, o) {
    if (skip(id)) return null;
    return add(id, Object.assign({}, PEOPLE[id], { x: X[key], v: V[key], glow: 0.26 }, o || {}));
  }
  function glowAll(v, ids) { for (const id of ids || present()) glow(id, v); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：天将亮未亮，海边的城外，老约翰独自坐在灯下
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    W.set('bare', 0, true); W.set('bloom', 0.55, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.75, herbs: 0.6, trees: 0.3, lights: 1, moon: 0.7, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('glLamp', 1, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * X.table, W.ridgeBaseY(2, W.w * X.table));
    W.setOrigin('herbs', W.w * X.table, W.ridgeBaseY(2, W.w * X.table));
    W.setOrigin('trees', W.w * 0.42, W.ridgeBaseY(2, W.w * 0.42));
    W.goTo(0.17, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 6, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    // 作长老的约翰：同一副样子（门徒约翰），如今老了
    add('john', Object.assign({}, LOOK().john || { label: '约翰', sex: 'm', robe: [150, 70, 64] }, { age: 'elder', x: X.john, v: V.john, facing: -1, pose: 'sit', glow: 0.34, prop: 'staff' }));
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 约一 1:5 神就是光，在他毫无黑暗 ─────────────────────
    {
      kind: 'act', utter: '神就是光，在他毫无黑暗', cmd: 'light --everywhere  # darkness: 0', ref: '1:5',
      verse: [
        { text: '神就是光，在他毫无黑暗。<br>这是我们从主所听见、又报给你们的信息。', ref: '约翰一书 1:5', hold: 7.5 },
        { text: '我们若在光明中行，如同神在光明中，就彼此相交，<br>他儿子耶稣的血也洗净我们一切的罪。', ref: '约翰一书 1:7', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('glPillar', 1, b.instant);
            W.set('glFront', 1, b.instant);
            W.goTo(0.29, 12, b.instant);
            pose('john', 'stand');
            sfx(b, 'harp');
            flashW(b, 0.25);
          }],
          [1.4, b => { pose('john', 'gaze'); const { x, y } = tableG(); sparkleAt(b, x, y - PH() * 0.4, 24, [255, 240, 210], 16); }],
          // 两家的门开了，人走进光里
          [3.6, b => {
            W.set('glLamp', 0, b.instant);
            person('gaius', 'gHouse', { facing: 1, v: 0.02 });
            person('youth', 'gHouse', { facing: 1, v: 0.06 });
            person('father', 'fHouse', { facing: -1, v: 0.02 });
            person('mother', 'fHouse', { facing: -1, v: 0.06 });
            go('gaius', 'gaius', { speed: 0.03 }); go('youth', 'youth', { speed: 0.028 });
            go('father', 'father', { speed: 0.024 }); go('mother', 'mother', { speed: 0.026 });
            W.setPop('bird', 12, W.w * 0.62, W.h * 0.3, b.instant);
            sfx(b, 'gate', { soft: true });
          }],
          // 彼此相交
          [9.6, b => {
            for (const id of ['gaius', 'youth', 'father', 'mother']) { pose(id, 'stand'); face(id, X.table); }
            face('john', -1); pose('john', 'raise');
            W.set('glRing', 0.6, b.instant); W.set('glRingR', 0.3, b.instant);
            W.set('glPillar', 0.25, b.instant);
            sfx(b, 'bird', { soft: true });
          }],
          [11.4, b => { hands('gaius', 'youth'); hands('father', 'mother'); glowAll(0.3); const { x, y } = tableG(); ringAt(b, x, y, 0.12, [255, 230, 190], 2.2, 1.4); }],
          [14.2, b => { pose('john', 'stand'); W.set('glPillar', 0, b.instant); }],
        ]);
      },
    },

    // ── 2 · 约一 1:9 神是信实的，是公义的，必要赦免我们的罪 ─────────────
    {
      kind: 'promise', utter: '神是信实的，是公义的，必要赦免我们的罪', cmd: 'confess && forgive --faithful --just && wash --all', ref: '1:9',
      verse: [
        { text: '我们若说自己无罪，便是自欺，真理不在我们心里了。', ref: '约翰一书 1:8', hold: 5.5 },
        { text: '我们若认自己的罪，神是信实的，是公义的，<br>必要赦免我们的罪，洗净我们一切的不义。', ref: '约翰一书 1:9', hold: 8 },
        { text: '我小子们哪……若有人犯罪，在父那里我们有一位中保，<br>就是那义者耶稣基督。', ref: '约翰一书 2:1', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            hands('gaius', 'youth', false); hands('father', 'mother', false);
            W.goTo(0.33, 12, b.instant);
            person('forgiven', 'sinA', { facing: 1, glow: 0.08, pose: 'weep' });
            go('forgiven', 'sinK', { speed: 0.026, pose: 'weep' });
            sfx(b, 'weep', { soft: true });
          }],
          [2.2, b => { for (const id of ['gaius', 'youth', 'father', 'mother', 'john']) face(id, X.sinK); }],
          [4.2, b => pose('forgiven', 'kneel', { weep: true })],
          // 神是信实的：光如水浇下
          [6.9, b => {
            trans(b, { type: 'beam', id: 'forgiven', w: PH() * 1.3, dur: 5.2 });
            trans(b, { type: 'wash', id: 'forgiven', dur: 4.2, t: -0.8 });
            go('john', 'johnK', { speed: 0.042 });
            sfx(b, 'pour', { soft: true });
          }],
          [9.4, b => {
            S.washed = 1;
            add('forgiven', { robe: LINEN, accent: [214, 206, 190], label: '蒙赦免的人', glow: 0.42 });
            pose('forgiven', 'kneel', { weep: false });
            ringOn(b, 'forgiven', 0.12, [236, 244, 255], 0.5);
            sparkleOn(b, 'forgiven', 26, [240, 246, 255], 0.5);
            sfx(b, 'harp');
          }],
          // 老约翰扶他起来
          [12.6, b => { face('john', 'forgiven'); face('forgiven', 'john'); pose('forgiven', 'stand'); hands('john', 'forgiven'); }],
          [15.2, b => { hands('john', 'forgiven', false); face('forgiven', X.forgiven); }],
          // 在父那里我们有一位中保，就是那义者耶稣基督：一点光自上头降下，走在他前头，引他进到圈里（约翰只走在旁边）
          [16.2, b => {
            trans(b, { type: 'guide', id: 'forgiven', dest: 'forgiven', dur: 6.4 });
            glow('forgiven', 0.46);
            sfx(b, 'chime', { soft: true });
          }],
          [17.4, b => {
            go('forgiven', 'forgiven', { speed: 0.024 });
            W.set('glRingR', 0.42, b.instant); W.set('glRing', 0.7, b.instant);
          }],
          [18.4, b => { go('john', 'john', { speed: 0.026 }); }],
          [21.2, b => { faceTable(['forgiven', 'gaius', 'youth', 'father', 'mother']); face('john', -1); }],
        ]);
      },
    },

    // ── 3 · 约一 2:8 黑暗渐渐过去，真光已经照耀 ──────────────────────
    {
      kind: 'act', utter: '黑暗渐渐过去，真光已经照耀', cmd: 'while (darkness.passing) light.shine()', ref: '2:8',
      verse: [
        { text: '人若说自己在光明中，却恨他的弟兄，他到如今还是在黑暗里。', ref: '约翰一书 2:9', hold: 6 },
        { text: '爱弟兄的，就是住在光明中，在他并没有绊跌的缘由。', ref: '约翰一书 2:10', hold: 5.5 },
        { text: '再者，我写给你们的，是一条新命令……<br>因为黑暗渐渐过去，真光已经照耀。', ref: '约翰一书 2:8', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 少年人背转身走开：一团冷暗的影裹住他
          [0, b => {
            W.goTo(0.37, 14, b.instant);
            face('youth', 1);
            go('youth', 'youthOut', { speed: 0.052 });
            W.set('glShade', 1, b.instant);
            glow('youth', 0);
            face('forgiven', 'youth');
            sfx(b, 'whisper', { soft: true });
          }],
          [5.6, b => { pose('youth', 'bow'); face('youth', 1); }],
          // 爱弟兄的：他的哥哥跑去抱住他
          [7.6, b => {
            face('youth', -1); pose('youth', 'stand');
            embrace('forgiven', 'youth', { run: true, at: X.embY });
            const f = fig('forgiven'); if (f) setV('forgiven', V.embY);
            setV('youth', V.embY);
          }],
          [10.4, b => { W.set('glShade', 0, b.instant); sfx(b, 'harp'); }],
          [12.2, b => { glow('youth', 0.34); ringOn(b, 'youth', 0.12, [255, 234, 196], 0.55); }],
          // 真光已经照耀：二人一同回来，众人身上都亮了
          [14.6, b => {
            go('forgiven', 'forgiven', { speed: 0.036 }); go('youth', 'youth', { speed: 0.034 });
            W.set('glRingR', 0.52, b.instant); W.set('glRing', 0.75, b.instant);
            trans(b, { type: 'sweep', dur: 4.5 });
            glowAll(0.34);
            sfx(b, 'bell', { soft: true });
          }],
          [21, b => { faceTable(['forgiven', 'youth']); }],
        ]);
      },
    },

    // ── 4 · 约一 3:1 你看父赐给我们是何等的慈爱 ───────────────────────
    {
      kind: 'act', utter: '你看父赐给我们是何等的慈爱', cmd: 'adopt --as 神的儿女 --by 父', ref: '3:1',
      verse: [
        { text: '你看父赐给我们是何等的慈爱，使我们得称为神的儿女；<br>我们也真是他的儿女。', ref: '约翰一书 3:1', hold: 7.5 },
        { text: '亲爱的弟兄啊，我们现在是神的儿女，将来如何，还未显明；<br>但我们知道，主若显现，我们必要像他，因为必得见他的真体。', ref: '约翰一书 3:2', hold: 9 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.43, 14, b.instant);
            pose('john', 'sit'); face('john', -1);
            person('child1', 'fHouse', { facing: -1, v: 0.08 });
            person('child2', 'fHouse', { facing: -1, v: 0.1 });
            go('child1', 'child1', { run: true, pose: 'kneel' });
            go('child2', 'child2', { run: true, pose: 'sit' });
            face('mother', X.child1);
            sfx(b, 'laugh', { soft: true });
          }],
          // 上头的光落在孩子们身上
          [3.4, b => {
            trans(b, { type: 'beam', xf: (X.child1 + X.child2) / 2, y: groundV(X.child1, 0.2), w: PH() * 2.6, dur: 6.5 });
            glow('child1', 0.46); glow('child2', 0.46);
            sfx(b, 'harp');
          }],
          [4.6, b => nameAt(b, '神的儿女', X.table, PORT ? 0.52 : 0.46, { hold: 3.8, rgb: [255, 232, 196] })],
          // 主若显现，我们必要像他：众人抬头，身上更亮
          [9.6, b => {
            for (const id of ['gaius', 'youth', 'father', 'mother', 'forgiven']) pose(id, 'gaze');
            pose('child1', 'raise'); pose('child2', 'raise');
            glowAll(0.4);
            W.set('glRingR', 0.62, b.instant); W.set('glRing', 0.8, b.instant);
            const { x, y } = tableG(); ringAt(b, x, y - PH() * 0.3, 0.14, [255, 236, 204], 2.6, 1.6);
          }],
          [15.2, b => {
            for (const id of ['gaius', 'youth', 'father', 'mother', 'forgiven']) pose(id, 'stand');
            pose('child1', 'kneel'); pose('child2', 'sit');
            faceTable(['gaius', 'youth', 'father', 'mother', 'forgiven', 'child1', 'child2']);
          }],
        ]);
      },
    },

    // ── 5 · 约一 3:16 主为我们舍命，我们从此就知道何为爱 ───────────────
    {
      kind: 'act', utter: '主为我们舍命，我们从此就知道何为爱', cmd: 'love --in-deed --in-truth  # not just words', ref: '3:16',
      verse: [
        { text: '主为我们舍命，我们从此就知道何为爱；我们也当为弟兄舍命。', ref: '约翰一书 3:16', hold: 6.5 },
        { text: '凡有世上财物的，看见弟兄穷乏，却塞住怜恤的心，<br>爱神的心怎能存在他里面呢？', ref: '约翰一书 3:17', hold: 7 },
        { text: '小子们哪，我们相爱，不要只在言语和舌头上，<br>总要在行为和诚实上。', ref: '约翰一书 3:18', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 远山上的十字架，光在它背后
          [0, b => {
            W.set('glCross', 1, b.instant);
            W.goTo(0.5, 14, b.instant);
            for (const id of ['gaius', 'youth', 'father', 'mother', 'forgiven', 'john']) face(id, X.cross);
            pose('father', 'bow'); pose('mother', 'bow');
            sfx(b, 'bell', { soft: true });
          }],
          [2, b => { person('poor', 'poorA', { facing: -1, glow: 0.1, pose: 'sit' }); }],
          [6.6, b => { W.set('glCross', 0.3, b.instant); pose('father', 'stand'); pose('mother', 'stand'); faceTable(['gaius', 'youth', 'father', 'mother', 'forgiven']); face('john', -1); }],
          // 看见弟兄穷乏：该犹拿着饼走去
          [8, b => {
            face('gaius', X.poorA); hold('gaius', 'bundle');
            go('gaius', 'gaiusP', { speed: 0.062 });
          }],
          [13.4, b => {
            S.gave = 1;
            hold('gaius', null); hold('poor', 'bundle');
            add('poor', { robe: CLOAK, accent: [206, 180, 140], glow: 0.36 });
            pose('poor', 'stand'); face('gaius', 1); face('poor', -1);
            sparkleOn(b, 'poor', 22, [255, 232, 190], 0.55);
            sfx(b, 'harp');
          }],
          // 总要在行为和诚实上：领他回来
          [16.6, b => {
            go('poor', 'poor', { speed: 0.03 }); go('gaius', 'gaius', { speed: 0.052 });
            W.set('glRingR', 0.72, b.instant); W.set('glRing', 0.85, b.instant);
            W.set('glCross', 0, b.instant);
            hands('gaius', 'poor', false);
          }],
          [22, b => { faceTable(['poor', 'gaius']); }],
        ]);
      },
    },

    // ── 6 · 约一 4:8 神就是爱 ───────────────────────────────────
    {
      kind: 'act', utter: '神就是爱', cmd: 'echo $GOD  # => 爱', ref: '4:8',
      verse: [
        { text: '亲爱的弟兄啊，我们应当彼此相爱，因为爱是从神来的。<br>凡有爱心的，都是由神而生，并且认识神。', ref: '约翰一书 4:7', hold: 7.5 },
        { text: '没有爱心的，就不认识神，因为神就是爱。', ref: '约翰一书 4:8', hold: 5.5 },
        { text: '神差他独生子到世间来，使我们藉着他得生，<br>神爱我们的心在此就显明了。', ref: '约翰一书 4:9', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          // 爱席：众人围着矮桌坐下；穷乏的弟兄把饼放在桌上
          [0, b => {
            W.goTo(0.66, 9, b.instant);   // 午后金黄的光：日头低在右边，不在「爱」字后头
            hold('poor', null);
            W.set('glFeast', 1, b.instant);
            for (const id of ['john', 'gaius', 'father', 'mother', 'forgiven', 'poor', 'child2']) pose(id, 'sit');
            pose('youth', 'kneel'); pose('child1', 'kneel');
            faceTable(['gaius', 'youth', 'father', 'mother', 'forgiven', 'poor', 'child1', 'child2']); face('john', -1);
            sfx(b, 'chime', { soft: true });
          }],
          // 神就是爱：那一圈光大放光明，天上聚成一个「爱」字
          [9.2, b => {
            W.set('glLove', 1, b.instant); W.set('glRing', 1, b.instant); W.set('glRingR', 0.82, b.instant);
            nameAt(b, '爱', X.table, PORT ? 0.5 : 0.42, { size: PORT ? 0.2 * W.w : 88 * SU(), hold: 4.6, rgb: [255, 168, 120] });
            const { x, y } = tableG(); ringAt(b, x, y - PH() * 0.3, 0.16, [255, 214, 180], 2.8, 1.8);
            trans(b, { type: 'beam', xf: X.table, y: y - 4, w: M() * (PORT ? 0.3 : 0.2), dur: 6 });
            sfx(b, 'bell');
          }],
          // 神差他独生子到世间来：一点光自天顶降下
          [16, b => { W.set('glDescent', 1, b.instant); sfx(b, 'harp'); }],
          [21, b => {
            W.set('glDescent', 0, true);
            const { x, y } = tableG();
            const from = () => [x, y - PH() * 1.05];
            present().forEach((id, i) => trans(b, { type: 'stream', from, to: id, t: -i * 0.18, dur: 2.6, seed: i }));
            glowAll(0.44);
            W.set('bloom', 1, b.instant); W.set('grass', 0.95, b.instant); W.set('herbs', 0.8, b.instant);
            ringAt(b, x, y - PH(), 0.16, [255, 240, 214], 2.6, 1.6);
            sfx(b, 'harp');
          }],
        ]);
      },
    },

    // ── 7 · 约一 4:18 爱里没有惧怕 ──────────────────────────────────
    {
      kind: 'act', utter: '爱里没有惧怕', cmd: 'fear.castOut(love.perfect)', ref: '4:18',
      verse: [
        { text: '神爱我们的心，我们也知道也信。神就是爱；<br>住在爱里面的，就是住在神里面，神也住在他里面。', ref: '约翰一书 4:16', hold: 8 },
        { text: '爱里没有惧怕；爱既完全，就把惧怕除去。<br>因为惧怕里含着刑罚，惧怕的人在爱里未得完全。', ref: '约翰一书 4:18', hold: 8 },
      ],
      apply(c) {
        T(c, [
          // 黄昏，一堵冷暗的雾自海上涌来
          [0, b => {
            W.goTo(0.735, 9, b.instant);
            W.set('glFeast', 0.6, b.instant);
            W.set('gale', 0.5, b.instant); W.set('clouds', 0.6, b.instant);
            W.set('glFear', 1, b.instant);
            sfx(b, 'wind');
          }],
          [3.4, b => {
            pose('child1', 'kneel', { weep: true }); pose('child2', 'kneel', { weep: true });
            pose('mother', 'kneel'); face('mother', X.child1);
            for (const id of ['gaius', 'youth', 'father', 'forgiven', 'poor']) { pose(id, 'bow'); face(id, -1); }
            W.set('glLove', 0.35, b.instant); W.set('glRing', 0.55, b.instant);
            sfx(b, 'whisper', { soft: true });
          }],
          [6.8, b => { pose('john', 'stand'); face('john', -1); }],
          // 爱既完全，就把惧怕除去
          [9.8, b => {
            pose('john', 'raise');
            for (const id of ['gaius', 'youth', 'father', 'mother', 'forgiven', 'poor']) { pose(id, 'stand'); face(id, X.table); }
            pose('child1', 'stand', { weep: false }); pose('child2', 'stand', { weep: false });
            W.set('glCast', 1, b.instant);
            W.set('glLove', 1, b.instant); W.set('glRing', 1, b.instant);
            W.set('gale', 0, b.instant); W.set('clouds', 0.35, b.instant);
            sfx(b, 'harp'); sfx(b, 'bell', { soft: true });
          }],
          [11.2, b => { hands('gaius', 'youth'); hands('father', 'mother'); hands('forgiven', 'poor'); glowAll(0.4); }],
          [13.8, b => { W.set('glFear', 0, true); W.set('glCast', 0, true); pose('john', 'stand'); }],
        ]);
      },
    },

    // ── 8 · 约一 4:19 我们爱，因为神先爱我们 ──────────────────────────
    {
      kind: 'act', utter: '我们爱，因为神先爱我们', cmd: 'for (p of 众人) p.lamp = prev.lamp  # 神先', ref: '4:19',
      verse: [
        { text: '不是我们爱神，乃是神爱我们，<br>差他的儿子为我们的罪作了挽回祭，这就是爱了。', ref: '约翰一书 4:10', hold: 7.5 },
        { text: '我们爱，因为神先爱我们。', ref: '约翰一书 4:19', hold: 4.5 },
        { text: '爱神的，也当爱弟兄，这是我们从神所受的命令。', ref: '约翰一书 4:21', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.82, 12, b.instant);
            hands('gaius', 'youth', false); hands('father', 'mother', false); hands('forgiven', 'poor', false);
            W.set('glFeast', 0.4, b.instant);
            for (const id of present()) if (!KIDS[id]) pose(id, 'stand');
            pose('child1', 'sit'); pose('child2', 'sit');
          }],
          // 神先爱我们：一道光先落在约翰手中
          [1.6, b => { trans(b, { type: 'beam', id: 'john', w: PH() * 1.1, dur: 4 }); pose('john', 'gaze'); sfx(b, 'harp'); }],
          [3.4, b => { hold('john', 'torch'); pose('john', 'stand'); glow('john', 0.42); sparkleOn(b, 'john', 16, [255, 214, 150], 1.05); sfx(b, 'fire', { soft: true }); }],
          // 火一个传一个
          ...['gaius', 'mother', 'youth', 'father', 'forgiven', 'poor'].map((id, i, arr) => [9.4 + i * 0.75, b => {
            const prev = i ? arr[i - 1] : 'john';
            trans(b, { type: 'pass', from: prev, to: id, dur: 0.8 });
            hold(id, 'torch'); glow(id, 0.4);
            if (i % 2 === 0) sfx(b, 'chime', { soft: true });
          }]),
          // 爱弟兄：灯举起来，城中的窗一扇扇亮起
          [14.8, b => {
            for (const id of ['john', 'gaius', 'mother', 'youth', 'father', 'forgiven', 'poor']) pose(id, 'raise');
            W.set('glCity', 1, b.instant);
            glow('child1', 0.4); glow('child2', 0.4);
            sfx(b, 'harp');
          }],
          [19, b => { for (const id of ['john', 'gaius', 'mother', 'youth', 'father', 'forgiven', 'poor']) pose(id, 'stand'); }],
        ]);
      },
    },

    // ── 9 · 约一 5:14 我们若照他的旨意求什么，他就听我们 ─────────────────
    {
      kind: 'promise', utter: '我们若照他的旨意求什么，他就听我们', cmd: 'pray --according-to 他的旨意 && await 听', ref: '5:14',
      verse: [
        { text: '因为凡从神生的，就胜过世界；<br>使我们胜了世界的，就是我们的信心。', ref: '约翰一书 5:4', hold: 6.5 },
        { text: '这见证就是神赐给我们永生；这永生也是在他儿子里面。<br>人有了神的儿子就有生命，没有神的儿子就没有生命。', ref: '约翰一书 5:11–12', hold: 8.5 },
        { text: '我们若照他的旨意求什么，他就听我们，<br>这是我们向他所存坦然无惧的心。', ref: '约翰一书 5:14', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 夜：灯放在脚前，众人跪下祷告
          [0, b => {
            W.goTo(0.9, 12, b.instant);
            W.set('glFeast', 0, b.instant);
            const holders = ['john', 'gaius', 'mother', 'youth', 'father', 'forgiven', 'poor'].filter(id => has(id));
            for (const id of holders) { hold(id, null); if (S.lamps.indexOf(id) < 0) S.lamps.push(id); }
            W.set('glLamps', 1, b.instant);
            for (const id of holders) pose(id, 'pray');
            pose('child1', 'kneel'); pose('child2', 'kneel');
            faceTable(['gaius', 'youth', 'father', 'mother', 'forgiven', 'poor', 'child1', 'child2']); face('john', -1);
            sfx(b, 'whisper', { soft: true });
          }],
          [2.2, b => { W.set('glPray', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          // 永生：各人心里的光不再暗
          [8.6, b => { glowAll(0.48); const G = ringG(); ringAt(b, G.cx, G.cy - PH() * 0.5, 0.14, [255, 236, 200], 2.6, 1.4); }],
          // 人有了神的儿子就有生命：脚前的灯一齐亮起，一缕缕光自桌上进到各人心里
          [12.4, b => {
            trans(b, { type: 'flare', dur: 2.8, stagger: 0.035 });
            const { x, y } = tableG();
            const from = () => [x, y - PH() * 1.05];
            present().forEach((id, i) => trans(b, { type: 'stream', from, to: id, t: -i * 0.15, dur: 2.4, seed: i + 3 }));
            sfx(b, 'chime', { soft: true });
          }],
          // 他就听我们：应允如光雨落下
          [18, b => {
            W.set('glAnswer', 1, b.instant);
            W.set('glRing', 1, b.instant); W.set('glLove', 1, b.instant);
            sfx(b, 'stars'); sfx(b, 'harp');
          }],
          [23.4, b => { W.set('glAnswer', 0.25, b.instant); }],
        ]);
      },
    },

    // ── 10 · 约二 1:6 我们若照他的命令行，这就是爱 ───────────────────────
    {
      kind: 'act', utter: '我们若照他的命令行，这就是爱', cmd: 'walk --in 真理 --in 爱 --from 起初', ref: '约翰二书 1:6',
      verse: [
        { text: '作长老的写信给蒙拣选的太太和她的儿女，就是我诚心所爱的……', ref: '约翰二书 1:1', hold: 6 },
        { text: '我见你的儿女，有照我们从父所受之命令遵行真理的，就甚欢喜。', ref: '约翰二书 1:4', hold: 6 },
        { text: '我们若照他的命令行，这就是爱。<br>你们从起初所听见当行的，就是这命令。', ref: '约翰二书 1:6', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 蒙拣选的太太和她的女儿提着灯从路上来，身后一路光的脚踪
          [0, b => {
            W.goTo(0.95, 12, b.instant);
            W.set('glPray', 0, true); W.set('glAnswer', 0, b.instant);
            for (const id of ['gaius', 'youth', 'father', 'mother', 'forgiven', 'poor', 'child1', 'child2']) pose(id, 'sit');
            pose('john', 'sit');
            person('lady', 'ladyA', { facing: -1, prop: 'torch', glow: 0.38 });
            person('kid', 'kidA', { facing: -1, glow: 0.36 });
            go('lady', 'ladyM', { speed: 0.036 }); go('kid', 'kidM', { speed: 0.034 });
            W.set('glPath', 1, b.instant);
          }],
          // 老约翰迎上去
          [7.6, b => { go('john', 'embL', { speed: 0.03 }); face('lady', -1); }],
          [11, b => {
            embrace('john', 'lady', { at: X.embL + (PORT ? 0.01 : 0.008) });
            for (const id of ['child1', 'child2']) { pose(id, 'stand'); face(id, 1); }
            sfx(b, 'harp');
          }],
          // 照他的命令行：众人一同进到圈里
          [14.8, b => {
            go('lady', 'lady', { speed: 0.03 }); go('kid', 'kid', { speed: 0.03 }); go('john', 'john', { speed: 0.03 });
            W.set('glRingR', 0.92, b.instant);
            ringOn(b, 'lady', 0.14, [255, 232, 190], 0.5);
          }],
          [19.2, b => {
            hold('lady', null); if (S.lamps.indexOf('lady') < 0) S.lamps.push('lady');
            pose('lady', 'sit'); pose('kid', 'sit'); pose('john', 'sit');
            pose('child1', 'sit'); pose('child2', 'sit');
            faceTable(['lady', 'kid', 'child1', 'child2']); face('john', -1);
            W.set('glPath', 0.45, b.instant);
          }],
        ]);
      },
    },

    // ── 11 · 约三 1:11 行善的属乎神 ────────────────────────────────
    {
      kind: 'act', utter: '行善的属乎神', cmd: 'open --door && welcome 客旅 --for 主的名', ref: '约翰三书 1:11',
      verse: [
        { text: '作长老的写信给亲爱的该犹，就是我诚心所爱的。', ref: '约翰三书 1:1', hold: 4.5 },
        { text: '我听见我的儿女们按真理而行，我的喜乐就没有比这个大的。', ref: '约翰三书 1:4', hold: 5.5 },
        { text: '亲爱的兄弟啊，凡你向作客旅之弟兄所行的都是忠心的。', ref: '约翰三书 1:5', hold: 5 },
        { text: '亲爱的兄弟啊，不要效法恶，只要效法善。<br>行善的属乎神；行恶的未曾见过神。', ref: '约翰三书 1:11', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 子夜，一只船靠岸
          [0, b => {
            W.goTo(0.02, 10, b.instant);
            W.set('glBoat', 1, b.instant);
            W.set('glPath', 0.2, b.instant);
            sfx(b, 'oars', { soft: true });
          }],
          // 两个作客旅的弟兄一前一后下了船，上坡来
          [4.8, b => {
            person('trav1', 'travA', { facing: 1, glow: 0.34 });
            go('trav1', 'trav1D', { speed: 0.03 });
          }],
          [5.6, b => {
            person('trav2', 'trav2A', { facing: 1, glow: 0.34 });
            go('trav2', 'trav2D', { speed: 0.03 });
          }],
          // 叩门；该犹开门
          [9.4, b => {
            sfx(b, 'knock');
            face('trav1', 1);
            pose('gaius', 'stand'); go('gaius', 'gaiusD', { speed: 0.04 });
          }],
          [11, b => { W.set('glDoor', 1, b.instant); sfx(b, 'gate', { soft: true }); }],
          // 凡你向作客旅之弟兄所行的都是忠心的：接待，打水洗脚
          [12.8, b => {
            embrace('gaius', 'trav1', { at: X.embT });
            hold('trav2', null);
          }],
          // 客旅坐在开着的门前的门槛上（门里的暖光照着他们），该犹提着水跪在他们脚前
          [15.0, b => {
            go('trav1', 'trav1W', { speed: 0.032, pose: 'sit' }); go('trav2', 'trav2W', { speed: 0.032, pose: 'sit' });
            hold('gaius', 'jar'); go('gaius', 'gaiusW', { speed: 0.036, pose: 'kneel' });
          }],
          [17, b => {
            for (const id of ['trav1', 'trav2']) { pose(id, 'sit'); face(id, -1); }
            pose('gaius', 'kneel'); face('gaius', 1);
            trans(b, { type: 'shimmer', x: (X.gaiusW + (skip('trav2') ? X.trav1W : X.trav2W)) / 2, v: V.gaiusW, dur: 3.2 });
            sparkleAt(b, ((X.gaiusW + (skip('trav2') ? X.trav1W : X.trav2W)) / 2) * W.w, groundV((X.gaiusW + X.trav1W) / 2, V.gaiusW) - 4, 14, [230, 242, 255], 8);
            sfx(b, 'pour', { soft: true });
          }],
          // 行善的属乎神：光落在他们身上，一同进到圈里
          [19.4, b => {
            S.guests = 1;
            trans(b, { type: 'beam', id: 'gaius', w: PH() * 2.2, dur: 5 });
            glow('gaius', 0.46); glow('trav1', 0.42); glow('trav2', 0.42);
            hold('gaius', null); pose('gaius', 'stand');
            sparkleOn(b, 'gaius', 20, [255, 236, 196], 0.6);
            sfx(b, 'harp');
          }],
          [21.6, b => {
            go('trav1', 'trav1', { speed: 0.032 }); go('trav2', 'trav2', { speed: 0.03 }); go('gaius', 'gaius', { speed: 0.034 });
            W.set('glRingR', 1, b.instant);
          }],
          [25.2, b => {
            for (const id of ['trav1', 'trav2', 'gaius']) { pose(id, 'sit'); face(id, X.table); if (!skip(id) && S.lamps.indexOf(id) < 0) S.lamps.push(id); }
            hold('trav1', null);
            W.set('glDoor', 0.35, b.instant);
          }],
        ]);
      },
    },

    // ── 12 · 犹 1:21 保守自己常在神的爱中 ─────────────────────────────
    {
      kind: 'cmd', utter: '保守自己常在神的爱中', cmd: 'keep --self --in 神的爱 --through storm', ref: '犹大书 1:21',
      verse: [
        { text: '……是没有雨的云彩，被风飘荡；……<br>是海里的狂浪，涌出自己可耻的沫子来；是流荡的星……', ref: '犹大书 1:12–13', hold: 7 },
        { text: '亲爱的弟兄啊，你们却要在至圣的真道上造就自己，在圣灵里祷告，<br>保守自己常在神的爱中，仰望我们主耶稣基督的怜悯，直到永生。', ref: '犹大书 1:20–21', hold: 9 },
        { text: '有些人存疑心，你们要怜悯他们；', ref: '犹大书 1:22', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          // 黎明前的风暴：没有雨的云彩、海里的狂浪、流荡的星
          [0, b => {
            W.goTo(0.12, 16, b.instant);
            W.set('gale', 0.95, b.instant); W.set('storm', 0.62, b.instant); W.set('clouds', 0.9, b.instant);
            W.set('glWander', 1, b.instant);
            W.set('glDoor', 0, b.instant);
            W.set('glBoat', 0, b.instant);   // 船趁风暴未到驶回海上
            sfx(b, 'wind'); sfx(b, 'wave', { soft: true });
          }],
          // 少年人起了疑心，拿着自己的灯走开，走向海边
          [2, b => {
            S.carry = 'youth';
            pose('youth', 'stand'); face('youth', -1);
            go('youth', 'doubt', { speed: 0.036, pose: 'carry' });
            glow('youth', 0.34);
          }],
          // 雷声中，他手里的灯扑闪几下，灭了
          [5.2, b => {
            if (!b.instant && GS.weather && GS.weather.bolt) U.safe('weather.bolt', () => GS.weather.bolt({ x: W.w * 0.2, near: false }));
            sfx(b, 'thunder');
            if (S.out.indexOf('youth') < 0) S.out.push('youth');
            trans(b, { type: 'gutter', id: 'youth', dur: 4 });
            glow('youth', 0.32);
            face('youth', -1);
          }],
          // 在圣灵里祷告，保守自己常在神的爱中
          [8.6, b => {
            for (const id of grown()) if (id !== 'youth') pose(id, 'pray');
            for (const id of ['child1', 'child2', 'kid']) pose(id, 'kneel');
            W.set('glKeep', 1, b.instant);
            W.set('glRing', 1, b.instant);
            sfx(b, 'harp');
          }],
          // 有些人存疑心，你们要怜悯他们：哥哥和该犹去把他领回来
          [18.6, b => {
            pose('forgiven', 'stand'); pose('gaius', 'stand');
            embrace('forgiven', 'youth', { at: X.embD, run: true });
            setV('forgiven', V.embD); setV('youth', V.embD);
            go('gaius', 'fetch', { speed: 0.07 });
          }],
          [21.8, b => {
            S.fetched = 1;
            go('youth', 'youth', { speed: 0.046, pose: 'carry' }); go('forgiven', 'forgiven', { speed: 0.042 }); go('gaius', 'gaius', { speed: 0.052 });
            glow('youth', 0.42);
          }],
          // 该犹从自己脚前的灯把他的灯重新点着
          [24.9, b => {
            face('gaius', 'youth'); face('youth', 'gaius');
            trans(b, { type: 'pass', fromPt: () => lampFlame('gaius'), toPt: () => carriedFlame('youth'), dur: 0.9 });
          }],
          [25.7, b => {
            S.out = S.out.filter(id => id !== 'youth');
            const p = carriedFlame('youth'); if (p) sparkleAt(b, p[0], p[1], 14, [255, 214, 150], 8);
            sfx(b, 'chime', { soft: true });
          }],
          [26.9, b => {
            S.carry = null;
            for (const id of ['youth', 'forgiven', 'gaius']) { pose(id, 'pray'); face(id, X.table); }
          }],
        ]);
      },
    },

    // ── 13 · 犹 1:24 那能保守你们不失脚 ──────────────────────────────
    {
      kind: 'bless', utter: '那能保守你们不失脚', cmd: 'glory --forever && echo 阿们', ref: '犹大书 1:24',
      verse: [
        { text: '那能保守你们不失脚、叫你们无瑕无疵、欢欢喜喜站在他荣耀之前的<br>我们的救主独一的神，', ref: '犹大书 1:24', hold: 8.5 },
        { text: '愿荣耀、威严、能力、权柄，因我们的主耶稣基督归与他，<br>从万古以前并现今，直到永永远远。阿们！', ref: '犹大书 1:25', hold: 9.5 },
      ],
      apply(c) {
        T(c, [
          // 风停了，天亮了：众人站起来
          [0, b => {
            W.goTo(0.3, 14, b.instant);
            W.set('gale', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.3, b.instant);
            W.set('glWander', 0, b.instant); W.set('glKeep', 0.3, b.instant);
            for (const id of present()) { pose(id, 'stand'); face(id, X.table); }
            face('john', -1);
            sfx(b, 'harp');
          }],
          // 荣光临到，那一圈光铺满全地
          [3.4, b => {
            W.set('glGlory', 1, b.instant);
            W.set('glRingR', 1.6, b.instant); W.set('glRing', 1, b.instant); W.set('glLove', 1, b.instant);
            W.set('bloom', 1, b.instant); W.set('grass', 1, b.instant);
            W.setPop('bird', 24, W.w * 0.65, W.h * 0.3, b.instant);
            glowAll(0.5);
            flashW(b, 0.2);
            sfx(b, 'bell');
          }],
          [4.4, b => {
            W.set('glLamps', 0, b.instant); W.set('glKeep', 0, b.instant);
            const c2 = C();
            if (c2 && c2.crowd && !(c2.crowds && c2.crowds.has && c2.crowds.has('city'))) {
              // 城里信的人：停在屋前开阔的地上，前后两排（不贴屋墙、不挤在画面边上）
              const ms = c2.crowd('city', { n: PORT ? 3 : 7, x0: PORT ? 0.99 : 1.0, x1: PORT ? 1.1 : 1.08, layer: 2, label: '信的人', glow: 0.3, mill: false });
              if (ms && ms.forEach) ms.forEach((m, i) => { m.v = PORT ? 0.5 + 0.08 * i : (i % 2 ? 0.66 : 0.5); });
              c2.crowdWalk('city', PORT ? 0.78 : 0.84, PORT ? 0.9 : 0.95, { pose: 'stand', speed: 0.05 });
            }
            sfx(b, 'crowd', { soft: true });
          }],
          // 愿荣耀、威严、能力、权柄……归与他
          [10.2, b => {
            for (const id of present()) pose(id, KIDS[id] ? 'gaze' : 'raise');
            const c2 = C(); if (c2 && c2.crowdPose) c2.crowdPose('city', 'raise');
            sfx(b, 'sing', { soft: true });
          }],
          ...['荣耀', '威严', '能力', '权柄'].map((w, i) => [10.4 + i * 1.1, b => {
            const P = PORT ? [[0.3, 0.42], [0.7, 0.42], [0.3, 0.5], [0.7, 0.5]] : [[0.55, 0.4], [0.67, 0.33], [0.79, 0.4], [0.91, 0.33]];
            nameAt(b, w, P[i][0], P[i][1], { hold: 3.6, rgb: [255, 236, 196] });
          }]),
          // 阿们
          [18.2, b => {
            const G = ringG();
            ringAt(b, G.cx, G.cy - PH(), 0.18, [255, 240, 210], 3.2, 1.8);
            sparkleAt(b, G.cx, G.cy - PH() * 1.2, 40, [255, 240, 214], 50);
            sfx(b, 'bell', { soft: true });
          }],
        ]);
      },
    },
  ];
  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '普通书信', books: [62, 63, 64, 65], title: '神就是爱', sub: '约翰一书 · 约翰二书 · 约翰三书 · 犹大书', tint: [255, 220, 214], music: 'song',
    outro: 26,
    intro: [
      { text: '论到从起初原有的生命之道，<br>就是我们所听见、所看见、亲眼看过、亲手摸过的。', ref: '约翰一书 1:1', hold: 7 },
      { text: '我们将这些话写给你们，使你们的喜乐充足。', ref: '约翰一书 1:4', hold: 5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '约翰': { text: '我们将所看见、所听见的传给你们，使你们与我们相交。我们乃是与父并他儿子耶稣基督相交的。', ref: '约翰一书 1:3' },
      '该犹': { text: '作长老的写信给亲爱的该犹，就是我诚心所爱的。', ref: '约翰三书 1:1' },
      '父老': { text: '父老啊，我写信给你们，因为你们认识那从起初原有的。', ref: '约翰一书 2:13' },
      '少年人': { text: '少年人哪，我曾写信给你们；因为你们刚强，神的道常存在你们心里；你们也胜了那恶者。', ref: '约翰一书 2:14' },
      '母亲': { text: '凡爱生他之神的，也必爱从神生的。', ref: '约翰一书 5:1' },
      '孩子': { text: '小子们哪，我写信给你们，因为你们的罪藉着主名得了赦免。', ref: '约翰一书 2:12' },
      '认罪的人': { text: '我们若认自己的罪，神是信实的，是公义的，必要赦免我们的罪，洗净我们一切的不义。', ref: '约翰一书 1:9' },
      '蒙赦免的人': { text: '我们若在光明中行，如同神在光明中，就彼此相交，他儿子耶稣的血也洗净我们一切的罪。', ref: '约翰一书 1:7' },
      '穷乏的弟兄': { text: '凡有世上财物的，看见弟兄穷乏，却塞住怜恤的心，爱神的心怎能存在他里面呢？', ref: '约翰一书 3:17' },
      '蒙拣选的太太': { text: '太太啊，我现在劝你，我们大家要彼此相爱。这并不是我写一条新命令给你，乃是我们从起初所受的命令。', ref: '约翰二书 1:5' },
      '她的儿女': { text: '我见你的儿女，有照我们从父所受之命令遵行真理的，就甚欢喜。', ref: '约翰二书 1:4' },
      '低米丢': { text: '低米丢行善，有众人给他作见证，又有真理给他作见证，就是我们也给他作见证。', ref: '约翰三书 1:12' },
      '作客旅的弟兄': { text: '因他们是为主的名出外，对于外邦人一无所取。所以我们应该接待这样的人，叫我们与他们一同为真理做工。', ref: '约翰三书 1:7–8' },
      '信的人': { text: '凡信耶稣是基督的，都是从神而生，凡爱生他之神的，也必爱从神生的。', ref: '约翰一书 5:1' },
      '该犹的家': { text: '他们在教会面前证明了你的爱；你若配得过神，帮助他们往前行，这就好了。', ref: '约翰三书 1:6' },
      '书信': { text: '我将这些话写给你们信奉神儿子之名的人，要叫你们知道自己有永生。', ref: '约翰一书 5:13' },
      '以弗所': { text: '主的道大大兴旺，而且得胜，就是这样。', ref: '使徒行传 19:20' },
      '船': { text: '亲爱的兄弟啊，凡你向作客旅之弟兄所行的都是忠心的。', ref: '约翰三书 1:5' },
      '十字架': { text: '主为我们舍命，我们从此就知道何为爱；我们也当为弟兄舍命。', ref: '约翰一书 3:16' },
    },
  });
})(window.GS);
