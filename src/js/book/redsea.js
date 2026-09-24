/* ─────────────────────────────────────────────────────────────
 * book/redsea.js —— 出埃及记 · 红海（出埃及记 13:17 — 18:27）
 *
 * 云柱在日间领路，夜间化作火柱（13:21–22）；约瑟的骸骨一同抬着（13:19）；在旷野边的以倘安营。
 * 转回，靠近海边安营（14:2）；法老的车辆追来——暮色里一点点铜的闪光，扬起的尘（14:6–10）；
 * 摩西说「不要惧怕」；神的使者与云柱转到后边，立在两营中间：一边黑暗，一边发光（14:19–20）。
 * 「你举手向海伸杖，把水分开」——大东风一夜，左边的海分开：一条干地伸向远方，两旁的水直立如垒，
 * 水墙里有鱼影，墙顶翻着白浪（14:21，15:8——全卷的标志画面）；以色列人下海中走干地，
 * 火把如一条光河流向对岸（14:22）；埃及的车跟着下来；晨更时耶和华从云火柱中观看，车轮脱落（14:24–25）；
 * 天一亮，摩西向海伸杖，水回流合拢（14:27–28），日头正从路的尽头升起。
 * 摩西之歌，米利暗与众妇女击鼓跳舞（15）；玛拉的苦水因一棵树变甜，以琳的十二股泉、棕树（15:23–27）；
 * 汛的旷野：荣光在云中显现，晚上鹌鹑遮满了营，早晨地上有如白霜的吗哪（16）；第七日安息；
 * 利非订：击打何烈的磐石，水流成河，流到海边（17:6）；亚玛力：摩西在磐石顶上举手，亚伦与户珥扶着，
 * 直到日落；「耶和华尼西」的坛与旗（17:8–15）；叶忒罗带着西坡拉与两个儿子来到神的山，
 * 献祭，立千夫长、百夫长……（18）。远处，神的山渐渐显出——下一卷的西奈。
 *
 * 画面的方位：左 = 红海（东；日出于左）；远处海平线上是对岸的旷野；右 = 近地（以色列的营）、
 * 中丘与远山。海中的路在画面正中：路口在近岸的岸边，直通到海平线（横屏时经文在左边的海面上，不压在路上）。一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'redsea';
  const TINT = [190, 220, 255];
  const cur = () => GS.book.current(ACT);
  const safe = (l, f) => U.safe(l, f);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    rsCloud: ['exp', 0.5],     // 云柱（火柱）显现
    rsPm: ['lin', 0.1],        // 云柱挪移的进度（S.pA → S.pB）
    rsGlory: ['exp', 0.6],     // 耶和华的荣光在云中显现（16:10）
    rsCamp: ['lin', 0.4],      // 营地（帐棚）由 S.siteA 换到 S.siteB 的进度
    rsArmy: ['lin', 0.09],     // 法老的车辆自西（右）赶来
    rsDive: ['lin', 0.12],     // 埃及人跟着下到海中（岸上的车驶向海边）
    rsDark: ['exp', 0.35],     // 云柱的一边黑暗（14:20）
    rsWind: ['exp', 0.5],      // 大东风
    rsSea: ['lin', 0.072],     // 海水分开
    rsClose: ['lin', 0.16],    // 水仍合（14:27）
    rsCross: ['lin', 0.047],   // 以色列人下海中走干地
    rsChase: ['lin', 0.1],     // 埃及的车在海中追赶
    rsGaze: ['exp', 1.2],      // 耶和华从云火柱中观看（14:24）
    rsWheels: ['exp', 0.8],    // 车轮脱落
    rsFlee: ['lin', 0.12],     // 「我们逃跑吧」
    rsFoam: ['exp', 0.16],     // 合拢之后海面的白沫
    rsStaff: ['exp', 1.2],     // 对岸摩西的杖（一点光）
    rsDance: ['exp', 0.8],     // 米利暗与众妇女击鼓跳舞
    rsPool: ['exp', 0.5],      // 玛拉的水
    rsMarah: ['exp', 0.45],    // 苦水变甜
    rsTree: ['exp', 0.8],      // 耶和华指示他一棵树
    rsElim: ['lin', 0.14],     // 以琳：十二股水泉，七十棵棕树
    rsQuail: ['lin', 0.15],    // 鹌鹑飞来
    rsQuailA: ['exp', 0.6],
    rsDew: ['exp', 0.8],       // 露水
    rsManna: ['exp', 0.45],    // 如白霜的小圆物
    rsRest: ['exp', 0.35],     // 安息日的光
    rsRock: ['exp', 0.5],      // 何烈的磐石
    rsRockGlory: ['exp', 0.6], // 「我必在何烈的磐石那里，站在你面前」
    rsSpring: ['lin', 0.14],   // 从磐石流出的水
    rsBattle: ['exp', 0.6],    // 与亚玛力争战的尘
    rsAltar: ['exp', 0.5],     // 耶和华尼西的坛与旗
    rsHoreb: ['exp', 0.25],    // 神的山
    rsOffer: ['exp', 0.6],     // 叶忒罗的燔祭
    rsJudge: ['exp', 0.5],     // 千夫长、百夫长……的旗与灯
    rsRod: ['exp', 1.2],       // 摩西杖头的光（14:21）
    rsWreck: ['exp', 0.5],     // 海边冲上岸的车轮与盾牌（14:30）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { siteA: null, siteB: null, pA: 'lead', pB: 'lead', chest: 'carried', closing: false, across: false, tree: 'ground', onRock: false, lift: false };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const PHN = () => W.w < 600;
  const LS = l => W.layerScale(l) * (PHN() ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const fY = (l, xf, v) => { const g = gY(l, xf); return g + (v || 0) * fieldH(l, g); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const FIG = () => 50 * W.unit * (PHN() ? 1.4 : 1);          // 海中路上、最近处一个人的身高
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ease = t => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const eOut = t => 1 - Math.pow(1 - c01(t), 3);
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const RT = [];
  (function () { const r = U.mulberry32(51317); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];
  const sfx = (n, o) => { if (!W.replaying) safe('rs.sfx', () => au().sfx && au().sfx(n, o || {})); };
  const fireK = () => smoothstep(0.45, 0.85, W.night);        // 日间云柱，夜间火柱

  // 可以按住观看的东西（每帧由各画法登记）
  const PK = [];
  const pk = (label, x, y, r) => { if (PK.length < 120) PK.push({ label, x, y, r }); };

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function radial(rgb, a0, mid, a1) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * (a1 == null ? 0.32 : a1)));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function column(c0, c1) {
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, rgba(c1, 0)); hz.addColorStop(0.28, rgba(c1, 0.5)); hz.addColorStop(0.5, rgba(c0, 1));
    hz.addColorStop(0.72, rgba(c1, 0.5)); hz.addColorStop(1, rgba(c1, 0));
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.22, 'rgba(0,0,0,0.65)'); vt.addColorStop(0.9, 'rgba(0,0,0,1)'); vt.addColorStop(1, 'rgba(0,0,0,0.35)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return b;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      pale: radial([220, 230, 255], 1), smoke: radial([132, 124, 118], 0.8, 0.55), dust: radial([196, 164, 116], 0.9, 0.5, 0.5),
      cloud: radial([252, 252, 255], 0.96, 0.55, 0.62), cloudG: radial([255, 214, 130], 0.95, 0.55, 0.6), cloudSh: radial([118, 126, 144], 0.9, 0.5, 0.55),
      fire: radial([255, 206, 128], 1, 0.4, 0.45), fireO: radial([255, 118, 44], 1, 0.45, 0.5), dark: radial([3, 4, 9], 1, 0.6, 0.75), blue: radial([150, 205, 240], 1),
      foam: radial([240, 248, 255], 0.95, 0.5, 0.6), mist: radial([214, 222, 236], 0.7, 0.5, 0.5),
    };
    SP.col = column([250, 250, 253], [206, 214, 228]);
    SP.colF = column([255, 238, 196], [255, 146, 66]);
    SP.colW = column([255, 236, 190], [255, 200, 120]);
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function glowE(ctx, sp, x, y, rx, ry, a) {
    if (a < 0.004 || rx < 0.5 || ry < 0.5) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - rx, y - ry, rx * 2, ry * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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
  function smoke(ctx, x, y, k, H, w, seed) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 10, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.075 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.4 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }
  function glint(ctx, x, y, r, a) {
    if (a < 0.02) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, r * 2.2, a * 0.7);
    ctx.globalAlpha = Math.min(1, a);
    ctx.strokeStyle = 'rgb(255,240,200)';
    ctx.lineWidth = Math.max(0.6, r * 0.18);
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r * 0.8); ctx.lineTo(x, y + r * 0.8); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海中的路：一点透视（消失点在海平线上，对岸就在那里）
  //  路在画面正中：路口就在近岸的岸边（营的前面），一直通到海平线——
  //  横屏时经文在左边的海面上，分开的海、干地上的人与车都在经文与火柱之间，不在经文底下。
  //  深度 s：1 = 路口（近岸的岸线），0 = 海平线；横向 l：0 左墙脚 … 1 右墙脚
  // ════════════════════════════════════════════════════════════
  const MOUTH = 0.535, MOUTH_HW = 0.1, VANISH = 0.505;
  let G = null, Gkey = '';
  function corr() {
    const key = W.w + 'x' + W.h + 'x' + W.horizonY;
    if (G && Gkey === key) return G;
    Gkey = key;
    const hz = W.horizonY, yb0 = W.h * 1.005;
    // 近岸在画面底边的海岸线（风纹只在这以左的海面上）
    let xs = W.w * 0.33;
    for (let i = 0; i <= 240; i++) { const x = (0.18 + 0.3 * i / 240) * W.w; if (W.ridgeBaseY(2, x) <= yb0) { xs = x; break; } }
    // 路口：近岸在路口处的岸线（再低两个像素，路口没入岸下）
    const yb = Math.min(W.h * 0.97, Math.max(hz + 0.12 * W.h, gY(2, MOUTH) + 2));
    // 竖屏的手机上画面窄：路口宽一些，墙矮一些（不成两根尖柱）
    const pt = PORT(), hwm = (pt ? 0.17 : MOUTH_HW) * W.w;
    const xl = MOUTH * W.w - hwm, xr = MOUTH * W.w + hwm, vx = VANISH * W.w;
    G = { hz, yb, xs, xr, xl, vx, wh: (pt ? 1.15 : 1.6) * (yb - hz), mound: 0.03 * W.w, grad: {} };
    return G;
  }
  // 路与墙的渐变：按视口与此刻的颜色缓存（颜色随时辰缓缓变，取整后多帧共用一个）
  function gradOf(g, key, make) {
    const q = g.grad[key];
    if (q && q.k === make.k) return q.g;
    const gr = make();
    g.grad[key] = { k: make.k, g: gr };
    return gr;
  }
  const ckey = c => ((c[0] / 3) | 0) + ',' + ((c[1] / 3) | 0) + ',' + ((c[2] / 3) | 0);
  const cY = (g, s) => g.hz + s * (g.yb - g.hz);
  const cX = (g, s, l) => g.vx + s * (g.xl + l * (g.xr - g.xl) - g.vx);

  // 各深度处路的开合
  const NS = 24, NX = 28;             // 0..NS：路口以内（s ≤ 1）；路口左边的岸是斜下去的坡，干地与左墙再往岸下延伸到 NX
  const SS = [];
  for (let i = 0; i <= NS; i++) SS.push(0.012 + 0.988 * Math.pow(i / NS, 1.35));
  SS.push(1.07, 1.14, 1.22, 1.32);
  const GE = SS.map(() => ({ s: 0, cx: 0, hw: 0, y: 0, hh: 0, hl: 0, hr: 0, tp: 1, tl: 1, ox: 0, oxl: 0, m: 0, wf: 0, hf: 0, ln: 0 }));
  // 两墙近岸的一端都不是刀切的竖面：墙头向岸边斜斜地塌下去、铺开，成为一堆斜入岸边的水
  // （右墙在路口处落到岸上；左墙顺着路口左边斜下去的岸坡，再往前一点才落下）
  const heapR = s => (s >= 1 ? 1 : smoothstep(0.7, 1, s));
  const heapL = s => (s >= 1.32 ? 1 : smoothstep(0.8, 1.28, s));
  function geomAt(g, s, out) {
    const p = W.lv.rsSea, c = W.lv.rsClose;
    const op = c01((p - 0.26 * (1 - s)) / 0.74);
    let wf = eOut(op * 1.05), hf = smoothstep(0.08, 0.92, op), ln = 0;
    // 水仍合：先是墙头向路心卷倒、翻成白浪（倾），再整段一齐落下（沉），两边的水涌进路来合成海面
    // （看的人站在路心的这一线上，墙不能一直倒到路心——那样两墙在眼前只剩两道细线）
    if (c > 0) {
      ln = 0.32 * smoothstep(0, 0.4, c);
      hf *= 1 - smoothstep(0.3, 0.85, c);
      wf *= 1 - 0.7 * smoothstep(0.35, 0.95, c);
    }
    out.s = s;
    out.cx = cX(g, s, 0.5);
    out.hw = s * (g.xr - g.xl) * 0.5 * wf;
    out.y = cY(g, s);
    out.hh = s * g.wh * hf;
    const hq = heapR(s), hl = heapL(s);
    out.tp = 1 - 0.92 * Math.pow(hq, 1.5);
    out.hr = out.hh * out.tp;
    out.ox = Math.pow(hq, 0.85) * 0.07 * W.w * hf * (1 - ln);
    out.tl = 1 - 0.95 * Math.pow(hl, 1.4);
    out.hl = out.hh * out.tl;
    out.oxl = Math.pow(hl, 0.85) * 0.022 * W.w * hf * (1 - ln);
    out.m = s * g.mound * (0.25 + 0.75 * hf);
    out.wf = wf; out.hf = hf; out.ln = ln;
    return out;
  }
  const seaOpenK = () => Math.max(0, W.lv.rsSea * (1 - W.lv.rsClose));
  // 水合之前，路上的沙先没入水中（不让墙倒下时底下还露着干地）
  const floorK = () => (W.lv.rsClose > 0 ? 1 - smoothstep(0.08, 0.34, W.lv.rsClose) : 1);
  // 整段落下时，水墙渐渐化入海面（不留一条发亮的带子）
  const wallK = () => (W.lv.rsClose > 0 ? 1 - smoothstep(0.6, 0.9, W.lv.rsClose) : 1);
  // 路上一点（深度 s、横向 l）→ 屏幕
  function onPath(g, s, l) {
    const e = geomAt(g, s, TMP);
    return [e.cx + (l - 0.5) * 2 * e.hw, e.y, e];
  }
  const TMP = { s: 0, cx: 0, hw: 0, y: 0, hh: 0, hl: 0, hr: 0, tp: 1, tl: 1, ox: 0, oxl: 0, m: 0, wf: 0, hf: 0, ln: 0 };

  // 水墙的颜色（按此刻的光）：夜里的水是深的靛青，只有墙顶的薄水透着月光与火光
  const WN = { base: [3, 12, 26], low: [6, 24, 44], mid: [10, 36, 62], up: [16, 54, 84], lip: [40, 108, 134], foam: [206, 226, 240] };
  const WD = { base: [16, 58, 86], low: [24, 84, 118], mid: [36, 118, 152], up: [70, 164, 190], lip: [140, 220, 226], foam: [248, 252, 255] };
  const WDAWN = [255, 170, 120], INDIGO = [20, 40, 80];
  function wallCols() {
    const d = c01(W.daylight * 1.1), dusk = W.dusk, amb = W.ambient;
    const nk = smoothstep(0.3, 0.8, W.night) * (1 - d);
    const f = k => {
      let c = mix(WN[k], WD[k], d);
      c = mix(c, [c[0] * amb[0] / 255 * 1.1, c[1] * amb[1] / 255 * 1.05, c[2] * amb[2] / 255], 0.35 * d);
      // 夜里：墙身压暗、偏向靛青，与夜海、夜空同一个调子
      if (nk > 0 && (k === 'mid' || k === 'up' || k === 'lip')) {
        const sc = k === 'lip' ? 0.85 : 0.6;
        c = mix(c, mix([c[0] * sc, c[1] * sc, c[2] * sc], INDIGO, k === 'lip' ? 0.22 : 0.32), nk);
      }
      if (dusk > 0.02) c = mix(c, mix(c, WDAWN, k === 'foam' || k === 'lip' ? 0.35 : 0.12), dusk);
      return c;
    };
    return {
      base: f('base'), low: f('low'), mid: f('mid'), up: f('up'), lip: f('lip'), foam: f('foam'),
      // 海底湿沙：暖而暗，不是灰白的路面
      sand: mix(mix([96, 86, 72], [190, 166, 128], d), WDAWN, 0.15 * dusk),
      sandFar: mix(mix([40, 42, 54], [160, 160, 162], d), WDAWN, 0.2 * dusk),
      wet: mix(mix([46, 44, 44], [124, 108, 86], d), WDAWN, 0.1 * dusk),
      night: W.night, day: d, nk,
    };
  }
  const BANDK = [['base', 0], ['low', 0.18], ['mid', 0.45], ['up', 0.75], ['lip', 1]];
  function bandCol(C, f) {
    // 夜里只让墙顶约一成的薄水发亮
    if (C.nk > 0) f = Math.pow(f, 1 + 1.3 * C.nk);
    for (let i = 1; i < BANDK.length; i++) if (f <= BANDK[i][1]) { const a = BANDK[i - 1], b = BANDK[i]; return mix(C[a[0]], C[b[0]], (f - a[1]) / (b[1] - a[1])); }
    return C.lip;
  }
  const NB = 12;
  // 路上的小水洼（火把与月光的倒影）：[深度 s, 横向 l, 大小]
  const PUDDLES = [[0.93, 0.34, 1.1], [0.86, 0.68, 0.9], [0.78, 0.45, 0.8], [0.7, 0.28, 0.75], [0.62, 0.62, 0.7], [0.53, 0.4, 0.6], [0.44, 0.7, 0.55], [0.36, 0.33, 0.5]];

  function polyStrip(ctx, n, fx0, fy0, fx1, fy1) {
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = fx0(i), y = fy0(i); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = n; i >= 0; i--) ctx.lineTo(fx1(i), fy1(i));
    ctx.closePath();
  }

  // ── 海中的路（'seaNear' 层：在海之后、近岸之前）────────────────
  const ITEMS = [];
  function drawCorridor(ctx) {
    const open = W.lv.rsSea > 0.003 && W.lv.rsClose < 0.999;
    const g = corr();
    if (open) {
      SP || sprites();
      for (let i = 0; i <= NX; i++) geomAt(g, SS[i], GE[i]);
      const C = wallCols(), t = W.t, u = W.unit, fk = floorK(), wa = wallK(), lnMax = GE[NS].ln;
      const crestK = W.lv.rsClose > 0 ? 1 - smoothstep(0.25, 0.6, W.lv.rsClose) : 1;
      // 墙脚与沙相接处是一道曲折的线，不是尺子画的直边
      const jig = (i, sd) => (2 + 3.5 * rt(i * 7 + sd * 37 + 1500)) * Math.sin(i * 1.9 + sd * 2.3 + 0.7) * Math.min(1, GE[i].s) * u * GE[i].wf * (1 - GE[i].ln);
      const wob = (i, ph) => 4 * u * Math.min(1, GE[i].s) * GE[i].hf * Math.sin(t * 1.3 + i * 1.7 + ph);
      const topL = i => GE[i].y - GE[i].hl - wob(i, 0) * GE[i].tl;
      const topR = i => GE[i].y - GE[i].hr - wob(i, 2.4) * GE[i].tp;
      const xL = i => GE[i].cx - GE[i].hw + jig(i, 0), xR = i => GE[i].cx + GE[i].hw + jig(i, 1), yB = i => GE[i].y;
      // 倾倒时两墙的墙顶正好在路心相合（不留缝）
      const tL = i => lerp(xL(i), GE[i].cx, GE[i].ln) - GE[i].oxl, tR = i => lerp(xR(i), GE[i].cx, GE[i].ln) + GE[i].ox;
      const HH = side => (side ? (e => e.hr) : (e => e.hl));
      // 墙面上高 f 处的 x（两墙近岸的一端是斜的）
      const faceX = (e, side, f) => (side ? e.cx + e.hw + e.ox * f : e.cx - e.hw - e.oxl * f);
      // 墙外堆起的水丘：一整块，由墙色渐渐淡入海里（左墙的水丘都藏在墙后，不画）
      for (const side of [1]) {
        const X = side ? xR : xL, XT = side ? tR : tL, TOP = side ? topR : topL, sg = side ? 1 : -1, n = side ? NS : NX;
        const x0 = side ? g.xr + 0.01 * W.w : g.xl + 0.1 * W.w, x1 = side ? g.xr + 0.08 * W.w + g.mound : g.xl - g.mound;
        const make = () => {
          const gr = ctx.createLinearGradient(x0, 0, x1, 0);
          gr.addColorStop(0, rgba(C.up, 0.95)); gr.addColorStop(0.45, rgba(mix(C.mid, C.base, 0.3), 0.75)); gr.addColorStop(1, rgba(C.base, 0));
          return gr;
        };
        make.k = ckey(C.up) + ckey(C.mid) + ckey(C.base);
        ctx.fillStyle = gradOf(g, 'm' + side, make);
        ctx.globalAlpha = wa;
        polyStrip(ctx, n, XT, TOP, i => (side ? Math.max(X(i), XT(i)) : X(i)) + sg * GE[i].m, yB);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // 干地（海底）：退去的海水留下的湿沙
      const walkK = W.lv.rsCross > 0.001 && W.lv.rsCross < 0.999 ? 1 : 0;
      const warmPath = Math.max(walkK * 0.6, W.lv.rsGaze) * (0.4 + 0.6 * C.night);
      if (fk > 0.01) {
        ctx.globalAlpha = fk;
        const mkF = () => {
          const fg = ctx.createLinearGradient(0, g.hz, 0, g.yb);
          fg.addColorStop(0, rgba(C.sandFar, 1)); fg.addColorStop(0.3, rgba(mix(C.sandFar, C.sand, 0.55), 1)); fg.addColorStop(1, rgba(C.sand, 1));
          return fg;
        };
        mkF.k = ckey(C.sand) + ckey(C.sandFar);
        ctx.fillStyle = gradOf(g, 'floor', mkF);
        polyStrip(ctx, NX, xL, yB, xR, yB); ctx.fill();
        // 墙脚渗水的暗沙
        for (const side of [0, 1]) {
          const X = side ? xR : xL, k = side ? 1 : -1;
          ctx.fillStyle = rgba(C.wet, 0.42);
          polyStrip(ctx, NX, X, yB, i => GE[i].cx + k * GE[i].hw * (0.6 + 0.05 * Math.sin(i * 2.3 + side)), yB); ctx.fill();
          ctx.fillStyle = rgba(mix(C.wet, C.base, 0.5), 0.5);
          polyStrip(ctx, NX, X, yB, i => GE[i].cx + k * GE[i].hw * 0.87 + jig(i, side) * 0.6, yB); ctx.fill();
        }
        // 沙上深浅的斑（湿的、干的）
        ctx.fillStyle = rgba(mix(C.sand, C.wet, 0.55), 0.4);
        ctx.beginPath();
        for (let k = 0; k < 30; k++) {
          const s = 0.06 + 0.94 * Math.pow(rt(k * 5 + 1200), 0.75), l = 0.1 + 0.8 * rt(k * 3 + 1201);
          const e = geomAt(g, s, TMP);
          if (e.hw < 4) continue;
          const x = e.cx + (l - 0.5) * 2 * e.hw, y = e.y, rx = e.hw * (0.12 + 0.2 * rt(k * 7 + 1202)), ry = Math.max(0.6, rx * 0.09);
          ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
        }
        ctx.fill();
        // 沙上的波纹（一道道弯的细纹）
        const ripples = dy => {
          ctx.beginPath();
          for (let k = 0; k < 18; k++) {
            const s = 0.12 + 0.86 * Math.pow(rt(k * 7 + 1400), 0.8), e = geomAt(g, s, TMP);
            if (e.hw < 6) continue;
            const l0 = 0.08 + 0.42 * rt(k * 3 + 1401), l1 = Math.min(0.94, l0 + 0.22 + 0.4 * rt(k * 5 + 1402));
            const x0 = e.cx + (l0 - 0.5) * 2 * e.hw, x1 = e.cx + (l1 - 0.5) * 2 * e.hw, xm = (x0 + x1) / 2, bw = (1.2 + 2.4 * rt(k + 1403)) * s * u, y = e.y + dy * s;
            ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + xm) / 2, y + bw, xm, y + bw * 0.2); ctx.quadraticCurveTo((xm + x1) / 2, y - bw * 0.7, x1, y + bw * 0.3);
          }
        };
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(0.5, 0.9 * u);
        ctx.strokeStyle = rgba(mix(C.wet, C.sand, 0.3), 0.55); ripples(0); ctx.stroke();
        ctx.strokeStyle = rgba(mix(C.sand, [255, 246, 226], 0.35), 0.22); ripples(-1.4 * u); ctx.stroke();
        // 沙上的卵石与贝壳
        ctx.fillStyle = rgba(mix(C.sand, [40, 36, 34], 0.55), 0.7);
        ctx.beginPath();
        for (let k = 0; k < 44; k++) {
          const s = 0.08 + 0.92 * Math.pow(rt(k * 3 + 1000), 0.7), l = 0.06 + 0.88 * rt(k * 7 + 1001);
          const e = geomAt(g, s, TMP);
          if (e.hw < 3) continue;
          const x = e.cx + (l - 0.5) * 2 * e.hw, y = e.y, r = (0.8 + 1.6 * rt(k * 5 + 1002)) * s * u * (PHN() ? 1.3 : 1);
          ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.45, 0, 0, TAU);
        }
        ctx.fill();
        ctx.fillStyle = rgba(mix(C.sand, [255, 250, 240], 0.45), 0.5);
        ctx.beginPath();
        for (let k = 0; k < 26; k++) {
          const s = 0.1 + 0.9 * Math.pow(rt(k * 11 + 1100), 0.7), l = 0.08 + 0.84 * rt(k * 13 + 1101);
          const e = geomAt(g, s, TMP);
          if (e.hw < 3) continue;
          const x = e.cx + (l - 0.5) * 2 * e.hw, y = e.y, r = (0.6 + 1.1 * rt(k * 17 + 1102)) * s * u * (PHN() ? 1.3 : 1);
          ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.5, 0, 0, TAU);
        }
        ctx.fill();
        // 小水洼：暗的湿沙，映着火把与月光
        ctx.fillStyle = rgba(mix(C.wet, C.base, 0.4), 0.6);
        ctx.beginPath();
        for (const [s, l, z] of PUDDLES) {
          const e = geomAt(g, s, TMP);
          if (e.hw < 5) continue;
          const x = e.cx + (l - 0.5) * 2 * e.hw, rx = e.hw * 0.17 * z, ry = Math.max(0.8, rx * 0.11);
          ctx.moveTo(x + rx, e.y); ctx.ellipse(x, e.y, rx, ry, 0, 0, TAU);
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        const lit = Math.max(warmPath * 1.4, 0.3 * C.night * fireK());
        for (let q = 0; q < PUDDLES.length; q++) {
          const [s, l, z] = PUDDLES[q], e = geomAt(g, s, TMP);
          if (e.hw < 5) continue;
          const x = e.cx + (l - 0.5) * 2 * e.hw, rx = e.hw * 0.17 * z, ry = Math.max(0.8, rx * 0.11);
          const fl = 0.8 + 0.2 * Math.sin(t * 7 + q * 1.9);
          glowE(ctx, SP.warm, x, e.y, rx * 1.1, ry * 1.8, fk * lit * 0.55 * fl);
          glowE(ctx, SP.pale, x - rx * 0.2, e.y, rx * 0.6, ry * 0.8, fk * (0.25 * C.night + 0.2 * C.day));
        }
        // 路中一道淡淡的光（火柱与火把照着的路）
        if (warmPath > 0.02) {
          ctx.globalAlpha = fk;
          ctx.fillStyle = rgba([255, 170, 90], 0.1 * warmPath);
          polyStrip(ctx, NS, i => GE[i].cx - GE[i].hw * 0.55, yB, i => GE[i].cx + GE[i].hw * 0.55, yB); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      // 水从两边涌进路来：干地没入水中
      if (fk < 0.99) {
        ctx.fillStyle = rgba(mix(C.low, C.mid, 0.4), (1 - fk) * wa);
        polyStrip(ctx, NX, xL, yB, xR, yB); ctx.fill();
      }
      // 水墙的内面：由墙脚到墙顶，由深而浅；夜里只有墙顶的薄水透光
      for (const side of [0, 1]) {
        const X = side ? xR : xL, XT = side ? tR : tL, TOP = side ? topR : topL, n = side ? NS : NX, hh = HH(side);
        const FX = f => i => lerp(X(i), XT(i), f), FY = f => i => lerp(yB(i), TOP(i), f);
        const nb = (W.quality || 1) < 0.75 ? 8 : NB;
        for (let b = 0; b < nb; b++) {
          const f0 = b / nb, f1 = (b + 1) / nb;
          let bc = bandCol(C, Math.pow((b + 0.5) / nb, 1.35));
          if (C.night > 0.3) bc = side ? mix(bc, [60, 84, 140], 0.08 * C.night) : mix(bc, [0, 4, 12], 0.16 * C.night * (b < nb * 0.8 ? 1 : 0.3));
          // 倒下的水翻着白浪：墙身随之发白（与夜海分得开）
          if (lnMax > 0.01) bc = mix(bc, mix(C.up, C.foam, 0.2 + 0.4 * (b / nb)), 1.2 * lnMax * (b / nb) * crestK);
          ctx.fillStyle = rgba(bc, wa);
          polyStrip(ctx, n, FX(f0), FY(f0), FX(Math.min(1, f1 + 0.004)), FY(Math.min(1, f1 + 0.004)));
          ctx.fill();
        }
        // 墙顶下透光的一带
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rgba(C.lip, (0.1 + 0.08 * C.night) * wa * crestK);
        polyStrip(ctx, n, FX(0.87), FY(0.87), FX(0.97), FY(0.97)); ctx.fill();
        // 玻璃般的一道斜光
        ctx.fillStyle = rgba(C.lip, 0.06 * (1 - 0.5 * C.nk) * wa * crestK);
        polyStrip(ctx, n, FX(0.45), FY(0.45), FX(0.53), FY(0.53)); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        // 水幕上垂下的光纹
        ctx.strokeStyle = rgba(C.lip, 0.08 + 0.04 * C.night);
        ctx.lineWidth = Math.max(0.5, 0.9 * u);
        ctx.beginPath();
        for (let k = 0; k < 26; k++) {
          const s = 0.08 + 0.92 * Math.pow(rt(k * 13 + side * 101), 0.8);
          const e = geomAt(g, s, TMP), H = hh(e);
          if (H < 5 || e.ln > 0.5) continue;
          const a0 = 0.1 + 0.4 * rt(k * 5 + side), a1 = Math.min(0.98, a0 + 0.25 + 0.5 * rt(k * 9 + side));
          const drift = U.fract(t * 0.05 + rt(k * 19 + side)) * 0.1, f0 = a0 - drift, f1 = a1 - drift;
          ctx.moveTo(faceX(e, side, f0), e.y - H * f0); ctx.lineTo(faceX(e, side, f1), e.y - H * f1);
        }
        ctx.stroke();
        // 水里的鱼影
        ctx.fillStyle = rgba(mix(C.base, [0, 0, 0], 0.4), 0.55 * wa);
        ctx.beginPath();
        for (let k = 0; k < 9; k++) {
          const s = clamp(0.25 + 0.7 * rt(k * 17 + side * 31) + 0.04 * Math.sin(t * 0.11 + k), 0.12, 0.99);
          const e = geomAt(g, s, TMP), H = hh(e);
          if (H < 14 || e.ln > 0.5) continue;
          const fh = 0.18 + 0.62 * rt(k * 23 + side * 7), x = faceX(e, side, fh), y = e.y - H * fh + Math.sin(t * 0.4 + k) * 4 * s;
          const L = (7 + 6 * rt(k * 29 + side)) * s * u * (PHN() ? 1.3 : 1), d = (rt(k * 3 + side) < 0.5 ? -1 : 1);
          const xx = x + d * Math.sin(t * 0.2 + k * 2) * 5 * s;
          ctx.moveTo(xx + L, y); ctx.ellipse(xx, y, L, L * 0.3, 0, 0, TAU);
          ctx.moveTo(xx - d * L * 0.9, y); ctx.lineTo(xx - d * L * 1.5, y - L * 0.35); ctx.lineTo(xx - d * L * 1.5, y + L * 0.35); ctx.closePath();
        }
        ctx.fill();
      }
      // 远处的墙没入夜色（空气透视）
      for (const side of [0, 1]) {
        const x1 = side ? g.xr : g.xl;
        const mkH = () => {
          const gr = ctx.createLinearGradient(g.vx, 0, x1, 0);
          gr.addColorStop(0, rgba(W.haze, 0.55)); gr.addColorStop(0.45, rgba(W.haze, 0.12)); gr.addColorStop(1, rgba(W.haze, 0));
          return gr;
        };
        mkH.k = ckey(W.haze);
        ctx.fillStyle = gradOf(g, 'h' + side, mkH);
        ctx.globalAlpha = wa;
        // 渐变在近处已全透明：只画远的一段
        if (side) polyStrip(ctx, 17, xR, yB, tR, topR); else polyStrip(ctx, 17, xL, yB, tL, topL);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // 墙面迎光：左墙受火光的暖，右墙受月光的清
      const pl = pillarNow();
      let warmNear = 0;
      for (const P of pl) if (P.a > 0.05) warmNear = Math.max(warmNear, P.a * fireK() * (P.sea ? 1 : c01(1 - (P.x - g.xs) / (0.4 * W.w))));
      warmNear = Math.max(warmNear, 0.35 * walkK * C.night) * wa;
      ctx.globalCompositeOperation = 'lighter';
      if (warmNear > 0.02) {
        ctx.fillStyle = rgba([255, 140, 60], 0.1 * warmNear);
        polyStrip(ctx, NX, xL, yB, i => lerp(xL(i), tL(i), 0.7), i => lerp(yB(i), topL(i), 0.7)); ctx.fill();
        ctx.fillStyle = rgba([255, 150, 70], 0.045 * warmNear);
        polyStrip(ctx, NS, xR, yB, i => lerp(xR(i), tR(i), 0.7), i => lerp(yB(i), topR(i), 0.7)); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      // 墙顶的白浪（水墙落下时这道线渐渐隐去，只留翻滚的白沫，免得留下两道白线）
      for (const side of [0, 1]) {
        const X = side ? tR : tL, TOP = side ? topR : topL, n = side ? NS : NX, hh = HH(side);
        if (crestK > 0.01) {
          ctx.strokeStyle = rgba(C.foam, 0.85 * crestK);
          ctx.lineCap = 'round';
          for (let i = 1; i <= n; i++) {
            if (hh(GE[i]) < 1.5) continue;
            ctx.lineWidth = Math.max(0.6, (0.8 + 4.2 * Math.min(1.3, GE[i].s)) * u * (0.5 + 0.5 * GE[i].hf) * (side ? 0.4 + 0.6 * GE[i].tp : 0.4 + 0.6 * GE[i].tl));
            ctx.beginPath(); ctx.moveTo(X(i - 1), TOP(i - 1)); ctx.lineTo(X(i), TOP(i)); ctx.stroke();
          }
          ctx.strokeStyle = rgba(C.foam, 0.22 * crestK);
          for (let i = 1; i <= n; i++) {
            if (hh(GE[i]) < 1.5) continue;
            ctx.lineWidth = Math.max(1, (2 + 10 * Math.min(1.3, GE[i].s)) * u * GE[i].hf);
            ctx.beginPath(); ctx.moveTo(X(i - 1), TOP(i - 1)); ctx.lineTo(X(i), TOP(i)); ctx.stroke();
          }
          // 墙头翻卷的白沫（一道起伏的浪唇）
          ctx.fillStyle = rgba(C.foam, 0.42 * crestK);
          polyStrip(ctx, n, X, TOP, X, i => TOP(i) - (2 + 7 * Math.min(1.2, GE[i].s)) * u * GE[i].hf * (0.6 + 0.4 * Math.sin(t * 2.2 + i * 2.7 + side)) * Math.sqrt(side ? GE[i].tp : GE[i].tl));
          ctx.fill();
        }
        // 月光在水墙上的碎光
        if (C.night > 0.3 || C.day > 0.5) {
          ctx.globalCompositeOperation = 'lighter';
          for (let k = 0; k < 14; k++) {
            const s = 0.2 + 0.8 * rt(k * 7 + side * 300 + 1300), e = geomAt(g, s, TMP), H = hh(e);
            if (H < 10) continue;
            const fh = 0.55 + 0.4 * rt(k * 3 + side * 50 + 1301);
            const x = side ? e.cx + e.hw * (1 - e.ln) + e.ox * fh : e.cx - e.hw * (1 - e.ln) - e.oxl * fh, y = e.y - H * fh;
            const tw = Math.pow(Math.max(0, Math.sin(t * (1.5 + rt(k + 1302)) + k * 2.1)), 12);
            if (tw > 0.03) glowSp(ctx, SP.white, x, y, (3 + 5 * s) * u, tw * (side ? 0.6 : 0.4));
          }
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
        // 被东风吹起的浪花（自左而右）
        ctx.fillStyle = rgba(C.foam, 0.7 * crestK);
        ctx.beginPath();
        const wind = 0.35 + W.lv.rsWind;
        for (let i = 3; i <= n; i += 1) {
          const e = GE[i];
          if (hh(e) < 6) continue;
          for (let k = 0; k < 3; k++) {
            const ph = U.fract(t * (0.5 + 0.35 * rt(i * 5 + k + side * 50)) + rt(i * 11 + k + side * 70));
            const es = Math.min(1.2, e.s);
            const x = X(i) + ph * 30 * es * u * wind + (side ? 2 : -2) * es;
            const y = TOP(i) - Math.sin(ph * Math.PI) * 12 * es * u * wind - ph * 4 * es;
            const r = Math.max(0.5, (1.5 - ph) * 1.7 * es * u);
            ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
          }
        }
        ctx.fill();
      }
      // 右边的水堆斜入岸边：水堆的坡上与脚下一带白沫
      if (GE[NS].hf > 0.05 && crestK > 0.5) {
        for (let i = 0; i <= NS; i++) {
          const e = GE[i];
          if (e.s < 0.68) continue;
          const k = smoothstep(0.68, 1, e.s), fl = 0.85 + 0.15 * Math.sin(t * 2.4 + i * 1.7);
          glowE(ctx, SP.foam, tR(i) + 6 * e.s * u, topR(i) + (3 + 4 * k) * e.s * u, (10 + 26 * k) * e.s * u, (4 + 10 * k) * e.s * u, 0.3 * e.hf * fl);
        }
        // 顺着水堆的坡滚下来的白沫
        ctx.fillStyle = rgba(C.foam, 0.75);
        ctx.beginPath();
        for (let k = 0; k < 18; k++) {
          const ph = U.fract(t * (0.12 + 0.08 * rt(k + 1700)) + rt(k * 3 + 1701)), e = geomAt(g, 0.6 + 0.4 * ph, TMP);
          const x = e.cx + e.hw + e.ox + (rt(k * 5 + 1702) - 0.3) * 10 * e.s * u, y = e.y - e.hr + (1 + 5 * rt(k * 7 + 1703)) * e.s * u;
          const r = Math.max(0.6, (1.2 + 2.2 * rt(k + 1704)) * e.s * u * (1 - 0.4 * ph));
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
        }
        ctx.globalAlpha = GE[NS].hf;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // 路的尽头，对岸微微发亮
      const endK = seaOpenK() * (0.35 + 0.65 * C.night);
      if (endK > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        glowE(ctx, SP.gold, g.vx, g.hz - 2, 0.07 * W.w, 0.03 * W.h, 0.4 * endK);
        glowE(ctx, SP.white, g.vx, g.hz - 1, 0.025 * W.w, 0.008 * W.h, 0.5 * endK);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      pk('海中的干地', cX(g, 0.7, 0.5), cY(g, 0.7), 0.1 * W.w * seaOpenK());
      const e3 = GE[NS - 6];
      pk('水墙', e3.cx - e3.hw - 0.04 * W.w, e3.y - e3.hl * 0.5, 0.08 * W.w * seaOpenK());
      pk('水墙', e3.cx + e3.hw + e3.ox * 0.5, e3.y - e3.hr * 0.5, 0.05 * W.w * seaOpenK());
    }

    // 路上的人、车与云火柱：由远而近
    ITEMS.length = 0;
    TORCH.length = 0;
    if (open) { collectWalkers(g); collectChariots(g); }
    for (const P of pillarNow()) if (P.sea && P.a > 0.01) ITEMS.push({ s: P.k / 1.1, kind: 'pillar', P });
    ITEMS.sort((a, b) => a.s - b.s);
    for (const it of ITEMS) {
      if (it.kind === 'w') drawWalker(ctx, it);
      else if (it.kind === 'c') drawChariotBack(ctx, it);
      else drawPillar(ctx, it.P.x, it.P.y, it.P.k, it.P.a, it.P.rise);
    }
    drawTorches(ctx);
    if (open) drawGaze(ctx, g);
    drawArrived(ctx, g);
    drawClosing(ctx, g);
    drawStaff(ctx, g);
  }

  // ── 下海中走干地的以色列人（自最近处走向远方）────────────────
  const NWK = 104;
  const WK = [];
  for (let i = 0; i < NWK; i++) {
    WK.push({ d: 0.56 * i / NWK + 0.015 * rt(i * 3), l: 0.1 + 0.8 * rt(i * 7 + 1), c: i % 6, sheep: rt(i * 11) < 0.13,
      torch: rt(i * 13) < 0.2, bundle: rt(i * 17) < 0.35, sp: 0.9 + 0.2 * rt(i * 19), ph: rt(i * 23) * TAU, child: rt(i * 29) < 0.14 });
  }
  const WROBE = [[128, 100, 76], [104, 84, 70], [148, 116, 88], [96, 82, 74], [122, 104, 88], [110, 98, 116]];
  // 每帧只算一次的颜色（人多时不必每人都重算光照）
  const WC = { frame: -1, robe: [], far: [], veil: '', sheep: '', legs: '', rim: '' };
  function walkerCols() {
    if (WC.frame === W.frame) return WC;
    WC.frame = W.frame;
    for (let i = 0; i < WROBE.length; i++) { WC.robe[i] = rgba(W.shade(WROBE[i], 0.04, 0.1), 1); WC.far[i] = W.shadeCSS(WROBE[i], 0.3, 1, 0.08); }
    WC.veil = rgba(W.shade([214, 202, 180], 0.04, 0.12), 0.8);
    WC.sheep = W.shadeCSS([226, 220, 206], 0.05, 1, 0.12);
    WC.sheepFar = W.shadeCSS([226, 220, 206], 0.3, 1, 0.08);
    WC.legs = W.shadeCSS([60, 52, 46], 0.05, 1, 0.05);
    WC.rim = rgba([255, 190, 120], 0.35 * W.night);
    return WC;
  }
  const TORCH = [];
  function collectWalkers(g) {
    const cr = W.lv.rsCross;
    if (cr < 0.001 || cr >= 0.9999) return;
    const lowQ = (W.quality || 1) < 0.75;
    for (let i = 0; i < NWK; i++) {
      if (lowQ && i % 3 === 2) continue;
      const w = WK[i];
      const tau = c01((cr - w.d) / (0.44 / w.sp));
      if (tau <= 0 || tau >= 1) continue;
      // 行进的队伍在近处走得慢些：最密的一段落在画面下方（经文之下），往远处渐渐稀疏
      const s = 1 - 0.95 * Math.pow(tau, 1.5);
      ITEMS.push({ s, kind: 'w', w, i, tau });
    }
  }
  function drawWalker(ctx, it) {
    const g = corr(), w = it.w, s = it.s;
    const [x, y, e] = onPath(g, s, w.l);
    if (e.hw < 2) return;
    const a = Math.min(1, it.tau * 30) * Math.min(1, (1 - it.tau) * 7) * c01(e.wf * 1.5);
    if (a < 0.02) return;
    const h = FIG() * s * (w.child ? 0.66 : 1) * (w.sheep ? 0.5 : 1);
    const bob = Math.abs(Math.sin(W.t * 5.5 + w.ph)) * h * 0.035;
    const K = walkerCols();
    ctx.globalAlpha = a;
    if (h < 2.2) {
      ctx.fillStyle = w.sheep ? K.sheepFar : K.far[w.c];
      ctx.fillRect(x - 0.6, y - Math.max(1.2, h), 1.2, Math.max(1.2, h));
      ctx.globalAlpha = 1;
      if (w.torch && !w.sheep) TORCH.push([x, y - h * 1.1, Math.max(0.8, h * 0.12), a]);
      return;
    }
    if (w.sheep) {
      ctx.fillStyle = K.sheep;
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.42 - bob, h * 0.36, h * 0.3, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = K.legs;
      ctx.fillRect(x - h * 0.22, y - h * 0.18, h * 0.08, h * 0.18); ctx.fillRect(x + h * 0.14, y - h * 0.18, h * 0.08, h * 0.18);
      ctx.globalAlpha = 1;
      return;
    }
    ctx.fillStyle = K.robe[w.c];
    ctx.beginPath();
    ctx.moveTo(x - 0.15 * h, y);
    ctx.lineTo(x - 0.11 * h, y - 0.7 * h + bob);
    ctx.quadraticCurveTo(x, y - 0.8 * h + bob, x + 0.11 * h, y - 0.7 * h + bob);
    ctx.lineTo(x + 0.15 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.085 * h, y - 0.86 * h + bob);
    ctx.arc(x, y - 0.86 * h + bob, 0.085 * h, 0, TAU);
    if (w.bundle) { ctx.moveTo(x + 0.15 * h, y - 0.6 * h + bob); ctx.ellipse(x + 0.03 * h, y - 0.6 * h + bob, 0.12 * h, 0.1 * h, 0, 0, TAU); }
    ctx.fill();
    // 头巾与迎光的一边
    ctx.fillStyle = K.veil;
    ctx.beginPath(); ctx.ellipse(x, y - 0.9 * h + bob, 0.075 * h, 0.04 * h, 0, 0, TAU); ctx.fill();
    if (W.night > 0.3 && h > 8) {
      ctx.strokeStyle = K.rim;
      ctx.lineWidth = Math.max(0.5, h * 0.03);
      ctx.beginPath(); ctx.moveTo(x + 0.11 * h, y - 0.68 * h + bob); ctx.lineTo(x + 0.15 * h, y - 0.05 * h); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (w.torch) TORCH.push([x + 0.16 * h, y - 1.02 * h + bob, Math.max(1, h * 0.09), a]);
  }
  function drawTorches(ctx) {
    if (!TORCH.length) return;
    SP || sprites();
    const k = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of TORCH) glowSp(ctx, SP.warm, q[0], q[1], q[2] * 7, q[3] * k * 0.55);
    ctx.fillStyle = 'rgb(255,226,160)';
    for (const q of TORCH) {
      ctx.globalAlpha = q[3] * k;
      ctx.beginPath(); ctx.arc(q[0], q[1], q[2] * (0.8 + 0.2 * Math.sin(W.t * 11 + q[0])), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 已到对岸的百姓：远处海平线上一串极小的人影
  function drawArrived(ctx, g) {
    if (!S.across) return;
    const a = smoothstep(0.55, 1, W.lv.rsCross);
    if (a < 0.02) return;
    const hz = g.hz, u = Math.max(0.5, W.unit) * (PHN() ? 1.2 : 1);
    ctx.fillStyle = W.shadeCSS([60, 50, 44], 0.7, 1, 0.05);
    ctx.globalAlpha = a;
    ctx.beginPath();
    for (let i = 0; i < 46; i++) {
      const x = g.vx + (rt(i * 7 + 400) - 0.55) * 0.16 * W.w, y = hz + 0.9 + rt(i * 3 + 401) * 1.6 * u, h = (1.6 + 1.4 * rt(i * 5 + 402)) * u;
      ctx.rect(x - 0.45 * u, y - h, 0.9 * u, h);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    if (W.night > 0.3) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 12; i++) glowSp(ctx, SP.warm, g.vx + (rt(i * 9 + 420) - 0.55) * 0.15 * W.w, hz - 1.5 * u, 3 * u, a * 0.6 * W.night);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 对岸摩西伸杖：路的尽头一点光（14:27）
  function drawStaff(ctx, g) {
    const k = W.lv.rsStaff;
    if (k < 0.02) return;
    const x = g.vx + 0.01 * W.w, y = g.hz - 3 * W.unit;
    glint(ctx, x, y, 7 * Math.max(0.6, W.unit) * (0.8 + 0.2 * Math.sin(W.t * 6)), k);
  }

  // ── 追进海中的埃及车（自后看去）──────────────────────────────
  const NCH = 12;
  const CC = [];
  for (let j = 0; j < NCH; j++) CC.push({ e: 0.36 * j / NCH, l: 0.16 + 0.68 * rt(j * 23 + 5), tilt: rt(j * 29) < 0.5 ? (rt(j * 31) < 0.5 ? -1 : 1) : 0, back: 0.5 + rt(j * 37), ph: rt(j * 41) * TAU });
  function chariotS(j) {
    const c = CC[j], ch = W.lv.rsChase;
    if (ch <= c.e) return -1;
    const tau = c01((ch - c.e) / 0.62);
    return clamp(1 - 0.42 * tau + W.lv.rsFlee * 0.16 * c.back - (j % 3) * 0.035, 0.45, 1);
  }
  function collectChariots(g) {
    if (W.lv.rsChase < 0.001) return;
    for (let j = 0; j < NCH; j++) {
      const s = chariotS(j);
      if (s < 0) continue;
      ITEMS.push({ s, kind: 'c', j });
    }
  }
  const GL = [];      // 铜的闪光（在 'air' 层画）
  function drawChariotBack(ctx, it) {
    const g = corr(), c = CC[it.j], s = it.s;
    const [x0, y, e] = onPath(g, s, c.l);
    if (e.hw < 3) return;
    const intro = c01((W.lv.rsChase - c.e) * 12);
    const a = intro * (1 - smoothstep(0.05, 0.35, W.lv.rsClose)) * c01(e.wf * 1.4);
    if (a < 0.02) return;
    const h = FIG() * s * 1.1, wh = W.lv.rsWheels;
    const jig = Math.sin(W.t * 9 + c.ph) * 0.04 * h * wh;
    const tilt = c.tilt * 0.32 * wh;
    const HORSE = W.shade([58, 44, 36], 0.05, 0.06), BOX = W.shade([120, 88, 50], 0.05, 0.08), WHL = W.shade([70, 52, 34], 0.05, 0.05);
    const MAN = W.shade([90, 70, 52], 0.05, 0.05), KILT = W.shade([228, 220, 200], 0.05, 0.06), HELM = W.shade([176, 132, 70], 0.05, 0.1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(x0 + jig, y);
    // 马（在车前，稍远）
    ctx.fillStyle = rgba(HORSE, 1);
    ctx.beginPath();
    for (const d of [-1, 1]) {
      const hx = d * 0.17 * h + Math.sin(W.t * 7 + c.ph + d) * 0.02 * h * wh;
      ctx.moveTo(hx + 0.12 * h, -0.58 * h); ctx.ellipse(hx, -0.58 * h, 0.12 * h, 0.15 * h, 0, 0, TAU);
      ctx.moveTo(hx + d * 0.05 * h, -0.7 * h); ctx.lineTo(hx + d * 0.03 * h, -0.98 * h); ctx.lineTo(hx + d * 0.09 * h, -0.98 * h); ctx.lineTo(hx + d * 0.1 * h, -0.68 * h); ctx.closePath();
      ctx.moveTo(hx - 0.07 * h, -0.45 * h); ctx.lineTo(hx - 0.06 * h, -0.02 * h); ctx.lineTo(hx - 0.03 * h, -0.02 * h); ctx.lineTo(hx - 0.02 * h, -0.45 * h); ctx.closePath();
      ctx.moveTo(hx + 0.02 * h, -0.45 * h); ctx.lineTo(hx + 0.03 * h, -0.02 * h); ctx.lineTo(hx + 0.06 * h, -0.02 * h); ctx.lineTo(hx + 0.07 * h, -0.45 * h); ctx.closePath();
    }
    ctx.fill();
    ctx.rotate(tilt);
    // 车轮（侧看成窄窄的椭圆）
    ctx.strokeStyle = rgba(WHL, 1); ctx.lineWidth = Math.max(0.6, 0.04 * h);
    ctx.beginPath();
    for (const d of [-1, 1]) {
      if (c.tilt && wh > 0.5 && d === c.tilt) continue;          // 脱落的那一只
      ctx.moveTo(d * 0.36 * h + 0.05 * h, -0.22 * h); ctx.ellipse(d * 0.36 * h, -0.22 * h, 0.05 * h, 0.22 * h, 0, 0, TAU);
    }
    ctx.moveTo(-0.36 * h, -0.22 * h); ctx.lineTo(0.36 * h, -0.22 * h);
    ctx.stroke();
    // 车厢与站在车上的兵
    ctx.fillStyle = rgba(BOX, 1);
    ctx.beginPath(); ctx.moveTo(-0.3 * h, -0.28 * h); ctx.lineTo(-0.32 * h, -0.6 * h); ctx.quadraticCurveTo(0, -0.66 * h, 0.32 * h, -0.6 * h); ctx.lineTo(0.3 * h, -0.28 * h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(KILT, 1);
    ctx.beginPath(); ctx.moveTo(-0.11 * h, -0.6 * h); ctx.lineTo(-0.1 * h, -0.76 * h); ctx.lineTo(0.1 * h, -0.76 * h); ctx.lineTo(0.11 * h, -0.6 * h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(MAN, 1);
    ctx.beginPath(); ctx.moveTo(-0.095 * h, -0.75 * h); ctx.lineTo(-0.08 * h, -0.98 * h); ctx.lineTo(0.08 * h, -0.98 * h); ctx.lineTo(0.095 * h, -0.75 * h); ctx.closePath();
    ctx.moveTo(0.075 * h, -1.05 * h); ctx.arc(0, -1.05 * h, 0.075 * h, 0, TAU); ctx.fill();
    ctx.fillStyle = rgba(HELM, 1);
    ctx.beginPath(); ctx.arc(0, -1.06 * h, 0.082 * h, Math.PI, TAU); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(WHL, 1); ctx.lineWidth = Math.max(0.5, 0.025 * h);
    ctx.beginPath(); ctx.moveTo(0.14 * h, -0.62 * h); ctx.lineTo(0.22 * h, -1.35 * h); ctx.stroke();
    ctx.restore();
    // 脱落的车轮躺在沙上
    if (c.tilt && wh > 0.3) {
      ctx.globalAlpha = a * c01((wh - 0.3) * 3);
      ctx.strokeStyle = rgba(WHL, 1); ctx.lineWidth = Math.max(0.6, 0.04 * h);
      ctx.beginPath(); ctx.ellipse(x0 + c.tilt * 0.55 * h, y - 0.03 * h, 0.2 * h, 0.05 * h, 0, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (h > 6) {
      GL.push([x0 - 0.3 * h + jig, y - 0.6 * h, h * 0.1, a, c.ph]);
      GL.push([x0 + 0.3 * h + jig, y - 0.6 * h, h * 0.08, a, c.ph + 2]);
    }
  }
  // 耶和华从云火柱中观看：火光落在车队上，几道光自火柱射向他们
  function drawGaze(ctx, g) {
    const k = W.lv.rsGaze;
    if (k < 0.02) return;
    const P = pillarNow().find(p => p.sea);
    if (!P) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < NCH; j++) {
      const s = chariotS(j);
      if (s < 0) continue;
      const [x, y] = onPath(g, s, CC[j].l);
      glowE(ctx, SP.warm, x, y - FIG() * s * 0.5, FIG() * s * 1.5, FIG() * s * 0.9, 0.3 * k);
    }
    const cy0 = P.y * 0.72;
    ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      const s = 0.55 + 0.4 * rt(i * 7 + 880), l = 0.12 + 0.76 * (i / 6);
      const [x, y] = onPath(g, s, l);
      const fl = 0.6 + 0.4 * Math.sin(W.t * 3 + i * 1.3);
      ctx.strokeStyle = rgba([255, 214, 150], 0.07 * k * fl);
      ctx.lineWidth = (6 + 10 * rt(i + 881)) * Math.max(0.6, W.unit);
      ctx.beginPath(); ctx.moveTo(P.x, cy0); ctx.lineTo(x, y - FIG() * s * 0.6); ctx.stroke();
    }
    glowSp(ctx, SP.gold, P.x, cy0, 0.1 * W.w + 30, 0.5 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 水仍合：墙头向路心卷倒、翻成白浪；水从两边涌进路来；整段水墙一齐落下，白水翻滚、浪花迸溅；
  // 合拢之后海面上留着一道道白沫
  function drawClosing(ctx, g) {
    const c = W.lv.rsClose, fo = W.lv.rsFoam;
    const churn = S.closing && c > 0.001 && c < 0.999 ? smoothstep(0.03, 0.25, c) * (1 - smoothstep(0.86, 1, c)) : 0;
    if (fo < 0.01 && churn < 0.01) return;
    SP || sprites();
    const C = wallCols(), t = W.t, u = W.unit * (PHN() ? 1.3 : 1);
    if (churn > 0.01) {
      const sink = smoothstep(0.3, 0.85, c), flood = smoothstep(0.08, 0.4, c);
      for (let i = 2; i <= NS; i += 2) {
        const s = SS[i], e = geomAt(g, s, TMP), full = s * (g.xr - g.xl) * 0.5, hm = Math.max(e.hl, e.hr);
        // 两道墙头卷倒、翻成白浪
        for (const sd of [-1, 1]) {
          const H = sd < 0 ? e.hl : e.hr;
          if (H < 2) continue;
          const x = lerp(e.cx + sd * e.hw, e.cx, e.ln) + (sd > 0 ? e.ox : -e.oxl);
          glowE(ctx, SP.foam, x - sd * full * 0.05, e.y - H * 0.96, full * 0.26, H * 0.12 + 5 * s * u, 0.4 * churn);
        }
        // 涌进路来的水在路心相撞：一带翻滚的白水贴着水面，随水墙落下而铺开
        glowE(ctx, SP.foam, e.cx, e.y - hm * 0.28 - 3 * s * u, full * (0.4 + 0.6 * sink), 0.12 * s * g.wh * (0.35 + 0.65 * flood) * (1 - 0.45 * sink) + 4 * s * u, 0.24 * flood * churn);
      }
      // 翻滚的浪团：一团团白沫从墙头滚落
      for (let k = 0; k < 44; k++) {
        const s = 0.15 + 0.85 * Math.pow(rt(k * 7 + 1800), 0.8), e = geomAt(g, s, TMP);
        if (e.hw < 3) continue;
        const sd = rt(k * 13 + 1806) < 0.5 ? -1 : 1, H = sd < 0 ? e.hl : e.hr;
        const ph = U.fract(t * (0.3 + 0.25 * rt(k + 1801)) + rt(k * 3 + 1802));
        const f = (0.98 - 0.85 * ph) * (0.75 + 0.25 * rt(k * 11 + 1804));
        const x0 = lerp(e.cx + sd * e.hw, e.cx, e.ln) + (sd > 0 ? e.ox : -e.oxl);
        const x = lerp(x0, e.cx + sd * e.hw * (0.2 + 0.5 * rt(k * 5 + 1803)), ph) + Math.sin(ph * 5 + k) * 4 * s * u, y = e.y - H * f;
        const r = (5 + 11 * rt(k + 1805)) * s * u * (0.6 + 0.8 * ph);
        glowSp(ctx, SP.foam, x, y, r, 0.36 * churn * Math.sin(ph * Math.PI));
      }
      // 迸溅的浪花：从墙头向路心抛起又落下的一道道弧
      ctx.strokeStyle = rgba(C.foam, 0.75);
      ctx.fillStyle = rgba(C.foam, 0.8);
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(0.7, 1.3 * u);
      ctx.globalAlpha = churn;
      ctx.beginPath();
      const dots = [];
      for (let k = 0; k < 56; k++) {
        const s = 0.18 + 0.82 * Math.pow(rt(k * 3 + 910), 0.8), e = geomAt(g, s, TMP);
        const sd = rt(k * 11 + 913) < 0.5 ? -1 : 1, H = sd < 0 ? e.hl : e.hr;
        if (H < 4) continue;
        const ph = U.fract(t * (0.55 + 0.4 * rt(k * 5 + 911)) + rt(k * 7 + 912));
        const x0 = lerp(e.cx + sd * e.hw, e.cx, e.ln) + (sd > 0 ? e.ox : -e.oxl), y0 = e.y - H * 0.97;
        const rise = (30 + 30 * rt(k + 915)) * s * u, run = -sd * (10 + 24 * rt(k + 916)) * s * u;
        const P = q => [x0 + run * q, y0 - rise * 4 * q * (1 - q)];
        const [xa, ya] = P(Math.max(0, ph - 0.12)), [xb, yb] = P(ph);
        ctx.moveTo(xa, ya); ctx.quadraticCurveTo((xa + xb) / 2, Math.min(ya, yb) - 2 * s * u, xb, yb);
        dots.push(xb, yb, Math.max(0.6, (1.6 - ph) * 1.5 * s * u));
      }
      ctx.stroke();
      ctx.beginPath();
      for (let k = 0; k < dots.length; k += 3) { ctx.moveTo(dots[k] + dots[k + 2], dots[k + 1]); ctx.arc(dots[k], dots[k + 1], dots[k + 2], 0, TAU); }
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (fo > 0.01) {
      ctx.strokeStyle = rgba(C.foam, Math.min(0.6, 0.6 * fo));
      ctx.lineWidth = Math.max(0.6, 1.1 * u);
      ctx.beginPath();
      for (let k = 0; k < 90; k++) {
        const s = 0.04 + 0.96 * Math.pow(rt(k * 7 + 950), 0.85);
        const l = -0.3 + 1.6 * rt(k * 11 + 951);
        const x = cX(g, s, l) + Math.sin(t * 0.2 + k) * 4 * s, y = cY(g, s) + (rt(k * 13 + 952) - 0.5) * 4 * s;
        const L = (10 + 26 * rt(k * 5 + 953)) * s * u;
        ctx.moveTo(x - L / 2, y); ctx.quadraticCurveTo(x, y - 1.5 * s * u, x + L / 2, y);
      }
      ctx.stroke();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  云柱 · 火柱
  // ════════════════════════════════════════════════════════════
  const PA = {
    lead: { x: 0.745 }, etham: { x: 0.56 }, front: { x: 0.495 }, rear: { x: 0.842 }, rear2: { x: 0.72 },
    sea: { s: 0.4, l: 0.5 }, far: { s: 0.04, l: 0.5 },
    // 过海之后，云柱停在中丘上（营的后面），把近处的地留给百姓
    shore: { x: 0.9, layer: 1 }, marah: { x: 0.9, layer: 1 }, elim: { x: 0.93, layer: 1 }, sin: { x: 0.88, layer: 1 },
    reph: { x: 0.6, layer: 1 }, horeb: { x: 0.6, layer: 1 },
  };
  // 竖屏的手机上：柱不立在画面正中（言说的字写在正中），立在右边、百姓的前头
  const PA_PORT = { lead: 0.78, etham: 0.78, front: 0.77, rear2: 0.78 };
  const PORT = () => W.w < W.h * 0.9;
  function anchor(name) {
    const A = PA[name] || PA.lead;
    if (A.x != null) {
      const l = A.layer || 2;
      const ax = PORT() && PA_PORT[name] != null ? PA_PORT[name] : A.x;
      return { x: ax * W.w, y: gY(l, ax) + (l === 2 ? 2 * LS(2) : 1), k: l === 2 ? 1 : 0.66, sea: false, layer: l, a: 1 };
    }
    const g = corr();
    return { x: cX(g, A.s, A.l), y: cY(g, A.s), k: A.s * 1.1, sea: true, layer: -1, a: 1 };
  }
  function movePillar(name, instant) {
    if (instant || W.replaying) { S.pA = S.pB = name; W.set('rsPm', 1, true); return; }
    S.pA = S.pB; S.pB = name;
    W.set('rsPm', 0, true); W.set('rsPm', 1);
  }
  function pillarNow() {
    const m = W.lv.rsPm, a = W.lv.rsCloud;
    const B = anchor(S.pB);
    if (S.pA === S.pB || m >= 0.999) { B.a = a; return [B]; }
    const A = anchor(S.pA);
    if (A.layer !== B.layer) {
      // 只有一根柱：旧处的柱先升起、隐去，新处的柱才自天降下（不让两根柱同时立着）
      A.a = a * (1 - smoothstep(0.3, 0.46, m)); A.rise = smoothstep(0, 0.44, m);
      B.a = a * smoothstep(0.46, 0.6, m); B.rise = 1 - smoothstep(0.5, 1, m);
      return [A, B];
    }
    const e = ease(m);
    return [{ x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), k: lerp(A.k, B.k, e), sea: B.sea, layer: B.layer, a }];
  }
  function drawPillar(ctx, bx, by, k, a, rise) {
    if (a < 0.01) return;
    SP || sprites();
    const u = Math.max(0.42, W.unit) * (PHN() ? 1.2 : 1) * Math.max(k, 0.42);
    const fire = fireK(), cloud = 1 - fire, dark = W.lv.rsDark, glory = W.lv.rsGlory;
    const hw0 = 34 * u, hw1 = 60 * u;
    // 柱顶在画面顶上的一带（卷名与按钮）淡去：不冲淡卷名，也不在按钮后面发白
    const top = 0.015 * W.h, t = W.t;
    const hud = y => 0.3 + 0.7 * smoothstep(34, 120, y);
    const desc = eOut(W.lv.rsCloud) * (1 - (rise || 0));   // 自天降下，立在地上（挪移时先升起）
    const byE = lerp(top + 0.3 * W.h, by, desc);
    const Hh = byE - top;
    const N = 30;
    // 火光照地
    if (fire > 0.02 && desc > 0.5) {
      ctx.globalCompositeOperation = 'lighter';
      glowE(ctx, SP.warm, bx, by - 6 * u, 230 * u, 70 * u, a * fire * 0.55);
      glowSp(ctx, SP.warm, bx, byE - Hh * 0.15, 170 * u, a * fire * 0.28);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 荣光
    if (glory > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, bx, byE - Hh * 0.3, 320 * u, a * glory * 0.7);
      glowSp(ctx, SP.gold, bx, byE - Hh * 0.65, 260 * u, a * glory * 0.55);
      // 光芒：一道道两端都淡去的柔光（不是描出来的线），也不伸进画面顶上的按钮
      const cy = byE - Hh * 0.45, yMin = 0.09 * W.h;
      for (let i = 0; i < 12; i++) {
        const an = (i / 12) * TAU + t * 0.05, dx = Math.cos(an), dy = Math.sin(an) * 1.6, dl = Math.hypot(dx, dy);
        const r0 = hw1 * 1.2 * dl;
        let r1 = hw1 * (3.2 + 1.2 * Math.sin(t * 0.7 + i * 2)) * dl;
        if (dy < 0) r1 = Math.min(r1, (cy - yMin) / (-dy / dl));
        if (r1 < r0 + 4) continue;
        const rm = (r0 + r1) / 2, rl = (r1 - r0) / 2;
        ctx.save();
        ctx.translate(bx, cy); ctx.rotate(Math.atan2(dy, dx));
        glowE(ctx, SP.gold, rm, 0, rl, (5 + 3 * Math.sin(t * 1.1 + i)) * u, a * glory * 0.18);
        ctx.restore();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 云柱：层层翻涌、缓缓上升的云，里面透着光
    if (cloud > 0.02) {
      const lum = 0.5 + 0.5 * W.daylight;
      ctx.globalAlpha = a * cloud * 0.55 * lum;
      ctx.drawImage(SP.col, bx - hw1 * 1.2, top, hw1 * 2.4, Hh + 8 * u);
      for (let i = 0; i < N; i++) {
        const ph = U.fract(t * 0.028 + i / N);
        const y = byE - ph * Hh;
        const r = lerp(hw0, hw1, ph) * (0.95 + 0.45 * rt(i * 7));
        const x = bx + Math.sin(t * 0.4 + i * 1.7) * r * 0.18 + (rt(i * 3) - 0.5) * r * 0.5;
        const al = a * cloud * Math.min(1, ph * 14 + 0.2) * Math.min(1, (1 - ph) * 3.5) * hud(y - r * 0.5);
        if (al < 0.01) continue;
        ctx.globalAlpha = al * 0.38;
        ctx.drawImage(SP.cloudSh, x - r + r * 0.22, y - r + r * 0.26, r * 2, r * 2);
        ctx.globalAlpha = al * 0.92 * lum * (1 - 0.45 * glory);
        ctx.drawImage(SP.cloud, x - r, y - r, r * 2, r * 2);
        if (glory > 0.02) { ctx.globalAlpha = al * 0.7 * glory; ctx.drawImage(SP.cloudG, x - r * 0.9, y - r * 0.9, r * 1.8, r * 1.8); }
      }
      const warm = Math.max(W.dusk * 0.8, glory);
      ctx.globalCompositeOperation = 'lighter';
      if (warm > 0.03) {
        ctx.globalAlpha = a * cloud * 0.35 * warm;
        ctx.drawImage(SP.colF, bx - hw1, top, hw1 * 2, Hh);
      }
      ctx.globalAlpha = a * cloud * 0.22;
      ctx.drawImage(SP.col, bx - hw0 * 0.9, top, hw0 * 1.8, Hh);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 火柱：一整根翻腾的火，不是一线光
    if (fire > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glowE(ctx, SP.warm, bx, byE - Hh * 0.45, hw1 * 3.4, Hh * 0.6, a * fire * 0.2);
      ctx.globalAlpha = a * fire * 0.42;
      ctx.drawImage(SP.colF, bx - hw1 * 1.35, top, hw1 * 2.7, Hh + 6 * u);
      // 外层：橙红的焰，竖着拉长，翻腾上升
      for (let i = 0; i < N; i++) {
        const ph = U.fract(t * 0.075 + i / N);
        const y = byE - ph * Hh;
        const r = lerp(hw0, hw1, ph) * (0.8 + 0.4 * rt(i * 5 + 3));
        const x = bx + Math.sin(t * 1.3 + i * 2.1) * r * 0.25 + (rt(i * 9) - 0.5) * r * 0.7;
        const al = a * fire * Math.min(1, ph * 10 + 0.3) * Math.min(1, (1 - ph) * 3) * 0.34 * hud(y - r);
        glowE(ctx, SP.fireO, x, y, r * 0.62, r * (1.35 + 0.3 * Math.sin(t * 5 + i)), al);
      }
      // 内层：金黄的焰
      for (let i = 0; i < N; i++) {
        const ph = U.fract(t * 0.1 + (i + 0.5) / N);
        const y = byE - ph * Hh;
        const r = lerp(hw0, hw1, ph) * (0.55 + 0.3 * rt(i * 13 + 5));
        const x = bx + Math.sin(t * 1.7 + i * 1.3) * r * 0.2 + (rt(i * 17) - 0.5) * r * 0.35;
        const al = a * fire * Math.min(1, ph * 10 + 0.3) * Math.min(1, (1 - ph) * 3) * 0.3 * hud(y - r);
        glowE(ctx, SP.fire, x, y, r * 0.5, r * 1.2, al);
      }
      ctx.globalAlpha = a * fire * 0.28;
      ctx.drawImage(SP.colF, bx - hw0 * 0.9, top, hw0 * 1.8, Hh);
      // 飞升的火星
      ctx.fillStyle = 'rgb(255,220,150)';
      for (let i = 0; i < 22; i++) {
        const ph = U.fract(t * (0.12 + 0.05 * rt(i * 3 + 60)) + rt(i * 7 + 61));
        const x = bx + (rt(i * 11 + 62) - 0.5) * hw1 * 2.6 + Math.sin(t * 2 + i) * 6 * u, y = byE - ph * Hh * 0.85;
        ctx.globalAlpha = a * fire * (1 - ph) * 0.8 * hud(y);
        ctx.beginPath(); ctx.arc(x, y, 0.9 * u + 0.4, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (desc > 0.9) flame(ctx, bx, by + 2 * u, 56 * u, a * fire, 3.1);
    }
    // 向埃及营的一边是黑暗：只在柱脚的那一边压一层低低的暗（黑云本身另画在埃及营的上空）
    if (dark > 0.02 && desc > 0.5) {
      for (let i = 0; i < 3; i++) glowE(ctx, SP.dark, bx + hw1 * (1.1 + 0.5 * i), by - hw1 * (0.4 + 0.35 * i), hw1 * (1.3 - 0.2 * i), hw1 * (0.8 - 0.1 * i), a * dark * 0.32);
    }
    ctx.globalAlpha = 1;
    pk(fire > 0.5 ? '火柱' : '云柱', bx, byE - Math.min(Hh * 0.45, 0.3 * W.h), hw1 * 1.2);
  }

  // ════════════════════════════════════════════════════════════
  //  营地：帐棚 · 约瑟的骸骨
  // ════════════════════════════════════════════════════════════
  const SITES = {
    etham: { n: [0.635, 0.695, 0.76, 0.825, 0.885, 0.945, 0.995], m: [0.61, 0.69, 0.77, 0.85, 0.93], chest: 0.72 },
    // 海边的营：帐棚都在路口（画面正中）的右边，海分开时不挡在路口前
    sea: { n: [0.635, 0.69, 0.745, 0.8, 0.855], m: [0.6, 0.67, 0.74, 0.8], chest: 0.665 },
    elim: { n: [0.82, 0.875, 0.93, 0.985], m: [0.8, 0.87, 0.94], chest: null },
    sin: { n: [0.665, 0.725, 0.79, 0.855, 0.92, 0.98], m: [0.6, 0.68, 0.76, 0.84, 0.92], chest: null },
    reph: { n: [0.905, 0.965], m: [0.62, 0.7, 0.78, 0.86, 0.94], chest: null },
    horeb: { n: [0.705, 0.765, 0.825, 0.885, 0.945, 0.995], m: [0.6, 0.68, 0.76, 0.84, 0.92], chest: null },
  };
  function setSite(name, instant) {
    if (instant || W.replaying) { S.siteA = S.siteB = name; W.set('rsCamp', 1, true); return; }
    S.siteA = S.siteB; S.siteB = name;
    W.set('rsCamp', 0, true); W.set('rsCamp', 1);
  }
  function drawTent(ctx, xf, l, size, a, seed) {
    if (a < 0.01) return;
    const s = LS(l) * size, x = xf * W.w, y = gY(l, xf) + 2 * s, hw = 30 * s, h = 22 * s * (0.3 + 0.7 * eOut(a));
    const k0 = 0.86 + 0.1 * rt(seed), k1 = 1 + 0.08 * rt(seed + 1), k2 = 0.84 + 0.1 * rt(seed + 2), tilt = (rt(seed + 3) - 0.5) * 0.06;
    ctx.globalAlpha = a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k0 * h * 0.86); ctx.lineTo(x - 1.36 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k2 * h * 0.84); ctx.lineTo(x + 1.34 * hw, y);
    ctx.stroke();
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k0], [-0.3, -0.74], [0.02, -k1 - 0.06], [0.32, -0.76], [0.62, -0.86 * k2], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css([58, 46, 40], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 72, 60], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.66, -0.34, 0.34, 0.66]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.74 - Math.abs(f) * 0.06) * h); }
    ctx.stroke();
    const dw = 0.2 * hw, dh = 0.62 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    const lk = clamp(nightK() * 1.05, 0, 1) * 0.8 + W.lv.rsRest * 0.3;
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * Math.min(1, lk) * 0.5;
      ctx.fillStyle = 'rgb(255,168,90)';
      ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, y - dh * 0.5, hw * 1.1, a * Math.min(1, lk), seed);
    }
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = a * 0.5;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const a0 = d > 0 ? 4 : 1, a1 = d > 0 ? 7 : 4;
    for (let i = a0; i <= a1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * tilt) * hw, Y1 = y + q[1] * h; if (i === a0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (l === 2) pk('以色列的营', x, y - h * 1.1, hw * 1.1);
  }
  function drawCamp(ctx, layer) {
    const m = W.lv.rsCamp;
    const L2 = S.siteA === S.siteB ? [[S.siteB, 1]] : [[S.siteA, 1 - m], [S.siteB, m]];
    for (const [name, a] of L2) {
      if (!name || a < 0.01) continue;
      const site = SITES[name];
      if (!site) continue;
      const list = layer === 2 ? site.n : site.m;
      for (let i = 0; i < list.length; i++) {
        const k = c01(a * 1.6 - (i / list.length) * 0.6);
        drawTent(ctx, list[i], layer, layer === 2 ? 0.92 + 0.12 * rt(i * 5 + (layer * 50)) : 1.05, k, i * 7 + layer * 31 + name.length);
      }
    }
  }
  // 约瑟的骸骨（棺）：抬着走，或放在营中
  function chestAt() {
    if (S.chest === 'carried') {
      const b1 = fig('bearer1'), b2 = fig('bearer2');
      if (!b1 || !b2 || !b1._vis || !b2._vis) return null;
      const x = (b1._x + b2._x) / 2, y = Math.min(b1._y, b2._y) - b1._h * 0.86;
      return { x, y, s: b1._h / 44, a: Math.min(b1.alpha, b2.alpha), ground: false };
    }
    if (S.chest === 'camp' && S.siteB && SITES[S.siteB] && SITES[S.siteB].chest != null) {
      const xf = SITES[S.siteB].chest, s = LS(2);
      return { x: xf * W.w, y: fY(2, xf, 0.05), s: s * 0.95, a: W.lv.rsCamp, ground: true };
    }
    return null;
  }
  function drawChest(ctx, ground) {
    const c = chestAt();
    if (!c || c.ground !== ground || c.a < 0.02) return;
    const s = c.s * (PHN() ? 1.2 : 1), x = c.x, y = c.y, L = 17 * s, H = 7.5 * s;
    ctx.globalAlpha = c.a;
    ctx.fillStyle = W.shadeCSS([110, 78, 48], 0);
    ctx.fillRect(x - L / 2, y - H, L, H);
    ctx.fillStyle = W.shadeCSS([146, 108, 66], 0, 1, 0.1);
    ctx.fillRect(x - L / 2 - 0.8 * s, y - H - 1.6 * s, L + 1.6 * s, 1.8 * s);
    ctx.strokeStyle = W.shadeCSS([196, 160, 96], 0, 1, 0.15);
    ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.strokeRect(x - L / 2 + 1.2 * s, y - H + 1.2 * s, L - 2.4 * s, H - 2.4 * s);
    if (!ground) {
      ctx.strokeStyle = W.shadeCSS([84, 62, 42], 0);
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(x - L * 0.95, y - H * 0.3); ctx.lineTo(x + L * 0.95, y - H * 0.3); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    pk('约瑟的骸骨', x, y - H, L);
  }

  // ════════════════════════════════════════════════════════════
  //  法老的车辆（岸上，侧看）
  // ════════════════════════════════════════════════════════════
  // 车队停在营的右边，与以色列人最后的人之间空着一段（终夜两下不得相近，14:20）
  const CHN = [[0.918, 0.03], [0.97, 0.12], [1.025, 0.05], [1.08, 0.16], [0.94, 0.27], [0.995, 0.33], [1.05, 0.4], [0.965, 0.5], [1.02, 0.58], [1.1, 0.3]];
  const CHM = [0.89, 0.94, 0.99, 1.04, 1.09];
  function chariotSide(ctx, x, y, s, ph, gait, a, l) {
    const d = -1;
    ctx.globalAlpha = a;
    const HORSE = [62, 46, 36], HORSE2 = [84, 62, 46], BRZ = [176, 132, 70], WD = [96, 70, 44];
    for (const k of [1, 0]) {
      const hx = x + d * (23 + k * 3) * s, hy = y - 13 * s - k * 1.3 * s, col = k ? HORSE2 : HORSE;
      ctx.strokeStyle = css(col, l); ctx.lineWidth = Math.max(0.7, 1.5 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (const [ox, o] of [[-6.5, 0], [-5, Math.PI], [5.5, Math.PI * 0.5], [7, Math.PI * 1.5]]) {
        const sw = Math.sin(ph + o + k) * 3.2 * s * gait, lift = Math.max(0, Math.cos(ph + o + k)) * 2 * s * gait;
        const kx = hx + d * (ox * s + sw * 0.5), ky = hy + 6.5 * s - lift * 0.5;
        ctx.moveTo(hx + d * ox * s, hy + 1 * s); ctx.lineTo(kx, ky); ctx.lineTo(hx + d * (ox * s + sw), y - k * 1.3 * s - lift);
      }
      ctx.stroke();
      ctx.fillStyle = css(col, l);
      ctx.beginPath(); ctx.ellipse(hx, hy, 9.5 * s, 4.4 * s, 0, 0, TAU); ctx.fill();
      const bob = Math.sin(ph * 2 + k) * 0.6 * s * gait;
      ctx.beginPath();
      ctx.moveTo(hx + d * 5 * s, hy - 2.5 * s); ctx.quadraticCurveTo(hx + d * 9 * s, hy - 9 * s + bob, hx + d * 12.5 * s, hy - 12 * s + bob);
      ctx.lineTo(hx + d * 15.5 * s, hy - 8.4 * s + bob); ctx.lineTo(hx + d * 13.4 * s, hy - 7.6 * s + bob);
      ctx.quadraticCurveTo(hx + d * 10 * s, hy - 5 * s, hx + d * 8.5 * s, hy + 1.5 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([150, 60, 50], l); ctx.lineWidth = Math.max(0.5, 1 * s);
      ctx.beginPath(); ctx.moveTo(hx + d * 12.5 * s, hy - 12 * s + bob); ctx.lineTo(hx + d * 12 * s, hy - 16 * s + bob); ctx.stroke();
      if (k === 0) GL.push([hx + d * 12 * s, hy - 15 * s + bob, 2.4 * s, a, x * 0.01]);
    }
    ctx.strokeStyle = css(WD, l); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 4 * s, y - 5.5 * s); ctx.quadraticCurveTo(x + d * 12 * s, y - 8 * s, x + d * 20 * s, y - 15 * s); ctx.stroke();
    // 轮
    const r = 5.6 * s, wx = x - d * 1 * s, wy = y - r;
    ctx.strokeStyle = css([110, 80, 46], l); ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath(); ctx.arc(wx, wy, r, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const an = ph * 0.6 + i * Math.PI / 3; ctx.moveTo(wx + Math.cos(an) * r, wy + Math.sin(an) * r); ctx.lineTo(wx - Math.cos(an) * r, wy - Math.sin(an) * r); }
    ctx.stroke();
    // 车厢
    ctx.fillStyle = css(BRZ, l, 1, 0.05);
    ctx.beginPath(); ctx.moveTo(x - 6 * s, y - 5 * s); ctx.lineTo(x + 5 * s, y - 5 * s); ctx.quadraticCurveTo(x + 7 * s, y - 11 * s, x + 4 * s, y - 13 * s); ctx.lineTo(x - 6 * s, y - 12 * s); ctx.closePath(); ctx.fill();
    // 车兵：白麻布的短裙，深色的身与头，头上一顶铜盔，手里一杆枪
    ctx.fillStyle = css([228, 220, 200], l, 1, 0.04);
    ctx.beginPath(); ctx.moveTo(x - 2.8 * s, y - 12 * s); ctx.lineTo(x - 2.3 * s, y - 18.5 * s); ctx.lineTo(x + 2.3 * s, y - 18.5 * s); ctx.lineTo(x + 2.8 * s, y - 12 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([90, 70, 52], l);
    ctx.beginPath(); ctx.moveTo(x - 2.1 * s, y - 18 * s); ctx.lineTo(x - 1.8 * s, y - 24 * s); ctx.lineTo(x + 2 * s, y - 24 * s); ctx.lineTo(x + 2.2 * s, y - 18 * s); ctx.closePath();
    ctx.moveTo(x + 2.3 * s, y - 26.4 * s); ctx.arc(x, y - 26.4 * s, 2.3 * s, 0, TAU); ctx.fill();
    ctx.fillStyle = css([176, 132, 70], l, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(x - 2.6 * s, y - 26.6 * s); ctx.quadraticCurveTo(x, y - 30.6 * s, x + 2.6 * s, y - 26.6 * s); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([80, 64, 48], l); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x + 3 * s, y - 16 * s); ctx.lineTo(x - 8 * s, y - 38 * s); ctx.stroke();
    ctx.globalAlpha = 1;
    GL.push([x + 4 * s, y - 12.5 * s, 2.6 * s, a, x * 0.013 + 1]);
    GL.push([x + 0.6 * s, y - 29 * s, 1.8 * s, a * 0.8, x * 0.021 + 3]);
  }
  // 车队的位置：自西（右）赶来；跟着下到海中时，一辆一辆驶向路口（岸线上，画面正中）
  const DIVE_X = MOUTH + 0.012;
  function armyX(x0, v) {
    const ar = W.lv.rsArmy, dv = W.lv.rsDive;
    let x = x0 + (1 - eOut(ar)) * 0.55;
    if (dv > 0) x = lerp(x, DIVE_X + v * 0.03, ease(dv));
    return x;
  }
  // 纵深：驶近路口时都收到岸线上（v → 0），才好下到路口里去
  const armyV = v => v * (1 - ease(c01(W.lv.rsDive * 1.15)));
  function drawArmy(ctx, layer) {
    const ar = W.lv.rsArmy;
    if (ar < 0.002) return;
    SP || sprites();
    const moving = Math.abs(W.lt.rsArmy - ar) > 1e-3 || Math.abs(W.lt.rsDive - W.lv.rsDive) > 1e-3;
    const gait = moving ? 1 : 0;
    // 全在黑暗里时，只剩几点铜光（14:20）
    if (W.lv.rsDark > 0.9 && !moving) {
      if (layer === 2) for (let i = 0; i < CHN.length; i++) { const [x0, v0] = CHN[i], x = armyX(x0, v0), v = armyV(v0); if (x > 1.05) continue; const s = LS(2) * (1 + 0.35 * v) * 1.15, y = fY(2, x, v * 0.8); GL.push([x * W.w + 4 * s, y - 12.5 * s, 2.6 * s, 1, i * 1.7]); }
      return;
    }
    const ph = W.t * 9;
    if (layer === 2) {
      for (let i = CHN.length - 1; i >= 0; i--) {
        const [x0, v0] = CHN[i];
        const x = armyX(x0, v0), v = armyV(v0);
        // 到了路口便没入海中的路（路里自后看去的车接着往前赶）
        const a = c01(ar * 4) * (1 - smoothstep(0.8, 0.99, W.lv.rsDive));
        if (a < 0.02 || x > 1.12) continue;
        const s = LS(2) * (1 + 0.35 * v) * 1.15, y = fY(2, x, v * 0.8);
        if (moving) {
          for (let k = 0; k < 3; k++) {
            const q = U.fract(W.t * 0.8 + k / 3 + i * 0.37);
            glowE(ctx, SP.dust, x * W.w + (18 + q * 40) * s, y - (4 + q * 10) * s, (10 + q * 22) * s, (6 + q * 12) * s, 0.35 * (1 - q) * a * dayA());
          }
          ctx.globalAlpha = 1;
        }
        chariotSide(ctx, x * W.w, y, s, ph + i * 1.3, gait, a, 2);
        pk('法老的车', x * W.w, y - 30 * s, 26 * s);
      }
    } else if (layer === 1) {
      for (let i = CHM.length - 1; i >= 0; i--) {
        const x = CHM[i] + (1 - eOut(ar)) * 0.55;
        const a = c01(ar * 4) * (1 - W.lv.rsDive);
        if (a < 0.02 || x > 1.1) continue;
        const s = LS(1) * 0.95, y = gY(1, x) + 1;
        chariotSide(ctx, x * W.w, y, s, ph + i * 1.7, gait, a, 1);
      }
    }
  }
  function drawGlints(ctx) {
    if (!GL.length) return;
    const dk = W.lv.rsDark, lowSun = Math.max(W.dusk * 1.2, 0.4 * fireK(), 0.35);
    for (const q of GL) {
      const b = Math.pow(0.5 + 0.5 * Math.sin(W.t * 2.1 + q[4] * 7.3), 10);
      const a = q[3] * (0.15 + 0.85 * b) * (0.35 + 0.65 * lowSun) * (1 - 0.7 * dk);
      glint(ctx, q[0], q[1], Math.max(1.2, q[2]), a);
    }
    GL.length = 0;
  }
  // 一边黑暗（14:20）：云柱向埃及营的那一边——一团压在埃及营上的黑云。
  // 由许多大小不一、互相叠着的云团组成，边上参差；贴着地最浓，往上渐淡，到海平线之上便化开（不是一道竖的黑条）
  const DARK = [];
  (function () {
    const r = U.mulberry32(1420);
    for (let i = 0; i < 26; i++) {
      const hgt = Math.pow(r(), 1.6);                 // 多数的云团低低的
      DARK.push({ dx: 0.03 + 0.34 * r(), hgt, rx: 0.045 + 0.075 * r() * (1 - 0.4 * hgt), ry: 0.035 + 0.05 * r(), a: 0.55 + 0.45 * r(), ph: r() * TAU, sp: 0.04 + 0.06 * r() });
    }
    // 边上零碎的小云（参差的边）
    for (let i = 0; i < 12; i++) DARK.push({ dx: 0.02 + 0.36 * r(), hgt: 0.3 + 0.55 * r(), rx: 0.018 + 0.025 * r(), ry: 0.014 + 0.02 * r(), a: 0.5 + 0.4 * r(), ph: r() * TAU, sp: 0.08 + 0.08 * r() });
  })();
  function drawDarkness(ctx) {
    const k = W.lv.rsDark;
    if (k < 0.01) return;
    SP || sprites();
    const P = pillarNow()[0];
    const bx = P && P.layer === 2 ? P.x : 0.8 * W.w;
    const hz = W.horizonY;
    for (const d of DARK) {
      const x = bx + (d.dx + 0.012 * Math.sin(W.t * d.sp + d.ph)) * W.w;
      if (x - d.rx * W.w > W.w * 1.05) continue;
      const g = gY(2, clamp(x / W.w, 0, 1));
      // 高度：自近地（营的地面）升到海平线之上一点
      const y = lerp(g + 0.02 * W.h, hz - 0.1 * W.h, d.hgt) + 0.006 * W.h * Math.sin(W.t * d.sp * 1.3 + d.ph);
      // 在天上的部分淡得多，到了海平线之上一成便化开
      const sky = 1 - smoothstep(hz - 0.12 * W.h, hz + 0.02 * W.h, y);
      const fade = (1 - 0.75 * sky) * c01((x - bx) / (0.05 * W.w) + 0.2);
      const rx = d.rx * W.w * (1 + 0.06 * Math.sin(W.t * d.sp * 2 + d.ph)), ry = d.ry * W.h;
      glowE(ctx, SP.dark, x, y, rx, ry, k * 0.66 * d.a * fade);
    }
    ctx.globalAlpha = 1;
  }
  // 大东风：海面上自左而右掠过的风纹
  function drawWind(ctx) {
    const k = Math.max(W.lv.rsWind, 0);
    if (k < 0.02) return;
    const g = corr(), hz = W.horizonY;
    ctx.strokeStyle = rgba(W.shade([226, 236, 246], 0.1, 0.3), 0.2 * k);
    ctx.lineWidth = Math.max(0.5, 0.8 * W.unit);
    ctx.beginPath();
    for (let i = 0; i < 46; i++) {
      const y = hz + (0.03 + 0.95 * Math.pow(rt(i * 3 + 700), 1.3)) * (W.h - hz);
      const s = W.seaScale(y) / Math.max(0.3, W.unit);
      const sp = (0.18 + 0.2 * rt(i * 5 + 701)) * W.w;
      const L = (0.04 + 0.06 * rt(i * 7 + 702)) * W.w * s;
      const x = ((rt(i * 11 + 703) * 1.4 * W.w + W.t * sp) % (1.4 * W.w)) - 0.2 * W.w;
      if (x > g.xs + 0.05 * W.w && y > gY(2, clamp((x + L) / W.w, 0, 1)) - 3) continue;
      if (x + L > W.w * 1.02) continue;
      const sd = (y - g.hz) / Math.max(1, g.yb - g.hz);
      if (seaOpenK() > 0.05 && sd <= 1.45 && x + L > cX(g, sd, -0.3) && x < cX(g, sd, 1.3)) continue;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + L * 0.5, y - 2 * s, x + L, y);
    }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  对岸的旷野 · 神的山
  // ════════════════════════════════════════════════════════════
  function drawFarShore(ctx) {
    const hz = W.horizonY, x0 = (VANISH - 0.3) * W.w, x1 = (VANISH + 0.14) * W.w, n = 44;
    ctx.fillStyle = W.shadeCSS([128, 112, 100], 0.86);
    ctx.beginPath(); ctx.moveTo(x0, hz + 1.5);
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = lerp(x0, x1, t);
      const taper = smoothstep(0, 0.2, t) * (1 - smoothstep(0.75, 1, t));
      const h = (0.004 + 0.011 * (0.5 + 0.5 * U.fbm1(t * 5.3 + 2.3, 3)) + 0.006 * Math.exp(-Math.pow((t - 0.58) / 0.08, 2))) * W.h * taper;
      ctx.lineTo(x, hz - h);
    }
    ctx.lineTo(x1, hz + 1.5); ctx.closePath(); ctx.fill();
  }
  const HOREB = [];
  (function () { const r = U.mulberry32(911); for (let i = 0; i <= 24; i++) { const t = i / 24; HOREB.push([t, Math.pow(Math.sin(t * Math.PI), 1.25) * (0.82 + 0.18 * r()) + (t > 0.36 && t < 0.52 ? 0.1 : 0)]); } })();
  function drawHoreb(ctx) {
    const k = W.lv.rsHoreb;
    if (k < 0.01) return;
    const cx = 0.8 * W.w, hwid = 0.15 * W.w, base = W.waterlineY(0) + 2;
    const H = (0.12 * W.h) * (0.55 + 0.45 * k);
    ctx.globalAlpha = k;
    ctx.fillStyle = W.shadeCSS([112, 94, 90], 0.72);
    ctx.beginPath(); ctx.moveTo(cx - hwid, base);
    for (const [t, h] of HOREB) ctx.lineTo(cx - hwid + t * 2 * hwid, W.horizonY - 0.01 * W.h - h * H);
    ctx.lineTo(cx + hwid, base); ctx.closePath(); ctx.fill();
    const d = litX() >= cx ? 1 : -1;
    ctx.strokeStyle = W.shadeCSS([230, 206, 180], 0.6, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, W.unit);
    ctx.beginPath();
    let pen = false;
    for (const [t, h] of HOREB) { const on = d > 0 ? t > 0.4 : t < 0.6; const X = cx - hwid + t * 2 * hwid, Y = W.horizonY - 0.01 * W.h - h * H; if (!on) { pen = false; continue; } if (pen) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); pen = true; } }
    ctx.stroke();
    ctx.globalAlpha = 1;
    pk('神的山', cx, W.horizonY - H * 0.8, 0.1 * W.w);
  }

  // ════════════════════════════════════════════════════════════
  //  米利暗的鼓
  // ════════════════════════════════════════════════════════════
  const WOMEN = ['miriam', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6'];
  // 鼓举在举起的手上方、身前，侧着看是一个斜的椭圆（不挡住头）；一左一右地错开
  function drawTimbrels(ctx) {
    const k = W.lv.rsDance;
    if (k < 0.02) return;
    SP || sprites();
    for (let i = 0; i < WOMEN.length; i++) {
      const p = fig(WOMEN[i]);
      if (!p || !p._vis || p.alpha < 0.1 || p.pose !== 'raise') continue;
      const h = p._h, d = p.fd >= 0 ? 1 : -1, alt = i % 2;
      const beat = Math.pow(Math.max(0, Math.sin(W.t * 5.2 + i * 0.9)), 6), sw = Math.sin(W.t * 2.6 + i);
      const x = p._x + d * (0.13 + 0.09 * alt) * h + sw * 0.02 * h, y = p._y - (1.24 + 0.06 * alt) * h - beat * 0.05 * h;
      const r = 0.085 * h, rot = (0.5 + 0.15 * sw) * d * (alt ? -1 : 1);
      ctx.globalAlpha = k * p.alpha;
      ctx.fillStyle = W.shadeCSS([224, 204, 164], 0, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.45, rot, 0, TAU); ctx.fill();
      ctx.strokeStyle = W.shadeCSS([112, 76, 46], 0);
      ctx.lineWidth = Math.max(0.6, r * 0.2);
      ctx.stroke();
      // 鼓边上的小铃
      ctx.fillStyle = W.shadeCSS([220, 182, 100], 0, 1, 0.15);
      ctx.beginPath();
      const cr = Math.cos(rot), sr = Math.sin(rot), jr = Math.max(0.5, r * 0.15);
      for (let j = 0; j < 3; j++) {
        const an = (j / 3) * TAU + 0.5, ex = Math.cos(an) * r, ey = Math.sin(an) * r * 0.45;
        const jx = x + ex * cr - ey * sr, jy = y + ex * sr + ey * cr;
        ctx.moveTo(jx + jr, jy); ctx.arc(jx, jy, jr, 0, TAU);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y, r * 3, k * beat * 0.45 * p.alpha);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  摩西的杖
  // ════════════════════════════════════════════════════════════
  // 人物模块在「举手」的姿势里把杖平放在地上；摩西举手时，这里另画一根举在手里的杖（S.lift）
  function liftedStaff(p) {
    const h = p._h, d = p.fd >= 0 ? 1 : -1;
    const hx = p._x + d * 0.09 * h, hy = p._y - 1.1 * h, ax = d * Math.sin(0.2), ay = -Math.cos(0.2);
    return { h, x0: hx - ax * 0.4 * h, y0: hy - ay * 0.4 * h, x1: hx + ax * 0.72 * h, y1: hy + ay * 0.72 * h };
  }
  function liftStaff(on) {
    S.lift = !!on;
    prop('moses', on ? null : 'staff');
  }
  function drawLiftedStaff(ctx) {
    if (!S.lift) return;
    const p = fig('moses');
    if (!p || !p._vis || p.alpha < 0.05 || p.pose !== 'raise') return;
    const q = liftedStaff(p);
    ctx.globalAlpha = p.alpha;
    ctx.strokeStyle = W.shadeCSS([106, 80, 54], 0, 1, 0.06);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 0.036 * q.h);
    ctx.beginPath(); ctx.moveTo(q.x0, q.y0); ctx.lineTo(q.x1, q.y1); ctx.stroke();
    ctx.globalAlpha = 1;
    glint(ctx, q.x1, q.y1, Math.max(2, 0.07 * q.h), 0.3 * p.alpha * (0.75 + 0.25 * Math.sin(W.t * 2.3)));
  }
  // 杖头的一点光（14:21 摩西向海伸杖）
  function drawRod(ctx) {
    const k = W.lv.rsRod;
    if (k < 0.02) return;
    const p = fig('moses');
    if (!p || !p._vis || p.alpha < 0.05) return;
    const h = p._h, d = p.fd >= 0 ? 1 : -1;
    let x = p._x + d * 0.3 * h, y = p._y - 1.08 * h;
    if (p.pose === 'raise' && S.lift) { const q = liftedStaff(p); x = q.x1; y = q.y1; }
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.white, x, y, 0.9 * h, 0.25 * k);
    ctx.globalCompositeOperation = 'source-over';
    glint(ctx, x, y, Math.max(3, 0.16 * h) * (0.85 + 0.15 * Math.sin(W.t * 5)), k);
  }

  // ════════════════════════════════════════════════════════════
  //  横屏时经文落在左下方：海开着的时候，在经文后面压一层柔暗（只在经文显示时）
  // ════════════════════════════════════════════════════════════
  let SCRIM = 0;
  function scrimWant() {
    if (PHN() || W.w <= W.h || seaOpenK() < 0.05) return 0;
    let on = false;
    try { on = !!(GS.ui && GS.ui.narrating && GS.ui.narrating()); } catch (e) { on = false; }
    return on ? 1 : 0;
  }
  function drawScrim(ctx) {
    const k = SCRIM * Math.min(1, seaOpenK() * 1.5);
    if (k < 0.01) return;
    SP || sprites();
    glowE(ctx, SP.dark, 0.22 * W.w, 0.655 * W.h, 0.27 * W.w, 0.15 * W.h, 0.42 * k);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海边：冲上岸的车轮、盾牌与断了的车辕（14:30；不画尸首）
  // ════════════════════════════════════════════════════════════
  const WRECK = [[0.372, 0.2, 'w', 0.25], [0.389, 0.45, 's', -0.4], [0.404, 0.12, 'p', 0.22], [0.423, 0.35, 'w', -0.35], [0.442, 0.15, 's', 0.5],
    [0.46, 0.42, 'w', 0.15], [0.478, 0.2, 's', -0.2], [0.497, 0.1, 'p', -0.3]];
  function drawWreck(ctx) {
    const k = W.lv.rsWreck;
    if (k < 0.02) return;
    const s = LS(2) * (PHN() ? 1.6 : 1.3);
    ctx.globalAlpha = k;
    ctx.lineCap = 'round';
    for (let i = 0; i < WRECK.length; i++) {
      const [xf, v, kind, rot] = WRECK[i], x = xf * W.w, y = fY(2, xf, v);
      if (kind === 'w') {
        const rx = 6.8 * s, ry = 2.4 * s;
        ctx.strokeStyle = css([92, 66, 42], 2); ctx.lineWidth = Math.max(0.8, 1.3 * s);
        ctx.beginPath(); ctx.ellipse(x, y - ry, rx, ry, rot * 0.3, 0, TAU); ctx.stroke();
        ctx.lineWidth = Math.max(0.5, 0.6 * s);
        ctx.beginPath();
        for (let j = 0; j < 3; j++) { const an = j * Math.PI / 3 + rot; ctx.moveTo(x + Math.cos(an) * rx, y - ry + Math.sin(an) * ry); ctx.lineTo(x - Math.cos(an) * rx, y - ry - Math.sin(an) * ry); }
        ctx.stroke();
        ctx.strokeStyle = css([176, 132, 70], 2, 0.8, 0.08); ctx.lineWidth = Math.max(0.5, 0.5 * s);
        ctx.beginPath(); ctx.ellipse(x, y - ry, rx * 0.97, ry * 0.9, rot * 0.3, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
      } else if (kind === 's') {
        ctx.fillStyle = css([164, 122, 64], 2, 1, 0.06);
        ctx.beginPath(); ctx.ellipse(x, y - 1.2 * s, 4.4 * s, 1.9 * s, rot * 0.25, 0, TAU); ctx.fill();
        ctx.strokeStyle = css([96, 70, 40], 2); ctx.lineWidth = Math.max(0.5, 0.6 * s); ctx.stroke();
        GL.push([x - 1.2 * s, y - 2 * s, 2 * s, k * 0.8, i * 2.3 + 0.7]);
      } else {
        ctx.strokeStyle = css([98, 72, 46], 2); ctx.lineWidth = Math.max(0.7, 1.1 * s);
        ctx.beginPath(); ctx.moveTo(x - 9 * s, y - 0.5 * s + rot * 3 * s); ctx.lineTo(x + 8 * s, y - 1.5 * s - rot * 3 * s); ctx.stroke();
      }
    }
    // 岸边的水线上一道道白沫
    ctx.strokeStyle = rgba(W.shade([236, 244, 250], 0.02, 0.25), 0.4);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const xf = 0.36 + 0.14 * (i / 8) + 0.01 * Math.sin(W.t * 0.4 + i), x = xf * W.w, y = gY(2, xf) + 1.5 * s, L = (10 + 8 * rt(i + 1600)) * s;
      ctx.moveTo(x - L / 2, y + L * 0.18); ctx.quadraticCurveTo(x, y - 1.2 * s, x + L / 2, y - L * 0.22);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    pk('海边', 0.43 * W.w, fY(2, 0.43, 0.25), 0.07 * W.w);
  }

  // ════════════════════════════════════════════════════════════
  //  玛拉 · 以琳
  // ════════════════════════════════════════════════════════════
  const POOL_X = 0.69, POOL_V = 0.34, TREE_X = 0.872, TREE_V = 0.3, TREE_K = 1.6;
  // 一道柔光：由云火柱的脚下落到某物上（不是硬边的聚光灯）
  function beam(ctx, x0, y0, x1, y1, wid, a) {
    if (a < 0.01) return;
    SP || sprites();
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (L < 4) return;
    ctx.save();
    ctx.translate(x0, y0); ctx.rotate(Math.atan2(x1 - x0, -(y1 - y0)));
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.colW, -wid / 2, -L, wid, L);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function pillarFoot() {
    let best = null;
    for (const P of pillarNow()) if (!P.sea && (!best || P.a > best.a)) best = P;
    return best && best.a > 0.05 ? best : null;
  }
  function drawPool(ctx) {
    const k = W.lv.rsPool;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), x = POOL_X * W.w, y = fY(2, POOL_X, POOL_V), rx = 0.052 * W.w * (PHN() ? 1.5 : 1), ry = rx * 0.17;
    const m = W.lv.rsMarah;
    const bitter = [74, 82, 58], sweet = [96, 164, 206];
    ctx.globalAlpha = k;
    ctx.fillStyle = css([128, 104, 72], 2);
    ctx.beginPath(); ctx.ellipse(x, y + ry * 0.12, rx * 1.1, ry * 1.25, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = W.shadeCSS(mix(bitter, sweet, m), 0, 1, 0.12 + 0.1 * m);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
    // 天光的倒影
    ctx.fillStyle = rgba(W.shade([230, 240, 250], 0, 0.2), 0.12 + 0.25 * m);
    ctx.beginPath(); ctx.ellipse(x - rx * 0.2, y - ry * 0.25, rx * 0.55, ry * 0.3, 0, 0, TAU); ctx.fill();
    // 苇子
    ctx.strokeStyle = css([96, 104, 60], 2, 1); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const a = -Math.PI * 0.95 + i * 0.19, px = x + Math.cos(a) * rx * 1.02, py = y + Math.sin(a) * ry * 0.9; ctx.moveTo(px, py); ctx.lineTo(px + Math.sin(W.t + i) * 1.5 * s, py - (7 + 5 * rt(i + 90)) * s); }
    ctx.stroke();
    if (m > 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) {
        const tw = Math.pow(0.5 + 0.5 * Math.sin(W.t * 3 + i * 2.1), 6);
        glowSp(ctx, SP.white, x + (rt(i * 3 + 95) - 0.5) * rx * 1.4, y + (rt(i * 5 + 96) - 0.5) * ry, 5 * s, k * m * tw * 0.8);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (S.tree === 'thrown') {
      ctx.globalAlpha = k;
      ctx.strokeStyle = css([92, 70, 46], 2); ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath(); ctx.moveTo(x - 8 * s, y + Math.sin(W.t) * 0.6 * s); ctx.lineTo(x + 9 * s, y - 1.5 * s + Math.sin(W.t + 1) * 0.6 * s);
      ctx.moveTo(x + 2 * s, y - 0.8 * s); ctx.lineTo(x + 5 * s, y - 4 * s); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    pk('玛拉', x, y - ry * 2, rx);
  }
  function drawMarahTree(ctx) {
    if (S.tree !== 'ground' || W.lv.rsPool < 0.05) return;
    SP || sprites();
    const s = LS(2) * TREE_K, x = TREE_X * W.w, y = fY(2, TREE_X, TREE_V), k = W.lv.rsPool, gl = W.lv.rsTree;
    if (gl > 0.02) {
      const P = pillarFoot();
      if (P) beam(ctx, x, y - 12 * s, P.x, P.y - 0.08 * W.h, 34 * s, 0.32 * gl * P.a);
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y - 16 * s, 40 * s, gl * 0.65);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    ctx.globalAlpha = k;
    ctx.strokeStyle = css([80, 60, 42], 2); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 2.4 * s);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 2 * s, y - 10 * s, x + 1 * s, y - 18 * s);
    ctx.moveTo(x - 0.5 * s, y - 11 * s); ctx.lineTo(x - 8 * s, y - 20 * s); ctx.moveTo(x + 0.5 * s, y - 14 * s); ctx.lineTo(x + 8 * s, y - 21 * s); ctx.stroke();
    ctx.fillStyle = css([92, 112, 62], 2, 1, 0.05 + 0.3 * gl);
    ctx.beginPath(); ctx.ellipse(x, y - 21 * s, 13 * s, 4.5 * s, 0, 0, TAU); ctx.ellipse(x - 7 * s, y - 20 * s, 7 * s, 3.2 * s, 0, 0, TAU); ctx.ellipse(x + 7 * s, y - 22 * s, 7 * s, 3.2 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    pk('那棵树', x, y - 26 * s, 16 * s);
  }
  // 以琳：棕树与十二股水泉
  const PALMS = [[0.835, 2, 0.3, 1.4, 1], [0.866, 2, 0.5, 1.3, -1], [0.896, 2, 0.24, 1.5, 1], [0.927, 2, 0.46, 1.35, -1], [0.956, 2, 0.28, 1.45, 1], [0.985, 2, 0.52, 1.3, -1], [1.01, 2, 0.34, 1.4, 1],
    [0.78, 1, 0, 1.2, 1], [0.82, 1, 0, 1.0, -1], [0.86, 1, 0, 1.15, 1], [0.9, 1, 0, 1.05, -1], [0.945, 1, 0, 1.2, 1], [0.985, 1, 0, 1.0, -1]];
  const SPRINGS = [];
  for (let i = 0; i < 12; i++) SPRINGS.push([0.79 + 0.2 * rt(i * 7 + 120), 0.16 + 0.5 * rt(i * 3 + 121)]);
  function drawPalm(ctx, xf, l, v, size, flip, g, a, seed) {
    if (g < 0.01 || a < 0.01) return;
    const s = LS(l) * size * (1 + 0.3 * v), x = xf * W.w, y = fY(l, xf, v) + 1.5 * s;
    const H = 50 * s * (0.8 + 0.35 * rt(seed)) * g, lean = (rt(seed + 1) - 0.5) * 0.4 * flip;
    const sway = W.wind * 1.6 * s + Math.sin(W.t * 0.9 + seed) * 0.6 * s;
    const tx = x + lean * H + sway, ty = y - H, cxp = x + lean * H * 0.15, cyp = y - H * 0.5;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([110, 86, 60], l);
    ctx.beginPath();
    ctx.moveTo(x - 2.3 * s, y); ctx.quadraticCurveTo(cxp - 1.7 * s, cyp, tx - 1.2 * s, ty);
    ctx.lineTo(tx + 1.2 * s, ty); ctx.quadraticCurveTo(cxp + 1.7 * s, cyp, x + 2.3 * s, y); ctx.closePath(); ctx.fill();
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    ctx.fillStyle = css([66, 104, 56], l);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const an = (ANG[i] + (rt(seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(an), uy = -Math.sin(an);
      const L = (19 + 8 * rt(seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L;
      const mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L, wd = 2.3 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    if (l === 2) pk('以琳', tx, ty - 6 * s, 22 * s);
  }
  function drawElim(ctx, layer) {
    const k = W.lv.rsElim;
    if (k < 0.01) return;
    SP || sprites();
    if (layer === 2) {
      // 水泉
      const s = LS(2);
      for (let i = 0; i < SPRINGS.length; i++) {
        const [xf, v] = SPRINGS[i], a = c01(k * 2 - i / 24);
        if (a < 0.02) continue;
        const x = xf * W.w, y = fY(2, xf, v), rx = (7 + 4 * rt(i + 130)) * s * (1 + 0.5 * v);
        ctx.globalAlpha = a;
        ctx.fillStyle = css([112, 132, 76], 2);
        ctx.beginPath(); ctx.ellipse(x, y + rx * 0.05, rx * 1.35, rx * 0.36, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = W.shadeCSS([104, 170, 206], 0, 1, 0.15);
        ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.22, 0, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.white, x - rx * 0.2, y - rx * 0.05, rx * 0.8, a * 0.3 * (0.6 + 0.4 * Math.sin(W.t * 2 + i)));
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }
    for (let i = 0; i < PALMS.length; i++) {
      const [xf, l, v, size, flip] = PALMS[i];
      if (l !== layer) continue;
      const g = eOut(c01(k * 1.6 - (i % 6) / 10));
      drawPalm(ctx, xf, l, v, size, flip, g, c01(k * 3), i * 13 + 5);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  汛的旷野：鹌鹑 · 露水 · 吗哪 · 安息
  // ════════════════════════════════════════════════════════════
  const NQ = 70;
  const QU = [];
  for (let i = 0; i < NQ; i++) QU.push({ sx: -0.08 + 0.3 * rt(i * 3 + 200), sy: 0.22 + 0.25 * rt(i * 5 + 201), ex: 0.48 + 0.5 * rt(i * 7 + 202), ev: 0.04 + 0.7 * rt(i * 11 + 203), d: 0.42 * rt(i * 13 + 204), ph: rt(i * 17 + 205) * TAU });
  function quailPos(q) {
    const p = c01((W.lv.rsQuail - q.d) / 0.55);
    const ex = q.ex * W.w, ey = fY(2, q.ex, q.ev);
    if (p >= 1) return [ex, ey, 1, p];
    const sx = q.sx * W.w, sy = q.sy * W.h;
    const cxp = lerp(sx, ex, 0.55), cyp = Math.min(sy, ey) - 0.12 * W.h;
    const e = ease(p);
    const x = (1 - e) * (1 - e) * sx + 2 * (1 - e) * e * cxp + e * e * ex, y = (1 - e) * (1 - e) * sy + 2 * (1 - e) * e * cyp + e * e * ey;
    return [x, y, 0, p];
  }
  function drawQuail(ctx, landed) {
    const a = W.lv.rsQuailA;
    if (a < 0.02 || W.lv.rsQuail < 0.001) return;
    const u = Math.max(0.45, W.unit) * (PHN() ? 1.5 : 1.25);
    ctx.globalAlpha = a;
    ctx.fillStyle = W.shadeCSS([122, 96, 70], 0, 1, 0.1);
    ctx.strokeStyle = W.shadeCSS([90, 70, 52], 0, 1, 0.1);
    ctx.lineWidth = Math.max(0.7, 1.1 * u);
    ctx.beginPath();
    let fly = false;
    for (let i = 0; i < NQ; i++) {
      const q = QU[i], p = quailPos(q);
      if (p[3] <= 0) continue;
      if (p[2] === 1) {
        if (!landed) continue;
        // 落地的鹌鹑：圆身、小头、翘起的尾
        const r = 4.4 * u * (1 + 0.4 * q.ev), d = i % 2 ? 1 : -1, x = p[0], y = p[1] - r * 0.55;
        ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.6, 0, 0, TAU);
        ctx.moveTo(x + d * 0.95 * r + 0.36 * r, y - 0.55 * r); ctx.arc(x + d * 0.95 * r, y - 0.55 * r, 0.36 * r, 0, TAU);
        ctx.moveTo(x - d * 0.8 * r, y - 0.1 * r); ctx.lineTo(x - d * 1.45 * r, y - 0.55 * r); ctx.lineTo(x - d * 1.3 * r, y - 0.05 * r); ctx.closePath();
      } else if (!landed) {
        fly = true;
        const w = 4.5 * u, fl = Math.sin(W.t * 16 + q.ph) * w * 0.6;
        ctx.moveTo(p[0] - w, p[1] - fl); ctx.quadraticCurveTo(p[0] - w * 0.4, p[1] - fl * 0.3, p[0], p[1]); ctx.quadraticCurveTo(p[0] + w * 0.4, p[1] - fl * 0.3, p[0] + w, p[1] - fl);
      }
    }
    if (landed) ctx.fill(); else if (fly) ctx.stroke();
    ctx.globalAlpha = 1;
    if (landed && W.lv.rsQuail > 0.9) pk('鹌鹑', 0.72 * W.w, fY(2, 0.72, 0.3), 0.08 * W.w);
  }
  // 地上的点：露水与吗哪（位置按视口缓存）
  let DOTS = null, DOTSkey = '';
  function dots() {
    const key = W.w + 'x' + W.h;
    if (DOTS && DOTSkey === key) return DOTS;
    DOTSkey = key;
    const near = [], mid = [];
    for (let i = 0; i < 520; i++) {
      const xf = 0.36 + 0.64 * rt(i * 3 + 300), v = Math.pow(rt(i * 5 + 301), 0.9) * 0.96;
      const g = gY(2, xf);
      if (g >= W.h - 2) continue;
      const y = g + v * (W.h - g);
      near.push([xf * W.w, y, 0.6 + 0.9 * v, rt(i * 7 + 302)]);
    }
    for (let i = 0; i < 160; i++) {
      const xf = 0.5 + 0.5 * rt(i * 11 + 330), g = gY(1, xf), wl = W.waterlineY(1);
      if (g >= wl - 1) continue;
      mid.push([xf * W.w, g + rt(i * 13 + 331) * (wl - g) * 0.8, 0.45, rt(i * 17 + 332)]);
    }
    DOTS = { near, mid };
    return DOTS;
  }
  function drawGroundDots(ctx, layer) {
    const man = W.lv.rsManna, dew = W.lv.rsDew;
    if (man < 0.01 && dew < 0.01) return;
    const D = dots(), list = layer === 2 ? D.near : D.mid, u = Math.max(0.5, W.unit) * (PHN() ? 1.2 : 1);
    if (man > 0.01) {
      ctx.fillStyle = W.shadeCSS([252, 250, 244], 0, 1, 0.4);
      ctx.beginPath();
      for (const q of list) {
        if (q[3] > man) continue;
        const r = 1.7 * u * q[2];
        ctx.moveTo(q[0] + r, q[1]); ctx.ellipse(q[0], q[1], r, r * 0.55, 0, 0, TAU);
      }
      ctx.globalAlpha = Math.min(1, man * 1.5);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (layer === 2) pk('吗哪', 0.7 * W.w, fY(2, 0.7, 0.5), 0.12 * W.w);
    }
    if (dew > 0.01 && layer === 2) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < list.length; i += 3) {
        const q = list[i], tw = Math.pow(0.5 + 0.5 * Math.sin(W.t * 2.5 + q[3] * 40), 8);
        glowSp(ctx, SP.white, q[0], q[1], 3 * u * q[2], dew * (0.2 + 0.8 * tw) * 0.8);
      }
      ctx.globalCompositeOperation = 'source-over';
      // 升起的雾
      const hz = W.horizonY;
      for (let i = 0; i < 8; i++) glowE(ctx, SP.mist, (0.4 + 0.6 * rt(i * 3 + 340)) * W.w, lerp(fY(2, 0.7, 0.3), hz, 0.2 * (1 - dew)), 0.18 * W.w, 0.035 * W.h, dew * 0.3);
      ctx.globalAlpha = 1;
    }
  }
  function drawRest(ctx) {
    const k = W.lv.rsRest;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowE(ctx, SP.gold, 0.76 * W.w, fY(2, 0.76, 0.1), 0.34 * W.w, 0.2 * W.h, k * 0.25);
    for (let i = 0; i < 16; i++) {
      const ph = U.fract(W.t * 0.03 + rt(i * 3 + 500));
      const x = (0.55 + 0.45 * rt(i * 7 + 501)) * W.w + Math.sin(W.t * 0.3 + i) * 10, y = fY(2, 0.75, 0.2) - ph * 0.3 * W.h;
      glowSp(ctx, SP.gold, x, y, 5 * Math.max(0.6, W.unit), k * Math.sin(ph * Math.PI) * 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  利非订：何烈的磐石与流出的水；亚玛力之战；耶和华尼西
  // ════════════════════════════════════════════════════════════
  const ROCK_X = 0.615;
  // 何烈的磐石：一座红砂岩的岩峰，顶上一块平台（摩西、亚伦、户珥站在上面）
  const ROCK = [[-1.0, 0], [-0.97, -0.18], [-0.84, -0.26], [-0.8, -0.48], [-0.66, -0.55], [-0.6, -0.74], [-0.44, -0.8], [-0.3, -0.9], [-0.1, -0.88],
    [0.05, -0.93], [0.2, -0.92], [0.3, -1.06], [0.42, -1.12], [0.52, -0.98], [0.62, -0.86], [0.7, -0.7], [0.84, -0.62], [0.9, -0.4], [1.0, -0.3], [1.08, 0]];
  function rockG() { const s = LS(2), x = ROCK_X * W.w, y = gY(2, ROCK_X) + 5 * s; return { s, x, y, hw: 62 * s, h: 74 * s }; }
  function rockProf(dx) {
    for (let i = 1; i < ROCK.length; i++) if (dx <= ROCK[i][0]) { const a = ROCK[i - 1], b = ROCK[i], f = (dx - a[0]) / Math.max(1e-6, b[0] - a[0]); return -lerp(a[1], b[1], f); }
    return 0;
  }
  function rockTop(dx) { const r = rockG(); return [r.x + dx * r.hw, r.y - r.h * rockProf(dx) * (0.6 + 0.4 * W.lv.rsRock) + 1]; }
  function drawRock(ctx) {
    const k = W.lv.rsRock;
    if (k < 0.01) return;
    const r = rockG(), rise = 0.6 + 0.4 * k, d = litX() >= r.x ? 1 : -1;
    const P = ROCK.map(q => [r.x + q[0] * r.hw, r.y + q[1] * r.h * rise]);
    ctx.globalAlpha = k;
    ctx.fillStyle = css([158, 102, 78], 2);
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill();
    // 背光的面：几块斜切的岩面
    ctx.fillStyle = css([96, 60, 50], 2, 0.6);
    ctx.beginPath();
    const F = d > 0 ? [[-1.0, 0], [-0.97, -0.18], [-0.84, -0.26], [-0.8, -0.48], [-0.66, -0.55], [-0.6, -0.74], [-0.44, -0.8], [-0.3, -0.9], [-0.22, -0.66], [-0.3, -0.38], [-0.16, 0]]
      : [[1.08, 0], [1.0, -0.3], [0.9, -0.4], [0.84, -0.62], [0.7, -0.7], [0.62, -0.86], [0.52, -0.98], [0.42, -1.12], [0.36, -0.8], [0.46, -0.44], [0.32, 0]];
    F.forEach((q, i) => { const X = r.x + q[0] * r.hw, Y = r.y + q[1] * r.h * rise; if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); });
    ctx.closePath(); ctx.fill();
    // 层理与裂纹
    ctx.strokeStyle = css([110, 70, 54], 2, 0.7); ctx.lineWidth = Math.max(0.5, 0.8 * r.s); ctx.lineCap = 'round';
    ctx.beginPath();
    // 斜的层理（只在岩面中段）与竖的裂缝
    for (let i = 1; i < 4; i++) { const yy = r.y - r.h * rise * (0.2 + 0.2 * i), w = r.hw * (0.7 - 0.12 * i); ctx.moveTo(r.x - w, yy + 5 * r.s); ctx.lineTo(r.x + w * 0.8, yy - 3 * r.s); }
    ctx.moveTo(r.x + 0.1 * r.hw, r.y - 0.9 * r.h * rise); ctx.lineTo(r.x + 0.16 * r.hw, r.y - 0.55 * r.h * rise); ctx.lineTo(r.x + 0.08 * r.hw, r.y - 0.2 * r.h * rise);
    ctx.moveTo(r.x + 0.55 * r.hw, r.y - 0.95 * r.h * rise); ctx.lineTo(r.x + 0.5 * r.hw, r.y - 0.6 * r.h * rise); ctx.lineTo(r.x + 0.58 * r.hw, r.y - 0.3 * r.h * rise);
    ctx.moveTo(r.x - 0.4 * r.hw, r.y - 0.78 * r.h * rise); ctx.lineTo(r.x - 0.46 * r.hw, r.y - 0.5 * r.h * rise);
    ctx.stroke();
    // 裂缝（水从这里流出）
    ctx.strokeStyle = css([36, 24, 20], 2); ctx.lineWidth = Math.max(0.8, 1.8 * r.s);
    ctx.beginPath(); ctx.moveTo(r.x - 0.72 * r.hw, r.y - 0.06 * r.h); ctx.lineTo(r.x - 0.64 * r.hw, r.y - 0.28 * r.h * rise); ctx.lineTo(r.x - 0.7 * r.hw, r.y - 0.46 * r.h * rise); ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([246, 212, 176], 2, 0.5 * dayA(), 0.25); ctx.lineWidth = Math.max(0.6, 1.3 * r.s);
    ctx.beginPath();
    let pen = false;
    ROCK.forEach((q, i) => { if (q[0] * d < -0.35 || q[1] > -0.12) { pen = false; return; } const X = P[i][0], Y = P[i][1]; if (pen) ctx.lineTo(X, Y); else { ctx.moveTo(X, Y); pen = true; } });
    ctx.stroke();
    ctx.globalAlpha = 1;
    pk('何烈的磐石', r.x, r.y - r.h * 1.02, r.hw * 0.9);
  }
  function drawRockGlory(ctx) {
    const k = W.lv.rsRockGlory;
    if (k < 0.02 || W.lv.rsRock < 0.05) return;
    SP || sprites();
    const r = rockG(), P = pillarFoot();
    if (P) beam(ctx, r.x + 0.1 * r.hw, r.y - r.h * 0.7, P.x, Math.min(P.y, r.y - r.h) - 0.1 * W.h, r.hw * 1.1, 0.3 * k * P.a);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, r.x, r.y - r.h * 1.02, r.hw * 2.2, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 从磐石流到海边的水（近岸层上的一条路：[x 比例, 纵深 v]）
  const STREAM = [[0.578, 0.05], [0.565, 0.12], [0.535, 0.2], [0.505, 0.28], [0.475, 0.37], [0.448, 0.47], [0.42, 0.58], [0.395, 0.7], [0.372, 0.84], [0.355, 0.98]];
  function drawStream(ctx) {
    const k = W.lv.rsSpring;
    if (k < 0.005 || W.lv.rsRock < 0.05) return;
    SP || sprites();
    const s = LS(2);
    const P = STREAM.map(q => [q[0] * W.w, fY(2, q[0], q[1]), q[1]]);
    let L = 0;
    const seg = [0];
    for (let i = 1; i < P.length; i++) { L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(L); }
    const want = L * k;
    const pts = [P[0]];
    for (let i = 1; i < P.length; i++) {
      if (seg[i] <= want) { pts.push(P[i]); continue; }
      const f = (want - seg[i - 1]) / Math.max(1e-6, seg[i] - seg[i - 1]);
      pts.push([lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f), lerp(P[i - 1][2], P[i][2], f)]);
      break;
    }
    if (pts.length < 2) return;
    // 平滑：Catmull-Rom 细分，再沿法线两侧各推出半宽，成一条连续的带（不是一节一节的短线）
    const D = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let j = 0; j < 5; j++) {
        const u = j / 5, u2 = u * u, u3 = u2 * u;
        const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
        D.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1]), lerp(p1[2], p2[2], u)]);
      }
    }
    D.push(pts[pts.length - 1]);
    const n = D.length, NRM = [];
    for (let i = 0; i < n; i++) {
      const a = D[Math.max(0, i - 1)], b = D[Math.min(n - 1, i + 1)];
      let nx = -(b[1] - a[1]), ny = b[0] - a[0];
      const nl = Math.hypot(nx, ny) || 1;
      NRM.push([nx / nl, ny / nl]);
    }
    // 宽度：近处宽，远处窄；源头细，正在流出的一端收成尖
    const wAt = i => (3 + 12 * D[i][2]) * s * Math.min(1, 0.35 + i / 6) * Math.min(1, (n - 1 - i) / 4 + (k >= 0.999 ? 1 : 0.15));
    const ribbon = (wf, off) => {
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const w = wAt(i) * wf / 2, o = wAt(i) * off, x = D[i][0] + NRM[i][0] * (o + w), y = D[i][1] + NRM[i][1] * (o + w); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      for (let i = n - 1; i >= 0; i--) { const w = wAt(i) * wf / 2, o = wAt(i) * off; ctx.lineTo(D[i][0] + NRM[i][0] * (o - w), D[i][1] + NRM[i][1] * (o - w)); }
      ctx.closePath();
    };
    // 湿地（两层，边上淡）、水、天光；迎光的一道细亮偏向天光的一侧
    const up = NRM[Math.floor(n / 2)][1] < 0 ? 1 : -1;
    ctx.fillStyle = css([104, 86, 62], 2, 0.35); ribbon(2.5, 0); ctx.fill();
    ctx.fillStyle = css([96, 78, 58], 2, 0.6); ribbon(1.7, 0); ctx.fill();
    ctx.fillStyle = W.shadeCSS([70, 146, 200], 0, 1, 0.22); ribbon(1, 0); ctx.fill();
    ctx.fillStyle = rgba(W.shade([112, 186, 226], 0, 0.25), 0.7); ribbon(0.55, 0.1 * up); ctx.fill();
    ctx.fillStyle = rgba(W.shade([214, 238, 252], 0, 0.3), 0.55); ribbon(0.16, 0.26 * up); ctx.fill();
    // 流到海边：几点白沫
    if (k > 0.97) {
      const e = D[n - 1], fa = c01((k - 0.97) / 0.03);
      ctx.fillStyle = rgba(W.shade([236, 244, 250], 0, 0.3), 0.6 * fa);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const ph = U.fract(W.t * 0.35 + rt(i * 5 + 620)), r = (1.2 + 1.6 * rt(i + 621)) * s * (1 - 0.5 * ph);
        const x = e[0] - (4 + 16 * rt(i * 3 + 622)) * s * ph - 2 * s, y = e[1] + (rt(i * 7 + 623) - 0.5) * 8 * s;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
      }
      ctx.fill();
    }
    // 水面的闪光
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 22; i++) {
      const f = U.fract(rt(i * 3 + 610) + W.t * 0.05);
      const idx = Math.min(n - 2, Math.floor(f * (n - 1)));
      if (idx < 0) continue;
      const q0 = D[idx], q1 = D[idx + 1], ff = f * (n - 1) - idx;
      const tw = Math.pow(0.5 + 0.5 * Math.sin(W.t * 4 + i * 2.3), 6);
      glowSp(ctx, SP.white, lerp(q0[0], q1[0], ff), lerp(q0[1], q1[1], ff), (2 + 5 * q0[2]) * s, tw * 0.7 * Math.min(1, k * 3));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // 磐石下迸出的水花
    const r = rockG();
    const sx = r.x - 0.72 * r.hw, sy = r.y - 0.12 * r.h;
    ctx.fillStyle = rgba(W.shade([230, 244, 255], 0, 0.3), 0.7);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const ph = U.fract(W.t * 1.4 + rt(i * 3 + 600));
      const x = sx - ph * (14 + 10 * rt(i + 601)) * s, y = sy - Math.sin(ph * Math.PI) * (10 + 8 * rt(i + 602)) * s + ph * 6 * s;
      const rr = Math.max(0.6, (1.6 - ph) * 1.2 * s);
      ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, TAU);
    }
    ctx.globalAlpha = Math.min(1, k * 4);
    ctx.fill();
    ctx.globalAlpha = 1;
    if (k > 0.5) pk('玛撒', P[4][0], P[4][1] - 10 * s, 30 * s);
  }
  function drawBattle(ctx) {
    const k = W.lv.rsBattle;
    if (k < 0.02) return;
    SP || sprites();
    const s = LS(2);
    for (let i = 0; i < 14; i++) {
      const ph = U.fract(W.t * 0.35 + rt(i * 3 + 640));
      const xf = 0.74 + 0.2 * rt(i * 7 + 641) + Math.sin(W.t * 0.5 + i) * 0.01;
      const x = xf * W.w, y = fY(2, xf, 0.1 + 0.3 * rt(i * 5 + 642)) - ph * 30 * s;
      glowE(ctx, SP.dust, x, y, (18 + ph * 30) * s, (9 + ph * 14) * s, k * 0.45 * (1 - ph) * dayA());
    }
    ctx.globalAlpha = 1;
    // 刀光
    for (let i = 0; i < 6; i++) {
      const b = Math.pow(Math.max(0, Math.sin(W.t * 3.3 + i * 2.7)), 16);
      if (b < 0.05) continue;
      const xf = 0.76 + 0.16 * rt(i * 11 + 650);
      glint(ctx, xf * W.w, fY(2, xf, 0.15) - 38 * s, 3 * s, k * b);
    }
  }
  // 两军手里的枪（人物模块的「刀」是基路伯的火焰剑，这里另画木杆铜头的枪）
  function drawSpears(ctx) {
    const c = C();
    if (!c || !c.crowds || !c.crowds.get) return;
    const list = [];
    for (const gid of ['rs:men', 'rs:amalek']) { const g = c.crowds.get(gid); if (g) for (const m of g.members) list.push(m); }
    const j = fig('joshua'); if (j) list.push(j);
    if (!list.length) return;
    ctx.strokeStyle = W.shadeCSS([74, 58, 42], 0);
    ctx.lineCap = 'round';
    ctx.beginPath();
    let lw = 1;
    const tips = [];
    for (const m of list) {
      if (!m._vis || m.alpha < 0.1) continue;
      const h = m._h, d = m.fd >= 0 ? 1 : -1, up = m.pose === 'raise' ? 1 : 0;
      const x0 = m._x + d * 0.14 * h, y0 = m._y - 0.2 * h, x1 = m._x + d * (0.34 - 0.12 * up) * h, y1 = m._y - (1.45 + 0.1 * up) * h;
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      lw = Math.max(0.7, h * 0.03);
      tips.push([x1, y1, h, m.phase || 0]);
    }
    ctx.lineWidth = lw;
    ctx.stroke();
    ctx.fillStyle = W.shadeCSS([196, 150, 90], 0, 1, 0.1);
    ctx.beginPath();
    for (const q of tips) { const r = q[2] * 0.05; ctx.moveTo(q[0], q[1] - r * 2); ctx.lineTo(q[0] + r * 0.7, q[1]); ctx.lineTo(q[0] - r * 0.7, q[1]); ctx.closePath(); }
    ctx.fill();
    const bk = W.lv.rsBattle;
    if (bk > 0.05) for (const q of tips) { const b = Math.pow(Math.max(0, Math.sin(W.t * 2.7 + q[3] * 5)), 14); if (b > 0.05) glint(ctx, q[0], q[1] - q[2] * 0.05, q[2] * 0.08, b * bk); }
  }
  const ALTAR_X = 0.53;
  const ALT = [];
  (function () { const r = U.mulberry32(733); [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => { for (let i = 0; i < n; i++) ALT.push([(i - (n - 1) / 2) * 0.48 + (r() - 0.5) * 0.08, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.27 + r() * 0.06, 0.19 + r() * 0.04, (r() - 0.5) * 0.4]); }); })();
  function drawAltar(ctx) {
    const k = W.lv.rsAltar;
    if (k < 0.01) return;
    const s = LS(2), x = ALTAR_X * W.w, y = fY(2, ALTAR_X, 0.08) + 1.5 * s, u = 12 * s;
    const shown = k * ALT.length;
    ctx.fillStyle = css([132, 118, 102], 2);
    ctx.beginPath();
    for (let i = 0; i < ALT.length && i < shown; i++) {
      const q = ALT[i], kk = clamp(shown - i, 0, 1), cx = x + q[0] * u, cy = y + q[1] * u - (1 - kk) * 6 * s;
      ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * kk, q[4], 0, TAU);
    }
    ctx.fill();
    // 旗杆与旗（耶和华尼西：耶和华是我的旌旗）
    const bk = c01(k * 2 - 1);
    if (bk > 0.01) {
      const px = x + 1.35 * u, H = 58 * s * eOut(bk);
      ctx.strokeStyle = css([96, 72, 50], 2); ctx.lineWidth = Math.max(0.8, 1.5 * s); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y - H); ctx.stroke();
      ctx.fillStyle = css([188, 64, 52], 2, bk, 0.05);
      ctx.beginPath();
      const fw = 22 * s * bk, fh = 11 * s;
      ctx.moveTo(px, y - H);
      for (let i = 1; i <= 6; i++) { const t = i / 6; ctx.lineTo(px + t * fw, y - H + Math.sin(W.t * 3 + t * 5) * 2 * s * t); }
      for (let i = 6; i >= 0; i--) { const t = i / 6; ctx.lineTo(px + t * fw, y - H + fh + Math.sin(W.t * 3 + t * 5 + 0.4) * 2 * s * t); }
      ctx.closePath(); ctx.fill();
      // 迎光的一道边，让旗在暮色里也看得见
      ctx.strokeStyle = W.shadeCSS([255, 214, 170], 0, 0.7 * bk, 0.35); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(px, y - H);
      for (let i = 1; i <= 6; i++) { const t = i / 6; ctx.lineTo(px + t * fw, y - H + Math.sin(W.t * 3 + t * 5) * 2 * s * t); }
      ctx.stroke();
    }
    if (W.lv.rsOffer > 0.01) {
      const top = y - 0.98 * u;
      smoke(ctx, x, top - 6 * s, W.lv.rsOffer, 130 * s + W.h * 0.1, 7 * s, 4.2);
      flame(ctx, x, top + 1 * s, 13 * s, W.lv.rsOffer, 4.2);
    }
    pk('耶和华尼西', x + 0.6 * u, y - 30 * s, 26 * s);
  }
  // 千夫长、百夫长、五十夫长、十夫长：各领一群百姓，各立一杆旗（白日看得见），夜里旗下一盏灯
  const JUDGES = [[0.475, 1.25, [178, 64, 54]], [0.555, 1.1, [196, 152, 64]], [0.635, 0.98, [72, 112, 156]], [0.715, 0.88, [118, 140, 72]], [0.795, 0.8, [150, 92, 132]]];
  function drawJudges(ctx) {
    const k = W.lv.rsJudge;
    if (k < 0.02) return;
    const s = LS(2) * (PHN() ? 1.2 : 1), e = eOut(k);
    ctx.lineCap = 'round';
    for (let i = 0; i < JUDGES.length; i++) {
      const [xf, z, col] = JUDGES[i], x = xf * W.w, y = fY(2, xf, 0.14), H = 50 * s * z * e;
      ctx.globalAlpha = Math.min(1, k * 1.5);
      ctx.strokeStyle = W.shadeCSS([92, 70, 48], 0); ctx.lineWidth = Math.max(0.8, 1.3 * s);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - H); ctx.stroke();
      const fw = 13 * s * z * e, fh = 7 * s * z;
      ctx.fillStyle = W.shadeCSS(col, 0, 1, 0.06);
      ctx.beginPath(); ctx.moveTo(x, y - H);
      for (let j = 1; j <= 5; j++) { const t = j / 5; ctx.lineTo(x + t * fw, y - H + Math.sin(W.t * 2.6 + t * 4 + i) * 1.4 * s * t + t * fh * 0.3); }
      ctx.lineTo(x, y - H + fh);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      lamp(ctx, x, y - H * 0.55, 32 * s, k * nightK(), i * 3.3);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  人物（皆经人物模块）
  // ════════════════════════════════════════════════════════════
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p) { if (fig(id)) C().pose(id, p); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function rm(id) { if (fig(id)) C().remove(id); }
  function prop(id, k) { const c = C(); if (fig(id) && c.prop) c.prop(id, k); }
  function attach(id, fn) { const c = C(); if (fig(id) && c.attach) c.attach(id, fn); }
  function crowd(gid, o) { return C().crowd(gid, o); }
  function crowdWalk(gid, x0, x1, o) { C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { C().crowdPose(gid, p); }
  function rmCrowd(gid) { C().removeCrowd(gid); }
  function herd(gid, o) { const c = C(); return c.herd ? c.herd(gid, o) : null; }
  function animal(id, o) { const c = C(); return c.animal ? c.animal(id, o) : null; }
  function crowdProp(gid, k) {
    const c = C(), g = c.crowds && c.crowds.get ? c.crowds.get(gid) : null;
    if (g) g.members.forEach(m => { if (!m.isAnimal) m.prop = k; });
  }
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };
  function crowdFace(gid, d) {
    const c = C(), g = c.crowds && c.crowds.get ? c.crowds.get(gid) : null;
    if (g) g.members.forEach(m => { if (!m.isAnimal) { m.facing = d; if (W.replaying) m.fd = d; } });
  }
  // 海的那一边（书珥的旷野）：近处的地是黄沙
  const SHUR = [['bare', 1], ['grass', 0.05], ['bloom', 0], ['herbs', 0], ['trees', 0.02]];
  const ROBE = {
    moses: [132, 104, 76], aaron: [92, 108, 150], miriam: [170, 110, 104], joshua: [140, 100, 66], hur: [120, 112, 92],
    jethro: [118, 96, 128], zipporah: [176, 132, 96], gershom: [140, 118, 90], eliezer: [160, 138, 104], bearer: [118, 96, 78],
    women: [[196, 150, 120], [176, 128, 140], [150, 134, 170], [206, 176, 130], [168, 146, 118], [186, 120, 106]],
    elder: [[128, 118, 104], [110, 100, 92], [140, 122, 96]], amalek: [96, 60, 52], men: [128, 106, 84],
  };
  function ring(c) { if (!c.instant) safe('rs.ring', () => fx().ring(c.x, c.y, TINT, M() * 0.26, 1.8, 1.4)); }
  function sparkleAt(xf, v, n, col) {
    if (W.replaying) return;
    safe('rs.sparkle', () => fx().sparkle(xf * W.w, fY(2, xf, v || 0) - 20 * LS(2), n || 24, col || [255, 240, 210], 14, 'air'));
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：出埃及的路上，旷野的边上（13:17–18）
  // ════════════════════════════════════════════════════════════
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.32, herbs: 0.2, trees: 0.06,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0, bare: 0.8, bloom: 0.06, gale: 0 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('rsPm', 1, true);
    W.set('rsCamp', 1, true);
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.freeClock = false;
    W.goTo(0.34, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.1, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.3, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    S = fresh();
    GL.length = 0; TORCH.length = 0; PK.length = 0;
    const c = C();
    c.clear({ fade: false });
    add('moses', { label: '摩西', sex: 'm', age: 'elder', x: 0.8, facing: -1, robe: ROBE.moses, glow: 0.45, prop: 'staff', from: 'none' });
    add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: 0.83, facing: -1, robe: ROBE.aaron, glow: 0.3, from: 'none' });
    add('miriam', { label: '米利暗', sex: 'f', age: 'elder', x: 0.855, facing: -1, robe: ROBE.miriam, glow: 0.3, prop: null, from: 'none' });
    add('bearer1', { label: '以色列人', sex: 'm', age: 'adult', x: 0.9, facing: -1, robe: ROBE.bearer, glow: 0.12, pose: 'carry', from: 'none' });
    add('bearer2', { label: '以色列人', sex: 'm', age: 'adult', x: 0.925, facing: -1, robe: [104, 88, 74], glow: 0.12, pose: 'carry', from: 'none' });
    crowd('rs:folk', { n: 14, x0: 0.84, x1: 1.04, layer: 2, label: '以色列人', from: 'none', mill: false });
    crowd('rs:folk2', { n: 12, x0: 0.8, x1: 1.04, layer: 1, label: '以色列人', from: 'none', mill: false });
    herd('rs:flock', { kind: 'sheep', n: 7, x0: 0.93, x1: 1.05, label: '羊群', from: 'none', mill: false });
    avoid([0.76, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '法老容百姓去的时候，非利士地的道路虽近，神却不领他们从那里走；<br>因为神说：「恐怕百姓遇见打仗后悔，就回埃及去。」', ref: '出埃及记 13:17', hold: 8 },
    { text: '所以神领百姓绕道而行，走红海旷野的路。<br>以色列人出埃及地，都带着兵器上去。', ref: '出埃及记 13:18', hold: 6.5 },
  ];
  const V = {
    cloud: [
      { text: '摩西把约瑟的骸骨一同带去；因为约瑟曾叫以色列人严严地起誓，<br>对他们说：「神必眷顾你们，你们要把我的骸骨从这里一同带上去。」', ref: '出埃及记 13:19', hold: 7.5 },
      { text: '他们从疏割起行，在旷野边的以倘安营。', ref: '出埃及记 13:20', hold: 5 },
      { text: '日间，耶和华在云柱中领他们的路；夜间，在火柱中光照他们，<br>使他们日夜都可以行走。', ref: '出埃及记 13:21', hold: 6.5 },
      { text: '日间云柱，夜间火柱，总不离开百姓的面前。', ref: '出埃及记 13:22', hold: 5 },
    ],
    pursue: [
      { text: '耶和华晓谕摩西说：「你吩咐以色列人转回，安营在比‧哈希录前，<br>密夺和海的中间……靠近海边安营。」', ref: '出埃及记 14:1–2', hold: 7.5 },
      { text: '法老就预备他的车辆，带领军兵同去，<br>并带着六百辆特选的车和埃及所有的车，每辆都有车兵长。', ref: '出埃及记 14:6–7', hold: 7.5 },
      { text: '法老临近的时候，以色列人举目看见埃及人赶来，<br>就甚惧怕，向耶和华哀求。', ref: '出埃及记 14:10', hold: 6.5 },
    ],
    between: [
      { text: '摩西对百姓说：「不要惧怕，只管站住！看耶和华今天向你们所要施行的救恩……<br>耶和华必为你们争战；你们只管静默，不要作声。」', ref: '出埃及记 14:13–14', hold: 8 },
      { text: '在以色列营前行走神的使者，转到他们后边去；<br>云柱也从他们前边转到他们后边立住。', ref: '出埃及记 14:19', hold: 6.5 },
      { text: '在埃及营和以色列营中间有云柱，一边黑暗，一边发光，<br>终夜两下不得相近。', ref: '出埃及记 14:20', hold: 6.5 },
    ],
    part: [
      { text: '摩西向海伸杖，耶和华便用大东风，使海水一夜退去，<br>水便分开，海就成了干地。', ref: '出埃及记 14:21', hold: 8 },
      { text: '你发鼻中的气，水便聚起成堆，<br>大水直立如垒，海中的深水凝结。', ref: '出埃及记 15:8', hold: 7 },
    ],
    cross: [
      { text: '以色列人下海中走干地，水在他们的左右作了墙垣。', ref: '出埃及记 14:22', hold: 9 },
    ],
    cross2: [
      { text: '埃及人追赶他们，法老一切的马匹、车辆，和马兵都跟着下到海中。', ref: '出埃及记 14:23', hold: 6.5 },
    ],
    watch: [
      { text: '到了晨更的时候，耶和华从云火柱中向埃及的军兵观看，<br>使埃及的军兵混乱了；', ref: '出埃及记 14:24', hold: 7 },
      { text: '又使他们的车轮脱落，难以行走，以致埃及人说：<br>「我们从以色列人面前逃跑吧！因耶和华为他们攻击我们了。」', ref: '出埃及记 14:25', hold: 8 },
    ],
    close: [
      { text: '摩西就向海伸杖，到了天一亮，海水仍旧复原。', ref: '出埃及记 14:27', hold: 6 },
      { text: '水就回流，淹没了车辆和马兵。<br>那些跟着以色列人下海法老的全军，连一个也没有剩下。', ref: '出埃及记 14:28', hold: 7 },
      { text: '以色列人看见耶和华向埃及人所行的大事，就敬畏耶和华，<br>又信服他和他的仆人摩西。', ref: '出埃及记 14:31', hold: 7 },
    ],
    song: [
      { text: '那时，摩西和以色列人向耶和华唱歌说：我要向耶和华歌唱，<br>因他大大战胜，将马和骑马的投在海中。', ref: '出埃及记 15:1', hold: 8 },
      { text: '耶和华必作王，直到永永远远！', ref: '出埃及记 15:18', hold: 5 },
      { text: '亚伦的姊姊，女先知米利暗，手里拿着鼓；<br>众妇女也跟她出去拿鼓跳舞。', ref: '出埃及记 15:20', hold: 6.5 },
    ],
    marah: [
      { text: '摩西领以色列人从红海往前行，到了书珥的旷野，<br>在旷野走了三天，找不着水。', ref: '出埃及记 15:22', hold: 6 },
      { text: '到了玛拉，不能喝那里的水；因为水苦，所以那地名叫玛拉。<br>百姓就向摩西发怨言，说：「我们喝什么呢？」', ref: '出埃及记 15:23–24', hold: 7 },
      { text: '摩西呼求耶和华，耶和华指示他一棵树。<br>他把树丢在水里，水就变甜了。', ref: '出埃及记 15:25', hold: 6.5 },
      { text: '他们到了以琳，在那里有十二股水泉，七十棵棕树；<br>他们就在那里的水边安营。', ref: '出埃及记 15:27', hold: 6.5 },
    ],
    manna: [
      { text: '以色列全会众在旷野向摩西、亚伦发怨言，说：<br>「巴不得我们早死在埃及地、耶和华的手下；那时我们坐在肉锅旁边，吃得饱足……」', ref: '出埃及记 16:2–3', hold: 8 },
      { text: '亚伦正对以色列全会众说话的时候，他们向旷野观看，<br>不料，耶和华的荣光在云中显现。', ref: '出埃及记 16:10', hold: 6.5 },
      { text: '到了晚上，有鹌鹑飞来，遮满了营；<br>早晨在营四围的地上有露水。', ref: '出埃及记 16:13', hold: 6 },
      { text: '露水上升之后，不料，野地面上有如白霜的小圆物。', ref: '出埃及记 16:14', hold: 6 },
    ],
    sabbath: [
      { text: '以色列人看见，不知道是什么，就彼此对问说：「这是什么呢？」<br>摩西对他们说：「这就是耶和华给你们吃的食物……」', ref: '出埃及记 16:15', hold: 7.5 },
      { text: '以色列人就这样行；有多收的，有少收的……<br>多收的也没有余，少收的也没有缺；各人按着自己的饭量收取。', ref: '出埃及记 16:17–18', hold: 7 },
      { text: '于是百姓第七天安息了。', ref: '出埃及记 16:30', hold: 5 },
      { text: '以色列人吃吗哪共四十年，直到进了有人居住之地，<br>就是迦南的境界。', ref: '出埃及记 16:35', hold: 6 },
    ],
    rock: [
      { text: '以色列全会众……在利非订安营。百姓没有水喝，<br>所以与摩西争闹，说：「给我们水喝吧！」', ref: '出埃及记 17:1–2', hold: 7 },
      { text: '「我必在何烈的磐石那里，站在你面前。你要击打磐石，从磐石里必有水流出来……」<br>摩西就在以色列的长老眼前这样行了。', ref: '出埃及记 17:6', hold: 8 },
      { text: '他给那地方起名叫玛撒，又叫米利巴；因以色列人争闹，<br>又因他们试探耶和华，说：「耶和华是在我们中间不是？」', ref: '出埃及记 17:7', hold: 7.5 },
    ],
    amalek: [
      { text: '那时，亚玛力人来在利非订，和以色列人争战。<br>摩西对约书亚说：「……明天我手里要拿着神的杖，站在山顶上。」', ref: '出埃及记 17:8–9', hold: 7.5 },
      { text: '摩西何时举手，以色列人就得胜，何时垂手，亚玛力人就得胜。', ref: '出埃及记 17:11', hold: 5.5 },
      { text: '但摩西的手发沉……亚伦与户珥扶着他的手，<br>一个在这边，一个在那边，他的手就稳住，直到日落的时候。', ref: '出埃及记 17:12', hold: 7.5 },
      { text: '摩西筑了一座坛，起名叫「耶和华尼西」', ref: '出埃及记 17:15', hold: 5 },
    ],
    jethro: [
      { text: '摩西的岳父叶忒罗带着摩西的妻子和两个儿子来到神的山，<br>就是摩西在旷野安营的地方。', ref: '出埃及记 18:5', hold: 7 },
      { text: '叶忒罗说：「耶和华是应当称颂的……<br>我现今在埃及人向这百姓发狂傲的事上得知，耶和华比万神都大。」', ref: '出埃及记 18:10–11', hold: 7.5 },
      { text: '摩西从以色列人中拣选了有才能的人，立他们为百姓的首领，<br>作千夫长、百夫长、五十夫长、十夫长。', ref: '出埃及记 18:25', hold: 7 },
      { text: '此后，摩西让他的岳父去，他就往本地去了。', ref: '出埃及记 18:27', hold: 5 },
    ],
  };
  const narrate = (lines, b) => { if (!b.instant) safe('rs.narr', () => GS.ui.narrate(lines, { replace: false })); };

  // ════════════════════════════════════════════════════════════
  //  十四句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 13:19–22 云柱领路，火柱光照 ──────────────────────────
    {
      kind: 'act', utter: '耶和华在云柱中领他们的路', cmd: 'follow 云柱 --by-day && follow 火柱 --by-night', ref: '13:21',
      verse: V.cloud,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            movePillar('lead', true);
            W.set('rsCloud', 1, b.instant);
            W.goTo(0.56, 12, b.instant);
            if (!b.instant) { sfx('wind', { soft: true }); sfx('harp', { soft: true }); }
          }],
          [2.5, b => {
            movePillar('etham', b.instant);
            avoid([0.55, 1]);
            walk('moses', 0.6, { speed: 0.022 });
            walk('aaron', 0.625, { speed: 0.022 });
            walk('miriam', 0.65, { speed: 0.022 });
            walk('bearer1', 0.705, { speed: 0.022, pose: 'carry' });
            walk('bearer2', 0.735, { speed: 0.022, pose: 'carry' });
            crowdWalk('rs:folk', 0.66, 0.89, { speed: 0.024 });
            crowdWalk('rs:folk2', 0.6, 0.96, { speed: 0.02 });
            crowdWalk('rs:flock', 0.915, 0.99, { speed: 0.02 });
          }],
          [13, b => {
            setSite('etham', b.instant);
            W.goTo(0.9, 15, b.instant);
            if (!b.instant) sfx('build', { soft: true });
          }],
          [17, b => {
            S.chest = 'camp';
            pose('bearer1', 'stand'); pose('bearer2', 'stand');
            face('moses', 1);
          }],
          [20, () => { crowdPose('rs:folk', 'sit'); pose('miriam', 'sit'); }],
          [24, b => { if (!b.instant) sfx('fire', { soft: true }); }],
        ]);
      },
    },

    // ── 14:1–10 转回海边；法老追来 ──────────────────────────
    {
      kind: 'judge', utter: '我要使法老的心刚硬，他要追赶他们', cmd: 'chmod 000 法老.heart && spawn 车 --n 600 --pursue', ref: '14:4',
      verse: V.pursue,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.goTo(0.33, 9, b.instant);
            setSite(null, b.instant);
            S.chest = 'carried';
            pose('bearer1', 'carry'); pose('bearer2', 'carry');
            crowdPose('rs:folk', 'stand'); pose('miriam', 'stand');
          }],
          [2, b => {
            movePillar('front', b.instant);
            avoid([0.42, 1]);
            walk('moses', 0.545, { speed: 0.03 });
            walk('aaron', 0.57, { speed: 0.03 });
            walk('miriam', 0.595, { speed: 0.03 });
            walk('bearer1', 0.64, { pose: 'carry' }); walk('bearer2', 0.668, { pose: 'carry' });
            // 以色列人都在 0.8 以内；羊群在岸边，不与人相叠；车队停在 0.87 以外
            crowdWalk('rs:folk', 0.56, 0.8);
            crowdWalk('rs:folk2', 0.58, 0.8);
            crowdWalk('rs:flock', 0.44, 0.5);
          }],
          [8, b => { setSite('sea', b.instant); S.chest = 'camp'; pose('bearer1', 'stand'); pose('bearer2', 'stand'); }],
          [10, b => {
            W.goTo(0.71, 14, b.instant);
            W.set('rsArmy', 1, b.instant);
            if (!b.instant) { sfx('thunder', { far: true, soft: true }); }
          }],
          [15, b => { if (!b.instant) sfx('thunder', { far: true, soft: true }); }],
          [17, b => {
            crowdPose('rs:folk', 'pray');
            pose('miriam', 'pray');
            face('moses', 1); face('aaron', 1);
            if (!b.instant) sfx('crowd');
          }],
        ]);
      },
    },

    // ── 14:13–20 不要惧怕；云柱立在两营中间 ──────────────────
    {
      kind: 'ask', utter: '你为什么向我哀求呢？', cmd: 'mv 云柱 --between 两营  # 一边黑暗，一边发光', ref: '14:15',
      verse: V.between,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.goTo(0.87, 14, b.instant);
            walk('moses', 0.525, { speed: 0.03, pose: 'raise' });
            liftStaff(true);
            crowdPose('rs:folk', 'stand'); pose('miriam', 'stand');
          }],
          [7.5, b => {
            add('angel', { label: '神的使者', sex: 'm', age: 'adult', angel: true, x: 0.62, facing: 1, glow: 1, from: b.instant ? 'none' : 'light' });
            walk('angel', 0.835, { speed: 0.03 });
            movePillar('rear', b.instant);
            if (!b.instant) sfx('angel', { soft: true });
          }],
          [17, b => {
            W.set('rsDark', 1, b.instant);
            if (!b.instant) sfx('wind', { soft: true, low: true });
          }],
          [19, () => { rm('angel'); }],
          [20, () => { pose('moses', 'stand'); liftStaff(false); face('moses', -1); }],
        ]);
      },
    },

    // ── 14:21 · 15:8 大东风，海水分开 ───────────────────────
    {
      kind: 'cmd', utter: '你举手向海伸杖，把水分开', cmd: 'split 红海 --wind east --all-night', ref: '14:16',
      verse: V.part,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.goTo(0.99, 20, b.instant);
            avoid([0.42, 1]);
            // 摩西站到岸边、路口的左角上（海要在他面前分开），夜里身上的光亮一些；百姓退到路口的右边
            walk('moses', 0.455, { speed: 0.035, pose: 'point' });
            face('moses', -1);
            const m = fig('moses'); if (m) m.glow = 0.8;
            crowdWalk('rs:folk', 0.585, 0.82, { speed: 0.02 });
          }],
          [4, b => { W.set('rsRod', 1, b.instant); }],
          [10.5, b => { W.set('rsRod', 0, b.instant); }],
          [3, b => {
            W.set('rsWind', 1, b.instant);
            W.set('gale', 0.85, b.instant);
            if (!b.instant) { sfx('wind'); W.shake = Math.max(W.shake, 0.4); }
          }],
          [5, b => {
            W.set('rsSea', 1, b.instant);
            if (!b.instant) { sfx('splash', { size: 3 }); sfx('thunder', { soft: true, low: true }); W.shake = Math.max(W.shake, 0.7); }
          }],
          [10, b => { if (!b.instant) { sfx('splash', { size: 2.5 }); sfx('wind'); } }],
          [16, b => { if (!b.instant) { sfx('harp'); sfx('splash', { size: 2 }); } }],
          [20, b => { W.set('gale', 0.5, b.instant); W.set('rsWind', 0.55, b.instant); }],
        ]);
      },
    },

    // ── 14:22–23 以色列人下海中走干地；埃及人跟着下去 ────────
    {
      kind: 'promise', utter: '以色列人要下海中走干地', cmd: 'walk 以色列 --path 海中的干地 --walls left,right', ref: '14:16',
      verse: V.cross,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            S.across = true;
            W.set('rsCross', 1, b.instant);
            avoid([0.42, 0.74]);
            setSite(null, b.instant);
            movePillar('rear2', b.instant);
            // 百姓走进路口（画面正中的岸边），在路上化作由近而远的人流
            crowdWalk('rs:folk', 0.475, 0.57, { speed: 0.055 });
            crowdWalk('rs:flock', 0.5, 0.56, { speed: 0.03 });
            walk('aaron', 0.49, { speed: 0.03 }); walk('miriam', 0.51, { speed: 0.03 });
            walk('bearer1', 0.53); walk('bearer2', 0.555);
            if (!b.instant) sfx('crowd', { soft: true });
          }],
          [2.5, () => { rmCrowd('rs:folk2'); }],
          [7.5, () => { rmCrowd('rs:folk'); rmCrowd('rs:flock'); }],
          [8.5, () => { rm('aaron'); rm('miriam'); rm('bearer1'); rm('bearer2'); S.chest = null; }],
          // 14:23 紧接着 14:22（不留一段无声的空白）：埃及人的车一辆一辆驶向路口
          [11, b => {
            narrate(V.cross2, b);
            W.set('rsDark', 0.3, b.instant);
            W.set('rsDive', 1, b.instant);
            if (!b.instant) sfx('thunder', { soft: true });
          }],
          [17, b => {
            walk('moses', 0.5, { speed: 0.02 });
            W.set('rsChase', 0.4, b.instant);
          }],
          [19.5, () => { rm('moses'); }],
        ]);
      },
    },

    // ── 14:24–25 晨更：耶和华从云火柱中观看，车轮脱落 ────────
    {
      kind: 'act', utter: '耶和华从云火柱中向埃及的军兵观看', cmd: 'watch 埃及军兵 --from 云火柱 && detach 车轮', ref: '14:24',
      verse: V.watch,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.goTo(0.205, 14, b.instant);
            movePillar('sea', b.instant);
            W.set('rsChase', 1, b.instant);
            W.set('rsDark', 0, b.instant);
          }],
          [5, b => {
            W.set('rsGaze', 1, b.instant);
            if (!b.instant) { sfx('thunder'); W.flash = Math.max(W.flash || 0, 0.25); }
          }],
          [7, b => {
            W.set('rsWheels', 1, b.instant);
            if (!b.instant) { sfx('build'); W.shake = Math.max(W.shake, 0.4); }
          }],
          [11, b => {
            W.set('rsGaze', 0.25, b.instant);
            W.set('rsFlee', 1, b.instant);
            if (!b.instant) sfx('crowd', { soft: true });
          }],
        ]);
      },
    },

    // ── 14:26–31 天一亮，水仍合 ─────────────────────────────
    {
      kind: 'judge', utter: '你向海伸杖，叫水仍合', cmd: 'merge 红海 --at dawn  # 连一个也没有剩下', ref: '14:26',
      verse: V.close,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.goTo(0.285, 13, b.instant);
            W.set('rsStaff', 1, b.instant);
            W.set('rsGaze', 0, b.instant);
            movePillar('far', b.instant);
            W.set('rsCloud', 0, b.instant);
            if (!b.instant) sfx('harp');
          }],
          [2, b => {
            S.closing = true;
            W.set('rsClose', 1, b.instant);
            W.set('rsFoam', 1, b.instant);
            if (!b.instant) { sfx('splash', { size: 3 }); sfx('thunder'); W.shake = Math.max(W.shake, 1); }
          }],
          [4.5, b => { if (!b.instant) { sfx('splash', { size: 3 }); W.shake = Math.max(W.shake, 0.6); } }],
          [7, b => { if (!b.instant) { sfx('splash', { size: 3 }); sfx('thunder', { soft: true, low: true }); W.shake = Math.max(W.shake, 0.9); } }],
          [9.5, b => {
            W.set('rsSea', 0, true); W.set('rsClose', 0, true);
            W.set('rsChase', 0, true); W.set('rsFlee', 0, true); W.set('rsWheels', 0, true); W.set('rsDive', 0, true); W.set('rsArmy', 0, true);
            S.closing = false;
            W.set('rsFoam', 0, b.instant);
            W.set('rsWind', 0, b.instant);
            W.set('gale', 0.08, b.instant);
          }],
          // 天亮了，海水复原：以色列人已在海的那一边——近处的地换成书珥旷野的黄沙（不是埃及那边的青草地），
          // 摩西站在岸边，仍向海伸着杖（14:27）；海边冲上岸的车轮与盾牌（14:30）；百姓都在岸上看着（14:31）
          [10.5, b => {
            W.set('rsStaff', 0, b.instant);
            S.across = false;
            W.set('rsCross', 0, true);
            for (const [k2, v2] of SHUR) if (W.hasLevel(k2)) W.set(k2, v2, b.instant);
            W.set('rsWreck', 1, b.instant);
            avoid([0.46, 1]);
            const fr = b.instant ? 'none' : 'fade';
            add('moses', { label: '摩西', sex: 'm', age: 'elder', x: 0.5, facing: -1, robe: ROBE.moses, glow: 0.6, prop: 'staff', pose: 'raise', from: fr });
            liftStaff(true);
            add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: 0.535, facing: -1, robe: ROBE.aaron, glow: 0.3, from: fr });
            crowd('rs:folk', { n: 14, x0: 0.56, x1: 0.9, layer: 2, label: '以色列人', from: fr, mill: false });
            crowdFace('rs:folk', -1);
            herd('rs:flock', { kind: 'sheep', n: 7, x0: 0.93, x1: 1.02, label: '羊群', from: fr, mill: false });
            if (!b.instant) sfx('crowd', { soft: true });
          }],
          // 以色列人看见耶和华向埃及人所行的大事，就敬畏耶和华（14:31）
          [15, b => {
            crowdPose('rs:folk', 'bow'); pose('aaron', 'bow');
            if (!b.instant) sfx('harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 15:1–21 摩西之歌；米利暗的鼓 ───────────────────────
    {
      kind: 'act', utter: '耶和华必作王，直到永永远远', cmd: 'sing 耶和华 --timbrel 米利暗 --loop', ref: '15:18',
      verse: V.song,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            // 摩西、亚伦与百姓已在海的这一边（上一句天亮时显出）
            W.goTo(0.37, 12, b.instant);
            movePillar('shore', b.instant);
            W.set('rsCloud', 1, b.instant);
            W.set('gale', 0, b.instant);
            avoid([0.46, 1]);
            pose('moses', 'stand'); liftStaff(false); face('moses', -1);
            const m = fig('moses'); if (m) m.glow = 0.45;
            pose('aaron', 'stand');
            crowdPose('rs:folk', 'stand');
            if (!b.instant) sfx('crowd', { soft: true });
          }],
          [2.5, b => {
            pose('moses', 'raise'); liftStaff(true); face('moses', -1);
            crowdPose('rs:folk', 'raise');
            if (!b.instant) sfx('harp');
          }],
          [9, b => {
            const fr = b.instant ? 'none' : 'fade';
            add('miriam', { label: '米利暗', sex: 'f', age: 'elder', x: 0.6, facing: -1, robe: ROBE.miriam, glow: 0.35, prop: null, pose: 'raise', from: fr });
            for (let i = 1; i <= 6; i++) {
              add('w' + i, { label: '众妇女', sex: 'f', age: 'adult', x: 0.6 + i * 0.024 + (i % 2) * 0.004, facing: -1, robe: ROBE.women[i - 1], glow: 0.14, pose: 'raise', v: 0.06 + 0.05 * (i % 3), from: fr });
            }
            crowdWalk('rs:folk', 0.78, 0.9, { pose: 'raise' });
            W.set('rsDance', 1, b.instant);
            if (!b.instant) { sfx('harp'); sfx('laugh', { soft: true }); }
          }],
          [15, b => { if (!b.instant) sfx('harp'); }],
          [20, () => { pose('moses', 'stand'); liftStaff(false); }],
        ]);
      },
    },

    // ── 15:22–27 书珥的旷野；玛拉的苦水；以琳 ───────────────
    {
      kind: 'promise', utter: '我耶和华是医治你的', cmd: 'patch 玛拉.水 --with 树  # 苦 → 甜', ref: '15:26',
      verse: V.marah,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.set('rsDance', 0, b.instant);
            for (let i = 1; i <= 6; i++) rm('w' + i);
            W.goTo(0.5, 10, b.instant);
            W.set('bare', 0.95, b.instant); W.set('grass', 0.08, b.instant); W.set('herbs', 0.05, b.instant); W.set('trees', 0.02, b.instant);
            W.set('rsWreck', 0, b.instant);
            W.set('rsPool', 1, b.instant); W.set('rsMarah', 0, true);
            S.tree = 'ground';
            movePillar('marah', b.instant);
            avoid([0.44, 1]);
            walk('moses', 0.7, { speed: 0.03 }); walk('aaron', 0.67, { speed: 0.03 }); walk('miriam', 0.64, { speed: 0.03, pose: 'stand' });
            crowdWalk('rs:folk', 0.56, 0.8);
            crowdWalk('rs:flock', 0.47, 0.53);
          }],
          [6.5, () => { crowdPose('rs:folk', 'kneel'); }],
          [9.5, b => { crowdPose('rs:folk', 'stand'); if (!b.instant) sfx('crowd'); }],
          [13, b => {
            pose('moses', 'pray');
            W.set('rsTree', 1, b.instant);
            if (!b.instant) sfx('harp', { soft: true });
          }],
          [15.5, () => { walk('moses', TREE_X - 0.018, { speed: 0.065, pose: 'bow' }); }],
          [19, () => { S.tree = 'taken'; prop('moses', 'wood'); walk('moses', 0.72, { speed: 0.065, pose: 'point' }); face('moses', -1); W.set('rsTree', 0, true); }],
          [21.5, b => {
            S.tree = 'thrown';
            prop('moses', 'staff');
            W.set('rsMarah', 1, b.instant);
            if (!b.instant) {
              safe('rs.ring2', () => fx().ring(POOL_X * W.w, fY(2, POOL_X, POOL_V), [200, 236, 255], 0.08 * W.w, 1.6, 1.2));
              sparkleAt(POOL_X, POOL_V, 30, [220, 240, 255]);
              sfx('splash'); sfx('harp');
            }
          }],
          [23.5, () => { crowdPose('rs:folk', 'kneel'); pose('moses', 'stand'); }],
          [25.5, b => {
            W.set('rsElim', 1, b.instant);
            W.goTo(0.64, 8, b.instant);
            setSite('elim', b.instant);
            movePillar('elim', b.instant);
            W.set('rsPool', 0, b.instant);
            avoid([0.44, 1]);
            // 以琳的棕树与水泉在右边前方；百姓在它们左边，不被树挡住
            crowdWalk('rs:folk', 0.58, 0.73);
            walk('moses', 0.79, { speed: 0.035 }); walk('aaron', 0.77, { speed: 0.035 }); walk('miriam', 0.75, { speed: 0.035 });
            if (!b.instant) sfx('splash', { soft: true });
          }],
        ]);
      },
    },

    // ── 16:1–14 汛的旷野：荣光在云中；鹌鹑；如白霜的小圆物 ──
    {
      kind: 'promise', utter: '我要将粮食从天降给你们', cmd: 'rain 粮食 --from heaven --daily', ref: '16:4',
      verse: V.manna,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.set('rsElim', 0, b.instant);
            setSite('sin', b.instant);
            movePillar('sin', b.instant);
            S.tree = 'gone';
            W.set('bare', 0.95, b.instant); W.set('grass', 0.1, b.instant); W.set('herbs', 0.06, b.instant); W.set('trees', 0, b.instant);
            W.goTo(0.58, 6, b.instant);
            avoid([0.44, 1]);
            crowdWalk('rs:folk', 0.59, 0.88, { pose: 'sit' });
            walk('moses', 0.6, { speed: 0.04 }); walk('aaron', 0.63, { speed: 0.04 }); walk('miriam', 0.565, { speed: 0.04, pose: 'sit' });
            if (!b.instant) sfx('crowd');
          }],
          [8, b => {
            W.set('rsGlory', 1, b.instant);
            crowdPose('rs:folk', 'gaze');
            face('moses', 1); face('aaron', 1);
            if (!b.instant) { sfx('angel'); sfx('harp'); }
          }],
          [13, b => { W.set('rsGlory', 0.2, b.instant); W.goTo(0.752, 5, b.instant); crowdPose('rs:folk', 'stand'); }],
          [15, b => {
            W.set('rsQuail', 1, b.instant); W.set('rsQuailA', 1, b.instant);
            if (!b.instant) { sfx('wings'); sfx('bird'); }
          }],
          [18, b => { if (!b.instant) sfx('wings'); }],
          [22, b => { W.goTo(0.27, 7, b.instant); W.set('rsGlory', 0, b.instant); crowdPose('rs:folk', 'sit'); }],
          [24.5, b => { W.set('rsQuailA', 0, b.instant); W.set('rsDew', 1, b.instant); }],
          [28.5, b => {
            W.set('rsDew', 0, b.instant);
            W.set('rsManna', 1, b.instant);
            if (!b.instant) sfx('stars');
          }],
        ]);
      },
    },

    // ── 16:15–35 吗哪；第七天安息 ───────────────────────────
    {
      kind: 'bless', utter: '你们看！耶和华既将安息日赐给你们', cmd: 'sleep 第七日  # 不许什么人出去', ref: '16:29',
      verse: V.sabbath,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.set('rsQuail', 0, true); W.set('rsQuailA', 0, true); W.set('rsDew', 0, true);
            W.set('rsGlory', 0, b.instant);
            W.goTo(0.37, 6, b.instant);
            crowdWalk('rs:folk', 0.58, 0.9, { pose: 'kneel' });
            crowdProp('rs:folk', 'jar');
            walk('moses', 0.56, { speed: 0.03 }); face('moses', 1);
            if (!b.instant) sfx('crowd', { soft: true });
          }],
          [5, b => { W.set('rsManna', 0.45, b.instant); crowdPose('rs:folk', 'bow'); }],
          [8, () => { crowdPose('rs:folk', 'kneel'); }],
          [9.5, b => { W.goTo(0.5, 4, b.instant); W.set('rsManna', 0, b.instant); crowdPose('rs:folk', 'stand'); }],
          [13, b => {
            W.goTo(0.33, 7, b.instant);
            crowdProp('rs:folk', null);
            W.set('rsRest', 1, b.instant);
            W.set('sabbath', 0.5, b.instant);
            crowdWalk('rs:folk', 0.62, 0.9, { pose: 'sit' });
            walk('moses', 0.6, { speed: 0.03, pose: 'sit' }); walk('aaron', 0.64, { speed: 0.03, pose: 'sit' }); pose('miriam', 'sit');
            if (!b.instant) sfx('harp', { soft: true });
          }],
          [21, b => { W.goTo(0.66, 9, b.instant); }],
        ]);
      },
    },

    // ── 17:1–7 利非订：击打磐石 ─────────────────────────────
    {
      kind: 'cmd', utter: '你要击打磐石，从磐石里必有水流出来', cmd: 'strike 磐石 | tee 百姓  # 玛撒 · 米利巴', ref: '17:6',
      verse: V.rock,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            W.set('rsRest', 0, b.instant); W.set('sabbath', 0, b.instant);
            W.set('rsManna', 0, true);
            setSite('reph', b.instant);
            movePillar('reph', b.instant);
            W.set('rsRock', 1, b.instant);
            W.set('rsHoreb', 0.6, b.instant);
            W.goTo(0.47, 8, b.instant);
            avoid([0.34, 1]);
            crowdWalk('rs:folk', 0.66, 0.88, { pose: 'raise' });
            crowdWalk('rs:flock', 0.355, 0.395);
            walk('moses', 0.68, { speed: 0.03 }); face('moses', 1);
            walk('aaron', 0.705, { speed: 0.03 }); walk('miriam', 0.74, { speed: 0.03, pose: 'stand' });
            if (!b.instant) sfx('crowd');
          }],
          [6, b => {
            const fr = b.instant ? 'none' : 'fade';
            for (let i = 1; i <= 3; i++) add('e' + i, { label: '以色列的长老', sex: 'm', age: 'elder', x: 0.66 + i * 0.022, facing: -1, robe: ROBE.elder[i - 1], glow: 0.15, from: fr });
            walk('moses', 0.566, { speed: 0.03, pose: 'stand' });
            walk('e1', 0.535, { speed: 0.03 }); walk('e2', 0.515, { speed: 0.03 }); walk('e3', 0.495, { speed: 0.03 });
            W.set('rsRockGlory', 1, b.instant);
            if (!b.instant) sfx('harp', { soft: true });
          }],
          [12, b => {
            face('moses', 1);
            pose('moses', 'point');
            W.set('rsSpring', 1, b.instant);
            if (!b.instant) {
              sfx('build'); sfx('splash', { size: 2 });
              W.shake = Math.max(W.shake, 0.35); W.flash = Math.max(W.flash || 0, 0.18);
              sparkleAt(0.59, 0.05, 36, [220, 240, 255]);
            }
          }],
          [15.5, b => {
            W.set('rsRockGlory', 0.25, b.instant);
            crowdWalk('rs:folk', 0.45, 0.62, { pose: 'kneel' });
            pose('moses', 'stand');
            if (!b.instant) sfx('splash', { soft: true });
          }],
        ]);
      },
    },

    // ── 17:8–16 亚玛力；摩西举手直到日落；耶和华尼西 ───────
    {
      kind: 'judge', utter: '我要将亚玛力的名号从天下全然涂抹了', cmd: 'hold 摩西.hands --up --until sunset  # 亚伦 · 户珥', ref: '17:14',
      verse: V.amalek,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            const fr = b.instant ? 'none' : 'fade';
            W.goTo(0.6, 8, b.instant);
            W.set('rsRockGlory', 0, b.instant);
            for (let i = 1; i <= 3; i++) rm('e' + i);
            avoid([0.34, 1]);
            crowdWalk('rs:folk', 0.45, 0.54, { pose: 'stand' });
            walk('miriam', 0.5, { speed: 0.04 });
            add('hur', { label: '户珥', sex: 'm', age: 'elder', x: 0.66, facing: -1, robe: ROBE.hur, glow: 0.25, from: fr });
            add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: 0.7, facing: 1, robe: ROBE.joshua, glow: 0.35, prop: null, from: fr });
            crowd('rs:men', { n: 8, x0: 0.66, x1: 0.78, layer: 2, label: '约书亚的兵', robe: ROBE.men, prop: null, from: fr, mill: false });
            crowd('rs:amalek', { n: 9, x0: 1.03, x1: 1.2, layer: 2, label: '亚玛力人', robe: ROBE.amalek, prop: null, from: 'none', mill: false });
            crowdWalk('rs:amalek', 0.86, 1.0, { speed: 0.04 });
            // 摩西、亚伦、户珥上了磐石的顶
            attach('moses', () => rockTop(-0.08));
            attach('aaron', () => rockTop(-0.4));
            attach('hur', () => rockTop(0.26));
            prop('aaron', null); prop('hur', null);
            S.onRock = true;
            // 「我手里要拿着神的杖」：举起的手里拿着杖
            pose('moses', 'raise'); liftStaff(true); face('moses', 1);
            if (!b.instant) sfx('crowd');
          }],
          [6, b => {
            W.set('rsBattle', 1, b.instant);
            crowdWalk('rs:men', 0.75, 0.85, { pose: 'raise' });
            crowdWalk('rs:amalek', 0.87, 1.0, { pose: 'raise' });
            walk('joshua', 0.77, { pose: 'raise' });
            if (!b.instant) sfx('thunder', { soft: true, far: true });
          }],
          [11, () => {
            pose('moses', 'stand'); liftStaff(false);
            crowdWalk('rs:amalek', 0.8, 0.95, { pose: 'raise' });
            crowdWalk('rs:men', 0.69, 0.79, { pose: 'raise' });
            walk('joshua', 0.72, { pose: 'raise' });
          }],
          [15, b => {
            pose('moses', 'raise'); liftStaff(true); pose('aaron', 'raise'); pose('hur', 'raise');
            crowdWalk('rs:men', 0.78, 0.9, { pose: 'raise' });
            crowdWalk('rs:amalek', 0.91, 1.04, { pose: 'raise' });
            walk('joshua', 0.8, { pose: 'raise' });
            W.goTo(0.72, 9, b.instant);
          }],
          [22, b => {
            crowdWalk('rs:amalek', 1.1, 1.3, { speed: 0.06 });
            W.set('rsBattle', 0, b.instant);
            crowdPose('rs:men', 'stand');
            if (!b.instant) sfx('harp');
          }],
          [24, b => {
            // 日落时（还在暮光里）筑坛，立起旗来
            attach('moses', null); attach('aaron', null); attach('hur', null);
            S.onRock = false;
            liftStaff(false); prop('aaron', 'staff'); prop('hur', 'staff');
            walk('moses', 0.555, { speed: 0.035, pose: 'pray' }); walk('aaron', 0.505, { speed: 0.035 }); walk('hur', 0.58, { speed: 0.035 });
            W.set('rsAltar', 1, b.instant);
            if (!b.instant) sfx('build', { soft: true });
          }],
          [26, () => { rmCrowd('rs:amalek'); }],
        ]);
      },
    },

    // ── 18 叶忒罗；千夫长、百夫长…… ────────────────────────
    {
      kind: 'act', utter: '耶和华比万神都大', cmd: 'delegate 审判 --to 千夫长,百夫长,五十夫长,十夫长', ref: '18:11',
      verse: V.jethro,
      apply(c) {
        ring(c);
        T(c, [
          [0, b => {
            const fr = b.instant ? 'none' : 'fade';
            W.goTo(0.36, 8, b.instant);
            setSite('horeb', b.instant);
            movePillar('horeb', b.instant);
            W.set('rsHoreb', 1, b.instant);
            W.set('rsSpring', 1, b.instant);
            avoid([0.4, 1]);
            rmCrowd('rs:men');
            pose('moses', 'stand');
            add('jethro', { label: '叶忒罗', sex: 'm', age: 'elder', x: 1.05, facing: -1, robe: ROBE.jethro, glow: 0.35, from: fr });
            add('zipporah', { label: '西坡拉', sex: 'f', age: 'adult', x: 1.08, facing: -1, robe: ROBE.zipporah, glow: 0.25, from: fr });
            add('gershom', { label: '革舜', sex: 'm', age: 'adult', scale: 0.86, x: 1.11, facing: -1, robe: ROBE.gershom, glow: 0.2, from: fr });
            add('eliezer', { label: '以利以谢', sex: 'm', age: 'child', x: 1.13, facing: -1, robe: ROBE.eliezer, glow: 0.2, from: fr });
            animal('jdonkey', { kind: 'donkey', x: 1.07, layer: 2, label: '驴', facing: -1, pack: true, from: fr });
            walk('jethro', 0.86, { speed: 0.03 }); walk('zipporah', 0.89, { speed: 0.03 }); walk('gershom', 0.915, { speed: 0.03 }); walk('eliezer', 0.935, { speed: 0.03 });
            walk('jdonkey', 0.955, { speed: 0.03 });
            crowdWalk('rs:folk', 0.44, 0.68);
            if (!b.instant) sfx('donkey', { soft: true });
          }],
          [5, () => { walk('moses', 0.815, { speed: 0.04 }); face('moses', 1); }],
          [9.5, () => { pose('moses', 'bow'); }],
          [11.5, () => { const c2 = C(); if (c2.embrace && fig('moses') && fig('jethro')) c2.embrace('moses', 'jethro', { at: 0.835 }); }],
          [15, b => {
            W.set('rsOffer', 1, b.instant);
            walk('jethro', 0.575, { speed: 0.035, pose: 'stand' }); walk('moses', 0.6, { speed: 0.035, pose: 'stand' });
            walk('aaron', 0.5, { speed: 0.03, pose: 'kneel' });
            walk('zipporah', 0.66, { speed: 0.03 }); walk('gershom', 0.685, { speed: 0.03 }); walk('eliezer', 0.7, { speed: 0.03 });
            if (!b.instant) sfx('fire');
          }],
          [21, b => {
            W.goTo(0.64, 7, b.instant);
            W.set('rsOffer', 0.3, b.instant);
            walk('moses', 0.74, { speed: 0.04, pose: 'seat' });
            walk('jethro', 0.86, { speed: 0.06 });
            crowdWalk('rs:folk', 0.46, 0.8);
            pose('aaron', 'stand');
          }],
          [24.5, b => {
            W.set('rsJudge', 1, b.instant);
            pose('moses', 'stand');
            if (!b.instant) sfx('crowd', { soft: true });
          }],
          [26, b => {
            walk('jethro', 1.12, { speed: 0.065 }); walk('jdonkey', 1.15, { speed: 0.065 });
            W.goTo(0.8, 10, b.instant);
          }],
          [29.5, b => {
            rm('jethro'); rm('jdonkey');
            W.goTo(0.93, 14, b.instant);
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    if (!cur()) return;
    SCRIM += (scrimWant() - SCRIM) * Math.min(1, (dt || 0) * 1.6);
    // 米利暗与众妇女：随鼓点轻轻跳起
    const k = W.lv.rsDance;
    for (let i = 1; i <= 6; i++) {
      const p = fig('w' + i);
      if (!p) continue;
      const base = 0.06 + 0.05 * (i % 3);
      p.v = base - (k > 0.02 ? 0.03 * k * Math.pow(Math.max(0, Math.sin(W.t * 5.2 + i * 0.9)), 2) : 0);
    }
  }
  const SCENE = {
    init() { G = null; DOTS = null; SCRIM = 0; },
    resize() { G = null; DOTS = null; },
    update,
    drawUnder(ctx, pass) {
      if (!cur()) return;
      if (pass === 'sky') { PK.length = 0; return; }
      if (pass === 'far') drawHoreb(ctx);
      else if (pass === 'mid') { drawCamp(ctx, 1); drawElim(ctx, 1); drawGroundDots(ctx, 1); }
      else if (pass === 'near') {
        drawStream(ctx);
        drawRock(ctx);
        drawCamp(ctx, 2);
        drawChest(ctx, true);
        drawWreck(ctx);
        drawPool(ctx);
        drawMarahTree(ctx);
        drawElim(ctx, 2);
        drawGroundDots(ctx, 2);
        drawQuail(ctx, true);
        drawAltar(ctx);
      }
    },
    draw(ctx, pass) {
      if (!cur()) return;
      if (pass === 'seaFar') drawFarShore(ctx);
      else if (pass === 'seaNear') drawCorridor(ctx);
      else if (pass === 'mid') {
        drawArmy(ctx, 1);
        for (const P of pillarNow()) if (P.layer === 1) drawPillar(ctx, P.x, P.y, P.k, P.a, P.rise);
      }
      else if (pass === 'near') {
        drawArmy(ctx, 2);
        drawBattle(ctx);
        for (const P of pillarNow()) if (P.layer === 2) drawPillar(ctx, P.x, P.y, P.k, P.a, P.rise);
      } else if (pass === 'air') {
        drawScrim(ctx);
        drawDarkness(ctx);
        drawGlints(ctx);
        drawChest(ctx, false);
        drawLiftedStaff(ctx);
        drawRod(ctx);
        drawTimbrels(ctx);
        drawSpears(ctx);
        drawQuail(ctx, false);
        drawRockGlory(ctx);
        drawRest(ctx);
        drawJudges(ctx);
        drawWind(ctx);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    },
    reset() { GL.length = 0; TORCH.length = 0; PK.length = 0; },
    restore() { GL.length = 0; TORCH.length = 0; G = null; DOTS = null; },
    pick(x, y, r) {
      if (!cur()) return null;
      let best = null;
      for (const q of PK) {
        const d = Math.max(0, Math.hypot(x - q.x, y - q.y) - q.r * 0.5);
        if (d < r && (!best || d < best.d)) best = { label: q.label, x: q.x, y: q.y, d };
      }
      return best;
    },
    sig() { return { site: S.siteB, pillar: S.pB, chest: S.chest, closing: S.closing, across: S.across, tree: S.tree, onRock: S.onRock, lift: S.lift }; },
  };

  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '红海', sub: '出埃及记 13:17 — 18:27', tint: TINT, music: 'flood',
    intro: INTRO,
    outro: 18,
    behold: {
      '摩西': { text: '摩西向海伸杖，耶和华便用大东风，使海水一夜退去，<br>水便分开，海就成了干地。', ref: '出埃及记 14:21' },
      '亚伦': { text: '亚伦正对以色列全会众说话的时候，他们向旷野观看，<br>不料，耶和华的荣光在云中显现。', ref: '出埃及记 16:10' },
      '米利暗': { text: '亚伦的姊姊，女先知米利暗，手里拿着鼓；众妇女也跟她出去拿鼓跳舞。', ref: '出埃及记 15:20' },
      '众妇女': { text: '米利暗应声说：你们要歌颂耶和华，因他大大战胜，将马和骑马的投在海中。', ref: '出埃及记 15:21' },
      '以色列人': { text: '以色列人却在海中走干地；水在他们的左右作了墙垣。', ref: '出埃及记 14:29' },
      '神的使者': { text: '在以色列营前行走神的使者，转到他们后边去；<br>云柱也从他们前边转到他们后边立住。', ref: '出埃及记 14:19' },
      '约书亚': { text: '于是约书亚照着摩西对他所说的话行，和亚玛力人争战。<br>摩西、亚伦，与户珥都上了山顶。', ref: '出埃及记 17:10' },
      '约书亚的兵': { text: '摩西对约书亚说：「你为我们选出人来，出去和亚玛力人争战……」', ref: '出埃及记 17:9' },
      '户珥': { text: '亚伦与户珥扶着他的手，一个在这边，一个在那边，<br>他的手就稳住，直到日落的时候。', ref: '出埃及记 17:12' },
      '亚玛力人': { text: '那时，亚玛力人来在利非订，和以色列人争战。', ref: '出埃及记 17:8' },
      '以色列的长老': { text: '耶和华对摩西说：「你手里拿着你先前击打河水的杖，<br>带领以色列的几个长老，从百姓面前走过去……」', ref: '出埃及记 17:5' },
      '叶忒罗': { text: '叶忒罗因耶和华待以色列的一切好处，<br>就是拯救他们脱离埃及人的手，便甚欢喜。', ref: '出埃及记 18:9' },
      '西坡拉': { text: '便带着摩西的妻子西坡拉，就是摩西从前打发回去的，', ref: '出埃及记 18:2' },
      '革舜': { text: '又带着西坡拉的两个儿子，一个名叫革舜，<br>因为摩西说：「我在外邦作了寄居的」；', ref: '出埃及记 18:3' },
      '以利以谢': { text: '一个名叫以利以谢，因为他说：「我父亲的神帮助了我，救我脱离法老的刀。」', ref: '出埃及记 18:4' },
      '云柱': { text: '日间云柱，夜间火柱，总不离开百姓的面前。', ref: '出埃及记 13:22' },
      '火柱': { text: '日间，耶和华在云柱中领他们的路；夜间，在火柱中光照他们，<br>使他们日夜都可以行走。', ref: '出埃及记 13:21' },
      '海边': { text: '当日，耶和华这样拯救以色列人脱离埃及人的手，<br>以色列人看见埃及人的死尸都在海边了。', ref: '出埃及记 14:30' },
      '海中的干地': { text: '以色列人下海中走干地，水在他们的左右作了墙垣。', ref: '出埃及记 14:22' },
      '水墙': { text: '你发鼻中的气，水便聚起成堆，<br>大水直立如垒，海中的深水凝结。', ref: '出埃及记 15:8' },
      '法老的车': { text: '并带着六百辆特选的车和埃及所有的车，每辆都有车兵长。', ref: '出埃及记 14:7' },
      '以色列的营': { text: '他们从疏割起行，在旷野边的以倘安营。', ref: '出埃及记 13:20' },
      '约瑟的骸骨': { text: '摩西把约瑟的骸骨一同带去；因为约瑟曾叫以色列人严严地起誓，<br>对他们说：「神必眷顾你们，你们要把我的骸骨从这里一同带上去。」', ref: '出埃及记 13:19' },
      '玛拉': { text: '到了玛拉，不能喝那里的水；因为水苦，所以那地名叫玛拉。', ref: '出埃及记 15:23' },
      '那棵树': { text: '摩西呼求耶和华，耶和华指示他一棵树。<br>他把树丢在水里，水就变甜了。', ref: '出埃及记 15:25' },
      '以琳': { text: '他们到了以琳，在那里有十二股水泉，七十棵棕树；<br>他们就在那里的水边安营。', ref: '出埃及记 15:27' },
      '吗哪': { text: '这食物，以色列家叫吗哪；样子像芫荽子，<br>颜色是白的，滋味如同搀蜜的薄饼。', ref: '出埃及记 16:31' },
      '鹌鹑': { text: '到了晚上，有鹌鹑飞来，遮满了营；<br>早晨在营四围的地上有露水。', ref: '出埃及记 16:13' },
      '何烈的磐石': { text: '「我必在何烈的磐石那里，站在你面前。<br>你要击打磐石，从磐石里必有水流出来，使百姓可以喝。」', ref: '出埃及记 17:6' },
      '玛撒': { text: '他给那地方起名叫玛撒，又叫米利巴；因以色列人争闹，<br>又因他们试探耶和华，说：「耶和华是在我们中间不是？」', ref: '出埃及记 17:7' },
      '耶和华尼西': { text: '摩西筑了一座坛，起名叫「耶和华尼西」，<br>又说：「耶和华已经起了誓，必世世代代和亚玛力人争战。」', ref: '出埃及记 17:15–16' },
      '神的山': { text: '摩西的岳父叶忒罗带着摩西的妻子和两个儿子来到神的山，<br>就是摩西在旷野安营的地方。', ref: '出埃及记 18:5' },
    },
    setup, stages: STAGES, scene: SCENE,
  });
})(window.GS);
