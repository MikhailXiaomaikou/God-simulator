/* ─────────────────────────────────────────────────────────────
 * beasts.js —— 地上的活物：牲畜、野兽、昆虫，与人（创 1:24–31，2:19–20）
 *
 *   走兽：由参数化的基元拼成的剪影（椭圆的躯干、锥形的腿、颈与头的角度），
 *         沿地面行走、低头吃草、抬头张望、到岸边饮水、夜里卧下；各从其类，成群相随。
 *         狮子卧在羊群旁——伊甸的和平，没有捕食。
 *   昆虫：白昼的蝴蝶在花间以李萨如轨迹翩飞；夜里萤火虫在草上明灭；甲虫在近地爬行。
 *   人：  自尘土成形，灵的光流入其胸口，从此自带一丝微光；
 *         随日影作息——牵手晨行、摘果、看海、正午坐在大树下、黄昏面向落日、夜里仰望众星；
 *         安息之后，人为活物起名（2:19–20）。
 *   万物：神言说时停步、转向灵静听；灵缓缓靠近时好奇地抬头、走近；灵急掠时鹿与兔惊走又回。
 *
 *   对外：标准模块接口（init / resize / update / draw / reset / restore / pick）
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;

  // ── 小工具 ──────────────────────────────────────────────────
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const sstep = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const eOut = t => 1 - (1 - t) * (1 - t) * (1 - t);
  const eIO = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const sgn = x => (x < 0 ? -1 : 1);
  const uu = () => Math.max(0.3, W.unit || 1);
  // 生灵的尺度：随 unit 缩放；窄屏（竖屏手机）上略放大，免得小得看不清
  const cu = () => { const u = uu(); return u < 0.75 ? u * (1 + (0.75 - u) * 0.42) : u; };
  const fxOK = () => GS.fx && typeof GS.fx.add === 'function';
  const fastK = () => Math.max(0.1, W.fast || 1);
  const approach = (cur, tg, rate, dt) => cur + (tg - cur) * (1 - Math.exp(-rate * dt));

  // ── 色板 ────────────────────────────────────────────────────
  const hex = U.hexRGB;
  const RIM_DAY = [255, 244, 222], RIM_WARM = [255, 178, 110], RIM_NIGHT = [168, 190, 240], RIM_SPIRIT = [150, 195, 255];
  const HUMAN = hex('#3A2C24'), HUMAN_HAIR = [40, 29, 24], HUMAN_RIM = hex('#FFD9A8'), INNER = hex('#DCEBFF');
  const DUST = [226, 196, 150], SOIL = [90, 65, 40], HUMAN_DUST = hex('#E8C89A'), BREATH = [255, 236, 204];
  const BUTTER = [hex('#F2C14E'), hex('#8EC5E8'), hex('#F6F1E7'), hex('#F2C14E'), hex('#8EC5E8')];
  const FIREFLY = hex('#D8F57A');
  const BEETLE = [38, 36, 30], BEETLE_GLINT = [120, 170, 140];
  const FRUIT = [[224, 84, 58], [242, 163, 58], [201, 56, 74]];

  // ── 物种（尺寸以近地 unit=1 的像素计；面向 +x，y 向上为负）──────
  //   bl/bh 躯干长/高 · leg 腿长 · lw 腿宽[根,膝,蹄] · neck/nw 颈长/宽 · up 平视时颈角
  //   hd 头相对颈的下垂 · hl/hh 头长/高 · muz 口鼻 · ear 耳 · walk 步速 · stride 步幅
  const SPEC = {
    sheep: { cn: '羊', cls: 'cattle', type: 'q', bl: 17, bh: 11.5, leg: 6.2, lw: [2.1, 1.55, 1.35], neck: 5.6, nw: [6.4, 4.2], up: 0.5, hd: 0.95,
      hl: 6.2, hh: 4.3, muz: 0.8, ear: 2.5, earOut: true, wool: true, tail: 'wool',
      walk: 7.5, stride: 6.5, herdR: 36, graze: [5, 11], col: [232, 225, 210], col2: [58, 49, 42], top: 20, len: 27 },
    goat: { cn: '山羊', cls: 'cattle', type: 'q', bl: 16.5, bh: 8.8, leg: 9, lw: [2.0, 1.35, 1.15], neck: 7.2, nw: [4.4, 3.0], up: 0.8, hd: 1.15,
      hl: 6.4, hh: 3.8, muz: 0.72, ear: 2.4, horn: 'goat', beard: true, tail: 'up',
      walk: 8.5, stride: 8, herdR: 60, graze: [4, 9], col: [140, 118, 94], alt: [216, 206, 188], col2: [70, 56, 44], top: 24, len: 27 },
    cow: { cn: '牛', cls: 'cattle', type: 'q', bl: 30, bh: 13, leg: 11, lw: [3.6, 2.4, 2.1], neck: 7.6, nw: [9.6, 5.6], up: 0.28, hd: 0.8,
      hl: 10.4, hh: 5.8, muz: 0.95, ear: 2.8, earOut: true, horn: 'cow', tail: 'tuft', rump: 1.0, flat: true, dewlap: true,
      walk: 6.5, stride: 10, herdR: 60, graze: [6, 13], col: hex('#5A4633'), alt: hex('#2A211A'), col2: [34, 27, 22], acc: [222, 212, 196], top: 29, len: 42 },
    deer: { cn: '鹿', cls: 'beast', type: 'q', bl: 21, bh: 9.6, leg: 14, lw: [2.5, 1.4, 1.0], neck: 11, nw: [4.8, 3.0], up: 1.0, hd: 1.45,
      hl: 7.4, hh: 3.9, muz: 0.68, ear: 3.4, antler: true, tail: 'up',
      walk: 10, stride: 12, herdR: 70, graze: [4, 9], flee: 1, curious: 1, col: hex('#8A5A3A'), col2: [92, 60, 40], top: 30, len: 34 },
    lion: { cn: '狮子', cls: 'beast', type: 'q', bl: 27, bh: 11.5, leg: 10.5, lw: [3.4, 2.4, 2.2], neck: 6.2, nw: [8.0, 6.4], up: 0.3, hd: 0.55,
      hl: 8.2, hh: 6.8, muz: 0.82, ear: 2.2, mane: true, tail: 'lion', rump: 0.95,
      walk: 8.5, stride: 11, herdR: 30, graze: [8, 14], col: hex('#B98A4A'), col2: [120, 76, 36], top: 26, len: 40 },
    horse: { cn: '马', cls: 'beast', type: 'q', bl: 27, bh: 12.5, leg: 16, lw: [3.1, 1.9, 1.6], neck: 13, nw: [7.6, 3.8], up: 0.95, hd: 1.5,
      hl: 10.8, hh: 4.6, muz: 0.8, ear: 2.6, hmane: true, tail: 'horse', chest: 1.0, rump: 1.05,
      walk: 11, stride: 14, herdR: 70, graze: [5, 10], flee: 0.6, curious: 1, col: hex('#4A3A30'), alt: [128, 96, 70], col2: [34, 26, 21], top: 38, len: 44 },
    elephant: { cn: '象', cls: 'beast', type: 'e', bl: 37, bh: 22, leg: 14.5, lw: [7.0, 6.2, 6.6], up: 0, walk: 5.5, stride: 14, herdR: 70, graze: [6, 12], curious: 1,
      col: hex('#6F6F78'), col2: [92, 92, 102], acc: [236, 228, 208], top: 42, len: 58 },
    rabbit: { cn: '兔子', cls: 'beast', type: 'r', bl: 8, bh: 5.4, leg: 1.8, up: 0, walk: 15, stride: 5, herdR: 50, graze: [2.5, 6], flee: 1, curious: 1,
      col: hex('#9B8A78'), acc: [238, 232, 222], top: 12, len: 11 },
  };
  const CATTLE_SEQ = ['sheep', 'sheep', 'cow', 'cow', 'sheep', 'sheep', 'goat', 'goat', 'sheep'];
  const BEAST_SEQ = ['deer', 'deer', 'lion', 'lion', 'elephant', 'elephant', 'horse', 'horse', 'rabbit', 'rabbit'];
  // 八只「野兽」之外，一对兔子随之而出（小，不计入野兽的数目）
  const beastWant = n => (n >= 8 ? n + 2 : n);

  // 吃草时颈要低到口鼻几乎触地：按几何求出每种走兽的吃草颈角
  function headTip(M, al, by) {
    const sx = M.bl * 0.36, sy = by - M.bh * 0.05;
    const nx = sx + Math.cos(al) * M.neck, ny = sy - Math.sin(al) * M.neck;
    const be = al - (al > 0 ? M.hd : M.hd * 0.35);
    return ny - Math.sin(be) * M.hl * 0.95;
  }
  for (const k in SPEC) {
    const M = SPEC[k];
    M.key = k;
    if (M.type !== 'q') { M.grazeA = -1; continue; }
    const by = -(M.leg + M.bh * 0.5);
    let al = M.up;
    for (; al > -1.55; al -= 0.02) if (headTip(M, al, by) > -1.2) break;
    M.grazeA = al;
  }

  // ── 状态 ────────────────────────────────────────────────────
  const AN = [];        // 走兽（牲畜 + 野兽）
  const HU = [];        // 人
  const CR = [];        // 昆虫（槽位：甲虫 / 昼蝶夜萤 / 萤）
  const GQ = [];        // 待出的走兽（成对，各从其类）
  const HQ = [];        // 待出的人
  const CQ = [];        // 待出的昆虫
  const made = { cattle: 0, beast: 0, creeper: 0, human: 0 };
  const next = { ground: 0, human: 0, creeper: 0 };
  const SPAN = [null, null, null];
  let pairIdx = 0, uid = 1, lastW = 0, lastH = 0, ready = false;
  let nameNext = 0, namedSp = {};
  const LT = { sunA: 0, sunCol: RIM_DAY, sx: 0, sy: 0, moonA: 0, mx: 0, my: 0, spA: 0, spR: 200, spx: 0, spy: 0, sh: 0.18 };
  const RIM = { dx: 0, dy: -1, a: 0, c: [255, 255, 255], extra: 0 };

  // ── 地面 ────────────────────────────────────────────────────
  function gY(layer, x) {
    const L = GS.land;
    let y = L && L.groundY ? L.groundY(layer, x) : W.ridgeY(layer, x);
    if (!isFinite(y)) y = W.ridgeY(layer, x);
    return y;
  }
  function fieldH(layer, g) { return layer === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(layer) - g); }
  function footY(layer, x, v) { const g = gY(layer, x); return g + v * fieldH(layer, g) * 0.82; }
  const LK = [0.32, 0.58, 1.0];
  function depthK(layer, v) { return layer === 2 ? 0.92 + 0.42 * v : 0.96 + 0.25 * v; }
  function scan(layer) {
    const H = W.h;
    let x0 = -1, x1 = -1;
    for (let i = 0; i <= 200; i++) {
      const x = (i / 200) * W.w;
      const ok = layer === 2 ? W.ridgeBaseY(2, x) < H * 0.955 : W.ridgeBaseY(layer, x) < W.waterlineY(layer) - H * 0.008;
      if (ok) { if (x0 < 0) x0 = x; x1 = x; }
    }
    if (x0 < 0) return null;
    const m = 14 * cu();
    const a = x0 + m * 0.4, b = Math.min(x1, W.w - m);
    return b - a > 20 ? [a, b] : null;
  }
  // 近地的纵深：窄高的屏幕（竖屏手机）上，田野相对生灵更高，便让它们散得更开
  const VMAX = [0.3, 0.4, 0.55];
  function calcSpans() {
    SPAN[1] = scan(1); SPAN[2] = scan(2);
    const s = SPAN[2];
    if (s) {
      const fh = W.h - W.ridgeBaseY(2, (s[0] + s[1]) / 2);
      const rel = fh / (cu() * 100);
      VMAX[2] = clamp(0.33 + 0.15 * rel, 0.5, 0.8);
    }
  }
  function span(layer) { if (!SPAN[layer]) SPAN[layer] = scan(layer); return SPAN[layer] || [W.w * 0.55, W.w * 0.95]; }
  function clampX(layer, x, m) { const s = span(layer); m = Math.min(m || 0, (s[1] - s[0]) * 0.3); return clamp(x, s[0] + m, s[1] - m); }

  // ── 光：日 / 月 / 灵（夜里灵是唯一的灯）──────────────────────
  function updLight() {
    const df = W.dayFactor, dk = W.dusk, L = W.lv.light;
    const up = c01(df * 1.25);
    LT.sunA = L * up * lerp(0.5, 1.0, dk);
    LT.sunCol = mix(RIM_DAY, RIM_WARM, c01(dk * 1.2));
    LT.sx = W.core.x; LT.sy = W.core.y;
    const mo = W.moon;
    LT.moonA = mo && mo.vis > 0 ? mo.vis * W.night * sstep(-0.06, 0.2, mo.elev) * 0.85 : 0;
    LT.mx = mo ? mo.x : 0; LT.my = mo ? mo.y : 0;
    const sp = W.spirit;
    LT.spx = sp.x; LT.spy = sp.y;
    LT.spR = 230 * Math.max(0.6, uu());
    LT.spA = L * (0.1 + 0.9 * W.night);
    LT.sh = 0.2 * (0.25 + 0.75 * W.daylight);
  }
  // 为 (x, y) 处的剪影求描光：方向指向最强的光，颜色按权重混合
  function rimAt(x, y, warm) {
    let wx = 0, wy = 0, ws = 0, r = 0, g = 0, b = 0;
    if (LT.sunA > 0.004) {
      const dx = LT.sx - x, dy = LT.sy - y, d = Math.hypot(dx, dy) || 1, a = LT.sunA;
      const c = warm ? mix(LT.sunCol, HUMAN_RIM, 0.55) : LT.sunCol;
      wx += dx / d * a; wy += dy / d * a; ws += a; r += c[0] * a; g += c[1] * a; b += c[2] * a;
    }
    if (LT.moonA > 0.004) {
      const dx = LT.mx - x, dy = LT.my - y, d = Math.hypot(dx, dy) || 1, a = LT.moonA;
      wx += dx / d * a; wy += dy / d * a; ws += a; r += RIM_NIGHT[0] * a; g += RIM_NIGHT[1] * a; b += RIM_NIGHT[2] * a;
    }
    const dx = LT.spx - x, dy = LT.spy - y, d = Math.hypot(dx, dy) || 1;
    const f = c01(1 - d / LT.spR), ff = f * f;
    RIM.extra = LT.spA * ff * 0.5 + LT.moonA * 0.12;
    const sa = LT.spA * ff * 1.7;
    if (sa > 0.004) {
      const c = warm ? mix(RIM_SPIRIT, INNER, 0.5) : RIM_SPIRIT;
      wx += dx / d * sa; wy += dy / d * sa; ws += sa; r += c[0] * sa; g += c[1] * sa; b += c[2] * sa;
    }
    if (ws < 0.004) { RIM.a = 0; RIM.dx = 0; RIM.dy = -1; return RIM; }
    const L = Math.hypot(wx, wy) || 1;
    const k = clamp(cu() * (warm ? 0.7 : 0.85), 0.65, 1.15) * (1 + 0.45 * W.night);
    RIM.dx = wx / L * k; RIM.dy = wy / L * k;
    RIM.c[0] = r / ws; RIM.c[1] = g / ws; RIM.c[2] = b / ws;
    RIM.a = Math.min(1, ws * (1 + 0.6 * W.night)) * (warm ? 1 : 0.85);
    return RIM;
  }
  function shc(rgb, depth, extra, k) {
    const c = W.shade(rgb, depth, extra);
    if (k != null) { c[0] *= k; c[1] *= k; c[2] *= k; }
    return U.rgb(c[0], c[1], c[2]);
  }

  // ════════════════════════════════════════════════════════════
  //  几何：局部坐标 → 屏幕；同一路径内所有子路径同向，才能以 nonzero 合并
  // ════════════════════════════════════════════════════════════
  const T = { x: 0, y: 0, s: 1, f: 1, a: 0, c: 1, n: 0 };
  let PX = 0, PY = 0, CP = null;
  function setT(x, y, s, f, rot) {
    T.x = x; T.y = y; T.s = s;
    T.f = Math.abs(f) < 0.14 ? (f < 0 ? -0.14 : 0.14) : f;
    T.a = rot || 0; T.c = Math.cos(T.a); T.n = Math.sin(T.a);
  }
  function tp(lx, ly) {
    const rx = lx * T.c - ly * T.n, ry = lx * T.n + ly * T.c;
    PX = T.x + rx * T.s * T.f; PY = T.y + ry * T.s;
  }
  function ell(lx, ly, rx, ry, rot) {
    tp(lx, ly);
    const r = (T.f < 0 ? -1 : 1) * ((rot || 0) + T.a);
    const cr = Math.cos(r), sr = Math.sin(r), kx = Math.abs(T.f);
    const RX = Math.max(0.05, rx * T.s * Math.sqrt(kx * kx * cr * cr + sr * sr));
    const RY = Math.max(0.05, ry * T.s * Math.sqrt(kx * kx * sr * sr + cr * cr));
    CP.moveTo(PX + RX * cr, PY + RX * sr);
    CP.ellipse(PX, PY, RX, RY, r, 0, TAU);
    CP.closePath();
  }
  const PB = new Float64Array(64);
  function polyN(n) {
    for (let i = 0; i < n; i++) { tp(PB[2 * i], PB[2 * i + 1]); PB[2 * i] = PX; PB[2 * i + 1] = PY; }
    let area = 0;
    for (let i = 0; i < n; i++) { const j = i + 1 === n ? 0 : i + 1; area += PB[2 * i] * PB[2 * j + 1] - PB[2 * j] * PB[2 * i + 1]; }
    if (area >= 0) {
      CP.moveTo(PB[0], PB[1]);
      for (let i = 1; i < n; i++) CP.lineTo(PB[2 * i], PB[2 * i + 1]);
    } else {
      CP.moveTo(PB[2 * n - 2], PB[2 * n - 1]);
      for (let i = n - 2; i >= 0; i--) CP.lineTo(PB[2 * i], PB[2 * i + 1]);
    }
    CP.closePath();
  }
  function tri(x0, y0, x1, y1, x2, y2) { PB[0] = x0; PB[1] = y0; PB[2] = x1; PB[3] = y1; PB[4] = x2; PB[5] = y2; polyN(3); }
  // 锥形的一段
  function seg(x0, y0, x1, y1, w0, w1, cap) {
    let dx = x1 - x0, dy = y1 - y0; const L = Math.hypot(dx, dy) || 1e-3;
    const nx = -dy / L, ny = dx / L, a = w0 / 2, b = w1 / 2;
    PB[0] = x0 + nx * a; PB[1] = y0 + ny * a; PB[2] = x1 + nx * b; PB[3] = y1 + ny * b;
    PB[4] = x1 - nx * b; PB[5] = y1 - ny * b; PB[6] = x0 - nx * a; PB[7] = y0 - ny * a;
    polyN(4);
    if (cap) ell(x1, y1, b, b, 0);
  }
  // 两节的肢：根 → 膝 → 端
  function limb(x0, y0, x1, y1, x2, y2, w0, w1, w2, knee) {
    let ax = x1 - x0, ay = y1 - y0; const La = Math.hypot(ax, ay) || 1e-3; ax /= La; ay /= La;
    let bx = x2 - x1, by = y2 - y1; const Lb = Math.hypot(bx, by) || 1e-3; bx /= Lb; by /= Lb;
    let kx = -(ay + by), ky = ax + bx; const kl = Math.hypot(kx, ky) || 1e-3; kx /= kl; ky /= kl;
    const a = w0 / 2, m = w1 / 2, c = w2 / 2;
    PB[0] = x0 - ay * a; PB[1] = y0 + ax * a;
    PB[2] = x1 + kx * m; PB[3] = y1 + ky * m;
    PB[4] = x2 - by * c; PB[5] = y2 + bx * c;
    PB[6] = x2 + by * c; PB[7] = y2 - bx * c;
    PB[8] = x1 - kx * m; PB[9] = y1 - ky * m;
    PB[10] = x0 + ay * a; PB[11] = y0 - ax * a;
    polyN(6);
    if (knee !== false) ell(x1, y1, m * 1.05, m * 1.05, 0);
  }
  // 沿折线的锥形带（尾、象鼻、长发）
  function strand(pts, n, w0, w1) {
    // pts: [x0,y0,x1,y1,...] 局部坐标；输出 2n 点的多边形
    const L = Math.min(n, 16), tmp = STR;
    for (let i = 0; i < L; i++) {
      const i0 = Math.max(0, i - 1), i1 = Math.min(L - 1, i + 1);
      let dx = pts[2 * i1] - pts[2 * i0], dy = pts[2 * i1 + 1] - pts[2 * i0 + 1];
      const d = Math.hypot(dx, dy) || 1e-3;
      const w = lerp(w0, w1, i / (L - 1)) / 2;
      tmp[4 * i] = pts[2 * i] - dy / d * w; tmp[4 * i + 1] = pts[2 * i + 1] + dx / d * w;
      tmp[4 * i + 2] = pts[2 * i] + dy / d * w; tmp[4 * i + 3] = pts[2 * i + 1] - dx / d * w;
    }
    let k = 0;
    for (let i = 0; i < L; i++) { PB[k++] = tmp[4 * i]; PB[k++] = tmp[4 * i + 1]; }
    for (let i = L - 1; i >= 0; i--) { PB[k++] = tmp[4 * i + 2]; PB[k++] = tmp[4 * i + 3]; }
    polyN(2 * L);
  }
  const STR = new Float64Array(64), SP_ = new Float64Array(32);

  // 路径的分组：按次序填色；描光时把全部合并成一条路径，向光偏移后先填一遍
  const OPS_P = [], OPS_K = [];
  let nOps = 0;
  function op(key) { const p = new Path2D(); OPS_P[nOps] = p; OPS_K[nOps] = key; nOps++; CP = p; }
  const COLS = { body: '', far: '', dark: '', darkF: '', head: '', acc: '', hair: '' };
  const CRGB = { body: [0, 0, 0], far: [0, 0, 0], dark: [0, 0, 0], darkF: [0, 0, 0], head: [0, 0, 0], acc: [0, 0, 0], hair: [0, 0, 0] };
  const RIMC = {};
  function setCol(key, rgb, depth, extra, k) {
    const c = W.shade(rgb, depth, extra);
    if (k != null) { c[0] *= k; c[1] *= k; c[2] *= k; }
    CRGB[key] = c; COLS[key] = U.rgb(c[0], c[1], c[2]);
  }
  // 描光：每一部分先以"被照亮的边"之色向光偏移填一遍，再在原位填本色
  function flush(ctx, rim) {
    if (rim && rim.a > 0.03) {
      const a = Math.min(1, rim.a), rc = rim.c;
      for (const k in RIMC) RIMC[k] = null;
      ctx.translate(rim.dx, rim.dy);
      for (let i = 0; i < nOps; i++) {
        const k = OPS_K[i];
        let st = RIMC[k];
        if (!st) {
          const c = CRGB[k];
          st = RIMC[k] = U.rgb(c[0] + (rc[0] - c[0]) * a, c[1] + (rc[1] - c[1]) * a, c[2] + (rc[2] - c[2]) * a);
        }
        ctx.fillStyle = st;
        ctx.fill(OPS_P[i]);
      }
      ctx.translate(-rim.dx, -rim.dy);
    }
    for (let i = 0; i < nOps; i++) { ctx.fillStyle = COLS[OPS_K[i]]; ctx.fill(OPS_P[i]); }
    nOps = 0;
  }

  // ════════════════════════════════════════════════════════════
  //  走兽的剪影
  // ════════════════════════════════════════════════════════════
  function legQ(M, x0, y0, L, front, p, A, g, lie) {
    const s = Math.sin(p), c = Math.cos(p);
    const th = A * s, lift = Math.max(0, c) * g;
    let u, l;
    if (front) { u = th + 0.03; l = th - lift * 1.05 - 0.02; }
    else { u = th - 0.22 - lift * 0.12; l = th + 0.16 + lift * 0.75; }
    if (lie > 0.001) {
      u = lerp(u, front ? 1.25 : 1.35, lie);
      l = lerp(l, front ? -1.5 : -1.6, lie);
    }
    const L1 = L * (front ? 0.5 : 0.52), L2 = L * 0.5;
    const kx = x0 + Math.sin(u) * L1, ky = y0 + Math.cos(u) * L1;
    const fx = kx + Math.sin(l) * L2, fy = Math.min(ky + Math.cos(l) * L2, 0.2);
    const w = M.lw;
    limb(x0, y0, kx, ky, fx, fy, w[0] * (front ? 1 : 1.35), w[1], w[2]);
  }

  function buildQuad(a) {
    const M = a.M, lie = a.lie, g = a.gait, run = a.run, ph = a.ph;
    const bl = M.bl, bh = M.bh, L0 = M.leg + bh * 0.32;
    const bob = -(0.04 + 0.12 * run) * g * L0 * Math.abs(Math.cos(ph));
    const by = lerp(-(M.leg + bh * 0.5), -bh * 0.46, lie) + bob;
    const pitch = a.pitch + (run ? 0.06 * Math.sin(ph * 2) * run : 0);
    const cp = Math.cos(pitch), spn = Math.sin(pitch);
    const rx = (x, y) => x * cp - (y - by) * spn, ry = (x, y) => by + x * spn + (y - by) * cp;
    const hy = by + bh * 0.2, L = L0 * (1 - 0.3 * lie);
    const A = lerp(0.3, 0.62, run) * g;
    const fx = bl * 0.27, bx = -bl * 0.29;
    // 远侧的腿（暗一些）
    op(M.wool ? 'darkF' : 'far');
    legQ(M, rx(fx, hy) - 0.8, ry(fx, hy), L, true, ph + Math.PI, A, g, lie);
    legQ(M, rx(bx, hy) - 0.8, ry(bx, hy), L, false, ph, A, g, lie);
    if (M.tail === 'horse' || M.tail === 'lion' || M.tail === 'tuft') op('body');
    // 尾（在躯干之后画，免得盖住臀）
    const t0x = rx(-bl * 0.47, by - bh * 0.22), t0y = ry(-bl * 0.47, by - bh * 0.22);
    const sway = Math.sin(W.t * 1.3 + a.seed * 7) * 0.5 + (a.gait * Math.sin(ph) * 0.4);
    if (M.tail === 'horse') {
      op('dark');
      const n = 5;
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1);
        SP_[2 * i] = t0x - k * (3 + 3 * g + run * 5) + Math.sin(k * 2 + sway) * 1.2 * k - k * k * 1.5;
        SP_[2 * i + 1] = t0y + k * (bh * 0.95 + M.leg * 0.45) * (1 - run * 0.35);
      }
      for (let i = 0; i < n; i++) { const over = SP_[2 * i + 1] + 0.8; if (over > 0) { SP_[2 * i + 1] = -0.8; SP_[2 * i] -= over; } }
      strand(SP_, n, 3.2, 1.2);
    } else if (M.tail === 'lion' || M.tail === 'tuft') {
      op(M.tail === 'lion' ? 'body' : 'far');
      const n = 5, len = M.tail === 'lion' ? bh * 1.5 : bh * 1.3;
      for (let i = 0; i < n; i++) {
        const k = i / (n - 1);
        const cx = M.tail === 'lion' ? -k * len * 0.55 - Math.sin(k * 3.1) * 1.5 : -k * 1.5;
        SP_[2 * i] = t0x + cx + sway * k * 1.6;
        SP_[2 * i + 1] = t0y + k * len * (M.tail === 'lion' ? 0.8 - k * k * 0.55 : 0.95);
      }
      // 卧下时尾巴顺着地面，不钻进土里
      for (let i = 0; i < n; i++) { const over = SP_[2 * i + 1] + 0.6; if (over > 0) { SP_[2 * i + 1] = -0.6; SP_[2 * i] -= over * 0.9; } }
      strand(SP_, n, 1.3, 0.8);
      a._tuftX = SP_[2 * (n - 1)]; a._tuftY = Math.min(SP_[2 * (n - 1) + 1], -1.2);
    }
    // 近侧的腿
    op(M.wool ? 'dark' : 'body');
    legQ(M, rx(fx, hy) + 0.5, ry(fx, hy), L, true, ph, A, g, lie);
    legQ(M, rx(bx, hy) + 0.5, ry(bx, hy), L, false, ph + Math.PI, A, g, lie);
    if (M.wool) op('body');
    // 躯干
    if (M.wool) {
      ell(0, by, bl * 0.47, bh * 0.5, pitch);
      for (let i = 0; i < 6; i++) {
        const k = i / 5, x = lerp(-bl * 0.4, bl * 0.3, k), y = by + (i % 2 ? -bh * 0.1 : bh * 0.06);
        const r = bh * (i % 2 ? 0.44 : 0.4);
        ell(rx(x, y), ry(x, y), r, r, 0);
      }
      ell(rx(-bl * 0.5, by - bh * 0.1), ry(-bl * 0.5, by - bh * 0.1), 1.8, 2.2, 0.4);
    } else {
      ell(0, by, bl * 0.5, bh * 0.5, pitch);
      if (M.chest) ell(rx(bl * 0.27, by + bh * 0.05), ry(bl * 0.27, by + bh * 0.05), bl * 0.22 * M.chest, bh * 0.52 * M.chest, pitch);
      if (M.rump) ell(rx(-bl * 0.29, by - bh * 0.02), ry(-bl * 0.29, by - bh * 0.02), bl * 0.22 * M.rump, bh * 0.51 * M.rump, pitch);
      if (M.flat) {                                   // 牛：平直的背与髋角
        ell(rx(-bl * 0.02, by - bh * 0.1), ry(-bl * 0.02, by - bh * 0.1), bl * 0.47, bh * 0.4, pitch);
        ell(rx(-bl * 0.36, by - bh * 0.3), ry(-bl * 0.36, by - bh * 0.3), bl * 0.13, bh * 0.3, pitch);
      }
      if (M.dewlap) ell(rx(bl * 0.4, by + bh * 0.2), ry(bl * 0.4, by + bh * 0.2), bl * 0.08, bh * 0.36, pitch - 0.3);
      if (M.tail === 'up') {
        const tx = rx(-bl * 0.49, by - bh * 0.3), ty = ry(-bl * 0.49, by - bh * 0.3);
        seg(tx, ty, tx - 2.2, ty - 1.9 - Math.max(0, sway) * 0.6, 2.0, 0.5);
      }
    }
    // 颈与头
    const al = a.neck;
    const sx = rx(bl * 0.36, by - bh * 0.05), sy = ry(bl * 0.36, by - bh * 0.05);
    const nx = sx + Math.cos(al) * M.neck, ny = sy - Math.sin(al) * M.neck;
    if (!M.wool) seg(sx, sy, nx, ny, M.nw[0], M.nw[1]);
    else seg(sx - 1, sy, nx, ny, M.nw[0], M.nw[1]);
    ell(nx, ny, M.nw[1] * 0.5, M.nw[1] * 0.5, 0);
    if (M.hmane) {
      op('dark');
      const ux = Math.cos(al), uy = -Math.sin(al), px = uy, py = -ux;   // 颈的上缘法向
      const w0 = M.nw[0] * 0.42, w1 = M.nw[1] * 0.5;
      seg(sx + px * w0 - ux * 1.5, sy + py * w0 - uy * 1.5, nx + px * w1 + ux * 1.2, ny + py * w1 + uy * 1.2, 2.2, 1.4);
    }
    if (M.mane && a.sex === 0) {
      op('dark');
      ell(nx - Math.cos(al) * 1.2, ny + Math.sin(al) * 1.2 + 0.4, M.hh * 0.98, M.hh * 1.12, -al * 0.5);
      ell(sx + 0.5, sy + bh * 0.12, bh * 0.36, bh * 0.52, 0.3);
    }
    if (M.mane || M.hmane || M.wool) op(M.wool ? 'dark' : 'head');
    const be = al - (al > 0 ? M.hd : M.hd * 0.35) + a.headTilt;
    const fxv = Math.cos(be), fyv = -Math.sin(be);
    const uxv = fyv, uyv = -fxv;                                 // 头的"上"方向
    const cx = nx + fxv * M.hl * 0.28, cy = ny + fyv * M.hl * 0.28;
    ell(cx, cy, M.hl * 0.38, M.hh * 0.5, -be);
    const mx = nx + fxv * M.hl * 0.66, my = ny + fyv * M.hl * 0.66;
    ell(mx, my, M.hl * 0.32, M.hh * 0.37 * M.muz, -be);
    // 耳
    const ex = cx - fxv * M.hl * 0.12 + uxv * M.hh * 0.38, ey = cy - fyv * M.hl * 0.12 + uyv * M.hh * 0.38;
    const flick = a.ear || 0;
    if (M.earOut) {
      seg(ex, ey, ex - fxv * M.ear * 0.9 + uxv * M.ear * (0.25 + flick), ey - fyv * M.ear * 0.9 + uyv * M.ear * (0.25 + flick), 1.6, 0.7);
    } else {
      seg(ex, ey, ex - fxv * M.ear * 0.5 + uxv * M.ear * (0.9 + flick * 0.3), ey - fyv * M.ear * 0.5 + uyv * M.ear * (0.9 + flick * 0.3), M.ear * 0.55, 0.4);
    }
    if (M.beard) seg(mx - fxv * 0.8 - uxv * M.hh * 0.3, my - fyv * 0.8 - uyv * M.hh * 0.3, mx - fxv * 1.8 - uxv * (M.hh * 0.3 + 2.4), my - fyv * 1.8 - uyv * (M.hh * 0.3 + 2.4), 1.2, 0.3);
    // 角
    if (M.horn === 'goat') {
      const hx = cx + uxv * M.hh * 0.42, hy2 = cy + uyv * M.hh * 0.42;
      limb(hx, hy2, hx - fxv * 1.6 + uxv * 3.0, hy2 - fyv * 1.6 + uyv * 3.0, hx - fxv * 4.2 + uxv * 2.6, hy2 - fyv * 4.2 + uyv * 2.6, 1.4, 1.0, 0.3, false);
    }
    if (M.horn === 'cow') {
      op('acc');
      const hx = cx + uxv * M.hh * 0.4 - fxv * 0.8, hy2 = cy + uyv * M.hh * 0.4 - fyv * 0.8;
      limb(hx, hy2, hx + uxv * 2.2 - fxv * 0.6, hy2 + uyv * 2.2 - fyv * 0.6, hx + uxv * 3.1 + fxv * 1.2, hy2 + uyv * 3.1 + fyv * 1.2, 1.5, 1.0, 0.35, false);
    }
    if (M.antler && a.sex === 0) {
      op('dark');
      const hx = cx + uxv * M.hh * 0.45 - fxv * 0.5, hy2 = cy + uyv * M.hh * 0.45 - fyv * 0.5;
      const bx2 = hx + uxv * 5.5 - fxv * 2.4, by2 = hy2 + uyv * 5.5 - fyv * 2.4;
      const tx = bx2 + uxv * 3.2 - fxv * 3.2, ty = by2 + uyv * 3.2 - fyv * 3.2;
      limb(hx, hy2, bx2, by2, tx, ty, 1.0, 0.8, 0.35, false);
      seg(hx + uxv * 2.4 - fxv * 1.0, hy2 + uyv * 2.4 - fyv * 1.0, hx + uxv * 4.6 + fxv * 1.8, hy2 + uyv * 4.6 + fyv * 1.8, 0.75, 0.3);
      seg(bx2, by2, bx2 + uxv * 3.4 + fxv * 0.9, by2 + uyv * 3.4 + fyv * 0.9, 0.7, 0.3);
    }
    if (M.tail === 'lion' || M.tail === 'tuft') {
      op('dark');
      ell(a._tuftX, a._tuftY + 0.5, 1.1, 1.6, 0);
    }
  }

  function buildEle(a) {
    const M = a.M, lie = a.lie, g = a.gait, ph = a.ph;
    const bl = M.bl, bh = M.bh, L0 = M.leg + bh * 0.24;
    const bob = -0.03 * g * L0 * Math.abs(Math.cos(ph));
    const by = lerp(-(M.leg + bh * 0.5), -bh * 0.45, lie) + bob;
    const hy = by + bh * 0.26, L = L0 * (1 - 0.35 * lie);
    const A = 0.24 * g;
    const col = (x0, p, front) => {
      const s = Math.sin(p), c = Math.cos(p);
      let u = A * s + (front ? 0.02 : -0.04), l = u - (front ? 1 : -0.6) * Math.max(0, c) * g * 0.45;
      if (lie > 0.001) { u = lerp(u, 1.35, lie); l = lerp(l, -1.5, lie); }
      const kx = x0 + Math.sin(u) * L * 0.52, ky = hy + Math.cos(u) * L * 0.52;
      limb(x0, hy, kx, ky, kx + Math.sin(l) * L * 0.48, Math.min(0.2, ky + Math.cos(l) * L * 0.48), M.lw[0] * (front ? 1 : 1.12), M.lw[1], M.lw[2]);
    };
    op('far');
    col(bl * 0.27 - 1.2, ph + Math.PI, true);
    col(-bl * 0.28 - 1.2, ph, false);
    // 尾
    const sw = Math.sin(W.t * 1.1 + a.seed * 5) * 1.2;
    seg(-bl * 0.49, by - bh * 0.12, -bl * 0.53 + sw * 0.4, by + bh * 0.42, 1.1, 0.7);
    ell(-bl * 0.53 + sw * 0.4, by + bh * 0.46, 0.8, 1.4, 0);
    op('body');
    col(bl * 0.27 + 0.8, ph, true);
    col(-bl * 0.28 + 0.8, ph + Math.PI, false);
    ell(0, by, bl * 0.5, bh * 0.5, 0);
    ell(bl * 0.02, by - bh * 0.1, bl * 0.4, bh * 0.46, 0);
    ell(-bl * 0.28, by + bh * 0.02, bl * 0.25, bh * 0.49, 0);
    // 头：几乎无颈，额头高耸
    const tilt = clamp((a.neck - 0) * 0.3, -0.35, 0.3);
    const hx = bl * 0.5, hyy = by - bh * 0.16 - tilt * 4;
    ell(hx, hyy, 7.4, 8.2, -tilt);
    ell(hx + 2.6, hyy - 3.6, 5.2, 5.0, 0);
    // 鼻：吃草时伸到地上并卷起，张望时向前扬起
    const graze = c01(-a.neck / 1.0), raise = c01(a.neck / 0.8);
    const tb = 1.2 * Math.sin(W.t * 0.9 + a.seed * 3);
    const n = 6, bx0 = hx + 5.2, by0 = hyy + 3.2;
    const reach = -by0 - 1;
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1);
      const hang = [bx0 + k * 2.5 + Math.sin(k * 2.2) * tb * k, by0 + k * reach * 0.94];
      const curl = [bx0 + 2 + k * 5 + k * k * 3, by0 + k * reach * 0.98 - k * k * k * 3.2];
      const up = [bx0 + 3 + k * 7 - k * k * 4, by0 + 2 - k * 9 + k * k * 1];
      let x = hang[0], y = hang[1];
      x = lerp(x, curl[0], graze); y = lerp(y, curl[1], graze);
      x = lerp(x, up[0], raise); y = lerp(y, up[1], raise);
      SP_[2 * i] = x; SP_[2 * i + 1] = Math.min(y, -0.4);
    }
    strand(SP_, n, 4.6, 1.8);
    // 耳（扇动）
    op('dark');
    const flap = Math.sin(W.t * 1.4 + a.seed * 9) * 0.12;
    ell(hx - 3.4, hyy + 1.4, 5.2, 7.6, 0.18 + flap);
    // 牙
    op('acc');
    limb(hx + 4.4, hyy + 5.4, hx + 7.6, hyy + 7.6, hx + 10, hyy + 6.0, 1.5, 1.1, 0.4, false);
  }

  function buildRabbit(a) {
    const g = a.gait, lie = a.lie;
    const hop = g > 0.02 ? Math.max(0, Math.sin(a.ph)) : 0;
    const lift = hop * 4.5 * Math.min(1, g * 1.5);
    const st = hop * Math.min(1, g * 1.5);
    const nib = c01(-a.neck);                 // 低头啃草
    const low = lie * 0.9;
    op('far');
    // 远耳
    const hx = 3.7 + st * 1.2 + nib * 0.8, hy = -5.3 - lift + nib * 2.6 + low * 1.6;
    const earBack = 0.6 + low * 2.4 + a.ear * 0.6;
    seg(hx - 0.8, hy - 1.2, hx - 1.8 - earBack, hy - 5.8 + low * 2.4, 1.3, 0.8);
    op('body');
    ell(-2.4 - st * 1.8, -0.6 - lift * 0.3, 2.4, 0.8, 0);            // 后脚
    ell(-2.2, -2.5 - lift + low * 0.7, 2.6, 2.6 - low * 0.5, 0);    // 臀
    ell(0.2 + st * 0.6, -3.1 - lift + low * 0.9, 4.2 + st * 1.4, 2.8 - low * 0.4, -0.12 + st * 0.28);
    seg(2.8 + st * 1.4, -2.2 - lift, 3.4 + st * 2.6, -0.2 - lift * 0.35, 1.1, 0.8);   // 前爪
    ell(hx, hy, 2.05, 1.85, 0.2);
    seg(hx - 0.3, hy - 1.3, hx - 1.1 - earBack, hy - 6.2 + low * 2.6, 1.5, 0.9);
    op('acc');
    ell(-4.5 - st * 0.8, -3.6 - lift + low, 1.25, 1.25, 0);
  }

  // ════════════════════════════════════════════════════════════
  //  人：抽象、优雅的小剪影，没有面孔
  // ════════════════════════════════════════════════════════════
  const HM = { thigh: 7.4, shin: 7.2, torso: 8.2, neck: 1.35, head: 1.95, ua: 5.2, fa: 5.0 };
  const POSE = {
    stand: { hipH: 14.5, lean: 0.03, rot: 0, head: 0, nTh: 0.07, nSh: 0.02, fTh: -0.09, fSh: -0.03, nUa: 0.12, nFa: 0.24, fUa: -0.13, fFa: -0.04 },
    sit:   { hipH: 3.0, lean: -0.04, rot: 0, head: 0.05, nTh: 2.2, nSh: 0.2, fTh: 2.05, fSh: 0.3, nUa: 0.85, nFa: 1.8, fUa: 0.78, fFa: 1.65 },
    lean:  { hipH: 2.5, lean: -0.3, rot: 0, head: 0.25, nTh: 1.5, nSh: 1.45, fTh: 2.05, fSh: 0.35, nUa: -0.45, nFa: -0.38, fUa: -0.52, fFa: -0.46 },
    lie:   { hipH: 2.0, lean: 0, rot: -1.5708, head: 0, nTh: 0.62, nSh: -0.5, fTh: 0.02, fSh: 0.02, nUa: 0.12, nFa: 0.2, fUa: -0.12, fFa: -0.05 },
  };
  const PK = Object.keys(POSE.stand);
  const pcopy = (o, src) => { for (let i = 0; i < PK.length; i++) o[PK[i]] = src[PK[i]]; return o; };

  function buildHuman(h, P) {
    const k = h.prop;               // 比例：孩子的头更大，四肢更短
    const woman = h.kind === 'woman' || (h.kind === 'child' && h.sex === 1);
    const lean = P.lean;
    const ux = Math.sin(lean), uy = -Math.cos(lean);           // 躯干向上
    const px = Math.cos(lean), py = Math.sin(lean);            // 躯干向前
    const tor = HM.torso * k.t;
    const shx = ux * tor, shy = uy * tor;
    const th = HM.thigh * k.l, sh = HM.shin * k.l, ua = HM.ua * k.a, fa = HM.fa * k.a;
    const lw0 = (woman ? 2.75 : 2.7) * k.w, lw1 = (woman ? 1.55 : 1.7) * k.w, lw2 = 1.0 * k.w;
    const aw0 = (woman ? 1.35 : 1.6) * k.w, aw1 = (woman ? 1.05 : 1.2) * k.w, aw2 = 0.85 * k.w;
    const leg = (tA, sA, off) => {
      const kx = off + Math.sin(tA) * th, ky = Math.cos(tA) * th;
      const fx = kx + Math.sin(sA) * sh, fy = ky + Math.cos(sA) * sh;
      limb(off, 0, kx, ky, fx, fy, lw0, lw1, lw2);
      seg(fx - Math.cos(sA) * 0.3, fy + Math.sin(sA) * 0.3, fx + Math.cos(sA) * 2.0 * k.l, fy - Math.sin(sA) * 2.0 * k.l + 0.25, 1.05 * k.w, 0.6 * k.w);
    };
    const arm = (uA, fA, near) => {
      const sjx = shx - ux * 1.0 + (near ? px * 0.35 : -px * 0.35), sjy = shy - uy * 1.0 + (near ? py * 0.35 : -py * 0.35);
      const ex = sjx + Math.sin(uA) * ua, ey = sjy + Math.cos(uA) * ua;
      const hx = ex + Math.sin(fA) * fa, hy = ey + Math.cos(fA) * fa;
      limb(sjx, sjy, ex, ey, hx, hy, aw0, aw1, aw2);
      ell(hx + Math.sin(fA) * 0.5, hy + Math.cos(fA) * 0.5, 0.62 * k.w, 0.78 * k.w, -fA);
      return [hx, hy];
    };
    // 远侧：腿与臂（暗一些）
    op('far');
    leg(P.fTh, P.fSh, -0.35);
    arm(P.fUa, P.fFa, false);
    // 长发（女人）：自头顶垂到背上，随风轻摆
    const hd = lean - P.head * 0.55;
    const hr = HM.head * k.h;
    const hcx = shx + Math.sin(hd) * (HM.neck * k.t + hr * 1.05), hcy = shy - Math.cos(hd) * (HM.neck * k.t + hr * 1.05);
    if (woman) {
      op('hair');
      const bx = -Math.cos(hd), by = -Math.sin(hd);           // 头后方
      const dn = [Math.sin(lean) * 0.4, 1];                     // 大致向下
      const wind = (W.wind || 0) * 0.8 * (h.face < 0 ? 1 : -1);
      const L = hr * (h.kind === 'child' ? 2.6 : 3.6);
      for (let i = 0; i < 6; i++) {
        const t = i / 5;
        SP_[2 * i] = hcx + bx * hr * (0.25 + 0.5 * t) + dn[0] * L * t + wind * t * t * 1.4 + Math.sin(W.t * 1.3 + h.seed * 9 + t * 2) * 0.25 * t;
        SP_[2 * i + 1] = hcy - hr * 0.55 * (1 - t) + by * hr * 0.2 + dn[1] * L * t;
      }
      strand(SP_, 6, hr * 1.7, hr * 0.55);
      ell(hcx + bx * hr * 0.22, hcy - hr * 0.1, hr * 1.08, hr * 1.1, hd);
    }
    op('body');
    leg(P.nTh, P.nSh, 0.35);
    // 躯干：髋 → 腰 → 胸 → 肩（略呈四分之三侧身，肩宽于侧影）
    const hipW = (woman ? 4.5 : 3.8) * k.w, waW = (woman ? 2.85 : 3.3) * k.w, chW = (woman ? 4.0 : 5.0) * k.w, shW = (woman ? 4.1 : 5.4) * k.w;
    const fr = woman ? 0.45 * k.w : 0.1;
    const pt = (t, w, side, i) => { PB[2 * i] = ux * tor * t + px * w * side; PB[2 * i + 1] = uy * tor * t + py * w * side; };
    pt(0.0, hipW / 2, -1, 0); pt(0.44, waW / 2, -1, 1); pt(0.76, chW / 2, -1, 2); pt(0.97, shW / 2 - 0.3, -1, 3);
    pt(0.97, shW / 2 - 0.3, 1, 4); pt(0.72, chW / 2 + fr, 1, 5); pt(0.44, waW / 2, 1, 6); pt(0.0, hipW / 2, 1, 7);
    polyN(8);
    ell(0, 0.2, hipW * 0.5, hipW * 0.42, lean);
    ell(shx - ux * 0.55, shy - uy * 0.55, shW * 0.5, 1.15, lean);
    seg(shx, shy, hcx - Math.sin(hd) * hr * 0.6, hcy + Math.cos(hd) * hr * 0.6, 1.25 * k.w, 1.1 * k.w);
    h._head = [hcx, hcy, hr];
    op('head');
    ell(hcx, hcy, hr * 0.95, hr * 1.1, hd);
    const gz = P.head * 0.9;            // 视线：前方偏上（没有面孔，只有头的朝向）
    ell(hcx + Math.cos(hd - gz) * hr * 0.42, hcy + Math.sin(hd - gz) * hr * 0.42 + hr * 0.12, hr * 0.62, hr * 0.62, 0);
    // 近侧的臂（盖在躯干上）
    h._hand = arm(P.nUa, P.nFa, true);
    h._chest = [shx * 0.72 + px * 0.5, shy * 0.72 + py * 0.5];
  }

  // ── 缓存的光晕贴图（萤火、胸中的光）──────────────────────────
  let GLOW = null, FGLOW = null;
  function mkGlow(c, a0, S) {
    S = S || 64;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d'), h = S / 2;
    const gr = g.createRadialGradient(h, h, 0, h, h, h);
    gr.addColorStop(0, U.rgba(c[0], c[1], c[2], a0));
    gr.addColorStop(0.25, U.rgba(c[0], c[1], c[2], a0 * 0.45));
    gr.addColorStop(0.6, U.rgba(c[0], c[1], c[2], a0 * 0.1));
    gr.addColorStop(1, U.rgba(c[0], c[1], c[2], 0));
    g.fillStyle = gr;
    g.fillRect(0, 0, S, S);
    return cv;
  }

  // ════════════════════════════════════════════════════════════
  //  生灵的出生
  // ════════════════════════════════════════════════════════════
  const EM = 2.1;          // 走兽成形的时长（秒）
  const EMH = 9.6;         // 人：成形、得气、坐起、站立、仰望
  // 成形时尘粒聚往的局部点（按物种预先取样）
  const MOTE_PTS = {};
  function motePts(M) {
    if (MOTE_PTS[M.key]) return MOTE_PTS[M.key];
    const pts = [], by = -(M.leg + M.bh * 0.5);
    for (let i = 0; i < 28; i++) {
      if (M.type === 'r') { pts.push([rnd(-4.5, 5), rnd(-8, -1)]); continue; }
      if (i < 20) {
        const a = Math.random() * TAU, r = Math.sqrt(Math.random());
        pts.push([Math.cos(a) * r * M.bl * 0.5, by + Math.sin(a) * r * M.bh * 0.5]);
      } else if (i < 24) {
        pts.push([M.bl * (0.28 * (i % 2 ? 1 : -1)), rnd(by, 0)]);
      } else {
        const hx = M.type === 'e' ? M.bl * 0.55 : M.bl * 0.36 + Math.cos(M.up) * M.neck;
        const hy = M.type === 'e' ? by : by - Math.sin(M.up) * M.neck;
        pts.push([hx + rnd(-2, 3), hy + rnd(-2, 2)]);
      }
    }
    return (MOTE_PTS[M.key] = pts);
  }
  function mkMotes(pts, spread) {
    const m = [];
    for (let i = 0; i < pts.length; i++) {
      m.push({ tx: pts[i][0], ty: pts[i][1], sx: rnd(-spread, spread), sy: rnd(-1.5, 0.5), d: rnd(0, 0.35), sw: rnd(-1, 1) });
    }
    return m;
  }

  function newAnimal(sp, layer, x, v, instant) {
    const M = SPEC[sp];
    const a = {
      id: uid++, sp, M, cls: M.cls, type: M.type, layer, x, v, tx: x, tv: v,
      face: Math.random() < 0.5 ? -1 : 1, dir: 1, spd: 0, spdT: 0, ph: Math.random() * TAU,
      gait: 0, run: 0, neck: M.up, neckT: M.up, headTilt: 0, lie: 0, lieT: 0, pitch: 0, ear: 0,
      st: 'look', stT: 0, dur: rnd(1, 3), seed: Math.random(), size: rnd(0.9, 1.08),
      sex: 0, col: M.col, col2: M.col2 || M.col, acc: M.acc || M.col,
      eT: instant ? 99 : 0, motes: null, alpha: 1, S: 1, y: 0,
      drinkAt: W.t + rnd(40, 140), home: x, fleeT: 0, joy: 0, curious: 0, named: false,
    };
    a.dir = a.face;
    if (!instant) a.motes = mkMotes(motePts(M), M.bl * 0.45);
    return a;
  }
  // 同一物种的第二只：另一性别 / 另一毛色
  function individuate(a, nth) {
    const M = a.M;
    a.sex = nth % 2;
    if (M.alt && nth % 2 === 1) a.col = M.alt;
    if (a.sp === 'lion' && a.sex === 1) a.size *= 0.9;
    if (a.sp === 'deer' && a.sex === 1) a.size *= 0.92;
    if (a.sp === 'elephant' && a.sex === 1) a.size *= 0.88;
    if (a.sp === 'sheep') a.size *= rnd(0.9, 1.05);
  }
  const countSp = sp => { let n = 0; for (const a of AN) if (a.sp === sp) n++; return n; };

  function layerFor(sp) {
    if (sp === 'horse') {
      const s = SPAN[1] || scan(1);
      if (s && (s[1] - s[0]) > 150 * cu()) return 1;
    }
    if (sp === 'elephant') {
      const s = span(2);
      if ((s[1] - s[0]) / cu() < 420) { const m = SPAN[1] || scan(1); if (m) return 1; }
    }
    return 2;
  }

  // 走兽出现：大地隆起，尘土升起聚成其形
  function spawnAnimal(sp, anchorX, k, instant) {
    const layer = layerFor(sp);
    const u = cu() * LK[layer];
    const s = span(layer);
    let x, v;
    if (instant) {
      x = clampX(layer, anchorX + rnd(-1, 1) * (s[1] - s[0]) * 0.42, 20 * u);
      v = layer === 2 ? Math.pow(Math.random(), 1.3) * VMAX[2] * 0.92 : rnd(0.05, 0.4);
    } else {
      const pair = Math.floor(k / 2), side = pair % 2 ? 1 : -1, ring = Math.ceil(pair / 2);
      x = anchorX + side * ring * 34 * u + (k % 2 ? 1 : -1) * 8 * u + rnd(-4, 4) * u;
      x = clampX(layer, x, 16 * u);
      v = layer === 2 ? 0.04 + (pair % 3) * 0.24 * VMAX[2] + rnd(0, 0.05) : rnd(0.05, 0.3);
    }
    const a = newAnimal(sp, layer, x, v, instant);
    individuate(a, countSp(sp));
    a.home = x;
    AN.push(a);
    if (instant) {
      a.st = 'graze'; a.stT = rnd(0, 4); a.dur = rnd(3, 10); a.neck = a.neckT = a.M.grazeA;
      if (sp === 'lion') { a.st = 'rest'; a.lie = a.lieT = 1; a.neck = a.neckT = 0.25; a.dur = rnd(20, 40); }
      if (W.night > 0.5) { a.st = 'sleep'; a.lie = a.lieT = 1; }
    } else {
      a.st = 'emerge'; a.neck = a.neckT = a.M.up * 0.6;
      const y = footY(layer, x, v);
      if (fxOK()) {
        if (layer === 2) GS.fx.dust(x, y, 16, [176, 140, 96], 10 * u);
        else for (let i = 0; i < 10; i++) GS.fx.add({ x: x + rnd(-6, 6) * u, y: y - rnd(0, 3), vx: rnd(-12, 12), vy: rnd(-30, -8), max: rnd(0.7, 1.4), size: rnd(0.6, 1.4), c: [176, 140, 96], drag: 1.8, grav: 10, a: 0.7, pass: 'mid' });
      }
    }
    return a;
  }

  // ── 人 ──────────────────────────────────────────────────────
  const PROP = {
    man: { t: 1.0, l: 1.0, a: 1.0, w: 1.0, h: 1.0 },
    woman: { t: 0.97, l: 0.97, a: 0.97, w: 0.94, h: 0.98 },
    child: { t: 0.86, l: 0.8, a: 0.85, w: 0.95, h: 1.3 },
  };
  function newHuman(kind, x, v, instant) {
    const h = {
      id: uid++, kind, x, v, tx: x, tv: v, face: 1, dir: 1, spd: 0, spdT: 0, ph: Math.random() * TAU, gait: 0,
      P: pcopy({}, instant ? POSE.stand : POSE.lie), TP: pcopy({}, instant ? POSE.stand : POSE.lie), pose: instant ? 'stand' : 'lie',
      prop: PROP[kind], size: kind === 'child' ? rnd(0.62, 0.72) : kind === 'woman' ? 0.95 : 1.0, sex: 0,
      eT: instant ? 99 : 0, motes: null, alpha: 1, S: 1, y: 0, seed: Math.random(),
      act: null, actT: 0, actDur: 0, phase: 0, look: 0, lookT: 0, raise: 0, raiseT: 0, reach: 0, linger: 0,
      holding: false, fruit: null, flash: -1, breathed: false, lookX: 0, lookY: 0, _hand: [0, 0], _chest: [0, -8], _head: [0, -12, 2],
      playA: Math.random() * TAU, nameTarget: null,
    };
    if (kind === 'child') h.sex = (HU.filter(o => o.kind === 'child').length) % 2;
    if (!instant) {
      const pts = [];
      for (let i = 0; i < 46; i++) {
        const t = Math.random();
        pts.push([lerp(-12, 13, t) * 1, -rnd(0.4, 3.4) - (t < 0.12 ? 1.2 : 0)]);
      }
      h.motes = mkMotes(pts, 14);
    }
    return h;
  }
  function spawnHuman(kind, anchorX, instant) {
    const u = cu();
    const adults = HU.filter(o => o.kind !== 'child');
    let x, v;
    if (kind === 'child') {
      const c = adults.length ? adults[0].x : anchorX;
      const n = HU.length - 2;
      x = c + (n % 2 ? 1 : -1) * (18 + 12 * Math.floor(n / 2)) * u + rnd(-4, 4) * u;
      v = 0.16 + rnd(0, 0.12);
    } else {
      x = anchorX + (kind === 'man' ? -9 : 9) * u;
      v = 0.1 + (kind === 'woman' ? 0.015 : 0);
    }
    x = clampX(2, x, 10 * u);
    const h = newHuman(kind, x, v, instant);
    h.face = h.dir = kind === 'woman' ? -1 : 1;
    HU.push(h);
    if (!instant && fxOK()) {
      const y = footY(2, x, v);
      GS.fx.dust(x, y, kind === 'child' ? 26 : 40, HUMAN_DUST, 14 * u);
    }
    return h;
  }

  // ── 昆虫的槽位：甲虫 / 昼为蝶夜为萤 / 只在夜里发光的萤 ──────────
  function creeperKinds(n) {
    const beetles = Math.min(4, Math.round(n * 0.11)), bf = Math.min(14, Math.round(n * 0.34));
    return { beetles, bf };
  }
  function newCreeper(i, n, anchorX, instant) {
    const u = cu();
    const kinds = creeperKinds(Math.max(n, i + 1));
    const s = span(2);
    const c = { id: uid++, i, seed: Math.random(), age: instant ? 99 : 0, born: instant ? 0 : W.t };
    if (i < kinds.beetles) {
      c.kind = 'beetle';
      c.x = clampX(2, instant ? rnd(s[0], s[1]) : anchorX + rnd(-50, 50) * u, 6 * u);
      c.v = rnd(0.08, VMAX[2]); c.dir = Math.random() < 0.5 ? -1 : 1; c.spd = 0; c.pause = rnd(0, 3); c.leg = 0;
      if (!instant && fxOK()) GS.fx.dust(c.x, footY(2, c.x, c.v), 6, [150, 120, 84], 3 * u);
      return c;
    }
    c.kind = i < kinds.beetles + kinds.bf ? 'bf' : 'ff';
    // 萤：栖在近地的草上
    c.hx = instant ? rnd(s[0], s[1]) : clampX(2, anchorX + rnd(-160, 160) * u, 0);
    c.hv = Math.pow(Math.random(), 0.8) * Math.min(0.85, VMAX[2] + 0.2);
    c.hh = rnd(6, 38);
    c.bp = rnd(1.0, 1.6); c.bph = Math.random() * TAU; c.att = 0; c.fx = c.hx; c.fy = 0; c.fa = 0;
    if (c.kind === 'bf') {
      c.col = BUTTER[i % BUTTER.length];
      c.bs = rnd(0.85, 1.15);
      const x = instant ? rnd(s[0], s[1]) : clampX(2, anchorX + rnd(-40, 40) * u, 0);
      const y = footY(2, x, rnd(0, 0.4)) - (instant ? rnd(10, 60) * u : 2 * u);
      c.x = c.fx0 = x; c.y = c.fy0 = y; c.tx = x; c.ty = y - rnd(20, 50) * u; c.k = 0; c.dur = rnd(1.5, 3);
      c.perch = 0; c.flap = Math.random() * TAU; c.lx = rnd(1.3, 2.4); c.ly = rnd(2.1, 3.3); c.lp = Math.random() * TAU;
      c.onFlower = false; c.vx = 0;
      if (!instant && fxOK()) GS.fx.sparkle(x, y, 5, [255, 244, 210], 4 * u, 'air');
    }
    return c;
  }

  // ════════════════════════════════════════════════════════════
  //  数目的同步
  // ════════════════════════════════════════════════════════════
  function popN(kind) { const p = W.pop && W.pop[kind]; return p && p.n > 0 ? p.n : 0; }
  function syncPops(forceInstant) {
    let addC = [], addB = [];
    const hadG = GQ.length, hadH = HQ.length, hadC = CQ.length;
    for (const kind of ['cattle', 'beast']) {
      const p = W.pop[kind];
      if (!p) continue;
      const want = kind === 'beast' ? beastWant(p.n) : p.n;
      const seq = kind === 'beast' ? BEAST_SEQ : CATTLE_SEQ;
      const inst = forceInstant || p.instant;
      while (made[kind] < want) {
        const sp = seq[made[kind] % seq.length];
        made[kind]++;
        if (inst) spawnAnimal(sp, clampX(2, p.x || W.w * 0.72, 0), 0, true);
        else (kind === 'cattle' ? addC : addB).push({ sp, kind });
      }
    }
    // 成对交替：一对羊、一对鹿、一对牛、一对狮……
    while (addC.length || addB.length) {
      const takeC = (!addB.length) || (addC.length && (pairIdx % 2 === 0));
      const src = takeC ? addC : addB;
      const sp = src[0].sp;
      let n = 0;
      while (src.length && src[0].sp === sp && n < 2) { const it = src.shift(); GQ.push({ sp: it.sp, kind: it.kind, pair: pairIdx, k: n }); n++; }
      pairIdx++;
    }
    if (GQ.length && !hadG) next.ground = Math.max(next.ground, W.t + 0.35 / fastK());

    // 人
    const hp = W.pop.human;
    if (hp) {
      const inst = forceInstant || hp.instant;
      while (made.human < hp.n) {
        const kind = made.human === 0 ? 'man' : made.human === 1 ? 'woman' : 'child';
        made.human++;
        if (inst) spawnHuman(kind, clampX(2, hp.x || W.w * 0.7, 0), true);
        else HQ.push({ kind });
      }
      if (HQ.length && !hadH) next.human = Math.max(next.human, W.t + (HQ[0].kind === 'child' ? 1.2 : 0.4) / fastK());
    }
    // 昆虫
    const cp = W.pop.creeper;
    if (cp) {
      const inst = forceInstant || cp.instant;
      while (made.creeper < cp.n) {
        const i = made.creeper++;
        if (inst) CR.push(newCreeper(i, cp.n, cp.x || W.w * 0.72, true));
        else CQ.push({ i, n: cp.n });
      }
      if (CQ.length && !hadC) next.creeper = Math.max(next.creeper, W.t + 0.8 / fastK());
    }
  }
  function runQueues() {
    const fk = fastK();
    if (GQ.length && W.t >= next.ground) {
      const it = GQ.shift();
      const p = W.pop[it.kind] || { x: W.w * 0.72 };
      spawnAnimal(it.sp, clampX(2, p.x || W.w * 0.72, 0), it.pair * 2 + it.k, false);
      const nx = GQ[0];
      next.ground = W.t + (nx && nx.pair === it.pair ? 0.3 : 0.55) / fk;
    }
    if (HQ.length && W.t >= next.human) {
      const it = HQ.shift();
      const p = W.pop.human || { x: W.w * 0.7 };
      spawnHuman(it.kind, clampX(2, p.x || W.w * 0.7, 0), false);
      next.human = W.t + (it.kind === 'man' ? 1.3 : 0.9) / fk;
    }
    if (CQ.length && W.t >= next.creeper) {
      const it = CQ.shift();
      const p = W.pop.creeper || { x: W.w * 0.72 };
      CR.push(newCreeper(it.i, it.n, p.x || W.w * 0.72, false));
      next.creeper = W.t + 0.11 / fk;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  走兽的行为
  // ════════════════════════════════════════════════════════════
  const HERD = {};
  function herdKey(a) { return a.sp + a.layer; }
  function updHerds() {
    for (const k in HERD) { HERD[k].sx = 0; HERD[k].n = 0; HERD[k].sv = 0; }
    for (const a of AN) {
      if (a.eT < EM) continue;
      const k = herdKey(a);
      const h = HERD[k] || (HERD[k] = { sx: 0, sv: 0, n: 0, cx: 0, cv: 0 });
      h.sx += a.x; h.sv += a.v; h.n++;
    }
    for (const k in HERD) { const h = HERD[k]; if (h.n) { h.cx = h.sx / h.n; h.cv = h.sv / h.n; } }
  }
  function herdOf(a) { const h = HERD[herdKey(a)]; return h && h.n ? h : null; }
  function sheepCenter(layer) { const h = HERD['sheep' + layer] || HERD['sheep2']; return h && h.n ? h : null; }

  const awe = () => (W.lt.good >= 1 && W.lv.good < 0.985) || (W.ritual.holding && W.ritual.kind === 'behold');
  const SLOW = () => 300 * Math.max(0.6, uu()), FAST = () => 1000 * Math.max(0.6, uu());

  function setSt(a, st, dur) { a.st = st; a.stT = 0; a.dur = dur; }
  function pickTarget(a, far) {
    const M = a.M, u = cu() * LK[a.layer];
    const h = herdOf(a);
    let x;
    if (a.sp === 'lion') {
      const sc = sheepCenter(a.layer);
      const base = sc ? sc.cx : a.x;
      x = base + (a.sex ? 1 : -1) * rnd(34, 52) * u;
    } else if (h && h.n > 1 && !far) {
      const R = M.herdR * u;
      x = h.cx + rnd(-R, R);
      if (Math.abs(a.x - h.cx) > R * 1.5) x = h.cx + rnd(-R, R) * 0.5;
    } else {
      x = a.x + rnd(-1, 1) * (far ? 160 : 90) * u;
    }
    a.tx = clampX(a.layer, x, M.len * 0.5 * u);
    const vmax = VMAX[a.layer];
    a.tv = clamp(a.v + rnd(-0.12, 0.12), 0.02, vmax);
  }
  function think(a) {
    const M = a.M, r = Math.random();
    const noon = W.freeClock && W.tod > 0.46 && W.tod < 0.6;
    const restK = 1 + W.lv.sabbath * 0.5;
    if (a.sp === 'lion') {
      const sc = sheepCenter(a.layer);
      if (sc && Math.abs(a.x - sc.cx) > 70 * cu()) { pickTarget(a); setSt(a, 'walk', 30); return; }
      if (r < 0.75) { setSt(a, 'rest', rnd(14, 34)); return; }
      if (r < 0.88) { pickTarget(a); setSt(a, 'walk', 20); return; }
      setSt(a, 'look', rnd(2, 4)); return;
    }
    if (W.t > a.drinkAt && a.st !== 'drink') {
      a.drinkAt = W.t + rnd(60, 120);
      const s = span(a.layer);
      let busy = 0;
      for (const b of AN) if (b.st === 'drink') busy++;
      if (busy >= 2 || a.x - s[0] > 300 * cu() * LK[a.layer]) { a.drinkAt = W.t + rnd(20, 60); think(a); return; }
      a.tx = s[0] + rnd(2, 10) * cu() * LK[a.layer]; a.tv = rnd(0.0, 0.06);
      a.phase = 0; setSt(a, 'drink', 60); return;
    }
    a.tx = a.x;
    if ((noon && r < 0.35) || r < 0.06 * restK) { setSt(a, 'rest', rnd(10, 26) * restK); return; }
    if (r < 0.46) { setSt(a, 'graze', rnd(M.graze[0], M.graze[1])); return; }
    if (r < 0.82) { pickTarget(a, Math.random() < 0.2); setSt(a, 'walk', 25); return; }
    setSt(a, 'look', rnd(1.5, 3.2));
  }

  function lookAngleAt(a, px, py) {
    const u = a.S;
    const hy = a.y - (a.M.leg + a.M.bh) * u;
    const ang = Math.atan2(hy - py, Math.abs(px - a.x) + 1);
    return clamp(a.M.up + (ang - 0.25) * 0.7, a.M.up - 0.35, a.M.up + 0.85);
  }

  function updAnimal(a, dt) {
    const M = a.M;
    a.S = LK[a.layer] * cu() * depthK(a.layer, a.v) * a.size;
    a.y = footY(a.layer, a.x, a.v);
    if (a.eT < EM) {
      a.eT += dt * fastK();
      if (a.eT >= EM) { a.motes = null; setSt(a, 'look', rnd(1.2, 2.2)); a.shake = 0.9; }
      return;
    }
    a.stT += dt;
    const sp = W.spirit, u = cu() * LK[a.layer];
    const cx = a.x, cy = a.y - M.top * a.S * 0.5;
    const dxs = sp.x - cx, dys = sp.y - cy, ds = Math.hypot(dxs, dys);
    const night = W.night > 0.5;
    let mode = '';
    if (W.ritual.holding || awe()) mode = 'listen';
    else if (a.fleeT > 0) mode = 'flee';
    else if (M.flee && sp.speed > FAST() && ds < 230 * Math.max(0.6, uu()) && a.lie < 0.5 && (M.flee >= 1 || Math.random() < M.flee * 0.2)) {
      a.fleeT = rnd(1.4, 2.0); a.fleeDir = dxs > 0 ? -1 : 1; a.home = a.x; mode = 'flee';
    } else if (sp.speed < SLOW() && ds < 180 * Math.max(0.6, uu()) && !night) mode = 'curious';
    else if (a.joy > 0) mode = 'joy';

    let spdT = 0, neckT = M.up, lieT = 0, faceT = a.dir, pitchT = 0, run = 0;
    if (mode === 'listen') {
      faceT = sgn(dxs);
      neckT = lookAngleAt(a, sp.x, sp.y);
      lieT = a.lie > 0.5 ? 1 : 0;
      if (lieT) neckT = Math.max(0.2, neckT);
    } else if (mode === 'flee') {
      a.fleeT -= dt;
      faceT = a.fleeDir; spdT = M.walk * 3.4; run = 1; neckT = M.up + 0.1;
      a.dir = a.fleeDir;
      const s = span(a.layer);
      if ((a.x <= s[0] + 8 && a.fleeDir < 0) || (a.x >= s[1] - 8 && a.fleeDir > 0)) a.fleeT = Math.min(a.fleeT, 0.2);
      if (a.fleeT <= 0) { a.tx = clampX(a.layer, a.home, 0); setSt(a, 'walk', 20); }
    } else if (mode === 'curious') {
      faceT = sgn(dxs);
      neckT = lookAngleAt(a, sp.x, sp.y);
      a.curious = Math.min(a.curious + dt, 10);
      const stop = (46 + a.seed * 64) * Math.max(0.6, uu());
      if (M.curious !== undefined || M.cls === 'cattle') {
        if (Math.abs(dxs) > stop + 6 && a.curious > 0.8 && a.sp !== 'lion') { spdT = M.walk * 0.7; a.dir = sgn(dxs); }
      }
      lieT = a.lie > 0.5 && a.sp === 'lion' ? 1 : 0;
      if (a.st === 'sleep' || a.st === 'rest') lieT = a.lie > 0.5 ? 1 : 0;
    } else if (mode === 'joy') {
      a.joy -= dt;
      faceT = sgn(a.joyX - cx); neckT = M.up + 0.45;
    } else {
      a.curious = Math.max(0, a.curious - dt * 2);
      // 夜里卧下；黎明后陆续起身
      if (night && a.st !== 'sleep') { setSt(a, 'sleep', 1e9); a.wake = rnd(0, 6); }
      switch (a.st) {
        case 'sleep':
          lieT = 1; neckT = a.type === 'q' ? -0.25 : -0.2; pitchT = 0;
          if (W.night < 0.35) { a.wake -= dt; if (a.wake <= 0) setSt(a, 'look', rnd(1.5, 3)); }
          break;
        case 'rest':
          lieT = 1; neckT = M.up * 0.55 + 0.1;
          if (a.stT > a.dur) think(a);
          break;
        case 'graze':
          neckT = M.grazeA + Math.sin(W.t * 2.2 + a.seed * 9) * 0.05; pitchT = 0.05;
          if (a.type === 'r') neckT = -1;
          if (a.type === 'e') neckT = -0.9;
          if (Math.random() < dt * 0.15) { a.tx = clampX(a.layer, a.x + rnd(-6, 6) * u, 0); spdT = M.walk * 0.35; }
          if (Math.abs(a.tx - a.x) > 1.5 && a.stT < a.dur) spdT = M.walk * 0.3;
          if (a.stT > a.dur) think(a);
          break;
        case 'look':
          neckT = M.up + 0.22;
          if (a.stT > a.dur * 0.6 && Math.random() < dt * 0.4) a.dir = -a.dir;
          if (a.stT > a.dur) think(a);
          break;
        case 'drink': {
          const s = span(a.layer);
          if (a.phase === 0) {
            spdT = M.walk * 1.15; neckT = M.up;
            if (a.stT > 60) { think(a); break; }
            if (Math.abs(a.tx - a.x) < 2 || a.x <= s[0] + 2) { a.phase = 1; a.stT = 0; a.dur = rnd(5, 8); }
          } else {
            a.dir = -1; neckT = a.type === 'q' ? M.grazeA - 0.05 : -1; pitchT = 0.07;
            if (a.stT > a.dur) { pickTarget(a); setSt(a, 'walk', 30); }
          }
          break;
        }
        case 'walk':
        default:
          spdT = M.walk; neckT = M.up - (a.sp === 'horse' ? 0.15 : 0.05);
          if (Math.abs(a.tx - a.x) < 2 * u + 0.5 || a.stT > a.dur) think(a);
          break;
      }
    }
    // 趋近：速度、方向、颈、卧
    if (spdT > 0 && mode !== 'curious' && mode !== 'flee') {
      const d = a.tx - a.x;
      if (Math.abs(d) > 0.8) a.dir = sgn(d); else spdT = 0;
      if (mode === '' && a.st !== 'walk' && a.st !== 'drink' && Math.abs(d) < 0.8) spdT = 0;
      faceT = a.dir;
    }
    if (a.lie > 0.3 && lieT < 0.5) spdT = 0;               // 先起身，再走
    if (lieT > 0.5) spdT = 0;
    a.spd = approach(a.spd, spdT, spdT > a.spd ? 2.4 : 4.5, dt);
    if (a.spd < 0.02) a.spd = 0;
    const turning = Math.abs(a.face - faceT) > 0.3;
    a.face = approach(a.face, faceT, 6.5, dt);
    const mv = turning ? a.spd * 0.3 : a.spd;
    let nx = a.x + a.dir * mv * a.S * dt;
    if (a.spd > 0 && a.st !== 'drink' && mode !== 'flee' && mode !== 'curious') {
      a.v = approach(a.v, a.tv, 0.5 * Math.min(1, a.spd / M.walk), dt);
    }
    nx = clampX(a.layer, nx, M.len * 0.45 * a.S);
    a.x = nx;
    a.gait = c01(a.spd / M.walk);
    a.run = c01((a.spd - M.walk * 1.4) / (M.walk * 1.5));
    a.ph += (a.spd / M.stride) * Math.PI * dt * (a.type === 'r' ? 1.6 : 1);
    if (a.shake > 0) { a.shake -= dt; neckT += Math.sin(W.t * 22) * 0.35 * a.shake; a.ear = Math.sin(W.t * 30) * a.shake; }
    else a.ear = approach(a.ear, (mode === 'curious' || mode === 'listen') ? 0.3 : 0, 3, dt);
    a.neck = approach(a.neck, neckT, mode === 'flee' ? 6 : 2.6, dt);
    a.lie = approach(a.lie, lieT, 1.3, dt);
    a.pitch = approach(a.pitch, pitchT, 2, dt);
    a.headTilt = approach(a.headTilt, mode === 'listen' || mode === 'curious' ? -0.1 : 0, 2, dt);
  }

  // 同层相近的走兽彼此让开一点
  function separate(dt) {
    const n = AN.length;
    for (let i = 0; i < n; i++) {
      const a = AN[i];
      if (a.eT < EM) continue;
      for (let j = i + 1; j < n; j++) {
        const b = AN[j];
        if (b.layer !== a.layer || b.eT < EM || Math.abs(a.v - b.v) > 0.07) continue;
        const need = (a.M.len * a.S + b.M.len * b.S) * 0.36;
        const dx = b.x - a.x;
        if (Math.abs(dx) >= need) continue;
        const push = (need - Math.abs(dx)) * Math.min(1, dt * 1.5) * 0.5;
        const s = dx === 0 ? (a.id < b.id ? -1 : 1) : sgn(dx);
        const am = a.lie > 0.5 ? 0.2 : 1, bm = b.lie > 0.5 ? 0.2 : 1;
        a.x = clampX(a.layer, a.x - s * push * am, 0);
        b.x = clampX(b.layer, b.x + s * push * bm, 0);
        if (Math.abs(dx) < need * 0.5) { a.v = clamp(a.v - 0.02 * dt * am, 0.01, VMAX[a.layer]); b.v = clamp(b.v + 0.02 * dt * bm, 0.01, VMAX[b.layer]); }
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  人的行为：随日影作息
  // ════════════════════════════════════════════════════════════
  function nearTrees() {
    const T = GS.land && GS.land.treeSpots ? GS.land.treeSpots() : null;
    const out = [];
    if (!T || !T.length) return out;
    const s = span(2);
    for (const t of T) if (t.layer === 2 && t.grown > 0.9 && t.x > s[0] + 6 && t.x < s[1] - 6) out.push(t);
    return out;
  }
  function band() {
    const t = W.tod;
    if (!W.freeClock && !W.cycling) return W.night > 0.55 ? 'night' : 'day';
    if (t >= 0.8 || t < 0.21) return 'night';
    if (t < 0.29) return 'dawn';
    if (t >= 0.68) return 'dusk';
    if (t > 0.46 && t < 0.6) return 'noon';
    return 'day';
  }
  const DAY_ACTS = ['walk', 'fruit', 'sea', 'walk', 'tree'];
  function planLeader(h) {
    const b = band(), u = cu();
    h.actT = 0; h.phase = 0; h.fruit = null;
    const sab = W.lv.sabbath;
    if (b === 'night') { h.act = 'sleep'; h.actDur = 1e9; return; }
    if (b === 'dawn') { h.act = 'wake'; h.actDur = 1e9; return; }
    if (b === 'dusk') {
      if (h.act === 'sunset') { h.actDur = 1e9; return; }
      h.act = 'sunset'; h.actDur = 1e9;
      h.tx = clampX(2, h.x + rnd(-40, 40) * u, 16 * u); h.tv = 0.03;
      return;
    }
    // 安息之后：每约四十秒，人为一个活物起名
    if (sab > 0.9 && W.t > nameNext && AN.length) {
      const tg = nameCandidate(h);
      if (tg) {
        nameNext = W.t + rnd(34, 46);
        h.act = 'name'; h.nameTarget = tg; h.actDur = 30; return;
      }
    }
    let act;
    if (b === 'noon') act = 'tree';
    else {
      h.dayIdx = ((h.dayIdx || 0) + 1) % DAY_ACTS.length;
      act = DAY_ACTS[h.dayIdx];
      if (sab > 0.9 && act === 'walk' && Math.random() < 0.5) act = 'tree';
    }
    h.act = act;
    if (act === 'walk') {
      h.tx = clampX(2, h.x + (Math.random() < 0.5 ? -1 : 1) * rnd(70, 170) * u, 20 * u); h.tv = rnd(0.06, 0.22); h.actDur = 40;
    } else if (act === 'fruit') {
      const ts = nearTrees();
      if (!ts.length) { h.act = 'walk'; h.tx = clampX(2, h.x + rnd(-120, 120) * u, 20 * u); h.tv = 0.12; h.actDur = 30; return; }
      let best = null, bd = 1e9;
      for (const t of ts) { const d = Math.abs(t.x - h.x) + rnd(0, 80) * u; if (d < bd) { bd = d; best = t; } }
      h.tree = best; h.tx = clampX(2, best.x + (h.x < best.x ? -1 : 1) * 5 * u, 8 * u); h.tv = 0.03; h.actDur = 40;
    } else if (act === 'sea') {
      const s = span(2);
      h.tx = s[0] + 24 * u; h.tv = 0.02; h.actDur = rnd(22, 32) * (1 + sab * 0.5);
    } else if (act === 'tree') {
      const ts = nearTrees();
      if (ts.length) {
        let best = ts[0];
        for (const t of ts) if (t.w > best.w) best = t;
        h.tree = best; h.tx = clampX(2, best.x + rnd(-1, 1) * best.w * 0.2, 10 * u);
      } else h.tx = clampX(2, h.x + rnd(-60, 60) * u, 20 * u);
      h.tv = 0.04; h.actDur = rnd(22, 34) * (1 + sab * 0.7);
    }
  }
  function nameCandidate(h) {
    let best = null, bd = 1e9;
    for (const a of AN) {
      if (a.eT < EM || a.layer !== 2) continue;
      const d = Math.abs(a.x - h.x) + (namedSp[a.sp] ? 400 : 0) + (a.lie > 0.5 ? 120 : 0);
      if (d < bd) { bd = d; best = a; }
    }
    return best;
  }

  function humanLook(h, px, py, k) {
    const hy = h.y - 22 * h.S;
    const ang = Math.atan2(hy - py, Math.abs(px - h.x) + 1);
    h.lookT = clamp(ang * 0.9, -0.3, 1.05) * (k == null ? 1 : k);
  }

  function updHuman(h, dt, lead, part) {
    const u = cu();
    h.S = cu() * depthK(2, h.v) * h.size;
    h.y = footY(2, h.x, h.v);
    const sp = W.spirit;
    let base = h.pose, spdT = 0, faceT = h.dir;
    h.raiseT = 0; h.reachT = 0; h.lookT = 0; h.holding = false;
    if (h.blessT > 0) { h.blessT -= dt; h.raiseT = 1; }
    // ── 成形：尘 → 卧着的人形 → 灵的气息流入胸口 → 坐起 → 站立 → 仰望 ──
    if (h.eT < EMH) {
      const e0 = h.eT;
      h.eT += dt * fastK();
      const e = h.eT;
      base = 'lie';
      if (e0 < 2.1 && e >= 2.1 && fxOK()) {
        // 灵的光流进他们的胸口
        const c = chestWorld(h), tg = [];
        for (let i = 0; i < 34; i++) tg.push([c[0] + rnd(-1, 1), c[1] + rnd(-1, 1), rnd(1, 2.2)]);
        GS.fx.sow(sp.x, sp.y, tg, BREATH, { stagger: 0.9, dur: 1.6, pass: 'top' });
      }
      if (e0 < 3.9 && e >= 3.9) {
        h.flash = 0; h.breathed = true;
        if (fxOK()) { const c = chestWorld(h); GS.fx.ring(c[0], c[1], [236, 244, 255], 38 * u, 1.4, 1.5); GS.fx.sparkle(c[0], c[1], 14, [230, 240, 255], 4 * u, 'top'); }
      }
      if (e > 4.6) base = 'sit';
      if (e > 5.8) base = 'stand';
      if (e > 4.6) { faceT = sgn(sp.x - h.x); humanLook(h, sp.x, sp.y); }
      if (e > 7.4) h.raiseT = h.kind === 'man' ? 1 : 0;
      if (h.eT >= EMH) { h.motes = null; h.act = null; }
      h.pose = base;
      finishHuman(h, dt, 0, faceT, base);
      return;
    }
    if (h.flash >= 0) { h.flash += dt; if (h.flash > 1.4) h.flash = -1; }
    // ── 灵的临近 ──
    const cx = h.x, cy = h.y - 16 * h.S;
    const dxs = sp.x - cx, ds = Math.hypot(dxs, sp.y - cy);
    const listening = W.ritual.holding || awe();
    const slowNear = sp.speed < SLOW() && ds < 150 * Math.max(0.6, uu());
    if (listening || slowNear) {
      h.linger = slowNear ? h.linger + dt : 0;
      faceT = sgn(dxs);
      humanLook(h, sp.x, sp.y);
      if (h.pose === 'lie' && !listening) { /* 躺着的人只转过头来 */ }
      else if (h.pose === 'walk') base = 'stand';
      if (slowNear && h.linger > 3 && h.kind !== 'child' && h === nearestAdult()) h.raiseT = 1;
      if (listening && h.pose === 'lie') base = 'sit';
      h.pose = base === 'walk' ? 'stand' : base;
      finishHuman(h, dt, 0, faceT, h.pose);
      return;
    }
    h.linger = 0;
    if (sp.speed > FAST() && ds < 260 * Math.max(0.6, uu())) humanLook(h, sp.x, sp.y, 0.6);   // 目光追随，不惧怕
    // ── 日程 ──
    if (lead) {
      const bc = bandChanged(h), b = band();
      const wantName = W.lv.sabbath > 0.9 && W.t > nameNext && (b === 'day' || b === 'noon') && (h.act === 'tree' || h.act === 'walk' || h.act === 'sea') && h.actT > 6;
      if (!h.act || h.actT > h.actDur || bc || wantName) planLeader(h);
      h.actT += dt;
      const r = doAct(h, dt);
      base = r.pose; spdT = r.spd; faceT = r.face;
    } else if (h.kind === 'woman' && part) {
      const r = follow(h, part, dt);
      base = r.pose; spdT = r.spd; faceT = r.face;
    } else {
      const r = childPlay(h, lead ? null : part, dt);
      base = r.pose; spdT = r.spd; faceT = r.face;
    }
    h.pose = base;
    finishHuman(h, dt, spdT, faceT, base);
  }
  function bandChanged(h) {
    const b = band();
    const was = h._band;
    h._band = b;
    if (was === undefined) return false;
    if (b !== was && (b === 'night' || b === 'dawn' || b === 'dusk' || was === 'night' || was === 'dawn' || was === 'dusk' || b === 'noon')) return true;
    return false;
  }
  function nearestAdult() {
    const sp = W.spirit;
    let best = null, bd = 1e9;
    for (const h of HU) { if (h.kind === 'child' || h.eT < EMH) continue; const d = Math.hypot(h.x - sp.x, h.y - sp.y); if (d < bd) { bd = d; best = h; } }
    return best;
  }
  function walkTo(h, dt, spd) {
    const d = h.tx - h.x;
    if (Math.abs(d) < 1.2) return true;
    h.dir = sgn(d);
    return false;
  }
  function doAct(h, dt) {
    const u = cu(), W_ = 16;     // 步速（模型像素 / 秒）
    const r = { pose: 'stand', spd: 0, face: h.dir };
    switch (h.act) {
      case 'sleep': {
        r.pose = 'lie';
        // 躺下看星：一人偶尔抬手指向月亮
        const cyc = (W.t + h.seed * 20) % 14;
        if (cyc < 3.5 && W.lv.moon > 0.3) { h.pointT = 1; }
        r.face = sgn(W.w * 0.5 - h.x) || 1;
        break;
      }
      case 'wake':
        r.pose = 'sit'; r.face = -1;   // 面向东方的晨光
        humanLook(h, W.sun.x, W.sun.y, 0.5);
        break;
      case 'sunset':
        if (h.phase === 0) { if (walkTo(h, dt)) h.phase = 1; else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; } }
        if (h.phase === 1) { r.pose = 'sit'; r.face = sgn(W.sun.x - h.x); humanLook(h, W.sun.x, W.sun.y, 0.4); }
        break;
      case 'walk':
        if (walkTo(h, dt)) { h.actT = h.actDur + 1; r.pose = 'stand'; }
        else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; }
        break;
      case 'fruit': {
        const t = h.tree;
        if (h.phase === 0) {
          if (walkTo(h, dt)) { h.phase = 1; h.phT = 0; }
          else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; }
        }
        if (h.phase >= 1 && t) {
          h.phT += dt;
          r.face = sgn(t.x - h.x) || h.dir;
          const cy = t.top + (t.y - t.top) * 0.62;
          humanLook(h, t.x, cy, 0.9);
          if (h.phase === 1) {
            h.reachT = 1;
            if (h.phT > 1.4) {
              h.phase = 2; h.phT = 0;
              h.fruit = { x0: t.x + rnd(-0.25, 0.25) * t.w, y0: cy + rnd(-6, 6) * u, t: 0, c: FRUIT[(Math.random() * 3) | 0] };
            }
          } else if (h.phase === 2) {
            h.reachT = h.phT < 0.7 ? 1 : 0.3;
            if (h.fruit) h.fruit.t = Math.min(1, h.fruit.t + dt / 0.7);
            if (h.phT > 3.2) { h.phase = 3; h.phT = 0; }
          } else {
            if (h.fruit) h.fruit.t = 1;
            if (h.phT > 1.5) { h.fruit = null; h.actT = h.actDur + 1; }
          }
        } else if (h.phase >= 1) h.actT = h.actDur + 1;
        break;
      }
      case 'sea':
        if (h.phase === 0) { if (walkTo(h, dt)) { h.phase = 1; h.phT = 0; } else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; } }
        if (h.phase === 1) {
          h.phT += dt; r.face = -1;
          r.pose = h.phT > 6 ? 'sit' : 'stand';
          humanLook(h, 0, W.horizonY, 0.5);
        }
        break;
      case 'tree':
        if (h.phase === 0) { if (walkTo(h, dt)) { h.phase = 1; h.phT = 0; } else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; } }
        if (h.phase === 1) {
          h.phT += dt; r.pose = h.phT > 1 ? 'lean' : 'stand';
          r.face = h.tree ? sgn(h.x - h.tree.x) || 1 : h.dir;
        }
        break;
      case 'name': {
        const a = h.nameTarget;
        if (!a || AN.indexOf(a) < 0) { h.actT = h.actDur + 1; break; }
        const side = h.x < a.x ? -1 : 1;
        h.tx = clampX(2, a.x + side * (a.M.len * a.S * 0.5 + 12 * u), 6 * u);
        if (h.phase === 0) {
          if (walkTo(h, dt)) { h.phase = 1; h.phT = 0; }
          else { r.pose = 'walk'; r.spd = W_; r.face = h.dir; }
        }
        if (h.phase >= 1) {
          h.phT += dt;
          r.face = sgn(a.x - h.x) || 1;
          humanLook(h, a.x, a.y - a.M.top * a.S, 0.8);
          a.joy = Math.max(a.joy, 0.3); a.joyX = h.x;
          if (h.phT > 0.6 && h.phT < 4.2) h.raiseT = 0.75;
          if (h.phase === 1 && h.phT > 1.0) { h.phase = 2; speakName(a); }
          if (h.phT > 6.5) h.actT = h.actDur + 1;
        }
        break;
      }
      default:
        r.pose = 'stand';
    }
    return r;
  }
  // 名字：以那活物自身的质料，聚在它的上方
  function speakName(a) {
    if (!GS.fx || !GS.fx.name) return;
    const label = a.M.cn, chars = Array.from(label);
    const size = Math.max(16, 28 * uu());
    const gap = size * 1.08, x0 = a.x - (gap * (chars.length - 1)) / 2;
    const cy = a.y - a.M.top * a.S - size * 0.9;
    const base = mix(a.col, [255, 250, 240], 0.3);
    const rgb = [Math.min(255, base[0] * 1.1), Math.min(255, base[1] * 1.1), Math.min(255, base[2] * 1.1)];
    const src = () => [a.x + rnd(-0.5, 0.5) * a.M.len * a.S, a.y - rnd(0.1, 0.9) * a.M.top * a.S, rgb];
    chars.forEach((ch, i) => GS.fx.name(ch, x0 + i * gap, cy, size, rgb, src, { delay: i * 0.12, hold: 2.6 }));
    namedSp[a.sp] = true;
    if (GS.audio && GS.audio.nameChime) U.safe('beasts.nameChime', () => GS.audio.nameChime(chars[0]));
  }
  // 女人随男人同行：并肩、牵手；他坐她也坐
  function follow(h, lead, dt) {
    const u = cu(), W_ = 16;
    const r = { pose: 'stand', spd: 0, face: h.dir };
    const gap = 9.5 * u;
    const lp = lead.pose;
    let tx = lead.x - lead.face * gap;
    if (lead.act === 'fruit' || lead.act === 'name') tx = lead.x - sgn(lead.face) * gap * 1.5;
    if (lp === 'lie') tx = lead.x - sgn(lead.face) * 26 * u * 0.2 + 4 * u;
    h.tx = clampX(2, tx, 6 * u);
    h.tv = lead.v + 0.012;
    h.v = approach(h.v, h.tv, 1.5, dt);
    const d = h.tx - h.x;
    if (lp === 'walk' && Math.abs(d) < 60 * u) {
      // 并肩同行：按落后的距离调整步速，赶上后牵起手
      const dir = lead.dir;
      const ahead = d * dir;
      h.dir = dir; r.pose = 'walk'; r.face = dir;
      r.spd = clamp(lead.spd + (ahead / (u * h.S / cu())) * 1.6, 0, W_ * 1.7);
      if (r.spd < 0.5) r.pose = 'stand';
    } else if (Math.abs(d) > 1.5 && (lp === 'walk' || Math.abs(d) > 4 * u)) {
      h.dir = sgn(d); r.pose = 'walk'; r.spd = Math.abs(d) > 20 * u ? W_ * 1.3 : W_ * (lp === 'walk' ? 1 : 0.8); r.face = h.dir;
    } else {
      r.pose = lp === 'walk' ? 'stand' : lp;
      r.face = lead.face > 0 ? 1 : -1;
      if (lp === 'lie') r.face = -r.face;
    }
    if (lp === 'walk' && r.pose === 'walk' && Math.abs(Math.abs(h.x - lead.x) - gap) < 3.5 * u && sgn(lead.x - h.x) === lead.dir) h.holding = true;
    if (lead.act === 'sunset' || lead.act === 'wake' || lead.act === 'sea') h.lookT = lead.lookT;
    if (lead.act === 'fruit' && lead.fruit && lead.fruit.t >= 1) h.reachT = 0;
    return r;
  }
  // 孩子：在父母身边嬉戏；父母坐下，他们也坐；夜里躺下
  function childPlay(h, lead, dt) {
    const u = cu();
    const r = { pose: 'stand', spd: 0, face: h.dir };
    const L = HU[0];
    if (!L) return r;
    const lp = L.pose;
    if (lp === 'lie' || lp === 'sit' || lp === 'lean' || L.act === 'sunset') {
      const i = HU.indexOf(h) - 2;
      const tx = L.x + (i % 2 ? 1 : -1) * (12 + 8 * Math.floor(i / 2)) * u;
      h.tx = clampX(2, tx, 6 * u);
      if (Math.abs(h.tx - h.x) > 2) { h.dir = sgn(h.tx - h.x); r.pose = 'walk'; r.spd = 14; r.face = h.dir; }
      else { r.pose = lp === 'lean' ? 'sit' : lp; r.face = L.face > 0 ? 1 : -1; if (lp === 'lie') r.face = h.seed > 0.5 ? 1 : -1; }
      return r;
    }
    // 围着父母跑、停、再跑
    h.playT = (h.playT || 0) - dt;
    if (h.playT <= 0) {
      h.playT = rnd(2, 6);
      h.tx = clampX(2, L.x + rnd(-60, 60) * u, 6 * u);
      h.tv = clamp(L.v + rnd(-0.04, 0.2) * VMAX[2] / 0.55, 0.03, VMAX[2] * 0.75);
      h.still = Math.random() < 0.35;
    }
    h.v = approach(h.v, h.tv, 0.6, dt);
    if (!h.still && Math.abs(h.tx - h.x) > 2) { h.dir = sgn(h.tx - h.x); r.pose = 'walk'; r.spd = 22; r.face = h.dir; }
    else { r.pose = 'stand'; r.face = h.dir; if (Math.random() < dt * 0.2) h.dir = -h.dir; }
    return r;
  }

  const TMPP = pcopy({}, POSE.stand);
  function finishHuman(h, dt, spdT, faceT, base) {
    const target = POSE[base === 'walk' ? 'stand' : base] || POSE.stand;
    pcopy(h.TP, target);
    // 转身时先放慢
    const turning = Math.abs(h.face - faceT) > 0.4;
    h.spd = approach(h.spd, spdT, 3, dt);
    if (h.spd < 0.05) h.spd = 0;
    h.face = approach(h.face, faceT, 6, dt);
    const mv = turning ? h.spd * 0.2 : h.spd;
    if (mv > 0) {
      h.x = clampX(2, h.x + h.dir * mv * h.S * dt, 6 * cu());
      h.v = approach(h.v, h.tv, 0.4, dt);
    }
    h.gait = c01(h.spd / 15);
    h.ph += (h.spd / 7.5) * Math.PI * dt;
    // 姿势趋近
    const rate = h.eT < EMH ? 2.2 : 3.2;
    for (let i = 0; i < PK.length; i++) { const k = PK[i]; h.P[k] = approach(h.P[k], h.TP[k], rate, dt); }
    h.look = approach(h.look, h.lookT, 3, dt);
    h.raise = approach(h.raise, h.raiseT, 3.5, dt);
    h.reach = approach(h.reach, h.reachT || 0, 4, dt);
    h.point = approach(h.point || 0, h.pointT || 0, 2, dt);
    h.pointT = 0;
  }
  // 最终姿势：基础姿势 + 步态 + 抬头 + 举手 / 伸手 / 牵手
  function finalPose(h) {
    const P = pcopy(TMPP, h.P);
    const g = h.gait, ph = h.ph;
    if (g > 0.01) {
      const s = Math.sin(ph), c = Math.cos(ph);
      const A = 0.46 * g;
      P.nTh += A * s; P.fTh -= A * s;
      P.nSh = P.nTh - 0.75 * g * Math.max(0, c);
      P.fSh = P.fTh - 0.75 * g * Math.max(0, -c);
      P.nUa += -0.36 * s * g; P.fUa += 0.36 * s * g;
      P.nFa = P.nUa + 0.22 * g + 0.1; P.fFa = P.fUa + 0.22 * g + 0.1;
      P.hipH -= 0.35 * g * Math.abs(c);
      P.lean += 0.05 * g;
    }
    P.head += h.look * (P.rot ? 0.4 : 1);
    if (h.raise > 0.01) {
      P.nUa = lerp(P.nUa, 2.55, h.raise); P.nFa = lerp(P.nFa, 2.8, h.raise);
    }
    if (h.reach > 0.01) {
      P.nUa = lerp(P.nUa, 2.75, h.reach); P.nFa = lerp(P.nFa, 3.0, h.reach);
      P.fUa = lerp(P.fUa, 2.3, h.reach * 0.5); P.fFa = lerp(P.fFa, 2.6, h.reach * 0.5);
    }
    if (h.point > 0.01 && P.rot) { P.nUa = lerp(P.nUa, 1.9, h.point); P.nFa = lerp(P.nFa, 2.0, h.point); }
    if (h.fruit && h.fruit.t >= 1 && h.reach < 0.5) {       // 果子拿到嘴边
      P.nUa = lerp(P.nUa, 0.5, 0.8); P.nFa = lerp(P.nFa, 2.4, 0.8);
    }
    return P;
  }
  function chestWorld(h) {
    const P = h.P, s = h.S * (h.kind === 'child' ? 1 : 1);
    setT(h.x, h.y - P.hipH * s, s, h.face, P.rot);
    const lean = P.lean, tor = HM.torso * h.prop.t;
    tp(Math.sin(lean) * tor * 0.72, -Math.cos(lean) * tor * 0.72);
    return [PX, PY];
  }
  // 牵手：两只相近的手在二人之间相握（两节臂的简易 IK）
  function ikArm(P, h, tx, ty, near) {
    const s = h.S, f = T.f;
    const lx = (tx - T.x) / (s * f), ly = (ty - T.y) / s;
    const lean = P.lean, ux = Math.sin(lean), uy = -Math.cos(lean), px = Math.cos(lean), py = Math.sin(lean);
    const tor = HM.torso * h.prop.t;
    const sjx = ux * tor - ux * 0.9 + (near ? px * 0.3 : -px * 0.3), sjy = uy * tor - uy * 0.9 + (near ? py * 0.3 : -py * 0.3);
    const ua = HM.ua * h.prop.a, fa = HM.fa * h.prop.a;
    let dx = lx - sjx, dy = ly - sjy;
    let D = Math.hypot(dx, dy);
    D = clamp(D, 0.5, ua + fa - 0.05);
    const phi = Math.atan2(dx, dy);
    const A1 = Math.acos(clamp((ua * ua + D * D - fa * fa) / (2 * ua * D), -1, 1));
    const A2 = Math.acos(clamp((fa * fa + D * D - ua * ua) / (2 * fa * D), -1, 1));
    const up = phi - A1 * 0.9, fo = phi + A2 * 0.9;
    if (near) { P.nUa = up; P.nFa = fo; } else { P.fUa = up; P.fFa = fo; }
  }

  // ════════════════════════════════════════════════════════════
  //  昆虫
  // ════════════════════════════════════════════════════════════
  let FLW = [], FLWf = -1;
  function flowers() {
    if (FLWf !== W.frame) { FLWf = W.frame; FLW = GS.land && GS.land.flowerSpots ? (GS.land.flowerSpots() || []) : []; }
    return FLW;
  }
  const bfVis = () => (1 - sstep(0.22, 0.5, W.night)) * c01(W.lv.light * 1.5) * (1 - W.dusk * 0.35);
  const ffVis = () => sstep(0.28, 0.68, W.night + W.dusk * 0.25);
  function flowerNear(x, y, R) {
    const FLW = flowers();
    if (!FLW.length) return null;
    let best = null, bs = -1;
    for (let k = 0; k < 7; k++) {
      const f = FLW[(Math.random() * FLW.length) | 0];
      if (!f || f.layer !== 2) continue;
      const d = Math.hypot(f.x - x, f.y - y);
      const sc = (d < R ? 2 : 0) + Math.random();
      if (sc > bs) { bs = sc; best = f; }
    }
    return best;
  }
  function bfRetarget(c, tx, ty, dur) {
    c.fx0 = c.x; c.fy0 = c.y; c.tx = tx; c.ty = ty; c.k = 0;
    c.dur = Math.max(0.6, dur); c.perch = 0; c.onFlower = false;
  }
  function updButterfly(c, dt, vis) {
    const u = cu(), sp = W.spirit;
    c.flap += dt * (c.perch > 0 ? 3.2 : 19 + Math.sin(W.t * 0.7 + c.seed * 9) * 4);
    if (vis < 0.02) return;
    const dS = Math.hypot(sp.x - c.x, sp.y - c.y);
    const slowNear = sp.speed < SLOW() && dS < 170 * Math.max(0.6, uu());
    const fastNear = sp.speed > FAST() && dS < 180 * Math.max(0.6, uu());
    if (W.ritual.holding) {                      // 静听：悬停
      c.x += Math.sin(W.t * 2.1 + c.seed * 7) * 3 * u * dt;
      c.y += Math.cos(W.t * 1.7 + c.seed * 5) * 3 * u * dt;
      return;
    }
    if (fastNear && !c.scared) {
      c.scared = true;
      const a = Math.atan2(c.y - sp.y, c.x - sp.x) + rnd(-0.6, 0.6);
      bfRetarget(c, clamp(c.x + Math.cos(a) * 90 * u, 10, W.w - 10), clamp(c.y + Math.sin(a) * 70 * u, W.horizonY * 0.7, W.h - 10), 0.9);
    } else if (!fastNear) c.scared = false;
    if (slowNear && !c.scared && W.t > (c.orbitCd || 0)) {
      // 围着灵轻轻打转
      const a = W.t * (0.7 + c.seed * 0.4) + c.seed * TAU, R = (26 + c.seed * 22) * Math.max(0.6, uu());
      const ox = sp.x + Math.cos(a) * R, oy = sp.y + Math.sin(a) * R * 0.6;
      c.x = approach(c.x, ox, 1.6, dt); c.y = approach(c.y, oy, 1.6, dt);
      c.fx0 = c.x; c.fy0 = c.y; c.k = 1; c.perch = 0; c.onFlower = false; c.orbiting = true;
      return;
    }
    if (c.orbiting) { c.orbiting = false; c.orbitCd = W.t + 1.5; c.perch = 0; c.k = 1; }
    if (c.perch > 0) {
      c.perch -= dt;
      if (c.perch <= 0) c.k = 1;
      return;
    }
    if (c.k >= 1) {
      // 选下一朵花；无花则在草上游荡
      const f = Math.random() < 0.8 ? flowerNear(c.x, c.y, 220 * u) : null;
      if (f) { bfRetarget(c, f.x, f.y - 1.5 * u, Math.hypot(f.x - c.x, f.y - c.y) / (34 * u) + 0.5); c.onFlower = true; }
      else {
        const s = span(2), x = clamp(c.x + rnd(-120, 120) * u, s[0], s[1]);
        bfRetarget(c, x, footY(2, x, rnd(0, 0.5)) - rnd(12, 70) * u, rnd(2, 4));
      }
      return;
    }
    c.k = Math.min(1, c.k + dt / c.dur);
    const e = eIO(c.k), env = Math.sin(Math.PI * c.k);
    const t = W.t + c.lp;
    const nx = lerp(c.fx0, c.tx, e) + Math.sin(t * c.lx) * 22 * u * env;
    const ny = lerp(c.fy0, c.ty, e) + Math.sin(t * c.ly + 1.3) * 14 * u * env - Math.abs(Math.sin(c.flap * 0.5)) * 2.2 * u * env;
    c.vx = nx - c.x;
    c.x = nx; c.y = ny;
    if (c.k >= 1 && c.onFlower) c.perch = rnd(2, 5);
  }
  function updFirefly(c, dt, vis) {
    if (vis < 0.02) { c.fa = 0; return; }
    const u = cu(), t = W.t, sp = W.spirit;
    const x = c.hx + 34 * u * U.noise1(t * 0.09 + c.seed * 40);
    const y = footY(2, x, c.hv) - (c.hh + 12 * U.noise1(t * 0.17 + c.seed * 77)) * u;
    const dS = Math.hypot(sp.x - x, sp.y - y);
    const want = sp.speed < 500 && dS < 230 * Math.max(0.6, uu()) && !W.ritual.holding ? 1 : 0;
    c.att = approach(c.att, want, want ? 0.5 : 0.8, dt);
    const a = t * (0.5 + c.seed * 0.5) + c.seed * TAU, R = (22 + c.seed * 46) * Math.max(0.6, uu());
    const ox = sp.x + Math.cos(a) * R, oy = sp.y + Math.sin(a) * R * 0.7;
    c.fx = lerp(x, ox, c.att * 0.75); c.fy = lerp(y, oy, c.att * 0.75);
    const b = Math.pow(Math.max(0, Math.sin(t * TAU / c.bp + c.bph)), 4);
    c.fa = vis * (0.24 + 0.76 * b);
    c.fb = b;
  }
  function updBeetle(c, dt) {
    const u = cu();
    c.pause -= dt;
    if (c.pause > 0) { c.spd = approach(c.spd, 0, 6, dt); }
    else {
      c.spd = approach(c.spd, 3.2, 3, dt);
      if (Math.random() < dt * 0.3) { c.pause = rnd(0.8, 3.5); if (Math.random() < 0.5) c.dir = -c.dir; }
    }
    const s = span(2);
    c.x += c.dir * c.spd * u * dt;
    if (c.x < s[0] + 4 || c.x > s[1] - 4) { c.dir = -c.dir; c.x = clamp(c.x, s[0] + 4, s[1] - 4); }
    c.leg += c.spd * dt * 6;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    if (!ready) return;
    if (!(dt > 0)) dt = 0.016;
    dt = Math.min(dt, 0.05);
    if (W.w !== lastW || W.h !== lastH) resize();
    updLight();
    syncPops(false);
    runQueues();
    updHerds();
    for (let i = 0; i < AN.length; i++) updAnimal(AN[i], dt);
    separate(dt);
    const L = HU[0], Wm = HU[1];
    for (let i = 0; i < HU.length; i++) {
      const h = HU[i];
      updHuman(h, dt, i === 0, i === 1 ? (L && L.eT >= EMH ? L : null) : L);
    }
    const bv = bfVis(), fv = ffVis();
    for (let i = 0; i < CR.length; i++) {
      const c = CR[i];
      c.age += dt * fastK();
      if (c.kind === 'beetle') updBeetle(c, dt);
      else {
        if (c.kind === 'bf') updButterfly(c, dt, bv);
        updFirefly(c, dt, fv);
      }
    }
  }

  // ── 绘制 ────────────────────────────────────────────────────
  const LIST = [];
  function drawShadows(ctx, list) {
    if (LT.sh < 0.01 || !list.length) return;
    const p = new Path2D();
    let any = false;
    for (const e of list) {
      if (e.eT !== undefined && e.alpha < 0.3) continue;
      const hum = e.P !== undefined;
      const w = hum ? (e.pose === 'lie' ? 14 : e.pose === 'sit' || e.pose === 'lean' ? 8 : 5) * e.S : e.M.len * e.S * (0.3 + 0.12 * e.lie);
      const hgt = (hum ? 1.4 : 1.8) * e.S;
      const ox = hum && e.pose === 'lie' ? -e.face * 2 * e.S : hum && (e.pose === 'sit' || e.pose === 'lean') ? e.face * 3 * e.S : 0;
      p.moveTo(e.x + ox + w, e.y + 0.4);
      p.ellipse(e.x + ox, e.y + 0.4, w, hgt, 0, 0, TAU);
      p.closePath();
      any = true;
    }
    if (!any) return;
    ctx.fillStyle = U.rgba(8, 10, 16, LT.sh);
    ctx.fill(p);
  }
  function drawMound(ctx, a) {
    const e = a.eT / EM;
    const bulge = e < 0.28 ? eOut(e / 0.28) : e < 0.7 ? 1 : 1 - sstep(0.7, 1, e);
    if (bulge < 0.02) return;
    const s = a.S, w = Math.max(8, a.M.len * 0.42) * s, h = (4 + a.M.top * 0.18) * s * bulge;
    const depth = W.LAYERS[a.layer].depth;
    ctx.fillStyle = shc(SOIL, depth, 0.1);
    ctx.beginPath();
    ctx.ellipse(a.x, a.y + 0.5, w, h, 0, Math.PI, TAU);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = U.rgba(255, 226, 180, 0.35 * bulge * (0.3 + 0.7 * W.daylight));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(a.x, a.y + 0.5, w, h, 0, Math.PI * 1.08, Math.PI * 1.6);
    ctx.stroke();
  }
  function drawMotes(ctx, e, prog, T0x, T0y, s, f, col, sizeK) {
    if (!e.motes) return;
    ctx.globalCompositeOperation = 'lighter';
    const m = e.motes, n = m.length;
    const sz = Math.max(0.8, 1.15 * s * (sizeK || 1));
    for (let i = 0; i < n; i++) {
      const p = m[i];
      const k = c01((prog - p.d) / (1 - p.d * 0.8));
      if (k <= 0) continue;
      const q = eOut(k);
      const sw = Math.sin(k * Math.PI) * p.sw * 5;
      const lx = lerp(p.sx, p.tx, q) + sw, ly = lerp(p.sy, p.ty, q);
      const x = T0x + lx * s * f, y = T0y + ly * s;
      const a = Math.sin(Math.min(1, k * 1.15) * Math.PI) * 0.85 + (k > 0.85 ? 0 : 0);
      if (a < 0.02) continue;
      ctx.fillStyle = U.rgba(col[0], col[1], col[2], a);
      ctx.fillRect(x - sz * 0.5, y - sz * 0.5, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawAnimal(ctx, a) {
    const M = a.M, depth = W.LAYERS[a.layer].depth;
    let alpha = 1, reveal = 1;
    const emerging = a.eT < EM;
    if (emerging) {
      const e = a.eT / EM;
      drawMound(ctx, a);
      alpha = sstep(0.3, 0.82, e);
      reveal = sstep(0.18, 0.86, e);
    }
    const s = a.S;
    if (alpha > 0.01) {
      setT(a.x, a.y, s, a.face, 0);
      nOps = 0;
      if (a.type === 'q') buildQuad(a); else if (a.type === 'e') buildEle(a); else buildRabbit(a);
      const cy = a.y - M.top * s * 0.5;
      const rim = rimAt(a.x, cy, false);
      const ex = RIM.extra;
      setCol('body', a.col, depth, ex); COLS.head = COLS.body; CRGB.head = CRGB.body;
      setCol('far', a.col, depth, ex, 0.74);
      setCol('dark', a.col2, depth, ex); setCol('darkF', a.col2, depth, ex, 0.72);
      setCol('acc', a.acc, depth, ex + 0.05);
      if (emerging) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const top = a.y - (M.top * 1.5 + 6) * s * reveal - 2;
        ctx.beginPath();
        ctx.rect(a.x - M.len * 1.5 * s - 20, top, M.len * 3 * s + 40, a.y - top + 8 * s);
        ctx.clip();
        flush(ctx, rim);
        ctx.restore();
      } else {
        const r = rim;
        if (a.layer === 1) r.a *= 0.7;
        // 低画质：远处与极小的生灵不描光
        flush(ctx, (W.quality || 1) < 0.75 && (a.layer === 1 || a.type === 'r') ? null : r);
      }
    } else nOps = 0;
    if (emerging) drawMotes(ctx, a, c01((a.eT / EM - 0.08) / 0.7), a.x, a.y, s, a.face, DUST);
  }

  function drawHuman(ctx, h) {
    const s = h.S;
    const emerging = h.eT < EMH;
    let alpha = 1, reveal = 1;
    if (emerging) { alpha = sstep(0.8, 2.6, h.eT); reveal = sstep(0.4, 2.4, h.eT); }
    const P = finalPose(h);
    setT(h.x, h.y - P.hipH * s, s, h.face, P.rot);
    // 牵手：二人之间，两只手相握
    const L0 = HU[0], W2 = HU[1];
    if (!emerging && L0 && W2 && W2.holding && (h === L0 || h === W2)) ikArm(P, h, (L0.x + W2.x) / 2, h.y - 12.2 * s, true);
    if (alpha > 0.01) {
      nOps = 0;
      buildHuman(h, P);
      const rim = rimAt(h.x, h.y - 16 * s, true);
      const ex = RIM.extra;
      setCol('body', HUMAN, 0, ex); COLS.head = COLS.body; CRGB.head = CRGB.body;
      setCol('far', HUMAN, 0, ex, 0.72);
      setCol('hair', HUMAN_HAIR, 0, ex);
      rim.a = Math.min(1, rim.a * 0.85);
      if (emerging) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const top = h.y - 34 * s * reveal - 2;
        ctx.beginPath(); ctx.rect(h.x - 40 * s, top, 80 * s, h.y - top + 6 * s); ctx.clip();
        flush(ctx, rim);
        ctx.restore();
      } else flush(ctx, rim);
      // 胸中的微光：他们是世上唯一自带光的受造物
      if (GLOW) {
        tp(h._chest[0], h._chest[1]);
        const cx = PX, cy = PY;
        const on = h.breathed || !emerging ? 1 : 0;
        let a = on * alpha * (0.2 + 0.4 * W.night + 0.12 * W.dusk);
        let r = (7.5 + 3.5 * W.night) * s;
        if (h.flash >= 0) { const k = h.flash / 1.4; r = lerp(40, 10, eOut(k)) * cu(); a = Math.max(a, (1 - k) * 0.9); }
        if (a > 0.01) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = Math.min(1, a);
          ctx.drawImage(GLOW, cx - r, cy - r, r * 2, r * 2);
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      // 手中的果子
      if (h.fruit) {
        const f = h.fruit;
        tp(h._hand[0], h._hand[1]);
        const hx = PX, hy = PY;
        const q = eIO(c01(f.t));
        const x = lerp(f.x0, hx, q), y = lerp(f.y0, hy, q) - Math.sin(q * Math.PI) * 6 * cu();
        ctx.fillStyle = shc(f.c, 0, 0.25);
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.9, 1.35 * s), 0, TAU); ctx.fill();
      }
    } else nOps = 0;
    if (emerging) {
      const prog = c01(h.eT / 2.6);
      drawMotes(ctx, h, prog, h.x, h.y - 1, s, h.face, HUMAN_DUST, 0.9);
    }
  }

  function drawBeetles(ctx) {
    let p = null, n = 0;
    const vis = 1 - sstep(0.3, 0.6, W.night);
    if (vis < 0.02) return;
    const rim = new Path2D();
    for (const c of CR) {
      if (c.kind !== 'beetle') continue;
      const u = cu(), s = u * depthK(2, c.v);
      const y = footY(2, c.x, c.v);
      if (!p) p = new Path2D();
      const x = c.x, cy = y - 1.2 * s;
      const w = 1.9 * s, hh = 1.25 * s;
      p.moveTo(x + w, cy); p.ellipse(x, cy, w, hh, 0, 0, TAU); p.closePath();
      const hx = x + c.dir * w * 1.05;
      p.moveTo(hx + 0.8 * s, cy + 0.2); p.ellipse(hx, cy + 0.2 * s, 0.8 * s, 0.7 * s, 0, 0, TAU); p.closePath();
      // 细腿的颤动
      const lk = Math.sin(c.leg) * 0.5 * s;
      for (let i = -1; i <= 1; i++) { p.rect(x + i * w * 0.6 + lk * (i === 0 ? -1 : 1) - 0.25 * s, cy + hh * 0.6, 0.5 * s, 1.1 * s); }
      rim.moveTo(x + w * 0.7, cy - hh * 0.35); rim.ellipse(x - c.dir * w * 0.1, cy - hh * 0.35, w * 0.55, hh * 0.3, 0, 0, TAU); rim.closePath();
      n++;
    }
    if (!p) return;
    ctx.globalAlpha = vis;
    ctx.fillStyle = shc(BEETLE, 0, 0);
    ctx.fill(p);
    ctx.fillStyle = shc(BEETLE_GLINT, 0, 0.3);
    ctx.fill(rim);
    ctx.globalAlpha = 1;
  }

  function drawButterflies(ctx) {
    const vis = bfVis();
    if (vis < 0.02) return;
    const paths = [null, null, null];
    const u = cu();
    for (const c of CR) {
      if (c.kind !== 'bf') continue;
      const fade = c01((c.age - 0.2) / 1.0);
      if (fade < 0.02) continue;
      const ci = BUTTER.indexOf(c.col) % 3;
      const p = paths[ci] || (paths[ci] = new Path2D());
      CP = p;
      const s = 4.2 * u * c.bs;
      const open = 0.3 + 0.7 * Math.abs(Math.sin(c.flap));
      const tilt = clamp(c.vx * 0.12, -0.35, 0.35);
      setT(c.x, c.y, s, 1, tilt);
      const wx = open;
      // 两对翻飞的三角：前翅大、后翅小
      tri(0, -0.55, 0, 0.35, -1.05 * wx, -1.0);
      tri(0, -0.55, 0, 0.35, 1.05 * wx, -1.0);
      tri(0, -0.1, 0, 0.6, -0.72 * wx, 0.8);
      tri(0, -0.1, 0, 0.6, 0.72 * wx, 0.8);
    }
    for (let i = 0; i < 3; i++) {
      if (!paths[i]) continue;
      const base = BUTTER[i];
      const c = W.shade(base, 0, 0.35);
      const k = 0.55 + 0.45 * W.daylight;
      ctx.fillStyle = U.rgba(lerp(c[0], base[0], 0.35) * k + 10, lerp(c[1], base[1], 0.35) * k + 8, lerp(c[2], base[2], 0.35) * k, vis * 0.95);
      ctx.fill(paths[i]);
    }
    // 细细的身
    ctx.fillStyle = U.rgba(46, 36, 30, vis * 0.7);
    for (const c of CR) {
      if (c.kind !== 'bf' || c.age < 0.4) continue;
      const s = 4.2 * u * c.bs;
      ctx.fillRect(c.x - 0.3, c.y - s * 0.4, 0.6, s * 0.85);
    }
  }

  function drawFireflies(ctx) {
    const vis = ffVis();
    if (vis < 0.02 || !FGLOW) return;
    const u = Math.max(0.6, cu());
    const lim = Math.round(CR.length * (0.55 + 0.45 * (W.quality || 1)));
    ctx.globalCompositeOperation = 'lighter';
    let n = 0;
    for (const c of CR) {
      if (c.kind === 'beetle') continue;
      if (++n > lim) break;
      if (c.fa < 0.015) continue;
      const r = (6 + 8 * c.fb) * u;
      ctx.globalAlpha = Math.min(1, c.fa);
      ctx.drawImage(FGLOW, c.fx - r, c.fy - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = U.rgba(240, 255, 200, 0.9 * vis);
    for (const c of CR) {
      if (c.kind === 'beetle' || c.fa < 0.05 || c.fb < 0.2) continue;
      ctx.fillRect(c.fx - 0.7, c.fy - 0.7, 1.4, 1.4);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function draw(ctx, pass) {
    if (!ready) return;
    if (pass === 'mid' || pass === 'near') {
      const layer = pass === 'mid' ? 1 : 2;
      LIST.length = 0;
      for (const a of AN) if (a.layer === layer) LIST.push(a);
      if (layer === 2) for (const h of HU) LIST.push(h);
      if (!LIST.length && layer === 1) return;
      LIST.sort((a, b) => a.y - b.y || a.id - b.id);
      drawShadows(ctx, LIST);
      if (layer === 2) drawBeetles(ctx);
      for (const e of LIST) {
        if (e.P !== undefined) drawHuman(ctx, e);
        else drawAnimal(ctx, e);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    } else if (pass === 'air') {
      drawButterflies(ctx);
      drawFireflies(ctx);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  接口
  // ════════════════════════════════════════════════════════════
  function pick(x, y, r) {
    let best = null;
    const test = (label, cx, cy, top, rad) => {
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - rad);
      if (d < r && (!best || d < best.d)) best = { label, x: cx, y: top, d };
    };
    for (const a of AN) {
      if (a.eT < EM * 0.8) continue;
      const hgt = a.M.top * a.S * (1 - 0.45 * a.lie);
      test(a.M.cn, a.x, a.y - hgt * 0.5, a.y - hgt, a.M.len * a.S * 0.3);
    }
    for (const h of HU) {
      if (h.eT < 3) continue;
      const hgt = (h.pose === 'lie' ? 5 : h.pose === 'sit' || h.pose === 'lean' ? 17 : 29) * h.S;
      test('人', h.x, h.y - hgt * 0.5, h.y - hgt, 6 * h.S);
    }
    const bv = bfVis(), fv = ffVis();
    for (const c of CR) {
      if (c.kind === 'bf' && bv > 0.4) test('蝴蝶', c.x, c.y, c.y - 5 * cu(), 3 * cu());
      else if (c.kind !== 'beetle' && fv > 0.4 && c.fa > 0.05) test('萤火虫', c.fx, c.fy, c.fy - 4, 2);
      else if (c.kind === 'beetle' && bv > 0.4) { const yy = footY(2, c.x, c.v); test('甲虫', c.x, yy - 1.5, yy - 4, 1); }
    }
    return best;
  }

  function reset() {
    AN.length = 0; HU.length = 0; CR.length = 0; GQ.length = 0; HQ.length = 0; CQ.length = 0;
    made.cattle = made.beast = made.creeper = made.human = 0;
    next.ground = next.human = next.creeper = 0;
    pairIdx = 0; namedSp = {}; nameNext = W.t + 20;
    for (const k in HERD) delete HERD[k];
  }

  // 恢复存档：多退少补，一切立即成形
  function restore() {
    if (!ready) init();
    calcSpans();
    const trim = (kind, want) => {
      if (kind === 'human') { while (HU.length > want) HU.pop(); made.human = Math.min(made.human, HU.length); return; }
      if (kind === 'creeper') { while (CR.length > want) CR.pop(); made.creeper = CR.length; return; }
      let have = 0;
      for (let i = 0; i < AN.length; i++) if (AN[i].cls === kind) { have++; if (have > want) { AN.splice(i, 1); i--; have--; } }
      made[kind] = Math.min(made[kind], have);
    };
    GQ.length = 0; HQ.length = 0; CQ.length = 0;
    trim('cattle', popN('cattle'));
    trim('beast', beastWant(popN('beast')));
    trim('human', popN('human'));
    trim('creeper', popN('creeper'));
    made.cattle = AN.filter(a => a.cls === 'cattle').length;
    made.beast = AN.filter(a => a.cls === 'beast').length;
    made.human = HU.length; made.creeper = CR.length;
    syncPops(true);
    for (const a of AN) { if (a.eT < EM) { a.eT = 99; a.motes = null; a.st = 'look'; a.dur = 1; } }
    for (const h of HU) { if (h.eT < EMH) { h.eT = 99; h.motes = null; h.breathed = true; pcopy(h.P, POSE.stand); h.pose = 'stand'; } h.act = null; }
    for (const c of CR) c.age = 99;
    nameNext = W.t + 25;
  }

  function resize() {
    if (!ready) return;
    const ow = lastW, oh = lastH;
    lastW = W.w; lastH = W.h;
    calcSpans();
    if (!ow || !oh) return;
    const kx = W.w / ow, ky = W.h / oh;
    if (Math.abs(kx - 1) < 1e-6 && Math.abs(ky - 1) < 1e-6) return;
    for (const a of AN) { a.x = clampX(a.layer, a.x * kx, 0); a.tx = clampX(a.layer, a.tx * kx, 0); a.home *= kx; }
    for (const h of HU) { h.x = clampX(2, h.x * kx, 0); h.tx = clampX(2, h.tx * kx, 0); if (h.act === 'fruit' || h.act === 'tree') h.act = null; }
    for (const c of CR) {
      if (c.kind === 'beetle') { c.x = clampX(2, c.x * kx, 0); continue; }
      c.hx = clampX(2, c.hx * kx, 0);
      if (c.kind === 'bf') { c.x *= kx; c.y *= ky; c.fx0 *= kx; c.fy0 *= ky; c.tx *= kx; c.ty *= ky; }
    }
  }

  function init() {
    if (ready) return;
    ready = true;
    try { GLOW = mkGlow(INNER, 0.95, 48); FGLOW = mkGlow(FIREFLY, 1.0, 32); } catch (e) { GLOW = FGLOW = null; }
    lastW = W.w; lastH = W.h;
    nameNext = W.t + 20;
    if (GS.bus) {
      GS.bus.on('bless', e => {
        if (!e) return;
        const R = e.r || 200;
        for (const a of AN) { if (Math.hypot(a.x - e.x, a.y - e.y) < R && a.eT >= EM) { a.joy = rnd(1.8, 3); a.joyX = e.x; } }
        for (const h of HU) { if (Math.hypot(h.x - e.x, h.y - e.y) < R && h.eT >= EMH && h.kind !== 'child') { h.blessT = 2.4; } }
      });
    }
  }

  GS.beasts = {
    init, resize, update, draw, reset, restore, pick,
    SPEC,
    get _ents() { return { AN, HU, CR, POSE }; },
    get debug() {
      const st = {};
      for (const a of AN) st[a.st] = (st[a.st] || 0) + 1;
      return {
        animals: AN.length, humans: HU.length, creepers: CR.length, queued: GQ.length + HQ.length + CQ.length,
        kinds: AN.reduce((o, a) => { o[a.sp + a.layer] = (o[a.sp + a.layer] || 0) + 1; return o; }, {}),
        states: st, acts: HU.map(h => h.act + ':' + h.pose), spans: SPAN.slice(),
      };
    },
  };
})(window.GS);
