/* ─────────────────────────────────────────────────────────────
 * book/romans.js —— 罗马书 · 因信称义（罗马书 1 — 16）
 *
 * 书信没有情节：每一句话在世界里显为一幅光的图画。
 * 近地的右边是该犹的家：院中一张矮桌、一盏泥灯、一卷越写越长的信——保罗口述，德提代笔（16:22）。
 * 近地的中间，一棵老橄榄树；树左是犹太人，树右是希腊人（罗马的圣徒，也是「世人」）。
 *   1:17  「义人必因信得生」：信卷发光，福音的光一道一道飞到各人心里——先是犹太人，后是希腊人；天亮了。
 *   2:11  所造之物显明神的永能；人却转脸，心就昏暗了。高天上一道平平的荣光（神不偏待人）；
 *         各人心里升起一柱光，都够不着——亏缺了神的荣耀（3:23）。
 *   3:24  荣光里落下一滴一滴的光，同时落到每一个人心里：白白地称义，并没有分别。
 *   4:17  夜。中丘上显出亚伯拉罕的光影；灵在天上何处，众星就从何处生出——使无变为有，你的后裔将要如此。
 *   5:8   黎明前。远山上一个十字架的剪影，光在它背后破开（真的日头还在地平线下）；
 *   5:5   爱如光的溪流自十字架流到灵之处（言说时灵所在），灵再把它浇灌在各人心里；5:20 天亮了。
 *   6:23  7:24 遍地灰黄，一直到「罪的工价乃是死」；「惟有神的恩赐」：灵在哪里，生命的光环就从哪里铺开，花开满地（6:4 新生的样式）。
 *   8:26  众人跪着祷告；灵的风带着一条光的丝带，从灵来的方向吹过每一个人。「阿爸！父！」——众人举手。
 *   8:28  万物（日头、远山、中丘、树、灯、人）各引出一根光的丝线，在高处织成一条三股的光绳，
 *         弯成一道拱，罩在院子上；拱上四颗光结依次亮起（8:30 预定、召、称义、荣耀）。
 *   8:39  暴风雨；四面的黑暗压过来（患难、困苦、逼迫……，不是什么活物，只是黑暗）——光拱合成一座爱的穹顶，
 *         黑暗压到穹顶上停住（相遇之处穹顶的边亮起，里面暖而亮）；8:37 黑暗被一下子推开；雨住云开，穹顶张开，罩住全地（本卷的签名之景）。
 *   10:13 黄昏。众人举手求告，手里各有一盏灯；一个报信的人举着火把走到海边，一路留下光的脚踪；
 *         中丘、远山上的灯一盏一盏亮起——他们的声音传遍天下。
 *   11:36 夜很快过去，早晨。橄榄树折下两根枝子；野橄榄的嫩枝从远方飞来，接在其中；根里的肥汁（金光）升到每一根枝子；
 *         折下的枝子又重新接上；满树结出橄榄。
 *   12:19 一个裹在冷影里的仇敌从海边走来；众人不以恶报恶：一人拿饼，一人拿杯，炭火（暖光）堆在他头上，
 *         冷影散去，他成了邻舍；地上一圈爱的光把众人都围在里面（13:10）。
 *   15:13 日落时，信写完了。德提卷起信卷，保罗交给非比（16:1），她把信带到众人中间举起来——
 *         喜乐、平安充满各人的心；远近的灯又亮起来。「愿荣耀……归与独一全智的神，直到永远。阿们！」
 *
 * 新约里的神：父从不画成形像（只有光与经文）；子不在场上（远山上的十字架只是一个剪影）；圣灵是灵自己的光与风。
 * 话语：说神作为与性情的经句（kind 'act' 等）与经上记着的神的话（12:19）。经文都出自新标点和合本。
 * 一切状态只在 setup / apply / 情节里设定（瞬间重演、恢复存档都得到同样的世界）；布景只在本卷进行时绘制。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'romans';
  const LV = W.lv;
  const isCur = () => GS.book.current(ACT);
  const RM = '罗马书 ';

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('rmWrite', 'exp', 0.9);     // 信卷在写：发光
  W.defineLevel('rmWake', 'lin', 0.085);    // 1:16 福音的光飞到各人心里（先是犹太人，后是希腊人）
  W.defineLevel('rmDim', 'exp', 0.45);      // 1:21 无知的心就昏暗了
  W.defineLevel('rmGlory', 'exp', 0.5);     // 3:23 神的荣耀：高天上一道平平的光
  W.defineLevel('rmReach', 'lin', 0.11);    // 各人心里升起的光柱，都够不着
  W.defineLevel('rmGift', 'lin', 0.1);      // 3:24 白白地称义：光落到每一个人心里
  W.defineLevel('rmStars', 'lin', 0.09);    // 4:17 使无变为有：众星
  W.defineLevel('rmSeed', 'lin', 0.12);     // 4:18 你的后裔将要如此：更多的星
  W.defineLevel('rmCross', 'exp', 0.45);    // 5:8 远山上的十字架
  W.defineLevel('rmDawn', 'exp', 0.35);     // 它背后破开的晨光
  W.defineLevel('rmPour', 'lin', 0.14);     // 5:5 圣灵将神的爱浇灌在我们心里（自十字架经灵之处，再到各人心里）
  W.defineLevel('rmWarm', 'exp', 0.5);      // 心里的光变暖（金色）
  W.defineLevel('rmDeath', 'exp', 0.7);     // 6:23 罪的工价：遍地灰黄
  W.defineLevel('rmLife', 'lin', 0.16);     // 神的恩赐：生命自灵之处铺开
  W.defineLevel('rmWind', 'exp', 0.6);      // 8:26 圣灵的叹息：风
  W.defineLevel('rmBreath', 'lin', 0.12);   // 风中光的丝带经过每一个人
  W.defineLevel('rmThread', 'lin', 0.12);   // 8:28 万物各引出一根光的丝线
  W.defineLevel('rmWeave', 'exp', 0.6);     // 织成一条光绳，弯成拱
  W.defineLevel('rmKnot', 'lin', 0.6);      // 8:30 拱上的四个光结（0..4）
  W.defineLevel('rmSmoke', 'lin', 0.2);     // 8:35 四面的黑暗压来（8:35 一行读完时压到穹顶上）
  W.defineLevel('rmBreak', 'exp', 1.2);     // 8:37 撞在爱上就被推开、散了
  W.defineLevel('rmDome', 'exp', 0.7);      // 神的爱：光的穹顶
  W.defineLevel('rmOpen', 'exp', 0.35);     // 8:39 穹顶张开，罩住全地
  W.defineLevel('rmLamps', 'lin', 0.1);     // 10:18 远近的灯一盏一盏亮起
  W.defineLevel('rmHand', 'exp', 0.8);      // 10:13 手里的灯
  W.defineLevel('rmFall', 'exp', 0.9);      // 11:17 枝子被折下来
  W.defineLevel('rmGraft', 'lin', 0.22);    // 野橄榄接在其中
  W.defineLevel('rmSap', 'lin', 0.13);      // 橄榄根的肥汁
  W.defineLevel('rmBack', 'lin', 0.2);      // 11:23 重新接上
  W.defineLevel('rmOlive', 'exp', 0.45);    // 满树的橄榄
  W.defineLevel('rmCold', 'exp', 0.5);      // 12:20 仇敌身上的冷影
  W.defineLevel('rmCoals', 'exp', 0.6);     // 炭火堆在他的头上（暖光）
  W.defineLevel('rmLove', 'exp', 0.5);      // 13:10 地上一圈爱的光
  W.defineLevel('rmFull', 'exp', 0.45);     // 15:13 喜乐、平安充满
  W.defineLevel('rmAmen', 'exp', 0.5);      // 16:27 阿们
  const MY = ['rmWrite', 'rmWake', 'rmDim', 'rmGlory', 'rmReach', 'rmGift', 'rmStars', 'rmSeed', 'rmCross', 'rmDawn', 'rmPour', 'rmWarm',
    'rmDeath', 'rmLife', 'rmWind', 'rmBreath', 'rmThread', 'rmWeave', 'rmKnot', 'rmSmoke', 'rmBreak', 'rmDome', 'rmOpen', 'rmLamps', 'rmHand',
    'rmFall', 'rmGraft', 'rmSap', 'rmBack', 'rmOlive', 'rmCold', 'rmCoals', 'rmLove', 'rmFull', 'rmAmen'];

  // ── 地上的位置（画面宽度的比例；近地的纵深 v：0 = 脊线，1 = 画面底）──────
  //   宽屏：经文在左边的海上（x < 0.5、y > 0.6），人都站在 0.53 以右；手机竖屏：经文在顶上，人可以往左些。
  //   该犹的家、德提与保罗（写信的一景）不挤在画面的右边上：宽屏德提 0.8、家 0.92；手机上非比从门口往前一步出来（与保罗错开纵深）。
  //   12:20：仇敌从前面（纵深大处）走来，不从众人身上经过；给饼给杯的两人与他都站到前面来（人大些）；原来站在那里的人让开。
  const XD = {
    ppl: [[0.535, 0.12], [0.695, 0.1], [0.575, 0.04], [0.73, 0.03], [0.612, 0.17], [0.765, 0.15]],
    tree: 0.653, tert: 0.8, tertV: 0.07, house: 0.92,
    cross: 0.765, abr: 0.85, dome: [0.5, 0.935],
    enemyIn: 0.455, enemyInV: 0.72, enemy: 0.622, enemyV: 0.58, giveL: 0.568, giveR: 0.676, giveV: 0.58, giveIn: 0.036,
    aside: { p0: [0.522, 0.02], p4: [0.603, 0.02] },
    phInV: 0.02, phMeet: 0.035, phMeetV: 0.02, phoebe: 0.712, phoebeV: 0.3, msg: 0.475, lifeMin: 0.38,
    glory: [0.5, 0.97, 0.29], idea: [0.71, 0.36],
  };
  const XP = {
    ppl: [[0.42, 0.12], [0.672, 0.1], [0.482, 0.04], [0.722, 0.05], [0.545, 0.17]],
    tree: 0.607, tert: 0.775, tertV: 0.08, house: 0.955,
    cross: 0.8, abr: 0.87, dome: [0.37, 0.97],
    enemyIn: 0.36, enemyInV: 0.84, enemy: 0.53, enemyV: 0.68, giveL: 0.466, giveR: 0.594, giveV: 0.68, giveIn: 0.046,
    aside: { p0: [0.41, 0.0], p4: [0.568, 0.04] },
    phInV: 0.2, phMeet: 0.06, phMeetV: 0.2, phoebe: 0.64, phoebeV: 0.38, msg: 0.385, lifeMin: 0.36,
    glory: [0.36, 0.98, 0.5], idea: [0.64, 0.5],
  };
  const port = () => W.w < W.h * 0.9;
  const X = () => (port() ? XP : XD);

  // 罗马的圣徒：树左是犹太人，树右是希腊人（宽屏六个，手机上只有前五个）
  const PPL = [
    { id: 'p0', label: '犹太人', sex: 'm', age: 'elder', hair: 'cloth', beard: true, robe: [112, 94, 78], accent: [214, 206, 186], jew: true },
    { id: 'p1', label: '希腊人', sex: 'f', age: 'adult', hair: 'long', robe: [170, 124, 112], accent: [236, 222, 200] },
    { id: 'p2', label: '犹太人', sex: 'f', age: 'adult', hair: 'veil', robe: [98, 108, 138], accent: [222, 214, 196], jew: true },
    { id: 'p3', label: '希腊人', sex: 'm', age: 'adult', hair: 'short', beard: false, robe: [204, 194, 172], accent: [150, 70, 60] },
    { id: 'p4', label: '犹太人', sex: 'm', age: 'adult', hair: 'cloth', beard: true, robe: [132, 108, 84], accent: [226, 218, 198], jew: true },
    { id: 'p5', label: '希腊人', sex: 'm', age: 'elder', hair: 'short', beard: true, robe: [146, 136, 118], accent: [96, 84, 120] },
    { id: 'p6', label: '希腊人', sex: 'f', age: 'child', hair: 'long', robe: [196, 150, 96], accent: [240, 226, 200] },
  ];
  const nPeople = () => (port() ? 5 : 6);
  const people = () => PPL.slice(0, nPeople());
  const homeX = i => X().ppl[i][0];
  const homeV = i => X().ppl[i][1];
  // 福音临到的次序：先是犹太人，后是希腊人（1:16）
  function wakeOrd(i) {
    const P = people(), jews = P.filter(p => p.jew), greeks = P.filter(p => !p.jew);
    const list = jews.concat(greeks), k = list.indexOf(P[i]);
    return 0.06 + 0.84 * (k + 0.5) / list.length;
  }
  // 白白地称义：光同时落到每一个人（并没有分别；只错开一点点）
  const GIFT = [0.02, 0.08, 0.05, 0.11, 0.0, 0.07, 0.1];
  const LAND_AT = 0.33;       // 光滴落下所用的程度（rmGift 从 g 到 g + LAND_AT）

  const ROBE_T = [150, 136, 112], ACC_T = [226, 214, 190];
  const ROBE_PH = [118, 96, 128], ACC_PH = [232, 214, 188];
  const ROBE_EN = [66, 66, 74], ROBE_EN2 = [134, 110, 88];
  const STONE = [214, 202, 180], ROOF = [150, 116, 88], WOOD = [118, 88, 60], PARCH = [232, 216, 180], INK = [70, 52, 40], CLAY = [176, 116, 76];
  const TRUNK = [92, 76, 60], LEAF = [112, 128, 92], LEAF_D = [70, 84, 60], LEAF_H = [178, 190, 160], DRYL = [150, 132, 98];
  const WILDL = [150, 172, 136], WILDH = [220, 232, 204], OLV = [[72, 50, 74], [118, 132, 72], [92, 62, 80]];
  const GOLD = [255, 216, 150], PALE = [236, 242, 255], ROSE = [255, 190, 190], SKYC = [176, 214, 255], GREEN = [190, 240, 170], VIOLET = [212, 190, 255];
  const FLW = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224], [250, 170, 110]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { lines: 0, starC: null, pourC: null, lifeX: null, windC: null, scroll: 'table', rolled: false, huddle: false, msg: false, bread: null, cup: null, enemy: false, phoebe: false, abr: false };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.35 : 1) * (LK[l] || 1);
  const PH = (l, v) => 34 * W.layerScale(l) * (W.w < 600 ? 1.55 : 1) * (LK[l] || 1) * (1 + 0.35 * (v || 0));   // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; let y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); if (!isFinite(y)) y = W.ridgeY(l, x); return y; };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const fY = (xf, v, l) => { const L = l == null ? 2 : l; const g = gY(L, xf); return g + (v || 0) * fieldH(L, g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const easeIO = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const easeOut = t => { t = clamp(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); };
  const inst = b => !!(b && b.instant) || !!W.replaying;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function snapLv(name, v) { W.set(name, v, true); }
  function sfx(b, name, o) { if (inst(b)) return; const a = au(); if (a && a.sfx) U.safe('romans.sfx', () => a.sfx(name, o || {})); }
  function hint(b, text, sec) { if (inst(b) || !GS.ui || !GS.ui.hint) return; U.safe('romans.hint', () => GS.ui.hint(text, sec || 6)); }
  function ring(b, x, y, rgb, r, dur, wd) { if (inst(b) || !isFinite(x) || !isFinite(y)) return; U.safe('romans.ring', () => fx().ring(x, y, rgb, r, dur || 2.4, wd || 1.4)); }
  function spark(b, x, y, n, rgb, spread, pass) { if (inst(b) || !isFinite(x) || !isFinite(y)) return; U.safe('romans.spark', () => fx().sparkle(x, y, n, rgb, spread, pass || 'top')); }
  function flash(b, k) { if (!inst(b)) W.flash = Math.max(W.flash || 0, k); }
  function bolt(b, x, near) { if (inst(b) || !GS.weather || !GS.weather.bolt) return; U.safe('romans.bolt', () => GS.weather.bolt({ x, near: !!near })); }

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function remove(id, fade) { if (has(id)) C().remove(id, { fade: !!fade && !W.replaying }); }
  function setProp(id, k) { if (has(id) && C().prop) C().prop(id, k); }
  const each = fn => people().forEach((p, i) => fn(p.id, i, p));
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v, rate) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, [v, rate || 0.08]);
  }
  const facingOf = f => ((f.fd != null ? f.fd : f.facing) >= 0 ? 1 : -1);
  // 胸口（心里的光所在）：各种姿势下的高度（以身高为 1）
  const CHEST = { stand: 0.62, walk: 0.62, run: 0.6, gaze: 0.62, point: 0.62, raise: 0.62, carry: 0.6, weep: 0.56, embrace: 0.6, bow: 0.47, kneel: 0.43, pray: 0.43, worship: 0.26, sit: 0.33, seat: 0.46, lie: 0.08, fall: 0.06, ride: 0.6 };
  const chY = new Map();
  function chest(id) {
    const f = fig(id);
    if (!f) return null;
    let x, y, h;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) { x = f._x; y = f._y; h = f._h || PH(2, f.v); }
    else { const l = f.layer == null ? 2 : f.layer; x = f.nx * W.w; y = fY(f.nx, f.v, l); h = PH(l, f.v); }
    const tgt = CHEST[f.pose] || 0.62;
    let e = chY.get(id);
    if (!e || W.replaying) { e = { k: tgt, f: W.frame }; chY.set(id, e); }
    else if (e.f !== W.frame) { e.k += (tgt - e.k) * Math.min(1, (W.dt || 0.016) * 2.2); e.f = W.frame; }
    const k = e.k;
    const fwd = f.pose === 'bow' ? 0.1 * facingOf(f) : 0;
    return [x + fwd * h, y - k * h, h, f.alpha == null ? 1 : f.alpha, f];
  }
  // 手里的东西所在（捧着 / 举起）
  function handAt(f, h) {
    const d = facingOf(f);
    if (f.pose === 'raise') return [f._x + d * 0.04 * h, f._y - 1.1 * h];
    if (f.pose === 'kneel' || f.pose === 'pray') return [f._x + d * 0.2 * h, f._y - 0.4 * h];
    if (f.pose === 'sit') return [f._x + d * 0.2 * h, f._y - 0.26 * h];
    return [f._x + d * 0.21 * h, f._y - 0.55 * h];
  }

  // 光的精灵（预先画好的柔光）
  let SP = null;
  function sprites() {
    if (SP) return SP;
    SP = {};
    const mk = (rgb, n, mid, a0) => {
      const c = document.createElement('canvas'); c.width = c.height = n;
      const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
      gr.addColorStop(0, rgba(rgb, a0 == null ? 1 : a0)); gr.addColorStop(mid, rgba(rgb, 0.36 * (a0 == null ? 1 : a0))); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, n, n);
      return c;
    };
    try {
      SP.warm = mk([255, 204, 138], 64, 0.3); SP.pale = mk(PALE, 64, 0.3); SP.gold = mk(GOLD, 64, 0.35);
      SP.cool = mk([200, 216, 255], 64, 0.28); SP.rose = mk(ROSE, 64, 0.32); SP.green = mk(GREEN, 64, 0.3);
      SP.sky = mk(SKYC, 64, 0.3); SP.violet = mk(VIOLET, 64, 0.3);
      SP.dark = mk([14, 14, 22], 64, 0.45, 0.9); SP.cold = mk([60, 70, 96], 64, 0.4, 0.8);
      const mote = rgb => {
        const n = 48, c = document.createElement('canvas'); c.width = c.height = n;
        const g = c.getContext('2d'), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
        gr.addColorStop(0, 'rgba(255,255,250,1)'); gr.addColorStop(0.16, 'rgba(255,252,236,0.95)'); gr.addColorStop(0.3, rgba(rgb, 0.4)); gr.addColorStop(1, rgba(rgb, 0));
        g.fillStyle = gr; g.fillRect(0, 0, n, n);
        return c;
      };
      SP.mote = mote([255, 244, 226]); SP.moteW = mote([255, 214, 140]);
      // 柔光的光束：自源头渐宽、渐淡
      const beam = rgb => {
        const bw = 192, bh = 48, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (x + 0.5) / bw, dy = Math.abs(y + 0.5 - bh / 2) / (bh / 2);
          const hw = 0.16 + 0.84 * t, q = dy / hw;
          const a = Math.pow(1 - t, 1.5) * Math.min(1, t * 14) * Math.exp(-q * q * 2.6);
          const i = (y * bw + x) * 4;
          d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = Math.round(255 * Math.min(1, a));
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.beam = beam([255, 238, 206]); SP.beamW = beam([255, 214, 150]);
      // 一道横的光（神的荣耀）：两端渐隐、上下柔化
      const bar = () => {
        const bw = 256, bh = 32, c = document.createElement('canvas'); c.width = bw; c.height = bh;
        const g = c.getContext('2d'), im = g.createImageData(bw, bh), d = im.data;
        for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
          const t = (x + 0.5) / bw, dy = (y + 0.5 - bh / 2) / (bh / 2);
          const a = ss(0, 0.2, t) * ss(1, 0.8, t) * Math.exp(-dy * dy * 3);
          const i = (y * bw + x) * 4;
          d[i] = 255; d[i + 1] = 226; d[i + 2] = 168; d[i + 3] = Math.round(255 * a);
        }
        g.putImageData(im, 0, 0);
        return c;
      };
      SP.bar = bar();
    } catch (e) { /* 无画布时略过 */ }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a) {
    if (!img || !(a > 0.004) || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - r, y - r, 2 * r, 2 * r);
  }
  function beamAt(ctx, img, x, y, ang, len, wid, a) {
    if (!img || !(a > 0.004) || !(len > 1) || !isFinite(x) || !isFinite(y)) return;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, 0, -wid / 2, len, wid);
    ctx.restore();
  }
  const THC = () => [[GOLD, SP.gold], [ROSE, SP.rose], [SKYC, SP.sky], [GREEN, SP.green], [VIOLET, SP.violet], [PALE, SP.pale]];

  // ════════════════════════════════════════════════════════════
  //  几何（随屏幕缩放重新量过）
  // ════════════════════════════════════════════════════════════
  const P = { w: 0, h: 0, gy: 0, port: null };
  let G = null;
  function layout() {
    const gy = gY(2, 0.7);
    if (G && P.w === W.w && P.h === W.h && Math.abs(gy - P.gy) < 0.75) return G;
    P.w = W.w; P.h = W.h; P.gy = gy;
    G = build();
    return G;
  }
  function build() {
    const g = { s: LS(2), s1: LS(1), s0: LS(0) };
    const Xs = X();
    const Hp = PH(2, 0);
    g.Hp = Hp;
    // 该犹的家
    const hw = Math.max(58 * g.s, 0.07 * W.w), hh = Hp * 1.45;
    g.house = { x: Xs.house * W.w, y: gY(2, Xs.house) + 3, w: hw, H: hh, door: Xs.house * W.w - hw * 0.2 };
    // 矮桌：在德提的右手边
    const tv = Xs.tertV, tH = PH(2, tv), tg = fY(Xs.tert, tv);
    const x0 = Xs.tert * W.w + 0.17 * tH, x1 = x0 + 0.95 * tH;
    g.table = { x0, x1, top: tg - 0.42 * tH, g: tg, Hp: tH };
    g.paulX = clamp((x1 + 0.2 * tH) / W.w, 0, 0.99);
    // 橄榄树
    g.tree = { x: Xs.tree * W.w, y: fY(Xs.tree, 0) + 1, H: Hp * 2.9 };
    // 远山上的十字架（中丘）
    g.cross = { x: Xs.cross * W.w, y: gY(1, Xs.cross) + 1, H: Math.max(22, 62 * g.s1) };
    // 爱的穹顶（8:28 的拱、8:39 的穹顶）
    const [d0, d1] = Xs.dome, cx = (d0 + d1) / 2 * W.w, rx = (d1 - d0) / 2 * W.w;
    const cy = fY((d0 + d1) / 2, 0.12);
    g.dome = { cx, cy, rx, ry: Math.max(rx * 0.75, g.tree.H * 1.85) };   // 拱顶高过地平线，光绳在天上织成
    // 远近的灯（中丘、远山；10:18）
    const R = U.mulberry32(1018);
    g.lamps = [];
    const mids = port() ? [0.52, 0.58, 0.66, 0.74, 0.82, 0.9, 0.97] : [0.53, 0.58, 0.63, 0.69, 0.75, 0.81, 0.87, 0.93, 0.98];
    mids.forEach((xf, i) => { const v = 0.06 + 0.3 * R(); g.lamps.push({ x: xf * W.w, y: fY(xf, v, 1) - 1.5 * g.s1, r: 5.5 * g.s1, d: 0.02 + 0.45 * i / mids.length, layer: 1 }); });
    const fars = port() ? [0.56, 0.64, 0.72, 0.8, 0.88, 0.96] : [0.56, 0.61, 0.66, 0.71, 0.76, 0.81, 0.86, 0.91, 0.96, 0.995];
    fars.forEach((xf, i) => { g.lamps.push({ x: xf * W.w, y: gY(0, xf) + (1 + 3 * R()) * g.s0, r: 5 * g.s0, d: 0.5 + 0.45 * i / fars.length, layer: 0 }); });
    // 众星（4:17–18）：天空里的位置先定好，出现的先后看离灵的远近
    const Rs = U.mulberry32(417);
    g.stars = [];
    const NS = port() ? 380 : 560;
    for (let i = 0; i < NS; i++) {
      const main = i < NS * 0.3;
      g.stars.push({ x: Rs() * W.w, y: (0.02 + 0.55 * Math.pow(Rs(), 1.2)) * W.h, m: main ? 0.7 + Rs() * 1.5 : 0.35 + Rs() * 0.55, tw: Rs() * TAU, main, d: 0 });
    }
    // 花（6:23 永生：生命的光环经过之处开出）
    const Rf = U.mulberry32(623);
    g.flowers = [];
    const NF = port() ? 34 : 60;
    for (let i = 0; i < NF; i++) {
      const xf = lerp(port() ? 0.37 : 0.4, 0.99, Rf()), v = lerp(0.2, 0.95, Math.pow(Rf(), 0.8));
      g.flowers.push({ x: xf * W.w, y: fY(xf, v), h: (4 + 5 * Rf()) * g.s * (0.8 + 0.5 * v), c: FLW[Math.floor(Rf() * FLW.length)], lean: (Rf() - 0.5) * 0.4, sd: Rf() * 9 });
    }
    g.flowers.sort((a, b) => a.y - b.y);
    // 报信的人一路的脚踪（10:15）
    g.prints = [];
    const px0 = homeX(0), px1 = Xs.msg;
    for (let k = 0, x = px0 - 0.012; x > px1; x -= 0.011, k++) g.prints.push({ xf: x, x: x * W.w, y: fY(x, homeV(0) + (k % 2 ? 0.02 : -0.01)) });
    buildTree(g);
    return g;
  }

  // ════════════════════════════════════════════════════════════
  //  橄榄树（本地坐标以树高为 1；原点在树根，y 向上为负）
  //  [锚点 x, 锚点 y, 方向（自正上方量起，向右为正）, 长, 弯]
  // ════════════════════════════════════════════════════════════
  const BR = [
    [-0.006, -0.40, -0.95, 0.40, 0.12],
    [0.012, -0.45, -0.42, 0.46, -0.1],
    [-0.01, -0.34, -1.36, 0.33, 0.14],     // 2：被折下来（11:17）
    [0.02, -0.47, 0.06, 0.5, 0.08],
    [0.03, -0.45, 0.48, 0.45, -0.12],
    [0.035, -0.35, 1.3, 0.34, -0.14],      // 5：被折下来
    [0.04, -0.41, 0.95, 0.4, 0.1],
  ];
  const BROKEN = [2, 5];
  const WILD = [
    [-0.01, -0.345, -1.2, 0.31, 0.1],      // 接在 2 的地方
    [0.035, -0.355, 1.18, 0.32, -0.1],     // 接在 5 的地方
    [0.024, -0.52, -0.16, 0.36, 0.12],     // 又接一枝
  ];
  const FALLEN = [[-0.52, -0.012, -1.52, 0.33, 0.04], [0.56, -0.012, 1.52, 0.34, -0.04]];
  function brGeo(b) {
    const dx = Math.sin(b[2]), dy = -Math.cos(b[2]);
    const ex = b[0] + dx * b[3], ey = b[1] + dy * b[3];
    const cx = b[0] + dx * b[3] * 0.5 - dy * b[4] * b[3], cy = b[1] + dy * b[3] * 0.5 + dx * b[4] * b[3];
    return { ax: b[0], ay: b[1], cx, cy, ex, ey };
  }
  const bez = (q, t) => { const u = 1 - t; return [u * u * q.ax + 2 * u * t * q.cx + t * t * q.ex, u * u * q.ay + 2 * u * t * q.cy + t * t * q.ey]; };
  const lerpB = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function buildTree(g) {
    const R = U.mulberry32(1117);
    const clusters = n => {
      const out = [];
      const ts = n >= 3 ? [0.46, 0.72, 0.97] : [0.6, 0.96];
      for (const t of ts) {
        const leaves = [];
        for (let k = 0; k < 9; k++) leaves.push([(R() - 0.5) * 1.7, (R() - 0.62) * 1.2, (R() - 0.5) * 2.4, 0.7 + R() * 0.5, R() < 0.3]);
        const olives = [];
        for (let k = 0; k < 3; k++) olives.push([(R() - 0.5) * 1.2, (R() - 0.2) * 0.7, Math.floor(R() * 3)]);
        out.push({ t, dx: (R() - 0.5) * 0.03, dy: (R() - 0.5) * 0.03, r: 0.085 + R() * 0.03, leaves, olives });
      }
      return out;
    };
    g.treeCl = BR.map(b => clusters(b[3] > 0.38 ? 3 : 2));
    g.wildCl = WILD.map(() => clusters(2));
    // 折下的枝子后来接回的地方：1 与 4 两枝的半腰
    const a1 = bez(brGeo(BR[1]), 0.55), a4 = bez(brGeo(BR[4]), 0.5);
    g.back = [[a1[0], a1[1], -0.78, 0.3, 0.1], [a4[0], a4[1], 0.8, 0.3, -0.1]];
  }
  // 一根枝子（木与叶、橄榄）
  function drawBranch(ctx, T0, b, cl, o) {
    const H = T0.H, q = brGeo(b), X0 = T0.x, Y0 = T0.y;
    const P0 = [X0 + q.ax * H, Y0 + q.ay * H], P1 = [X0 + q.cx * H, Y0 + q.cy * H], P2 = [X0 + q.ex * H, Y0 + q.ey * H];
    ctx.globalAlpha = o.a;
    ctx.strokeStyle = css(o.wood || TRUNK, 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(0.8, 0.016 * H);
    ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.quadraticCurveTo(P1[0], P1[1], P2[0], P2[1]); ctx.stroke();
    ctx.lineWidth = Math.max(1.2, 0.03 * H);
    const m = bez(q, 0.45);
    ctx.beginPath(); ctx.moveTo(P0[0], P0[1]); ctx.quadraticCurveTo(X0 + lerp(q.ax, q.cx, 0.45) * H, Y0 + lerp(q.ay, q.cy, 0.45) * H, X0 + m[0] * H, Y0 + m[1] * H); ctx.stroke();
    ctx.lineCap = 'butt';
    // 叶：暗的底、窄长的叶、亮的叶背
    const cs = cl.map(c => { const p = bez(q, c.t); return [X0 + (p[0] + c.dx) * H, Y0 + (p[1] + c.dy) * H, c.r * H, c]; });
    ctx.fillStyle = css(o.leafD || LEAF_D, 2, 0.95);
    ctx.beginPath();
    for (const [x, y, r] of cs) { ctx.moveTo(x + r * 0.95, y); ctx.ellipse(x, y, r * 0.95, r * 0.55, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(o.leaf || LEAF, 2, 1, o.ex || 0);
    ctx.beginPath();
    for (const [x, y, r, c] of cs) for (const L of c.leaves) {
      const lx = x + L[0] * r, ly = y + L[1] * r, ll = r * 0.42 * L[3];
      ctx.moveTo(lx + Math.cos(L[2]) * ll, ly + Math.sin(L[2]) * ll);
      ctx.ellipse(lx, ly, ll, ll * 0.3, L[2], 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css(o.leafH || LEAF_H, 2, 0.8, (o.ex || 0) + 0.04);
    ctx.beginPath();
    for (const [x, y, r, c] of cs) for (const L of c.leaves) {
      if (!L[4]) continue;
      const lx = x + L[0] * r, ly = y + L[1] * r - r * 0.1, ll = r * 0.36 * L[3];
      ctx.moveTo(lx + Math.cos(L[2]) * ll, ly + Math.sin(L[2]) * ll);
      ctx.ellipse(lx, ly, ll, ll * 0.26, L[2], 0, TAU);
    }
    ctx.fill();
    // 橄榄
    if (o.olive > 0.02) {
      ctx.globalAlpha = o.a * Math.min(1, o.olive * 1.3);
      for (let k = 0; k < 3; k++) {
        ctx.fillStyle = css(OLV[k], 2);
        ctx.beginPath();
        for (const [x, y, r, c] of cs) for (const ov of c.olives) {
          if (ov[2] !== k) continue;
          const ox = x + ov[0] * r, oy = y + ov[1] * r + r * 0.25, orr = Math.max(0.9, r * 0.13 * (0.5 + 0.5 * o.olive));
          ctx.moveTo(ox + orr * 0.8, oy); ctx.ellipse(ox, oy, orr * 0.8, orr, 0.3, 0, TAU);
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    return { P0, P1, P2 };
  }
  // 折下的枝子（2、5）此刻在何处
  function brokenB(k) {
    const g = G, A = BR[BROKEN[k]], F = FALLEN[k], B = g.back[k];
    if (LV.rmBack > 0.001) return lerpB(F, B, easeIO(LV.rmBack));
    return lerpB(A, F, easeIO(LV.rmFall));
  }
  // 野橄榄的嫩枝：自远方飞来（位置以树的本地坐标给出）
  function wildT(j) { return clamp((LV.rmGraft - j * 0.22) / 0.5, 0, 1); }
  function wildFrom(j) {
    const g = G, t = g.tree;
    const src = port() ? [[0.2, 0.42], [1.05, 0.46], [0.62, 0.3]] : [[0.36, 0.3], [1.06, 0.34], [0.58, 0.12]];
    const s = src[j];
    return [(s[0] * W.w - t.x) / t.H, (s[1] * W.h - t.y) / t.H, WILD[j][2] + (j === 1 ? 2.4 : -2.4), WILD[j][3], WILD[j][4]];
  }
  // 树静止时先画在一张小画布上（时辰改变、程度改变时才重画）；嫩枝飞来、枝子折下接回时每帧直接画
  const TC = { cv: null, key: '', bx: 0, by: 0, bw: 0, bh: 0, frame: -99, geo: '' };
  function treeMoving() {
    const f = LV.rmFall, gr = LV.rmGraft, bk = LV.rmBack;
    return (f > 0.01 && f < 0.995 && bk < 0.001) || (gr > 0 && gr < 0.999) || (bk > 0.001 && bk < 1) || (LV.rmOlive > 0.01 && LV.rmOlive < 0.99);
  }
  function drawTree(ctx) {
    const t = G.tree, H = t.H;
    if (treeMoving() || !document || !document.createElement) { drawTreeNow(ctx); return; }
    const dpr = W.dpr || 1;
    const q = v => Math.round(v * 60);
    const side = (W.night > 0.5 && LV.moon > 0.3 ? W.moon.x : W.core.x) < t.x ? 1 : 0;
    const key = [Math.round(U.fract(W.tod) * 200), q(W.daylight), q(W.dusk), q(nightK()), q(LV.rmFull), q(LV.rmSap), q(LV.rmOlive), LV.rmFall > 0.5 ? 1 : 0, LV.rmBack > 0.5 ? 1 : 0, LV.rmGraft > 0.99 ? 1 : 0,
      q(LV.storm || 0), q(LV.gloom || 0), q(LV.light || 0), Math.round(t.x), Math.round(t.y), Math.round(H), dpr, side].join(',');
    if (!TC.cv) { try { TC.cv = document.createElement('canvas'); } catch (e) { drawTreeNow(ctx); return; } }
    const geo = [Math.round(t.x), Math.round(t.y), Math.round(H), dpr].join(',');
    // 光线的细小变化：隔几帧才重画一次（形状变了则立即重画）
    if (TC.key !== key && (TC.geo !== geo || W.frame - TC.frame >= 8 || W.frame < TC.frame)) {
      TC.frame = W.frame; TC.geo = geo;
      TC.bx = Math.floor(t.x - H * 1.0); TC.by = Math.floor(t.y - H * 1.25); TC.bw = Math.ceil(H * 2.0); TC.bh = Math.ceil(H * 1.35);
      const cv = TC.cv, w = Math.max(1, Math.ceil(TC.bw * dpr)), h = Math.max(1, Math.ceil(TC.bh * dpr));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      const c2 = cv.getContext('2d');
      c2.setTransform(1, 0, 0, 1, 0, 0);
      c2.clearRect(0, 0, w, h);
      c2.setTransform(dpr, 0, 0, dpr, -TC.bx * dpr, -TC.by * dpr);
      drawTreeNow(c2);
      TC.key = key;
    }
    ctx.drawImage(TC.cv, TC.bx, TC.by, TC.bw, TC.bh);
  }
  function drawTreeNow(ctx) {
    const g = G, t = g.tree, H = t.H;
    const sap = LV.rmSap;
    // 折下的枝子（躺在地上、或又升回去）
    const brokenOn = LV.rmFall > 0.02 || LV.rmBack > 0.001;
    if (brokenOn) BROKEN.forEach((bi, k) => {
      const dryK = LV.rmBack > 0.001 ? 1 - LV.rmBack : LV.rmFall;
      drawBranch(ctx, t, brokenB(k), g.treeCl[bi], { a: 1, leaf: mix(LEAF, DRYL, dryK * 0.8), leafD: mix(LEAF_D, [96, 84, 64], dryK * 0.8), leafH: mix(LEAF_H, [200, 186, 150], dryK * 0.6), olive: LV.rmBack > 0.99 ? LV.rmOlive : 0 });
    });
    // 树干：老而扭曲，两股绞在一起
    const x = t.x, y = t.y;
    ctx.fillStyle = css(TRUNK, 2);
    ctx.beginPath();
    ctx.moveTo(x - 0.075 * H, y + 1);
    ctx.quadraticCurveTo(x - 0.03 * H, y - 0.06 * H, x - 0.045 * H, y - 0.16 * H);
    ctx.bezierCurveTo(x - 0.065 * H, y - 0.28 * H, x - 0.005 * H, y - 0.36 * H, x - 0.02 * H, y - 0.47 * H);
    ctx.lineTo(x + 0.04 * H, y - 0.48 * H);
    ctx.bezierCurveTo(x + 0.03 * H, y - 0.36 * H, x + 0.075 * H, y - 0.26 * H, x + 0.045 * H, y - 0.14 * H);
    ctx.quadraticCurveTo(x + 0.04 * H, y - 0.05 * H, x + 0.085 * H, y + 1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([60, 48, 38], 2, 0.8);
    ctx.lineWidth = Math.max(0.7, 0.008 * H);
    ctx.beginPath(); ctx.moveTo(x + 0.02 * H, y - 0.02 * H); ctx.bezierCurveTo(x - 0.03 * H, y - 0.15 * H, x + 0.04 * H, y - 0.3 * H, x + 0.005 * H, y - 0.45 * H); ctx.stroke();
    // 迎光的一边
    const sd = (W.night > 0.5 && LV.moon > 0.3 ? W.moon.x : W.core.x) < x ? -1 : 1;
    ctx.strokeStyle = css([210, 184, 150], 2, 0.35 * (0.3 + 0.7 * W.daylight), 0.1);
    ctx.beginPath(); ctx.moveTo(x + sd * 0.06 * H, y - 0.02 * H); ctx.bezierCurveTo(x + sd * 0.035 * H, y - 0.2 * H, x + sd * 0.05 * H, y - 0.3 * H, x + sd * 0.03 * H, y - 0.46 * H); ctx.stroke();
    // 枝子
    const ex = 0.06 * sap + 0.1 * LV.rmFull + 0.05 * nightK();
    BR.forEach((b, i) => {
      if (BROKEN.includes(i) && brokenOn) return;
      drawBranch(ctx, t, b, g.treeCl[i], { a: 1, ex, olive: LV.rmOlive });
    });
    // 野橄榄（接上的嫩枝）
    WILD.forEach((b, j) => {
      const wt = wildT(j);
      if (wt <= 0) return;
      const bb = wt >= 1 ? b : lerpB(wildFrom(j), b, easeIO(wt));
      drawBranch(ctx, t, bb, g.wildCl[j], { a: Math.min(1, wt * 4), leaf: WILDL, leafD: [110, 130, 104], leafH: WILDH, ex: 0.05 + ex, olive: LV.rmOlive });
    });
  }
  // 根的肥汁、接上之处的光、飞来的嫩枝的光尾（叠在人之上的 air 层）
  function drawTreeLight(ctx) {
    const g = G, t = g.tree, H = t.H, sap = LV.rmSap;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (sap > 0.01) {
      glowAt(ctx, SP.gold, t.x, t.y - 0.02 * H, H * (0.25 + 0.1 * Math.sin(W.t * 1.3)), 0.55 * Math.min(1, sap * 2.5) * (0.6 + 0.4 * (1 - W.daylight * 0.5)));
      // 金光自根升到树干，再到每一根枝子
      const ft = clamp(sap * 2.2, 0, 1);
      ctx.strokeStyle = rgba([255, 222, 150], 0.5 * Math.min(1, sap * 3));
      ctx.lineWidth = Math.max(1.2, 0.022 * H);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(t.x + 0.005 * H, t.y); ctx.lineTo(t.x + 0.01 * H, t.y - 0.47 * H * ft); ctx.stroke();
      const fb = clamp((sap - 0.4) / 0.5, 0, 1);
      if (fb > 0) {
        ctx.lineWidth = Math.max(0.8, 0.012 * H);
        ctx.beginPath();
        const brs = BR.filter((_, i) => !(BROKEN.includes(i) && (LV.rmFall > 0.02 && LV.rmBack < 0.99))).concat(WILD.filter((_, j) => wildT(j) >= 1));
        if (LV.rmBack >= 0.99) brs.push(...G.back);
        for (const b of brs) {
          const q = brGeo(b);
          ctx.moveTo(t.x + q.ax * H, t.y + q.ay * H);
          for (let k = 1; k <= 8; k++) { const p = bez(q, fb * k / 8); ctx.lineTo(t.x + p[0] * H, t.y + p[1] * H); }
        }
        ctx.stroke();
      }
      ctx.lineCap = 'butt';
    }
    // 接上之处：一点暖光
    WILD.forEach((b, j) => {
      const wt = wildT(j);
      if (wt <= 0) return;
      if (wt < 1) {
        const bb = lerpB(wildFrom(j), b, easeIO(wt)), p = [t.x + bb[0] * H, t.y + bb[1] * H];
        glowAt(ctx, SP.green, p[0], p[1], H * 0.16, 0.75);
        const pb = lerpB(wildFrom(j), b, easeIO(Math.max(0, wt - 0.08)));
        beamAt(ctx, SP.beam, p[0], p[1], Math.atan2(t.y + pb[1] * H - p[1], t.x + pb[0] * H - p[0]), H * 0.5, H * 0.12, 0.5);
      } else glowAt(ctx, SP.gold, t.x + b[0] * H, t.y + b[1] * H, H * 0.08, 0.45 + 0.15 * Math.sin(W.t * 2 + j));
    });
    if (LV.rmBack > 0.001 && LV.rmBack < 1) BROKEN.forEach((bi, k) => { const b = brokenB(k); glowAt(ctx, SP.gold, t.x + b[0] * H, t.y + b[1] * H, H * 0.12, 0.6); });
    else if (LV.rmBack >= 1) G.back.forEach(b => glowAt(ctx, SP.gold, t.x + b[0] * H, t.y + b[1] * H, H * 0.07, 0.4));
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  该犹的家、矮桌、泥灯、信卷
  // ════════════════════════════════════════════════════════════
  function drawHouse(ctx) {
    const hs = G.house, H = hs.H, w = hs.w, x = hs.x, y = hs.y;
    const L = x - w / 2, top = y - H;
    const sd = W.core.x < x ? -1 : 1;
    ctx.fillStyle = css(STONE, 2);
    ctx.fillRect(L, top, w, H + 4);
    // 背光的一面略暗
    ctx.fillStyle = css([150, 138, 118], 2, 0.35);
    if (sd < 0) ctx.fillRect(x + w * 0.2, top, w * 0.3, H + 4); else ctx.fillRect(L, top, w * 0.3, H + 4);
    // 平顶与檐
    ctx.fillStyle = css(ROOF, 2);
    ctx.fillRect(L - w * 0.05, top - H * 0.08, w * 1.1, H * 0.1);
    ctx.fillStyle = css([120, 92, 70], 2);
    for (let i = 0; i < 6; i++) ctx.fillRect(L + w * (0.04 + i * 0.18), top + H * 0.02, w * 0.035, H * 0.05);
    // 门（拱）
    const dx = hs.door, dw = w * 0.22, dh = H * 0.62;
    ctx.fillStyle = css([44, 34, 28], 2);
    ctx.beginPath();
    ctx.moveTo(dx - dw / 2, y + 2); ctx.lineTo(dx - dw / 2, y - dh + dw / 2);
    ctx.arc(dx, y - dh + dw / 2, dw / 2, Math.PI, 0);
    ctx.lineTo(dx + dw / 2, y + 2); ctx.closePath(); ctx.fill();
    // 窗
    const wx = x + w * 0.24, wy = top + H * 0.3, ww = w * 0.14, wh = H * 0.2;
    ctx.fillRect(wx - ww / 2, wy, ww, wh);
    // 门窗里的灯光
    const lamp = 0.25 + 0.75 * nightK();
    ctx.fillStyle = rgba([255, 200, 130], 0.55 * lamp);
    ctx.beginPath();
    ctx.moveTo(dx - dw * 0.34, y + 1); ctx.lineTo(dx - dw * 0.34, y - dh + dw / 2);
    ctx.arc(dx, y - dh + dw / 2, dw * 0.34, Math.PI, 0);
    ctx.lineTo(dx + dw * 0.34, y + 1); ctx.closePath(); ctx.fill();
    ctx.fillRect(wx - ww * 0.36, wy + wh * 0.15, ww * 0.72, wh * 0.7);
    // 迎光的边
    ctx.strokeStyle = css([255, 236, 204], 2, 0.3 * W.daylight, 0.1);
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (sd < 0) { ctx.moveTo(L, y); ctx.lineTo(L, top); } else { ctx.moveTo(L + w, y); ctx.lineTo(L + w, top); }
    ctx.lineTo(sd < 0 ? L + w : L, top);
    ctx.stroke();
  }
  function houseGlow(ctx) {
    const hs = G.house, k = nightK();
    if (k < 0.05) return;
    glowAt(ctx, SP.warm, hs.door, hs.y - hs.H * 0.3, hs.H * 0.6, 0.35 * k);
  }
  // 德提坐的凳
  function drawStool(ctx) {
    const Xs = X(), h = PH(2, Xs.tertV), x = Xs.tert * W.w, y = fY(Xs.tert, Xs.tertV);
    ctx.fillStyle = css(WOOD, 2);
    ctx.fillRect(x - 0.17 * h, y - 0.27 * h, 0.3 * h, 0.045 * h);
    ctx.fillRect(x - 0.15 * h, y - 0.27 * h, 0.035 * h, 0.27 * h);
    ctx.fillRect(x + 0.09 * h, y - 0.27 * h, 0.035 * h, 0.27 * h);
  }
  function scrollLen() { return clamp(S.lines / 13, 0, 1); }
  // 信卷此刻的位置（桌上 / 保罗手里 / 非比手里）
  function scrollPt() {
    const tb = G.table;
    if (S.scroll !== 'table') {
      const f = fig(S.scroll);
      if (f && f._vis) { const h = handAt(f, f._h); return [h[0], h[1] - 0.02 * f._h]; }
    }
    return [lerp(tb.x0, tb.x1, 0.66), tb.top - tb.Hp * 0.04];
  }
  function drawTable(ctx) {
    const tb = G.table, Hh = tb.Hp, x0 = tb.x0, x1 = tb.x1, top = tb.top, gnd = tb.g;
    ctx.fillStyle = css(WOOD, 2);
    ctx.fillRect(x0 + 0.08 * Hh, top, 0.05 * Hh, gnd - top);
    ctx.fillRect(x1 - 0.13 * Hh, top, 0.05 * Hh, gnd - top);
    ctx.fillRect(x0, top - 0.035 * Hh, x1 - x0, 0.05 * Hh);
    ctx.strokeStyle = css([226, 196, 150], 2, 0.35 * (0.3 + 0.7 * W.daylight), 0.1);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, top - 0.035 * Hh); ctx.lineTo(x1, top - 0.035 * Hh); ctx.stroke();
    // 墨盒
    ctx.fillStyle = css([50, 40, 34], 2);
    ctx.fillRect(x0 + 0.3 * Hh, top - 0.1 * Hh, 0.06 * Hh, 0.065 * Hh);
    // 泥灯
    const lx = x0 + 0.14 * Hh, ly = top - 0.05 * Hh;
    ctx.fillStyle = css(CLAY, 2);
    ctx.beginPath(); ctx.ellipse(lx, ly, 0.075 * Hh, 0.03 * Hh, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx + 0.06 * Hh, ly - 0.01 * Hh); ctx.lineTo(lx + 0.11 * Hh, ly - 0.025 * Hh); ctx.lineTo(lx + 0.07 * Hh, ly + 0.012 * Hh); ctx.fill();
    // 信卷（桌上：卷着的一轴，垂下的一幅越写越长）
    if (S.scroll === 'table') {
      const rx = lerp(x0, x1, 0.72), rr = 0.045 * Hh;
      if (!S.rolled) {
        const len = (0.12 + 0.44 * scrollLen()) * Hh, sx0 = lerp(x0, x1, 0.44), sx1 = lerp(x0, x1, 0.64);
        ctx.fillStyle = css(PARCH, 2, 1, 0.05);
        ctx.beginPath(); ctx.moveTo(sx0, top - 0.03 * Hh); ctx.lineTo(sx1, top - 0.03 * Hh); ctx.lineTo(sx1 - 0.01 * Hh, top + len); ctx.quadraticCurveTo((sx0 + sx1) / 2, top + len + 0.03 * Hh, sx0 + 0.01 * Hh, top + len); ctx.closePath(); ctx.fill();
        // 字行
        ctx.strokeStyle = css(INK, 2, 0.55);
        ctx.lineWidth = Math.max(0.5, 0.008 * Hh);
        ctx.beginPath();
        for (let yy = top + 0.03 * Hh; yy < top + len - 0.03 * Hh; yy += 0.032 * Hh) {
          const k = hsh(yy * 0.37);
          ctx.moveTo(sx0 + 0.02 * Hh, yy); ctx.lineTo(sx1 - (0.02 + 0.05 * k) * Hh, yy);
        }
        ctx.stroke();
      }
      ctx.fillStyle = css(PARCH, 2, 1, 0.02);
      ctx.beginPath(); ctx.ellipse(rx, top - rr, 0.16 * Hh, rr, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([196, 176, 138], 2);
      ctx.beginPath(); ctx.ellipse(rx + 0.16 * Hh, top - rr, rr * 0.4, rr, 0, 0, TAU); ctx.fill();
      if (S.rolled) { ctx.fillStyle = css([170, 60, 50], 2); ctx.fillRect(rx - 0.012 * Hh, top - 2 * rr, 0.024 * Hh, 2 * rr); }
    }
  }
  // 手里的信卷
  function drawHeldScroll(ctx) {
    if (S.scroll === 'table') return;
    const f = fig(S.scroll);
    if (!f || !f._vis) return;
    const h = f._h, p = handAt(f, h), a = f.alpha == null ? 1 : f.alpha;
    const len = 0.32 * h, rr = 0.045 * h;
    ctx.globalAlpha = a;
    ctx.save();
    ctx.translate(p[0], p[1]);
    if (f.pose === 'raise') ctx.rotate(0);
    ctx.fillStyle = css(PARCH, 2, 1, 0.05);
    ctx.beginPath(); ctx.ellipse(0, 0, len / 2, rr, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([196, 176, 138], 2);
    ctx.beginPath(); ctx.ellipse(len / 2, 0, rr * 0.4, rr, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([170, 60, 50], 2);
    ctx.fillRect(-0.012 * h, -rr, 0.024 * h, 2 * rr);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 泥灯的火、信卷的光（叠在人之上）
  function drawTableLight(ctx) {
    const tb = G.table, Hh = tb.Hp;
    const lx = tb.x0 + 0.24 * Hh, ly = tb.top - 0.08 * Hh;
    const fl = 0.85 + 0.15 * Math.sin(W.t * 13) * Math.sin(W.t * 5.3);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, lx, ly, Hh * (0.55 + 0.25 * nightK()) * fl, 0.25 + 0.6 * nightK());
    ctx.restore();
    ctx.fillStyle = 'rgb(255,222,150)';
    const s = 0.035 * Hh * fl;
    ctx.beginPath(); ctx.moveTo(lx, ly - s * 2.3); ctx.quadraticCurveTo(lx + s, ly - s * 0.2, lx, ly + s * 0.7); ctx.quadraticCurveTo(lx - s, ly - s * 0.2, lx, ly - s * 2.3); ctx.fill();
    // 信卷的光（正在写 / 被举起）
    const wk = Math.max(LV.rmWrite, S.scroll === 'phoebe' ? 0.5 + 0.5 * LV.rmFull : 0);
    if (wk > 0.02) {
      const p = scrollPt();
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, p[0], p[1], Hh * (0.35 + 0.35 * wk), 0.5 * wk * (0.6 + 0.4 * nightK()));
      glowAt(ctx, SP.mote, p[0], p[1], Hh * 0.1 * (1 + wk), 0.6 * wk);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  心里的光（1:16、1:21、3:24、5:5、8:26、15:13）
  // ════════════════════════════════════════════════════════════
  function breathOrder() {
    // 光的丝带自灵来的一边起，依次经过各人
    const P = people(), c = S.windC || [0.3, 0.4];
    const idx = P.map((_, i) => i).sort((a, b) => (homeX(a) - homeX(b)) * (c[0] < 0.66 ? 1 : -1));
    const out = new Array(P.length);
    idx.forEach((i, k) => { out[i] = (k + 1) / (P.length + 2); });
    return out;
  }
  function heartK(i, bo) {
    const wake = clamp((LV.rmWake - wakeOrd(i)) / 0.08, 0, 1);
    let k = wake * (1 - 0.9 * LV.rmDim);
    const gift = clamp((LV.rmGift - (GIFT[i] + LAND_AT)) / 0.05, 0, 1);
    k = Math.max(k, gift);
    if (bo && LV.rmBreath > 0.001) {
      const d = LV.rmBreath - bo[i];
      k = k * (1 + 0.35 * (d > 0 ? 1 : 0)) + 0.8 * Math.exp(-d * d / 0.004) * LV.rmWind;
    }
    return k;
  }
  function drawHearts(ctx) {
    const P = people(), bo = LV.rmBreath > 0.001 ? breathOrder() : null;
    const warm = LV.rmWarm, full = LV.rmFull, nk = nightK();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < P.length; i++) {
      const q = chest(P[i].id);
      if (!q) continue;
      const k = heartK(i, bo);
      if (k < 0.01) continue;
      const [x, y, h, al] = q;
      const r = h * (0.26 + 0.14 * Math.min(1.4, k) + 0.34 * full) * (1 + 0.04 * Math.sin(W.t * 2.1 + i));
      const a = Math.min(1.4, k) * (0.4 + 0.45 * nk) * (1 + 0.4 * full) * al * (1 - 0.85 * LV.rmHand * (P[i].id === 'p0' && S.msg ? 0 : 1));
      glowAt(ctx, SP.pale, x, y, r, a * (1 - warm));
      glowAt(ctx, SP.gold, x, y, r, a * warm);
      glowAt(ctx, warm > 0.5 ? SP.moteW : SP.mote, x, y, h * (0.06 + 0.04 * Math.min(1, k)), a * 0.85);
    }
    // 其余的人（保罗、德提、非比、邻舍）在喜乐、平安里也亮起来
    if (full > 0.02) for (const id of ['paul', 'tertius', 'phoebe', 'enemy']) {
      const q = chest(id);
      if (!q) continue;
      glowAt(ctx, SP.gold, q[0], q[1], q[2] * (0.3 + 0.3 * full), full * (0.4 + 0.4 * nk) * q[3]);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 1:16 福音的光自信卷飞到各人心里 ────────────────────────
  function arcPt(a, b, t, lift) {
    const cx = (a[0] + b[0]) / 2, cy = Math.min(a[1], b[1]) - lift;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]];
  }
  function drawGospel(ctx) {
    const w = LV.rmWake;
    if (w <= 0.001 || w >= 1.05) return;
    const P = people(), src = scrollPt(), lift = W.h * (port() ? 0.12 : 0.16);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < P.length; i++) {
      const o = wakeOrd(i), t = clamp((w - (o - 0.11)) / 0.11, 0, 1);
      if (t <= 0 || t >= 1) continue;
      const q = chest(P[i].id);
      if (!q) continue;
      const te = easeIO(t);
      for (let k = 9; k >= 0; k--) {
        const tt = te - k * 0.022;
        if (tt < 0) continue;
        const p = arcPt(src, q, tt, lift);
        glowAt(ctx, k ? SP.gold : SP.mote, p[0], p[1], q[2] * (k ? 0.12 * (1 - k / 11) : 0.16), (k ? 0.5 * (1 - k / 10) : 1));
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 3:23 神的荣耀：高天上平平的一道光；各人的光柱都够不着；3:24 光落到每一个人 ──
  function gloryY() { return X().glory[2] * W.h; }
  function drawGlory(ctx) {
    const a = LV.rmGlory;
    const P = people();
    const [x0f, x1f] = X().glory, y = gloryY(), x0 = x0f * W.w, x1 = x1f * W.w;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (a > 0.01 && SP.bar) {
      // 自上而来的荣光：一层宽而淡的光在上，一道柔和的光带在下（没有硬的线）
      const hb = M() * 0.08, na = 0.75 + 0.25 * W.night;
      ctx.globalAlpha = Math.min(1, a * 0.3 * na);
      ctx.drawImage(SP.bar, x0 - (x1 - x0) * 0.04, y - hb * 3.6, (x1 - x0) * 1.08, hb * 4.4);
      ctx.globalAlpha = Math.min(1, a * 0.72 * na);
      ctx.drawImage(SP.bar, x0, y - hb, x1 - x0, 2 * hb);
      ctx.globalAlpha = Math.min(1, a * 0.22 * na);
      ctx.drawImage(SP.bar, lerp(x0, x1, 0.06), y - hb * 0.5, (x1 - x0) * 0.88, hb);
      // 光中缓缓流动的几团柔光（不是一串灯）
      for (let k = 0; k < 5; k++) {
        const u = U.fract(W.t * 0.035 + k / 5);
        glowAt(ctx, SP.pale, lerp(x0, x1, 0.12 + 0.76 * u), y - hb * 0.15, M() * 0.06, a * 0.16 * Math.sin(Math.PI * u));
      }
    }
    // 各人心里升起的光柱，都够不着
    const r = LV.rmReach;
    if (r > 0.001 && r < 1) {
      const up = easeOut(clamp(r / 0.55, 0, 1)), fade = ss(0, 0.12, r) * (1 - ss(0.7, 1, r));
      for (let i = 0; i < P.length; i++) {
        const q = chest(P[i].id);
        if (!q) continue;
        const top = q[1] - q[2] * 0.3, len = (top - y) * 0.52 * up;
        if (len < 2) continue;
        beamAt(ctx, SP.beam, q[0], top, -Math.PI / 2, len * 1.25, q[2] * 0.3, 0.55 * fade);
        glowAt(ctx, SP.pale, q[0], top - len, q[2] * 0.18, 0.7 * fade);
      }
    }
    // 光一滴一滴落下（同时落到每一个人）
    const gv = LV.rmGift;
    if (gv > 0.001 && gv < 0.6) {
      for (let i = 0; i < P.length; i++) {
        const t = clamp((gv - GIFT[i]) / LAND_AT, 0, 1);
        if (t <= 0 || t >= 1) continue;
        const q = chest(P[i].id);
        if (!q) continue;
        const e = t * t, py = lerp(y, q[1], e);
        beamAt(ctx, SP.beamW, q[0], py, -Math.PI / 2, Math.min(py - y, q[2] * 2.2) + 1, q[2] * 0.25, 0.6);
        glowAt(ctx, SP.gold, q[0], py, q[2] * 0.28, 0.9);
        glowAt(ctx, SP.mote, q[0], py, q[2] * 0.12, 1);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 4:17 使无变为有：众星 ────────────────────────────────
  const BORN = [], SB = [[], [], [], [], [], []];
  function drawStars(ctx) {
    const a1 = LV.rmStars, a2 = LV.rmSeed;
    if (a1 < 0.001 && a2 < 0.001) return;
    const nk = clamp(W.night * 1.2 + W.dusk * 0.25, 0, 1) * (1 - 0.85 * (LV.storm || 0));
    if (nk < 0.02) return;
    const c = S.starC || [0.7, 0.25], cx = c[0] * W.w, cy = c[1] * W.h;
    const dmax = Math.hypot(Math.max(cx, W.w - cx), Math.max(cy, W.h * 0.6 - cy)) || 1;
    ctx.fillStyle = 'rgb(255,248,228)';
    const NB = 6;
    for (let bi = 0; bi < NB; bi++) SB[bi].length = 0;
    const unit = Math.max(0.7, W.unit * 0.9);
    for (const s of G.stars) {
      const d = Math.hypot(s.x - cx, s.y - cy) / dmax;
      const L = s.main ? a1 : a2;
      const vis = clamp((L * 1.15 - d) / 0.08, 0, 1);
      if (vis <= 0) continue;
      const tw = 0.7 + 0.3 * Math.sin(W.t * (1.3 + s.m) + s.tw);
      const a = Math.min(1, vis * nk * tw * (s.main ? 0.9 : 0.6));
      if (a < 0.02) continue;
      SB[Math.min(NB - 1, Math.floor(a * NB))].push(s.x, s.y, s.m * unit);
      if (vis < 1 && s.main) BORN.push(s.x, s.y, vis);
    }
    for (let bi = 0; bi < NB; bi++) {
      const L = SB[bi];
      if (!L.length) continue;
      ctx.globalAlpha = (bi + 0.5) / NB;
      ctx.beginPath();
      for (let i = 0; i < L.length; i += 3) { const r = L[i + 2]; if (r < 1.1) ctx.rect(L[i] - r * 0.5, L[i + 1] - r * 0.5, r, r); else { ctx.moveTo(L[i] + r * 0.55, L[i + 1]); ctx.arc(L[i], L[i + 1], r * 0.55, 0, TAU); } }
      ctx.fill();
    }
    // 正在生出的星：一闪
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < BORN.length; i += 3) glowAt(ctx, SP.pale, BORN[i], BORN[i + 1], 7 * Math.max(0.7, W.unit), nk * 4 * BORN[i + 2] * (1 - BORN[i + 2]));
    ctx.restore();
    BORN.length = 0;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const s of G.stars) {
      if (!s.main || s.m < 1.7) continue;
      const d = Math.hypot(s.x - cx, s.y - cy) / dmax, vis = clamp((a1 * 1.15 - d) / 0.08, 0, 1);
      if (vis <= 0) continue;
      glowAt(ctx, SP.pale, s.x, s.y, s.m * 4 * Math.max(0.7, W.unit), 0.45 * vis * nk);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 亚伯拉罕的光影：身后一层淡淡的光
  function drawAbrLight(ctx) {
    if (!S.abr) return;
    const q = chest('abraham');
    if (!q) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, q[0], q[1] - q[2] * 0.15, q[2] * 1.7, 0.55 * q[3] * (0.5 + 0.5 * nightK()));
    glowAt(ctx, SP.gold, q[0], q[1] - q[2] * 0.1, q[2] * 0.7, 0.4 * q[3]);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 5:8 远山上的十字架，背后破开的晨光；5:5 神的爱浇灌在心里 ──
  function drawDawn(ctx) {
    const a = LV.rmDawn * LV.rmCross;
    if (a < 0.01) return;
    const c = G.cross, x = c.x, y = c.y - c.H * 0.7;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y, M() * 0.34, 0.55 * a);
    glowAt(ctx, SP.gold, x, y, M() * 0.14, 0.7 * a);
    for (let k = 0; k < 7; k++) {
      const ang = -Math.PI / 2 + (k - 3) * 0.24 + Math.sin(W.t * 0.13 + k) * 0.03;
      beamAt(ctx, SP.beamW, x, y, ang, M() * (0.36 + 0.1 * hsh(k)), M() * 0.07, 0.22 * a * (0.7 + 0.3 * Math.sin(W.t * 0.4 + k * 1.7)));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawCross(ctx) {
    const a = LV.rmCross;
    if (a < 0.01) return;
    const c = G.cross, x = c.x, y = c.y, H = c.H;
    const w = Math.max(1.6, H * 0.075), arm = H * 0.52, ay = y - H * 0.74;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([44, 36, 32], 1, 1);
    ctx.fillRect(x - w / 2, y - H, w, H + 2);
    ctx.fillRect(x - arm / 2, ay - w / 2, arm, w);
    ctx.beginPath(); ctx.ellipse(x, y + 2, H * 0.3, H * 0.06, 0, Math.PI, TAU); ctx.fill();
    const rim = LV.rmDawn;
    if (rim > 0.05) {
      ctx.strokeStyle = rgba([255, 226, 176], 0.55 * rim * a);
      ctx.lineWidth = 1;
      ctx.strokeRect(x - w / 2, y - H, w, H);
      ctx.strokeRect(x - arm / 2, ay - w / 2, arm, w);
    }
    ctx.globalAlpha = 1;
  }
  // 5:5 所赐给我们的圣灵将神的爱浇灌在我们心里：十字架上显明的爱先流到灵之处（言说时灵所在），灵再把它浇灌到各人心里
  function pourHub() { const c = S.pourC || (port() ? [0.66, 0.5] : [0.72, 0.48]); return [c[0] * W.w, c[1] * W.h]; }
  function stream(ctx, a, b, front, lift, lw, al, seed, r) {
    ctx.strokeStyle = rgba([255, 218, 150], al);
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let k = 0; k <= 20; k++) { const pt = arcPt(a, b, front * k / 20, lift); if (k) ctx.lineTo(pt[0], pt[1]); else ctx.moveTo(pt[0], pt[1]); }
    ctx.stroke();
    for (let k = 0; k < 6; k++) {
      const u = U.fract(W.t * 0.35 + k / 6 + seed) * front;
      const pt = arcPt(a, b, u, lift);
      glowAt(ctx, SP.moteW, pt[0], pt[1], r, Math.min(1, al * 3.6));
    }
  }
  function drawPour(ctx) {
    const p = LV.rmPour;
    if (p < 0.001) return;
    const c = G.cross, src = [c.x, c.y - c.H * 0.72], hub = pourHub(), P = people();
    const fade = 1 - ss(0.85, 1, p), u = Math.max(0.6, W.unit);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    // 自十字架到灵之处：一道较宽的光流
    const f0 = clamp(p * 3.4, 0, 1);
    stream(ctx, src, hub, f0, W.h * 0.03 + Math.abs(hub[0] - src[0]) * 0.18, 2.4 * u, 0.26 * fade, 0, 9 * u);
    // 灵的光：亮起，停在那里，把爱分下去
    const hk = ss(0.12, 0.3, p) * fade;
    glowAt(ctx, SP.cool, hub[0], hub[1], M() * 0.17 * (1 + 0.06 * Math.sin(W.t * 1.7)), 0.4 * hk);
    glowAt(ctx, SP.pale, hub[0], hub[1], M() * 0.1 * (1 + 0.06 * Math.sin(W.t * 1.7)), 0.8 * hk);
    glowAt(ctx, SP.gold, hub[0], hub[1], M() * 0.045, 0.7 * hk);
    glowAt(ctx, SP.mote, hub[0], hub[1], M() * 0.014, hk);
    // 自灵之处到各人心里
    for (let i = 0; i < P.length; i++) {
      const q = chest(P[i].id);
      if (!q) continue;
      const front = clamp((p - 0.24) * 2.2 - i * 0.04, 0, 1);
      if (front <= 0) continue;
      stream(ctx, hub, q, front, W.h * 0.012 + Math.abs(q[0] - hub[0]) * 0.08, Math.max(1, q[2] * 0.05), 0.22 * fade, i * 0.13, q[2] * 0.1);
      if (front >= 1) glowAt(ctx, SP.gold, q[0], q[1], q[2] * 0.4, 0.35 * fade);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 6:23 罪的工价乃是死（遍地灰黄）；神的恩赐（生命自灵之处铺开，花开满地）──
  function lifeR() { return LV.rmLife * W.w * 1.25; }
  function drawVeil(ctx, layer) {
    const d = LV.rmDeath;
    if (d < 0.01) return;
    const lx = (S.lifeX == null ? 0.7 : S.lifeX) * W.w, R = lifeR(), F = 40 * LS(2);
    const bot = layer === 2 ? W.h + 2 : W.waterlineY(layer);
    const step = Math.max(5, Math.ceil(W.w / 160));
    ctx.beginPath();
    ctx.moveTo(0, bot);
    for (let x = 0; x <= W.w + step; x += step) { const xx = Math.min(x, W.w); ctx.lineTo(xx, Math.min(bot, gY(layer, xx / W.w) - 1)); }
    ctx.lineTo(W.w, bot); ctx.closePath();
    const col = W.shade([112, 100, 84], DEP(layer)), A = 0.5 * d;
    const f = x => A * ss(R - F, R + F, Math.abs(x - lx));
    const xs = [0, lx - R - F, lx - R, lx - R + F, lx, lx + R - F, lx + R, lx + R + F, W.w].map(x => clamp(x, 0, W.w)).sort((p, q) => p - q);
    const gr = ctx.createLinearGradient(0, 0, W.w, 0);
    for (const x of xs) gr.addColorStop(x / W.w, rgba(col, f(x)));
    ctx.fillStyle = gr;
    ctx.fill();
    // 生命的前沿：地上一道绿金的光
    if (LV.rmLife > 0.001 && LV.rmLife < 1 && layer === 2) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const sx of [lx - R, lx + R]) {
        if (sx < -20 || sx > W.w + 20) continue;
        const gy = gY(2, clamp(sx / W.w, 0, 1));
        glowAt(ctx, SP.green, sx, gy + 8, 60 * LS(2), 0.5 * d);
      }
      ctx.restore();
    }
  }
  const FB = [];
  function drawFlowers(ctx) {
    if (LV.rmLife < 0.001) return;
    const lx = (S.lifeX == null ? 0.7 : S.lifeX) * W.w, R = lifeR(), F = 30 * LS(2);
    const sw = 0.04 * Math.sin(W.t * 0.9);
    FB.length = 0;
    ctx.strokeStyle = css([80, 116, 60], 2);
    ctx.lineWidth = Math.max(0.6, 0.7 * LS(2));
    ctx.beginPath();
    for (const f of G.flowers) {
      const b = clamp((R - Math.abs(f.x - lx)) / F, 0, 1);
      if (b <= 0) continue;
      const hh = f.h * easeOut(b), ang = f.lean + sw * (1 + Math.sin(f.sd));
      const tx = f.x + Math.sin(ang) * hh, ty = f.y - Math.cos(ang) * hh;
      ctx.moveTo(f.x, f.y); ctx.lineTo(tx, ty);
      FB.push([tx, ty, Math.max(0.8, f.h * 0.26 * b), f]);
    }
    ctx.stroke();
    if (!FB.length) return;
    for (const col of FLW) {
      ctx.fillStyle = css(col, 2, 1, 0.06);
      ctx.beginPath();
      for (const [tx, ty, pr, f] of FB) {
        if (f.c !== col) continue;
        for (let k = 0; k < 5; k++) { const a = k / 5 * TAU + f.sd, px = tx + Math.cos(a) * pr, py = ty + Math.sin(a) * pr * 0.8; ctx.moveTo(px + pr * 0.55, py); ctx.arc(px, py, pr * 0.55, 0, TAU); }
      }
      ctx.fill();
    }
    ctx.fillStyle = css([250, 226, 130], 2);
    ctx.beginPath();
    for (const [tx, ty, pr] of FB) { ctx.moveTo(tx + pr * 0.4, ty); ctx.arc(tx, ty, pr * 0.4, 0, TAU); }
    ctx.fill();
  }

  // ── 8:26 圣灵的叹息：风里一条光的丝带经过每一个人 ────────────
  function breathPath() {
    const P = people(), c = S.windC || [0.3, 0.4], bo = breathOrder();
    const pts = [[c[0] * W.w, c[1] * W.h]];
    const idx = P.map((_, i) => i).sort((a, b) => bo[a] - bo[b]);
    for (const i of idx) {
      const q = chest(P[i].id);
      if (!q) continue;
      // 自灵之处到第一个人：中间弯一下（风不走直线）
      if (pts.length === 1) { const a = pts[0], dx = q[0] - a[0], dy = q[1] - a[1]; pts.push([a[0] + dx * 0.5 - dy * 0.18, a[1] + dy * 0.5 + dx * 0.18]); }
      pts.push([q[0], q[1] - q[2] * 0.1]);
    }
    const last = pts[pts.length - 1], dir = c[0] < 0.66 ? 1 : -1;
    pts.push([last[0] + dir * W.w * 0.035, last[1] - W.h * 0.1], [last[0] - dir * W.w * 0.01, last[1] - W.h * 0.24], [last[0] + dir * W.w * 0.04, last[1] - W.h * 0.44]);
    return pts;
  }
  function catmull(cp, n) {
    const out = [];
    for (let i = 0; i < cp.length - 1; i++) {
      const p0 = cp[Math.max(0, i - 1)], p1 = cp[i], p2 = cp[i + 1], p3 = cp[Math.min(cp.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
    }
    out.push(cp[cp.length - 1].slice());
    return out;
  }
  function drawBreath(ctx) {
    const w = LV.rmWind;
    if (w < 0.02 || LV.rmBreath < 0.001) return;
    const cp = breathPath(), nP = cp.length - 5;
    const pts = catmull(cp, 8), N = pts.length;
    // 丝带的前沿：rmBreath 走到第 k 个人的 (k+1)/(n+2) 时，正好到他身上（与心里的光一齐亮）
    const B = k => (k + 1) / (nP + 2), b = clamp(LV.rmBreath, 0, 1);
    let fi;
    if (nP < 1) fi = b * (cp.length - 1);
    else if (b <= B(0)) fi = 2 * b / B(0);
    else if (b >= B(nP - 1)) fi = nP + 1 + 3 * (b - B(nP - 1)) / (1 - B(nP - 1));
    else { const k = Math.min(nP - 2, Math.floor(b * (nP + 2) - 1)); fi = k + 2 + (b - B(k)) * (nP + 2); }
    const front = clamp(fi / (cp.length - 1), 0, 1);
    const upto = Math.max(2, Math.min(N, Math.floor(fi * 8) + 1));
    const u = Math.max(0.6, W.unit);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const [lw, al] of [[7 * u, 0.1], [2.6 * u, 0.28], [1.1 * u, 0.5]]) {
      ctx.strokeStyle = rgba([236, 244, 255], al * w);
      ctx.lineWidth = lw;
      ctx.beginPath();
      for (let k = 0; k < upto; k++) { const p = pts[k], wv = Math.sin(k * 0.5 - W.t * 3) * 3 * u; if (k) ctx.lineTo(p[0], p[1] + wv); else ctx.moveTo(p[0], p[1] + wv); }
      ctx.stroke();
    }
    const hp = pts[Math.min(N - 1, upto - 1)];
    glowAt(ctx, SP.pale, hp[0], hp[1], 26 * u, 0.8 * w);
    for (let k = 0; k < 14; k++) {
      const t = U.fract(W.t * 0.12 + k / 14) * front, p = pts[Math.min(N - 1, Math.floor(t * (N - 1)))];
      glowAt(ctx, SP.mote, p[0] + Math.sin(k * 3 + W.t) * 5 * u, p[1] + Math.cos(k * 2 + W.t * 1.3) * 4 * u, 5 * u, 0.6 * w);
    }
    ctx.lineCap = 'butt';
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 8:28 万事都互相效力：万物各引出一根光的丝线，织成一条光绳，弯成拱 ──
  function domeTop() { const d = G.dome; return [d.cx, d.cy - d.ry]; }
  function threadSources() {
    const out = [];
    // 日头也引出一根（手机上日头的丝线会穿过顶上的经文，故不用）
    if (!port() && W.sun.vis > 0.2 && W.sun.y < W.horizonY) out.push([W.sun.x, W.sun.y, 0]);
    for (const xf of (port() ? [0.62, 0.9] : [0.6, 0.78, 0.95])) out.push([xf * W.w, gY(0, xf) + 2, 2]);
    for (const xf of (port() ? [0.55, 0.85] : [0.55, 0.72, 0.9])) out.push([xf * W.w, gY(1, xf) + 3, 3]);
    if (port()) out.push([0.22 * W.w, 0.72 * W.h, 2], [0.1 * W.w, 0.84 * W.h, 5]);
    else out.push([0.3 * W.w, 0.18 * W.h, 4], [0.12 * W.w, 0.4 * W.h, 5]);
    const t = G.tree;
    out.push([t.x - t.H * 0.2, t.y - t.H * 0.72, 3], [t.x + t.H * 0.22, t.y - t.H * 0.68, 3]);
    const sp = scrollPt(); out.push([sp[0], sp[1], 1]);
    out.push([G.house.x, G.house.y - G.house.H, 0]);
    people().forEach((p, i) => { const q = chest(p.id); if (q) out.push([q[0], q[1], i % 2 ? 1 : 5]); });
    return out;
  }
  function drawThreads(ctx) {
    const tv = LV.rmThread, wv = LV.rmWeave;
    if (tv < 0.001 && wv < 0.01) return;
    const Gp = domeTop(), TC = THC();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const u = Math.max(0.6, W.unit);
    if (tv > 0.001) {
      const src = threadSources(), n = src.length;
      const fadeT = 1 - 0.75 * wv;
      ctx.lineWidth = (1.3 + 0.6 * W.daylight) * u;
      src.forEach((s, i) => {
        const pr = clamp(tv * 1.3 - 0.3 * (i / n), 0, 1);
        if (pr <= 0) return;
        const [rgb] = TC[s[2] % TC.length];
        const dx = Gp[0] - s[0], dy = Gp[1] - s[1], L = Math.hypot(dx, dy) || 1;
        const bend = (i % 2 ? 1 : -1) * 0.18 * L + Math.sin(W.t * 0.6 + i) * 6 * u;
        const cx = (s[0] + Gp[0]) / 2 - dy / L * bend, cy = (s[1] + Gp[1]) / 2 + dx / L * bend;
        ctx.strokeStyle = rgba(rgb, 0.6 * fadeT);
        ctx.beginPath();
        let hx = s[0], hy = s[1];
        for (let k = 0; k <= 24; k++) {
          const t = pr * k / 24, q = 1 - t;
          hx = q * q * s[0] + 2 * q * t * cx + t * t * Gp[0]; hy = q * q * s[1] + 2 * q * t * cy + t * t * Gp[1];
          if (k) ctx.lineTo(hx, hy); else ctx.moveTo(hx, hy);
        }
        ctx.stroke();
        if (pr < 1) glowAt(ctx, TC[s[2] % TC.length][1], hx, hy, 9 * u, 0.9 * fadeT);
        else glowAt(ctx, SP.mote, s[0], s[1], 5 * u, 0.6 * fadeT);
      });
      if (tv >= 1) glowAt(ctx, SP.gold, Gp[0], Gp[1], 40 * u * (1 + 0.1 * Math.sin(W.t * 2)), 0.6 * (1 - 0.4 * wv));
    }
    // 三股合成的光绳：自拱顶向两边织下
    if (wv > 0.01) drawCord(ctx, wv, u);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawCord(ctx, wv, u) {
    const d = G.dome, span = Math.min(1, wv * 1.05);
    const TC = THC();
    const cols = [TC[0][0], TC[2][0], TC[1][0]];
    const amp = 4.5 * u, N = 90;
    const alpha = Math.min(1, wv) * (1 - LV.rmOpen) * (1 - 0.6 * LV.rmDome);
    if (alpha < 0.01) return;
    const strand = j => {
      ctx.beginPath();
      let started = false;
      for (let k = 0; k <= N; k++) {
        const th = Math.PI + Math.PI * k / N;
        if (Math.abs(th - 1.5 * Math.PI) > span * Math.PI / 2) { started = false; continue; }
        const nx = Math.cos(th), ny = Math.sin(th);
        const off = amp * Math.sin(th * 14 + j * TAU / 3 + W.t * 0.8);
        const x = d.cx + (d.rx + off) * nx, y = d.cy + (d.ry + off) * ny;
        if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
      }
      ctx.stroke();
    };
    // 白昼的天光里：先以实的金色描一遍（加色的光在亮天上看不清）
    const day = clamp(W.daylight, 0, 1) * (1 - 0.7 * (LV.storm || 0));
    if (day > 0.05) {
      ctx.save(); ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 2.6 * u;
      for (let j = 0; j < 3; j++) { ctx.strokeStyle = rgba(mix(cols[j], [214, 150, 64], 0.5), 0.5 * alpha * day); strand(j); }
      ctx.restore();
    }
    // 一层宽而淡的光晕，再是三股
    ctx.strokeStyle = rgba([255, 226, 170], 0.1 * alpha);
    ctx.lineWidth = 12 * u;
    strand(0);
    for (let j = 0; j < 3; j++) {
      ctx.strokeStyle = rgba(cols[j], Math.min(1, 0.75 + 0.25 * day) * alpha);
      ctx.lineWidth = (1.8 + 0.8 * day) * u;
      strand(j);
    }
    // 8:30 四个光结
    for (let j = 0; j < 4; j++) {
      const k = clamp(LV.rmKnot - j, 0, 1);
      if (k <= 0) continue;
      const th = Math.PI + Math.PI * (0.2 + 0.2 * j);
      if (Math.abs(th - 1.5 * Math.PI) > span * Math.PI / 2) continue;
      const x = d.cx + d.rx * Math.cos(th), y = d.cy + d.ry * Math.sin(th);
      glowAt(ctx, SP.gold, x, y, 22 * u * (0.7 + 0.3 * k), 0.8 * k * alpha);
      glowAt(ctx, SP.mote, x, y, 8 * u, k * alpha);
    }
  }

  // ── 8:35–39 黑烟压来；爱的穹顶 ────────────────────────────
  // 患难、困苦、逼迫……：四面的黑暗压过来（不是什么活物，只是黑暗），在爱的穹顶外停住；8:37 被推开、散去
  //   黑暗有一道看得清的边：一直压到穹顶上才停住；相遇之处穹顶亮起一道边；8:37 黑暗被一下子推开（边也跟着一闪），然后散去。
  function pressR() { return lerp(3.4, 1.0, easeIO(LV.rmSmoke)) + 3.4 * LV.rmBreak; }
  function drawPress(ctx) {
    const sm = LV.rmSmoke, br = LV.rmBreak;
    const a = Math.min(1, sm * 3) * (1 - ss(0.35, 0.97, br));
    if (a < 0.01) return;
    const d = G.dome, r0 = pressR(), u = Math.max(0.6, W.unit), mr = Math.min(d.rx, d.ry);
    const R = Math.hypot(W.w, W.h) * 2 / mr;
    ctx.save();
    ctx.translate(d.cx, d.cy); ctx.scale(d.rx, d.ry);
    const gr = ctx.createRadialGradient(0, 0, r0, 0, 0, r0 + 1.1);
    gr.addColorStop(0, 'rgba(10,12,20,0)'); gr.addColorStop(0.05, 'rgba(10,12,20,0.46)'); gr.addColorStop(0.35, 'rgba(9,11,18,0.62)'); gr.addColorStop(1, 'rgba(8,10,16,0.74)');
    ctx.fillStyle = gr; ctx.globalAlpha = a;
    ctx.fillRect(-R, -R, 2 * R, 2 * R);
    ctx.restore();
    // 黑暗的边上翻滚的暗云：两圈，里圈紧贴着边
    const n = 26;
    for (let ring2 = 0; ring2 < 2; ring2++) for (let k = 0; k < n; k++) {
      const th = Math.PI * (1.0 + 1.0 * (k + 0.5 * ring2) / n) + Math.sin(W.t * 0.3 + k) * 0.03;
      const rr = r0 + (ring2 ? 0.5 : 0.13) + 0.05 * Math.sin(W.t * 0.7 + k * 2.1);
      const x = d.cx + Math.cos(th) * d.rx * rr, y = d.cy + Math.sin(th) * d.ry * rr;
      glowAt(ctx, SP.dark, x, y, mr * (ring2 ? 0.46 : 0.26) * (1 + 0.15 * Math.sin(W.t * 0.5 + k)), (ring2 ? 0.5 : 0.62) * a);
    }
    // 黑暗与爱相遇之处：穹顶的边亮起来，边上火星一样的光（黑暗到此为止）
    const touch = ss(0.6, 0.97, sm) * (1 - br);
    const fl = ss(0, 0.06, br) * (1 - ss(0.2, 0.6, br));   // 8:37 推开的一闪
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (touch > 0.01 || fl > 0.01) {
      const k1 = touch * (0.8 + 0.2 * Math.sin(W.t * 3.1)) + fl;
      ctx.strokeStyle = rgba([255, 214, 150], Math.min(1, 0.22 * k1));
      ctx.lineWidth = (14 + 16 * fl) * u;
      ctx.beginPath(); ctx.ellipse(d.cx, d.cy, d.rx, d.ry, 0, Math.PI, TAU); ctx.stroke();
      ctx.strokeStyle = rgba([255, 240, 214], Math.min(1, 0.6 * k1));
      ctx.lineWidth = (2.6 + 3 * fl) * u;
      ctx.beginPath(); ctx.ellipse(d.cx, d.cy, d.rx, d.ry, 0, Math.PI, TAU); ctx.stroke();
      for (let k = 0; k < 16; k++) {
        const th = Math.PI * (1.03 + 0.94 * k / 15), fk = 0.5 + 0.5 * Math.sin(W.t * (2.3 + hsh(k) * 2) + k * 1.7);
        glowAt(ctx, SP.warm, d.cx + Math.cos(th) * d.rx, d.cy + Math.sin(th) * d.ry, (10 + 8 * fk) * u, 0.55 * touch * fk + 0.6 * fl);
      }
    }
    // 被推开的黑暗的前沿：一道淡淡的光跟着往外去
    if (fl > 0.01 || (br > 0.02 && br < 0.9)) {
      const kf = (1 - ss(0.4, 0.9, br)) * ss(0.02, 0.1, br);
      ctx.strokeStyle = rgba([255, 226, 180], 0.3 * kf);
      ctx.lineWidth = 8 * u;
      ctx.beginPath(); ctx.ellipse(d.cx, d.cy, d.rx * r0, d.ry * r0, 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const DG = { g: null, g2: null, ctx: null };
  function drawDome(ctx) {
    const dm = LV.rmDome;
    if (dm < 0.01) return;
    const d = G.dome, op = LV.rmOpen, k = 1 + 4 * op;
    const a = dm * (1 - ss(0, 0.75, op));
    if (a < 0.01) return;
    const rx = d.rx * k, ry = d.ry * k, u = Math.max(0.6, W.unit);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 里面淡淡的暖光
    ctx.save();
    ctx.translate(d.cx, d.cy); ctx.scale(rx, ry);
    if (!DG.g || DG.ctx !== ctx) {
      DG.ctx = ctx; DG.g = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      DG.g.addColorStop(0, rgba([255, 220, 160], 0.02)); DG.g.addColorStop(0.75, rgba([255, 214, 150], 0.08)); DG.g.addColorStop(1, rgba([255, 230, 190], 0.2));
      // 黑暗压在外面时：里面明显地暖、亮
      DG.g2 = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      DG.g2.addColorStop(0, rgba([255, 220, 160], 0.12)); DG.g2.addColorStop(0.75, rgba([255, 214, 150], 0.2)); DG.g2.addColorStop(1, rgba([255, 230, 190], 0.35));
    }
    const warmIn = Math.min(1, LV.rmSmoke * 2);
    ctx.beginPath(); ctx.arc(0, 0, 1, Math.PI, TAU); ctx.closePath();
    ctx.fillStyle = DG.g;
    ctx.globalAlpha = a * (1 - warmIn);
    if (warmIn < 0.99) ctx.fill();
    ctx.fillStyle = DG.g2;
    ctx.globalAlpha = a * warmIn;
    if (warmIn > 0.01) ctx.fill();
    ctx.restore();
    // 穹顶的边：一道亮的弧，光在弧上流动
    ctx.globalAlpha = a;
    ctx.strokeStyle = rgba([255, 236, 196], 0.55 + 0.3 * warmIn);
    ctx.lineWidth = 2.2 * u;
    ctx.beginPath(); ctx.ellipse(d.cx, d.cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    ctx.strokeStyle = rgba([255, 214, 150], 0.18);
    ctx.lineWidth = 9 * u;
    ctx.beginPath(); ctx.ellipse(d.cx, d.cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    for (let j = 0; j < 6; j++) {
      const th = Math.PI + Math.PI * U.fract(W.t * 0.06 + j / 6);
      glowAt(ctx, SP.mote, d.cx + rx * Math.cos(th), d.cy + ry * Math.sin(th), 7 * u, a * 0.8 * Math.sin(th - Math.PI));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 10:13–18 手里的灯、报信的人的脚踪、远近的灯 ────────────
  function drawLamps(ctx, layer) {
    const lk = LV.rmLamps;
    if (lk < 0.001) return;
    const nk = 0.2 + 0.8 * nightK();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const L of G.lamps) {
      if (L.layer !== layer) continue;
      const k = clamp((lk - L.d) / 0.06, 0, 1);
      if (k <= 0) continue;
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + L.x);
      glowAt(ctx, SP.warm, L.x, L.y, L.r * 3.2 * fl, 0.75 * k * nk);
      glowAt(ctx, SP.moteW, L.x, L.y, L.r * 0.9, k * nk);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawPrints(ctx) {
    if (!S.msg) return;
    const f = fig('p0');
    const cur = f ? f.nx : X().msg;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const u = LS(2);
    for (const p of G.prints) {
      if (p.xf < cur) continue;
      glowAt(ctx, SP.warm, p.x, p.y, 5 * u, 0.5 * (0.4 + 0.6 * nightK()));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawHandLamps(ctx) {
    const hk = LV.rmHand;
    if (hk < 0.01) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    people().forEach(p => {
      if (p.id === 'p0' && S.msg) return;
      const f = fig(p.id);
      if (!f || !f._vis) return;
      const h = f._h, d = facingOf(f), q = [f._x + d * 0.26 * h, f._y - 0.46 * h];
      const fl = 0.85 + 0.15 * Math.sin(W.t * 11 + h);
      glowAt(ctx, SP.warm, q[0], q[1] - 0.04 * h, h * 0.55 * fl, 0.75 * hk * (0.4 + 0.6 * nightK()));
      glowAt(ctx, SP.moteW, q[0], q[1] - 0.05 * h, h * 0.09, hk);
      ctx.fillStyle = css(CLAY, 2, hk);
      ctx.beginPath(); ctx.ellipse(q[0], q[1] - 0.01 * h, 0.07 * h, 0.028 * h, 0, 0, TAU); ctx.fill();
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 12:20 仇敌的冷影、炭火（暖光）、饼与杯 ──────────────────
  function drawEnemyAura(ctx) {
    if (!S.enemy) return;
    const q = chest('enemy');
    if (!q) return;
    const [x, y, h, al] = q;
    const cold = LV.rmCold;
    if (cold > 0.01) {
      for (let k = 0; k < 5; k++) {
        const ang = W.t * 0.4 + k * 1.3;
        glowAt(ctx, SP.cold, x + Math.cos(ang) * h * 0.25, y - h * 0.1 + Math.sin(ang) * h * 0.2, h * 0.6, 0.42 * cold * al);
      }
      glowAt(ctx, SP.dark, x, y - h * 0.1, h * 0.62, 0.5 * cold * al);
    }
    // 「把炭火堆在他的头上」：不画炭块，只是一团暖光罩住他，几点暖光在他头上缓缓升起（恩待的暖意）
    const co = LV.rmCoals;
    if (co > 0.01) {
      const f = fig('enemy'), top = f && f._vis ? f._y - h * (CHEST[f.pose] > 0.5 ? 1.02 : 0.72) : y - h * 0.45;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x, (top + y) / 2, h * 0.8, 0.7 * co * al);
      glowAt(ctx, SP.gold, x, top - h * 0.08, h * 0.36, 0.35 * co * al);
      for (let k = 0; k < 6; k++) {
        const uu = U.fract(W.t * 0.22 + k / 6);
        glowAt(ctx, SP.moteW, x + Math.sin(k * 2.3 + W.t * 0.7) * h * 0.14, top - h * 0.05 - uu * h * 0.55, h * 0.05, 0.6 * co * al * Math.sin(Math.PI * uu));
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawGifts(ctx) {
    const items = [];
    if (S.bread) items.push(['bread', S.bread]);
    if (S.cup) items.push(['cup', S.cup]);
    for (const [kind, who] of items) {
      const f = fig(who);
      if (!f || !f._vis) continue;
      const h = f._h, d = facingOf(f);
      let p = handAt(f, h);
      if (kind === 'cup' && who === 'enemy') p = [p[0] + d * 0.08 * h, p[1] - 0.02 * h];
      ctx.globalAlpha = f.alpha == null ? 1 : f.alpha;
      if (kind === 'bread') {
        ctx.fillStyle = css([196, 150, 96], 2, 1, 0.05);
        ctx.beginPath(); ctx.ellipse(p[0], p[1], 0.1 * h, 0.05 * h, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = css([150, 108, 66], 2, 0.8);
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(p[0] - 0.04 * h, p[1] - 0.03 * h); ctx.lineTo(p[0] - 0.02 * h, p[1] + 0.02 * h); ctx.moveTo(p[0] + 0.02 * h, p[1] - 0.03 * h); ctx.lineTo(p[0] + 0.04 * h, p[1] + 0.02 * h); ctx.stroke();
      } else {
        ctx.fillStyle = css(CLAY, 2, 1, 0.04);
        ctx.beginPath();
        ctx.moveTo(p[0] - 0.05 * h, p[1] - 0.07 * h); ctx.lineTo(p[0] + 0.05 * h, p[1] - 0.07 * h);
        ctx.lineTo(p[0] + 0.03 * h, p[1] + 0.01 * h); ctx.lineTo(p[0] - 0.03 * h, p[1] + 0.01 * h); ctx.closePath(); ctx.fill();
        ctx.fillRect(p[0] - 0.01 * h, p[1] + 0.01 * h, 0.02 * h, 0.03 * h);
        ctx.fillRect(p[0] - 0.035 * h, p[1] + 0.035 * h, 0.07 * h, 0.012 * h);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 13:10 地上一圈爱的光
  function drawLoveRing(ctx) {
    const k = LV.rmLove;
    if (k < 0.01) return;
    const d = G.dome, u = Math.max(0.6, W.unit);
    const rx = d.rx * 0.9, ry = Math.max(10, (W.h - d.cy) * 0.35);
    const cy = d.cy + ry * 0.4;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba([255, 214, 150], 0.3 * k);
    ctx.lineWidth = 10 * u;
    ctx.beginPath(); ctx.ellipse(d.cx, cy, rx, ry, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba([255, 236, 200], 0.55 * k);
    ctx.lineWidth = 2 * u;
    ctx.beginPath(); ctx.ellipse(d.cx, cy, rx, ry, 0, 0, TAU); ctx.stroke();
    for (let j = 0; j < 8; j++) {
      const th = TAU * U.fract(W.t * 0.04 + j / 8);
      glowAt(ctx, SP.moteW, d.cx + rx * Math.cos(th), cy + ry * Math.sin(th), 6 * u, 0.7 * k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 15:13 喜乐、平安：众人头上一层暖光，光点缓缓升起；16:27 阿们
  function drawJoy(ctx) {
    const f = LV.rmFull, am = LV.rmAmen;
    if (f < 0.01 && am < 0.01) return;
    const d = G.dome;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, d.cx, d.cy - d.ry * 0.35, d.rx * 1.1, 0.22 * f * (0.5 + 0.5 * nightK()));
    for (let k = 0; k < 18; k++) {
      const u = U.fract(W.t * 0.05 + hsh(k) );
      const x = d.cx + (hsh(k + 3) - 0.5) * d.rx * 1.8 + Math.sin(W.t * 0.5 + k) * 6;
      const y = d.cy - u * d.ry * 2.2;
      glowAt(ctx, SP.moteW, x, y, 5 * Math.max(0.6, W.unit), 0.7 * f * Math.sin(Math.PI * u));
    }
    if (am > 0.01) glowAt(ctx, SP.warm, d.cx, d.cy - d.ry * 0.6, M() * 0.55, 0.18 * am);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  特效的光点（纯装饰，不入状态）
  // ════════════════════════════════════════════════════════════
  const PT = [];
  function addPt(p) { if (PT.length < 220) PT.push(Object.assign({ t: 0, delay: 0 }, p)); }
  let gustAcc = 0;
  const EV = { wake: 0, gift: 0, knot: 0, graft: 0 };
  function watchEvents() {
    // 光到了各人心里 / 光结亮起 / 嫩枝接上：一圈小小的光（只在看着时）
    if (W.replaying) { EV.wake = LV.rmWake; EV.gift = LV.rmGift; EV.knot = LV.rmKnot; EV.graft = LV.rmGraft; return; }
    const P = people();
    for (let i = 0; i < P.length; i++) {
      const o = wakeOrd(i);
      if (EV.wake < o && LV.rmWake >= o) { const q = chest(P[i].id); if (q) { fx().ring(q[0], q[1], [255, 226, 170], q[2] * 1.3, 1.6, 1.2); U.safe('romans.chime', () => au() && au().sfx && au().sfx('chime', { soft: true })); } }
      const g = GIFT[i] + LAND_AT;
      if (EV.gift < g && LV.rmGift >= g) { const q = chest(P[i].id); if (q) fx().ring(q[0], q[1], [255, 232, 180], q[2] * 1.5, 1.8, 1.3); }
    }
    for (let j = 0; j < 4; j++) if (EV.knot < j + 1 && LV.rmKnot >= j + 1) {
      const d = G.dome, th = Math.PI + Math.PI * (0.2 + 0.2 * j);
      fx().ring(d.cx + d.rx * Math.cos(th), d.cy + d.ry * Math.sin(th), [255, 226, 170], M() * 0.08, 1.8, 1.2);
    }
    for (let j = 0; j < 3; j++) {
      const at = j * 0.22 + 0.5;
      if (EV.graft < at && LV.rmGraft >= at) { const t = G.tree, b = WILD[j]; fx().ring(t.x + b[0] * t.H, t.y + b[1] * t.H, [220, 255, 200], t.H * 0.4, 1.6, 1.2); }
    }
    EV.wake = LV.rmWake; EV.gift = LV.rmGift; EV.knot = LV.rmKnot; EV.graft = LV.rmGraft;
  }
  function emit(dt) {
    if (W.replaying || !(dt > 0)) return;
    // 风（8:26）：一缕一缕卷过全地
    const w = Math.max(LV.rmWind, (LV.gale || 0) * 0.6);
    if (w > 0.15) {
      gustAcc += dt * 5 * w * (W.quality || 1);
      const dir = S.windC && S.windC[0] > 0.66 ? -1 : 1, u = Math.max(0.6, W.unit);
      while (gustAcc >= 1) {
        gustAcc -= 1;
        const y = W.h * (0.45 + 0.45 * Math.random());
        addPt({ kind: 'gust', x: dir > 0 ? -60 : W.w + 60, y, vx: dir * (160 + 120 * Math.random()) * u, vy: -6 * u, max: 5 + 2 * Math.random(), size: (40 + 50 * Math.random()) * u, curl: Math.random() < 0.5 ? 1 : -1, seed: Math.random() * 9 });
      }
    }
    // 生命的前沿上的光点（6:23）
    if (LV.rmLife > 0.001 && LV.rmLife < 1 && Math.random() < dt * 30) {
      const lx = (S.lifeX == null ? 0.7 : S.lifeX) * W.w, R = lifeR(), sx = lx + (Math.random() < 0.5 ? -R : R);
      if (sx > 0 && sx < W.w) addPt({ kind: 'mote', x: sx, y: gY(2, sx / W.w) + Math.random() * 40 * LS(2), vx: 0, vy: -(10 + 20 * Math.random()), max: 2.5, size: 3 + 3 * Math.random(), c: 'green' });
    }
  }
  function updatePts(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.t += dt;
      if (p.t >= p.max) { PT.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function drawPts(ctx) {
    if (!PT.length) return;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(240,236,222)';
    ctx.lineWidth = Math.max(0.8, 1.2 * Math.max(0.6, W.unit));
    for (const p of PT) {
      if (p.kind !== 'gust') continue;
      const f = p.t / p.max, L = p.size, c = p.curl, wv = Math.sin(p.t * 1.6 + p.seed) * 6;
      ctx.globalAlpha = 0.2 * Math.sin(Math.PI * clamp(f, 0, 1)) * (0.3 + 0.7 * W.daylight);
      ctx.beginPath(); ctx.moveTo(p.x + L, p.y + wv * 0.3);
      ctx.bezierCurveTo(p.x + L * 0.6, p.y - 8 * c + wv, p.x + L * 0.25, p.y + 6 * c, p.x, p.y);
      ctx.quadraticCurveTo(p.x - L * 0.12, p.y - 5 * c, p.x - L * 0.05, p.y - 9 * c);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const p of PT) {
      if (p.kind !== 'mote') continue;
      const f = p.t / p.max;
      glowAt(ctx, p.c === 'green' ? SP.green : SP.mote, p.x, p.y, p.size * 2.2, 0.8 * Math.sin(Math.PI * f));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的总调度
  // ════════════════════════════════════════════════════════════
  function drawUnder(ctx, pass) {
    if (!isCur()) return;
    sprites();
    layout();
    if (pass === 'sky') { U.safe('romans.stars', () => drawStars(ctx)); return; }
    if (pass === 'far') { U.safe('romans.dawn', () => drawDawn(ctx)); U.safe('romans.lampsF', () => drawLamps(ctx, 0)); return; }
    if (pass === 'mid') {
      U.safe('romans.veilM', () => drawVeil(ctx, 1));
      U.safe('romans.cross', () => drawCross(ctx));
      U.safe('romans.lampsM', () => drawLamps(ctx, 1));
      return;
    }
    if (pass === 'near') {
      U.safe('romans.veil', () => drawVeil(ctx, 2));
      U.safe('romans.love', () => drawLoveRing(ctx));
      U.safe('romans.house', () => drawHouse(ctx));
      U.safe('romans.tree', () => drawTree(ctx));
      U.safe('romans.flowers', () => drawFlowers(ctx));
      U.safe('romans.prints', () => drawPrints(ctx));
      U.safe('romans.stool', () => drawStool(ctx));
      return;
    }
    if (pass === 'air') {
      U.safe('romans.table', () => drawTable(ctx));
      U.safe('romans.held', () => drawHeldScroll(ctx));
      U.safe('romans.gifts', () => drawGifts(ctx));
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      U.safe('romans.houseGlow', () => houseGlow(ctx));
      ctx.restore();
      U.safe('romans.enemy', () => drawEnemyAura(ctx));
      U.safe('romans.press', () => drawPress(ctx));
      U.safe('romans.dome', () => drawDome(ctx));
      U.safe('romans.treeL', () => drawTreeLight(ctx));
      U.safe('romans.abr', () => drawAbrLight(ctx));
      U.safe('romans.glory', () => drawGlory(ctx));
      U.safe('romans.pour', () => drawPour(ctx));
      U.safe('romans.threads', () => drawThreads(ctx));
      U.safe('romans.breath', () => drawBreath(ctx));
      U.safe('romans.hearts', () => drawHearts(ctx));
      U.safe('romans.gospel', () => drawGospel(ctx));
      U.safe('romans.handLamps', () => drawHandLamps(ctx));
      U.safe('romans.tableL', () => drawTableLight(ctx));
      U.safe('romans.joy', () => drawJoy(ctx));
      U.safe('romans.pts', () => drawPts(ctx));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function pick(x, y, r) {
    if (!isCur() || !G) return null;
    let best = null;
    const test = (label, px, py, d0) => {
      if (!isFinite(px) || !isFinite(py)) return;
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const g = G, t = g.tree, tb = g.table;
    test('橄榄树', t.x, t.y - t.H * 0.62, t.H * 0.25);
    if (LV.rmGraft > 0.9) { const b = WILD[1]; test('野橄榄', t.x + (b[0] + 0.2) * t.H, t.y + (b[1] - 0.05) * t.H, t.H * 0.06); }
    test('该犹的家', g.house.x, g.house.y - g.house.H * 0.6, g.house.w * 0.3);
    const sp = scrollPt(); test('书信', sp[0], sp[1], 4);
    test('灯', tb.x0 + 0.24 * tb.Hp, tb.top - 0.1 * tb.Hp, 2);
    if (LV.rmCross > 0.5) test('十字架', g.cross.x, g.cross.y - g.cross.H * 0.6, g.cross.H * 0.2);
    // 众星：只认一颗真正亮着的大星（离灵最近的那颗），名字落在那颗星上，不贴在灵的光上
    // （只在 4:17 这一句、与全信写完之后才认众星：别的夜里星与经文无关）
    if (LV.rmStars > 0.5 && (S.lines === 4 || S.lines >= 13) && y < W.h * 0.6) {
      const nk = clamp(W.night * 1.2 + W.dusk * 0.25, 0, 1) * (1 - 0.85 * (LV.storm || 0));
      if (nk > 0.5) {
        const c = S.starC || [0.7, 0.25], cx = c[0] * W.w, cy = c[1] * W.h;
        const dmax = Math.hypot(Math.max(cx, W.w - cx), Math.max(cy, W.h * 0.6 - cy)) || 1;
        let sb = null, sd = Infinity;
        for (const s of g.stars) {
          if (!s.main || s.m < 1.4) continue;
          if (clamp((LV.rmStars * 1.15 - Math.hypot(s.x - cx, s.y - cy) / dmax) / 0.08, 0, 1) < 1) continue;
          const dd = Math.hypot(s.x - x, s.y - y);
          if (dd < sd) { sd = dd; sb = s; }
        }
        if (sb) test('众星', sb.x, sb.y, 3);
      }
    }
    if (LV.rmGlory > 0.4) { const [x0f, x1f] = X().glory; if (x > x0f * W.w && x < x1f * W.w) test('神的荣耀', x, gloryY(), 0); }
    if (LV.rmLamps > 0.5) for (const L of g.lamps) test('灯', L.x, L.y, 1);
    return best;
  }

  const SCENE = {
    init() { sprites(); },
    resize() { P.w = 0; G = null; chY.clear(); },
    update(dt) {
      if (!isCur()) { if (PT.length) PT.length = 0; return; }
      layout();
      const f = dt * (W.fast || 1);
      for (const [id, [v, rate]] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = rate * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
      U.safe('romans.events', watchEvents);
      emit(f);
      updatePts(f);
    },
    drawUnder,
    draw() {},
    reset() { PT.length = 0; VT.clear(); chY.clear(); },
    restore() {
      PT.length = 0;
      for (const [id, [v]] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear(); chY.clear();
      EV.wake = LV.rmWake; EV.gift = LV.rmGift; EV.knot = LV.rmKnot; EV.graft = LV.rmGraft;
    },
    pick,
    sig() {
      return { lines: S.lines, star: S.starC ? S.starC.map(v => +v.toFixed(3)) : null, pour: S.pourC ? S.pourC.map(v => +v.toFixed(3)) : null, life: S.lifeX == null ? null : +S.lifeX.toFixed(3), wind: S.windC ? S.windC.map(v => +v.toFixed(3)) : null,
        scroll: S.scroll, rolled: S.rolled, huddle: S.huddle, msg: S.msg, bread: S.bread, cup: S.cup, enemy: S.enemy, phoebe: S.phoebe, abr: S.abr };
    },
    get debug() { return { S: Object.assign({}, S), pts: PT.length, lv: MY.reduce((o, k) => { o[k] = +LV[k].toFixed(3); return o; }, {}) }; },
  };

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  const LOOK = id => Object.assign({}, (GS.cast && GS.cast.LOOK && GS.cast.LOOK[id]) || { label: '保罗', sex: 'm', age: 'adult', robe: [128, 96, 72], beard: true, glow: 0.2 });
  function write(b, k) {
    S.lines = k;
    lv('rmWrite', 1, b);
    sfx(b, 'write', { soft: true });
  }
  // 众人各就其位（瞬间）
  function placePeople() {
    each((id, i) => { const f = fig(id); if (f) { f.nx = homeX(i); f.tx = null; } });
  }
  function everyone(p) { each(id => pose(id, p)); }
  function faceTo(xf) { each((id, i) => face(id, homeX(i) < xf ? 1 : -1)); }
  function homeAll(speed) { each((id, i) => { walk(id, homeX(i), { speed: speed || 0.03 }); sink(id, homeV(i)); }); }
  // 名字（光的微尘聚成）：写在人的头上，停留几秒
  function nameOver(b, id, str, dy) {
    if (inst(b)) return;
    const q = chest(id);
    if (!q) return;
    const size = Math.max(M() * (port() ? 0.042 : 0.034), 15);
    const x = clamp(q[0], size * str.length * 0.6, W.w - size * str.length * 0.6), y = q[1] - q[2] * (dy || 0.95);
    U.safe('romans.nameOver', () => fx().nameStr(str, x, y, size, [255, 236, 200], () => [q[0] + (Math.random() - 0.5) * q[2] * 0.4, q[1] + (Math.random() - 0.5) * q[2] * 0.4], { hold: 3.5 }));
  }
  function centerX() { const d = X().dome; return (d[0] + d[1]) / 2; }

  // ════════════════════════════════════════════════════════════
  //  幕的开端：该犹的家，天快亮的时候（与上一幕怎样结束无关）
  // ════════════════════════════════════════════════════════════
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.9, herbs: 0.75, trees: 0.2,
      lights: 1, moon: 1, stars: 0, life: 1, good: 0, sabbath: 0, given: 1, bare: 0.1, bloom: 0.45, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.freeClock = false;
    P.w = 0; G = null;
    const g = layout();
    const ox = W.w * 0.7, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy);
    W.setOrigin('trees', W.w * 0.02, W.ridgeBaseY(0, W.w * 0.02));
    W.goTo(0.215, 0, true);
    W.setPop('fish', 80, W.w * 0.18, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 16, W.w * 0.62, W.h * 0.3, true);
    W.setPop('cattle', 0, ox, oy, true);
    W.setPop('beast', 0, ox, oy, true);
    W.setPop('creeper', 0, ox, oy, true);
    W.setPop('human', 0, ox, oy, true);
    S = fresh();
    PT.length = 0; VT.clear(); chY.clear();
    const c = C();
    c.clear({ fade: false });
    const Xs = X();
    people().forEach((p, i) => {
      add(p.id, { label: p.label, sex: p.sex, age: p.age, hair: p.hair, beard: p.beard, robe: p.robe, accent: p.accent, layer: 2, x: homeX(i), v: homeV(i),
        facing: homeX(i) < Xs.tert ? 1 : -1, pose: 'sit', glow: 0.12, prop: null, from: 'none' });
    });
    add('tertius', { label: '德提', sex: 'm', age: 'adult', hair: 'short', beard: false, robe: ROBE_T, accent: ACC_T, layer: 2, x: Xs.tert, v: Xs.tertV, facing: 1, pose: 'seat', glow: 0.18, prop: null, from: 'none' });
    add('paul', Object.assign(LOOK('paul'), { layer: 2, x: g.paulX, v: 0.03, facing: -1, pose: 'stand', prop: null, from: 'none' }));
    avoid([0.45, 1]);
    EV.wake = 0; EV.gift = 0; EV.knot = 0; EV.graft = 0;
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每一句的故事约二十至三十秒）
  //  经文一行显出 hold 秒，行与行之间约 1.3 秒；情节的拍子按经文的行对齐。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:16–17 义人必因信得生 ─────────────────────────────
    {
      kind: 'act', utter: '义人必因信得生', cmd: 'echo "义人必因信得生" | tee 犹太人 希腊人  # 本于信，以至于信', ref: '1:17',
      verse: [
        { text: '我不以福音为耻；这福音本是神的大能，<br>要救一切相信的，<br>先是犹太人，后是希腊人。', ref: RM + '1:16', hold: 7 },
        { text: '因为神的义正在这福音上显明出来；<br>这义是本于信，以至于信。<br>如经上所记：「义人必因信得生。」', ref: RM + '1:17', hold: 7.5 },
      ],
      apply(c) {
        const P = people();
        const beats = [
          [0, b => { write(b, 1); pose('paul', 'point'); face('paul', -1); W.goTo(0.3, 15, inst(b)); avoid([0.45, 1]); }],
          [0.4, b => nameOver(b, 'paul', '保罗')],
          [1.2, b => { lv('rmWake', 1.1, b); sfx(b, 'harp', { soft: true }); }],
          [8.3, b => {
            if (inst(b)) return;
            const [ix, iy] = X().idea, sp = scrollPt();
            U.safe('romans.name', () => fx().name('义', ix * W.w, iy * W.h, Math.max(M() * 0.1, 40), [255, 228, 170], () => [sp[0] + (Math.random() - 0.5) * 30, sp[1] + (Math.random() - 0.5) * 16], { hold: 5 }));
            sfx(b, 'bell', { soft: true });
          }],
          [13.5, b => { pose('paul', 'raise'); ring(b, W.w * centerX(), W.h * 0.7, [255, 232, 180], M() * 0.5, 3, 1.4); }],
          [16, b => { pose('paul', 'stand'); lv('rmWrite', 0.25, b); }],
        ];
        // 福音的光到了谁心里，谁就站起来，转向信卷
        P.forEach((p, i) => beats.push([1.2 + (wakeOrd(i) + 0.01) / 0.085, () => { pose(p.id, 'stand'); face(p.id, homeX(i) < X().tert ? 1 : -1); glow(p.id, 0.2); }]));
        T(c, beats);
      },
    },

    // ── 1:20–21，2:11，3:23 神不偏待人；都亏缺了神的荣耀 ──────────
    {
      kind: 'judge', utter: '神不偏待人', cmd: 'grep -c 义人 世人  # 0 · 没有义人，连一个也没有', ref: '2:11',
      verse: [
        { text: '自从造天地以来，<br>神的永能和神性是明明可知的，<br>虽是眼不能见，但藉着所造之物就可以晓得，<br>叫人无可推诿。', ref: RM + '1:20', hold: 7 },
        { text: '因为，他们虽然知道神，却不当作神荣耀他，<br>也不感谢他。他们的思念变为虚妄，<br>无知的心就昏暗了。', ref: RM + '1:21', hold: 6.5 },
        { text: '因为神不偏待人。', ref: RM + '2:11', hold: 4.5 },
        { text: '因为世人都犯了罪，亏缺了神的荣耀。', ref: RM + '3:23', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            write(b, 2); W.goTo(0.42, 8, inst(b)); everyone('gaze');
            if (!inst(b)) {
              fx().ring(W.sun.x, W.sun.y, [255, 236, 200], M() * 0.5, 3.2, 1.6);
              spark(b, G.tree.x, G.tree.y - G.tree.H * 0.7, 30, [230, 255, 214], G.tree.H * 0.4, 'top');
              spark(b, W.w * 0.75, gY(1, 0.75) - 10, 30, [230, 250, 230], W.w * 0.15, 'top');
              spark(b, W.w * 0.3, W.h * 0.7, 26, [230, 240, 255], W.w * 0.12, 'top');
            }
            sfx(b, 'harp', { soft: true });
          }],
          [2.5, () => { pose('paul', 'point'); face('paul', -1); }],
          // 1:21 转脸不顾，心就昏暗了
          [8.3, b => {
            each((id, i) => { face(id, homeX(i) < X().tert ? -1 : 1); pose(id, 'bow'); });
            lv('rmDim', 1, b); lv('rmWrite', 0.25, b);
            W.set('gloom', 0.34, inst(b)); W.set('clouds', 0.75, inst(b));
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [11, () => { face('paul', -1); pose('paul', 'stand'); }],
          // 2:11 高天上一道平平的荣光
          [16.1, b => { lv('rmGlory', 1, b); sfx(b, 'bell'); flash(b, 0.08); }],
          [17.5, () => everyone('gaze')],
          [18.5, b => lv('rmReach', 1, b)],
          // 3:23 都够不着
          [23, () => { const ps = ['kneel', 'weep', 'kneel', 'bow', 'weep', 'kneel', 'sit']; each((id, i) => pose(id, ps[i] || 'kneel')); }],
          [25.5, () => pose('paul', 'pray')],
        ]);
      },
    },

    // ── 3:22–28 因基督耶稣的救赎，就白白地称义 ─────────────────────
    {
      kind: 'act', utter: '因基督耶稣的救赎，就白白地称义', cmd: 'grant 义 --to 一切相信的 --price 0  # 白白地，并没有分别', ref: '3:24',
      verse: [
        { text: '就是神的义，<br>因信耶稣基督加给一切相信的人，<br>并没有分别。', ref: RM + '3:22', hold: 6 },
        { text: '如今却蒙神的恩典，<br>因基督耶稣的救赎，就白白地称义。', ref: RM + '3:24', hold: 6 },
        { text: '所以我们看定了：<br>人称义是因着信，不在乎遵行律法。', ref: RM + '3:28', hold: 5.5 },
      ],
      apply(c) {
        const P = people();
        const beats = [
          [0, b => { write(b, 3); lv('rmGlory', 1, b); snapLv('rmReach', 0); lv('rmGift', 1, b); sfx(b, 'harp'); }],
          [0.3, () => everyone('gaze')],
          [4.6, b => { lv('rmDim', 0, b); W.set('gloom', 0, inst(b)); W.set('clouds', 0.35, inst(b)); sfx(b, 'angel', { soft: true }); }],
          [7.3, b => { everyone('raise'); pose('paul', 'raise'); ring(b, W.w * centerX(), gloryY(), [255, 232, 180], M() * 0.6, 3.2, 1.6); }],
          [12, b => { everyone('stand'); lv('rmGlory', 0.35, b); }],
          [14.6, () => pose('paul', 'stand')],
          [18.5, b => { lv('rmWrite', 0.25, b); hint(b, '按住言说时，灵停在天上何处，众星就从何处生出', 6); }],
        ];
        // 光落到了，各人就跪下领受
        P.forEach((p, i) => beats.push([(GIFT[i] + LAND_AT + 0.01) / 0.1, () => { pose(p.id, 'kneel'); glow(p.id, 0.28); }]));
        T(c, beats);
      },
    },

    // ── 4:17–18 叫死人复活、使无变为有的神：众星 ─────────────────
    {
      kind: 'act', utter: '叫死人复活、使无变为有的神', cmd: 'touch 众星  # 使无变为有 · 你的后裔将要如此', ref: '4:17',
      verse: [
        { text: '经上说什么呢？说：<br>「亚伯拉罕信神，这就算为他的义。」', ref: RM + '4:3', hold: 5.5 },
        { text: '亚伯拉罕所信的，<br>是那叫死人复活、使无变为有的神。', ref: RM + '4:17', hold: 5.5 },
        { text: '他在无可指望的时候，因信仍有指望，<br>就得以作多国的父，<br>正如先前所说：「你的后裔将要如此。」', ref: RM + '4:18', hold: 7 },
        { text: '且满心相信神所应许的必能做成。', ref: RM + '4:21', hold: 4.5 },
      ],
      apply(c) {
        const SC = c.choice && c.choice.star ? c.choice.star : [clamp(isFinite(c.x) ? c.x / W.w : 0.7, 0.08, 0.95), clamp(isFinite(c.y) ? c.y / W.h : 0.25, 0.06, 0.5)];
        T(c, [
          [0, b => { write(b, 4); S.starC = SC.slice(); W.goTo(0.035, 7, inst(b)); lv('rmGlory', 0, b); }],
          [2, b => {
            S.abr = true;
            add('abraham', { label: '亚伯拉罕', sex: 'm', age: 'elder', layer: 1, x: X().abr, v: 0.25, scale: 1.35, facing: -1, pose: 'stand', robe: [236, 228, 206], accent: [255, 238, 200], hair: 'cloth', beard: true, glow: 1, prop: 'staff', from: inst(b) ? 'none' : 'light' });
            sfx(b, 'angel', { soft: true });
          }],
          [3.5, () => { everyone('gaze'); pose('paul', 'gaze'); pose('abraham', 'gaze'); }],
          [4.2, b => nameOver(b, 'abraham', '亚伯拉罕', 1.3)],
          [6.8, b => { lv('rmStars', 1.1, b); ring(b, SC[0] * W.w, SC[1] * W.h, [220, 230, 255], M() * 0.3, 2.4, 1.2); sfx(b, 'stars'); }],
          [13.6, b => { lv('rmSeed', 1.1, b); W.set('stars', 1, inst(b)); sfx(b, 'stars', { soft: true }); }],
          [15, () => pose('abraham', 'raise')],
          [22, b => { pose('abraham', 'gaze'); lv('rmWrite', 0.25, b); }],
        ]);
        return { star: SC };
      },
    },

    // ── 5:1–20 神的爱就在此向我们显明了 ─────────────────────────
    {
      kind: 'act', utter: '神的爱就在此向我们显明了', cmd: 'show 神的爱 --while 我们还作罪人  # 浇灌在我们心里', ref: '5:8',
      verse: [
        { text: '我们既因信称义，<br>就藉着我们的主耶稣基督得与神相和。', ref: RM + '5:1', hold: 5.5 },
        { text: '惟有基督在我们还作罪人的时候为我们死，<br>神的爱就在此向我们显明了。', ref: RM + '5:8', hold: 6.5 },
        { text: '盼望不至于羞耻，<br>因为所赐给我们的圣灵<br>将神的爱浇灌在我们心里。', ref: RM + '5:5', hold: 6.5 },
        { text: '只是罪在哪里显多，恩典就更显多了。', ref: RM + '5:20', hold: 5 },
      ],
      apply(c) {
        // 灵之处：言说时灵所在（宽屏在陆地之上的天空里，手机在经文之下）
        const PC = c.choice && c.choice.pour ? c.choice.pour : (port()
          ? [clamp(isFinite(c.x) ? c.x / W.w : 0.66, 0.3, 0.92), clamp(isFinite(c.y) ? c.y / W.h : 0.5, 0.36, 0.62)]
          : [clamp(isFinite(c.x) ? c.x / W.w : 0.72, 0.52, 0.93), clamp(isFinite(c.y) ? c.y / W.h : 0.48, 0.18, 0.5)]);
        T(c, [
          // 真的日头还在地平线以下：只有十字架背后的光（天亮在浇灌之后）
          [0, b => { write(b, 5); S.pourC = PC.slice(); W.goTo(0.24, 14, inst(b)); lv('rmCross', 1, b); S.abr = false; remove('abraham', true); everyone('stand'); pose('paul', 'stand'); }],
          [2.5, b => lv('rmDawn', 0.45, b)],
          [6.8, b => {
            lv('rmDawn', 1, b); flash(b, 0.1);
            const cr = G.cross; ring(b, cr.x, cr.y - cr.H * 0.7, [255, 222, 170], M() * 0.45, 3.4, 1.8);
            faceTo(X().cross); sfx(b, 'angel');
          }],
          [8, () => { everyone('kneel'); pose('paul', 'kneel'); }],
          // 5:5 圣灵将神的爱浇灌在我们心里
          [14.6, b => { lv('rmPour', 1, b); sfx(b, 'harp'); }],
          [16.4, b => { const h = pourHub(); ring(b, h[0], h[1], [255, 240, 214], M() * 0.2, 2.2, 1.2); sfx(b, 'whisper', { soft: true }); }],
          [20.4, b => lv('rmWarm', 1, b)],
          // 5:20 恩典就更显多了：天亮了
          [22.4, b => { everyone('raise'); W.goTo(0.29, 7, inst(b)); ring(b, W.w * centerX(), W.h * 0.75, [255, 222, 160], M() * 0.55, 3, 1.4); sfx(b, 'bell', { soft: true }); }],
          [24.5, b => { lv('rmWrite', 0.25, b); hint(b, '按住言说时，灵在地上何处，生命就从何处铺开', 6); }],
        ]);
        return { pour: PC };
      },
    },

    // ── 7:24–25，6:23，6:4 神的恩赐乃是永生 ───────────────────────
    {
      kind: 'promise', utter: '神的恩赐，在我们的主基督耶稣里，乃是永生', cmd: 'renew 地面 --gift 永生  # 罪的工价乃是死', ref: '6:23',
      verse: [
        { text: '我真是苦啊！<br>谁能救我脱离这取死的身体呢？<br>感谢神，靠着我们的主耶稣基督就能脱离了。', ref: RM + '7:24–25', hold: 7 },
        { text: '因为罪的工价乃是死；<br>惟有神的恩赐，在我们的主基督耶稣里，<br>乃是永生。', ref: RM + '6:23', hold: 6.5 },
        { text: '所以，我们藉着洗礼归入死，和他一同埋葬，<br>原是叫我们一举一动有新生的样式，<br>像基督藉着父的荣耀从死里复活一样。', ref: RM + '6:4', hold: 7.5 },
      ],
      apply(c) {
        const LX = c.choice && c.choice.life != null ? c.choice.life : clamp(isFinite(c.x) ? c.x / W.w : 0.7, X().lifeMin, 0.98);
        T(c, [
          // 7:24 我真是苦啊：遍地灰黄（一直到「罪的工价乃是死」都是这样）
          [0, b => {
            write(b, 6); S.lifeX = LX; W.goTo(0.36, 8, inst(b));
            snapLv('rmPour', 0); lv('rmDawn', 0.15, b); lv('rmDeath', 1, b);
            W.set('bare', 0.85, inst(b)); W.set('bloom', 0, inst(b));
            everyone('sit'); pose('paul', 'stand');
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [1.5, () => { const ps = ['bow', 'sit', 'weep', 'sit', 'bow', 'weep']; each((id, i) => pose(id, ps[i] || 'sit')); pose('paul', 'bow'); }],
          // 7:25「感谢神」：众人抬起头来（地还是灰的）
          [4.4, () => { everyone('kneel'); pose('paul', 'raise'); }],
          [7, () => pose('paul', 'stand')],
          // 6:23「惟有神的恩赐……乃是永生」：生命的光环自灵之处铺开
          [10.3, b => {
            lv('rmLife', 1, b);
            const x = LX * W.w; ring(b, x, gY(2, LX), [214, 255, 190], W.w, 5, 2); flash(b, 0.08);
            sfx(b, 'harp');
          }],
          [12.4, b => { W.setPop('bird', 34, LX * W.w, W.h * 0.4, inst(b)); sfx(b, 'bird'); }],
          // 光环铺过了大半个地：全地才返青、开花
          [13.6, b => { W.set('bare', 0, inst(b)); W.set('bloom', 1, inst(b)); }],
          [15, b => lv('rmDeath', 0, b)],
          // 6:4 新生的样式
          [16.1, b => { everyone('stand'); each(id => glow(id, 0.34)); sfx(b, 'harp', { soft: true }); }],
          [18, () => { everyone('raise'); pose('paul', 'raise'); }],
          [21.5, b => { everyone('stand'); pose('paul', 'stand'); lv('rmWrite', 0.25, b); hint(b, '按住言说时，灵从何处来，风就从何处吹过', 6); }],
        ]);
        return { life: LX };
      },
    },

    // ── 8:1–2，8:26，8:15 圣灵的叹息：风 ─────────────────────────
    {
      kind: 'act', utter: '圣灵亲自用说不出来的叹息替我们祷告', cmd: 'pray --by 圣灵 --for 我们 --lang 说不出来的叹息', ref: '8:26',
      verse: [
        { text: '如今，那些在基督耶稣里的就不定罪了。<br>因为赐生命圣灵的律，在基督耶稣里释放了我，<br>使我脱离罪和死的律了。', ref: RM + '8:1–2', hold: 7.5 },
        { text: '况且，我们的软弱有圣灵帮助；<br>我们本不晓得当怎样祷告，<br>只是圣灵亲自用说不出来的叹息<br>替我们祷告。', ref: RM + '8:26', hold: 7.5 },
        { text: '你们所受的，不是奴仆的心，仍旧害怕；<br>所受的，乃是儿子的心，<br>因此我们呼叫：「阿爸！父！」', ref: RM + '8:15', hold: 7 },
      ],
      apply(c) {
        const WC = c.choice && c.choice.wind ? c.choice.wind : [clamp(isFinite(c.x) ? c.x / W.w : 0.3, -0.02, 1.02), clamp(isFinite(c.y) ? c.y / W.h : 0.4, 0.08, 0.8)];
        if (!c.choice && !port() && WC[0] < 0.52) WC[1] = Math.min(WC[1], 0.5);   // 宽屏：不从经文上头穿过
        T(c, [
          [0, b => { write(b, 7); S.windC = WC.slice(); W.goTo(0.46, 10, inst(b)); everyone('pray'); pose('paul', 'pray'); }],
          [2, b => { W.set('gale', 0.42, inst(b)); lv('rmWind', 1, b); sfx(b, 'wind'); }],
          [8.8, b => { lv('rmBreath', 1, b); sfx(b, 'whisper'); }],
          [12, b => sfx(b, 'wind', { soft: true })],
          // 8:15「阿爸！父！」
          [17.6, b => { everyone('raise'); pose('paul', 'raise'); ring(b, W.w * centerX(), W.h * 0.72, [236, 244, 255], M() * 0.5, 3, 1.4); sfx(b, 'harp'); }],
          [21, b => { W.set('gale', 0.06, inst(b)); lv('rmWind', 0, b); }],
          [23, b => { everyone('stand'); pose('paul', 'stand'); lv('rmWrite', 0.25, b); }],
        ]);
        return { wind: WC };
      },
    },

    // ── 8:28–31 万事都互相效力 ─────────────────────────────────
    {
      kind: 'promise', utter: '万事都互相效力，叫爱神的人得益处', cmd: 'merge --all 万事 --into 益处  # 预定 > 召 > 称义 > 荣耀', ref: '8:28',
      verse: [
        { text: '我们晓得万事都互相效力，<br>叫爱神的人得益处，<br>就是按他旨意被召的人。', ref: RM + '8:28', hold: 6.5 },
        { text: '预先所定下的人又召他们来；<br>所召来的人又称他们为义；<br>所称为义的人又叫他们得荣耀。', ref: RM + '8:30', hold: 7 },
        { text: '既是这样，还有什么说的呢？<br>神若帮助我们，谁能敌挡我们呢？', ref: RM + '8:31', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { write(b, 8); snapLv('rmBreath', 0); snapLv('rmWind', 0); W.goTo(0.56, 12, inst(b)); lv('rmThread', 1.3, b); sfx(b, 'harp'); }],
          [2.5, () => { everyone('gaze'); pose('paul', 'gaze'); }],
          [7.8, b => { lv('rmWeave', 1, b); sfx(b, 'lyre'); }],
          [8.6, b => lv('rmKnot', 4, b)],
          [10.3, b => sfx(b, 'bell', { soft: true })],
          [12, b => sfx(b, 'bell', { soft: true })],
          [13.6, b => sfx(b, 'bell', { soft: true })],
          [15.3, b => sfx(b, 'bell')],
          [16.1, b => { everyone('stand'); pose('paul', 'raise'); const t = domeTop(); ring(b, t[0], t[1], [255, 232, 180], M() * 0.5, 3, 1.4); }],
          [20, b => { pose('paul', 'stand'); lv('rmWrite', 0.25, b); }],
        ]);
      },
    },

    // ── 8:35–39 都不能叫我们与神的爱隔绝 ─────────────────────────
    {
      kind: 'promise', utter: '都不能叫我们与神的爱隔绝', cmd: 'ping -c 永远 神的爱  # 死、生、天使、掌权的……都不能隔绝', ref: '8:39',
      verse: [
        { text: '谁能使我们与基督的爱隔绝呢？<br>难道是患难吗？是困苦吗？是逼迫吗？<br>是饥饿吗？是赤身露体吗？是危险吗？是刀剑吗？', ref: RM + '8:35', hold: 7.5 },
        { text: '然而，靠着爱我们的主，<br>在这一切的事上已经得胜有余了。', ref: RM + '8:37', hold: 5.5 },
        { text: '因为我深信无论是死，是生，……<br>是高处的，是低处的，是别的受造之物，<br>都不能叫我们与神的爱隔绝；<br>这爱是在我们的主基督耶稣里的。', ref: RM + '8:38–39', hold: 8.5 },
      ],
      apply(c) {
        const P = people(), cx = centerX();
        T(c, [
          [0, b => {
            write(b, 9); W.goTo(0.6, 6, inst(b));
            W.set('storm', 0.72, inst(b)); W.set('clouds', 1, inst(b)); W.set('gale', 0.75, inst(b)); W.set('gloom', 0.3, inst(b));
            snapLv('rmThread', 0); lv('rmDome', 0.55, b);
            sfx(b, 'wind');
          }],
          // 众人靠拢在树下
          [1, () => { S.huddle = true; P.forEach((p, i) => { walk(p.id, lerp(homeX(i), cx, 0.35), { speed: 0.03 }); }); }],
          [2, b => { W.set('rain', 0.6, inst(b)); sfx(b, 'rain'); }],
          [2.5, b => { lv('rmSmoke', 1, b); bolt(b, 0.24); }],
          [5.5, b => bolt(b, 0.9)],
          [6, () => { everyone('kneel'); }],
          // 8:37 撞在爱上就散了
          [8.8, b => {
            lv('rmBreak', 1, b); lv('rmDome', 1, b); flash(b, 0.18);
            if (!inst(b)) { const d = G.dome; for (let j = 0; j < 7; j++) { const th = Math.PI * (1.08 + 0.84 * j / 6); fx().ring(d.cx + Math.cos(th) * d.rx, d.cy + Math.sin(th) * d.ry, [255, 226, 176], M() * 0.09, 1.6, 1.4); } }
            sfx(b, 'thunder'); sfx(b, 'angel', { soft: true });
          }],
          [10, () => everyone('stand')],
          [11.5, b => bolt(b, 0.14)],
          // 8:38–39 雨住云开，穹顶张开，罩住全地
          [15.6, b => {
            W.set('storm', 0, inst(b)); W.set('rain', 0, inst(b)); W.set('gloom', 0, inst(b)); W.set('gale', 0.1, inst(b)); W.set('clouds', 0.4, inst(b));
            lv('rmOpen', 1, b); flash(b, 0.12);
            const d = G.dome; ring(b, d.cx, d.cy - d.ry * 0.5, [255, 236, 200], Math.hypot(W.w, W.h) * 0.8, 5, 2);
            sfx(b, 'angel');
          }],
          [17, () => { everyone('raise'); pose('paul', 'raise'); }],
          [22.5, b => { everyone('stand'); pose('paul', 'stand'); lv('rmWrite', 0.25, b); }],
        ]);
      },
    },

    // ── 9:16，10:12–18 凡求告主名的就必得救 ─────────────────────
    {
      kind: 'promise', utter: '凡求告主名的就必得救', cmd: 'broadcast 福音 --to 地极  # 报喜信的人，脚踪何等佳美', ref: '10:13',
      verse: [
        { text: '据此看来，这不在乎那定意的，<br>也不在乎那奔跑的，只在乎发怜悯的神。', ref: RM + '9:16', hold: 5.5 },
        { text: '犹太人和希腊人并没有分别，<br>因为众人同有一位主；<br>他也厚待一切求告他的人。<br>因为「凡求告主名的就必得救」。', ref: RM + '10:12–13', hold: 7.5 },
        { text: '如经上所记：<br>「报福音、传喜信的人，他们的脚踪何等佳美！」', ref: RM + '10:15', hold: 6 },
        { text: '他们的声音传遍天下；<br>他们的言语传到地极。', ref: RM + '10:18', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            write(b, 10); W.goTo(0.765, 14, inst(b));   // 黄昏（不到深夜：下一句的早晨很快就到）
            snapLv('rmDome', 0); snapLv('rmOpen', 0); snapLv('rmSmoke', 0); snapLv('rmBreak', 0); snapLv('rmWeave', 0); snapLv('rmKnot', 0);
            S.huddle = false; homeAll(0.03);
          }],
          [6.8, b => { everyone('raise'); pose('paul', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [9.5, b => { lv('rmHand', 1, b); everyone('carry'); pose('paul', 'stand'); sfx(b, 'fire', { soft: true }); }],
          // 10:15 报信的人举着火把走到海边
          [15.2, b => {
            S.msg = true; setProp('p0', 'torch'); pose('p0', 'stand');
            walk('p0', X().msg, { speed: 0.018, pose: 'point' }); face('p0', -1);
            sfx(b, 'wind', { soft: true });
          }],
          [18, b => { lv('rmLamps', 1, b); sfx(b, 'bell', { soft: true }); }],
          [22.9, b => { pose('paul', 'point'); face('paul', -1); if (!inst(b)) for (const L of G.lamps) if (L.layer === 0 && hsh(L.x) < 0.4) fx().ring(L.x, L.y, [255, 214, 150], 24 * L.r, 1.8, 1); sfx(b, 'bell'); }],
          [26, b => lv('rmWrite', 0.25, b)],
        ]);
      },
    },

    // ── 11:17–36 橄榄树：野橄榄接在其中；万有都是本于他 ─────────────
    {
      kind: 'act', utter: '万有都是本于他，倚靠他，归于他', cmd: 'graft 野橄榄 --onto 橄榄根  # 不是你托着根，乃是根托着你', ref: '11:36',
      verse: [
        { text: '若有几根枝子被折下来，<br>你这野橄榄得接在其中，一同得着橄榄根的肥汁……<br>不是你托着根，乃是根托着你。', ref: RM + '11:17–18', hold: 7.5 },
        { text: '而且他们若不是长久不信，仍要被接上，<br>因为神能够把他们重新接上。', ref: RM + '11:23', hold: 5.5 },
        { text: '深哉，神丰富的智慧和知识！<br>他的判断何其难测！他的踪迹何其难寻！', ref: RM + '11:33', hold: 5.5 },
        { text: '因为万有都是本于他，倚靠他，归于他。<br>愿荣耀归给他，直到永远。阿们！', ref: RM + '11:36', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 夜很快过去：天亮了，树才动（折枝、接枝、肥汁都在晨光里看得见）
          [0, b => { write(b, 11); W.goTo(0.305, 4.5, inst(b)); lv('rmHand', 0, b); everyone('stand'); pose('paul', 'stand'); }],
          [0.6, () => { walk('p0', homeX(0), { speed: 0.03, pose: 'stand' }); pose('paul', 'stand'); }],
          [3.2, b => { setProp('p0', null); face('p0', 1); S.msg = false; faceTo(X().tree); }],
          [4.2, b => { lv('rmFall', 1, b); sfx(b, 'wind', { soft: true }); const t = G.tree; spark(b, t.x, t.y - t.H * 0.4, 16, [214, 200, 160], t.H * 0.4, 'top'); }],
          [4.9, b => { lv('rmGraft', 1, b); sfx(b, 'harp', { soft: true }); }],
          [7, b => { lv('rmSap', 1, b); sfx(b, 'harp'); }],
          // 11:23 重新接上
          [8.8, b => { lv('rmBack', 1, b); sfx(b, 'harp', { soft: true }); }],
          [15.6, b => { lv('rmOlive', 1, b); const t = G.tree; spark(b, t.x, t.y - t.H * 0.7, 40, [255, 236, 190], t.H * 0.5, 'top'); sfx(b, 'bell'); }],
          [17, b => lv('rmLamps', 0, b)],
          [22.4, b => {
            everyone('raise'); pose('paul', 'raise');
            const t = G.tree; ring(b, t.x, t.y - t.H * 0.5, [255, 232, 180], Math.hypot(W.w, W.h) * 0.7, 4.5, 2); flash(b, 0.1);
            sfx(b, 'angel');
          }],
          [26.5, b => { everyone('stand'); pose('paul', 'stand'); lv('rmWrite', 0.25, b); }],
        ]);
      },
    },

    // ── 12:19–21，13:10 伸冤在我；以善胜恶；爱就完全了律法 ──────────
    {
      kind: 'judge', utter: '伸冤在我，我必报应', cmd: 'return 善 --for 恶  # 把炭火堆在他的头上', ref: '12:19',
      verse: [
        { text: '亲爱的弟兄，不要自己伸冤，<br>宁可让步，听凭主怒；<br>因为经上记着：「主说：『伸冤在我，我必报应。』」', ref: RM + '12:19', hold: 7 },
        { text: '「你的仇敌若饿了，就给他吃，<br>若渴了，就给他喝；<br>因为你这样行就是把炭火堆在他的头上。」', ref: RM + '12:20', hold: 7 },
        { text: '你不可为恶所胜，反要以善胜恶。', ref: RM + '12:21', hold: 4.5 },
        { text: '爱是不加害与人的，所以爱就完全了律法。', ref: RM + '13:10', hold: 5 },
      ],
      apply(c) {
        const Xs = X();
        T(c, [
          // 仇敌从前面（离众人远些）走来，走近了才往后一点
          [0, b => {
            write(b, 12); W.goTo(0.5, 10, inst(b));
            S.enemy = true; lv('rmCold', 1, b);
            add('enemy', { label: '仇敌', sex: 'm', age: 'adult', layer: 2, x: Xs.enemyIn, v: Xs.enemyInV, facing: 1, pose: 'walk', robe: ROBE_EN, accent: [46, 46, 54], hair: 'cloth', beard: true, glow: 0, prop: null });
            walk('enemy', Xs.enemy, { speed: 0.021, pose: 'bow' });
            avoid([0.3, 1]);
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [3, () => faceTo(Xs.enemy)],
          [4.6, () => sink('enemy', Xs.enemyV)],
          // 站在他来路上的人往后让开
          [5, () => { const a = Xs.aside.p4; walk('p4', a[0], { speed: 0.02, pose: 'stand' }); sink('p4', a[1]); }],
          // 12:20 一人拿饼，一人拿杯
          [8.3, () => {
            S.bread = 'p2'; S.cup = 'p1';
            pose('p2', 'carry'); pose('p1', 'carry');
            walk('p2', Xs.giveL, { speed: 0.025, pose: 'carry' }); sink('p2', Xs.giveV, 0.17);
            walk('p1', Xs.giveR, { speed: 0.025, pose: 'carry' }); sink('p1', Xs.giveV, 0.17);
            const a = Xs.aside.p0; walk('p0', a[0], { speed: 0.02, pose: 'stand' }); sink('p0', a[1]);
          }],
          [11.2, () => {
            walk('p2', Xs.enemy - Xs.giveIn, { speed: 0.02, pose: 'carry' });
            walk('p1', Xs.enemy + Xs.giveIn, { speed: 0.02, pose: 'carry' });
          }],
          [12.6, b => {
            face('p2', 1); face('p1', -1);
            S.bread = 'enemy'; S.cup = 'enemy'; pose('p2', 'stand'); pose('p1', 'stand');
            pose('enemy', 'sit'); lv('rmCoals', 1, b);
            sfx(b, 'fire', { soft: true });
          }],
          [14.6, b => { lv('rmCold', 0, b); add('enemy', { robe: ROBE_EN2, accent: [214, 196, 160], glow: 0.3, label: '邻舍' }); sfx(b, 'harp', { soft: true }); }],
          // 12:21 以善胜恶
          [16.6, b => { S.bread = null; S.cup = null; pose('enemy', 'stand'); lv('rmCoals', 0.25, b); }],
          [18, () => { pose('p2', 'bow'); face('p2', 1); pose('p1', 'bow'); face('p1', -1); }],
          [20.5, () => { pose('p2', 'stand'); pose('p1', 'stand'); }],
          // 13:10 爱就完全了律法
          [22.4, b => { lv('rmLove', 1, b); faceTo(centerX()); face('enemy', 1); face('p2', 1); face('p1', -1); sfx(b, 'harp'); }],
          [25, b => lv('rmWrite', 0.25, b)],
        ]);
      },
    },

    // ── 16:1–2，14:17，15:13，16:27 喜乐、平安充满你们的心；阿们 ─────
    {
      kind: 'bless', utter: '因信将诸般的喜乐、平安充满你们的心', cmd: 'deliver 书信 --via 非比 --to 罗马  # 阿们', ref: '15:13',
      verse: [
        { text: '我对你们举荐我们的姊妹非比；<br>她是坚革哩教会中的女执事。<br>请你们为主接待她……', ref: RM + '16:1–2', hold: 6.5 },
        { text: '因为神的国不在乎吃喝，<br>只在乎公义、和平，并圣灵中的喜乐。', ref: RM + '14:17', hold: 5.5 },
        { text: '但愿使人有盼望的神，<br>因信将诸般的喜乐、平安充满你们的心，<br>使你们藉着圣灵的能力大有盼望！', ref: RM + '15:13', hold: 7 },
        { text: '愿荣耀，因耶稣基督，<br>归与独一全智的神，直到永远。阿们！', ref: RM + '16:27', hold: 6.5 },
      ],
      apply(c) {
        const Xs = X();
        T(c, [
          [0, b => { write(b, 13); W.goTo(0.765, 22, inst(b)); lv('rmLove', 0.35, b); lv('rmCoals', 0, b); S.rolled = true; sfx(b, 'scroll'); }],
          [0.8, b => {
            S.phoebe = true;
            // 从该犹家的门口出来，站到保罗的右手边（手机上再往前一步，与保罗错开纵深）
            add('phoebe', { label: '非比', sex: 'f', age: 'adult', layer: 2, x: G.house.door / W.w, v: Xs.phInV, facing: -1, pose: 'stand', robe: ROBE_PH, accent: ACC_PH, hair: 'veil', glow: 0.3, prop: null });
            walk('phoebe', Math.min(G.paulX + Xs.phMeet, G.house.door / W.w - 0.005), { speed: 0.02, pose: 'stand' }); sink('phoebe', Xs.phMeetV);
          }],
          [2, b => { S.scroll = 'paul'; pose('paul', 'carry'); face('paul', 1); pose('tertius', 'stand'); face('tertius', 1); nameOver(b, 'phoebe', '非比'); }],
          [4.6, b => { S.scroll = 'phoebe'; pose('paul', 'stand'); pose('phoebe', 'carry'); face('phoebe', -1); sfx(b, 'scroll', { soft: true }); }],
          [6, () => { walk('phoebe', Xs.phoebe, { speed: 0.03, pose: 'carry' }); face('paul', -1); }],
          [7.4, () => sink('phoebe', Xs.phoebeV)],
          [7.8, () => faceTo(Xs.phoebe)],
          [13.5, () => { face('phoebe', -1); pose('phoebe', 'carry'); }],
          // 15:13 喜乐、平安充满各人的心
          [14.6, b => {
            pose('phoebe', 'raise'); lv('rmFull', 1, b); lv('rmWarm', 1, b); flash(b, 0.08);
            const d = G.dome; ring(b, d.cx, d.cy - d.ry * 0.3, [255, 226, 170], M() * 0.7, 4, 1.8);
            sfx(b, 'harp'); sfx(b, 'angel', { soft: true });
          }],
          [17, () => { everyone('raise'); pose('enemy', 'raise'); }],
          // 16:27 阿们
          [22.9, b => {
            lv('rmAmen', 1, b); lv('rmLamps', 1, b); pose('paul', 'raise'); pose('tertius', 'raise');
            ring(b, W.w * centerX(), W.h * 0.7, [255, 236, 200], Math.hypot(W.w, W.h) * 0.9, 6, 2);
            sfx(b, 'sing'); sfx(b, 'bell');
          }],
          [27, () => { everyone('stand'); pose('enemy', 'stand'); pose('phoebe', 'carry'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '罗马书', books: [45], title: '因信称义', sub: '罗马书 1 — 16', tint: [255, 232, 196], music: 'ezra',
    outro: 24,
    intro: [
      { text: '耶稣基督的仆人保罗，奉召为使徒，<br>特派传神的福音。', ref: RM + '1:1', hold: 6 },
      { text: '我写信给你们在罗马、为神所爱、奉召作圣徒的众人。<br>愿恩惠、平安从我们的父神并主耶稣基督归与你们！', ref: RM + '1:7', hold: 7.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '保罗': { text: '耶稣基督的仆人保罗，奉召为使徒，<br>特派传神的福音。', ref: RM + '1:1' },
      '德提': { text: '我这代笔写信的德提，在主里面问你们安。', ref: RM + '16:22' },
      '非比': { text: '我对你们举荐我们的姊妹非比；<br>她是坚革哩教会中的女执事。', ref: RM + '16:1' },
      '犹太人': { text: '犹太人和希腊人并没有分别，<br>因为众人同有一位主；<br>他也厚待一切求告他的人。', ref: RM + '10:12' },
      '希腊人': { text: '我不以福音为耻；这福音本是神的大能，<br>要救一切相信的，<br>先是犹太人，后是希腊人。', ref: RM + '1:16' },
      '亚伯拉罕': { text: '经上说什么呢？说：<br>「亚伯拉罕信神，这就算为他的义。」', ref: RM + '4:3' },
      '橄榄树': { text: '所献的新面若是圣洁，全团也就圣洁了；<br>树根若是圣洁，树枝也就圣洁了。', ref: RM + '11:16' },
      '野橄榄': { text: '你是从那天生的野橄榄上砍下来的，<br>尚且逆着性得接在好橄榄上，<br>何况这本树的枝子，要接在本树上呢！', ref: RM + '11:24' },
      '十字架': { text: '惟有基督在我们还作罪人的时候为我们死，<br>神的爱就在此向我们显明了。', ref: RM + '5:8' },
      '书信': { text: '我写信给你们在罗马、为神所爱、奉召作圣徒的众人。<br>愿恩惠、平安从我们的父神并主耶稣基督归与你们！', ref: RM + '1:7' },
      '灯': { text: '黑夜已深，白昼将近。<br>我们就当脱去暗昧的行为，带上光明的兵器。', ref: RM + '13:12' },
      '该犹的家': { text: '那接待我、也接待全教会的该犹问你们安。', ref: RM + '16:23' },
      '众星': { text: '他在无可指望的时候，因信仍有指望，<br>就得以作多国的父，<br>正如先前所说：「你的后裔将要如此。」', ref: RM + '4:18' },
      '神的荣耀': { text: '因为世人都犯了罪，亏缺了神的荣耀。', ref: RM + '3:23' },
      '仇敌': { text: '「你的仇敌若饿了，就给他吃，<br>若渴了，就给他喝。」', ref: RM + '12:20' },
      '邻舍': { text: '爱是不加害与人的，所以爱就完全了律法。', ref: RM + '13:10' },
      '鸟': { text: '自从造天地以来，<br>神的永能和神性是明明可知的，<br>虽是眼不能见，但藉着所造之物就可以晓得。', ref: RM + '1:20' },
      '鱼': { text: '我们知道，一切受造之物一同叹息，劳苦，直到如今。', ref: RM + '8:22' },
    },
  });
})(window.GS);
