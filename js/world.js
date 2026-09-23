/* ─────────────────────────────────────────────────────────────
 * world.js —— 世界的状态：创造的程度、昼夜的钟、大地的形状
 *
 * 所有渲染模块只读 GS.W；只有 story / main 改变它的"目标"。
 * 每个创造程度（level）是 0→1 的量，按 exp（指数趋近）或 lin（匀速）
 * 逐帧走向其目标——从而"恢复存档"只需把它们瞬间对齐（snap）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util;
  const { clamp, lerp, smoothstep, approach, fract, TAU } = U;

  // ── 创造程度的定义：名称 → [模式, 速率] ─────────────────────
  //   exp：每秒趋近 1-e^-rate；lin：每秒前进 rate
  const LEVELS = {
    deep:     ['exp', 0.55],  // 渊面（创 1:1-2）：水面在黑暗中隐约可见
    light:    ['exp', 2.2],   // 有光（1:3）
    gather:   ['exp', 1.1],   // 光暗分开（1:4）：弥漫的光凝聚为光核
    dayNight: ['exp', 0.9],   // 昼夜已立（1:5）：光核开始随时辰运行
    vault:    ['exp', 0.9],   // 穹苍（1:6-7）：穹顶与其上的水
    clouds:   ['exp', 0.35],  // 天上的云（穹苍以下的水汽）
    land:     ['lin', 0.16],  // 旱地升起（1:9）
    grass:    ['lin', 0.11],  // 青草蔓延（1:11）
    herbs:    ['lin', 0.10],  // 结种子的菜蔬（1:11）
    trees:    ['lin', 0.075], // 结果子的树木（1:11-12）
    lights:   ['exp', 0.7],   // 光体：光核凝为日（1:14-16）
    moon:     ['exp', 0.5],   // 小光管夜：月（1:16）
    stars:    ['exp', 0.45],  // 众星（1:16）
    life:     ['exp', 0.5],   // 水中的生命之光（1:20）
    good:     ['exp', 0.6],   // 「甚好」的辉光（1:31），缓缓回落
    sabbath:  ['exp', 0.25],  // 安息（2:1-3）
    given:    ['exp', 0.35],  // 神的灵将自己的光分给了人（1:26-27）：灵的光晕从此略小
  };

  const W = (GS.W = {
    // 视口（CSS 像素）
    w: 1, h: 1, dpr: 1, unit: 1,
    HZ: 0.6,                 // 地平线（高度比例）
    horizonY: 0.6,
    t: 0, dt: 0.016,         // 世界时间 / 本帧步长（秒）
    frame: 0,
    lv: {}, lt: {},          // 程度的当前值 / 目标值
    origin: {},              // 各种生长的起点（像素 x / y）
    pop: {},                 // 生灵的目标数量 { kind: {n, x, y, instant} }
    stage: 0,                // 已成就的话语数
    day: 0,                  // 当前是第几日（0 = 尚在起初之前）
    // 昼夜
    clock: 0.42, clockFrom: 0.42, clockTo: 0.42, clockT: 1, clockDur: 1,
    cycling: false,          // 正在经历「有晚上，有早晨」
    freeClock: false,        // 安息之后：时辰自行流转
    tod: 0.42,
    // 由 update 推导
    sun: { x: 0, y: 0, elev: 1, vis: 0 },
    moon: { x: 0, y: 0, elev: -1, vis: 0 },
    core: { x: 0, y: 0 },    // 无源的光核（第四日之前）/ 日（之后）——光的中心
    dayFactor: 1, daylight: 0, night: 0, dusk: 0,
    ambient: [0, 0, 0], haze: [0, 0, 0], skyTop: [0, 0, 0],
    wind: 0,
    // 神的灵
    spirit: { x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0, speed: 0, guided: false },
    // 言说
    ritual: { holding: false, charge: 0, text: '', tint: [255, 250, 235] },
    shake: 0,
    flash: 0,
    pull: 0,                 // 黄昏被言说拉近的量（时辰偏移）
    clockEase: 'cycle',      // 'cycle'：昼夜一轮的流连节奏；'ease'：走到某一时辰
    replaying: false,        // 正在瞬间重演（恢复存档 / 快进未完的情节）：一切动作直接到位，不放特效
    act: 0,                  // 当前所在的卷（0 = 七日）
    reduced: false,          // prefers-reduced-motion                // 成就时的闪光（0..1，快速衰减）
    fast: 1,                 // 调试：加速
    REST: 0.42,              // 白昼时的静止时辰
  });

  for (const k in LEVELS) { W.lv[k] = 0; W.lt[k] = 0; }

  // ── 目标控制 ────────────────────────────────────────────────
  W.set = function (name, target, instant) {
    if (!(name in LEVELS)) { console.warn('[W] unknown level', name); return; }
    W.lt[name] = target;
    if (instant) W.lv[name] = target;
  };
  W.snapAll = function () { for (const k in LEVELS) W.lv[k] = W.lt[k]; };
  // 后来各卷可以定义自己的程度（如 flood 洪水、rain 雨、desert 旱）而不必改动本文件
  W.defineLevel = function (name, mode, rate, initial) {
    if (!(name in LEVELS)) { LEVELS[name] = [mode || 'exp', rate || 0.5]; W.lv[name] = W.lt[name] = initial || 0; }
    else LEVELS[name] = [mode || LEVELS[name][0], rate || LEVELS[name][1]];
  };
  W.hasLevel = name => name in LEVELS;
  W.setOrigin = function (name, x, y) { W.origin[name] = { x, y }; };
  W.setPop = function (kind, n, x, y, instant) {
    const p = W.pop[kind] || (W.pop[kind] = { n: 0, x: 0, y: 0, instant: false });
    p.n = n;
    if (x != null) p.x = x;
    if (y != null) p.y = y;
    p.instant = !!instant;
  };
  W.popN = kind => (W.pop[kind] ? W.pop[kind].n : 0);

  // ── 昼夜 ────────────────────────────────────────────────────
  // 走过一轮「晚上 → 夜 → 早晨」，停在白昼的静止时辰
  W.passDay = function (dur, instant) {
    const base = W.cycling ? W.clockTo : W.clock;
    const to = Math.floor(base - W.REST + 1e-6) + 1 + W.REST;
    if (instant) { W.clock = W.clockFrom = W.clockTo = to; W.cycling = false; W.clockT = 1; return; }
    W.clockFrom = W.clock;
    W.clockTo = to;
    W.clockT = 0;
    W.clockDur = dur || 18;
    W.cycling = true;
    W.clockEase = 'cycle';
  };
  // 新的话语成就时若夜还未尽，催促黎明（不跳变，只加速）
  W.hurryClock = function () { if (W.cycling) W.clockDur = Math.min(W.clockDur, W.clockT * W.clockDur + 3.5); };
  // 让时辰向前走到某一刻（tod 0..1），用 dur 秒；不倒流。instant 则立即到达。
  W.goTo = function (tod, dur, instant) {
    const base = W.cycling ? W.clockTo : W.clock;
    let to = Math.floor(base) + tod;
    if (to < base - 1e-6) to += 1;
    if (instant || !dur) { W.clock = W.clockFrom = W.clockTo = to; W.cycling = false; W.clockT = 1; W.clockEase = 'cycle'; return; }
    W.clockFrom = W.clock;
    W.clockTo = to;
    W.clockT = 0;
    W.clockDur = dur;
    W.cycling = true;
    W.clockEase = 'ease';
  };

  // ── 一轮昼夜的节奏：时间→时辰偏移。黄昏与黎明流连，子夜稍驻，首尾缓起缓收。
  // 以"每段时辰所占的时间权重"积分再反求，得到单调平滑的映射表。
  const CYC_N = 512, cycTab = new Float32Array(CYC_N + 1);
  (function buildCycle() {
    const wgt = o => 1 + 1.7 * Math.exp(-Math.pow((o - 0.33) / 0.07, 2)) + 1.3 * Math.exp(-Math.pow((o - 0.83) / 0.07, 2)) +
      0.7 * Math.exp(-Math.pow((o - 0.58) / 0.12, 2)) + 1.4 * Math.exp(-Math.pow(o / 0.07, 2)) + 1.4 * Math.exp(-Math.pow((1 - o) / 0.09, 2));
    const M = 4096, T = new Float32Array(M + 1);
    for (let i = 1; i <= M; i++) T[i] = T[i - 1] + wgt((i - 0.5) / M) / M;
    for (let i = 0; i <= M; i++) T[i] /= T[M];
    let j = 0;
    for (let k = 0; k <= CYC_N; k++) {
      const t = k / CYC_N;
      while (j < M && T[j + 1] < t) j++;
      const a = T[j], b = T[Math.min(M, j + 1)];
      cycTab[k] = (j + (b > a ? (t - a) / (b - a) : 0)) / M;
    }
    cycTab[0] = 0; cycTab[CYC_N] = 1;
  })();
  function cycleOff(t) {
    const f = clamp(t, 0, 1) * CYC_N, i = Math.floor(f), r = f - i;
    return i >= CYC_N ? 1 : cycTab[i] + (cycTab[i + 1] - cycTab[i]) * r;
  }

  // ── 大地：三层剪影（远山、中丘、近岸），归一化高度场 ─────────
  // 每层：ridge(x) 为地表的高度比例；waterline 为其与海相接的水线。
  // ridge < waterline 处有地；否则为海。
  const N = 257;
  const LAYERS = [
    { name: 'far',  wl: 0.612, ridge: new Float32Array(N), scale: 0.32, depth: 0.85, rise: [0.0, 0.55] },
    { name: 'mid',  wl: 0.742, ridge: new Float32Array(N), scale: 0.58, depth: 0.45, rise: [0.18, 0.78] },
    { name: 'near', wl: 1.04,  ridge: new Float32Array(N), scale: 1.0,  depth: 0.0,  rise: [0.38, 1.0] },
  ];
  W.LAYERS = LAYERS;
  (function buildTerrain() {
    const n1 = U.noise1, fb = U.fbm1;
    for (let i = 0; i < N; i++) {
      const x = i / (N - 1);
      // 远山：右侧连绵的山脊 + 左远处一座小岛
      const mFar = smoothstep(0.50, 0.64, x);
      const peaks = 0.030 + 0.028 * Math.max(0, fb(x * 7.0 + 3.1, 4)) * 2 + 0.010 * Math.sin(x * 23 + 1.3);
      const isle = 0.014 * Math.exp(-Math.pow((x - 0.13) / 0.035, 2));
      LAYERS[0].ridge[i] = LAYERS[0].wl + 0.006 - mFar * peaks - isle;
      // 中丘：右半起伏的丘陵，缓缓没入海中
      const mMid = smoothstep(0.42, 0.58, x);
      const hills = 0.050 + 0.016 * Math.sin(x * 9.3 + 0.7) + 0.012 * fb(x * 13 + 7.7, 3);
      LAYERS[1].ridge[i] = LAYERS[1].wl + 0.012 - mMid * hills;
      // 近岸：画面右侧的前景大地，左侧成为海湾
      const mNear = smoothstep(0.24, 0.47, x);
      const land = 0.215 + 0.022 * Math.sin(x * 6.1 + 2.2) + 0.014 * Math.sin(x * 15.7 + 0.4) + 0.008 * n1(x * 31);
      LAYERS[2].ridge[i] = LAYERS[2].wl + 0.03 - mNear * land;
    }
  })();

  function sampleRidge(L, xn) {
    const f = clamp(xn, 0, 1) * (N - 1);
    const i = Math.floor(f), r = f - i;
    const a = L.ridge[i], b = L.ridge[Math.min(N - 1, i + 1)];
    return a + (b - a) * r;
  }
  // 该层当前的升起程度（旱地自海中次第升起）
  W.layerRise = function (layer) {
    const L = LAYERS[layer];
    return smoothstep(L.rise[0], L.rise[1], W.lv.land);
  };
  // 地表 y（像素）。无地处返回 >= 水线。
  W.ridgeY = function (layer, x) {
    const L = LAYERS[layer];
    const base = sampleRidge(L, x / W.w);
    const e = W.layerRise(layer);
    const sink = (1 - e) * (L.wl - base + 0.02);
    return (base + sink) * W.h;
  };
  W.waterlineY = layer => LAYERS[layer].wl * W.h;
  // 静态（已完全升起时）的地表，用于布置草木与生灵
  W.ridgeBaseY = (layer, x) => sampleRidge(LAYERS[layer], x / W.w) * W.h;
  W.hasLand = function (layer, x, margin) {
    return W.ridgeY(layer, x) < W.waterlineY(layer) - (margin || 0);
  };
  W.hasLandBase = function (layer, x, margin) {
    return W.ridgeBaseY(layer, x) < W.waterlineY(layer) - (margin || 0);
  };
  // 在某层随机取一处有地的 x（按完全升起的形状）
  W.randomLandX = function (layer, margin) {
    for (let k = 0; k < 40; k++) {
      const x = Math.random() * W.w;
      if (W.hasLandBase(layer, x, margin == null ? W.h * 0.012 : margin)) return x;
    }
    return W.w * 0.8;
  };
  // 该层有地的 x 区间（像素）[x0, x1]
  W.landSpan = function (layer, margin) {
    let x0 = -1, x1 = -1;
    for (let i = 0; i < 200; i++) {
      const x = (i / 199) * W.w;
      if (W.hasLandBase(layer, x, margin || 0)) { if (x0 < 0) x0 = x; x1 = x; }
    }
    return x0 < 0 ? null : [x0, x1];
  };
  // (x, y) 是否是海面
  W.isSea = function (x, y) {
    if (y <= W.horizonY) return false;
    for (let l = 0; l < 3; l++) {
      const r = W.ridgeY(l, x);
      if (y >= r && y <= W.waterlineY(l)) return false;
    }
    return true;
  };
  // 海上的透视比例：地平线 0 → 画面底 1
  W.seaDepth = y => clamp((y - W.horizonY) / (W.h - W.horizonY), 0, 1);
  W.seaScale = y => (0.12 + 0.88 * W.seaDepth(y)) * W.unit;
  W.layerScale = layer => LAYERS[layer].scale * W.unit;
  // 某个 y 位于哪一层的前后（用于绘制次序）：返回 'seaFar' | 'seaMid' | 'seaNear'
  W.seaBand = function (y) {
    if (y < W.waterlineY(0)) return 'seaFar';
    if (y < W.waterlineY(1)) return 'seaMid';
    return 'seaNear';
  };

  // ── 光与色：给剪影上色，统一全局风格 ────────────────────────
  const NIGHT_AMB = [34, 46, 82], DUSK_AMB = [226, 132, 92], DAY_AMB = [236, 238, 240];
  const NIGHT_HAZE = [22, 32, 62], DUSK_HAZE = [236, 150, 118], DAY_HAZE = [178, 204, 228], DARK = [6, 8, 14];
  // 以层深 depth（0 近 → 1 远）为基色 rgb 着色：受光照、夜色与大气透视影响
  W.shade = function (rgb, depth, extraLight) {
    const lit = clamp(0.10 + 0.90 * W.daylight + (extraLight || 0), 0, 1.2);
    const a = W.ambient;
    let r = rgb[0] * lit * a[0] / 255, g = rgb[1] * lit * a[1] / 255, b = rgb[2] * lit * a[2] / 255;
    const hz = (depth || 0) * 0.78;
    r = lerp(r, W.haze[0], hz); g = lerp(g, W.haze[1], hz); b = lerp(b, W.haze[2], hz);
    return [r, g, b];
  };
  W.shadeCSS = (rgb, depth, alpha, extra) => {
    const c = W.shade(rgb, depth, extra);
    return alpha == null ? U.rgb(c[0], c[1], c[2]) : U.rgba(c[0], c[1], c[2], alpha);
  };

  // 月相：创世之周是满月（第一个夜晚应当辉煌）；安息之后随真实的月相（避开朔月，总留一弯）
  const SYNODIC = 29.530588853, NEW_MOON_2000 = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  let realPhase = null;
  function moonPhase() {
    if (!W.freeClock) return 0.5;
    if (realPhase == null) {
      const days = Date.now() / 86400000 - NEW_MOON_2000;
      realPhase = fract(days / SYNODIC);
    }
    return clamp(realPhase, 0.1, 0.9);
  }

  // ── 视口 ────────────────────────────────────────────────────
  W.resize = function (w, h, dpr) {
    W.w = w; W.h = h; W.dpr = dpr;
    W.horizonY = W.HZ * h;
    W.unit = Math.min(w, h * 1.25) / 900;
    if (!W.spirit.x && !W.spirit.y) {
      W.spirit.x = W.spirit.tx = w * 0.5;
      W.spirit.y = W.spirit.ty = h * 0.5;
    }
  };

  // ── 每帧推进 ────────────────────────────────────────────────
  W.update = function (dt) {
    W.dt = dt;
    W.t += dt;
    W.frame++;

    for (const k in LEVELS) {
      const [mode, rate] = LEVELS[k];
      const cur = W.lv[k], tg = W.lt[k];
      if (cur === tg) continue;
      if (mode === 'exp') {
        let v = approach(cur, tg, rate * W.fast, dt);
        if (Math.abs(v - tg) < 1e-4) v = tg;
        W.lv[k] = v;
      } else {
        const step = rate * W.fast * dt;
        W.lv[k] = cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step);
      }
    }

    // 时辰
    if (W.cycling) {
      W.clockT = Math.min(1, W.clockT + (dt * W.fast) / W.clockDur);
      // 在黄昏、深夜、黎明各自流连片刻（见 cycleOff）
      W.clock = lerp(W.clockFrom, W.clockTo, W.clockEase === 'ease' ? U.easeInOut(W.clockT) : cycleOff(W.clockT));
      if (W.clockT >= 1) { W.cycling = false; W.clock = W.clockTo; W.clockEase = 'cycle'; }
    } else if (W.freeClock) {
      W.clock += (dt * W.fast) / 150;       // 安息之后：一日约两分半
    }

    // 日与月的位置：东（左）升西（右）落
    // 言说「有晚上，有早晨」时，按住的力量把黄昏拉近（W.pull，松手即回）
    W.tod = fract(W.clock + (W.pull || 0));
    const a = (W.tod - 0.25) * TAU;
    const elev = Math.sin(a);
    const sx = 0.5 - 0.46 * Math.cos(a);
    const sy = W.HZ - elev * 0.47;
    const dn = W.lv.dayNight;
    // 昼夜未立之前，光弥漫于穹苍正中
    W.core.x = lerp(0.5, sx, dn) * W.w;
    W.core.y = lerp(0.27, sy, dn) * W.h;
    W.sun.x = sx * W.w; W.sun.y = sy * W.h; W.sun.elev = lerp(1, elev, dn);
    W.sun.vis = W.lv.lights;
    const ma = a + Math.PI * 0.62;          // 月比日晚升约三成日：白昼时月低悬于西（右）天
    const melev = Math.sin(ma);
    W.moon.x = (0.5 - 0.46 * Math.cos(ma)) * W.w;
    W.moon.y = (W.HZ - melev * 0.42) * W.h;
    W.moon.elev = melev;
    W.moon.vis = W.lv.moon;
    W.moon.phase = moonPhase();              // 月相（0 新月 → 0.5 满月 → 1）

    const df = lerp(1, smoothstep(-0.20, 0.24, elev), dn);
    W.dayFactor = df;
    W.daylight = W.lv.light * (0.10 + 0.90 * df);
    W.night = dn * (1 - df) * W.lv.light;
    W.dusk = dn * W.lv.light * Math.exp(-Math.pow(elev / 0.20, 2));

    // 环境光与雾霭之色
    const L = W.lv.light;
    let amb = U.mixRGB(NIGHT_AMB, DAY_AMB, df);
    amb = U.mixRGB(amb, DUSK_AMB, W.dusk * 0.75);
    W.ambient = U.mixRGB([70, 80, 110], amb, L);
    let hz = U.mixRGB(NIGHT_HAZE, DAY_HAZE, df);
    hz = U.mixRGB(hz, DUSK_HAZE, W.dusk * 0.8);
    W.haze = U.mixRGB(DARK, hz, L);

    W.wind = U.noise1(W.t * 0.07) * 0.8 + U.noise1(W.t * 0.31 + 40) * 0.2;

    if (W.shake > 0) W.shake = Math.max(0, W.shake - dt * 1.9);
    if (W.flash > 0) W.flash = Math.max(0, W.flash - dt * 1.4);
  };
})(window.GS);
