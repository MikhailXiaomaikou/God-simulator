/* ─────────────────────────────────────────────────────────────
 * book/lamb.js —— 启示录 · 羔羊（启示录 6 — 20）
 *
 * 约翰站在近地上观看；天上是一个异象：宝座的光、绿宝石的虹、宝座前的玻璃海、七盏火灯、金坛，
 * 宝座前有羔羊——一只小小的、发光的羊羔（光，不是伤痕；「像是被杀过的」只由经文说出），身旁一卷用七印封严的书卷。
 * 地上：近地的人群（住在地上的人），中丘上是巴比伦大城（塔、殿、金顶、紫与朱红的旗、夜里满城的灯）；
 * 近地右边一座小山（锡安山），左边海边是后来开了又被封上的无底坑。
 *
 * 「羔羊揭开七印中第一印」——白、红、黑、灰四匹马化作四道有色的风与光，从宝座前奔过天空（不画伤害）；
 * 「还要安息片时」——金坛底下的灵魂得了白衣；第六印：地大震动，日头黑如毛布，月红如血，星辰如未熟的无花果被风摇落；
 * 「神也必擦去他们一切的眼泪」——四位天使在地的四角执掌四风，风就止住；住在地上的人衣裳变得洁白，手拿棕树枝，
 *   天上的众人站在玻璃海上；一道生命水从宝座流下，眼泪化作光散去；黎明从东方（左）来；
 * 「羔羊揭开第七印」——天上寂静；七位天使得了七枝号；金香炉，香的烟与众圣徒的祈祷一同升上；火倒在地上：雷、闪电、地震；
 * 「世上的国成了我主和主基督的国」——号声；无底坑冒出烟，天昏暗；大力的天使披着云彩，头上有虹，脸如日头，两脚如火柱，
 *   右脚踏海，左脚踏地；第七号吹响，金色的光铺满全地；
 * 「天上现出大异象来」——身披日头、脚踏月亮、头戴十二星的妇人；红黑的烟聚成的龙，尾巴扫落星辰；孩子被提到宝座那里；
 *   妇人逃到旷野，远山上有一点神为她预备的光；
 * 「天上再没有它们的地方」——米迦勒与众天使的光压退黑烟，龙被摔下，如一团黑暗落在海边的沙上；
 * 「是的，他们息了自己的劳苦」——黑烟从海中升起为兽；羔羊从天降下，站在锡安山上，众人额上有光的名；琴声；众人安息；
 * 「成了！」——玻璃海中有火搀杂，得胜者拿着琴；七碗倒下暗红的光；宝座上一声「成了！」，闪电、大地震，大城裂为三段；
 * 「我的民哪，你们要从那城出来」——夜里的巴比伦满城灯火；列王的暗雾围着羔羊，被光驱散；大权柄的天使从左上的天降下，使地发光；
 *   城里的人提着灯从城门走到海边，上到近岸，走进众人中间；大磨石扔在海里；灯全灭，大城倾倒成了荒场，只剩轻烟；
 * 「哈利路亚！因为主我们的神、全能者作王了」——天亮；天上的群众；众人举手；新妇的细麻衣发光；羔羊的婚筵摆在地上；
 * 「他的名称为神之道」——天开了；白马与骑马的是纯光（冠冕只由经文说出）；天上的众军骑着白马跟随；「万王之王，万主之主」；
 * 「在头一次复活有分的有福了，圣洁了！」——天使拿着钥匙和链子，捆住海边的黑暗，扔进无底坑，用印封上；几个宝座；
 *   一千年（一日一夜流转）；
 * 「另有一卷展开，就是生命册」——白色的大宝座；天地逃避（日头隐去），世界褪成一片白光；案卷展开，生命册展开；海交出死人（光点升起）；
 *   死亡和阴间被扔在火湖里——只由经文说出：最后一点黑暗消失，只剩光。
 *
 * 父不显为人形：宝座上只有光。羔羊是光；骑白马的是光；龙、兽、列王都只是暗烟与红黑的微光，总被光胜过。
 * 画面的方位（桌面）：天上异象在右上（宝座 0.70, 0.135）；经文在左下的海面上；近地：无底坑 0.535，约翰 0.6，众人 0.64–0.9，锡安山 0.78；
 * 发光的天使都离宝座远（至少约 0.2 画面宽），免得看成坐宝座的；暗的事（龙落下、兽、磨石）都在经文之外。
 * 竖屏：经文在上，异象在经文之下（宝座 0.64, 0.33），地上的人少一些。一切位置都以画面的比例记下；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'lamb';
  const isCur = () => GS.book.current(ACT);
  const ease = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const eOut = t => { t = clamp(t, 0, 1); return 1 - (1 - t) * (1 - t) * (1 - t); };
  const eIn = t => { t = clamp(t, 0, 1); return t * t; };

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  const LV = {
    lbHeaven: ['exp', 0.6],      // 天上的宝座、虹、玻璃海
    lbLamb: ['exp', 0.8],        // 羔羊
    lbLambGlow: ['exp', 0.8],    // 羔羊的光更亮
    lbLambGo: ['lin', 0.3],      // 羔羊：0 在宝座前 → 1 在锡安山上
    lbScroll: ['exp', 0.8],      // 七印封严的书卷
    lbScrollOpen: ['exp', 0.9],  // 书卷展开
    lbRide1: ['lin', 0.2], lbRide2: ['lin', 0.2], lbRide3: ['lin', 0.22], lbRide4: ['lin', 0.2],   // 四匹马
    lbAltar: ['exp', 0.8],       // 金坛
    lbSouls: ['exp', 0.5],       // 坛下的灵魂
    lbRobes: ['exp', 0.6],       // 白衣赐给他们
    lbSigns: ['exp', 0.5],       // 日头黑如毛布，月红如血
    lbStarfall: ['lin', 0.16],   // 星辰坠落
    lbFour: ['exp', 0.6],        // 四位天使执掌四风
    lbHost: ['exp', 0.45],       // 宝座前的群众（光）
    lbSpring: ['lin', 0.25], lbSpringA: ['exp', 0.6],   // 生命水的泉源
    lbHush: ['exp', 0.8],        // 天上寂静
    lbSeven: ['exp', 0.6],       // 七位天使
    lbCenser: ['exp', 0.7], lbIncense: ['lin', 0.14],   // 金香炉，香的烟与祈祷
    lbPit: ['exp', 0.8],         // 无底坑
    lbSmoke: ['lin', 0.12], lbSmokeA: ['exp', 0.45],   // 坑里冒出的烟
    lbMighty: ['exp', 0.8], lbOath: ['exp', 0.8],      // 大力的天使；举手起誓
    lbKingdom: ['exp', 0.4],     // 世上的国成了主的国：金光铺满全地
    lbWoman: ['exp', 0.5], lbChild: ['lin', 0.3], lbFlee: ['lin', 0.25], lbRefuge: ['exp', 0.5],
    lbDragon: ['exp', 0.45], lbSweep: ['lin', 0.22],
    lbMichael: ['exp', 0.6], lbWar: ['lin', 0.15], lbCast: ['lin', 0.38], lbHaze: ['exp', 0.5],
    lbBeast: ['lin', 0.22], lbBeastA: ['exp', 0.5],
    lbZion: ['exp', 0.6], lbMarks: ['exp', 0.6], lbRest: ['exp', 0.4],
    lbGlassFire: ['exp', 0.6], lbVictors: ['exp', 0.6], lbGlory: ['exp', 0.5], lbBowls: ['lin', 0.16], lbSplit: ['lin', 0.5],
    lbCity: ['exp', 0.4], lbCityLit: ['lin', 0.2], lbKings: ['exp', 0.45], lbAuth: ['exp', 0.6],
    lbRuin: ['lin', 0.3], lbExodus: ['lin', 0.2],     // 大城成了荒场；城里的人走出来
    lbStoneAng: ['exp', 0.8], lbStone: ['lin', 0.6], lbCitySmoke: ['exp', 0.3],
    lbLinen: ['exp', 0.5], lbTable: ['exp', 0.5],
    lbOpen: ['exp', 0.6], lbRider: ['lin', 0.15], lbArmies: ['lin', 0.14], lbRiderA: ['exp', 0.5],
    lbBinder: ['exp', 0.6], lbBind: ['lin', 0.35], lbBound: ['lin', 0.3], lbSealPit: ['exp', 0.8],
    lbThrones: ['exp', 0.5], lbReign: ['lin', 0.25],
    lbWhite: ['exp', 0.3], lbDead: ['exp', 0.4], lbBooks: ['lin', 0.3], lbLife: ['exp', 0.6], lbSeaRise: ['lin', 0.15], lbEnd: ['exp', 0.4],
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 画面的方位（画面比例）：[桌面, 竖屏] ─────────────────────────
  let PORT = false;
  const GEO = {
    th: [[0.70, 0.135], [0.64, 0.33]],                 // 宝座
    glass: [[0.70, 0.235, 0.17], [0.6, 0.41, 0.36]],    // 玻璃海：中心 x、y，半宽（画面宽的比例）
    lambH: [[0.705, 0.232], [0.66, 0.408]],            // 宝座前的羔羊（脚下）
    altar: [[0.56, 0.232], [0.38, 0.408]],             // 金坛
    seven: [[0.535, 0.885, 0.385], [0.28, 0.95, 0.5]], // 七位天使：x0、x1、脚下 y
    four: [[[0.08, 0.16], [0.93, 0.14], [0.07, 0.48], [0.95, 0.47]], [[0.1, 0.37], [0.9, 0.35], [0.08, 0.58], [0.93, 0.57]]],
    sun: [[0.27, 0.22], [0.2, 0.52]],   // 日头黑像毛布（离血红的月远些）
    moon: [[0.31, 0.16], [0.3, 0.4]],
    ride0: [[0.72, 0.25], [0.62, 0.43]],
    rideY: [[0.2, 0.28, 0.36, 0.44], [0.39, 0.44, 0.5, 0.55]],
    zion: [0.78, 0.74],
    john: [0.6, 0.5],
    folk: [[0.64, 0.9], [0.55, 0.95]],
    folkN: [9, 5],
    outTo: [[0.669, 0.727, 0.785, 0.843], [0.63, 0.79]],   // 出城的人走到众人之间的空处
    pit: [0.535, 0.395],                               // 桌面：在经文之右的岸边
    haze: [[0.535, -1], [0.25, 0.9]],                  // 桌面：y < 0 = 中丘（巴比伦那道山）的海边沙上
    beast: [[0.45, 0.605, 0.4], [0.16, 0.9, 0.6]],     // 海中：底 x、底 y、顶 y（桌面：远海的地平线上）
    mighty: [[0.44, 0.548], [0.37, 0.565]],            // 右脚（踏海）x、左脚（踏远岸之地）x——都在地平线上
    woman: [[0.48, 0.45], [0.46, 0.53]],
    dragon: [[0.87, 0.42], [0.8, 0.47]],
    mich: [[0.5, 0.36, 0.74, 0.5], [0.25, 0.52, 0.56, 0.52]],   // 米迦勒：从左边的天上来（起 x、y，止 x、y）——离宝座远
    refuge: [[0.93, 0.578], [0.92, 0.588]],
    rider0: [[0.745, 0.05], [0.66, 0.31]],
    rider1: [[0.53, 0.345], [0.45, 0.5]],
    city: [[0.585, 0.965], [0.52, 1.0]],
    auth: [[0.42, 0.32], [0.3, 0.58]],                 // 大权柄的天使：左边的天上，离宝座远
    stoneA: [[0.44, 0.17], [0.12, 0.44]],
    stoneB: [[0.5, 0.603], [0.2, 0.8]],                // 桌面：地平线上的海（经文之上）
    table: [[0.62, 0.9], [0.53, 0.94]],
    books: [[0.7, 0.33], [0.62, 0.5]],
    spring: [0.585, 0.47],
  };
  const G = k => GEO[k][PORT ? 1 : 0];
  let CITY = null, GRAD = {};
  function layout() { PORT = W.w < W.h * 0.9; CITY = null; GRAD = {}; }

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { seals: 0, white: 0, palms: 0, blown: 0, bowls: 0, out: 0, linen: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = () => 34 * LS(2);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const VU = () => (PORT ? Math.max(0.5, W.w / 430) : Math.max(0.5, Math.min(W.w / 1280, W.h / 800)));
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, a);
  const px = p => [p[0] * W.w, p[1] * W.h];

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o, W.replaying ? { from: 'none' } : {})); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p) { if (has(id)) C().pose(id, p); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function members(gid) { const c = C(); const g = hasCrowd(gid) ? c.crowds.get(gid) : null; return g ? g.members : []; }
  function crowd(gid, o, dress) {
    const c = C();
    if (!c || !c.crowd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = U.safe('cast.crowd', () => c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o, W.replaying ? { from: 'none' } : {}))) || [];
    if (dress) ms.forEach((m, i) => dress(m, i, ms.length));
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  // 一群人各走到指定的地方（确定的位置，重演时一样）
  function walkTo(gid, xs, o) {
    if (!hasCrowd(gid)) return;
    cwalk(gid, xs[0], xs[xs.length - 1], o);
    members(gid).forEach((m, i) => {
      const x = xs[i % xs.length];
      if (W.replaying) { if (Math.abs(x - m.nx) > 1e-4) m.facing = m.fd = x > m.nx ? 1 : -1; m.nx = x; m.tx = null; }
      else { m.tx = x; m.facing = x >= m.nx ? 1 : -1; }
    });
  }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  // 一群人都转向某处（数值：画面比例的 x；正走着的，走到了再转）
  function cface(gid, d) {
    for (const m of members(gid)) {
      const dd = d === 1 || d === -1 ? d : (d >= (m.tx != null ? m.tx : m.nx) ? 1 : -1);
      if (m.tx != null && !W.replaying) { m.faceEnd = dd; continue; }
      m.faceEnd = null;
      m.facing = dd;
      if (W.replaying) m.fd = dd;
    }
  }
  function cglow(gid, v) { for (const m of members(gid)) m.glow = v; }
  const PEOPLE = ['folk', 'out'];
  const allPose = p => { for (const g of PEOPLE) cpose(g, p); };
  const allFace = d => { for (const g of PEOPLE) cface(g, d); };

  // 衣袍（按序号，不用随机）
  const golden = i => (i * 0.6180339) % 1;
  const FOLK = [[132, 104, 78], [110, 88, 72], [150, 118, 90], [98, 84, 76], [124, 104, 88], [108, 98, 112], [142, 100, 82], [118, 110, 96]];
  const WOMEN = [[170, 120, 104], [132, 110, 140], [186, 150, 112], [150, 100, 96], [118, 118, 142]];
  const ACC_F = [[220, 208, 186], [196, 176, 150], [206, 190, 160], [184, 150, 132]];
  const WHITE = [[246, 244, 236], [238, 240, 246], [250, 246, 234], [242, 238, 228]];
  const dressFolk = (x0, x1, label, v1) => (m, i, n) => {
    m.sex = i % 3 === 1 ? 'f' : 'm';
    m.age = i % 7 === 5 ? 'child' : i % 9 === 4 ? 'elder' : 'adult';
    m.robe = m.sex === 'f' ? WOMEN[i % WOMEN.length] : FOLK[i % FOLK.length];
    m.accent = m.sex === 'f' ? ACC_F[i % ACC_F.length] : null;
    m.hairOpt = null; m.prop = null; m.propDefault = false; m.carry = null;
    m.scale = 0.93 + 0.1 * golden(i + 7);
    m.v = lerp(0.02, v1 == null ? (PORT ? 0.3 : 0.22) : v1, golden(i + 1));
    m.nx = lerp(x0, x1, (i + 0.5) / n) + (golden(i + 3) - 0.5) * ((x1 - x0) / n) * 0.5;
    m.facing = m.fd = i % 2 ? -1 : 1;
    if (label) m.label = label;
  };
  // 衣裳洗白净（7:14）/ 光明洁白的细麻衣（19:8）
  function whiten(gid, gl, label) {
    members(gid).forEach((m, i) => { m.robe = WHITE[i % WHITE.length]; m.accent = m.sex === 'f' ? [252, 250, 244] : null; m.glow = gl; if (label) m.label = label; });
  }

  // 旁白以外的声音与闪光（瞬间重演时不放）
  function sfx(b, name, o) { if (b && b.instant) return; const a = au(); if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o)); }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  // 一个从 0 走到 1 的进程（重演时直接到 1）
  function run(b, k, to) { W.set(k, 0, true); W.set(k, to == null ? 1 : to, b.instant); }
  const setL = (b, k, v) => W.set(k, v, b.instant);
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 名字（光聚成的字）
  function nameAt(b, str, xf, yf, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || (PORT ? 0.075 * W.w : 40 * u), (W.w * 0.8) / (n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 6, W.w - half - 6), cy = yf * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * 80 * u, cy + 40 * u + Math.random() * 40 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 228, 170], src, { hold: o.hold || 3.2 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function ringAt(b, x, y, r, rgb, dur, w) { if (b.instant || !fx()) return; fx().ring(x, y, rgb || [255, 240, 204], M() * (r || 0.2), dur || 2.4, w || 1.6); }
  function sparkleAt(b, x, y, n, rgb, spread) { if (b.instant || !fx()) return; fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], (spread || 14) * SU(), 'top'); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
  let SP = null, ARMY = null;
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
        gold: radial([255, 226, 160], 1), white: radial([248, 248, 255], 1), warm: radial([255, 176, 96], 1), pale: radial([226, 234, 255], 1),
        amber: radial([255, 204, 130], 1, 0.5), emerald: radial([110, 230, 160], 1, 0.4), red: radial([230, 70, 50], 1, 0.35),
        ember: radial([170, 36, 28], 1, 0.4), smoke: radial([16, 12, 18], 1, 0.6), smoke2: radial([70, 64, 66], 1, 0.6),
        cloud: radial([255, 250, 238], 1, 0.6), fire: radial([255, 140, 50], 1, 0.3), blue: radial([170, 196, 255], 1, 0.4),
      };
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0.3)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 发光的人形（天使、灵魂、群众）：没有面目，只有光
  function lightFigure(ctx, x, y, h, a, seed, col, halo) {
    if (a < 0.01 || h < 0.8 || !SP) return;
    ctx.globalAlpha = Math.min(1, a * (halo == null ? 0.45 : halo));
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = col || 'rgb(255,250,236)';
    const sw = Math.sin(W.t * 1.7 + seed) * 0.03 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * h, y);
    ctx.quadraticCurveTo(x - 0.13 * h + sw, y - 0.45 * h, x - 0.075 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.075 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.13 * h + sw, y - 0.45 * h, x + 0.17 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.078 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.078 * h, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 小火苗（七盏火灯、坛上的火）
  function tongue(ctx, x, y, w, h, seed) {
    const sw = Math.sin(W.t * 7 + seed) * w * 0.5;
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 0.8, y - h * 0.5, x + sw, y - h);
    ctx.quadraticCurveTo(x + w * 0.8, y - h * 0.5, x + w, y);
    ctx.closePath();
  }

  // ── 马（光的马）：人高约 30 单位；马面向 +x，原点在地面（前后蹄之间）────
  const HBODY = (() => { const a = []; for (let i = 0; i < 16; i++) { const t = i / 16 * TAU; a.push([Math.cos(t) * 13, -18 + Math.sin(t) * 5.8]); } return a; })();
  const HLEGS = [[-10, -17, 0, 0], [-7.5, -17, Math.PI * 0.85, 0], [8.2, -16, Math.PI * 0.35, 1], [10.6, -16, Math.PI * 1.3, 1]];
  function horseBody(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2, n = gait * Math.sin(ph * 2 + 0.6) * 1.2 - (1 - gait) * 0.8;
    const X_ = u => x + d * u * k, Y_ = v => y + (v + bob) * k;
    ctx.moveTo(X_(HBODY[0][0]), Y_(HBODY[0][1]));
    for (let i = 1; i < HBODY.length; i++) ctx.lineTo(X_(HBODY[i][0]), Y_(HBODY[i][1]));
    ctx.closePath();
    ctx.moveTo(X_(6), Y_(-21));
    ctx.quadraticCurveTo(X_(10.5), Y_(-28 + n), X_(14.5), Y_(-32.5 + n));
    ctx.lineTo(X_(15.6), Y_(-35.4 + n)); ctx.lineTo(X_(16.9), Y_(-32.2 + n));
    ctx.quadraticCurveTo(X_(20.6), Y_(-29.4 + n), X_(23.2), Y_(-25.6 + n));
    ctx.lineTo(X_(22.2), Y_(-23.6 + n));
    ctx.quadraticCurveTo(X_(19.4), Y_(-24.2 + n), X_(16.6), Y_(-25.2 + n));
    ctx.quadraticCurveTo(X_(14.2), Y_(-20), X_(12.6), Y_(-14.6));
    ctx.lineTo(X_(7.5), Y_(-14.2));
    ctx.closePath();
  }
  function horseLegs(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2;
    for (const L of HLEGS) {
      const sw = Math.sin(ph + L[2]);
      const a1 = (L[3] ? 0.08 : -0.08) + gait * (L[3] ? 0.7 : 0.55) * sw;
      const bend = gait * Math.max(0, Math.cos(ph + L[2])) * (L[3] ? -1.3 : 0.9);
      const kx = L[0] + Math.sin(a1) * 8.6, ky = L[1] + bob + Math.cos(a1) * 8.6;
      const a2 = a1 + bend;
      const hx = kx + Math.sin(a2) * 8.8, hy = ky + Math.cos(a2) * 8.8;
      ctx.moveTo(x + d * L[0] * k, y + (L[1] + bob) * k); ctx.lineTo(x + d * kx * k, y + ky * k); ctx.lineTo(x + d * hx * k, y + hy * k);
    }
  }
  function horseMane(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2, n = gait * Math.sin(ph * 2 + 0.6) * 1.2 - (1 - gait) * 0.8;
    const X_ = u => x + d * u * k, Y_ = v => y + (v + bob) * k;
    ctx.moveTo(X_(6.5), Y_(-22)); ctx.quadraticCurveTo(X_(9.5), Y_(-29 + n), X_(14), Y_(-33 + n));
    const tw = Math.sin(W.t * 4 + ph) * 1.5;
    ctx.moveTo(X_(-12.5), Y_(-20)); ctx.quadraticCurveTo(X_(-17), Y_(-18 + tw * 0.3), X_(-19 - gait * 3), Y_(-11 - gait * 5 + tw));
  }
  function riderPath(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2;
    const cx = x + d * -1 * k, cy = y + (-29 + bob) * k, hx = x + d * 0.6 * k, hy = y + (-37.2 + bob) * k;
    ctx.moveTo(cx + 2.7 * k, cy); ctx.ellipse(cx, cy, 2.7 * k, 5.8 * k, d * 0.12, 0, TAU);
    ctx.moveTo(hx + 2.2 * k, hy); ctx.arc(hx, hy, 2.2 * k, 0, TAU);
    ctx.moveTo(cx - 1.6 * k, cy + 3 * k); ctx.lineTo(cx + d * 3.6 * k, cy + 9.5 * k); ctx.lineTo(cx + d * 1.2 * k, cy + 10.5 * k); ctx.lineTo(cx + 1.6 * k, cy + 3 * k); ctx.closePath();
  }
  // 一匹光的马与骑马的：col [r,g,b]；o.dark：暗色的剪影（黑马）加一道淡边
  function lightHorse(ctx, x, y, k, d, ph, gait, col, a, o) {
    if (a < 0.01) return;
    o = o || {};
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = o.dark ? 'source-over' : 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    const cs = rgba(col, 1);
    ctx.strokeStyle = cs; ctx.fillStyle = cs; ctx.lineWidth = Math.max(0.8, 2.3 * k);
    ctx.beginPath(); horseLegs(ctx, x, y, k, d, ph, gait); ctx.stroke();
    ctx.beginPath(); horseBody(ctx, x, y, k, d, ph, gait); if (o.rider !== false) riderPath(ctx, x, y, k, d, ph, gait); ctx.fill();
    ctx.lineWidth = Math.max(0.6, 1.1 * k);
    ctx.beginPath(); horseMane(ctx, x, y, k, d, ph, gait); ctx.stroke();
    if (o.rim) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, a * 0.7);
      ctx.strokeStyle = rgba(o.rim, 1);
      ctx.lineWidth = Math.max(0.6, 0.8 * k);
      ctx.beginPath(); horseBody(ctx, x, y, k, d, ph, gait); if (o.rider !== false) riderPath(ctx, x, y, k, d, ph, gait); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天上的众军：预绘的小白马（两种步态）
  function armySprites() {
    if (ARMY) return ARMY;
    try {
      const mk = ph => {
        const k = 2, c = cnv(50 * k, 46 * k), g = c.getContext('2d'), x = 25 * k, y = 42 * k;
        g.globalCompositeOperation = 'lighter';
        const gr = g.createRadialGradient(x, y - 20 * k, 0, x, y - 20 * k, 24 * k);
        gr.addColorStop(0, 'rgba(255,246,220,0.45)'); gr.addColorStop(1, 'rgba(255,246,220,0)');
        g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
        lightHorse(g, x, y, k, -1, ph, 0.8, [255, 252, 244], 1);
        return { c, k, ox: x, oy: y };
      };
      ARMY = [mk(0.4), mk(2.2), mk(4.1)];
    } catch (e) { ARMY = null; }
    return ARMY;
  }

  // ── 羔羊：一只小小的、发光的羊羔（面朝 d）────────────────────
  function lambPath(ctx, x, y, s, d) {
    const E = (cx, cy, rx, ry, rot) => { ctx.moveTo(cx + rx * Math.cos(rot), cy + rx * Math.sin(rot)); ctx.ellipse(cx, cy, rx, ry, rot, 0, TAU); };
    E(x, y - 0.5 * s, 0.34 * s, 0.19 * s, 0);
    for (let i = 0; i < 5; i++) { const cx = x + (-0.24 + i * 0.12) * s, cy = y - 0.63 * s + Math.abs(i - 2) * 0.018 * s; ctx.moveTo(cx + 0.095 * s, cy); ctx.arc(cx, cy, 0.095 * s, 0, TAU); }
    E(x + d * 0.4 * s, y - 0.66 * s, 0.125 * s, 0.085 * s, d * 0.35);
    E(x + d * 0.3 * s, y - 0.745 * s, 0.075 * s, 0.028 * s, -d * 0.5);
    for (const lx of [-0.22, -0.12, 0.13, 0.23]) ctx.rect(x + d * lx * s - 0.026 * s, y - 0.37 * s, 0.052 * s, 0.37 * s);
    E(x - d * 0.36 * s, y - 0.56 * s, 0.065 * s, 0.05 * s, 0);
  }
  function drawLambAt(ctx, x, y, s, a, d, gk) {
    if (a < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - 0.5 * s, s * (1.7 + 0.9 * gk), a * (0.4 + 0.35 * gk));
    glowAt(ctx, SP.white, x, y - 0.5 * s, s * 0.75, a * (0.45 + 0.2 * gk));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = 'rgb(255,251,240)';
    ctx.beginPath(); lambPath(ctx, x, y, s, d); ctx.fill();
    ctx.globalAlpha = Math.min(1, a * 0.5);
    ctx.fillStyle = 'rgb(255,226,170)';
    ctx.beginPath(); ctx.ellipse(x - d * 0.05 * s, y - 0.42 * s, 0.26 * s, 0.07 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function lambSize() { return (PORT ? 30 : 34) * VU(); }
  function zionGeom() {
    const z = G('zion'), hw = PORT ? 0.12 : 0.075, ph = (PORT ? 0.058 : 0.092) * W.h;
    return { z, hw, ph, top: [z * W.w, gY(2, z) - ph] };
  }
  function lambPos() {
    const g = ease(lv('lbLambGo')), h = px(G('lambH')), z = zionGeom().top;
    const cx = lerp(h[0], z[0], 0.5) + 0.04 * W.w, cy = Math.min(h[1], z[1]) - 0.02 * W.h;
    const m = 1 - g;
    return [m * m * h[0] + 2 * m * g * cx + g * g * z[0], m * m * h[1] + 2 * m * g * cy + g * g * z[1] + 1, g];
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上（宝座、虹、玻璃海、七灯、金坛、书卷、群众）
  // ════════════════════════════════════════════════════════════
  function drawThrone(ctx) {
    const k = lv('lbHeaven');
    if (k < 0.01 || !SP) return;
    const [x, y] = px(G('th')), u = VU(), wh = lv('lbWhite'), hush = lv('lbHush'), gl = lv('lbGlory');
    const pulse = 1 + 0.05 * Math.sin(W.t * 1.3) * (1 - hush);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 白色的大宝座（20:11）
    if (wh > 0.01) {
      glowAt(ctx, SP.white, x, y, M() * 0.75 * wh, 0.28 * wh);
      glowAt(ctx, SP.white, x, y, 110 * u * (1 + 0.5 * wh), 0.5 * wh);
    }
    // 殿中充满了烟（15:8）：神的荣耀
    if (gl > 0.01) {
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * TAU + W.t * 0.05, r = (70 + 22 * hsh(i * 3.1)) * u;
        glowAt(ctx, SP.cloud, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.55, 46 * u, gl * 0.26);
      }
    }
    glowAt(ctx, SP.amber, x, y, 130 * u * pulse, k * 0.2);
    glowAt(ctx, SP.gold, x, y, 64 * u * pulse, k * 0.42);
    // 宝座：一张光的座（坐在上面的只是光）
    ctx.strokeStyle = 'rgb(255,236,190)';
    ctx.lineWidth = Math.max(1, 1.6 * u);
    ctx.globalAlpha = k * 0.3;
    ctx.beginPath();
    ctx.moveTo(x - 15 * u, y + 18 * u); ctx.lineTo(x - 15 * u, y - 12 * u);
    ctx.quadraticCurveTo(x - 15 * u, y - 25 * u, x, y - 27 * u); ctx.quadraticCurveTo(x + 15 * u, y - 25 * u, x + 15 * u, y - 12 * u);
    ctx.lineTo(x + 15 * u, y + 18 * u);
    ctx.moveTo(x - 23 * u, y + 8 * u); ctx.lineTo(x + 23 * u, y + 8 * u);
    ctx.stroke();
    glowAt(ctx, SP.white, x, y - 4 * u, 25 * u * pulse, k * 0.9);
    glowAt(ctx, SP.white, x, y - 4 * u, 9 * u, k);
    // 虹围着宝座，好像绿宝石（4:3）
    const rb = k * (1 - wh * 0.85);
    if (rb > 0.01) {
      ctx.globalAlpha = rb * 0.2; ctx.strokeStyle = 'rgb(80,210,140)'; ctx.lineWidth = 9 * u;
      ctx.beginPath(); ctx.ellipse(x, y - 2 * u, 58 * u, 46 * u, 0, 0, TAU); ctx.stroke();
      ctx.globalAlpha = rb * 0.5; ctx.strokeStyle = 'rgb(150,250,190)'; ctx.lineWidth = Math.max(1, 2 * u);
      ctx.beginPath(); ctx.ellipse(x, y - 2 * u, 58 * u, 46 * u, 0, 0, TAU); ctx.stroke();
    }
    // 七盏火灯（4:5）
    ctx.globalAlpha = k * 0.85;
    ctx.fillStyle = 'rgb(255,170,80)';
    ctx.beginPath();
    for (let i = 0; i < 7; i++) tongue(ctx, x + (i - 3) * 9 * u, y + 33 * u, 1.7 * u, (5 + 1.5 * Math.sin(W.t * 6 + i)) * u, i * 1.3);
    ctx.fill();
    for (let i = 0; i < 7; i++) glowAt(ctx, SP.warm, x + (i - 3) * 9 * u, y + 31 * u, 6 * u, k * 0.4);
    // 二十四位长老：宝座四围的一圈微光
    ctx.fillStyle = 'rgb(255,236,200)';
    for (let i = 0; i < 24; i++) {
      const a = i / 24 * TAU, ex = x + Math.cos(a) * 92 * u, ey = y + 4 * u + Math.sin(a) * 34 * u;
      ctx.globalAlpha = k * (0.35 + 0.25 * Math.sin(W.t * 1.1 + i)) * (1 - hush * 0.5) * (1 - wh * 0.7);
      ctx.beginPath(); ctx.arc(ex, ey, Math.max(1, 1.3 * u), 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawGlass(ctx) {
    const k = lv('lbHeaven');
    if (k < 0.01 || !SP) return;
    const g = G('glass'), cx = g[0] * W.w, cy = g[1] * W.h, rx = g[2] * W.w, ry = Math.max(4, 0.016 * W.h), fire = lv('lbGlassFire'), u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const key = 'glass' + (cx | 0) + ':' + (rx | 0);
    let gr = GRAD[key];
    if (!gr) {
      gr = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
      gr.addColorStop(0, 'rgba(200,220,255,0)'); gr.addColorStop(0.25, 'rgba(210,228,255,0.5)'); gr.addColorStop(0.5, 'rgba(236,244,255,0.8)');
      gr.addColorStop(0.75, 'rgba(210,228,255,0.5)'); gr.addColorStop(1, 'rgba(200,220,255,0)');
      GRAD[key] = gr;
    }
    ctx.globalAlpha = k * (0.3 + 0.15 * fire);
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
    // 水晶的闪光
    ctx.strokeStyle = 'rgb(240,248,255)';
    ctx.lineWidth = Math.max(0.8, 1 * u);
    for (let i = 0; i < 12; i++) {
      const f = hsh(i * 3.7) * 2 - 1, xx = cx + f * rx * 0.86 + Math.sin(W.t * 0.3 + i) * 6 * u, yy = cy + (hsh(i * 5.1) - 0.5) * ry * 1.2;
      const L = (10 + 16 * hsh(i * 1.3)) * u * (1 - Math.abs(f) * 0.6);
      ctx.globalAlpha = k * (0.25 + 0.3 * Math.sin(W.t * 1.4 + i * 2.1) ** 2) * (1 - Math.abs(f) * 0.7);
      ctx.beginPath(); ctx.moveTo(xx - L / 2, yy); ctx.lineTo(xx + L / 2, yy); ctx.stroke();
    }
    // 其中有火搀杂（15:2）
    if (fire > 0.01) {
      ctx.fillStyle = 'rgba(255,150,70,0.8)';
      ctx.globalAlpha = k * fire * 0.7;
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const f = (i + 0.5) / 16 * 2 - 1;
        tongue(ctx, cx + f * rx * 0.9, cy + (hsh(i * 2.3) - 0.5) * ry, 2.2 * u, (5 + 4 * Math.sin(W.t * 5 + i * 1.7)) * u * (1 - Math.abs(f) * 0.5), i);
      }
      ctx.fill();
      for (let i = 0; i < 6; i++) glowAt(ctx, SP.fire, cx + (i / 5 * 2 - 1) * rx * 0.7, cy, 26 * u, k * fire * 0.28);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 宝座前的群众：站在玻璃海上的光（7:9；19:1）
  const HOST = [];
  (function () {
    let i = 0;
    for (let r = 0; r < 3; r++) { const n = 22 - r * 3; for (let j = 0; j < n; j++) { HOST.push({ f: (j + 0.5 + (hsh(i * 3.3) - 0.5) * 0.5) / n, r, s: 0.8 + 0.4 * hsh(i * 7.1), i }); i++; } }
  })();
  function drawHost(ctx) {
    const k = lv('lbHost') * lv('lbHeaven');
    if (k < 0.01 || !SP) return;
    const g = G('glass'), cx = g[0] * W.w, cy = g[1] * W.h, rx = g[2] * W.w, u = VU();
    const lx = lambPos()[0], al = G('altar')[0] * W.w;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of HOST) {
      const x = cx + (q.f * 2 - 1) * rx * (0.94 - q.r * 0.1), y = cy - q.r * 0.013 * W.h - 1;
      if (lv('lbLambGo') < 0.5 && Math.abs(x - lx) < 20 * u) continue;
      if (Math.abs(x - al) < 18 * u) continue;
      const h = (16 - q.r * 3) * u * q.s;
      lightFigure(ctx, x, y + Math.sin(W.t * 1.1 + q.i) * 0.6 * u, h, k * (0.55 + 0.25 * Math.sin(W.t * 1.3 + q.i * 1.9)) * (1 - q.r * 0.18), q.i, 'rgb(255,250,238)', 0.25);
    }
    ctx.restore();
  }
  // 金坛（8:3）与坛下的灵魂（6:9–11）
  function drawAltar(ctx) {
    const k = lv('lbAltar') * lv('lbHeaven');
    if (k < 0.01 || !SP) return;
    const [x, y] = px(G('altar')), u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - 9 * u, 28 * u, k * 0.35);
    // 金坛：宽的座、坛身、坛顶的边，四角只有小小的角——是一座坛，不是冠冕
    ctx.globalAlpha = k * 0.8;
    ctx.fillStyle = 'rgb(214,170,88)';
    ctx.beginPath();
    ctx.rect(x - 13 * u, y - 3 * u, 26 * u, 3 * u);           // 座
    ctx.rect(x - 11 * u, y - 5 * u, 22 * u, 2 * u);
    ctx.fill();
    ctx.fillStyle = 'rgb(236,196,110)';
    ctx.beginPath();
    ctx.rect(x - 8 * u, y - 15 * u, 16 * u, 10 * u);          // 坛身
    ctx.rect(x - 10.5 * u, y - 17 * u, 21 * u, 2 * u);        // 坛顶的边
    for (const s of [-1, 1]) { ctx.moveTo(x + s * 10.5 * u, y - 17 * u); ctx.lineTo(x + s * 10.5 * u, y - 18.6 * u); ctx.lineTo(x + s * 8.6 * u, y - 17 * u); ctx.closePath(); }
    ctx.fill();
    ctx.strokeStyle = 'rgb(255,236,180)'; ctx.lineWidth = Math.max(0.7, 0.8 * u); ctx.globalAlpha = k * 0.55;
    ctx.beginPath(); ctx.moveTo(x - 8 * u, y - 10 * u); ctx.lineTo(x + 8 * u, y - 10 * u); ctx.stroke();
    // 坛上一小团火，一缕香烟袅袅上升
    ctx.globalAlpha = k * 0.75; ctx.fillStyle = 'rgb(255,170,80)';
    ctx.beginPath(); tongue(ctx, x, y - 17 * u, 2.4 * u, (5 + 1.5 * Math.sin(W.t * 7)) * u, 1.3); ctx.fill();
    glowAt(ctx, SP.warm, x, y - 19 * u, 7 * u, k * 0.4);
    ctx.strokeStyle = 'rgb(236,230,220)'; ctx.lineWidth = Math.max(0.6, 0.7 * u); ctx.globalAlpha = k * 0.35;
    ctx.beginPath(); ctx.moveTo(x, y - 22 * u);
    for (let i = 1; i <= 8; i++) ctx.lineTo(x + Math.sin(W.t * 0.9 + i * 0.8) * (1 + i * 0.5) * u, y - (22 + i * 3.2) * u);
    ctx.stroke();
    // 坛下的灵魂：先是微光，后得了白衣
    const so = lv('lbSouls'), ro = lv('lbRobes');
    for (let i = 0; i < 9; i++) {
      const sx = x + (i - 4) * 8 * u, sy = y + 16 * u + (i % 2) * 3 * u;
      if (so > 0.01) glowAt(ctx, SP.pale, sx, sy - 5 * u, 6 * u, so * (1 - ro * 0.7) * (0.55 + 0.35 * Math.sin(W.t * 1.5 + i)));
      if (ro > 0.01) lightFigure(ctx, sx, sy, 13 * u, ro * 0.9 * (0.85 + 0.15 * Math.sin(W.t + i)), i * 1.7, 'rgb(252,252,255)', 0.3);
    }
    // 拿着金香炉的天使（8:3–5）
    const ce = lv('lbCenser');
    if (ce > 0.01) {
      const ax = x + 17 * u, h = 44 * u;
      lightFigure(ctx, ax, y, h, ce, 2.2, 'rgb(255,250,236)', 0.4);
      const hx = ax - 0.2 * h, hy = y - 0.52 * h, sw = Math.sin(W.t * 1.6) * 3 * u, bx = hx + sw, by = hy + 11 * u;
      ctx.globalAlpha = ce * 0.8; ctx.strokeStyle = 'rgb(255,220,150)'; ctx.lineWidth = Math.max(0.6, 0.6 * u);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(bx - 3 * u, by); ctx.moveTo(hx, hy); ctx.lineTo(bx + 3 * u, by); ctx.stroke();
      ctx.fillStyle = 'rgb(245,200,110)';
      ctx.beginPath(); ctx.moveTo(bx - 4 * u, by); ctx.quadraticCurveTo(bx, by + 6 * u, bx + 4 * u, by); ctx.closePath(); ctx.fill();
      glowAt(ctx, SP.warm, bx, by + 1 * u, 8 * u, ce * 0.6);
      // 香的烟与众圣徒的祈祷一同升到神面前（8:4）
      const p = lv('lbIncense');
      if (p > 0.01) {
        const [tx, ty] = px(G('th'));
        for (let j = 0; j < 22; j++) {
          const t = ((W.t * 0.12 + j / 22) % 1) * Math.min(1, p * 1.2);
          const mt = 1 - t, mx = lerp(bx, tx, 0.3) - 20 * u, my = lerp(by, ty, 0.6);
          const xx = mt * mt * bx + 2 * mt * t * mx + t * t * tx + Math.sin(W.t * 0.8 + j) * 6 * u * t, yy = mt * mt * by + 2 * mt * t * my + t * t * ty;
          glowAt(ctx, SP.cloud, xx, yy, (7 + 16 * t) * u, ce * 0.2 * Math.sin(Math.PI * t) * (1 - smoothstep(0.9, 1, p) * 0.5));
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 七印封严的书卷（5:1）：羔羊身旁；揭开一印，少一颗印
  function drawScroll(ctx, lx, ly, s, d) {
    const k = lv('lbScroll') * lv('lbHeaven');
    if (k < 0.01) return;
    const op = lv('lbScrollOpen'), x = lx + d * 0.72 * s, y = ly - 0.62 * s, u = s / 34;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, 0.6 * s, k * 0.35);
    ctx.globalAlpha = k * 0.85;
    ctx.fillStyle = 'rgb(250,236,200)';
    const w = lerp(0.42, 0.62, op) * s, h = lerp(0.1, 0.44, op) * s;
    ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.fill();
    ctx.fillStyle = 'rgb(255,248,224)';
    ctx.beginPath(); ctx.ellipse(x - w / 2, y, 0.05 * s, h / 2 + 0.02 * s, 0, 0, TAU); ctx.ellipse(x + w / 2, y, 0.05 * s, h / 2 + 0.02 * s, 0, 0, TAU); ctx.fill();
    if (op > 0.3) {
      ctx.strokeStyle = 'rgb(200,160,100)'; ctx.lineWidth = Math.max(0.5, 0.5 * u); ctx.globalAlpha = k * op * 0.6;
      ctx.beginPath(); for (let i = 0; i < 5; i++) { const yy = y - h / 2 + (i + 1) * h / 6; ctx.moveTo(x - w / 2 + 0.06 * s, yy); ctx.lineTo(x + w / 2 - 0.06 * s, yy); } ctx.stroke();
    }
    // 七印
    if (op < 0.5) {
      for (let i = S.seals; i < 7; i++) {
        const sx = x - w / 2 + (i + 0.5) * w / 7, sy = y + h / 2 + 0.02 * s;
        ctx.globalAlpha = k * (1 - op * 2);
        ctx.fillStyle = 'rgb(226,90,60)';
        ctx.beginPath(); ctx.arc(sx, sy, Math.max(1, 0.028 * s), 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function scrollPt() { const [lx, ly] = lambPos(), s = lambSize(); return [lx - 0.72 * s, ly - 0.62 * s]; }
  function drawLambSky(ctx) {
    const k = lv('lbLamb');
    if (k < 0.01) return;
    const [x, y, g] = lambPos(), s = lambSize();
    if (g < 0.02) { drawLambAt(ctx, x, y, s, k * lv('lbHeaven'), -1, lv('lbLambGlow')); drawScroll(ctx, x, y, s, -1); }
  }
  function drawLambMove(ctx) {
    const k = lv('lbLamb');
    if (k < 0.01) return;
    const [x, y, g] = lambPos();
    if (g >= 0.02 && g <= 0.98) drawLambAt(ctx, x, y, lambSize(), k, -1, 0.6 + lv('lbLambGlow'));
  }
  function drawLambZion(ctx) {
    const k = lv('lbLamb');
    if (k < 0.01) return;
    const [x, y, g] = lambPos();
    if (g > 0.98) drawLambAt(ctx, x, y, lambSize(), k, -1, 0.5 * lv('lbLambGlow'));
  }

  // ════════════════════════════════════════════════════════════
  //  画：四匹马（6:1–8）——有色的风与光
  // ════════════════════════════════════════════════════════════
  const RIDERS = [
    { col: [252, 250, 255], trail: 'pale' },
    { col: [240, 90, 64], trail: 'red' },
    { col: [34, 32, 50], trail: 'blue', dark: true, rim: [190, 190, 230] },
    { col: [168, 196, 172], trail: 'pale' },
  ];
  function ridePt(i, p) {
    const a = px(G('ride0')), ey = G('rideY')[i] * W.h, ex = -0.14 * W.w;
    const e = p;
    return [lerp(a[0], ex, e), lerp(a[1], ey, e) - Math.sin(Math.PI * e) * 0.05 * W.h];
  }
  function drawRiders(ctx) {
    if (!SP) return;
    const u = VU(), k = (PORT ? 1.25 : 1.65) * u;
    for (let i = 0; i < 4; i++) {
      const p = lv('lbRide' + (i + 1));
      if (p <= 0.001 || p >= 0.999) continue;
      const R = RIDERS[i], [x, y] = ridePt(i, p), a = smoothstep(0, 0.08, p) * (1 - smoothstep(0.85, 1, p));
      ctx.save();
      // 风的尾迹
      ctx.globalCompositeOperation = 'lighter';
      for (let j = 1; j <= 9; j++) {
        const q = p - j * 0.018;
        if (q <= 0) break;
        const [tx, ty] = ridePt(i, q);
        glowAt(ctx, SP[R.trail] || SP.pale, tx + j * 3 * u, ty - 18 * k, (16 - j) * k * 1.2, a * 0.2 * (1 - j / 10));
      }
      ctx.strokeStyle = R.dark ? 'rgb(150,150,200)' : rgba(R.col, 1);
      ctx.lineWidth = Math.max(0.8, 0.9 * u);
      for (let j = 0; j < 5; j++) {
        const q0 = p - 0.01, q1 = p - 0.07 - j * 0.02;
        if (q1 <= 0) continue;
        const [x0, y0] = ridePt(i, q0), [x1, y1] = ridePt(i, q1), off = (j - 2) * 5 * k;
        ctx.globalAlpha = a * 0.3 * (1 - j * 0.15);
        ctx.beginPath(); ctx.moveTo(x0 + 10 * k, y0 - 20 * k + off); ctx.quadraticCurveTo((x0 + x1) / 2, (y0 + y1) / 2 - 20 * k + off + Math.sin(W.t * 3 + j) * 3 * k, x1, y1 - 20 * k + off * 1.5); ctx.stroke();
      }
      if (!R.dark) glowAt(ctx, SP.white, x, y - 22 * k, 26 * k, a * 0.3);
      else glowAt(ctx, SP.blue, x, y - 22 * k, 24 * k, a * 0.25);
      // 灰色马之后：阴府也随着他——一缕暗影
      if (i === 3) { ctx.globalCompositeOperation = 'source-over'; for (let j = 0; j < 6; j++) { const [tx, ty] = ridePt(i, Math.max(0, p - 0.03 - j * 0.02)); glowAt(ctx, SP.smoke, tx + 10 * k, ty - 14 * k, 16 * k, a * 0.35); } }
      lightHorse(ctx, x, y, k, -1, W.t * 10 + i * 1.3, 1, R.col, a * (R.dark ? 0.92 : 0.85), { dark: R.dark, rim: R.rim });
      // 白马：弓与冠冕；黑马：手里拿着天平
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineWidth = Math.max(0.7, 0.9 * k * 0.6);
      if (i === 0) {
        ctx.strokeStyle = 'rgb(255,226,150)'; ctx.globalAlpha = a * 0.9;
        ctx.beginPath(); ctx.arc(x - 6 * k, y - 29 * k, 5 * k, -Math.PI * 0.55, Math.PI * 0.55, true); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x - 3.2 * k, y - 40.5 * k); ctx.lineTo(x - 1.8 * k, y - 43 * k); ctx.lineTo(x + 0.4 * k, y - 41 * k); ctx.lineTo(x + 2.2 * k, y - 43.2 * k); ctx.lineTo(x + 3.2 * k, y - 40.5 * k); ctx.stroke();
      } else if (i === 2) {
        ctx.strokeStyle = 'rgb(210,210,240)'; ctx.globalAlpha = a * 0.85;
        const bx = x - 6 * k, by = y - 30 * k;
        ctx.beginPath(); ctx.moveTo(bx - 3.5 * k, by); ctx.lineTo(bx + 3.5 * k, by); ctx.moveTo(bx, by - 2 * k); ctx.lineTo(bx, by);
        ctx.moveTo(bx - 3.5 * k, by); ctx.lineTo(bx - 4.5 * k, by + 3 * k); ctx.lineTo(bx - 2.5 * k, by + 3 * k); ctx.closePath();
        ctx.moveTo(bx + 3.5 * k, by); ctx.lineTo(bx + 2.5 * k, by + 3 * k); ctx.lineTo(bx + 4.5 * k, by + 3 * k); ctx.closePath(); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：第六印（日头黑如毛布，月红如血，星辰坠落）、四风、七位天使
  // ════════════════════════════════════════════════════════════
  function drawSigns(ctx) {
    const k = lv('lbSigns');
    if (k < 0.01 || !SP) return;
    const u = VU(), [sx, sy] = px(G('sun')), r = 20 * u;
    // 满月变红像血：就在世上那个月亮的地方（它渐渐隐去，红月在原处显出）
    const up = W.moon && W.moon.elev > 0.02 && W.moon.y < W.horizonY - 0.03 * W.h;
    const [mx, my] = up ? [W.moon.x, W.moon.y] : px(G('moon')), mr = Math.max(10, 0.023 * M()) * 1.05;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.ember, sx, sy, r * 3, k * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k * 0.95;
    ctx.fillStyle = 'rgb(16,12,11)';
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgb(58,40,32)'; ctx.lineWidth = Math.max(0.6, 0.7 * u); ctx.globalAlpha = k * 0.6;
    ctx.beginPath(); for (let i = -3; i <= 3; i++) { ctx.moveTo(sx - r * 0.8, sy + i * r * 0.24); ctx.lineTo(sx + r * 0.8, sy + i * r * 0.24 + r * 0.05); } ctx.stroke();
    ctx.strokeStyle = 'rgb(150,70,40)'; ctx.globalAlpha = k * 0.7; ctx.lineWidth = Math.max(0.8, 1.2 * u);
    ctx.beginPath(); ctx.arc(sx, sy, r + 0.5, 0, TAU); ctx.stroke();
    // 月红如血
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.red, mx, my, mr * 3.4, k * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgb(168,42,30)';
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgb(120,26,22)'; ctx.globalAlpha = k * 0.5;
    ctx.beginPath(); ctx.arc(mx + 0.27 * mr, my - 0.2 * mr, 0.27 * mr, 0, TAU); ctx.arc(mx - 0.33 * mr, my + 0.27 * mr, 0.2 * mr, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawStarfall(ctx) {
    const p = lv('lbStarfall');
    if (p <= 0.001 || p >= 0.999) return;
    const u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < 30; i++) {
      const t0 = hsh(i * 3.3) * 0.66, q = (p - t0) / 0.3;
      if (q <= 0 || q >= 1) continue;
      const sx = (0.04 + 0.92 * hsh(i * 7.1)) * W.w, sy = (PORT ? 0.3 + 0.12 * hsh(i * 1.7) : 0.04 + 0.3 * hsh(i * 1.7)) * W.h;
      const ex = sx - (0.04 + 0.08 * hsh(i * 2.9)) * W.w, ey = W.horizonY + (0.02 + 0.3 * hsh(i * 5.3)) * W.h;
      const e = eIn(q), x = lerp(sx, ex, e), y = lerp(sy, ey, e);
      const dx = ex - sx, dy = ey - sy, L = Math.hypot(dx, dy) || 1, tl = (18 + 30 * e) * u;
      ctx.globalAlpha = Math.sin(Math.PI * q) * 0.9;
      ctx.strokeStyle = 'rgb(255,244,220)';
      ctx.lineWidth = Math.max(0.8, 1.4 * u);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dx / L * tl, y - dy / L * tl); ctx.stroke();
      glowAt(ctx, SP.gold, x, y, 5 * u, Math.sin(Math.PI * q) * 0.8);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawFour(ctx) {
    const k = lv('lbFour');
    if (k < 0.01 || !SP) return;
    const u = VU(), h = (PORT ? 40 : 56) * u;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    G('four').forEach((q, i) => {
      const [x, y] = px(q), d = q[0] < 0.5 ? 1 : -1, bob = Math.sin(W.t * 0.9 + i * 1.7) * 2 * u;
      lightFigure(ctx, x, y + bob, h, k * 0.9, i * 2.3, 'rgb(250,250,255)', 0.4);
      // 手中执掌的风：一团静下来的旋
      const wx = x + d * 0.28 * h, wy = y + bob - 0.62 * h;
      ctx.strokeStyle = 'rgb(196,220,255)';
      ctx.lineWidth = Math.max(0.8, 1.1 * u);
      for (let j = 0; j < 3; j++) {
        const a0 = W.t * 0.25 + j * TAU / 3;
        ctx.globalAlpha = k * 0.55;
        ctx.beginPath(); ctx.arc(wx, wy, (5 + j * 2.6) * u, a0, a0 + 2.2); ctx.stroke();
      }
      glowAt(ctx, SP.blue, wx, wy, 14 * u, k * 0.35);
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function sevenPt(i) { const s = G('seven'); return [lerp(s[0], s[1], i / 6) * W.w, s[2] * W.h]; }
  const sevenH = () => (PORT ? 42 : 56) * VU();
  function drawSeven(ctx) {
    const k = lv('lbSeven');
    if (k < 0.01 || !SP) return;
    const u = VU(), h = sevenH(), thx = G('th')[0] * W.w, bw = lv('lbBowls');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const [x, y0] = sevenPt(i), y = y0 + Math.sin(W.t * 0.8 + i * 0.9) * 2 * u, d = x < thx ? -1 : 1;
      lightFigure(ctx, x, y, h, k * 0.9, i * 1.9, 'rgb(255,251,240)', 0.35);
      if (!S.bowls) {
        // 号
        const blown = i < S.blown, mx = x + d * 0.05 * h, my = y - 0.84 * h, ex = x + d * 0.34 * h, ey = y - 1.02 * h;
        ctx.globalAlpha = k * (blown ? 1 : 0.75);
        ctx.strokeStyle = 'rgb(250,210,120)'; ctx.lineWidth = Math.max(0.8, 1.2 * u);
        ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.fillStyle = 'rgb(255,220,140)';
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + d * 3 * u - 2.5 * u * 0.5, ey - 3 * u); ctx.lineTo(ex + d * 3 * u + 2.5 * u, ey + 1.5 * u); ctx.closePath(); ctx.fill();
        if (blown) glowAt(ctx, SP.gold, ex, ey, 9 * u, k * 0.55);
      } else {
        // 金碗；倒下的暗红的光（16:1–17）
        const q = clamp(bw * 7.8 - i, 0, 1), tilt = Math.sin(Math.PI * q) * 0.9 * d;
        const bx = x + d * 0.12 * h, by = y - 0.55 * h;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(tilt);
        ctx.globalAlpha = k * 0.9; ctx.fillStyle = 'rgb(246,200,110)';
        ctx.beginPath(); ctx.moveTo(-5 * u, 0); ctx.quadraticCurveTo(0, 6 * u, 5 * u, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
        glowAt(ctx, SP.gold, bx, by, 7 * u, k * 0.4);
        if (q > 0.02 && q < 0.98) {
          const sa = Math.sin(Math.PI * q) * k, sx = bx + d * 5 * u, ty = W.horizonY + 0.02 * W.h;
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgb(170,40,40)'; ctx.lineWidth = Math.max(1, 3 * u);
          ctx.globalAlpha = sa * 0.45;
          ctx.beginPath(); ctx.moveTo(sx, by); ctx.quadraticCurveTo(sx + d * 12 * u, lerp(by, ty, 0.4), sx + d * 6 * u, lerp(by, ty, eOut(q * 1.3))); ctx.stroke();
          glowAt(ctx, SP.red, sx + d * 6 * u, lerp(by, ty, eOut(q * 1.3)), 14 * u, sa * 0.35);
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：无底坑与坑里的烟（9:1–2）、大力的天使（10:1–7）、世上的国（11:15）
  // ════════════════════════════════════════════════════════════
  function pitPt() { const f = G('pit'); return [f * W.w, gY(2, f) + 2]; }
  const pitW = () => (PORT ? 22 : 40) * VU();
  function drawPit(ctx) {
    const k = lv('lbPit');
    if (k < 0.01 || !SP) return;
    const [x, y] = pitPt(), w = pitW(), h = w * 0.3, sl = lv('lbSealPit');
    ctx.save();
    ctx.globalAlpha = k * 0.95;
    ctx.fillStyle = 'rgb(10,6,8)';
    ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([96, 78, 60], 2, 0.9); ctx.lineWidth = Math.max(1, 1.6 * VU());
    ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, Math.PI, TAU); ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.ember, x, y, w * 0.8, k * 0.35 * (1 - sl) * (0.7 + 0.3 * Math.sin(W.t * 2)), 0.35);
    // 用印封上（20:3）
    if (sl > 0.01) {
      glowAt(ctx, SP.gold, x, y, w * 1.5, sl * 0.45, 0.45);
      ctx.globalAlpha = sl * 0.9;
      ctx.strokeStyle = 'rgb(255,226,150)'; ctx.lineWidth = Math.max(1, 1.8 * VU());
      ctx.beginPath(); ctx.ellipse(x, y, w * 0.95, h * 0.95, 0, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgb(255,236,190)';
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + 0.3; ctx.beginPath(); ctx.arc(x + Math.cos(a) * w * 0.62, y + Math.sin(a) * h * 0.62, Math.max(1, 1.5 * VU()), 0, TAU); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(x, y, w * 0.22, h * 0.3, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawSmoke(ctx) {
    const p = lv('lbSmoke'), a = lv('lbSmokeA');
    if (p < 0.005 || a < 0.01 || !SP) return;
    const [x0, y0] = pitPt(), u = VU();
    ctx.save();
    for (let j = 0; j < 46; j++) {
      const t = j / 46;
      if (t > p * 1.25) break;
      const y = lerp(y0 - 6 * u, W.h * 0.02, Math.pow(t, 0.85));
      const spread = Math.pow(t, 1.4) * W.w * 0.65;
      const x = x0 + Math.sin(j * 1.7 + W.t * 0.35) * spread * 0.45 + (hsh(j * 2.3) - 0.45) * spread;
      const r = lerp(16, 130, Math.pow(t, 0.9)) * u;
      glowAt(ctx, SP.smoke, x, y, r, a * 0.5 * (1 - t * 0.3));
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.ember, x0, y0 - 10 * u, 30 * u, a * 0.3);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function mightyGeom() {
    const m = G('mighty'), rx = m[0] * W.w, lx = m[1] * W.w;
    const ry = W.horizonY + 0.006 * W.h, ly = Math.min(gY(0, m[1]), W.waterlineY(0) - 1) + 1;
    // 从天降下：来时自上而下，去时升回天上
    const k = lv('lbMighty'), lift = (1 - eOut(k)) * 0.16 * W.h;
    const cx = (rx + lx) / 2, fy = (ry + ly) / 2, headY = W.h * (PORT ? 0.36 : 0.15);
    const H = fy - headY;
    return { rx, ry: ry - lift, lx, ly: ly - lift, cx, fy: fy - lift, H, head: headY + 0.06 * H - lift, knee: fy - 0.3 * H - lift, sh: fy - 0.8 * H - lift, k };
  }
  // 大力的天使（10:1–2）：披着云彩，头上有虹，脸面像日头，两脚像火柱；右脚踏海，左脚踏地——站在地平线上
  // 全身只是光与云（加亮），没有实的形体：光的长衣垂到膝，膝下两道柔和的火柱
  function drawMighty(ctx) {
    const k = lv('lbMighty');
    if (k < 0.01 || !SP) return;
    const g = mightyGeom(), H = g.H, oath = lv('lbOath');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, g.cx, g.sh + 0.2 * H, H * 0.6, k * 0.2);
    // 两脚像火柱：膝下到脚，一串柔和的光（白的芯、橙的焰、渐渐透明）
    for (const [fx0, fy0, sgn] of [[g.rx, g.ry, -1], [g.lx, g.ly, 1]]) {
      const kx = g.cx + sgn * 0.05 * H, ky = g.knee;
      const LN = Math.max(10, Math.round(Math.hypot(fx0 - kx, fy0 - ky) / Math.max(3, 0.018 * H)));
      for (let i = 0; i <= LN; i++) {
        const t = i / LN, x = lerp(kx, fx0, t) + Math.sin(W.t * 5 + i * 0.7 + sgn) * 0.003 * H, y = lerp(ky, fy0, t);
        const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + i * 1.1 + sgn);
        glowAt(ctx, SP.fire, x, y, (0.05 + 0.014 * t) * H * fl, k * 0.16 * (0.55 + 0.45 * t));
        glowAt(ctx, SP.amber, x, y, 0.036 * H * fl, k * 0.2);
        glowAt(ctx, SP.white, x, y, 0.02 * H, k * 0.26 * (1 - 0.4 * t));
      }
      // 脚下的火苗
      for (let j = 0; j < 3; j++) {
        const q = (W.t * 0.9 + j / 3 + (sgn > 0 ? 0.4 : 0)) % 1;
        glowAt(ctx, SP.fire, fx0 + (j - 1) * 0.02 * H, fy0 - q * 0.08 * H, (0.03 - 0.02 * q) * H, k * 0.5 * (1 - q));
      }
      glowAt(ctx, SP.warm, fx0, fy0 - 0.01 * H, 0.09 * H, k * 0.35, 0.5);
    }
    // 披着云彩：一件光与云的长衣，从肩垂到膝，上窄下宽
    const sw = Math.sin(W.t * 0.8) * 0.006 * H;
    const key = 'mighty' + (g.sh | 0) + ':' + (g.knee | 0);
    let gr = GRAD[key];
    if (!gr) {
      gr = ctx.createLinearGradient(0, g.sh - 0.04 * H, 0, g.knee + 0.04 * H);
      gr.addColorStop(0, 'rgba(255,250,238,0.55)'); gr.addColorStop(0.55, 'rgba(255,248,232,0.34)'); gr.addColorStop(1, 'rgba(255,244,226,0)');
      GRAD[key] = gr;
    }
    ctx.globalAlpha = k;
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(g.cx - 0.07 * H, g.sh - 0.02 * H);
    ctx.quadraticCurveTo(g.cx, g.sh - 0.06 * H, g.cx + 0.07 * H, g.sh - 0.02 * H);
    ctx.quadraticCurveTo(g.cx + 0.12 * H + sw, lerp(g.sh, g.knee, 0.5), g.cx + 0.15 * H + sw, g.knee + 0.04 * H);
    ctx.quadraticCurveTo(g.cx, g.knee + 0.08 * H, g.cx - 0.15 * H + sw, g.knee + 0.04 * H);
    ctx.quadraticCurveTo(g.cx - 0.12 * H + sw, lerp(g.sh, g.knee, 0.5), g.cx - 0.07 * H, g.sh - 0.02 * H);
    ctx.closePath(); ctx.fill();
    for (let i = 0; i < 22; i++) {
      const t = hsh(i * 3.7), side = hsh(i * 8.3) * 2 - 1, yy = lerp(g.sh + 0.02 * H, g.knee + 0.02 * H, t);
      const wd = lerp(0.07, 0.14, t) * H;
      const xx = g.cx + side * wd * 0.85 + Math.sin(W.t * 0.4 + i) * 0.008 * H;
      glowAt(ctx, SP.cloud, xx, yy, (0.04 + 0.03 * hsh(i * 2.9)) * H, k * (0.26 + 0.12 * (1 - t)));
    }
    // 两臂：只是光——右手渐渐举起向天（10:5），左手拿着展开的小书卷（一点金光）
    const shR = [g.cx - 0.075 * H, g.sh + 0.02 * H], shL = [g.cx + 0.075 * H, g.sh + 0.02 * H];
    const hand = [lerp(g.cx - 0.17 * H, g.cx - 0.13 * H, oath), lerp(g.sh + 0.22 * H, g.sh - 0.24 * H, oath)];
    const sc = [g.cx + 0.17 * H, g.sh + 0.18 * H];
    for (const [a0, a1] of [[shR, hand], [shL, sc]]) {
      for (let i = 0; i <= 10; i++) { const t = i / 10; glowAt(ctx, SP.cloud, lerp(a0[0], a1[0], t), lerp(a0[1], a1[1], t), (0.045 - 0.014 * t) * H, k * 0.26); }
    }
    glowAt(ctx, SP.white, hand[0], hand[1], 0.035 * H * (1 + oath), k * (0.5 + 0.4 * oath));
    glowAt(ctx, SP.gold, sc[0], sc[1], 0.05 * H, k * 0.55);
    glowAt(ctx, SP.white, sc[0], sc[1], 0.016 * H, k * 0.9);
    // 脸面像日头
    glowAt(ctx, SP.amber, g.cx, g.head, 0.34 * H, k * 0.38);
    glowAt(ctx, SP.gold, g.cx, g.head, 0.16 * H, k * 0.6);
    glowAt(ctx, SP.white, g.cx, g.head, 0.06 * H, k);
    ctx.strokeStyle = 'rgb(255,236,190)'; ctx.lineWidth = Math.max(0.8, 0.004 * H);
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * TAU + W.t * 0.05, r0 = 0.065 * H, r1 = (0.12 + 0.035 * Math.sin(W.t * 2 + i)) * H;
      ctx.globalAlpha = k * 0.35;
      ctx.beginPath(); ctx.moveTo(g.cx + Math.cos(a) * r0, g.head + Math.sin(a) * r0); ctx.lineTo(g.cx + Math.cos(a) * r1, g.head + Math.sin(a) * r1); ctx.stroke();
    }
    // 头上有虹
    const RB = [[255, 90, 80], [255, 180, 70], [250, 240, 110], [110, 230, 140], [110, 170, 255], [170, 120, 240]];
    ctx.lineWidth = Math.max(1, 0.01 * H);
    RB.forEach((c, i) => {
      ctx.globalAlpha = k * 0.4;
      ctx.strokeStyle = rgba(c, 1);
      ctx.beginPath(); ctx.arc(g.cx, g.head + 0.03 * H, 0.18 * H + i * 0.01 * H, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawKingdom(ctx) {
    const k = lv('lbKingdom');
    if (k < 0.01 || !SP) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 金色的光从宝座直铺下来，照遍全地
    const [tx, ty] = px(G('th'));
    const key = 'kingdom' + (ty | 0) + ':' + (W.h | 0);
    let gr = GRAD[key];
    if (!gr) {
      gr = ctx.createLinearGradient(0, ty, 0, W.h);
      gr.addColorStop(0, 'rgba(255,226,160,0)'); gr.addColorStop(0.18, 'rgba(255,226,160,0.5)');
      gr.addColorStop(0.7, 'rgba(255,214,140,0.32)'); gr.addColorStop(1, 'rgba(255,214,140,0.12)');
      GRAD[key] = gr;
    }
    ctx.fillStyle = gr;
    const x0 = (PORT ? 0.3 : 0.52) * W.w, x1 = 1.04 * W.w, N = PORT ? 7 : 9, rk = smoothstep(0.35, 1, k) * (1 - 0.6 * nightK());
    for (let i = 0; rk > 0.01 && i < N; i++) {
      const f = (i + 0.5) / N, bx = lerp(x0, x1, f), sp = (x1 - x0) / N * 0.28 * (1 + 0.2 * Math.sin(W.t * 0.6 + i * 1.7));
      ctx.globalAlpha = rk * 0.34 * (0.7 + 0.3 * Math.sin(W.t * 0.9 + i * 2.3));
      ctx.beginPath(); ctx.moveTo(tx - 3, ty + 20); ctx.lineTo(tx + 3, ty + 20); ctx.lineTo(bx + sp, W.h + 4); ctx.lineTo(bx - sp, W.h + 4); ctx.closePath(); ctx.fill();
    }
    glowAt(ctx, SP.gold, W.w * 0.72, W.h * 0.84, W.w * 0.62, k * 0.38, 0.42);
    glowAt(ctx, SP.amber, W.w * 0.8, W.h * 0.7, W.w * 0.4, k * 0.16, 0.5);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：妇人与龙（12:1–6）、天上的争战（12:7–9）
  // ════════════════════════════════════════════════════════════
  function womanPos() {
    const f = ease(lv('lbFlee')), a = G('woman'), b = G('refuge');
    return [lerp(a[0], b[0], f) * W.w, lerp(a[1], b[1], f) * W.h - Math.sin(Math.PI * f) * 0.06 * W.h, lerp(1, 0.22, f)];
  }
  const womanH = () => (PORT ? 64 : 96) * VU();
  function drawWoman(ctx) {
    const k = lv('lbWoman') * (1 - smoothstep(0.9, 1, lv('lbFlee')));
    if (k < 0.01 || !SP) return;
    const [x, y, sc] = womanPos(), h = womanH() * sc, u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 身披日头
    glowAt(ctx, SP.amber, x, y - 0.55 * h, h * 1.6, k * 0.3);
    glowAt(ctx, SP.gold, x, y - 0.55 * h, h * 0.9, k * 0.55);
    ctx.strokeStyle = 'rgb(255,220,150)'; ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (let i = 0; i < 20; i++) {
      const a = i / 20 * TAU + W.t * 0.04, r0 = 0.5 * h, r1 = (0.8 + 0.15 * Math.sin(W.t * 1.7 + i * 2.3)) * h;
      ctx.globalAlpha = k * 0.3;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y - 0.55 * h + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y - 0.55 * h + Math.sin(a) * r1); ctx.stroke();
    }
    // 光的衣袍：头、肩、蒙头的纱垂到背后（没有面目）
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgb(255,248,230)';
    const sw = Math.sin(W.t * 1.2) * 0.02 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.23 * h, y);
    ctx.quadraticCurveTo(x - 0.16 * h + sw, y - 0.36 * h, x - 0.15 * h, y - 0.64 * h);
    ctx.quadraticCurveTo(x - 0.145 * h, y - 0.74 * h, x - 0.055 * h, y - 0.765 * h);
    ctx.lineTo(x + 0.055 * h, y - 0.765 * h);
    ctx.quadraticCurveTo(x + 0.145 * h, y - 0.74 * h, x + 0.15 * h, y - 0.64 * h);
    ctx.quadraticCurveTo(x + 0.16 * h + sw, y - 0.36 * h, x + 0.23 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.072 * h, y - 0.855 * h); ctx.arc(x, y - 0.855 * h, 0.072 * h, 0, TAU);
    ctx.fill();
    // 纱：盖住头顶，从两边垂到肩后
    ctx.fillStyle = 'rgb(214,226,252)';
    ctx.globalAlpha = k * 0.92;
    ctx.beginPath();
    ctx.moveTo(x - 0.088 * h, y - 0.84 * h);
    ctx.quadraticCurveTo(x - 0.1 * h, y - 0.955 * h, x, y - 0.965 * h);
    ctx.quadraticCurveTo(x + 0.1 * h, y - 0.955 * h, x + 0.088 * h, y - 0.84 * h);
    ctx.quadraticCurveTo(x + 0.12 * h, y - 0.7 * h, x + 0.19 * h + sw, y - 0.44 * h);
    ctx.lineTo(x + 0.15 * h + sw, y - 0.45 * h);
    ctx.quadraticCurveTo(x + 0.1 * h, y - 0.66 * h, x + 0.062 * h, y - 0.83 * h);
    ctx.quadraticCurveTo(x, y - 0.9 * h, x - 0.062 * h, y - 0.83 * h);
    ctx.quadraticCurveTo(x - 0.1 * h, y - 0.66 * h, x - 0.15 * h + sw, y - 0.45 * h);
    ctx.lineTo(x - 0.19 * h + sw, y - 0.44 * h);
    ctx.quadraticCurveTo(x - 0.12 * h, y - 0.7 * h, x - 0.088 * h, y - 0.84 * h);
    ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    // 脚踏月亮
    ctx.fillStyle = 'rgb(226,234,255)'; ctx.globalAlpha = k * 0.9;
    ctx.beginPath();
    ctx.arc(x, y - 0.06 * h, 0.26 * h, Math.PI * 0.12, Math.PI * 0.88);
    ctx.arc(x, y - 0.14 * h, 0.27 * h, Math.PI * 0.84, Math.PI * 0.16, true);
    ctx.closePath(); ctx.fill();
    glowAt(ctx, SP.pale, x, y + 0.1 * h, 0.3 * h, k * 0.4);
    // 头戴十二星的冠冕
    for (let i = 0; i < 12; i++) {
      const a = Math.PI * (1.12 + 0.76 * i / 11), sx = x + Math.cos(a) * 0.2 * h, sy = y - 1.0 * h + Math.sin(a) * 0.09 * h - 0.03 * h;
      glowAt(ctx, SP.white, sx, sy, Math.max(2, 0.035 * h), k * (0.8 + 0.2 * Math.sin(W.t * 3 + i)));
    }
    ctx.restore();
    // 孩子被提到神宝座那里（12:5）
    const c = lv('lbChild');
    if (c > 0.001 && c < 0.999) {
      const [wx, wy] = [x, y - 0.55 * h], [tx, ty] = px(G('th')), e = ease(c), mt = 1 - e;
      const mx = lerp(wx, tx, 0.3), my = Math.min(wy, ty) - 0.06 * W.h;
      const cx = mt * mt * wx + 2 * mt * e * mx + e * e * tx, cy = mt * mt * wy + 2 * mt * e * my + e * e * ty;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, cx, cy, 10 * u, 0.95);
      glowAt(ctx, SP.gold, cx, cy, 26 * u, 0.5);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawRefuge(ctx) {
    const k = lv('lbRefuge');
    if (k < 0.01 || !SP) return;
    const f = G('refuge'), x = f[0] * W.w, y = Math.min(f[1] * W.h, gY(0, f[0]) + 1), u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y - 5 * u, 22 * u, k * (0.45 + 0.1 * Math.sin(W.t * 1.3)));
    lightFigure(ctx, x, y, 11 * u, k * 0.9, 5.5, 'rgb(255,246,226)', 0.3);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 龙：红黑的暗烟聚成的一道，不画形体；尾巴拖拉着星辰（12:3–4）
  function dragonC() {
    const d = G('dragon'), war = ease(lv('lbWar')), cs = lv('lbCast');
    let x = d[0] * W.w + war * 0.04 * W.w, y = d[1] * W.h - war * 0.03 * W.h;
    if (cs > 0) { const hz = hazeBase(), e = eIn(cs); x = lerp(x, hz[0], e); y = lerp(y, hz[1] - 0.02 * W.h, e); }
    return [x, y, 1 - 0.55 * cs * (PORT ? 1 : 1.2)];
  }
  // 龙被摔下之处：桌面在中丘的海边沙上（经文之右），竖屏在近岸
  function hazeBase() {
    const hz = G('haze'), x = hz[0] * W.w;
    return [x, hz[1] < 0 ? gY(1, hz[0]) - 2 : hz[1] * W.h];
  }
  const hazeK = () => (PORT ? 1 : 0.72);   // 在中丘上显得小些
  const STARS3 = [];
  for (let i = 0; i < 22; i++) STARS3.push({ fx: hsh(i * 4.1), fy: hsh(i * 6.7), t: 0.15 + 0.6 * hsh(i * 2.9), i });
  function dragonPts() {
    const [cx, cy, sc] = dragonC(), u = VU() * sc, L = (PORT ? 150 : 250) * u, sw = lv('lbSweep');
    const pts = [];
    const N = 24;
    for (let j = 0; j <= N; j++) {
      const t = j / N;
      let x = cx - L * 0.42 + t * L * 0.95, y = cy + Math.sin(t * TAU * 1.3 + W.t * 0.5) * 0.09 * L * (1 - 0.3 * t);
      if (t > 0.55) { const q = (t - 0.55) / 0.45; y -= Math.sin(Math.PI * sw) * 0.5 * L * q * q; x -= Math.sin(Math.PI * sw) * 0.25 * L * q * q; }
      pts.push([x, y, lerp(0.14, 0.03, t) * L, t]);
    }
    return pts;
  }
  function drawDragon(ctx) {
    const k = lv('lbDragon') * (1 - smoothstep(0.75, 1, lv('lbCast'))) * (1 - lv('lbWar') * 0.35);
    const sw = lv('lbSweep');
    if (!SP) return;
    // 天上的星辰（龙的尾巴拖拉着它们，摔在地上）
    const sa = lv('lbDragon') * (1 - smoothstep(0.6, 1, lv('lbCast')));
    if (sa > 0.01) {
      const [cx, cy] = dragonC(), u = VU(), R = (PORT ? 0.3 : 0.22) * W.w;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (const q of STARS3) {
        const x0 = cx + (q.fx - 0.5) * R * 2, y0 = cy - (0.05 + q.fy * 0.22) * W.h;
        const f = clamp((sw - q.t) / 0.25, 0, 1);
        if (f >= 1) continue;
        const e = eIn(f), x = lerp(x0, x0 - 0.06 * W.w, e), y = lerp(y0, W.horizonY + 0.05 * W.h, e);
        if (f > 0) { ctx.strokeStyle = 'rgb(255,240,210)'; ctx.globalAlpha = sa * 0.6 * (1 - f); ctx.lineWidth = Math.max(0.8, 1.2 * u); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.01 * W.w, y - 22 * u); ctx.stroke(); }
        glowAt(ctx, SP.white, x, y, 3.2 * u, sa * (0.7 + 0.3 * Math.sin(W.t * 2.3 + q.i)) * (1 - f * 0.6));
      }
      ctx.restore();
    }
    if (k < 0.01) return;
    const pts = dragonPts();
    ctx.save();
    for (let j = pts.length - 1; j >= 0; j--) {
      const [x, y, r] = pts[j];
      glowAt(ctx, SP.smoke, x + Math.sin(W.t * 0.7 + j) * r * 0.1, y, r * 1.7, k * 0.75);
    }
    ctx.globalCompositeOperation = 'lighter';
    // 被摔下时：红黑的边烧亮，夜里也看得见它坠落
    const fall = Math.sin(Math.PI * clamp(lv('lbCast'), 0, 1));
    for (let j = 0; j < pts.length; j += 2) { const [x, y, r] = pts[j]; glowAt(ctx, SP.ember, x, y, r * (1.1 + 0.4 * fall), k * (0.3 + 0.5 * fall) * (1 - pts[j][3] * 0.6)); }
    if (fall > 0.02) for (let j = 0; j < pts.length; j += 3) { const [x, y, r] = pts[j]; glowAt(ctx, SP.red, x, y - r * 0.5, r * 0.6, k * 0.45 * fall); }
    // 七个暗红的光、十点火星（只是光，不画头角）
    const [hx, hy, hr] = pts[0];
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.75 + 0.5 * i / 6) + Math.sin(W.t * 0.8 + i) * 0.05;
      glowAt(ctx, SP.red, hx + Math.cos(a) * hr * 1.1, hy + Math.sin(a) * hr * 0.9 - hr * 0.2, hr * 0.35, k * (0.35 + 0.2 * Math.sin(W.t * 2 + i)));
    }
    ctx.fillStyle = 'rgb(255,90,60)';
    for (let i = 0; i < 10; i++) {
      const a = Math.PI * (1.1 + 0.8 * i / 9), sx = hx + Math.cos(a) * hr * 1.5, sy = hy + Math.sin(a) * hr * 1.2 - hr * 0.3;
      ctx.globalAlpha = k * (0.4 + 0.3 * Math.sin(W.t * 3.1 + i * 1.7));
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.8, 1.1 * VU()), 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function michaelPt() {
    const war = ease(lv('lbWar')), m = G('mich');
    return [lerp(m[0], m[2], war) * W.w, lerp(m[1], m[3], war) * W.h];
  }
  function drawWar(ctx) {
    const k = lv('lbMichael');
    if (k < 0.01 || !SP) return;
    const [mx, my] = michaelPt(), u = VU(), h = (PORT ? 58 : 84) * u, cs = lv('lbCast');
    const [dx, dy] = dragonC();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 光压退黑烟
    const push = k * (1 - cs) * Math.min(1, lv('lbWar') * 3);
    if (push > 0.01) {
      ctx.strokeStyle = 'rgb(255,246,220)'; ctx.lineWidth = Math.max(1, 1.4 * u);
      for (let i = 0; i < 9; i++) {
        const oy = (i - 4) * 9 * u, t = (W.t * 0.8 + i * 0.37) % 1;
        ctx.globalAlpha = push * 0.3 * Math.sin(Math.PI * t);
        ctx.beginPath(); ctx.moveTo(mx + 0.2 * h, my - 0.7 * h + oy * 0.6); ctx.lineTo(lerp(mx, dx, 0.3 + 0.6 * t), lerp(my - 0.7 * h, dy, 0.3 + 0.6 * t) + oy); ctx.stroke();
      }
    }
    glowAt(ctx, SP.white, mx, my - 0.5 * h, h * 1.4, k * 0.4);
    lightFigure(ctx, mx, my, h, k, 3.1, 'rgb(255,252,240)', 0.6);
    // 举起的手：一道光
    ctx.strokeStyle = 'rgb(255,250,236)'; ctx.lineWidth = Math.max(1, 0.05 * h); ctx.globalAlpha = k * 0.9;
    ctx.beginPath(); ctx.moveTo(mx + 0.08 * h, my - 0.72 * h); ctx.lineTo(mx + 0.3 * h, my - 1.05 * h); ctx.stroke();
    glowAt(ctx, SP.white, mx + 0.3 * h, my - 1.05 * h, 0.14 * h, k * 0.8);
    // 他的使者
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI * (0.15 + 0.7 * i / 5), r = h * (0.9 + 0.25 * (i % 2));
      const ax = mx - Math.cos(a) * r * 0.8 - 0.1 * h, ay = my + Math.sin(a) * r * 0.5 + 0.35 * h * (i % 2);
      lightFigure(ctx, ax, ay + Math.sin(W.t + i) * 2 * u, h * 0.5, k * 0.85, i * 2.1, 'rgb(255,250,236)', 0.35);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 龙被摔在地上：海边沙上的一团黑暗（12:9，12:18）；后被捆绑、扔进无底坑（20:1–3）
  function hazePos() {
    const bd = ease(lv('lbBound'));
    let [x, y] = hazeBase(), sc = hazeK();
    if (bd > 0) { const [pxx, pyy] = pitPt(); x = lerp(x, pxx, bd); y = lerp(y, pyy - 4, bd); sc = lerp(sc, 1, bd); }
    return [x, y, sc * (1 - 0.85 * bd)];
  }
  function drawHaze(ctx) {
    const k = lv('lbHaze') * (1 - smoothstep(0.8, 1, lv('lbBound'))) * (0.45 + 0.55 * nightK());
    if (k < 0.01 || !SP) return;
    const [x, y, sc] = hazePos(), u = VU(), w = (PORT ? 0.13 : 0.075) * W.w * sc;
    ctx.save();
    for (let i = 0; i < 12; i++) {
      const f = hsh(i * 2.7) * 2 - 1, yy = y - (0.2 + 0.6 * hsh(i * 5.1)) * 14 * u * sc - Math.sin(W.t * 0.5 + i) * 2 * u;
      glowAt(ctx, SP.smoke, x + f * w + Math.sin(W.t * 0.4 + i * 1.3) * 5 * u, yy, (18 + 14 * hsh(i * 1.1)) * u * sc, k * 0.6, 0.55);
    }
    // 暗烟的红边：夜里也看得出那一团黑暗
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) glowAt(ctx, SP.ember, x + (hsh(i * 9.1) * 2 - 1) * w * 0.8, y - (6 + 8 * hsh(i * 4.3)) * u * sc, 12 * u * sc, k * 0.42 * (0.6 + 0.4 * Math.sin(W.t * 1.7 + i)));
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 兽从海中上来（13:1）：一柱暗烟与红黑的微光；羔羊站在锡安山时退回海里
  function drawBeast(ctx) {
    const a0 = lv('lbBeastA'), r = lv('lbBeast'), a = a0 * (0.5 + 0.5 * nightK());
    if (a < 0.01 || r < 0.01 || !SP) return;
    const b = G('beast'), bx = b[0] * W.w, by = b[1] * W.h, u = VU(), bk = PORT ? 1.6 : 0.72;
    const top = lerp(by, b[2] * W.h, eOut(r) * clamp(a0 * 1.15, 0, 1));
    ctx.save();
    for (let j = 0; j < 16; j++) {
      const t = j / 15, y = lerp(by, top, t), x = bx + Math.sin(t * 3 + W.t * 0.6) * 0.02 * W.w * t;
      const rr = lerp(0.03, 0.058, t) * W.w * bk * (PORT ? 1 : lerp(0.6, 1, t));
      glowAt(ctx, SP.smoke, x, y, rr, a * 0.7);
    }
    ctx.globalCompositeOperation = 'lighter';
    const hx = bx + Math.sin(3 + W.t * 0.6) * 0.02 * W.w, hr = 0.05 * W.w * bk;
    for (let i = 0; i < 7; i++) {
      const aa = Math.PI * (1.05 + 0.9 * i / 6);
      glowAt(ctx, SP.red, hx + Math.cos(aa) * hr * 0.8, top + Math.sin(aa) * hr * 0.45, hr * 0.28, a * (0.3 + 0.15 * Math.sin(W.t * 2 + i)));
    }
    ctx.fillStyle = 'rgb(255,90,60)';
    for (let i = 0; i < 10; i++) {
      const aa = Math.PI * (1.1 + 0.8 * i / 9);
      ctx.globalAlpha = a * (0.4 + 0.3 * Math.sin(W.t * 3 + i));
      ctx.beginPath(); ctx.arc(hx + Math.cos(aa) * hr * 1.2, top + Math.sin(aa) * hr * 0.8 - hr * 0.2, Math.max(0.8, 1.2 * u), 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：锡安山、众人的棕树枝 / 额上的名 / 细麻衣、生命水、婚筵
  // ════════════════════════════════════════════════════════════
  function drawZion(ctx) {
    const g = zionGeom(), N = 32, l = 2;
    ctx.save();
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const f = lerp(g.z - g.hw, g.z + g.hw, i / N), t = (f - g.z) / g.hw;
      const bump = Math.pow((Math.cos(t * Math.PI) + 1) / 2, 1.4);
      pts.push([f * W.w, gY(l, f) - g.ph * bump + 1]);
    }
    ctx.fillStyle = css([70, 88, 56], l);
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    for (let i = N; i >= 0; i--) { const f = lerp(g.z - g.hw, g.z + g.hw, i / N); ctx.lineTo(f * W.w, gY(l, f) + 6); }
    ctx.closePath(); ctx.fill();
    // 岩石的纹
    ctx.strokeStyle = css([54, 62, 46], l, 0.7); ctx.lineWidth = Math.max(0.7, 1 * SU());
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const f = g.z + (hsh(i * 3.3) - 0.5) * g.hw * 1.1, t = (f - g.z) / g.hw, b = Math.pow((Math.cos(t * Math.PI) + 1) / 2, 1.4), y = gY(l, f) - g.ph * b * (0.4 + 0.4 * hsh(i * 7.7)); ctx.moveTo(f * W.w - 4, y); ctx.lineTo(f * W.w + 6, y + 3); }
    ctx.stroke();
    // 迎光的一道边
    const lit = W.core.x >= g.z * W.w ? 1 : -1;
    ctx.strokeStyle = css([226, 214, 170], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.8, 1.2 * SU());
    ctx.beginPath();
    let started = false;
    pts.forEach((p, i) => { const t = i / N; if ((lit > 0 && t < 0.45) || (lit < 0 && t > 0.55)) return; if (started) ctx.lineTo(p[0], p[1]); else { ctx.moveTo(p[0], p[1]); started = true; } });
    ctx.stroke();
    const zl = lv('lbZion');
    if (zl > 0.01 && SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, g.top[0], g.top[1], g.ph * 1.8, zl * 0.18, 0.6); }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 夜里：天上来的光落在众人站的地上，好让人的剪影看得清
  function drawGroundLight(ctx) {
    const nk = nightK();
    if (nk < 0.05 || !SP) return;
    const f = G('folk'), mid = (f[0] + f[1]) / 2, cx = mid * W.w, cy = gY(2, mid) - PH() * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, cx, cy, (f[1] - f[0]) * W.w * 0.8, nk * 0.35, 0.32);
    glowAt(ctx, SP.gold, G('john') * W.w, gY(2, G('john')) - PH() * 0.4, PH() * 1.4, nk * 0.24, 0.6);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function headK(m) {
    switch (m.pose) {
      case 'sit': return 0.6; case 'kneel': case 'pray': return 0.66; case 'bow': case 'worship': return 0.5; case 'fall': case 'lie': return 0.12;
      default: return 0.93;
    }
  }
  function eachPerson(fn) {
    for (const gid of PEOPLE) for (const m of members(gid)) if (m._vis && !m.dying && m.alpha > 0.05) fn(m);
    const j = fig('john');
    if (j && j._vis) fn(j);
  }
  function palm(ctx, x, y, len, ang, col, a, nk) {
    const dx = Math.sin(ang), dy = -Math.cos(ang), bend = Math.sin(W.t * 1.3 + x * 0.05) * 0.08;
    const tx = x + dx * len + dy * len * bend, ty = y + dy * len - dx * len * bend;
    ctx.globalAlpha = a;
    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(0.7, len * 0.05);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + dx * len * 0.6, y + dy * len * 0.6, tx, ty);
    const pxv = -dy, pyv = dx;
    for (let i = 2; i <= 7; i++) {
      const t = i / 8, bx = lerp(x, tx, t), by = lerp(y, ty, t), l2 = len * 0.24 * (1 - t * 0.55);
      for (const s of [-1, 1]) { ctx.moveTo(bx, by); ctx.lineTo(bx + (pxv * s * 0.85 + dx * 0.35) * l2, by + (pyv * s * 0.85 + dy * 0.35) * l2 + l2 * 0.3); }
    }
    ctx.stroke();
    // 夜里：淡绿的枝子带一道光边，不是一把黑梳子
    if (nk > 0.15) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * Math.min(1, nk * 0.9);
      ctx.strokeStyle = 'rgb(150,206,136)';
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawPeople(ctx) {
    const marks = lv('lbMarks'), linen = lv('lbLinen'), rest = lv('lbRest'), nk = nightK();
    if (!S.palms && marks < 0.01 && linen < 0.01 && rest < 0.01 && nk < 0.15) return;
    if (!SP) return;
    const u = SU();
    const col = css([118, 168, 86], 2, 1, 0.12);
    ctx.save();
    eachPerson(m => {
      const h = m._h || PH(), x = m._x, y = m._y, fd = m.fd || m.facing || 1;
      // 夜里：天上来的一点光照在各人身上——站着、跪着、俯伏都看得清；穿白衣的更亮
      if (nk > 0.15) {
        const wht = m.robe && m.robe[0] > 230 && m.robe[1] > 230 && m.robe[2] > 220;
        const hk = Math.max(0.3, headK(m));
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, wht ? SP.white : SP.pale, x, y - hk * 0.55 * h, (wht ? 0.55 : 0.48) * h, nk * (wht ? 0.38 : 0.2), hk < 0.7 ? 0.8 : 1.25);
        ctx.globalCompositeOperation = 'source-over';
      }
      if (m.id === 'john') { if (marks > 0.01) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.white, x + fd * 0.03 * h, y - headK(m) * h, Math.max(2.2, 0.05 * h), marks * 0.8); ctx.globalCompositeOperation = 'source-over'; } return; }
      if (linen > 0.01) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.white, x, y - 0.5 * h, 0.55 * h, linen * 0.28, 1.3); ctx.globalCompositeOperation = 'source-over'; }
      if (rest > 0.01) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x, y - 0.35 * h, 0.5 * h, rest * 0.22); ctx.globalCompositeOperation = 'source-over'; }
      if (marks > 0.01) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.white, x + fd * 0.03 * h, y - headK(m) * h, Math.max(2.2, 0.05 * h), marks * 0.8); ctx.globalCompositeOperation = 'source-over'; }
      if (S.palms && m.crowd && m.alpha > 0.3) {
        const p = m.pose;
        if (p === 'raise') palm(ctx, x + fd * 0.07 * h, y - 1.0 * h, 0.5 * h, fd * 0.22, col, m.alpha, nk);
        else if (p === 'stand' || p === 'gaze' || p === 'walk') palm(ctx, x + fd * 0.17 * h, y - 0.47 * h, 0.55 * h, fd * 0.35, col, m.alpha, nk);
        else if (p === 'sit') palm(ctx, x + fd * 0.2 * h, y - 0.3 * h, 0.45 * h, fd * 0.6, col, m.alpha, nk);
      }
    });
    ctx.restore();
    ctx.globalAlpha = 1;
    void u;
  }
  function springPts() {
    const [lx, ly] = px(G('lambH')), sx = G('spring') * W.w, sy = gY(2, G('spring')) + 2;
    const out = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30, mt = 1 - t;
      const c1x = lx - 0.06 * W.w, c1y = ly + 0.22 * W.h, c2x = sx + 0.06 * W.w, c2y = sy - 0.3 * W.h;
      out.push([mt * mt * mt * lx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * sx, mt * mt * mt * (ly + 3) + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * sy]);
    }
    return out;
  }
  function drawSpring(ctx) {
    const a = lv('lbSpringA'), p = lv('lbSpring');
    if (a < 0.01 || p < 0.01 || !SP) return;
    const P = springPts(), n = Math.max(2, Math.round(p * (P.length - 1)) + 1), u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [w, al] of [[12, 0.07], [6, 0.14], [2.6, 0.3], [1, 0.55]]) {
      ctx.strokeStyle = 'rgb(200,228,255)'; ctx.lineWidth = Math.max(0.8, w * u); ctx.globalAlpha = a * al;
      ctx.beginPath(); for (let i = 0; i < n; i++) (i ? ctx.lineTo(P[i][0], P[i][1]) : ctx.moveTo(P[i][0], P[i][1])); ctx.stroke();
    }
    ctx.fillStyle = 'rgb(236,246,255)';
    for (let i = 0; i < 16; i++) {
      const t = (W.t * 0.2 + i / 16) % 1, j = Math.floor(t * (P.length - 1));
      if (j >= n - 1) continue;
      ctx.globalAlpha = a * 0.8 * Math.sin(Math.PI * t);
      ctx.beginPath(); ctx.arc(P[j][0], P[j][1], Math.max(0.8, 1.3 * u), 0, TAU); ctx.fill();
    }
    if (p > 0.95) {
      const [ex, ey] = P[P.length - 1], k = smoothstep(0.95, 1, p) * a;
      glowAt(ctx, SP.blue, ex, ey, 30 * u, k * 0.5, 0.35);
      ctx.strokeStyle = 'rgb(220,236,255)'; ctx.lineWidth = Math.max(0.7, 0.8 * u);
      for (let i = 0; i < 3; i++) { const t = (W.t * 0.4 + i / 3) % 1; ctx.globalAlpha = k * 0.5 * (1 - t); ctx.beginPath(); ctx.ellipse(ex, ey, (6 + 22 * t) * u, (2 + 6 * t) * u, 0, 0, TAU); ctx.stroke(); }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 羔羊的婚筵（19:9）：几张铺着细麻布的矮桌，摆在坐着的众人跟前；桌上有灯与杯
  function tableSegs() {
    const [a, b] = G('table'), z = zionGeom(), gap = z.hw * 0.55, out = [];
    const spans = [[a, z.z - gap], [z.z + gap, b]];
    for (const [x0, x1] of spans) {
      const n = Math.max(1, Math.round((x1 - x0) / (PORT ? 0.12 : 0.085)));
      for (let i = 0; i < n; i++) { const f0 = lerp(x0, x1, i / n) + 0.006, f1 = lerp(x0, x1, (i + 1) / n) - 0.006; if (f1 - f0 > 0.02) out.push([f0, f1]); }
    }
    return out;
  }
  function drawTable(ctx) {
    const k = lv('lbTable');
    if (k < 0.01 || !SP) return;
    const ph = PH(), u = SU();
    const topAt = f => { const g = gY(2, f); return g + 0.13 * Math.max(0, W.h - g); };
    ctx.save();
    for (const [f0, f1] of tableSegs()) {
      const x0 = f0 * W.w, x1 = f1 * W.w, y0 = topAt(f0), y1 = topAt(f1), th = 0.045 * ph, cloth = 0.13 * ph;
      ctx.globalAlpha = k;
      // 桌腿
      ctx.fillStyle = W.shadeCSS([120, 92, 64], 0, 1);
      ctx.fillRect(x0 + 2 * u, y0 + th, 1.6 * u, cloth + 0.1 * ph); ctx.fillRect(x1 - 3.6 * u, y1 + th, 1.6 * u, cloth + 0.1 * ph);
      // 桌面与垂下的细麻布
      ctx.fillStyle = W.shadeCSS([248, 244, 232], 0, 1, 0.3);
      ctx.beginPath(); ctx.moveTo(x0 - 1.5 * u, y0); ctx.lineTo(x1 + 1.5 * u, y1); ctx.lineTo(x1 + 1.5 * u, y1 + th + cloth); ctx.lineTo(x0 - 1.5 * u, y0 + th + cloth); ctx.closePath(); ctx.fill();
      ctx.fillStyle = W.shadeCSS([226, 220, 204], 0, 0.8, 0.2);
      ctx.beginPath();
      for (let i = 1; i < 6; i++) { const t = i / 6, x = lerp(x0, x1, t), y = lerp(y0, y1, t) + th; ctx.rect(x - 0.4 * u, y, 0.8 * u, cloth); }
      ctx.fill();
      ctx.strokeStyle = 'rgba(236,196,110,0.9)'; ctx.lineWidth = Math.max(0.8, 1 * u);
      ctx.beginPath(); ctx.moveTo(x0 - 1.5 * u, y0 + th); ctx.lineTo(x1 + 1.5 * u, y1 + th); ctx.stroke();
      // 灯与杯、饼
      ctx.globalCompositeOperation = 'lighter';
      const n = Math.max(2, Math.round((x1 - x0) / (14 * u)));
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n, x = lerp(x0, x1, t), y = lerp(y0, y1, t);
        if (i % 2 === 0) {
          glowAt(ctx, SP.warm, x, y - 3 * u, 9 * u, k * (0.45 + 0.2 * Math.sin(W.t * 3 + i + f0 * 50)));
          ctx.fillStyle = 'rgb(255,200,110)'; ctx.globalAlpha = k * 0.9; ctx.beginPath(); tongue(ctx, x, y - 0.5 * u, 1.1 * u, 4 * u, i + f0 * 30); ctx.fill();
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = W.shadeCSS([232, 192, 112], 0, 1, 0.15); ctx.globalAlpha = k;
          ctx.beginPath(); ctx.moveTo(x - 2 * u, y - 4.5 * u); ctx.lineTo(x + 2 * u, y - 4.5 * u); ctx.lineTo(x + 0.5 * u, y - 1.8 * u); ctx.lineTo(x + 0.5 * u, y); ctx.lineTo(x - 0.5 * u, y); ctx.lineTo(x - 0.5 * u, y - 1.8 * u); ctx.closePath(); ctx.fill();
          ctx.fillStyle = W.shadeCSS([206, 160, 100], 0, 1, 0.1);
          ctx.beginPath(); ctx.ellipse(x + 4.5 * u, y - 1 * u, 2.4 * u, 1.1 * u, 0, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：巴比伦大城（中丘）：塔、殿、金顶、紫与朱红的旗；夜里满城的灯
  // ════════════════════════════════════════════════════════════
  const CS = () => LS(1) * 1.35;
  function cityModel() {
    if (CITY) return CITY;
    const r = U.mulberry32(66018), s = CS();
    const [x0, x1] = G('city');
    const hs = [];
    for (const back of [1, 0]) {
      let x = x0 * W.w + (back ? 3 : 0) * s;
      while (x < x1 * W.w) {
        const w = (back ? 11 : 9) + r() * (back ? 10 : 8), h = (back ? 14 : 9) + r() * (back ? 14 : 8);
        const f = (x + (w * s) / 2) / W.w;
        const nw = 1 + ((r() * 3) | 0), wins = [];
        for (let i = 0; i < nw; i++) wins.push({ dx: nw === 1 ? 0 : (i / (nw - 1) - 0.5) * 0.56, dy: 0.3 + r() * 0.36, rank: r() });
        hs.push({ f, w, h, back, dome: r() < 0.24, tone: r(), wins });
        x += (w + 0.8 + r() * 2.5) * s;
      }
    }
    const tw = [];
    for (let f = x0 + 0.025; f < x1 - 0.015; f += 0.05 + r() * 0.035) tw.push({ f, h: 30 + r() * 14, w: 6 + r() * 2, cap: r() < 0.5 ? 1 : 0, flag: r() < 0.65 ? (r() < 0.5 ? 0 : 1) : -1, rank: r() });
    CITY = { hs, tw, zg: lerp(x0, x1, 0.55), x0, x1 };
    return CITY;
  }
  // ru：荒场的程度（18:2 巴比伦大城倾倒了；18:21 决不能再见了）——塔断、顶塌、旗没了、满地瓦砾
  function drawCityBody(ctx, m, s, sp, ru) {
    const l = 1, nk = nightK(), lit = lv('lbCityLit'), d = W.core.x >= W.w * 0.75 ? 1 : -1;
    const ST = [206, 184, 150], ST2 = [176, 150, 118], GOLD = [222, 182, 96], PURP = [118, 62, 132], SCAR = [182, 44, 52];
    const wins = [], crown = 1 - smoothstep(0.15, 0.55, ru);
    // 后排与前排的房屋
    for (const h of m.hs) {
      const cut = 1 - ru * (0.35 + 0.4 * hsh(h.f * 91.7));
      const x = h.f * W.w, gy = gY(l, h.f) + 2 * s - (h.back ? 7 * s : 0), w = h.w * s, hh = h.h * s * cut;
      const tone = mix(ST, ST2, h.tone);
      ctx.fillStyle = css(mix(tone, [120, 104, 90], ru * 0.35), l, 1, h.back ? -0.05 : 0);
      ctx.fillRect(x - w / 2, gy - hh, w, hh + (h.back ? 7 * s : 2 * s));
      ctx.fillStyle = css(mix(tone, [60, 50, 40], 0.3), l, 0.75);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.25, gy - hh, w * 0.25, hh);
      if (ru > 0.05) {
        // 断了的墙头：参差的缺口
        ctx.fillStyle = css(mix(tone, [120, 104, 90], ru * 0.35), l, Math.min(1, ru * 2));
        ctx.beginPath(); ctx.moveTo(x - w / 2, gy - hh);
        ctx.lineTo(x - w * 0.2, gy - hh - 2.2 * s * (0.5 + hsh(h.f * 37.1))); ctx.lineTo(x + w * 0.05, gy - hh - 0.6 * s); ctx.lineTo(x + w * 0.3, gy - hh - 1.8 * s * hsh(h.f * 53.3)); ctx.lineTo(x + w / 2, gy - hh);
        ctx.closePath(); ctx.fill();
      }
      if (h.dome) {
        if (crown > 0.01) { ctx.fillStyle = css(GOLD, l, crown, 0.08); ctx.beginPath(); ctx.ellipse(x, gy - hh, w * 0.36, w * 0.34, 0, Math.PI, TAU); ctx.fill(); }
      } else if (crown > 0.01) {
        ctx.fillStyle = css(mix(tone, [120, 100, 80], 0.4), l, crown);
        ctx.fillRect(x - w / 2 - 0.6 * s, gy - hh - 1.2 * s, w + 1.2 * s, 1.4 * s);
      }
      for (const q of h.wins) wins.push([x + q.dx * w, gy - hh * q.dy, q.rank]);
    }
    // 大殿与层叠的塔庙（荒场时只剩下两层）
    {
      const f = m.zg, x = f * W.w, gy = gY(l, f) + 2 * s, tiers = 5, keep = 5 - 3 * ru;
      for (let i = 0; i < tiers; i++) {
        if (i + 1 > keep + 0.999) break;
        const part = clamp(keep - i, 0, 1);
        const w = (48 - i * 8) * s, y0 = gy - i * 9 * s, th = 9 * s * part;
        ctx.fillStyle = css(mix(mix(ST, [236, 214, 176], i * 0.12), [120, 104, 90], ru * 0.35), l, 1, i * 0.02);
        ctx.fillRect(x - w / 2, y0 - th, w, th + (i ? 0 : 2 * s));
        ctx.fillStyle = css([90, 70, 56], l, 0.5);
        ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.18, y0 - th, w * 0.18, th);
        if (part > 0.6) wins.push([x - w * 0.25, y0 - 4.5 * s, 0.1 + i * 0.05], [x + w * 0.25, y0 - 4.5 * s, 0.15 + i * 0.05]);
      }
      if (crown > 0.01) {
        const ty = gy - tiers * 9 * s;
        ctx.fillStyle = css(GOLD, l, crown, 0.12);
        ctx.beginPath(); ctx.ellipse(x, ty, 6 * s, 6 * s, 0, Math.PI, TAU); ctx.fill();
        ctx.fillRect(x - 0.5 * s, ty - 11 * s, 1 * s, 5 * s);
      }
    }
    // 塔：金顶或尖顶，紫色与朱红的旗（荒场时塔断到四成，没有顶，没有旗）
    for (const t of m.tw) {
      const x = t.f * W.w, gy = gY(l, t.f) + 2 * s;
      const near = Math.min(Math.abs(t.f - lerp(m.x0, m.x1, 0.36)), Math.abs(t.f - lerp(m.x0, m.x1, 0.7)));
      const hh = t.h * s * (1 - (near < 0.035 ? 0.45 * sp : 0)) * (1 - 0.6 * ru), w = t.w * s;
      ctx.fillStyle = css(mix([212, 192, 156], [120, 104, 90], ru * 0.35), l);
      ctx.fillRect(x - w / 2, gy - hh, w, hh);
      ctx.fillStyle = css([80, 64, 50], l, 0.55);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.3, gy - hh, w * 0.3, hh);
      if (crown > 0.01) {
        if (t.cap) { ctx.fillStyle = css(GOLD, l, crown, 0.1); ctx.beginPath(); ctx.ellipse(x, gy - hh, w * 0.62, w * 0.6, 0, Math.PI, TAU); ctx.fill(); }
        else { ctx.fillStyle = css([150, 96, 70], l, crown); ctx.beginPath(); ctx.moveTo(x - w * 0.62, gy - hh); ctx.lineTo(x, gy - hh - w * 1.3); ctx.lineTo(x + w * 0.62, gy - hh); ctx.closePath(); ctx.fill(); }
      }
      if (ru > 0.05) {
        ctx.fillStyle = css([212, 192, 156], l, Math.min(1, ru * 2));
        ctx.beginPath(); ctx.moveTo(x - w / 2, gy - hh); ctx.lineTo(x - w * 0.1, gy - hh - w * 0.9 * hsh(t.f * 71.3)); ctx.lineTo(x + w * 0.15, gy - hh - w * 0.25); ctx.lineTo(x + w / 2, gy - hh - w * 0.6 * hsh(t.f * 17.9)); ctx.lineTo(x + w / 2, gy - hh); ctx.closePath(); ctx.fill();
      }
      if (t.flag >= 0 && sp < 0.5 && ru < 0.02) {
        const fy = gy - hh - (t.cap ? w * 0.6 : w * 1.3), fl = Math.sin(W.t * 3 + t.f * 40) * 0.8 * s;
        ctx.fillStyle = css([90, 76, 60], l); ctx.fillRect(x - 0.3 * s, fy - 7 * s, 0.6 * s, 7 * s);
        ctx.fillStyle = css(t.flag ? PURP : SCAR, l, 1, 0.05);
        ctx.beginPath(); ctx.moveTo(x + 0.3 * s, fy - 7 * s); ctx.lineTo(x + 5.5 * s, fy - 5.6 * s + fl); ctx.lineTo(x + 0.3 * s, fy - 4.2 * s); ctx.closePath(); ctx.fill();
      }
      wins.push([x, gy - hh * 0.62, t.rank], [x, gy - hh * 0.35, (t.rank + 0.37) % 1]);
    }
    // 城墙与城门
    const N = 40, wx0 = m.x0 - 0.01, wx1 = m.x1 + 0.02;
    ctx.fillStyle = css([196, 172, 134], l);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N), yy = gY(l, f) + 2 * s - 7 * s * (1 - 0.45 * ru * hsh(i * 3.7)); if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
    for (let i = N; i >= 0; i--) { const f = lerp(wx0, wx1, i / N); ctx.lineTo(f * W.w, gY(l, f) + 4 * s); }
    ctx.closePath(); ctx.fill();
    if (crown > 0.3) for (let f = wx0; f < wx1; f += (3.4 * s) / W.w) { const yy = gY(l, f) + 2 * s - 7 * s; ctx.fillRect(f * W.w, yy - 1.7 * s, 1.7 * s, 1.8 * s); }
    ctx.fillStyle = css([150, 118, 70], l);
    for (const gf of [lerp(m.x0, m.x1, 0.2), lerp(m.x0, m.x1, 0.82)]) { const gx = gf * W.w, gy = gY(l, gf) + 3 * s; ctx.beginPath(); ctx.moveTo(gx - 2.4 * s, gy); ctx.lineTo(gx - 2.4 * s, gy - 4 * s); ctx.arc(gx, gy - 4 * s, 2.4 * s, Math.PI, TAU); ctx.lineTo(gx + 2.4 * s, gy); ctx.closePath(); ctx.fill(); }
    // 满地的瓦砾
    if (ru > 0.01) {
      for (let i = 0; i < 22; i++) {
        const f = lerp(m.x0 - 0.005, m.x1 + 0.01, (i + 0.5) / 22) + (hsh(i * 7.3) - 0.5) * 0.012, gx = f * W.w, gy = gY(l, f) + 3 * s;
        const rw = (5 + 5 * hsh(i * 2.9)) * s, rh = (2.5 + 3.5 * hsh(i * 4.1)) * s * ru;
        ctx.fillStyle = css(mix(ST2, [96, 84, 72], hsh(i * 1.7) * 0.6), l, Math.min(1, ru * 1.6));
        ctx.beginPath(); ctx.ellipse(gx, gy, rw, rh, 0, Math.PI, TAU); ctx.fill();
        if (i % 3 === 0) { ctx.fillStyle = css(ST, l, Math.min(1, ru * 1.6)); ctx.fillRect(gx - rw * 0.4, gy - rh - 1.6 * s, 2.2 * s, 1.6 * s); }
      }
    }
    // 窗：夜里的灯（灯光在你中间决不能再照耀——lbCityLit 降到 0）
    const cw = Math.max(1, 1.5 * s), chh = Math.max(1.2, 2.1 * s);
    for (const q of wins) {
      const on = q[2] < lit;
      if (on && nk > 0.05) { ctx.fillStyle = U.rgba(255, 200, 120, 0.35 + 0.6 * nk); }
      else ctx.fillStyle = css([50, 40, 34], l, 0.8 * (1 - ru * 0.6));
      ctx.fillRect(q[0] - cw / 2, q[1] - chh / 2, cw, chh);
    }
    return wins;
  }
  function drawCity(ctx) {
    const cK = lv('lbCity');
    if (cK < 0.01) return;
    const m = cityModel(), s = CS(), sp = lv('lbSplit'), ru = lv('lbRuin');
    const c1 = lerp(m.x0, m.x1, 0.36), c2 = lerp(m.x0, m.x1, 0.7);
    ctx.save();
    ctx.globalAlpha = cK;
    let wins = [];
    if (sp < 0.001) wins = drawCityBody(ctx, m, s, 0, ru);
    else {
      const e = eOut(sp);
      for (const [a, b, sgn] of [[m.x0 - 0.06, c1, -1], [c1, c2, 0], [c2, m.x1 + 0.06, 1]]) {
        ctx.save();
        ctx.beginPath(); ctx.rect(a * W.w, 0, (b - a) * W.w, W.h); ctx.clip();
        const pxv = (a + b) / 2 * W.w, pyv = gY(1, (a + b) / 2);
        ctx.translate(pxv, pyv); ctx.rotate(sgn * 0.055 * e); ctx.translate(-pxv, -pyv);
        ctx.translate(sgn * 7 * s * e, (sgn === 0 ? 5 : 2) * s * e);
        const ws = drawCityBody(ctx, m, s, sp, ru);
        if (sgn === 0) wins = ws;
        ctx.restore();
      }
      // 裂缝：三段之间两道深的裂口，从地里一直裂到城顶
      ctx.fillStyle = css([28, 22, 20], 1, 0.9);
      for (const c of [c1, c2]) {
        const x = c * W.w, g = gY(1, c) + 4 * s, top = g - 44 * s * e * (1 - 0.5 * ru);
        ctx.beginPath(); ctx.moveTo(x - 2.4 * s * e, g);
        for (let j = 1; j <= 6; j++) ctx.lineTo(x + (hsh(j * 3.1 + c) - 0.5) * 5 * s - 1.4 * s * e * (1 - j / 6), lerp(g, top, j / 6));
        for (let j = 5; j >= 0; j--) ctx.lineTo(x + (hsh(j * 3.1 + c) - 0.5) * 5 * s + 1.4 * s * e * (1 - j / 6) + (j ? 0 : 2.4 * s * e), lerp(g, top, j / 6));
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    // 夜里的灯光（加亮）
    const nk = nightK(), lit = lv('lbCityLit');
    if (nk > 0.1 && lit > 0.01 && SP && wins.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < wins.length; i += 3) { const q = wins[i]; if (q[2] < lit) glowAt(ctx, SP.warm, q[0], q[1], 7 * s, cK * nk * 0.3); }
      glowAt(ctx, SP.warm, lerp(m.x0, m.x1, 0.5) * W.w, gY(1, lerp(m.x0, m.x1, 0.5)) - 10 * s, (m.x1 - m.x0) * W.w * 0.5, cK * nk * 0.12 * lit, 0.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 烧她的烟（18:9）：几缕轻烟
    const sm = lv('lbCitySmoke');
    if (sm > 0.01 && SP) {
      for (let c = 0; c < 5; c++) {
        const f = lerp(m.x0 + 0.03, m.x1 - 0.03, c / 4), bx = f * W.w, by = gY(1, f) - 16 * s * (1 - 0.5 * ru);
        for (let j = 0; j < 9; j++) {
          const t = ((W.t * 0.05 + j / 9 + c * 0.13) % 1);
          glowAt(ctx, SP.smoke2, bx + Math.sin(t * 4 + c) * 12 * s + t * 30 * s, by - t * 0.22 * W.h, (6 + 22 * t) * s, sm * Math.max(cK, 0.5) * 0.35 * (1 - t));
        }
      }
    }
    // 城里的人走出来（18:4）：一点点提灯的小光，从城门沿着城下走到海边
    const ex = lv('lbExodus');
    if (ex > 0.001 && ex < 0.999 && SP) {
      const gates = [lerp(m.x0, m.x1, 0.2), lerp(m.x0, m.x1, 0.82)], shore = m.x0 - (PORT ? 0.045 : 0.055), hh = 7 * s;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 12; i++) {
        const g0 = gates[i % 3 === 2 ? 1 : 0], q = clamp(ex * 1.7 - i * 0.06, 0, 1);
        if (q <= 0 || q >= 1) continue;
        const f = lerp(g0, shore, q) + (hsh(i * 4.7) - 0.5) * 0.006, x = f * W.w, y = gY(1, f) + (1 + 2 * hsh(i * 2.3)) * s;
        const a = smoothstep(0, 0.1, q) * (1 - smoothstep(0.85, 1, q));
        glowAt(ctx, SP.warm, x, y - hh * 0.6, 7 * s, a * 0.55);
        lightFigure(ctx, x, y + Math.abs(Math.sin(W.t * 6 + i)) * -0.4 * s, hh, a * 0.9, i * 1.7, 'rgb(255,236,206)', 0.3);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 列王：围着城的暗雾（17:14）
    const kg = lv('lbKings');
    if (kg > 0.01 && SP) {
      for (let i = 0; i < 14; i++) {
        const f = lerp(m.x0 - 0.02, m.x1, hsh(i * 3.9)), bx = f * W.w, by = gY(1, f) - (20 + 30 * hsh(i * 7.7)) * s - Math.sin(W.t * 0.4 + i) * 4 * s;
        glowAt(ctx, SP.smoke, bx, by, (26 + 16 * hsh(i * 1.3)) * s, kg * 0.55);
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) { const f = lerp(m.x0, m.x1, hsh(i * 5.3)); glowAt(ctx, SP.ember, f * W.w, gY(1, f) - 30 * s, 12 * s, kg * 0.25); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：大权柄的天使（18:1）、大磨石（18:21）、天开了与白马（19:11–16）
  // ════════════════════════════════════════════════════════════
  function drawAuth(ctx) {
    const k = lv('lbAuth');
    if (k < 0.01 || !SP) return;
    // 从左上的天降下，停在离宝座远的天空里（不在宝座前，免得看成坐宝座的）
    const a = G('auth'), q = 1 - eOut(k), x = (a[0] - q * 0.1) * W.w, y = (a[1] - q * 0.16) * W.h, h = (PORT ? 60 : 90) * VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.amber, x, y - 0.5 * h, h * 3, k * 0.3);
    glowAt(ctx, SP.white, x, y - 0.5 * h, h * 1.2, k * 0.5);
    lightFigure(ctx, x, y, h, k, 4.4, 'rgb(255,252,240)', 0.6);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawAuthEarth(ctx) {
    const k = lv('lbAuth');
    if (k < 0.01 || !SP) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, W.w * 0.7, W.h * 0.82, W.w * 0.6, k * 0.2, 0.45);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawStone(ctx) {
    const ka = lv('lbStoneAng'), p = lv('lbStone');
    if (ka < 0.01 || !SP) return;
    const [ax, ay] = px(G('stoneA')), [bx, by] = px(G('stoneB')), u = VU(), h = (PORT ? 54 : 80) * u, r = (PORT ? 9 : 14) * u;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    lightFigure(ctx, ax + 0.25 * h, ay + h * 0.95, h, ka, 6.1, 'rgb(255,250,236)', 0.5);
    ctx.globalCompositeOperation = 'source-over';
    if (p < 0.999) {
      const e = eIn(p), x = lerp(ax, bx, e), y = lerp(ay - 0.1 * h, by, e);
      ctx.globalAlpha = ka;
      ctx.fillStyle = 'rgb(118,112,106)';
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgb(60,56,54)';
      ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgb(236,226,206)'; ctx.lineWidth = Math.max(0.8, 1.2 * u); ctx.globalAlpha = ka * 0.6;
      ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawOpen(ctx) {
    const k = lv('lbOpen');
    if (k < 0.01 || !SP) return;
    const [x, y] = px(G('rider0')), u = VU(), hh = (PORT ? 0.12 : 0.24) * W.h;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, x, y + hh * 0.35, 34 * u, k * 0.55, hh / (34 * u) * 0.75);
    glowAt(ctx, SP.white, x, y + hh * 0.35, 12 * u, k * 0.6, hh / (12 * u) * 0.6);
    glowAt(ctx, SP.amber, x, y + hh * 0.35, 110 * u, k * 0.2, 1.6);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function riderPt() {
    const p = ease(lv('lbRider')), a = G('rider0'), b = G('rider1');
    const x = lerp(a[0], b[0], p) * W.w, y = (lerp(a[1] + (PORT ? 0.08 : 0.14), b[1], p) - Math.sin(Math.PI * p) * 0.03) * W.h;
    return [x, y + (p >= 1 ? Math.sin(W.t * 0.9) * 2 : 0)];
  }
  const riderK = () => (PORT ? 1.75 : 2.5) * VU();
  function drawRider(ctx) {
    const p = lv('lbRider');
    if (p < 0.001 || !SP) return;
    const [x, y] = riderPt(), k = riderK(), a = smoothstep(0, 0.12, p) * lv('lbRiderA');
    if (a < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.amber, x, y - 22 * k, 70 * k, a * 0.3);
    glowAt(ctx, SP.white, x, y - 22 * k, 34 * k, a * 0.6);
    ctx.restore();
    lightHorse(ctx, x, y, k, -1, W.t * (p < 1 ? 7 : 2.2), p < 1 ? 0.9 : 0.3, [255, 253, 246], a, { rim: [255, 236, 190] });
    // 骑马的是纯光：上身是一团柔和的白光（冠冕只由经文说出，不画）
    const ph = W.t * (p < 1 ? 7 : 2.2), bob = -(p < 1 ? 0.9 : 0.3) * Math.abs(Math.sin(ph)) * 1.2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x + k, y + (-30 + bob) * k, 30 * k, a * 0.35);
    glowAt(ctx, SP.white, x + 0.2 * k, y + (-33 + bob) * k, 13 * k, a * 0.7);
    glowAt(ctx, SP.white, x - 0.6 * k, y + (-37.2 + bob) * k, 10 * k, a * 0.9);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawArmies(ctx) {
    const p = lv('lbArmies'), ra = lv('lbRiderA');
    if (p < 0.001 || ra < 0.01) return;
    const A = armySprites();
    if (!A) return;
    const [ox, oy] = px(G('rider0')), [rx, ry] = riderPt(), N = PORT ? 12 : 22, u = VU(), sc = (PORT ? 0.55 : 0.75) * u;
    ctx.save();
    for (let i = 0; i < N; i++) {
      const q = clamp((p - (i / N) * 0.55) / 0.45, 0, 1);
      if (q <= 0) continue;
      const row = i % 4, col = Math.floor(i / 4);
      const tx = rx + (0.05 + col * 0.035 + row * 0.012) * W.w * (PORT ? 1.4 : 1), ty = ry + (row - 1.5) * 0.035 * W.h - col * 0.01 * W.h;
      const e = eOut(q), x = lerp(ox, tx, e), y = lerp(oy + 0.1 * W.h, ty, e);
      const S_ = A[(i + Math.floor(W.t * 5)) % A.length];
      ctx.globalAlpha = smoothstep(0, 0.2, q) * 0.85 * ra;
      ctx.drawImage(S_.c, x - S_.ox * sc / S_.k, y - S_.oy * sc / S_.k, S_.c.width * sc / S_.k, S_.c.height * sc / S_.k);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：捆绑龙的天使（20:1–3）、几个宝座（20:4）、白色的大宝座与案卷（20:11–13）
  // ════════════════════════════════════════════════════════════
  function binderPt() {
    const k = lv('lbBinder'), [hx, hy] = hazePos();
    const x = hx + (PORT ? 0.1 : 0.06) * W.w, y = lerp(W.h * 0.2, hy - (PORT ? 0.14 : 0.2) * W.h, eOut(k));
    return [x, y];
  }
  function drawBinder(ctx) {
    const k = lv('lbBinder');
    if (k < 0.01 || !SP) return;
    const [x, y] = binderPt(), u = VU(), h = (PORT ? 50 : 70) * u, bind = lv('lbBind'), [hx, hy, hs] = hazePos();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, x, y - 0.5 * h, h * 1.3, k * 0.4);
    lightFigure(ctx, x, y, h, k, 7.3, 'rgb(255,250,236)', 0.5);
    // 钥匙
    const kx = x + 0.2 * h, ky = y - 0.5 * h;
    ctx.strokeStyle = 'rgb(255,220,140)'; ctx.lineWidth = Math.max(1, 1.2 * u); ctx.globalAlpha = k;
    ctx.beginPath(); ctx.arc(kx, ky - 3 * u, 2.2 * u, 0, TAU); ctx.moveTo(kx, ky - 0.8 * u); ctx.lineTo(kx, ky + 6 * u); ctx.lineTo(kx + 2 * u, ky + 6 * u); ctx.stroke();
    glowAt(ctx, SP.gold, kx, ky, 8 * u, k * 0.6);
    // 大链子：从手里垂到海边的黑暗；捆绑时绕成一圈
    const cx0 = x - 0.18 * h, cy0 = y - 0.5 * h, links = 18;
    ctx.strokeStyle = 'rgb(236,230,214)'; ctx.lineWidth = Math.max(0.7, 0.9 * u); ctx.globalAlpha = k * 0.85;
    for (let i = 0; i <= links; i++) {
      const t = i / links;
      let lx, ly;
      if (bind < 0.01 || t < 0.5) {
        const tt = bind < 0.01 ? t : t * 2;
        lx = lerp(cx0, hx, tt); ly = lerp(cy0, hy - 12 * u * hs, tt) + Math.sin(Math.PI * tt) * 16 * u;
      } else {
        const a = (t - 0.5) * 2 * TAU * bind, rr = (PORT ? 26 : 34) * u * hs;
        lx = hx + Math.cos(a) * rr; ly = hy - 12 * u * hs + Math.sin(a) * rr * 0.35;
      }
      ctx.beginPath(); ctx.ellipse(lx, ly, 1.8 * u, 1.1 * u, t * 3, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function thronePts() {
    const [tx, ty] = px(G('th')), u = VU(), out = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI * (0.08 + 0.84 * i / 7); out.push([tx + Math.cos(a) * (PORT ? 0.36 : 0.18) * W.w, ty + Math.sin(a) * 58 * u + 6 * u]); }
    return out;
  }
  function drawThrones(ctx) {
    const k = lv('lbThrones');
    if (k < 0.01 || !SP) return;
    const u = VU(), rg = lv('lbReign');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const tu = u * (PORT ? 0.85 : 1);
    thronePts().forEach(([x, y], i) => {
      glowAt(ctx, SP.gold, x, y - 11 * tu, 30 * tu, k * 0.6);
      // 一张金的座：高背、座面、两腿（实的金色，不是细线）
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = k * 0.95;
      ctx.fillStyle = 'rgb(232,188,96)';
      ctx.beginPath();
      ctx.moveTo(x - 8 * tu, y); ctx.lineTo(x - 8 * tu, y - 22 * tu);
      ctx.quadraticCurveTo(x - 8 * tu, y - 25 * tu, x - 4.5 * tu, y - 25 * tu);
      ctx.lineTo(x - 4.5 * tu, y - 10 * tu); ctx.lineTo(x + 8 * tu, y - 10 * tu); ctx.lineTo(x + 8 * tu, y);
      ctx.lineTo(x + 5.5 * tu, y); ctx.lineTo(x + 5.5 * tu, y - 7 * tu); ctx.lineTo(x - 5.5 * tu, y - 7 * tu); ctx.lineTo(x - 5.5 * tu, y);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgb(255,240,200)'; ctx.lineWidth = Math.max(0.7, 0.9 * tu); ctx.globalAlpha = k * 0.8;
      ctx.beginPath(); ctx.moveTo(x - 8 * tu, y - 10 * tu); ctx.lineTo(x + 8 * tu, y - 10 * tu); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      const sa = smoothstep(0.1 + i * 0.05, 0.35 + i * 0.05, rg);
      if (sa > 0.01) lightFigure(ctx, x + 1.5 * tu, y - 8 * tu, 19 * tu, k * sa, i * 1.3, 'rgb(255,252,244)', 0.45);
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 白色的大宝座（20:11）：天地都从他面前逃避——世界褪进白光里（左下方经文所在之处留得淡些）
  function drawWhite(ctx) {
    const k = lv('lbWhite');
    if (k < 0.01 || !SP) return;
    const [x, y] = px(G('th'));
    ctx.save();
    // 天地都逃避：日头、远山、海与地都褪进白光里；只在经文之处（桌面左下、竖屏上方）留得淡些
    const key = 'white' + (W.w | 0) + 'x' + (W.h | 0) + (PORT ? 'p' : 'd');
    const ecx = 0.25 * W.w, ecy = 0.8 * W.h, eR = 0.42 * W.w, esy = 0.62;   // 桌面：经文那一块的椭圆
    let gr = GRAD[key];
    if (!gr) {
      gr = PORT ? ctx.createLinearGradient(0, W.h, 0, 0) : ctx.createRadialGradient(0, 0, 0, 0, 0, eR);
      if (PORT) { gr.addColorStop(0, 'rgba(252,250,244,0.5)'); gr.addColorStop(0.45, 'rgba(252,250,244,0.6)'); gr.addColorStop(0.64, 'rgba(252,250,244,0.55)'); gr.addColorStop(0.72, 'rgba(252,250,244,0.25)'); gr.addColorStop(1, 'rgba(252,250,244,0.25)'); }
      else { gr.addColorStop(0, 'rgba(252,250,244,0.2)'); gr.addColorStop(0.55, 'rgba(252,250,244,0.26)'); gr.addColorStop(0.85, 'rgba(252,250,244,0.5)'); gr.addColorStop(1, 'rgba(252,250,244,0.6)'); }
      GRAD[key] = gr;
    }
    const veil = () => {
      ctx.fillStyle = gr;
      if (PORT) { ctx.fillRect(-20, -20, W.w + 40, W.h + 40); return; }
      ctx.save(); ctx.translate(ecx, ecy); ctx.scale(1, esy);
      ctx.fillRect(-ecx - 20, (-ecy - 20) / esy, W.w + 40, (W.h + 40) / esy);
      ctx.restore();
    };
    const end = lv('lbEnd');
    ctx.globalAlpha = k;
    veil();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, x, y + 0.05 * W.h, M() * 0.9, k * 0.22, 0.8);
    // 最后一点黑暗消失：满地温暖的白光（死亡和阴间被扔在火湖里——只由经文说出）
    if (end > 0.01) {
      glowAt(ctx, SP.cloud, x, y + 0.2 * W.h, Math.max(W.w, W.h) * 0.9, end * 0.3, 0.9);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = end * 0.35;
      veil();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function bookPts() {
    const [cx, cy] = px(G('books')), u = VU(), out = [];
    const sp = (PORT ? 0.2 : 0.085) * W.w;
    for (let i = 0; i < 5; i++) { const j = i - 2; out.push([cx + j * sp * (PORT ? 0.55 : 1), cy + Math.abs(j) * 10 * u + (PORT && Math.abs(j) === 2 ? 26 * u : 0), j === 0]); }
    return out;
  }
  function book(ctx, x, y, w, open, a, gold) {
    const hw = w / 2, hh = w * 0.34, lift = open * hh * 0.35;
    ctx.globalAlpha = a;
    ctx.fillStyle = gold ? 'rgb(255,236,180)' : 'rgb(250,246,236)';
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x - hw * open, y - lift); ctx.lineTo(x - hw * open, y - lift - hh); ctx.lineTo(x, y - hh); ctx.closePath();
    ctx.moveTo(x, y); ctx.lineTo(x + hw * open, y - lift); ctx.lineTo(x + hw * open, y - lift - hh); ctx.lineTo(x, y - hh); ctx.closePath();
    ctx.fill();
    if (open > 0.4) {
      ctx.strokeStyle = gold ? 'rgb(190,140,60)' : 'rgb(160,150,140)'; ctx.lineWidth = Math.max(0.5, w * 0.012); ctx.globalAlpha = a * 0.6 * open;
      ctx.beginPath();
      for (const s of [-1, 1]) for (let i = 1; i <= 5; i++) { const t = i / 6, yy = y - hh * t - lift * 0.5; ctx.moveTo(x + s * hw * 0.12, yy); ctx.lineTo(x + s * hw * open * 0.85, yy - lift * 0.4); }
      ctx.stroke();
    }
  }
  function drawBooks(ctx) {
    const p = lv('lbBooks'), life = lv('lbLife');
    if (p < 0.01 || !SP) return;
    const u = VU(), w = (PORT ? 30 : 42) * u;
    ctx.save();
    bookPts().forEach(([x, y, isLife], i) => {
      const o = clamp(p * 1.8 - Math.abs(i - 2) * 0.2, 0, 1);
      if (o <= 0) return;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, isLife ? SP.gold : SP.white, x, y - w * 0.2, w * (isLife ? 1.6 + life : 1.1), o * (isLife ? 0.35 + 0.35 * life : 0.3));
      ctx.globalCompositeOperation = 'source-over';
      book(ctx, x, y, w * (isLife ? 1.25 : 1), isLife ? Math.max(0.15 * o, life) : o, o, isLife);
    });
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawDead(ctx) {
    const k = lv('lbDead');
    if (k < 0.01 || !SP) return;
    const u = VU(), x0 = PORT ? 0.04 : 0.53;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < (PORT ? 36 : 60); i++) {
      const f = lerp(x0, 0.99, hsh(i * 2.1)), row = i % 3, x = f * W.w;
      const y = Math.min(gY(0, f), W.horizonY) + (row * 0.018 + 0.004) * W.h;
      const h = (10 + 6 * hsh(i * 5.7) - row) * u;
      lightFigure(ctx, x, y, h, k * (0.45 + 0.2 * Math.sin(W.t + i)), i, 'rgb(255,252,244)', 0.2);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawSeaRise(ctx) {
    const p = lv('lbSeaRise');
    if (p <= 0.001 || p >= 0.999 || !SP) return;
    const u = VU(), [tx, ty] = px(G('th'));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 34; i++) {
      const t0 = hsh(i * 3.9) * 0.6, q = (p - t0) / 0.4;
      if (q <= 0 || q >= 1) continue;
      const sx = (PORT ? 0.03 + 0.4 * hsh(i * 1.3) : 0.03 + 0.44 * hsh(i * 1.3)) * W.w, sy = (0.64 + 0.3 * hsh(i * 7.3)) * W.h;
      const e = ease(q), x = lerp(sx, lerp(tx, sx, 0.4), e), y = lerp(sy, ty + 0.15 * W.h, e);
      glowAt(ctx, SP.pale, x, y, 6 * u, Math.sin(Math.PI * q) * 0.8);
      glowAt(ctx, SP.white, x, y, 2.4 * u, Math.sin(Math.PI * q));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function trans(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    const u = VU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of FXL) {
      const k = clamp(q.t / q.dur, 0, 1), env = Math.sin(Math.PI * k);
      if (q.type === 'flare') {
        const [x, y] = q.at();
        glowAt(ctx, SP.white, x, y, (q.r || 30) * u * (0.6 + k), env * (q.a || 0.8));
        glowAt(ctx, SP.gold, x, y, (q.r || 30) * u * 2.2 * (0.6 + k), env * (q.a || 0.8) * 0.4);
      } else if (q.type === 'comet') {
        const [ax, ay] = q.from(), [bx, by] = q.to(), e = eIn(k), x = lerp(ax, bx, e), y = lerp(ay, by, e);
        if (k < 0.98) {
          for (let j = 0; j < 8; j++) { const e2 = eIn(Math.max(0, k - j * 0.025)); glowAt(ctx, q.col === 'fire' ? SP.fire : SP.white, lerp(ax, bx, e2), lerp(ay, by, e2), (10 - j) * u, 0.7 * (1 - j / 8)); }
          glowAt(ctx, SP.white, x, y, 6 * u, 1);
        }
      } else if (q.type === 'rise') {
        for (const p of q.pts) {
          const t = clamp((q.t - p[4]) / 3.1, 0, 1);
          if (t <= 0 || t >= 1) continue;
          const e = ease(t), x = lerp(p[0], p[2], e) + p[5] * Math.sin(Math.PI * e) * 90 * u, y = lerp(p[1], p[3], e);
          const a = Math.min(1, t * 5) * (1 - smoothstep(0.78, 1, t));
          glowAt(ctx, q.gold ? SP.gold : SP.warm, x, y, 10 * u, a * 0.5);
          glowAt(ctx, SP.white, x, y, 3.6 * u, a * 0.95);
        }
      } else if (q.type === 'tears') {
        for (const p of q.pts) {
          const y = p[1] - k * 30 * u;
          glowAt(ctx, SP.pale, p[0] + Math.sin(k * 6 + p[2]) * 3 * u, y, 3.5 * u, (1 - k) * 0.9);
        }
      } else if (q.type === 'splash') {
        const [x, y] = q.at;
        ctx.strokeStyle = 'rgb(220,236,255)'; ctx.lineWidth = Math.max(0.8, 1.4 * u);
        for (let i = 0; i < 3; i++) { const t = clamp(k * 1.4 - i * 0.2, 0, 1); if (t <= 0) continue; ctx.globalAlpha = (1 - t) * 0.8; ctx.beginPath(); ctx.ellipse(x, y, (8 + 70 * t) * u, (3 + 16 * t) * u, 0, 0, TAU); ctx.stroke(); }
        for (let i = 0; i < 14; i++) {
          const a = -Math.PI * (0.1 + 0.8 * hsh(i * 3.3)), v = (40 + 70 * hsh(i * 1.7)) * u, t = k * 1.3;
          const xx = x + Math.cos(a) * v * t, yy = y + Math.sin(a) * v * t + 90 * u * t * t;
          if (yy > y + 4) continue;
          glowAt(ctx, SP.pale, xx, yy, 3 * u, (1 - k) * 0.9);
        }
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const heavenPass = () => (lv('lbWhite') > 0.5 ? 'air' : 'sky');
  function drawHeaven(ctx) {
    U.safe('lamb.throne', () => drawThrone(ctx));
    U.safe('lamb.thrones', () => drawThrones(ctx));
    U.safe('lamb.glass', () => drawGlass(ctx));
    U.safe('lamb.host', () => drawHost(ctx));
    U.safe('lamb.altar', () => drawAltar(ctx));
    U.safe('lamb.lamb', () => drawLambSky(ctx));
    U.safe('lamb.seven', () => drawSeven(ctx));
    U.safe('lamb.books', () => drawBooks(ctx));
  }
  const SCENE = {
    init() { sprites(); },
    resize() { layout(); },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      if (pass === 'sky') {
        if (heavenPass() === 'sky') drawHeaven(ctx);
        U.safe('lamb.signs', () => drawSigns(ctx));
        U.safe('lamb.four', () => drawFour(ctx));
        U.safe('lamb.open', () => drawOpen(ctx));
        U.safe('lamb.armies', () => drawArmies(ctx));
        U.safe('lamb.rider', () => drawRider(ctx));
        U.safe('lamb.woman', () => drawWoman(ctx));
        U.safe('lamb.dragon', () => drawDragon(ctx));
        U.safe('lamb.war', () => drawWar(ctx));
        U.safe('lamb.auth', () => drawAuth(ctx));
        U.safe('lamb.riders', () => drawRiders(ctx));
        U.safe('lamb.starfall', () => drawStarfall(ctx));
        return;
      }
      if (pass === 'far') { U.safe('lamb.refuge', () => drawRefuge(ctx)); return; }
      if (pass === 'mid') { U.safe('lamb.city', () => drawCity(ctx)); return; }
      if (pass === 'near') {
        U.safe('lamb.zion', () => drawZion(ctx));
        U.safe('lamb.ground', () => drawGroundLight(ctx));
        U.safe('lamb.pit', () => drawPit(ctx));
        U.safe('lamb.beast', () => drawBeast(ctx));
        U.safe('lamb.haze', () => drawHaze(ctx));
        U.safe('lamb.lambZ', () => drawLambZion(ctx));
        return;
      }
      if (pass === 'air') {
        U.safe('lamb.white', () => drawWhite(ctx));
        if (heavenPass() === 'air') drawHeaven(ctx);
        U.safe('lamb.dead', () => drawDead(ctx));
        U.safe('lamb.smoke', () => drawSmoke(ctx));
        U.safe('lamb.mighty', () => drawMighty(ctx));   // 在烟之上：光不被烟遮成灰
        U.safe('lamb.kingdom', () => drawKingdom(ctx));
        U.safe('lamb.authE', () => drawAuthEarth(ctx));
        U.safe('lamb.spring', () => drawSpring(ctx));
        U.safe('lamb.people', () => drawPeople(ctx));
        U.safe('lamb.table', () => drawTable(ctx));
        U.safe('lamb.stone', () => drawStone(ctx));
        U.safe('lamb.binder', () => drawBinder(ctx));
        U.safe('lamb.lambM', () => drawLambMove(ctx));
        U.safe('lamb.searise', () => drawSeaRise(ctx));
        U.safe('lamb.trans', () => drawTransients(ctx));
      }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px_, py_) => { const d = Math.hypot(px_ - x, py_ - y); if (d < r && (!best || d < best.d)) best = { label, x: px_, y: py_, d }; };
      const u = VU();
      if (lv('lbHeaven') > 0.3) {
        const [tx, ty] = px(G('th'));
        consider('宝座', tx, ty - 20 * u);
        const g = G('glass'); consider('玻璃海', (g[0] - g[2] * 0.6) * W.w, g[1] * W.h);
        const [ax, ay] = px(G('altar')); consider('金坛', ax, ay - 18 * u);
      }
      if (lv('lbLamb') > 0.3) { const [lx, ly] = lambPos(); consider('羔羊', lx, ly - lambSize() * 0.8); }
      if (lv('lbScroll') > 0.3 && lv('lbLambGo') < 0.02) { const [sx, sy] = scrollPt(); consider('书卷', sx, sy - 6); }
      if (lv('lbSeven') > 0.3) { const [sx, sy] = sevenPt(3); consider('七位天使', sx, sy - sevenH()); }
      if (lv('lbFour') > 0.3) for (const q of G('four')) consider('四位天使', q[0] * W.w, q[1] * W.h - 40 * u);
      if (lv('lbMighty') > 0.3) { const g = mightyGeom(); consider('大力的天使', g.cx, g.head); }
      if (lv('lbWoman') > 0.3 && lv('lbFlee') < 0.9) { const [wx, wy] = womanPos(); consider('妇人', wx, wy - womanH() * 0.6); }
      if (lv('lbRefuge') > 0.3) { const f = G('refuge'); consider('妇人', f[0] * W.w, f[1] * W.h - 10); }
      if (lv('lbDragon') > 0.3 && lv('lbCast') < 0.8) { const [dx, dy] = dragonC(); consider('龙', dx, dy); }
      if (lv('lbHaze') > 0.3 && lv('lbBound') < 0.8) { const [hx, hy] = hazePos(); consider('龙', hx, hy - 12); }
      if (lv('lbMichael') > 0.3) { const [mx, my] = michaelPt(); consider('米迦勒', mx, my - 40 * u); }
      if (lv('lbBeastA') > 0.3 && lv('lbBeast') > 0.3) { const b = G('beast'); consider('兽', b[0] * W.w, lerp(b[1], b[2], 0.6) * W.h); }
      { const z = zionGeom(); consider('锡安山', z.top[0], z.top[1] + 10); }
      if (lv('lbCity') > 0.3) { const m = cityModel(); consider('巴比伦', m.zg * W.w, gY(1, m.zg) - 40 * CS()); }
      if (lv('lbTable') > 0.3) { const t = G('table'); const f = lerp(t[0], t[1], 0.3); consider('筵席', f * W.w, gY(2, f) - PH() * 0.3); }
      if (lv('lbRider') > 0.3 && lv('lbRiderA') > 0.3) { const [rx, ry] = riderPt(); consider('白马', rx, ry - 20 * riderK()); }
      if (lv('lbArmies') > 0.5 && lv('lbRiderA') > 0.3) { const [rx, ry] = riderPt(); consider('众军', rx + 0.1 * W.w, ry); }
      if (lv('lbPit') > 0.3) { const [ppx, ppy] = pitPt(); consider('无底坑', ppx, ppy - 4); }
      if (lv('lbSpringA') > 0.3 && lv('lbSpring') > 0.9) { const f = G('spring'); consider('生命水的泉源', f * W.w, gY(2, f) - 6); }
      if (lv('lbLife') > 0.3) { const bp = bookPts()[2]; consider('生命册', bp[0], bp[1] - 14 * u); }
      return best;
    },
  };

  function resetScene() { FXL.length = 0; S = fresh(); CITY = null; GRAD = {}; }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：夜，异象中的天与地
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    W.set('bare', 0.08, true); W.set('bloom', 0.5, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.25, land: 1, grass: 0.8, herbs: 0.6, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    for (const k of ['lbHeaven', 'lbLamb', 'lbScroll', 'lbAltar', 'lbCity']) W.set(k, 1, true);
    W.set('lbCityLit', 1, true);
    W.freeClock = false;
    W.weatherExclude = [];
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.66, W.ridgeBaseY(2, W.w * 0.66));
    W.setOrigin('trees', W.w * 1.02, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.9, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 40, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 6, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    add('john', Object.assign({}, LOOK().john || { label: '约翰', sex: 'm', age: 'adult' }, { x: G('john'), layer: 2, v: PORT ? 0.12 : 0.08, facing: 1, pose: 'gaze', glow: 0.4 }));
    const f = G('folk');
    crowd('folk', { n: G('folkN'), x0: f[0], x1: f[1], layer: 2, label: '住在地上的人', pose: 'gaze', glow: 0.3 }, dressFolk(f[0], f[1], '住在地上的人'));
    avoid([0.35, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的故事约三十秒；经文一行显出 hold 秒，行与行之间 1.3 秒
  // ════════════════════════════════════════════════════════════
  const GAP = 1.3;
  function starts(V) { const o = []; let t = 0; for (const l of V) { o.push(t); t += l.hold + GAP; } return o; }
  const R = '启示录 ';
  const V1 = [
    { text: '我看见羔羊揭开七印中第一印的时候，就听见四活物中的一个活物，<br>声音如雷，说：「你来！」', ref: R + '6:1', hold: 6 },
    { text: '我就观看，见有一匹白马；骑在马上的，拿着弓，<br>并有冠冕赐给他。他便出来，胜了又要胜。', ref: R + '6:2', hold: 6.5 },
    { text: '揭开第二印的时候……就另有一匹马出来，是红的，<br>有权柄给了那骑马的，可以从地上夺去太平……', ref: R + '6:3–4', hold: 6.5 },
    { text: '揭开第三印的时候……我就观看，见有一匹黑马……<br>揭开第四印的时候……见有一匹灰色马；骑在马上的，名字叫作死，阴府也随着他……', ref: R + '6:5–8', hold: 7.5 },
  ];
  const V2 = [
    { text: '揭开第五印的时候，我看见在祭坛底下，<br>有为神的道、并为作见证被杀之人的灵魂，', ref: R + '6:9', hold: 6 },
    { text: '于是有白衣赐给他们各人；又有话对他们说，还要安息片时，<br>等着一同作仆人的和他们的弟兄也像他们被杀，满足了数目。', ref: R + '6:11', hold: 7.5 },
    { text: '揭开第六印的时候，我又看见地大震动，<br>日头变黑像毛布，满月变红像血，', ref: R + '6:12', hold: 6 },
    { text: '天上的星辰坠落于地，如同无花果树被大风摇动，<br>落下未熟的果子一样。', ref: R + '6:13', hold: 6 },
  ];
  const V3 = [
    { text: '此后，我看见四位天使站在地的四角，执掌地上四方的风，<br>叫风不吹在地上、海上，和树上。', ref: R + '7:1', hold: 6.5 },
    { text: '此后，我观看，见有许多的人，没有人能数过来，是从各国、各族、各民、各方来的，<br>站在宝座和羔羊面前，身穿白衣，手拿棕树枝，', ref: R + '7:9', hold: 8 },
    { text: '……这些人是从大患难中出来的，曾用羔羊的血把衣裳洗白净了。', ref: R + '7:14', hold: 5.5 },
    { text: '因为宝座中的羔羊必牧养他们，领他们到生命水的泉源；<br>神也必擦去他们一切的眼泪。', ref: R + '7:17', hold: 7 },
  ];
  const V4 = [
    { text: '羔羊揭开第七印的时候，天上寂静约有二刻。', ref: R + '8:1', hold: 5.5 },
    { text: '我看见那站在神面前的七位天使，有七枝号赐给他们。', ref: R + '8:2', hold: 5.5 },
    { text: '另有一位天使，拿着金香炉来，站在祭坛旁边……<br>那香的烟和众圣徒的祈祷<br>从天使的手中一同升到神面前。', ref: R + '8:3–4', hold: 7.5 },
    { text: '天使拿着香炉，盛满了坛上的火，倒在地上；<br>随有雷轰、大声、闪电、地震。', ref: R + '8:5', hold: 6 },
  ];
  const V5 = [
    { text: '第五位天使吹号，我就看见一个星从天落到地上……它开了无底坑，<br>便有烟从坑里往上冒，好像大火炉的烟；日头和天空都因这烟昏暗了。', ref: R + '9:1–2', hold: 7.5 },
    { text: '我又看见另有一位大力的天使从天降下，披着云彩，头上有虹，<br>脸面像日头，两脚像火柱……他右脚踏海，左脚踏地，', ref: R + '10:1–2', hold: 7.5 },
    { text: '但在第七位天使吹号发声的时候，神的奥秘就成全了，<br>正如神所传给他仆人众先知的佳音。', ref: R + '10:7', hold: 6 },
    { text: '第七位天使吹号，天上就有大声音说：<br>世上的国成了我主和主基督的国；他要作王，直到永永远远。', ref: R + '11:15', hold: 6.5 },
  ];
  const V6 = [
    { text: '天上现出大异象来：有一个妇人身披日头，<br>脚踏月亮，头戴十二星的冠冕。', ref: R + '12:1', hold: 6 },
    { text: '天上又现出异象来：有一条大红龙，七头十角……<br>它的尾巴拖拉着天上星辰的三分之一，摔在地上。', ref: R + '12:3–4', hold: 7 },
    { text: '妇人生了一个男孩子，是将来要用铁杖辖管万国的；<br>她的孩子被提到神宝座那里去了。', ref: R + '12:5', hold: 6.5 },
    { text: '妇人就逃到旷野，在那里有神给她预备的地方，<br>使她被养活一千二百六十天。', ref: R + '12:6', hold: 6 },
  ];
  const V7 = [
    { text: '在天上就有了争战。米迦勒同他的使者与龙争战，<br>龙也同它的使者去争战，', ref: R + '12:7', hold: 5.5 },
    { text: '并没有得胜，天上再没有它们的地方。大龙就是那古蛇，名叫魔鬼，又叫撒但，是迷惑普天下的。<br>它被摔在地上，它的使者也一同被摔下去。', ref: R + '12:8–9', hold: 8 },
    { text: '我听见在天上有大声音说：「我神的救恩、能力、国度，<br>并他基督的权柄，现在都来到了！……」', ref: R + '12:10', hold: 6 },
    { text: '弟兄胜过它，是因羔羊的血和自己所见证的道。<br>他们虽至于死，也不爱惜性命。', ref: R + '12:11', hold: 6 },
  ];
  const V8 = [
    { text: '我又看见一个兽从海中上来，有十角七头……', ref: R + '13:1', hold: 5 },
    { text: '我又观看，见羔羊站在锡安山，同他又有十四万四千人，<br>都有他的名和他父的名写在额上。', ref: R + '14:1', hold: 6.5 },
    { text: '我听见从天上有声音，像众水的声音和大雷的声音，<br>并且我所听见的好像弹琴的所弹的琴声。', ref: R + '14:2', hold: 6 },
    { text: '我听见从天上有声音说：「你要写下：从今以后，在主里面而死的人有福了！」<br>圣灵说：「是的，他们息了自己的劳苦，做工的果效也随着他们。」', ref: R + '14:13', hold: 8.5 },
  ];
  const V9 = [
    { text: '我看见仿佛有玻璃海，其中有火搀杂……都站在玻璃海上，拿着神的琴，<br>唱神仆人摩西的歌和羔羊的歌……', ref: R + '15:2–3', hold: 7 },
    { text: '我听见有大声音从殿中出来，向那七位天使说：<br>「你们去，把盛神大怒的七碗倒在地上。」', ref: R + '16:1', hold: 6 },
    { text: '第七位天使把碗倒在空中，就有大声音从殿中的宝座上出来，说：「成了！」', ref: R + '16:17', hold: 5.5 },
    { text: '又有闪电、声音、雷轰、大地震……<br>那大城裂为三段，列国的城也都倒塌了；', ref: R + '16:18–19', hold: 6 },
  ];
  const V10 = [
    { text: '他们与羔羊争战，羔羊必胜过他们，因为羔羊是万主之主、万王之王。<br>同着羔羊的，就是蒙召、被选、有忠心的，也必得胜。', ref: R + '17:14', hold: 7.5 },
    { text: '此后，我看见另有一位有大权柄的天使从天降下，地就因他的荣耀发光。<br>他大声喊着说：巴比伦大城倾倒了！倾倒了！……', ref: R + '18:1–2', hold: 7 },
    { text: '我又听见从天上有声音说：我的民哪，你们要从那城出来，<br>免得与她一同有罪，受她所受的灾殃；', ref: R + '18:4', hold: 6 },
    { text: '有一位大力的天使举起一块石头，好像大磨石，扔在海里……<br>灯光在你中间决不能再照耀……', ref: R + '18:21–23', hold: 6.5 },
  ];
  const V11 = [
    { text: '此后，我听见好像群众在天上大声说：<br>哈利路亚！救恩、荣耀、权能都属乎我们的神！', ref: R + '19:1', hold: 6 },
    { text: '我听见好像群众的声音，众水的声音，大雷的声音，说：<br>哈利路亚！因为主我们的神、全能者作王了。', ref: R + '19:6', hold: 6.5 },
    { text: '我们要欢喜快乐，将荣耀归给他。因为，羔羊婚娶的时候到了；<br>新妇也自己预备好了，就蒙恩得穿光明洁白的细麻衣。', ref: R + '19:7–8', hold: 7.5 },
    { text: '天使吩咐我说：「你要写上：凡被请赴羔羊之婚筵的有福了！」<br>又对我说：「这是神真实的话。」', ref: R + '19:9', hold: 6.5 },
  ];
  const V12 = [
    { text: '我观看，见天开了。有一匹白马，骑在马上的称为诚信真实，<br>他审判，争战，都按着公义。', ref: R + '19:11', hold: 6.5 },
    { text: '他的眼睛如火焰，他头上戴着许多冠冕……<br>他的名称为神之道。', ref: R + '19:12–13', hold: 5.5 },
    { text: '在天上的众军骑着白马，穿着细麻衣，又白又洁，跟随他。', ref: R + '19:14', hold: 5.5 },
    { text: '在他衣服和大腿上有名写着说：「万王之王，万主之主。」', ref: R + '19:16', hold: 6 },
  ];
  const V13 = [
    { text: '我又看见一位天使从天降下，手里拿着无底坑的钥匙和一条大链子。<br>他捉住那龙……把它捆绑一千年，', ref: R + '20:1–2', hold: 7 },
    { text: '扔在无底坑里，将无底坑关闭，用印封上，使它不得再迷惑列国……', ref: R + '20:3', hold: 5.5 },
    { text: '我又看见几个宝座，也有坐在上面的，并有审判的权柄赐给他们……<br>他们都复活了，与基督一同作王一千年。', ref: R + '20:4', hold: 7 },
    { text: '在头一次复活有分的有福了，圣洁了！第二次的死在他们身上没有权柄。<br>他们必作神和基督的祭司，并要与基督一同作王一千年。', ref: R + '20:6', hold: 7.5 },
  ];
  const V14 = [
    { text: '我又看见一个白色的大宝座与坐在上面的；<br>从他面前天地都逃避，再无可见之处了。', ref: R + '20:11', hold: 6.5 },
    { text: '我又看见死了的人，无论大小，都站在宝座前。<br>案卷展开了，并且另有一卷展开，就是生命册……', ref: R + '20:12', hold: 7 },
    { text: '于是海交出其中的死人；死亡和阴间也交出其中的死人；<br>他们都照各人所行的受审判。', ref: R + '20:13', hold: 6.5 },
    { text: '死亡和阴间也被扔在火湖里；这火湖就是第二次的死。', ref: R + '20:14', hold: 5.5 },
  ];

  // 情节里常用的几样
  const throneAt = () => px(G('th'));
  function sealBreak(b, n) {
    S.seals = n;
    const s = lambSize();
    trans(b, { type: 'flare', at: () => { const [x, y] = scrollPt(); return [x, y + 0.08 * s]; }, r: 14, dur: 1.6, a: 0.9 });
    sfx(b, 'seal', { soft: true });
  }
  function ride(b, i) { run(b, 'lbRide' + i); sfx(b, 'hooves', { soft: i !== 1 }); sfx(b, 'wind', { soft: true }); }
  function blow(b, n) {
    S.blown = n;
    if (!b.instant) { const [x, y] = sevenPt(n - 1), h = sevenH(), d = x < G('th')[0] * W.w ? -1 : 1; ringAt(b, x + d * 0.34 * h, y - 1.02 * h, 0.07, [255, 226, 160], 1.4, 1.2); }
    sfx(b, 'trumpet', { soft: n < 7 });
  }
  function headsOf(gid) {
    const out = [];
    for (const m of members(gid)) if (m._vis) out.push([m._x, m._y - headK(m) * (m._h || PH())]);
    return out;
  }
  // 众人头上的光升上去（祈祷 / 复活）：只是画面——柔和的圆光（本幕的转瞬之层），不是方的粒子
  function riseFrom(b, gids, to, gold) {
    if (b.instant) return;
    const [tx, ty] = to, pts = [];
    let i = 0;
    for (const g of gids) for (const h of headsOf(g)) {
      pts.push([h[0], h[1], tx + (hsh(i * 3.1) - 0.5) * 36, ty + (hsh(i * 5.7) - 0.5) * 14, hsh(i * 1.9) * 1.2, (hsh(i * 2.3) - 0.5) * 0.6]);
      i++;
    }
    if (pts.length) trans(b, { type: 'rise', pts, dur: 4.4, gold: !!gold });
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 6:1 羔羊揭开七印中第一印 ─────────────────────────────
    {
      kind: 'act', utter: '羔羊揭开七印中第一印', cmd: 'unseal --seal 1..4  # 白 红 黑 灰', ref: '6:1',
      verse: V1,
      apply(c) {
        const s = starts(V1);
        T(c, [
          [0, b => {
            sealBreak(b, 1);
            setL(b, 'lbLambGlow', 0.6);
            W.goTo(0.95, 22, b.instant);
            pose('john', 'gaze'); face('john', 1);
          }],
          [1.6, b => { sfx(b, 'thunder', { soft: true, far: true }); flashW(b, 0.08); }],
          [s[1] - 0.6, b => ride(b, 1)],
          [s[2], b => { sealBreak(b, 2); setL(b, 'lbLambGlow', 0.3); }],
          [s[2] + 0.8, b => { ride(b, 2); cpose('folk', 'kneel'); }],
          [s[3], b => { sealBreak(b, 3); ride(b, 3); }],
          [s[3] + 3.4, b => { sealBreak(b, 4); ride(b, 4); }],
        ]);
      },
    },

    // ── 2 · 6:11 还要安息片时 ───────────────────────────────────
    {
      kind: 'promise', utter: '还要安息片时', cmd: 'robe --white --each && sleep 片时', ref: '6:11',
      verse: V2,
      apply(c) {
        const s = starts(V2);
        T(c, [
          [0, b => {
            sealBreak(b, 5);
            setL(b, 'lbSouls', 1);
            W.goTo(0.02, 12, b.instant);
            cpose('folk', 'gaze');
            sfx(b, 'harp', { soft: true });
          }],
          [s[1] + 0.8, b => {
            setL(b, 'lbRobes', 1);
            if (!b.instant) { const [ax, ay] = px(G('altar')); sparkleAt(b, ax, ay + 16 * VU(), 30, [250, 250, 255], 26); }
            sfx(b, 'chime');
          }],
          [s[2], b => {
            sealBreak(b, 6);
            shake(b, 0.9);
            sfx(b, 'quake');
            setL(b, 'moon', 0);
            setL(b, 'lbSigns', 1);
            cpose('folk', 'kneel');
            pose('john', 'kneel');
          }],
          [s[3], b => {
            W.set('gale', 0.65, b.instant);
            run(b, 'lbStarfall');
            sfx(b, 'wind');
          }],
        ]);
      },
    },

    // ── 3 · 7:17 神也必擦去他们一切的眼泪 ─────────────────────────
    {
      kind: 'promise', utter: '神也必擦去他们一切的眼泪', cmd: 'hold 四风 && wipe --all 眼泪', ref: '7:17',
      verse: V3,
      apply(c) {
        const s = starts(V3);
        T(c, [
          [0, b => { setL(b, 'lbFour', 1); W.goTo(0.28, 8, b.instant); sfx(b, 'angel', { soft: true }); }],   // 黎明从东方来：7:9 时已亮
          [2.6, b => { W.set('gale', 0, b.instant); sfx(b, 'whisper', { soft: true }); }],
          [s[1], b => {
            // 衣裳洗白净，手拿棕树枝，站在宝座和羔羊面前
            whiten('folk', 0.55, '穿白衣的');
            S.white = 1; S.palms = 1;
            cpose('folk', 'raise');
            pose('john', 'gaze');
            setL(b, 'lbHost', 0.85);
            setL(b, 'lbSigns', 0);
            flashW(b, 0.18);
            if (!b.instant) { const [tx, ty] = throneAt(); ringAt(b, tx, ty, 0.35, [255, 246, 226], 3.4, 1.5); }
            sfx(b, 'sing');
          }],
          [s[2], b => {
            setL(b, 'lbLambGlow', 1);
            if (!b.instant) { const [lx, ly] = lambPos(); ringAt(b, lx, ly - 10, 0.35, [255, 232, 190], 3, 1.4); }
            sfx(b, 'bell', { soft: true });
          }],
          [s[3], b => {
            run(b, 'lbSpring');
            setL(b, 'lbSpringA', 1);
            sfx(b, 'splash', { soft: true });
          }],
          [s[3] + 2.4, b => {
            // 擦去一切的眼泪：泪化作光，散去
            if (!b.instant) { const pts = headsOf('folk').map((h, i) => [h[0], h[1] + 2, i]); trans(b, { type: 'tears', pts, dur: 3.2 }); }
            cpose('folk', 'stand');
            sfx(b, 'harp', { soft: true });
          }],
          [s[3] + 5.2, b => { setL(b, 'lbFour', 0); setL(b, 'lbLambGlow', 0.3); }],
        ]);
      },
    },

    // ── 4 · 8:1 羔羊揭开第七印 ─────────────────────────────────
    {
      kind: 'act', utter: '羔羊揭开第七印', cmd: 'unseal 7 && silence --half-hour', ref: '8:1',
      verse: V4,
      apply(c) {
        const s = starts(V4);
        T(c, [
          [0, b => {
            sealBreak(b, 7);
            setL(b, 'lbScrollOpen', 1);
            setL(b, 'lbHush', 1);
            setL(b, 'lbHost', 0.45);
            setL(b, 'lbSpringA', 0.35);
            cpose('folk', 'pray');
            pose('john', 'kneel');
            W.goTo(0.36, 12, b.instant);
          }],
          [s[1], b => { setL(b, 'lbHush', 0); setL(b, 'lbSeven', 1); sfx(b, 'angel'); }],
          [s[2], b => {
            setL(b, 'lbCenser', 1);
            run(b, 'lbIncense');
            riseFrom(b, ['folk'], px(G('altar')), false);
            sfx(b, 'harp', { soft: true });
          }],
          [s[3], b => {
            // 盛满了坛上的火，倒在地上
            const from = () => { const [ax, ay] = px(G('altar')); return [ax + 14 * VU(), ay - 24 * VU()]; };
            trans(b, { type: 'comet', from, to: () => [0.72 * W.w, gY(2, 0.72) - 6], col: 'fire', dur: 1.4 });
            sfx(b, 'fire', { soft: true });
          }],
          [s[3] + 1.4, b => {
            if (GS.weather && GS.weather.bolt) { GS.weather.bolt({ x: 0.66 }); GS.weather.bolt({ x: 0.86 }); }
            shake(b, 0.8);
            sfx(b, 'thunder'); sfx(b, 'quake', { soft: true });
            W.set('storm', 0.35, b.instant);
            setL(b, 'lbHost', 0);
            setL(b, 'lbSpringA', 0);
            cpose('folk', 'kneel');
          }],
        ]);
      },
    },

    // ── 5 · 11:15 世上的国成了我主和主基督的国 ─────────────────────
    {
      kind: 'act', utter: '世上的国成了我主和主基督的国', cmd: 'transfer 世上的国 --to 主和基督 --forever', ref: '11:15',
      verse: V5,
      apply(c) {
        const s = starts(V5);
        T(c, [
          [0, b => { blow(b, 1); setL(b, 'lbCenser', 0); setL(b, 'lbScrollOpen', 0); setL(b, 'lbScroll', 0); }],
          [0.7, b => { blow(b, 2); W.set('hail', 0.3, b.instant); }],
          [1.4, b => blow(b, 3)],
          [2.1, b => { blow(b, 4); W.set('gloom', 0.25, b.instant); }],
          [2.8, b => { blow(b, 5); W.set('hail', 0, b.instant); }],
          [3.4, b => {
            // 一个星从天落到地上，开了无底坑
            trans(b, { type: 'comet', from: () => [0.3 * W.w, 0.08 * W.h], to: () => pitPt(), dur: 1.3 });
            sfx(b, 'stars');
          }],
          [4.7, b => {
            setL(b, 'lbPit', 1);
            run(b, 'lbSmoke');
            setL(b, 'lbSmokeA', 1);
            W.set('gloom', 0.5, b.instant);
            shake(b, 0.4);
            sfx(b, 'quake', { soft: true }); sfx(b, 'fire', { soft: true, far: true });
            cface('folk', G('pit'));
          }],
          [s[1], b => {
            setL(b, 'lbMighty', 1);
            setL(b, 'lbSeven', 0);
            setL(b, 'lbHeaven', 0.55);
            setL(b, 'lbSmokeA', 0.35);
            W.set('gloom', 0.12, b.instant);
            W.set('storm', 0.1, b.instant);
            sfx(b, 'angel');
            cface('folk', 0.58); face('john', 1); pose('john', 'gaze');
          }],
          [s[1] + 3.6, b => { sfx(b, 'thunder', { soft: true, far: true }); }],
          [s[2], b => { setL(b, 'lbOath', 1); S.blown = 6; sfx(b, 'trumpet', { soft: true, far: true }); }],
          [s[2] + 3.4, b => { setL(b, 'lbMighty', 0); setL(b, 'lbOath', 0); }],   // 升回天上：第七号之前已去
          [s[3] - 0.8, b => { setL(b, 'lbSeven', 1); setL(b, 'lbHeaven', 1); }],
          [s[3], b => {
            blow(b, 7);
            setL(b, 'lbKingdom', 1);
            setL(b, 'lbSmokeA', 0);
            W.set('gloom', 0, b.instant);
            W.set('storm', 0, b.instant);
            W.goTo(0.4, 8, b.instant);
            cpose('folk', 'bow');
            pose('john', 'kneel');
            flashW(b, 0.2);
            if (!b.instant) { const [tx, ty] = throneAt(); ringAt(b, tx, ty, 0.35, [255, 236, 180], 3.6, 1.5); }
            sfx(b, 'sing'); sfx(b, 'bell');
          }],
          [s[3] + 4.2, b => { setL(b, 'lbKingdom', 0.3); }],
        ]);
      },
    },

    // ── 6 · 12:1 天上现出大异象来 ──────────────────────────────
    {
      kind: 'act', utter: '天上现出大异象来', cmd: 'render 大异象 --sun --moon --stars 12', ref: '12:1',
      verse: V6,
      apply(c) {
        const s = starts(V6);
        T(c, [
          [0, b => {
            setL(b, 'lbWoman', 1);
            setL(b, 'lbSeven', 0);
            setL(b, 'lbKingdom', 0.15);
            W.goTo(0.8, 14, b.instant);
            cpose('folk', 'gaze'); pose('john', 'gaze');
            cface('folk', G('woman')[0]);
            sfx(b, 'harp'); sfx(b, 'stars', { soft: true });
          }],
          [s[1], b => { setL(b, 'lbDragon', 1); sfx(b, 'thunder', { soft: true, far: true }); }],
          [s[1] + 2.4, b => { run(b, 'lbSweep'); sfx(b, 'wind'); }],
          [s[2], b => { run(b, 'lbChild'); sfx(b, 'chime'); }],
          [s[2] + 3.4, b => {
            trans(b, { type: 'flare', at: throneAt, r: 34, dur: 2.2 });
            sfx(b, 'bell', { soft: true });
          }],
          [s[3], b => { run(b, 'lbFlee'); sfx(b, 'wings'); }],
          [s[3] + 4, b => { setL(b, 'lbRefuge', 1); }],
        ]);
      },
    },

    // ── 7 · 12:8 天上再没有它们的地方 ──────────────────────────
    {
      kind: 'judge', utter: '天上再没有它们的地方', cmd: 'evict 龙 --from 天上 --no-return', ref: '12:8',
      verse: V7,
      apply(c) {
        const s = starts(V7);
        T(c, [
          [0, b => {
            setL(b, 'lbMichael', 1);
            run(b, 'lbWar');
            W.goTo(0.96, 10, b.instant);
            cface('folk', G('dragon')[0]);
            sfx(b, 'angel'); sfx(b, 'wind', { soft: true });
          }],
          [s[1], b => {
            run(b, 'lbCast');
            // 米迦勒的光一路压着它：一道火的尾迹，夜里也看得见它坠落
            trans(b, { type: 'comet', from: () => { const d = G('dragon'); return [(d[0] + 0.04) * W.w, (d[1] - 0.03) * W.h]; }, to: () => { const h = hazeBase(); return [h[0], h[1] - 0.02 * W.h]; }, col: 'fire', dur: 2.6 });
            trans(b, { type: 'flare', at: () => { const [x, y] = michaelPt(); return [x, y - 0.07 * W.h]; }, r: 30, dur: 2.2, a: 0.7 });
            sfx(b, 'thunder');
          }],
          [s[1] + 2.7, b => {
            setL(b, 'lbHaze', 1);
            setL(b, 'lbDragon', 0);
            shake(b, 0.55);
            sfx(b, 'collapse', { soft: true });
            cpose('folk', 'kneel');
          }],
          [s[2], b => {
            trans(b, { type: 'flare', at: throneAt, r: 46, dur: 2.6 });
            if (!b.instant) { const [tx, ty] = throneAt(); ringAt(b, tx, ty, 0.4, [255, 246, 226], 3.2, 1.5); }
            cpose('folk', 'raise'); pose('john', 'raise');
            sfx(b, 'bell'); sfx(b, 'sing', { soft: true });
          }],
          [s[3], b => { setL(b, 'lbLambGlow', 1); setL(b, 'lbRobes', 1); setL(b, 'lbSouls', 1); sfx(b, 'harp', { soft: true }); }],
          [s[3] + 4.2, b => { setL(b, 'lbMichael', 0); setL(b, 'lbLambGlow', 0.3); cpose('folk', 'stand'); pose('john', 'gaze'); }],
        ]);
      },
    },

    // ── 8 · 14:13 是的，他们息了自己的劳苦 ─────────────────────────
    {
      kind: 'bless', utter: '是的，他们息了自己的劳苦', cmd: 'rest --from 劳苦 && follow(果效)', ref: '14:13',
      verse: V8,
      apply(c) {
        const s = starts(V8);
        T(c, [
          [0, b => {
            run(b, 'lbBeast');
            setL(b, 'lbBeastA', 1);
            setL(b, 'lbHaze', 0.35);
            W.goTo(0.27, 20, b.instant);
            cface('folk', G('beast')[0]); face('john', -1);
            sfx(b, 'wave'); sfx(b, 'thunder', { soft: true, far: true });
          }],
          [s[1], b => { run(b, 'lbLambGo'); setL(b, 'lbLambGlow', 0.8); sfx(b, 'bleat', { soft: true }); }],
          [s[1] + 3.5, b => {
            setL(b, 'lbZion', 1);
            setL(b, 'lbMarks', 1);
            setL(b, 'lbBeastA', 0.14);
            cface('folk', G('zion')); face('john', 1);
            cpose('folk', 'gaze');
            if (!b.instant) { const z = zionGeom().top; ringAt(b, z[0], z[1] - 10, 0.6, [255, 236, 190], 3, 1.6); }
            sfx(b, 'bell', { soft: true });
          }],
          [s[2], b => {
            if (!b.instant) { const [tx, ty] = throneAt(); for (let i = 0; i < 3; i++) ringAt(b, tx, ty + i * 6, 0.4 + i * 0.25, [255, 236, 200], 3 + i, 1.2); }
            sfx(b, 'harp'); sfx(b, 'sing', { soft: true });
          }],
          [s[2] + 2.4, b => sfx(b, 'lyre', { soft: true })],
          [s[3], b => {
            setL(b, 'lbRest', 1);
            S.palms = 0;
            cpose('folk', 'sit');
            pose('john', 'sit');
            setL(b, 'lbLambGlow', 0.4);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 9 · 16:17 成了！ ──────────────────────────────────────
    {
      kind: 'cmd', utter: '成了！', cmd: 'exit 0  # 成了', ref: '16:17',
      verse: V9,
      apply(c) {
        const s = starts(V9);
        T(c, [
          [0, b => {
            setL(b, 'lbGlassFire', 1);
            setL(b, 'lbVictors', 1);
            setL(b, 'lbHost', 0.8);
            setL(b, 'lbRest', 0);
            cpose('folk', 'stand'); pose('john', 'gaze');
            cface('folk', G('th')[0]);
            W.goTo(0.4, 12, b.instant);
            sfx(b, 'harp'); sfx(b, 'sing', { soft: true });
          }],
          [s[1], b => { setL(b, 'lbGlory', 1); S.bowls = 1; setL(b, 'lbSeven', 1); setL(b, 'lbHost', 0.3); sfx(b, 'bell', { soft: true }); }],
          [s[1] + 1.8, b => {
            run(b, 'lbBowls');
            W.set('gloom', 0.3, b.instant);
            W.set('lbCityLit', 0.7, b.instant);
            sfx(b, 'pour', { soft: true });
          }],
          [s[2], b => {
            trans(b, { type: 'flare', at: throneAt, r: 60, dur: 2.4, a: 1 });
            flashW(b, 0.35);
            sfx(b, 'thunder');
          }],
          [s[2] + 1.2, b => {
            if (GS.weather && GS.weather.bolt) { GS.weather.bolt({ x: 0.7 }); GS.weather.bolt({ x: 0.9, front: true }); }
            shake(b, 1);
            sfx(b, 'quake');
            cpose('folk', 'kneel'); pose('john', 'kneel');
          }],
          [s[3], b => {
            run(b, 'lbSplit');
            if (!b.instant && fx()) { const m = cityModel(); for (const f of [lerp(m.x0, m.x1, 0.36), lerp(m.x0, m.x1, 0.7)]) fx().dust(f * W.w, gY(1, f) - 10 * CS(), 30, [190, 170, 140], 16 * CS(), 'mid'); }
            shake(b, 0.6);
            sfx(b, 'collapse');
          }],
          [s[3] + 3.4, b => {
            W.set('gloom', 0.1, b.instant);
            setL(b, 'lbSeven', 0);
            setL(b, 'lbGlory', 0.25);
            setL(b, 'lbGlassFire', 0.4);
            setL(b, 'lbVictors', 0);
            cpose('folk', 'stand');
          }],
        ]);
      },
    },

    // ── 10 · 18:4 我的民哪，你们要从那城出来 ──────────────────────
    {
      kind: 'call', utter: '我的民哪，你们要从那城出来', cmd: 'git checkout -b 出城  # 我的民', ref: '18:4',
      verse: V10,
      apply(c) {
        const s = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.88, 8, b.instant);
            W.set('gloom', 0, b.instant);
            setL(b, 'lbKings', 1);
            setL(b, 'lbHost', 0);
            cface('folk', G('city')[0] + 0.2);
            pose('john', 'gaze');
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [3.6, b => {
            setL(b, 'lbLambGlow', 1);
            setL(b, 'lbKings', 0.15);
            setL(b, 'lbZion', 1);
            if (!b.instant) { const z = zionGeom().top; ringAt(b, z[0], z[1] - 10, 0.9, [255, 236, 190], 3.4, 1.8); }
            sfx(b, 'bell');
          }],
          [s[1], b => { setL(b, 'lbAuth', 1); sfx(b, 'angel'); sfx(b, 'shout', { soft: true }); }],
          [s[2], b => {
            setL(b, 'lbAuth', 0);
            // 城里的人走出来：提灯的小光从城门沿着城下走到海边
            run(b, 'lbExodus');
            sfx(b, 'crowd', { soft: true });
          }],
          [s[2] + 2.8, b => {
            // 他们上到近岸（就在大城之下的海边），走进众人中间的空处
            const x0 = PORT ? 0.52 : 0.55, x1 = PORT ? 0.56 : 0.6, to = G('outTo');
            crowd('out', { n: to.length, x0, x1, layer: 2, label: '出城的人', pose: 'stand', glow: 0.36 }, dressFolk(x0, x1, '出城的人', PORT ? 0.3 : 0.26));
            walkTo('out', to, { speed: 0.03, pose: 'stand' });
            S.out = 1;
          }],
          [s[3], b => { setL(b, 'lbStoneAng', 1); run(b, 'lbStone'); sfx(b, 'wind', { soft: true }); }],
          [s[3] + 1.8, b => {
            trans(b, { type: 'splash', at: px(G('stoneB')), dur: 2.4 });
            shake(b, 0.5);
            sfx(b, 'splash', { size: 1 }); sfx(b, 'wave');
          }],
          [s[3] + 2.4, b => {
            // 灯光决不能再照耀；大城倾倒，成了荒场，只剩轻烟
            W.set('lbCityLit', 0, b.instant);
            setL(b, 'lbCitySmoke', 1);
            setL(b, 'lbKings', 0);
            setL(b, 'lbStoneAng', 0);
            run(b, 'lbRuin');
            setL(b, 'lbCity', 0.5);
            if (!b.instant && fx()) { const m = cityModel(); for (let i = 0; i < 4; i++) { const f = lerp(m.x0, m.x1, (i + 0.5) / 4); fx().dust(f * W.w, gY(1, f) - 8 * CS(), 26, [150, 132, 112], 22 * CS(), 'mid'); } }
            shake(b, 0.5);
            sfx(b, 'collapse');
          }],
        ]);
      },
    },

    // ── 11 · 19:6 哈利路亚！因为主我们的神、全能者作王了 ─────────────
    {
      kind: 'act', utter: '哈利路亚！因为主我们的神、全能者作王了', cmd: 'echo 哈利路亚 | tee 众水 大雷', ref: '19:6',
      verse: V11,
      apply(c) {
        const s = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.3, 14, b.instant);
            setL(b, 'lbHost', 1);
            setL(b, 'lbCitySmoke', 0.3);
            setL(b, 'lbLambGlow', 0.6);
            sfx(b, 'sing'); sfx(b, 'angel', { soft: true });
          }],
          [1.4, b => nameAt(b, '哈利路亚', PORT ? 0.5 : 0.62, PORT ? 0.52 : 0.42, { hold: 3.4 })],
          [s[1], b => {
            S.palms = 1;
            for (const g of PEOPLE) cpose(g, 'raise');
            pose('john', 'raise');
            flashW(b, 0.22);
            if (!b.instant) { const [tx, ty] = throneAt(); ringAt(b, tx, ty, 0.35, [255, 244, 214], 3.6, 1.5); }
            sfx(b, 'thunder', { soft: true }); sfx(b, 'wave', { soft: true }); sfx(b, 'bell');
          }],
          [s[2], b => {
            // 新妇蒙恩得穿光明洁白的细麻衣
            whiten('folk', 0.45); whiten('out', 0.45, '穿白衣的');
            S.linen = 1;
            setL(b, 'lbLinen', 1);
            if (!b.instant) { const z = zionGeom().top; sparkleAt(b, z[0], z[1] + 20, 50, [255, 252, 244], 90); }
            sfx(b, 'chime');
          }],
          [s[3], b => {
            setL(b, 'lbTable', 1);
            S.palms = 0;
            for (const g of PEOPLE) cpose(g, 'sit');
            pose('john', 'sit');
            setL(b, 'lbLambGlow', 1);
            sfx(b, 'bell', { soft: true }); sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 12 · 19:13 他的名称为神之道 ─────────────────────────────
    {
      kind: 'name', utter: '他的名称为神之道', cmd: 'whoami  # 神之道', ref: '19:13',
      verse: V12,
      apply(c) {
        const s = starts(V12);
        T(c, [
          [0, b => {
            setL(b, 'lbOpen', 1);
            setL(b, 'lbRiderA', 1);
            setL(b, 'lbTable', 0);
            setL(b, 'lbHost', 0.5);
            W.goTo(0.38, 8, b.instant);
            for (const g of PEOPLE) { cpose(g, 'gaze'); cface(g, G('rider1')[0]); }
            pose('john', 'gaze'); face('john', 1);
            sfx(b, 'angel');
          }],
          [1.6, b => { run(b, 'lbRider'); sfx(b, 'hooves'); }],
          [s[1] + 1.2, b => { nameAt(b, '神之道', PORT ? 0.5 : 0.36, PORT ? 0.575 : 0.18, { hold: 3.2 }); sfx(b, 'bell', { soft: true }); }],
          [s[2], b => { run(b, 'lbArmies'); sfx(b, 'hooves', { soft: true }); sfx(b, 'wind', { soft: true }); }],
          [s[2] + 2.2, b => { setL(b, 'lbBeastA', 0); setL(b, 'lbKings', 0); setL(b, 'lbCitySmoke', 0.2); }],
          [s[3], b => {
            nameAt(b, '万王之王', PORT ? 0.5 : 0.36, PORT ? 0.635 : 0.14, { hold: 3.6, rgb: [255, 236, 180] });
            nameAt(b, '万主之主', PORT ? 0.5 : 0.36, PORT ? 0.695 : 0.24, { hold: 3.6, rgb: [255, 236, 180] });
            flashW(b, 0.2);
            for (const g of PEOPLE) cpose(g, 'bow');
            pose('john', 'kneel');
            sfx(b, 'sing');
          }],
        ]);
      },
    },

    // ── 13 · 20:6 在头一次复活有分的有福了，圣洁了！ ───────────────
    {
      kind: 'bless', utter: '在头一次复活有分的有福了，圣洁了！', cmd: 'bind 龙 --years 1000 && seal 无底坑', ref: '20:6',
      verse: V13,
      apply(c) {
        const s = starts(V13);
        T(c, [
          [0, b => {
            setL(b, 'lbBinder', 1);
            setL(b, 'lbOpen', 0);
            setL(b, 'lbRiderA', 0);
            setL(b, 'lbHost', 0);
            setL(b, 'lbHaze', 1);
            for (const g of PEOPLE) { cpose(g, 'stand'); cface(g, G('pit')); }
            face('john', -1); pose('john', 'stand');
            sfx(b, 'angel', { soft: true });
          }],
          [2.8, b => { run(b, 'lbBind'); sfx(b, 'chains'); }],
          [s[1], b => { run(b, 'lbBound'); sfx(b, 'chains', { soft: true }); }],
          [s[1] + 3.2, b => {
            setL(b, 'lbSealPit', 1);
            setL(b, 'lbHaze', 0);
            setL(b, 'lbBinder', 0);
            if (!b.instant) { const [ppx, ppy] = pitPt(); ringAt(b, ppx, ppy, 0.25, [255, 226, 150], 2, 1.6); }
            shake(b, 0.3);
            sfx(b, 'seal');
          }],
          [s[2], b => {
            setL(b, 'lbThrones', 1);
            run(b, 'lbReign');
            riseFrom(b, PEOPLE, throneAt().map((v, i) => v + (i ? 50 * VU() : 0)), true);
            for (const g of PEOPLE) cface(g, G('th')[0]);
            face('john', 1);
            W.goTo(0.37, 13, b.instant);   // 一千年：一日一夜流转
            sfx(b, 'harp');
          }],
          [s[3], b => {
            for (const g of PEOPLE) cpose(g, 'raise');
            pose('john', 'raise');
            if (!b.instant) { for (const h of headsOf('folk')) ringAt(b, h[0], h[1], 0.05, [255, 240, 200], 2.2, 1); }
            sfx(b, 'bell'); sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 14 · 20:12 另有一卷展开，就是生命册 ────────────────────────
    {
      kind: 'act', utter: '另有一卷展开，就是生命册', cmd: 'open 生命册 --read-all', ref: '20:12',
      verse: V14,
      apply(c) {
        const s = starts(V14);
        T(c, [
          [0, b => {
            setL(b, 'lbWhite', 1);
            setL(b, 'lights', 0.05);            // 天地都逃避：日头也隐去
            W.set('lbLambGo', 0, b.instant);
            setL(b, 'lbZion', 0);
            setL(b, 'lbMarks', 0);
            setL(b, 'lbLinen', 0.6);
            setL(b, 'lbCity', 0);
            setL(b, 'lbCitySmoke', 0);
            setL(b, 'lbKingdom', 0);
            setL(b, 'lbRefuge', 0);
            setL(b, 'lbThrones', 0.5);
            W.set('clouds', 0, b.instant);
            for (const g of PEOPLE) { cpose(g, 'stand'); cface(g, G('th')[0]); }
            pose('john', 'gaze'); face('john', 1);
            sfx(b, 'bell'); sfx(b, 'angel', { soft: true });
          }],
          [s[1], b => { setL(b, 'lbDead', 1); run(b, 'lbBooks'); sfx(b, 'scroll'); }],
          [s[1] + 2.6, b => {
            setL(b, 'lbLife', 1);
            const bp = bookPts()[2];
            nameAt(b, '生命册', bp[0] / W.w, bp[1] / W.h + (PORT ? 0.035 : 0.085), { hold: 3.6, rgb: [184, 116, 34] });
            sfx(b, 'chime');
          }],
          [s[2], b => { run(b, 'lbSeaRise'); sfx(b, 'wave', { soft: true }); }],
          [s[3], b => {
            // 死亡和阴间被扔在火湖里：只由经文说出——最后一点黑暗消失
            setL(b, 'lbPit', 0);
            setL(b, 'lbSealPit', 0);
            if (!b.instant) { const [ppx, ppy] = pitPt(); trans(b, { type: 'flare', at: () => [ppx, ppy], r: 26, dur: 2.2, a: 0.7 }); }
            sfx(b, 'seal', { soft: true });
          }],
          [s[3] + 2.4, b => {
            setL(b, 'lbEnd', 1);
            for (const g of PEOPLE) cpose(g, 'bow');
            pose('john', 'kneel');
            if (!b.instant) { const [tx, ty] = throneAt(); ringAt(b, tx, ty, 0.3, [255, 252, 244], 4, 1.5); }
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '启示录', books: [66], title: '羔羊', sub: '启示录 6 — 20', tint: [255, 236, 214], music: 'daniel',
    outro: 24,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '约翰': { text: '我约翰就是你们的弟兄……为神的道，并为给耶稣作的见证，曾在那名叫拔摩的海岛上。', ref: '启示录 1:9' },
      '羔羊': { text: '羔羊必胜过他们，因为羔羊是万主之主、万王之王。', ref: '启示录 17:14' },
      '宝座': { text: '见有一个宝座安置在天上，又有一位坐在宝座上。', ref: '启示录 4:2' },
      '玻璃海': { text: '宝座前好像一个玻璃海，如同水晶。', ref: '启示录 4:6' },
      '金坛': { text: '有许多香赐给他，要和众圣徒的祈祷一同献在宝座前的金坛上。', ref: '启示录 8:3' },
      '书卷': { text: '我看见坐宝座的右手中有书卷，里外都写着字，用七印封严了。', ref: '启示录 5:1' },
      '七位天使': { text: '我看见那站在神面前的七位天使，有七枝号赐给他们。', ref: '启示录 8:2' },
      '四位天使': { text: '我看见四位天使站在地的四角，执掌地上四方的风。', ref: '启示录 7:1' },
      '大力的天使': { text: '我又看见另有一位大力的天使从天降下，披着云彩，头上有虹，脸面像日头，两脚像火柱。', ref: '启示录 10:1' },
      '妇人': { text: '妇人就逃到旷野，在那里有神给她预备的地方。', ref: '启示录 12:6' },
      '龙': { text: '大龙就是那古蛇，名叫魔鬼，又叫撒但，是迷惑普天下的。', ref: '启示录 12:9' },
      '米迦勒': { text: '米迦勒同他的使者与龙争战。', ref: '启示录 12:7' },
      '兽': { text: '我又看见一个兽从海中上来。', ref: '启示录 13:1' },
      '锡安山': { text: '我又观看，见羔羊站在锡安山，同他又有十四万四千人。', ref: '启示录 14:1' },
      '巴比伦': { text: '巴比伦大城倾倒了！倾倒了！', ref: '启示录 18:2' },
      '住在地上的人': { text: '有永远的福音要传给住在地上的人，就是各国、各族、各方、各民。', ref: '启示录 14:6' },
      '穿白衣的': { text: '这些人是从大患难中出来的，曾用羔羊的血把衣裳洗白净了。', ref: '启示录 7:14' },
      '出城的人': { text: '我的民哪，你们要从那城出来。', ref: '启示录 18:4' },
      '生命水的泉源': { text: '宝座中的羔羊必牧养他们，领他们到生命水的泉源。', ref: '启示录 7:17' },
      '无底坑': { text: '扔在无底坑里，将无底坑关闭，用印封上。', ref: '启示录 20:3' },
      '筵席': { text: '凡被请赴羔羊之婚筵的有福了！', ref: '启示录 19:9' },
      '白马': { text: '我观看，见天开了。有一匹白马，骑在马上的称为诚信真实。', ref: '启示录 19:11' },
      '众军': { text: '在天上的众军骑着白马，穿着细麻衣，又白又洁，跟随他。', ref: '启示录 19:14' },
      '生命册': { text: '另有一卷展开，就是生命册。', ref: '启示录 20:12' },
    },
  });
})(window.GS);
