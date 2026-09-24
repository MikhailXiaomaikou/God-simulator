/* ─────────────────────────────────────────────────────────────
 * book/twelve2.js —— 小先知书 · 公义的日头（那鸿书 — 玛拉基书）
 *
 * 旧约的末一幕。同一片地：左边是海，东方（左）日出；中丘的左边是亚述的大城尼尼微，
 * 近地的右边是锡安——一座山城，城墙、城门、层层的房屋，山顶上是耶和华的殿；
 * 城前的左边是一座望楼、无花果树、葡萄架、橄榄树、一块田、羊圈与牛棚。
 *
 * 那鸿书：旋风和暴风里，尼尼微的灯火通明；「耶和华本为善，在患难的日子为人的保障」——
 *   一穹柔光罩住投靠他的人；河闸开放，洪水漫过尼尼微，宫殿冲没，灯一盏盏灭了；
 *   天将亮，远山上一点光奔跑而来——报好信传平安之人的脚登山（1:15）。
 * 哈巴谷书：先知站在望楼上；「将这默示明明地写在版上」——两块版上一行行写满了光；
 *   日出时，字化作金光流进海里，满海发光：「认识耶和华荣耀的知识要充满遍地，好像水充满洋海一般」（2:14）。
 *   正午，无花果树不发旺，葡萄树不结果，橄榄树不效力，田地不出粮食，圈中绝了羊，棚内没有牛——
 *   「然而，我要因耶和华欢欣」：先知在望楼上举手歌唱，远山的高处一只发光的母鹿一跃一跃地上去（3:17–19）。
 * 西番雅书：遍地黑暗幽冥，「我必用灯巡查耶路撒冷」——几盏灯在黑暗的城中巡行，先前的殿倾倒；
 *   谦卑人跪着，头上有隐藏他们的微光；尼尼微荒凉，群畜卧在其中（1—2）。黑暗退去，黄昏的金光里
 *   「他在你中间必因你欢欣喜乐……且因你喜乐而欢呼」——金色的歌环自上而下一圈圈落在锡安；被掳的人归回（3）。
 * 哈该书：殿仍然荒凉；耶和华激动所罗巴伯、大祭司约书亚与剩下之百姓的心，扛来木料，殿一层层建起；
 *   万国的珍宝如金流运来，「这殿后来的荣耀必大过先前的荣耀」——荣光充满了殿（1—2）。
 * 撒迦利亚书：夜间的异象——准绳拉在耶路撒冷之上；「我要作耶路撒冷四围的火城」，一圈火环绕全城；
 *   约书亚脱去污秽的衣服，穿上华美的衣服（1—3）。被唤醒的先知看见纯金的灯台、七盏灯与两棵橄榄树，
 *   金色的油流进灯盏：「乃是倚靠我的灵方能成事」；殿顶的石头安上，「恩惠！恩惠！」；飞行的书卷掠过夜空（4—5）。
 *   早晨，冠冕戴在约书亚头上；寡妇、孤儿被接进来；年老的男女拄杖坐在街上，男孩女孩在街上玩耍；
 *   十个列国的人拉住一个犹大人的衣襟同来（6—8）。王谦谦和和地骑着驴驹进城；春雨，甘霖；牧人拿着两根杖牧养群羊（9—11）。
 *   施恩的灵浇灌下来，人都悲哀；一个泉源开了——活水从耶路撒冷流出，一半往东海，一半往西海，满海又发光（12—14）。
 * 玛拉基书：夜里，「我曾爱你们」——暖光环抱全城；从日出之地到日落之处，外邦中处处点起香火；
 *   祭司口中有真实的律法（1—2）。十分之一送入仓库，天上的窗户敞开，福倾下来，甚至无处可容；
 *   黄昏，敬畏耶和华的人彼此谈论，纪念册在天上展开，名字一个个记上（3）。
 * ★ 签名之景（4:2）：火炉般的夜过去，旧约的最后一次日出——公义的日头自东方的海上升起，
 *   光线扫过全地，枯处复青，田里金黄，树都结果；牛犊从棚里出来跳跃；以利亚自东而来；
 *   父亲与儿女相拥，众人面向日出。末一节经文（4:6）合上这一幕，引擎随即写下「旧约 · 三十九卷 · 终」。
 *
 * 画面的方位：左（东）= 海与日出；中丘左 = 尼尼微；近地左 = 望楼与园子；近地右 = 锡安（城门朝东）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'twelve2';
  const isCur = () => GS.book.current(ACT);
  const sm = (a, b, x) => U.smoothstep(a, b, x);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    tbNinLit: ['exp', 0.45],    // 尼尼微城中的灯（1 灯火通明 → 0 熄灭）
    tbNinRuin: ['lin', 0.1],    // 尼尼微倾覆（0 完好 → 1 荒凉，2:6–10）
    tbNinFlood: ['exp', 0.4],   // 河闸开放：洪水漫过尼尼微（2:6）
    tbShelter: ['exp', 0.45],   // 患难日子的保障：罩住投靠他之人的光（1:7）
    tbFeast: ['exp', 0.5],      // 可以守你的节期：城上的灯（1:15）
    tbCity: ['exp', 0.5],       // 城中的灯（夜里窗中的光）
    tbTablet: ['exp', 0.8],     // 版（哈 2:2）
    tbWrite: ['lin', 0.1],      // 默示明明地写在版上（0 → 1）
    tbSea: ['exp', 0.45],        // 海发光（哈 2:14；亚 14:8）
    tbKnow: ['exp', 0.35],      // 遍地的荣光（哈 2:14）
    tbOrchard: ['exp', 0.35],   // 无花果树、葡萄树、橄榄树（1 茂盛结果 → 0 枯）
    tbField: ['exp', 0.3],      // 田里的禾稼（0 不出粮食 · 0.6 青苗 · 1 金黄）
    tbFold: ['exp', 0.5],       // 圈中的羊
    tbStall: ['exp', 0.5],      // 棚内的牛
    tbSong: ['exp', 0.6],       // 先知的歌（哈 3:18）
    tbHind: ['lin', 0.11],      // 母鹿跳上高处（0 → 1，哈 3:19）
    tbLamps: ['exp', 0.6],      // 用灯巡查耶路撒冷（番 1:12）
    tbT1: ['exp', 0.45],        // 先前的殿（1 立着 → 0 倾倒）
    tbHumble: ['exp', 0.5],     // 谦卑人头上隐藏他们的光（番 2:3）
    tbJoy: ['exp', 0.6],        // 因你欢欣喜乐、因你喜乐而欢呼（番 3:17）
    tbT2: ['lin', 0.085],       // 后来的殿（0 → 1 建成）
    tbScaf: ['exp', 0.5],       // 脚手架
    tbGlory: ['exp', 0.4],      // 荣耀充满这殿（该 2:7–9）
    tbLine: ['exp', 0.8],       // 准绳拉在耶路撒冷之上（亚 1:16；2:1）
    tbFire: ['exp', 0.45],      // 四围的火城（亚 2:5）
    tbLampstand: ['exp', 0.35], // 纯金的灯台（亚 4:2–3）
    tbOil: ['exp', 0.5],        // 金色的油（亚 4:12）
    tbCap: ['exp', 0.6],        // 殿顶的石头（亚 4:7）
    tbScroll: ['lin', 0.1],     // 飞行的书卷（0 → 1 飞过，亚 5:1）
    tbCrown: ['exp', 0.8],      // 金银的冠冕（亚 6:11）
    tbSpirit: ['exp', 0.5],     // 施恩叫人恳求的灵（亚 12:10）
    tbFount: ['exp', 0.5],      // 泉源（亚 13:1）
    tbRiver: ['lin', 0.1],      // 活水（0 → 1 流出，亚 14:8）
    tbLove: ['exp', 0.45],      // 我曾爱你们（玛 1:2）
    tbIncense: ['lin', 0.1],    // 从日出之地到日落之处的香（0 → 1，玛 1:11）
    tbTeach: ['exp', 0.5],      // 真实的律法在他口中（玛 2:6）
    tbStore: ['exp', 0.5],      // 仓库（玛 3:10：0 → 1 满了，甚至无处可容）
    tbWindows: ['exp', 0.5],    // 天上的窗户
    tbPour: ['exp', 0.6],       // 倾福
    tbBook: ['exp', 0.5],       // 纪念册（玛 3:16）
    tbNames: ['lin', 0.12],     // 记录的名
    tbFurnace: ['exp', 0.5],    // 势如烧着的火炉（玛 4:1）：天边的红
    tbSun: ['exp', 0.3],        // 公义的日头的光线（玛 4:2）
    tbHeal: ['lin', 0.09],      // 医治的光扫过全地（0 → 1）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有一套）────────────────────
  const LAYL = {
    nin0: 0.488, nin1: 0.645, ninPal: 0.566,
    fig: 0.428, vine: 0.46, tower: 0.502, olive: 0.548, fold0: 0.57, fold1: 0.62,
    field0: 0.41, field1: 0.545,
    hill0: 0.632, hill1: 1.04, gate: 0.668, temple: 0.862, fount: 0.79,
    c0: 0.6, c1: 0.95,
    run0: 0.575, run1: 0.965, hind0: 0.62, hind1: 0.93,
    lamp: [0.72, 0.29], book: [0.81, 0.2], glyph: [0.76, 0.34], scrollY: 0.13,
    win: [0.47, 0.585, 0.7, 0.815, 0.93], winY: 0.17,
  };
  const LAYP = {
    nin0: 0.488, nin1: 0.67, ninPal: 0.575,
    fig: 0.416, vine: 0.448, tower: 0.49, olive: 0.534, fold0: 0.556, fold1: 0.604,
    field0: 0.405, field1: 0.535,
    hill0: 0.608, hill1: 1.04, gate: 0.642, temple: 0.848, fount: 0.78,
    c0: 0.62, c1: 0.96,
    run0: 0.575, run1: 0.97, hind0: 0.6, hind1: 0.93,
    lamp: [0.64, 0.44], book: [0.72, 0.42], glyph: [0.64, 0.47], scrollY: 0.36,
    win: [0.44, 0.57, 0.7, 0.83, 0.96], winY: 0.35,
  };
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];

  // ── 小工具 ──────────────────────────────────────────────────
  const LK = [1.1, 1.2, 1.3];
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * (LK[l] || 1);    // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fieldH(2, g) * 0.8; };
  const lit = c => [Math.min(255, c[0] * 1.2 + 22), Math.min(255, c[1] * 1.17 + 18), Math.min(255, c[2] * 1.12 + 14)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const mix = (a, b, t) => U.mixRGB(a, b, clamp(t, 0, 1));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const UN = () => Math.max(0.5, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const say = (b, lines) => { if (!b.instant && GS.ui) U.safe('tb.narrate', () => GS.ui.narrate(lines, { replace: false })); };
  function sfx(b, name, o) {
    if ((b && b.instant) || W.replaying) return;
    const a = au();
    if (a && a.sfx) U.safe('tb.sfx', () => a.sfx(name, o || {}));
  }
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };
  const nn = k => (tall() ? Math.max(2, Math.round(k * 0.62)) : k);

  // ── 人物（皆经人物模块）────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : (o && o.from) || 'fade' }, o, W.replaying ? { from: 'none' } : {})); }
  const walk = (id, x, o) => { if (has(id)) C().walk(id, x, o); };
  const pose = (id, p, o) => { if (has(id)) C().pose(id, p, o); };
  const face = (id, d) => { if (has(id)) C().face(id, d); };
  const rm = (id, now) => { if (has(id)) C().remove(id, now ? { fade: false } : undefined); };
  const glow = (id, v) => { if (has(id)) C().glow(id, v); };
  const attach = (id, fn) => { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); };
  const ride = (id, m) => { const c = C(); if (c.ride && fig(id)) c.ride(id, m); };
  const embrace = (a, b, o) => { const c = C(); if (c.embrace && has(a) && has(b)) c.embrace(a, b, o); };
  function animal(id, o) {
    const c = C();
    if (!c || !c.animal) return null;
    return U.safe('tb.animal', () => c.animal(id, Object.assign({ layer: 2, from: W.replaying ? 'none' : 'fade' }, o)));
  }
  // 一群人：建成后逐一打扮（性别、年岁、衣袍、纵深——皆按序号，不用随机）
  function crowd(gid, o, dressFn) {
    const c = C();
    if (!c || !c.crowd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c || !c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    return c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
  }
  const cmembers = gid => { const c = C(); const g = hasCrowd(gid) && c.crowds.get(gid); return g ? g.members : []; };
  const cwalk = (gid, x0, x1, o) => { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); };
  const cpose = (gid, p) => { if (hasCrowd(gid)) C().crowdPose(gid, p); };
  const crm = (gid, now) => { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); };
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      const dd = d === 1 || d === -1 ? d : (d >= (m.tx != null ? m.tx : m.nx) ? 1 : -1);
      if (m.tx != null && !W.replaying) { m.faceEnd = dd; continue; }
      m.faceEnd = null;
      m.facing = dd;
      if (W.replaying) m.fd = dd;
    }
  }
  function crelabel(gid, label) { for (const m of cmembers(gid)) m.label = label; }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  function cprop(gid, k) { for (const m of cmembers(gid)) { m.prop = k; m.propDefault = false; } }

  // 衣袍
  const LINEN = [238, 234, 220], FILTH = [70, 62, 56], PROPHET = [112, 96, 80], HAIRY = [104, 78, 54], ROYAL = [150, 118, 84];
  const JUDAH = [[132, 104, 78], [110, 88, 72], [150, 118, 90], [98, 84, 76], [124, 104, 88], [108, 98, 112], [142, 100, 82], [158, 138, 108], [118, 110, 96]];
  const WOMEN = [[170, 120, 104], [132, 110, 140], [186, 150, 112], [150, 100, 96], [118, 118, 142], [176, 140, 132]];
  const NATIONS = [[168, 72, 60], [70, 96, 150], [176, 132, 66], [120, 60, 96], [60, 110, 120], [196, 160, 70], [90, 130, 80]];
  const golden = i => ((i * 0.6180339) % 1);
  const folk = (v0, v1, label) => (m, i) => {
    m.sex = i % 3 === 1 ? 'f' : 'm';
    m.age = i % 7 === 5 ? 'child' : 'adult';
    m.robe = m.sex === 'f' ? WOMEN[i % WOMEN.length] : JUDAH[i % JUDAH.length];
    m.accent = null; m.hairOpt = null; m.prop = null; m.propDefault = false;
    m.scale = 0.93 + 0.1 * golden(i + 7);
    m.v = lerp(v0, v1, golden(i + 1));
    if (label) m.label = label;
  };
  const elders = (v0, v1) => (m, i) => {
    m.sex = i % 2 ? 'f' : 'm'; m.age = 'elder'; m.robe = m.sex === 'f' ? WOMEN[(i + 2) % WOMEN.length] : JUDAH[(i * 3 + 2) % JUDAH.length];
    m.accent = null; m.hairOpt = null; m.prop = 'staff'; m.propDefault = false; m.beardOpt = m.sex === 'm';
    m.v = lerp(v0, v1, golden(i + 3)); m.scale = 0.96;
  };
  const kids = (v0, v1) => (m, i) => {
    m.sex = i % 2 ? 'f' : 'm'; m.age = 'child'; m.robe = i % 2 ? WOMEN[i % WOMEN.length] : JUDAH[(i + 4) % JUDAH.length];
    m.accent = null; m.hairOpt = null; m.prop = null; m.propDefault = false; m.v = lerp(v0, v1, golden(i + 5)); m.scale = 1;
  };
  const dressed = (pal, v0, v1, sex) => (m, i) => {
    m.sex = sex || (i % 3 === 2 ? 'f' : 'm'); m.age = 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.hairOpt = null;
    m.prop = null; m.propDefault = false; m.v = lerp(v0, v1, golden(i + 2)); m.scale = 0.95 + 0.08 * golden(i + 9);
  };

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, (l === 2 ? vY(f.nx, f.v || 0) : gY(l, f.nx)) - PH(l) * frac];
  }
  // 一群人的中心（像素）、头顶、左右
  function crowdPt(gid) {
    const ms = cmembers(gid).filter(m => !m.dying);
    if (!ms.length) return null;
    let x = 0, top = Infinity, x0 = Infinity, x1 = -Infinity, foot = 0;
    for (const m of ms) {
      const px = m._vis ? m._x : m.nx * W.w;
      const py = m._vis ? m._y : vY(m.nx, m.v || 0);
      const hh = m._vis ? m._h : PH(m.layer == null ? 2 : m.layer);
      x += px; foot += py; top = Math.min(top, py - hh); x0 = Math.min(x0, px); x1 = Math.max(x1, px);
    }
    return { x: x / ms.length, foot: foot / ms.length, top, x0, x1 };
  }

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  function fresh() {
    return {
      watch: false,      // 有人站在望楼上
      leap: false,       // 牛犊跳跃
      shelter: 'judah',  // 保障罩住的人群
      love: 'zion',      // 暖光环抱的人群
    };
  }
  let S = fresh();

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; }
  function radial(rgb, a0, mid) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], a0));
    gr.addColorStop(mid || 0.35, U.rgba(rgb[0], rgb[1], rgb[2], a0 * 0.32));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function vbeam(rgbC, rgbE, headFade) {
    const w = 64, h = 256, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const vy = Math.min(1, v / (headFade || 0.08)) * (v > 0.82 ? Math.pow(Math.max(0, 1 - (v - 0.82) / 0.18), 1.5) : 1);
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1;
        const core = Math.exp(-hx * hx * 12), edge = Math.exp(-hx * hx * 3.4);
        const a = vy * (edge * 0.7 + core * 0.3);
        const i = (y * w + x) * 4;
        d[i] = lerp(rgbE[0], rgbC[0], core); d[i + 1] = lerp(rgbE[1], rgbC[1], core); d[i + 2] = lerp(rgbE[2], rgbC[2], core);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  // 自日头射出的一道光：左端为尖，向右渐宽、渐淡
  function rayCanvas() {
    const w = 256, h = 64, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1), half = 0.05 + 0.95 * u;
      const along = Math.min(1, u * 10) * Math.pow(1 - u, 1.25);
      for (let y = 0; y < h; y++) {
        const dy = Math.abs((y + 0.5) / h * 2 - 1) / half;
        const a = dy >= 1 ? 0 : along * Math.exp(-dy * dy * 2.6) * (1 - dy * dy * 0.3);
        const i = (y * w + x) * 4;
        d[i] = 255; d[i + 1] = lerp(214, 246, 1 - u); d[i + 2] = lerp(150, 224, 1 - u);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      silver: radial([200, 220, 255], 1), pearl: radial([252, 246, 236], 1), red: radial([255, 96, 48], 1, 0.45),
      smoke: radial([150, 140, 132], 0.8, 0.55), incense: radial([236, 226, 206], 0.7, 0.55), green: radial([200, 240, 170], 1),
      water: radial([190, 230, 255], 1),
      beam: vbeam([255, 250, 232], [255, 230, 176], 0.1), cool: vbeam([236, 242, 255], [196, 214, 255], 0.2),
      ray: rayCanvas(),
    };
    return SP;
  }
  function glowAt(ctx, spr, x, y, r, a, sy) {
    if (a <= 0.004 || r <= 0.5 || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = clamp(a, 0, 1);
    const ry = r * (sy || 1);
    ctx.drawImage(spr, x - r, y - ry, r * 2, ry * 2);
  }
  // 火（灯、坛、火城、香）
  const FIRE4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
  const HOLY4 = [[0, 1, 'rgb(255,196,96)', 0.6], [-0.26, 0.7, 'rgb(255,222,140)', 0.65], [0.24, 0.74, 'rgb(255,214,128)', 0.6], [0, 0.56, 'rgb(255,250,226)', 0.95]];
  function flame(ctx, x, y, h, k, seed, holy, gk) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    if (gk !== 0) glowAt(ctx, holy ? SP.gold : SP.warm, x, y - h * 0.45, h * 2.2, k * (0.28 + 0.45 * nightK()) * (gk == null ? 1 : gk));
    const T4 = holy ? HOLY4 : FIRE4;
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = clamp(k * q[3], 0, 1);
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
  function smoke(ctx, x, y, k, H, w, seed, spr) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 9, day = 0.35 + 0.65 * W.daylight, S0 = spr || SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.08 + i / N + seed * 0.37);
      const drift = (W.wind * 0.5 + 0.3) * ph * ph * H * 0.4 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.3 * ph;
      const s = w * (0.6 + ph * 2.4);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * (spr ? 0.8 + 0.2 * nightK() : day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(S0, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 一块（可带垛口；倾覆时顶上参差、矮下去）——只加进当前路径
  function block(ctx, x, yb, w, h, ruin, seed, cren) {
    if (ruin < 0.02) {
      ctx.rect(x, yb - h, w, h + 2);
      if (cren) {
        const n = Math.max(1, Math.floor(w / (cren * 2)));
        const off = (w - (n * 2 - 1) * cren) / 2;
        for (let i = 0; i < n; i++) ctx.rect(x + off + i * cren * 2, yb - h - cren * 0.7, cren, cren * 0.7 + 1);
      }
      return;
    }
    const n = 5;
    ctx.moveTo(x, yb + 2);
    for (let i = 0; i <= n; i++) {
      const jj = hsh(seed * 7.1 + i * 3.3);
      ctx.lineTo(x + w * i / n, yb - h * lerp(1, 0.16 + 0.55 * jj, ruin));
    }
    ctx.lineTo(x + w, yb + 2);
    ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  尼尼微（中丘的左边）：城墙、宫台、庙塔、房屋；河闸开放，宫殿冲没
  // ════════════════════════════════════════════════════════════
  const BRICK = [184, 154, 118], BRICK_D = [142, 114, 86], SOOT = [70, 62, 56], NGOLD = [228, 188, 108];
  let NIN = null;
  function ninModel() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (NIN && NIN.key === key) return NIN;
    const r = U.mulberry32(3417), hm = PH(1), x0 = X('nin0') * W.w, x1 = X('nin1') * W.w, pal = X('ninPal') * W.w;
    const houses = [];
    let x = x0 + hm * 0.35;
    while (x < x1 - hm * 0.4) {
      const w = (0.5 + 0.5 * r()) * hm, h = 0.5 + 0.7 * r();
      if (Math.abs(x + w / 2 - pal) > hm * 2.1) houses.push({ x: x / W.w, w: w / W.w, h, win: r(), win2: r(), dome: r() < 0.15, s: r() * 99 });
      x += w + (0.06 + 0.22 * r()) * hm;
    }
    const n = Math.max(3, Math.round((x1 - x0) / (hm * 2.3)));
    const towers = [];
    for (let i = 0; i <= n; i++) towers.push({ x: lerp(X('nin0'), X('nin1'), i / n), s: r() * 99 });
    return (NIN = { key, houses, towers, n });
  }
  function drawNineveh(ctx) {
    const l = 1, hm = PH(1), un = UN(), N = ninModel();
    const ruin = clamp(lv('tbNinRuin'), 0, 1), lamp = lv('tbNinLit'), flood = lv('tbNinFlood'), nk = nightK();
    const x0 = X('nin0'), x1 = X('nin1'), pal = X('ninPal'), px = pal * W.w;
    const sunL = litX() < px;
    const base = xf => gY(l, xf) + 0.12 * hm;
    const col = mix(BRICK, SOOT, 0.42 * ruin), colD = mix(BRICK_D, SOOT, 0.5 * ruin), colL = mix(mix(BRICK, [226, 202, 160], 0.35), SOOT, 0.4 * ruin);
    // 河（在城前，岛的前坡上）——洪水之前是一道细流
    const wl = W.waterlineY(1);
    {
      const xa = (x0 - 0.035) * W.w, xb = (x1 - 0.02) * W.w, n = 14;
      const wat = W.shade([70, 104, 130], DEP(1));
      ctx.fillStyle = U.rgba(wat[0], wat[1], wat[2], 0.9);
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n), g = base(x / W.w); const y = lerp(g, wl, 0.5) - 0.04 * hm; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      for (let i = n; i >= 0; i--) { const x = lerp(xa, xb, i / n), g = base(x / W.w); ctx.lineTo(x, lerp(g, wl, 0.5) + 0.12 * hm * (0.4 + 0.6 * (1 - i / n))); }
      ctx.closePath(); ctx.fill();
    }
    // 庙塔（宫台之后）
    const zx = px + 1.25 * hm, zg = base(zx / W.w);
    ctx.fillStyle = css(colL, l);
    ctx.beginPath();
    const tiers = [2.1, 1.55, 1.05, 0.6];
    let yy = zg;
    for (let i = 0; i < tiers.length; i++) {
      const w = tiers[i] * hm, h = 0.42 * hm * lerp(1, i < 2 ? 0.7 : 0.15, ruin);
      if (h < 0.5) break;
      block(ctx, zx - w / 2, yy, w, h, ruin * 0.6, 40 + i, 0);
      yy -= h;
    }
    ctx.fill();
    // 宫台（两层）与宫殿
    const t1w = 3.4 * hm, t1h = 0.5 * hm, t2w = 2.3 * hm, t2h = 0.46 * hm * lerp(1, 0.65, ruin);
    const pg = base(pal);
    ctx.fillStyle = css(col, l);
    ctx.beginPath();
    ctx.rect(px - t1w / 2, pg - t1h, t1w, t1h + 3 * un);
    ctx.rect(px - t2w / 2, pg - t1h - t2h, t2w, t2h + 1);
    ctx.fill();
    const hallW = 1.7 * hm, hallH = 0.95 * hm, hy = pg - t1h - t2h;
    ctx.fillStyle = css(colL, l);
    ctx.beginPath();
    block(ctx, px - hallW / 2 - 0.15 * hm, hy, hallW, hallH, ruin, 11, Math.max(1.2, hm * 0.13));
    block(ctx, px - hallW / 2 - 0.35 * hm, hy, 0.36 * hm, hallH * 1.25, ruin, 12, Math.max(1.2, hm * 0.12));
    block(ctx, px + hallW / 2 - 0.1 * hm, hy, 0.36 * hm, hallH * 1.25, ruin, 13, Math.max(1.2, hm * 0.12));
    ctx.fill();
    // 背光的一面
    ctx.fillStyle = css(colD, l, 0.8);
    ctx.fillRect(sunL ? px + t1w / 2 - t1w * 0.14 : px - t1w / 2, pg - t1h, t1w * 0.14, t1h);
    // 宫门上的金饰（倾覆后不再）
    if (ruin < 0.9) {
      ctx.fillStyle = css(NGOLD, l, 0.9 * (1 - ruin), 0.1);
      ctx.fillRect(px - hallW / 2 - 0.15 * hm, hy - hallH * 0.78, hallW, Math.max(1, 0.06 * hm));
    }
    // 房屋
    ctx.fillStyle = css(col, l);
    ctx.beginPath();
    for (const h of N.houses) {
      const x = h.x * W.w, w = h.w * W.w, g = base(h.x);
      block(ctx, x - w / 2, g, w, h.h * hm, ruin, h.s, 0);
    }
    ctx.fill();
    ctx.fillStyle = css(colD, l, 0.7);
    ctx.beginPath();
    for (const h of N.houses) {
      const x = h.x * W.w, w = h.w * W.w, g = base(h.x), hh = h.h * hm * lerp(1, 0.5, ruin);
      ctx.rect(sunL ? x + w / 2 - w * 0.22 : x - w / 2, g - hh, w * 0.22, hh);
    }
    ctx.fill();
    if (ruin < 0.5) {
      ctx.fillStyle = css(col, l);
      ctx.beginPath();
      for (const h of N.houses) if (h.dome) { const x = h.x * W.w, w = h.w * W.w, g = base(h.x), r0 = w * 0.32; ctx.moveTo(x + r0, g - h.h * hm); ctx.arc(x, g - h.h * hm, r0, 0, Math.PI, true); }
      ctx.fill();
    }
    // 城墙与城楼（前）
    const wh = 0.62 * hm, cren = Math.max(1.2, hm * 0.13), tw = 0.44 * hm;
    ctx.fillStyle = css(mix(col, [206, 180, 140], 0.2), l);
    ctx.beginPath();
    for (let i = 0; i < N.n; i++) {
      const xa = N.towers[i].x * W.w, xb = N.towers[i + 1].x * W.w, g = base((xa + xb) / 2 / W.w) + 0.1 * hm;
      block(ctx, xa, g, xb - xa, wh, ruin, N.towers[i].s + 3, cren);
    }
    for (const t of N.towers) {
      const x = t.x * W.w, g = base(t.x) + 0.1 * hm;
      block(ctx, x - tw / 2, g, tw, wh * 1.5, ruin, t.s, cren);
    }
    ctx.fill();
    // 迎光的边
    if (ruin < 0.6) {
      ctx.strokeStyle = css(lit(col), l, rimA() * (1 - ruin), 0.08);
      ctx.lineWidth = Math.max(0.5, 0.8 * un);
      ctx.beginPath();
      for (let i = 0; i < N.n; i++) { const xa = N.towers[i].x * W.w, xb = N.towers[i + 1].x * W.w, g = base((xa + xb) / 2 / W.w) + 0.1 * hm; ctx.moveTo(xa, g - wh); ctx.lineTo(xb, g - wh); }
      ctx.moveTo(px - t1w / 2, pg - t1h); ctx.lineTo(px + t1w / 2, pg - t1h);
      ctx.stroke();
    }
    // 洪水的水面（河闸开放，2:6）
    const topAt = x => lerp(wl, base(x / W.w) - 0.95 * hm, flood) + Math.sin(x * 0.07 + W.t * 2.2) * 1.2 * un + Math.sin(x * 0.19 - W.t * 3.1) * 0.8 * un;
    const dry = (x, y) => flood < 0.01 || y < topAt(x) - 1;
    // 窗与灯（骄傲的城，夜里灯火通明；水涨上来，灯一盏一盏被淹没）
    const la = lamp * (0.22 + 0.78 * nk) * (1 - ruin);
    const winRect = h => { const x = h.x * W.w, w = h.w * W.w, g = base(h.x), s = Math.max(1, hm * 0.1); return [x - w / 2 + w * (0.22 + 0.5 * h.win), g - h.h * hm * 0.62, s, s * 1.5]; };
    ctx.fillStyle = css([40, 30, 24], l);
    ctx.beginPath();
    for (const h of N.houses) { const r = winRect(h); ctx.rect(r[0], r[1], r[2], r[3]); }
    ctx.fill();
    if (la > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 190, 110, 0.9 * la);
      ctx.beginPath();
      for (const h of N.houses) { const r = winRect(h); if (!dry(r[0], r[1])) continue; ctx.rect(r[0], r[1], r[2], r[3]); if (h.win2 > 0.5) ctx.rect(r[0] + h.w * W.w * 0.3, r[1] + hm * 0.12, r[2], r[3]); }
      ctx.fill();
      // 城楼上的火把、宫门的灯
      for (const t of N.towers) { const g = base(t.x) + 0.1 * hm; if (dry(t.x * W.w, g - wh * 1.6)) glowAt(ctx, SP.warm, t.x * W.w, g - wh * 1.6, hm * 0.55, la * 0.8); }
      glowAt(ctx, SP.warm, px - 0.15 * hm, hy - hallH * 0.4, hm * 1.3, la * 0.6);
      glowAt(ctx, SP.warm, px, pg - hm * 0.5, hm * 3.2, la * 0.3);
      glowAt(ctx, SP.warm, (x0 + x1) / 2 * W.w, pg - hm * 0.9, (x1 - x0) * W.w * 0.75, la * 0.28, 0.45);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 洪水：河闸开放，宫殿冲没（2:6）
    if (flood > 0.01) {
      const xa = (x0 - 0.04) * W.w, xb = (x1 + 0.02) * W.w, n = 30;
      const wat = W.shade([60, 92, 120], DEP(1)), foam = mix(W.shade([220, 232, 240], DEP(1)), [200, 214, 232], 0.5 * nk);
      ctx.fillStyle = U.rgba(wat[0], wat[1], wat[2], 0.88);
      ctx.beginPath();
      ctx.moveTo(xa, wl + 2);
      for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n); ctx.lineTo(x, topAt(x)); }
      ctx.lineTo(xb, wl + 2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = U.rgba(foam[0], foam[1], foam[2], 0.6 * Math.min(1, flood * 2));
      ctx.lineWidth = Math.max(0.6, 1.1 * un);
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const x = lerp(xa, xb, i / n); if (i) ctx.lineTo(x, topAt(x)); else ctx.moveTo(x, topAt(x)); }
      ctx.stroke();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  锡安（近地的右边）：山、城墙与城门、层层的房屋、山顶上的殿
  // ════════════════════════════════════════════════════════════
  const LIME = [214, 198, 164], LIME_D = [174, 156, 122], HILLC = [150, 134, 102], CEDAR = [130, 88, 56], GOLD = [238, 198, 106], BRONZE = [176, 122, 72];
  let CITY = null;
  const HN = 64;
  function city() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l') + ':' + Math.round((W.lv.land || 0) * 40);
    if (CITY && CITY.key === key) return CITY;
    const ph = PH(2), x0 = X('hill0'), x1 = X('hill1'), tx = X('temple'), gx = X('gate');
    const gro = new Float32Array(HN + 1), top = new Float32Array(HN + 1);
    const H = 1.55 * ph, rw = tall() ? 0.1 : 0.075, bw = tall() ? 0.13 : 0.09;
    for (let i = 0; i <= HN; i++) {
      const xf = lerp(x0, x1, i / HN), g = gY(2, xf);
      const rise = sm(x0, x0 + rw, xf), bump = Math.exp(-Math.pow((xf - tx) / bw, 2));
      gro[i] = g;
      top[i] = g - H * rise * (0.56 + 0.44 * bump + 0.04 * Math.sin(xf * 57));
    }
    const at = (arr, xf) => {
      if (xf <= x0) return arr === gro ? gY(2, xf) : gY(2, xf);
      if (xf >= x1) return arr[HN];
      const f = (xf - x0) / (x1 - x0) * HN, i = Math.min(HN - 1, Math.floor(f)), k = f - i;
      return arr[i] + (arr[i + 1] - arr[i]) * k;
    };
    const Cm = { key, ph, x0, x1, tx, gx, gro, top, H };
    Cm.g = xf => at(gro, xf); Cm.t = xf => at(top, xf);
    // 房屋：三排（后排高、贴着山顶；前排低）
    const r = U.mulberry32(8121), HS = [];
    const K = [0.84, 0.54, 0.24];
    for (let row = 0; row < 3; row++) {
      let x = (gx + (row === 2 ? 0.026 : 0.012)) * W.w + r() * 0.3 * ph;
      const xe = 1.01 * W.w;
      while (x < xe) {
        const w = (0.55 + 0.42 * r()) * ph, xf = (x + w / 2) / W.w;
        const dx = Math.abs(xf - tx) * W.w;
        const skip = (row === 0 && dx < 1.95 * ph) || (row === 1 && dx < 1.25 * ph);
        if (!skip) HS.push({ xf, w: w / W.w, row, k: K[row], h: 0.42 + 0.34 * r() + (r() < 0.12 ? 0.3 : 0), win: r(), win2: r(), dome: r() < 0.16, lampT: r(), sh: r() });
        x += w + (0.05 + 0.28 * r()) * ph;
      }
    }
    Cm.houses = HS;
    Cm.rows = [0, 1, 2].map(r => HS.filter(h => h.row === r));
    // 城墙的城楼（城门两旁、其后每隔一段）
    const TW = [];
    TW.push({ x: gx - 0.62 * ph / W.w, gate: true }, { x: gx + 0.62 * ph / W.w, gate: true });
    let t = gx + 0.62 * ph / W.w + 3.1 * ph / W.w;
    while (t < 1.02) { TW.push({ x: t, gate: false }); t += 3.1 * ph / W.w; }
    Cm.towers = TW;
    Cm.wx0 = gx - 0.9 * ph / W.w;
    return (CITY = Cm);
  }
  // 城墙前的地（人站的地方）：城门外
  function drawHill(ctx, Cm) {
    const ph = Cm.ph, un = UN();
    ctx.fillStyle = css(HILLC, 2);
    ctx.beginPath();
    ctx.moveTo(Cm.x0 * W.w, Cm.gro[0] + 3);
    for (let i = 0; i <= HN; i++) ctx.lineTo(lerp(Cm.x0, Cm.x1, i / HN) * W.w, Cm.top[i]);
    for (let i = HN; i >= 0; i--) ctx.lineTo(lerp(Cm.x0, Cm.x1, i / HN) * W.w, Cm.gro[i] + 3);
    ctx.closePath(); ctx.fill();
    // 山坡上的台地
    ctx.strokeStyle = css(dim(HILLC, 0.78), 2, 0.5);
    ctx.lineWidth = Math.max(0.6, 0.9 * un);
    ctx.beginPath();
    for (const k of [0.33, 0.62]) {
      for (let i = 0; i <= HN; i++) {
        const xf = lerp(Cm.x0, Cm.x1, i / HN), y = lerp(Cm.top[i], Cm.gro[i], k);
        if (i === 0 || Cm.gro[i] - Cm.top[i] < 4) ctx.moveTo(xf * W.w, y); else ctx.lineTo(xf * W.w, y);
      }
    }
    ctx.stroke();
    // 迎光的山脊
    ctx.strokeStyle = css(lit(HILLC), 2, rimA() * 0.8, 0.05);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath();
    for (let i = 0; i <= HN; i++) { const x = lerp(Cm.x0, Cm.x1, i / HN) * W.w; if (i) ctx.lineTo(x, Cm.top[i]); else ctx.moveTo(x, Cm.top[i]); }
    ctx.stroke();
    void ph;
  }
  function houseRect(Cm, h) {
    const ph = Cm.ph, x = h.xf * W.w, w = h.w * W.w, b = lerp(Cm.g(h.xf), Cm.t(h.xf), h.k) + 0.06 * ph, hh = h.h * ph;
    return [x - w / 2, b - hh, w, hh];
  }
  function drawHouses(ctx, Cm, row) {
    const ph = Cm.ph, un = UN(), sunL = litX() < Cm.tx * W.w, nk = nightK();
    const hs = Cm.rows[row];
    const body = mix(LIME, [196, 180, 150], row * 0.15);
    ctx.fillStyle = css(body, 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h); ctx.rect(q[0], q[1], q[2], q[3] + 0.3 * ph); }
    ctx.fill();
    ctx.fillStyle = css(dim(body, 0.76), 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), sw = q[2] * 0.24; ctx.rect(sunL ? q[0] + q[2] - sw : q[0], q[1], sw, q[3] + 0.3 * ph); }
    ctx.fill();
    ctx.fillStyle = css(body, 2);
    ctx.beginPath();
    for (const h of hs) if (h.dome) { const q = houseRect(Cm, h), r0 = q[2] * 0.3; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
    ctx.fill();
    // 屋顶的边（香柏木的檐）
    ctx.fillStyle = css(CEDAR, 2, 0.85);
    ctx.beginPath();
    for (const h of hs) if (!h.dome) { const q = houseRect(Cm, h); ctx.rect(q[0] - 0.5 * un, q[1] - 1.2 * un, q[2] + un, 1.4 * un); }
    ctx.fill();
    ctx.strokeStyle = css(lit(body), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), ex = sunL ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] / 2, q[1]); }
    ctx.stroke();
    // 窗
    const wr = (q, h, k) => { const s = Math.max(1, ph * 0.09); return [q[0] + q[2] * (0.2 + 0.55 * (k ? h.win2 : h.win)), q[1] + q[3] * (k ? 0.52 : 0.26), s, s * 1.5]; };
    ctx.fillStyle = css([40, 30, 24], 2);
    ctx.beginPath();
    for (const h of hs) { const q = houseRect(Cm, h), r1 = wr(q, h, 0); ctx.rect(r1[0], r1[1], r1[2], r1[3]); if (h.win2 > 0.45) { const r2 = wr(q, h, 1); ctx.rect(r2[0], r2[1], r2[2], r2[3]); } }
    ctx.fill();
    const la = lv('tbCity') * nk + lv('tbFeast') * 0.6;
    if (la > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 196, 118, clamp(0.9 * la, 0, 1));
      ctx.beginPath();
      for (const h of hs) { if (h.lampT > 0.8 && lv('tbFeast') < 0.3) continue; const q = houseRect(Cm, h), r1 = wr(q, h, 0); ctx.rect(r1[0], r1[1], r1[2], r1[3]); if (h.win2 > 0.45) { const r2 = wr(q, h, 1); ctx.rect(r2[0], r2[1], r2[2], r2[3]); } }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawWall(ctx, Cm) {
    const ph = Cm.ph, un = UN(), sunL = litX() < Cm.gx * W.w;
    const wc = mix(LIME, [190, 170, 132], 0.3), WH = 0.84 * ph, TWH = 1.22 * ph, tw = 0.52 * ph, cren = Math.max(1.4, 0.14 * ph);
    const gl = (Cm.gx - 0.62 * ph / W.w) * W.w, gr = (Cm.gx + 0.62 * ph / W.w) * W.w;
    ctx.fillStyle = css(wc, 2);
    ctx.beginPath();
    // 城门左边一小段（与山坡相接）
    const xa = Cm.wx0 * W.w;
    block(ctx, xa, Cm.g(Cm.wx0) + 0.04 * ph, gl - xa, WH * 0.9, 0, 1, cren);
    // 城门右边到画面尽头
    let x = gr;
    while (x < W.w + 20) {
      const xn = Math.min(W.w + 20, x + 1.6 * ph), g = Cm.g(Math.min(1, (x + xn) / 2 / W.w)) + 0.04 * ph;
      block(ctx, x, g, xn - x + 0.5, WH, 0, 2, cren);
      x = xn;
    }
    for (const t of Cm.towers) { const tx = t.x * W.w, g = Cm.g(t.x) + 0.04 * ph; block(ctx, tx - tw / 2, g, tw, t.gate ? TWH * 1.08 : TWH, 0, 3, cren); }
    ctx.fill();
    // 城门洞
    const gxx = Cm.gx * W.w, gg = Cm.g(Cm.gx) + 0.04 * ph, aw = 0.5 * ph, ah = 0.74 * ph;
    ctx.fillStyle = css(wc, 2);
    ctx.fillRect(gl, gg - WH * 1.05, gr - gl, WH * 1.05 + 2);
    ctx.fillStyle = css([34, 28, 24], 2);
    ctx.beginPath();
    ctx.moveTo(gxx - aw / 2, gg + 2); ctx.lineTo(gxx - aw / 2, gg - ah + aw / 2); ctx.arc(gxx, gg - ah + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(gxx + aw / 2, gg + 2); ctx.closePath();
    ctx.fill();
    const la = lv('tbCity') * nightK() * 0.8 + lv('tbFeast') * 0.5;
    if (la > 0.03) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = clamp(la * 0.55, 0, 1);
      ctx.fillStyle = 'rgb(255,178,96)';
      ctx.beginPath();
      ctx.moveTo(gxx - aw / 2, gg + 2); ctx.lineTo(gxx - aw / 2, gg - ah + aw / 2); ctx.arc(gxx, gg - ah + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(gxx + aw / 2, gg + 2); ctx.closePath();
      ctx.fill();
      glowAt(ctx, SP.warm, gxx, gg - ah * 0.45, aw * 1.8, la * 0.5);
      for (const t of Cm.towers) glowAt(ctx, SP.warm, t.x * W.w, Cm.g(t.x) - TWH * 1.1, ph * 0.5, la * 0.7);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 石层与迎光的边
    ctx.strokeStyle = css(dim(wc, 0.7), 2, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let k = 1; k < 4; k++) { const yy = k / 4; x = xa; while (x < W.w) { const g = Cm.g(Math.min(1, x / W.w)) + 0.04 * ph; ctx.moveTo(x, g - WH * yy); ctx.lineTo(x + ph * 0.5, g - WH * yy); x += ph * 0.5; } }
    ctx.stroke();
    ctx.strokeStyle = css(lit(wc), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, 1 * un);
    ctx.beginPath();
    x = xa;
    while (x < W.w) { const g = Cm.g(Math.min(1, x / W.w)) + 0.04 * ph; ctx.moveTo(x, g - WH); ctx.lineTo(x + ph * 0.6, g - WH); x += ph * 0.6; }
    for (const t of Cm.towers) { const tx = t.x * W.w, g = Cm.g(t.x) + 0.04 * ph, ex = sunL ? tx - tw / 2 : tx + tw / 2; ctx.moveTo(ex, g - WH * 0.9); ctx.lineTo(ex, g - TWH); }
    ctx.stroke();
  }
  // ── 殿 ──
  function tgeo() {
    const Cm = city(), ph = Cm.ph, x = Cm.tx * W.w, y = Cm.t(Cm.tx) + 0.08 * ph;
    return { x, y, ph, pw: 3.3 * ph, pH: 0.3 * ph, hw: 2.25 * ph, hh: 1.05 * ph, fw: 1.02 * ph, fh: 1.62 * ph };
  }
  function templeBody(ctx, G, style, alpha, build, sunL) {
    const ph = G.ph, un = UN(), y0 = G.y - G.pH;
    const body = style === 1 ? LIME : [230, 220, 196], bodyD = dim(body, 0.78);
    const hk = clamp(build / 0.75, 0, 1), fk = clamp((build - 0.1) / 0.85, 0, 1);
    const hH = G.hh * hk, fH = G.fh * fk;
    const cx = G.x - G.hw * 0.08;
    const hx0 = G.x - G.hw * 0.46, hx1 = G.x + G.hw * 0.54, fx0 = cx - G.fw / 2, fx1 = cx + G.fw / 2;
    ctx.globalAlpha = clamp(alpha, 0, 1);
    // 殿身
    if (hH > 0.5) {
      ctx.fillStyle = css(body, 2);
      ctx.fillRect(hx0, y0 - hH, hx1 - hx0, hH + 1);
      ctx.fillStyle = css(bodyD, 2);
      const sw = (hx1 - hx0) * 0.14;
      ctx.fillRect(sunL ? hx1 - sw : hx0, y0 - hH, sw, hH + 1);
    }
    // 廊（正面）
    if (fH > 0.5) {
      ctx.fillStyle = css(sunL ? lit(body) : body, 2, null, sunL ? 0.03 : 0);
      ctx.fillRect(fx0, y0 - fH, fx1 - fx0, fH + 1);
    }
    // 石层
    const band = G.hh / 9;
    ctx.strokeStyle = css(dim(body, 0.62), 2, 0.3);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let yy = y0 - band; yy > y0 - Math.max(hH, fH); yy -= band) {
      if (y0 - yy <= hH) { ctx.moveTo(hx0, yy); ctx.lineTo(fx0, yy); ctx.moveTo(fx1, yy); ctx.lineTo(hx1, yy); }
      if (y0 - yy <= fH) { ctx.moveTo(fx0, yy); ctx.lineTo(fx1, yy); }
    }
    ctx.stroke();
    const done = sm(0.9, 1, build);
    if (done > 0.01) {
      const ga = ctx.globalAlpha;
      ctx.globalAlpha = ga * done;
      // 檐
      ctx.fillStyle = css(lit(body), 2, null, 0.05);
      ctx.fillRect(hx0 - 0.04 * ph, y0 - G.hh - 0.07 * ph, hx1 - hx0 + 0.08 * ph, 0.07 * ph);
      ctx.fillRect(fx0 - 0.05 * ph, y0 - G.fh - 0.08 * ph, fx1 - fx0 + 0.1 * ph, 0.08 * ph);
      // 金（先前的殿满是金子；后来的殿到荣光来时才发金光）
      const gk = style === 1 ? 1 : lv('tbGlory');
      if (gk > 0.02) {
        ctx.fillStyle = css(GOLD, 2, gk, 0.12);
        ctx.fillRect(fx0 - 0.05 * ph, y0 - G.fh - 0.11 * ph, fx1 - fx0 + 0.1 * ph, 0.035 * ph);
        ctx.fillRect(hx0 - 0.04 * ph, y0 - G.hh - 0.1 * ph, hx1 - hx0 + 0.08 * ph, 0.03 * ph);
      }
      // 窗（殿身上的窄窗）
      ctx.fillStyle = css([36, 28, 24], 2);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const wx = lerp(fx1 + 0.14 * ph, hx1 - 0.12 * ph, i / 4); ctx.rect(wx - 0.035 * ph, y0 - G.hh * 0.84, 0.07 * ph, G.hh * 0.22); }
      ctx.fill();
      // 门
      const dw = 0.3 * G.fw, dh = 0.46 * G.fh;
      ctx.fillStyle = css(dim(body, 0.66), 2);
      ctx.fillRect(cx - dw / 2 - 0.05 * ph, y0 - dh - 0.05 * ph, dw + 0.1 * ph, dh + 0.05 * ph);
      const inner = clamp(0.2 + nightK() * 0.35 * (style === 1 ? lv('tbCity') : 1) + lv('tbGlory') * 0.8, 0, 1);
      ctx.fillStyle = U.rgba(lerp(38, 255, inner * 0.92), lerp(30, 214, inner * 0.92), lerp(24, 140, inner * 0.92), 1);
      ctx.fillRect(cx - dw / 2, y0 - dh, dw, dh);
      // 铜柱（雅斤、波阿斯）
      if (style === 1) {
        const pw = 0.13 * ph, pH = G.fh * 0.9;
        for (const px of [fx0 - 0.2 * ph, fx1 + 0.2 * ph]) {
          ctx.fillStyle = css(BRONZE, 2);
          ctx.fillRect(px - pw / 2, y0 - pH, pw, pH);
          ctx.beginPath(); ctx.ellipse(px, y0 - pH, pw * 1.2, pw * 0.7, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = css(lit(BRONZE), 2, rimA() + 0.2, 0.1);
          ctx.fillRect(sunL ? px - pw / 2 : px + pw / 2 - 0.8 * un, y0 - pH, 0.8 * un, pH);
        }
      }
      ctx.globalAlpha = ga;
    }
    // 迎光的边
    ctx.strokeStyle = css(lit(body), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.8, 1.1 * un);
    ctx.beginPath();
    if (fH > 0.5) { ctx.moveTo(fx0, y0 - fH); ctx.lineTo(fx1, y0 - fH); if (sunL) { ctx.moveTo(fx0, y0); ctx.lineTo(fx0, y0 - fH); } }
    if (hH > 0.5) { ctx.moveTo(fx1, y0 - hH); ctx.lineTo(hx1, y0 - hH); if (!sunL) ctx.lineTo(hx1, y0); }
    ctx.stroke();
    // 脚手架
    const sc = style === 2 ? lv('tbScaf') : 0;
    if (sc > 0.01) {
      const yT = y0 - Math.max(hH, fH) - 0.18 * ph;
      ctx.globalAlpha = sc * 0.85;
      ctx.strokeStyle = css([104, 78, 54], 2);
      ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath();
      const xs = [];
      for (let i = 0; i <= 6; i++) xs.push(lerp(hx0 - 0.1 * ph, hx1 + 0.08 * ph, i / 6));
      for (const x of xs) { ctx.moveTo(x, y0); ctx.lineTo(x, Math.min(y0 - 0.3 * ph, yT)); }
      for (let yy = y0 - 0.32 * ph; yy > yT; yy -= 0.32 * ph) { ctx.moveTo(xs[0], yy); ctx.lineTo(xs[xs.length - 1], yy); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawRuins(ctx, G, k) {
    const ph = G.ph, un = UN(), y0 = G.y - G.pH, tu = G.pw;
    ctx.globalAlpha = clamp(k * 1.2, 0, 1);
    ctx.fillStyle = css(mix(LIME_D, [70, 62, 56], 0.35), 2);
    ctx.beginPath();
    for (const w of [[-0.3, 0.55, 0.18], [0.12, 0.8, 0.12], [0.36, 0.42, 0.1]]) {
      const x = G.x + w[0] * tu, h = w[1] * ph, ww = w[2] * tu;
      ctx.moveTo(x - ww / 2, y0 + 1); ctx.lineTo(x - ww / 2, y0 - h * 0.7); ctx.lineTo(x - ww * 0.1, y0 - h); ctx.lineTo(x + ww * 0.2, y0 - h * 0.75); ctx.lineTo(x + ww / 2, y0 - h * 0.5); ctx.lineTo(x + ww / 2, y0 + 1);
      ctx.closePath();
    }
    ctx.fill();
    // 乱石
    for (let i = 0; i < 18; i++) {
      const u = hsh(i * 2.3 + 1), x = G.x + (u - 0.5) * tu * 0.95;
      const pile = Math.sin(Math.PI * u) * 0.22 * ph * hsh(i + 13);
      const r0 = (0.07 + 0.08 * hsh(i + 5)) * ph, y = y0 - pile - r0 * 0.3;
      ctx.fillStyle = css(mix(LIME_D, [74, 64, 56], 0.2 + 0.4 * hsh(i + 17)), 2);
      ctx.beginPath();
      ctx.moveTo(x - r0, y + r0 * 0.5); ctx.lineTo(x - r0 * 0.7, y - r0 * 0.4); ctx.lineTo(x + r0 * 0.5, y - r0 * 0.55); ctx.lineTo(x + r0, y + r0 * 0.4); ctx.closePath();
      ctx.fill();
    }
    // 焦木与荆棘（这殿仍然荒凉）
    ctx.strokeStyle = css([42, 34, 28], 2);
    ctx.lineWidth = Math.max(1, 0.06 * ph);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const x = G.x + (hsh(i * 4.3 + 2) - 0.5) * tu * 0.8, L = (0.35 + 0.3 * hsh(i + 1)) * ph, a = -Math.PI / 2 + (hsh(i + 8) - 0.5) * 1.6; ctx.moveTo(x, y0); ctx.lineTo(x + Math.cos(a) * L, y0 + Math.sin(a) * L); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.strokeStyle = css([96, 114, 62], 2, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (let i = 0; i < 22; i++) { const x = G.x + (hsh(i * 3.9 + 4) - 0.5) * tu, h = 0.18 * ph * hsh(i + 2); ctx.moveTo(x, y0); ctx.lineTo(x + 0.03 * ph, y0 - h); ctx.moveTo(x, y0); ctx.lineTo(x - 0.04 * ph, y0 - h * 0.8); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawTemple(ctx) {
    const G = tgeo(), ph = G.ph, un = UN(), t1 = lv('tbT1'), t2 = lv('tbT2');
    const sunL = litX() < G.x;
    // 殿的台
    ctx.fillStyle = css(LIME_D, 2);
    ctx.fillRect(G.x - G.pw / 2, G.y - G.pH, G.pw, G.pH + 0.7 * ph);
    ctx.strokeStyle = css(lit(LIME_D), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.7, un);
    ctx.beginPath(); ctx.moveTo(G.x - G.pw / 2, G.y - G.pH); ctx.lineTo(G.x + G.pw / 2, G.y - G.pH); ctx.stroke();
    if (t1 > 0.01) templeBody(ctx, G, 1, clamp(t1 * 1.4 - 0.2, 0, 1), 1, sunL);
    const rk = (1 - t1) * (1 - sm(0, 0.3, t2));
    if (rk > 0.01) drawRuins(ctx, G, rk);
    if (t2 > 0.004) templeBody(ctx, G, 2, 1, t2, sunL);
    // 殿顶的石头（亚 4:7）
    const cp = lv('tbCap');
    if (cp > 0.02 && t2 > 0.95) {
      const cx = G.x - G.hw * 0.08, cy = G.y - G.pH - G.fh - 0.08 * ph, w = 0.3 * ph, h = 0.2 * ph;
      ctx.globalAlpha = clamp(cp, 0, 1);
      ctx.fillStyle = css([246, 238, 214], 2, null, 0.15);
      ctx.fillRect(cx - w / 2, cy - h, w, h);
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  望楼（哈 2:1）、版（2:2）
  // ════════════════════════════════════════════════════════════
  const TSTONE = [192, 176, 144];
  function towerG() {
    const ph = PH(2), xf = X('tower'), g = gY(2, xf) + 0.05 * ph, h = 2.4 * ph;
    return { x: xf * W.w, g, h, w0: 0.7 * ph, w1: 0.56 * ph, top: g - h, ph };
  }
  function drawTower(ctx) {
    const G = towerG(), ph = G.ph, un = UN(), sunL = litX() < G.x;
    ctx.fillStyle = css(TSTONE, 2);
    ctx.beginPath();
    ctx.moveTo(G.x - G.w0 / 2, G.g + 3); ctx.lineTo(G.x - G.w1 / 2, G.top); ctx.lineTo(G.x + G.w1 / 2, G.top); ctx.lineTo(G.x + G.w0 / 2, G.g + 3); ctx.closePath();
    ctx.fill();
    // 背光的一面
    ctx.fillStyle = css(dim(TSTONE, 0.74), 2);
    ctx.beginPath();
    if (sunL) { ctx.moveTo(G.x + G.w0 * 0.2, G.g + 3); ctx.lineTo(G.x + G.w1 * 0.2, G.top); ctx.lineTo(G.x + G.w1 / 2, G.top); ctx.lineTo(G.x + G.w0 / 2, G.g + 3); }
    else { ctx.moveTo(G.x - G.w0 * 0.2, G.g + 3); ctx.lineTo(G.x - G.w1 * 0.2, G.top); ctx.lineTo(G.x - G.w1 / 2, G.top); ctx.lineTo(G.x - G.w0 / 2, G.g + 3); }
    ctx.closePath(); ctx.fill();
    // 石层
    ctx.strokeStyle = css(dim(TSTONE, 0.62), 2, 0.4);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let k = 1; k < 9; k++) { const y = lerp(G.g, G.top, k / 9), w = lerp(G.w0, G.w1, k / 9) / 2; ctx.moveTo(G.x - w, y); ctx.lineTo(G.x + w, y); }
    ctx.stroke();
    // 门与窄窗
    ctx.fillStyle = css([36, 28, 24], 2);
    ctx.beginPath();
    const dw = 0.2 * ph, dh = 0.42 * ph;
    ctx.moveTo(G.x - dw / 2, G.g + 1); ctx.lineTo(G.x - dw / 2, G.g - dh + dw / 2); ctx.arc(G.x, G.g - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(G.x + dw / 2, G.g + 1); ctx.closePath();
    ctx.rect(G.x - 0.03 * ph, G.g - G.h * 0.55, 0.06 * ph, 0.2 * ph);
    ctx.rect(G.x - 0.03 * ph, G.g - G.h * 0.8, 0.06 * ph, 0.16 * ph);
    ctx.fill();
    // 顶上的台与后面的垛口
    ctx.fillStyle = css(lit(TSTONE), 2, null, 0.03);
    ctx.fillRect(G.x - G.w1 / 2 - 0.06 * ph, G.top - 0.06 * ph, G.w1 + 0.12 * ph, 0.08 * ph);
    ctx.fillStyle = css(dim(TSTONE, 0.86), 2);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) ctx.rect(G.x - G.w1 / 2 - 0.04 * ph + i * (G.w1 + 0.08 * ph - 0.12 * ph) / 2, G.top - 0.3 * ph, 0.12 * ph, 0.26 * ph);
    ctx.fill();
    ctx.strokeStyle = css(lit(TSTONE), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, 1 * un);
    ctx.beginPath();
    if (sunL) { ctx.moveTo(G.x - G.w0 / 2, G.g); ctx.lineTo(G.x - G.w1 / 2, G.top); } else { ctx.moveTo(G.x + G.w0 / 2, G.g); ctx.lineTo(G.x + G.w1 / 2, G.top); }
    ctx.stroke();
  }
  // 望楼顶上前面的矮墙（在守望的人之前画）
  function drawTowerFront(ctx) {
    if (!S.watch) return;
    const G = towerG(), ph = G.ph;
    ctx.fillStyle = css(TSTONE, 2);
    ctx.fillRect(G.x - G.w1 / 2 - 0.06 * ph, G.top - 0.2 * ph, G.w1 + 0.12 * ph, 0.2 * ph);
    ctx.strokeStyle = css(lit(TSTONE), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, UN());
    ctx.beginPath(); ctx.moveTo(G.x - G.w1 / 2 - 0.06 * ph, G.top - 0.2 * ph); ctx.lineTo(G.x + G.w1 / 2 + 0.06 * ph, G.top - 0.2 * ph); ctx.stroke();
  }
  const watchPt = () => { const G = towerG(); return [G.x, G.top - 0.02 * G.ph]; };
  // 版：一块宽的木版，斜靠在矮架上；写上的字一行一行发光
  function boardG() {
    const G = towerG(), ph = G.ph, cx = G.x + G.w0 / 2 + 0.62 * ph, g = gY(2, cx / W.w) + 0.1 * ph;
    return { cx, g, w: 0.95 * ph, h: 0.62 * ph, lift: 0.28 * ph, ph };
  }
  function tabletPts() {
    const B = boardG(), y = B.g - B.lift - B.h * 0.5;
    return [[B.cx - B.w * 0.22, y], [B.cx + B.w * 0.22, y]];
  }
  function drawTablets(ctx) {
    const k = lv('tbTablet');
    if (k < 0.01) return;
    SP || sprites();
    const B = boardG(), ph = B.ph, wr = lv('tbWrite'), un = UN();
    ctx.save();
    ctx.globalAlpha = clamp(k, 0, 1);
    // 架
    ctx.strokeStyle = css([104, 78, 54], 2);
    ctx.lineWidth = Math.max(0.8, 0.06 * ph);
    ctx.beginPath();
    ctx.moveTo(B.cx - B.w * 0.36, B.g); ctx.lineTo(B.cx - B.w * 0.3, B.g - B.lift - B.h * 0.3);
    ctx.moveTo(B.cx + B.w * 0.36, B.g); ctx.lineTo(B.cx + B.w * 0.3, B.g - B.lift - B.h * 0.3);
    ctx.moveTo(B.cx + B.w * 0.1, B.g); ctx.lineTo(B.cx + B.w * 0.02, B.g - B.lift - B.h * 0.7);
    ctx.stroke();
    // 版（微向后仰）
    ctx.translate(B.cx, B.g - B.lift);
    ctx.transform(1, 0, -0.12, 1, 0, 0);
    ctx.fillStyle = css([150, 118, 82], 2);
    ctx.fillRect(-B.w / 2 - 0.05 * ph, -B.h - 0.05 * ph, B.w + 0.1 * ph, B.h + 0.1 * ph);
    ctx.fillStyle = css([222, 206, 172], 2);
    ctx.fillRect(-B.w / 2, -B.h, B.w, B.h);
    ctx.strokeStyle = css(lit([222, 206, 172]), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.strokeRect(-B.w / 2, -B.h, B.w, B.h);
    // 默示：竖行，自右而左写上
    const cols = 7, done = clamp(wr, 0, 1) * cols;
    const writing = wr > 0.001 && wr < 0.999;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 214, 140, 0.95);
    ctx.lineWidth = Math.max(0.6, 0.04 * ph);
    ctx.beginPath();
    for (let c = 0; c < cols; c++) {
      const f = clamp(done - c, 0, 1);
      if (f <= 0) break;
      const x = B.w * 0.4 - c * B.w * 0.133, n = Math.max(1, Math.round(5 * f));
      for (let r = 0; r < n; r++) {
        const y = -B.h * 0.86 + r * B.h * 0.17, sz = B.h * 0.055, q = hsh(c * 11 + r * 3);
        ctx.moveTo(x - sz, y); ctx.lineTo(x + sz, y);
        ctx.moveTo(x + (q - 0.5) * sz, y - sz); ctx.lineTo(x + (0.5 - q) * sz, y + sz);
        if (q > 0.6) { ctx.moveTo(x - sz, y + sz * 0.8); ctx.lineTo(x + sz * 0.6, y + sz * 0.8); }
      }
    }
    ctx.stroke();
    const ga = (writing ? 0.6 : 0.3) * clamp(done / cols * 2, 0, 1) * (0.7 + 0.3 * nightK());
    glowAt(ctx, SP.gold, 0, -B.h * 0.5, B.w * 1.1, ga);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  园子：无花果树、葡萄架、橄榄树；田；羊圈与牛棚（哈 3:17）
  // ════════════════════════════════════════════════════════════
  const BARK = [92, 72, 56];
  function drawFig(ctx, xf, k) {
    const ph = PH(2), x = xf * W.w, g = gY(2, xf) + 0.06 * ph, H = 1.5 * ph, un = UN();
    const tips = [[-0.62, 0.78], [-0.34, 1.0], [0.05, 1.06], [0.4, 0.96], [0.66, 0.74]];
    ctx.strokeStyle = css(BARK, 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 0.12 * ph);
    ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x - 0.1 * ph, g - H * 0.3, x - 0.02 * ph, g - H * 0.5); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, 0.06 * ph);
    ctx.beginPath();
    for (const t of tips) { ctx.moveTo(x - 0.02 * ph, g - H * 0.5); ctx.quadraticCurveTo(x + t[0] * ph * 0.5, g - H * (0.5 + t[1] * 0.2), x + t[0] * ph, g - H * t[1]); }
    ctx.stroke();
    // 枯时的细枝
    if (k < 0.7) {
      ctx.lineWidth = Math.max(0.5, 0.03 * ph);
      ctx.globalAlpha = 1 - k;
      ctx.beginPath();
      for (const t of tips) { const tx = x + t[0] * ph, ty = g - H * t[1]; ctx.moveTo(tx, ty); ctx.lineTo(tx + 0.12 * ph * Math.sign(t[0] || 1), ty - 0.12 * ph); ctx.moveTo(tx, ty); ctx.lineTo(tx - 0.05 * ph, ty - 0.16 * ph); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.lineCap = 'butt';
    if (k > 0.03) {
      const leaf = mix([120, 124, 70], [70, 120, 58], k), r0 = 0.24 * ph * (0.4 + 0.6 * k);
      ctx.fillStyle = css(leaf, 2, clamp(k * 1.4, 0, 1));
      ctx.beginPath();
      tips.forEach((t, i) => {
        const tx = x + t[0] * ph, ty = g - H * t[1];
        for (let j = 0; j < 3; j++) { const a = i * 1.7 + j * 2.1, lx = tx + Math.cos(a) * r0 * 0.7, ly = ty + Math.sin(a) * r0 * 0.5; ctx.moveTo(lx + r0 * 0.7, ly); ctx.arc(lx, ly, r0 * 0.7, 0, TAU); }
      });
      ctx.fill();
      ctx.fillStyle = css(lit(leaf), 2, clamp(k, 0, 1) * rimA(), 0.05);
      ctx.beginPath();
      tips.forEach(t => { const tx = x + t[0] * ph, ty = g - H * t[1] - r0 * 0.3; ctx.moveTo(tx + r0 * 0.5, ty); ctx.arc(tx, ty, r0 * 0.5, Math.PI, TAU); });
      ctx.fill();
      if (k > 0.55) {
        ctx.fillStyle = css([130, 50, 84], 2, clamp((k - 0.55) * 3, 0, 1));
        ctx.beginPath();
        tips.forEach((t, i) => { for (let j = 0; j < 2; j++) { const fx0 = x + t[0] * ph + (hsh(i * 3 + j) - 0.5) * r0, fy = g - H * t[1] + r0 * 0.3 + hsh(i + j * 5) * r0 * 0.4; ctx.moveTo(fx0 + 0.06 * ph, fy); ctx.arc(fx0, fy, 0.06 * ph, 0, TAU); } });
        ctx.fill();
      }
    }
    void un;
  }
  function drawVine(ctx, xf, k) {
    const ph = PH(2), x = xf * W.w, g = gY(2, xf) + 0.06 * ph, H = 0.95 * ph, sw = 0.42 * ph, un = UN();
    // 架
    ctx.strokeStyle = css([112, 86, 60], 2);
    ctx.lineWidth = Math.max(0.8, 0.06 * ph);
    ctx.beginPath();
    ctx.moveTo(x - sw, g); ctx.lineTo(x - sw, g - H); ctx.moveTo(x + sw, g); ctx.lineTo(x + sw, g - H);
    ctx.moveTo(x - sw - 0.08 * ph, g - H); ctx.lineTo(x + sw + 0.08 * ph, g - H);
    ctx.stroke();
    // 藤
    ctx.strokeStyle = css([86, 64, 48], 2);
    ctx.lineWidth = Math.max(1, 0.07 * ph);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 0.05 * ph, g);
    ctx.bezierCurveTo(x + 0.15 * ph, g - H * 0.3, x - 0.15 * ph, g - H * 0.6, x, g - H * 0.98);
    ctx.moveTo(x, g - H * 0.98); ctx.quadraticCurveTo(x - sw * 0.5, g - H * 1.08, x - sw, g - H * 0.96);
    ctx.moveTo(x, g - H * 0.98); ctx.quadraticCurveTo(x + sw * 0.5, g - H * 1.1, x + sw, g - H * 0.98);
    ctx.stroke();
    ctx.lineCap = 'butt';
    if (k > 0.03) {
      const leaf = mix([124, 128, 72], [78, 126, 56], k), r0 = 0.12 * ph * (0.5 + 0.5 * k);
      ctx.fillStyle = css(leaf, 2, clamp(k * 1.4, 0, 1));
      ctx.beginPath();
      for (let i = 0; i < 9; i++) { const lx = x - sw + (i / 8) * sw * 2, ly = g - H * (1.02 + 0.06 * Math.sin(i * 1.9)); ctx.moveTo(lx + r0, ly); ctx.arc(lx, ly, r0, 0, TAU); }
      ctx.fill();
      if (k > 0.55) {
        ctx.fillStyle = css([88, 44, 96], 2, clamp((k - 0.55) * 3, 0, 1));
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const gx = x - sw * 0.75 + i * sw * 0.5, gyy = g - H * 0.95, s = 0.07 * ph;
          for (let r = 0; r < 3; r++) for (let c = 0; c <= 2 - r; c++) { const bx = gx + (c - (2 - r) / 2) * s * 1.6, by = gyy + r * s * 1.4; ctx.moveTo(bx + s, by); ctx.arc(bx, by, s, 0, TAU); }
        }
        ctx.fill();
      }
    }
    void un;
  }
  function drawOlive(ctx, xf, k, big) {
    const ph = PH(2), x = xf * W.w, g = gY(2, xf) + 0.06 * ph, H = (big || 1.75) * ph;
    // 多节的干，分成三枝伸进树冠
    ctx.fillStyle = css([88, 72, 58], 2);
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * ph, g + 1);
    ctx.bezierCurveTo(x - 0.04 * ph, g - H * 0.18, x - 0.2 * ph, g - H * 0.3, x - 0.07 * ph, g - H * 0.44);
    ctx.lineTo(x + 0.09 * ph, g - H * 0.44);
    ctx.bezierCurveTo(x + 0.01 * ph, g - H * 0.3, x + 0.16 * ph, g - H * 0.18, x + 0.15 * ph, g + 1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 72, 58], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(0.8, 0.07 * ph);
    ctx.beginPath();
    for (const q of [[-0.42, 0.66], [0.02, 0.8], [0.4, 0.68]]) { ctx.moveTo(x, g - H * 0.42); ctx.quadraticCurveTo(x + q[0] * ph * 0.4, g - H * 0.55, x + q[0] * ph, g - H * q[1]); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    // 树冠：许多银绿的小叶团（橄榄树常青；「不效力」是不结果子）
    const leaf = mix([146, 150, 128], [116, 140, 100], k), n = 22;
    const P = [];
    for (let i = 0; i < n; i++) {
      const ang = i * 2.39996, rr = Math.sqrt((i + 0.5) / n);
      P.push([x + Math.cos(ang) * rr * 0.72 * ph, g - H * 0.74 + Math.sin(ang) * rr * 0.3 * ph, (0.15 + 0.07 * hsh(i * 1.3)) * ph]);
    }
    ctx.fillStyle = css(dim(leaf, 0.82), 2);
    ctx.beginPath();
    for (const q of P) { ctx.moveTo(q[0] + q[2], q[1] + q[2] * 0.2); ctx.ellipse(q[0], q[1] + q[2] * 0.2, q[2], q[2] * 0.62, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(leaf, 2);
    ctx.beginPath();
    for (const q of P) { const r2 = q[2] * 0.78; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.12); ctx.ellipse(q[0], q[1] - q[2] * 0.12, r2, r2 * 0.58, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css(lit(leaf), 2, rimA(), 0.06);
    ctx.beginPath();
    for (const q of P) { if (q[1] > g - H * 0.74) continue; const r2 = q[2] * 0.55; ctx.moveTo(q[0] + r2, q[1] - q[2] * 0.3); ctx.ellipse(q[0], q[1] - q[2] * 0.3, r2, r2 * 0.4, 0, Math.PI, TAU); }
    ctx.fill();
    if (k > 0.75) {
      ctx.fillStyle = css([58, 44, 60], 2, clamp((k - 0.75) * 4, 0, 1));
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const q = P[(i * 7) % n], ox = q[0] + (hsh(i) - 0.5) * q[2], oy = q[1] + q[2] * 0.35; ctx.moveTo(ox + 0.028 * ph, oy); ctx.arc(ox, oy, 0.028 * ph, 0, TAU); }
      ctx.fill();
    }
  }
  function drawField(ctx) {
    const k = lv('tbField'), ph = PH(2), a = X('field0'), b = X('field1'), un = UN();
    const soil = W.shade(mix([116, 92, 66], [96, 80, 60], k), 0);
    const col = k < 0.5 ? mix([150, 126, 84], [104, 146, 70], k * 2) : mix([104, 146, 70], [222, 186, 92], (k - 0.5) * 2);
    const rows = [0.42, 0.56, 0.7, 0.85];
    // 垄沟
    ctx.strokeStyle = U.rgba(soil[0], soil[1], soil[2], 0.55);
    ctx.lineWidth = Math.max(1, 0.06 * ph);
    ctx.beginPath();
    for (const v of rows) { const x0 = a * W.w, x1 = b * W.w; ctx.moveTo(x0, vY(a, v) + 1); for (let x = x0; x <= x1; x += 6) ctx.lineTo(x, vY(x / W.w, v) + 1); }
    ctx.stroke();
    // 禾
    const H0 = ph * (0.08 + 0.34 * k);
    ctx.strokeStyle = css(col, 2);
    ctx.lineWidth = Math.max(0.6, 0.035 * ph);
    ctx.beginPath();
    for (const v of rows) {
      const s = 1 + 0.35 * v, step = 0.14 * ph * s;
      for (let x = a * W.w + step * 0.5; x < b * W.w; x += step) {
        const y = vY(x / W.w, v), h = H0 * s * (0.8 + 0.4 * hsh(x * 0.13 + v * 7)), sway = Math.sin(W.t * 1.3 + x * 0.05) * h * 0.08;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway * 0.5, y - h * 0.5, x + sway, y - h);
        ctx.moveTo(x + 0.05 * ph * s, y); ctx.lineTo(x + 0.08 * ph * s + sway, y - h * 0.8);
      }
    }
    ctx.stroke();
    if (k > 0.6) {
      ctx.fillStyle = css([236, 200, 110], 2, clamp((k - 0.6) * 2.5, 0, 1), 0.06);
      ctx.beginPath();
      for (const v of rows) {
        const s = 1 + 0.35 * v, step = 0.14 * ph * s;
        for (let x = a * W.w + step * 0.5; x < b * W.w; x += step) {
          const y = vY(x / W.w, v), h = H0 * s * (0.8 + 0.4 * hsh(x * 0.13 + v * 7)), sway = Math.sin(W.t * 1.3 + x * 0.05) * h * 0.08;
          ctx.moveTo(x + sway + 0.03 * ph, y - h); ctx.ellipse(x + sway, y - h, 0.03 * ph * s, 0.08 * ph * s, 0.2, 0, TAU);
        }
      }
      ctx.fill();
    }
    void un;
  }
  function drawFold(ctx) {
    const ph = PH(2), un = UN(), a = X('fold0'), b = X('fold1'), st = [180, 166, 136];
    const shedW = (b - a) * 0.36, sa = b - shedW;
    const yb = xf => vY(xf, 0.0), yf = xf => vY(xf, 0.16);
    const wallH = 0.3 * ph;
    // 牛棚（顶在后）
    const shx0 = sa * W.w, shx1 = b * W.w, sg = yb(sa), roofY = sg - 0.95 * ph;
    ctx.fillStyle = css([74, 60, 48], 2);
    ctx.fillRect(shx0, roofY, shx1 - shx0, sg - roofY + 1);
    // 后墙
    ctx.fillStyle = css(st, 2);
    ctx.beginPath();
    ctx.moveTo(a * W.w, yb(a) + 1);
    for (let i = 0; i <= 8; i++) { const xf = lerp(a, sa, i / 8); ctx.lineTo(xf * W.w, yb(xf) - wallH * (0.92 + 0.08 * hsh(i))); }
    ctx.lineTo(sa * W.w, yb(sa) + 1); ctx.closePath(); ctx.fill();
    // 圈中的羊
    const fk = lv('tbFold');
    if (fk > 0.02) {
      const wool = W.shade([230, 222, 204], 0), head = W.shade([60, 50, 42], 0);
      for (let i = 0; i < 5; i++) {
        const xf = lerp(a + 0.006, sa - 0.006, (i + 0.5) / 5), y = vY(xf, 0.06 + 0.05 * (i % 2)), s = 0.28 * ph;
        ctx.globalAlpha = clamp(fk, 0, 1);
        ctx.fillStyle = U.rgb(wool[0], wool[1], wool[2]);
        ctx.beginPath(); ctx.ellipse(xf * W.w, y - s * 0.5, s * 0.55, s * 0.36, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = U.rgb(head[0], head[1], head[2]);
        const d = i % 2 ? 1 : -1;
        ctx.beginPath(); ctx.ellipse(xf * W.w + d * s * 0.55, y - s * 0.62 + (i % 3 === 0 ? s * 0.25 : 0), s * 0.17, s * 0.12, d * 0.4, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    // 棚内的牛
    const ck = lv('tbStall');
    if (ck > 0.02) {
      const hide = W.shade([100, 78, 58], 0), horn = W.shade([220, 208, 186], 0);
      for (let i = 0; i < 2; i++) {
        const xf = lerp(sa, b, 0.3 + 0.42 * i), y = vY(xf, 0.05), s = 0.5 * ph, d = i ? -1 : 1;
        ctx.globalAlpha = clamp(ck, 0, 1);
        ctx.fillStyle = U.rgb(hide[0], hide[1], hide[2]);
        ctx.beginPath(); ctx.ellipse(xf * W.w, y - s * 0.5, s * 0.5, s * 0.26, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(xf * W.w + d * s * 0.52, y - s * 0.56, s * 0.16, s * 0.12, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = U.rgb(horn[0], horn[1], horn[2]); ctx.lineWidth = Math.max(0.5, 0.6 * un);
        ctx.beginPath(); ctx.moveTo(xf * W.w + d * s * 0.52, y - s * 0.66); ctx.lineTo(xf * W.w + d * s * 0.62, y - s * 0.78); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // 棚的柱与顶
    ctx.strokeStyle = css([96, 74, 54], 2);
    ctx.lineWidth = Math.max(0.8, 0.07 * ph);
    ctx.beginPath();
    for (const xf of [sa, b]) { ctx.moveTo(xf * W.w, yf(xf) + 1); ctx.lineTo(xf * W.w, roofY + 2); }
    ctx.stroke();
    ctx.fillStyle = css([150, 124, 80], 2);
    ctx.beginPath();
    ctx.moveTo(shx0 - 0.12 * ph, roofY + 0.1 * ph); ctx.lineTo(shx0 + 0.1 * ph, roofY - 0.22 * ph); ctx.lineTo(shx1 + 0.02 * ph, roofY - 0.22 * ph); ctx.lineTo(shx1 + 0.14 * ph, roofY + 0.1 * ph); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css(lit([150, 124, 80]), 2, rimA(), 0.06);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath(); ctx.moveTo(shx0 + 0.1 * ph, roofY - 0.22 * ph); ctx.lineTo(shx1 + 0.02 * ph, roofY - 0.22 * ph); ctx.stroke();
    // 前墙（矮）
    ctx.fillStyle = css(dim(st, 0.92), 2);
    ctx.beginPath();
    ctx.moveTo(a * W.w - 0.1 * ph, yf(a) + 1);
    for (let i = 0; i <= 10; i++) { const xf = lerp(a, b, i / 10); ctx.lineTo(xf * W.w + (i === 10 ? 0.1 * ph : 0) - (i === 0 ? 0.1 * ph : 0), yf(xf) - wallH * (0.85 + 0.15 * hsh(i + 20))); }
    ctx.lineTo(b * W.w + 0.1 * ph, yf(b) + 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(lit(st), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const xf = lerp(a, b, i / 10), y = yf(xf) - wallH * (0.85 + 0.15 * hsh(i + 20)); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  活水与泉源（亚 13:1；14:8）
  // ════════════════════════════════════════════════════════════
  function riverPaths() {
    const F = X('fount'), t = tall() ? 1.25 : 1;
    const east = [[F, 0.02], [F - 0.01 * t, 0.16], [F - 0.05 * t, 0.36], [F - 0.13 * t, 0.56], [F - 0.23 * t, 0.72], [F - 0.33 * t, 0.86], [F - 0.42 * t, 0.98], [F - 0.5 * t, 1.1]];
    const west = [[F, 0.02], [F + 0.03, 0.2], [F + 0.09, 0.42], [F + 0.17, 0.66], [F + 0.26, 0.92], [F + 0.34, 1.12]];
    return [east, west];
  }
  function samplePath(P, u) {
    const n = P.length - 1, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i;
    const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], d = P[Math.min(n, i + 2)];
    const cr = (p0, p1, p2, p3) => 0.5 * ((2 * p1) + (-p0 + p2) * k + (2 * p0 - 5 * p1 + 4 * p2 - p3) * k * k + (-p0 + 3 * p1 - 3 * p2 + p3) * k * k * k);
    return [cr(a[0], b[0], c[0], d[0]), cr(a[1], b[1], c[1], d[1])];
  }
  function drawRiver(ctx) {
    const r = lv('tbRiver');
    if (r < 0.004) return;
    SP || sprites();
    const un = UN();
    const deep = mix(W.shade([70, 130, 170], 0), [150, 210, 240], 0.3 + 0.3 * nightK()), hi = [236, 248, 255];
    for (const P of riverPaths()) {
      const N = 40, n = Math.max(2, Math.round(N * r)), L = [], R = [];
      for (let i = 0; i <= n; i++) {
        const u = (i / N);
        const p = samplePath(P, Math.min(u, r)), v = p[1];
        const y = vY(p[0], Math.min(v, 1.3)), w = (0.004 + 0.024 * Math.max(0, v)) * W.w * (tall() ? 1.5 : 1) * (i === n ? 0.5 : 1);
        L.push([p[0] * W.w - w, y]); R.push([p[0] * W.w + w, y]);
      }
      ctx.fillStyle = U.rgba(deep[0], deep[1], deep[2], 0.95);
      ctx.beginPath();
      L.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
      for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
      ctx.closePath(); ctx.fill();
      // 流动的光
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.55);
      ctx.lineWidth = Math.max(0.6, 1.1 * un);
      ctx.beginPath();
      for (let i = 1; i < L.length - 1; i++) {
        const ph = U.fract(-W.t * 0.35 + i * 0.29);
        const a = L[i], b = R[i], x = lerp(a[0], b[0], 0.25 + 0.5 * ph), w = (b[0] - a[0]) * 0.2;
        ctx.moveTo(x - w, a[1]); ctx.lineTo(x + w, a[1]);
      }
      ctx.stroke();
      const head = L[L.length - 1];
      glowAt(ctx, SP.water, (head[0] + R[R.length - 1][0]) / 2, head[1], 18 * un, r < 0.999 ? 0.8 : 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawFount(ctx) {
    const k = lv('tbFount');
    if (k < 0.01) return;
    SP || sprites();
    const ph = PH(2), xf = X('fount'), x = xf * W.w, y = vY(xf, 0.03), un = UN();
    ctx.globalAlpha = clamp(k, 0, 1);
    ctx.fillStyle = css([170, 156, 128], 2);
    ctx.beginPath(); ctx.ellipse(x, y, 0.5 * ph, 0.12 * ph, 0, 0, TAU); ctx.fill();
    const wat = W.shade([110, 170, 210], 0);
    ctx.fillStyle = U.rgba(wat[0], wat[1], wat[2], 1);
    ctx.beginPath(); ctx.ellipse(x, y - 0.02 * ph, 0.38 * ph, 0.08 * ph, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    // 涌出的泉
    const h = 0.55 * ph * k;
    ctx.strokeStyle = U.rgba(230, 246, 255, 0.7 * k);
    ctx.lineWidth = Math.max(0.6, 0.8 * un);
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) { const s = i * 0.08 * ph, top = y - h * (1 - Math.abs(i) * 0.18) - Math.sin(W.t * 5 + i) * 0.03 * ph; ctx.moveTo(x, y - 0.02 * ph); ctx.quadraticCurveTo(x + s * 0.5, top, x + s * 2.2, y - 0.04 * ph); }
    ctx.stroke();
    glowAt(ctx, SP.water, x, y - h * 0.5, 0.9 * ph, 0.55 * k);
    glowAt(ctx, SP.white, x, y - h * 0.6, 0.3 * ph, 0.5 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海发光（哈 2:14；亚 14:8）——在海的每一段之上（大地随后盖住它）
  // ════════════════════════════════════════════════════════════
  const GLINT = [];
  for (let i = 0; i < 240; i++) GLINT.push([hsh(i * 1.37 + 0.2), hsh(i * 2.91 + 5.1), hsh(i * 4.7 + 1.3)]);
  function drawSeaGlow(ctx, pass) {
    const k = lv('tbSea');
    if (k < 0.01) return;
    SP || sprites();
    const hz = W.horizonY, fw = W.waterlineY(0), mw = W.waterlineY(1);
    let y0, y1;
    if (pass === 'seaFar') { y0 = hz; y1 = fw + 2; } else if (pass === 'seaMid') { y0 = fw - 1; y1 = mw + 2; } else { y0 = mw - 1; y1 = W.h; }
    const sx = (tall() ? 0.36 : 0.37) * W.w, sy = W.h * 0.96;
    const R = (0.12 + 1.2 * clamp(k, 0, 1)) * Math.hypot(W.w, W.h);
    const a = clamp(k, 0, 1), nk = nightK();
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y0, W.w, y1 - y0); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    // 一层极淡的暖光（太浓会使海变浊）
    const gr = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
    gr.addColorStop(0, U.rgba(255, 226, 170, 0.16 * a));
    gr.addColorStop(0.6, U.rgba(255, 214, 150, 0.07 * a));
    gr.addColorStop(1, 'rgba(255,210,140,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, y0, W.w, y1 - y0);
    // 满海的金色波光：一片一片闪烁的光与短短的光纹
    const ga = a * (0.55 + 0.45 * nk);
    for (let i = 0; i < GLINT.length; i++) {
      const g = GLINT[i];
      const y = lerp(hz + 2, W.h, Math.pow(g[1], 1.25));
      if (y < y0 || y > y1) continue;
      const x = g[0] * W.w * 0.82;
      if (W.isSea && !W.isSea(x, y)) continue;
      const d = Math.hypot(x - sx, y - sy);
      if (d > R * 0.9) continue;
      const tw = 0.5 + 0.5 * Math.sin(W.t * (1.1 + 1.3 * g[2]) + g[2] * 40);
      if (tw < 0.25) continue;
      const dep = W.seaDepth(y), edge = 1 - sm(R * 0.6, R * 0.9, d);
      if (i % 4 === 0) glowAt(ctx, SP.gold, x, y, (6 + 26 * dep) * UN(), ga * 0.3 * tw * edge, 0.35);
      const w = (2 + 14 * dep) * UN() * tw;
      ctx.globalAlpha = clamp(ga * tw * edge, 0, 1);
      ctx.fillStyle = i % 3 ? 'rgb(255,226,150)' : 'rgb(255,246,214)';
      ctx.fillRect(x - w, y - 0.6, w * 2, Math.max(1, (0.6 + 1.2 * dep) * UN()));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天上的：灯台的异象、飞行的书卷、纪念册、天上的窗户、日头的光线……
  // ════════════════════════════════════════════════════════════
  const GOLDS = 'rgb(242,200,110)', GOLDL = 'rgb(255,232,170)';
  function drawLampstand(ctx) {
    const k = lv('tbLampstand');
    if (k < 0.01) return;
    SP || sprites();
    const c = X('lamp'), cx = c[0] * W.w, cy = c[1] * W.h;
    const s = (tall() ? 0.72 : 0.36) * Math.min(W.h, W.w * (tall() ? 1 : 0.62));
    const un = UN(), a = clamp(k, 0, 1), oil = lv('tbOil');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pearl, cx, cy - 0.05 * s, s * 0.85, a * 0.28);
    glowAt(ctx, SP.gold, cx, cy - 0.25 * s, s * 0.45, a * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    // 两棵橄榄树（左、右）
    for (const d of [-1, 1]) {
      const tx = cx + d * 0.34 * s, ty = cy + 0.1 * s, oy0 = ty - 0.36 * s;
      ctx.globalAlpha = a * 0.92;
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.green, tx, ty, 0.12 * s, 0.35 * a, 0.3);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a * 0.92;
      // 多节的干，分两枝
      ctx.fillStyle = 'rgb(176,150,112)';
      ctx.beginPath();
      ctx.moveTo(tx - 0.032 * s, ty); ctx.bezierCurveTo(tx - 0.005 * s, ty - 0.08 * s, tx - d * 0.045 * s, ty - 0.14 * s, tx - d * 0.012 * s - 0.012 * s, ty - 0.22 * s);
      ctx.lineTo(tx - d * 0.012 * s + 0.012 * s, ty - 0.22 * s); ctx.bezierCurveTo(tx + d * 0.02 * s, ty - 0.14 * s, tx + 0.008 * s, ty - 0.08 * s, tx + 0.03 * s, ty);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgb(176,150,112)';
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1, 0.014 * s);
      ctx.beginPath();
      ctx.moveTo(tx - d * 0.012 * s, ty - 0.21 * s); ctx.quadraticCurveTo(tx - d * 0.06 * s, ty - 0.26 * s, tx - d * 0.07 * s, oy0 + 0.02 * s);
      ctx.moveTo(tx - d * 0.012 * s, ty - 0.21 * s); ctx.quadraticCurveTo(tx + d * 0.04 * s, ty - 0.27 * s, tx + d * 0.06 * s, oy0);
      ctx.stroke();
      // 伸向灯盏的枝，末端是流出金油的金嘴（4:12）
      ctx.lineWidth = Math.max(0.8, 0.01 * s);
      ctx.beginPath(); ctx.moveTo(tx - d * 0.08 * s, oy0 + 0.01 * s); ctx.quadraticCurveTo(tx - d * 0.16 * s, oy0 - 0.03 * s, cx + d * 0.13 * s, cy - 0.26 * s); ctx.stroke();
      ctx.lineCap = 'butt';
      const lobes = [];
      for (let j = 0; j < 24; j++) { const ang = j * 2.39996, rr = Math.sqrt((j + 0.5) / 24); lobes.push([Math.cos(ang) * rr * 0.15, -0.36 + Math.sin(ang) * rr * 0.095, 0.045 + 0.022 * hsh(j + d * 3)]); }
      ctx.fillStyle = 'rgb(104,138,94)';
      ctx.beginPath();
      for (const q of lobes) { const lx = tx + q[0] * s, ly = ty + q[1] * s + q[2] * s * 0.2; ctx.moveTo(lx + q[2] * s, ly); ctx.ellipse(lx, ly, q[2] * s, q[2] * s * 0.66, 0, 0, TAU); }
      ctx.fill();
      ctx.fillStyle = 'rgb(140,176,122)';
      ctx.beginPath();
      for (const q of lobes) { const lx = tx + q[0] * s, ly = ty + q[1] * s - q[2] * s * 0.1, r2 = q[2] * s * 0.78; ctx.moveTo(lx + r2, ly); ctx.ellipse(lx, ly, r2, r2 * 0.6, 0, 0, TAU); }
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(200,236,180,0.3)';
      ctx.beginPath();
      for (const q of lobes) { if (q[1] > -0.36) continue; const lx = tx + q[0] * s, ly = ty + q[1] * s - q[2] * s * 0.3, r2 = q[2] * s * 0.55; ctx.moveTo(lx + r2, ly); ctx.ellipse(lx, ly, r2, r2 * 0.45, 0, Math.PI, TAU); }
      ctx.fill();
      glowAt(ctx, SP.green, tx, oy0, 0.24 * s, 0.3);
      ctx.fillStyle = 'rgba(255,224,140,0.85)';
      ctx.beginPath();
      for (let i = 0; i < 11; i++) { const q = lobes[(i * 5 + 3) % 24], ox = tx + q[0] * s, oy = ty + q[1] * s + q[2] * s * 0.3; ctx.moveTo(ox + 0.007 * s, oy); ctx.arc(ox, oy, 0.007 * s, 0, TAU); }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      // 金嘴
      ctx.fillStyle = GOLDS;
      const sxp = cx + d * 0.13 * s, syp = cy - 0.26 * s;
      ctx.beginPath(); ctx.moveTo(sxp, syp - 0.012 * s); ctx.lineTo(sxp - d * 0.03 * s, syp + 0.008 * s); ctx.lineTo(sxp, syp + 0.014 * s); ctx.closePath(); ctx.fill();
      // 金色的油流进灯盏
      if (oil > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 214, 110, 0.9 * oil * a);
        for (let i = 0; i < 6; i++) {
          const u = U.fract(W.t * 0.9 + i / 6), px = lerp(sxp - d * 0.03 * s, cx + d * 0.07 * s, u), py = lerp(syp + 0.01 * s, cy - 0.235 * s, u) - Math.sin(u * Math.PI) * 0.02 * s;
          ctx.beginPath(); ctx.arc(px, py, Math.max(0.8, 0.006 * s), 0, TAU); ctx.fill();
        }
        glowAt(ctx, SP.gold, sxp, syp, 0.05 * s, oil * a * 0.7);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = a;
    // 灯台：座、干（三个球节）、顶上的灯盏
    ctx.fillStyle = GOLDS;
    ctx.beginPath();
    ctx.moveTo(cx - 0.1 * s, cy + 0.47 * s); ctx.lineTo(cx - 0.035 * s, cy + 0.38 * s); ctx.lineTo(cx + 0.035 * s, cy + 0.38 * s); ctx.lineTo(cx + 0.1 * s, cy + 0.47 * s); ctx.closePath(); ctx.fill();
    ctx.fillRect(cx - 0.012 * s, cy - 0.22 * s, 0.024 * s, 0.61 * s);
    for (const ky of [0.28, 0.1, -0.08]) { ctx.beginPath(); ctx.ellipse(cx, cy + ky * s, 0.026 * s, 0.018 * s, 0, 0, TAU); ctx.fill(); }
    // 灯盏
    ctx.beginPath(); ctx.ellipse(cx, cy - 0.235 * s, 0.13 * s, 0.035 * s, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = GOLDL;
    ctx.beginPath(); ctx.ellipse(cx, cy - 0.235 * s, 0.13 * s, 0.012 * s, 0, 0, TAU); ctx.fill();
    // 七盏灯与管子
    ctx.strokeStyle = GOLDS;
    ctx.lineWidth = Math.max(0.5, 0.004 * s);
    const lamps = [];
    for (let i = 0; i < 7; i++) { const u = (i - 3) / 3, lx = cx + u * 0.16 * s, ly = cy - 0.3 * s - (1 - u * u) * 0.05 * s; lamps.push([lx, ly]); }
    ctx.beginPath();
    for (const p of lamps) for (let j = -1; j <= 1; j++) { ctx.moveTo(cx + j * 0.03 * s, cy - 0.24 * s); ctx.lineTo(p[0] + j * 0.006 * s, p[1] + 0.01 * s); }
    ctx.stroke();
    ctx.fillStyle = GOLDS;
    ctx.beginPath();
    for (const p of lamps) { ctx.moveTo(p[0] + 0.018 * s, p[1]); ctx.ellipse(p[0], p[1], 0.018 * s, 0.009 * s, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    // 灯火（一盏一盏点起）
    lamps.forEach((p, i) => { const on = clamp((k - 0.25 - i * 0.07) * 4, 0, 1); flame(ctx, p[0], p[1] - 0.004 * s, 0.05 * s * on, on, i * 2.7); });
    void un;
  }
  function drawFlyScroll(ctx) {
    const u = lv('tbScroll');
    if (u <= 0.002 || u >= 0.998) return;
    SP || sprites();
    const w = Math.min(0.46 * W.w, (tall() ? 0.5 : 0.26) * W.w), h = w / 2;
    const x = lerp(-0.3 * W.w, W.w + 0.3 * W.w, u), y = X('scrollY') * W.h + Math.sin(u * 7) * 0.02 * W.h;
    const a = Math.min(1, u * 10, (1 - u) * 10), un = UN();
    ctx.save();
    ctx.translate(x, y); ctx.rotate(Math.sin(W.t * 1.3) * 0.04 - 0.05);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, 0, 0, w * 0.8, a * 0.3, 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a * 0.95;
    ctx.fillStyle = 'rgb(240,228,198)';
    ctx.beginPath();
    const N = 12;
    for (let i = 0; i <= N; i++) { const xx = -w / 2 + w * i / N, yy = -h / 2 + Math.sin(i * 0.9 + W.t * 3) * h * 0.04; if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
    for (let i = N; i >= 0; i--) { const xx = -w / 2 + w * i / N, yy = h / 2 + Math.sin(i * 0.9 + W.t * 3) * h * 0.04; ctx.lineTo(xx, yy); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(120,90,60,0.55)';
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.beginPath();
    for (let r = 0; r < 7; r++) { const yy = -h * 0.36 + r * h * 0.12; for (let cc = 0; cc < 2; cc++) { const xa = -w * 0.44 + cc * w * 0.46; ctx.moveTo(xa, yy); ctx.lineTo(xa + w * (0.36 - 0.08 * hsh(r * 3 + cc)), yy); } }
    ctx.stroke();
    ctx.fillStyle = 'rgb(150,108,64)';
    ctx.fillRect(-w / 2 - w * 0.03, -h * 0.58, w * 0.05, h * 1.16);
    ctx.fillRect(w / 2 - w * 0.02, -h * 0.58, w * 0.05, h * 1.16);
    ctx.restore();
  }
  function drawBook(ctx) {
    const k = lv('tbBook');
    if (k < 0.01) return;
    SP || sprites();
    const c = X('book'), cx = c[0] * W.w, cy = c[1] * W.h + Math.sin(W.t * 0.8) * 3;
    const s = (tall() ? 0.26 : 0.12) * (tall() ? W.w : Math.min(W.w, W.h * 1.4)), un = UN();
    const open = clamp(k * 4, 0, 1), names = lv('tbNames');
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy, s * 1.2, 0.35 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = clamp(k, 0, 1);
    const pw = s * 0.5 * open, ph = s * 0.62;
    for (const d of [-1, 1]) {
      ctx.fillStyle = d < 0 ? 'rgb(242,232,206)' : 'rgb(234,222,194)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - ph / 2); ctx.quadraticCurveTo(cx + d * pw * 0.5, cy - ph / 2 - s * 0.04, cx + d * pw, cy - ph / 2 + s * 0.01);
      ctx.lineTo(cx + d * pw, cy + ph / 2); ctx.quadraticCurveTo(cx + d * pw * 0.5, cy + ph / 2 - s * 0.03, cx, cy + ph / 2); ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(150,110,70,0.8)';
    ctx.lineWidth = Math.max(0.6, 0.8 * un);
    ctx.beginPath(); ctx.moveTo(cx, cy - ph / 2); ctx.lineTo(cx, cy + ph / 2); ctx.stroke();
    // 记上的名字（一行一行发着金光）
    const rows = 7, total = rows * 2, n = names * total;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 206, 120, 0.95);
    ctx.lineWidth = Math.max(0.6, 1 * un);
    ctx.beginPath();
    for (let i = 0; i < total; i++) {
      const f = clamp(n - i, 0, 1);
      if (f <= 0) break;
      const d = i < rows ? -1 : 1, r = i % rows, yy = cy - ph * 0.36 + r * ph * 0.11, x0 = cx + d * pw * 0.14, len = pw * (0.6 - 0.15 * hsh(i)) * f;
      ctx.moveTo(x0, yy); ctx.lineTo(x0 + d * len, yy);
    }
    ctx.stroke();
    ctx.restore();
  }
  function drawWindows(ctx) {
    const k = lv('tbWindows'), p = lv('tbPour');
    if (k < 0.01 && p < 0.01) return;
    SP || sprites();
    const xs = X('win'), y = X('winY') * W.h, w = Math.max(18, (tall() ? 0.1 : 0.055) * W.w), h = w * 0.72, un = UN();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i] * W.w, yy = y + (i % 2) * h * 0.4, o = clamp(k * 1.3 - i * 0.06, 0, 1);
      if (o > 0.01) {
        glowAt(ctx, SP.gold, x, yy, w * 1.4, o * 0.45);
        ctx.globalAlpha = o;
        ctx.fillStyle = 'rgb(255,236,190)';
        ctx.fillRect(x - w / 2, yy - h / 2, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = U.rgba(214, 170, 92, 0.85 * o);
        ctx.lineWidth = Math.max(0.6, 1.2 * un);
        ctx.beginPath();
        ctx.rect(x - w / 2, yy - h / 2, w, h);
        ctx.moveTo(x, yy - h / 2); ctx.lineTo(x, yy + h / 2);
        ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy);
        ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
      }
      // 倾福：光自窗中倾下
      if (p > 0.01) {
        ctx.globalAlpha = clamp(p * 0.42, 0, 1);
        const bw = w * 2.2, g = W.h * 0.86;
        ctx.drawImage(SP.beam, x - bw / 2, yy, bw, g - yy);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 日头的光线（玛 4:2）：自东方的日头向全地扇开
  function drawRays(ctx, strong) {
    const k = lv('tbSun');
    if (k < 0.01) return;
    SP || sprites();
    const sx = W.sun.x, sy = Math.min(W.sun.y, W.horizonY + 4);
    const L = Math.hypot(W.w, W.h) * 1.15, N = 11;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (strong) {
      glowAt(ctx, SP.gold, sx, sy, M() * 0.55, k * 0.4);
      glowAt(ctx, SP.white, sx, sy, M() * 0.16, k * 0.5);
    }
    for (let i = 0; i < N; i++) {
      const ang = -0.34 + 0.84 * i / (N - 1) + Math.sin(W.t * 0.07 + i) * 0.01;
      const wid = L * (0.09 + 0.07 * hsh(i * 3.1));
      const a = k * (strong ? 0.22 : 0.08) * (0.65 + 0.35 * Math.sin(W.t * 0.45 + i * 1.7));
      ctx.save();
      ctx.translate(sx, sy); ctx.rotate(ang);
      ctx.globalAlpha = clamp(a, 0, 1);
      ctx.drawImage(SP.ray, 0, -wid / 2, L, wid);
      ctx.restore();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 医治的光扫过全地
  function drawHeal(ctx) {
    const u = lv('tbHeal');
    if (u <= 0.002 || u >= 0.998) return;
    SP || sprites();
    const x = lerp(0.3, 1.08, u) * W.w, a = Math.sin(Math.PI * u) * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.6;
    const bw = Math.max(80, 0.16 * W.w);
    ctx.drawImage(SP.beam, x - bw / 2, W.horizonY - 0.1 * W.h, bw, W.h * 0.52);
    glowAt(ctx, SP.gold, x, W.h * 0.86, bw * 0.9, a * 0.7, 0.4);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 势如烧着的火炉（玛 4:1）：夜里天边一线暗红，远山上的余烬
  function drawFurnace(ctx) {
    const k = lv('tbFurnace');
    if (k < 0.01) return;
    SP || sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const y = W.horizonY, cx = W.w * 0.78, rx = W.w * 0.42, ry = W.h * 0.14;
    ctx.save();
    ctx.translate(cx, y); ctx.scale(1, ry / rx);
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, U.rgba(255, 140, 70, 0.4 * k));
    gr.addColorStop(0.45, U.rgba(255, 100, 50, 0.2 * k));
    gr.addColorStop(1, 'rgba(255,80,40,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(-rx, -rx, rx * 2, rx);
    ctx.restore();
    for (let i = 0; i < 9; i++) {
      const xf = 0.58 + i * 0.047, g = gY(0, xf);
      glowAt(ctx, SP.red, xf * W.w, g, (10 + 8 * hsh(i)) * SU(), k * (0.5 + 0.4 * Math.sin(W.t * 2 + i * 1.3)));
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 远山的高处：发光的母鹿（哈 3:19）
  let HIND = null;
  function hindPath() {
    const key = W.w + 'x' + W.h + (tall() ? 'p' : 'l');
    if (HIND && HIND.key === key) return HIND;
    let best = X('hind1'), by = Infinity;
    for (let xf = X('hind0') + 0.12; xf <= X('hind1'); xf += 0.005) { const y = W.ridgeBaseY(0, xf * W.w); if (y < by) { by = y; best = xf; } }
    return (HIND = { key, x0: X('hind0'), x1: best });
  }
  function drawHind(ctx) {
    const u = lv('tbHind');
    if (u < 0.002) return;
    SP || sprites();
    const P = hindPath(), hops = 5;
    const xf = lerp(P.x0, P.x1, u), g = gY(0, xf);
    const s = Math.max(10, (tall() ? 0.05 : 0.028) * M());
    const leapU = u < 1 ? U.fract(u * hops) : 0, air = u < 1 ? Math.sin(Math.PI * leapU) : 0;
    const x = xf * W.w, y = g - air * s * 1.3 - 1;
    const a = Math.min(1, u * 12);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - s * 0.5, s * 1.8, a * 0.55);
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(x, y);
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(255,226,168)';
    ctx.strokeStyle = 'rgb(255,226,168)';
    // 身、颈、头、耳
    const tilt = u < 1 ? (leapU < 0.5 ? -0.25 : 0.2) : 0;
    ctx.rotate(tilt);
    ctx.beginPath(); ctx.ellipse(0, -s * 0.62, s * 0.42, s * 0.17, 0, 0, TAU); ctx.fill();
    ctx.lineWidth = Math.max(1, s * 0.1);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.7); ctx.lineTo(s * 0.46, -s * 1.02); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(s * 0.54, -s * 1.04, s * 0.13, s * 0.07, 0.3, 0, TAU); ctx.fill();
    ctx.lineWidth = Math.max(0.7, s * 0.05);
    ctx.beginPath(); ctx.moveTo(s * 0.46, -s * 1.08); ctx.lineTo(s * 0.4, -s * 1.22); ctx.stroke();
    // 腿：跳起时前后伸展，落地时收拢
    ctx.lineWidth = Math.max(0.7, s * 0.055);
    ctx.beginPath();
    const st = u < 1 ? air : 0;
    const legs = [[0.28, 1], [0.2, 1], [-0.28, -1], [-0.2, -1]];
    for (const q of legs) { const bx = q[0] * s, by = -s * 0.55, ex = bx + q[1] * st * s * 0.45, ey = by + s * 0.55 * (1 - st * 0.35); ctx.moveTo(bx, by); ctx.lineTo(ex, ey); }
    ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ── 香火：从日出之地到日落之处（玛 1:11）──
  const INC = [[0, 0.13], [0, 0.585], [0, 0.69], [0, 0.8], [0, 0.915], [1, 0.505], [1, 0.6], [2, 0.405]];
  function drawIncense(ctx, layer) {
    const k = lv('tbIncense');
    if (k < 0.004) return;
    SP || sprites();
    for (const q of INC) {
      if (q[0] !== layer) continue;
      const th = (q[1] - 0.1) / 0.9, on = clamp((k - th * 0.9) * 8, 0, 1);
      if (on < 0.01) continue;
      const x = q[1] * W.w, g = gY(layer, q[1]), ls = W.layerScale(layer) * (W.w < 600 ? 1.4 : 1), h = 16 * ls;
      smoke(ctx, x, g - h * 0.8, on, 120 * ls, 5 * ls, q[1] * 10, SP.incense);
      flame(ctx, x, g, h, on, q[1] * 30);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, g - h, h * 3, on * 0.4);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  // ── 人身上的光：冠冕、谦卑人的光、保障、暖光、火城、准绳、灯……（在 air 这一层，遍地黑暗之上）──
  function drawShelter(ctx) {
    const k = lv('tbShelter');
    if (k < 0.01) return;
    const p = crowdPt(S.shelter);
    if (!p) return;
    SP || sprites();
    const ph = PH(2), cx = p.x, cy = p.foot + 0.1 * ph, rx = (p.x1 - p.x0) / 2 + 1.1 * ph, ry = 2.1 * ph, un = UN();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy - ry * 0.5, rx * 1.1, k * 0.42, ry / rx * 1.1);
    glowAt(ctx, SP.warm, cx, cy - ph * 0.4, rx * 0.9, k * 0.35, 0.5);
    for (const q of [[5, 0.12], [1.5, 0.55]]) {
      ctx.strokeStyle = U.rgba(255, 232, 180, k * q[1] * (0.85 + 0.15 * Math.sin(W.t * 1.3)));
      ctx.lineWidth = Math.max(0.6, q[0] * un);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    }
    // 雨打在穹上溅起的光点
    if (W.lv.rain > 0.2) {
      ctx.fillStyle = U.rgba(255, 244, 214, 0.8 * k);
      for (let i = 0; i < 14; i++) {
        const ph2 = U.fract(W.t * 1.7 + hsh(i) * 7);
        if (ph2 > 0.3) continue;
        const a = Math.PI + (0.1 + 0.8 * hsh(i * 3.3 + Math.floor(W.t * 1.7 + hsh(i) * 7))) * Math.PI;
        const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
        ctx.beginPath(); ctx.arc(x, y - ph2 * 6 * un, Math.max(0.7, 1.2 * un), 0, TAU); ctx.fill();
      }
    }
    ctx.restore();
  }
  function drawLove(ctx) {
    const k = lv('tbLove');
    if (k < 0.01) return;
    SP || sprites();
    const Cm = city(), ph = PH(2), cx = (X('c0') + X('c1')) / 2 * W.w, cy = gY(2, (X('c0') + X('c1')) / 2) + 0.1 * ph;
    const rx = (X('c1') - X('c0')) * W.w * 0.62 + ph, ry = 3.4 * ph, un = UN();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, cx, cy - ry * 0.4, rx * 1.15, k * 0.45, 0.55);
    glowAt(ctx, SP.gold, cx, cy - ry * 0.5, rx * 0.5, k * 0.35, 0.8);
    // 自上而下临到众人的一片暖光
    ctx.globalAlpha = clamp(k * 0.32, 0, 1);
    ctx.drawImage(SP.beam, cx - rx * 0.85, -W.h * 0.05, rx * 1.7, cy + W.h * 0.05);
    const span = 0.2 + 0.72 * clamp(k, 0, 1);
    for (const d of [-1, 1]) {
      for (const q of [[9, 0.14], [3, 0.35], [1.4, 0.9]]) {
        ctx.strokeStyle = U.rgba(255, 210, 160, k * q[1]);
        ctx.lineWidth = Math.max(0.6, q[0] * un);
        ctx.beginPath();
        if (d < 0) ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI + span * Math.PI / 2);
        else ctx.ellipse(cx, cy, rx, ry, 0, TAU - span * Math.PI / 2, TAU);
        ctx.stroke();
      }
    }
    ctx.restore();
    void Cm;
  }
  function drawHumble(ctx) {
    const k = lv('tbHumble');
    if (k < 0.01) return;
    SP || sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of cmembers('humble')) {
      if (!m._vis || m.dying) continue;
      const h = m._h, x = m._x, y = m._y;
      glowAt(ctx, SP.gold, x, y - h * 0.5, h * 1.2, k * 0.35 * m.alpha, 1.1);
      glowAt(ctx, SP.white, x, y - h * 1.15, h * 0.18, k * 0.9 * m.alpha);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 用灯巡查耶路撒冷（番 1:12）：几盏灯在黑暗的城中移动
  function drawSearch(ctx) {
    const k = lv('tbLamps');
    if (k < 0.01) return;
    SP || sprites();
    const Cm = city(), ph = PH(2), un = UN();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const u = 0.5 + 0.5 * Math.sin(W.t * (0.16 + 0.03 * i) + i * 1.9);
      const xf = lerp(Cm.gx + 0.01, 0.99, u), row = [0.84, 0.54, 0.24, 0.05][i];
      const y = lerp(Cm.g(xf), Cm.t(xf), row) - 0.35 * ph + Math.sin(W.t * 2 + i) * 0.03 * ph;
      glowAt(ctx, SP.warm, xf * W.w, y, 1.6 * ph, k * 0.45);
      glowAt(ctx, SP.pearl, xf * W.w, y, 0.5 * ph, k * 0.6);
      ctx.fillStyle = U.rgba(255, 236, 190, k);
      ctx.beginPath(); ctx.arc(xf * W.w, y, Math.max(1.2, 0.07 * ph), 0, TAU); ctx.fill();
    }
    ctx.restore();
    void un;
  }
  // 因你欢欣喜乐（番 3:17）：歌的金环自上而下，落在城中的人身上
  function drawJoy(ctx) {
    const k = lv('tbJoy');
    if (k < 0.01) return;
    const p = crowdPt('zion') || crowdPt('humble');
    const ph = PH(2), un = UN();
    const cx = p ? p.x : (X('c0') + X('c1')) / 2 * W.w, cy = (p ? p.top : gY(2, 0.78) - ph) - 1.4 * ph;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    SP || sprites();
    glowAt(ctx, SP.gold, cx, cy, 3.2 * ph, k * 0.55);
    glowAt(ctx, SP.white, cx, cy, 0.8 * ph, k * 0.6);
    const N = 7, Rm = Math.max(W.w * 0.32, 8 * ph);
    for (let i = 0; i < N; i++) {
      const u = U.fract(W.t * 0.16 + i / N), r = 10 * un + u * Rm, a = k * Math.pow(1 - u, 1.2) * Math.min(1, u * 7);
      if (a < 0.01) continue;
      for (const q of [[7, 0.18], [2.2, 0.5], [1.1, 0.95]]) {
        ctx.strokeStyle = U.rgba(255, 224, 150, a * q[1]);
        ctx.lineWidth = Math.max(0.6, q[0] * un);
        ctx.beginPath(); ctx.ellipse(cx, cy + u * 1.6 * ph, r, r * 0.26, 0, 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawCrown(ctx) {
    const k = lv('tbCrown');
    if (k < 0.01) return;
    const p = figPt('joshua', 1.02), f = fig('joshua');
    if (!p || !f || !f._vis) return;
    SP || sprites();
    const h = f._h, w = h * 0.27, x = p[0] + (f.fd || f.facing || 1) * h * 0.02, y = p[1] + h * 0.05;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - w * 0.3, w * 2.4, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = clamp(k, 0, 1) * f.alpha;
    ctx.fillStyle = 'rgb(246,206,110)';
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - w * 0.5); ctx.lineTo(x - w / 4, y - w * 0.25); ctx.lineTo(x, y - w * 0.62); ctx.lineTo(x + w / 4, y - w * 0.25); ctx.lineTo(x + w / 2, y - w * 0.5); ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgb(226,232,240)';
    ctx.fillRect(x - w / 2, y - w * 0.14, w, w * 0.14);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawLine(ctx) {
    const k = lv('tbLine');
    if (k < 0.01) return;
    const f = fig('youth');
    if (!f || !f._vis) return;
    SP || sprites();
    const Cm = city(), h = f._h, fc = f.fd || f.facing || 1;
    const hx = f._x + fc * h * 0.3, hy = f._y - h * 0.72;
    const ex = W.w * 0.995, ey = Cm.t(0.99) - 1.1 * Cm.ph;
    const x2 = lerp(hx, ex, clamp(k, 0, 1)), y2 = lerp(hy, ey, clamp(k, 0, 1));
    const un = UN();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of [[4, 0.14], [1.2, 0.9]]) {
      ctx.strokeStyle = U.rgba(255, 226, 150, q[1] * clamp(k, 0, 1));
      ctx.lineWidth = Math.max(0.5, q[0] * un);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + x2) / 2, Math.max(hy, y2) + 0.08 * h, x2, y2); ctx.stroke();
    }
    ctx.fillStyle = U.rgba(255, 240, 200, 0.9 * clamp(k, 0, 1));
    for (let i = 1; i < 10; i++) { const u = i / 10, x = lerp(hx, x2, u), y = lerp(hy, y2, u) + Math.sin(Math.PI * u) * 0.08 * h; ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, 1.3 * un), 0, TAU); ctx.fill(); }
    glowAt(ctx, SP.gold, x2, y2, h * 0.5, 0.6 * k);
    ctx.restore();
  }
  // 四围的火城（亚 2:5）：back = 城后的半圈（在城之前画），front = 城前的半圈
  function fireRing() {
    const Cm = city(), ph = Cm.ph, cxf = (Cm.x0 + 1) / 2;
    const cx = cxf * W.w, g = Cm.g(cxf);
    return { cx, cy: g + 0.24 * fieldH(2, g) * 0.8, rx: (1 - Cm.x0) * W.w * 0.52 + 0.4 * ph, ry: 0.5 * fieldH(2, g) * 0.8 + 1.1 * ph, ph, Cm };
  }
  function drawFireRing(ctx, part) {
    const k = lv('tbFire');
    if (k < 0.01) return;
    const R = fireRing(), N = tall() ? 22 : 30;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU, s = Math.sin(a);
      if (part === 'back' ? s > 0 : s <= 0) continue;
      const x = R.cx + Math.cos(a) * R.rx;
      let y = R.cy + s * R.ry;
      if (s < 0) y = lerp(R.cy, R.Cm.g(x / W.w) - 0.2 * R.ph, Math.min(1, -s * 3));
      if (x < -20 || x > W.w + 20) continue;
      const hh = R.ph * (s > 0 ? 1.05 : 1.3) * (0.8 + 0.3 * hsh(i * 3.7)) * clamp(k * 1.2, 0, 1);
      flame(ctx, x, y, hh, clamp(k, 0, 1), i * 1.9, true, s < 0 ? 0 : 0.45);
    }
    if (part === 'front') {
      SP || sprites();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, R.cx, R.cy - R.ry * 0.3, R.rx * 1.05, k * 0.2, 0.45);
      glowAt(ctx, SP.gold, tgeo().x, tgeo().y - 1.4 * R.ph, 3 * R.ph, k * 0.3);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }
  function drawGlory(ctx) {
    const k = lv('tbGlory');
    if (k < 0.01 || lv('tbT2') < 0.5) return;
    SP || sprites();
    const G = tgeo(), ph = G.ph, cx = G.x - G.hw * 0.08, cy = G.y - G.pH - G.fh * 0.5;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pearl, cx, cy, G.hw * 1.6, k * 0.42, 0.8);
    glowAt(ctx, SP.gold, cx, cy + G.fh * 0.25, G.fw * 1.1, k * 0.55);
    ctx.globalAlpha = k * (0.16 + 0.3 * nightK());
    const bw = G.hw * 1.3;
    ctx.save(); ctx.translate(cx, cy + 0.2 * ph); ctx.scale(1, -1); ctx.drawImage(SP.beam, -bw / 2, 0, bw, W.h * 0.62); ctx.restore();
    ctx.restore();
    ctx.globalAlpha = 1;
    // 殿顶的石头的光
    const cp = lv('tbCap');
    if (cp > 0.02 && lv('tbT2') > 0.95) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, cx, G.y - G.pH - G.fh - 0.18 * ph, 0.8 * ph, cp * 0.7);
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  function drawCapGlow(ctx) {
    const cp = lv('tbCap');
    if (cp < 0.02 || lv('tbT2') < 0.95 || lv('tbGlory') > 0.05) return;
    SP || sprites();
    const G = tgeo(), cx = G.x - G.hw * 0.08;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, cx, G.y - G.pH - G.fh - 0.18 * G.ph, 0.9 * G.ph, cp * 0.7);
    glowAt(ctx, SP.gold, cx, G.y - G.pH - G.fh - 0.18 * G.ph, 2 * G.ph, cp * 0.3);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 遍地的荣光（哈 2:14）：近地之上一层极淡的金
  function drawKnow(ctx) {
    const k = lv('tbKnow');
    if (k < 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const y0 = W.horizonY - 0.08 * W.h, gr = ctx.createLinearGradient(0, y0, 0, W.h);
    gr.addColorStop(0, 'rgba(255,220,150,0)');
    gr.addColorStop(0.5, U.rgba(255, 220, 150, 0.1 * k));
    gr.addColorStop(1, U.rgba(255, 210, 130, 0.16 * k));
    ctx.fillStyle = gr;
    ctx.fillRect(0, y0, W.w, W.h - y0);
    ctx.restore();
  }
  // 守望的先知、奔跑的报信人手里的光
  function drawRunnerLight(ctx) {
    const f = fig('runner');
    // 远山上的人：_vis 只在它那一层为真，这里用上一次定位的坐标
    if (!f || f.dying || !(f.alpha > 0.02) || !isFinite(f._x) || !isFinite(f._y) || f._x < -40 || f._x > W.w + 40) return;
    SP || sprites();
    const x = f._x + (f.fd || f.facing || 1) * f._h * 0.3, y = f._y - f._h * 0.95;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, Math.max(26, f._h * 3.4), 0.7 * f.alpha);
    glowAt(ctx, SP.white, x, y, Math.max(5, f._h * 0.6), 1 * f.alpha);
    // 脚后留下一道光（脚登山）
    const d = f.fd || f.facing || 1;
    for (let i = 1; i < 6; i++) glowAt(ctx, SP.gold, f._x - d * i * f._h * 0.9, gY(0, (f._x - d * i * f._h * 0.9) / W.w) - 2, Math.max(8, f._h * 0.8), 0.5 * f.alpha * (1 - i / 6));
    ctx.restore(); ctx.globalAlpha = 1;
  }
  function drawLevi(ctx) {
    const k = lv('tbTeach');
    if (k < 0.01) return;
    const f = fig('levi');
    if (!f || !f._vis) return;
    SP || sprites();
    const h = f._h, fc = f.fd || f.facing || 1, x = f._x + fc * h * 0.16, y = f._y - h * 0.62;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, h * 0.5, k * 0.6);
    glowAt(ctx, SP.gold, f._x + fc * h * 0.06, f._y - h * 0.92, h * 0.35, k * 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = 'rgb(240,226,192)';
    ctx.fillRect(x - h * 0.07, y - h * 0.045, h * 0.14, h * 0.09);
    ctx.fillStyle = 'rgb(140,100,60)';
    ctx.fillRect(x - h * 0.09, y - h * 0.06, h * 0.035, h * 0.12);
    ctx.fillRect(x + h * 0.055, y - h * 0.06, h * 0.035, h * 0.12);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  const flash = (b, o) => { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); };
  const beam = (b, xf, layer, o) => flash(b, Object.assign({ type: 'beam', xf, layer: layer == null ? 2 : layer, v: 0.15, w: 90, dur: 4, a: 0.5 }, o));
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, Object.assign({ v: f.v || 0 }, o)); }
  function sparkleOn(b, key, n, rgb) {
    if (b.instant || !fx()) return;
    if (hasCrowd(key)) { for (const m of cmembers(key)) { if (!m._vis) continue; fx().sparkle(m._x, m._y - m._h * 0.6, n || 6, rgb || [255, 232, 170], 8 * SU(), 'air'); } return; }
    const p = figPt(key, 0.6);
    if (p) fx().sparkle(p[0], p[1], n || 16, rgb || [255, 232, 170], 10 * SU(), 'air');
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.25, dur || 2.2, 1.6); }
  // 在天上聚成几个字
  function glyphs(b, str, rgb, o) {
    if (b.instant || !fx() || !fx().nameStr) return;
    o = o || {};
    const g = X('glyph'), size = Math.max(20, (o.size || (tall() ? 0.075 : 0.045)) * (tall() ? W.w : M()));
    const cx = (o.x != null ? o.x : g[0]) * W.w, cy = (o.y != null ? o.y : g[1]) * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * W.w * 0.3, W.h * 0.82 + (Math.random() - 0.5) * 40]);
    fx().nameStr(str, cx, cy, size, rgb || [255, 226, 160], src, { hold: o.hold || 3, delay: o.delay || 0 });
    const a = au();
    if (a && a.nameChime) U.safe('tb.nameChime', () => a.nameChime(str[0]));
  }
  // 一道金流：自 A 流到 B（像素点或函数）
  function stream(b, A, B, o) { flash(b, Object.assign({ type: 'stream', A, B, dur: 4 }, o)); }
  const ptv = p => (typeof p === 'function' ? p() : p);
  function drawFXL(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    ctx.save();
    for (const e of FXL) {
      const u = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        const a = e.a * Math.sin(Math.PI * u), x = e.xf * W.w, g = e.layer === 2 ? vY(e.xf, e.v) : gY(e.layer, e.xf), w = e.w * SU() * (e.layer === 1 ? 0.6 : e.layer === 0 ? 0.4 : 1);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = clamp(a, 0, 1);
        ctx.drawImage(SP.beam, x - w / 2, -W.h * 0.04, w, g + W.h * 0.05);
        glowAt(ctx, SP.gold, x, g - PH(e.layer) * 0.5, w * 0.8, a * 0.5, 0.5);
      } else if (e.type === 'stream') {
        const A = ptv(e.A), B = ptv(e.B);
        if (!A || !B) continue;
        ctx.globalCompositeOperation = 'lighter';
        const n = e.n || 22;
        for (let i = 0; i < n; i++) {
          const s = clamp(u * 1.5 - i / n * 0.5, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const x = lerp(A[0], B[0], s), y = lerp(A[1], B[1], s) - Math.sin(Math.PI * s) * (e.arc != null ? e.arc : 0.08) * W.h + Math.sin(i * 2.1 + e.t * 3) * 3;
          glowAt(ctx, SP[e.spr || 'gold'], x, y, (4 + 3 * hsh(i)) * SU(), 0.85 * Math.sin(Math.PI * s));
        }
      } else if (e.type === 'flash') {
        const a = (e.a || 0.7) * Math.pow(1 - u, 1.5) * Math.min(1, u * 8);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP[e.spr || 'gold'], e.x, e.y, e.r, a);
      } else if (e.type === 'stone') {
        // 殿顶的石头自所罗巴伯手中升到殿顶
        const A = ptv(e.A), B = ptv(e.B);
        if (!A || !B) continue;
        const eu = u * u * (3 - 2 * u), x = lerp(A[0], B[0], eu), y = lerp(A[1], B[1], eu) - Math.sin(Math.PI * eu) * 0.06 * W.h;
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.white, x, y, 12 * SU(), 0.9);
        glowAt(ctx, SP.gold, x, y, 30 * SU(), 0.5);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // 装饰的微光（随机无妨）：歌、灵、倾下的福、升到纪念册的名、医治
  const MOTE = [];
  function spawnMotes(dt) {
    if (W.replaying || (GS.debug && GS.debug.noDraw)) return;
    if (MOTE.length > 110) return;
    const song = lv('tbSong');
    if (song > 0.2 && Math.random() < dt * 3 * song) {
      const p = figPt('hab', 1);
      if (p) MOTE.push({ x: p[0] + (Math.random() - 0.5) * 8, y: p[1], vx: (Math.random() - 0.3) * 14 * SU(), vy: -(20 + 16 * Math.random()) * SU(), t: 0, dur: 2.4 + Math.random(), c: 'gold', r: (1.6 + Math.random() * 1.6) * SU() });
    }
    const sp = lv('tbSpirit');
    if (sp > 0.15 && Math.random() < dt * 14 * sp) {
      const xf = lerp(X('c0') - 0.04, 1, Math.random());
      MOTE.push({ x: xf * W.w, y: W.h * (0.15 + 0.3 * Math.random()), vx: (Math.random() - 0.5) * 6, vy: (26 + 20 * Math.random()) * SU(), t: 0, dur: 3 + Math.random() * 1.5, c: 'pearl', r: (1.3 + Math.random() * 1.4) * SU() });
    }
    const po = lv('tbPour');
    if (po > 0.15 && Math.random() < dt * 22 * po) {
      const xs = X('win'), x = xs[(Math.random() * xs.length) | 0] * W.w + (Math.random() - 0.5) * 0.05 * W.w;
      MOTE.push({ x, y: X('winY') * W.h, vx: (Math.random() - 0.5) * 8, vy: (70 + 50 * Math.random()) * SU(), t: 0, dur: 2.6 + Math.random(), c: 'gold', r: (1.4 + Math.random() * 1.6) * SU() });
    }
    const nm = lv('tbNames'), bk = lv('tbBook');
    if (bk > 0.5 && nm > 0.02 && nm < 0.99 && Math.random() < dt * 3) {
      const ids = ['f1a', 'f1b', 'f2a', 'f2b'], id = ids[(Math.random() * 4) | 0], p = figPt(id, 1.05), c = X('book');
      if (p) MOTE.push({ x: p[0], y: p[1], tx: c[0] * W.w, ty: c[1] * W.h, t: 0, dur: 2.6, c: 'gold', r: 2 * SU(), home: true, x0: p[0], y0: p[1] });
    }
    const hl = lv('tbHeal');
    if (hl > 0.02 && hl < 0.98 && Math.random() < dt * 20) {
      const x = lerp(0.3, 1.08, hl) * W.w + (Math.random() - 0.5) * 0.1 * W.w, xf = x / W.w;
      if (xf > 0.36 && xf < 1) MOTE.push({ x, y: vY(xf, Math.random() * 0.8), vx: 0, vy: -(18 + 20 * Math.random()) * SU(), t: 0, dur: 1.8 + Math.random(), c: 'gold', r: (1.2 + Math.random() * 1.4) * SU() });
    }
  }
  function drawMotes(ctx) {
    if (!MOTE.length) return;
    SP || sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of MOTE) {
      const u = p.t / p.dur, a = Math.sin(Math.PI * clamp(u, 0, 1)) * 0.9;
      glowAt(ctx, SP[p.c] || SP.gold, p.x, p.y, p.r * 2.4, a);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { NIN = null; CITY = null; HIND = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; if (MOTE.length) MOTE.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      spawnMotes(f);
      for (let i = MOTE.length - 1; i >= 0; i--) {
        const p = MOTE[i];
        p.t += f;
        if (p.home) { const e = clamp(p.t / p.dur, 0, 1), ee = e * e * (3 - 2 * e); p.x = lerp(p.x0, p.tx, ee); p.y = lerp(p.y0, p.ty, ee) - Math.sin(Math.PI * ee) * 30 * SU(); }
        else { p.x += p.vx * f; p.y += p.vy * f; }
        if (p.t >= p.dur) MOTE.splice(i, 1);
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawFurnace(ctx); drawRays(ctx, true); return; }
      if (pass === 'far') { drawIncense(ctx, 0); drawHind(ctx); return; }
      if (pass === 'mid') { U.safe('tb.nineveh', () => drawNineveh(ctx)); drawIncense(ctx, 1); return; }
      if (pass === 'near') {
        const Cm = city();
        U.safe('tb.garden', () => { drawOlive(ctx, X('olive'), lv('tbOrchard')); drawFig(ctx, X('fig'), lv('tbOrchard')); drawVine(ctx, X('vine'), lv('tbOrchard')); });
        U.safe('tb.tower', () => drawTower(ctx));
        U.safe('tb.fold', () => drawFold(ctx));
        drawFireRing(ctx, 'back');
        U.safe('tb.city', () => {
          drawHill(ctx, Cm);
          drawTemple(ctx);
          drawHouses(ctx, Cm, 0); drawHouses(ctx, Cm, 1); drawHouses(ctx, Cm, 2);
          drawWall(ctx, Cm);
        });
        drawFount(ctx);
        U.safe('tb.river', () => drawRiver(ctx));
        U.safe('tb.field', () => drawField(ctx));
        drawTablets(ctx);
        drawIncense(ctx, 2);
        return;
      }
      if (pass === 'air') {
        drawKnow(ctx);
        drawTowerFront(ctx);
        drawRays(ctx, false);
        drawHeal(ctx);
        drawGlory(ctx);
        drawCapGlow(ctx);
        drawShelter(ctx);
        drawSearch(ctx);
        drawHumble(ctx);
        drawJoy(ctx);
        drawLove(ctx);
        drawFireRing(ctx, 'front');
        drawLine(ctx);
        drawCrown(ctx);
        drawLevi(ctx);
        drawRunnerLight(ctx);
        drawWindows(ctx);
        drawLampstand(ctx);
        drawFlyScroll(ctx);
        drawBook(ctx);
        drawMotes(ctx);
        drawFXL(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawSeaGlow(ctx, pass);
    },
    reset() { FXL.length = 0; MOTE.length = 0; },
    restore() { FXL.length = 0; MOTE.length = 0; CITY = null; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const G = tgeo(), Cm = city(), ph = PH(2);
      if (lv('tbT1') > 0.5) consider('耶和华的殿', G.x, G.y - G.fh * 0.6);
      else if (lv('tbT2') > 0.9) consider('这殿', G.x, G.y - G.fh * 0.6);
      else consider('荒凉的殿', G.x, G.y - 0.3 * ph);
      consider('锡安', (Cm.gx + 0.08) * W.w, Cm.t(Cm.gx + 0.08) - 0.3 * ph);
      consider('城门', Cm.gx * W.w, Cm.g(Cm.gx) - 0.6 * ph);
      consider('尼尼微', X('ninPal') * W.w, gY(1, X('ninPal')) - PH(1) * 1.5);
      const T0 = towerG();
      consider('望楼', T0.x, T0.g - T0.h * 0.5);
      if (lv('tbTablet') > 0.5) { const P = tabletPts()[0]; consider('版', P[0], P[1] - 0.3 * ph); }
      consider('无花果树', X('fig') * W.w, gY(2, X('fig')) - ph * 1.2);
      consider('葡萄树', X('vine') * W.w, gY(2, X('vine')) - ph * 0.9);
      consider('橄榄树', X('olive') * W.w, gY(2, X('olive')) - ph * 1.4);
      consider('羊圈', (X('fold0') + X('fold1')) / 2 * W.w, vY((X('fold0') + X('fold1')) / 2, 0.08) - ph * 0.3);
      consider('田地', (X('field0') + X('field1')) / 2 * W.w, vY((X('field0') + X('field1')) / 2, 0.6));
      if (lv('tbFount') > 0.5) consider('泉源', X('fount') * W.w, vY(X('fount'), 0.03) - ph * 0.3);
      if (lv('tbRiver') > 0.5) { const p = samplePath(riverPaths()[0], 0.55); consider('活水', p[0] * W.w, vY(p[0], p[1])); }
      if (lv('tbLampstand') > 0.5) { const c = X('lamp'); consider('灯台', c[0] * W.w, c[1] * W.h); }
      if (lv('tbBook') > 0.5) { const c = X('book'); consider('纪念册', c[0] * W.w, c[1] * W.h); }
      if (lv('tbHind') > 0.5) { const P = hindPath(), xf = lerp(P.x0, P.x1, lv('tbHind')); consider('母鹿', xf * W.w, gY(0, xf) - 8); }
      if (lv('tbFire') > 0.5) { const R = fireRing(); consider('火城', R.cx - R.rx * 0.6, R.cy); }
      if (lv('tbSun') > 0.5) consider('公义的日头', W.sun.x, W.sun.y);
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const cx0 = () => X('c0'), cx1 = () => X('c1');
  function mkJudah(pose, label) {
    const a = cx0(), b = cx1() - (tall() ? 0.02 : 0.1);
    crowd('judah', { n: nn(7), x0: a, x1: b, layer: 2, label: label || '犹大人', pose }, folk(0.1, 0.42));
    cface('judah', -1);
  }
  function mkZion(pose, label) {
    const a = cx0() + 0.01, b = cx1();
    crowd('zion', { n: nn(8), x0: a, x1: b, layer: 2, label: label || '锡安的民', pose }, folk(0.08, 0.36));
  }
  const dir = (id, xf) => face(id, xf);
  // 牛犊跳跃之处（圈前的空地）：[x, 纵深 v]
  const CALF = () => { const a = X('fold0'); return [[a + 0.005, 0.3], [a + 0.035, 0.44], [a + 0.066, 0.34]]; };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：旋风与暴风将至；尼尼微灯火通明；锡安的夜
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; MOTE.length = 0; S = fresh(); CITY = null; NIN = null; HIND = null; }
  function setup() {
    W.set('bare', 0.12, true); W.set('bloom', 0.5, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.7, land: 1, grass: 0.78, herbs: 0.5, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.set('tbNinLit', 1, true); W.set('tbCity', 1, true); W.set('tbT1', 1, true); W.set('tbOrchard', 1, true);
    W.set('tbField', 0.6, true); W.set('tbFold', 1, true); W.set('tbStall', 1, true);
    W.set('storm', 0.42, true); W.set('gale', 0.25, true);
    W.freeClock = false;
    const ox = W.w * 0.995, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', W.w * 0.5, W.ridgeBaseY(2, W.w * 0.5)); W.setOrigin('herbs', W.w * 0.5, W.ridgeBaseY(2, W.w * 0.5)); W.setOrigin('trees', ox, oy);
    W.goTo(0.8, 0, true);
    const lx = W.w * 0.6, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 16, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 4, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    mkJudah('stand');
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 那鸿书：耶和华本为善，在患难的日子为人的保障；尼尼微倾覆；报好信的脚登山 ─────
    {
      kind: 'act', utter: '耶和华本为善，在患难的日子为人的保障', cmd: 'mount 保障 --for 投靠他的人  # 河闸开放，宫殿冲没', ref: '那鸿书 1:7', tint: [232, 228, 255],
      verse: [
        { text: '耶和华本为善，在患难的日子为人的保障，<br>并且认得那些投靠他的人。', ref: '那鸿书 1:7', hold: 6 },
        { text: '河闸开放，宫殿冲没。……<br>尼尼微自古以来充满人民，如同聚水的池子；<br>现在居民却都逃跑。', ref: '那鸿书 2:6–8', hold: 7 },
        { text: '凡看见你的，都必逃跑离开你，说：<br>尼尼微荒凉了！有谁为你悲伤呢？', ref: '那鸿书 3:7', hold: 6 },
        { text: '看哪，有报好信传平安之人的脚登山，说：<br>犹大啊，可以守你的节期，还你所许的愿吧！', ref: '那鸿书 1:15', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.93, 6, b.instant);
            W.set('clouds', 0.95, b.instant); W.set('storm', 0.95, b.instant); W.set('rain', 0.85, b.instant); W.set('gale', 0.6, b.instant);
            S.shelter = 'judah';
            W.set('tbShelter', 1, b.instant);
            cpose('judah', 'kneel'); cface('judah', -1);
            sfx(b, 'rain'); sfx(b, 'wind');
          }],
          [2.2, b => { cpose('judah', 'pray'); if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: X('ninPal') - 0.03, y: 0.68 }); }],
          [7.4, b => {
            W.set('tbNinFlood', 1, b.instant); W.set('tbNinRuin', 1, b.instant);
            if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: X('ninPal'), y: 0.66 });
            sfx(b, 'splash', { size: 3 }); sfx(b, 'thunder');
          }],
          [12.4, b => { W.set('tbNinLit', 0, b.instant); sfx(b, 'weep', { soft: true, far: true }); }],
          [15.4, b => {
            W.set('storm', 0.3, b.instant); W.set('rain', 0.12, b.instant); W.set('gale', 0.12, b.instant); W.set('clouds', 0.6, b.instant);
            W.set('tbNinFlood', 0, b.instant);
          }],
          [18.6, b => { W.set('rain', 0, b.instant); W.set('storm', 0.05, b.instant); W.set('tbShelter', 0.4, b.instant); cpose('judah', 'stand'); }],
          [21.6, b => {
            W.goTo(0.22, 9, b.instant);
            W.set('clouds', 0.4, b.instant); W.set('storm', 0, b.instant); W.set('gale', 0, b.instant);
            add('runner', { label: '报好信的人', layer: 0, x: X('run0'), facing: 1, robe: [236, 226, 204], glow: 0.9, prop: null });
            walk('runner', X('run1'), { run: true, speed: 0.042 });
            sfx(b, 'harp', { soft: true });
          }],
          [25.2, b => {
            W.set('tbShelter', 0, b.instant); W.set('tbFeast', 1, b.instant);
            cpose('judah', 'raise'); cface('judah', -1);
            sfx(b, 'crowd', { soft: true });
          }],
          [29, () => { cpose('judah', 'stand'); }],
        ]);
      },
    },

    // ── 哈巴谷书 1—2：要到几时呢？站在望楼上；将这默示明明地写在版上；荣光如水充满洋海 ─────
    {
      kind: 'cmd', utter: '将这默示明明地写在版上', cmd: 'echo "默示" > 版  # 虽然迟延，还要等候', ref: '哈巴谷书 2:2', tint: [255, 236, 190],
      verse: [
        { text: '耶和华啊！我呼求你，你不应允，要到几时呢？<br>我因强暴哀求你，你还不拯救。', ref: '哈巴谷书 1:2', hold: 6 },
        { text: '我要站在守望所，立在望楼上观看，<br>看耶和华对我说什么话。', ref: '哈巴谷书 2:1', hold: 5.5 },
        { text: '他对我说：将这默示明明地写在版上，使读的人容易读。……<br>虽然迟延，还要等候；因为必然临到，不再迟延。', ref: '哈巴谷书 2:2–3', hold: 8 },
        { text: '认识耶和华荣耀的知识要充满遍地，<br>好像水充满洋海一般。', ref: '哈巴谷书 2:14', hold: 6 },
      ],
      apply(c) {
        const tw = X('tower');
        T(c, [
          [0, b => {
            rm('runner');
            W.set('tbFeast', 0, b.instant);
            W.goTo(0.285, 22, b.instant);
            add('hab', { label: '哈巴谷', x: tw, facing: -1, robe: PROPHET, hair: 'cloth', beard: true, glow: 0.5, prop: null, pose: 'weep' });
            S.watch = true;
            attach('hab', watchPt);
            cpose('judah', 'sit');
            sfx(b, 'weep', { soft: true });
          }],
          [5.4, () => { pose('hab', 'gaze'); face('hab', -1); }],
          [7.6, b => { pose('hab', 'stand'); beam(b, tw, 2, { v: 0, w: 70, dur: 5, a: 0.5 }); sfx(b, 'chime'); }],
          [9.4, b => { W.set('tbTablet', 1, b.instant); W.set('tbWrite', 1, b.instant); pose('hab', 'point'); face('hab', 1); sfx(b, 'build', { soft: true }); }],
          [13.8, b => { sfx(b, 'build', { soft: true }); }],
          [19.8, () => { pose('hab', 'sit'); face('hab', -1); }],
          [22.8, b => {
            const P = tabletPts();
            stream(b, P[0], [W.w * 0.3, W.h * 0.8], { dur: 3.5, arc: 0.1 });
            stream(b, P[1], [W.w * 0.18, W.h * 0.72], { dur: 4, arc: 0.14 });
            sfx(b, 'harp');
          }],
          [24.6, b => {
            W.set('tbSea', 1, b.instant); W.set('tbKnow', 1, b.instant);
            pose('hab', 'raise'); cpose('judah', 'gaze');
            sfx(b, 'angel', { soft: true });
          }],
          [29, b => { W.set('tbKnow', 0.3, b.instant); pose('hab', 'stand'); }],
        ]);
      },
    },

    // ── 哈巴谷书 3：虽然无花果树不发旺……然而，我要因耶和华欢欣；母鹿的蹄，稳行在高处 ─────
    {
      kind: 'act', utter: '主耶和华是我的力量', cmd: 'while (!无花果.发旺) 欢欣()  # 然而', ref: '哈巴谷书 3:19', tint: [255, 228, 168],
      verse: [
        { text: '虽然无花果树不发旺，葡萄树不结果，橄榄树也不效力，<br>田地不出粮食，圈中绝了羊，棚内也没有牛；', ref: '哈巴谷书 3:17', hold: 8 },
        { text: '然而，我要因耶和华欢欣，因救我的神喜乐。', ref: '哈巴谷书 3:18', hold: 5.5 },
        { text: '主耶和华是我的力量；他使我的脚快如母鹿的蹄，<br>又使我稳行在高处。', ref: '哈巴谷书 3:19', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.5, 9, b.instant);
            W.set('tbSea', 0.12, b.instant); W.set('tbKnow', 0, b.instant);
            W.set('bare', 0.85, b.instant); W.set('grass', 0.3, b.instant); W.set('herbs', 0.15, b.instant); W.set('bloom', 0, b.instant);
            W.set('tbOrchard', 0, b.instant); W.set('tbField', 0, b.instant); W.set('clouds', 0.15, b.instant);
            pose('hab', 'stand');
            cpose('judah', 'sit');
            sfx(b, 'wind', { soft: true });
          }],
          [3, b => { W.set('tbFold', 0, b.instant); sfx(b, 'bleat', { soft: true, far: true }); }],
          [5.2, b => { W.set('tbStall', 0, b.instant); sfx(b, 'cow', { soft: true, far: true }); }],
          [7.6, () => { cpose('judah', 'weep'); pose('hab', 'bow'); }],
          [9.6, b => { pose('hab', 'raise'); W.set('tbSong', 1, b.instant); sfx(b, 'harp'); glow('hab', 0.8); }],
          [12, b => { cpose('judah', 'stand'); cface('judah', -1); sfx(b, 'harp', { soft: true }); }],
          [14.4, () => { cpose('judah', 'gaze'); }],
          [16.6, b => { W.set('tbHind', 1, b.instant); sfx(b, 'wings', { soft: true }); }],
          [21.5, b => { cpose('judah', 'raise'); sfx(b, 'chime'); }],
          [24.5, b => { W.set('tbSong', 0.35, b.instant); cpose('judah', 'stand'); }],
        ]);
      },
    },

    // ── 西番雅书 1—2：我必用灯巡查耶路撒冷；黑暗幽冥的日子；谦卑人；尼尼微荒凉 ─────
    {
      kind: 'judge', utter: '我必用灯巡查耶路撒冷', cmd: 'grep -r 渣滓 耶路撒冷 --lamp  # 耶和华的日子', ref: '西番雅书 1:12', tint: [214, 208, 232],
      verse: [
        { text: '那时，我必用灯巡查耶路撒冷；<br>我必惩罚那些如酒在渣滓上澄清的。', ref: '西番雅书 1:12', hold: 6 },
        { text: '那日是忿怒的日子，……<br>是黑暗幽冥、密云乌黑的日子。', ref: '西番雅书 1:15', hold: 5.5 },
        { text: '世上遵守耶和华典章的谦卑人哪，你们都当寻求耶和华！<br>当寻求公义谦卑，或者在耶和华发怒的日子可以隐藏起来。', ref: '西番雅书 2:3', hold: 8 },
        { text: '耶和华必伸手攻击北方，毁灭亚述，<br>使尼尼微荒凉，又干旱如旷野。', ref: '西番雅书 2:13', hold: 6 },
      ],
      apply(c) {
        const tw = X('tower'), ol = X('olive');
        T(c, [
          [0, b => {
            W.goTo(0.6, 20, b.instant);
            W.set('gloom', 0.86, b.instant); W.set('clouds', 0.95, b.instant); W.set('storm', 0.5, b.instant);
            W.set('tbSong', 0, b.instant); W.set('tbHind', 0, b.instant);
            W.set('tbLamps', 1, b.instant); W.set('tbCity', 0, b.instant);
            pose('hab', 'bow'); glow('hab', 0.4);
            cpose('judah', 'bow');
            sfx(b, 'thunder', { far: true, soft: true });
          }],
          [3.2, b => { W.set('tbT1', 0, b.instant); sfx(b, 'build', { low: true, soft: true }); }],
          [7.8, b => { crm('judah'); sfx(b, 'weep', { soft: true }); }],
          [10.6, () => { rm('hab'); }],
          [12.8, () => { S.watch = false; attach('hab', null); }],
          [13.6, () => {
            crowd('humble', { n: nn(4), x0: tw + 0.035, x1: ol + 0.045, layer: 2, label: '谦卑人', pose: 'kneel' }, folk(0.22, 0.46));
            cface('humble', 1);
          }],
          [15.4, b => { W.set('tbHumble', 1, b.instant); cpose('humble', 'pray'); sfx(b, 'harp', { soft: true }); }],
          [21.6, b => {
            W.set('gloom', 0.45, b.instant); W.set('tbLamps', 0, b.instant);
            herd('ninFlock', { kind: 'sheep', n: nn(6), x0: X('nin0') + 0.01, x1: X('nin1') - 0.02, layer: 1, label: '群畜', pose: 'lie' });
            sfx(b, 'bleat', { soft: true, far: true });
          }],
          [26.4, () => { cpose('humble', 'kneel'); }],
        ]);
      },
    },

    // ── 西番雅书 3：锡安的民哪，应当歌唱！他在你中间必因你欢欣喜乐；被掳之人归回 ─────
    {
      kind: 'act', utter: '他在你中间必因你欢欣喜乐', cmd: 'sing --over 锡安 --quiet-love  # 且因你喜乐而欢呼', ref: '西番雅书 3:17', tint: [255, 226, 150],
      verse: [
        { text: '锡安的民哪，应当歌唱！以色列啊，应当欢呼！<br>耶路撒冷的民哪，应当满心欢喜快乐！', ref: '西番雅书 3:14', hold: 6.5 },
        { text: '耶和华你的神是施行拯救、大有能力的主。<br>他在你中间必因你欢欣喜乐，默然爱你，<br>且因你喜乐而欢呼。', ref: '西番雅书 3:17', hold: 8 },
        { text: '那时，我必领你们进来，聚集你们；<br>我使你们被掳之人归回的时候，<br>就必使你们在地上的万民中有名声，得称赞。', ref: '西番雅书 3:20', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('gloom', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.35, b.instant);
            W.goTo(0.72, 12, b.instant);
            W.set('tbHumble', 0.5, b.instant);
            cpose('humble', 'stand');
            sfx(b, 'wind', { soft: true });
          }],
          [2.4, b => {
            const a = cx0() + 0.01;
            crowd('zion', { n: nn(5), x0: a, x1: a + 0.16, layer: 2, label: '锡安的民', pose: 'stand' }, folk(0.1, 0.4));
            cface('zion', -1);
            cpose('humble', 'raise');
            sfx(b, 'crowd', { soft: true });
          }],
          [4.6, b => { cpose('zion', 'raise'); W.set('tbJoy', 1, b.instant); sfx(b, 'angel'); }],
          [11.2, b => { W.set('tbJoy', 0.3, b.instant); cpose('zion', 'stand'); cpose('humble', 'stand'); }],
          [14.6, b => { W.set('tbJoy', 1, b.instant); cpose('zion', 'raise'); cpose('humble', 'raise'); sfx(b, 'angel', { soft: true }); sfx(b, 'laugh', { soft: true }); }],
          [17.6, b => {
            crowd('exiles', { n: nn(6), x0: 0.37, x1: 0.44, layer: 2, label: '被掳之人', pose: 'walk' }, folk(0.22, 0.5));
            cwalk('exiles', cx0() + 0.17, cx1() - 0.04, { speed: 0.03 });
            W.set('tbJoy', 0.6, b.instant);
            sfx(b, 'crowd');
          }],
          [21, () => { cpose('humble', 'stand'); cpose('zion', 'stand'); cwalk('humble', cx0() - 0.02, cx0() + 0.08, { speed: 0.02 }); }],
          [26.6, b => { W.set('tbJoy', 0, b.instant); W.set('tbHumble', 0, b.instant); cface('exiles', -1); cpose('exiles', 'raise'); }],
        ]);
      },
    },

    // ── 哈该书：这殿仍然荒凉；耶和华激动众人的心；殿建起；这殿后来的荣耀必大过先前的荣耀 ─────
    {
      kind: 'promise', utter: '这殿后来的荣耀必大过先前的荣耀', cmd: 'rebuild 殿 && assert(后来的荣耀 > 先前的荣耀)', ref: '哈该书 2:9', tint: [255, 236, 186],
      verse: [
        { text: '这殿仍然荒凉，你们自己还住天花板的房屋吗？', ref: '哈该书 1:4', hold: 5.5 },
        { text: '耶和华激动……所罗巴伯和……大祭司约书亚，并剩下之百姓的心，<br>他们就来为万军之耶和华他们神的殿做工。', ref: '哈该书 1:14', hold: 8 },
        { text: '我必震动万国；万国的珍宝必都运来，<br>我就使这殿满了荣耀。', ref: '哈该书 2:7', hold: 6 },
        { text: '这殿后来的荣耀必大过先前的荣耀；<br>在这地方我必赐平安。', ref: '哈该书 2:9', hold: 6 },
      ],
      apply(c) {
        const a = cx0();
        T(c, [
          [0, b => {
            W.goTo(0.4, 10, b.instant);
            W.set('tbCity', 1, b.instant); W.set('tbSea', 0, b.instant);
            crm('humble');
            crelabel('exiles', '剩下的百姓'); crelabel('zion', '剩下的百姓');
            cpose('exiles', 'sit'); cpose('zion', 'sit');
            add('haggai', { label: '哈该', x: a + 0.005, facing: 1, robe: PROPHET, hair: 'cloth', beard: true, glow: 0.45, v: 0.34, prop: 'staff' });
            add('zerub', { label: '所罗巴伯', x: a + 0.05, facing: 1, robe: [86, 104, 146], accent: [214, 190, 120], glow: 0.3, v: 0.18, prop: null });
            add('joshua', { label: '大祭司约书亚', x: a + 0.08, facing: 1, robe: LINEN, hair: 'cloth', accent: [110, 90, 160], glow: 0.3, v: 0.12, prop: null });
          }],
          [2.2, () => { pose('haggai', 'point'); }],
          [7.2, b => {
            pose('haggai', 'stand');
            beamOn(b, 'zerub', { w: 80, dur: 4.5, a: 0.5 }); beamOn(b, 'joshua', { w: 80, dur: 4.5, a: 0.5 });
            glow('zerub', 0.7); glow('joshua', 0.7); sparkleOn(b, 'zerub', 14); sparkleOn(b, 'joshua', 14);
            sfx(b, 'harp');
          }],
          [9, b => {
            cpose('exiles', 'stand'); cpose('zion', 'stand'); cglow('exiles', 0.35); cglow('zion', 0.35); sparkleOn(b, 'exiles', 4);
            cprop('exiles', 'wood'); cprop('zion', 'wood');
            cwalk('exiles', 0.74, 0.92, { speed: 0.03, pose: 'bow' }); cwalk('zion', 0.66, 0.8, { speed: 0.03, pose: 'bow' });
            walk('zerub', 0.7, { speed: 0.025, pose: 'point' }); walk('joshua', 0.75, { speed: 0.025 });
          }],
          [11, b => { W.set('tbScaf', 1, b.instant); W.set('tbT2', 1, b.instant); sfx(b, 'build'); }],
          [14.2, b => { sfx(b, 'build'); }],
          [16.8, b => {
            const G = () => { const g = tgeo(); return [g.x, g.y - g.fh * 0.6]; };
            stream(b, [W.w * 0.05, W.h * 0.5], G, { dur: 4.5, arc: 0.12, n: 26 });
            stream(b, [W.w * 1.02, W.h * 0.35], G, { dur: 4.5, arc: 0.06, n: 18 });
            sfx(b, 'chime'); sfx(b, 'build', { soft: true });
          }],
          [19.6, b => { W.set('tbScaf', 0, b.instant); W.set('tbGlory', 0.7, b.instant); cprop('exiles', null); cprop('zion', null); cpose('exiles', 'raise'); cpose('zion', 'raise'); sfx(b, 'angel'); }],
          [24, b => {
            W.set('tbGlory', 1, b.instant);
            pose('zerub', 'bow'); pose('joshua', 'bow'); pose('haggai', 'bow');
            cpose('exiles', 'bow'); cpose('zion', 'bow');
            const g = tgeo();
            ringAt(b, g.x, g.y - g.fh * 0.5, [255, 240, 210], M() * 0.45, 3);
            sfx(b, 'harp', { soft: true });
          }],
          [27.4, () => { cpose('exiles', 'stand'); cpose('zion', 'stand'); pose('zerub', 'stand'); pose('joshua', 'stand'); pose('haggai', 'stand'); }],
        ]);
      },
    },

    // ── 撒迦利亚书 1—3：准绳拉在耶路撒冷之上；四围的火城；约书亚穿上华美的衣服 ─────
    {
      kind: 'promise', utter: '我要作耶路撒冷四围的火城', cmd: 'firewall --around 耶路撒冷 --no-walls  # 并要作其中的荣耀', ref: '撒迦利亚书 2:5', tint: [255, 196, 130],
      verse: [
        { text: '所以耶和华如此说：现今我回到耶路撒冷，仍施怜悯，<br>我的殿必重建在其中，准绳必拉在耶路撒冷之上。', ref: '撒迦利亚书 1:16', hold: 7.5 },
        { text: '耶路撒冷必有人居住，好像无城墙的乡村，因为人民和牲畜甚多。<br>耶和华说：我要作耶路撒冷四围的火城，并要作其中的荣耀。', ref: '撒迦利亚书 2:4–5', hold: 8.5 },
        { text: '使者……又对约书亚说：<br>「我使你脱离罪孽，要给你穿上华美的衣服。」', ref: '撒迦利亚书 3:4', hold: 6.5 },
      ],
      apply(c) {
        const gx = X('gate');
        T(c, [
          [0, b => {
            W.goTo(0.97, 12, b.instant);
            W.set('tbGlory', 0.45, b.instant);
            rm('haggai');
            cpose('exiles', 'sit'); cpose('zion', 'sit');
            add('zech', { label: '撒迦利亚', x: 0.545, facing: 1, robe: [98, 112, 138], hair: 'cloth', beard: true, glow: 0.5, v: 0.36, prop: null, pose: 'gaze' });
            add('youth', { label: '手拿准绳的人', x: gx - 0.045, facing: 1, robe: [206, 196, 170], glow: 0.55, v: 0.08, prop: null });
            sfx(b, 'stars', { soft: true });
          }],
          [2.6, b => { pose('youth', 'point'); W.set('tbLine', 1, b.instant); sfx(b, 'chime'); }],
          [9.6, b => { W.set('tbLine', 0, b.instant); pose('youth', 'stand'); }],
          [11.2, b => { W.set('tbFire', 1, b.instant); sfx(b, 'fire'); sfx(b, 'wind', { soft: true }); rm('youth'); }],
          [13.6, b => { W.set('tbGlory', 1, b.instant); cpose('exiles', 'gaze'); cpose('zion', 'gaze'); sfx(b, 'angel', { soft: true }); }],
          [18.2, b => {
            walk('joshua', 0.7, { speed: 0.03 });
            add('joshua', { robe: FILTH, accent: null });
            add('angel', { label: '耶和华的使者', x: 0.765, facing: -1, angel: true, glow: 0.9, v: 0.1, from: 'light' });
            sfx(b, 'angel', { soft: true });
          }],
          [20.6, () => { pose('joshua', 'bow'); face('joshua', 1); pose('angel', 'point'); }],
          [23, b => {
            add('joshua', { robe: LINEN, hair: 'cloth', accent: [246, 244, 236] });
            glow('joshua', 0.9); pose('joshua', 'raise');
            sparkleOn(b, 'joshua', 30, [255, 250, 230]);
            beamOn(b, 'joshua', { w: 70, dur: 4, a: 0.55 });
            sfx(b, 'harp');
          }],
          [26.4, () => { pose('joshua', 'stand'); pose('angel', 'stand'); }],
        ]);
      },
    },

    // ── 撒迦利亚书 4—5：纯金的灯台与两棵橄榄树；乃是倚靠我的灵；恩惠！恩惠！飞行的书卷 ─────
    {
      kind: 'promise', utter: '乃是倚靠我的灵方能成事', cmd: 'run 殿 --not 势力 --not 才能 --with 灵  # 恩惠！恩惠！', ref: '撒迦利亚书 4:6', tint: [255, 222, 140],
      verse: [
        { text: '我看见了一个纯金的灯台，顶上有灯盏，<br>灯台上有七盏灯，每盏有七个管子。<br>旁边有两棵橄榄树，一棵在灯盏的右边，一棵在灯盏的左边。', ref: '撒迦利亚书 4:2–3', hold: 8.5 },
        { text: '万军之耶和华说：不是倚靠势力，不是倚靠才能，<br>乃是倚靠我的灵方能成事。', ref: '撒迦利亚书 4:6', hold: 6.5 },
        { text: '他必搬出一块石头，安在殿顶上。<br>人且大声欢呼说：『愿恩惠恩惠归与这殿！』', ref: '撒迦利亚书 4:7', hold: 6.5 },
        { text: '我又举目观看，见有一飞行的书卷。', ref: '撒迦利亚书 5:1', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.1, 22, b.instant);
            W.set('tbFire', 0.25, b.instant);
            pose('zech', 'sit');
            walk('angel', 0.585, { speed: 0.04 });
          }],
          [1.6, b => { pose('zech', 'stand'); face('zech', 1); pose('angel', 'point'); sfx(b, 'chime'); }],
          [3, b => { W.set('tbLampstand', 1, b.instant); sfx(b, 'angel'); pose('zech', 'gaze'); }],
          [6, b => { W.set('tbOil', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [10.6, b => {
            const lp = X('lamp');
            stream(b, [lp[0] * W.w, lp[1] * W.h], () => figPt('zerub', 0.8), { dur: 3.2, arc: -0.02, n: 24 });
            walk('zerub', 0.68, { speed: 0.03 });
            sfx(b, 'wind', { soft: true });
          }],
          [13.2, b => { glow('zerub', 1); pose('zerub', 'raise'); sparkleOn(b, 'zerub', 24); sfx(b, 'harp'); }],
          [18.4, b => {
            flash(b, { type: 'stone', A: () => figPt('zerub', 1.1), B: () => { const g = tgeo(); return [g.x - g.hw * 0.08, g.y - g.pH - g.fh - 0.18 * g.ph]; }, dur: 2.2 });
            sfx(b, 'build', { soft: true });
          }],
          [20.6, b => {
            W.set('tbCap', 1, b.instant);
            cpose('exiles', 'raise'); cpose('zion', 'raise'); pose('joshua', 'raise'); pose('zerub', 'raise');
            const g = tgeo();
            glyphs(b, '恩惠恩惠', [255, 232, 170], { x: Math.min(g.x / W.w, tall() ? 0.68 : 0.84), y: (g.y - g.fh - 2.2 * g.ph) / W.h, hold: 2.6 });
            sfx(b, 'crowd'); sfx(b, 'chime');
          }],
          [24.2, b => { W.set('tbLampstand', 0, b.instant); W.set('tbOil', 0, b.instant); cpose('exiles', 'stand'); cpose('zion', 'stand'); pose('zerub', 'stand'); pose('joshua', 'stand'); }],
          [25.6, b => { W.set('tbScroll', 1, b.instant); pose('zech', 'point'); face('zech', 1); sfx(b, 'wings'); }],
          [29.4, () => { pose('zech', 'stand'); }],
        ]);
      },
    },

    // ── 撒迦利亚书 6—8：冠冕；按至理判断；年老的男女坐在街上、男孩女孩玩耍；十个人拉住一个犹大人的衣襟 ─────
    {
      kind: 'promise', utter: '将来必有年老的男女坐在耶路撒冷街上', cmd: 'spawn 年老的男女 --staff && spawn 男孩女孩 --play', ref: '撒迦利亚书 8:4', tint: [255, 238, 200],
      verse: [
        { text: '看哪，那名称为大卫苗裔的，他要在本处长起来，<br>并要建造耶和华的殿。', ref: '撒迦利亚书 6:12', hold: 6 },
        { text: '要按至理判断，各人以慈爱怜悯弟兄。<br>不可欺压寡妇、孤儿、寄居的，和贫穷人。', ref: '撒迦利亚书 7:9–10', hold: 6.5 },
        { text: '将来必有年老的男女坐在耶路撒冷街上，<br>因为年纪老迈就手拿拐杖。<br>城中街上必满有男孩女孩玩耍。', ref: '撒迦利亚书 8:4–5', hold: 7 },
        { text: '必有十个人从列国诸族中出来，拉住一个犹大人的衣襟，<br>说：『我们要与你们同去，因为我们听见神与你们同在了。』', ref: '撒迦利亚书 8:23', hold: 7.5 },
      ],
      apply(c) {
        const a = cx0(), bb = cx1();
        T(c, [
          [0, b => {
            W.goTo(0.37, 11, b.instant);
            W.set('tbFire', 0, b.instant); W.set('tbGlory', 0.12, b.instant); W.set('tbScroll', 1, b.instant);
            rm('zech'); rm('angel');
            crm('exiles'); crm('zion');
            walk('joshua', 0.72, { speed: 0.03 }); walk('zerub', 0.76, { speed: 0.03 });
          }],
          [2.4, b => {
            W.set('tbCrown', 1, b.instant); face('joshua', -1); pose('joshua', 'raise');
            beamOn(b, 'joshua', { w: 70, dur: 4, a: 0.5 }); sparkleOn(b, 'joshua', 20);
            sfx(b, 'chime'); sfx(b, 'harp', { soft: true });
          }],
          [5.6, () => { pose('joshua', 'stand'); }],
          [7.4, b => {
            add('widow', { label: '寡妇', sex: 'f', x: 0.52, facing: 1, robe: [74, 70, 80], hair: 'veil', glow: 0.25, v: 0.32, prop: null });
            add('orphan', { label: '孤儿', age: 'child', x: 0.5, facing: 1, robe: [140, 116, 90], glow: 0.25, v: 0.36, prop: null });
            add('stranger', { label: '寄居的', x: 0.48, facing: 1, robe: NATIONS[1], glow: 0.25, v: 0.3, prop: 'staff' });
            walk('widow', a + 0.03, { speed: 0.025 }); walk('orphan', a + 0.015, { speed: 0.025 }); walk('stranger', a - 0.005, { speed: 0.025 });
            walk('zerub', a + 0.06, { speed: 0.035 });
          }],
          [13, b => {
            face('zerub', -1); pose('zerub', 'bow');
            embrace('orphan', 'widow', { at: a + 0.025 });
            beamOn(b, 'widow', { w: 70, dur: 3.5, a: 0.4 });
            sfx(b, 'harp', { soft: true });
          }],
          [15.4, b => {
            crowd('elders', { n: nn(6), x0: a + 0.1, x1: bb - 0.02, layer: 2, label: '年老的男女', pose: 'sit' }, elders(0.04, 0.16));
            cface('elders', -1);
            sfx(b, 'crowd', { soft: true });
          }],
          [17.8, b => {
            crowd('kids', { n: nn(6), x0: a + 0.12, x1: bb - 0.04, layer: 2, label: '男孩女孩', pose: 'run', mill: true }, kids(0.3, 0.56));
            sfx(b, 'laugh');
          }],
          [19.6, () => { pose('zerub', 'stand'); }],
          [23.6, b => {
            add('jew', { label: '犹大人', x: 0.42, facing: 1, robe: JUDAH[2], glow: 0.35, v: 0.42, prop: 'staff' });
            walk('jew', a - 0.02, { speed: 0.022 });
            crowd('nations', { n: nn(8), x0: 0.36, x1: 0.41, layer: 2, label: '列国的人' }, dressed(NATIONS, 0.3, 0.56, 'm'));
            cwalk('nations', 0.43, a - 0.035, { speed: 0.022 });
            sfx(b, 'crowd', { soft: true });
          }],
          [29.2, () => { cface('nations', 1); face('jew', 1); }],
        ]);
      },
    },

    // ── 撒迦利亚书 9—11：你的王来到你这里，骑着驴驹；春雨；牧人拿着两根杖 ─────
    {
      kind: 'promise', utter: '看哪，你的王来到你这里', cmd: 'ride 驴驹 --into 锡安 --humble  # 公义，施行拯救', ref: '撒迦利亚书 9:9', tint: [255, 232, 186],
      verse: [
        { text: '锡安的民哪，应当大大喜乐；耶路撒冷的民哪，应当欢呼。<br>看哪，你的王来到你这里！他是公义的，并且施行拯救，<br>谦谦和和地骑着驴，就是骑着驴的驹子。', ref: '撒迦利亚书 9:9', hold: 9 },
        { text: '当春雨的时候，你们要向发闪电的耶和华求雨。<br>他必为众人降下甘霖，使田园生长菜蔬。', ref: '撒迦利亚书 10:1', hold: 7 },
        { text: '我拿着两根杖，一根我称为「荣美」，一根我称为「联索」。<br>这样，我牧养了群羊。', ref: '撒迦利亚书 11:7', hold: 6.5 },
      ],
      apply(c) {
        const gx = X('gate'), a = cx0();
        T(c, [
          [0, b => {
            W.goTo(0.47, 8, b.instant);
            W.set('tbCrown', 0.5, b.instant);
            rm('widow'); rm('orphan'); rm('stranger');
            walk('jew', gx + 0.01, { speed: 0.02 }); cwalk('nations', gx - 0.03, gx + 0.02, { speed: 0.02 });
            crelabel('elders', '锡安的民'); crelabel('kids', '锡安的民');
            animal('colt', { kind: 'donkey', x: 0.395, facing: 1, label: '驴驹', scale: 0.84, v: 0.2 });
            add('king', { label: '你的王', x: 0.395, facing: 1, robe: [228, 216, 188], accent: [214, 176, 96], glow: 0.75, v: 0.2, prop: null });
            ride('king', 'colt');
            walk('colt', gx - 0.035, { speed: 0.0165 });
            sfx(b, 'donkey', { soft: true });
          }],
          [2, b => { cpose('elders', 'stand'); cface('elders', -1); cface('kids', -1); sfx(b, 'crowd'); }],
          [3.6, () => { cpose('elders', 'raise'); }],
          [5.4, () => { crm('nations'); rm('jew'); }],
          [7.2, () => { cpose('kids', 'raise'); }],
          [10.8, b => {
            W.set('clouds', 0.78, b.instant); W.set('rain', 0.42, b.instant); W.set('storm', 0.3, b.instant);
            if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.22 });
            sfx(b, 'rain');
          }],
          [12.4, b => {
            W.set('grass', 1, b.instant); W.set('herbs', 0.8, b.instant); W.set('bloom', 0.7, b.instant); W.set('bare', 0, b.instant);
            W.set('tbField', 0.62, b.instant); W.set('tbOrchard', 0.7, b.instant);
            cpose('elders', 'gaze');
          }],
          [17, b => { W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.35, b.instant); }],
          [18.8, b => {
            add('shepherd', { label: '牧人', x: 0.4, facing: 1, robe: [128, 102, 74], hair: 'cloth', glow: 0.4, v: 0.62, prop: 'staff' });
            herd('flock', { kind: 'sheep', n: nn(7), x0: 0.41, x1: 0.53, layer: 2, label: '群羊', pose: 'graze', v: 0.72 });
            walk('shepherd', 0.43, { speed: 0.02 });
            sfx(b, 'bleat');
          }],
          [20.4, b => {
            // 两根杖的名（写在经文之外的天上）
            glyphs(b, '荣美', [255, 226, 160], { x: tall() ? 0.52 : 0.57, y: tall() ? 0.6 : 0.52, size: tall() ? 0.07 : 0.034, hold: 2.6 });
            glyphs(b, '联索', [220, 236, 255], { x: tall() ? 0.72 : 0.67, y: tall() ? 0.6 : 0.52, size: tall() ? 0.07 : 0.034, hold: 2.6, delay: 0.4 });
          }],
          [22.4, () => { walk('colt', gx + 0.005, { speed: 0.012 }); }],
          [25.4, () => { rm('king'); rm('colt'); cpose('elders', 'stand'); cpose('kids', 'stand'); }],
        ]);
      },
    },

    // ── 撒迦利亚书 12—14：施恩叫人恳求的灵；一个泉源；活水从耶路撒冷出来；耶和华必作全地的王 ─────
    {
      kind: 'promise', utter: '必有活水从耶路撒冷出来', cmd: 'pipe 活水 | tee 东海 西海  # 冬夏都是如此', ref: '撒迦利亚书 14:8', tint: [206, 234, 255],
      verse: [
        { text: '我必将那施恩叫人恳求的灵，浇灌大卫家和耶路撒冷的居民。<br>他们必仰望我，就是他们所扎的；必为我悲哀，如丧独生子。', ref: '撒迦利亚书 12:10', hold: 8 },
        { text: '那日，必给大卫家和耶路撒冷的居民开一个泉源，<br>洗除罪恶与污秽。', ref: '撒迦利亚书 13:1', hold: 6 },
        { text: '那日，必有活水从耶路撒冷出来，<br>一半往东海流，一半往西海流；冬夏都是如此。', ref: '撒迦利亚书 14:8', hold: 6.5 },
        { text: '耶和华必作全地的王。那日耶和华必为独一无二的，<br>他的名也是独一无二的。', ref: '撒迦利亚书 14:9', hold: 6 },
      ],
      apply(c) {
        const F = X('fount');
        T(c, [
          [0, b => {
            W.goTo(0.755, 24, b.instant);
            W.set('tbSpirit', 1, b.instant); W.set('tbCrown', 0, b.instant);
            rm('shepherd'); crm('flock');
            cwalk('elders', cx0(), F - 0.06, { speed: 0.025, pose: 'gaze' });
            cwalk('kids', cx0() + 0.02, F - 0.05, { speed: 0.03, pose: 'gaze' });
            for (const k of ['zerub', 'joshua']) pose(k, 'gaze');
            sfx(b, 'angel', { soft: true });
          }],
          [4.6, b => { cpose('elders', 'weep'); cpose('kids', 'kneel'); pose('zerub', 'weep'); pose('joshua', 'weep'); sfx(b, 'weep'); }],
          [9.8, b => {
            W.set('tbSpirit', 0.25, b.instant); W.set('tbFount', 1, b.instant);
            if (!b.instant) { const x = F * W.w, y = vY(F, 0.03); ringAt(b, x, y, [220, 240, 255], M() * 0.2, 2.2); }
            sfx(b, 'splash', { size: 2 });
          }],
          [12.6, () => { cpose('elders', 'stand'); cpose('kids', 'stand'); pose('zerub', 'stand'); pose('joshua', 'stand'); }],
          [16.8, b => { W.set('tbRiver', 1, b.instant); W.set('tbSpirit', 0, b.instant); sfx(b, 'splash'); sfx(b, 'harp', { soft: true }); }],
          [21.6, b => { W.set('tbSea', 0.85, b.instant); cpose('kids', 'raise'); sfx(b, 'splash', { far: true }); }],
          [24.6, b => {
            W.set('tbGlory', 0.55, b.instant);
            cpose('elders', 'bow'); pose('zerub', 'bow'); pose('joshua', 'bow');
            const g = tgeo();
            ringAt(b, g.x, g.y - g.fh * 0.6, [255, 240, 210], M() * 0.55, 3.2);
            sfx(b, 'angel');
          }],
          [28.6, () => { cpose('elders', 'stand'); cpose('kids', 'stand'); pose('zerub', 'stand'); pose('joshua', 'stand'); }],
        ]);
      },
    },

    // ── 玛拉基书 1—2：我曾爱你们；从日出之地到日落之处的香；真实的律法在他口中 ─────
    {
      kind: 'bless', utter: '我曾爱你们', cmd: 'echo "我曾爱你们"  # 你在何事上爱我们呢？', ref: '玛拉基书 1:2', tint: [255, 214, 190],
      verse: [
        { text: '耶和华说：「我曾爱你们。」<br>你们却说：「你在何事上爱我们呢？」', ref: '玛拉基书 1:2', hold: 6 },
        { text: '万军之耶和华说：从日出之地到日落之处，我的名在外邦中必尊为大。<br>在各处，人必奉我的名烧香，献洁净的供物。', ref: '玛拉基书 1:11', hold: 8 },
        { text: '真实的律法在他口中，他嘴里没有不义的话。<br>他以平安和正直与我同行，使多人回头离开罪孽。', ref: '玛拉基书 2:6', hold: 7 },
      ],
      apply(c) {
        const a = cx0();
        T(c, [
          [0, b => {
            W.goTo(0.9, 9, b.instant);
            W.set('tbSea', 0.3, b.instant); W.set('tbFount', 0.6, b.instant); W.set('tbGlory', 0.15, b.instant);
            rm('zerub');
            cwalk('elders', a + 0.02, a + 0.13, { speed: 0.03 }); cwalk('kids', a + 0.04, a + 0.16, { speed: 0.03 });
            walk('joshua', 0.84, { speed: 0.03 });
          }],
          [1.6, b => {
            S.love = 'elders';
            W.set('tbLove', 1, b.instant);
            cpose('elders', 'gaze'); cpose('kids', 'gaze');
            const p = crowdPt('elders');
            if (p) ringAt(b, p.x, p.top, [255, 214, 180], M() * 0.35, 2.8);
            sfx(b, 'harp');
          }],
          [4.2, () => { cpose('elders', 'stand'); cface('elders', 1); cface('kids', 1); }],
          [7.6, b => { W.set('tbIncense', 1, b.instant); W.set('tbLove', 0.45, b.instant); sfx(b, 'fire', { soft: true }); }],
          [11.4, b => { sfx(b, 'chime', { soft: true }); }],
          [16.6, b => {
            add('levi', { label: '祭司', x: 0.76, facing: -1, robe: LINEN, hair: 'cloth', accent: [120, 104, 170], glow: 0.55, v: 0.12, prop: null });
            W.set('tbTeach', 1, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [18.4, () => { pose('levi', 'raise'); cface('elders', 0.76); cface('kids', 0.76); pose('joshua', 'bow'); }],
          [20.6, () => { cpose('elders', 'kneel'); cpose('kids', 'sit'); pose('levi', 'point'); }],
          [23.4, b => { W.set('tbLove', 0, b.instant); pose('levi', 'stand'); }],
        ]);
      },
    },

    // ── 玛拉基书 3：十分之一送入仓库；天上的窗户敞开，倾福；纪念册；特特归我 ─────
    {
      kind: 'cmd', utter: '以此试试我，是否为你们敞开天上的窗户', cmd: 'test 我 && open 天上的窗户 | pour 福  # 甚至无处可容', ref: '玛拉基书 3:10', tint: [255, 234, 170],
      verse: [
        { text: '万军之耶和华说：你们要将当纳的十分之一全然送入仓库，使我家有粮，<br>以此试试我，是否为你们敞开天上的窗户，<br>倾福与你们，甚至无处可容。', ref: '玛拉基书 3:10', hold: 9 },
        { text: '那时，敬畏耶和华的彼此谈论，耶和华侧耳而听，<br>且有纪念册在他面前，记录那敬畏耶和华、思念他名的人。', ref: '玛拉基书 3:16', hold: 8 },
        { text: '万军之耶和华说：「在我所定的日子，他们必属我，特特归我。……」', ref: '玛拉基书 3:17', hold: 5.5 },
      ],
      apply(c) {
        const gx = X('gate'), a = cx0();
        T(c, [
          [0, b => {
            W.goTo(0.42, 9, b.instant);
            W.set('tbTeach', 0, b.instant); W.set('tbIncense', 0, b.instant); W.set('tbSea', 0.15, b.instant);
            rm('levi');
            cpose('elders', 'stand'); cpose('kids', 'stand');
            crowd('tithers', { n: nn(5), x0: 0.4, x1: 0.48, layer: 2, label: '送入仓库的人', pose: 'carry', prop: 'bundle' }, folk(0.16, 0.36));
            cprop('tithers', 'bundle');
            cwalk('tithers', gx - 0.045, gx + 0.01, { speed: 0.03, pose: 'bow' });
          }],
          [4.6, b => { W.set('clouds', 0.85, b.instant); W.set('storm', 0.28, b.instant); sfx(b, 'wind', { soft: true }); }],
          [6.4, b => { W.set('tbWindows', 1, b.instant); cpose('elders', 'gaze'); cpose('kids', 'gaze'); sfx(b, 'angel'); }],
          [8.6, b => {
            W.set('tbPour', 1, b.instant);
            W.set('tbField', 1, b.instant); W.set('tbOrchard', 1, b.instant); W.set('grass', 1, b.instant); W.set('bloom', 1, b.instant); W.set('herbs', 1, b.instant);
            W.set('tbFold', 1, b.instant); W.set('tbStall', 0.6, b.instant);
            cpose('tithers', 'raise'); cprop('tithers', null);
            sfx(b, 'harp'); sfx(b, 'chime');
          }],
          [11.4, b => { cpose('elders', 'raise'); cpose('kids', 'raise'); sfx(b, 'laugh', { soft: true }); }],
          [14, b => {
            W.set('tbPour', 0, b.instant); W.set('tbWindows', 0, b.instant); W.set('clouds', 0.35, b.instant); W.set('storm', 0, b.instant);
            W.goTo(0.8, 10, b.instant);
            crm('tithers');
            cpose('elders', 'stand'); cpose('kids', 'stand');
          }],
          [15.2, () => {
            add('f1a', { label: '敬畏耶和华的', x: a + 0.005, facing: 1, robe: JUDAH[4], glow: 0.4, v: 0.46, prop: null });
            add('f1b', { label: '敬畏耶和华的', sex: 'f', x: a + 0.03, facing: -1, robe: WOMEN[1], glow: 0.4, v: 0.46, prop: null });
            add('f2a', { label: '敬畏耶和华的', x: 0.84, facing: 1, robe: JUDAH[6], glow: 0.4, v: 0.44, prop: null, age: 'elder' });
            add('f2b', { label: '敬畏耶和华的', x: 0.865, facing: -1, robe: JUDAH[1], glow: 0.4, v: 0.44, prop: null });
            pose('f1a', 'sit'); pose('f1b', 'sit'); pose('f2a', 'sit'); pose('f2b', 'sit');
          }],
          [17, b => { W.set('tbBook', 1, b.instant); W.set('tbNames', 1, b.instant); sfx(b, 'chime'); }],
          [21.6, b => {
            for (const id of ['f1a', 'f1b', 'f2a', 'f2b']) { glow(id, 0.9); sparkleOn(b, id, 14, [255, 240, 200]); }
            cglow('elders', 0.5); cglow('kids', 0.5); sparkleOn(b, 'elders', 5);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 玛拉基书 4：公义的日头出现，其光线有医治之能；跳跃如圈里的肥犊；以利亚；父与子的心（旧约的末一句）─────
    {
      kind: 'promise', utter: '必有公义的日头出现，其光线有医治之能', cmd: 'sunrise --righteousness --heal  # 跳跃如圈里的肥犊', ref: '玛拉基书 4:2', tint: [255, 244, 200],
      verse: [
        { text: '但向你们敬畏我名的人必有公义的日头出现，其光线有医治之能。<br>你们必出来跳跃如圈里的肥犊。', ref: '玛拉基书 4:2', hold: 8 },
        { text: '看哪，耶和华大而可畏之日未到以前，<br>我必差遣先知以利亚到你们那里去。', ref: '玛拉基书 4:5', hold: 6.5 },
        { text: '他必使父亲的心转向儿女，儿女的心转向父亲，<br>免得我来咒诅遍地。', ref: '玛拉基书 4:6', hold: 8 },
      ],
      apply(c) {
        const a = cx0(), fb = X('fold1');
        T(c, [
          [0, b => {
            W.goTo(0.282, 11, b.instant);
            W.set('tbBook', 0, b.instant); W.set('tbFurnace', 1, b.instant); W.set('tbSea', 0, b.instant); W.set('tbFount', 0.4, b.instant);
            for (const id of ['f1a', 'f1b', 'f2a', 'f2b']) rm(id);
            cpose('elders', 'sit'); cpose('kids', 'sit');
            sfx(b, 'fire', { far: true, soft: true });
          }],
          [5.6, b => { W.set('tbFurnace', 0, b.instant); cpose('elders', 'stand'); cface('elders', -1); cface('kids', -1); }],
          [8, b => {
            W.set('tbSun', 1, b.instant); W.set('tbHeal', 1, b.instant); W.set('tbGlory', 0.25, b.instant);
            W.set('bare', 0, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant); W.set('bloom', 1, b.instant); W.set('trees', 0.5, b.instant);
            W.set('tbOrchard', 1, b.instant); W.set('tbField', 1, b.instant); W.set('tbStall', 0, b.instant);
            cpose('elders', 'gaze'); cpose('kids', 'gaze'); pose('joshua', 'gaze');
            sfx(b, 'angel'); sfx(b, 'harp');
          }],
          [9.6, b => {
            for (let i = 0; i < 3; i++) animal('calf' + i, { kind: 'calf', x: fb - 0.012 - i * 0.008, facing: -1, label: '肥犊', v: 0.04 + 0.03 * i, col: [[188, 150, 108], [206, 176, 136], [168, 122, 84]][i] });
            sfx(b, 'cow', { soft: true });
          }],
          [11, () => {
            CALF().forEach((q, i) => { const f = fig('calf' + i); if (f) f.v = q[1]; walk('calf' + i, q[0], { run: true, speed: 0.05 }); });
          }],
          // 日头慢慢升高（旧约写完之后，时辰仍自己流转）
          [11.2, b => { W.goTo(0.345, 45, b.instant); }],
          [12.6, b => {
            add('elijah', { label: '以利亚', x: 0.385, facing: 1, robe: HAIRY, hair: 'long', beard: true, glow: 0.8, v: 0.3, prop: 'staff' });
            walk('elijah', X('tower') + 0.02, { speed: 0.018 });
            sfx(b, 'wind', { soft: true });
          }],
          [14.4, b => {
            S.leap = true;
            CALF().forEach((q, i) => {
              const id = 'calf' + i, base = q[0], v = q[1], ph0 = i * 1.9;
              attach(id, () => { const x = base * W.w, y = vY(base, v), hop = Math.pow(Math.max(0, Math.sin(W.t * 4.2 + ph0)), 0.9) * PH(2) * 0.45; return [x, y - hop]; });
            });
            sfx(b, 'cow');
          }],
          [18.4, b => {
            add('fa1', { label: '父亲', x: a + 0.005, facing: 1, robe: JUDAH[5], glow: 0.5, v: 0.4, prop: null });
            add('ch1', { label: '儿女', age: 'child', sex: 'f', x: a + 0.08, facing: -1, robe: WOMEN[3], glow: 0.5, v: 0.44, prop: null });
            add('fa2', { label: '父亲', x: 0.9, facing: -1, robe: JUDAH[7], glow: 0.5, v: 0.4, prop: null });
            add('ch2', { label: '儿女', age: 'child', x: 0.83, facing: 1, robe: JUDAH[3], glow: 0.5, v: 0.42, prop: null });
            sfx(b, 'harp', { soft: true });
          }],
          [19.6, b => { embrace('fa1', 'ch1', { at: a + 0.045, run: true }); embrace('fa2', 'ch2', { at: 0.865, run: true }); sfx(b, 'laugh', { soft: true }); }],
          [22.6, b => { cpose('elders', 'raise'); cpose('kids', 'raise'); pose('elijah', 'raise'); glow('elijah', 1); sparkleOn(b, 'elijah', 20); }],
          [25.4, () => { cpose('elders', 'gaze'); cpose('kids', 'stand'); pose('joshua', 'raise'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷（旧约的末一幕；其后引擎写「旧约 · 三十九卷 · 终」）
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '小先知书', books: [34, 35, 36, 37, 38, 39], title: '公义的日头', sub: '那鸿书 — 玛拉基书', tint: [255, 236, 180], music: 'eden',
    outro: 32,
    intro: [
      { text: '论尼尼微的默示，就是伊勒歌斯人那鸿所得的默示。', ref: '那鸿书 1:1', hold: 5 },
      { text: '耶和华不轻易发怒，大有能力，万不以有罪的为无罪。<br>他乘旋风和暴风而来，云彩为他脚下的尘土。', ref: '那鸿书 1:3', hold: 7.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '尼尼微': { text: '尼尼微自古以来充满人民，如同聚水的池子；现在居民却都逃跑。', ref: '那鸿书 2:8' },
      '犹大人': { text: '耶和华本为善，在患难的日子为人的保障，并且认得那些投靠他的人。', ref: '那鸿书 1:7' },
      '报好信的人': { text: '看哪，有报好信传平安之人的脚登山，说：犹大啊，可以守你的节期，还你所许的愿吧！', ref: '那鸿书 1:15' },
      '哈巴谷': { text: '先知哈巴谷的祷告，调用流离歌。', ref: '哈巴谷书 3:1' },
      '望楼': { text: '我要站在守望所，立在望楼上观看，看耶和华对我说什么话，我可用什么话向他诉冤。', ref: '哈巴谷书 2:1' },
      '版': { text: '他对我说：将这默示明明地写在版上，使读的人容易读。', ref: '哈巴谷书 2:2' },
      '无花果树': { text: '虽然无花果树不发旺，葡萄树不结果，橄榄树也不效力……', ref: '哈巴谷书 3:17' },
      '葡萄树': { text: '你们田间的葡萄树在未熟之先也不掉果子。', ref: '玛拉基书 3:11' },
      '橄榄树': { text: '旁边有两棵橄榄树，一棵在灯盏的右边，一棵在灯盏的左边。', ref: '撒迦利亚书 4:3' },
      '田地': { text: '田地不出粮食，圈中绝了羊，棚内也没有牛；然而，我要因耶和华欢欣，因救我的神喜乐。', ref: '哈巴谷书 3:17–18' },
      '羊圈': { text: '你们必出来跳跃如圈里的肥犊。', ref: '玛拉基书 4:2' },
      '母鹿': { text: '主耶和华是我的力量；他使我的脚快如母鹿的蹄，又使我稳行在高处。', ref: '哈巴谷书 3:19' },
      '谦卑人': { text: '我却要在你中间留下困苦贫寒的民；他们必投靠我耶和华的名。', ref: '西番雅书 3:12' },
      '群畜': { text: '群畜，就是各国的走兽必卧在其中；鹈鹕和箭猪要宿在柱顶上。', ref: '西番雅书 2:14' },
      '锡安的民': { text: '锡安的民哪，应当歌唱！以色列啊，应当欢呼！耶路撒冷的民哪，应当满心欢喜快乐！', ref: '西番雅书 3:14' },
      '被掳之人': { text: '那时，我必领你们进来，聚集你们；我使你们被掳之人归回的时候，就必使你们在地上的万民中有名声，得称赞。', ref: '西番雅书 3:20' },
      '剩下的百姓': { text: '耶和华的使者哈该奉耶和华差遣对百姓说：「耶和华说：我与你们同在。」', ref: '哈该书 1:13' },
      '哈该': { text: '你们要上山取木料，建造这殿，我就因此喜乐，且得荣耀。这是耶和华说的。', ref: '哈该书 1:8' },
      '所罗巴伯': { text: '我仆人撒拉铁的儿子所罗巴伯啊，到那日，我必以你为印，因我拣选了你。', ref: '哈该书 2:23' },
      '大祭司约书亚': { text: '取这金银做冠冕，戴在约撒答的儿子大祭司约书亚的头上，', ref: '撒迦利亚书 6:11' },
      '撒迦利亚': { text: '那与我说话的天使又来叫醒我，好像人睡觉被唤醒一样。', ref: '撒迦利亚书 4:1' },
      '手拿准绳的人': { text: '我说：「你往哪里去？」他对我说：「要去量耶路撒冷，看有多宽多长。」', ref: '撒迦利亚书 2:2' },
      '耶和华的使者': { text: '我说：「要将洁净的冠冕戴在他头上。」他们就把洁净的冠冕戴在他头上，给他穿上华美的衣服，耶和华的使者在旁边站立。', ref: '撒迦利亚书 3:5' },
      '火城': { text: '耶和华说：我要作耶路撒冷四围的火城，并要作其中的荣耀。', ref: '撒迦利亚书 2:5' },
      '灯台': { text: '这灯台左右的两棵橄榄树是什么意思？', ref: '撒迦利亚书 4:11' },
      '寡妇': { text: '不可欺压寡妇、孤儿、寄居的，和贫穷人。谁都不可心里谋害弟兄。', ref: '撒迦利亚书 7:10' },
      '孤儿': { text: '不可欺压寡妇、孤儿、寄居的，和贫穷人。', ref: '撒迦利亚书 7:10' },
      '寄居的': { text: '不可欺压寡妇、孤儿、寄居的，和贫穷人。', ref: '撒迦利亚书 7:10' },
      '年老的男女': { text: '将来必有年老的男女坐在耶路撒冷街上，因为年纪老迈就手拿拐杖。', ref: '撒迦利亚书 8:4' },
      '男孩女孩': { text: '城中街上必满有男孩女孩玩耍。', ref: '撒迦利亚书 8:5' },
      '列国的人': { text: '必有列邦的人和强国的民来到耶路撒冷寻求万军之耶和华，恳求耶和华的恩。', ref: '撒迦利亚书 8:22' },
      '你的王': { text: '看哪，你的王来到你这里！他是公义的，并且施行拯救，谦谦和和地骑着驴，就是骑着驴的驹子。', ref: '撒迦利亚书 9:9' },
      '驴驹': { text: '谦谦和和地骑着驴，就是骑着驴的驹子。', ref: '撒迦利亚书 9:9' },
      '牧人': { text: '我拿着两根杖，一根我称为「荣美」，一根我称为「联索」。这样，我牧养了群羊。', ref: '撒迦利亚书 11:7' },
      '群羊': { text: '当那日，耶和华他们的神必看他的民如群羊，拯救他们；因为他们必像冠冕上的宝石，高举在他的地以上。', ref: '撒迦利亚书 9:16' },
      '泉源': { text: '那日，必给大卫家和耶路撒冷的居民开一个泉源，洗除罪恶与污秽。', ref: '撒迦利亚书 13:1' },
      '活水': { text: '那日，必有活水从耶路撒冷出来，一半往东海流，一半往西海流；冬夏都是如此。', ref: '撒迦利亚书 14:8' },
      '祭司': { text: '祭司的嘴里当存知识，人也当由他口中寻求律法，因为他是万军之耶和华的使者。', ref: '玛拉基书 2:7' },
      '送入仓库的人': { text: '你们要将当纳的十分之一全然送入仓库，使我家有粮，以此试试我……', ref: '玛拉基书 3:10' },
      '敬畏耶和华的': { text: '那时，敬畏耶和华的彼此谈论，耶和华侧耳而听，且有纪念册在他面前，记录那敬畏耶和华、思念他名的人。', ref: '玛拉基书 3:16' },
      '纪念册': { text: '耶和华侧耳而听，且有纪念册在他面前，记录那敬畏耶和华、思念他名的人。', ref: '玛拉基书 3:16' },
      '肥犊': { text: '但向你们敬畏我名的人必有公义的日头出现，其光线有医治之能。你们必出来跳跃如圈里的肥犊。', ref: '玛拉基书 4:2' },
      '以利亚': { text: '看哪，耶和华大而可畏之日未到以前，我必差遣先知以利亚到你们那里去。', ref: '玛拉基书 4:5' },
      '父亲': { text: '他必使父亲的心转向儿女，儿女的心转向父亲，免得我来咒诅遍地。', ref: '玛拉基书 4:6' },
      '儿女': { text: '他必使父亲的心转向儿女，儿女的心转向父亲，免得我来咒诅遍地。', ref: '玛拉基书 4:6' },
      '锡安': { text: '耶和华如此说：我现在回到锡安，要住在耶路撒冷中。耶路撒冷必称为诚实的城，万军之耶和华的山必称为圣山。', ref: '撒迦利亚书 8:3' },
      '城门': { text: '你们所当行的是这样：各人与邻舍说话诚实，在城门口按至理判断，使人和睦。', ref: '撒迦利亚书 8:16' },
      '耶和华的殿': { text: '惟耶和华在他的圣殿中；全地的人都当在他面前肃敬静默。', ref: '哈巴谷书 2:20' },
      '荒凉的殿': { text: '这殿仍然荒凉，你们自己还住天花板的房屋吗？', ref: '哈该书 1:4' },
      '这殿': { text: '这殿后来的荣耀必大过先前的荣耀；在这地方我必赐平安。这是万军之耶和华说的。', ref: '哈该书 2:9' },
      '公义的日头': { text: '但向你们敬畏我名的人必有公义的日头出现，其光线有医治之能。', ref: '玛拉基书 4:2' },
    },
  });
})(window.GS);
