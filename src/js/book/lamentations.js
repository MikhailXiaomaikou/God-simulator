/* ─────────────────────────────────────────────────────────────
 * book/lamentations.js —— 耶利米哀歌 · 哀歌（耶利米哀歌 1 — 5）
 *
 * 耶路撒冷已经倾覆。近地的右边是锡安山：山坡上是没有屋顶、烧焦了的房屋，山顶是圣殿的根基——
 * 一堵巨石垒成的墙，两根折断的铜柱，倒在地上的圣所的石头；余烬还冒着烟。
 * 山脚下是城墙的残段与城门；城门旁坐着一个蒙头的女子——锡安（「现在竟如寡妇」1:1）；
 * 路上坐着哀哭的人（耶利米）。东（画面左边）是被掳之路，一直下到海边。
 *
 * 五首哀歌 · 一夜、一个早晨、一个黄昏：
 *   一 · 夜里，最后一队被掳的人往东去，隐入黑暗；城独坐（1:3–5）。
 *        过路的人看了，摇头走过；锡安举手，无人安慰（1:2，1:12–18）。
 *   二 · 黑云遮蔽锡安；一道准绳拉过城墙，残存的墙一段一段倒下，城门陷入地内（2:1–9）。
 *        长老坐在地上默默无声，扬起尘土落在头上；处女垂头至地（2:10–17）。
 *   三 · 深夜：他被引入黑暗，凿过的石头从地里升起，把他围住（3:1–18）。
 *        城的眼泪流成一条银色的河，昼夜不息，顺着被掳之路流进海里——直等耶和华从天观看（2:18–19；3:48–50）。
 *        「我想起这事，心里就有指望」——东方的第一线光（3:21–22）；
 *        「每早晨，这都是新的」——日出于海上，光芒扫过废墟，泪河化作金色，满地是露（3:23–24，本卷的签名）。
 *        余民从废墟里出来，静默等候（3:25–32）；「不要惧怕！」——光临近深牢，围住他的石头化为光尘（3:41，3:55–58）。
 *   四 · 正午，圣所的金石失了光（4:1）；锡安的火熄灭了；「你罪孽的刑罚受足了」（4:11，4:22）。
 *   五 · 黄昏，野狗行在荒凉的锡安山上（5:18）；「你的宝座存到万代」——高天之上一片安静的荣光（5:19）；
 *        众人转过身来，向那光跪下：「求你使我们向你回转」（5:21）；夜过去，又是早晨。
 *
 * 神在哀歌里几乎不说话：唯一亲口的一句是「不要惧怕！」（3:57）；其余的话语是经上论神的作为与性情的短句
 * （kind 'judge' / 'act' / 'promise'）。神从不显为人形——只有光。
 * 画面的方位：近地右 = 锡安山（城、圣所的根基、城墙、城门）；近地左 = 被掳之路下到海边。
 * 一切位置都以画面宽度的比例（纵向以"人高"）记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio, ui = () => GS.ui;
  const ACT = 'lamentations';
  const cur = () => GS.book.current(ACT);
  const safe = U.safe;

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  const LV = {
    lmEmber: ['exp', 0.3],     // 余烬与烟（1 → 0：锡安的火熄灭 4:11）
    lmWall: ['lin', 0.12],     // 残存的城墙：1 = 残段尚立；0 = 尽都坍倒（2:8）——线铊经过哪一段，哪一段就倒下（与准绳同速）
    lmSink: ['lin', 0.15],     // 城门陷入地内（2:9）
    lmLine: ['lin', 0.12],     // 准绳拉开的长度（2:8）
    lmLineA: ['exp', 0.9],     // 准绳的光
    lmCell: ['exp', 0.45],     // 围住他的凿过的石头（3:7–9）；深牢（3:55）
    lmTears: ['exp', 0.4],     // 泪河的光（2:18）
    lmFlow: ['lin', 0.075],    // 泪河流到了哪里：0 → 山上的泪 → 城前 → 被掳之路 → 海
    lmGold: ['exp', 0.35],     // 泪河在晨光里化作金色
    lmGaze: ['exp', 0.35],     // 从天观看：自天垂下的光（3:50）
    lmDawn: ['exp', 0.3],      // 东方的第一线光（3:21）
    lmRays: ['exp', 0.3],      // 日出的光芒（3:23）
    lmDew: ['exp', 0.3],       // 满地的露
    lmShine: ['exp', 0.28],    // 圣所的石头（金）的光：高 = 发光；低 = 失光、变色（4:1）
    lmNear: ['exp', 0.5],      // 你临近我：临到深牢的光（3:57）
    lmJackal: ['exp', 0.45],   // 野狗行在锡安山上（5:18）
    lmThrone: ['exp', 0.2],    // 你的宝座存到万代（5:19）
    lmFire: ['exp', 1.1],      // 在锡安使火着起（4:11）：台上一阵火舌
    lmPlume: ['exp', 0.25],    // 火灭之后的一柱烟
    lmDim: ['lin', 0.2],       // 黄金失光（4:1）：自左而右，一块一块变灰
    lmRoad: ['exp', 0.35],     // 必不使你再被掳去（4:22）：被掳之路上落下一片暖光
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const LV0 = {
    lmEmber: 1, lmWall: 1, lmSink: 0, lmLine: 0, lmLineA: 0, lmCell: 0, lmTears: 0, lmFlow: 0, lmGold: 0, lmGaze: 0,
    lmDawn: 0, lmRays: 0, lmDew: 0, lmShine: 0.45, lmNear: 0, lmJackal: 0, lmThrone: 0,
    lmFire: 0, lmPlume: 0, lmDim: 0, lmRoad: 0,
  };

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    hill0: 0.572,                 // 锡安山的山脚（自此向右升起）
    gate: 0.64,                   // 城门
    tem0: 0.79, tem1: 1.02,       // 圣殿的台（山顶，巨石垒成）
    por: 0.902,                   // 圣所的门（两根门柱，门楣已断）
    zion: 0.607,                  // 锡安（寡妇）坐在城门旁
    jer: 0.535,                   // 耶利米
    cell: 0.506,                  // 深牢（凿过的石头围住他的地方）
    out: 0.53,                    // 他从深牢里出来，站在这里（让开锡安与余民）
    road: 0.345,                  // 被掳之路下到海边
  };
  const ELDERS = [0.668, 0.699, 0.741, 0.772];
  const ELDER_V = [0.24, 0.17, 0.27, 0.2];
  const VIRGINS = [0.806, 0.829, 0.858];
  const VIRGIN_V = [0.12, 0.19, 0.11];
  const ROBE = {
    zion: [72, 64, 76], zionAcc: [120, 110, 124], jer: [112, 98, 82], cap: [104, 92, 84], sack: [108, 94, 76],
    virgin: [124, 100, 112], virginAcc: [206, 194, 200], pass: [128, 102, 72], rem: [124, 108, 92],
  };
  // 余民（3:25–32）：自己一排，在长老之前（画面更低），彼此隔开，不挤在锡安与耶利米身上
  const REM = [
    { x: 0.683, v: 0.52, sex: 'm', age: 'adult', robe: [124, 108, 92] },
    { x: 0.717, v: 0.6, sex: 'f', age: 'adult', robe: [118, 100, 104], acc: [196, 180, 170] },
    { x: 0.755, v: 0.5, sex: 'm', age: 'elder', robe: [110, 98, 84] },
    { x: 0.789, v: 0.58, sex: 'f', age: 'adult', robe: [132, 112, 96], acc: [184, 170, 176] },
    { x: 0.82, v: 0.53, sex: 'm', age: 'child', robe: [120, 104, 100] },
  ];
  const TINT_LAMENT = [200, 206, 230], TINT_DAWN = [255, 226, 176], TINT_PROM = [255, 214, 168], TINT_END = [226, 222, 255];

  // ── 颜色 ────────────────────────────────────────────────────
  const STONE = [228, 214, 186], STONE2 = [212, 196, 166], CHAR = [66, 56, 50], EARTH = [140, 118, 92], BRONZE = [156, 110, 64];
  const GOLD = [236, 198, 112], DULL = [120, 114, 104], JACKAL = [58, 47, 38], HEWN = [176, 164, 144], HOLE = [22, 18, 18];
  const WALLC = [206, 178, 136];      // 城墙与城门的石头：比房屋暖一些、深一些
  const TEAR = [150, 180, 235], TEAR_GOLD = [255, 212, 140];

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const phone = () => W.w < 600;
  const port = () => W.w < W.h * 0.9;
  // 人的身高（像素），与人物模块一致
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1);
  // 城的尺度：宽屏时与人同高；手机上人放大了，城只随画面宽度缩小一些（地窄，城要放得下）
  // 竖屏的手机上，城向上长进空着的天（城的尺度不低于人的 0.8），圣所的门往里挪，免得右门柱出了画面
  const CPH = () => { const p = PH(2); return p * clamp((W.w * 0.045) / p, port() ? 0.8 : 0.62, 1); };
  const porX = () => (port() ? 0.868 : X.por);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  // 近地纵深里的一点（与人物模块的站位相同）：v 0 = 地的轮廓线，1 = 画面底
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  // 余烬映在石上的暖光
  const cityL = () => 0.1 * W.lv.lmEmber * nightK();
  // 月光：夜里的石头泛着冷冷的灰蓝——倾覆了的城在夜里仍看得见（遍地黑暗、黑云压城时暗下去）
  const moonK = () => clamp(W.night * 1.1, 0, 1) * 0.6 * (1 - 0.8 * W.lv.gloom) * (1 - 0.4 * W.lv.storm);
  // 渐变的缓存：同一键（颜色取整、不透明度取两位）只建一次；按单位坐标建的渐变配合 translate/scale 反复使用
  const GC = new Map();
  function grad(key, mk) {
    let g = GC.get(key);
    if (!g) { if (GC.size > 64) GC.clear(); g = mk(); GC.set(key, g); }
    return g;
  }
  const ck = c => (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0);
  // 自上（不透明度 a0）而下（a1）的单位渐变，颜色 c：画在 (0,0)–(1,1) 里
  function vGrad(ctx, c, a0, a1) {
    return grad('v|' + ck(c) + '|' + a0.toFixed(2) + '|' + a1.toFixed(2), () => {
      const g = ctx.createLinearGradient(0, 0, 0, 1);
      g.addColorStop(0, rgba(c, a0)); g.addColorStop(1, rgba(c, a1));
      return g;
    });
  }
  function unitRect(ctx, fill, x, y, w, h) {
    if (!(w > 0.5) || !(h > 0.5)) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(w, h);
    ctx.fillStyle = fill; ctx.fillRect(0, 0, 1, 1);
    ctx.restore();
  }
  function lit(rgb, k, ex) {
    let c = W.shade(rgb, 0.02, (ex || 0) + cityL());
    const mk = moonK();
    if (mk > 0.01) c = mix(c, [rgb[0] * 0.3 + 8, rgb[1] * 0.34 + 10, rgb[2] * 0.44 + 20], mk);
    return k == null || k === 1 ? c : [c[0] * k, c[1] * k, c[2] * k];
  }
  const litCSS = (rgb, k, a, ex) => { const c = lit(rgb, k, ex); return U.rgba(c[0], c[1], c[2], a == null ? 1 : a); };
  const rimRGB = () => mix(mix([255, 244, 222], [255, 188, 120], clamp(W.dusk * 1.3, 0, 1)), [190, 208, 250], W.night);
  const rimA = () => (0.22 + 0.45 * W.dayFactor + 0.3 * W.night) * (1 - 0.55 * W.lv.storm) * (1 - 0.8 * W.lv.gloom);
  const lightX = () => (W.night > 0.55 && W.lv.moon > 0.3 && W.moon.elev > 0 ? W.moon.x : W.sun.x);

  // 锡安山：高出地面多少（以人高计）
  function hillH(xf) {
    const u = (xf - X.hill0) / (1.02 - X.hill0);
    if (u <= 0) return 0;
    return 2.3 * ss(0, 0.66, u) + 0.1 * Math.sin(u * 15 + 1.1) * ss(0.05, 0.3, u) * (1 - ss(0.5, 0.66, u));
  }
  const hillTop = (xf, ph) => gY(2, xf) - hillH(xf) * ph;
  // 圣殿的台（山顶的巨石台）与圣所的门
  function temGeo(ph) {
    const top = hillTop(0.93, ph) - 0.95 * ph;
    return { x0: X.tem0 * W.w, x1: X.tem1 * W.w, top, px: porX() * W.w };
  }
  const temBase = (xf, ph) => hillTop(xf, ph) + 0.32 * ph;
  // 城门两座楼的位置（像素）
  function gateGeo(ph) {
    const gx = X.gate * W.w, g = gY(2, X.gate);
    return { gx, g, l0: gx - 0.86 * ph, l1: gx - 0.3 * ph, r0: gx + 0.3 * ph, r1: gx + 0.86 * ph };
  }

  // 确定性的随机表（只用于形状，不用于状态）
  const R = U.mulberry32(2525);
  // ── 房屋（没有屋顶的石屋）：前墙、侧墙、断口、门洞与窗洞 ──
  const HOUSES = (() => {
    const a = [];
    const N = 11;
    for (let i = 0; i < N; i++) {
      a.push({ xf: lerp(0.59, 0.785, (i + 0.1 + 0.8 * R()) / N), w: 0.72 + 0.62 * R(), h: 0.55 + 0.85 * R(), sink: 0.22 + 0.55 * R(),
        p: [R(), R(), R(), R()], notch: R(), tone: R(), char: 0.1 + 0.45 * R(),
        door: R() < 0.45, win: R() < 0.8, wx: 0.25 + 0.5 * R(), beam: R() < 0.3, ember: R() < 0.35, tw: R() * TAU });
    }
    // 台下的山坡上：低处的一排（在台的前面）
    for (let i = 0; i < 5; i++) {
      a.push({ xf: lerp(0.8, 1.0, (i + 0.15 + 0.7 * R()) / 5), w: 0.8 + 0.6 * R(), h: 0.5 + 0.6 * R(), sink: 1.05 + 0.5 * R(),
        p: [R(), R(), R(), R()], notch: R(), tone: R(), char: 0.15 + 0.4 * R(),
        door: R() < 0.5, win: R() < 0.8, wx: 0.25 + 0.5 * R(), beam: R() < 0.25, ember: R() < 0.3, tw: R() * TAU, low: true });
    }
    return a;
  })();
  // ── 城墙：城门以右的十三段；残段（高）与瓦砾（低）──
  const SEGS = (() => {
    const a = [], N = 13, TALL = { 1: 1, 3: 1, 4: 1, 7: 1, 9: 1, 11: 1 };
    for (let i = 0; i < N; i++) {
      a.push({ h: TALL[i] ? 1.15 + 0.5 * R() : 0.2 + 0.18 * R(), rub: 0.18 + 0.16 * R(), fall: 0.93 - 0.86 * (i / (N - 1)) + 0.03 * (R() - 0.5),
        jag: [R(), R(), R(), R()], cren: !!TALL[i] && R() < 0.7 });
    }
    return a;
  })();
  // 城门以左：一段残墙、一片瓦砾
  const LSEGS = [{ x0: 0.568, x1: 0.592, h: 0.3, rub: 0.2, fall: 0.97, jag: [0.4, 0.8, 0.3, 0.6] },
    { x0: 0.592, x1: 0.62, h: 1.05, rub: 0.24, fall: 0.96, jag: [0.2, 0.5, 0.9, 0.3], cren: true }];
  // ── 圣所的石头（金）：倒在台上、山坡与各市口上（4:1）──
  const GOLDS = (() => {
    const a = [];
    for (let i = 0; i < 8; i++) a.push({ on: 'plat', xf: lerp(0.842, 0.995, (i + R()) / 8), s: 0.14 + 0.1 * R(), rot: R() * 1.2 - 0.6, tw: R() * TAU });
    for (let i = 0; i < 6; i++) a.push({ on: 'hill', xf: lerp(0.655, 0.78, (i + R()) / 6), s: 0.12 + 0.07 * R(), rot: R() - 0.5, tw: R() * TAU });
    for (let i = 0; i < 7; i++) a.push({ on: 'road', xf: lerp(0.56, 0.78, (i + R()) / 7), v: 0.06 + 0.34 * R(), s: 0.13 + 0.08 * R(), rot: R() - 0.5, tw: R() * TAU });
    return a;
  })();
  // ── 圣所门前的瓦砾（以人高计，距门的中线）──
  const RUBBLE = (() => {
    const a = [];
    for (let i = 0; i < 22; i++) {
      const side = i % 2 ? 1 : -1, f = R();
      const dx = side * (0.55 + 2.2 * f * f) + (R() - 0.5) * 0.3;
      a.push({ dx, h: 0.12 + 0.2 * R(), w: 0.18 + 0.24 * R(), lift: 0.34 * (1 - f) * (0.5 + 0.5 * R()), rot: R() * 0.8 - 0.4, tone: R() });
    }
    return a.sort((p, q) => q.lift - p.lift);
  })();
  // ── 烟与余烬 ──
  const SMOKE = [{ xf: 0.9, on: 'plat', k: 1 }, { xf: 0.955, on: 'plat', k: 0.7 }, { xf: 0.69, on: 'hill', k: 0.6 },
    { xf: 0.752, on: 'hill', k: 0.8 }, { xf: 0.615, on: 'hill', k: 0.45 }, { xf: 0.83, on: 'plat', k: 0.5 }];
  // ── 城的泪（2:18）：自废墟的墙脚下渗出五处，顺着山坡流下，汇在城前成河 ──
  const STREAMS = [[0.745, 0.712], [0.797, 0.758], [0.852, 0.81], [0.93, 0.878], [0.988, 0.94]];
  const RIVER_XF = (() => { const a = []; for (let xf = 0.935; xf >= X.road - 1e-6; xf -= 0.0075) a.push(xf); return a; })();
  // ── 露 ──
  const DEW = (() => {
    const a = [];
    for (let i = 0; i < 150; i++) a.push({ xf: 0.36 + 0.64 * R(), v: Math.pow(R(), 0.8) * 0.92, ph: R(), s: 0.6 + 0.9 * R() });
    for (let i = 0; i < 40; i++) a.push({ xf: 0.6 + 0.4 * R(), v: -1, ph: R(), s: 0.5 + 0.7 * R() });
    return a;
  })();
  // ── 深牢：一圈凿过的石头（后排画在人之后，前排画在人之前）；以人高为单位 ──
  const CELL = [
    { dx: -0.84, w: 0.36, h: 0.95, back: true, tilt: -0.05 }, { dx: -0.4, w: 0.4, h: 1.3, back: true, tilt: 0 }, { dx: 0.06, w: 0.42, h: 1.2, back: true, tilt: 0.02 },
    { dx: 0.52, w: 0.36, h: 0.9, back: true, tilt: 0.06 },
    { dx: -0.62, w: 0.4, h: 0.4, back: false, tilt: -0.04 }, { dx: -0.12, w: 0.44, h: 0.34, back: false, tilt: 0 }, { dx: 0.36, w: 0.4, h: 0.44, back: false, tilt: 0.05 },
  ];
  // ── 野狗（5:18）：沿山顶往来 ──
  const JACKALS = [{ a: 0.66, b: 0.74, sp: 0.075, ph: 0.3 }, { a: 0.838, b: 0.866, sp: 0.06, ph: 2.1, on: 'plat' }, { a: 0.935, b: 0.975, sp: 0.05, ph: 4.0, on: 'plat', sz: 0.9 }];

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, rgba(rgb, a0));
    gr.addColorStop(mid || 0.35, rgba(rgb, a0 * 0.32));
    gr.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 160, 80], 1), gold: radial([255, 226, 164], 1), white: radial([244, 246, 255], 1), pale: radial([200, 218, 255], 1),
      smoke: radial([104, 98, 96], 0.8, 0.55), smokeLit: radial([156, 100, 72], 0.8, 0.55), dust: radial([176, 152, 122], 0.85, 0.55),
      sapph: radial([130, 168, 255], 1),
    };
    // 自天垂下的光柱：横向中间亮，纵向上淡下浓、底端收尽
    const beamSp = rgb => {
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, rgba(rgb, 0)); hz.addColorStop(0.5, rgba(rgb, 1)); hz.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.72, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      return b;
    };
    SP.beam = beamSp([255, 250, 236]);
    SP.beamW = beamSp([255, 222, 164]);     // 暖的光柱（你临近我 3:57）
    // 日出的一道光芒：自日处起，渐宽、渐淡
    const r = cnv(256, 64), rg = r.getContext('2d');
    const lg = rg.createLinearGradient(0, 0, 256, 0);
    lg.addColorStop(0, 'rgba(255,232,190,1)'); lg.addColorStop(0.35, 'rgba(255,226,176,0.55)'); lg.addColorStop(1, 'rgba(255,220,170,0)');
    rg.fillStyle = lg;
    rg.beginPath(); rg.moveTo(0, 30); rg.lineTo(256, 0); rg.lineTo(256, 64); rg.lineTo(0, 34); rg.closePath(); rg.fill();
    rg.globalCompositeOperation = 'destination-in';
    const vg = rg.createLinearGradient(0, 0, 0, 64);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(0.3, 'rgba(0,0,0,0.3)'); vg.addColorStop(0.5, 'rgba(0,0,0,1)');
    vg.addColorStop(0.7, 'rgba(0,0,0,0.3)'); vg.addColorStop(1, 'rgba(0,0,0,0)');
    rg.fillStyle = vg; rg.fillRect(0, 0, 256, 64);
    SP.ray = r;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!(a > 0.004) || !(r > 0.5)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }

  // ════════════════════════════════════════════════════════════
  //  人物（皆经人物模块）
  // ════════════════════════════════════════════════════════════
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id) { if (fig(id)) C().remove(id); }
  function crowd(gid, o) { const c = C(); return c.crowd ? c.crowd(gid, o) : null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function crowdFace(gid, d) {
    const c = C();
    if (!c.crowds || !c.crowds.get) return;
    const g = c.crowds.get(gid);
    if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; });
  }
  const eIds = () => ELDERS.map((_, i) => 'lm:e' + i);
  const vIds = () => VIRGINS.map((_, i) => 'lm:v' + i);
  const rIds = () => REM.map((_, i) => 'lm:r' + i);
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) safe('lm.sfx', () => a.sfx(name, o || {}));
  }
  function say(b, lines) { if (!b.instant) safe('lm.narrate', () => ui().narrate(lines, { replace: false })); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const y = fieldY(f.nx, f.v || 0);
    return [f.nx * W.w, y - PH(l) * (1 + 0.35 * (f.v || 0)) * frac];
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function ringFig(b, id, rgb, k) { const p = figPt(id, 0.55); if (p) ringAt(b, p[0], p[1], rgb, PH(2) * (k || 2.2), 2); }

  // ════════════════════════════════════════════════════════════
  //  锡安山与城（近地；画在人之前的一层）
  // ════════════════════════════════════════════════════════════
  function drawHill(ctx, ph) {
    const x0 = X.hill0 - 0.015, x1 = 1.03, n = 72;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const xf = lerp(x0, x1, i / n); const y = hillTop(xf, ph); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = n; i >= 0; i -= 4) { const xf = lerp(x0, x1, i / n); ctx.lineTo(xf * W.w, gY(2, xf) + 3); }
    ctx.closePath();
    ctx.fillStyle = litCSS(mix(EARTH, CHAR, 0.18 + 0.15 * W.lv.lmEmber));
    ctx.fill();
    // 山坡：上受光、下渐暗（夜里山脚沉进地的暗色里，城不像贴在黑地上的剪纸）
    {
      const yt = hillTop(0.95, ph), yb = gY(2, 0.7) + 2;
      const dk = W.shade(CHAR, 0.02, 0);
      ctx.save();
      ctx.translate(0, yt); ctx.scale(1, Math.max(1, yb - yt));
      ctx.fillStyle = vGrad(ctx, dk, 0, 0.35 + 0.35 * clamp(W.night, 0, 1));
      ctx.fill();
      ctx.restore();
    }
    // 山坡上散落的石块
    ctx.fillStyle = litCSS(mix(STONE2, CHAR, 0.35), 0.85);
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const xf = lerp(X.hill0 + 0.01, 0.99, hsh(i * 2.3)), top = hillTop(xf, ph), g = gY(2, xf);
      if (g - top < 0.3 * ph) continue;
      const y = lerp(top + 0.15 * ph, g - 0.05 * ph, hsh(i * 5.1)), r = (0.05 + 0.07 * hsh(i * 7.7)) * ph;
      ctx.moveTo(xf * W.w - r, y); ctx.lineTo(xf * W.w - r * 0.6, y - r); ctx.lineTo(xf * W.w + r * 0.8, y - r * 0.8); ctx.lineTo(xf * W.w + r, y); ctx.closePath();
    }
    ctx.fill();
    // 山脊的受光边
    ctx.strokeStyle = rgba(rimRGB(), rimA() * 0.6);
    ctx.lineWidth = Math.max(1, 1.1 * SU());
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const xf = lerp(x0, x1, i / n); const y = hillTop(xf, ph); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    ctx.stroke();
  }

  // 房屋的墙脚：陷在山坡里，但决不低于地的轮廓线（山脚下的房屋不会悬在前面的地上）
  const houseBase = (h, ph) => Math.min(hillTop(h.xf, ph) + h.sink * ph, gY(2, h.xf) + 0.04 * ph);
  const houseW = (h, ph) => h.w * ph * (port() ? 0.8 : 1);
  // 一间没有屋顶的石屋：前墙的断口是斜的裂痕，右边一道侧墙向后退去；门洞、窗洞、烟熏的痕迹
  function drawHouse(ctx, h, ph, rim, ra, lightLeft, foot) {
    const surf = hillTop(h.xf, ph), x = h.xf * W.w, w = houseW(h, ph), base = houseBase(h, ph), sinkPx = base - surf, H = h.h * ph + sinkPx;
    const x0 = x - w / 2, x1 = x + w / 2;
    // 墙脚渐隐进山坡的颜色：只填在墙的形状里（translate/scale 把单位渐变放到墙脚的 0.4 人高）
    const footFill = () => { ctx.save(); ctx.translate(0, base - 0.4 * ph); ctx.scale(1, 0.4 * ph); ctx.fillStyle = foot; ctx.fill(); ctx.restore(); };
    const P = [0, 1, 2, 3].map(k => base - H * (1 - 0.55 * Math.pow(h.p[k], 1.4)));
    const d = 0.2 * w, dy = -0.45 * d;
    const col = mix(mix(STONE, STONE2, h.tone), CHAR, h.char);
    const fk = lightLeft ? 1 : 0.84, sk = lightLeft ? 0.62 : 0.9;
    // 侧墙（向右后方退去）
    ctx.fillStyle = litCSS(col, sk);
    ctx.beginPath();
    ctx.moveTo(x1, base); ctx.lineTo(x1, P[3]); ctx.lineTo(x1 + d, P[3] + dy + 0.18 * H * h.notch); ctx.lineTo(x1 + d, base + dy * 0.2); ctx.closePath();
    ctx.fill();
    footFill();
    // 前墙：断口是几道斜的裂痕，中间一处缺口
    const nx = x0 + w * (0.3 + 0.4 * h.notch), nd = 0.12 * H;
    ctx.fillStyle = litCSS(col, fk);
    ctx.beginPath();
    ctx.moveTo(x0, base);
    ctx.lineTo(x0, P[0]);
    for (let k = 1; k <= 3; k++) {
      const xa = x0 + (w * (k - 1)) / 3, xb = x0 + (w * k) / 3;
      if (nx > xa && nx < xb) {
        const yN = lerp(P[k - 1], P[k], (nx - xa) / (xb - xa));
        ctx.lineTo(nx - 0.06 * w, yN); ctx.lineTo(nx - 0.03 * w, yN + nd); ctx.lineTo(nx + 0.05 * w, yN + nd); ctx.lineTo(nx + 0.07 * w, yN);
      }
      ctx.lineTo(xb, P[k]);
    }
    ctx.lineTo(x1, base);
    ctx.closePath();
    ctx.fill();
    footFill();
    // 门洞与窗洞（拱形），上面烟熏的黑痕
    const topAt = fx0 => { const f = clamp(fx0, 0, 1) * 3, k = Math.min(2, Math.floor(f)); return lerp(P[k], P[k + 1], f - k); };
    const hole = litCSS(HOLE, 1, 0.95);
    const arch = (cx, yb, ww, hh) => {
      ctx.moveTo(cx - ww / 2, yb); ctx.lineTo(cx - ww / 2, yb - hh + ww / 2); ctx.arc(cx, yb - hh + ww / 2, ww / 2, Math.PI, 0); ctx.lineTo(cx + ww / 2, yb); ctx.closePath();
    };
    ctx.fillStyle = hole;
    ctx.beginPath();
    const holes = [];
    if (h.door) {
      const cx = x0 + w * (h.wx > 0.5 ? 0.28 : 0.7), ww = 0.2 * w, yb = Math.min(surf + 0.05 * ph, base - 0.02 * ph);
      const hh = Math.min(0.62 * ph, H - sinkPx * 0.2, H * 0.7);
      if (topAt((cx - x0) / w) < yb - hh - 0.1 * ph) { arch(cx, yb, ww, hh); holes.push([cx, yb - hh]); }
    }
    if (h.win) { const cx = x0 + w * h.wx, ww = 0.15 * w, yb = base - H * 0.42, hh = H * 0.24; if (topAt(h.wx) < yb - hh - 0.08 * ph) { arch(cx, yb, ww, hh); holes.push([cx, yb - hh]); } }
    ctx.fill();
    // 屋里的余烬
    if (h.ember && W.lv.lmEmber > 0.05 && holes.length) {
      const [cx, cy] = holes[holes.length - 1];
      ctx.fillStyle = rgba([255, 120, 50], 0.5 * W.lv.lmEmber * (0.6 + 0.4 * Math.sin(W.t * 3 + h.tw)) * (0.4 + 0.6 * nightK()));
      ctx.fillRect(cx - 0.06 * w, cy + 0.12 * H, 0.12 * w, 0.1 * H);
    }
    // 烟熏的痕
    if (holes.length) {
      ctx.fillStyle = litCSS(CHAR, 1, 0.25 + 0.2 * h.char);
      ctx.beginPath();
      for (const [cx, cy] of holes) { ctx.moveTo(cx - 0.08 * w, cy); ctx.quadraticCurveTo(cx, cy - 0.5 * ph, cx + 0.1 * w, cy - 0.3 * ph); ctx.lineTo(cx + 0.08 * w, cy); ctx.closePath(); }
      ctx.fill();
    }
    // 烧焦的梁
    if (h.beam) {
      ctx.strokeStyle = litCSS(CHAR, 1, 0.95);
      ctx.lineWidth = Math.max(1, 0.07 * ph);
      ctx.beginPath();
      ctx.moveTo(x0 + w * 0.15, P[0] + 0.1 * ph); ctx.lineTo(x0 + w * 0.15 - 0.35 * ph, P[0] - 0.35 * ph);
      ctx.stroke();
    }
    // 断口与墙角的受光边
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(1, 0.9 * SU());
      ctx.beginPath();
      ctx.moveTo(x0, P[0] + 0.5);
      for (let k = 1; k <= 3; k++) ctx.lineTo(x0 + (w * k) / 3, P[k] + 0.5);
      if (lightLeft) { ctx.moveTo(x0 + 0.5, P[0]); ctx.lineTo(x0 + 0.5, base - 0.1 * ph); }
      else { ctx.moveTo(x1 + d - 0.5, P[3] + dy + 0.18 * H * h.notch); ctx.lineTo(x1 + d - 0.5, base + dy * 0.2 - 0.1 * ph); }
      ctx.stroke();
    }
  }
  let HOUSE_ORDER = null;
  const hillRGB = () => lit(mix(EARTH, CHAR, 0.18 + 0.15 * W.lv.lmEmber));
  function drawHouses(ctx, ph, low) {
    if (!HOUSE_ORDER || HOUSE_ORDER.ph !== ph || HOUSE_ORDER.w !== W.w || HOUSE_ORDER.h !== W.h) {
      HOUSE_ORDER = HOUSES.slice().sort((a, b) => houseBase(a, ph) - houseBase(b, ph));
      HOUSE_ORDER.ph = ph; HOUSE_ORDER.w = W.w; HOUSE_ORDER.h = W.h;
    }
    const rim = rimRGB(), ra = rimA() * 0.85, lightLeft = lightX() < X.gate * W.w;
    const foot = vGrad(ctx, hillRGB(), 0, 0.5 + 0.3 * clamp(W.night, 0, 1));
    for (const h of HOUSE_ORDER) if (!!h.low === !!low) drawHouse(ctx, h, ph, rim, ra, lightLeft, foot);
  }

  // 圣殿的台：巨石一层一层垒成，左端坍成斜坡，台顶火烧过
  function drawTemple(ctx, ph) {
    const G = temGeo(ph), rim = rimRGB(), ra = rimA();
    const x0 = G.x0, x1 = G.x1, top = G.top;
    const edge = [[x0 - 0.7 * ph, null], [x0, top + 0.62 * ph], [x0 + 0.38 * ph, top + 0.62 * ph], [x0 + 0.38 * ph, top + 0.3 * ph],
      [x0 + 0.95 * ph, top + 0.3 * ph], [x0 + 1.2 * ph, top], [x1, top]];
    edge[0][1] = temBase(edge[0][0] / W.w, ph) - 0.05 * ph;
    ctx.beginPath();
    edge.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = 0; i <= 16; i++) { const xx = lerp(x1, x0 - 0.7 * ph, i / 16); ctx.lineTo(xx, temBase(xx / W.w, ph)); }
    ctx.closePath();
    ctx.fillStyle = litCSS(mix(STONE, CHAR, 0.1));
    ctx.fill();
    ctx.save();
    ctx.clip();
    // 巨石（错缝），石的边缘琢过——一道浅，一道深
    const rowH = 0.32 * ph, bottom = temBase(X.tem0, ph);
    ctx.lineWidth = Math.max(0.8, 0.035 * ph);
    ctx.strokeStyle = litCSS(mix(STONE, CHAR, 0.5), 1, 0.45);
    ctx.beginPath();
    for (let r = 0, y = top + rowH; y < bottom; r++, y += rowH) {
      ctx.moveTo(x0 - ph, y); ctx.lineTo(x1, y);
      const bw = (1.0 + 0.4 * hsh(r * 3.1)) * ph;
      for (let x = x0 + (r % 2 ? bw * 0.5 : bw * 0.1) + hsh(r) * bw * 0.3; x < x1; x += bw * (0.8 + 0.45 * hsh(x * 0.013 + r))) { ctx.moveTo(x, y - rowH); ctx.lineTo(x, y); }
    }
    ctx.stroke();
    ctx.strokeStyle = rgba(rim, ra * 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = top + rowH + 1.5; y < bottom; y += rowH) { ctx.moveTo(x0 - ph, y); ctx.lineTo(x1, y); }
    ctx.stroke();
    // 火烧过的台顶（上黑下淡）
    unitRect(ctx, vGrad(ctx, lit(CHAR), 0.72, 0), x0 - ph, top, x1 - x0 + ph, 1.3 * ph);
    ctx.restore();
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(1, 1.1 * SU());
      ctx.beginPath();
      edge.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + 0.5) : ctx.moveTo(p[0], p[1] + 0.5)));
      ctx.stroke();
    }
    return G;
  }
  // 圣所的门：两根门柱，门楣断了一截；两旁的墙斜斜地坍下；门里只有天
  function drawSanctuary(ctx, ph, G) {
    const rim = rimRGB(), ra = rimA();
    const cx = G.px, b = G.top + 0.03 * ph;
    const jw = 0.6 * ph, gp = 0.38 * ph;
    const Lx0 = cx - gp - jw, Lx1 = cx - gp, Rx0 = cx + gp, Rx1 = cx + gp + jw;
    const hL = 2.8 * ph, hR = 2.1 * ph;
    const L = [[Lx0 - 1.6 * ph, b], [Lx0 - 1.6 * ph, b - 0.32 * ph], [Lx0 - 1.05 * ph, b - 0.6 * ph], [Lx0 - 0.85 * ph, b - 0.6 * ph],
      [Lx0 - 0.45 * ph, b - 1.28 * ph], [Lx0, b - 1.5 * ph], [Lx0, b - hL + 0.1 * ph], [Lx0 + 0.2 * jw, b - hL], [Lx1 + 0.44 * ph, b - hL],
      [Lx1 + 0.56 * ph, b - hL + 0.26 * ph], [Lx1 + 0.3 * ph, b - hL + 0.33 * ph], [Lx1, b - hL + 0.36 * ph], [Lx1, b]];
    const Rr = [[Rx0, b], [Rx0, b - hR], [Rx0 + 0.35 * jw, b - hR + 0.1 * ph], [Rx1, b - hR + 0.52 * ph], [Rx1, b - 1.05 * ph],
      [Rx1 + 0.55 * ph, b - 0.98 * ph], [Rx1 + 0.8 * ph, b - 0.58 * ph], [Rx1 + 1.35 * ph, b - 0.52 * ph], [Rx1 + 1.6 * ph, b]];
    const col = mix(STONE, CHAR, 0.14);
    const path = pts => { pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); };
    ctx.fillStyle = litCSS(col);
    ctx.beginPath(); path(L); path(Rr); ctx.fill();
    // 门柱的内侧（背光）与石缝
    const lightLeft = lightX() < cx;
    ctx.fillStyle = litCSS(col, 0.72);
    ctx.fillRect(lightLeft ? Lx1 - 0.1 * ph : Rx0, b - (lightLeft ? hL - 0.36 * ph : hR), 0.1 * ph, lightLeft ? hL - 0.36 * ph : hR);
    ctx.strokeStyle = litCSS(mix(STONE, CHAR, 0.55), 1, 0.4);
    ctx.lineWidth = Math.max(0.8, 0.03 * ph);
    ctx.beginPath();
    for (let y = b - 0.34 * ph; y > b - hL + 0.3 * ph; y -= 0.34 * ph) {
      ctx.moveTo(Lx0, y); ctx.lineTo(Lx1, y);
      if (y > b - hR + 0.5 * ph) { ctx.moveTo(Rx0, y); ctx.lineTo(Rx1, y); }
    }
    ctx.stroke();
    // 左墙上的一个窗洞
    ctx.fillStyle = litCSS(HOLE, 1, 0.9);
    ctx.beginPath();
    const wx = Lx0 - 0.5 * ph, wy = b - 0.35 * ph;
    ctx.moveTo(wx - 0.1 * ph, wy); ctx.lineTo(wx - 0.1 * ph, wy - 0.4 * ph); ctx.arc(wx, wy - 0.4 * ph, 0.1 * ph, Math.PI, 0); ctx.lineTo(wx + 0.1 * ph, wy); ctx.closePath();
    ctx.fill();
    // 火熏的黑（上半截）
    ctx.save();
    ctx.beginPath(); path(L); path(Rr); ctx.clip();
    unitRect(ctx, vGrad(ctx, lit(CHAR), 0.55, 0), Lx0 - 2 * ph, b - hL, (Rx1 - Lx0) + 4 * ph, hL - 0.6 * ph);
    ctx.restore();
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(1, 1.1 * SU());
      ctx.beginPath();
      for (let i = 1; i < L.length - 1; i++) (i > 1 ? ctx.lineTo(L[i][0], L[i][1] + 0.5) : ctx.moveTo(L[i][0], L[i][1] + 0.5));
      for (let i = 1; i < Rr.length - 1; i++) (i > 1 ? ctx.lineTo(Rr[i][0], Rr[i][1] + 0.5) : ctx.moveTo(Rr[i][0], Rr[i][1] + 0.5));
      ctx.stroke();
    }
    // 靠在墙上的烧焦的梁
    ctx.strokeStyle = litCSS(CHAR, 1, 0.95);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 0.08 * ph);
    ctx.beginPath();
    ctx.moveTo(Lx0 - 1.25 * ph, b + 0.02 * ph); ctx.lineTo(Lx0 - 0.55 * ph, b - 1.2 * ph);
    ctx.moveTo(Rx1 + 1.1 * ph, b); ctx.lineTo(Rx1 + 0.45 * ph, b - 0.85 * ph);
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 瓦砾
    for (const s of RUBBLE) {
      const rx = cx + s.dx * ph, w = s.w * ph, h = s.h * ph, ry = b - s.lift * ph - h / 2 + 0.05 * ph;
      ctx.save(); ctx.translate(rx, ry); ctx.rotate(s.rot);
      ctx.fillStyle = litCSS(mix(mix(STONE, STONE2, s.tone), CHAR, 0.2 + 0.3 * s.tone));
      ctx.fillRect(-w / 2, -h / 2, w, h);
      if (ra > 0.01) { ctx.fillStyle = rgba(rim, ra * 0.8); ctx.fillRect(-w / 2, -h / 2, w, Math.max(1, 0.04 * ph)); }
      ctx.restore();
    }
    // 两根折断的铜柱（门廊前，王下 25:13：迦勒底人打碎了铜柱）
    const PIL = [[cx - 1.42 * ph, 1.6, 0.2], [cx + (port() ? 1.2 : 1.42) * ph, 0.82, 0.75]];
    for (const [px, hh, j] of PIL) {
      const pw = 0.26 * ph, H = hh * ph, pb = b + 0.06 * ph;
      ctx.fillStyle = litCSS(mix(BRONZE, CHAR, 0.28), 1, 0.05);
      ctx.beginPath();
      ctx.moveTo(px - pw / 2, pb); ctx.lineTo(px - pw / 2, pb - H * (0.92 - 0.1 * j)); ctx.lineTo(px - pw * 0.1, pb - H);
      ctx.lineTo(px + pw * 0.15, pb - H * (0.86 + 0.08 * j)); ctx.lineTo(px + pw / 2, pb - H * (0.95 - 0.12 * j)); ctx.lineTo(px + pw / 2, pb);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = litCSS(mix(BRONZE, CHAR, 0.6), 1, 0.8);
      ctx.lineWidth = Math.max(0.8, 0.04 * ph);
      ctx.beginPath();
      for (let k = 1; k * 0.3 * ph < H * 0.8; k++) { const y = pb - k * 0.3 * ph; ctx.moveTo(px - pw / 2, y); ctx.lineTo(px + pw / 2, y); }
      ctx.stroke();
      ctx.fillStyle = litCSS(mix(BRONZE, CHAR, 0.45));
      ctx.fillRect(px - pw * 0.8, pb - 0.13 * ph, pw * 1.6, 0.13 * ph);
      if (ra > 0.01) {
        const lx = lightX() < px ? px - pw / 2 + 0.5 : px + pw / 2 - 0.5;
        ctx.strokeStyle = rgba(mix(rim, [255, 196, 130], 0.35), ra);
        ctx.lineWidth = Math.max(1, SU());
        ctx.beginPath(); ctx.moveTo(lx, pb - 0.15 * ph); ctx.lineTo(lx, pb - H * 0.84); ctx.stroke();
      }
    }
    // 倒下的柱头（百合花的样式）
    ctx.fillStyle = litCSS(mix(BRONZE, CHAR, 0.35));
    ctx.beginPath();
    ctx.ellipse(cx + 2.05 * ph, b - 0.14 * ph, 0.3 * ph, 0.15 * ph, 0.3, 0, TAU);
    ctx.fill();
  }

  // 城墙的一段（x 以像素；h 以人高）
  function wallSeg(ctx, xa, xb, ga, gb, h, jag, cren, ph) {
    const n = jag.length, tops = [];
    for (let k = 0; k < n; k++) tops.push(h * (1 - 0.35 * jag[k] * jag[k]) * ph);
    ctx.moveTo(xa, ga);
    for (let k = 0; k < n; k++) {
      const f0 = k / n, f1 = (k + 1) / n;
      const y0 = lerp(ga, gb, f0) - tops[k], y1 = lerp(ga, gb, f1) - tops[k];
      if (cren && h > 0.7 && (k % 2 === 0)) { ctx.lineTo(lerp(xa, xb, f0), y0 - 0.16 * ph); ctx.lineTo(lerp(xa, xb, f1), y1 - 0.16 * ph); }
      else { ctx.lineTo(lerp(xa, xb, f0), y0); ctx.lineTo(lerp(xa, xb, f1), y1); }
    }
    ctx.lineTo(xb, gb);
  }
  function segFall(s) { return ss(0, 1, clamp((s.fall - W.lv.lmWall) * 6, 0, 1)); }
  function wallGeo(ph) {
    const G = gateGeo(ph);
    const xa = G.r1 / W.w + 0.003, xb = 1.03, n = SEGS.length, sw = (xb - xa) / n;
    return { xa, xb, sw, n };
  }
  // 准绳（2:8）：在城墙的高处，自左边的门楼拉到画面右边，微微下垂
  function cordGeo(ph) {
    const G = gateGeo(ph);
    return { ax: G.l0 + 0.12 * ph, ay: G.g - 1.5 * ph, ex: 0.95 * W.w, ey: gY(2, 0.95) - 1.4 * ph, sag: 0.16 * ph };
  }
  const cordPt = (C, t) => [lerp(C.ax, C.ex, t), lerp(C.ay, C.ey, t) + C.sag * 4 * t * (1 - t)];
  // 右边第 i 段墙在 lmWall 降到多少时倒下：线铊（与 lmWall 同速拉开）经过它的中间之时——因与果看得见
  function segThr(i, ph, WG, C) {
    const xm = (WG.xa + (i + 0.5) * WG.sw) * W.w;
    return 1 - clamp((xm - C.ax) / (C.ex - C.ax), 0.02, 0.97);
  }
  function drawWall(ctx, ph) {
    const rim = rimRGB(), ra = rimA();
    const WG = wallGeo(ph), C = cordGeo(ph);
    const segs = [];
    SEGS.forEach((s, i) => segs.push({ x0: WG.xa + i * WG.sw, x1: WG.xa + (i + 1) * WG.sw + 0.0015, h: s.h, rub: s.rub, fall: segThr(i, ph, WG, C), jag: s.jag, cren: s.cren }));
    for (const s of LSEGS) segs.push(s);
    ctx.beginPath();
    for (const s of segs) {
      const h = lerp(s.h, s.rub, segFall(s));
      wallSeg(ctx, s.x0 * W.w, s.x1 * W.w, gY(2, s.x0) + 0.04 * ph, gY(2, s.x1) + 0.04 * ph, h, s.jag, s.cren && segFall(s) < 0.3, ph);
      ctx.closePath();
    }
    ctx.fillStyle = litCSS(mix(WALLC, CHAR, 0.16));
    ctx.fill();
    // 石缝
    ctx.strokeStyle = litCSS(mix(STONE, CHAR, 0.55), 1, 0.45);
    ctx.lineWidth = Math.max(0.7, 0.03 * ph);
    ctx.beginPath();
    for (const s of segs) {
      const h = lerp(s.h, s.rub, segFall(s));
      if (h < 0.5) continue;
      const xa = s.x0 * W.w, xb = s.x1 * W.w, ga = gY(2, s.x0), gb = gY(2, s.x1);
      for (let y = 0.26; y < h * 0.8; y += 0.26) { ctx.moveTo(xa + 1, ga - y * ph); ctx.lineTo(xb - 1, gb - y * ph); }
    }
    ctx.stroke();
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra * 0.9);
      ctx.lineWidth = Math.max(1, 0.9 * SU());
      ctx.beginPath();
      for (const s of segs) {
        const fk = segFall(s), h = lerp(s.h, s.rub, fk);
        const xa = s.x0 * W.w, xb = s.x1 * W.w, ga = gY(2, s.x0) + 0.04 * ph, gb = gY(2, s.x1) + 0.04 * ph;
        const n = s.jag.length;
        for (let k = 0; k < n; k++) {
          const t = h * (1 - 0.35 * s.jag[k] * s.jag[k]) * ph + (s.cren && h > 0.7 && fk < 0.3 && k % 2 === 0 ? 0.16 * ph : 0);
          ctx.moveTo(lerp(xa, xb, k / n), lerp(ga, gb, k / n) - t + 0.5);
          ctx.lineTo(lerp(xa, xb, (k + 1) / n), lerp(ga, gb, (k + 1) / n) - t + 0.5);
        }
      }
      ctx.stroke();
    }
  }
  // 城门：两座折断的门楼；门扇倒在门口；陷入地内（2:9）
  function drawGate(ctx, ph) {
    const G = gateGeo(ph), rim = rimRGB(), ra = rimA();
    const sink = ss(0, 1, W.lv.lmSink);
    const tower = (a, b, h, j) => {
      const H = h * ph * (1 - 0.78 * sink), g = G.g + 0.05 * ph;
      if (H < 1) return;
      ctx.moveTo(a, g);
      ctx.lineTo(a, g - H * (0.9 + 0.1 * j));
      ctx.lineTo(lerp(a, b, 0.3), g - H * (0.9 + 0.1 * j));
      ctx.lineTo(lerp(a, b, 0.3), g - H);
      ctx.lineTo(lerp(a, b, 0.62), g - H);
      ctx.lineTo(lerp(a, b, 0.62), g - H * (0.8 - 0.1 * j));
      ctx.lineTo(b, g - H * (0.72 + 0.1 * j));
      ctx.lineTo(b, g);
      ctx.closePath();
    };
    // 两楼之间的门墙与拱形的门洞（门陷下时一同变矮）
    {
      const gk = 1 - 0.78 * sink, g = G.g + 0.05 * ph, gh = 1.5 * ph * gk;
      if (gh > 2) {
        ctx.fillStyle = litCSS(mix(WALLC, CHAR, 0.24));
        ctx.fillRect(G.l1 - 1, g - gh, G.r0 - G.l1 + 2, gh);
        const aw = (G.r0 - G.l1) * 0.74, ah = Math.max(aw * 0.55, 1.12 * ph * gk), ar = Math.min(aw / 2, ah);
        ctx.fillStyle = litCSS(HOLE, 1, 0.96);
        ctx.beginPath();
        ctx.moveTo(G.gx - aw / 2, g); ctx.lineTo(G.gx - aw / 2, g - ah + ar);
        ctx.arc(G.gx, g - ah + ar, ar, Math.PI, 0);
        ctx.lineTo(G.gx + aw / 2, g); ctx.closePath();
        ctx.fill();
        if (ra > 0.01) {
          ctx.strokeStyle = rgba(rim, ra * 0.8);
          ctx.lineWidth = Math.max(1, 0.8 * SU());
          ctx.beginPath(); ctx.moveTo(G.l1, g - gh + 0.5); ctx.lineTo(G.r0, g - gh + 0.5); ctx.stroke();
        }
      }
    }
    // 门扇（木，烧焦）：斜倒在门口，门陷下时隐去
    if (sink < 0.95) {
      ctx.fillStyle = litCSS(mix([96, 70, 48], CHAR, 0.5), 1, 1 - sink);
      ctx.beginPath();
      const g = G.g + 0.05 * ph, dh = 0.95 * ph * (1 - sink);
      ctx.moveTo(G.l1, g); ctx.lineTo(G.l1 + 0.1 * ph, g - dh); ctx.lineTo(G.l1 + 0.3 * ph, g - dh * 0.92); ctx.lineTo(G.l1 + 0.28 * ph, g);
      ctx.moveTo(G.r0 - 0.34 * ph, g); ctx.lineTo(G.r0 - 0.02 * ph, g - dh * 0.45); ctx.lineTo(G.r0 + 0.02 * ph, g - dh * 0.38); ctx.lineTo(G.r0 - 0.2 * ph, g);
      ctx.fill();
    }
    ctx.beginPath();
    tower(G.l0, G.l1, 2.05, 0);
    tower(G.r0, G.r1, 1.7, 1);
    ctx.fillStyle = litCSS(mix(WALLC, CHAR, 0.14));
    ctx.fill();
    // 门楼上的箭窗
    if (sink < 0.6) {
      ctx.fillStyle = litCSS(HOLE, 1, 0.9 * (1 - sink / 0.6));
      const g = G.g + 0.05 * ph;
      ctx.fillRect(lerp(G.l0, G.l1, 0.42), g - 1.45 * ph * (1 - 0.78 * sink), 0.07 * ph, 0.28 * ph);
      ctx.fillRect(lerp(G.r0, G.r1, 0.45), g - 1.15 * ph * (1 - 0.78 * sink), 0.07 * ph, 0.26 * ph);
    }
    // 门陷入地内：脚下堆起一道参差的瓦砾（石色，顶上受光）
    if (sink > 0.02) {
      const g = G.g + 0.07 * ph, xa = G.l0 - 0.3 * ph, xb = G.r1 + 0.3 * ph, n = 12, tops = [];
      for (let i = 0; i <= n; i++) {
        const f = i / n, env = 0.35 + 0.65 * Math.sin(f * Math.PI);
        tops.push([lerp(xa, xb, f), g - (0.1 + 0.15 * hsh(i * 3.7 + 1)) * ph * sink * env]);
        if (i < n) tops.push([lerp(xa, xb, f + 0.5 / n), g - (0.06 + 0.1 * hsh(i * 5.3 + 2)) * ph * sink * env]);
      }
      ctx.fillStyle = litCSS(mix(WALLC, CHAR, 0.34));
      ctx.beginPath();
      ctx.moveTo(xa, g);
      for (const t of tops) ctx.lineTo(t[0], t[1]);
      ctx.lineTo(xb, g);
      ctx.closePath();
      ctx.fill();
      // 几块大一些的石头
      ctx.fillStyle = litCSS(mix(WALLC, CHAR, 0.2));
      for (let i = 0; i < 5; i++) {
        const bx = lerp(xa, xb, 0.12 + 0.19 * i + 0.05 * hsh(i * 9.1)), bw = (0.16 + 0.1 * hsh(i * 2.9)) * ph, bh = (0.09 + 0.06 * hsh(i * 6.1)) * ph * sink;
        ctx.fillRect(bx - bw / 2, g - bh - 0.02 * ph, bw, bh);
      }
      if (ra > 0.01) {
        ctx.strokeStyle = rgba(rim, ra * 0.8);
        ctx.lineWidth = Math.max(1, 0.8 * SU());
        ctx.beginPath();
        tops.forEach((t, i) => (i ? ctx.lineTo(t[0], t[1] + 0.5) : ctx.moveTo(t[0], t[1] + 0.5)));
        ctx.stroke();
      }
    }
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(1, 0.9 * SU());
      const g = G.g + 0.05 * ph;
      ctx.beginPath();
      const H1 = 2.05 * ph * (1 - 0.78 * sink), H2 = 1.7 * ph * (1 - 0.78 * sink);
      if (H1 > 2) { ctx.moveTo(lerp(G.l0, G.l1, 0.3), g - H1 + 0.5); ctx.lineTo(lerp(G.l0, G.l1, 0.62), g - H1 + 0.5); ctx.moveTo(G.l0 + 0.5, g - H1 * 0.9); ctx.lineTo(G.l0 + 0.5, g - 0.1 * ph); }
      if (H2 > 2) { ctx.moveTo(lerp(G.r0, G.r1, 0.3), g - H2 + 0.5); ctx.lineTo(lerp(G.r0, G.r1, 0.62), g - H2 + 0.5); }
      ctx.stroke();
    }
  }
  // 废墟脚下看得见的山坡从哪里起：盖在 xf 上的房屋（或圣殿的台）的墙脚
  function coverY(xf, ph, G) {
    let y = hillTop(xf, ph);
    const px = xf * W.w;
    for (const h of HOUSES) {
      const w = houseW(h, ph), hx = h.xf * W.w;
      if (px >= hx - w / 2 - 2 && px <= hx + w * 0.7 + 2) y = Math.max(y, houseBase(h, ph));
    }
    if (px >= G.x0 - 0.7 * ph) y = Math.max(y, temBase(xf, ph));
    return Math.min(y, gY(2, xf));
  }
  // 圣所的石头（金）：倒在台上、废墟脚下的街上与各市口上；失光的时候变成灰色（4:1）
  const GK = 1.7;     // 石块的大小（以人高计）的放大
  function goldPt(s, ph, G) {
    if (s.on === 'plat') return [s.xf * W.w, G.top - s.s * GK * ph * 0.45];
    if (s.on === 'hill') return [s.xf * W.w, coverY(s.xf, ph, G) + 0.02 * ph];
    return [s.xf * W.w, fieldY(s.xf, s.v)];
  }
  // 每块石头自己的光：lmDim 自 0 到 1 时，失光自左而右一块一块走过去
  function goldShine(s) {
    const u = clamp((s.xf - 0.55) / 0.45, 0, 1);
    return lerp(W.lv.lmShine, 0.06, ss(0, 1, W.lv.lmDim * 3 - u * 2));
  }
  function drawGold(ctx, ph, G) {
    const glowK = 0.25 + 0.75 * Math.max(W.dayFactor, 0.6 * W.lv.lmEmber * nightK());
    // 凿过的石块：一个斜放的方石，顶上贴金（失光时顶面也灰了）
    const shape = (s, p, hi) => {
      const r = s.s * GK * ph * 0.5, c = Math.cos(s.rot * 0.5), n = Math.sin(s.rot * 0.5);
      const q = (dx, dy) => [p[0] + dx * c - dy * n, p[1] + dx * n + dy * c];
      const pts = hi ? [q(-r, -0.35 * r), q(-0.55 * r, -0.75 * r), q(r * 0.95, -0.7 * r), q(r, -0.3 * r)]
        : [q(-r, 0.45 * r), q(-r, -0.35 * r), q(r, -0.3 * r), q(r * 1.05, 0.5 * r)];
      ctx.beginPath();
      pts.forEach((t, i) => (i ? ctx.lineTo(t[0], t[1]) : ctx.moveTo(t[0], t[1])));
      ctx.closePath();
      ctx.fill();
    };
    const P = GOLDS.map(s => goldPt(s, ph, G)), SH = GOLDS.map(goldShine);
    GOLDS.forEach((s, i) => {
      const sh = SH[i], col = mix(DULL, GOLD, clamp(sh, 0, 1));
      ctx.fillStyle = litCSS(mix(col, STONE2, 0.45), 0.9);
      shape(s, P[i], false);
      ctx.fillStyle = litCSS(col, 1, 1, 0.06 * sh);
      shape(s, P[i], true);
    });
    // 闪光
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    GOLDS.forEach((s, i) => {
      const lt = SH[i] * glowK;
      if (lt < 0.03) return;
      const tw = Math.pow(Math.max(0, Math.sin(W.t * 1.1 + s.tw)), 6);
      const a = lt * (0.15 + 0.85 * tw);
      if (a < 0.02) return;
      const sz = s.s * GK * ph, p = P[i], py = p[1] - sz * 0.2;
      glowSp(ctx, SP.gold, p[0], py, sz * (1.1 + 1.2 * tw), a * 0.7);
      if (tw > 0.3) {
        ctx.strokeStyle = rgba([255, 240, 200], a * 0.8);
        ctx.lineWidth = 1;
        const L = sz * 1.1 * tw;
        ctx.beginPath(); ctx.moveTo(p[0] - L, py); ctx.lineTo(p[0] + L, py); ctx.moveTo(p[0], py - L); ctx.lineTo(p[0], py + L); ctx.stroke();
      }
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 烟与余烬 ──
  function smokePt(s, ph, G) { return s.on === 'plat' ? [s.xf * W.w, G.top - 0.3 * ph] : [s.xf * W.w, hillTop(s.xf, ph) - 0.1 * ph]; }
  function drawSmoke(ctx, ph, G) {
    const k = W.lv.lmEmber;
    if (k < 0.01) return;
    SP || sprites();
    const nk = nightK(), day = 0.3 + 0.7 * W.daylight;
    // 余烬的红光
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < SMOKE.length; i++) {
      const s = SMOKE[i], p = smokePt(s, ph, G);
      const fl = 0.75 + 0.15 * Math.sin(W.t * 5.3 + i * 2.1) + 0.1 * Math.sin(W.t * 11.7 + i);
      glowSp(ctx, SP.warm, p[0], p[1] + 0.1 * ph, ph * (0.7 + 0.5 * s.k), k * s.k * fl * (0.25 + 0.55 * nk));
    }
    ctx.globalCompositeOperation = 'source-over';
    // 烟
    const sp = nk > 0.25 ? SP.smokeLit : SP.smoke;
    for (let i = 0; i < SMOKE.length; i++) {
      const s = SMOKE[i], p = smokePt(s, ph, G), H = (3.2 + 1.6 * s.k) * ph, w = 0.3 * ph;
      for (let j = 0; j < 8; j++) {
        const q = U.fract(W.t * 0.05 + j / 8 + i * 0.37);
        const drift = (W.wind * 0.6 + 0.4) * q * q * H * 0.5 + Math.sin(W.t * 0.6 + j * 1.7 + i) * w * 0.35 * q;
        const r = w * (0.6 + q * 3);
        const a = k * s.k * Math.min(1, q * 6) * (1 - q) * 0.42 * day * (1 - 0.5 * W.lv.storm);
        if (a < 0.004) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(sp, p[0] + drift - r, p[1] - q * H - r, r * 2, r * 2);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 在锡安使火着起（4:11）：台上几条高高的火舌，一阵就落下
  function drawFire(ctx, ph, G) {
    const k = W.lv.lmFire;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const xs = [0.835, 0.878, 0.935, 0.978];
    glowSp(ctx, SP.warm, 0.9 * W.w, G.top, 3 * ph, 0.55 * k);
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i] * W.w, Ht = (1.7 + 0.9 * hsh(i * 4.1)) * ph * k;
      for (let j = 0; j < 6; j++) {
        const f = j / 5, fl = Math.sin(W.t * (7 + i) + j * 1.3);
        const r = ph * (0.62 - 0.44 * f) * (0.85 + 0.15 * fl);
        const xx = x + Math.sin(W.t * 3.1 + i + f * 2.2) * 0.14 * ph * f, yy = G.top - 0.05 * ph - f * Ht;
        glowSp(ctx, f < 0.45 ? SP.warm : SP.gold, xx, yy, r * 1.5, k * (0.95 - 0.55 * f));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 火灭之后：一柱烟自台上升起
  function drawPlume(ctx, ph, G) {
    const k = W.lv.lmPlume;
    if (k < 0.01) return;
    SP || sprites();
    const day = 0.4 + 0.6 * W.daylight, x = 0.9 * W.w, y = G.top - 0.2 * ph, H = 6.5 * ph;
    for (let j = 0; j < 12; j++) {
      const q = U.fract(W.t * 0.045 + j / 12);
      const drift = (W.wind * 0.6 + 0.4) * q * q * H * 0.55 + Math.sin(W.t * 0.5 + j * 1.9) * 0.22 * ph * q;
      const r = ph * (0.45 + q * 2.4);
      const a = k * Math.min(1, q * 5) * (1 - q) * 0.6 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - r, y - q * H - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 必不使你再被掳去（4:22）：被掳之路上落下一片暖光，留在那里
  function drawRoad(ctx) {
    const k = W.lv.lmRoad;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const r = 0.045 * W.w + 0.5 * PH(2);
    for (let i = 0; i < 7; i++) {
      const xf = 0.37 + 0.024 * i;
      ctx.save();
      ctx.translate(xf * W.w, fieldY(xf, 0.1));
      ctx.scale(1, 0.22);
      glowSp(ctx, SP.gold, 0, 0, r, 0.26 * k * (0.9 + 0.1 * Math.sin(W.t * 0.7 + i * 1.3)));
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 火星（纯装饰；只在观看时有）
  const EM = [];
  let emAcc = 0;
  function spawnEmber(ph, G) {
    const s = SMOKE[Math.floor(Math.random() * SMOKE.length)], p = smokePt(s, ph, G);
    EM.push({ x: p[0] + (Math.random() - 0.5) * 0.4 * ph, y: p[1], vx: (Math.random() - 0.5) * 8, vy: -(14 + 22 * Math.random()) * SU(), t: 0, max: 1.6 + 2 * Math.random() });
  }
  function drawEmbers(ctx) {
    if (!EM.length) return;
    ctx.globalCompositeOperation = 'lighter';
    const s = Math.max(1, 1.5 * SU());
    for (const e of EM) {
      const a = (1 - e.t / e.max) * W.lv.lmEmber * (0.4 + 0.6 * nightK());
      if (a < 0.02) continue;
      ctx.fillStyle = rgba([255, 150 + 60 * (1 - e.t / e.max), 70], a);
      ctx.fillRect(e.x, e.y, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 野狗（5:18）：沿山顶往来，细腿、尖耳、垂着的尾 ──
  function jackal(ctx, x, y, s, dir, ph, fill, rim, ra) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    const sw = Math.sin(ph) * 0.34, sw2 = Math.sin(ph + Math.PI) * 0.34;
    const legH = 0.41 * s, by = -0.46 * s;
    ctx.fillStyle = fill; ctx.strokeStyle = fill;
    ctx.lineWidth = Math.max(1, 0.06 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    const leg = (hx, a) => { ctx.moveTo(hx, by + 0.05 * s); ctx.lineTo(hx + Math.sin(a) * legH, by + 0.05 * s + Math.cos(a) * legH); };
    leg(0.22 * s, sw); leg(0.16 * s, sw2); leg(-0.19 * s, sw2); leg(-0.25 * s, sw);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, by, 0.3 * s, 0.1 * s, -0.05, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0.16 * s, by - 0.08 * s);
    ctx.lineTo(0.35 * s, by - 0.25 * s);
    ctx.lineTo(0.39 * s, by - 0.38 * s);
    ctx.lineTo(0.42 * s, by - 0.47 * s);
    ctx.lineTo(0.46 * s, by - 0.34 * s);
    ctx.lineTo(0.62 * s, by - 0.25 * s);
    ctx.lineTo(0.47 * s, by - 0.18 * s);
    ctx.lineTo(0.3 * s, by + 0.05 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-0.27 * s, by - 0.04 * s);
    ctx.quadraticCurveTo(-0.5 * s, by + 0.0 * s, -0.52 * s, by + 0.26 * s);
    ctx.quadraticCurveTo(-0.4 * s, by + 0.12 * s, -0.24 * s, by + 0.06 * s);
    ctx.closePath();
    ctx.fill();
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(0.8, 0.035 * s);
      ctx.beginPath();
      ctx.moveTo(-0.26 * s, by - 0.09 * s); ctx.quadraticCurveTo(0, by - 0.13 * s, 0.35 * s, by - 0.25 * s);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    ctx.restore();
  }
  function jackalPos(j, ph, G) {
    const q = 0.5 + 0.5 * Math.sin(W.t * j.sp + j.ph);
    const xf = lerp(j.a, j.b, q);
    const dir = Math.cos(W.t * j.sp + j.ph) >= 0 ? 1 : -1;
    const y = j.on === 'plat' ? G.top - 0.02 * ph : hillTop(xf, ph) + 0.02 * ph;
    return { x: xf * W.w, y, dir };
  }
  function drawJackals(ctx, ph, G) {
    const k = W.lv.lmJackal;
    if (k < 0.01) return;
    const s = 0.72 * ph, rim = rimRGB(), ra = Math.max(0.25, rimA()) * k;
    ctx.globalAlpha = clamp(k * 1.6, 0, 1);
    const fill = litCSS(JACKAL);
    JACKALS.forEach((j, i) => {
      const p = jackalPos(j, ph, G);
      jackal(ctx, p.x, p.y, s * (j.sz || 1), p.dir, W.t * 7.5 + i * 1.3, fill, rim, ra);
    });
    ctx.globalAlpha = 1;
  }

  // ── 泪河（2:18）：自废墟脚下五处流下，汇在城前，顺着被掳之路流进海里 ──
  // 一道细流：自墙脚下顺坡往左下流到山脚，弯弯曲曲（画在房屋之后，所以不会横过墙面）
  function streamPts(st, ph, G) {
    const [xa, xb] = st;
    const y0 = coverY(xa, ph, G) + 0.05 * ph, y1 = gY(2, xb) + 0.05 * ph;
    if (y1 - y0 < 0.2 * ph) return null;
    const P = [];
    const n = 12;
    for (let j = 0; j <= n; j++) {
      const f = j / n, e = f * f * (3 - 2 * f);
      const xf = lerp(xa, xb, 0.35 * f + 0.65 * e);
      P.push(xf * W.w + Math.sin(f * 9 + xa * 70) * 0.06 * ph * Math.sin(f * Math.PI), lerp(y0, y1, f));
    }
    return P;
  }
  function riverPts(ph) {
    const P = [];
    for (const xf of RIVER_XF) {
      const g = gY(2, xf);
      const k = 1 - ss(X.road, X.gate - 0.03, xf);
      const y = g + ph * 0.06 + k * Math.max(0, W.h - g) * 0.3;
      P.push(xf * W.w + Math.sin(xf * 97) * 0.05 * ph, Math.min(W.h - 1, y));
    }
    return P;
  }
  // 折线的累计长度
  function polyLen(P) {
    const L = [0];
    for (let i = 2; i < P.length; i += 2) L.push(L[L.length - 1] + Math.hypot(P[i] - P[i - 2], P[i + 1] - P[i - 1]));
    return L;
  }
  // 画折线上自长度 a 到 b 的一段
  function strokeRange(ctx, P, L, a, b) {
    if (!(b > a)) return;
    let on = false;
    for (let k = 1; k < L.length; k++) {
      const l0 = L[k - 1], l1 = L[k];
      if (l1 < a) continue;
      if (l0 > b) break;
      const x0 = P[2 * k - 2], y0 = P[2 * k - 1], x1 = P[2 * k], y1 = P[2 * k + 1], d = l1 - l0 || 1;
      if (!on) { const t = clamp((a - l0) / d, 0, 1); ctx.moveTo(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); on = true; }
      if (l1 <= b) ctx.lineTo(x1, y1);
      else { const t = (b - l0) / d; ctx.lineTo(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t); break; }
    }
  }
  const tearCol = () => mix(TEAR, TEAR_GOLD, clamp(W.lv.lmGold, 0, 1));
  // 泪光：夜里清亮些；化作金色时只是换了颜色（随即淡去），不更亮
  const tearA = () => W.lv.lmTears * (0.45 + 0.55 * nightK()) * (1 - 0.25 * W.lv.lmGold);
  // 柔的水带：一道宽而淡的光晕、一道芯；流动的亮点只略白一些
  const TPASS = [[10, 0.05], [4.5, 0.1], [2.4, 0.3]];
  function drawStreams(ctx, ph, G) {
    const k = W.lv.lmTears, fl = W.lv.lmFlow;
    if (k < 0.01 || fl < 0.003) return;
    const col = tearCol(), A = tearA(), u = SU(), fS = clamp(fl / 0.28, 0, 1);
    const paths = [];
    for (const st of STREAMS) { const P = streamPts(st, ph, G); if (P) paths.push([P, polyLen(P)]); }
    if (!paths.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [lw, a] of TPASS) {
      ctx.beginPath();
      for (const [P, L] of paths) strokeRange(ctx, P, L, 0, L[L.length - 1] * fS);
      ctx.lineWidth = lw * u * 0.55; ctx.strokeStyle = rgba(col, a * A); ctx.stroke();
    }
    ctx.setLineDash([3 * u, 16 * u]);
    ctx.lineDashOffset = -W.t * 16 * u;
    ctx.beginPath();
    for (const [P, L] of paths) strokeRange(ctx, P, L, 0, L[L.length - 1] * fS);
    ctx.lineWidth = 1.2 * u; ctx.strokeStyle = rgba(mix(col, [255, 255, 255], 0.25), 0.45 * A); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  // 城前的河：越往海边越宽（分成几段，各段的宽度不同）
  function drawRiver(ctx, ph) {
    const k = W.lv.lmTears, fl = W.lv.lmFlow;
    if (k < 0.01 || fl < 0.2) return;
    const col = tearCol(), A = tearA(), u = SU(), fR = clamp((fl - 0.2) / 0.62, 0, 1);
    const P = riverPts(ph), L = polyLen(P), tot = L[L.length - 1], end = tot * fR, NC = 6;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
    for (const [lw, a] of TPASS) {
      ctx.strokeStyle = rgba(col, a * A);
      for (let c = 0; c < NC; c++) {
        const a0 = (tot * c) / NC, a1 = Math.min(end, (tot * (c + 1)) / NC);
        if (a1 <= a0) break;
        ctx.beginPath();
        strokeRange(ctx, P, L, a0, a1);
        ctx.lineWidth = lw * u * (1 + (2 * (c + 0.5)) / NC);
        ctx.stroke();
      }
    }
    ctx.setLineDash([3 * u, 16 * u]);
    ctx.lineDashOffset = -W.t * 20 * u;
    ctx.lineCap = 'round';
    ctx.beginPath();
    strokeRange(ctx, P, L, 0, end);
    ctx.lineWidth = 1.5 * u; ctx.strokeStyle = rgba(mix(col, [255, 255, 255], 0.25), 0.5 * A); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  // 泪河入海处：一片闪动的光
  function drawTearSea(ctx) {
    const k = W.lv.lmTears, f = clamp((W.lv.lmFlow - 0.8) / 0.2, 0, 1);
    if (k < 0.01 || f <= 0) return;
    const col = tearCol(), A = tearA();
    const mx = X.road * W.w, my = W.h;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < 30; i++) {
      const h1 = hsh(i * 1.7), h2 = hsh(i * 3.1 + 2), d = Math.pow(h1, 0.85);
      if (d > f) continue;
      const y = my - (0.008 + 0.1 * h2 * (0.25 + d)) * W.h;
      const x = mx - d * 0.3 * W.w - h2 * 0.02 * W.w;
      const sc = W.seaScale(y), len = (8 + 30 * hsh(i * 5.3)) * sc;
      const tw = 0.45 + 0.55 * Math.sin(W.t * (1.1 + h2) + i * 2.1);
      ctx.strokeStyle = rgba(col, A * (1 - d * 0.8) * 0.6 * tw);
      ctx.lineWidth = Math.max(1, 1.6 * sc);
      ctx.beginPath(); ctx.moveTo(x - len / 2, y); ctx.lineTo(x + len / 2, y); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'butt';
  }

  // ── 露：日出时满地闪烁 ──
  let DEWP = null;     // 露的位置（随画面大小缓存）
  function dewPts(ph) {
    if (DEWP && DEWP.w === W.w && DEWP.h === W.h && DEWP.ph === ph) return DEWP;
    const u = SU();
    DEWP = { w: W.w, h: W.h, ph, p: DEW.map(d => [d.xf * W.w, d.v < 0 ? hillTop(d.xf, ph) + 0.08 * ph : fieldY(d.xf, d.v), d.s * u * (d.v < 0 ? 0.8 : 1 + 0.5 * d.v), d.ph * TAU]) };
    return DEWP;
  }
  function drawDew(ctx, ph) {
    const k = W.lv.lmDew;
    if (k < 0.01) return;
    const lit = k * (0.35 + 0.65 * Math.max(W.dayFactor, W.dusk));
    const P = dewPts(ph).p;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,244,218)';
    const t = W.t * 0.9;
    for (let i = 0; i < P.length; i++) {
      const d = P[i];
      const sn = Math.sin(t + d[3]);
      const tw = sn > 0 ? Math.pow(sn, 8) : 0;
      const a = lit * (0.12 + 0.88 * tw);
      if (a < 0.025) continue;
      const r = d[2] * (0.8 + 1.8 * tw), x = d[0], y = d[1];
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillRect(x - r * 0.5, y - r * 0.5, r, r);
      if (tw > 0.4) {
        ctx.globalAlpha = Math.min(1, a * 0.5);
        ctx.fillRect(x - r * 2.2, y - 0.4, r * 4.4, 0.8);
        ctx.fillRect(x - 0.4, y - r * 2.2, 0.8, r * 4.4);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 深牢：凿过的石头 ──
  function cellStone(ctx, c, ph, base, k, col, rim, ra) {
    const x = X.cell * W.w + c.dx * ph, w = c.w * ph, h = c.h * 1.25 * ph * k;
    if (h < 0.5) return;
    ctx.save();
    ctx.translate(x, base);
    ctx.rotate(c.tilt || 0);
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(-w / 2, 0);
    ctx.lineTo(-w / 2, -h + 0.06 * ph);
    ctx.lineTo(-w / 2 + 0.07 * ph, -h);
    ctx.lineTo(w / 2 - 0.05 * ph, -h + 0.02 * ph);
    ctx.lineTo(w / 2, -h + 0.08 * ph);
    ctx.lineTo(w / 2, 0);
    ctx.closePath();
    ctx.fill();
    // 背光的一面
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(w / 2 - 0.1 * w, -h + 0.08 * ph, 0.1 * w, h - 0.08 * ph);
    if (ra > 0.01) {
      ctx.strokeStyle = rgba(rim, ra);
      ctx.lineWidth = Math.max(1, 0.9 * SU());
      ctx.beginPath(); ctx.moveTo(-w / 2 + 0.07 * ph, -h + 0.5); ctx.lineTo(w / 2 - 0.05 * ph, -h + 0.02 * ph + 0.5); ctx.stroke();
    }
    // 凿痕
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const yy = -h * (i / 4); ctx.moveTo(-w / 2 + 2, yy); ctx.lineTo(-w / 2 + w * (0.3 + 0.15 * i), yy + 1.5); }
    ctx.stroke();
    ctx.restore();
  }
  function drawCell(ctx, ph, back) {
    const k = W.lv.lmCell;
    if (k < 0.01) return;
    const g = gY(2, X.cell);
    const base = back ? g + 0.03 * ph : fieldY(X.cell, 0.13);
    // 前排画在人之上（'air' 层），须自己承受遍地的黑暗
    const dark = back ? 1 : 1 - 0.9 * W.lv.gloom;
    const c = lit(mix(HEWN, CHAR, 0.12), dark);
    const col = rgba(c, 1);
    const rim = rimRGB(), ra = Math.max(rimA() * (back ? 1 : dark), 0.45 * W.lv.gloom);
    const ek = ss(0, 1, k);
    for (const st of CELL) if (st.back === back) cellStone(ctx, st, ph, base, ek, col, rim, ra);
  }

  // ════════════════════════════════════════════════════════════
  //  天上与空中的光
  // ════════════════════════════════════════════════════════════
  // 东方的第一线光（3:21）：地平线左端一团压扁的柔光（不是一道硬线——经文正好在地平线上）
  function drawDawnLine(ctx) {
    const k = W.lv.lmDawn * (1 - clamp(W.daylight * 1.2, 0, 1));
    if (k < 0.01) return;
    SP || sprites();
    const hz = W.horizonY;
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    ctx.translate(0.03 * W.w, hz);
    ctx.scale(1, 0.1);
    glowSp(ctx, SP.gold, 0, 0, 0.5 * M(), 0.35 * k);
    ctx.restore();
    glowSp(ctx, SP.gold, 0.03 * W.w, hz, 0.16 * M(), 0.22 * k);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 日出的光芒（3:23）：自日处扇开，朝右上方指向城；短、淡、边缘柔
  function drawRays(ctx) {
    const k = W.lv.lmRays;
    if (k < 0.01 || !W.sun || W.sun.elev < -0.12) return;
    SP || sprites();
    const warm = clamp(W.dusk * 1.4, 0, 1);
    const str = k * (0.45 + 0.55 * warm) * clamp((W.sun.elev + 0.12) / 0.12, 0, 1) * (1 - 0.7 * W.lv.storm);
    if (str < 0.01) return;
    const sx = W.sun.x, sy = W.sun.y, D = Math.hypot(W.w, W.h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      const a = lerp(-0.86, 0.04, i / 8) + (hsh(i * 3.3) - 0.5) * 0.08 + Math.sin(W.t * 0.05 + i) * 0.012;
      const wd = (0.07 + 0.08 * hsh(i * 7.1)) * M();
      const al = str * (0.07 + 0.05 * hsh(i * 1.9)) * (0.75 + 0.25 * Math.sin(W.t * 0.35 + i * 1.7));
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(a);
      ctx.globalAlpha = Math.min(1, al);
      ctx.drawImage(SP.ray, 0, -wd / 2, D * (0.45 + 0.15 * hsh(i * 2.7)), wd);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.gold, sx, sy, 0.15 * M(), str * 0.3);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 你的宝座存到万代（5:19）：高天之上一片安静的荣光——没有形像，只有光（不在按钮之下）
  function throneX() { return port() ? 0.74 : 0.76; }
  function throneC() { return [throneX() * W.w, (port() ? 0.3 : 0.28) * W.h]; }
  function drawThrone(ctx) {
    const k = W.lv.lmThrone;
    if (k < 0.01) return;
    SP || sprites();
    const [cx, cy] = throneC(), m = M();
    const br = 0.92 + 0.08 * Math.sin(W.t * 0.5);
    ctx.globalCompositeOperation = 'lighter';
    // 其下一片极淡的、蓝宝石一般的光（出 24:10 之意）
    ctx.save();
    ctx.translate(cx, cy + 0.05 * m);
    ctx.scale(1, 0.3);
    glowSp(ctx, SP.sapph, 0, 0, 0.3 * m, 0.13 * k);
    ctx.restore();
    // 一片宽而柔的光，中间一点安静的白（另有一道光柱落在圣所的废墟上，见 drawBeams）
    glowSp(ctx, SP.gold, cx, cy, 0.4 * m, 0.42 * k * br);
    glowSp(ctx, SP.gold, cx, cy, 0.2 * m, 0.3 * k * br);
    glowSp(ctx, SP.white, cx, cy, 0.1 * m, 0.22 * k * br);
    // 聚在四围的几点柔光（没有十字）
    for (let i = 0; i < 9; i++) {
      const a = hsh(i * 9.7) * TAU, r = (0.14 + 0.16 * hsh(i * 3.3)) * m;
      const tw = 0.5 + 0.5 * Math.sin(W.t * (0.7 + hsh(i)) + i * 1.9);
      glowSp(ctx, SP.white, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7, 0.007 * m * (1 + tw), 0.4 * k * tw);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 自天垂下的光柱（从天观看 3:50；你临近我 3:57；宝座的光落在圣所的废墟上 5:19）
  function beam(ctx, x, y0, y1, w, a, sp) {
    if (a < 0.005 || y1 <= y0) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp || SP.beam, x - w / 2, y0, w, y1 - y0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawBeams(ctx, ph, G) {
    const gz = W.lv.lmGaze;
    if (gz > 0.01) {
      const x = 0.78 * W.w;
      beam(ctx, x, -0.05 * W.h, hillTop(0.78, ph) + 0.4 * ph, 0.24 * W.w, 0.2 * gz);
      beam(ctx, x, -0.05 * W.h, hillTop(0.78, ph), 0.08 * W.w, 0.22 * gz);
    }
    const nr = W.lv.lmNear;
    if (nr > 0.01) {
      // 不要惧怕！——一道暖而宽的光临到深牢，脚下的地也亮了
      const p = figPt('jer', 0) || [X.cell * W.w, gY(2, X.cell)];
      const pp = PH(2);
      beam(ctx, p[0], -0.05 * W.h, p[1] + 0.25 * pp, 0.17 * W.w, 0.34 * nr, SP.beamW);
      beam(ctx, p[0], -0.05 * W.h, p[1] + 0.1 * pp, 0.05 * W.w, 0.45 * nr, SP.beamW);
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, p[0], p[1] - 0.5 * pp, 1.7 * pp, 0.5 * nr);
      ctx.save();
      ctx.translate(p[0], p[1] + 0.05 * pp);
      ctx.scale(1, 0.24);
      glowSp(ctx, SP.gold, 0, 0, 3.4 * pp, 0.6 * nr);
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }
    const th = W.lv.lmThrone;
    if (th > 0.01) {
      const [cx, cy] = throneC();
      beam(ctx, lerp(cx, G.px, 0.6), cy + 0.05 * M(), G.top + 0.4 * ph, 0.16 * W.w, 0.15 * th);
    }
  }
  // 准绳（2:8）：一根淡金的绳，在城墙的高处自城门的左楼拉过去，微微下垂；线铊经过哪一段，哪一段墙就倒下
  function drawLine(ctx, ph) {
    const a = W.lv.lmLineA, f = clamp(W.lv.lmLine, 0, 1);
    if (a < 0.01 || f < 0.002) return;
    const C = cordGeo(ph), n = Math.max(2, Math.ceil(28 * f)), u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const q = cordPt(C, (f * i) / n); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
    ctx.strokeStyle = rgba([255, 222, 160], 0.1 * a); ctx.lineWidth = 4 * u; ctx.stroke();
    ctx.strokeStyle = rgba([255, 232, 186], 0.5 * a); ctx.lineWidth = Math.max(1, 1.05 * u); ctx.stroke();
    // 线铊
    const e = cordPt(C, f), sw = Math.sin(W.t * 2.2) * 0.05 * ph, py = e[1] + 0.5 * ph;
    ctx.beginPath(); ctx.moveTo(e[0], e[1]); ctx.lineTo(e[0] + sw, py); ctx.stroke();
    ctx.fillStyle = rgba([255, 232, 186], 0.6 * a);
    ctx.beginPath(); ctx.moveTo(e[0] + sw - 0.07 * ph, py); ctx.lineTo(e[0] + sw + 0.07 * ph, py); ctx.lineTo(e[0] + sw, py + 0.2 * ph); ctx.closePath(); ctx.fill();
    ctx.lineCap = 'butt';
    ctx.globalCompositeOperation = 'source-over';
  }
  // 在遍地的黑暗里，人仍有一点微光（故事里的人要看得见）
  function drawSouls(ctx, ph) {
    const gl = W.lv.gloom;
    if (gl < 0.03) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (const id of ['jer', 'zion']) {
      const p = figPt(id, 0.5);
      if (p) glowSp(ctx, SP.pale, p[0], p[1], 1.4 * ph, 0.55 * gl);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  let prevWall = 1, prevSink = 0, prevCell = 0, sinkT = 0, cellT = 0;
  function syncPrev() { prevWall = W.lv.lmWall; prevSink = W.lv.lmSink; prevCell = W.lv.lmCell; }
  function update(dt) {
    if (!cur()) { EM.length = 0; return; }
    const f = dt * (W.fast || 1);
    for (let i = EM.length - 1; i >= 0; i--) {
      const e = EM[i];
      e.t += f; e.x += (e.vx + W.wind * 10) * f; e.y += e.vy * f; e.vy *= 1 - 0.3 * f;
      if (e.t > e.max) EM.splice(i, 1);
    }
    if (W.replaying) { syncPrev(); return; }
    const ph = CPH(), pp = PH(2);
    if (W.lv.lmEmber > 0.05 && GS.debug && !GS.debug.noDraw) {
      emAcc += f * 2.4 * W.lv.lmEmber * (0.3 + nightK());
      const G = temGeo(ph);
      while (emAcc > 1) { emAcc -= 1; if (EM.length < 50) spawnEmber(ph, G); }
    }
    // 城墙一段一段倒下：扬起尘土
    const wl = W.lv.lmWall;
    if (wl < prevWall - 1e-6) {
      const WG = wallGeo(ph), C = cordGeo(ph);
      SEGS.forEach((s, i) => {
        const thr = segThr(i, ph, WG, C);
        if (prevWall >= thr && wl < thr) {
          const xf = WG.xa + (i + 0.5) * WG.sw;
          if (fx()) safe('lm.dust', () => fx().dust(xf * W.w, gY(2, xf), s.h > 0.6 ? 26 : 10, [196, 178, 150], WG.sw * W.w * 0.5));
          if (s.h > 0.6) { W.shake = Math.max(W.shake, 0.35); if (Math.random() < 0.5) sfx(null, 'thunder', { far: true, soft: true }); }
        }
      });
      LSEGS.forEach(s => {
        if (prevWall >= s.fall && wl < s.fall && fx()) safe('lm.dust', () => fx().dust((s.x0 + s.x1) / 2 * W.w, gY(2, (s.x0 + s.x1) / 2), 18, [196, 178, 150], (s.x1 - s.x0) * W.w * 0.5));
      });
    }
    prevWall = wl;
    // 城门陷入地内
    if (W.lv.lmSink > prevSink + 1e-6 && W.lv.lmSink < 0.999) {
      sinkT -= f;
      if (sinkT <= 0) {
        sinkT = 0.3;
        const G = gateGeo(ph);
        if (fx()) safe('lm.dust', () => fx().dust(G.gx, G.g, 12, [180, 160, 132], 0.9 * ph));
      }
    }
    prevSink = W.lv.lmSink;
    // 深牢的石头化为光尘
    if (W.lv.lmCell < prevCell - 1e-5 && W.lv.lmCell > 0.04) {
      cellT -= f;
      if (cellT <= 0) {
        cellT = 0.18;
        const c = CELL[Math.floor(Math.random() * CELL.length)];
        const x = X.cell * W.w + c.dx * pp, y = gY(2, X.cell) - c.h * pp * W.lv.lmCell * 0.6;
        if (fx()) safe('lm.motes', () => fx().sparkle(x, y, 8, [255, 238, 200], 0.3 * pp, 'air'));
      }
    }
    prevCell = W.lv.lmCell;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  function drawNear(ctx) {
    const ph = CPH();
    drawHill(ctx, ph);
    drawHouses(ctx, ph);
    const G = drawTemple(ctx, ph);
    drawSanctuary(ctx, ph, G);
    drawHouses(ctx, ph, true);
    drawStreams(ctx, ph, G);      // 泪自墙脚下渗出（在房屋之后画：不横过墙面）
    drawJackals(ctx, ph, G);
    drawGold(ctx, ph, G);
    drawWall(ctx, ph);
    drawGate(ctx, ph);
    drawRiver(ctx, ph);           // 城前的河在城墙、城门之前
    drawRoad(ctx);
    drawDew(ctx, ph);
    drawCell(ctx, PH(2), true);
    drawSmoke(ctx, ph, G);
    drawPlume(ctx, ph, G);
    drawFire(ctx, ph, G);
  }
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!cur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update,
    drawUnder(ctx, pass) {
      if (!cur()) return;
      if (pass === 'sky') { drawDawnLine(ctx); drawRays(ctx); drawThrone(ctx); return; }
      if (pass === 'seaNear') { drawTearSea(ctx); return; }
      if (pass === 'near') drawNear(ctx);
    },
    draw(ctx, pass) {
      if (!cur() || pass !== 'air') return;
      const ph = CPH(), G = temGeo(ph);
      drawCell(ctx, PH(2), false);
      drawSouls(ctx, PH(2));
      drawBeams(ctx, ph, G);
      drawLine(ctx, ph);
      drawEmbers(ctx);
    },
    reset() { EM.length = 0; },
    restore() { EM.length = 0; emAcc = 0; syncPrev(); },
    pick(x, y, r) {
      if (!cur()) return null;
      let best = null;
      const cand = (label, px, py, d) => { d = d == null ? Math.hypot(px - x, py - y) : d; if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      const ph = CPH(), pp = PH(2), G = temGeo(ph), GG = gateGeo(ph);
      cand('锡安的城门', GG.gx, GG.g - 1.2 * ph * (1 - 0.7 * W.lv.lmSink));
      // 城墙：沿墙取最近的一点
      if (x > GG.r1 && x < W.w) { const gy = gY(2, x / W.w); if (Math.abs(y - (gy - 0.4 * ph)) < 0.8 * ph) cand('锡安的城墙', x, gy - 0.9 * ph, r * 0.6); }
      cand('圣所', G.px, G.top - 1.6 * ph);
      if (x > G.x0 && x < W.w && y > G.top - 2.6 * ph && y < temBase(x / W.w, ph)) cand('圣所', x, G.top - 0.3 * ph, r * 0.7);
      if (x > X.hill0 * W.w && x < G.x0) { const ht = hillTop(x / W.w, ph); if (y > ht - 1.2 * ph && y < gY(2, x / W.w) - 0.5 * ph) cand('锡安山', x, ht - 1.2 * ph, r * 0.75); }
      for (const s of GOLDS) { const p = goldPt(s, ph, G); cand('圣所的石头', p[0], p[1] - 0.2 * ph); }
      if (W.lv.lmTears > 0.3 && W.lv.lmFlow > 0.5) {
        const P = riverPts(ph);
        for (let i = 0; i < P.length; i += 6) cand('泪河', P[i], P[i + 1]);
      }
      if (W.lv.lmCell > 0.3) cand('深牢', X.cell * W.w, gY(2, X.cell) - 1.1 * pp);
      if (W.lv.lmJackal > 0.3) JACKALS.forEach(j => { const p = jackalPos(j, ph, G); cand('野狗', p.x, p.y - 0.3 * ph); });
      if (W.lv.lmThrone > 0.3) { const [cx, cy] = throneC(); cand('你的宝座', cx, cy); }
      if (W.lv.lmRays > 0.3 && W.sun && W.sun.elev > -0.05) cand('早晨', W.sun.x, W.sun.y);
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() { return { cell: Math.round(W.lt.lmCell * 100) / 100, turned: S.turned }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：夜，倾覆了的耶路撒冷
  // ════════════════════════════════════════════════════════════
  let S = { turned: false };
  function setup() {
    const lv = Object.assign({
      deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.4, herbs: 0.12, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 0.5, good: 0, given: 1, sabbath: 0, bare: 0.62, bloom: 0,
    }, LV0);
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.88, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);      // 哀歌里不要鲸鱼跃出水面
    W.setPop('bird', 5, W.w * 0.5, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 5, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    EM.length = 0; emAcc = 0;
    S = { turned: false };
    const c = C();
    c.clear({ fade: false });
    add('zion', { label: '锡安', sex: 'f', age: 'adult', x: X.zion, v: 0.06, facing: -1, robe: ROBE.zion, accent: ROBE.zionAcc, hair: 'veil', glow: 0.3, pose: 'sit', from: 'none' });
    pose('zion', 'sit', { weep: true });
    add('jer', { label: '耶利米', sex: 'm', age: 'adult', x: X.jer, v: 0.03, facing: 1, robe: ROBE.jer, beard: true, glow: 0.32, pose: 'sit', from: 'none', prop: null });
    crowd('lm:cap', { n: 8, x0: 0.665, x1: 0.86, layer: 2, v: 0.14, label: '被掳的人', robe: ROBE.cap, glow: 0.16, from: 'none', mill: false });
    crowdFace('lm:cap', -1);
    avoid([0.44, 1]);
    syncPrev();
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行，故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const BK = '耶利米哀歌 ';
  const INTRO = [
    { text: '先前满有人民的城，现在何竟独坐！<br>先前在列国中为大的，现在竟如寡妇；<br>先前在诸省中为王后的，现在成为进贡的。', ref: BK + '1:1', hold: 8 },
    { text: '锡安的路径因无人来守圣节就悲伤；<br>她的城门凄凉；她的祭司叹息；<br>她的处女受艰难，自己也愁苦。', ref: BK + '1:4', hold: 7 },
  ];
  const V1 = [
    { text: '犹大因遭遇苦难，又因多服劳苦就迁到外邦。<br>她住在列国中，寻不着安息；<br>追逼她的都在狭窄之地将她追上。', ref: BK + '1:3', hold: 7 },
    { text: '她的敌人为首；她的仇敌亨通；<br>因耶和华为她许多的罪过使她受苦；<br>她的孩童被敌人掳去。', ref: BK + '1:5', hold: 7 },
  ];
  const V2 = [
    { text: '她夜间痛哭，泪流满腮；<br>在一切所亲爱的中间没有一个安慰她的。<br>她的朋友都以诡诈待她，成为她的仇敌。', ref: BK + '1:2', hold: 7 },
    { text: '你们一切过路的人哪，这事你们不介意吗？<br>你们要观看：有像这临到我的痛苦没有……', ref: BK + '1:12', hold: 7 },
    { text: '锡安举手，无人安慰……<br>耶和华是公义的！<br>他这样待我，是因我违背他的命令。', ref: BK + '1:17–18', hold: 7.5 },
  ];
  const V3 = [
    { text: '主何竟发怒，使黑云遮蔽锡安城！<br>他将以色列的华美从天扔在地上；<br>在他发怒的日子并不记念自己的脚凳。', ref: BK + '2:1', hold: 7 },
    { text: '耶和华定意拆毁锡安的城墙；<br>他拉了准绳，不将手收回，定要毁灭。<br>他使外郭和城墙都悲哀，一同衰败。', ref: BK + '2:8', hold: 7.5 },
    { text: '锡安的门都陷入地内；<br>主将她的门闩毁坏，折断。<br>她的君王和首领落在没有律法的列国中；<br>她的先知不得见耶和华的异象。', ref: BK + '2:9', hold: 7 },
  ];
  const V4 = [
    { text: '锡安城的长老坐在地上默默无声；<br>他们扬起尘土落在头上，腰束麻布；<br>耶路撒冷的处女垂头至地。', ref: BK + '2:10', hold: 7.5 },
    { text: '我眼中流泪，以致失明；<br>我的心肠扰乱，肝胆涂地，<br>都因我众民遭毁灭，<br>又因孩童和吃奶的在城内街上发昏。', ref: BK + '2:11', hold: 7 },
    { text: '耶和华成就了他所定的，<br>应验了他古时所命定的。<br>他倾覆了，并不顾惜……', ref: BK + '2:17', hold: 6 },
  ];
  const V5 = [
    { text: '我是因耶和华忿怒的杖，遭遇困苦的人。<br>他引导我，使我行在黑暗中，不行在光明里。', ref: BK + '3:1–2', hold: 7 },
    { text: '他用篱笆围住我，使我不能出去；<br>他使我的铜链沉重……<br>他用凿过的石头挡住我的道；<br>他使我的路弯曲。', ref: BK + '3:7–9', hold: 7.5 },
    { text: '我就说：我的力量衰败；<br>我在耶和华那里毫无指望！', ref: BK + '3:18', hold: 5.5 },
  ];
  const V6 = [
    { text: '锡安民的心哀求主。<br>锡安的城墙啊，愿你流泪如河，昼夜不息；<br>愿你眼中的瞳人泪流不止。', ref: BK + '2:18', hold: 8 },
    { text: '夜间，每逢交更的时候要起来呼喊，<br>在主面前倾心如水……', ref: BK + '2:19', hold: 6 },
    { text: '因我众民遭的毁灭，我就眼泪下流如河。<br>我的眼多多流泪，总不止息，<br>直等耶和华垂顾，从天观看。', ref: BK + '3:48–50', hold: 7.5 },
  ];
  const V7 = [
    { text: '我想起这事，心里就有指望。', ref: BK + '3:21', hold: 5.5 },
    { text: '我们不致消灭，是出于耶和华诸般的慈爱；<br>是因他的怜悯不致断绝。', ref: BK + '3:22', hold: 7 },
  ];
  const V8 = [
    { text: '每早晨，这都是新的；<br>你的诚实极其广大！', ref: BK + '3:23', hold: 8.5 },
    { text: '我心里说：耶和华是我的分，<br>因此，我要仰望他。', ref: BK + '3:24', hold: 6.5 },
  ];
  const V9 = [
    { text: '凡等候耶和华，心里寻求他的，<br>耶和华必施恩给他。<br>人仰望耶和华，静默等候他的救恩，<br>这原是好的。', ref: BK + '3:25–26', hold: 7.5 },
    { text: '他当独坐无言，<br>因为这是耶和华加在他身上的。', ref: BK + '3:28', hold: 5.5 },
    { text: '因为主必不永远丢弃人。<br>主虽使人忧愁，还要照他诸般的慈爱发怜悯。', ref: BK + '3:31–32', hold: 7 },
  ];
  const V10 = [
    { text: '我们当诚心向天上的神举手祷告。', ref: BK + '3:41', hold: 5.5 },
    { text: '耶和华啊，我从深牢中求告你的名……<br>我求告你的日子，你临近我，说：不要惧怕！', ref: BK + '3:55–57', hold: 8 },
    { text: '主啊，你伸明了我的冤；你救赎了我的命。', ref: BK + '3:58', hold: 6 },
  ];
  const V11 = [
    { text: '黄金何其失光！纯金何其变色！<br>圣所的石头倒在各市口上。', ref: BK + '4:1', hold: 6.5 },
    { text: '耶和华发怒成就他所定的，倒出他的烈怒；<br>在锡安使火着起，烧毁锡安的根基。', ref: BK + '4:11', hold: 7 },
    { text: '锡安的民哪，你罪孽的刑罚受足了，<br>耶和华必不使你再被掳去。', ref: BK + '4:22', hold: 7 },
  ];
  const V12 = [
    { text: '耶和华啊，求你记念我们所遭遇的事，<br>观看我们所受的凌辱。', ref: BK + '5:1', hold: 5.8 },
    { text: '锡安山荒凉，野狗行在其上。', ref: BK + '5:18', hold: 5.5 },
    { text: '耶和华啊，你存到永远；<br>你的宝座存到万代。', ref: BK + '5:19', hold: 6.5 },
  ];
  const LAST = { text: '耶和华啊，求你使我们向你回转，<br>我们便得回转。<br>求你复新我们的日子，像古时一样。', ref: BK + '5:21', hold: 7.5 };

  // ════════════════════════════════════════════════════════════
  //  话语：神唯一亲口的一句（3:57），与经上论神的作为、性情的短句
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 被掳的人往东去；城独坐（1:3–5）────────────────────
    {
      kind: 'judge', utter: '耶和华为她许多的罪过使她受苦', cmd: 'exile 犹大 --to 外邦 --no-rest  # 城独坐', ref: '1:5', tint: TINT_LAMENT,
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.935, 16, b.instant);
            crowdFace('lm:cap', -1);
            crowdWalk('lm:cap', 0.33, 0.44, { speed: 0.034 });
            add('jer', { x: X.jer });
            pose('jer', 'stand');
            face('jer', -1);
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [2.5, b => { pose('zion', 'sit', { weep: true }); face('zion', -1); sfx(b, 'weep', { soft: true, far: true }); }],
          [L[1] + 1.5, b => { W.set('lmEmber', 0.8, b.instant); uncrowd('lm:cap'); }],
          [L[1] + 4, b => { pose('jer', 'sit', { weep: true }); }],
        ]);
      },
    },
    // ── 2 · 过路的人；锡安举手，无人安慰（1:2，1:12–18）────────
    {
      kind: 'act', utter: '耶和华是公义的！', cmd: 'grep 安慰 锡安  # (no match) · assert 耶和华.公义', ref: '1:18', tint: TINT_LAMENT,
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.975, 20, b.instant);
            add('lm:p0', { label: '过路的人', sex: 'm', x: 1.05, v: 0.34, facing: -1, robe: ROBE.pass, prop: 'bundle', glow: 0.18, from: 'none' });
            add('lm:p1', { label: '过路的人', sex: 'm', age: 'elder', x: 1.1, v: 0.3, facing: -1, robe: [110, 96, 86], glow: 0.18, from: 'none' });
            walk('lm:p0', 0.745, { speed: 0.04 });
            walk('lm:p1', 0.785, { speed: 0.04 });
          }],
          [L[1] + 0.6, b => { face('lm:p0', 1); pose('lm:p0', 'point'); face('lm:p1', 1); pose('lm:p1', 'stand'); }],
          [L[1] + 3.6, b => {
            walk('lm:p0', 0.36, { speed: 0.042 });
            walk('lm:p1', 0.39, { speed: 0.04 });
          }],
          [L[2] + 0.3, b => {
            face('zion', 1);
            pose('zion', 'raise');
            glow('zion', 0.45);
            ringFig(b, 'zion', [220, 228, 255], 1.8);
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] + 5, b => { pose('zion', 'sit', { weep: true }); face('zion', -1); glow('zion', 0.3); }],
          [L[2] + 5.5, b => { rm('lm:p0'); rm('lm:p1'); }],
        ]);
      },
    },
    // ── 3 · 黑云；准绳；城墙倒塌；城门陷入地内（2:1–9）──────────
    {
      kind: 'judge', utter: '耶和华定意拆毁锡安的城墙', cmd: 'rm -r 锡安/城墙 --line 准绳  # 不将手收回', ref: '2:8', tint: [206, 200, 220],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.02, 22, b.instant);
            W.set('storm', 0.85, b.instant); W.set('gale', 0.35, b.instant); W.set('rain', 0.18, b.instant);
            W.set('lmEmber', 0.65, b.instant);
            sfx(b, 'wind');
          }],
          [2.2, b => { if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.8, near: true }); }],
          // 准绳拉过城墙；线铊经过哪一段，哪一段就倒下（lmLine 与 lmWall 同速）
          [L[1] + 0.8, b => { W.set('lmLine', 1, b.instant); W.set('lmLineA', 1, b.instant); W.set('lmWall', 0, b.instant); sfx(b, 'seal', { soft: true }); }],
          [L[1] + 3.6, b => {
            pose('zion', 'kneel', { weep: true });
            pose('jer', 'kneel');
            if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.7, near: true });
          }],
          [L[2] + 0.5, b => { W.set('lmSink', 1, b.instant); sfx(b, 'gate', { low: true }); }],
          [L[2] + 5.5, b => { W.set('lmLineA', 0, b.instant); }],
        ]);
      },
    },
    // ── 4 · 长老坐在地上；处女垂头至地（2:10–17）─────────────
    {
      kind: 'act', utter: '耶和华成就了他所定的', cmd: 'sit 长老 --on 地 --silent && dust --on 头  # 腰束麻布', ref: '2:17', tint: TINT_LAMENT,
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const beats = [
          [0, b => {
            W.goTo(0.065, 20, b.instant);
            W.set('storm', 0.12, b.instant); W.set('gale', 0, b.instant); W.set('rain', 0, b.instant);
            W.set('lmLineA', 0, b.instant); W.set('lmWall', 0, b.instant); W.set('lmSink', 1, b.instant);
            pose('zion', 'sit', { weep: true });
            pose('jer', 'sit');
          }],
          [L[0] + 4.2, b => {
            if (b.instant) return;
            eIds().forEach(id => { const p = figPt(id, 0.9); if (p) fx().dust(p[0], p[1], 14, [196, 176, 150], 0.25 * PH(2)); });
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [1.2, b => {
            vIds().forEach((id, i) => {
              add(id, { label: '耶路撒冷的处女', sex: 'f', age: 'adult', x: VIRGINS[i], v: VIRGIN_V[i], facing: -1, robe: ROBE.virgin, accent: ROBE.virginAcc, hair: 'veil', glow: 0.2, from: b.instant ? 'none' : 'fade' });
              pose(id, 'kneel', { weep: true });
            });
          }],
          [L[1] + 0.5, b => { pose('jer', 'weep'); face('jer', 1); sfx(b, 'weep', { soft: true }); }],
          [L[2] + 1, b => { W.set('storm', 0, b.instant); pose('jer', 'sit', { weep: true }); }],
        ];
        // 长老一个一个从城门出来，坐在地上
        ELDERS.forEach((x, i) => {
          beats.push([0.6 + i * 0.9, b => {
            const id = 'lm:e' + i;
            add(id, { label: '锡安的长老', sex: 'm', age: 'elder', x: X.gate + 0.004, v: ELDER_V[i], facing: 1, robe: ROBE.sack, glow: 0.18, from: b.instant ? 'none' : 'fade', prop: null });
            walk(id, x, { speed: 0.022, pose: 'sit' });
            face(id, -1);
          }]);
        });
        T(c, beats);
      },
    },
    // ── 5 · 他使我行在黑暗中；凿过的石头挡住我的道（3:1–18）────
    {
      kind: 'judge', utter: '他引导我，使我行在黑暗中，不行在光明里', cmd: 'cd /幽暗 && chmod 000 ./道  # 凿过的石头', ref: '3:2', tint: [184, 188, 214],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.135, 20, b.instant);
            W.set('gloom', 0.75, b.instant);
            W.set('moon', 0.15, b.instant);      // 月也隐去：他使我行在黑暗中
            W.set('lmEmber', 0.45, b.instant);
            pose('jer', 'stand');
            walk('jer', X.cell, { speed: 0.008, pose: 'stand' });
            face('jer', -1);
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [L[1] + 0.8, b => { W.set('lmCell', 1, b.instant); sfx(b, 'stone', { soft: true, low: true }); }],
          [L[1] + 4, b => { pose('jer', 'kneel'); }],
          [L[2] + 0.5, b => { pose('jer', 'sit', { weep: true }); glow('jer', 0.18); }],
        ]);
      },
    },
    // ── 6 · 泪河：昼夜不息，流进海里——直等耶和华从天观看（2:18–19；3:48–50）──
    {
      kind: 'act', utter: '直等耶和华垂顾，从天观看', cmd: 'tail -f 泪 | tee 河 > 海  # 昼夜不息', ref: '3:50', tint: [196, 214, 255],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.185, 22, b.instant);
            W.set('gloom', 0.22, b.instant);
            W.set('moon', 1, b.instant);
            W.set('lmTears', 1, b.instant);
            W.set('lmFlow', 1, b.instant);
            pose('zion', 'sit', { weep: true });
            eIds().forEach(id => pose(id, 'sit', { weep: true }));
            sfx(b, 'weep', { soft: true });
          }],
          [L[1] + 2, b => { sfx(b, 'splash', { soft: true, far: true, x: 0.2 }); }],
          [L[2] + 3.2, b => {
            W.set('lmGaze', 1, b.instant);
            W.set('gloom', 0.12, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
    // ── 7 · 我想起这事，心里就有指望：东方的第一线光（3:21–22）──
    {
      kind: 'act', utter: '我们不致消灭，是出于耶和华诸般的慈爱', cmd: 'grep -c 指望 心  # → 1', ref: '3:22', tint: TINT_DAWN,
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.245, 14, b.instant);
            W.set('gloom', 0, b.instant);
            W.set('moon', 0.6, b.instant);
            W.set('lmDawn', 1, b.instant);
            W.set('lmGaze', 0.4, b.instant);
            W.set('lmTears', 0.75, b.instant);
            W.set('lmEmber', 0.35, b.instant);
            glow('jer', 0.3);
            sfx(b, 'harp', { soft: true });
          }],
          [1.6, b => { pose('jer', 'kneel'); face('jer', -1); }],
          [L[1] + 0.5, b => { pose('jer', 'gaze'); glow('jer', 0.5); ringFig(b, 'jer', [255, 226, 180], 1.6); }],
          [L[1] + 2.5, b => { face('zion', -1); pose('zion', 'kneel'); }],
        ]);
      },
    },
    // ── 8 · 每早晨，这都是新的（3:23–24）——本卷的签名 ──────────
    {
      kind: 'act', utter: '每早晨，这都是新的', cmd: 'cron "@daily" 慈爱.renew()  # 你的诚实极其广大', ref: '3:23', tint: TINT_DAWN,
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.265, 3.5, b.instant);
            W.set('lmDawn', 0, b.instant);
            W.set('lmRays', 1, b.instant);
            W.set('lmGold', 1, b.instant);
            W.set('lmShine', 1, b.instant);
            W.set('lmGaze', 0, b.instant);
            W.set('moon', 0.3, b.instant);
            sfx(b, 'harp');
          }],
          [2.5, b => { W.set('lmTears', 0, b.instant); W.set('lmEmber', 0.25, b.instant); }],
          [2, b => {
            W.set('lmDew', 1, b.instant);
            W.set('bare', 0.45, b.instant);
            W.setPop('bird', 24, W.w * 0.3, W.h * 0.35, b.instant);
            sfx(b, 'bird', { soft: true });
          }],
          [3.5, b => { W.goTo(0.295, 12, b.instant); pose('zion', 'gaze'); face('zion', -1); glow('zion', 0.45); }],
          [4.5, b => { face('jer', -1); pose('jer', 'gaze'); }],
          [6, b => {
            vIds().forEach(id => { pose(id, 'gaze'); face(id, -1); });
            eIds().forEach(id => { pose(id, 'sit', { weep: false }); face(id, -1); });
            sfx(b, 'chime', { soft: true });
          }],
          [L[1] + 1, b => { sfx(b, 'bird', { soft: true }); }],
        ]);
      },
    },
    // ── 9 · 静默等候；主必不永远丢弃人（3:25–32）──────────────
    {
      kind: 'promise', utter: '因为主必不永远丢弃人', cmd: 'await 救恩 --quiet  # 这原是好的', ref: '3:31', tint: TINT_PROM,
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.36, 18, b.instant);
            W.set('lmRays', 0.35, b.instant);
            W.set('lmDew', 0.55, b.instant);
          }],
          [1, b => {
            // 余民从城门的废墟里出来，在长老之前坐成一排（各有自己的位置，不挤在锡安与耶利米身上）
            REM.forEach((r, i) => {
              const id = 'lm:r' + i, o = { label: '锡安的民', sex: r.sex, age: r.age, x: X.gate + 0.004 + 0.004 * i, v: r.v, facing: 1, robe: r.robe, glow: 0.14, from: b.instant ? 'none' : 'fade' };
              if (r.acc) o.accent = r.acc;
              if (r.age !== 'elder') o.prop = null;
              add(id, o);
              walk(id, r.x, { speed: 0.02, pose: 'sit' });
            });
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [L[1] + 0.5, b => { pose('jer', 'sit'); face('jer', -1); }],
          [L[2] + 0.5, b => { pose('zion', 'sit'); rIds().forEach(id => face(id, -1)); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },
    // ── 10 · 不要惧怕！（3:41，3:55–58）——神唯一亲口的一句 ─────
    {
      kind: 'promise', utter: '不要惧怕！', cmd: 'ping 深牢 && echo "不要惧怕"  # 你救赎了我的命', ref: '3:57', tint: TINT_PROM,
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.43, 16, b.instant);
            W.set('lmRays', 0, b.instant);
            rIds().forEach(id => pose(id, 'raise'));
            eIds().forEach(id => pose(id, 'pray'));
            vIds().forEach(id => pose(id, 'raise'));
            pose('zion', 'raise');
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [L[1] + 0.3, b => { pose('jer', 'pray'); }],
          [L[1] + 4.6, b => {
            W.set('lmNear', 1, b.instant);
            glow('jer', 0.9);
            ringFig(b, 'jer', [255, 236, 190], 3);
            sfx(b, 'angel', { soft: true });
          }],
          [L[2] + 0.2, b => {
            W.set('lmCell', 0, b.instant);
            pose('jer', 'raise');
            sfx(b, 'harp');
          }],
          [L[2] + 2.5, b => {
            walk('jer', X.out, { speed: 0.012, pose: 'stand' });
            rIds().forEach(id => pose(id, 'stand'));
            eIds().forEach(id => pose(id, 'sit'));
            vIds().forEach(id => pose(id, 'stand'));
            pose('zion', 'stand');
          }],
          [L[2] + 5, b => { W.set('lmNear', 0.25, b.instant); glow('jer', 0.5); }],
        ]);
      },
    },
    // ── 11 · 黄金失光；锡安的火熄灭；刑罚受足了（4:1，4:11，4:22）──
    {
      kind: 'promise', utter: '耶和华必不使你再被掳去', cmd: 'close 刑罚 --complete && rm 被掳  # 锡安的民哪', ref: '4:22', tint: TINT_PROM,
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.7, 16, b.instant);
            W.set('lmNear', 0, b.instant);
            W.set('lmDew', 0, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          // 黄金何其失光：自左而右，一块一块变灰
          [1.2, b => { W.set('lmDim', 1, b.instant); sfx(b, 'stone', { soft: true, low: true }); }],
          // 在锡安使火着起：台上一阵火舌，随即落成一柱烟
          [L[1] + 0.5, b => {
            W.set('lmEmber', 0.9, b.instant); W.set('lmFire', 1, b.instant);
            if (!b.instant) W.shake = Math.max(W.shake, 0.25);
            sfx(b, 'fire');
          }],
          [L[1] + 3, b => { W.set('lmFire', 0, b.instant); W.set('lmPlume', 1, b.instant); }],
          [L[1] + 4, b => { W.set('lmEmber', 0, b.instant); }],
          // 必不使你再被掳去：一片暖光落在被掳之路上，留在那里；锡安与余民转身望着它
          [L[2] + 0.5, b => {
            W.set('lmRoad', 1, b.instant);
            face('zion', -1);
            pose('zion', 'gaze');
            glow('zion', 0.7);
            ringFig(b, 'zion', [255, 230, 184], 2.4);
            rIds().forEach(id => { pose(id, 'stand'); face(id, -1); });
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
    // ── 12 · 野狗行在锡安山上；你的宝座存到万代；求你使我们向你回转（5）──
    {
      kind: 'act', utter: '耶和华啊，你存到永远', cmd: 'uptime 宝座  # 万代 · 求你复新我们的日子', ref: '5:19', tint: TINT_END,
      verse: V12,
      apply(c) {
        const L = starts(V12);
        const TX = throneX();
        T(c, [
          [0, b => {
            W.goTo(0.755, 13, b.instant);
            W.set('lmNear', 0, b.instant);
            W.set('lmDim', 1, b.instant);
            W.set('lmFire', 0, b.instant);
            W.set('lmPlume', 0, b.instant);
            W.set('moon', 1, b.instant);
            W.setPop('bird', 8, W.w * 0.6, W.h * 0.3, b.instant);
            pose('zion', 'sit', { weep: true });
            face('zion', -1);
            glow('zion', 0.35);
            rIds().forEach(id => pose(id, 'sit'));
            vIds().forEach(id => pose(id, 'sit'));
            pose('jer', 'sit');
            sfx(b, 'wind', { soft: true, far: true });
          }],
          [L[1] - 0.8, b => { W.set('lmJackal', 1, b.instant); }],
          [L[2] + 0.3, b => {
            W.set('lmThrone', 1, b.instant);
            W.goTo(0.8, 10, b.instant);
            sfx(b, 'angel');
          }],
          [L[2] + 3.4, b => { W.set('lmJackal', 0, b.instant); }],
          [L[3] + 0.2, b => {
            // 求你使我们向你回转：众人转过身来，向那光跪下
            S.turned = true;
            say(b, [LAST]);
            for (const id of ['zion', 'jer', ...eIds(), ...vIds(), ...rIds()]) { face(id, TX); pose(id, 'pray'); }
            glow('zion', 0.55); glow('jer', 0.55);
            sfx(b, 'harp');
          }],
          [L[3] + 7, b => {
            // 夜过去，又是早晨：求你复新我们的日子
            W.goTo(0.27, 22, b.instant);
            W.set('lmThrone', 0.45, b.instant);
            W.set('lmRays', 0.8, b.instant);
            W.set('lmDew', 0.6, b.instant);
          }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '耶利米哀歌', books: [25], title: '哀歌', sub: '耶利米哀歌 1 — 5', tint: [210, 210, 225], music: 'flood',
    intro: INTRO,
    outro: 22,
    behold: {
      '锡安': { text: '先前满有人民的城，现在何竟独坐！<br>先前在列国中为大的，现在竟如寡妇……', ref: BK + '1:1' },
      '耶利米': { text: '我是因耶和华忿怒的杖，遭遇困苦的人。', ref: BK + '3:1' },
      '被掳的人': { text: '犹大因遭遇苦难，又因多服劳苦就迁到外邦。<br>她住在列国中，寻不着安息……', ref: BK + '1:3' },
      '过路的人': { text: '凡过路的都向你拍掌。<br>他们向耶路撒冷城嗤笑，摇头……', ref: BK + '2:15' },
      '锡安的长老': { text: '锡安城的长老坐在地上默默无声；<br>他们扬起尘土落在头上，腰束麻布……', ref: BK + '2:10' },
      '耶路撒冷的处女': { text: '……耶路撒冷的处女垂头至地。', ref: BK + '2:10' },
      '锡安的民': { text: '耶和华啊，求你使我们向你回转，<br>我们便得回转。<br>求你复新我们的日子，像古时一样。', ref: BK + '5:21' },
      '锡安的城门': { text: '锡安的门都陷入地内；<br>主将她的门闩毁坏，折断。', ref: BK + '2:9' },
      '锡安的城墙': { text: '锡安的城墙啊，愿你流泪如河，昼夜不息；<br>愿你眼中的瞳人泪流不止。', ref: BK + '2:18' },
      '圣所': { text: '耶和华丢弃自己的祭坛，憎恶自己的圣所，<br>将宫殿的墙垣交付仇敌。', ref: BK + '2:7' },
      '圣所的石头': { text: '黄金何其失光！纯金何其变色！<br>圣所的石头倒在各市口上。', ref: BK + '4:1' },
      '锡安山': { text: '锡安山荒凉，野狗行在其上。', ref: BK + '5:18' },
      '野狗': { text: '锡安山荒凉，野狗行在其上。', ref: BK + '5:18' },
      '泪河': { text: '因我众民遭的毁灭，我就眼泪下流如河。', ref: BK + '3:48' },
      '深牢': { text: '耶和华啊，我从深牢中求告你的名。<br>你曾听见我的声音……', ref: BK + '3:55–56' },
      '你的宝座': { text: '耶和华啊，你存到永远；<br>你的宝座存到万代。', ref: BK + '5:19' },
      '早晨': { text: '我们不致消灭，是出于耶和华诸般的慈爱；<br>是因他的怜悯不致断绝。<br>每早晨，这都是新的；你的诚实极其广大！', ref: BK + '3:22–23' },
    },
    setup, stages: STAGES, scene: SCENE,
  });
})(window.GS);
