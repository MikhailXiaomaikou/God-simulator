/* ─────────────────────────────────────────────────────────────
 * book/throne.js —— 启示录 · 宝座（启示录 1 — 5）
 *
 * 拔摩海岛：近地是一座多石的小岛，右边一块大磐石，石下一个洞口；海那边远远的岸上是亚细亚的七个教会。
 * 一 · 「我是阿拉法，我是俄梅戛」——黎明前，年老的约翰在岸边的一盏小灯旁祷告；一道光弧自东方的海平线划过全天，
 *      直到西方：起头一端聚成「阿拉法」，末了一端聚成「俄梅戛」；主日的黎明随之而来（1:4–8）。
 * 二 · 「你所看见的当写在书上」——在他后面有大声音如吹号；约翰坐下，膝上展开书卷；
 *      远处的岸上，七个教会一处一处点亮：以弗所、士每拿、别迦摩、推雅推喇、撒狄、非拉铁非、老底嘉（1:9–11）。
 * 三 · 「灯台中间有一位好像人子」——他转过身来，七个金灯台一盏一盏立起、点亮；灯台中间有一位如光的人子：
 *      胸间金带，脚如光明的铜，右手中七星环绕，面貌如同烈日放光（只有光，不画面目）；四围的世界暗下来，
 *      只有灯台之间亮着（至第五句）；约翰仆倒在他脚前（1:12–16）。
 * 四 · 「不要惧怕！我是首先的，我是末后的」——他俯身用右手按着约翰；约翰跪起，又把所看见的写下来（1:17–19）。
 * 五 · 「凡有耳的，就应当听！」——七星自他右手升起，各经过一个灯台，飞往远处的一个教会；
 *      灯台与教会之间留下一道道光（1:20；2）。
 * 六 · 「看哪，我站在门外叩门」——日落之后，灯台那边一户人家；他站在门外叩门，门开了，灯光流出，开门的人站在门口；
 *      他进到那人那里去：亮着的门里，两人对坐，矮桌上一盏小灯——如光的是他（3:20–21）。
 * 七 · 「你上到这里来」——夜里，天上有门开了，一道光垂到约翰身上；屋门掩上，窗里仍有灯；
 *      一点光自约翰身上顺着那道光升进门里（「我立刻被圣灵感动」）（4:1）。
 * 八 · 「有一个宝座安置在天上」——宝座：那坐着的好像碧玉和红宝石（只有光）；绿宝石的虹围着宝座（4:2–3）。
 * 九 · 「宝座的周围又有二十四个座位」——二十四位长老身穿白衣、头戴金冠冕；闪电、雷轰；七盏火灯（4:4–5）。
 * 十 · 「宝座中和宝座周围有四个活物」——宝座前的玻璃海如同水晶；四活物：像狮子、像牛犊、脸面像人、像飞鹰——
 *      都是光，各有六个翅膀，遍体满了眼睛（4:6–7）。
 * 十一 · 「圣哉！圣哉！圣哉！」——活物昼夜不住地说；长老俯伏，把冠冕放在宝座前；「你创造了万物」——一道光扫过全地（4:8–11）。
 * 十二 · 「里外都写着字，用七印封严了」——坐宝座的右手中的书卷；大力的天使大声宣传；无人配展开，天上的光暗下来，约翰大哭（5:1–4）。
 * 十三 · 「宝座与四活物，并长老之中有羔羊站立」——长老说：不要哭！宝座前的玻璃海上，有一只小小的羔羊站立（只有光）；
 *      七盏火灯的火飞入羔羊，成了它的七角七眼，又化作七道光，奉差遣往普天下去；羔羊拿了书卷（5:5–7）。
 * 十四 · 「你配拿书卷，配揭开七印」——活物与长老俯伏，各拿着琴和金炉；众圣徒的祈祷从地上的灯台与教会升上去；
 *      千千万万的天使满了全天（5:8–12）。
 * 十五 · 「都归给坐宝座的和羔羊，直到永永远远！」——天亮了：天上、地上、沧海里一切被造之物都来赞美——
 *      飞鸟、走兽、鱼与鲸、花与草；「阿们！」众长老俯伏敬拜（5:13–14）。
 *
 * 父从不画出形像：宝座上只有光。人子是一位如光的人（无面目），羔羊是一只小小的光的羔羊（「像是被杀过的」只在经文里）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const sm = (a, b, x) => U.smoothstep(a, b, x);
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'throne';
  const isCur = () => GS.book.current(ACT);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, clamp(a, 0, 1));
  const rand = (a, b) => a + Math.random() * (b - a);     // 只作装饰
  const easeIO = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    trnArc: ['lin', 0.13],     // 1:8 光弧自东而西划过天空（0 → 1）
    trnArcA: ['exp', 0.35],    // 光弧的显隐
    trnVoice: ['exp', 0.7],    // 在我后面有大声音如吹号：身后的一团光（1:10）
    trnScroll: ['exp', 0.9],   // 约翰手中的书卷
    trnChurch: ['lin', 0.75],  // 七个教会一处一处点亮（0 → 7）
    trnLamps: ['lin', 0.9],    // 七个金灯台一盏一盏立起（0 → 7）
    trnSon: ['exp', 0.5],      // 人子的光辉（面貌如同烈日放光）
    trnVeil: ['exp', 0.5],     // 异象之时，四围的世界暗下来，只有灯台之间亮着（1:12–20）
    trnStars: ['exp', 0.6],    // 右手中的七星
    trnSent: ['lin', 0.1],     // 七星飞往七个教会（0 → 1）
    trnThreads: ['exp', 0.35], // 灯台与教会之间的光
    trnHouse: ['exp', 0.5],    // 磐石下的一户人家
    trnLampIn: ['exp', 0.6],   // 屋里的灯
    trnDoorO: ['lin', 0.6],    // 门开了（0 → 1）
    trnTable: ['exp', 0.6],    // 一同坐席：矮桌、饼与杯
    trnGate: ['exp', 0.45],    // 天上的门（4:1）
    trnGateO: ['lin', 0.3],    // 天上的门开了（0 → 1）
    trnThrone: ['exp', 0.32],  // 宝座（4:2）
    trnBow: ['exp', 0.3],      // 虹围着宝座，好像绿宝石（4:3）
    trnElders: ['lin', 2.4],   // 二十四个座位与长老（0 → 24）
    trnZap: ['exp', 0.5],      // 闪电、声音、雷轰（4:5）
    trnFire7: ['exp', 0.6],    // 七盏火灯（4:5）
    trnSeven: ['lin', 0.3],    // 七灯（神的七灵）飞入羔羊，成了它的七角七眼（5:6）（0 → 1）
    trnGlass: ['exp', 0.3],    // 玻璃海（4:6）
    trnBeasts: ['lin', 0.55],  // 四活物（0 → 4）
    trnHoly: ['exp', 0.5],     // 圣哉：活物昼夜不住地说
    trnFall: ['exp', 0.9],     // 俯伏（0 坐 → 1 俯伏）
    trnCrowns: ['lin', 0.3],   // 冠冕放在宝座前（0 → 1）
    trnBook: ['exp', 0.5],     // 坐宝座的右手中的书卷（5:1）
    trnHush: ['exp', 0.45],    // 没有配展开的：天上的光暗下来（5:3–4）
    trnLamb: ['exp', 0.35],    // 羔羊站立（5:6）
    trnRays: ['lin', 0.25],    // 七灵奉差遣往普天下去（0 → 1）
    trnTake: ['lin', 0.28],    // 羔羊拿了书卷（0 → 1）
    trnHarps: ['exp', 0.6],    // 琴与盛满了香的金炉（5:8）
    trnHost: ['lin', 0.16],    // 千千万万的天使（0 → 1）
    trnPraise: ['exp', 0.3],   // 一切被造之物都说颂赞（5:13）
    trnAmen: ['exp', 0.5],     // 阿们（5:14）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有一套）────────────────────
  // 经文在左边的海上（横屏），故人都在 x ≥ 0.52 的地上；竖屏经文在顶上
  const LAYL = {
    john0: 0.535, johnF: 0.62, son: 0.666,
    lamps: [0.572, 0.603, 0.634, 0.666, 0.698, 0.729, 0.76], lampV: [0.3, 0.17, 0.07, 0.02, 0.07, 0.17, 0.3],
    house: 0.845, houseW: 0.1, knock: 0.785,
    rock: 0.932,
    churches: [0.585, 0.64, 0.695, 0.75, 0.805, 0.86, 0.915],
    stones: [[0.43, 0.75, 1.2], [0.486, 0.3, 0.8], [0.52, 0.1, 1.1], [0.84, 0.55, 0.8]],
    oil: 0.553, angel: [0.3, 0.33],
    rays: [[0.6, 2, 0.2], [0.86, 2, 0.35], [0.62, 1, 0], [0.9, 1, 0], [0.8, 0, 0], [0.34, -1, 0.625], [0.16, -1, 0.64]],
  };
  const LAYP = {
    john0: 0.44, johnF: 0.515, son: 0.58,
    lamps: [0.475, 0.51, 0.545, 0.58, 0.615, 0.65, 0.685], lampV: [0.3, 0.17, 0.07, 0.02, 0.07, 0.17, 0.3],
    house: 0.83, houseW: 0.19, knock: 0.732,
    rock: 0.958,
    churches: [0.59, 0.65, 0.71, 0.77, 0.83, 0.89, 0.95],
    stones: [[0.36, 0.3, 1.0], [0.41, 0.12, 0.8], [0.9, 0.62, 0.7]],
    oil: 0.415, angel: [0.2, 0.585],
    rays: [[0.52, 2, 0.2], [0.8, 2, 0.35], [0.62, 1, 0], [0.9, 1, 0], [0.75, 0, 0], [0.26, -1, 0.66], [0.1, -1, 0.7]],
  };
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];
  const CHURCH = ['以弗所', '士每拿', '别迦摩', '推雅推喇', '撒狄', '非拉铁非', '老底嘉'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  // （本卷的状态都在程度 LV 与人物里；S 只记一个版本号）
  let S = fresh();
  function fresh() { return { v: 1 }; }
  let CLK = 0;   // 装饰用的时钟

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.55 : 1) * (LK[l] || 1);   // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fieldH(2, g) * 0.8; };
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const lit = c => [Math.min(255, c[0] * 1.25 + 26), Math.min(255, c[1] * 1.2 + 22), Math.min(255, c[2] * 1.15 + 18)];

  // 人物（皆经人物模块）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function grounded(f) { if (f && (f.fly || f.ny != null)) { f.fly = null; f.ny = null; } }
  function walk(id, x, o) { const f = fig(id); if (!f) return; grounded(f); C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  // 立即到空中那一点（不从地上飞起）
  function flySnap(id, x, y) { const prev = W.replaying; W.replaying = true; fly(id, x, y); W.replaying = prev; }
  function avoid(...r) { W.beastAvoid = r; }
  // 走到某处便隐去（进了屋；重演时直接移去）
  function leave(id, x, o) {
    const f = fig(id);
    if (!f || f.dying) return;
    if (W.replaying) { rm(id, true); return; }
    walk(id, x, o);
    const g = fig(id);
    if (g) g.fadeOnArrive = true;
  }
  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o || {}));
  }
  function chime(str) { const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0])); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function memberPt(m, frac) {
    if (m._vis && isFinite(m._x) && isFinite(m._y)) return [m._x, m._y - (m._h || 30) * frac];
    const l = m.layer == null ? 2 : m.layer;
    const x = m.nx * W.w, g = gY(l, m.nx);
    const y = m.ny != null ? m.ny * W.h : g + (m.v || 0) * fieldH(l, g) * 0.8;
    const h = PH(l) * (AGE_H[m.age] || 1) * (m.scale || 1) * (1 + 0.35 * (m.v || 0));
    return [x, y - h * frac];
  }
  function figPt(id, frac) { const f = fig(id); return f ? memberPt(f, frac) : null; }
  function figH(f) { return f && f._vis && f._h ? f._h : PH(2) * (AGE_H[(f && f.age) || 'adult'] || 1) * ((f && f.scale) || 1); }
  // 头与右手的位置（随姿势）：[向前, 向上]（以身高为 1）
  const HEAD = { stand: [0.02, 0.9], walk: [0.04, 0.9], point: [0.03, 0.9], raise: [0, 0.91], gaze: [-0.04, 0.9], bow: [0.32, 0.6], sit: [0.05, 0.5], kneel: [0.05, 0.62], pray: [0.06, 0.6], weep: [0.08, 0.82] };
  const HAND = { stand: [0.17, 0.5], walk: [0.12, 0.52], point: [0.42, 0.8], raise: [0.08, 1.12], gaze: [0.14, 0.5], bow: [0.44, 0.24], sit: [0.26, 0.34], kneel: [0.2, 0.4], pray: [0.18, 0.7] };
  function partOf(f, TBL) {
    const o = TBL[f.pose] || TBL.stand, h = figH(f);
    const lift = f.angel ? h * (0.07 + 0.02 * Math.sin(W.t * 1.1 + (f.phase || 0))) : 0;
    const x0 = f._vis ? f._x : f.nx * W.w;
    const y0 = f._vis ? f._y : (f.ny != null ? f.ny * W.h : vY(f.nx, f.v || 0));
    const fd = f.fd == null ? f.facing || 1 : f.fd;
    return [x0 + fd * o[0] * h, y0 - o[1] * h - lift, h];
  }
  function chosenName(str, x, y, size, col, src, o) {
    const n = Array.from(str).length, half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(x, half + 8, W.w - half - 8), cy = clamp(y, size + 8, W.h - size);
    fx().nameStr(str, cx, cy, size, col, src, o);
  }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
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
  // 四芒的星
  function makeStar() {
    const c = cnv(64, 64), g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 16);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,246,220,0.6)'); gr.addColorStop(1, 'rgba(255,236,200,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.fillStyle = 'rgba(255,250,236,0.9)';
    for (const [dx, dy] of [[1, 0], [0, 1]]) {
      g.beginPath();
      g.moveTo(32 - dx * 31, 32 - dy * 31); g.lineTo(32 + dy * 2.2, 32 + dx * 2.2); g.lineTo(32 + dx * 31, 32 + dy * 31); g.lineTo(32 - dy * 2.2, 32 - dx * 2.2);
      g.closePath(); g.fill();
    }
    return c;
  }
  // 虹：一圈绿宝石的光，内缘微青、外缘微金（全圆，围着宝座）
  function makeRing() {
    const S0 = 256, c = cnv(S0, S0), g = c.getContext('2d'), C0 = S0 / 2, R = 100;
    g.globalCompositeOperation = 'lighter';
    const band = (blur, lw, col, dr, al) => {
      try { g.filter = blur ? 'blur(' + blur + 'px)' : 'none'; } catch (e) { /* 无滤镜也可 */ }
      g.strokeStyle = rgba(col, al); g.lineWidth = lw;
      g.beginPath(); g.arc(C0, C0, R + dr, 0, TAU); g.stroke();
    };
    band(9, 16, [40, 200, 120], 0, 0.35);
    band(4, 7, [70, 230, 150], 0, 0.55);
    band(3, 3, [120, 200, 255], -6, 0.3);
    band(3, 3, [255, 226, 120], 6, 0.28);
    band(0, 1.6, [200, 255, 220], 0, 0.7);
    try { g.filter = 'none'; } catch (e) { /* */ }
    return c;
  }
  // 千千万万的天使里的一位：一点光、头、长衣、一双翅膀（三帧：翅膀高低）
  function makeAngel(fr) {
    const c = cnv(64, 64), g = c.getContext('2d'), x = 32, y = 34, s = 4, fl = (fr - 1) * 0.55 * s;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,226,160,0.5)'); gr.addColorStop(0.35, 'rgba(255,226,160,0.16)'); gr.addColorStop(1, 'rgba(255,226,160,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    g.fillStyle = 'rgba(255,238,196,0.95)';
    g.beginPath();
    for (const sd of [-1, 1]) {
      g.moveTo(x + sd * 0.4 * s, y - 1.1 * s);
      g.quadraticCurveTo(x + sd * 3.2 * s, y - 3.4 * s - fl, x + sd * 4.6 * s, y - 2.6 * s - fl);
      g.quadraticCurveTo(x + sd * 3.2 * s, y - 0.4 * s, x + sd * 0.6 * s, y + 0.8 * s);
      g.closePath();
    }
    g.fill();
    g.fillStyle = 'rgb(255,250,236)';
    g.beginPath();
    g.moveTo(x, y - 1.6 * s); g.lineTo(x + 1.3 * s, y + 3.4 * s); g.lineTo(x - 1.3 * s, y + 3.4 * s); g.closePath();
    g.moveTo(x + 0.95 * s, y - 2.6 * s); g.arc(x, y - 2.6 * s, 0.95 * s, 0, TAU);
    g.fill();
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      gold: radial([255, 226, 160], 1), white: radial([248, 250, 255], 1), warm: radial([255, 176, 96], 1), amber: radial([255, 200, 110], 1),
      red: radial([255, 92, 70], 1), jasper: radial([214, 255, 232], 1), emerald: radial([70, 230, 150], 1), pale: radial([230, 236, 255], 1),
      flame: radial([255, 170, 70], 1, 0.45), ember: radial([255, 120, 50], 1), cyan: radial([190, 236, 255], 1), soft: radial([255, 244, 222], 0.7, 0.5),
    };
    SP.star = makeStar();
    SP.ring = makeRing();
    SP.angel = [0, 1, 2].map(makeAngel);
    return SP;
  }

  // ════════════════════════════════════════════════════════════
  //  拔摩：磐石与洞口、岸边的石头、约翰的小灯
  // ════════════════════════════════════════════════════════════
  const ROCK = [[-0.25, -0.05], [0.08, 0.5], [0.34, 1.12], [0.66, 1.72], [1.02, 2.22], [1.45, 2.62], [1.95, 2.88], [2.55, 2.8], [3.2, 3.08], [4.0, 2.86], [5.2, 2.55], [7.0, 2.3], [9.0, 2.1]];
  function rockPts() {
    const R = PH(2), x0 = X('rock') * W.w;
    return ROCK.map(([dx, dy]) => { const x = x0 + dx * R; return [x, gY(2, clamp(x / W.w, 0, 1)) - dy * R]; });
  }
  function drawRock(ctx) {
    const R = PH(2), pts = rockPts();
    const col = [128, 116, 104];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], gY(2, clamp(pts[i][0] / W.w, 0, 1)) + R * 0.12);
    ctx.closePath();
    ctx.fillStyle = css(col, 2, 1);
    ctx.fill();
    ctx.clip();
    // 石面：几道斜的暗面与亮面
    for (let i = 0; i < 7; i++) {
      const a = pts[1 + i], b = pts[2 + i] || pts[pts.length - 1];
      ctx.fillStyle = i % 2 ? css([98, 88, 80], 2, 0.55) : css([150, 138, 124], 2, 0.35);
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.lineTo(b[0] + R * (0.3 + 0.2 * hsh(i)), b[1] + R * (1.1 + 0.6 * hsh(i + 3)));
      ctx.lineTo(a[0] + R * 0.2, a[1] + R * (1.4 + 0.5 * hsh(i + 7)));
      ctx.closePath(); ctx.fill();
    }
    // 洞口
    const cx = X('rock') * W.w + 1.3 * R, g = gY(2, clamp(cx / W.w, 0, 1));
    ctx.fillStyle = css([20, 16, 16], 2, 0.92);
    ctx.beginPath();
    ctx.moveTo(cx - 0.42 * R, g + 0.1 * R);
    ctx.quadraticCurveTo(cx - 0.46 * R, g - 0.95 * R, cx - 0.02 * R, g - 1.02 * R);
    ctx.quadraticCurveTo(cx + 0.44 * R, g - 0.92 * R, cx + 0.4 * R, g + 0.1 * R);
    ctx.closePath(); ctx.fill();
    ctx.restore();
    // 迎光的边
    ctx.save();
    ctx.strokeStyle = css(lit(col), 2, 0.35 + 0.35 * W.dayFactor, 0.2);
    ctx.lineWidth = Math.max(1, 1.4 * SU());
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
  }
  function drawStones(ctx) {
    const R = PH(2);
    for (const [xf, v, k] of X('stones')) {
      const x = xf * W.w, y = vY(xf, v), s = R * 0.28 * k * (1 + 0.35 * v);
      ctx.fillStyle = css([126, 114, 100], 2, 1);
      ctx.beginPath();
      ctx.moveTo(x - s * 1.3, y + s * 0.15);
      ctx.quadraticCurveTo(x - s * 1.2, y - s * 0.7, x - s * 0.2, y - s * 0.8);
      ctx.quadraticCurveTo(x + s * 1.1, y - s * 0.75, x + s * 1.35, y + s * 0.15);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([176, 162, 144], 2, 0.4 * W.dayFactor + 0.1);
      ctx.lineWidth = Math.max(0.8, s * 0.08);
      ctx.beginPath(); ctx.moveTo(x - s * 1.1, y - s * 0.45); ctx.quadraticCurveTo(x - s * 0.3, y - s * 0.82, x + s * 0.8, y - s * 0.6); ctx.stroke();
    }
  }
  // 约翰祷告时身旁石上的一盏小油灯（夜里才看得出光）
  function oilPt() { const xf = X('oil'), R = PH(2); return [xf * W.w, vY(xf, 0.3) - R * 0.02]; }
  function drawOil(ctx) {
    const [x, y] = oilPt(), R = PH(2);
    ctx.fillStyle = css([150, 104, 70], 2, 1);
    ctx.beginPath(); ctx.ellipse(x, y - R * 0.04, R * 0.08, R * 0.035, 0, 0, TAU); ctx.fill();
    const k = nightK();
    if (k < 0.05) return;
    const fl = 0.85 + 0.15 * Math.sin(CLK * 13) * Math.sin(CLK * 5.1);
    ctx.fillStyle = rgba([255, 226, 150], k * 0.95);
    flamePath(ctx, x + R * 0.05, y - R * 0.06, R * 0.1 * fl, R * 0.03);
    ctx.fill();
  }
  function flamePath(ctx, x, y, h, w) {
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.bezierCurveTo(x + w * 0.9, y - h * 0.45, x + w, y - h * 0.05, x, y);
    ctx.bezierCurveTo(x - w, y - h * 0.05, x - w * 0.9, y - h * 0.45, x, y - h);
    ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  七个金灯台（1:12）
  // ════════════════════════════════════════════════════════════
  function lampGeom(i) {
    const xf = X('lamps')[i], v = X('lampV')[i];
    const h = PH(2) * 0.92 * (1 + 0.35 * v);
    return { x: xf * W.w, y: vY(xf, v), h };
  }
  function lampApp(i) { return clamp(lv('trnLamps') - i, 0, 1); }
  function lampFlamePt(i) {
    const L = lampGeom(i), g = sm(0, 0.7, lampApp(i));
    return [L.x, L.y - L.h * g * 0.93];
  }
  const LAMP_ORDER = [3, 2, 4, 1, 5, 0, 6];   // 远的先画
  function drawLampstands(ctx) {
    if (lv('trnLamps') < 0.01) return;
    const gold = [224, 182, 88];
    const nk = nightK();
    for (const i of LAMP_ORDER) {
      const f = lampApp(i);
      if (f <= 0) continue;
      const { x, y, h } = lampGeom(i);
      const g = sm(0, 0.7, f), a = sm(0, 0.35, f);
      const hh = h * g;
      const ex = 0.12 + 0.3 * nk;
      ctx.fillStyle = css(gold, 2, a, ex);
      // 三足的底座
      ctx.beginPath();
      ctx.moveTo(x - h * 0.17, y + 0.5);
      ctx.quadraticCurveTo(x - h * 0.07, y - h * 0.035, x - h * 0.035, y - h * 0.11);
      ctx.lineTo(x + h * 0.035, y - h * 0.11);
      ctx.quadraticCurveTo(x + h * 0.07, y - h * 0.035, x + h * 0.17, y + 0.5);
      ctx.closePath(); ctx.fill();
      // 灯干与两节
      ctx.fillRect(x - h * 0.021, y - hh * 0.88, h * 0.042, hh * 0.8);
      for (const k of [0.36, 0.62]) { ctx.beginPath(); ctx.ellipse(x, y - hh * k, h * 0.047, h * 0.024, 0, 0, TAU); ctx.fill(); }
      // 灯盏
      ctx.beginPath(); ctx.ellipse(x, y - hh * 0.88, h * 0.105, h * 0.05, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
      ctx.fillRect(x - h * 0.11, y - hh * 0.895, h * 0.22, h * 0.02);
      // 迎光的一边
      const sunL = W.core.x < x ? -1 : 1;
      ctx.strokeStyle = css(lit(gold), 2, a * (0.5 + 0.4 * W.dayFactor), 0.3 + 0.3 * nk);
      ctx.lineWidth = Math.max(0.7, h * 0.012);
      ctx.beginPath();
      ctx.moveTo(x + sunL * h * 0.02, y - hh * 0.1); ctx.lineTo(x + sunL * h * 0.02, y - hh * 0.86);
      ctx.moveTo(x - h * 0.1, y - hh * 0.9); ctx.lineTo(x + h * 0.1, y - hh * 0.9);
      ctx.stroke();
      // 火焰
      if (f > 0.75) {
        const fa = sm(0.75, 1, f);
        const fl = 1 + 0.12 * Math.sin(CLK * 11 + i * 1.7) * Math.sin(CLK * 5.3 + i);
        ctx.fillStyle = rgba([255, 232, 160], fa);
        flamePath(ctx, x, y - hh * 0.9, h * 0.16 * fl, h * 0.045);
        ctx.fill();
        ctx.fillStyle = rgba([255, 255, 240], fa);
        flamePath(ctx, x, y - hh * 0.9, h * 0.08 * fl, h * 0.02);
        ctx.fill();
      }
    }
  }
  function drawLampGlow(ctx) {
    if (lv('trnLamps') < 0.01) return;
    SP || sprites();
    const nk = nightK();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const f = lampApp(i);
      if (f < 0.75) continue;
      const fa = sm(0.75, 1, f), [x, y] = lampFlamePt(i), h = lampGeom(i).h;
      const fl = 0.9 + 0.1 * Math.sin(CLK * 9 + i * 2.3);
      let r = h * (0.55 + 0.6 * nk) * fl;
      ctx.globalAlpha = fa * (0.34 + 0.35 * nk + 0.15 * lv('trnVeil')); ctx.drawImage(SP.flame, x - r, y - r * 1.05, 2 * r, 2 * r);
      r = h * 0.16;
      ctx.globalAlpha = fa * 0.8; ctx.drawImage(SP.gold, x - r, y - r * 1.4, 2 * r, 2 * r);
      // 夜里，灯下的地上一圈暖光
      if (nk > 0.05) { const L = lampGeom(i); r = h * 1.3; ctx.globalAlpha = fa * nk * 0.18; ctx.drawImage(SP.warm, x - r, L.y - r * 0.32, 2 * r, r * 0.64); }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  亚细亚的七个教会（远岸上七点灯火，1:11）
  // ════════════════════════════════════════════════════════════
  function churchPt(i) { const xf = X('churches')[i]; return [xf * W.w, gY(0, xf) - 1.5 * SU()]; }
  function churchLit(i) { return clamp(lv('trnChurch') - i, 0, 1); }
  // 第 i 颗星的行程：0 在手中 → 1 到了教会
  function starT(i) { return clamp((lv('trnSent') - i * 0.085) / 0.4, 0, 1); }
  function drawChurches(ctx) {
    if (lv('trnChurch') < 0.01) return;
    SP || sprites();
    const nk = nightK(), u = SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const a = sm(0, 1, churchLit(i));
      if (a <= 0) continue;
      const [x, y] = churchPt(i);
      const recv = sm(0.95, 1, starT(i)) * lv('trnStars');
      const tw = 0.85 + 0.15 * Math.sin(CLK * 2.1 + i * 1.3);
      let r = (12 + 10 * nk + 10 * recv) * u * tw;
      ctx.globalAlpha = a * (0.45 + 0.35 * nk + 0.2 * recv); ctx.drawImage(SP.warm, x - r, y - r * 0.8, 2 * r, 1.6 * r);
      r = (3.2 + 1.8 * recv) * u;
      ctx.globalAlpha = a * 0.95; ctx.drawImage(SP.gold, x - r, y - r - 1, 2 * r, 2 * r);
      // 小小的屋顶：几点更亮的灯
      ctx.fillStyle = rgba([255, 240, 200], a * (0.6 + 0.4 * nk));
      for (let k = -1; k <= 1; k++) ctx.fillRect(x + k * 3 * u - 0.6, y - (1.5 + (k === 0 ? 1.4 : 0)) * u, 1.3, 1.3);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  1:8 光弧：自东方的海平线划过全天，直到西方
  // ════════════════════════════════════════════════════════════
  function arcPt(t) {
    const hy = W.horizonY, port = tall();
    const cx = W.w * 0.5, rx = W.w * 0.47, ry = hy - W.h * (port ? 0.3 : 0.11);
    const ang = Math.PI * (1 - t);
    return [cx + rx * Math.cos(ang), hy - 2 - ry * Math.sin(ang)];
  }
  function drawArc(ctx) {
    const A = lv('trnArcA'), p = lv('trnArc');
    if (A < 0.01 || p < 0.001) return;
    SP || sprites();
    const u = SU(), N = 90, n = Math.max(1, Math.round(N * p));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const path = () => { ctx.beginPath(); for (let i = 0; i <= n; i++) { const q = arcPt((i / N) * (p / (n / N))); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); } };
    const pulse = 0.85 + 0.15 * Math.sin(CLK * 1.4);
    path();
    ctx.strokeStyle = 'rgb(255,214,150)'; ctx.globalAlpha = A * 0.07 * pulse; ctx.lineWidth = 16 * u; ctx.stroke();
    ctx.strokeStyle = 'rgb(255,232,190)'; ctx.globalAlpha = A * 0.2 * pulse; ctx.lineWidth = 5 * u; ctx.stroke();
    ctx.strokeStyle = 'rgb(255,250,236)'; ctx.globalAlpha = A * 0.75; ctx.lineWidth = 1.3 * u; ctx.stroke();
    // 起头与末了：两端的光
    const a0 = arcPt(0);
    let r = 40 * u;
    ctx.globalAlpha = A * 0.45; ctx.drawImage(SP.gold, a0[0] - r, a0[1] - r, 2 * r, 2 * r);
    const hd = arcPt(p);
    r = (p < 1 ? 34 : 40) * u;
    ctx.globalAlpha = A * (p < 1 ? 0.9 : 0.45); ctx.drawImage(SP.gold, hd[0] - r, hd[1] - r, 2 * r, 2 * r);
    if (p < 1) { r = 10 * u; ctx.globalAlpha = A; ctx.drawImage(SP.white, hd[0] - r, hd[1] - r, 2 * r, 2 * r); }
    ctx.restore();
  }
  function nameArc(which) {
    const port = tall(), size = M() * (port ? 0.068 : 0.05);
    const str = which ? '俄梅戛' : '阿拉法';
    const pos = port ? (which ? [0.76, 0.5] : [0.24, 0.5]) : (which ? [0.85, 0.47] : [0.15, 0.47]);
    const src = arcPt(which ? 1 : 0);
    chosenName(str, pos[0] * W.w, pos[1] * W.h, size, [255, 236, 200], () => [src[0] + rand(-24, 24), src[1] + rand(-16, 4)], { hold: 3.4 });
    chime(str);
  }

  // ════════════════════════════════════════════════════════════
  //  约翰：书卷与身上的光；身后如号的声音（1:10）
  // ════════════════════════════════════════════════════════════
  function drawScroll(ctx) {
    const k = lv('trnScroll');
    if (k < 0.02) return;
    const f = fig('john');
    if (!f || !f._vis || f.alpha < 0.05) return;
    if (f.pose !== 'sit' && f.pose !== 'kneel' && f.pose !== 'pray') return;
    const h = f._h, fd = f.fd >= 0 ? 1 : -1;
    const sit = f.pose === 'sit';
    const x = f._x + fd * h * (sit ? 0.3 : 0.3), y = f._y - h * (sit ? 0.2 : 0.3);
    const w = h * 0.36, rr = h * 0.045, a = k * f.alpha * sm(0.7, 1, f.poseT || 1);
    ctx.save();
    ctx.translate(x, y); ctx.rotate(fd * -0.12);
    ctx.fillStyle = css([236, 222, 186], 2, a, 0.1 + 0.25 * nightK());
    ctx.fillRect(-w / 2, -rr * 1.2, w, rr * 2.4);
    ctx.strokeStyle = css([120, 96, 70], 2, a * 0.6);
    ctx.lineWidth = Math.max(0.5, h * 0.008);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const yy = -rr * 0.6 + i * rr * 0.6; ctx.moveTo(-w * 0.34, yy); ctx.lineTo(w * (0.1 + 0.2 * hsh(i + 2)), yy); }
    ctx.stroke();
    ctx.fillStyle = css([196, 170, 126], 2, a);
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * w / 2, 0, rr * 0.8, rr * 1.5, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function voicePt() { const xf = X('son'), R = PH(2); return [xf * W.w, vY(xf, 0.16) - R * 0.6]; }
  function drawVoice(ctx) {
    const k = lv('trnVoice');
    if (k < 0.01) return;
    SP || sprites();
    const [x, y] = voicePt(), R = PH(2);
    const p = 0.85 + 0.15 * Math.sin(CLK * 2.2);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let r = R * 2.1 * p;
    ctx.globalAlpha = k * 0.45; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    r = R * 0.55;
    ctx.globalAlpha = k * 0.8; ctx.drawImage(SP.white, x - r, y - r * 1.3, 2 * r, 2.6 * r);
    ctx.strokeStyle = 'rgb(255,236,196)'; ctx.lineWidth = Math.max(0.8, R * 0.02);
    ctx.globalAlpha = k * 0.18;
    ctx.beginPath();
    for (let i = 0; i < 14; i++) { const an = i / 14 * TAU + CLK * 0.05; ctx.moveTo(x + Math.cos(an) * R * 0.5, y + Math.sin(an) * R * 0.5); ctx.lineTo(x + Math.cos(an) * R * 1.6, y + Math.sin(an) * R * 1.6); }
    ctx.stroke();
    ctx.restore();
  }
  // 约翰身上的光：夜里、在异象之下
  function drawJohnLight(ctx) {
    const f = fig('john');
    if (!f || !f._vis || f.alpha < 0.05) return;
    const vis = Math.max(lv('trnThrone'), lv('trnGate') * 0.8, lv('trnSon') * 0.5) * (1 - 0.4 * lv('trnHush'));
    const k = Math.max(0.45 * nightK(), 0.25) * vis + 0.35 * nightK() * (1 - vis);
    if (k < 0.02) return;
    SP || sprites();
    const h = f._h, p = memberPt(f, f.pose === 'fall' || f.pose === 'worship' ? 0.12 : 0.42);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let r = h * 1.25;
    ctx.globalAlpha = k * 0.5; ctx.drawImage(SP.soft, p[0] - r, p[1] - r * 0.9, 2 * r, 1.8 * r);
    // 自上而下落在他身上的一道淡光
    if (vis > 0.05 && nightK() > 0.2) {
      const V = VG(), top = vp(V, 0, 40);
      const g = ctx.createLinearGradient(0, top[1], 0, p[1]);
      g.addColorStop(0, 'rgba(255,244,220,0)'); g.addColorStop(1, 'rgba(255,244,220,1)');
      ctx.fillStyle = g;
      ctx.globalAlpha = vis * nightK() * 0.045;
      ctx.beginPath();
      ctx.moveTo(top[0] - 6 * V.s, top[1]); ctx.lineTo(top[0] + 6 * V.s, top[1]);
      ctx.lineTo(p[0] + h * 0.7, f._y); ctx.lineTo(p[0] - h * 0.7, f._y);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  人子：如光的人（面貌如同烈日放光——只有光）；右手中的七星
  // ════════════════════════════════════════════════════════════
  function drawSonLight(ctx) {
    const k = lv('trnSon');
    const f = fig('son');
    if (!f || !f._vis || f.alpha < 0.02) return;
    SP || sprites();
    const a = f.alpha * Math.max(k, 0.35);
    const [hx, hy, h] = partOf(f, HEAD);
    const fd = f.fd >= 0 ? 1 : -1;
    const day = W.dayFactor, dk = 1 + 0.8 * day;   // 白昼里光要更盛，才压得过天光
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 全身的光辉
    let r = h * (1.25 + 0.15 * Math.sin(CLK * 1.1)) * (1 + 0.35 * day);
    ctx.globalAlpha = Math.min(1, a * (0.3 + 0.25 * nightK()) * dk); ctx.drawImage(SP.gold, hx - r, hy + h * 0.15 - r, 2 * r, 2 * r);
    r = h * 0.8;
    ctx.globalAlpha = Math.min(1, a * 0.3 * day); ctx.drawImage(SP.white, hx - r, hy + h * 0.3 - r, 2 * r, 2 * r);
    // 面貌如同烈日放光
    const sun = sm(0.3, 1, k);
    r = h * (0.36 + 0.3 * sun) * (1 + 0.3 * day);
    ctx.globalAlpha = a * (0.75 + 0.2 * sun); ctx.drawImage(SP.white, hx - r, hy - r, 2 * r, 2 * r);
    r = h * 0.16;
    ctx.globalAlpha = a; ctx.drawImage(SP.white, hx - r, hy - r, 2 * r, 2 * r);
    // 光芒
    ctx.strokeStyle = 'rgb(255,244,214)';
    ctx.lineWidth = Math.max(0.8, h * 0.018);
    ctx.globalAlpha = a * (0.22 + 0.2 * sun) * (1 - 0.2 * day);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const an = i / 16 * TAU + CLK * 0.06, L0 = h * 0.2, L1 = h * (0.5 + 0.35 * sun) * (1 + 0.3 * day) * (0.75 + 0.25 * hsh(i * 3.1));
      ctx.moveTo(hx + Math.cos(an) * L0, hy + Math.sin(an) * L0); ctx.lineTo(hx + Math.cos(an) * L1, hy + Math.sin(an) * L1);
    }
    ctx.stroke();
    // 脚好像在炉中锻炼光明的铜
    r = h * 0.3;
    const fy = f._y - (f.angel ? h * 0.06 : 0);
    ctx.globalAlpha = a * 0.55; ctx.drawImage(SP.amber, f._x - r, fy - r * 0.6, 2 * r, 1.2 * r);
    ctx.restore();
    // 胸间束着金带
    if (f.pose === 'stand' || f.pose === 'walk' || f.pose === 'raise' || f.pose === 'point' || f.pose === 'gaze') {
      const lift = h * 0.07;
      const by = f._y - h * 0.67 - lift;
      ctx.save();
      ctx.strokeStyle = rgba([255, 214, 110], a * 0.95);
      ctx.lineWidth = Math.max(1, h * 0.035);
      ctx.beginPath(); ctx.moveTo(f._x - fd * h * 0.07, by + h * 0.01); ctx.lineTo(f._x + fd * h * 0.08, by - h * 0.01); ctx.stroke();
      ctx.restore();
    }
  }
  // 异象之时（1:12–20）：四围的世界暗下来，只留灯台与人子一带亮着
  function drawVeil(ctx) {
    const k = lv('trnVeil');
    if (k < 0.01) return;
    const f = fig('son'), R = PH(2);
    let cx = X('son') * W.w, cy = vY(X('son'), 0.1) - R * 0.6;
    if (f && f._vis) { cx = f._x; cy = f._y - f._h * 0.5; }
    const A = k * (0.34 + 0.2 * W.dayFactor);
    const r0 = R * 2.1, r1 = Math.hypot(W.w, W.h) * 0.6;
    const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, Math.max(r0 + 1, r1));
    g.addColorStop(0, 'rgba(6,10,22,0)'); g.addColorStop(0.3, rgba([6, 10, 22], A * 0.55)); g.addColorStop(1, rgba([6, 10, 22], A));
    ctx.save();
    ctx.fillStyle = g; ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
    ctx.restore();
  }
  // 右手中的七星
  function handPt() {
    const f = fig('son');
    if (!f) return null;
    return partOf(f, HAND);
  }
  function drawStars(ctx) {
    const k = lv('trnStars');
    if (k < 0.01) return;
    const f = fig('son');
    SP || sprites();
    const hp = f && f._vis ? handPt() : null;
    const u = SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const t = starT(i);
      let x, y;
      if (t <= 0) {
        if (!hp) continue;
        const an = CLK * 0.8 + i * TAU / 7, rr = hp[2] * 0.2;
        x = hp[0] + Math.cos(an) * rr; y = hp[1] + Math.sin(an) * rr * 0.6;
      } else if (t < 1) {
        const P = starPath(i, t, hp);
        if (!P) continue;
        [x, y] = P;
        // 尾迹
        for (let j = 1; j <= 5; j++) {
          const Q = starPath(i, Math.max(0, t - j * 0.018), hp);
          if (!Q) break;
          const r = (5 - j) * 2.2 * u;
          ctx.globalAlpha = k * 0.22 * (1 - j / 6); ctx.drawImage(SP.gold, Q[0] - r, Q[1] - r, 2 * r, 2 * r);
        }
      } else continue;
      const tw = 0.8 + 0.2 * Math.sin(CLK * 3.3 + i * 1.9);
      // 金色的晕：白昼里也看得见
      let r = 20 * u;
      ctx.globalAlpha = k * (0.5 + 0.3 * W.dayFactor); ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
      r = 11 * u * tw;
      ctx.globalAlpha = k; ctx.drawImage(SP.star, x - r, y - r, 2 * r, 2 * r);
      r = 3.2 * u;
      ctx.globalAlpha = k; ctx.drawImage(SP.white, x - r, y - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 星的路：自手中 → 经过第 i 个灯台的火 → 远处的第 i 个教会
  function starPath(i, t, hp) {
    const L = lampFlamePt(i), Cc = churchPt(i);
    const H0 = hp || [L[0], L[1] - PH(2) * 0.4];
    if (t < 0.22) { const q = easeIO(t / 0.22); return [lerp(H0[0], L[0], q), lerp(H0[1], L[1] - PH(2) * 0.12, q) - Math.sin(Math.PI * q) * PH(2) * 0.25]; }
    const q = easeIO((t - 0.22) / 0.78);
    return bez(threadCurve(i), q);
  }
  function threadCurve(i) {
    const L = lampFlamePt(i), Cc = churchPt(i);
    const A = [L[0], L[1] - PH(2) * 0.12];
    const ctl = [(A[0] + Cc[0]) / 2 + (Cc[0] - A[0]) * 0.1, Math.min(A[1], Cc[1]) - W.h * 0.13];
    return [A, ctl, Cc];
  }
  function bez(Q, t) { const it = 1 - t; return [it * it * Q[0][0] + 2 * it * t * Q[1][0] + t * t * Q[2][0], it * it * Q[0][1] + 2 * it * t * Q[1][1] + t * t * Q[2][1]]; }
  function drawThreads(ctx) {
    const k = lv('trnThreads');
    if (k < 0.01 || lv('trnLamps') < 6.9) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.lineWidth = Math.max(0.8, 1.1 * SU());
    for (let i = 0; i < 7; i++) {
      const recv = sm(0.95, 1, starT(i));
      if (recv <= 0) continue;
      const Q = threadCurve(i);
      const g = 0.75 + 0.25 * Math.sin(CLK * 1.3 + i);
      ctx.strokeStyle = 'rgb(255,226,160)';
      ctx.globalAlpha = k * recv * 0.22 * g;
      ctx.beginPath(); ctx.moveTo(Q[0][0], Q[0][1]); ctx.quadraticCurveTo(Q[1][0], Q[1][1], Q[2][0], Q[2][1]); ctx.stroke();
      // 一点光沿线慢慢走（灯台与教会相通）
      const ph = U.fract(CLK * 0.12 + i * 0.137);
      const p = bez(Q, ph);
      const r = 4 * SU();
      ctx.globalAlpha = k * recv * 0.5 * Math.sin(Math.PI * ph);
      ctx.drawImage(SP.gold, p[0] - r, p[1] - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  磐石下的一户人家：门外叩门（3:20）
  // ════════════════════════════════════════════════════════════
  function houseGeom() {
    const xc = X('house') * W.w, w = X('houseW') * W.w, R = PH(2);
    const g = Math.max(gY(2, X('house') - X('houseW') * 0.4), gY(2, X('house') + X('houseW') * 0.4)) + R * 0.04;
    const h = Math.min(w * 0.92, R * (tall() ? 2 : 1.75));
    const dx0 = xc - w * 0.4, dx1 = xc - w * 0.04, dTop = g - h * 0.72;
    return { xc, w, h, g, x0: xc - w / 2, x1: xc + w / 2, top: g - h, R, dx0, dx1, dTop, dc: (dx0 + dx1) / 2 };
  }
  // 门里：屋中的灯光下，一张矮桌、一盏小灯；两人对坐——左边是如光的人子，右边是开门的人（一同坐席，3:20）
  function drawInside(ctx, H) {
    const t = lv('trnTable') * clamp(lv('trnDoorO'), 0, 1);
    if (t < 0.01) return;
    const { dx0, dx1, dTop, g } = H, dw = dx1 - dx0, dh = g - dTop, cx = (dx0 + dx1) / 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(dx0, dTop, dw, dh); ctx.clip();
    ctx.globalAlpha = t;
    // 桌
    const ty = g - dh * 0.26;
    ctx.fillStyle = 'rgb(92,58,34)';
    ctx.fillRect(cx - dw * 0.17, ty, dw * 0.34, dh * 0.035);
    ctx.fillRect(cx - dw * 0.13, ty, dw * 0.03, dh * 0.26);
    ctx.fillRect(cx + dw * 0.1, ty, dw * 0.03, dh * 0.26);
    // 桌上的饼与杯
    ctx.fillStyle = 'rgb(150,100,56)';
    ctx.beginPath(); ctx.ellipse(cx - dw * 0.07, ty - dh * 0.012, dw * 0.055, dh * 0.014, 0, 0, TAU); ctx.fill();
    ctx.fillRect(cx + dw * 0.05, ty - dh * 0.05, dw * 0.04, dh * 0.05);
    // 开门的人：坐着的剪影（右边，面向左）
    const sx = cx + dw * 0.29, hh = dh * 0.5;
    ctx.fillStyle = 'rgb(58,36,24)';
    ctx.beginPath();
    ctx.moveTo(sx + hh * 0.16, g); ctx.lineTo(sx + hh * 0.2, g - hh * 0.5);
    ctx.quadraticCurveTo(sx + hh * 0.16, g - hh * 0.84, sx, g - hh * 0.84);
    ctx.quadraticCurveTo(sx - hh * 0.16, g - hh * 0.8, sx - hh * 0.18, g - hh * 0.5);
    ctx.lineTo(sx - hh * 0.3, g - hh * 0.46); ctx.lineTo(sx - hh * 0.3, g - hh * 0.36); ctx.lineTo(sx - hh * 0.1, g - hh * 0.36);
    ctx.lineTo(sx - hh * 0.06, g); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(sx - hh * 0.02, g - hh * 0.96, hh * 0.12, 0, TAU); ctx.fill();
    // 人子：坐着的光（左边，面向右）
    const px = cx - dw * 0.29;
    ctx.fillStyle = 'rgb(255,250,236)';
    ctx.beginPath();
    ctx.moveTo(px - hh * 0.16, g); ctx.lineTo(px - hh * 0.2, g - hh * 0.5);
    ctx.quadraticCurveTo(px - hh * 0.16, g - hh * 0.84, px, g - hh * 0.84);
    ctx.quadraticCurveTo(px + hh * 0.16, g - hh * 0.8, px + hh * 0.18, g - hh * 0.5);
    ctx.lineTo(px + hh * 0.3, g - hh * 0.46); ctx.lineTo(px + hh * 0.3, g - hh * 0.36); ctx.lineTo(px + hh * 0.1, g - hh * 0.36);
    ctx.lineTo(px + hh * 0.06, g); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(px + hh * 0.02, g - hh * 0.96, hh * 0.12, 0, TAU); ctx.fill();
    // 桌上的小灯
    const fl = 1 + 0.12 * Math.sin(CLK * 12) * Math.sin(CLK * 4.7);
    ctx.fillStyle = 'rgb(255,240,190)';
    flamePath(ctx, cx - dw * 0.005, ty - dh * 0.01, dh * 0.09 * fl, dw * 0.025); ctx.fill();
    ctx.restore();
  }
  function drawHouse(ctx) {
    const a = lv('trnHouse');
    if (a < 0.01) return;
    const H = houseGeom(), { x0, x1, top, g, w, h } = H;
    const wall = [176, 156, 126];
    ctx.save();
    ctx.globalAlpha = a;
    // 侧面（进深）
    const dep = w * 0.2;
    ctx.fillStyle = css(mix(wall, [60, 50, 44], 0.35), 2, 1);
    ctx.beginPath(); ctx.moveTo(x1, g); ctx.lineTo(x1 + dep, g - dep * 0.35); ctx.lineTo(x1 + dep, top - dep * 0.35); ctx.lineTo(x1, top); ctx.closePath(); ctx.fill();
    // 正面
    ctx.fillStyle = css(wall, 2, 1);
    ctx.fillRect(x0, top, w, g - top);
    // 平顶与矮墙
    ctx.fillStyle = css(lit(wall), 2, 1, 0.05);
    ctx.beginPath(); ctx.moveTo(x0 - w * 0.03, top); ctx.lineTo(x1 + w * 0.03, top); ctx.lineTo(x1 + dep + w * 0.02, top - dep * 0.35); ctx.lineTo(x0 + dep - w * 0.02, top - dep * 0.35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mix(wall, [70, 60, 50], 0.2), 2, 1);
    ctx.fillRect(x0 - w * 0.03, top - h * 0.06, w * 1.06, h * 0.07);
    // 石缝
    ctx.strokeStyle = css([120, 104, 86], 2, 0.45);
    ctx.lineWidth = Math.max(0.5, h * 0.01);
    ctx.beginPath();
    for (let r = 1; r < 5; r++) { const yy = top + (g - top) * r / 5; ctx.moveTo(x0, yy); ctx.lineTo(H.dx0, yy); ctx.moveTo(H.dx1, yy); ctx.lineTo(x1, yy); }
    ctx.stroke();
    // 门：开时门扇向里转，露出屋里的灯光与坐席的两人
    const { dx0, dx1, dTop } = H, dw = dx1 - dx0, o = clamp(lv('trnDoorO'), 0, 1), li = lv('trnLampIn');
    const warm = mix([28, 20, 16], [255, 196, 118], li * (0.6 + 0.4 * nightK()));
    ctx.fillStyle = css([36, 28, 22], 2, 1);
    ctx.fillRect(dx0, dTop, dw, g - dTop);
    if (o > 0.01) {
      ctx.fillStyle = rgba(warm, o);
      ctx.fillRect(dx0, dTop, dw, g - dTop);
      ctx.globalAlpha = 1;
      drawInside(ctx, H);
      ctx.globalAlpha = a;
    }
    const pw = dw * (1 - 0.88 * o);
    ctx.fillStyle = css([98, 68, 46], 2, 1);
    ctx.beginPath(); ctx.moveTo(dx0, dTop); ctx.lineTo(dx0 + pw, dTop + o * h * 0.03); ctx.lineTo(dx0 + pw, g - o * h * 0.01); ctx.lineTo(dx0, g); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([60, 42, 30], 2, 0.8);
    ctx.lineWidth = Math.max(0.6, h * 0.012);
    ctx.beginPath(); ctx.moveTo(dx0 + pw * 0.5, dTop + h * 0.03); ctx.lineTo(dx0 + pw * 0.5, g - h * 0.02); ctx.stroke();
    ctx.strokeStyle = css([88, 72, 58], 2, 1);
    ctx.lineWidth = Math.max(0.8, h * 0.03);
    ctx.strokeRect(dx0, dTop, dw, g - dTop);
    // 窗
    const wx0 = x0 + w * 0.66, wx1 = x0 + w * 0.88, wy0 = top + h * 0.26, wy1 = top + h * 0.48;
    ctx.fillStyle = css([30, 24, 20], 2, 1);
    ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
    if (li > 0.01) { ctx.fillStyle = rgba([255, 200, 120], li * (0.3 + 0.7 * nightK())); ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0); }
    ctx.strokeStyle = css([88, 72, 58], 2, 1);
    ctx.lineWidth = Math.max(0.6, h * 0.02);
    ctx.beginPath(); ctx.moveTo((wx0 + wx1) / 2, wy0); ctx.lineTo((wx0 + wx1) / 2, wy1); ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css(lit(wall), 2, 0.3 + 0.4 * W.dayFactor, 0.2);
    ctx.lineWidth = Math.max(0.8, h * 0.02);
    ctx.beginPath(); ctx.moveTo(x0 - w * 0.03, top - h * 0.06); ctx.lineTo(x1 + w * 0.03, top - h * 0.06); ctx.stroke();
    ctx.restore();
  }
  function drawHouseGlow(ctx) {
    const a = lv('trnHouse'), li = lv('trnLampIn');
    if (a < 0.01 || li < 0.01) return;
    SP || sprites();
    const H = houseGeom(), nk = nightK(), o = clamp(lv('trnDoorO'), 0, 1);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 窗里的灯
    let r = H.h * 0.45;
    const wx = H.x0 + H.w * 0.77, wy = H.top + H.h * 0.37;
    ctx.globalAlpha = a * li * (0.15 + 0.5 * nk); ctx.drawImage(SP.warm, wx - r, wy - r, 2 * r, 2 * r);
    // 门开了：灯光流到门外的地上
    if (o > 0.01) {
      const dx = H.dc;
      r = H.R * 1.6;
      ctx.globalAlpha = a * li * o * (0.3 + 0.55 * nk); ctx.drawImage(SP.warm, dx - r, H.g - r * 0.5, 2 * r, r * 0.8);
      r = H.R * 0.55;
      ctx.globalAlpha = a * li * o * (0.3 + 0.35 * nk); ctx.drawImage(SP.amber, dx - r * 0.6, H.dTop + (H.g - H.dTop) * 0.45 - r, 1.2 * r, 2 * r);
      // 屋里坐席的人子：一团光
      const t = lv('trnTable') * o;
      if (t > 0.01) {
        const dw = H.dx1 - H.dx0, dh = H.g - H.dTop, px = dx - dw * 0.29, py = H.g - dh * 0.3;
        r = dh * 0.5;
        ctx.globalAlpha = t * (0.55 + 0.25 * nk); ctx.drawImage(SP.gold, px - r, py - r, 2 * r, 2 * r);
        r = dh * 0.16;
        ctx.globalAlpha = t * 0.85; ctx.drawImage(SP.white, px + dh * 0.01 - r, H.g - dh * 0.48 - r, 2 * r, 2 * r);
      }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  天上：门、宝座、虹、长老、火灯、玻璃海、四活物、书卷、羔羊、千千万万的天使（4 — 5）
  // ════════════════════════════════════════════════════════════
  function VG() {
    const port = tall();
    const s = port ? Math.min(W.w * 0.94 / 700, W.h * 0.3 / 255) : Math.min(W.w * 0.49 / 700, W.h * 0.36 / 255);
    // 横屏：宝座的中心与下一幕（羔羊）的宝座同在画面宽的 0.70 处，好叫幕布前后是同一个天上
    const x = W.w * (port ? 0.5 : 0.7);
    const y = port ? W.h * 0.405 : Math.max(W.h * 0.27, 64 + 150 * s);
    return { x, y, s, port };
  }
  const vp = (V, lx, ly) => [V.x + lx * V.s, V.y + ly * V.s];
  const visAny = () => lv('trnGate') + lv('trnThrone') + lv('trnHost') > 0.01;

  // 二十四位长老：左右各十二，环绕宝座（后面的小些）
  const ELD = (function () {
    const a = [];
    for (let side = -1; side <= 1; side += 2) for (let i = 0; i < 12; i++) {
      const th = lerp(-58, 50, i / 11) * Math.PI / 180;
      a.push({ side, i, lx: side * 330 * Math.cos(th), ly: -20 + 128 * Math.sin(th), pk: 0.82 + 0.3 * (Math.sin(th) + 1) / 2, f: -side, ord: i * 2 + (side > 0 ? 1 : 0), seed: hsh(i * 7 + side * 3) });
    }
    return a.sort((p, q) => p.ly - q.ly);
  })();
  const BEASTS = [
    { kind: 'lion', lx: -150, ly: -50, col: [255, 208, 130], ph: 0.3 },
    { kind: 'calf', lx: 150, ly: -50, col: [255, 190, 150], ph: 1.7 },
    { kind: 'man', lx: -120, ly: 36, col: [250, 244, 232], ph: 2.9 },
    { kind: 'eagle', lx: 120, ly: 36, col: [220, 230, 255], ph: 4.1 },
  ];
  // 羔羊站在宝座前的玻璃海上（七盏火灯之前），自己有一块地方；书卷拿到它脚前
  const LAMB_AT = [0, 92];
  const lambK = () => (tall() ? 2.6 : 2.2);
  const BOOK_A = [-52, -44], BOOK_B = [-52, 80];
  // 羔羊的七角七眼：头上的七点光（第 i 个的位置，异象坐标）
  function lambEye(i) {
    const K = lambK(), an = -Math.PI * (0.2 + 0.6 * i / 6);
    return [LAMB_AT[0] - 12 * K + Math.cos(an) * 9 * K, LAMB_AT[1] - 17 * K + Math.sin(an) * 9 * K];
  }
  // 第 i 盏火灯飞向羔羊的行程（0 → 1）
  const sevenT = i => clamp((lv('trnSeven') - i * 0.07) / 0.58, 0, 1);
  const HOST = (function () { const r = U.mulberry32(5131), a = []; for (let i = 0; i < 440; i++) a.push({ u: r(), v: r(), ph: r() * TAU, sz: 0.7 + 0.6 * r() }); return a; })();
  const GLINT = (function () { const r = U.mulberry32(907), a = []; for (let i = 0; i < 18; i++) a.push({ a: r() * TAU, d: 0.2 + 0.75 * Math.sqrt(r()), ph: r() * TAU, sp: 0.5 + r() }); return a; })();

  function drawHeaven(ctx) {
    if (!visAny()) return;
    SP || sprites();
    const V = VG();
    const hush = 1 - 0.55 * lv('trnHush');
    ctx.save();
    drawHost(ctx, V, hush);
    drawGlass(ctx, V, hush);
    drawGlory(ctx, V, hush);
    drawGate(ctx, V);
    for (const e of ELD) if (e.ly < -30) drawElder(ctx, V, e, hush);
    for (let i = 0; i < 2; i++) drawBeast(ctx, V, i, hush);
    drawSeat(ctx, V, hush);
    drawFire7(ctx, V, hush);
    drawCrowns(ctx, V, hush);
    drawLamb(ctx, V, hush);
    drawBook(ctx, V, hush);
    for (let i = 2; i < 4; i++) drawBeast(ctx, V, i, hush);
    for (const e of ELD) if (e.ly >= -30) drawElder(ctx, V, e, hush);
    drawZaps(ctx, V, hush);
    ctx.restore();
  }

  // 天上的门（4:1）：一扇拱门，两扇门向外开，门里是白光
  function drawGate(ctx, V) {
    const g = lv('trnGate') * (1 - sm(0.15, 0.85, lv('trnThrone')));
    if (g < 0.01) return;
    const o = clamp(lv('trnGateO'), 0, 1), s = V.s;
    const [cx, cy] = vp(V, 0, -48);
    const w = 58 * s, h = 110 * s, top = cy - h / 2, bot = cy + h / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let r = 150 * s;
    ctx.globalAlpha = g * (0.25 + 0.35 * o); ctx.drawImage(SP.gold, cx - r, cy - r, 2 * r, 2 * r);
    // 门里的光
    const arch = () => {
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, bot); ctx.lineTo(cx - w / 2, top + w / 2);
      ctx.arc(cx, top + w / 2, w / 2, Math.PI, 0);
      ctx.lineTo(cx + w / 2, bot); ctx.closePath();
    };
    if (o > 0.01) {
      ctx.globalAlpha = g * o;
      ctx.fillStyle = 'rgba(255,250,236,0.95)';
      arch(); ctx.fill();
      r = 60 * s;
      ctx.drawImage(SP.white, cx - r, cy - r * 1.2, 2 * r, 2.4 * r);
      // 光芒自门中射出
      ctx.strokeStyle = 'rgb(255,240,206)'; ctx.lineWidth = Math.max(1, 1.4 * s);
      ctx.globalAlpha = g * o * 0.2;
      ctx.beginPath();
      for (let i = 0; i < 22; i++) {
        const an = i / 22 * TAU + CLK * 0.03, L0 = 60 * s, L1 = (110 + 60 * hsh(i * 1.7)) * s;
        ctx.moveTo(cx + Math.cos(an) * L0, cy + Math.sin(an) * L0 * 1.2); ctx.lineTo(cx + Math.cos(an) * L1, cy + Math.sin(an) * L1 * 1.2);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    // 门扇
    for (const sd of [-1, 1]) {
      const hx = cx + sd * w / 2, pw = (w / 2) * (1 - 0.86 * o), grow = o * h * 0.1;
      ctx.globalAlpha = g * (0.95 - 0.35 * o);
      ctx.fillStyle = 'rgba(236,214,160,0.9)';
      ctx.beginPath();
      ctx.moveTo(hx, top + w * 0.35); ctx.lineTo(hx - sd * pw, top + w * 0.35 - grow * 0.5 + (1 - o) * w * 0.1);
      ctx.lineTo(hx - sd * pw, bot + grow * 0.5); ctx.lineTo(hx, bot);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,244,210,0.8)'; ctx.lineWidth = Math.max(0.8, 1.1 * s);
      ctx.stroke();
    }
    // 门框
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = g;
    ctx.strokeStyle = 'rgb(255,226,150)'; ctx.lineWidth = Math.max(1.2, 3 * s);
    arch(); ctx.stroke();
    ctx.restore();
    // 一道淡光自门中垂下，落到地上（「你上到这里来」）
    const f = fig('john');
    if (o > 0.05 && f && f._vis) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const gr = ctx.createLinearGradient(0, bot, 0, f._y);
      gr.addColorStop(0, 'rgba(255,246,222,0.5)'); gr.addColorStop(1, 'rgba(255,246,222,0)');
      ctx.fillStyle = gr; ctx.globalAlpha = g * o * 0.35;
      ctx.beginPath(); ctx.moveTo(cx - w * 0.35, bot); ctx.lineTo(cx + w * 0.35, bot); ctx.lineTo(f._x + f._h * 0.9, f._y); ctx.lineTo(f._x - f._h * 0.9, f._y); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  // 宝座的光：那坐着的好像碧玉和红宝石（只有光，不画形像）；虹围着宝座，好像绿宝石
  function drawGlory(ctx, V, hush) {
    const th = lv('trnThrone') * hush;
    if (th < 0.01) return;
    const s = V.s, pr = lv('trnPraise');
    const [cx, cy] = vp(V, 0, -56);
    const breathe = 1 + 0.04 * Math.sin(CLK * 0.9) + 0.08 * lv('trnHoly') * Math.max(0, Math.sin(CLK * 2.6));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let r = 250 * s * breathe;
    ctx.globalAlpha = th * (0.16 + 0.12 * pr); ctx.drawImage(SP.gold, cx - r, cy - r, 2 * r, 2 * r);
    // 红宝石
    r = 150 * s * breathe;
    ctx.globalAlpha = th * 0.26; ctx.drawImage(SP.red, cx - r, cy - r, 2 * r, 2 * r);
    // 碧玉
    r = 105 * s;
    ctx.globalAlpha = th * 0.3; ctx.drawImage(SP.jasper, cx - r, cy - r, 2 * r, 2 * r);
    // 光芒
    ctx.strokeStyle = 'rgb(255,240,214)'; ctx.lineWidth = Math.max(0.8, 1.1 * s);
    ctx.globalAlpha = th * 0.08 * (1 + pr);
    ctx.beginPath();
    for (let i = 0; i < 28; i++) {
      const an = i / 28 * TAU + CLK * 0.02, L0 = 50 * s, L1 = (150 + 110 * hsh(i * 3.3 + 1)) * s;
      ctx.moveTo(cx + Math.cos(an) * L0, cy + Math.sin(an) * L0); ctx.lineTo(cx + Math.cos(an) * L1, cy + Math.sin(an) * L1);
    }
    ctx.stroke();
    // 虹
    const bw = lv('trnBow') * hush;
    if (bw > 0.01) {
      const R = 98 * s, rs = R * 1.28;
      ctx.globalAlpha = bw * (0.8 + 0.12 * Math.sin(CLK * 0.8));
      ctx.drawImage(SP.ring, cx - rs, cy - rs, 2 * rs, 2 * rs);
      r = 130 * s;
      ctx.globalAlpha = bw * 0.12; ctx.drawImage(SP.emerald, cx - r, cy - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 宝座本身：半透的碧玉（高背、座、台），其上坐着的只是光
  function throneOutline(ctx, V) {
    const q = V.s * 0.9, [tx, ty] = vp(V, 0, 8);
    ctx.beginPath();
    // 两层的台
    ctx.moveTo(tx - 48 * q, ty); ctx.lineTo(tx - 46 * q, ty - 7 * q); ctx.lineTo(tx - 38 * q, ty - 9 * q); ctx.lineTo(tx - 37 * q, ty - 16 * q);
    // 扶手
    ctx.lineTo(tx - 34 * q, ty - 17 * q); ctx.lineTo(tx - 34 * q, ty - 31 * q); ctx.lineTo(tx - 39 * q, ty - 34 * q); ctx.lineTo(tx - 38 * q, ty - 40 * q); ctx.lineTo(tx - 25 * q, ty - 41 * q);
    // 矮的靠背
    ctx.lineTo(tx - 24 * q, ty - 60 * q); ctx.quadraticCurveTo(tx, ty - 74 * q, tx + 24 * q, ty - 60 * q); ctx.lineTo(tx + 25 * q, ty - 41 * q);
    ctx.lineTo(tx + 38 * q, ty - 40 * q); ctx.lineTo(tx + 39 * q, ty - 34 * q); ctx.lineTo(tx + 34 * q, ty - 31 * q); ctx.lineTo(tx + 34 * q, ty - 17 * q);
    ctx.lineTo(tx + 37 * q, ty - 16 * q); ctx.lineTo(tx + 38 * q, ty - 9 * q); ctx.lineTo(tx + 46 * q, ty - 7 * q); ctx.lineTo(tx + 48 * q, ty);
    ctx.closePath();
    return [tx, ty, q];
  }
  function drawSeat(ctx, V, hush) {
    const th = lv('trnThrone') * hush;
    if (th < 0.01) return;
    ctx.save();
    // 坐在宝座上的：只有光——白如碧玉，四围透出红宝石的红（先画光，宝座是半透的水晶，在光前）
    ctx.globalCompositeOperation = 'lighter';
    const fl = th * (0.93 + 0.07 * Math.sin(CLK * 2.1)), pr = lv('trnPraise');
    const [cx, cy] = vp(V, 0, -60);
    let r = 78 * V.s;
    ctx.globalAlpha = fl * 0.6; ctx.drawImage(SP.red, cx - r, cy - r, 2 * r, 2 * r);
    r = 50 * V.s;
    ctx.globalAlpha = fl * 0.42; ctx.drawImage(SP.jasper, cx - r, cy - r, 2 * r, 2 * r);
    r = 40 * V.s;
    ctx.globalAlpha = fl * (0.5 + 0.15 * pr); ctx.drawImage(SP.white, cx - r * 0.8, cy - r * 1.1, 1.6 * r, 2.2 * r);
    ctx.globalCompositeOperation = 'source-over';
    const [tx, ty, q] = throneOutline(ctx, V);
    const g2 = ctx.createLinearGradient(tx - 30 * q, ty - 74 * q, tx + 24 * q, ty);
    g2.addColorStop(0, 'rgba(210,246,228,0.34)'); g2.addColorStop(0.5, 'rgba(150,214,190,0.3)'); g2.addColorStop(1, 'rgba(110,180,160,0.34)');
    ctx.fillStyle = g2; ctx.globalAlpha = th;
    ctx.fill();
    ctx.strokeStyle = 'rgb(226,255,240)'; ctx.lineWidth = Math.max(0.8, 1 * q);
    ctx.globalAlpha = th * 0.6; ctx.stroke();
    // 宝石的棱面
    ctx.save();
    throneOutline(ctx, V); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const fg = ctx.createLinearGradient(tx - 36 * q, ty - 70 * q, tx + 12 * q, ty - 10 * q);
    fg.addColorStop(0, 'rgba(230,255,240,0)'); fg.addColorStop(0.35, 'rgba(230,255,240,0.22)'); fg.addColorStop(0.5, 'rgba(230,255,240,0.02)'); fg.addColorStop(1, 'rgba(230,255,240,0)');
    ctx.fillStyle = fg; ctx.globalAlpha = th;
    ctx.fillRect(tx - 50 * q, ty - 80 * q, 100 * q, 80 * q);
    ctx.restore();
    // 光的心：在座上
    ctx.globalCompositeOperation = 'lighter';
    r = 22 * V.s;
    ctx.globalAlpha = fl * 0.85; ctx.drawImage(SP.white, cx - r, cy - r * 0.9, 2 * r, 2 * r);
    r = 9 * V.s;
    ctx.globalAlpha = fl; ctx.drawImage(SP.white, cx - r, cy - r, 2 * r, 2 * r);
    for (let i = 0; i < 4; i++) {
      const tw = Math.max(0, Math.sin(CLK * 1.6 + i * 1.9));
      r = 8 * V.s;
      ctx.globalAlpha = th * tw * 0.7;
      ctx.drawImage(SP.star, tx + (hsh(i + 120) - 0.5) * 70 * q - r, ty - (8 + 56 * hsh(i + 125)) * q - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 七盏火灯在宝座前点着（4:5）；「七眼，就是神的七灵」（5:6）：七灯的火飞入羔羊，成了它的七眼
  function drawFire7(ctx, V, hush) {
    const k = lv('trnFire7') * hush;
    if (k < 0.01) return;
    const s = V.s;
    ctx.save();
    for (let i = 0; i < 7; i++) {
      const [x, y] = vp(V, -72 + i * 24, 32);
      const a = k * sm(i / 9, i / 9 + 0.3, lv('trnFire7'));
      if (a < 0.01) continue;
      const t = sevenT(i);
      if (t >= 1) continue;
      const stand = a * (1 - sm(0, 0.35, t));
      ctx.globalCompositeOperation = 'source-over';
      if (stand > 0.01) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = rgba([236, 200, 120], stand * 0.9);
        ctx.fillRect(x - 0.8 * s, y - 7 * s, 1.6 * s, 7 * s);
        ctx.beginPath(); ctx.ellipse(x, y - 7 * s, 4 * s, 1.8 * s, 0, 0, Math.PI); ctx.fill();
      }
      // 火：在灯上，或正飞向羔羊
      let fx0 = x, fy0 = y - 7.5 * s, sc = 1;
      if (t > 0) {
        const q = easeIO(t), E = vp(V, ...lambEye(i));
        fx0 = lerp(x, E[0], q); fy0 = lerp(y - 7.5 * s, E[1], q) - Math.sin(Math.PI * q) * 26 * s;
        sc = lerp(1, 0.55, q);
      }
      const fl = 1 + 0.15 * Math.sin(CLK * 10 + i * 1.3) * Math.sin(CLK * 4.1 + i);
      ctx.globalCompositeOperation = 'lighter';
      let r = 16 * s * fl * sc;
      ctx.globalAlpha = a * 0.55; ctx.drawImage(SP.flame, fx0 - r, fy0 - 2.5 * s - r, 2 * r, 2 * r);
      ctx.globalAlpha = 1;
      ctx.fillStyle = rgba([255, 214, 130], a);
      flamePath(ctx, fx0, fy0, 9 * s * fl * sc, 2.6 * s * sc); ctx.fill();
      ctx.fillStyle = rgba([255, 252, 236], a);
      flamePath(ctx, fx0, fy0, 4.5 * s * fl * sc, 1.2 * s * sc); ctx.fill();
    }
    ctx.restore();
  }
  // 玻璃海，如同水晶（4:6）
  function drawGlass(ctx, V, hush) {
    const k = lv('trnGlass') * hush;
    if (k < 0.01) return;
    const s = V.s, spread = 0.25 + 0.75 * sm(0, 0.9, lv('trnGlass'));
    const [x, y] = vp(V, 0, 62), rx = 350 * s * spread, ry = 38 * s * spread;
    ctx.save();
    ctx.save();
    ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, 'rgba(236,248,255,0.42)'); g.addColorStop(0.5, 'rgba(200,232,255,0.22)'); g.addColorStop(0.85, 'rgba(176,216,255,0.07)'); g.addColorStop(1, 'rgba(170,210,255,0)');
    ctx.globalAlpha = k; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(236,250,255,0.5)'; ctx.lineWidth = Math.max(0.6, 1 * s) * rx / ry * 0.35;
    ctx.globalAlpha = k * 0.35;
    ctx.beginPath(); ctx.arc(0, 0, rx * 0.97, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    // 宝座在玻璃海中的倒影
    const th = lv('trnThrone') * hush;
    let r = 36 * s;
    const lambIn = sm(0, 0.6, lv('trnLamb'));   // 羔羊站在玻璃海上时，宝座的倒影让开
    ctx.globalAlpha = k * th * 0.5 * (1 - lambIn); ctx.drawImage(SP.white, x - r * 0.6, y - r * 0.9, 1.2 * r, 2 * r);
    r = 90 * s;
    ctx.globalAlpha = k * th * 0.18 * (1 - 0.6 * lambIn); ctx.drawImage(SP.red, x - r, y - r * 0.35, 2 * r, 0.7 * r);
    // 水晶的闪光
    for (const G of GLINT) {
      const tw = Math.pow(Math.max(0, Math.sin(CLK * G.sp + G.ph)), 3);
      if (tw < 0.05) continue;
      const gx = x + Math.cos(G.a) * rx * G.d, gy = y + Math.sin(G.a) * ry * G.d;
      r = 6 * s * (0.6 + 0.6 * tw);
      ctx.globalAlpha = k * tw * 0.85; ctx.drawImage(SP.star, gx - r, gy - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }

  // 长老：坐在座位上，身穿白衣，头戴金冠冕；俯伏时离座伏在座前
  function elderJ(V, e) {
    const [x, y] = vp(V, e.lx, e.ly), H = 30 * e.pk * V.s, f = e.f;
    const delay = e.seed * 0.25;
    const b = sm(delay, delay + 0.75, lv('trnFall'));
    const harp = lv('trnHarps');
    const P = (sx, sy, px, py) => [x + f * lerp(sx, px, b) * H, y + lerp(sy, py, b) * H];
    const hip = P(-0.12, -0.44, 0.1, -0.26), knee = P(0.14, -0.46, 0.26, -0.02), foot = P(0.17, -0.02, -0.02, -0.02);
    const sh = P(-0.08, -0.8, 0.44, -0.14), head = P(-0.05, -0.96, 0.57, -0.08);
    const hand = P(lerp(0.1, 0.18, harp), lerp(-0.5, -0.66, harp), 0.66, -0.04);
    return { x, y, H, f, b, hip, knee, foot, sh, head, hand };
  }
  function crownT(e) { return clamp(lv('trnCrowns') * 1.6 - (e.ord / 23) * 0.6, 0, 1); }
  function crownPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x - s, y); ctx.lineTo(x - s * 0.9, y - s * 0.95); ctx.lineTo(x - s * 0.4, y - s * 0.35); ctx.lineTo(x, y - s * 1.2);
    ctx.lineTo(x + s * 0.4, y - s * 0.35); ctx.lineTo(x + s * 0.9, y - s * 0.95); ctx.lineTo(x + s, y); ctx.closePath();
  }
  function drawElder(ctx, V, e, hush) {
    const app = clamp(lv('trnElders') - e.ord, 0, 1);
    if (app <= 0) return;
    const a = sm(0, 1, app) * hush * (0.9 + 0.1 * lv('trnPraise'));
    const J = elderJ(V, e), { x, y, H, f } = J;
    const nk = nightK();
    ctx.save();
    // 身后的光
    ctx.globalCompositeOperation = 'lighter';
    let r = H * 1.1;
    ctx.globalAlpha = a * (0.16 + 0.14 * nk); ctx.drawImage(SP.pale, x - r, y - H * 0.5 - r, 2 * r, 2 * r);
    ctx.globalCompositeOperation = 'source-over';
    // 座位（白与金）
    ctx.globalAlpha = a * 0.85;
    ctx.fillStyle = 'rgba(238,218,166,0.8)';
    ctx.fillRect(x - f * 0.3 * H - 0.045 * H, y - H, 0.09 * H, H);
    ctx.fillRect(Math.min(x - f * 0.34 * H, x + f * 0.2 * H), y - 0.42 * H, 0.54 * H, 0.07 * H);
    ctx.fillRect(x + f * 0.16 * H - 0.025 * H, y - 0.42 * H, 0.05 * H, 0.42 * H);
    ctx.beginPath(); ctx.arc(x - f * 0.3 * H, y - H, 0.065 * H, 0, TAU); ctx.fill();
    // 身：白衣
    ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgb(250,248,242)';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const seg = (A, B, w) => { ctx.lineWidth = Math.max(0.8, w * H); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); };
    seg(J.foot, J.knee, 0.13);
    seg(J.knee, J.hip, 0.2);
    seg(J.hip, J.sh, 0.24);
    ctx.strokeStyle = 'rgb(236,232,222)';
    seg(J.sh, J.hand, 0.075);
    ctx.fillStyle = 'rgb(240,232,214)';
    ctx.beginPath(); ctx.arc(J.head[0], J.head[1], 0.1 * H, 0, TAU); ctx.fill();
    // 金冠冕（尚未放在宝座前时）
    if (crownT(e) <= 0) {
      ctx.fillStyle = 'rgb(255,212,104)';
      crownPath(ctx, J.head[0] + f * 0.01 * H, J.head[1] - 0.07 * H, 0.085 * H); ctx.fill();
    }
    // 琴与金炉（5:8）
    const hp = lv('trnHarps');
    if (hp > 0.02) {
      ctx.globalAlpha = a * hp;
      ctx.strokeStyle = 'rgb(255,216,120)'; ctx.lineWidth = Math.max(0.6, 0.035 * H);
      const [hx, hy] = J.hand;
      ctx.beginPath();
      ctx.moveTo(hx, hy + 0.12 * H); ctx.quadraticCurveTo(hx + f * 0.13 * H, hy - 0.02 * H, hx + f * 0.04 * H, hy - 0.16 * H);
      ctx.moveTo(hx, hy + 0.12 * H); ctx.lineTo(hx - f * 0.02 * H, hy - 0.12 * H);
      for (let k = 1; k <= 2; k++) { ctx.moveTo(hx + f * (0.01 + 0.025 * k) * H, hy + (0.08 - 0.02 * k) * H); ctx.lineTo(hx + f * (0.005 + 0.02 * k) * H, hy - (0.1 + 0.015 * k) * H); }
      ctx.stroke();
      // 金炉放在膝前，香烟袅袅上升
      const bx = J.knee[0] + f * 0.1 * H, by = J.b > 0.5 ? J.knee[1] - 0.02 * H : J.knee[1] - 0.06 * H;
      ctx.fillStyle = 'rgb(255,208,110)';
      ctx.beginPath(); ctx.ellipse(bx, by, 0.09 * H, 0.05 * H, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(236,226,255)'; ctx.lineWidth = Math.max(0.6, 0.03 * H);
      ctx.globalAlpha = a * hp * 0.35;
      ctx.beginPath(); ctx.moveTo(bx, by - 0.02 * H);
      for (let k = 1; k <= 6; k++) ctx.lineTo(bx + Math.sin(CLK * 1.3 + k * 0.9 + e.seed * 6) * 0.05 * H, by - (0.02 + k * 0.09) * H);
      ctx.stroke();
    }
    ctx.restore();
  }
  // 冠冕放在宝座前（4:10）：一个一个飞到宝座下，堆成一片金光
  function drawCrowns(ctx, V, hush) {
    if (lv('trnCrowns') < 0.001) return;
    ctx.save();
    for (const e of ELD) {
      const c = crownT(e);
      if (c <= 0) continue;
      const J = elderJ(V, e), q = easeIO(c);
      const A = [J.head[0], J.head[1] - 0.07 * J.H];
      const B = vp(V, e.side * (10 + e.i * 2.8), 14 - (e.i % 3) * 2.2);
      const x = lerp(A[0], B[0], q), y = lerp(A[1], B[1], q) - Math.sin(Math.PI * q) * 40 * V.s;
      const sz = lerp(0.085 * J.H, 3.2 * V.s, q);
      ctx.globalAlpha = hush * sm(0, 0.1, c);
      ctx.fillStyle = 'rgb(255,212,104)';
      crownPath(ctx, x, y, sz); ctx.fill();
      if (c >= 1 && Math.sin(CLK * 1.5 + e.seed * 9) > 0.93) {
        const r = 6 * V.s;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(SP.star, x - r, y - r - sz * 0.5, 2 * r, 2 * r);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
  }

  // 四活物：都是光——各有六个翅膀，遍体内外满了眼睛；像狮子、像牛犊、脸面像人、像飞鹰（不画面目）
  function wingPath(ctx, x, y, ang, len, wid, sg, nF) {
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy * sg, ny = dx * sg;
    const tx = x + dx * len, ty = y + dy * len;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + dx * len * 0.45 - nx * wid * 0.9, y + dy * len * 0.45 - ny * wid * 0.9, tx, ty);
    let px = tx, py = ty;
    for (let i = 1; i <= nF; i++) {
      const t = 1 - i / nF;
      const off = wid * Math.pow(Math.sin(Math.PI * clamp(t * 0.9 + 0.1, 0, 1)), 0.7) * 0.85;
      const qx = x + dx * len * t + nx * off, qy = y + dy * len * t + ny * off;
      const mx = (px + qx) / 2 + nx * wid * 0.25, my = (py + qy) / 2 + ny * wid * 0.25;
      ctx.quadraticCurveTo(mx, my, qx, qy);
      px = qx; py = qy;
    }
    ctx.closePath();
  }
  const WINGS = [[5, -16, -1.25, 40, 12], [7, -8, -0.22, 50, 14], [5, 6, 0.95, 34, 11]];
  function drawBeast(ctx, V, i, hush) {
    const app = clamp(lv('trnBeasts') - i, 0, 1);
    if (app <= 0) return;
    const B = BEASTS[i], s = V.s;
    const holy = lv('trnHoly'), pulse = holy * Math.max(0, Math.sin(CLK * 2.6 + B.ph * 0.3));
    const fall = lv('trnFall') * 0.8;
    const a = sm(0, 1, app) * hush;
    const k = s * (0.65 + 0.35 * sm(0, 1, app));
    const [x0, y0] = vp(V, B.lx, B.ly);
    const toThrone = B.lx < 0 ? 1 : -1;
    ctx.save();
    ctx.translate(x0, y0 + fall * 8 * s);
    ctx.rotate(toThrone * fall * 0.35);
    ctx.globalCompositeOperation = 'lighter';
    let r = 80 * k;
    ctx.globalAlpha = a * (0.22 + 0.25 * pulse); ctx.drawImage(SP.gold, -r, -r, 2 * r, 2 * r);
    // 翅膀：自身而外，由白渐淡为它自己的光色
    ctx.lineJoin = 'round';
    const eyes = [];
    const wg = ctx.createRadialGradient(0, -4 * k, 3 * k, 0, -4 * k, 58 * k);
    wg.addColorStop(0, rgba([255, 252, 240], a * (0.78 + 0.15 * pulse)));
    wg.addColorStop(0.45, rgba(mix(B.col, [255, 255, 255], 0.35), a * (0.66 + 0.2 * pulse)));
    wg.addColorStop(1, rgba(B.col, a * 0.4));
    for (let j = 0; j < 3; j++) {
      const [rx, ry, ang0, len0, wid] = WINGS[j];
      const flap = Math.sin(CLK * 2 + B.ph + j * 0.8) * 0.06 + (j === 0 ? -0.14 * pulse : j === 2 ? 0.05 * pulse : -0.05 * pulse);
      const len = len0 * (1 - 0.25 * fall) * k, w = wid * k;
      for (const sd of [-1, 1]) {
        const ang = sd > 0 ? ang0 + flap : Math.PI - ang0 - flap;
        const wx = sd * rx * k, wy = ry * k;
        ctx.beginPath(); wingPath(ctx, wx, wy, ang, len, w, sd, 5);
        ctx.fillStyle = wg; ctx.fill();
        ctx.strokeStyle = rgba([255, 250, 236], a * 0.6); ctx.lineWidth = Math.max(0.7, 0.9 * s); ctx.stroke();
        const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy * sd, ny = dx * sd;
        for (const t of [0.34, 0.58, 0.8]) eyes.push([wx + dx * len * t + nx * w * 0.32, wy + dy * len * t + ny * w * 0.32]);
      }
    }
    // 身
    ctx.fillStyle = rgba(B.col, a * 0.6);
    ctx.beginPath(); ctx.ellipse(0, 2 * k, 8 * k, 15 * k, 0, 0, TAU); ctx.fill();
    r = 22 * k;
    ctx.globalAlpha = a * 0.55; ctx.drawImage(SP.white, -r * 0.6, -r * 0.8, 1.2 * r, 1.6 * r);
    ctx.globalAlpha = 1;
    // 头：一团光里显出它的样子（没有面目）
    const hy = -21 * k;
    if (B.kind === 'lion') {
      ctx.fillStyle = rgba([255, 190, 100], a * 0.85);
      ctx.beginPath();
      for (let m = 0; m <= 28; m++) { const an = m / 28 * TAU, rr = (m % 2 ? 7.2 : 11.8) * k; const px = Math.cos(an) * rr, py = hy + Math.sin(an) * rr; if (m) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba([255, 232, 170], a);
      ctx.beginPath(); ctx.arc(0, hy + 0.5 * k, 6.4 * k, 0, TAU); ctx.fill();
    } else if (B.kind === 'calf') {
      ctx.strokeStyle = rgba([255, 240, 206], a); ctx.lineWidth = Math.max(1, 2 * k); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-3.5 * k, hy - 5 * k); ctx.quadraticCurveTo(-11 * k, hy - 6 * k, -11 * k, hy - 13 * k);
      ctx.moveTo(3.5 * k, hy - 5 * k); ctx.quadraticCurveTo(11 * k, hy - 6 * k, 11 * k, hy - 13 * k);
      ctx.stroke();
      ctx.fillStyle = rgba([255, 214, 170], a);
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * 7.8 * k, hy - 1.5 * k, 3.4 * k, 1.6 * k, sd * 0.3, 0, TAU); ctx.fill(); }
      ctx.fillStyle = rgba([255, 226, 190], a);
      ctx.beginPath(); ctx.ellipse(0, hy + 1 * k, 5.4 * k, 7.2 * k, 0, 0, TAU); ctx.fill();
    } else if (B.kind === 'man') {
      ctx.fillStyle = rgba([255, 250, 240], a);
      ctx.beginPath(); ctx.arc(0, hy, 6.2 * k, 0, TAU); ctx.fill();
    } else {
      const d = toThrone;
      ctx.fillStyle = rgba([236, 240, 255], a);
      ctx.beginPath(); ctx.arc(0, hy, 5.8 * k, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba([255, 226, 150], a);
      ctx.beginPath();
      ctx.moveTo(d * 4 * k, hy - 2.4 * k); ctx.quadraticCurveTo(d * 10.5 * k, hy - 2 * k, d * 10 * k, hy + 3.2 * k);
      ctx.quadraticCurveTo(d * 8 * k, hy + 1 * k, d * 4.5 * k, hy + 2.2 * k); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba([236, 240, 255], a * 0.8); ctx.lineWidth = Math.max(0.7, 1.2 * k);
      ctx.beginPath();
      for (let m = 0; m < 3; m++) { ctx.moveTo(-d * 4 * k, hy - (2 - m * 2) * k); ctx.lineTo(-d * (9 + m) * k, hy - (4 - m * 2.5) * k); }
      ctx.stroke();
    }
    r = 12 * k;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * (0.55 + 0.3 * pulse); ctx.drawImage(SP.white, -r, hy - r, 2 * r, 2 * r);
    // 眼睛
    for (const [ex, ey] of [[0, -6 * k], [-3.5 * k, 4 * k], [3.5 * k, 4 * k], [0, 12 * k]]) eyes.push([ex, ey]);
    ctx.fillStyle = 'rgb(255,255,255)';
    for (let m = 0; m < eyes.length; m++) {
      const bl = 0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(CLK * 1.4 + m * 2.17 + B.ph), 2);
      ctx.globalAlpha = a * bl * 0.9;
      ctx.beginPath(); ctx.ellipse(eyes[m][0], eyes[m][1], Math.max(0.8, 1.6 * k), Math.max(0.5, 0.9 * k), 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // 书卷：里外都写着字，用七印封严了（5:1）；羔羊拿了书卷（5:7）
  function bookPos(V) {
    const t = easeIO(clamp(lv('trnTake'), 0, 1));
    return vp(V, lerp(BOOK_A[0], BOOK_B[0], t), lerp(BOOK_A[1], BOOK_B[1], t) - Math.sin(Math.PI * t) * 24);
  }
  function drawBook(ctx, V, hush) {
    const k = lv('trnBook') * hush;
    if (k < 0.01) return;
    const t = easeIO(clamp(lv('trnTake'), 0, 1));
    const s = V.s * lerp(1.55, 0.78 * lambK(), t), [x, y] = bookPos(V);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    let r = 30 * s;
    ctx.globalAlpha = k * 0.4; ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    ctx.globalCompositeOperation = 'source-over';
    const w = 28 * s, hh = 7 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgb(244,230,196)';
    ctx.fillRect(x - w / 2, y - hh / 2, w, hh);
    ctx.fillStyle = 'rgb(220,196,150)';
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sd * w / 2, y, 2.4 * s, hh * 0.62, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = 'rgba(120,96,70,0.7)'; ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 0; i < 2; i++) { ctx.moveTo(x - w * 0.4, y - hh * 0.15 + i * hh * 0.3); ctx.lineTo(x + w * 0.4, y - hh * 0.15 + i * hh * 0.3); }
    ctx.stroke();
    // 七印
    for (let i = 0; i < 7; i++) {
      const sx = x - w * 0.42 + i * w * 0.14, sy = y + hh * 0.5;
      ctx.fillStyle = 'rgb(200,52,44)';
      ctx.beginPath(); ctx.arc(sx, sy, 1.9 * s, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,190,150,0.8)';
      ctx.beginPath(); ctx.arc(sx - 0.5 * s, sy - 0.5 * s, 0.7 * s, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // 羔羊：一只小小的光的羔羊，有七角七眼——七点光在它头上（七灯的火飞来，成了它的七眼）
  function drawLamb(ctx, V, hush) {
    const k = lv('trnLamb') * hush;
    if (k < 0.01) return;
    const s = V.s * lambK(), [x, y] = vp(V, LAMB_AT[0], LAMB_AT[1]), d = -1;
    ctx.save();
    // 身后一圈稍暗的晕：好叫白色的羔羊在明亮的玻璃海上显出来
    const dg = ctx.createRadialGradient(x, y - 11 * s, 0, x, y - 11 * s, 26 * s);
    dg.addColorStop(0, 'rgba(10,16,34,0.5)'); dg.addColorStop(0.6, 'rgba(10,16,34,0.3)'); dg.addColorStop(1, 'rgba(10,16,34,0)');
    ctx.globalAlpha = k * (1 - 0.75 * W.dayFactor); ctx.fillStyle = dg;
    ctx.beginPath(); ctx.ellipse(x, y - 11 * s, 26 * s, 21 * s, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    let r = 34 * s * (1 + 0.1 * lv('trnPraise'));
    ctx.globalAlpha = k * 0.28; ctx.drawImage(SP.gold, x - r, y - 12 * s - r, 2 * r, 2 * r);
    r = 15 * s;
    ctx.globalAlpha = k * 0.22; ctx.drawImage(SP.amber, x - r, y - 12 * s - r * 0.8, 2 * r, 1.6 * r);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    // 腿
    ctx.strokeStyle = 'rgb(255,244,226)'; ctx.lineWidth = Math.max(0.9, 1.6 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const lx of [-6.5, -3, 4, 7]) { ctx.moveTo(x + lx * s, y - 8 * s); ctx.lineTo(x + (lx + 0.3) * s, y); }
    ctx.stroke();
    // 羊毛：几团相叠的圆
    ctx.fillStyle = 'rgb(255,252,244)';
    for (let i = 0; i < 7; i++) {
      const an = i / 7 * TAU;
      ctx.beginPath(); ctx.arc(x + Math.cos(an) * 7.5 * s, y - 12 * s + Math.sin(an) * 3.8 * s, 4.4 * s, 0, TAU); ctx.fill();
    }
    ctx.beginPath(); ctx.ellipse(x, y - 12 * s, 9 * s, 5.5 * s, 0, 0, TAU); ctx.fill();
    // 羊毛的卷：几道淡金的弧
    ctx.strokeStyle = 'rgba(226,190,120,0.55)'; ctx.lineWidth = Math.max(0.6, 0.6 * s);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const cx0 = x + (-5 + i * 2.6) * s, cy0 = y - (10.5 + 2.2 * (i % 2)) * s; ctx.moveTo(cx0 + 1.6 * s, cy0); ctx.arc(cx0, cy0, 1.6 * s, 0, Math.PI * 1.3); }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(236,196,120,0.55)'; ctx.lineWidth = Math.max(0.6, 0.7 * s);
    ctx.beginPath(); ctx.ellipse(x, y - 12.5 * s, 12 * s, 7.6 * s, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    // 头与耳
    ctx.fillStyle = 'rgb(255,252,244)';
    ctx.beginPath(); ctx.ellipse(x + d * 12 * s, y - 16 * s, 4.2 * s, 3.3 * s, d * 0.35, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgb(248,238,220)';
    ctx.beginPath(); ctx.ellipse(x + d * 9.5 * s, y - 18 * s, 2.6 * s, 1.1 * s, d * -0.6, 0, TAU); ctx.fill();
    // 七角七眼：七点光（七灯的火到了，才亮起）
    ctx.globalCompositeOperation = 'lighter';
    const noLamps = 1 - sm(0.5, 1, lv('trnFire7'));
    for (let i = 0; i < 7; i++) {
      const on = Math.max(sm(0.85, 1, sevenT(i)), noLamps);
      if (on < 0.01) continue;
      const E = vp(V, ...lambEye(i));
      const tw = 0.75 + 0.25 * Math.sin(CLK * 2.4 + i * 1.3);
      r = 7 * V.s * lambK() / 2.2 * tw * 2;
      ctx.globalAlpha = k * on * 0.6; ctx.drawImage(SP.flame, E[0] - r, E[1] - r, 2 * r, 2 * r);
      r = 4.2 * V.s * lambK() / 2.2 * 1.8 * tw;
      ctx.globalAlpha = k * on * 0.95; ctx.drawImage(SP.star, E[0] - r, E[1] - r, 2 * r, 2 * r);
    }
    ctx.restore();
  }
  // 七灵奉差遣往普天下去（5:6）：七道光自羔羊落到地上与海上
  function rayDest(i) {
    const R = X('rays')[i], xf = R[0], l = R[1];
    if (l < 0) return [xf * W.w, R[2] * W.h];
    if (l === 2) return [xf * W.w, vY(xf, R[2])];
    return [xf * W.w, gY(l, xf)];
  }
  function drawRays(ctx) {
    const p = lv('trnRays');
    if (p < 0.001 || lv('trnLamb') < 0.05) return;
    SP || sprites();
    const V = VG(), u = SU();
    const fade = 1 - sm(0.82, 1, p);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const q = clamp((p - i * 0.06) / 0.45, 0, 1);
      if (q <= 0) continue;
      const [lx, ly] = vp(V, ...lambEye(i));
      const D = rayDest(i), e = easeIO(q);
      const hx = lerp(lx, D[0], e), hy = lerp(ly, D[1], e);
      if (fade > 0.01) {
        const g = ctx.createLinearGradient(lx, ly, hx, hy);
        g.addColorStop(0, 'rgba(255,248,226,0.05)'); g.addColorStop(1, 'rgba(255,248,226,0.8)');
        ctx.strokeStyle = g; ctx.lineWidth = Math.max(1, 1.6 * u);
        ctx.globalAlpha = fade * 0.7;
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(hx, hy); ctx.stroke();
        if (q < 1) { const r = 10 * u; ctx.globalAlpha = fade; ctx.drawImage(SP.white, hx - r, hy - r, 2 * r, 2 * r); }
      }
      // 到了地上：一点不灭的光
      if (q >= 1) {
        const tw = 0.8 + 0.2 * Math.sin(CLK * 1.7 + i * 2);
        let r = (16 + 14 * fade) * u * tw;
        ctx.globalAlpha = 0.35 + 0.4 * fade; ctx.drawImage(SP.gold, D[0] - r, D[1] - r * 0.7, 2 * r, 1.4 * r);
        r = 4 * u;
        ctx.globalAlpha = 0.8; ctx.drawImage(SP.white, D[0] - r, D[1] - r, 2 * r, 2 * r);
      }
    }
    ctx.restore();
  }
  // 闪电、声音、雷轰从宝座中发出（4:5）
  function drawZaps(ctx, V, hush) {
    const z = lv('trnZap') * hush * (1 - 0.6 * lv('trnPraise'));
    if (z < 0.02) return;
    const period = 2.3, n = Math.floor(CLK / period), ph = CLK - n * period;
    if (ph > 0.2) return;
    const env = 1 - ph / 0.2, s = V.s;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(226,238,255)'; ctx.lineCap = 'round'; ctx.lineJoin = 'miter';
    for (let b = 0; b < 2; b++) {
      const seed = n * 13 + b * 5;
      const an = hsh(seed) * TAU;
      let [x, y] = vp(V, Math.cos(an) * 40, -56 + Math.sin(an) * 40);
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let i = 0; i < 6; i++) {
        const a2 = an + (hsh(seed + i + 1) - 0.5) * 0.9;
        x += Math.cos(a2) * (8 + 7 * hsh(seed + i + 9)) * s; y += Math.sin(a2) * (8 + 7 * hsh(seed + i + 17)) * s;
        ctx.lineTo(x, y);
      }
      ctx.globalAlpha = z * env; ctx.lineWidth = Math.max(1, 1.2 * s); ctx.stroke();
      ctx.globalAlpha = z * env * 0.22; ctx.lineWidth = Math.max(2, 3.5 * s); ctx.stroke();
    }
    ctx.restore();
  }
  // 「阿们」写在天上的地方（横屏：宝座之上；竖屏：异象之下，不入顶上的经文）与它的字号
  function amenAt() {
    const V = VG(), size = M() * (V.port ? 0.075 : 0.055), p = vp(V, 0, V.port ? 152 : -196);
    const half = (size * 1.08 * 1) / 2 + size * 0.6;
    return [clamp(p[0], half + 8, W.w - half - 8), clamp(p[1], size + 8, W.h - size), size, half];
  }
  // 千千万万的天使（5:11）：满天的小小的光，一圈一圈自宝座向外显出
  function drawHost(ctx, V, hush) {
    const k = lv('trnHost');
    if (k < 0.005) return;
    const port = V.port, n = Math.round(HOST.length * 0.82 * clamp(W.quality || 1, 0.5, 1));
    const y0 = W.h * (port ? 0.12 : 0.035), y1 = W.h * (port ? 0.58 : 0.56);
    const cx = V.x, cy = V.y - 20 * V.s, ex = 372 * V.s, ey = 165 * V.s;
    const reach = k * 1.3, pr = lv('trnPraise'), u = SU() * (port ? 0.8 : 1);
    // 「阿们」的字四围留空（不叫天使的光压在字上）
    const am = lv('trnAmen') > 0.02 ? amenAt() : null;
    const amX = am ? am[3] * 1.3 + 10 * u : 0, amY = am ? am[2] * 0.75 * 1.3 + 10 * u : 0;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const h = HOST[i];
      const x = h.u * W.w, y = lerp(y0, y1, h.v) + Math.sin(CLK * 0.8 + h.ph) * 2 * u;
      // 卷名与右上角的按钮处留空
      if (y < W.h * 0.085 && (Math.abs(x - W.w * 0.5) < W.w * 0.12 || x > W.w - 250)) continue;
      if (am && Math.abs(x - am[0]) < amX && Math.abs(y - am[1]) < amY) continue;
      const e = Math.hypot((x - cx) / ex, (y - cy) / ey);
      if (e < 1.03) continue;
      const d = Math.hypot((x - cx) / (W.w * 0.62), (y - cy) / (W.h * 0.5));
      const vis = clamp((reach - d) * 4, 0, 1);
      if (vis <= 0) continue;
      let a = vis * hush * (0.66 + 0.2 * Math.sin(CLK * 1.3 + h.ph) + 0.2 * pr) * (1 - 0.3 * sm(1.3, 2.6, e));
      if (port) a *= sm(W.h * 0.2, W.h * 0.3, y);
      if (a < 0.02) continue;
      const s = h.sz * u * 1.35 * (1.15 - 0.3 * sm(1.1, 2.4, e));
      const fr = SP.angel[(Math.sin(CLK * 2.2 + h.ph) * 1.49 + 1.5) | 0];
      ctx.globalAlpha = Math.min(1, a);
      ctx.drawImage(fr, x - 8 * s, y - 8.5 * s, 16 * s, 16 * s);
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  装饰的效果（只在看时有；重演时略过）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxPush(b, e) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, e)); }
  function flashAt(b, x, y, r, col) { fxPush(b, { type: 'flash', dur: 1.8, x, y, r, col: col || [255, 244, 220] }); }
  function mote(b, A, B, o) { fxPush(b, Object.assign({ type: 'mote', dur: 3, A, B, c: [255, 226, 170], arc: 50, delay: 0 }, o || {})); }
  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const t = e.t - (e.delay || 0);
      if (t < 0) continue;
      const q = clamp(t / (e.dur - (e.delay || 0)), 0, 1);
      if (e.type === 'flash') {
        const r = e.r * (0.6 + 0.4 * q);
        ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, q * 1.4 + 0.1)) * 0.7 * (1 - q);
        ctx.drawImage(SP.white, e.x - r, e.y - r, 2 * r, 2 * r);
      } else if (e.type === 'mote') {
        const A = typeof e.A === 'function' ? e.A() : e.A, B = typeof e.B === 'function' ? e.B() : e.B;
        if (!A || !B) continue;
        const k = easeIO(q);
        const x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k) - Math.sin(Math.PI * k) * e.arc * u;
        const r = (e.size || 7) * u;
        ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, q * 1.15)) * 0.9;
        ctx.drawImage(SP.gold, x - r * 1.8, y - r * 1.8, 3.6 * r, 3.6 * r);
        ctx.drawImage(SP.star, x - r * 0.7, y - r * 0.7, 1.4 * r, 1.4 * r);
      } else if (e.type === 'sweep') {
        // 「你创造了万物」：一团温暖的光自天上往下扫过全地——四边都是柔的（横屏时只在右边的地上，不到左边海上的经文）
        const yy = lerp(e.y0, W.h * 1.02, easeIO(q)), port = tall();
        const cx = W.w * (port ? 0.5 : 0.74), rx = W.w * (port ? 0.85 : 0.3), ry = W.h * (port ? 0.085 : 0.11);
        ctx.save();
        ctx.translate(cx, yy); ctx.scale(rx, ry);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0, 'rgba(255,232,184,0.36)'); g.addColorStop(0.45, 'rgba(255,226,170,0.17)'); g.addColorStop(1, 'rgba(255,226,170,0)');
        ctx.fillStyle = g; ctx.globalAlpha = Math.sin(Math.PI * q) * 0.9;
        ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
        ctx.restore();
      } else if (e.type === 'crownring') {
        const [x, y] = churchPt(e.i), r = (10 + 16 * q) * u;
        ctx.strokeStyle = 'rgb(255,220,140)'; ctx.lineWidth = Math.max(1, 1.6 * u);
        ctx.globalAlpha = Math.sin(Math.PI * q) * 0.85;
        ctx.beginPath(); ctx.ellipse(x, y - 14 * u, r, r * 0.35, 0, 0, TAU); ctx.stroke();
        ctx.drawImage(SP.gold, x - r, y - 14 * u - r * 0.6, 2 * r, 1.2 * r);
      }
    }
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  布景的调度
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      CLK += f;
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.12 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
      // 人子进屋时渐渐隐去，不像天使那样升起
      const sf = fig('son');
      if (sf && sf.dying) sf.lift = 0;
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawArc(ctx); drawHeaven(ctx); }
      else if (pass === 'far') drawChurches(ctx);
      else if (pass === 'near') { drawRock(ctx); drawStones(ctx); drawHouse(ctx); drawOil(ctx); }
      else if (pass === 'air') drawVeil(ctx);
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'near') drawLampstands(ctx);
      else if (pass === 'air') {
        drawThreads(ctx); drawLampGlow(ctx); drawHouseGlow(ctx); drawVoice(ctx);
        drawJohnLight(ctx); drawSonLight(ctx); drawScroll(ctx); drawStars(ctx); drawRays(ctx); drawOilGlow(ctx); drawFX(ctx);
      }
    },
    reset() { FXL.length = 0; VT.clear(); },
    restore() {
      FXL.length = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      const R = PH(2);
      { const p = rockPts()[5]; cand('拔摩', p[0], p[1] + R * 0.8); }
      if (lv('trnLamps') > 6.5) for (let i = 0; i < 7; i++) { const p = lampFlamePt(i); cand('金灯台', p[0], p[1] + R * 0.3); }
      // 七个名字正聚散时不另显标签（免得与之相叠）
      if (lv('trnLamps') > 0.5) for (let i = 0; i < 7; i++) if (churchLit(i) > 0.5) { const p = churchPt(i); cand(CHURCH[i], p[0], p[1]); }
      if (lv('trnStars') > 0.5 && lv('trnSent') < 0.05) { const h = handPt(); if (h) cand('七星', h[0], h[1]); }
      if (lv('trnHouse') > 0.5) {
        const H = houseGeom();
        if (lv('trnTable') > 0.5 && lv('trnDoorO') > 0.5) cand('坐席', H.dc, H.g - (H.g - H.dTop) * 0.35);
        else cand('门', H.dc, H.dTop + (H.g - H.dTop) * 0.4);
      }
      if (visAny()) {
        const V = VG();
        if (lv('trnGate') > 0.5 && lv('trnThrone') < 0.5) { const p = vp(V, 0, -48); cand('天上的门', p[0], p[1]); }
        if (lv('trnThrone') > 0.5) { const p = vp(V, 0, -40); cand('宝座', p[0], p[1]); }
        if (lv('trnBow') > 0.5) { const p = vp(V, -70, -126); cand('虹', p[0], p[1]); }
        if (lv('trnElders') > 23.5) for (const e of ELD) { const J = elderJ(V, e); cand('长老', J.head[0], J.head[1]); }
        if (lv('trnFire7') > 0.5 && lv('trnSeven') < 0.3) { const p = vp(V, -48, 24); cand('七盏火灯', p[0], p[1]); }
        if (lv('trnGlass') > 0.5) { const p = vp(V, 190, 66); cand('玻璃海', p[0], p[1]); }
        for (let i = 0; i < 4; i++) if (lv('trnBeasts') > i + 0.5) { const p = vp(V, BEASTS[i].lx, BEASTS[i].ly - 20); cand('活物', p[0], p[1]); }
        if (lv('trnBook') > 0.5) { const p = bookPos(V); cand('书卷', p[0], p[1]); }
        if (lv('trnLamb') > 0.5) { const p = vp(V, LAMB_AT[0], LAMB_AT[1] - 12 * lambK()); cand('羔羊', p[0], p[1]); }
        if (lv('trnHost') > 0.5) cand('千千万万的天使', W.w * (V.port ? 0.2 : 0.2), W.h * (V.port ? 0.55 : 0.2));
      }
      return best;
    },
    sig() {
      const c = GS.cast && GS.cast.people;
      const air = [];
      if (c) for (const [id, p] of c) if (!p.dying && p.ny != null) air.push(id + ':' + Math.round(p.ny * 100) / 100);
      return { S: JSON.stringify(S), air: air.sort().join(',') };
    },
  };
  // 约翰身旁小灯的光（夜里）
  function drawOilGlow(ctx) {
    const k = nightK();
    if (k < 0.05) return;
    SP || sprites();
    const [x, y] = oilPt(), R = PH(2);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    let r = R * 1.1;
    ctx.globalAlpha = k * 0.5; ctx.drawImage(SP.warm, x - r, y - r * 0.8, 2 * r, 1.6 * r);
    r = R * 0.14;
    ctx.globalAlpha = k * 0.9; ctx.drawImage(SP.gold, x + R * 0.05 - r, y - R * 0.1 - r, 2 * r, 2 * r);
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：拔摩海岛，主日黎明之前（1:9）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; VT.clear(); S = fresh(); }
  function setup() {
    // 多石的海岛：草稀、花少，磐石后几棵树
    W.set('bare', 0.42, true); W.set('bloom', 0.22, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.28, land: 1, grass: 0.5, herbs: 0.3, trees: 0.1, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.19, 0, true);
    const lx = W.w * 0.95, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.14, W.h * 0.78, true);
    W.setPop('bird', 12, W.w * 0.45, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    avoid([0.5, 1.02]);
    const c = C();
    c.clear({ fade: false });
    // 年老的约翰（新约里同一副样子：LOOK.john；在拔摩时已是长者）在岸边的石旁跪着祷告，面向东方的海
    const LJ = (GS.cast && GS.cast.LOOK && GS.cast.LOOK.john) || { label: '约翰', sex: 'm', age: 'adult', robe: [150, 70, 64], accent: [220, 206, 180], hair: 'short', beard: false };
    add('john', Object.assign({}, LJ, { age: 'elder', x: X('john0'), layer: 2, facing: -1, pose: 'pray', from: 'none', glow: 0.35, v: 0.26, prop: null }));
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '耶稣基督的启示，就是神赐给他，叫他将必要快成的事指示他的众仆人。', ref: '启示录 1:1', hold: 6 },
    { text: '念这书上预言的和那些听见又遵守其中所记载的，都是有福的，因为日期近了。', ref: '启示录 1:3', hold: 6 },
  ];
  const V1 = [
    { text: '约翰写信给亚细亚的七个教会。但愿从那昔在、今在、以后永在的神……<br>有恩惠、平安归与你们！', ref: '启示录 1:4–5', hold: 7 },
    { text: '主神说：「我是阿拉法，我是俄梅戛，<br>是昔在、今在、以后永在的全能者。」', ref: '启示录 1:8', hold: 7.5 },
  ];
  const V2 = [
    { text: '我约翰就是你们的弟兄，和你们在耶稣的患难、国度、忍耐里一同有分……<br>曾在那名叫拔摩的海岛上。', ref: '启示录 1:9', hold: 7 },
    { text: '当主日，我被圣灵感动，听见在我后面有大声音如吹号，说：「你所看见的当写在书上，<br>达与以弗所、士每拿、别迦摩、推雅推喇、撒狄、非拉铁非、老底嘉那七个教会。」', ref: '启示录 1:10–11', hold: 10 },
  ];
  const V3 = [
    { text: '我转过身来，要看是谁发声与我说话；既转过来，就看见七个金灯台。', ref: '启示录 1:12', hold: 6 },
    { text: '灯台中间有一位好像人子，身穿长衣，直垂到脚，胸间束着金带。<br>他的头与发皆白，如白羊毛，如雪；眼目如同火焰；', ref: '启示录 1:13–14', hold: 7.5 },
    { text: '脚好像在炉中锻炼光明的铜；声音如同众水的声音。<br>他右手拿着七星……面貌如同烈日放光。', ref: '启示录 1:15–16', hold: 7.5 },
  ];
  const V4 = [
    { text: '我一看见，就仆倒在他脚前，像死了一样。<br>他用右手按着我，说：「不要惧怕！我是首先的，我是末后的……」', ref: '启示录 1:17', hold: 7 },
    { text: '「……又是那存活的；我曾死过，现在又活了，直活到永永远远；<br>并且拿着死亡和阴间的钥匙。」', ref: '启示录 1:18', hold: 7 },
    { text: '「所以你要把所看见的，和现在的事，并将来必成的事，都写出来。」', ref: '启示录 1:19', hold: 6 },
  ];
  const V5 = [
    { text: '「……那七星就是七个教会的使者，七灯台就是七个教会。」', ref: '启示录 1:20', hold: 5.5 },
    { text: '圣灵向众教会所说的话，凡有耳的，就应当听！<br>得胜的，我必将神乐园中生命树的果子赐给他吃。', ref: '启示录 2:7', hold: 7 },
    { text: '你将要受的苦你不用怕……你务要至死忠心，我就赐给你那生命的冠冕。', ref: '启示录 2:10', hold: 6.5 },
  ];
  const V6 = [
    { text: '看哪，我站在门外叩门，若有听见我声音就开门的，<br>我要进到他那里去，我与他，他与我一同坐席。', ref: '启示录 3:20', hold: 8 },
    { text: '得胜的，我要赐他在我宝座上与我同坐，<br>就如我得了胜，在我父的宝座上与他同坐一般。', ref: '启示录 3:21', hold: 7 },
  ];
  const V7 = [
    { text: '此后，我观看，见天上有门开了。我初次听见好像吹号的声音，对我说：<br>「你上到这里来，我要将以后必成的事指示你。」', ref: '启示录 4:1', hold: 8.5 },
  ];
  const V8 = [
    { text: '我立刻被圣灵感动，见有一个宝座安置在天上，又有一位坐在宝座上。', ref: '启示录 4:2', hold: 6.5 },
    { text: '看那坐着的，好像碧玉和红宝石；又有虹围着宝座，好像绿宝石。', ref: '启示录 4:3', hold: 6.5 },
  ];
  const V9 = [
    { text: '宝座的周围又有二十四个座位；其上坐着二十四位长老，<br>身穿白衣，头上戴着金冠冕。', ref: '启示录 4:4', hold: 7 },
    { text: '有闪电、声音、雷轰从宝座中发出；<br>又有七盏火灯在宝座前点着；这七灯就是神的七灵。', ref: '启示录 4:5', hold: 7 },
  ];
  const V10 = [
    { text: '宝座前好像一个玻璃海，如同水晶。<br>宝座中和宝座周围有四个活物，前后遍体都满了眼睛。', ref: '启示录 4:6', hold: 7 },
    { text: '第一个活物像狮子，第二个像牛犊，第三个脸面像人，第四个像飞鹰。', ref: '启示录 4:7', hold: 6.5 },
  ];
  const V11 = [
    { text: '四活物各有六个翅膀，遍体内外都满了眼睛。他们昼夜不住地说：<br>圣哉！圣哉！圣哉！主神是昔在、今在、以后永在的全能者。', ref: '启示录 4:8', hold: 8 },
    { text: '……那二十四位长老就俯伏在坐宝座的面前敬拜那活到永永远远的，<br>又把他们的冠冕放在宝座前，说：', ref: '启示录 4:10', hold: 6.5 },
    { text: '我们的主，我们的神，你是配得荣耀、尊贵、权柄的；<br>因为你创造了万物，并且万物是因你的旨意被创造而有的。', ref: '启示录 4:11', hold: 7.5 },
  ];
  const V12 = [
    { text: '我看见坐宝座的右手中有书卷，里外都写着字，用七印封严了。', ref: '启示录 5:1', hold: 6 },
    { text: '我又看见一位大力的天使大声宣传说：<br>「有谁配展开那书卷，揭开那七印呢？」', ref: '启示录 5:2', hold: 6 },
    { text: '在天上、地上、地底下，没有能展开、能观看那书卷的。<br>因为没有配展开、配观看那书卷的，我就大哭。', ref: '启示录 5:3–4', hold: 7 },
  ];
  const V13 = [
    { text: '长老中有一位对我说：「不要哭！看哪，犹大支派中的狮子，大卫的根，<br>他已得胜，能以展开那书卷，揭开那七印。」', ref: '启示录 5:5', hold: 7.5 },
    { text: '我又看见宝座与四活物，并长老之中有羔羊站立，像是被杀过的，<br>有七角七眼，就是神的七灵，奉差遣往普天下去的。', ref: '启示录 5:6', hold: 8 },
    { text: '这羔羊前来，从坐宝座的右手里拿了书卷。', ref: '启示录 5:7', hold: 5 },
  ];
  const V14 = [
    { text: '他既拿了书卷，<br>四活物和二十四位长老就俯伏在羔羊面前，<br>各拿着琴和盛满了香的金炉；这香就是众圣徒的祈祷。', ref: '启示录 5:8', hold: 8 },
    { text: '他们唱新歌，说：你配拿书卷，配揭开七印；因为你曾被杀，<br>用自己的血从各族、各方、各民、各国中买了人来，叫他们归于神。', ref: '启示录 5:9', hold: 8 },
    { text: '我又看见且听见，宝座与活物并长老的周围有许多天使的声音；他们的数目有千千万万，<br>大声说：曾被杀的羔羊是配得权柄、丰富、智慧、能力、尊贵、荣耀、颂赞的。', ref: '启示录 5:11–12', hold: 9 },
  ];
  const V15 = [
    { text: '我又听见在天上、地上、地底下、沧海里，和天地间一切所有被造之物，都说：<br>「但愿颂赞、尊贵、荣耀、权势<br>都归给坐宝座的和羔羊，直到永永远远！」', ref: '启示录 5:13', hold: 9 },
    { text: '四活物就说：「阿们！」众长老也俯伏敬拜。', ref: '启示录 5:14', hold: 6 },
  ];

  // ── 情节的助手 ───────────────────────────────────────────────
  function sonAdd(b, o) {
    add('son', Object.assign({ label: '人子', sex: 'm', age: 'adult', angel: true, robe: [252, 250, 244], accent: [255, 206, 104], glow: 1,
      x: X('son'), layer: 2, facing: -1, v: 0.22, from: b.instant ? 'none' : 'light', prop: null, scale: 1.25 }, o || {}));
  }
  function churchName(b, i) {
    if (b.instant) return;
    const port = tall(), size = Math.max(M() * (port ? 0.034 : 0.031), 12.5);
    const p = churchPt(i), rows = 3;
    const y = p[1] - size * (1.25 + 1.45 * (i % rows));
    chosenName(CHURCH[i], p[0], y, size, [255, 232, 190], () => [p[0] + rand(-5, 5), p[1] + rand(-3, 1)], { hold: 3.2 });
    chime(CHURCH[i]);
  }
  function visionFlash(b, lx, ly, r) { if (b.instant) return; const V = VG(), p = vp(V, lx, ly); flashAt(b, p[0], p[1], r * V.s); }
  function holyPulse(b) {
    if (b.instant) return;
    const V = VG(), p = vp(V, 0, -56);
    if (GS.fx && GS.fx.ring) GS.fx.ring(p[0], p[1], [255, 240, 210], 260 * V.s, 2.2, 1.6);
    sfx(b, 'bell');
  }
  // 众圣徒的祈祷：自灯台、远处的教会与约翰升到长老的金炉里
  function prayers(b) {
    if (b.instant) return;
    const src = [];
    for (let i = 0; i < 7; i++) src.push(() => lampFlamePt(i), () => churchPt(i));
    src.push(() => figPt('john', 0.6));
    src.forEach((S0, k) => {
      const e = ELD[(k * 7 + 3) % ELD.length];
      mote(b, S0, () => { const J = elderJ(VG(), e); return [J.knee[0] + J.f * 0.1 * J.H, J.knee[1] - 0.1 * J.H]; },
        { dur: 4.2 + 0.1 * (k % 5), delay: (k % 8) * 0.35, arc: 30, size: 5, c: [255, 214, 160] });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每句话的经文不过四行，它的故事约三十秒以内：一按一放，便是一步）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 我是阿拉法，我是俄梅戛：光弧自东而西，主日的黎明 ─────────
    {
      kind: 'name', utter: '我是阿拉法，我是俄梅戛', cmd: 'seq --from 阿拉法 --to 俄梅戛  # 昔在、今在、以后永在', ref: '1:8', tint: [255, 236, 200],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.set('trnArcA', 1, b.instant); W.set('trnArc', 1, b.instant);
            W.goTo(0.262, 13, b.instant);
            sfx(b, 'stars');
            if (!b.instant) nameArc(0);
          }],
          [L[1] - 1.4, b => { if (!b.instant) nameArc(1); sfx(b, 'harp'); }],
          [L[1] + 1.2, () => { pose('john', 'gaze'); face('john', -1); }],
          [L[2] - 1.5, b => W.set('trnArcA', 0.5, b.instant)],
        ]);
      },
    },
    // ── 2 · 你所看见的当写在书上：如号的声音；七个教会 ─────────────
    {
      kind: 'cmd', utter: '你所看见的当写在书上', cmd: 'write 书卷 --to 七个教会  # 当主日', ref: '1:11', tint: [255, 226, 170],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const t0 = L[1] + 1.4;
        const beats = [
          [0, b => { W.set('trnArcA', 0, b.instant); W.goTo(0.31, 10, b.instant); }],
          [L[1] - 0.3, b => {
            W.set('trnVoice', 1, b.instant);
            sfx(b, 'trumpet');
            if (!b.instant) { const p = voicePt(); flashAt(b, p[0], p[1], PH(2) * 2.4); }
            pose('john', 'stand');
          }],
          [L[1] + 2.4, b => { pose('john', 'sit'); face('john', -1); W.set('trnScroll', 1, b.instant); sfx(b, 'scroll'); }],
          [t0, b => W.set('trnChurch', 7, b.instant)],
          [L[1] + 5, b => sfx(b, 'write')],
        ];
        for (let i = 0; i < 7; i++) beats.push([t0 + (i + 0.5) / 0.75, b => { churchName(b, i); sfx(b, 'chime', { soft: true }); }]);
        T(c, beats);
      },
    },
    // ── 3 · 灯台中间有一位好像人子 ─────────────────────────────
    {
      kind: 'act', utter: '灯台中间有一位好像人子', cmd: 'light 金灯台 ×7 && reveal 人子 --among 灯台', ref: '1:13', tint: [255, 232, 180],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const beats = [
          [0, b => { W.set('trnScroll', 0, b.instant); pose('john', 'stand'); W.goTo(0.32, 8, b.instant); }],
          [0.8, () => face('john', 1)],
          [1.4, b => W.set('trnLamps', 7, b.instant)],
          [L[1] - 0.6, b => {
            sonAdd(b);
            W.set('trnSon', 0.6, b.instant); W.set('trnVoice', 0, b.instant); W.set('trnVeil', 1, b.instant);
            sfx(b, 'angel');
            if (!b.instant) { const p = voicePt(); flashAt(b, p[0], p[1], PH(2) * 3); }
          }],
          [L[2] - 0.2, b => sfx(b, 'wave', { soft: true })],
          [L[2] + 2.4, b => { W.set('trnStars', 1, b.instant); sfx(b, 'stars'); }],
          [L[2] + 4.6, b => { W.set('trnSon', 1, b.instant); sfx(b, 'harp'); }],
          [L[3] - 4.2, () => walk('john', X('johnF'), { speed: 0.03, pose: 'fall' })],
        ];
        for (let i = 0; i < 7; i++) beats.push([1.4 + (i + 0.8) / 0.9, b => sfx(b, 'bell', { soft: true })]);
        T(c, beats);
      },
    },
    // ── 4 · 不要惧怕！我是首先的，我是末后的 ──────────────────────
    {
      kind: 'promise', utter: '不要惧怕！我是首先的，我是末后的', cmd: 'touch 约翰 --hand right  # 死亡和阴间的钥匙', ref: '1:17', tint: [255, 240, 214],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, () => { pose('john', 'fall'); face('son', -1); }],
          [1.2, () => pose('son', 'bow')],
          [2.6, b => {
            glow('john', 0.6);
            sfx(b, 'harp');
            if (!b.instant) { const p = figPt('john', 0.1); if (p) fx().sparkle(p[0], p[1], 26, [255, 240, 210], 14, 'top'); }
          }],
          [4.2, () => { pose('son', 'stand'); pose('john', 'kneel'); face('john', 1); }],
          [L[1] + 1.5, b => { sfx(b, 'angel', { soft: true }); if (!b.instant) { const f = fig('son'); if (f) { const p = partOf(f, HEAD); flashAt(b, p[0], p[1], PH(2) * 2.2); } } }],
          [L[2] + 0.2, b => { W.set('trnScroll', 1, b.instant); sfx(b, 'write'); }],
        ]);
      },
    },
    // ── 5 · 凡有耳的，就应当听！七星飞往七个教会 ──────────────────
    {
      kind: 'call', utter: '凡有耳的，就应当听！', cmd: 'send 七星 → 七个教会  # 七灯台就是七个教会', ref: '2:7', tint: [255, 230, 180],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        const t0 = L[1] - 1.2;
        const beats = [
          [0, b => { W.goTo(0.37, 12, b.instant); W.set('trnScroll', 0, b.instant); pose('john', 'stand'); }],
          [0.8, () => pose('son', 'raise')],
          [t0, b => { W.set('trnSent', 1, b.instant); W.set('trnThreads', 1, b.instant); }],
          [t0 + 9.4, () => { pose('son', 'stand'); pose('john', 'gaze'); }],
          [L[2] + 1.2, b => fxPush(b, { type: 'crownring', dur: 3.2, i: 1 })],
        ];
        for (let i = 0; i < 7; i++) {
          beats.push([t0 + (i * 0.085) * 10 + 0.3, b => sfx(b, 'stars', { soft: true })]);
          beats.push([t0 + (i * 0.085 + 0.4) * 10, b => { sfx(b, 'chime', { soft: true }); if (!b.instant) { const p = churchPt(i); flashAt(b, p[0], p[1], 34 * SU()); } }]);
        }
        T(c, beats);
      },
    },
    // ── 6 · 看哪，我站在门外叩门：门开了，他进到那人那里去，一同坐席 ─────────
    {
      kind: 'call', utter: '看哪，我站在门外叩门', cmd: 'knock 门 && open --if 听见  # 一同坐席', ref: '3:20', tint: [255, 214, 160],
      verse: V6,
      apply(c) {
        const door = () => houseGeom().dc / W.w;
        T(c, [
          [0, b => {
            W.goTo(0.768, 8, b.instant);
            W.set('trnVeil', 0, b.instant); W.set('trnStars', 0, b.instant);
            W.set('trnHouse', 1, b.instant); W.set('trnLampIn', 1, b.instant);
            pose('son', 'stand');
            walk('son', X('knock'), { speed: 0.022 });
            sink('son', 0.04);
            face('john', 1); pose('john', 'stand');
          }],
          [6.4, () => { face('son', 1); pose('son', 'point'); }],
          [6.6, b => sfx(b, 'knock')],
          [7.8, b => sfx(b, 'knock', { soft: true })],
          [8.6, () => pose('son', 'stand')],
          [9.0, b => { W.set('trnDoorO', 1, b.instant); sfx(b, 'gate'); }],
          // 开门的人站在亮着的门口
          [9.8, b => add('host', { label: '开门的人', sex: 'm', age: 'adult', robe: [128, 98, 70], x: door(), layer: 2, facing: -1, v: 0.02, glow: 0.4, beard: true, from: b.instant ? 'none' : 'fade', prop: null })],
          // 他进到那人那里去
          [11.4, () => { rm('host'); leave('son', door(), { speed: 0.018 }); }],
          [13.6, b => {
            rm('son');
            W.set('trnTable', 1, b.instant); W.set('trnSon', 0, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
    // ── 7 · 你上到这里来：天上有门开了；约翰的灵顺着光上去 ─────────────
    {
      kind: 'call', utter: '你上到这里来，我要将以后必成的事指示你', cmd: 'open /heaven/door && cd ..  # 如吹号的声音', ref: '4:1', tint: [255, 236, 196],
      verse: V7,
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.93, 9, b.instant);
            W.set('trnGate', 1, b.instant); W.set('trnThreads', 0, b.instant);
            sfx(b, 'trumpet');
            pose('john', 'gaze'); face('john', 1);
          }],
          [2.4, b => { W.set('trnGateO', 1, b.instant); sfx(b, 'gate', { soft: true }); }],
          // 屋门掩上，窗里仍有灯
          [3.4, b => { W.set('trnDoorO', 0, b.instant); W.set('trnTable', 0, b.instant); }],
          // 一点光自约翰身上顺着那道光升到天上的门里（「我立刻被圣灵感动」）
          [4.4, b => {
            glow('john', 0.6);
            mote(b, () => figPt('john', 0.62), () => vp(VG(), 0, -44), { dur: 5.2, arc: 0, size: 11, c: [255, 240, 210] });
            sfx(b, 'angel', { soft: true });
          }],
          [9.6, b => {
            if (!b.instant) { const V = VG(), p = vp(V, 0, -48); flashAt(b, p[0], p[1], 120 * V.s); }
            pose('john', 'kneel');
          }],
        ]);
      },
    },
    // ── 8 · 有一个宝座安置在天上：碧玉、红宝石、绿宝石的虹 ────────────
    {
      kind: 'act', utter: '有一个宝座安置在天上', cmd: 'mount 宝座 /heaven --halo 绿宝石', ref: '4:2', tint: [236, 255, 240],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => { W.set('trnThrone', 1, b.instant); sfx(b, 'angel'); visionFlash(b, 0, -54, 200); pose('john', 'kneel'); glow('john', 0.55); }],
          [L[1] - 0.3, b => { W.set('trnBow', 1, b.instant); sfx(b, 'harp'); }],
          [L[2] - 0.5, b => W.set('trnGate', 0, b.instant)],
        ]);
      },
    },
    // ── 9 · 宝座的周围又有二十四个座位 ──────────────────────────
    {
      kind: 'act', utter: '宝座的周围又有二十四个座位', cmd: 'seat 长老 ×24 --robe 白衣 --crown 金', ref: '4:4', tint: [255, 240, 200],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        const beats = [
          [0, b => W.set('trnElders', 24, b.instant)],
          [L[1] - 0.2, b => { W.set('trnZap', 1, b.instant); sfx(b, 'thunder'); visionFlash(b, 0, -56, 260); }],
          [L[1] + 2.4, b => { W.set('trnFire7', 1, b.instant); sfx(b, 'fire', { soft: true }); }],
          [L[1] + 4.6, b => sfx(b, 'thunder', { soft: true, far: true })],
        ];
        for (let i = 0; i < 5; i++) beats.push([0.6 + i * 2, b => sfx(b, 'harp', { soft: true })]);
        T(c, beats);
      },
    },
    // ── 10 · 宝座中和宝座周围有四个活物；玻璃海 ────────────────────
    {
      kind: 'act', utter: '宝座中和宝座周围有四个活物', cmd: 'spawn 活物 狮子 牛犊 人 飞鹰 --wings 6 --eyes all', ref: '4:6', tint: [255, 236, 200],
      verse: V10,
      apply(c) {
        const t0 = 3.4;
        const beats = [
          [0, b => { W.set('trnGlass', 1, b.instant); sfx(b, 'stars'); }],
          [t0, b => W.set('trnBeasts', 4, b.instant)],
        ];
        for (let i = 0; i < 4; i++) beats.push([t0 + (i + 0.3) / 0.55, b => { sfx(b, 'wings'); visionFlash(b, BEASTS[i].lx, BEASTS[i].ly - 10, 90); }]);
        T(c, beats);
      },
    },
    // ── 11 · 圣哉！圣哉！圣哉！长老俯伏，把冠冕放在宝座前 ──────────────
    {
      kind: 'refrain', utter: '圣哉！圣哉！圣哉！', cmd: 'while :; do echo 圣哉; done  # 昼夜不住', ref: '4:8', tint: [255, 246, 226],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => { W.set('trnHoly', 1, b.instant); holyPulse(b); }],
          [1.4, b => holyPulse(b)],
          [2.8, b => holyPulse(b)],
          [L[1] - 0.3, b => { W.set('trnFall', 1, b.instant); sfx(b, 'harp'); pose('john', 'pray'); }],
          [L[1] + 1.8, b => { W.set('trnCrowns', 1, b.instant); sfx(b, 'chime'); }],
          [L[2] - 0.2, b => {
            sfx(b, 'angel');
            if (!b.instant) { const V = VG(); fxPush(b, { type: 'sweep', dur: 5, y0: V.y }); }
          }],
          [L[2] + 5, b => { W.set('trnFall', 0, b.instant); pose('john', 'kneel'); }],
        ]);
      },
    },
    // ── 12 · 里外都写着字，用七印封严了：谁配展开？ ─────────────────
    {
      kind: 'act', utter: '里外都写着字，用七印封严了', cmd: 'seal 书卷 ×7 && ask 谁配展开', ref: '5:1', tint: [240, 220, 196],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => { W.set('trnBook', 1, b.instant); sfx(b, 'scroll'); visionFlash(b, BOOK_A[0], BOOK_A[1], 70); }],
          [2.2, b => sfx(b, 'seal')],
          [L[1] - 0.4, b => {
            const A = X('angel');
            add('angel', { label: '大力的天使', sex: 'm', angel: true, x: A[0], layer: 2, facing: 1, glow: 1, from: b.instant ? 'none' : 'light', pose: 'raise', scale: 1.3, prop: null });
            flySnap('angel', A[0], A[1]);
            sfx(b, 'trumpet');
          }],
          [L[1] + 1.4, () => pose('angel', 'point')],
          [L[2] - 0.2, b => { W.set('trnHush', 1, b.instant); pose('angel', 'stand'); }],
          [L[2] + 3, b => { pose('john', 'weep'); sfx(b, 'weep'); }],
        ]);
      },
    },
    // ── 13 · 犹大支派中的狮子，大卫的根，他已得胜：羔羊 ───────────────
    {
      kind: 'act', utter: '宝座与四活物，并长老之中有羔羊站立', cmd: 'reveal 羔羊 --in 宝座中 && take 书卷', ref: '5:6', tint: [255, 244, 222],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => { W.set('trnHush', 0, b.instant); pose('john', 'kneel'); sfx(b, 'lion', { soft: true, far: true }); }],
          [L[1] - 0.4, b => { W.set('trnLamb', 1, b.instant); sfx(b, 'bleat', { soft: true }); sfx(b, 'angel'); visionFlash(b, LAMB_AT[0], LAMB_AT[1] - 12 * lambK(), 120); }],
          [L[1] + 1.2, () => pose('john', 'gaze')],
          // 七角七眼，就是神的七灵：七盏火灯的火飞入羔羊
          [L[1] + 2.2, b => { W.set('trnSeven', 1, b.instant); sfx(b, 'fire', { soft: true }); }],
          [L[1] + 5.4, b => { W.set('trnRays', 1, b.instant); sfx(b, 'stars'); }],
          [L[2] - 0.3, b => { W.set('trnTake', 1, b.instant); sfx(b, 'scroll'); }],
          [L[2] + 3.6, () => pose('john', 'kneel')],
        ]);
      },
    },
    // ── 14 · 你配拿书卷，配揭开七印：新歌；众圣徒的祈祷；千千万万的天使 ──────
    {
      kind: 'bless', utter: '你配拿书卷，配揭开七印', cmd: 'sing --new 你配  # 千千万万', ref: '5:9', tint: [255, 236, 206],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => { W.set('trnFall', 1, b.instant); W.set('trnHarps', 1, b.instant); rm('angel'); pose('john', 'pray'); sfx(b, 'harp'); }],
          [1.4, b => prayers(b)],
          [L[1] - 0.3, b => { W.set('trnFall', 0, b.instant); sfx(b, 'sing'); }],
          [L[2] - 0.4, b => { W.set('trnHost', 1, b.instant); sfx(b, 'angel'); }],
          [L[2] + 3.4, b => sfx(b, 'sing')],
        ]);
      },
    },
    // ── 15 · 但愿颂赞、尊贵、荣耀、权势都归给坐宝座的和羔羊：阿们 ──────────
    {
      kind: 'bless', utter: '都归给坐宝座的和羔羊，直到永永远远！', cmd: 'broadcast 颂赞 --to 坐宝座的,羔羊 --forever  # 阿们', ref: '5:13', tint: [255, 240, 210],
      verse: V15,
      apply(c) {
        const L = starts(V15);
        T(c, [
          [0, b => {
            W.goTo(0.275, 15, b.instant);
            W.set('trnPraise', 1, b.instant);
            W.set('bloom', 0.95, b.instant); W.set('grass', 0.85, b.instant); W.set('herbs', 0.7, b.instant); W.set('bare', 0.12, b.instant);
            const port = tall(), lx = W.w * (port ? 0.62 : 0.5), ly = W.ridgeBaseY(2, lx);
            W.setPop('bird', 46, W.w * 0.62, W.h * 0.32, b.instant);
            W.setPop('fish', 130, W.w * 0.2, W.h * 0.8, b.instant);
            W.setPop('whale', 3, W.w * 0.15, W.h * 0.78, b.instant);
            W.setPop('cattle', 3, lx, ly, b.instant);
            W.setPop('beast', 4, lx, ly, b.instant);
            W.setPop('creeper', 18, lx, ly, b.instant);
            // 走兽散在开阔的坡上：约翰与那户人家的地方让开
            if (port) avoid([X('johnF') - 0.03, X('johnF') + 0.045], [X('house') - X('houseW') * 0.6, 1.02]);
            else avoid([X('johnF') - 0.02, X('house') + X('houseW') * 0.9]);
            if (!b.instant && GS.fx && GS.fx.ring) { const V = VG(), p = vp(V, 0, -56); GS.fx.ring(p[0], p[1], [255, 236, 200], Math.hypot(W.w, W.h) * 0.8, 4.5, 2.2); }
            sfx(b, 'sing');
          }],
          [2.6, b => { sfx(b, 'bird'); if (!b.instant) U.safe('breach', () => { const S0 = GS.sea; if (S0 && S0._whales && S0._setSt && S0._whales[0]) S0._setSt(S0._whales[0], 'breach', 3.4); }); }],
          [5.2, b => sfx(b, 'whale')],
          [L[1] - 0.3, b => {
            W.set('trnAmen', 1, b.instant); W.set('trnFall', 1, b.instant);
            pose('john', 'worship');
            if (!b.instant) {
              const [ax, ay, size] = amenAt();   // 竖屏：写在异象之下，不入顶上的经文
              chosenName('阿们', ax, ay, size, [255, 240, 206], () => { const q = vp(VG(), rand(-60, 60), -56 + rand(-40, 40)); return q; }, { hold: 4 });
              chime('阿');
            }
            sfx(b, 'bell');
          }],
          [L[1] + 2.6, b => sfx(b, 'harp')],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '宝座', sub: '启示录 1 — 5', tint: [236, 230, 255], music: 'ezekiel',
    outro: 24,
    intro: INTRO,
    // 全书终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '约翰': { text: '我约翰就是你们的弟兄，和你们在耶稣的患难、国度、忍耐里一同有分……曾在那名叫拔摩的海岛上。', ref: '启示录 1:9' },
      '拔摩': { text: '……为神的道，并为给耶稣作的见证，曾在那名叫拔摩的海岛上。', ref: '启示录 1:9' },
      '人子': { text: '灯台中间有一位好像人子，身穿长衣，直垂到脚，胸间束着金带。', ref: '启示录 1:13' },
      '金灯台': { text: '我转过身来，要看是谁发声与我说话；既转过来，就看见七个金灯台。', ref: '启示录 1:12' },
      '七星': { text: '论到你所看见、在我右手中的七星和七个金灯台的奥秘，那七星就是七个教会的使者，七灯台就是七个教会。', ref: '启示录 1:20' },
      '以弗所': { text: '然而有一件事我要责备你，就是你把起初的爱心离弃了。', ref: '启示录 2:4' },
      '士每拿': { text: '你务要至死忠心，我就赐给你那生命的冠冕。', ref: '启示录 2:10' },
      '别迦摩': { text: '得胜的，我必将那隐藏的吗哪赐给他，并赐他一块白石，石上写着新名……', ref: '启示录 2:17' },
      '推雅推喇': { text: '我又要把晨星赐给他。', ref: '启示录 2:28' },
      '撒狄': { text: '凡得胜的必这样穿白衣，我也必不从生命册上涂抹他的名……', ref: '启示录 3:5' },
      '非拉铁非': { text: '看哪，我在你面前给你一个敞开的门，是无人能关的。', ref: '启示录 3:8' },
      '老底嘉': { text: '凡我所疼爱的，我就责备管教他；所以你要发热心，也要悔改。', ref: '启示录 3:19' },
      '门': { text: '看哪，我站在门外叩门，若有听见我声音就开门的，我要进到他那里去，我与他，他与我一同坐席。', ref: '启示录 3:20' },
      '开门的人': { text: '若有听见我声音就开门的，我要进到他那里去，我与他，他与我一同坐席。', ref: '启示录 3:20' },
      '坐席': { text: '得胜的，我要赐他在我宝座上与我同坐，就如我得了胜，在我父的宝座上与他同坐一般。', ref: '启示录 3:21' },
      '天上的门': { text: '此后，我观看，见天上有门开了。', ref: '启示录 4:1' },
      '宝座': { text: '我立刻被圣灵感动，见有一个宝座安置在天上，又有一位坐在宝座上。', ref: '启示录 4:2' },
      '虹': { text: '看那坐着的，好像碧玉和红宝石；又有虹围着宝座，好像绿宝石。', ref: '启示录 4:3' },
      '长老': { text: '宝座的周围又有二十四个座位；其上坐着二十四位长老，身穿白衣，头上戴着金冠冕。', ref: '启示录 4:4' },
      '七盏火灯': { text: '又有七盏火灯在宝座前点着；这七灯就是神的七灵。', ref: '启示录 4:5' },
      '玻璃海': { text: '宝座前好像一个玻璃海，如同水晶。', ref: '启示录 4:6' },
      '活物': { text: '四活物各有六个翅膀，遍体内外都满了眼睛。他们昼夜不住地说：圣哉！圣哉！圣哉！', ref: '启示录 4:8' },
      '书卷': { text: '我看见坐宝座的右手中有书卷，里外都写着字，用七印封严了。', ref: '启示录 5:1' },
      '大力的天使': { text: '我又看见一位大力的天使大声宣传说：「有谁配展开那书卷，揭开那七印呢？」', ref: '启示录 5:2' },
      '羔羊': { text: '我又看见宝座与四活物，并长老之中有羔羊站立……有七角七眼，就是神的七灵，奉差遣往普天下去的。', ref: '启示录 5:6' },
      '千千万万的天使': { text: '我又看见且听见，宝座与活物并长老的周围有许多天使的声音；他们的数目有千千万万。', ref: '启示录 5:11' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._throne = { get S() { return S; }, VG, ELD, FXL, sprites };
})(window.GS);
