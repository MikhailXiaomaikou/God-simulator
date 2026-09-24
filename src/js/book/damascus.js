/* ─────────────────────────────────────────────────────────────
 * book/damascus.js —— 使徒行传 · 大马士革（使徒行传 8 — 12）
 *
 * 司提反死后，耶路撒冷的教会大遭逼迫，门徒分散，往各处去传道。这一幕里，道一步一步走出耶路撒冷：
 * 撒马利亚城里的欢喜；往迦萨去的旷野路上，一辆车、一卷以赛亚书、一处有水的地方；
 * 将到大马士革，午正，从天上来的光，比日头还亮；三日看不见，鳞从眼上掉下来，颜色回到世界；
 * 夜里从城墙上缒下来的筐子；吕大与约帕；约帕海边硝皮匠的房顶上，天开了，一块大布系着四角缒下来；
 * 凯撒利亚百夫长的家，圣灵降在外邦人身上；安提阿，门徒称为「基督徒」；
 * 耶路撒冷的监牢里，铁链脱落，铁门自己开了；马利亚家门外的敲门声——神的道日见兴旺，越发广传。
 *
 * 十五句话（主的话、圣灵的话、主的使者的话；无人说话之处，是经上论神作为的一句）：
 *   1 起来！向南走（8:26）              主的使者：腓利离开欢喜的撒马利亚城，走上旷野的路；一辆车从耶路撒冷来。
 *   2 你去！贴近那车走（8:29）          圣灵：腓利跑过去；太监请他上车同坐；「他像羊被牵到宰杀之地」——天上一只光的羊羔。
 *   3 主的灵把腓利提了去（8:39）        有水的地方：车站住，二人下到水里受洗；光把腓利提了去；太监欢欢喜喜地走路。
 *   4 扫罗！扫罗！你为什么逼迫我？（9:4）★ 午正，将到大马士革：从天上发光，四面照着他，他仆倒在地。
 *   5 我就是你所逼迫的耶稣（9:5）       光收回；他起来，竟不能看见——世界失了颜色；有人拉着他的手进城；三日三夜飞逝。
 *   6 你只管去！他是我所拣选的器皿（9:15）亚拿尼亚在异象的光里；进入直街犹大的家，按手——鳞掉下来，颜色自扫罗绽放。
 *   7 为我的名必须受许多的苦难（9:16）  扫罗在城门前宣讲；夜里城门口的火把；门徒用筐子把他从城墙上缒下去。
 *   8 他就立刻起来了（9:34）            吕大的以尼雅起来收拾褥子（彼得的话在经文里）；约帕的大比大——寡妇拿着她做的衣裳哭；「大比大，起来！」
 *   9 哥尼流（10:3）                    凯撒利亚，申初：百夫长跪着祷告；神的使者进来，满屋是光；他打发三个人往约帕去。
 *  10 神所洁净的，你不可当作俗物（10:15）约帕海边，午正，彼得在房顶上：天开了，一块大布系着四角缒下来，一连三次。
 *  11 起来，下去，和他们同往，不要疑惑（10:20）三个人站在门外；彼得下来，同他们去凯撒利亚；哥尼流俯伏，「你起来，我也是人」。
 *  12 圣灵降在一切听道的人身上（10:44） 黄昏，彼得还说话的时候：风，每个外邦人的头上一小朵火焰；奉耶稣基督的名受洗。
 *  13 主与他们同在（11:21）             安提阿：希腊人信而归主的很多；巴拿巴去大数找着扫罗；「基督徒」三个字在光里聚成。
 *  14 快快起来！（12:7）                逾越节的夜，监牢里：两条铁链、两个兵丁；使者站在旁边，屋里有光；铁链脱落，铁门自己开了。
 *  15 神的道日见兴旺，越发广传（12:24） 马利亚家里聚集祷告的人；彼得敲外门，罗大欢喜得顾不得开门；天亮，光点亮遍全地。
 *
 * 神的显现：父从不画作人形；复活的主在大马士革路上只是从天上来的光与声音（经文）；圣灵是灵的光、风与头上的火焰；
 * 使者是发光的人形；人都无面目。逼迫与杀害只在经文里讲，画面上只有光、姿势、声音与缺席。
 * 左边是大海（约帕、凯撒利亚都在海边）；近地一处一处换布景：撒马利亚、旷野的路、大马士革、约帕、凯撒利亚、安提阿、耶路撒冷。
 * 规矩：一切状态只在 setup / apply / 情节（beats）里设定，瞬间重演时得到同样的世界；装饰（粒子、光晕）只在非瞬间时出现。
 * 位置都以画面的比例记下（房屋等以近地人高为单位）；竖屏另一套布局。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'damascus';
  const safe = U.safe;
  const cur = () => GS.book.current(ACT);

  // ── 本幕的程度 ──────────────────────────────────────────────
  const LV = {
    dmTown: ['exp', 1.6],      // 近地右边的城（一处一处换样子：S.town）
    dmHouse: ['exp', 1.6],     // 前面敞开的一座房子（S.house）
    dmSky: ['exp', 1.6],       // 中丘上远远的城（S.sky）
    dmLamp: ['exp', 0.6],      // 房里、窗里的灯（夜里）
    dmRoad: ['exp', 0.5],      // 旷野的路
    dmPool: ['exp', 0.7],      // 有水的地方
    dmScroll: ['exp', 0.8],    // 太监手里的以赛亚书
    dmLamb: ['exp', 0.45],     // 天上一只光的羊羔（赛 53 在徒 8:32）
    dmTell: ['exp', 0.5],      // 车上暖暖的光：腓利对他传讲耶稣
    dmLift: ['exp', 0.9],      // 主的灵把腓利提了去
    dmTrail: ['lin', 0.2],     // 腓利走遍的各城：一盏一盏亮起
    dmBeam: ['exp', 1.1],      // 从天上来的光（大马士革路上）
    dmBlind: ['exp', 0.5],     // 扫罗看不见：世界失了颜色
    dmSight: ['lin', 0.3],     // 颜色自扫罗绽放（0 → 1）
    dmVision: ['exp', 0.7],    // 亚拿尼亚的异象（柔和的光）
    dmWall: ['exp', 1.2],      // 大马士革的城墙与城门
    dmTorch: ['exp', 0.9],     // 城门口的火把
    dmBasket: ['lin', 0.22],   // 筐子缒下（0 窗口 → 1 地上）
    dmBasketA: ['exp', 1.4],   // 筐子
    dmMat: ['exp', 1.2],       // 以尼雅的褥子
    dmBier: ['exp', 1.2],      // 大比大躺卧的床
    dmRoom: ['exp', 0.8],      // 屋里有光（使者、圣灵）
    dmOpen: ['exp', 0.6],      // 天开了
    dmSheet: ['lin', 0.3],     // 大布缒下（0 天上 → 1 房顶上）
    dmSheetA: ['exp', 1.0],    // 大布
    dmClean: ['exp', 0.6],     // 神所洁净的：布里的活物蒙了光
    dmFlames: ['lin', 0.35],   // 头上的火焰（外邦人受圣灵）
    dmWith: ['exp', 0.45],     // 主与他们同在：安提阿众人之上的光
    dmPrison: ['exp', 1.2],    // 监牢
    dmChain: ['exp', 1.5],     // 两条铁链
    dmChainOff: ['lin', 1.1],  // 铁链从他手上脱落
    dmGate: ['lin', 0.4],      // 临街的铁门自己开了
    dmCell: ['exp', 1.0],      // 屋里有光照耀（监牢）
    dmDoor: ['exp', 1.2],      // 马利亚家的外门开了
    dmPray: ['exp', 0.5],      // 聚集祷告之处的灯（监牢那一夜）
    dmLights: ['lin', 0.12],   // 神的道越发广传：灯亮遍全地
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const MY = Object.keys(LV);
  const L = k => W.lv[k] || 0;

  // ── 布局（画面宽的比例；竖屏另一套）─────────────────────────
  const LAYL = {
    town: [0.785, 1.04], sky: [0.66, 0.97], road: [0.47, 1.03],
    // 撒马利亚 · 旷野的路
    phil0: 0.655, samL: [0.55, 0.615], samR: [0.705, 0.775], angelA: 0.735, road0: 0.585,
    car1: 0.87, car2: 0.745, carW: 0.72, carOut: 0.5,
    pool: [0.605, 0.27, 0.06], dipE: 0.618, dipP: 0.59,
    // 大马士革
    saul0: 0.505, fall: 0.6, comp: [0.572, 0.552, 0.532],
    house: 0.7, anan0: 0.845,
    wall: [0.625, 1.04], win: 0.685, gateX: 0.915, preach: 0.75, damC: [0.78, 0.88],
    // 吕大 · 约帕 · 凯撒利亚 · 耶路撒冷
    aen: 0.825, houseJ: 0.64, houseC: 0.665, houseM: 0.6, gateM: 0.722,
    prison: 0.505,
    antA: [0.55, 0.665], antB: [0.7, 0.83],
    rift: [0.74, 0.2], nameY: 0.4,
  };
  const LAYP = Object.assign({}, LAYL, {
    town: [0.82, 1.08], sky: [0.56, 1.0], road: [0.44, 1.04],
    phil0: 0.62, samL: [0.49, 0.56], samR: [0.68, 0.79], angelA: 0.74, road0: 0.56,
    car1: 0.76, car2: 0.7, carW: 0.67, carOut: 0.5,
    pool: [0.54, 0.34, 0.075], dipE: 0.565, dipP: 0.515,
    saul0: 0.47, fall: 0.58, comp: [0.545, 0.515, 0.49],
    house: 0.64, anan0: 0.9,
    wall: [0.49, 1.05], win: 0.57, gateX: 0.9, preach: 0.68, damC: [0.74, 0.86],
    aen: 0.64, houseJ: 0.62, houseC: 0.62, houseM: 0.6, gateM: 0.8,
    prison: 0.47,
    antA: [0.5, 0.64], antB: [0.68, 0.85],
    rift: [0.58, 0.41], nameY: 0.46,
  });
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];

  // ── 颜色 ────────────────────────────────────────────────────
  const TINT = [255, 236, 200];
  const TINT_ROAD = [255, 232, 196], TINT_LIGHT = [255, 250, 238], TINT_SEE = [255, 240, 214], TINT_SHEET = [242, 240, 255];
  const TINT_SPIRIT = [255, 214, 150], TINT_NIGHT = [222, 232, 255];
  const STONE = [178, 166, 146], STONE_D = [130, 120, 106], PRISON = [140, 132, 120], PRISON_D = [98, 92, 84], INT = [66, 54, 46], DOOR = [52, 38, 28];
  const WOOD = [104, 76, 50], WOOD_D = [74, 54, 38], WOOD_L = [150, 116, 80], WICKER = [160, 124, 76], WICKER_D = [118, 88, 52];
  const SAND = [212, 188, 142], SAND_D = [168, 144, 104];
  const IRON = [66, 66, 74], IRON_L = [170, 172, 184];
  const WATER_T = [150, 196, 212], WATER_B = [48, 102, 122];
  const MAT = [196, 176, 138], MAT_D = [150, 128, 96], LINEN = [238, 232, 218], HIDE = [150, 104, 70];
  const GOLD = [255, 214, 140], WARM = [255, 226, 170];
  const ROBE = {
    philip: [88, 108, 92], eunuch: [198, 152, 66], comp: [[112, 96, 80], [96, 88, 84], [124, 106, 88]],
    ananias: [104, 118, 132], aeneas: [138, 120, 96], tabitha: [216, 202, 178], widow: [[76, 66, 76], [88, 76, 74], [70, 68, 62]],
    cornelius: [156, 54, 46], servant: [[132, 110, 86], [112, 100, 88]], soldier: [140, 66, 56], brother: [[118, 104, 86], [100, 92, 104]],
    barnabas: [112, 128, 102], guard: [108, 70, 60], watch: [100, 86, 74], rhoda: [156, 124, 98],
  };
  const TOWN = {
    samaria: { wall: [218, 204, 174], roof: [156, 132, 100], door: [72, 54, 38], tile: 0, tree: 'olive', label: '撒马利亚城' },
    damascus: { wall: [232, 226, 210], roof: [194, 178, 150], door: [74, 90, 110], tile: 0, tree: 'poplar', label: '大马士革' },
    joppa: { wall: [228, 218, 196], roof: [188, 170, 140], door: [62, 98, 128], tile: 0, tree: 'palm', label: '约帕' },
    caesarea: { wall: [238, 234, 224], roof: [178, 90, 64], door: [98, 62, 46], tile: 1, tree: 'palm', cols: 1, label: '凯撒利亚' },
    antioch: { wall: [226, 206, 170], roof: [172, 96, 68], door: [90, 64, 46], tile: 1, tree: 'poplar', cols: 1, label: '安提阿' },
    jerusalem: { wall: [224, 204, 162], roof: [182, 160, 122], door: [82, 62, 44], tile: 0, tree: 'olive', label: '耶路撒冷' },
  };
  const SEED = { samaria: 11, damascus: 23, joppa: 37, caesarea: 41, antioch: 53, jerusalem: 67 };
  const HOUSE = {
    judas: { wall: [232, 226, 210], int: [72, 60, 50], roof: [194, 178, 150], stair: 1, label: '犹大的家' },
    tabitha: { wall: [228, 218, 196], int: [76, 64, 54], roof: [188, 170, 140], stair: 1, loom: 1, label: '大比大的家' },
    simon: { wall: [216, 200, 170], int: [72, 60, 48], roof: [178, 158, 126], stair: 1, hides: 1, label: '硝皮匠西门的家' },
    cornelius: { wall: [240, 236, 226], int: [86, 68, 60], roof: [178, 90, 64], tile: 1, cols: 1, label: '哥尼流的家' },
    mary: { wall: [224, 204, 162], int: [74, 62, 50], roof: [182, 160, 122], court: 1, label: '马利亚的家' },
  };

  // ── 小工具 ──────────────────────────────────────────────────
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const c01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ss = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const ease = t => { t = c01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const H2 = () => 34 * W.layerScale(2) * 1.3 * boost();     // 近地的人高
  const H1 = () => 34 * W.layerScale(1) * 1.2 * boost();     // 中丘的人高
  const M = () => Math.min(W.w, W.h);
  const sh = (rgb, depth, a, ex) => W.shadeCSS(rgb, depth || 0, a == null ? 1 : a, ex || 0);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.35 + 0.65 * W.daylight;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  function gY(px, layer) {
    const l = layer == null ? 2 : layer;
    const x = clamp(px, 0, W.w);
    let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  }
  const gYb = (px, layer) => W.ridgeBaseY(layer == null ? 2 : layer, clamp(px, 0, W.w));
  // 近地纵深：v 越大越靠前（画面更低）——与 cast 同一算法
  const fieldY = (xf, v) => { const g = gY(xf * W.w); return g + (v || 0) * Math.max(0, W.h - g) * 0.8; };
  function lv(k, v, b) { W.set(k, v, inst(b)); }
  function sfx(b, name, o) {
    if (inst(b)) return;
    const a = au();
    if (a && a.sfx) safe('damascus.sfx', () => a.sfx(name, o || {}));
  }
  function time(tod, dur, b) { W.goTo(tod, dur, inst(b)); }
  function avoid(r) { W.beastAvoid = r || []; }

  // ── 人物的助手 ──────────────────────────────────────────────
  const C = () => GS.cast;
  const LOOK = () => (C() && C().LOOK) || {};
  function add(id, o) { const c = C(); if (c) c.add(id, Object.assign({ layer: 2, from: 'fade', glow: 0.2 }, o)); }
  // 新约里反复出场的人：用共同的样子（衣袍、头巾、须不改）
  function addLook(id, look, o) { const c = C(); if (!c) return; const base = LOOK()[look] || {}; c.add(id, Object.assign({ layer: 2, from: 'fade' }, base, o)); }
  function animal(id, o) { const c = C(); if (c && c.animal) c.animal(id, Object.assign({ layer: 2 }, o)); }
  function walk(id, x, o) { const c = C(); if (c && c.get(id)) c.walk(id, x, o || {}); }
  function run(id, x, o) { walk(id, x, Object.assign({ run: true }, o || {})); }
  function pose(id, p, o) { const c = C(); if (c && c.get(id)) c.pose(id, p, o); }
  function face(id, d) { const c = C(); if (c && c.get(id)) c.face(id, d); }
  function glowP(id, v) { const c = C(); if (c) c.glow(id, v); }
  function rm(id, fade) { const c = C(); if (c && c.get(id)) c.remove(id, { fade: fade !== false }); }
  function person(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function has(id) { const c = C(); return !!(c && c.has && c.has(id)); }
  function follow(id, other, dx) { const c = C(); if (c && c.get(id)) c.follow(id, other, dx); }
  function ride(id, m) { const c = C(); if (c && c.ride && c.get(id)) c.ride(id, m || null); }
  function fly(id, x, y, o) { const c = C(); if (c && c.fly && c.get(id)) c.fly(id, x, y, o || {}); }
  function attach(id, fn) {
    const c = C(); if (!c || !c.attach || !c.get(id)) return;
    const p = c.get(id);
    c.attach(id, fn || null);
    if (fn) { p.tx = null; p.fly = null; p.ny = null; const q = safe('dm.attach', fn); if (q && isFinite(q[0])) p.nx = q[0] / W.w; }
  }
  function propP(id, k) { const c = C(); if (c && c.prop && c.get(id)) c.prop(id, k); }
  function hands(a, b, on) { const c = C(); if (c && c.holdHands) c.holdHands(a, b, on); }
  function crowdOf(gid) { const c = C(); return c && c.crowds ? c.crowds.get(gid) : null; }
  function crowdFaceX(gid, xf) { const g = crowdOf(gid); if (g) g.members.forEach(m => { if (m.tx == null) { m.facing = xf >= m.nx ? 1 : -1; if (W.replaying) m.fd = m.facing; } }); }
  function crowdPose(gid, p) { const c = C(); if (c && crowdOf(gid)) c.crowdPose(gid, p); }
  function crowdWalk(gid, x0, x1, o) { const c = C(); if (c && crowdOf(gid)) c.crowdWalk(gid, x0, x1, o || {}); }
  function crowdRm(gid, fade) { const c = C(); if (c && crowdOf(gid)) c.removeCrowd(gid, { fade: fade !== false }); }
  function crowdGlow(gid, v) { const g = crowdOf(gid); if (g) g.members.forEach(m => { m.glow = v; }); }
  // 竖屏的地窄：人群少一些
  function crowd(gid, o) {
    const c = C(); if (!c) return;
    const n = Math.max(2, Math.round((o.n || 8) * (tall() ? 0.65 : 1)));
    c.crowd(gid, Object.assign({ layer: 2, from: 'fade' }, o, { n }));
  }
  // 除了 keep 里的，其余的人与人群都退场（换一处布景）
  function clearAll(b, keep) {
    const c = C(); if (!c) return;
    const k = new Set(keep || []);
    for (const id of c.list()) if (!k.has(id)) { if (c.attach && c.get(id) && c.get(id).attach) c.attach(id, null); c.remove(id, { fade: !inst(b) }); }
    if (c.crowds) for (const g of Array.from(c.crowds.keys())) if (!k.has(g)) c.removeCrowd(g, { fade: !inst(b) });
  }
  // 纵深 v 的缓动（只是看的样子；重演时直接到位）
  const VT = {};
  function vTo(id, v, b) {
    const p = person(id); if (!p) return;
    if (inst(b)) { p.v = v; delete VT[id]; } else VT[id] = v;
  }
  // 人此刻在画面上的位置（脚下）与身高
  function fpos(id) {
    const p = person(id);
    if (!p || p.alpha < 0.02) return null;
    if (p._vis && isFinite(p._x) && isFinite(p._y)) return { x: p._x, y: p._y, h: p._h, p };
    const x = p.nx * W.w;
    const y = p.ny != null ? p.ny * W.h : fieldY(p.nx, p.v || 0);
    return { x, y, h: H2() * (p.age === 'child' ? 0.62 : 1), p };
  }
  // 头顶（按姿势）
  const HEADK = { stand: 1, walk: 1, run: 0.98, point: 1, raise: 1, gaze: 1, carry: 1, weep: 0.92, embrace: 0.95, bow: 0.74, kneel: 0.66, pray: 0.66, worship: 0.52, sit: 0.6, seat: 0.8, ride: 0.9, lie: 0.16, fall: 0.14 };
  function headPt(f) {
    const k = HEADK[f.p.pose] != null ? HEADK[f.p.pose] : 1;
    return [f.x, f.y - f.h * k];
  }

  // ── 局部状态 ────────────────────────────────────────────────
  // S.town / S.house / S.sky：此刻的布景（只在 setup 与情节里改）；其余只是装饰
  function fresh() {
    return { town: 'samaria', house: 'none', sky: 'none', clock: 0, bloomId: 'paul' };
  }
  let S = fresh();
  const FXL = [];
  function addFX(b, o) { if (inst(b)) return; FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  贴图
  // ════════════════════════════════════════════════════════════
  const SP = {};
  function glowSprite(key, rgb, soft) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      if (soft) { gr.addColorStop(0, rgba(rgb, 0.9)); gr.addColorStop(0.5, rgba(rgb, 0.45)); gr.addColorStop(1, rgba(rgb, 0)); }
      else { gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(0.22, rgba(rgb, 0.55)); gr.addColorStop(0.55, rgba(rgb, 0.14)); gr.addColorStop(1, rgba(rgb, 0)); }
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      SP[key] = c;
    } catch (e) { SP[key] = null; }
  }
  function beamSprite() {
    try {
      const w = 32, h = 128, c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
      for (let y = 0; y < h; y++) {
        const v = y / (h - 1), vy = Math.min(1, v / 0.25) * Math.min(1, (1 - v) / 0.12);
        for (let x = 0; x < w; x++) {
          const hx = ((x + 0.5) / w) * 2 - 1, a = vy * (Math.exp(-hx * hx * 5) * 0.75 + Math.exp(-hx * hx * 40) * 0.25);
          const i = (y * w + x) * 4;
          d[i] = 255; d[i + 1] = 248; d[i + 2] = 230; d[i + 3] = Math.round(255 * clamp(a, 0, 1));
        }
      }
      g.putImageData(img, 0, 0);
      SP.beam = c;
    } catch (e) { SP.beam = null; }
  }
  function sprites() {
    if (SP.w) return;
    glowSprite('w', [255, 250, 238]); glowSprite('g', [255, 214, 140]); glowSprite('b', [200, 220, 255]);
    glowSprite('f', [255, 150, 70]); glowSprite('r', [255, 236, 200]);
    glowSprite('k', [14, 12, 20], true); glowSprite('m', [236, 236, 240], true); glowSprite('c', [250, 246, 238], true);
    beamSprite();
  }
  function glow(ctx, key, x, y, r, a, ry) {
    const s = SP[key];
    if (!s || !(a > 0.004) || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    const rr = ry || r;
    ctx.drawImage(s, x - r, y - rr, 2 * r, 2 * rr);
  }
  function beam(ctx, x, y0, y1, w, a) {
    if (!SP.beam || !(a > 0.004) || !(y1 > y0) || !isFinite(x)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, x - w / 2, y0, w, y1 - y0);
  }

  // ════════════════════════════════════════════════════════════
  //  中丘上远远的城
  // ════════════════════════════════════════════════════════════
  const SKYC = { key: '', list: null };
  function skyList(style) {
    const key = style + '|' + (tall() ? 'P' : 'L');
    if (SKYC.key === key) return SKYC.list;
    const [a, b] = X('sky'), sd = SEED[style] || 3, list = [];
    const n = 15;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.3 + 0.4 * hsh(sd + i)) / n;
      list.push({ k: 'h', x: lerp(a, b, t), w: 0.9 + 0.9 * hsh(sd + i * 1.7), h: 1.0 + 0.9 * hsh(sd + i * 2.3), lit: hsh(sd + i * 3.9) < 0.45 });
    }
    for (let i = 0; i <= 5; i++) list.push({ k: 't', x: lerp(a, b, i / 5), w: 0.6, h: 1.6 + 0.3 * hsh(sd + i * 4.1) });
    if (style === 'jerusalem') list.push({ k: 'temple', x: lerp(a, b, 0.6) });
    if (style === 'caesarea') { list.push({ k: 'light', x: a - 0.018 }); list.push({ k: 'podium', x: lerp(a, b, 0.5) }); }
    if (style === 'antioch') { list.push({ k: 'mount', x: lerp(a, b, 0.55) }); list.push({ k: 'colon', x: lerp(a, b, 0.22), x2: lerp(a, b, 0.72) }); }
    if (style === 'damascus') for (let i = 0; i < 7; i++) list.push({ k: 'pop', x: lerp(a, b, (i + 0.3 + 0.4 * hsh(sd + i * 8.8)) / 7), h: 1.9 + 0.8 * hsh(sd + i * 6.6) });
    SKYC.key = key; SKYC.list = list;
    return list;
  }
  function drawSkyline(ctx) {
    const A = L('dmSky');
    if (A < 0.01 || S.sky === 'none') return;
    const list = skyList(S.sky), u = H1() * 0.85, D = 0.45;
    const pal = TOWN[S.sky] || TOWN.jerusalem, lamp = nightK() * L('dmLamp');
    const [a, b] = X('sky');
    ctx.globalAlpha = A;
    // 安提阿背后的山
    for (const it of list) if (it.k === 'mount') {
      const x = it.x * W.w, y = gYb(x, 1);
      const top = y - 4.4 * u;
      const g = ctx.createLinearGradient(0, top, 0, y);
      const c0 = W.shade([120, 134, 112], 0.62), c1 = W.shade([98, 114, 94], 0.5);
      g.addColorStop(0, U.rgb(c0[0], c0[1], c0[2])); g.addColorStop(1, U.rgb(c1[0], c1[1], c1[2]));
      ctx.fillStyle = g;
      ctx.globalAlpha = A * 0.9;
      ctx.beginPath(); ctx.moveTo(x - 0.24 * W.w, y + 2);
      ctx.bezierCurveTo(x - 0.14 * W.w, y - 1.6 * u, x - 0.08 * W.w, top, x - 0.02 * W.w, top + 0.2 * u);
      ctx.bezierCurveTo(x + 0.03 * W.w, top + 0.5 * u, x + 0.06 * W.w, y - 3.4 * u, x + 0.12 * W.w, y - 3.3 * u);
      ctx.bezierCurveTo(x + 0.18 * W.w, y - 3.1 * u, x + 0.24 * W.w, y - 1.2 * u, x + 0.3 * W.w, y + 2);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = A;
    }
    // 城里的房屋（在城墙之后）
    ctx.fillStyle = sh(pal.wall, D);
    ctx.beginPath();
    for (const it of list) if (it.k === 'h') { const x = it.x * W.w, y = gYb(x, 1), w = it.w * u, h = it.h * u + 0.75 * u; ctx.rect(x - w / 2, y - h, w, h + 2); }
    ctx.fill();
    ctx.fillStyle = sh(pal.tile ? pal.roof : mix(pal.wall, [90, 80, 70], 0.3), D);
    ctx.beginPath();
    for (const it of list) if (it.k === 'h') {
      const x = it.x * W.w, y = gYb(x, 1), w = it.w * u, h = it.h * u + 0.75 * u;
      if (pal.tile) { ctx.moveTo(x - w / 2 - 0.05 * u, y - h); ctx.lineTo(x, y - h - 0.32 * u); ctx.lineTo(x + w / 2 + 0.05 * u, y - h); ctx.closePath(); }
      else ctx.rect(x - w / 2 - 0.04 * u, y - h - 0.08 * u, w + 0.08 * u, 0.1 * u);
    }
    ctx.fill();
    // 杨树（大马士革的园子）
    ctx.fillStyle = sh([58, 84, 58], D);
    ctx.beginPath();
    for (const it of list) if (it.k === 'pop') { const x = it.x * W.w, y = gYb(x, 1) - 0.4 * u, h = it.h * u; ctx.moveTo(x + 0.2 * u, y); ctx.ellipse(x, y - h * 0.5, 0.2 * u, h * 0.5, 0, 0, TAU); }
    ctx.fill();
    // 圣殿（耶路撒冷）、灯塔与神庙（凯撒利亚）、柱廊（安提阿）
    for (const it of list) {
      const x = it.x * W.w, y = gYb(clamp(x, 0, W.w), 1);
      if (it.k === 'temple') {
        const w = 3.1 * u, h = 2.9 * u;
        ctx.fillStyle = sh([236, 224, 196], D, 1, 0.05);
        ctx.fillRect(x - w / 2, y - h, w, h);
        ctx.fillRect(x - w * 0.72, y - h * 0.55, w * 1.44, h * 0.55);
        ctx.fillStyle = sh([150, 132, 104], D);
        for (let i = 0; i < 7; i++) ctx.fillRect(x - w * 0.62 + i * w * 0.2, y - h * 0.5, 0.06 * u, h * 0.48);
        ctx.fillStyle = sh(GOLD, D, 0.9, 0.15);
        ctx.fillRect(x - w / 2 - 0.05 * u, y - h - 0.12 * u, w + 0.1 * u, 0.12 * u);
      } else if (it.k === 'light') {
        if (!W.hasLand(1, x, 0)) continue;
        const w = 0.55 * u, h = 3.2 * u;
        ctx.fillStyle = sh([226, 220, 206], D);
        ctx.beginPath(); ctx.moveTo(x - w * 0.6, y); ctx.lineTo(x - w * 0.35, y - h); ctx.lineTo(x + w * 0.35, y - h); ctx.lineTo(x + w * 0.6, y); ctx.closePath(); ctx.fill();
        ctx.fillRect(x - w * 0.45, y - h - 0.35 * u, w * 0.9, 0.35 * u);
        const fk = Math.max(nightK(), 0.2) * A;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'f', x, y - h - 0.2 * u, 0.9 * u, 0.55 * fk);
        glow(ctx, 'g', x, y - h - 0.2 * u, 2.4 * u, 0.25 * fk);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = A;
      } else if (it.k === 'podium') {
        const w = 2.4 * u, h = 2.3 * u;
        ctx.fillStyle = sh([242, 238, 228], D, 1, 0.04);
        ctx.fillRect(x - w / 2, y - h * 0.35, w, h * 0.35);
        ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - h * 0.8); ctx.lineTo(x, y - h * 1.05); ctx.lineTo(x + w * 0.42, y - h * 0.8); ctx.closePath(); ctx.fill();
        for (let i = 0; i < 6; i++) ctx.fillRect(x - w * 0.4 + i * w * 0.155, y - h * 0.8, 0.09 * u, h * 0.45);
      } else if (it.k === 'colon') {
        const x2 = it.x2 * W.w;
        ctx.fillStyle = sh([236, 222, 190], D, 1, 0.04);
        const n = 14;
        for (let i = 0; i <= n; i++) { const cx = lerp(x, x2, i / n), cy = gYb(cx, 1); ctx.fillRect(cx - 0.05 * u, cy - 1.45 * u, 0.1 * u, 1.45 * u); }
        ctx.beginPath();
        for (let i = 0; i <= n; i++) { const cx = lerp(x, x2, i / n), cy = gYb(cx, 1) - 1.55 * u; if (i) ctx.lineTo(cx, cy); else ctx.moveTo(cx, cy); }
        ctx.lineWidth = Math.max(1, 0.14 * u); ctx.strokeStyle = sh([236, 222, 190], D); ctx.stroke();
      }
    }
    // 城墙与城楼
    ctx.fillStyle = sh(mix(pal.wall, STONE, 0.5), D, 1, -0.02);
    ctx.beginPath();
    const N = 18;
    for (let i = 0; i <= N; i++) { const x = lerp(a, b, i / N) * W.w, y = gYb(x, 1) - 0.72 * u; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(a, b, i / N) * W.w; ctx.lineTo(x, gYb(x, 1) + 3); }
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    for (const it of list) if (it.k === 't') { const x = it.x * W.w, y = gYb(clamp(x, 0, W.w), 1), w = it.w * u, h = it.h * u; ctx.rect(x - w / 2, y - h, w, h + 2); ctx.rect(x - w / 2 - 0.06 * u, y - h - 0.12 * u, 0.2 * u, 0.14 * u); ctx.rect(x + w / 2 - 0.14 * u, y - h - 0.12 * u, 0.2 * u, 0.14 * u); }
    ctx.fill();
    // 受光的一道边
    ctx.strokeStyle = sh([255, 240, 214], D, 0.35 * W.daylight);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(a, b, i / N) * W.w, y = gYb(x, 1) - 0.72 * u; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    // 夜里窗中的灯
    if (lamp > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      for (const it of list) if (it.k === 'h' && it.lit) { const x = it.x * W.w, y = gYb(x, 1) - (it.h * 0.6 + 0.75) * u; glow(ctx, 'g', x, y, 0.5 * u, 0.5 * lamp * A); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  近地右边的城（平顶或瓦顶的房屋、树）
  // ════════════════════════════════════════════════════════════
  function townHouses(style) {
    const u = H2(), x0 = X('town')[0] * W.w, out = [], sd = SEED[style] || 1;
    let x = x0, i = 0;
    while (x < W.w + 2.5 * u && i < 14) {
      if (i > 0 && hsh(sd + i * 7.3) < 0.34) { out.push({ tree: true, x: x + 0.2 * u, h: (1.45 + 0.6 * hsh(sd + i * 2.2)) * u, i }); x += 0.45 * u; }
      const w = (1.45 + 0.95 * hsh(sd + i * 3.1)) * u, h = (1.15 + 0.8 * hsh(sd + i * 5.7)) * u;
      out.push({ x: x + w / 2, w, h, i, lit: hsh(sd + i * 4.4) < 0.6, cols: i === 1 });
      x += w + (0.08 + 0.2 * hsh(sd + i * 9.1)) * u;
      i++;
    }
    return out;
  }
  function drawTree(ctx, kind, x, y, h, D, a) {
    const u = h / 2;
    ctx.globalAlpha = a;
    if (kind === 'poplar') {
      ctx.fillStyle = sh([60, 86, 58], D);
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.55, h * 0.13, h * 0.5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh([84, 110, 70], D, 0.8, 0.05);
      ctx.beginPath(); ctx.ellipse(x - h * 0.04, y - h * 0.62, h * 0.06, h * 0.36, 0, 0, TAU); ctx.fill();
    } else if (kind === 'palm') {
      ctx.strokeStyle = sh([112, 88, 62], D); ctx.lineWidth = Math.max(1, 0.09 * u);
      const tx = x + 0.25 * u, ty = y - h;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 0.02 * u, y - h * 0.6, tx, ty); ctx.stroke();
      ctx.strokeStyle = sh([72, 100, 60], D); ctx.lineWidth = Math.max(1, 0.12 * u);
      ctx.beginPath();
      for (let k = 0; k < 7; k++) {
        const an = -Math.PI * (0.08 + 0.84 * k / 6), L2 = (0.75 + 0.2 * hsh(k + x)) * u;
        const ex = tx + Math.cos(an) * L2, ey = ty + Math.sin(an) * L2 * 0.5 + 0.35 * u;
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(an) * L2 * 0.6, ty + Math.sin(an) * L2 * 0.6 - 0.1 * u, ex, ey);
      }
      ctx.stroke();
    } else {
      // 橄榄树：灰绿的一团，黑的干
      ctx.fillStyle = sh([74, 60, 46], D);
      ctx.fillRect(x - 0.05 * u, y - h * 0.45, 0.1 * u, h * 0.45);
      ctx.fillStyle = sh([122, 138, 104], D);
      ctx.beginPath();
      ctx.ellipse(x, y - h * 0.64, h * 0.26, h * 0.17, 0, 0, TAU);
      ctx.ellipse(x - h * 0.17, y - h * 0.52, h * 0.16, h * 0.12, 0, 0, TAU);
      ctx.ellipse(x + h * 0.18, y - h * 0.54, h * 0.16, h * 0.12, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = sh([150, 164, 128], D, 0.7, 0.04);
      ctx.beginPath(); ctx.ellipse(x - h * 0.06, y - h * 0.7, h * 0.14, h * 0.07, 0, 0, TAU); ctx.fill();
    }
  }
  function drawTown(ctx) {
    const A = L('dmTown');
    if (A < 0.01 || !TOWN[S.town]) return;
    const pal = TOWN[S.town], list = townHouses(S.town), u = H2();
    const lamp = nightK() * L('dmLamp'), d = litX();
    let prayI = -1;
    for (const H of list) if (!H.tree && H.x + 0.3 * H.w < W.w) prayI = H.i;
    for (const H of list) {
      if (H.tree) { const y = gYb(H.x) + 2; drawTree(ctx, pal.tree, H.x, y, H.h, 0.04, A); continue; }
      const x0 = H.x - H.w / 2, x1 = H.x + H.w / 2;
      const y = Math.max(gYb(x0), gYb(x1), gYb(H.x)) + 2, top = y - H.h;
      ctx.globalAlpha = A;
      ctx.fillStyle = sh(pal.wall, 0.02);
      ctx.fillRect(x0, top, H.w, H.h);
      // 高一层的小屋（退进去一些）
      const up = H.i % 3 === 1 && !pal.tile;
      if (up) { ctx.fillRect(x0 + 0.18 * H.w, top - 0.55 * u, 0.5 * H.w, 0.56 * u); }
      // 墙脚一道暗的石基；墙面几道旧的水痕
      ctx.fillStyle = sh(mix(pal.wall, [96, 84, 70], 0.45), 0.02);
      ctx.fillRect(x0, y - 0.14 * u, H.w, 0.14 * u);
      ctx.fillStyle = sh(mix(pal.wall, [150, 136, 112], 0.35), 0.02, 0.35);
      for (let k = 0; k < 3; k++) { const sx = x0 + (0.15 + 0.3 * k + 0.1 * hsh(H.i * 7 + k)) * H.w; ctx.fillRect(sx, top + 0.1 * u, 0.04 * u, (0.25 + 0.3 * hsh(H.i * 3 + k)) * H.h); }
      // 背光的一侧
      ctx.fillStyle = sh(mix(pal.wall, [60, 54, 50], 0.35), 0.02);
      if (d >= H.x) ctx.fillRect(x0, top, 0.12 * H.w, H.h); else ctx.fillRect(x1 - 0.12 * H.w, top, 0.12 * H.w, H.h);
      // 房顶
      if (pal.tile) {
        ctx.fillStyle = sh(pal.roof, 0.02);
        ctx.beginPath(); ctx.moveTo(x0 - 0.1 * u, top); ctx.lineTo(x0 + 0.2 * u, top - 0.34 * u); ctx.lineTo(x1 - 0.2 * u, top - 0.34 * u); ctx.lineTo(x1 + 0.1 * u, top); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = sh(mix(pal.roof, [60, 30, 20], 0.35), 0.02, 0.7); ctx.lineWidth = Math.max(0.5, 0.025 * u);
        ctx.beginPath(); for (let k = 1; k < 4; k++) { const yy = top - k * 0.085 * u; ctx.moveTo(x0 + (k * 0.06) * u, yy); ctx.lineTo(x1 - k * 0.06 * u, yy); } ctx.stroke();
      } else {
        ctx.fillStyle = sh(pal.roof, 0.02);
        ctx.fillRect(x0 - 0.06 * u, top - 0.12 * u, H.w + 0.12 * u, 0.12 * u);
        ctx.fillRect(x0 - 0.06 * u, top - 0.24 * u, 0.16 * u, 0.12 * u);
        ctx.fillRect(x1 - 0.1 * u, top - 0.24 * u, 0.16 * u, 0.12 * u);
        if (up) { ctx.fillRect(x0 + 0.15 * H.w, top - 0.62 * u, 0.56 * H.w, 0.09 * u); ctx.fillStyle = sh(DOOR, 0.02); ctx.fillRect(x0 + 0.36 * H.w, top - 0.42 * u, 0.16 * u, 0.22 * u); }
        // 房顶上晒的席子、一根竿子
        if (H.i % 2 === 0) { ctx.fillStyle = sh([200, 176, 132], 0.02); ctx.fillRect(x0 + 0.55 * H.w, top - 0.2 * u, 0.3 * H.w, 0.08 * u); }
      }
      // 门与窗
      const dx = H.x + (H.i % 2 ? 0.22 : -0.25) * H.w, dw = 0.36 * u, dh = 0.72 * u;
      ctx.fillStyle = sh(pal.door, 0.02);
      ctx.fillRect(dx - dw / 2, y - dh, dw, dh);
      ctx.beginPath(); ctx.arc(dx, y - dh, dw / 2, Math.PI, 0); ctx.fill();
      ctx.fillStyle = sh(mix(pal.wall, [255, 250, 240], 0.3), 0.02);
      ctx.fillRect(dx - dw / 2 - 0.05 * u, y - dh - dw / 2 - 0.06 * u, dw + 0.1 * u, 0.05 * u);
      const wx = H.x + (H.i % 2 ? -0.22 : 0.24) * H.w, wy = top + 0.3 * u, ws = 0.2 * u;
      ctx.fillStyle = sh(DOOR, 0.02);
      ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.2);
      if (H.h > 1.65 * u) ctx.fillRect(dx - ws / 2, top + 0.3 * u, ws, ws * 1.2);
      // 柱廊（凯撒利亚、安提阿的一座）
      if (pal.cols && H.cols) {
        ctx.fillStyle = sh([244, 240, 232], 0.02, 1, 0.04);
        for (let k = 0; k < 5; k++) ctx.fillRect(x0 + (0.08 + k * 0.21) * H.w, top + 0.18 * u, 0.07 * u, H.h - 0.18 * u);
        ctx.fillRect(x0 - 0.04 * u, top + 0.06 * u, H.w + 0.08 * u, 0.13 * u);
      }
      // 夜里的灯
      if (lamp > 0.02 && H.lit) {
        ctx.fillStyle = rgba([255, 204, 128], 0.85 * lamp * A);
        ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.2);
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'g', wx, wy + ws * 0.6, 0.7 * u, 0.45 * lamp * A);
        ctx.globalCompositeOperation = 'source-over';
      }
      // 聚集祷告之处（监牢那一夜，最右边的一间亮着）
      if (S.town === 'jerusalem' && H.i === prayI && L('dmPray') > 0.02) {
        const k = L('dmPray') * A;
        ctx.fillStyle = rgba([255, 214, 150], 0.9 * k);
        ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.2);
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'g', wx, wy + ws * 0.6, 1.4 * u, 0.55 * k);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = A;
      ctx.strokeStyle = sh([255, 238, 212], 0.02, 0.3 * W.daylight);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  前面敞开的房子：看得见屋里；右边一道外梯上房顶
  // ════════════════════════════════════════════════════════════
  function houseG(style) {
    const st = style || S.house;
    const key = st === 'cornelius' ? 'houseC' : st === 'mary' ? 'houseM' : st === 'simon' || st === 'tabitha' ? 'houseJ' : 'house';
    const u = H2(), x = X(key) * W.w;
    const w = 3.3 * u, hh = 1.62 * u;
    const y = Math.max(gYb(x - w / 2), gYb(x + w / 2), gYb(x)) + 2;
    return { u, x, y, w, hh, x0: x - w / 2, x1: x + w / 2, top: y - hh, slab: 0.15 * u };
  }
  // 房子里、门前的位置（画面宽的比例）：k 以人高计，自房子正中量起
  const hx = (k, style) => { const G = houseG(style); return (G.x + k * G.u) / W.w; };
  const roofY = G => G.top - G.slab;
  function stairG(G) { return { xa: G.x1 + 1.05 * G.u, xb: G.x1 + 0.02 * G.u }; }
  function gateMG() {
    const G = houseG('mary'), u = G.u, gx = X('gateM') * W.w;
    return { x: gx, w: 0.62 * u, h: 0.92 * u, x0: G.x1, x1: gx + 0.75 * u, y: gYb(gx) + 2, hh: 1.1 * u, u };
  }
  function drawHouse(ctx) {
    const A = L('dmHouse');
    if (A < 0.01 || !HOUSE[S.house]) return;
    const P = HOUSE[S.house], G = houseG(), u = G.u;
    const lamp = Math.max(nightK(), 0.28) * L('dmLamp');
    ctx.globalAlpha = A;
    // 后墙（屋里）
    ctx.fillStyle = sh(P.int, 0);
    ctx.fillRect(G.x0 + 0.1 * u, G.top, G.w - 0.2 * u, G.hh);
    // 屋里的地
    ctx.fillStyle = sh(mix(P.int, [140, 120, 96], 0.35), 0);
    ctx.fillRect(G.x0 + 0.1 * u, G.y - 0.1 * u, G.w - 0.2 * u, 0.1 * u);
    // 屋里的陈设
    if (P.loom) {
      // 织布的架子（她所做的里衣外衣）
      ctx.strokeStyle = sh(WOOD, 0, 0.9); ctx.lineWidth = Math.max(1, 0.05 * u);
      const lx = G.x1 - 0.95 * u;
      ctx.beginPath(); ctx.moveTo(lx, G.y - 0.08 * u); ctx.lineTo(lx, G.top + 0.35 * u); ctx.moveTo(lx + 0.5 * u, G.y - 0.08 * u); ctx.lineTo(lx + 0.5 * u, G.top + 0.35 * u);
      ctx.moveTo(lx - 0.05 * u, G.top + 0.4 * u); ctx.lineTo(lx + 0.55 * u, G.top + 0.4 * u); ctx.stroke();
      ctx.fillStyle = sh([188, 150, 110], 0, 0.9);
      ctx.fillRect(lx + 0.04 * u, G.top + 0.44 * u, 0.42 * u, 0.55 * u);
      ctx.fillStyle = sh([62, 74, 110], 0, 0.9);
      ctx.fillRect(lx + 0.04 * u, G.top + 0.8 * u, 0.42 * u, 0.12 * u);
    }
    if (P.cols) {
      // 小桌与灯台
      ctx.fillStyle = sh(WOOD, 0, 0.9);
      ctx.fillRect(G.x1 - 1.05 * u, G.y - 0.36 * u, 0.6 * u, 0.06 * u);
      ctx.fillRect(G.x1 - 0.8 * u, G.y - 0.32 * u, 0.08 * u, 0.3 * u);
    }
    // 灯（屋里）
    const lx = G.x0 + 0.42 * u, ly = G.y - 0.62 * u;
    ctx.fillStyle = sh(WOOD_D, 0);
    ctx.fillRect(lx - 0.025 * u, ly, 0.05 * u, 0.55 * u);
    ctx.fillRect(lx - 0.1 * u, G.y - 0.1 * u, 0.2 * u, 0.04 * u);
    if (lamp > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', lx, ly - 0.05 * u, 1.3 * u, 0.55 * lamp * A);
      glow(ctx, 'w', lx, ly - 0.05 * u, 0.12 * u, 0.9 * lamp * A);
      if (S.house === 'mary') glow(ctx, 'g', G.x1 - 0.6 * u, ly - 0.05 * u, 1.2 * u, 0.5 * lamp * A);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = A;
    }
    // 两边的墙与门楣
    ctx.fillStyle = sh(P.wall, 0);
    ctx.fillRect(G.x0, G.top, 0.3 * u, G.hh);
    ctx.fillRect(G.x1 - 0.3 * u, G.top, 0.3 * u, G.hh);
    ctx.fillRect(G.x0, G.top, G.w, 0.22 * u);
    ctx.fillStyle = sh(mix(P.wall, [60, 54, 50], 0.3), 0);
    ctx.fillRect(G.x0 + 0.3 * u, G.top + 0.22 * u, 0.08 * u, G.hh - 0.22 * u);
    // 柱子（哥尼流的家：罗马人的房子）
    if (P.cols) {
      ctx.fillStyle = sh([246, 242, 234], 0, 1, 0.04);
      for (const k of [-0.62, 0.62]) { ctx.fillRect(G.x + k * u - 0.08 * u, G.top + 0.2 * u, 0.16 * u, G.hh - 0.2 * u); ctx.fillRect(G.x + k * u - 0.13 * u, G.top + 0.16 * u, 0.26 * u, 0.07 * u); ctx.fillRect(G.x + k * u - 0.12 * u, G.y - 0.08 * u, 0.24 * u, 0.08 * u); }
    }
    // 房顶
    if (P.tile) {
      ctx.fillStyle = sh(P.roof, 0);
      ctx.beginPath(); ctx.moveTo(G.x0 - 0.18 * u, G.top + 0.02 * u); ctx.lineTo(G.x0 + 0.3 * u, G.top - 0.42 * u); ctx.lineTo(G.x1 - 0.3 * u, G.top - 0.42 * u); ctx.lineTo(G.x1 + 0.18 * u, G.top + 0.02 * u); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh(mix(P.roof, [60, 30, 20], 0.35), 0, 0.7); ctx.lineWidth = Math.max(0.6, 0.03 * u);
      ctx.beginPath(); for (let k = 1; k < 5; k++) { const yy = G.top - k * 0.085 * u; ctx.moveTo(G.x0 + (k * 0.1 - 0.1) * u, yy); ctx.lineTo(G.x1 - (k * 0.1 - 0.1) * u, yy); } ctx.stroke();
    } else {
      ctx.fillStyle = sh(P.roof, 0);
      ctx.fillRect(G.x0 - 0.1 * u, G.top - G.slab, G.w + 0.2 * u, G.slab);
      // 房顶四围的栏杆（申 22:8）
      ctx.fillStyle = sh(mix(P.wall, P.roof, 0.4), 0);
      ctx.fillRect(G.x0 - 0.1 * u, G.top - G.slab - 0.2 * u, 0.2 * u, 0.2 * u);
      ctx.fillRect(G.x0 - 0.1 * u, G.top - G.slab - 0.2 * u, G.w * 0.35, 0.07 * u);
      // 梁的端头
      ctx.fillStyle = sh(WOOD_D, 0);
      for (let i = 0; i < 6; i++) ctx.fillRect(G.x0 + (0.25 + i * 0.52) * u, G.top + 0.02 * u, 0.1 * u, 0.07 * u);
    }
    // 外梯
    if (P.stair) {
      const st = stairG(G), n = 6, dy = G.hh + G.slab;
      ctx.fillStyle = sh(mix(P.wall, STONE, 0.4), 0, 1, -0.03);
      ctx.beginPath();
      ctx.moveTo(st.xa, G.y);
      for (let i = 0; i < n; i++) { const xA = lerp(st.xa, st.xb, i / n), xB = lerp(st.xa, st.xb, (i + 1) / n), yT = G.y - (i + 1) * dy / n; ctx.lineTo(xA, yT); ctx.lineTo(xB, yT); }
      ctx.lineTo(st.xb, G.y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh([255, 238, 212], 0, 0.3 * W.daylight); ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const xA = lerp(st.xa, st.xb, i / n), xB = lerp(st.xa, st.xb, (i + 1) / n), yT = G.y - (i + 1) * dy / n; ctx.moveTo(xA, yT); ctx.lineTo(xB, yT); }
      ctx.stroke();
    }
    // 硝皮匠：门旁撑开的皮子与一口缸
    if (P.hides) {
      const st = stairG(G), fx0 = st.xa + 0.45 * u, fy = G.y;
      ctx.strokeStyle = sh(WOOD, 0); ctx.lineWidth = Math.max(1, 0.05 * u);
      ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.lineTo(fx0, fy - 1.05 * u); ctx.moveTo(fx0 + 0.8 * u, fy); ctx.lineTo(fx0 + 0.8 * u, fy - 1.05 * u); ctx.moveTo(fx0 - 0.05 * u, fy - 0.98 * u); ctx.lineTo(fx0 + 0.85 * u, fy - 0.98 * u); ctx.stroke();
      ctx.fillStyle = sh(HIDE, 0);
      ctx.beginPath(); ctx.moveTo(fx0 + 0.08 * u, fy - 0.92 * u); ctx.quadraticCurveTo(fx0 + 0.4 * u, fy - 1.0 * u, fx0 + 0.72 * u, fy - 0.92 * u);
      ctx.quadraticCurveTo(fx0 + 0.78 * u, fy - 0.6 * u, fx0 + 0.7 * u, fy - 0.32 * u); ctx.quadraticCurveTo(fx0 + 0.4 * u, fy - 0.22 * u, fx0 + 0.1 * u, fy - 0.32 * u);
      ctx.quadraticCurveTo(fx0 + 0.02 * u, fy - 0.6 * u, fx0 + 0.08 * u, fy - 0.92 * u); ctx.fill();
      ctx.fillStyle = sh([96, 80, 64], 0);
      ctx.beginPath(); ctx.ellipse(fx0 + 1.25 * u, fy - 0.2 * u, 0.3 * u, 0.2 * u, 0, 0, TAU); ctx.fill();
      ctx.fillRect(fx0 + 0.95 * u, fy - 0.2 * u, 0.6 * u, 0.2 * u);
    }
    // 马利亚的家：院墙与外门
    if (P.court) {
      const Q = gateMG(), op = L('dmDoor');
      ctx.fillStyle = sh(mix(P.wall, STONE, 0.3), 0);
      ctx.fillRect(Q.x0, Q.y - Q.hh, Q.x - Q.w / 2 - Q.x0, Q.hh);
      ctx.fillRect(Q.x + Q.w / 2, Q.y - Q.hh, Q.x1 - Q.x - Q.w / 2, Q.hh);
      ctx.fillRect(Q.x - Q.w / 2 - 0.05 * u, Q.y - Q.hh - 0.06 * u, Q.w + 0.1 * u, 0.2 * u);
      ctx.fillStyle = sh(mix(P.wall, [90, 80, 70], 0.3), 0);
      ctx.fillRect(Q.x0, Q.y - Q.hh - 0.06 * u, Q.x1 - Q.x0, 0.06 * u);
      // 门洞与门扇（向里开）
      ctx.fillStyle = sh([40, 32, 26], 0);
      ctx.fillRect(Q.x - Q.w / 2, Q.y - Q.h, Q.w, Q.h);
      if (op > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'g', Q.x, Q.y - Q.h * 0.45, 0.9 * u, 0.35 * op * Math.max(0.4, lamp) * A);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = A;
      }
      const lw = Q.w * (1 - 0.82 * ease(op));
      ctx.fillStyle = sh(WOOD, 0);
      ctx.fillRect(Q.x - Q.w / 2, Q.y - Q.h, lw, Q.h);
      ctx.strokeStyle = sh(WOOD_D, 0, 0.9); ctx.lineWidth = Math.max(0.6, 0.03 * u);
      ctx.beginPath(); for (let k = 1; k < 3; k++) { const yy = Q.y - Q.h * k / 3; ctx.moveTo(Q.x - Q.w / 2, yy); ctx.lineTo(Q.x - Q.w / 2 + lw, yy); } ctx.stroke();
    }
    // 受光的边
    ctx.strokeStyle = sh([255, 238, 212], 0, 0.32 * W.daylight); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(G.x0 - 0.1 * u, G.top - G.slab); ctx.lineTo(G.x1 + 0.1 * u, G.top - G.slab); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 屋里有光（使者来到、圣灵降下）
  function drawRoom(ctx) {
    const k = L('dmRoom');
    if (k < 0.01 || !HOUSE[S.house] || L('dmHouse') < 0.1) return;
    const G = houseG(), u = G.u;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, S.house === 'cornelius' && L('dmFlames') > 0.2 ? 'g' : 'w', G.x, G.y - 0.7 * u, 2.2 * u, 0.3 * k, 1.1 * u);
    glow(ctx, 'r', G.x, G.y - 0.6 * u, 3.4 * u, 0.16 * k, 1.5 * u);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  旷野的路与有水的地方
  // ════════════════════════════════════════════════════════════
  const ROAD_VL = [0.012, 0.1], ROAD_VP = [0.04, 0.14];
  function drawRoad(ctx) {
    const A = L('dmRoad'); if (A < 0.01) return;
    const ROAD_V = tall() ? ROAD_VP : ROAD_VL;
    const [xa, xb] = X('road'), N = 30;
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, xf = lerp(xa, xb, t), taper = ss(0, 0.2, t);
      const w = (ROAD_V[1] - ROAD_V[0]) * (0.35 + 0.65 * taper), mid = (ROAD_V[0] + ROAD_V[1]) / 2 + 0.012 * Math.sin(t * 7.3);
      top.push([xf * W.w, fieldY(xf, mid - w / 2)]); bot.push([xf * W.w, fieldY(xf, mid + w / 2)]);
    }
    ctx.globalAlpha = 0.8 * A;
    ctx.fillStyle = sh([232, 214, 176], 0, 1, 0.08);
    ctx.beginPath();
    top.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]);
    ctx.closePath(); ctx.fill();
    // 车辙
    ctx.globalAlpha = 0.45 * A;
    ctx.strokeStyle = sh([176, 150, 110], 0); ctx.lineWidth = Math.max(0.8, 0.025 * H2());
    ctx.beginPath();
    top.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.stroke();
    ctx.globalAlpha = 0.45 * A;
    ctx.strokeStyle = sh(SAND_D, 0); ctx.lineWidth = Math.max(0.6, 0.02 * H2());
    ctx.beginPath();
    for (const r of [0.35, 0.68]) { for (let i = 2; i <= N; i++) { const x = lerp(top[i][0], bot[i][0], r), y = lerp(top[i][1], bot[i][1], r); if (i > 2) ctx.lineTo(x, y); else ctx.moveTo(x, y); } }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function poolG() {
    const p = X('pool'), x = p[0] * W.w, y = fieldY(p[0], p[1]);
    const rx = p[2] * W.w * 1.18, ry = Math.max(5, rx * 0.2 + 0.05 * (W.h - gY(x)));
    return { x, y, rx, ry, v: p[1] };
  }
  function drawPalm(ctx, x, y, h, a) {
    ctx.globalAlpha = a;
    const tx = x + 0.12 * h, ty = y - h;
    ctx.strokeStyle = sh([110, 86, 60], 0); ctx.lineWidth = Math.max(1, 0.05 * h);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 0.04 * h, y - 0.55 * h, tx, ty); ctx.stroke();
    ctx.strokeStyle = sh([70, 98, 58], 0); ctx.lineWidth = Math.max(1, 0.06 * h);
    ctx.beginPath();
    for (let k = 0; k < 8; k++) {
      const an = -Math.PI * (0.02 + 0.96 * k / 7), L2 = (0.42 + 0.1 * hsh(k * 3 + x)) * h;
      const sw = Math.sin(S.clock * 0.9 + k) * 0.02 * h;
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(tx + Math.cos(an) * L2 * 0.55, ty + Math.sin(an) * L2 * 0.5 - 0.08 * h, tx + Math.cos(an) * L2 + sw, ty + Math.sin(an) * L2 * 0.35 + 0.22 * h);
    }
    ctx.stroke();
  }
  function drawPool(ctx) {
    const A = L('dmPool'); if (A < 0.01) return;
    const P = poolG(), u = H2();
    // 两棵棕树在水的后面
    drawPalm(ctx, P.x - 0.72 * P.rx, fieldY(P.x / W.w - 0.72 * P.rx / W.w, P.v - 0.22), 2.0 * u, A);
    drawPalm(ctx, P.x + 0.9 * P.rx, fieldY(P.x / W.w + 0.9 * P.rx / W.w, P.v - 0.24), 1.65 * u, A);
    // 湿的沙岸
    ctx.globalAlpha = 0.7 * A;
    ctx.fillStyle = sh([150, 132, 98], 0);
    ctx.beginPath(); ctx.ellipse(P.x, P.y, P.rx * 1.16, P.ry * 1.4, 0, 0, TAU); ctx.fill();
    // 水
    const top = W.shade(WATER_T, 0.35, 0.05), bot = W.shade(WATER_B, 0, 0.03);
    const g = ctx.createLinearGradient(0, P.y - P.ry, 0, P.y + P.ry);
    g.addColorStop(0, U.rgb(top[0], top[1], top[2])); g.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
    ctx.globalAlpha = 0.95 * A;
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(P.x, P.y, P.rx, P.ry, 0, 0, TAU); ctx.fill();
    // 天光
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,246,226)'; ctx.lineWidth = Math.max(0.6, 0.02 * u);
    ctx.globalAlpha = 0.35 * A * W.daylight;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const t = U.fract(hsh(i + 20) + S.clock * 0.02 * (0.6 + hsh(i + 21)));
      const yy = P.y - P.ry * 0.6 + t * P.ry * 1.2, half = P.rx * 0.5 * Math.sqrt(Math.max(0, 1 - Math.pow((yy - P.y) / P.ry, 2)));
      ctx.moveTo(P.x - half * 0.6 + hsh(i) * half * 0.4, yy); ctx.lineTo(P.x + half * 0.3 + hsh(i) * half * 0.4, yy);
    }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    // 芦苇
    ctx.globalAlpha = A;
    ctx.strokeStyle = sh([98, 122, 68], 0); ctx.lineWidth = Math.max(0.6, 0.025 * u);
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const an = Math.PI * (0.95 + 1.1 * hsh(i * 3 + 5)), r = 1.02 + 0.1 * hsh(i * 3 + 6);
      const x = P.x + Math.cos(an) * P.rx * r, y = P.y + Math.sin(an) * P.ry * r, h = (0.25 + 0.3 * hsh(i * 3 + 7)) * u;
      const sw = W.wind * 0.06 * u + Math.sin(S.clock * 1.4 + i) * 0.02 * u;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 站在水里的人：水没到膝；受洗时水涌起没过他（一团涌起又落下的水，上沿是柔的）
  function drawWade(ctx) {
    const A = L('dmPool'); if (A < 0.3) return;
    const P = poolG();
    const top = W.shade(WATER_T, 0.35, 0.05), bot = W.shade(WATER_B, 0, 0.03);
    for (const id of ['philip', 'eunuch']) {
      const f = fpos(id); if (!f || f.p.attach || f.p.fly || f.p.mount || f.p.ny != null) continue;
      const dx = (f.x - P.x) / P.rx, dy = (f.y - P.y) / P.ry;
      const inside = 1 - ss(0.55, 0.92, Math.hypot(dx, dy * 0.7));
      if (inside < 0.02) continue;
      let dk = 0;
      for (const e of FXL) if (e.type === 'dip' && e.id === id) dk = Math.max(dk, Math.sin(Math.PI * clamp(e.t / e.dur, 0, 1)));
      const h = f.h, wh = h * (0.16 + 0.1 * inside) + h * 0.28 * dk, w = h * (0.34 + 0.12 * dk);
      const a0 = A * f.p.alpha * inside;
      const ys = f.y - wh;
      // 与池水同色（按此处的深浅），两层：宽而淡的一层（边缘柔和）、窄而浓的一层
      const qm = clamp((f.y - wh * 0.4 - (P.y - P.ry)) / (2 * P.ry), 0, 1);
      const col = mix(top, bot, qm);
      for (const [ww, aa] of [[w * 1.6, 0.4], [w, 0.92]]) {
        ctx.globalAlpha = a0 * aa;
        ctx.fillStyle = rgba(col, 1);
        ctx.beginPath();
        ctx.moveTo(f.x - ww / 2, f.y + 0.03 * h);
        ctx.lineTo(f.x - ww / 2, ys + 0.03 * h);
        ctx.quadraticCurveTo(f.x, ys - 0.04 * h - 0.08 * h * dk, f.x + ww / 2, ys + 0.03 * h);
        ctx.lineTo(f.x + ww / 2, f.y + 0.03 * h);
        ctx.quadraticCurveTo(f.x, f.y + 0.07 * h, f.x - ww / 2, f.y + 0.03 * h);
        ctx.fill();
      }
      // 水面的亮线与一圈圈的涟漪
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(226,242,252)'; ctx.lineWidth = Math.max(0.6, 0.02 * h);
      ctx.globalAlpha = a0 * 0.5 * dayA();
      ctx.beginPath(); ctx.ellipse(f.x, ys + 0.03 * h, w * 0.55, 0.03 * h, 0, 0, TAU); ctx.stroke();
      for (let i = 0; i < 2; i++) {
        const qq = U.fract(S.clock * 0.4 + i / 2 + f.p.ord * 0.13), r = w * (0.6 + 1.1 * qq);
        ctx.globalAlpha = a0 * (1 - qq) * 0.4 * dayA();
        ctx.beginPath(); ctx.ellipse(f.x, ys + 0.04 * h, r, r * 0.14, 0, 0, TAU); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  车：太监坐在车上念以赛亚的书；腓利与他同坐
  // ════════════════════════════════════════════════════════════
  // 车上的一处（车本地的坐标，与 cast 画车同一算法）
  function carPt(lx, ly) {
    const c = person('car'); if (!c) return null;
    const s = W.layerScale(2) * boost() * 1.3 * (c.scale || 1) * (1 + 0.35 * (c.v || 0));
    const x = c.nx * W.w, y = fieldY(c.nx, c.v || 0);
    const f = c.facing || -1;
    return [x + lx * s * f, y + ly * s, s, f];
  }
  // 腓利坐在车后头（臀在车座上）
  const philipSeat = () => { const q = carPt(-13, -21.5); return q ? [q[0], q[1] + 0.27 * 34 * q[2]] : null; };
  function drawScroll(ctx) {
    const k = L('dmScroll');
    if (k < 0.01 || !has('eunuch')) return;
    const e = person('eunuch'); if (!e || !e.mount) return;
    const q = carPt(5.5, -31); if (!q) return;
    const s = q[2], f = q[3], x = q[0], y = q[1], w = 5.2 * s;
    ctx.globalAlpha = Math.min(1, e.alpha * 1.2) * clamp(k * 2, 0, 1);
    ctx.fillStyle = sh([236, 226, 196], 0, 1, 0.1 + 0.3 * L('dmTell'));
    ctx.fillRect(x - w / 2, y - 1.4 * s, w, 2.8 * s);
    ctx.fillStyle = sh(WOOD_L, 0);
    ctx.fillRect(x - w / 2 - 0.9 * s, y - 1.9 * s, 1.1 * s, 3.8 * s);
    ctx.fillRect(x + w / 2 - 0.2 * s, y - 1.9 * s, 1.1 * s, 3.8 * s);
    ctx.strokeStyle = sh([110, 90, 70], 0, 0.8); ctx.lineWidth = Math.max(0.5, 0.25 * s);
    ctx.beginPath(); for (let i = 0; i < 3; i++) { const yy = y - 0.8 * s + i * 0.8 * s; ctx.moveTo(x - w * 0.36, yy); ctx.lineTo(x + w * 0.36, yy); } ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, y, 4.5 * s, (0.25 + 0.35 * L('dmTell')) * k);
    ctx.globalCompositeOperation = 'source-over';
    // 腓利对他传讲耶稣：车上一团暖光
    const t = L('dmTell');
    if (t > 0.01) {
      const q2 = carPt(-4, -30);
      if (q2) {
        // 白昼里也要看得出：一大团暖光罩着车上同坐的两个人，书卷上一缕缕柔光升起
        const hh = 34 * s, day = 0.6 + 0.4 * W.daylight;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'r', q2[0], q2[1], 1.6 * hh, 0.35 * t * day, 1.1 * hh);
        glow(ctx, 'g', q2[0], q2[1] - 0.1 * hh, 0.9 * hh, 0.3 * t * day);
        glow(ctx, 'w', q2[0], q2[1], 0.35 * hh, 0.3 * t);
        for (let i = 0; i < 6; i++) {
          const ph = U.fract(S.clock * 0.22 + i / 6), sx = x + Math.sin(S.clock * 0.9 + i * 2.1) * 0.25 * hh;
          glow(ctx, 'g', sx, y - ph * 1.6 * hh, (0.1 + 0.06 * (1 - ph)) * hh, 0.55 * t * Math.sin(Math.PI * ph));
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 他像羊被牵到宰杀之地：天上一只光的羊羔（只是光，不画伤）
  function drawLamb(ctx) {
    const k = L('dmLamb'); if (k < 0.01) return;
    const u = H2() * 0.62;
    const cx0 = has('car') && person('car') ? person('car').nx : X('car2');
    const x = (cx0 - 0.01) * W.w, y = (tall() ? 0.47 : 0.42) * W.h, s = u;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'r', x, y, 2.6 * s, 0.4 * k);
    glow(ctx, 'w', x, y, 1.1 * s, 0.35 * k);
    ctx.globalAlpha = 0.42 * k;
    ctx.fillStyle = 'rgb(255,250,236)';
    // 面朝左，低着头，安静地走
    const st = Math.sin(S.clock * 1.6) * 0.06 * s;
    ctx.beginPath();
    ctx.ellipse(x, y, 0.5 * s, 0.26 * s, 0, 0, TAU);
    ctx.ellipse(x - 0.52 * s, y + 0.02 * s, 0.17 * s, 0.13 * s, 0.35, 0, TAU);
    ctx.ellipse(x - 0.48 * s, y - 0.1 * s, 0.07 * s, 0.04 * s, -0.5, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = 'rgb(255,250,236)'; ctx.lineWidth = Math.max(1, 0.07 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [lx, ph] of [[-0.3, 0], [-0.18, 1], [0.24, 1], [0.36, 0]]) { const sw = ph ? st : -st; ctx.moveTo(x + lx * s, y + 0.18 * s); ctx.lineTo(x + lx * s + sw, y + 0.5 * s); }
    ctx.moveTo(x + 0.48 * s, y - 0.05 * s); ctx.lineTo(x + 0.6 * s, y + 0.06 * s);
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光：从天上来的光（大马士革路上）、异象的光、提了去的光、屋里的光
  // ════════════════════════════════════════════════════════════
  // 光柱的上端：竖屏的经文在画面上方，光柱从经文下面起（贴图上端本是淡入的，看来仍像自天而下）
  const beamTop = () => (tall() ? 0.34 : -0.02) * W.h;
  // low：人仆倒、躺卧时，光柱的核心停在他身子之上，地上的光也收一些，好让伏在地上的人看得出来
  function shineOn(ctx, id, k, key, wMul, a0, ringK, low) {
    if (k < 0.01) return;
    const f = fpos(id); if (!f) return;
    const h = f.h, x = f.x, y = f.y, lo = low ? 1 : 0;
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, x, beamTop(), y + (0.12 - 0.5 * lo) * h, h * wMul, a0 * k * (1 - 0.25 * lo));
    beam(ctx, x, beamTop(), y + 0.08 * h, h * wMul * 2.8, a0 * 0.32 * k * (1 - 0.35 * lo));
    glow(ctx, key, x, y - (0.45 + 0.35 * lo) * h, 1.5 * h, 0.5 * k * (1 - 0.4 * lo));
    if (ringK) glow(ctx, key, x, y, 2.4 * h * ringK, 0.5 * k * (1 - 0.6 * lo), 0.34 * h * ringK);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawShines(ctx) {
    // 大马士革路上：比日头还亮的光，四面照着他
    const b = L('dmBeam');
    if (b > 0.01) {
      const f = fpos('paul');
      if (f) {
        const h = f.h, low = f.p.pose === 'fall' || f.p.pose === 'lie';
        shineOn(ctx, 'paul', b, 'w', 2.2, 0.85, 1.25, low);
        ctx.globalCompositeOperation = 'lighter';
        // 四面的光：地上一圈一圈向外
        ctx.strokeStyle = 'rgb(255,248,230)';
        ctx.lineWidth = Math.max(1, 0.05 * h);
        for (let i = 0; i < 3; i++) {
          const q = U.fract(S.clock * 0.35 + i / 3), r = h * (0.8 + 3.2 * q);
          ctx.globalAlpha = 0.35 * b * (1 - q);
          ctx.beginPath(); ctx.ellipse(f.x, f.y, r, r * 0.16, 0, 0, TAU); ctx.stroke();
        }
        // 自天而下的几道光
        for (let i = 0; i < 9; i++) {
          const a = (i - 4) * 0.075 + Math.sin(S.clock * 0.3 + i) * 0.01, len = f.y - beamTop() + 0.1 * h;
          ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(a);
          ctx.globalAlpha = 0.07 * b;
          if (SP.beam) ctx.drawImage(SP.beam, -0.35 * h, -len, 0.7 * h, len);
          ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    // 使者：白昼里也看得出是光
    const an = fpos('angel');
    if (an) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'w', an.x, an.y - 0.55 * an.h, 1.2 * an.h, 0.32 * an.p.alpha * (0.6 + 0.4 * W.daylight));
      glow(ctx, 'r', an.x, an.y - 0.5 * an.h, 2.2 * an.h, 0.16 * an.p.alpha);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    shineOn(ctx, 'ananias', L('dmVision'), 'g', 1.3, 0.4, 0.8);
    shineOn(ctx, 'philip', L('dmLift'), 'w', 1.5, 0.6, 0.9);
    // 监牢里睡着的彼得：高窗里的月光落在他身上（看得出一个人躺在两个兵丁当中）
    if (L('dmPrison') > 0.3) {
      const pf = fpos('peter');
      const mk = W.night * (W.lv.moon || 0) * (1 - L('dmCell')) * L('dmPrison');
      if (pf && mk > 0.02 && (pf.p.pose === 'lie' || pf.p.pose === 'sit')) {
        const d = pf.p.fd || pf.p.facing || 1, h = pf.h;
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'b', pf.x - 0.1 * h * d, pf.y - 0.1 * h, 0.75 * h, 0.3 * mk * pf.p.alpha, 0.28 * h);
        glow(ctx, 'c', pf.x - 0.1 * h * d, pf.y - 0.08 * h, 0.5 * h, 0.16 * mk * pf.p.alpha, 0.14 * h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    // 监牢里：屋里有光照耀（光在使者身上，也照满牢房）
    const c = L('dmCell');
    if (c > 0.01) {
      const f = fpos('angel');
      const Pg = prisonG();
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'w', Pg.cellX, Pg.y - 0.8 * Pg.u, 2.2 * Pg.u, 0.34 * c, 1.1 * Pg.u);
      glow(ctx, 'r', Pg.cellX, Pg.y - 0.8 * Pg.u, 3.6 * Pg.u, 0.2 * c, 1.6 * Pg.u);
      if (f) glow(ctx, 'w', f.x, f.y - 0.5 * f.h, 1.6 * f.h, 0.4 * c);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 主与他们同在：安提阿众人之上一片温暖的光
    const w = L('dmWith');
    if (w > 0.01) {
      const [a0, a1] = X('antA'), [b0, b1] = X('antB'), cx = (a0 + b1) / 2 * W.w, cy = gY(cx) - 0.5 * H2();
      const rx = (b1 - a0) * 0.62 * W.w;
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'r', cx, cy, rx, 0.22 * w, rx * 0.4);
      glow(ctx, 'g', cx, cy - 0.4 * H2(), rx * 0.6, 0.12 * w, rx * 0.25);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  看不见：世界失了颜色；鳞掉下来，颜色自扫罗绽放
  // ════════════════════════════════════════════════════════════
  function landPath(ctx) {
    ctx.beginPath();
    const step = Math.max(6, W.w / 110);
    for (let layer = 0; layer < 3; layer++) {
      const wl = W.waterlineY(layer), bottom = layer === 2 ? W.h + 4 : wl + 1;
      let open = false;
      for (let x = -step; x <= W.w + step; x += step) {
        const xx = clamp(x, 0, W.w), y = W.ridgeY(layer, xx);
        const on = y < wl;
        if (on && !open) { ctx.moveTo(x, bottom); ctx.lineTo(x, y); open = true; }
        else if (on) ctx.lineTo(x, y);
        else if (open) { ctx.lineTo(x, bottom); ctx.closePath(); open = false; }
      }
      if (open) { ctx.lineTo(W.w + step, bottom); ctx.closePath(); }
    }
  }
  function drawBlind(ctx) {
    const m = L('dmBlind'); if (m < 0.01) return;
    const sight = L('dmSight');
    if (sight >= 0.999) return;
    const R = ease(sight) * Math.hypot(W.w, W.h) * 1.15;
    const f = fpos(S.bloomId) || { x: X('house') * W.w, y: gY(X('house') * W.w), h: H2() };
    const cx = f.x, cy = f.y - 0.5 * f.h;
    const edge = Math.max(30, 0.07 * M());
    // 两圈：前沿柔一些；尚未绽放时一遍就够（透明度按两遍叠起来算）
    const rings = sight > 0.001 ? [R + edge * 0.9, R] : [0];
    const one = rings.length === 1, aS = one ? 1 - 0.25 * 0.25 : 0.75, aV = one ? 0.19 : 0.1;
    for (const r of rings) {
      ctx.save();
      ctx.beginPath(); ctx.rect(-10, -10, W.w + 20, W.h + 20);
      if (r > 0) ctx.arc(cx, cy, r, 0, TAU, true);
      ctx.clip('evenodd');
      landPath(ctx);
      ctx.globalCompositeOperation = 'saturation';
      ctx.globalAlpha = aS * m;
      ctx.fillStyle = 'rgb(128,128,128)';
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = aV * m;
      ctx.fillStyle = 'rgb(40,42,50)';
      ctx.fillRect(-10, -10, W.w + 20, W.h + 20);
      ctx.restore();
    }
    // 颜色绽放的前沿：一圈淡淡的金光
    const moving = Math.abs((W.lt.dmSight || 0) - sight) > 0.002;
    if (moving && sight > 0.001 && R > 2) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(255,226,170)';
      ctx.lineWidth = edge * 0.5;
      ctx.globalAlpha = 0.12 * m * (1 - sight);
      ctx.beginPath(); ctx.arc(cx, cy, R + edge * 0.3, 0, TAU); ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  大马士革的城墙、城门、火把与筐子
  // ════════════════════════════════════════════════════════════
  function wallG() {
    const u = H2(), [a, b] = X('wall'), x0 = a * W.w, x1 = b * W.w;
    const wx = X('win') * W.w, gx = X('gateX') * W.w;
    const yAt = x => gYb(x) + 2;
    return { u, x0, x1, hh: 2.05 * u, yAt, win: { x: wx, y: yAt(wx) - 1.62 * u, w: 0.46 * u, h: 0.4 * u }, gate: { x: gx, y: yAt(gx), w: 0.95 * u, h: 1.4 * u } };
  }
  function drawWall(ctx) {
    const A = L('dmWall'); if (A < 0.01) return;
    const G = wallG(), u = G.u, N = 24;
    ctx.globalAlpha = A;
    // 墙身
    ctx.fillStyle = sh(STONE, 0);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(G.x0, G.x1, i / N); const y = G.yAt(x) - G.hh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(G.x0, G.x1, i / N); ctx.lineTo(x, G.yAt(x) + 2); }
    ctx.closePath(); ctx.fill();
    // 垛口
    ctx.beginPath();
    for (let x = G.x0; x < G.x1; x += 0.52 * u) { const y = G.yAt(x) - G.hh; ctx.rect(x, y - 0.26 * u, 0.3 * u, 0.27 * u); }
    ctx.fill();
    // 石缝
    ctx.strokeStyle = sh(STONE_D, 0, 0.5); ctx.lineWidth = Math.max(0.5, 0.02 * u);
    ctx.beginPath();
    for (let r = 1; r < 7; r++) {
      for (let i = 0; i < N; i++) {
        const xa = lerp(G.x0, G.x1, i / N), xb = lerp(G.x0, G.x1, (i + 1) / N);
        const ya = G.yAt(xa) - r * G.hh / 7, yb = G.yAt(xb) - r * G.hh / 7;
        ctx.moveTo(xa, ya); ctx.lineTo(xb, yb);
      }
      for (let x = G.x0 + (r % 2) * 0.35 * u; x < G.x1; x += 0.7 * u) { const y = G.yAt(x) - r * G.hh / 7; ctx.moveTo(x, y); ctx.lineTo(x, y + G.hh / 7); }
    }
    ctx.stroke();
    // 城门（拱）
    const g = G.gate;
    ctx.fillStyle = sh([34, 28, 24], 0);
    ctx.beginPath(); ctx.moveTo(g.x - g.w / 2, g.y); ctx.lineTo(g.x - g.w / 2, g.y - g.h + g.w / 2); ctx.arc(g.x, g.y - g.h + g.w / 2, g.w / 2, Math.PI, 0); ctx.lineTo(g.x + g.w / 2, g.y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(STONE_D, 0);
    ctx.fillRect(g.x - g.w / 2 - 0.12 * u, g.y - g.h - 0.1 * u, g.w + 0.24 * u, 0.12 * u);
    // 城墙上的窗
    const w = G.win;
    ctx.fillStyle = sh([30, 26, 22], 0);
    ctx.fillRect(w.x - w.w / 2, w.y, w.w, w.h);
    const lamp = nightK() * L('dmLamp');
    if (lamp > 0.02 && L('dmBasketA') > 0.02) {
      ctx.fillStyle = rgba([255, 204, 128], 0.75 * lamp * A);
      ctx.fillRect(w.x - w.w / 2, w.y, w.w, w.h);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', w.x, w.y + w.h / 2, 1.0 * u, 0.5 * lamp * A);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = A;
      // 窗里两个人影（门徒拉着绳子）
      ctx.fillStyle = sh([40, 32, 28], 0);
      for (const k of [-0.13, 0.13]) { ctx.beginPath(); ctx.arc(w.x + k * u, w.y + 0.14 * u, 0.07 * u, 0, TAU); ctx.fill(); ctx.fillRect(w.x + k * u - 0.08 * u, w.y + 0.2 * u, 0.16 * u, 0.22 * u); }
    }
    // 受光的边
    ctx.strokeStyle = sh([255, 238, 212], 0, 0.3 * W.daylight); ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(G.x0, G.x1, i / N); const y = G.yAt(x) - G.hh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawTorches(ctx) {
    const k = L('dmTorch') * L('dmWall'); if (k < 0.01) return;
    const G = wallG(), g = G.gate, u = G.u;
    for (const s of [-1, 1]) {
      const x = g.x + s * (g.w / 2 + 0.28 * u), y = g.y - 1.15 * u;
      ctx.globalAlpha = k;
      ctx.fillStyle = sh(WOOD_D, 0);
      ctx.fillRect(x - 0.03 * u, y, 0.06 * u, 0.3 * u);
      const fl = 1 + 0.15 * Math.sin(S.clock * 9 + s) * Math.sin(S.clock * 5.3);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'f', x, y - 0.08 * u, 0.28 * u * fl, 0.9 * k);
      glow(ctx, 'g', x, y - 0.08 * u, 1.6 * u * fl, 0.4 * k * (0.4 + 0.6 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function basketPt() {
    const G = wallG(), u = G.u, w = G.win;
    const k = ease(L('dmBasket'));
    const y0 = w.y + w.h + 0.52 * u, y1 = G.yAt(w.x) - 0.02 * u;
    return { x: w.x, y: lerp(y0, y1, k), u, top: w.y + w.h * 0.5 };
  }
  // 扫罗坐在筐子里（脚在筐底）
  const saulBasket = () => { const B = basketPt(); return [B.x, B.y - 0.1 * B.u]; };
  function drawBasket(ctx, front) {
    const A = L('dmBasketA') * L('dmWall'); if (A < 0.01) return;
    const B = basketPt(), u = B.u, x = B.x, y = B.y;
    const wT = 0.4 * u, wB = 0.3 * u, hB = 0.46 * u;
    ctx.globalAlpha = A;
    if (!front) {
      // 绳子与筐的后沿
      ctx.strokeStyle = sh([150, 126, 90], 0, 0.9); ctx.lineWidth = Math.max(0.7, 0.025 * u);
      ctx.beginPath(); ctx.moveTo(x - 0.08 * u, B.top); ctx.lineTo(x - wT * 0.9, y - hB - 0.02 * u); ctx.moveTo(x + 0.08 * u, B.top); ctx.lineTo(x + wT * 0.9, y - hB - 0.02 * u); ctx.stroke();
      ctx.fillStyle = sh(WICKER_D, 0);
      ctx.beginPath(); ctx.ellipse(x, y - hB, wT, 0.08 * u, 0, Math.PI, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      return;
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, y - 0.5 * u, 1.3 * u, 0.28 * A * (0.3 + 0.7 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = A;
    ctx.fillStyle = sh(WICKER, 0, 1, 0.12 * nightK());
    ctx.beginPath(); ctx.moveTo(x - wT, y - hB); ctx.quadraticCurveTo(x, y - hB + 0.1 * u, x + wT, y - hB); ctx.lineTo(x + wB, y - 0.04 * u); ctx.quadraticCurveTo(x, y + 0.04 * u, x - wB, y - 0.04 * u); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh(WICKER_D, 0, 0.8); ctx.lineWidth = Math.max(0.5, 0.02 * u);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const t = i / 4, yy = lerp(y - hB, y - 0.04 * u, t), ww = lerp(wT, wB, t); ctx.moveTo(x - ww, yy); ctx.quadraticCurveTo(x, yy + 0.08 * u, x + ww, yy); }
    for (let i = -3; i <= 3; i++) { ctx.moveTo(x + i * wT / 3.6, y - hB + 0.04 * u); ctx.lineTo(x + i * wB / 3.6, y - 0.03 * u); }
    ctx.stroke();
    ctx.strokeStyle = sh([230, 200, 150], 0, 0.5 + 0.4 * nightK()); ctx.lineWidth = Math.max(0.7, 0.03 * u);
    ctx.beginPath(); ctx.moveTo(x - wT, y - hB); ctx.quadraticCurveTo(x, y - hB + 0.1 * u, x + wT, y - hB); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  以尼雅的褥子、大比大的床、寡妇手里的衣裳
  // ════════════════════════════════════════════════════════════
  function drawMats(ctx) {
    const m = L('dmMat');
    if (m > 0.01) {
      const xf = X('aen'), u = H2(), x = xf * W.w, y = fieldY(xf, 0.1);
      ctx.globalAlpha = m;
      ctx.fillStyle = sh(MAT, 0);
      ctx.beginPath(); ctx.ellipse(x, y - 0.02 * u, 0.62 * u, 0.07 * u, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = sh(MAT_D, 0, 0.8); ctx.lineWidth = Math.max(0.5, 0.02 * u);
      ctx.beginPath(); for (let i = -3; i <= 3; i++) { ctx.moveTo(x + i * 0.16 * u, y - 0.07 * u); ctx.lineTo(x + i * 0.16 * u, y + 0.04 * u); } ctx.stroke();
    }
    const bi = L('dmBier') * L('dmHouse');
    if (bi > 0.01 && S.house === 'tabitha') {
      const G = houseG(), u = G.u, x = G.x - 0.55 * u, y = G.y - 0.02 * u + 0.06 * Math.max(0, W.h - G.y) * 0.8;
      ctx.globalAlpha = bi;
      ctx.fillStyle = sh(WOOD, 0);
      ctx.fillRect(x - 0.62 * u, y - 0.12 * u, 1.24 * u, 0.08 * u);
      ctx.fillStyle = sh(LINEN, 0, 1, 0.05);
      ctx.beginPath(); ctx.ellipse(x, y - 0.13 * u, 0.6 * u, 0.06 * u, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // 她们拿多加所做的里衣外衣给彼得看：叠好的布搭在前臂上，垂下来（茜红、靛青、藏黄，都是旧色）
  const CLOTH = [[142, 78, 64], [66, 76, 104], [178, 142, 78]];
  function drawGarments(ctx) {
    for (let i = 0; i < 3; i++) {
      const f = fpos('wd' + (i + 1)); if (!f) continue;
      if (f.p.pose !== 'carry') continue;
      const h = f.h, d = f.p.fd || f.p.facing || 1;
      const xa = f.x + 0.05 * h * d, xb = f.x + 0.27 * h * d, top = f.y - 0.67 * h, bot = f.y - 0.33 * h;
      const col = CLOTH[i % CLOTH.length];
      ctx.globalAlpha = f.p.alpha * clamp(f.p.poseT * 1.5, 0, 1);
      // 垂下的一幅
      ctx.fillStyle = sh(col, 0);
      ctx.beginPath();
      ctx.moveTo(xa, top); ctx.lineTo(xb, top);
      ctx.lineTo(xb + 0.01 * h * d, bot - 0.03 * h);
      ctx.quadraticCurveTo(lerp(xa, xb, 0.6), bot + 0.02 * h, xa - 0.005 * h * d, bot);
      ctx.closePath(); ctx.fill();
      // 搭在臂上的一道折（亮一点），一道衣褶（暗一点）
      ctx.fillStyle = sh(mix(col, [236, 226, 206], 0.22), 0);
      ctx.beginPath(); ctx.ellipse((xa + xb) / 2, top + 0.005 * h, Math.abs(xb - xa) / 2 + 0.01 * h, 0.03 * h, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = sh(mix(col, [30, 24, 20], 0.35), 0, 0.8); ctx.lineWidth = Math.max(0.5, 0.012 * h);
      ctx.beginPath(); ctx.moveTo(lerp(xa, xb, 0.62), top + 0.03 * h); ctx.quadraticCurveTo(lerp(xa, xb, 0.55), (top + bot) / 2, lerp(xa, xb, 0.6), bot - 0.01 * h); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天开了；一块大布系着四角缒下来，里面有走兽、昆虫、飞鸟
  // ════════════════════════════════════════════════════════════
  const riftPt = () => [X('rift')[0] * W.w, X('rift')[1] * W.h];
  function drawRift(ctx) {
    const k = L('dmOpen'); if (k < 0.01 || !SP.w) return;
    const [x, y] = riftPt(), m = M(), e = ss(0, 1, k);
    const rx = m * (tall() ? 0.2 : 0.12) * (0.35 + 0.65 * e), ry = m * (tall() ? 0.07 : 0.05) * (0.35 + 0.65 * e);
    const day = 0.55 + 0.45 * W.daylight;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, y, rx * 3, 0.5 * k, ry * 4.4);
    glow(ctx, 'w', x, y, rx * 1.3, 0.85 * k, ry * 2.4);
    glow(ctx, 'w', x, y, rx * 0.6, 0.6 * k, ry * 1.2);
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 24; i++) {
      const side = i % 2 ? 1 : -1, j = (i >> 1) / 12;
      const vy = (hsh(i + 480) * 2 - 1) * 1.35, cone = 1 - Math.min(1, Math.abs(vy)) * 0.35;
      const px = x + side * (rx * (0.75 + 0.55 * e) * cone + j * m * 0.05 + hsh(i + 490) * m * 0.02), py = y + vy * ry * 1.3;
      const r = m * (0.028 + 0.03 * hsh(i + 500)) * (0.8 + 0.2 * e);
      glow(ctx, 'c', px, py, r * 1.7, 0.4 * k * day * (1 - j * 0.4), r * 0.85);
    }
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x - rx * 0.8, y, rx * 0.5, 0.18 * k, ry * 1.4);
    glow(ctx, 'g', x + rx * 0.8, y, rx * 0.5, 0.18 * k, ry * 1.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function sheetPos() {
    const G = houseG('simon'), u = G.u, [rx, ry] = riftPt();
    const k = ease(L('dmSheet'));
    const tx = G.x - 0.85 * u, ty = roofY(G) - 0.8 * u;
    return { x: lerp(rx, tx, k), y: lerp(ry + 0.6 * u, ty, k), s: lerp(0.5, 1, k), u, rx, ry, k };
  }
  // 布里的活物：侧影（走兽、昆虫、飞鸟）；腿脚被布兜住，只见身子、颈与头
  function beastShape(ctx, x, y, s, kind, f) {
    const lw = Math.max(0.8, 0.03 * s);
    ctx.lineWidth = lw; ctx.lineCap = 'round';
    ctx.beginPath();
    if (kind === 'ox') {
      ctx.ellipse(x, y, 0.36 * s, 0.16 * s, 0, 0, TAU);
      ctx.moveTo(x - f * 0.05 * s, y - 0.12 * s); ctx.ellipse(x + f * 0.12 * s, y - 0.13 * s, 0.14 * s, 0.07 * s, 0, 0, TAU);       // 肩峰
      ctx.moveTo(x + f * 0.36 * s, y - 0.02 * s); ctx.ellipse(x + f * 0.44 * s, y - 0.02 * s, 0.1 * s, 0.075 * s, f * 0.5, 0, TAU);  // 头
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + f * 0.42 * s, y - 0.08 * s); ctx.quadraticCurveTo(x + f * 0.4 * s, y - 0.2 * s, x + f * 0.5 * s, y - 0.22 * s);
      ctx.moveTo(x + f * 0.46 * s, y - 0.08 * s); ctx.quadraticCurveTo(x + f * 0.52 * s, y - 0.17 * s, x + f * 0.6 * s, y - 0.16 * s); ctx.stroke();
    } else if (kind === 'camel') {
      ctx.ellipse(x, y, 0.32 * s, 0.13 * s, 0, 0, TAU);
      ctx.moveTo(x + 0.14 * s, y - 0.1 * s); ctx.ellipse(x - f * 0.02 * s, y - 0.16 * s, 0.14 * s, 0.12 * s, 0, 0, TAU);          // 驼峰
      ctx.fill();
      ctx.lineWidth = 0.08 * s;
      ctx.beginPath(); ctx.moveTo(x + f * 0.26 * s, y - 0.02 * s); ctx.quadraticCurveTo(x + f * 0.46 * s, y - 0.06 * s, x + f * 0.46 * s, y - 0.34 * s); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + f * 0.52 * s, y - 0.36 * s, 0.08 * s, 0.045 * s, 0, 0, TAU); ctx.fill();
    } else if (kind === 'deer') {
      ctx.ellipse(x, y, 0.28 * s, 0.11 * s, 0, 0, TAU);
      ctx.fill();
      ctx.lineWidth = 0.06 * s;
      ctx.beginPath(); ctx.moveTo(x + f * 0.2 * s, y - 0.04 * s); ctx.lineTo(x + f * 0.3 * s, y - 0.3 * s); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + f * 0.35 * s, y - 0.32 * s, 0.08 * s, 0.045 * s, f * 0.3, 0, TAU); ctx.fill();
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(x + f * 0.3 * s, y - 0.36 * s); ctx.lineTo(x + f * 0.24 * s, y - 0.54 * s); ctx.moveTo(x + f * 0.27 * s, y - 0.45 * s); ctx.lineTo(x + f * 0.18 * s, y - 0.5 * s);
      ctx.moveTo(x + f * 0.33 * s, y - 0.36 * s); ctx.lineTo(x + f * 0.36 * s, y - 0.55 * s); ctx.moveTo(x + f * 0.35 * s, y - 0.46 * s); ctx.lineTo(x + f * 0.43 * s, y - 0.5 * s);
      ctx.stroke();
    } else if (kind === 'swine') {
      ctx.ellipse(x, y + 0.02 * s, 0.27 * s, 0.13 * s, 0, 0, TAU);
      ctx.moveTo(x + f * 0.26 * s, y + 0.02 * s); ctx.ellipse(x + f * 0.3 * s, y + 0.03 * s, 0.09 * s, 0.075 * s, 0, 0, TAU);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + f * 0.24 * s, y - 0.06 * s); ctx.lineTo(x + f * 0.3 * s, y - 0.12 * s); ctx.lineTo(x + f * 0.31 * s, y - 0.04 * s); ctx.fill();
      ctx.beginPath(); ctx.arc(x - f * 0.3 * s, y - 0.02 * s, 0.04 * s, 0, TAU * 0.8); ctx.stroke();
    } else if (kind === 'lizard') {
      ctx.ellipse(x, y, 0.15 * s, 0.035 * s, 0, 0, TAU);
      ctx.moveTo(x + f * 0.14 * s, y); ctx.ellipse(x + f * 0.19 * s, y - 0.005 * s, 0.05 * s, 0.03 * s, 0, 0, TAU);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - f * 0.13 * s, y); ctx.quadraticCurveTo(x - f * 0.26 * s, y + 0.03 * s, x - f * 0.34 * s, y - 0.04 * s);
      for (const k of [-0.07, 0.07]) { ctx.moveTo(x + k * s, y); ctx.lineTo(x + k * s + 0.03 * s, y + 0.06 * s); }
      ctx.stroke();
    } else if (kind === 'heron') {
      ctx.ellipse(x, y, 0.12 * s, 0.07 * s, -0.25 * f, 0, TAU);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + f * 0.08 * s, y - 0.04 * s); ctx.bezierCurveTo(x + f * 0.2 * s, y - 0.1 * s, x + f * 0.02 * s, y - 0.2 * s, x + f * 0.12 * s, y - 0.28 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + f * 0.12 * s, y - 0.28 * s); ctx.lineTo(x + f * 0.26 * s, y - 0.27 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + 0.05 * s); ctx.lineTo(x - 0.01 * s, y + 0.18 * s); ctx.stroke();
    } else if (kind === 'bird') {
      ctx.ellipse(x, y, 0.1 * s, 0.055 * s, -0.2 * f, 0, TAU);
      ctx.moveTo(x + f * 0.09 * s, y - 0.05 * s); ctx.arc(x + f * 0.1 * s, y - 0.06 * s, 0.04 * s, 0, TAU);
      ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - f * 0.08 * s, y); ctx.lineTo(x - f * 0.17 * s, y + 0.03 * s); ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }
  function drawSheet(ctx) {
    const A = L('dmSheetA'); if (A < 0.01) return;
    const P = sheetPos(), u = P.u * P.s, x = P.x, y = P.y;
    const hw = 1.25 * u, yc = y - 0.62 * u, cl = L('dmClean');
    const cx = lerp(P.rx, x, 0.12), cy = P.ry + 0.2 * P.u;
    // 系着四角的绳：自开了的天垂下
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(255,244,214)'; ctx.lineWidth = Math.max(0.6, 0.02 * u);
    ctx.globalAlpha = 0.45 * A;
    ctx.beginPath();
    for (const [dx, dy] of [[-1, 0], [1, 0], [-0.86, -0.16], [0.86, -0.16]]) { ctx.moveTo(x + dx * hw, yc + dy * u); ctx.lineTo(cx, cy); }
    ctx.stroke();
    glow(ctx, 'w', x, yc, 2.4 * u, 0.2 * A, 1.1 * u);
    ctx.globalCompositeOperation = 'source-over';
    // 里面（后半）
    ctx.globalAlpha = A;
    ctx.fillStyle = sh([214, 206, 190], 0, 1, 0.2);
    ctx.beginPath(); ctx.ellipse(x, yc - 0.06 * u, hw * 0.92, 0.2 * u, 0, 0, TAU); ctx.fill();
    // 活物
    const f = -1;
    const beastC = sh(mix([112, 98, 84], [240, 226, 188], 0.75 * cl), 0, 1, 0.12 + 0.15 * cl);
    ctx.fillStyle = beastC; ctx.strokeStyle = beastC;
    const bob = Math.sin(S.clock * 1.3) * 0.015 * u;
    beastShape(ctx, x + 0.22 * u, yc - 0.2 * u, u * 1.05, 'camel', 1);
    beastShape(ctx, x - 0.6 * u, yc - 0.12 * u + bob, u, 'ox', f);
    beastShape(ctx, x + 0.72 * u, yc - 0.1 * u - bob, u * 0.95, 'deer', 1);
    beastShape(ctx, x - 0.12 * u, yc - 0.02 * u, u * 0.85, 'swine', f);
    beastShape(ctx, x + 0.32 * u, yc + 0.1 * u, u, 'lizard', f);
    beastShape(ctx, x + hw * 0.97, yc - 0.12 * u, u, 'heron', 1);
    beastShape(ctx, x - hw * 0.95, yc - 0.06 * u, u * 0.9, 'bird', -1);
    // 一只飞鸟绕着布飞
    const ang = S.clock * 1.2, bx = x + Math.cos(ang) * hw * 0.8, by = yc - 0.9 * u + Math.sin(ang * 2) * 0.12 * u, fl = Math.sin(S.clock * 9) * 0.12 * u;
    ctx.beginPath(); ctx.moveTo(bx - 0.18 * u, by - fl); ctx.quadraticCurveTo(bx - 0.08 * u, by - 0.04 * u, bx, by); ctx.quadraticCurveTo(bx + 0.08 * u, by - 0.04 * u, bx + 0.18 * u, by - fl); ctx.stroke();
    // 前面的布：兜住它们
    ctx.fillStyle = sh([244, 240, 230], 0, 1, 0.25);
    ctx.beginPath();
    ctx.moveTo(x - hw, yc);
    ctx.quadraticCurveTo(x - hw * 0.5, y + 0.12 * u, x, y);
    ctx.quadraticCurveTo(x + hw * 0.5, y + 0.12 * u, x + hw, yc);
    ctx.quadraticCurveTo(x, yc + 0.26 * u, x - hw, yc);
    ctx.fill();
    ctx.strokeStyle = sh([200, 190, 170], 0, 0.6); ctx.lineWidth = Math.max(0.5, 0.02 * u);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.5, yc + 0.18 * u); ctx.quadraticCurveTo(x - hw * 0.2, y - 0.02 * u, x - 0.1 * u, y + 0.01 * u); ctx.moveTo(x + hw * 0.55, yc + 0.18 * u); ctx.quadraticCurveTo(x + hw * 0.3, y - 0.02 * u, x + 0.15 * u, y + 0.01 * u); ctx.stroke();
    // 四角的结
    ctx.fillStyle = sh([236, 226, 204], 0);
    for (const s2 of [-1, 1]) { ctx.beginPath(); ctx.arc(x + s2 * hw, yc, 0.05 * u, 0, TAU); ctx.fill(); }
    // 神所洁净的：金色的边
    if (cl > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', x, yc - 0.1 * u, 2.2 * u, 0.35 * cl * A, 0.9 * u);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  头上的火焰（外邦人受了圣灵）
  // ════════════════════════════════════════════════════════════
  function flame(ctx, x, y, s, a, ph) {
    if (a < 0.01) return;
    const fl = 1 + 0.14 * Math.sin(S.clock * 11 + ph) * Math.sin(S.clock * 6.1 + ph * 2);
    glow(ctx, 'f', x, y - 0.4 * s, 1.5 * s, 0.45 * a);
    ctx.globalAlpha = 0.85 * a;
    ctx.fillStyle = 'rgb(255,150,60)';
    ctx.beginPath();
    ctx.moveTo(x, y - 1.35 * s * fl);
    ctx.bezierCurveTo(x + 0.55 * s, y - 0.6 * s, x + 0.42 * s, y, x, y);
    ctx.bezierCurveTo(x - 0.42 * s, y, x - 0.55 * s, y - 0.6 * s, x, y - 1.35 * s * fl);
    ctx.fill();
    ctx.globalAlpha = 0.9 * a;
    ctx.fillStyle = 'rgb(255,236,180)';
    ctx.beginPath();
    ctx.moveTo(x, y - 0.8 * s * fl);
    ctx.bezierCurveTo(x + 0.26 * s, y - 0.35 * s, x + 0.2 * s, y - 0.02 * s, x, y - 0.02 * s);
    ctx.bezierCurveTo(x - 0.2 * s, y - 0.02 * s, x - 0.26 * s, y - 0.35 * s, x, y - 0.8 * s * fl);
    ctx.fill();
  }
  function drawFlames(ctx) {
    const k = L('dmFlames'); if (k < 0.01) return;
    const heads = [];
    const g = crowdOf('kin');
    if (g) g.members.forEach(m => { if (!m.dying && m._vis) heads.push(m); });
    const co = person('cornelius'); if (co && co._vis && !co.dying) heads.push(co);
    ctx.globalCompositeOperation = 'lighter';
    heads.forEach((m, i) => {
      const th = (i / Math.max(1, heads.length)) * 0.55;
      const a = ss(th, th + 0.4, k) * (m.alpha || 1);
      const f = { x: m._x, y: m._y, h: m._h, p: m };
      const [hx0, hy0] = headPt(f);
      flame(ctx, hx0, hy0 - 0.12 * m._h, 0.2 * m._h, a, m.ord || i);
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷的监牢：两条铁链、两层监牢、临街的铁门
  // ════════════════════════════════════════════════════════════
  function prisonG() {
    const u = H2(), x0 = X('prison') * W.w, k = tall() ? 0.74 : 1, x1 = x0 + 7 * u * k;
    const y = Math.max(gYb(x0), gYb(x1), gYb((x0 + x1) / 2)) + 2;
    const gateX = x1 + 0.66 * u;
    return { u, x0, x1, y, hh: 2.25 * u, top: y - 2.25 * u, cellX: x0 + 1.45 * u * k, sepA: x0 + 2.85 * u * k, sepB: x0 + 4.85 * u * k,
      g3X: x0 + 3.85 * u * k, g4X: x0 + 5.85 * u * k, gateX, gateW: 0.9 * u, gateH: 1.5 * u, wallX1: gateX + 0.58 * u,
      outX: gateX + 0.55 * u, streetX: gateX - 1.9 * u };
  }
  // 牢里的位置（画面宽的比例）
  const pxf = key => { const P = prisonG(); return P[key] / W.w; };
  function drawPrison(ctx) {
    const A = L('dmPrison'); if (A < 0.01) return;
    const P = prisonG(), u = P.u;
    ctx.globalAlpha = A;
    // 屋里（前面敞开）
    const mn = 0.1 * W.night * (W.lv.moon || 0);
    ctx.fillStyle = sh([64, 58, 54], 0, 1, mn);
    ctx.fillRect(P.x0 + 0.2 * u, P.top + 0.3 * u, P.x1 - P.x0 - 0.4 * u, P.hh - 0.3 * u);
    // 牢房后墙上一扇高窗：月光斜斜地照进来
    const wx = P.cellX + 0.35 * u, wy = P.top + 0.55 * u;
    ctx.fillStyle = sh([24, 22, 22], 0);
    ctx.fillRect(wx - 0.22 * u, wy, 0.44 * u, 0.3 * u);
    const moon = W.night * (W.lv.moon || 0) * (1 - 0.7 * L('dmCell'));
    if (moon > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([180, 196, 240], 0.2 * moon * A);
      ctx.beginPath(); ctx.moveTo(wx - 0.22 * u, wy + 0.3 * u); ctx.lineTo(wx + 0.22 * u, wy + 0.3 * u); ctx.lineTo(wx - 0.3 * u, P.y); ctx.lineTo(wx - 1.2 * u, P.y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rgba([200, 214, 255], 0.35 * moon * A);
      ctx.fillRect(wx - 0.22 * u, wy, 0.44 * u, 0.3 * u);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = A;
    }
    ctx.strokeStyle = sh(IRON, 0); ctx.lineWidth = Math.max(0.8, 0.04 * u);
    ctx.beginPath(); for (let i = -1; i <= 1; i++) { ctx.moveTo(wx + i * 0.11 * u, wy); ctx.lineTo(wx + i * 0.11 * u, wy + 0.3 * u); } ctx.stroke();
    // 走廊里的一盏油灯（看守的人身边）
    const lamp = Math.max(0.5, nightK());
    for (const lx of [P.g3X + 0.45 * u, P.g4X + 0.45 * u]) {
      ctx.fillStyle = sh(WOOD_D, 0);
      ctx.fillRect(lx - 0.1 * u, P.y - 0.62 * u, 0.2 * u, 0.04 * u);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', lx, P.y - 0.7 * u, 1.3 * u, 0.4 * lamp * A);
      glow(ctx, 'w', lx, P.y - 0.68 * u, 0.1 * u, 0.9 * lamp * A);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = A;
    }
    // 石墙：两端、隔墙、上面厚厚的一层（夜里被月光照着）
    ctx.fillStyle = sh(PRISON, 0, 1, mn * 1.4);
    ctx.fillRect(P.x0, P.top, 0.3 * u, P.hh);
    ctx.fillRect(P.x1 - 0.3 * u, P.top, 0.3 * u, P.hh);
    ctx.fillRect(P.x0, P.top, P.x1 - P.x0, 0.36 * u);
    ctx.fillStyle = sh(PRISON_D, 0, 1, mn);
    for (const sx of [P.sepA, P.sepB]) ctx.fillRect(sx - 0.14 * u, P.top + 0.3 * u, 0.28 * u, P.hh - 0.3 * u);
    ctx.fillStyle = sh(mix(PRISON, [60, 56, 52], 0.25), 0, 1, mn * 1.4);
    ctx.fillRect(P.x0 - 0.1 * u, P.top - 0.14 * u, P.x1 - P.x0 + 0.2 * u, 0.16 * u);
    ctx.strokeStyle = sh(PRISON_D, 0, 0.6); ctx.lineWidth = Math.max(0.5, 0.02 * u);
    ctx.beginPath();
    for (let x = P.x0 + 0.3 * u; x < P.x1; x += 0.62 * u) { ctx.moveTo(x, P.top); ctx.lineTo(x, P.top + 0.36 * u); }
    ctx.moveTo(P.x0, P.top + 0.18 * u); ctx.lineTo(P.x1, P.top + 0.18 * u);
    ctx.stroke();
    // 兵丁与看守的人坐的矮石凳（贴着墙）
    for (const id of ['g1', 'g2', 'g3', 'g4']) {
      const f = fpos(id); if (!f || f.p.pose !== 'sit' || f.p.tx != null) continue;
      const d = f.p.fd || f.p.facing || 1, h = f.h;
      const xa = f.x - 0.26 * h * d, xb = f.x + 0.07 * h * d, top = f.y - 0.125 * h;
      ctx.globalAlpha = A * f.p.alpha;
      ctx.fillStyle = sh(mix(PRISON, [70, 64, 58], 0.35), 0, 1, mn * 1.4);
      ctx.fillRect(Math.min(xa, xb), top, Math.abs(xb - xa), f.y - top + 0.01 * h);
      ctx.strokeStyle = rgba([200, 210, 240], 0.25 + 0.3 * mn * 4);
      ctx.lineWidth = Math.max(0.6, 0.012 * h);
      ctx.beginPath(); ctx.moveTo(Math.min(xa, xb), top); ctx.lineTo(Math.max(xa, xb), top); ctx.stroke();
    }
    ctx.globalAlpha = A;
    // 临街的外墙与铁门的门洞
    const gl = P.gateX - P.gateW / 2, gr = P.gateX + P.gateW / 2;
    ctx.fillStyle = sh(PRISON, 0, 1, mn * 1.4);
    ctx.fillRect(P.x1 - 0.05 * u, P.y - 1.95 * u, gl - P.x1 + 0.05 * u, 1.95 * u);
    ctx.fillRect(gr, P.y - 1.95 * u, P.wallX1 - gr, 1.95 * u);
    ctx.fillRect(gl - 0.1 * u, P.y - P.gateH - 0.45 * u, P.gateW + 0.2 * u, 0.45 * u);
    ctx.fillStyle = sh([30, 26, 24], 0);
    ctx.fillRect(gl, P.y - P.gateH, P.gateW, P.gateH);
    // 受光的边
    ctx.strokeStyle = W.night > 0.5 ? rgba([190, 206, 250], 0.45 * W.night * (W.lv.moon || 0) * A) : sh([255, 238, 212], 0, 0.25 * W.daylight); ctx.lineWidth = Math.max(1, 0.03 * u);
    ctx.beginPath(); ctx.moveTo(P.x0 - 0.1 * u, P.top - 0.14 * u); ctx.lineTo(P.x1 + 0.1 * u, P.top - 0.14 * u);
    ctx.moveTo(P.x0, P.top); ctx.lineTo(P.x0, P.y); ctx.moveTo(P.x1 - 0.05 * u, P.y - 1.95 * u); ctx.lineTo(P.wallX1, P.y - 1.95 * u); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 铁门：两扇铁栅，自己向外开
  function drawGate(ctx) {
    const A = L('dmPrison'); if (A < 0.01) return;
    const P = prisonG(), u = P.u, op = ease(L('dmGate'));
    const gl = P.gateX - P.gateW / 2, gr = P.gateX + P.gateW / 2, top = P.y - P.gateH;
    const lw = (P.gateW / 2) * Math.cos(op * 1.25);
    ctx.globalAlpha = A;
    ctx.strokeStyle = sh(IRON, 0, 1, 0.1 * L('dmCell')); ctx.lineWidth = Math.max(1, 0.05 * u);
    ctx.beginPath();
    for (const [hx0, dir] of [[gl, 1], [gr, -1]]) {
      const x2 = hx0 + dir * lw;
      for (let i = 0; i <= 4; i++) { const x = lerp(hx0, x2, i / 4); ctx.moveTo(x, top + 0.04 * u); ctx.lineTo(x, P.y); }
      ctx.moveTo(hx0, top + 0.3 * u); ctx.lineTo(x2, top + 0.3 * u + op * 0.05 * u);
      ctx.moveTo(hx0, P.y - 0.35 * u); ctx.lineTo(x2, P.y - 0.35 * u + op * 0.05 * u);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 两条铁链：一头在他手上，一头在兵丁手上；脱落时掉到地上
  function chainPts(side) {
    const P = prisonG(), u = P.u;
    const gid = side < 0 ? 'g1' : 'g2';
    const g = fpos(gid), p = fpos('peter');
    const e = ease(L('dmChainOff'));
    const floorY = P.y + 0.07 * Math.max(0, W.h - P.y) * 0.8;
    // 地上的样子
    const fa = [P.cellX + side * 0.75 * u, floorY], fb = [P.cellX + side * 0.18 * u, floorY + 0.01 * u];
    let a = fa, b = fb;
    if (e < 1 && g && p) {
      const ga = [g.x - side * 0.14 * g.h, g.y - 0.3 * g.h];
      const pb = [p.x + side * 0.12 * p.h, p.y - 0.12 * p.h];
      a = [lerp(ga[0], fa[0], e), lerp(ga[1], fa[1], e)];
      b = [lerp(pb[0], fb[0], e), lerp(pb[1], fb[1], e)];
    }
    const sag = lerp(0.14, 0.02, e) * u;
    return { a, b, sag, u };
  }
  function drawChains(ctx) {
    const k = L('dmChain') * L('dmPrison'); if (k < 0.01) return;
    const lit = L('dmCell');
    for (const side of [-1, 1]) {
      const C2 = chainPts(side), u = C2.u;
      const mx = (C2.a[0] + C2.b[0]) / 2, my = Math.max(C2.a[1], C2.b[1]) + C2.sag;
      const n = Math.max(5, Math.round(Math.hypot(C2.b[0] - C2.a[0], C2.b[1] - C2.a[1]) / (0.07 * u)));
      ctx.globalAlpha = k;
      ctx.strokeStyle = sh(IRON, 0, 1, 0.15 + 0.3 * lit); ctx.lineWidth = Math.max(0.6, 0.022 * u);
      for (let i = 0; i <= n; i++) {
        const t = i / n, it = 1 - t;
        const x = it * it * C2.a[0] + 2 * it * t * mx + t * t * C2.b[0], y = it * it * C2.a[1] + 2 * it * t * my + t * t * C2.b[1];
        ctx.beginPath();
        if (i % 2) ctx.ellipse(x, y, 0.035 * u, 0.02 * u, 0, 0, TAU); else ctx.ellipse(x, y, 0.012 * u, 0.028 * u, 0, 0, TAU);
        ctx.stroke();
      }
      if (lit > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'w', mx, my - C2.sag * 0.5, 0.3 * u, 0.2 * lit * k);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  灯亮遍全地（神的道越发广传）；腓利走遍的各城
  // ════════════════════════════════════════════════════════════
  const LPC = { key: '', list: null };
  function lightPts() {
    const key = W.w + 'x' + W.h;
    if (LPC.key === key) return LPC.list;
    const list = [];
    for (let i = 0; i < 24; i++) list.push({ l: 0, xf: 0.05 + 0.93 * (i + hsh(i * 3.3 + 1)) / 24, off: 0.1 + 0.5 * hsh(i * 7.1), s: hsh(i * 1.9) });
    for (let i = 0; i < 16; i++) list.push({ l: 1, xf: 0.45 + 0.54 * (i + hsh(i * 5.3 + 2)) / 16, off: 0.15 + 0.7 * hsh(i * 2.9), s: hsh(i * 2.1) });
    for (let i = 0; i < 7; i++) list.push({ l: 2, xf: 0.5 + 0.48 * (i + hsh(i * 4.4 + 3)) / 7, off: 0.9 + 0.8 * hsh(i * 3.7), s: hsh(i * 2.7) });
    const o = 0.66;
    list.forEach(p => { p.t = clamp(Math.abs(p.xf - o) * 0.95 + (2 - p.l) * 0.06 + 0.1 * p.s, 0, 0.93); });
    LPC.key = key; LPC.list = list;
    return list;
  }
  function drawLights(ctx, layer) {
    const k = L('dmLights');
    if (k > 0.005) {
      const hu = layer === 0 ? H1() * 0.5 : layer === 1 ? H1() : H2();
      ctx.globalCompositeOperation = 'lighter';
      for (const p of lightPts()) {
        if (p.l !== layer) continue;
        const a = ss(p.t, p.t + 0.08, k);
        if (a < 0.01) continue;
        const x = p.xf * W.w, gy = gYb(x, layer);
        if (!(gy < W.waterlineY(layer) - 1)) continue;
        const y = gy - p.off * hu, tw = 0.8 + 0.2 * Math.sin(S.clock * (1.3 + p.s) + p.s * 20);
        const day = 0.7 + 0.3 * (1 - W.daylight);
        const born = 1 - ss(p.t + 0.02, p.t + 0.14, k);
        glow(ctx, 'g', x, y, (0.8 + 0.3 * p.s) * hu, 0.62 * a * tw * day);
        glow(ctx, 'r', x, y, (1.6 + 0.4 * p.s) * hu, 0.22 * a * day);
        glow(ctx, 'w', x, y, 0.14 * hu, a * tw);
        if (born > 0.02) glow(ctx, 'w', x, y - born * 0.6 * hu, 0.5 * hu, 0.5 * a * born);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    const tr = L('dmTrail');
    if (tr > 0.005 && layer === 1) {
      const hu = H1(), n = 6;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        const a = ss(i / n, i / n + 0.12, tr); if (a < 0.01) continue;
        const xf = lerp(tall() ? 0.52 : 0.54, 0.96, i / (n - 1)), x = xf * W.w, gy = gYb(x, 1);
        if (!(gy < W.waterlineY(1) - 1)) continue;
        const y = gy - (0.3 + 0.3 * hsh(i + 70)) * hu;
        glow(ctx, 'g', x, y, 0.8 * hu, 0.5 * a);
        glow(ctx, 'w', x, y, 0.14 * hu, 0.9 * a);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  装饰：鳞片掉落、水花、敲门……（只在看的时候）
  // ════════════════════════════════════════════════════════════
  function drawFXL(ctx) {
    for (const e of FXL) {
      const q = e.t / e.dur;
      if (e.type === 'flakes') {
        const f = fpos(e.id); if (!f) continue;
        const [hx0, hy0] = headPt(f);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,244,214)';
        for (let i = 0; i < 16; i++) {
          const d = hsh(i * 3.1 + 1), t = clamp(q * 1.4 - d * 0.35, 0, 1);
          if (t <= 0 || t >= 1) continue;
          const x = hx0 + (d - 0.5) * 0.35 * f.h + Math.sin(t * 6 + i) * 0.06 * f.h, y = hy0 + 0.05 * f.h + t * t * 1.0 * f.h;
          ctx.globalAlpha = (1 - t) * 0.9;
          ctx.beginPath(); ctx.ellipse(x, y, 0.035 * f.h, 0.015 * f.h, t * 8 + i, 0, TAU); ctx.fill();
        }
        glow(ctx, 'w', hx0, hy0, 0.9 * f.h * (0.5 + q), 0.5 * (1 - q));
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'pour') {
        const f = fpos(e.id); if (!f) continue;
        const [hx0, hy0] = headPt(f);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(214,236,255)';
        for (let i = 0; i < 14; i++) {
          const d = hsh(i * 5.7 + 2), t = U.fract(q * 2.2 + d);
          ctx.globalAlpha = 0.7 * (1 - q) * (1 - t);
          ctx.beginPath(); ctx.arc(hx0 + (d - 0.5) * 0.3 * f.h, hy0 - 0.25 * f.h + t * 0.6 * f.h, Math.max(0.8, 0.018 * f.h), 0, TAU); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'knock') {
        const Q = gateMG();
        ctx.strokeStyle = 'rgb(255,236,200)'; ctx.lineWidth = Math.max(0.8, 0.03 * Q.u);
        ctx.globalAlpha = 0.5 * (1 - q);
        ctx.beginPath(); ctx.arc(Q.x + Q.w / 2 - 0.05 * Q.u, Q.y - Q.h * 0.55, (0.15 + 0.5 * q) * Q.u, 0, TAU); ctx.stroke();
      } else if (e.type === 'pulse') {
        const f = fpos(e.id); if (!f) continue;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgb(255,248,230)'; ctx.lineWidth = Math.max(1, 0.05 * f.h);
        ctx.globalAlpha = 0.5 * (1 - q);
        const r = f.h * (0.6 + 4 * q);
        ctx.beginPath(); ctx.ellipse(f.x, f.y - 0.4 * f.h, r, r * 0.5, 0, 0, TAU); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'tongues') {
        // 说方言，称赞神为大：各人头上升起细小的光点
        const g = crowdOf('kin'); if (!g) continue;
        ctx.globalCompositeOperation = 'lighter';
        g.members.forEach((m, i) => {
          if (!m._vis) return;
          const f = { x: m._x, y: m._y, h: m._h, p: m };
          const [hx0, hy0] = headPt(f);
          for (let j = 0; j < 3; j++) {
            const t = U.fract(q * 2 + j / 3 + i * 0.17);
            glow(ctx, 'g', hx0 + Math.sin(t * 5 + i + j) * 0.15 * m._h, hy0 - 0.3 * m._h - t * 0.9 * m._h, 0.12 * m._h, 0.5 * (1 - t) * (1 - q * 0.5));
          }
        });
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    S.clock += dt;
    for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += dt; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    for (const id in VT) {
      const p = person(id);
      if (!p) { delete VT[id]; continue; }
      p.v += (VT[id] - p.v) * (1 - Math.exp(-dt * 2.4));
      if (Math.abs(VT[id] - p.v) < 0.002) { p.v = VT[id]; delete VT[id]; }
    }
  }
  function drawUnder(ctx, pass) {
    if (!cur()) return;
    if (pass === 'far') { safe('dm.lights0', () => drawLights(ctx, 0)); return; }
    if (pass === 'mid') { safe('dm.sky', () => drawSkyline(ctx)); safe('dm.lights1', () => drawLights(ctx, 1)); return; }
    if (pass === 'near') {
      safe('dm.town', () => drawTown(ctx));
      safe('dm.road', () => drawRoad(ctx));
      safe('dm.pool', () => drawPool(ctx));
      safe('dm.wall', () => drawWall(ctx));
      safe('dm.prison', () => drawPrison(ctx));
      safe('dm.house', () => drawHouse(ctx));
      safe('dm.lights2', () => drawLights(ctx, 2));
    }
  }
  function draw(ctx, pass) {
    if (!cur()) return;
    if (pass === 'sky') { safe('dm.rift', () => drawRift(ctx)); return; }
    if (pass === 'near') {
      safe('dm.mats', () => drawMats(ctx));
      safe('dm.basketB', () => drawBasket(ctx, false));
      return;
    }
    if (pass === 'air') {
      safe('dm.wade', () => drawWade(ctx));
      safe('dm.basketF', () => drawBasket(ctx, true));
      safe('dm.gate', () => drawGate(ctx));
      safe('dm.chains', () => drawChains(ctx));
      safe('dm.torch', () => drawTorches(ctx));
      safe('dm.room', () => drawRoom(ctx));
      safe('dm.scroll', () => drawScroll(ctx));
      safe('dm.garb', () => drawGarments(ctx));
      safe('dm.shine', () => drawShines(ctx));
      safe('dm.lamb', () => drawLamb(ctx));
      safe('dm.sheet', () => drawSheet(ctx));
      safe('dm.flames', () => drawFlames(ctx));
      safe('dm.fxl', () => drawFXL(ctx));
      return;
    }
    if (pass === 'top') safe('dm.blind', () => drawBlind(ctx));
  }

  function pick(x, y, r) {
    if (!cur()) return null;
    let best = null;
    const test = (label, cx, cy, top, rad) => {
      if (!label || !isFinite(cx) || !isFinite(cy)) return;
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - (rad || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: cx, y: top, d };
    };
    const u = H2();
    if (L('dmHouse') > 0.5 && HOUSE[S.house]) { const G = houseG(); test(HOUSE[S.house].label, G.x, G.y - G.hh * 0.5, G.top - G.slab, G.w * 0.35); }
    if (L('dmTown') > 0.5 && TOWN[S.town]) { const tx = lerp(X('town')[0], 1, 0.5) * W.w; test(TOWN[S.town].label, tx, gYb(Math.min(tx, W.w)) - u, gYb(Math.min(tx, W.w)) - 1.8 * u, 1.4 * u); }
    if (L('dmSky') > 0.5 && TOWN[S.sky]) { const sx = lerp(X('sky')[0], X('sky')[1], 0.5) * W.w; test(TOWN[S.sky].label, sx, gYb(sx, 1) - H1(), gYb(sx, 1) - 2 * H1(), 1.6 * H1()); }
    if (L('dmPool') > 0.5) { const P = poolG(); test('有水的地方', P.x, P.y, P.y - P.ry, P.rx * 0.6); }
    if (L('dmRoad') > 0.5 && L('dmPool') < 0.5 && L('dmWall') < 0.5) { const rx0 = 0.8 * W.w; test('往迦萨的路', rx0, fieldY(0.8, 0.06), fieldY(0.8, 0.02), 0.6 * u); }
    if (L('dmWall') > 0.5) { const G = wallG(); test('城门', G.gate.x, G.gate.y - 0.7 * u, G.gate.y - G.gate.h, 0.6 * u); test('城墙', lerp(G.x0, G.x1, 0.35), G.yAt(lerp(G.x0, G.x1, 0.35)) - u, G.yAt(G.x0) - G.hh, 0.9 * u); }
    if (L('dmBasketA') > 0.5 && L('dmWall') > 0.5) { const B = basketPt(); test('筐子', B.x, B.y - 0.25 * u, B.y - 0.5 * u, 0.3 * u); }
    if (L('dmSheetA') > 0.5) { const P = sheetPos(); test('大布', P.x, P.y - 0.5 * P.u * P.s, P.y - 1.2 * P.u * P.s, 1.1 * P.u * P.s); }
    if (L('dmPrison') > 0.5) { const P = prisonG(); test('监牢', (P.x0 + P.x1) / 2, P.y - P.hh * 0.6, P.top, 1.5 * u); test('铁门', P.gateX, P.y - P.gateH * 0.5, P.y - P.gateH, 0.4 * u); }
    if (L('dmChain') > 0.5 && L('dmPrison') > 0.5) { const C2 = chainPts(1); test('铁链', (C2.a[0] + C2.b[0]) / 2, (C2.a[1] + C2.b[1]) / 2, C2.a[1] - 0.2 * u, 0.25 * u); }
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  function ring(c, rgb) { if (c && !c.instant) safe('damascus.ring', () => fx().ring(c.x, c.y, rgb || TINT, Math.min(W.w, W.h) * 0.3, 1.8, 1.5)); }
  function flashAt(b, id, rgb, n) {
    if (inst(b)) return;
    const f = fpos(id); if (!f) return;
    safe('dm.flash', () => {
      fx().ring(f.x, f.y - f.h * 0.5, rgb || [255, 248, 232], f.h * 3, 1.6, 1.4);
      fx().sparkle(f.x, f.y - f.h * 0.5, n || 30, rgb || [255, 248, 232], f.h * 0.4, 'air');
    });
  }
  function names(b, str, xf, yf, rgb) {
    if (inst(b)) return;
    const size = Math.max(0.05 * M(), 22), x = xf * W.w, y = yf * W.h;
    safe('dm.name', () => fx().nameStr(str, x, y, size, rgb || [255, 226, 170], () => [x + rnd(-0.12, 0.12) * W.w, y + rnd(0.05, 0.25) * W.h], { hold: 4.2 }));
  }
  function flashW(b, v) { if (!inst(b)) W.flash = Math.max(W.flash || 0, v); }
  // 换布景：先淡去旧的，再显出新的（t、t + 1.4 秒）
  function swapBeats(kind, style, t) {
    const key = { house: 'dmHouse', town: 'dmTown', sky: 'dmSky' }[kind];
    return [
      [t, b => { if (S[kind] !== style) lv(key, 0, b); }],
      [t + 1.4, b => {
        if (S[kind] !== style) { S[kind] = style; if (!inst(b)) W.set(key, 0, true); }
        lv(key, style === 'none' ? 0 : 1, b);
      }],
    ];
  }
  const DISC = (i) => ((C() && C().DISCIPLE_ROBES) || [[122, 104, 84], [104, 92, 80], [138, 116, 92]])[i % 11];

  // ════════════════════════════════════════════════════════════
  //  布置：撒马利亚城，腓利宣讲基督，城里大有欢喜
  // ════════════════════════════════════════════════════════════
  function setup() {
    S = fresh();
    FXL.length = 0;
    for (const k in VT) delete VT[k];
    const base = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.85, herbs: 0.7, trees: 0.3,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in base) if (W.hasLevel(k)) W.set(k, base[k], true);
    for (const k of MY) W.set(k, 0, true);
    for (const k of ['rain', 'storm', 'gale', 'hail', 'gloom']) if (W.hasLevel(k)) W.set(k, 0, true);
    W.set('bare', 0.12, true); W.set('bloom', 0.7, true);
    W.set('dmTown', 1, true); W.set('dmLamp', 1, true);
    S.town = 'samaria';
    const ox = W.w * 0.72, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy);
    W.setOrigin('trees', W.w * 0.995, W.ridgeBaseY(2, W.w * 0.995));
    W.freeClock = false;
    W.goTo(0.34, 0, true);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 16, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, ox, oy, true);
    W.setPop('beast', 0, ox, oy, true);
    W.setPop('creeper', 4, ox, oy, true);
    W.setPop('human', 0, ox, oy, true);
    const c = C();
    c.clear({ fade: false });
    add('philip', { label: '腓利', sex: 'm', x: X('phil0'), facing: 1, robe: ROBE.philip, accent: [196, 180, 140], beard: true, glow: 0.26, pose: 'raise', from: 'none' });
    crowd('samL', { n: 5, x0: X('samL')[0], x1: X('samL')[1], label: '撒马利亚人', from: 'none' });
    crowd('samR', { n: 6, x0: X('samR')[0], x1: X('samR')[1], label: '撒马利亚人', from: 'none' });
    crowdFaceX('samL', X('phil0')); crowdFaceX('samR', X('phil0'));
    avoid([[0.42, 1]]);
  }

  // ════════════════════════════════════════════════════════════
  //  十五句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 一 · 8:26–28：起来！向南走 ────────────────────────────
    {
      kind: 'cmd', utter: '起来！向南走', cmd: 'cd ~/旷野 --road 迦萨  # 那路是旷野', ref: '8:26', tint: TINT_ROAD,
      verse: [
        { text: '有主的一个使者对腓利说：「起来！向南走，往那从耶路撒冷下迦萨的路上去。」那路是旷野。', ref: '使徒行传 8:26', hold: 7.2 },
        { text: '腓利就起身去了，不料，有一个衣索匹亚人，是个有大权的太监，在衣索匹亚女王甘大基的手下总管银库，他上耶路撒冷礼拜去了。', ref: '使徒行传 8:27', hold: 8.2 },
        { text: '现在回来，在车上坐着，念先知以赛亚的书。', ref: '使徒行传 8:28', hold: 5.6 },
      ],
      apply(c) {
        ring(c, TINT_ROAD);
        T(c, [
          [0, b => {
            add('angel', { label: '主的一个使者', sex: 'm', x: X('angelA'), v: 0.08, facing: -1, angel: true, glow: 1, from: inst(b) ? 'none' : 'light' });
            face('philip', 1); pose('philip', 'gaze');
            crowdFaceX('samL', X('angelA')); crowdFaceX('samR', X('angelA'));
            sfx(b, 'angel', { soft: true });
          }],
          [2.4, b => { pose('angel', 'point'); face('angel', -1); }],
          [4, b => { pose('philip', 'bow'); }],
          [6.2, b => { pose('philip', 'stand'); }],
          [7.2, b => {
            rm('angel');
            walk('philip', X('road0'), { speed: 0.014 });
            crowdPose('samL', 'raise'); crowdPose('samR', 'raise');
          }],
          // 腓利就起身去了：城远了，地成了旷野，一条往南的路
          [8.8, b => {
            lv('dmTown', 0, b); lv('dmRoad', 1, b);
            lv('bare', 0.78, b); lv('grass', 0.3, b); lv('herbs', 0.2, b); lv('trees', 0.12, b); lv('bloom', 0.1, b);
            time(0.47, 12, b);
            crowdWalk('samL', X('samR')[0] + 0.1, X('samR')[1] + 0.2, { speed: 0.03 });
            crowdWalk('samR', 1.06, 1.16, { speed: 0.03 });
            sfx(b, 'wind', { soft: true });
          }],
          [10.4, b => {
            animal('horse', { kind: 'horse', x: 1.1, facing: -1, v: carV(), label: '马', from: inst(b) ? 'none' : 'fade' });
            animal('car', { kind: 'wagon', x: 1.1 + carDx(), facing: -1, v: carV(), label: '太监的车', from: inst(b) ? 'none' : 'fade' });
            follow('car', 'horse', carDx());
            add('eunuch', { label: '衣索匹亚的太监', sex: 'm', x: 1.1, facing: -1, robe: ROBE.eunuch, accent: [112, 58, 118], hair: 'cloth', beard: false, glow: 0.16, from: inst(b) ? 'none' : 'fade' });
            ride('eunuch', 'car');
            walk('horse', X('car1'), { speed: 0.02 });
            face('philip', 1);
            sfx(b, 'hooves', { soft: true });
          }],
          [15, b => { crowdRm('samL'); crowdRm('samR'); }],
          [18.8, b => { lv('dmScroll', 1, b); sfx(b, 'scroll', { soft: true }); }],
          [24.8, b => { snapCar(); }],
        ]);
      },
    },
    // ── 二 · 8:29–35：你去！贴近那车走 ─────────────────────────
    {
      kind: 'cmd', utter: '你去！贴近那车走', cmd: 'follow 那车 && cat 以赛亚书 53', ref: '8:29', tint: TINT_ROAD,
      verse: [
        { text: '圣灵对腓利说：「你去！贴近那车走。」腓利就跑到太监那里，听见他念先知以赛亚的书，便问他说：「你所念的，你明白吗？」', ref: '使徒行传 8:29–30', hold: 7.5 },
        { text: '他说：「没有人指教我，怎能明白呢？」于是请腓利上车，与他同坐。', ref: '使徒行传 8:31', hold: 6 },
        { text: '他所念的那段经，说：他像羊被牵到宰杀之地，又像羊羔在剪毛的人手下无声；他也是这样不开口。', ref: '使徒行传 8:32', hold: 7 },
        { text: '腓利就开口从这经上起，对他传讲耶稣。', ref: '使徒行传 8:35', hold: 5 },
      ],
      apply(c) {
        ring(c, TINT_ROAD);
        T(c, [
          [0, b => {
            lv('dmScroll', 1, b);
            walk('horse', X('car2'), { speed: 0.012 });
            run('philip', X('car1') - 0.01, { speed: 0.085 });
          }],
          [2.8, b => { walk('philip', X('car2') + carDx() * (tall() ? 0.9 : 1.3), { speed: 0.0118 }); vTo('philip', 0.08, b); }],
          [8.8, b => { pose('horse', 'stand'); face('philip', -1); }],
          [11.2, b => { snapCar(); }],
          // 于是请腓利上车，与他同坐
          [10.6, b => {
            const cst = C(); if (cst && cst.get('philip')) { pose('philip', 'seat', { stop: true }); face('philip', -1); attach('philip', philipSeat); }
            flashAt(b, 'philip', [255, 240, 210], 12);
          }],
          // 他像羊被牵到宰杀之地：天上一只光的羊羔
          [16.2, b => { lv('dmLamb', 1, b); sfx(b, 'harp', { soft: true }); }],
          [22, b => { lv('dmLamb', 0.45, b); }],
          // 对他传讲耶稣
          [24.2, b => {
            lv('dmTell', 1, b); lv('dmLamb', 0, b);
            glowP('eunuch', 0.34); glowP('philip', 0.4);
            sfx(b, 'chime', { soft: true });
          }],
        ]);
      },
    },
    // ── 三 · 8:36–40：主的灵把腓利提了去 ───────────────────────
    {
      kind: 'act', utter: '主的灵把腓利提了去', cmd: 'baptize 太监 && mv 腓利 亚锁都  # 欢欢喜喜地走路', ref: '8:39', tint: [236, 244, 255],
      verse: [
        { text: '二人正往前走，到了有水的地方，太监说：「看哪，这里有水，我受洗有什么妨碍呢？」', ref: '使徒行传 8:36', hold: 6.6 },
        { text: '于是吩咐车站住，腓利和太监二人同下水里去，腓利就给他施洗。', ref: '使徒行传 8:38', hold: 6.2 },
        { text: '从水里上来，主的灵把腓利提了去，太监也不再见他了，就欢欢喜喜地走路。', ref: '使徒行传 8:39', hold: 6.6 },
        { text: '后来有人在亚锁都遇见腓利；他走遍那地方，在各城宣传福音，直到凯撒利亚。', ref: '使徒行传 8:40', hold: 5.8 },
      ],
      apply(c) {
        ring(c, [236, 244, 255]);
        T(c, [
          [0, b => {
            lv('dmPool', 1, b); lv('dmLamb', 0, b);
            walk('horse', X('carW'), { speed: 0.012 });
            sfx(b, 'splash', { soft: true });
          }],
          // 吩咐车站住；二人同下水里去
          [7.9, b => {
            pose('horse', 'stand'); snapCar();
            lv('dmTell', 0.4, b);
            attach('philip', null);
            const car = person('car'); const cx = car ? car.nx : X('carW') + carDx();
            const cst = C(); const ph = cst && cst.get('philip');
            if (ph) { ph.nx = cx + 0.012; pose('philip', 'stand', { stop: true }); }
            ride('eunuch', null);
            walk('eunuch', X('dipE'), { speed: 0.032 }); walk('philip', X('dipP'), { speed: 0.032 });
            vTo('eunuch', X('pool')[1], b); vTo('philip', X('pool')[1], b);
            lv('dmScroll', 0, b);
          }],
          [11.8, b => { face('philip', 1); face('eunuch', -1); }],
          [12.4, b => {
            pose('eunuch', 'kneel'); pose('philip', 'point');
            addFX(b, { type: 'dip', id: 'eunuch', dur: 2.2 });
            sfx(b, 'splash');
          }],
          [13.4, b => { flashAt(b, 'eunuch', [220, 236, 255], 26); sfx(b, 'harp', { soft: true }); }],
          [14.8, b => { pose('eunuch', 'stand'); pose('philip', 'stand'); glowP('eunuch', 0.4); }],
          // 主的灵把腓利提了去
          [15.6, b => { lv('dmLift', 1, b); sfx(b, 'wind', { soft: true }); sfx(b, 'angel', { soft: true }); }],
          [16.8, b => {
            fly('philip', X('dipP') + 0.01, tall() ? 0.43 : 0.3, { dur: 3.2, pose: 'raise' });
          }],
          [19.2, b => { rm('philip'); lv('dmLift', 0, b); }],
          [19.8, b => { face('eunuch', 1); }],
          [20.8, b => { face('eunuch', -1); }],
          [21.6, b => { pose('eunuch', 'raise'); sfx(b, 'harp'); }],
          // 就欢欢喜喜地走路
          [23.4, b => {
            const car = person('car');
            walk('eunuch', car ? car.nx - 0.012 : X('carW') + carDx(), { speed: 0.03 });
            vTo('eunuch', 0.03, b);
            lv('dmTrail', 1, b);
          }],
          [26.2, b => {
            ride('eunuch', 'car');
            walk('horse', X('carOut'), { speed: 0.02 });
            sfx(b, 'wheel', { soft: true });
          }],
          [29.4, b => { rm('horse'); rm('car'); rm('eunuch'); }],
        ]);
      },
    },
    // ── 四 · 9:1–4：扫罗！扫罗！你为什么逼迫我？ ★ ─────────────
    {
      kind: 'call', utter: '扫罗！扫罗！你为什么逼迫我？', cmd: 'ping 扫罗 扫罗 --from 天上  # 四面照着他', ref: '9:4', tint: TINT_LIGHT, hold: 3.6,
      verse: [
        { text: '扫罗仍然向主的门徒口吐威吓凶杀的话，去见大祭司，求文书给大马士革的各会堂，若是找着信奉这道的人，无论男女，都准他捆绑带到耶路撒冷。', ref: '使徒行传 9:1–2', hold: 8 },
        { text: '扫罗行路，将到大马士革，忽然从天上发光，四面照着他；', ref: '使徒行传 9:3', hold: 6 },
        { text: '他就仆倒在地，听见有声音对他说：「扫罗！扫罗！你为什么逼迫我？」', ref: '使徒行传 9:4', hold: 7.5 },
      ],
      apply(c) {
        ring(c, TINT_LIGHT);
        T(c, [
          [0, b => {
            clearAll(b, []);
            lv('dmPool', 0, b); lv('dmTrail', 0, b); lv('dmScroll', 0, b); lv('dmTell', 0, b); lv('dmLamb', 0, b); lv('dmLift', 0, b);
            lv('dmRoad', 1, b); lv('bare', 0.66, b); lv('grass', 0.38, b); lv('herbs', 0.26, b);
            time(0.5, 8, b);
            addLook('paul', 'paul', { label: '扫罗', x: X('saul0'), facing: 1, v: 0.06, glow: 0.22, from: inst(b) ? 'none' : 'fade' });
            ROBE.comp.forEach((r, i) => add('c' + (i + 1), { label: '同行的人', sex: 'm', x: X('comp')[i] - 0.06, facing: 1, v: 0.04 + i * 0.03, robe: r, beard: true, glow: 0.12, from: inst(b) ? 'none' : 'fade' }));
            walk('paul', X('fall'), { speed: 0.012 });
            ['c1', 'c2', 'c3'].forEach((id, i) => walk(id, X('comp')[i], { speed: 0.012 }));
          }],
          ...swapBeats('sky', 'damascus', 0.5),
          // 忽然从天上发光，四面照着他
          [9.4, b => {
            lv('dmBeam', 1, b); flashW(b, 0.85);
            sfx(b, 'thunder', { far: true, low: true }); sfx(b, 'angel');
            ['c1', 'c2', 'c3'].forEach(id => pose(id, 'bow'));
          }],
          [10.8, b => { pose('paul', 'fall'); }],
          [13, b => { ['c1', 'c2', 'c3'].forEach(id => { pose(id, 'stand'); face(id, X('fall')); }); }],
          // 听见有声音对他说
          [16.8, b => { addFX(b, { type: 'pulse', id: 'paul', dur: 2.4 }); flashW(b, 0.35); sfx(b, 'harp', { soft: true }); }],
          [19.5, b => { addFX(b, { type: 'pulse', id: 'paul', dur: 2.4 }); }],
          [22.5, b => { lv('dmBeam', 0.8, b); }],
        ]);
      },
    },
    // ── 五 · 9:5–9：我就是你所逼迫的耶稣 ────────────────────────
    {
      kind: 'name', utter: '我就是你所逼迫的耶稣', cmd: 'whoami  # 我就是你所逼迫的耶稣', ref: '9:5', tint: TINT_LIGHT,
      verse: [
        { text: '他说：「主啊！你是谁？」主说：「我就是你所逼迫的耶稣。起来！进城去，你所当做的事，必有人告诉你。」', ref: '使徒行传 9:5–6', hold: 7.2 },
        { text: '同行的人站在那里，说不出话来，听见声音，却看不见人。', ref: '使徒行传 9:7', hold: 5.4 },
        { text: '扫罗从地上起来，睁开眼睛，竟不能看见什么。有人拉他的手，领他进了大马士革；', ref: '使徒行传 9:8', hold: 6.4 },
        { text: '三日不能看见，也不吃也不喝。', ref: '使徒行传 9:9', hold: 5.4 },
      ],
      apply(c) {
        ring(c, TINT_LIGHT);
        T(c, [
          [0, b => { lv('dmBeam', 1, b); addFX(b, { type: 'pulse', id: 'paul', dur: 2.4 }); flashW(b, 0.3); }],
          [1.6, b => { pose('paul', 'kneel'); }],
          [3.2, b => { pose('paul', 'gaze'); }],
          [4.4, b => { pose('paul', 'kneel'); addFX(b, { type: 'pulse', id: 'paul', dur: 2.4 }); sfx(b, 'harp', { soft: true }); }],
          [7, b => { lv('dmBeam', 0, b); }],
          // 同行的人……看不见人
          [8.6, b => { face('c1', -1); face('c2', 1); }],
          [10, b => { face('c1', 1); face('c3', -1); }],
          [11.4, b => { face('c3', 1); face('c2', -1); }],
          // 他起来，竟不能看见——世界失了颜色
          [15, b => {
            pose('paul', 'stand'); glowP('paul', 0.04);
            S.bloomId = 'paul'; W.set('dmSight', 0, true); lv('dmBlind', 1, b);
            sfx(b, 'whisper', { soft: true });
          }],
          [16.4, b => { pose('paul', 'point'); }],
          // 有人拉他的手，领他进了大马士革
          ...swapBeats('town', 'damascus', 16.4),
          ...swapBeats('house', 'judas', 16.8),
          [17.4, b => {
            lv('bare', 0.34, b); lv('grass', 0.7, b); lv('herbs', 0.55, b); lv('trees', 0.24, b); lv('dmRoad', 0, b);
            walk('c1', X('fall') + 0.02, { speed: 0.02 });
          }],
          [18.6, b => {
            face('c1', 1); hands('c1', 'paul', true);
            walk('c1', hx(0.55, 'judas'), { speed: 0.016 }); walk('paul', hx(0.2, 'judas'), { speed: 0.016 });
            walk('c2', X('fall') + 0.05, { speed: 0.016 }); walk('c3', X('fall') + 0.03, { speed: 0.016 });
          }],
          // 三日三夜：日头升落，他在屋里跪着
          [23.2, b => {
            hands('c1', 'paul', false);
            pose('paul', 'pray'); face('paul', 1);
            ['c1', 'c2', 'c3'].forEach(id => { walk(id, 1.08, { speed: 0.03 }); });
            time(0.3, 2.8, b);
          }],
          [26.2, b => { time(0.3, 2.4, b); ['c1', 'c2', 'c3'].forEach(id => rm(id)); }],
          [28.8, b => { time(0.3, 2.2, b); }],
        ]);
      },
    },
    // ── 六 · 9:10–18：你只管去！他是我所拣选的器皿 ───────────────
    {
      kind: 'cmd', utter: '你只管去！他是我所拣选的器皿', cmd: 'chmod +sight 扫罗 --by 亚拿尼亚  # 鳞掉下来', ref: '9:15', tint: TINT_SEE, hold: 3.6,
      verse: [
        { text: '当下，在大马士革有一个门徒，名叫亚拿尼亚。主在异象中对他说：「亚拿尼亚。」他说：「主，我在这里。」', ref: '使徒行传 9:10', hold: 6.4 },
        { text: '主对亚拿尼亚说：「你只管去！他是我所拣选的器皿，要在外邦人和君王，并以色列人面前宣扬我的名。」', ref: '使徒行传 9:15', hold: 6.6 },
        { text: '亚拿尼亚就去了，进入那家，把手按在扫罗身上，说：「兄弟扫罗，在你来的路上向你显现的主，就是耶稣，打发我来，叫你能看见，又被圣灵充满。」', ref: '使徒行传 9:17', hold: 7.8 },
        { text: '扫罗的眼睛上，好像有鳞立刻掉下来，他就能看见。于是起来受了洗；', ref: '使徒行传 9:18', hold: 5.6 },
      ],
      apply(c) {
        ring(c, TINT_SEE);
        T(c, [
          [0, b => {
            time(0.36, 4, b);
            add('ananias', { label: '亚拿尼亚', sex: 'm', x: X('anan0'), v: 0.05, facing: -1, robe: ROBE.ananias, beard: true, glow: 0.26, pose: 'pray', from: inst(b) ? 'none' : 'fade' });
            lv('dmVision', 1, b);
            sfx(b, 'chime', { soft: true });
          }],
          [3, b => { pose('ananias', 'gaze'); }],
          [5, b => { pose('ananias', 'kneel'); }],
          [7.8, b => { lv('dmVision', 1, b); pose('ananias', 'gaze'); sfx(b, 'harp', { soft: true }); }],
          [11.2, b => { pose('ananias', 'bow'); }],
          [12.8, b => {
            lv('dmVision', 0, b);
            pose('ananias', 'stand');
            walk('ananias', hx(0.62, 'judas'), { speed: 0.03 });
          }],
          [15.8, b => { face('ananias', -1); face('paul', 1); }],
          [16.6, b => { pose('ananias', 'point'); }],
          // 鳞立刻掉下来，他就能看见：颜色自扫罗绽放
          [23.6, b => {
            addFX(b, { type: 'flakes', id: 'paul', dur: 2.4 });
            S.bloomId = 'paul'; W.set('dmSight', 0, true); lv('dmSight', 1, b);
            lv('bloom', 0.8, b);
            glowP('paul', 0.36);
            flashAt(b, 'paul', [255, 244, 220], 30);
            sfx(b, 'harp'); sfx(b, 'bird', { soft: true });
          }],
          [25, b => { pose('ananias', 'stand'); pose('paul', 'stand'); }],
          [26.2, b => { pose('paul', 'raise'); }],
          // 于是起来受了洗
          [27.8, b => { pose('paul', 'kneel'); propP('ananias', 'jar'); pose('ananias', 'point'); }],
          [28.4, b => { addFX(b, { type: 'pour', id: 'paul', dur: 1.8 }); sfx(b, 'splash', { soft: true }); }],
          [29.6, b => { lv('dmBlind', 0, b); W.set('dmSight', 1, true); }],
        ]);
      },
    },
    // ── 七 · 9:16–31：为我的名必须受许多的苦难 ────────────────────
    {
      kind: 'promise', utter: '为我的名必须受许多的苦难', cmd: 'lower 筐子 --over 城墙 --at night', ref: '9:16', tint: [255, 226, 186],
      verse: [
        { text: '主对亚拿尼亚说：「……我也要指示他，为我的名必须受许多的苦难。」', ref: '使徒行传 9:15–16', hold: 5.8 },
        { text: '就在各会堂里宣传耶稣，说他是神的儿子。', ref: '使徒行传 9:20', hold: 5 },
        { text: '过了好些日子，犹太人商议要杀扫罗……他们又昼夜在城门守候，要杀他。他的门徒就在夜间用筐子把他从城墙上缒下去。', ref: '使徒行传 9:23–25', hold: 8 },
        { text: '那时，犹太、加利利、撒马利亚各处的教会都得平安，被建立；凡事敬畏主，蒙圣灵的安慰，人数就增多了。', ref: '使徒行传 9:31', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 226, 186]);
        T(c, [
          [0, b => {
            lv('dmBlind', 0, b); W.set('dmSight', 1, true);
            propP('ananias', null);
            walk('ananias', 1.08, { speed: 0.03 });
            lv('dmHouse', 0, b); lv('dmWall', 1, b);
            time(0.52, 5, b);
          }],
          [1.2, b => {
            walk('paul', X('preach'), { speed: 0.025 });
            crowd('dam', { n: 6, x0: X('damC')[0], x1: X('damC')[1], label: '大马士革人', v: 0.08, mill: false });
          }],
          [4.2, b => { rm('ananias'); face('paul', 1); crowdFaceX('dam', X('preach')); pose('paul', 'point'); }],
          // 在各会堂里宣传耶稣
          [7.4, b => { pose('paul', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [10, b => { pose('paul', 'point'); }],
          // 过了好些日子……昼夜在城门守候
          [12.2, b => {
            time(0.97, 6, b);
            crowdWalk('dam', 1.06, 1.14, { speed: 0.035 });
          }],
          [13.8, b => {
            lv('dmTorch', 1, b);
            const gx = X('gateX'), u = H2() / W.w;
            add('w1', { label: '守城门的人', sex: 'm', x: gx - 0.9 * u, v: 0.05, facing: -1, robe: ROBE.watch, beard: true, prop: 'torch', glow: 0.1 });
            add('w2', { label: '守城门的人', sex: 'm', x: gx + 0.95 * u, v: 0.03, facing: -1, robe: ROBE.guard, beard: true, prop: 'torch', glow: 0.1 });
            walk('paul', X('win') + 0.004, { speed: 0.03 });
            glowP('paul', 0.4);
          }],
          [16, b => { crowdRm('dam'); }],
          // 门徒就在夜间用筐子把他从城墙上缒下去
          [16.8, b => {
            W.set('dmBasket', 0, true); lv('dmBasketA', 1, b);
            rm('paul');
          }],
          [17.8, b => {
            addLook('paul', 'paul', { label: '扫罗', x: X('win'), facing: 1, v: 0, glow: 0.4, pose: 'sit', from: inst(b) ? 'none' : 'fade' });
            pose('paul', 'sit', { stop: true });
            attach('paul', saulBasket);
          }],
          [18.6, b => { lv('dmBasket', 1, b); sfx(b, 'wind', { soft: true, low: true }); }],
          // 各处的教会都得平安，被建立：天将亮，山上各处的城一盏一盏亮起
          [22.4, b => { time(0.27, 4.5, b); }],
          [22.6, b => { W.set('dmTrail', 0, true); lv('dmTrail', 1, b); sfx(b, 'harp', { soft: true }); }],
          [23.4, b => {
            attach('paul', null);
            const cst = C(); const p = cst && cst.get('paul'); if (p) { p.nx = X('win') + 0.004; p.ny = null; }
            pose('paul', 'stand', { stop: true });
          }],
          [24.2, b => {
            walk('paul', tall() ? 0.47 : 0.5, { speed: 0.022 });
            lv('dmBasketA', 0, b);
          }],
          [26.4, b => { lv('dmTorch', 0, b); rm('w1'); rm('w2'); }],
          [29.4, b => { rm('paul'); }],
        ]);
      },
    },
    // ── 八 · 9:32–43：他就立刻起来了（彼得的话「耶稣基督医好你了」留在经文里）──
    {
      kind: 'act', utter: '他就立刻起来了', cmd: 'heal 以尼雅 && wake 大比大  # 约帕', ref: '9:34', tint: [255, 240, 206],
      verse: [
        { text: '遇见一个人，名叫以尼雅，得了瘫痪，在褥子上躺卧八年。彼得对他说：「以尼雅，耶稣基督医好你了，起来！收拾你的褥子。」他就立刻起来了。', ref: '使徒行传 9:33–34', hold: 7 },
        { text: '在约帕有一个女徒，名叫大比大，翻希腊话就是多加；她广行善事，多施周济。当时，她患病而死……', ref: '使徒行传 9:36–37', hold: 6 },
        { text: '……众寡妇都站在彼得旁边哭……彼得叫她们都出去，就跪下祷告，转身对着死人说：「大比大，起来！」她就睁开眼睛，见了彼得，便坐起来。', ref: '使徒行传 9:39–40', hold: 7.4 },
        { text: '彼得伸手扶她起来，叫众圣徒和寡妇进去，把多加活活地交给他们。这事传遍了约帕，就有许多人信了主。', ref: '使徒行传 9:41–42', hold: 6.2 },
      ],
      apply(c) {
        ring(c, [255, 240, 206]);
        T(c, [
          [0, b => {
            clearAll(b, []);
            lv('dmWall', 0, b); lv('dmTorch', 0, b); lv('dmBasketA', 0, b); W.set('dmBasket', 0, true); lv('dmTrail', 0, b);
            lv('bare', 0.1, b); lv('grass', 0.88, b); lv('herbs', 0.7, b); lv('trees', 0.3, b); lv('bloom', 0.8, b);
            time(0.4, 5, b);
            add('aeneas', { label: '以尼雅', sex: 'm', x: X('aen'), v: 0.1, facing: -1, robe: ROBE.aeneas, beard: true, glow: 0.08, pose: 'lie', from: inst(b) ? 'none' : 'fade' });
            lv('dmMat', 1, b);
            addLook('peter', 'peter', { x: Math.min(1.04, X('aen') + (tall() ? 0.14 : 0.1)), facing: -1, v: 0.06, from: inst(b) ? 'none' : 'fade' });
            walk('peter', X('aen') + (tall() ? 0.075 : 0.03), { speed: 0.03 });
          }],
          ...swapBeats('sky', 'none', 0),
          ...swapBeats('town', 'joppa', 0.2),
          [3.4, b => { face('peter', -1); pose('peter', 'point'); }],
          [4.8, b => {
            pose('aeneas', 'stand'); glowP('aeneas', 0.36);
            lv('dmMat', 0, b); propP('aeneas', 'bundle');
            flashAt(b, 'aeneas', [255, 244, 220], 22);
            sfx(b, 'harp');
          }],
          [6.4, b => { pose('aeneas', 'raise'); pose('peter', 'stand'); }],
          [7.4, b => { walk('aeneas', 1.08, { speed: 0.04 }); }],
          // 约帕：大比大的家
          ...swapBeats('house', 'tabitha', 6.8),
          [8.4, b => {
            walk('peter', hx(0.85, 'tabitha'), { speed: 0.03 });
            lv('dmBier', 1, b); lv('dmLamp', 1, b);
            add('tabitha', { label: '大比大', sex: 'f', x: hx(-0.55, 'tabitha'), v: 0.06, facing: 1, robe: ROBE.tabitha, accent: [236, 228, 214], glow: 0.02, pose: 'lie', from: inst(b) ? 'none' : 'fade' });
            ROBE.widow.forEach((r, i) => add('wd' + (i + 1), { label: '寡妇', sex: 'f', x: hx(-0.05 + i * 0.36, 'tabitha'), v: 0.05 + 0.03 * (i % 2), facing: -1, robe: r, glow: 0.12, pose: 'weep', from: inst(b) ? 'none' : 'fade' }));
            sfx(b, 'weep', { soft: true });
          }],
          [9.6, b => { rm('aeneas'); }],
          [13.6, b => { walk('peter', hx(1.2, 'tabitha'), { speed: 0.012 }); }],
          [14.8, b => { face('peter', -1); }],
          // 众寡妇都站在彼得旁边哭，拿多加所做的衣裳给他看
          [15.2, b => { ['wd1', 'wd2', 'wd3'].forEach(id => { face(id, 1); pose(id, 'carry'); }); }],
          [17.4, b => {
            ['wd1', 'wd2', 'wd3'].forEach((id, i) => walk(id, hx(2.2 + i * 0.45, 'tabitha'), { speed: 0.025 }));
          }],
          [18.2, b => { walk('peter', hx(-0.05, 'tabitha'), { speed: 0.02, pose: 'pray' }); face('peter', -1); }],
          // 「大比大，起来！」
          [21, b => {
            pose('tabitha', 'sit'); glowP('tabitha', 0.4);
            flashAt(b, 'tabitha', [255, 244, 220], 24);
            sfx(b, 'harp');
          }],
          [23.4, b => { pose('peter', 'stand'); face('peter', -1); }],
          [24.2, b => { pose('peter', 'point'); }],
          [25.2, b => { pose('tabitha', 'stand'); lv('dmBier', 0, b); }],
          [26.2, b => {
            pose('peter', 'stand');
            ['wd1', 'wd2', 'wd3'].forEach((id, i) => walk(id, hx(0.35 + i * 0.4, 'tabitha'), { speed: 0.025, pose: 'raise' }));
            crowd('jop', { n: 5, x0: X('town')[0] - 0.02, x1: X('town')[0] + 0.12, label: '约帕人', v: 0.06 });
          }],
          [28.6, b => { crowdPose('jop', 'raise'); face('tabitha', 1); sfx(b, 'crowd', { soft: true }); }],
        ]);
      },
    },
    // ── 九 · 10:1–8：哥尼流 ─────────────────────────────────────
    {
      kind: 'call', utter: '哥尼流', cmd: 'call 哥尼流 --at 申初  # 已蒙记念了', ref: '10:3', tint: [255, 244, 222],
      verse: [
        { text: '在凯撒利亚有一个人，名叫哥尼流，是「意大利营」的百夫长。他是个虔诚人，他和全家都敬畏神，多多周济百姓，常常祷告神。', ref: '使徒行传 10:1–2', hold: 7 },
        { text: '有一天，约在申初，他在异象中明明看见神的一个使者进去，到他那里，说：「哥尼流。」', ref: '使徒行传 10:3', hold: 6 },
        { text: '哥尼流定睛看他，惊怕说：「主啊，什么事呢？」天使说：「你的祷告和你的周济达到神面前，已蒙记念了。」', ref: '使徒行传 10:4', hold: 7 },
        { text: '现在你当打发人往约帕去，请那称呼彼得的西门来……就打发他们往约帕去。', ref: '使徒行传 10:5–8', hold: 6 },
      ],
      apply(c) {
        ring(c, [255, 244, 222]);
        T(c, [
          [0, b => {
            clearAll(b, []);
            lv('dmBier', 0, b); lv('dmMat', 0, b);
            time(0.62, 8, b);
          }],
          ...swapBeats('house', 'cornelius', 0),
          ...swapBeats('town', 'caesarea', 0.2),
          ...swapBeats('sky', 'caesarea', 0.4),
          [2, b => {
            add('cornelius', { label: '哥尼流', sex: 'm', x: hx(-0.35, 'cornelius'), v: 0.06, facing: 1, robe: ROBE.cornelius, accent: [196, 160, 92], hair: 'short', beard: false, glow: 0.24, pose: 'pray', from: inst(b) ? 'none' : 'fade' });
            add('m1', { label: '哥尼流的家人', sex: 'm', x: hx(2.1, 'cornelius'), v: 0.05, facing: -1, robe: ROBE.servant[0], beard: true, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
            add('m2', { label: '哥尼流的家人', sex: 'm', x: hx(2.55, 'cornelius'), v: 0.08, facing: -1, robe: ROBE.servant[1], beard: false, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
            add('m3', { label: '虔诚兵', sex: 'm', x: hx(3.05, 'cornelius'), v: 0.04, facing: -1, robe: ROBE.soldier, accent: [190, 160, 100], hair: 'short', beard: false, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
          }],
          // 神的一个使者进去，到他那里，说：「哥尼流。」
          [8.4, b => {
            add('angel', { label: '神的使者', sex: 'm', x: hx(0.55, 'cornelius'), v: 0.08, facing: -1, angel: true, glow: 1, from: inst(b) ? 'none' : 'light' });
            lv('dmRoom', 1, b);
            sfx(b, 'angel');
          }],
          [10.2, b => { pose('cornelius', 'gaze'); face('cornelius', 1); }],
          // 惊怕说：「主啊，什么事呢？」
          [15.4, b => { pose('cornelius', 'bow'); }],
          [17.2, b => { pose('cornelius', 'kneel'); }],
          [20, b => { pose('angel', 'point'); face('angel', 1); }],
          // 打发他们往约帕去
          [23.6, b => {
            pose('cornelius', 'stand'); face('cornelius', 1);
            walk('m1', hx(1.25, 'cornelius'), { speed: 0.02 }); walk('m2', hx(1.7, 'cornelius'), { speed: 0.02 }); walk('m3', hx(2.2, 'cornelius'), { speed: 0.02 });
          }],
          [25.4, b => { rm('angel'); lv('dmRoom', 0, b); pose('cornelius', 'point'); }],
          [26.8, b => { ['m1', 'm2', 'm3'].forEach(id => pose(id, 'bow')); }],
          [28.2, b => {
            pose('cornelius', 'stand');
            ['m1', 'm2', 'm3'].forEach((id, i) => walk(id, 1.08 + i * 0.02, { speed: 0.03 }));
          }],
        ]);
      },
    },
    // ── 十 · 10:9–16：神所洁净的，你不可当作俗物 ──────────────────
    {
      kind: 'cmd', utter: '神所洁净的，你不可当作俗物', cmd: 'unset 俗物  # 这样一连三次', ref: '10:15', tint: TINT_SHEET, hold: 3.4,
      verse: [
        { text: '彼得约在午正，上房顶去祷告，觉得饿了，想要吃。那家的人正预备饭的时候，彼得魂游象外，', ref: '使徒行传 10:9–10', hold: 6 },
        { text: '看见天开了，有一物降下，好像一块大布，系着四角，缒在地上，里面有地上各样四足的走兽和昆虫，并天上的飞鸟；', ref: '使徒行传 10:11–12', hold: 6.8 },
        { text: '又有声音向他说：「彼得，起来，宰了吃！」彼得却说：「主啊，这是不可的！凡俗物和不洁净的物，我从来没有吃过。」', ref: '使徒行传 10:13–14', hold: 7 },
        { text: '第二次有声音向他说：「神所洁净的，你不可当作俗物。」这样一连三次，那物随即收回天上去了。', ref: '使徒行传 10:15–16', hold: 6.6 },
      ],
      apply(c) {
        ring(c, TINT_SHEET);
        T(c, [
          [0, b => {
            clearAll(b, []);
            lv('dmRoom', 0, b);
            time(0.5, 6.5, b);
          }],
          ...swapBeats('house', 'simon', 0),
          ...swapBeats('town', 'joppa', 0.2),
          ...swapBeats('sky', 'none', 0.4),
          [1.8, b => {
            const G = houseG('simon'), st = stairG(G);
            addLook('peter', 'peter', { x: st.xa / W.w + 0.01, facing: -1, v: 0, from: inst(b) ? 'none' : 'fade' });
          }],
          [3, b => {
            const G = houseG('simon');
            fly('peter', (G.x + 0.72 * G.u) / W.w, roofY(G) / W.h, { dur: 2.6, pose: 'pray' });
            face('peter', -1);
          }],
          // 看见天开了，有一物降下
          [7.4, b => { lv('dmOpen', 1, b); sfx(b, 'angel', { soft: true }); }],
          [8.6, b => { lv('dmSheetA', 1, b); W.set('dmSheet', 0, true); lv('dmSheet', 1, b); pose('peter', 'kneel'); sfx(b, 'wings', { soft: true }); }],
          // 「彼得，起来，宰了吃！」——「主啊，这是不可的！」
          [15.4, b => { pose('peter', 'stand'); face('peter', -1); }],
          [17.2, b => { pose('peter', 'bow'); }],
          [19.2, b => { lv('dmSheet', 0.5, b); }],
          [21, b => { lv('dmSheet', 1, b); pose('peter', 'kneel'); }],
          // 第二次有声音向他说
          [23.2, b => { lv('dmClean', 1, b); flashW(b, 0.3); sfx(b, 'harp'); }],
          [24.8, b => { lv('dmSheet', 0.5, b); }],
          [26.5, b => { lv('dmSheet', 1, b); }],
          // 那物随即收回天上去了
          [28.2, b => { lv('dmSheet', 0, b); pose('peter', 'gaze'); }],
          [30, b => { lv('dmOpen', 0, b); lv('dmSheetA', 0, b); }],
        ]);
      },
    },
    // ── 十一 · 10:17–26：起来，下去，和他们同往，不要疑惑 ──────────
    {
      kind: 'cmd', utter: '起来，下去，和他们同往，不要疑惑', cmd: 'cd 凯撒利亚 --with 三个人 --no-doubt', ref: '10:20', tint: TINT_SPIRIT, hold: 3.8,
      verse: [
        { text: '彼得心里正在猜疑之间……哥尼流所差来的人已经访问到西门的家，站在门外，喊着问：「有称呼彼得的西门住在这里没有？」', ref: '使徒行传 10:17–18', hold: 6.8 },
        { text: '彼得还思想那异象的时候，圣灵向他说：「有三个人来找你。起来，下去，和他们同往，不要疑惑，因为是我差他们来的。」', ref: '使徒行传 10:19–20', hold: 6.8 },
        { text: '次日，起身和他们同去，还有约帕的几个弟兄同着他去；又次日，他们进入凯撒利亚，哥尼流已经请了他的亲属密友等候他们。', ref: '使徒行传 10:23–24', hold: 6.8 },
        { text: '彼得一进去，哥尼流就迎接他，俯伏在他脚前拜他。彼得却拉他，说：「你起来，我也是人。」', ref: '使徒行传 10:25–26', hold: 5.8 },
      ],
      apply(c) {
        ring(c, TINT_SPIRIT);
        T(c, [
          [0, b => {
            lv('dmSheetA', 0, b); W.set('dmSheet', 0, true); lv('dmClean', 0, b); lv('dmOpen', 0, b);
            const G = houseG('simon'), st = stairG(G);
            const door = (st.xa + 0.35 * G.u) / W.w;
            add('m1', { label: '哥尼流所差来的人', sex: 'm', x: Math.min(1.05, door + 0.16), v: 0.05, facing: -1, robe: ROBE.servant[0], beard: true, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
            add('m2', { label: '哥尼流所差来的人', sex: 'm', x: Math.min(1.07, door + 0.19), v: 0.08, facing: -1, robe: ROBE.servant[1], beard: false, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
            add('m3', { label: '哥尼流所差来的人', sex: 'm', x: Math.min(1.09, door + 0.22), v: 0.04, facing: -1, robe: ROBE.soldier, accent: [190, 160, 100], hair: 'short', beard: false, glow: 0.12, from: inst(b) ? 'none' : 'fade' });
            walk('m1', door, { speed: 0.035 }); walk('m2', door + 0.025, { speed: 0.035 }); walk('m3', door + 0.05, { speed: 0.035 });
          }],
          [4.6, b => { pose('m1', 'point'); sfx(b, 'gate', { soft: true }); }],
          [6.4, b => { pose('m1', 'stand'); }],
          // 圣灵向他说
          [8.4, b => { pose('peter', 'gaze'); sfx(b, 'wind', { soft: true }); }],
          [11.2, b => {
            const G = houseG('simon'), st = stairG(G);
            fly('peter', st.xa / W.w + 0.004, null, { dur: 2.2, pose: 'stand' });
          }],
          [13.8, b => {
            const G = houseG('simon'), st = stairG(G);
            walk('peter', (st.xa + 0.05 * G.u) / W.w, { speed: 0.02 }); face('peter', 1);
            ['m1', 'm2', 'm3'].forEach(id => face(id, -1));
          }],
          [14.6, b => { ['m1', 'm2', 'm3'].forEach(id => pose(id, 'bow')); pose('peter', 'point'); }],
          // 次日，起身和他们同去
          [16.4, b => {
            pose('peter', 'stand');
            const G = houseG('simon');
            addLook('b1', 'disciple', { label: '约帕的弟兄', robe: ROBE.brother[0], x: (G.x + 1.2 * G.u) / W.w, v: 0.08, facing: 1, from: inst(b) ? 'none' : 'fade' });
            addLook('b2', 'disciple', { label: '约帕的弟兄', robe: ROBE.brother[1], x: (G.x + 0.8 * G.u) / W.w, v: 0.1, facing: 1, from: inst(b) ? 'none' : 'fade' });
            TRAV.forEach((id, i) => walk(id, 1.1 + i * 0.012, { speed: 0.04 }));
            time(0.3, 2.6, b);
          }],
          [17.8, b => { TRAV.forEach(id => rm(id)); }],
          ...swapBeats('house', 'cornelius', 18.4),
          ...swapBeats('town', 'caesarea', 18.6),
          ...swapBeats('sky', 'caesarea', 18.8),
          [19.2, b => { time(0.56, 3, b); }],
          // 又次日，他们进入凯撒利亚：自左边走来
          [20.8, b => {
            // 竖屏：房子左边没有地方，就从城那边（右边）走来
            const P = tall(), dir = P ? -1 : 1, edge = P ? 1.03 : 0.47;
            const look = { peter: ['peter', {}], b1: ['disciple', { label: '约帕的弟兄', robe: ROBE.brother[0] }], b2: ['disciple', { label: '约帕的弟兄', robe: ROBE.brother[1] }] };
            const men = { m1: [ROBE.servant[0], true, null], m2: [ROBE.servant[1], false, null], m3: [ROBE.soldier, false, 'short'] };
            TRAV.forEach((id, i) => {
              const x = edge - dir * i * 0.024, from = inst(b) ? 'none' : 'fade';
              if (look[id]) addLook(id, look[id][0], Object.assign({ x, facing: dir, v: 0.04 + 0.02 * (i % 3), from }, look[id][1]));
              else add(id, { label: '哥尼流所差来的人', sex: 'm', x, facing: dir, v: 0.04 + 0.02 * (i % 3), robe: men[id][0], beard: men[id][1], hair: men[id][2], accent: id === 'm3' ? [190, 160, 100] : null, glow: 0.12, from });
              const p = person(id); if (p) { p.tx = null; p.nx = x; p.facing = dir; p.fd = inst(b) ? dir : p.fd; }
            });
            const U0 = P ? [1.95, 2.3, 2.62, 2.95, 3.28, 3.6] : [-2.1, -2.5, -2.9, -3.3, -3.7, -4.1];
            ['peter', 'm1', 'b1', 'm2', 'b2', 'm3'].forEach((id, i) => walk(id, hx(U0[i], 'cornelius'), { speed: 0.04 }));
            add('cornelius', { label: '哥尼流', sex: 'm', x: hx(-0.2, 'cornelius'), v: 0.06, facing: -1, robe: ROBE.cornelius, accent: [196, 160, 92], hair: 'short', beard: false, glow: 0.24, from: inst(b) ? 'none' : 'fade' });
            crowd('kin', { n: 7, x0: hx(0.2, 'cornelius'), x1: hx(1.5, 'cornelius'), label: '哥尼流的亲属密友', v: 0.07, mill: false, glow: 0.12 });
          }],
          // 哥尼流就迎接他，俯伏在他脚前拜他
          [24.4, b => {
            const P = tall();
            walk('cornelius', hx(P ? 1.5 : -1.6, 'cornelius'), { speed: 0.025, pose: 'fall' });
            crowdFaceX('kin', hx(P ? 2 : -2, 'cornelius'));
          }],
          [27.4, b => { pose('peter', 'point'); face('peter', 'cornelius'); }],
          [28.2, b => { pose('cornelius', 'stand'); face('cornelius', 'peter'); }],
          [29.2, b => { pose('peter', 'stand'); }],
        ]);
      },
    },
    // ── 十二 · 10:34–48：圣灵降在一切听道的人身上 ─────────────────
    {
      kind: 'act', utter: '圣灵降在一切听道的人身上', cmd: 'sudo pour 圣灵 --on 外邦人  # 与我们一样', ref: '10:44', tint: TINT_SPIRIT, hold: 3.6,
      verse: [
        { text: '彼得就开口说：「我真看出神是不偏待人。原来，各国中那敬畏主、行义的人都为主所悦纳。」', ref: '使徒行传 10:34–35', hold: 6.4 },
        { text: '彼得还说这话的时候，圣灵降在一切听道的人身上。', ref: '使徒行传 10:44', hold: 5.4 },
        { text: '那些奉割礼、和彼得同来的信徒，见圣灵的恩赐也浇在外邦人身上，就都希奇；因听见他们说方言，称赞神为大。', ref: '使徒行传 10:45–46', hold: 7 },
        { text: '于是彼得说：「这些人既受了圣灵，与我们一样，谁能禁止用水给他们施洗呢？」就吩咐奉耶稣基督的名给他们施洗。', ref: '使徒行传 10:47–48', hold: 7 },
      ],
      apply(c) {
        ring(c, TINT_SPIRIT);
        T(c, [
          [0, b => {
            time(0.72, 10, b);
            lv('dmLamp', 1, b);
            walk('peter', hx(-0.95, 'cornelius'), { speed: 0.02 }); face('peter', 1);
            walk('cornelius', hx(-0.2, 'cornelius'), { speed: 0.02, pose: 'sit' });
            crowdPose('kin', 'sit');
            const P = tall();
            walk('m1', hx(P ? 2.0 : -2.2, 'cornelius'), { speed: 0.02 }); walk('b1', hx(P ? 2.35 : -1.9, 'cornelius'), { speed: 0.02 });
            walk('m2', hx(P ? 3.05 : 2.2, 'cornelius'), { speed: 0.02 }); walk('m3', hx(P ? 3.4 : 2.6, 'cornelius'), { speed: 0.02 }); walk('b2', hx(P ? 2.7 : -2.5, 'cornelius'), { speed: 0.02 });
          }],
          [2.4, b => { pose('peter', 'point'); face('peter', 1); crowdFaceX('kin', hx(-0.95, 'cornelius')); face('cornelius', -1); }],
          // 圣灵降在一切听道的人身上：风，头上的火焰
          [7.7, b => {
            lv('gale', 0.32, b); lv('dmRoom', 1, b); W.set('dmFlames', 0, true); lv('dmFlames', 1, b);
            sfx(b, 'wind'); sfx(b, 'fire', { soft: true });
          }],
          [9.6, b => { crowdPose('kin', 'raise'); pose('cornelius', 'raise'); crowdGlow('kin', 0.36); glowP('cornelius', 0.4); }],
          [11.6, b => { lv('gale', 0.1, b); }],
          // 说方言，称赞神为大
          [14.6, b => {
            addFX(b, { type: 'tongues', dur: 6 });
            ['b1', 'b2', 'm1'].forEach(id => pose(id, 'gaze'));
            sfx(b, 'sing', { soft: true });
          }],
          [18.6, b => { ['b1', 'b2', 'm1'].forEach(id => pose(id, 'raise')); }],
          // 奉耶稣基督的名给他们施洗
          [22.4, b => { pose('peter', 'stand'); propP('peter', 'jar'); ['b1', 'b2', 'm1'].forEach(id => pose(id, 'stand')); }],
          [23.4, b => { crowdPose('kin', 'kneel'); pose('cornelius', 'kneel'); pose('peter', 'point'); }],
          [24.6, b => { addFX(b, { type: 'pour', id: 'cornelius', dur: 2 }); sfx(b, 'splash', { soft: true }); }],
          [26.4, b => { lv('dmFlames', 0.45, b); lv('gale', 0, b); }],
          [28.4, b => { propP('peter', null); pose('peter', 'raise'); }],
        ]);
      },
    },
    // ── 十三 · 11：主与他们同在 ─────────────────────────────────
    {
      kind: 'act', utter: '主与他们同在', cmd: 'alias 门徒=基督徒  # 从安提阿起首', ref: '11:21', tint: [255, 230, 184],
      verse: [
        { text: '那些因司提反的事遭患难四散的门徒直走到腓尼基和塞浦路斯，并安提阿；他们不向别人讲道，只向犹太人讲。', ref: '使徒行传 11:19', hold: 6.4 },
        { text: '但内中有塞浦路斯和古利奈人，他们到了安提阿也向希腊人传讲主耶稣。主与他们同在，信而归主的人就很多了。', ref: '使徒行传 11:20–21', hold: 6.6 },
        { text: '这巴拿巴原是个好人，被圣灵充满，大有信心……他又往大数去找扫罗，找着了，就带他到安提阿去。', ref: '使徒行传 11:24–26', hold: 6.2 },
        { text: '他们足有一年的工夫和教会一同聚集，教训了许多人。门徒称为「基督徒」是从安提阿起首。', ref: '使徒行传 11:26', hold: 6.6 },
      ],
      apply(c) {
        ring(c, [255, 230, 184]);
        T(c, [
          [0, b => {
            lv('dmFlames', 0, b); lv('dmRoom', 0, b); lv('gale', 0, b);
            clearAll(b, ['peter']);
            propP('peter', null);
            walk('peter', 1.08, { speed: 0.03 });
            time(0.42, 8, b);
          }],
          ...swapBeats('house', 'none', 0.2),
          ...swapBeats('town', 'antioch', 0.4),
          ...swapBeats('sky', 'antioch', 0.6),
          [3.6, b => {
            rm('peter');
            crowd('ant1', { n: 6, x0: X('antA')[0], x1: X('antA')[1], label: '安提阿的门徒', v: 0.06, glow: 0.14 });
            add('cy1', { label: '古利奈人', sex: 'm', x: (X('antA')[1] + X('antB')[0]) / 2, v: 0.02, facing: -1, robe: [118, 110, 132], beard: true, glow: 0.2, from: inst(b) ? 'none' : 'fade' });
            crowdFaceX('ant1', (X('antA')[1] + X('antB')[0]) / 2);
          }],
          [5.2, b => { pose('cy1', 'point'); }],
          // 主与他们同在，信而归主的人就很多了
          [7.6, b => {
            lv('dmWith', 1, b);
            crowd('ant2', { n: 7, x0: 1.04, x1: 1.16, label: '希腊人', v: 0.05, glow: 0.14 });
            crowdWalk('ant2', X('antB')[0], X('antB')[1], { speed: 0.035 });
            sfx(b, 'crowd', { soft: true });
          }],
          [12.4, b => { crowdFaceX('ant2', (X('antA')[1] + X('antB')[0]) / 2); crowdPose('ant1', 'raise'); pose('cy1', 'stand'); }],
          // 巴拿巴去大数找扫罗，带他到安提阿去
          [13, b => {
            add('barnabas', { label: '巴拿巴', sex: 'm', x: 1.06, v: 0.1, facing: -1, robe: ROBE.barnabas, accent: [214, 196, 150], beard: true, glow: 0.3, from: inst(b) ? 'none' : 'fade' });
            walk('barnabas', X('antB')[1] + 0.03, { speed: 0.035 });
          }],
          [16.4, b => { pose('barnabas', 'raise'); crowdPose('ant1', 'stand'); }],
          [17.6, b => { walk('barnabas', 1.1, { speed: 0.045 }); }],
          [20.8, b => {
            const cst = C(); const bb = cst && cst.get('barnabas'); if (bb) { bb.tx = null; bb.nx = 1.07; }
            walk('barnabas', X('antB')[1] + 0.02, { speed: 0.035 });
            addLook('paul', 'paul', { label: '扫罗', x: 1.1, v: 0.12, facing: -1, glow: 0.34, from: inst(b) ? 'none' : 'fade' });
            walk('paul', X('antB')[1] - 0.01, { speed: 0.035 });
          }],
          // 门徒称为「基督徒」
          [23.6, b => {
            crowdPose('ant1', 'raise'); crowdPose('ant2', 'raise');
            pose('paul', 'point'); face('paul', -1); face('barnabas', -1);
            names(b, '基督徒', ((X('antA')[0] + X('antB')[1]) / 2), X('nameY'), [255, 226, 170]);
            sfx(b, 'angel', { soft: true });
          }],
          [28, b => { crowdPose('ant1', 'stand'); crowdPose('ant2', 'stand'); pose('paul', 'stand'); }],
        ]);
      },
    },
    // ── 十四 · 12:5–11：快快起来！ ───────────────────────────────
    {
      kind: 'cmd', utter: '快快起来！', cmd: 'unlock 铁链 铁门 --by 主的使者', ref: '12:7', tint: TINT_NIGHT,
      verse: [
        { text: '于是彼得被囚在监里；教会却为他切切地祷告神。希律将要提他出来的前一夜，彼得被两条铁链锁着，睡在两个兵丁当中……', ref: '使徒行传 12:5–6', hold: 7 },
        { text: '忽然，有主的一个使者站在旁边，屋里有光照耀，天使拍彼得的肋旁，拍醒了他，说：「快快起来！」那铁链就从他手上脱落下来。', ref: '使徒行传 12:7', hold: 7 },
        { text: '过了第一层第二层监牢，就来到临街的铁门，那门自己开了。他们出来，走过一条街，天使便离开他去了。', ref: '使徒行传 12:10', hold: 6.4 },
        { text: '彼得醒悟过来，说：「我现在真知道主差遣他的使者，救我脱离希律的手和犹太百姓一切所盼望的。」', ref: '使徒行传 12:11', hold: 6 },
      ],
      apply(c) {
        ring(c, TINT_NIGHT);
        T(c, [
          [0, b => {
            lv('dmWith', 0, b);
            clearAll(b, []);
            lv('bare', 0.18, b); lv('grass', 0.72, b);
            time(0.02, 7, b);
            lv('dmPrison', 1, b); lv('dmChain', 1, b); W.set('dmChainOff', 0, true); W.set('dmGate', 0, true); lv('dmPray', 1, b); lv('dmLamp', 1, b);
          }],
          ...swapBeats('town', 'jerusalem', 0),
          ...swapBeats('sky', 'jerusalem', 0.2),
          [1.6, b => {
            const k = H2() / W.w * (tall() ? 0.8 : 1);
            addLook('peter', 'peter', { x: pxf('cellX'), v: 0.08, facing: 1, pose: 'lie', glow: 0.5, from: inst(b) ? 'none' : 'fade' });
            add('g1', { label: '兵丁', sex: 'm', x: pxf('cellX') - 0.8 * k, v: 0.05, facing: 1, robe: ROBE.guard, accent: [170, 150, 110], hair: 'short', beard: true, glow: 0.12, pose: 'sit', from: inst(b) ? 'none' : 'fade' });
            add('g2', { label: '兵丁', sex: 'm', x: pxf('cellX') + 0.8 * k, v: 0.05, facing: -1, robe: ROBE.guard, accent: [170, 150, 110], hair: 'short', beard: false, glow: 0.12, pose: 'sit', from: inst(b) ? 'none' : 'fade' });
            add('g3', { label: '看守的人', sex: 'm', x: pxf('g3X'), v: 0.04, facing: 1, robe: ROBE.watch, hair: 'short', beard: true, glow: 0.12, pose: 'sit', from: inst(b) ? 'none' : 'fade' });
            add('g4', { label: '看守的人', sex: 'm', x: pxf('g4X'), v: 0.04, facing: 1, robe: ROBE.guard, hair: 'short', beard: true, glow: 0.12, pose: 'sit', from: inst(b) ? 'none' : 'fade' });
          }],
          // 有主的一个使者站在旁边，屋里有光照耀
          [8.2, b => {
            add('angel', { label: '主的使者', sex: 'm', x: pxf('cellX') + 0.35 * H2() / W.w, v: 0.14, facing: -1, angel: true, glow: 1, from: inst(b) ? 'none' : 'light' });
            lv('dmCell', 1, b);
            sfx(b, 'angel');
          }],
          [9.8, b => { pose('angel', 'point'); }],
          [10.6, b => { pose('peter', 'sit'); }],
          // 那铁链就从他手上脱落下来
          [11.8, b => { lv('dmChainOff', 1, b); sfx(b, 'chains'); pose('angel', 'stand'); }],
          [12.8, b => { pose('peter', 'stand'); face('peter', 1); }],
          // 过了第一层第二层监牢，来到临街的铁门
          [16.4, b => {
            const d = pxf('gateX') - pxf('cellX');
            walk('angel', pxf('gateX') - 0.3 * H2() / W.w, { speed: clamp(d / 4.6, 0.02, 0.06) });
            follow('peter', 'angel', 0.42 * H2() / W.w);
          }],
          // 那门自己开了
          [19.6, b => { lv('dmGate', 1, b); sfx(b, 'gate'); }],
          [21.2, b => { walk('angel', pxf('outX'), { speed: 0.03 }); }],
          // 他们出来，走过一条街：监牢与看守的人都退到后面，前面只是夜里的一条街
          [22.4, b => {
            vTo('angel', 0.34, b); vTo('peter', 0.34, b);
            walk('angel', pxf('streetX'), { speed: 0.03 });
            lv('dmPrison', 0.2, b);
            ['g1', 'g2', 'g3', 'g4'].forEach(id => rm(id));
          }],
          // 天使便离开他去了
          [24.6, b => {
            follow('peter', null);
            walk('peter', pxf('streetX') + 0.5 * H2() / W.w, { speed: 0.02 });
            glowP('peter', 0.55);
            const an = person('angel'); if (an) fly('angel', an.nx, tall() ? 0.5 : 0.55, { dur: 2.6 });
            sfx(b, 'wind', { soft: true });
          }],
          [25, b => { rm('angel'); lv('dmCell', 0, b); }],
          // 彼得醒悟过来
          [27, b => { face('peter', -1); pose('peter', 'gaze'); }],
          [29.4, b => { pose('peter', 'stand'); }],
        ]);
      },
    },
    // ── 十五 · 12:12–24：神的道日见兴旺，越发广传 ─────────────────
    {
      kind: 'act', utter: '神的道日见兴旺，越发广传', cmd: 'broadcast 神的道  # 日见兴旺，越发广传', ref: '12:24', tint: [255, 232, 190], hold: 3.6,
      verse: [
        { text: '想了一想，就往那称呼马可的约翰、他母亲马利亚家去，在那里有好些人聚集祷告。', ref: '使徒行传 12:12', hold: 6 },
        { text: '彼得敲外门，有一个使女，名叫罗大，出来探听，听得是彼得的声音，就欢喜的顾不得开门，跑进去告诉众人说：「彼得站在门外。」', ref: '使徒行传 12:13–14', hold: 7.2 },
        { text: '彼得不住地敲门。他们开了门，看见他，就甚惊奇。彼得摆手，不要他们作声，就告诉他们主怎样领他出监……', ref: '使徒行传 12:16–17', hold: 6.4 },
        { text: '神的道日见兴旺，越发广传。', ref: '使徒行传 12:24', hold: 6 },
      ],
      apply(c) {
        ring(c, [255, 232, 190]);
        T(c, [
          [0, b => {
            clearAll(b, ['peter']);
            lv('dmPrison', 0, b); lv('dmChain', 0, b); lv('dmCell', 0, b); lv('dmPray', 0, b);
            W.set('dmDoor', 0, true); lv('dmLamp', 1, b);
          }],
          ...swapBeats('house', 'mary', 0.3),
          [1.8, b => {
            const Q = gateMG();
            const cst = C(); const p = cst && cst.get('peter'); if (p) { p.tx = null; p.follow = null; }
            walk('peter', (Q.x + 0.55 * Q.u) / W.w, { speed: 0.03 });
            vTo('peter', 0.05, b);
            crowd('pray', { n: 6, x0: hx(-1.25, 'mary'), x1: hx(0.9, 'mary'), label: '聚集祷告的人', v: 0.06, pose: 'pray', mill: false, glow: 0.2 });
            add('rhoda', { label: '罗大', sex: 'f', x: hx(1.15, 'mary'), v: 0.08, facing: 1, robe: ROBE.rhoda, hair: 'long', glow: 0.24, scale: 0.9, pose: 'kneel', from: inst(b) ? 'none' : 'fade' });
          }],
          // 彼得敲外门
          [7.4, b => { face('peter', -1); pose('peter', 'point'); addFX(b, { type: 'knock', dur: 0.8 }); sfx(b, 'gate', { soft: true }); }],
          [8.3, b => { addFX(b, { type: 'knock', dur: 0.8 }); sfx(b, 'gate', { soft: true }); }],
          [9.2, b => {
            addFX(b, { type: 'knock', dur: 0.8 }); sfx(b, 'gate', { soft: true });
            const Q = gateMG();
            walk('rhoda', (Q.x - 0.45 * Q.u) / W.w, { speed: 0.03 });
          }],
          // 就欢喜的顾不得开门，跑进去告诉众人
          [12.6, b => { pose('rhoda', 'raise'); pose('peter', 'stand'); }],
          [13.6, b => { run('rhoda', hx(0.6, 'mary'), { speed: 0.075 }); sfx(b, 'laugh', { soft: true }); }],
          [15.4, b => { crowdPose('pray', 'stand'); crowdFaceX('pray', hx(0.6, 'mary')); face('rhoda', -1); pose('rhoda', 'point'); }],
          // 彼得不住地敲门。他们开了门
          [16.6, b => { pose('peter', 'point'); addFX(b, { type: 'knock', dur: 0.8 }); sfx(b, 'gate', { soft: true }); }],
          [17.6, b => { lv('dmDoor', 1, b); pose('peter', 'stand'); sfx(b, 'gate'); }],
          [18.4, b => {
            const Q = gateMG();
            crowdWalk('pray', hx(0.9, 'mary'), (Q.x - 0.5 * Q.u) / W.w, { speed: 0.03, pose: 'raise' });
            walk('rhoda', hx(1.35, 'mary'), { speed: 0.03, pose: 'raise' });
          }],
          [20.2, b => { pose('peter', 'raise'); }],
          [22, b => { pose('peter', 'stand'); time(0.29, 9, b); }],
          // 神的道日见兴旺，越发广传：光点亮遍全地
          [23.8, b => {
            W.set('dmLights', 0, true); lv('dmLights', 1, b);
            sfx(b, 'harp'); sfx(b, 'angel', { soft: true });
          }],
          [26.4, b => {
            const Q = gateMG();
            walk('peter', Math.min(1.08, (Q.x + 3 * Q.u) / W.w), { speed: 0.02 });
          }],
        ]);
      },
    },
  ];
  // 马停下之后，车正好停在马后（跟随的人会停在差一点的地方；与重演时一致）
  function snapCar() {
    const h = person('horse'), c = person('car');
    if (!h || !c || h.tx != null || c.follow !== 'horse') return;
    c.nx = h.nx - c.fdx * (h.facing || -1); c.tx = null;
  }
  // 一同往凯撒利亚去的人
  const TRAV = ['m1', 'm2', 'm3', 'peter', 'b1', 'b2'];
  // 马与车之间（车跟在马后，按画面上的大小）
  function carDx() { const s = W.layerScale(2) * boost() * 1.3 * (1 + 0.35 * carV()); return (33 * s) / Math.max(1, W.w); }
  // 车的纵深：竖屏靠前一些，车上的人大一点
  function carV() { return tall() ? 0.1 : 0.03; }

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '大马士革', sub: '使徒行传 8 — 12', tint: TINT, music: 'elijah',
    outro: 24,
    intro: [
      { text: '从这日起，耶路撒冷的教会大遭逼迫，除了使徒以外，门徒都分散在犹太和撒马利亚各处……那些分散的人往各处去传道。', ref: '使徒行传 8:1–4', hold: 7 },
      { text: '腓利下撒马利亚城去，宣讲基督……在那城里，就大有欢喜。', ref: '使徒行传 8:5–8', hold: 5.6 },
    ],
    setup,
    stages: STAGES,
    behold: {
      '腓利': { text: '腓利下撒马利亚城去，宣讲基督。', ref: '使徒行传 8:5' },
      '撒马利亚人': { text: '众人听见了，又看见腓利所行的神迹，就同心合意地听从他的话。', ref: '使徒行传 8:6' },
      '撒马利亚城': { text: '在那城里，就大有欢喜。', ref: '使徒行传 8:8' },
      '主的一个使者': { text: '有主的一个使者对腓利说：「起来！向南走，往那从耶路撒冷下迦萨的路上去。」那路是旷野。', ref: '使徒行传 8:26' },
      '主的使者': { text: '忽然，有主的一个使者站在旁边，屋里有光照耀……', ref: '使徒行传 12:7' },
      '衣索匹亚的太监': { text: '现在回来，在车上坐着，念先知以赛亚的书。', ref: '使徒行传 8:28' },
      '太监的车': { text: '于是吩咐车站住，腓利和太监二人同下水里去，腓利就给他施洗。', ref: '使徒行传 8:38' },
      '往迦萨的路': { text: '往那从耶路撒冷下迦萨的路上去。那路是旷野。', ref: '使徒行传 8:26' },
      '有水的地方': { text: '看哪，这里有水，我受洗有什么妨碍呢？', ref: '使徒行传 8:36' },
      '扫罗': { text: '主对亚拿尼亚说：「你只管去！他是我所拣选的器皿，要在外邦人和君王，并以色列人面前宣扬我的名。」', ref: '使徒行传 9:15' },
      '同行的人': { text: '同行的人站在那里，说不出话来，听见声音，却看不见人。', ref: '使徒行传 9:7' },
      '大马士革': { text: '扫罗从地上起来，睁开眼睛，竟不能看见什么。有人拉他的手，领他进了大马士革；', ref: '使徒行传 9:8' },
      '犹大的家': { text: '主对他说：「起来！往直街去，在犹大的家里，访问一个大数人，名叫扫罗。他正祷告，」', ref: '使徒行传 9:11' },
      '亚拿尼亚': { text: '当下，在大马士革有一个门徒，名叫亚拿尼亚。主在异象中对他说：「亚拿尼亚。」他说：「主，我在这里。」', ref: '使徒行传 9:10' },
      '大马士革人': { text: '凡听见的人都惊奇，说：「在耶路撒冷残害求告这名的，不是这人吗？」', ref: '使徒行传 9:21' },
      '城门': { text: '但他们的计谋被扫罗知道了。他们又昼夜在城门守候，要杀他。', ref: '使徒行传 9:24' },
      '城墙': { text: '他的门徒就在夜间用筐子把他从城墙上缒下去。', ref: '使徒行传 9:25' },
      '筐子': { text: '他的门徒就在夜间用筐子把他从城墙上缒下去。', ref: '使徒行传 9:25' },
      '守城门的人': { text: '他们又昼夜在城门守候，要杀他。', ref: '使徒行传 9:24' },
      '以尼雅': { text: '彼得对他说：「以尼雅，耶稣基督医好你了，起来！收拾你的褥子。」他就立刻起来了。', ref: '使徒行传 9:34' },
      '大比大': { text: '在约帕有一个女徒，名叫大比大，翻希腊话就是多加；她广行善事，多施周济。', ref: '使徒行传 9:36' },
      '大比大的家': { text: '当时，她患病而死，有人把她洗了，停在楼上。', ref: '使徒行传 9:37' },
      '寡妇': { text: '众寡妇都站在彼得旁边哭，拿多加与她们同在时所做的里衣外衣给他看。', ref: '使徒行传 9:39' },
      '约帕人': { text: '这事传遍了约帕，就有许多人信了主。', ref: '使徒行传 9:42' },
      '约帕': { text: '此后，彼得在约帕一个硝皮匠西门的家里住了多日。', ref: '使徒行传 9:43' },
      '彼得': { text: '彼得就开口说：「我真看出神是不偏待人。原来，各国中那敬畏主、行义的人都为主所悦纳。」', ref: '使徒行传 10:34–35' },
      '硝皮匠西门的家': { text: '他住在海边一个硝皮匠西门的家里，房子在海边上。', ref: '使徒行传 10:6' },
      '大布': { text: '看见天开了，有一物降下，好像一块大布，系着四角，缒在地上，', ref: '使徒行传 10:11' },
      '哥尼流': { text: '他是个虔诚人，他和全家都敬畏神，多多周济百姓，常常祷告神。', ref: '使徒行传 10:2' },
      '神的使者': { text: '有一天，约在申初，他在异象中明明看见神的一个使者进去，到他那里，说：「哥尼流。」', ref: '使徒行传 10:3' },
      '哥尼流的家人': { text: '向他说话的天使去后，哥尼流叫了两个家人和常伺候他的一个虔诚兵来，', ref: '使徒行传 10:7' },
      '虔诚兵': { text: '向他说话的天使去后，哥尼流叫了两个家人和常伺候他的一个虔诚兵来，', ref: '使徒行传 10:7' },
      '哥尼流所差来的人': { text: '哥尼流所差来的人已经访问到西门的家，站在门外，', ref: '使徒行传 10:17' },
      '约帕的弟兄': { text: '次日，起身和他们同去，还有约帕的几个弟兄同着他去；', ref: '使徒行传 10:23' },
      '哥尼流的家': { text: '又次日，他们进入凯撒利亚，哥尼流已经请了他的亲属密友等候他们。', ref: '使徒行传 10:24' },
      '哥尼流的亲属密友': { text: '因听见他们说方言，称赞神为大。', ref: '使徒行传 10:46' },
      '凯撒利亚': { text: '在凯撒利亚有一个人，名叫哥尼流，是「意大利营」的百夫长。', ref: '使徒行传 10:1' },
      '安提阿': { text: '门徒称为「基督徒」是从安提阿起首。', ref: '使徒行传 11:26' },
      '安提阿的门徒': { text: '主与他们同在，信而归主的人就很多了。', ref: '使徒行传 11:21' },
      '希腊人': { text: '但内中有塞浦路斯和古利奈人，他们到了安提阿也向希腊人传讲主耶稣。', ref: '使徒行传 11:20' },
      '古利奈人': { text: '但内中有塞浦路斯和古利奈人，他们到了安提阿也向希腊人传讲主耶稣。', ref: '使徒行传 11:20' },
      '巴拿巴': { text: '这巴拿巴原是个好人，被圣灵充满，大有信心。于是有许多人归服了主。', ref: '使徒行传 11:24' },
      '监牢': { text: '于是彼得被囚在监里；教会却为他切切地祷告神。', ref: '使徒行传 12:5' },
      '兵丁': { text: '希律将要提他出来的前一夜，彼得被两条铁链锁着，睡在两个兵丁当中；看守的人也在门外看守。', ref: '使徒行传 12:6' },
      '看守的人': { text: '过了第一层第二层监牢，就来到临街的铁门，那门自己开了。', ref: '使徒行传 12:10' },
      '铁链': { text: '那铁链就从他手上脱落下来。', ref: '使徒行传 12:7' },
      '铁门': { text: '就来到临街的铁门，那门自己开了。', ref: '使徒行传 12:10' },
      '耶路撒冷': { text: '神的道日见兴旺，越发广传。', ref: '使徒行传 12:24' },
      '马利亚的家': { text: '想了一想，就往那称呼马可的约翰、他母亲马利亚家去，在那里有好些人聚集祷告。', ref: '使徒行传 12:12' },
      '聚集祷告的人': { text: '他们说：「你是疯了！」使女极力地说：「真是他！」他们说：「必是他的天使！」', ref: '使徒行传 12:15' },
      '罗大': { text: '听得是彼得的声音，就欢喜的顾不得开门，跑进去告诉众人说：「彼得站在门外。」', ref: '使徒行传 12:14' },
    },
    scene: {
      init() { sprites(); },
      resize() { SKYC.key = ''; LPC.key = ''; },
      update,
      drawUnder,
      draw,
      reset() { S = fresh(); FXL.length = 0; for (const k in VT) delete VT[k]; },
      restore() { FXL.length = 0; },
      pick,
      sig() { return { town: S.town, house: S.house, sky: S.sky }; },
    },
  });
})(window.GS);
