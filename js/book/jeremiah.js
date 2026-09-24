/* ─────────────────────────────────────────────────────────────
 * book/jeremiah.js —— 耶利米书 · 耶利米（耶利米书 1 — 52）
 *
 * 亚拿突的清晨，祭司的村庄：一个少年站在父家门前——「我未将你造在腹中，我已晓得你」，
 * 光自天而降，他跪下说「我是年幼的」，一点火光按在他的口上。
 * 门前的杏树枝一夜开满了花（「我留意保守我的话，使得成就」）；北方的山后，一个烧开的锅倾侧过来。
 * 耶路撒冷在中丘上：城墙、城楼、王宫，殿在最高处。城下有活水的泉源，一道溪水流入海里；
 * 百姓离弃它，去凿自己的池子——池子破裂，不能存水；泉源暗了，先知在雨中哭泣。
 * 「你起来，下到窑匠的家里去」：窑、架上的瓦器、转动的轮；器皿在他手中做坏了，他又另做别的器皿。
 * ★ 黄昏，天上一个光的转轮，一个光的器皿升起、塌下、又被重新做成——
 *   「泥在窑匠的手中怎样，你们在我的手中也怎样」（本卷的签名画面），光倾在城上。
 * 夜里，在长老眼前打碎瓦瓶；巴施户珥把他枷在门内；「似乎有烧着的火闭塞在我骨中」。
 * 冬夜，巴录照口述写成书卷；王坐在过冬的房屋里，火盆中有火，犹底念一篇，王就割一篇扔进火里；
 * 另取一卷，写得比前卷更多。第一批被掳的人往北方去了，远处显出巴比伦；一封信寄去：盖房、栽种、
 * 「我知道我向你们所怀的意念……要叫你们末后有指望」，一道金线连到远方的园子。
 * 巴比伦的军队四围安营、筑垒；首领把先知用绳子系下破裂的池子（正是那不能存水的池子），他陷在淤泥里；
 * 古实人以伯‧米勒用碎布与绳子把他拉上来。围城之中，他在护卫兵的院里用十七舍客勒买下亚拿突的地，
 * 地契封在瓦器里——那块地上显出将来的葡萄园与房屋：「岂有我难成的事吗？」
 * 城被攻破：火焚烧殿、王宫与房屋，城墙拆毁，百姓被掳；先知被释放，住在剩下的穷人中。
 * 深夜的废墟上，一道温柔的光：「我以永远的爱爱你」；拉玛的拉结哭她儿女，被安慰，远方有灯归来。
 * 黎明，归回的人随走随哭而来，活水重新流淌；神的律法写在他们心上（胸中一点金光）。
 * 日出，大海被搅动又平静；准绳往外量出，一座光的城在废墟上立起——「不再拔出，不再倾覆，直到永远」。
 *
 * 十四句话：都是神自己的话（1:5、1:12、2:13、18:2、18:6、19:10、36:2、29:11、33:3、32:27、39:16、31:3、31:33、31:38）。
 * 书分三段：1—25（召命、警告、窑匠、瓦瓶、枷与骨中的火）、26—45（书卷、书信、牢狱、买地、城陷、安慰与新约）、
 * 46—52（论巴比伦的话与城陷的记录：52:4、52:13–14、50:4–5，以及可凝视的 51:64）。
 *
 * 布景（自画）：近地——左是活水的溪与哈珥西门、窑匠的家（窑、架、轮），中是王的院（过冬的房屋、火盆、
 * 护卫兵院中的池子与牢狱的剖面），右是亚拿突（房屋、杏树、那块地）；中丘——耶路撒冷（城墙、城楼、王宫、殿）
 * 与围城的营、焚烧与废墟、光的城；远山——北方的锅、巴比伦与被掳之人的园子、营火、归回的灯；天上——光的转轮与器皿。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'jeremiah';
  const cur = () => GS.book.current(ACT);
  const safe = U.safe;
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const sm = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const lit = c => mix(c, [255, 244, 222], 0.42);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const fract = x => x - Math.floor(x);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    jrSpring: ['exp', 0.5],    // 活水的泉源与溪水的亮度
    jrCistern: ['exp', 0.6],   // 凿出的池子
    jrWater: ['exp', 0.5],     // 池子里的水
    jrCrack: ['lin', 0.3],     // 池子破裂
    jrAlmond: ['lin', 0.22],   // 杏树开花
    jrPot: ['exp', 0.5],       // 北方烧开的锅（异象）
    jrPotTilt: ['lin', 0.22],  // 锅倾侧
    jrWheel: ['exp', 1.2],     // 窑匠的轮转动
    jrForm: ['lin', 0.4],      // 轮上器皿的形：0 一团泥 · 1 器皿 · 2 做坏了 · 3 另做的器皿
    jrSign: ['exp', 0.45],     // 天上的转轮与器皿（签名画面）
    jrSForm: ['lin', 0.35],    // 天上器皿的形（同上）
    jrGlory: ['exp', 0.5],     // 天上器皿的光，倾在城上
    jrStocks: ['exp', 0.9],    // 枷
    jrBone: ['exp', 0.5],      // 骨中烧着的火
    jrCourt: ['exp', 0.5],     // 王的院：过冬的房屋与矮墙
    jrBrazier: ['exp', 0.8],   // 火盆中的火
    jrScroll1: ['lin', 0.22],  // 第一卷（写成 → 烧尽）
    jrScroll2: ['lin', 0.2],   // 另取的一卷
    jrBabylon: ['exp', 0.35],  // 远方的巴比伦
    jrGardens: ['lin', 0.14],  // 被掳的人所栽种的园子
    jrThread: ['exp', 0.4],    // 平安的意念：连到远方的金线
    jrSiege: ['exp', 0.4],     // 围城的营
    jrPit: ['exp', 0.8],       // 牢狱（池子）的剖面
    jrSink: ['lin', 0.28],     // 耶利米被系下去的深度
    jrMud: ['exp', 0.6],       // 淤泥
    jrRope: ['exp', 1.2],      // 绳子
    jrDeed: ['exp', 0.6],      // 封着地契的瓦器
    jrVision: ['exp', 0.4],    // 那块地上将来的葡萄园与房屋
    jrBreach: ['exp', 0.8],    // 城被攻破
    jrFire: ['exp', 0.45],     // 城中的火
    jrTFire: ['exp', 0.45],    // 殿中的火
    jrRuin: ['lin', 0.18],     // 废墟
    jrEmber: ['exp', 0.3],     // 余烬
    jrLove: ['exp', 0.35],     // 永远的爱：夜里落在废墟上的光
    jrHope: ['exp', 0.3],      // 远方归来的灯
    jrHeart: ['exp', 0.5],     // 写在心上
    jrLine: ['lin', 0.25],     // 准绳往外量出
    jrNew: ['lin', 0.12],      // 光的城
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const MY = Object.keys(LV);
  const lv = k => W.lv[k] || 0;

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    jer: 0.9, hilkiah: 0.94, almond: 0.876, houses: [0.918, 0.952, 0.986], field: [0.848, 0.998],
    spring: 0.664, shed: 0.588, potter: 0.604, gate: 0.506,
    court: [0.686, 0.862], pav: 0.722, king: 0.705, jehudi: 0.765, deed: 0.757,
    cis: [0.782, 0.818, 0.852], pit: 0.818,
    city: [0.565, 0.905], temple: 0.79, palace: 0.708, gates: [0.6, 0.87], breach: 0.64, hananel: 0.895,
    camp: [[0.503, 0.556], [0.914, 0.996]], babylon: 0.92,
  };
  const CIS_V = [0.12, 0.26, 0.16];
  // 活水的溪：自泉源（x, 纵深 v）蜿蜒流下，流入海里
  const BROOK = [[0.664, 0.03], [0.654, 0.1], [0.632, 0.17], [0.604, 0.23], [0.576, 0.3], [0.55, 0.36], [0.522, 0.42],
    [0.493, 0.5], [0.463, 0.58], [0.434, 0.66], [0.408, 0.75], [0.388, 0.86]];

  // ── 颜色 ────────────────────────────────────────────────────
  const STONE = [214, 196, 162], WALL = [198, 178, 142], TEMPLE = [230, 216, 186], GOLD = [238, 198, 104], BRONZE = [186, 134, 74];
  const SOOT = [56, 46, 42], HOLE = [50, 38, 32], MUD = [184, 152, 112], CLAY = [180, 120, 82], WOOD = [100, 76, 54], REED = [166, 142, 98];
  const BARK = [72, 56, 48], BLOSSOM = [255, 250, 246], PINK = [246, 188, 210], WATER = [128, 172, 208], TENT = [80, 64, 52], SOIL = [138, 110, 80];
  const BRICK = [178, 128, 90], PURPLE = [112, 58, 98], CEDAR = [120, 84, 56];
  const ROBE = {
    jer: [146, 118, 88], hilkiah: [216, 208, 188], potter: [150, 104, 74], pashhur: [224, 216, 196], baruch: [104, 110, 140],
    king: [132, 48, 72], jehudi: [120, 104, 86], elasah: [118, 100, 80], ebed: [58, 84, 140], hanamel: [134, 112, 80], rachel: [152, 98, 106],
  };
  const ELDERS = [[112, 98, 84], [126, 110, 92], [100, 94, 104], [138, 116, 90], [118, 102, 86]];
  const TINT = [236, 212, 176];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  function fresh() {
    return {
      jar: 'none',        // 瓦瓶：'none' | 'carry' | 'raise' | 'broken'
      scroll1: 'none',    // 第一卷在谁手里：'none' | 'baruch' | 'jehudi' | 'gone'
      letter: 'none',     // 书信：'none' | 'jer' | 'elasah' | 'sent'
      pit: false,         // 耶利米在牢狱里（系在绳上）
      // 以下只是观看时的装饰计时（瞬间重演 = 早已过去）
      callT: -1e9, touchT: -1e9, smashT: -1e9, burnT: -1e9, silverT: -1e9, heartT: -1e9,
    };
  }
  let S = fresh();

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const portrait = () => W.w < W.h * 0.8;
  const PK = () => (W.w < 600 ? 0.8 : 1);                                   // 手机上布景略小（人已被放大）
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * [1.1, 1.2, 1.3][l];   // 一个成人在该层的身高（像素）
  const HN = () => PH(2) * PK();                                           // 近地布景的尺度
  const DEP = [0.85, 0.45, 0];
  const M = () => Math.min(W.w, W.h);
  const UN = () => Math.max(0.5, W.unit);
  function gY(l, xf) {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  // 近地纵深里的一点：v 0 = 地的轮廓线，1 ≈ 画面底（与人物模块同一算法）
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const vk = v => 1 + 0.35 * v;
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP[l], a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => clamp(0.12 + 0.55 * W.dayFactor + 0.3 * W.dusk, 0, 0.85);
  const sunLeft = () => W.sun.x < W.w * 0.5;

  // 人物
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glowP(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function crowd(gid, o) { const c = C(); return c.crowd ? c.crowd(gid, o) : null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function crowdGlow(gid, v) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.glow = v; }); }
  function unCrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function members(gid) { const c = C(); if (!c.crowds || !c.crowds.get) return []; const g = c.crowds.get(gid); return g ? g.members.filter(m => !m.dying) : []; }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) safe('jeremiah.sfx', () => a.sfx(name, o || {}));
  }
  const avoid = (...rs) => { W.beastAvoid = rs; };
  // 经文行的开始时刻（秒）：与经文模块同一节奏（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.attach && f._ax != null ? f._ax : f.nx * W.w;
    const g = gY(l, f.nx), fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.attach && f._ay != null ? f._ay : g + (f.v || 0) * fh * 0.8;
    return [x, y - PH(l) * frac];
  }
  // 夜里，长老中有两人举着火把
  function elderTorches() { const m = members('jr:elders'); [0, 3].forEach(i => { if (m[i]) m[i].prop = 'torch'; }); }
  function spiritRing(c) { if (!c.instant) safe('jeremiah.ring', () => fx().ring(c.x, c.y, TINT, M() * 0.26, 1.8, 1.5)); }

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
    SP = {
      warm: radial([255, 170, 86], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      fire: radial([255, 132, 52], 1, 0.3), ember: radial([255, 90, 40], 1, 0.4), smoke: radial([120, 112, 108], 0.75, 0.55),
      pale: radial([220, 236, 255], 1), red: radial([220, 70, 40], 1, 0.45), soot: radial([40, 34, 32], 0.8, 0.5),
    };
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,240,206,0)'); hz.addColorStop(0.5, 'rgba(255,246,224,1)'); hz.addColorStop(1, 'rgba(255,240,206,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 一道光芒（自左端向右渐淡的细长三角）
    const rc = cnv(256, 32), rg = rc.getContext('2d');
    const lg = rg.createLinearGradient(0, 0, 256, 0);
    lg.addColorStop(0, 'rgba(255,236,190,1)'); lg.addColorStop(1, 'rgba(255,236,190,0)');
    rg.fillStyle = lg;
    rg.beginPath(); rg.moveTo(0, 14); rg.lineTo(256, 0); rg.lineTo(256, 32); rg.lineTo(0, 18); rg.closePath(); rg.fill();
    SP.ray = rc;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function add1(ctx) { ctx.globalCompositeOperation = 'lighter'; }
  function norm(ctx) { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }

  // 火舌：三层（外红、中橙、心白），随时间摇曳
  function flame(ctx, x, y, h, a, seed) {
    if (a < 0.01 || !(h > 0.5)) return;
    const t = W.t, fl = 0.82 + 0.18 * Math.sin(t * 8.3 + seed * 3.1) * Math.sin(t * 5.1 + seed);
    const hh = h * fl, w = h * 0.32, sway = Math.sin(t * 5.7 + seed * 2.3) * w * 0.6;
    const L = [[1, [255, 96, 36], 0.55], [0.72, [255, 160, 60], 0.7], [0.42, [255, 236, 170], 0.85]];
    for (const q of L) {
      const s = q[0], ww = w * s, h2 = hh * s;
      ctx.globalAlpha = a * q[2];
      ctx.fillStyle = U.rgb(q[1][0], q[1][1], q[1][2]);
      ctx.beginPath();
      ctx.moveTo(x - ww, y);
      ctx.quadraticCurveTo(x - ww * 1.05, y - h2 * 0.55, x + sway * s, y - h2);
      ctx.quadraticCurveTo(x + ww * 1.05, y - h2 * 0.55, x + ww, y);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // 升起的烟：一串随时间上升、变大、变淡的烟团
  function smoke(ctx, x, y, a, H, r0, seed, n, drift) {
    if (a < 0.01) return;
    SP || sprites();
    n = n || 7;
    for (let i = 0; i < n; i++) {
      const ph = fract(W.t * 0.05 + i / n + seed * 0.37);
      const px = x + (drift || 0.25) * H * ph + Math.sin(ph * 5 + seed + i) * r0 * 0.6;
      const py = y - ph * H;
      const r = r0 * (1 + ph * 2.4);
      glowSp(ctx, SP.smoke, px, py, r, a * Math.sin(ph * Math.PI) * 0.9);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  器皿的形（窑匠轮上的，与天上的）：t 0 底 → 1 口；左右半宽 wl / wr（以高为 1），总高 H，歪斜 lean
  // ════════════════════════════════════════════════════════════
  function crSpline(knots) {
    return t => {
      let i = 0;
      while (i < knots.length - 2 && knots[i + 1][0] < t) i++;
      const p0 = knots[Math.max(0, i - 1)], p1 = knots[i], p2 = knots[i + 1], p3 = knots[Math.min(knots.length - 1, i + 2)];
      const u = c01((t - p1[0]) / Math.max(1e-6, p2[0] - p1[0])), u2 = u * u, u3 = u2 * u;
      return 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3);
    };
  }
  const NK = 24;
  const FORMS = (function () {
    const lump = t => 0.5 * Math.sqrt(Math.max(0, 1 - t * t)) + 0.06;
    const jar = crSpline([[0, 0.25], [0.1, 0.36], [0.35, 0.47], [0.6, 0.4], [0.78, 0.21], [0.9, 0.2], [1, 0.27]]);
    const mL = crSpline([[0, 0.36], [0.25, 0.5], [0.5, 0.45], [0.75, 0.31], [1, 0.16]]);
    const mR = crSpline([[0, 0.34], [0.3, 0.4], [0.55, 0.25], [0.8, 0.19], [1, 0.1]]);
    const amph = crSpline([[0, 0.19], [0.08, 0.27], [0.3, 0.41], [0.48, 0.43], [0.66, 0.3], [0.8, 0.15], [0.9, 0.14], [1, 0.24]]);
    const defs = [
      { H: 0.32, l: lump, r: lump, n: () => 0 },
      { H: 1.0, l: jar, r: jar, n: () => 0 },
      { H: 0.56, l: mL, r: mR, n: t => 0.3 * t * t },
      { H: 1.16, l: amph, r: amph, n: () => 0 },
    ];
    return defs.map(d => {
      const o = { H: d.H, wl: new Float32Array(NK + 1), wr: new Float32Array(NK + 1), ln: new Float32Array(NK + 1) };
      for (let k = 0; k <= NK; k++) { const t = k / NK; o.wl[k] = Math.max(0.02, d.l(t)); o.wr[k] = Math.max(0.02, d.r(t)); o.ln[k] = d.n(t); }
      return o;
    });
  })();
  const PROF = { H: 1, wl: new Float32Array(NK + 1), wr: new Float32Array(NK + 1), ln: new Float32Array(NK + 1) };
  function profile(f) {
    f = clamp(f, 0, 3);
    const i = Math.min(2, Math.floor(f)), s = sm(0, 1, f - i), A = FORMS[i], B = FORMS[i + 1];
    PROF.H = lerp(A.H, B.H, s);
    for (let k = 0; k <= NK; k++) { PROF.wl[k] = lerp(A.wl[k], B.wl[k], s); PROF.wr[k] = lerp(A.wr[k], B.wr[k], s); PROF.ln[k] = lerp(A.ln[k], B.ln[k], s); }
    return PROF;
  }
  function vesselPath(cx, base, S, P) {
    const p = new Path2D();
    for (let k = 0; k <= NK; k++) { const t = k / NK, y = base - t * P.H * S, x = cx + (P.ln[k] - P.wl[k]) * S; if (k === 0) p.moveTo(x, y); else p.lineTo(x, y); }
    for (let k = NK; k >= 0; k--) { const t = k / NK, y = base - t * P.H * S, x = cx + (P.ln[k] + P.wr[k]) * S; p.lineTo(x, y); }
    p.closePath();
    return p;
  }
  // 一只小瓦器（瓦瓶、封契的瓦器、架上的器皿）
  const FLASK = crSpline([[0, 0.22], [0.2, 0.42], [0.45, 0.42], [0.66, 0.2], [0.86, 0.1], [1, 0.14]]);
  const POT = crSpline([[0, 0.28], [0.2, 0.44], [0.5, 0.46], [0.8, 0.32], [0.92, 0.26], [1, 0.3]]);
  function jarPath(ctx, cx, base, s, shape, rot) {
    const f = shape || POT, n = 10, cs = Math.cos(rot || 0), sn = Math.sin(rot || 0);
    const P = (dx, dy) => [cx + dx * cs - dy * sn, base + dx * sn + dy * cs];
    let q = P(-f(0) * s, 0); ctx.moveTo(q[0], q[1]);
    for (let k = 1; k <= n; k++) { const t = k / n; q = P(-f(t) * s, -t * s); ctx.lineTo(q[0], q[1]); }
    for (let k = n; k >= 0; k--) { const t = k / n; q = P(f(t) * s, -t * s); ctx.lineTo(q[0], q[1]); }
    ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  静态的布局（以确定的随机数生成；尺寸以人的身高为单位）
  // ════════════════════════════════════════════════════════════
  // 耶路撒冷的房屋：后排（高处）与前排
  const CITY = (function () {
    const r = U.mulberry32(2452), H = [];
    for (let row = 0; row < 2; row++) {
      let x = 0.571 + r() * 0.006;
      while (x < 0.9) {
        const wk = 0.8 + r() * 0.8;
        const inTemple = x > 0.752 && x < 0.83, inPalace = x > 0.688 && x < 0.73;
        if (!(inTemple || (inPalace && row === 1))) {
          H.push({ xf: x, wk, hk: (row ? 0.95 : 1.3) + r() * (row ? 0.5 : 0.7), row, door: r() < 0.45, win: r() < 0.8, dx: r(), ruin: r(), dome: r() < 0.1 });
        }
        x += 0.013 + r() * 0.011;
      }
    }
    return H;
  })();
  const TOWERS = [0.567, 0.62, 0.68, 0.74, 0.84, X.hananel];
  // 火的位置（城中、王宫）
  const FIRES = (function () { const r = U.mulberry32(77), a = []; for (let i = 0; i < 12; i++) a.push({ xf: 0.58 + 0.31 * (i + r() * 0.8) / 12, h: 0.8 + r() * 0.9, s: r() * 9 }); return a; })();
  const EMBERS = (function () { const r = U.mulberry32(78), a = []; for (let i = 0; i < 34; i++) a.push({ xf: 0.57 + r() * 0.33, dy: r() * 0.9, s: r() * 9, k: 0.5 + r() * 0.5 }); return a; })();
  // 围城的营：帐棚、兵、营火
  const CAMP = (function () {
    const r = U.mulberry32(3131), out = [];
    for (let s = 0; s < 2; s++) for (let i = 0; i < 6; i++) out.push({ s, u: (i + 0.2 + r() * 0.6) / 6, wk: 0.9 + r() * 0.5, hk: 0.6 + r() * 0.25, fire: r() < 0.6, men: 1 + Math.floor(r() * 3), ph: r() * 9 });
    return out;
  })();
  const FAR_FIRES = (function () { const r = U.mulberry32(99), a = []; for (let i = 0; i < 30; i++) a.push({ xf: 0.52 + r() * 0.47, ph: r() * 9 }); return a; })();
  // 杏树：分枝与花（以树高为 1）
  const ALMOND = (function () {
    const r = U.mulberry32(1111), segs = [], bl = [];
    function br(x, y, a, len, w, d) {
      const x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
      segs.push([x, y, x2, y2, w, d]);
      if (d >= 4 || len < 0.05) { bl.push({ x: x2, y: y2 }); return; }
      const n = d < 1 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const na = a + (i - (n - 1) / 2) * (0.55 + r() * 0.35) + (r() - 0.5) * 0.3;
        br(x2, y2, na, len * (0.66 + r() * 0.14), w * 0.64, d + 1);
      }
    }
    br(0, 0, 0.06, 0.4, 0.07, 0);
    for (const s of segs) if (s[5] >= 2) {
      const n = s[5] >= 3 ? 3 : 1;
      for (let i = 0; i < n; i++) { const t = 0.25 + r() * 0.75; bl.push({ x: lerp(s[0], s[2], t) + (r() - 0.5) * 0.05, y: lerp(s[1], s[3], t) + (r() - 0.5) * 0.05 }); }
    }
    let mx = 0;
    bl.forEach(b => { b.c = r(); b.s = 0.6 + r() * 0.7; b.o = Math.hypot(b.x, b.y) + r() * 0.2; mx = Math.max(mx, b.o); });
    bl.forEach(b => { b.o /= mx; });
    let top = 0; segs.forEach(s => { top = Math.min(top, s[3]); });
    return { segs, bl, top };
  })();
  // 巴比伦（远山上）：塔庙、城墙、房屋（以远山人的身高为单位）
  const BABEL = (function () {
    const r = U.mulberry32(515), a = [];
    for (let i = 0; i < 12; i++) a.push({ dx: -3.4 + 6.8 * (i + r() * 0.7) / 12, w: 0.5 + r() * 0.6, h: 0.6 + r() * 0.9, lamp: r() < 0.7, ph: r() * 9 });
    const gd = [];
    for (let i = 0; i < 16; i++) gd.push({ dx: -5.6 + 11.2 * r(), s: 0.3 + r() * 0.4, lamp: r() < 0.4, ph: r() * 9 });
    return { houses: a, gardens: gd };
  })();
  // 亚拿突的地：几道垄沟（纵深 v）
  const FURROWS = [0.34, 0.45, 0.56, 0.67, 0.78, 0.89];
  // 碎片
  const SHARDS = (function () { const r = U.mulberry32(191), a = []; for (let i = 0; i < 13; i++) a.push({ vx: (r() - 0.5) * 3.2, vy: -1.2 - r() * 1.8, rot: r() * 6, sp: (r() - 0.5) * 16, s: 0.35 + r() * 0.5, rest: (r() - 0.5) * 1.3, rv: r() * 0.18 }); return a; })();

  // ════════════════════════════════════════════════════════════
  //  画：天上
  // ════════════════════════════════════════════════════════════
  // 北方烧开的锅（1:13）：北方的山上，一个铜锅坐在火上，锅口向南倾侧，红的烟气漫过来
  function potGeo() {
    const PS = Math.max(W.w * 0.085, M() * 0.13);
    const xf = portrait() ? 0.8 : 0.885;
    return { x: xf * W.w, y: gY(0, xf) - PS * 0.42, PS };
  }
  function drawPot(ctx) {
    const k = lv('jrPot');
    if (k < 0.01) return;
    sprites();
    const G = potGeo(), PS = G.PS, tilt = sm(0, 1, lv('jrPotTilt')), ang = -0.5 * tilt;
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7.3) * Math.sin(W.t * 4.1);
    // 异象的红光
    add1(ctx);
    glowSp(ctx, SP.red, G.x, G.y - PS * 0.1, PS * 1.9, 0.3 * k);
    glowSp(ctx, SP.fire, G.x, G.y + PS * 0.2, PS * 0.8, 0.45 * k * fl);
    norm(ctx);
    // 锅下的火
    add1(ctx);
    for (let i = 0; i < 5; i++) flame(ctx, G.x + (i - 2) * PS * 0.13, G.y + PS * 0.36, PS * (0.26 + 0.12 * hsh(i + 3)), 0.9 * k, 60 + i);
    norm(ctx);
    ctx.save();
    ctx.translate(G.x, G.y + PS * 0.3);
    ctx.rotate(ang);
    ctx.translate(0, -PS * 0.3);
    const rw = PS * 0.5, rh = PS * 0.12;
    ctx.globalAlpha = 0.95 * k;
    // 三足
    ctx.fillStyle = css([54, 40, 32], 1, 1);
    for (const dx of [-0.32, 0, 0.32]) ctx.fillRect(dx * PS - PS * 0.025, PS * 0.18, PS * 0.05, PS * 0.14);
    // 锅身：圆腹，火光照在下沿
    const body = new Path2D();
    body.moveTo(-rw, 0);
    body.bezierCurveTo(-rw * 1.12, PS * 0.3, -rw * 0.55, PS * 0.36, 0, PS * 0.36);
    body.bezierCurveTo(rw * 0.55, PS * 0.36, rw * 1.12, PS * 0.3, rw, 0);
    body.closePath();
    const bg = ctx.createLinearGradient(0, 0, 0, PS * 0.36);
    bg.addColorStop(0, css([92, 66, 48], 1, 1)); bg.addColorStop(0.7, css([70, 50, 38], 1, 1)); bg.addColorStop(1, U.rgba(190, 96, 50, 1));
    ctx.fillStyle = bg;
    ctx.fill(body);
    ctx.strokeStyle = U.rgba(255, 170, 100, 0.55 * fl);
    ctx.lineWidth = Math.max(1, PS * 0.018);
    ctx.stroke(body);
    // 两耳
    ctx.strokeStyle = css([80, 58, 42], 1, 1);
    ctx.lineWidth = Math.max(1.2, PS * 0.03);
    ctx.beginPath(); ctx.arc(-rw * 1.02, PS * 0.07, PS * 0.07, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(rw * 1.02, PS * 0.07, PS * 0.07, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
    // 锅口：烧开的水面（倾侧时看得更多）
    const mh = rh * (0.9 + 1.6 * tilt);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
    gr.addColorStop(0, 'rgba(255,220,150,1)'); gr.addColorStop(0.55, 'rgba(244,120,56,1)'); gr.addColorStop(1, 'rgba(160,44,26,1)');
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.ellipse(0, 0, rw, mh, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([110, 80, 58], 1, 1);
    ctx.lineWidth = Math.max(1.2, PS * 0.035);
    ctx.stroke();
    add1(ctx);
    ctx.fillStyle = 'rgba(255,240,200,0.85)';
    for (let i = 0; i < 8; i++) {
      const ph = fract(W.t * 0.9 + hsh(i) * 3), bx = (hsh(i + 20) - 0.5) * rw * 1.4, br = PS * 0.028 * Math.sin(ph * Math.PI);
      if (br > 0.3) { ctx.globalAlpha = k * 0.75; ctx.beginPath(); ctx.arc(bx, (hsh(i + 40) - 0.5) * mh * 0.9, br, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
    norm(ctx);
    // 自锅口倾出的烟气：向南（向左）漫过群山
    const mx = G.x - Math.cos(ang) * rw * 0.95, my = G.y + Math.sin(ang) * rw * 0.95;
    for (let i = 0; i < 10; i++) {
      const ph = fract(W.t * 0.055 + i / 10);
      const spill = 0.3 + 0.7 * tilt;
      const px = mx - ph * PS * 3.4 * spill + Math.sin(ph * 6 + i) * PS * 0.1;
      const py = my - PS * 0.35 * (1 - ph) * (1 - tilt * 0.6) + ph * ph * PS * 1.0 * tilt;
      glowSp(ctx, SP.smoke, px, py, PS * (0.22 + ph * 0.7), k * 0.6 * Math.sin(ph * Math.PI));
    }
    add1(ctx);
    for (let i = 0; i < 6; i++) {
      const ph = fract(W.t * 0.05 + i / 6 + 0.1);
      glowSp(ctx, SP.red, mx - ph * PS * 2.8 * tilt, my + ph * ph * PS * 0.9 * tilt, PS * (0.28 + ph * 0.6), k * tilt * 0.3 * Math.sin(ph * Math.PI));
    }
    norm(ctx);
  }

  // ★ 天上的转轮与器皿（18:1–6）
  function signGeo() {
    if (portrait()) { const S = Math.min(W.h * 0.2, W.w * 0.36); return { S, cx: W.w * 0.62, base: W.h * 0.54 }; }
    const S = Math.min(W.h * 0.3, W.w * 0.21);
    return { S, cx: W.w * 0.705, base: W.h * 0.47 };
  }
  function drawSign(ctx) {
    const k = lv('jrSign');
    if (k < 0.01) return;
    sprites();
    const G = signGeo(), S = G.S * (0.9 + 0.1 * k), f = lv('jrSForm'), gl = lv('jrGlory');
    const P = profile(f), marred = clamp(1 - Math.abs(f - 2), 0, 1), made = sm(2.2, 3, f);
    const cx = G.cx, base = G.base, top = base - P.H * S;
    const spin = W.t * (1.6 + 0.8 * (1 - marred));
    add1(ctx);
    // 背后的光
    glowSp(ctx, SP.gold, cx, base - P.H * S * 0.5, S * (1.0 + 0.5 * gl), k * (0.28 + 0.3 * gl + 0.12 * made) * (1 - 0.45 * marred));
    glowSp(ctx, SP.white, cx, base - P.H * S * 0.55, S * 0.55, k * 0.18 * (1 + gl) * (1 - 0.6 * marred));
    // 转轮：一轮光的圆盘
    const rx = S * 0.72, ry = S * 0.1;
    ctx.globalAlpha = k * 0.18;
    ctx.fillStyle = 'rgb(255,214,150)';
    ctx.beginPath(); ctx.ellipse(cx, base + ry * 0.2, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = k * 0.65;
    ctx.strokeStyle = 'rgb(255,226,170)';
    ctx.lineWidth = Math.max(1, S * 0.008);
    ctx.beginPath(); ctx.ellipse(cx, base + ry * 0.2, rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.setLineDash([S * 0.07, S * 0.05]);
    ctx.lineDashOffset = -spin * S * 0.12;
    ctx.lineWidth = Math.max(1.2, S * 0.014);
    ctx.globalAlpha = k * 0.55;
    ctx.beginPath(); ctx.ellipse(cx, base + ry * 0.2, rx * 0.86, ry * 0.8, 0, 0, TAU); ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    // 器皿的身：由底的琥珀到口的淡金；做坏时暗红
    const path = vesselPath(cx, base, S, P);
    const gr = ctx.createLinearGradient(0, base, 0, top);
    const warm = mix([255, 176, 96], [200, 96, 64], marred), mid = mix([255, 222, 164], [210, 130, 90], marred);
    const a0 = k * (0.46 + 0.22 * gl);
    gr.addColorStop(0, U.rgba(warm[0], warm[1], warm[2], a0));
    gr.addColorStop(0.55, U.rgba(mid[0], mid[1], mid[2], a0 * 0.85));
    gr.addColorStop(1, U.rgba(255, 246, 224, a0 * 0.7));
    ctx.globalAlpha = 1;
    ctx.fillStyle = gr;
    ctx.fill(path);
    // 旋转：经线从一边转到另一边；拉坯的环纹缓缓上升
    ctx.save();
    ctx.clip(path);
    ctx.lineWidth = Math.max(1, S * 0.006);
    for (let m = 0; m < 4; m++) {
      const an = spin + m * TAU / 4, c = Math.cos(an), s = Math.sin(an);
      if (c <= 0.05) continue;
      ctx.globalAlpha = k * 0.16 * c * (1 - 0.5 * marred);
      ctx.strokeStyle = 'rgb(255,244,220)';
      ctx.beginPath();
      for (let j = 0; j <= NK; j++) {
        const t = j / NK, y = base - t * P.H * S, w = (P.wl[j] + P.wr[j]) * 0.5, x = cx + (P.ln[j] + (P.wr[j] - P.wl[j]) * 0.5 + s * w) * S;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let j = 0; j < 7; j++) {
      const t = fract(j / 7 + W.t * 0.035), jj = Math.round(t * NK);
      const y = base - t * P.H * S, w = (P.wl[jj] + P.wr[jj]) * 0.5 * S, x0 = cx + (P.ln[jj] + (P.wr[jj] - P.wl[jj]) * 0.5) * S;
      ctx.globalAlpha = k * 0.28 * Math.sin(t * Math.PI);
      ctx.strokeStyle = 'rgb(255,236,200)';
      ctx.beginPath(); ctx.ellipse(x0, y, w, w * 0.12, 0, 0, Math.PI); ctx.stroke();
    }
    ctx.restore();
    // 口：一圈椭圆，里面略暗
    const lipW = (P.wl[NK] + P.wr[NK]) * 0.5 * S, lipX = cx + (P.ln[NK] + (P.wr[NK] - P.wl[NK]) * 0.5) * S;
    ctx.globalAlpha = k * 0.5;
    ctx.fillStyle = marred > 0.5 ? 'rgba(150,70,50,0.5)' : 'rgba(170,110,60,0.45)';
    ctx.beginPath(); ctx.ellipse(lipX, top, lipW, lipW * 0.16, 0, 0, TAU); ctx.fill();
    // 荣光：自器皿发出的光芒（慢慢旋转）
    if (gl > 0.02) {
      add1(ctx);
      const ry0 = base - P.H * S * 0.5;
      ctx.globalAlpha = 0.15 * gl * k;
      for (let i = 0; i < 14; i++) {
        const an = i * TAU / 14 + W.t * 0.04, len = S * (0.9 + 0.45 * hsh(i));
        ctx.save(); ctx.translate(cx, ry0); ctx.rotate(an);
        ctx.drawImage(SP.ray, 0, -S * 0.15, len, S * 0.3);
        ctx.restore();
      }
      glowSp(ctx, SP.white, cx, ry0, S * 0.6, 0.2 * gl * k);
    }
    // 轮廓光
    add1(ctx);
    ctx.globalAlpha = k * (0.55 + 0.35 * gl) * (1 - 0.35 * marred);
    ctx.strokeStyle = marred > 0.5 ? 'rgb(255,170,120)' : 'rgb(255,242,214)';
    ctx.lineWidth = Math.max(1, S * 0.009);
    ctx.stroke(path);
    ctx.beginPath(); ctx.ellipse(lipX, top, lipW, lipW * 0.16, 0, 0, TAU); ctx.stroke();
    // 口上的光
    glowSp(ctx, SP.white, cx + P.ln[NK] * S, top, S * 0.16 * (1 + gl), k * (0.3 + 0.5 * gl) * (1 - marred));
    // 盘旋的微光
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < 36; i++) {
      const an = W.t * (0.35 + 0.25 * hsh(i)) + i * 2.4, rr = S * (0.5 + 0.35 * hsh(i + 3));
      const y = base - P.H * S * (0.1 + 0.95 * hsh(i + 7)) - Math.sin(W.t * 0.3 + i) * S * 0.04;
      const x = cx + Math.cos(an) * rr, front = 0.5 + 0.5 * Math.sin(an);
      ctx.globalAlpha = k * (0.25 + 0.55 * front) * (0.6 + 0.4 * Math.sin(W.t * 3 + i));
      const z = Math.max(0.8, S * 0.006 * (0.6 + front));
      ctx.fillRect(x - z, y - z, z * 2, z * 2);
    }
    norm(ctx);
  }
  // 器皿的光倾在城上（air 层）
  function drawPour(ctx) {
    const k = lv('jrSign') * lv('jrGlory');
    if (k < 0.01) return;
    const G = signGeo(), S = G.S;
    const x0 = G.cx, y0 = G.base + S * 0.05;
    const c0 = X.city[0] * W.w, c1 = X.city[1] * W.w, yb = gY(1, X.temple) + PH(1) * 0.4;
    add1(ctx);
    const gr = ctx.createLinearGradient(0, y0, 0, yb);
    gr.addColorStop(0, U.rgba(255, 232, 180, 0.2 * k));
    gr.addColorStop(1, U.rgba(255, 220, 160, 0.05 * k));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x0 - S * 0.3, y0); ctx.lineTo(x0 + S * 0.3, y0); ctx.lineTo(c1, yb); ctx.lineTo(c0, yb); ctx.closePath();
    ctx.fill();
    // 落下的光点
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 26; i++) {
      const ph = fract(W.t * 0.12 + hsh(i) * 5), u = hsh(i + 11);
      const x = lerp(lerp(x0 - S * 0.3, x0 + S * 0.3, u), lerp(c0, c1, u), ph), y = lerp(y0, yb, ph);
      ctx.globalAlpha = k * 0.7 * Math.sin(ph * Math.PI);
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    norm(ctx);
  }
  // 焚城时天边的红光
  function drawBurnSky(ctx) {
    const k = Math.max(lv('jrFire'), lv('jrTFire') * 0.8);
    if (k < 0.01) return;
    const cx = W.w * 0.74, cy = W.horizonY;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W.w * 0.55);
    const f = 0.85 + 0.15 * Math.sin(W.t * 3.1) * Math.sin(W.t * 1.7);
    g.addColorStop(0, U.rgba(255, 110, 50, 0.42 * k * f)); g.addColorStop(0.45, U.rgba(180, 58, 30, 0.16 * k)); g.addColorStop(1, 'rgba(110,30,20,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W.w, cy + 8);
  }

  // ════════════════════════════════════════════════════════════
  //  画：远山——巴比伦、园子、营火、归来的灯、倾出的烟
  // ════════════════════════════════════════════════════════════
  function drawFar(ctx) {
    const hf = PH(0), un = UN();
    sprites();
    // 巴比伦
    const kb = lv('jrBabylon');
    if (kb > 0.01) {
      const x = X.babylon * W.w, g = gY(0, X.babylon) + 1;
      ctx.globalAlpha = kb;
      ctx.fillStyle = css(BRICK, 0, 1);
      ctx.beginPath();
      // 塔庙：四层
      for (let i = 0; i < 4; i++) { const w = hf * (2.4 - i * 0.5), h = hf * 0.75; ctx.rect(x - w / 2, g - h * (i + 1), w, h + 1); }
      ctx.rect(x - hf * 0.18, g - hf * 3.3, hf * 0.36, hf * 0.3);
      for (const h of BABEL.houses) ctx.rect(x + h.dx * hf - h.w * hf / 2, g - h.h * hf, h.w * hf, h.h * hf + 1);
      ctx.rect(x - hf * 3.8, g - hf * 0.55, hf * 7.6, hf * 0.56);
      ctx.fill();
      // 园子
      const kg = lv('jrGardens');
      if (kg > 0.01) {
        ctx.fillStyle = css([74, 112, 62], 0, 1);
        ctx.beginPath();
        for (const q of BABEL.gardens) {
          const r = q.s * hf * 0.7 * sm(0, 1, kg * 1.4 - Math.abs(q.dx) / 8);
          if (r < 0.3) continue;
          const px = x + q.dx * hf, py = g - r * 0.6;
          ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, TAU);
        }
        ctx.fill();
      }
      // 灯火
      const nk = nightK();
      if (nk > 0.05) {
        add1(ctx);
        for (const h of BABEL.houses) if (h.lamp) glowSp(ctx, SP.warm, x + h.dx * hf, g - h.h * hf * 0.5, hf * 0.5, kb * nk * (0.6 + 0.4 * Math.sin(W.t * 2 + h.ph)));
        if (kg > 0.3) for (const q of BABEL.gardens) if (q.lamp) glowSp(ctx, SP.warm, x + q.dx * hf, g - hf * 0.3, hf * 0.4, kg * nk * 0.8);
        norm(ctx);
      }
      ctx.globalAlpha = 1;
    }
    // 围城：远山上的营火
    const ks = lv('jrSiege');
    if (ks > 0.01) {
      add1(ctx);
      const nk = 0.35 + 0.65 * nightK();
      for (const f of FAR_FIRES) {
        const x = f.xf * W.w, g = gY(0, f.xf) - 1, fl = 0.7 + 0.3 * Math.sin(W.t * 6 + f.ph);
        glowSp(ctx, SP.warm, x, g, 7 * un, ks * nk * fl * 0.8);
        ctx.globalAlpha = ks * nk * fl;
        ctx.fillStyle = 'rgb(255,190,110)';
        ctx.fillRect(x - 0.7 * un, g - 1.4 * un, 1.4 * un, 1.4 * un);
      }
      norm(ctx);
    }
    // 归来的灯（31:16–17）：自北方远处缓缓移来
    const kh = lv('jrHope');
    if (kh > 0.01) {
      add1(ctx);
      for (let i = 0; i < 14; i++) {
        const u = fract(i / 14 + W.t * 0.006);
        const xf = 0.995 - u * 0.2, x = xf * W.w, g = gY(0, xf) - 2 * un;
        const a = kh * Math.sin(u * Math.PI) * (0.7 + 0.3 * Math.sin(W.t * 4 + i));
        glowSp(ctx, SP.gold, x, g, 6 * un, a);
        ctx.globalAlpha = a;
        ctx.fillStyle = 'rgb(255,236,190)';
        ctx.fillRect(x - 0.8 * un, g - 0.8 * un, 1.6 * un, 1.6 * un);
      }
      norm(ctx);
    }
    // 锅中倾出的红烟漫过群山
    const kp = lv('jrPot') * sm(0, 1, lv('jrPotTilt'));
    if (kp > 0.01) {
      const G = potGeo();
      for (let i = 0; i < 6; i++) {
        const ph = fract(W.t * 0.04 + i / 6);
        const x = G.x - G.PS * (0.6 + ph * 3.6), y = gY(0, clamp(x / W.w, 0, 1)) - G.PS * 0.15 + ph * G.PS * 0.5;
        glowSp(ctx, SP.smoke, x, y, G.PS * (0.5 + ph * 0.8), kp * 0.5 * Math.sin(ph * Math.PI));
      }
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：中丘——耶路撒冷
  // ════════════════════════════════════════════════════════════
  function templeGeo() {
    const hm = PH(1), x = X.temple * W.w, g = gY(1, X.temple);
    const pw = hm * 4.6, ph = hm * 1.05, top = g - ph;
    return { x, g, hm, pw, ph, top };
  }
  function houseRects(row, ruin, full) {
    const hm = PH(1), un = UN(), R = [];
    for (const hs of CITY) {
      if (hs.row !== row) continue;
      const x = hs.xf * W.w, w = hs.wk * hm, g = gY(1, hs.xf) + (row ? 0.05 : -0.2) * hm;
      const h = hs.hk * hm * (full ? 1 : 1 - ruin * (0.35 + 0.5 * hs.ruin));
      if (h < 0.5) continue;
      R.push([x - w / 2, g - h, w, h + 3 * un, hs]);
    }
    return R;
  }
  function drawHouses(ctx, row, ruin, soot) {
    const hm = PH(1), un = UN(), R = houseRects(row, ruin, false);
    if (!R.length) return R;
    const base = mix(STONE, SOOT, soot);
    ctx.fillStyle = css(base, 1);
    ctx.beginPath();
    for (const q of R) {
      if (ruin > 0.15) {
        const n = 4, jag = q[3] * 0.28 * ruin;
        ctx.moveTo(q[0], q[1] + q[3]);
        for (let i = 0; i <= n; i++) ctx.lineTo(q[0] + q[2] * i / n, q[1] + jag * hsh(q[4].xf * 999 + i));
        ctx.lineTo(q[0] + q[2], q[1] + q[3]);
        ctx.closePath();
      } else ctx.rect(q[0], q[1], q[2], q[3]);
    }
    ctx.fill();
    // 背光的一面
    const sl = sunLeft();
    ctx.fillStyle = css(dim(base, 0.8), 1);
    ctx.beginPath();
    for (const q of R) { const sw = q[2] * (0.18 + 0.12 * q[4].dx); ctx.rect(sl ? q[0] + q[2] - sw : q[0], q[1] + (ruin > 0.15 ? q[3] * 0.3 * ruin : 0), sw, q[3]); }
    ctx.fill();
    if (ruin < 0.15) {
      // 平顶的檐与偶有的圆顶
      ctx.fillStyle = css(mix(lit(base), [196, 170, 130], 0.3), 1, null, 0.04);
      ctx.beginPath();
      for (const q of R) if (!q[4].dome) ctx.rect(q[0] - 0.8 * un, q[1] - 1.2 * un, q[2] + 1.6 * un, 1.6 * un);
      ctx.fill();
      ctx.fillStyle = css(base, 1);
      ctx.beginPath();
      for (const q of R) if (q[4].dome) { const r0 = q[2] * 0.32; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
      ctx.fill();
    }
    ctx.fillStyle = css(HOLE, 1);
    ctx.beginPath();
    for (const q of R) {
      const hs = q[4];
      if (hs.door && q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.15), dh = Math.min(q[3] * 0.45, hm * 0.4); ctx.rect(q[0] + q[2] * (0.25 + 0.5 * hs.dx) - dw / 2, q[1] + q[3] - 3 * un - dh, dw, dh); }
      if (hs.win && q[3] > hm * 0.7) { const s = Math.max(1, hm * 0.08); ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4); }
    }
    ctx.fill();
    ctx.strokeStyle = css(lit(base), 1, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    for (const q of R) { const ex = sl ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] * 0.5, q[1]); }
    ctx.stroke();
    return R;
  }
  function drawLamps(ctx, R, k) {
    if (k < 0.03) return;
    const hm = PH(1);
    add1(ctx);
    ctx.fillStyle = U.rgba(255, 196, 120, 0.85 * k);
    ctx.beginPath();
    for (const q of R) {
      const hs = q[4];
      if (!hs.win || q[3] < hm * 0.7) continue;
      const s = Math.max(1, hm * 0.08);
      ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4);
    }
    ctx.fill();
    norm(ctx);
  }
  function drawTemple(ctx, ruin, soot) {
    const t = templeGeo(), hm = t.hm, un = UN(), x = t.x;
    const sl = sunLeft();
    // 殿基：石砌的平台
    ctx.fillStyle = css(mix(WALL, SOOT, soot * 0.6), 1);
    ctx.beginPath();
    ctx.moveTo(x - t.pw / 2 - hm * 0.12, t.g + hm * 0.2); ctx.lineTo(x - t.pw / 2, t.top); ctx.lineTo(x + t.pw / 2, t.top); ctx.lineTo(x + t.pw / 2 + hm * 0.12, t.g + hm * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(dim(WALL, 0.75), 1, 0.6);
    ctx.lineWidth = Math.max(0.5, un * 0.6);
    ctx.beginPath();
    for (let i = 1; i < 3; i++) { const y = t.top + (t.g + hm * 0.2 - t.top) * i / 3; ctx.moveTo(x - t.pw / 2, y); ctx.lineTo(x + t.pw / 2, y); }
    ctx.stroke();
    // 殿身（至圣所在后，右）、廊子（前，左，较高）
    const body = mix(TEMPLE, SOOT, soot), kR = 1 - ruin * 0.78;
    const bx0 = x - hm * 0.85, bx1 = x + hm * 1.6, bh = hm * 1.7 * kR, px0 = x - hm * 1.5, ph = hm * 2.5 * (1 - ruin * 0.85);
    ctx.fillStyle = css(body, 1);
    ctx.beginPath();
    if (ruin > 0.15) {
      const jag = (y0, x0, x1, n, seed) => { ctx.moveTo(x0, t.top); for (let i = 0; i <= n; i++) ctx.lineTo(x0 + (x1 - x0) * i / n, y0 + hm * 0.5 * ruin * hsh(seed + i)); ctx.lineTo(x1, t.top); ctx.closePath(); };
      jag(t.top - bh, bx0, bx1, 6, 3);
      jag(t.top - ph, px0, bx0 + 1, 3, 17);
    } else {
      ctx.rect(bx0, t.top - bh, bx1 - bx0, bh + 1);
      ctx.rect(px0, t.top - ph, bx0 - px0 + 1, ph + 1);
    }
    ctx.fill();
    // 背光面与窗
    ctx.fillStyle = css(dim(body, 0.8), 1);
    ctx.beginPath();
    if (sl) ctx.rect(bx1 - hm * 0.4, t.top - bh, hm * 0.4, bh); else ctx.rect(px0, t.top - ph, hm * 0.18, ph);
    ctx.fill();
    if (ruin < 0.3) {
      ctx.fillStyle = css(HOLE, 1, 0.85);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) ctx.rect(bx0 + hm * (0.3 + i * 0.42), t.top - bh * 0.86, Math.max(1, hm * 0.07), bh * 0.14);
      ctx.rect(px0 + hm * 0.18, t.top - ph * 0.5, hm * 0.24, ph * 0.5);    // 殿门
      ctx.fill();
      // 金的檐
      ctx.fillStyle = css(GOLD, 1, 0.9, 0.1);
      ctx.beginPath();
      ctx.rect(bx0 - 1.5 * un, t.top - bh - 2.4 * un, bx1 - bx0 + 3 * un, 2.6 * un);
      ctx.rect(px0 - 1.5 * un, t.top - ph - 2.4 * un, bx0 - px0 + 3 * un, 2.6 * un);
      ctx.rect(px0 + hm * 0.14, t.top - ph * 0.56, hm * 0.32, Math.max(1, un * 1.2));
      ctx.fill();
      // 雅斤与波阿斯：廊前两根铜柱
      const pa = 1 - sm(0, 0.4, ruin);
      if (pa > 0.02) {
        ctx.globalAlpha = pa;
        ctx.fillStyle = css(BRONZE, 1, 1, 0.08);
        ctx.beginPath();
        for (const dx of [-1.84, -1.66]) {
          const cx = x + dx * hm, h = hm * 1.55;
          ctx.rect(cx - hm * 0.05, t.top - h, hm * 0.1, h);
          ctx.moveTo(cx + hm * 0.1, t.top - h); ctx.arc(cx, t.top - h, hm * 0.1, 0, TAU);
        }
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // 院中的祭坛与烟
      ctx.fillStyle = css(WALL, 1);
      ctx.fillRect(x - hm * 2.05, t.top - hm * 0.28, hm * 0.32, hm * 0.28);
    }
    // 轮廓光
    ctx.strokeStyle = css(lit(body), 1, rimA(), 0.12);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    const ex = sl ? px0 : bx1;
    ctx.moveTo(ex, t.top); ctx.lineTo(ex, t.top - (sl ? ph : bh));
    ctx.moveTo(px0, t.top - ph); ctx.lineTo(bx0, t.top - ph);
    ctx.moveTo(bx0, t.top - bh); ctx.lineTo(bx1, t.top - bh);
    ctx.stroke();
    return { bx0, bx1, px0, bh, porch: ph };
  }
  function drawPalace(ctx, ruin, soot) {
    const hm = PH(1), un = UN(), x = X.palace * W.w, g = gY(1, X.palace) - hm * 0.05;
    const w = hm * 2.6, h = hm * 1.3 * (1 - ruin * 0.6);
    const base = mix([206, 190, 158], SOOT, soot);
    ctx.fillStyle = css(base, 1);
    ctx.beginPath();
    if (ruin > 0.15) { ctx.moveTo(x - w / 2, g); for (let i = 0; i <= 6; i++) ctx.lineTo(x - w / 2 + w * i / 6, g - h + hm * 0.4 * ruin * hsh(i + 50)); ctx.lineTo(x + w / 2, g); ctx.closePath(); }
    else ctx.rect(x - w / 2, g - h, w, h + 2);
    ctx.fill();
    if (ruin < 0.3) {
      // 香柏木的柱廊（黎巴嫩林宫）
      ctx.fillStyle = css(CEDAR, 1, 0.9);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) ctx.rect(x - w / 2 + w * (0.08 + i * 0.14), g - h * 0.72, Math.max(1, hm * 0.08), h * 0.72);
      ctx.fill();
      ctx.fillStyle = css(lit(base), 1, 0.8, 0.05);
      ctx.fillRect(x - w / 2 - un, g - h - 1.5 * un, w + 2 * un, 1.8 * un);
    }
  }
  function drawWall(ctx, ruin, soot) {
    const hm = PH(1), un = UN(), wh = hm * 0.72, cren = Math.max(2, hm * 0.2), br = lv('jrBreach');
    const x0 = X.city[0] * W.w, x1 = X.city[1] * W.w;
    ctx.fillStyle = css(mix(WALL, SOOT, soot * 0.7), 1);
    ctx.beginPath();
    let x = x0, i = 0;
    while (x < x1) {
      const seg = cren * 2, xe = Math.min(x1, x + seg), xf = (x + xe) * 0.5 / W.w;
      const inBreach = br > 0.02 && Math.abs(xf - X.breach) < 0.014;
      const broken = ruin > 0.05 && hsh(i * 7 + 3) < ruin * 0.6;
      const g0 = gY(1, x / W.w) + hm * 0.12;
      let h = broken ? wh * (0.12 + 0.3 * hsh(i + 9)) : wh;
      if (inBreach) h = Math.min(h, wh * (1 - br * (0.85 - 0.5 * Math.abs(xf - X.breach) / 0.014)));
      ctx.rect(x, g0 - h, xe - x + 0.5, h + 4 * un);
      if (!broken && !inBreach) ctx.rect(x, g0 - h - cren * 0.6, cren, cren * 0.6 + 1);
      x = xe; i++;
    }
    // 城楼（末一座是哈楠业楼）
    TOWERS.forEach((f, j) => {
      const gx = f * W.w, g0 = gY(1, f) + hm * 0.12, th = wh * (1.55 + 0.25 * (j % 2)) * (1 - ruin * 0.65 * hsh(j + 3)), w = hm * 0.62;
      ctx.rect(gx - w / 2, g0 - th, w, th + 4 * un);
      if (ruin < 0.4) { ctx.rect(gx - w / 2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); ctx.rect(gx + w * 0.2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); }
    });
    ctx.fill();
    // 城门
    ctx.fillStyle = css(HOLE, 1);
    ctx.beginPath();
    for (const f of X.gates) {
      const gx = f * W.w, g0 = gY(1, f) + hm * 0.12, gw = hm * 0.26, gh = wh * 0.8 * (1 - ruin * 0.4);
      ctx.moveTo(gx - gw / 2, g0 + 1); ctx.lineTo(gx - gw / 2, g0 - gh + gw / 2); ctx.arc(gx, g0 - gh + gw / 2, gw / 2, Math.PI, 0); ctx.lineTo(gx + gw / 2, g0 + 1); ctx.closePath();
    }
    ctx.fill();
    // 破口处的乱石
    if (br > 0.02) {
      ctx.fillStyle = css(mix(WALL, SOOT, 0.3), 1, br);
      ctx.beginPath();
      const bx = X.breach * W.w, g0 = gY(1, X.breach) + hm * 0.14;
      ctx.moveTo(bx - hm * 0.9, g0); ctx.quadraticCurveTo(bx, g0 - hm * 0.5, bx + hm * 0.9, g0); ctx.closePath();
      ctx.fill();
    }
  }
  // 围城的营与土垒（中丘）
  function drawCamp(ctx) {
    const k = lv('jrSiege');
    if (k < 0.01) return;
    sprites();
    const hm = PH(1), un = UN();
    // 土垒：靠着城墙筑起
    ctx.fillStyle = css(SOIL, 1, k);
    ctx.beginPath();
    for (const [a, b, left] of [[0.528, 0.568, 1], [0.905, 0.945, 0]]) {
      const xa = a * W.w, xb = b * W.w, g = gY(1, (a + b) / 2) + hm * 0.14, h = hm * 0.62 * k;
      if (left) { ctx.moveTo(xa, g); ctx.quadraticCurveTo(xb - (xb - xa) * 0.3, g - h * 0.9, xb, g - h); ctx.lineTo(xb, g); }
      else { ctx.moveTo(xb, g); ctx.quadraticCurveTo(xa + (xb - xa) * 0.3, g - h * 0.9, xa, g - h); ctx.lineTo(xa, g); }
      ctx.closePath();
    }
    ctx.fill();
    // 帐棚与兵
    ctx.fillStyle = css(TENT, 1, k);
    ctx.beginPath();
    for (const c of CAMP) {
      const [a, b] = X.camp[c.s], xf = lerp(a, b, c.u), x = xf * W.w, g = gY(1, xf) + 1, w = c.wk * hm, h = c.hk * hm;
      ctx.moveTo(x - w / 2, g); ctx.lineTo(x, g - h); ctx.lineTo(x + w / 2, g); ctx.closePath();
      for (let j = 0; j < c.men; j++) {
        const px = x + (j - c.men / 2 + 0.5) * hm * 0.28 + w * 0.55, hh = hm * 0.78;
        ctx.moveTo(px - hm * 0.07, g); ctx.lineTo(px - hm * 0.035, g - hh * 0.8); ctx.lineTo(px + hm * 0.035, g - hh * 0.8); ctx.lineTo(px + hm * 0.07, g); ctx.closePath();
        ctx.moveTo(px + hm * 0.065, g - hh * 0.9); ctx.arc(px, g - hh * 0.9, hm * 0.065, 0, TAU);
        ctx.rect(px + hm * 0.08, g - hh * 1.25, Math.max(0.6, un * 0.6), hh * 1.2);   // 枪
      }
    }
    ctx.fill();
    // 营火与白日的烟
    const nk = nightK();
    for (const c of CAMP) {
      if (!c.fire) continue;
      const [a, b] = X.camp[c.s], xf = lerp(a, b, c.u) + 0.012, x = xf * W.w, g = gY(1, xf) - 1;
      if (W.dayFactor > 0.2) smoke(ctx, x, g - hm * 0.3, k * 0.35 * W.dayFactor, hm * 5, hm * 0.35, c.ph, 5, 0.2);
      add1(ctx);
      const fl = 0.7 + 0.3 * Math.sin(W.t * 7 + c.ph);
      glowSp(ctx, SP.warm, x, g - hm * 0.1, hm * 0.9, k * fl * (0.25 + 0.7 * nk));
      flame(ctx, x, g, hm * 0.32, k * (0.4 + 0.6 * nk), c.ph);
      norm(ctx);
    }
  }
  // 焚烧（39:8；52:13）：城中与殿中的火、烟柱；其后的余烬
  function drawBurn(ctx, T0) {
    const kf = lv('jrFire'), kt = lv('jrTFire'), ke = lv('jrEmber');
    if (kf < 0.01 && kt < 0.01 && ke < 0.01) return;
    sprites();
    const hm = PH(1), un = UN();
    if (ke > 0.01) {
      add1(ctx);
      const nk = 0.4 + 0.6 * nightK();
      for (const e of EMBERS) {
        const x = e.xf * W.w, y = gY(1, e.xf) - hm * e.dy * 0.6, fl = 0.5 + 0.5 * Math.sin(W.t * (1.3 + e.k) + e.s);
        glowSp(ctx, SP.ember, x, y, hm * 0.35 * e.k, ke * nk * fl * 0.55);
        ctx.globalAlpha = ke * nk * fl;
        ctx.fillStyle = 'rgb(255,120,60)';
        ctx.fillRect(x - un * 0.6, y - un * 0.6, un * 1.2, un * 1.2);
      }
      norm(ctx);
    }
    if (kf > 0.01) {
      for (let i = 0; i < 5; i++) { const xf = 0.6 + i * 0.07; smoke(ctx, xf * W.w, gY(1, xf) - hm, kf * 0.8, W.h * 0.42, hm * 0.9, 31 + i, 7, 0.18); }
      add1(ctx);
      glowSp(ctx, SP.fire, W.w * 0.735, gY(1, 0.735) - hm * 0.6, W.w * 0.2, kf * 0.35);
      for (const f of FIRES) {
        const x = f.xf * W.w, g = gY(1, f.xf) - hm * 0.2;
        const pulse = 0.6 + 0.4 * Math.sin(W.t * (0.8 + hsh(f.s)) + f.s * 2.3);
        glowSp(ctx, SP.warm, x, g - hm * 0.4, hm * 1.2, kf * 0.4 * pulse);
        flame(ctx, x, g, hm * f.h * pulse, kf * (0.55 + 0.45 * pulse), f.s);
      }
      norm(ctx);
    }
    if (kt > 0.01 && T0) {
      smoke(ctx, T0.x, T0.top - T0.bh, kt * 0.85, W.h * 0.48, T0.hm * 1.1, 91, 8, 0.15);
      add1(ctx);
      glowSp(ctx, SP.fire, T0.x, T0.top - T0.bh * 0.5, T0.hm * 3.2, kt * 0.45);
      for (let i = 0; i < 7; i++) {
        const x = lerp(T0.px0, T0.bx1, (i + 0.5) / 7), pulse = 0.6 + 0.4 * Math.sin(W.t * (0.9 + hsh(i + 5)) + i * 2.1);
        flame(ctx, x, T0.top - T0.bh * (0.2 + 0.5 * hsh(i + 2)), T0.hm * (0.9 + 0.7 * hsh(i + 8)) * pulse, kt * (0.6 + 0.4 * pulse), 41 + i);
      }
      norm(ctx);
    }
  }
  // ★ 光的城（31:38–40）：在废墟上立起的金色的城
  function drawNewCity(ctx) {
    const k = lv('jrNew');
    if (k < 0.01) return;
    sprites();
    const hm = PH(1), un = UN(), e = U.easeOut(sm(0, 1, k)), t = templeGeo();
    add1(ctx);
    glowSp(ctx, SP.gold, W.w * 0.74, gY(1, 0.74) - hm * 1.2, W.w * 0.26, 0.35 * e);
    norm(ctx);
    const top = gY(1, X.temple) - hm * 4, bot = gY(1, X.temple) + hm * 0.3;
    const gr = ctx.createLinearGradient(0, bot, 0, top);
    gr.addColorStop(0, U.rgba(255, 214, 140, 0.8 * e)); gr.addColorStop(0.6, U.rgba(255, 236, 190, 0.86 * e)); gr.addColorStop(1, U.rgba(255, 250, 232, 0.9 * e));
    const shape = new Path2D();
    for (const row of [0, 1]) for (const q of houseRects(row, 0, true)) { const h = q[3] * e; shape.rect(q[0], q[1] + q[3] - h, q[2], h); }
    const wh = hm * 0.72 * e, x0 = X.city[0] * W.w, x1 = X.city[1] * W.w;
    for (let x = x0; x < x1; x += hm * 0.4) { const g0 = gY(1, x / W.w) + hm * 0.12; shape.rect(x, g0 - wh, Math.min(hm * 0.4, x1 - x) + 0.5, wh + 2); }
    for (const f of TOWERS) { const gx = f * W.w, g0 = gY(1, f) + hm * 0.12, th = hm * 0.72 * 1.7 * e; shape.rect(gx - hm * 0.31, g0 - th, hm * 0.62, th); }
    shape.rect(t.x - t.pw / 2, t.g - t.ph * e, t.pw, t.ph * e + 2);
    shape.rect(t.x - hm * 0.85, t.top - hm * 1.7 * e, hm * 2.45, hm * 1.7 * e + 1);
    shape.rect(t.x - hm * 1.5, t.top - hm * 2.5 * e, hm * 0.66, hm * 2.5 * e + 1);
    ctx.fillStyle = gr;
    ctx.fill(shape);
    add1(ctx);
    ctx.strokeStyle = U.rgba(255, 248, 226, 0.7 * e);
    ctx.lineWidth = Math.max(0.7, un * 0.9);
    ctx.stroke(shape);
    glowSp(ctx, SP.white, t.x, t.top - hm * 1.4 * e, hm * 2.6, 0.45 * e);
    // 城上升起的微光
    ctx.fillStyle = 'rgb(255,244,214)';
    for (let i = 0; i < 30; i++) {
      const ph = fract(W.t * 0.08 + hsh(i) * 5), xf = X.city[0] + (X.city[1] - X.city[0]) * hsh(i + 9);
      ctx.globalAlpha = e * 0.7 * Math.sin(ph * Math.PI);
      ctx.fillRect(xf * W.w - 1, gY(1, xf) - hm * (0.5 + ph * 3.5) - 1, 2, 2);
    }
    norm(ctx);
  }
  // 准绳往外量出（31:39）
  function drawLine(ctx) {
    const k = lv('jrLine');
    if (k < 0.01) return;
    const hm = PH(1), un = UN(), a = lerp(X.hananel, 0.535, sm(0, 1, k)), b = lerp(X.hananel, 0.997, sm(0, 1, k));
    add1(ctx);
    ctx.lineWidth = Math.max(1, un * 1.3);
    ctx.strokeStyle = U.rgba(255, 238, 190, 0.75 * Math.min(1, k * 2));
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const xf = lerp(a, b, i / 40), y = gY(1, xf) + hm * 0.3; if (i === 0) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y); }
    ctx.stroke();
    sprites();
    const tip = 1 - sm(0.9, 1, k);
    glowSp(ctx, SP.white, a * W.w, gY(1, a) + hm * 0.3, hm * 0.6, 0.8 * tip);
    glowSp(ctx, SP.white, b * W.w, gY(1, b) + hm * 0.3, hm * 0.6, 0.8 * tip);
    norm(ctx);
  }
  function drawMid(ctx) {
    const ruin = lv('jrRuin'), fire = lv('jrFire'), soot = clamp(ruin * 0.65 + fire * 0.25 + lv('jrTFire') * 0.1, 0, 1);
    drawCamp(ctx);
    const R0 = drawHouses(ctx, 0, ruin, soot);
    const T0 = Object.assign(drawTemple(ctx, ruin, soot), templeGeo());
    drawPalace(ctx, ruin, soot);
    const R1 = drawHouses(ctx, 1, ruin, soot);
    drawWall(ctx, ruin, soot);
    // 火光照在城上
    const fk = Math.max(fire, lv('jrTFire') * 0.8);
    if (fk > 0.01) {
      const hm = PH(1), un = UN(), sh = new Path2D();
      for (const q of R0.concat(R1)) sh.rect(q[0], q[1], q[2], q[3]);
      const x0 = X.city[0] * W.w, x1 = X.city[1] * W.w, wh = hm * 0.72 * (1 - 0.5 * ruin);
      for (let x = x0; x < x1; x += hm * 0.5) { const g0 = gY(1, x / W.w) + hm * 0.12; sh.rect(x, g0 - wh, hm * 0.5 + 0.5, wh + 4 * un); }
      sh.rect(T0.px0, T0.top - T0.porch, T0.bx1 - T0.px0, T0.porch + 1);
      sh.rect(T0.x - T0.pw / 2, T0.top, T0.pw, T0.g - T0.top + hm * 0.2);
      const fl = 0.8 + 0.2 * Math.sin(W.t * 3.3) * Math.sin(W.t * 2.1);
      const gr = ctx.createLinearGradient(0, gY(1, 0.74) + hm * 0.3, 0, gY(1, 0.74) - hm * 3);
      gr.addColorStop(0, U.rgba(255, 130, 60, 0.42 * fk * fl)); gr.addColorStop(1, U.rgba(255, 90, 40, 0.12 * fk * fl));
      add1(ctx);
      ctx.fillStyle = gr;
      ctx.fill(sh);
      norm(ctx);
    }
    const lamps = W.night * (1 - ruin) * (1 - fire) * (1 - 0.4 * lv('jrSiege'));
    drawLamps(ctx, R0, lamps);
    drawLamps(ctx, R1, lamps);
    drawBurn(ctx, T0);
    const pg = lv('jrSign') * lv('jrGlory');
    if (pg > 0.01) { sprites(); add1(ctx); glowSp(ctx, SP.gold, W.w * 0.735, gY(1, 0.735) - PH(1), W.w * 0.2, 0.3 * pg); norm(ctx); }
    drawNewCity(ctx);
    drawLine(ctx);
  }

  // ════════════════════════════════════════════════════════════
  //  画：近地
  // ════════════════════════════════════════════════════════════
  // 活水的泉源与溪水（2:13）
  function brookPts() { return BROOK.map(p => [p[0] * W.w, fieldY(p[0], p[1])]); }
  function drawBrook(ctx) {
    const k = lv('jrSpring'), un = UN(), hn = HN();
    sprites();
    const P = brookPts();
    const path = new Path2D();
    path.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < P.length - 1; i++) { const mx = (P[i][0] + P[i + 1][0]) / 2, my = (P[i][1] + P[i + 1][1]) / 2; path.quadraticCurveTo(P[i][0], P[i][1], mx, my); }
    path.lineTo(P[P.length - 1][0], P[P.length - 1][1]);
    // 溪床（湿土）
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([60, 52, 44], 2, 0.45);
    ctx.lineWidth = Math.max(2, un * 5.5);
    ctx.stroke(path);
    // 水
    const wc = mix(WATER, [196, 222, 244], 0.35 * k);
    ctx.strokeStyle = css(wc, 2, 0.35 + 0.6 * k, 0.1 * k);
    ctx.lineWidth = Math.max(1.2, un * (1.6 + 1.8 * k));
    ctx.stroke(path);
    // 水面的亮边与流动的闪光
    add1(ctx);
    ctx.strokeStyle = U.rgba(214, 236, 255, (0.06 + 0.2 * k) * (0.5 + 0.5 * W.daylight));
    ctx.lineWidth = Math.max(0.6, un * 0.7);
    ctx.save(); ctx.translate(0, -un * 0.7); ctx.stroke(path); ctx.restore();
    ctx.setLineDash([2.2 * un, 26 * un]);
    ctx.lineDashOffset = -W.t * 20 * un;
    ctx.strokeStyle = U.rgba(236, 248, 255, (0.08 + 0.4 * k) * (0.55 + 0.45 * W.daylight + 0.3 * nightK()));
    ctx.lineWidth = Math.max(0.8, un * 1.2);
    ctx.stroke(path);
    ctx.lineDashOffset = -W.t * 14 * un + 11 * un;
    ctx.strokeStyle = U.rgba(236, 248, 255, (0.05 + 0.25 * k) * (0.55 + 0.45 * W.daylight));
    ctx.stroke(path);
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.lineCap = 'butt';
    // 泉源：石间涌出的光
    const sx = P[0][0], sy = P[0][1];
    glowSp(ctx, SP.pale, sx, sy - hn * 0.08, hn * (0.5 + 0.9 * k), (0.2 + 0.45 * k) * (0.6 + 0.6 * nightK()));
    if (k > 0.5) glowSp(ctx, SP.white, sx, sy - hn * 0.05, hn * 0.25, (k - 0.5) * 0.9);
    norm(ctx);
    ctx.fillStyle = css([128, 120, 108], 2, 1);
    ctx.beginPath();
    for (const [dx, r] of [[-0.22, 0.1], [0.2, 0.12], [0.02, 0.07]]) { const x = sx + dx * hn, y = sy + 1; ctx.moveTo(x + r * hn, y); ctx.ellipse(x, y, r * hn, r * hn * 0.6, 0, Math.PI, TAU); }
    ctx.fill();
  }
  // 凿出的池子（2:13）；中间那一个后来成了玛基雅的牢狱（38:6）
  function cisGeo(i) {
    const xf = X.cis[i], v = CIS_V[i], hn = HN() * vk(v);
    return { x: xf * W.w, y: fieldY(xf, v), rx: hn * 0.4, ry: hn * 0.11, hn };
  }
  function pitDepth() { return HN() * 1.35; }
  function drawCisterns(ctx) {
    const k = lv('jrCistern');
    if (k < 0.01) return;
    const un = UN(), cr = lv('jrCrack'), wa = lv('jrWater');
    for (let i = 0; i < 3; i++) {
      const G = cisGeo(i), s = sm(0, 1, k * 1.4 - i * 0.15);
      if (s < 0.01) continue;
      const rx = G.rx * s, ry = G.ry * s;
      if (i === 1) drawPitCut(ctx, G);
      // 石砌的口
      ctx.fillStyle = css([150, 136, 116], 2, 1);
      ctx.beginPath(); ctx.ellipse(G.x, G.y, rx * 1.22, ry * 1.5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([34, 28, 24], 2, 1);
      ctx.beginPath(); ctx.ellipse(G.x, G.y, rx, ry, 0, 0, TAU); ctx.fill();
      // 水
      const w = wa * s * (i === 1 && lv('jrPit') > 0.05 ? 0 : 1);
      if (w > 0.02) {
        ctx.fillStyle = css(mix(WATER, W.haze, 0.3), 2, 0.85 * w, 0.1);
        ctx.beginPath(); ctx.ellipse(G.x, G.y + ry * 0.12, rx * 0.86, ry * 0.72, 0, 0, TAU); ctx.fill();
        add1(ctx);
        ctx.globalAlpha = 0.35 * w * (0.5 + 0.5 * W.daylight);
        ctx.fillStyle = 'rgb(236,246,255)';
        ctx.fillRect(G.x - rx * 0.4, G.y - ry * 0.1, rx * 0.5, Math.max(0.8, ry * 0.12));
        norm(ctx);
      }
      // 裂缝：自池口裂向四周的地里；漏出的水湿了一圈土
      if (cr > 0.01) {
        ctx.fillStyle = css([52, 44, 36], 2, 0.35 * cr);
        ctx.beginPath(); ctx.ellipse(G.x, G.y + ry * 0.6, rx * (1.3 + 0.7 * cr), ry * (1.6 + 1.2 * cr), 0, 0, TAU); ctx.fill();
        const crack = new Path2D();
        for (let j = 0; j < 5; j++) {
          const a0 = (j / 5 + hsh(i * 10 + j) * 0.12) * TAU, L = cr * (0.7 + 0.5 * hsh(i * 10 + j + 5));
          let px = G.x + Math.cos(a0) * rx * 0.95, py = G.y + Math.sin(a0) * ry * 0.95;
          crack.moveTo(px, py);
          for (let m = 1; m <= 4; m++) {
            const t = m / 4 * L;
            px = G.x + Math.cos(a0) * rx * (0.95 + t * 1.1) + (hsh(i * 31 + j * 7 + m) - 0.5) * rx * 0.25;
            py = G.y + Math.sin(a0) * ry * (0.95 + t * 1.6) + (hsh(i * 17 + j * 5 + m) - 0.5) * ry * 0.5;
            crack.lineTo(px, py);
          }
        }
        ctx.strokeStyle = css([200, 184, 160], 2, 0.55, 0.1);
        ctx.lineWidth = Math.max(1, un * 1.8);
        ctx.stroke(crack);
        ctx.strokeStyle = css([16, 12, 10], 2, 1);
        ctx.lineWidth = Math.max(0.7, un * 1.0);
        ctx.stroke(crack);
      }
    }
  }
  // 牢狱的剖面：窄口、宽底的池子，底下只有淤泥
  function drawPitCut(ctx, G) {
    const k = lv('jrPit');
    if (k < 0.01) return;
    const D = pitDepth(), hn = HN(), un = UN(), top = G.y, bot = G.y + D;
    const w0 = G.rx * 0.85, w1 = G.rx * 1.7;
    ctx.globalAlpha = k;
    // 池子的里面
    const shape = new Path2D();
    shape.moveTo(G.x - w0, top);
    shape.lineTo(G.x - w0, top + D * 0.22);
    shape.quadraticCurveTo(G.x - w1, top + D * 0.35, G.x - w1, bot - D * 0.1);
    shape.quadraticCurveTo(G.x - w1, bot, G.x - w1 * 0.8, bot);
    shape.lineTo(G.x + w1 * 0.8, bot);
    shape.quadraticCurveTo(G.x + w1, bot, G.x + w1, bot - D * 0.1);
    shape.quadraticCurveTo(G.x + w1, top + D * 0.35, G.x + w0, top + D * 0.22);
    shape.lineTo(G.x + w0, top);
    shape.closePath();
    const gr = ctx.createLinearGradient(0, top, 0, bot);
    gr.addColorStop(0, css([46, 38, 32], 2, 1)); gr.addColorStop(1, css([16, 13, 12], 2, 1));
    ctx.fillStyle = gr;
    ctx.fill(shape);
    // 砌石的纹
    ctx.strokeStyle = css([70, 60, 50], 2, 0.6);
    ctx.lineWidth = Math.max(0.5, un * 0.6);
    ctx.save(); ctx.clip(shape);
    ctx.beginPath();
    for (let j = 1; j < 6; j++) { const y = top + D * j / 6; ctx.moveTo(G.x - w1, y); ctx.lineTo(G.x + w1, y); }
    ctx.stroke();
    // 从口上照下的一点微光
    add1(ctx);
    const lg = ctx.createLinearGradient(0, top, 0, bot);
    lg.addColorStop(0, 'rgba(190,210,240,0.22)'); lg.addColorStop(1, 'rgba(190,210,240,0)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.moveTo(G.x - w0, top); ctx.lineTo(G.x + w0, top); ctx.lineTo(G.x + w1 * 0.7, bot); ctx.lineTo(G.x - w1 * 0.7, bot); ctx.closePath(); ctx.fill();
    norm(ctx);
    ctx.restore();
    // 底下的淤泥（后面的一层；前面的一层在人之后画）
    ctx.globalAlpha = k;
    ctx.fillStyle = css([74, 56, 40], 2, 1);
    ctx.fillRect(G.x - w1 * 0.95, bot - hn * 0.12, w1 * 1.9, hn * 0.12);
    // 切面：池壁外一圈剖开的土，与切面的边
    ctx.strokeStyle = css([104, 84, 62], 2, 0.55);
    ctx.lineWidth = Math.max(2, hn * 0.12);
    ctx.stroke(shape);
    ctx.strokeStyle = css([160, 136, 104], 2, 0.85);
    ctx.lineWidth = Math.max(0.8, un);
    ctx.stroke(shape);
    ctx.globalAlpha = 1;
  }
  // 淤泥的前层（盖住陷在泥里的腿）与绳子（在人之后画）
  function drawPitFront(ctx) {
    const k = lv('jrPit');
    if (k < 0.01) return;
    const G = cisGeo(1), D = pitDepth(), hn = HN(), un = UN(), bot = G.y + D, w1 = G.rx * 1.7;
    const mud = lv('jrMud');
    if (mud > 0.01) {
      const mh = hn * (0.08 + 0.3 * mud);
      ctx.globalAlpha = k;
      ctx.fillStyle = css([80, 60, 42], 2, 1);
      ctx.beginPath();
      ctx.moveTo(G.x - w1 * 0.95, bot);
      ctx.lineTo(G.x - w1 * 0.95, bot - mh * 0.9);
      ctx.quadraticCurveTo(G.x, bot - mh * 1.15, G.x + w1 * 0.95, bot - mh * 0.9);
      ctx.lineTo(G.x + w1 * 0.95, bot);
      ctx.closePath();
      ctx.fill();
      // 湿泥上的一线反光（自口上照下的微光）
      add1(ctx);
      ctx.strokeStyle = U.rgba(170, 190, 220, 0.45 * k);
      ctx.lineWidth = Math.max(0.8, un * 1.1);
      ctx.beginPath(); ctx.moveTo(G.x - w1 * 0.9, bot - mh * 0.9); ctx.quadraticCurveTo(G.x, bot - mh * 1.15, G.x + w1 * 0.9, bot - mh * 0.9); ctx.stroke();
      norm(ctx);
      ctx.globalAlpha = k;
      ctx.globalAlpha = 1;
    }
    const kr = lv('jrRope');
    if (kr > 0.01) {
      const p = figPt('jr:jer', 0.78);
      if (p) {
        ctx.strokeStyle = css([176, 150, 110], 2, kr * 0.95, 0.1);
        ctx.lineWidth = Math.max(0.7, un * 0.9);
        ctx.beginPath();
        ctx.moveTo(G.x - G.rx * 0.5, G.y - hn * 0.9); ctx.lineTo(p[0] - hn * 0.05, p[1]);
        ctx.moveTo(G.x + G.rx * 0.5, G.y - hn * 0.9); ctx.lineTo(p[0] + hn * 0.05, p[1]);
        ctx.stroke();
      }
    }
  }
  // 窑匠的家：窑、棚、架上的器皿
  function shedGeo() { const hn = HN(), x = X.shed * W.w, g = gY(2, X.shed); return { x, g, hn, w: 1.9 * hn, h: 1.45 * hn }; }
  function drawShed(ctx) {
    const G = shedGeo(), hn = G.hn, un = UN(), x = G.x, g = G.g;
    sprites();
    // 窑：蜂巢形的窑，口里的火
    const kx = x - G.w / 2 - hn * 0.55, kw = hn * 0.55, kh = hn * 0.85;
    ctx.fillStyle = css(mix(MUD, [150, 110, 80], 0.4), 2, 1);
    ctx.beginPath();
    ctx.moveTo(kx - kw, g + 2); ctx.lineTo(kx - kw, g - kh * 0.45); ctx.quadraticCurveTo(kx - kw, g - kh, kx, g - kh); ctx.quadraticCurveTo(kx + kw, g - kh, kx + kw, g - kh * 0.45); ctx.lineTo(kx + kw, g + 2); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(lit(MUD), 2, rimA() * 0.8, 0.08);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.stroke();
    const mo = [kx + kw * 0.35, g - kh * 0.2];
    ctx.fillStyle = 'rgb(40,24,16)';
    ctx.beginPath(); ctx.moveTo(mo[0] - hn * 0.13, g); ctx.lineTo(mo[0] - hn * 0.13, mo[1]); ctx.arc(mo[0], mo[1], hn * 0.13, Math.PI, 0); ctx.lineTo(mo[0] + hn * 0.13, g); ctx.closePath(); ctx.fill();
    const kiln = clamp(1 - lv('jrRuin') * 0.5, 0, 1);
    add1(ctx);
    const fl = 0.8 + 0.2 * Math.sin(W.t * 6.3) * Math.sin(W.t * 3.7);
    glowSp(ctx, SP.fire, mo[0], mo[1] + hn * 0.06, hn * 0.22, 0.9 * kiln * fl);
    glowSp(ctx, SP.warm, mo[0] + hn * 0.1, mo[1], hn * (0.6 + 0.6 * nightK()), kiln * fl * (0.12 + 0.4 * nightK()));
    norm(ctx);
    if (W.dayFactor > 0.2) smoke(ctx, kx, g - kh, 0.25 * W.dayFactor * kiln, hn * 2.4, hn * 0.14, 5, 5, 0.3);
    // 棚：后墙、架子、前柱、芦苇的顶
    const x0 = x - G.w / 2, x1 = x + G.w / 2;
    ctx.fillStyle = css(MUD, 2, 1);
    ctx.fillRect(x0, g - G.h * 0.9, G.w, G.h * 0.9 + 2);
    ctx.fillStyle = css(dim(MUD, 0.72), 2, 1);
    ctx.fillRect(x0, g - G.h * 0.9, G.w, G.h * 0.08);
    // 架子与器皿
    ctx.fillStyle = css(WOOD, 2, 1);
    for (const f of [0.38, 0.66]) ctx.fillRect(x0 + hn * 0.12, g - G.h * f, G.w - hn * 0.24, Math.max(1, hn * 0.035));
    ctx.fillStyle = css(CLAY, 2, 1);
    ctx.beginPath();
    for (let r = 0; r < 2; r++) {
      const sy = g - G.h * [0.38, 0.66][r];
      for (let i = 0; i < 6; i++) { const cx = x0 + hn * 0.25 + i * (G.w - hn * 0.5) / 5, s = hn * (0.16 + 0.06 * hsh(i + r * 7)); jarPath(ctx, cx, sy, s, hsh(i * 3 + r) < 0.5 ? POT : FLASK, 0); }
    }
    ctx.fill();
    ctx.fillStyle = css(WOOD, 2, 1);
    ctx.fillRect(x0 - hn * 0.02, g - G.h, Math.max(1.2, hn * 0.06), G.h);
    ctx.fillRect(x1 - hn * 0.04, g - G.h * 1.04, Math.max(1.2, hn * 0.06), G.h * 1.04);
    ctx.fillStyle = css(REED, 2, 1);
    ctx.beginPath();
    ctx.moveTo(x0 - hn * 0.18, g - G.h + hn * 0.02); ctx.lineTo(x1 + hn * 0.2, g - G.h * 1.06); ctx.lineTo(x1 + hn * 0.2, g - G.h * 1.06 - hn * 0.1); ctx.lineTo(x0 - hn * 0.18, g - G.h - hn * 0.1); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(lit(REED), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath(); ctx.moveTo(x0 - hn * 0.18, g - G.h - hn * 0.1); ctx.lineTo(x1 + hn * 0.2, g - G.h * 1.06 - hn * 0.1); ctx.stroke();
    // 地上晾着的几个器皿
    ctx.fillStyle = css(mix(CLAY, [210, 170, 130], 0.3), 2, 1);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) jarPath(ctx, x1 + hn * (0.2 + i * 0.2), g + hn * 0.02, hn * (0.18 + 0.05 * i), i === 1 ? FLASK : POT, 0);
    ctx.fill();
  }
  // 轮与轮上的器皿（在人之后画：器皿在窑匠手前）
  function wheelPos() {
    const p = fig('jr:potter');
    if (!p) return null;
    const hn = HN(), x = (p._vis ? p._x : p.nx * W.w) + (p.fd || p.facing || -1) * hn * 0.36, g = p._vis ? p._y : gY(2, p.nx);
    return { x, g, hn };
  }
  function drawWheel(ctx) {
    const q = wheelPos();
    if (!q) return;
    const hn = q.hn, un = UN(), x = q.x, g = q.g, spin = lv('jrWheel');
    const top = g - hn * 0.3, rx = hn * 0.24, ry = hn * 0.055;
    // 下盘与轴
    ctx.fillStyle = css(WOOD, 2, 1);
    ctx.beginPath(); ctx.ellipse(x, g - hn * 0.05, rx * 1.3, ry * 1.2, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - hn * 0.025, top, hn * 0.05, g - top - hn * 0.05);
    ctx.fillStyle = css(dim(WOOD, 1.15), 2, 1, 0.05);
    ctx.beginPath(); ctx.ellipse(x, top, rx, ry, 0, 0, TAU); ctx.fill();
    // 转动的纹
    if (spin > 0.02) {
      ctx.strokeStyle = css([60, 44, 32], 2, 0.8 * spin);
      ctx.lineWidth = Math.max(0.6, un * 0.7);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = W.t * 7 * spin + i * 2.1, cx = Math.cos(a), sn = Math.sin(a);
        if (sn < 0) continue;
        ctx.moveTo(x + cx * rx * 0.9, top + sn * ry * 0.9); ctx.lineTo(x + cx * rx * 0.5, top + sn * ry * 0.5);
      }
      ctx.stroke();
    }
    // 器皿
    const f = lv('jrForm'), P = profile(f), S = hn * 0.4;
    const path = vesselPath(x, top, S, P);
    const wet = mix(CLAY, [150, 96, 66], 0.35);
    ctx.fillStyle = css(wet, 2, 1);
    ctx.fill(path);
    ctx.save(); ctx.clip(path);
    ctx.fillStyle = css(lit(wet), 2, 0.55, 0.12);
    const bandX = x + Math.sin(W.t * 6 * spin + 1) * S * 0.18 * spin;
    ctx.fillRect(bandX - S * 0.08, top - P.H * S, S * 0.12, P.H * S);
    ctx.restore();
    ctx.strokeStyle = css(lit(wet), 2, rimA() * 0.9, 0.1);
    ctx.lineWidth = Math.max(0.6, un * 0.8);
    ctx.stroke(path);
  }
  // 王的院：矮墙与过冬的房屋（36:22）；王的座
  function pavGeo() { const hn = HN(), x = X.pav * W.w, g = gY(2, X.pav); return { x, g, hn, w: 1.75 * hn, h: 1.5 * hn }; }
  function drawCourt(ctx) {
    const k = lv('jrCourt');
    if (k < 0.01) return;
    const G = pavGeo(), hn = G.hn, un = UN(), x = G.x, g = G.g, ruin = lv('jrRuin'), soot = clamp(ruin * 0.8, 0, 1);
    ctx.globalAlpha = k;
    // 矮墙
    const wc = mix([196, 178, 146], SOOT, soot * 0.6);
    ctx.fillStyle = css(wc, 2, 1);
    ctx.beginPath();
    for (let xf = X.court[0]; xf < X.court[1]; xf += 0.006) {
      const xx = xf * W.w, gg = gY(2, xf), h = hn * 0.3 * (ruin > 0.05 && hsh(xf * 997) < ruin * 0.6 ? 0.4 : 1);
      ctx.rect(xx, gg - h, 0.006 * W.w + 0.6, h + 2);
    }
    ctx.fill();
    // 过冬的房屋
    const x0 = x - G.w / 2, x1 = x + G.w / 2, kR = 1 - ruin * 0.55;
    const stone = mix([206, 190, 160], SOOT, soot);
    ctx.fillStyle = css(stone, 2, 1);
    ctx.fillRect(x0 - hn * 0.1, g - hn * 0.08, G.w + hn * 0.2, hn * 0.12);
    ctx.fillRect(x0, g - G.h * kR, G.w, G.h * kR);
    if (ruin < 0.4) {
      // 帐幔
      ctx.fillStyle = css(PURPLE, 2, 0.95);
      ctx.fillRect(x - G.w * 0.28, g - G.h * 0.9, G.w * 0.56, G.h * 0.62);
      ctx.fillStyle = css(GOLD, 2, 0.8, 0.05);
      ctx.fillRect(x - G.w * 0.28, g - G.h * 0.9, G.w * 0.56, Math.max(1, hn * 0.03));
      // 柱
      ctx.fillStyle = css(CEDAR, 2, 1);
      for (const f of [0.06, 0.5, 0.94]) ctx.fillRect(x0 + G.w * f - hn * 0.05, g - G.h, hn * 0.1, G.h);
      // 顶
      ctx.fillStyle = css(dim(stone, 0.92), 2, 1);
      ctx.fillRect(x0 - hn * 0.16, g - G.h - hn * 0.14, G.w + hn * 0.32, hn * 0.16);
      ctx.strokeStyle = css(lit(stone), 2, rimA(), 0.1);
      ctx.lineWidth = Math.max(0.6, un);
      ctx.beginPath(); ctx.moveTo(x0 - hn * 0.16, g - G.h - hn * 0.14); ctx.lineTo(x1 + hn * 0.16, g - G.h - hn * 0.14); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // 王的座
    const kp = fig('jr:king');
    if (kp && kp.alpha > 0.02) {
      const sx = (kp._vis ? kp._x : kp.nx * W.w), sy = kp._vis ? kp._y : g;
      ctx.globalAlpha = kp.alpha;
      ctx.fillStyle = css(CEDAR, 2, 1);
      ctx.fillRect(sx - hn * 0.2 * (kp.fd || 1), sy - hn * 0.3, hn * 0.26, hn * 0.3);
      ctx.fillRect(sx - hn * 0.24 * (kp.fd || 1) - hn * 0.03, sy - hn * 0.62, hn * 0.06, hn * 0.62);
      ctx.globalAlpha = 1;
    }
  }
  // 火盆（在人之后画）
  function brazierPos() {
    const k = fig('jr:king');
    const x = k ? (k._vis ? k._x : k.nx * W.w) + (k.fd || 1) * HN() * 0.55 : (X.king * W.w + HN() * 0.55);
    return { x, y: fieldY(X.pav, 0.1) };
  }
  function drawBrazier(ctx) {
    const k = lv('jrBrazier');
    if (k < 0.01) return;
    sprites();
    const hn = HN(), un = UN(), B = brazierPos(), x = B.x, y = B.y, top = y - hn * 0.36;
    ctx.globalAlpha = Math.min(1, k * 2);
    ctx.strokeStyle = css(BRONZE, 2, 1);
    ctx.lineWidth = Math.max(0.8, un * 1.2);
    ctx.beginPath();
    ctx.moveTo(x - hn * 0.12, y); ctx.lineTo(x - hn * 0.05, top); ctx.moveTo(x + hn * 0.12, y); ctx.lineTo(x + hn * 0.05, top); ctx.moveTo(x, y); ctx.lineTo(x, top);
    ctx.stroke();
    ctx.fillStyle = css(BRONZE, 2, 1, 0.05);
    ctx.beginPath(); ctx.moveTo(x - hn * 0.18, top); ctx.quadraticCurveTo(x, top + hn * 0.16, x + hn * 0.18, top); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // 火：割下的书卷扔进去时一阵一阵地腾起
    let flare = 0;
    if (S.burnT > -1e8) for (let i = 0; i < 4; i++) { const t = W.t - S.burnT - i * 1.4 - 1.05; if (t > 0 && t < 2) flare += Math.exp(-t * 2.5); }
    const kk = k * (1 + flare * 0.9);
    add1(ctx);
    glowSp(ctx, SP.warm, x, top - hn * 0.1, hn * (2.6 + flare), kk * 0.45);
    glowSp(ctx, SP.fire, x, top - hn * 0.05, hn * 0.5, kk * 0.8);
    flame(ctx, x, top, hn * 0.34 * (1 + flare * 0.6), kk, 3);
    flame(ctx, x - hn * 0.06, top, hn * 0.22 * (1 + flare * 0.5), kk * 0.8, 7);
    norm(ctx);
  }
  // 书卷：两根轴，中间展开的皮卷，上面的字行（越写越多）
  function drawScroll(ctx, x, y, w, open, written, bright, a) {
    if (a < 0.02) return;
    const hn = HN(), un = UN(), h = hn * 0.14, ww = w * (0.25 + 0.75 * open);
    ctx.globalAlpha = a;
    ctx.fillStyle = css([236, 222, 188], 2, 1, 0.15);
    ctx.fillRect(x - ww / 2, y - h / 2, ww, h);
    ctx.fillStyle = css(WOOD, 2, 1);
    ctx.fillRect(x - ww / 2 - hn * 0.03, y - h * 0.7, hn * 0.04, h * 1.4);
    ctx.fillRect(x + ww / 2 - hn * 0.01, y - h * 0.7, hn * 0.04, h * 1.4);
    const n = Math.round(4 * c01(written));
    if (n > 0) {
      if (bright > 0) add1(ctx);
      ctx.fillStyle = bright > 0 ? U.rgba(255, 230, 170, 0.9) : css([60, 44, 34], 2, 0.9);
      for (let i = 0; i < n; i++) ctx.fillRect(x - ww / 2 + ww * 0.12, y - h * 0.32 + i * h * 0.2, ww * 0.76 * (i === n - 1 ? fract(written * 4) || 1 : 1), Math.max(0.6, un * 0.5));
      if (bright > 0) { sprites(); glowSp(ctx, SP.gold, x, y, hn * 0.45, bright * a * 0.6); }
      norm(ctx);
    }
    ctx.globalAlpha = 1;
  }
  function drawScrolls(ctx) {
    const hn = HN();
    // 第一卷
    const k1 = lv('jrScroll1');
    if (S.scroll1 === 'baruch' || S.scroll1 === 'jehudi') {
      const id = S.scroll1 === 'baruch' ? 'jr:baruch' : 'jr:jehudi', f = fig(id);
      if (f) {
        const reading = S.scroll1 === 'jehudi' && f.pose === 'carry';
        const p = figPt(id, S.scroll1 === 'baruch' ? 0.3 : (reading ? 0.6 : 0.5)), d = f.fd || f.facing || 1;
        if (p) {
          if (S.scroll1 === 'baruch') drawScroll(ctx, p[0] + d * hn * 0.2, p[1], hn * 0.26, 0.8, k1, 0, f.alpha || 1);
          else drawScroll(ctx, p[0] + d * hn * (reading ? 0.3 : 0.2), p[1], hn * 0.36 * (0.3 + 0.7 * k1), reading ? 1 : 0.1, Math.max(0.25, k1), 0, (f.alpha || 1) * (0.3 + 0.7 * sm(0, 0.2, k1)));
        }
      }
    }
    // 割下的，一篇一篇飞进火盆
    if (S.burnT > -1e8) {
      const f = fig('jr:jehudi'), B = brazierPos();
      const p0 = f ? figPt('jr:jehudi', 0.6) : null;
      if (p0) {
        for (let i = 0; i < 4; i++) {
          const t = (W.t - S.burnT - i * 1.4) / 1.05;
          if (t <= 0 || t > 1) continue;
          const sx = p0[0] + (f.fd || -1) * hn * 0.3, sy = p0[1], ex = B.x, ey = B.y - hn * 0.4;
          const x = lerp(sx, ex, t), y = lerp(sy, ey, t) - Math.sin(t * Math.PI) * hn * 0.35;
          ctx.save(); ctx.translate(x, y); ctx.rotate(t * 5 + i);
          ctx.fillStyle = css([236, 222, 188], 2, 1 - t * 0.3, 0.15);
          ctx.fillRect(-hn * 0.07, -hn * 0.035, hn * 0.14, hn * 0.07);
          ctx.restore();
          add1(ctx); sprites();
          glowSp(ctx, SP.fire, x, y, hn * 0.12, t * 0.8);
          norm(ctx);
        }
      }
    }
    // 另取的一卷（36:32）：写得更多，发着光
    const k2 = lv('jrScroll2');
    if (k2 > 0.01) {
      const f = fig('jr:baruch');
      if (f) {
        const p = figPt('jr:baruch', 0.3), d = f.fd || f.facing || 1;
        if (p) {
          drawScroll(ctx, p[0] + d * hn * 0.2, p[1], hn * 0.3, 0.85, k2, 0.8, f.alpha || 1);
          // 字如火星一般升起
          add1(ctx);
          ctx.fillStyle = 'rgb(255,230,170)';
          for (let i = 0; i < 10; i++) {
            const ph = fract(W.t * 0.25 + i / 10), x = p[0] + d * hn * 0.2 + (hsh(i) - 0.5) * hn * 0.3, y = p[1] - ph * hn * 0.9;
            ctx.globalAlpha = k2 * 0.8 * Math.sin(ph * Math.PI);
            ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
          }
          norm(ctx);
        }
      }
    }
    // 书信（29:1）
    if (S.letter === 'jer' || S.letter === 'elasah') {
      const id = S.letter === 'jer' ? 'jr:jer' : 'jr:elasah', f = fig(id);
      if (f) { const p = figPt(id, S.letter === 'jer' ? 0.32 : 0.52), d = f.fd || f.facing || 1; if (p) drawScroll(ctx, p[0] + d * hn * 0.2, p[1], hn * 0.2, S.letter === 'jer' ? 0.7 : 0.1, 1, 0.6, f.alpha || 1); }
    }
  }
  // 瓦瓶（19:1–10）：拿着 → 举起 → 打碎
  function drawJar(ctx) {
    const hn = HN(), un = UN();
    if (S.jar === 'carry' || S.jar === 'raise') {
      const f = fig('jr:jer');
      if (!f) return;
      const up = S.jar === 'raise' && f.pose === 'raise';
      const p = figPt('jr:jer', up ? 1.08 : 0.5), d = f.fd || f.facing || 1;
      if (!p) return;
      const x = p[0] + (up ? 0 : d * hn * 0.2), y = p[1] + (up ? 0 : hn * 0.1);
      ctx.fillStyle = css(CLAY, 2, 1);
      ctx.beginPath(); jarPath(ctx, x, y, hn * 0.28, FLASK, 0); ctx.fill();
      ctx.strokeStyle = css(lit(CLAY), 2, rimA(), 0.1);
      ctx.lineWidth = Math.max(0.6, un * 0.8);
      ctx.stroke();
      return;
    }
    if (S.jar !== 'broken') return;
    const g = fieldY(X.gate + 0.012, 0.06);
    const t = W.t - S.smashT;
    const x0 = X.gate * W.w + hn * 0.05, y0 = g - hn * 1.08;
    ctx.fillStyle = css(CLAY, 2, 1);
    ctx.beginPath();
    for (let i = 0; i < SHARDS.length; i++) {
      const q = SHARDS[i];
      let x, y, r;
      const restX = x0 + q.rest * hn, restY = g - q.rv * hn * 0.1;
      if (t >= 0 && t < 1.6) {
        const tt = Math.min(t, 1.1);
        x = x0 + q.vx * hn * tt; y = y0 + q.vy * hn * tt + 4.2 * hn * tt * tt;
        if (y > restY) { y = restY; }
        if (t > 1.1) { const s = sm(1.1, 1.6, t); x = lerp(x, restX, s); y = lerp(y, restY, s); }
        r = q.rot + q.sp * tt;
      } else { x = restX; y = restY; r = q.rot; }
      const s = q.s * hn * 0.09, cs = Math.cos(r), sn = Math.sin(r);
      ctx.moveTo(x + cs * s, y + sn * s); ctx.lineTo(x - sn * s * 0.6, y + cs * s * 0.6); ctx.lineTo(x - cs * s * 0.8, y - sn * s * 0.5); ctx.closePath();
    }
    ctx.fill();
  }
  // 枷（20:2）
  function drawStocks(ctx) {
    const k = lv('jrStocks');
    if (k < 0.01) return;
    const hn = HN(), un = UN(), f = fig('jr:jer');
    const x = (f && f._vis ? f._x : X.gate * W.w) + hn * 0.32, g = f && f._vis ? f._y : gY(2, X.gate);
    ctx.globalAlpha = k;
    ctx.fillStyle = css([88, 64, 44], 2, 1);
    ctx.fillRect(x - hn * 0.04, g - hn * 0.34, hn * 0.07, hn * 0.34);
    ctx.fillRect(x + hn * 0.28, g - hn * 0.34, hn * 0.07, hn * 0.34);
    ctx.fillStyle = css([112, 84, 58], 2, 1);
    ctx.fillRect(x - hn * 0.08, g - hn * 0.2, hn * 0.48, hn * 0.1);
    ctx.fillRect(x - hn * 0.08, g - hn * 0.32, hn * 0.48, hn * 0.07);
    ctx.fillStyle = css([40, 30, 22], 2, 1);
    ctx.beginPath(); ctx.arc(x + hn * 0.05, g - hn * 0.15, hn * 0.025, 0, TAU); ctx.arc(x + hn * 0.17, g - hn * 0.15, hn * 0.025, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([170, 140, 104], 2, rimA() * 0.8, 0.1);
    ctx.lineWidth = Math.max(0.5, un * 0.7);
    ctx.strokeRect(x - hn * 0.08, g - hn * 0.32, hn * 0.48, hn * 0.22);
    ctx.globalAlpha = 1;
  }
  // 骨中烧着的火（20:9）
  function drawBone(ctx) {
    const k = lv('jrBone');
    if (k < 0.01) return;
    const f = fig('jr:jer');
    if (!f) return;
    const sit = f.pose === 'sit' || f.pose === 'kneel';
    const p = figPt('jr:jer', sit ? 0.36 : 0.6);
    if (!p) return;
    sprites();
    const hn = HN();
    add1(ctx);
    const fl = 0.8 + 0.2 * Math.sin(W.t * 7.1) * Math.sin(W.t * 4.3);
    glowSp(ctx, SP.warm, p[0], p[1], hn * (0.7 + 1.5 * k), k * 0.6 * fl);
    glowSp(ctx, SP.fire, p[0], p[1], hn * (0.25 + 0.2 * k), k * fl);
    if (k > 0.4) {
      flame(ctx, p[0], p[1] + hn * 0.06, hn * 0.5 * k * fl, (k - 0.3) * 0.95, 13);
      flame(ctx, p[0] - hn * 0.07, p[1] + hn * 0.08, hn * 0.3 * k, (k - 0.3) * 0.7, 17);
      flame(ctx, p[0] + hn * 0.07, p[1] + hn * 0.08, hn * 0.34 * k, (k - 0.3) * 0.7, 19);
    }
    ctx.fillStyle = 'rgb(255,206,130)';
    const un = UN();
    for (let i = 0; i < 16; i++) {
      const ph = fract(W.t * 0.45 + i / 16), x = p[0] + (hsh(i) - 0.5) * hn * 0.4 + Math.sin(ph * 6 + i) * hn * 0.1, y = p[1] - ph * hn * 1.8;
      ctx.globalAlpha = k * 0.9 * Math.sin(ph * Math.PI);
      ctx.fillRect(x - 0.9 * un, y - 0.9 * un, 1.8 * un, 1.8 * un);
    }
    norm(ctx);
  }
  // 亚拿突：房屋
  function drawAnathoth(ctx) {
    const hn = HN(), un = UN(), sl = sunLeft();
    const R = [];
    X.houses.forEach((xf, i) => {
      const x = xf * W.w, g = gY(2, xf) + hn * 0.04, w = hn * (1.0 + 0.2 * hsh(i + 1)), h = hn * (0.78 + 0.22 * hsh(i + 4));
      R.push([x - w / 2, g - h, w, h, i]);
    });
    ctx.fillStyle = css(MUD, 2, 1);
    ctx.beginPath();
    for (const q of R) { ctx.rect(q[0], q[1], q[2], q[3] + 3); ctx.rect(q[0] - un, q[1] - hn * 0.06, q[2] + 2 * un, hn * 0.07); }
    ctx.fill();
    ctx.fillStyle = css(dim(MUD, 0.78), 2, 1);
    ctx.beginPath();
    for (const q of R) { const sw = q[2] * 0.22; ctx.rect(sl ? q[0] + q[2] - sw : q[0], q[1], sw, q[3] + 3); }
    ctx.fill();
    ctx.fillStyle = css(HOLE, 2, 1);
    ctx.beginPath();
    for (const q of R) { ctx.rect(q[0] + q[2] * 0.3, q[1] + q[3] * 0.45, q[2] * 0.2, q[3] * 0.55); ctx.rect(q[0] + q[2] * 0.66, q[1] + q[3] * 0.25, q[2] * 0.12, q[3] * 0.14); }
    ctx.fill();
    // 顶上伸出的梁头
    ctx.fillStyle = css(WOOD, 2, 1);
    for (const q of R) for (let j = 0; j < 4; j++) ctx.fillRect(q[0] + q[2] * (0.12 + j * 0.24), q[1] + hn * 0.02, Math.max(1, hn * 0.04), Math.max(1, hn * 0.04));
    ctx.strokeStyle = css(lit(MUD), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    for (const q of R) { const ex = sl ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3]); ctx.lineTo(ex, q[1] - hn * 0.06); ctx.lineTo(q[0] + q[2] / 2, q[1] - hn * 0.06); }
    ctx.stroke();
    const nk = nightK();
    if (nk > 0.05) {
      sprites();
      add1(ctx);
      for (const q of R) {
        const x = q[0] + q[2] * 0.72, y = q[1] + q[3] * 0.32, fl = 0.85 + 0.15 * Math.sin(W.t * 5 + q[4] * 3);
        ctx.globalAlpha = nk * 0.9 * fl; ctx.fillStyle = 'rgb(255,196,120)'; ctx.fillRect(q[0] + q[2] * 0.66, q[1] + q[3] * 0.25, q[2] * 0.12, q[3] * 0.14);
        glowSp(ctx, SP.warm, x, y, hn * 0.5, nk * 0.35 * fl);
      }
      norm(ctx);
    }
  }
  // 杏树（1:11）
  function almondGeo() { const hn = HN(); return { x: X.almond * W.w, g: gY(2, X.almond) + 2, TH: hn * 1.75 }; }
  function drawAlmond(ctx) {
    const G = almondGeo(), TH = G.TH, un = UN(), bloom = lv('jrAlmond');
    sprites();
    // 开花时树后的柔光
    if (bloom > 0.02) { add1(ctx); glowSp(ctx, SP.gold, G.x, G.g - TH * 0.72, TH * 0.9, bloom * (0.12 + 0.25 * nightK())); norm(ctx); }
    ctx.lineCap = 'round';
    ctx.strokeStyle = css(BARK, 2, 1);
    for (let d = 0; d <= 4; d++) {
      ctx.beginPath();
      let w = 0;
      for (const s of ALMOND.segs) if (s[5] === d) { ctx.moveTo(G.x + s[0] * TH, G.g + s[1] * TH); ctx.lineTo(G.x + s[2] * TH, G.g + s[3] * TH); w = s[4]; }
      ctx.lineWidth = Math.max(0.6, w * TH);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    if (bloom < 0.01) return;
    // 花：自枝干向外，一朵一朵开出
    const nk = nightK(), pk = W.w < 600 ? 0.8 : 1;
    // 三种颜色，各一笔画完
    for (let bin = 0; bin < 3; bin++) {
      ctx.fillStyle = css(mix(BLOSSOM, PINK, bin * 0.4), 2, 1, 0.25 + 0.2 * nk);
      ctx.beginPath();
      for (const b of ALMOND.bl) {
        if (Math.min(2, Math.floor(b.c * 3)) !== bin) continue;
        const s = sm(b.o - 0.12, b.o + 0.05, bloom * 1.1);
        if (s < 0.02) continue;
        const r = Math.max(0.8, (1.1 + b.s * 1.2) * un * s * pk), x = G.x + b.x * TH, y = G.g + b.y * TH;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
      }
      ctx.fill();
    }
    if (nk > 0.1) {
      add1(ctx);
      ctx.fillStyle = 'rgb(255,240,244)';
      ctx.globalAlpha = 0.22 * nk * sm(0.3, 1, bloom);
      ctx.beginPath();
      for (const b of ALMOND.bl) { const s = sm(b.o - 0.12, b.o + 0.05, bloom * 1.1); if (s < 0.3) continue; const x = G.x + b.x * TH, y = G.g + b.y * TH, r = 2.2 * un; ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
      ctx.fill();
      norm(ctx);
    }
    // 飘落的花瓣
    if (bloom > 0.8) {
      ctx.fillStyle = css(PINK, 2, 1, 0.3);
      for (let i = 0; i < 9; i++) {
        const ph = fract(W.t * 0.06 + i * 0.137);
        const x = G.x + (hsh(i) - 0.5) * TH * 0.9 - ph * TH * 0.5 + Math.sin(ph * 7 + i) * TH * 0.08;
        const y = G.g + ALMOND.top * TH * 0.9 + ph * TH * 1.0;
        ctx.globalAlpha = (bloom - 0.8) * 5 * Math.sin(ph * Math.PI) * 0.8;
        ctx.fillRect(x, y, 1.6 * un, 1.1 * un);
      }
      ctx.globalAlpha = 1;
    }
  }
  // 亚拿突的那块地（32:9–15）：垄沟；异象里将来的葡萄园与房屋
  function drawField(ctx) {
    const un = UN(), hn = HN(), kv = lv('jrVision');
    const [a, b] = X.field;
    ctx.strokeStyle = css([96, 78, 56], 2, 0.3);
    ctx.lineWidth = Math.max(0.6, un * 0.9);
    ctx.beginPath();
    for (const v of FURROWS) {
      for (let i = 0; i <= 12; i++) { const xf = lerp(a + 0.01 * v, b, i / 12), y = fieldY(xf, v) + Math.sin(i * 0.9 + v * 7) * un; if (i === 0) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y); }
    }
    ctx.stroke();
    // 地界的石
    ctx.fillStyle = css([150, 140, 126], 2, 1);
    ctx.beginPath();
    for (const [xf, v] of [[a + 0.004, 0.3], [a + 0.012, 0.92]]) { const x = xf * W.w, y = fieldY(xf, v); ctx.moveTo(x + hn * 0.08, y); ctx.ellipse(x, y, hn * 0.08, hn * 0.05, 0, Math.PI, TAU); }
    ctx.fill();
    if (kv < 0.01) return;
    sprites();
    add1(ctx);
    // 金色的垄
    ctx.strokeStyle = U.rgba(255, 226, 150, 0.5 * kv);
    ctx.lineWidth = Math.max(0.8, un * 1.2);
    ctx.beginPath();
    for (const v of FURROWS) for (let i = 0; i <= 12; i++) { const xf = lerp(a + 0.01 * v, b, i / 12), y = fieldY(xf, v) + Math.sin(i * 0.9 + v * 7) * un; if (i === 0) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y); }
    ctx.stroke();
    // 葡萄园：沿着垄长出的葡萄树（光的叶、光的串）
    const kvv = sm(0.3, 0.95, kv);
    if (kvv > 0.01) {
      ctx.lineWidth = Math.max(0.7, un);
      FURROWS.forEach((v, r) => {
        const hv = hn * 0.2 * vk(v);
        ctx.strokeStyle = U.rgba(236, 226, 150, 0.45 * kvv);
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const u = i / 24, grow = c01(kvv * 1.4 - u * 0.4 - v * 0.3);
          if (grow <= 0) break;
          const xf = lerp(a + 0.01 * v, b, u), y = fieldY(xf, v) - hv * (0.6 + 0.4 * Math.sin(u * 19 + r * 2)) * grow;
          if (i === 0) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y);
        }
        ctx.stroke();
      });
      // 叶与串：各一笔画完
      const leaves = new Path2D(), grapes = new Path2D();
      FURROWS.forEach((v, r) => {
        const hv = hn * 0.2 * vk(v);
        for (let i = 1; i < 24; i += 2) {
          const u = i / 24, grow = c01(kvv * 1.4 - u * 0.4 - v * 0.3);
          if (grow < 0.3) continue;
          const xf = lerp(a + 0.01 * v, b, u), x = xf * W.w, y = fieldY(xf, v) - hv * (0.6 + 0.4 * Math.sin(u * 19 + r * 2));
          const lr = Math.max(0.8, hn * 0.045 * vk(v) * grow);
          leaves.moveTo(x, y - lr * 0.6); leaves.arc(x - lr, y - lr * 0.6, lr, 0, TAU);
          leaves.moveTo(x + lr * 1.8, y - lr * 0.2); leaves.arc(x + lr * 0.9, y - lr * 0.2, lr * 0.9, 0, TAU);
          if ((i + r) % 4 === 1) for (let j = 0; j < 4; j++) { const gx = x + (j % 2 - 0.5) * lr * 0.9, gy = y + lr * (0.8 + Math.floor(j / 2) * 0.8); grapes.moveTo(gx + lr * 0.45, gy); grapes.arc(gx, gy, lr * 0.45, 0, TAU); }
        }
      });
      ctx.fillStyle = U.rgba(190, 236, 140, 0.55 * kvv);
      ctx.fill(leaves);
      ctx.fillStyle = U.rgba(255, 214, 150, 0.7 * kvv);
      ctx.fill(grapes);
    }
    // 将来的房屋（光的轮廓）
    const kh = sm(0.4, 0.9, kv);
    ctx.strokeStyle = U.rgba(255, 238, 200, 0.6 * kh);
    ctx.fillStyle = U.rgba(255, 226, 170, 0.14 * kh);
    ctx.beginPath();
    for (const [xf, v, s] of [[0.87, 0.22, 0.8], [0.955, 0.3, 0.95]]) { const x = xf * W.w, y = fieldY(xf, v), w = hn * s * 0.9, h = hn * s * 0.6; ctx.rect(x - w / 2, y - h, w, h); }
    ctx.fill(); ctx.stroke();
    glowSp(ctx, SP.gold, (a + b) / 2 * W.w, fieldY((a + b) / 2, 0.55), hn * 2.4, 0.22 * kv);
    norm(ctx);
  }
  // 封着地契的瓦器（32:14）
  function drawDeed(ctx) {
    const k = lv('jrDeed');
    if (k < 0.01) return;
    const hn = HN(), un = UN(), x = X.deed * W.w, y = fieldY(X.deed, 0.34);
    sprites();
    add1(ctx);
    glowSp(ctx, SP.warm, x, y - hn * 0.15, hn * (0.5 + 0.3 * nightK()), k * (0.35 + 0.4 * nightK()));
    norm(ctx);
    ctx.globalAlpha = Math.min(1, k * 1.5);
    ctx.fillStyle = css(CLAY, 2, 1, 0.08);
    ctx.beginPath(); jarPath(ctx, x, y, hn * 0.3, POT, 0); ctx.fill();
    ctx.fillStyle = css([90, 70, 52], 2, 1);
    ctx.fillRect(x - hn * 0.08, y - hn * 0.32, hn * 0.16, hn * 0.04);
    ctx.strokeStyle = css(lit(CLAY), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, un * 0.8);
    ctx.beginPath(); jarPath(ctx, x, y, hn * 0.3, POT, 0); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 称银子（32:9–10）：一架小天平，几点银光
  function drawSilver(ctx) {
    if (S.silverT < -1e8) return;
    const t = W.t - S.silverT;
    if (t < 0 || t > 6) return;
    const a = sm(0, 0.6, t) * (1 - sm(5, 6, t)), hn = HN(), un = UN();
    const p = figPt('jr:jer', 0.55), f = fig('jr:jer');
    if (!p || !f) return;
    const x = p[0] + (f.fd || 1) * hn * 0.3, y = p[1];
    const tilt = Math.sin(t * 2.2) * 0.2 * (1 - sm(2, 4, t));
    ctx.globalAlpha = a;
    ctx.strokeStyle = css(BRONZE, 2, 1, 0.1);
    ctx.lineWidth = Math.max(0.6, un * 0.8);
    ctx.beginPath();
    ctx.moveTo(x, y - hn * 0.12); ctx.lineTo(x, y + hn * 0.02);
    const dx = Math.cos(tilt) * hn * 0.16, dy = Math.sin(tilt) * hn * 0.16;
    ctx.moveTo(x - dx, y - hn * 0.1 - dy); ctx.lineTo(x + dx, y - hn * 0.1 + dy);
    ctx.moveTo(x - dx, y - hn * 0.1 - dy); ctx.lineTo(x - dx, y - hn * 0.02 - dy);
    ctx.moveTo(x + dx, y - hn * 0.1 + dy); ctx.lineTo(x + dx, y - hn * 0.02 + dy);
    ctx.stroke();
    add1(ctx);
    ctx.fillStyle = 'rgb(236,240,255)';
    for (let i = 0; i < 5; i++) { ctx.globalAlpha = a * (0.5 + 0.5 * Math.sin(W.t * 9 + i * 2)); ctx.fillRect(x - dx - hn * 0.04 + i * hn * 0.02, y - hn * 0.03 - dy, 1.2 * un, 1.2 * un); }
    norm(ctx);
  }
  // 平安的意念：连到远方园子的金线（29:11）
  function drawThread(ctx) {
    const k = lv('jrThread');
    if (k < 0.01) return;
    const hn = HN(), hf = PH(0), p0 = figPt('jr:jer', 0.7) || [X.jer * W.w, gY(2, X.jer) - hn * 0.7];
    const p1 = [X.babylon * W.w, gY(0, X.babylon) - hf * 2.5];
    const cxp = W.w * (portrait() ? 0.5 : 0.7), cyp = W.h * (portrait() ? 0.32 : 0.12);
    add1(ctx);
    ctx.strokeStyle = U.rgba(255, 232, 170, 0.35 * k);
    ctx.lineWidth = Math.max(0.8, UN() * 1.2);
    ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(cxp, cyp, p1[0], p1[1]); ctx.stroke();
    sprites();
    for (let i = 0; i < 9; i++) {
      const t = fract(i / 9 + W.t * 0.07), x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * cxp + t * t * p1[0], y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * cyp + t * t * p1[1];
      glowSp(ctx, SP.gold, x, y, hn * 0.14, k * 0.9 * Math.sin(t * Math.PI));
    }
    glowSp(ctx, SP.gold, p1[0], p1[1] + hf, hf * 4, k * 0.45);
    norm(ctx);
  }
  // 永远的爱（31:3）：夜里一道温柔的光落在废墟上
  function drawLove(ctx) {
    const k = lv('jrLove');
    if (k < 0.01) return;
    sprites();
    const cx = W.w * 0.74, yb = gY(1, 0.74) + PH(1), w = W.w * 0.42;
    add1(ctx);
    ctx.globalAlpha = 0.16 * k;
    ctx.drawImage(SP.beam, cx - w / 2, -W.h * 0.05, w, yb + W.h * 0.05);
    ctx.globalAlpha = 0.12 * k;
    ctx.drawImage(SP.beam, cx - w * 0.2, -W.h * 0.05, w * 0.4, yb + W.h * 0.05);
    glowSp(ctx, SP.gold, cx, yb - PH(1) * 1.2, w * 0.45, 0.22 * k);
    ctx.fillStyle = 'rgb(255,236,196)';
    for (let i = 0; i < 24; i++) {
      const ph = fract(W.t * 0.05 + hsh(i) * 7), x = cx + (hsh(i + 3) - 0.5) * w * 0.8 + Math.sin(ph * 5 + i) * w * 0.03, y = ph * yb;
      ctx.globalAlpha = k * 0.6 * Math.sin(ph * Math.PI);
      ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
    }
    norm(ctx);
  }
  // 写在心上（31:33）：胸中一点金光
  function drawHearts(ctx) {
    const k = lv('jrHeart');
    if (k < 0.01) return;
    sprites();
    add1(ctx);
    const pts = [];
    for (const gid of ['jr:return', 'jr:poor']) for (const m of members(gid)) if (m._vis) pts.push([m._x, m._y - m._h * (m.pose === 'sit' || m.pose === 'kneel' ? 0.34 : 0.62), m._h, m.alpha || 1]);
    for (const id of ['jr:jer', 'jr:rachel', 'jr:potter']) { const f = fig(id); if (f && f._vis) pts.push([f._x, f._y - f._h * (f.pose === 'sit' || f.pose === 'seat' || f.pose === 'kneel' ? 0.36 : 0.62), f._h, f.alpha || 1]); }
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i], pulse = 0.85 + 0.15 * Math.sin(W.t * 2.2 + i * 1.7);
      glowSp(ctx, SP.gold, q[0], q[1], q[2] * 0.42 * pulse, k * 0.7 * q[3]);
      glowSp(ctx, SP.white, q[0], q[1], q[2] * 0.1, k * 0.9 * q[3]);
    }
    norm(ctx);
  }
  // 召命的光（1:5）与按在口上的火光（1:9）
  function drawCall(ctx) {
    sprites();
    const f = fig('jr:jer');
    if (!f) return;
    if (S.callT > -1e8) {
      const t = W.t - S.callT;
      if (t >= 0 && t < 14) {
        const a = sm(0, 2.5, t) * (1 - sm(9, 14, t)), p = figPt('jr:jer', 0), hn = HN();
        if (p) {
          add1(ctx);
          ctx.globalAlpha = 0.35 * a;
          ctx.drawImage(SP.beam, p[0] - hn * 1.3, -W.h * 0.05, hn * 2.6, p[1] + W.h * 0.05);
          glowSp(ctx, SP.gold, p[0], p[1] - hn * 0.5, hn * 1.4, 0.4 * a);
          norm(ctx);
        }
      }
    }
    if (S.touchT > -1e8) {
      const t = W.t - S.touchT;
      if (t >= 0 && t < 3.5) {
        const p = figPt('jr:jer', f.pose === 'kneel' ? 0.62 : 0.9), hn = HN();
        if (p) {
          const s = sm(0, 1.4, t), sx = p[0] + hn * 0.6, sy = p[1] - W.h * 0.3;
          const x = lerp(sx, p[0] + (f.fd || 1) * hn * 0.06, s), y = lerp(sy, p[1], s) - Math.sin(s * Math.PI) * hn * 0.4;
          add1(ctx);
          glowSp(ctx, SP.white, x, y, hn * 0.25 * (1 + (t > 1.4 ? (t - 1.4) * 1.5 : 0)), (t < 1.4 ? 0.9 : Math.max(0, 1 - (t - 1.4) / 2)));
          glowSp(ctx, SP.warm, x, y, hn * 0.6, 0.4 * (1 - sm(1.4, 3.5, t)));
          norm(ctx);
        }
      }
    }
  }

  // ── 近地：在大地之后、生灵之前 ──
  function each(ctx, list) { for (const f of list) { f(ctx); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; } }
  const NEAR_UNDER = [drawField, drawBrook, drawShed, drawCourt, drawCisterns, drawAnathoth, drawAlmond];
  function drawNearUnder(ctx) { each(ctx, NEAR_UNDER); }
  // ── 近地：人之后 ──
  const AIR = [drawWheel, drawPitFront, drawStocks, drawJar, drawBrazier, drawScrolls, drawDeed, drawSilver, drawBone, drawCall, drawHearts, drawThread, drawPour, drawLove];
  function drawAir(ctx) { each(ctx, AIR); }

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  // 牢狱里的位置：绳子系下的深度（jrSink）决定脚下的高度
  function pitFeet() { const G = cisGeo(1); return [G.x, G.y + lv('jrSink') * (pitDepth() - HN() * 0.1)]; }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '便雅悯地亚拿突城的祭司中，希勒家的儿子耶利米的话记在下面。<br>犹大王亚们的儿子约西亚在位十三年，耶和华的话临到耶利米。', ref: '耶利米书 1:1–2', hold: 8 },
  ];
  const V1 = [
    { text: '耶和华的话临到我说：「我未将你造在腹中，我已晓得你；<br>你未出母胎，我已分别你为圣；我已派你作列国的先知。」', ref: '耶利米书 1:4–5', hold: 8 },
    { text: '我就说：「主耶和华啊，我不知怎样说，因为我是年幼的。」<br>耶和华对我说：「你不要说我是年幼的，因为我差遣你到谁那里去，你都要去……」', ref: '耶利米书 1:6–7', hold: 8.5 },
    { text: '于是耶和华伸手按我的口，对我说：「我已将当说的话传给你。」', ref: '耶利米书 1:9', hold: 6 },
  ];
  const V2 = [
    { text: '耶和华的话又临到我说：「耶利米，你看见什么？」我说：「我看见一根杏树枝。」<br>耶和华对我说：「你看得不错；因为我留意保守我的话，使得成就。」', ref: '耶利米书 1:11–12', hold: 9 },
    { text: '耶和华的话第二次临到我说：「你看见什么？」我说：「我看见一个烧开的锅，从北而倾。」<br>耶和华对我说：「必有灾祸从北方发出，临到这地的一切居民。」', ref: '耶利米书 1:13–14', hold: 9 },
    { text: '「看哪，我今日使你成为坚城、铁柱、铜墙……<br>他们要攻击你，却不能胜你；因为我与你同在，要拯救你。」', ref: '耶利米书 1:18–19', hold: 7 },
  ];
  const V3 = [
    { text: '「因为我的百姓做了两件恶事，就是离弃我这活水的泉源，<br>为自己凿出池子，是破裂不能存水的池子。」', ref: '耶利米书 2:13', hold: 8 },
    { text: '在基列岂没有乳香呢？在那里岂没有医生呢？<br>我百姓为何不得痊愈呢？', ref: '耶利米书 8:22', hold: 6 },
    { text: '但愿我的头为水，我的眼为泪的泉源，<br>我好为我百姓中被杀的人昼夜哭泣。', ref: '耶利米书 9:1', hold: 7 },
  ];
  const V4 = [
    { text: '耶和华的话临到耶利米说：<br>「你起来，下到窑匠的家里去，我在那里要使你听我的话。」', ref: '耶利米书 18:1–2', hold: 6 },
    { text: '我就下到窑匠的家里去，正遇他转轮做器皿。', ref: '耶利米书 18:3', hold: 5.5 },
    { text: '窑匠用泥做的器皿，在他手中做坏了，<br>他又用这泥另做别的器皿；窑匠看怎样好，就怎样做。', ref: '耶利米书 18:4', hold: 8.5 },
  ];
  const V5 = [
    { text: '「以色列家啊，我待你们，岂不能照这窑匠弄泥吗？<br>以色列家啊，泥在窑匠的手中怎样，你们在我的手中也怎样。」', ref: '耶利米书 18:6', hold: 9 },
    { text: '「我何时论到一邦或一国说，要拔出、拆毁、毁坏；<br>我所说的那一邦，若是转意离开他们的恶，我就必后悔，不将我想要施行的灾祸降与他们。」', ref: '耶利米书 18:7–8', hold: 9 },
    { text: '「……你们各人当回头离开所行的恶道，改正你们的行动作为。」', ref: '耶利米书 18:11', hold: 6 },
  ];
  const V6 = [
    { text: '「你要在同去的人眼前打碎那瓶，对他们说：『万军之耶和华如此说：<br>我要照样打碎这民和这城，正如人打碎窑匠的瓦器，以致不能再囫囵……』」', ref: '耶利米书 19:10–11', hold: 9 },
    { text: '祭司音麦的儿子巴施户珥……听见耶利米预言这些事，<br>他就打先知耶利米，用耶和华殿里便雅悯高门内的枷，将他枷在那里。', ref: '耶利米书 20:1–2', hold: 8 },
    { text: '我若说：「我不再提耶和华，也不再奉他的名讲论」，<br>我便心里觉得似乎有烧着的火闭塞在我骨中，我就含忍不住，不能自禁。', ref: '耶利米书 20:9', hold: 8.5 },
  ];
  const V7 = [
    { text: '所以，耶利米召了尼利亚的儿子巴录来；<br>巴录就从耶利米口中，将耶和华对耶利米所说的一切话写在书卷上。', ref: '耶利米书 36:4', hold: 7.5 },
    { text: '那时正是九月，王坐在过冬的房屋里，王的前面火盆中有烧着的火。<br>犹底念了三四篇，王就用文士的刀将书卷割破，扔在火盆中，直到全卷在火中烧尽了。', ref: '耶利米书 36:22–23', hold: 9.5 },
    { text: '于是，耶利米又取一书卷交给尼利亚的儿子文士巴录，<br>他就从耶利米的口中写了犹大王约雅敬所烧前卷上的一切话，另外又添了许多相仿的话。', ref: '耶利米书 36:32', hold: 9 },
  ];
  const V8 = [
    { text: '先知耶利米从耶路撒冷寄信与被掳的祭司、先知，和众民……<br>就是尼布甲尼撒从耶路撒冷掳到巴比伦去的。', ref: '耶利米书 29:1', hold: 7.5 },
    { text: '「你们要盖造房屋，住在其中；栽种田园，吃其中所产的……<br>我所使你们被掳到的那城，你们要为那城求平安……」', ref: '耶利米书 29:5–7', hold: 8 },
    { text: '耶和华说：「我知道我向你们所怀的意念是赐平安的意念，<br>不是降灾祸的意念，要叫你们末后有指望。」', ref: '耶利米书 29:11', hold: 8 },
  ];
  const V9 = [
    { text: '巴比伦王尼布甲尼撒率领全军来攻击耶路撒冷，<br>对城安营，四围筑垒攻城。', ref: '耶利米书 52:4', hold: 6.5 },
    { text: '他们就拿住耶利米……他们用绳子将耶利米系下去。<br>牢狱里没有水，只有淤泥，耶利米就陷在淤泥中。', ref: '耶利米书 38:6', hold: 7.5 },
    { text: '古实人以伯‧米勒……用绳子缒下牢狱去到耶利米那里……<br>这样，他们用绳子将耶利米从牢狱里拉上来。耶利米仍在护卫兵的院中。', ref: '耶利米书 38:11–13', hold: 8.5 },
  ];
  const V10 = [
    { text: '那时巴比伦王的军队围困耶路撒冷，先知耶利米囚在护卫兵的院内……<br>我便向我叔叔的儿子哈拿篾买了亚拿突的那块地，平了十七舍客勒银子给他。', ref: '耶利米书 32:2、9', hold: 9 },
    { text: '「……要将这封缄的和敞着的两张契放在瓦器里，可以存留多日。<br>因为万军之耶和华以色列的神如此说：将来在这地必有人再买房屋、田地，和葡萄园。」', ref: '耶利米书 32:14–15', hold: 9 },
    { text: '「主耶和华啊，你曾用大能和伸出来的膀臂创造天地，在你没有难成的事。」……<br>「我是耶和华，是凡有血气者的神，岂有我难成的事吗？」', ref: '耶利米书 32:17、27', hold: 9 },
  ];
  const V11 = [
    { text: '西底家十一年四月初九日，城被攻破。', ref: '耶利米书 39:2', hold: 5 },
    { text: '用火焚烧耶和华的殿和王宫，又焚烧耶路撒冷的房屋……<br>跟从护卫长迦勒底的全军就拆毁耶路撒冷四围的城墙。', ref: '耶利米书 52:13–14', hold: 7.5 },
    { text: '那时，护卫长尼布撒拉旦将城里所剩下的百姓和投降他的逃民，<br>以及其余的民都掳到巴比伦去了。', ref: '耶利米书 39:9', hold: 7 },
    { text: '……将耶利米从护卫兵院中提出来，交与沙番的孙子亚希甘的儿子基大利，带回家去。<br>于是耶利米住在民中。', ref: '耶利米书 39:14', hold: 7 },
  ];
  const V12 = [
    { text: '古时耶和华向以色列显现，说：<br>「我以永远的爱爱你，因此我以慈爱吸引你。」', ref: '耶利米书 31:3', hold: 7 },
    { text: '耶和华如此说：「在拉玛听见号咷痛哭的声音，<br>是拉结哭她儿女，不肯受安慰，因为他们都不在了。」', ref: '耶利米书 31:15', hold: 8 },
    { text: '耶和华如此说：「你禁止声音不要哀哭，禁止眼目不要流泪……他们必从敌国归回。这是耶和华说的。」<br>耶和华说：「你末后必有指望；你的儿女必回到自己的境界。」', ref: '耶利米书 31:16–17', hold: 9 },
  ];
  const V13 = [
    { text: '耶和华说：「当那日子、那时候，以色列人要和犹大人同来，随走随哭，<br>寻求耶和华他们的神。他们必访问锡安，又面向这里……」', ref: '耶利米书 50:4–5', hold: 8.5 },
    { text: '「日子将到，我要与以色列家和犹大家另立新约……<br>我要将我的律法放在他们里面，写在他们心上。我要作他们的神，他们要作我的子民。」', ref: '耶利米书 31:31、33', hold: 9 },
    { text: '「……他们从最小的到至大的都必认识我。<br>我要赦免他们的罪孽，不再记念他们的罪恶。」', ref: '耶利米书 31:34', hold: 7 },
  ];
  const V14 = [
    { text: '那使太阳白日发光，使星月有定例，黑夜发亮，又搅动大海，使海中波浪匉訇的，<br>万军之耶和华是他的名。', ref: '耶利米书 31:35', hold: 8 },
    { text: '耶和华说：「日子将到，这城必为耶和华建造，从哈楠业楼直到角门。<br>准绳要往外量出……」', ref: '耶利米书 31:38–39', hold: 8 },
    { text: '「……都要归耶和华为圣，不再拔出，不再倾覆，直到永远。」', ref: '耶利米书 31:40', hold: 7 },
  ];
  const t1 = starts(V1), t2 = starts(V2), t3 = starts(V3), t4 = starts(V4), t5 = starts(V5), t6 = starts(V6), t7 = starts(V7);
  const t8 = starts(V8), t9 = starts(V9), t10 = starts(V10), t11 = starts(V11), t12 = starts(V12), t13 = starts(V13), t14 = starts(V14);

  // ════════════════════════════════════════════════════════════
  //  幕后布置：亚拿突的黎明前
  // ════════════════════════════════════════════════════════════
  function setup() {
    S = fresh();
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 1, herbs: 0.6, trees: 0.15,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1, bare: 0.28, bloom: 0.35 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('jrSpring', 0.6, true);
    // 树只长在海边的坡上（活水的溪流入海处）
    const tx = W.w * 0.37, gx = W.w * 0.7;
    W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
    W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
    W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
    W.freeClock = false;
    W.goTo(0.235, 0, true);
    const lx = W.w * 0.42, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 110, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 10, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    const c = C();
    c.clear({ fade: false });
    add('jr:jer', { label: '耶利米', sex: 'm', age: 'adult', x: X.jer, facing: -1, robe: ROBE.jer, glow: 0.3, from: 'none', scale: 0.96 });
    add('jr:hilkiah', { label: '希勒家', sex: 'm', age: 'elder', x: X.hilkiah, facing: -1, robe: ROBE.hilkiah, pose: 'sit', from: 'none', prop: null });
    add('jr:potter', { label: '窑匠', sex: 'm', age: 'adult', x: X.potter, facing: -1, robe: ROBE.potter, pose: 'seat', from: 'none', glow: 0.1 });
    crowd('jr:city', { n: 9, x0: 0.6, x1: 0.86, layer: 1, label: '耶路撒冷的居民', from: 'none', v: 0.42 });
    avoid([0.5, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '耶利米书', books: [24], title: '耶利米', sub: '耶利米书 1 — 52', tint: [230, 210, 190], music: 'cain',
    intro: INTRO,
    outro: 20,
    behold: {
      '耶利米': { text: '「我未将你造在腹中，我已晓得你；你未出母胎，我已分别你为圣；<br>我已派你作列国的先知。」', ref: '耶利米书 1:5' },
      '杏树': { text: '耶和华的话又临到我说：「耶利米，你看见什么？」我说：「我看见一根杏树枝。」<br>耶和华对我说：「你看得不错；因为我留意保守我的话，使得成就。」', ref: '耶利米书 1:11–12' },
      '希勒家': { text: '便雅悯地亚拿突城的祭司中，希勒家的儿子耶利米的话记在下面。', ref: '耶利米书 1:1' },
      '亚拿突': { text: '便雅悯地亚拿突城的祭司中，希勒家的儿子耶利米的话记在下面。', ref: '耶利米书 1:1' },
      '活水的泉源': { text: '「因为我的百姓做了两件恶事，就是离弃我这活水的泉源，<br>为自己凿出池子，是破裂不能存水的池子。」', ref: '耶利米书 2:13' },
      '破裂的池子': { text: '「……为自己凿出池子，是破裂不能存水的池子。」', ref: '耶利米书 2:13' },
      '牢狱': { text: '他们就拿住耶利米，下在哈米勒的儿子玛基雅的牢狱里；那牢狱在护卫兵的院中……<br>牢狱里没有水，只有淤泥，耶利米就陷在淤泥中。', ref: '耶利米书 38:6' },
      '窑匠': { text: '窑匠用泥做的器皿，在他手中做坏了，<br>他又用这泥另做别的器皿；窑匠看怎样好，就怎样做。', ref: '耶利米书 18:4' },
      '窑匠的家': { text: '我就下到窑匠的家里去，正遇他转轮做器皿。', ref: '耶利米书 18:3' },
      '窑': { text: '「以色列家啊，泥在窑匠的手中怎样，你们在我的手中也怎样。」', ref: '耶利米书 18:6' },
      '耶路撒冷': { text: '耶和华说：「日子将到，这城必为耶和华建造，从哈楠业楼直到角门……<br>不再拔出，不再倾覆，直到永远。」', ref: '耶利米书 31:38–40' },
      '耶和华的殿': { text: '「你当站在耶和华殿的门口，在那里宣传这话说：<br>你们进这些门敬拜耶和华的一切犹大人，当听耶和华的话。」', ref: '耶利米书 7:2' },
      '过冬的房屋': { text: '那时正是九月，王坐在过冬的房屋里，王的前面火盆中有烧着的火。', ref: '耶利米书 36:22' },
      '火盆': { text: '犹底念了三四篇，王就用文士的刀将书卷割破，扔在火盆中，直到全卷在火中烧尽了。', ref: '耶利米书 36:23' },
      '书卷': { text: '王烧了书卷……以后，耶和华的话临到耶利米说：<br>「你再取一卷，将犹大王约雅敬所烧第一卷上的一切话写在其上。」', ref: '耶利米书 36:27–28' },
      '巴录': { text: '「你为自己图谋大事吗？不要图谋！……<br>但你无论往哪里去，我必使你以自己的命为掠物。」', ref: '耶利米书 45:5' },
      '约雅敬王': { text: '王和听见这一切话的臣仆都不惧怕，也不撕裂衣服。', ref: '耶利米书 36:24' },
      '犹底': { text: '王就打发犹底去拿这书卷来……念给王和王左右侍立的众首领听。', ref: '耶利米书 36:21' },
      '巴施户珥': { text: '次日，巴施户珥将耶利米开枷释放。', ref: '耶利米书 20:3' },
      '以伯‧米勒': { text: '「我定要搭救你，你不致倒在刀下，却要以自己的命为掠物，因你倚靠我。这是耶和华说的。」', ref: '耶利米书 39:18' },
      '哈拿篾': { text: '我叔叔的儿子哈拿篾果然照耶和华的话来到护卫兵的院内……<br>我耶利米就知道这是耶和华的话。', ref: '耶利米书 32:8' },
      '瓦器': { text: '「……要将这封缄的和敞着的两张契放在瓦器里，可以存留多日。」', ref: '耶利米书 32:14' },
      '亚拿突的地': { text: '「……人必用银子买田地，在契上画押，将契封缄，请出见证人，<br>因为我必使被掳的人归回。这是耶和华说的。」', ref: '耶利米书 32:44' },
      '巴比伦': { text: '「巴比伦因耶和华所要降与她的灾祸，必如此沉下去，不再兴起……」', ref: '耶利米书 51:64' },
      '以利亚萨': { text: '他藉沙番的儿子以利亚萨和希勒家的儿子基玛利的手寄去。', ref: '耶利米书 29:3' },
      '拉结': { text: '耶和华如此说：「在拉玛听见号咷痛哭的声音，是拉结哭她儿女……」<br>耶和华说：「你末后必有指望；你的儿女必回到自己的境界。」', ref: '耶利米书 31:15、17' },
      '归回的人': { text: '他们要哭泣而来。我要照他们恳求的引导他们，<br>使他们在河水旁走正直的路，在其上不致绊跌……', ref: '耶利米书 31:9' },
      '剩下的穷人': { text: '护卫长尼布撒拉旦却将民中毫无所有的穷人留在犹大地，当时给他们葡萄园和田地。', ref: '耶利米书 39:10' },
      '耶路撒冷的居民': { text: '「你们寻求我，若专心寻求我，就必寻见。」', ref: '耶利米书 29:13' },
      '被掳的人': { text: '「你们要盖造房屋，住在其中；栽种田园，吃其中所产的。」', ref: '耶利米书 29:5' },
      '准绳': { text: '「准绳要往外量出，直到迦立山，又转到歌亚。」', ref: '耶利米书 31:39' },
      '犹大人': { text: '万军之耶和华以色列的神如此说：<br>你们改正行动作为，我就使你们在这地方仍然居住。', ref: '耶利米书 7:3' },
      '长老': { text: '耶和华如此说：「你去买窑匠的瓦瓶，又带百姓中的长老和祭司中的长老……」', ref: '耶利米书 19:1' },
      '众首领': { text: '于是首领对王说：「求你将这人治死……<br>这人不是求这百姓得平安，乃是叫他们受灾祸。」', ref: '耶利米书 38:4' },
      '三十人': { text: '王就吩咐古实人以伯‧米勒说：「你从这里带领三十人，<br>趁着先知耶利米未死以前，将他从牢狱中提上来。」', ref: '耶利米书 38:10' },
      '见证人': { text: '当着我叔叔的儿子哈拿篾和画押作见证的人，并坐在护卫兵院内的一切犹大人眼前，<br>交给玛西雅的孙子尼利亚的儿子巴录。', ref: '耶利米书 32:12' },
    },
    setup,
    stages: [
      // ── 1:4–9 召命 ────────────────────────────────────────
      {
        kind: 'call', utter: '我未将你造在腹中，我已晓得你', cmd: 'init 耶利米 --known-before=womb --role 列国的先知', ref: '1:5',
        verse: V1,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.31, 16, b.instant);
              S.callT = b.instant ? -1e9 : W.t;
              glowP('jr:jer', 0.45);
              face('jr:jer', 1);
              pose('jr:jer', 'gaze');
              sfx(b, 'harp', { soft: true });
            }],
            [t1[1], b => { pose('jr:jer', 'kneel'); face('jr:jer', 1); }],
            [t1[2], b => {
              S.touchT = b.instant ? -1e9 : W.t;
              sfx(b, 'chime');
            }],
            [t1[2] + 1.5, b => { glowP('jr:jer', 0.7); if (!b.instant) { const p = figPt('jr:jer', 0.62); if (p) safe('jr.sparkle', () => fx().sparkle(p[0], p[1], 18, [255, 236, 190], 6, 'top')); } }],
            [t1[2] + 3.5, b => { pose('jr:jer', 'stand'); }],
          ]);
        },
      },

      // ── 1:11–19 杏树枝；烧开的锅 ──────────────────────────
      {
        kind: 'promise', utter: '我留意保守我的话，使得成就', cmd: 'watch 杏树枝 --until 成就', ref: '1:12',
        verse: V2,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.38, 14, b.instant);
              face('jr:jer', -1);
              pose('jr:jer', 'gaze');
              W.set('jrAlmond', 1, b.instant);
              if (!b.instant) { const G = almondGeo(); safe('jr.bloom', () => fx().sparkle(G.x, G.g - G.TH * 0.7, 30, [255, 236, 244], G.TH * 0.4, 'top')); }
              sfx(b, 'harp', { soft: true });
            }],
            [t2[1], b => {
              W.set('jrPot', 1, b.instant);
              W.set('jrPotTilt', 1, b.instant);
              face('jr:jer', 1);
              pose('jr:jer', 'stand');
              sfx(b, 'thunder', { far: true, low: true, soft: true });
            }],
            [t2[1] + 5, b => { sfx(b, 'fire', { far: true, soft: true }); }],
            [t2[2], b => {
              W.set('jrPot', 0, b.instant);
              W.set('jrPotTilt', 0, b.instant);
              glowP('jr:jer', 0.8);
              pose('jr:jer', 'raise');
              if (!b.instant) { const p = figPt('jr:jer', 0.5); if (p) safe('jr.ring', () => fx().ring(p[0], p[1], [236, 190, 120], HN() * 2.2, 2.2, 2)); }
              sfx(b, 'seal', { soft: true });
            }],
            [t2[2] + 3.5, b => { pose('jr:jer', 'stand'); walk('jr:jer', 0.7, { speed: 0.035 }); }],
          ]);
        },
      },

      // ── 2:13；8:22；9:1 离弃活水的泉源；先知的眼泪 ────────
      {
        kind: 'judge', utter: '离弃我这活水的泉源', cmd: 'diff 活水的泉源 破裂的池子  # 两件恶事', ref: '2:13',
        verse: V3,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.46, 14, b.instant);
              W.set('jrSpring', 1, b.instant);
              walk('jr:jer', 0.7, { speed: 0.035 });
              crowd('jr:people', { n: 8, x0: 0.6, x1: 0.69, label: '犹大人', from: b.instant ? 'none' : 'fade', mill: false });
              sfx(b, 'splash', { soft: true, x: X.spring });
            }],
            [2.6, b => {
              crowdWalk('jr:people', 0.77, 0.87, { pose: 'kneel', speed: 0.03 });
              W.set('jrCistern', 1, b.instant);
            }],
            [5.5, b => {
              if (!b.instant) for (let i = 0; i < 3; i++) { const G = cisGeo(i); safe('jr.dust', () => fx().dust(G.x, G.y, 16, [210, 180, 140], G.rx)); }
              sfx(b, 'build', { soft: true });
            }],
            [6.5, b => { W.set('jrWater', 1, b.instant); }],
            [t3[1], b => {
              W.set('jrCrack', 1, b.instant);
              W.set('jrWater', 0, b.instant);
              W.set('jrSpring', 0.28, b.instant);
              sfx(b, 'build', { soft: true, low: true });
            }],
            [t3[1] + 2.2, b => { crowdPose('jr:people', 'stand'); }],
            [t3[2], b => {
              pose('jr:jer', 'weep');
              face('jr:jer', -1);
              W.set('rain', 0.42, b.instant);
              W.set('storm', 0.3, b.instant);
              W.set('clouds', 0.85, b.instant);
              sfx(b, 'weep', { soft: true });
            }],
          ]);
        },
      },

      // ── 18:1–4 窑匠的家 ───────────────────────────────────
      {
        kind: 'cmd', utter: '你起来，下到窑匠的家里去', cmd: 'cd ~/窑匠的家 && spin wheel', ref: '18:2',
        verse: V4,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.6, 12, b.instant);
              W.set('rain', 0, b.instant);
              W.set('storm', 0, b.instant);
              W.set('clouds', 0.45, b.instant);
              pose('jr:jer', 'stand');
              walk('jr:jer', 0.55, { speed: 0.035 });
              face('jr:jer', 1);
              crowdWalk('jr:people', 0.76, 0.88, { pose: 'stand', speed: 0.02 });
            }],
            [1.2, b => { W.set('jrWheel', 1, b.instant); sfx(b, 'splash', { soft: true, x: X.potter }); }],
            [t4[1] + 0.8, b => { W.set('jrForm', 1, b.instant); }],
            [t4[2] + 1, b => { W.set('jrForm', 2, b.instant); sfx(b, 'build', { soft: true, low: true }); }],
            [t4[2] + 4.5, b => { W.set('jrForm', 3, b.instant); sfx(b, 'harp', { soft: true }); }],
          ]);
        },
      },

      // ★ 18:6–11 泥在窑匠的手中（签名画面）
      {
        kind: 'cmd', utter: '泥在窑匠的手中怎样，你们在我的手中也怎样', cmd: 'git reset --soft 以色列家  # 泥在我手中', ref: '18:6',
        verse: V5,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.74, 13, b.instant);
              W.set('jrSign', 1, b.instant);
              W.set('jrSForm', 0, b.instant);
              W.set('jrGlory', 0, b.instant);
              pose('jr:jer', 'gaze');
              crowdPose('jr:city', 'gaze');
              crowdPose('jr:people', 'gaze');
              sfx(b, 'angel', { soft: true });
            }],
            [1, b => { W.set('jrSForm', 1, b.instant); }],
            [6, b => { W.set('jrSForm', 2, b.instant); sfx(b, 'thunder', { far: true, low: true, soft: true }); }],
            [t5[1], b => { W.set('jrSForm', 3, b.instant); sfx(b, 'harp'); }],
            [t5[1] + 4, b => {
              W.set('jrGlory', 1, b.instant);
              if (!b.instant) { const G = signGeo(); safe('jr.ring', () => fx().ring(G.cx, G.base - G.S * 0.6, [255, 232, 180], G.S * 1.6, 2.6, 2)); }
              sfx(b, 'chime');
            }],
            [t5[2], b => { W.set('jrGlory', 0.35, b.instant); W.set('jrWheel', 0.25, b.instant); }],
            [t5[2] + 2.5, b => {
              W.set('jrSign', 0, b.instant);
              W.set('jrGlory', 0, b.instant);
              crowdPose('jr:city', 'stand');
              pose('jr:jer', 'stand');
            }],
          ]);
        },
      },

      // ── 19:10–11；20:1–9 打碎瓦瓶；枷；骨中的火 ─────────────
      {
        kind: 'judge', utter: '你要在同去的人眼前打碎那瓶', cmd: 'rm -f 瓦瓶  # 不能再囫囵', ref: '19:10',
        verse: V6,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.9, 18, b.instant);
              W.set('jrSign', 0, b.instant);
              W.set('jrWheel', 0, b.instant);
              W.set('jrSForm', 0, b.instant);
              unCrowd('jr:people');
              S.jar = 'carry';
              pose('jr:jer', 'stand');
              walk('jr:jer', X.gate, { speed: 0.035 });
              crowd('jr:elders', { n: 5, x0: 0.62, x1: 0.68, label: '长老', robe: ELDERS[2], from: b.instant ? 'none' : 'fade', mill: false });
              elderTorches();
              crowdWalk('jr:elders', 0.53, 0.575, { speed: 0.035 });
              avoid([0.48, 1]);
            }],
            [4.2, b => { face('jr:jer', 1); pose('jr:jer', 'raise'); S.jar = 'raise'; }],
            [6, b => {
              S.jar = 'broken';
              S.smashT = b.instant ? -1e9 : W.t;
              pose('jr:jer', 'point');
              crowdWalk('jr:elders', 0.545, 0.6, { speed: 0.03 });
              if (!b.instant) { W.shake = Math.max(W.shake || 0, 0.5); const p = figPt('jr:jer', 1.05); if (p) safe('jr.dust', () => fx().dust(p[0], fieldY(X.gate, 0.06), 20, [200, 150, 110], HN() * 0.4)); }
              sfx(b, 'build');
            }],
            [t6[1], b => {
              add('jr:pashhur', { label: '巴施户珥', sex: 'm', age: 'adult', x: 0.64, facing: -1, robe: ROBE.pashhur, accent: GOLD, glow: 0.05, prop: 'torch', from: b.instant ? 'none' : 'fade' });
              walk('jr:pashhur', X.gate + 0.03, { speed: 0.04 });
            }],
            [t6[1] + 3, b => {
              pose('jr:jer', 'sit');
              face('jr:jer', 1);
              W.set('jrStocks', 1, b.instant);
              sfx(b, 'gate');
            }],
            [t6[1] + 4.5, b => {
              unCrowd('jr:elders');
              walk('jr:pashhur', 0.62, { speed: 0.035 });
            }],
            [t6[2], b => {
              rm('jr:pashhur');
              W.set('jrBone', 1, b.instant);
              glowP('jr:jer', 0.9);
              sfx(b, 'fire', { soft: true });
            }],
          ]);
        },
      },

      // ── 36:1–32 书卷：写成、割破、烧尽、再写 ───────────────
      {
        kind: 'cmd', utter: '你取一书卷', cmd: 'cp 书卷 书卷.v2 --append 许多相仿的话', ref: '36:2',
        verse: V7,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.02, 12, b.instant);
              W.set('jrStocks', 0, b.instant);
              W.set('jrBone', 0.22, b.instant);
              glowP('jr:jer', 0.45);
              pose('jr:jer', 'stand');
              walk('jr:jer', 0.925, { speed: 0.06 });
              add('jr:baruch', { label: '巴录', sex: 'm', age: 'adult', x: 0.9, facing: -1, robe: ROBE.baruch, pose: 'sit', glow: 0.25, from: b.instant ? 'none' : 'fade' });
              S.scroll1 = 'baruch';
              W.set('jrScroll1', 1, b.instant);
              W.set('jrCourt', 1, b.instant);
              W.set('jrBrazier', 1, b.instant);
              add('jr:king', { label: '约雅敬王', sex: 'm', age: 'adult', x: X.king, facing: 1, robe: ROBE.king, accent: GOLD, pose: 'seat', glow: 0.05, from: b.instant ? 'none' : 'fade' });
              add('jr:jehudi', { label: '犹底', sex: 'm', age: 'adult', x: X.jehudi, facing: 1, robe: ROBE.jehudi, from: b.instant ? 'none' : 'fade', glow: 0.05 });
              crowd('jr:princes', { n: 3, x0: 0.668, x1: 0.69, label: '众首领', robe: [96, 64, 88], from: b.instant ? 'none' : 'fade', mill: false });
              crowdFace('jr:princes', 1);
              sfx(b, 'fire', { soft: true });
            }],
            [1.8, b => { walk('jr:jehudi', 0.878, { speed: 0.045 }); }],
            [5.4, b => { face('jr:baruch', -1); }],
            [5.8, b => { S.scroll1 = 'jehudi'; walk('jr:jehudi', X.jehudi, { speed: 0.045 }); }],
            [9.8, b => { face('jr:jehudi', -1); pose('jr:jehudi', 'carry'); }],
            [t7[1] + 2.2, b => {
              S.burnT = b.instant ? -1e9 : W.t;
              W.set('jrScroll1', 0, b.instant);
              sfx(b, 'fire');
            }],
            [t7[1] + 8, b => {
              S.scroll1 = 'gone';
              pose('jr:jehudi', 'stand');
              sfx(b, 'fire', { soft: true });
            }],
            [t7[2], b => {
              W.set('jrScroll2', 1, b.instant);
              face('jr:baruch', 1);
              face('jr:jer', -1);
              pose('jr:jer', 'point');
              sfx(b, 'harp', { soft: true });
            }],
          ]);
        },
      },

      // ── 29:1–14 寄给被掳之人的信 ───────────────────────────
      {
        kind: 'promise', utter: '我知道我向你们所怀的意念', cmd: 'mail -s 平安的意念 被掳的人@巴比伦', ref: '29:11',
        verse: V8,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.3, 7, b.instant);
              rm('jr:king'); rm('jr:jehudi'); unCrowd('jr:princes');
              W.set('jrBrazier', 0, b.instant);
              W.set('jrScroll2', 0, b.instant);
              W.set('jrBone', 0, b.instant);
              pose('jr:jer', 'stand');
              // 头一批被掳的：耶哥尼雅王、首领、工匠、铁匠（24:1；29:2）
              crowd('jr:exile1', { n: 7, x0: 0.8, x1: 0.87, layer: 1, label: '被掳的人', from: b.instant ? 'none' : 'fade', mill: false, v: 0.42 });
              crowdWalk('jr:exile1', 1.03, 1.12, { speed: 0.028 });
              W.set('jrBabylon', 1, b.instant);
              sfx(b, 'weep', { soft: true, far: true });
            }],
            [7.5, b => { unCrowd('jr:exile1'); }],
            [t8[1] - 0.8, b => {
              pose('jr:jer', 'sit');
              face('jr:jer', 1);
              S.letter = 'jer';
              rm('jr:baruch');
              add('jr:elasah', { label: '以利亚萨', sex: 'm', age: 'adult', x: 0.975, facing: -1, robe: ROBE.elasah, from: b.instant ? 'none' : 'fade', glow: 0.05 });
              walk('jr:elasah', 0.945, { speed: 0.03 });
            }],
            [t8[1] + 3.2, b => {
              S.letter = 'elasah';
              pose('jr:jer', 'stand');
              walk('jr:elasah', 1.06, { speed: 0.04 });
              W.set('jrGardens', 1, b.instant);
            }],
            [t8[2], b => {
              S.letter = 'sent';
              rm('jr:elasah');
              W.set('jrThread', 1, b.instant);
              pose('jr:jer', 'gaze');
              sfx(b, 'harp');
            }],
          ]);
        },
      },

      // ── 52:4；38:1–13 围城；牢狱与淤泥；以伯‧米勒 ─────────────
      {
        kind: 'promise', utter: '你求告我，我就应允你', cmd: 'await 求告() && then(应允)', ref: '33:3',
        verse: V9,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.86, 14, b.instant);
              W.set('jrThread', 0, b.instant);
              W.set('jrSiege', 1, b.instant);
              W.set('jrBabylon', 0.55, b.instant);
              pose('jr:jer', 'stand');
              walk('jr:jer', 0.8, { speed: 0.04 });
              sfx(b, 'crowd', { far: true });
              sfx(b, 'thunder', { far: true, low: true, soft: true });
            }],
            [t9[1] - 0.5, b => {
              crowd('jr:princes', { n: 3, x0: 0.83, x1: 0.86, label: '众首领', robe: [96, 64, 88], from: b.instant ? 'none' : 'fade', mill: false, prop: 'torch' });
              crowdFace('jr:princes', -1);
              W.set('jrPit', 1, b.instant);
            }],
            [t9[1] + 1, b => {
              walk('jr:jer', X.pit, { speed: 0.03 });
            }],
            [t9[1] + 1.8, b => {
              S.pit = true;
              attach('jr:jer', pitFeet);
              pose('jr:jer', 'raise');
              W.set('jrRope', 1, b.instant);
              W.set('jrSink', 1, b.instant);
            }],
            [t9[1] + 5.6, b => {
              W.set('jrRope', 0, b.instant);
              W.set('jrMud', 1, b.instant);
              pose('jr:jer', 'weep');
              unCrowd('jr:princes');
              sfx(b, 'weep', { soft: true });
            }],
            [t9[2], b => {
              add('jr:ebed', { label: '以伯‧米勒', sex: 'm', age: 'adult', x: 0.885, facing: -1, robe: ROBE.ebed, hair: 'cloth', accent: [236, 230, 214], glow: 0.35, from: b.instant ? 'none' : 'fade' });
              walk('jr:ebed', 0.838, { speed: 0.04 });
              crowd('jr:men', { n: 3, x0: 0.85, x1: 0.88, label: '三十人', from: b.instant ? 'none' : 'fade', mill: false, prop: 'torch' });
              crowdFace('jr:men', -1);
            }],
            [t9[2] + 1.6, b => { W.set('jrRope', 1, b.instant); pose('jr:jer', 'raise'); }],
            [t9[2] + 2.6, b => { W.set('jrSink', 0, b.instant); W.set('jrMud', 0, b.instant); sfx(b, 'harp', { soft: true }); }],
            [t9[2] + 6.4, b => {
              S.pit = false;
              attach('jr:jer', null);
              const f = fig('jr:jer'); if (f) { f.nx = X.pit; f.tx = null; }
              pose('jr:jer', 'stand');
              walk('jr:jer', 0.8, { speed: 0.03 });
              W.set('jrRope', 0, b.instant);
              W.set('jrPit', 0, b.instant);
            }],
            [t9[2] + 7.4, b => { unCrowd('jr:men'); walk('jr:ebed', 0.86, { speed: 0.03 }); }],
          ]);
        },
      },

      // ── 32:1–27 围城中买下亚拿突的地 ───────────────────────
      {
        kind: 'ask', utter: '岂有我难成的事吗？', cmd: 'buy 亚拿突的地 --price 17舍客勒 --store 瓦器', ref: '32:27',
        verse: V10,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.37, 7, b.instant);
              rm('jr:ebed');
              face('jr:jer', 1);
              add('jr:hanamel', { label: '哈拿篾', sex: 'm', age: 'adult', x: 0.985, facing: -1, robe: ROBE.hanamel, from: b.instant ? 'none' : 'fade', glow: 0.1 });
              walk('jr:hanamel', 0.832, { speed: 0.035 });
              add('jr:baruch', { label: '巴录', sex: 'm', age: 'adult', x: 0.776, facing: 1, robe: ROBE.baruch, pose: 'stand', glow: 0.25, from: b.instant ? 'none' : 'fade' });
              crowd('jr:witness', { n: 3, x0: 0.742, x1: 0.768, label: '见证人', from: b.instant ? 'none' : 'fade', mill: false, pose: 'sit' });
              crowdFace('jr:witness', 1);
            }],
            [5.2, b => { S.silverT = b.instant ? -1e9 : W.t; sfx(b, 'chime', { soft: true }); }],
            [t10[1], b => {
              W.set('jrDeed', 1, b.instant);
              pose('jr:baruch', 'kneel');
              sfx(b, 'seal');
            }],
            [t10[1] + 3, b => {
              W.set('jrVision', 1, b.instant);
              pose('jr:baruch', 'stand');
              if (!b.instant) { const a = X.field; safe('jr.sparkle', () => fx().sparkle((a[0] + a[1]) / 2 * W.w, fieldY((a[0] + a[1]) / 2, 0.5), 40, [255, 232, 170], W.w * 0.06, 'top')); }
              sfx(b, 'harp');
            }],
            [t10[2], b => { pose('jr:jer', 'pray'); }],
            [t10[2] + 5, b => {
              W.set('jrVision', 0.3, b.instant);
              pose('jr:jer', 'stand');
              walk('jr:hanamel', 0.975, { speed: 0.035 });
              if (!b.instant) { const a = X.field; safe('jr.ring', () => fx().ring((a[0] + a[1]) / 2 * W.w, fieldY((a[0] + a[1]) / 2, 0.5), [255, 232, 180], W.w * 0.12, 2.4, 1.6)); }
            }],
          ]);
        },
      },

      // ── 39:1–14；52:13–14 城陷 ─────────────────────────────
      {
        kind: 'judge', utter: '我说降祸不降福的话必临到这城', cmd: 'fulfill 我的话 --on 这城', ref: '39:16',
        verse: V11,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.88, 7, b.instant);
              rm('jr:hanamel'); rm('jr:baruch'); unCrowd('jr:witness');
            }],
            [0.8, b => {
              W.set('jrBreach', 1, b.instant);
              if (!b.instant) { W.shake = Math.max(W.shake || 0, 0.7); safe('jr.dust', () => fx().dust(X.breach * W.w, gY(1, X.breach), 30, [190, 170, 140], PH(1) * 0.8, 'mid')); }
              sfx(b, 'thunder', { low: true });
              sfx(b, 'crowd');
            }],
            [t11[1], b => { W.set('jrFire', 1, b.instant); crowdPose('jr:city', 'weep'); sfx(b, 'fire'); }],
            [t11[1] + 2, b => { W.set('jrTFire', 1, b.instant); sfx(b, 'fire', { low: true }); }],
            [t11[1] + 4, b => { W.set('jrRuin', 1, b.instant); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.5); sfx(b, 'thunder', { soft: true, low: true }); }],
            [t11[2], b => {
              crowdWalk('jr:city', 1.03, 1.15, { speed: 0.03 });
              sfx(b, 'weep', { far: true });
            }],
            [t11[2] + 7.5, b => { unCrowd('jr:city'); }],
            [t11[3], b => {
              walk('jr:jer', 0.655, { speed: 0.035 });
              crowd('jr:poor', { n: 3, x0: 0.6, x1: 0.64, label: '剩下的穷人', from: b.instant ? 'none' : 'fade', mill: false, pose: 'sit' });
              W.set('jrFire', 0.25, b.instant);
              W.set('jrTFire', 0.15, b.instant);
              W.set('jrEmber', 1, b.instant);
              W.set('jrSiege', 0.35, b.instant);
            }],
          ]);
        },
      },

      // ── 31:3；31:15–17 永远的爱；拉结哭她儿女 ───────────────
      {
        kind: 'promise', utter: '我以永远的爱爱你', cmd: 'while (true) love(以色列)', ref: '31:3',
        verse: V12,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.02, 12, b.instant);
              W.set('jrSiege', 0, b.instant);
              W.set('jrFire', 0, b.instant);
              W.set('jrTFire', 0, b.instant);
              W.set('jrEmber', 0.45, b.instant);
              W.set('jrLove', 1, b.instant);
              pose('jr:jer', 'sit');
              face('jr:jer', 1);
              sfx(b, 'harp', { soft: true });
            }],
            [t12[1], b => {
              add('jr:rachel', { label: '拉结', sex: 'f', age: 'adult', x: 0.93, facing: -1, robe: ROBE.rachel, glow: 0.2, from: b.instant ? 'none' : 'fade' });
              pose('jr:rachel', 'weep');
              sfx(b, 'weep');
            }],
            [t12[2], b => {
              glowP('jr:rachel', 0.8);
              pose('jr:rachel', 'gaze');
              face('jr:rachel', 1);
              W.set('jrHope', 1, b.instant);
              if (!b.instant) { const p = figPt('jr:rachel', 0.6); if (p) safe('jr.ring', () => fx().ring(p[0], p[1], [255, 226, 170], HN() * 2, 2.4, 1.6)); }
              sfx(b, 'harp');
            }],
          ]);
        },
      },

      // ── 50:4–5；31:31–34 归回；新约写在心上 ────────────────
      {
        kind: 'promise', utter: '我要将我的律法放在他们里面，写在他们心上', cmd: 'write 律法 > /心/*', ref: '31:33',
        verse: V13,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.27, 8, b.instant);
              W.set('jrLove', 0.25, b.instant);
              W.set('jrEmber', 0.15, b.instant);
              W.set('jrHope', 0, b.instant);
              W.set('jrSpring', 1, b.instant);
              pose('jr:jer', 'stand');
              crowd('jr:return', { n: 9, x0: 1.03, x1: 1.16, label: '归回的人', from: 'none', mill: false });
              crowdWalk('jr:return', 0.68, 0.84, { speed: 0.032, pose: 'weep' });
              walk('jr:rachel', 0.89, { speed: 0.03 });
              sfx(b, 'crowd', { soft: true });
            }],
            [t13[1] + 0.4, b => {
              S.heartT = b.instant ? -1e9 : W.t;
              if (!b.instant) {
                const tg = [];
                for (const m of members('jr:return')) { const x = (m.tx != null ? m.tx : m.nx) * W.w; tg.push([x, gY(2, m.tx != null ? m.tx : m.nx) - PH(2) * 0.62]); }
                const p = figPt('jr:jer', 0.62); if (p) tg.push(p);
                if (tg.length) safe('jr.sow', () => fx().sow(c.x, c.y, tg.concat(tg), [255, 226, 160], { pass: 'top', stagger: 1.2, dur: 2.6 }));
              }
              sfx(b, 'angel', { soft: true });
            }],
            [t13[1] + 2.6, b => {
              crowdPose('jr:return', 'gaze');
              W.set('jrHeart', 1, b.instant);
              crowdGlow('jr:return', 0.9);
              crowdGlow('jr:poor', 0.9);
              glowP('jr:jer', 0.9);
              glowP('jr:rachel', 0.9);
              pose('jr:rachel', 'raise');
              sfx(b, 'chime');
            }],
            [t13[2], b => { crowdPose('jr:return', 'raise'); crowdPose('jr:poor', 'kneel'); pose('jr:jer', 'raise'); sfx(b, 'harp'); }],
          ]);
        },
      },

      // ── 31:35–40 这城必为耶和华建造 ─────────────────────────
      {
        kind: 'promise', utter: '这城必为耶和华建造', cmd: 'build 这城 --forever --no-uproot', ref: '31:38',
        verse: V14,
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.31, 12, b.instant);
              W.set('gale', 0.75, b.instant);
              W.set('jrLove', 0, b.instant);
              pose('jr:jer', 'stand');
              crowdPose('jr:return', 'stand');
              crowdPose('jr:poor', 'stand');
              pose('jr:rachel', 'stand');
              sfx(b, 'wind');
              sfx(b, 'splash');
            }],
            [6, b => { W.set('gale', 0, b.instant); }],
            [t14[1], b => { W.set('jrLine', 1, b.instant); sfx(b, 'chime'); }],
            [t14[1] + 2, b => {
              W.set('jrNew', 1, b.instant);
              W.set('jrEmber', 0, b.instant);
              crowdPose('jr:return', 'gaze');
              pose('jr:jer', 'gaze');
              sfx(b, 'angel', { soft: true });
            }],
            [t14[2], b => {
              W.set('bare', 0, b.instant);
              W.set('bloom', 1, b.instant);
              W.set('herbs', 1, b.instant);
              W.set('jrVision', 0.8, b.instant);
              crowdPose('jr:return', 'raise');
              if (!b.instant) { const t = templeGeo(); safe('jr.ring', () => fx().ring(t.x, t.top - t.hm, [255, 236, 190], M() * 0.5, 3, 2)); }
              sfx(b, 'harp');
            }],
          ]);
        },
      },
    ],

    scene: {
      init() { sprites(); },
      resize() {},
      update(dt) {
        if (!cur()) return;
      },
      drawUnder(ctx, pass) {
        if (!cur()) return;
        if (pass === 'sky') { drawBurnSky(ctx); drawPot(ctx); drawSign(ctx); return; }
        if (pass === 'far') { drawFar(ctx); return; }
        if (pass === 'mid') { drawMid(ctx); return; }
        if (pass === 'near') { drawNearUnder(ctx); return; }
      },
      draw(ctx, pass) {
        if (!cur()) return;
        if (pass === 'air') drawAir(ctx);
      },
      reset() { S = fresh(); },
      restore() {
        // 在牢狱里：系回绳上（恢复存档时人物模块已重建）
        if (S.pit && fig('jr:jer')) attach('jr:jer', pitFeet);
      },
      sig() { return { jar: S.jar, scroll1: S.scroll1, letter: S.letter, pit: S.pit }; },
      pick(x, y, r) {
        if (!cur()) return null;
        let best = null;
        const put = (label, px, py, d) => { if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
        const hn = HN(), hm = PH(1);
        // 杏树
        { const G = almondGeo(); put('杏树', G.x, G.g + ALMOND.top * G.TH - 6, Math.hypot(x - G.x, (y - (G.g - G.TH * 0.55)) * 0.7)); }
        // 亚拿突
        for (const xf of X.houses) { const px = xf * W.w, gy = gY(2, xf); put('亚拿突', px, gy - hn * 1.1, Math.hypot(x - px, y - (gy - hn * 0.4)) + r * 0.2); }
        // 泉源
        { const P = brookPts(); put('活水的泉源', P[0][0], P[0][1] - hn * 0.4, Math.hypot(x - P[0][0], y - P[0][1])); }
        // 池子与牢狱
        if (lv('jrCistern') > 0.5) for (let i = 0; i < 3; i++) {
          const G = cisGeo(i), lab = i === 1 && (lv('jrPit') > 0.3 || S.pit || W.stage > GS.book.find(ACT).first + 8) ? '牢狱' : (lv('jrCrack') > 0.5 ? '破裂的池子' : '池子');
          put(lab === '池子' ? '破裂的池子' : lab, G.x, G.y - hn * 0.5, Math.hypot(x - G.x, (y - G.y) * 1.6));
        }
        // 窑匠的家、窑
        { const G = shedGeo(); put('窑匠的家', G.x, G.g - G.h - 8, Math.abs(x - G.x) < G.w / 2 && y > G.g - G.h * 1.1 && y < G.g + 4 ? r * 0.6 : 1e9); put('窑', G.x - G.w / 2 - hn * 0.55, G.g - hn, Math.hypot(x - (G.x - G.w / 2 - hn * 0.55), y - (G.g - hn * 0.4))); }
        // 过冬的房屋、火盆
        if (lv('jrCourt') > 0.5) { const G = pavGeo(); put('过冬的房屋', G.x, G.g - G.h - hn * 0.3, Math.abs(x - G.x) < G.w / 2 && y > G.g - G.h * 1.1 && y < G.g + 4 ? r * 0.65 : 1e9); }
        if (lv('jrBrazier') > 0.5 && fig('jr:king')) { const B = brazierPos(); put('火盆', B.x, B.y - hn * 0.8, Math.hypot(x - B.x, y - (B.y - hn * 0.3))); }
        // 书卷
        if (lv('jrScroll2') > 0.5) { const p = figPt('jr:baruch', 0.3); if (p) put('书卷', p[0], p[1] - hn * 0.4, Math.hypot(x - p[0], y - p[1]) * 0.9); }
        // 瓦器、那块地
        if (lv('jrDeed') > 0.5) { const px = X.deed * W.w, py = fieldY(X.deed, 0.34); put('瓦器', px, py - hn * 0.5, Math.hypot(x - px, y - (py - hn * 0.15))); }
        { const [a, b] = X.field; if (x > a * W.w && x < b * W.w && y > fieldY((a + b) / 2, 0.3)) put('亚拿突的地', x, y - hn * 0.5, r * 0.75); }
        // 耶路撒冷、殿
        { const t = templeGeo(); if (Math.abs(x - t.x) < hm * 2 && y > t.top - hm * 2.6 && y < t.g + hm * 0.2) put('耶和华的殿', t.x, t.top - hm * 2.6, r * 0.5); }
        if (x > X.city[0] * W.w && x < X.city[1] * W.w) { const gy = gY(1, x / W.w); if (y > gy - hm * 2 && y < gy + hm * 0.4) put('耶路撒冷', x, gy - hm * 2.1, r * 0.7); }
        if (lv('jrBabylon') > 0.5) { const px = X.babylon * W.w, gy = gY(0, X.babylon), hf = PH(0); if (Math.abs(x - px) < hf * 4 && y > gy - hf * 4 && y < gy + 4) put('巴比伦', px, gy - hf * 4, r * 0.6); }
        if (lv('jrLine') > 0.5 && Math.abs(y - (gY(1, x / W.w) + hm * 0.3)) < 8 && x > 0.535 * W.w) put('准绳', x, gY(1, x / W.w) - 6, r * 0.7);
        return best;
      },
    },
  });
})(window.GS);
