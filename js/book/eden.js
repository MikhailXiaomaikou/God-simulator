/* ─────────────────────────────────────────────────────────────
 * book/eden.js —— 卷二「伊甸」：创世记 2:4 — 3:24
 *
 * 园子在近岸大地的正中生长起来：花、灌木、结果子的树；园子当中立着生命树（柔和地放光）
 * 与分别善恶的树（果子悦人眼目）。一道河从伊甸流出，分为四道：比逊、基训、希底结、伯拉。
 * 亚当为活物起名；神使他沉睡，领那女人到他跟前。蛇在树上闪烁；果子被摘下，园中的光暗了。
 * 天起了凉风（黄昏的光）——「你在哪里？」；咒诅；荆棘与蒺藜在园外蔓生；皮子作的衣服；
 * 二人向东走出园子；基路伯与四面转动发火焰的剑，把守生命树的道路（夜里的最后一幅）。
 *
 * 规矩：本卷的一切状态都只在 setup / apply / 情节（beats）里设定——瞬间重演时得到同样的世界。
 *       布景只在本卷进行时绘制（GS.book.current('eden')）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W, fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, smoothstep, TAU } = U;
  const ACT = 'eden';
  const HAS_P2D = typeof Path2D !== 'undefined';
  const LV = W.lv;

  // ── 本卷的程度（与世界的其余程度一样逐帧趋近目标，恢复时一并对齐）──
  W.defineLevel('edenGarden', 'lin', 0.1);     // 园子长成
  W.defineLevel('edenGlow', 'exp', 0.3);       // 园中的光（堕落后暗下去）
  W.defineLevel('edenMist', 'exp', 0.35);      // 有雾气从地上腾（2:6）
  W.defineLevel('edenRiver', 'lin', 0.07);     // 河从伊甸流出，分为四道
  W.defineLevel('edenForbid', 'exp', 0.5);     // 分别善恶树下那一圈静默的光
  W.defineLevel('edenSleep', 'exp', 0.7);      // 沉睡
  W.defineLevel('edenSnake', 'exp', 0.45);     // 蛇在树上
  W.defineLevel('edenSnakeSh', 'exp', 0.5);    // 蛇的闪烁（诱惑）
  W.defineLevel('edenSnakeDown', 'lin', 0.11); // 蛇受咒诅：落地，用肚子行走而去
  W.defineLevel('edenThorns', 'lin', 0.075);   // 荆棘和蒺藜
  W.defineLevel('edenCherub', 'exp', 0.4);     // 基路伯
  W.defineLevel('edenSword', 'exp', 0.55);     // 四面转动发火焰的剑

  // 人的颜色：起初赤身露体并不羞耻（带着光）；眼睛明亮之后；皮子作的衣服
  const SKIN = { m: [182, 146, 118], f: [194, 156, 134] };
  const SHAME = { m: [118, 104, 80], f: [128, 110, 88] };
  const HIDE = { m: [124, 88, 58], f: [138, 98, 66] };

  // 本卷的局部状态（只在 setup / apply / 情节里设定）
  let S = fresh();
  function fresh() { return { taken: false, voiceT0: -99, formT0: -99, fruitT0: -99, named: {} }; }

  // ── 小工具 ──────────────────────────────────────────────────
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const cur = () => GS.book.current(ACT);
  const M = () => Math.min(W.w, W.h);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function gY(px, layer) {
    const l = layer == null ? 2 : layer;
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, px) : W.ridgeY(l, px);
    if (!isFinite(y)) y = W.ridgeY(l, px);
    return y;
  }
  const fY = (px, v) => { const g = gY(px); return g + v * Math.max(0, W.h - g); };
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function walk(id, x, sp, pose) { cast().walk(id, x, { speed: sp || 0.03, pose: pose || 'stand' }); }
  function sfx(name, b, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) U.safe('eden.sfx', () => a.sfx(name, o || {}));
  }
  function chime(ch) { const a = au(); if (a && a.nameChime) U.safe('eden.chime', () => a.nameChime(ch)); }
  function robe(id, c) { const p = cast().get(id); if (p) p.robe = c.slice(); }
  function personXY(id) {
    const p = cast().get(id);
    if (!p) return null;
    const x = p.nx * W.w;
    return [x, gY(x, p.layer)];
  }
  const personH = () => 34 * W.layerScale(2) * (W.w < 600 ? 1.15 : 1);

  // ── 布局（比例；随屏幕缩放）────────────────────────────────
  const P = { w: 0, h: 0, s: 1, gx: 0.7, g0: 0.51, g1: 0.89, tl: 0.655, tk: 0.755, hide: 0.835, cx: 0.5, sep: 0.035,
    HL: 200, HK: 176, exA: 0.4, exE: 0.428, span: [0.3, 1], gap: 0.1 };
  let G = null;                                   // 几何缓存（像素）
  function layout() {
    if (G && P.w === W.w && P.h === W.h) return P;
    P.w = W.w; P.h = W.h;
    const u = Math.max(0.3, W.unit || 1);
    P.s = u < 0.75 ? u * (1 + (0.75 - u) * 0.8) : u;
    P.HL = 214 * P.s; P.HK = 184 * P.s;
    const sp = W.landSpan(2, W.h * 0.02);
    P.span = sp ? [sp[0] / W.w, sp[1] / W.w] : [0.32, 1];
    P.gx = 0.7;
    P.g0 = Math.max(P.span[0] + 0.12, P.gx - 0.19); P.g1 = Math.min(0.99, P.gx + 0.19);
    const g = Math.max(0.1, (0.6 * P.HL) / Math.max(1, W.w));
    P.gap = g;
    P.tl = P.gx - g * 0.45; P.tk = P.gx + g * 0.55;
    P.hide = Math.min(0.935, P.tk + Math.max(0.075, g * 0.68));
    P.cx = P.gx - 0.2;
    P.sep = Math.max(0.034, (30 * P.s) / Math.max(1, W.w));
    P.exA = Math.max(P.span[0] + 0.075, P.cx - 0.095);
    P.exE = P.exA + Math.max(0.026, (12 * P.s) / Math.max(1, W.w));
    build();
    return P;
  }

  // ════════════════════════════════════════════════════════════
  //  模型：以树高为 1 的归一化坐标（y 向上为负），Path2D 缓存
  // ════════════════════════════════════════════════════════════
  function circ(path, x, y, r) { path.moveTo(x + r, y); path.arc(x, y, r, 0, TAU); }
  function strip(path, pts) {
    const Lp = [], Rp = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      const p = pts[i];
      Lp.push([p[0] - ty * p[2], p[1] + tx * p[2]]);
      Rp.push([p[0] + ty * p[2], p[1] - tx * p[2]]);
    }
    path.moveTo(Lp[0][0], Lp[0][1]);
    for (let i = 1; i < Lp.length; i++) path.lineTo(Lp[i][0], Lp[i][1]);
    for (let i = Rp.length - 1; i >= 0; i--) path.lineTo(Rp[i][0], Rp[i][1]);
    path.closePath();
  }
  function quadPts(x0, y0, cx, cy, x1, y1, w0, w1, n) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
      out.push([a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1, lerp(w0, w1, t)]);
    }
    return out;
  }
  // o: { seed, th（主干高）, tw（主干半宽）, lean, limbs:[[角, 长, 起点比例]], tiers:[{cx,cy,rx,ry,n,r}], fruit, fruitSpread }
  function mkTree(o) {
    const R = U.mulberry32(o.seed);
    const m = { trunk: new Path2D(), dark: new Path2D(), mid: new Path2D(), litL: new Path2D(), litR: new Path2D(),
      rimL: new Path2D(), rimR: new Path2D(), fruit: [], limbEnds: [], top: 0, half: 0, cy: 0 };
    const tp = [];
    for (let i = 0; i <= 9; i++) {
      const t = i / 9;
      tp.push([Math.sin(t * 2.4 + o.seed * 0.37) * (o.lean || 0.02) * t, -t * o.th, o.tw * lerp(1 + 0.9 * Math.pow(1 - t, 5), 0.5, t)]);
    }
    strip(m.trunk, tp);
    // 根：向两侧微微铺开
    strip(m.trunk, quadPts(0, -0.012, -o.tw * 1.4, -0.004, -o.tw * 2.6, 0.004, o.tw * 0.5, o.tw * 0.12, 4));
    strip(m.trunk, quadPts(0, -0.012, o.tw * 1.4, -0.004, o.tw * 2.5, 0.004, o.tw * 0.5, o.tw * 0.12, 4));
    for (const L of o.limbs || []) {
      const k = L[2] == null ? 0.82 : L[2];
      const b = tp[Math.round(k * 9)];
      const x1 = b[0] + Math.sin(L[0]) * L[1], y1 = b[1] - Math.cos(L[0]) * L[1];
      const cxp = (b[0] + x1) / 2 + Math.sin(L[0]) * L[1] * 0.08, cyp = (b[1] + y1) / 2 - L[1] * 0.16;
      strip(m.trunk, quadPts(b[0], b[1], cxp, cyp, x1, y1, o.tw * (L[3] || 0.62), o.tw * 0.16, 7));
      m.limbEnds.push([x1, y1]);
    }
    const clumps = [];
    for (const t of o.tiers) {
      for (let i = 0; i < t.n; i++) {
        const a = Math.PI + ((i + 0.5) / t.n) * Math.PI + (R() - 0.5) * 0.22;
        clumps.push({ x: t.cx + Math.cos(a) * t.rx * (0.9 + R() * 0.14), y: t.cy + Math.sin(a) * t.ry * (0.88 + R() * 0.2), r: t.r * (0.8 + R() * 0.45), edge: true });
      }
      const nb = Math.round(t.n * 0.9);
      for (let i = 0; i < nb; i++) {
        const a = R() * TAU, rr = Math.sqrt(R()) * 0.8;
        clumps.push({ x: t.cx + Math.cos(a) * t.rx * rr, y: t.cy + Math.abs(Math.sin(a)) * t.ry * rr * 0.9 + t.ry * 0.15, r: t.r * (0.8 + R() * 0.4), edge: false });
      }
    }
    let minY = 0, maxX = 0;
    for (const c of clumps) {
      circ(m.dark, c.x, c.y + c.r * 0.14, c.r);
      circ(m.mid, c.x, c.y - c.r * 0.07, c.r * 0.84);
      if (c.edge) {
        circ(m.litL, c.x - c.r * 0.24, c.y - c.r * 0.28, c.r * 0.52);
        circ(m.litR, c.x + c.r * 0.24, c.y - c.r * 0.28, c.r * 0.52);
        const rr = c.r * 0.84, yy = c.y - c.r * 0.07;
        m.rimL.moveTo(c.x + Math.cos(-2.75) * rr, yy + Math.sin(-2.75) * rr); m.rimL.arc(c.x, yy, rr, -2.75, -1.45);
        m.rimR.moveTo(c.x + Math.cos(-1.69) * rr, yy + Math.sin(-1.69) * rr); m.rimR.arc(c.x, yy, rr, -1.69, -0.39);
      }
      minY = Math.min(minY, c.y - c.r);
      maxX = Math.max(maxX, Math.abs(c.x) + c.r);
    }
    m.top = minY; m.half = maxX;
    m.cy = o.tiers[0].cy;
    // 果子：挂在叶簇的下缘
    for (let i = 0; i < (o.fruit || 0); i++) {
      const c = clumps[Math.floor(R() * clumps.length)];
      m.fruit.push([c.x + (R() - 0.5) * c.r * (o.fruitSpread || 1.2), c.y + c.r * (0.15 + R() * 0.5), 0.75 + R() * 0.5]);
    }
    m.clumps = clumps;
    return m;
  }

  // 灌木（宽为 1）
  function mkBush(seed) {
    const R = U.mulberry32(seed);
    const m = { dark: new Path2D(), mid: new Path2D(), lit: new Path2D(), flowers: [] };
    const n = 6 + Math.floor(R() * 4);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, x = (t - 0.5) * 0.8, h = Math.sin(t * Math.PI);
      const r = 0.14 + 0.1 * h + R() * 0.05, y = -r * 0.7 - h * 0.12;
      circ(m.dark, x, y + r * 0.1, r);
      circ(m.mid, x, y - r * 0.08, r * 0.82);
      circ(m.lit, x - r * 0.15, y - r * 0.3, r * 0.45);
      for (let k = 0; k < 2; k++) m.flowers.push([x + (R() - 0.5) * r * 1.4, y - r * (0.1 + R() * 0.7), Math.floor(R() * 4)]);
    }
    return m;
  }

  // 荆棘与蒺藜（高为 1）
  function mkThorn(seed) {
    const R = U.mulberry32(seed);
    const p = new Path2D(), heads = [];
    const n = 5 + Math.floor(R() * 4);
    for (let i = 0; i < n; i++) {
      let x = (R() - 0.5) * 0.3, y = 0, a = (R() - 0.5) * 1.5;
      const len = 0.55 + R() * 0.45, segs = 4;
      p.moveTo(x, y);
      for (let k = 0; k < segs; k++) {
        a += (R() - 0.5) * 0.8;
        const l = len / segs, nx = x + Math.sin(a) * l, ny = y - Math.cos(a) * l;
        p.lineTo(nx, ny);
        const sa = a + (R() < 0.5 ? 1 : -1) * (0.9 + R() * 0.6), mx = (x + nx) / 2, my = (y + ny) / 2;
        p.moveTo(mx, my); p.lineTo(mx + Math.sin(sa) * 0.1, my - Math.cos(sa) * 0.1);
        p.moveTo(nx, ny);
        x = nx; y = ny;
      }
      if (R() < 0.5) heads.push([x, y]);
    }
    return { p, heads };
  }

  const MOD = {};
  function buildModels() {
    if (!HAS_P2D || MOD.life) return;
    // 生命树：宽阔、层层的冠，浅色的树干
    MOD.life = mkTree({ seed: 31, th: 0.56, tw: 0.034, lean: 0.03,
      limbs: [[-0.95, 0.24, 0.72], [0.9, 0.26, 0.74], [-0.35, 0.3, 0.9], [0.4, 0.28, 0.92]],
      tiers: [
        { cx: 0, cy: -0.62, rx: 0.42, ry: 0.11, n: 10, r: 0.1 },
        { cx: 0.015, cy: -0.78, rx: 0.31, ry: 0.09, n: 8, r: 0.095 },
        { cx: -0.01, cy: -0.92, rx: 0.17, ry: 0.06, n: 5, r: 0.08 },
      ], fruit: 18, fruitSpread: 1.5 });
    // 分别善恶的树：浑圆、浓密，一枝低低伸向左边（蛇将缠在其上）
    MOD.know = mkTree({ seed: 57, th: 0.5, tw: 0.04, lean: -0.02,
      limbs: [[-1.2, 0.3, 0.9, 0.7], [0.8, 0.22, 0.85], [-0.2, 0.26, 1]],
      tiers: [
        { cx: 0.02, cy: -0.7, rx: 0.33, ry: 0.16, n: 11, r: 0.11 },
        { cx: 0, cy: -0.9, rx: 0.2, ry: 0.07, n: 6, r: 0.095 },
      ], fruit: 17, fruitSpread: 1.3 });
    MOD.know.fruit[0] = [-0.235, -0.54, 1.35];      // 那一个果子：挂在蛇所缠的低枝上
    // 园中其他悦人眼目的树
    MOD.small = [
      mkTree({ seed: 101, th: 0.48, tw: 0.04, lean: 0.03, limbs: [[-0.7, 0.2], [0.6, 0.2]], tiers: [{ cx: 0, cy: -0.68, rx: 0.3, ry: 0.13, n: 8, r: 0.12 }, { cx: 0, cy: -0.86, rx: 0.16, ry: 0.06, n: 4, r: 0.1 }], fruit: 12 }),
      mkTree({ seed: 211, th: 0.55, tw: 0.035, lean: -0.03, limbs: [[-0.5, 0.2], [0.55, 0.22]], tiers: [{ cx: 0, cy: -0.72, rx: 0.26, ry: 0.14, n: 8, r: 0.11 }, { cx: 0.02, cy: -0.9, rx: 0.12, ry: 0.05, n: 3, r: 0.09 }], fruit: 10 }),
      mkTree({ seed: 307, th: 0.42, tw: 0.045, lean: 0.05, limbs: [[-0.9, 0.24], [0.9, 0.22]], tiers: [{ cx: 0, cy: -0.62, rx: 0.36, ry: 0.11, n: 9, r: 0.11 }], fruit: 14 }),
    ];
    MOD.bush = [mkBush(11), mkBush(23), mkBush(47)];
    MOD.thorn = [mkThorn(5), mkThorn(9), mkThorn(13), mkThorn(17)];
  }
  // 园中各树的色板
  const PAL = {
    life: { trunk: [168, 150, 126], dark: [40, 92, 64], mid: [70, 132, 84], lit: [176, 212, 128], rim: [255, 246, 210] },
    know: { trunk: [74, 54, 40], dark: [22, 52, 38], mid: [40, 82, 56], lit: [98, 140, 82], rim: [236, 232, 196] },
    small: [
      { trunk: [70, 54, 40], dark: [42, 86, 48], mid: [66, 116, 58], lit: [132, 170, 88], rim: [250, 240, 200], fr: [[214, 70, 60], [236, 110, 70]] },          // 石榴
      { trunk: [78, 60, 50], dark: [150, 110, 128], mid: [226, 196, 208], lit: [252, 238, 240], rim: [255, 250, 250], fr: [[255, 250, 246], [246, 206, 222]] },  // 杏花
      { trunk: [84, 70, 56], dark: [70, 92, 70], mid: [112, 136, 98], lit: [170, 188, 144], rim: [240, 244, 220], fr: [[70, 44, 60], [100, 110, 60]] },         // 橄榄
    ],
    bush: { dark: [34, 72, 42], mid: [58, 108, 56], lit: [120, 166, 90] },
    fruitK: [[212, 58, 46], [238, 150, 50], [196, 40, 62]],
    flowers: [[250, 246, 236], [240, 128, 160], [246, 208, 92], [168, 142, 232], [226, 84, 70]],
  };

  // ── 发光的精灵图（预先画好，按需着色）───────────────────────
  const SPR = {};
  function glow(key, c) {
    if (SPR[key]) return SPR[key];
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, rgba(c, 1)); gr.addColorStop(0.22, rgba(c, 0.5)); gr.addColorStop(0.55, rgba(c, 0.14)); gr.addColorStop(1, rgba(c, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return (SPR[key] = cv);
  }
  const GLOW = { pearl: [255, 244, 214], warm: [255, 226, 170], green: [214, 255, 190], fire: [255, 168, 80], cool: [196, 216, 255], gold: [255, 214, 130] };
  function drawGlow(ctx, key, x, y, rx, ry, a) {
    if (!(a > 0.004) || !(rx > 0.5) || !(ry > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(glow(key, GLOW[key]), x - rx, y - ry, rx * 2, ry * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  几何（像素）：河、花、灌木、荆棘的位置
  // ════════════════════════════════════════════════════════════
  const RIVERS = [
    { name: '比逊', label: '比逊河', c: [255, 222, 150], end: 0.55, nameAt: 0.66, side: 0 },
    { name: '基训', label: '基训河', c: [196, 226, 255], end: 0.7, nameAt: 0.64, side: -1 },
    { name: '希底结', label: '希底结河', c: [200, 230, 255], end: 0.85, nameAt: 0.64, side: 1 },
    { name: '伯拉', label: '伯拉河', c: [210, 236, 250], end: 1.0, nameAt: 0.6, side: 0 },
  ];
  const TRUNK_END = 0.18;
  function riverCtl() {
    const gx = P.gx, L0 = P.span[0];
    return {
      trunk: [[gx, 0.03], [gx - 0.004, 0.12], [gx + 0.004, 0.22], [gx, 0.3]],
      heads: [
        [[gx, 0.3], [gx - 0.07, 0.42], [gx - 0.17, 0.5], [gx - 0.25, 0.44], [L0 + 0.035, 0.3]],
        [[gx, 0.3], [gx - 0.03, 0.5], [gx - 0.055, 0.75], [gx - 0.1, 1.15]],
        [[gx, 0.3], [gx + 0.035, 0.5], [gx + 0.07, 0.76], [gx + 0.12, 1.15]],
        [[gx, 0.3], [gx + 0.08, 0.38], [gx + 0.18, 0.44], [gx + 0.3, 0.48], [1.08, 0.52]],
      ],
    };
  }
  function crSample(pts, n) {
    const out = [], segs = pts.length - 1;
    for (let i = 0; i <= n; i++) {
      const u = (i / n) * segs, k = Math.min(segs - 1, Math.floor(u)), t = u - k;
      const p0 = pts[Math.max(0, k - 1)], p1 = pts[k], p2 = pts[k + 1], p3 = pts[Math.min(pts.length - 1, k + 2)];
      const t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
    return out;
  }
  function riverPath(ctl, n, k) {
    const s = crSample(ctl, n), out = [];
    for (const q of s) {
      const x = q[0] * W.w, v = Math.max(0, q[1]);
      const g = gY(clamp(x, 0, W.w));
      const y = g + v * Math.max(0, W.h - g);
      out.push({ x, y, v, hw: (1.4 + 9.5 * Math.min(1.2, v)) * P.s * k });
    }
    // 法线（地面上的河：横向宽，纵向被透视压扁）
    for (let i = 0; i < out.length; i++) {
      const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
      let tx = b.x - a.x, ty = b.y - a.y;
      const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      out[i].nx = -ty; out[i].ny = tx * 0.42;
    }
    return out;
  }

  function build() {
    const R = U.mulberry32(4242);
    G = { trunk: null, heads: [], flowers: [[], [], [], [], []], bank: [[], [], [], [], []], bushes: [], small: [], thorns: [], thornsMid: [], motes: [] };
    const ctl = riverCtl();
    G.trunk = riverPath(ctl.trunk, 10, 1.05);
    G.heads = ctl.heads.map(h => riverPath(h, 30, 0.9));
    const nearRiver = (x, y, m) => {
      for (const hd of [G.trunk].concat(G.heads)) for (const q of hd) if (Math.abs(q.x - x) < q.hw + m && Math.abs(q.y - y) < q.hw * 0.5 + m * 0.6) return true;
      return false;
    };
    const q = W.quality >= 0.8 ? 1 : 0.6;
    // 园中的花：自园心向外开放
    const gxp = P.gx * W.w, half = (P.g1 - P.g0) * 0.5 * W.w;
    for (let i = 0; i < 170 * q; i++) {
      const d = Math.pow(R(), 0.8), side = R() < 0.5 ? -1 : 1;
      const x = gxp + side * d * half * 1.05;
      if (x < P.span[0] * W.w + 10 || x > W.w - 2) continue;
      const v = Math.pow(R(), 1.25) * 0.95 + 0.02;
      const y = fY(x, v);
      if (y > W.h + 2) continue;
      const ci = Math.floor(R() * 5);
      G.flowers[ci].push({ x, y, r: (0.9 + 1.5 * v + R() * 0.8) * P.s, th: 0.12 + 0.72 * d, ph: R() * TAU });
    }
    // 河岸的花：河流经之处次第开放
    G.heads.forEach((hd, hi) => {
      const e = RIVERS[hi].end;
      for (let i = 0; i < 16 * q; i++) {
        const k = Math.floor(R() * hd.length), p = hd[k];
        const sd = R() < 0.5 ? -1 : 1, off = p.hw + (2 + R() * 6) * P.s;
        const x = p.x + p.nx * off * sd, y = p.y + p.ny * off * sd;
        if (x < 0 || x > W.w || y > W.h) continue;
        const ci = Math.floor(R() * 5);
        G.bank[ci].push({ x, y, r: (1 + 1.4 * p.v + R() * 0.6) * P.s, th: TRUNK_END + (e - TRUNK_END) * (k / (hd.length - 1)), ph: R() * TAU });
      }
    });
    // 园边的灌木（沿地脊）
    for (let f = P.g0 + 0.01; f < P.g1; f += 0.028 + R() * 0.02) {
      const x = f * W.w, w = (30 + R() * 26) * P.s;
      G.bushes.push({ x, w, h: w * (0.5 + R() * 0.15), m: Math.floor(R() * 3), d: Math.abs(f - P.gx) / 0.19, flip: R() < 0.5 });
    }
    // 园中其他的树：在当中两棵的树冠之外
    const tlx = P.tl * W.w, tkx = P.tk * W.w, hs = 100 * P.s;
    const lE = tlx - P.HL * 0.5, rE = tkx + P.HK * 0.46, xmin = P.span[0] * W.w + 24, xmax = W.w - 10;
    [[lE - hs * 0.22, 0], [lE - hs * 0.95, 2], [rE + hs * 0.3, 1], [rE + hs * 1.05, 0]].forEach((q, i) => {
      const x = q[0];
      if (x < xmin || x > xmax) return;
      G.small.push({ x, H: (92 + (i % 2) * 18) * P.s, m: q[1], d: clamp(Math.abs(x / W.w - P.gx) / 0.19, 0, 1) });
    });
    const lefts = G.small.filter(t => t.x < tlx);
    G.fruitX = (lefts.length ? lefts[0].x : lE) / W.w;
    G.t0 = W.t;
    // 荆棘和蒺藜：园外（近地的田野与中丘）
    const left0 = P.span[0] + 0.02, left1 = P.g0 - 0.015, right0 = P.g1 + 0.015;
    const addThorn = (f, v) => {
      const x = f * W.w, y = fY(x, v);
      if (y > W.h - 2 || nearRiver(x, y, 8 * P.s)) return;
      const edge = f < P.gx ? (left1 - f) / Math.max(0.05, left1 - left0) : (f - right0) / Math.max(0.05, 1 - right0);
      G.thorns.push({ x, v, y, h: (13 + R() * 15) * P.s * (0.8 + 0.6 * v), m: Math.floor(R() * 4), flip: R() < 0.5 ? -1 : 1, th: clamp(edge, 0, 1) * 0.6 + R() * 0.1 });
    };
    for (let f = left0; f < left1; f += 0.028 + R() * 0.03) { addThorn(f, R() * 0.6); if (R() < 0.6) addThorn(f + 0.01, R() * 0.2); }
    for (let f = right0; f < 1.0; f += 0.026 + R() * 0.03) { addThorn(f, R() * 0.6); if (R() < 0.6) addThorn(f + 0.012, R() * 0.2); }
    G.thorns.sort((a, b) => a.v - b.v);
    const mspan = W.landSpan(1, W.h * 0.01);
    if (mspan) {
      for (let x = mspan[0] + 12; x < mspan[1] - 6; x += (26 + R() * 30) * Math.max(0.5, P.s)) {
        const f = x / W.w;
        if (f > P.g0 - 0.02 && f < P.g1 + 0.02) continue;
        G.thornsMid.push({ x, h: (6 + R() * 6) * P.s, m: Math.floor(R() * 4), flip: R() < 0.5 ? -1 : 1, th: R() * 0.7 });
      }
    }
    // 园中缓缓升起的光尘
    for (let i = 0; i < 46 * q; i++) G.motes.push({ f: P.gx + (R() - 0.5) * 0.36, T: 8 + R() * 8, o: R(), sw: R() * TAU, s: 0.8 + R() * 1.2, h: 0.5 + R() * 0.7 });
  }

  // ── 光的方向：0 = 光自左，1 = 光自右 ─────────────────────────
  function lightK(x) {
    const lx = W.dayFactor > 0.3 ? W.core.x : W.moon.x;
    return clamp(0.5 + (lx - x) / (W.w * 0.35), 0, 1);
  }

  // ════════════════════════════════════════════════════════════
  //  绘制
  // ════════════════════════════════════════════════════════════
  function paintTree(ctx, m, pal, x, y, H, g, extra, sway, alpha) {
    if (g <= 0.001 || !m) return;
    const s = U.easeOut(clamp(g, 0, 1)) * H;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    if (sway) ctx.transform(1, 0, sway, 1, 0, 0);
    const a0 = alpha == null ? 1 : alpha;
    ctx.globalAlpha = a0 * Math.min(1, g * 2.5);
    ctx.fillStyle = W.shadeCSS(pal.trunk, 0, null, extra);
    ctx.fill(m.trunk);
    ctx.fillStyle = W.shadeCSS(pal.dark, 0, null, extra);
    ctx.fill(m.dark);
    ctx.fillStyle = W.shadeCSS(pal.mid, 0, null, extra);
    ctx.fill(m.mid);
    const k = lightK(x);
    const lit = W.shadeCSS(pal.lit, 0, null, extra + 0.08);
    ctx.fillStyle = lit;
    if (k < 0.99) { ctx.globalAlpha = a0 * Math.min(1, g * 2.5) * (1 - k); ctx.fill(m.litL); }
    if (k > 0.01) { ctx.globalAlpha = a0 * Math.min(1, g * 2.5) * k; ctx.fill(m.litR); }
    // 迎光的一道边
    const rimA = (0.22 + 0.4 * W.dusk + 0.25 * W.night) * a0 * Math.min(1, g * 2);
    ctx.lineWidth = 1.2 / s;
    ctx.strokeStyle = W.shadeCSS(pal.rim, 0, null, 0.35 + extra);
    if (k < 0.99) { ctx.globalAlpha = rimA * (1 - k); ctx.stroke(m.rimL); }
    if (k > 0.01) { ctx.globalAlpha = rimA * k; ctx.stroke(m.rimR); }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawFlowers(ctx, groups, lvl, lift) {
    for (let ci = 0; ci < 5; ci++) {
      const arr = groups[ci];
      if (!arr.length) continue;
      ctx.beginPath();
      let n = 0;
      for (const f of arr) {
        if (lvl < f.th) continue;
        const r = f.r * smoothstep(f.th, f.th + 0.1, lvl);
        if (r < 0.3) continue;
        ctx.moveTo(f.x + r, f.y - r * lift); ctx.arc(f.x, f.y - r * lift, r, 0, TAU);
        n++;
      }
      if (n) { ctx.fillStyle = W.shadeCSS(PAL.flowers[ci], 0, null, 0.12 + 0.12 * LV.edenGlow); ctx.fill(); }
    }
  }

  function drawRiver(ctx) {
    const r = LV.edenRiver;
    if (r <= 0.001 || !G) return;
    const water = mix(W.shade([128, 176, 218], 0, 0.22), W.haze, 0.3);
    const bank = W.shadeCSS([36, 58, 34], 0, 0.45);
    const glint = rgba(mix([236, 246, 255], W.ambient, 0.25), 0.28 + 0.3 * W.daylight);
    const prog = [clamp(r / TRUNK_END, 0, 1)];
    RIVERS.forEach(rv => prog.push(clamp((r - TRUNK_END) / (rv.end - TRUNK_END), 0, 1)));
    const paths = [G.trunk].concat(G.heads);
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    for (let pi = 0; pi < paths.length; pi++) {
      const pr = prog[pi];
      if (pr <= 0) continue;
      const pts = paths[pi], nMax = (pts.length - 1) * pr;
      const n = Math.floor(nMax), fr = nMax - n;
      const S2 = pts.slice(0, n + 1);
      if (fr > 0.01 && n + 1 < pts.length) {
        const a = pts[n], b = pts[n + 1];
        S2.push({ x: lerp(a.x, b.x, fr), y: lerp(a.y, b.y, fr), hw: lerp(a.hw, b.hw, fr), nx: a.nx, ny: a.ny, v: a.v });
      }
      if (S2.length < 2) continue;
      // 水身
      ctx.beginPath();
      for (let i = 0; i < S2.length; i++) {
        const q = S2[i], tip = pr < 1 && i === S2.length - 1 ? 0.35 : 1;
        const X = q.x + q.nx * q.hw * tip, Y = q.y + q.ny * q.hw * tip;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      for (let i = S2.length - 1; i >= 0; i--) {
        const q = S2[i], tip = pr < 1 && i === S2.length - 1 ? 0.35 : 1;
        ctx.lineTo(q.x - q.nx * q.hw * tip, q.y - q.ny * q.hw * tip);
      }
      ctx.closePath();
      ctx.strokeStyle = bank; ctx.lineWidth = 1.6 * P.s + 0.6;
      ctx.stroke();
      ctx.fillStyle = rgba(water, 0.94);
      ctx.fill();
      // 流动的粼光
      ctx.beginPath();
      for (let i = 0; i < S2.length; i++) {
        const q = S2[i], o = Math.sin(i * 1.7 + pi) * q.hw * 0.35;
        if (i === 0) ctx.moveTo(q.x + q.nx * o, q.y + q.ny * o); else ctx.lineTo(q.x + q.nx * o, q.y + q.ny * o);
      }
      ctx.setLineDash([3 * P.s + 1, 9 * P.s + 3, 1.5 * P.s + 1, 14 * P.s + 3]);
      ctx.lineDashOffset = -W.t * 26 * P.s * (W.fast || 1) - pi * 7;
      ctx.strokeStyle = glint; ctx.lineWidth = 0.9 + 0.6 * P.s;
      ctx.stroke();
      ctx.setLineDash([]);
      // 正在流淌的水头
      if (pr < 1) {
        const q = S2[S2.length - 1];
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(ctx, 'cool', q.x, q.y, 9 * P.s + q.hw, 5 * P.s + q.hw * 0.5, 0.55);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    // 泉源：从园子当中涌出
    const s0 = G.trunk[0];
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(ctx, 'pearl', s0.x, s0.y, 16 * P.s, 7 * P.s, (0.35 + 0.15 * Math.sin(W.t * 2.1)) * Math.min(1, r * 8) * (0.4 + 0.6 * LV.edenGlow));
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawBushes(ctx, gl) {
    const pal = PAL.bush, ex = 0.06 * LV.edenGlow;
    const cD = W.shadeCSS(pal.dark, 0, null, ex), cM = W.shadeCSS(pal.mid, 0, null, ex), cL = W.shadeCSS(pal.lit, 0, null, ex + 0.08);
    for (const b of G.bushes) {
      const g = smoothstep(0.05 + 0.4 * b.d, 0.35 + 0.45 * b.d, gl);
      if (g <= 0.01) continue;
      const m = MOD.bush[b.m], y = gY(b.x) + 2 * P.s;
      ctx.save();
      ctx.translate(b.x, y);
      ctx.scale((b.flip ? -1 : 1) * b.w * g, b.h * 1.6 * g);
      ctx.fillStyle = cD; ctx.fill(m.dark);
      ctx.fillStyle = cM; ctx.fill(m.mid);
      ctx.globalAlpha = 0.85; ctx.fillStyle = cL; ctx.fill(m.lit);
      ctx.restore();
      ctx.globalAlpha = 1;
      if (g > 0.6) {
        for (const f of m.flowers) {
          const fx0 = b.x + f[0] * b.w * (b.flip ? -1 : 1), fy0 = y + f[1] * b.h * 1.6;
          ctx.fillStyle = W.shadeCSS(PAL.flowers[f[2]], 0, null, 0.14 * LV.edenGlow);
          ctx.fillRect(fx0 - 1.1 * P.s, fy0 - 1.1 * P.s, 2.2 * P.s + 0.4, 2.2 * P.s + 0.4);
        }
      }
    }
  }

  function drawSmallTrees(ctx, gl) {
    const ex = 0.06 * LV.edenGlow;
    for (const t of G.small) {
      const g = smoothstep(0.15 + 0.3 * t.d, 0.6 + 0.35 * t.d, gl);
      if (g <= 0.01) continue;
      const m = MOD.small[t.m], pal = PAL.small[t.m], y = gY(t.x) + 1;
      const sway = Math.sin(W.t * 0.7 + t.x * 0.01) * 0.012 + W.wind * 0.01;
      paintTree(ctx, m, pal, t.x, y, t.H, g, ex, sway);
      if (g > 0.7) {
        // 花与果
        const s = t.H * U.easeOut(g);
        const sp = S.fruitT0 > 0 ? smoothstep(0, 1, W.t - S.fruitT0) * smoothstep(7, 3, W.t - S.fruitT0) : 0;
        for (let i = 0; i < m.fruit.length; i++) {
          const f = m.fruit[i];
          const fx0 = t.x + (f[0] + f[1] * sway) * s, fy0 = y + f[1] * s, rr = (0.022 * f[2]) * s;
          const c = pal.fr[i % 2];
          ctx.fillStyle = W.shadeCSS(c, 0, null, 0.1 + 0.1 * LV.edenGlow);
          ctx.beginPath(); ctx.arc(fx0, fy0, Math.max(0.8, rr), 0, TAU); ctx.fill();
          if (sp > 0.01) {
            ctx.globalCompositeOperation = 'lighter';
            drawGlow(ctx, 'gold', fx0, fy0, rr * 5, rr * 5, sp * (0.5 + 0.5 * Math.sin(W.t * 5 + i)));
            ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
          }
        }
      }
    }
  }

  // 两棵树的位置与大小（像素）
  function treeGeo() {
    const tlx = P.tl * W.w, tkx = P.tk * W.w;
    return { tlx, tly: gY(tlx) + 1, tkx, tky: gY(tkx) + 1, gl: smoothstep(0.3, 0.9, LV.edenGarden), gk: smoothstep(0.4, 1.0, LV.edenGarden) };
  }

  function drawMidst(ctx) {
    const T0 = treeGeo(), eg = LV.edenGlow, gA = LV.edenGarden;
    const pulse = 0.86 + 0.14 * Math.sin(W.t * 0.8);
    // 生命树的光：园中光暗下去之后，它仍旧柔和地亮着
    if (T0.gl > 0.01) {
      const lifeGlow = T0.gl * (0.55 + 0.45 * eg) * (0.55 + 0.45 * W.night + 0.2 * W.dusk);
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, 'pearl', T0.tlx, T0.tly - 0.7 * P.HL * T0.gl, P.HL * 0.95, P.HL * 0.72, 0.42 * lifeGlow * pulse);
      drawGlow(ctx, 'pearl', T0.tlx, T0.tly - 1.5 * P.HL, P.HL * 0.22, P.HL * 1.25, 0.1 * lifeGlow * pulse);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    const swL = Math.sin(W.t * 0.5) * 0.008 + W.wind * 0.006, swK = Math.sin(W.t * 0.45 + 1) * 0.006 + W.wind * 0.005;
    paintTree(ctx, MOD.life, PAL.life, T0.tlx, T0.tly, P.HL, T0.gl, 0.06 + 0.1 * eg, swL);
    // 生命树的果子：一粒粒柔光
    if (T0.gl > 0.5) {
      const s = P.HL * U.easeOut(T0.gl);
      ctx.globalCompositeOperation = 'lighter';
      const fa = smoothstep(0.5, 1, T0.gl);
      MOD.life.fruit.forEach((f, i) => {
        const tw = 0.65 + 0.35 * Math.sin(W.t * (1.1 + (i % 5) * 0.23) + i * 1.9);
        const X = T0.tlx + (f[0] + f[1] * swL) * s, Y = T0.tly + f[1] * s;
        drawGlow(ctx, 'pearl', X, Y, 7 * P.s * f[2], 7 * P.s * f[2], 0.8 * fa * tw);
        ctx.globalAlpha = Math.min(1, fa * tw);
        ctx.fillStyle = 'rgb(255,250,232)';
        ctx.fillRect(X - 0.9 * P.s, Y - 0.9 * P.s, 1.8 * P.s + 0.4, 1.8 * P.s + 0.4);
      });
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    paintTree(ctx, MOD.know, PAL.know, T0.tkx, T0.tky, P.HK, T0.gk, 0.03 + 0.04 * eg, swK);
    // 分别善恶树的果子：好作食物，也悦人的眼目
    if (T0.gk > 0.5) {
      const s = P.HK * U.easeOut(T0.gk), fa = smoothstep(0.5, 1, T0.gk);
      MOD.know.fruit.forEach((f, i) => {
        if (i === 0 && S.taken) return;
        const X = T0.tkx + (f[0] + f[1] * swK) * s, Y = T0.tky + f[1] * s, rr = Math.max(1, 0.021 * f[2] * s);
        ctx.globalAlpha = fa;
        ctx.fillStyle = W.shadeCSS(PAL.fruitK[i % 3], 0, null, 0.12 + 0.08 * eg);
        ctx.beginPath(); ctx.arc(X, Y, rr, 0, TAU); ctx.fill();
        ctx.fillStyle = rgba([255, 246, 226], (0.35 + 0.4 * eg) * W.daylight * fa);
        ctx.fillRect(X - rr * 0.55, Y - rr * 0.6, Math.max(0.8, rr * 0.5), Math.max(0.8, rr * 0.5));
      });
      ctx.globalAlpha = 1;
    }
    // 「不可吃」：树下一弯静默的光（只画前半，贴在地上）
    const fb = LV.edenForbid * T0.gk;
    if (fb > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba([255, 240, 214], fb * (0.12 + 0.08 * Math.sin(W.t * 1.3)) * (0.5 + 0.5 * eg) * (0.6 + 0.6 * W.night));
      ctx.lineWidth = 1.2 * P.s + 0.4;
      ctx.beginPath();
      ctx.ellipse(T0.tkx, T0.tky + 3 * P.s, P.HK * 0.36, P.HK * 0.05 + 2, 0, 0.05, Math.PI - 0.05);
      ctx.stroke();
      ctx.restore();
    }
    return T0;
  }

  // 蛇：在分别善恶树的低枝上盘绕、闪烁；受咒诅后落地，用肚子行走而去
  function drawSerpent(ctx) {
    const T0 = treeGeo();
    const d = LV.edenSnakeDown;
    const aTree = LV.edenSnake * (1 - smoothstep(0, 0.14, d)) * smoothstep(0.6, 1, T0.gk);
    const s = P.HK;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (aTree > 0.01) {
      const b0 = [-0.05, -0.475], b1 = [-0.27, -0.585];
      const bx = b1[0] - b0[0], by = b1[1] - b0[1], bl = Math.hypot(bx, by), nx = -by / bl, ny = bx / bl;
      const N = 30, pts = [];
      const sw = Math.sin(W.t * 0.9) * 0.018;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        let x, y;
        if (t < 0.7) {
          const u = t / 0.7, off = Math.sin(u * TAU * 2.4 + W.t * 0.45) * 0.022;
          x = lerp(b0[0], b1[0], u) + nx * off; y = lerp(b0[1], b1[1], u) + ny * off;
        } else {
          const u = (t - 0.7) / 0.3;
          x = b1[0] - 0.05 * u + sw * u * u - 0.012 * Math.sin(u * 3); y = b1[1] + 0.12 * u - 0.02 * u * u;
        }
        const w = 0.02 * (t < 0.12 ? 0.35 + 0.65 * (t / 0.12) : 1) * (t > 0.9 ? 0.85 + (t - 0.9) * 1.2 : 1);
        pts.push([T0.tkx + x * s, T0.tky + y * s, Math.max(1.2, w * s)]);
      }
      ctx.globalAlpha = aTree;
      ctx.strokeStyle = W.shadeCSS([54, 68, 44], 0, null, 0.05);
      for (let i = 0; i < N; i++) {
        ctx.lineWidth = pts[i][2];
        ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
      }
      // 闪烁：一道流动的虹彩沿着身体游走
      const sh = LV.edenSnakeSh;
      if (sh > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        const C = [[120, 230, 170], [250, 214, 120], [176, 150, 250]];
        for (let i = 0; i < N; i++) {
          const ph = i * 0.42 - W.t * 2.4;
          const k = (Math.sin(ph) + 1) / 2, k2 = (Math.sin(ph * 0.7 + 2) + 1) / 2;
          const c = mix(mix(C[0], C[1], k), C[2], k2 * 0.6);
          ctx.strokeStyle = rgba(c, aTree * sh * (0.25 + 0.55 * Math.pow((Math.sin(i * 0.8 - W.t * 3.1) + 1) / 2, 3)));
          ctx.lineWidth = Math.max(0.8, pts[i][2] * 0.5);
          ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1] - pts[i][2] * 0.2); ctx.lineTo(pts[i + 1][0], pts[i + 1][1] - pts[i + 1][2] * 0.2); ctx.stroke();
        }
        const hd = pts[N];
        drawGlow(ctx, 'green', hd[0], hd[1], 10 * P.s, 10 * P.s, 0.22 * aTree * sh * (0.7 + 0.3 * Math.sin(W.t * 4)));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 落地之后：暗哑的一条，贴着地、蜿蜒远去
    const aG = smoothstep(0.08, 0.2, d) * (1 - smoothstep(0.78, 1, d));
    if (aG > 0.01) {
      const e = smoothstep(0.12, 1, d);
      const x0 = T0.tkx - 12 * P.s - e * 0.24 * W.w, len = 0.3 * s, N = 18;
      ctx.globalAlpha = aG;
      ctx.strokeStyle = W.shadeCSS([92, 80, 62], 0);
      ctx.lineWidth = Math.max(1.2, 0.016 * s);
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = i / N, x = x0 + t * len, v = 0.06 + 0.02 * Math.sin(t * 5 + W.t * 4.5);
        const y = fY(x, v) - Math.sin(t * 9 - W.t * 7) * 0.012 * s;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawThorns(ctx, layer) {
    const th = LV.edenThorns;
    if (th <= 0.001) return;
    const arr = layer === 1 ? G.thornsMid : G.thorns;
    const depth = layer === 1 ? W.LAYERS[1].depth : 0;
    const stem = W.shadeCSS([72, 58, 48], depth), head = W.shadeCSS([128, 104, 140], depth, null, 0.05);
    ctx.save();
    ctx.lineCap = 'round';
    for (const t of arr) {
      const g = smoothstep(t.th, t.th + 0.3, th);
      if (g <= 0.01) continue;
      const m = MOD.thorn[t.m];
      const y = layer === 1 ? gY(t.x, 1) + 1 : t.y;
      const h = t.h * U.easeOut(g);
      ctx.save();
      ctx.translate(t.x, y);
      ctx.scale(t.flip * h, h);
      ctx.strokeStyle = stem; ctx.lineWidth = (layer === 1 ? 0.9 : 1.3) / h;
      ctx.stroke(m.p);
      if (g > 0.7 && layer === 2) {
        ctx.fillStyle = head;
        for (const hd of m.heads) { ctx.beginPath(); ctx.arc(hd[0], hd[1], 0.06, 0, TAU); ctx.fill(); }
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // 受咒诅的地：园外的田野暗下去一层
  function drawCursedGround(ctx) {
    const th = LV.edenThorns;
    if (th <= 0.01) return;
    const x0 = P.span[0] * W.w, n = 48;
    const grd = ctx.createLinearGradient(0, 0, W.w, 0);
    const c = W.shade([54, 42, 30], 0);
    const a = 0.2 * th;
    const e0 = clamp(P.g0 - 0.02, 0, 1), e1 = clamp(P.g1 + 0.02, 0, 1);
    grd.addColorStop(0, rgba(c, a));
    grd.addColorStop(clamp(e0 - 0.05, 0, 1), rgba(c, a));
    grd.addColorStop(clamp(e0 + 0.04, 0, 1), rgba(c, 0));
    grd.addColorStop(clamp(e1 - 0.04, 0, 1), rgba(c, 0));
    grd.addColorStop(clamp(e1 + 0.05, 0, 1), rgba(c, a));
    grd.addColorStop(1, rgba(c, a));
    ctx.beginPath();
    ctx.moveTo(x0, W.h + 2);
    for (let i = 0; i <= n; i++) { const x = lerp(x0, W.w + 2, i / n); ctx.lineTo(x, gY(Math.min(x, W.w)) + 1); }
    ctx.lineTo(W.w + 2, W.h + 2);
    ctx.closePath();
    ctx.fillStyle = grd;
    ctx.fill();
  }

  // 基路伯：光所成的高高身形，上两翼高举，下两翼遮身（不画面目）
  function drawCherub(ctx, x, y, Hc, a, dir, t) {
    if (a <= 0.01) return;
    const em = U.easeOut(clamp(a, 0, 1));
    const h = Hc * (0.55 + 0.45 * em);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    drawGlow(ctx, 'warm', x, y - h * 0.45, h * 0.55, h * 0.75, 0.32 * a);
    // 身
    ctx.globalAlpha = 0.5 * a;
    ctx.fillStyle = 'rgb(255,236,196)';
    ctx.beginPath();
    ctx.moveTo(x, y - h * 0.72);
    ctx.quadraticCurveTo(x + h * 0.1, y - h * 0.35, x + h * 0.07, y);
    ctx.lineTo(x - h * 0.07, y);
    ctx.quadraticCurveTo(x - h * 0.1, y - h * 0.35, x, y - h * 0.72);
    ctx.fill();
    ctx.globalAlpha = 0.85 * a;
    ctx.fillStyle = 'rgb(255,250,236)';
    ctx.beginPath(); ctx.arc(x, y - h * 0.79, h * 0.055, 0, TAU); ctx.fill();
    // 翼
    const shx = x, shy = y - h * 0.64, br = Math.sin(t * 0.9 + dir) * 0.04;
    for (let side = -1; side <= 1; side += 2) {
      // 上翼：朝上、向外张开，羽尖向内弯（两位基路伯内侧的翼在剑上相接）
      const inner = side === dir;
      for (let i = 0; i < 8; i++) {
        const k = i / 7;
        const ang = lerp(inner ? 0.12 : 0.18, inner ? 0.75 : 1.05, k) + br;
        const len = h * lerp(0.78, 0.36, k) * (inner ? 0.92 : 1);
        const ex = shx + side * Math.sin(ang) * len, ey = shy - Math.cos(ang) * len;
        const cx = shx + side * Math.sin(ang + 0.35) * len * 0.62, cy = shy - Math.cos(ang + 0.35) * len * 0.62;
        const tipx = ex - side * len * 0.1 * (1 - k);
        ctx.strokeStyle = rgba(k < 0.5 ? [255, 244, 214] : [214, 228, 255], a * (0.3 + 0.25 * Math.sin(t * 2 + i * 0.9 + dir)));
        ctx.lineWidth = Math.max(0.8, h * 0.014);
        ctx.beginPath(); ctx.moveTo(shx, shy); ctx.quadraticCurveTo(cx, cy, tipx, ey); ctx.stroke();
      }
      // 下翼：垂下遮身
      for (let i = 0; i < 5; i++) {
        const k = i / 4, ang = Math.PI - lerp(0.12, 0.42, k), len = h * lerp(0.62, 0.42, k);
        const ex = shx + side * Math.sin(ang) * len, ey = shy - Math.cos(ang) * len;
        ctx.strokeStyle = rgba([240, 232, 214], a * 0.22);
        ctx.lineWidth = Math.max(0.7, h * 0.012);
        ctx.beginPath(); ctx.moveTo(shx + side * h * 0.03, shy + h * 0.04);
        ctx.quadraticCurveTo(shx + side * h * 0.12, shy + len * 0.4, ex, ey); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function swordGeo() {
    const cx = P.cx * W.w, gy = gY(cx), Hc = 86 * P.s;
    return { x: cx, y: gy - Hc * 0.66, L: Hc * 0.5, gy, Hc, ang: W.t * 2.3 + Math.sin(W.t * 0.6) * 0.7 };
  }
  function drawSword(ctx, sg, a) {
    if (a <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const flick = 0.85 + 0.15 * Math.sin(W.t * 17) * Math.sin(W.t * 7.3);
    drawGlow(ctx, 'fire', sg.x, sg.y, sg.L * 1.7, sg.L * 1.7, 0.5 * a * flick);
    const L = sg.L * (0.4 + 0.6 * U.easeOut(a));
    for (let k = 9; k >= 0; k--) {
      const an = sg.ang - k * 0.12, al = a * (1 - k / 10);
      const dx = Math.cos(an), dy = Math.sin(an);
      const c = k < 2 ? [255, 214, 130] : k < 5 ? [255, 150, 60] : [230, 80, 40];
      ctx.strokeStyle = rgba(c, al * (k ? 0.36 : 0.7));
      ctx.lineWidth = Math.max(1, (4.2 - k * 0.3) * P.s);
      ctx.beginPath(); ctx.moveTo(sg.x - dx * L * 0.16, sg.y - dy * L * 0.16); ctx.lineTo(sg.x + dx * L, sg.y + dy * L); ctx.stroke();
    }
    const dx = Math.cos(sg.ang), dy = Math.sin(sg.ang);
    ctx.strokeStyle = rgba([255, 252, 238], a);
    ctx.lineWidth = Math.max(0.9, 1.5 * P.s);
    ctx.beginPath(); ctx.moveTo(sg.x - dx * L * 0.16, sg.y - dy * L * 0.16); ctx.lineTo(sg.x + dx * L, sg.y + dy * L); ctx.stroke();
    // 护手
    ctx.lineWidth = Math.max(1, 2 * P.s);
    ctx.strokeStyle = rgba([255, 230, 170], a * 0.8);
    ctx.beginPath(); ctx.moveTo(sg.x - dy * L * 0.1, sg.y + dx * L * 0.1); ctx.lineTo(sg.x + dy * L * 0.1, sg.y - dx * L * 0.1); ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 自己的小粒子：花瓣、凉风里的叶、火焰的星 ───────────────
  const PT = [];
  const MAXPT = 170;
  function addPt(p) { if (PT.length < MAXPT) PT.push(p); }
  let emitAcc = [0, 0, 0];
  function updatePts(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      p.life += dt;
      if (p.life >= p.max) { PT.splice(i, 1); continue; }
      if (p.k === 2) { p.vy -= 30 * P.s * dt; p.vx *= Math.exp(-2 * dt); }
      else { p.vx += (W.wind * 10 - p.vx * 0.3) * dt; p.vy += (6 - p.vy * 0.5) * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
    if (!G) return;
    const q = W.quality >= 0.8 ? 1 : 0.55;
    // 园中的花瓣
    const gl = LV.edenGarden, eg = LV.edenGlow;
    emitAcc[0] += dt * 1.3 * q * smoothstep(0.6, 1, gl) * eg * eg;
    while (emitAcc[0] >= 1) {
      emitAcc[0] -= 1;
      const f = lerp(P.g0 + 0.02, P.g1 - 0.02, Math.random()), x = f * W.w;
      addPt({ k: 0, x, y: gY(x) - rnd(0.25, 0.85) * P.HL * 0.8, vx: rnd(-6, 6), vy: rnd(3, 9), life: 0, max: rnd(5, 8), s: rnd(0.9, 1.7) * P.s, rot: rnd(0, TAU), vr: rnd(-2, 2),
        c: U.pick([[252, 240, 244], [246, 200, 216], [255, 236, 190]]) });
    }
    // 凉风：主在园中行走（3:8）
    const va = W.t - S.voiceT0;
    if (va >= 0 && va < 12) {
      emitAcc[1] += dt * 16 * q;
      const vx = voiceX(va) * W.w;
      while (emitAcc[1] >= 1) {
        emitAcc[1] -= 1;
        const x = vx + rnd(-0.08, 0.08) * W.w;
        addPt({ k: 1, x, y: gY(x) - rnd(0.05, 0.9) * P.HL * 0.8, vx: rnd(-55, -25) * P.s, vy: rnd(-8, 6), life: 0, max: rnd(2.5, 4.5), s: rnd(1, 1.9) * P.s, rot: rnd(0, TAU), vr: rnd(-5, 5),
          c: U.pick([[96, 140, 76], [132, 164, 90], [200, 176, 110]]) });
      }
    } else emitAcc[1] = 0;
    // 发火焰的剑
    const sa = LV.edenSword;
    if (sa > 0.2) {
      emitAcc[2] += dt * 34 * q * sa;
      const sg = swordGeo();
      while (emitAcc[2] >= 1) {
        emitAcc[2] -= 1;
        const an = sg.ang - Math.random() * 0.5, r = sg.L * rnd(0.25, 1);
        addPt({ k: 2, x: sg.x + Math.cos(an) * r, y: sg.y + Math.sin(an) * r, vx: rnd(-10, 10) * P.s, vy: rnd(-26, -8) * P.s, life: 0, max: rnd(0.35, 0.9), s: rnd(0.8, 1.8) * P.s, rot: 0, vr: 0,
          c: U.pick([[255, 214, 120], [255, 160, 70], [255, 120, 50]]) });
      }
    } else emitAcc[2] = 0;
  }
  function drawPts(ctx) {
    if (!PT.length) return;
    for (const p of PT) {
      const e = p.life / p.max;
      if (p.k === 2) continue;
      const a = Math.min(1, p.life * 2) * (1 - e) * 0.9;
      ctx.fillStyle = W.shadeCSS(p.c, 0, a, 0.15);
      const w = p.s * (1 + 0.6 * Math.abs(Math.cos(p.rot))), h = p.s * 0.7;
      ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const p of PT) {
      if (p.k !== 2) continue;
      const e = p.life / p.max, a = (1 - e) * (1 - e);
      ctx.fillStyle = rgba(p.c, a);
      ctx.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 主在园中行走：一道柔和的光自西（右）向东（左）穿过园子
  const voiceX = age => lerp(Math.min(0.97, P.g1 + 0.06), P.g0 - 0.02, clamp(age / 14, 0, 1));

  function drawMotes(ctx) {
    const A = LV.edenGarden * (0.25 + 0.75 * LV.edenGlow) * (0.55 + 0.45 * W.night + 0.25 * W.dusk);
    if (A < 0.02) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const m of G.motes) {
      const ph = (W.t / m.T + m.o) % 1;
      const x = m.f * W.w + Math.sin(W.t * 0.5 + m.sw) * 10 * P.s;
      const y = gY(m.f * W.w) - ph * P.HL * m.h;
      const a = Math.sin(ph * Math.PI) * A * 0.7;
      ctx.fillStyle = rgba([255, 240, 190], a);
      const s = m.s * P.s;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawMist(ctx) {
    const m = LV.edenMist;
    if (m < 0.01) return;
    const top = W.waterlineY(0), a0 = m * (0.2 + 0.25 * W.daylight);
    for (let i = 0; i < 9; i++) {
      const sp = 0.004 * (0.6 + (i % 3) * 0.35);
      const cx = ((i * 0.29 + W.t * sp) % 1.5 - 0.25) * W.w;
      const rise = ((W.t * 0.006 + i * 0.13) % 1);
      const cy = lerp(top, W.h * 1.02, (i % 5) / 4) - rise * W.h * 0.05;
      const rx = W.w * (0.22 + 0.08 * (i % 3)), ry = W.h * (0.028 + 0.012 * (i % 2));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a0 * Math.sin(rise * Math.PI) * 0.9;
      ctx.drawImage(glow('mist', [248, 250, 252]), cx - rx, cy - ry, rx * 2, ry * 2);
    }
    ctx.globalAlpha = 1;
  }
  GLOW.mist = [248, 250, 252];

  function drawSleep(ctx) {
    const s = LV.edenSleep;
    if (s < 0.01) return;
    ctx.fillStyle = rgba([10, 14, 32], 0.26 * s);
    ctx.fillRect(-10, -10, W.w + 20, W.h + 20);
    const p = personXY('adam');
    if (p) {
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, 'warm', p[0], p[1] - 6 * P.s, 70 * P.s, 40 * P.s, 0.3 * s * (0.85 + 0.15 * Math.sin(W.t * 1.1)));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  function drawTransient(ctx) {
    // 女人成形之处：一柱柔光
    const fa = W.t - S.formT0;
    if (fa >= 0 && fa < 5) {
      const p = personXY('eve');
      if (p) {
        const e = smoothstep(0, 0.8, fa) * smoothstep(5, 2.5, fa);
        ctx.globalCompositeOperation = 'lighter';
        drawGlow(ctx, 'pearl', p[0], p[1] - personH() * 0.6, 26 * P.s, 70 * P.s, 0.5 * e);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 凉风中行走的那一道光
    const va = W.t - S.voiceT0;
    if (va >= 0 && va < 14) {
      const e = smoothstep(0, 2.5, va) * smoothstep(14, 10, va);
      const x = voiceX(va) * W.w;
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(ctx, 'pearl', x, gY(x) - P.HL * 0.45, P.HL * 0.28, P.HL * 0.85, 0.16 * e);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 前景的灌木（二人藏在园里的树木中，3:8）
  function drawFrontBush(ctx) {
    const gl = smoothstep(0.4, 0.9, LV.edenGarden);
    if (gl <= 0.01) return;
    const pal = PAL.bush, ex = 0.04 * LV.edenGlow;
    const x0 = P.hide * W.w, w = 64 * P.s * gl;
    const parts = [[-0.34, 0.9, 0], [0.1, 1.1, 1], [0.46, 0.8, 2]];
    for (const q of parts) {
      const m = MOD.bush[q[2]], x = x0 + q[0] * w, y = fY(x, 0.05) + 1;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(w * q[1] * 0.75, w * q[1] * 0.62);
      ctx.fillStyle = W.shadeCSS(pal.dark, 0, null, ex); ctx.fill(m.dark);
      ctx.fillStyle = W.shadeCSS(pal.mid, 0, null, ex); ctx.fill(m.mid);
      ctx.globalAlpha = 0.8; ctx.fillStyle = W.shadeCSS(pal.lit, 0, null, ex + 0.08); ctx.fill(m.lit);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function drawPass(ctx, pass, over) {
    if (!cur() || !HAS_P2D) return;
    layout();
    buildModels();
    if (!G || !MOD.life) return;
    const gl = LV.edenGarden;
    ctx.save();
    if (!over) {
      if (pass === 'mid') {
        // 园子的光：映在后面的丘陵与天边
        const A = gl * (0.4 + 0.6 * LV.edenGlow);
        if (A > 0.01) {
          const x = P.gx * W.w, y = gY(x) - P.HL * 0.35;
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ctx, 'warm', x, y, W.w * 0.3, W.h * 0.2, A * (0.16 + 0.22 * W.night + 0.1 * W.dusk));
          ctx.globalCompositeOperation = 'source-over';
        }
        drawThorns(ctx, 1);
      } else if (pass === 'near') {
        drawCursedGround(ctx);
        if (gl > 0.01) {
          const x = P.gx * W.w, g = gY(x);
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ctx, 'green', x, g + (W.h - g) * 0.3, (P.g1 - P.g0) * 0.62 * W.w, (W.h - g) * 0.55, gl * (0.1 + 0.12 * LV.edenGlow) * (0.6 + 0.6 * W.night));
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
          drawSmallTrees(ctx, gl);
          drawBushes(ctx, gl);
          drawMidst(ctx);
        }
        drawRiver(ctx);
        drawFlowers(ctx, G.bank, LV.edenRiver, 0.6);
        if (gl > 0.01) drawFlowers(ctx, G.flowers, gl, 0.6);
        drawThorns(ctx, 2);
        const sa = Math.max(LV.edenSword, LV.edenCherub * 0.6);
        if (sa > 0.01) {
          const sg = swordGeo();
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ctx, 'fire', sg.x, sg.gy + 4 * P.s, sg.L * 3, sg.L * 0.55, 0.4 * sa * (0.9 + 0.1 * Math.sin(W.t * 11)));
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    } else {
      if (pass === 'near') {
        drawSerpent(ctx);
        const ca = LV.edenCherub;
        if (ca > 0.01) {
          const sg = swordGeo(), dx = P.sep * W.w;
          drawCherub(ctx, sg.x - dx, gY(sg.x - dx) + 1, sg.Hc, ca, 1, W.t);
          drawCherub(ctx, sg.x + dx, gY(sg.x + dx) + 1, sg.Hc, ca, -1, W.t + 1.3);
        }
        drawSword(ctx, swordGeo(), LV.edenSword);
      } else if (pass === 'air') {
        drawFrontBush(ctx);
        drawMotes(ctx);
        drawPts(ctx);
        drawTransient(ctx);
        drawMist(ctx);
        drawSleep(ctx);
        if (LV.edenSword > 0.01) {
          const sg = swordGeo();
          ctx.globalCompositeOperation = 'lighter';
          drawGlow(ctx, 'fire', sg.x, sg.y, sg.L * 0.9, sg.L * 0.9, 0.35 * LV.edenSword * (0.8 + 0.2 * Math.sin(W.t * 13)));
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function pick(x, y, r) {
    if (!cur() || !G) return null;
    let best = null;
    const test = (label, px, py, d0) => {
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const T0 = treeGeo();
    if (T0.gl > 0.6) test('生命树', T0.tlx, T0.tly - P.HL * 0.7, P.HL * 0.3);
    if (T0.gk > 0.6) test('分别善恶的树', T0.tkx, T0.tky - P.HK * 0.7, P.HK * 0.28);
    if (LV.edenSnake > 0.5 && LV.edenSnakeDown < 0.1) test('蛇', T0.tkx - 0.25 * P.HK, T0.tky - 0.55 * P.HK, 6);
    if (LV.edenRiver > 0.2) {
      G.heads.forEach((hd, i) => {
        if (LV.edenRiver < RIVERS[i].end) return;
        const q = hd[Math.floor(hd.length * 0.55)];
        if (q) test(RIVERS[i].label, q.x, q.y, q.hw + 4);
      });
    }
    if (LV.edenCherub > 0.5) {
      const sg = swordGeo();
      test('基路伯', sg.x - P.sep * W.w, sg.gy - sg.Hc * 0.5, sg.Hc * 0.2);
      test('基路伯', sg.x + P.sep * W.w, sg.gy - sg.Hc * 0.5, sg.Hc * 0.2);
      if (LV.edenSword > 0.5) test('发火焰的剑', sg.x, sg.y, sg.L * 0.6);
    }
    if (LV.edenThorns > 0.5) for (const t of G.thorns) test(t.m % 2 ? '蒺藜' : '荆棘', t.x, t.y - t.h * 0.5, t.h * 0.3);
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  // 河的名字：由河水聚成，驻留，再归回河里
  function nameRiver(i, b) {
    if (inst(b) || !G || !G.heads[i]) return;
    const rv = RIVERS[i], hd = G.heads[i];
    const q = hd[Math.floor((hd.length - 1) * rv.nameAt)];
    if (!q) return;
    const size = Math.max(14, M() * 0.042);
    const n = Array.from(rv.name).length;
    let cx = q.x + rv.side * size * (n * 0.55 + 0.9);
    cx = clamp(cx, size * n * 0.6, W.w - size * n * 0.6);
    const cy = Math.min(q.y - size * 0.9, W.h - size * 0.8);
    const src = () => { const p = hd[Math.floor(Math.random() * hd.length)]; return [p.x + rnd(-1, 1) * p.hw, p.y + rnd(-0.5, 0.5) * p.hw * 0.5, rv.c]; };
    fx().nameStr(rv.name, cx, cy, size, rv.c, src, { hold: 3.4, dot: 1.9 });
    chime(rv.name[0]);
    if (i === 0) fx().sparkle(q.x, q.y, 30, [255, 214, 120], 30 * P.s, 'near');   // 那地的金子是好的
  }

  // 亚当为活物起名：名字以那活物自身的质料聚在它的上方
  const BIRD_CN = ['燕子', '海鸥', '雀鸟', '鹰'];
  function nameCreature(b) {
    if (inst(b)) return;
    const ad = personXY('adam');
    if (!ad) return;
    let target = null;
    const AN = GS.beasts && GS.beasts._ents ? GS.beasts._ents.AN : [];
    const cands = [];
    for (const a of AN) {
      if (!a || !a.M || !isFinite(a.x) || !isFinite(a.y) || a.motes || a.x < 24 || a.x > W.w - 24) continue;
      if (S.named[a.M.cn]) continue;
      cands.push([Math.abs(a.x - ad[0]) + (a.layer === 2 ? 0 : 120) + Math.random() * 40, a]);
    }
    cands.sort((p, q) => p[0] - q[0]);
    const birdTurn = Object.keys(S.named).length === 3 || !cands.length;
    if (birdTurn && GS.air && Array.isArray(GS.air._birds)) {
      const bs = GS.air._birds.filter(bd => bd && bd.a > 0.8 && bd.mode !== 'away' && isFinite(bd.x) && isFinite(bd.y) && bd.x > 30 && bd.x < W.w - 30 && bd.y > 30 && bd.y < W.horizonY && !S.named[BIRD_CN[bd.k]]);
      if (bs.length) {
        const bd = bs[Math.floor(Math.random() * bs.length)], label = BIRD_CN[bd.k] || '雀鸟';
        target = { x: bd.x, y: bd.y - 14 * P.s, label, col: [236, 240, 250], src: () => [bd.x + rnd(-8, 8) * P.s, bd.y + rnd(-5, 5) * P.s, [226, 232, 246]] };
      }
    }
    if (!target && cands.length) {
      const a = cands[0][1];
      const top = a.y - (a.M.top || 20) * (a.S || P.s);
      const base = mix(a.col || [200, 180, 150], [255, 250, 240], 0.35);
      target = { x: a.x, y: top, label: a.M.cn, col: base,
        src: () => [a.x + rnd(-0.5, 0.5) * (a.M.len || 30) * (a.S || 1), a.y - rnd(0.1, 0.9) * (a.M.top || 20) * (a.S || 1), base] };
      // 神把活物带到那人面前：近处的走兽转身朝他走去几步
      U.safe('eden.bring', () => {
        if (a.layer === 2 && a.st !== 'rest' && a.st !== 'sleep' && a.lie < 0.5) {
          const dx = (a.x > ad[0] ? 1 : -1) * rnd(34, 60) * P.s;
          a.tx = clamp(ad[0] + dx, 20, W.w - 20); a.st = 'walk'; a.stT = 0; a.dur = 14;
        }
        a.joy = 2.4; a.joyX = ad[0];
      });
    }
    if (!target) return;
    S.named[target.label] = true;
    const size = Math.max(14, 26 * W.unit);
    const chars = Array.from(target.label), gap = size * 1.08, x0 = clamp(target.x, size * chars.length * 0.6, W.w - size * chars.length * 0.6) - (gap * (chars.length - 1)) / 2;
    const cy = Math.max(size, target.y - size * 0.9);
    chars.forEach((ch, i) => fx().name(ch, x0 + i * gap, cy, size, target.col, target.src, { delay: i * 0.12, hold: 2.6 }));
    chime(chars[0]);
    cast().face('adam', target.x / W.w);
    cast().pose('adam', 'point', { stop: true });
  }

  // 一粒果子从树上到手中（只是光的轨迹）
  function fruitMote(fromX, fromY, id) {
    const p = personXY(id);
    if (!p) return;
    fx().add({ x: fromX, y: fromY, vx: 0, vy: 0, tx: p[0], ty: p[1] - personH() * 0.55, home: true, max: 1.5, size: 2.2 * Math.max(0.7, P.s), c: [240, 120, 64], drag: 0, pass: 'air', arc: 0.25 });
  }
  function knowFruitXY() {
    const T0 = treeGeo(), f = MOD.know ? MOD.know.fruit[0] : [-0.2, -0.5];
    return [T0.tkx + f[0] * P.HK, T0.tky + f[1] * P.HK];
  }

  // ════════════════════════════════════════════════════════════
  //  卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, title: '伊甸', sub: '创世记 2:4 — 3:24', tint: [206, 238, 186],
    outro: 24,
    intro: [
      { text: '创造天地的来历，在耶和华神造天地的日子，乃是这样。', ref: '创世记 2:4', hold: 6.5 },
      { text: '但有雾气从地上腾，滋润遍地。', ref: '创世记 2:6', hold: 5.5 },
      { text: '耶和华神用地上的尘土造人，将生气吹在他鼻孔里，<br>他就成了有灵的活人，名叫亚当。', ref: '创世记 2:7', hold: 8 },
    ],

    setup() {
      // 七日之后的世界（与上一卷怎样结束无关）
      ['deep', 'light', 'gather', 'dayNight', 'vault', 'clouds', 'land', 'grass', 'herbs', 'trees', 'lights', 'moon', 'stars', 'life', 'given']
        .forEach(k => W.set(k, 1, true));
      W.set('good', 0.25, true);
      W.set('sabbath', 1, true);
      const ox = W.w * 0.7, oy = W.ridgeBaseY(2, ox);
      for (const k of ['grass', 'herbs', 'trees']) if (!W.origin[k]) W.setOrigin(k, ox, oy);
      W.freeClock = false;
      W.goTo(0.34, 0, true);                     // 早晨：光从东方（左）来
      const sx = W.w * 0.14, sy = W.h * 0.8;
      W.setPop('fish', 140, sx, sy, true); W.setPop('whale', 3, sx, sy, true);
      W.setPop('bird', 54, W.w * 0.6, W.h * 0.3, true);
      W.setPop('cattle', 9, ox, oy, true); W.setPop('beast', 8, ox, oy, true); W.setPop('creeper', 36, ox, oy, true);
      W.setPop('human', 0, ox, oy, true);         // 自此以后，人都是有名有姓的角色
      // 本卷的程度
      W.set('edenGarden', 0, true); W.set('edenGlow', 1, true); W.set('edenMist', 1, true); W.set('edenRiver', 0, true);
      W.set('edenForbid', 0, true); W.set('edenSleep', 0, true); W.set('edenSnake', 0, true); W.set('edenSnakeSh', 0, true);
      W.set('edenSnakeDown', 0, true); W.set('edenThorns', 0, true); W.set('edenCherub', 0, true); W.set('edenSword', 0, true);
      S = fresh();
      PT.length = 0;
      cast().clear({ fade: false });
      // 亚当：在他被造的地方（园子以西），坐着，带着神吹进的气
      cast().add('adam', { label: '亚当', sex: 'm', age: 'adult', layer: 2, x: 0.9, facing: -1, pose: 'sit', robe: SKIN.m, glow: 0.55, from: 'none' });
    },

    stages: [
      // ── 2:8–9 园子 ───────────────────────────────────────
      {
        kind: 'act', utter: '在东方的伊甸立了一个园子', cmd: 'mkdir 伊甸/园子 --east', ref: '2:8–9',
        verse: [
          { text: '耶和华神在东方的伊甸立了一个园子，<br>把所造的人安置在那里。', ref: '创世记 2:8', hold: 6.5 },
          { text: '耶和华神使各样的树从地里长出来，可以悦人的眼目，<br>其上的果子好作食物。园子当中又有生命树和分别善恶的树。', ref: '创世记 2:9', hold: 9 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              lv('edenGarden', 1, b); lv('edenMist', 0, b);
              if (!inst(b)) {
                const L = layout(), x = L.gx * W.w, y = gY(x);
                fx().ring(x, y - 20 * L.s, [226, 255, 200], M() * 0.55, 3, 2);
                fx().sparkle(x, y - 10 * L.s, 60, [220, 255, 190], 70 * L.s, 'near');
                sfx('harp', b);
              }
            }],
            [3, () => cast().pose('adam', 'stand')],
            [4.2, () => walk('adam', layout().tl - 0.04, 0.028)],
            [9, b => { if (!inst(b)) { const T0 = treeGeo(); fx().ring(T0.tlx, T0.tly - P.HL * 0.6, [255, 244, 214], P.HL * 1.4, 3.2, 1.5); } }],
            [15, () => cast().face('adam', 1)],
          ]);
        },
      },

      // ── 2:10–14 河分为四道 ─────────────────────────────────
      {
        kind: 'act', utter: '有河从伊甸流出来，滋润那园子', cmd: 'spawn 河 --from 伊甸 | tee 比逊 基训 希底结 伯拉', ref: '2:10–14',
        verse: [
          { text: '有河从伊甸流出来，滋润那园子，<br>从那里分为四道：', ref: '创世记 2:10', hold: 6.5 },
          { text: '第一道名叫比逊，就是环绕哈腓拉全地的。在那里有金子，<br>并且那地的金子是好的；在那里又有珍珠和红玛瑙。', ref: '创世记 2:11–12', hold: 8.5 },
          { text: '第二道河名叫基训，就是环绕古实全地的。<br>第三道河名叫希底结，流在亚述的东边。第四道河就是伯拉河。', ref: '创世记 2:13–14', hold: 9 },
        ],
        apply(c) {
          const rate = 0.07;
          T(c, [
            [0, b => {
              lv('edenRiver', 1, b);
              if (!inst(b)) { const L = layout(), x = L.gx * W.w; fx().sparkle(x, fY(x, 0.03), 40, [210, 236, 255], 12 * L.s, 'near'); sfx('splash', b, { size: 0.4 }); }
            }],
            [RIVERS[0].end / rate, b => nameRiver(0, b)],
            [RIVERS[1].end / rate, b => nameRiver(1, b)],
            [RIVERS[2].end / rate, b => nameRiver(2, b)],
            [RIVERS[3].end / rate, b => nameRiver(3, b)],
          ]);
        },
      },

      // ── 2:15–16 随意吃 ──────────────────────────────────────
      {
        kind: 'cmd', utter: '园中各样树上的果子，你可以随意吃', cmd: 'grant 吃 --on 园中各样树', ref: '2:15–16',
        verse: [
          { text: '耶和华神将那人安置在伊甸园，使他修理看守。', ref: '创世记 2:15', hold: 6 },
          { text: '耶和华神吩咐他说：<br>「园中各样树上的果子，你可以随意吃，', ref: '创世记 2:16', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0.3, b => { S.fruitT0 = inst(b) ? -99 : W.t; if (!inst(b)) sfx('harp', b); }],
            [1.2, () => { layout(); walk('adam', clamp(G ? G.fruitX + 0.006 : P.tl - 0.07, P.span[0] + 0.06, 0.95), 0.03); }],
            [5, () => cast().pose('adam', 'raise')],
            [8, () => cast().pose('adam', 'stand')],
            [9.5, () => walk('adam', layout().tl - 0.03, 0.025, 'kneel')],
          ]);
        },
      },

      // ── 2:17 不可吃 ─────────────────────────────────────────
      {
        kind: 'cmd', utter: '只是分别善恶树上的果子，你不可吃', cmd: 'deny 吃 --on 分别善恶树', ref: '2:17',
        verse: [
          { text: '只是分别善恶树上的果子，你不可吃，<br>因为你吃的日子必定死。」', ref: '创世记 2:17', hold: 8 },
        ],
        apply(c) {
          T(c, [
            [0.2, b => {
              lv('edenForbid', 1, b);
              if (!inst(b)) { const T0 = treeGeo(); fx().ring(T0.tkx, T0.tky - P.HK * 0.5, [255, 236, 206], P.HK * 1.1, 3.4, 1.2); }
            }],
            [1, () => { cast().pose('adam', 'stand', { stop: true }); cast().face('adam', layout().tk); }],
            [2.4, () => walk('adam', layout().tk - 0.05, 0.02, 'bow')],
            [9, () => walk('adam', layout().tl - 0.02, 0.022)],
          ]);
        },
      },

      // ── 2:18–20 独居不好；亚当为活物起名 ───────────────────
      {
        kind: 'cmd', utter: '那人独居不好，我要为他造一个配偶帮助他', cmd: 'TODO 配偶帮助他  # 独居不好', ref: '2:18–20',
        verse: [
          { text: '耶和华神说：「那人独居不好，<br>我要为他造一个配偶帮助他。」', ref: '创世记 2:18', hold: 6.5 },
          { text: '耶和华神用土所造成的野地各样走兽和空中各样飞鸟都带到那人面前，<br>看他叫什么。那人怎样叫各样的活物，那就是它的名字。', ref: '创世记 2:19', hold: 9 },
          { text: '那人便给一切牲畜和空中飞鸟、野地走兽都起了名；<br>只是那人没有遇见配偶帮助他。', ref: '创世记 2:20', hold: 7.5 },
        ],
        apply(c) {
          const beats = [
            [0.4, b => { S.named = {}; walk('adam', layout().gx - 0.08, 0.026); if (!inst(b)) sfx('harp', b); }],
          ];
          for (let i = 0; i < 8; i++) {
            beats.push([4 + i * 1.9, b => nameCreature(b)]);
            beats.push([5.1 + i * 1.9, () => cast().pose('adam', 'stand', { stop: true })]);
          }
          beats.push([21, () => { cast().pose('adam', 'sit', { stop: true }); cast().face('adam', 1); }]);
          T(c, beats);
        },
      },

      // ── 2:21–25 沉睡；领她到那人跟前 ───────────────────────
      {
        kind: 'act', utter: '领她到那人跟前', cmd: 'take 肋骨 && build 女人  # 骨中的骨', ref: '2:21–25', hold: 2.4,
        verse: [
          { text: '耶和华神使他沉睡，他就睡了；<br>于是取下他的一条肋骨，又把肉合起来。', ref: '创世记 2:21', hold: 6.5 },
          { text: '耶和华神就用那人身上所取的肋骨造成一个女人，<br>领她到那人跟前。', ref: '创世记 2:22', hold: 6.5 },
          { text: '那人说：「这是我骨中的骨，肉中的肉，<br>可以称她为女人，因为她是从男人身上取出来的。」', ref: '创世记 2:23', hold: 8 },
          { text: '因此，人要离开父母与妻子连合，二人成为一体。<br>当时夫妻二人赤身露体，并不羞耻。', ref: '创世记 2:24–25', hold: 8 },
        ],
        apply(c) {
          const A = () => layout().gx - 0.08;
          T(c, [
            [0, b => { cast().place('adam', A()); cast().pose('adam', 'lie', { stop: true }); cast().face('adam', 1); lv('edenSleep', 1, b); if (!inst(b)) sfx('harp', b); }],
            [3.6, b => {
              if (inst(b)) return;
              const p = personXY('adam'), ex = (layout().tl + 0.055) * W.w, ey = gY(ex);
              if (!p) return;
              const tg = [];
              for (let i = 0; i < 26; i++) tg.push([ex + rnd(-4, 4) * P.s, ey - rnd(0, 1) * personH(), rnd(1, 2)]);
              fx().sow(p[0] + 4 * P.s, p[1] - 3 * P.s, tg, [255, 238, 214], { stagger: 0.9, dur: 1.8, pass: 'air' });
            }],
            [5.6, b => {
              cast().add('eve', { label: '女人', sex: 'f', age: 'adult', layer: 2, x: layout().tl + 0.055, facing: -1, pose: 'stand', robe: SKIN.f, glow: 0.6, from: 'light' });
              if (!inst(b)) S.formT0 = W.t;
            }],
            [8.6, b => { lv('edenSleep', 0, b); cast().pose('adam', 'sit'); }],
            [10, () => { cast().pose('adam', 'stand'); cast().face('adam', 1); }],
            [10.6, () => walk('eve', A() + 0.03, 0.018)],
            [14.6, b => {
              cast().face('eve', -1); cast().face('adam', 1);
              if (!inst(b)) { const p = personXY('adam'); if (p) fx().ring(p[0] + 0.015 * W.w, p[1] - personH() * 0.5, [255, 226, 190], M() * 0.3, 2.6, 1.5); }
            }],
          ]);
        },
      },

      // ── 3:1–7 蛇；果子；眼睛明亮了 ───────────────────────────
      {
        kind: 'cmd', utter: '你吃的日子必定死', cmd: 'assert 吃 → 死  # 蛇：不一定', ref: '3:1–7',
        verse: [
          { text: '耶和华神所造的，惟有蛇比田野一切的活物更狡猾。<br>蛇对女人说：「神岂是真说不许你们吃园中所有树上的果子吗？」', ref: '创世记 3:1', hold: 8.5 },
          { text: '女人对蛇说：「园中树上的果子，我们可以吃；<br>惟有园当中那棵树上的果子，神曾说：『你们不可吃，也不可摸，免得你们死。』」', ref: '创世记 3:2–3', hold: 8.5 },
          { text: '蛇对女人说：「你们不一定死；<br>因为神知道，你们吃的日子眼睛就明亮了，你们便如神能知道善恶。」', ref: '创世记 3:4–5', hold: 8 },
          { text: '于是女人见那棵树的果子好作食物，也悦人的眼目，且是可喜爱的，能使人有智慧，<br>就摘下果子来吃了；又给她丈夫，她丈夫也吃了。', ref: '创世记 3:6', hold: 9 },
          { text: '他们二人的眼睛就明亮了，才知道自己是赤身露体，<br>便拿无花果树的叶子为自己编做裙子。', ref: '创世记 3:7', hold: 7.5 },
        ],
        apply(c) {
          T(c, [
            [0.5, b => { lv('edenSnake', 1, b); lv('edenSnakeSh', 0.45, b); }],
            [1.5, () => walk('eve', layout().tk - 0.032, 0.02)],
            [2.6, () => walk('adam', layout().tk - 0.075, 0.018)],
            [11, () => cast().face('eve', layout().tk)],
            [20, b => lv('edenSnakeSh', 1, b)],
            [29, () => cast().pose('eve', 'raise')],
            [30.6, b => {
              S.taken = true;
              if (!inst(b)) { const f = knowFruitXY(); fruitMote(f[0], f[1], 'eve'); sfx('seal', b, { soft: true }); }
            }],
            [31.6, b => {
              lv('edenGlow', 0.3, b); W.set('good', 0, inst(b)); W.set('sabbath', 0.2, inst(b));
              cast().pose('eve', 'carry'); cast().face('eve', -1);
            }],
            [33.2, b => {
              cast().face('adam', 1); cast().pose('adam', 'carry');
              if (!inst(b)) { const p = personXY('eve'); if (p) fruitMote(p[0], p[1] - personH() * 0.55, 'adam'); }
            }],
            [39.6, b => {
              cast().pose('adam', 'bow'); cast().pose('eve', 'bow');
              robe('adam', SHAME.m); robe('eve', SHAME.f); cast().glow('adam', 0.1); cast().glow('eve', 0.1);
              lv('edenSnakeSh', 0.25, b);
            }],
          ]);
        },
      },

      // ── 3:8 天起了凉风 ──────────────────────────────────────
      {
        kind: 'act', utter: '天起了凉风，耶和华神在园中行走', cmd: 'walk 园中 --when 天起凉风', ref: '3:8',
        verse: [
          { text: '天起了凉风，耶和华神在园中行走。那人和他妻子听见神的声音，<br>就藏在园里的树木中，躲避耶和华神的面。', ref: '创世记 3:8', hold: 9.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => { W.goTo(0.715, 10, inst(b)); if (!inst(b)) { S.voiceT0 = W.t; sfx('wind', b); } }],
            [3, () => { const L = layout(); walk('adam', L.hide - 0.008, 0.04, 'kneel'); walk('eve', L.hide + 0.012, 0.04, 'kneel'); }],
          ]);
        },
      },

      // ── 3:9–13 你在哪里？ ───────────────────────────────────
      {
        kind: 'ask', utter: '你在哪里？', cmd: 'find 园中 -name 亚当', ref: '3:9–13', hold: 2.8,
        verse: [
          { text: '耶和华神呼唤那人，对他说：「你在哪里？」', ref: '创世记 3:9', hold: 5.5 },
          { text: '他说：「我在园中听见你的声音，我就害怕；<br>因为我赤身露体，我便藏了。」', ref: '创世记 3:10', hold: 7 },
          { text: '耶和华说：「谁告诉你赤身露体呢？<br>莫非你吃了我吩咐你不可吃的那树上的果子吗？」', ref: '创世记 3:11', hold: 7.5 },
          { text: '那人说：「你所赐给我、与我同居的女人，<br>她把那树上的果子给我，我就吃了。」', ref: '创世记 3:12', hold: 7 },
          { text: '耶和华神对女人说：「你作的是什么事呢？」<br>女人说：「那蛇引诱我，我就吃了。」', ref: '创世记 3:13', hold: 7.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => { if (!inst(b)) { fx().ring(W.spirit.x, W.spirit.y, [255, 246, 226], M() * 0.9, 3.4, 1.4); sfx('wind', b, { soft: true }); } }],
            [3, () => walk('adam', layout().hide - 0.062, 0.018, 'bow')],
            [4.2, () => walk('eve', layout().hide - 0.036, 0.016, 'bow')],
            [23.8, () => { cast().face('adam', 'eve'); cast().pose('adam', 'point', { stop: true }); }],
            [28.5, () => cast().pose('adam', 'bow', { stop: true })],
            [32.5, () => { cast().face('eve', layout().tk); cast().pose('eve', 'point', { stop: true }); }],
            [37, () => cast().pose('eve', 'bow', { stop: true })],
          ]);
        },
      },

      // ── 3:14–19 咒诅；荆棘和蒺藜；归于尘土 ─────────────────
      {
        kind: 'judge', utter: '你本是尘土，仍要归于尘土', cmd: 'return 尘土', ref: '3:14–19',
        verse: [
          { text: '耶和华神对蛇说：「你既做了这事，就必受咒诅，<br>比一切的牲畜野兽更甚；你必用肚子行走，终身吃土。', ref: '创世记 3:14', hold: 8 },
          { text: '我又要叫你和女人彼此为仇；你的后裔和女人的后裔也彼此为仇。<br>女人的后裔要伤你的头；你要伤他的脚跟。」', ref: '创世记 3:15', hold: 9 },
          { text: '又对女人说：「我必多多加增你怀胎的苦楚，你生产儿女必多受苦楚。<br>你必恋慕你丈夫；你丈夫必管辖你。」', ref: '创世记 3:16', hold: 8.5 },
          { text: '又对亚当说：「你既听从妻子的话，吃了我所吩咐你不可吃的那树上的果子，<br>地必为你的缘故受咒诅；你必终身劳苦才能从地里得吃的。', ref: '创世记 3:17', hold: 9 },
          { text: '地必给你长出荆棘和蒺藜来；你也要吃田间的菜蔬。', ref: '创世记 3:18', hold: 6.5 },
          { text: '你必汗流满面才得糊口，直到你归了土；因为你是从土而出的。<br>你本是尘土，仍要归于尘土。」', ref: '创世记 3:19', hold: 9 },
        ],
        apply(c) {
          T(c, [
            [0.5, b => { lv('edenSnakeDown', 1, b); lv('edenSnakeSh', 0, b); if (!inst(b)) { W.flash = Math.max(W.flash, 0.22); sfx('thunder', b, { soft: true }); } }],
            [1.8, b => { if (!inst(b)) { const T0 = treeGeo(); fx().dust(T0.tkx - 10 * P.s, fY(T0.tkx - 10 * P.s, 0.06), 18, [170, 140, 100], 10 * P.s); } }],
            [10.5, b => {
              if (inst(b)) return;
              const p = personXY('eve');
              if (p) { fx().sparkle(p[0], p[1] - personH() * 0.5, 24, [255, 232, 180], 6 * P.s, 'air'); fx().ring(p[0], p[1] - personH() * 0.5, [255, 226, 170], M() * 0.12, 2.2, 1); }
            }],
            [20.5, b => { cast().pose('eve', 'kneel', { stop: true }); W.goTo(0.765, 16, inst(b)); }],
            [30, b => { lv('edenThorns', 1, b); cast().pose('adam', 'kneel', { stop: true }); lv('edenGlow', 0.2, b); }],
            [48, b => { if (!inst(b)) { const p = personXY('adam'); if (p) fx().dust(p[0], p[1], 46, [196, 166, 124], 16 * P.s); } }],
          ]);
        },
      },

      // ── 3:20–21 夏娃；皮子作的衣服 ─────────────────────────
      {
        kind: 'act', utter: '用皮子作衣服给他们穿', cmd: 'clothe 亚当 夏娃 --with 皮子', ref: '3:20–21',
        verse: [
          { text: '亚当给他妻子起名叫夏娃，因为她是众生之母。', ref: '创世记 3:20', hold: 7 },
          { text: '耶和华神为亚当和他妻子用皮子作衣服给他们穿。', ref: '创世记 3:21', hold: 7.5 },
        ],
        apply(c) {
          T(c, [
            [0.6, b => {
              cast().add('eve', { label: '夏娃' });
              if (!inst(b)) {
                const p = personXY('eve');
                if (p) {
                  const size = Math.max(16, M() * 0.05), h = personH();
                  fx().nameStr('夏娃', clamp(p[0], size * 1.4, W.w - size * 1.4), p[1] - h * 1.4 - size * 0.6, size, [255, 228, 196],
                    () => [p[0] + rnd(-1, 1) * h * 0.3, p[1] - rnd(0, 1) * h, [255, 222, 190]], { hold: 3.4 });
                  chime('夏');
                }
              }
            }],
            [7.6, b => {
              if (inst(b)) return;
              const a = personXY('adam'), e = personXY('eve');
              if (!a || !e) return;
              const tg = [];
              for (let i = 0; i < 44; i++) { const p = i % 2 ? a : e; tg.push([p[0] + rnd(-5, 5) * P.s, p[1] - rnd(0.1, 0.9) * personH(), rnd(1, 2)]); }
              fx().sow((a[0] + e[0]) / 2, W.h * 0.12, tg, [255, 232, 196], { stagger: 1.4, dur: 2.2, pass: 'air' });
              sfx('harp', b);
            }],
            [9.6, () => {
              robe('adam', HIDE.m); robe('eve', HIDE.f); cast().glow('adam', 0.3); cast().glow('eve', 0.3);
              cast().pose('adam', 'stand', { stop: true }); cast().pose('eve', 'stand', { stop: true });
              cast().face('adam', 'eve'); cast().face('eve', 'adam');
            }],
          ]);
        },
      },

      // ── 3:22–23 打发他出伊甸园去 ───────────────────────────
      {
        kind: 'act', utter: '打发他出伊甸园去，耕种他所自出之土', cmd: 'exit 伊甸 --east', ref: '3:22–23',
        verse: [
          { text: '耶和华神说：「那人已经与我们相似，能知道善恶；<br>现在恐怕他伸手又摘生命树的果子吃，就永远活着。」', ref: '创世记 3:22', hold: 9 },
          { text: '耶和华神便打发他出伊甸园去，耕种他所自出之土。', ref: '创世记 3:23', hold: 8 },
        ],
        apply(c) {
          T(c, [
            [0, b => { W.goTo(0.79, 14, inst(b)); if (!inst(b)) sfx('weep', b, { soft: true }); }],
            [2, () => walk('adam', layout().exA, 0.018)],
            [3.3, () => walk('eve', layout().exE, 0.018)],
            [26, () => { cast().face('adam', 1); cast().face('eve', 1); }],
          ]);
        },
      },

      // ── 3:24 基路伯与发火焰的剑 ─────────────────────────────
      {
        kind: 'act', utter: '安设基路伯和四面转动发火焰的剑', cmd: 'lock 生命树之道 --cherubim --sword=火焰', ref: '3:24', hold: 3.2,
        verse: [
          { text: '于是把他赶出去了；又在伊甸园的东边安设基路伯<br>和四面转动发火焰的剑，要把守生命树的道路。', ref: '创世记 3:24', hold: 10 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              lv('edenCherub', 1, b);
              if (!inst(b)) { const sg = swordGeo(); W.flash = Math.max(W.flash, 0.3); fx().sparkle(sg.x, sg.y, 70, [255, 240, 206], 36 * P.s, 'top'); sfx('seal', b); }
            }],
            [1.8, b => { lv('edenSword', 1, b); if (!inst(b)) sfx('fire', b); }],
            [4.5, () => { cast().face('adam', 1); cast().face('eve', 1); cast().pose('eve', 'kneel'); }],
            [11, b => W.goTo(0.86, 18, inst(b))],
            [15, () => {
              const L = layout();
              cast().pose('eve', 'stand', { stop: true });
              walk('adam', L.exA - 0.03, 0.008); walk('eve', L.exE - 0.03, 0.008);
            }],
          ]);
        },
      },
    ],

    scene: {
      init() { U.safe('eden.models', buildModels); },
      resize() { P.w = 0; G = null; },
      update(dt) {
        if (!cur()) { if (PT.length) PT.length = 0; return; }
        layout();
        if (G && !G.settled && W.t - G.t0 > 1.2) { build(); G.settled = true; }   // 大地的细节就绪后再量一次
        updatePts(dt);
      },
      drawUnder(ctx, pass) { drawPass(ctx, pass, false); },
      draw(ctx, pass) { drawPass(ctx, pass, true); },
      reset() { PT.length = 0; },
      restore() { PT.length = 0; emitAcc = [0, 0, 0]; },
      pick,
    },
  });
})(window.GS);
