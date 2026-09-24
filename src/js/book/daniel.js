/* ─────────────────────────────────────────────────────────────
 * book/daniel.js —— 但以理书 · 但以理（但以理书 1 — 12）
 *
 * 巴比伦：近地是王宫（琉璃的蓝砖、一行金狮、阶梯形的垛口；殿里是宝座、灯台与对面的粉墙），
 * 河（伯拉大河，后来是乌莱河、底格里斯大河）自远处流向观者，河边是但以理的家——
 * 楼上的窗户开向耶路撒冷（西，画面的右方，日落之处）。中丘上是巴比伦城：城墙、城楼、
 * 七层的塔庙、蓝色的城门、枣椰树。远山之后，梦与异象显在天上。
 *
 * 「神使但以理在太监长眼前蒙恩惠」——王的膳换作素菜白水，十天如一日一夜，四个少年人的脸发光；
 * 「他显明深奥隐秘的事」——王的梦忘了，灭绝哲士的命令，四人跪在家门前，夜里一道光降下；
 * ★「天上的神必另立一国」——天上显出大像：金头、银胸、铜腹、铁腿、半铁半泥的脚；
 *   非人手凿出来的石头自远山飞来，打在脚上，金银铜铁泥如糠秕被风吹散，
 *   石头变成一座大山，在晨光里充满天下（本卷的第一幅签名之景）；
 * 「神能将我们从烈火的窑中救出来」——杜拉平原上的金像，众人俯伏，三人站着，窑烧热七倍；
 * ★「他差遣使者救护倚靠他的仆人」——火中四人游行，那第四个是光（第二幅）；
 * 「伐倒这树！砍下枝子！」——地当中的大树高得顶天，飞鸟宿在枝上，走兽卧在荫下；守望的圣者从天而降，
 *   树倒下，只留树墩，用铁圈铜圈箍住，天露滴湿；「你的国位离开你了」——王被赶到田野，与牛一同吃草，
 *   日夜轮转，直到他举目望天；树墩上发出嫩芽；
 * ★「弥尼，弥尼，提客勒，乌法珥新」——伯沙撒的盛筵，金器皿闪烁，指头在灯台对面的粉墙上写下发光的字；
 *   但以理读出，天平升起；当夜灯一盏一盏灭了，大流士坐上宝座（第三幅）；
 * 「你所常事奉的神，他必救你」——日落时但以理在楼上向西跪着，窗里一道金光；他被扔在狮子坑中，坑口封上王的玺；
 * ★「我的神差遣使者，封住狮子的口」——夜里地下的坑中，一团暖光：使者站着，狮子卧下，但以理跪着；
 *   黎明王奔来，石头挪开，但以理被系上来（第四幅）；
 * ★「他的权柄是永远的」——天的四风刮在大海之上，四个大兽从海中上来；火焰的宝座、烈火的轮、
 *   火像河发出，千千万万；第四兽被焚烧；像人子的驾着天云而来，荣光铺满天空（第五幅）；
 * 「加百列啊，要使此人明白这异象」——河边的公绵羊与公山羊，大角折断，四角，小角把星抛落；
 *   晚祭的时候，但以理披麻蒙灰祷告，加百列迅速飞来；
 * 「不要惧怕，愿你平安！你总要坚强」——底格里斯河上站着穿细麻衣的，同伴逃跑，但以理面伏于地，被摸而起；
 *   远山上南北诸王的烽火起落；
 * ★「智慧人必发光如同天上的光」——睡在尘埃中的复醒：光点自全地升起，成为天上的星；
 *   「你必安歇」——但以理坐在家门前，头上一颗星（全卷的结束）。
 *
 * 一切位置都以画面宽度的比例记下（横屏、竖屏各一套）；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'daniel';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  const LVL = {
    dnHouse: ['exp', 0.5],      // 但以理的家（楼上的窗户开向耶路撒冷）
    dnWin: ['exp', 0.5],        // 楼上窗里的光：日落时向西的一道金光（6:10；9:3）
    dnReveal: ['exp', 0.45],    // 夜间异象中显明的光（2:19–22）
    dnHall: ['exp', 0.6],       // 王宫殿中的灯
    dnFeast: ['exp', 0.6],      // 伯沙撒的盛筵：长案与金银器皿（5:1–4）
    dnTable: ['exp', 0.8],      // 王的膳与酒（1:5）
    dnVeg: ['exp', 0.8],        // 素菜与白水（1:12）
    dnBed: ['exp', 0.7],        // 王宫里的床（2:1；4:5）
    dnWrath: ['exp', 0.6],      // 王的烈怒（2:12；3:19）
    dnImage: ['exp', 0.6],      // 梦中的大像（2:31–33）
    dnStone: ['lin', 0.6],      // 非人手凿出来的石头飞来（0 → 1）（2:34）
    dnShatter: ['lin', 0.2],    // 大像砸得粉碎，如糠秕被风吹散（0 → 1）（2:35）
    dnMount: ['exp', 0.22],     // 石头变成一座大山，充满天下（2:35）
    dnMountGlow: ['exp', 0.3],  // 大山上的晨光
    dnGold: ['exp', 0.45],      // 杜拉平原上的金像（3:1）
    dnFurnace: ['exp', 0.6],    // 烈火的窑
    dnHeat: ['exp', 0.5],       // 窑火（烧热比寻常更加七倍 3:19）
    dnFourth: ['exp', 0.5],     // 火中那第四个的光（3:25）
    dnTree: ['lin', 0.11],      // 地当中的大树渐长（4:10–11）
    dnFell: ['lin', 0.26],      // 伐倒这树（0 → 1）（4:14）
    dnStump: ['exp', 0.5],      // 树墩与铁圈铜圈（4:15）
    dnShoot: ['exp', 0.3],      // 树墩上的嫩芽（4:26）
    dnDew: ['exp', 0.5],        // 天露（4:15，33）
    dnBirds: ['exp', 0.6],      // 宿在枝上的飞鸟（4:12）
    dnVoice: ['exp', 0.8],      // 有声音从天降下（4:31）
    dnHand: ['lin', 0.15],      // 写字的指头：字一笔一笔写出（0 → 1）（5:5）
    dnWrite: ['exp', 0.6],      // 墙上的字
    dnRead: ['exp', 0.5],       // 但以理读出那文字：字发出金光（5:25）
    dnScale: ['exp', 0.6],      // 天平（5:27）
    dnDecree: ['exp', 0.6],     // 禁令盖了玉玺（6:9）
    dnDen: ['exp', 0.6],        // 狮子坑
    dnSeal: ['exp', 0.7],       // 坑口的石头与王的玺（6:17）
    dnLower: ['lin', 0.5],      // 但以理被放下坑 / 系上来（0 地面 → 1 坑底）
    dnCalm: ['exp', 0.6],       // 狮子卧下、口被封住（6:22）
    dnAngelL: ['exp', 0.5],     // 坑中使者的光
    dnKingLamp: ['exp', 0.6],   // 王终夜不眠：殿里的一盏灯（6:18）
    dnV7: ['exp', 1.0],         // 第七章异象的显隐
    dnSea: ['lin', 0.5],        // 四个大兽从海中上来（0 → 4）（7:3–7）
    dnBeastFire: ['lin', 0.4],  // 第四兽被杀、扔在火中焚烧（7:11）
    dnBeastFade: ['exp', 0.5],  // 其余的兽权柄被夺（7:12）
    dnThrone: ['exp', 0.5],     // 火焰的宝座、烈火的轮（7:9）
    dnFireRiver: ['lin', 0.35], // 火像河发出（7:10）
    dnMyriad: ['exp', 0.4],     // 千千万万（7:10）
    dnSon: ['lin', 0.14],       // 像人子的驾着天云而来（0 → 1）（7:13）
    dnGlory: ['exp', 0.35],     // 权柄、荣耀、国度（7:14）
    dnVision: ['exp', 0.6],     // 河边的异象（公绵羊与公山羊）的显隐
    dnRam: ['exp', 0.6],        // 双角的公绵羊（8:3）
    dnGoat: ['lin', 0.35],      // 公山羊从西而来（0 → 1）（8:5–7）
    dnHorn4: ['exp', 0.6],      // 大角折断，长出四角（8:8）
    dnLittle: ['exp', 0.5],     // 小角渐渐强大（8:9–10）
    dnLinen: ['exp', 0.45],     // 穿细麻衣的：水苍玉、闪电、火把的光（10:5–6）
    dnKings: ['lin', 0.14],     // 南方王与北方王：远山上的烽火（0 → 1）（11）
    dnRise: ['lin', 0.085],     // 睡在尘埃中的复醒：光点自地升起（12:2）
    dnStars: ['exp', 0.3],      // 发光如星（12:3）
    dnFirm: ['exp', 0.3],       // 发光如同天上的光（12:3）
    dnRest: ['exp', 0.4],       // 你必安歇（12:13）：但以理头上的一颗星
    dnWise: ['exp', 0.4],       // 智慧人必发光（12:3）：但以理身上的光
  };
  for (const k in LVL) W.defineLevel(k, LVL[k][0], LVL[k][1]);

  // ── 地上的位置（画面宽度的比例）：横屏 / 竖屏各一套 ───────────
  const XL = {
    riv0: 0.536, riv1: 0.462, bank: 0.566,
    house: 0.606,
    furn: 0.604, image: 0.705, crowd0: 0.728, crowd1: 0.778, kingD: 0.664,
    tree: 0.67, den: 0.675,
    pal0: 0.79, pal1: 0.982, throne: 0.947, lamp: 0.823, wall0: 0.838, wall1: 0.93, bed: 0.905,
    hall0: 0.816, hall1: 0.925, court: 0.772,
    youth: [0.68, 0.695, 0.71, 0.725], veg: 0.7025, table: 0.756, eunuch: 0.786,
    palmsN: [0.555, 0.647, 0.768], palmsM: [0.56, 0.745, 0.93],
    city0: 0.53, city1: 0.995, zig: 0.655, gate: 0.845,
  };
  const XP = {
    riv0: 0.43, riv1: 0.325, bank: 0.465,
    house: 0.51,
    furn: 0.505, image: 0.645, crowd0: 0.665, crowd1: 0.72, kingD: 0.575,
    tree: 0.6, den: 0.64,
    pal0: 0.735, pal1: 0.996, throne: 0.948, lamp: 0.775, wall0: 0.8, wall1: 0.912, bed: 0.9,
    hall0: 0.775, hall1: 0.915, court: 0.715,
    youth: [0.555, 0.578, 0.601, 0.624], veg: 0.5895, table: 0.672, eunuch: 0.71,
    palmsN: [0.455], palmsM: [0.55, 0.9],
    city0: 0.52, city1: 0.995, zig: 0.64, gate: 0.86,
  };
  const port = () => W.w < W.h * 0.9;
  const X = () => (port() ? XP : XL);
  // 横屏与竖屏两套位置之间的对应（锚点在两套里都由小到大）：转屏时人物随布景挪过去
  const ANCH = ['riv1', 'riv0', 'bank', 'furn', 'house', 'kingD', 'tree', 'image', 'crowd0', 'court', 'crowd1', 'pal0', 'hall0', 'lamp', 'wall0', 'bed', 'hall1', 'throne', 'pal1'];
  function remapX(x, fromP, toP) {
    if (fromP === toP || typeof x !== 'number' || !isFinite(x)) return x;
    const A = fromP ? XP : XL, B = toP ? XP : XL;
    let a0 = 0, b0 = 0;
    for (const k of ANCH) {
      const a1 = A[k], b1 = B[k];
      if (x <= a1) return a1 - a0 > 1e-6 ? lerp(b0, b1, (x - a0) / (a1 - a0)) : b1;
      a0 = a1; b0 = b1;
    }
    return lerp(b0, 1, (x - a0) / Math.max(1e-6, 1 - a0));
  }
  // 这一句话的情节按哪一套位置写成（apply 时记下）；情节进行中若转了屏，位置随之换算
  let AP = false;
  const mx = x => remapX(x, AP, port());

  // ── 衣袍 ───────────────────────────────────────────────────
  const ROBE = {
    daniel: [70, 96, 150], purple: [112, 54, 128], sack: [84, 74, 62],
    hananiah: [150, 118, 76], mishael: [96, 124, 102], azariah: [138, 92, 104],
    eunuch: [206, 190, 150], neb: [150, 40, 52], bel: [120, 36, 96], darius: [58, 88, 130],
    arioch: [110, 80, 62], soldier: [98, 78, 66], linen: [246, 244, 236],
  };
  const GOLDA = [236, 198, 110];
  const PALE = [[150, 142, 130], [136, 130, 122], [160, 150, 136]];
  const MAGI = [[92, 70, 120], [70, 80, 120], [120, 90, 70], [86, 60, 96], [110, 100, 130]];
  const LORDS = [[140, 60, 70], [110, 86, 130], [150, 112, 70], [80, 104, 120], [126, 70, 110], [160, 130, 90]];
  const OFFI = [[120, 96, 140], [150, 108, 78], [88, 120, 112], [160, 120, 88], [110, 88, 120], [140, 72, 72], [96, 110, 140]];
  const TOWN = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [104, 96, 110]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { king: 'neb', seat: 'throne', dan: 'ground' }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w, L = GS.land; let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const eOut = t => 1 - (1 - t) * (1 - t);
  const eInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const lv = k => W.lv[k] || 0;
  // 近地人物的尺度（人高 44 单位）、近地建筑的尺度（竖屏稍小）、中丘的尺度
  const PK = () => (34 * W.layerScale(2) * (W.w < 600 ? 1.4 : 1) * 1.3) / 44;
  const BK = () => PK() * (port() ? 0.86 : 1);
  const PKm = () => (34 * W.layerScale(1) * (W.w < 600 ? 1.4 : 1) * 1.2) / 44;
  function groundMax(a, b, n) { let m = -Infinity; n = n || 6; for (let i = 0; i <= n; i++) m = Math.max(m, gY(2, lerp(a, b, i / n))); return m; }
  function groundMin(a, b, n) { let m = Infinity; n = n || 6; for (let i = 0; i <= n; i++) m = Math.min(m, gY(2, lerp(a, b, i / n))); return m; }

  // 随画面大小（与地的升起）而变的几何缓存
  let GKEY = '', GC = {};
  // 键里放几处真实的地面高度：大地模块的地形在恢复存档后要到下一帧才更新，不能只看 land 的程度
  function geo() {
    const k = W.w + 'x' + W.h + ':' + Math.round(gY(2, 0.62)) + ':' + Math.round(gY(2, 0.9)) + ':' + Math.round(gY(1, 0.75)) + ':' + Math.round(gY(0, 0.75));
    if (k !== GKEY) { GKEY = k; GC = {}; }
    return GC;
  }
  function cached(key, build) { const g = geo(); if (!(key in g)) g[key] = build(); return g[key]; }

  // 人物（皆经人物模块）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { const q = Object.assign({ from: W.replaying ? 'none' : 'fade' }, o); if (q.x != null) q.x = mx(q.x); return C().add(id, q); }
  function walk(id, x, o) { if (has(id)) C().walk(id, mx(x), o); }
  function place(id, x, layer) { if (has(id)) C().place(id, mx(x), layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && has(id)) c.fly(id, mx(x), y, o); }
  function hover(id, y) { const f = fig(id); if (f) { f.ny = y; f.fly = null; } }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const q = Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o);
    if (q.x0 != null) q.x0 = mx(q.x0);
    if (q.x1 != null) q.x1 = mx(q.x1);
    const ms = C().crowd(gid, q) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const q = Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false, layer: 2 }, o);
    if (q.x0 != null) q.x0 = mx(q.x0);
    if (q.x1 != null) q.x1 = mx(q.x1);
    return U.safe('cast.herd', () => c.herd(gid, q)) || [];
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, mx(x0), mx(x1), o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = mx(d) >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  // 一群人各站在给定的位置
  function placeCrowd(gid, xs) { cmembers(gid).forEach((m, i) => { if (i < xs.length) { m.nx = mx(xs[i]); m.tx = null; } }); }
  // 转屏：场上的人与群按两套位置的锚点挪过去（正走着的，连同去处）
  function remapCast(a, b) {
    const c = C();
    if (!c || !c.people) return;
    for (const q of c.people.values()) { q.nx = remapX(q.nx, a, b); if (q.tx != null) q.tx = remapX(q.tx, a, b); }
    if (c.crowds) for (const g of c.crowds.values()) for (const m of g.members) { m.nx = remapX(m.nx, a, b); if (m.tx != null) m.tx = remapX(m.tx, a, b); }
  }
  function slots(x0, x1, n) { const out = []; for (let i = 0; i < n; i++) out.push(lerp(x0, x1, n > 1 ? i / (n - 1) : 0.5)); return out; }
  // 打扮一群人
  const dressAs = (pal, o) => (m, i) => {
    o = o || {};
    m.sex = o.sex === 'mix' ? (i % 2 ? 'f' : 'm') : (o.sex || 'm');
    m.age = o.age || 'adult';
    m.robe = pal[i % pal.length];
    m.accent = o.accent || null;
    m.hairOpt = o.hair || null;
    if (o.beard != null) m.beardOpt = o.beard;
    m.scale = 0.94 + 0.08 * hsh(i * 3.1 + (o.seed || 0));
    m.v = lerp(o.v0 || 0, o.v1 == null ? 0.06 : o.v1, (i * 0.618 + (o.seed || 0)) % 1);
    if (o.prop !== undefined) m.prop = o.prop;
  };
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }

  // 人物身上的一点：头顶（像素）；按姿势估计
  const HT = { stand: 1, walk: 0.99, run: 0.95, gaze: 0.99, raise: 1, point: 1, carry: 0.99, weep: 0.9, embrace: 0.94, wrestle: 0.85,
    bow: 0.6, kneel: 0.74, pray: 0.72, seat: 0.76, sit: 0.6, fall: 0.13, lie: 0.13, ride: 0.76 };
  const HX = { bow: 0.3, weep: 0.05, pray: 0.04, fall: 0.42, lie: -0.4, sit: 0.02 };
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function modelOf(f) {
    const l = f.layer == null ? 2 : f.layer;
    const h = 44 * (l === 2 ? PK() : PKm()) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    if (f.attach) { const r = U.safe('daniel.attach', () => f.attach()); if (r && isFinite(r[0]) && isFinite(r[1])) return { x: r[0], y: r[1], h }; }
    const g = gY(l, f.nx), fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    return { x: f.nx * W.w, y: f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8, h };
  }
  function headTop(id) {
    const f = fig(id);
    if (!f) return null;
    const d = f.fd || f.facing || 1;
    const m = f._vis && isFinite(f._x) && isFinite(f._y) ? { x: f._x, y: f._y, h: f._h } : modelOf(f);
    const k = HT[f.pose] != null ? HT[f.pose] : 1;
    return [m.x + d * (HX[f.pose] != null ? HX[f.pose] : 0.02) * m.h, m.y - k * m.h];
  }
  function heightOf(f) { return f._vis ? f._h : modelOf(f).h; }
  function chestOf(id) {
    const f = fig(id);
    if (!f) return null;
    const h = heightOf(f), t = headTop(id);
    if (!t) return null;
    return [t[0] - (f.fd || 1) * 0.02 * h, t[1] + 0.34 * h];
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headTop(id);
    if (!h) return;
    const f = fig(id), hh = f ? heightOf(f) : 40;
    fx().sparkle(h[0], h[1] + hh * (frac == null ? 0.3 : frac), n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }
  function ringOn(b, id, rgb, r, frac) {
    if (b.instant || !fx()) return;
    const h = headTop(id);
    if (!h) return;
    const f = fig(id), hh = f ? heightOf(f) : 40;
    fx().ring(h[0], h[1] + hh * (frac == null ? 0.4 : frac), rgb || [255, 236, 190], M() * (r || 0.14), 2.2, 1.6);
  }
  function wordsAt(b, str, cx, cy, size, rgb, src, o) {
    if (b.instant || !fx()) return;
    const n = Array.from(str).length, half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const x = clamp(cx, half + 8, W.w - half - 8);
    fx().nameStr(str, x, cy, size, rgb || [255, 226, 160], src, Object.assign({ hold: 2.6 }, o || {}));
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, o) { fxAdd(b, Object.assign({ type: 'beam', xf, dur: 5, w: 70, k: 1 }, o || {})); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）
  // ════════════════════════════════════════════════════════════
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
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 222, 150], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 232, 255], 1), red: radial([220, 60, 44], 1, 0.4), fire: radial([255, 130, 50], 1, 0.3),
        lamp: radial([255, 160, 70], 1, 0.22), blue: radial([160, 200, 255], 1), cloud: radial([236, 232, 226], 0.9, 0.55),
        dark: radial([10, 12, 22], 1, 0.6), amber: radial([255, 190, 100], 1, 0.4),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火苗（灯）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.6, k * (0.3 + 0.5 * nightK()));
    ctx.globalAlpha = k * 0.8;
    ctx.fillStyle = 'rgb(255,150,60)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.24, y);
    ctx.quadraticCurveTo(x - h * 0.22, y - h * 0.5 * f, x + Math.sin(W.t * 7 + seed) * h * 0.1, y - h * f);
    ctx.quadraticCurveTo(x + h * 0.22, y - h * 0.5 * f, x + h * 0.24, y);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = k * 0.9;
    ctx.fillStyle = 'rgb(255,236,180)';
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.25, h * 0.1, h * 0.22 * f, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一簇火舌（窑、宝座、火河、焚烧的兽）：底在 (x, y)，高 h
  function tongue(ctx, x, y, w, h, ph) {
    const s = Math.sin(ph), s2 = Math.sin(ph * 1.7 + 1.3);
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.9 + s * w * 0.3, y - h * 0.55, x + s2 * w * 0.5, y - h);
    ctx.quadraticCurveTo(x + w * 0.9 + s * w * 0.3, y - h * 0.5, x + w, y);
    ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  画：枣椰树
  // ════════════════════════════════════════════════════════════
  function palm(ctx, l, x, yb, H, k, seed) {
    const lean = (hsh(seed) - 0.5) * 0.28, sway = Math.sin(W.t * 0.8 + seed) * 0.03 + (W.wind || 0) * 0.02;
    const tx = x + (lean + sway * 0.4) * H, ty = yb - H;
    ctx.strokeStyle = css([96, 74, 52], l); ctx.lineWidth = Math.max(0.9, 2.6 * k); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, yb); ctx.quadraticCurveTo(x + lean * H * 0.15, yb - H * 0.55, tx, ty); ctx.stroke();
    ctx.fillStyle = css([64, 98, 60], l);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i / 8 - 0.5) * 3.4 + sway, L = H * (0.42 + 0.12 * hsh(seed * 3 + i));
      const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.4 + L * 0.45 * Math.abs(Math.cos(a));
      const mx = tx + Math.cos(a) * L * 0.55, my = ty + Math.sin(a) * L * 0.55 - L * 0.12;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx, my - 2.4 * k, ex, ey); ctx.quadraticCurveTo(mx, my + 1.6 * k, tx, ty);
    }
    ctx.fill();
    ctx.fillStyle = css([150, 96, 50], l, 0.9);
    ctx.beginPath(); ctx.arc(tx, ty + 1.5 * k, 1.6 * k, 0, TAU); ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  画：中丘上的巴比伦城——城墙、城楼、七层的塔庙、蓝色的城门、枣椰树
  // ════════════════════════════════════════════════════════════
  const BRICK = [192, 160, 116], BRICK_D = [150, 118, 84], GLAZE = [44, 76, 150], GLAZE_D = [26, 38, 70], YEL = [232, 192, 104];
  function cityModel() {
    return cached('city', () => {
      const P_ = X(), km = PKm(), x0 = P_.city0 * W.w, x1 = P_.city1 * W.w;
      const houses = new Path2D(), shade = new Path2D(), wall = new Path2D(), zig = new Path2D(), zigS = new Path2D(), gate = new Path2D(), lights = [];
      const wallH = 11 * km, zx = P_.zig * W.w, gx = P_.gate * W.w;
      let x = x0, i = 0;
      while (x < x1) {
        const w = (8 + 9 * hsh(i * 3.1 + 2)) * km, h = (7 + 13 * hsh(i * 5.7 + 1)) * km;
        const g = gY(1, (x + w / 2) / W.w);
        if (Math.abs(x + w / 2 - zx) > 34 * km && Math.abs(x + w / 2 - gx) > 16 * km) {
          houses.rect(x, g - wallH - h, w, h + wallH);
          shade.rect(x + w * 0.66, g - wallH - h, w * 0.34, h + wallH);
          if (hsh(i * 9.3) < 0.55) lights.push([x + w * (0.3 + 0.3 * hsh(i * 2.2)), g - wallH - h * (0.35 + 0.3 * hsh(i * 4.4)), hsh(i * 7.7)]);
        }
        x += w * (0.78 + 0.3 * hsh(i * 2.3));
        i++;
      }
      // 城墙与城楼（阶梯形垛口）
      const N = 48;
      for (let j = 0; j <= N; j++) { const xx = lerp(x0, x1, j / N), g = gY(1, xx / W.w); if (j) wall.lineTo(xx, g - wallH); else wall.moveTo(xx, g - wallH); }
      for (let j = N; j >= 0; j--) { const xx = lerp(x0, x1, j / N); wall.lineTo(xx, gY(1, xx / W.w) + 1); }
      wall.closePath();
      for (let tx = x0 + 8 * km; tx < x1; tx += 24 * km) {
        const g = gY(1, tx / W.w);
        wall.rect(tx - 3.5 * km, g - wallH - 8 * km, 7 * km, 8 * km + 2);
        for (let m = -1; m <= 1; m++) wall.rect(tx + m * 2.4 * km - 0.8 * km, g - wallH - 10 * km, 1.6 * km, 2.2 * km);
      }
      // 塔庙：六层，顶上的庙是蓝的
      const zg = gY(1, P_.zig);
      let bw = 70 * km, yb = zg - 2 * km;
      for (let t = 0; t < 6; t++) {
        const th = (t === 0 ? 12 : 9.5) * km;
        zig.rect(zx - bw / 2, yb - th, bw, th + 1);
        zigS.rect(zx + bw * 0.18, yb - th, bw * 0.32, th + 1);
        yb -= th; bw -= 10.5 * km;
      }
      const shrine = { x: zx, y: yb, w: Math.max(6 * km, bw), h: 8 * km };
      // 城门（伊施塔尔门）
      const gg = gY(1, P_.gate);
      gate.rect(gx - 15 * km, gg - 32 * km, 11 * km, 33 * km);
      gate.rect(gx + 4 * km, gg - 32 * km, 11 * km, 33 * km);
      gate.rect(gx - 5 * km, gg - 24 * km, 10 * km, 7 * km);
      const palms = P_.palmsM.map((f, j) => [f * W.w, gY(1, f), (18 + 6 * hsh(j * 5.1)) * km, j + 40]);
      return { houses, shade, wall, zig, zigS, gate, lights, shrine, gx, gg, zx, zg, km, wallH };
    });
  }
  function drawCity(ctx) {
    const Cm = cityModel(), km = Cm.km, l = 1;
    const d = litX() >= W.w * 0.75 ? 1 : -1;
    ctx.fillStyle = css(BRICK, l);
    ctx.fill(Cm.houses);
    ctx.fillStyle = css(BRICK_D, l, 0.55);
    ctx.fill(Cm.shade);
    // 塔庙
    ctx.fillStyle = css([184, 150, 108], l);
    ctx.fill(Cm.zig);
    ctx.fillStyle = css([120, 92, 66], l, 0.45);
    ctx.fill(Cm.zigS);
    ctx.strokeStyle = css([220, 196, 150], l, 0.6 * dayA(), 0.1); ctx.lineWidth = Math.max(0.5, 0.8 * km);
    ctx.beginPath(); ctx.moveTo(Cm.zx, Cm.zg - 2 * km); ctx.lineTo(Cm.zx, Cm.shrine.y); ctx.stroke();
    const sh = Cm.shrine;
    ctx.fillStyle = css(GLAZE, l, 1, 0.05);
    ctx.fillRect(sh.x - sh.w / 2, sh.y - sh.h, sh.w, sh.h + 1);
    ctx.fillStyle = css(YEL, l, 0.9, 0.1);
    ctx.fillRect(sh.x - sh.w / 2, sh.y - sh.h, sh.w, 1.2 * km);
    // 城墙
    ctx.fillStyle = css([176, 144, 104], l);
    ctx.fill(Cm.wall);
    // 城门：琉璃的蓝，一道金带
    ctx.fillStyle = css(GLAZE, l, 1, 0.04);
    ctx.fill(Cm.gate);
    ctx.fillStyle = css(YEL, l, 0.85, 0.1);
    ctx.fillRect(Cm.gx - 15 * km, Cm.gg - 22 * km, 30 * km, 1.3 * km);
    ctx.fillStyle = css([20, 18, 24], l);
    ctx.beginPath();
    ctx.moveTo(Cm.gx - 4 * km, Cm.gg + 1); ctx.lineTo(Cm.gx - 4 * km, Cm.gg - 12 * km);
    ctx.quadraticCurveTo(Cm.gx, Cm.gg - 17 * km, Cm.gx + 4 * km, Cm.gg - 12 * km); ctx.lineTo(Cm.gx + 4 * km, Cm.gg + 1); ctx.closePath(); ctx.fill();
    // 枣椰树
    const P_ = X();
    P_.palmsM.forEach((f, j) => palm(ctx, 1, f * W.w, gY(1, f) + 1, (17 + 6 * hsh(j * 5.1)) * km, km * 0.7, j + 40));
    // 夜里城中的灯
    const nk = nightK() * (1 - 0.6 * lv('dnKings'));
    if (nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of Cm.lights) {
        const tw = 0.7 + 0.3 * Math.sin(W.t * 1.3 + q[2] * 20);
        ctx.globalAlpha = nk * tw * 0.9;
        ctx.fillStyle = 'rgb(255,196,120)';
        ctx.fillRect(q[0] - 0.8 * km, q[1] - 0.8 * km, 1.6 * km, 1.6 * km);
        glowAt(ctx, SP.lamp, q[0], q[1], 6 * km, nk * tw * 0.35);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    void d;
  }

  // ════════════════════════════════════════════════════════════
  //  画：大河（自远处流向观者；后来是乌莱河、底格里斯大河）
  // ════════════════════════════════════════════════════════════
  function rivPt(t) {
    const P_ = X();
    const x0 = P_.riv0 * W.w, y0 = gY(2, P_.riv0) + 0.5, x3 = P_.riv1 * W.w, y3 = W.h + 8;
    const x1 = lerp(x0, x3, 0.3) - 0.012 * W.w, y1 = lerp(y0, y3, 0.38), x2 = lerp(x0, x3, 0.62) + 0.02 * W.w, y2 = lerp(y0, y3, 0.72), u = 1 - t;
    const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2), L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const rivW = t => (0.006 + (port() ? 0.1 : 0.068) * Math.pow(t, 1.3)) * W.w;
  function rivEdge(mul, add) {
    return cached('riv:' + mul + ':' + add.toFixed(2), () => {
      const P2 = new Path2D(), Lp = [], Rp = [], N = 28;
      for (let i = 0; i <= N; i++) { const t = i / N, p = rivPt(t), w = rivW(t) * mul / 2 + add * (0.3 + t); Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
      for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
      P2.closePath();
      return P2;
    });
  }
  function drawRiver(ctx) {
    const s = PK();
    ctx.fillStyle = css([150, 128, 92], 2, 0.5);
    ctx.fill(rivEdge(1.7, 5 * s));
    ctx.fillStyle = css([112, 96, 70], 2);
    ctx.fill(rivEdge(1.25, 2 * s));
    const y0 = gY(2, X().riv0), y2 = W.h;
    const top = W.shade([150, 184, 196], 0.45, 0.05), bot = W.shade([44, 96, 120], 0, 0.02);
    const gr = ctx.createLinearGradient(0, y0, 0, y2);
    gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
    ctx.fillStyle = gr;
    ctx.fill(rivEdge(1, 0));
    // 天光与火光的倒影
    const night = W.night > 0.5;
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = night ? 0.35 * W.lv.moon + 0.3 * lv('dnStars') : 0.45 * W.daylight;
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        for (let i = band; i < 24; i += 3) {
          const t = U.fract(hsh(i * 5 + 700) + W.t * 0.016 * (0.7 + 0.6 * hsh(i * 5 + 701)));
          if (t < 0.03) continue;
          const p = rivPt(t), w = rivW(t) / 2, off = (hsh(i * 5 + 702) * 2 - 1) * 0.7 * w, len = w * (0.25 + 0.3 * hsh(i * 5 + 703));
          const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off;
          ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
        }
        ctx.globalAlpha = ga * (0.35 + 0.3 * band) * (0.6 + 0.4 * Math.sin(W.t * (0.7 + band * 0.37) + band * 2.1));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 芦荻
    ctx.strokeStyle = css([96, 120, 66], 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    const R = cached('reeds', () => {
      const out = [];
      for (let i = 0; i < 40; i++) {
        const t = 0.1 + 0.88 * hsh(i * 3 + 900), side = i % 2 ? 1 : -1, p = rivPt(t), w = rivW(t) * 0.62 + 2 * s;
        out.push([p[0] + p[2] * w * side, p[1] + p[3] * w * side, (3 + 6 * hsh(i * 3 + 901)) * s * (0.4 + 1.1 * t)]);
      }
      return out;
    });
    ctx.beginPath();
    const ws = (W.wind || 0) * 1.5 * s;
    for (let i = 0; i < R.length; i++) {
      const q = R[i], sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + sw * 0.3, q[1] - q[2] * 0.6, q[0] + sw, q[1] - q[2]);
    }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  画：但以理的家——两层的泥砖房；楼上开敞的一间，右边的窗户开向耶路撒冷
  // ════════════════════════════════════════════════════════════
  function houseGeom() {
    return cached('house', () => {
      const P_ = X(), k = BK(), x = P_.house * W.w;
      const g = groundMax((x - 30 * k) / W.w, (x + 30 * k) / W.w, 4) + 1.5 * k;
      const yR = g - 34 * k, yT = yR - 44 * k;
      return { k, x, g, yR, yT, x0: x - 29 * k, x1: x + 29 * k, r0: x - 9 * k, r1: x + 25 * k };
    });
  }
  const roomFloor = () => { const H = houseGeom(); return [H.x + 9 * H.k, H.yR + 0.5 * H.k]; };
  function drawHouse(ctx) {
    const a = lv('dnHouse');
    if (a < 0.01) return;
    const H = houseGeom(), k = H.k, l = 2;
    const d = litX() >= H.x ? 1 : -1;
    const nk = nightK();
    ctx.globalAlpha = a;
    // 外面的阶梯（左）
    ctx.fillStyle = css([176, 146, 104], l);
    ctx.beginPath();
    ctx.moveTo(H.x0 - 16 * k, H.g + 2 * k);
    for (let i = 0; i < 6; i++) { const sx = H.x0 - 16 * k + i * (16 / 6) * k, sy = H.g - (i + 1) * (34 / 6) * k; ctx.lineTo(sx, sy); ctx.lineTo(sx + (16 / 6) * k, sy); }
    ctx.lineTo(H.x0, H.g + 2 * k); ctx.closePath(); ctx.fill();
    // 楼下
    ctx.fillStyle = css([204, 174, 128], l);
    ctx.fillRect(H.x0, H.yR, H.x1 - H.x0, H.g - H.yR + 2 * k);
    ctx.fillStyle = css([150, 118, 84], l, 0.45);
    if (d > 0) ctx.fillRect(H.x0, H.yR, 8 * k, H.g - H.yR + 2 * k); else ctx.fillRect(H.x1 - 8 * k, H.yR, 8 * k, H.g - H.yR + 2 * k);
    ctx.strokeStyle = css([160, 128, 92], l, 0.35); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let yy = H.yR + 6 * k; yy < H.g; yy += 6 * k) { ctx.moveTo(H.x0, yy); ctx.lineTo(H.x1, yy); }
    ctx.stroke();
    // 门与小窗：夜里透出灯光
    const lampK = Math.max(nk * 0.8, lv('dnWin') * 0.6, lv('dnRest') * 0.95);
    const door = () => { ctx.beginPath(); ctx.moveTo(H.x - 16 * k, H.g + 1 * k); ctx.lineTo(H.x - 16 * k, H.g - 16 * k); ctx.quadraticCurveTo(H.x - 11 * k, H.g - 22 * k, H.x - 6 * k, H.g - 16 * k); ctx.lineTo(H.x - 6 * k, H.g + 1 * k); ctx.closePath(); };
    ctx.fillStyle = css([28, 22, 20], l); door(); ctx.fill();
    ctx.fillRect(H.x + 8 * k, H.yR + 10 * k, 7 * k, 6 * k);
    if (lampK > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * lampK * 0.8;
      ctx.fillStyle = 'rgb(255,164,80)';
      door(); ctx.fill();
      ctx.fillRect(H.x + 8 * k, H.yR + 10 * k, 7 * k, 6 * k);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 房顶与矮墙
    ctx.fillStyle = css([222, 196, 150], l);
    ctx.fillRect(H.x0 - 1.5 * k, H.yR - 2 * k, H.x1 - H.x0 + 3 * k, 2.4 * k);
    ctx.fillStyle = css([196, 166, 122], l);
    ctx.fillRect(H.x0 - 1 * k, H.yR - 6 * k, H.r0 - H.x0 + 1 * k, 4 * k);
    // 楼上的一间：里面（暗）、两边的墙柱、顶
    const inner = mix([96, 74, 56], [255, 190, 110], Math.max(lv('dnWin') * 0.35, lv('dnReveal') * 0.3));
    ctx.fillStyle = css(inner, l, 1, 0.02);
    ctx.fillRect(H.r0, H.yT, H.r1 - H.r0, H.yR - H.yT);
    ctx.fillStyle = css([200, 170, 124], l);
    ctx.fillRect(H.r0 - 1 * k, H.yT, 4.5 * k, H.yR - H.yT);
    ctx.fillRect(H.r1 - 3.5 * k, H.yT, 4.5 * k, H.yR - H.yT);
    ctx.fillStyle = css([222, 196, 150], l);
    ctx.fillRect(H.r0 - 3 * k, H.yT - 4 * k, H.r1 - H.r0 + 6 * k, 4.5 * k);
    // 右面的墙（斜看）：开向耶路撒冷的窗
    ctx.fillStyle = css([176, 144, 104], l);
    ctx.beginPath();
    ctx.moveTo(H.r1 + 1 * k, H.yT - 4 * k); ctx.lineTo(H.r1 + 7 * k, H.yT - 1 * k); ctx.lineTo(H.r1 + 7 * k, H.yR + 1 * k); ctx.lineTo(H.r1 + 1 * k, H.yR); ctx.closePath(); ctx.fill();
    const win = () => { ctx.beginPath(); ctx.moveTo(H.r1 + 2.5 * k, H.yT + 11 * k); ctx.lineTo(H.r1 + 5.8 * k, H.yT + 12.5 * k); ctx.lineTo(H.r1 + 5.8 * k, H.yT + 27 * k); ctx.lineTo(H.r1 + 2.5 * k, H.yT + 26 * k); ctx.closePath(); };
    ctx.fillStyle = css([36, 28, 24], l); win(); ctx.fill();
    const wk = Math.max(lv('dnWin'), nk * 0.3);
    if (wk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * wk;
      ctx.fillStyle = 'rgb(255,190,110)'; win(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 楼上的一盏灯
    if (SP && (nk > 0.2 || lv('dnWin') > 0.05)) {
      const rs = lv('dnRest');
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, H.r0 + 6 * k, H.yR - 12 * k, 22 * k * (1 + 0.5 * rs), a * Math.max(nk * 0.5, lv('dnWin') * 0.5, rs * 0.8));
      if (rs > 0.01) glowAt(ctx, SP.warm, H.x - 11 * k, H.g - 6 * k, 30 * k, a * rs * 0.45, 0.6);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, H.r0 + 6 * k, H.yR - 10 * k, 3 * k, a * Math.max(nk, lv('dnWin')), 3.3);
    }
    // 迎光的边
    ctx.strokeStyle = css([255, 244, 220], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath(); ctx.moveTo(H.x0 - 1.5 * k, H.yR - 2 * k); ctx.lineTo(H.x1 + 1.5 * k, H.yR - 2 * k); ctx.moveTo(H.r0 - 3 * k, H.yT - 4 * k); ctx.lineTo(H.r1 + 3 * k, H.yT - 4 * k); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 日落时开向耶路撒冷的窗里的一道光（6:10）；夜里异象中显明的光（2:19）
  function drawWinRay(ctx) {
    if (!SP) return;
    const a = lv('dnHouse');
    if (a < 0.01) return;
    const H = houseGeom(), k = H.k;
    const w = lv('dnWin');
    ctx.globalCompositeOperation = 'lighter';
    if (w > 0.01) {
      const wx = H.r1 + 4 * k, wy = H.yT + 19 * k;
      const sx = W.w + 20, sy = W.sun && W.sun.y > 0 && W.sun.y < W.h ? Math.min(W.sun.y, W.horizonY) : W.horizonY - 0.08 * W.h;
      const dusk = clamp(W.dusk * 1.3 + 0.25, 0, 1);
      const g = ctx.createLinearGradient(wx, wy, sx, sy);
      g.addColorStop(0, 'rgba(255,214,140,' + (0.26 * w * a * dusk).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,190,110,0)');
      ctx.fillStyle = g;
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.moveTo(wx, wy - 5 * k); ctx.lineTo(sx, sy - 0.035 * W.h); ctx.lineTo(sx, sy + 0.03 * W.h); ctx.lineTo(wx, wy + 6 * k); ctx.closePath(); ctx.fill();
      glowAt(ctx, SP.amber, wx, wy, 14 * k, w * a * 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawHouseLight(ctx) {
    if (!SP) return;
    const a = lv('dnHouse');
    if (a < 0.01) return;
    const H = houseGeom(), k = H.k;
    ctx.globalCompositeOperation = 'lighter';
    const r = lv('dnReveal');
    if (r > 0.01) {
      const x = H.x - 2 * k, y = H.g;
      const bw = 70 * k * (0.8 + 0.2 * Math.sin(W.t * 0.9));
      ctx.globalAlpha = r * 0.55;
      ctx.drawImage(SP.beam, x - bw / 2, -10, bw, y + 10);
      glowAt(ctx, SP.gold, x, y - 18 * k, 60 * k, r * 0.55);
      glowAt(ctx, SP.white, x, y - 22 * k, 24 * k, r * 0.5);
      // 下降的光点
      ctx.fillStyle = 'rgb(255,240,200)';
      for (let i = 0; i < 18; i++) {
        const ph = U.fract(W.t * 0.18 + hsh(i * 3.3));
        const px = x + (hsh(i * 5.1) - 0.5) * bw * 0.6, py = lerp(y * 0.2, y - 6 * k, ph);
        ctx.globalAlpha = r * 0.8 * Math.sin(Math.PI * ph);
        ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：王宫——两座城楼夹着开敞的大殿；殿里是宝座、灯台与对面的粉墙
  // ════════════════════════════════════════════════════════════
  function palGeom() {
    return cached('pal', () => {
      const P_ = X(), k = BK(), x0 = P_.pal0 * W.w, x1 = P_.pal1 * W.w;
      let gMin = Infinity, gMax = -Infinity;
      for (let i = 0; i <= 10; i++) { const g = gY(2, lerp(P_.pal0, P_.pal1, i / 10)); gMin = Math.min(gMin, g); gMax = Math.max(gMax, g); }
      const tw = 19 * k;
      return { k, x0, x1, gMin, gMax, tw, h0: x0 + tw, h1: x1 - tw, top: gMin - 106 * k, ttop: gMin - 128 * k };
    });
  }
  function wallPoly(ctx, xa, xb, ytop, k) {
    const N = 8;
    ctx.beginPath();
    ctx.moveTo(xa, ytop); ctx.lineTo(xb, ytop);
    for (let i = N; i >= 0; i--) { const x = lerp(xa, xb, i / N); ctx.lineTo(x, gY(2, x / W.w) + 1.5 * k); }
    ctx.closePath();
  }
  // 阶梯形的垛口
  function merlons(ctx, xa, xb, y, k) {
    const step = 7.6 * k, n = Math.max(1, Math.floor((xb - xa) / step));
    const off = xa + ((xb - xa) - n * step) / 2 + step / 2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = off + i * step;
      ctx.moveTo(x - 3 * k, y); ctx.lineTo(x - 3 * k, y - 2.3 * k); ctx.lineTo(x - 2 * k, y - 2.3 * k); ctx.lineTo(x - 2 * k, y - 4.6 * k);
      ctx.lineTo(x - 1 * k, y - 4.6 * k); ctx.lineTo(x - 1 * k, y - 7 * k); ctx.lineTo(x + 1 * k, y - 7 * k); ctx.lineTo(x + 1 * k, y - 4.6 * k);
      ctx.lineTo(x + 2 * k, y - 4.6 * k); ctx.lineTo(x + 2 * k, y - 2.3 * k); ctx.lineTo(x + 3 * k, y - 2.3 * k); ctx.lineTo(x + 3 * k, y);
      ctx.closePath();
    }
    ctx.fill();
  }
  // 琉璃砖上的一行金狮
  function lionRow(ctx, xa, xb, y, k, a) {
    const n = Math.max(2, Math.floor((xb - xa) / (15 * k)));
    ctx.fillStyle = css(YEL, 2, a, 0.1);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = lerp(xa, xb, (i + 0.5) / n);
      if (k < 0.7) { ctx.rect(x - 3 * k, y - 1 * k, 6 * k, 2 * k); continue; }
      ctx.moveTo(x + 3.2 * k, y); ctx.ellipse(x, y, 3.2 * k, 1.4 * k, 0, 0, TAU);
      ctx.moveTo(x + 4.6 * k, y - 1.2 * k); ctx.arc(x + 3.6 * k, y - 1.2 * k, 1.3 * k, 0, TAU);
      ctx.rect(x - 2.6 * k, y + 0.6 * k, 0.8 * k, 2 * k); ctx.rect(x + 1.8 * k, y + 0.6 * k, 0.8 * k, 2 * k);
      ctx.rect(x - 5.4 * k, y - 1.6 * k, 2.4 * k, 0.6 * k);
    }
    ctx.fill();
  }
  function rosettes(ctx, xa, xb, y, k, a) {
    const n = Math.max(3, Math.floor((xb - xa) / (5.5 * k)));
    ctx.fillStyle = css([236, 228, 206], 2, a, 0.1);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = lerp(xa, xb, (i + 0.5) / n); ctx.moveTo(x + 1.1 * k, y); ctx.arc(x, y, 1.1 * k, 0, TAU); }
    ctx.fill();
  }
  function panelRect() {
    const G = palGeom(), P_ = X(), k = G.k;
    return { x0: P_.wall0 * W.w, x1: P_.wall1 * W.w, y0: G.top + 15 * k, y1: G.top + 49 * k, k };
  }
  function hallLamp() { return Math.max(nightK() * 0.55, lv('dnHall'), lv('dnKingLamp') * 0.5); }
  function drawPalace(ctx) {
    const G = palGeom(), P_ = X(), k = G.k, l = 2;
    const { x0, x1, h0, h1, top, ttop } = G;
    const d = litX() >= (x0 + x1) / 2 ? 1 : -1;
    const lampK = hallLamp();
    const wallTop = top + 10 * k;
    // ── 殿里：琉璃砖的后墙 ──
    const inner = mix([34, 52, 104], [120, 90, 50], lv('dnFeast') * 0.2);
    ctx.fillStyle = css(inner, l);
    wallPoly(ctx, h0, h1, wallTop, k); ctx.fill();
    ctx.strokeStyle = css([12, 18, 36], l, 0.35);
    ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let yy = wallTop + 58 * k; yy < G.gMax; yy += 5.5 * k) { ctx.moveTo(h0, yy); ctx.lineTo(h1, yy); }
    ctx.stroke();
    // 粉墙（灯台对面）：暖色的灰泥，边缘柔和、有抹子的淡痕；金框只在伯沙撒的盛筵时显出
    const Pn = panelRect();
    ctx.fillStyle = css([172, 156, 130], l, 0.45);
    ctx.fillRect(Pn.x0 - 2 * k, Pn.y0 - 2 * k, Pn.x1 - Pn.x0 + 4 * k, Pn.y1 - Pn.y0 + 4 * k);
    ctx.fillStyle = css(mix([178, 162, 136], [200, 176, 140], lampK * 0.6), l);
    ctx.fillRect(Pn.x0, Pn.y0, Pn.x1 - Pn.x0, Pn.y1 - Pn.y0);
    ctx.strokeStyle = css([140, 124, 100], l, 0.16); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const yy = lerp(Pn.y0, Pn.y1, (i + 0.5 + 0.3 * (hsh(i * 3.3) - 0.5)) / 6), xa = lerp(Pn.x0, Pn.x1, 0.06 + 0.3 * hsh(i * 5.1)), xb = lerp(Pn.x0, Pn.x1, 0.6 + 0.34 * hsh(i * 7.7));
      ctx.moveTo(xa, yy); ctx.quadraticCurveTo((xa + xb) / 2, yy + (hsh(i * 2.9) - 0.5) * 1.6 * k, xb, yy);
    }
    ctx.stroke();
    const frameK = Math.max(lv('dnFeast'), lv('dnWrite'));
    if (frameK > 0.01) {
      ctx.strokeStyle = css(YEL, l, 0.8 * frameK, 0.08); ctx.lineWidth = Math.max(0.5, 0.9 * k);
      ctx.strokeRect(Pn.x0 - 1 * k, Pn.y0 - 1 * k, Pn.x1 - Pn.x0 + 2 * k, Pn.y1 - Pn.y0 + 2 * k);
    }
    // 金狮一行、玫瑰花饰
    const fy = wallTop + 50 * k;
    ctx.fillStyle = css(GLAZE, l, 1, 0.03);
    ctx.fillRect(h0, fy - 5.5 * k, h1 - h0, 11 * k);
    lionRow(ctx, h0 + 4 * k, h1 - 4 * k, fy, k, 0.95);
    rosettes(ctx, h0 + 2 * k, h1 - 2 * k, wallTop + 3.5 * k, k, 0.8);
    // 屋顶之下的暗影
    const sh = cached('palShade', () => { const g = ctx.createLinearGradient(0, wallTop, 0, wallTop + 46 * k); g.addColorStop(0, 'rgba(8,10,22,0.5)'); g.addColorStop(1, 'rgba(8,10,22,0.12)'); return g; });
    ctx.globalAlpha = dayA();
    ctx.fillStyle = sh;
    ctx.fillRect(h0, wallTop, h1 - h0, 46 * k);
    ctx.globalAlpha = 1;
    // 殿中的灯：整个殿里一片暖光，墙上与地上更亮
    if (SP && lampK > 0.02) {
      const nk = nightK();
      ctx.globalCompositeOperation = 'lighter';
      const ig = cached('palLamp', () => { const g = ctx.createLinearGradient(0, wallTop, 0, G.gMax); g.addColorStop(0, 'rgba(255,150,70,0.12)'); g.addColorStop(1, 'rgba(255,170,90,0.3)'); return g; });
      ctx.globalAlpha = lampK * (0.4 + 0.6 * nk);
      ctx.fillStyle = ig;
      wallPoly(ctx, h0, h1, wallTop, k); ctx.fill();
      ctx.globalAlpha = 1;
      glowAt(ctx, SP.warm, (Pn.x0 + Pn.x1) / 2, (Pn.y0 + Pn.y1) / 2, (Pn.x1 - Pn.x0) * 0.85, lampK * 0.55, 0.7);
      glowAt(ctx, SP.warm, lerp(h0, h1, 0.5), G.gMin - 14 * k, (h1 - h0) * 0.65, lampK * 0.4, 0.5);
      glowAt(ctx, SP.lamp, X().lamp * W.w, G.gMin - 40 * k, 34 * k, lampK * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 王的烈怒（红）
    const wr = lv('dnWrath');
    if (SP && wr > 0.02) {
      const c = chestOf(S.king);
      if (c) { glowAt(ctx, SP.red, c[0], c[1], 70 * k, wr * 0.4); ctx.globalAlpha = 1; }
    }
    // 地面：铺砖
    ctx.fillStyle = css([196, 176, 140], l);
    ctx.beginPath();
    const NF = 10;
    for (let i = 0; i <= NF; i++) { const x = lerp(h0, h1, i / NF); const y = gY(2, x / W.w) - 0.6 * k; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = NF; i >= 0; i--) { const x = lerp(h0, h1, i / NF); ctx.lineTo(x, gY(2, x / W.w) + 4 * k); }
    ctx.closePath(); ctx.fill();
    drawThrone(ctx);
    drawBed(ctx);
    drawFeast(ctx);
    // ── 城楼 ──
    for (const [a0, a1, door] of [[x0, h0, true], [h1, x1, false]]) {
      ctx.fillStyle = css(BRICK, l);
      wallPoly(ctx, a0, a1, ttop, k); ctx.fill();
      ctx.fillStyle = css(BRICK_D, l, 0.5);
      if (d > 0) ctx.fillRect(a0, ttop, (a1 - a0) * 0.3, G.gMax - ttop); else ctx.fillRect(a1 - (a1 - a0) * 0.3, ttop, (a1 - a0) * 0.3, G.gMax - ttop);
      ctx.fillStyle = css(GLAZE, l, 1, 0.03);
      ctx.fillRect(a0, ttop + 14 * k, a1 - a0, 12 * k);
      lionRow(ctx, a0 + 1 * k, a1 - 1 * k, ttop + 20 * k, k * 0.8, 0.9);
      ctx.fillStyle = css(BRICK, l);
      merlons(ctx, a0 - 1 * k, a1 + 1 * k, ttop, k);
      if (door) {
        const dx = (a0 + a1) / 2, dy = gY(2, dx / W.w) + 1 * k;
        const dp = () => { ctx.beginPath(); ctx.moveTo(dx - 5.5 * k, dy); ctx.lineTo(dx - 5.5 * k, dy - 22 * k); ctx.quadraticCurveTo(dx, dy - 29 * k, dx + 5.5 * k, dy - 22 * k); ctx.lineTo(dx + 5.5 * k, dy); ctx.closePath(); };
        ctx.fillStyle = css([22, 18, 20], l); dp(); ctx.fill();
        ctx.strokeStyle = css(GLAZE, l, 1, 0.05); ctx.lineWidth = Math.max(0.8, 1.6 * k); dp(); ctx.stroke();
        if (lampK > 0.02) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = lampK * 0.6; ctx.fillStyle = 'rgb(255,160,80)'; dp(); ctx.fill();
          ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        }
      }
    }
    // ── 殿前的楣梁与垛口 ──
    ctx.fillStyle = css(BRICK, l);
    ctx.fillRect(h0, top, h1 - h0, 10 * k);
    ctx.fillStyle = css(GLAZE, l, 1, 0.03);
    ctx.fillRect(h0, top + 3 * k, h1 - h0, 4.5 * k);
    rosettes(ctx, h0 + 2 * k, h1 - 2 * k, top + 5.2 * k, k * 0.8, 0.85);
    ctx.fillStyle = css(BRICK, l);
    merlons(ctx, h0, h1, top, k);
    ctx.strokeStyle = css([255, 246, 222], l, 0.45 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.9 * k);
    ctx.beginPath(); ctx.moveTo(x0, ttop); ctx.lineTo(h0, ttop); ctx.moveTo(h1, ttop); ctx.lineTo(x1, ttop); ctx.moveTo(h0, top); ctx.lineTo(h1, top); ctx.stroke();
    // 城楼上的火把（夜里）
    const tk = nightK();
    if (tk > 0.05) for (const tx of [x0 + 4 * k, x1 - 4 * k]) flame(ctx, tx, ttop + 30 * k, 4 * k, tk * (1 - lv('dnKings') * 0.3), tx * 0.01);
    // 灯台（在殿的左边，与粉墙相对）
    drawLampstand(ctx);
    drawTable(ctx);
  }
  // 殿中的灯台：巴比伦式的高脚灯——三足、细杆、杆上的节，顶上一只宽而浅的油盏，盏沿三根灯芯
  function drawLampstand(ctx) {
    const P_ = X(), k = BK(), x = P_.lamp * W.w, y = gY(2, P_.lamp) + 1 * k, l = 2;
    const lampK = hallLamp();
    const br = css([178, 134, 72], l, 1, 0.06);
    ctx.strokeStyle = br; ctx.fillStyle = br;
    ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.6, 1.1 * k);
    ctx.beginPath();
    ctx.moveTo(x - 5.5 * k, y); ctx.quadraticCurveTo(x - 2 * k, y - 3 * k, x, y - 6.5 * k);
    ctx.moveTo(x + 5.5 * k, y); ctx.quadraticCurveTo(x + 2 * k, y - 3 * k, x, y - 6.5 * k);
    ctx.moveTo(x + 1.2 * k, y); ctx.lineTo(x, y - 6.5 * k);
    ctx.stroke();
    ctx.fillRect(x - 0.7 * k, y - 35 * k, 1.4 * k, 29 * k);
    ctx.beginPath();
    for (const yy of [13, 24]) { ctx.moveTo(x + 1.7 * k, y - yy * k); ctx.ellipse(x, y - yy * k, 1.7 * k, 1 * k, 0, 0, TAU); }
    ctx.moveTo(x - 2.4 * k, y - 34 * k); ctx.lineTo(x + 2.4 * k, y - 34 * k); ctx.lineTo(x + 1 * k, y - 36 * k); ctx.lineTo(x - 1 * k, y - 36 * k); ctx.closePath();
    // 油盏
    ctx.moveTo(x - 7 * k, y - 37.2 * k); ctx.quadraticCurveTo(x, y - 32.4 * k, x + 7 * k, y - 37.2 * k); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([226, 184, 110], l, 0.8, 0.1); ctx.lineWidth = Math.max(0.5, 0.7 * k);
    ctx.beginPath(); ctx.moveTo(x - 7 * k, y - 37.2 * k); ctx.lineTo(x + 7 * k, y - 37.2 * k); ctx.stroke();
    if (lampK > 0.02) for (const dx of [-4.6, 0, 4.6]) flame(ctx, x + dx * k, y - 37.6 * k, 3.6 * k, lampK, dx + 5);
  }
  // 宝座：两层的台、高背金座（王面向殿门，朝左）
  function throneSeat() { const P_ = X(), k = BK(), x = P_.throne * W.w, g = gY(2, P_.throne) + 1 * k; return [x, g - 7 * k]; }
  function drawThrone(ctx) {
    const P_ = X(), k = BK(), x = P_.throne * W.w, g = gY(2, P_.throne) + 1 * k, l = 2;
    ctx.fillStyle = css([186, 170, 140], l);
    ctx.fillRect(x - 14 * k, g - 3.5 * k, 28 * k, 3.5 * k + 1);
    ctx.fillRect(x - 10 * k, g - 7 * k, 20 * k, 3.6 * k);
    ctx.fillStyle = css([210, 166, 80], l, 1, 0.08);
    ctx.fillRect(x - 5 * k, g - 19 * k, 9 * k, 12 * k);
    ctx.fillRect(x + 3 * k, g - 35 * k, 3.4 * k, 28 * k);
    ctx.beginPath(); ctx.arc(x + 4.7 * k, g - 35 * k, 2.4 * k, 0, TAU); ctx.fill();
    ctx.fillStyle = css([130, 40, 60], l, 0.9);
    ctx.fillRect(x - 4.5 * k, g - 19.5 * k, 8 * k, 2 * k);
  }
  function bedTop() { const P_ = X(), k = BK(), x = P_.bed * W.w, g = gY(2, P_.bed); return [x, g - 8 * k]; }
  function drawBed(ctx) {
    const a = lv('dnBed');
    if (a < 0.01) return;
    const P_ = X(), k = BK(), x = P_.bed * W.w, g = gY(2, P_.bed) + 1 * k, l = 2;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([120, 86, 56], l);
    ctx.fillRect(x - 17 * k, g - 8 * k, 1.8 * k, 8 * k); ctx.fillRect(x + 15 * k, g - 8 * k, 1.8 * k, 8 * k);
    ctx.fillRect(x - 18 * k, g - 9 * k, 36 * k, 2.2 * k);
    ctx.fillStyle = css([200, 180, 150], l, 1, 0.03);
    ctx.fillRect(x - 17 * k, g - 11 * k, 34 * k, 2.4 * k);
    ctx.fillStyle = css([150, 60, 70], l);
    ctx.beginPath(); ctx.ellipse(x - 14 * k, g - 12 * k, 4 * k, 2 * k, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 伯沙撒的盛筵：长案、金银的器皿
  function drawFeast(ctx) {
    const a = lv('dnFeast');
    if (a < 0.01) return;
    const P_ = X(), k = BK(), l = 2;
    ctx.globalAlpha = a;
    for (const [fa, fb] of [[0.02, 0.45], [0.55, 0.78]]) {
      const xa = lerp(P_.hall0, P_.hall1, fa) * W.w, xb = lerp(P_.hall0, P_.hall1, fb) * W.w;
      const y = groundMin(xa / W.w, xb / W.w, 3) - 7 * k;
      ctx.fillStyle = css([110, 76, 50], l);
      ctx.fillRect(xa, y, xb - xa, 2 * k);
      ctx.fillRect(xa + 2 * k, y, 1.5 * k, 7 * k); ctx.fillRect(xb - 3.5 * k, y, 1.5 * k, 7 * k);
      const n = Math.max(3, Math.floor((xb - xa) / (6 * k)));
      for (let i = 0; i < n; i++) {
        const x = lerp(xa + 3 * k, xb - 3 * k, (i + 0.5) / n), gold = i % 3 !== 1;
        ctx.fillStyle = css(gold ? [236, 196, 96] : [220, 222, 230], l, 1, 0.15);
        ctx.beginPath(); ctx.moveTo(x - 1.6 * k, y); ctx.lineTo(x - 1.2 * k, y - 3.2 * k); ctx.lineTo(x + 1.2 * k, y - 3.2 * k); ctx.lineTo(x + 1.6 * k, y); ctx.closePath(); ctx.fill();
        if (SP && hallLamp() > 0.1) {
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, SP.gold, x, y - 2.5 * k, 3 * k * (0.8 + 0.4 * Math.sin(W.t * 2 + i)), a * 0.5);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = a;
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  // 王的膳与酒（1:5）：殿前的矮案，金盘里的肉、一瓮酒、金杯——用王膳的少年人围坐
  // 素菜与白水（1:12）：四个少年人面前铺开的席子，几钵素菜、一瓶白水
  function drawTable(ctx) {
    const at = lv('dnTable'), av = lv('dnVeg');
    if (at < 0.01 && av < 0.01) return;
    const P_ = X(), k = BK(), l = 2;
    if (at > 0.01) {
      const x = P_.table * W.w, g = gY(2, P_.table) + 1 * k;
      ctx.globalAlpha = at;
      ctx.fillStyle = css([118, 84, 54], l);
      ctx.fillRect(x - 15 * k, g - 11 * k, 2.2 * k, 11 * k); ctx.fillRect(x + 12.8 * k, g - 11 * k, 2.2 * k, 11 * k);
      ctx.fillRect(x - 16.5 * k, g - 12.4 * k, 33 * k, 2.6 * k);
      ctx.fillStyle = css([150, 44, 58], l, 0.95);
      ctx.fillRect(x - 17 * k, g - 12.6 * k, 34 * k, 1.5 * k);
      ctx.fillRect(x - 17 * k, g - 12.6 * k, 2 * k, 5 * k); ctx.fillRect(x + 15 * k, g - 12.6 * k, 2 * k, 5 * k);
      // 金盘与盘里的肉
      ctx.fillStyle = css([236, 196, 96], l, 1, 0.15);
      ctx.beginPath();
      for (const dx of [-10, 1.5]) { ctx.moveTo(x + (dx + 5) * k, g - 13.4 * k); ctx.ellipse(x + dx * k, g - 13.4 * k, 5 * k, 1.5 * k, 0, 0, TAU); }
      ctx.fill();
      ctx.fillStyle = css([158, 86, 50], l, 1, 0.05);
      ctx.beginPath();
      for (const dx of [-10, 1.5]) { ctx.moveTo(x + (dx + 3.4) * k, g - 14.4 * k); ctx.ellipse(x + dx * k, g - 14.4 * k, 3.4 * k, 2 * k, 0, Math.PI, TAU); }
      ctx.fill();
      // 酒瓮与金杯
      ctx.fillStyle = css([128, 48, 44], l, 1, 0.04);
      ctx.beginPath();
      ctx.moveTo(x + 9 * k, g - 12.6 * k); ctx.quadraticCurveTo(x + 6.4 * k, g - 18 * k, x + 9.2 * k, g - 21.5 * k);
      ctx.lineTo(x + 8.8 * k, g - 24 * k); ctx.lineTo(x + 12.2 * k, g - 24 * k); ctx.lineTo(x + 11.8 * k, g - 21.5 * k);
      ctx.quadraticCurveTo(x + 14.6 * k, g - 18 * k, x + 12 * k, g - 12.6 * k); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([236, 196, 96], l, 1, 0.15);
      ctx.beginPath();
      for (const dx of [-4.2, 6]) { ctx.moveTo(x + (dx - 1.4) * k, g - 16.6 * k); ctx.lineTo(x + (dx + 1.4) * k, g - 16.6 * k); ctx.lineTo(x + (dx + 0.4) * k, g - 14 * k); ctx.lineTo(x + (dx + 0.9) * k, g - 12.8 * k); ctx.lineTo(x + (dx - 0.9) * k, g - 12.8 * k); ctx.lineTo(x + (dx - 0.4) * k, g - 14 * k); ctx.closePath(); }
      ctx.fill();
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x - 3 * k, g - 14 * k, 14 * k, at * 0.35 * (0.6 + 0.4 * W.daylight)); ctx.globalCompositeOperation = 'source-over'; }
    }
    if (av > 0.01) {
      const x = P_.veg * W.w, g = fieldY(P_.veg, 0.14);
      ctx.globalAlpha = av;
      ctx.fillStyle = css([184, 160, 116], l);
      ctx.beginPath(); ctx.ellipse(x, g, 25 * k, 3.2 * k, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([150, 128, 92], l, 0.6);
      ctx.beginPath(); ctx.ellipse(x, g + 1 * k, 25 * k, 2.2 * k, 0, 0, Math.PI); ctx.fill();
      // 素菜：三只陶钵，钵里堆着青菜与豆
      for (const dx of [-15, -5, 5]) {
        const bx = x + dx * k, by = g - 0.6 * k;
        ctx.fillStyle = css([96, 150, 64], l, 1, 0.05);
        ctx.beginPath();
        for (const [ox, oy, r] of [[-2.2, -2.6, 2], [0.4, -3.4, 2.3], [2.6, -2.5, 1.9]]) { ctx.moveTo(bx + (ox + r) * k, by + oy * k); ctx.arc(bx + ox * k, by + oy * k, r * k, 0, TAU); }
        ctx.fill();
        ctx.fillStyle = css([164, 104, 62], l);
        ctx.beginPath(); ctx.moveTo(bx - 4.6 * k, by - 2 * k); ctx.quadraticCurveTo(bx, by + 3.2 * k, bx + 4.6 * k, by - 2 * k); ctx.closePath(); ctx.fill();
      }
      // 白水：一只瓶、一只杯
      const jx = x + 15 * k, jy = g - 0.4 * k;
      ctx.fillStyle = css([196, 170, 130], l);
      ctx.beginPath();
      ctx.moveTo(jx - 2.4 * k, jy); ctx.quadraticCurveTo(jx - 4.4 * k, jy - 6 * k, jx - 1.3 * k, jy - 9.6 * k); ctx.lineTo(jx - 1.3 * k, jy - 12 * k);
      ctx.lineTo(jx + 1.3 * k, jy - 12 * k); ctx.lineTo(jx + 1.3 * k, jy - 9.6 * k); ctx.quadraticCurveTo(jx + 4.4 * k, jy - 6 * k, jx + 2.4 * k, jy); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(jx + 5 * k, jy); ctx.lineTo(jx + 4.4 * k, jy - 4 * k); ctx.lineTo(jx + 8.2 * k, jy - 4 * k); ctx.lineTo(jx + 7.6 * k, jy); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([190, 222, 240], l, 0.9, 0.2);
      ctx.fillRect(jx + 4.6 * k, jy - 4 * k, 3.4 * k, 0.9 * k);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：墙上的字（5:5）——指头在粉墙上写下发光的字：מנא מנא תקל ופרסין
  // ════════════════════════════════════════════════════════════
  const GL = {
    alef: [[[0.12, 0.1], [0.88, 0.92]], [[0.78, 0.1], [0.74, 0.38], [0.56, 0.48]], [[0.26, 0.92], [0.26, 0.62], [0.44, 0.52]]],
    mem: [[[0.1, 0.24], [0.26, 0.1], [0.9, 0.1], [0.9, 0.92], [0.5, 0.92]], [[0.34, 0.1], [0.16, 0.92]]],
    nun: [[[0.34, 0.1], [0.68, 0.1], [0.68, 0.92], [0.24, 0.92]]],
    tav: [[[0.1, 0.1], [0.9, 0.1], [0.9, 0.92]], [[0.3, 0.1], [0.3, 0.92], [0.14, 0.92]]],
    qof: [[[0.1, 0.1], [0.9, 0.1], [0.9, 0.58]], [[0.22, 0.36], [0.22, 1.18]]],
    lamed: [[[0.22, -0.34], [0.22, 0.26], [0.86, 0.26], [0.86, 0.6], [0.44, 0.94]]],
    vav: [[[0.28, 0.1], [0.6, 0.1], [0.6, 0.92]]],
    pe: [[[0.1, 0.1], [0.9, 0.1], [0.9, 0.92], [0.1, 0.92]], [[0.1, 0.1], [0.12, 0.44], [0.46, 0.44]]],
    resh: [[[0.1, 0.1], [0.84, 0.1], [0.88, 0.92]]],
    samekh: [[[0.1, 0.1], [0.9, 0.1], [0.9, 0.7], [0.62, 0.92], [0.1, 0.92], [0.1, 0.1]]],
    yod: [[[0.34, 0.1], [0.62, 0.1], [0.62, 0.42]]],
    nunF: [[[0.34, 0.1], [0.62, 0.1], [0.62, 1.3]]],
  };
  const LINES = [['mem', 'nun', 'alef', null, 'mem', 'nun', 'alef'], ['tav', 'qof', 'lamed', null, 'vav', 'pe', 'resh', 'samekh', 'yod', 'nunF']];
  // 所有笔画（像素），按书写的先后（右起），与总长
  function writingModel() {
    return cached('writing', () => {
      const Pn = panelRect(), strokes = [];
      const lw = Pn.x1 - Pn.x0, lh = Pn.y1 - Pn.y0;
      const cell = Math.min(lw / 11.2, lh / 2.9), gap = cell * 0.18;
      LINES.forEach((line, li) => {
        const tot = line.length * cell;
        let x = (Pn.x0 + Pn.x1) / 2 + tot / 2;
        const y = Pn.y0 + lh * (li === 0 ? 0.3 : 0.72) - cell * 0.42;
        for (const g of line) {
          x -= cell;
          if (!g) continue;
          for (const st of GL[g]) strokes.push(st.map(p => [x + gap / 2 + p[0] * (cell - gap), y + p[1] * cell * 0.84]));
        }
      });
      let total = 0;
      const lens = strokes.map(st => { let L = 0; for (let i = 1; i < st.length; i++) L += Math.hypot(st[i][0] - st[i - 1][0], st[i][1] - st[i - 1][1]); total += L; return L; });
      return { strokes, lens, total, cell };
    });
  }
  function drawWriting(ctx) {
    const a = lv('dnWrite');
    if (a < 0.01) return;
    const Wm = writingModel(), k = BK();
    const prog = clamp(lv('dnHand'), 0, 1) * Wm.total;
    const rd = lv('dnRead');
    let acc = 0, pen = null;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const path = new Path2D();
    for (let s = 0; s < Wm.strokes.length && acc < prog; s++) {
      const st = Wm.strokes[s];
      path.moveTo(st[0][0], st[0][1]);
      for (let i = 1; i < st.length; i++) {
        const L = Math.hypot(st[i][0] - st[i - 1][0], st[i][1] - st[i - 1][1]);
        if (acc + L <= prog) { path.lineTo(st[i][0], st[i][1]); acc += L; pen = st[i]; }
        else { const f = (prog - acc) / L; const p = [lerp(st[i - 1][0], st[i][0], f), lerp(st[i - 1][1], st[i][1], f)]; path.lineTo(p[0], p[1]); acc = prog; pen = p; break; }
      }
    }
    const col = mix([255, 214, 150], [255, 238, 190], rd);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(mix(col, [255, 120, 60], 0.3), 1);
    ctx.globalAlpha = a * (0.35 + 0.25 * rd);
    ctx.lineWidth = Math.max(1.6, Wm.cell * 0.28);
    ctx.stroke(path);
    ctx.strokeStyle = rgba(col, 1);
    ctx.globalAlpha = a * (0.9 + 0.1 * Math.sin(W.t * 3));
    ctx.lineWidth = Math.max(0.8, Wm.cell * 0.1);
    ctx.stroke(path);
    if (SP && rd > 0.02) { const Pn = panelRect(); glowAt(ctx, SP.gold, (Pn.x0 + Pn.x1) / 2, (Pn.y0 + Pn.y1) / 2, (Pn.x1 - Pn.x0) * 0.75, rd * a * 0.5, 0.6); }
    // 写字的指头：四道淡淡的光
    const h = lv('dnHand');
    if (pen && h > 0.001 && h < 0.999 && SP) {
      const px = pen[0], py = pen[1], u = Math.max(0.8, Wm.cell / 4.2);
      glowAt(ctx, SP.white, px, py, 12 * u, 0.6 * a);
      ctx.fillStyle = 'rgb(255,244,226)';
      for (let i = 0; i < 4; i++) {
        ctx.globalAlpha = a * (0.35 + 0.1 * i);
        ctx.beginPath(); ctx.ellipse(px + (1.4 + i * 1.3) * u, py - (2 + 4.2 - Math.abs(i - 1.3) * 1.1) * u, 0.75 * u, (3.4 - Math.abs(i - 1.3) * 0.4) * u, -0.25, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = a * 0.25;
      ctx.beginPath(); ctx.ellipse(px + 4.2 * u, py - 0.5 * u, 4.4 * u, 2.2 * u, -0.2, 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 天平（5:27）：在王的头上，王那一边的盘升起
  function drawScale(ctx) {
    const a = lv('dnScale');
    if (a < 0.01) return;
    const P_ = X(), k = BK(), x = P_.throne * W.w - 12 * k, y = palGeom().top - 26 * k;
    const tilt = 0.32 * smoothstep(0.3, 1, a);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a;
    ctx.strokeStyle = 'rgb(255,222,150)'; ctx.fillStyle = 'rgb(255,222,150)';
    ctx.lineWidth = Math.max(0.8, 1.3 * k);
    ctx.beginPath(); ctx.moveTo(x, y + 26 * k); ctx.lineTo(x, y - 2 * k); ctx.stroke();
    const L = 18 * k, dx = Math.cos(tilt) * L, dy = Math.sin(tilt) * L;
    const ax = x - dx, ay = y + dy, bx = x + dx, by = y - dy;
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
    for (const [px, py] of [[ax, ay], [bx, by]]) {
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 5 * k, py + 12 * k); ctx.moveTo(px, py); ctx.lineTo(px + 5 * k, py + 12 * k); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(px, py + 12.5 * k, 6 * k, 1.8 * k, 0, 0, Math.PI); ctx.fill();
    }
    if (SP) glowAt(ctx, SP.gold, x, y + 6 * k, 30 * k, a * 0.35);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：杜拉平原上的金像（3:1）——高六十肘，宽六肘
  // ════════════════════════════════════════════════════════════
  function drawGoldImage(ctx) {
    const a = lv('dnGold');
    if (a < 0.01) return;
    const P_ = X(), k = BK(), x = P_.image * W.w, g = gY(2, P_.image) + 1.5 * k, l = 2;
    const rise = (1 - smoothstep(0, 0.8, a)) * 30 * k;
    const Hs = (port() ? 250 : 272) * k;
    ctx.save();
    ctx.globalAlpha = a;
    // 台
    ctx.fillStyle = css([186, 156, 112], l);
    ctx.fillRect(x - 22 * k, g - 8 * k, 44 * k, 8 * k + 1);
    ctx.fillRect(x - 17 * k, g - 16 * k, 34 * k, 8 * k);
    ctx.fillStyle = css(GLAZE, l, 1, 0.03);
    ctx.fillRect(x - 13 * k, g - 26 * k, 26 * k, 10 * k);
    ctx.fillStyle = css(YEL, l, 0.9, 0.1);
    ctx.fillRect(x - 13 * k, g - 22 * k, 26 * k, 1.2 * k);
    // 像
    const b = g - 26 * k + rise, t = b - Hs;
    const d = litX() >= x ? 1 : -1;
    const P = (u, v) => [x + u * Hs, t + v * Hs];
    const body = () => {
      ctx.beginPath();
      const pts = [[-0.044, 1], [-0.035, 0.62], [-0.05, 0.4], [-0.058, 0.3], [-0.05, 0.27], [-0.016, 0.255], [-0.016, 0.21], [-0.022, 0.2],
        [-0.024, 0.12], [-0.018, 0.1], [-0.02, 0.04], [-0.008, 0.0], [0.008, 0.0], [0.02, 0.04], [0.018, 0.1], [0.024, 0.12], [0.022, 0.2],
        [0.016, 0.21], [0.016, 0.255], [0.05, 0.27], [0.058, 0.3], [0.05, 0.4], [0.035, 0.62], [0.044, 1]];
      pts.forEach((q, i) => { const p = P(q[0], q[1]); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.closePath();
    };
    const gold = W.shade([236, 188, 80], 0, 0.12 + 0.1 * a);
    const gr = ctx.createLinearGradient(x - 0.06 * Hs, 0, x + 0.06 * Hs, 0);
    const hi = W.shade([255, 232, 150], 0, 0.3), lo = W.shade([150, 100, 34], 0, 0.02);
    gr.addColorStop(0, U.rgb(...(d > 0 ? lo : hi))); gr.addColorStop(0.5, U.rgb(gold[0], gold[1], gold[2])); gr.addColorStop(1, U.rgb(...(d > 0 ? hi : lo)));
    ctx.fillStyle = gr;
    body(); ctx.fill();
    // 双手合在胸前、袍的褶、冠上的角
    ctx.strokeStyle = U.rgba(lo[0], lo[1], lo[2], 0.6); ctx.lineWidth = Math.max(0.6, 0.9 * k);
    ctx.beginPath();
    let p = P(-0.05, 0.3), q = P(0, 0.36), r = P(0.05, 0.3);
    ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(q[0], q[1] + 0.02 * Hs, r[0], r[1]);
    for (const u of [-0.02, 0, 0.02]) { p = P(u * 0.9, 0.45); q = P(u * 1.3, 0.98); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); }
    ctx.stroke();
    ctx.fillStyle = U.rgb(...W.shade([244, 204, 110], 0, 0.2));
    p = P(0, -0.035); q = P(-0.014, 0.012); r = P(0.014, 0.012);
    ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.closePath(); ctx.fill();
    // 日光下的一道亮与闪烁
    ctx.globalCompositeOperation = 'lighter';
    const sweep = U.fract(W.t * 0.12);
    const sy = t + sweep * Hs * 1.2 - 0.1 * Hs;
    const sg = ctx.createLinearGradient(0, sy - 0.08 * Hs, 0, sy + 0.08 * Hs);
    sg.addColorStop(0, 'rgba(255,240,200,0)'); sg.addColorStop(0.5, 'rgba(255,240,200,' + (0.35 * W.daylight * a).toFixed(3) + ')'); sg.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = sg;
    body(); ctx.fill();
    if (SP) {
      glowAt(ctx, SP.gold, x, t + 0.3 * Hs, 0.45 * Hs, a * (0.18 + 0.12 * W.daylight));
      for (let i = 0; i < 5; i++) {
        const ph = U.fract(W.t * 0.3 + i * 0.23);
        const px = x + (hsh(i * 3.7) - 0.5) * 0.08 * Hs, py = t + hsh(i * 5.3) * 0.9 * Hs;
        glowAt(ctx, SP.white, px, py, 6 * k * Math.sin(Math.PI * ph), a * W.daylight * 0.8);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：烈火的窑（3:6–27）——窑身在人之后，窑口的火在人之前
  // ════════════════════════════════════════════════════════════
  function furnGeom() {
    return cached('furn', () => {
      const P_ = X(), k = BK(), x = P_.furn * W.w;
      const g = groundMax((x - 50 * k) / W.w, (x + 50 * k) / W.w, 4) + 2 * k;
      return { k, x, g, hw: 50 * k, H: 86 * k, mw: 34 * k, mh: 58 * k };
    });
  }
  function mouthPath(ctx, F) {
    ctx.beginPath();
    ctx.moveTo(F.x - F.mw, F.g);
    ctx.lineTo(F.x - F.mw, F.g - F.mh * 0.66);
    ctx.quadraticCurveTo(F.x - F.mw, F.g - F.mh, F.x, F.g - F.mh);
    ctx.quadraticCurveTo(F.x + F.mw, F.g - F.mh, F.x + F.mw, F.g - F.mh * 0.66);
    ctx.lineTo(F.x + F.mw, F.g);
    ctx.closePath();
  }
  function drawFurnace(ctx) {
    const a = lv('dnFurnace');
    if (a < 0.01) return;
    const F = furnGeom(), k = F.k, l = 2, heat = lv('dnHeat');
    ctx.save();
    ctx.globalAlpha = a;
    // 窑身
    ctx.fillStyle = css([150, 110, 78], l);
    ctx.beginPath();
    ctx.moveTo(F.x - F.hw, F.g + 2 * k);
    ctx.lineTo(F.x - F.hw * 0.9, F.g - F.H * 0.62);
    ctx.quadraticCurveTo(F.x - F.hw * 0.72, F.g - F.H, F.x - 9 * k, F.g - F.H);
    ctx.lineTo(F.x - 9 * k, F.g - F.H - 14 * k); ctx.lineTo(F.x + 9 * k, F.g - F.H - 14 * k); ctx.lineTo(F.x + 9 * k, F.g - F.H);
    ctx.quadraticCurveTo(F.x + F.hw * 0.72, F.g - F.H, F.x + F.hw * 0.9, F.g - F.H * 0.62);
    ctx.lineTo(F.x + F.hw, F.g + 2 * k);
    ctx.closePath(); ctx.fill();
    // 砖缝与受热的红
    ctx.strokeStyle = css([110, 76, 52], l, 0.5); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    for (let yy = F.g - 6 * k; yy > F.g - F.H; yy -= 6 * k) { const f = 1 - Math.pow((F.g - yy) / F.H, 3) * 0.3; ctx.moveTo(F.x - F.hw * 0.9 * f, yy); ctx.lineTo(F.x + F.hw * 0.9 * f, yy); }
    ctx.stroke();
    if (heat > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.fire, F.x, F.g - F.H * 0.5, F.hw * 1.1, heat * a * 0.35);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 窑口里的火
    ctx.save();
    mouthPath(ctx, F); ctx.clip();
    const gr = ctx.createLinearGradient(0, F.g, 0, F.g - F.mh);
    const hk = 0.25 + 0.75 * heat;
    gr.addColorStop(0, rgba([255, 236, 170], hk));
    gr.addColorStop(0.45, rgba([255, 150, 50], hk));
    gr.addColorStop(1, rgba([150, 40, 20], 0.6 + 0.4 * hk));
    ctx.fillStyle = 'rgb(30,12,8)';
    ctx.fillRect(F.x - F.mw, F.g - F.mh, F.mw * 2, F.mh + 2);
    ctx.fillStyle = gr;
    ctx.fillRect(F.x - F.mw, F.g - F.mh, F.mw * 2, F.mh + 2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,170,70,0.55)';
    ctx.beginPath();
    for (let i = 0; i < 11; i++) {
      const fx0 = F.x - F.mw + (i + 0.5) * (F.mw * 2 / 11);
      tongue(ctx, fx0, F.g + 1, F.mw * 0.16, F.mh * (0.4 + 0.5 * heat) * (0.75 + 0.25 * Math.sin(W.t * 6 + i * 1.7)), W.t * 5 + i * 2.1);
    }
    ctx.fill();
    const fo = lv('dnFourth');
    if (fo > 0.02 && SP) {
      const f4 = fig('fourth'), fx4 = f4 ? f4.nx * W.w : F.x;
      glowAt(ctx, SP.white, fx4, F.g - F.mh * 0.4, F.mw * 0.9, fo * 0.7);
      glowAt(ctx, SP.gold, fx4, F.g - F.mh * 0.55, F.mw * 0.5, fo * 0.6);
    }
    ctx.restore();
    // 窑口的拱
    ctx.strokeStyle = css([120, 84, 58], l); ctx.lineWidth = Math.max(1, 3 * k);
    mouthPath(ctx, F); ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([255, 232, 200], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath(); ctx.moveTo(F.x - F.hw * 0.72, F.g - F.H); ctx.lineTo(F.x + F.hw * 0.72, F.g - F.H); ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawFurnaceFront(ctx) {
    const a = lv('dnFurnace'), heat = lv('dnHeat');
    if (a < 0.01 || heat < 0.02) return;
    const F = furnGeom(), k = F.k;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a;
    // 窑口前低低的火舌（在人之前）
    ctx.save();
    mouthPath(ctx, F); ctx.clip();
    ctx.fillStyle = 'rgba(255,190,90,' + (0.35 * heat).toFixed(3) + ')';
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const fx0 = F.x - F.mw + (i + 0.5) * (F.mw * 2 / 9);
      tongue(ctx, fx0, F.g + 2, F.mw * 0.14, F.mh * 0.28 * heat * (0.7 + 0.3 * Math.sin(W.t * 7 + i * 2.3)), W.t * 6 + i * 1.3);
    }
    ctx.fill();
    ctx.fillStyle = 'rgba(255,140,60,' + (0.16 * heat).toFixed(3) + ')';
    ctx.fillRect(F.x - F.mw, F.g - F.mh, F.mw * 2, F.mh);
    ctx.restore();
    // 七倍的热：火从窑口与烟囱喷出
    const hot = smoothstep(0.55, 1, heat);
    if (hot > 0.01) {
      ctx.fillStyle = 'rgba(255,150,60,' + (0.55 * hot).toFixed(3) + ')';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) tongue(ctx, F.x + (i - 2) * 3.4 * k, F.g - F.H - 13 * k, 3.5 * k, (18 + 12 * Math.sin(W.t * 5 + i)) * k * hot, W.t * 6 + i);
      for (let i = 0; i < 6; i++) tongue(ctx, F.x + (i - 2.5) * F.mw * 0.34, F.g - F.mh * 0.8, F.mw * 0.16, (10 + 8 * Math.sin(W.t * 6 + i * 1.9)) * k * hot, W.t * 7 + i * 2);
      ctx.fill();
      if (SP) glowAt(ctx, SP.fire, F.x, F.g - F.H, F.hw * 1.2, hot * 0.4);
      // 火星
      ctx.fillStyle = 'rgb(255,210,140)';
      for (let i = 0; i < 16; i++) {
        const ph = U.fract(W.t * 0.4 + hsh(i * 2.7));
        ctx.globalAlpha = hot * (1 - ph) * a;
        ctx.fillRect(F.x + (hsh(i * 4.1) - 0.5) * 30 * k + Math.sin(W.t * 2 + i) * 4 * k, F.g - F.H - 14 * k - ph * 60 * k, 1.4, 1.4);
      }
    }
    if (SP) glowAt(ctx, SP.warm, F.x, F.g - 4 * k, F.hw * 1.7, heat * a * 0.25 * (0.5 + 0.5 * nightK()), 0.35);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：地当中的大树（4:10–15）——长大、高得顶天；伐倒；树墩与铁圈铜圈
  // ════════════════════════════════════════════════════════════
  function treeModel() {
    return cached('tree', () => {
      const rng = U.mulberry32(4101);
      const br = [], leaves = [], fruit = [], perch = [];
      function branch(x, y, ang, len, w, depth) {
        const x1 = x + Math.cos(ang) * len, y1 = y + Math.sin(ang) * len;
        br.push([x, y, x1, y1, w]);
        if (depth >= 4 || len < 0.06) {
          for (let i = 0; i < 3; i++) leaves.push([x1 + (rng() - 0.5) * 0.12, y1 + (rng() - 0.3) * 0.08, 0.06 + rng() * 0.05, (rng() * 3) | 0]);
          if (rng() < 0.7) fruit.push([x1 + (rng() - 0.5) * 0.1, y1 + (rng() - 0.5) * 0.06]);
          if (rng() < 0.4) perch.push([x1, y1 + 0.01]);
          return;
        }
        const n = depth === 0 ? 4 : 2 + (rng() < 0.5 ? 1 : 0);
        for (let i = 0; i < n; i++) {
          const spread = depth === 0 ? 1.5 : 1.0;
          const a = ang + (n > 1 ? (i / (n - 1) - 0.5) * spread : 0) + (rng() - 0.5) * 0.3;
          branch(x1, y1, a, len * (0.62 + rng() * 0.16), w * 0.62, depth + 1);
        }
      }
      // 主干：y 向上为正（0 地面 → 1 树梢）
      br.push([0, 0, 0, 0.36, 0.05]);
      branch(0, 0.36, Math.PI / 2, 0.22, 0.036, 0);
      // 叶团填满树冠
      for (let i = 0; i < 26; i++) {
        const a = rng() * TAU, r = Math.sqrt(rng());
        leaves.push([Math.cos(a) * r * 0.36, 0.68 + Math.sin(a) * r * 0.22, 0.07 + rng() * 0.05, (rng() * 3) | 0]);
      }
      leaves.sort((p, q) => p[3] - q[3]);
      return { br, leaves, fruit, perch };
    });
  }
  function treeFrame() {
    const P_ = X(), x = P_.tree * W.w, g = gY(2, P_.tree) + 2 * BK();
    const Hmax = port() ? Math.min(g - W.h * 0.45, W.h * 0.45) : g - W.h * 0.15;
    const asp = port() ? 0.8 : 1.0;
    return { x, g, Hmax, asp };
  }
  function drawTree(ctx) {
    const gr0 = lv('dnTree'), fell = lv('dnFell');
    const stump = lv('dnStump');
    const TF = treeFrame(), k = BK(), l = 2;
    if (gr0 > 0.005 && fell < 0.999) {
      const Tm = treeModel();
      const grow = eOut(clamp(gr0, 0, 1));
      const Hh = TF.Hmax * (0.12 + 0.88 * grow), Wd = Hh * TF.asp;
      const ang = fell > 0 ? -Math.pow(clamp(fell / 0.45, 0, 1), 2) * 1.3 : 0;
      const al = 1 - smoothstep(0.3, 0.8, fell);
      const cut = 0.035;
      ctx.save();
      ctx.globalAlpha = al;
      ctx.translate(TF.x, TF.g - cut * Hh * (fell > 0 ? 1 : 0));
      ctx.rotate(ang);
      const X_ = u => u * Wd, Y_ = v => -v * Hh;
      const d = litX() >= TF.x ? 1 : -1;
      // 枝
      ctx.strokeStyle = css([70, 50, 36], l); ctx.lineCap = 'round';
      for (const b of Tm.br) {
        ctx.lineWidth = Math.max(0.8, b[4] * Wd * (0.5 + 0.5 * grow));
        ctx.beginPath(); ctx.moveTo(X_(b[0]), Y_(fell > 0 && b[1] < cut ? cut : b[1])); ctx.lineTo(X_(b[2]), Y_(b[3])); ctx.stroke();
      }
      // 叶团：三种绿
      const la = smoothstep(0.1, 0.6, grow);
      const LC = [[46, 82, 44], [62, 104, 52], [84, 128, 64]];
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = css(LC[c], l, la, 0.02 * c);
        ctx.beginPath();
        for (const q of Tm.leaves) if (q[3] === c) { const r = q[2] * Wd * (0.6 + 0.4 * grow); ctx.moveTo(X_(q[0]) + r, Y_(q[1])); ctx.arc(X_(q[0]), Y_(q[1]), r, 0, TAU); }
        ctx.fill();
      }
      // 迎光的叶
      ctx.fillStyle = css([150, 180, 96], l, la * 0.35 * dayA(), 0.1);
      ctx.beginPath();
      for (const q of Tm.leaves) if (q[3] === 2) { const r = q[2] * Wd * 0.5; ctx.moveTo(X_(q[0]) + d * r * 0.6 + r, Y_(q[1]) - r * 0.5); ctx.arc(X_(q[0]) + d * r * 0.6, Y_(q[1]) - r * 0.5, r, 0, TAU); }
      ctx.fill();
      // 果子
      ctx.fillStyle = css([226, 120, 60], l, la * smoothstep(0.6, 1, grow), 0.1);
      ctx.beginPath();
      for (const f of Tm.fruit) { const r = Math.max(0.8, 0.008 * Wd); ctx.moveTo(X_(f[0]) + r, Y_(f[1])); ctx.arc(X_(f[0]), Y_(f[1]), r, 0, TAU); }
      ctx.fill();
      // 宿在枝上的飞鸟
      const bd = lv('dnBirds') * (1 - smoothstep(0, 0.1, fell));
      if (bd > 0.02) {
        ctx.fillStyle = css([34, 30, 34], l, bd);
        ctx.beginPath();
        Tm.perch.forEach((p, i) => {
          if (i % 2) return;
          const bx = X_(p[0]), by = Y_(p[1]), s = Math.max(1, 2.2 * k), bob = Math.sin(W.t * 2 + i) * 0.4 * s;
          ctx.moveTo(bx + 2 * s, by - 1.4 * s + bob); ctx.ellipse(bx, by - 1.4 * s + bob, 2 * s, 1.2 * s, 0, 0, TAU);
          ctx.moveTo(bx + 2.8 * s, by - 2.6 * s + bob); ctx.arc(bx + 1.8 * s, by - 2.6 * s + bob, 0.9 * s, 0, TAU);
        });
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    // 树墩：铁圈、铜圈（4:15）
    const showStump = Math.max(stump, fell > 0.02 ? 1 : 0) * (gr0 > 0.3 || stump > 0.01 ? 1 : 0);
    if (showStump > 0.01) {
      const sw = 0.05 * TF.Hmax * TF.asp * 0.85, sh = 0.035 * TF.Hmax + 4 * k;
      ctx.globalAlpha = Math.max(stump, fell > 0.02 ? 1 : 0);
      ctx.fillStyle = css([88, 64, 44], l);
      ctx.beginPath(); ctx.moveTo(TF.x - sw * 0.75, TF.g + 1); ctx.lineTo(TF.x - sw * 0.5, TF.g - sh); ctx.lineTo(TF.x + sw * 0.5, TF.g - sh); ctx.lineTo(TF.x + sw * 0.75, TF.g + 1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([196, 164, 118], l);
      ctx.beginPath(); ctx.ellipse(TF.x, TF.g - sh, sw * 0.5, Math.max(1, 1.8 * k), 0, 0, TAU); ctx.fill();
      if (stump > 0.02) {
        ctx.globalAlpha = stump;
        ctx.fillStyle = css([96, 100, 112], l, 1, 0.1);
        ctx.fillRect(TF.x - sw * 0.6, TF.g - sh * 0.72, sw * 1.2, Math.max(1.2, 2.4 * k));
        ctx.fillStyle = css([196, 126, 64], l, 1, 0.15);
        ctx.fillRect(TF.x - sw * 0.66, TF.g - sh * 0.34, sw * 1.32, Math.max(1.2, 2.4 * k));
        if (SP) {
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, SP.gold, TF.x + sw * 0.3, TF.g - sh * 0.34, 6 * k * (0.7 + 0.3 * Math.sin(W.t * 1.4)), stump * 0.4);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      // 嫩芽（4:26）
      const sp = lv('dnShoot');
      if (sp > 0.02) {
        ctx.globalAlpha = sp;
        ctx.strokeStyle = css([110, 170, 80], l, 1, 0.15); ctx.lineWidth = Math.max(0.8, 1.2 * k);
        const sx = TF.x + sw * 0.1, sy = TF.g - sh, hh = 11 * k * sp;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + 2 * k, sy - hh * 0.6, sx + 1 * k, sy - hh); ctx.stroke();
        ctx.fillStyle = css([130, 196, 90], l, 1, 0.2);
        ctx.beginPath(); ctx.ellipse(sx + 3 * k, sy - hh * 0.8, 2.6 * k * sp, 1.2 * k, -0.5, 0, TAU); ctx.ellipse(sx - 1 * k, sy - hh * 0.6, 2.2 * k * sp, 1 * k, 0.6, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // 天露
    const dw = lv('dnDew');
    if (dw > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(220,236,255)';
      for (let i = 0; i < 26; i++) {
        const xf = lerp(TF.x - 0.14 * W.w, TF.x + 0.14 * W.w, hsh(i * 3.9)), v = hsh(i * 7.3) * 0.5;
        const y = fieldY(xf / W.w, v) - 1 * k, tw = 0.5 + 0.5 * Math.sin(W.t * 2.3 + i * 1.7);
        ctx.globalAlpha = dw * tw * (0.4 + 0.5 * (1 - W.daylight * 0.6));
        ctx.fillRect(xf - 0.8, y - 0.8, 1.6, 1.6);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：狮子坑（6:16–24）——地下的一个坑，坑口一块石头，封着王的玺
  // ════════════════════════════════════════════════════════════
  // 坑：宽而浅的一个洞，横在近岸的地下；洞底离画面的下边留出一段；井口很短（在洞的左上）
  const DAN_DX = -0.36, ANGEL_DX = -0.17;
  const fieldDX = p => (p ? 0.045 : 0.03);          // 王在田野里吃草之处（大树墩的右边，离开树墩）          // 但以理与使者在坑中的位置（坑宽的比例）
  function denGeom() {
    return cached('den', () => {
      const P_ = X(), k = BK(), p = port(), x = P_.den * W.w, g = gY(2, P_.den);
      const w = (p ? 0.38 : 0.25) * W.w;
      const top = g + 5 * k, bot = Math.max(top + 46 * k, W.h - 24 * k);
      const pts = [], N = 36;
      for (let i = 0; i < N; i++) {
        const a = (i / N) * TAU, c = Math.cos(a), s = Math.sin(a);
        const n = 1 + 0.045 * Math.sin(a * 5 + 1.3) + 0.03 * Math.sin(a * 9 + 0.4);
        const cx = Math.sign(c) * Math.pow(Math.abs(c), 0.55), sy = Math.sign(s) * Math.pow(Math.abs(s), s > 0 ? 0.3 : 0.7);
        const y = (top + bot) / 2 + sy * (bot - top) / 2 * (s > 0 ? 1 : n);
        pts.push([x + cx * w / 2 * (s > 0 ? 1 : n), clamp(y, top, bot)]);
      }
      const cave = new Path2D();
      pts.forEach((q, i) => (i ? cave.lineTo(q[0], q[1]) : cave.moveTo(q[0], q[1])));
      cave.closePath();
      const mxp = x - 0.012 * W.w;                 // 井口（石头封在这里）
      const shaft = new Path2D();
      shaft.rect(mxp - 6 * k, g + 1 * k, 12 * k, top - g + 3 * k);
      return { k, x, g, w, top, bot, floor: bot - 5 * k, cave, shaft, mx: mxp };
    });
  }
  // 下到坑底：先顺着井口下去，再走到坑里的那一处（dnLower 0 地面 → 1 坑底）
  function denAt(dx) {
    return () => {
      const D = denGeom(), l = lv('dnLower');
      return [lerp(D.mx, D.x + dx * D.w, smoothstep(0.4, 1, l)), lerp(D.g, D.floor, smoothstep(0, 0.65, l))];
    };
  }
  function denFloor(dx) { return () => { const D = denGeom(); return [D.x + dx * D.w, D.floor]; }; }
  // 狮子：侧影（朝右，单位约为身长的四十分之一；脚下 y = 0）。lie 0 站着 / 走着 → 1 卧下：头枕在伸出的前爪上
  function drawLion(ctx, x, y, s, d, lie, ph, a, calm, lit) {
    const lk = clamp(lit || 0, 0, 1), L = 1 - lie, up = 8.5 * L;
    const bodyC = rgba(mix(W.shade([190, 142, 82], 0, 0.05), [226, 164, 92], lk), 1);
    const farC = rgba(mix(W.shade([146, 104, 60], 0, 0.03), [172, 114, 60], lk), 1);
    const maneC = rgba(mix(W.shade([108, 70, 40], 0, 0.02), [128, 76, 38], lk), 1);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(d * s, s);
    ctx.globalAlpha = a;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // 脚下的影
    ctx.fillStyle = 'rgba(16,10,6,0.3)';
    ctx.beginPath(); ctx.ellipse(2 + 4 * lie, 0.3, 15 + 4 * lie, 1.5, 0, 0, TAU); ctx.fill();
    const sw = calm < 0.5 ? Math.sin(ph) * 2.2 * L : 0;
    // 远侧的腿
    if (up > 0.4) {
      ctx.strokeStyle = farC; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-8.6, -up - 2); ctx.lineTo(-8.8 - sw, -0.9); ctx.moveTo(7.2, -up - 2); ctx.lineTo(7.6 + sw, -0.9); ctx.stroke();
    }
    const ext = 12.5 * lie;
    if (ext > 0.3) {
      ctx.strokeStyle = farC; ctx.lineWidth = 2.3;
      ctx.beginPath(); ctx.moveTo(8.2, -up - 2.8); ctx.lineTo(8.8 + ext, -2.1); ctx.stroke();
    }
    // 尾：站着时垂在身后摆动；卧下时顺着地，梢上一簇鬃
    const ts = calm < 0.5 ? Math.sin(W.t * 1.3 + x * 0.01) * 1.4 : 0;
    const tex = lerp(-20.5, -22, lie), tey = lerp(-up - 1.6 + ts * 0.4, -1.2, lie);
    ctx.strokeStyle = bodyC; ctx.lineWidth = 1.15;
    ctx.beginPath(); ctx.moveTo(-12, lerp(-up - 7.2, -2.4, lie));
    ctx.quadraticCurveTo(lerp(-18.5, -17, lie), lerp(-up - 7.5 + ts, -0.3, lie), tex, tey);
    ctx.stroke();
    ctx.fillStyle = maneC;
    ctx.beginPath(); ctx.ellipse(tex - 0.5, tey - 0.2, 1.6, 1.05, 0.5, 0, TAU); ctx.fill();
    // 身
    ctx.fillStyle = bodyC;
    ctx.beginPath();
    ctx.moveTo(-12.4, -up - 1.2);
    ctx.bezierCurveTo(-14.8, -up - 4, -13.6, -up - 9.4, -8.2, -up - 9.9);
    ctx.bezierCurveTo(-3.6, -up - 10.3, 1.8, -up - 8.7, 6, -up - 9.4);
    ctx.bezierCurveTo(9, -up - 10, 11.2, -up - 8.8, 11.8, -up - 6.4);
    ctx.bezierCurveTo(12.2, -up - 3.6, 11, -up - 1.2, 8.6, -up - 0.4 - 0.4 * L);
    ctx.bezierCurveTo(3, -up + 0.3 * lie - 1.2 * L, -5, -up + 0.2 * lie - 1.6 * L, -12.4, -up - 1.2);
    ctx.closePath(); ctx.fill();
    // 卧下时后腿收在身下：大腿前缘一道浅浅的折痕（不画闭合的圈）
    if (lie > 0.05) {
      ctx.globalAlpha = a * lie * 0.7;
      ctx.strokeStyle = farC; ctx.lineWidth = 0.75;
      ctx.beginPath(); ctx.arc(-8.4, -4.4, 4.8, -0.95, 1.05); ctx.stroke();
      ctx.globalAlpha = a;
    }
    // 近侧的腿 / 伸出的前爪
    if (up > 0.4) {
      ctx.strokeStyle = bodyC; ctx.lineWidth = 2.7;
      ctx.beginPath(); ctx.moveTo(-5.8, -up - 2); ctx.lineTo(-6 + sw, -0.9); ctx.moveTo(9.4, -up - 2); ctx.lineTo(9.9 - sw, -0.9); ctx.stroke();
    }
    if (ext > 0.3) {
      ctx.strokeStyle = bodyC; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(8.8, -up - 1.8); ctx.lineTo(9.4 + ext, -1.2); ctx.stroke();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); ctx.ellipse(10.2 + ext, -1.1, 1.9, 1.25, 0, 0, TAU); ctx.fill();
    }
    // 头：站着时与背齐平、朝前；卧下时下巴枕在前爪上
    const hx = lerp(15.4, 18.6, lie), hy = lerp(-17.3, -5.5, lie);
    // 鬃：头后与颈上的一弯（不包住脸）
    ctx.fillStyle = maneC;
    ctx.beginPath();
    ctx.moveTo(hx + 0.2, hy - 3.1);
    ctx.quadraticCurveTo(hx - 3.2, hy - 6.8, hx - 6.8, hy - 4.2);
    ctx.quadraticCurveTo(hx - 9.2, hy - 1.2, hx - 7.4, hy + 2.4);
    ctx.quadraticCurveTo(hx - 5.8, hy + 5.1 + 0.9 * L, hx - 2.6, hy + 4.5 + 0.9 * L);
    ctx.quadraticCurveTo(hx - 1, hy + 2.4, hx - 1.2, hy + 0.4);
    ctx.quadraticCurveTo(hx - 2.4, hy - 1.6, hx + 0.2, hy - 3.1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); ctx.arc(hx - 1.5, hy - 3.5, 1.05, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx, hy, 3.7, 3.2, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 3.3, hy + 1.2, 2.6, 1.95, 0.08, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(46,28,20,0.9)';
    ctx.beginPath(); ctx.ellipse(hx + 5.7, hy + 0.5, 0.8, 0.6, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(46,28,20,0.75)'; ctx.lineWidth = 0.45;
    ctx.beginPath(); ctx.moveTo(hx + 1.1, hy - 0.9); ctx.lineTo(hx + 2.5, hy - 0.6); ctx.stroke();
    // 口未被封住时：张开
    if (calm < 0.5) {
      const o = 0.5 + 0.5 * Math.abs(Math.sin(W.t * 1.6 + x * 0.01));
      ctx.fillStyle = 'rgb(40,20,16)';
      ctx.beginPath(); ctx.moveTo(hx + 5.9, hy + 1.9); ctx.lineTo(hx + 2.4, hy + 2.3); ctx.lineTo(hx + 5.3, hy + 2 + 1.9 * o); ctx.closePath(); ctx.fill();
    }
    // 迎着使者之光：只在背脊与鬃顶上一道亮边
    if (lk > 0.05) {
      ctx.strokeStyle = rgba([255, 232, 180], 0.85 * lk); ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-13.6, -up - 6);
      ctx.bezierCurveTo(-12.8, -up - 8.9, -10.6, -up - 9.8, -8.2, -up - 9.9);
      ctx.bezierCurveTo(-3.6, -up - 10.3, 1.8, -up - 8.7, 6, -up - 9.4);
      ctx.moveTo(hx + 0.2, hy - 3.1); ctx.quadraticCurveTo(hx - 3.2, hy - 6.8, hx - 6.8, hy - 4.2);
      ctx.stroke();
    }
    ctx.restore();
  }
  // [在坑宽中的位置, 朝向, 大小, 在后面]
  const LIONS = [[0.17, -1, 0.8, 1], [0.03, -1, 1, 0], [0.31, -1, 0.94, 0]];
  function drawDen(ctx) {
    const a = lv('dnDen');
    if (a < 0.01) return;
    const D = denGeom(), k = D.k, l = 2;
    const al = lv('dnAngelL'), cy = (D.top + D.bot) / 2;
    ctx.save();
    ctx.globalAlpha = a;
    // 坑边翻过的土：比洞稍大的一圈
    ctx.save();
    ctx.translate(D.x, cy); ctx.scale(1.06, 1.16); ctx.translate(-D.x, -cy);
    ctx.fillStyle = css([92, 70, 48], l, 0.55);
    ctx.fill(D.cave);
    ctx.restore();
    // 井口与洞
    ctx.fillStyle = css([22, 16, 13], l);
    ctx.fill(D.shaft);
    ctx.beginPath(); ctx.ellipse(D.mx, D.g + 2.5 * k, 8 * k, 2.4 * k, 0, 0, TAU); ctx.fill();
    ctx.fill(D.cave);
    ctx.save();
    ctx.clip(D.cave);
    // 洞里：未有使者时暗；使者的光由他所站之处向外渐暗
    const ax = D.x + ANGEL_DX * D.w, ay = D.floor - 26 * k;
    if (al < 0.99) {
      const cg = cached('denDark', () => { const g = ctx.createLinearGradient(0, D.top, 0, D.bot); g.addColorStop(0, 'rgba(70,50,36,0.5)'); g.addColorStop(1, 'rgba(20,14,12,0)'); return g; });
      ctx.globalAlpha = a * (1 - al);
      ctx.fillStyle = cg; ctx.fillRect(D.x - D.w, D.top, D.w * 2, D.bot - D.top);
    }
    if (al > 0.01) {
      const rg = cached('denLight', () => {
        const g = ctx.createRadialGradient(ax, ay, 0, ax, ay, D.w * 0.66);
        g.addColorStop(0, 'rgba(255,226,168,0.95)'); g.addColorStop(0.32, 'rgba(222,160,92,0.8)');
        g.addColorStop(0.72, 'rgba(112,72,42,0.62)'); g.addColorStop(1, 'rgba(46,30,20,0.5)');
        return g;
      });
      ctx.globalAlpha = a * al;
      ctx.fillStyle = rg; ctx.fillRect(D.x - D.w, D.top - 4, D.w * 2, D.bot - D.top + 8);
    }
    ctx.globalAlpha = a;
    // 石壁上的暗块：只在洞的上半
    ctx.fillStyle = 'rgba(18,12,10,0.28)';
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const ang = Math.PI * (1.06 + 0.88 * (i + 0.5) / 9), rx = D.w * 0.5 * (0.9 + 0.08 * hsh(i * 2.1)), ry = (D.bot - D.top) * 0.5;
      const x = D.x + Math.cos(ang) * rx, y = cy + Math.sin(ang) * ry, r = (5 + 5 * hsh(i * 3.7)) * k;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.6, ang, 0, TAU);
    }
    ctx.fill();
    // 洞底：平而净；使者的光照在上面
    ctx.fillStyle = al > 0.01 ? rgba(mix([48, 34, 24], [150, 104, 60], al), 1) : css([50, 36, 26], l);
    ctx.fillRect(D.x - D.w, D.floor - 1, D.w * 2, D.bot - D.floor + 12);
    if (SP && al > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, ax + 0.14 * D.w, D.floor, D.w * 0.42, al * 0.4 * a, 0.16);
      glowAt(ctx, SP.gold, ax, ay, D.w * 0.24, al * 0.35 * a);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 狮子（后面的先画）
    const calm = lv('dnCalm'), lieK = smoothstep(0.3, 0.9, calm), ls = Math.min(2 * PK(), D.w / 135);
    for (const back of [1, 0]) {
      for (let i = 0; i < LIONS.length; i++) {
        const Ln = LIONS[i];
        if (Ln[3] !== back) continue;
        const pace = (1 - calm) * Math.sin(W.t * 0.35 + i * 1.7) * 0.05 * D.w;
        const dd = calm < 0.5 ? (Math.cos(W.t * 0.35 + i * 1.7) >= 0 ? 1 : -1) : Ln[1];
        drawLion(ctx, D.x + Ln[0] * D.w + pace, D.floor + 1 - back * 7 * k, Ln[2] * ls, dd, lieK, W.t * 3.2 + i * 1.3, a, calm, al * (back ? 0.55 : 0.9));
      }
    }
    ctx.restore();
    // 洞壁的边
    ctx.strokeStyle = al > 0.05 ? rgba([255, 206, 140], 0.4 * al * a) : css([120, 92, 66], l, 0.5);
    ctx.lineWidth = Math.max(0.6, 1.2 * k);
    ctx.stroke(D.cave);
    // 坑口的石头（封：盖住井口；开：挪在一旁）与王的玺
    const se = lv('dnSeal');
    const sx = D.mx + (1 - se) * 22 * k, sy = D.g - 7 * k, r = 11 * k;
    ctx.fillStyle = css([150, 140, 126], l);
    ctx.beginPath();
    for (let i = 0; i <= 14; i++) { const t = (i / 14) * Math.PI, rr = r * (1 + 0.06 * Math.sin(i * 2.7)); ctx.lineTo(sx + Math.cos(Math.PI + t) * rr * 1.25, sy + 8 * k - Math.sin(t) * rr); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([110, 102, 92], l, 0.6);
    ctx.beginPath(); ctx.ellipse(sx + r * 0.35, sy + 4 * k, r * 0.7, r * 0.45, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([240, 232, 214], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * k);
    ctx.beginPath(); ctx.arc(sx, sy + 8 * k, r, Math.PI * 1.15, Math.PI * 1.7); ctx.stroke();
    if (se > 0.5) {
      ctx.globalAlpha = a * smoothstep(0.5, 0.9, se);
      ctx.strokeStyle = css([110, 60, 40], l); ctx.lineWidth = Math.max(0.5, 0.7 * k);
      ctx.beginPath(); ctx.moveTo(sx - r * 1.4, D.g); ctx.quadraticCurveTo(sx, sy - r * 0.4, sx + r * 1.4, D.g); ctx.stroke();
      ctx.fillStyle = css([190, 40, 40], l, 1, 0.1);
      ctx.beginPath(); ctx.arc(sx, sy - r * 0.02, 2.4 * k, 0, TAU); ctx.fill();
      ctx.fillRect(sx - r * 1.45, D.g - 2 * k, 1.4 * k, 3 * k); ctx.fillRect(sx + r * 1.35, D.g - 2 * k, 1.4 * k, 3 * k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：梦中的大像（2:31–35）、非人手凿出来的石头、充满天下的大山
  // ════════════════════════════════════════════════════════════
  const METAL = { gold: [238, 192, 86], silver: [206, 212, 226], bronze: [196, 122, 62], iron: [98, 106, 122], clay: [150, 104, 72] };
  const METAL_HI = { gold: [255, 238, 176], silver: [252, 254, 255], bronze: [246, 186, 124], iron: [170, 178, 196], clay: [196, 148, 110] };
  function mirror(poly) { return poly.map(p => [-p[0], p[1]]).reverse(); }
  function ellPoly(cx, cy, rx, ry, n) { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU; o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return o; }
  const ARM = [[-16.2, 20.5], [-13.6, 28], [-13.2, 36], [-12.8, 45.5], [-17.2, 46.5], [-19.4, 36], [-19.8, 25]];
  const LEG = [[-9.8, 62], [-2, 62], [-2.4, 76], [-2.8, 90], [-8.2, 90], [-9, 76]];
  const FOOT = [[-8.8, 90], [-2.2, 90], [-1.4, 97], [-0.8, 100], [-10.8, 100], [-10.4, 96]];
  const PARTS = [
    { m: 'gold', p: [[-5.4, 6.4], [-5.9, 2.4], [-3.8, 3.4], [-2.3, 0.4], [0, -1.6], [2.3, 0.4], [3.8, 3.4], [5.9, 2.4], [5.4, 6.4]] },
    { m: 'gold', p: ellPoly(0, 10, 4.4, 5.2, 16) },
    { m: 'gold', p: [[-3.9, 11.6], [3.9, 11.6], [3.5, 19.6], [0, 21.2], [-3.5, 19.6]], dk: 0.8 },
    { m: 'silver', p: [[-16.4, 20.6], [-10.5, 17.6], [10.5, 17.6], [16.4, 20.6], [13.8, 28], [11.8, 39.5], [-11.8, 39.5], [-13.8, 28]] },
    { m: 'silver', p: ARM }, { m: 'silver', p: mirror(ARM) },
    { m: 'silver', p: ellPoly(-15.6, 22, 4, 3.4, 14) }, { m: 'silver', p: ellPoly(15.6, 22, 4, 3.4, 14) },
    { m: 'silver', p: ellPoly(-15, 47.2, 2.4, 2, 10) }, { m: 'silver', p: ellPoly(15, 47.2, 2.4, 2, 10) },
    { m: 'bronze', p: [[-11.8, 39.5], [11.8, 39.5], [12.8, 47], [14.2, 62.5], [-14.2, 62.5], [-12.8, 47]] },
    { m: 'iron', p: LEG }, { m: 'iron', p: mirror(LEG) },
    { m: 'iron', p: FOOT, clay: true }, { m: 'iron', p: mirror(FOOT), clay: true },
  ];
  function inPoly(x, y, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { if (((P[i][1] > y) !== (P[j][1] > y)) && (x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0])) c = !c; } return c; }
  function statueGeom() {
    const p = port();
    const cx = (p ? 0.66 : 0.735) * W.w;
    const top = (p ? 0.375 : 0.075) * W.h, bot = (p ? 0.585 : 0.57) * W.h;
    const H = bot - top;
    return { cx, top, bot, H, u: H / 100 };
  }
  function statueSprite() {
    return cached('statue', () => {
      const G = statueGeom(), dpr = Math.min(2, W.dpr || 1), u = G.u * dpr;
      const pad = 14 * u, cw = 44 * u + pad * 2, ch = 104 * u + pad * 2;
      const c = cnv(cw, ch), g = c.getContext('2d');
      const ox = cw / 2, oy = 2 * u + pad;
      const rng = U.mulberry32(2331);
      const trace = part => { g.beginPath(); part.p.forEach((q, i) => (i ? g.lineTo(ox + q[0] * u, oy + q[1] * u) : g.moveTo(ox + q[0] * u, oy + q[1] * u))); g.closePath(); };
      // 光耀：先以金白的光画一层模糊的剪影
      try {
        g.save();
        g.filter = 'blur(' + Math.round(5 * u) + 'px)';
        g.fillStyle = 'rgba(255,236,190,0.75)';
        for (const part of PARTS) { trace(part); g.fill(); }
        g.filter = 'blur(' + Math.round(1.6 * u) + 'px)';
        g.fillStyle = 'rgba(255,248,226,0.9)';
        for (const part of PARTS) { trace(part); g.fill(); }
        g.restore();
      } catch (e) { g.restore(); }
      for (const part of PARTS) {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const q of part.p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
        trace(part);
        const k = part.dk || 1, base = METAL[part.m].map(v => v * k), hi = METAL_HI[part.m].map(v => v * k);
        const gr = g.createLinearGradient(ox + x0 * u, 0, ox + x1 * u, 0);
        gr.addColorStop(0, U.rgb(base[0] * 0.5, base[1] * 0.5, base[2] * 0.5));
        gr.addColorStop(0.3, U.rgb(hi[0], hi[1], hi[2]));
        gr.addColorStop(0.42, U.rgb(base[0] * 1.02, base[1] * 1.02, base[2] * 1.02));
        gr.addColorStop(0.78, U.rgb(base[0] * 0.8, base[1] * 0.8, base[2] * 0.8));
        gr.addColorStop(1, U.rgb(base[0] * 0.45, base[1] * 0.45, base[2] * 0.45));
        g.fillStyle = gr;
        g.fill();
        // 上亮下暗
        const vg = g.createLinearGradient(0, oy + y0 * u, 0, oy + y1 * u);
        vg.addColorStop(0, 'rgba(255,255,255,0.18)'); vg.addColorStop(1, 'rgba(0,0,0,0.16)');
        g.fillStyle = vg; g.fill();
        if (part.clay) {
          g.save(); trace(part); g.clip();
          for (let i = 0; i < 16; i++) {
            const cl = METAL.clay;
            g.fillStyle = U.rgba(cl[0], cl[1], cl[2], 0.9);
            g.beginPath(); g.ellipse(ox + lerp(x0, x1, rng()) * u, oy + lerp(y0, y1, rng()) * u, (0.8 + rng() * 1.6) * u, (0.6 + rng()) * u, rng() * 3, 0, TAU); g.fill();
          }
          g.restore();
        }
        g.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.55);
        g.lineWidth = Math.max(0.6, 0.3 * u);
        trace(part); g.stroke();
      }
      // 胸前的项链、腰带、袍的褶、胡须的纹
      g.lineCap = 'round';
      g.strokeStyle = 'rgba(255,236,170,0.8)'; g.lineWidth = Math.max(0.8, 0.5 * u);
      g.beginPath(); g.moveTo(ox - 7 * u, oy + 19 * u); g.quadraticCurveTo(ox, oy + 25.5 * u, ox + 7 * u, oy + 19 * u); g.stroke();
      g.fillStyle = 'rgba(120,70,30,0.55)'; g.fillRect(ox - 12 * u, oy + 39.5 * u, 24 * u, 2.2 * u);
      g.strokeStyle = 'rgba(90,50,24,0.45)'; g.lineWidth = Math.max(0.6, 0.35 * u);
      g.beginPath();
      for (const xx of [-8, -4, 0, 4, 8]) { g.moveTo(ox + xx * u, oy + 43 * u); g.lineTo(ox + xx * 1.12 * u, oy + 62 * u); }
      for (const xx of [-2, 0, 2]) { g.moveTo(ox + xx * u, oy + 13 * u); g.lineTo(ox + xx * 0.9 * u, oy + 20 * u); }
      g.stroke();
      return { c, cw: cw / dpr, ch: ch / dpr, ox: ox / dpr, oy: oy / dpr };
    });
  }
  function fragModel() {
    return cached('frags', () => {
      const rng = U.mulberry32(9107), out = [];
      const nQ = (W.quality || 1) < 0.75 ? 0.6 : 1;
      for (const part of PARTS) {
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (const q of part.p) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
        const n = Math.round((x1 - x0) * (y1 - y0) * 0.22 * nQ) + 3;
        let tries = 0, got = 0;
        while (got < n && tries++ < n * 8) {
          const x = lerp(x0, x1, rng()), y = lerp(y0, y1, rng());
          if (!inPoly(x, y, part.p)) continue;
          const m = part.clay && rng() < 0.4 ? 'clay' : part.m;
          out.push({ x, y, m, s: 1.1 + rng() * 1.6, r1: rng(), r2: rng(), r3: rng(), rot: rng() * 3 });
          got++;
        }
      }
      return out;
    });
  }
  function stoneStart() { return port() ? [W.w * 1.02, W.h * 0.57] : [W.w * 0.97, W.h * 0.55]; }
  function drawStatue(ctx) {
    const a = lv('dnImage');
    if (a < 0.01 || !SP) return;
    const G = statueGeom(), sh = lv('dnShatter');
    ctx.save();
    // 光耀（2:31）
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, G.cx, G.top + G.H * 0.4, G.H * 0.55, a * 0.22 * (1 - sh), 1.3);
    glowAt(ctx, SP.white, G.cx, G.top + G.H * 0.1, G.H * 0.14, a * 0.3 * (1 - sh));
    ctx.globalCompositeOperation = 'source-over';
    const solid = a * (1 - smoothstep(0, 0.12, sh));
    const spr = statueSprite();
    if (solid > 0.01) {
      ctx.globalAlpha = solid * 0.96;
      ctx.drawImage(spr.c, G.cx - spr.ox, G.top - spr.oy, spr.cw, spr.ch);
      // 缓缓流过的光
      ctx.globalCompositeOperation = 'lighter';
      const ph = U.fract(W.t * 0.09);
      const yy = G.top + ph * G.H * 1.3 - 0.15 * G.H;
      glowAt(ctx, SP.white, G.cx, yy, G.H * 0.14, solid * 0.25, 0.35);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 碎片：金、银、铜、铁、泥如夏天禾场上的糠秕，被风吹散
    if (sh > 0.001) {
      const F = fragModel(), u = G.u;
      const groups = {};
      for (const f of F) {
        const s0 = 0.22 * (f.y / 100) * -1 + 0.24 + f.r1 * 0.04;
        const t = clamp((sh - Math.max(0, s0)) / 0.62, 0, 1);
        const fa = a * smoothstep(0, 0.06, sh) * (1 - smoothstep(0.5, 1, t));
        if (fa < 0.01) continue;
        const e = t * t;
        const x = G.cx + f.x * u - e * (0.22 + 0.45 * f.r1) * W.w - Math.sin(t * 6 + f.r2 * 9) * 4 * u * t;
        const y = G.top + f.y * u + t * (6 + 10 * f.r2) * u - e * (10 + 30 * f.r3) * u;
        const sz = f.s * u * (1 - 0.5 * t), rot = f.rot + t * 8 * (f.r2 - 0.5);
        (groups[f.m] || (groups[f.m] = [])).push([x, y, sz, rot, fa]);
      }
      // 按颜色与透明度分组，一组一笔
      for (const m in groups) {
        const col = METAL[m], hi = METAL_HI[m];
        ctx.fillStyle = U.rgb(lerp(col[0], hi[0], 0.3), lerp(col[1], hi[1], 0.3), lerp(col[2], hi[2], 0.3));
        for (let bk = 1; bk <= 5; bk++) {
          const lo = (bk - 1) / 5, up = bk / 5;
          let any = false;
          ctx.beginPath();
          for (const q of groups[m]) {
            if (q[4] <= lo || q[4] > up) continue;
            const c = Math.cos(q[3]) * q[2], s = Math.sin(q[3]) * q[2];
            ctx.moveTo(q[0] + c, q[1] + s); ctx.lineTo(q[0] - s * 0.7, q[1] + c * 0.7); ctx.lineTo(q[0] - c, q[1] - s); ctx.closePath();
            any = true;
          }
          if (!any) continue;
          ctx.globalAlpha = (lo + up) / 2;
          ctx.fill();
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    drawStone(ctx);
  }
  function drawStone(ctx) {
    const p = lv('dnStone');
    if (p < 0.001 || lv('dnImage') < 0.01 || !SP) return;
    const G = statueGeom(), st = stoneStart(), u = G.u;
    const ex = G.cx - 4 * u, ey = G.bot - 4 * u;
    const e = p * p * (3 - 2 * p);
    const x = lerp(st[0], ex, e), y = lerp(st[1], ey, e) - Math.sin(Math.PI * e) * 0.14 * W.h;
    const r = 4.2 * u * (1 + 0.8 * lv('dnMount'));
    const al = lv('dnImage') * (p < 1 ? 1 : 1 - smoothstep(0.15, 0.7, lv('dnMount')));
    if (al < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (p < 1) for (let i = 1; i <= 5; i++) {
      const e2 = Math.max(0, e - i * 0.04);
      const x2 = lerp(st[0], ex, e2), y2 = lerp(st[1], ey, e2) - Math.sin(Math.PI * e2) * 0.14 * W.h;
      glowAt(ctx, SP.gold, x2, y2, r * (1.6 - i * 0.2), al * 0.18 * (1 - i / 6));
    }
    glowAt(ctx, SP.white, x, y, r * 3.5, al * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = al;
    ctx.fillStyle = 'rgb(226,220,206)';
    ctx.translate(x, y); ctx.rotate(W.t * (p < 1 ? 5 : 0.2));
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU, rr = r * (0.78 + 0.3 * hsh(i * 3.1)); if (i) ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 大山（远山那一层；石头打碎像之后渐渐长起，充满天下）
  function mountProfile() {
    return cached('mprof', () => {
      const N = 140, out = [];
      for (let i = 0; i <= N; i++) {
        const u = (i / N) * 2 - 1, au_ = Math.abs(u);
        let h = Math.pow(Math.max(0, 1 - Math.pow(au_, 1.35)), 1.25);
        h *= 1 + 0.08 * Math.sin(u * 17 + 1.1) + 0.05 * Math.sin(u * 37 + 0.3);
        h += 0.06 * Math.exp(-Math.pow((u + 0.42) / 0.08, 2)) + 0.05 * Math.exp(-Math.pow((u - 0.35) / 0.1, 2));
        out.push([u, Math.max(0, h)]);
      }
      return out;
    });
  }
  // 山的形（Path2D）、峰与谷、各处的渐变：按几何缓存（长成之后每帧不再重建）
  let MG = null, MGK = '';
  function mountGeom(cx, base, Hm, half) {
    const key = GKEY + '|' + Math.round(cx) + '|' + Math.round(base) + '|' + Math.round(Hm) + '|' + Math.round(half);
    if (MG && MGK === key) return MG;
    const prof = mountProfile();
    const pts = prof.map(q => [cx + q[0] * half, base - q[1] * Hm]);
    const path = new Path2D();
    pts.forEach((p, i) => (i ? path.lineTo(p[0], p[1]) : path.moveTo(p[0], p[1])));
    path.lineTo(pts[pts.length - 1][0], base + 3); path.lineTo(pts[0][0], base + 3);
    path.closePath();
    // 峰（山脊由此向观者伸下的支脉）与谷（两峰之间的暗）
    const peaks = [], vals = [], R = 6;
    let top = 0;
    for (let i = 0; i < prof.length; i++) if (prof[i][1] > prof[top][1]) top = i;
    for (let i = R; i < prof.length - R; i++) {
      const h = prof[i][1];
      let mx = true, mn = true;
      for (let j = i - R; j <= i + R; j++) { if (prof[j][1] > h) mx = false; if (prof[j][1] < h) mn = false; }
      if (mx && h > 0.14) peaks.push(i);
      if (mn && h > 0.1) vals.push(i);
    }
    MG = { path, pts, peaks, vals, top, grads: {} };
    MGK = key;
    return MG;
  }
  function drawMountain(ctx) {
    const m = lv('dnMount');
    if (m < 0.005) return;
    const G = statueGeom(), base = W.waterlineY(0) + 2;
    const Hm = (port() ? 0.24 : 0.38) * W.h * m, half = (0.2 + 0.4 * Math.sqrt(m)) * W.w;
    const glow = lv('dnMountGlow');
    const d = litX() >= G.cx ? 1 : -1;
    const MGx = mountGeom(G.cx, base, Hm, half);
    const pk = MGx.pts[MGx.top];
    // 石色受天光与大气；山脚没入水汽（与远山同一种雾色）
    const rock = mix([132, 126, 132], [214, 184, 142], glow * 0.65);
    const cTop = W.shade(rock, 0.5, 0.03 + 0.18 * glow), cBot = mix(W.shade([118, 120, 136], 0.8, 0), W.haze, 0.45);
    const gk = 'b' + (cTop[0] | 0) + ',' + (cTop[1] | 0) + ',' + (cTop[2] | 0) + ',' + (cBot[0] | 0) + ',' + (cBot[1] | 0) + ',' + (cBot[2] | 0);
    let gr = MGx.grads[gk];
    if (!gr) {
      if (Object.keys(MGx.grads).length > 24) MGx.grads = {};
      gr = MGx.grads[gk] = ctx.createLinearGradient(0, pk[1], 0, base);
      gr.addColorStop(0, U.rgb(cTop[0], cTop[1], cTop[2]));
      gr.addColorStop(0.6, U.rgb(lerp(cTop[0], cBot[0], 0.55), lerp(cTop[1], cBot[1], 0.55), lerp(cTop[2], cBot[2], 0.55)));
      gr.addColorStop(1, U.rgb(cBot[0], cBot[1], cBot[2]));
    }
    ctx.save();
    ctx.globalAlpha = clamp(m * 5, 0, 1);
    ctx.fillStyle = gr;
    ctx.fill(MGx.path);
    ctx.clip(MGx.path);
    const dk = 0.35 + 0.65 * dayA();
    // 每一峰：背光的坡上一片柔和的暗，迎光的坡上一片柔和的亮（旋转的柔光，不留硬边）；谷中更暗
    const la = 0.1 * dayA() + 0.2 * glow;
    if (SP) {
      const soft = (img, x, y, rx, ry, rot, al) => {
        if (al < 0.004) return;
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = al;
        ctx.drawImage(img, -rx, -ry, rx * 2, ry * 2);
        ctx.restore();
      };
      for (const i of MGx.peaks) {
        const p = MGx.pts[i], hh = base - p[1];
        soft(SP.dark, p[0] - d * 0.3 * hh, p[1] + 0.66 * hh, 0.34 * hh, 0.72 * hh, d * 0.5, 0.17 * dk);
        soft(SP.cloud, p[0] + d * 0.22 * hh, p[1] + 0.5 * hh, 0.3 * hh, 0.62 * hh, -d * 0.45, la);
      }
      for (const i of MGx.vals) { const p = MGx.pts[i], hh = base - p[1]; soft(SP.dark, p[0], p[1] + hh * 0.55, hh * 0.22, hh * 0.6, 0, 0.13 * dk); }
      ctx.globalAlpha = 1;
    }
    // 整座山背光的一半稍暗
    let sg = MGx.grads['s' + d];
    if (!sg) {
      sg = MGx.grads['s' + d] = ctx.createLinearGradient(G.cx - d * half * 0.55, 0, G.cx + d * half * 0.25, 0);
      sg.addColorStop(0, 'rgba(18,22,40,0.3)'); sg.addColorStop(1, 'rgba(18,22,40,0)');
    }
    ctx.globalAlpha = dk; ctx.fillStyle = sg; ctx.fillRect(G.cx - half, pk[1] - 2, half * 2, base - pk[1] + 4);
    // 山脚的水汽
    const hzk = 'h' + (W.haze[0] | 0) + ',' + (W.haze[1] | 0) + ',' + (W.haze[2] | 0);
    let hg = MGx.grads[hzk];
    if (!hg) {
      const hz = W.haze;
      hg = MGx.grads[hzk] = ctx.createLinearGradient(0, base - Hm * 0.5, 0, base);
      hg.addColorStop(0, U.rgba(hz[0], hz[1], hz[2], 0)); hg.addColorStop(1, U.rgba(hz[0], hz[1], hz[2], 0.55));
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = hg; ctx.fillRect(G.cx - half, base - Hm * 0.5, half * 2, Hm * 0.5 + 3);
    ctx.restore();
    // 晨光：只照亮峰顶与迎光的坡——一团柔光，不描边；大山退为远山之后，光边也隐去
    const rim = smoothstep(0.4, 0.85, m);
    if (SP && (glow > 0.01 || rim > 0.01)) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, pk[0] + d * 0.04 * Hm, pk[1] + 0.12 * Hm, Hm * 0.75, glow * 0.34, 0.6);
      glowAt(ctx, SP.white, pk[0], pk[1] + 0.02 * Hm, Hm * 0.12, glow * 0.25);
      // 迎光一侧的山脊：由峰顶向下渐隐的一段淡光
      const ra = rim * (0.08 + 0.4 * glow + 0.1 * W.dusk);
      if (ra > 0.01) {
        const rk = 'r' + d;
        let rgd = MGx.grads[rk];
        if (!rgd) {
          rgd = MGx.grads[rk] = ctx.createLinearGradient(pk[0], 0, pk[0] + d * half * 0.45, 0);
          rgd.addColorStop(0, 'rgba(255,230,184,1)'); rgd.addColorStop(1, 'rgba(255,230,184,0)');
        }
        ctx.strokeStyle = rgd; ctx.globalAlpha = ra; ctx.lineWidth = Math.max(0.8, 1.2 * SU()); ctx.lineJoin = 'round';
        ctx.beginPath();
        const n = MGx.pts.length;
        for (let i = MGx.top, c = 0; i >= 0 && i < n && c < n * 0.24; i += d, c++) { const p = MGx.pts[i]; if (c) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：第七章的异象——海中上来的四兽、火焰的宝座、火河、千千万万、驾着天云而来的
  // ════════════════════════════════════════════════════════════
  function v7Geom() {
    const p = port(), m = M(), tu = m * (p ? 0.0031 : 0.0026);
    const rx = (p ? 0.53 : 0.6) * W.w;
    return {
      // 竖屏：四兽排成两行，都在远山之上（经文在画面的顶上）
      beasts: p
        ? [[0.15, 0.36, 0.85], [0.41, 0.38, 0.9], [0.17, 0.475, 0.85], [0.43, 0.495, 1.05]]
        : [[0.1, 0.43, 1], [0.205, 0.47, 1.02], [0.305, 0.38, 1], [0.41, 0.33, 1.3]],
      bs: m * (p ? 0.0046 : 0.0034),
      th: p ? [0.7 * W.w, 0.415 * W.h] : [0.77 * W.w, 0.25 * W.h],
      tu, tt: tu * 1.6, hr: p ? 0.62 : 1,
      // 火河落在远山的脊上（远山在后面画，河就像流到山后去）
      river: [rx, Math.min(W.horizonY, gY(0, rx / W.w) + 3)],
      son0: p ? [0.1 * W.w, 0.43 * W.h] : [0.06 * W.w, 0.26 * W.h],
    };
  }
  // 兽的剪影（朝右；y 向上为负；单位约为身长的三十分之一）
  function beastPath(ctx, kind, ph) {
    const E = (cx, cy, rx, ry, r) => { ctx.moveTo(cx + rx, cy); ctx.ellipse(cx, cy, rx, ry, r || 0, 0, TAU); };
    // 腿：上粗下细，有膝（后腿向后弯），脚掌向前
    const legs = (xs, top, len, w) => {
      xs.forEach((x, j) => {
        const hind = j < xs.length / 2, kx = x + (hind ? -1.4 : 0.9), ky = top + len * 0.52, fx0 = x + (hind ? 0.3 : 0.7), fy = top + len;
        ctx.moveTo(x - w * 0.6, top - 1);
        ctx.lineTo(x + w * 0.6, top - 1);
        ctx.lineTo(kx + w * 0.34, ky);
        ctx.lineTo(fx0 + w * 0.28, fy - 1);
        ctx.lineTo(fx0 + w * 0.3 + 1.4, fy);
        ctx.lineTo(fx0 - w * 0.34, fy);
        ctx.lineTo(kx - w * 0.36, ky);
        ctx.closePath();
        if (hind) { ctx.moveTo(x + w * 0.9, top + 0.6); ctx.ellipse(x, top + 0.6, w * 0.9, w * 1.1, 0, 0, TAU); }
      });
    };
    const wing = (rx, ry, a0, a1, L, n) => {
      ctx.moveTo(rx, ry);
      for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n), l = L * (0.7 + 0.3 * Math.sin((i / n) * Math.PI)); ctx.lineTo(rx + Math.cos(a) * l, ry + Math.sin(a) * l); ctx.lineTo(rx + Math.cos(a + 0.08) * l * 0.82, ry + Math.sin(a + 0.08) * l * 0.82); }
      ctx.closePath();
    };
    const flap = Math.sin(ph) * 0.12;
    if (kind === 0) {           // 像狮子，有鹰的翅膀
      E(0, -10, 12, 5.5); E(10, -13, 6, 7); E(15.5, -14, 3.8, 3.2); E(18.6, -13, 2.2, 1.8);
      legs([-9, -5, 7, 11], -9, 9, 2.6);
      ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-19, -16, -21, -12); ctx.lineTo(-20, -11); ctx.quadraticCurveTo(-18, -14, -12, -8.6); ctx.closePath();
      wing(1, -14, -2.1 + flap, -0.9 + flap, 22, 6);
      wing(3, -14.5, -2.3 + flap * 0.7, -1.1 + flap * 0.7, 18, 5);
    } else if (kind === 1) {    // 如熊，旁跨而坐
      E(-1, -12, 13, 8, -0.22); E(8, -16, 5, 4.6, -0.5); E(12, -18.5, 5, 4.4); E(16.6, -17.6, 2.8, 2.1); E(10.5, -22.4, 1.4, 1.4);
      legs([-10, -5], -8, 8, 4); legs([7, 11], -12, 12, 3.6);
    } else if (kind === 2) {    // 如豹，背上有鸟的四个翅膀，有四个头
      E(0, -10, 13, 4.2); legs([-9, -6, 8, 11], -8, 10, 2);
      ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-22, -9, -24, -3); ctx.lineTo(-23, -2.6); ctx.quadraticCurveTo(-21, -7.6, -12, -8.4); ctx.closePath();
      for (let i = 0; i < 4; i++) { const a = -0.9 + i * 0.32, nx = 11 + Math.cos(a) * 7, ny = -12 + Math.sin(a) * 7; ctx.moveTo(10, -11); ctx.lineTo(nx, ny - 0.9); ctx.lineTo(nx, ny + 0.9); ctx.lineTo(10, -9); ctx.closePath(); E(nx + 1.6, ny, 2.4, 1.8); }
      wing(-3, -13, -2.2 + flap, -1.3 + flap, 13, 4); wing(2, -13, -2 + flap * 0.8, -1.1 + flap * 0.8, 12, 4);
      wing(-5, -12.5, -2.5 - flap, -1.7 - flap, 10, 3); wing(4, -12.6, -1.8 - flap * 0.6, -1.0 - flap * 0.6, 10, 3);
    } else {                    // 第四兽：甚是可怕，有大铁牙，头有十角
      E(0, -13, 15, 7.5); E(15, -16, 6, 5.5); E(20, -14.5, 4.2, 2.6);
      legs([-11, -6, 8, 12.5], -9, 10, 4.2);
      ctx.moveTo(-14, -13); ctx.quadraticCurveTo(-26, -16, -30, -6); ctx.lineTo(-28.5, -5.4); ctx.quadraticCurveTo(-25, -12, -14, -9.5); ctx.closePath();
      for (let i = 0; i < 10; i++) { const a = -2.5 + i * 0.16, bx = 15 + Math.cos(a) * 4.8, by = -16 + Math.sin(a) * 4.8, L = 6 + (i % 3) * 1.4; ctx.moveTo(bx - 0.5, by); ctx.lineTo(bx + Math.cos(a) * L, by + Math.sin(a) * L); ctx.lineTo(bx + 0.5, by + 0.4); ctx.closePath(); }
    }
  }
  let BEAST_BG = null;
  function drawBeasts(ctx) {
    const v = lv('dnV7'), sea = lv('dnSea');
    if (v < 0.01 || sea < 0.01) return;
    const G = v7Geom(), fade = lv('dnBeastFade'), burn = lv('dnBeastFire');
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W.w, W.horizonY + 1); ctx.clip();
    for (let i = 0; i < 4; i++) {
      const r = clamp(sea - i, 0, 1);
      if (r < 0.01) continue;
      const B = G.beasts[i], s = G.bs * B[2];
      const rise = Math.max(34 * s, W.horizonY - B[1] * W.h + 16 * s);
      const bx = B[0] * W.w, by = B[1] * W.h + (1 - eOut(r)) * rise;
      let al = v * smoothstep(0, 0.5, r);
      if (i === 3) al *= 1 - smoothstep(0.35, 0.95, burn); else al *= 1 - 0.65 * fade;
      if (al < 0.01) continue;
      const ph = W.t * 1.4 + i * 1.7;
      ctx.save();
      ctx.translate(bx, by + Math.sin(W.t * 0.8 + i) * 1.5 * s);
      ctx.scale(s, s);
      // 身后的冷光
      ctx.globalCompositeOperation = 'lighter';
      if (SP) glowAt(ctx, SP.pale, 0, -12, 34, al * 0.12);
      ctx.globalCompositeOperation = 'source-over';
      // 剪影的一圈冷光（以两道渐细的描边代替 shadowBlur）
      ctx.beginPath(); beastPath(ctx, i, ph);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = i === 3 ? 'rgba(210,120,110,1)' : 'rgba(150,176,240,1)';
      const rimA = al * (i === 3 ? 1 : (1 - fade) * (1 - fade));
      ctx.globalAlpha = rimA * 0.16; ctx.lineWidth = 3.2; ctx.stroke();
      ctx.globalAlpha = rimA * 0.32; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.globalAlpha = al * 0.96;
      ctx.fillStyle = i === 3 ? 'rgb(16,16,24)' : rgba(mix([20, 24, 40], [70, 74, 86], fade * 0.6), 1);
      ctx.fill();
      // 背上一道冷光（渐变以兽身的单位定义，只建一次）
      if (!BEAST_BG) {
        BEAST_BG = ctx.createLinearGradient(0, -26, 0, 0);
        BEAST_BG.addColorStop(0, 'rgba(170,190,240,0.28)'); BEAST_BG.addColorStop(0.5, 'rgba(170,190,240,0.06)'); BEAST_BG.addColorStop(1, 'rgba(170,190,240,0)');
      }
      ctx.fillStyle = BEAST_BG;
      ctx.fill();
      if (i === 3) {
        // 大铁牙
        ctx.fillStyle = 'rgb(186,194,210)'; ctx.globalAlpha = al * 0.9;
        ctx.beginPath();
        for (let j = 0; j < 5; j++) { const tx = 18.5 + j * 1.1; ctx.moveTo(tx, -13.2); ctx.lineTo(tx + 0.5, -11.6); ctx.lineTo(tx + 1, -13.2); ctx.closePath(); }
        ctx.fill();
        // 又长起一个小角（7:8）
        ctx.fillStyle = 'rgb(236,210,170)'; ctx.globalAlpha = al * 0.8;
        ctx.beginPath(); ctx.moveTo(15.4, -21); ctx.lineTo(16.4, -26.5); ctx.lineTo(17.2, -21); ctx.closePath(); ctx.fill();
        // 焚烧（7:11）
        if (burn > 0.01) {
          const fb = Math.sin(Math.PI * clamp(burn, 0, 1));
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = fb * v;
          ctx.fillStyle = 'rgba(255,140,50,0.8)';
          ctx.beginPath();
          for (let j = 0; j < 9; j++) tongue(ctx, -14 + j * 4, -6, 2.6, (10 + 7 * Math.sin(W.t * 7 + j)) * (0.5 + burn), W.t * 6 + j * 1.3);
          ctx.fill();
          if (SP) glowAt(ctx, SP.fire, 0, -12, 40, fb * 0.6 * v);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.restore();
      // 海上翻起的浪花
      if (r < 1 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.pale, bx, W.horizonY - 1, 26 * s, v * 0.3 * Math.sin(Math.PI * r), 0.25);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 火河的中线：自宝座前流出，先向左，再落向远山（t 0 → 1）
  function riverPts() {
    const G = v7Geom(), u = G.tt, sx = G.th[0] - 6 * u, sy = G.th[1] + 13 * u, ex = G.river[0], ey = G.river[1];
    const cx = lerp(sx, ex, 0.62), cy = lerp(sy, ey, 0.12);
    const out = [];
    for (let i = 0; i <= 36; i++) {
      const t = i / 36, v = 1 - t;
      const x = v * v * sx + 2 * v * t * cx + t * t * ex + Math.sin(t * Math.PI * 2) * 0.012 * W.w * v;
      const y = v * v * sy + 2 * v * t * cy + t * t * ey;
      out.push([x, y, t]);
    }
    return out;
  }
  // 一条渐宽的火带：宽 w(t)，沿河由亮而渐隐，到尽头散开、消失（不画圆头）
  function ribbon(ctx, P, n, w0, w1, spread, rgb, a0) {
    const L = [], R = [];
    for (let i = 0; i < n; i++) {
      const q = P[i], q0 = P[Math.max(0, i - 1)], q1 = P[Math.min(P.length - 1, i + 1)];
      let dx = q1[0] - q0[0], dy = q1[1] - q0[1];
      const len = Math.hypot(dx, dy) || 1; dx /= len; dy /= len;
      const tip = n > 1 ? i / (n - 1) : 1;
      const w = lerp(w0, w1, Math.pow(q[2], 0.9)) + spread * smoothstep(0.7, 1, tip);
      L.push([q[0] - dy * w, q[1] + dx * w]); R.push([q[0] + dy * w, q[1] - dx * w]);
    }
    const g = cached('rib:' + n + ':' + rgb.join(',') + ':' + a0, () => {
      const p0 = P[0], p1 = P[n - 1], gg = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
      gg.addColorStop(0, rgba(rgb, a0 * 0.7)); gg.addColorStop(0.15, rgba(rgb, a0)); gg.addColorStop(0.72, rgba(rgb, a0 * 0.8)); gg.addColorStop(1, rgba(rgb, 0));
      return gg;
    });
    ctx.fillStyle = g;
    ctx.beginPath();
    L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath(); ctx.fill();
  }
  // 一圈火（轮）：环上的火舌向外；不画辐条
  function fireRing(ctx, wx, wy, R, u, a, dir) {
    glowAt(ctx, SP.fire, wx, wy, R * 2.3, a * 0.42);
    ctx.globalAlpha = a;
    ctx.lineWidth = Math.max(1, 2.6 * u); ctx.strokeStyle = 'rgba(230,90,30,0.45)';
    ctx.beginPath(); ctx.arc(wx, wy, R, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, 1.1 * u); ctx.strokeStyle = 'rgba(255,214,140,0.85)';
    ctx.beginPath(); ctx.arc(wx, wy, R, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,150,60,0.8)';
    ctx.beginPath();
    for (let j = 0; j < 16; j++) {
      const aa = W.t * 1.2 * dir + j * TAU / 16, c = Math.cos(aa), s_ = Math.sin(aa);
      const h = (2.6 + 1.6 * Math.sin(W.t * 7 + j * 1.9)) * u, w = 1.1 * u;
      const bx = wx + c * R, by = wy + s_ * R, tx = wx + c * (R + h), ty = wy + s_ * (R + h);
      ctx.moveTo(bx - s_ * w, by + c * w);
      ctx.quadraticCurveTo(bx + c * h * 0.5 - s_ * w * 0.8, by + s_ * h * 0.5 + c * w * 0.8, tx - s_ * Math.sin(W.t * 6 + j) * w * 0.6, ty + c * Math.sin(W.t * 6 + j) * w * 0.6);
      ctx.quadraticCurveTo(bx + c * h * 0.5 + s_ * w * 0.8, by + s_ * h * 0.5 - c * w * 0.8, bx + s_ * w, by - c * w);
      ctx.closePath();
    }
    ctx.fill();
  }
  function drawThroneV(ctx) {
    const v = lv('dnV7'), th = lv('dnThrone');
    if (v < 0.01 || !SP) return;
    const G = v7Geom(), u = G.tt, [cx, cy] = G.th;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 火河（7:10）：从他面前发出，渐宽，落到远山，散开而隐
    const fr = lv('dnFireRiver');
    if (fr > 0.01) {
      const P = riverPts();
      const n = Math.max(2, Math.round(fr * (P.length - 1)) + 1);
      ctx.globalAlpha = v;
      // 一层套一层（加亮叠合）：外面暗红而宽，里面金白而细——边缘柔和，不成条纹
      const RL = [[1, [190, 46, 18], 0.1], [0.72, [226, 84, 28], 0.13], [0.5, [250, 130, 50], 0.18], [0.32, [255, 184, 96], 0.26], [0.16, [255, 236, 186], 0.42]];
      for (const [f, rgb, al] of RL) ribbon(ctx, P, n, 3.4 * u * f, 13 * u * f, 9 * u * f, rgb, al);
      // 流动的火光
      ctx.fillStyle = 'rgb(255,220,150)';
      for (let i = 0; i < 30; i++) {
        const t = U.fract(W.t * 0.1 + i / 30);
        const j = Math.min(P.length - 1, Math.floor(t * (P.length - 1)));
        if (j >= n - 1) continue;
        const q = P[j], off = (hsh(i * 3.7) - 0.5) * (2 + 8 * q[2]) * u, sz = Math.max(1.2, 1.3 * u) * (1 - 0.5 * t);
        ctx.globalAlpha = v * 0.75 * Math.sin(Math.PI * t);
        ctx.fillRect(q[0] - sz / 2 + off, q[1] - sz / 2, sz, sz);
      }
      if (n > 3) { const e = P[n - 1]; glowAt(ctx, SP.fire, e[0], e[1], 22 * u * fr, v * 0.3 * fr, 0.4); }
    }
    if (th > 0.01) {
      const a = v * th;
      // 千千万万：宝座四围密密的一圈光点
      const my = lv('dnMyriad');
      if (my > 0.01) {
        ctx.fillStyle = 'rgb(255,240,210)';
        const N = (W.quality || 1) < 0.75 ? 150 : 280;
        for (let i = 0; i < N; i++) {
          const ring = i % 4, ang = hsh(i * 1.9) * TAU + W.t * 0.025 * (ring + 1) * (i % 2 ? 1 : -1);
          const rr = (30 + ring * 12 + hsh(i * 5.3) * 12) * u * G.hr;
          const x = cx + Math.cos(ang) * rr * 1.3, y = cy - 6 * u + Math.sin(ang) * rr * 0.78;
          const tw = 0.5 + 0.5 * Math.sin(W.t * 2 + i), sz = Math.max(1.2, 0.75 * u) * (0.7 + 0.6 * hsh(i * 7.7));
          ctx.globalAlpha = a * my * (0.4 + 0.5 * tw) * (1 - ring * 0.14);
          ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
          if (i % 11 === 0) glowAt(ctx, SP.gold, x, y, 4 * u, a * my * 0.35 * tw);
        }
        glowAt(ctx, SP.gold, cx, cy - 6 * u, 62 * u * G.hr, a * my * 0.14, 0.8);
      }
      // 大光：宝座整个在火光之中；高背之内是一片火光（不空）
      glowAt(ctx, SP.amber, cx, cy, 70 * u, a * 0.24);
      glowAt(ctx, SP.fire, cx, cy - 8 * u, 34 * u, a * 0.34, 1.2);
      glowAt(ctx, SP.fire, cx, cy - 10 * u, 13 * u, a * 0.6, 1.7);
      glowAt(ctx, SP.gold, cx, cy - 8 * u, 11 * u, a * 0.5, 1.8);
      // 其轮乃烈火：两个火圈（在宝座之下）
      for (const sgn of [-1, 1]) fireRing(ctx, cx + sgn * 13 * u, cy + 20 * u, 8.5 * u, u, a, sgn);
      // 宝座乃火焰：高背与座全由火舌与光组成，不描轮廓
      ctx.globalAlpha = a;
      const back = (sx, sy) => {
        // 高背：一道拱，火舌沿拱向上
        for (let i = 0; i <= 12; i++) {
          const t = i / 12, ang = Math.PI * (1 + t), rr = 1 + 0.1 * Math.sin(i * 2.3);
          const bx = cx + Math.cos(ang) * 11 * u * rr, by = cy - 17 * u + Math.sin(ang) * 15 * u * rr;
          const hk = 1 + 0.5 * Math.sin(Math.PI * t) + 0.25 * hsh(i * 4.7);
          tongue(ctx, bx, by + 3 * u, sx * u, (sy * hk + 3 * Math.sin(W.t * 6 + i * 1.7)) * u, W.t * 7 + i * 2);
        }
        for (const sg of [-1, 1]) for (let i = 0; i < 4; i++) tongue(ctx, cx + sg * 11 * u, cy - 15 * u + i * 6 * u, sx * u, (sy * 0.8 + 2 * Math.sin(W.t * 5 + i)) * u, W.t * 6 + i + sg);
      };
      ctx.fillStyle = 'rgba(220,70,26,0.5)';
      ctx.beginPath(); back(3.2, 9); ctx.fill();
      ctx.fillStyle = 'rgba(255,150,60,0.55)';
      ctx.beginPath(); back(2.2, 6.5); ctx.fill();
      // 座：一道横的火
      ctx.fillStyle = 'rgba(255,160,70,0.6)';
      ctx.beginPath();
      for (let i = 0; i < 8; i++) tongue(ctx, cx - 17 * u + i * 4.9 * u, cy + 10 * u, 2.6 * u, (7 + 3 * Math.sin(W.t * 5 + i)) * u, W.t * 6 + i);
      for (const sg of [-1, 1]) tongue(ctx, cx + sg * 15 * u, cy + 1 * u, 2.4 * u, (6 + 2 * Math.sin(W.t * 6 + sg)) * u, W.t * 7 + sg);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,236,180,0.7)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) tongue(ctx, cx - 12 * u + i * 4.8 * u, cy + 10 * u, 1.5 * u, (4 + 2 * Math.sin(W.t * 7 + i)) * u, W.t * 8 + i);
      ctx.fill();
      glowAt(ctx, SP.gold, cx, cy + 9 * u, 22 * u, a * 0.5, 0.22);
      // 亘古常在者：洁白如雪、如纯净的羊毛的光（不画形像）
      glowAt(ctx, SP.white, cx, cy - 12 * u, 46 * u, a * 0.32);
      glowAt(ctx, SP.cloud, cx - 5 * u, cy - 13 * u, 11 * u, a * 0.42);
      glowAt(ctx, SP.cloud, cx + 5 * u, cy - 11 * u, 10 * u, a * 0.4);
      glowAt(ctx, SP.cloud, cx, cy - 19 * u, 10 * u, a * 0.45);
      glowAt(ctx, SP.white, cx, cy - 12 * u, 7 * u, a * 0.85);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 像人子的，驾着天云而来（7:13）：云中之光，不画形像
  function drawSon(ctx) {
    const v = lv('dnV7'), p = lv('dnSon'), gl = lv('dnGlory');
    if (v < 0.01 || !SP || (p < 0.001 && gl < 0.01)) return;
    const G = v7Geom(), tu = G.tu;
    const tx = G.th[0] - 32 * G.tt, ty = G.th[1] + 6 * G.tt;
    const e = eInOut(clamp(p, 0, 1));
    const x = lerp(G.son0[0], tx, e), y = lerp(G.son0[1], ty, e) - Math.sin(Math.PI * e) * 0.04 * W.h;
    ctx.save();
    if (p > 0.001) {
      const a = v * smoothstep(0, 0.1, p);
      for (let i = 0; i < 9; i++) {
        const ox = (hsh(i * 3.1) - 0.5) * 70 * tu, oy = (hsh(i * 5.7) - 0.3) * 18 * tu, r = (16 + hsh(i * 2.2) * 14) * tu;
        ctx.globalAlpha = 1;
        glowAt(ctx, SP.cloud, x + ox + Math.sin(W.t * 0.5 + i) * 2 * tu, y + oy, r, a * 0.55);
      }
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, y - 6 * tu, 40 * tu, a * 0.55);
      glowAt(ctx, SP.white, x, y - 8 * tu, 14 * tu, a * 0.9);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 权柄、荣耀、国度：金光铺满天空
    if (gl > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, G.th[0] - 10 * tu, G.th[1], Math.max(W.w, W.h) * 0.55, v * gl * 0.35, 0.7);
      ctx.strokeStyle = 'rgba(255,230,170,1)';
      ctx.lineWidth = Math.max(1, 1.4 * tu);
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * TAU + W.t * 0.02, L = (0.3 + 0.2 * hsh(i * 4.4)) * Math.max(W.w, W.h) * gl;
        ctx.globalAlpha = v * gl * 0.12;
        ctx.beginPath(); ctx.moveTo(G.th[0] - 10 * tu, G.th[1]); ctx.lineTo(G.th[0] - 10 * tu + Math.cos(a) * L, G.th[1] + Math.sin(a) * L * 0.7); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：河边的异象（8:3–10）——双角的公绵羊、从西而来的公山羊、四角、小角
  // ════════════════════════════════════════════════════════════
  function v8Geom() {
    const p = port(), s = M() * (p ? 0.0042 : 0.0042);
    return p ? { rx: 0.56 * W.w, ry: 0.53 * W.h, s, gx0: 1.12 * W.w, gy: 0.5 * W.h } : { rx: 0.63 * W.w, ry: 0.43 * W.h, s, gx0: 1.08 * W.w, gy: 0.39 * W.h };
  }
  function drawRamGoat(ctx) {
    const v = lv('dnVision');
    if (v < 0.01 || !SP) return;
    const G = v8Geom(), s = G.s;
    const gp = lv('dnGoat');
    ctx.save();
    // 公绵羊（朝右，向西、向北、向南抵触）
    const ra = v * lv('dnRam');
    const broken = gp > 0.93;
    if (ra > 0.01) {
      const butt = gp < 0.5 ? Math.max(0, Math.sin(W.t * 1.6)) * 0.18 : 0;
      const fall = broken ? smoothstep(0.93, 1, gp) * 0.5 : 0;
      ctx.save();
      ctx.translate(G.rx, G.ry);
      ctx.rotate(-fall * 0.6 + butt * 0.2);
      ctx.scale(s, s);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, 0, -12, 30, ra * 0.25);
      ctx.globalAlpha = ra * 0.62;
      ctx.fillStyle = 'rgb(236,214,160)';
      const P = () => {
        ctx.beginPath();
        for (let i = 0; i < 7; i++) { const x = -10 + i * 3.3, r = 4 + (i % 2) * 0.8; ctx.moveTo(x + r, -11); ctx.arc(x, -11 + (i % 2 ? -1 : 0.6), r, 0, TAU); }
        ctx.moveTo(15.5, -15); ctx.ellipse(12.5, -15, 3.2, 3.6, 0, 0, TAU);
        ctx.moveTo(17.6, -13.4); ctx.ellipse(15.4, -13.4, 2.2, 1.8, 0.3, 0, TAU);
        for (const x of [-8, -4.5, 6, 9.5]) { ctx.moveTo(x - 1.3, -8); ctx.lineTo(x + 1.3, -8); ctx.lineTo(x + 0.9, -3.5); ctx.lineTo(x + 0.6, 1); ctx.lineTo(x - 0.6, 1); ctx.lineTo(x - 0.9, -3.5); ctx.closePath(); }
      };
      ctx.shadowColor = 'rgba(255,226,160,0.9)'; ctx.shadowBlur = Math.max(4, 3 * s * (W.dpr || 1));
      P(); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowColor = 'rgba(0,0,0,0)';
      // 两角都高，这角高过那角
      ctx.strokeStyle = 'rgb(255,226,160)'; ctx.lineWidth = 1.4;
      ctx.beginPath();
      if (!broken) {
        ctx.moveTo(12, -18); ctx.bezierCurveTo(8, -26, 2, -22, 5, -17);
        ctx.moveTo(13.5, -18); ctx.bezierCurveTo(12, -32, 3, -30, 6, -21);
      } else { ctx.moveTo(12, -18); ctx.lineTo(10.5, -20.5); ctx.moveTo(13.5, -18); ctx.lineTo(13, -21); }
      ctx.stroke();
      ctx.restore();
    }
    // 公山羊（从西而来，遍行全地，脚不沾尘；两眼当中有一非常的角）
    if (gp > 0.001) {
      const e = gp * gp;
      const x = lerp(G.gx0, G.rx + 24 * s, Math.min(1, e / 0.93 > 1 ? 1 : e / 0.93)), y = G.gy - Math.sin(Math.PI * Math.min(1, gp)) * 0.02 * W.h;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(-s, s);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, 2, -11, 30, v * 0.26);
      ctx.globalAlpha = v * 0.64;
      ctx.fillStyle = 'rgb(236,212,164)';
      // 山羊的样子：腿短、胸深、颔下有须、短尾上翘
      const run = Math.sin(W.t * 12) * 2.4;
      const P = () => {
        ctx.beginPath();
        ctx.moveTo(-11, -9.2);
        ctx.bezierCurveTo(-11.8, -12.2, -8, -13, -3, -12.6);
        ctx.bezierCurveTo(2, -12.3, 6, -13.4, 9.2, -13.8);
        ctx.bezierCurveTo(11, -15, 12.4, -17.4, 13.6, -19);
        ctx.bezierCurveTo(14.8, -20.4, 16.4, -20.2, 17.3, -19);
        ctx.lineTo(20.2, -15.4);
        ctx.quadraticCurveTo(20.5, -14.2, 19, -14.1);
        ctx.lineTo(18.3, -14);
        ctx.lineTo(17.5, -10.8);
        ctx.lineTo(16.4, -13.6);
        ctx.bezierCurveTo(15, -13.4, 13.6, -12.4, 12.8, -11);
        ctx.bezierCurveTo(12.4, -8.4, 10.6, -5.2, 7.4, -4.4);
        ctx.bezierCurveTo(3, -4.2, -3, -5, -7.2, -5.4);
        ctx.bezierCurveTo(-9.6, -5.8, -10.8, -7.2, -11, -9.2);
        ctx.closePath();
        ctx.moveTo(-10.6, -11.4); ctx.quadraticCurveTo(-12.9, -13.2, -13, -15.8); ctx.quadraticCurveTo(-11.6, -14.6, -10.1, -12.7); ctx.closePath();
        ctx.moveTo(15, -18.8); ctx.quadraticCurveTo(12.8, -18.4, 12.1, -16.4); ctx.quadraticCurveTo(13.8, -17, 15.5, -18); ctx.closePath();
        for (const [xx, d] of [[-8.4, 1], [-5.6, -1], [6.2, 1], [8.8, -1]]) { const o = d * run * 0.4; ctx.moveTo(xx - 1.3, -6.2); ctx.lineTo(xx + 1.3, -6.2); ctx.lineTo(xx + o * 0.5 + 0.8, -2.2); ctx.lineTo(xx + o + 0.5, 1.2); ctx.lineTo(xx + o - 0.5, 1.2); ctx.lineTo(xx + o * 0.5 - 0.8, -2.2); ctx.closePath(); }
      };
      ctx.shadowColor = 'rgba(255,220,160,0.9)'; ctx.shadowBlur = Math.max(4, 3 * s * (W.dpr || 1));
      P(); ctx.fill();
      ctx.shadowBlur = 0; ctx.shadowColor = 'rgba(0,0,0,0)';
      // 角：两眼当中一只非常的角（短、粗、略弯）→ 折断，长出四只短而弯的角，向着天的四风 → 其中一角长出一个小角
      const h4 = lv('dnHorn4'), lt = lv('dnLittle');
      const horn = (bx, by, ang, L, w, bend) => {
        const c = Math.cos(ang), s_ = Math.sin(ang), nx = -s_, ny = c;
        const tx = bx + c * L + nx * bend * L, ty = by + s_ * L + ny * bend * L;
        const mxh = bx + c * L * 0.55 + nx * bend * L * 0.6, myh = by + s_ * L * 0.55 + ny * bend * L * 0.6;
        ctx.moveTo(bx + nx * w / 2, by + ny * w / 2);
        ctx.quadraticCurveTo(mxh + nx * w * 0.3, myh + ny * w * 0.3, tx, ty);
        ctx.quadraticCurveTo(mxh - nx * w * 0.3, myh - ny * w * 0.3, bx - nx * w / 2, by - ny * w / 2);
        ctx.closePath();
      };
      ctx.fillStyle = 'rgb(255,238,204)';
      ctx.globalAlpha = v * 0.92;
      ctx.beginPath();
      if (h4 < 0.5) horn(16.8, -19.5, -1.4, 6.6 * (1 - h4 * 1.6), 2.9, -0.3);
      else {
        const k4 = smoothstep(0.5, 1, h4);
        [[15.2, -2.35], [16.2, -1.9], [17.2, -1.45], [18.1, -1.0]].forEach(([bx, ang]) => horn(bx, -19.3 - (bx > 17 ? 0.4 : 0), ang, 4.4 * k4, 1.5, -0.3));
      }
      ctx.fill();
      if (lt > 0.01) {
        const bx = 17.2 + Math.cos(-1.45) * 2.6, by = -19.7 + Math.sin(-1.45) * 2.6;
        ctx.fillStyle = 'rgb(255,220,176)';
        ctx.beginPath(); horn(bx, by, -1.45, 3 + 17 * lt, 0.9, -0.1); ctx.fill();
        const tx = bx + Math.cos(-1.45) * (3 + 17 * lt), ty = by + Math.sin(-1.45) * (3 + 17 * lt);
        glowAt(ctx, SP.gold, tx, ty, 5, v * lt * 0.6);
        // 小角把星抛落：几点星火自角尖落下
        if (lt > 0.2 && lt < 0.995) {
          ctx.fillStyle = 'rgb(255,244,220)';
          for (let i = 0; i < 5; i++) {
            const q = U.fract(W.t * 0.45 + i * 0.2);
            ctx.globalAlpha = v * lt * (1 - q) * 0.9;
            ctx.fillRect(tx + (hsh(i * 3.1) - 0.3) * 10 * q - 0.5, ty + q * 26 - 0.5, 1.1, 1.1);
          }
        }
      }
      ctx.restore();
      if (broken && gp < 1 && !W.replaying) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.white, G.rx + 14 * s, G.ry - 14 * s, 40 * s * (1 - gp) * 10, v * 0.4); }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：南方王与北方王（11）——远山上的烽火起落；穿细麻衣的之光（10:5–6）
  // ════════════════════════════════════════════════════════════
  function drawKings(ctx) {
    const k = lv('dnKings');
    if (k < 0.005 || k > 0.995 || !SP) return;
    const bell = Math.sin(Math.PI * k), surge = Math.sin(Math.PI * k * 3);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const p = port();
    for (let side = 0; side < 2; side++) {
      const x0 = side ? (p ? 0.8 : 0.8) : (p ? 0.5 : 0.56), x1 = side ? 0.99 : (p ? 0.7 : 0.74);
      const push = (side ? -1 : 1) * surge * 0.05;
      const u = SU();
      ctx.fillStyle = side ? 'rgb(255,190,120)' : 'rgb(255,150,90)';
      for (let i = 0; i < 20; i++) {
        const xf = clamp(lerp(x0, x1, hsh(i * 3.3 + side * 50)) + push * hsh(i * 1.7), 0.02, 0.99);
        const y = gY(0, xf) - 1.5 - hsh(i * 4.1) * 4 * u;
        const tw = 0.6 + 0.4 * Math.sin(W.t * 5 + i * 2.1 + side);
        glowAt(ctx, SP.fire, xf * W.w, y, (7 + 6 * hsh(i * 9.1)) * u, bell * tw * 0.85);
        ctx.globalAlpha = bell * tw;
        ctx.fillRect(xf * W.w - 0.8 * u, y - 0.8 * u, 1.6 * u, 1.6 * u);
      }
      // 两军相交处的一团火光
      const mx = lerp(side ? x0 : x1, (x1 + x0) / 2, 0.2) * W.w;
      glowAt(ctx, SP.fire, mx, gY(0, mx / W.w) - 4 * u, 30 * u * (0.6 + 0.4 * Math.abs(surge)), bell * 0.35);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawLinenAura(ctx) {
    const a = lv('dnLinen');
    if (a < 0.01 || !SP || !has('linen')) return;
    const h = headTop('linen'), f = fig('linen');
    if (!h || !f) return;
    const hh = heightOf(f);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.blue, h[0], h[1] + hh * 0.5, hh * 1.3, a * 0.35);
    const flash = 0.7 + 0.3 * Math.max(0, Math.sin(W.t * 2.3)) + (Math.sin(W.t * 7.1) > 0.97 ? 0.4 : 0);
    glowAt(ctx, SP.white, h[0], h[1] + hh * 0.08, hh * 0.28, a * 0.8 * flash);
    glowAt(ctx, SP.gold, h[0], h[1] + hh * 0.42, hh * 0.18, a * 0.5);
    // 河面上的倒影
    glowAt(ctx, SP.pale, h[0], h[1] + hh * 1.25, hh * 0.9, a * 0.25, 0.25);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 智慧人必发光（12:3）：但以理身上柔和的金光
  function drawWise(ctx) {
    const a = lv('dnWise');
    if (a < 0.01 || !SP || !has('daniel')) return;
    const h = headTop('daniel'), f = fig('daniel');
    if (!h || !f) return;
    const hh = heightOf(f);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, h[0], h[1] + hh * 0.4, hh * 1.1, a * 0.5);
    glowAt(ctx, SP.white, h[0], h[1] + hh * 0.15, hh * 0.35, a * 0.5);
    glowAt(ctx, SP.warm, h[0], h[1] + hh * 0.95, hh * 1.4, a * 0.3, 0.3);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 有声音从天降下（4:31）：一道光柱落在王身上
  function drawVoice(ctx) {
    const a = lv('dnVoice');
    if (a < 0.01 || !SP) return;
    const c = headTop(S.king);
    if (!c) return;
    const bw = 60 * BK();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.5;
    ctx.drawImage(SP.beam, c[0] - bw / 2, -10, bw, c[1] + 30 * BK());
    glowAt(ctx, SP.white, c[0], c[1], 30 * BK(), a * 0.4);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 禁令的玉玺（6:9）
  function drawDecree(ctx) {
    const a = lv('dnDecree');
    if (a < 0.01 || !SP) return;
    const [x, y] = throneSeat(), k = BK();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x - 14 * k, y - 18 * k, 16 * k, a * 0.5);
    ctx.globalAlpha = a * 0.9;
    ctx.fillStyle = 'rgb(255,226,170)';
    ctx.fillRect(x - 19 * k, y - 22 * k, 9 * k, 6 * k);
    ctx.fillStyle = 'rgb(230,80,60)';
    ctx.beginPath(); ctx.arc(x - 14.5 * k, y - 19 * k, 1.6 * k, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：发光如星（12:2–3）——光点自全地升起，成为天上的星；天上的光
  // ════════════════════════════════════════════════════════════
  function riseModel() {
    return cached('rise', () => {
      const rng = U.mulberry32(1203), out = [];
      const N = (W.quality || 1) < 0.75 ? 120 : 210;
      for (let i = 0; i < N; i++) {
        const layer = rng() < 0.7 ? 2 : 1;
        const xf = layer === 2 ? lerp(0.4, 0.99, rng()) : lerp(0.52, 0.99, rng());
        const sy = layer === 2 ? fieldY(xf, rng() * 0.5) : gY(1, xf) + 1;
        const tx = rng() * W.w, ty = (port() ? lerp(0.35, 0.56, rng()) : lerp(0.04, 0.52, Math.pow(rng(), 1.3))) * W.h;
        out.push({ sx: xf * W.w, sy, tx, ty, d: rng() * 0.5, r: 0.8 + rng() * 1.4, ph: rng() * TAU, w: rng() });
      }
      return out;
    });
  }
  function drawRise(ctx) {
    const r = lv('dnRise'), st = lv('dnStars');
    if (r < 0.002 || !SP) return;
    const R = riseModel(), u = SU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of R) {
      const p = clamp((r - m.d) / 0.5, 0, 1);
      if (p <= 0) continue;
      const e = eInOut(p);
      const x = lerp(m.sx, m.tx, e) + Math.sin(p * 9 + m.ph) * 6 * u * (1 - p);
      const y = lerp(m.sy, m.ty, e);
      const tw = p < 1 ? 1 : 0.6 + 0.4 * Math.sin(W.t * (1.2 + m.w) + m.ph);
      const a = (p < 1 ? smoothstep(0, 0.1, p) : Math.max(0.55, st)) * tw;
      ctx.globalAlpha = a;
      ctx.fillStyle = p < 1 ? 'rgb(255,226,160)' : 'rgb(255,246,226)';
      const s = m.r * u * (p < 1 ? 1.1 : 1.5);
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
      if (p >= 1) { if (m.w > 0.72) glowAt(ctx, SP.white, x, y, 7 * m.r * u, a * 0.55); }
      else if (m.w > 0.45) glowAt(ctx, SP.gold, x, y, 6 * u, a * 0.5);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawFirm(ctx) {
    const f = lv('dnFirm');
    if (f < 0.01 || !SP) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(W.w * 0.52, W.h * (port() ? 0.44 : 0.2));
    ctx.rotate(-0.28);
    glowAt(ctx, SP.pale, 0, 0, W.w * 0.75, f * 0.22, 0.16);
    glowAt(ctx, SP.gold, W.w * 0.1, 0, W.w * 0.4, f * 0.12, 0.12);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 你必安歇（12:13）：但以理头上的一颗星，一道柔光垂到他身上（画在 'air' 层：在一切之上）
  function drawRest(ctx) {
    const rs = lv('dnRest');
    if (rs < 0.01 || !SP) return;
    const H = houseGeom(), u = SU();
    const h = has('daniel') ? headTop('daniel') : null;
    const x = h ? h[0] : H.x, y = port() ? W.h * 0.38 : W.h * 0.22;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const tw = 0.88 + 0.12 * Math.sin(W.t * 1.5);
    // 垂下的光
    if (h && h[1] > y) {
      const bw = 26 * u * (0.9 + 0.1 * Math.sin(W.t * 0.8));
      ctx.globalAlpha = rs * 0.32;
      ctx.drawImage(SP.beam, x - bw / 2, y, bw, h[1] - y + 14 * u);
      glowAt(ctx, SP.gold, x, h[1] + 8 * u, 26 * u, rs * 0.4);
    }
    glowAt(ctx, SP.gold, x, y, 70 * u, rs * 0.4);
    glowAt(ctx, SP.white, x, y, 26 * u * tw, rs);
    glowAt(ctx, SP.white, x, y, 9 * u, rs);
    ctx.strokeStyle = 'rgba(255,250,236,1)'; ctx.lineWidth = Math.max(1, 1.2 * u); ctx.lineCap = 'round';
    ctx.globalAlpha = rs * 0.75;
    const r1 = 24 * u * tw, r2 = 11 * u * tw;
    ctx.beginPath();
    ctx.moveTo(x - r1, y); ctx.lineTo(x + r1, y); ctx.moveTo(x, y - r1); ctx.lineTo(x, y + r1);
    ctx.moveTo(x - r2, y - r2); ctx.lineTo(x + r2, y + r2); ctx.moveTo(x - r2, y + r2); ctx.lineTo(x + r2, y - r2);
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 王在田野（4:33）：身被天露滴湿——身上一层淡淡的露光，田野里最亮的是他
  function drawNebDew(ctx) {
    const dw = lv('dnDew');
    if (dw < 0.02 || !SP || S.king !== 'neb' || !has('neb')) return;
    const f = fig('neb');
    if (!f || Math.abs(f.nx - (X().tree + fieldDX(port()))) > 0.03) return;
    const h = headTop('neb'), hh = heightOf(f), u = SU();
    if (!h) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, h[0] - (f.fd || 1) * hh * 0.15, h[1] + hh * 0.3, hh * 0.85, dw * 0.35);
    ctx.fillStyle = 'rgb(226,240,255)';
    for (let i = 0; i < 16; i++) {
      const px = h[0] + (hsh(i * 3.3) - 0.5 - 0.2 * (f.fd || 1)) * hh * 0.7, py = h[1] + (hsh(i * 5.9) * 0.75 - 0.05) * hh;
      const t = 0.5 + 0.5 * Math.sin(W.t * (1.6 + hsh(i * 7.1)) + i * 2.3);
      ctx.globalAlpha = dw * t * 0.9;
      const sz = (0.9 + 0.9 * t) * u;
      ctx.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      if (i % 4 === 0) glowAt(ctx, SP.white, px, py, 4 * u, dw * t * 0.5);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 从天而降的圣者（4:13）：白昼里也看得见的一团光
  function drawWatcher(ctx) {
    if (!SP || !has('watcher')) return;
    const h = headTop('watcher'), f = fig('watcher');
    if (!h || !f) return;
    const hh = heightOf(f), a = f.alpha == null ? 1 : f.alpha;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, h[0], h[1] + hh * 0.45, hh * 1.5, a * 0.45);
    glowAt(ctx, SP.white, h[0], h[1] + hh * 0.3, hh * 0.7, a * 0.6);
    glowAt(ctx, SP.white, h[0], h[1] + hh * 0.08, hh * 0.25, a * 0.8);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光：光柱、落叶、惊飞的鸟、坠落的星、飞来的加百列、传遍全地的谕旨
  // ════════════════════════════════════════════════════════════
  function drawFX(ctx) {
    if (!FXL.length || !SP) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const t = e.t - (e.delay || 0);
      if (t < 0) continue;
      const p = clamp(t / e.dur, 0, 1), u = SU();
      if (e.type === 'beam') {
        const x = e.xf * W.w, y = e.y != null ? e.y : gY(2, e.xf);
        const A = Math.sin(Math.PI * p) * (e.k || 1), w = e.w * BK() * (0.7 + 0.3 * p);
        ctx.globalAlpha = A * 0.5;
        ctx.drawImage(SP.beam, x - w / 2, -10, w, y + 10);
        glowAt(ctx, SP.gold, x, y - 20 * BK(), 40 * BK(), A * 0.4);
      } else if (e.type === 'leaves') {
        const TF = treeFrame();
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 40; i++) {
          const sx = TF.x + (hsh(i * 3.1) - 0.6) * TF.Hmax * 0.8, sy = TF.g - TF.Hmax * (0.4 + 0.5 * hsh(i * 5.7));
          const x = sx - p * (60 + 160 * hsh(i * 2.2)) * u + Math.sin(p * 8 + i) * 8 * u, y = sy + p * p * (TF.g - sy) * (0.7 + 0.3 * hsh(i));
          ctx.globalAlpha = (1 - p) * 0.9;
          ctx.fillStyle = css(i % 3 ? [70, 110, 56] : [140, 150, 70], 2);
          ctx.fillRect(x, y, 2.4 * u, 1.4 * u);
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'birds') {
        const TF = treeFrame();
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(30,28,34,1)'; ctx.lineWidth = Math.max(0.8, 1.1 * u);
        for (let i = 0; i < 14; i++) {
          const sx = TF.x + (hsh(i * 7.1) - 0.5) * TF.Hmax * 0.6, sy = TF.g - TF.Hmax * (0.5 + 0.4 * hsh(i * 1.3));
          const x = sx + (hsh(i * 4.4) - 0.3) * p * 0.5 * W.w, y = sy - p * (0.15 + 0.2 * hsh(i)) * W.h;
          const f = Math.sin(W.t * 14 + i) * 3 * u;
          ctx.globalAlpha = 1 - smoothstep(0.7, 1, p);
          ctx.beginPath(); ctx.moveTo(x - 4 * u, y - f); ctx.lineTo(x, y); ctx.lineTo(x + 4 * u, y - f); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'fall') {
        for (let i = 0; i < 7; i++) {
          const q = clamp(p * 1.4 - i * 0.06, 0, 1);
          if (q <= 0 || q >= 1) continue;
          const sx = (0.55 + hsh(i * 3.3) * 0.4) * W.w, sy = (0.05 + hsh(i * 1.9) * 0.15) * W.h;
          const x = sx - q * 0.08 * W.w, y = lerp(sy, W.horizonY + 0.1 * W.h * hsh(i), q * q);
          ctx.globalAlpha = 1 - q;
          ctx.strokeStyle = 'rgba(255,240,210,1)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.02 * W.w, y - 0.05 * W.h); ctx.stroke();
          glowAt(ctx, SP.white, x, y, 5 * u, 1 - q);
        }
      } else if (e.type === 'streak') {
        const x = lerp(e.x0, e.x1, eInOut(p)), y = lerp(e.y0, e.y1, eInOut(p));
        for (let i = 0; i < 8; i++) {
          const q = Math.max(0, eInOut(p) - i * 0.03);
          glowAt(ctx, SP.gold, lerp(e.x0, e.x1, q), lerp(e.y0, e.y1, q), (10 - i) * u, (1 - i / 8) * 0.5 * Math.sin(Math.PI * p) + 0.1);
        }
        glowAt(ctx, SP.white, x, y, 14 * u, 0.9 * (1 - p * 0.5));
      } else if (e.type === 'decree') {
        const P_ = X(), x0 = P_.throne * W.w, y0 = palGeom().top;
        ctx.fillStyle = 'rgb(255,228,170)';
        for (let i = 0; i < 24; i++) {
          const q = clamp(p * 1.3 - hsh(i * 2.1) * 0.3, 0, 1);
          if (q <= 0 || q >= 1) continue;
          const tx = (0.05 + 0.9 * hsh(i * 5.9)) * W.w, ty = (0.45 + 0.12 * hsh(i * 3.7)) * W.h;
          const x = lerp(x0, tx, q), y = lerp(y0, ty, q) - Math.sin(Math.PI * q) * 0.12 * W.h;
          ctx.globalAlpha = Math.sin(Math.PI * q);
          ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
          glowAt(ctx, SP.gold, x, y, 4 * u, Math.sin(Math.PI * q) * 0.5);
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {
      GKEY = ''; GC = {}; MGK = '';
      const p = port();
      if (LASTP !== null && p !== LASTP && isCur()) U.safe('daniel.remap', () => remapCast(LASTP, p));
      LASTP = p;
    },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) {
        const e = FXL[i];
        e.t += f;
        if (e.t >= (e.delay || 0) + e.dur) FXL.splice(i, 1);
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      if (pass === 'sky') { U.safe('daniel.firm', () => drawFirm(ctx)); return; }
      if (pass === 'seaFar') {
        U.safe('daniel.statue', () => drawStatue(ctx));
        U.safe('daniel.beasts', () => drawBeasts(ctx));
        U.safe('daniel.throne', () => drawThroneV(ctx));
        U.safe('daniel.son', () => drawSon(ctx));
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        return;
      }
      if (pass === 'far') { U.safe('daniel.mount', () => drawMountain(ctx)); U.safe('daniel.kings', () => drawKings(ctx)); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; return; }
      if (pass === 'mid') { U.safe('daniel.city', () => drawCity(ctx)); ctx.globalAlpha = 1; return; }
      if (pass === 'near') {
        U.safe('daniel.river', () => drawRiver(ctx));
        const P_ = X(), k = BK();
        P_.palmsN.forEach((f, j) => palm(ctx, 2, f * W.w, gY(2, f) + 2 * k, (50 + 10 * hsh(j * 2.7)) * k, k, j + 7));
        U.safe('daniel.den', () => drawDen(ctx));
        U.safe('daniel.house', () => drawHouse(ctx));
        U.safe('daniel.winray', () => drawWinRay(ctx));
        U.safe('daniel.furnace', () => drawFurnace(ctx));
        U.safe('daniel.image', () => drawGoldImage(ctx));
        U.safe('daniel.tree', () => drawTree(ctx));
        U.safe('daniel.palace', () => drawPalace(ctx));
        U.safe('daniel.writing', () => drawWriting(ctx));
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        return;
      }
      if (pass === 'air') {
        U.safe('daniel.front', () => drawFurnaceFront(ctx));
        U.safe('daniel.houselight', () => drawHouseLight(ctx));
        U.safe('daniel.scale', () => drawScale(ctx));
        U.safe('daniel.decree', () => drawDecree(ctx));
        U.safe('daniel.voice', () => drawVoice(ctx));
        U.safe('daniel.linen', () => drawLinenAura(ctx));
        U.safe('daniel.wise', () => drawWise(ctx));
        U.safe('daniel.rest', () => drawRest(ctx));
        U.safe('daniel.nebdew', () => drawNebDew(ctx));
        U.safe('daniel.watcher', () => drawWatcher(ctx));
        U.safe('daniel.rise', () => drawRise(ctx));
        U.safe('daniel.ramgoat', () => drawRamGoat(ctx));
        U.safe('daniel.fx', () => drawFX(ctx));
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const P_ = X(), k = BK(), G = palGeom();
      consider('王宫', (G.x0 + G.x1) / 2, G.ttop + 30 * k);
      consider('宝座', P_.throne * W.w, gY(2, P_.throne) - 30 * k);
      consider('灯台', P_.lamp * W.w, gY(2, P_.lamp) - 36 * k);
      const Pn = panelRect();
      consider('粉墙', (Pn.x0 + Pn.x1) / 2, (Pn.y0 + Pn.y1) / 2);
      if (lv('dnHouse') > 0.5) { const H = houseGeom(); consider('但以理的家', H.x, H.yT); }
      consider('大河', rivPt(0.35)[0], rivPt(0.35)[1]);
      consider('巴比伦城', P_.zig * W.w, gY(1, P_.zig) - 50 * PKm());
      if (lv('dnMount') > 0.2) { const Sg = statueGeom(); consider('大山', Sg.cx, W.waterlineY(0) - (port() ? 0.24 : 0.38) * W.h * lv('dnMount') * 0.8); }
      if (lv('dnGold') > 0.5) consider('金像', P_.image * W.w, gY(2, P_.image) - 160 * k);
      if (lv('dnFurnace') > 0.5) { const F = furnGeom(); consider('烈火的窑', F.x, F.g - F.H * 0.6); }
      if (lv('dnTree') > 0.5 && lv('dnFell') < 0.5) { const TF = treeFrame(); consider('大树', TF.x, TF.g - TF.Hmax * 0.6); }
      if (lv('dnStump') > 0.5) { const TF = treeFrame(); consider('树墩', TF.x, TF.g - 8 * k); }
      if (lv('dnDen') > 0.5) { const D = denGeom(); consider('狮子坑', D.mx, D.g - 4 * k); consider('狮子', D.x + 0.12 * D.w, D.floor - 10 * k); }
      if (lv('dnStars') > 0.5) consider('众星', W.w * 0.5, W.h * (port() ? 0.45 : 0.25));
      return best;
    },
  };

  let LASTP = null;
  function resetScene() {
    FXL.length = 0;
    S = fresh();
    AP = LASTP = port();
  }

  // ════════════════════════════════════════════════════════════
  //  几件常用的事
  // ════════════════════════════════════════════════════════════
  function toThrone(id) { attach(id, () => throneSeat()); pose(id, 'seat'); face(id, -1); S.king = id; S.seat = 'throne'; }
  function toBed(id) { attach(id, () => bedTop()); pose(id, 'lie'); face(id, -1); S.king = id; S.seat = 'bed'; }
  function offSeat(id) { attach(id, null); if (S.king === id) S.seat = null; }
  function toRoom(id, p) { attach(id, roomFloor); pose(id, p || 'pray'); face(id, 1); if (id === 'daniel') S.dan = 'room'; }
  function offRoom(id) { attach(id, null); place(id, (AP ? XP : XL).house + 0.012); if (id === 'daniel') S.dan = 'ground'; }
  const walkT = (x0, x1, sp) => Math.abs(x1 - x0) / sp;
  const YOUTHS = ['daniel', 'hananiah', 'mishael', 'azariah'];
  const THREE = ['hananiah', 'mishael', 'azariah'];

  // ════════════════════════════════════════════════════════════
  //  幕后布置：巴比伦，尼布甲尼撒在位；被掳的四个少年人在王宫前
  // ════════════════════════════════════════════════════════════
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.55, herbs: 0.3, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1, bare: 0.45, bloom: 0.25 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k in LVL) W.set(k, 0, true);
    W.set('dnHouse', 1, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('trees', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.45, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 4, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const P_ = X();
    const c = C();
    c.clear({ fade: false });
    add('neb', { label: '尼布甲尼撒王', sex: 'm', age: 'adult', x: P_.throne, facing: -1, robe: ROBE.neb, glow: 0.35, hair: 'cloth', accent: GOLDA, beard: true, from: 'none' });
    toThrone('neb');
    add('daniel', { label: '但以理', sex: 'm', age: 'adult', x: P_.youth[3], facing: 1, robe: ROBE.daniel, glow: 0.4, hair: 'short', from: 'none' });
    add('hananiah', { label: '哈拿尼雅', sex: 'm', age: 'adult', x: P_.youth[2], facing: 1, robe: ROBE.hananiah, glow: 0.2, hair: 'short', from: 'none' });
    add('mishael', { label: '米沙利', sex: 'm', age: 'adult', x: P_.youth[1], facing: 1, robe: ROBE.mishael, glow: 0.2, hair: 'short', from: 'none' });
    add('azariah', { label: '亚撒利雅', sex: 'm', age: 'adult', x: P_.youth[0], facing: 1, robe: ROBE.azariah, glow: 0.2, hair: 'short', from: 'none' });
    add('eunuch', { label: '太监长', sex: 'm', age: 'adult', x: P_.eunuch, facing: -1, robe: ROBE.eunuch, glow: 0.15, hair: 'cloth', accent: [150, 110, 70], from: 'none' });
    avoid([0.44, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 神使但以理蒙恩惠：素菜与白水，十天，胜过十倍（第 1 章）────────
    {
      kind: 'act', utter: '神使但以理在太监长眼前蒙恩惠，受怜悯', cmd: 'diet --days 10 --menu 素菜,白水 --for 但以理,哈拿尼雅,米沙利,亚撒利雅', ref: '1:9',
      verse: [
        { text: '但以理却立志不以王的膳和王所饮的酒玷污自己，……<br>「求你试试仆人们十天，给我们素菜吃，白水喝……」', ref: '但以理书 1:8–12', hold: 7.5 },
        { text: '过了十天，见他们的面貌比用王膳的一切少年人更加俊美肥胖。', ref: '但以理书 1:15', hold: 5.5 },
        { text: '这四个少年人，神在各样文字学问上赐给他们聪明知识；<br>但以理又明白各样的异象和梦兆。', ref: '但以理书 1:17', hold: 6.5 },
        { text: '王考问他们一切事，就见他们的智慧聪明比通国的术士和用法术的胜过十倍。', ref: '但以理书 1:20', hold: 6 },
      ],
      apply(c) {
        const P_ = X();
        const hall = [lerp(P_.hall0, P_.hall1, 0.36), lerp(P_.hall0, P_.hall1, 0.5), lerp(P_.hall0, P_.hall1, 0.64), lerp(P_.hall0, P_.hall1, 0.78)];
        // 用王膳的少年人：围坐在王的矮案两边
        const pale = port() ? [P_.table - 0.02, P_.table + 0.019] : [P_.table - 0.016, P_.table + 0.018];
        const ask = P_.eunuch - 0.018;
        T(c, [
          [0, b => {
            W.set('dnTable', 1, b.instant);
            glow('eunuch', 0.4);
            beam(b, P_.eunuch, { w: 40, dur: 4, k: 0.7 });
            sfx(b, 'harp', { soft: true });
          }],
          [0.6, () => { walk('daniel', ask, { speed: 0.03, pose: 'bow' }); face('daniel', 1); }],
          [3.8, () => { pose('daniel', 'stand'); pose('eunuch', 'stand'); }],
          [4.3, () => { walk('daniel', P_.youth[3], { speed: 0.035 }); face('daniel', 1); }],
          [4.8, () => {
            crowd('pale', { n: 2, x0: pale[0], x1: pale[1], label: '用王膳的少年人', pose: 'sit' }, dressAs(PALE, { sex: 'm', hair: 'short', v0: 0.01, v1: 0.05, seed: 0.9 }));
            placeCrowd('pale', pale);
            cface('pale', P_.table);
          }],
          [5.2, b => { W.set('dnVeg', 1, b.instant); W.goTo(W.REST, 1.2, b.instant); sfx(b, 'splash', { soft: true }); }],
          // 十天：日子一天一天过去（三轮昼夜代表）
          [6.6, b => { YOUTHS.forEach(id => pose(id, 'sit')); W.passDay(3.2, b.instant); }],
          [9.8, b => { W.passDay(3.2, b.instant); }],
          [13, b => { W.passDay(3.2, b.instant); }],
          [16.5, b => {
            YOUTHS.forEach(id => { pose(id, 'stand'); glow(id, 0.55); sparkleOn(b, id, 12, [255, 236, 190], 0.2); });
            cpose('pale', 'stand');
            W.set('dnVeg', 0, b.instant);
          }],
          [17.5, () => {
            walk('eunuch', lerp(P_.hall0, P_.hall1, 0.2), { speed: 0.04 });
            YOUTHS.forEach((id, i) => walk(id, hall[3 - i], { speed: 0.04 }));
          }],
          [18.2, b => { crm('pale'); W.set('dnTable', 0, b.instant); }],
          [19, () => {
            crowd('magi', { n: port() ? 2 : 3, x0: lerp(P_.hall0, P_.hall1, 0.02), x1: lerp(P_.hall0, P_.hall1, 0.14), label: '术士', pose: 'stand' },
              dressAs(MAGI, { sex: 'm', hair: 'cloth', beard: true, v0: 0.02, v1: 0.08, prop: 'staff' }));
            cface('magi', 1);
          }],
          [17.5 + walkT(P_.youth[0], hall[3], 0.04) + 0.3, b => {
            YOUTHS.forEach(id => { face(id, 1); glow(id, 0.75); });
            face('eunuch', 1);
            cpose('magi', 'bow');
            if (!b.instant && fx()) { const h = headTop('daniel'); if (h) fx().ring(h[0], h[1], [255, 236, 190], M() * 0.2, 2.4, 1.6); }
            sfx(b, 'chime');
          }],
        ]);
      },
    },

    // ── 2 他显明深奥隐秘的事：王的梦，灭绝哲士的命令，夜间的异象（2:1–23）──
    {
      kind: 'act', utter: '他显明深奥隐秘的事', cmd: 'reveal --secret 王的梦 --to 但以理 --at 夜间异象', ref: '2:22',
      verse: [
        { text: '尼布甲尼撒在位第二年，他做了梦，心里烦乱，不能睡觉。', ref: '但以理书 2:1', hold: 5.5 },
        { text: '因此，王气忿忿地大发烈怒，吩咐灭绝巴比伦所有的哲士。<br>……人就寻找但以理和他的同伴，要杀他们。', ref: '但以理书 2:12–13', hold: 7 },
        { text: '但以理回到他的居所，……要他们祈求天上的神施怜悯，将这奥秘的事指明……', ref: '但以理书 2:17–18', hold: 6.5 },
        { text: '这奥秘的事就在夜间异象中给但以理显明，但以理便称颂天上的神。', ref: '但以理书 2:19', hold: 6 },
      ],
      apply(c) {
        const P_ = X();
        const hx = P_.house;
        const front = [hx - 0.034, hx - 0.018, hx + 0.034, hx + 0.05];
        T(c, [
          [0, b => {
            W.goTo(0.93, 6, b.instant);
            W.set('dnBed', 1, b.instant);
            rm('eunuch');
            YOUTHS.forEach(id => glow(id, id === 'daniel' ? 0.4 : 0.2));
            ['azariah', 'mishael', 'hananiah', 'daniel'].forEach((id, i) => walk(id, front[i], { speed: 0.05 }));
            cwalk('magi', P_.court - 0.03, P_.court + 0.004, { speed: 0.03 });
            cface('magi', 1);
            offSeat('neb');
            walk('neb', P_.bed, { speed: 0.03 });
          }],
          [2.2, b => { toBed('neb'); W.set('dnHall', 0.7, b.instant); }],
          [5.5, b => { pose('neb', 'sit'); W.set('dnWrath', 0.35, b.instant); }],
          [7, () => { cwalk('magi', lerp(P_.hall0, P_.hall1, 0.1), lerp(P_.hall0, P_.hall1, 0.36), { speed: 0.04 }); cface('magi', 1); }],
          [10, b => {
            offSeat('neb'); S.seat = null; place('neb', P_.bed - 0.01); pose('neb', 'point'); face('neb', -1);
            W.set('dnWrath', 1, b.instant);
            cpose('magi', 'kneel');
            sfx(b, 'thunder', { soft: true, low: true });
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.25);
          }],
          [12.5, () => {
            add('arioch', { label: '护卫长亚略', sex: 'm', age: 'adult', x: P_.court, facing: -1, robe: ROBE.arioch, glow: 0.1, prop: 'blade', hair: 'cloth', beard: true });
            walk('arioch', hx + 0.075, { speed: 0.05, pose: 'stand' });
          }],
          [15.5, () => { face('daniel', 1); pose('daniel', 'bow'); }],
          [17.5, b => { pose('arioch', 'stand'); face('arioch', 1); W.set('dnWrath', 0.4, b.instant); pose('neb', 'stand'); }],
          [18.2, b => {
            ['hananiah', 'mishael', 'azariah', 'daniel'].forEach(id => { pose(id, 'pray'); face(id, 1); });
            W.set('dnWin', 0.5, b.instant);
          }],
          [23.2, b => {
            W.set('dnReveal', 1, b.instant);
            sfx(b, 'angel', { soft: true });
            glow('daniel', 0.9);
          }],
          [25.2, b => { pose('daniel', 'raise'); ['hananiah', 'mishael', 'azariah'].forEach(id => pose(id, 'gaze')); sparkleOn(b, 'daniel', 24, [255, 240, 200], 0.3); }],
        ]);
      },
    },

    // ── 3 天上的神必另立一国：大像，非人手凿出的石头，充满天下的大山（2:24–49）★
    {
      kind: 'act', utter: '天上的神必另立一国，永不败坏', cmd: 'strike 大像 --with "非人手凿出来的石头" && grow 石头 → 大山 --fill 天下', ref: '2:44',
      verse: [
        { text: '「王啊，你梦见一个大像，……这像的头是精金的，胸膛和膀臂是银的，<br>肚腹和腰是铜的，腿是铁的，脚是半铁半泥的。」', ref: '但以理书 2:31–33', hold: 6.5 },
        { text: '「你观看，见有一块非人手凿出来的石头打在这像半铁半泥的脚上，把脚砸碎……」', ref: '但以理书 2:34', hold: 6 },
        { text: '「于是金、银、铜、铁、泥都一同砸得粉碎，成如夏天禾场上的糠秕，被风吹散，无处可寻。<br>打碎这像的石头变成一座大山，充满天下。」', ref: '但以理书 2:35', hold: 7 },
        { text: '当时，尼布甲尼撒王俯伏在地，向但以理下拜……<br>于是王高抬但以理，……派他管理巴比伦全省。', ref: '但以理书 2:46–48', hold: 6.5 },
      ],
      apply(c) {
        const P_ = X();
        const dx = lerp(P_.hall0, P_.hall1, 0.52);
        T(c, [
          [0, b => {
            W.goTo(0.265, 17, b.instant);
            W.set('dnReveal', 0, b.instant); W.set('dnWin', 0, b.instant); W.set('dnBed', 0, b.instant); W.set('dnWrath', 0.15, b.instant);
            walk('arioch', lerp(P_.hall0, P_.hall1, 0.3), { speed: 0.06 });
            walk('daniel', dx, { speed: 0.06 });
            glow('daniel', 0.6);
            ['hananiah', 'mishael', 'azariah'].forEach(id => pose(id, 'stand'));
            walk('neb', P_.throne, { speed: 0.03 });
            cpose('magi', 'stand');
          }],
          [2.1, () => { toThrone('neb'); }],
          [3, b => {
            W.set('dnImage', 1, b.instant);
            sfx(b, 'stars'); sfx(b, 'harp', { soft: true });
          }],
          [0.2 + walkT(P_.house + 0.05, dx, 0.06) + 0.2, () => { face('daniel', 1); face('arioch', 1); pose('daniel', 'raise'); }],
          // 2:34 的一行经文显出时，石头飞来，打在脚上
          [8.8, b => { W.set('dnStone', 1, b.instant); sfx(b, 'wind'); pose('daniel', 'point'); }],
          [10.5, b => {
            sfx(b, 'thunder', { soft: true });
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.35); W.shake = Math.max(W.shake || 0, 0.3); }
            if (!b.instant && fx()) { const G = statueGeom(); fx().ring(G.cx - 4 * G.u, G.bot - 4 * G.u, [255, 240, 210], M() * 0.1, 1.6, 1.2); }
          }],
          // 2:35：一同砸得粉碎，如糠秕被风吹散；石头变成一座大山
          [15.6, b => {
            W.set('dnShatter', 1, b.instant);
            W.set('gale', 0.55, b.instant);
            sfx(b, 'thunder');
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.5); W.shake = Math.max(W.shake || 0, 0.5); }
          }],
          [18, b => { W.set('dnMount', 1, b.instant); W.set('dnMountGlow', 1, b.instant); sfx(b, 'build', { low: true, soft: true }); }],
          [22, b => { W.set('gale', 0.08, b.instant); }],
          // 2:46：王俯伏在地，向但以理下拜（跪下，不是仆倒）
          [23.6, b => {
            offSeat('neb'); walk('neb', dx + 0.03, { speed: 0.03, pose: 'kneel' });
            pose('daniel', 'stand');
            cpose('magi', 'bow');
            sfx(b, 'crowd', { soft: true });
          }],
          [23.6 + walkT(P_.throne, dx + 0.03, 0.03) + 0.4, b => {
            face('neb', -1);
            add('daniel', { accent: GOLDA });
            glow('daniel', 0.8);
            sparkleOn(b, 'daniel', 28, [255, 226, 150], 0.35);
            sfx(b, 'chime');
          }],
          [28.5, b => { W.set('dnImage', 0, b.instant); }],
        ]);
      },
    },

    // ── 4 神能将我们从烈火的窑中救出来：杜拉平原的金像，烧热七倍的窑（3:1–23）──
    {
      kind: 'act', utter: '神能将我们从烈火的窑中救出来', cmd: 'heat 窑 --x7 && bind 沙得拉 米煞 亚伯尼歌 --into 窑', ref: '3:17',
      verse: [
        { text: '尼布甲尼撒王造了一个金像，高六十肘，宽六肘，立在巴比伦省杜拉平原。', ref: '但以理书 3:1', hold: 6 },
        { text: '「……你们一听见角、笛、琵琶、琴、瑟、笙，和各样乐器的声音，<br>就当俯伏敬拜尼布甲尼撒王所立的金像。凡不俯伏敬拜的，必立时扔在烈火的窑中。」', ref: '但以理书 3:5–6', hold: 7.5 },
        { text: '「即或不然，王啊，你当知道我们决不事奉你的神，也不敬拜你所立的金像。」', ref: '但以理书 3:18', hold: 6 },
        { text: '当时，尼布甲尼撒怒气填胸，……吩咐人把窑烧热，比寻常更加七倍；<br>……沙得拉、米煞、亚伯尼歌这三个人都被捆着落在烈火的窑中。', ref: '但以理书 3:19–23', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const n = port() ? 4 : 6;
        const cr = slots(P_.crowd0, P_.crowd1, n);
        const three = [P_.crowd0 + 0.008, lerp(P_.crowd0, P_.crowd1, 0.5) + 0.004, P_.crowd1 - 0.004];
        const before = [P_.kingD + 0.018, P_.kingD + 0.03, P_.kingD + 0.042];
        const F = P_.furn;
        const inside = [F - 0.016 * (port() ? 1.6 : 1), F, F + 0.016 * (port() ? 1.6 : 1)];
        T(c, [
          [0, b => {
            W.goTo(0.47, 6, b.instant);
            W.set('dnHouse', 0, b.instant);
            W.set('dnWrath', 0, b.instant); W.set('dnHall', 0, b.instant); W.set('gale', 0, b.instant);
            W.set('dnImage', 0, true); W.set('dnStone', 0, true); W.set('dnShatter', 0, true);
            W.set('dnMount', 0.3, b.instant); W.set('dnMountGlow', 0, b.instant);
            add('hananiah', { label: '沙得拉' }); add('mishael', { label: '米煞' }); add('azariah', { label: '亚伯尼歌' });
            rm('arioch'); crm('magi');
            walk('daniel', lerp(P_.hall0, P_.hall1, 0.62), { speed: 0.04 });
            THREE.forEach((id, i) => walk(id, three[i], { speed: 0.045 }));
          }],
          [0.4, b => { W.set('dnGold', 1, b.instant); sfx(b, 'build', { soft: true }); }],
          [1, () => {
            crowd('offi', { n, x0: P_.crowd0, x1: P_.crowd1, label: '各省的官员', pose: 'stand' }, dressAs(OFFI, { sex: 'm', hair: 'cloth', beard: true, v0: 0.04, v1: 0.14, seed: 0.3 }));
            placeCrowd('offi', cr.map((x, i) => x + (i % 2 ? 0.006 : -0.006)));
            cface('offi', -1);
          }],
          [1.5, () => { offSeat('neb'); pose('neb', 'stand'); walk('neb', P_.kingD, { speed: 0.055 }); }],
          [2, b => { W.set('dnFurnace', 1, b.instant); W.set('dnHeat', 0.3, b.instant); }],
          [6.8, b => {
            cpose('offi', 'pray');
            THREE.forEach(id => { face(id, -1); glow(id, 0.35); });
            sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
          }],
          [1.5 + walkT(dx0(), P_.kingD, 0.055) + 0.3, () => { face('neb', 1); }],
          [10.5, b => {
            W.set('dnWrath', 1, b.instant);
            sfx(b, 'fire', { low: true, soft: true });
            THREE.forEach((id, i) => walk(id, before[i], { speed: 0.035 }));
          }],
          [10.5 + walkT(three[0], before[0], 0.035) + 0.3, b => {
            THREE.forEach(id => { face(id, -1); glow(id, 0.6); sparkleOn(b, id, 10, [255, 236, 190], 0.25); });
          }],
          [18.8, b => {
            W.set('dnHeat', 1, b.instant);
            sfx(b, 'fire');
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.2);
            add('sold1', { label: '壮士', sex: 'm', age: 'adult', x: before[2] + 0.02, facing: -1, robe: ROBE.soldier, glow: 0.05, hair: 'short', beard: true });
            add('sold2', { label: '壮士', sex: 'm', age: 'adult', x: before[2] + 0.035, facing: -1, robe: [118, 92, 70], glow: 0.05, hair: 'short', beard: true });
          }],
          [19.8, () => {
            THREE.forEach((id, i) => walk(id, inside[i], { speed: 0.03, pose: 'lie' }));
            walk('sold1', F + 0.042 * (port() ? 1.5 : 1), { speed: 0.03 });
            walk('sold2', F + 0.056 * (port() ? 1.5 : 1), { speed: 0.03 });
          }],
          [19.8 + walkT(before[2] + 0.035, F + 0.056, 0.03) + 0.5, () => { pose('sold1', 'fall'); pose('sold2', 'fall'); }],
          [27.2, () => { rm('sold1'); rm('sold2'); }],
        ]);
      },
    },

    // ── 5 他差遣使者救护倚靠他的仆人：火中四人游行（3:24–30）★ ─────
    {
      kind: 'act', utter: '他差遣使者救护倚靠他的仆人', cmd: 'spawn 第四个 --in 窑 --like 神子 && unbind --all', ref: '3:28',
      verse: [
        { text: '那时，尼布甲尼撒王惊奇，急忙起来，……王说：<br>「看哪，我见有四个人，并没有捆绑，在火中游行，也没有受伤；那第四个的相貌好像神子。」', ref: '但以理书 3:24–25', hold: 8 },
        { text: '于是，尼布甲尼撒就近烈火窑门，说：<br>「至高神的仆人沙得拉、米煞、亚伯尼歌出来，上这里来吧！」', ref: '但以理书 3:26', hold: 6.5 },
        { text: '……见火无力伤他们的身体，头发也没有烧焦，衣裳也没有变色，并没有火燎的气味。', ref: '但以理书 3:27', hold: 6 },
        { text: '尼布甲尼撒说：「沙得拉、米煞、亚伯尼歌的神是应当称颂的！<br>他差遣使者救护倚靠他的仆人……」', ref: '但以理书 3:28', hold: 6 },
      ],
      apply(c) {
        const P_ = X(), F = P_.furn, pk = port() ? 1.6 : 1;
        const walkA = [F - 0.02 * pk, F + 0.012 * pk, F - 0.006 * pk, F + 0.02 * pk];
        const out = [F + 0.05 * pk, F + 0.064 * pk, F + 0.078 * pk];
        const n = port() ? 4 : 6;
        T(c, [
          [0, b => {
            THREE.forEach(id => pose(id, 'stand'));
            add('fourth', { label: '第四个', sex: 'm', age: 'adult', x: F + 0.004 * pk, facing: 1, angel: true, glow: 1, from: b.instant ? 'none' : 'light' });
            W.set('dnFourth', 1, b.instant);
            sfx(b, 'angel');
          }],
          [1.2, () => {
            walk('hananiah', walkA[0], { speed: 0.008 }); walk('mishael', walkA[1], { speed: 0.008 }); walk('azariah', walkA[2], { speed: 0.008 });
            walk('fourth', walkA[3], { speed: 0.008 });
          }],
          [2.5, b => { W.set('dnWrath', 0, b.instant); pose('neb', 'point'); cpose('offi', 'gaze'); }],
          [4.5, () => { walk('neb', F + 0.05 * pk, { speed: 0.03, pose: 'point' }); }],
          [5.2, () => { cpose('offi', 'stand'); cwalk('offi', P_.crowd0 - 0.01, P_.crowd1 - 0.01, { speed: 0.02 }); cface('offi', -1); }],
          [6.5, () => {
            walk('hananiah', walkA[2], { speed: 0.008 }); walk('mishael', walkA[0], { speed: 0.008 }); walk('azariah', walkA[1] - 0.004, { speed: 0.008 });
            walk('fourth', F, { speed: 0.006 });
          }],
          [4.5 + walkT(P_.kingD, F + 0.05 * pk, 0.03) + 0.4, b => { face('neb', -1); pose('neb', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [10.5, () => {
            walk('neb', out[2] + 0.02 * pk, { speed: 0.03 });
            THREE.forEach((id, i) => walk(id, out[i], { speed: 0.025 }));
          }],
          [13.5, b => { rm('fourth'); W.set('dnFourth', 0, b.instant); W.set('dnHeat', 0.12, b.instant); }],
          [10.5 + walkT(walkA[0], out[2], 0.025) + 0.3, b => {
            face('neb', -1);
            THREE.forEach(id => { face(id, 1); glow(id, 0.7); sparkleOn(b, id, 16, [255, 240, 210], 0.3); });
            cwalk('offi', out[2] + 0.04 * pk, P_.crowd1, { speed: 0.03 });
            cface('offi', -1);
          }],
          [22.5, b => { pose('neb', 'raise'); sfx(b, 'harp'); if (!b.instant && fx()) { const h = headTop('neb'); if (h) fx().ring(h[0], h[1], [255, 226, 160], M() * 0.2, 2.4, 1.4); } }],
          [22.7, () => { cpose('offi', 'bow'); }],
        ]);
      },
    },

    // ── 6 伐倒这树！砍下枝子！：地当中的大树，守望的圣者（4:1–27）──────
    {
      kind: 'cmd', utter: '伐倒这树！砍下枝子！', cmd: 'fell 树 --keep 根 --bind 铁圈,铜圈 --dew 天露', ref: '4:14',
      verse: [
        { text: '「我在床上脑中的异象是这样：我看见地当中有一棵树，极其高大。<br>那树渐长，而且坚固，高得顶天，从地极都能看见。」', ref: '但以理书 4:10–11', hold: 7.5 },
        { text: '「叶子华美，果子甚多，可作众生的食物；<br>田野的走兽卧在荫下，天空的飞鸟宿在枝上……」', ref: '但以理书 4:12', hold: 6 },
        { text: '「……见有一位守望的圣者从天而降。大声呼叫说：<br>『伐倒这树！砍下枝子！摇掉叶子！抛散果子！……』」', ref: '但以理书 4:13–14', hold: 6.5 },
        { text: '「……用铁圈和铜圈箍住，在田野的青草中让天露滴湿……<br>好叫世人知道至高者在人的国中掌权……」', ref: '但以理书 4:15–17', hold: 6.5 },
      ],
      apply(c) {
        const P_ = X();
        const TX = P_.tree;
        T(c, [
          [0, b => {
            W.goTo(0.29, 10, b.instant);
            W.set('dnGold', 0, b.instant); W.set('dnFurnace', 0, b.instant); W.set('dnHeat', 0, b.instant);
            crm('offi');
            THREE.forEach(id => rm(id));
            glow('daniel', 0.5);
            walk('neb', P_.bed, { speed: 0.06 });
            W.set('dnBed', 1, b.instant);
            W.set('dnHall', 0.5, b.instant);
          }],
          [1.6, b => { W.set('dnTree', 1, b.instant); sfx(b, 'wind', { soft: true }); }],
          [0.6 + walkT(out3(), P_.bed, 0.06) + 0.3, () => { toBed('neb'); }],
          [4, () => {
            herd('beasts', { kind: 'cow', n: port() ? 2 : 3, x0: TX - 0.06, x1: TX - 0.02, pose: 'lie', label: '田野的走兽' });
            herd('flock', { kind: 'sheep', n: port() ? 2 : 3, x0: TX + 0.025, x1: TX + 0.07, pose: 'lie', label: '田野的走兽' });
          }],
          [6.5, b => { W.set('dnBirds', 1, b.instant); sfx(b, 'bird', { soft: true }); }],
          [12.5, b => {
            add('watcher', { label: '守望的圣者', sex: 'm', age: 'adult', x: TX + 0.05, facing: -1, angel: true, glow: 1, scale: 1.3, from: b.instant ? 'none' : 'light' });
            hover('watcher', 0.05);
            fly('watcher', TX + 0.05, port() ? 0.52 : 0.4, { dur: 3 });
            beam(b, TX + 0.05, { w: 64, dur: 7.5, k: 1 });
            sfx(b, 'angel');
          }],
          [15.2, b => {
            pose('watcher', 'raise');
            sfx(b, 'thunder', { soft: true });
            if (!b.instant && fx()) { const h = headTop('watcher'); if (h) fx().ring(h[0], h[1], [255, 240, 210], M() * 0.3, 2.2, 1.6); }
          }],
          [16, b => {
            W.set('dnFell', 1, b.instant);
            W.set('dnBirds', 0, b.instant);
            fxAdd(b, { type: 'leaves', dur: 4 });
            fxAdd(b, { type: 'birds', dur: 4.5 });
            sfx(b, 'wind'); sfx(b, 'wings');
            // 走兽与羊惊散几步，在原野上渐渐隐去（不走进殿里，也不走过河口）
            cwalk('beasts', TX - 0.075, TX - 0.05, { speed: 0.03 });
            cwalk('flock', TX + 0.075, TX + 0.105, { speed: 0.03 });
          }],
          [20.5, b => {
            W.set('dnStump', 1, b.instant); W.set('dnDew', 1, b.instant);
            crm('beasts'); crm('flock');
            sfx(b, 'seal', { soft: true });
          }],
          [21.5, () => { fly('watcher', TX + 0.05, -0.1, { dur: 3 }); }],
          [24.8, () => { rm('watcher'); }],
          [23.5, () => { pose('neb', 'sit'); walk('daniel', P_.bed - 0.035, { speed: 0.03, pose: 'bow' }); face('daniel', 1); }],
        ]);
      },
    },

    // ── 7 你的国位离开你了：王被赶出，吃草如牛，举目望天（4:28–37）───────
    {
      kind: 'judge', utter: '你的国位离开你了', cmd: 'dethrone 尼布甲尼撒 --for 七期 --until 举目望天', ref: '4:31',
      verse: [
        { text: '过了十二个月，他游行在巴比伦王宫里。<br>他说：「这大巴比伦不是我用大能大力建为京都，要显我威严的荣耀吗？」', ref: '但以理书 4:29–30', hold: 7 },
        { text: '当时这话就应验在尼布甲尼撒的身上，他被赶出离开世人，吃草如牛，身被天露滴湿，<br>头发长长，好像鹰毛；指甲长长，如同鸟爪。', ref: '但以理书 4:33', hold: 7.5 },
        { text: '日子满足，我尼布甲尼撒举目望天，我的聪明复归于我，<br>我便称颂至高者，赞美尊敬活到永远的神。', ref: '但以理书 4:34', hold: 7 },
        { text: '……因为他所做的全都诚实，他所行的也都公平。那行动骄傲的，他能降为卑。', ref: '但以理书 4:37', hold: 5.5 },
      ],
      apply(c) {
        const P_ = X();
        const TX = P_.tree, field = TX + fieldDX(AP);
        // 牛在王的两旁吃草，离他与树墩都留出空地
        const oxen = port() ? [TX - 0.075, TX + 0.085] : [TX - 0.085, TX - 0.055, TX + 0.085];
        T(c, [
          [0, b => {
            W.goTo(0.46, 6, b.instant);
            W.set('dnBed', 0, b.instant); W.set('dnHall', 0, b.instant); W.set('dnDew', 0, b.instant);
            offSeat('neb'); S.seat = null; place('neb', P_.bed - 0.01);
            walk('neb', P_.court, { speed: 0.04, pose: 'raise' });
            walk('daniel', lerp(P_.hall0, P_.hall1, 0.62), { speed: 0.03 });
            face('daniel', -1);
          }],
          [4.2, b => { face('neb', -1); glow('neb', 0.6); sfx(b, 'crowd', { soft: true }); }],
          [5.2, b => {
            W.set('dnVoice', 1, b.instant);
            sfx(b, 'thunder', { soft: true, low: true });
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.25);
          }],
          [6.8, b => { pose('neb', 'kneel'); glow('neb', 0); W.set('dnVoice', 0, b.instant); }],
          [8.4, () => {
            walk('neb', field, { speed: 0.02, pose: 'bow' });
            const ms = herd('oxen', { kind: 'cow', n: oxen.length, x0: oxen[0], x1: oxen[oxen.length - 1], pose: 'graze', label: '牛', v: 0.02 });
            ms.forEach(m => { m.scale *= 0.84; });
            placeCrowd('oxen', oxen);
            cmembers('oxen').forEach((m, i) => { m.facing = m.fd = oxen[i] < field ? 1 : -1; });
          }],
          [9.6, b => { W.goTo(0.43, 11, b.instant); W.set('dnDew', 1, b.instant); }],
          [8.4 + walkT(P_.court, field, 0.02) + 0.3, () => { face('neb', -1); pose('neb', 'bow'); }],
          [20.8, b => {
            pose('neb', 'gaze');
            beam(b, field, { w: 50, dur: 5, k: 0.9 });
            glow('neb', 0.55);
            sfx(b, 'harp');
          }],
          [23, b => { pose('neb', 'stand'); W.set('dnShoot', 1, b.instant); W.set('dnDew', 0, b.instant); sparkleOn(b, 'neb', 16, [255, 236, 190], 0.3); }],
          [24, () => { walk('neb', P_.throne, { speed: 0.07 }); crm('oxen'); }],
          [25, () => {
            crowd('counsel', { n: port() ? 2 : 3, x0: lerp(P_.hall0, P_.hall1, 0.05), x1: lerp(P_.hall0, P_.hall1, 0.3), label: '谋士和大臣', pose: 'stand' },
              dressAs(OFFI, { sex: 'm', hair: 'cloth', beard: true, v0: 0.02, v1: 0.08, seed: 0.7 }));
            cface('counsel', 1);
          }],
          [24 + walkT(field, P_.throne, 0.07) + 0.3, () => { toThrone('neb'); cpose('counsel', 'bow'); }],
        ]);
      },
    },

    // ── 8 弥尼，弥尼，提客勒，乌法珥新：伯沙撒的盛筵，墙上的字（第 5 章）★ ──
    {
      kind: 'judge', utter: '弥尼，弥尼，提客勒，乌法珥新', cmd: 'write 粉墙 "弥尼 弥尼 提客勒 乌法珥新" --by 指头 --opposite 灯台', ref: '5:25',
      verse: [
        { text: '伯沙撒王为他的一千大臣设摆盛筵，……<br>他们饮酒，赞美金、银、铜、铁、木、石所造的神。', ref: '但以理书 5:1–4', hold: 6.5 },
        { text: '当时，忽有人的指头显出，在王宫与灯台相对的粉墙上写字。', ref: '但以理书 5:5', hold: 5.5 },
        { text: '「讲解是这样：弥尼，就是神已经数算你国的年日到此完毕。<br>提客勒，就是你被称在天平里，显出你的亏欠。」', ref: '但以理书 5:26–27', hold: 6.5 },
        { text: '「毗勒斯，就是你的国分裂，归与米底亚人和波斯人。」<br>……当夜，迦勒底王伯沙撒被杀。米底亚人大流士年六十二岁，取了迦勒底国。', ref: '但以理书 5:28–31', hold: 7.5 },
      ],
      apply(c) {
        const P_ = X();
        const n = port() ? 3 : 6;
        const dx = lerp(P_.hall0, P_.hall1, 0.66);
        T(c, [
          [0, b => {
            W.goTo(0.88, 6, b.instant);
            W.set('dnStump', 0, b.instant); W.set('dnShoot', 0, b.instant);
            W.set('dnTree', 0, true); W.set('dnFell', 0, true);
            W.set('dnHouse', 1, b.instant);
            rm('neb'); crm('counsel');
            walk('daniel', P_.house + 0.03, { speed: 0.06 });
            add('bel', { label: '伯沙撒王', sex: 'm', age: 'adult', x: P_.throne, facing: -1, robe: ROBE.bel, glow: 0.3, hair: 'cloth', accent: GOLDA, beard: false });
            toThrone('bel');
            W.set('dnHall', 1, b.instant); W.set('dnFeast', 1, b.instant);
            crowd('lords', { n, x0: lerp(P_.hall0, P_.hall1, 0.04), x1: lerp(P_.hall0, P_.hall1, 0.74), label: '一千大臣', pose: 'sit' },
              dressAs(LORDS, { sex: 'mix', v0: 0.05, v1: 0.12, seed: 0.2 }));
            cface('lords', 1);
            sfx(b, 'harp', { soft: true });
          }],
          [3, b => { sfx(b, 'crowd', { soft: true }); }],
          [6.2, b => {
            W.set('dnWrite', 1, b.instant); W.set('dnHand', 1, b.instant);
            sfx(b, 'wind', { soft: true }); sfx(b, 'chime');
          }],
          [8.5, () => { cpose('lords', 'gaze'); }],
          [9.8, () => { offSeat('bel'); place('bel', P_.throne - 0.012); pose('bel', 'kneel'); face('bel', -1); }],
          [13.4, () => { walk('daniel', dx, { speed: 0.075 }); }],
          [13.4 + walkT(P_.house + 0.03, dx, 0.075) + 0.2, b => {
            face('daniel', 1); pose('daniel', 'point');
            W.set('dnRead', 1, b.instant);
            const Pn = panelRect(), sz = Math.min(24 * SU(), W.w * 0.05);
            const src = () => [lerp(Pn.x0, Pn.x1, Math.random()), lerp(Pn.y0, Pn.y1, Math.random())];
            wordsAt(b, '弥尼　弥尼', (Pn.x0 + Pn.x1) / 2, Pn.y0 - (port() ? 92 : 126) * SU(), sz, [255, 226, 160], src, { hold: 3.2 });
            wordsAt(b, '提客勒　乌法珥新', (Pn.x0 + Pn.x1) / 2, Pn.y0 - (port() ? 64 : 92) * SU(), sz, [255, 226, 160], src, { hold: 3.2, delay: 0.5 });
            sfx(b, 'stars');
          }],
          [21.5, b => { W.set('dnScale', 1, b.instant); sfx(b, 'seal', { soft: true }); }],
          [23, b => { add('daniel', { robe: ROBE.purple, accent: GOLDA }); pose('daniel', 'stand'); glow('daniel', 0.7); sparkleOn(b, 'daniel', 20, [255, 226, 150], 0.35); }],
          [24.8, b => {
            W.set('dnHall', 0, b.instant); W.set('dnFeast', 0, b.instant); W.set('dnScale', 0, b.instant);
            W.set('gloom', 0.45, b.instant); W.set('dnWrite', 0.35, b.instant); W.set('dnRead', 0, b.instant);
            rm('bel'); crm('lords');
            sfx(b, 'weep', { soft: true, low: true });
          }],
          [28, b => {
            W.set('gloom', 0, b.instant);
            add('darius', { label: '大流士王', sex: 'm', age: 'elder', x: P_.throne, facing: -1, robe: ROBE.darius, glow: 0.3, hair: 'cloth', accent: [210, 200, 170], beard: true, prop: null });
            toThrone('darius');
            sfx(b, 'gate', { soft: true });
          }],
        ]);
      },
    },

    // ── 9 你所常事奉的神，他必救你：禁令，楼上的窗，狮子坑（6:1–18）──────
    {
      kind: 'act', utter: '你所常事奉的神，他必救你', cmd: 'seal 坑口 --with 王的玺,大臣的印 && pray 但以理 --times 3/日 --toward 耶路撒冷', ref: '6:16',
      verse: [
        { text: '「……三十日内，不拘何人，若在王以外，或向神或向人求什么，就必扔在狮子坑中。」<br>……于是大流士王立这禁令，加盖玉玺。', ref: '但以理书 6:7–9', hold: 7 },
        { text: '但以理知道这禁令盖了玉玺，就到自己家里（他楼上的窗户开向耶路撒冷），<br>一日三次，双膝跪在他神面前，祷告感谢，与素常一样。', ref: '但以理书 6:10', hold: 7.5 },
        { text: '王下令，人就把但以理带来，扔在狮子坑中。王对但以理说：「你所常事奉的神，他必救你。」', ref: '但以理书 6:16', hold: 6 },
        { text: '有人搬石头放在坑口，王用自己的玺和大臣的印，封闭那坑……<br>王回宫，终夜禁食，……并且睡不着觉。', ref: '但以理书 6:17–18', hold: 6.5 },
      ],
      apply(c) {
        const P_ = X();
        const n = port() ? 3 : 5;
        const D = P_.den, dn = D - 0.012;
        T(c, [
          [0, b => {
            W.goTo(0.6, 5, b.instant);
            W.set('dnWrite', 0, b.instant);
            W.set('dnDen', 1, b.instant); W.set('dnCalm', 0, b.instant); W.set('dnSeal', 0, b.instant);
            add('daniel', { age: 'elder', beard: true, hair: 'cloth', prop: null });
            crowd('satraps', { n, x0: lerp(P_.hall0, P_.hall1, 0.05), x1: lerp(P_.hall0, P_.hall1, 0.62), label: '总长和总督', pose: 'stand' },
              dressAs(OFFI, { sex: 'm', hair: 'cloth', beard: true, v0: 0.02, v1: 0.1, seed: 0.5 }));
            cface('satraps', 1);
            walk('daniel', P_.house + 0.01, { speed: 0.05 });
          }],
          [1.6, () => { cpose('satraps', 'bow'); }],
          [3, b => { W.set('dnDecree', 1, b.instant); sfx(b, 'seal'); }],
          [7, () => { W.set('dnHand', 0, true); }],
          [0.2 + walkT(lerp(P_.hall0, P_.hall1, 0.66), P_.house + 0.01, 0.05) + 0.2, b => { toRoom('daniel', 'pray'); W.set('dnWin', 1, b.instant); }],
          [5.5, b => { W.goTo(0.745, 7, b.instant); }],
          [8, () => { cpose('satraps', 'stand'); cwalk('satraps', P_.house + 0.03, P_.house + 0.07, { speed: 0.05 }); cface('satraps', -1); }],
          [14.5, () => { cpose('satraps', 'point'); }],
          [16, b => {
            offRoom('daniel'); pose('daniel', 'stand'); W.set('dnWin', 0, b.instant);
            walk('daniel', dn, { speed: 0.035 });
            cwalk('satraps', D + 0.05, D + 0.095, { speed: 0.04 }); cface('satraps', -1);
            offSeat('darius'); walk('darius', D + 0.024, { speed: 0.07, pose: 'weep' });
            W.set('dnDecree', 0, b.instant);
          }],
          [16 + walkT(P_.house + 0.012, dn, 0.035) + 0.2, b => {
            face('daniel', 1);
            attach('daniel', denAt(DAN_DX)); S.dan = 'den';
            W.set('dnLower', 1, b.instant);
            face('darius', -1);
            sfx(b, 'gate', { low: true });
          }],
          [20.5, () => { pose('darius', 'raise'); }],
          [22.2, b => { W.set('dnSeal', 1, b.instant); sfx(b, 'seal'); pose('darius', 'stand'); cpose('satraps', 'stand'); }],
          [23.4, b => { W.goTo(0.97, 6, b.instant); }],
          [24.2, () => { walk('darius', lerp(P_.hall0, P_.hall1, 0.66), { speed: 0.06, pose: 'sit' }); cwalk('satraps', P_.court, P_.court + 0.02, { speed: 0.05 }); }],
          [26.5, b => { crm('satraps'); W.set('dnKingLamp', 1, b.instant); }],
        ]);
      },
    },

    // ── 10 我的神差遣使者，封住狮子的口：坑中的夜，黎明（6:19–28）★ ─────
    {
      kind: 'act', utter: '我的神差遣使者，封住狮子的口', cmd: 'mute 狮子 --by 使者 && lift 但以理 --harm 0', ref: '6:22',
      verse: [
        { text: '次日黎明，王就起来，急忙往狮子坑那里去。临近坑边，哀声呼叫但以理，<br>对但以理说：「永生神的仆人但以理啊，你所常事奉的神能救你脱离狮子吗？」', ref: '但以理书 6:19–20', hold: 8 },
        { text: '但以理对王说：「愿王万岁！我的神差遣使者，封住狮子的口，叫狮子不伤我……」', ref: '但以理书 6:21–22', hold: 6 },
        { text: '王就甚喜乐，吩咐人将但以理从坑里系上来。<br>于是但以理从坑里被系上来，身上毫无伤损，因为信靠他的神。', ref: '但以理书 6:23', hold: 6.5 },
        { text: '「……因为他是永远长存的活神，他的国永不败坏；他的权柄永存无极！<br>他护庇人，搭救人，……救了但以理脱离狮子的口。」', ref: '但以理书 6:26–27', hold: 7 },
      ],
      apply(c) {
        const P_ = X();
        const D = P_.den;
        T(c, [
          [0, b => {
            add('angelD', { label: '使者', sex: 'm', age: 'adult', x: D - 0.03, facing: 1, angel: true, glow: 1, from: b.instant ? 'none' : 'light' });
            attach('angelD', denFloor(ANGEL_DX)); face('angelD', 1);
            W.set('dnAngelL', 1, b.instant);
            sfx(b, 'angel');
          }],
          [1.2, b => { W.set('dnCalm', 1, b.instant); pose('daniel', 'kneel'); face('daniel', 1); glow('daniel', 0.8); }],
          [7, b => { W.goTo(0.27, 6, b.instant); }],
          [8.6, () => { pose('darius', 'stand'); walk('darius', D + 0.035, { run: true, speed: 0.09 }); }],
          [8.6 + walkT(lerp(P_.hall0, P_.hall1, 0.66), D + 0.035, 0.09) + 0.3, b => { face('darius', -1); pose('darius', 'raise'); W.set('dnKingLamp', 0, b.instant); sfx(b, 'weep', { soft: true }); }],
          [14.4, () => { pose('daniel', 'gaze'); }],
          [15.4, b => { W.set('dnSeal', 0, b.instant); sfx(b, 'gate'); }],
          [16.4, b => { pose('daniel', 'stand'); W.set('dnLower', 0, b.instant); }],
          [18.8, b => {
            attach('daniel', null); place('daniel', D - 0.012); S.dan = 'ground';
            face('daniel', 1);
            rm('angelD'); W.set('dnAngelL', 0.25, b.instant);
            sparkleOn(b, 'daniel', 22, [255, 240, 210], 0.35);
          }],
          [20.5, b => { pose('darius', 'raise'); glow('darius', 0.5); sfx(b, 'harp'); }],
          [23.5, b => {
            fxAdd(b, { type: 'decree', dur: 4 });
            if (!b.instant && fx()) fx().ring(P_.throne * W.w, palGeom().top, [255, 226, 160], M() * 0.35, 3, 1.4);
            pose('darius', 'stand');
            sfx(b, 'stars');
          }],
        ]);
      },
    },

    // ── 11 他的权柄是永远的：四兽、亘古常在者、驾着天云而来的（第 7 章）★ ──
    {
      kind: 'act', utter: '他的权柄是永远的，不能废去', cmd: 'grant 权柄 荣耀 国度 --to 像人子的 --forever && burn 第四兽', ref: '7:14',
      verse: [
        { text: '但以理说：我夜里见异象，看见天的四风陡起，刮在大海之上。<br>有四个大兽从海中上来，形状各有不同……', ref: '但以理书 7:2–3', hold: 6.5 },
        { text: '我观看，见有宝座设立，上头坐着亘古常在者。……宝座乃火焰，其轮乃烈火。<br>从他面前有火，像河发出；事奉他的有千千，在他面前侍立的有万万……', ref: '但以理书 7:9–10', hold: 8 },
        { text: '我在夜间的异象中观看，见有一位像人子的，驾着天云而来，被领到亘古常在者面前，<br>得了权柄、荣耀、国度，使各方、各国、各族的人都事奉他。', ref: '但以理书 7:13–14', hold: 8 },
        { text: '然而，至高者的圣民，必要得国享受，直到永永远远。', ref: '但以理书 7:18', hold: 5 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            W.goTo(0.98, 5, b.instant);
            W.set('dnDen', 0, b.instant); W.set('dnCalm', 0, b.instant); W.set('dnAngelL', 0, b.instant);
            rm('darius');
            walk('daniel', P_.house + 0.012, { speed: 0.05 });
            W.set('gale', 0.85, b.instant); W.set('storm', 0.45, b.instant);
            W.set('dnV7', 1, b.instant);
            sfx(b, 'wind');
          }],
          [0.2 + walkT(P_.den - 0.012, P_.house + 0.012, 0.05) + 0.2, () => { toRoom('daniel', 'sit'); face('daniel', 1); }],
          [1, b => { W.set('dnSea', 4, b.instant); sfx(b, 'thunder', { soft: true, low: true }); }],
          [9.4, b => {
            W.set('dnThrone', 1, b.instant);
            W.set('gale', 0.35, b.instant); W.set('storm', 0.2, b.instant);
            sfx(b, 'fire', { low: true, soft: true }); sfx(b, 'angel');
          }],
          [12, b => { W.set('dnFireRiver', 1, b.instant); W.set('dnMyriad', 1, b.instant); }],
          [15.4, b => { W.set('dnBeastFire', 1, b.instant); W.set('dnBeastFade', 1, b.instant); sfx(b, 'fire'); }],
          [18.6, b => { W.set('dnSon', 1, b.instant); sfx(b, 'wind', { soft: true }); }],
          [25.8, b => {
            W.set('dnGlory', 1, b.instant);
            W.set('gale', 0, b.instant); W.set('storm', 0, b.instant);
            sfx(b, 'harp'); sfx(b, 'stars');
          }],
          [27, () => { pose('daniel', 'gaze'); face('daniel', 1); }],
        ]);
      },
    },

    // ── 12 加百列啊，要使此人明白这异象：河边的异象；晚祭时的祷告（8—9）────
    {
      kind: 'call', utter: '加百列啊，要使此人明白这异象', cmd: 'explain 异象 --by 加百列 --twice', ref: '8:16',
      verse: [
        { text: '我举目观看，见有双角的公绵羊站在河边，两角都高……<br>我正思想的时候，见有一只公山羊从西而来，遍行全地，脚不沾尘。', ref: '但以理书 8:3–5', hold: 7 },
        { text: '我又听见乌莱河两岸中有人声呼叫说：「加百列啊，要使此人明白这异象。」<br>他便来到我所站的地方。他一来，我就惊慌俯伏在地……', ref: '但以理书 8:16–17', hold: 7 },
        { text: '我便禁食，披麻蒙灰，定意向主神祈祷恳求。', ref: '但以理书 9:3', hold: 5 },
        { text: '我正祷告的时候，先前在异象中所见的那位加百列，奉命迅速飞来，<br>约在献晚祭的时候，按手在我身上。', ref: '但以理书 9:21', hold: 6.5 },
      ],
      apply(c) {
        const P_ = X();
        const bank = P_.bank;
        T(c, [
          [0, b => {
            W.set('dnV7', 0, b.instant);
            W.goTo(0.6, 6, b.instant);
            offRoom('daniel'); pose('daniel', 'stand');
            walk('daniel', bank, { speed: 0.03 });
          }],
          [0.2 + walkT(P_.house + 0.012, bank, 0.03) + 0.2, () => { face('daniel', 1); pose('daniel', 'gaze'); }],
          [1.6, b => { W.set('dnVision', 1, b.instant); W.set('dnRam', 1, b.instant); sfx(b, 'bleat', { soft: true }); }],
          [5.2, b => { W.set('dnGoat', 1, b.instant); sfx(b, 'wind'); }],
          [6.5, b => {
            for (const k of ['dnSea', 'dnBeastFire', 'dnBeastFade', 'dnThrone', 'dnFireRiver', 'dnMyriad', 'dnSon', 'dnGlory']) W.set(k, 0, true);
            void b;
          }],
          [8, b => { W.set('dnRam', 0, b.instant); sfx(b, 'thunder', { soft: true }); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.25); }],
          [9.6, b => { W.set('dnHorn4', 1, b.instant); }],
          [11, b => { W.set('dnLittle', 1, b.instant); fxAdd(b, { type: 'fall', dur: 3.5 }); sfx(b, 'stars'); }],
          [13.6, b => {
            add('gabriel', { label: '加百列', sex: 'm', age: 'adult', x: bank + 0.034, facing: -1, angel: true, glow: 1, from: b.instant ? 'none' : 'light' });
            sfx(b, 'angel');
            if (!b.instant && fx()) { const p = rivPt(0.2); fx().ring(p[0], p[1], [255, 240, 210], M() * 0.25, 2.2, 1.4); }
          }],
          [15, () => { face('daniel', 1); pose('daniel', 'fall'); }],
          [17.6, b => { ringOn(b, 'daniel', [255, 236, 190], 0.1, 0.8); pose('daniel', 'kneel'); }],
          [19, b => { pose('daniel', 'stand'); W.set('dnVision', 0, b.instant); }],
          [20.2, b => { rm('gabriel'); W.goTo(0.76, 6, b.instant); walk('daniel', P_.house + 0.012, { speed: 0.035 }); }],
          [20.2 + walkT(bank, P_.house + 0.012, 0.035) + 0.2, b => {
            add('daniel', { robe: ROBE.sack, accent: [120, 110, 96] });
            toRoom('daniel', 'pray');
            W.set('dnWin', 1, b.instant);
            if (!b.instant && fx()) { const h = headTop('daniel'); if (h) fx().dust(h[0], h[1], 18, [150, 140, 128], 8 * SU(), 'air'); }
          }],
          [26, b => {
            const H = houseGeom();
            fxAdd(b, { type: 'streak', dur: 1.2, x0: W.w * 0.92, y0: W.h * 0.08, x1: H.r1 + 16 * H.k, y1: H.yR - 20 * H.k });
            sfx(b, 'wings');
          }],
          [27.2, b => {
            add('gabriel', { label: '加百列', sex: 'm', age: 'adult', x: P_.house + 0.04, facing: -1, angel: true, glow: 1, from: b.instant ? 'none' : 'light' });
            ringOn(b, 'daniel', [255, 236, 190], 0.1, 0.5);
            sfx(b, 'angel', { soft: true });
          }],
        ]);
      },
    },

    // ── 13 不要惧怕，愿你平安！你总要坚强：底格里斯河上穿细麻衣的（10—11）──
    {
      kind: 'bless', utter: '不要惧怕，愿你平安！你总要坚强', cmd: 'strengthen 但以理 --by 穿细麻衣的 --at 底格里斯大河', ref: '10:19',
      verse: [
        { text: '正月二十四日，我在底格里斯大河边，举目观看，见有一人身穿细麻衣，腰束乌法精金带。<br>他身体如水苍玉，面貌如闪电，眼目如火把……', ref: '但以理书 10:4–6', hold: 8 },
        { text: '这异象惟有我但以理一人看见，同着我的人没有看见。他们却大大战兢，逃跑隐藏……', ref: '但以理书 10:7', hold: 6 },
        { text: '有一位形状像人的又摸我，使我有力量。<br>他说：「大蒙眷爱的人哪，不要惧怕，愿你平安！你总要坚强。」', ref: '但以理书 10:18–19', hold: 6.5 },
        { text: '……惟独认识神的子民必刚强行事。民间的智慧人必训诲多人……', ref: '但以理书 11:32–33', hold: 5.5 },
      ],
      apply(c) {
        const P_ = X();
        const bank = P_.bank;
        const rx = lerp(P_.riv0, P_.riv1, 0.2) + (port() ? 0.01 : 0.004);
        T(c, [
          [0, b => {
            W.goTo(0.44, 6, b.instant);
            W.set('dnWin', 0, b.instant);
            W.set('dnGoat', 0, true); W.set('dnHorn4', 0, true); W.set('dnLittle', 0, true); W.set('dnRam', 0, true);
            rm('gabriel');
            offRoom('daniel'); add('daniel', { robe: ROBE.daniel, accent: null }); pose('daniel', 'stand');
            walk('daniel', bank, { speed: 0.03 });
            crowd('comp', { n: port() ? 2 : 3, x0: P_.house + 0.03, x1: P_.house + 0.07, label: '同着我的人', pose: 'stand' }, dressAs(TOWN, { sex: 'm', hair: 'cloth', beard: true, v0: 0.04, v1: 0.12, seed: 0.4 }));
            cwalk('comp', bank + 0.018, bank + 0.05, { speed: 0.03 });
          }],
          [0.2 + walkT(P_.house + 0.012, bank, 0.03) + 0.2, () => { face('daniel', -1); cface('comp', -1); }],
          [4.6, b => {
            add('linen', { label: '穿细麻衣的', sex: 'm', age: 'adult', x: rx, facing: 1, angel: true, glow: 1, scale: 1.5, robe: ROBE.linen, accent: [240, 196, 90], from: b.instant ? 'none' : 'light' });
            hover('linen', (gY(2, rx) - 16 * BK()) / W.h);
            W.set('dnLinen', 1, b.instant);
            sfx(b, 'angel');
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.35);
          }],
          [8, () => { cwalk('comp', bank + 0.2, bank + 0.28, { speed: 0.06, run: true }); }],
          [9.4, () => { pose('daniel', 'fall'); }],
          [11.6, () => { crm('comp'); }],
          [14, b => { ringOn(b, 'daniel', [220, 236, 255], 0.1, 0.8); pose('daniel', 'kneel'); face('daniel', -1); }],
          [16.8, b => {
            pose('daniel', 'stand'); face('daniel', -1);
            glow('daniel', 0.85);
            sparkleOn(b, 'daniel', 26, [230, 240, 255], 0.3);
            sfx(b, 'harp');
          }],
          [19.2, b => { W.set('dnKings', 1, b.instant); sfx(b, 'crowd', { soft: true, far: true }); }],
          [26, () => { pose('daniel', 'gaze'); }],
        ]);
      },
    },

    // ── 14 智慧人必发光如同天上的光：复醒、发光如星；你必安歇（第 12 章）★ ──
    {
      kind: 'promise', utter: '智慧人必发光如同天上的光', cmd: 'shine 智慧人 --as 天上的光 && shine 使多人归义的 --as 星 --forever', ref: '12:3',
      verse: [
        { text: '「那时，保佑你本国之民的天使长米迦勒必站起来……<br>你本国的民中，凡名录在册上的，必得拯救。」', ref: '但以理书 12:1', hold: 6.5 },
        { text: '「睡在尘埃中的，必有多人复醒……<br>智慧人必发光如同天上的光；那使多人归义的，必发光如星，直到永永远远。」', ref: '但以理书 12:2–3', hold: 8 },
        { text: '「你且去等候结局，因为你必安歇。到了末期，你必起来，享受你的福分。」', ref: '但以理书 12:13', hold: 7 },
      ],
      apply(c) {
        const P_ = X();
        T(c, [
          [0, b => {
            W.goTo(0.93, 8, b.instant);
            W.set('dnKings', 1, true);
            pose('linen', 'raise');
            W.set('dnLinen', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [2, b => { W.set('dnFirm', 1, b.instant); }],
          [3.6, b => { W.set('dnRise', 1, b.instant); W.set('dnStars', 1, b.instant); sfx(b, 'stars'); }],
          [8.5, b => { pose('daniel', 'gaze'); glow('daniel', 1); W.set('dnWise', 1, b.instant); sparkleOn(b, 'daniel', 24, [255, 244, 220], 0.3); }],
          [11.5, () => { pose('linen', 'stand'); }],
          [12.8, b => { rm('linen'); W.set('dnLinen', 0, b.instant); }],
          // 12:13「你必安歇」：但以理回到家门前坐下，头上一颗星，家里一盏灯（全卷最后、最亮、最静的一景）
          [14, () => { walk('daniel', P_.house - 0.004, { speed: 0.02, pose: 'sit' }); }],
          [Math.max(17, 14 + walkT(P_.bank, P_.house - 0.004, 0.02) + 0.4), b => { face('daniel', 1); W.set('dnRest', 1, b.instant); sfx(b, 'chime'); }],
        ]);
      },
    },
  ];
  // 每句话的情节都按言说那一刻的横竖屏写成：记下它（转屏后的情节据此换算位置）
  STAGES.forEach(st => { const f = st.apply; st.apply = function (c) { AP = port(); return f.call(this, c); }; });
  // 几处情节的起点（算走路时长用）
  function dx0() { const P_ = X(); return lerp(P_.hall0, P_.hall1, 0.52) + 0.03; }
  function out3() { const P_ = X(), pk = port() ? 1.6 : 1; return P_.furn + 0.078 * pk + 0.02 * pk; }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '但以理书', books: [27], title: '但以理', sub: '但以理书 1 — 12', tint: [255, 220, 170], music: 'joseph',
    outro: 34,
    intro: [
      { text: '犹大王约雅敬在位第三年，巴比伦王尼布甲尼撒来到耶路撒冷，将城围困。<br>主将犹大王约雅敬，并神殿中器皿的几分交付他手……', ref: '但以理书 1:1–2', hold: 7.5 },
      { text: '他们中间有犹大族的人：但以理、哈拿尼雅、米沙利、亚撒利雅。', ref: '但以理书 1:6', hold: 5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '但以理': { text: '你且去等候结局，因为你必安歇。到了末期，你必起来，享受你的福分。', ref: '但以理书 12:13' },
      '哈拿尼雅': { text: '他们中间有犹大族的人：但以理、哈拿尼雅、米沙利、亚撒利雅。', ref: '但以理书 1:6' },
      '米沙利': { text: '他们中间有犹大族的人：但以理、哈拿尼雅、米沙利、亚撒利雅。', ref: '但以理书 1:6' },
      '亚撒利雅': { text: '他们中间有犹大族的人：但以理、哈拿尼雅、米沙利、亚撒利雅。', ref: '但以理书 1:6' },
      '沙得拉': { text: '我们所事奉的神能将我们从烈火的窑中救出来。王啊，他也必救我们脱离你的手。', ref: '但以理书 3:17' },
      '米煞': { text: '即或不然，王啊，你当知道我们决不事奉你的神，也不敬拜你所立的金像。', ref: '但以理书 3:18' },
      '亚伯尼歌': { text: '见火无力伤他们的身体，头发也没有烧焦，衣裳也没有变色，并没有火燎的气味。', ref: '但以理书 3:27' },
      '太监长': { text: '神使但以理在太监长眼前蒙恩惠，受怜悯。', ref: '但以理书 1:9' },
      '用王膳的少年人': { text: '过了十天，见他们的面貌比用王膳的一切少年人更加俊美肥胖。', ref: '但以理书 1:15' },
      '尼布甲尼撒王': { text: '那行动骄傲的，他能降为卑。', ref: '但以理书 4:37' },
      '伯沙撒王': { text: '伯沙撒啊，你是他的儿子，你虽知道这一切，你心仍不自卑。', ref: '但以理书 5:22' },
      '大流士王': { text: '王就甚喜乐，吩咐人将但以理从坑里系上来。', ref: '但以理书 6:23' },
      '护卫长亚略': { text: '王的护卫长亚略出来，要杀巴比伦的哲士，但以理就用婉言回答他。', ref: '但以理书 2:14' },
      '术士': { text: '王考问他们一切事，就见他们的智慧聪明比通国的术士和用法术的胜过十倍。', ref: '但以理书 1:20' },
      '各省的官员': { text: '于是总督、钦差、巡抚、臬司、藩司、谋士、法官，和各省的官员都聚集了来。', ref: '但以理书 3:3' },
      '壮士': { text: '因为王命紧急，窑又甚热，那抬沙得拉、米煞、亚伯尼歌的人都被火焰烧死。', ref: '但以理书 3:22' },
      '第四个': { text: '看哪，我见有四个人，并没有捆绑，在火中游行，也没有受伤；那第四个的相貌好像神子。', ref: '但以理书 3:25' },
      '守望的圣者': { text: '这是守望者所发的命，圣者所出的令，好叫世人知道至高者在人的国中掌权。', ref: '但以理书 4:17' },
      '田野的走兽': { text: '田野的走兽卧在荫下，天空的飞鸟宿在枝上；凡有血气的都从这树得食。', ref: '但以理书 4:12' },
      '牛': { text: '他被赶出离开世人，吃草如牛，身被天露滴湿。', ref: '但以理书 4:33' },
      '谋士和大臣': { text: '我的谋士和大臣也来朝见我。我又得坚立在国位上，至大的权柄加增于我。', ref: '但以理书 4:36' },
      '一千大臣': { text: '伯沙撒王为他的一千大臣设摆盛筵，与这一千人对面饮酒。', ref: '但以理书 5:1' },
      '总长和总督': { text: '那些人就纷纷聚集，见但以理在他神面前祈祷恳求。', ref: '但以理书 6:11' },
      '使者': { text: '我的神差遣使者，封住狮子的口，叫狮子不伤我。', ref: '但以理书 6:22' },
      '加百列': { text: '但以理啊，现在我出来要使你有智慧，有聪明。', ref: '但以理书 9:22' },
      '穿细麻衣的': { text: '举目观看，见有一人身穿细麻衣，腰束乌法精金带。', ref: '但以理书 10:5' },
      '同着我的人': { text: '这异象惟有我但以理一人看见，同着我的人没有看见。他们却大大战兢，逃跑隐藏。', ref: '但以理书 10:7' },
      '王宫': { text: '我尼布甲尼撒安居在宫中，平顺在殿内。', ref: '但以理书 4:4' },
      '宝座': { text: '王啊，至高的神曾将国位、大权、荣耀、威严赐与你父尼布甲尼撒。', ref: '但以理书 5:18' },
      '灯台': { text: '当时，忽有人的指头显出，在王宫与灯台相对的粉墙上写字。', ref: '但以理书 5:5' },
      '粉墙': { text: '所写的文字是：『弥尼，弥尼，提客勒，乌法珥新。』', ref: '但以理书 5:25' },
      '但以理的家': { text: '就到自己家里（他楼上的窗户开向耶路撒冷），一日三次，双膝跪在他神面前，祷告感谢，与素常一样。', ref: '但以理书 6:10' },
      '大河': { text: '正月二十四日，我在底格里斯大河边。', ref: '但以理书 10:4' },
      '巴比伦城': { text: '这大巴比伦不是我用大能大力建为京都，要显我威严的荣耀吗？', ref: '但以理书 4:30' },
      '大山': { text: '打碎这像的石头变成一座大山，充满天下。', ref: '但以理书 2:35' },
      '金像': { text: '尼布甲尼撒王造了一个金像，高六十肘，宽六肘，立在巴比伦省杜拉平原。', ref: '但以理书 3:1' },
      '烈火的窑': { text: '凡不俯伏敬拜的，必立时扔在烈火的窑中。', ref: '但以理书 3:6' },
      '大树': { text: '我看见地当中有一棵树，极其高大。', ref: '但以理书 4:10' },
      '树墩': { text: '……等你知道诸天掌权，以后你的国必定归你。', ref: '但以理书 4:26' },
      '狮子坑': { text: '有人搬石头放在坑口，王用自己的玺和大臣的印，封闭那坑。', ref: '但以理书 6:17' },
      '狮子': { text: '我的神差遣使者，封住狮子的口，叫狮子不伤我。', ref: '但以理书 6:22' },
      '众星': { text: '那使多人归义的，必发光如星，直到永永远远。', ref: '但以理书 12:3' },
    },
  });
})(window.GS);
