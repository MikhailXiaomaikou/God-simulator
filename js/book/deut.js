/* ─────────────────────────────────────────────────────────────
 * book/deut.js —— 卷 · 申命记 · 毗斯迦（申命记 1 — 34）
 *
 * 出埃及第四十年，摩西在约旦河东的摩押平原向以色列众人说话：
 * 晨雾散开，河那边的地「摆在你们面前」；何烈山的火——只听见声音，没有看见形象；
 * 「以色列啊，你要听」——话写在每一座帐棚的门框上；吗哪如白霜，河那边的美地长出果园与田；
 * 夜里的众星；看顾那地的眼目；寄居的、孤儿、寡妇被领进众人中间；三座逃城与预备的道路；
 * 失迷的羊被牵回来；天上的府库打开，按时降雨；云柱停在会幕门前，约书亚受命刚强壮胆；
 * 摩西的歌——如鹰搅动巢窝，接取雏鹰背在两翼之上；为十二支派祝福；
 * 摩西登上毗斯迦山顶，夕阳自西而来，耶和华把全地指给他看；
 * 耶和华将他埋葬在摩押地的谷中，没有人知道他的坟墓；天亮了，约书亚站在百姓面前。
 *
 * 画面的方位：左 = 东（盐海），右 = 西。近地是摩押平原：左边一座高山（尼波山 · 毗斯迦山顶）从盐海边升起，
 * 右边是以色列的营（帐棚、会幕与云柱）。中景的洲与远处的山岭是约旦河那边的迦南地（耶利哥 · 棕树城）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'deut';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('dtVeil', 'exp', 0.3);      // 晨雾遮着河那边的地（1:8 之前）
  W.defineLevel('dtHoreb', 'exp', 0.55);    // 何烈山：火焰冲天、昏黑、密云（4:11–12，回想中的异象）
  W.defineLevel('dtTablets', 'exp', 0.7);   // 两块石版（5:22）
  W.defineLevel('dtDoors', 'lin', 0.15);    // 写在门框上的话（6:9）：帐棚一座一座亮起
  W.defineLevel('dtManna', 'exp', 0.6);     // 吗哪，如地上的白霜（8:3）
  W.defineLevel('dtGood', 'lin', 0.1);      // 美地：果园、田、泉源（8:7–8）
  W.defineLevel('dtStars', 'lin', 0.1);     // 如同天上的星那样多（10:22）
  W.defineLevel('dtWatch', 'exp', 0.4);     // 看顾那地的眼目：夜里河那边的银光（11:12）
  W.defineLevel('dtRoads', 'lin', 0.12);    // 三座逃城与预备的道路（19:3）
  W.defineLevel('dtStones', 'exp', 0.5);    // 墁上石灰、写上律法的大石头（27:2–3）
  W.defineLevel('dtPillar', 'exp', 0.45);   // 云柱停在会幕门以上（31:15）
  W.defineLevel('dtTribes', 'exp', 0.35);   // 十二支派之光（33）
  W.defineLevel('dtVista', 'lin', 0.1);     // 毗斯迦山顶所见：自西而来的金光扫过全地（34:1–3）
  W.defineLevel('dtGlory', 'exp', 0.6);     // 山顶的荣光（34:5）
  W.defineLevel('dtMist', 'exp', 0.3);      // 谷中的雾：没有人知道他的坟墓（34:6）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    pisgah: 0.53,                              // 毗斯迦山顶
    moses: 0.7, joshua: 0.726, crowd0: 0.748, crowd1: 0.95,
    tab: 0.885,                                // 会幕
    widow: 0.962, orphan: 0.978, stranger: 0.944,
    flock0: 0.585, flock1: 0.655, shepherd: 0.638, stray: 0.43,
    // 河那边（中景的洲）
    jericho: 0.835, cities: [0.765, 0.905, 0.972], stones: 0.935,
    horeb: 0.72,                               // 回想中的何烈山（远处）
  };
  // 营中的帐棚：[x, 大小, 纵深 v]
  const TENTS = [[0.64, 1.05, 0.1], [0.69, 1.15, 0.0], [0.748, 1.1, 0.12], [0.806, 1.15, 0.02], [0.948, 1.1, 0.08], [0.992, 1.0, 0.0]];
  const ROBE = {
    moses: [206, 196, 172], joshua: [128, 96, 70], widow: [74, 66, 76], orphan: [150, 132, 108], stranger: [112, 124, 146],
    shepherd: [140, 112, 80], finder: [120, 96, 78], giver: [150, 116, 86], offerer: [158, 126, 90],
  };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { basket: false, gone: false }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const port = () => W.w < W.h * 0.9;
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const gB = (l, xf) => W.ridgeBaseY(l, xf * W.w);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const uu = () => Math.max(0.55, W.unit || 1);

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { C().walk(id, x, o); }
  function pose(id, p, o) { C().pose(id, p, o); }
  function face(id, d) { C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop) U.safe('cast.prop', () => c.prop(id, p || null)); }
  const attach = (id, fn) => { const c = C(); if (c.attach) c.attach(id, fn || null); };
  const follow = (id, o, dx) => { const c = C(); if (c.follow) c.follow(id, o, dx); };
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd || hasCrowd(gid)) return;
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function members(gid) { const c = C(); const g = c.crowds && c.crowds.get && c.crowds.get(gid); return g ? g.members : []; }
  // 众人一齐转向（dir：1 朝右 / -1 朝左 / 0..1 朝向画面某处）
  function faceCrowd(gid, dir) {
    for (const m of members(gid)) {
      if (m.dying) continue;
      const d = dir === 1 || dir === -1 ? dir : (dir >= m.nx ? 1 : -1);
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.facing = d;
      if (W.replaying) m.fd = d;
    }
  }
  function crowdPose(gid, p) { const c = C(); if (c.crowdPose) c.crowdPose(gid, p); }
  function crowdWalk(gid, x0, x1, o) { const c = C(); if (c.crowdWalk) c.crowdWalk(gid, x0, x1, o); }
  // 摩西站在山上时，脚下是山的轮廓
  function onMount(id) { attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, surfY(f.nx)] : null; }); }

  // 旁白与音效（瞬间重演时不念、不响）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 名字的位置：在画面之内（竖屏时经文在顶上，名字不要太高）
  function nameAt(xf, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    if (W.w < W.h * 0.75) cy = Math.max(cy, W.h * 0.34);
    return [clamp(xf * W.w, half + 8, W.w - half - 8), cy];
  }

  // ════════════════════════════════════════════════════════════
  //  毗斯迦山（尼波山）：自盐海边升起的高山；右坡缓而有路，左坡陡入海
  // ════════════════════════════════════════════════════════════
  // 轮廓：u ∈ [-1, 1]（左半以 hwL、右半以 hwR 计宽），k 为山高的几成。左边是临海的陡崖，右边是一道长长的山肩
  const PROF = [[-1, 0], [-0.9, 0.08], [-0.8, 0.19], [-0.71, 0.32], [-0.63, 0.45], [-0.56, 0.54], [-0.5, 0.59], [-0.43, 0.67], [-0.35, 0.78],
    [-0.26, 0.87], [-0.17, 0.92], [-0.1, 0.95], [-0.07, 0.985], [-0.035, 1], [0.035, 1], [0.06, 0.975], [0.1, 0.93], [0.17, 0.87],
    [0.25, 0.8], [0.32, 0.76], [0.38, 0.742], [0.45, 0.755], [0.52, 0.738], [0.6, 0.67], [0.68, 0.56], [0.76, 0.43], [0.84, 0.29],
    [0.92, 0.14], [1, 0]];
  const JIT = [];
  (function () { const r = U.mulberry32(3427); for (let i = 0; i <= 160; i++) JIT.push(r() - 0.5); })();
  function kOf(u) {
    if (u <= -1 || u >= 1) return 0;
    let i = 1;
    while (i < PROF.length - 1 && PROF[i][0] < u) i++;
    const a = PROF[i - 1], b = PROF[i], t = (u - a[0]) / (b[0] - a[0]);
    const e = t * t * (3 - 2 * t);
    const k = a[1] + (b[1] - a[1]) * lerp(t, e, 0.5);
    const f = (u + 1) * 80, j = Math.floor(f), jt = f - j;
    const jit = lerp(JIT[j] || 0, JIT[j + 1] || 0, jt) + 0.5 * lerp(JIT[(j * 7) % 160] || 0, JIT[((j + 1) * 7) % 160] || 0, jt);
    const plat = u > -0.05 && u < 0.05 ? 0 : 1;
    return Math.max(0, k + jit * 0.02 * plat * (1 - Math.pow(Math.abs(u), 6)));
  }
  const MT = { key: '' };
  function mt() {
    const key = W.w + 'x' + W.h;
    if (MT.key === key) return MT;
    MT.key = key;
    const p = port();
    MT.cx = X.pisgah * W.w;
    MT.hwL = (p ? 0.32 : 0.24) * W.w;
    MT.hwR = (p ? 0.4 : 0.26) * W.w;
    MT.hw = MT.hwR;
    MT.gc = gB(2, X.pisgah);
    MT.H = p ? Math.min(0.24 * W.h, 1.3 * MT.hwL) : Math.min(0.36 * W.h, 1.3 * MT.hwL);
    MT.top = MT.gc - MT.H;
    const N = 110;
    MT.pts = [];
    for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N; const x = mtX(u); MT.pts.push([x, surfPx(x)]); }
    MT.body = null;
    return MT;
  }
  const mtX = u => MT.cx + u * (u < 0 ? MT.hwL : MT.hwR);
  const mtU = x => (x - MT.cx) / (x < MT.cx ? MT.hwL : MT.hwR);
  const groundUnder = x => Math.min(gB(2, x / W.w), W.h + 40);
  function surfPx(x) {
    const u = mtU(x), g = groundUnder(x);
    if (u <= -1 || u >= 1) return g;
    return g - kOf(u) * (g - MT.top);
  }
  function surfY(xf) { mt(); return surfPx(xf * W.w); }
  // 山面上 (u, kk) 处的一点（kk 为此处山高的几成）
  function mtPt(u, kk) {
    const x = mtX(u), g = groundUnder(x), top = surfPx(x);
    return [x, g - (g - top) * kk];
  }
  // 山的细部（与屏幕大小无关，以 u / 高度比例记）
  const MTM = (function () {
    const r = U.mulberry32(9151), strata = [], scrub = [], rocks = [], spurs = [];
    for (let i = 0; i < 8; i++) { const kk = 0.2 + r() * 0.65; const u0 = -0.8 + r() * 1.3; strata.push([u0, u0 + 0.1 + r() * 0.22, kk, r()]); }
    for (let i = 0; i < 30; i++) { const u = -0.88 + r() * 1.8; scrub.push([u, 0.08 + r() * 0.85, 0.5 + r() * 0.8]); }
    for (let i = 0; i < 8; i++) rocks.push([(r() < 0.3 ? -1 : 1) * (0.55 + r() * 0.42), 0.02 + r() * 0.04, 0.6 + r() * 0.7]);
    // 自山顶垂下的几道山脊（显出山的体积）
    for (const [u0, u1] of [[-0.12, -0.5], [-0.3, -0.72], [0.12, 0.3], [0.5, 0.7], [0.3, 0.55], [-0.02, -0.2]]) spurs.push([u0, u1, 0.3 + r() * 0.35]);
    const path = [[1.0, 0.0], [0.8, 0.2], [0.9, 0.24], [0.66, 0.42], [0.74, 0.46], [0.5, 0.6], [0.58, 0.63], [0.36, 0.72], [0.28, 0.8], [0.16, 0.9], [0.06, 0.99]];
    return { strata, scrub, rocks, spurs, path };
  })();
  // 巢在右坡的一道石缝里（32:11）
  const NEST = [0.26, 0.8];
  // 山顶（摩西站立之处）
  function summit() { mt(); const x = mtX(0.015); return [x, surfPx(x)]; }
  function nestPos() { mt(); return mtPt(NEST[0], NEST[1]); }

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
        warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([236, 242, 255], 1),
        ember: radial([255, 110, 44], 1), soot: radial([30, 26, 28], 0.85, 0.55), cloud: radial([246, 244, 238], 0.9, 0.6),
        mist: radial([232, 234, 236], 0.8, 0.62), silver: radial([196, 214, 255], 1),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      // 银河：数不过来的星汇成的光雾
      const m = cnv(768, 384), mg = m.getContext('2d'), rr = U.mulberry32(1022);
      mg.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 800; i++) {
        const t = rr(), x = t * 768, y = (0.62 - t * 0.5) * 384 + (rr() + rr() + rr() - 1.5) * 44, s = 7 + rr() * 30;
        const gr = mg.createRadialGradient(x, y, 0, x, y, s);
        const c = rr() < 0.3 ? '255,226,196' : '206,220,255';
        gr.addColorStop(0, 'rgba(' + c + ',0.07)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
        mg.fillStyle = gr; mg.fillRect(x - s, y - s, s * 2, s * 2);
      }
      SP.band = m;
    } catch (e) { SP = null; }
    return SP;
  }

  // ── 众星（10:22）─────────────────────────────────────────────
  const STARS = [];
  function buildStars() {
    const r = U.mulberry32(1022);
    for (let i = 0; i < 1100; i++) {
      let x, y;
      if (i < 480) { const t = r(); x = t; y = (0.62 - t * 0.5) * 0.6 + (r() + r() + r() - 1.5) * 0.05; }
      else { x = r(); y = Math.pow(r(), 1.15) * 0.56; }
      const m = Math.pow(r(), 3.2);
      STARS.push({ x, y: clamp(y, 0.01, 0.56), rank: r(), m, sz: 0.6 + m * 1.7, tw: (r() * 256) | 0, sp: 0.7 + r() * 2.4, base: (0.42 + 0.58 * m) * (1 - smoothstep(0.42, 0.58, y)) });
    }
  }
  const SIN = new Float32Array(256);
  for (let i = 0; i < 256; i++) SIN[i] = Math.sin(i / 256 * TAU);
  const BUCK = 5, BUCKETS = [], BN = new Int32Array(BUCK);

  // ── 迦南的山岭（远景）：约旦河那边的山地，右边远处是积雪的黑门 ──
  const RANGE = [[0.4, 0.61], [0.45, 0.592], [0.5, 0.575], [0.55, 0.562], [0.6, 0.552], [0.645, 0.558], [0.69, 0.543], [0.735, 0.551],
    [0.78, 0.537], [0.825, 0.546], [0.865, 0.527], [0.9, 0.512], [0.935, 0.494], [0.962, 0.487], [0.99, 0.498], [1.03, 0.514]];
  const RG = { key: '', pts: null };
  function range() {
    const key = W.w + 'x' + W.h;
    if (RG.key === key) return RG;
    RG.key = key;
    const pts = [], N = 96, p = port();
    for (let i = 0; i <= N; i++) {
      const xf = 0.4 + 0.63 * i / N;
      let j = 1;
      while (j < RANGE.length - 1 && RANGE[j][0] < xf) j++;
      const a = RANGE[j - 1], b = RANGE[j], t = (xf - a[0]) / (b[0] - a[0]), e = t * t * (3 - 2 * t);
      let yf = a[1] + (b[1] - a[1]) * e + U.fbm1(xf * 23, 3) * 0.006;
      if (p) yf = 0.6 - (0.6 - yf) * 0.85;
      pts.push([xf * W.w, yf * W.h]);
    }
    RG.pts = pts;
    RG.base = W.waterlineY(0) + 2;
    return RG;
  }
  // 远山上某处的山脊（像素）
  function rangeY(xf) {
    const R = range(), i = clamp(Math.round((xf - 0.4) / 0.63 * 96), 0, 96);
    return R.pts[i][1];
  }

  // ── 河那边的洲（中景）的轮廓 ─────────────────────────────────
  const ISL = { key: '', pts: null };
  function isle() {
    const key = W.w + 'x' + W.h;
    if (ISL.key === key) return ISL;
    ISL.key = key;
    const s = W.landSpan(1) || [W.w * 0.49, W.w];
    const pts = [], N = 60;
    for (let i = 0; i <= N; i++) { const x = s[0] + (s[1] - s[0]) * i / N; pts.push([x, W.ridgeBaseY(1, x)]); }
    ISL.pts = pts; ISL.x0 = s[0]; ISL.x1 = s[1]; ISL.wl = W.waterlineY(1);
    return ISL;
  }
  function islePath(ctx, down) {
    const I = isle();
    ctx.beginPath();
    ctx.moveTo(I.pts[0][0], I.wl + (down || 0));
    for (const q of I.pts) ctx.lineTo(q[0], Math.min(q[1], I.wl));
    ctx.lineTo(I.x1, I.wl + (down || 0));
    ctx.closePath();
  }
  // 洲上的果园、田、泉（8:7–8）
  const GOOD = (function () {
    const r = U.mulberry32(808), trees = [], fields = [], streams = [];
    const KINDS = ['olive', 'olive', 'fig', 'vine', 'pome', 'olive', 'fig', 'vine'];
    for (let i = 0; i < 34; i++) {
      let x = 0.72 + r() * 0.27;
      if (Math.abs(x - X.jericho) < 0.035) x += 0.07;
      if (x > 0.995) x -= 0.26;
      trees.push({ x, v: r() * 0.55, kind: KINDS[i % KINDS.length], th: 0.1 + 0.75 * r(), sz: 0.75 + r() * 0.5, seed: r() * 100 });
    }
    trees.sort((a, b) => a.v - b.v);
    fields.push({ x0: 0.735, x1: 0.785, v0: 0.25, v1: 0.8, th: 0.05, c: [206, 180, 96] });
    fields.push({ x0: 0.875, x1: 0.93, v0: 0.3, v1: 0.8, th: 0.3, c: [188, 176, 90] });
    fields.push({ x0: 0.95, x1: 0.995, v0: 0.4, v1: 0.9, th: 0.55, c: [214, 190, 110] });
    streams.push([0.752, 0.2], [0.872, 0.4], [0.948, 0.6]);
    return { trees, fields, streams };
  })();

  // ════════════════════════════════════════════════════════════
  //  画：远山、洲、营、山
  // ════════════════════════════════════════════════════════════
  function drawRange(ctx) {
    const R = range(), l = 0;
    // 山体
    ctx.fillStyle = css([112, 128, 150], l);
    ctx.beginPath();
    ctx.moveTo(R.pts[0][0], R.base);
    for (const q of R.pts) ctx.lineTo(q[0], q[1]);
    ctx.lineTo(W.w + 10, R.base); ctx.closePath(); ctx.fill();
    // 近一层的山（稍暗，出一点层次）
    ctx.fillStyle = css([96, 110, 128], l, 0.55);
    ctx.beginPath();
    ctx.moveTo(R.pts[0][0], R.base);
    for (let i = 0; i < R.pts.length; i++) { const q = R.pts[i]; ctx.lineTo(q[0], lerp(q[1], R.base, 0.45) + Math.sin(i * 0.7) * 2); }
    ctx.lineTo(W.w + 10, R.base); ctx.closePath(); ctx.fill();
    // 黑门山顶的雪
    ctx.fillStyle = css([236, 240, 246], l, 0.8, 0.2);
    ctx.beginPath();
    const i0 = 83, i1 = 94;
    ctx.moveTo(R.pts[i0][0], R.pts[i0][1] + 1);
    for (let i = i0; i <= i1; i++) ctx.lineTo(R.pts[i][0], R.pts[i][1]);
    for (let i = i1; i >= i0; i--) ctx.lineTo(R.pts[i][0], R.pts[i][1] + (3 + 3 * Math.sin(i * 1.9)) * Math.max(0.6, W.unit) * (1 - Math.abs(i - 89) / 7));
    ctx.closePath(); ctx.fill();
    // 迎光的山脊
    const d = litX() >= W.w * 0.7 ? 1 : -1;
    ctx.strokeStyle = css([226, 214, 196], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, W.unit * 0.9);
    ctx.beginPath();
    for (let i = 1; i < R.pts.length; i++) {
      const a = R.pts[i - 1], b = R.pts[i];
      if ((b[1] - a[1]) * d < 0) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
    }
    ctx.stroke();
  }
  // 自西而来的金光（34:1–3）：扫过远山与洲
  function vistaGrad(ctx, y0, y1) {
    const k = W.lv.dtVista;
    const front = lerp(1.08, 0.3, Math.min(1, k * 1.1));
    const g = ctx.createLinearGradient(front * W.w - 0.14 * W.w, 0, front * W.w + 0.02 * W.w, 0);
    g.addColorStop(0, 'rgba(255,184,100,0)');
    g.addColorStop(1, 'rgba(255,184,100,1)');
    return g;
  }
  // 晨雾：一团一团的雾遮着河那边的山与洲（1:8 之前）
  function drawFog(ctx, l, a) {
    if (a < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const N = l === 0 ? 12 : 10, day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < N; i++) {
      const xf = lerp(l === 0 ? 0.42 : 0.47, 1.04, i / (N - 1)) + Math.sin(W.t * 0.05 + i * 2.1) * 0.008;
      const y = l === 0 ? rangeY(clamp(xf, 0.4, 1.03)) + 0.022 * W.h : (gB(1, clamp(xf, 0, 1)) + W.waterlineY(1)) / 2;
      const R = (l === 0 ? 0.11 : 0.085) * Math.max(W.w, W.h * 0.8) * (0.8 + 0.4 * hsh(i + l * 13));
      ctx.globalAlpha = Math.min(1, a * (0.75 + 0.3 * hsh(i * 3 + l)) * day);
      ctx.drawImage(SP.mist, xf * W.w - R, y - R * 0.42, R * 2, R * 0.84);
    }
    ctx.globalAlpha = 1;
  }
  // 何烈山（4:11–12，回想中的异象）：山上火焰冲天，并有昏黑、密云、幽暗；只有声音，没有形象
  const HOREB = [[-1.35, 0], [-1.05, 0.18], [-0.86, 0.27], [-0.7, 0.42], [-0.52, 0.5], [-0.36, 0.68], [-0.2, 0.83], [-0.08, 0.97], [0.02, 1], [0.1, 0.93],
    [0.2, 0.84], [0.32, 0.77], [0.46, 0.62], [0.6, 0.55], [0.78, 0.38], [0.98, 0.22], [1.35, 0]];
  function drawHoreb(ctx) {
    const k = W.lv.dtHoreb;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const p = port(), x = X.horeb * W.w, base = W.horizonY + 3, top = W.h * (p ? 0.47 : 0.425), hw = (p ? 0.2 : 0.095) * W.w;
    const u = uu(), T0 = W.t, Hm = base - top;
    // 山：暗紫的剪影，自雾中浮起（下半渐渐隐去）
    const gr = ctx.createLinearGradient(0, top, 0, base);
    gr.addColorStop(0, U.rgba(52, 34, 44, 0.92 * k)); gr.addColorStop(0.6, U.rgba(58, 46, 66, 0.6 * k)); gr.addColorStop(1, U.rgba(70, 70, 96, 0.08 * k));
    ctx.fillStyle = gr;
    ctx.beginPath();
    HOREB.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = base - q[1] * Hm; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    // 火光映在山顶
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.5;
    const g0 = hw * 1.6;
    ctx.drawImage(SP.ember, x - g0 / 2, top - g0 * 0.35, g0, g0 * 0.8);
    ctx.globalCompositeOperation = 'source-over';
    // 昏黑、密云、幽暗：压在山顶上的黑云
    for (let i = 0; i < 11; i++) {
      const ph = T0 * 0.05 + i * 0.9;
      const cx = x + (hsh(i) - 0.5) * hw * 3.2 + Math.sin(ph) * 8 * u, cy = top - (0.03 + 0.11 * hsh(i + 7)) * W.h + Math.cos(ph * 1.3) * 4 * u;
      const R = (0.05 + 0.04 * hsh(i + 4)) * W.h * (p ? 1.2 : 1);
      ctx.globalAlpha = k * 0.5;
      ctx.drawImage(SP.soot, cx - R * 1.5, cy - R * 0.6, R * 3, R * 1.2);
    }
    // 火焰冲天
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(T0 * 9) + 0.08 * Math.sin(T0 * 23);
    const bw = 34 * u;
    ctx.globalAlpha = k * 0.55 * fl;
    ctx.drawImage(SP.beam, x - bw / 2, -20, bw, top + 26);
    ctx.globalAlpha = k * 0.6;
    ctx.drawImage(SP.beam, x - bw * 0.22, -20, bw * 0.44, top + 26);
    for (let i = 0; i < 9; i++) {
      const ph = (T0 * 0.55 + i / 9) % 1, y = top - ph * top * 0.8, R = (22 - ph * 12) * u;
      ctx.globalAlpha = k * (1 - ph) * 0.75;
      ctx.drawImage(SP.ember, x - R + Math.sin(T0 * 3 + i * 2) * 5 * u, y - R, R * 2, R * 2);
    }
    // 火舌
    ctx.globalAlpha = k * 0.85;
    ctx.fillStyle = 'rgb(255,190,110)';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const ox = (i - 2) * 5 * u, h = (26 + 12 * Math.sin(T0 * 7 + i * 1.9)) * u * (1 - Math.abs(i - 2) * 0.18);
      ctx.moveTo(x + ox - 4 * u, top + 2 * u); ctx.quadraticCurveTo(x + ox - 3 * u, top - h * 0.5, x + ox + Math.sin(T0 * 6 + i) * 3 * u, top - h);
      ctx.quadraticCurveTo(x + ox + 3 * u, top - h * 0.5, x + ox + 4 * u, top + 2 * u);
    }
    ctx.fill();
    ctx.globalAlpha = k * 0.9;
    const g2 = 80 * u;
    ctx.drawImage(SP.warm, x - g2 / 2, top - g2 / 2, g2, g2);
    // 声音：一圈一圈的光（只听见声音，却没有看见形象）
    ctx.strokeStyle = 'rgb(255,226,170)';
    for (let i = 0; i < 3; i++) {
      const ph = (T0 * 0.42 + i / 3) % 1;
      ctx.lineWidth = Math.max(1, 1.6 * u * (1 - ph));
      ctx.globalAlpha = k * (1 - ph) * 0.5;
      ctx.beginPath(); ctx.ellipse(x, top - 6 * u, (18 + ph * 140) * u, (7 + ph * 54) * u, 0, 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 两块石版（5:22）
  function drawTablets(ctx) {
    const k = W.lv.dtTablets;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const u = uu(), x = X.horeb * W.w, y = W.h * (port() ? 0.36 : 0.27) + (1 - k) * 20 * u, w = 13 * u, h = 19 * u;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.6;
    const g = 110 * u;
    ctx.drawImage(SP.gold, x - g / 2, y - g / 2, g, g);
    for (const s of [-1, 1]) {
      const cx = x + s * (w * 0.62);
      ctx.globalAlpha = k * 0.85;
      ctx.fillStyle = 'rgb(255,236,196)';
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + h / 2); ctx.lineTo(cx - w / 2, y - h / 2 + w / 2);
      ctx.arc(cx, y - h / 2 + w / 2, w / 2, Math.PI, 0);
      ctx.lineTo(cx + w / 2, y + h / 2); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = k * 0.4;
      ctx.fillStyle = 'rgb(150,110,60)';
      for (let r = 0; r < 5; r++) ctx.fillRect(cx - w * 0.32, y - h * 0.18 + r * h * 0.13, w * 0.64, Math.max(0.6, 0.9 * u));
      ctx.globalCompositeOperation = 'lighter';
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 洲：迦南地 ───────────────────────────────────────────────
  function drawPalm(ctx, x, y, s, seed) {
    const H = 30 * s * (0.85 + 0.3 * hsh(seed)), lean = (hsh(seed + 1) - 0.5) * 0.35;
    const sway = W.wind * 1.2 * s + Math.sin(W.t * 0.9 + seed) * 0.5 * s;
    const tx = x + lean * H + sway, ty = y - H;
    ctx.strokeStyle = css([104, 82, 58], 1); ctx.lineWidth = Math.max(0.8, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * H * 0.2, y - H * 0.5, tx, ty); ctx.stroke();
    ctx.fillStyle = css([70, 104, 58], 1);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (160 - i * 23 + (hsh(seed + i) - 0.5) * 10) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a), L = (13 + 4 * hsh(seed + 9 + i)) * s;
      const ex = tx + ux * L, ey = ty + (uy * 0.45 + 0.5) * L, mx = tx + ux * L * 0.5, my = ty + (uy * 0.7 - 0.2) * L;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx, my - 1.6 * s, ex, ey); ctx.quadraticCurveTo(mx, my + 1.6 * s, tx, ty + 0.6 * s);
    }
    ctx.fill();
  }
  function drawJericho(ctx) {
    const l = 1, s = LS(l), x = X.jericho * W.w, y = gB(l, X.jericho) + 2 * s, hw = 30 * s, wh = 11 * s;
    // 棕树（城外）
    for (const [dx, sz, sd] of [[-44, 1, 3], [-36, 0.85, 7], [40, 0.95, 11], [50, 0.8, 13], [-52, 0.75, 17]]) drawPalm(ctx, x + dx * s, gB(l, (x + dx * s) / W.w) + 2 * s, s * sz, sd);
    // 房屋（墙内）
    ctx.fillStyle = css([188, 164, 126], l);
    ctx.beginPath();
    for (const [dx, w, h] of [[-20, 9, 14], [-9, 11, 19], [4, 9, 16], [15, 10, 13], [-2, 6, 25]]) ctx.rect(x + dx * s - w * s / 2, y - h * s, w * s, h * s);
    ctx.fill();
    // 城墙与城楼
    ctx.fillStyle = css([164, 138, 102], l);
    ctx.beginPath();
    ctx.moveTo(x - hw, y); ctx.lineTo(x - hw, y - wh);
    for (let i = 0; i <= 12; i++) { const px = x - hw + i * (2 * hw / 12); ctx.lineTo(px, y - wh - (i % 2 ? 0 : 2.4 * s)); }
    ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    ctx.fillRect(x - hw - 4 * s, y - wh - 7 * s, 8 * s, wh + 7 * s);
    ctx.fillRect(x + hw - 4 * s, y - wh - 7 * s, 8 * s, wh + 7 * s);
    // 城门
    ctx.fillStyle = css([40, 30, 24], l);
    ctx.beginPath(); ctx.moveTo(x - 3.2 * s, y); ctx.lineTo(x - 3.2 * s, y - 5 * s); ctx.arc(x, y - 5 * s, 3.2 * s, Math.PI, 0); ctx.lineTo(x + 3.2 * s, y); ctx.fill();
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([240, 220, 180], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - hw, y - wh); ctx.lineTo(x + hw, y - wh); ctx.moveTo(x + d * (hw + 4 * s), y - wh - 7 * s); ctx.lineTo(x + d * (hw + 4 * s), y); ctx.stroke();
    // 城门上的字（6:9 并你的城门上）
    const dk = smoothstep(0.85, 1, W.lv.dtDoors);
    if (dk > 0.01) {
      SP || sprites();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = dk * 0.7;
        ctx.drawImage(SP.gold, x - 12 * s, y - 16 * s, 24 * s, 24 * s);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 夜里的灯火
    const nk = nightK();
    if (nk > 0.05) {
      SP || sprites();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 4; i++) {
          ctx.globalAlpha = nk * 0.5 * (0.8 + 0.2 * Math.sin(W.t * 3 + i * 2));
          const g = 9 * s;
          ctx.drawImage(SP.warm, x + (-16 + i * 10) * s - g / 2, y - (8 + (i % 2) * 5) * s - g / 2, g, g);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  function isleV(xf, v) {             // 洲上 (x, 纵深 v) 处的地面（像素）
    const g = gB(1, xf), wl = W.waterlineY(1);
    return g + (wl - g) * v * 0.85;
  }
  function drawGood(ctx) {
    const k = W.lv.dtGood;
    if (k < 0.01) return;
    const l = 1, s = LS(l);
    // 田：麦子、大麦
    for (const f of GOOD.fields) {
      const a = smoothstep(f.th, f.th + 0.3, k);
      if (a < 0.01) continue;
      ctx.fillStyle = css(f.c, l, 0.42 * a);
      ctx.beginPath();
      const N = 8;
      for (let i = 0; i <= N; i++) { const xf = lerp(f.x0, f.x1, i / N); const y = isleV(xf, f.v0); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
      for (let i = N; i >= 0; i--) { const xf = lerp(f.x0, f.x1, i / N) + 0.01; ctx.lineTo(xf * W.w, isleV(xf, f.v1)); }
      ctx.closePath(); ctx.fill();
    }
    // 泉源与河：自山谷中流出水来
    ctx.lineCap = 'round';
    for (const [xf, th] of GOOD.streams) {
      const a = smoothstep(th, th + 0.25, k);
      if (a < 0.01) continue;
      ctx.strokeStyle = U.rgba(190, 220, 240, 0.55 * a * (0.4 + 0.6 * W.daylight));
      ctx.lineWidth = Math.max(0.7, 1.2 * s);
      ctx.beginPath();
      const y0 = gB(l, xf) + 1, y1 = W.waterlineY(l);
      ctx.moveTo(xf * W.w, y0);
      for (let i = 1; i <= 6; i++) { const t = i / 6; ctx.lineTo(xf * W.w + Math.sin(t * 5 + xf * 40) * 3 * s + t * 6 * s, lerp(y0, y1, t)); }
      ctx.stroke();
      ctx.strokeStyle = U.rgba(255, 250, 230, 0.4 * a * W.daylight * (0.6 + 0.4 * Math.sin(W.t * 2 + xf * 30)));
      ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.stroke();
    }
    // 果园：橄榄树、无花果树、葡萄树、石榴树
    for (const t of GOOD.trees) {
      const a = smoothstep(t.th, t.th + 0.15, k);
      if (a < 0.01) continue;
      const x = t.x * W.w, y = isleV(t.x, t.v) + 1, z = 1.45 * s * t.sz * (0.6 + 0.4 * a) * (1 + t.v * 0.25);
      if (t.kind === 'vine') {
        ctx.strokeStyle = css([92, 70, 48], l, a); ctx.lineWidth = Math.max(0.5, 0.7 * z);
        ctx.beginPath(); ctx.moveTo(x - 7 * z, y - 5 * z); ctx.lineTo(x + 7 * z, y - 5 * z); ctx.stroke();
        ctx.fillStyle = css([74, 110, 56], l, a);
        ctx.beginPath();
        for (let i = -2; i <= 2; i++) { ctx.moveTo(x + i * 3 * z + 2.4 * z, y - 5 * z); ctx.ellipse(x + i * 3 * z, y - 5 * z, 2.4 * z, 1.9 * z, 0, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css([96, 48, 92], l, a);
        ctx.beginPath();
        for (let i = -1; i <= 1; i += 2) { ctx.moveTo(x + i * 3 * z + 1.1 * z, y - 3.2 * z); ctx.arc(x + i * 3 * z, y - 3.2 * z, 1.1 * z, 0, TAU); }
        ctx.fill();
        continue;
      }
      const H = (t.kind === 'olive' ? 12 : 11) * z, R = (t.kind === 'fig' ? 6.4 : 5.6) * z;
      ctx.strokeStyle = css([80, 62, 46], l, a); ctx.lineWidth = Math.max(0.6, 1.2 * z);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (hsh(t.seed) - 0.5) * 2 * z, y - H * 0.55); ctx.stroke();
      ctx.fillStyle = css(t.kind === 'olive' ? [112, 128, 92] : t.kind === 'fig' ? [58, 92, 50] : [66, 104, 58], l, a);
      ctx.beginPath();
      ctx.ellipse(x, y - H * 0.72, R, R * 0.72, 0, 0, TAU);
      ctx.ellipse(x - R * 0.55, y - H * 0.6, R * 0.6, R * 0.5, 0, 0, TAU);
      ctx.ellipse(x + R * 0.55, y - H * 0.62, R * 0.62, R * 0.5, 0, 0, TAU);
      ctx.fill();
      if (t.kind === 'pome' || t.kind === 'fig') {
        ctx.fillStyle = css(t.kind === 'pome' ? [206, 60, 60] : [120, 70, 96], l, a);
        ctx.beginPath();
        for (let i = 0; i < 4; i++) { const px = x + (hsh(t.seed + i) - 0.5) * R * 1.4, py = y - H * 0.7 + (hsh(t.seed + 5 + i) - 0.5) * R; ctx.moveTo(px + 1.1 * z, py); ctx.arc(px, py, 1.1 * z, 0, TAU); }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 预绘的一层（离屏画布）：光与草木变得慢，每隔一小段时间重画一次；正在生长时画得勤些
  function cachedLayer(ctx, C, x0, y0, x1, y1, maxAge, paint) {
    const dpr = Math.min(2, W.dpr || 1), w = x1 - x0, h = y1 - y0;
    if (w < 1 || h < 1) return;
    const bw = Math.ceil(w * dpr), bh = Math.ceil(h * dpr), key = W.w + 'x' + W.h + '@' + dpr;
    if (!C.cnv || C.key !== key || Math.abs(W.t - C.t) > maxAge) {
      try {
        if (!C.cnv) C.cnv = document.createElement('canvas');
        if (C.cnv.width !== bw || C.cnv.height !== bh) { C.cnv.width = bw; C.cnv.height = bh; }
        const g = C.cnv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, bw, bh);
        g.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
        paint(g);
        C.key = key; C.t = W.t;
      } catch (e) { C.cnv = null; paint(ctx); return; }
    }
    ctx.drawImage(C.cnv, x0, y0, w, h);
  }
  // 洲上的一层：青绿、果园与田、耶利哥、大石头
  const ISLC = { cnv: null, t: -1e9, key: '' };
  function drawIsleLayer(ctx) {
    const I = isle(), growing = (W.lv.dtGood > 0.001 && W.lv.dtGood < 0.999) || (W.lv.dtStones > 0.001 && W.lv.dtStones < 0.999) || (W.lv.dtDoors > 0.8 && W.lv.dtDoors < 0.999);
    const top = Math.min(W.h * 0.6, gB(1, X.jericho) - 60 * LS(1));
    cachedLayer(ctx, ISLC, I.x0 - 70 * LS(1), top, W.w + 2, I.wl + 4, growing ? 0.08 : W.cycling ? 0.35 : 0.9, g => {
      const gk = 0.35 + 0.35 * W.lv.dtGood;
      islePath(g, 0);
      g.fillStyle = css([84, 118, 62], 1, 0.28 * gk);
      g.fill();
      drawGood(g);
      drawJericho(g);
      drawStones(g);
    });
  }

  // 三座逃城与道路（19:3）
  function cityPt(i) { const xf = X.cities[i]; return [xf * W.w, isleV(xf, 0.15)]; }
  function drawRoads(ctx) {
    const k = W.lv.dtRoads;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const l = 1, s = LS(l), u = uu();
    // 道路：沿着地面连起三城，又有岔路通到岸边（使误杀人的都可以逃到那里去）
    const rk = smoothstep(0.3, 1, k);
    if (rk > 0.01) {
      const segs = [];
      const N = 40, a = X.cities[0], b = X.cities[2];
      for (let i = 0; i <= N; i++) { const xf = lerp(a, b, i / N); segs.push([xf * W.w, isleV(xf, 0.18 + 0.05 * Math.sin(i * 0.9))]); }
      const upto = Math.floor(rk * N);
      ctx.strokeStyle = css([230, 212, 170], l, 0.55, 0.2); ctx.lineWidth = Math.max(0.7, 1.1 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= upto; i++) { const q = segs[i]; if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
      ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(255,226,160)'; ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.globalAlpha = 0.35 * rk * (0.6 + 0.4 * nightK());
      ctx.stroke();
      // 路上走着的一点光
      const ph = (W.t * 0.06) % 1, q = segs[Math.min(upto, Math.floor(ph * N))];
      if (q) { ctx.globalAlpha = 0.6 * rk; const g = 14 * u; ctx.drawImage(SP.gold, q[0] - g / 2, q[1] - g / 2, g, g); }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 城：小小的一簇房屋与一盏灯
    for (let c = 0; c < 3; c++) {
      const e = smoothstep(c * 0.08, c * 0.08 + 0.12, k);
      if (e < 0.01) continue;
      const [cx, cy] = cityPt(c);
      ctx.globalAlpha = e;
      ctx.fillStyle = css([196, 176, 140], l);
      ctx.beginPath();
      for (const [dx, w, h] of [[-5, 5, 6], [0, 6, 9], [5.5, 5, 7]]) ctx.rect(cx + dx * s - w * s / 2, cy - h * s, w * s, h * s);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = e * (0.7 + 0.25 * Math.sin(W.t * 1.7 + c * 2));
      const g = 50 * s;
      ctx.drawImage(SP.warm, cx - g / 2, cy - 6 * s - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 大石头（27:2–3）
  function drawStones(ctx) {
    const k = W.lv.dtStones;
    if (k < 0.01) return;
    const l = 1, s = LS(l), xf = X.stones, y = isleV(xf, 0.55) + 1;
    ctx.globalAlpha = k;
    for (const [dx, h, w] of [[-5, 15, 7], [4.5, 13, 6.5]]) {
      const x = xf * W.w + dx * s;
      ctx.fillStyle = css([236, 232, 220], l, 1, 0.15);
      ctx.beginPath();
      ctx.moveTo(x - w * s / 2, y); ctx.lineTo(x - w * s * 0.46, y - h * s * 0.85); ctx.quadraticCurveTo(x, y - h * s * 1.08, x + w * s * 0.46, y - h * s * 0.85); ctx.lineTo(x + w * s / 2, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([120, 104, 80], l, 0.55);
      for (let r = 0; r < 5; r++) ctx.fillRect(x - w * s * 0.3, y - h * s * (0.75 - r * 0.13), w * s * 0.6, Math.max(0.5, 0.6 * s));
    }
    SP || sprites();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = k * 0.35 * (0.7 + 0.3 * Math.sin(W.t * 1.2));
      const g = 40 * s;
      ctx.drawImage(SP.gold, xf * W.w - g / 2, y - 8 * s - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 营：帐棚、会幕与云柱 ─────────────────────────────────────
  const TENT = [[-1, 0], [-0.9, -0.46], [-0.64, -0.8], [-0.34, -0.66], [0, -1], [0.34, -0.68], [0.64, -0.82], [0.9, -0.48], [1, 0]];
  const tentY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  function drawTent(ctx, xf, size, v, i) {
    const l = 2, s = LS(l) * size * (1 + 0.35 * v), x = xf * W.w, y = tentY(xf, v) + 2 * s, hw = 30 * s, h = 25 * s;
    ctx.strokeStyle = css([96, 82, 64], l, 0.75); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.64 * hw, y - 0.8 * h); ctx.lineTo(x - 1.35 * hw, y);
    ctx.moveTo(x + 0.64 * hw, y - 0.82 * h); ctx.lineTo(x + 1.35 * hw, y);
    ctx.stroke();
    ctx.fillStyle = css([62, 50, 42], l);
    ctx.beginPath();
    for (let j = 0; j < TENT.length; j++) { const q = TENT[j], X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (j) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([90, 74, 60], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.62, -0.3, 0.32, 0.62]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.72 - Math.abs(f) * 0.05) * h); }
    ctx.stroke();
    const dw = 0.17 * hw, dh = 0.6 * h;
    ctx.fillStyle = css([22, 16, 14], l);
    ctx.fillRect(x - dw, y - dh, dw * 2, dh);
    SP || sprites();
    // 夜里门口一盏灯
    const lamp = clamp(nightK() * 1.1, 0, 1) * 0.85;
    if (lamp > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + i * 3);
      ctx.globalAlpha = lamp * fl * 0.55;
      ctx.fillStyle = 'rgb(255,160,84)';
      ctx.fillRect(x - dw, y - dh, dw * 2, dh);
      const g = hw * 2.4;
      ctx.globalAlpha = lamp * fl * 0.5;
      ctx.drawImage(SP.warm, x - g / 2, y - dh * 0.5 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 门框上的字（6:9）：两道金色的门框
    const dk = clamp((W.lv.dtDoors - i / TENTS.length) * TENTS.length, 0, 1);
    if (dk > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = dk * (0.75 + 0.2 * Math.sin(W.t * 1.6 + i));
      ctx.fillStyle = 'rgb(255,214,130)';
      const pw = Math.max(1, 1.3 * s);
      ctx.fillRect(x - dw - pw, y - dh - pw, pw, dh + pw);
      ctx.fillRect(x + dw, y - dh - pw, pw, dh + pw);
      ctx.fillRect(x - dw - pw, y - dh - pw, dw * 2 + pw * 2, pw);
      ctx.globalAlpha = dk * 0.45;
      const g = hw * 1.6;
      ctx.drawImage(SP.gold, x - g / 2, y - dh * 0.7 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边
    ctx.globalAlpha = 0.5;
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let j = k0; j <= k1; j++) { const q = TENT[j]; if (j === k0) ctx.moveTo(x + q[0] * hw, y + q[1] * h); else ctx.lineTo(x + q[0] * hw, y + q[1] * h); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function tabGeo() {
    const s = LS(2), x = X.tab * W.w, y = gY(2, X.tab) + 2 * s;
    return { s, x, y, cw: 44 * s, fh: 9 * s, tx: x + 10 * s, tw: 19 * s, th: 17 * s };
  }
  function drawTabernacle(ctx) {
    const l = 2, G = tabGeo(), s = G.s, x = G.x, y = G.y;
    // 帐幕（院子里偏西）
    ctx.fillStyle = css([70, 56, 48], l);
    ctx.beginPath();
    ctx.moveTo(G.tx - G.tw, y); ctx.lineTo(G.tx - G.tw, y - G.th * 0.92);
    ctx.quadraticCurveTo(G.tx, y - G.th * 1.08, G.tx + G.tw, y - G.th * 0.92); ctx.lineTo(G.tx + G.tw, y); ctx.closePath(); ctx.fill();
    // 帐幕东面的门帘：蓝色、紫色、朱红色
    const cols = [[64, 76, 150], [118, 64, 128], [178, 56, 52]];
    for (let i = 0; i < 3; i++) { ctx.fillStyle = css(cols[i], l); ctx.fillRect(G.tx - G.tw + i * 2.2 * s, y - G.th * 0.9, 2.2 * s, G.th * 0.9); }
    // 燔祭坛（铜）
    ctx.fillStyle = css([150, 110, 70], l);
    ctx.fillRect(x - 22 * s, y - 6 * s, 9 * s, 6 * s);
    // 院子的帷子：细麻，铜座银钩
    ctx.fillStyle = css([236, 230, 214], l, 1, 0.08);
    ctx.fillRect(x - G.cw, y - G.fh, G.cw * 2, G.fh);
    ctx.strokeStyle = css([140, 112, 76], l, 0.8); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let px = x - G.cw; px <= x + G.cw + 0.5; px += 6 * s) { ctx.moveTo(px, y); ctx.lineTo(px, y - G.fh - 1.2 * s); }
    ctx.stroke();
    // 院门（东面）
    for (let i = 0; i < 3; i++) { ctx.fillStyle = css(cols[i], l); ctx.fillRect(x - G.cw * 0.5 + i * 3 * s, y - G.fh, 3 * s, G.fh); }
    // 献上的筐子（26:10）
    if (S.basket) {
      const bx = x - G.cw * 0.5 - 5 * s, by = y;
      ctx.fillStyle = css([170, 130, 74], l);
      ctx.beginPath(); ctx.moveTo(bx - 4.5 * s, by - 5 * s); ctx.lineTo(bx + 4.5 * s, by - 5 * s); ctx.lineTo(bx + 3.4 * s, by); ctx.lineTo(bx - 3.4 * s, by); ctx.closePath(); ctx.fill();
      for (const [dx, c] of [[-2.4, [206, 60, 60]], [0, [226, 184, 70]], [2.4, [104, 60, 110]], [-1.1, [122, 150, 70]], [1.3, [220, 150, 60]]]) {
        ctx.fillStyle = css(c, l); ctx.beginPath(); ctx.arc(bx + dx * s, by - 5.6 * s - (Math.abs(dx) < 1.5 ? 1.2 * s : 0), 1.5 * s, 0, TAU); ctx.fill();
      }
    }
    // 迎光的边
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = css([250, 240, 220], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - G.cw, y - G.fh); ctx.lineTo(x + G.cw, y - G.fh); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 云柱（日间）与火柱（夜间）：1:33；31:15 停在会幕门以上
  function drawPillar(ctx) {
    SP || sprites();
    if (!SP) return;
    const G = tabGeo(), s = G.s, pk = W.lv.dtPillar, nk = nightK();
    const baseY = G.y - G.th * 1.02, x = G.tx;
    const Hp = lerp(0.38 * W.h, 0.22 * W.h, pk) * (port() ? 0.85 : 1);
    const N = 26, T0 = W.t, rMin = Hp * 0.05;
    // 云：一团一团相叠的白云，上面稍宽
    const cloudA = 1 - nk * 0.8;
    if (cloudA > 0.02) {
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1), y = baseY - t * Hp;
        const R = Math.max(rMin * (1 + 0.6 * t), (15 + 12 * t + 3 * Math.sin(T0 * 0.5 + i * 1.3)) * s) * (1 + pk * 0.2);
        const dx = Math.sin(T0 * 0.3 + i * 0.7) * 3 * s + W.wind * 5 * s * t;
        ctx.globalAlpha = (0.34 + 0.24 * (1 - t)) * cloudA * (t > 0.85 ? (1 - t) / 0.15 : 1);
        ctx.drawImage(SP.cloud, x + dx - R, y - R * 0.9, R * 2, R * 1.8);
      }
    }
    // 光：夜里是火柱；耶和华在云柱中显现时透出金光
    const lit = Math.max(nk, pk * 0.85);
    if (lit > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = lit * 0.55;
      const bw = 30 * s;
      ctx.drawImage(SP.beam, x - bw / 2, baseY - Hp * 1.02, bw, Hp + 6 * s);
      ctx.globalAlpha = lit * 0.45;
      ctx.drawImage(SP.beam, x - bw * 0.2, baseY - Hp * 1.02, bw * 0.4, Hp + 6 * s);
      const spr = nk >= pk ? SP.warm : SP.gold;
      for (let i = 0; i < N; i += 1) {
        const t = i / (N - 1), y = baseY - t * Hp;
        const R = Math.max(rMin * (1 + 0.5 * t), (16 + 10 * t) * s) * (0.9 + 0.1 * Math.sin(T0 * 5 + i * 1.7));
        ctx.globalAlpha = lit * (0.28 - 0.14 * t) * (t > 0.85 ? (1 - t) / 0.15 : 1);
        ctx.drawImage(spr, x - R + Math.sin(T0 * 2 + i) * 2 * s, y - R, R * 2, R * 2);
      }
      ctx.globalAlpha = Math.max(pk * 0.5, nk * 0.3);
      const g = 110 * s;
      ctx.drawImage(pk > nk ? SP.gold : SP.warm, x - 14 * s - g / 2, G.y - 10 * s - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 营火（夜里人才看得见）
  function drawFires(ctx) {
    const nk = nightK();
    if (nk < 0.05) return;
    SP || sprites();
    if (!SP) return;
    const s = LS(2);
    for (const [xf, v, sd] of [[0.735, 0.25, 1], [0.905, 0.35, 2]]) {
      const x = xf * W.w, y = tentY(xf, v);
      ctx.globalCompositeOperation = 'lighter';
      const f = 0.82 + 0.12 * Math.sin(W.t * 13 + sd) + 0.08 * Math.sin(W.t * 23.7 + sd * 2);
      ctx.globalAlpha = nk * 0.55 * f;
      const g = 70 * s;
      ctx.drawImage(SP.warm, x - g / 2, y - 6 * s - g / 2, g, g);
      ctx.globalAlpha = nk * 0.9 * f;
      ctx.fillStyle = 'rgb(255,190,100)';
      ctx.beginPath(); ctx.moveTo(x - 3 * s, y); ctx.quadraticCurveTo(x - 2 * s, y - 5 * s * f, x, y - 8 * s * f); ctx.quadraticCurveTo(x + 2 * s, y - 5 * s * f, x + 3 * s, y); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 吗哪：地上的白霜（8:3）
  function drawManna(ctx) {
    const k = W.lv.dtManna;
    if (k < 0.01) return;
    const s = Math.max(0.6, LS(2));
    ctx.fillStyle = 'rgb(250,248,240)';
    for (let i = 0; i < 260; i++) {
      const xf = 0.58 + 0.42 * hsh(i * 3.1), v = 0.04 + 0.92 * hsh(i * 7.7 + 1);
      const g = gY(2, xf), y = g + v * Math.max(0, W.h - g) * 0.9;
      const tw = 0.55 + 0.45 * Math.sin(W.t * (1 + hsh(i) * 2) + i);
      ctx.globalAlpha = k * tw * (0.5 + 0.5 * v);
      const r = (0.7 + 0.9 * hsh(i * 1.3)) * s * (1 + v * 0.6);
      ctx.fillRect(xf * W.w - r, y - r * 0.5, r * 2, r);
    }
    ctx.globalAlpha = 1;
  }

  // ── 山 ───────────────────────────────────────────────────────
  // 山身的轮廓（随屏幕大小缓存为 Path2D）
  function mtFill(ctx) {
    const G = mt();
    if (!G.body) {
      const P2 = new Path2D();
      G.pts.forEach((q, i) => { if (i) P2.lineTo(q[0], q[1]); else P2.moveTo(q[0], q[1]); });
      for (let i = G.pts.length - 1; i >= 0; i--) { const x = G.pts[i][0]; P2.lineTo(x, groundUnder(x) + 3); }
      P2.closePath();
      G.body = P2;
    }
    ctx.fill(G.body);
  }
  // 山的画面随光缓缓变化：预绘到离屏画布，每隔一小段时间（或屏幕改变时）重画一次
  const MTC = { cnv: null, t: -1e9, key: '' };
  function drawPisgah(ctx) {
    const G = mt(), xL = mtX(-1) - 4, xR = mtX(1) + 4, y0 = G.top - 6, y1 = W.h + 4;
    const dpr = Math.min(2, W.dpr || 1), bw = Math.max(1, Math.ceil((xR - xL) * dpr)), bh = Math.max(1, Math.ceil((y1 - y0) * dpr));
    const key = W.w + 'x' + W.h + '@' + dpr;
    if (!MTC.cnv || MTC.key !== key || Math.abs(W.t - MTC.t) > (W.cycling ? 0.3 : 1.1)) {
      try {
        if (!MTC.cnv) MTC.cnv = document.createElement('canvas');
        if (MTC.cnv.width !== bw || MTC.cnv.height !== bh) { MTC.cnv.width = bw; MTC.cnv.height = bh; }
        const g = MTC.cnv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, bw, bh);
        g.setTransform(dpr, 0, 0, dpr, -xL * dpr, -y0 * dpr);
        paintPisgah(g);
        MTC.key = key; MTC.t = W.t;
      } catch (e) { MTC.cnv = null; paintPisgah(ctx); return; }
    }
    ctx.drawImage(MTC.cnv, xL, y0, xR - xL, y1 - y0);
  }
  function paintPisgah(ctx) {
    const G = mt(), l = 2, s = LS(l), cx = G.cx;
    const xL = mtX(-1), xR = mtX(1);
    // 山身：上浅下深的岩石（摩押的赭色）
    const gr = ctx.createLinearGradient(0, G.top, 0, G.gc + 0.1 * W.h);
    gr.addColorStop(0, css([186, 162, 128], l)); gr.addColorStop(0.5, css([152, 128, 100], l)); gr.addColorStop(1, css([108, 90, 72], l));
    ctx.fillStyle = gr;
    mtFill(ctx);
    // 受光与背光：自迎光的一边渐渐暗到背光的一边
    const d = litX() >= cx ? 1 : -1, nk = nightK();
    const sh = ctx.createLinearGradient(d > 0 ? xR : xL, 0, d > 0 ? xL : xR, 0);
    const dark = W.shade([52, 42, 38], 0);
    sh.addColorStop(0, U.rgba(dark[0], dark[1], dark[2], 0.02));
    sh.addColorStop(0.42, U.rgba(dark[0], dark[1], dark[2], 0.1 + 0.1 * nk));
    sh.addColorStop(0.62, U.rgba(dark[0], dark[1], dark[2], 0.34 + 0.2 * nk));
    sh.addColorStop(1, U.rgba(dark[0], dark[1], dark[2], 0.46 + 0.2 * nk));
    ctx.fillStyle = sh;
    mtFill(ctx);
    // 夕照：自西而来的金光照在迎光的山面上（34:1）
    const dk = clamp(W.dusk * 1.3, 0, 1) * (1 - W.night) * (d > 0 ? 1 : 0.4);
    if (dk > 0.02) {
      const wg = ctx.createLinearGradient(d > 0 ? xR : xL, 0, cx, 0);
      wg.addColorStop(0, U.rgba(255, 150, 70, 0.34 * dk)); wg.addColorStop(1, U.rgba(255, 150, 70, 0));
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = wg;
      mtFill(ctx);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 山沟：自山顶垂下的几道柔和的暗影（显出山的体积）
    ctx.lineCap = 'round';
    for (const q of MTM.spurs) {
      const N = 12;
      ctx.strokeStyle = css([64, 50, 42], l, 0.06 + 0.05 * nk);
      for (const wmul of [7, 3]) {
        ctx.lineWidth = Math.max(1, wmul * s);
        ctx.beginPath();
        for (let i = 0; i <= N; i++) {
          const t = i / N, u = lerp(q[0], q[1], t), kk = 0.92 - t * (0.3 + q[2] * 0.35);
          const p = mtPt(u, Math.max(0.04, kk));
          if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
        }
        ctx.stroke();
      }
    }
    // 岩层：几道顺着山势的石阶（一道暗影，其上一道迎光的亮线）
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? css([236, 214, 176], l, 0.12 * dayA(), 0.12) : css([80, 64, 52], l, 0.12);
      ctx.lineWidth = Math.max(0.6, (pass ? 0.8 : 2.4) * s);
      ctx.beginPath();
      for (const q of MTM.strata) {
        const N = 10;
        for (let i = 0; i <= N; i++) {
          const u = lerp(q[0], q[1], i / N), p = mtPt(u, q[2] + 0.015 * Math.sin(i * 1.3 + q[3] * 9));
          const y = p[1] - (pass ? 1.8 * s : 0);
          if (i) ctx.lineTo(p[0], y); else ctx.moveTo(p[0], y);
        }
      }
      ctx.stroke();
    }
    // 上山的路（右坡，只见上半）
    ctx.strokeStyle = css([228, 208, 168], l, 0.22 * dayA(), 0.1); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    MTM.path.forEach((q, i) => { const p = mtPt(q[0], Math.max(0, Math.min(q[1], 0.97))); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
    ctx.stroke();
    // 灌木（摩押山上的矮树丛）
    ctx.fillStyle = css([80, 82, 54], l);
    ctx.beginPath();
    for (const q of MTM.scrub) {
      if (kOf(q[0]) < 0.1) continue;
      const p = mtPt(q[0], Math.min(q[1], 0.95)), rr = 2.6 * s * q[2];
      ctx.moveTo(p[0] + rr, p[1]); ctx.ellipse(p[0], p[1], rr, rr * 0.62, 0, 0, TAU);
    }
    ctx.fill();
    // 山脚的大石
    ctx.fillStyle = css([134, 112, 90], l);
    ctx.beginPath();
    for (const q of MTM.rocks) { const p = mtPt(q[0], q[1]), rr = 6 * s * q[2]; ctx.moveTo(p[0] + rr * 1.3, p[1] + 2); ctx.ellipse(p[0], p[1] + 2, rr * 1.3, rr, 0, Math.PI, 0); }
    ctx.fill();
    // 巢（32:11）：右坡石缝里的一窝枯枝
    const n = nestPos(), nw = 6.5 * s;
    ctx.fillStyle = css([40, 30, 26], l, 0.9);
    ctx.beginPath(); ctx.ellipse(n[0], n[1] - 1 * s, nw * 1.9, nw * 1.1, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = css([70, 52, 38], l);
    ctx.beginPath(); ctx.ellipse(n[0], n[1] + 1.2 * s, nw * 1.45, nw * 0.5, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([132, 104, 72], l, 0.9); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) { ctx.moveTo(n[0] - nw * (1.4 - i * 0.4), n[1] + (i % 2) * 1.2 * s + 1.5 * s); ctx.lineTo(n[0] - nw * (0.9 - i * 0.38), n[1] - 0.6 * s); }
    ctx.stroke();
    // 迎光的山脊线
    ctx.strokeStyle = css([246, 226, 186], l, 0.5 * dayA(), 0.25); ctx.lineWidth = Math.max(0.7, 1.4 * s);
    ctx.beginPath();
    let on = false;
    for (let i = 1; i < G.pts.length; i++) {
      const a = G.pts[i - 1], b = G.pts[i];
      const facing = d > 0 ? b[1] >= a[1] - 0.2 : b[1] <= a[1] + 0.2;
      if (facing) { if (!on) ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); on = true; } else on = false;
    }
    ctx.stroke();
    // 山的上部稍带远处的天色（山高，顶上远）
    const hz = W.haze || [200, 210, 225];
    const hg = ctx.createLinearGradient(0, G.top, 0, G.top + G.H * 0.55);
    hg.addColorStop(0, U.rgba(hz[0], hz[1], hz[2], 0.14 * (1 - nk * 0.6))); hg.addColorStop(1, U.rgba(hz[0], hz[1], hz[2], 0));
    ctx.fillStyle = hg;
    mtFill(ctx);
  }
  // 谷中的雾（34:6）：山脚临海的谷里，一层不散的薄雾
  function drawMist(ctx) {
    const k = W.lv.dtMist;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const G = mt(), u = uu(), day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < 7; i++) {
      const uq = -0.92 + i * 0.13, x = mtX(uq) + Math.sin(W.t * 0.07 + i * 1.9) * 14 * u;
      const y = Math.min(surfPx(x) + (G.gc - G.top) * 0.18, W.h * 0.97) - 6 * u;
      const R = (46 + 22 * hsh(i)) * u;
      ctx.globalAlpha = k * (0.16 + 0.08 * hsh(i + 3)) * day;
      ctx.drawImage(SP.mist, x - R * 1.8, y - R * 0.4, R * 3.6, R * 0.8);
    }
    ctx.globalAlpha = 1;
  }

  // ── 天上：众星、十二支派之光、西边的霞光 ────────────────────
  function drawStars(ctx) {
    const k = W.lv.dtStars;
    const A = k * clamp(W.night * 1.3 + W.dusk * 0.28, 0, 1);
    if (A < 0.01 || !STARS.length) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    if (SP) { ctx.globalAlpha = A * 0.26; ctx.drawImage(SP.band, 0, 0, W.w, W.horizonY); }
    BN.fill(0);
    if (!BUCKETS.length) for (let b = 0; b < BUCK; b++) BUCKETS.push(new Int16Array(STARS.length));
    const u = Math.max(0.7, W.unit), T0 = W.t, stepQ = W.quality < 0.75 ? 2 : 1;
    for (let i = 0; i < STARS.length; i += stepQ) {
      const st = STARS[i];
      const on = clamp((k * 1.15 - st.rank * 0.95) * 6, 0, 1);
      if (on < 0.02) continue;
      const a = on * st.base * (0.72 + 0.28 * SIN[(((T0 * st.sp * 40) | 0) + st.tw) & 255]);
      if (a < 0.03) continue;
      const bi = a >= 0.8 ? 4 : (a * BUCK) | 0;
      BUCKETS[bi][BN[bi]++] = i;
    }
    ctx.fillStyle = 'rgb(255,248,232)';
    for (let b = 0; b < BUCK; b++) {
      const n = BN[b];
      if (!n) continue;
      const list = BUCKETS[b];
      ctx.globalAlpha = A * (b + 0.7) / BUCK;
      ctx.beginPath();
      for (let j = 0; j < n; j++) { const st = STARS[list[j]], s = st.sz * u; ctx.rect(st.x * W.w - s / 2, st.y * W.h - s / 2, s, s); }
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function tribePos(i, k) {
    const p = port(), n = 12, t = i / (n - 1);
    const xf = p ? lerp(0.6, 0.97, t) : lerp(0.64, 0.985, t);
    const ty = W.h * ((p ? 0.3 : 0.2) + 0.06 * Math.sin(t * Math.PI + 0.3) * -1 + 0.04 * (i % 2));
    const [tx0] = TENTS[i % TENTS.length];
    const x0 = tx0 * W.w, y0 = gY(2, tx0) - 20 * LS(2);
    const e = U.easeInOut ? U.easeInOut(clamp(k, 0, 1)) : k;
    return [lerp(x0, xf * W.w, e), lerp(y0, ty, e)];
  }
  function drawTribes(ctx) {
    const k = W.lv.dtTribes;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const u = Math.max(0.7, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const [x, y] = tribePos(i, k);
      const a = Math.min(1, k * 1.4) * (0.75 + 0.25 * Math.sin(W.t * 1.3 + i * 1.7));
      ctx.globalAlpha = a * 0.55;
      const g = 26 * u;
      ctx.drawImage(SP.gold, x - g / 2, y - g / 2, g, g);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(255,240,206)';
      ctx.beginPath(); ctx.arc(x, y, 1.8 * u, 0, TAU); ctx.fill();
      ctx.globalAlpha = a * 0.4;
      ctx.fillRect(x - 7 * u, y - 0.5, 14 * u, 1); ctx.fillRect(x - 0.5, y - 7 * u, 1, 14 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 夕照的光芒（34:1–4）：自西边的日头照过全地
  function drawRays(ctx) {
    const k = W.lv.dtVista * clamp(W.dusk * 1.4 + 0.25, 0, 1) * (1 - W.night);
    if (k < 0.01) return;
    const sx = W.sun && isFinite(W.sun.x) ? W.sun.x : W.w * 0.95, sy = W.sun && isFinite(W.sun.y) ? Math.min(W.sun.y, W.horizonY) : W.horizonY * 0.9;
    ctx.globalCompositeOperation = 'lighter';
    SP || sprites();
    if (SP) {
      const R = 0.62 * W.w;
      ctx.globalAlpha = 0.3 * k;
      ctx.drawImage(SP.warm, W.w * 1.02 - R, W.horizonY - R * 0.62, R * 2, R * 1.24);
    }
    for (let i = 0; i < 7; i++) {
      const a = Math.PI + (-0.26 + i * 0.075) + Math.sin(W.t * 0.05 + i) * 0.01, L = W.w * 0.9, w = 0.012 + 0.01 * hsh(i);
      ctx.globalAlpha = k * (0.028 + 0.025 * hsh(i + 7));
      ctx.fillStyle = 'rgb(255,214,150)';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(a - w) * L, sy + Math.sin(a - w) * L);
      ctx.lineTo(sx + Math.cos(a + w) * L, sy + Math.sin(a + w) * L);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 山顶的荣光（34:5）
  function drawGlory(ctx) {
    const k = W.lv.dtGlory;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const [x, y] = summit(), u = uu();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.75;
    const bw = 70 * u;
    ctx.drawImage(SP.beam, x - bw / 2, -30, bw, y + 40);
    ctx.globalAlpha = k * 0.45;
    ctx.drawImage(SP.beam, x - bw * 1.2, -30, bw * 2.4, y + 40);
    ctx.globalAlpha = k * (0.7 + 0.1 * Math.sin(W.t * 1.4));
    const g = 220 * u;
    ctx.drawImage(SP.gold, x - g / 2, y - 10 * u - g / 2, g, g);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）──────────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); }
  function beamAt(b, xf, y, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, y, w: (o.w || 70) * uu(), k: o.k || 1 });
    if (o.ring !== false && GS.fx) GS.fx.ring(xf * W.w, y - 10 * uu(), [255, 236, 190], M() * (o.r || 0.28), 2.2, 2);
  }
  function beamOn(b, id, o) {
    const f = fig(id);
    if (!f) return;
    const y = f.attach ? surfY(f.nx) : gY(f.layer == null ? 2 : f.layer, f.nx);
    beamAt(b, f.nx, y, o);
  }
  // 金光沿着洲的山脊扫过（1:8、8:7）
  function sweep(b, x0, x1, l, dur) { flash(b, { type: 'sweep', x0, x1, l: l == null ? 1 : l, dur: dur || 4.5 }); }

  // 鹰（32:11）：飞来，在巢上搧展两翅，雏鹰跌下，鹰俯冲接取，背在两翼之上，盘旋上升
  function eagleAt(t) {
    const n = nestPos(), u = uu(), p = port();
    const R = (p ? 0.2 : 0.085) * W.w;
    const hover = [n[0] + 6 * u, n[1] - 38 * u];
    const start = [n[0] + (p ? 0.45 : 0.24) * W.w, n[1] - (p ? 0.22 : 0.3) * W.h];
    const fall0 = [n[0] + 4 * u, n[1] - 4 * u];
    const fallAt = tt => { const q = clamp((tt - 6.2) / 2.4, 0, 1); return [fall0[0] + q * R * 0.9, fall0[1] + q * q * (p ? 0.12 : 0.15) * W.h]; };
    const catchT = 8.6, cp = fallAt(catchT);
    const out = { x: 0, y: 0, flap: 0, bank: 0, dir: -1, young: null, carry: false, a: 1, stir: 0 };
    if (t < 3.2) {                          // 飞来：自右上方盘旋而下
      const q = U.easeInOut ? U.easeInOut(t / 3.2) : t / 3.2;
      const ang = q * Math.PI * 1.1;
      out.x = lerp(start[0], hover[0], q) + Math.sin(ang) * R * 0.6 * (1 - q);
      out.y = lerp(start[1], hover[1], q) - Math.sin(ang * 0.5) * 20 * u * (1 - q);
      out.flap = 0.25 + 0.2 * Math.sin(t * 5); out.dir = -1; out.bank = 0.2 * (1 - q);
    } else if (t < 6.2) {                   // 搅动巢窝：在雏鹰以上两翅搧展
      out.x = hover[0] + Math.sin(t * 2.2) * 4 * u; out.y = hover[1] + Math.sin(t * 7) * 3 * u;
      out.flap = 1; out.dir = -1; out.stir = 1;
    } else if (t < catchT) {                // 雏鹰跌下；鹰俯冲到它下面
      const q = (t - 6.2) / (catchT - 6.2), e = q * q * (3 - 2 * q);
      const mid = [n[0] + R * 0.25, n[1] + 0.2 * W.h * (p ? 0.5 : 1)];
      const a = 1 - e;
      out.x = a * a * hover[0] + 2 * a * e * mid[0] + e * e * (cp[0] + 2 * u);
      out.y = a * a * hover[1] + 2 * a * e * mid[1] + e * e * (cp[1] + 7 * u);
      out.flap = 0.1; out.dir = 1; out.bank = -0.4 * Math.sin(q * Math.PI);
    } else {                                // 接取雏鹰，背在两翼之上，盘旋上升而去
      const q = (t - catchT) / 10;
      const c0 = [cp[0] + R * 0.35, cp[1] - 0.06 * W.h];
      const ang = -Math.PI * 0.9 + q * Math.PI * 3.2, rr = R * (0.55 - 0.25 * q);
      out.x = c0[0] + Math.cos(ang) * rr + q * R * 0.9;
      out.y = c0[1] + Math.sin(ang) * rr * 0.35 - q * q * (p ? 0.28 : 0.42) * W.h - q * 0.1 * W.h;
      out.dir = Math.sin(ang) >= 0 ? -1 : 1; out.flap = 0.35 + 0.25 * Math.sin(t * 4); out.bank = 0.25 * Math.cos(ang);
      out.carry = true; out.a = 1 - smoothstep(0.78, 1, q);
    }
    if (t >= 6.2 && t < catchT) { const fp = fallAt(t); out.young = [fp[0], fp[1], 1]; }
    return out;
  }
  // 鹰的剪影：宽阔的两翼，翼端的羽毛分开如指；flap 为扇翅的相位，lift 为此刻的扇动幅度
  const WING = [[0, -0.07], [0.22, -0.16], [0.46, -0.2], [0.68, -0.18], [0.86, -0.11], [1, -0.03], [0.95, 0.02], [0.99, 0.06], [0.91, 0.07],
    [0.93, 0.12], [0.84, 0.12], [0.85, 0.17], [0.76, 0.16], [0.6, 0.21], [0.36, 0.23], [0.14, 0.2], [0, 0.14]];
  function drawBird(ctx, x, y, span, flap, dir, bank, col, rim, lift) {
    const w = span / 2, amp = lift == null ? 0.45 : lift;
    const up = Math.sin(flap) * amp + 0.1;
    const wingPt = (q, sd) => {
      const t = q[0], yy = q[1] - up * Math.pow(t, 1.25) * 0.8 + bank * sd * t * 0.35;
      return [x + sd * (0.06 + t * 0.94) * w, y + yy * w];
    };
    ctx.fillStyle = col;
    ctx.beginPath();
    for (const sd of [-1, 1]) {
      for (let i = 0; i < WING.length; i++) { const p = wingPt(WING[i], sd); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.closePath();
    }
    // 身、头、尾
    ctx.ellipse(x, y + w * 0.04, w * 0.19, w * 0.085, 0, 0, TAU);
    ctx.moveTo(x + dir * w * 0.29, y); ctx.arc(x + dir * w * 0.23, y, w * 0.065, 0, TAU);
    ctx.moveTo(x - dir * w * 0.12, y + w * 0.01); ctx.lineTo(x - dir * w * 0.4, y - w * 0.06); ctx.lineTo(x - dir * w * 0.43, y + w * 0.13); ctx.lineTo(x - dir * w * 0.12, y + w * 0.1);
    ctx.closePath();
    ctx.fill();
    // 喙
    ctx.fillStyle = 'rgb(236,196,96)';
    ctx.beginPath(); ctx.moveTo(x + dir * w * 0.28, y - w * 0.015); ctx.lineTo(x + dir * w * 0.35, y + w * 0.01); ctx.lineTo(x + dir * w * 0.28, y + w * 0.03); ctx.fill();
    if (rim) {
      ctx.strokeStyle = rim; ctx.lineWidth = Math.max(0.7, span * 0.02); ctx.lineCap = 'round';
      ctx.beginPath();
      for (const sd of [-1, 1]) for (let i = 0; i <= 5; i++) { const p = wingPt(WING[i], sd); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
  }
  function drawEagle(ctx, e) {
    SP || sprites();
    const t = e.t, st = eagleAt(t), u = uu(), span = (port() ? 52 : 74) * u;
    const col = css([60, 44, 32], 2, st.a), rim = U.rgba(255, 226, 170, 0.85 * st.a);
    const n = nestPos();
    // 巢中的雏鹰（跌下之前）
    const youngN = t < 6.2 ? 2 : 1;
    for (let i = 0; i < youngN; i++) {
      const bob = st.stir ? Math.abs(Math.sin(t * 9 + i * 1.3)) * 3 * u : 0;
      ctx.fillStyle = css([214, 204, 188], 2, 1, 0.1);
      ctx.beginPath(); ctx.arc(n[0] - 3 * u + i * 6 * u, n[1] - 2.5 * u - bob, 2.6 * u, 0, TAU); ctx.fill();
    }
    // 光晕：让鹰在山与天上都看得见
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.28 * st.a;
      const g = span * 1.5;
      ctx.drawImage(SP.gold, st.x - g / 2, st.y - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 扇翅：搅动巢窝时急促而大；滑翔时缓而小；俯冲时收翅
    const beat = st.flap > 0.9 ? t * 15 : t * 4.2;
    const amp = st.flap > 0.9 ? 0.75 : st.flap < 0.15 ? 0.05 : 0.28;
    drawBird(ctx, st.x, st.y, span, beat, st.dir, st.bank, col, rim, amp);
    // 跌下的雏鹰
    if (st.young) {
      const [yx, yy] = st.young;
      drawBird(ctx, yx, yy, span * 0.34, t * 24, 1, Math.sin(t * 9) * 0.5, css([226, 216, 200], 2, 1, 0.1), null, 0.8);
    }
    // 背在两翼之上
    if (st.carry) {
      ctx.fillStyle = css([222, 212, 196], 2, st.a, 0.1);
      ctx.beginPath(); ctx.arc(st.x - st.dir * 2 * u, st.y - 4.5 * u, 3.2 * u, 0, TAU); ctx.fill();
    }
  }
  function drawTransients(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    if (!SP) return;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = e.y + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.42 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        ctx.globalAlpha = env * e.k * 0.5;
        const g = e.w * 1.8;
        ctx.drawImage(SP.gold, x - g / 2, y - g * 0.55, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'sweep' && pass === (e.l === 0 ? 'far' : e.l === 1 ? 'mid' : 'near')) {
        const env = 1 - smoothstep(0.7, 1, q), hx = lerp(e.x0, e.x1, U.easeOut ? U.easeOut(q) : q);
        const yOf = xf => (e.l === 0 ? rangeY(xf) : gB(e.l, xf)) - 1;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgb(255,232,176)';
        ctx.lineWidth = Math.max(1, 2 * W.unit);
        ctx.globalAlpha = env * 0.5;
        ctx.beginPath();
        for (let i = 0; i <= 20; i++) { const xf = lerp(e.x0, hx, i / 20); if (i) ctx.lineTo(xf * W.w, yOf(xf)); else ctx.moveTo(xf * W.w, yOf(xf)); }
        ctx.stroke();
        const g = 80 * LS(e.l) + 24;
        ctx.globalAlpha = env * 0.8;
        ctx.drawImage(SP.gold, hx * W.w - g / 2, yOf(hx) - g / 2, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'eagle' && pass === 'air') {
        drawEagle(ctx, e);
      } else if (e.type === 'descend' && pass === 'air') {
        // 一点光自山顶沿着山坡下到谷中，隐没在雾里（耶和华将他埋葬……）
        const e2 = U.easeInOut ? U.easeInOut(q) : q;
        const uq = lerp(0.0, -0.84, e2), x = mtX(uq);
        const y = lerp(surfPx(x) - 12 * uu(), W.h * 0.9, smoothstep(0.55, 1, q) * 0.6);
        const a = smoothstep(0, 0.1, q) * (1 - smoothstep(0.8, 1, q));
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * 0.8;
        const g = 60 * uu();
        ctx.drawImage(SP.gold, x - g / 2, y - g / 2, g, g);
        ctx.globalAlpha = a;
        ctx.drawImage(SP.white, x - g / 6, y - g / 6, g / 3, g / 3);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); if (!STARS.length) buildStars(); },
    resize() { MT.key = ''; RG.key = ''; ISL.key = ''; MTC.key = ''; ISLC.key = ''; },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStars(ctx); drawRays(ctx); return; }
      if (pass === 'far') {
        drawRange(ctx);
        drawHoreb(ctx);
        drawTablets(ctx);
        const R = range();
        // 夜里：看顾那地的银光（11:12）
        const wk = W.lv.dtWatch * clamp(W.night * 1.4, 0, 1);
        if (wk > 0.01) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = U.rgba(150, 170, 220, 0.14 * wk);
          ctx.beginPath(); ctx.moveTo(R.pts[0][0], R.base); for (const q of R.pts) ctx.lineTo(q[0], q[1]); ctx.lineTo(W.w + 10, R.base); ctx.closePath(); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
        // 毗斯迦山顶所见：金光自西而来
        if (W.lv.dtVista > 0.01) {
          const va = clamp(W.lv.dtVista * 3, 0, 1) * (1 - W.night * 0.8);
          ctx.globalAlpha = 0.4 * va;
          ctx.fillStyle = vistaGrad(ctx);
          ctx.beginPath(); ctx.moveTo(R.pts[0][0], R.base); for (const q of R.pts) ctx.lineTo(q[0], q[1]); ctx.lineTo(W.w + 10, R.base); ctx.closePath(); ctx.fill();
          // 山脊上的金边
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = 0.8 * va;
          ctx.strokeStyle = vistaGrad(ctx); ctx.lineWidth = Math.max(1, 1.6 * W.unit);
          ctx.beginPath(); R.pts.forEach((q, i) => { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
        drawFog(ctx, 0, 0.95 * W.lv.dtVeil);
        drawTransients(ctx, 'far');
        return;
      }
      if (pass === 'mid') {
        // 河那边的地：比这边的旷野青绿
        drawIsleLayer(ctx);
        drawRoads(ctx);
        const wk = W.lv.dtWatch * clamp(W.night * 1.4, 0, 1);
        if (wk > 0.01) { ctx.globalCompositeOperation = 'lighter'; islePath(ctx, 0); ctx.fillStyle = U.rgba(150, 170, 220, 0.16 * wk); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
        if (W.lv.dtVista > 0.01) {
          ctx.globalAlpha = 0.36 * clamp(W.lv.dtVista * 3, 0, 1) * (1 - W.night * 0.8);
          ctx.fillStyle = vistaGrad(ctx);
          islePath(ctx, 0); ctx.fill();
          ctx.globalAlpha = 1;
        }
        drawFog(ctx, 1, 0.9 * W.lv.dtVeil);
        drawTransients(ctx, 'mid');
        return;
      }
      if (pass === 'near') {
        drawPisgah(ctx);
        drawMist(ctx);
        drawTabernacle(ctx);
        drawPillar(ctx);
        for (let i = 0; i < TENTS.length; i++) drawTent(ctx, TENTS[i][0], TENTS[i][1], TENTS[i][2], i);
        drawFires(ctx);
        drawManna(ctx);
        drawTransients(ctx, 'near');
        return;
      }
      if (pass === 'air') {
        drawGlory(ctx);
        drawTribes(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'air') drawTransients(ctx, 'air');
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; MT.key = ''; RG.key = ''; ISL.key = ''; MTC.key = ''; ISLC.key = ''; },
    sig() { return { basket: S.basket, gone: S.gone }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const G = mt();
      cand('毗斯迦山', G.cx, G.top + G.H * 0.15);
      const T0 = tabGeo();
      cand('会幕', T0.tx, T0.y - T0.th);
      cand(nightK() > 0.5 ? '火柱' : '云柱', T0.tx, T0.y - T0.th - 0.18 * W.h);
      for (const [xf, sz, v] of TENTS) cand('帐棚', xf * W.w, tentY(xf, v) - 16 * LS(2) * sz);
      cand('耶利哥', X.jericho * W.w, gB(1, X.jericho) - 14 * LS(1));
      cand('约旦河', 0.74 * W.w, (W.waterlineY(1) + gB(2, 0.74)) / 2);
      cand('迦南地', 0.66 * W.w, gB(1, 0.66) - 4);
      cand('迦南地', 0.9 * W.w, rangeY(0.9));
      const n = nestPos();
      cand('鹰巢', n[0], n[1] - 4);
      if (W.lv.dtRoads > 0.4) for (let c = 0; c < 3; c++) { const p = cityPt(c); cand('逃城', p[0], p[1] - 6 * LS(1)); }
      if (W.lv.dtStones > 0.4) cand('大石头', X.stones * W.w, isleV(X.stones, 0.55) - 10 * LS(1));
      if (S.basket) { const G2 = tabGeo(); cand('筐子', G2.x - G2.cw * 0.5 - 5 * G2.s, G2.y - 6 * G2.s); }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    FXL.length = 0;
    S = fresh();
    MT.key = ''; RG.key = ''; ISL.key = ''; MTC.key = ''; ISLC.key = '';
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：摩押平原的黎明之前
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 旷野：半干的草场，花少；河那边另由布景画成青绿
    W.set('bare', 0.6, true); W.set('bloom', 0.25, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.8, herbs: 0.6, trees: 0, lights: 1, moon: 1, stars: 1,
      life: 1, good: 0, sabbath: 0, given: 1,
      dtVeil: 1, dtHoreb: 0, dtTablets: 0, dtDoors: 0, dtManna: 0, dtGood: 0, dtStars: 0, dtWatch: 0, dtRoads: 0, dtStones: 0, dtPillar: 0,
      dtTribes: 0, dtVista: 0, dtGlory: 0, dtMist: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.setOrigin('trees', W.w * 0.97, W.ridgeBaseY(1, W.w * 0.97));
    W.goTo(0.235, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 50, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    add('moses', { label: '摩西', sex: 'm', age: 'elder', x: X.moses, facing: 1, robe: ROBE.moses, glow: 0.55, prop: 'staff', from: 'none' });
    add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: X.joshua, facing: -1, robe: ROBE.joshua, glow: 0.22, from: 'none' });
    c.crowd('israel', { n: 14, x0: X.crowd0, x1: X.crowd1, layer: 2, label: '以色列人', from: 'none', mill: false });
    faceCrowd('israel', -1);
    // 营边：寄居的、孤儿、寡妇
    add('widow', { label: '寡妇', sex: 'f', age: 'adult', x: X.widow, facing: -1, robe: ROBE.widow, glow: 0.12, pose: 'sit', v: 0.3, from: 'none' });
    add('orphan', { label: '孤儿', sex: 'm', age: 'child', x: X.orphan, facing: -1, robe: ROBE.orphan, glow: 0.12, pose: 'sit', v: 0.34, from: 'none' });
    add('stranger', { label: '寄居的', sex: 'm', age: 'adult', x: X.stranger, facing: -1, robe: ROBE.stranger, glow: 0.12, pose: 'sit', v: 0.4, hair: 'cloth', from: 'none' });
    // 山脚：牧人与羊群
    add('shepherd', { label: '牧人', sex: 'm', age: 'adult', x: X.shepherd, facing: -1, robe: ROBE.shepherd, glow: 0.12, prop: 'staff', v: 0.42, from: 'none' });
    herd('flock', { kind: 'sheep', n: 5, x0: X.flock0, x1: X.flock1 - 0.02, layer: 2, label: '羊群', from: 'none', v: 0.48, mill: false });
    animal('stray', 'sheep', X.flock1 - 0.005, { label: '羊', v: 0.5, facing: -1, from: 'none', pose: 'graze' });
    avoid([0.3, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  // ════════════════════════════════════════════════════════════
  const REGIONS = [
    // [名, x, 行（s 天上 / f 远山 / i 洲）, 出现的时刻, 竖屏时的位置]：耶和华把全地指给他看（34:1–3）
    ['基列', 0.665, 'f', 0.8, [0.3, 0.4]], ['但', 0.955, 's', 2.0, [0.78, 0.36]], ['拿弗他利', 0.815, 's', 3.2, [0.58, 0.44]],
    ['以法莲', 0.775, 'f', 4.4, [0.28, 0.5]], ['玛拿西', 0.9, 'f', 5.6, [0.74, 0.52]], ['犹大', 0.67, 's', 6.8, [0.24, 0.58]],
    ['南地', 0.955, 'i', 8.0, [0.8, 0.6]], ['耶利哥', X.jericho, 'i', 9.2, [0.82, 0.675]], ['琐珥', 0.74, 'i', 10.4, [0.56, 0.52]],
  ];
  function showRegion(b, name, xf, row, pp) {
    if (b.instant || !GS.fx) return;
    const p = port(), u = Math.max(0.7, W.unit), size = p ? 18 : 26 * clamp(W.unit, 0.8, 1.15);
    let cx, cy;
    if (p && pp) { [cx, cy] = nameAt(pp[0], pp[1] * W.h, size, Array.from(name).length); }
    else {
      const y = row === 's' ? W.h * 0.43 : row === 'f' ? rangeY(xf) - 30 * u : gB(1, xf) - 24 * u;
      [cx, cy] = nameAt(xf, y, size, Array.from(name).length);
    }
    const srcFn = () => {
      const sx = clamp(xf + (Math.random() - 0.5) * 0.1, 0.4, 1);
      const sy = row === 'i' ? gB(1, sx) + Math.random() * 8 : rangeY(sx) + Math.random() * 10;
      return [sx * W.w, sy, [255, 222, 160]];
    };
    GS.fx.nameStr(name, cx, cy, size, [255, 236, 196], srcFn, { hold: 2.3 });
    if (GS.audio && GS.audio.nameChime) U.safe('audio.nameChime', () => GS.audio.nameChime(name[0]));
  }

  const STAGES = [
    // ── 1:8 这地摆在你们面前 ───────────────────────────────────
    {
      kind: 'promise', utter: '如今我将这地摆在你们面前', cmd: 'ls ./约旦河那边  # 你们要进去得这地', ref: '1:8',
      verse: [
        { text: '「耶和华我们的神在何烈山晓谕我们说：……<br>如今我将这地摆在你们面前；你们要进去得这地。」', ref: '申命记 1:6–8', hold: 6.5 },
        { text: '你们在旷野所行的路上，也曾见耶和华你们的神抚养你们，<br>如同人抚养儿子一般，直等你们来到这地方。', ref: '申命记 1:31', hold: 6.5 },
        { text: '这四十年，耶和华你的神常与你同在，故此你一无所缺。', ref: '申命记 2:7', hold: 5 },
        { text: '「你且上毗斯迦山顶去，向东、西、南、北举目观望，<br>因为你必不能过这约旦河。」', ref: '申命记 3:27', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { W.set('dtVeil', 0.1, b.instant); W.goTo(0.3, 14, b.instant); sfx(b, 'wind', { soft: true }); }],
          [0.6, () => { face('moses', 1); pose('moses', 'point'); faceCrowd('israel', 1); }],
          [2.2, b => { sweep(b, 1.02, 0.52, 1, 5); sweep(b, 1.03, 0.45, 0, 6); sfx(b, 'harp'); }],
          [7.8, b => { pose('moses', 'stand'); faceCrowd('israel', -1); if (!b.instant && GS.fx) GS.fx.ring(X.tab * W.w, gY(2, X.tab) - 40 * LS(2), [255, 240, 210], M() * 0.3, 2.6, 1.6); }],
          [15.6, b => { beamOn(b, 'moses', { dur: 5, w: 60, r: 0.2 }); }],
          [21.4, b => {
            const sm = summit();
            beamAt(b, sm[0] / W.w, sm[1], { dur: 6.5, w: 80, r: 0.25 });
            face('moses', -1); pose('moses', 'gaze'); face('joshua', -1);
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [28, () => { pose('moses', 'stand'); face('moses', 1); face('joshua', 1); }],
        ]);
      },
    },

    // ── 4:10 招聚百姓；何烈山的火；两块石版 ────────────────────
    {
      kind: 'cmd', utter: '你为我招聚百姓，我要叫他们听见我的话', cmd: 'broadcast 百姓 --from 火中  # 只听见声音', ref: '4:10',
      verse: [
        { text: '耶和华对我说：「你为我招聚百姓，我要叫他们听见我的话，<br>使他们存活在世的日子，可以学习敬畏我……」', ref: '申命记 4:10', hold: 7 },
        { text: '山上有火焰冲天，并有昏黑、密云、幽暗。<br>耶和华从火焰中对你们说话，你们只听见声音，却没有看见形象。', ref: '申命记 4:11–12', hold: 7.5 },
        { text: '这些话是耶和华在山上，从火中、云中、幽暗中，大声晓谕你们全会众的……<br>他就把这话写在两块石版上，交给我了。', ref: '申命记 5:22', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => {
            W.goTo(0.35, 10, b.instant);
            walk('moses', X.moses - 0.004, { speed: 0.02 }); face('moses', 1);
            crowdWalk('israel', X.crowd0 - 0.004, X.crowd1 - 0.02, { speed: 0.03, pose: 'sit' });
            sfx(b, 'crowd', { soft: true });
          }],
          [4, () => { faceCrowd('israel', -1); pose('moses', 'raise'); }],
          [7.6, b => { W.set('dtHoreb', 1, b.instant); pose('moses', 'stand'); faceCrowd('israel', 1); sfx(b, 'thunder', { far: true, soft: true }); }],
          [10.5, b => { sfx(b, 'fire', { far: true, soft: true }); }],
          [15.5, b => { W.set('dtTablets', 1, b.instant); sfx(b, 'seal', { soft: true }); }],
          [21, b => { W.set('dtHoreb', 0, b.instant); faceCrowd('israel', -1); }],
          [23.5, b => { W.set('dtTablets', 0, b.instant); }],
        ]);
      },
    },

    // ── 6:4 以色列啊，你要听；写在门框上 ───────────────────────
    {
      kind: 'call', utter: '以色列啊，你要听', cmd: 'echo "耶和华我们神是独一的主" >> 门框', ref: '6:4',
      verse: [
        { text: '「以色列啊，你要听！耶和华我们神是独一的主。<br>你要尽心、尽性、尽力爱耶和华你的神。', ref: '申命记 6:4–5', hold: 7 },
        { text: '我今日所吩咐你的话都要记在心上，也要殷勤教训你的儿女。<br>无论你坐在家里，行在路上，躺下，起来，都要谈论。', ref: '申命记 6:6–7', hold: 7 },
        { text: '又要写在你房屋的门框上，并你的城门上。」', ref: '申命记 6:9', hold: 5 },
        { text: '所以，你要知道耶和华你的神，他是神，是信实的神；<br>向爱他、守他诫命的人守约，施慈爱，直到千代。', ref: '申命记 7:9', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.4, 12, b.instant); crowdPose('israel', 'stand'); faceCrowd('israel', -1); pose('moses', 'raise'); sfx(b, 'harp'); }],
          [3.2, () => { pose('moses', 'stand'); }],
          [8.4, b => {
            // 众人回到各自的帐棚，在家里教训儿女
            crowdWalk('israel', 0.64, 0.99, { speed: 0.026, pose: 'sit' });
            sfx(b, 'crowd', { soft: true });
          }],
          [16.6, b => {
            W.set('dtDoors', 1, b.instant);
            if (!b.instant && GS.fx) {
              const f = fig('moses'), mx = f ? f.nx * W.w : X.moses * W.w, my = gY(2, X.moses) - 44 * LS(2);
              const tg = [];
              TENTS.forEach(([xf, sz, v]) => { for (let j = 0; j < 7; j++) tg.push([xf * W.w + (j - 3) * 2.2 * LS(2), tentY(xf, v) - 15 * LS(2) * sz * (0.3 + j * 0.1), 1.6]); });
              GS.fx.sow(mx, my, tg, [255, 222, 150], { stagger: 1.2, dur: 2.6, pass: 'air' });
            }
            sfx(b, 'chime');
          }],
          [24.3, b => { if (!b.instant && GS.fx) GS.fx.sparkle(0.82 * W.w, gY(2, 0.82) - 30 * LS(2), 40, [255, 230, 170], 60 * LS(2), 'air'); }],
        ]);
      },
    },

    // ── 8:3 吗哪；美地 ─────────────────────────────────────────
    {
      kind: 'act', utter: '人活着不是单靠食物', cmd: 'feed 以色列 --with 吗哪 && 话  # 衣服没有穿破', ref: '8:3',
      verse: [
        { text: '他苦炼你，任你饥饿，将你和你列祖所不认识的吗哪赐给你吃，<br>使你知道，人活着不是单靠食物，乃是靠耶和华口里所出的一切话。', ref: '申命记 8:3', hold: 7.5 },
        { text: '因为耶和华你神领你进入美地，那地有河，有泉，有源，从山谷中流出水来。<br>那地有小麦、大麦、葡萄树、无花果树、石榴树、橄榄树，和蜜。', ref: '申命记 8:7–8', hold: 8 },
        { text: '你当知道，耶和华你神将这美地赐你为业，并不是因你的义；<br>你本是硬着颈项的百姓。', ref: '申命记 9:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.set('dtManna', 1, b.instant); W.goTo(0.45, 14, b.instant); crowdWalk('israel', X.crowd0, X.crowd1, { speed: 0.03, pose: 'bow' }); sfx(b, 'stars', { soft: true }); }],
          [5.5, () => { crowdPose('israel', 'stand'); }],
          [8.4, b => {
            W.set('dtManna', 0, b.instant);
            W.set('dtGood', 1, b.instant);
            face('moses', 1); pose('moses', 'point'); faceCrowd('israel', 1);
            sweep(b, 1.02, 0.55, 1, 6);
            sfx(b, 'harp');
          }],
          [18.2, () => { pose('moses', 'stand'); faceCrowd('israel', -1); }],
        ]);
      },
    },

    // ── 10:22 如同天上的星；夜里的眼目看顾那地 ──────────────────
    {
      kind: 'act', utter: '耶和华你的神使你如同天上的星那样多', cmd: 'count 以色列 --like 天上的星  # 七十人下埃及', ref: '10:22',
      verse: [
        { text: '看哪，天和天上的天，地和地上所有的，都属耶和华你的神。', ref: '申命记 10:14', hold: 5.5 },
        { text: '你的列祖七十人下埃及；<br>现在耶和华你的神使你如同天上的星那样多。', ref: '申命记 10:22', hold: 6 },
        { text: '你们要过去得为业的那地乃是有山有谷、雨水滋润之地，是耶和华你神所眷顾的；<br>从岁首到年终，耶和华你神的眼目时常看顾那地。', ref: '申命记 11:11–12', hold: 7.5 },
        { text: '但你们过了约旦河，得以住在耶和华你们神使你们承受为业之地，<br>又使你们太平，不被四围的一切仇敌扰乱，安然居住。', ref: '申命记 12:10', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.79, 7, b.instant); }],
          [6.5, b => { W.goTo(0.98, 8, b.instant); W.set('dtStars', 1, b.instant); crowdPose('israel', 'gaze'); pose('moses', 'gaze'); sfx(b, 'stars'); }],
          [10, b => { sfx(b, 'stars', { soft: true }); }],
          [14.2, b => { W.set('dtWatch', 1, b.instant); sweep(b, 1.02, 0.52, 1, 6); }],
          [22.4, b => { crowdPose('israel', 'sit'); pose('moses', 'stand'); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 15:11 向困苦穷乏的弟兄松开手 ───────────────────────────
    {
      kind: 'cmd', utter: '总要向你地上困苦穷乏的弟兄松开手', cmd: 'open 手 --for 寄居的 孤儿 寡妇  # 吃得饱足', ref: '15:11',
      verse: [
        { text: '你们要顺从耶和华你们的神，敬畏他，谨守他的诫命，<br>听从他的话，事奉他，专靠他。', ref: '申命记 13:4', hold: 6 },
        { text: '在你城里无分无业的利未人，和你城里寄居的，并孤儿寡妇，<br>都可以来，吃得饱足。', ref: '申命记 14:29', hold: 6.5 },
        { text: '原来那地上的穷人永不断绝；所以我吩咐你说：<br>「总要向你地上困苦穷乏的弟兄松开手。」', ref: '申命记 15:11', hold: 6.5 },
        { text: '守节的时候，你和你儿女、仆婢，并住在你城里的利未人，<br>以及寄居的与孤儿寡妇，都要欢乐。', ref: '申命记 16:14', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => {
            W.set('dtStars', 0, b.instant); W.set('dtWatch', 0, b.instant);
            W.goTo(0.32, 11, b.instant);
            crowdPose('israel', 'stand');
            for (const id of ['widow', 'orphan', 'stranger']) glow(id, 0.5);
            sfx(b, 'bird', { soft: true });
          }],
          [3, b => { beamOn(b, 'widow', { dur: 5, w: 90, r: 0.2 }); }],
          [7.5, b => {
            add('giver', { label: '以色列人', sex: 'm', age: 'adult', x: 0.86, facing: 1, robe: ROBE.giver, glow: 0.15, prop: 'bundle', v: 0.25, from: b.instant ? 'none' : 'fade' });
            walk('giver', X.stranger - 0.025, { speed: 0.03 });
            face('joshua', 1);
          }],
          [14.5, b => {
            hold('giver', null); hold('widow', 'bundle');
            pose('widow', 'stand'); pose('orphan', 'stand'); pose('stranger', 'stand');
            sfx(b, 'harp', { soft: true });
          }],
          [16.5, () => {
            // 领进众人中间
            walk('giver', 0.83, { speed: 0.02 }); walk('stranger', 0.848, { speed: 0.02 }); walk('widow', 0.866, { speed: 0.02 }); walk('orphan', 0.88, { speed: 0.02 });
          }],
          [22.2, b => { crowdPose('israel', 'raise'); faceCrowd('israel', 0.86); sfx(b, 'crowd'); }],
          [23, () => { for (const id of ['giver', 'widow', 'orphan', 'stranger']) pose(id, 'raise'); face('widow', -1); face('orphan', -1); face('stranger', -1); face('giver', 1); }],
          [28, () => { crowdPose('israel', 'stand'); for (const id of ['giver', 'widow', 'orphan', 'stranger']) pose(id, 'stand'); }],
        ]);
      },
    },

    // ── 19:3 三座逃城与道路 ────────────────────────────────────
    {
      kind: 'cmd', utter: '要预备道路，使误杀人的都可以逃到那里去', cmd: 'route 三城 --prepare 道路  # 逃到那里可以存活', ref: '19:3',
      verse: [
        { text: '他登了国位，就要将……这律法书，为自己抄录一本，<br>存在他那里，要平生诵读，好学习敬畏耶和华他的神。', ref: '申命记 17:18–19', hold: 6.5 },
        { text: '「我必在他们弟兄中间给他们兴起一位先知，像你。<br>我要将当说的话传给他；他要将我一切所吩咐的都传给他们。」', ref: '申命记 18:18', hold: 7.5 },
        { text: '要将耶和华你神使你承受为业的地分为三段；<br>又要预备道路，使误杀人的，都可以逃到那里去。', ref: '申命记 19:3', hold: 6.5 },
        { text: '田间的树木岂是人，叫你糟蹋吗？', ref: '申命记 20:19', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.39, 10, b.instant); W.set('dtRoads', 0.3, b.instant); face('moses', 1); faceCrowd('israel', 1); sfx(b, 'chime'); }],
          [7.8, b => { beamOn(b, 'moses', { dur: 6, w: 64, r: 0.22 }); faceCrowd('israel', -1); }],
          [15.6, b => { W.set('dtRoads', 1, b.instant); sweep(b, X.cities[0] - 0.02, X.cities[2] + 0.03, 1, 6); faceCrowd('israel', 1); sfx(b, 'build', { soft: true, far: true }); }],
          [23.4, b => {
            if (!b.instant && GS.fx) for (const t of GOOD.trees) if (t.kind !== 'vine' && hsh(t.seed) < 0.45) GS.fx.sparkle(t.x * W.w, isleV(t.x, t.v) - 8 * LS(1), 6, [220, 255, 200], 6, 'mid');
            faceCrowd('israel', -1);
          }],
        ]);
      },
    },

    // ── 22:1 失迷的羊，牵回来交给你的弟兄 ──────────────────────
    {
      kind: 'cmd', utter: '总要把它牵回来交给你的弟兄', cmd: 'return 羊 --to 弟兄  # 不可佯为不见', ref: '22:1',
      verse: [
        { text: '你行耶和华眼中看为正的事，就可以从你们中间除掉流无辜血的罪。', ref: '申命记 21:9', hold: 5.5 },
        { text: '「你若看见弟兄的牛或羊失迷了路，不可佯为不见，<br>总要把它牵回来交给你的弟兄。', ref: '申命记 22:1', hold: 6.5 },
        { text: '然而耶和华你的神不肯听从巴兰，却使那咒诅的言语变为祝福的话，<br>因为耶和华你的神爱你。', ref: '申命记 23:5', hold: 6.5 },
        { text: '你在田间收割庄稼，若忘下一捆，不可回去再取，<br>要留给寄居的与孤儿寡妇。', ref: '申命记 24:19', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.44, 10, b.instant); walk('stray', X.stray, { speed: 0.028 }); face('shepherd', 1); sfx(b, 'bleat', { soft: true }); }],
          [5.2, b => {
            add('finder', { label: '以色列人', sex: 'm', age: 'adult', x: 0.75, facing: -1, robe: ROBE.finder, glow: 0.15, v: 0.44, from: b.instant ? 'none' : 'fade' });
            walk('finder', X.stray + 0.018, { speed: 0.05 });
            sfx(b, 'bleat', { soft: true });
          }],
          [12.6, () => {
            face('finder', 1);
            follow('stray', 'finder', 0.02);
            walk('finder', X.shepherd - 0.024, { speed: 0.03 });
          }],
          [19.5, b => {
            follow('stray', null);
            walk('stray', X.flock1 - 0.03, { speed: 0.02, pose: 'graze' });
            face('shepherd', -1); face('finder', 1);
            pose('shepherd', 'bow');
            sfx(b, 'bleat', { soft: true });
          }],
          [22.5, () => { pose('shepherd', 'stand'); embraceSoft('shepherd', 'finder'); }],
          [26, () => { pose('finder', 'stand'); pose('shepherd', 'stand'); walk('finder', 0.69, { speed: 0.03 }); }],
        ]);
      },
    },

    // ── 28:12 天上的府库，按时降雨 ─────────────────────────────
    {
      kind: 'promise', utter: '耶和华必为你开天上的府库', cmd: 'open 天上的府库 --rain 按时  # 初熟的土产', ref: '28:12',
      verse: [
        { text: '「牛在场上踹谷的时候，不可笼住它的嘴。」', ref: '申命记 25:4', hold: 4.5 },
        { text: '「耶和华啊，现在我把你所赐给我地上初熟的土产奉了来。」<br>随后你要把筐子放在耶和华你神面前，向耶和华你的神下拜。', ref: '申命记 26:10', hold: 7 },
        { text: '你们过约旦河，到了耶和华你神所赐给你的地，当天要立起几块大石头，墁上石灰，<br>把这律法的一切话写在石头上。', ref: '申命记 27:2–3', hold: 7 },
        { text: '耶和华必为你开天上的府库，按时降雨在你的地上。<br>在你手里所办的一切事上赐福与你。', ref: '申命记 28:12', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.5, 12, b.instant); W.set('clouds', 0.9, b.instant); W.set('rain', 0.22, b.instant); sfx(b, 'wind', { soft: true }); }],
          [5.6, b => {
            add('offerer', { label: '献初熟土产的人', sex: 'm', age: 'adult', x: 1.02, facing: -1, robe: ROBE.offerer, glow: 0.15, prop: 'bundle', v: 0.1, from: b.instant ? 'none' : 'fade' });
            walk('offerer', X.tab - 0.012, { speed: 0.03 });
          }],
          [10.4, b => { hold('offerer', null); S.basket = true; pose('offerer', 'bow'); sfx(b, 'harp', { soft: true }); }],
          [12.6, b => { W.set('dtStones', 1, b.instant); sfx(b, 'build', { soft: true, far: true }); }],
          [14.5, () => { pose('offerer', 'stand'); walk('offerer', 0.925, { speed: 0.025 }); }],
          [18.5, b => { W.set('rain', 0.62, b.instant); W.set('storm', 0.12, b.instant); crowdPose('israel', 'gaze'); sfx(b, 'rain'); }],
          [27.5, b => { W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.4, b.instant); crowdPose('israel', 'stand'); }],
        ]);
      },
    },

    // ── 31:23 约书亚：刚强壮胆；云柱停在会幕门 ─────────────────
    {
      kind: 'cmd', utter: '你当刚强壮胆', cmd: 'handoff 摩西 → 约书亚  # 我必与你同在', ref: '31:23',
      verse: [
        { text: '隐秘的事是属耶和华我们神的；<br>惟有明显的事是永远属我们和我们子孙的，好叫我们遵行这律法上的一切话。', ref: '申命记 29:29', hold: 6.5 },
        { text: '我今日呼天唤地向你作见证；我将生死祸福陈明在你面前，<br>所以你要拣选生命，使你和你的后裔都得存活。', ref: '申命记 30:19', hold: 7 },
        { text: '耶和华在会幕里云柱中显现，云柱停在会幕门以上。', ref: '申命记 31:15', hold: 5 },
        { text: '耶和华嘱咐嫩的儿子约书亚说：「你当刚强壮胆，<br>因为你必领以色列人进我所起誓应许他们的地；我必与你同在。」', ref: '申命记 31:23', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.56, 12, b.instant); walk('moses', X.tab - 0.06, { speed: 0.02 }); walk('joshua', X.tab - 0.04, { speed: 0.02 }); faceCrowd('israel', 1); }],
          [8, b => { if (!b.instant && GS.fx) GS.fx.ring(0.8 * W.w, gY(2, 0.8) - 30 * LS(2), [255, 244, 220], M() * 0.55, 3, 1.6); sfx(b, 'wind', { soft: true }); }],
          [15.5, b => { W.set('dtPillar', 1, b.instant); face('moses', 1); face('joshua', 1); crowdPose('israel', 'bow'); sfx(b, 'angel', { soft: true }); }],
          [21.6, b => { beamOn(b, 'joshua', { dur: 7, w: 80, r: 0.25 }); glow('joshua', 0.75); pose('joshua', 'kneel'); sfx(b, 'harp'); }],
          [27, () => { pose('joshua', 'stand'); crowdPose('israel', 'stand'); }],
        ]);
      },
    },

    // ── 32:11 摩西的歌：如鹰搅动巢窝 ───────────────────────────
    {
      kind: 'act', utter: '如鹰搅动巢窝', cmd: 'catch 雏鹰 --on 两翼  # 耶和华独自引导他', ref: '32:11',
      verse: [
        { text: '诸天哪，侧耳，我要说话；愿地也听我口中的言语。<br>我的教训要淋漓如雨；我的言语要滴落如露。', ref: '申命记 32:1–2', hold: 6.5 },
        { text: '又如鹰搅动巢窝，在雏鹰以上两翅搧展，接取雏鹰，背在两翼之上。<br>这样，耶和华独自引导他，并无外邦神与他同在。', ref: '申命记 32:11–12', hold: 7.5 },
        { text: '「你上这亚巴琳山中的尼波山去……观看我所要赐给以色列人为业的迦南地。<br>……我所赐给以色列人的地，你可以远远地观看，却不得进去。」', ref: '申命记 32:49–52', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => {
            W.set('dtPillar', 0, b.instant); W.goTo(0.62, 12, b.instant);
            walk('moses', X.moses, { speed: 0.02 }); walk('joshua', X.joshua, { speed: 0.02 });
            flash(b, { type: 'eagle', dur: 19.5 });
            sfx(b, 'wings');
          }],
          [3, () => { face('moses', -1); face('joshua', -1); faceCrowd('israel', -1); crowdPose('israel', 'gaze'); }],
          [4.5, b => { sfx(b, 'wings', { soft: true }); }],
          [8.8, b => { sfx(b, 'wings'); }],
          [15.6, b => { face('moses', -1); pose('moses', 'gaze'); crowdPose('israel', 'stand'); const sm = summit(); beamAt(b, sm[0] / W.w, sm[1], { dur: 6, w: 70, r: 0.2 }); }],
        ]);
      },
    },

    // ── 33:27 为十二支派祝福；登山 ──────────────────────────────
    {
      kind: 'bless', utter: '永生的神是你的居所', cmd: 'bless 十二支派  # 永久的膀臂在你以下', ref: '33:27',
      verse: [
        { text: '以下是神人摩西在未死之先为以色列人所祝的福。', ref: '申命记 33:1', hold: 4.5 },
        { text: '永生的神是你的居所；他永久的膀臂在你以下。', ref: '申命记 33:27', hold: 5.5 },
        { text: '以色列啊，你是有福的！谁像你这蒙耶和华所拯救的百姓呢？', ref: '申命记 33:29', hold: 5.5 },
        { text: '摩西从摩押平原登尼波山，上了那与耶利哥相对的毗斯迦山顶。', ref: '申命记 34:1', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.3, b => { W.goTo(0.7, 18, b.instant); face('moses', 1); pose('moses', 'raise'); faceCrowd('israel', -1); sfx(b, 'harp'); }],
          [1.5, b => { W.set('dtTribes', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          [11.6, b => { crowdPose('israel', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [16.5, b => {
            pose('moses', 'stand'); crowdPose('israel', 'stand');
            onMount('moses');
            walk('moses', X.pisgah + 0.012, { speed: 0.021 });
            walk('joshua', 0.675, { speed: 0.02, pose: 'gaze' });
            faceCrowd('israel', -1);
            sfx(b, 'wind', { soft: true });
          }],
          [26, () => { face('moses', 1); pose('moses', 'gaze'); face('joshua', -1); }],
        ]);
      },
    },

    // ── 34:4 这就是应许之地 ────────────────────────────────────
    {
      kind: 'promise', utter: '这就是我向亚伯拉罕、以撒、雅各起誓应许之地', cmd: 'show 基列 … 琐珥  # 我使你眼睛看见了', ref: '34:4',
      verse: [
        { text: '耶和华把基列全地直到但，拿弗他利全地，以法莲、玛拿西的地，<br>犹大全地直到西海，南地和棕树城耶利哥的平原，直到琐珥，都指给他看。', ref: '申命记 34:1–3', hold: 9 },
        { text: '耶和华对他说：「这就是我向亚伯拉罕、以撒、雅各起誓应许之地，<br>说：『我必将这地赐给你的后裔。』现在我使你眼睛看见了，你却不得过到那里去。」', ref: '申命记 34:4', hold: 9 },
      ],
      apply(c) {
        const beats = [
          [0.2, b => {
            W.goTo(0.745, 8, b.instant);
            W.set('dtTribes', 0, b.instant);
            W.set('dtVista', 1, b.instant);
            face('moses', 1); pose('moses', 'gaze');
            faceCrowd('israel', -1); face('joshua', -1);
            sfx(b, 'harp');
          }],
          [12, b => { const sm = summit(); beamAt(b, sm[0] / W.w, sm[1], { dur: 8, w: 70, r: 0.3 }); sfx(b, 'angel', { soft: true }); }],
          [19, () => { pose('moses', 'kneel'); }],
        ];
        for (const [name, xf, row, at, pp] of REGIONS) beats.push([at, b => showRegion(b, name, xf, row, pp)]);
        T(c, beats);
      },
    },

    // ── 34:5–10 耶和华将他埋葬；约书亚 ──────────────────────────
    {
      kind: 'act', utter: '耶和华将他埋葬在摩押地', cmd: 'rest 摩西 --where 无人知道  # 面对面所认识的', ref: '34:6',
      verse: [
        { text: '于是，耶和华的仆人摩西死在摩押地，正如耶和华所说的。<br>耶和华将他埋葬在摩押地……只是到今日没有人知道他的坟墓。', ref: '申命记 34:5–6', hold: 7 },
        { text: '摩西死的时候年一百二十岁；眼目没有昏花，精神没有衰败。<br>以色列人在摩押平原为摩西哀哭了三十日。', ref: '申命记 34:7–8', hold: 6.5 },
        { text: '嫩的儿子约书亚；因为摩西曾按手在他头上，就被智慧的灵充满，<br>以色列人便听从他。', ref: '申命记 34:9', hold: 6 },
        { text: '以后以色列中再没有兴起先知像摩西的。<br>他是耶和华面对面所认识的。', ref: '申命记 34:10', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { W.set('dtGlory', 1, b.instant); W.set('dtVista', 0, b.instant); pose('moses', 'kneel'); sfx(b, 'angel'); }],
          [2.4, () => { pose('moses', 'lie'); }],
          [5, b => { rm('moses'); S.gone = true; flash(b, { type: 'descend', dur: 5.5 }); }],
          [8, b => { W.set('dtGlory', 0, b.instant); W.set('dtMist', 1, b.instant); W.goTo(0.93, 6, b.instant); }],
          [8.4, b => { crowdPose('israel', 'weep'); pose('joshua', 'weep'); sfx(b, 'weep'); }],
          [15.2, b => {
            W.goTo(0.27, 9, b.instant);
            crowdPose('israel', 'stand'); pose('joshua', 'stand');
            walk('joshua', X.moses, { speed: 0.02 });
            glow('joshua', 0.9);
          }],
          [19.5, b => { face('joshua', 1); faceCrowd('israel', -1); beamOn(b, 'joshua', { dur: 7, w: 90, r: 0.3 }); sfx(b, 'harp'); }],
          [21.5, () => { crowdPose('israel', 'bow'); }],
          [25, b => { crowdPose('israel', 'stand'); W.set('dtMist', 0.55, b.instant); }],
        ]);
      },
    },
  ];
  // 两人相拥（人物模块若支持）
  function embraceSoft(a, b) { const c = C(); if (c.embrace) U.safe('cast.embrace', () => c.embrace(a, b)); }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '申命记', books: [5], title: '毗斯迦', sub: '申命记 1 — 34', tint: [240, 230, 210], music: 'jacob',
    intro: [
      { text: '以下所记的是摩西在约旦河东的旷野……向以色列众人所说的话。', ref: '申命记 1:1', hold: 5.5 },
      { text: '出埃及第四十年十一月初一日，<br>摩西照耶和华藉着他所吩咐以色列人的话都晓谕他们。', ref: '申命记 1:3', hold: 6 },
    ],
    outro: 18,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '摩西': { text: '摩西死的时候年一百二十岁；眼目没有昏花，精神没有衰败。', ref: '申命记 34:7' },
      '约书亚': { text: '嫩的儿子约书亚；因为摩西曾按手在他头上，就被智慧的灵充满，<br>以色列人便听从他，照着耶和华吩咐摩西的行了。', ref: '申命记 34:9' },
      '以色列人': { text: '以色列啊，你是有福的！谁像你这蒙耶和华所拯救的百姓呢？', ref: '申命记 33:29' },
      '毗斯迦山': { text: '「你且上毗斯迦山顶去，向东、西、南、北举目观望，<br>因为你必不能过这约旦河。」', ref: '申命记 3:27' },
      '会幕': { text: '耶和华在会幕里云柱中显现，云柱停在会幕门以上。', ref: '申命记 31:15' },
      '云柱': { text: '他在路上，在你们前面行，为你们找安营的地方；<br>夜间在火柱里，日间在云柱里，指示你们所当行的路。', ref: '申命记 1:33' },
      '火柱': { text: '他在路上，在你们前面行，为你们找安营的地方；<br>夜间在火柱里，日间在云柱里，指示你们所当行的路。', ref: '申命记 1:33' },
      '帐棚': { text: '又要写在你房屋的门框上，并你的城门上。', ref: '申命记 6:9' },
      '约旦河': { text: '求你容我过去，看约旦河那边的美地，<br>就是那佳美的山地和黎巴嫩。', ref: '申命记 3:25' },
      '迦南地': { text: '因为耶和华你神领你进入美地，那地有河，有泉，有源，从山谷中流出水来。', ref: '申命记 8:7' },
      '耶利哥': { text: '南地和棕树城耶利哥的平原，直到琐珥，都指给他看。', ref: '申命记 34:3' },
      '寡妇': { text: '他为孤儿寡妇伸冤，又怜爱寄居的，赐给他衣食。', ref: '申命记 10:18' },
      '孤儿': { text: '他为孤儿寡妇伸冤，又怜爱寄居的，赐给他衣食。', ref: '申命记 10:18' },
      '寄居的': { text: '所以你们要怜爱寄居的，因为你们在埃及地也作过寄居的。', ref: '申命记 10:19' },
      '牧人': { text: '「你若看见弟兄的牛或羊失迷了路，不可佯为不见，<br>总要把它牵回来交给你的弟兄。', ref: '申命记 22:1' },
      '羊': { text: '「你若看见弟兄的牛或羊失迷了路，不可佯为不见，<br>总要把它牵回来交给你的弟兄。', ref: '申命记 22:1' },
      '羊群': { text: '他必爱你，赐福与你……以及牛犊、羊羔。', ref: '申命记 7:13' },
      '鹰巢': { text: '又如鹰搅动巢窝，在雏鹰以上两翅搧展，接取雏鹰，背在两翼之上。', ref: '申命记 32:11' },
      '逃城': { text: '误杀人的逃到那里可以存活。', ref: '申命记 19:4' },
      '大石头': { text: '你要将这律法的一切话明明地写在石头上。', ref: '申命记 27:8' },
      '筐子': { text: '你的筐子和你的抟面盆都必蒙福。', ref: '申命记 28:5' },
      '献初熟土产的人': { text: '你和利未人，并在你们中间寄居的，<br>要因耶和华你神所赐你和你家的一切福分欢乐。', ref: '申命记 26:11' },
    },
  });
})(window.GS);
