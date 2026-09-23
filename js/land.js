/* ─────────────────────────────────────────────────────────────
 * land.js —— 大地与草木
 *   三层地形（远山 / 中丘 / 近岸）自海中升起，水从其上流下；
 *   青草与结种子的菜蔬自灵所在之处向两边蔓延；
 *   结果子的树木，各从其类（橄榄、无花果、棕、香柏、石榴、皂荚、杏）。
 *   对外：treeSpots() / perches() / flowerSpots() / groundY(layer, x)
 *
 *   要点：
 *   - 出水：湿土更深，脊上湿亮，一层水帘（流动的纹理）自脊上泻下，水线处翻起白沫，近岸的海岸坡上水落回海中。
 *   - 青草：沿地面蔓延的一条参差的前沿（脊上先到，坡下略迟），草叶与菜蔬随同一前沿生长。
 *   - 树：一株幼苗长成大树（整体由小变大，枝、叶、果依次）；生长中用隔几帧重画的快照缩放着画，
 *     长成后分几步烘焙（昼 / 晨 / 昏 / 夜 + 四向轮廓光），烘好的位图存在库里，重新布局时取回。
 *   - 夜里只有灵是灯：树是墨色剪影，只在朝月、朝灵的一侧有一道细细的轮廓光；果子不自己发光。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const W = GS.W, U = GS.util;
  const { clamp, lerp, TAU } = U;

  const PASS_L = { far: 0, mid: 1, near: 2 };
  const L_PASS = ['far', 'mid', 'near'];

  // ── 小工具 ──────────────────────────────────────────────────
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const css = (c, a) => (a == null ? U.rgb(c[0], c[1], c[2]) : U.rgba(c[0], c[1], c[2], a));
  const eOut = t => 1 - (1 - t) * (1 - t) * (1 - t);
  const eBack = t => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2));
  const sstep = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const depthOf = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const uu = () => Math.max(0.3, W.unit || 1);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const fxOK = () => GS.fx && typeof GS.fx.add === 'function';

  // ── 色板 ────────────────────────────────────────────────────
  const SOIL = [[52, 48, 56], [110, 79, 51], [90, 65, 40]];
  const SOD = [[30, 80, 46], [72, 106, 58], [70, 108, 52]];          // 草覆之地
  const BLADE = [null, [[72, 104, 56], [138, 170, 100]], [[44, 78, 34], [118, 162, 78]]];
  const TUFT = [[36, 64, 28], [100, 142, 64]];
  const HERB = { stem: [70, 102, 50], leaf: [58, 96, 44], seed: [216, 194, 122], ctr: [236, 196, 92] };
  const FLOWER = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224]];
  const FOAM = [236, 244, 252];
  const TRUNK = [59, 42, 30];
  const RIM_DAY = [255, 244, 222], RIM_WARM = [255, 176, 108], RIM_NIGHT = [168, 190, 240], RIM_SPIRIT = [150, 195, 255];

  // 与 world.js 相同的光照常量：用于把树烘焙成昼 / 晨昏 / 夜三态，再按当下的光混合
  const NIGHT_AMB = [34, 46, 82], DUSK_AMB = [226, 132, 92], DAY_AMB = [236, 238, 240];
  const NIGHT_HAZE = [22, 32, 62], DUSK_HAZE = [236, 150, 118], DAY_HAZE = [178, 204, 228];
  function mkState(df, dusk) {
    let amb = mix(NIGHT_AMB, DAY_AMB, df); amb = mix(amb, DUSK_AMB, dusk * 0.75);
    let hz = mix(NIGHT_HAZE, DAY_HAZE, df); hz = mix(hz, DUSK_HAZE, dusk * 0.8);
    return { amb, haze: hz, lit: 0.1 + 0.9 * (0.1 + 0.9 * df) };
  }
  const ST = { day: mkState(1, 0), warm: mkState(0.432, 1), night: mkState(0, 0) };
  function shadeS(S, rgb, depth, extra) {
    if (!S) return W.shade(rgb, depth, extra);
    const lit = clamp(S.lit + (extra || 0), 0, 1.2), a = S.amb;
    const r = rgb[0] * lit * a[0] / 255, g = rgb[1] * lit * a[1] / 255, b = rgb[2] * lit * a[2] / 255;
    const hz = (depth || 0) * 0.78;
    return [lerp(r, S.haze[0], hz), lerp(g, S.haze[1], hz), lerp(b, S.haze[2], hz)];
  }

  // ── 树：各从其类 ────────────────────────────────────────────
  const KIND = {
    fig:   { cn: '无花果树', h: 0.9,  wide: 1.2,  leaf: [72, 122, 60],  fruit: [[150, 52, 86], [201, 56, 74], [118, 42, 70]], flex: 0.8 },
    olive: { cn: '橄榄树',   h: 0.82, wide: 1.05, leaf: [118, 138, 100], fruit: [[46, 30, 44], [96, 108, 52], [64, 34, 56]], flex: 0.9, ripeMix: 0.03 },
    palm:  { cn: '棕树',     h: 1.3,  wide: 0.9,  leaf: [74, 118, 60],  fruit: [[242, 163, 58], [214, 122, 44], [188, 92, 40]], flex: 1.6 },
    cedar: { cn: '香柏树',   h: 1.22, wide: 1.1,  leaf: [44, 86, 62],   fruit: [[132, 100, 64], [112, 86, 56], [150, 116, 72]], flex: 0.55 },
    pomegranate: { cn: '石榴树', h: 0.7, wide: 0.95, leaf: [60, 104, 52], fruit: [[201, 56, 74], [224, 84, 58], [172, 38, 58]], flex: 1.0, bloom: [[236, 96, 60]] },
    acacia: { cn: '皂荚树',  h: 0.86, wide: 1.4,  leaf: [100, 124, 64], fruit: [[176, 136, 70], [150, 112, 58], [198, 154, 82]], flex: 0.8, bloom: [[244, 211, 94]] },
    almond: { cn: '杏树',    h: 0.8,  wide: 1.0,  leaf: [240, 214, 224], back: [192, 156, 176], fruit: [[150, 172, 96], [132, 158, 84], [170, 186, 110]], flex: 1.0, bloom: [[255, 250, 246], [248, 204, 220], [236, 168, 194]] },
  };
  const KSEQ = ['olive', 'cedar', 'pomegranate', 'acacia', 'almond', 'fig'];

  // ── 状态 ────────────────────────────────────────────────────
  const LY = [0, 1, 2].map(i => ({
    i, n: 0, step: 1, base: null, cur: null, rise: -1, dirty: true, wl: 0,
    minY: 0, spanA: -1, spanB: -1, folds: [],
    wet: 0, breached: false, emitAcc: 0, pv: 0, pk: -1, P: null, rk: '', RP: null,
    nb: 0, B: null, tmp: null, herbs: [], trees: [], texels: [], coast: null,
  }));
  const trees = [];                 // 近 / 中两层的树
  const blooms = [];                // 赐福与「遍满地面」时开出的花
  const drift = [];                 // 自己的飘落物：杏花瓣、被灵吹散的种子
  const bakeQ = [];
  const models = {};
  let ready = false, lastQ = 1, lastW = 0, lastH = 0;
  let treeOrigin = null, treeOxN = 0.72;
  let worldBloomed = false, ripeOn = false, quietUntil = 0;
  let GLOW = null, SIL = null;      // 光晕贴图 / 剪影草稿画布
  const FL = { wd: 1, ww: 0, wn: 0, morn: false, order: [], sun: null, moon: null, sp: null, moonO: 0 };
  const FR = { gx: 0, hx: 0, tx: 0, gR: [0, 0, 0], hR: [0, 0, 0], tR: 0, feather: 40, gzone: 60, grassAll: false, herbAll: false };
  let gust = new Float32Array(8), gustStep = 24;
  const fcache = { frame: -1, trees: [], perch: [], flowers: [] };

  const PROF = { on: false, t: {} };
  function pf(name, fn) {
    if (!PROF.on) return fn();
    const t0 = performance.now();
    fn();
    PROF.t[name] = (PROF.t[name] || 0) + performance.now() - t0;
  }
  // ── 地形采样 ────────────────────────────────────────────────
  function ridgeAt(L, x) {
    const f = x / L.step;
    let i = f | 0;
    if (f < 0) return L.cur[0];
    if (i >= L.n - 1) return L.cur[L.n - 1];
    const r = f - i;
    return L.cur[i] + (L.cur[i + 1] - L.cur[i]) * r;
  }
  function baseAt(L, x) {
    const f = clamp(x / L.step, 0, L.n - 1.001);
    const i = f | 0, r = f - i;
    return L.base[i] + (L.base[i + 1] - L.base[i]) * r;
  }

  function updRidge(L) {
    const e = W.layerRise(L.i);
    if (e === L.rise && !L.dirty) return;
    L.rise = e; L.dirty = false;
    const sink = 1 - e, wl = L.wl, off = 0.02 * W.h, cur = L.cur, base = L.base;
    let mn = 1e9, a = -1, b = -1;
    for (let i = 0; i < L.n; i++) {
      const y = base[i] + sink * (wl - base[i] + off);
      cur[i] = y;
      if (y < wl - 0.5) { if (a < 0) a = i; b = i; if (y < mn) mn = y; }
    }
    L.minY = mn; L.spanA = a; L.spanB = b;
    L.pv++;
  }

  // 该层（完全升起后）有地的 x 区间
  function baseSpan(L, margin) {
    let a = -1, b = -1;
    for (let i = 0; i < L.n; i++) if (L.base[i] < L.wl - margin) { if (a < 0) a = i; b = i; }
    return a < 0 ? null : [a * L.step, b * L.step];
  }

  // ── 风：缓缓的底风 + 自海面一侧滚滚而来的阵风 ──────────────
  function updGust() {
    const n = Math.ceil(W.w / gustStep) + 3;
    if (gust.length < n) gust = new Float32Array(n);
    const k = 0.0032 / uu(), t = W.t;
    for (let i = 0; i < n; i++) {
      const v = U.noise1(i * gustStep * k - t * 0.42 + 31.7);
      gust[i] = v > 0 ? v * v * 1.6 : 0;
    }
  }
  function gustAt(x) {
    const f = clamp(x / gustStep, 0, gust.length - 2);
    const i = f | 0;
    return gust[i] + (gust[i + 1] - gust[i]) * (f - i);
  }
  function windAt(x) {
    const calm = W.ritual && W.ritual.holding ? 1 - 0.7 * W.ritual.charge : 1;
    return (W.wind * 0.3 + gustAt(x) * 0.5) * calm;
  }

  // ── 生长的前沿 ──────────────────────────────────────────────
  // 前沿推进到最远的陆地（近岸与中丘的两端）时恰好 lv=1
  function frontSpan(ox) {
    let D = 1;
    for (let l = 1; l < 3; l++) {
      const L = LY[l];
      if (!L.sb) continue;
      D = Math.max(D, Math.abs(ox - L.sb[0]), Math.abs(L.sb[1] - ox));
    }
    return D;
  }
  function frontR(lv, ox, delay, feather) {
    const e = 1 - Math.pow(1 - c01(lv), 1.6);
    const span = frontSpan(ox) + feather * 2;
    return e * (span + delay) - delay;
  }
  function updFronts() {
    const u = uu();
    const og = W.origin.grass, oh = W.origin.herbs || og, ot = W.origin.trees;
    FR.gx = og ? og.x : W.w * 0.72;
    FR.hx = oh ? oh.x : FR.gx;
    FR.tx = ot ? ot.x : FR.gx;
    FR.feather = 46 * u;
    FR.gzone = 70 * u;
    const dl = [0.16 * W.w, 0.07 * W.w, 0];
    for (let l = 0; l < 3; l++) {
      FR.gR[l] = frontR(W.lv.grass, FR.gx, dl[l], FR.feather);
      FR.hR[l] = frontR(W.lv.herbs, FR.hx, dl[l], FR.feather);
    }
    FR.tR = frontR(W.lv.trees, FR.tx, 0.1 * W.w, FR.feather);
    FR.grassAll = W.lv.grass >= 1;
    FR.herbAll = W.lv.herbs >= 1;
  }
  const cover = (R, d) => sstep(R + FR.feather, R - FR.feather, d);

  // ── 每帧的光：日 / 光核、月、灵 ──────────────────────────────
  function updLight() {
    const df = W.dayFactor, dk = W.dusk, L = W.lv.light;
    let wd = (1 - 0.75 * dk) * df - 0.108 * dk, wn = (1 - 0.75 * dk) * (1 - df) - 0.142 * dk, ww = dk;
    wd = Math.max(0, wd); wn = Math.max(0, wn);
    const s = wd + wn + ww || 1;
    FL.wd = wd / s; FL.ww = ww / s; FL.wn = wn / s;
    FL.morn = W.tod < 0.5;
    // 烘焙图的混合次序：权重大者先画满，其余依次按比例叠上
    const arr = [['day', FL.wd], [FL.morn ? 'morn' : 'eve', FL.ww], ['night', FL.wn]].filter(a => a[1] > 0.012).sort((a, b) => b[1] - a[1]);
    let acc = 0;
    FL.order = arr.map(a => { acc += a[1]; return [a[0], a[1] / acc]; });
    if (!FL.order.length) FL.order = [['day', 1]];
    // 主光：日 / 光核
    const up = c01(df * 1.25);
    FL.sun = { x: W.core.x, y: W.core.y, a: L * up * lerp(0.36, 0.95, dk), col: mix(RIM_DAY, RIM_WARM, c01(dk * 1.2)) };
    const mo = W.moon;
    const ma = mo && mo.vis > 0 ? mo.vis * W.night * sstep(-0.06, 0.2, mo.elev) : 0;
    FL.moon = { x: mo ? mo.x : 0, y: mo ? mo.y : 0, a: ma * 0.6, col: RIM_NIGHT };
    FL.moonO = ma * 0.26;
    const sp = W.spirit;
    FL.sp = { x: sp.x, y: sp.y, R: 230 * Math.max(0.6, W.unit), a: L * (0.1 + 0.9 * W.night) };
  }

  // ════════════════════════════════════════════════════════════
  //  树的模型（以树高为 1 的归一化坐标；y 向上为负）
  // ════════════════════════════════════════════════════════════
  function branch(m, R, x, y, ang, len, w, depth, t0, o, tips) {
    const x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
    const t1 = Math.min(0.46, t0 + o.dt);
    const w1 = w * o.taper;
    m.segs.push({ x0: x, y0: y, x1, y1, w0: w, w1, t0, t1 });
    if (depth <= 0) { tips.push({ x: x1, y: y1, a: ang, t: t1 }); return; }
    const n = R() < o.p3 ? 3 : 2;
    for (let k = 0; k < n; k++) {
      const side = n === 2 ? (k ? 1 : -1) : k - 1;
      let a = ang + side * o.spread * (0.7 + R() * 0.6) + (R() - 0.5) * o.jit;
      a = clamp(a * o.up, -o.maxA, o.maxA);
      branch(m, R, x1, y1, a, len * o.ratio * (0.82 + R() * 0.32), w1, depth - 1, t1, o, tips);
    }
  }
  function blob(m, x, y, rx, ry, rot, t, tone) { m.blobs.push({ x, y, rx, ry, rot: rot || 0, t, tone }); }
  // 冠：在椭圆包络内布置叶团，上部为亮面，下部与外缘为暗面
  function crown(m, R, cx, cy, rx, ry, tips, n, r0, r1, flat) {
    const pts = [];
    for (const t of tips) {
      const dx = (t.x - cx) / rx, dy = (t.y - cy) / ry, d = Math.hypot(dx, dy);
      const k = d > 0.85 ? 0.85 / d : 1;
      pts.push([cx + dx * k * rx, cy + dy * k * ry]);
    }
    for (let i = 0; i < n; i++) {
      const a = R() * TAU, r = Math.sqrt(R()) * 0.82;
      pts.push([cx + Math.cos(a) * r * rx, cy + Math.sin(a) * r * ry]);
    }
    // 背后的一圈暗团，使轮廓丰满
    const nb = Math.max(4, Math.round(n * 0.6));
    for (let i = 0; i < nb; i++) {
      const a = Math.PI + (i + 0.5) / nb * Math.PI + (R() - 0.5) * 0.3;
      const rr = lerp(r0, r1, R()) * 1.05;
      blob(m, cx + Math.cos(a) * rx * 0.72, cy + Math.sin(a) * ry * 0.7 - ry * 0.05, rr, rr * (flat || 0.84), (R() - 0.5) * 0.6,
        0.46 + 0.28 * R(), 0);
    }
    for (const p of pts) {
      const rr = lerp(r0, r1, R());
      const low = (p[1] - cy) / ry;
      const tone = low > 0.35 ? 0 : 1;
      const dist = Math.hypot((p[0] - cx) / rx, (p[1] - cy) / ry);
      blob(m, p[0], p[1], rr, rr * (flat || 0.84), (R() - 0.5) * 0.7, 0.38 + 0.3 * c01(dist) + R() * 0.1, tone);
    }
  }
  function fruitsOn(m, R, n, nRipe, r0, r1, shape, filter) {
    const cand = m.blobs.filter(filter || (b => b.tone === 1));
    if (!cand.length) return;
    for (let i = 0; i < n + nRipe; i++) {
      const b = cand[(R() * cand.length) | 0];
      const a = R() * TAU, rr = Math.sqrt(R()) * 0.72;
      m.fruits.push({
        x: b.x + Math.cos(a) * b.rx * rr, y: b.y + Math.abs(Math.sin(a)) * b.ry * rr * 0.9 + b.ry * 0.12,
        r: lerp(r0, r1, R()), c: (R() * 3) | 0, t: 0.8 + R() * 0.15, ripeOnly: i >= n, shape,
      });
    }
  }

  function genModel(kind, seed) {
    const key = kind + '|' + seed;
    if (models[key]) return models[key];
    const R = U.mulberry32(seed);
    const RR = (a, b) => a + (b - a) * R();
    const K = KIND[kind];
    const m = { kind, segs: [], blobs: [], fronds: [], fruits: [], blooms: [], marks: [], crown: null };
    const wide = K.wide * RR(0.9, 1.1);
    const tips = [];
    switch (kind) {
      case 'fig': {
        const ty = -RR(0.27, 0.32), tx = RR(-0.02, 0.02);
        m.segs.push({ x0: 0, y0: 0, x1: tx, y1: ty, w0: 0.095, w1: 0.075, t0: 0, t1: 0.14 });
        const o = { dt: 0.1, taper: 0.64, spread: 0.4, jit: 0.3, p3: 0.25, up: 0.92, maxA: 1.4, ratio: 0.72 };
        for (const a of [-1.05, -0.45, 0.25, 0.9]) branch(m, R, tx, ty, a + RR(-0.12, 0.12), RR(0.2, 0.26), 0.058, 2, 0.14, o, tips);
        crown(m, R, 0, -0.64, 0.56 * wide, 0.3, tips, 15, 0.085, 0.135);
        fruitsOn(m, R, 10, 8, 0.014, 0.019, 1);
        break;
      }
      case 'olive': {
        // 两股相缠的老干
        const s1 = [[-0.05, 0], [0.025, -0.1], [-0.02, -0.2], [0.03, -0.31]];
        const s2 = [[0.055, 0], [-0.01, -0.11], [0.04, -0.22], [-0.015, -0.3]];
        for (const s of [s1, s2]) for (let i = 0; i < 3; i++) {
          m.segs.push({ x0: s[i][0], y0: s[i][1], x1: s[i + 1][0], y1: s[i + 1][1], w0: 0.05 - i * 0.006, w1: 0.044 - i * 0.006, t0: i * 0.05, t1: i * 0.05 + 0.06 });
        }
        const o = { dt: 0.1, taper: 0.62, spread: 0.45, jit: 0.5, p3: 0.2, up: 0.9, maxA: 1.45, ratio: 0.7 };
        for (const a of [-1.15, -0.55, 0.05, 0.6, 1.1]) branch(m, R, RR(-0.01, 0.01), -0.3, a + RR(-0.15, 0.15), RR(0.17, 0.25), 0.03, 1, 0.17, o, tips);
        // 一团团透气的银绿叶簇
        for (const t of tips) {
          const n = 3 + ((R() * 3) | 0);
          for (let i = 0; i < n; i++) {
            const rr = RR(0.045, 0.075);
            const x = t.x + RR(-0.1, 0.1) * wide, y = t.y + RR(-0.06, 0.04);
            blob(m, x, y + 0.018, rr * 1.12, rr * 0.72, RR(-0.5, 0.5), 0.38 + R() * 0.25, 0);
            if (R() < 0.85) blob(m, x + RR(-0.015, 0.015), y - 0.008, rr * 0.92, rr * 0.6, RR(-0.5, 0.5), 0.42 + R() * 0.3, 1);
          }
        }
        fruitsOn(m, R, 16, 12, 0.009, 0.012, 0);
        break;
      }
      case 'pomegranate': {
        const o = { dt: 0.11, taper: 0.66, spread: 0.46, jit: 0.3, p3: 0.3, up: 0.9, maxA: 1.2, ratio: 0.7 };
        for (const a of [-0.28, 0.04, 0.32]) {
          const x1 = Math.sin(a) * 0.3, y1 = -Math.cos(a) * 0.3;
          m.segs.push({ x0: a * 0.04, y0: 0, x1, y1, w0: 0.034, w1: 0.026, t0: 0, t1: 0.15 });
          branch(m, R, x1, y1, a * 1.4, RR(0.14, 0.18), 0.024, 1, 0.15, o, tips);
        }
        crown(m, R, 0, -0.56, 0.42 * wide, 0.31, tips, 12, 0.075, 0.11);
        fruitsOn(m, R, 9, 7, 0.021, 0.027, 0);
        for (let i = 0; i < 6; i++) {
          const b = m.blobs[(R() * m.blobs.length) | 0];
          m.blooms.push({ x: b.x + RR(-0.5, 0.5) * b.rx, y: b.y - b.ry * RR(0.2, 0.7), r: 0.014, c: 0, t: 0.72 + R() * 0.1 });
        }
        break;
      }
      case 'cedar': {
        const top = -0.95;
        const pts = [[0, 0], [RR(-0.02, 0.02), -0.32], [RR(-0.02, 0.02), -0.64], [RR(-0.015, 0.015), top]];
        for (let i = 0; i < 3; i++) m.segs.push({ x0: pts[i][0], y0: pts[i][1], x1: pts[i + 1][0], y1: pts[i + 1][1], w0: 0.07 - i * 0.02, w1: 0.05 - i * 0.02, t0: i * 0.08, t1: i * 0.08 + 0.1 });
        const tiers = [0.54, 0.5, 0.43, 0.33, 0.22, 0.11];
        for (let k = 0; k < tiers.length; k++) {
          const y = -(0.22 + 0.132 * k) + RR(-0.015, 0.015);
          const hw = tiers[k] * wide * RR(0.85, 1.12);
          const off = RR(-0.06, 0.06) * (k < 4 ? 1 : 0.3);
          const tb = 0.18 + k * 0.03;
          for (const sd of [-1, 1]) m.segs.push({ x0: 0, y0: y + 0.03, x1: off + sd * hw * 0.78, y1: y + 0.004, w0: 0.02, w1: 0.007, t0: tb, t1: tb + 0.1 });
          // 一层层平展的枝叶：许多细碎的叶团，边缘参差
          const n = 4 + Math.round(hw * 26);
          for (let i = 0; i < n; i++) {
            const f = RR(-1, 1);
            const x = off + f * hw;
            const edge = Math.abs(f);
            const rx = RR(0.04, 0.075) * (1 - 0.35 * edge) + 0.012;
            const ry = rx * RR(0.42, 0.62);
            const yy = y + edge * edge * 0.028 + RR(-0.014, 0.01) * (1 - edge * 0.5);
            const tt = 0.3 + k * 0.03 + edge * 0.1 + R() * 0.03;   // 每层枝一抽出，叶便自内向外铺开（免得先成一根光杆）
            blob(m, x, yy + ry * 0.7, rx * 1.12, ry * 1.1, RR(-0.3, 0.3), tt, 0);
            if (R() < 0.8) blob(m, x + RR(-0.01, 0.01), yy - ry * 0.1, rx, ry, RR(-0.3, 0.3), tt + 0.02, 1);
          }
        }
        blob(m, 0.005, top + 0.03, 0.035, 0.05, 0, 0.62, 1);
        blob(m, 0, top + 0.06, 0.05, 0.03, 0, 0.6, 0);
        const cands = m.blobs.filter(b => b.tone === 1);
        for (let i = 0; i < 9; i++) {
          const b = cands[(R() * cands.length) | 0];
          m.fruits.push({ x: b.x + RR(-0.6, 0.6) * b.rx, y: b.y - b.ry * 0.9, r: 0.0085, c: (R() * 3) | 0, t: 0.82 + R() * 0.12, ripeOnly: i >= 6, shape: 3 });
        }
        break;
      }
      case 'acacia': {
        const ty = -RR(0.3, 0.36);
        m.segs.push({ x0: 0, y0: 0, x1: 0.015, y1: ty, w0: 0.052, w1: 0.04, t0: 0, t1: 0.14 });
        const yTop = -0.86;
        for (const a of [-0.62, 0.08, 0.66]) {
          const len = RR(0.36, 0.44);
          const x1 = 0.015 + Math.sin(a) * len * wide * 0.9, y1 = Math.max(yTop + 0.1, ty - Math.cos(a) * len);
          m.segs.push({ x0: 0.015, y0: ty, x1, y1, w0: 0.03, w1: 0.016, t0: 0.14, t1: 0.3 });
          for (const s of [-1, 1]) {
            const a2 = a + s * 0.55;
            m.segs.push({ x0: x1, y0: y1, x1: x1 + Math.sin(a2) * 0.12, y1: y1 - Math.cos(a2) * 0.1, w0: 0.014, w1: 0.007, t0: 0.3, t1: 0.4 });
          }
        }
        const n = 9;
        for (let i = 0; i < n; i++) {
          const f = (i / (n - 1)) * 2 - 1;
          const x = f * 0.6 * wide + RR(-0.03, 0.03);
          const rx = RR(0.13, 0.19), ry = RR(0.05, 0.065);
          const y = yTop + ry + Math.abs(f) * 0.05 + RR(-0.01, 0.01);
          blob(m, x, y + 0.035, rx * 1.08, ry * 1.1, 0, 0.36 + Math.abs(f) * 0.25, 0);
          blob(m, x + RR(-0.02, 0.02), y, rx, ry, 0, 0.4 + Math.abs(f) * 0.25, 1);
        }
        const cands = m.blobs.filter(b => b.tone === 1);
        for (let i = 0; i < 14; i++) {
          const b = cands[(R() * cands.length) | 0];
          m.fruits.push({ x: b.x + RR(-0.8, 0.8) * b.rx, y: b.y + b.ry * RR(1.2, 1.6), r: 0.012, c: (R() * 3) | 0, t: 0.82 + R() * 0.12, ripeOnly: i >= 8, shape: 2 });
        }
        for (let i = 0; i < 12; i++) {
          const b = cands[(R() * cands.length) | 0];
          m.blooms.push({ x: b.x + RR(-0.8, 0.8) * b.rx, y: b.y - b.ry * RR(0.3, 0.8), r: 0.013, c: 0, t: 0.75 + R() * 0.1 });
        }
        break;
      }
      case 'almond': {
        m.segs.push({ x0: 0, y0: 0, x1: -0.01, y1: -0.25, w0: 0.05, w1: 0.04, t0: 0, t1: 0.12 });
        const o = { dt: 0.075, taper: 0.66, spread: 0.36, jit: 0.3, p3: 0.25, up: 0.94, maxA: 1.15, ratio: 0.74 };
        for (const a of [-0.45, 0.05, 0.5]) branch(m, R, -0.01, -0.25, a + RR(-0.1, 0.1), RR(0.18, 0.22), 0.032, 3, 0.12, o, tips);
        // 繁花如云
        const cx = 0, cy = -0.62;
        for (const t of tips) {
          const x = lerp(t.x, cx, 0.12), y = lerp(t.y, cy, 0.12);
          blob(m, x, y + 0.015, RR(0.06, 0.085), RR(0.05, 0.07), 0, 0.42 + R() * 0.2, 0);
          blob(m, x + RR(-0.02, 0.02), y - 0.01, RR(0.05, 0.075), RR(0.042, 0.06), 0, 0.46 + R() * 0.25, 1);
        }
        for (let i = 0; i < 90; i++) {
          const t = tips[(R() * tips.length) | 0];
          const a = R() * TAU, r = Math.sqrt(R()) * 0.09;
          m.blooms.push({ x: t.x + Math.cos(a) * r, y: t.y + Math.sin(a) * r * 0.8, r: RR(0.009, 0.015), c: (R() * 3) | 0, t: 0.55 + R() * 0.35 });
        }
        fruitsOn(m, R, 0, 9, 0.013, 0.016, 1);
        break;
      }
      case 'palm': {
        const lean = RR(-0.2, -0.1) * (seed % 2 ? 1 : 0.7);
        const cx = lean, cy = -0.86;
        const N = 7;
        let px = 0, py = 0;
        for (let i = 1; i <= N; i++) {
          const s = i / N;
          const x = lean * s * s, y = cy * s;
          m.segs.push({ x0: px, y0: py, x1: x, y1: y, w0: 0.058 - (i - 1) * 0.0035, w1: 0.058 - i * 0.0035, t0: (i - 1) * 0.045, t1: i * 0.045 });
          if (i > 1 || true) {
            for (let k = 0; k < 3; k++) {
              const s2 = (i - 1 + k / 3) / N;
              const mx = lean * s2 * s2, my = cy * s2, hw = 0.03 - s2 * 0.01;
              m.marks.push({ x0: mx - hw, y0: my + 0.004, x1: mx + hw, y1: my - 0.004, t: s2 * 0.32 });
            }
          }
          px = x; py = y;
        }
        m.crown = { x: cx, y: cy };
        const angs = [-2.5, -1.95, -1.45, -0.95, -0.42, 0.15, 0.62, 1.12, 1.62, 2.1, 2.55];
        for (let i = 0; i < angs.length; i++) {
          if (R() < 0.12) continue;
          const a = angs[i] + RR(-0.12, 0.12);
          m.fronds.push({ ang: a, len: RR(0.36, 0.48) * (Math.abs(a) > 2.2 ? 0.8 : 1), droop: RR(0.35, 0.7), t: 0.32 + R() * 0.28, tone: Math.abs(a) < 0.7 || Math.abs(a) > 2.3 ? 0 : 1 });
        }
        blob(m, cx, cy + 0.01, 0.04, 0.035, 0, 0.35, 0);
        const ncl = 3;
        for (let c = 0; c < ncl; c++) {
          const bx = cx + RR(-0.07, 0.07), by = cy + RR(0.05, 0.08);
          for (let i = 0; i < 9; i++) {
            m.fruits.push({ x: bx + RR(-0.025, 0.025), y: by + RR(0, 0.05) - Math.abs(RR(-0.015, 0.015)), r: RR(0.01, 0.013), c: (R() * 3) | 0, t: 0.8 + R() * 0.14, ripeOnly: i >= 6, shape: 0 });
          }
        }
        break;
      }
    }
    // 包络、栖枝点
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = 0;
    const ext = (a, b, c, d) => { if (a < x0) x0 = a; if (b < y0) y0 = b; if (c > x1) x1 = c; if (d > y1) y1 = d; };
    for (const s of m.segs) { const w = Math.max(s.w0, s.w1); ext(Math.min(s.x0, s.x1) - w, Math.min(s.y0, s.y1) - w, Math.max(s.x0, s.x1) + w, Math.max(s.y0, s.y1) + w); }
    for (const b of m.blobs) { const r = Math.max(b.rx, b.ry) * 1.12; ext(b.x - r, b.y - r, b.x + r, b.y + r); }
    for (const f of m.fruits) ext(f.x - f.r * 2, f.y - f.r * 3, f.x + f.r * 2, f.y + f.r * 3);
    for (const f of m.blooms) ext(f.x - f.r, f.y - f.r, f.x + f.r, f.y + f.r);
    for (const f of m.fronds) {
      const L = f.len;
      ext(m.crown.x - L - 0.1, m.crown.y - L * 0.8 - 0.1, m.crown.x + L + 0.1, m.crown.y + L * 0.8 + 0.1);
    }
    m.bx0 = x0; m.by0 = y0; m.bx1 = x1; m.by1 = Math.max(y1, 0.02);
    // 冠顶与冠宽（供 treeSpots）
    let top = 0;
    for (const b of m.blobs) if (b.y - b.ry < top) top = b.y - b.ry;
    if (m.crown) top = Math.min(top, m.crown.y - 0.2);
    m.top = top;
    m.cw = x1 - x0;
    m.cy = m.crown ? m.crown.y : (top + (m.blobs.length ? m.blobs.reduce((s, b) => s + b.y, 0) / m.blobs.length : -0.6)) / 2;
    // 冠的中心与半径（受光的渐变用）
    const cb = m.blobs.filter(b => b.tone === 1);
    if (m.crown) { m.ccx = m.crown.x; m.ccy = m.crown.y; m.cr = 0.5; }
    else if (cb.length) {
      m.ccx = cb.reduce((s, b) => s + b.x, 0) / cb.length;
      m.ccy = cb.reduce((s, b) => s + b.y, 0) / cb.length;
      m.cr = 0.05;
      for (const b of m.blobs) m.cr = Math.max(m.cr, Math.hypot(b.x - m.ccx, b.y - m.ccy) + Math.max(b.rx, b.ry));
    } else { m.ccx = 0; m.ccy = -0.6; m.cr = 0.4; }
    // 栖枝：冠顶最高的几处
    const tops = m.blobs.filter(b => b.tone === 1).map(b => [b.x, b.y - b.ry * 0.85]).sort((a, b) => a[1] - b[1]);
    m.perch = [];
    for (const p of tops) {
      if (m.perch.length >= 3) break;
      if (m.perch.every(q => Math.abs(q[0] - p[0]) > 0.12)) m.perch.push(p);
    }
    if (m.crown) {
      m.perch = [];
      for (const f of m.fronds) if (Math.abs(f.ang) > 0.9 && Math.abs(f.ang) < 1.9 && m.perch.length < 3) {
        m.perch.push([m.crown.x + Math.sin(f.ang) * f.len * 0.5, m.crown.y - f.len * 0.1]);
      }
    }
    models[key] = m;
    return m;
  }

  // ── 树的调色（烘焙的三态 或 当下的光）────────────────────────
  function treePal(kind, layer, variant, ripe, lx, ly) {
    const K = KIND[kind], d = depthOf(layer);
    const S = variant === 'live' ? null : variant === 'day' ? ST.day : variant === 'night' ? ST.night : ST.warm;
    const sh = (c, e) => shadeS(S, c, d, e);
    const leaf = K.leaf, back = K.back || mix(mul(leaf, 0.56), [26, 44, 52], 0.22);
    const P = {};
    P.trunk = css(sh(TRUNK));
    P.bark2 = css(sh(mul(TRUNK, 0.62)));
    const md = sh(leaf);
    P.back = css(sh(back)); P.mid = css(md);
    let hiA = 0, rim = null, dx = 0, dy = -1, glowA = 0, warm = 0, gradK = 0;
    const rimDay = mix(sh(leaf, 0.45), RIM_DAY, 0.3), rimWarm = mix(sh(leaf, 0.85), RIM_WARM, 0.6);
    if (variant === 'day') { hiA = 0.55; dx = -0.35; dy = -1; rim = rimDay; glowA = 0.1; gradK = 1; }
    else if (variant === 'morn' || variant === 'eve') {
      hiA = 0.35; dx = variant === 'morn' ? -1 : 1; dy = -0.4; warm = 1;
      rim = rimWarm; glowA = 0.18; gradK = 1;
    } else if (variant === 'night') { hiA = 0; rim = null; glowA = 0; gradK = 0.25; }
    else if (variant === 'live') {
      hiA = 0.55 * FL.wd + 0.35 * FL.ww;
      dx = lx; dy = ly; warm = c01(FL.ww * 1.4);
      rim = FL.wd + FL.ww > 0.15 ? mix(rimDay, rimWarm, warm) : null;
      glowA = 0.1 * FL.wd + 0.18 * FL.ww;
      gradK = 1 - 0.75 * FL.wn;
    }
    const dl = Math.hypot(dx, dy) || 1;
    P.ldx = dx / dl; P.ldy = dy / dl;
    const lit = sh(mix(leaf, kind === 'almond' ? [255, 246, 240] : [196, 214, 150], kind === 'almond' ? 0.45 : 0.28), 0.1);
    const litW = mix(lit, RIM_WARM, 0.3 * warm);
    P.hi = css(mix(md, litW, 0.7));
    P.hiA = hiA;
    if (gradK > 0) {
      const lo = mix(md, sh(back), 0.45 * gradK);
      P.midG = [css(mix(md, litW, 0.42 * gradK)), css(md), css(lo)];
    }
    P.rim = rim ? css(rim) : null;
    const rimPx = layer === 2 ? 1.4 : 1.0;
    P.rdx = P.ldx * rimPx; P.rdy = P.ldy * rimPx;
    const fe = variant === 'night' ? 0.03 : 0.12;
    // 夜里只有灵是灯：熟透的果子不自己发光，只比叶略暖一点（免得成了暗色的洞）
    const nightW = variant === 'night' ? 1 : variant === 'live' ? FL.wn : 0;
    P.fruit = K.fruit.map(c => {
      const base = sh(ripe ? mix(c, [255, 150, 70], K.ripeMix == null ? 0.15 : K.ripeMix) : c, fe);
      if (!ripe || nightW <= 0) return css(base);
      const glowC = mul(mix(c, [220, 150, 110], 0.4), 0.3 * (K.ripeMix != null ? 0.6 : 1));
      return css(mix(base, glowC, 0.5 * nightW));
    });
    P.fruitHi = css(sh([255, 236, 210], 0.2), 0.5);
    P.bloom = (K.bloom || [[255, 255, 255]]).map(c => css(sh(c, 0.2)));
    P.glowA = ripe ? glowA : 0;
    return P;
  }
  const SILPAL = { trunk: '#000', bark2: '#000', back: '#000', mid: '#000', hi: '#000', hiA: 0, rim: null, rdx: 0, rdy: 0, ldx: 0, ldy: -1,
    fruit: ['#000', '#000', '#000'], fruitHi: 'rgba(0,0,0,0)', bloom: ['#000', '#000', '#000'], glowA: 0 };

  // ── 画一棵树（grow 0→1：先干，后冠，末了结果）─────────────────
  // 生长是一株幼苗长成大树（整体随 growScale 由小变大）：
  //   枝干在 grow 0→0.34 间抽出，叶团在 0.1→0.74 间次第绽开，果子在 0.8→1 间结成。
  //   模型里各部件的 t 仍是原来的次序，这里只是把它们映射到这两段时间上——
  //   这样就不会出现"一根光秃秃的高杆子，然后才长叶"（像电线杆）的样子。
  const segT = g => (g >= 1 ? 1 : c01(g / 0.34) * 0.46);
  const leafT = g => (g >= 1 ? 1 : 0.3 + c01((g - 0.1) / 0.64) * 0.66);
  function growScale(g) {
    if (g >= 1) return 1;
    const x = c01(g / 0.9);
    return 0.16 + 0.84 * (1 - (1 - x) * (1 - x));
  }
  function paintTree(g, m, grow, P, H, ripe) {
    const tr = new Path2D(), bk = new Path2D(), md = new Path2D();
    const trR = P.rim ? new Path2D() : null;
    const hi = P.hiA > 0.02 ? new Path2D() : null;
    let nTr = 0, nBk = 0, nMd = 0, nHi = 0, nTrR = 0;
    const gS = segT(grow), gL = leafT(grow);
    for (let i = 0; i < m.segs.length; i++) {
      const s = m.segs[i];
      const p = c01((gS - s.t0) / (s.t1 - s.t0 || 0.01));
      if (p <= 0) continue;
      const x0 = s.x0 * H, y0 = s.y0 * H;
      const x1 = (s.x0 + (s.x1 - s.x0) * p) * H, y1 = (s.y0 + (s.y1 - s.y0) * p) * H;
      const gw = 0.45 + 0.55 * c01(grow * 2.2);
      const w0 = Math.max(0.35, s.w0 * H * gw * 0.5), w1 = Math.max(0.25, lerp(s.w0, s.w1, p) * H * gw * 0.5);
      let nx = -(y1 - y0), ny = x1 - x0;
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      tr.moveTo(x0 + nx * w0, y0 + ny * w0); tr.lineTo(x1 + nx * w1, y1 + ny * w1);
      tr.lineTo(x1 - nx * w1, y1 - ny * w1); tr.lineTo(x0 - nx * w0, y0 - ny * w0); tr.closePath();
      if (w1 > 0.6) { tr.moveTo(x1 + w1, y1); tr.arc(x1, y1, w1, 0, TAU, true); }
      nTr++;
      // 细枝不描光（否则一两像素的枝条会整根发白）
      if (trR && w0 > 1.4) {
        trR.moveTo(x0 + nx * w0, y0 + ny * w0); trR.lineTo(x1 + nx * w1, y1 + ny * w1);
        trR.lineTo(x1 - nx * w1, y1 - ny * w1); trR.lineTo(x0 - nx * w0, y0 - ny * w0); trR.closePath();
        nTrR++;
      }
    }
    for (let i = 0; i < m.blobs.length; i++) {
      const b = m.blobs[i];
      const s = grow >= 1 ? 1 : eBack(c01((gL - b.t) / 0.16));
      if (s <= 0.01) continue;
      const rx = b.rx * H * s, ry = b.ry * H * s, x = b.x * H, y = b.y * H, c = Math.cos(b.rot), sn = Math.sin(b.rot);
      const p = b.tone === 0 ? bk : md;
      p.moveTo(x + rx * c, y + rx * sn); p.ellipse(x, y, rx, ry, b.rot, 0, TAU);
      if (b.tone === 0) nBk++; else nMd++;
      // 只有朝光一侧的外缘叶团带一抹亮面
      if (hi && b.tone === 1 && ((b.x - m.ccx) * P.ldx + (b.y - m.ccy) * P.ldy) > m.cr * 0.22) {
        const hx = x + P.ldx * rx * 0.28, hy = y + P.ldy * ry * 0.3, hrx = rx * 0.66, hry = ry * 0.62;
        hi.moveTo(hx + hrx * c, hy + hrx * sn); hi.ellipse(hx, hy, hrx, hry, b.rot, 0, TAU); nHi++;
      }
    }
    // 棕的羽叶
    let fr0 = null, fr1 = null;
    if (m.fronds.length && m.crown) {
      fr0 = new Path2D(); fr1 = new Path2D();
      const cx = m.crown.x * H, cy = m.crown.y * H;
      for (const f of m.fronds) {
        const p = c01((gL - f.t) / 0.3);
        if (p <= 0) continue;
        const e = eOut(p), L = f.len * H * e;
        const sa = Math.sin(f.ang), ca = Math.cos(f.ang);
        const x1 = cx + sa * L * 0.55, y1 = cy - ca * L * 0.55 - 0.2 * L;
        const x2 = cx + sa * L, y2 = cy - ca * L * 0.7 + f.droop * L * (0.35 + 0.65 * Math.abs(sa)) * e;
        const P2 = f.tone === 0 ? fr0 : fr1;
        P2.moveTo(cx, cy); P2.quadraticCurveTo(x1, y1, x2, y2);
        for (let s = 0.14; s <= 1.001; s += 0.07) {
          const a = 1 - s;
          const qx = a * a * cx + 2 * a * s * x1 + s * s * x2, qy = a * a * cy + 2 * a * s * y1 + s * s * y2;
          let tx = 2 * a * (x1 - cx) + 2 * s * (x2 - x1), ty = 2 * a * (y1 - cy) + 2 * s * (y2 - y1);
          const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
          const ll = L * 0.2 * (1 - 0.55 * s);
          for (const sd of [-1, 1]) {
            let dx = -ty * sd + tx * 0.35, dy = tx * sd + ty * 0.35 + 0.8;
            const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
            P2.moveTo(qx, qy); P2.lineTo(qx + dx * ll, qy + dy * ll);
          }
        }
      }
    }
    const lwF = Math.max(0.9, 0.013 * H);
    // 描光：先把整棵剪影向光偏移一两像素，用描光色画一遍
    if (P.rim) {
      g.save(); g.translate(P.rdx, P.rdy);
      g.fillStyle = P.rim; g.strokeStyle = P.rim;
      if (nBk) g.fill(bk); if (nTrR) g.fill(trR); if (nMd) g.fill(md);
      if (fr0) { g.lineWidth = lwF + 0.6; g.lineCap = 'round'; g.stroke(fr0); g.stroke(fr1); }
      g.restore();
    }
    if (nBk) { g.fillStyle = P.back; g.fill(bk); }
    if (nTr) { g.fillStyle = P.trunk; g.fill(tr); }
    if (m.marks.length && gS > 0.05) {
      const mk = new Path2D(); let n = 0;
      for (const k of m.marks) if (gS > k.t + 0.03) { mk.moveTo(k.x0 * H, k.y0 * H); mk.lineTo(k.x1 * H, k.y1 * H); n++; }
      if (n) { g.strokeStyle = P.bark2; g.lineWidth = Math.max(0.6, 0.007 * H); g.stroke(mk); }
    }
    // 冠的主色：朝光一侧亮，背光一侧沉
    let cfill = P.mid;
    if (P.midG && (nMd || fr0)) {
      const R = m.cr * H, gx = m.ccx * H, gy = m.ccy * H;
      const gr = g.createLinearGradient(gx + P.ldx * R, gy + P.ldy * R, gx - P.ldx * R, gy - P.ldy * R);
      gr.addColorStop(0, P.midG[0]); gr.addColorStop(0.45, P.midG[1]); gr.addColorStop(1, P.midG[2]);
      cfill = gr;
    }
    if (fr0) {
      g.lineCap = 'round'; g.lineWidth = lwF;
      g.strokeStyle = P.back; g.stroke(fr0);
      g.strokeStyle = cfill; g.stroke(fr1);
    }
    if (nMd) { g.fillStyle = cfill; g.fill(md); }
    if (hi && nHi) { g.globalAlpha = P.hiA; g.fillStyle = P.hi; g.fill(hi); g.globalAlpha = 1; }
    // 花
    if (m.blooms.length && gL > 0.5) {
      for (let ci = 0; ci < P.bloom.length; ci++) {
        const bp = new Path2D(); let n = 0;
        for (const f of m.blooms) {
          if (f.c !== ci) continue;
          const s = grow >= 1 ? 1 : eBack(c01((gL - f.t) / 0.1));
          if (s <= 0) continue;
          const r = Math.max(0.55, f.r * H * s);
          bp.moveTo(f.x * H + r, f.y * H); bp.arc(f.x * H, f.y * H, r, 0, TAU); n++;
        }
        if (n) { g.fillStyle = P.bloom[ci]; g.fill(bp); }
      }
    }
    // 果子
    if (grow > 0.78 && m.fruits.length) {
      const rk = ripe ? 1.18 : 1;
      if (P.glowA > 0 && GLOW) {
        g.globalAlpha = P.glowA;
        for (let k = 0; k < m.fruits.length; k += 2) {
          const f = m.fruits[k];
          if (f.ripeOnly && !ripe) continue;
          const R = Math.max(2.5, f.r * H * 3.4);
          g.drawImage(GLOW, f.x * H - R, f.y * H - R, R * 2, R * 2);
        }
        g.globalAlpha = 1;
      }
      for (let ci = 0; ci < 3; ci++) {
        const fp = new Path2D(); let n = 0;
        for (const f of m.fruits) {
          if (f.c !== ci || (f.ripeOnly && !ripe)) continue;
          const s = grow >= 1 ? 1 : eBack(c01((grow - f.t) / 0.07));
          if (s <= 0) continue;
          const r = Math.max(0.6, f.r * H * s * rk), x = f.x * H, y = f.y * H;
          if (f.shape === 1) { fp.moveTo(x + r * 0.8, y); fp.ellipse(x, y, r * 0.8, r * 1.05, 0, 0, TAU); }
          else if (f.shape === 2) { fp.moveTo(x + r * 0.45 * 0.9689, y + r * 0.45 * 0.2474); fp.ellipse(x, y, r * 0.45, r * 2.1, 0.25, 0, TAU); }
          else if (f.shape === 3) { fp.moveTo(x + r * 0.7, y); fp.ellipse(x, y, r * 0.7, r * 1.4, 0, 0, TAU); }
          else { fp.moveTo(x + r, y); fp.arc(x, y, r, 0, TAU); }
          n++;
        }
        if (n) { g.fillStyle = P.fruit[ci]; g.fill(fp); }
      }
      if (H > 60 && P.hiA > 0.2) {
        const hp = new Path2D(); let n = 0;
        for (const f of m.fruits) {
          if ((f.ripeOnly && !ripe) || f.shape >= 2) continue;
          const r = f.r * H * rk;
          if (r < 1.6) continue;
          hp.moveTo(f.x * H - r * 0.3 + r * 0.32, f.y * H - r * 0.35); hp.arc(f.x * H - r * 0.3, f.y * H - r * 0.35, r * 0.32, 0, TAU); n++;
        }
        if (n) { g.fillStyle = P.fruitHi; g.fill(hp); }
      }
    }
  }

  // ── 烘焙 ────────────────────────────────────────────────────
  const VARIANTS = ['day', 'morn', 'eve', 'night'];
  // 烘焙面：有 OffscreenCanvas 时用一块共享的草稿面，画完即 transferToImageBitmap（不可变、最省的 drawImage 来源，也省内存）；
  // 否则退回普通 canvas。
  const HAS_OC = typeof OffscreenCanvas !== 'undefined' && typeof OffscreenCanvas.prototype.transferToImageBitmap === 'function';
  let SCR = null, ocOK = HAS_OC;
  function surface(old, w, h) {
    if (ocOK) {
      try {
        if (!SCR) SCR = new OffscreenCanvas(w, h);
        if (SCR.width !== w || SCR.height !== h) { SCR.width = w; SCR.height = h; }
        const g = SCR.getContext('2d');
        if (g) return { c: SCR, g, oc: true };
      } catch (e) { /* 退回 */ }
      ocOK = false;
    }
    let c = old && !(typeof ImageBitmap !== 'undefined' && old instanceof ImageBitmap) ? old : null;
    if (!c) c = document.createElement('canvas');
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    return { c, g: c.getContext('2d'), oc: false };
  }
  function finish(sf) {
    if (sf.oc) {
      try { return sf.c.transferToImageBitmap(); } catch (e) { ocOK = false; }
      // 转移失败：把内容拷到普通 canvas
      const c = document.createElement('canvas');
      c.width = sf.c.width; c.height = sf.c.height;
      c.getContext('2d').drawImage(sf.c, 0, 0);
      return c;
    }
    return sf.c;
  }
  function freeImg(img) { if (img && typeof img.close === 'function') { try { img.close(); } catch (e) { /* */ } } }
  function bakeKey(t) { return t.H.toFixed(2) + '|' + (t.ripe ? 1 : 0) + '|' + Math.min(W.dpr || 1, 1.5); }
  // 烘焙的库：同一棵树（种类 / 种子 / 层 / 尺寸 / 熟否 / 像素比）只烘一次。
  // 恢复存档、卷与卷之间的 resync、来回缩放窗口都会重新布局——长好的树直接取回，不必重烘。
  const bakeStore = new Map();
  const storeKey = t => t.kind + '|' + t.seed + '|' + t.layer + '|' + bakeKey(t);
  function releaseBake(b) {
    if (!b) return;
    if (bakeStore.get(b.key) === b) bakeStore.delete(b.key);
    for (const k in b.c) freeImg(b.c[k]);
  }
  // 轮廓光的四个方向：光自左 / 右 / 上 / 下
  const ODIR = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  // 烘焙分阶段进行：昼 / 晨 / 昏 / 夜 四态各一步，剪影与四向轮廓一步——每帧只做预算内的几步，
  // 免得一棵树长成的那一帧卡顿。未烘完之前，树用生长快照来画。
  function bakeBox(t, bsMax, k) {
    const m = t.model, H = t.H;
    const pad = 4 + (t.ripe ? 5 : 0);
    const bx0 = m.bx0 * H - pad, by0 = m.by0 * H - pad, bx1 = m.bx1 * H + pad, by1 = m.by1 * H + pad;
    const bs = Math.min(W.dpr || 1, bsMax) * (k || 1);
    return { bx0, by0, bx1, by1, bs,
      cw: Math.max(2, Math.min(2048, Math.ceil((bx1 - bx0) * bs))), ch: Math.max(2, Math.min(2048, Math.ceil((by1 - by0) * bs))) };
  }
  function bakeStep(t) {
    if (PROF.on) PROF.t.nBake = (PROF.t.nBake || 0) + 1;
    let J = t.job;
    if (!J || J.key !== bakeKey(t)) {
      if (J) for (const k in J.c) freeImg(J.c[k]);
      J = t.job = Object.assign(bakeBox(t, 1.5), { key: bakeKey(t), c: {}, step: 0 });
    }
    const m = t.model, H = t.H, { bx0, by0, bs, cw, ch } = J;
    if (J.step < 4) {
      const v = VARIANTS[J.step];
      const sf = surface(null, cw, ch), g = sf.g;
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      g.clearRect(0, 0, cw, ch);
      g.setTransform(bs, 0, 0, bs, -bx0 * bs, -by0 * bs);
      paintTree(g, m, 1, treePal(t.kind, t.layer, v, t.ripe), H, t.ripe);
      J.c[v] = finish(sf);
      J.step++;
      return false;
    }
    // 轮廓光（月 / 灵）：剪影朝光的方向挪开一两像素，再减去自身——只剩朝光一侧的一道细边。
    // 四个方向各烘一张（半分辨率：边本就柔），绘制时按光的方位混合。
    if (!SIL) SIL = document.createElement('canvas');
    if (SIL.width < cw || SIL.height < ch) { SIL.width = Math.max(SIL.width, cw); SIL.height = Math.max(SIL.height, ch); }
    const sg = SIL.getContext('2d');
    sg.setTransform(1, 0, 0, 1, 0, 0); sg.clearRect(0, 0, SIL.width, SIL.height);
    sg.setTransform(bs, 0, 0, bs, -bx0 * bs, -by0 * bs);
    paintTree(sg, m, 1, SILPAL, H, false);
    sg.setTransform(1, 0, 0, 1, 0, 0);
    const hs = 0.5, ow = Math.max(2, Math.ceil(cw * hs)), oh = Math.max(2, Math.ceil(ch * hs));
    const r = (t.layer === 2 ? 1.5 : 1.15) * bs * hs;
    for (let k = 0; k < 4; k++) {
      const d = ODIR[k];
      const sf = surface(null, ow, oh), og = sf.g;
      og.setTransform(1, 0, 0, 1, 0, 0); og.globalAlpha = 1; og.globalCompositeOperation = 'source-over';
      og.clearRect(0, 0, ow, oh);
      og.drawImage(SIL, 0, 0, cw, ch, d[0] * r, d[1] * r, ow, oh);
      og.drawImage(SIL, 0, 0, cw, ch, d[0] * r * 0.5, d[1] * r * 0.5, ow, oh);
      og.globalCompositeOperation = 'source-in';
      og.fillStyle = 'rgb(196,220,255)'; og.fillRect(0, 0, ow, oh);
      og.globalCompositeOperation = 'destination-out';
      og.drawImage(SIL, 0, 0, cw, ch, 0, 0, ow, oh);
      og.globalCompositeOperation = 'source-over';
      J.c['o' + k] = finish(sf);
    }
    // 完成：装上，旧的释放
    const key = storeKey(t);
    if (t.bake && t.bake.key !== key) releaseBake(t.bake);
    const prev = bakeStore.get(key);
    if (prev && prev !== t.bake) releaseBake(prev);
    t.bake = { c: J.c, x0: bx0, y0: J.by0, w: J.bx1 - bx0, h: J.by1 - J.by0, H, key };
    bakeStore.set(key, t.bake);
    t.bakeKey = J.key;
    t.job = null;
    if (t.snap) { freeImg(t.snap.img); t.snap = null; }
    return true;
  }
  function bakeTree(t) { let guard = 8; while (guard-- > 0 && !bakeStep(t)) { /* 一口气烘完 */ } }
  function processBakes(budget) {
    if (!bakeQ.length) return;
    const t0 = performance.now();
    let n = 0;
    // 先烘焙那些正以快照代替的（尚无可用的烘焙）
    bakeQ.sort((a, b) => (a.bake && a.bake.H === a.H ? 1 : 0) - (b.bake && b.bake.H === b.H ? 1 : 0));
    while (bakeQ.length && (n === 0 || performance.now() - t0 < budget)) {
      const t = bakeQ[0];
      if (!(t.g >= 1 && t.bakeKey !== bakeKey(t))) { bakeQ.shift(); t.queued = false; continue; }
      let done = true;
      U.safe('land.bake', () => { done = bakeStep(t); });
      n++;
      if (done !== false) { bakeQ.shift(); t.queued = false; }
    }
  }
  // 生长中的树：隔几帧重画一张全尺寸的快照，其余帧按此刻的 growScale 缩放着画——
  // 生长的大小始终平滑，只有叶团绽开的一瞬按快照的节奏；十几棵树同时生长也不必每帧逐棵现画
  function snapTree(t) {
    if (PROF.on) PROF.t.nSnap = (PROF.t.nSnap || 0) + 1;
    // 快照的分辨率随此刻的大小：小树只需小图（绘制时本就缩小着画）
    const sc = growScale(t.g);
    const B = bakeBox(t, 1.25, Math.min(1, sc * 1.1 + 0.05)), m = t.model, H = t.H;
    const sf = surface(null, B.cw, B.ch), g = sf.g;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, B.cw, B.ch);
    g.setTransform(B.bs, 0, 0, B.bs, -B.bx0 * B.bs, -B.by0 * B.bs);
    const y = ridgeAt(LY[t.layer], t.x);
    let lx = W.core.x - t.x, ly = W.core.y - (y - H * 0.6);
    if (FL.sun.a < FL.moon.a) { lx = FL.moon.x - t.x; ly = FL.moon.y - y; }
    paintTree(g, m, t.g, treePal(t.kind, t.layer, 'live', t.ripe, lx, ly), H, t.ripe);
    const img = finish(sf);
    if (t.snap) freeImg(t.snap.img);
    t.snap = { img, g: t.g, x0: B.bx0, y0: B.by0, w: B.bx1 - B.bx0, h: B.by1 - B.by0, H, f: W.frame };
  }
  const SNAPC = [];
  function processSnaps(budget) {
    SNAPC.length = 0;
    for (const t of trees) {
      if (t.g <= 0) { if (t.snap) { freeImg(t.snap.img); t.snap = null; } continue; }
      const baked = t.g >= 1 && t.bake && t.bake.H === t.H;
      if (baked) { if (t.snap) { freeImg(t.snap.img); t.snap = null; } continue; }
      const sn = t.snap;
      const st = !sn || sn.H !== t.H ? 9 : t.g - sn.g + (W.frame - sn.f) * 0.0002;
      if (sn && sn.H === t.H && t.g - sn.g < 0.02 && W.frame - sn.f < 45) continue;
      SNAPC.push(st, t);
    }
    if (!SNAPC.length) return;
    const t0 = performance.now();
    for (let n = 0; n < 40; n++) {
      let bi = -1, bs = -1;
      for (let i = 0; i < SNAPC.length; i += 2) if (SNAPC[i] > bs) { bs = SNAPC[i]; bi = i; }
      if (bi < 0) break;
      const t = SNAPC[bi + 1];
      SNAPC[bi] = -2;
      U.safe('land.snap', () => snapTree(t));
      if (performance.now() - t0 > budget) break;
    }
  }
  function queueBake(t) { if (!t.queued) { t.queued = true; bakeQ.push(t); } }

  function makeGlow() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,214,150,0.95)');
    gr.addColorStop(0.3, 'rgba(255,184,110,0.45)');
    gr.addColorStop(1, 'rgba(255,160,90,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }

  // ════════════════════════════════════════════════════════════
  //  布局：树、草叶、菜蔬、远山林木、溪流
  // ════════════════════════════════════════════════════════════
  function dropWork(t) {
    if (t.job) { for (const k in t.job.c) freeImg(t.job.c[k]); t.job = null; }
    if (t.snap) { freeImg(t.snap.img); t.snap = null; }
  }
  function dropBake(t) { dropWork(t); if (t.bake) { releaseBake(t.bake); t.bake = null; } t.bakeKey = ''; }
  function layoutTrees() {
    for (const t of trees) { dropWork(t); t.bake = null; t.bakeKey = ''; }   // 烘好的位图留在库里，新的布局可以取回
    for (const L of LY) L.trees = [];
    trees.length = 0;
    bakeQ.length = 0;
    if (!ready) return;
    const u = uu();
    const ripe = W.stage >= 24;
    const portrait = W.h > W.w * 1.15 ? 1.18 : 1;
    const mk = (layer, x, kind, seed, H, start, dur, isOrigin) => {
      const t = {
        layer, x, kind, seed, H, start, dur, isOrigin, model: genModel(kind, seed),
        g: 0, pg: -1, phase: (seed * 0.618) % TAU, sink: (layer === 2 ? 3 : 1.5) * u,
        bake: null, bakeKey: '', queued: false, job: null, snap: null, ripe, ripeAt: ripe ? 0 : Infinity,
      };
      trees.push(t); LY[layer].trees.push(t);
      return t;
    };
    const ox = treeOxN * W.w;
    // 树不长在陡坡上：若坡太陡，向内陆（右）挪到平缓处
    const gentle = (L, x, lim) => {
      const e = 3;
      for (let k = 0; k < 80; k++) {
        const sl = Math.abs(baseAt(L, x + e) - baseAt(L, x - e)) / (2 * e);
        if (sl < lim || x > W.w - 10) break;
        x += 3;
      }
      return x;
    };
    // 近岸
    const Ln = LY[2];
    const sp = baseSpan(Ln, W.h * 0.03);
    if (sp) {
      const a = sp[0] + 8 * u, b = Math.min(sp[1], W.w - 6 * u);
      const width = Math.max(1, b - a);
      const N = clamp(Math.round(width / (82 * u * (portrait > 1 ? 1.3 : 1))), 4, 13);   // 竖屏：地窄，树疏一些
      const spc = width / N;
      const oxc = clamp(ox, a + 2 * u, b);
      const D = Math.max(oxc - a, b - oxc, 1);
      const Hb = 108 * u * portrait;
      mk(2, oxc, 'fig', 4242, Hb * 1.38, 0, 0.42, true);
      for (let k = 0; k < N; k++) {
        const r = U.mulberry32(1000 + k * 7919);
        const x = gentle(Ln, a + (k + 0.5) * spc + (r() - 0.5) * 0.5 * spc, 0.55);
        if (Math.abs(x - oxc) < 0.62 * spc) continue;
        let kind = KSEQ[(k * 5 + 3) % KSEQ.length];
        if (k === 0 || (k === 1 && N >= 9 && r() < 0.7)) kind = 'palm';
        const H = Hb * KIND[kind].h * (0.84 + 0.26 * r());
        mk(2, x, kind, 5000 + k * 131, H, 0.06 + 0.5 * Math.abs(x - oxc) / D, 0.36, false);
      }
    }
    // 中丘
    const Lm = LY[1];
    const sm = baseSpan(Lm, W.h * 0.012);
    if (sm) {
      const a = sm[0] + 6 * u, b = Math.min(sm[1], W.w - 4 * u);
      const width = Math.max(1, b - a);
      const N = clamp(Math.round(width / (64 * u * (portrait > 1 ? 1.3 : 1))), 4, 10);
      const spc = width / N;
      const D = Math.max(Math.abs(ox - a), Math.abs(b - ox), 1);
      const Hb = 108 * u * 0.52 * portrait;
      // 各从其类：近岸未有的种类先长在中丘上（竖屏近岸的树少，也要七类俱全）
      const have = new Set(LY[2].trees.map(t => t.kind));
      const seq = [];
      for (let j = 0; j < KSEQ.length; j++) { const kd = KSEQ[(j * 5 + 2) % KSEQ.length]; if (!have.has(kd)) seq.push(kd); }
      for (let j = 0; j < KSEQ.length; j++) { const kd = KSEQ[(j * 5 + 2) % KSEQ.length]; if (have.has(kd)) seq.push(kd); }
      for (let k = 0; k < N; k++) {
        const r = U.mulberry32(2000 + k * 7919);
        const x = gentle(Lm, a + (k + 0.5) * spc + (r() - 0.5) * 0.6 * spc, 0.6);
        let kind = seq[(k + seq.length - 1) % seq.length];
        if (k === 0) kind = 'palm';
        const H = Hb * KIND[kind].h * (0.8 + 0.3 * r());
        mk(1, x, kind, 7000 + k * 173, H, 0.12 + 0.55 * Math.abs(x - ox) / D, 0.3, false);
      }
    }
    for (const L of LY) L.trees.sort((p, q) => baseAt(L, p.x) - baseAt(L, q.x) || p.H - q.H);
    // 取回库里已烘好的，其余的位图释放
    const used = new Set();
    for (const t of trees) {
      const b = bakeStore.get(storeKey(t));
      if (b) { t.bake = b; t.bakeKey = bakeKey(t); used.add(b); }
    }
    for (const [k, b] of Array.from(bakeStore)) if (!used.has(b)) releaseBake(b);
    for (const t of trees) { t.g = treeGrowth(t); t.pg = t.g; if (t.g >= 1) queueBake(t); }
  }
  function treeGrowth(t) { return c01((W.lv.trees - t.start) / t.dur); }

  function buildBlades(L) {
    L.nb = 0; L.B = null; L.tc = null;
    if (L.i === 0) return;
    const sp = baseSpan(L, 0.5);
    if (!sp) return;
    const q = W.quality || 1, u = uu(), near = L.i === 2;
    const ls = near ? 1 : 0.58;
    const arr = [];
    const R = U.mulberry32(near ? 911 : 577);
    const gap = (near ? 2.5 : 3.1) * Math.max(0.62, u) / q;
    for (let x = sp[0] - 1; x < sp[1] + 2; x += gap * (0.55 + R() * 0.9)) {
      const xn = x / W.w;
      const patch = 0.62 + 0.55 * (0.5 + 0.5 * U.noise1(xn * 17 + L.i * 9.1));
      arr.push({
        x, v: 0, dy: R() * 2.2 * u * ls, h: u * ls * (4 + 10 * R() * R() + 3 * R()) * patch,
        w: Math.max(0.45, u * ls * (0.75 + 0.55 * R())), lean: (R() - 0.5) * 0.55, ph: R() * TAU, tone: R() < 0.3 ? 1 : 0,
      });
    }
    // 近岸的草地：一簇簇散在向下铺展的大地上，越近越大
    if (near) {
      const nT = Math.min(240, Math.round((sp[1] - sp[0]) / (7.8 * u) * q));
      const R2 = U.mulberry32(1313);
      for (let k = 0; k < nT; k++) {
        const x = sp[0] + R2() * (sp[1] - sp[0]);
        const v = 0.04 + Math.pow(R2(), 1.15) * 0.9;
        const bh = W.h - baseAt(L, x);
        if (bh * v < 5) continue;
        const sc = u * (0.75 + 1.25 * v);
        const n = 2 + ((R2() * 3) | 0);
        const hh = (2.8 + 4.5 * R2()) * sc;
        for (let j = 0; j < n; j++) {
          arr.push({
            x: x + (j - n / 2) * 1.2 * sc, v, dy: 0, h: hh * (0.7 + 0.5 * R2()), w: Math.max(0.5, 0.75 * sc),
            lean: (j / Math.max(1, n - 1) - 0.5) * 0.9 + (R2() - 0.5) * 0.2, ph: R2() * TAU, tone: R2() < 0.28 ? 3 : 2,
          });
        }
      }
    }
    arr.sort((a, b) => a.tone - b.tone || a.x - b.x);
    const n = arr.length;
    const B = { x: new Float32Array(n), v: new Float32Array(n), dy: new Float32Array(n), h: new Float32Array(n), w: new Float32Array(n),
      lean: new Float32Array(n), ph: new Float32Array(n), tone: new Uint8Array(n) };
    for (let i = 0; i < n; i++) {
      const a = arr[i];
      B.x[i] = a.x; B.v[i] = a.v; B.dy[i] = a.dy; B.h[i] = a.h; B.w[i] = a.w; B.lean[i] = a.lean; B.ph[i] = a.ph; B.tone[i] = a.tone;
    }
    L.B = B; L.nb = n;
    L.tmp = new Float32Array(n * 5);
    L.glowIdx = new Int32Array(n);
  }

  function buildHerbs(L) {
    L.herbs = []; L.hg = null;
    if (L.i === 0) return;
    const near = L.i === 2;
    const sp = baseSpan(L, near ? W.h * 0.01 : W.h * 0.004);
    if (!sp) return;
    const q = W.quality || 1, u = uu();
    const ls = near ? 1 : 0.55;
    const n = Math.max(3, Math.round((sp[1] - sp[0]) / ((near ? 16 : 22) * u) * q));
    for (let k = 0; k < n; k++) {
      const R = U.mulberry32(3000 + L.i * 100000 + k * 977);
      const x = sp[0] + (k + R()) / n * (sp[1] - sp[0]);
      const body = near && R() < 0.4;
      const v = body ? 0.05 + R() * R() * 0.4 : 0;
      const s = ls * u * (body ? 1 + v * 1.3 : 1);
      const kr = R();
      const kind = kr < 0.34 ? 0 : kr < 0.55 ? 1 : 2;
      const nl = 2 + ((R() * 3) | 0);
      const leaves = [];
      for (let j = 0; j < nl; j++) leaves.push([0.18 + j * 0.2 + R() * 0.08, j % 2 ? 1 : -1, 0.8 + R() * 0.5]);
      L.herbs.push({
        x, v, s, kind, h: s * (kind === 0 ? 15 + R() * 12 : kind === 1 ? 12 + R() * 10 : 9 + R() * 9),
        lean: (R() - 0.5) * 0.3, ph: R() * TAU, ci: (R() * 4) | 0, nSeed: 4 + ((R() * 3) | 0), leaves,
        dl: R() * 0.35, off: R() * 0.25, cool: 0,
      });
    }
  }

  function buildTexels() {
    const L = LY[0];
    L.texels = [];
    const sp = baseSpan(L, 1);
    if (!sp) return;
    const u = uu();
    const R = U.mulberry32(4141);
    const n = Math.round((sp[1] - sp[0]) / (3.2 * Math.max(0.6, u)));
    for (let k = 0; k < n; k++) {
      const x = sp[0] + R() * (sp[1] - sp[0]);
      const depth = W.waterlineY(0) - baseAt(L, x);
      if (depth < 3) continue;
      L.texels.push({ x, v: Math.pow(R(), 1.8) * 0.55, s: (0.9 + R() * 1.2) * Math.max(0.55, u) * 1.15, spire: R() < 0.35 });
    }
    L.texels.sort((a, b) => a.v - b.v);
  }

  function buildFolds(L) {
    const defs = L.i === 2 ? [[0.17, 0.07, 5.3, 11.1], [0.44, 0.1, 3.7, 4.2]]
      : L.i === 1 ? [[0.34, 0.14, 7.1, 2.5]] : [[0.3, 0.14, 9.3, 8.8], [0.58, 0.1, 6.1, 1.7]];
    L.folds = defs.map(d => {
      const f = new Float32Array(L.n);
      for (let i = 0; i < L.n; i++) f[i] = clamp(d[0] + d[1] * U.noise1((i / (L.n - 1)) * d[2] + d[3]), 0.06, 0.86);
      return f;
    });
  }

  // ── 花：赐福 / 遍满地面 ─────────────────────────────────────
  const MAXB = 460;
  function addBloom(x, y, born, fromBless) {
    // 找到 (x, y) 所在之地：近岸大地的铺展面 / 近岸脊线 / 中丘脊线
    const Ln = LY[2], Lm = LY[1];
    if (x < 2 || x > W.w - 2) return false;
    const rn = baseAt(Ln, x);
    if (rn < Ln.wl - 4 && y > rn - 12) {
      const v = y <= rn + 2 ? 0 : clamp((y - rn) / (W.h - rn), 0, 0.95);
      if (v > 0 && (W.h - rn) * v < 3) return false;
      blooms.push({ x, v, layer: 2, ci: (Math.random() * 4) | 0, s: (0.55 + Math.random() * 0.5) * uu() * (1 + v * 1.3), born, sp: !!fromBless, done: !fromBless, ph: Math.random() * TAU });
      return true;
    }
    const rm = baseAt(Lm, x);
    if (rm < Lm.wl - 2 && Math.abs(y - rm) < 30 * uu()) {
      blooms.push({ x, v: 0, layer: 1, ci: (Math.random() * 4) | 0, s: (0.6 + Math.random() * 0.4) * uu() * 0.6, born, sp: !!fromBless, done: !fromBless, ph: Math.random() * TAU });
      return true;
    }
    return false;
  }
  function trimBlooms() {
    while (blooms.length > MAXB) {
      let k = blooms.findIndex(b => !b.world);
      if (k < 0) k = 0;
      blooms.splice(k, 1);
    }
  }
  function worldBloom(cx, animated) {
    if (worldBloomed || !ready) return;
    worldBloomed = true;
    const Ln = LY[2];
    const sp = baseSpan(Ln, 4);
    const q = W.quality || 1, u = uu();
    if (sp) {
      const R = U.mulberry32(777);
      const g = () => (R() + R() + R() - 1.5) / 1.5;
      const D = Math.max(W.w, 1);
      const nP = Math.max(4, Math.round((sp[1] - sp[0]) / (62 * u)));
      const per = Math.max(4, Math.round(15 * q));
      for (let pk = 0; pk < nP; pk++) {
        const px = sp[0] + R() * (sp[1] - sp[0]);
        const pv = R() < 0.3 ? 0 : 0.05 + Math.pow(R(), 1.4) * 0.8;
        const c1 = (R() * 4) | 0, c2 = (R() * 4) | 0;
        const cnt = Math.round(per * (0.5 + R()));
        for (let j = 0; j < cnt; j++) {
          const x = px + g() * 30 * u * (1 + pv * 1.5);
          if (x < sp[0] || x > sp[1]) continue;
          const rn = baseAt(Ln, x);
          const v = pv === 0 ? (R() < 0.75 ? 0 : 0.02 + R() * 0.06) : clamp(pv + g() * 0.07, 0.02, 0.95);
          if (v > 0 && (W.h - rn) * v < 3) continue;
          const born = animated ? W.t + 0.3 + (Math.abs(x - cx) / D) * 5 + R() * 1.4 : -99;
          blooms.push({ x, v, layer: 2, ci: R() < 0.72 ? c1 : c2, s: (0.5 + R() * 0.45) * u * (1 + v * 1.3), born, sp: animated && R() < 0.3, done: !animated, world: true, ph: R() * TAU });
        }
      }
    }
    const Lm = LY[1];
    const sm = baseSpan(Lm, 2);
    if (sm) {
      const n = Math.round((sm[1] - sm[0]) / (9 * u) * q);
      const R = U.mulberry32(778);
      for (let k = 0; k < n; k++) {
        const x = sm[0] + R() * (sm[1] - sm[0]);
        const born = animated ? W.t + 0.8 + (Math.abs(x - cx) / W.w) * 5 + R() * 1.4 : -99;
        blooms.push({ x, v: 0, layer: 1, ci: (R() * 4) | 0, s: (0.6 + R() * 0.5) * u * 0.6, born, sp: false, done: !animated, world: true, ph: R() * TAU });
      }
    }
    trimBlooms();
  }

  // ════════════════════════════════════════════════════════════
  //  更新
  // ════════════════════════════════════════════════════════════
  // 旱地出水：水从地上泻下（自己的水痕），脊上溅起水花，水线处翻起白沫
  const drops = [];
  const MAXD = 420;
  // 近岸的海岸坡（左侧斜下入海的一段）：|坡度| 大的地方
  function coastI(L) {
    if (L.coast && L.coast.pv === L.pv) return L.coast;
    const idx = [];
    for (let i = Math.max(1, L.spanA); i < Math.min(L.n - 1, L.spanB); i++) {
      const y = L.cur[i];
      if (y >= L.wl - 1 || y > W.h + 2) continue;
      const sl = (L.cur[i - 1] - L.cur[i + 1]) / (2 * L.step);
      if (sl > 0.45) idx.push(i);
    }
    L.coast = { pv: L.pv, idx };
    return L.coast;
  }
  function emitRise(L, dt) {
    const e = L.rise;
    const active = e > 0 && e < 1;
    if ((!active && L.wet < 0.05) || L.spanA < 0) return;
    const q = W.quality || 1, u = uu();
    const ls = [0.45, 0.7, 1][L.i];
    const k = active ? 0.35 + 0.65 * Math.sin(Math.PI * e) : L.wet * 0.35;
    // 水痕：自脊上泻下，直到水线（近岸：自海岸坡落入海中，或在脊下滑一小段）
    // （远 / 中丘的水帘由 drawWet 的流动纹理画出；近岸的海岸坡上，水一缕缕落回海中）
    const coast = L.i === 2 ? coastI(L).idx : null;
    if (coast && coast.length) {
      L.emitAcc += 70 * q * k * dt;
      let guard = 0;
      while (L.emitAcc >= 1 && guard++ < 40) {
        L.emitAcc -= 1;
        if (drops.length >= MAXD) break;
        const x = coast[(Math.random() * coast.length) | 0] * L.step + rnd(-L.step, L.step);
        const y = ridgeAt(L, x);
        if (y >= L.wl - 2 || y > W.h) continue;
        drops.push({ x, y: y + rnd(0, 2), vy: rnd(10, 40) * u, g: rnd(220, 320) * u, y1: Math.min(W.h + 4, y + rnd(14, 70) * u), layer: 2, len: rnd(0.7, 1.4) });
      }
    }
    if (!active || !fxOK()) return;
    const pass = L_PASS[L.i];
    // 脊上溅起的水花（加光的小点，像碎银）
    if (Math.random() < dt * [8, 16, 26][L.i] * q * k) {
      const i = L.spanA + ((Math.random() * (L.spanB - L.spanA + 1)) | 0);
      const x = i * L.step, y = ridgeAt(L, x);
      if (y < L.wl - 1) {
        GS.fx.add({ x, y, vx: rnd(-22, 22) * ls, vy: rnd(-110, -40) * ls, max: rnd(0.6, 1.3), size: rnd(0.5, 1.1) * Math.max(0.7, u) * (0.6 + 0.4 * ls),
          c: [236, 246, 255], a: 0.85, drag: 0.6, grav: 280 * ls * u, pass });
      }
    }
    // 水线处翻涌的浪沫
    if (Math.random() < dt * 12 * q * k) {
      let x, yb;
      if (L.i === 2) {
        if (!coast || !coast.length) return;
        const i = coast[(Math.random() * coast.length) | 0];
        x = i * L.step; yb = Math.min(W.h - 2, L.cur[i]);
      } else { const i = L.spanA + ((Math.random() * (L.spanB - L.spanA + 1)) | 0); x = i * L.step; yb = L.wl; }
      GS.fx.add({ x, y: yb, vx: rnd(-40, 40) * ls, vy: rnd(-60, -20) * ls, max: rnd(0.5, 1.1), size: rnd(0.8, 1.6) * ls * Math.max(0.7, u),
        c: [230, 242, 255], a: 0.75, drag: 1.4, grav: 160 * ls, pass });
    }
  }
  function updDrops(dt) {
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      d.vy += d.g * dt;
      d.y += d.vy * dt;
      if (d.y >= d.y1) {
        // 落进海里的一点水花
        if (d.layer < 2 && fxOK() && Math.random() < 0.12) {
          GS.fx.add({ x: d.x, y: d.y1, vx: rnd(-12, 12), vy: rnd(-26, -8), max: rnd(0.3, 0.6), size: 0.7 * Math.max(0.6, uu()),
            c: [226, 240, 255], a: 0.6, drag: 1, grav: 90, pass: L_PASS[d.layer] });
        }
        drops[i] = drops[drops.length - 1]; drops.pop();
      }
    }
  }
  function drawDrops(ctx, L) {
    if (!drops.length) return;
    const ls = [0.45, 0.7, 1][L.i], u = uu();
    const p = new Path2D();
    let n = 0;
    for (const d of drops) {
      if (d.layer !== L.i) continue;
      const len = Math.min(d.vy * 0.05, 16 * ls * u) * d.len + 1.2 * ls;
      p.moveTo(d.x, d.y - len); p.lineTo(d.x, d.y);
      n++;
    }
    if (!n) return;
    const c = mix(W.shade([200, 226, 250], depthOf(L.i) * 0.5, 0.35), W.haze, 0.15);
    ctx.lineCap = 'round';
    ctx.lineWidth = (0.55 + 0.6 * ls) * Math.max(0.7, u);
    ctx.strokeStyle = css(c, 0.5 * W.lv.light);
    ctx.stroke(p);
    ctx.lineCap = 'butt';
  }

  function emitFronts(dt) {
    if (!fxOK()) return;
    const q = W.quality || 1, u = uu();
    const g = W.lv.grass;
    if (g > 0 && g < 1) {
      for (let l = 0; l < 3; l++) {
        const L = LY[l];
        if (L.spanA < 0) continue;
        const ls = [0.4, 0.62, 1][l];
        const R = FR.gR[l];
        if (R <= 0) continue;
        for (const dir of [-1, 1]) {
          const x = FR.gx + dir * R;
          if (x < 0 || x > W.w) continue;
          const y = ridgeAt(L, x);
          if (y >= L.wl - 1) continue;
          const n = Math.random() < [10, 22, 38][l] * q * dt ? 1 : 0;
          for (let k = 0; k < n; k++) {
            GS.fx.add({ x: x + rnd(-8, 8) * ls, y: y - rnd(0, 5) * ls, vx: dir * rnd(10, 45) * ls, vy: -rnd(18, 60) * ls,
              max: rnd(0.9, 1.8), size: rnd(0.7, 1.5) * ls * Math.max(0.7, u), c: [170, 226, 122], a: 0.85, drag: 1.5, grav: -6, pass: L_PASS[l] });
          }
          // 近岸：铺展面上也泛起绿光
          if (l === 2 && Math.random() < 16 * q * dt) {
            const v = Math.random() * 0.9, yy = y + v * (W.h - y);
            GS.fx.add({ x: x + rnd(-10, 10), y: yy, vx: dir * rnd(8, 30), vy: -rnd(10, 40), max: rnd(0.7, 1.4), size: rnd(0.7, 1.6) * Math.max(0.7, u),
              c: [150, 214, 110], a: 0.7, drag: 1.5, grav: -4, pass: 'near' });
          }
        }
      }
    }
    const h = W.lv.herbs;
    if (h > 0 && h < 1) {
      for (let l = 1; l < 3; l++) {
        const L = LY[l];
        if (L.spanA < 0) continue;
        for (const dir of [-1, 1]) {
          const x = FR.hx + dir * (FR.hR[l] - FR.feather);
          if (x < 0 || x > W.w || Math.random() > 8 * q * dt) continue;
          const y = ridgeAt(L, x);
          if (y >= L.wl - 1) continue;
          GS.fx.add({ x, y: y - rnd(2, 10) * (l === 2 ? 1 : 0.6), vx: rnd(-10, 10), vy: -rnd(10, 30), max: rnd(1, 2), size: rnd(0.7, 1.3) * Math.max(0.7, u),
            c: [236, 214, 140], a: 0.8, drag: 1.6, grav: -3, pass: L_PASS[l] });
        }
      }
    }
  }

  function updTrees() {
    const quiet = W.t < quietUntil;
    const u = uu();
    const ripeT = W.stage >= 24;
    for (const t of trees) {
      t.g = treeGrowth(t);
      const L = LY[t.layer];
      if (!quiet && fxOK() && t.g > t.pg && t.pg >= 0) {
        const y = ridgeAt(L, t.x);
        const pass = L_PASS[t.layer];
        const Hs = t.H * growScale(t.g);
        if (t.pg <= 0 && t.g > 0) GS.fx.sparkle(t.x, y - 3, t.layer === 2 ? 14 : 6, [200, 255, 180], 5 * u, pass);
        if (t.pg < 0.42 && t.g >= 0.42) GS.fx.sparkle(t.x, y + t.model.cy * Hs, t.layer === 2 ? 10 : 4, [214, 255, 190], Hs * 0.25, pass);
        if (t.pg < 0.86 && t.g >= 0.86) GS.fx.sparkle(t.x, y + t.model.cy * Hs, t.layer === 2 ? 12 : 5, [255, 214, 150], Hs * 0.28, pass);
      }
      t.pg = t.g;
      // 第六日的赐福之后：果子更熟、更多
      const want = ripeT && W.t >= t.ripeAt;
      if (want !== t.ripe) {
        t.ripe = want;
        if (want && !quiet && fxOK() && t.g > 0.5) {
          const y = ridgeAt(L, t.x) + t.model.cy * t.H;
          GS.fx.sparkle(t.x, y, t.layer === 2 ? 16 : 6, [255, 216, 150], t.H * 0.3, L_PASS[t.layer]);
        }
      }
      if (t.g >= 1 && t.bakeKey !== bakeKey(t)) queueBake(t);
    }
    if (ripeT && !ripeOn) {
      ripeOn = true;
      // 恢复存档时已瞬间对齐（ripeAt=0）；正常言说时自灵处向外依次成熟
      const cx = W.spirit.x;
      for (const t of trees) if (t.ripeAt === Infinity) t.ripeAt = quiet ? 0 : W.t + 0.6 + Math.abs(t.x - cx) / Math.max(1, W.w) * 3.5 + Math.random() * 0.5;
    } else if (!ripeT && ripeOn) {
      ripeOn = false;
      for (const t of trees) { t.ripeAt = Infinity; t.ripe = false; }
    }
  }

  function updDrift(dt) {
    const u = uu();
    // 杏花瓣随风飘落
    if (W.lv.trees > 0.5 && drift.length < 70) {
      for (const t of trees) {
        if (t.kind !== 'almond' || t.g < 1) continue;
        if (Math.random() < dt * (t.layer === 2 ? 0.9 : 0.25) * (0.4 + 0.6 * W.dayFactor)) {
          const m = t.model, b = m.blooms[(Math.random() * m.blooms.length) | 0];
          if (!b) continue;
          const y = ridgeAt(LY[t.layer], t.x);
          drift.push({ x: t.x + b.x * t.H, y: y + b.y * t.H, vx: 0, vy: 0, life: 0, max: rnd(4, 7), c: KIND.almond.bloom[b.c % 3], s: (t.layer === 2 ? 1.4 : 0.8) * Math.max(0.6, u),
            layer: t.layer, gy: y + rnd(2, 10) * u, ph: Math.random() * TAU });
        }
      }
    }
    // 灵急掠菜蔬，种子被吹散
    const sp = W.spirit;
    if (sp.speed > 650 && W.lv.herbs > 0.3) {
      for (let l = 1; l < 3; l++) {
        for (const hb of LY[l].herbs) {
          if (hb.kind === 2 || hb.cool > W.t || Math.abs(hb.x - sp.x) > 50 * u) continue;
          const y = ridgeAt(LY[l], hb.x) - hb.h;
          if (Math.abs(y - sp.y) > 60 * u) continue;
          hb.cool = W.t + 1.2;
          for (let k = 0; k < 3 && drift.length < 90; k++) {
            drift.push({ x: hb.x, y, vx: sp.vx * 0.08 + rnd(-10, 10), vy: rnd(-25, -5), life: 0, max: rnd(2.5, 4), c: HERB.seed, s: (l === 2 ? 1.1 : 0.7) * Math.max(0.6, u),
              layer: l, gy: ridgeAt(LY[l], hb.x) + rnd(0, 6) * u, ph: Math.random() * TAU });
          }
        }
      }
    }
    for (let i = drift.length - 1; i >= 0; i--) {
      const p = drift[i];
      p.life += dt;
      if (p.life >= p.max) { drift.splice(i, 1); continue; }
      const w = windAt(p.x);
      p.vx += ((12 + w * 40) * u - p.vx) * Math.min(1, dt * 1.5);
      p.vy += ((10 + Math.sin(W.t * 2.2 + p.ph) * 8) * u - p.vy) * Math.min(1, dt * 1.2);
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.y > p.gy) { p.y = p.gy; p.vx *= 0.5; p.vy = 0; }
    }
  }

  function update(dt) {
    if (W.w !== lastW || W.h !== lastH) resize();
    if (!ready) return;
    if (Math.abs((W.quality || 1) - lastQ) > 0.01) {
      lastQ = W.quality || 1;
      for (const L of LY) { buildBlades(L); buildHerbs(L); }
    }
    for (const L of LY) {
      const before = L.rise;
      updRidge(L);
      // 旱地出水：浪花与湿润的光泽
      if (L.rise > 0 && L.rise < 1) L.wet = 1;
      else if (L.wet > 0) L.wet = Math.max(0, L.wet - dt / 6);
      if (!L.breached && L.rise > 0.04 && before >= 0 && before <= 0.04) {
        L.breached = true;
        if (W.t >= quietUntil && L.spanA >= 0) {
          let mi = L.spanA;
          for (let i = L.spanA; i <= L.spanB; i++) if (L.cur[i] < L.cur[mi]) mi = i;
          GS.bus.emit('splash', { x: mi * L.step, y: L.i === 2 ? W.h : L.wl, size: 2 + L.i * 2 });
        }
      }
      if (L.rise <= 0) L.breached = false;
      if (W.t >= quietUntil) emitRise(L, dt);
    }
    // 树的原点换了（新的话语），重新布局
    const ot = W.origin.trees;
    if (ot && ot !== treeOrigin) {
      treeOrigin = ot;
      treeOxN = clamp(ot.x / Math.max(1, W.w), 0, 1);
      layoutTrees();
    }
    updFronts();
    updGust();
    updLight();
    if (W.t >= quietUntil) emitFronts(dt);
    updTrees();
    if (PROF.on) { pf('snaps', () => processSnaps(0.3)); pf('bakes', () => processBakes(0.45)); }
    else { processSnaps(0.3); processBakes(0.45); }
    updDrift(dt);
    updDrops(dt);
    // 赐福第六日：遍地开花
    if (W.stage >= 24 && !worldBloomed && W.lv.grass > 0.5) worldBloom(W.spirit.x, W.t >= quietUntil);
    if (W.stage < 24 && worldBloomed) { worldBloomed = false; for (let i = blooms.length - 1; i >= 0; i--) if (blooms[i].world) blooms.splice(i, 1); }
    // 花开的火花
    if (fxOK()) {
      for (const b of blooms) {
        if (!b.done && W.t >= b.born) {
          b.done = true;
          if (b.sp || Math.random() < 0.25) {
            const p = bloomPos(b);
            if (p) GS.fx.sparkle(p[0], p[1], b.sp ? 4 : 2, FLOWER[b.ci], 3, L_PASS[b.layer]);
          }
        }
      }
    }
  }

  function bloomPos(b) {
    const L = LY[b.layer];
    const r = ridgeAt(L, b.x);
    if (r >= L.wl - 1) return null;
    return [b.x, b.v > 0 ? r + b.v * (W.h - r) : r + 1];
  }

  // ════════════════════════════════════════════════════════════
  //  绘制
  // ════════════════════════════════════════════════════════════
  function groundColors(L) {
    const d = depthOf(L.i);
    let soil = W.shade(SOIL[L.i], d), sod = W.shade(SOD[L.i], d);
    if (L.wet > 0) {
      // 湿土更深、略冷
      const k = 1 - 0.3 * L.wet;
      soil = mix(mul(soil, k), mul(W.haze, 0.3), 0.12 * L.wet); sod = mul(sod, k);
    }
    return [soil, sod];
  }

  function drawReflection(ctx, L) {
    if (L.i === 2 || L.spanA < 0) return;
    const cur = L.cur, st = L.step, wl = L.wl;
    const hmax = wl - L.minY;
    if (hmax < 1) return;
    const k = L.i === 0 ? 0.85 : 0.7;
    const [soil, sod] = groundColors(L);
    const c = mix(soil, sod, FR.grassAll ? 1 : c01(W.lv.grass));
    const rc = mix(mul(c, 0.72), W.haze, 0.25);
    const g = ctx.createLinearGradient(0, wl, 0, wl + hmax * k);
    const a0 = L.i === 0 ? 0.34 : 0.42;
    g.addColorStop(0, css(rc, a0 * W.lv.light));
    g.addColorStop(1, css(rc, 0));
    const i0 = Math.max(0, L.spanA - 1), i1 = Math.min(L.n - 1, L.spanB + 1);
    const t = W.t;
    ctx.beginPath();
    ctx.moveTo(i0 * st, wl);
    for (let i = i0; i <= i1; i += (i + 2 <= i1 ? 2 : 1)) {
      const hgt = cur[i] < wl ? wl - cur[i] : 0;
      ctx.lineTo(i * st + Math.sin(t * 1.3 + i * 0.7) * 0.6, wl + hgt * k * (1 + 0.05 * Math.sin(t * 0.9 + i * 0.31)));
    }
    ctx.lineTo(i1 * st, wl);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }

  // 地形的路径：只在升起的过程中每帧重建，其余时候缓存
  function landPaths(L) {
    if (L.pk === L.pv && L.P) return L.P;
    L.pk = L.pv;
    const cur = L.cur, st = L.step, wl = L.wl;
    const i0 = Math.max(0, L.spanA - 1), i1 = Math.min(L.n - 1, L.spanB + 1);
    const yb = L.i === 2 ? Math.max(wl, W.h + 12) : wl;
    const bot = L.i === 2 ? W.h : wl;
    const land = new Path2D();
    land.moveTo(i0 * st, yb);
    for (let i = i0; i <= i1; i++) land.lineTo(i * st, cur[i] < wl ? cur[i] : wl);
    land.lineTo(i1 * st, yb);
    land.closePath();
    // 褶皱（隔点采样即可，线条本就平缓）
    const folds = [], rims = [];
    for (let k = 0; k < L.folds.length; k++) {
      const f = L.folds[k];
      const fp = new Path2D(), rp = new Path2D();
      fp.moveTo(i0 * st, bot + 2);
      let pen = false;
      for (let i = i0; i <= i1; i += (i + 2 <= i1 ? 2 : 1)) {
        const r = cur[i] < wl ? cur[i] : wl;
        const y = r + f[i] * Math.max(0, bot - r);
        fp.lineTo(i * st, y);
        if (cur[i] >= wl - 1 || bot - y < 2) { pen = false; continue; }
        if (!pen) { rp.moveTo(i * st, y); pen = true; } else rp.lineTo(i * st, y);
      }
      fp.lineTo(i1 * st, bot + 2);
      fp.closePath();
      folds.push(fp); rims.push(rp);
    }
    // 脊线（开口的折线，湿亮与水沫用）
    const ridge = new Path2D();
    let pen = false;
    for (let i = i0; i <= i1; i++) {
      if (cur[i] >= wl - 0.5) { pen = false; continue; }
      if (!pen) { ridge.moveTo(i * st, cur[i]); pen = true; } else ridge.lineTo(i * st, cur[i]);
    }
    L.P = { land, folds, rims, ridge };
    L.rk = '';
    return L.P;
  }

  // 青草的前沿：不是一道竖直的色带，而是沿着地面蔓延的一条参差的边——
  // 脊上跑在前面，坡下略迟；边缘随推进而起伏。三层由外而内叠出柔和的过渡。
  function frontLag(v) { return v * v * FR.feather * 2.4; }
  function drawGreenFront(ctx, L, P, sod) {
    const R = FR.gR[L.i], ox = FR.gx, f = FR.feather;
    if (R + f * 0.8 <= 0) return;
    const top = L.minY - 3, bot = (L.i === 2 ? W.h : L.wl) + 2;
    const hgt = Math.max(1, bot - top);
    const n = L.i === 2 ? 22 : 10;
    const wob = f * 0.6, sd = L.i * 7.3;
    ctx.save();
    ctx.clip(P.land);
    const OFF = [[0.75, 0.3], [0, 0.5], [-0.75, 1]];
    for (const [o, a] of OFF) {
      const r0 = R + o * f;
      ctx.beginPath();
      for (let k = 0; k <= n; k++) {
        const y = top + (k / n) * hgt, v = (y - top) / hgt;
        const xr = ox + r0 - frontLag(v) + U.noise1(y * 0.05 + sd + R * 0.013) * wob;
        k ? ctx.lineTo(Math.max(ox, xr), y) : ctx.moveTo(Math.max(ox, xr), y);
      }
      for (let k = n; k >= 0; k--) {
        const y = top + (k / n) * hgt, v = (y - top) / hgt;
        const xl = ox - r0 + frontLag(v) - U.noise1(y * 0.05 + sd + 40 - R * 0.011) * wob;
        ctx.lineTo(Math.min(ox, xl), y);
      }
      ctx.closePath();
      ctx.fillStyle = css(sod, a);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGround(ctx, L) {
    if (L.spanA < 0) return;
    const P = landPaths(L);
    const [soil, sod] = groundColors(L);
    // 主色：生土 → 青草（随绿潮）
    const gl = W.lv.grass;
    ctx.fillStyle = css(gl > 0 && FR.grassAll ? sod : soil);
    ctx.fill(P.land);
    if (gl > 0 && !FR.grassAll) drawGreenFront(ctx, L, P, sod);
    // 褶皱：更近的山脊，略暗，顶上一线微光
    const alpha = [0.07, 0.1, 0.12][L.i];
    const sun = FL.sun;
    const rimA = (sun.a * 0.42 + FL.moon.a * 0.22) * [0.4, 0.5, 0.5][L.i];
    const rimC = sun.a > FL.moon.a ? sun.col : FL.moon.col;
    for (let k = 0; k < P.folds.length; k++) {
      ctx.fillStyle = 'rgba(6,10,6,' + (alpha * (1 + k * 0.4)).toFixed(3) + ')';
      ctx.fill(P.folds[k]);
      if (rimA > 0.02) {
        ctx.strokeStyle = css(rimC, rimA * (1 - k * 0.3));
        ctx.lineWidth = L.i === 2 ? 1.1 : 0.8;
        ctx.stroke(P.rims[k]);
      }
    }
    // 远处与中丘：山脚没入水汽；近岸：向下渐暗
    const bot = L.i === 2 ? W.h : L.wl;
    const top = Math.min(L.minY, bot - 2);
    const og = ctx.createLinearGradient(0, top, 0, bot);
    if (L.i === 2) {
      // 坡顶受光，向下渐入阴影
      const sa = FL.sun.a;
      og.addColorStop(0, css(FL.sun.col, 0.1 * sa));
      og.addColorStop(0.22, css(FL.sun.col, 0));
      og.addColorStop(0.45, 'rgba(4,6,4,0.1)');
      og.addColorStop(1, 'rgba(4,6,4,0.4)');
    } else {
      const hz = W.haze, a = L.i === 0 ? 0.6 : 0.14;
      og.addColorStop(0, css(hz, 0));
      og.addColorStop(0.55, css(hz, a * 0.25));
      og.addColorStop(1, css(hz, a));
    }
    ctx.fillStyle = og;
    ctx.fill(P.land);
    if (L.wet > 0.02) drawWet(ctx, L, P, top, bot);
  }

  // 水帘的纹理：一缕缕竖直的细水痕（白，带透明渐变），上下左右无缝平铺
  let STREAK = null, STREAK_PAT = null;
  const SK_W = 96, SK_H = 160;
  function makeStreaks() {
    const c = document.createElement('canvas');
    c.width = SK_W; c.height = SK_H;
    const g = c.getContext('2d');
    const R = U.mulberry32(99);
    g.lineCap = 'round';
    for (let i = 0; i < 64; i++) {
      const x = R() * SK_W, y = R() * SK_H, len = 14 + R() * 60, a = 0.12 + R() * 0.45, lw = 0.5 + R() * 1.1, dx = (R() - 0.5) * 1.5;
      for (const ox of [0, -SK_W, SK_W]) for (const oy of [0, -SK_H]) {
        const x0 = x + ox, y0 = y + oy;
        if (x0 < -3 || x0 > SK_W + 3 || y0 > SK_H || y0 + len < 0) continue;
        const gr = g.createLinearGradient(0, y0, 0, y0 + len);
        gr.addColorStop(0, 'rgba(255,255,255,0)');
        gr.addColorStop(0.75, 'rgba(255,255,255,' + a.toFixed(3) + ')');
        gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.strokeStyle = gr; g.lineWidth = lw;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0 + dx, y0 + len); g.stroke();
      }
    }
    return c;
  }

  // 刚出水的地：一层水帘自脊上泻下（纹理向下流动），随地晾干而变薄；脊上湿亮
  function drawWet(ctx, L, P, top, bot) {
    const w = L.wet, lit = W.lv.light;
    if (lit <= 0.01) return;
    const u = uu(), ls = [0.45, 0.7, 1][L.i];
    const d = depthOf(L.i);
    const glint = W.shade([226, 240, 255], d * 0.5, 0.4);
    ctx.save();
    ctx.clip(P.land);
    // 水帘
    if (!STREAK) { STREAK = makeStreaks(); STREAK_PAT = null; }
    if (!STREAK_PAT) { try { STREAK_PAT = ctx.createPattern(STREAK, 'repeat'); } catch (e) { STREAK_PAT = null; } }
    if (STREAK_PAT) {
      const sc = ls * Math.max(0.6, u);
      const e = L.rise;
      const flow = (e > 0 && e < 1 ? 0.55 + 0.45 * Math.sin(Math.PI * e) : 0.55) * w;
      // 近岸：水帘只在脊下一段（其下是向我们铺开的地面）
      const H1 = L.i === 2 ? (bot - top) * 0.42 : bot - top;
      const off = ((W.t * 70 * sc) % (SK_H * sc) + SK_H * sc) % (SK_H * sc);
      ctx.fillStyle = STREAK_PAT;
      const bands = L.i === 2 ? [[0, 0.55], [0.5, 0.3], [0.8, 0.12]] : [[0, 0.55]];
      for (const [f0, a] of bands) {
        const y0 = top + H1 * f0, y1 = L.i === 2 ? top + H1 * (f0 === 0 ? 0.5 : f0 === 0.5 ? 0.8 : 1) : bot;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, y0, W.w, y1 - y0); ctx.clip();
        ctx.translate(0, top - SK_H * sc + off);
        ctx.scale(sc, sc);
        ctx.globalAlpha = c01(a * flow * lit * (0.35 + 0.65 * W.daylight));
        ctx.fillRect(0, 0, W.w / sc, (bot - top) / sc + SK_H * 2);
        ctx.restore();
      }
    }
    // 脊上的湿亮：一道贴着脊线、向下渐隐的天光
    ctx.lineJoin = 'round';
    ctx.strokeStyle = css(glint, 0.12 * w * lit);
    ctx.lineWidth = 9 * ls;
    ctx.stroke(P.ridge);
    ctx.strokeStyle = css(glint, 0.24 * w * lit);
    ctx.lineWidth = 3.5 * ls;
    ctx.stroke(P.ridge);
    ctx.restore();
    ctx.lineJoin = 'miter';
  }

  // 出水时水线处翻腾的白沫：一串起伏的浪花（远 / 中丘在水线；近岸在海岸坡）
  function drawFroth(ctx, L) {
    const w = L.wet;
    if (w < 0.03 || L.spanA < 0) return;
    const e = L.rise;
    const k = (e > 0 && e < 1 ? 0.45 + 0.55 * Math.sin(Math.PI * e) : 0.45) * w;
    const u = uu(), ls = [0.45, 0.7, 1][L.i], t = W.t;
    const fc = W.shade(FOAM, depthOf(L.i) * 0.5, 0.45);
    const p = new Path2D();
    const cur = L.cur, st = L.step, wl = L.wl;
    let n = 0;
    const bub = (x, y, i) => {
      const nv = 0.5 + 0.5 * U.noise1(x * 0.045 + t * 1.3 + L.i * 5);
      const r = (0.8 + 3.4 * nv * nv) * ls * Math.max(0.7, u) * (0.5 + 0.5 * k);
      const yy = y - r * 0.3 - (0.5 + 0.5 * Math.sin(t * 4.2 + i * 1.7)) * r * 0.6;
      p.moveTo(x + r, yy); p.arc(x, yy, r, 0, TAU); n++;
      // 浪头上再翻起一小团
      if (nv > 0.55) { const r2 = r * 0.62, y2 = yy - r * (0.7 + 0.5 * Math.sin(t * 3.1 + i)); p.moveTo(x + r2 + r * 0.3, y2); p.arc(x + r * 0.3, y2, r2, 0, TAU); }
    };
    if (L.i < 2) {
      const stp = Math.max(1, Math.round(3.5 * ls / st));
      for (let i = L.spanA; i <= L.spanB; i += stp) if (cur[i] < wl - 0.5) bub(i * st, wl, i);
    } else {
      const ci = coastI(L).idx;
      for (let j = 0; j < ci.length; j++) { const i = ci[j]; bub(i * st, Math.min(W.h + 2, cur[i]) + 2, i); }
    }
    if (!n) return;
    ctx.fillStyle = css(fc, 0.8 * k * W.lv.light);
    ctx.fill(p);
  }

  // 脊线描光的路径：朝光 / 背光两段；光走过几像素或大地变了才重建
  function rimPaths(L, lt, key) {
    const cur = L.cur, st = L.step, wl = L.wl;
    const i0 = L.spanA, i1 = Math.min(L.n - 1, L.spanB + 1);
    const lit = new Path2D(), dim = new Path2D();
    const lx = lt.x, ly = lt.y;
    let pen0 = false, pen1 = false;
    for (let i = i0; i < i1; i++) {
      const y0 = cur[i], y1 = cur[i + 1];
      if (y0 >= wl - 0.5 || y1 >= wl - 0.5) { pen0 = pen1 = false; continue; }
      const dx = st, dy = y1 - y0, l = Math.hypot(dx, dy);
      const nx = dy / l, ny = -dx / l;
      let vx = lx - (i + 0.5) * st, vy = ly - (y0 + y1) * 0.5;
      const vl = Math.hypot(vx, vy) || 1; vx /= vl; vy /= vl;
      if (nx * vx + ny * vy > 0.3) {
        if (!pen0) { lit.moveTo(i * st, y0 - 0.3); pen0 = true; }
        lit.lineTo((i + 1) * st, y1 - 0.3); pen1 = false;
      } else {
        if (!pen1) { dim.moveTo(i * st, y0 - 0.3); pen1 = true; }
        dim.lineTo((i + 1) * st, y1 - 0.3); pen0 = false;
      }
    }
    return { key, lit, dim };
  }

  // 脊线的描光：朝光的一段亮，背光的一段淡
  function drawRims(ctx, L) {
    if (L.spanA < 0) return;
    landPaths(L);
    const cur = L.cur, st = L.step, wl = L.wl;
    const lw = [0.9, 1.15, 1.4][L.i];
    const i0 = L.spanA, i1 = Math.min(L.n - 1, L.spanB + 1);
    if (!L.RP) L.RP = {};
    const lights = [['s', FL.sun], ['m', FL.moon]];
    for (const [nm, lt] of lights) {
      if (!lt || lt.a < 0.03) continue;
      const key = L.pv + '|' + Math.round(lt.x / 6) + '|' + Math.round(lt.y / 6);
      let rp = L.RP[nm];
      if (!rp || rp.key !== key) rp = L.RP[nm] = rimPaths(L, lt, key);
      let a = lt.a * [0.7, 0.85, 1][L.i];
      if (L.wet > 0) a = Math.min(1, a + 0.35 * L.wet);
      const col = L.wet > 0 ? mix(lt.col, [220, 238, 255], L.wet * 0.6) : lt.col;
      ctx.lineWidth = lw;
      ctx.strokeStyle = css(col, a); ctx.stroke(rp.lit);
      ctx.strokeStyle = css(col, a * 0.3); ctx.stroke(rp.dim);
    }
    // 灵：夜里唯一的灯，照亮它身边的山脊
    const S = FL.sp;
    if (S.a > 0.03) {
      const iA = Math.max(i0, Math.floor((S.x - S.R) / st)), iB = Math.min(i1, Math.ceil((S.x + S.R) / st));
      if (iB > iA) {
        const ry = ridgeAt(L, clamp(S.x, 0, W.w));
        if (Math.abs(ry - S.y) < S.R * 1.3) {
          ctx.beginPath();
          let pen = false;
          for (let i = iA; i <= iB; i++) {
            const y = cur[i];
            if (y >= wl - 0.5) { pen = false; continue; }
            if (!pen) { ctx.moveTo(i * st, y - 0.3); pen = true; } else ctx.lineTo(i * st, y - 0.3);
          }
          const g = ctx.createRadialGradient(S.x, S.y, 0, S.x, S.y, S.R);
          const a = S.a * [0.55, 0.8, 1][L.i];
          g.addColorStop(0, css([200, 226, 255], a));
          g.addColorStop(0.45, css(RIM_SPIRIT, a * 0.45));
          g.addColorStop(1, css(RIM_SPIRIT, 0));
          ctx.strokeStyle = g;
          ctx.lineWidth = lw + 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // 岸边呼吸的白沫
  function drawFoam(ctx, L) {
    if (L.spanA < 0) return;
    const t = W.t, u = uu();
    const br = 0.5 + 0.5 * Math.sin(t * 0.698 + L.i * 1.7);
    const d = depthOf(L.i);
    const fc = W.shade(FOAM, d * 0.6, 0.4);
    const lit = W.lv.light;
    const cur = L.cur, st = L.step, wl = L.wl;
    if (L.i < 2) {
      const ls = L.i === 0 ? 0.45 : 0.75;
      const baseA = lit * ((L.i === 0 ? 0.24 : 0.3) * (0.6 + 0.4 * br) + 0.3 * L.wet);
      // 一线连续的细沫
      ctx.beginPath();
      let pen = false;
      for (let i = L.spanA; i <= L.spanB; i += 2) {
        const x = i * st;
        if (cur[i] >= wl - 0.4) { pen = false; continue; }
        if (!pen) { ctx.moveTo(x, wl - 0.2); pen = true; } else ctx.lineTo(x, wl - 0.2);
      }
      ctx.lineWidth = (L.i === 0 ? 0.7 : 0.9) + (L.wet > 0 ? L.wet * 0.8 : 0);
      ctx.strokeStyle = css(fc, baseA);
      ctx.stroke();
      // 其上一簇簇较亮的浪花，随潮缓缓漂移、呼吸
      ctx.beginPath();
      pen = false;
      for (let i = L.spanA; i <= L.spanB; i += 2) {
        const x = i * st;
        const on = cur[i] < wl - 0.4 && U.noise1(x * 0.022 + t * 0.12 + L.i * 13) > 0.2 - 0.25 * br;
        if (!on) { pen = false; continue; }
        if (!pen) { ctx.moveTo(x, wl - 0.2); pen = true; } else ctx.lineTo(x, wl - 0.2 + Math.sin(x * 0.3 + t) * 0.25);
      }
      // 海滩：地与水相交之处，浪舌一进一退
      const laps = [];
      for (let i = Math.max(1, L.spanA); i <= Math.min(L.n - 1, L.spanB + 1); i++) {
        const a = cur[i - 1] < wl - 0.3, b = cur[i] < wl - 0.3;
        if (a !== b) laps.push([(i - 0.5) * st, b ? -1 : 1]);
      }
      for (const lp of laps) {
        const len = (4 + 9 * br) * ls * u;
        ctx.moveTo(lp[0] - lp[1] * 1.5, wl - 0.2);
        ctx.lineTo(lp[0] + lp[1] * len, wl - 0.2);
        const b2 = 0.5 + 0.5 * Math.sin(t * 0.698 + 2.2 + L.i);
        ctx.moveTo(lp[0] + lp[1] * 1, wl + 1.6 * ls);
        ctx.lineTo(lp[0] + lp[1] * (2 + 7 * b2) * ls * u, wl + 1.6 * ls);
      }
      ctx.lineCap = 'round';
      ctx.lineWidth = (L.i === 0 ? 0.9 : 1.35) * (0.85 + 0.3 * br) + (L.wet > 0 ? L.wet * 0.8 : 0);
      ctx.strokeStyle = css(fc, Math.min(1, baseA * 1.25 + 0.06 * lit));
      ctx.stroke();
      ctx.lineCap = 'butt';
    } else {
      // 近岸的斜坡：一道道水平的浪线在坡脚拍岸
      const yTop = W.h * 0.905;
      if (cur[L.spanA] > W.h + 30 && L.spanA > 0) { /* 坡脚在屏外 */ }
      for (let k = 0; k < 7; k++) {
        const y = W.h + 1 - Math.pow(k / 6, 1.3) * (W.h + 1 - yTop);
        // 由左向右找到坡面在此高度的 x
        let xe = -1;
        for (let i = Math.max(1, L.spanA - 1); i <= L.spanB; i++) {
          if (cur[i] < y) {
            const y0 = cur[i - 1], y1 = cur[i];
            xe = (i - 1 + (y0 - y) / Math.max(0.001, y0 - y1)) * st;
            break;
          }
        }
        if (xe < 0 || xe > W.w * 0.9) continue;
        const sc = (0.55 + 0.45 * (y - yTop) / (W.h - yTop)) * u;
        const b = 0.5 + 0.5 * Math.sin(t * 0.9 - k * 0.85);
        const len = (4 + 16 * b) * sc;
        const fade = sstep(yTop, W.h * 0.97, y);
        ctx.beginPath();
        ctx.moveTo(xe - len, y);
        ctx.lineTo(xe + 1.5, y);
        ctx.lineWidth = (0.8 + 1.1 * sc) * (0.8 + 0.4 * b);
        ctx.lineCap = 'round';
        ctx.strokeStyle = css(fc, lit * fade * (0.12 + 0.4 * b + 0.3 * L.wet));
        ctx.stroke();
      }
      // 坡面下缘一线湿亮
      ctx.beginPath();
      let pen = false;
      for (let i = L.spanA; i <= L.spanB; i++) {
        const y = cur[i];
        if (y < W.h * 0.92 || y > W.h + 4) { if (pen) break; continue; }
        if (!pen) { ctx.moveTo(i * st, y); pen = true; } else ctx.lineTo(i * st, y);
      }
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = css(fc, lit * (0.22 + 0.18 * br + 0.3 * L.wet));
      ctx.stroke();
    }
  }

  // 远山的林木：细碎的纹理
  let texCache = null;
  function drawTexels(ctx) {
    const L = LY[0];
    if (!L.texels.length || W.lv.trees <= 0 || L.spanA < 0) return;
    const d = depthOf(0);
    const col = W.shade([24, 58, 40], d);
    const wl = L.wl, ox = FR.tx, R = FR.tR;
    const still = W.lv.trees >= 1 && L.rise >= 1;
    let P = still && texCache && texCache.pv === L.pv && texCache.n === L.texels.length ? texCache.p : null;
    if (!P) {
      P = new Path2D();
      for (const tx of L.texels) {
        const cv = W.lv.trees >= 1 ? 1 : cover(R, Math.abs(tx.x - ox));
        if (cv <= 0.02) continue;
        const r = ridgeAt(L, tx.x);
        if (r >= wl - 2) continue;
        const y = r + tx.v * (wl - r) + 0.5;
        const s = tx.s * cv;
        if (tx.spire) { P.moveTo(tx.x - s * 0.8, y + s * 0.4); P.lineTo(tx.x, y - s * 2.6); P.lineTo(tx.x + s * 0.8, y + s * 0.4); }
        else { P.moveTo(tx.x + s * 1.1, y - s * 0.6); P.ellipse(tx.x, y - s * 0.6, s * 1.1, s * 1.3, 0, 0, TAU); }
      }
      texCache = still ? { pv: L.pv, n: L.texels.length, p: P } : null;
    }
    ctx.fillStyle = css(col, 0.9);
    ctx.fill(P);
  }

  // 草叶：逐叶随风，灵低掠时向两边分开
  function drawBlades(ctx, L) {
    const n = L.nb;
    if (!n || W.lv.grass <= 0 || L.spanA < 0) return;
    const B = L.B, tmp = L.tmp, gi = L.glowIdx;
    const R = FR.gR[L.i], ox = FR.gx, gz = FR.gzone, all = FR.grassAll;
    const fTop = L.minY - 3, fInv = 1 / Math.max(1, (L.i === 2 ? W.h : L.wl) + 5 - L.minY);
    const t = W.t, sp = W.spirit, sx = sp.x, sy = sp.y;
    const u = uu();
    const Rb = 72 * Math.max(0.6, u);
    const push = 0.85 + Math.min(1, sp.speed / 600) * 0.9;
    const hold = W.ritual && W.ritual.holding ? W.ritual.charge : 0;
    const wl = L.wl, H = W.h, d = depthOf(L.i);
    const S = FL.sp, glowOn = S.a > 0.08 && W.night > 0.05, gR = 170 * Math.max(0.6, u);
    let ng = 0;
    // 色
    const bc = L.i === 2 ? [BLADE[2][0], BLADE[2][1], TUFT[0], TUFT[1]] : [BLADE[1][0], BLADE[1][1], BLADE[1][0], BLADE[1][1]];
    const rimW = c01(FL.ww * 1.3) * FL.sun.a;
    const cols = bc.map((c, k) => {
      let s = W.shade(c, d, k === 1 || k === 3 ? 0.06 : 0);
      if ((k === 1) && rimW > 0.05) s = mix(s, mix(FL.sun.col, s, 0.4), rimW * 0.55);
      return css(s);
    });
    const cur = L.cur, invSt = 1 / L.step, lastI = L.n - 1.001;
    const invG = 1 / gustStep, lastG = gust.length - 2.001;
    const calm = W.ritual && W.ritual.holding ? 1 - 0.7 * W.ritual.charge : 1;
    const w0 = W.wind * 0.3 * calm, gk = 0.5 * calm;
    // 草随风摇得缓：隔帧重建，其余帧沿用上一帧的路径（灵快速掠过这一层时，脊上的草每帧重建）
    const TC = L.tc;
    const band = sy > L.minY - Rb - 30 && sy < (L.i === 2 ? H : wl) + Rb;
    const fastNear = sp.speed > 150 && band;
    const canReuse = all && TC && TC.pv === L.pv && (W.frame & 1) === 1 && W.frame - TC.f <= 2 && TC.glowOn === glowOn;
    const glowFill = () => {
      const g = ctx.createRadialGradient(S.x, S.y, 0, S.x, S.y, gR);
      const a = S.a * W.night * (L.i === 2 ? 0.75 : 0.5);
      g.addColorStop(0, css([190, 220, 255], a));
      g.addColorStop(0.5, css(RIM_SPIRIT, a * 0.35));
      g.addColorStop(1, css(RIM_SPIRIT, 0));
      return g;
    };
    if (canReuse && !fastNear) {
      for (let k = 0; k < 4; k++) if (TC.p[k]) { ctx.fillStyle = cols[k]; ctx.fill(TC.p[k]); }
      if (TC.glow) { ctx.fillStyle = glowFill(); ctx.fill(TC.glow); }
      return;
    }
    const reuse = canReuse;           // 只沿用铺展面上的草簇
    let tone = -1, pth = null;
    const built = [null, null, null, null];
    const flush = () => {
      if (tone < 0) return;
      ctx.fillStyle = cols[tone];
      ctx.fill(pth); built[tone] = pth;
    };
    for (let i = 0; i < n; i++) {
      const tn = B.tone[i];
      if (tn !== tone) {
        flush();
        tone = tn;
        if (tn >= 2 && reuse) { tone = -1; break; }
        pth = new Path2D();
      }
      const x = B.x[i];
      let gr = 1;
      if (!all) {
        const dd = x > ox ? x - ox : ox - x;
        if (dd >= R) continue;
      }
      let f = x * invSt;
      if (f < 0) f = 0; else if (f > lastI) f = lastI;
      let ri = f | 0;
      const rid = cur[ri] + (cur[ri + 1] - cur[ri]) * (f - ri);
      if (rid >= wl - 0.8) continue;
      const v = B.v[i];
      const y = v > 0 ? rid + v * (H - rid) : rid + B.dy[i];
      if (!all) {
        // 与地面的绿潮同一条前沿：坡下略迟
        const vv = (y - fTop) * fInv;
        const Re = R - frontLag(vv < 0 ? 0 : vv > 1 ? 1 : vv);
        const dd = x > ox ? x - ox : ox - x;
        if (dd >= Re) continue;
        gr = dd < Re - gz ? 1 : (Re - dd) / gz;
        gr = gr * gr * (3 - 2 * gr);
      }
      let hh = B.h[i] * gr;
      if (hh < 0.4) continue;
      f = x * invG; if (f < 0) f = 0; else if (f > lastG) f = lastG;
      ri = f | 0;
      const gw = gust[ri] + (gust[ri + 1] - gust[ri]) * (f - ri);
      let bend = B.lean[i] + (w0 + gw * gk) * (v > 0 ? 0.55 : 1) + 0.075 * Math.sin(t * 2.4 + B.ph[i] + x * 0.013);
      const dx = x - sx;
      if (dx < Rb && dx > -Rb) {
        const dy = y - hh * 0.5 - sy;
        if (dy < Rb && dy > -Rb) {
          const dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < Rb) { const f = 1 - dd / Rb, ff = f * f; bend += (dx > 0 ? 1 : -1) * ff * push; hh *= 1 - 0.3 * ff; }
        }
      }
      if (hold > 0) { const k = 1 - Math.min(1, Math.abs(dx) / (W.w * 0.5)); bend -= (dx > 0 ? 1 : -1) * 0.16 * hold * k; }
      if (bend > 1.2) bend = 1.2; else if (bend < -1.2) bend = -1.2;
      const w = B.w[i];
      const tx = x + bend * hh, ty = y - hh * (1 - 0.3 * bend * bend);
      const cx = x + bend * hh * 0.32, cy = y - hh * 0.58;
      pth.moveTo(x - w, y);
      pth.quadraticCurveTo(cx - w * 0.35, cy, tx, ty);
      pth.quadraticCurveTo(cx + w * 0.35, cy, x + w, y);
      if (glowOn && tn < 2) {
        const gx = x - S.x, gy = y - S.y;
        if (gx < gR && gx > -gR && gy < gR && gy > -gR) {
          const o = i * 5;
          tmp[o] = y; tmp[o + 1] = tx; tmp[o + 2] = ty; tmp[o + 3] = cx; tmp[o + 4] = cy;
          gi[ng++] = i;
        }
      }
    }
    flush();
    if (reuse) { for (let k = 2; k < 4; k++) if (TC.p[k]) { ctx.fillStyle = cols[k]; ctx.fill(TC.p[k]); } }
    // 夜里，灵照亮它身边的草尖
    let glow = null;
    if (ng) {
      glow = new Path2D();
      for (let k = 0; k < ng; k++) {
        const i = gi[k], o = i * 5, x = B.x[i], w = B.w[i];
        glow.moveTo(x - w, tmp[o]);
        glow.quadraticCurveTo(tmp[o + 3] - w * 0.35, tmp[o + 4], tmp[o + 1], tmp[o + 2]);
        glow.quadraticCurveTo(tmp[o + 3] + w * 0.35, tmp[o + 4], x + w, tmp[o]);
      }
      ctx.fillStyle = glowFill();
      ctx.fill(glow);
    }
    if (!reuse && all) L.tc = { f: W.frame, pv: L.pv, p: built, glow, glowOn };
  }

  // 结种子的菜蔬：麦穗形、伞形、开花的
  function drawHerbs(ctx, L) {
    const hs = L.herbs;
    if (!hs.length || W.lv.herbs <= 0 || L.spanA < 0) return;
    // 菜蔬摇得缓：每四帧重建一次（两层错开）；生长中、或灵快速掠过这一层时每帧重建
    let G = L.hg;
    const sp = W.spirit;
    const fast = sp.speed > 150 && sp.y > L.minY - 90 * uu() && sp.y < (L.i === 2 ? W.h : L.wl) + 60;
    if (!G || !FR.herbAll || G.pv !== L.pv || G.n !== hs.length || fast || (W.frame + 2 * L.i) % 4 === 0 || W.frame - G.f > 4) {
      if (PROF.on) { const t0 = performance.now(); G = L.hg = buildHerbs2(L); PROF.t.hb = (PROF.t.hb || 0) + performance.now() - t0; PROF.t.nhb = (PROF.t.nhb || 0) + 1; } else G = L.hg = buildHerbs2(L);
    }
    const d = depthOf(L.i), u = uu(), near = L.i === 2;
    ctx.lineCap = 'round';
    if (G.nSt) { ctx.strokeStyle = css(W.shade(HERB.stem, d)); ctx.lineWidth = Math.max(0.6, (near ? 1.05 : 0.7) * u); ctx.stroke(G.st); }
    if (G.nLf) { ctx.fillStyle = css(W.shade(HERB.leaf, d)); ctx.fill(G.lf); }
    if (G.nSd) { ctx.fillStyle = css(W.shade(HERB.seed, d, 0.08)); ctx.fill(G.sd); }
    if (G.nBu) { ctx.fillStyle = css(W.shade(mix(HERB.leaf, [140, 120, 90], 0.4), d)); ctx.fill(G.bu); }
    for (let c = 0; c < 4; c++) if (G.pn[c]) { ctx.fillStyle = css(W.shade(FLOWER[c], d, 0.14)); ctx.fill(G.pe[c]); }
    if (G.nCe) { ctx.fillStyle = css(W.shade(HERB.ctr, d, 0.1)); ctx.fill(G.ce); }
    ctx.lineCap = 'butt';
  }
  function buildHerbs2(L) {
    const hs = L.herbs;
    const near = L.i === 2, u = uu();
    const R = FR.hR[L.i], ox = FR.hx, zone = 110 * u, all = FR.herbAll;
    const fTop = L.minY - 3, fInv = 1 / Math.max(1, (L.i === 2 ? W.h : L.wl) + 5 - L.minY);
    const t = W.t, sp = W.spirit;
    const Rb = 64 * Math.max(0.6, u), wl = L.wl, H = W.h;
    const df = W.dayFactor;
    const st = new Path2D(), lf = new Path2D(), sd = new Path2D(), ce = new Path2D(), bu = new Path2D();
    const pe = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    const pn = [0, 0, 0, 0];
    let nSt = 0, nLf = 0, nSd = 0, nCe = 0, nBu = 0;
    const hold = W.ritual && W.ritual.holding ? W.ritual.charge : 0;
    for (let k = 0; k < hs.length; k++) {
      const hb = hs[k];
      const rid = ridgeAt(L, hb.x);
      if (rid >= wl - 1) continue;
      const bx = hb.x, by = (hb.v > 0 ? rid + hb.v * (H - rid) : rid) + 1;
      let g = 1;
      if (!all) {
        const dd = Math.abs(hb.x - ox);
        g = c01((R - frontLag(c01((by - fTop) * fInv)) - dd) / zone - hb.dl);
      }
      if (g <= 0) continue;
      const gs = c01(g / 0.5), gl = c01((g - 0.3) / 0.4), gh = c01((g - 0.6) / 0.4);
      const s = hb.s;
      let bend = hb.lean + windAt(bx) * 0.45 + 0.05 * Math.sin(t * 1.9 + hb.ph);
      const dx = bx - sp.x, dy = by - hb.h * 0.6 - sp.y;
      if (Math.abs(dx) < Rb && Math.abs(dy) < Rb) {
        const dd = Math.hypot(dx, dy);
        if (dd < Rb) { const f = 1 - dd / Rb; bend += (dx > 0 ? 1 : -1) * f * f * 0.8; }
      }
      if (hold > 0) bend -= (dx > 0 ? 1 : -1) * 0.1 * hold;
      bend = clamp(bend, -0.9, 0.9);
      const hh = hb.h * gs;
      const tx = bx + bend * hh, ty = by - hh * (1 - 0.22 * bend * bend);
      const cx = bx + bend * hh * 0.25, cy = by - hh * 0.55;
      st.moveTo(bx, by); st.quadraticCurveTo(cx, cy, tx, ty); nSt++;
      // 叶
      if (gl > 0) {
        for (const lv of hb.leaves) {
          const q = lv[0] * gs, a = 1 - q;
          const px = a * a * bx + 2 * a * q * cx + q * q * tx, py = a * a * by + 2 * a * q * cy + q * q * ty;
          const ll = s * 5.2 * gl * lv[2];
          const ddx = lv[1] * 0.85 + bend * 0.4, ddy = -0.55;
          const nl = Math.hypot(ddx, ddy);
          const ux = ddx / nl, uy = ddy / nl;
          const ex = px + ux * ll, ey = py + uy * ll;
          const wx = -uy * ll * 0.28, wy = ux * ll * 0.28;
          lf.moveTo(px, py);
          lf.quadraticCurveTo(px + ux * ll * 0.5 + wx, py + uy * ll * 0.5 + wy, ex, ey);
          lf.quadraticCurveTo(px + ux * ll * 0.5 - wx, py + uy * ll * 0.5 - wy, px, py);
          nLf++;
        }
      }
      if (gh <= 0) continue;
      // 头
      let ux = tx - cx, uy = ty - cy;
      const ul = Math.hypot(ux, uy) || 1; ux /= ul; uy /= ul;
      if (hb.kind === 0) {
        // 麦穗：一枚纺锤形的穗，边缘一粒粒鼓起
        const len = s * 7.5 * gh, w = s * 1.5 * gh, m = 5;
        const bx0 = tx - ux * len * 0.15, by0 = ty - uy * len * 0.15;
        const px = -uy, py = ux;
        sd.moveTo(bx0, by0);
        for (let j = 1; j <= m; j++) {
          const q = j / m, k = (1 - q * q) * (j % 2 ? 1 : 0.72) + 0.12;
          sd.lineTo(bx0 + ux * len * q + px * w * k, by0 + uy * len * q + py * w * k);
        }
        sd.lineTo(bx0 + ux * len * 1.12, by0 + uy * len * 1.12);
        for (let j = m; j >= 1; j--) {
          const q = j / m, k = (1 - q * q) * (j % 2 ? 0.72 : 1) + 0.12;
          sd.lineTo(bx0 + ux * len * q - px * w * k, by0 + uy * len * q - py * w * k);
        }
        sd.closePath();
        nSd++;
      } else if (hb.kind === 1) {
        // 伞形：自茎顶散开的细梗，梗端一粒种子
        const n = hb.nSeed;
        for (let j = 0; j < n; j++) {
          const a = -Math.PI / 2 + bend * 0.6 + (j / (n - 1) - 0.5) * 2.1;
          const rl = s * 4 * gh;
          const ex = tx + Math.cos(a) * rl, ey = ty + Math.sin(a) * rl * 0.8;
          st.moveTo(tx, ty); st.lineTo(ex, ey);
          const r = Math.max(0.5, s * 0.8 * gh);
          sd.rect(ex - r, ey - r, r * 2, r * 2);
          nSd++;
        }
      } else {
        // 花：昼开夜合
        const open = c01((df - 0.28 - hb.off) / 0.3) * gh;
        const pr = s * 1.3 * (near ? 1 : 0.9);
        if (open < 0.18 || !near) {
          if (!near && open > 0.3) {
            const r = Math.max(0.6, pr * 0.9 * open);
            pe[hb.ci].moveTo(tx + r, ty); pe[hb.ci].arc(tx, ty, r, 0, TAU); pn[hb.ci]++;
          } else {
            const r = Math.max(0.5, pr * 0.55 * gh);
            bu.moveTo(tx - r * 0.7, ty); bu.quadraticCurveTo(tx, ty - r * 2.8, tx + r * 0.7, ty); bu.closePath(); nBu++;
          }
        } else {
          const p = pe[hb.ci];
          const pd = pr * 0.95 * open, rr = pr * (0.5 + 0.45 * open);
          if (pd + rr > 2.6) {
            for (let j = 0; j < 5; j++) {
              const a = j * 1.2566 + hb.ph;
              const px = tx + Math.cos(a) * pd, py = ty + Math.sin(a) * pd * 0.8;
              p.moveTo(px + rr, py); p.arc(px, py, rr, 0, TAU);
            }
          } else { p.moveTo(tx + pd + rr, ty); p.arc(tx, ty, pd + rr, 0, TAU); }
          pn[hb.ci]++;
          const cr = Math.max(0.45, pr * 0.4);
          ce.rect(tx - cr, ty - cr, cr * 2, cr * 2); nCe++;
        }
      }
    }
    return { st, lf, sd, ce, bu, pe, pn, nSt, nLf, nSd, nCe, nBu, pv: L.pv, n: hs.length, f: W.frame };
  }

  // 赐福开出的花
  const bloomG = [null, null, null];
  function drawBlooms(ctx, layer) {
    if (!blooms.length) return;
    const L = LY[layer];
    if (L.spanA < 0) return;
    const d = depthOf(layer), df = W.dayFactor, t = W.t;
    // 花贴着地，不必逐帧重建：只在新花绽开、昼夜开合或大地变化时重建
    let vis = 0, popping = false;
    for (const b of blooms) if (b.layer === layer && t >= b.born) { vis++; if (t < b.born + 0.6) popping = true; }
    if (!vis) return;
    const key = vis + '|' + L.pv + '|' + Math.round(df * 24);
    let G = bloomG[layer];
    if (!G || popping || G.key !== key) {
      const paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
      const cnt = [0, 0, 0, 0];
      const ce = new Path2D(); let nce = 0;
      const st = new Path2D(); let nst = 0;
      for (const b of blooms) {
        if (b.layer !== layer || t < b.born) continue;
        const p = bloomPos(b);
        if (!p) continue;
        const pop = eBack(c01((t - b.born) / 0.55));
        const open = 0.35 + 0.65 * c01((df - 0.25 - (b.ph % 0.3)) / 0.3);
        const s = b.s * pop;
        const r = Math.max(0.55, s * 1.2 * open);
        const x = p[0] + Math.sin(b.ph * 3) * s * 0.6, y = p[1] - s * 2.2;
        if (s > 1.15) { st.moveTo(p[0], p[1]); st.lineTo(x, y); nst++; }
        const P = paths[b.ci];
        if (r < 1.1) { P.rect(x - r, y - r, r * 2, r * 2); }
        else if (s > 1.9 && open > 0.6) {
          for (let j = 0; j < 5; j++) {
            const a = j * 1.2566 + b.ph;
            const px = x + Math.cos(a) * r * 0.85, py = y + Math.sin(a) * r * 0.7;
            P.moveTo(px + r * 0.62, py); P.arc(px, py, r * 0.62, 0, TAU);
          }
          ce.moveTo(x + r * 0.4, y); ce.arc(x, y, r * 0.4, 0, TAU); nce++;
        } else {
          P.moveTo(x + r, y); P.arc(x, y, r, 0, TAU);
        }
        cnt[b.ci]++;
      }
      G = bloomG[layer] = { key: popping ? '' : key, paths, cnt, ce, nce, st, nst };
    }
    if (G.nst) { ctx.strokeStyle = css(W.shade(HERB.stem, d)); ctx.lineWidth = Math.max(0.5, 0.7 * uu()); ctx.stroke(G.st); }
    for (let c = 0; c < 4; c++) if (G.cnt[c]) { ctx.fillStyle = css(W.shade(FLOWER[c], d, 0.16)); ctx.fill(G.paths[c]); }
    if (G.nce) { ctx.fillStyle = css(W.shade(HERB.ctr, d, 0.1)); ctx.fill(G.ce); }
  }

  // 树：长成后烘焙，按当下的光混合昼 / 晨昏 / 夜，随风轻摇
  function treeAngle(t, x, y) {
    const K = KIND[t.kind];
    let a = (windAt(x) * 0.026 + Math.sin(W.t * 0.8 + t.phase) * 0.004 + Math.sin(W.t * 1.9 + t.phase * 2) * 0.0015) * K.flex;
    const sp = W.spirit;
    const cy = y + t.model.cy * t.H;
    const dx = sp.x - x, dy = sp.y - cy, R = t.H * 0.7 + 30 * uu();
    if (Math.abs(dx) < R && Math.abs(dy) < R) {
      const d = Math.hypot(dx, dy);
      if (d < R) a += clamp(sp.vx / 2400, -1, 1) * 0.05 * (1 - d / R) * K.flex;
    }
    return a * c01(t.g * 1.5);
  }
  // 轮廓光四个方向的权重（左、右、上、下）；inside 0..1：光在冠中时四面皆亮
  const OW = [0, 0, 0, 0];
  function addRim(vx, vy, a, inside) {
    const l = Math.hypot(vx, vy) || 1;
    vx /= l; vy /= l;
    const e = inside * 0.45;
    OW[0] += a * Math.max(e, -vx); OW[1] += a * Math.max(e, vx);
    OW[2] += a * Math.max(e, -vy); OW[3] += a * Math.max(e, vy);
  }
  function drawTrees(ctx, layer) {
    const L = LY[layer];
    if (!L.trees.length || W.lv.trees <= 0 || L.spanA < 0) return;
    // 树下的一抹影子
    if (layer === 2 && W.daylight > 0.2) {
      ctx.beginPath();
      let n = 0;
      const sdx = clamp((W.w * 0.5 - W.core.x) / W.w, -0.5, 0.5);
      for (const t of L.trees) {
        if (t.g < 0.3) continue;
        const y = ridgeAt(L, t.x);
        if (y >= L.wl - 2) continue;
        const rx = t.model.cw * t.H * 0.32 * growScale(t.g) * c01(t.g * 3), ry = 2.2 * uu();
        const x = t.x + sdx * rx * 0.6;
        ctx.moveTo(x + rx, y + 2); ctx.ellipse(x, y + 2, rx, ry, 0, 0, TAU); n++;
      }
      if (n) { ctx.fillStyle = 'rgba(8,12,6,' + (0.2 * W.daylight).toFixed(3) + ')'; ctx.fill(); }
    }
    const S = FL.sp;
    for (const t of L.trees) {
      if (t.g <= 0) continue;
      const y0 = ridgeAt(L, t.x);
      if (y0 >= L.wl - 1) continue;
      const x = t.x, y = y0 + t.sink;
      const b = t.bake;
      if (b) {
        const bx0 = x + b.x0 - 4, bx1 = x + b.x0 + b.w + 4;
        if (bx1 < -10 || bx0 > W.w + 10) continue;
      }
      const ang = treeAngle(t, x, y);
      ctx.save();
      ctx.translate(x, y);
      if (ang) ctx.rotate(ang);
      if (t.g >= 1 && b && b.H === t.H) {
        const c = b.c;
        for (let k = 0; k < FL.order.length; k++) {
          const o = FL.order[k];
          ctx.globalAlpha = o[1];
          ctx.drawImage(c[o[0]], b.x0, b.y0, b.w, b.h);
        }
        // 轮廓光只在朝光的一侧：月自其方位，灵自其方位（夜里唯一的灯）
        const cyT = y + t.model.cy * t.H;
        OW[0] = OW[1] = OW[2] = OW[3] = 0;
        if (FL.moonO > 0.01) addRim(FL.moon.x - x, FL.moon.y - cyT, FL.moonO, 0);
        if (S.a > 0.05 && W.night > 0.05) {
          const dx = S.x - x, dy = S.y - cyT;
          const dd = Math.hypot(dx, dy);
          const RR = S.R * 0.8 + t.H * 0.5;
          if (dd < RR) {
            const f = 1 - dd / RR;
            addRim(dx, dy, W.night * S.a * (layer === 2 ? 0.85 : 0.6) * f * f, c01(1 - dd / (t.H * 0.45)));
          }
        }
        const rk = t.kind === 'palm' ? 0.55 : 1;      // 棕的羽叶细，整片都会被描亮：减半
        for (let k = 0; k < 4; k++) {
          const a = OW[k] * rk;
          if (a > 0.02) { ctx.globalAlpha = Math.min(1, a); ctx.drawImage(c['o' + k], b.x0, b.y0, b.w, b.h); }
        }
        ctx.globalAlpha = 1;
      } else if (t.snap && t.snap.H === t.H) {
        // 生长中（或烘焙尚未就绪）：快照按此刻的大小缩放
        const sn = t.snap, sc = growScale(t.g);
        if (sc !== 1) ctx.scale(sc, sc);
        ctx.drawImage(sn.img, sn.x0, sn.y0, sn.w, sn.h);
      } else {
        // 还没有快照（刚开始生长的第一帧）：现画
        let lx = W.core.x - x, ly = W.core.y - (y - t.H * 0.6);
        if (FL.sun.a < FL.moon.a) { lx = FL.moon.x - x; ly = FL.moon.y - y; }
        const P = treePal(t.kind, layer, 'live', t.ripe, lx, ly);
        paintTree(ctx, t.model, t.g, P, t.H * growScale(t.g), t.ripe);
      }
      ctx.restore();
    }
  }

  function drawDrift(ctx, layer) {
    if (!drift.length) return;
    let n = 0;
    ctx.beginPath();
    for (const p of drift) {
      if (p.layer !== layer) continue;
      const a = Math.sin(W.t * 3 + p.ph);
      ctx.rect(p.x - p.s * 0.5, p.y - p.s * 0.35 * (0.6 + 0.4 * a), p.s, p.s * 0.7);
      n++;
    }
    if (n) {
      ctx.fillStyle = css(W.shade([246, 222, 228], depthOf(layer), 0.2), 0.9);
      ctx.fill();
    }
  }

  function draw(ctx, pass) {
    const l = PASS_L[pass];
    if (l == null || !ready || W.lv.land <= 0) return;
    const L = LY[l];
    if (L.spanA < 0) return;
    if (PROF.on) { drawProf(ctx, l, L); return; }
    if (l < 2) drawReflection(ctx, L);
    drawGround(ctx, L);
    drawRims(ctx, L);
    if (l === 0) { drawTexels(ctx); drawDrops(ctx, L); drawFoam(ctx, L); drawFroth(ctx, L); return; }
    drawTrees(ctx, l);
    drawBlades(ctx, L);
    drawHerbs(ctx, L);
    drawBlooms(ctx, l);
    drawDrift(ctx, l);
    drawDrops(ctx, L);
    drawFoam(ctx, L);
    drawFroth(ctx, L);
  }
  // 与 draw 相同，但逐段计时（GS.land.prof.on = true 时）
  function drawProf(ctx, l, L) {
    if (l < 2) pf('refl', () => drawReflection(ctx, L));
    pf('ground', () => drawGround(ctx, L));
    pf('rims', () => drawRims(ctx, L));
    if (l === 0) { pf('texels', () => drawTexels(ctx)); pf('drops', () => drawDrops(ctx, L)); pf('foam', () => drawFoam(ctx, L)); pf('froth', () => drawFroth(ctx, L)); return; }
    pf('trees', () => drawTrees(ctx, l));
    pf('blades', () => drawBlades(ctx, L));
    pf('herbs', () => drawHerbs(ctx, L));
    pf('blooms', () => drawBlooms(ctx, l));
    pf('drift', () => drawDrift(ctx, l));
    pf('drops', () => drawDrops(ctx, L));
    pf('foam', () => drawFoam(ctx, L));
    pf('froth', () => drawFroth(ctx, L));
  }

  // ════════════════════════════════════════════════════════════
  //  生命周期
  // ════════════════════════════════════════════════════════════
  function resize() {
    lastW = W.w; lastH = W.h;
    if (!(W.w > 4 && W.h > 4)) { ready = false; return; }
    const n = clamp(Math.ceil(W.w / 4) + 1, 64, 521);
    for (const L of LY) {
      L.n = n; L.step = W.w / (n - 1);
      if (!L.base || L.base.length !== n) { L.base = new Float32Array(n); L.cur = new Float32Array(n); }
      for (let i = 0; i < n; i++) L.base[i] = W.ridgeBaseY(L.i, i * L.step);
      L.wl = W.waterlineY(L.i);
      L.dirty = true;
      L.sb = baseSpan(L, 0.5);
      buildFolds(L);
      updRidge(L);
    }
    ready = true;
    lastQ = W.quality || 1;
    for (const L of LY) { buildBlades(L); buildHerbs(L); }
    buildTexels();
    layoutTrees();
    // 花：按比例迁到新的尺寸
    if (worldBloomed) {
      for (let i = blooms.length - 1; i >= 0; i--) if (blooms[i].world) blooms.splice(i, 1);
      worldBloomed = false;
      worldBloom(W.w / 2, false);
    }
    updFronts(); updGust(); updLight();
  }

  function init() {
    GLOW = makeGlow();
    GS.bus.on('bless', e => U.safe('land.bless', () => onBless(e)));
    GS.bus.on('fulfill', e => U.safe('land.fulfill', () => {
      const st = e && e.stage;
      if (st && st.index === 23 && W.lv.grass > 0.5) worldBloom(e.x, true);
    }));
  }

  function onBless(e) {
    if (!ready || !e || W.lv.grass < 0.3) return;
    const u = uu(), q = W.quality || 1;
    const r = Math.max(20, e.r || 100);
    const n = Math.round(clamp(r / (12 * u), 10, 30) * q);
    let made = 0;
    for (let k = 0; k < n * 3 && made < n; k++) {
      const a = Math.random() * TAU, rr = Math.sqrt(Math.random()) * r;
      const x = e.x + Math.cos(a) * rr, y = e.y + Math.sin(a) * rr;
      if (addBloom(x, y, W.t + (rr / r) * 0.9 + Math.random() * 0.2, true)) made++;
    }
    trimBlooms();
    // 树在福中微微发光
    if (fxOK()) {
      for (const t of trees) {
        if (t.g < 1) continue;
        const y = ridgeAt(LY[t.layer], t.x) + t.model.cy * t.H;
        if (Math.hypot(t.x - e.x, y - e.y) < r) GS.fx.sparkle(t.x, y, t.layer === 2 ? 8 : 4, [255, 230, 170], t.H * 0.3, L_PASS[t.layer]);
      }
    }
  }

  function reset() {
    blooms.length = 0; drift.length = 0; bakeQ.length = 0; drops.length = 0;
    worldBloomed = false; ripeOn = false; treeOrigin = null;
    for (const t of trees) { dropBake(t); t.g = 0; t.pg = 0; t.ripe = false; t.ripeAt = Infinity; }
    for (const L of LY) { L.wet = 0; L.breached = false; L.dirty = true; }
  }

  function restore() {
    quietUntil = W.t + 0.35;
    drops.length = 0;
    if (W.w !== lastW || W.h !== lastH || !ready) resize();
    if (!ready) return;
    for (const L of LY) { L.dirty = true; updRidge(L); L.wet = 0; L.breached = L.rise > 0.04; }
    const ot = W.origin.trees;
    if (ot) { treeOrigin = ot; treeOxN = clamp(ot.x / Math.max(1, W.w), 0, 1); }
    layoutTrees();
    const ripe = W.stage >= 24;
    ripeOn = ripe;
    for (const t of trees) {
      t.g = treeGrowth(t); t.pg = t.g;
      t.ripe = ripe; t.ripeAt = ripe ? 0 : Infinity;
      if (t.g >= 1) queueBake(t);
    }
    blooms.length = 0; worldBloomed = false;
    if (ripe) worldBloom(W.w / 2, false);
    updFronts(); updGust(); updLight();
    // 立即烘焙，免得第一帧逐棵现画
    const t0 = performance.now();
    while (bakeQ.length && performance.now() - t0 < 150) {   // 一次性的（载入 / 恢复时，幕后）；烘焙库使卷间的 resync 不必重烘
      const t = bakeQ.shift(); t.queued = false;
      if (t.g >= 1 && t.bakeKey !== bakeKey(t)) U.safe('land.bake', () => bakeTree(t));
    }
    // （生长快照要用此刻的光，留给 update——restore 可能在世界的光第一次算出之前被调用）
  }

  // ════════════════════════════════════════════════════════════
  //  对外的查询
  // ════════════════════════════════════════════════════════════
  function refreshCache() {
    if (fcache.frame === W.frame) return;
    fcache.frame = W.frame;
    const T = fcache.trees, P = fcache.perch, F = fcache.flowers;
    T.length = 0; P.length = 0; F.length = 0;
    if (!ready || W.lv.land <= 0) return;
    for (const t of trees) {
      if (t.g <= 0) continue;
      const L = LY[t.layer];
      const y = ridgeAt(L, t.x);
      if (y >= L.wl - 1) continue;
      const m = t.model, gs = growScale(t.g);
      T.push({ x: t.x, y, top: y + m.top * t.H * gs, w: m.cw * t.H * gs, layer: t.layer, grown: t.g, kind: t.kind, label: KIND[t.kind].cn });
      if (t.g >= 1) for (const p of m.perch) P.push({ x: t.x + p[0] * t.H, y: y + t.sink + p[1] * t.H, layer: t.layer });
    }
    const df = W.dayFactor;
    for (let l = 1; l < 3; l++) {
      const L = LY[l];
      if (W.lv.herbs <= 0) break;
      for (const hb of L.herbs) {
        if (hb.kind !== 2) continue;
        if (!FR.herbAll && Math.abs(hb.x - FR.hx) > FR.hR[l] - 110 * uu()) continue;
        if (df - 0.28 - hb.off < 0.18) continue;
        const r = ridgeAt(L, hb.x);
        if (r >= L.wl - 1) continue;
        const by = (hb.v > 0 ? r + hb.v * (W.h - r) : r) + 1;
        F.push({ x: hb.x, y: by - hb.h, layer: l, rgb: FLOWER[hb.ci] });
      }
    }
    if (df > 0.4) {
      for (const b of blooms) {
        if (W.t < b.born + 0.4) continue;
        const p = bloomPos(b);
        if (p) F.push({ x: p[0], y: p[1] - b.s * 2.2, layer: b.layer, rgb: FLOWER[b.ci] });
      }
    }
  }
  function treeSpots() { U.safe('land.cache', refreshCache); return fcache.trees; }
  function perches() { U.safe('land.cache', refreshCache); return fcache.perch; }
  function flowerSpots() { U.safe('land.cache', refreshCache); return fcache.flowers; }
  function groundY(layer, x) {
    const L = LY[layer];
    if (!ready || !L || !L.cur) return W.ridgeY(layer, x);
    return ridgeAt(L, x);
  }
  function pick(x, y, r) {
    let best = null;
    for (const t of trees) {
      if (t.g < 0.6) continue;
      const L = LY[t.layer];
      const gy = ridgeAt(L, t.x);
      if (gy >= L.wl - 1) continue;
      const cy = gy + t.model.cy * t.H;
      const d = Math.hypot(t.x - x, cy - y) - t.model.cw * t.H * 0.25;
      if (d < r && (!best || d < best.d)) best = { label: KIND[t.kind].cn, x: t.x, y: gy + t.model.top * t.H, d: Math.max(0, d) };
    }
    return best;
  }

  GS.land = {
    init, resize, update, draw, reset, restore, pick,
    treeSpots, perches, flowerSpots, groundY,
    KIND, prof: PROF,
    get debug() { return { trees: trees.length, near: LY[2].trees.length, mid: LY[1].trees.length, baked: trees.filter(t => t.bake && t.bake.H === t.H).length, queue: bakeQ.length, blades: LY[1].nb + LY[2].nb, herbs: LY[1].herbs.length + LY[2].herbs.length, blooms: blooms.length, drift: drift.length }; },
  };
})(window.GS);
