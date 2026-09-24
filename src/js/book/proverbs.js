/* ─────────────────────────────────────────────────────────────
 * book/proverbs.js —— 箴言 · 智慧（箴言 1 — 31）
 *
 * 一日一夜又一个早晨，一座有城门的城，城外一户人家、一块麦田、一棵橄榄树。
 * 黎明，「智慧」（一位光中的妇人）在城门口呼喊，光如雨浇灌听的人；亵慢人转身进城去。
 * 「他必指引你的路」——一条光的路自家门铺到城门，越照越明，直到日午；我儿走在其上。
 * 「人所行的道都在耶和华眼前」——一束眼目的光扫过全地，停在田边：一圈光中放大了蚂蚁的动作，
 *   它们衔着麦粒排成一行进窝；树荫下的懒惰人抱着手躺卧。
 * 本卷的签名之景（箴 3:19–20、8:22–31）：「耶和华以智慧立地，以聪明定天」——天地沉入太初的黑暗（本卷自画的一层暗），
 *   只剩一点金光（智慧）。工师的金线：大水的泉源、未奠定的山（虚线）、高天的弧（弧下的天随笔揭开）、渊面上的圆圈（圆规）；
 *   「为沧海定出界限……立定大地的根基」——海岸与山脊一层层描出，笔到哪里黑暗就揭开到哪里，地下立起发光的根基之柱；
 *   天亮了，金线在光明的地上留一会儿才隐去；那点光在全地上踊跃，落回人间，重又成为城门口的妇人。
 * 「你们来，吃我的饼，喝我调和的酒」——七根柱子一根根自地里立起（第二幅签名之景），筵席发光，使女出去呼叫；
 *   众人进到柱子之间坐席，使女捧着酒瓶、端着饼站在旁边（没有人向智慧跪拜）。
 * 生命的泉源自房屋的门槛下涌出，流过麦田的陇沟入海，岸边长出生命树；父亲与智慧之子相拥。
 * 人心筹算自己的道路（一道淡淡的虚线向西），惟耶和华指引他的脚步（金色的脚印一个个亮起，向城门去）。
 * 暴风雨，众人奔入坚固台；雨过天晴。黄昏，窗里的灯与人心里的灯一盏盏亮起，陇沟的水映着晚霞随意流转。
 * 夜里城中的灯一盏盏熄了，隐秘的众星显出来；惟有她的灯终夜不灭。黎明，羊群出城，躺卧在安稳里。
 * 亚古珥问：谁聚风在掌握中？——大风被收拢成一点；谁包水在衣服里？——一层光的衣裳盖在海上；
 *   鹰在空中、蛇在磐石、船在海中，各留下一道光的「道」。
 * 末了：羊群出城去了；才德的妇人走到城门口，她丈夫与长老同坐在城门旁的石凳上；儿女起来称她有福；
 *   日头西斜，她的工作在城门口荣耀她。
 *
 * 画面的方位：近岸从左到右——葡萄园、家、橄榄树（懒惰人）、麦田（蚁窝）、智慧的房屋、城门前的空场、城门、城（坚固台）。
 * 一切位置都以画面宽度的比例记下；一切状态只在 setup / apply / 情节里设定（瞬间重演时一样）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'proverbs';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  [
    ['pvWis', 'exp', 0.8],      // 智慧（光中的妇人）身上的光
    ['pvPour', 'exp', 0.9],     // 我要将我的灵浇灌你们（1:23）：光如雨落下
    ['pvPath', 'lin', 0.075],   // 光的路自家门铺到城门（3:6）
    ['pvPathG', 'exp', 0.35],   // 路的光（越照越明，4:18）
    ['pvEye', 'exp', 0.7],      // 耶和华的眼目（5:21）：扫过全地的一束光
    ['pvEyeX', 'exp', 0.45],    // 那束光落在哪里（画面宽度的比例）
    ['pvLens', 'exp', 0.9],     // 察看蚂蚁的动作（6:6）：放大的一圈
    ['pvStar', 'exp', 0.6],     // 太初：只剩一点光（8:22）
    ['pvSketch', 'exp', 0.35],  // 大山未曾奠定（8:25）：虚线的山
    ['pvVault', 'lin', 0.36],   // 他立高天（8:27）：一道弧
    ['pvCircle', 'lin', 0.3],   // 在渊面的周围划出圆圈（8:27）
    ['pvDark', 'exp', 0.45],    // 太初的黑暗（本卷自画的一层暗，随工师的笔一段段揭开）
    ['pvFirm', 'exp', 0.6],     // 上使穹苍坚硬（8:28）
    ['pvSprings', 'exp', 0.5],  // 大水的泉源（8:24、28）
    ['pvBound', 'lin', 0.3],    // 为沧海定出界限（8:29）：海岸与山脊的金线
    ['pvFound', 'lin', 0.3],    // 立定大地的根基（8:29）：根基的垂线
    ['pvDraft', 'exp', 0.6],    // 工师的金线整体的显隐
    ['pvDance', 'lin', 0.105],  // 常常在他面前踊跃（8:30）：那点光飞过全地
    ['pvHouse', 'lin', 0.12],   // 智慧建造房屋，凿成七根柱子（9:1）
    ['pvFeast', 'exp', 0.5],    // 设摆筵席（9:2）
    ['pvSpring', 'exp', 0.7],   // 生命的泉源（14:27）
    ['pvStream', 'lin', 0.14],  // 泉水流成溪，入海
    ['pvTree', 'lin', 0.1],     // 生命树（11:30）
    ['pvChan', 'lin', 0.18],    // 水进了麦田的陇沟
    ['pvChanG', 'exp', 0.5],    // 陇沟的水映着晚霞（21:1）
    ['pvPlan', 'exp', 0.8],     // 人心筹算自己的道路（16:9）：一道淡虚线
    ['pvSteps', 'lin', 0.09],   // 惟耶和华指引他的脚步：金色的脚印
    ['pvTower', 'exp', 0.55],   // 耶和华的名是坚固台（18:10）
    ['pvRise', 'lin', 0.25],    // 坚固台在暴风雨中升高（此后一直高）
    ['pvLamps', 'lin', 0.12],   // 城中窗里的灯（一盏盏亮起、熄灭）
    ['pvMom', 'exp', 0.6],      // 她的灯终夜不灭（31:18）
    ['pvSouls', 'exp', 0.45],   // 人的灵是耶和华的灯（20:27）
    ['pvHidden', 'exp', 0.22],  // 将事隐秘乃神的荣耀（25:2）：隐秘的众星
    ['pvFire', 'exp', 0.35],    // 城门口守夜的火（26:20 火缺了柴就必熄灭）
    ['pvRest', 'exp', 0.4],     // 必得安稳（29:25）：羊群躺卧处的光
    ['pvWind', 'exp', 0.9],     // 谁聚风在掌握中（30:4）
    ['pvFist', 'lin', 0.3],     // 风被收拢
    ['pvWrap', 'exp', 0.5],     // 谁包水在衣服里（30:4）
    ['pvWonder', 'exp', 0.4],   // 鹰、蛇、船的道（30:19）
    ['pvShip', 'lin', 0.018],   // 船在海中行
    ['pvPraise', 'exp', 0.45],  // 她的工作在城门口荣耀她（31:31）
    ['pvBench', 'exp', 0.8],    // 城门旁长老坐的石凳（31:23）
  ].forEach(d => W.defineLevel(d[0], d[1], d[2]));
  const LVNAMES = ['pvWis', 'pvPour', 'pvPath', 'pvPathG', 'pvEye', 'pvEyeX', 'pvLens', 'pvStar', 'pvSketch', 'pvVault', 'pvCircle', 'pvDark', 'pvFirm',
    'pvSprings', 'pvBound', 'pvFound', 'pvDraft', 'pvDance', 'pvHouse', 'pvFeast', 'pvSpring', 'pvStream', 'pvTree', 'pvChan', 'pvChanG', 'pvPlan',
    'pvSteps', 'pvTower', 'pvRise', 'pvLamps', 'pvMom', 'pvSouls', 'pvHidden', 'pvFire', 'pvRest', 'pvWind', 'pvFist', 'pvWrap', 'pvWonder', 'pvShip', 'pvPraise', 'pvBench'];

  // ── 地上的位置（画面宽度的比例）──────────────────────────────
  const X = {
    vine0: 0.405, vine1: 0.435, home: 0.452, olive: 0.497, slug: 0.506,
    f0: 0.522, f1: 0.592, nest: 0.585, life: 0.607, spring: 0.626, h7: 0.684, plaza0: 0.738, plaza1: 0.776,
    gate: 0.81, t0: 0.838, t1: 1.05, tower: 0.945, rock: 0.556, flock0: 0.79, flock1: 0.895,
  };
  const NEST_V = 0.07, FV0 = 0.1, PATH_V = 0.035;
  const WIS = X.gate - 0.026;   // 智慧在城门口站立之处
  const fv1 = () => (port() ? 0.3 : 0.36);
  const ROBE = {
    wisdom: [242, 228, 192], father: [92, 84, 110], mother: [132, 72, 108], son: [88, 118, 150], child: [176, 132, 92],
    slug: [128, 112, 90], maid: [214, 196, 160], shep: [124, 98, 70], mock: [96, 80, 72],
  };
  const FOLK = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [104, 96, 110], [140, 96, 80], [158, 138, 108], [120, 100, 84]];
  const ELDER = [[128, 112, 92], [110, 100, 88], [140, 126, 104], [96, 90, 84], [150, 132, 100]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { folk: 0, flock: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
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
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const L = n => W.lv[n] || 0;
  // 经文所在处（横屏：左侧海上，约自 60vh 起；竖屏：顶上）——工师的金线在那里淡到两成（边缘柔和）
  function textMask(x, y) {
    if (port()) return 1 - 0.82 * (1 - smoothstep(W.h * 0.34, W.h * 0.4, y));
    const ix = 1 - smoothstep(W.w * 0.47, W.w * 0.53, x);
    const iy = smoothstep(W.h * 0.49, W.h * 0.54, y) * (1 - smoothstep(W.h * 0.86, W.h * 0.92, y));
    return 1 - 0.82 * ix * iy;
  }
  function inText(x, y) { return textMask(x, y) < 0.6; }

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.holdHands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (!has(a) || !has(b)) return; if (c.embrace) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return;
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)));
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  // 一群人都转向某处（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  const dress = (pal, v0, v1) => (m, i) => { m.robe = pal[i % pal.length]; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };
  const elders = (m, i) => { m.sex = 'm'; m.age = 'elder'; m.robe = ELDER[i % ELDER.length]; m.prop = 'staff'; m.beardOpt = true; m.accent = null; m.v = 0.02 + (i % 2) * 0.05; };

  const inst = b => !!(b && b.instant) || !!W.replaying;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function sfx(b, name, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o || {}));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.7, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - 44 * LS(l) * k];
  }
  function ringOn(b, id, rgb, r) {
    if (inst(b) || !fx()) return;
    const h = headOf(id, 0.55);
    fx().ring(h[0], h[1], rgb || [255, 236, 190], M() * (r || 0.18), 2.4, 1.6);
  }
  function sparkleOn(b, id, n, rgb) {
    if (inst(b) || !fx()) return;
    const h = headOf(id, 0.6);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人站在地面的前后（v）：缓缓挪到（重演时立即到位；SCENE.update 里推进）
  function vTo(m, v) { if (!m) return; if (W.replaying) { m.v = v; m.pvTv = null; } else m.pvTv = v; }
  const vToId = (id, v) => vTo(fig(id), v);
  // 一群人各走到指定的位置（确定的，不随机），到了换成 pose；vs：各人的前后
  function cplace(gid, xs, o, vs) {
    const ms = cmembers(gid);
    if (!ms.length) return;
    C().crowdWalk(gid, 0.5, 0.5, o);
    ms.forEach((m, i) => {
      const x = xs[i % xs.length];
      if (W.replaying) { if (Math.abs(x - m.nx) > 1e-4) m.facing = m.fd = x > m.nx ? 1 : -1; m.nx = x; m.tx = null; }
      else { m.tx = x; m.facing = x >= m.nx ? 1 : -1; }
      if (vs) vTo(m, vs[i % vs.length]);
    });
  }
  // 沿一串点洒下几簇光点（只是装饰）
  function burstAt(b, pts, n, rgb) {
    if (inst(b) || !fx()) return;
    for (const p of pts) if (p && isFinite(p[0]) && isFinite(p[1])) fx().sparkle(p[0], p[1], n || 10, rgb || [255, 232, 170], 14 * SU(), 'top');
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!inst(b)) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  精灵图与模型（离屏预绘；Path2D 缓存）
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
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([214, 226, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        water: radial([190, 226, 255], 1, 0.4),
      };
      // 自天而降的光柱
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  // 银河（隐秘的众星）：按屏幕的尺寸直接画成一张（不拉伸，星是清楚的点），剪在地平线以上
  let MILKY = null;
  function milky() {
    const dpr = Math.min(2, W.dpr || 1), hz = Math.max(4, Math.floor(W.horizonY - 1));
    const key = W.w + '|' + W.h + '|' + dpr + '|' + hz;
    if (MILKY && MILKY.key === key) return MILKY;
    try {
      const c = MILKY && MILKY.c ? MILKY.c : document.createElement('canvas');
      c.width = Math.max(4, Math.ceil(W.w * dpr)); c.height = Math.ceil(hz * dpr);
      const q = c.getContext('2d'), r = U.mulberry32(77), pt = port();
      q.setTransform(dpr, 0, 0, dpr, 0, 0);
      q.clearRect(0, 0, W.w, hz);
      // 一条斜的光带：自东北（右上）向西南；长 BL，宽 BH（x 与 y 等比）
      const BL = Math.hypot(W.w, hz) * 1.15, BH = Math.min(W.w, W.h) * (pt ? 0.22 : 0.2);
      q.translate(W.w * (pt ? 0.55 : 0.62), hz * (pt ? 0.5 : 0.45));
      q.rotate(pt ? -1.05 : -0.42);
      for (let i = 0; i < 240; i++) {
        const x = (r() - 0.5) * BL, y = (r() - 0.5) * BH * (0.35 + 0.65 * r()), rad = BH * (0.08 + r() * 0.2);
        const gr = q.createRadialGradient(x, y, 0, x, y, rad);
        const a = 0.045 + r() * 0.06;
        gr.addColorStop(0, 'rgba(210,220,255,' + a.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(210,220,255,0)');
        q.fillStyle = gr; q.beginPath(); q.arc(x, y, rad, 0, TAU); q.fill();
      }
      // 暗的尘带（中线稍偏）
      for (let i = 0; i < 40; i++) {
        const x = (r() - 0.5) * BL * 0.8, y = BH * (0.04 + (r() - 0.5) * 0.08), rad = BH * (0.05 + r() * 0.08);
        const gr = q.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, 'rgba(0,0,0,0.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        q.globalCompositeOperation = 'destination-out';
        q.fillStyle = gr; q.beginPath(); q.arc(x, y, rad, 0, TAU); q.fill();
        q.globalCompositeOperation = 'source-over';
      }
      // 细星：带中密、带边疏，0.9–1.5 像素的点
      q.fillStyle = 'rgb(240,244,255)';
      const n = pt ? 520 : 760;
      for (let i = 0; i < n; i++) {
        const x = (r() - 0.5) * BL, y = (r() + r() + r() - 1.5) * BH * 0.42;
        const big = r() < 0.12, sz = big ? 1.5 : 0.9;
        q.globalAlpha = (big ? 0.55 : 0.3) + 0.4 * r();
        q.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      }
      q.globalAlpha = 1;
      q.setTransform(1, 0, 0, 1, 0, 0);
      MILKY = { c, key, hz };
    } catch (e) { MILKY = null; }
    return MILKY;
  }
  let ctxA = null;   // 当前绘制的画布（glowAt 用）
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0) || !ctxA) return;
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

  // 树：以树高为 1（y 向上为负）；橄榄树的树冠宽而低，生命树的树冠圆而满、结金色的果子
  let MOD = null;
  function mkTree(seed, spread, crownY, fruit) {
    const R = U.mulberry32(seed);
    const m = { trunk: new Path2D(), back: new Path2D(), front: new Path2D(), hi: new Path2D(), fruit: [] };
    const tw = 0.05;
    m.trunk.moveTo(-tw * 1.8, 0);
    m.trunk.quadraticCurveTo(-tw * 0.4, -0.16, -tw * 1.2, -0.3);
    m.trunk.quadraticCurveTo(-tw * 2.2, -0.42, -spread * 0.42, crownY + 0.06);
    m.trunk.lineTo(-spread * 0.36, crownY + 0.02);
    m.trunk.quadraticCurveTo(-tw * 0.3, -0.42, 0, -0.4);
    m.trunk.quadraticCurveTo(tw * 0.5, crownY + 0.1, spread * 0.1, crownY - 0.06);
    m.trunk.lineTo(spread * 0.18, crownY - 0.03);
    m.trunk.quadraticCurveTo(tw * 1.6, -0.44, spread * 0.4, crownY + 0.04);
    m.trunk.lineTo(spread * 0.44, crownY + 0.08);
    m.trunk.quadraticCurveTo(tw * 1.4, -0.34, tw * 1.1, -0.26);
    m.trunk.quadraticCurveTo(tw * 0.5, -0.12, tw * 1.9, 0);
    m.trunk.closePath();
    const N = 30;
    for (let i = 0; i < N; i++) {
      const a = R() * TAU, rr = i < N * 0.45 ? 0.7 + R() * 0.3 : Math.sqrt(R()) * 0.85;
      const x = Math.cos(a) * spread * rr;
      let y = crownY + Math.sin(a) * 0.2 * rr;
      if (y > crownY) y = crownY + (y - crownY) * 0.7;
      const r = 0.085 + R() * 0.07;
      const up = y < crownY - 0.02;
      const path = up && R() < 0.8 ? m.front : m.back;
      path.moveTo(x + r, y); path.ellipse(x, y, r, r * 0.7, (R() - 0.5) * 0.6, 0, TAU);
      if (up && R() < 0.55) { m.hi.moveTo(x - r * 0.25 + r * 0.5, y - r * 0.25); m.hi.ellipse(x - r * 0.25, y - r * 0.25, r * 0.5, r * 0.32, 0, 0, TAU); }
      if (fruit && R() < 0.65) m.fruit.push([x + (R() - 0.5) * r, y + r * 0.35]);
    }
    return m;
  }
  function models() {
    if (MOD) return MOD;
    if (typeof Path2D === 'undefined') return null;
    try { MOD = { olive: mkTree(11, 0.46, -0.66, false), life: mkTree(29, 0.4, -0.68, true) }; } catch (e) { MOD = null; }
    return MOD;
  }
  function drawTree(ctx, m, x, y, H, l, o) {
    if (!m || H < 1) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(H, H);
    ctx.fillStyle = css(o.bark || [78, 62, 48], l); ctx.fill(m.trunk);
    ctx.fillStyle = css(o.leaf2, l); ctx.fill(m.back);
    ctx.fillStyle = css(o.leaf, l); ctx.fill(m.front);
    ctx.fillStyle = css(mix(o.leaf, [250, 240, 200], 0.4), l, 0.5 * dayA(), 0.15); ctx.fill(m.hi);
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：城（中丘与近岸的房屋、城墙、城门、坚固台）
  // ════════════════════════════════════════════════════════════
  // 一座房屋的门窗位置（房屋本身与夜里的灯共用）
  function houseGeo(l, x, y, w, h, o) {
    const s = LS(l), d = litX() >= x ? 1 : -1;
    const dx = x + (o.door != null ? o.door : 0) * w, dw = 4.4 * s, dh = Math.min(h * 0.62, 9 * s);
    const wx = x + (o.win != null ? o.win : 0.28) * w * d, wy = y - h * 0.72;
    return { s, d, dx, dw, dh, wx, wy };
  }
  // 房屋本身（可预绘）：o.yl / o.yr = 左右两角的地面（坡上的房屋两角都落在地上）
  function house(ctx, l, x, y, w, h, tone, o) {
    o = o || {};
    const { s, d, dx, dw, dh, wx, wy } = houseGeo(l, x, y, w, h, o);
    const yl = o.yl != null ? o.yl : y, yr = o.yr != null ? o.yr : y, top = Math.min(yl, yr, y) - h;
    ctx.fillStyle = css(tone, l);
    ctx.beginPath(); ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w / 2, yr); ctx.lineTo(x - w / 2, yl); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), l, 0.9);
    const sw = w * 0.22;
    if (d > 0) { ctx.beginPath(); ctx.moveTo(x - w / 2, top); ctx.lineTo(x - w / 2 + sw, top); ctx.lineTo(x - w / 2 + sw, lerp(yl, yr, 0.22)); ctx.lineTo(x - w / 2, yl); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(x + w / 2 - sw, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w / 2, yr); ctx.lineTo(x + w / 2 - sw, lerp(yl, yr, 0.78)); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.3), l);
    ctx.fillRect(x - w / 2 - 1.2 * s, top - 1.8 * s, w + 2.4 * s, 2 * s);
    ctx.fillStyle = css([28, 22, 18], l);
    if (o.door !== false) ctx.fillRect(dx - dw / 2, y - dh, dw, dh);
    if (o.win !== false) ctx.fillRect(wx - 1.5 * s, wy - 1.5 * s, 3 * s, 3 * s);
    ctx.strokeStyle = css([255, 240, 214], l, 0.42 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 1.2 * s, top - 1.8 * s); ctx.lineTo(x + w / 2 + 1.2 * s, top - 1.8 * s);
    if (d > 0) { ctx.moveTo(x + w / 2, top); ctx.lineTo(x + w / 2, yr); } else { ctx.moveTo(x - w / 2, top); ctx.lineTo(x - w / 2, yl); }
    ctx.stroke();
  }
  // 房屋的灯（每帧画：窗、门里的光）；o.wallTop：此处城墙的顶，墙后的门与低窗不透光
  function houseLamp(ctx, l, x, y, w, h, lk, o) {
    if (lk <= 0.02 || !SP) return;
    o = o || {};
    const { s, dx, dw, dh, wx, wy } = houseGeo(l, x, y, w, h, o);
    const winOn = o.win !== false && !(o.wallTop != null && wy + 1.5 * s > o.wallTop);
    const doorOn = o.door !== false && o.wallTop == null;
    if (!winOn && !doorOn) return;
    const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + x * 0.1);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, lk * fl * 0.9);
    ctx.fillStyle = 'rgb(255,178,98)';
    if (winOn) ctx.fillRect(wx - 1.5 * s, wy - 1.5 * s, 3 * s, 3 * s);
    if (doorOn) { ctx.globalAlpha = Math.min(1, lk * fl * 0.5); ctx.fillRect(dx - dw / 2, y - dh, dw, dh); }
    glowAt(SP.warm, winOn ? wx : dx, winOn ? wy : y - dh * 0.6, (winOn ? 13 : 20) * s, lk * fl * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const TOWN = { near: null, mid: null };
  function townModel(layer) {
    const r = U.mulberry32(layer === 2 ? 4411 : 911), hs = [];
    const x0 = layer === 2 ? X.t0 + 0.012 : 0.73, x1 = layer === 2 ? X.t1 : 0.99;
    const n = layer === 2 ? 8 : 9;
    for (let i = 0; i < n; i++) {
      const xf = x0 + (x1 - x0) * (i + 0.15 + r() * 0.7) / n;
      hs.push({ xf, w: 18 + r() * 12, h: 14 + r() * (layer === 2 ? 10 : 6), lift: r() < 0.6 ? (layer === 2 ? 6 + r() * 14 : 2 + r() * 5) : 0, door: (r() - 0.5) * 0.5, win: r() < 0.85 ? (r() - 0.5) * 0.7 : false, tone: r(), k: 0 });
    }
    hs.sort((a, b) => b.lift - a.lift);
    // 灯亮 / 熄的先后
    const ord = hs.map((q, i) => i).sort((a, b) => hsh(a * 7.3 + layer) - hsh(b * 7.3 + layer));
    ord.forEach((i, k) => { hs[i].k = k; });
    return hs;
  }
  function townEach(layer, fn) {
    const key = layer === 2 ? 'near' : 'mid';
    if (!TOWN[key]) TOWN[key] = townModel(layer);
    const hs = TOWN[key], s = LS(layer);
    for (const q of hs) {
      if (layer === 2 && q.xf > X.tower - 0.02 && q.xf < X.tower + 0.02) continue;
      const x = q.xf * W.w, g = gY(layer, q.xf) + 2 * s, lift = q.lift * s, h = q.h * s + lift, w = q.w * s;
      fn(q, x, g, w, h, { door: lift > 0 ? false : q.door, win: q.win }, hs.length);
    }
  }
  function drawTown(ctx, layer) {
    townEach(layer, (q, x, g, w, h, o) => house(ctx, layer, x, g, w, h, mix([196, 178, 146], [222, 208, 180], q.tone), o));
  }
  // 城中窗里的灯（一盏盏亮起、熄灭）
  function drawTownLamps(ctx, layer) {
    const lv = L('pvLamps');
    if (lv < 0.005) return;
    const nk = clamp(0.25 + nightK(), 0, 1), s = LS(2), wallX = X.gate * W.w + 15 * s;
    townEach(layer, (q, x, g, w, h, o, n) => {
      const lk = clamp(lv * (n + 1) - q.k, 0, 1) * nk;
      if (lk <= 0.02) return;
      if (layer === 2 && x > wallX) o.wallTop = gY(2, q.xf) + 2 * s - 15 * s;
      houseLamp(ctx, layer, x, g, w, h, lk, o);
    });
  }
  function gateDims() { const s = LS(2); return { s, x: X.gate * W.w, y: gY(2, X.gate) + 2 * s }; }
  // 城墙：城门以东一道带垛口的矮墙，城中的房屋从墙头露出
  function drawWall(ctx) {
    const { s } = gateDims();
    const xa = X.gate * W.w + 15 * s, xb = W.w + 12;
    const stone = [184, 166, 136];
    const N = 14, hW = 15 * s;
    ctx.fillStyle = css(stone, 2);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(xa, xb, i / N), y = gY(2, x / W.w) + 2 * s - hW; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(xa, xb, i / N); ctx.lineTo(x, gY(2, x / W.w) + 3 * s); }
    ctx.closePath(); ctx.fill();
    // 垛口
    const step = 7 * s;
    ctx.beginPath();
    for (let x = xa + 1.5 * s; x < xb; x += step) { const y = gY(2, x / W.w) + 2 * s - hW; ctx.rect(x, y - 3 * s, 3.6 * s, 3 * s); }
    ctx.fill();
    // 石缝（淡）
    ctx.strokeStyle = css(mix(stone, [60, 50, 40], 0.4), 2, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let k = 1; k < 3; k++) {
      for (let i = 0; i <= N; i++) { const x = lerp(xa, xb, i / N), y = gY(2, x / W.w) + 2 * s - hW * k / 3; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    }
    ctx.stroke();
    ctx.strokeStyle = css([255, 240, 214], 2, 0.38 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(xa, xb, i / N), y = gY(2, x / W.w) + 2 * s - hW; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
  }
  function drawGate(ctx) {
    const { s, x, y } = gateDims();
    const stone = [182, 164, 134], dark = mix(stone, [40, 32, 28], 0.32);
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css(stone, 2);
    ctx.fillRect(x - 8 * s, y - 27 * s, 16 * s, 9 * s);
    ctx.fillStyle = css([22, 18, 15], 2);
    ctx.beginPath(); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 6 * s, y - 14 * s); ctx.quadraticCurveTo(x, y - 20.5 * s, x + 6 * s, y - 14 * s); ctx.lineTo(x + 6 * s, y); ctx.closePath(); ctx.fill();
    for (const side of [-1, 1]) {
      const tx = x + side * 11 * s, tw = 10 * s, th = 32 * s;
      ctx.fillStyle = css(stone, 2);
      ctx.fillRect(tx - tw / 2, y - th, tw, th);
      ctx.fillStyle = css(dark, 2, 0.85);
      ctx.fillRect(d * side > 0 ? tx - tw / 2 : tx + tw / 2 - tw * 0.3, y - th, tw * 0.3, th);
      ctx.fillStyle = css(stone, 2);
      for (let k = 0; k < 3; k++) ctx.fillRect(tx - tw / 2 + k * tw * 0.4 - 0.2 * s, y - th - 3 * s, tw * 0.24, 3 * s);
      ctx.fillStyle = css([30, 24, 20], 2);
      ctx.fillRect(tx - 1 * s, y - th * 0.7, 2 * s, 4 * s);
      ctx.strokeStyle = css([255, 240, 214], 2, 0.4 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(tx - tw / 2, y - th); ctx.lineTo(tx + tw / 2, y - th); ctx.stroke();
    }
  }
  // 城门口守夜的火（26:20：火缺了柴就必熄灭）——每帧画
  function drawGateFire(ctx) {
    const { s, x, y } = gateDims();
    const nk = nightK();
    const fk = L('pvFire') * clamp(nk * 1.4, 0, 1);
    if (SP && fk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, x, y - 9 * s, 22 * s, fk * 0.45);
      ctx.globalCompositeOperation = 'source-over';
      // 石圈里的火
      const fxp = x - 19 * s;
      ctx.fillStyle = css([90, 80, 70], 2);
      ctx.beginPath(); ctx.ellipse(fxp, y - 0.6 * s, 4.4 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      flame(ctx, fxp, y - 1.2 * s, 6.5 * s * (0.4 + 0.6 * L('pvFire')), fk, 5.1);
    }
  }
  // 坚固台：城中一座高台（18:10）；暴风雨里它发出光来，义人奔入便得安稳
  function towerDims() { const s = LS(2), r = L('pvRise'); return { s, x: X.tower * W.w, y: gY(2, X.tower) + 2 * s, w: 17 * s * (1 + 0.14 * r), h: 66 * s * (1 + 0.42 * r) }; }
  function drawTower(ctx) {
    const { s, x, y, w, h } = towerDims();
    const stone = [190, 172, 142], dark = mix(stone, [44, 36, 30], 0.35);
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css(stone, 2);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.58, y); ctx.lineTo(x - w * 0.5, y - h); ctx.lineTo(x + w * 0.5, y - h); ctx.lineTo(x + w * 0.58, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(dark, 2, 0.8);
    if (d > 0) { ctx.beginPath(); ctx.moveTo(x - w * 0.58, y); ctx.lineTo(x - w * 0.5, y - h); ctx.lineTo(x - w * 0.18, y - h); ctx.lineTo(x - w * 0.2, y); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(x + w * 0.58, y); ctx.lineTo(x + w * 0.5, y - h); ctx.lineTo(x + w * 0.18, y - h); ctx.lineTo(x + w * 0.2, y); ctx.closePath(); ctx.fill(); }
    // 台顶：出挑的一层与垛口
    ctx.fillStyle = css(stone, 2);
    ctx.fillRect(x - w * 0.66, y - h - 3 * s, w * 1.32, 3.4 * s);
    for (let i = 0; i < 4; i++) ctx.fillRect(x - w * 0.66 + i * w * 0.4, y - h - 7 * s, w * 0.24, 4 * s);
    // 窗缝与门
    ctx.fillStyle = css([26, 20, 16], 2);
    for (const q of SLITS) ctx.fillRect(x + q[0] * w - 1.1 * s, y - h * q[1] - 3.5 * s, 2.2 * s, 5 * s);
    ctx.beginPath(); ctx.moveTo(x - 4 * s, y); ctx.lineTo(x - 4 * s, y - 8 * s); ctx.quadraticCurveTo(x, y - 12 * s, x + 4 * s, y - 8 * s); ctx.lineTo(x + 4 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([255, 240, 214], 2, 0.42 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - w * 0.66, y - h - 3 * s); ctx.lineTo(x + w * 0.66, y - h - 3 * s);
    if (d > 0) { ctx.moveTo(x + w * 0.5, y - h); ctx.lineTo(x + w * 0.58, y); } else { ctx.moveTo(x - w * 0.5, y - h); ctx.lineTo(x - w * 0.58, y); }
    ctx.stroke();
  }
  const SLITS = [[0, 0.3], [0, 0.55], [0, 0.78]];
  // 台上的灯与发光的门（每帧画）
  function drawTowerLights(ctx) {
    const { s, x, y, w, h } = towerDims();
    const k = L('pvTower'), lit = k > 0.02 ? k : 0, slits = SLITS;
    // 城中的灯亮时，台上也有一盏
    const lamp = clamp(L('pvLamps') * 1.4, 0, 1) * nightK();
    if (SP && (lit > 0.02 || lamp > 0.02)) {
      const a = Math.max(lit, lamp * 0.7);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = 'rgb(255,214,140)';
      for (const q of slits) ctx.fillRect(x + q[0] * w - 1.1 * s, y - h * q[1] - 3.5 * s, 2.2 * s, 5 * s);
      if (lit > 0.02) { ctx.beginPath(); ctx.moveTo(x - 4 * s, y); ctx.lineTo(x - 4 * s, y - 8 * s); ctx.quadraticCurveTo(x, y - 12 * s, x + 4 * s, y - 8 * s); ctx.lineTo(x + 4 * s, y); ctx.closePath(); ctx.fill(); }
      glowAt(SP.gold, x, y - 5 * s, 16 * s, a * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 暴风雨下，地也暗下来（坚固台的光便更显明）
  function drawStormDim(ctx) {
    const st = W.lv.storm || 0;
    if (st < 0.02) return;
    const a = st * (0.34 + 0.11 * smoothstep(0.2, 0.4, W.lv.rain || 0));
    ctx.fillStyle = U.rgba(10, 14, 22, a);
    ctx.fillRect(-20, W.horizonY - 2, W.w + 40, W.h - W.horizonY + 24);
  }
  // 坚固台的光：光柱直上，台上与台脚明亮的光（在人之后——义人奔入，站在光前）
  function drawShelter(ctx) {
    const k = L('pvTower');
    if (k < 0.01 || !SP) return;
    const { s, x, y, h } = towerDims();
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    const pul = 0.9 + 0.1 * Math.sin(W.t * 1.7);
    ctx.globalAlpha = k * 0.6 * pul;
    const bw = 30 * s;
    ctx.drawImage(SP.beam, x - bw, -20, bw * 2, y - h + 24);
    // 整座台镶着金色的光边（台是耶和华的名）
    const w = towerDims().w;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x - w * 0.58, y); ctx.lineTo(x - w * 0.5, y - h); ctx.lineTo(x - w * 0.66, y - h); ctx.lineTo(x - w * 0.66, y - h - 7 * s);
    ctx.lineTo(x + w * 0.66, y - h - 7 * s); ctx.lineTo(x + w * 0.66, y - h); ctx.lineTo(x + w * 0.5, y - h); ctx.lineTo(x + w * 0.58, y);
    ctx.strokeStyle = 'rgb(255,214,140)'; ctx.globalAlpha = 0.3 * k; ctx.lineWidth = 7 * s; ctx.stroke();
    ctx.strokeStyle = 'rgb(255,240,200)'; ctx.globalAlpha = 0.85 * k * pul; ctx.lineWidth = Math.max(1, 1.6 * s); ctx.stroke();
    glowAt(SP.gold, x, y - h * 0.5, h * 0.9, k * 0.35);
    glowAt(SP.gold, x, y - h - 6 * s, 40 * s, k * 0.9 * pul);
    glowAt(SP.gold, x, y - 30 * s, 56 * s, k * 0.4);
    glowAt(SP.white, x, y - h * 0.55, 16 * s, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 台脚一圈淡淡的琥珀色庇护（在人之上，只一层薄光）
  function drawShelterHalo(ctx) {
    const k = L('pvTower');
    if (k < 0.01 || !SP) return;
    const { s, x, y } = towerDims();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.amber, x - 20 * s, y - 8 * s, 120 * s, k * 0.3, 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 城门旁的石凳（31:23：她丈夫在城门口与本地的长老同坐）
  const BENCH = [0.757, 0.811], SEATS = [0.766, 0.779, 0.792, 0.805];
  function drawBench(ctx) {
    const k = L('pvBench');
    if (k < 0.01) return;
    const s = LS(2);
    let h = 0;
    for (const m of cmembers('elders')) if (m._vis && m._h > h) h = m._h;
    if (!h) { const f = fig('father'); h = f && f._vis ? f._h : 46 * s; }
    const xa = BENCH[0] * W.w, xb = BENCH[1] * W.w, ya = gY(2, BENCH[0]), yb = gY(2, BENCH[1]);
    const top = h * 0.25, th = h * 0.05;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([150, 134, 110], 2);
    for (const f of [0.06, 0.5, 0.94]) { const x = lerp(xa, xb, f), y = lerp(ya, yb, f); ctx.fillRect(x - h * 0.05, y - top, h * 0.1, top + 0.5 * s); }
    ctx.fillStyle = css([184, 168, 140], 2);
    ctx.beginPath(); ctx.moveTo(xa - 2 * s, ya - top - th); ctx.lineTo(xb + 2 * s, yb - top - th); ctx.lineTo(xb + 2 * s, yb - top); ctx.lineTo(xa - 2 * s, ya - top); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([255, 244, 220], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(xa - 2 * s, ya - top - th); ctx.lineTo(xb + 2 * s, yb - top - th); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 静物的预绘：近岸的城（房屋、城墙、城门、坚固台）、家与葡萄园、橄榄树；中丘的城 ──
  // 按屏幕尺寸与光色（两种颜色的明暗、日光、光从哪边来，都量化）存一张；光色变了才重画。灯、火、光每帧另画。
  const CITY = { near: null, mid: null };
  function shadeKey(l) {
    const q = str => String(str).replace(/[\d.]+/g, v => Math.round(+v / 4));
    return q(css([200, 180, 150], l)) + q(css([60, 50, 40], l, 0.9)) + '|' + Math.round(dayA() * 40) + '|' + Math.round(litX() / W.w * 48) + '|' + Math.round(L('pvRise') * 24);
  }
  function cityBox(l) {
    const s = LS(l), xa = l === 2 ? X.vine0 - 0.03 : 0.7;
    let lo = Infinity, hi = -Infinity;
    for (let xf = xa; xf <= 1.001; xf += 0.01) { const g = gY(l, Math.min(1, xf)); if (g < lo) lo = g; if (g > hi) hi = g; }
    const x0 = Math.max(0, Math.floor(xa * W.w)), y0 = Math.max(0, Math.floor(lo - (l === 2 ? 112 : 64) * s));
    const x1 = Math.ceil(W.w), y1 = Math.min(Math.ceil(W.h), Math.ceil(hi + (l === 2 ? 26 : 10) * s));
    return { x0, y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }
  function drawCity(g, l) {
    if (l === 1) { drawTown(g, 1); return; }
    drawTown(g, 2); drawWall(g); drawTower(g); drawGate(g); drawHome(g); drawOlive(g);
  }
  // 预绘的图要不要重画：尺寸变了立即重画；光色变了（时辰在走）最多每 0.15 秒重画一次，看不出迟滞
  function stale(c, key) {
    if (!c) return true;
    if (c.key === key) return false;
    if (c.w !== W.w || c.h !== W.h) return true;
    return !(Math.abs(W.t - (c.at || 0)) < 0.15);
  }
  function blitCity(ctx, l) {
    const which = l === 2 ? 'near' : 'mid', dpr = Math.min(2, W.dpr || 1);
    const key = W.w + '|' + W.h + '|' + dpr + '|' + shadeKey(l);
    let c = CITY[which];
    if (stale(c, key)) {
      try {
        const bb = cityBox(l);
        if (!c) c = CITY[which] = { cv: document.createElement('canvas'), key: '', bb };
        const cw = Math.ceil(bb.w * dpr), ch = Math.ceil(bb.h * dpr);
        if (c.cv.width !== cw || c.cv.height !== ch) { c.cv.width = cw; c.cv.height = ch; }
        const g = c.cv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        g.clearRect(0, 0, cw, ch);
        g.setTransform(dpr, 0, 0, dpr, -bb.x0 * dpr, -bb.y0 * dpr);
        drawCity(g, l);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        c.key = key; c.bb = bb; c.at = W.t; c.w = W.w; c.h = W.h;
      } catch (e) { CITY[which] = null; drawCity(ctx, l); return; }
    }
    ctx.drawImage(c.cv, c.bb.x0, c.bb.y0, c.bb.w, c.bb.h);
  }

  // ════════════════════════════════════════════════════════════
  //  画：家、葡萄园、橄榄树、麦田（陇沟）、蚁窝
  // ════════════════════════════════════════════════════════════
  function drawHome(ctx) {
    const s = LS(2), x = X.home * W.w, y = gY(2, X.home) + 2 * s;
    // 葡萄园（31:16）：几行矮架
    const vy = v => v;
    ctx.strokeStyle = css([96, 74, 52], 2);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const xf = lerp(X.vine0, X.vine1, i / 3), px = xf * W.w, py = baseY(2, xf, vy(0.04 + i * 0.015));
      ctx.moveTo(px, py); ctx.lineTo(px, py - 8 * s);
    }
    ctx.stroke();
    ctx.fillStyle = css([74, 104, 56], 2);
    for (let i = 0; i < 3; i++) {
      const xa = lerp(X.vine0, X.vine1, i / 3), xb = lerp(X.vine0, X.vine1, (i + 1) / 3);
      const pa = xa * W.w, pb = xb * W.w, ya = baseY(2, xa, 0.04 + i * 0.015) - 8 * s, yb = baseY(2, xb, 0.04 + (i + 1) * 0.015) - 8 * s;
      ctx.beginPath();
      ctx.moveTo(pa, ya - 1 * s);
      ctx.quadraticCurveTo((pa + pb) / 2, ya - 4 * s, pb, yb - 1 * s);
      ctx.lineTo(pb, yb + 2.4 * s);
      ctx.quadraticCurveTo((pa + pb) / 2, (ya + yb) / 2 + 4 * s, pa, ya + 2.4 * s);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([92, 52, 78], 2, 0.9);
    for (let i = 0; i < 9; i++) {
      const xf = lerp(X.vine0 + 0.004, X.vine1 - 0.004, hsh(i * 3.1)), px = xf * W.w, py = baseY(2, xf, 0.05) - (6 + hsh(i) * 2) * s;
      ctx.beginPath(); ctx.arc(px, py, 1.2 * s, 0, TAU); ctx.fill();
    }
    // 房屋：两角各落在坡上的地面
    const hw = 30 * s, gl = gY(2, (x - hw / 2) / W.w) + 2 * s, gr = gY(2, (x + hw / 2) / W.w) + 2 * s;
    house(ctx, 2, x, y, hw, 19 * s, [168, 138, 104], { door: -0.14, win: 0.28, yl: Math.max(y, gl), yr: Math.max(y, gr) });
    // 院子的矮墙：在房屋东边（平地上），两头各随地面
    const xa = x + 15 * s, xb = x + 29 * s, ya = gY(2, xa / W.w) + 2 * s, yb = gY(2, xb / W.w) + 2 * s;
    ctx.fillStyle = css([140, 116, 88], 2);
    ctx.beginPath(); ctx.moveTo(xa, ya - 5 * s); ctx.lineTo(xb, yb - 5 * s); ctx.lineTo(xb, yb + 0.5 * s); ctx.lineTo(xa, ya + 0.5 * s); ctx.closePath(); ctx.fill();
    ctx.fillRect(xb - 1.2 * s, yb - 6 * s, 2.4 * s, 6.5 * s);
    ctx.strokeStyle = css([255, 240, 214], 2, 0.35 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(xa, ya - 5 * s); ctx.lineTo(xb, yb - 5 * s); ctx.stroke();
  }
  // 她的灯终夜不灭：家里窗中的灯（每帧画）
  function drawHomeLamp(ctx) {
    const s = LS(2), x = X.home * W.w, y = gY(2, X.home) + 2 * s;
    const lamp = Math.max(L('pvMom') * clamp(0.3 + nightK(), 0, 1), clamp(L('pvLamps') * 1.3, 0, 1) * nightK() * 0.8);
    houseLamp(ctx, 2, x, y, 30 * s, 19 * s, lamp, { door: -0.14, win: 0.28 });
    if (SP && L('pvMom') > 0.05 && nightK() > 0.2) {
      ctx.globalCompositeOperation = 'lighter';
      const d = litX() >= x ? 1 : -1;
      glowAt(SP.lamp, x + 0.28 * 30 * s * d, y - 19 * s * 0.72, 26 * s, L('pvMom') * nightK() * 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawOlive(ctx) {
    const m = models();
    if (!m) return;
    const s = LS(2), x = X.olive * W.w, y = gY(2, X.olive) + 3 * s;
    drawTree(ctx, m.olive, x, y, 64 * s, 2, { leaf: [118, 138, 100], leaf2: [74, 92, 66], bark: [84, 70, 56] });
  }
  // 麦田：一块近大远小的田（前排更宽），一行行麦子；田头参差，没有硬的边；
  // 水进了陇沟后，行与行之间有断续的水光（映着天色；黄昏时映着晚霞）
  const FROWS = 7, FSTALK = 20;
  const rowV = r => lerp(FV0, fv1(), r / (FROWS - 1));
  let FGEO = null;   // 田的几何（每行的两头、土、麦身、青草、麦秆的根）：只随屏幕尺寸变，预先算好
  function fieldGeo() {
    const key = W.w + '|' + W.h;
    if (FGEO && FGEO.key === key) return FGEO;
    const rows = [], g0 = gY(2, X.f0), g1 = gY(2, X.f1), s = LS(2);
    for (let r = 0; r < FROWS; r++) {
      const v = rowV(r);
      let xa = X.f0 - 0.003 * r - 0.004 * hsh(r * 5.3 + 1), xb = X.f1 + 0.003 * r + 0.004 * hsh(r * 3.7 + 2);
      // 地往下落的地方（崖边）不种：两头收到仍在台地上的地方
      while (xa < X.f0 && gY(2, xa) > g0 + 3) xa += 0.002;
      while (xb > X.f1 && gY(2, xb) > g1 + 3) xb -= 0.002;
      rows.push({ v, xa, xb });
    }
    const G = { key, rows, soil: null, body: null, tuft: null, stalks: [], furrows: [] };
    const hS = r => (8 + 4 * r / (FROWS - 1)) * s;
    try {
      // 田面：一行一道软的土色（圆头、半透明）；前排之下不留土
      G.soil = new Path2D();
      for (let r = 0; r < FROWS - 1; r++) {
        const q = rows[r], n = rows[r + 1], vv = (q.v + n.v) / 2;
        for (let i = 0; i <= 6; i++) { const xf = lerp((q.xa + n.xa) / 2 + 0.004, (q.xb + n.xb) / 2 - 0.004, i / 6), y = baseY(2, xf, vv); if (i) G.soil.lineTo(xf * W.w, y); else G.soil.moveTo(xf * W.w, y); }
      }
      // 一行行麦子的身子（密的一丛，顶参差，两头收窄，底边也不齐）
      G.body = new Path2D();
      for (let r = 0; r < FROWS; r++) {
        const q = rows[r], N = 12, bh = hS(r) * 0.46;
        for (let i = 0; i <= N; i++) {
          const t = i / N, xf = lerp(q.xa, q.xb, t), e = Math.min(1, Math.min(t, 1 - t) * 6);
          const y = baseY(2, xf, q.v) - bh * (0.35 + 0.65 * e) * (0.85 + 0.3 * hsh(r * 13 + i));
          if (i) G.body.lineTo(xf * W.w, y); else G.body.moveTo(xf * W.w, y);
        }
        for (let i = N; i >= 0; i--) { const xf = lerp(q.xa, q.xb, i / N); G.body.lineTo(xf * W.w, baseY(2, xf, q.v) + (0.2 + 1.4 * hsh(r * 11 + i * 3)) * s); }
        G.body.closePath();
      }
      // 前排脚下几丛青草，田与草地相接处不成一条直边
      G.tuft = new Path2D();
      const q = rows[FROWS - 1];
      for (let i = 0; i < 22; i++) {
        const xf = lerp(q.xa + 0.002, q.xb - 0.002, (i + 0.5 * hsh(i * 2.3)) / 22), px = xf * W.w, py = baseY(2, xf, q.v) + 1.6 * s;
        const hh = (2.2 + 2.4 * hsh(i * 5.7)) * s, lean = (hsh(i * 1.9) - 0.5) * 2 * s;
        G.tuft.moveTo(px - 0.8 * s, py); G.tuft.lineTo(px + lean, py - hh); G.tuft.moveTo(px + 0.8 * s, py); G.tuft.lineTo(px + lean * 0.4 + 0.6 * s, py - hh * 0.7);
      }
    } catch (e) { G.soil = G.body = G.tuft = null; }
    // 麦秆的根：x, y, 高, 斜, 行
    for (let r = 0; r < FROWS; r++) {
      const q = rows[r], H0 = hS(r);
      const n = Math.max(6, Math.round(FSTALK * (q.xb - q.xa) / (X.f1 - X.f0)));
      for (let i = 0; i < n; i++) {
        const edge = Math.min(i, n - 1 - i), short = edge < 2 ? 0.72 + 0.14 * edge : 1;
        if (edge === 0 && hsh(r * 17 + i) < 0.5) continue;
        const xf = lerp(q.xa + 0.003, q.xb - 0.003, (i + 0.85 * hsh(r * 31 + i)) / n);
        G.stalks.push(xf * W.w, baseY(2, xf, q.v) - H0 * 0.3, H0 * (0.8 + 0.42 * hsh(i * 7 + r)) * short - H0 * 0.3, (hsh(i * 3 + r * 5) - 0.5) * 1.6 * s, r, i + r);
      }
    }
    // 陇沟（行与行之间）：两头与两头的地面高
    for (let r = 1; r < FROWS; r++) {
      const q = rows[r], p = rows[r - 1], vv = (p.v + q.v) / 2, xa = (p.xa + q.xa) / 2, xb = (p.xb + q.xb) / 2;
      G.furrows.push({ r, xa, xb, ya: baseY(2, xa, vv), yb: baseY(2, xb, vv) });
    }
    FGEO = G;
    return FGEO;
  }
  // 麦田整块预绘（麦秆的摇动每秒约八次重画，看不出跳动）；陇沟的水光每帧画在上面
  let FCACHE = null;
  function fieldBox() {
    const G = fieldGeo(), s = LS(2);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    const S6 = G.stalks;
    for (let k = 0; k < S6.length; k += 6) { x0 = Math.min(x0, S6[k]); x1 = Math.max(x1, S6[k]); y0 = Math.min(y0, S6[k + 1] - S6[k + 2]); y1 = Math.max(y1, S6[k + 1]); }
    for (const q of G.rows) { x0 = Math.min(x0, q.xa * W.w); x1 = Math.max(x1, q.xb * W.w); }
    const pad = 8 * s;
    return { x0: Math.floor(x0 - pad), y0: Math.floor(y0 - pad), w: Math.ceil(x1 - x0 + 2 * pad), h: Math.ceil(y1 - y0 + 2 * pad + 6 * s) };
  }
  function drawField(ctx) {
    const still = W.quality != null && W.quality < 0.7;
    const dpr = Math.min(2, W.dpr || 1);
    const key = W.w + '|' + W.h + '|' + dpr + '|' + shadeKey(2) + '|' + (still ? 0 : Math.floor(W.t * 8));
    let c = FCACHE;
    if (stale(c, key) || (c.bb && c.fg !== FGEO)) {
      try {
        const bb = fieldBox();
        if (!c) c = FCACHE = { cv: document.createElement('canvas'), key: '', bb };
        const cw = Math.ceil(bb.w * dpr), ch = Math.ceil(bb.h * dpr);
        if (c.cv.width !== cw || c.cv.height !== ch) { c.cv.width = cw; c.cv.height = ch; }
        const g = c.cv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        g.clearRect(0, 0, cw, ch);
        g.setTransform(dpr, 0, 0, dpr, -bb.x0 * dpr, -bb.y0 * dpr);
        drawFieldBody(g, still ? 0 : W.t);
        c.key = key; c.bb = bb; c.at = W.t; c.w = W.w; c.h = W.h; c.fg = FGEO;
      } catch (e) { FCACHE = null; drawFieldBody(ctx, W.t); drawFieldWater(ctx); return; }
    }
    ctx.drawImage(c.cv, c.bb.x0, c.bb.y0, c.bb.w, c.bb.h);
    drawFieldWater(ctx);
  }
  function drawFieldBody(ctx, tt) {
    const s = LS(2), G = fieldGeo();
    if (G.soil) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = css([138, 106, 64], 2, 0.4);
      ctx.lineWidth = Math.max(1.5, 3.2 * s);
      ctx.stroke(G.soil);
      ctx.lineCap = 'butt';
      ctx.fillStyle = css([184, 142, 74], 2, 0.92);
      ctx.fill(G.body);
      ctx.strokeStyle = css([74, 112, 56], 2, 0.9);
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.stroke(G.tuft);
    }
    drawFieldStalks(ctx, tt);
  }
  // 陇沟里的水：自田的东头流入；几处柔的水光在行间流转（映着天色；黄昏时映着晚霞），不连成线
  function drawFieldWater(ctx) {
    const s = LS(2), G = fieldGeo();
    const chan = L('pvChan');
    if (chan > 0.01 && SP) {
      ctxA = ctx;
      const dusk = clamp((W.dusk - 0.3) / 0.4, 0, 1), cg = L('pvChanG') * dusk, day = dayA();
      ctx.globalCompositeOperation = 'lighter';
      for (const f of G.furrows) {
        const reach = clamp(chan * 1.25 - (f.r - 1) * 0.04, 0, 1);
        if (reach < 0.01) continue;
        const xw = f.xb - (f.xb - f.xa) * reach, rr = (f.xb - f.xa) * W.w * 0.07;
        for (let j = 0; j < 2; j++) {
          const u = U.fract(hsh(f.r * 7 + j * 3) + W.t * (0.012 + 0.01 * j) * (j ? -1 : 1));
          const xf = lerp(xw, f.xb, 0.1 + 0.8 * u), t = (xf - f.xa) / Math.max(1e-6, f.xb - f.xa);
          const x = xf * W.w, y = lerp(f.ya, f.yb, t) - 1.2 * s;
          const tw = 0.6 + 0.4 * Math.sin(W.t * 1.3 + f.r * 1.7 + j * 2.1);
          const aw = Math.min(0.35, (0.1 + 0.18 * day) * tw);
          if (cg < 0.98) glowAt(SP.water, x, y, rr, aw * (1 - cg), 0.14);
          if (cg > 0.02) glowAt(SP.warm, x, y, rr, Math.min(0.35, 0.3 * tw) * cg, 0.14);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 麦秆（全田一条路径）与麦穗（两条路径）；tt：摇动用的时刻（画质低时不摇）
  function drawFieldStalks(ctx, tt) {
    const s = LS(2), G = fieldGeo();
    const sway = W.quality != null && W.quality < 0.7 ? 0 : 1.4 * s * (0.6 + 0.4 * Math.abs(W.wind || 0.3));
    const S6 = G.stalks, n6 = S6.length, tops = FTOPS;
    tops.length = 0;
    ctx.strokeStyle = css([196, 154, 80], 2, 0.95);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let k = 0; k < n6; k += 6) {
      const px = S6[k], py = S6[k + 1], hh = S6[k + 2], lean = S6[k + 3];
      const sw = sway ? Math.sin(tt * 1.2 + px * 0.03 + S6[k + 4] * 0.7) * sway : 0;
      ctx.moveTo(px, py); ctx.quadraticCurveTo(px + lean * 0.3, py - hh * 0.6, px + sw + lean, py - hh);
      tops.push(px + sw + lean, py - hh, S6[k + 5]);
    }
    ctx.stroke();
    for (let pass2 = 0; pass2 < 2; pass2++) {
      ctx.fillStyle = css(pass2 ? [214, 170, 86] : [236, 198, 112], 2);
      ctx.beginPath();
      for (let j = 0; j < tops.length; j += 3) {
        if ((tops[j + 2] % 3 === 0) !== (pass2 === 1)) continue;
        ctx.moveTo(tops[j] + 1.1 * s, tops[j + 1] - 1.6 * s);
        ctx.ellipse(tops[j], tops[j + 1] - 1.6 * s, 1.1 * s, 2.6 * s, 0.15, 0, TAU);
      }
      ctx.fill();
    }
    ctx.strokeStyle = css([255, 236, 190], 2, 0.5 * dayA(), 0.25); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let j = 0; j < tops.length; j += 6) { ctx.moveTo(tops[j] - 0.8 * s, tops[j + 1] - 3.6 * s); ctx.lineTo(tops[j] + 0.3 * s, tops[j + 1] - 0.4 * s); }
    ctx.stroke();
  }
  const FTOPS = [];
  function nestXY() { return [X.nest * W.w, baseY(2, X.nest, NEST_V)]; }
  function drawNest(ctx) {
    const s = LS(2), p = nestXY();
    ctx.fillStyle = css([128, 98, 66], 2);
    ctx.beginPath(); ctx.moveTo(p[0] - 7 * s, p[1] + 1 * s); ctx.quadraticCurveTo(p[0], p[1] - 5 * s, p[0] + 7 * s, p[1] + 1 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 30, 22], 2);
    ctx.beginPath(); ctx.ellipse(p[0], p[1] - 2.6 * s, 1.3 * s, 0.8 * s, 0, 0, TAU); ctx.fill();
    // 远看：窝边一线小点（蚂蚁）
    ctx.fillStyle = css([34, 26, 20], 2, 0.8);
    for (let i = 0; i < 7; i++) {
      const u = U.fract(W.t * 0.05 + i / 7);
      const x = p[0] + (1 - u) * 18 * s + 1.5 * s, y = p[1] - (1 - u) * 2 * s + Math.sin(u * 9 + i) * 0.4 * s;
      ctx.fillRect(x, y, Math.max(0.8, 0.9 * s), Math.max(0.8, 0.7 * s));
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：智慧的房屋——七根柱子一根根立起；筵席
  // ════════════════════════════════════════════════════════════
  function h7Geo() {
    const s = LS(2), cx = X.h7 * W.w, gy = gY(2, X.h7) + 2 * s;
    const Wd = Math.min(112 * s, W.w * (port() ? 0.2 : 0.105));
    const k = Wd / (112 * s);
    return { s, cx, gy, Wd, tH: 7 * s, pH: 44 * s * (0.8 + 0.2 * k), pW: 4.4 * s * k, k };
  }
  const STONE = [232, 220, 196];
  function drawHouse7(ctx) {
    const kk = L('pvHouse');
    if (kk < 0.002) return;
    const G = h7Geo(), s = G.s, cx = G.cx, gy = G.gy, Wd = G.Wd;
    const top = gy - G.tH;
    const a0 = smoothstep(0, 0.08, kk);
    const d = litX() >= cx ? 1 : -1;
    const feast = L('pvFeast');
    ctx.globalAlpha = a0;
    // 台基：三层台阶
    for (let i = 0; i < 3; i++) {
      const ww = Wd * (1.08 - i * 0.05), hh = G.tH / 3;
      ctx.fillStyle = css(mix(STONE, [120, 104, 86], 0.18 + i * 0.05), 2);
      ctx.fillRect(cx - ww / 2, gy - hh * (i + 1), ww, hh + 0.5);
    }
    ctx.strokeStyle = css([255, 244, 220], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(cx - Wd * 0.49, top); ctx.lineTo(cx + Wd * 0.49, top); ctx.stroke();
    // 屋内（屋顶架起之后）：后墙，筵席的光
    const roofK = smoothstep(0.8, 0.92, kk);
    if (roofK > 0.01) {
      ctx.globalAlpha = a0 * roofK;
      ctx.fillStyle = css([96, 80, 64], 2);
      ctx.fillRect(cx - Wd * 0.44, top - G.pH, Wd * 0.88, G.pH);
      if (feast > 0.01 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctxA = ctx;
        glowAt(SP.amber, cx, top - G.pH * 0.35, Wd * 0.5, feast * roofK * (0.35 + 0.35 * nightK()), 0.7);
        ctx.globalCompositeOperation = 'source-over';
      }
      // 桌子、饼与酒（9:2、9:5）
      ctx.globalAlpha = a0 * roofK;
      const ty = top - 7 * s;
      ctx.fillStyle = css([118, 88, 60], 2);
      ctx.fillRect(cx - Wd * 0.22, ty, Wd * 0.44, 1.6 * s);
      ctx.fillRect(cx - Wd * 0.2, ty, 1.2 * s, 7 * s);
      ctx.fillRect(cx + Wd * 0.2 - 1.2 * s, ty, 1.2 * s, 7 * s);
      ctx.fillStyle = css([214, 170, 104], 2, 1, 0.1 + feast * 0.3);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(cx - Wd * 0.14 + i * Wd * 0.07, ty - 1.2 * s, 2.6 * s, 1.4 * s, 0, 0, TAU); ctx.fill(); }
      ctx.fillStyle = css([140, 52, 60], 2, 1, feast * 0.3);
      ctx.beginPath(); ctx.moveTo(cx + Wd * 0.1, ty); ctx.quadraticCurveTo(cx + Wd * 0.1 - 2.4 * s, ty - 3 * s, cx + Wd * 0.1 - 1 * s, ty - 6 * s); ctx.lineTo(cx + Wd * 0.1 + 1 * s, ty - 6 * s); ctx.quadraticCurveTo(cx + Wd * 0.1 + 2.4 * s, ty - 3 * s, cx + Wd * 0.1, ty); ctx.fill();
      ctx.fillRect(cx + Wd * 0.16, ty - 2.4 * s, 1.6 * s, 2.4 * s);
    }
    // 七根柱子
    ctx.globalAlpha = a0;
    const span = Wd * 0.86;
    for (let i = 0; i < 7; i++) {
      const t0 = 0.08 + i * 0.1, r = smoothstep(t0, t0 + 0.17, kk);
      if (r <= 0.001) continue;
      const px = cx - span / 2 + span * i / 6, ph = G.pH * r, pw = G.pW;
      ctx.fillStyle = css(STONE, 2);
      ctx.fillRect(px - pw / 2, top - ph, pw, ph);
      ctx.fillStyle = css(mix(STONE, [90, 76, 62], 0.35), 2, 0.85);
      ctx.fillRect(d > 0 ? px - pw / 2 : px + pw / 2 - pw * 0.35, top - ph, pw * 0.35, ph);
      // 柱础与柱头
      ctx.fillStyle = css(mix(STONE, [255, 255, 255], 0.1), 2);
      ctx.fillRect(px - pw * 0.8, top - 1.6 * s, pw * 1.6, 1.6 * s);
      if (r > 0.97) ctx.fillRect(px - pw * 0.85, top - ph - 1.8 * s, pw * 1.7, 1.8 * s);
      ctx.strokeStyle = css([255, 246, 226], 2, 0.5 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath(); const ex = d > 0 ? px + pw / 2 : px - pw / 2; ctx.moveTo(ex, top - ph); ctx.lineTo(ex, top); ctx.stroke();
      // 正在立起的那一根：顶上一点金光
      if (r < 0.999 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctxA = ctx;
        glowAt(SP.gold, px, top - ph, 10 * s, 0.8 * Math.sin(Math.PI * r));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a0;
      }
    }
    // 楣与屋顶（低的山花）
    const ak = smoothstep(0.8, 0.9, kk), pk = smoothstep(0.9, 1, kk);
    if (ak > 0.01) {
      ctx.globalAlpha = a0 * ak;
      const ay = top - G.pH - 1.8 * s;
      ctx.fillStyle = css(STONE, 2);
      ctx.fillRect(cx - Wd * 0.5, ay - 4.2 * s, Wd, 4.2 * s);
      ctx.fillStyle = css(mix(STONE, [90, 76, 62], 0.25), 2);
      ctx.fillRect(cx - Wd * 0.5, ay - 1.2 * s, Wd, 1.2 * s);
      if (pk > 0.01) {
        ctx.globalAlpha = a0 * pk;
        ctx.fillStyle = css(mix(STONE, [200, 180, 150], 0.3), 2);
        ctx.beginPath(); ctx.moveTo(cx - Wd * 0.53, ay - 4.2 * s); ctx.lineTo(cx, ay - 4.2 * s - Wd * 0.13); ctx.lineTo(cx + Wd * 0.53, ay - 4.2 * s); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = css([255, 246, 226], 2, 0.5 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 0.8 * s);
        ctx.beginPath(); ctx.moveTo(cx - Wd * 0.53, ay - 4.2 * s); ctx.lineTo(cx, ay - 4.2 * s - Wd * 0.13); ctx.lineTo(cx + Wd * 0.53, ay - 4.2 * s); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 房屋的光（在人之上叠加）：立成时一圈、夜里柱间透出的光
  function drawHouseGlow(ctx) {
    const kk = L('pvHouse'), feast = L('pvFeast');
    if (kk < 0.9 || !SP) return;
    const G = h7Geo();
    const a = (feast * 0.25 + 0.15) * (0.4 + 0.6 * nightK()) + L('pvPraise') * (port() ? 0.1 : 0.25);
    if (a < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, G.cx, G.gy - G.tH - G.pH * 0.5, G.Wd * 0.8, a, 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：生命的泉源、溪水、生命树
  // ════════════════════════════════════════════════════════════
  const STREAM = [[X.spring, 0.13], [0.622, 0.26], [0.604, 0.39], [0.57, 0.47], [0.525, 0.53], [0.485, 0.62], [0.45, 0.74], [0.415, 0.88], [0.385, 1.08]];
  function streamPts() {
    const out = [];
    for (let i = 0; i < STREAM.length - 1; i++) {
      const a = STREAM[i], b = STREAM[i + 1];
      for (let k = 0; k < 4; k++) {
        const t = k / 4, xf = lerp(a[0], b[0], t), v = lerp(a[1], b[1], t);
        out.push([xf * W.w, baseY(2, xf, v), v]);
      }
    }
    const e = STREAM[STREAM.length - 1];
    out.push([e[0] * W.w, baseY(2, e[0], e[1]), e[1]]);
    return out;
  }
  function drawStream(ctx) {
    const sp = L('pvSpring'), st = L('pvStream');
    if (sp < 0.01 && st < 0.01) return;
    const s = LS(2), pts = streamPts(), n = pts.length;
    const upto = st * (n - 1);
    if (st > 0.005) {
      // 溪：越往下越宽（近）
      const Lp = [], Rp = [];
      for (let i = 0; i < n; i++) {
        if (i > upto + 1) break;
        let p = pts[i];
        if (i > upto) { const q = pts[i - 1], f = upto - (i - 1); p = [lerp(q[0], p[0], f), lerp(q[1], p[1], f), lerp(q[2], p[2], f)]; }
        const hw = (1.2 + 5.5 * p[2]) * s * (i === 0 ? 0.6 : 1);
        Lp.push([p[0], p[1] - hw * 0.35]); Rp.push([p[0], p[1] + hw * 0.35]);
        Lp[Lp.length - 1].push(hw);
      }
      if (Lp.length > 1) {
        ctx.fillStyle = css([92, 128, 160], 2);
        ctx.beginPath();
        Lp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        for (let i = Rp.length - 1; i >= 0; i--) ctx.lineTo(Rp[i][0], Rp[i][1]);
        ctx.closePath(); ctx.fill();
        // 岸（暗）与水面的天光
        ctx.strokeStyle = css([70, 90, 60], 2, 0.6);
        ctx.lineWidth = Math.max(0.5, 0.8 * s);
        ctx.beginPath(); Rp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = U.rgba(200, 230, 255, 0.28 * dayA() + 0.1);
        ctx.lineWidth = Math.max(0.5, 0.8 * s);
        ctx.beginPath(); Lp.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + p[2] * 0.12) : ctx.moveTo(p[0], p[1] + p[2] * 0.12))); ctx.stroke();
        // 流动的水光
        ctx.fillStyle = 'rgb(236,246,255)';
        const m = Lp.length;
        for (let j = 0; j < 22; j++) {
          const u = U.fract(W.t * 0.09 + j / 22) * (m - 1);
          const i = Math.floor(u), f = u - i;
          if (i >= m - 1) continue;
          const a = Lp[i], b = Lp[i + 1];
          const x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f) + lerp(a[2], b[2], f) * 0.35 * (hsh(j) - 0.2);
          ctx.globalAlpha = 0.5 * Math.sin(Math.PI * U.fract(W.t * 0.4 + hsh(j * 3))) * (0.4 + 0.6 * dayA());
          ctx.fillRect(x, y, 2.2 * s, 0.7 * s);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 泉眼：一口石砌的泉，水从里面涌上来
    const p0 = pts[0];
    if (sp > 0.01) {
      ctx.globalAlpha = Math.min(1, sp * 1.5);
      ctx.fillStyle = css([150, 138, 118], 2);
      ctx.beginPath(); ctx.ellipse(p0[0], p0[1], 7 * s, 2.4 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([96, 136, 170], 2);
      ctx.beginPath(); ctx.ellipse(p0[0], p0[1] - 0.3 * s, 5.4 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctxA = ctx;
        glowAt(SP.water, p0[0], p0[1] - 3 * s, 14 * s, sp * (0.4 + 0.3 * Math.sin(W.t * 2.1)), 0.8);
        // 涌上来的水柱（几道弧）
        ctx.strokeStyle = U.rgba(220, 240, 255, 0.55 * sp);
        ctx.lineWidth = Math.max(0.5, 0.8 * s);
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          const ph = U.fract(W.t * 0.8 + j / 5), hh = (5 + 3 * hsh(j)) * s * sp;
          const dx = (j - 2) * 1.4 * s;
          ctx.moveTo(p0[0], p0[1] - 0.5 * s);
          ctx.quadraticCurveTo(p0[0] + dx * 0.5, p0[1] - hh * (1 - ph * 0.3), p0[0] + dx * (1 + ph), p0[1] - 0.5 * s - hh * 0.3 * (1 - ph));
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
  }
  function lifeXY() { return [X.life * W.w, baseY(2, X.life, 0.015) + 2 * LS(2)]; }
  function lifeH() { return 72 * LS(2) * (port() ? 0.8 : 1); }
  function drawLife(ctx) {
    const k = L('pvTree');
    if (k < 0.01) return;
    const m = models();
    if (!m) return;
    const p = lifeXY(), g = U.easeOut ? U.easeOut(k) : k;
    const H = lifeH() * (0.25 + 0.75 * g);
    ctx.globalAlpha = Math.min(1, k * 3);
    drawTree(ctx, m.life, p[0], p[1], H, 2, { leaf: [104, 158, 92], leaf2: [58, 104, 66], bark: [98, 76, 54] });
    ctx.globalAlpha = 1;
  }
  // 生命树的光与果子（在人之上叠加）
  function drawLifeGlow(ctx) {
    const k = L('pvTree');
    if (k < 0.05 || !SP) return;
    const m = models();
    if (!m) return;
    const p = lifeXY(), H = lifeH() * (0.25 + 0.75 * (U.easeOut ? U.easeOut(k) : k));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, p[0], p[1] - H * 0.66, H * 0.9, k * (0.2 + 0.25 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 1.3)), 0.7);
    const fk = smoothstep(0.55, 1, k);
    if (fk > 0.01) {
      for (let i = 0; i < m.life.fruit.length; i++) {
        const f = m.life.fruit[i];
        const x = p[0] + f[0] * H, y = p[1] + f[1] * H;
        glowAt(SP.amber, x, y, 3.2 * LS(2), fk * (0.55 + 0.25 * Math.sin(W.t * 2 + i)));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：光的路（3:6、4:18）、人心筹算的虚线与金色的脚印（16:9）
  // ════════════════════════════════════════════════════════════
  function pathPts(xa, xb, v, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const xf = lerp(xa, xb, i / n); out.push([xf * W.w, baseY(2, xf, v)]); }
    return out;
  }
  function drawPath(ctx) {
    const p = L('pvPath'), g = L('pvPathG');
    if (p < 0.005 || g < 0.01) return;
    const s = LS(2), xa = X.home + 0.014, xb = X.gate - 0.02;
    const xe = lerp(xa, xb, p);
    const pts = pathPts(xa, xe, PATH_V, Math.max(2, Math.round(40 * p)));
    const bright = g * (0.3 + 0.7 * clamp(W.daylight, 0, 1) + 0.4 * nightK());
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const line = () => { ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke(); };
    ctx.strokeStyle = U.rgba(255, 220, 150, 0.2 * bright); ctx.lineWidth = 12 * s; line();
    ctx.strokeStyle = U.rgba(255, 236, 190, 0.36 * bright); ctx.lineWidth = 4.4 * s; line();
    ctx.strokeStyle = U.rgba(255, 250, 230, 0.7 * bright); ctx.lineWidth = Math.max(0.8, 1.4 * s); line();
    // 铺展的那一头
    if (p < 0.999 && SP) {
      ctxA = ctx;
      const e = pts[pts.length - 1];
      glowAt(SP.gold, e[0], e[1] - 2 * s, 14 * s, 0.8 * g);
    }
    ctx.lineCap = 'butt';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 金色的脚印沿着光的路，从麦田的东头走到城门前（不与麦田相叠）
  const STEP_N = 16, STEP_X0 = X.f1 + 0.012, STEP_X1 = 0.784;
  // 人心筹算自己的道路：自我儿脚下弯弯地向坡下去的一道淡虚线（不是神指引的路）
  const PLAN = [[STEP_X0, 0.06], [0.646, 0.2], [0.674, 0.34], [0.662, 0.5], [0.7, 0.64], [0.742, 0.78]];
  function drawSteps(ctx) {
    const pl = L('pvPlan'), st = L('pvSteps');
    const s = LS(2);
    if (pl > 0.01) {
      const pts = [];
      for (let i = 0; i < PLAN.length - 1; i++) for (let k = 0; k < 4; k++) { const t = k / 4, xf = lerp(PLAN[i][0], PLAN[i + 1][0], t), v = lerp(PLAN[i][1], PLAN[i + 1][1], t); pts.push([xf * W.w, baseY(2, xf, v)]); }
      const e = PLAN[PLAN.length - 1]; pts.push([e[0] * W.w, baseY(2, e[0], e[1])]);
      ctx.setLineDash([5 * s, 4.5 * s]);
      ctx.lineDashOffset = -W.t * 8 * s;
      ctx.strokeStyle = U.rgba(236, 240, 248, 0.8 * pl);
      ctx.lineWidth = Math.max(1.2, 1.8 * s);
      ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.lineJoin = 'miter';
    }
    if (st < 0.005) return;
    ctx.globalCompositeOperation = 'lighter';
    ctxA = ctx;
    {
      const n = Math.max(2, Math.round(40 * st)), xe = lerp(STEP_X0, STEP_X1, clamp(st * STEP_N / (STEP_N - 1), 0, 1));
      ctx.beginPath();
      for (let j = 0; j <= n; j++) { const xf = lerp(STEP_X0, xe, j / n); const q = [xf * W.w, baseY(2, xf, PATH_V + 0.025)]; if (j) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,220,150,1)'; ctx.globalAlpha = 0.16; ctx.lineWidth = 12 * s; ctx.stroke();
      ctx.globalAlpha = 0.32; ctx.lineWidth = 3.2 * s; ctx.stroke();
      ctx.lineCap = 'butt';
    }
    for (let i = 0; i < STEP_N; i++) {
      const a = clamp(st * STEP_N - i, 0, 1);
      if (a <= 0) break;
      const xf = lerp(STEP_X0, STEP_X1, i / (STEP_N - 1));
      const v = PATH_V + 0.02 + (i % 2 ? 0.014 : -0.004);
      const x = xf * W.w, y = baseY(2, xf, v);
      const fresh = clamp(1 - (st * STEP_N - i) / 2.5, 0, 1), fk = port() ? 1.3 : 1.6;
      if (SP) {
        glowAt(SP.gold, x, y, 15 * s * (1 + 1.2 * fresh), (0.5 + 0.35 * fresh) * a, 0.5);
        // 刚亮起的那一步：一道小小的光自脚印升起
        if (fresh > 0.01) { ctx.globalAlpha = 0.75 * fresh * a; ctx.drawImage(SP.beam, x - 6 * s, y - 52 * s, 12 * s, 54 * s); }
      }
      ctx.globalAlpha = 0.95 * a;
      ctx.fillStyle = 'rgb(255,236,170)';
      ctx.beginPath(); ctx.ellipse(x, y, 3.8 * s * fk, 1.5 * s * fk, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 4.3 * s * fk, y - 0.1 * s, 1.3 * s * fk, 1 * s * fk, 0, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶和华的眼目（5:21）与放大的蚂蚁（6:6–8）
  // ════════════════════════════════════════════════════════════
  function drawEye(ctx) {
    const e = L('pvEye');
    if (e < 0.01 || !SP) return;
    const xf = L('pvEyeX'), s = LS(2);
    const x = xf * W.w, y = baseY(2, xf, 0.12);
    const r = Math.max(34, 60 * s);
    ctx.globalCompositeOperation = 'lighter';
    // 白天也看得见的一束光，与落在地上的一圈金光
    ctx.globalAlpha = e * (0.2 + 0.15 * W.daylight);
    ctx.drawImage(SP.beam, x - r * 0.7, -20, r * 1.4, y + 24);
    glowAt(SP.white, x, y - r * 0.15, r * 1.25, e * 0.32, 0.45);
    glowAt(SP.gold, x, y - r * 0.3, r * 0.7, e * 0.18);
    glowAt(SP.gold, x, y + 2 * s, r * 1.1, e * (0.4 + 0.15 * W.daylight), 0.22);
    glowAt(SP.amber, x, y + 2 * s, r * 0.55, e * 0.35, 0.25);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function lensGeo() {
    const s = LS(2), p = nestXY();
    const R = clamp(58 * s, 38, 96);
    const cx = clamp(p[0] + R * 0.35, R + 10, W.w - R - 10);
    const cy = Math.max(port() ? W.h * 0.42 + R : R + 30, p[1] - R - 30 * s);
    return { R, cx, cy, nx: p[0], ny: p[1] - 2 * s, s };
  }
  function ant(ctx, x, y, a, dir, t, grain) {
    const c = Math.cos(dir), sn = Math.sin(dir);
    const P = (u, v) => [x + c * u - sn * v, y + sn * u + c * v];
    ctx.strokeStyle = 'rgb(34,24,18)';
    ctx.lineWidth = Math.max(0.6, a * 0.14);
    ctx.beginPath();
    for (let k = -1; k <= 1; k++) {
      const sw = Math.sin(t * 16 + k * 2.1) * 0.35;
      for (const sd of [-1, 1]) {
        const b = P(k * a * 0.28, 0), m1 = P(k * a * 0.28 + (sw * sd + 0.1 * k) * a * 0.4, sd * a * 0.45), e1 = P(k * a * 0.42 + sw * sd * a * 0.5, sd * a * 0.7);
        ctx.moveTo(b[0], b[1]); ctx.lineTo(m1[0], m1[1]); ctx.lineTo(e1[0], e1[1]);
      }
    }
    const h0 = P(a * 0.72, 0), an1 = P(a * 1.12, -a * 0.34), an2 = P(a * 1.12, a * 0.34);
    ctx.moveTo(h0[0], h0[1]); ctx.lineTo(an1[0], an1[1]); ctx.moveTo(h0[0], h0[1]); ctx.lineTo(an2[0], an2[1]);
    ctx.stroke();
    ctx.fillStyle = 'rgb(30,20,16)';
    const seg = [[-0.62, 0.36, 0.26], [0, 0.2, 0.14], [0.52, 0.2, 0.17]];
    for (const q of seg) { const p = P(q[0] * a, 0); ctx.beginPath(); ctx.ellipse(p[0], p[1], q[1] * a, q[2] * a, dir, 0, TAU); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,220,170,0.5)';
    const hl = P(-0.7 * a, -0.08 * a); ctx.beginPath(); ctx.ellipse(hl[0], hl[1], 0.14 * a, 0.07 * a, dir, 0, TAU); ctx.fill();
    if (grain) {
      const g = P(a * 1.0, -a * 0.1);
      ctx.fillStyle = 'rgb(240,200,110)';
      ctx.beginPath(); ctx.ellipse(g[0], g[1], a * 0.34, a * 0.2, dir + 0.4, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,246,210,0.8)';
      ctx.beginPath(); ctx.ellipse(g[0] - a * 0.06, g[1] - a * 0.06, a * 0.12, a * 0.06, dir + 0.4, 0, TAU); ctx.fill();
    }
  }
  function drawLens(ctx) {
    const k = L('pvLens');
    if (k < 0.01) return;
    const G = lensGeo(), R = G.R * (0.55 + 0.45 * k), cx = G.cx, cy = G.cy;
    ctx.save();
    ctx.globalAlpha = k;
    // 从窝口到那一圈的两道光线
    const ang = Math.atan2(cy - G.ny, cx - G.nx), dd = Math.hypot(cx - G.nx, cy - G.ny);
    const off = Math.asin(clamp(R / Math.max(R + 1, dd), 0, 1));
    ctx.strokeStyle = 'rgba(255,236,190,0.5)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (const sd of [-1, 1]) { const a2 = ang + sd * off, l2 = Math.sqrt(Math.max(0, dd * dd - R * R)); ctx.moveTo(G.nx, G.ny); ctx.lineTo(G.nx + Math.cos(a2) * l2, G.ny + Math.sin(a2) * l2); }
    ctx.stroke();
    // 圈里：放大的地面
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.clip();
    const gg = ctx.createLinearGradient(0, cy - R, 0, cy + R);
    const lit = 0.55 + 0.45 * W.daylight;
    gg.addColorStop(0, U.rgba(214 * lit, 190 * lit, 140 * lit, 1));
    gg.addColorStop(0.45, U.rgba(176 * lit, 138 * lit, 92 * lit, 1));
    gg.addColorStop(1, U.rgba(120 * lit, 90 * lit, 60 * lit, 1));
    ctx.fillStyle = gg; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    // 麦秆（背后，放大的）
    ctx.strokeStyle = U.rgba(210 * lit, 164 * lit, 84 * lit, 0.9);
    ctx.lineWidth = Math.max(1, R * 0.035);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const x = cx - R + (i + 0.5) * (2 * R / 9) + (hsh(i) - 0.5) * R * 0.1, sw = Math.sin(W.t * 1.1 + i) * R * 0.02; ctx.moveTo(x, cy + R); ctx.quadraticCurveTo(x, cy - R * 0.1, x + sw + R * 0.05, cy - R * 0.55); }
    ctx.stroke();
    ctx.fillStyle = U.rgba(240 * lit, 200 * lit, 110 * lit, 1);
    for (let i = 0; i < 9; i++) { const x = cx - R + (i + 0.5) * (2 * R / 9) + (hsh(i) - 0.5) * R * 0.1 + Math.sin(W.t * 1.1 + i) * R * 0.02 + R * 0.05; ctx.beginPath(); ctx.ellipse(x, cy - R * 0.62, R * 0.03, R * 0.1, 0.2, 0, TAU); ctx.fill(); }
    // 地面与窝口
    const ground = cy + R * 0.12;
    ctx.fillStyle = U.rgba(150 * lit, 112 * lit, 72 * lit, 1);
    ctx.beginPath(); ctx.moveTo(cx - R, ground); ctx.quadraticCurveTo(cx, ground - R * 0.08, cx + R, ground + R * 0.02); ctx.lineTo(cx + R, cy + R); ctx.lineTo(cx - R, cy + R); ctx.closePath(); ctx.fill();
    const hx = cx - R * 0.55, hy = ground + R * 0.12;
    ctx.fillStyle = U.rgba(134 * lit, 100 * lit, 64 * lit, 1);
    ctx.beginPath(); ctx.moveTo(hx - R * 0.32, hy + R * 0.12); ctx.quadraticCurveTo(hx, hy - R * 0.22, hx + R * 0.32, hy + R * 0.12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgb(28,20,14)';
    ctx.beginPath(); ctx.ellipse(hx, hy - R * 0.02, R * 0.08, R * 0.045, 0, 0, TAU); ctx.fill();
    // 蚂蚁：自麦田衔着麦粒排成一行进窝，空手的一行出来
    const a = R * 0.085;
    const route = (u, lane) => {
      const x = lerp(cx + R * 1.05, hx, u), y = ground + R * (0.1 + lane * 0.12) + Math.sin(u * 6 + lane) * R * 0.05 - (u > 0.85 ? (u - 0.85) * R * 0.3 : 0);
      return [x, y];
    };
    for (let i = 0; i < 7; i++) {
      const u = U.fract(W.t * 0.07 + i / 7), p = route(u, 0), q = route(Math.min(1, u + 0.01), 0);
      ant(ctx, p[0], p[1], a, Math.atan2(q[1] - p[1], q[0] - p[0]), W.t + i, true);
    }
    for (let i = 0; i < 4; i++) {
      const u = 1 - U.fract(W.t * 0.08 + i / 4 + 0.1), p = route(u, 1.1), q = route(Math.max(0, u - 0.01), 1.1);
      ant(ctx, p[0], p[1], a * 0.95, Math.atan2(q[1] - p[1], q[0] - p[0]), W.t * 1.1 + i * 3, false);
    }
    // 圈的边：细金线
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = k;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,230,170,0.85)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,220,150,0.22)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：工师的金线（8:22–31）——本卷的签名之景
  // ════════════════════════════════════════════════════════════
  function draftGeo() {
    const w = W.w, h = W.h, hz = W.horizonY, pt = port();
    return {
      star: [w * (pt ? 0.64 : 0.72), h * (pt ? 0.46 : 0.26)],
      vcx: w * 0.5, vcy: hz, vrx: w * (pt ? 0.62 : 0.56), vry: hz - h * (pt ? 0.4 : 0.09),
      ccx: w * 0.5, ccy: hz + h * (pt ? 0.07 : 0.09), crx: w * (pt ? 0.7 : 0.54), cry: h * (pt ? 0.07 : 0.09),
    };
  }
  const SPRINGS_L = [[0.57, 0.642], [0.7, 0.662], [0.86, 0.648], [0.965, 0.632]];
  const SPRINGS_P = [[0.1, 0.66], [0.26, 0.7], [0.42, 0.645], [0.2, 0.62]];
  let RID = null;   // 三层山脊的折线（像素），随屏幕缓存
  function ridges() {
    if (RID && RID.w === W.w && RID.h === W.h) return RID;
    RID = { w: W.w, h: W.h, L: [] };
    for (let l = 0; l < 3; l++) {
      const pts = [];
      const N = 72;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * W.w;
        const y = W.ridgeBaseY ? W.ridgeBaseY(l, x) : W.ridgeY(l, x);
        const wl = l === 2 ? W.h + 4 : W.waterlineY(l);
        pts.push([x, Math.min(y, wl), y < wl - 1]);
      }
      RID.L.push(pts);
    }
    return RID;
  }
  // 一段折线：落在经文处的部分淡些
  function strokeRun(ctx, pts, i0, i1, a) {
    // 长的一段先细分（圆规的腿、长直线），好让淡化随线走
    const P = [];
    for (let i = i0; i <= i1; i++) {
      const p = pts[i];
      if (i > i0) {
        const q = pts[i - 1], n = Math.min(40, Math.floor(Math.hypot(p[0] - q[0], p[1] - q[1]) / 14));
        for (let j = 1; j < n; j++) P.push([lerp(q[0], p[0], j / n), lerp(q[1], p[1], j / n)]);
      }
      P.push(p);
    }
    pts = P; i0 = 0; i1 = P.length - 1;
    // 段与段相接处不用圆头（'lighter' 叠出亮点）
    const cap = ctx.lineCap;
    ctx.lineCap = 'butt';
    let open = false, cur = -1;
    for (let i = i0; i <= i1; i++) {
      const p = pts[i];
      const m = Math.round(textMask(p[0], p[1]) * 10) / 10;
      if (!open || m !== cur) {
        if (open) { ctx.lineTo(p[0], p[1]); ctx.globalAlpha = a * cur; ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(p[0], p[1]); open = true; cur = m;
      } else ctx.lineTo(p[0], p[1]);
    }
    if (open) { ctx.globalAlpha = a * cur; ctx.stroke(); }
    ctx.lineCap = cap;
  }
  // 一层山脊里有地的几段（各段首尾各多取一点，落到水线上）
  function landRuns(pts) {
    const out = [];
    let cur = null;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i][2]) { if (!cur) { cur = i > 0 ? [pts[i - 1]] : []; out.push(cur); } cur.push(pts[i]); }
      else if (cur) { cur.push(pts[i]); cur = null; }
    }
    return out;
  }
  function ellipsePts(cx, cy, rx, ry, a0, a1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return out;
  }
  function danceAt(u) {
    const G = draftGeo(), pt = port();
    const gx = WIS * W.w, gyv = gY(2, WIS) - 30 * LS(2);
    const WP = pt
      ? [G.star, [0.4 * W.w, 0.42 * W.h], [0.86 * W.w, 0.5 * W.h], [0.52 * W.w, 0.56 * W.h], [0.9 * W.w, 0.66 * W.h], [0.58 * W.w, 0.76 * W.h], [gx, gyv]]
      : [G.star, [0.56 * W.w, 0.16 * W.h], [0.88 * W.w, 0.28 * W.h], [0.62 * W.w, 0.44 * W.h], [0.94 * W.w, 0.6 * W.h], [0.68 * W.w, 0.72 * W.h], [gx, gyv]];
    const n = WP.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), t = f - i;
    const p0 = WP[Math.max(0, i - 1)], p1 = WP[i], p2 = WP[i + 1], p3 = WP[Math.min(n, i + 2)];
    const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    const loop = Math.sin(Math.PI * clamp(u, 0, 1)) * M() * 0.035;
    return [cr(p0[0], p1[0], p2[0], p3[0]) + Math.cos(u * 26) * loop, cr(p0[1], p1[1], p2[1], p3[1]) + Math.sin(u * 26) * loop];
  }
  // 各层「沧海的界限」：有地处是山脊，是水处是水线（近岸只描有地的一段）。bd：各层自西向东描到哪里
  const boundK = l => clamp(L('pvBound') * 1.3 - l * 0.15, 0, 1);
  function boundSpan(l) {
    const pts = ridges().L[l];
    let i0 = 0, i1 = pts.length - 1;
    if (l === 2) {
      i0 = -1;
      for (let i = 0; i < pts.length; i++) if (pts[i][2]) { if (i0 < 0) i0 = i; i1 = i; }
      if (i0 < 0) return null;
      if (i0 > 0) i0--;
    }
    return { pts, i0, i1 };
  }
  // 那一段描到的终点（笔尖）：[x, y, 描到的点的序号]
  function boundPen(l, bd) {
    const B = boundSpan(l);
    if (!B) return null;
    const f = lerp(B.i0, B.i1, bd), i = Math.floor(f), t = f - i, p = B.pts[i], q = B.pts[Math.min(B.i1, i + 1)];
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), i, B];
  }
  // 根基的柱子（画面宽度的比例）
  const FOUND_L = [0.56, 0.66, 0.76, 0.86, 0.95], FOUND_P = [0.42, 0.56, 0.7, 0.84, 0.95];
  // 签名之景的几处光点（给情节里的洒光用）
  function draftSpots(what) {
    const G = draftGeo(), out = [];
    if (what === 'vault') for (const f of [0.18, 0.35, 0.5, 0.65, 0.82]) { const a = TAU - Math.PI * f; out.push([G.vcx + Math.cos(a) * G.vrx, G.vcy + Math.sin(a) * G.vry]); }
    else if (what === 'circle') for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * TAU / 6; out.push([G.ccx + Math.cos(a) * G.crx, G.ccy + Math.sin(a) * G.cry]); }
    else if (what === 'star') out.push(G.star);
    else if (typeof what === 'number') {
      const B = boundSpan(what);
      if (B) for (let k = 0; k < 5; k++) { const i = Math.round(lerp(B.i0, B.i1, (k + 0.5) / 5)); const p = B.pts[i]; if (!(what === 2 && !p[2])) out.push([p[0], p[1]]); }
    }
    return out.filter(p => p[0] > -10 && p[0] < W.w + 10 && p[1] > 0 && p[1] < W.h && !inText(p[0], p[1]));
  }
  // 太初的黑暗：本卷自画的一层暗（低分辨率的离屏画布，边缘自然柔和）；
  // 工师的笔划到哪里，哪里的暗就被揭开：高天的弧下、渊面的圆圈里（半揭），海岸与山脊一层层（全揭）
  let DARK = null, DARKKEY = '';
  function drawDark(ctx) {
    const D = L('pvDark');
    if (D < 0.004) return;
    const q = n => Math.round(L(n) * 400);
    const lk = [q('pvVault'), q('pvCircle'), q('pvFirm'), q('pvSprings'), q('pvBound')];
    // 还没有揭开什么：只是一层暗
    if (!lk.some(v => v > 0)) { ctx.fillStyle = 'rgb(3,5,11)'; ctx.globalAlpha = Math.min(1, D * 0.94); ctx.fillRect(-2, -2, W.w + 4, W.h + 4); ctx.globalAlpha = 1; return; }
    const K = 4, ow = Math.ceil(W.w / K) + 1, oh = Math.ceil(W.h / K) + 1;
    const key = W.w + '|' + W.h + '|' + lk.join(',');
    try {
      if (!DARK) DARK = document.createElement('canvas');
      if (DARK.width !== ow || DARK.height !== oh) { DARK.width = ow; DARK.height = oh; DARKKEY = ''; }
    } catch (e) { DARK = null; return; }
    if (key !== DARKKEY) { renderDark(DARK, K, ow, oh); DARKKEY = key; }
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = Math.min(1, D * 0.94);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(DARK, 0, 0, ow, oh, 0, 0, ow * K, oh * K);
    ctx.restore();
  }
  function renderDark(cv, K, ow, oh) {
    const o = cv.getContext('2d');
    o.setTransform(1, 0, 0, 1, 0, 0);
    o.globalCompositeOperation = 'source-over';
    o.globalAlpha = 1;
    o.clearRect(0, 0, ow, oh);
    o.setTransform(1 / K, 0, 0, 1 / K, 0, 0);
    o.fillStyle = 'rgb(3,5,11)';
    o.fillRect(0, 0, W.w + K, W.h + K);
    o.globalCompositeOperation = 'destination-out';
    const G = draftGeo(), firm = L('pvFirm');
    // 高天：弧下的天随笔扫开（半揭；穹苍坚硬之后更明）
    const pv = L('pvVault');
    if (pv > 0.002) {
      o.globalAlpha = 0.24 + 0.32 * firm;
      o.fillStyle = 'rgb(0,0,0)';
      o.beginPath(); o.moveTo(G.vcx, G.vcy); o.ellipse(G.vcx, G.vcy, G.vrx, G.vry, 0, TAU - Math.PI * pv, TAU); o.closePath(); o.fill();
    }
    // 渊面的圆圈：圈里的海面（半揭）
    const pc = L('pvCircle');
    if (pc > 0.002) {
      o.globalAlpha = 0.34;
      o.fillStyle = 'rgb(0,0,0)';
      o.beginPath(); o.moveTo(G.ccx, G.ccy); o.ellipse(G.ccx, G.ccy, G.crx, G.cry, 0, -Math.PI / 2, -Math.PI / 2 + TAU * pc); o.closePath(); o.fill();
    }
    // 大水的泉源：海上几处柔光
    const spr = L('pvSprings');
    if (spr > 0.01 && SP) {
      o.globalAlpha = 0.5 * spr;
      for (const q of (port() ? SPRINGS_P : SPRINGS_L)) { const r = 60 * Math.max(0.7, W.unit); o.drawImage(SP.white, q[0] * W.w - r, q[1] * W.h - r * 0.6, r * 2, r * 1.2); }
    }
    // 为沧海定出界限：三层自西向东，界限之下的一整层（地与其下的海）随笔揭开；笔前一段是柔的
    if (L('pvBound') > 0.001) {
      const R = ridges();
      for (let l = 0; l < 3; l++) {
        const bd = boundK(l);
        if (bd <= 0) continue;
        const P = boundPen(l, bd);
        if (!P) continue;
        const B = P[3], iE = P[2], xr = P[0];
        const nxt = l < 2 ? R.L[l + 1] : null;
        const lift = l === 0 ? 26 : 10;
        const soft = Math.max(60, W.w * 0.08);
        const gr = o.createLinearGradient(xr - soft, 0, xr, 0);
        gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        o.fillStyle = gr;
        o.globalAlpha = 1;
        o.beginPath();
        const x0 = B.pts[B.i0][0];
        o.moveTo(x0, B.pts[B.i0][1] - lift);
        for (let i = B.i0; i <= iE; i++) o.lineTo(B.pts[i][0], B.pts[i][1] - lift);
        o.lineTo(xr, P[1] - lift);
        if (nxt) {
          const yAt = x => { const f = clamp(x / W.w, 0, 1) * (nxt.length - 1), i = Math.floor(f), t = f - i, a = nxt[i], b2 = nxt[Math.min(nxt.length - 1, i + 1)]; return lerp(a[1], b2[1], t) + 2; };
          o.lineTo(xr, yAt(xr));
          for (let i = iE; i >= B.i0; i--) o.lineTo(B.pts[i][0], yAt(B.pts[i][0]));
        } else { o.lineTo(xr, W.h + 4); o.lineTo(x0, W.h + 4); }
        o.closePath(); o.fill();
        // 笔经过处一道柔的光带
        o.strokeStyle = 'rgb(0,0,0)'; o.globalAlpha = 0.55; o.lineWidth = 44; o.lineCap = 'round'; o.lineJoin = 'round';
        o.beginPath();
        for (let i = B.i0; i <= iE; i++) (i === B.i0 ? o.moveTo(B.pts[i][0], B.pts[i][1]) : o.lineTo(B.pts[i][0], B.pts[i][1]));
        o.lineTo(xr, P[1]);
        o.stroke();
      }
    }
    o.globalCompositeOperation = 'source-over';
    o.globalAlpha = 1;
  }
  // 一道金线：柔的光晕、中层、明亮的芯（落在经文处的部分淡些）
  function goldRun(ctx, pts, i0, i1, a, wk) {
    const u = Math.max(0.7, W.unit) * (wk || 1);
    ctx.strokeStyle = 'rgb(255,214,140)'; ctx.lineWidth = 9 * u; strokeRun(ctx, pts, i0, i1, a * 0.15);
    ctx.strokeStyle = 'rgb(255,226,160)'; ctx.lineWidth = 4.6 * u; strokeRun(ctx, pts, i0, i1, a * 0.3);
    ctx.strokeStyle = 'rgb(255,242,210)'; ctx.lineWidth = 2.3 * u; strokeRun(ctx, pts, i0, i1, a * 0.95);
  }
  // 笔尖：明亮的一点
  function penTip(x, y, a) {
    if (!SP || a < 0.01) return;
    const u = Math.max(0.7, W.unit);
    glowAt(SP.gold, x, y, 18 * u, a * 0.95);
    glowAt(SP.white, x, y, 5 * u, a);
  }
  function drawDraft(ctx) {
    const D = L('pvDraft'), star = L('pvStar');
    if (D < 0.004 && star < 0.004) return;
    const G = draftGeo(), u = Math.max(0.7, W.unit), R = ridges();
    ctx.save();
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const GOLD = 'rgb(255,222,150)', GOLD2 = 'rgb(255,236,196)';
    if (D > 0.004) {
      // 1. 高天：自东（右，那点光所在）向西划出的一道弧；刻度；坚硬之后弧内一层淡光
      const pv = L('pvVault');
      if (pv > 0.001) {
        const firm = L('pvFirm');
        if (firm > 0.01) {
          ctx.globalAlpha = D * firm * 0.12;
          const gr = ctx.createLinearGradient(0, G.vcy - G.vry, 0, G.vcy);
          gr.addColorStop(0, 'rgba(180,200,255,0.9)'); gr.addColorStop(1, 'rgba(180,200,255,0)');
          ctx.fillStyle = gr;
          ctx.beginPath(); ctx.ellipse(G.vcx, G.vcy, G.vrx, G.vry, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
        }
        const pts = ellipsePts(G.vcx, G.vcy, G.vrx, G.vry, TAU, TAU - Math.PI * pv, Math.max(4, Math.round(90 * pv)));
        goldRun(ctx, pts, 0, pts.length - 1, D, 1 + 0.25 * firm);
        // 刻度（工师的尺）
        ctx.strokeStyle = GOLD; ctx.lineWidth = 1.3 * u;
        ctx.beginPath();
        for (let i = 1; i < 36; i++) {
          const a = TAU - Math.PI * (i / 36);
          if (i / 36 > pv) break;
          const x = G.vcx + Math.cos(a) * G.vrx, y = G.vcy + Math.sin(a) * G.vry;
          const nx = Math.cos(a) / G.vrx, ny = Math.sin(a) / G.vry, nl = Math.hypot(nx, ny) || 1;
          const len = (i % 6 ? 5 : 11) * u;
          if (inText(x, y)) continue;
          ctx.moveTo(x, y); ctx.lineTo(x + (nx / nl) * len, y + (ny / nl) * len);
        }
        ctx.globalAlpha = D * 0.6; ctx.stroke();
        if (pv < 0.999) { const e = pts[pts.length - 1]; penTip(e[0], e[1], D); }
      }
      // 2. 渊面上的圆圈（远边就是地平线）：圆规——一脚立在圆心，一脚随圆周走；画完，圆规隐去
      const pc = L('pvCircle');
      if (pc > 0.001) {
        const a0 = -Math.PI / 2, pts = ellipsePts(G.ccx, G.ccy, G.crx, G.cry, a0, a0 + TAU * pc, Math.max(4, Math.round(120 * pc)));
        goldRun(ctx, pts, 0, pts.length - 1, D, 1);
        const e = pts[pts.length - 1];
        const cA = D * (1 - smoothstep(0.93, 1, pc)) * smoothstep(0, 0.04, pc);
        if (cA > 0.01) {
          const dx = e[0] - G.ccx, dy = e[1] - G.ccy, d = Math.hypot(dx, dy);
          const Lg = G.crx * 0.56, hh = Math.sqrt(Math.max(0, Lg * Lg - d * d / 4));
          const mx = (G.ccx + e[0]) / 2, my = (G.ccy + e[1]) / 2;
          const nx = d > 1 ? -dy / d : 0, ny = d > 1 ? dx / d : -1;
          const sgn = ny > 0 ? -1 : 1;
          const hx = mx + nx * hh * sgn, hy = my + ny * hh * sgn;
          const legs = [[G.ccx, G.ccy], [hx, hy], [e[0], e[1]]];
          goldRun(ctx, legs, 0, 2, cA * 0.85, 0.9);
          // 圆规的轴与柄
          ctx.strokeStyle = GOLD2; ctx.lineWidth = 2 * u; ctx.globalAlpha = cA * 0.8;
          ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - 12 * u); ctx.stroke();
          glowAt(SP && SP.gold, hx, hy, 16 * u * (0.9 + 0.1 * Math.sin(W.t * 3)), cA * 0.9);
          glowAt(SP && SP.white, hx, hy, 4.5 * u, cA);
          glowAt(SP && SP.gold, G.ccx, G.ccy, 10 * u, cA * 0.7);
        }
        if (pc < 0.999) penTip(e[0], e[1], D);
      }
      // 3. 大山未曾奠定（虚线，微颤）→ 立定大地的根基之后淡去
      const sk = L('pvSketch'), fd = L('pvFound'), bdAll = L('pvBound');
      if (sk > 0.01) {
        ctx.strokeStyle = GOLD; ctx.lineWidth = 2.6 * u;
        ctx.setLineDash([5 * u, 7 * u]);
        ctx.lineDashOffset = -W.t * 6;
        for (let l = 0; l < 2; l++) {
          for (const run of landRuns(R.L[l])) {
            const pts = run.map((q, i) => [q[0], q[1] - Math.sin(W.t * 2 + i * 0.7) * 1.5 * u * (1 - fd)]);
            if (pts.length > 1) strokeRun(ctx, pts, 0, pts.length - 1, D * sk * 0.95 * (1 - 0.8 * bdAll));
          }
        }
        ctx.setLineDash([]);
      }
      // 4. 为沧海定出界限：三层的界限自西向东描出，笔尖明亮
      if (bdAll > 0.001) {
        for (let l = 0; l < 3; l++) {
          const bd = boundK(l);
          if (bd <= 0) continue;
          const P = boundPen(l, bd);
          if (!P) continue;
          const B = P[3], pts = B.pts.slice(B.i0, P[2] + 1).concat([[P[0], P[1]]]);
          goldRun(ctx, pts, 0, pts.length - 1, D * (l === 2 ? 1 : 0.85), l === 2 ? 1.1 : 0.9);
          if (bd < 0.999) penTip(P[0], P[1], D);
        }
      }
      // 5. 立定大地的根基：近岸的地下几根发光的柱子，自地面向下立起，越往下越淡
      if (fd > 0.001) {
        const xs = port() ? FOUND_P : FOUND_L, yb = W.h + 4;
        const gtop = Math.min(...xs.map(xf => gY(2, xf)));
        const gr = ctx.createLinearGradient(0, gtop, 0, yb);
        gr.addColorStop(0, 'rgba(255,232,176,1)'); gr.addColorStop(0.55, 'rgba(255,214,140,0.45)'); gr.addColorStop(1, 'rgba(255,200,120,0.06)');
        for (let i = 0; i < xs.length; i++) {
          const f = clamp(fd * 1.5 - i * 0.12, 0, 1);
          if (f <= 0) continue;
          const x = xs[i] * W.w, g = gY(2, xs[i]) + 3 * u, ye = lerp(g, yb, U.easeOut ? U.easeOut(f) : f);
          ctx.fillStyle = gr;
          ctx.globalAlpha = D * 0.16; ctx.fillRect(x - 10 * u, g, 20 * u, ye - g);
          ctx.globalAlpha = D * 0.32; ctx.fillRect(x - 4.5 * u, g, 9 * u, ye - g);
          ctx.globalAlpha = D * 0.9; ctx.fillRect(x - 1.6 * u, g, 3.2 * u, ye - g);
          // 柱头（根基的石）
          ctx.fillStyle = 'rgb(255,236,190)'; ctx.globalAlpha = D * 0.85 * f;
          ctx.fillRect(x - 8 * u, g - 1 * u, 16 * u, 2.4 * u);
          glowAt(SP && SP.gold, x, g, 16 * u, D * 0.6 * f);
          if (f < 0.999) penTip(x, ye, D * 0.8);
        }
      }
      // 6. 大水的泉源：海上几处升起的光
      const sp = L('pvSprings');
      if (sp > 0.01 && SP) {
        const SPs = port() ? SPRINGS_P : SPRINGS_L;
        for (let i = 0; i < SPs.length; i++) {
          const x = SPs[i][0] * W.w, y = SPs[i][1] * W.h;
          const ph = 0.6 + 0.4 * Math.sin(W.t * 1.7 + i * 1.9);
          const m = textMask(x, y);
          glowAt(SP.pale, x, y - 6 * u, 26 * u, D * sp * ph * m, 1.6);
          glowAt(SP.white, x, y - 3 * u, 7 * u, D * sp * 0.8 * m);
          ctx.strokeStyle = 'rgb(210,226,255)'; ctx.lineWidth = 1.9 * u;
          ctx.globalAlpha = Math.min(1, D * sp * 0.95 * m);
          ctx.beginPath();
          for (let j = 0; j < 3; j++) { const hh = (10 + 7 * U.fract(W.t * 0.6 + j / 3)) * u; ctx.moveTo(x + (j - 1) * 2 * u, y); ctx.quadraticCurveTo(x + (j - 1) * 4 * u, y - hh * 0.7, x + (j - 1) * 6 * u, y - hh * 0.2); }
          ctx.stroke();
        }
      }
    }
    // 7. 那一点光（太初就有了的智慧）：金色，缓缓地明暗；踊跃时随舞步飞过全地，身后一道长长的余光
    if (star > 0.004 && SP) {
      const dn = L('pvDance');
      const p = dn > 0.001 ? danceAt(dn) : G.star;
      const pul = 0.88 + 0.12 * Math.sin(W.t * 1.1);
      if (dn > 0.001 && dn < 0.999) {
        for (let i = 1; i <= 40; i++) {
          const q = danceAt(Math.max(0, dn - i * 0.005));
          glowAt(SP.gold, q[0], q[1], (12 - i * 0.2) * u, star * 0.55 * (1 - i / 41));
        }
      }
      glowAt(SP.gold, p[0], p[1], 62 * u * pul, star * 0.62);
      glowAt(SP.gold, p[0], p[1], 24 * u, star * 0.75);
      glowAt(SP.white, p[0], p[1], 13 * u, star);
      ctx.strokeStyle = 'rgb(255,240,200)'; ctx.lineWidth = 1.3 * u;
      ctx.globalAlpha = star * 0.7 * pul;
      const rl = 30 * u * pul;
      ctx.beginPath(); ctx.moveTo(p[0] - rl, p[1]); ctx.lineTo(p[0] + rl, p[1]); ctx.moveTo(p[0], p[1] - rl * 1.3); ctx.lineTo(p[0], p[1] + rl * 1.3); ctx.stroke();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：智慧身上的光、浇灌的光雨、人心里的灯、她得称赞的光
  // ════════════════════════════════════════════════════════════
  function drawWisdom(ctx) {
    const f = fig('wisdom');
    const k = L('pvWis');
    if (!f || !f._vis || k < 0.01 || !SP) return;
    const x = f._x, y = f._y, h = f._h || 40, a = (f.alpha != null ? f.alpha : 1) * k;
    ctx.globalCompositeOperation = 'lighter';
    const pul = 0.9 + 0.1 * Math.sin(W.t * 1.6);
    glowAt(SP.gold, x, y - h * 0.55, h * 1.1 * pul, a * (0.3 + 0.25 * nightK()));
    glowAt(SP.white, x, y - h * 0.62, h * 0.35, a * 0.35);
    ctx.globalAlpha = a * 0.12;
    ctx.drawImage(SP.beam, x - h * 0.35, y - h * 3.2, h * 0.7, h * 3.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 我要将我的灵浇灌你们（1:23）：温暖的金色光点自智慧举起的手，成一道柔和的光锥飘落在众人身上，落处一圈小小的光环
  function drawPour(ctx) {
    const k = L('pvPour');
    if (k < 0.01 || !SP) return;
    const s = LS(2), f = fig('wisdom');
    const src = f && f._vis ? [f._x + (f.facing || -1) * (f._h || 40) * 0.08, f._y - (f._h || 40) * 1.02] : headOf('wisdom', 1.05);
    const xa = (X.plaza0 - 0.03) * W.w, xb = (X.gate - 0.02) * W.w;
    const ga = gY(2, X.plaza0 - 0.03), gb = gY(2, X.gate - 0.02);
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    // 光锥
    const gr = ctx.createLinearGradient(0, src[1], 0, Math.max(ga, gb));
    gr.addColorStop(0, 'rgba(255,232,170,0.55)'); gr.addColorStop(1, 'rgba(255,232,170,0.08)');
    ctx.fillStyle = gr;
    ctx.globalAlpha = k * 0.75;
    ctx.beginPath(); ctx.moveTo(src[0] - 3 * s, src[1]); ctx.lineTo(src[0] + 3 * s, src[1]); ctx.lineTo(xb, gb); ctx.lineTo(xa, ga); ctx.closePath(); ctx.fill();
    glowAt(SP.gold, src[0], src[1], 16 * s, k * 0.8);
    // 飘落的光点与落处的光环
    const N = 56;
    ctx.strokeStyle = 'rgb(255,230,170)';
    ctx.lineWidth = Math.max(0.6, 0.8 * s);
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (0.16 + 0.08 * hsh(i * 3.3)) + hsh(i * 1.7));
      const lx = lerp(xa, xb, hsh(i * 5.1)), ly = gY(2, lx / W.w) - 2 * s;
      if (ph < 0.9) {
        const q = ph / 0.9, e = q * q * (3 - 2 * q);
        const x = lerp(src[0], lx, e) + Math.sin(W.t * 0.9 + i) * 2.5 * s * Math.sin(Math.PI * q), y = lerp(src[1], ly, q);
        glowAt(SP.gold, x, y, (3.5 + 2 * hsh(i * 7.7)) * s, k * Math.min(1, q * 5));
      } else {
        const q = (ph - 0.9) / 0.1;
        ctx.globalAlpha = k * 0.6 * (1 - q);
        ctx.beginPath(); ctx.ellipse(lx, ly + 1 * s, (1.5 + 6 * q) * s, (0.6 + 2 * q) * s, 0, 0, TAU); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 人的灵是耶和华的灯（20:27）：每个人胸中一盏小灯
  function drawSouls(ctx) {
    const k = L('pvSouls');
    if (k < 0.01 || !SP) return;
    const c = C();
    ctx.globalCompositeOperation = 'lighter';
    const one = p => {
      if (!p || !p._vis || p.isAnimal || p.alpha < 0.3) return;
      const h = p._h || 30, x = p._x, y = p._y - h * (p.pose === 'sit' ? 0.4 : p.pose === 'lie' ? 0.1 : 0.62);
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + (p.phase || 0) * 3);
      glowAt(SP.lamp, x, y, h * 0.22 * fl, k * 0.9 * p.alpha);
      glowAt(SP.warm, x, y, h * 0.55, k * 0.25 * p.alpha * (0.4 + 0.6 * nightK()));
    };
    if (c.people) for (const p of c.people.values()) if (!p.dying) one(p);
    if (c.crowds) for (const g of c.crowds.values()) if (!g.herd) g.members.forEach(one);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawPraise(ctx) {
    const k = L('pvPraise');
    if (k < 0.01 || !SP) return;
    const f = fig('mother');
    if (!f || !f._vis) return;
    const h = f._h || 40, pk = port() ? 0.6 : 1;   // 竖屏上人挤得近，光收小些，免得把人都照白了
    ctx.globalCompositeOperation = 'lighter';
    ctxA = ctx;
    ctx.globalAlpha = k * 0.5 * pk;
    ctx.drawImage(SP.beam, f._x - h * 1.1 * pk, -20, h * 2.2 * pk, f._y + 20);
    glowAt(SP.gold, f._x, f._y - h * 0.5, h * 1.6 * pk, k * 0.62 * pk);
    glowAt(SP.white, f._x, f._y - h * 0.62, h * 0.42, k * 0.45);
    // 脚下一片温暖的光
    glowAt(SP.amber, f._x, f._y, h * 2.6 * pk, k * 0.55 * pk, 0.26);
    glowAt(SP.gold, f._x, f._y, h * 1.2 * pk, k * 0.4, 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 必得安稳（29:25）：羊群躺卧处一层温和的光
  // 使女手里的一盘饼（9:5：你们来，吃我的饼）
  function drawBread(ctx) {
    const f = fig('maid2');
    if (!f || !f._vis || f.pose !== 'carry' || f.tx != null || !(L('pvFeast') > 0.3)) return;
    const h = f._h || 40, d = f.fd || f.facing || 1, a = (f.alpha != null ? f.alpha : 1) * Math.min(1, f.poseT != null ? f.poseT : 1);
    if (a < 0.05) return;
    const x = f._x + d * h * 0.2, y = f._y - h * 0.6;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([150, 112, 72], 2);
    ctx.beginPath(); ctx.ellipse(x, y + h * 0.012, h * 0.1, h * 0.022, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([222, 176, 104], 2, 1, 0.1);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x + (i - 1) * h * 0.055, y - h * 0.012 - (i === 1 ? h * 0.012 : 0), h * 0.036, h * 0.022, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function restGeo() {
    const s = LS(2), xf = (X.flock0 + X.flock1) / 2, y0 = baseY(2, xf, 0.04), y1 = baseY(2, xf, 0.36);
    return { s, x: xf * W.w, y: (y0 + y1) / 2, rx: (X.flock1 - X.flock0) / 2 * W.w + 24 * s, ry: Math.max(8 * s, (y1 - y0) / 2 + 5 * s) };
  }
  function drawRest(ctx) {
    const k = L('pvRest');
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const g = restGeo();
    glowAt(SP.gold, g.x, g.y, g.rx * 1.2, k * 0.3, 0.4);
    // 一穹柔光覆庇着躺卧的羊群
    ctx.save(); ctx.translate(g.x, g.y); ctx.scale(1, 0.55);
    ctx.globalAlpha = 1;
    ctx.lineWidth = Math.max(2, 6 * g.s); ctx.strokeStyle = U.rgba(255, 232, 180, 0.08 * k);
    ctx.beginPath(); ctx.arc(0, 0, g.rx * 1.05, Math.PI * 1.06, Math.PI * 1.94); ctx.stroke();
    ctx.lineWidth = Math.max(1, 1.8 * g.s); ctx.strokeStyle = U.rgba(255, 240, 206, 0.34 * k); ctx.stroke();
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 羊群躺卧处地上的一圈光（在羊之下）
  function drawRestRing(ctx) {
    const k = L('pvRest');
    if (k < 0.01 || !SP) return;
    const g = restGeo();
    ctx.globalCompositeOperation = 'lighter';
    ctxA = ctx;
    glowAt(SP.amber, g.x, g.y, g.rx, k * 0.28, g.ry / g.rx);
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.ellipse(g.x, g.y, g.rx, g.ry, 0, 0, TAU);
    ctx.lineWidth = 10 * g.s; ctx.strokeStyle = U.rgba(255, 214, 140, 0.14 * k); ctx.stroke();
    ctx.lineWidth = Math.max(1.4, 2.4 * g.s); ctx.strokeStyle = U.rgba(255, 238, 190, 0.8 * k); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  画：隐秘的众星（25:2）
  // ════════════════════════════════════════════════════════════
  function drawHidden(ctx) {
    const k = L('pvHidden') * clamp(W.night * 1.2, 0, 1);
    if (k < 0.01 || !SP) return;
    const hz = W.horizonY, MK = milky();
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W.w, hz - 1); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    // 银河：自东北斜向西南（按屏幕尺寸画好的一张，不拉伸）
    if (MK) { ctx.globalAlpha = k * 0.85; ctx.drawImage(MK.c, 0, 0, W.w, MK.hz); }
    ctx.fillStyle = 'rgb(255,248,230)';
    const N = Math.round(220 * (W.quality || 1));
    for (let i = 0; i < N; i++) {
      const x = hsh(i * 1.37) * W.w, y = Math.pow(hsh(i * 2.91), 1.3) * hz * 0.95;
      const tw = 0.55 + 0.45 * Math.sin(W.t * (1 + hsh(i) * 2) + i);
      const big = hsh(i * 7.7) > 0.93;
      ctx.globalAlpha = k * tw * (big ? 0.9 : 0.5);
      const r = big ? 1.5 : 0.9;
      ctx.fillRect(x - r / 2, y - r / 2, r, r);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：亚古珥的问（30:4）与三样奇妙的「道」（30:19）
  // ════════════════════════════════════════════════════════════
  function fistXY() { return port() ? [W.w * 0.66, W.h * 0.5] : [W.w * 0.72, W.h * 0.32]; }
  function drawWind(ctx) {
    const k = L('pvWind');
    if (k < 0.01) return;
    const f = L('pvFist'), c = fistXY(), R0 = M() * 0.28;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(236,242,255)';
    const N = 46;
    for (let i = 0; i < N; i++) {
      const r = R0 * (0.25 + 0.75 * hsh(i * 1.3)) * (1 - 0.94 * f);
      const a = hsh(i * 3.7) * TAU + W.t * (1.2 + 3 * f) * (0.7 + 0.6 * hsh(i));
      const len = (0.5 + 0.5 * hsh(i * 5.1)) * (1.1 - 0.5 * f);
      ctx.globalAlpha = k * (0.36 + 0.4 * f) * (0.5 + 0.5 * hsh(i * 9));
      ctx.lineWidth = (1.1 + 1.8 * hsh(i * 2.2)) * Math.max(0.7, W.unit);
      ctx.beginPath();
      ctx.ellipse(c[0], c[1], r, r * 0.55, -0.2, a, a + len);
      ctx.stroke();
    }
    if (SP) { ctxA = ctx; glowAt(SP.pale, c[0], c[1], R0 * (1 - 0.8 * f), k * 0.12); if (f > 0.05) glowAt(SP.white, c[0], c[1], 36 * Math.max(0.7, W.unit) * (0.6 + f), k * f * 0.85); }
    ctx.restore();
  }
  // 谁包水在衣服里：海上一层光的衣裳——几道宽的、半透明的褶，边是柔的，映着光（分三段，在各层地之后；横屏时避开左边的经文）
  function drawWrap(ctx, pass) {
    const k = L('pvWrap');
    if (k < 0.01) return;
    const hz = W.horizonY, w0 = W.waterlineY(0), w1 = W.waterlineY(1);
    const band = pass === 'seaFar' ? [hz, w0] : pass === 'seaMid' ? [w0, w1] : [w1, W.h];
    const bh = band[1] - band[0];
    if (bh < 2) return;
    const pt = port(), xa = pt ? 0 : W.w * 0.47, xf = pt ? 0 : W.w * 0.62;
    const lum = 0.5 + 0.5 * W.daylight;
    const grad = a => {
      const g = ctx.createLinearGradient(xa, 0, Math.max(xa + 1, xf), 0);
      g.addColorStop(0, pt ? U.rgba(236, 244, 255, a) : 'rgba(236,244,255,0)'); g.addColorStop(1, U.rgba(236, 244, 255, a));
      return g;
    };
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad(0.12 * k * lum);
    ctx.fillRect(xa, band[0], W.w - xa, bh);
    // 褶：沿缓缓起伏的曲线，宽→窄三层叠出柔的边
    const n = pass === 'seaNear' ? 3 : pass === 'seaMid' ? 2 : 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let j = 0; j < n; j++) {
      const y0 = lerp(band[0], band[1], (j + 0.55) / (n + 0.2)), amp = Math.min(bh * 0.12, 14 * Math.max(0.7, W.unit));
      const pts = [];
      for (let i = 0; i <= 16; i++) { const x = lerp(xa, W.w + 10, i / 16); pts.push([x, y0 + Math.sin(i * 0.7 + j * 1.9 + W.t * 0.5) * amp]); }
      const thick = Math.max(4, Math.min(bh * 0.3, 26 * Math.max(0.7, W.unit)));
      for (const q of [[1, 0.08], [0.55, 0.1], [0.2, 0.14]]) {
        ctx.strokeStyle = grad(q[1] * k * lum);
        ctx.lineWidth = thick * q[0];
        ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
      }
    }
    ctx.restore();
  }
  function eagleC() { return port() ? [W.w * 0.62, W.h * 0.44, W.w * 0.2] : [W.w * 0.7, W.h * 0.2, W.w * 0.09]; }
  function eagleAt(t) { const c = eagleC(), a = t * 0.42; return [c[0] + Math.cos(a) * c[2], c[1] + Math.sin(a) * c[2] * 0.42, a]; }
  function drawEagle(ctx) {
    const k = L('pvWonder');
    if (k < 0.01) return;
    const u = Math.max(0.8, W.unit), p = eagleAt(W.t);
    ctx.save();
    // 道：身后一段淡金的弧
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,230,170)';
    ctx.lineWidth = 1.2 * u;
    for (let i = 0; i < 20; i++) {
      const a0 = eagleAt(W.t - i * 0.18), a1 = eagleAt(W.t - (i + 1) * 0.18);
      ctx.globalAlpha = k * 0.35 * (1 - i / 20);
      ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 鹰：展翅盘旋的剪影
    const dir = Math.cos(p[2] + Math.PI / 2) >= 0 ? 1 : -1;
    const sz = 16 * u, flap = Math.sin(W.t * 1.3) * 0.12;
    ctx.globalAlpha = k;
    ctx.translate(p[0], p[1]);
    ctx.scale(dir, 1);
    ctx.fillStyle = W.shadeCSS([46, 38, 32], 0.3);
    ctx.beginPath();
    ctx.moveTo(sz * 0.55, 0);
    ctx.quadraticCurveTo(sz * 0.2, -sz * 0.08, -sz * 0.05, -sz * 0.06);
    ctx.lineTo(-sz * 0.35, -sz * (0.55 + flap)); ctx.lineTo(-sz * 0.48, -sz * (0.5 + flap)); ctx.lineTo(-sz * 0.52, -sz * (0.6 + flap)); ctx.lineTo(-sz * 0.62, -sz * (0.5 + flap));
    ctx.quadraticCurveTo(-sz * 0.5, -sz * 0.2, -sz * 0.32, -sz * 0.02);
    ctx.lineTo(-sz * 0.62, -sz * 0.1); ctx.lineTo(-sz * 0.66, sz * 0.08); ctx.lineTo(-sz * 0.3, sz * 0.06);
    ctx.quadraticCurveTo(-sz * 0.45, sz * (0.35 + flap), -sz * 0.4, sz * (0.5 + flap));
    ctx.lineTo(-sz * 0.2, sz * (0.46 + flap)); ctx.quadraticCurveTo(-sz * 0.05, sz * 0.2, sz * 0.1, sz * 0.05);
    ctx.quadraticCurveTo(sz * 0.3, sz * 0.06, sz * 0.55, 0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([255, 230, 180], 0.2, 0.5 * dayA());
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(sz * 0.55, 0); ctx.quadraticCurveTo(sz * 0.2, -sz * 0.08, -sz * 0.05, -sz * 0.06); ctx.lineTo(-sz * 0.35, -sz * (0.55 + flap)); ctx.stroke();
    ctx.restore();
  }
  function rockXY() { return [X.rock * W.w, baseY(2, X.rock, 0.8)]; }
  function drawRock(ctx) {
    const s = LS(2), p = rockXY(), w = 22 * s, h = 10 * s;
    ctx.fillStyle = css([128, 120, 110], 2);
    ctx.beginPath();
    ctx.moveTo(p[0] - w, p[1]);
    ctx.quadraticCurveTo(p[0] - w * 0.9, p[1] - h * 0.9, p[0] - w * 0.3, p[1] - h);
    ctx.quadraticCurveTo(p[0] + w * 0.4, p[1] - h * 1.15, p[0] + w * 0.85, p[1] - h * 0.5);
    ctx.quadraticCurveTo(p[0] + w, p[1] - h * 0.2, p[0] + w, p[1]);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([90, 84, 78], 2, 0.8);
    ctx.beginPath(); ctx.moveTo(p[0] + w * 0.2, p[1]); ctx.quadraticCurveTo(p[0] + w * 0.6, p[1] - h * 0.55, p[0] + w * 0.85, p[1] - h * 0.5); ctx.quadraticCurveTo(p[0] + w, p[1] - h * 0.2, p[0] + w, p[1]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([240, 232, 214], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(p[0] - w * 0.9, p[1] - h * 0.7); ctx.quadraticCurveTo(p[0] - w * 0.5, p[1] - h * 1.05, p[0] - w * 0.1, p[1] - h * 1.02); ctx.stroke();
    const k = L('pvWonder');
    if (k < 0.01) return;
    // 蛇：沿磐石的顶缓缓爬过，身后留一道光的道
    const top = u => {
      const x = lerp(p[0] - w * 0.95, p[0] + w * 0.95, u);
      const t = (x - (p[0] - w)) / (2 * w);
      return [x, p[1] - h * (0.55 + 0.55 * Math.sin(Math.PI * clamp(t, 0, 1))) + 0.4 * s];
    };
    const head = U.fract(W.t * 0.035);
    const body = [];
    for (let i = 0; i < 16; i++) {
      const uu = head - i * 0.018;
      if (uu < 0) break;
      const q = top(uu), wig = Math.sin(W.t * 3 - i * 0.9) * 1.1 * s * (i / 16 + 0.3);
      body.push([q[0], q[1] + wig * 0.35 - 0.8 * s]);
    }
    ctx.save();
    ctx.globalAlpha = k;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,226,160)';
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.globalAlpha = k * 0.35;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const uu = head - 0.3 + i * 0.3 / 20; if (uu < 0) continue; const q = top(uu); ctx.lineTo(q[0], q[1] + 0.4 * s); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    if (body.length > 1) {
      ctx.strokeStyle = css([70, 78, 48], 2);
      ctx.lineCap = 'round';
      for (let i = 0; i < body.length - 1; i++) {
        ctx.lineWidth = Math.max(0.6, (1.9 - i * 0.09) * s);
        ctx.beginPath(); ctx.moveTo(body[i][0], body[i][1]); ctx.lineTo(body[i + 1][0], body[i + 1][1]); ctx.stroke();
      }
      ctx.fillStyle = css([70, 78, 48], 2);
      ctx.beginPath(); ctx.ellipse(body[0][0] + 1 * s, body[0][1], 1.6 * s, 1.1 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function shipXY() {
    const k = L('pvShip'), y = W.h * (port() ? 0.672 : 0.668);
    const x = port() ? lerp(0.1, 0.5, k) : lerp(0.52, 0.95, k);
    return [x * W.w, y];
  }
  function drawShip(ctx) {
    const k = L('pvWonder');
    if (k < 0.01) return;
    const p = shipXY(), sc = (W.seaScale ? W.seaScale(p[1]) : 0.3) * (port() ? 3.4 : 3.2);
    const L0 = 70 * sc, bob = Math.sin(W.t * 1.4) * 0.8 * sc;
    ctx.save();
    ctx.globalAlpha = k;
    // 航迹（道）
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(236,244,255)';
    ctx.lineWidth = Math.max(0.6, 1.2 * sc);
    for (let i = 0; i < 2; i++) {
      ctx.globalAlpha = k * (i ? 0.2 : 0.4);
      ctx.beginPath();
      ctx.moveTo(p[0] - L0 * 0.45, p[1] + 1);
      ctx.quadraticCurveTo(p[0] - L0 * 1.6, p[1] + (i ? 5 : 2) * sc, p[0] - L0 * (3.2 + i), p[1] + (i ? 9 : 3) * sc);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgb(255,226,160)';
    ctx.globalAlpha = k * 0.3;
    ctx.lineWidth = Math.max(0.6, 0.8 * sc);
    ctx.beginPath(); ctx.moveTo(p[0] - L0 * 0.5, p[1] + 1.5 * sc); ctx.lineTo(p[0] - L0 * 4.5, p[1] + 3 * sc); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    // 船身、桅、帆
    const y = p[1] + bob;
    ctx.fillStyle = W.shadeCSS([74, 56, 40], 0.6);
    ctx.beginPath();
    ctx.moveTo(p[0] - L0 * 0.5, y - 5 * sc); ctx.lineTo(p[0] + L0 * 0.55, y - 6 * sc);
    ctx.quadraticCurveTo(p[0] + L0 * 0.4, y + 1 * sc, p[0] + L0 * 0.2, y + 2 * sc);
    ctx.lineTo(p[0] - L0 * 0.35, y + 2 * sc);
    ctx.quadraticCurveTo(p[0] - L0 * 0.48, y, p[0] - L0 * 0.5, y - 5 * sc);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = W.shadeCSS([60, 46, 34], 0.6);
    ctx.fillRect(p[0] - 0.8 * sc, y - 34 * sc, 1.6 * sc, 29 * sc);
    ctx.fillStyle = W.shadeCSS([238, 228, 206], 0.5, 1, 0.1);
    ctx.beginPath();
    ctx.moveTo(p[0] - 14 * sc, y - 31 * sc); ctx.lineTo(p[0] + 14 * sc, y - 31 * sc);
    ctx.quadraticCurveTo(p[0] + 17 * sc, y - 19 * sc, p[0] + 13 * sc, y - 9 * sc);
    ctx.lineTo(p[0] - 13 * sc, y - 9 * sc);
    ctx.quadraticCurveTo(p[0] - 10 * sc, y - 20 * sc, p[0] - 14 * sc, y - 31 * sc);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS([255, 240, 210], 0.4, 0.6 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.7 * sc);
    ctx.beginPath(); ctx.moveTo(p[0] + 14 * sc, y - 31 * sc); ctx.quadraticCurveTo(p[0] + 17 * sc, y - 19 * sc, p[0] + 13 * sc, y - 9 * sc); ctx.stroke();
    ctx.restore();
  }

  // ── 转瞬的光 ────────────────────────────────────────────────
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctxA = ctx;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'ascend') {
        // 谁升天又降下来：一道光自智慧的房屋升到天上，又降下来
        const G = h7Geo(), x = G.cx, y0 = G.gy - G.tH - G.pH;
        const up = q < 0.5 ? q / 0.5 : 1 - (q - 0.5) / 0.5;
        const topY = lerp(y0, -20, U.easeInOut ? U.easeInOut(up) : up);
        const env = Math.sin(Math.PI * q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5 * env;
        const bw = 14 * G.s;
        ctx.drawImage(SP.beam, x - bw, topY, bw * 2, y0 - topY + 4);
        glowAt(SP.white, x, topY, 18 * G.s, 0.9 * env);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'pulse') {
        // 太初就有了的那一点光：一圈圈向外的金光
        const G = draftGeo(), u = Math.max(0.7, W.unit);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgb(255,228,168)';
        for (let j = 0; j < 3; j++) {
          const qq = q * 1.4 - j * 0.2;
          if (qq <= 0 || qq >= 1) continue;
          ctx.globalAlpha = 0.55 * (1 - qq) * L('pvStar');
          ctx.lineWidth = (2.4 - 1.6 * qq) * u;
          ctx.beginPath(); ctx.arc(G.star[0], G.star[1], (20 + 150 * qq) * u, 0, TAU); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'call') {
        // 智慧呼喊：自她身上向外的几道声的弧
        const f = fig(e.id);
        if (!f || !f._vis) continue;
        const h = f._h || 40, x = f._x + (f.facing || -1) * h * 0.1, y = f._y - h * 0.8;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgb(255,232,180)';
        ctx.lineWidth = Math.max(0.8, 1.1 * W.unit);
        for (let j = 0; j < 3; j++) {
          const qq = U.fract(q * 2 - j * 0.22);
          if (qq <= 0 || q * 2 - j * 0.22 < 0) continue;
          ctx.globalAlpha = 0.6 * (1 - qq) * (1 - smoothstep(0.8, 1, q));
          const r = h * (0.3 + 1.6 * qq);
          const dir = (f.facing || -1) > 0 ? 0 : Math.PI;
          ctx.beginPath(); ctx.arc(x, y, r, dir - 0.6, dir + 0.6); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  let sparkT = 0;
  // 每画一件都把画笔还原（透明度、叠加方式）
  function RUN(ctx, name, fn) { U.safe(name, fn); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
  const SCENE = {
    init() { sprites(); models(); },
    resize() { RID = null; FGEO = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 人在地面上前后挪步（vTo）
      const c = C(), kv = 1 - Math.exp(-2.2 * f);
      const stepV = m => { if (m.pvTv == null) return; m.v += (m.pvTv - m.v) * kv; if (Math.abs(m.pvTv - m.v) < 1e-3) { m.v = m.pvTv; m.pvTv = null; } };
      if (c.people) for (const p of c.people.values()) stepV(p);
      if (c.crowds) for (const g of c.crowds.values()) g.members.forEach(stepV);
      // 踊跃的光：沿途洒下光点（只是装饰）
      if (!W.replaying && fx() && L('pvStar') > 0.3 && L('pvDance') > 0.01 && L('pvDance') < 0.99) {
        sparkT += f;
        if (sparkT > 0.12) { sparkT = 0; const p = danceAt(L('pvDance')); fx().sparkle(p[0], p[1], 3, [255, 232, 170], 10 * SU(), 'top'); }
      }
      if (!W.replaying && fx() && L('pvPraise') > 0.5 && Math.random() < f * 2.2) {
        const h = headOf('mother', 0.9);
        fx().sparkle(h[0] + (Math.random() - 0.5) * 20 * SU(), h[1], 2, [255, 230, 170], 8 * SU(), 'top');
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { RUN(ctx, 'pv.hidden', () => drawHidden(ctx)); RUN(ctx, 'pv.wind', () => drawWind(ctx)); RUN(ctx, 'pv.eagle', () => drawEagle(ctx)); return; }
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') {
        RUN(ctx, 'pv.wrap', () => drawWrap(ctx, pass));
        if (pass === 'seaMid') RUN(ctx, 'pv.ship', () => drawShip(ctx));
        return;
      }
      if (pass === 'mid') { RUN(ctx, 'pv.townM', () => blitCity(ctx, 1)); RUN(ctx, 'pv.lampsM', () => drawTownLamps(ctx, 1)); return; }
      if (pass === 'near') {
        // 预绘的城、城墙、城门、坚固台、家、橄榄树；其上每帧画灯、火、坚固台的光
        RUN(ctx, 'pv.city', () => blitCity(ctx, 2));
        RUN(ctx, 'pv.lamps', () => { drawTownLamps(ctx, 2); drawTowerLights(ctx); drawGateFire(ctx); drawHomeLamp(ctx); });
        RUN(ctx, 'pv.shelter', () => drawShelter(ctx));
        RUN(ctx, 'pv.bench', () => drawBench(ctx));
        RUN(ctx, 'pv.house7', () => drawHouse7(ctx));
        RUN(ctx, 'pv.path', () => drawPath(ctx));
        RUN(ctx, 'pv.life', () => drawLife(ctx));
        RUN(ctx, 'pv.field', () => drawField(ctx));
        RUN(ctx, 'pv.nest', () => drawNest(ctx));
        RUN(ctx, 'pv.steps', () => drawSteps(ctx));
        RUN(ctx, 'pv.restRing', () => drawRestRing(ctx));
        RUN(ctx, 'pv.stream', () => drawStream(ctx));
        RUN(ctx, 'pv.rock', () => drawRock(ctx));
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        return;
      }
      if (pass === 'air') {
        RUN(ctx, 'pv.storm', () => drawStormDim(ctx));
        RUN(ctx, 'pv.eye', () => drawEye(ctx));
        RUN(ctx, 'pv.houseGlow', () => drawHouseGlow(ctx));
        RUN(ctx, 'pv.lifeGlow', () => drawLifeGlow(ctx));
        RUN(ctx, 'pv.shelterHalo', () => drawShelterHalo(ctx));
        RUN(ctx, 'pv.rest', () => drawRest(ctx));
        RUN(ctx, 'pv.wisdom', () => drawWisdom(ctx));
        RUN(ctx, 'pv.pour', () => drawPour(ctx));
        RUN(ctx, 'pv.souls', () => drawSouls(ctx));
        RUN(ctx, 'pv.praise', () => drawPraise(ctx));
        RUN(ctx, 'pv.bread', () => drawBread(ctx));
        RUN(ctx, 'pv.lens', () => drawLens(ctx));
        RUN(ctx, 'pv.dark', () => drawDark(ctx));
        RUN(ctx, 'pv.draft', () => drawDraft(ctx));
        RUN(ctx, 'pv.fx', () => drawTransients(ctx));
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
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
      const consider = (label, px, py, d0) => { const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0)); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const s = LS(2);
      consider('城门', X.gate * W.w, gY(2, X.gate) - 24 * s, 6 * s);
      consider('家', X.home * W.w, gY(2, X.home) - 12 * s, 6 * s);
      consider('葡萄园', (X.vine0 + X.vine1) / 2 * W.w, baseY(2, (X.vine0 + X.vine1) / 2, 0.05) - 6 * s, 4 * s);
      consider('田', (X.f0 + X.f1) / 2 * W.w, baseY(2, (X.f0 + X.f1) / 2, 0.22) - 8 * s, 10 * s);
      const n = nestXY(); consider('蚂蚁', n[0], n[1] - 3 * s, 3 * s);
      const t = towerDims(); consider('坚固台', t.x, t.y - t.h * 0.6, t.w * 0.6);
      if (L('pvHouse') > 0.9) { const G = h7Geo(); consider('智慧的房屋', G.cx, G.gy - G.tH - G.pH * 0.6, G.Wd * 0.3); }
      if (L('pvSpring') > 0.5) { const p = streamPts()[0]; consider('生命的泉源', p[0], p[1] - 3 * s, 4 * s); }
      if (L('pvTree') > 0.6) { const p = lifeXY(); consider('生命树', p[0], p[1] - lifeH() * 0.6, lifeH() * 0.25); }
      if (L('pvChan') > 0.5) consider('陇沟', (X.f0 + X.f1) / 2 * W.w, baseY(2, (X.f0 + X.f1) / 2, 0.3), 6 * s);
      const rk = rockXY(); consider(L('pvWonder') > 0.5 ? '蛇' : '磐石', rk[0], rk[1] - 9 * s, 8 * s);
      if (L('pvWonder') > 0.5) {
        const e = eagleAt(W.t); consider('鹰', e[0], e[1], 8);
        const sp = shipXY(); consider('船', sp[0], sp[1] - 10, 8);
      }
      return best;
    },
    get debug() { const o = {}; LVNAMES.forEach(k => { o[k] = +(W.lv[k] || 0).toFixed(3); }); return { S: Object.assign({}, S), lv: o, fxl: FXL.length }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：黎明前，城门、城外的一户人家、麦田
  // ════════════════════════════════════════════════════════════
  function setup() {
    const lvs = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.95, herbs: 0.8, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in lvs) if (W.hasLevel(k)) W.set(k, lvs[k], true);
    W.set('bloom', 0.75, true);
    LVNAMES.forEach(k => W.set(k, 0, true));
    W.set('pvEyeX', 0.9, true);
    W.set('pvFire', 1, true);
    W.freeClock = false;
    const gx = W.w * 0.62;
    W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
    W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
    // 树只在西边的海岸长几棵（城、田、智慧的房屋一带留给本卷的布景）
    W.setOrigin('trees', W.w * 0.3, W.ridgeBaseY(2, W.w * 0.3));
    W.goTo(0.235, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    S = fresh();
    FXL.length = 0;
    TOWN.near = TOWN.mid = null;
    RID = null; FGEO = null;
    const c = C();
    c.clear({ fade: false });
    // 城外的一户人家：父亲在教训儿子（1:8），母亲在旁
    add('father', { label: '父亲', sex: 'm', age: 'adult', beard: true, x: X.home + 0.012, facing: 1, pose: 'point', robe: ROBE.father, glow: 0.3 });
    add('mother', { label: '母亲', sex: 'f', age: 'adult', x: X.home + 0.024, facing: 1, pose: 'stand', robe: ROBE.mother, accent: [226, 206, 226], glow: 0.3 });
    add('son', { label: '我儿', sex: 'm', age: 'adult', x: X.home + 0.042, facing: -1, pose: 'stand', robe: ROBE.son, glow: 0.3 });
    // 橄榄树下的懒惰人：抱着手躺卧（6:10）
    add('sluggard', { label: '懒惰人', sex: 'm', age: 'adult', x: X.slug, facing: -1, pose: 'lie', robe: ROBE.slug, glow: 0.05, v: 0.1 });
    // 城门口的众人与两个亵慢人
    crowd('folk', { n: 6, x0: X.plaza0 - 0.004, x1: X.plaza1 - 0.008, label: '众人', from: 'none' }, dress(FOLK, 0.0, 0.1));
    S.folk = 1;
    add('mock1', { label: '亵慢人', sex: 'm', age: 'adult', x: X.plaza0 - 0.016, facing: 1, pose: 'stand', robe: ROBE.mock, glow: 0.02 });
    add('mock2', { label: '亵慢人', sex: 'm', age: 'adult', x: X.plaza0 - 0.028, facing: 1, pose: 'stand', robe: [110, 92, 70], glow: 0.02 });
    avoid([0.4, 0.64], [0.66, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const MOM_AT = 0.745;   // 才德的妇人在城门口站立之处（石凳西头，她丈夫坐处的旁边）
  // 智慧的筵席上众人坐的位置（七根柱子之间，中间留给智慧与使女）
  const FEAST_XS = [-0.046, -0.033, -0.02, 0.022, 0.035, 0.048].map(d => X.h7 + d), FEAST_VS = [0.02, 0.035, 0.015, 0.03, 0.015, 0.035];
  // 暴风雨中奔入坚固台前的众人（在城墙前的草地上，不叠在一处）
  const TOWER_XS = [0.862, 0.874, 0.886, 0.934, 0.946, 0.958], TOWER_VS = [0.1, 0.05, 0.11, 0.04, 0.09, 0.12];
  const PLAZA_XS = [0.736, 0.744, 0.752, 0.76, 0.768, 0.776], PLAZA_VS = [0.02, 0.07, 0.04, 0.09, 0.03, 0.06];
  const FIN_XS = [0.697, 0.709], FIN_VS = [0.03, 0.06];
  const eldersOnBench = (m, i) => { m.sex = 'm'; m.age = 'elder'; m.robe = ELDER[i % ELDER.length]; m.prop = null; m.beardOpt = true; m.accent = null; m.v = 0; m.nx = SEATS[1 + (i % 3)]; m.facing = m.fd = -1; };
  const folkFinale = (m, i) => { m.robe = FOLK[(i + 2) % FOLK.length]; m.v = FIN_VS[i % 2]; m.nx = FIN_XS[i % 2]; m.facing = m.fd = 1; };
  const STAGES = [
    // ── 1–2 智慧在街市上呼喊：我要将我的灵浇灌你们 ──────────────
    {
      kind: 'promise', utter: '我要将我的灵浇灌你们', cmd: 'broadcast 智慧 --at 城门口 --pour 灵', ref: '1:23',
      verse: [
        { text: '智慧在街市上呼喊，在宽阔处发声，<br>在热闹街头喊叫，在城门口，在城中发出言语，说：', ref: '箴言 1:20–22', hold: 7 },
        { text: '「你们当因我的责备回转；<br>我要将我的灵浇灌你们，将我的话指示你们。」', ref: '箴言 1:23', hold: 6.5 },
        { text: '因为，耶和华赐人智慧；知识和聪明都由他口而出。', ref: '箴言 2:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            add('wisdom', { label: '智慧', sex: 'f', age: 'adult', x: WIS, facing: -1, pose: 'stand', robe: ROBE.wisdom, accent: [255, 248, 230], glow: 1, from: inst(b) ? 'none' : 'light' });
            lv('pvWis', 1, b);
            W.goTo(0.3, 16, inst(b));
            ringOn(b, 'wisdom', [255, 236, 190], 0.3);
            sfx(b, 'angel', { soft: true });
            avoid([0.4, 0.62], [0.66, 1]);
          }],
          [1.6, () => { cface('folk', WIS); face('mock1', 1); face('mock2', 1); }],
          [2.6, b => { pose('wisdom', 'raise'); flash(b, { type: 'call', id: 'wisdom', dur: 3.2 }); sfx(b, 'chime'); }],
          [6, b => flash(b, { type: 'call', id: 'wisdom', dur: 3.2 })],
          [8.4, b => { lv('pvPour', 1, b); sfx(b, 'harp'); }],
          // 听的人转向她，仰首承接那光（不向她跪拜）
          [10.2, () => { cpose('folk', 'gaze'); }],
          [11.4, () => { walk('mock1', 0.5, { speed: 0.03 }); walk('mock2', 0.48, { speed: 0.028 }); }],
          [15.4, b => lv('pvPour', 0.2, b)],
          [16.4, () => { face('father', 1); pose('father', 'gaze'); face('son', 1); pose('son', 'gaze'); face('mother', 1); }],
          [19.5, b => { rm('mock1'); rm('mock2'); lv('pvPour', 0, b); pose('wisdom', 'stand'); cpose('folk', 'stand'); }],
        ]);
      },
    },

    // ── 3–4 他必指引你的路：光的路自家门铺到城门，越照越明，直到日午 ─
    {
      kind: 'promise', utter: '他必指引你的路', cmd: 'route 我儿 --from 家 --to 城门 --light dawn..noon', ref: '3:6',
      verse: [
        { text: '你要专心仰赖耶和华，不可倚靠自己的聪明，<br>在你一切所行的事上都要认定他，他必指引你的路。', ref: '箴言 3:5–6', hold: 8 },
        { text: '我已指教你走智慧的道，引导你行正直的路。<br>你行走，脚步必不致狭窄；你奔跑，也不致跌倒。', ref: '箴言 4:11–12', hold: 7.5 },
        { text: '但义人的路好像黎明的光，越照越明，直到日午。', ref: '箴言 4:18', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('pvPath', 1, b); lv('pvPathG', 1, b);
            W.goTo(0.47, 25, inst(b));
            face('father', 1); pose('father', 'point'); face('son', 1); pose('son', 'stand');
            sfx(b, 'harp');
            if (!inst(b) && fx()) { const x = (X.home + 0.014) * W.w; fx().sparkle(x, baseY(2, X.home + 0.014, PATH_V), 24, [255, 236, 190], 16 * SU(), 'top'); }
          }],
          [2.4, () => { face('mother', 1); pose('mother', 'raise'); }],
          [4.2, () => { pose('father', 'stand'); walk('son', X.nest - 0.008, { speed: 0.0105 }); avoid([0.4, 0.62], [0.66, 1]); }],
          [9, () => pose('mother', 'stand')],
          [17, () => { pose('father', 'gaze'); }],
        ]);
      },
    },

    // ── 5–7 人所行的道都在耶和华眼前；察看蚂蚁的动作 ──────────────
    {
      kind: 'act', utter: '人所行的道都在耶和华眼前', cmd: 'watch 蚂蚁 --learn', ref: '5:21',
      verse: [
        { text: '因为，人所行的道都在耶和华眼前；他也修平人一切的路。', ref: '箴言 5:21', hold: 6 },
        { text: '懒惰人哪，你去察看蚂蚁的动作就可得智慧。', ref: '箴言 6:6', hold: 5.5 },
        { text: '蚂蚁没有元帅，没有官长，没有君王，<br>尚且在夏天预备食物，在收割时聚敛粮食。', ref: '箴言 6:7–8', hold: 6.5 },
        { text: '遵守我的命令就得存活；保守我的法则，好像保守眼中的瞳人，<br>系在你指头上，刻在你心版上。', ref: '箴言 7:2–3', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('pvEye', 1, b); lv('pvEyeX', X.nest, b); lv('pvPathG', 0.35, b); W.goTo(0.53, 22, inst(b)); sfx(b, 'chime'); }],
          [3, () => { face('son', 1); pose('son', 'kneel'); }],
          [6.6, b => { lv('pvLens', 1, b); sfx(b, 'stars', { soft: true }); }],
          [19.2, b => { lv('pvLens', 0, b); lv('pvEyeX', X.slug, b); }],
          [20.6, () => { face('son', -1); pose('son', 'stand'); }],
          [24.4, b => { lv('pvEye', 0, b); glow('son', 0.6); sparkleOn(b, 'son', 18); }],
        ]);
      },
    },

    // ── 3:19–20, 8:22–27 太初：耶和华以智慧立地，以聪明定天（签名之景之一）──
    // 地沉入太初的黑暗，只剩一点光（智慧）；工师的金线：大水的泉源、未奠定的山、高天的弧、渊面上的圆圈
    {
      kind: 'act', utter: '耶和华以智慧立地，以聪明定天', cmd: 'found 地 --by 智慧 && mount 天 --by 聪明', ref: '3:19',
      verse: [
        { text: '耶和华以智慧立地，以聪明定天，<br>以知识使深渊裂开，使天空滴下甘露。', ref: '箴言 3:19–20', hold: 5.5 },
        { text: '在耶和华造化的起头，在太初创造万物之先，就有了我。<br>从亘古，从太初，未有世界以前，我已被立。', ref: '箴言 8:22–23', hold: 6 },
        { text: '没有深渊，没有大水的泉源，我已生出。<br>大山未曾奠定，小山未有之先，我已生出。', ref: '箴言 8:24–25', hold: 6 },
        { text: '他立高天，我在那里；他在渊面的周围，划出圆圈。', ref: '箴言 8:27', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 太初的黑暗，但地仍隐约可见（知道自己在哪里）；此后每隔四秒左右，工师的笔就画出一样
            lv('pvDark', 0.72, b); lv('pvDraft', 1, b); lv('pvEye', 0, b); lv('pvPathG', 0, b);
            W.goTo(0.02, 16, inst(b));
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [1.6, b => { sparkleOn(b, 'wisdom', 26); lv('pvStar', 1, b); lv('pvWis', 0, b); rm('wisdom'); sfx(b, 'stars'); }],
          // 以知识使深渊裂开：海上大水的泉源涌起
          [4, b => { lv('pvSprings', 0.6, b); sfx(b, 'splash', { soft: true }); }],
          [8, b => { flash(b, { type: 'pulse', dur: 3.6 }); sfx(b, 'chime', { soft: true }); }],
          // 大山未曾奠定：虚线的山
          [12.5, b => { lv('pvSketch', 1, b); sfx(b, 'harp', { soft: true }); }],
          [16.5, b => lv('pvSprings', 0.9, b)],
          [20.5, b => { lv('pvVault', 1, b); sfx(b, 'harp'); }],
          [23.5, b => { burstAt(b, draftSpots('vault'), 12); lv('pvCircle', 1, b); sfx(b, 'chime'); }],
          [27, b => burstAt(b, draftSpots('circle'), 12)],
        ]);
      },
    },

    // ── 8:28–31 为沧海定出界限，立定大地的根基；日日为他所喜爱，常常在他面前踊跃 ──
    // 笔描到哪里，黑暗就揭开到哪里；根基的柱子立起；天亮，金线在光明的地上留一会儿才隐去；那点光在全地上踊跃，落回人间
    {
      kind: 'bless', utter: '日日为他所喜爱，常常在他面前踊跃', cmd: 'set 沧海.limit && rejoice --daily', ref: '8:30',
      verse: [
        { text: '上使穹苍坚硬，下使渊源稳固，<br>为沧海定出界限，使水不越过他的命令，立定大地的根基。', ref: '箴言 8:28–29', hold: 8 },
        { text: '那时，我在他那里为工师，<br>日日为他所喜爱，常常在他面前踊跃，', ref: '箴言 8:30', hold: 6 },
        { text: '踊跃在他为人预备可住之地，<br>也喜悦住在世人之间。', ref: '箴言 8:31', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('pvDark', 0.72, b); lv('pvDraft', 1, b); lv('pvFirm', 1, b); lv('pvSprings', 1, b); sfx(b, 'harp'); }],
          [1.4, b => { lv('pvBound', 1, b); sfx(b, 'splash', { soft: true }); }],
          [4.1, b => burstAt(b, draftSpots(0), 8)],
          [4.5, b => burstAt(b, draftSpots(1), 8)],
          [4.9, b => { burstAt(b, draftSpots(2), 10); lv('pvFound', 1, b); sfx(b, 'build', { soft: true }); }],
          [8.4, b => { lv('pvDark', 0, b); W.goTo(0.3, 6, inst(b)); }],
          [9.2, b => { lv('pvDance', 1, b); sfx(b, 'angel'); }],
          [15.8, b => lv('pvDraft', 0, b)],
          [18.8, b => {
            lv('pvStar', 0, b);
            add('wisdom', { label: '智慧', sex: 'f', age: 'adult', x: WIS, facing: -1, pose: 'raise', robe: ROBE.wisdom, accent: [255, 248, 230], glow: 1, from: inst(b) ? 'none' : 'light' });
            lv('pvWis', 1, b);
            ringOn(b, 'wisdom', [255, 236, 190], 0.26);
            sfx(b, 'chime');
          }],
          [19.8, () => { cface('folk', WIS); cpose('folk', 'gaze'); face('father', 1); face('son', 1); pose('son', 'gaze'); }],
          [22.4, () => { pose('wisdom', 'stand'); cpose('folk', 'stand'); pose('son', 'stand'); }],
        ]);
      },
    },

    // ── 9 智慧建造房屋，凿成七根柱子（签名之景之二）；众人进来，坐席 ────
    {
      kind: 'call', utter: '你们来，吃我的饼，喝我调和的酒', cmd: 'build 房屋 --pillars 7 && serve 饼 酒', ref: '9:5',
      verse: [
        { text: '智慧建造房屋，凿成七根柱子，<br>宰杀牲畜，调和旨酒，设摆筵席；', ref: '箴言 9:1–2', hold: 7 },
        { text: '「你们来，吃我的饼，喝我调和的酒。<br>你们愚蒙人，要舍弃愚蒙，就得存活，并要走光明的道。」', ref: '箴言 9:5–6', hold: 7.5 },
        { text: '敬畏耶和华是智慧的开端；认识至圣者便是聪明。', ref: '箴言 9:10', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('pvHouse', 1, b); W.goTo(0.37, 12, inst(b));
            sfx(b, 'build');
            if (!inst(b) && fx()) { const G = h7Geo(); fx().ring(G.cx, G.gy - G.tH, [255, 236, 190], M() * 0.3, 2.6, 1.6); }
            avoid([0.4, 0.56], [0.6, 1]);
          }],
          [1, () => walk('wisdom', X.h7 + 0.002, { speed: 0.02 })],
          [8.2, b => { lv('pvFeast', 1, b); sfx(b, 'harp'); }],
          [8.6, () => {
            add('maid1', { label: '使女', sex: 'f', age: 'adult', x: X.h7 - 0.02, facing: -1, pose: 'stand', robe: ROBE.maid, accent: [240, 230, 210], glow: 0.35 });
            add('maid2', { label: '使女', sex: 'f', age: 'adult', x: X.h7 + 0.024, facing: 1, pose: 'stand', robe: [196, 176, 150], accent: [236, 224, 204], glow: 0.35 });
          }],
          [9.6, () => { walk('maid1', X.f1 + 0.014, { speed: 0.02, pose: 'raise' }); walk('maid2', X.plaza1, { speed: 0.02, pose: 'raise' }); }],
          [11.2, b => { pose('wisdom', 'raise'); face('wisdom', -1); flash(b, { type: 'call', id: 'wisdom', dur: 3.2 }); }],
          // 众人与我儿进到柱子之间，沿着筵席坐下
          [12.2, () => {
            cplace('folk', FEAST_XS, { speed: 0.02, pose: 'sit' }, FEAST_VS); cface('folk', X.h7);
            walk('son', X.h7 - 0.059, { speed: 0.02, pose: 'sit' }); face('son', 1);
          }],
          [18.5, () => { pose('wisdom', 'stand'); }],
          // 使女回来，站在席旁：一个捧着酒瓶，一个端着饼
          [19.2, () => {
            hold('maid1', 'jar'); walk('maid1', X.h7 - 0.011, { speed: 0.024 }); face('maid1', -1);
            walk('maid2', X.h7 + 0.014, { speed: 0.024, pose: 'carry' }); face('maid2', 1);
          }],
        ]);
      },
    },

    // ── 10–14 生命的泉源、生命树；智慧之子使父亲欢乐 ─────────────
    {
      kind: 'act', utter: '敬畏耶和华就是生命的泉源', cmd: 'open 生命的泉源 && grow 生命树', ref: '14:27',
      verse: [
        { text: '所罗门的箴言：<br>智慧之子使父亲欢乐；愚昧之子叫母亲担忧。', ref: '箴言 10:1', hold: 6.5 },
        { text: '义人所结的果子就是生命树；有智慧的，必能得人。', ref: '箴言 11:30', hold: 5.5 },
        { text: '敬畏耶和华的，大有倚靠；他的儿女也有避难所。<br>敬畏耶和华就是生命的泉源，可以使人离开死亡的网罗。', ref: '箴言 14:26–27', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('pvSpring', 1, b); W.goTo(0.5, 10, inst(b));
            cpose('folk', 'stand'); pose('son', 'stand');
            sfx(b, 'splash');
            if (!inst(b) && fx()) { const p = streamPts()[0]; fx().ring(p[0], p[1], [210, 236, 255], M() * 0.2, 2.2, 1.4); fx().sparkle(p[0], p[1] - 6, 26, [220, 240, 255], 12 * SU(), 'top'); }
          }],
          [1.2, () => { face('father', 1); embrace('son', 'father', { at: 0.574 }); }],
          [1.6, b => lv('pvStream', 1, b)],
          [7.6, b => { lv('pvTree', 1, b); sfx(b, 'harp', { soft: true }); }],
          [9.2, () => { pose('son', 'stand'); pose('father', 'raise'); }],
          // 众人到泉边，跪下喝水（面向泉源）
          [13.6, () => { cwalk('folk', X.spring + 0.006, X.spring + 0.044, { speed: 0.02, pose: 'kneel' }); cface('folk', X.spring); avoid([0.4, 0.56], [0.6, 1]); }],
          [15.5, b => { lv('pvChan', 1, b); sfx(b, 'splash', { soft: true }); }],
          [17.5, () => { pose('father', 'stand'); face('son', -1); }],
        ]);
      },
    },

    // ── 12, 15–16 人心筹算自己的道路；惟耶和华指引他的脚步 ─────────
    {
      kind: 'act', utter: '惟耶和华指引他的脚步', cmd: 'plan 道路 | route --by 耶和华', ref: '16:9',
      verse: [
        { text: '在公义的道上有生命；其路之中并无死亡。', ref: '箴言 12:28', hold: 5.5 },
        { text: '懒惰人的道像荆棘的篱笆；正直人的路是平坦的大道。', ref: '箴言 15:19', hold: 6 },
        { text: '人心筹算自己的道路；惟耶和华指引他的脚步。', ref: '箴言 16:9', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 午后，云层渐厚、天色转灰（暴风雨将到）：金色的脚印在灰白的天光下格外分明
            W.goTo(0.63, 14, inst(b)); lv('clouds', 0.8, b); lv('storm', 0.4, b); lv('pvPlan', 1, b); lv('pvPathG', 0.25, b);
            cpose('folk', 'stand');
            walk('son', STEP_X0, { speed: 0.012 });
          }],
          [7, b => { lv('pvSteps', 1, b); sfx(b, 'chime'); }],
          [8, b => { lv('pvPlan', 0, b); face('son', 1); pose('son', 'gaze'); }],
          [12.4, () => { walk('son', STEP_X1, { speed: 0.022 }); avoid([0.4, 0.5], [0.52, 1]); }],
          [18, b => { if (!inst(b) && fx()) { const x = STEP_X1 * W.w; fx().sparkle(x, baseY(2, STEP_X1, PATH_V), 20, [255, 230, 160], 16 * SU(), 'top'); } }],
        ]);
      },
    },

    // ── 17–19 暴风雨；耶和华的名是坚固台 ─────────────────────────
    {
      kind: 'act', utter: '耶和华的名是坚固台', cmd: 'shelter --in 坚固台 --until storm.pass', ref: '18:10',
      verse: [
        { text: '朋友乃时常亲爱，弟兄为患难而生。', ref: '箴言 17:17', hold: 5.5 },
        { text: '耶和华的名是坚固台；义人奔入便得安稳。', ref: '箴言 18:10', hold: 6 },
        { text: '敬畏耶和华的，得着生命；他必恒久知足，不遭祸患。', ref: '箴言 19:23', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('storm', 0.85, b); lv('rain', 0.75, b); lv('gale', 0.45, b); lv('clouds', 0.9, b); lv('pvSteps', 0, b);
            sfx(b, 'thunder'); sfx(b, 'rain');
            if (!inst(b) && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.62 });
          }],
          // 众人奔到坚固台前（城墙前的草地上，一个个分开）
          [2, () => {
            cplace('folk', TOWER_XS, { run: true, speed: 0.075, pose: 'kneel' }, TOWER_VS); cface('folk', X.tower);
            walk('son', 0.922, { run: true }); vToId('son', 0.07);
            hands('father', 'mother', true);
            walk('father', 0.898, { run: true }); walk('mother', 0.91, { run: true }); vToId('father', 0.1); vToId('mother', 0.06);
            avoid([0.4, 0.52], [0.6, 1]);
          }],
          [3.2, () => { walk('maid1', X.h7 - 0.012, { speed: 0.03 }); walk('maid2', X.h7 + 0.016, { speed: 0.03 }); }],
          [6.6, b => {
            lv('pvTower', 1, b); lv('pvRise', 1, b); sfx(b, 'angel');
            if (!inst(b) && fx()) { const t = towerDims(); fx().ring(t.x, t.y - t.h * 0.6, [255, 236, 190], M() * 0.34, 2.6, 2); }
          }],
          [9, () => { hands('father', 'mother', false); pose('son', 'kneel'); pose('father', 'kneel'); pose('mother', 'kneel'); }],
          [16.5, b => { lv('storm', 0, b); lv('rain', 0, b); lv('gale', 0, b); lv('clouds', 0.4, b); }],
          [20, () => { cpose('folk', 'stand'); pose('son', 'stand'); pose('father', 'stand'); pose('mother', 'stand'); }],
          [21.5, b => lv('pvTower', 0.35, b)],
        ]);
      },
    },

    // ── 13, 20–22 日落：陇沟的水映着晚霞；窗里的灯；人的灵是耶和华的灯 ───
    {
      kind: 'act', utter: '人的灵是耶和华的灯', cmd: 'light 灯 --in 人的灵', ref: '20:27',
      verse: [
        { text: '王的心在耶和华手中，好像陇沟的水随意流转。', ref: '箴言 21:1', hold: 6 },
        { text: '义人的光明亮；恶人的灯要熄灭。', ref: '箴言 13:9', hold: 5 },
        { text: '人的灵是耶和华的灯，鉴察人的心腹。', ref: '箴言 20:27', hold: 5.5 },
        { text: '教养孩童，使他走当行的道，就是到老他也不偏离。', ref: '箴言 22:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.755, 7, inst(b)); lv('pvTower', 0, b);
            cplace('folk', PLAZA_XS, { speed: 0.025 }, PLAZA_VS);
            walk('father', X.home + 0.012, { speed: 0.032 }); walk('mother', X.home + 0.024, { speed: 0.032 }); walk('son', X.home + 0.046, { speed: 0.03 });
            vToId('father', 0); vToId('mother', 0); vToId('son', 0);
            avoid([0.4, 0.62], [0.66, 1]);
          }],
          [4.4, b => lv('pvChanG', 1, b)],
          [7.6, b => { lv('pvLamps', 1, b); lv('pvFire', 1, b); sfx(b, 'chime'); }],
          [13.2, b => { lv('pvSouls', 1, b); sfx(b, 'stars', { soft: true }); }],
          [14.4, () => { add('child', { label: '孩童', sex: 'm', age: 'child', x: X.home - 0.004, facing: 1, pose: 'stand', robe: ROBE.child, glow: 0.35 }); }],
          [19.6, b => {
            lv('pvPathG', 0.7, b);
            hold('child', 'torch');
            walk('child', 0.506, { speed: 0.012 }); walk('father', 0.494, { speed: 0.012 });
          }],
          [20.6, () => hands('father', 'child', true)],
        ]);
      },
    },

    // ── 23, 25–26 夜：灯一盏盏熄了，隐秘的众星显出来；她的灯终夜不灭 ─
    {
      kind: 'act', utter: '将事隐秘乃神的荣耀', cmd: 'hide 荣耀 --in 众星 && extinguish 争竞', ref: '25:2',
      verse: [
        { text: '火缺了柴就必熄灭；无人传舌，争竞便止息。', ref: '箴言 26:20', hold: 5.5 },
        { text: '将事隐秘乃神的荣耀；将事察清乃君王的荣耀。<br>天之高，地之厚，君王之心也测不透。', ref: '箴言 25:2–3', hold: 7.5 },
        { text: '因为至终必有善报，你的指望也不致断绝。', ref: '箴言 23:18', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.99, 12, inst(b)); lv('pvChanG', 0, b); lv('pvMom', 1, b); lv('pvPathG', 0, b);
            cwalk('folk', 0.86, 0.99, { speed: 0.022 });
            hands('father', 'child', false); hold('child', null);
            walk('father', X.home + 0.012, { speed: 0.02, pose: 'sit' }); walk('child', X.home + 0.03, { speed: 0.02, pose: 'lie' });
            pose('son', 'sit'); pose('mother', 'sit');
          }],
          [1.6, b => { lv('pvLamps', 0, b); lv('pvFire', 0.08, b); }],
          [5, b => lv('pvSouls', 0.2, b)],
          [7, b => { lv('pvHidden', 1, b); sfx(b, 'stars'); }],
          [11, () => crm('folk')],
          [14.5, b => { lv('pvSouls', 0, b); sparkleOn(b, 'mother', 14, [255, 210, 150]); }],
        ]);
      },
    },

    // ── 24, 27–29 黎明：义人虽七次跌倒，仍必兴起；羊群躺卧在安稳里 ──
    {
      kind: 'promise', utter: '惟有倚靠耶和华的，必得安稳', cmd: 'sleep 羊群 --safe', ref: '29:25',
      verse: [
        { text: '因为，义人虽七次跌倒，仍必兴起；恶人却被祸患倾倒。', ref: '箴言 24:16', hold: 6 },
        { text: '不要为明日自夸，因为一日要生何事，你尚且不能知道。', ref: '箴言 27:1', hold: 6 },
        { text: '恶人虽无人追赶也逃跑；义人却胆壮像狮子。', ref: '箴言 28:1', hold: 5.5 },
        { text: '惧怕人的，陷入网罗；惟有倚靠耶和华的，必得安稳。', ref: '箴言 29:25', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.3, 12, inst(b)); lv('pvHidden', 0, b); crm('folk', true); }],
          [2.2, () => { pose('father', 'stand'); pose('son', 'stand'); pose('child', 'stand'); }],
          [5.6, b => { lv('pvMom', 0, b); pose('mother', 'stand'); }],
          [7, b => {
            add('shepherd', { label: '牧人', sex: 'm', age: 'adult', x: X.gate + 0.004, facing: -1, pose: 'stand', robe: ROBE.shep, prop: 'staff', glow: 0.25, v: 0.2 });
            herd('flock', { kind: 'sheep', n: 8, x0: X.gate - 0.01, x1: X.gate + 0.03, label: '羊群' });
            // 羊群在人后面一点的草地上（不比人大）
            cmembers('flock').forEach((m, i) => { m.v = 0.08 + 0.22 * ((i * 0.618) % 1); });
            S.flock = 1;
            sfx(b, 'bleat');
          }],
          [8, () => { cwalk('flock', X.flock0, X.flock1, { speed: 0.018 }); walk('shepherd', X.flock1 + 0.022, { speed: 0.014 }); avoid([0.4, 0.62], [0.64, 1]); }],
          [13, () => { walk('son', 0.6, { speed: 0.02 }); }],
          [19.5, b => { cpose('flock', 'lie'); pose('shepherd', 'sit'); lv('pvRest', 1, b); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 30 亚古珥的言语：谁聚风在掌握中？谁包水在衣服里？ ─────────
    {
      kind: 'ask', utter: '谁聚风在掌握中？谁包水在衣服里？', cmd: 'query 谁 --gather 风 --wrap 水', ref: '30:4',
      verse: [
        { text: '谁升天又降下来？谁聚风在掌握中？<br>谁包水在衣服里？', ref: '箴言 30:4', hold: 6 },
        { text: '谁立定地的四极？他名叫什么？<br>他儿子名叫什么？你知道吗？', ref: '箴言 30:4', hold: 5.5 },
        { text: '我所测不透的奇妙有三样，连我所不知道的共有四样：<br>就是鹰在空中飞的道；蛇在磐石上爬的道；船在海中行的道；……', ref: '箴言 30:18–19', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('gale', 0.95, b); lv('pvWind', 1, b); lv('pvRest', 0, b); lv('clouds', 0.55, b);
            W.goTo(0.38, 12, inst(b));
            flash(b, { type: 'ascend', dur: 4 });
            sfx(b, 'wind');
          }],
          [1.5, () => { cpose('flock', 'stand'); pose('shepherd', 'stand'); pose('son', 'gaze'); }],
          [3.4, b => lv('pvFist', 1, b)],
          [6.8, b => {
            lv('gale', 0, b); lv('pvWind', 0, b); lv('clouds', 0.3, b);
            if (!inst(b)) { W.flash = Math.max(W.flash || 0, 0.25); if (fx()) { const p = fistXY(); fx().sparkle(p[0], p[1], 30, [236, 244, 255], 20 * SU(), 'top'); } }
            sfx(b, 'seal');
          }],
          [7.6, b => { lv('pvWrap', 1, b); sfx(b, 'splash', { soft: true }); }],
          [13, b => { lv('pvWonder', 1, b); lv('pvShip', 1, b); sfx(b, 'wings'); }],
          [15, b => lv('pvWrap', 0, b)],
          [16.5, () => { cpose('flock', 'graze'); pose('son', 'stand'); }],
        ]);
      },
    },

    // ── 31 才德的妇人：她的工作在城门口荣耀她 ────────────────────
    // 羊群出城去了；城门旁的石凳上，她丈夫与长老同坐；儿女起来称她有福；日头西斜，金色的光
    {
      kind: 'bless', utter: '惟敬畏耶和华的妇女必得称赞', cmd: 'praise 才德的妇人 --at 城门口', ref: '31:30',
      verse: [
        { text: '才德的妇人谁能得着呢？她的价值远胜过珍珠。', ref: '箴言 31:10', hold: 5.5 },
        { text: '她的儿女起来称她有福；她的丈夫也称赞她，<br>说：「才德的女子很多，惟独你超过一切！」', ref: '箴言 31:28–29', hold: 7 },
        { text: '艳丽是虚假的，美容是虚浮的；<br>惟敬畏耶和华的妇女必得称赞。', ref: '箴言 31:30', hold: 6 },
        { text: '愿她享受操作所得的；<br>愿她的工作在城门口荣耀她。', ref: '箴言 31:31', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.5, 10, inst(b));
            add('mother', { label: '才德的妇人', glow: 0.55 });
            lv('pvBench', 1, b);
            // 羊群与牧人往东出了画面
            cwalk('flock', 1.06, 1.16, { speed: 0.05 }); walk('shepherd', 1.1, { speed: 0.045 });
            crowd('elders', { n: 3, x0: SEATS[1], x1: SEATS[3], label: '长老', pose: 'seat' }, eldersOnBench);
            crowd('folk', { n: 2, x0: FIN_XS[0], x1: FIN_XS[1], label: '众人' }, folkFinale);
            // 两个使女退到智慧的西边，给城门口的人让出地方
            walk('maid1', X.h7 - 0.027, { speed: 0.02 }); walk('maid2', X.h7 - 0.014, { speed: 0.02 }); face('maid1', 1); face('maid2', 1);
            S.folk = 2;
            avoid([0.4, 0.62], [0.64, 1]);
          }],
          [1.2, () => { walk('father', SEATS[0], { speed: 0.04, pose: 'seat' }); face('father', -1); }],
          [2.4, () => {
            walk('mother', MOM_AT, { speed: 0.035 }); face('mother', -1);
            walk('child', MOM_AT - 0.012, { speed: 0.035 }); walk('son', MOM_AT - 0.024, { speed: 0.03 });
          }],
          [6.4, () => { crm('flock'); rm('shepherd'); }],
          // 儿女起来称她有福（她已走到城门口）
          [10.4, b => { pose('son', 'raise'); pose('child', 'raise'); face('son', 1); face('child', 1); sfx(b, 'crowd', { soft: true }); }],
          [11.5, () => { cface('folk', MOM_AT); cface('elders', MOM_AT); }],
          [14.8, b => {
            lv('pvPraise', 1, b); lv('pvFeast', 1, b); glow('mother', 0.9);
            pose('wisdom', 'raise'); face('wisdom', 1);
            ringOn(b, 'mother', [255, 232, 180], 0.28);
            W.goTo(0.715, 12, inst(b));
            sfx(b, 'harp');
          }],
          // 惟敬畏耶和华的妇女必得称赞：「敬畏耶和华」以她身上的光写在她的上方
          [15.4, b => {
            if (inst(b) || !fx() || !fx().nameStr) return;
            const f = fig('mother'), sz = clamp(M() * 0.04, 20, 34);
            if (!f) return;
            const hh = f._h > 2 ? f._h : 44 * LS(2), h = [f.nx * W.w, baseY(2, f.nx, f.v) - hh];
            const cx = clamp(h[0], sz * 2.8, W.w - sz * 2.8), cy = h[1] - sz * (port() ? 2.6 : 2.2);
            fx().nameStr('敬畏耶和华', cx, cy, sz, [255, 232, 176], () => [h[0] + (Math.random() - 0.5) * 30, h[1] + Math.random() * 30, [255, 226, 160]], { hold: 4 });
          }],
          [16.5, () => { cpose('folk', 'raise'); }],
          [21.8, b => { cpose('folk', 'stand'); pose('son', 'stand'); pose('child', 'stand'); sparkleOn(b, 'mother', 20, [255, 226, 160]); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '箴言', books: [20], title: '智慧', sub: '箴言 1 — 31', tint: [248, 232, 184], music: 'eden',
    outro: 20,                      // 末一幅：城门口，才德的妇人在光里；智慧的房屋在后，日头西斜
    intro: [
      { text: '以色列王大卫儿子所罗门的箴言：<br>要使人晓得智慧和训诲，分辨通达的言语，', ref: '箴言 1:1–2', hold: 6.5 },
      { text: '敬畏耶和华是知识的开端；愚妄人藐视智慧和训诲。', ref: '箴言 1:7', hold: 6 },
    ],
    behold: {
      '智慧': { text: '耶和华以智慧立地，以聪明定天，<br>以知识使深渊裂开，使天空滴下甘露。', ref: '箴言 3:19–20' },
      '我儿': { text: '我儿，你心若存智慧，我的心也甚欢喜。', ref: '箴言 23:15' },
      '父亲': { text: '众子啊，要听父亲的教训，留心得知聪明。', ref: '箴言 4:1' },
      '母亲': { text: '我儿，要听你父亲的训诲，不可离弃你母亲的法则；', ref: '箴言 1:8' },
      '才德的妇人': { text: '能力和威仪是她的衣服；她想到日后的景况就喜笑。<br>她开口就发智慧；她舌上有仁慈的法则。', ref: '箴言 31:25–26' },
      '孩童': { text: '教养孩童，使他走当行的道，就是到老他也不偏离。', ref: '箴言 22:6' },
      '懒惰人': { text: '懒惰人哪，你要睡到几时呢？你何时睡醒呢？<br>再睡片时，打盹片时，抱着手躺卧片时，', ref: '箴言 6:9–10' },
      '亵慢人': { text: '说：你们愚昧人喜爱愚昧，亵慢人喜欢亵慢，愚顽人恨恶知识，要到几时呢？', ref: '箴言 1:22' },
      '众人': { text: '众人哪，我呼叫你们，我向世人发声。', ref: '箴言 8:4' },
      '使女': { text: '打发使女出去，自己在城中至高处呼叫，', ref: '箴言 9:3' },
      '长老': { text: '她丈夫在城门口与本地的长老同坐，为众人所认识。', ref: '箴言 31:23' },
      '牧人': { text: '你要详细知道你羊群的景况，留心料理你的牛群；', ref: '箴言 27:23' },
      '羊群': { text: '干草割去，嫩草发现，山上的菜蔬也被收敛。<br>羊羔之毛是为你作衣服；山羊是为作田地的价值，', ref: '箴言 27:25–26' },
      '蚂蚁': { text: '蚂蚁是无力之类，却在夏天预备粮食。', ref: '箴言 30:25' },
      '智慧的房屋': { text: '智慧建造房屋，凿成七根柱子，', ref: '箴言 9:1' },
      '生命树': { text: '她与持守她的作生命树；持定她的，俱各有福。', ref: '箴言 3:18' },
      '生命的泉源': { text: '智慧人的法则是生命的泉源，可以使人离开死亡的网罗。', ref: '箴言 13:14' },
      '坚固台': { text: '耶和华的名是坚固台；义人奔入便得安稳。', ref: '箴言 18:10' },
      '城门': { text: '在城门旁，在城门口，在城门洞，大声说：<br>众人哪，我呼叫你们，我向世人发声。', ref: '箴言 8:3–4' },
      '家': { text: '房屋因智慧建造，又因聪明立稳；<br>其中因知识充满各样美好宝贵的财物。', ref: '箴言 24:3–4' },
      '葡萄园': { text: '她想得田地就买来；用手所得之利栽种葡萄园。', ref: '箴言 31:16' },
      '田': { text: '耕种自己田地的，必得饱食；追随虚浮的，却是无知。', ref: '箴言 12:11' },
      '陇沟': { text: '王的心在耶和华手中，好像陇沟的水随意流转。', ref: '箴言 21:1' },
      '磐石': { text: '沙番是软弱之类，却在磐石中造房。', ref: '箴言 30:26' },
      '鹰': { text: '就是鹰在空中飞的道；蛇在磐石上爬的道；船在海中行的道；……', ref: '箴言 30:19' },
      '蛇': { text: '就是鹰在空中飞的道；蛇在磐石上爬的道；船在海中行的道；……', ref: '箴言 30:19' },
      '船': { text: '她好像商船从远方运粮来，', ref: '箴言 31:14' },
    },
    setup,
    stages: STAGES,
    scene: SCENE,
  });
})(window.GS);
