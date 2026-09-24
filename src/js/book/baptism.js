/* ─────────────────────────────────────────────────────────────
 * book/baptism.js —— 四福音 · 受洗（马太福音 3 — 4 · 约翰福音 1 — 2）
 *
 * 「神的儿子，耶稣基督福音的起头」：清晨，约旦河从北边流下，河边是犹太的旷野，远处中丘上是耶路撒冷。
 * 有一个人，是从神那里差来的，名叫约翰——他在河边喊着：预备主的道；旷野里弯曲的路修直了，
 * 众人从耶路撒冷和犹太全地出来，在约旦河里受他的洗。
 * 耶稣从加利利来，约翰想要拦住他；「你暂且许我」——二人下到水里。
 * 耶稣受了洗，从水里上来：天为他开了，一只光的鸽子从开了的天上降下，落在他身上；从天上有声音。
 * 旷野四十昼夜（时辰飞逝）；那试探人的只是一团冷而暗的烟影：石头泛着饼的虚光，圣城的殿顶，最高的山上万国的荣华——
 * 三次以经上的话回答；「撒但，退去吧！」——虚光熄灭，烟影退散，天亮了，天使来伺候他。
 * 回到约旦河外：「看哪，神的羔羊」；两个门徒跟从他——「你们要什么？」「你们来看」，住处的灯亮了。
 * 安得烈找着西门：「你要称为矶法」（名字的微尘重新聚成）。腓力、拿但业、无花果树；天开了，神的使者上去下来在人子身上。
 * 迦拿的娶亲筵席：六口石缸倒满了水，直到缸口；水变的酒在缸里发出红光，显出他的荣耀来。
 * 迦百农，坐在黑暗里的百姓看见了大光（黎明）；加利利海边，船、网——「来跟从我」；许多人跟着他。
 *
 * 画面的方位：左 = 海（加利利海；近岸与中丘之间是一道海峡，渔船泊在那里）；
 *            约旦河自近地的地脊（上游、北）流到画面底（下游）；右 = 旷野、住处、迦拿、迦百农（每一句话换一处布景）。
 * 神的显现：父从不画作人形——开了的天、光、云与声音（经文）；圣灵是光的鸽子；子无面目，只以光与众人的转向相认；
 * 试探者只是一团冷暗的烟影，终必退散；天使是发光的人形。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU } = U;
  const ACT = 'baptism';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('bpRiver', 'exp', 0.55);    // 约旦河
  W.defineLevel('bpPath', 'exp', 0.5);      // 旷野里的路（3:3）
  W.defineLevel('bpStraight', 'exp', 0.45); // 修直他的路
  W.defineLevel('bpCity', 'exp', 0.5);      // 中丘上的耶路撒冷（圣城）
  W.defineLevel('bpCold', 'exp', 0.6);      // 殿顶的异象：冷的虚光（4:5）
  W.defineLevel('bpOpen', 'exp', 0.55);     // 天开了（3:16，约 1:51）
  W.defineLevel('bpBeam', 'exp', 0.7);      // 自开了的天落在他身上的光
  W.defineLevel('bpDove', 'lin', 0.19);     // 光的鸽子降下（0 天上 → 1 落在他身上）
  W.defineLevel('bpDoveA', 'exp', 0.5);     // 鸽子的光
  W.defineLevel('bpStones', 'exp', 0.5);    // 旷野的石头
  W.defineLevel('bpLoaf', 'exp', 0.6);      // 石头泛着饼的虚光（4:3）
  W.defineLevel('bpShadow', 'exp', 0.45);   // 试探人的：一团冷而暗的烟影
  W.defineLevel('bpCrag', 'exp', 0.5);      // 最高的山（4:8）
  W.defineLevel('bpKing', 'exp', 0.45);     // 万国的荣华（远处的金光）
  W.defineLevel('bpDwell', 'exp', 0.6);     // 耶稣的住处（约 1:39）
  W.defineLevel('bpLamp', 'exp', 0.5);      // 住处的灯
  W.defineLevel('bpFig', 'exp', 0.6);       // 无花果树（约 1:48）
  W.defineLevel('bpLadder', 'exp', 0.5);    // 神的使者上去下来（约 1:51）
  W.defineLevel('bpCana', 'exp', 0.6);      // 迦拿：娶亲的家、院子、灯
  W.defineLevel('bpJars', 'exp', 0.7);      // 六口石缸
  W.defineLevel('bpFill', 'lin', 0.15);     // 倒满了水（0 → 1，一口一口）
  W.defineLevel('bpWine', 'lin', 0.19);     // 水变的酒（0 → 1，一口一口发出红光）
  W.defineLevel('bpGlory', 'exp', 0.4);     // 显出他的荣耀来（约 2:11）
  W.defineLevel('bpVillage', 'exp', 0.6);   // 迦百农
  W.defineLevel('bpDawn', 'exp', 0.3);      // 坐在黑暗里的百姓看见了大光（4:16）
  W.defineLevel('bpBoats', 'exp', 0.6);     // 加利利海边的船
  W.defineLevel('bpNet', 'exp', 0.6);       // 撒在海里的网
  W.defineLevel('bpLead', 'exp', 0.6);      // 引他到旷野去的一点光（圣灵，4:1）
  const LEVELS0 = ['bpRiver', 'bpPath', 'bpStraight', 'bpCity', 'bpCold', 'bpOpen', 'bpBeam', 'bpDove', 'bpDoveA', 'bpStones', 'bpLoaf',
    'bpShadow', 'bpCrag', 'bpKing', 'bpDwell', 'bpLamp', 'bpFig', 'bpLadder', 'bpCana', 'bpJars', 'bpFill', 'bpWine', 'bpGlory',
    'bpVillage', 'bpDawn', 'bpBoats', 'bpNet', 'bpLead'];
  const L = k => W.lv[k] || 0;

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const phone = () => W.w < 600;
  const LS = l => W.layerScale(l) * (phone() ? 1.15 : 1);
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.55 : 1) * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  // 地面：用升起之后的地形（恢复存档时各层尚未"升起"，按它定下的位置才与看完时一样）
  const gY = (l, xf) => {
    const x = xf * W.w;
    let y = W.ridgeBaseY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const ease = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, a);
  // 手机上换一处位置（竖屏的地窄，人相对更宽）
  const at = (d, m) => (phone() && m != null ? m : d);

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(3316); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const LOOK = id => (C() && C().LOOK && C().LOOK[id]) || {};
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function unfollow(id) { const f = fig(id); if (f) f.follow = null; }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  function propOf(id, what) { const c = C(); if (c.prop && fig(id)) c.prop(id, what); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o) || []; return []; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) {
    const c = C(); if (!c.crowds || !c.crowds.get) return;
    const g = c.crowds.get(gid);
    if (g) g.members.forEach(m => { const dd = typeof d === 'number' && Math.abs(d) !== 1 ? (d * 1 >= m.nx ? 1 : -1) : d; m.facing = dd; if (W.replaying) m.fd = dd; });
  }
  // 人群里每人的纵深（确定的，看完与恢复一样）
  function crowdDepth(gid, v0, v1, seed) {
    const c = C(); if (!c.crowds || !c.crowds.get) return;
    const g = c.crowds.get(gid);
    if (g) g.members.forEach((m, i) => { m.v = lerp(v0, v1, rt(seed + i * 7)); });
  }
  const who = (d, m) => (phone() ? m : d);
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶——按人物此刻的状态算（不依赖上一帧画在哪里）
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    const ak = f.age === 'elder' ? 0.96 : f.age === 'child' ? 0.62 : 1;
    const h = 34 * W.layerScale(l) * (phone() ? 1.55 : 1) * ([1.1, 1.2, 1.3][l] || 1) * ak * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    let x, y;
    if (f.attach) {
      const r = U.safe('bp.attach', () => f.attach());
      if (!r || !isFinite(r[0])) return null;
      x = r[0]; y = r[1];
    } else {
      x = f.nx * W.w;
      const g = gY(l, f.nx);
      const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
      y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    }
    return [x, y - h * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const top = phone() ? W.h * 0.4 : size * 0.8 + 8;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, top, W.h - size)];
  }
  function nameHere(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const size = Math.max(0.034, o.size || 0.042) * M(), n = Array.from(str).length;
    const c = nameAt(x, y - size * 0.9, size, n);
    const src = o.src || (() => [x + rand(-50, 50) * SU(), y + rand(-20, 30) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 3.2, delay: o.delay, step: o.step, dot: o.dot });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  function nameOn(b, id, str, rgb, o) { const p = figPt(id, 1); if (p) nameHere(b, str, p[0], p[1] - PH(2) * 0.25, rgb, o); }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function ringOn(b, id, frac, rgb, r, dur) { const p = figPt(id, frac); if (p) ringAt(b, p[0], p[1], rgb, r, dur); }
  function sparkOn(b, id, frac, n, rgb, spread, pass) { const p = figPt(id, frac); if (p) sparkAt(b, p[0], p[1], n, rgb, spread, pass); }
  function shake(b, v) { if (!b.instant) W.shake = Math.max(W.shake || 0, v); }
  function flash(b, v) { if (!b.instant) W.flash = Math.max(W.flash || 0, v); }

  // ── 装饰性的补间（只关乎画面；瞬间重演时不存在）───────────────
  const TW = {};
  function tween(b, name, dur, data) { if (b.instant) { delete TW[name]; return; } TW[name] = { t0: W.t, dur: Math.max(0.05, dur / (W.fast || 1)), data: data || null }; }
  function tk(name) { const q = TW[name]; if (!q) return -1; const k = (W.t - q.t0) / q.dur; return k > 1 ? -1 : Math.max(0, k); }
  const twData = name => (TW[name] ? TW[name].data : null);

  // ── 渐变的缓存（画面大小或颜色桶变了才重建；resize 时清空）────────
  const GC = new Map();
  function gcache(key, make) {
    let g = GC.get(key);
    if (!g) { if (GC.size > 96) GC.clear(); g = make(); GC.set(key, g); }
    return g;
  }
  const qc = c => [(c[0] / 3 | 0) * 3, (c[1] / 3 | 0) * 3, (c[2] / 3 | 0) * 3];

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
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
        warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 240, 255], 1), water: radial([170, 220, 246], 1), red: radial([214, 40, 52], 1, 0.4),
        wine: radial([255, 96, 90], 1, 0.3), veil: radial([12, 14, 24], 1, 0.62), cold: radial([150, 172, 214], 1, 0.5),
        cloud: radial([246, 244, 240], 0.95, 0.62), dawn: radial([255, 200, 130], 1, 0.45),
      };
      // 自天而降的光柱
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,248,230,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.07, 'rgba(0,0,0,0.2)'); vt.addColorStop(0.24, 'rgba(0,0,0,0.9)'); vt.addColorStop(0.8, 'rgba(0,0,0,0.8)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!sp || a < 0.004 || r < 0.5 || !isFinite(x) || !isFinite(y)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }
  function glowE(ctx, sp, x, y, rx, ry, a) {
    if (!sp || a < 0.004 || rx < 0.5 || !isFinite(x) || !isFinite(y)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - rx, y - ry, rx * 2, ry * 2);
    ctx.globalAlpha = a0;
  }

  // ════════════════════════════════════════════════════════════
  //  地上的位置（画面宽度的比例；手机另有一套）
  // ════════════════════════════════════════════════════════════
  const X = {
    jT: 0.664, jB: 0.618, bapV: 0.42,       // 约旦河：上游（地脊）→ 下游（画面底）；施洗之处的纵深
    city: 0.9,                                 // 中丘上的耶路撒冷
    crag: 0.8,                                 // 最高的山
    dwell: 0.93, fig: 0.875,                   // 住处；无花果树
    house: 0.9, well: 0.53,                    // 迦拿的家；井
    village: [0.505, 0.54, 0.575, 0.607],      // 迦百农的房屋
    boatA: 0.665, boatB: 0.81,                 // 两条船
  };
  const jarX = i => at(0.605, 0.53) + i * at(0.0185, 0.034);   // 六口石缸
  const JAR_V = 0.36;

  // ════════════════════════════════════════════════════════════
  //  本幕的状态（只在 setup / apply / 情节里改动，重演时一样）
  // ════════════════════════════════════════════════════════════
  let S = fresh();
  function fresh() {
    return { shDx: 2.6, lead: 0.72, stones: 0.78, dove: 'none', simon: '西门', netCast: false, cup: null };
  }

  // ════════════════════════════════════════════════════════════
  //  约旦河：自近地的地脊（上游）流到画面底（下游）
  // ════════════════════════════════════════════════════════════
  let RV = null;
  function rv() {
    const k = W.w + 'x' + W.h;
    if (RV && RV.k === k) return RV;
    const x0 = X.jT * W.w, y0 = Math.min(W.ridgeBaseY(2, x0), W.h * 0.97) + 0.5, x3 = X.jB * W.w, y3 = W.h + 8;
    RV = { k, x0, y0, x3, y3, x1: lerp(x0, x3, 0.3) + 0.016 * W.w, y1: lerp(y0, y3, 0.33), x2: lerp(x0, x3, 0.66) - 0.014 * W.w, y2: lerp(y0, y3, 0.68) };
    return RV;
  }
  function rPt(t) {
    const R = rv(), u = 1 - t;
    const px = u * u * u * R.x0 + 3 * u * u * t * R.x1 + 3 * u * t * t * R.x2 + t * t * t * R.x3;
    const py = u * u * u * R.y0 + 3 * u * u * t * R.y1 + 3 * u * t * t * R.y2 + t * t * t * R.y3;
    const dx = 3 * u * u * (R.x1 - R.x0) + 6 * u * t * (R.x2 - R.x1) + 3 * t * t * (R.x3 - R.x2);
    const dy = 3 * u * u * (R.y1 - R.y0) + 6 * u * t * (R.y2 - R.y1) + 3 * t * t * (R.y3 - R.y2);
    const Ln = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / Ln, dx / Ln];
  }
  const rHW = t => (0.3 + 1.25 * Math.pow(Math.max(0, t), 1.1)) * PH(2);
  function tAtY(y) {
    let a = 0, b = 1;
    for (let i = 0; i < 16; i++) { const m = (a + b) / 2; if (rPt(m)[1] < y) a = m; else b = m; }
    return (a + b) / 2;
  }
  // 纵深 v 处河心的横坐标（比例）；side −1 = 左岸，+1 = 右岸；off：以人高计的偏移
  function riverAtV(v, side, off) {
    const y = fieldY(X.jT, v), t = tAtY(y), p = rPt(t);
    let x = p[0];
    if (side) x += side * rHW(t) * 1.05;
    if (off) x += off * PH(2);
    return x / W.w;
  }
  function riverPath(ta, tb, mul_, add_) {
    const N = 24, Lp = [], Rp = [];
    for (let i = 0; i <= N; i++) {
      const t = lerp(ta, tb, i / N), p = rPt(t), w = rHW(t) * mul_ + add_ * (0.3 + t);
      Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]);
    }
    const P2 = new Path2D();
    Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
    for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
    P2.closePath();
    return P2;
  }
  const RPC = { k: '', bank: null, green: null, bed: null, water: null };
  function drawJordan(ctx) {
    const A = L('bpRiver');
    if (A < 0.01) return;
    const R = rv(), s = LS(2);
    if (RPC.k !== R.k) {
      RPC.k = R.k;
      RPC.green = riverPath(0, 1, 2.6, 8 * s);
      RPC.bank = riverPath(0, 1, 1.45, 4 * s);
      RPC.bed = riverPath(0, 1, 1.04, 0);
      RPC.water = riverPath(0, 1, 1, 0);
    }
    // 河谷两岸的绿（旷野里一道青色的带子）
    ctx.globalAlpha = 0.5 * A;
    ctx.fillStyle = css([92, 118, 70], 2);
    ctx.fill(RPC.green);
    // 泥滩的岸
    ctx.globalAlpha = 0.75 * A;
    ctx.fillStyle = css([140, 122, 90], 2);
    ctx.fill(RPC.bank);
    ctx.globalAlpha = A;
    ctx.fillStyle = css([118, 104, 82], 2);
    ctx.fill(RPC.bed);
    // 水
    const night = W.night > 0.5;
    const top = qc(W.shade([150, 194, 208], 0.4, 0.06)), bot = qc(W.shade([44, 100, 120], 0, 0.03));
    ctx.globalAlpha = 0.94 * A;
    ctx.fillStyle = gcache('rv|' + R.k + '|' + top + '|' + bot, () => {
      const g = ctx.createLinearGradient(0, R.y0, 0, W.h);
      g.addColorStop(0, U.rgb(top[0], top[1], top[2])); g.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
      return g;
    });
    ctx.fill(RPC.water);
    // 天光的倒影：顺流而下的亮纹
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = (night ? 0.3 * W.lv.moon : 0.42 * W.daylight) * A;
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(gc, 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        for (let i = band; i < 33; i += 3) {
          const t = U.fract(rt(i * 5 + 700) + W.t * 0.03 * (0.7 + 0.6 * rt(i * 5 + 701)));
          if (t < 0.03) continue;
          const p = rPt(t), w = rHW(t) / 2, off = (rt(i * 5 + 702) * 2 - 1) * 0.8 * w, len = w * (0.25 + 0.35 * rt(i * 5 + 703));
          const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off;
          ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
        }
        ctx.globalAlpha = ga * (0.35 + 0.3 * band) * (0.6 + 0.4 * Math.sin(W.t * (0.7 + band * 0.37) + band * 2.1));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 两岸的芦苇与柽柳丛
    ctx.globalAlpha = A;
    ctx.fillStyle = css([74, 96, 58], 2);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const t = 0.04 + 0.9 * rt(i * 3 + 950), side = i % 2 ? 1 : -1, p = rPt(t), w = rHW(t) * (1.7 + 0.6 * rt(i * 3 + 951));
      const x = p[0] + p[2] * w * side, y = p[1] + p[3] * w * side, r = (4 + 5 * rt(i * 3 + 952)) * s * (0.5 + t);
      ctx.moveTo(x + r, y); ctx.ellipse(x, y - r * 0.5, r, r * 0.62, 0, Math.PI, 0); ctx.closePath();
    }
    ctx.fill();
    ctx.strokeStyle = css([98, 122, 68], 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const ws = W.wind * 1.5 * s;
    const nR = (W.quality || 1) < 0.75 ? 26 : 48;
    for (let i = 0; i < nR; i++) {
      const t = 0.04 + 0.93 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = rPt(t), w = rHW(t) * 1.22 + 2 * s;
      const x = p[0] + p[2] * w * side, y = p[1] + p[3] * w * side, h = (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t);
      const sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 站在河里的人：水没到膝（受洗时没过全身），脚边一圈圈的涟漪
  function inRiver(x, y) {
    if (L('bpRiver') < 0.3 || !isFinite(x) || !isFinite(y) || y < rv().y0) return 0;
    const t = tAtY(y), p = rPt(t), hw = rHW(t);
    const d = Math.abs(x - p[0]) / hw;
    return d < 0.95 ? 1 - ss(0.55, 0.95, d) : 0;
  }
  function drawWaders(ctx) {
    const A = L('bpRiver');
    if (A < 0.3) return;
    const c = C();
    if (!c || !c.people) return;
    const s = LS(2), R = rv();
    const top = W.shade([150, 194, 208], 0.4, 0.06), bot = W.shade([44, 100, 120], 0, 0.03);
    for (const f of c.people.values()) {
      if (f.isAnimal || f.layer !== 2 || !f._vis || f.attach || f.fly || f.alpha < 0.05) continue;
      const k0 = inRiver(f._x, f._y);
      if (k0 <= 0.01) continue;
      const h = f._h || PH(2), x = f._x, y = f._y;
      let dk = 0;
      const dq = tk('dip:' + f.id);
      if (dq >= 0) dk = Math.sin(Math.PI * clamp(dq * 1.15, 0, 1));
      const wh = h * (0.14 + 0.12 * k0 + 0.62 * dk), w = h * (0.46 + 0.3 * dk);
      // 与河水同色（按此处的深浅）
      const q = clamp((y - wh * 0.5 - R.y0) / Math.max(1, W.h - R.y0), 0, 1);
      const col = mix3(top, bot, q);
      const a0 = A * f.alpha * (0.6 + 0.35 * k0);
      const rt0 = tAtY(y), rp = rPt(rt0), rc = [rp[0], rHW(rt0) * 1.02];
      // 受洗时水没过全身：水面之上渐渐透明（像一团涌起又落下的水），不是一块方的水
      if (dk > 0.02) {
        const g = ctx.createLinearGradient(0, y - wh, 0, y);
        g.addColorStop(0, rgba(col, 0)); g.addColorStop(0.45, rgba(col, 0.85)); g.addColorStop(1, rgba(col, 1));
        ctx.fillStyle = g;
      } else ctx.fillStyle = rgba(col, 1);
      // 两层：宽而淡的一层（边缘柔和），窄而浓的一层
      for (const [ww, aa] of [[w * 1.35, 0.45], [w, 0.9]]) {
        ctx.globalAlpha = a0 * aa;
        ctx.beginPath();
        // 不越出河岸：两边各自收在此处河面的宽度之内
        const xl = Math.max(x - ww * 0.5, rc[0] - rc[1]), xr = Math.min(x + ww * 0.5, rc[0] + rc[1]), xm = (xl + xr) / 2;
        const cr = Math.min(wh * 0.5, (xr - xl) * 0.5) * dk;
        ctx.moveTo(xl, y + 2 * s);
        ctx.lineTo(xl, y - wh + 1 * s + cr);
        ctx.quadraticCurveTo(xl, y - wh - 1.5 * s, xm, y - wh - 1.5 * s);
        ctx.quadraticCurveTo(xr, y - wh - 1.5 * s, xr, y - wh + 1 * s + cr);
        ctx.lineTo(xr, y + 2 * s);
        ctx.quadraticCurveTo(xm, y + 4 * s, xl, y + 2 * s);
        ctx.fill();
      }
      // 水面的亮线与涟漪
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(226,242,252)';
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.globalAlpha = A * f.alpha * 0.45 * dayA();
      const wl = y - wh * (1 - 0.55 * dk);
      ctx.beginPath(); ctx.ellipse(x, wl, w * 0.55, 1.4 * s, 0, 0, TAU); ctx.stroke();
      for (let i = 0; i < 2; i++) {
        const qq = U.fract(W.t * 0.4 + i / 2 + f.ord * 0.13), r = w * (0.6 + 1.1 * qq);
        ctx.globalAlpha = A * f.alpha * (1 - qq) * 0.35 * dayA();
        ctx.beginPath(); ctx.ellipse(x, wl, r, r * 0.15, 0, 0, TAU); ctx.stroke();
      }
      if (dk > 0.05 && SP) glowE(ctx, SP.water, x, wl, w * 1.3, 6 * s, 0.45 * dk * A);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  旷野里的路：先弯曲而暗，后修直、发亮（3:3）；从画面右边通到河边
  // ════════════════════════════════════════════════════════════
  const PATH_V = 0.42;
  function pathPt(u) {
    const x0 = 1.03, x1 = riverAtV(PATH_V, 1) + 0.012;
    const xf = lerp(x0, x1, u);
    const bend = (1 - L('bpStraight')) * Math.sin(u * Math.PI * 3.2 + 0.6) * 0.34 * Math.sin(Math.PI * u);
    return [xf * W.w, fieldY(xf, clamp(PATH_V + bend, 0.04, 0.95))];
  }
  function drawPath(ctx) {
    const A = L('bpPath');
    if (A < 0.01) return;
    const s = LS(2), st = L('bpStraight');
    const N = 40, pts = [];
    for (let i = 0; i <= N; i++) pts.push(pathPt(i / N));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const stroke = w => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.lineWidth = w; ctx.stroke(); };
    // 土路：宽而淡的路基，当中踏实的一道
    ctx.globalAlpha = A * 0.55;
    ctx.strokeStyle = css([176, 156, 120], 2);
    stroke(Math.max(3, 11 * s));
    ctx.globalAlpha = A * 0.7;
    ctx.strokeStyle = css([196, 176, 138], 2, 1, 0.04);
    stroke(Math.max(2, 6 * s));
    // 修直之后：路上铺着一层柔和的晨光，光点沿路而来
    if (st > 0.3 && SP) {
      const k = (st - 0.3) / 0.7;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i <= N; i += 2) {
        const q = pts[i];
        glowE(ctx, SP.gold, q[0], q[1], 16 * s, 5 * s, A * k * 0.16 * (0.6 + 0.4 * dayA()));
      }
      for (let i = 0; i < 9; i++) {
        const u = U.fract(rt(i + 40) + W.t * 0.025), q = pathPt(u);
        glowSp(ctx, SP.gold, q[0], q[1] - 2 * s, 5 * s, A * k * 0.5 * Math.sin(Math.PI * u));
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 路边的碎石（路弯曲时散在路上，修直后在两旁）
    ctx.fillStyle = css([128, 116, 100], 2);
    ctx.globalAlpha = A;
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const u = 0.05 + 0.9 * rt(i * 2 + 60), q = pathPt(u), side = rt(i * 2 + 61) < 0.5 ? -1 : 1;
      const r = (1.4 + 1.6 * rt(i + 90)) * s, dy = side * (2 + 4 * st) * s;
      ctx.moveTo(q[0] + r, q[1] + dy); ctx.ellipse(q[0], q[1] + dy, r, r * 0.6, 0, Math.PI, 0);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷（中丘上）：城墙、城楼、房屋、殿与殿顶；殿顶的异象时泛着冷光
  // ════════════════════════════════════════════════════════════
  const CITY_HW = () => (phone() ? 72 : 88) * LS(1);
  function drawCity(ctx) {
    const A = L('bpCity');
    if (A < 0.01) return;
    const s = LS(1), cx = X.city * W.w, hw = CITY_HW();
    const g = x => gY(1, x / W.w) + 1.5;
    const stone = [206, 192, 162], dark = [150, 136, 114];
    ctx.globalAlpha = A;
    // 房屋（城墙之后，层层上去）
    ctx.fillStyle = css(dark, 1);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const x = cx + (rt(i + 200) * 2 - 1) * hw * 0.85, w = (5 + 5 * rt(i + 214)) * s, h = (8 + 10 * rt(i + 228)) * s;
      ctx.rect(x - w / 2, g(x) - h - 6 * s, w, h);
    }
    ctx.fill();
    // 殿：宽的台基、殿身、殿顶的角楼
    const tx = cx + hw * 0.12, ty = g(tx);
    ctx.fillStyle = css(stone, 1, 1, 0.05);
    ctx.fillRect(tx - 26 * s, ty - 18 * s, 52 * s, 18 * s);
    ctx.fillRect(tx - 12 * s, ty - 34 * s, 24 * s, 16 * s);
    ctx.fillRect(tx + 20 * s, ty - 44 * s, 7 * s, 44 * s);
    ctx.fillStyle = css([226, 196, 120], 1, 1, 0.1);
    ctx.fillRect(tx - 12 * s, ty - 35.5 * s, 24 * s, 2 * s);
    // 城墙与城楼
    ctx.fillStyle = css(stone, 1);
    ctx.beginPath();
    const n = 10;
    for (let i = 0; i <= n; i++) {
      const x = cx - hw + (2 * hw * i) / n, y = g(x);
      if (i < n) { const x2 = x + (2 * hw) / n; ctx.moveTo(x, y); ctx.lineTo(x, y - 8 * s); ctx.lineTo(x2, g(x2) - 8 * s); ctx.lineTo(x2, g(x2)); ctx.closePath(); }
      if (i % 3 === 0) ctx.rect(x - 3.5 * s, y - 13 * s, 7 * s, 13 * s);
    }
    ctx.fill();
    ctx.fillStyle = css([255, 240, 214], 1, 0.5 * W.daylight);
    ctx.fillRect(cx - hw, g(cx) - 8.5 * s, 2 * hw, 0.8 * s);
    // 夜里：城中的灯
    if (nightK() > 0.2 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) {
        const x = cx + (rt(i + 260) * 2 - 1) * hw * 0.8;
        glowSp(ctx, SP.warm, x, g(x) - (6 + 8 * rt(i + 270)) * s, 4 * s, 0.5 * A * nightK() * (0.8 + 0.2 * Math.sin(W.t * 3 + i)));
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  圣城（4:5）：魔鬼带他进了圣城，叫他站在殿顶上——
  //  近地上显出城来：城墙、层层的房屋、殿北的高楼；当中是殿（全城最大的一块）：宽大的层层台基、四围的廊子、高大的殿身；
  //  殿顶（翼角）是台基的一角：从廊子上升起的一座角楼，比殿身还高，下临深谷。
  //  暮色已尽的冷光里，整座城像一个异象：清、冷、发白（近地上罩着一层冷的青灰）
  // ════════════════════════════════════════════════════════════
  const TPL = () => ({ x: at(0.655, 0.72), w0: at(0.5, 0.43), w1: 1.02 });
  const TS = () => LS(2) * (phone() ? 1.4 : 1);          // 殿的尺度（像素）
  const tplHW = () => 118 * TS();                          // 台基的半宽
  const pinW = () => 26 * TS();                            // 角楼的宽
  // 台基的顶（像素 y）：按台基两端与当中最高的地面，左角（临谷的一角）因此最高
  function tplTopY() {
    const T0 = TPL(), tx = T0.x * W.w, hw = tplHW(), u = TS();
    const g = Math.min(gY(2, (tx - hw) / W.w), gY(2, T0.x), gY(2, (tx + hw) / W.w)) + 2;
    return g - 30 * u;
  }
  const pinX = () => TPL().x * W.w - tplHW() + pinW() * 0.5;
  // 殿顶（角楼的顶）：比殿身的檐还高 10 个单位；随异象显出而升起
  function pinTop() {
    const u = TS(), px = pinX(), k = ss(0, 1, L('bpCold'));
    const g = gY(2, px / W.w) + 2, top = tplTopY() - (8 + 48 + 10) * u;
    return [px, g - (g - top) * (0.55 + 0.45 * k)];
  }
  const pinH = () => { const px = pinX(); return gY(2, px / W.w) + 2 - pinTop()[1]; };
  // 近地的轮廓（给冷的罩子用）
  function nearLandPath() {
    const P2 = new Path2D(), N = 48, x0 = W.w * 0.22;
    P2.moveTo(x0, W.h + 2);
    for (let i = 0; i <= N; i++) { const x = lerp(x0, W.w + 2, i / N); P2.lineTo(x, Math.min(W.h + 2, W.ridgeBaseY(2, x))); }
    P2.lineTo(W.w + 2, W.h + 2); P2.closePath();
    return P2;
  }
  function drawTemple(ctx) {
    const A = L('bpCold');
    if (A < 0.01) return;
    const T0 = TPL(), u = TS(), tx = T0.x * W.w, hw = tplHW();
    const g = xp => gY(2, xp / W.w) + 2;
    const rise = 0.55 + 0.45 * ss(0, 1, A);
    const stone = [228, 224, 214], stoneD = [188, 184, 180], shadeC = [120, 124, 142], gold = [226, 196, 128], dark = [44, 44, 56];
    const sunL = W.sun && W.sun.x < tx;
    const aa = Math.min(1, A * 1.2);
    // 冷的罩子：近地罩上一层冷的青灰（乘上去：暖色退去、稍暗，不发白）
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.85 * A;
    ctx.fillStyle = 'rgb(168,184,214)';
    ctx.fill(nearLandPath());
    ctx.globalCompositeOperation = 'source-over';
    // 异象里的城：石头清冷发白（暮色里也看得清），不随暮光发暗发红
    const kC = A * clamp(0.22 + 0.62 * (1 - W.daylight), 0, 0.78);
    const tc = (rgb, a, ex) => {
      const c = mix3(W.shade(rgb, 0, ex || 0), [rgb[0] * 0.84, rgb[1] * 0.9, Math.min(255, rgb[2] * 1.06)], kC);
      return rgba(c, a == null ? 1 : a);
    };
    ctx.globalAlpha = aa;
    const xL = tx - hw, xR = tx + hw, yT = tplTopY() + (1 - rise) * 30 * u;
    // 1) 城中的房屋：殿的两旁层层叠叠（平顶、有的带楼上的一间）；殿北的高楼（安东尼亚）
    const houses = [];
    const lw = Math.max(0, xL - 4 * u - T0.w0 * W.w);
    const nL = Math.max(1, Math.round(lw / (14 * u)));
    for (let i = 0; i < nL; i++) houses.push([T0.w0 * W.w + (i + 0.5) * lw / nL, (12 + 9 * rt(i + 300)) * u, (14 + 16 * rt(i + 310)) * u, i]);
    const fx0 = xR + at(64, 16) * u;
    const rw = Math.max(0, W.w + 6 - fx0);
    const nR = Math.max(1, Math.round(rw / (16 * u)));
    for (let i = 0; i < nR; i++) houses.push([fx0 + (i + 0.5) * rw / nR, (12 + 10 * rt(i + 320)) * u, (16 + 18 * rt(i + 330)) * u, i + 20]);
    ctx.fillStyle = tc(stoneD);
    ctx.beginPath();
    for (const [x, w, h, k] of houses) {
      const y = g(x);
      ctx.rect(x - w / 2, y - h * rise, w, h * rise + 4);
      if (rt(k + 340) < 0.45) ctx.rect(x - w * 0.3, y - h * rise - 7 * u * rise, w * 0.45, 8 * u * rise);
    }
    // 殿北的高楼（桌面：台基右边；手机：地窄，不画）
    if (!phone()) {
      const ax = xR + 30 * u, ay = g(ax), aw = 44 * u, ah = 46 * u * rise;
      ctx.rect(ax - aw / 2, ay - ah, aw, ah + 4);
      for (const d of [-1, 1]) ctx.rect(ax + d * aw / 2 - 5 * u, ay - ah - 14 * u * rise, 10 * u, ah + 14 * u * rise + 4);
    }
    ctx.fill();
    // 房屋背光的一面、窗
    ctx.fillStyle = tc(shadeC, 0.55);
    ctx.beginPath();
    for (const [x, w, h] of houses) { const y = g(x); ctx.rect(sunL ? x + w * 0.2 : x - w / 2, y - h * rise, w * 0.3, h * rise); }
    ctx.fill();
    ctx.fillStyle = tc(dark, 0.8);
    ctx.beginPath();
    for (const [x, w, h, k] of houses) { const y = g(x); if (rt(k + 350) < 0.7) ctx.rect(x - w * 0.12, y - h * rise * 0.72, 2.6 * u, 3.2 * u); }
    ctx.fill();
    // 2) 台基：宽大的挡土墙（左角临谷，最高），上面一层内院的台阶
    ctx.fillStyle = tc(stone, 1, 0.03);
    ctx.beginPath();
    // 两端层层的台阶：底下一层最宽
    const gl = g(xL), gr = g(xR), ls = k => Math.max(yT + 2 * u, gl - k * u), rs = k => Math.max(yT + 2 * u, gr - k * u);
    ctx.moveTo(xL - 9 * u, g(xL - 9 * u) + 4);
    ctx.lineTo(xL - 9 * u, ls(8)); ctx.lineTo(xL - 4.5 * u, ls(8)); ctx.lineTo(xL - 4.5 * u, ls(16)); ctx.lineTo(xL, ls(16));
    ctx.lineTo(xL, yT);
    ctx.lineTo(xR, yT);
    ctx.lineTo(xR, rs(16)); ctx.lineTo(xR + 4.5 * u, rs(16)); ctx.lineTo(xR + 4.5 * u, rs(8)); ctx.lineTo(xR + 9 * u, rs(8));
    ctx.lineTo(xR + 9 * u, g(xR + 9 * u) + 4);
    for (let i = 14; i >= 0; i--) { const x = lerp(xL - 9 * u, xR + 9 * u, i / 14); ctx.lineTo(x, Math.max(g(x) + 4, yT + 4 * u)); }
    ctx.closePath(); ctx.fill();
    // 挡土墙上的石层（大块的方石）
    ctx.strokeStyle = tc(shadeC, 0.45);
    ctx.lineWidth = Math.max(0.5, 0.7 * u);
    ctx.beginPath();
    for (let j = 1; j < 5; j++) {
      const yy = yT + j * 6 * u;
      let xa = null;
      for (let i = 0; i <= 12; i++) { const x = lerp(xL, xR, i / 12); if (yy < g(x)) { if (xa == null) { ctx.moveTo(x, yy); xa = x; } else ctx.lineTo(x, yy); } }
      for (let i = 0; i < 10; i++) { const x = xL + ((i + (j % 2) * 0.5) / 10) * (xR - xL); if (yy + 6 * u < g(x)) { ctx.moveTo(x, yy); ctx.lineTo(x, yy + 6 * u); } }
    }
    ctx.stroke();
    // 3) 殿身：内院的一层台基，高大的殿（门廊的门、金的檐、檐上的尖）
    const sx0 = tx + hw * 0.12, sw2 = 48 * u, sh = 48 * u * rise, sb = yT - 8 * u * rise;
    ctx.fillStyle = tc(stone, 1, 0.05);
    ctx.fillRect(tx - hw * 0.55, sb, hw * 1.25, 8 * u * rise + 1);
    // 殿身两旁较低的旁屋（殿的轮廓成了当中高、两肩低）
    ctx.fillStyle = tc(stoneD, 1, 0.04);
    ctx.fillRect(sx0 - sw2 - 13 * u, sb - sh * 0.6, sw2 * 2 + 26 * u, sh * 0.6 + 1);
    ctx.fillStyle = tc(stone, 1, 0.05);
    ctx.fillRect(sx0 - sw2, sb - sh, sw2 * 2, sh + 1);
    // 殿身背光的一面
    ctx.fillStyle = tc(shadeC, 0.5);
    ctx.fillRect(sunL ? sx0 + sw2 * 0.55 : sx0 - sw2, sb - sh, sw2 * 0.45, sh);
    // 门廊的门（深）与金的门框
    ctx.fillStyle = tc(dark);
    ctx.fillRect(sx0 - 8 * u, sb - sh * 0.62, 16 * u, sh * 0.62);
    ctx.fillStyle = tc(gold, 1, 0.1);
    ctx.fillRect(sx0 - 10 * u, sb - sh * 0.62 - 2.4 * u, 20 * u, 2.4 * u);
    ctx.fillRect(sx0 - 10 * u, sb - sh * 0.62, 2 * u, sh * 0.62);
    ctx.fillRect(sx0 + 8 * u, sb - sh * 0.62, 2 * u, sh * 0.62);
    // 金的檐与檐上的尖
    ctx.fillRect(sx0 - sw2 - 2 * u, sb - sh - 3 * u, sw2 * 2 + 4 * u, 3 * u);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const x = sx0 - sw2 + (i / 12) * sw2 * 2; ctx.moveTo(x - 0.8 * u, sb - sh - 3 * u); ctx.lineTo(x, sb - sh - 6.5 * u); ctx.lineTo(x + 0.8 * u, sb - sh - 3 * u); }
    ctx.fill();
    // 4) 四围的廊子：台基前沿的一排柱廊（所罗门廊）
    const ph = 13 * u * rise, pxa = xL + pinW() * 0.9, pxb = xR - 3 * u;
    ctx.fillStyle = tc(stone, 1, 0.04);
    ctx.fillRect(pxa, yT - ph, pxb - pxa, 3 * u);
    ctx.fillStyle = tc(dark, 0.55);
    ctx.fillRect(pxa, yT - ph + 3 * u, pxb - pxa, ph - 3 * u);
    ctx.fillStyle = tc(stone, 1, 0.04);
    const nC = Math.max(6, Math.round((pxb - pxa) / (8 * u)));
    for (let i = 0; i <= nC; i++) ctx.fillRect(lerp(pxa, pxb, i / nC) - 1.3 * u, yT - ph + 3 * u, 2.6 * u, ph - 3 * u);
    // 5) 殿顶：台基临谷的一角，从廊子上升起的角楼（比殿身还高）
    const pt = pinTop(), pw = pinW(), gb = g(pt[0]) + 4;
    ctx.fillStyle = tc(stone, 1, 0.07);
    ctx.beginPath();
    ctx.moveTo(pt[0] - pw * 0.5, gb);
    ctx.lineTo(pt[0] - pw * 0.5, pt[1] + pw * 0.3);
    ctx.lineTo(pt[0] - pw * 0.62, pt[1] + pw * 0.3);
    ctx.lineTo(pt[0] - pw * 0.62, pt[1]);
    ctx.lineTo(pt[0] + pw * 0.62, pt[1]);
    ctx.lineTo(pt[0] + pw * 0.62, pt[1] + pw * 0.3);
    ctx.lineTo(pt[0] + pw * 0.5, pt[1] + pw * 0.3);
    ctx.lineTo(pt[0] + pw * 0.5, gb);
    ctx.closePath(); ctx.fill();
    // 角楼背光的一面、窄窗
    ctx.fillStyle = tc(shadeC, 0.55);
    ctx.fillRect(sunL ? pt[0] + pw * 0.08 : pt[0] - pw * 0.5, pt[1] + pw * 0.34, pw * 0.42, gb - pt[1] - pw * 0.34);
    ctx.fillStyle = tc(dark, 0.85);
    for (let i = 0; i < 3; i++) ctx.fillRect(pt[0] - 1.2 * u, pt[1] + pw * 0.7 + i * (gb - pt[1]) * 0.22, 2.4 * u, 5 * u);
    // 6) 城墙（在前）：带垛口，几座城楼
    ctx.fillStyle = tc(stoneD, 1, 0.02);
    ctx.beginPath();
    const n = 22, wh = 10 * u * rise;
    for (let i = 0; i < n; i++) {
      const xa = lerp(T0.w0, T0.w1, i / n) * W.w, xb = lerp(T0.w0, T0.w1, (i + 1) / n) * W.w;
      const ya = g(xa), yb = g(xb);
      ctx.moveTo(xa, ya + 6); ctx.lineTo(xa, ya - wh); ctx.lineTo(xb, yb - wh); ctx.lineTo(xb, yb + 6); ctx.closePath();
      if (i % 2 === 0) ctx.rect(xa, Math.min(ya, yb) - wh - 3 * u, (xb - xa) * 0.45, 3 * u);
      if (i % 6 === 1) ctx.rect(xa - 5 * u, ya - wh - 8 * u * rise, 10 * u, wh + 8 * u * rise + 6);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    // 冷的光：迎着天光的边发白，角楼与殿身周围一团清冷的光（像一个异象）
    ctx.strokeStyle = rgba([214, 228, 255], 0.55 * A);
    ctx.lineWidth = Math.max(0.7, 1.1 * u);
    ctx.beginPath();
    ctx.moveTo(pt[0] - pw * 0.62, pt[1]); ctx.lineTo(pt[0] + pw * 0.62, pt[1]);
    ctx.moveTo(pt[0] - pw * 0.5, pt[1] + pw * 0.3); ctx.lineTo(pt[0] - pw * 0.5, gb - 4);
    ctx.moveTo(sx0 - sw2 - 2 * u, sb - sh - 3 * u); ctx.lineTo(sx0 + sw2 + 2 * u, sb - sh - 3 * u);
    ctx.moveTo(xL, yT); ctx.lineTo(xR, yT);
    ctx.stroke();
    if (SP) {
      const H = pinH();
      ctx.globalCompositeOperation = 'lighter';
      glowE(ctx, SP.cold, pt[0], pt[1] + H * 0.25, H * 0.55, H * 0.8, 0.34 * A);
      glowE(ctx, SP.pale, sx0, sb - sh * 0.6, sw2 * 2.4, sh * 1.3, 0.2 * A);
      glowE(ctx, SP.cold, tx, yT, hw * 1.5, sh * 1.1, 0.16 * A);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  开了的天：云向两边分开，一道光的门，光芒，光柱落在他身上
  // ════════════════════════════════════════════════════════════
  let RIFT = { x: 0.68, id: 'jesus' };
  function riftPt() {
    const p = figPt(RIFT.id, 1);
    const x = p ? p[0] + W.w * at(0.015, 0.02) : RIFT.x * W.w;
    return [clamp(x, W.w * 0.2, W.w * 0.86), W.h * at(0.24, 0.46)];
  }
  // 开了的天：一圈云向四面退开，当中是柔和的光；几道光自那里斜斜地落到地上
  function drawRift(ctx) {
    const k = L('bpOpen');
    if (k < 0.01 || !SP) return;
    const [x, y] = riftPt(), m = M(), e = ss(0, 1, k);
    const rx = m * at(0.12, 0.2) * (0.35 + 0.65 * e), ry = m * at(0.05, 0.075) * (0.35 + 0.65 * e);
    const day = 0.55 + 0.45 * W.daylight;
    // 光（在云之后）
    ctx.globalCompositeOperation = 'lighter';
    glowE(ctx, SP.gold, x, y, rx * 3, ry * 4.4, 0.3 * k);
    glowE(ctx, SP.white, x, y, rx * 1.2, ry * 2.2, 0.55 * k);
    glowE(ctx, SP.pale, x, y + ry * 0.4, rx * 0.55, ry * 2.4, 0.4 * k);
    // 斜落的光：自开了的天向地上散开
    for (let i = 0; i < 7; i++) {
      const tx = x + (i - 3) * W.w * 0.05 + Math.sin(W.t * 0.2 + i) * 4, ty = W.h * 0.86;
      const dx = tx - x, dy = ty - y, len = Math.hypot(dx, dy) || 1, w = rx * (0.35 + 0.2 * rt(i + 470));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(-dx, dy));
      ctx.globalAlpha = 0.07 * k * (0.7 + 0.3 * Math.sin(W.t * 0.5 + i * 1.3));
      ctx.drawImage(SP.beam, -w / 2, ry * 0.2, w, len * 0.95);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 云：左右两堆，像幔子一样向两边退开；上下几片薄云；朝光的一边被照亮
    for (let i = 0; i < 26; i++) {
      const side = i % 2 ? 1 : -1, j = (i >> 1) / 12;
      const vy = (rt(i + 480) * 2 - 1) * 1.35, cone = 1 - Math.min(1, Math.abs(vy)) * 0.35;
      const px = x + side * (rx * (0.75 + 0.55 * e) * cone + j * m * 0.05 + rt(i + 490) * m * 0.02);
      const py = y + vy * ry * 1.3;
      const r = m * (0.028 + 0.03 * rt(i + 500)) * (0.8 + 0.2 * e);
      glowE(ctx, SP.cloud, px, py, r * 1.7, r * 0.85, 0.42 * k * day * (1 - j * 0.4));
    }
    for (let i = 0; i < 6; i++) {
      const px = x + (rt(i + 520) - 0.5) * rx * 1.4, py = y + (i % 2 ? 1 : -1) * ry * (1.35 + 0.3 * rt(i + 530));
      const r = m * (0.022 + 0.015 * rt(i + 540));
      glowE(ctx, SP.cloud, px, py, r * 1.8, r * 0.7, 0.3 * k * day);
    }
    // 云边被照亮
    ctx.globalCompositeOperation = 'lighter';
    glowE(ctx, SP.gold, x - rx * 0.8, y, rx * 0.5, ry * 1.4, 0.18 * k);
    glowE(ctx, SP.gold, x + rx * 0.8, y, rx * 0.5, ry * 1.4, 0.18 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 自开了的天落在他身上的光
  function drawBeam(ctx) {
    const k = L('bpBeam');
    if (k < 0.01 || !SP) return;
    const p = figPt(RIFT.id, 0.5);
    if (!p) return;
    const [rx, ry] = riftPt(), h = PH(2), w = h * 1.3;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 光柱自开了的天当中稍上处起（在云光之内渐渐显出，不留平平的一道顶）
    const dx = p[0] - rx, dy = p[1] + h * 0.55 - ry, len = Math.hypot(dx, dy) || 1, up = M() * at(0.05, 0.075) * 0.9;
    ctx.translate(rx, ry);
    ctx.rotate(Math.atan2(-dx, dy));
    ctx.globalAlpha = 0.45 * k;
    ctx.drawImage(SP.beam, -w / 2, -up, w, len + up);
    ctx.globalAlpha = 0.22 * k;
    ctx.drawImage(SP.beam, -w * 1.5, -up, w * 3, len + up);
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], h * 1.3, 0.35 * k);
    glowE(ctx, SP.gold, p[0], p[1] + h * 0.5, h * 1.6, h * 0.3, 0.4 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光的鸽子：自开了的天降下，落在他身上（3:16）
  // ════════════════════════════════════════════════════════════
  function dovePos(k) {
    const [rx, ry] = riftPt();
    const hp = figPt('jesus', 1);
    if (!hp) return null;
    const ex = hp[0] + PH(2) * 0.05, ey = hp[1] - PH(2) * 0.3;
    const e = ease(k);
    // 一道缓缓的 S 形：先向外飘，再回到他头上
    const sx = Math.sin(e * Math.PI) * W.w * at(0.05, 0.1) * (1 - e);
    return [lerp(rx, ex, e) + sx, lerp(ry + M() * 0.04, ey, e), e];
  }
  function drawDoveShape(ctx, x, y, s, flap, a, rot, facing) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(facing, 1);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, 0, 0, s * 4.2, 0.28 * a);
    glowSp(ctx, SP.white, 0, 0, s * 1.9, 0.55 * a);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgb(255,253,246)';
    // 远翼
    const up = 0.5 + 0.5 * Math.sin(flap), up2 = 0.5 + 0.5 * Math.sin(flap + 0.35);
    ctx.globalAlpha = a * 0.75;
    ctx.beginPath();
    ctx.moveTo(s * 0.12, -s * 0.08);
    ctx.quadraticCurveTo(s * 0.1, -s * (0.55 + 0.45 * up2), -s * 0.32, -s * (0.25 + 0.95 * up2));
    ctx.quadraticCurveTo(-s * 0.25, -s * (0.1 + 0.4 * up2), -s * 0.28, -s * 0.02);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = a;
    // 身、头、尾
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.52, s * 0.2, -0.08, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.5, -s * 0.12, s * 0.15, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.62, -s * 0.13); ctx.lineTo(s * 0.8, -s * 0.07); ctx.lineTo(s * 0.62, -s * 0.05); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.04); ctx.lineTo(-s * 0.92, -s * 0.2); ctx.lineTo(-s * 0.95, s * 0.1); ctx.closePath(); ctx.fill();
    // 近翼
    ctx.beginPath();
    ctx.moveTo(s * 0.18, -s * 0.05);
    ctx.quadraticCurveTo(s * 0.28, -s * (0.5 + 0.5 * up), -s * 0.18, -s * (0.3 + 1.05 * up));
    ctx.quadraticCurveTo(-s * 0.12, -s * (0.1 + 0.45 * up), -s * 0.2, s * 0.04);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawDove(ctx) {
    const a = L('bpDoveA');
    if (a < 0.01 || !SP) return;
    const k = L('bpDove');
    const q = dovePos(k);
    if (!q) return;
    const s = PH(2) * 0.36, landed = ss(0.93, 1, k);
    // 降下时双翼缓缓地扇；落定之后收拢，只轻轻地颤
    const flap = W.t * (5.2 - 3.2 * landed) + 0.4;
    const q2 = dovePos(Math.min(1, k + 0.02));
    const dx = q2 ? q2[0] - q[0] : 0, facing = dx < -0.2 ? -1 : 1;
    const rot = lerp(0.55, 0.05, landed) * facing;
    const bob = Math.sin(W.t * 1.3) * PH(2) * 0.03 * (1 - landed);
    const s2 = s * lerp(1, 0.9, landed);
    const flapK = landed > 0.5 ? -1.2 + 0.25 * Math.sin(W.t * 2.1) : flap;
    drawDoveShape(ctx, q[0], q[1] + bob, s2, flapK, a, rot, facing);
  }

  // ════════════════════════════════════════════════════════════
  //  旷野：石头（4:3，泛着饼的虚光）
  // ════════════════════════════════════════════════════════════
  const STONES = [[-0.07, 0.52, 1.1], [-0.045, 0.16, 0.8], [-0.02, 0.62, 0.9], [0.028, 0.58, 1.2], [0.055, 0.22, 0.85], [0.075, 0.46, 1], [0.1, 0.1, 0.7], [-0.095, 0.3, 0.75], [0.12, 0.36, 0.9]];
  function drawStones(ctx) {
    const A = L('bpStones');
    if (A < 0.01) return;
    const s = LS(2), loaf = L('bpLoaf');
    ctx.globalAlpha = A;
    for (let i = 0; i < STONES.length; i++) {
      const q = STONES[i], xf = S.stones + q[0] * at(1, 1.6);
      if (xf < 0.36 || xf > 0.99) continue;
      // 虚光在每块石头上闪烁不定（假的光：一明一暗，不安稳）
      const fl = loaf > 0.02 ? clamp(0.72 + 0.28 * Math.sin(W.t * 2.3 + i * 1.7) * Math.sin(W.t * 5.3 + i * 0.9) + 0.12 * Math.sin(W.t * 0.8 + i), 0.35, 1.1) : 0;
      const lf = loaf * fl;
      const x = xf * W.w, y = fieldY(xf, q[1]), r = 6.5 * s * q[2] * (1 + 0.35 * q[1]) * (1 + 0.14 * loaf);
      // 石头 → 像饼：更圆、更鼓，颜色成了烤过的饼皮
      const base = mix3([132, 118, 100], [226, 178, 110], loaf * 0.9);
      const dome = 0.85 + 0.25 * loaf;
      ctx.globalAlpha = A;
      ctx.fillStyle = css(base, 2, 1, 0.12 * lf);
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.25, r * dome, 0, Math.PI, 0); ctx.lineTo(x + r * 1.25, y + r * 0.2); ctx.lineTo(x - r * 1.25, y + r * 0.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css(mix3([90, 80, 70], [170, 112, 60], loaf), 2, 0.45);
      ctx.beginPath(); ctx.ellipse(x + r * 0.35, y - r * 0.1, r * 0.8, r * 0.5, 0, 0, Math.PI); ctx.fill();
      if (loaf > 0.05) {
        // 饼上的一道道裂口（像烤出来的）
        ctx.strokeStyle = css([150, 96, 52], 2, 0.7 * loaf);
        ctx.lineWidth = Math.max(0.5, 0.7 * s);
        ctx.beginPath();
        for (let j = -1; j <= 1; j++) { ctx.moveTo(x + j * r * 0.45 - r * 0.12, y - r * dome * 0.62); ctx.lineTo(x + j * r * 0.45 + r * 0.14, y - r * dome * 0.28); }
        ctx.stroke();
      }
      ctx.strokeStyle = css([236, 220, 190], 2, 0.45 * W.daylight + 0.3 * loaf, 0.1);
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r * dome * 0.94, 0, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
      if (loaf > 0.02 && SP) {
        // 虚光：像饼一样的暖光，金色的边——不是真的
        ctx.strokeStyle = rgba([255, 214, 120], A * 0.85 * lf);
        ctx.lineWidth = Math.max(0.8, 1.3 * s);
        ctx.beginPath(); ctx.ellipse(x, y, r * 1.27, r * dome * 1.02, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        glowE(ctx, SP.warm, x, y - r * 0.35, r * 2.6, r * 1.7, 0.7 * lf);
        glowSp(ctx, SP.gold, x, y - r * 0.5, r * 1.1, 0.45 * lf);
        // 慢慢掠过的一道亮光
        const sh = U.fract(W.t * 0.23 + rt(i + 560));
        glowE(ctx, SP.gold, x + (sh * 2 - 1) * r * 1.1, y - r * dome * 0.6, r * 0.45, r * 0.3, 0.5 * lf * Math.sin(Math.PI * sh));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = A;
    // 旷野的枯枝与小石
    ctx.strokeStyle = css([96, 80, 62], 2);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const xf = 0.48 + 0.5 * rt(i + 520), y = fieldY(xf, 0.05 + 0.5 * rt(i + 530)), h = (4 + 5 * rt(i + 540)) * s;
      ctx.moveTo(xf * W.w, y); ctx.lineTo(xf * W.w - h * 0.3, y - h); ctx.moveTo(xf * W.w, y - h * 0.4); ctx.lineTo(xf * W.w + h * 0.4, y - h * 0.9);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  试探人的：只是一团冷而暗的烟影（无形无貌），终必退散
  // ════════════════════════════════════════════════════════════
  let shX = 2.6;          // 画面上的偏移（缓动）；目标是 S.shDx（以人高计，正 = 在他右边）
  function drawShadow(ctx) {
    const k = L('bpShadow');
    if (k < 0.01 || !SP) return;
    const f = fig('jesus');
    if (!f || !f._vis) return;
    const h = f._h || PH(2), x0 = f._x + shX * h, y0 = f._y;
    const nk = nightK();
    // 暗的烟：一层层叠起，缓缓地卷动（无形无貌）
    for (let i = 0; i < 10; i++) {
      const up = i / 9, sway = Math.sin(W.t * 0.7 + i * 0.9) * h * 0.16 * (0.4 + up);
      const bx = x0 + sway + Math.sin(W.t * 0.31 + i * 2.1) * h * 0.07, by = y0 - h * (0.05 + up * 1.3);
      const r = h * (0.72 - up * 0.3) * (1 + 0.08 * Math.sin(W.t * 1.1 + i));
      glowE(ctx, SP.veil, bx, by, r, r * 1.2, k * (0.5 + 0.16 * (1 - up)) * (1 - 0.3 * nk));
    }
    // 冷的边：夜里也看得出那是一团冷雾
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const up = i / 3, bx = x0 + Math.sin(W.t * 0.6 + i * 1.7) * h * 0.2, by = y0 - h * (0.2 + up * 1.1);
      glowE(ctx, SP.cold, bx, by, h * 0.6, h * 0.8, k * (0.06 + 0.16 * nk + 0.1 * L('bpCold')));
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  最高的山（4:8）与万国的荣华（远处的金光）
  // ════════════════════════════════════════════════════════════
  const CRAG_PTS = [[-1, 0], [-0.8, 0.12], [-0.62, 0.2], [-0.5, 0.36], [-0.34, 0.44], [-0.24, 0.62], [-0.14, 0.72], [-0.06, 0.94], [0.02, 1], [0.1, 0.98],
    [0.16, 0.84], [0.26, 0.74], [0.36, 0.56], [0.5, 0.46], [0.62, 0.3], [0.78, 0.18], [1, 0]];
  const cragH = () => W.h * at(0.34, 0.3);
  const cragHW = () => W.w * at(0.1, 0.19);
  function cragTop() {
    const cx = at(X.crag, 0.76) * W.w, gc = gY(2, at(X.crag, 0.76)) + 3, k = ss(0, 1, L('bpCrag'));
    return [cx + 0.05 * cragHW(), gc - cragH() * (0.4 + 0.6 * k) * 0.995];
  }
  function drawCrag(ctx) {
    const A = L('bpCrag');
    if (A < 0.01) return;
    const cx = at(X.crag, 0.76) * W.w, gc = gY(2, at(X.crag, 0.76)) + 3, hw = cragHW(), H = cragH() * (0.4 + 0.6 * ss(0, 1, A)), s = LS(2);
    ctx.globalAlpha = Math.min(1, A * 1.3);
    const top = [180, 164, 142], bot = [104, 92, 80];
    ctx.fillStyle = gcache('crag|' + Math.round(H) + '|' + qc(W.shade(top, 0.1)) + '|' + Math.round(gc), () => {
      const g = ctx.createLinearGradient(0, gc - H, 0, gc);
      g.addColorStop(0, css(top, 2, 1, 0.02)); g.addColorStop(0.6, css([140, 126, 110], 2)); g.addColorStop(1, css(bot, 2));
      return g;
    });
    ctx.beginPath();
    CRAG_PTS.forEach((q, i) => { const x = cx + q[0] * hw, y = Math.min(gY(2, x / W.w) + 6, gc - q[1] * H); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
    for (let i = 8; i >= 0; i--) { const x = cx - hw + (2 * hw * i) / 8; ctx.lineTo(x, gY(2, x / W.w) + 8); }
    ctx.closePath(); ctx.fill();
    // 背光的一面
    const litLeft = (W.sun ? W.sun.x : W.w * 0.3) < cx;
    const d = litLeft ? 1 : -1;
    ctx.fillStyle = css([70, 62, 56], 2, 0.45);
    ctx.beginPath();
    ctx.moveTo(cx + 0.03 * hw, gc - H * 0.99);
    for (let i = 0; i < CRAG_PTS.length; i++) {
      const q = CRAG_PTS[i];
      if (Math.sign(q[0]) !== d && Math.abs(q[0]) > 0.03) continue;
      ctx.lineTo(cx + q[0] * hw, gc - q[1] * H);
    }
    ctx.lineTo(cx + d * hw, gY(2, (cx + d * hw) / W.w) + 8);
    ctx.quadraticCurveTo(cx + d * 0.2 * hw, gc - H * 0.35, cx + 0.03 * hw, gc - H * 0.99);
    ctx.fill();
    // 岩层与裂纹
    ctx.strokeStyle = css([72, 64, 58], 2, 0.6);
    ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const u = rt(i + 600) * 1.4 - 0.7, hk = 0.1 + 0.7 * rt(i + 610);
      const edge = Math.max(0, 1 - Math.abs(u) * 1.1);
      if (hk > edge) continue;
      const x = cx + u * hw, y = gc - hk * H;
      ctx.moveTo(x - 8 * s, y + 2 * s); ctx.quadraticCurveTo(x, y - 2 * s, x + 9 * s, y + 1 * s);
    }
    ctx.stroke();
    // 迎光的山脊
    ctx.strokeStyle = css([236, 220, 190], 2, 0.45 * (0.25 + 0.75 * W.daylight) + 0.15 * nightK() * W.lv.moon, 0.2);
    ctx.lineWidth = Math.max(0.7, 1.4 * s);
    ctx.beginPath();
    let first = true;
    for (const q of CRAG_PTS) {
      if (q[0] * -d < -0.05) continue;
      const x = cx + q[0] * hw, y = gc - q[1] * H;
      if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 万国：远处地上一簇簇的城，塔、圆顶，金光闪烁（虚的荣华）
  const KINGS = [[0.14, 0.9], [0.23, 1.15], [0.31, 0.85], [0.4, 1.25], [0.49, 0.95], [0.58, 1.1], [0.67, 0.9]];
  function drawKingdoms(ctx) {
    const A = L('bpKing');
    if (A < 0.01 || !SP) return;
    const s = LS(0) * at(2.6, 3.4);
    // 地平线上一道金色的雾
    ctx.globalCompositeOperation = 'lighter';
    const hy = W.horizonY + (W.waterlineY(0) - W.horizonY) * 0.4;
    glowE(ctx, SP.gold, W.w * 0.42, hy, W.w * 0.42, W.h * 0.05, 0.28 * A);
    ctx.globalCompositeOperation = 'source-over';
    for (let c = 0; c < KINGS.length; c++) {
      const [xf, sz] = KINGS[c];
      const cx = xf * W.w, g = Math.min(gY(0, xf), W.waterlineY(0)) + 1;
      if (!isFinite(g)) continue;
      const k = A * (0.75 + 0.25 * Math.sin(W.t * 1.3 + c * 1.7));
      // 塔与圆顶的剪影
      ctx.globalAlpha = A;
      ctx.fillStyle = css([150, 118, 74], 0, 1, 0.15 + 0.35 * A);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const x = cx + (i - 3) * 6 * s * sz, h = (8 + 16 * rt(c * 11 + i)) * s * sz, w = (3.6 + 2.6 * rt(c * 11 + i + 5)) * s * sz;
        ctx.rect(x - w / 2, g - h, w, h);
        if (i % 2 === 0) { ctx.moveTo(x + w * 0.85, g - h); ctx.arc(x, g - h, w * 0.85, 0, Math.PI, true); }
        else { ctx.moveTo(x - w * 0.5, g - h); ctx.lineTo(x, g - h - w * 1.4); ctx.lineTo(x + w * 0.5, g - h); }
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      glowE(ctx, SP.gold, cx, g - 10 * s * sz, 40 * s * sz, 20 * s * sz, 0.5 * k);
      glowSp(ctx, SP.warm, cx, g - 6 * s * sz, 26 * s * sz, 0.35 * k);
      for (let i = 0; i < 10; i++) {
        const x = cx + (rt(c * 13 + i + 100) - 0.5) * 40 * s * sz, y = g - (2 + 22 * rt(c * 13 + i + 120)) * s * sz;
        glowSp(ctx, SP.gold, x, y, (1.6 + 1.2 * Math.sin(W.t * 4 + i + c)) * s * sz, 0.9 * k);
      }
      // 海上的倒影
      glowE(ctx, SP.gold, cx, g + 8 * s * sz, 18 * s * sz, 3 * s * sz, 0.25 * k);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  房屋（住处、迦拿、迦百农）
  // ════════════════════════════════════════════════════════════
  const WARM = [255, 206, 130];
  function drawHouse(ctx, xf, v, w, h, a, lit, rgb, seed) {
    const s = LS(2), x = xf * W.w, gy = fieldY(xf, v) + 2 * s;
    ctx.globalAlpha = a;
    ctx.fillStyle = css(rgb, 2);
    ctx.fillRect(x - w / 2, gy - h, w, h);
    const sunL = W.sun && W.sun.x < x;
    ctx.fillStyle = css(mix3(rgb, [40, 36, 34], 0.35), 2);
    if (sunL) ctx.fillRect(x + w * 0.2, gy - h, w * 0.3, h); else ctx.fillRect(x - w / 2, gy - h, w * 0.3, h);
    ctx.fillStyle = css(mix3(rgb, [60, 50, 40], 0.3), 2);
    ctx.fillRect(x - w * 0.55, gy - h - 2.4 * s, w * 1.1, 2.8 * s);
    // 门与窗：夜里亮灯
    const dx = (rt(seed) - 0.5) * w * 0.4;
    ctx.fillStyle = css([54, 42, 34], 2);
    ctx.fillRect(x + dx - w * 0.09, gy - h * 0.52, w * 0.18, h * 0.52);
    const wx = x - dx * 0.6 + (dx > 0 ? -w * 0.22 : w * 0.18), wy = gy - h * 0.7;
    const on = lit * (0.2 + 0.8 * nightK());
    ctx.fillStyle = on > 0.15 ? rgba(WARM, a * Math.min(1, on * 1.3)) : css([54, 42, 34], 2);
    ctx.fillRect(wx - 1.7 * s, wy - 1.9 * s, 3.4 * s, 3.6 * s);
    ctx.fillStyle = css([255, 236, 204], 2, a * 0.45 * W.daylight);
    ctx.fillRect(x - w * 0.55, gy - h - 2.4 * s, w * 1.1, 0.8);
    ctx.globalAlpha = 1;
    return { wx, wy, on, door: [x + dx, gy - h * 0.25] };
  }
  // 耶稣的住处（约 1:39）：一间小屋，门里一盏灯
  function drawDwelling(ctx) {
    const A = L('bpDwell');
    if (A < 0.01) return;
    const s = LS(2), r = drawHouse(ctx, X.dwell, 0.02, 34 * s, 24 * s, A, 0.4, [168, 146, 116], 7);
    const lp = L('bpLamp');
    if (lp > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, r.door[0], r.door[1], 16 * s, 0.6 * lp * A);
      glowSp(ctx, SP.gold, r.door[0], r.door[1], 5 * s, 0.9 * lp * A);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 无花果树（约 1:48）：粗短的干，宽大的叶
  function drawFig(ctx) {
    const A = L('bpFig');
    if (A < 0.01) return;
    const s = LS(2), xf = at(X.fig, 0.9), x = xf * W.w, y = fieldY(xf, 0.03), h = PH(2) * 1.75;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([82, 64, 48], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(2, 4.5 * s);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 3 * s, y - h * 0.3, x - 1 * s, y - h * 0.5); ctx.stroke();
    ctx.lineWidth = Math.max(1.2, 2.4 * s);
    ctx.beginPath();
    ctx.moveTo(x - 1 * s, y - h * 0.48); ctx.quadraticCurveTo(x - h * 0.2, y - h * 0.62, x - h * 0.36, y - h * 0.62);
    ctx.moveTo(x - 1 * s, y - h * 0.48); ctx.quadraticCurveTo(x + h * 0.18, y - h * 0.66, x + h * 0.34, y - h * 0.6);
    ctx.moveTo(x - 1 * s, y - h * 0.5); ctx.lineTo(x + 2 * s, y - h * 0.78);
    ctx.stroke();
    // 叶冠：一片片宽大的叶
    const leaf = [[-0.34, 0.66, 0.2], [-0.2, 0.8, 0.22], [0, 0.9, 0.24], [0.2, 0.8, 0.22], [0.34, 0.66, 0.2], [-0.1, 0.66, 0.2], [0.12, 0.64, 0.2], [-0.26, 0.54, 0.14], [0.28, 0.52, 0.14]];
    for (const [dx, dy, r] of leaf) {
      ctx.fillStyle = css(dy > 0.75 ? [78, 116, 62] : [58, 92, 50], 2);
      ctx.beginPath(); ctx.ellipse(x + dx * h, y - dy * h, r * h, r * h * 0.72, 0, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css([120, 150, 86], 2, 0.5 * W.daylight);
    ctx.beginPath(); ctx.ellipse(x - 0.05 * h, y - 0.96 * h, 0.16 * h, 0.06 * h, 0, Math.PI, 0); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 迦拿：娶亲的家（平顶、楼上的一间）、院墙、喜棚、灯串
  const houseX = () => at(X.house, 0.86);
  const awnX = () => houseX() - at(0.075, 0.15);
  function lanternPts() {
    const s = LS(2), out = [], sw = phone() ? 1.4 : 1;
    const hx = houseX() * W.w - 30 * s * sw, hy = fieldY(houseX(), 0) - 34 * s * sw;
    const px = awnX() * W.w, py = fieldY(awnX(), 0.16) - 36 * s * sw;
    const qx = at(0.745, 0.6) * W.w, qy = fieldY(at(0.745, 0.6), 0.1) - 30 * s * sw;
    for (const [ax, ay, bx, by] of [[qx, qy, px, py], [px, py, hx, hy]]) {
      for (let i = 1; i < 5; i++) { const t = i / 5; out.push([lerp(ax, bx, t), lerp(ay, by, t) + Math.sin(Math.PI * t) * 7 * s * sw]); }
    }
    return out;
  }
  function drawCana(ctx) {
    const A = L('bpCana');
    if (A < 0.01) return;
    const s = LS(2), sw = phone() ? 1.4 : 1;
    // 低低的院墙
    ctx.globalAlpha = A;
    ctx.fillStyle = css([170, 150, 120], 2);
    const w0 = at(0.76, 0.62), w1 = 1.02;
    ctx.beginPath();
    for (let i = 0; i <= 14; i++) { const xf = lerp(w0, w1, i / 14), y = gY(2, xf) - 6 * s * sw; if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = 14; i >= 0; i--) { const xf = lerp(w0, w1, i / 14); ctx.lineTo(xf * W.w, gY(2, xf) + 2); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([236, 220, 190], 2, 0.4 * W.daylight + 0.1, 0.1);
    for (let i = 0; i < 14; i++) { const xf = lerp(w0, w1, i / 14); ctx.fillRect(xf * W.w, gY(2, xf) - 6.5 * s * sw, (w1 - w0) * W.w / 14 - 1, 1); }
    ctx.globalAlpha = 1;
    // 家：两层、平顶；楼上的一间；门里透出筵席的光
    const hx = houseX();
    const r = drawHouse(ctx, hx, 0, 64 * s * sw, 40 * s * sw, A, 1, [196, 176, 142], 3);
    const ux = hx * W.w - 14 * s * sw, uy = fieldY(hx, 0) + 2 * s - 40 * s * sw;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([186, 166, 134], 2);
    ctx.fillRect(ux - 14 * s * sw, uy - 17 * s * sw, 28 * s * sw, 17 * s * sw);
    ctx.fillStyle = css([150, 124, 96], 2);
    ctx.fillRect(ux - 16 * s * sw, uy - 19 * s * sw, 32 * s * sw, 2.4 * s);
    ctx.globalAlpha = 1;
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, r.door[0], r.door[1], 14 * s * sw, 0.5 * A * (0.4 + 0.6 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    // 喜棚：两根杆撑起的一幅布，边上红与蓝
    const ax = awnX() * W.w, ab = fieldY(awnX(), 0.16), ah = 36 * s * sw;
    const hx0 = hx * W.w - 32 * s * sw, hy0 = fieldY(hx, 0) - 30 * s * sw;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([86, 64, 46], 2);
    ctx.lineWidth = Math.max(1, 1.6 * s * sw);
    ctx.beginPath(); ctx.moveTo(ax, ab); ctx.lineTo(ax, ab - ah); ctx.stroke();
    const qx = at(0.745, 0.6) * W.w, qb = fieldY(at(0.745, 0.6), 0.1);
    ctx.beginPath(); ctx.moveTo(qx, qb); ctx.lineTo(qx, qb - 30 * s * sw); ctx.stroke();
    ctx.fillStyle = css([236, 228, 206], 2, 0.92, 0.06);
    ctx.beginPath();
    ctx.moveTo(ax, ab - ah);
    ctx.quadraticCurveTo((ax + hx0) / 2, ab - ah + 9 * s * sw, hx0, hy0);
    ctx.lineTo(hx0, hy0 + 6 * s * sw);
    ctx.quadraticCurveTo((ax + hx0) / 2, ab - ah + 15 * s * sw, ax, ab - ah + 6 * s * sw);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([176, 62, 58], 2, 0.9);
    ctx.lineWidth = Math.max(1, 1.8 * s * sw);
    ctx.beginPath(); ctx.moveTo(ax, ab - ah + 6 * s * sw); ctx.quadraticCurveTo((ax + hx0) / 2, ab - ah + 15 * s * sw, hx0, hy0 + 6 * s * sw); ctx.stroke();
    // 灯串的绳
    ctx.strokeStyle = css([90, 70, 52], 2, 0.8);
    ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath();
    const pts = lanternPts();
    ctx.moveTo(qx, qb - 30 * s * sw);
    for (let i = 0; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(ax, ab - ah);
    for (let i = 4; i < 8; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawLanterns(ctx) {
    const A = L('bpCana');
    if (A < 0.01 || !SP) return;
    const s = LS(2) * (phone() ? 1.4 : 1), nk = 0.35 + 0.65 * nightK(), gl = L('bpGlory');
    ctx.globalCompositeOperation = 'lighter';
    const pts = lanternPts();
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i], f = 0.85 + 0.15 * Math.sin(W.t * 5 + i * 1.9);
      glowSp(ctx, SP.warm, x, y, 16 * s * (1 + 0.3 * gl), 0.5 * A * nk * f);
      glowSp(ctx, SP.gold, x, y, 3.2 * s, 0.95 * A * f);
    }
    // 喜棚下一片暖光
    const ax = awnX() * W.w, ay = fieldY(awnX(), 0.2);
    glowE(ctx, SP.warm, ax + 20 * s, ay - 10 * s, 70 * s, 26 * s, 0.22 * A * nk);
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawWell(ctx) {
    const A = L('bpCana');
    if (A < 0.01) return;
    const s = LS(2) * (phone() ? 1.3 : 1), xf = at(X.well, 0.4), x = xf * W.w, y = fieldY(xf, 0.44), w = 13 * s, h = 7 * s;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([150, 138, 118], 2);
    ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - w, y - h); ctx.ellipse(x, y - h, w, h * 0.4, 0, Math.PI, 0); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 50, 60], 2);
    ctx.beginPath(); ctx.ellipse(x, y - h, w * 0.78, h * 0.26, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([226, 210, 180], 2, 0.5 * W.daylight + 0.2);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.ellipse(x, y - h, w, h * 0.4, 0, Math.PI, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 六口石缸：倒满了水（一口一口，直到缸口）；水变的酒发出红光
  function jarGeom(i) {
    const s = LS(2) * (phone() ? 1.25 : 1), xf = jarX(i), x = xf * W.w, y = fieldY(xf, JAR_V + (i % 2) * 0.03), h = 19 * s * (1 + 0.35 * JAR_V), w = 6.6 * s * (1 + 0.35 * JAR_V);
    return [x, y, w, h];
  }
  const jarFill = i => clamp(L('bpFill') * 6 - i, 0, 1);
  const jarWine = i => clamp(L('bpWine') * 6 - i, 0, 1);
  function drawJars(ctx) {
    const A = L('bpJars');
    if (A < 0.01) return;
    const s = LS(2);
    for (let i = 0; i < 6; i++) {
      const [x, y, w, h] = jarGeom(i);
      ctx.globalAlpha = A;
      ctx.fillStyle = css([204, 196, 178], 2);
      ctx.beginPath();
      ctx.moveTo(x - w * 0.62, y);
      ctx.quadraticCurveTo(x - w * 1.12, y - h * 0.55, x - w * 0.72, y - h * 0.92);
      ctx.lineTo(x + w * 0.72, y - h * 0.92);
      ctx.quadraticCurveTo(x + w * 1.12, y - h * 0.55, x + w * 0.62, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([150, 140, 124], 2, 0.6);
      ctx.beginPath(); ctx.ellipse(x + w * 0.35, y - h * 0.45, w * 0.45, h * 0.42, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([214, 206, 188], 2, 1, 0.05);
      ctx.fillRect(x - w * 0.82, y - h, w * 1.64, h * 0.1);
      // 缸口：空的是暗的；满了的水面映着天光；酒是深红，发出红光
      const fl = jarFill(i), wn = jarWine(i);
      const mouth = mix3([44, 40, 38], mix3(W.shade([150, 196, 222], 0, 0.2), [150, 18, 40], wn), fl);
      ctx.fillStyle = rgba(mouth, A);
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.97, w * 0.7, 1.7 * s, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([236, 226, 206], 2, 0.45 * (0.3 + 0.7 * W.daylight), 0.1);
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x - w * 0.9, y - h * 0.62); ctx.quadraticCurveTo(x - w * 1.02, y - h * 0.8, x - w * 0.72, y - h * 0.92); ctx.stroke();
      if (SP && (fl > 0.02 || wn > 0.02)) {
        ctx.globalCompositeOperation = 'lighter';
        if (fl > 0.02 && wn < 0.98) glowE(ctx, SP.water, x, y - h * 0.98, w * 1.4, 3.5 * s, 0.4 * fl * (1 - wn) * A * (0.8 + 0.2 * Math.sin(W.t * 2 + i)));
        if (wn > 0.02) {
          const pulse = 0.85 + 0.15 * Math.sin(W.t * 1.7 + i * 0.8);
          glowSp(ctx, SP.wine, x, y - h * 1.02, w * 3, 0.7 * wn * A * pulse);
          glowSp(ctx, SP.red, x, y - h * 0.6, w * 3.6, 0.3 * wn * A * pulse);
          glowE(ctx, SP.wine, x, y - h * 1.1, w * 1.1, h * 0.9, 0.35 * wn * A * pulse);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 迦百农：靠海的几间玄武石的房屋，晒网的架
  function drawVillage(ctx) {
    const A = L('bpVillage');
    if (A < 0.01) return;
    const s = LS(2);
    const xs = X.village.map((x, i) => at(x, 0.43 + i * 0.05));
    for (let i = 0; i < xs.length; i++) drawHouse(ctx, xs[i], 0, (26 + 8 * rt(i + 700)) * s, (18 + 7 * rt(i + 710)) * s, A, 0.8, [112, 106, 100], i + 11);
    // 晒网的架
    const nx = at(0.648, 0.63), ny = fieldY(nx, 0.04);
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([86, 68, 50], 2);
    ctx.lineWidth = Math.max(0.8, 1.3 * s);
    ctx.beginPath();
    ctx.moveTo(nx * W.w - 9 * s, ny); ctx.lineTo(nx * W.w - 9 * s, ny - 17 * s);
    ctx.moveTo(nx * W.w + 9 * s, ny); ctx.lineTo(nx * W.w + 9 * s, ny - 17 * s);
    ctx.moveTo(nx * W.w - 10 * s, ny - 16 * s); ctx.lineTo(nx * W.w + 10 * s, ny - 16 * s);
    ctx.stroke();
    ctx.strokeStyle = css([150, 140, 118], 2, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) { const xx = nx * W.w - 9 * s + i * 3.6 * s; ctx.moveTo(xx, ny - 16 * s); ctx.quadraticCurveTo(xx + 1 * s, ny - 10 * s, xx - 0.5 * s, ny - 5 * s); }
    for (let j = 1; j <= 3; j++) { const yy = ny - 16 * s + j * 3.4 * s; ctx.moveTo(nx * W.w - 9 * s, yy); ctx.lineTo(nx * W.w + 9 * s, yy); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  加利利海边的两条船（浮在水上）与撒下的网
  //  桌面：泊在近岸之后的海峡里——船底整个高出地脊，下面是一道水；手机：经文在上，船在近岸左边开阔的湖面上
  // ════════════════════════════════════════════════════════════
  const boatLen = () => PH(2) * 2.3;
  const BOATS = { A: { x: X.boatA, px: 0.335, py: 0.86 }, B: { x: X.boatB, px: 0.47, py: 0.79 } };
  // 船的水线（不含起伏）
  function boatBase(which) {
    const q = BOATS[which], Lb = boatLen();
    if (phone()) return [q.px * W.w, q.py * W.h];
    const x = q.x * W.w;
    let top = Infinity;
    for (let i = -2; i <= 2; i++) top = Math.min(top, W.ridgeBaseY(2, x + i * Lb * 0.25));
    return [x, top - Lb * 0.2];
  }
  function boatAt(which) {
    const b = boatBase(which);
    const bob = Math.sin(W.t * 1.3 + (which === 'A' ? 0 : 1.7)) * 0.8 * LS(2);
    return [b[0], b[1] + bob];
  }
  // 船上站人的地方（像素）：i = −1 船尾 … +1 船头
  function seatFn(which, i) {
    return () => { const b = boatAt(which), Lb = boatLen(); return [b[0] + i * Lb * 0.28, b[1] - Lb * 0.05]; };
  }
  function hullPath(ctx, Lb) {
    ctx.beginPath();
    ctx.moveTo(-0.5 * Lb, -0.14 * Lb);
    ctx.quadraticCurveTo(-0.42 * Lb, 0.03 * Lb, -0.28 * Lb, 0.04 * Lb);
    ctx.lineTo(0.3 * Lb, 0.04 * Lb);
    ctx.quadraticCurveTo(0.45 * Lb, 0.02 * Lb, 0.52 * Lb, -0.16 * Lb);
    ctx.lineTo(0.44 * Lb, -0.06 * Lb);
    ctx.lineTo(-0.42 * Lb, -0.05 * Lb);
    ctx.closePath();
  }
  function drawBoat(ctx, which) {
    const A = L('bpBoats');
    if (A < 0.01) return;
    const [x, y] = boatAt(which), b0 = boatBase(which), Lb = boatLen(), s = LS(2), f = which === 'A' ? -1 : 1;
    const wl = b0[1] + 0.035 * Lb;             // 水面（不随船起伏）
    // 船下的一片水：比四围的海稍亮的一道，船身的倒影，一圈圈的水纹
    const wc = W.shade([96, 150, 178], 0.1, 0.05);
    ctx.globalAlpha = 0.55 * A;
    ctx.fillStyle = rgba(wc, 1);
    ctx.beginPath(); ctx.ellipse(x, wl + 0.02 * Lb, 0.72 * Lb, 0.07 * Lb, 0, 0, TAU); ctx.fill();
    ctx.save();
    ctx.translate(x, wl);
    ctx.scale(f, -0.55);
    ctx.globalAlpha = 0.28 * A;
    ctx.fillStyle = css([60, 46, 36], 2);
    ctx.translate(0, -0.035 * Lb);
    hullPath(ctx, Lb); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(f, 1);
    ctx.globalAlpha = A;
    // 桅与收起的帆
    ctx.fillStyle = css([92, 70, 52], 2);
    ctx.fillRect(-0.1 * Lb, -0.62 * Lb, 0.016 * Lb, 0.6 * Lb);
    ctx.fillStyle = css([222, 212, 190], 2);
    ctx.beginPath(); ctx.moveTo(-0.092 * Lb, -0.6 * Lb); ctx.lineTo(0.12 * Lb, -0.2 * Lb); ctx.lineTo(-0.092 * Lb, -0.22 * Lb); ctx.closePath(); ctx.fill();
    // 船身
    ctx.fillStyle = css([104, 76, 52], 2);
    hullPath(ctx, Lb); ctx.fill();
    ctx.fillStyle = css([150, 112, 74], 2);
    ctx.fillRect(-0.42 * Lb, -0.07 * Lb, 0.86 * Lb, 0.025 * Lb);
    ctx.strokeStyle = css([255, 236, 204], 2, 0.5 * W.daylight);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-0.5 * Lb, -0.14 * Lb); ctx.lineTo(-0.42 * Lb, -0.06 * Lb); ctx.lineTo(0.44 * Lb, -0.06 * Lb); ctx.lineTo(0.52 * Lb, -0.16 * Lb); ctx.stroke();
    // 船上补的网（西庇太的船）
    if (which === 'B') {
      ctx.fillStyle = css([170, 158, 132], 2, 0.9);
      ctx.beginPath(); ctx.ellipse(0.16 * Lb, -0.08 * Lb, 0.14 * Lb, 0.035 * Lb, 0, Math.PI, 0); ctx.fill();
    }
    ctx.restore();
    // 船边的水纹：水线上一道亮线，向外散开的波纹
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(230,240,250)';
    ctx.lineWidth = Math.max(0.7, 1 * s);
    ctx.globalAlpha = 0.34 * A * dayA();
    ctx.beginPath(); ctx.ellipse(x, wl, 0.54 * Lb, 0.028 * Lb, 0, 0.08, Math.PI - 0.08); ctx.stroke();
    for (let i = 0; i < 2; i++) {
      const qq = U.fract(W.t * 0.25 + i / 2 + (which === 'A' ? 0 : 0.3)), r = Lb * (0.56 + 0.3 * qq);
      ctx.globalAlpha = 0.26 * A * dayA() * (1 - qq);
      ctx.beginPath(); ctx.ellipse(x, wl + 0.01 * Lb, r, 0.035 * Lb * (1 + qq), 0, 0.15, Math.PI - 0.15); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 撒在海里的网：浮在船 A 旁边的水面上（船头的一侧，稍远处的水上——桌面上在迦百农的屋顶之后），一根绳连到船上
  function netPt() { const b = boatBase('A'), Lb = boatLen(); return [b[0] - Lb * at(0.95, 0.62), b[1] + at(-0.17, 0.03) * Lb]; }
  function drawNet(ctx) {
    const A = Math.min(L('bpNet'), L('bpBoats'));
    const u = tk('throw');
    if (A < 0.01 && u < 0) return;
    const [nx, ny] = netPt(), Lb = boatLen(), s = LS(2), bA = boatAt('A');
    let rx = Lb * at(0.42, 0.34), ry = Lb * 0.06, cx = nx, cy = ny, a = A, e = 1;
    if (u >= 0) {
      // 网从彼得手里抛出：一道弧，在空中张开，落在水面
      e = ease(u);
      cx = lerp(bA[0] - Lb * 0.1, nx, e); cy = lerp(bA[1] - Lb * 0.35, ny, e) - Math.sin(Math.PI * e) * Lb * 0.3;
      rx = Lb * (0.1 + (rx / Lb - 0.1) * e); ry = Lb * (0.05 + 0.01 * e); a = Math.max(A, 0.9);
    }
    // 边缘不是死板的椭圆：随水面轻轻起伏
    const edge = an => {
      const w = 1 + 0.07 * Math.sin(an * 3 + W.t * 1.1) + 0.05 * Math.sin(an * 5 - W.t * 0.7);
      return [cx + Math.cos(an) * rx * w, cy + Math.sin(an) * ry * w + Math.sin(an * 2 + W.t * 1.4) * ry * 0.15];
    };
    // 水里的网：稍暗的一片（沉在水面下的网眼）
    if (e > 0.95 && SP) {
      ctx.globalAlpha = 0.25 * a;
      ctx.fillStyle = css([40, 60, 72], 2);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = a * at(0.62, 0.85);
    ctx.strokeStyle = css([210, 202, 180], 2, 1, 0.12);
    ctx.lineWidth = Math.max(at(0.55, 0.8), 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i <= 28; i++) { const q = edge((i / 28) * TAU); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
    // 网眼：从中心散开的几道线，与一两圈
    for (let i = 0; i < 10; i++) { const q = edge((i / 10) * TAU + 0.2); ctx.moveTo(cx, cy); ctx.lineTo(q[0], q[1]); }
    for (const k of [0.4, 0.72]) {
      for (let i = 0; i <= 20; i++) { const q = edge((i / 20) * TAU), px = cx + (q[0] - cx) * k, py = cy + (q[1] - cy) * k; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    }
    ctx.stroke();
    // 绳：从船边连到网
    ctx.globalAlpha = a * 0.7;
    ctx.beginPath();
    const r0 = edge(0);
    ctx.moveTo(bA[0] - Lb * 0.42, bA[1] - Lb * 0.06);
    ctx.quadraticCurveTo((bA[0] - Lb * 0.42 + r0[0]) / 2, Math.max(bA[1], r0[1]) + Lb * 0.02, r0[0], r0[1]);
    ctx.stroke();
    // 网边的浮子
    ctx.globalAlpha = a * 0.9;
    ctx.fillStyle = css([226, 196, 120], 2);
    for (let i = 0; i < 10; i++) { const q = edge((i / 10) * TAU + 0.1); ctx.beginPath(); ctx.arc(q[0], q[1], 1.2 * s + 0.4, 0, TAU); ctx.fill(); }
    // 落水时溅起的水纹
    if (e > 0.95 && u >= 0 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowE(ctx, SP.water, cx, cy, rx * 1.2, ry * 2, 0.4 * (1 - u) * 3);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光：引路的光（圣灵）、神的使者上去下来、荣耀、大光、夜里的边光
  // ════════════════════════════════════════════════════════════
  function drawLead(ctx) {
    const k = L('bpLead');
    if (k < 0.01 || !SP) return;
    const p = figPt('jesus', 0.75);
    const x = (S.lead != null ? S.lead : 0.8) * W.w, y = p ? p[1] - PH(2) * 0.1 : W.h * 0.8;
    const bob = Math.sin(W.t * 1.4) * PH(2) * 0.08;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.pale, x, y + bob, PH(2) * 0.9, 0.35 * k);
    glowSp(ctx, SP.white, x, y + bob, PH(2) * 0.2, 0.8 * k);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 发光的人形（神的使者）
  function lightFigure(ctx, x, y, h, a, seed) {
    if (a < 0.01 || h < 0.8) return;
    ctx.globalAlpha = a * 0.45;
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(255,250,236)';
    const sw = Math.sin(W.t * 1.7 + seed) * 0.03 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * h, y);
    ctx.quadraticCurveTo(x - 0.13 * h + sw, y - 0.45 * h, x - 0.075 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.075 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.13 * h + sw, y - 0.45 * h, x + 0.17 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.078 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.078 * h, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawLadder(ctx) {
    const k = L('bpLadder');
    if (k < 0.01 || !SP) return;
    const p = figPt('jesus', 0.6);
    if (!p) return;
    const [rx, ry] = riftPt(), h0 = PH(2) * 0.72;
    ctx.globalCompositeOperation = 'lighter';
    const NA = 10;
    for (let i = 0; i < NA; i++) {
      const up = i % 2 === 0, sp = 0.05 * (0.85 + 0.3 * rt(i * 3 + 800));
      const q = U.fract(i / NA + rt(i * 11 + 810) * 0.05 + W.t * sp * (up ? 1 : -1));
      const t = Math.pow(q, 1.1), side = up ? -1 : 1;
      const x = lerp(p[0], rx, t) + side * PH(2) * 0.28 * (1 - t * 0.7), y = lerp(p[1], ry + M() * 0.05, t);
      const hgt = h0 * lerp(1, 0.3, t);
      const a = k * ss(0, 0.08, q) * (1 - ss(0.85, 0.99, q));
      lightFigure(ctx, x, y, hgt, a * 0.9, i);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawGlory(ctx) {
    const k = L('bpGlory');
    if (k < 0.01 || !SP) return;
    const p = figPt('jesus', 0.55);
    if (!p) return;
    const h = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], h * 3.6, 0.3 * k);
    glowSp(ctx, SP.white, p[0], p[1], h * 1.2, 0.35 * k);
    glowE(ctx, SP.gold, p[0], p[1] + h * 0.5, h * 3, h * 0.5, 0.3 * k);
    for (let i = 0; i < 14; i++) {
      const an = (i / 14) * TAU + W.t * 0.05, rr = h * (1.5 + 0.3 * Math.sin(W.t * 0.9 + i));
      glowSp(ctx, SP.gold, p[0] + Math.cos(an) * rr, p[1] + Math.sin(an) * rr * 0.55, h * 0.22, 0.35 * k * (0.6 + 0.4 * Math.sin(W.t * 1.7 + i)));
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 舀出来的酒：用人手里、管筵席的手里一点红光
  function drawCup(ctx) {
    if (!S.cup || !SP || L('bpWine') < 0.5) return;
    const f = fig(S.cup);
    if (!f || !f._vis) return;
    const h = f._h || PH(2), up = f.pose === 'raise' ? 1.02 : 0.62;
    const x = f._x + (f.facing || 1) * h * (f.pose === 'raise' ? 0.05 : 0.2), y = f._y - h * up;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.wine, x, y, h * 0.4, 0.8);
    glowSp(ctx, SP.red, x, y, h * 0.8, 0.3);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 大光（4:16）：自东方（左）来的光，临到坐在黑暗里的人
  function drawDawn(ctx) {
    const k = L('bpDawn');
    if (k < 0.01 || !SP) return;
    const c = C();
    ctx.globalCompositeOperation = 'lighter';
    const y0 = fieldY(0.7, 0.2);
    glowE(ctx, SP.dawn, W.w * 0.72, y0, W.w * 0.42, PH(2) * 1.6, 0.22 * k);
    if (c && c.crowds && c.crowds.get) {
      const g = c.crowds.get('dark');
      if (g) for (const m of g.members) {
        if (!m._vis || m.dying) continue;
        const h = m._h || PH(2);
        glowSp(ctx, SP.dawn, m._x, m._y - h * 0.45, h * 0.9, 0.3 * k * m.alpha);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 夜里：主要人物身上一层淡光，脚下一片暖光（竖屏更需要）
  const NIGHT_IDS = ['jesus', 'mary', 'peter', 'andrew', 'baptist', 'master', 'groom'];
  function drawNightRim(ctx) {
    if (!SP) return;
    const nk = nightK();
    if (nk < 0.25) return;
    ctx.globalCompositeOperation = 'lighter';
    const tall = W.h > W.w;
    for (const id of NIGHT_IDS) {
      const f = fig(id);
      if (!f || !f._vis || f.alpha < 0.05) continue;
      const h = f._h || PH(2), a = (nk - 0.25) / 0.75 * f.alpha * (tall ? 1 : 0.75);
      // 子：胸中的光在夜里清楚可见（不画光环，只是人身上一层柔光）
      if (id === 'jesus') glowSp(ctx, SP.pale, f._x, f._y - h * 0.5, h * 1.05, 0.34 * a);
      glowSp(ctx, SP.pale, f._x, f._y - h * 0.5, h * 0.75, 0.2 * a);
      if (!f.attach) {
        ctx.globalAlpha = 0.3 * a;
        ctx.drawImage(SP.warm, f._x - h * 0.6, f._y - h * 0.1, h * 1.2, h * 0.2);
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 坐在黑暗里的百姓：身后一片淡淡的冷光（在人物之前画，人便成了看得清的剪影；比子暗得多）
  function drawDarkBack(ctx) {
    if (!SP) return;
    const nk = nightK();
    if (nk < 0.25) return;
    const c = C(), g = c && c.crowds && c.crowds.get ? c.crowds.get('dark') : null;
    if (!g) return;
    const k0 = (nk - 0.25) / 0.75 * (W.h > W.w ? 1 : 0.85) * (1 - 0.7 * L('bpDawn'));
    if (k0 < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const m of g.members) {
      if (!m._vis || m.dying || m.alpha < 0.05) continue;
      const h = m._h || PH(2);
      glowE(ctx, SP.cold, m._x, m._y - h * 0.32, h * 0.7, h * 0.68, 0.72 * k0 * m.alpha);
      glowE(ctx, SP.pale, m._x, m._y - h * 0.3, h * 0.4, h * 0.46, 0.32 * k0 * m.alpha);
      glowE(ctx, SP.cold, m._x, m._y, h * 0.8, h * 0.16, 0.45 * k0 * m.alpha);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 声音的环（旷野里有人声喊着）
  const FXL = [];
  function voice(b, id, n, rgb) {
    if (b.instant) return;
    const p = figPt(id, 0.9);
    if (!p) return;
    for (let i = 0; i < (n || 3); i++) FXL.push({ type: 'voice', t: -i * 0.7, dur: 3.2, x: p[0] / W.w, y: p[1] / W.h, rgb: rgb || [255, 236, 200] });
  }
  function drawFX(ctx) {
    if (!FXL.length) return;
    for (const e of FXL) {
      if (e.t < 0) continue;
      const k = e.t / e.dur;
      if (e.type === 'voice') {
        const r = PH(2) * (0.4 + 3.2 * k), a = (1 - k) * 0.4;
        ctx.strokeStyle = rgba(e.rgb, a);
        ctx.lineWidth = Math.max(0.8, 1.4 * SU());
        ctx.beginPath(); ctx.arc(e.x * W.w, e.y * W.h, r, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
      }
    }
  }

  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const SCENE = {
    init() { sprites(); },
    resize() {
      RV = null; RPC.k = ''; GC.clear();
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      shX = W.replaying ? S.shDx : U.approach(shX, S.shDx, 0.9, f);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const k in TW) if (W.t - TW[k].t0 > TW[k].dur + 1) delete TW[k];
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      if (pass === 'sky') { drawRift(ctx); return; }
      if (pass === 'air') {
        drawWaders(ctx);
        drawLanterns(ctx);
        drawDawn(ctx);
        drawGlory(ctx);
        drawCup(ctx);
        drawBeam(ctx);
        drawLadder(ctx);
        drawShadow(ctx);
        drawLead(ctx);
        drawDove(ctx);
        drawNightRim(ctx);
        drawFX(ctx);
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l === 0) drawKingdoms(ctx);
      if (l === 1) drawCity(ctx);
      if (l === 2) {
        drawJordan(ctx);
        drawPath(ctx);
        drawVillage(ctx);
        drawCana(ctx);
        drawDwelling(ctx);
        drawTemple(ctx);
        drawCrag(ctx);
        drawFig(ctx);
        drawStones(ctx);
        drawWell(ctx);
        drawJars(ctx);
        drawDarkBack(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'seaNear') { drawNet(ctx); drawBoat(ctx, 'B'); drawBoat(ctx, 'A'); }
    },
    reset() {},
    restore() { shX = S.shDx; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      if (L('bpRiver') > 0.5) { const q = rPt(0.55); cand('约旦河', q[0], q[1]); }
      if (L('bpCity') > 0.5) cand('耶路撒冷', X.city * W.w, gY(1, X.city) - 16 * LS(1));
      if (L('bpCold') > 0.5) { const q = pinTop(); cand('殿顶', q[0], q[1] + pinH() * 0.3); }
      if (L('bpCrag') > 0.5) { const q = cragTop(); cand('最高的山', q[0], q[1] + cragH() * 0.3); }
      if (L('bpStones') > 0.5) cand('石头', S.stones * W.w, fieldY(S.stones, 0.5));
      if (L('bpFig') > 0.5) cand('无花果树', at(X.fig, 0.9) * W.w, fieldY(at(X.fig, 0.9), 0) - PH(2) * 1.2);
      if (L('bpDwell') > 0.5) cand('住处', X.dwell * W.w, fieldY(X.dwell, 0) - 12 * LS(2));
      if (L('bpCana') > 0.5) cand('娶亲的家', houseX() * W.w, fieldY(houseX(), 0) - 20 * LS(2));
      if (L('bpJars') > 0.5) { const q = jarGeom(2); cand('石缸', q[0], q[1] - q[3] * 0.5); }
      if (L('bpVillage') > 0.5) cand('迦百农', at(X.village[1], 0.48) * W.w, fieldY(at(X.village[1], 0.48), 0) - 12 * LS(2));
      if (L('bpBoats') > 0.5) { const a = boatAt('A'), b = boatAt('B'); cand('船', a[0], a[1]); cand('西庇太的船', b[0], b[1]); }
      if (L('bpNet') > 0.5 && L('bpBoats') > 0.5) { const q = netPt(); cand('网', q[0], q[1]); }
      return best;
    },
    sig() {
      return { stones: Math.round(S.stones * 100) / 100, shDx: S.shDx, lead: S.lead, dove: S.dove, simon: S.simon, net: S.netCast, cup: S.cup, rift: RIFT.id };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const fromOf = b => (b.instant ? 'none' : 'fade');
  const JESUS = o => Object.assign({}, LOOK('jesus'), o || {});
  function addJesus(b, o) { return add('jesus', JESUS(Object.assign({ from: fromOf(b) }, o || {}))); }
  function dip(b, id) { tween(b, 'dip:' + id, 2.4); }
  const bapX = off => riverAtV(X.bapV, 0, off);
  // 从高处（殿顶、山顶、船上）下到地上
  function descend(b, id, x, dur, v) {
    const f = fig(id);
    if (!f) return;
    const p = figPt(id, 0);
    attach(id, null);
    if (p && !b.instant) f.ny = p[1] / W.h;
    f.v = v || 0;
    fly(id, x, fieldY(x, v || 0) / W.h, { dur: dur || 1.6, pose: 'stand' });
  }
  // 从天上降下（天使）：在天上起步之处显出（光点在那里闪现，渐渐显形），再降到地上
  function fromSky(b, id, x, yFrac, dur) {
    const f = fig(id);
    if (!f) return;
    if (!b.instant) {
      f.ny = yFrac; f.nx = x + 0.03;
      f.alpha = 0; f.targetAlpha = 1; f.emerge = 0; f.from = 'light';
      const h = PH(2) * (1 + 0.35 * (f.v || 0));
      sparkAt(b, f.nx * W.w, yFrac * W.h - h * 0.5, 26, [255, 244, 220], 12, 'top');
    }
    fly(id, x, fieldY(x, f.v || 0) / W.h, { dur: dur || 2.4, pose: 'stand' });
  }
  // 飞到之后落定在地上（按纵深 v 站着）
  function grounded(id, v) { const f = fig(id); if (f && !f.fly) { f.ny = null; if (v != null) f.v = v; } }
  function disciples(b, list) {
    // [id, look, label, robeIndex, x, v]
    for (const q of list) {
      const [id, look, label, ri, x, v] = q;
      const base = look ? LOOK(look) : Object.assign({}, LOOK('disciple'), { robe: (C().DISCIPLE_ROBES || [[120, 100, 80]])[ri % 11] });
      add(id, Object.assign({}, base, { label: label || base.label, x, v, from: fromOf(b) }));
    }
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：黎明前的约旦河，犹太的旷野；远处中丘上是耶路撒冷
  // ════════════════════════════════════════════════════════════
  function resetScene() {
    FXL.length = 0; for (const k in TW) delete TW[k];
    S = fresh(); shX = S.shDx; RV = null; RPC.k = ''; RIFT = { x: 0.68, id: 'jesus' };
  }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.36, herbs: 0.3, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1,
      good: 0, given: 1, sabbath: 0, bare: 0.62, bloom: 0.05 };
    for (const k of LEVELS0) lv[k] = 0;
    lv.bpRiver = 1; lv.bpCity = 1;
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.245, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.18, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 18, W.w * 0.5, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 4, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    avoid([0.42, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟）
  // ════════════════════════════════════════════════════════════
  const MT = r => '马太福音 ' + r, JN = r => '约翰福音 ' + r, MK = r => '马可福音 ' + r;
  const INTRO = [
    { text: '神的儿子，耶稣基督福音的起头。', ref: MK('1:1'), hold: 4.5 },
  ];
  const V1 = [
    { text: '正如先知以赛亚书上记着说：<br>「看哪，我要差遣我的使者在你前面，预备道路。」', ref: MK('1:2'), hold: 6 },
    { text: '有一个人，是从神那里差来的，名叫约翰。<br>这人来，为要作见证，就是为光作见证，叫众人因他可以信。', ref: JN('1:6–7'), hold: 7 },
    { text: '那时，有施洗的约翰出来，在犹太的旷野传道，说：<br>「天国近了，你们应当悔改！」', ref: MT('3:1–2'), hold: 6.5 },
    { text: '这约翰身穿骆驼毛的衣服，腰束皮带，吃的是蝗虫、野蜜。', ref: MT('3:4'), hold: 5.5 },
  ];
  const V2 = [
    { text: '这人就是先知以赛亚所说的。他说：<br>「在旷野有人声喊着说：预备主的道，修直他的路！」', ref: MT('3:3'), hold: 6.5 },
    { text: '那时，耶路撒冷和犹太全地，并约旦河一带地方的人，都出去到约翰那里，<br>承认他们的罪，在约旦河里受他的洗。', ref: MT('3:5–6'), hold: 7 },
    { text: '「我是用水给你们施洗，叫你们悔改。但那在我以后来的，能力比我更大……<br>他要用圣灵与火给你们施洗。」', ref: MT('3:11'), hold: 7 },
  ];
  const V3 = [
    { text: '当下，耶稣从加利利来到约旦河，见了约翰，要受他的洗。', ref: MT('3:13'), hold: 5.5 },
    { text: '约翰想要拦住他，说：「我当受你的洗，你反倒上我这里来吗？」', ref: MT('3:14'), hold: 5.5 },
    { text: '耶稣回答说：「你暂且许我，因为我们理当这样尽诸般的义。」<br>于是约翰许了他。', ref: MT('3:15'), hold: 6.5 },
  ];
  const V4 = [
    { text: '耶稣受了洗，随即从水里上来。天忽然为他开了，<br>他就看见神的灵仿佛鸽子降下，落在他身上。', ref: MT('3:16'), hold: 7.5 },
    { text: '从天上有声音说：「这是我的爱子，我所喜悦的。」', ref: MT('3:17'), hold: 6.5 },
    { text: '约翰又作见证说：「我曾看见圣灵，仿佛鸽子从天降下，住在他的身上。」', ref: JN('1:32'), hold: 6.5 },
  ];
  const V5 = [
    { text: '当时，耶稣被圣灵引到旷野，受魔鬼的试探。<br>他禁食四十昼夜，后来就饿了。', ref: MT('4:1–2'), hold: 6.5 },
    { text: '那试探人的进前来，对他说：<br>「你若是神的儿子，可以吩咐这些石头变成食物。」', ref: MT('4:3'), hold: 6 },
    { text: '耶稣却回答说：「经上记着说：人活着，不是单靠食物，<br>乃是靠神口里所出的一切话。」', ref: MT('4:4'), hold: 7 },
  ];
  const V6 = [
    { text: '魔鬼就带他进了圣城，叫他站在殿顶上，对他说：<br>「你若是神的儿子，可以跳下去……」', ref: MT('4:5–6'), hold: 7 },
    { text: '耶稣对他说：「经上又记着说：『不可试探主你的神。』」', ref: MT('4:7'), hold: 6 },
  ];
  const V7 = [
    { text: '魔鬼又带他上了一座最高的山，将世上的万国与万国的荣华都指给他看，<br>对他说：「你若俯伏拜我，我就把这一切都赐给你。」', ref: MT('4:8–9'), hold: 7.5 },
    { text: '耶稣说：「撒但，退去吧！因为经上记着说：<br>当拜主你的神，单要事奉他。」', ref: MT('4:10'), hold: 7 },
    { text: '于是，魔鬼离了耶稣，有天使来伺候他。', ref: MT('4:11'), hold: 5.5 },
  ];
  const V8 = [
    { text: '次日，约翰看见耶稣来到他那里，就说：<br>「看哪，神的羔羊，除去世人罪孽的！」', ref: JN('1:29'), hold: 6.5 },
    { text: '再次日，约翰同两个门徒站在那里。他见耶稣行走，就说：「看哪，这是神的羔羊！」<br>两个门徒听见他的话，就跟从了耶稣。', ref: JN('1:35–37'), hold: 8 },
    { text: '耶稣转过身来，看见他们跟着，就问他们说：「你们要什么？」<br>他们说：「拉比，在哪里住？」……耶稣说：「你们来看。」', ref: JN('1:38–39'), hold: 7.5 },
  ];
  const V9 = [
    { text: '听见约翰的话跟从耶稣的那两个人，一个是西门‧彼得的兄弟安得烈。<br>他先找着自己的哥哥西门，对他说：「我们遇见弥赛亚了。」', ref: JN('1:40–41'), hold: 7.5 },
    { text: '于是领他去见耶稣。耶稣看着他，说：<br>「你是约翰的儿子西门，你要称为矶法。」（矶法翻出来就是彼得。）', ref: JN('1:42'), hold: 7.5 },
  ];
  const V10 = [
    { text: '又次日，耶稣想要往加利利去，遇见腓力，就对他说：「来跟从我吧。」', ref: JN('1:43'), hold: 5.5 },
    { text: '腓力找着拿但业……拿但业对他说：「拿撒勒还能出什么好的吗？」<br>腓力说：「你来看！」', ref: JN('1:45–46'), hold: 6.5 },
    { text: '耶稣回答说：「腓力还没有招呼你，你在无花果树底下，我就看见你了。」<br>拿但业说：「拉比，你是神的儿子，你是以色列的王！」', ref: JN('1:48–49'), hold: 7.5 },
    { text: '又说：「我实实在在地告诉你们，你们将要看见天开了，<br>神的使者上去下来在人子身上。」', ref: JN('1:51'), hold: 7 },
  ];
  const V11 = [
    { text: '第三日，在加利利的迦拿有娶亲的筵席，耶稣的母亲在那里。<br>耶稣和他的门徒也被请去赴席。', ref: JN('2:1–2'), hold: 6.5 },
    { text: '酒用尽了，耶稣的母亲对他说：「他们没有酒了。」……<br>他母亲对用人说：「他告诉你们什么，你们就做什么。」', ref: JN('2:3–5'), hold: 7 },
    { text: '照犹太人洁净的规矩，有六口石缸摆在那里……<br>耶稣对用人说：「把缸倒满了水。」他们就倒满了，直到缸口。', ref: JN('2:6–7'), hold: 7 },
  ];
  const V12 = [
    { text: '耶稣又说：「现在可以舀出来，送给管筵席的。」他们就送了去。', ref: JN('2:8'), hold: 5.5 },
    { text: '管筵席的尝了那水变的酒……便叫新郎来，对他说：<br>「人都是先摆上好酒……你倒把好酒留到如今！」', ref: JN('2:9–10'), hold: 7 },
    { text: '这是耶稣所行的头一件神迹，是在加利利的迦拿行的，显出他的荣耀来；<br>他的门徒就信他了。', ref: JN('2:11'), hold: 7 },
  ];
  const V13 = [
    { text: '耶稣听见约翰下了监，就退到加利利去；<br>后又离开拿撒勒，往迦百农去，就住在那里。', ref: MT('4:12–13'), hold: 7 },
    { text: '那坐在黑暗里的百姓看见了大光；<br>坐在死荫之地的人有光发现照着他们。', ref: MT('4:16'), hold: 6.5 },
    { text: '从那时候，耶稣就传起道来，说：「天国近了，你们应当悔改！」', ref: MT('4:17'), hold: 5.5 },
  ];
  const V14 = [
    { text: '耶稣在加利利海边行走，看见弟兄二人，就是那称呼彼得的西门和他兄弟安得烈，<br>在海里撒网；他们本是打鱼的。', ref: MT('4:18'), hold: 7 },
    { text: '耶稣对他们说：「来跟从我，我要叫你们得人如得鱼一样。」<br>他们就立刻舍了网，跟从了他。', ref: MT('4:19–20'), hold: 6.5 },
    { text: '从那里往前走，又看见弟兄二人，就是西庇太的儿子雅各和他兄弟约翰……在船上补网，<br>耶稣就招呼他们，他们立刻舍了船，别了父亲，跟从了耶稣。', ref: MT('4:21–22'), hold: 7.5 },
    { text: '当下，有许多人从加利利、低加坡里、耶路撒冷、犹太、约旦河外来跟着他。', ref: MT('4:25'), hold: 5.5 },
  ];

  // ════════════════════════════════════════════════════════════
  //  十四句话
  // ════════════════════════════════════════════════════════════
  const GOLD = [255, 232, 180], PALE = [226, 240, 255], DOVE = [255, 250, 236];
  const STAGES = [
    // ── 1 · 有一个人，是从神那里差来的，名叫约翰（约 1:6；太 3:1–4）── 黎明，约翰来到约旦河边 ──
    {
      // 父自己的话（玛 3:1，马可福音 1:2 所引）：「我要差遣我的使者在你前面」——约翰便从旷野里来
      kind: 'promise', utter: '看哪，我要差遣我的使者在你前面', cmd: 'send 约翰 --from 神 --to 旷野  # 为光作见证', ref: '马可福音 1:2', tint: [240, 228, 206],
      verse: V1,
      apply(c) {
        const Lt = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.31, 9, b.instant);
            add('baptist', Object.assign({}, LOOK('baptist'), { x: 1.03, v: 0.3, facing: -1, from: 'none' }));
            walk('baptist', at(0.72, 0.74), { speed: 0.03 });
            sfx(b, 'wind', { soft: true, far: true });
          }],
          // 有一个人，是从神那里差来的，名叫约翰
          [Lt[1] + 0.8, b => { nameOn(b, 'baptist', '约翰', [255, 232, 190], { size: 0.044, hold: 3.6 }); ringOn(b, 'baptist', 0.55, [255, 232, 190], PH(2) * 1.5, 1.6); }],
          [Lt[2], b => { face('baptist', -1); pose('baptist', 'raise'); voice(b, 'baptist', 3); sfx(b, 'whisper', { soft: true }); }],
          [Lt[2] + 2.4, b => { pose('baptist', 'point'); face('baptist', 1); voice(b, 'baptist', 2); }],
          [Lt[2] + 4.6, () => { pose('baptist', 'stand'); }],
          // 他走下约旦河，站在水里
          [Lt[3], () => { add('baptist', { v: X.bapV }); walk('baptist', bapX(-0.28), { speed: 0.02 }); }],
          [Lt[3] + 4.2, b => { face('baptist', 1); sfx(b, 'splash', { soft: true, size: 0.6 }); }],
        ]);
      },
    },

    // ── 2 · 预备主的道，修直他的路（太 3:3–11）── 弯曲的路修直了；众人来受洗 ────────
    //    这句是先知的话（赛 40:3）：「这人就是先知以赛亚所说的」——以赛亚书 40 章里这喊声所传的是「你们的神说」（赛 40:1）的安慰，
    //    是神藉先知所说、如今在约翰身上应验的话；所以作神的言说（命令），而不是一句单单属人的话。
    {
      kind: 'cmd', utter: '预备主的道，修直他的路', cmd: 'sed -i "s/弯曲/正直/g" ~/旷野/路  # 预备主的道', ref: '3:3', tint: [255, 232, 190],
      verse: V2,
      apply(c) {
        const Lt = starts(V2);
        const n = at(9, 6);
        T(c, [
          [0, b => {
            W.goTo(0.37, 10, b.instant);
            W.set('bpPath', 1, b.instant); W.set('bpStraight', 0, true);
            pose('baptist', 'raise'); voice(b, 'baptist', 2);
            sfx(b, 'wind', { soft: true });
          }],
          [1.6, b => { W.set('bpStraight', 1, b.instant); sfx(b, 'build', { soft: true, far: true }); }],
          [3.4, () => { pose('baptist', 'stand'); }],
          // 耶路撒冷和犹太全地的人，都出去到约翰那里
          [Lt[1] - 1.5, b => {
            crowd('folk', { n, x0: 1.03, x1: 1.16, layer: 2, label: '众人', from: fromOf(b), mill: false });
            crowdDepth('folk', 0.04, 0.26, 20);
            crowdWalk('folk', at(0.73, 0.75), at(0.97, 0.98), { speed: 0.04 });
            add('pen1', { label: '受洗的人', sex: 'm', age: 'adult', robe: [134, 112, 88], x: 1.04, v: X.bapV, facing: -1, glow: 0.12, from: fromOf(b) });
            add('pen2', { label: '受洗的人', sex: 'f', age: 'adult', robe: [150, 108, 100], x: 1.1, v: X.bapV, facing: -1, glow: 0.12, from: fromOf(b) });
            walk('pen1', bapX(0.22), { speed: 0.045 });
            walk('pen2', at(0.705, 0.72), { speed: 0.045 });
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [Lt[1] + 5.4, b => { pose('pen1', 'kneel'); face('baptist', 1); pose('baptist', 'carry'); }],
          [Lt[1] + 6.2, b => { dip(b, 'pen1'); sfx(b, 'splash', { size: 1.2 }); }],
          [Lt[1] + 7.6, b => { const p = figPt('pen1', 0.6); if (p) sparkAt(b, p[0], p[1], 16, [220, 240, 255], 8); pose('pen1', 'stand'); pose('baptist', 'stand'); }],
          [Lt[1] + 8.4, () => { walk('pen1', riverAtV(X.bapV, -1, -0.5), { speed: 0.03 }); walk('pen2', bapX(0.22), { speed: 0.03 }); }],
          [Lt[2], b => {
            pose('pen2', 'kneel'); pose('baptist', 'carry');
            crowd('washed', { n: at(4, 3), x0: at(0.5, 0.42), x1: at(0.58, 0.55), layer: 2, label: '受了洗的人', from: fromOf(b), mill: false });
            crowdDepth('washed', 0.12, 0.5, 60);
            crowdFace('washed', 1);
          }],
          [Lt[2] + 0.8, b => { dip(b, 'pen2'); sfx(b, 'splash', { size: 1.1 }); }],
          [Lt[2] + 2.2, b => { const p = figPt('pen2', 0.6); if (p) sparkAt(b, p[0], p[1], 16, [220, 240, 255], 8); pose('pen2', 'stand'); pose('baptist', 'stand'); }],
          // 那在我以后来的……他要用圣灵与火给你们施洗：约翰指着路的尽头
          [Lt[2] + 3.2, b => {
            walk('pen2', riverAtV(X.bapV, -1, -1.1), { speed: 0.03 });
            face('baptist', 1); pose('baptist', 'point');
            const q = pathPt(0.02); ringAt(b, q[0] - 20, q[1] - PH(2) * 0.6, [255, 226, 170], PH(2) * 2.2, 2.4);
          }],
          [Lt[2] + 6.4, () => { pose('baptist', 'stand'); }],
        ]);
      },
    },

    // ── 3 · 你暂且许我（太 3:13–15）── 耶稣从加利利来到约旦河 ────────
    {
      kind: 'call', utter: '你暂且许我，因为我们理当这样尽诸般的义', cmd: 'fulfill --all 义  # 你暂且许我', ref: '3:15', tint: [236, 230, 214],
      verse: V3,
      apply(c) {
        const Lt = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.42, 8, b.instant);
            addJesus(b, { x: 1.04, v: X.bapV, facing: -1 });
            walk('jesus', at(0.73, 0.75), { speed: 0.034 });
            rm('pen1'); rm('pen2');
            crowdFace('folk', 1);
          }],
          [5.6, b => { nameOn(b, 'jesus', '耶稣', [255, 240, 214], { size: 0.044, hold: 3.4 }); }],
          [Lt[1] - 0.6, () => { crowdFace('folk', -1); crowdFace('washed', 1); face('baptist', 1); }],
          // 约翰想要拦住他
          [Lt[1] + 0.4, () => { pose('baptist', 'bow'); face('jesus', -1); }],
          [Lt[1] + 3.4, () => { pose('baptist', 'raise'); }],
          [Lt[2], () => { pose('baptist', 'stand'); }],
          // 于是约翰许了他：二人站在水里
          [Lt[2] + 3.4, () => { walk('jesus', bapX(0.3), { speed: 0.022 }); pose('baptist', 'carry'); }],
          [Lt[2] + 6.5, b => { face('jesus', -1); face('baptist', 1); pose('baptist', 'stand'); sfx(b, 'splash', { soft: true, size: 0.7 }); }],
        ]);
      },
    },

    // ── 4 · 这是我的爱子，我所喜悦的（太 3:16–17）── 天开了，光的鸽子，从天上有声音 ──────
    {
      kind: 'bless', utter: '这是我的爱子，我所喜悦的', cmd: 'open 天 && descend 鸽子 --on 爱子', ref: '3:17', tint: [255, 246, 226],
      verse: V4,
      apply(c) {
        const Lt = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.46, 8, b.instant);
            face('jesus', -1); face('baptist', 1);
            pose('baptist', 'carry'); pose('jesus', 'kneel');
          }],
          [0.9, b => { dip(b, 'jesus'); sfx(b, 'splash', { size: 1.6 }); }],
          // 随即从水里上来
          [2.5, b => { pose('jesus', 'stand'); pose('baptist', 'stand'); sparkOn(b, 'jesus', 0.6, 24, [220, 240, 255], 10); }],
          // 天忽然为他开了
          [3.3, b => { RIFT.id = 'jesus'; W.set('bpOpen', 1, b.instant); flash(b, 0.12); sfx(b, 'wind', { low: true }); sfx(b, 'angel', { soft: true }); }],
          [4.6, b => {
            W.set('bpBeam', 1, b.instant);
            S.dove = 'down'; W.set('bpDoveA', 1, b.instant); W.set('bpDove', 1, b.instant);
            pose('jesus', 'gaze'); pose('baptist', 'gaze');
            sfx(b, 'wings', { soft: true });
          }],
          [7.6, b => { sfx(b, 'dove'); }],
          // 落在他身上
          [Lt[1] - 0.4, b => { S.dove = 'rest'; glow('jesus', 0.62); pose('jesus', 'stand'); ringOn(b, 'jesus', 0.9, DOVE, PH(2) * 1.6, 1.6); }],
          // 从天上有声音
          [Lt[1] + 0.6, b => {
            flash(b, 0.16);
            const q = riftPt(); ringAt(b, q[0], q[1], [255, 244, 220], M() * 0.9, 3.4);
            crowdPose('folk', 'bow'); crowdPose('washed', 'bow'); pose('baptist', 'bow');
            sfx(b, 'bell', { soft: true }); sfx(b, 'harp');
          }],
          // 约翰又作见证
          [Lt[2], b => {
            pose('baptist', 'point'); crowdPose('folk', 'stand'); crowdPose('washed', 'stand');
            W.set('bpOpen', 0.3, b.instant); W.set('bpBeam', 0.4, b.instant);
          }],
          // 住在他的身上：鸽子一直停在他身上，到末了才化入他身上的光
          [Lt[2] + 5, b => {
            pose('baptist', 'stand'); glow('jesus', 0.45);
            W.set('bpDoveA', 0, b.instant); S.dove = 'gone';
            sparkOn(b, 'jesus', 1.05, 18, DOVE, 8, 'top'); ringOn(b, 'jesus', 0.8, DOVE, PH(2) * 1.1, 1.4);
          }],
        ]);
      },
    },

    // ── 5 · 人活着，不是单靠食物（太 4:1–4）── 圣灵引他到旷野；四十昼夜；石头与冷的烟影 ────
    {
      kind: 'cmd', utter: '人活着，不是单靠食物', cmd: 'return 话语 > 食物  # 不是单靠食物', ref: '4:4', tint: [232, 222, 206],
      verse: V5,
      apply(c) {
        const Lt = starts(V5);
        T(c, [
          [0, b => {
            W.set('bpOpen', 0, b.instant); W.set('bpBeam', 0, b.instant); W.set('bpDove', 0, true); W.set('bpDoveA', 0, true);
            glow('jesus', LOOK('jesus').glow || 0.32);
            // 被圣灵引到旷野：一点光在前面引路
            S.lead = at(0.8, 0.82); W.set('bpLead', 1, b.instant);
            walk('jesus', S.stones = at(0.78, 0.76), { speed: 0.03 });
            walk('baptist', 0.4, { speed: 0.03 }); rm('baptist');
            uncrowd('folk'); uncrowd('washed');
            W.set('bpPath', 0, b.instant); W.set('bpRiver', 0, b.instant); W.set('bpCity', 0, b.instant);
            W.set('bare', 0.9, b.instant); W.set('grass', 0.12, b.instant); W.set('herbs', 0.1, b.instant); W.set('bloom', 0, b.instant); W.set('trees', 0, b.instant);
            W.set('bpStones', 1, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          // 他禁食四十昼夜：昼夜飞逝
          [3.2, b => { W.set('bpLead', 0, b.instant); pose('jesus', 'sit'); W.passDay(3.2, b.instant); }],
          [6.5, b => { W.passDay(3.2, b.instant); pose('jesus', 'pray'); }],
          [9.8, b => { W.goTo(0.64, 2.2, b.instant); }],
          // 那试探人的进前来：一团冷而暗的烟影；石头泛着饼的虚光
          [Lt[1], b => { S.shDx = 3.2; shX = W.replaying ? 1.3 : 3.2; W.set('bpShadow', 0.85, b.instant); S.shDx = 1.3; sfx(b, 'whisper', { low: true }); }],
          [Lt[1] + 2, b => { W.set('bpLoaf', 1, b.instant); pose('jesus', 'sit'); }],
          // 经上记着说
          [Lt[2], b => {
            pose('jesus', 'stand'); face('jesus', 1);
            ringOn(b, 'jesus', 0.7, PALE, PH(2) * 2.4, 1.8);
            W.set('bpLoaf', 0, b.instant); S.shDx = 2.6; W.set('bpShadow', 0.45, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 6 · 不可试探主你的神（太 4:5–7）── 圣城，殿顶 ────────────────
    {
      kind: 'cmd', utter: '不可试探主你的神', cmd: 'deny --test 主你的神', ref: '4:7', tint: [214, 222, 240],
      verse: V6,
      apply(c) {
        const Lt = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.765, 7, b.instant);
            W.set('bpCold', 1, b.instant);
            W.set('bpStones', 0, b.instant);
            W.set('bpShadow', 0.95, b.instant); S.shDx = 1.1; shX = 1.1;
            rm('jesus');
            sfx(b, 'wind', { low: true });
          }],
          // 叫他站在殿顶上
          [1.8, b => {
            const q = pinTop();
            addJesus(b, { x: q[0] / W.w, layer: 2, v: 0, facing: 1 });
            attach('jesus', pinTop);
          }],
          [Lt[0] + 3.6, b => { S.shDx = 0.75; sfx(b, 'whisper', { soft: true }); }],
          // 不可试探主你的神
          [Lt[1], b => {
            ringOn(b, 'jesus', 0.6, PALE, PH(2) * 2.6, 1.8);
            S.shDx = -3; W.set('bpShadow', 0.4, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 7 · 撒但，退去吧（太 4:8–11）── 最高的山；万国的荣华；烟影退散，天亮，天使来伺候他 ─────
    {
      kind: 'cmd', utter: '撒但，退去吧', cmd: 'exit 试探 && serve --by 天使', ref: '4:10', tint: [255, 240, 214],
      verse: V7,
      apply(c) {
        const Lt = starts(V7);
        const gx = at(0.73, 0.64);
        T(c, [
          [0, b => {
            W.goTo(0.9, 7, b.instant);
            W.set('bpCold', 0, b.instant);
            W.set('bpCrag', 1, b.instant);
            W.set('bpShadow', 0.95, b.instant); S.shDx = 1.25; shX = 1.25;
            rm('jesus');
            sfx(b, 'wind', { low: true });
          }],
          [1.9, b => {
            const q = cragTop();
            addJesus(b, { x: q[0] / W.w, layer: 2, v: 0, facing: -1 });
            attach('jesus', cragTop);
          }],
          // 世上的万国与万国的荣华
          [3.2, b => { W.set('bpKing', 1, b.instant); sfx(b, 'chime', { soft: true, far: true }); }],
          [Lt[0] + 5, () => { S.shDx = 0.8; }],
          // 撒但，退去吧！
          [Lt[1], b => {
            pose('jesus', 'raise');
            ringOn(b, 'jesus', 0.7, [255, 244, 220], M() * 0.5, 2.2); flash(b, 0.12);
            W.set('bpKing', 0, b.instant);
            S.shDx = 7; W.set('bpShadow', 0, b.instant);
            W.goTo(0.27, 11, b.instant);
            sfx(b, 'wind'); sfx(b, 'harp');
          }],
          [Lt[1] + 2.4, () => { pose('jesus', 'stand'); }],
          // 有天使来伺候他：他从山上下来，天使自天而降
          [Lt[2] - 1.2, b => {
            const f = fig('jesus'), p = figPt('jesus', 0);
            attach('jesus', null);
            if (f && p && !b.instant) f.ny = p[1] / W.h;
            fly('jesus', gx, fieldY(gx, 0.3) / W.h, { dur: 1.9, pose: 'stand' });
            // from:'none'——不在地上落点闪现；显形与闪光都在天上起步之处（见 fromSky）
            add('angel1', { label: '天使', angel: true, x: gx - at(0.045, 0.1), v: 0.3, facing: 1, from: 'none' });
            add('angel2', { label: '天使', angel: true, x: gx + at(0.05, 0.11), v: 0.26, facing: -1, from: 'none' });
            fromSky(b, 'angel1', gx - at(0.045, 0.1), phone() ? 0.5 : 0.3, 2.6);
            fromSky(b, 'angel2', gx + at(0.05, 0.11), phone() ? 0.48 : 0.26, 2.8);
            sfx(b, 'angel');
          }],
          // 落地之后：站在近地的纵深里（不再悬在半空的一点上）
          [Lt[2] + 1, () => { grounded('jesus', 0.3); }],
          [Lt[2] + 2.2, () => { grounded('angel1'); grounded('angel2'); pose('jesus', 'sit'); pose('angel1', 'bow'); face('angel1', 1); face('angel2', -1); }],
        ]);
      },
    },

    // ── 8 · 你们要什么？（约 1:29–39）── 约旦河外；神的羔羊；两个门徒跟从；「你们来看」 ──────
    {
      kind: 'ask', utter: '你们要什么？', cmd: 'follow 耶稣 --ask "拉比，在哪里住？"', ref: '约翰福音 1:38', tint: [240, 232, 214],
      verse: V8,
      apply(c) {
        const Lt = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.34, 7, b.instant);
            rm('angel1'); rm('angel2');
            W.set('bpCrag', 0, b.instant); W.set('bpStones', 0, b.instant);
            W.set('bpRiver', 1, b.instant); W.set('bare', 0.55, b.instant); W.set('grass', 0.4, b.instant); W.set('herbs', 0.35, b.instant); W.set('bloom', 0.1, b.instant); W.set('trees', 0.2, b.instant);
            W.set('bpDwell', 1, b.instant); W.set('bpLamp', 0, true);
            add('jesus', { v: 0.3 });
            pose('jesus', 'stand');
            add('baptist', Object.assign({}, LOOK('baptist'), { x: at(0.585, 0.56), v: 0.32, facing: 1, from: fromOf(b) }));
            disciples(b, [['andrew', null, '安得烈', 0, at(0.55, 0.49), 0.38], ['other', null, '另一个门徒', 3, at(0.52, 0.42), 0.28]]);
            face('andrew', 1); face('other', 1);
            walk('jesus', at(0.745, 0.76), { speed: 0.02 });
          }],
          [2.4, () => { pose('baptist', 'point'); }],
          [Lt[0] + 5.5, () => { pose('baptist', 'stand'); }],
          // 他见耶稣行走
          [Lt[1] - 0.4, () => { walk('jesus', at(0.83, 0.86), { speed: 0.018 }); face('baptist', 1); }],
          [Lt[1] + 1.8, b => { pose('baptist', 'point'); ringOn(b, 'jesus', 0.5, GOLD, PH(2) * 1.6, 1.6); }],
          // 两个门徒听见他的话，就跟从了耶稣（涉水过河）
          [Lt[1] + 4.2, () => { walk('andrew', at(0.765, 0.76), { speed: 0.034 }); walk('other', at(0.735, 0.7), { speed: 0.034 }); pose('baptist', 'stand'); }],
          // 耶稣转过身来
          [Lt[2], () => { face('jesus', -1); face('andrew', 1); face('other', 1); }],
          [Lt[2] + 3.4, () => { pose('andrew', 'point'); }],
          [Lt[2] + 5, b => {
            pose('andrew', 'stand');
            walk('jesus', at(0.895, 0.9), { speed: 0.02 });
            walk('andrew', at(0.86, 0.83), { speed: 0.022 }); walk('other', at(0.835, 0.76), { speed: 0.022 });
            W.goTo(0.64, 6, b.instant);
          }],
          [Lt[2] + 8.5, b => { W.set('bpLamp', 1, b.instant); face('jesus', -1); face('andrew', 1); face('other', 1); }],
        ]);
      },
    },

    // ── 9 · 你是约翰的儿子西门，你要称为矶法（约 1:40–42）── 安得烈找着西门；名字重新聚成 ──────
    {
      kind: 'name', utter: '你是约翰的儿子西门，你要称为矶法', cmd: 'mv 西门 矶法  # 翻出来就是彼得', ref: '约翰福音 1:42', tint: [236, 226, 206],
      verse: V9,
      apply(c) {
        const Lt = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.72, 10, b.instant);
            add('peter', Object.assign({}, LOOK('peter'), { label: '西门', x: at(0.5, 0.42), v: 0.3, facing: 1, from: fromOf(b) }));
            S.simon = '西门';
            walk('andrew', at(0.54, 0.5), { speed: 0.075, run: true });
          }],
          [3.8, () => { face('andrew', -1); face('peter', 1); pose('andrew', 'point'); }],
          [Lt[0] + 5.6, () => { pose('andrew', 'stand'); face('andrew', 1); }],
          // 于是领他去见耶稣
          [Lt[1] - 1.4, () => {
            walk('andrew', at(0.8, 0.72), { speed: 0.04 });
            walk('peter', at(0.84, 0.8), { speed: 0.04 });
          }],
          [Lt[1] + 3.2, b => { face('jesus', -1); face('peter', 1); nameOn(b, 'peter', '西门', [230, 222, 206], { size: 0.042, hold: 1.8 }); }],
          [Lt[1] + 6.4, b => {
            S.simon = '彼得';
            add('peter', { label: '彼得' });
            nameOn(b, 'peter', '矶法', [255, 234, 190], { size: 0.046, hold: 3.6 });
            ringOn(b, 'peter', 0.6, GOLD, PH(2) * 1.4, 1.5);
            pose('peter', 'bow');
          }],
          [Lt[1] + 9.2, () => { pose('peter', 'stand'); }],
        ]);
      },
    },

    // ── 10 · 你们将要看见天开了（约 1:43–51）── 腓力、拿但业、无花果树；神的使者上去下来 ──────
    {
      kind: 'promise', utter: '你们将要看见天开了', cmd: 'open 天 --ladder  # 神的使者上去下来在人子身上', ref: '约翰福音 1:51', tint: [255, 240, 214],
      verse: V10,
      apply(c) {
        const Lt = starts(V10);
        const fx0 = at(X.fig, 0.9);
        T(c, [
          [0, b => {
            W.goTo(0.34, 8, b.instant);
            W.set('bpDwell', 0, b.instant); W.set('bpLamp', 0, b.instant);
            W.set('bpFig', 1, b.instant);
            walk('other', 1.06, { speed: 0.03 }); rm('other'); rm('baptist');
            walk('jesus', at(0.735, 0.72), { speed: 0.03 });
            add('peter', { v: 0.12 }); add('andrew', { v: 0.08 });
            walk('peter', at(0.7, 0.8), { speed: 0.03 }); walk('andrew', at(0.765, 0.88), { speed: 0.03 });
            disciples(b, [['philip', null, '腓力', 5, 1.03, 0.4], ['nathanael', null, '拿但业', 8, fx0 + at(0.012, 0.03), 0.1]]);
            pose('nathanael', 'sit'); face('nathanael', -1);
            walk('philip', at(0.8, 0.84), { speed: 0.03 });
          }],
          [3.6, () => { face('jesus', 1); face('philip', -1); pose('jesus', 'point'); }],
          [5.2, () => { pose('jesus', 'stand'); }],
          // 腓力找着拿但业
          [Lt[1], () => { walk('philip', fx0 - at(0.025, 0.05), { speed: 0.03 }); }],
          [Lt[1] + 2.4, () => { pose('nathanael', 'stand'); face('philip', 1); }],
          [Lt[1] + 4.4, () => { walk('philip', at(0.84, 0.9), { speed: 0.03 }); walk('nathanael', at(0.8, 0.8), { speed: 0.028 }); add('nathanael', { v: 0.24 }); }],
          // 你在无花果树底下，我就看见你了
          [Lt[2], () => { face('jesus', 1); pose('jesus', 'point'); }],
          [Lt[2] + 3.2, () => { pose('jesus', 'stand'); }],
          [Lt[2] + 4.2, b => { pose('nathanael', 'kneel'); ringOn(b, 'nathanael', 0.5, GOLD, PH(2) * 1.2, 1.4); }],
          // 你们将要看见天开了，神的使者上去下来在人子身上
          [Lt[3], b => {
            RIFT.id = 'jesus';
            W.set('bpOpen', 0.85, b.instant); W.set('bpBeam', 0.8, b.instant); W.set('bpLadder', 1, b.instant);
            for (const id of ['peter', 'andrew', 'philip', 'nathanael']) pose(id, 'gaze');
            sfx(b, 'angel');
          }],
          [Lt[3] + 6.8, b => {
            W.set('bpLadder', 0, b.instant); W.set('bpOpen', 0, b.instant); W.set('bpBeam', 0, b.instant);
            for (const id of ['peter', 'andrew', 'philip', 'nathanael']) pose(id, 'stand');
          }],
        ]);
      },
    },

    // ── 11 · 把缸倒满了水（约 2:1–7）── 迦拿的娶亲筵席；六口石缸倒满了水 ────────────
    {
      kind: 'cmd', utter: '把缸倒满了水', cmd: 'fill 石缸 x6 --with 水 --to 缸口', ref: '约翰福音 2:7', tint: [214, 232, 250],
      verse: V11,
      apply(c) {
        const Lt = starts(V11);
        const n = at(8, 3);
        T(c, [
          [0, b => {
            W.goTo(0.745, 9, b.instant);
            W.set('bpFig', 0, b.instant); W.set('bpRiver', 0, b.instant);
            W.set('bare', 0.04, b.instant); W.set('grass', 0.88, b.instant); W.set('herbs', 0.7, b.instant); W.set('bloom', 0.85, b.instant);
            W.set('bpCana', 1, b.instant); W.set('bpJars', 1, b.instant); W.set('bpFill', 0, true); W.set('bpWine', 0, true);
            S.cup = null;
            walk('nathanael', 1.05, { speed: 0.03 }); rm('nathanael');
            walk('philip', 1.06, { speed: 0.03 }); rm('philip');
            crowd('guests', { n, x0: at(0.87, 0.92), x1: at(0.99, 0.995), layer: 2, label: '赴席的人', from: fromOf(b), mill: false });
            crowdDepth('guests', 0.02, 0.2, 90);
            add('mary', Object.assign({}, LOOK('mary'), { x: at(0.785, 0.8), v: 0.3, facing: -1, from: fromOf(b) }));
            add('master', { label: '管筵席的', sex: 'm', age: 'elder', robe: [150, 120, 150], accent: [220, 200, 160], x: at(0.845, 0.88), v: 0.36, facing: -1, glow: 0.16, prop: null, from: fromOf(b) });
            add('groom', { label: '新郎', sex: 'm', age: 'adult', robe: [226, 214, 186], accent: [190, 150, 90], x: at(0.905, 0.96), v: 0.3, facing: -1, glow: 0.18, from: fromOf(b) });
            add('serv1', { label: '用人', sex: 'm', age: 'adult', robe: [124, 108, 90], x: at(0.548, 0.43), v: 0.3, facing: 1, glow: 0.1, from: fromOf(b) });
            add('serv2', { label: '用人', sex: 'm', age: 'adult', robe: [112, 100, 92], x: at(0.508, 0.365), v: 0.3, facing: 1, glow: 0.1, from: fromOf(b) });
            add('jesus', { v: 0.42 }); add('peter', { v: 0.12 }); add('andrew', { v: 0.07 });
            walk('jesus', at(0.728, 0.745), { speed: 0.03 });
            walk('peter', at(0.76, 0.81), { speed: 0.03 }); walk('andrew', at(0.785, 0.87), { speed: 0.03 });
            sfx(b, 'lyre', { soft: true, far: true });
          }],
          // 酒用尽了，耶稣的母亲对他说
          [Lt[1], () => { walk('mary', at(0.752, 0.785), { speed: 0.02 }); }],
          [Lt[1] + 2, () => { face('jesus', 1); face('mary', -1); }],
          // 他母亲对用人说：她站在石缸的左边（井与石缸之间），向着井边的用人
          [Lt[1] + 4, () => { walk('mary', at(0.575, 0.475), { speed: 0.03 }); }],
          [Lt[1] + 6.4, () => { face('mary', -1); pose('mary', 'point'); face('serv1', 1); face('serv2', 1); }],
          // 把缸倒满了水
          [Lt[2], () => { pose('mary', 'stand'); face('mary', 1); face('jesus', -1); pose('jesus', 'point'); }],
          [Lt[2] + 1.8, b => {
            pose('jesus', 'stand');
            propOf('serv1', 'jar'); propOf('serv2', 'jar');
            walk('serv1', at(X.well + 0.014, 0.428), { speed: 0.035 }); walk('serv2', at(X.well - 0.012, 0.372), { speed: 0.035 });
            W.set('bpFill', 1, b.instant);
            sfx(b, 'splash', { soft: true });
          }],
          // 用人站在缸与缸之间（不挡在缸前）
          [Lt[2] + 3.6, () => {
            walk('serv1', jarX(3) + at(0.009, 0.017), { speed: 0.035 }); walk('serv2', jarX(1) + at(0.009, 0.017), { speed: 0.035 });
          }],
          [Lt[2] + 6.2, b => { pose('serv1', 'carry'); pose('serv2', 'carry'); sfx(b, 'splash', { soft: true, size: 0.8 }); }],
          [Lt[2] + 7.8, () => { pose('serv1', 'stand'); pose('serv2', 'stand'); propOf('serv1', null); propOf('serv2', null); }],
        ]);
      },
    },

    // ── 12 · 现在可以舀出来，送给管筵席的（约 2:8–11）── 水变的酒；显出他的荣耀来 ──────
    {
      kind: 'cmd', utter: '现在可以舀出来，送给管筵席的', cmd: 'map 水 → 酒 | serve 管筵席的  # 好酒留到如今', ref: '约翰福音 2:8', tint: [255, 196, 190],
      verse: V12,
      apply(c) {
        const Lt = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.765, 7, b.instant);
            W.set('bpFill', 1, true);
            W.set('bpWine', 1, b.instant);
            face('jesus', -1);
            sfx(b, 'harp', { soft: true });
          }],
          [1.4, () => { S.cup = 'serv1'; pose('serv1', 'carry'); face('serv1', 1); }],
          [2.6, () => { walk('serv1', at(0.815, 0.84), { speed: 0.03, pose: 'carry' }); }],
          // 管筵席的尝了那水变的酒……便叫新郎来
          [Lt[1], () => { S.cup = 'master'; face('master', -1); pose('master', 'raise'); pose('serv1', 'stand'); }],
          [Lt[1] + 2.2, () => { pose('master', 'point'); face('master', 1); walk('groom', at(0.875, 0.92), { speed: 0.02 }); }],
          [Lt[1] + 4.6, b => { face('groom', -1); pose('master', 'raise'); crowdPose('guests', 'raise'); sfx(b, 'timbrel', { soft: true }); sfx(b, 'laugh', { soft: true }); }],
          [Lt[1] + 7.4, () => { crowdPose('guests', 'stand'); pose('master', 'stand'); S.cup = null; }],
          // 显出他的荣耀来；他的门徒就信他了
          [Lt[2], b => {
            W.set('bpGlory', 1, b.instant);
            glow('peter', 0.34); glow('andrew', 0.3);
            face('peter', -1); face('andrew', -1);
            sfx(b, 'bell', { soft: true });
          }],
          [Lt[2] + 2.4, () => { pose('peter', 'bow'); pose('andrew', 'bow'); }],
          [Lt[2] + 6.2, b => { pose('peter', 'stand'); pose('andrew', 'stand'); W.set('bpGlory', 0.35, b.instant); }],
        ]);
      },
    },

    // ── 13 · 天国近了，你们应当悔改（太 4:12–17）── 迦百农：坐在黑暗里的百姓看见了大光 ──────
    {
      kind: 'call', utter: '天国近了，你们应当悔改', cmd: 'broadcast "天国近了" --to 迦百农', ref: '4:17', tint: [255, 226, 180],
      verse: V13,
      apply(c) {
        const Lt = starts(V13);
        const n = at(9, 6);
        T(c, [
          [0, b => {
            W.goTo(0.17, 6, b.instant);
            W.set('bpCana', 0, b.instant); W.set('bpJars', 0, b.instant); W.set('bpGlory', 0, b.instant); W.set('bpFill', 0, true); W.set('bpWine', 0, true);
            S.cup = null;
            for (const id of ['mary', 'master', 'groom', 'serv1', 'serv2', 'peter', 'andrew']) rm(id);
            uncrowd('guests');
            W.set('bpVillage', 1, b.instant);
            crowd('dark', { n, x0: at(0.52, 0.44), x1: at(0.95, 0.97), layer: 2, label: '坐在黑暗里的百姓', pose: 'sit', glow: 0.28, from: fromOf(b), mill: false });
            crowdDepth('dark', 0.16, 0.52, 130);
            add('jesus', { v: 0.3 });
            walk('jesus', at(0.7, 0.7), { speed: 0.02 });
          }],
          // 那坐在黑暗里的百姓看见了大光
          [Lt[1] - 0.8, b => { W.goTo(0.29, 9, b.instant); W.set('bpDawn', 1, b.instant); sfx(b, 'light', { soft: true }); sfx(b, 'bird', { soft: true }); }],
          [Lt[1] + 2.4, () => { crowdPose('dark', 'stand'); crowdFace('dark', -1); }],
          // 天国近了，你们应当悔改
          [Lt[2] - 0.4, b => { crowdFace('dark', 0.7); face('jesus', -1); pose('jesus', 'raise'); voice(b, 'jesus', 3, [255, 236, 200]); }],
          [Lt[2] + 2.4, () => { pose('jesus', 'point'); crowdWalk('dark', at(0.52, 0.44), at(0.65, 0.62), { speed: 0.02 }); }],
          [Lt[2] + 5.2, b => { pose('jesus', 'stand'); crowdFace('dark', 0.7); W.set('bpDawn', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 14 · 来跟从我，我要叫你们得人如得鱼一样（太 4:18–25）── 加利利海边：舍了网，舍了船 ──────
    {
      kind: 'call', utter: '来跟从我，我要叫你们得人如得鱼一样', cmd: 'git checkout -b 得人的渔夫  # 立刻舍了网', ref: '4:19', tint: [220, 236, 255],
      verse: V14,
      apply(c) {
        const Lt = starts(V14);
        const n = at(6, 4);
        // 两条船浮在水上（桌面：近岸之后的海峡；手机：近岸左边的湖面），耶稣在岸上
        const bA = () => boatBase('A')[0] / W.w, bB = () => boatBase('B')[0] / W.w;
        T(c, [
          [0, b => {
            W.goTo(0.36, 7, b.instant);
            W.set('bpDawn', 0, b.instant);
            W.set('bpBoats', 1, b.instant); W.set('bpNet', 0, true); S.netCast = false;
            crowdDepth('dark', 0.3, 0.56, 150);
            crowdWalk('dark', at(0.5, 0.76), at(0.62, 0.88), { speed: 0.02 });
            // 两条船：西门和安得烈；西庇太和他两个儿子
            add('peter', Object.assign({}, LOOK('peter'), { label: '彼得', x: bA(), v: 0, facing: -1, pose: 'stand', from: fromOf(b) }));
            attach('peter', seatFn('A', -0.35));
            disciples(b, [['andrew', null, '安得烈', 0, bA(), 0]]);
            attach('andrew', seatFn('A', 0.45)); pose('andrew', 'sit');
            add('zebedee', { label: '西庇太', sex: 'm', age: 'elder', robe: [118, 104, 88], x: bB(), v: 0, facing: -1, pose: 'sit', prop: null, glow: 0.12, from: fromOf(b) });
            attach('zebedee', seatFn('B', 0.5));
            disciples(b, [['james', null, '雅各', 6, bB(), 0]]);
            attach('james', seatFn('B', -0.05)); pose('james', 'sit');
            add('john', Object.assign({}, LOOK('john'), { x: bB(), v: 0, facing: -1, pose: 'sit', from: fromOf(b) }));
            attach('john', seatFn('B', -0.5));
            // 耶稣在加利利海边行走
            add('jesus', { v: 0.22 });
            walk('jesus', at(0.72, 0.52), { speed: 0.02 });
            sfx(b, 'wave', { soft: true });
          }],
          // 在海里撒网
          [2.4, b => { pose('peter', 'raise'); tween(b, 'throw', 1.4); sfx(b, 'splash', { soft: true, size: 0.6 }); }],
          [3.8, b => { W.set('bpNet', 1, b.instant); S.netCast = true; pose('peter', 'stand'); sfx(b, 'splash', { size: 0.9 }); }],
          // 来跟从我
          [Lt[1], () => { face('jesus', -1); pose('jesus', 'point'); face('peter', 1); face('andrew', 1); }],
          [Lt[1] + 2.8, b => {
            pose('jesus', 'stand');
            descend(b, 'peter', at(0.69, 0.47), 1.4, 0.14);
            descend(b, 'andrew', at(0.665, 0.455), 1.6, 0.22);
          }],
          [Lt[1] + 4.6, () => {
            grounded('peter'); grounded('andrew');
            // 跟从了他：彼得、安得烈跟在他后面（他的左边），各站一处
            walk('jesus', at(0.775, 0.6), { speed: 0.025 });
            walk('peter', at(0.748, 0.57), { speed: 0.022 }); walk('andrew', at(0.721, 0.54), { speed: 0.022 });
          }],
          // 西庇太的儿子雅各和他兄弟约翰
          [Lt[2] + 1.6, () => { face('jesus', at(1, -1)); pose('jesus', 'point'); pose('james', 'stand'); pose('john', 'stand'); face('james', -1); face('john', -1); }],
          [Lt[2] + 4.2, b => {
            pose('jesus', 'stand');
            // 舍了船、别了父亲：跳上岸，站到他的右边
            descend(b, 'james', at(0.805, 0.63), 1.5, 0.12);
            descend(b, 'john', at(0.832, 0.66), 1.7, 0.2);
          }],
          [Lt[2] + 6.2, () => {
            grounded('james'); grounded('john');
            face('james', -1); face('john', -1); face('peter', 1); face('andrew', 1);
          }],
          // 许多人来跟着他
          [Lt[3], b => {
            crowd('many', { n, x0: 1.03, x1: 1.14, layer: 2, label: '许多人', from: fromOf(b), mill: false });
            crowdDepth('many', 0.1, 0.4, 170);
            crowdWalk('many', at(0.87, 0.9), at(0.985, 0.99), { speed: 0.04 });
            crowdWalk('dark', at(0.5, 0.76), at(0.62, 0.88), { speed: 0.02 });
            sfx(b, 'crowd', { soft: true });
          }],
          // 他转向跟着他的许多人
          [Lt[3] + 4.4, () => { crowdFace('many', -1); crowdFace('dark', at(1, 0.6)); face('jesus', 1); }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '受洗', sub: '马太福音 3 — 4 · 约翰福音 1 — 2', tint: [220, 236, 255], music: 'flood',
    outro: 24,
    intro: INTRO,
    // 全书终后，按住本幕的人与物，显出与它相关的经文
    behold: {
      '施洗约翰': { text: '有一个人，是从神那里差来的，名叫约翰。', ref: JN('1:6') },
      '耶稣': { text: '从天上有声音说：「这是我的爱子，我所喜悦的。」', ref: MT('3:17') },
      '约旦河': { text: '耶稣受了洗，随即从水里上来。天忽然为他开了，他就看见神的灵仿佛鸽子降下，落在他身上。', ref: MT('3:16') },
      '众人': { text: '那时，耶路撒冷和犹太全地，并约旦河一带地方的人，都出去到约翰那里', ref: MT('3:5') },
      '受洗的人': { text: '承认他们的罪，在约旦河里受他的洗。', ref: MT('3:6') },
      '受了洗的人': { text: '承认他们的罪，在约旦河里受他的洗。', ref: MT('3:6') },
      '殿顶': { text: '魔鬼就带他进了圣城，叫他站在殿顶上', ref: MT('4:5') },
      '耶路撒冷': { text: '那时，耶路撒冷和犹太全地，并约旦河一带地方的人，都出去到约翰那里', ref: MT('3:5') },
      '石头': { text: '那试探人的进前来，对他说：「你若是神的儿子，可以吩咐这些石头变成食物。」', ref: MT('4:3') },
      '最高的山': { text: '魔鬼又带他上了一座最高的山，将世上的万国与万国的荣华都指给他看', ref: MT('4:8') },
      '天使': { text: '于是，魔鬼离了耶稣，有天使来伺候他。', ref: MT('4:11') },
      '安得烈': { text: '他先找着自己的哥哥西门，对他说：「我们遇见弥赛亚了。」', ref: JN('1:41') },
      '另一个门徒': { text: '两个门徒听见他的话，就跟从了耶稣。', ref: JN('1:37') },
      '住处': { text: '他们就去看他在哪里住，这一天便与他同住；那时约有申正了。', ref: JN('1:39') },
      '西门': { text: '耶稣看着他，说：「你是约翰的儿子西门，你要称为矶法。」', ref: JN('1:42') },
      '彼得': { text: '耶稣看着他，说：「你是约翰的儿子西门，你要称为矶法。」（矶法翻出来就是彼得。）', ref: JN('1:42') },
      '腓力': { text: '又次日，耶稣想要往加利利去，遇见腓力，就对他说：「来跟从我吧。」', ref: JN('1:43') },
      '拿但业': { text: '拿但业说：「拉比，你是神的儿子，你是以色列的王！」', ref: JN('1:49') },
      '无花果树': { text: '耶稣回答说：「腓力还没有招呼你，你在无花果树底下，我就看见你了。」', ref: JN('1:48') },
      '马利亚': { text: '他母亲对用人说：「他告诉你们什么，你们就做什么。」', ref: JN('2:5') },
      '管筵席的': { text: '管筵席的尝了那水变的酒，并不知道是哪里来的，只有舀水的用人知道。', ref: JN('2:9') },
      '新郎': { text: '「人都是先摆上好酒，等客喝足了，才摆上次的，你倒把好酒留到如今！」', ref: JN('2:10') },
      '用人': { text: '耶稣对用人说：「把缸倒满了水。」他们就倒满了，直到缸口。', ref: JN('2:7') },
      '赴席的人': { text: '第三日，在加利利的迦拿有娶亲的筵席，耶稣的母亲在那里。', ref: JN('2:1') },
      '娶亲的家': { text: '第三日，在加利利的迦拿有娶亲的筵席，耶稣的母亲在那里。', ref: JN('2:1') },
      '石缸': { text: '照犹太人洁净的规矩，有六口石缸摆在那里，每口可以盛两三桶水。', ref: JN('2:6') },
      '迦百农': { text: '后又离开拿撒勒，往迦百农去，就住在那里。那地方靠海，在西布伦和拿弗他利的边界上。', ref: MT('4:13') },
      '坐在黑暗里的百姓': { text: '那坐在黑暗里的百姓看见了大光；坐在死荫之地的人有光发现照着他们。', ref: MT('4:16') },
      '船': { text: '耶稣在加利利海边行走，看见弟兄二人……在海里撒网；他们本是打鱼的。', ref: MT('4:18') },
      '网': { text: '他们就立刻舍了网，跟从了他。', ref: MT('4:20') },
      '西庇太的船': { text: '同他们的父亲西庇太在船上补网，耶稣就招呼他们', ref: MT('4:21') },
      '西庇太': { text: '他们立刻舍了船，别了父亲，跟从了耶稣。', ref: MT('4:22') },
      '雅各': { text: '从那里往前走，又看见弟兄二人，就是西庇太的儿子雅各和他兄弟约翰', ref: MT('4:21') },
      '约翰': { text: '他们立刻舍了船，别了父亲，跟从了耶稣。', ref: MT('4:22') },
      '许多人': { text: '当下，有许多人从加利利、低加坡里、耶路撒冷、犹太、约旦河外来跟着他。', ref: MT('4:25') },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._baptism = { get S() { return S; }, X, rv, rPt, riverAtV, pinTop, cragTop, boatAt, riftPt, dovePos,
    D: { drawJordan, drawPath, drawVillage, drawCana, drawDwelling, drawTemple, drawCrag, drawFig, drawStones, drawWell, drawJars, drawCity, drawKingdoms, drawRift, drawWaders, drawLanterns, drawDawn, drawGlory, drawBeam, drawLadder, drawShadow, drawLead, drawDove, drawNightRim, drawBoat, drawNet } };
})(window.GS);
