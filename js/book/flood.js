/* ─────────────────────────────────────────────────────────────
 * book/flood.js —— 卷「洪水」：创世记 6:1 — 9:29
 *
 *   6:1–12  人在地上多起来；世界败坏，地上满了强暴——红褐的霾、烟柱、角力与仆倒的人（不画血，只有姿态与光）。
 *           耶和华心中忧伤：世界的光变冷；惟有挪亚蒙恩——一道光落在他身上。
 *   6:13–22 「你要用歌斐木造一只方舟」——龙骨、肋骨、一条一条的船板、三层、透光处、旁边的门，里外抹上松香；
 *           方舟在一夜一昼之间一板一板地升起。
 *   6:19–7:9 「每样两个，一公一母」——走兽一对一对自右边走来，踏上跳板进门；飞鸟一对一对飞进透光处。
 *   7:1–16  挪亚一家背着食物走上跳板；「耶和华就把他关在方舟里头」——门合上，门缝里一圈光封住。
 *   7:4–24  「我要降雨在地上四十昼夜」——大渊的泉源裂开（海上喷起水柱），天上的窗户敞开（雨幕、闪电）；
 *           世人与走兽在暴雨的昏暗里隐去；水往上长，大地沉入水中（W.lv.land → 0），方舟漂起，在水面上漂来漂去；
 *           昼夜轮转，只有方舟窗里一点灯。
 *   8:1–5   「神纪念挪亚」——风吹过水面，雨止，云开处透下光；亚拉腊山自水中现出（大、小两峰），
 *           方舟漂到两峰之间的鞍部，水退，方舟停在山上；远处的山顶都现出来了。
 *   8:6–12  窗户开了：乌鸦飞来飞去；鸽子找不着落脚之地，回到挪亚手里；晚上叼着一片新拧下来的橄榄叶子回来；
 *           第三回，不再回来。
 *   8:13–22 「你……都可以出方舟」——地面干了，青草自山脚铺开；挪亚一家与走兽沿着山坡走下来，飞鸟自光中飞出；
 *           挪亚筑坛，燔祭的烟笔直上升，顶上一团金光；「稼穑、寒暑、冬夏、昼夜就永不停息了」——一昼一夜轮转。
 *   9:1–17  赐福；「我把虹放在云彩中」——一道大虹横过整个天空（在 'sky' 层画，柔和而发光，外面一道淡淡的副虹）。
 *   9:18–29 挪亚作起农夫来，栽了一个葡萄园；洪水以后又活了三百五十年；他躺下，化入光中，留下一堆石头。
 *
 * 规矩：本卷的一切状态只在 setup / apply / 情节（beats）里设定——瞬间重演时得到同样的世界。
 *       布景只在本卷进行时绘制（GS.book.current('flood')）。
 *       程度 'rain'（雨 0..1，声音模块也读它）与 'storm'（暴风雨的天）在本文件定义。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio, ui = () => GS.ui;
  const ACT = 'flood';
  const safe = U.safe;
  const cur = () => GS.book.current(ACT);

  // ── 本卷的程度（与世界的其余程度一样逐帧趋近目标；恢复时一并对齐）──
  W.defineLevel('rain', 'exp', 0.45);       // 雨（0..1；声音模块据此下雨）
  W.defineLevel('storm', 'exp', 0.3);       // 暴风雨的天：乌云、闪电、昏暗
  W.defineLevel('flHaze', 'exp', 0.35);     // 地上满了强暴：红褐的霾与烟
  W.defineLevel('flGrief', 'exp', 0.3);     // 耶和华心中忧伤：世界的光变冷
  W.defineLevel('flGrace', 'exp', 0.6);     // 挪亚在耶和华眼前蒙恩：落在他身上的光
  W.defineLevel('arkBuild', 'lin', 0.052);  // 方舟一板一板地造起
  W.defineLevel('arkPitch', 'exp', 0.45);   // 里外抹上松香
  W.defineLevel('arkDoor', 'exp', 1.1);     // 旁边的门（1 = 开）
  W.defineLevel('arkRamp', 'exp', 0.9);     // 跳板（1 = 放下）
  W.defineLevel('arkWin', 'exp', 1.2);      // 方舟的窗户（8:6）
  W.defineLevel('flLamp', 'exp', 0.6);      // 方舟里的灯
  W.defineLevel('flSea', 'exp', 0.35);      // 海浪汹涌
  W.defineLevel('flWind', 'exp', 0.6);      // 神叫风吹地（8:1）
  W.defineLevel('flRays', 'exp', 0.4);      // 云开处透下的光
  W.defineLevel('ararat', 'lin', 0.045);    // 亚拉腊山自水中现出（1 = 全然现出）
  W.defineLevel('flAltar', 'lin', 0.24);    // 坛：石头一块块垒起
  W.defineLevel('flFire', 'exp', 0.8);      // 坛上的火与烟
  W.defineLevel('flGold', 'exp', 0.35);     // 馨香之气：烟柱顶上的金光
  W.defineLevel('rainbow', 'exp', 0.28);    // 虹
  W.defineLevel('flVine', 'lin', 0.07);     // 葡萄园
  const MY = ['rain', 'storm', 'flHaze', 'flGrief', 'flGrace', 'arkBuild', 'arkPitch', 'arkDoor', 'arkRamp', 'arkWin', 'flLamp',
    'flSea', 'flWind', 'flRays', 'ararat', 'flAltar', 'flFire', 'flGold', 'rainbow', 'flVine'];

  // ── 本卷的局部状态（只在 setup / apply / 情节里设定）──────────
  function fresh() {
    return {
      clock: 0,              // 情节的时钟（秒；随 W.fast 加速，与情节的节拍同步）
      arkX: 0.62,            // 造方舟之处（画面比例；由神的灵所在之处决定）
      ark: null,             // 方舟的位置：{ p0, p1, t0, dur }；p = { a:'ground'|'sea'|'raw'|'mount', x, y, s }
      proc: null,            // 一对一对进方舟的走兽与飞鸟 { t0, list }
      exit: null,            // 出方舟、沿山坡走下来的走兽 { t0, list }
      drive: null,           // 大地缓缓沉下 / 升起 { goal, rate }
      jets: [],              // 大渊的泉源 [{ x, y, t0, dur, s }]
      flights: [],           // 乌鸦与鸽子 [{ kind, t0, dur, pts, leafAt, home }]
      noahWin: false,        // 挪亚在窗口
      sealT0: -1e9,          // 门被关上时的一圈光
      graceT0: -1e9,
      bolt: null, nextBolt: 0,
      seasonT0: -1e9,        // 稼穑、寒暑、冬夏、昼夜
      bowT0: -1e9,           // 虹自左而右铺开
      altarX: 0.47,
      tentT0: null,          // 帐棚立起的时刻（null = 尚无）
      cairn: null,           // 挪亚的坟 { x, t0 }
      goldT0: -1e9,
      grounded: false,
      buildAcc: 0, buildSfx: 0, griefAcc: 0,
    };
  }
  let S = fresh();

  // ── 颜色 ────────────────────────────────────────────────────
  const WOOD = [170, 128, 84], RIB = [126, 92, 60], PITCH = [52, 42, 36], CABIN = [156, 118, 78], CABIN_P = [78, 62, 50];
  const ROOF = [108, 82, 60], ROOF_P = [64, 52, 44], SCAF = [168, 136, 96], DARK = [24, 18, 14], RIMC = [255, 232, 196];
  const ROCK = [112, 101, 96], SNOW = [238, 242, 250], SEA = [24, 42, 62], FOAM = [232, 240, 248];
  const STONE = [152, 142, 128], VINE = [72, 108, 52], GRAPE = [92, 52, 96], TENT = [74, 60, 50];
  const TINT = [196, 216, 240];
  const ROBE = {
    noah: [142, 116, 86], noahW: [150, 112, 98], shem: [118, 98, 80], shemW: [158, 120, 104],
    ham: [142, 94, 64], hamW: [164, 128, 92], japheth: [96, 104, 124], japhethW: [128, 112, 136],
  };
  // 挪亚一家（8:18 的次序：挪亚、妻子、儿子、儿妇）
  const FAM = [
    { id: 'noah', label: '挪亚', sex: 'm', age: 'elder', x: 0.43, glow: 0.5 },
    { id: 'noahW', label: '挪亚的妻子', sex: 'f', age: 'elder', x: 0.405 },
    { id: 'shem', label: '闪', sex: 'm', x: 0.455 },
    { id: 'shemW', label: '闪的妻子', sex: 'f', x: 0.472 },
    { id: 'ham', label: '含', sex: 'm', x: 0.384 },
    { id: 'hamW', label: '含的妻子', sex: 'f', x: 0.368 },
    { id: 'japheth', label: '雅弗', sex: 'm', x: 0.492 },
    { id: 'japhethW', label: '雅弗的妻子', sex: 'f', x: 0.508 },
  ];
  const FAM_ID = FAM.map(f => f.id);
  const EXTRAS = ['fl:w1a', 'fl:w1b', 'fl:w2a', 'fl:w2b', 'fl:fall', 'fl:t1', 'fl:t2'];
  // 坛前的位置（相对坛的 x）
  const ALTAR_SPOT = { noah: 0.035, noahW: 0.065, shem: -0.04, shemW: -0.065, ham: 0.095, hamW: 0.118, japheth: -0.092, japhethW: -0.116 };

  // ── 小工具 ──────────────────────────────────────────────────
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const c01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const sstep = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const M = () => Math.min(W.w, W.h);
  const uu = () => Math.max(0.35, W.unit || 1);
  const narrow = () => (W.w < 600 ? 1.15 : 1);
  function gY(px, layer) {
    const l = layer == null ? 2 : layer;
    const x = clamp(px, 0, W.w);
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function sfx(name, b, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) safe('flood.sfx', () => a.sfx(name, o || {}));
  }
  function say(b, lines, delay) {
    if (inst(b)) return;
    safe('flood.say', () => ui().narrate(lines, { replace: false, delay: delay || 0 }));
  }
  function time(tod, dur, b) { W.goTo(tod, dur, inst(b)); }
  // 大地的沉与升：比默认的速率更慢更庄重（逐帧推动 land 的目标）；瞬间重演时立即到位
  function driveLand(goal, rate, b) {
    if (inst(b)) { S.drive = null; W.set('land', goal, true); }
    else S.drive = { goal, rate };
  }
  function settle(b) { if (inst(b) && S.drive) { W.set('land', S.drive.goal, true); S.drive = null; } }
  // 本卷的时间线：每一拍在瞬间重演时，先让尚未完成的沉升到位
  function TL(c, beats) { T(c, beats.map(bt => [bt[0], b => { settle(b); bt[1](b); }])); }
  const C = () => cast();
  function attach(id, fn) { const c = C(); if (c && c.attach) safe('flood.attach', () => c.attach(id, fn || null)); }
  function person(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function px(id) { const p = person(id); return p ? (p._vis && isFinite(p._x) ? p._x : p.nx * W.w) : null; }

  // ════════════════════════════════════════════════════════════
  //  亚拉腊山：大小两峰，其间一片宽阔的鞍部（方舟停在那里）
  // ════════════════════════════════════════════════════════════
  const MT = { ok: false, w: 0, h: 0, n: 0, step: 3, H: null, SL: null, wl: 0, Hm: 0, xc: 0, xg: 0, xl: 0, Wg: 0, Wl: 0, sep: 0, sM: 0.8, gul: [] };
  function smax(a, b, k) { const h = c01(0.5 + 0.5 * (a - b) / k); return b + (a - b) * h + k * h * (1 - h); }
  function arkLen() { return Math.max(40, Math.min(360 * uu() * narrow(), 0.44 * W.w)); }
  function layoutMountain() {
    const w = W.w, h = W.h;
    MT.w = w; MT.h = h;
    if (!(w > 4 && h > 4)) { MT.ok = false; return; }
    MT.wl = 0.87 * h;
    const Hm = MT.Hm = Math.min(0.5 * h, 0.85 * w);
    const sep = MT.sep = Math.min(1.5 * Hm, 0.5 * w);
    const xg = MT.xg = 0.87 * w, xl = MT.xl = xg - sep, xc = MT.xc = xl + sep * 0.5;
    const Wm = 1.1 * sep, Wg = MT.Wg = 0.55 * sep, Wl = MT.Wl = 0.45 * sep;
    const step = MT.step = Math.max(2, w / 360);
    const n = MT.n = Math.ceil(w / step) + 2;
    if (!MT.H || MT.H.length !== n) { MT.H = new Float32Array(n); MT.SL = new Float32Array(n); }
    const k = 0.07 * Hm;
    const ng = Math.pow(0.97, 1.6), nl = Math.pow(0.96, 1.45);
    for (let i = 0; i < n; i++) {
      const x = i * step;
      const dm = (x - xc) / Wm;
      const massif = Math.abs(dm) < 1 ? 0.5 * Hm * Math.pow(1 - dm * dm, 0.85) : 0;
      const dg = Math.sqrt(((x - xg) / Wg) * ((x - xg) / Wg) + 0.0009);
      const g = dg < 1 ? Hm * Math.pow(1 - dg, 1.6) / ng : 0;
      const dl = Math.sqrt(((x - xl) / Wl) * ((x - xl) / Wl) + 0.0016);
      const l = dl < 1 ? 0.64 * Hm * Math.pow(1 - dl, 1.45) / nl : 0;
      let hh = smax(smax(massif, g, k), l, k);
      // 山坡的起伏；鞍部保持平坦（方舟停在那里）
      const rough = sstep(0.12 * sep, 0.32 * sep, Math.abs(x - xc));
      hh += hh * 0.05 * U.fbm1(x / (0.06 * Hm) + 5.3, 3) * rough;
      MT.H[i] = Math.max(0, hh);
      MT.SL[i] = 0.7 * Hm + 0.05 * Hm * U.noise1(x / (0.035 * Hm) + 9.1) - 0.08 * Hm * Math.abs(U.noise1(x / (0.016 * Hm) + 3.3));
    }
    // 方舟在山上的大小：两峰之间放得下
    MT.sM = clamp((0.5 * sep) / arkLen(), 0.42, 0.82);
    // 山沟：自峰顶附近往下的几道暗线
    MT.gul = [];
    const r = U.mulberry32(77);
    for (let q = 0; q < 16; q++) {
      const onG = q < 11;
      const cx0 = onG ? xg : xl, ww = onG ? Wg : Wl, hp = onG ? Hm : 0.64 * Hm;
      const x0 = cx0 + (r() * 2 - 1) * ww * 0.42;
      const dir = x0 < cx0 ? -1 : 1;
      let x = x0, yH = mtH(x0) - (0.02 + 0.04 * r()) * hp;
      const pts = [];
      for (let s = 0; s < 9 && yH > 0.1 * Hm; s++) {
        pts.push(x, yH);
        x += dir * (0.03 + 0.05 * r()) * ww + (r() - 0.5) * 0.03 * ww;
        yH -= (0.05 + 0.05 * r()) * hp;
      }
      if (pts.length >= 6) MT.gul.push(pts);
    }
    MT.ok = true;
  }
  function ensureLayout() { if (!MT.ok || MT.w !== W.w || MT.h !== W.h) layoutMountain(); }
  function mtH(x) {
    if (!MT.H) return 0;
    const f = x / MT.step;
    const i = clamp(Math.floor(f), 0, MT.n - 2);
    const r = c01(f - i);
    return MT.H[i] + (MT.H[i + 1] - MT.H[i]) * r;
  }
  const mtSink = () => (1 - c01(W.lv.ararat)) * (MT.Hm + 0.02 * W.h);
  function surfY(x) { return MT.wl - mtH(x) + mtSink(); }

  function drawMountain(ctx) {
    const e = W.lv.ararat;
    if (e <= 0.001 || !MT.ok) return;
    const wl = MT.wl, Hm = MT.Hm, n = MT.n, st = MT.step, H = MT.H;
    const dy = mtSink();
    const dp = 0.3;
    const day = W.daylight;
    const clipB = wl + W.layerRise(2) * 0.1 * W.h;         // 近岸升起之后，山脚藏在它后面
    ctx.save();
    ctx.beginPath(); ctx.rect(-10, -10, W.w + 20, clipB + 10); ctx.clip();
    ctx.translate(0, dy);
    // 剪影
    ctx.beginPath();
    ctx.moveTo(-2, wl + 0.12 * W.h);
    for (let i = 0; i < n; i++) ctx.lineTo(i * st, wl - H[i]);
    ctx.lineTo(W.w + 2, wl + 0.12 * W.h);
    ctx.closePath();
    ctx.fillStyle = W.shadeCSS(ROCK, dp);
    ctx.fill();
    ctx.save();
    ctx.clip();
    // 雪顶（大亚拉腊）
    ctx.beginPath();
    let open = false, i0 = 0;
    const closeSnow = (i1) => {
      for (let j = i1; j >= i0; j--) ctx.lineTo(j * st, wl - MT.SL[j]);
      ctx.closePath();
    };
    for (let i = 0; i < n; i++) {
      const on = H[i] > MT.SL[i];
      if (on && !open) { open = true; i0 = i; ctx.moveTo(i * st, wl - MT.SL[i]); ctx.lineTo(i * st, wl - H[i] - 2); }
      else if (on) ctx.lineTo(i * st, wl - H[i] - 2);
      else if (open) { open = false; closeSnow(i - 1); }
    }
    if (open) closeSnow(n - 1);
    ctx.fillStyle = W.shadeCSS(SNOW, dp * 0.8, 1, 0.12);
    ctx.fill();
    // 背光的一面：以峰顶为界，一明一暗
    const sunLeft = W.sun.x < MT.xg;
    const shadeFace = (cx, top, ww) => {
      const s = sunLeft ? 1 : -1;
      ctx.moveTo(cx, wl - top - 4);
      ctx.lineTo(cx + s * 0.14 * ww, wl - top * 0.55);
      ctx.lineTo(cx + s * 0.06 * ww, wl + 4);
      ctx.lineTo(cx + s * ww, wl + 4);
      ctx.lineTo(cx + s * ww, wl - top - 8);
      ctx.closePath();
    };
    ctx.beginPath();
    shadeFace(MT.xg, mtH(MT.xg), MT.Wg);
    shadeFace(MT.xl, mtH(MT.xl), MT.Wl);
    ctx.fillStyle = U.rgba(14, 16, 30, 0.22 + 0.12 * day);
    ctx.fill();
    // 山沟
    if (MT.gul.length) {
      ctx.beginPath();
      for (const g of MT.gul) {
        ctx.moveTo(g[0], wl - g[1]);
        for (let k = 2; k < g.length; k += 2) ctx.lineTo(g[k], wl - g[k + 1]);
      }
      ctx.strokeStyle = U.rgba(20, 20, 34, 0.18 + 0.1 * day);
      ctx.lineWidth = Math.max(1, 1.4 * uu());
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    // 山脚的水汽
    const gm = ctx.createLinearGradient(0, wl - 0.35 * Hm, 0, wl);
    const hz = W.haze;
    gm.addColorStop(0, rgba(hz, 0));
    gm.addColorStop(1, rgba(hz, 0.42));
    ctx.fillStyle = gm;
    ctx.fillRect(-2, wl - 0.35 * Hm, W.w + 4, 0.35 * Hm + 0.12 * W.h);
    ctx.restore();
    // 迎光的一道边
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const y = wl - H[i]; if (i) ctx.lineTo(i * st, y); else ctx.moveTo(0, y); }
    ctx.strokeStyle = W.shadeCSS(W.dusk > 0.3 ? [255, 190, 130] : RIMC, dp * 0.5, (0.18 + 0.4 * day) * (1 - 0.6 * W.lv.storm), 0.4);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
    // 水线：山与水相接处的一道白沫
    if (e < 0.999) {
      ctx.beginPath();
      let on = false;
      for (let i = 0; i < n; i++) {
        const em = H[i] > dy + 0.5;
        const x = i * st, y = wl - 0.5 + Math.sin(x * 0.05 + S.clock * 2) * 0.8;
        if (em && !on) { ctx.moveTo(x, y); on = true; } else if (em) ctx.lineTo(x, y); else on = false;
      }
      ctx.strokeStyle = W.shadeCSS(FOAM, 0.25, 0.45 + 0.2 * W.lv.flSea);
      ctx.lineWidth = 1.6 * uu();
      ctx.stroke();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  方舟
  // ════════════════════════════════════════════════════════════
  const DX = -0.3, DW = 0.075, SILL = -0.03, DTOP = -0.128, WINX = 0.12;
  const CAB_POSTS = [-0.37, -0.25, -0.13, -0.01, 0.11, 0.23, 0.35];
  function sheerY(x) { const t = x + 0.5; return (1 - t) * (1 - t) * -0.158 + 2 * (1 - t) * t * -0.128 + t * t * -0.168; }
  function hullPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.158);
    ctx.quadraticCurveTo(0, -0.128, 0.5, -0.168);
    ctx.quadraticCurveTo(0.505, -0.014, 0.4, 0);
    ctx.lineTo(-0.41, 0);
    ctx.quadraticCurveTo(-0.5, -0.012, -0.5, -0.158);
    ctx.closePath();
  }
  // 造在岸上的方舟：按完全升起的地形放（大地只在方舟漂起之后才沉下；重演时 land 的缓存可能尚未更新）
  const bY = x => W.ridgeBaseY(2, clamp(x, 0, W.w));
  function groundUnder(x) { const L = arkLen(); return (bY(x - 0.32 * L) + bY(x) * 2 + bY(x + 0.32 * L)) / 4 + 1.5; }
  function groundTilt(x) { const L = arkLen(); return clamp(Math.atan2(bY(x + 0.35 * L) - bY(x - 0.35 * L), 0.7 * L) * 0.7, -0.06, 0.06); }
  const P0 = [0, 0, 0], P1 = [0, 0, 0];
  const ARK = { vis: false, x: 0, y: 0, s: 1, L: 1, tilt: 0, float: false, mount: false, depth: 0, a: '' };
  function poseXY(p, out) {
    if (p.a === 'ground') { const x = clamp(p.x, 0.05, 0.95) * W.w; out[0] = x; out[1] = groundUnder(x); out[2] = 1; }
    else if (p.a === 'mount') { const x = MT.xc; out[0] = x; out[1] = Math.min(MT.wl, surfY(x)); out[2] = MT.sM; }
    else { out[0] = p.x * W.w; out[1] = p.y * W.h; out[2] = p.s || 1; }
    return out;
  }
  function arkNow() {
    const st = S.ark;
    ensureLayout();
    if (!st || !MT.ok) { ARK.vis = false; return ARK; }
    poseXY(st.p1, P1);
    let x = P1[0], y = P1[1], s = P1[2];
    const k = st.dur > 0 ? c01((S.clock - st.t0) / st.dur) : 1;
    if (k < 1) {
      poseXY(st.p0, P0);
      const e = U.easeInOut(k);
      x = lerp(P0[0], x, e); y = lerp(P0[1], y, e); s = lerp(P0[2], s, e);
    }
    ARK.vis = W.lv.arkBuild > 0.002;
    ARK.x = x; ARK.y = y; ARK.s = s; ARK.L = arkLen() * s;
    ARK.a = st.p1.a;
    ARK.mount = st.p1.a === 'mount';
    ARK.float = st.p1.a === 'sea' || st.p1.a === 'raw' || (ARK.mount && (k < 1 || surfY(MT.xc) > MT.wl - 0.5));
    ARK.tilt = st.p1.a === 'ground' ? groundTilt(x) : 0;
    ARK.depth = ARK.mount ? 0.16 : 0.02;
    return ARK;
  }
  function arkPt(A, lx, ly, out) {
    const c = Math.cos(A.tilt), s = Math.sin(A.tilt);
    out = out || [0, 0];
    out[0] = A.x + (lx * c - ly * s) * A.L;
    out[1] = A.y + (lx * s + ly * c) * A.L;
    return out;
  }
  function rampFoot(A, out) {
    out = out || [0, 0];
    const p = arkPt(A, DX + DW * 0.5 + 0.24, 0, out);
    p[1] = A.mount ? Math.max(A.y - 0.01 * A.L, surfY(p[0]) + 0.004 * A.L) : gY(p[0]);
    return p;
  }
  // 方舟换位（漂起、漂去、停在山上）
  function setArk(p1, dur, b) {
    if (inst(b) || !dur || !S.ark) { S.ark = { p0: p1, p1, t0: 0, dur: 0 }; return; }
    const A = arkNow();
    const p0 = A.vis ? { a: 'raw', x: A.x / W.w, y: A.y / W.h, s: A.s } : p1;
    S.ark = { p0, p1, t0: S.clock, dur };
  }

  function drawArk(ctx, A) {
    const b = W.lv.arkBuild;
    if (b <= 0.002 || !A.vis) return;
    const L = A.L, pxl = 1 / L, pitch = W.lv.arkPitch, dp = A.depth;
    const sea = W.lv.flSea;
    const bob = A.float ? Math.sin(S.clock * 0.9) * 1.8 * A.s * uu() * (1 + 1.6 * sea) : 0;
    const rock = A.float ? Math.sin(S.clock * 0.63 + 1) * 0.012 * (0.5 + 1.8 * sea) : 0;
    const y0 = A.y + bob;
    const water = y0 - 0.05 * L;
    const cHull = W.shadeCSS(mix(WOOD, PITCH, pitch), dp);
    const cRib = W.shadeCSS(mix(RIB, PITCH, pitch * 0.8), dp);
    const cCab = W.shadeCSS(mix(CABIN, CABIN_P, pitch), dp);
    const cRoof = W.shadeCSS(mix(ROOF, ROOF_P, pitch), dp);
    const cDark = W.shadeCSS(DARK, dp);
    const rimA = (0.22 + 0.55 * W.daylight) * (1 - 0.55 * W.lv.storm);
    const cRim = W.shadeCSS(W.dusk > 0.3 ? [255, 196, 140] : RIMC, dp, rimA, 0.35);
    const lamp = W.lv.flLamp;
    ctx.save();
    if (A.float) { ctx.beginPath(); ctx.rect(-50, -50, W.w + 100, water + 50); ctx.clip(); }
    ctx.translate(A.x, y0);
    ctx.rotate(A.tilt + rock);
    ctx.scale(L, L);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';

    // 脚手架（在后）
    const sa = sstep(0.1, 0.18, b) * (1 - sstep(0.9, 0.99, b));
    if (sa > 0.01) {
      ctx.globalAlpha = sa;
      ctx.strokeStyle = W.shadeCSS(SCAF, dp);
      ctx.lineWidth = 1.4 * pxl;
      ctx.beginPath();
      for (const sx of [-0.46, -0.27, -0.08, 0.11, 0.3, 0.47]) { ctx.moveTo(sx, 0.004); ctx.lineTo(sx, -0.3); }
      for (const sy of [-0.085, -0.17, -0.255]) { ctx.moveTo(-0.47, sy); ctx.lineTo(0.48, sy); }
      ctx.moveTo(-0.46, -0.004); ctx.lineTo(-0.27, -0.17);
      ctx.moveTo(0.47, -0.004); ctx.lineTo(0.3, -0.17);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // ── 上层的舱（在船身之后）──
    const pb = sstep(0.6, 0.68, b);
    if (pb > 0.001) {
      ctx.beginPath();
      for (const cx of CAB_POSTS) { ctx.moveTo(cx, -0.135); ctx.lineTo(cx, -0.135 - 0.105 * pb); }
      ctx.strokeStyle = cRib; ctx.lineWidth = 0.008;
      ctx.stroke();
    }
    let walled = 0;
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const p = sstep(0.66 + k * 0.055, 0.735 + k * 0.055, b);
      if (p <= 0) continue;
      walled = Math.max(walled, p);
      ctx.rect(-0.37, -0.14 - (k + 1) * 0.0273, 0.72 * p, 0.0278);
    }
    ctx.fillStyle = cCab;
    ctx.fill();
    if (walled > 0.05) {
      ctx.beginPath();
      for (let x = -0.33; x < -0.37 + 0.72 * walled; x += 0.045) { ctx.moveTo(x, -0.142); ctx.lineTo(x, -0.221); }
      ctx.strokeStyle = U.rgba(0, 0, 0, 0.18); ctx.lineWidth = 0.9 * pxl;
      ctx.stroke();
    }
    const rp = sstep(0.84, 0.95, b);
    if (rp > 0.001) {
      ctx.save();
      ctx.beginPath(); ctx.rect(-0.42, -0.3, 0.02 + 0.82 * rp, 0.3); ctx.clip();
      // 透光处（高一肘）
      ctx.fillStyle = cDark;
      ctx.fillRect(-0.37, -0.239, 0.72, 0.018);
      if (lamp > 0.01) {
        const la = lamp * (0.25 + 0.55 * W.night + 0.35 * W.lv.storm + 0.2 * W.dusk);
        ctx.fillStyle = U.rgba(255, 196, 120, clamp(la, 0, 0.95));
        ctx.fillRect(-0.36, -0.2365, 0.7, 0.012);
      }
      ctx.beginPath();
      for (let x = -0.37; x <= 0.351; x += 0.06) { ctx.moveTo(x, -0.239); ctx.lineTo(x, -0.221); }
      ctx.strokeStyle = cCab; ctx.lineWidth = 1.2 * pxl;
      ctx.stroke();
      // 窗户（挪亚开窗放鸟，8:6）
      const wo = W.lv.arkWin;
      if (b >= 0.99) {
        ctx.fillStyle = cRoof;
        ctx.fillRect(WINX - 0.036, -0.2395, 0.072 * (1 - 0.85 * wo), 0.019);
        if (wo > 0.2 && S.noahWin) {
          // 挪亚在窗口：头与肩的剪影
          ctx.fillStyle = W.shadeCSS([60, 44, 34], dp);
          ctx.beginPath();
          ctx.ellipse(WINX + 0.004, -0.2295, 0.0072, 0.0078, 0, 0, TAU);
          ctx.fill();
          ctx.fillRect(WINX - 0.008, -0.2235, 0.024, 0.004);
          // 伸手接鸽子
          const reach = doveReach();
          if (reach > 0.01) {
            ctx.strokeStyle = W.shadeCSS([70, 52, 40], dp);
            ctx.lineWidth = 2.2 * pxl;
            ctx.beginPath(); ctx.moveTo(WINX, -0.224); ctx.lineTo(WINX - 0.03 * reach, -0.232 - 0.018 * reach); ctx.stroke();
          }
        }
      }
      // 顶
      ctx.beginPath();
      ctx.moveTo(-0.405, -0.235); ctx.lineTo(-0.35, -0.274); ctx.lineTo(0.33, -0.274); ctx.lineTo(0.385, -0.235);
      ctx.closePath();
      ctx.fillStyle = cRoof;
      ctx.fill();
      ctx.beginPath();
      for (let x = -0.33; x < 0.33; x += 0.05) { ctx.moveTo(x, -0.272); ctx.lineTo(x - 0.01, -0.237); }
      ctx.strokeStyle = U.rgba(0, 0, 0, 0.16); ctx.lineWidth = 0.9 * pxl;
      ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.35, -0.274); ctx.lineTo(0.33, -0.274);
      ctx.strokeStyle = cRim; ctx.lineWidth = 1.4 * pxl;
      ctx.stroke();
      ctx.restore();
    }

    // ── 骨架：龙骨、首尾柱、肋骨（船板盖上之前）──
    const kk = sstep(0, 0.06, b), k2 = sstep(0.03, 0.1, b);
    ctx.strokeStyle = cRib;
    ctx.lineWidth = 0.011;
    ctx.beginPath();
    ctx.moveTo(-0.41 * kk, -0.005); ctx.lineTo(0.4 * kk, -0.005);
    if (k2 > 0) {
      ctx.moveTo(-0.41, -0.004); ctx.quadraticCurveTo(-0.5, -0.012, -0.5, -0.004 - 0.154 * k2);
      ctx.moveTo(0.4, -0.004); ctx.quadraticCurveTo(0.505, -0.014, 0.5, -0.004 - 0.164 * k2);
    }
    ctx.stroke();
    if (b < 0.7) {
      ctx.lineWidth = 0.0075;
      ctx.beginPath();
      for (let i = 0; i < 15; i++) {
        const order = Math.abs(i - 7);
        const r = c01((b - (0.07 + order * 0.028)) / 0.03);
        if (r <= 0) continue;
        const x = -0.43 + (0.86 * i) / 14;
        ctx.moveTo(x, -0.004); ctx.lineTo(x, sheerY(x) * r);
      }
      ctx.stroke();
    }
    // ── 船板：一条一条自下而上，自左而右 ──
    const plank = sstep(0.28, 0.33, b);
    if (plank > 0) {
      ctx.save();
      hullPath(ctx);
      ctx.clip();
      ctx.beginPath();
      const ext = [];
      for (let j = 0; j < 7; j++) {
        const p = sstep(0.28 + j * 0.047, 0.28 + (j + 1) * 0.047 + 0.02, b);
        ext.push(p);
        if (p > 0) ctx.rect(-0.52, -(j + 1) * 0.0242, 1.04 * p, 0.0252);
      }
      ctx.fillStyle = cHull;
      ctx.fill();
      // 船板的缝与三层的甲板线（上、中、下三层）
      ctx.beginPath();
      for (let j = 1; j < 7; j++) {
        const e = Math.min(ext[j - 1], ext[j]);
        if (e <= 0) continue;
        const y = -j * 0.0242;
        ctx.moveTo(-0.52, y); ctx.lineTo(-0.52 + 1.04 * e, y);
      }
      ctx.strokeStyle = U.rgba(0, 0, 0, 0.2); ctx.lineWidth = 0.8 * pxl;
      ctx.stroke();
      if (ext[6] > 0.99) {
        ctx.beginPath();
        ctx.moveTo(-0.5, -0.05); ctx.quadraticCurveTo(0, -0.044, 0.5, -0.055);
        ctx.moveTo(-0.5, -0.1); ctx.quadraticCurveTo(0, -0.09, 0.5, -0.108);
        ctx.strokeStyle = U.rgba(0, 0, 0, 0.3); ctx.lineWidth = 2 * pxl;
        ctx.stroke();
        // 腹下的暗
        const g = ctx.createLinearGradient(0, -0.15, 0, 0);
        g.addColorStop(0, 'rgba(0,0,0,0)');
        g.addColorStop(1, U.rgba(0, 0, 0, 0.3));
        ctx.fillStyle = g;
        ctx.fillRect(-0.52, -0.17, 1.04, 0.17);
        // 松香的光泽
        if (pitch > 0.05) {
          ctx.beginPath(); ctx.moveTo(-0.44, -0.125); ctx.quadraticCurveTo(0, -0.112, 0.44, -0.13);
          ctx.strokeStyle = U.rgba(255, 236, 200, 0.12 * pitch * (0.3 + 0.7 * W.daylight)); ctx.lineWidth = 2.5 * pxl;
          ctx.stroke();
        }
      }
      ctx.restore();
      if (ext[6] > 0.99) {
        ctx.beginPath(); ctx.moveTo(-0.5, -0.158); ctx.quadraticCurveTo(0, -0.128, 0.5, -0.168);
        ctx.strokeStyle = cRim; ctx.lineWidth = 1.5 * pxl;
        ctx.stroke();
      }
    }
    // ── 门（开在旁边）──
    if (b > 0.95) {
      const da = sstep(0.95, 1, b), open = W.lv.arkDoor;
      ctx.globalAlpha = da;
      if (open > 0.02) {
        ctx.fillStyle = cDark;
        ctx.fillRect(DX - DW / 2, DTOP, DW, SILL - DTOP);
        const g = ctx.createRadialGradient(DX, (DTOP + SILL) / 2, 0, DX, (DTOP + SILL) / 2, 0.07);
        const la = open * (0.35 + 0.45 * W.night + 0.2 * W.dusk);
        g.addColorStop(0, U.rgba(255, 200, 128, 0.75 * la));
        g.addColorStop(1, 'rgba(255,190,110,0)');
        ctx.fillStyle = g;
        ctx.fillRect(DX - DW / 2, DTOP, DW, SILL - DTOP);
      }
      ctx.fillStyle = open > 0.02 ? W.shadeCSS(mix(WOOD, PITCH, pitch * 0.7), dp, 1, 0.08) : cHull;
      ctx.fillRect(DX - DW / 2, DTOP, DW * (1 - 0.84 * open), SILL - DTOP);
      ctx.strokeStyle = cRib; ctx.lineWidth = 1.6 * pxl;
      ctx.strokeRect(DX - DW / 2, DTOP, DW, SILL - DTOP);
      // 耶和华把他关在方舟里头：门缝里一圈光
      const sa2 = 1 - (S.clock - S.sealT0) / 6;
      if (sa2 > 0 && sa2 <= 1) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = U.rgba(255, 228, 170, 0.8 * sa2 * sa2);
        ctx.lineWidth = (2 + 3 * sa2) * pxl;
        ctx.strokeRect(DX - DW / 2, DTOP, DW, SILL - DTOP);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // ── 跳板 ──
    const ra = W.lv.arkRamp;
    if (ra > 0.01 && b > 0.99) {
      const s1 = arkPt(A, DX + DW * 0.5, SILL, T1), f = rampFoot(A, T2);
      const ex = lerp(s1[0], f[0], ra), ey = lerp(s1[1], f[1], ra);
      ctx.lineCap = 'butt';
      ctx.strokeStyle = W.shadeCSS(mix(WOOD, PITCH, pitch * 0.6), dp);
      ctx.lineWidth = Math.max(2, 0.016 * L);
      ctx.beginPath(); ctx.moveTo(s1[0], s1[1] + 0.006 * L); ctx.lineTo(ex, ey - 0.004 * L); ctx.stroke();
      ctx.strokeStyle = cRim; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(s1[0], s1[1] - 0.001 * L); ctx.lineTo(ex, ey - 0.011 * L); ctx.stroke();
      ctx.lineCap = 'round';
    }
    // ── 吃水线：一道起伏的水沫 ──
    if (A.float) {
      const hw = 0.53 * L;
      ctx.beginPath();
      for (let i = 0; i <= 26; i++) {
        const xx = A.x - hw + (2 * hw * i) / 26;
        const yy = water + Math.sin(i * 1.3 + S.clock * 2.2) * 1.3 * A.s * (1 + sea);
        if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
      ctx.lineTo(A.x + hw, water + 7 * A.s * uu());
      ctx.lineTo(A.x - hw, water + 7 * A.s * uu());
      ctx.closePath();
      ctx.fillStyle = W.shadeCSS(SEA, 0.15, 0.85);
      ctx.fill();
      ctx.beginPath();
      for (let i = 0; i <= 26; i++) {
        const xx = A.x - hw + (2 * hw * i) / 26;
        const yy = water + Math.sin(i * 1.3 + S.clock * 2.2) * 1.3 * A.s * (1 + sea);
        if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
      ctx.strokeStyle = W.shadeCSS(FOAM, 0.1, 0.55 + 0.3 * sea);
      ctx.lineWidth = 1.5 * A.s * uu();
      ctx.stroke();
    }
  }
  const T1 = [0, 0], T2 = [0, 0], T3 = [0, 0];

  // 方舟窗里的灯（'air' 层，叠加的暖光：暴雨与夜里最显）
  let GLOW = null;
  function glowSprite() {
    if (GLOW) return GLOW;
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      GLOW = c;
    } catch (e) { GLOW = null; }
    return GLOW;
  }
  let WARM = null;
  function warmSprite() {
    if (WARM) return WARM;
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(0.4, 'rgba(255,170,90,0.4)'); gr.addColorStop(1, 'rgba(255,150,70,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      WARM = c;
    } catch (e) { WARM = null; }
    return WARM;
  }
  function drawLamp(ctx) {
    const A = arkNow();
    const la = W.lv.flLamp;
    if (!A.vis || la < 0.02 || W.lv.arkBuild < 0.99) return;
    const k = la * (0.12 + 0.5 * W.night + 0.35 * W.lv.storm + 0.15 * W.dusk);
    if (k < 0.02) return;
    const sp = warmSprite();
    if (!sp) return;
    const bob = A.float ? Math.sin(S.clock * 0.9) * 1.8 * A.s * uu() * (1 + 1.6 * W.lv.flSea) : 0;
    const c = arkPt(A, -0.01, -0.232, T3);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k, 0, 1);
    ctx.drawImage(sp, c[0] - 0.5 * A.L, c[1] + bob - 0.07 * A.L, A.L, 0.14 * A.L);
    ctx.globalAlpha = clamp(k * 0.45, 0, 1);
    ctx.drawImage(sp, c[0] - 0.9 * A.L, c[1] + bob - 0.25 * A.L, 1.8 * A.L, 0.5 * A.L);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  走兽的剪影：参数化的基元拼成（Path2D，四帧步态；面向 +x，脚踏 y = 0，单位 = 近地 unit=1 的像素）
  // ════════════════════════════════════════════════════════════
  function poly(P, pts) {
    let a = 0;
    for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
    if (a < 0) pts = pts.slice().reverse();
    P.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) P.lineTo(pts[i][0], pts[i][1]);
    P.closePath();
  }
  function tube(P, x0, y0, x1, y1, w0, w1) {
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    poly(P, [[x0 + nx * w0 / 2, y0 + ny * w0 / 2], [x1 + nx * w1 / 2, y1 + ny * w1 / 2], [x1 - nx * w1 / 2, y1 - ny * w1 / 2], [x0 - nx * w0 / 2, y0 - ny * w0 / 2]]);
  }
  function ell(P, cx, cy, rx, ry, rot) {
    const r = rot || 0;
    P.moveTo(cx + rx * Math.cos(r), cy + rx * Math.sin(r));
    P.ellipse(cx, cy, rx, ry, r, 0, TAU);
    P.closePath();
  }
  function legs(P, fx0, bx0, top, len, w0, w1, amp, ph, far) {
    const s = Math.sin(ph) * amp;
    const leg = (x, a) => tube(P, x, top, x + Math.sin(a) * len, top + Math.cos(a) * len, w0, w1);
    leg(fx0 - far, -s); leg(bx0 - far, s);
    leg(fx0, s); leg(bx0, -s);
  }
  const KIND = {
    elephant: { cn: '象', col: [118, 118, 128], build(P, ph) {
      legs(P, 11, -11, -19, 19, 7, 6, 0.14, ph, 3);
      ell(P, 0, -26, 19, 12.5); ell(P, 18, -31, 7.5, 8); ell(P, 13.5, -29, 5.5, 8.5, 0.15);
      tube(P, 23, -29, 26.5, -18, 5.2, 4.2); tube(P, 26.5, -18, 26, -8, 4.2, 3.2); tube(P, 26, -8, 28, -4.5, 3.2, 2.4);
      tube(P, -18.5, -30, -21, -20, 1.4, 1);
    } },
    giraffe: { cn: '长颈鹿', col: [198, 154, 96], build(P, ph) {
      legs(P, 8, -8, -27, 27, 2.8, 2, 0.2, ph, 2);
      ell(P, 0, -31, 12.5, 7, -0.1); tube(P, 9, -34, 16, -60, 6, 3.4); ell(P, 18.5, -61, 5, 2.4, 0.35);
      tube(P, 16, -63, 15.5, -67, 1.1, 0.9); tube(P, 17.5, -63, 17.5, -67, 1.1, 0.9); tube(P, -12, -32, -14.5, -21, 1.1, 0.8);
    } },
    lion: { cn: '狮子', col: [188, 142, 80], female: true, build(P, ph, m) {
      legs(P, 7, -7.5, -11, 11, 3.2, 2.4, 0.3, ph, 1.8);
      ell(P, 0, -13.5, 12, 5.6); ell(P, 13.5, -16.5, 4.4, 3.6, 0.2);
      if (m) ell(P, 11, -17, 6.3, 6.8);
      tube(P, -11.5, -15, -16, -10, 1.1, 0.9); tube(P, -16, -10, -18.5, -13, 0.9, 0.9); ell(P, -18.8, -13.2, 1.6, 1.6);
    } },
    horse: { cn: '马', col: [96, 72, 58], alt: [132, 104, 82], build(P, ph) {
      legs(P, 8, -8.5, -14, 14, 2.6, 1.8, 0.32, ph, 1.8);
      ell(P, 0, -17.5, 12, 5.8); tube(P, 8.5, -19, 14, -28, 6, 3.6); tube(P, 14, -28.5, 19.5, -23, 4, 2.4);
      tube(P, 14.2, -29, 15, -32.5, 1.3, 0.8); tube(P, 7.5, -22.5, 13, -30, 2.2, 1.4); tube(P, -11.5, -19, -14.5, -9, 2.6, 1.6);
    } },
    deer: { cn: '鹿', col: [142, 96, 64], female: true, build(P, ph, m) {
      legs(P, 6.5, -6.5, -12, 12, 2, 1.3, 0.32, ph, 1.5);
      ell(P, 0, -15, 9.5, 4.8); tube(P, 6.5, -17, 10.5, -25, 4, 2.6); tube(P, 10.5, -25.5, 14.5, -22.5, 3, 1.6);
      tube(P, 10.5, -26.5, 11.5, -29, 1.2, 0.8); tube(P, -9.5, -16, -10.5, -18.5, 1.6, 1);
      if (m) { tube(P, 10.5, -26.5, 8.5, -33, 1.1, 0.8); tube(P, 9.5, -30, 6.5, -31.5, 0.9, 0.7); tube(P, 9, -32, 11, -35.5, 0.9, 0.7); }
    } },
    camel: { cn: '骆驼', col: [184, 148, 106], build(P, ph) {
      legs(P, 7.5, -7.5, -20, 20, 2.8, 1.8, 0.26, ph, 1.8);
      ell(P, 0, -23.5, 11.5, 6); ell(P, -1.5, -29.5, 6.5, 4.8);
      tube(P, 10, -24, 15, -20.5, 5, 4); tube(P, 15, -20.5, 17.5, -31, 4, 3.4); ell(P, 19.5, -32, 4.2, 2.4, 0.15);
      tube(P, -11.5, -25, -12.5, -17, 1.2, 0.9);
    } },
    ox: { cn: '牛', col: [98, 76, 56], alt: [70, 56, 44], build(P, ph) {
      legs(P, 9, -9.5, -10, 10, 3.6, 2.6, 0.24, ph, 2);
      ell(P, 0, -14, 14, 7); tube(P, 12, -16, 18, -11.5, 6.5, 4.2);
      tube(P, 15, -17.5, 17.5, -21.5, 1.5, 0.8); tube(P, 15, -17.5, 12.5, -21, 1.4, 0.8); tube(P, -14, -16, -15, -7, 1.3, 1);
    } },
    sheep: { cn: '羊', col: [232, 226, 212], build(P, ph) {
      legs(P, 5, -5, -6, 6, 1.7, 1.3, 0.3, ph, 1.2);
      ell(P, 0, -10, 8.5, 5.3); ell(P, -4, -13.2, 3.4, 3); ell(P, 0.5, -14, 3.6, 3.2); ell(P, 4.5, -12.8, 3.2, 3); ell(P, 9.5, -11.5, 2.9, 2.2, 0.45);
    } },
    bear: { cn: '熊', col: [86, 66, 52], build(P, ph) {
      legs(P, 7, -7, -6.5, 6.5, 3.8, 3.2, 0.26, ph, 1.8);
      ell(P, 0, -10.5, 11, 6.8); ell(P, 11, -11.5, 4.6, 4); ell(P, 10, -15.5, 1.5, 1.5); tube(P, 13.5, -11, 16.5, -9.8, 3.2, 2.2);
    } },
    goat: { cn: '山羊', col: [150, 126, 100], alt: [214, 204, 188], build(P, ph) {
      legs(P, 5, -5, -9, 9, 1.8, 1.2, 0.3, ph, 1.2);
      ell(P, 0, -11.5, 8, 4.2); tube(P, 6, -13, 9, -17.5, 3.2, 2.2); tube(P, 9, -17.5, 12, -14.5, 2.6, 1.5);
      tube(P, 9, -18.5, 5.5, -22, 1.3, 0.7); tube(P, 11, -14, 11.3, -11.8, 1, 0.6); tube(P, -7.5, -13, -8.5, -16, 1.2, 0.7);
    } },
    ostrich: { cn: '鸵鸟', col: [70, 62, 58], build(P, ph) {
      const s = Math.sin(ph) * 0.42;
      tube(P, 1, -18, 1 + Math.sin(s) * 17, -1, 2, 1.3); tube(P, -1, -18, -1 - Math.sin(s) * 17, -1, 2, 1.3);
      ell(P, 0, -22, 8, 5.8); ell(P, -8, -24, 3.4, 3.2); tube(P, 6, -24, 8, -40, 2.4, 1.5); ell(P, 9, -40.5, 2.3, 1.4);
    } },
    rabbit: { cn: '兔子', col: [158, 144, 126], build(P, ph) {
      ell(P, 0, -4.2, 4.6, 3.3); ell(P, 4, -6.4, 2.3, 2);
      tube(P, 3.5, -7.8, 2.8, -12.5, 1.3, 0.9); tube(P, 4.6, -7.8, 5.2, -12.2, 1.2, 0.8); ell(P, -4.5, -5, 1.2, 1.2);
      tube(P, -2.5, -2, -3.5 - Math.sin(ph) * 1.5, 0, 2, 1.2); tube(P, 2.5, -2, 3 + Math.sin(ph) * 1.5, 0, 1.3, 1);
    } },
    tortoise: { cn: '龟', col: [102, 106, 74], build(P, ph) {
      ell(P, 0, -3.6, 6.2, 3.6); tube(P, 5.5, -2.5, 8, -3, 1.8, 1.5); ell(P, 8.3, -3, 1.7, 1.3);
      tube(P, 3.5, -1.5, 4 + Math.sin(ph), 0, 1.8, 1.5); tube(P, -3.5, -1.5, -3 - Math.sin(ph), 0, 1.8, 1.5);
    } },
  };
  const BIRDK = {
    eagle: { cn: '鹰', col: [62, 54, 48], s: 1.3 },
    stork: { cn: '鹳', col: [232, 230, 222], s: 1.2 },
    raven: { cn: '乌鸦', col: [26, 26, 32], s: 0.9 },
    dove: { cn: '鸽子', col: [240, 240, 244], s: 0.8 },
    swallow: { cn: '燕子', col: [40, 44, 58], s: 0.65 },
  };
  const SPR = {};
  function buildSprites() {
    if (typeof Path2D === 'undefined') return;
    for (const k in KIND) {
      const K = KIND[k];
      for (const m of K.female ? [1, 0] : [1]) {
        const arr = [];
        for (let f = 0; f < 4; f++) { const P = new Path2D(); K.build(P, (f * Math.PI) / 2, m); arr.push(P); }
        SPR[k + (m ? '' : ':f')] = arr;
      }
    }
  }
  const COLC = { frame: -1, map: {} };
  function kindCol(key, rgb, depth) {
    if (COLC.frame !== W.frame) { COLC.frame = W.frame; COLC.map = {}; }
    const k = key + '|' + depth;
    return COLC.map[k] || (COLC.map[k] = W.shadeCSS(rgb, depth));
  }
  function drawBeast(ctx, key, male, frame, x, y, s, dir, alpha, depth, rgb) {
    const arr = SPR[key + (male || !KIND[key].female ? '' : ':f')];
    if (!arr || alpha <= 0.01) return;
    const P = arr[frame & 3];
    const hop = key === 'rabbit' ? -Math.abs(Math.sin((frame * Math.PI) / 2)) * 2.5 * s : 0;
    ctx.globalAlpha = clamp(alpha, 0, 1);
    // 迎光的一道边：先以亮色错开一点画，再画身体
    const rimA = (0.2 + 0.5 * W.daylight) * (1 - 0.5 * W.lv.storm);
    if (rimA > 0.05) {
      ctx.save();
      ctx.translate(x + (W.sun.x > x ? 0.8 : -0.8), y + hop - 0.8);
      ctx.scale(s * dir, s);
      ctx.fillStyle = W.shadeCSS(W.dusk > 0.3 ? [255, 200, 150] : RIMC, depth, rimA, 0.3);
      ctx.fill(P);
      ctx.restore();
    }
    ctx.save();
    ctx.translate(x, y + hop);
    ctx.scale(s * dir, s);
    ctx.fillStyle = kindCol(key + (male ? 'm' : 'f'), rgb, depth);
    ctx.fill(P);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 飞鸟：身、头、尾与一对扇动的翅膀
  function drawFlyer(ctx, x, y, s, ph, dir, rgb, alpha, glow) {
    if (alpha <= 0.01) return;
    const up = Math.sin(ph);
    ctx.globalAlpha = clamp(alpha, 0, 1);
    if (glow) {
      const sp = glowSprite();
      if (sp) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = clamp(alpha * glow, 0, 1);
        ctx.drawImage(sp, x - 14 * s, y - 14 * s, 28 * s, 28 * s);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = clamp(alpha, 0, 1);
      }
    }
    ctx.fillStyle = W.shadeCSS(rgb, 0.05, 1, rgb[0] > 200 ? 0.25 : 0);
    ctx.beginPath();
    ctx.ellipse(x, y, 4.6 * s, 1.7 * s, 0, 0, TAU);
    ctx.moveTo(x + dir * 5.8 * s, y - 0.9 * s);
    ctx.ellipse(x + dir * 4.6 * s, y - 0.8 * s, 1.6 * s, 1.35 * s, 0, 0, TAU);
    ctx.moveTo(x - dir * 4 * s, y);
    ctx.lineTo(x - dir * 7.5 * s, y - 1.3 * s);
    ctx.lineTo(x - dir * 7.2 * s, y + 1.4 * s);
    ctx.closePath();
    // 翅膀
    ctx.moveTo(x + dir * 1.5 * s, y - 0.8 * s);
    ctx.quadraticCurveTo(x - dir * 1 * s, y - 7 * s * up, x - dir * 3.5 * s, y - 8.5 * s * up);
    ctx.quadraticCurveTo(x - dir * 2 * s, y - 3 * s * up, x - dir * 2.2 * s, y - 0.4 * s);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 一对一对进方舟 ──────────────────────────────────────────
  const ENTER_SEQ = ['elephant', 'b:eagle', 'giraffe', 'lion', 'b:stork', 'horse', 'deer', 'b:raven', 'camel', 'ox', 'sheep', 'b:dove',
    'bear', 'goat', 'b:swallow', 'ostrich', 'rabbit', 'tortoise'];
  function makeProc() {
    const list = [];
    ENTER_SEQ.forEach((k, i) => {
      const bird = k.slice(0, 2) === 'b:';
      const kind = bird ? k.slice(2) : k;
      for (let m = 0; m < 2; m++) list.push({ kind, bird, male: m === 0, delay: i * 1.3 + m * (bird ? 0.35 : 0.28), far: m === 1, seed: hsh(i * 7 + m) });
    });
    return list;
  }
  const beastScale = () => W.layerScale(2) * narrow();
  function drawEnter(ctx) {
    const P = S.proc;
    if (!P) return;
    const A = arkNow();
    if (!A.vis || W.lv.arkBuild < 0.99) return;
    const sill = arkPt(A, DX + DW * 0.5, SILL, T1), inner = arkPt(A, DX, SILL, T3);
    const foot = rampFoot(A, T2);
    const x0 = W.w * 1.06;
    const Lg = Math.max(1, x0 - foot[0]), Lr = Math.hypot(sill[0] - foot[0], sill[1] - foot[1]), Li = Math.abs(sill[0] - inner[0]);
    const sc = beastScale(), v = 72 * uu() * narrow();
    const win = arkPt(A, -0.05, -0.232, [0, 0]);
    for (let pass = 0; pass < 2; pass++) {
      for (const w of P.list) {
        if (w.far !== (pass === 0)) continue;
        const t = S.clock - P.t0 - w.delay;
        if (t < 0) continue;
        if (w.bird) {
          const u = t / 4.6;
          if (u >= 1) continue;
          const e = U.easeInOut(u);
          const sx = W.w * 1.08, sy = W.h * (0.14 + 0.08 * w.seed), cx = W.w * 0.82, cy = W.h * 0.05;
          const bx = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cx + e * e * win[0] + (w.far ? 6 : 0) * sc;
          const by = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cy + e * e * win[1] - (w.far ? 5 : 0) * sc;
          const K = BIRDK[w.kind];
          drawFlyer(ctx, bx, by, K.s * sc * (w.far ? 0.92 : 1), S.clock * 11 + w.seed * 6, -1, K.col, 1 - sstep(0.85, 1, u), w.kind === 'dove' ? 0.3 : 0);
          continue;
        }
        const d = t * v;
        let x, y, a = 1;
        if (d <= Lg) { x = x0 - d; y = gY(x); }
        else if (d <= Lg + Lr) { const u = (d - Lg) / Lr; x = lerp(foot[0], sill[0], u); y = lerp(foot[1], sill[1], u); a = 1 - 0.55 * sstep(0.7, 1, u); }
        else if (d <= Lg + Lr + Li + 1) { const u = (d - Lg - Lr) / (Li + 1); x = lerp(sill[0], inner[0], u); y = sill[1]; a = 0.45 * (1 - u); }
        else continue;
        const K = KIND[w.kind];
        const s = sc * (w.far ? 0.92 : 1);
        drawBeast(ctx, w.kind, w.male, Math.floor(d / (6 * s + 1)), x + (w.far ? 3 * s : 0), y - (w.far ? 2.2 * s : 0), s, -1, a,
          w.far ? 0.1 : 0.02, !w.male && K.alt ? K.alt : K.col);
      }
    }
  }

  // ── 出方舟：沿山坡走下来 ────────────────────────────────────
  const EXIT_SEQ = ['sheep', 'ox', 'horse', 'camel', 'deer', 'goat', 'lion', 'elephant', 'bear', 'giraffe', 'rabbit', 'ostrich'];
  function makeExit() {
    const list = [];
    EXIT_SEQ.forEach((k, i) => { for (let m = 0; m < 2; m++) list.push({ kind: k, male: m === 0, delay: i * 1.05 + m * 0.3, far: m === 1 }); });
    return list;
  }
  const exitEndX = () => clamp(MT.xc - 0.12 * W.w, W.w * 0.44, W.w * 0.7);
  const EP = { n: 0, x: new Float32Array(6), y: new Float32Array(6), d: new Float32Array(6), total: 1 };
  function exitPath() {
    const A = arkNow();
    if (!A.vis) return null;
    const inner = arkPt(A, DX, SILL, T1);
    EP.x[0] = inner[0]; EP.y[0] = inner[1];
    const sill = arkPt(A, DX + DW * 0.5, SILL, T1);
    EP.x[1] = sill[0]; EP.y[1] = sill[1];
    const f = rampFoot(A, T2);
    EP.x[2] = f[0]; EP.y[2] = f[1];
    const xe = exitEndX(), ye = gY(xe);
    EP.x[3] = lerp(f[0], xe, 0.3) + 0.03 * W.w; EP.y[3] = lerp(f[1], ye, 0.42);
    EP.x[4] = lerp(f[0], xe, 0.7) - 0.01 * W.w; EP.y[4] = lerp(f[1], ye, 0.78);
    EP.x[5] = xe; EP.y[5] = ye;
    EP.n = 6; EP.d[0] = 0;
    for (let i = 1; i < 6; i++) EP.d[i] = EP.d[i - 1] + Math.hypot(EP.x[i] - EP.x[i - 1], EP.y[i] - EP.y[i - 1]);
    EP.total = Math.max(1, EP.d[5]);
    EP.s0 = A.s;
    return EP;
  }
  function exitAt(u, out) {
    const d = c01(u) * EP.total;
    let i = 1;
    while (i < EP.n - 1 && EP.d[i] < d) i++;
    const seg = Math.max(1e-6, EP.d[i] - EP.d[i - 1]), r = c01((d - EP.d[i - 1]) / seg);
    out[0] = lerp(EP.x[i - 1], EP.x[i], r); out[1] = lerp(EP.y[i - 1], EP.y[i], r);
    out[2] = EP.x[i] >= EP.x[i - 1] ? 1 : -1;
    out[3] = d;
    return out;
  }
  const EX = [0, 0, 0, 0];
  function drawExit(ctx) {
    const E = S.exit;
    if (!E || !exitPath()) return;
    const v = 34 * uu() * narrow();
    for (let pass = 0; pass < 2; pass++) {
      for (const w of E.list) {
        if (w.far !== (pass === 0)) continue;
        const t = S.clock - E.t0 - w.delay;
        if (t < 0) continue;
        const u = (t * v) / EP.total;
        if (u >= 1) continue;
        exitAt(u, EX);
        const K = KIND[w.kind];
        const frac = c01((EX[3] - EP.d[2]) / Math.max(1, EP.total - EP.d[2]));
        const s = beastScale() * lerp(EP.s0, 1, frac) * (w.far ? 0.92 : 1);
        const a = sstep(0, 0.06, u) * (1 - sstep(0.86, 1, u));
        drawBeast(ctx, w.kind, w.male, Math.floor(EX[3] / (6 * s + 1)), EX[0] + (w.far ? 3 * s : 0), EX[1] - (w.far ? 2 * s : 0), s, EX[2], a,
          lerp(0.16, 0.02, frac), !w.male && K.alt ? K.alt : K.col);
      }
    }
  }
  // 挪亚一家沿同一条路走下来（cast.attach：每帧给出脚下的位置）
  function exitFn(t0, dur) {
    return () => {
      if (!exitPath()) return null;
      const u = c01((S.clock - t0) / dur);
      exitAt(u, EX);
      return [EX[0], EX[1]];
    };
  }
  // 自此刻所站之处走到跳板脚下，踏上跳板，进门
  function rampFn(t0, dur, sx) {
    return () => {
      const A = arkNow();
      if (!A.vis) return null;
      const foot = rampFoot(A, T2), sill = arkPt(A, DX + DW * 0.5, SILL, T1);
      const l1 = Math.abs(sx - foot[0]), l2 = Math.hypot(sill[0] - foot[0], sill[1] - foot[1]), l3 = 0.5 * DW * A.L;
      const d = c01((S.clock - t0) / dur) * (l1 + l2 + l3);
      if (d <= l1) { const x = sx + (foot[0] - sx) * (d / Math.max(1, l1)); return [x, gY(x)]; }
      if (d <= l1 + l2) { const u = (d - l1) / Math.max(1, l2); return [lerp(foot[0], sill[0], u), lerp(foot[1], sill[1], u)]; }
      const u = (d - l1 - l2) / Math.max(1, l3);
      return [lerp(sill[0], arkPt(A, DX, SILL, T3)[0], u), sill[1]];
    };
  }

  // ════════════════════════════════════════════════════════════
  //  天：暴风雨、雨、闪电、云开处的光、虹
  // ════════════════════════════════════════════════════════════
  let CLOUD = null, CLOUD2 = null;
  function makeClouds(seed, n, light) {
    try {
      const cw = 512, ch = 170;
      const c = document.createElement('canvas'); c.width = cw; c.height = ch;
      const g = c.getContext('2d');
      const r = U.mulberry32(seed);
      for (let k = 0; k < n; k++) {
        const x = r() * cw, y = ch * (0.12 + 0.78 * Math.pow(r(), 0.85));
        const rad = (0.05 + 0.11 * r()) * cw * (0.6 + 0.7 * (y / ch));
        const lit = r() < 0.5;
        const v = lit ? light + 40 * r() : 18 + 22 * r();
        const a = lit ? 0.22 + 0.2 * r() : 0.35 + 0.3 * r();
        const oy = lit ? -rad * 0.28 : 0;
        for (const ox of [-cw, 0, cw]) {
          const gr = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad);
          gr.addColorStop(0, U.rgba(v, v + 3, v + 9, a));
          gr.addColorStop(1, U.rgba(v, v + 3, v + 9, 0));
          g.fillStyle = gr;
          g.beginPath(); g.ellipse(x + ox, y + oy, rad, rad * 0.5, 0, 0, TAU); g.fill();
        }
      }
      return c;
    } catch (e) { return null; }
  }
  function drawSkyTints(ctx) {
    const hz = W.horizonY;
    const h = W.lv.flHaze, g = W.lv.flGrief;
    if (h > 0.01) {
      const gs = ctx.createLinearGradient(0, 0, 0, hz);
      gs.addColorStop(0, U.rgba(70, 40, 34, 0.18 * h));
      gs.addColorStop(1, U.rgba(150, 70, 36, 0.34 * h));
      ctx.fillStyle = gs;
      ctx.fillRect(-20, -20, W.w + 40, hz + 20);
    }
    if (g > 0.01) { ctx.fillStyle = U.rgba(60, 68, 88, 0.26 * g); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
  }
  function drawStormSky(ctx) {
    const s = W.lv.storm;
    if (s < 0.01) return;
    const hz = W.horizonY, day = W.daylight;
    const top = U.mixRGB([6, 8, 14], [52, 58, 68], day), mid = U.mixRGB([12, 14, 22], [96, 102, 112], day);
    const g = ctx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, rgba(top, 0.93 * s));
    g.addColorStop(1, rgba(mid, 0.78 * s));
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, W.w + 40, hz + 21);
    if (!CLOUD) CLOUD = makeClouds(4242, 110, 150);
    if (!CLOUD2) CLOUD2 = makeClouds(917, 70, 120);
    const speed = (10 + 55 * W.lv.flWind + 18 * s) * uu();
    const off1 = ((S.clock * speed) % W.w + W.w) % W.w, off2 = ((S.clock * speed * 0.55) % W.w + W.w) % W.w;
    const ca = s * (0.45 + 0.55 * day) + 0.15 * s;
    if (CLOUD2) {
      ctx.globalAlpha = clamp(ca * 0.8, 0, 1);
      ctx.drawImage(CLOUD2, -off2, hz * 0.18, W.w, hz * 0.85);
      ctx.drawImage(CLOUD2, W.w - off2, hz * 0.18, W.w, hz * 0.85);
    }
    if (CLOUD) {
      ctx.globalAlpha = clamp(ca, 0, 1);
      ctx.drawImage(CLOUD, -off1, -hz * 0.05, W.w, hz * 0.8);
      ctx.drawImage(CLOUD, W.w - off1, -hz * 0.05, W.w, hz * 0.8);
    }
    ctx.globalAlpha = 1;
    if (W.night > 0.02) { ctx.fillStyle = U.rgba(2, 3, 7, 0.6 * W.night * s); ctx.fillRect(-20, -20, W.w + 40, hz + 21); }
    // 海也暗下来
    const g2 = ctx.createLinearGradient(0, hz, 0, W.h);
    g2.addColorStop(0, rgba(U.mixRGB([8, 12, 18], [70, 78, 90], day), 0.75 * s));
    g2.addColorStop(1, rgba([6, 10, 16], 0.5 * s));
    ctx.fillStyle = g2;
    ctx.fillRect(-20, hz, W.w + 40, W.h - hz + 20);
    // 天上的窗户敞开：一道道雨幕
    const r = W.lv.rain;
    if (r > 0.02) {
      const slant = (0.05 + 0.08 * W.lv.flWind) * W.w;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const cx = (((hsh(k + 3.7) * 1.3 + S.clock * 0.006 * (1 + W.lv.flWind)) % 1.3) - 0.15) * W.w;
        const top2 = (0.2 + 0.1 * hsh(k * 2.1)) * W.h, w = (0.05 + 0.06 * hsh(k * 5.3)) * W.w;
        ctx.moveTo(cx - w / 2, top2); ctx.lineTo(cx + w / 2, top2); ctx.lineTo(cx + w / 2 + slant, hz + 2); ctx.lineTo(cx - w / 2 + slant, hz + 2); ctx.closePath();
      }
      const gc = ctx.createLinearGradient(0, 0.2 * W.h, 0, hz);
      const rc = U.mixRGB([40, 46, 58], [150, 158, 172], day);
      gc.addColorStop(0, rgba(rc, 0));
      gc.addColorStop(0.3, rgba(rc, 0.22 * r));
      gc.addColorStop(1, rgba(rc, 0.08 * r));
      ctx.fillStyle = gc;
      ctx.fill();
    }
  }
  function makeBolt() {
    const x0 = rnd(0.08, 0.92) * W.w, y0 = rnd(0.06, 0.2) * W.h, y1 = W.horizonY + rnd(-0.03, 0.04) * W.h;
    const pts = [x0, y0];
    let x = x0, y = y0;
    while (y < y1) { y += rnd(0.025, 0.06) * W.h; x += rnd(-0.035, 0.035) * W.w; pts.push(x, Math.min(y, y1)); }
    const br = [];
    const k = 2 * (1 + Math.floor(Math.random() * Math.max(1, pts.length / 2 - 2)));
    let bx = pts[k] || x0, by = pts[k + 1] || y0;
    br.push(bx, by);
    const dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < 3; i++) { bx += dir * rnd(0.02, 0.05) * W.w; by += rnd(0.02, 0.05) * W.h; br.push(bx, by); }
    S.bolt = { pts, br, t0: S.clock, dur: 0.42 };
    W.flash = Math.max(W.flash, 0.28 + 0.3 * Math.random());
    const d = rnd(0.4, 1.8);
    setTimeout(() => { if (cur()) { const a = au(); if (a && a.sfx) safe('flood.sfx', () => a.sfx('thunder', { far: d > 1.2 })); } }, d * 1000);
  }
  function drawBolt(ctx) {
    const B = S.bolt;
    if (!B) return;
    const age = S.clock - B.t0;
    if (age > B.dur || age < 0) { S.bolt = null; return; }
    let a = 1 - age / B.dur;
    if (age > 0.08 && age < 0.16) a *= 0.35;
    const line = (pts) => { ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); };
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round';
    ctx.beginPath(); line(B.pts); line(B.br);
    ctx.strokeStyle = U.rgba(150, 170, 255, 0.18 * a); ctx.lineWidth = 7 * uu(); ctx.stroke();
    ctx.strokeStyle = U.rgba(236, 240, 255, 0.95 * a); ctx.lineWidth = 1.6 * uu(); ctx.stroke();
    const sp = glowSprite();
    if (sp) { ctx.globalAlpha = 0.35 * a; ctx.drawImage(sp, B.pts[0] - 0.2 * W.w, B.pts[1] - 0.12 * W.h, 0.4 * W.w, 0.24 * W.h); ctx.globalAlpha = 1; }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 云开处透下的光
  function drawRays(ctx, front) {
    const k = W.lv.flRays * (front ? 0.35 : 1);
    if (k < 0.01) return;
    const up = W.sun.elev > -0.02 && W.lv.lights > 0.5;
    const sx = up ? W.sun.x : W.w * 0.3, sy = up ? Math.max(W.sun.y, -0.1 * W.h) : W.h * 0.06;
    const reach = Math.hypot(W.w, W.h) * 0.9;
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, reach);
    g.addColorStop(0, U.rgba(255, 240, 210, 0));
    g.addColorStop(0.12, U.rgba(255, 238, 200, 0.16 * k));
    g.addColorStop(0.55, U.rgba(255, 232, 190, 0.07 * k));
    g.addColorStop(1, 'rgba(255,230,190,0)');
    ctx.beginPath();
    const base = Math.atan2(W.h - sy, W.w * 0.5 - sx);
    for (let i = 0; i < 7; i++) {
      const a0 = base - 0.75 + i * 0.25 + 0.05 * Math.sin(S.clock * 0.15 + i * 1.7);
      const wdt = 0.035 + 0.03 * hsh(i * 3.3);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + Math.cos(a0 - wdt) * reach, sy + Math.sin(a0 - wdt) * reach);
      ctx.lineTo(sx + Math.cos(a0 + wdt) * reach, sy + Math.sin(a0 + wdt) * reach);
      ctx.closePath();
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  // 虹：横过整个天空；自左脚向右脚铺开；外面一道淡淡的副虹，其间略暗（亚历山大暗带）
  function bowGeom() {
    const hz = W.horizonY;
    const apex = W.h * (W.w < W.h ? 0.16 : 0.1);
    const cy = hz + 0.1 * W.h, cx = W.w * 0.52;
    return { cx, cy, R: cy - apex };
  }
  function drawRainbow(ctx) {
    const a = W.lv.rainbow;
    if (a < 0.004) return;
    const G = bowGeom();
    const k = U.easeInOut(c01((S.clock - S.bowT0) / 5.5));
    if (k <= 0.001) return;
    const vis = a * (0.35 + 0.65 * W.daylight);
    const bw = G.R * 0.07;
    ctx.save();
    ctx.beginPath(); ctx.rect(-10, -10, W.w + 20, W.horizonY + 10); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    // 虹内的天略亮
    const gi = ctx.createRadialGradient(G.cx, G.cy, G.R * 0.55, G.cx, G.cy, G.R - bw * 0.8);
    gi.addColorStop(0, 'rgba(255,250,240,0)');
    gi.addColorStop(1, U.rgba(255, 250, 240, 0.07 * vis));
    ctx.fillStyle = gi;
    ctx.beginPath(); ctx.moveTo(G.cx, G.cy); ctx.arc(G.cx, G.cy, G.R - bw * 0.8, Math.PI, Math.PI + Math.PI * k); ctx.closePath(); ctx.fill();
    const band = (R, w, alpha, rev) => {
      const g = ctx.createRadialGradient(G.cx, G.cy, R - w, G.cx, G.cy, R + w);
      const cols = [[150, 90, 230], [70, 110, 255], [60, 200, 140], [240, 230, 90], [255, 150, 60], [240, 60, 60]];
      if (rev) cols.reverse();
      g.addColorStop(0, 'rgba(0,0,0,0)');
      cols.forEach((c, i) => g.addColorStop(0.14 + i * 0.145, U.rgba(c[0], c[1], c[2], alpha * (i === 0 || i === 5 ? 0.75 : 1))));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2 * w;
      ctx.beginPath(); ctx.arc(G.cx, G.cy, R, Math.PI, Math.PI + Math.PI * k); ctx.stroke();
    };
    band(G.R, bw, 0.3 * vis, false);
    band(G.R * 1.32, bw * 1.25, 0.09 * vis, true);
    ctx.globalCompositeOperation = 'source-over';
    // 两虹之间略暗
    ctx.strokeStyle = U.rgba(20, 24, 40, 0.05 * vis);
    ctx.lineWidth = G.R * 0.2;
    ctx.beginPath(); ctx.arc(G.cx, G.cy, G.R * 1.16, Math.PI, Math.PI + Math.PI * k); ctx.stroke();
    ctx.restore();
  }

  // ── 海：浪花与涌 ────────────────────────────────────────────
  function bandRange(pass) {
    const hz = W.horizonY, w0 = W.waterlineY(0), w1 = W.waterlineY(1);
    if (pass === 'seaFar') return [hz + 1, w0];
    if (pass === 'seaMid') return [w0, w1];
    return [w1, W.h];
  }
  function drawSeaRough(ctx, pass) {
    const k = W.lv.flSea;
    if (k < 0.02) return;
    const r = bandRange(pass);
    const y0 = r[0], y1 = r[1];
    if (y1 - y0 < 2) return;
    const q = W.quality || 1;
    const N = Math.round((pass === 'seaNear' ? 90 : pass === 'seaMid' ? 50 : 36) * q * (0.4 + 0.6 * k));
    const wind = 1 + W.lv.flWind;
    const lit = 0.35 + 0.65 * W.daylight;
    // 暗色的涌
    if (pass === 'seaNear') {
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const yb = y0 + (y1 - y0) * (0.1 + 0.16 * j);
        const s = W.seaScale(yb);
        for (let x = -20; x <= W.w + 20; x += 24) {
          const y = yb + Math.sin(x * 0.012 / s + S.clock * 0.9 * wind + j * 1.9) * 5 * s * k + Math.sin(x * 0.031 + S.clock * 1.7 + j) * 2 * s * k;
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = U.rgba(4, 10, 18, 0.22 * k);
      ctx.lineWidth = 3 * uu();
      ctx.stroke();
    }
    for (let bucket = 0; bucket < 3; bucket++) {
      ctx.beginPath();
      let any = false;
      for (let i = bucket; i < N; i += 3) {
        const yn = Math.pow(hsh(i * 1.71 + (pass === 'seaFar' ? 0 : pass === 'seaMid' ? 50 : 100)), 1.2);
        const y = y0 + (y1 - y0) * yn;
        const s = W.seaScale(y);
        const life = (S.clock * (0.3 + 0.2 * hsh(i * 9.1)) + hsh(i * 5.5)) % 1;
        if (Math.floor(life * 3) !== bucket) continue;
        const x = ((hsh(i * 3.9) * W.w * 1.2 + S.clock * (18 + 30 * hsh(i * 2.2)) * s * wind) % (W.w * 1.2)) - W.w * 0.1;
        const len = (10 + 18 * hsh(i * 6.6)) * s * (0.6 + 0.8 * k);
        ctx.moveTo(x - len / 2, y);
        ctx.quadraticCurveTo(x, y - 2.2 * s, x + len / 2, y);
        any = true;
      }
      if (!any) continue;
      ctx.strokeStyle = W.shadeCSS(FOAM, 0.1, (0.22 + 0.18 * bucket) * k * lit);
      ctx.lineWidth = Math.max(0.8, 1.3 * uu() * (pass === 'seaNear' ? 1 : 0.7));
      ctx.stroke();
    }
    // 雨点落在海面
    const rn = W.lv.rain;
    if (rn > 0.05) {
      ctx.beginPath();
      const n2 = Math.round((pass === 'seaNear' ? 60 : 30) * q * rn);
      for (let i = 0; i < n2; i++) {
        const ph = S.clock * 2.4 + hsh(i * 4.4);
        const cyc = Math.floor(ph), f = ph - cyc;
        const x = hsh(i * 7.7 + cyc * 13.1) * W.w, y = y0 + (y1 - y0) * hsh(i * 3.1 + cyc * 5.9);
        const s = W.seaScale(y);
        const rr = (1 + 5 * f) * s;
        ctx.moveTo(x + rr, y);
        ctx.ellipse(x, y, rr, rr * 0.3, 0, 0, TAU);
      }
      ctx.strokeStyle = W.shadeCSS(FOAM, 0.2, 0.18 * rn * lit);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  // ── 雨 ──────────────────────────────────────────────────────
  function drawRain(ctx) {
    const r = W.lv.rain;
    if (r < 0.01) return;
    const q = W.quality || 1, u = uu();
    const slant = 0.16 + 0.3 * W.lv.flWind + 0.1 * W.wind;
    const day = W.daylight;
    const col = U.mixRGB([110, 122, 150], [206, 214, 228], day);
    for (let layer = 0; layer < 2; layer++) {
      const n = Math.round((layer ? 140 : 200) * q * r) + 6;
      const len = (layer ? 26 : 15) * u, sp = (layer ? 1250 : 820) * u;
      const H = W.h + len;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const hx = hsh(i * 1.37 + layer * 91), hy = hsh(i * 7.91 + layer * 37), hs = 0.8 + 0.4 * hsh(i * 3.17 + layer);
        const yy = hy * H + S.clock * sp * hs;
        const y = (yy % H) - len;
        const x = ((hx * W.w * 1.3 + slant * yy) % (W.w * 1.3)) - W.w * 0.15;
        ctx.moveTo(x, y); ctx.lineTo(x + slant * len, y + len);
      }
      ctx.strokeStyle = rgba(col, (layer ? 0.3 : 0.2) * r * (0.6 + 0.4 * day) + 0.25 * W.flash);
      ctx.lineWidth = (layer ? 1.2 : 0.8) * Math.max(0.8, u);
      ctx.stroke();
    }
  }

  // ── 覆在一切之上的色调（'air' 层）──────────────────────────
  function drawOverlays(ctx) {
    const h = W.lv.flHaze, g = W.lv.flGrief, s = W.lv.storm;
    if (h > 0.01) {
      // 地上满了强暴：烟霾自地面升起，一切蒙上红褐
      const gr = ctx.createLinearGradient(0, W.h * 0.1, 0, W.h);
      gr.addColorStop(0, U.rgba(60, 26, 16, 0.06 * h));
      gr.addColorStop(0.55, U.rgba(70, 30, 18, 0.2 * h));
      gr.addColorStop(1, U.rgba(58, 22, 12, 0.46 * h));
      ctx.fillStyle = gr;
      ctx.fillRect(-20, W.h * 0.1 - 1, W.w + 40, W.h * 0.9 + 21);
    }
    if (g > 0.01) { ctx.fillStyle = U.rgba(16, 24, 42, 0.22 * g); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
    if (s > 0.01) { ctx.fillStyle = U.rgba(6, 8, 14, 0.3 * s); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
    // 稼穑、寒暑、冬夏：一昼一夜之间，世界的色调走过四季
    const su = (S.clock - S.seasonT0) / 14;
    if (su > 0 && su < 1) {
      const c = su < 0.33 ? mix([255, 204, 110], [150, 180, 232], sstep(0.2, 0.33, su))
        : su < 0.66 ? mix([150, 180, 232], [176, 232, 150], sstep(0.53, 0.66, su)) : mix([176, 232, 150], [255, 236, 190], sstep(0.85, 1, su));
      ctx.fillStyle = rgba(c, 0.09 * Math.sin(Math.PI * su));
      ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
    }
  }

  // ── 风（8:1）────────────────────────────────────────────────
  function drawWind(ctx) {
    const k = W.lv.flWind;
    if (k < 0.02) return;
    const u = uu();
    ctx.beginPath();
    const n = Math.round(26 * (W.quality || 1));
    for (let i = 0; i < n; i++) {
      const y = (0.08 + 0.78 * hsh(i * 2.3)) * W.h;
      const len = (0.08 + 0.12 * hsh(i * 4.1)) * W.w;
      const spd = (140 + 160 * hsh(i * 6.7)) * u * (0.5 + k);
      const x = ((hsh(i * 3.3) * 1.6 * W.w + S.clock * spd) % (1.6 * W.w)) - 0.3 * W.w;
      const bend = Math.sin(S.clock * 0.7 + i) * 5 * u;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + len / 2, y - bend, x + len, y + bend * 0.3);
    }
    ctx.strokeStyle = U.rgba(232, 238, 248, 0.14 * k * (0.45 + 0.55 * W.daylight));
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  地上：强暴的烟、蒙恩的光、坛、葡萄园、帐棚、坟
  // ════════════════════════════════════════════════════════════
  let PUFF = null, PUFF_W = null;
  function puffSprite(light) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      const v = light ? [236, 232, 224] : [44, 34, 30];
      gr.addColorStop(0, U.rgba(v[0], v[1], v[2], light ? 0.55 : 0.75));
      gr.addColorStop(0.6, U.rgba(v[0], v[1], v[2], light ? 0.25 : 0.35));
      gr.addColorStop(1, U.rgba(v[0], v[1], v[2], 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      return c;
    } catch (e) { return null; }
  }
  const PLUMES = [0.78, 0.88, 0.96, 0.555];
  function drawPlumes(ctx) {
    const h = W.lv.flHaze;
    if (h < 0.02) return;
    if (!PUFF) PUFF = puffSprite(false);
    const sp = PUFF, wsp = warmSprite();
    if (!sp) return;
    const u = uu();
    for (let p = 0; p < PLUMES.length; p++) {
      const far = p === 3;
      const bx = PLUMES[p] * W.w, by = (far ? gY(bx, 1) : gY(bx)) - (far ? 2 : 6) * u;
      const Hp = W.h * (far ? 0.26 : 0.3 + 0.08 * p);
      const ku = far ? 0.55 : 1;
      if (wsp) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = clamp(h * (0.35 + 0.2 * Math.sin(S.clock * 9 + p * 3) + 0.4 * W.night), 0, 1);
        const fr = (16 + 6 * Math.sin(S.clock * 7 + p)) * u * ku;
        ctx.drawImage(wsp, bx - fr, by - fr * 0.8, fr * 2, fr * 1.4);
        ctx.globalCompositeOperation = 'source-over';
      }
      for (let i = 0; i < 12; i++) {
        const a = (S.clock * 0.06 + i / 12 + p * 0.13) % 1;
        const y = by - a * Hp;
        const x = bx + a * Hp * (0.25 + 0.35 * W.wind) + Math.sin(a * 6 + i + p) * 6 * u;
        const r = (5 + 46 * a) * u * ku;
        ctx.globalAlpha = clamp(h * 0.62 * Math.pow(Math.sin(Math.PI * a), 0.7), 0, 1);
        ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawGrace(ctx) {
    const g = W.lv.flGrace;
    if (g < 0.01) return;
    const x = px('noah');
    if (x == null) return;
    const gy = gY(x);
    const w0 = 0.018 * W.w, w1 = Math.max(0.05 * W.w, 60 * uu());
    const gr = ctx.createLinearGradient(0, 0, 0, gy);
    gr.addColorStop(0, U.rgba(255, 240, 200, 0.03 * g));
    gr.addColorStop(0.6, U.rgba(255, 236, 190, 0.1 * g));
    gr.addColorStop(1, U.rgba(255, 232, 180, 0.2 * g));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x - w0 + 0.02 * W.w, -10); ctx.lineTo(x + w0 + 0.02 * W.w, -10); ctx.lineTo(x + w1 / 2, gy); ctx.lineTo(x - w1 / 2, gy); ctx.closePath();
    ctx.fill();
    const sp = glowSprite();
    if (sp) {
      ctx.globalAlpha = clamp(0.5 * g, 0, 1);
      ctx.drawImage(sp, x - w1 * 0.8, gy - w1 * 0.25, w1 * 1.6, w1 * 0.5);
      ctx.globalAlpha = 1;
    }
    // 光中缓缓落下的微尘
    ctx.fillStyle = U.rgba(255, 244, 214, 0.5 * g);
    for (let i = 0; i < 14; i++) {
      const f = (S.clock * 0.05 + hsh(i * 3.1)) % 1;
      const yy = f * gy, xx = x + 0.02 * W.w * (1 - f) + (hsh(i * 7.3) - 0.5) * lerp(w0 * 2, w1, f) * 0.8;
      const s = 1 + hsh(i) * 1.2;
      ctx.fillRect(xx - s / 2, yy - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 坛：石头一块块垒起；火与笔直上升的烟
  const ALTAR_STONES = [
    [-0.5, 0, 0.26, 0.3], [-0.24, 0, 0.26, 0.32], [0.02, 0, 0.26, 0.3], [0.28, 0, 0.24, 0.31],
    [-0.4, -0.3, 0.28, 0.3], [-0.12, -0.31, 0.27, 0.31], [0.15, -0.3, 0.27, 0.3],
    [-0.3, -0.6, 0.32, 0.26], [0.02, -0.61, 0.3, 0.27],
  ];
  function altarDims() {
    const x = S.altarX * W.w, u = uu() * narrow();
    return { x, y: gY(x) + 1, w: 46 * u, h: 26 * u, u };
  }
  function drawAltar(ctx) {
    const a = W.lv.flAltar;
    if (a < 0.01) return;
    const D = altarDims();
    const n = ALTAR_STONES.length;
    const col = W.shadeCSS(STONE, 0.02), rim = W.shadeCSS(RIMC, 0.02, (0.2 + 0.5 * W.daylight) * 0.8, 0.3);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const k = c01(a * n - i);
      if (k <= 0) continue;
      const s = ALTAR_STONES[i];
      const x0 = D.x + s[0] * D.w, w = s[2] * D.w, hh = s[3] * D.h, y1 = D.y + s[1] * D.h - (1 - k) * 6 * D.u;
      const rr = Math.min(w, hh) * 0.3;
      ctx.moveTo(x0 + rr, y1 - hh);
      ctx.arcTo(x0 + w, y1 - hh, x0 + w, y1, rr);
      ctx.arcTo(x0 + w, y1, x0, y1, rr * 0.4);
      ctx.arcTo(x0, y1, x0, y1 - hh, rr * 0.4);
      ctx.arcTo(x0, y1 - hh, x0 + w, y1 - hh, rr);
      ctx.closePath();
    }
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = U.rgba(0, 0, 0, 0.25); ctx.lineWidth = 0.8;
    ctx.stroke();
    if (a > 0.99) {
      ctx.beginPath(); ctx.moveTo(D.x - 0.3 * D.w, D.y - 0.87 * D.h); ctx.lineTo(D.x + 0.32 * D.w, D.y - 0.88 * D.h);
      ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.stroke();
    }
    const f = W.lv.flFire;
    if (f > 0.02) {
      const top = D.y - 0.88 * D.h;
      const wsp = warmSprite();
      ctx.globalCompositeOperation = 'lighter';
      if (wsp) {
        ctx.globalAlpha = clamp(f * (0.5 + 0.35 * W.night), 0, 1);
        const gr = (26 + 4 * Math.sin(S.clock * 8)) * D.u;
        ctx.drawImage(wsp, D.x - gr, top - gr * 0.9, gr * 2, gr * 1.6);
        ctx.globalAlpha = 1;
      }
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const fx0 = D.x + (i - 2) * 0.12 * D.w, hh = (10 + 7 * Math.sin(S.clock * (7 + i) + i * 2)) * D.u * f;
        ctx.moveTo(fx0 - 3 * D.u, top);
        ctx.quadraticCurveTo(fx0 - 2 * D.u, top - hh * 0.6, fx0 + Math.sin(S.clock * 5 + i) * 2 * D.u, top - hh);
        ctx.quadraticCurveTo(fx0 + 2 * D.u, top - hh * 0.5, fx0 + 3 * D.u, top);
        ctx.closePath();
      }
      ctx.fillStyle = U.rgba(255, 170, 70, 0.75 * f);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawAltarSmoke(ctx) {
    const f = W.lv.flFire;
    if (f < 0.02) return;
    if (!PUFF_W) PUFF_W = puffSprite(true);
    const sp = PUFF_W;
    if (!sp) return;
    const D = altarDims();
    const top = D.y - 0.9 * D.h, Hs = top + 0.02 * W.h;
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = (S.clock * 0.05 + i / n) % 1;
      const y = top - a * Hs;
      const x = D.x + Math.sin(a * 5 + i * 0.7) * 3 * D.u * (1 + a);
      const r = (7 + 36 * a) * D.u;
      ctx.globalAlpha = clamp(f * 0.42 * Math.pow(Math.sin(Math.PI * Math.min(1, a * 1.1)), 0.6), 0, 1);
      ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    // 馨香之气：烟柱顶上的金光
    const gd = W.lv.flGold;
    if (gd > 0.02) {
      const gs = glowSprite();
      if (gs) {
        ctx.globalCompositeOperation = 'lighter';
        const pulse = 1 + 0.08 * Math.sin(S.clock * 1.3);
        const R = Math.max(0.16 * M(), 90 * uu()) * pulse;
        const cy = Math.max(0.1 * W.h, top - Hs * 0.8);
        ctx.globalAlpha = clamp(0.45 * gd, 0, 1);
        ctx.drawImage(warmSprite() || gs, D.x - R, cy - R, R * 2, R * 2);
        ctx.globalAlpha = clamp(0.35 * gd, 0, 1);
        ctx.drawImage(gs, D.x - R * 0.5, cy - R * 0.5, R, R);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }
  // 葡萄园：一行一行的葡萄树（桩、藤、叶、一串串葡萄）
  const VINES = [0.6, 0.63, 0.66, 0.69, 0.72, 0.75, 0.78, 0.81];
  function drawVineyard(ctx) {
    const v = W.lv.flVine;
    if (v < 0.01) return;
    const u = uu() * narrow();
    const cStake = W.shadeCSS([96, 74, 54], 0.02), cLeaf = W.shadeCSS(VINE, 0.02), cGrape = W.shadeCSS(GRAPE, 0.02);
    const cLeafL = W.shadeCSS(mix(VINE, [180, 210, 120], 0.35), 0.02, 0.7 + 0.3 * W.daylight);
    ctx.beginPath();
    for (let i = 0; i < VINES.length; i++) {
      const g = sstep(i * 0.06, i * 0.06 + 0.45, v);
      if (g <= 0) continue;
      const x = VINES[i] * W.w, y = gY(x);
      ctx.moveTo(x, y); ctx.lineTo(x, y - 22 * u * g);
    }
    ctx.strokeStyle = cStake; ctx.lineWidth = 1.4 * u; ctx.stroke();
    ctx.beginPath();
    const leaf = [], grape = [];
    for (let i = 0; i < VINES.length; i++) {
      const g = sstep(i * 0.06 + 0.1, i * 0.06 + 0.55, v);
      if (g <= 0) continue;
      const x = VINES[i] * W.w, y = gY(x);
      ctx.moveTo(x, y); ctx.bezierCurveTo(x - 4 * u, y - 8 * u * g, x + 4 * u, y - 13 * u * g, x, y - 19 * u * g);
      for (let k = 0; k < 4; k++) {
        const lx = x + (k - 1.5) * 4.5 * u * g, ly = y - (15 + 4 * Math.sin(k * 2.1 + i)) * u * g;
        leaf.push(lx, ly, (4 + hsh(i * 4 + k) * 2) * u * g);
      }
      const gg = sstep(0.6, 0.95, v);
      if (gg > 0) { grape.push(x - 3 * u, y - 11 * u, 2.2 * u * gg); grape.push(x + 3.5 * u, y - 12 * u, 2 * u * gg); }
    }
    ctx.strokeStyle = W.shadeCSS([82, 60, 42], 0.02); ctx.lineWidth = 1.8 * u; ctx.stroke();
    ctx.beginPath();
    for (let k = 0; k < leaf.length; k += 3) { ctx.moveTo(leaf[k] + leaf[k + 2], leaf[k + 1]); ctx.ellipse(leaf[k], leaf[k + 1], leaf[k + 2], leaf[k + 2] * 0.8, 0, 0, TAU); }
    ctx.fillStyle = cLeaf; ctx.fill();
    ctx.beginPath();
    for (let k = 0; k < leaf.length; k += 6) { ctx.moveTo(leaf[k] + leaf[k + 2] * 0.5, leaf[k + 1] - leaf[k + 2] * 0.4); ctx.ellipse(leaf[k] - leaf[k + 2] * 0.1, leaf[k + 1] - leaf[k + 2] * 0.4, leaf[k + 2] * 0.5, leaf[k + 2] * 0.35, 0, 0, TAU); }
    ctx.fillStyle = cLeafL; ctx.fill();
    if (grape.length) {
      ctx.beginPath();
      for (let k = 0; k < grape.length; k += 3) {
        const x = grape[k], y = grape[k + 1], r = grape[k + 2];
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
        ctx.moveTo(x + r * 0.8, y + r * 1.4); ctx.arc(x, y + r * 1.4, r * 0.8, 0, TAU);
      }
      ctx.fillStyle = cGrape; ctx.fill();
    }
  }
  function drawTent(ctx) {
    if (S.tentT0 == null) return;
    const t = c01((S.clock - S.tentT0) / 2);
    if (t <= 0.01) return;
    const x = 0.9 * W.w, y = gY(x), u = uu() * narrow();
    const w = 30 * u, h = 20 * u;
    ctx.globalAlpha = t;
    ctx.beginPath();
    ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.7, y - h * 0.9, x - w * 0.25, y - h);
    ctx.lineTo(x + w * 0.35, y - h * 1.02); ctx.quadraticCurveTo(x + w * 0.8, y - h * 0.85, x + w, y);
    ctx.closePath();
    ctx.fillStyle = W.shadeCSS(TENT, 0.02); ctx.fill();
    ctx.fillStyle = W.shadeCSS(DARK, 0.02);
    ctx.beginPath(); ctx.moveTo(x - w * 0.15, y); ctx.lineTo(x - w * 0.02, y - h * 0.62); ctx.lineTo(x + w * 0.12, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = W.shadeCSS(RIMC, 0.02, (0.2 + 0.5 * W.daylight) * 0.8, 0.2); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - w * 0.25, y - h); ctx.lineTo(x + w * 0.35, y - h * 1.02); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawCairn(ctx) {
    const c = S.cairn;
    if (!c) return;
    const k = c01((S.clock - c.t0) / 2.5);
    const x = c.x * W.w, y = gY(x) + 1, u = uu() * narrow();
    ctx.globalAlpha = k;
    ctx.beginPath();
    const st = [[-8, 0, 7, 5], [0, 0, 8, 5.5], [8, 0, 6, 4.5], [-4, -4.5, 6.5, 4.5], [4, -4.8, 6, 4.4], [0, -8.6, 5, 3.8]];
    for (const s of st) { ctx.moveTo(x + (s[0] + s[2] / 2) * u, y + (s[1] - s[3] / 2) * u); ctx.ellipse(x + s[0] * u, y + (s[1] - s[3] / 2) * u, s[2] / 2 * u * 1.1, s[3] / 2 * u, 0, 0, TAU); }
    ctx.fillStyle = W.shadeCSS(STONE, 0.02); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 乌鸦与鸽子 ──────────────────────────────────────────────
  function winPt(out) { const A = arkNow(); return arkPt(A, WINX - 0.05, -0.236, out || [0, 0]); }
  const FP = [];
  function flightPos(f, u, out) {
    // 以 Catmull-Rom 穿过各点；'win' 为窗口（随方舟而动）
    FP.length = 0;
    for (const p of f.pts) { if (p === 'win') { const w = winPt(); FP.push(w[0], w[1]); } else FP.push(p[0] * W.w, p[1] * W.h); }
    const n = FP.length / 2;
    const t = c01(u) * (n - 1);
    const i = Math.min(n - 2, Math.floor(t)), r = t - i;
    const g = k => { const j = clamp(k, 0, n - 1); return j * 2; };
    const a = g(i - 1), b = g(i), c = g(i + 1), d = g(i + 2);
    const cr = (p0, p1, p2, p3) => 0.5 * (2 * p1 + (-p0 + p2) * r + (2 * p0 - 5 * p1 + 4 * p2 - p3) * r * r + (-p0 + 3 * p1 - 3 * p2 + p3) * r * r * r);
    out[0] = cr(FP[a], FP[b], FP[c], FP[d]); out[1] = cr(FP[a + 1], FP[b + 1], FP[c + 1], FP[d + 1]);
    return out;
  }
  const FA = [0, 0], FB = [0, 0];
  function doveReach() {
    let best = 0;
    for (const f of S.flights) {
      if (f.home !== 'win') continue;
      const u = (S.clock - f.t0) / f.dur;
      if (u > 0.82 && u < 1) best = Math.max(best, sstep(0.82, 0.95, u));
    }
    return best;
  }
  function drawFlights(ctx) {
    if (!S.flights.length) return;
    const A = arkNow();
    const s0 = 1.5 * uu() * narrow() * (A.vis ? A.s : 0.8);
    for (const f of S.flights) {
      const u = (S.clock - f.t0) / f.dur;
      if (u < 0 || u >= 1) continue;
      flightPos(f, u, FA);
      flightPos(f, Math.min(1, u + 0.01), FB);
      const dir = FB[0] >= FA[0] ? 1 : -1;
      const K = BIRDK[f.kind];
      let a = sstep(0, 0.04, u);
      if (f.home === 'win') a *= 1 - sstep(0.96, 1, u);
      else a *= 1 - sstep(0.85, 1, u);
      const s = s0 * (f.kind === 'raven' ? 1.15 : 1);
      drawFlyer(ctx, FA[0], FA[1], s, S.clock * (f.kind === 'raven' ? 9 : 12), dir, K.col, a, f.kind === 'dove' ? 0.55 : 0.12);
      // 橄榄叶
      if (f.leafAt != null && u > f.leafAt) {
        const lx = FA[0] + dir * 6.4 * s, ly = FA[1] - 0.4 * s;
        const sp = glowSprite();
        ctx.globalCompositeOperation = 'lighter';
        if (sp) { ctx.globalAlpha = 0.5 * a; ctx.drawImage(sp, lx - 9 * s, ly - 9 * s, 18 * s, 18 * s); }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
        ctx.fillStyle = U.rgb(120, 196, 96);
        ctx.beginPath(); ctx.ellipse(lx + dir * 1.6 * s, ly + 0.9 * s, 2.4 * s, 0.9 * s, dir * 0.5, 0, TAU); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    const k = dt * (W.fast || 1);
    S.clock += k;
    if (!cur()) return;
    ensureLayout();
    // 大地缓缓地沉下 / 升起
    const d = S.drive;
    if (d) {
      let v = W.lt.land;
      v = v < d.goal ? Math.min(d.goal, v + d.rate * k) : Math.max(d.goal, v - d.rate * k);
      W.set('land', v);
      if (v === d.goal) S.drive = null;
    }
    // 方舟停在山上的一刻
    const A = arkNow();
    const g = A.vis && A.mount && !A.float;
    if (g && !S.grounded && !W.replaying && W.t > 1) {
      safe('flood.rest', () => { const c = arkPt(A, 0, 0, T1); fx().dust(c[0], c[1], 26, [220, 226, 236], A.L * 0.35, 'seaNear'); });
      sfx('splash', null, { size: 3 });
    }
    S.grounded = g;
    if (W.replaying) return;
    // 造方舟：锯末与敲打之声
    if (W.lv.arkBuild < W.lt.arkBuild - 0.002 && A.vis) {
      S.buildAcc -= k;
      if (S.buildAcc <= 0) {
        S.buildAcc = 0.32;
        const b = W.lv.arkBuild;
        const j = clamp(Math.floor((b - 0.28) / 0.047), 0, 6);
        const lx = b < 0.3 ? rnd(-0.4, 0.4) * b / 0.3 : b < 0.62 ? -0.52 + 1.04 * c01((b - 0.28 - j * 0.047) / 0.067) : rnd(-0.35, 0.35);
        const ly = b < 0.62 ? -(j + 0.5) * 0.0242 : -0.18 - 0.08 * c01((b - 0.62) / 0.35);
        const p = arkPt(A, clamp(lx, -0.5, 0.5), ly, T1);
        safe('flood.dust', () => fx().dust(p[0], p[1], 5, [214, 184, 140], 6 * uu(), 'near'));
      }
      S.buildSfx -= k;
      if (S.buildSfx <= 0) { S.buildSfx = rnd(0.8, 1.6); sfx('build', null, { soft: true }); }
    }
    // 强暴之地：火星自烟柱底下升起
    if (W.lv.flHaze > 0.5) {
      S.emberAcc = (S.emberAcc || 0) + k * 6 * W.lv.flHaze;
      while (S.emberAcc > 1) {
        S.emberAcc -= 1;
        const bx = PLUMES[Math.floor(Math.random() * 3)] * W.w + rnd(-8, 8) * uu();
        safe('flood.ember', () => fx().add({ x: bx, y: gY(bx) - 8 * uu(), vx: rnd(-10, 14), vy: -rnd(30, 70) * uu(), max: rnd(1.2, 2.6), size: rnd(0.7, 1.5), c: [255, 150, 70], drag: 0.5, a: 0.8, pass: 'near', twinkle: true }));
      }
    }
    // 忧伤：几滴冷的微光缓缓落下
    if (W.lv.flGrief > 0.25 && W.lt.flGrief > 0.5) {
      S.griefAcc += k * 5;
      while (S.griefAcc > 1) {
        S.griefAcc -= 1;
        safe('flood.grief', () => fx().add({ x: rnd(0, W.w), y: rnd(-10, W.h * 0.3), vx: 0, vy: rnd(18, 40) * uu(), max: rnd(3, 6), size: rnd(0.7, 1.5), c: [200, 214, 240], drag: 0, a: 0.5, pass: 'air' }));
      }
    }
    // 大渊的泉源裂开：海上喷起水柱
    for (const j of S.jets) {
      const t = S.clock - j.t0;
      if (t < 0 || t > j.dur) continue;
      const n = Math.max(1, Math.round(3 * (W.quality || 1)));
      const pass = W.seaBand(j.y);
      for (let i = 0; i < n; i++) {
        safe('flood.jet', () => fx().add({ x: j.x + rnd(-3, 3) * j.s, y: j.y, vx: rnd(-22, 22) * j.s, vy: -rnd(170, 330) * j.s * (1 - 0.4 * t / j.dur),
          max: rnd(1.1, 1.8), size: rnd(1.2, 2.8) * Math.max(0.6, j.s), c: [170, 196, 222], drag: 0.6, grav: 300 * j.s, a: 0.55, pass }));
      }
    }
    // 闪电
    if (W.lv.storm > 0.6 && W.lv.rain > 0.3 && W.lt.storm > 0.6 && !W.reduced) {
      if (S.clock > S.nextBolt) {
        S.nextBolt = S.clock + rnd(2.2, 6.5) / Math.max(0.5, W.lv.storm);
        if (S.nextBolt - S.clock < 30) makeBolt();
      }
    } else S.nextBolt = Math.max(S.nextBolt, S.clock + 1.5);
    // 飞完了的鸟
    for (let i = S.flights.length - 1; i >= 0; i--) if (S.clock - S.flights[i].t0 > S.flights[i].dur + 0.5) S.flights.splice(i, 1);
  }

  function drawUnder(ctx, pass) {
    if (!cur()) return;
    if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawSeaRough(ctx, pass);
    else if (pass === 'near') {
      drawVineyard(ctx);
      drawTent(ctx);
      drawCairn(ctx);
      drawPlumes(ctx);
      drawGrace(ctx);
    }
  }
  function draw(ctx, pass) {
    if (!cur()) return;
    ensureLayout();
    if (pass === 'sky') {
      drawSkyTints(ctx);
      drawStormSky(ctx);
      drawRays(ctx, false);
      drawRainbow(ctx);
      drawBolt(ctx);
    } else if (pass === 'seaNear') {
      drawMountain(ctx);
      const A = arkNow();
      if (A.vis && A.mount) drawArk(ctx, A);
    } else if (pass === 'near') {
      const A = arkNow();
      if (A.vis && !A.mount) drawArk(ctx, A);
      drawEnter(ctx);
      drawExit(ctx);
      drawAltar(ctx);
      drawAltarSmoke(ctx);
    } else if (pass === 'air') {
      drawOverlays(ctx);
      drawLamp(ctx);
      drawRays(ctx, true);
      drawWind(ctx);
      drawFlights(ctx);
      drawRain(ctx);
    }
  }

  function pick(x, y, r) {
    if (!cur()) return null;
    let best = null;
    const test = (label, cx, cy, top, rad) => {
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - (rad || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: cx, y: top, d };
    };
    const A = arkNow();
    if (A.vis && W.lv.arkBuild > 0.3) { const c = arkPt(A, 0, -0.14, T1); test('方舟', c[0], c[1], A.y - 0.3 * A.L, 0.3 * A.L); }
    if (W.lv.ararat > 0.3 && MT.ok) test('亚拉腊山', MT.xg, surfY(MT.xg) + 0.2 * MT.Hm, surfY(MT.xg), 0.12 * MT.Hm);
    if (W.lv.flAltar > 0.5) { const D = altarDims(); test('祭坛', D.x, D.y - D.h * 0.5, D.y - D.h, D.w * 0.4); }
    if (W.lv.flVine > 0.4) { const vx = 0.71 * W.w, vy = gY(vx) - 14 * uu(); test('葡萄园', vx, vy, vy - 14 * uu(), 0.08 * W.w); }
    if (S.tentT0 != null) { const tx = 0.9 * W.w, ty = gY(tx) - 10 * uu(); test('帐棚', tx, ty, ty - 12 * uu(), 18 * uu()); }
    if (S.cairn) { const cx = S.cairn.x * W.w, cy = gY(cx) - 5; test('挪亚的坟', cx, cy, cy - 8, 6); }
    if (W.lv.rainbow > 0.3 && y < W.horizonY) {
      const G = bowGeom();
      const dd = Math.abs(Math.hypot(x - G.cx, y - G.cy) - G.R);
      if (dd < r && y < G.cy && (!best || dd < best.d)) best = { label: '虹', x, y: y - 10, d: dd };
    }
    for (const f of S.flights) {
      const u = (S.clock - f.t0) / f.dur;
      if (u < 0 || u >= 1) continue;
      flightPos(f, u, FA);
      test(BIRDK[f.kind].cn, FA[0], FA[1], FA[1] - 8, 0);
    }
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function spiritRing(c, rgb) { if (!c.instant) safe('flood.ring', () => fx().ring(c.x, c.y, rgb || TINT, M() * 0.3, 1.8, 1.5)); }
  function famAdd(f, o) {
    cast().add(f.id, Object.assign({ label: f.label, sex: f.sex, age: f.age || 'adult', layer: 2, x: f.x, facing: 1, robe: ROBE[f.id], glow: f.glow == null ? 0.3 : f.glow, from: 'none', v: 0 }, o || {}));
  }
  const arkHalf = () => (0.5 * arkLen()) / Math.max(1, W.w);
  function arkSite(x) {
    const hf = arkHalf();
    const lo = Math.max(0.4 + hf, 0.5), hi = Math.max(lo, Math.min(0.97 - hf, 0.72));
    return clamp(x, lo, hi);
  }
  function footFrac() { const A = arkNow(); if (!A.vis) return S.arkX; return rampFoot(A, T2)[0] / W.w; }
  function allPops(n, x, y, instant) {
    const k = n ? 1 : 0;
    W.setPop('cattle', 9 * k, x, y, instant);
    W.setPop('beast', 8 * k, x, y, instant);
    W.setPop('creeper', 30 * k, x, y, instant);
  }
  function makeJets() {
    const out = [];
    for (let k = 0; k < 40 && out.length < 8; k++) {
      const x = rnd(0.02, 0.98) * W.w, y = W.horizonY + rnd(0.03, 0.4) * W.h;
      if (!W.isSea(x, y)) continue;
      out.push({ x, y, t0: S.clock + out.length * 1.1 + rnd(0, 0.6), dur: rnd(1.6, 2.8), s: W.seaScale(y) });
    }
    return out;
  }
  function addFlight(kind, pts, dur, b, o) {
    if (inst(b)) return;
    S.flights.push(Object.assign({ kind, pts, dur, t0: S.clock, home: pts[pts.length - 1] === 'win' ? 'win' : 'away', leafAt: null }, o || {}));
    if (kind === 'dove') sfx('dove', b, { soft: true });
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, title: '洪水', sub: '创世记 6:1 — 9:29', tint: TINT,
    intro: [{ text: '当人在世上多起来，又生女儿的时候，<br>神的儿子们看见人的女子美貌，就随意挑选，娶来为妻。', ref: '创世记 6:1–2', hold: 8 }],
    outro: 20,
    setup() {
      S = fresh();
      ensureLayout();
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.55, land: 1, grass: 1, herbs: 1, trees: 1,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      for (const k of MY) W.set(k, 0, true);
      W.set('flHaze', 0.3, true);
      const ox = W.w * 0.72, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
      W.freeClock = false;
      W.goTo(0.52, 0, true);
      W.setPop('fish', 140, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 3, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 40, W.w * 0.6, W.h * 0.3, true);
      allPops(1, W.w * 0.82, W.ridgeBaseY(2, W.w * 0.82), true);
      W.setPop('human', 0, ox, oy, true);
      cast().clear({ fade: false });
      for (const f of FAM) famAdd(f);
      cast().crowd('fl:men', { n: 10, x0: 0.72, x1: 0.98, layer: 2, label: '世人', from: 'none' });
      cast().crowd('fl:mob', { n: 6, x0: 0.54, x1: 0.68, layer: 2, label: '世人', from: 'none' });
    },
    stages: [
      // ── 6:3–12 败坏与强暴 ──────────────────────────────────
      {
        kind: 'judge', utter: '我的灵就不永远住在他里面', cmd: 'ulimit -t 120年 人  # 属乎血气', ref: '6:3',
        verse: [
          { text: '耶和华说：「人既属乎血气，我的灵就不永远住在他里面；<br>然而他的日子还可到一百二十年。」', ref: '创世记 6:3', hold: 8 },
          { text: '耶和华见人在地上罪恶很大，<br>终日所思想的尽都是恶，', ref: '创世记 6:5', hold: 6 },
          { text: '世界在神面前败坏，地上满了强暴。', ref: '创世记 6:11', hold: 5.5 },
        ],
        apply(c) {
          spiritRing(c, [220, 200, 190]);
          TL(c, [
            [0, b => {
              lv('flHaze', 1, b);
              time(0.64, 12, b);
              const o = { layer: 2, label: '世人', from: 'fade' };
              cast().add('fl:w1a', Object.assign({}, o, { x: 0.79, facing: 1, pose: 'wrestle', robe: [120, 76, 58] }));
              cast().add('fl:w1b', Object.assign({}, o, { x: 0.808, facing: -1, pose: 'wrestle', robe: [98, 84, 74] }));
              cast().add('fl:fall', Object.assign({}, o, { x: 0.86, facing: -1, pose: 'fall', robe: [130, 110, 92] }));
              cast().add('fl:t1', Object.assign({}, o, { x: 0.905, facing: -1, pose: 'raise', prop: 'torch', robe: [110, 70, 52] }));
              cast().crowdPose('fl:mob', 'point');
              sfx('crowd', b);
            }],
            [5, b => {
              const o = { layer: 2, label: '世人', from: 'fade' };
              cast().add('fl:w2a', Object.assign({}, o, { x: 0.93, facing: 1, pose: 'wrestle', robe: [136, 96, 70] }));
              cast().add('fl:w2b', Object.assign({}, o, { x: 0.948, facing: -1, pose: 'wrestle', robe: [104, 92, 110] }));
              cast().add('fl:t2', Object.assign({}, o, { x: 0.74, facing: 1, pose: 'raise', prop: 'torch', robe: [120, 88, 60] }));
              cast().crowdWalk('fl:men', 0.7, 0.98, { speed: 0.05 });
              sfx('fire', b, { soft: true });
            }],
            [11, b => { cast().crowdPose('fl:mob', 'raise'); }],
          ]);
        },
      },

      // ── 6:6–10 忧伤与蒙恩 ──────────────────────────────────
      {
        kind: 'judge', utter: '我造他们后悔了', cmd: 'git revert 1:26 && git cherry-pick 挪亚', ref: '6:6–8',
        verse: [
          { text: '耶和华就后悔造人在地上，心中忧伤。', ref: '创世记 6:6', hold: 5.5 },
          { text: '耶和华说：「我要将所造的人和走兽，并昆虫，<br>以及空中的飞鸟，都从地上除灭，因为我造他们后悔了。」', ref: '创世记 6:7', hold: 8 },
          { text: '惟有挪亚在耶和华眼前蒙恩。', ref: '创世记 6:8', hold: 5.5 },
          { text: '挪亚是个义人，在当时的世代是个完全人。挪亚与神同行。<br>挪亚生了三个儿子，就是闪、含、雅弗。', ref: '创世记 6:9–10', hold: 8 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('flGrief', 1, b);
              lv('flHaze', 0.85, b);
              lv('clouds', 0.85, b);
              time(0.71, 15, b);
              sfx('wind', b, { soft: true });
            }],
            [15.5, b => {
              lv('flGrace', 1, b);
              if (!inst(b)) S.graceT0 = S.clock;
              cast().glow('noah', 0.95);
              cast().pose('noah', 'gaze');
              for (const f of FAM) if (f.id !== 'noah') cast().face(f.id, 'noah');
              if (!inst(b)) { const x = px('noah'); if (x != null) fx().sparkle(x, gY(x) - 30 * uu(), 30, [255, 240, 205], 18 * uu(), 'near'); }
              sfx('harp', b);
            }],
            [21, b => {
              cast().pose('noah', 'pray');
              cast().walk('noahW', 0.412, { pose: 'stand' });
              cast().walk('shem', 0.448, { pose: 'stand' });
              cast().walk('japheth', 0.475, { pose: 'stand' });
            }],
          ]);
        },
      },

      // ── 6:13–22 方舟 ────────────────────────────────────────
      {
        kind: 'cmd', utter: '你要用歌斐木造一只方舟', cmd: 'build 方舟 --wood 歌斐木 --size 300x50x30肘', ref: '6:14',
        verse: [
          { text: '神就对挪亚说：「凡有血气的人，他的尽头已经来到我面前；<br>因为地上满了他们的强暴，我要把他们和地一并毁灭。', ref: '创世记 6:13', hold: 8 },
          { text: '你要用歌斐木造一只方舟，里面要有一间一间的，<br>里外抹上松香。', ref: '创世记 6:14', hold: 6.5 },
          { text: '方舟的造法乃是这样：要长三百肘，宽五十肘，高三十肘。<br>方舟上边要留透光处，高一肘。方舟的门要开在旁边。<br>方舟要分上、中、下三层。', ref: '创世记 6:15–16', hold: 9.5 },
          { text: '挪亚就这样行。凡神所吩咐的，他都照样行了。', ref: '创世记 6:22', hold: 6 },
        ],
        apply(c) {
          const x = arkSite(c.choice && c.choice.x != null ? c.choice.x : c.x / Math.max(1, W.w));
          spiritRing(c, [255, 226, 180]);
          TL(c, [
            [0, b => {
              S.arkX = x;
              setArk({ a: 'ground', x, s: 1 }, 0, b);
              lv('arkBuild', 1, b);
              lv('flGrace', 0.3, b);
              lv('flGrief', 0.45, b);
              lv('flHaze', 0.45, b);
              cast().glow('noah', 0.55);
              W.passDay(24, inst(b));
              for (const id of EXTRAS) cast().walk(id, 1.12, { speed: 0.05 });
              cast().crowdWalk('fl:mob', 0.84, 0.99, { speed: 0.05 });
              cast().crowdWalk('fl:men', 0.86, 0.99, { speed: 0.04 });
              const hf = arkHalf();
              cast().prop('shem', 'wood'); cast().prop('ham', 'wood'); cast().prop('japheth', 'wood');
              cast().walk('shem', x - hf + 0.05, { pose: 'carry', speed: 0.05 });
              cast().walk('ham', x - 0.02, { pose: 'carry', speed: 0.05 });
              cast().walk('japheth', x + hf - 0.05, { pose: 'carry', speed: 0.05 });
              cast().walk('noah', x - hf - 0.02, { pose: 'point', speed: 0.04 });
              if (!inst(b)) fx().dust(x * W.w, gY(x * W.w), 30, [214, 184, 140], arkLen() * 0.3);
            }],
            [6, b => { cast().pose('shem', 'raise'); cast().pose('ham', 'raise'); cast().pose('japheth', 'raise'); }],
            [8, b => { for (const id of EXTRAS) cast().remove(id); }],
            [10, b => {
              // 夜里：地上的走兽散去（它们将一对一对地来到方舟）
              allPops(0, W.w * 0.8, W.h * 0.8, true);
              W.setPop('bird', 24, W.w * 0.6, W.h * 0.3, true);
              GS.book.resync();
            }],
            [11, b => {
              const hf = arkHalf();
              cast().walk('shem', x - hf * 0.4, { pose: 'raise', speed: 0.04 });
              cast().walk('japheth', x + hf * 0.5, { pose: 'raise', speed: 0.04 });
              cast().pose('ham', 'carry');
              cast().prop('shemW', 'jar'); cast().prop('hamW', 'jar');
            }],
            [16, b => { cast().pose('ham', 'raise'); cast().pose('shem', 'carry'); }],
            [19.5, b => { lv('arkPitch', 1, b); cast().pose('japheth', 'stand'); }],
            [24, b => {
              const hf = arkHalf();
              for (const id of ['shem', 'ham', 'japheth']) cast().prop(id, null);
              cast().prop('shemW', null); cast().prop('hamW', null);
              cast().walk('shem', x - hf - 0.05, { pose: 'stand', speed: 0.04 });
              cast().walk('ham', x - hf - 0.075, { pose: 'stand', speed: 0.04 });
              cast().walk('japheth', x - hf - 0.028, { pose: 'stand', speed: 0.04 });
              cast().pose('noah', 'stand');
            }],
          ]);
          return { x: +x.toFixed(4) };
        },
      },

      // ── 6:19–20 · 7:8–9 一对一对 ───────────────────────────
      {
        kind: 'cmd', utter: '每样两个，一公一母', cmd: 'for (类 of 活物) 方舟.push(公, 母)', ref: '6:19',
        verse: [
          { text: '凡有血肉的活物，每样两个，一公一母，<br>你要带进方舟，好在你那里保全生命。', ref: '创世记 6:19', hold: 7 },
          { text: '飞鸟各从其类，牲畜各从其类，地上的昆虫各从其类，<br>每样两个，要到你那里，好保全生命。', ref: '创世记 6:20', hold: 7.5 },
          { text: '洁净的畜类和不洁净的畜类，飞鸟并地上一切的昆虫，<br>都是一对一对的，有公有母，<br>到挪亚那里进入方舟，正如神所吩咐挪亚的。', ref: '创世记 7:8–9', hold: 9 },
        ],
        apply(c) {
          spiritRing(c, [255, 236, 200]);
          TL(c, [
            [0, b => {
              lv('arkBuild', 1, b); lv('arkPitch', 1, b);
              lv('arkDoor', 1, b); lv('arkRamp', 1, b);
              lv('flGrace', 0, b);
              lv('flGrief', 0.3, b); lv('flHaze', 0.35, b);
              time(0.5, 10, b);
              const f = footFrac();
              cast().add('noah', { v: 0.12 });
              cast().walk('noah', f + 0.03, { pose: 'raise', speed: 0.05 });
              S.proc = inst(b) ? null : { t0: S.clock, list: makeProc() };
              sfx('gate', b);
            }],
            [3, b => { sfx('bleat', b, { soft: true }); cast().crowdPose('fl:men', 'point'); }],
            [11, b => { sfx('camel', b, { soft: true }); cast().crowdPose('fl:men', 'stand'); }],
            [34, b => { S.proc = null; cast().pose('noah', 'stand'); }],
          ]);
        },
      },

      // ── 7:1–7 全家进入方舟 ─────────────────────────────────
      {
        kind: 'cmd', utter: '你和你的全家都要进入方舟', cmd: 'mv 挪亚 妻 闪 含 雅弗 儿妇×3 方舟/', ref: '7:1',
        verse: [
          { text: '耶和华对挪亚说：「你和你的全家都要进入方舟，<br>因为在这世代中，我见你在我面前是义人。', ref: '创世记 7:1', hold: 7 },
          { text: '挪亚就同他的妻和儿子、儿妇，都进入方舟，躲避洪水。', ref: '创世记 7:7', hold: 6.5 },
        ],
        apply(c) {
          const order = ['japhethW', 'japheth', 'hamW', 'ham', 'shemW', 'shem', 'noahW', 'noah'];
          const beats = [
            [0, b => {
              S.proc = null;
              lv('arkDoor', 1, b); lv('arkRamp', 1, b);
              time(0.58, 12, b);
              const f = footFrac();
              order.forEach((id, i) => {
                const P = { japhethW: 'jar', hamW: 'jar', shemW: 'jar', japheth: 'bundle', ham: 'bundle', shem: 'bundle' }[id];
                if (P) cast().prop(id, P);
                cast().add(id, { v: 0 });
                cast().walk(id, f + 0.012 + i * 0.013, { pose: 'stand', speed: 0.065 });
              });
            }],
          ];
          order.forEach((id, i) => {
            const tb = 4.8 + i * 1.25;
            beats.push([tb, b => {
              if (inst(b)) { attach(id, null); cast().remove(id); return; }
              const p = person(id);
              const sx = p ? p.nx * W.w : footFrac() * W.w;
              cast().face(id, -1);
              cast().pose(id, 'walk', { stop: true });
              attach(id, rampFn(S.clock, 2.6, sx));
            }]);
            beats.push([tb + 2.75, b => { cast().remove(id); }]);
          });
          beats.push([16, b => { lv('flLamp', 1, b); for (const id of order) { attach(id, null); cast().remove(id); } }]);
          TL(c, beats);
        },
      },

      // ── 7:15–16 门关上了 ────────────────────────────────────
      {
        kind: 'act', utter: '耶和华就把他关在方舟里头', cmd: 'lock 方舟.门 --by 耶和华', ref: '7:16', hold: 3,
        verse: [
          { text: '凡有血肉、有气息的活物，都是一对一对的到挪亚那里，进入方舟。<br>凡有血肉进入方舟的，都是有公有母，正如神所吩咐挪亚的。<br>耶和华就把他关在方舟里头。', ref: '创世记 7:15–16', hold: 10 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              for (const f of FAM) { attach(f.id, null); cast().remove(f.id); }
              lv('flLamp', 1, b);
              lv('arkRamp', 0, b);
              lv('storm', 0.3, b);
              lv('clouds', 1, b);
              time(0.66, 9, b);
              cast().crowdPose('fl:men', 'gaze');
            }],
            [1.4, b => {
              lv('arkDoor', 0, b);
              S.sealT0 = inst(b) ? -1e9 : S.clock + 1.2;
            }],
            [2.8, b => {
              sfx('seal', b);
              if (!inst(b)) {
                W.shake = Math.max(W.shake, 0.4);
                const A = arkNow();
                if (A.vis) { const p = arkPt(A, DX, (DTOP + SILL) / 2, T1); fx().ring(p[0], p[1], [255, 226, 170], M() * 0.28, 2.2, 2); }
              }
            }],
            [5.5, b => { sfx('thunder', b, { far: true, soft: true }); cast().crowdPose('fl:mob', 'stand'); }],
          ]);
        },
      },

      // ── 7:4 · 7:10–12 四十昼夜的雨 ─────────────────────────
      {
        kind: 'judge', utter: '我要降雨在地上四十昼夜', cmd: 'while (日 < 40) 降雨(地)', ref: '7:4',
        verse: [
          { text: '过了那七天，洪水泛滥在地上。<br>当挪亚六百岁，二月十七日那一天，<br>大渊的泉源都裂开了，天上的窗户也敞开了，', ref: '创世记 7:10–11', hold: 9 },
          { text: '四十昼夜降大雨在地上。', ref: '创世记 7:12', hold: 5 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('storm', 1, b); lv('rain', 0.45, b); lv('flSea', 0.8, b);
              lv('flHaze', 0, b); lv('flGrief', 0, b); lv('flGrace', 0, b);
              lv('arkDoor', 0, b); lv('arkRamp', 0, b); lv('flLamp', 1, b);
              time(0.74, 10, b);
              S.jets = inst(b) ? [] : makeJets();
              if (!inst(b)) { W.flash = Math.max(W.flash, 0.5); W.shake = 1; }
              sfx('thunder', b);
            }],
            [3, b => { lv('rain', 1, b); sfx('rain', b); }],
            [6.5, b => {
              // 在暴雨的昏暗里，世人与地上的走兽、空中的飞鸟都隐去了
              cast().removeCrowd('fl:men'); cast().removeCrowd('fl:mob');
              for (const id of EXTRAS) cast().remove(id);
              allPops(0, W.w * 0.8, W.h * 0.8, true);
              W.setPop('bird', 0, W.w * 0.5, W.h * 0.3, true);
              GS.book.resync();
            }],
            [12, b => { S.jets = []; }],
          ]);
        },
      },

      // ── 7:17–24 水往上长 ────────────────────────────────────
      {
        kind: 'act', utter: '水往上长，把方舟从地上漂起', cmd: 'raise 水 --by 十五肘 && 方舟.float()', ref: '7:17',
        verse: [
          { text: '洪水泛滥在地上四十天，水往上长，把方舟从地上漂起。', ref: '创世记 7:17', hold: 6.5 },
          { text: '水势浩大，在地上大大地往上长，方舟在水面上漂来漂去。<br>水势在地上极其浩大，天下的高山都淹没了。', ref: '创世记 7:18–19', hold: 8 },
          { text: '凡地上各类的活物，连人带牲畜、昆虫，以及空中的飞鸟，<br>都从地上除灭了，只留下挪亚和那些与他同在方舟里的。', ref: '创世记 7:23', hold: 8.5 },
          { text: '水势浩大，在地上共一百五十天。', ref: '创世记 7:24', hold: 5.5 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('storm', 1, b); lv('rain', 1, b); lv('flSea', 1, b); lv('flLamp', 1, b);
              const A = arkNow();
              const y = A.vis ? A.y / W.h - 0.012 : 0.84;
              setArk({ a: 'sea', x: A.vis ? A.x / W.w : S.arkX, y, s: 1 }, 5, b);
              driveLand(0, 0.05, b);
              if (!inst(b)) W.shake = Math.max(W.shake, 0.6);
              sfx('splash', b, { size: 4 });
            }],
            [8, b => {
              const A = arkNow();
              setArk({ a: 'sea', x: 0.42, y: A.vis ? A.y / W.h : 0.84, s: 1 }, 16, b);
            }],
            [16.5, b => { W.set('grass', 0, true); W.set('herbs', 0, true); W.set('trees', 0, true); }],
            [18, b => { W.passDay(12, inst(b)); }],
            [26, b => { const A = arkNow(); setArk({ a: 'sea', x: 0.52, y: A.vis ? A.y / W.h : 0.84, s: 1 }, 12, b); }],
            [31, b => { W.passDay(12, inst(b)); }],
          ]);
        },
      },

      // ── 8:1–5 神纪念挪亚 ───────────────────────────────────
      {
        kind: 'act', utter: '神纪念挪亚', cmd: 'remember 挪亚 && wind.blow(地)', ref: '8:1', hold: 2.4,
        verse: [
          { text: '神纪念挪亚和挪亚方舟里的一切走兽牲畜。<br>神叫风吹地，水势渐落。', ref: '创世记 8:1', hold: 7 },
          { text: '渊源和天上的窗户都闭塞了，天上的大雨也止住了。<br>水从地上渐退。过了一百五十天，水就渐消。', ref: '创世记 8:2–3', hold: 8 },
          { text: '七月十七日，方舟停在亚拉腊山上。', ref: '创世记 8:4', hold: 5.5 },
          { text: '水又渐消，到十月初一日，山顶都现出来了。', ref: '创世记 8:5', hold: 6 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              W.set('grass', 0, true); W.set('herbs', 0, true); W.set('trees', 0, true);
              driveLand(0, 0.06, b);
              lv('flWind', 1, b); lv('rain', 0.4, b); lv('storm', 0.7, b); lv('flLamp', 1, b);
              time(0.3, 12, b);
              if (!inst(b)) {
                const A = arkNow();
                if (A.vis) { const p = arkPt(A, 0, -0.15, T1); fx().ring(p[0], p[1], [255, 236, 196], M() * 0.45, 2.6, 2); fx().sparkle(p[0], p[1], 40, [255, 240, 210], A.L * 0.3, 'air'); }
              }
              sfx('wind', b);
            }],
            [7.5, b => { lv('rain', 0, b); lv('storm', 0.22, b); lv('flSea', 0.35, b); lv('flRays', 1, b); lv('clouds', 0.7, b); }],
            [9, b => {
              lv('ararat', 0.6, b);
              setArk({ a: 'mount', s: 1 }, 12, b);
            }],
            [21, b => { lv('flWind', 0.35, b); }],
            [24, b => { driveLand(0.3, 0.03, b); lv('flRays', 0.55, b); }],
          ]);
        },
      },

      // ── 8:6–12 乌鸦与鸽子 ──────────────────────────────────
      {
        kind: 'act', utter: '地上的水退了', cmd: 'ping -c 3 鸽子  # 橄榄叶 · 200 OK', ref: '8:6–12',
        verse: [
          { text: '过了四十天，挪亚开了方舟的窗户，放出一只乌鸦去；<br>那乌鸦飞来飞去，直到地上的水都干了。', ref: '创世记 8:6–7', hold: 7 },
          { text: '他又放出一只鸽子去，要看看地上的水退了没有。<br>但遍地上都是水，鸽子找不着落脚之地，<br>就回到方舟挪亚那里，挪亚伸手把鸽子接进方舟来。', ref: '创世记 8:8–9', hold: 9 },
          { text: '他又等了七天，再把鸽子从方舟放出去。<br>到了晚上，鸽子回到他那里，嘴里叼着一个新拧下来的橄榄叶子，<br>挪亚就知道地上的水退了。', ref: '创世记 8:10–11', hold: 9.5 },
          { text: '他又等了七天，放出鸽子去，鸽子就不再回来了。', ref: '创世记 8:12', hold: 6 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('ararat', 0.62, b); lv('flWind', 0.2, b); lv('flSea', 0.2, b); lv('storm', 0.12, b); lv('rain', 0, b);
              lv('flRays', 0.4, b);
              setArk({ a: 'mount', s: 1 }, 0, b);
              lv('arkWin', 1, b);
              S.noahWin = true;
              time(0.45, 8, b);
              addFlight('raven', ['win', [0.62, 0.3], [0.3, 0.2], [0.46, 0.12], [0.16, 0.3], [0.3, 0.1], [-0.12, 0.22]], 9.5, b);
            }],
            [9, b => { addFlight('dove', ['win', [0.5, 0.26], [0.2, 0.36], [0.1, 0.5], [0.3, 0.55], [0.5, 0.36], 'win'], 8.5, b); }],
            [18.5, b => {
              time(0.745, 8, b);
              lv('ararat', 0.78, b);
              driveLand(0.46, 0.03, b);
              addFlight('dove', ['win', [0.4, 0.22], [0.1, 0.28], [-0.1, 0.34], [0.12, 0.4], [0.42, 0.3], 'win'], 9.5, b, { leafAt: 0.48 });
            }],
            [28.2, b => {
              if (!inst(b)) { const w = winPt(); fx().sparkle(w[0], w[1], 26, [170, 240, 150], 10 * uu(), 'air'); }
              sfx('harp', b, { soft: true });
            }],
            [30, b => {
              time(0.36, 6, b);
              addFlight('dove', ['win', [0.45, 0.24], [0.2, 0.18], [-0.12, 0.26]], 7, b);
            }],
            [34, b => { driveLand(0.62, 0.03, b); lv('ararat', 0.88, b); }],
          ]);
        },
      },

      // ── 8:13–20 出方舟 ──────────────────────────────────────
      {
        kind: 'cmd', utter: '你和你的妻子、儿子、儿妇都可以出方舟', cmd: 'exit 0  # 出方舟，各从其类', ref: '8:16',
        verse: [
          { text: '神对挪亚说：「你和你的妻子、儿子、儿妇都可以出方舟。', ref: '创世记 8:15–16', hold: 6.5 },
          { text: '在你那里凡有血肉的活物，就是飞鸟、牲畜，和一切爬在地上的昆虫，<br>都要带出来，叫它在地上多多滋生，大大兴旺。」', ref: '创世记 8:17', hold: 8.5 },
          { text: '于是挪亚和他的妻子、儿子、儿妇都出来了。<br>一切走兽、昆虫、飞鸟，和地上所有的动物，各从其类，也都出了方舟。', ref: '创世记 8:18–19', hold: 8.5 },
          { text: '挪亚为耶和华筑了一座坛，<br>拿各类洁净的牲畜、飞鸟献在坛上为燔祭。', ref: '创世记 8:20', hold: 7 },
        ],
        apply(c) {
          spiritRing(c, [220, 250, 200]);
          const walkDur = 7.5;
          const beats = [
            [0, b => {
              S.flights = inst(b) ? [] : S.flights;
              time(0.4, 7, b);
              lv('storm', 0, b); lv('rain', 0, b); lv('flSea', 0, b); lv('flWind', 0.15, b); lv('flRays', 0.25, b); lv('clouds', 0.35, b);
              driveLand(1, 0.08, b);
              lv('ararat', 1, b);
              setArk({ a: 'mount', s: 1 }, 0, b);
              lv('arkWin', 0, b);
              S.noahWin = false;
              S.altarX = clamp(exitEndX() / W.w - 0.13, 0.42, 0.52);
            }],
            [2.5, b => {
              const xe = exitEndX(), ye = W.ridgeBaseY(2, xe);
              W.setOrigin('grass', xe, ye); W.setOrigin('herbs', xe, ye); W.setOrigin('trees', xe, ye);
              lv('grass', 1, b); lv('herbs', 1, b); lv('trees', 0.35, b);
              if (!inst(b)) fx().sparkle(xe, ye - 6, 40, [200, 255, 190], 30 * uu(), 'near');
            }],
            [4, b => { lv('arkDoor', 1, b); lv('arkRamp', 1, b); sfx('gate', b); }],
            [9, b => {
              const w = winPt();
              W.setPop('bird', 40, w[0], w[1], inst(b));
              if (!inst(b)) fx().sparkle(w[0], w[1], 30, [255, 252, 240], 16 * uu(), 'air');
            }],
            [13, b => { S.exit = inst(b) ? null : { t0: S.clock, list: makeExit() }; sfx('bleat', b, { soft: true }); }],
            [17, b => { const xe = exitEndX(); allPops(1, xe, W.ridgeBaseY(2, xe), inst(b)); }],
            [30, b => { S.exit = null; }],
          ];
          FAM.forEach((f, i) => {
            const t0 = 5 + i * 1.2;
            beats.push([t0, b => {
              const A = arkNow();
              const dx = A.vis ? arkPt(A, DX, SILL, T1)[0] / W.w : 0.6;
              famAdd(f, { x: dx, from: inst(b) ? 'none' : 'fade', glow: f.id === 'noah' ? 0.5 : 0.3 });
              if (inst(b)) return;
              cast().face(f.id, 1);
              cast().pose(f.id, 'walk', { stop: true });
              attach(f.id, exitFn(S.clock, walkDur));
            }]);
            beats.push([t0 + 1.5, b => { cast().face(f.id, -1); }]);
            beats.push([t0 + walkDur + 0.15, b => {
              attach(f.id, null);
              const xe = exitEndX() / W.w;
              cast().place(f.id, xe, 2);
              cast().walk(f.id, S.altarX + ALTAR_SPOT[f.id], { pose: 'stand', speed: 0.035 });
            }]);
          });
          beats.push([27.5, b => {
            lv('flAltar', 1, b);
            cast().pose('noah', 'bow'); cast().pose('shem', 'carry'); cast().pose('japheth', 'carry');
            sfx('build', b, { soft: true });
          }]);
          beats.push([31.5, b => {
            lv('flFire', 1, b);
            for (const f of FAM) { cast().face(f.id, S.altarX); cast().pose(f.id, 'kneel'); }
            sfx('fire', b);
          }]);
          beats.push([34, b => { cast().pose('noah', 'pray'); }]);
          TL(c, beats);
        },
      },

      // ── 8:21–22 · 9:1 永不停息 ─────────────────────────────
      {
        kind: 'promise', utter: '稼穑、寒暑、冬夏、昼夜就永不停息了', cmd: 'while (地.存留) { 稼穑(); 寒暑(); 冬夏(); 昼夜(); }', ref: '8:22',
        verse: [
          { text: '耶和华闻那馨香之气，就心里说：<br>「我不再因人的缘故咒诅地（人从小时心里怀着恶念），<br>也不再按着我才行的，灭各种的活物了。', ref: '创世记 8:21', hold: 9.5 },
          { text: '地还存留的时候，<br>稼穑、寒暑、冬夏、昼夜就永不停息了。」', ref: '创世记 8:22', hold: 7 },
          { text: '神赐福给挪亚和他的儿子，对他们说：<br>「你们要生养众多，遍满了地。', ref: '创世记 9:1', hold: 7 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('flAltar', 1, b); lv('flFire', 1, b); lv('flGold', 1, b);
              lv('arkRamp', 1, b); lv('arkDoor', 1, b);
              S.exit = null;
              if (!inst(b)) { const D = altarDims(); fx().ring(D.x, Math.max(0.1 * W.h, D.y - D.h - 0.5 * W.h), [255, 226, 160], M() * 0.5, 3, 2); }
              sfx('harp', b);
            }],
            [10.5, b => {
              W.passDay(14, inst(b));
              S.seasonT0 = inst(b) ? -1e9 : S.clock;
              lv('flGold', 0.4, b);
            }],
            [19, b => {
              for (const f of FAM) cast().pose(f.id, 'stand');
              cast().pose('noah', 'raise');
              W.setPop('bird', 54, W.w * 0.5, W.h * 0.3, inst(b));
              if (!inst(b)) {
                const x = px('noah');
                fx().ring(x != null ? x : W.w * 0.5, W.h * 0.8, [255, 231, 163], Math.hypot(W.w, W.h), 3.2, 2);
                const a = au(); if (a && a.bless) safe('flood.bless', () => a.bless());
              }
              lv('flFire', 0.5, b);
            }],
            [24, b => { cast().pose('noah', 'stand'); }],
          ]);
        },
      },

      // ── 9:8–17 虹 ───────────────────────────────────────────
      {
        kind: 'promise', utter: '我把虹放在云彩中', cmd: 'git tag -a 虹 -m "永约"', ref: '9:13', hold: 3.4,
        verse: [
          { text: '我与你们立约，凡有血肉的，不再被洪水灭绝，<br>也不再有洪水毁坏地了。」', ref: '创世记 9:11', hold: 7 },
          { text: '神说：「我与你们并你们这里的各样活物所立的永约是有记号的。<br>我把虹放在云彩中，这就可作我与地立约的记号了。', ref: '创世记 9:12–13', hold: 8.5 },
          { text: '我使云彩盖地的时候，必有虹现在云彩中，<br>我便纪念我与你们和各样有血肉的活物所立的约，<br>水就再不泛滥、毁坏一切有血肉的物了。', ref: '创世记 9:14–15', hold: 9.5 },
          { text: '神对挪亚说：「这就是我与地上一切有血肉之物立约的记号了。」', ref: '创世记 9:17', hold: 7 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('clouds', 1, b); lv('storm', 0.2, b); lv('rain', 0.1, b); lv('flGold', 0, b); lv('flFire', 0.3, b);
              time(0.63, 8, b);
            }],
            [3.5, b => {
              lv('rainbow', 1, b);
              S.bowT0 = inst(b) ? -1e9 : S.clock;
              for (const f of FAM) cast().pose(f.id, 'gaze');
              if (!inst(b)) W.flash = Math.max(W.flash, 0.25);
              sfx('harp', b);
            }],
            [10, b => { cast().pose('noah', 'raise'); }],
            [17, b => { lv('rain', 0, b); lv('storm', 0.08, b); }],
            [22, b => { cast().pose('noah', 'gaze'); lv('flFire', 0, b); }],
          ]);
        },
      },

      // ── 9:18–29 葡萄园；挪亚之死 ───────────────────────────
      {
        kind: 'act', utter: '挪亚作起农夫来，栽了一个葡萄园', cmd: 'plant 葡萄园  # 洪水以后又活了三百五十年', ref: '9:20',
        verse: [
          { text: '出方舟挪亚的儿子就是闪、含、雅弗。含是迦南的父亲。<br>这是挪亚的三个儿子，他们的后裔分散在全地。', ref: '创世记 9:18–19', hold: 8 },
          { text: '挪亚作起农夫来，栽了一个葡萄园。', ref: '创世记 9:20', hold: 5.5 },
          { text: '洪水以后，挪亚又活了三百五十年。<br>挪亚共活了九百五十岁就死了。', ref: '创世记 9:28–29', hold: 8 },
        ],
        apply(c) {
          TL(c, [
            [0, b => {
              lv('rainbow', 0, b); lv('clouds', 0.5, b); lv('storm', 0, b); lv('rain', 0, b); lv('flFire', 0, b); lv('flGold', 0, b);
              lv('flVine', 1, b);
              S.tentT0 = inst(b) ? -1e9 : S.clock;
              for (const f of FAM) cast().pose(f.id, 'stand');
              cast().walk('noah', 0.7, { pose: 'kneel', speed: 0.035 });
              cast().walk('noahW', 0.66, { pose: 'stand', speed: 0.03 });
              cast().crowd('fl:kin', { n: 7, x0: 0.36, x1: 0.56, layer: 2, label: '挪亚的子孙', from: inst(b) ? 'none' : 'fade' });
            }],
            [6, b => { W.passDay(10, inst(b)); }],
            [15, b => { cast().walk('noah', 0.875, { pose: 'sit', speed: 0.03 }); cast().walk('noahW', 0.855, { pose: 'stand', speed: 0.03 }); }],
            [17, b => { time(0.72, 7, b); }],
            [20, b => { cast().pose('noah', 'lie'); for (const id of ['shem', 'ham', 'japheth']) cast().face(id, 0.875); }],
            [22.5, b => {
              if (!inst(b)) {
                const x = px('noah');
                if (x != null) { fx().sparkle(x, gY(x) - 8 * uu(), 40, [255, 240, 210], 14 * uu(), 'near'); fx().ring(x, gY(x) - 10 * uu(), [255, 236, 200], M() * 0.3, 2.4, 1.5); }
              }
              cast().remove('noah');
              cast().pose('noahW', 'weep');
              for (const id of ['shem', 'ham', 'japheth']) cast().pose(id, 'bow');
              sfx('weep', b, { soft: true });
            }],
            [25, b => { S.cairn = { x: 0.875, t0: inst(b) ? -1e9 : S.clock }; }],
            [30, b => { for (const id of ['shem', 'ham', 'japheth']) cast().pose(id, 'stand'); }],
          ]);
        },
      },
    ],
    scene: {
      init() { safe('flood.sprites', buildSprites); glowSprite(); warmSprite(); },
      resize() { layoutMountain(); },
      update,
      drawUnder,
      draw,
      reset() { S = fresh(); },
      restore() { S.bolt = null; S.grounded = true; ensureLayout(); },
      pick,
    },
  });
})(window.GS);
