/* ─────────────────────────────────────────────────────────────
 * book/journeys.js —— 使徒行传 · 直到地极（使徒行传 13 — 28）
 *
 * 同一片地、同一片海：左边的海如今是大海（地中海），一只有方帆的大船在海上往来；
 * 近地是保罗一处一处走过的城——每到一处，地上的布景就换作那城的样子（屋、殿、城门、河、监、帐棚、营楼、公厅……），
 * 远山上则留下一盏一盏的灯：一处一处的教会，自左（东，安提阿）一直点到右边的尽头（西，罗马）——「直到地极」。
 *
 * 十五句话：
 *   1 要为我分派巴拿巴和扫罗（13:2）—— 黄昏，安提阿的教会禁食祷告；圣灵的光自天落在二人身上，众人按手；
 *     二人下到海边上船，船往塞浦路斯去，又靠了岸；扫罗的名散开，聚成「保罗」。
 *   2 我已经立你作外邦人的光（13:47）—— 彼西底的安提阿，合城的人聚集；一道光自保罗向右铺开，远近的村落一处处亮起，直到地的尽头。
 *   3 神怎样为外邦人开了信道的门（14:27）—— 路司得城门口生来瘸腿的人跳起来行走；回到安提阿，会众中间开了一扇光的门，
 *     外邦人从门里进来；耶路撒冷来的书信在众人面前展开，众人欢喜。
 *   4 神召我们传福音给那里的人听（16:10）—— 保罗与西拉出去；特罗亚的夜，保罗睡在灯旁，海那边站着一个马其顿人，招手求他；
 *     黎明，众人上船，往马其顿去。
 *   5 主就开导她的心（16:14）—— 腓立比城外的河边，妇女们坐着听道；卖紫色布疋的吕底亚胸中亮起一盏光；她和她一家在河里受洗，请他们到家里去。
 *   6 监门立刻全开，众囚犯的锁链也都松开了（16:26）—— 半夜的内监，两脚上了木狗；保罗和西拉唱诗，歌声化作光穿过屋顶；
 *     地大震动，门开了，锁链落下；禁卒拿灯进来俯伏，他和全家都信了。
 *   7 我们生活、动作、存留，都在乎他（17:28）—— 正午的雅典，满城的偶像；保罗站在亚略‧巴古，坛上写着「未识之神」；
 *     字化作光散开，一口金色的气息吹过全地，花开、鸟起；有几个人贴近他。
 * ★ 8 不要怕，只管讲，不要闭口（18:9）—— 哥林多，与亚居拉、百基拉同做帐棚；夜里，主在异象中站在他旁边（一道站立的光）；
 *     「我有许多的百姓」——全城的窗一扇一扇亮起灯来；一年零六个月，天天有人来听。
 *   9 施比受更为有福（20:35）—— 亚细亚全地都听见了主的道（远山的灯）；米利都的海边，以弗所的长老来了；
 *     众人跪下同祷告，抱着他哭，送他上船，船远去，他们举手。
 *  10 放心吧！（23:11）—— 耶路撒冷，殿里的人一齐拥上，千夫长用两条铁链锁他；他站在营楼的台阶上向百姓摆手；
 *     当夜，主站在他旁边：一道光向西（右边的罗马）伸去。
 *  11 从黑暗中归向光明（26:18）—— 凯撒利亚的公厅，腓力斯、非斯都、亚基帕与百妮基；「上告于凯撒」；保罗伸手讲那比日头还亮的光，
 *     昏暗的公厅满了光。
 *  12 保罗，不要害怕，你必定站在凯撒面前（27:24）—— 上船往意大利去；友拉革罗的狂风，落篷，抛货，日头星辰多日不显；
 *     夜里，神的使者站在保罗旁边，船的四围一圈光。
 *  13 这样，众人都得了救，上了岸（27:44）—— 天将亮，保罗擘饼祝谢；天亮了，一个有岸的海湾；船搁了浅，船尾冲坏；众人都上了岸。
 *  14 手能拿蛇；若喝了什么毒物，也必不受害（马可福音 16:18）—— 马耳他，下雨，土人生火；毒蛇咬住保罗的手，他甩在火里，并没有受伤；
 *     部百流的父亲得了医治，雨住了。
 *  15 神这救恩，如今传给外邦人（28:28）—— 另一只船靠岸，弟兄们出来迎接；罗马在海那边；他所租的房子，看守他的兵；
 *     光自他门口流出，众教会的灯一齐明亮，直到地极；门开着，并没有人禁止。
 *
 * 父不显形——只有光与声音；主（复活升天之后）在异象里只是一道站立的光；圣灵是自天降下的光与风；使者是发光的人形。
 * 棍打、石头打、鞭打只在不讲之中；锁链只是手腕间一道灰色的链子；船难里没有人丧命。
 * 规矩：一切状态只在 setup / apply / 情节（beats）里设定，瞬间重演时得到同样的世界；装饰（粒子、光环、字名）只在非瞬间时出现。
 * 位置都以画面的比例记下；竖屏另一套布局。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'journeys';
  const safe = U.safe;
  const cur = () => GS.book.current(ACT);

  // ── 本幕的程度 ──────────────────────────────────────────────
  const LV = {
    jyPlace: ['lin', 0.6],    // 此处的布景淡入（0 → 1；前一处同时淡出）
    jyShipA: ['exp', 0.9],    // 船
    jyShip: ['lin', 0.25],    // 船的一程（0 → 1）
    jySail: ['exp', 0.7],     // 大帆张开
    jyStorm: ['exp', 0.7],    // 船的颠簸与本幕的浪
    jyWreck: ['lin', 0.8],    // 船搁浅、船尾冲坏
    jyLantern: ['exp', 0.8],  // 船尾的灯
    jySpirit: ['exp', 0.8],   // 圣灵说话：自天而降的光
    jyGentile: ['lin', 0.11], // 外邦人的光：一道光自保罗铺向地极
    jyDoor: ['exp', 0.6],     // 信道的门
    jyScroll: ['exp', 1],     // 耶路撒冷来的书信
    jyVision: ['exp', 1.1],   // 马其顿人的异象
    jyHeart: ['exp', 0.6],    // 吕底亚的心被开导
    jyBapt: ['exp', 0.8],     // 河里受洗的光
    jySing: ['exp', 0.8],     // 半夜唱诗
    jyQuake: ['lin', 0.9],    // 监门打开（0 关 → 1 开）
    jyStocks: ['exp', 1.2],   // 木狗（1 上着 → 0 松开）
    jyLamp: ['exp', 0.8],     // 一盏小灯（特罗亚的夜、哥林多的帐棚、禁卒的灯）
    jyKnown: ['exp', 0.35],   // 未识之神被传明：一口金色的气息遍地
    jyAltar: ['exp', 0.6],    // 坛上的字
    jyLord: ['exp', 0.55],    // 主站在保罗旁边：一道站立的光
    jyCityL: ['lin', 0.16],   // 城里许多的百姓：窗里的灯一盏一盏亮起
    jyWest: ['lin', 0.16],    // 往罗马去：一道光向西（右）伸去
    jyNoon: ['exp', 0.9],     // 比日头还亮的光
    jyDark: ['exp', 0.5],     // 公厅里的昏暗（从黑暗中归向光明）
    jyHallLit: ['exp', 0.7],  // 公厅满了光（暖光灌满柱间与幔子）
    jyAngel: ['exp', 0.7],    // 使者站在旁边：船四围的光
    jyBread: ['exp', 0.9],    // 擘饼的光
    jyFire: ['exp', 0.8],     // 马耳他的火
    jyViper: ['exp', 3],      // 毒蛇悬在手上
    jyThrow: ['lin', 1.2],    // 毒蛇甩在火里（0 → 1）
    jyHeal: ['exp', 0.7],     // 部百流的父亲得医治
    jyAll: ['exp', 0.4],      // 众教会的灯一齐明亮；光到地极
    jyOpen: ['exp', 0.6],     // 罗马：门开着，并没有人禁止
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const MY = Object.keys(LV);
  const L = k => W.lv[k] || 0;

  // ── 布局（画面宽/高的比例；竖屏另一套）─────────────────────────
  const LAYL = {
    // 船：[x, 水线 y]；k = 船的大小
    moor: [0.565, 0.838], off: [-0.36, 0.838], sea: [0.535, 0.796], reef: [0.585, 0.846], shipK: 1,
    quay: [0.665, 0.73], names: [0.74, 0.2],
    // 一 安提阿 / 塞浦路斯
    church: [0.68, 0.745], church2: [0.845, 0.93], barn0: 0.775, saul0: 0.808, laying: [0.725, 0.758, 0.84], ashore: [0.705, 0.738],
    // 二 彼西底的安提阿
    syn: 0.66, paul2: 0.64, barn2: 0.605, city2L: [0.5, 0.58], city2R: [0.71, 0.93],
    // 三 路司得 → 安提阿
    lame: 0.755, paul3: 0.69, barn3: 0.655, lys: [0.8, 0.95], lys2: [0.5, 0.6],
    church3: [0.585, 0.645], door: 0.87, paul3b: 0.68, barn3b: 0.655, gentiles: [0.755, 0.815], silas3: 0.728,
    // 四 特罗亚
    part: 0.8, troas: 0.84, sleep: 0.74, mac: 0.8, silas4: 0.79, tim4: 0.82,
    // 五 腓立比的河边
    women: [0.6, 0.635, 0.67], lydia: 0.705, paul5: 0.765, silas5: 0.795, tim5: 0.82, lhouse: 0.905, bapt: 0.69,
    // 六 监
    pris: [0.575, 0.87], paul6: 0.635, silas6: 0.668, prisoners: [0.597, 0.613], jailer: 0.905, jhouse: 0.965,
    meet6: [0.738, 0.762, 0.787], jfam: [0.806, 0.83], jfam0: [0.875, 0.91],
    // 七 雅典
    stoa: [0.5, 0.6], idols: [0.535, 0.585, 0.695], altar: 0.645, rock: 0.79, athens: [0.54, 0.68], near7: [0.72, 0.745, 0.84, 0.86],
    // 八 哥林多
    tents: [0.62, 0.69], paul8: 0.655, aquila: 0.625, prisca: 0.69, corHouses: [0.79, 0.87, 0.95], cor: [0.56, 0.62, 0.72, 0.8],
    // 九 米利都
    paul9: 0.745, tim9: 0.72, elders: [0.77, 0.8, 0.83, 0.86, 0.89, 0.92],
    // 十 耶路撒冷
    paul10: 0.62, jer: [0.5, 0.72], fort: [0.8, 0.965], stair: [0.74, 0.8], soldiers: [0.66, 0.59, 0.7],
    // 十一 凯撒利亚
    hall: [0.72, 0.97], paul11: 0.742, guard11: [0.712, 0.772],
    // 十二、十三 海上 / 搁浅
    beach: [0.66, 0.82], saved: [0.745, 0.875], shore13: { sailor1: 0.705, sailor2: 0.722, julius: 0.688, s1: 0.672, aristarchus: 0.64, pr3: 0.656, paul: 0.624 },
    // 十四 马耳他
    fire: 0.72, isl: [0.78, 0.87], saved14: [0.58, 0.66], pub: 0.93,
    heal14: { isl: [0.648, 0.732], julius: 0.604, paul: 0.776, father: 0.808, publius: 0.852 },
    // 十五 罗马
    rhouse: 0.83, paul15: 0.775, guard15: 0.805, bro: [0.73, 0.76, 0.79], rome15: [0.63, 0.73], rome15b: [0.87, 0.97],
  };
  const LAYP = Object.assign({}, LAYL, {
    moor: [0.215, 0.905], off: [-0.62, 0.905], sea: [0.23, 0.875], reef: [0.27, 0.925], shipK: 0.78,
    quay: [0.38, 0.47], names: [0.6, 0.47],
    church: [0.47, 0.56], church2: [0.8, 0.98], barn0: 0.63, saul0: 0.71, laying: [0.55, 0.6, 0.77], ashore: [0.5, 0.58],
    syn: 0.66, paul2: 0.62, barn2: 0.54, city2L: [0.45, 0.52], city2R: [0.72, 0.97],
    lame: 0.72, paul3: 0.6, barn3: 0.52, lys: [0.82, 0.97], lys2: [0.44, 0.5],
    church3: [0.43, 0.5], door: 0.8, paul3b: 0.565, barn3b: 0.52, gentiles: [0.67, 0.75], silas3: 0.625,
    part: 0.62, troas: 0.7, sleep: 0.62, mac: 0.72, silas4: 0.72, tim4: 0.8,
    women: [0.46, 0.52, 0.58], lydia: 0.64, paul5: 0.73, silas5: 0.79, tim5: 0.85, lhouse: 0.93, bapt: 0.6,
    pris: [0.43, 0.9], paul6: 0.515, silas6: 0.58, prisoners: [0.455, 0.479], jailer: 0.955, jhouse: null,
    meet6: [0.7, 0.735, 0.77], jfam: [0.805, 0.84], jfam0: [0.9, 0.95],
    stoa: [0.44, 0.52], idols: [0.47, 0.54, 0.64], altar: 0.59, rock: 0.8, athens: [0.46, 0.66], near7: [0.66, 0.7, 0.9, 0.95],
    tents: [0.52, 0.62], paul8: 0.57, aquila: 0.52, prisca: 0.62, corHouses: [0.76, 0.9], cor: [0.45, 0.5, 0.68, 0.74],
    paul9: 0.52, tim9: 0.47, elders: [0.58, 0.64, 0.7, 0.76, 0.82, 0.88],
    paul10: 0.52, jer: [0.44, 0.66], fort: [0.74, 1.0], stair: [0.66, 0.74], soldiers: [0.6, 0.47, 0.63],
    hall: [0.6, 1.0], paul11: 0.66, guard11: [0.62, 0.7],
    beach: [0.42, 0.62], saved: [0.635, 0.83], shore13: { sailor1: 0.575, sailor2: 0.6, julius: 0.55, s1: 0.525, aristarchus: 0.475, pr3: 0.5, paul: 0.45 },
    fire: 0.62, isl: [0.7, 0.8], saved14: [0.44, 0.52], pub: 0.93,
    heal14: { isl: [0.53, 0.6], julius: 0.465, paul: 0.68, father: 0.735, publius: 0.805 },
    rhouse: 0.8, paul15: 0.68, guard15: 0.735, bro: [0.54, 0.6, 0.66], rome15: [0.46, 0.6], rome15b: [0.88, 0.98],
  });
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const X = k => (tall() ? LAYP : LAYL)[k];

  // ── 颜色 ────────────────────────────────────────────────────
  const TINT = [200, 226, 250];
  const LIME = [226, 218, 198], LIME_D = [188, 178, 158], MARBLE = [236, 232, 220], MARBLE_D = [196, 190, 176];
  const OCHRE = [206, 176, 132], STONE = [168, 156, 138], STONE_D = [118, 108, 96], DARKST = [70, 64, 60];
  const TILE = [168, 84, 60], CEDAR = [96, 70, 48], DOOR = [38, 30, 24], GOLD = [255, 214, 140], WARM = [255, 222, 170];
  const WOOD = [112, 82, 56], WOOD_D = [80, 58, 40], WOOD_L = [164, 128, 88], SAIL = [234, 222, 198], STRIPE = [156, 66, 46];
  const TENT = [78, 62, 52], TENT_L = [128, 104, 82], PURPLE = [118, 52, 112], PURPLE_L = [156, 82, 150], SAND = [214, 196, 158];
  const ROBE = {
    barnabas: [138, 116, 92], silas: [96, 104, 118], timothy: [112, 118, 96], lydia: [118, 52, 112], jailer: [104, 90, 72],
    roman: [150, 50, 44], tribune: [168, 60, 50], felix: [196, 188, 170], festus: [206, 198, 180], agrippa: [132, 44, 70], bernice: [170, 120, 150],
    mac: [168, 150, 118], lame: [128, 112, 94], sailor: [124, 110, 92], prisoner: [104, 98, 92], islander: [150, 120, 86], elder: [150, 140, 122],
    father: [176, 170, 160], dionysius: [214, 206, 188], damaris: [150, 118, 132], aquila: [120, 96, 74], prisca: [150, 110, 96],
  };
  const ROMAN_ACC = [196, 160, 96];

  // ── 小工具 ──────────────────────────────────────────────────
  const inst = b => !!(b && b.instant) || !!W.replaying;
  const c01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const ss = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const ease = t => { t = c01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const lit = c => mix(c, [255, 250, 236], 0.35);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const H2 = () => 34 * W.layerScale(2) * 1.3 * boost();     // 近地的人高
  const H1 = () => 34 * W.layerScale(1) * 1.2 * boost();     // 中丘的人高
  const BU = () => H2() * (tall() ? 0.78 : 1);                // 近地建筑的尺度
  const BM = () => 34 * W.layerScale(1) * 1.2 * (tall() ? 1.3 : 1);   // 中丘建筑的尺度
  const M = () => Math.min(W.w, W.h);
  const sh = (rgb, depth, a, ex) => W.shadeCSS(rgb, depth || 0, a == null ? 1 : a, ex || 0);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const rimA = () => clamp(0.25 + 0.5 * W.daylight - 0.2 * (W.lv.storm || 0), 0.1, 0.8);
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
    if (a && a.sfx) safe('journeys.sfx', () => a.sfx(name, o || {}));
  }
  function time(tod, dur, b) { W.goTo(tod, dur, inst(b)); }
  function avoid(r) { W.beastAvoid = r || []; }
  const C = () => cast();
  const LOOK = () => (C() && C().LOOK) || {};
  const DR = i => { const R = (C() && C().DISCIPLE_ROBES) || []; return R[i] || [122, 104, 84]; };
  function add(id, o) { const c = C(); if (c) c.add(id, Object.assign({ layer: 2, from: 'fade', glow: 0.16 }, o)); }
  function addLook(id, look, o) { const c = C(); if (!c) return; const base = LOOK()[look] || {}; c.add(id, Object.assign({ layer: 2, from: 'fade' }, base, o)); }
  function walk(id, x, o) { const c = C(); if (c && c.get(id)) c.walk(id, x, o || {}); }
  function pose(id, p, o) { const c = C(); if (c && c.get(id)) c.pose(id, p, o); }
  function face(id, d) { const c = C(); if (c && c.get(id)) c.face(id, d); }
  function glowP(id, v) { const c = C(); if (c) c.glow(id, v); }
  function rm(id, fade) { const c = C(); if (c && c.get(id)) c.remove(id, { fade: fade !== false }); }
  function person(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function has(id) { const c = C(); return !!(c && c.has && c.has(id)); }
  function propP(id, k) { const c = C(); if (c && c.get(id) && c.prop) c.prop(id, k); }
  function setV(id, v) { const p = person(id); if (p) p.v = v; }
  function crowdOf(gid) { const c = C(); return c && c.crowds ? c.crowds.get(gid) : null; }
  function crowdFaceX(gid, xf) { const g = crowdOf(gid); if (g) g.members.forEach(m => { if (m.tx == null) { m.facing = xf >= m.nx ? 1 : -1; if (W.replaying) m.fd = m.facing; } }); }
  function crowdPose(gid, p) { const c = C(); if (c && crowdOf(gid)) c.crowdPose(gid, p); }
  function crowdWalk(gid, x0, x1, o) { const c = C(); if (c && crowdOf(gid)) c.crowdWalk(gid, x0, x1, o || {}); }
  function crowdRm(gid, fade) { const c = C(); if (c) c.removeCrowd(gid, { fade: fade !== false }); }
  function crowdGlow(gid, v) { const g = crowdOf(gid); if (g) g.members.forEach(m => { m.glow = v; }); }
  // 竖屏的地窄：人群少一些
  function crowd(gid, o) {
    const c = C(); if (!c) return;
    const n = Math.max(2, Math.round((o.n || 8) * (tall() ? 0.6 : 1)));
    c.crowd(gid, Object.assign({ layer: 2, from: 'fade' }, o, { n }));
  }
  // 人此刻在画面上的位置（脚下）与身高
  function fpos(id) {
    const p = person(id);
    if (!p) return null;
    // 中丘上的人：cast 只在自己那一层的 pass 里定位，之后 _vis 被复位——仍用它最后的位置
    if ((p._vis || (p.layer !== 2 && p._h > 0)) && isFinite(p._x) && isFinite(p._y)) return { x: p._x, y: p._y, h: p._h, p };
    const x = p.nx * W.w;
    const y = p.ny != null ? p.ny * W.h : p.layer === 2 ? fieldY(p.nx, p.v || 0) : gY(x, p.layer);
    return { x, y, h: (p.layer === 1 ? H1() : H2()) * (p.age === 'child' ? 0.62 : 1), p };
  }
  // 人的手（大约）：随姿势
  function handPt(id) {
    const f = fpos(id); if (!f) return null;
    const p = f.p, d = p.facing || 1, h = f.h;
    const ps = p.pose;
    if (ps === 'point') return [f.x + d * h * 0.36, f.y - h * 0.7];
    if (ps === 'raise') return [f.x + d * h * 0.06, f.y - h * 1.08];
    if (ps === 'carry') return [f.x + d * h * 0.2, f.y - h * 0.5];
    if (ps === 'sit') return [f.x + d * h * 0.16, f.y - h * 0.24];
    if (ps === 'kneel' || ps === 'pray') return [f.x + d * h * 0.12, f.y - h * 0.5];
    return [f.x + d * h * 0.07, f.y - h * 0.44];
  }

  // ── 局部状态 ────────────────────────────────────────────────
  // 情节的状态（身在何处、船从哪里驶向哪里、谁在船上、点了几盏灯、谁戴着锁链）只在 setup 与情节里改动；其余只是装饰
  function fresh() {
    return {
      clock: 0, place: 'antioch', prev: null, shipA: 'moor', shipB: 'moor', shipDir: -1, aboard: {}, lamps: 1,
      chains: {}, spiritX: 0.8, lordX: 0.8, lordY: 0, heartId: 'lydia', doorX: 0.8, scrollId: 'silas', breadId: 'paul',
      viperId: 'paul', lampX: 0.8, sprayAcc: 0, singAcc: 0, fireAcc: 0, lastBolt: 0, wreckAt: 0, macX: 0.63,
    };
  }
  let S = fresh();
  const FXL = [];
  function addFX(b, o) { if (inst(b)) return; FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  // 众教会的灯：自左（东）到右（西）
  const LAMPS = [
    ['安提阿', 0.566], ['塞浦路斯', 0.606], ['彼西底', 0.644], ['路司得', 0.68], ['腓立比', 0.716], ['帖撒罗尼迦', 0.748],
    ['雅典', 0.78], ['哥林多', 0.812], ['以弗所', 0.846], ['马耳他', 0.9], ['罗马', 0.962],
  ];
  const LA = new Float32Array(LAMPS.length);    // 每盏灯此刻的亮度（装饰：随 S.lamps 渐亮）

  // ════════════════════════════════════════════════════════════
  //  贴图
  // ════════════════════════════════════════════════════════════
  const SP = {};
  function glowSprite(key, rgb) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, rgba(rgb, 1)); gr.addColorStop(0.22, rgba(rgb, 0.55)); gr.addColorStop(0.55, rgba(rgb, 0.14)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      SP[key] = c;
    } catch (e) { SP[key] = null; }
  }
  function softSprite(key, rgb) {
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, rgba(rgb, 0.9)); gr.addColorStop(0.5, rgba(rgb, 0.45)); gr.addColorStop(1, rgba(rgb, 0));
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      SP[key] = c;
    } catch (e) { SP[key] = null; }
  }
  function beamSprite() {
    try {
      const w = 32, h = 128, c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
      for (let y = 0; y < h; y++) {
        const v = y / (h - 1), vy = Math.min(1, v / 0.3) * Math.min(1, (1 - v) / 0.1);
        for (let x = 0; x < w; x++) {
          const hx = ((x + 0.5) / w) * 2 - 1, a = vy * (Math.exp(-hx * hx * 5) * 0.75 + Math.exp(-hx * hx * 40) * 0.25);
          const i = (y * w + x) * 4;
          d[i] = 255; d[i + 1] = 246; d[i + 2] = 224; d[i + 3] = Math.round(255 * clamp(a, 0, 1));
        }
      }
      g.putImageData(img, 0, 0);
      SP.beam = c;
    } catch (e) { SP.beam = null; }
  }
  function sprites() {
    if (SP.w) return;
    glowSprite('w', [255, 248, 232]); glowSprite('g', [255, 214, 140]); glowSprite('b', [190, 214, 255]);
    glowSprite('f', [255, 150, 70]); glowSprite('r', [255, 236, 200]); glowSprite('p', [214, 150, 220]);
    softSprite('k', [14, 12, 20]); softSprite('s', [120, 126, 140]); softSprite('m', [226, 228, 234]);
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
    if (!SP.beam || !(a > 0.004) || y1 <= y0 || !isFinite(x)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, x - w / 2, y0, w, y1 - y0);
  }

  // ════════════════════════════════════════════════════════════
  //  建筑的零件（x 为画面宽的比例；尺寸以近地 / 中丘的"建筑尺度"计）
  // ════════════════════════════════════════════════════════════
  const DEP = l => (l === 1 ? 0.42 : 0.04);
  const UNITL = l => (l === 1 ? BM() : BU());
  function base(e) {
    const l = e.l || 2, B = UNITL(l), x = e.x * W.w;
    const g = e.onMesa ? mesaTop(e.onMesa) + (e.peak ? 0.35 : 0.06) * B : gYb(x, l) + 0.07 * B;
    return { l, B, x, g, dep: DEP(l), sunL: litX() < x };
  }
  function winK(e, i) {
    let k = nightK() * (e.lamp == null ? 0.6 : e.lamp);
    if (e.city != null) k = Math.max(k * 0.25, nightK() * ss(e.city + i * 0.05, e.city + i * 0.05 + 0.06, L('jyCityL')));
    if (e.rome) k = Math.max(k, (0.35 + 0.65 * nightK()) * L('jyAll') * 0.9);
    return k;
  }
  function arch(ctx, x, yb, w, h) {
    ctx.moveTo(x - w / 2, yb); ctx.lineTo(x - w / 2, yb - h + w / 2); ctx.arc(x, yb - h + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w / 2, yb); ctx.closePath();
  }
  // 平顶或瓦顶的房子
  function bHouse(ctx, e) {
    const { B, x, g, dep, sunL } = base(e);
    const w = (e.w || 2) * B, h = (e.h || 1.5) * B, x0 = x - w / 2, y0 = g - h, c = e.c || LIME;
    ctx.fillStyle = sh(c, dep); ctx.fillRect(x0, y0, w, h + 0.4 * B);
    const sw = w * 0.2;
    ctx.fillStyle = sh(dim(c, 0.76), dep); ctx.fillRect(sunL ? x0 + w - sw : x0, y0, sw, h + 0.4 * B);
    if (e.roof === 'tile') {
      ctx.fillStyle = sh(TILE, dep);
      ctx.beginPath(); ctx.moveTo(x0 - 0.12 * B, y0 + 0.03 * B); ctx.lineTo(x, y0 - 0.36 * B); ctx.lineTo(x0 + w + 0.12 * B, y0 + 0.03 * B); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh(dim(TILE, 0.7), dep, 0.6); ctx.lineWidth = Math.max(0.5, 0.03 * B);
      ctx.beginPath(); ctx.moveTo(x0 - 0.1 * B, y0 + 0.01 * B); ctx.lineTo(x0 + w + 0.1 * B, y0 + 0.01 * B); ctx.stroke();
    } else {
      ctx.fillStyle = sh(dim(c, 0.62), dep); ctx.fillRect(x0 - 0.05 * B, y0 - 0.1 * B, w + 0.1 * B, 0.12 * B);
    }
    if (e.door != null) {
      const dw = 0.34 * B, dh = Math.min(0.62 * B, h * 0.7), dx = x0 + w * e.door;
      ctx.fillStyle = sh(DOOR, dep);
      ctx.beginPath(); arch(ctx, dx, g + 0.02 * B, dw, dh); ctx.fill();
      const k = e.open ? L(e.open) : 0;
      if (k > 0.02) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba([255, 206, 130], 0.8 * k); ctx.beginPath(); arch(ctx, dx, g + 0.02 * B, dw * 0.8, dh * 0.92); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
    }
    const nw = e.win == null ? 1 : e.win;
    const ws = Math.max(1.2, 0.13 * B);
    for (let i = 0; i < nw; i++) {
      const wx = x0 + w * (0.22 + (nw > 1 ? 0.56 * i / (nw - 1) : 0.3)), wy = y0 + h * 0.26;
      const k = winK(e, i);
      ctx.fillStyle = sh(DOOR, dep);
      ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.4);
      if (k > 0.03) { ctx.fillStyle = rgba([255, 200, 120], clamp(0.95 * k, 0, 1)); ctx.fillRect(wx - ws / 2, wy, ws, ws * 1.4); }
    }
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.08); ctx.lineWidth = Math.max(0.5, 0.04 * B);
    ctx.beginPath(); const ex = sunL ? x0 : x0 + w; ctx.moveTo(ex, g); ctx.lineTo(ex, y0); ctx.lineTo(x, y0); ctx.stroke();
  }
  function lampGlows(ctx, e) {
    const { B, x, g } = base(e);
    const w = (e.w || 2) * B, h = (e.h || 1.5) * B, x0 = x - w / 2, y0 = g - h;
    const nw = e.win == null ? 1 : e.win;
    for (let i = 0; i < nw; i++) {
      const k = winK(e, i); if (k < 0.05) continue;
      const wx = x0 + w * (0.22 + (nw > 1 ? 0.56 * i / (nw - 1) : 0.3)), wy = y0 + h * 0.26;
      glow(ctx, 'g', wx, wy + 0.1 * B, 0.9 * B, 0.3 * k);
    }
  }
  // 希腊—罗马的殿：台阶、柱、檐、山花
  function bTemple(ctx, e) {
    const { B, x, g, dep, sunL } = base(e);
    const w = (e.w || 3.4) * B, h = (e.h || 2.4) * B, c = e.c || MARBLE;
    const st = 0.15 * h;
    for (let i = 0; i < 3; i++) { const ww = w - i * 0.14 * B; ctx.fillStyle = sh(dim(c, 0.84 + i * 0.05), dep); ctx.fillRect(x - ww / 2, g - st * (i + 1) / 3, ww, st / 3 + (i === 0 ? 0.4 * B : 0.5)); }
    const cb = g - st, colH = 0.6 * h, cw = w - 0.36 * B;
    ctx.fillStyle = sh(dim(c, 0.42), dep); ctx.fillRect(x - cw / 2 + 0.08 * B, cb - colH, cw - 0.16 * B, colH);
    const n = e.n || 6, pw = Math.max(1.2, (cw / n) * 0.42);
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const cx = x - cw / 2 + (i + 0.5) * cw / n; ctx.rect(cx - pw / 2, cb - colH, pw, colH); }
    ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.72), dep);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const cx = x - cw / 2 + (i + 0.5) * cw / n; ctx.rect(sunL ? cx + pw * 0.15 : cx - pw / 2, cb - colH, pw * 0.35, colH); }
    ctx.fill();
    const eh = 0.13 * h, ex0 = x - w / 2 + 0.06 * B, ew = w - 0.12 * B;
    ctx.fillStyle = sh(c, dep); ctx.fillRect(ex0, cb - colH - eh, ew, eh);
    ctx.beginPath(); ctx.moveTo(ex0 - 0.04 * B, cb - colH - eh); ctx.lineTo(x, cb - colH - eh - 0.22 * h); ctx.lineTo(ex0 + ew + 0.04 * B, cb - colH - eh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.8), dep);
    ctx.beginPath(); ctx.moveTo(x - ew * 0.36, cb - colH - eh - 0.02 * B); ctx.lineTo(x, cb - colH - eh - 0.17 * h); ctx.lineTo(x + ew * 0.36, cb - colH - eh - 0.02 * B); ctx.closePath(); ctx.fill();
    if (e.gold) { ctx.fillStyle = sh(GOLD, dep, 0.9, 0.12); ctx.fillRect(ex0, cb - colH - eh * 0.25, ew, eh * 0.2); }
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.1); ctx.lineWidth = Math.max(0.5, 0.04 * B);
    ctx.beginPath(); ctx.moveTo(ex0 - 0.04 * B, cb - colH - eh); ctx.lineTo(x, cb - colH - eh - 0.22 * h); ctx.lineTo(ex0 + ew + 0.04 * B, cb - colH - eh); ctx.stroke();
  }
  // 柱廊
  function bStoa(ctx, e) {
    const l = e.l || 2, B = UNITL(l), dep = DEP(l), c = e.c || MARBLE;
    const x0 = e.x0 * W.w, x1 = e.x1 * W.w, h = (e.h || 1.9) * B, step = (e.step || 0.62) * B, pw = Math.max(1.2, 0.13 * B);
    const g = x => gYb(x, l) + 0.07 * B;
    const sunL = litX() < (x0 + x1) / 2;
    ctx.fillStyle = sh(dim(c, 0.5), dep);
    ctx.beginPath(); ctx.moveTo(x0, g(x0)); ctx.lineTo(x0, g(x0) - h); ctx.lineTo(x1, g(x1) - h); ctx.lineTo(x1, g(x1)); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    for (let x = x0 + step * 0.5; x < x1; x += step) ctx.rect(x - pw / 2, g(x) - h, pw, h + 0.3 * B);
    ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.9), dep);
    ctx.beginPath(); ctx.moveTo(x0 - 0.08 * B, g(x0) - h); ctx.lineTo(x1 + 0.08 * B, g(x1) - h); ctx.lineTo(x1 + 0.08 * B, g(x1) - h - 0.2 * B); ctx.lineTo(x0 - 0.08 * B, g(x0) - h - 0.2 * B); ctx.closePath(); ctx.fill();
    if (e.tile) { ctx.fillStyle = sh(TILE, dep); ctx.beginPath(); ctx.moveTo(x0 - 0.1 * B, g(x0) - h - 0.2 * B); ctx.lineTo(x0 + 0.2 * B, g(x0) - h - 0.5 * B); ctx.lineTo(x1 - 0.2 * B, g(x1) - h - 0.5 * B); ctx.lineTo(x1 + 0.1 * B, g(x1) - h - 0.2 * B); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.08); ctx.lineWidth = Math.max(0.5, 0.035 * B);
    ctx.beginPath();
    for (let x = x0 + step * 0.5; x < x1; x += step) { const ex = sunL ? x - pw / 2 : x + pw / 2; ctx.moveTo(ex, g(x)); ctx.lineTo(ex, g(x) - h); }
    ctx.stroke();
  }
  // 城墙（带垛口）与城门、城楼
  function crenel(ctx, x, yb, w, h, cren) {
    ctx.rect(x, yb - h, w, h + 2);
    const n = Math.max(1, Math.floor(w / (cren * 2)));
    const off = (w - (n * 2 - 1) * cren) / 2;
    for (let i = 0; i < n; i++) ctx.rect(x + off + i * cren * 2, yb - h - cren * 0.7, cren, cren * 0.7 + 1);
  }
  function bWall(ctx, e) {
    const l = e.l || 2, B = UNITL(l), dep = DEP(l), c = e.c || OCHRE;
    const x0 = e.x0 * W.w, x1 = e.x1 * W.w, h = (e.h || 1.3) * B, cren = Math.max(1.2, 0.14 * B);
    const g = x => gYb(clamp(x, 0, W.w), l) + 0.08 * B;
    const gx = e.gate != null ? e.gate * W.w : null, gw = 0.6 * B;
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    let x = x0;
    while (x < x1) { const xn = Math.min(x1, x + 0.8 * B); crenel(ctx, x, g((x + xn) / 2), xn - x + 0.5, h, cren); x = xn; }
    if (gx != null) { crenel(ctx, gx - 0.95 * B, g(gx), 0.6 * B, h * 1.35, cren); crenel(ctx, gx + 0.35 * B, g(gx), 0.6 * B, h * 1.35, cren); ctx.rect(gx - 0.4 * B, g(gx) - h * 1.12, 0.8 * B, h * 1.12); }
    for (const t of e.towers || []) { const tx = t * W.w; crenel(ctx, tx - 0.32 * B, g(tx), 0.64 * B, h * 1.45, cren); }
    ctx.fill();
    ctx.strokeStyle = sh(dim(c, 0.72), dep, 0.35); ctx.lineWidth = Math.max(0.5, 0.025 * B);
    ctx.beginPath();
    for (let k = 1; k < 4; k++) { x = x0; while (x < x1) { const gg = g(x); ctx.moveTo(x, gg - h * k / 4); ctx.lineTo(Math.min(x1, x + 0.5 * B), gg - h * k / 4); x += 0.5 * B; } }
    ctx.stroke();
    if (gx != null) {
      ctx.fillStyle = sh(DOOR, dep);
      ctx.beginPath(); arch(ctx, gx, g(gx) + 0.02 * B, gw * 0.9, h * 0.95); ctx.fill();
      if (nightK() > 0.1) { ctx.globalCompositeOperation = 'lighter'; glow(ctx, 'g', gx, g(gx) - h * 0.5, 1.1 * B, 0.3 * nightK()); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = e._a == null ? 1 : e._a; }
    }
  }
  // 偶像：座与一个抽象的立像
  function bIdol(ctx, e) {
    const { B, x, g, dep, sunL } = base(e);
    const c = e.c || [168, 128, 84], s = e.s || 1;
    const pw = 0.42 * B * s, ph = 0.5 * B * s;
    ctx.fillStyle = sh(MARBLE_D, dep); ctx.fillRect(x - pw / 2, g - ph, pw, ph + 0.3 * B);
    ctx.fillStyle = sh(MARBLE, dep); ctx.fillRect(x - pw * 0.6, g - ph - 0.06 * B * s, pw * 1.2, 0.07 * B * s);
    const y0 = g - ph - 0.06 * B * s, fh = 1.05 * B * s;
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    ctx.moveTo(x - 0.15 * B * s, y0); ctx.lineTo(x - 0.1 * B * s, y0 - fh * 0.7); ctx.lineTo(x + 0.1 * B * s, y0 - fh * 0.7); ctx.lineTo(x + 0.15 * B * s, y0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(x, y0 - fh * 0.8, 0.09 * B * s, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh(c, dep); ctx.lineWidth = Math.max(1, 0.06 * B * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + 0.1 * B * s, y0 - fh * 0.62); ctx.lineTo(x + 0.26 * B * s, y0 - fh * (e.arm ? 0.98 : 0.4)); ctx.stroke();
    if (e.spear) { ctx.lineWidth = Math.max(0.6, 0.025 * B * s); ctx.beginPath(); ctx.moveTo(x + 0.27 * B * s, y0 + 0.02 * B); ctx.lineTo(x + 0.27 * B * s, y0 - fh * 1.15); ctx.stroke(); }
    ctx.lineCap = 'butt';
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.15); ctx.lineWidth = Math.max(0.5, 0.03 * B);
    ctx.beginPath(); const sx = sunL ? -1 : 1; ctx.moveTo(x + sx * 0.12 * B * s, y0); ctx.lineTo(x + sx * 0.09 * B * s, y0 - fh * 0.7); ctx.stroke();
  }
  // 坛：上面写着「未识之神」
  function altarG() { const x = X('altar') * W.w, B = BU(); return { x, g: gYb(x) + 0.07 * B, B, w: 0.9 * B, h: 0.66 * B }; }
  function bAltar(ctx) {
    const G = altarG(), B = G.B, dep = 0.04, sunL = litX() < G.x;
    ctx.fillStyle = sh(MARBLE, dep); ctx.fillRect(G.x - G.w / 2, G.g - G.h, G.w, G.h + 0.3 * B);
    ctx.fillStyle = sh(dim(MARBLE, 0.78), dep); ctx.fillRect(sunL ? G.x + G.w * 0.3 : G.x - G.w / 2, G.g - G.h, G.w * 0.2, G.h + 0.3 * B);
    ctx.fillStyle = sh(MARBLE, dep); ctx.fillRect(G.x - G.w * 0.6, G.g - G.h - 0.1 * B, G.w * 1.2, 0.12 * B); ctx.fillRect(G.x - G.w * 0.6, G.g - 0.1 * B, G.w * 1.2, 0.1 * B);
    // 刻字（四个小小的记号）
    const k = L('jyAltar');
    ctx.strokeStyle = k > 0.05 ? rgba(mix([60, 52, 44], [255, 226, 160], k), 0.9) : sh([70, 62, 54], dep);
    ctx.lineWidth = Math.max(0.6, 0.03 * B);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const cx = G.x - G.w * 0.3 + i * G.w * 0.2, cy = G.g - G.h * 0.55, r = 0.06 * B;
      ctx.moveTo(cx - r, cy - r * 0.6); ctx.lineTo(cx + r, cy - r * 0.6); ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r); ctx.moveTo(cx - r * 0.8, cy + r * 0.4); ctx.lineTo(cx + r * 0.8, cy + r * 0.9);
    }
    ctx.stroke();
  }
  // 亚略‧巴古：一块石冈，顶上平坦，保罗站在上面
  function rockG() { const x = X('rock') * W.w, B = BU(); return { x, g: gYb(x) + 0.1 * B, B, w: 2.6 * B, h: 0.95 * B }; }
  const rockTop = () => { const G = rockG(); return [G.x, G.g - G.h]; };
  function bRock(ctx) {
    const G = rockG(), B = G.B, dep = 0.04, sunL = litX() < G.x, c = [170, 160, 146];
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    ctx.moveTo(G.x - G.w / 2 - 0.3 * B, G.g + 0.2 * B);
    ctx.quadraticCurveTo(G.x - G.w * 0.42, G.g - G.h * 0.7, G.x - G.w * 0.28, G.g - G.h);
    ctx.lineTo(G.x + G.w * 0.2, G.g - G.h - 0.04 * B);
    ctx.quadraticCurveTo(G.x + G.w * 0.4, G.g - G.h * 0.9, G.x + G.w / 2 + 0.3 * B, G.g + 0.2 * B);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.72), dep);
    ctx.beginPath();
    const s = sunL ? 1 : -1;
    ctx.moveTo(G.x + s * G.w * 0.1, G.g - G.h + 0.02 * B); ctx.quadraticCurveTo(G.x + s * G.w * 0.4, G.g - G.h * 0.8, G.x + s * (G.w / 2 + 0.3 * B), G.g + 0.2 * B); ctx.lineTo(G.x + s * G.w * 0.15, G.g + 0.2 * B); ctx.closePath(); ctx.fill();
    // 凿出的台阶
    ctx.strokeStyle = sh(dim(c, 0.6), dep, 0.8); ctx.lineWidth = Math.max(0.6, 0.035 * B);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const t = i / 5, sx = G.x - G.w * 0.46 + t * G.w * 0.2, sy = G.g - t * G.h * 0.95; ctx.moveTo(sx, sy); ctx.lineTo(sx + 0.22 * B, sy); ctx.lineTo(sx + 0.22 * B, sy - G.h * 0.19); }
    ctx.stroke();
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.08); ctx.lineWidth = Math.max(0.6, 0.04 * B);
    ctx.beginPath(); ctx.moveTo(G.x - G.w * 0.28, G.g - G.h); ctx.lineTo(G.x + G.w * 0.2, G.g - G.h - 0.04 * B); ctx.stroke();
  }
  // 帐棚（山羊毛织的，深褐带条纹）
  function bTent(ctx, e) {
    const { B, x, g, dep } = base(e);
    const w = (e.w || 1.9) * B, h = (e.h || 1.15) * B, c = e.c || TENT;
    ctx.strokeStyle = sh(WOOD_D, dep); ctx.lineWidth = Math.max(0.8, 0.05 * B);
    ctx.beginPath(); ctx.moveTo(x - w * 0.3, g); ctx.lineTo(x - w * 0.3, g - h * 1.05); ctx.moveTo(x + w * 0.3, g); ctx.lineTo(x + w * 0.3, g - h * 1.05); ctx.stroke();
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 0.1 * B, g); ctx.quadraticCurveTo(x - w * 0.42, g - h * 0.6, x - w * 0.3, g - h);
    ctx.quadraticCurveTo(x, g - h * 0.9, x + w * 0.3, g - h);
    ctx.quadraticCurveTo(x + w * 0.42, g - h * 0.6, x + w / 2 + 0.1 * B, g); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(DOOR, dep);
    ctx.beginPath(); ctx.moveTo(x - w * 0.14, g); ctx.lineTo(x - w * 0.02, g - h * 0.72); ctx.lineTo(x + w * 0.12, g); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh(TENT_L, dep, 0.55); ctx.lineWidth = Math.max(0.6, 0.04 * B);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const t = i / 4; ctx.moveTo(x - w * (0.5 - 0.2 * t) , g - h * t * 0.95); ctx.lineTo(x + w * (0.5 - 0.2 * t), g - h * t * 0.95); }
    ctx.stroke();
  }
  // 树：柏树、伞松、棕树、橄榄
  function bTree(ctx, e) {
    const { B, x, g, dep } = base(e);
    const s = (e.s || 1) * B;
    if (e.t === 'cypress') {
      ctx.fillStyle = sh([44, 70, 48], dep);
      ctx.beginPath(); ctx.moveTo(x, g - 2.4 * s); ctx.quadraticCurveTo(x + 0.34 * s, g - 1.2 * s, x + 0.16 * s, g); ctx.lineTo(x - 0.16 * s, g); ctx.quadraticCurveTo(x - 0.34 * s, g - 1.2 * s, x, g - 2.4 * s); ctx.fill();
    } else if (e.t === 'pine') {
      ctx.strokeStyle = sh([74, 58, 44], dep); ctx.lineWidth = Math.max(1, 0.08 * s);
      ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x + 0.1 * s, g - 1 * s, x + 0.05 * s, g - 1.7 * s); ctx.stroke();
      ctx.fillStyle = sh([56, 84, 54], dep);
      ctx.beginPath(); ctx.ellipse(x + 0.05 * s, g - 1.85 * s, 0.8 * s, 0.26 * s, 0, 0, TAU); ctx.fill();
    } else if (e.t === 'palm') {
      ctx.strokeStyle = sh([96, 76, 54], dep); ctx.lineWidth = Math.max(1, 0.08 * s);
      ctx.beginPath(); ctx.moveTo(x, g); ctx.quadraticCurveTo(x - 0.2 * s, g - 1.2 * s, x + 0.1 * s, g - 2.2 * s); ctx.stroke();
      ctx.strokeStyle = sh([66, 100, 56], dep); ctx.lineWidth = Math.max(1, 0.1 * s);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) { const a = -Math.PI + (i / 6) * Math.PI, sw = Math.sin(S.clock * 0.8 + i) * 0.04; ctx.moveTo(x + 0.1 * s, g - 2.2 * s); ctx.quadraticCurveTo(x + 0.1 * s + Math.cos(a) * 0.5 * s, g - 2.45 * s + Math.sin(a) * 0.2 * s, x + 0.1 * s + Math.cos(a + sw) * 0.9 * s, g - 2.0 * s + Math.abs(Math.cos(a)) * 0.3 * s); }
      ctx.stroke();
    } else {
      ctx.fillStyle = sh([88, 72, 58], dep);
      ctx.fillRect(x - 0.08 * s, g - 0.8 * s, 0.16 * s, 0.8 * s);
      ctx.fillStyle = sh([96, 118, 86], dep);
      ctx.beginPath(); ctx.ellipse(x - 0.2 * s, g - 1.05 * s, 0.55 * s, 0.36 * s, 0, 0, TAU); ctx.ellipse(x + 0.3 * s, g - 1.0 * s, 0.45 * s, 0.3 * s, 0, 0, TAU); ctx.fill();
    }
  }
  // 中丘上远远的城：一簇白房子
  function bTown(ctx, e) {
    const l = e.l || 1, B = UNITL(l), dep = DEP(l);
    const x0 = e.x0 * W.w, x1 = e.x1 * W.w, n = Math.max(3, Math.round((x1 - x0) / (0.9 * B)));
    const seed = e.seed || 1;
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, (i + 0.5) / n) + (hsh(seed + i) - 0.5) * 0.4 * B, g = gYb(x, l) + 0.08 * B;
      const w = (0.6 + 0.5 * hsh(seed + i + 40)) * B, h = (0.4 + 0.7 * hsh(seed + i + 80)) * B * (e.hk || 1);
      const c = mix(e.c || LIME, OCHRE, hsh(seed + i + 120) * 0.5);
      ctx.fillStyle = sh(c, dep); ctx.fillRect(x - w / 2, g - h, w, h + 0.3 * B);
      if (e.tile && hsh(seed + i + 160) > 0.4) { ctx.fillStyle = sh(TILE, dep); ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.05 * B, g - h); ctx.lineTo(x, g - h - 0.2 * B); ctx.lineTo(x + w / 2 + 0.05 * B, g - h); ctx.closePath(); ctx.fill(); }
      const k = e.city != null ? Math.max(nightK() * 0.2, nightK() * ss(e.city + hsh(seed + i + 200) * 0.6, e.city + hsh(seed + i + 200) * 0.6 + 0.05, L('jyCityL'))) : nightK() * (hsh(seed + i + 240) > 0.5 ? 0.6 : 0);
      const k2 = e.rome ? Math.max(k, (0.3 + 0.7 * nightK()) * L('jyAll') * (hsh(seed + i + 280) > 0.35 ? 0.9 : 0)) : k;
      if (k2 > 0.04) { const ws = Math.max(1, 0.12 * B); ctx.fillStyle = rgba([255, 204, 124], clamp(k2, 0, 1)); ctx.fillRect(x - ws / 2, g - h * 0.62, ws, ws * 1.3); }
    }
  }
  // 石冈（雅典的卫城、哥林多的高冈）
  function bMesa(ctx, e) {
    const l = e.l || 1, B = UNITL(l), dep = DEP(l), c = e.c || [150, 140, 124];
    const x0 = e.x0 * W.w, x1 = e.x1 * W.w, h = (e.h || 1.4) * B;
    const g0 = gYb(x0, l) + 0.1 * B, g1 = gYb(x1, l) + 0.1 * B;
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    ctx.moveTo(x0 - 0.4 * B, g0 + 0.2 * B);
    if (e.peak) { ctx.quadraticCurveTo(lerp(x0, x1, 0.3), g0 - h * 0.6, lerp(x0, x1, 0.55), Math.min(g0, g1) - h); ctx.quadraticCurveTo(lerp(x0, x1, 0.8), g1 - h * 0.5, x1 + 0.4 * B, g1 + 0.2 * B); }
    else { ctx.lineTo(x0 + 0.1 * B, Math.min(g0, g1) - h * 0.92); ctx.lineTo(x0 + 0.5 * B, Math.min(g0, g1) - h); ctx.lineTo(x1 - 0.4 * B, Math.min(g0, g1) - h); ctx.lineTo(x1, Math.min(g0, g1) - h * 0.85); ctx.lineTo(x1 + 0.4 * B, g1 + 0.2 * B); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh(lit(c), dep, rimA() * 0.8, 0.06); ctx.lineWidth = Math.max(0.5, 0.05 * B);
    ctx.beginPath(); ctx.moveTo(x0 + 0.1 * B, Math.min(g0, g1) - h * 0.92); ctx.lineTo(x0 + 0.5 * B, Math.min(g0, g1) - h); ctx.lineTo(x1 - 0.4 * B, Math.min(g0, g1) - h); ctx.stroke();
  }
  const mesaTop = e => { const l = e.l || 1, B = UNITL(l); return Math.min(gYb(e.x0 * W.w, l), gYb(e.x1 * W.w, l)) + 0.1 * B - (e.h || 1.4) * B; };
  // 码头：水边的石堤
  function bQuay(ctx) {
    const q = X('quay'), P = X('moor'), B = BU();
    const x0 = q[0] * W.w, x1 = q[1] * W.w, y = P[1] * W.h - 0.14 * B, th = 0.12 * B, face = 0.2 * B;
    ctx.fillStyle = sh(STONE_D, 0.04);
    ctx.fillRect(x0, y + th, x1 - x0, face);
    ctx.fillStyle = sh(STONE, 0.04);
    ctx.beginPath(); ctx.moveTo(x0 - 0.1 * B, y + th); ctx.lineTo(x0, y); ctx.lineTo(x1 + 0.3 * B, y - 0.02 * B); ctx.lineTo(x1 + 0.5 * B, y + th); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh(dim(STONE, 0.7), 0.04, 0.6); ctx.lineWidth = Math.max(0.5, 0.025 * B);
    ctx.beginPath();
    for (let x = x0 + 0.35 * B; x < x1; x += 0.45 * B) { ctx.moveTo(x, y + th); ctx.lineTo(x, y + th + face); }
    ctx.stroke();
    ctx.strokeStyle = sh(lit(STONE), 0.04, rimA(), 0.08); ctx.lineWidth = Math.max(0.5, 0.035 * B);
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 + 0.3 * B, y - 0.02 * B); ctx.stroke();
    ctx.fillStyle = sh(WOOD_D, 0.04);
    ctx.fillRect(x0 + 0.15 * B, y - 0.2 * B, 0.08 * B, 0.22 * B);
    ctx.fillRect(x0 + 0.95 * B, y - 0.2 * B, 0.08 * B, 0.22 * B);
  }
  // 灯塔（中丘上：港口的入口）
  function bBeacon(ctx, e) {
    const { B, x, g, dep } = base(e);
    const h = (e.h || 2.6) * B, w = 0.55 * B;
    ctx.fillStyle = sh(MARBLE_D, dep);
    ctx.beginPath(); ctx.moveTo(x - w / 2, g + 0.2 * B); ctx.lineTo(x - w * 0.36, g - h); ctx.lineTo(x + w * 0.36, g - h); ctx.lineTo(x + w / 2, g + 0.2 * B); ctx.closePath(); ctx.fill();
    ctx.fillRect(x - w * 0.45, g - h - 0.08 * B, w * 0.9, 0.1 * B);
    ctx.fillRect(x - w * 0.22, g - h - 0.4 * B, w * 0.44, 0.34 * B);
    const k = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'f', x, g - h - 0.24 * B, 1.1 * B, 0.5 * k);
    glow(ctx, 'w', x, g - h - 0.24 * B, 0.25 * B, 0.8 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = e._a == null ? 1 : e._a;
  }
  // 水道的拱（罗马）
  function bAqueduct(ctx, e) {
    const l = e.l || 1, B = UNITL(l), dep = DEP(l);
    const x0 = e.x0 * W.w, x1 = e.x1 * W.w, h = (e.h || 1.3) * B, span = 0.7 * B;
    const g = x => gYb(clamp(x, 0, W.w), l) + 0.1 * B;
    const top = Math.min(g(x0), g(x1)) - h;
    ctx.fillStyle = sh([196, 170, 136], dep);
    ctx.beginPath();
    ctx.rect(x0, top, x1 - x0, 0.2 * B);
    for (let x = x0; x < x1; x += span) ctx.rect(x, top, 0.16 * B, g(x) - top + 0.2 * B);
    ctx.fill();
    ctx.fillStyle = sh([196, 170, 136], dep);
    ctx.beginPath();
    for (let x = x0; x + span <= x1 + 1; x += span) { ctx.moveTo(x + 0.16 * B, top + 0.2 * B); ctx.lineTo(x + span, top + 0.2 * B); ctx.lineTo(x + span, top + 0.42 * B); ctx.quadraticCurveTo(x + (span + 0.16 * B) / 2, top + 0.2 * B, x + 0.16 * B, top + 0.42 * B); ctx.closePath(); }
    ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  几处特别的地方
  // ════════════════════════════════════════════════════════════
  // ── 腓立比的监（剖开的一面：外监、内监、木狗、高窗）──────────
  function prisonG() {
    const r = X('pris'), B = BU(), x0 = r[0] * W.w, x1 = r[1] * W.w, xm = (x0 + x1) / 2;
    const g = gYb(xm) + 0.08 * B, H = 2.55 * B, t = 0.26 * B;
    const xi = x0 + (x1 - x0) * (tall() ? 0.5 : 0.47);
    return { x0, x1, g, H, t, B, xi, floor: g - 0.1 * B, ceil: g - H + 0.34 * B };
  }
  function bPrison(ctx) {
    const G = prisonG(), B = G.B, dep = 0.04, q = L('jyQuake');
    const jx = (W.jx || 0), shake = q > 0 && q < 1 ? Math.sin(S.clock * 40) * 0.02 * B : 0;
    ctx.save(); ctx.translate(shake + jx * 0, 0);
    // 里面的墙（暗）
    ctx.fillStyle = sh([96, 86, 76], dep, 1, 0.16);
    ctx.fillRect(G.x0, G.g - G.H, G.x1 - G.x0, G.H + 0.4 * B);
    ctx.fillStyle = sh([78, 70, 64], dep, 1, 0.12);
    ctx.fillRect(G.x0 + G.t, G.ceil, G.xi - G.x0 - G.t, G.floor - G.ceil);          // 内监更暗
    // 石缝
    ctx.strokeStyle = sh(dim(DARKST, 0.6), dep, 0.7); ctx.lineWidth = Math.max(0.5, 0.025 * B);
    ctx.beginPath();
    for (let r = 1; r < 7; r++) { const y = G.ceil + (G.floor - G.ceil) * r / 7; ctx.moveTo(G.x0 + G.t, y); ctx.lineTo(G.x1 - G.t, y); for (let x = G.x0 + G.t + (r % 2) * 0.3 * B; x < G.x1 - G.t; x += 0.6 * B) { ctx.moveTo(x, y); ctx.lineTo(x, y - (G.floor - G.ceil) / 7); } }
    ctx.stroke();
    // 地面
    ctx.fillStyle = sh(STONE_D, dep, 1, 0.12);
    ctx.fillRect(G.x0, G.floor, G.x1 - G.x0, 0.5 * B);
    // 高窗与月光
    const wx = G.x0 + (G.xi - G.x0) * 0.55, wy = G.ceil + 0.25 * B, ww = 0.34 * B, wh = 0.26 * B;
    ctx.fillStyle = W.night > 0.3 ? 'rgb(34,44,74)' : sh([150, 170, 196], dep);
    ctx.fillRect(wx - ww / 2, wy, ww, wh);
    ctx.fillStyle = sh(DARKST, dep);
    for (let i = 1; i < 4; i++) ctx.fillRect(wx - ww / 2 + ww * i / 4 - 0.015 * B, wy, 0.03 * B, wh);
    // 墙、顶（剖开的截面：亮一些的石）
    const cut = mix(STONE, [196, 186, 168], 0.3);
    ctx.fillStyle = sh(cut, dep, 1, 0.1);
    ctx.fillRect(G.x0, G.g - G.H, G.t, G.H + 0.4 * B);                     // 左墙
    ctx.fillRect(G.x1 - G.t, G.g - G.H, G.t, G.H + 0.4 * B);               // 右墙
    ctx.fillRect(G.x0 - 0.1 * B, G.g - G.H - 0.12 * B, G.x1 - G.x0 + 0.2 * B, 0.46 * B);   // 顶
    ctx.fillRect(G.xi - 0.08 * B, G.ceil, 0.16 * B, (G.floor - G.ceil) * 0.36);   // 内墙的上段（门楣）
    ctx.fillStyle = sh(dim(cut, 0.8), dep);
    ctx.fillRect(G.x0 - 0.1 * B, G.g - G.H + 0.26 * B, G.x1 - G.x0 + 0.2 * B, 0.08 * B);
    // 外门的门洞
    const dH = 1.35 * B;
    ctx.fillStyle = sh(dim(DARKST, 0.5), dep);
    ctx.fillRect(G.x1 - G.t, G.floor - dH, G.t, dH);
    ctx.strokeStyle = sh(lit(cut), dep, rimA(), 0.08); ctx.lineWidth = Math.max(0.6, 0.04 * B);
    ctx.beginPath(); ctx.moveTo(G.x0 - 0.1 * B, G.g - G.H - 0.12 * B); ctx.lineTo(G.x1 + 0.1 * B, G.g - G.H - 0.12 * B); ctx.stroke();
    ctx.restore();
  }
  // 门、木狗、月光（画在人之后）
  function drawPrisonFront(ctx) {
    const G = prisonG(), B = G.B, dep = 0.04, q = ease(L('jyQuake'));
    // 月光自高窗斜照
    const n = W.night;
    if (n > 0.2) {
      const wx = G.x0 + (G.xi - G.x0) * 0.55, wy = G.ceil + 0.38 * B;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([150, 176, 236], 0.07 * n);
      ctx.beginPath(); ctx.moveTo(wx - 0.17 * B, wy); ctx.lineTo(wx + 0.17 * B, wy); ctx.lineTo(wx - 0.2 * B, G.floor); ctx.lineTo(wx - 0.9 * B, G.floor); ctx.closePath(); ctx.fill();
      glow(ctx, 'b', wx - 0.55 * B, G.floor, 0.8 * B, 0.18 * n, 0.14 * B);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 外监里挂着的一盏油灯
    {
      const lx = lerp(G.xi, G.x1 - G.t, 0.5), ly = G.ceil + 0.55 * B;
      ctx.strokeStyle = sh([60, 54, 48], dep); ctx.lineWidth = Math.max(0.5, 0.02 * B);
      ctx.beginPath(); ctx.moveTo(lx, G.ceil); ctx.lineTo(lx, ly); ctx.stroke();
      ctx.fillStyle = sh([150, 100, 64], dep); ctx.beginPath(); ctx.ellipse(lx, ly + 0.04 * B, 0.1 * B, 0.05 * B, 0, 0, TAU); ctx.fill();
      const fl = 0.9 + 0.1 * Math.sin(S.clock * 7) * Math.sin(S.clock * 4.3);
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', lx, ly + 0.2 * B, 3.4 * B * fl, 0.32 * (0.35 + 0.65 * nightK()));
      glow(ctx, 'w', lx, ly, 0.12 * B, 0.9);
      glow(ctx, 'g', (G.x0 + G.xi) / 2, G.floor - 0.6 * B, 2.2 * B, 0.14 * nightK());
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 内监的栅门：地震时向里转开
    const gh = (G.floor - G.ceil) * 0.64, gw = 0.62 * B, a = q * 1.25;
    const gx = G.xi, gy = G.floor;
    const vis = Math.cos(a), off = Math.sin(a) * gw * 0.35;
    ctx.fillStyle = sh(WOOD_D, dep);
    ctx.fillRect(gx - 0.06 * B, gy - gh, 0.12 * B, gh);
    ctx.strokeStyle = sh([90, 84, 80], dep); ctx.lineWidth = Math.max(0.8, 0.05 * B);
    ctx.beginPath();
    const w2 = gw * Math.max(0.12, vis);
    for (let i = 0; i <= 4; i++) { const x = gx + 0.06 * B + (w2 * i) / 4; ctx.moveTo(x, gy - gh - off * 0.3); ctx.lineTo(x, gy + off * 0.2); }
    ctx.moveTo(gx + 0.06 * B, gy - gh * 0.8); ctx.lineTo(gx + 0.06 * B + w2, gy - gh * 0.8 - off * 0.2);
    ctx.moveTo(gx + 0.06 * B, gy - gh * 0.25); ctx.lineTo(gx + 0.06 * B + w2, gy - gh * 0.25);
    ctx.stroke();
    // 外门（木门）：转开
    const dH = 1.35 * B, dx = G.x1 - G.t;
    const dw = G.t * Math.max(0.15, Math.cos(q * 1.3));
    ctx.fillStyle = sh(WOOD, dep);
    ctx.fillRect(dx, G.floor - dH, dw, dH);
    if (q > 0.05) {
      ctx.fillStyle = sh(WOOD_D, dep);
      ctx.beginPath(); ctx.moveTo(dx, G.floor - dH); ctx.lineTo(dx - 0.5 * B * Math.sin(q * 1.3), G.floor - dH - 0.1 * B); ctx.lineTo(dx - 0.5 * B * Math.sin(q * 1.3), G.floor + 0.05 * B); ctx.lineTo(dx, G.floor); ctx.closePath(); ctx.fill();
    }
    // 木狗：一根横木夹着两人的脚（松开时上半抬起、落到一旁）——钉在内监的地上，二人走开后仍留在原处
    const k = L('jyStocks');
    if (S.place === 'prison') {
      const xa = X('paul6') * W.w, xb = X('silas6') * W.w, cx = (xa + xb) / 2, w = Math.max(xb - xa, 0.6 * B) * 0.9, y = G.floor - 0.12 * B;
      ctx.fillStyle = sh(WOOD, dep);
      ctx.fillRect(cx - w / 2, y, w, 0.1 * B);
      ctx.save();
      ctx.translate(cx - w / 2, y);
      ctx.rotate(-(1 - k) * 0.5);
      ctx.translate(0, -(1 - k) * 0.12 * B);
      ctx.fillStyle = sh(WOOD_L, dep);
      ctx.fillRect(0, -0.1 * B, w, 0.1 * B);
      ctx.restore();
    }
  }
  // ── 营楼（安东尼亚）与台阶 ────────────────────────────────────
  function fortG() {
    const r = X('fort'), s = X('stair'), B = BU(), x0 = r[0] * W.w, x1 = r[1] * W.w;
    const g = gYb((x0 + x1) / 2) + 0.08 * B, H = 3.1 * B, land = g - 1.15 * B;
    return { x0, x1, g, H, B, sx0: s[0] * W.w, sx1: s[1] * W.w, land };
  }
  const stairTop = () => { const G = fortG(); return [G.sx1 - 0.25 * G.B, G.land]; };
  function bFort(ctx) {
    const G = fortG(), B = G.B, dep = 0.04, c = mix(OCHRE, STONE, 0.4), sunL = litX() < G.x0, cren = Math.max(1.2, 0.14 * B);
    ctx.fillStyle = sh(c, dep);
    ctx.beginPath();
    crenel(ctx, G.x0, G.g, G.x1 - G.x0, G.H, cren);
    crenel(ctx, G.x0 - 0.1 * B, G.g, 0.8 * B, G.H * 1.28, cren);
    crenel(ctx, G.x1 - 0.7 * B, G.g, 0.8 * B, G.H * 1.28, cren);
    ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.78), dep);
    ctx.fillRect(sunL ? G.x1 - 0.3 * B : G.x0 - 0.1 * B, G.g - G.H * 1.28, 0.3 * B, G.H * 1.28 + 0.3 * B);
    ctx.strokeStyle = sh(dim(c, 0.7), dep, 0.35); ctx.lineWidth = Math.max(0.5, 0.025 * B);
    ctx.beginPath();
    for (let k = 1; k < 7; k++) { const y = G.g - G.H * k / 7; ctx.moveTo(G.x0, y); ctx.lineTo(G.x1, y); }
    ctx.stroke();
    // 门与窗
    ctx.fillStyle = sh(DOOR, dep);
    ctx.beginPath(); arch(ctx, G.x0 + 0.55 * B, G.land + 0.02 * B, 0.44 * B, 0.8 * B); ctx.fill();
    const nk = nightK();
    for (let i = 0; i < 3; i++) {
      const wx = lerp(G.x0 + 1.2 * B, G.x1 - 1 * B, i / 2), wy = G.g - G.H * 0.72;
      ctx.fillStyle = nk > 0.1 ? rgba([255, 196, 116], 0.4 + 0.5 * nk) : sh(DOOR, dep);
      ctx.fillRect(wx - 0.07 * B, wy, 0.14 * B, 0.24 * B);
    }
    if (nk > 0.1) { ctx.globalCompositeOperation = 'lighter'; glow(ctx, 'g', G.x0 + 0.55 * B, G.land - 0.4 * B, 1.1 * B, 0.35 * nk); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    // 台阶：自院中升到营楼门前的平台
    ctx.fillStyle = sh(mix(c, [230, 220, 200], 0.25), dep);
    ctx.beginPath();
    ctx.moveTo(G.sx0, G.g + 0.1 * B); ctx.lineTo(G.sx1, G.land); ctx.lineTo(G.x0 + 1.0 * B, G.land); ctx.lineTo(G.x0 + 1.0 * B, G.land + 0.14 * B);
    ctx.lineTo(G.sx1 + 0.05 * B, G.land + 0.14 * B); ctx.lineTo(G.sx0 + 0.3 * B, G.g + 0.1 * B); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(dim(c, 0.72), dep);
    ctx.beginPath(); ctx.moveTo(G.sx0 + 0.3 * B, G.g + 0.1 * B); ctx.lineTo(G.sx1 + 0.05 * B, G.land + 0.14 * B); ctx.lineTo(G.sx1 + 0.05 * B, G.g + 0.1 * B); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh(dim(c, 0.6), dep, 0.8); ctx.lineWidth = Math.max(0.5, 0.03 * B);
    ctx.beginPath();
    for (let i = 1; i < 9; i++) { const t = i / 9, x = lerp(G.sx0, G.sx1, t), y = lerp(G.g + 0.1 * B, G.land, t); ctx.moveTo(x, y); ctx.lineTo(x + 0.18 * B, y); }
    ctx.stroke();
    ctx.strokeStyle = sh(lit(c), dep, rimA(), 0.1); ctx.lineWidth = Math.max(0.6, 0.04 * B);
    ctx.beginPath(); ctx.moveTo(G.sx0, G.g + 0.1 * B); ctx.lineTo(G.sx1, G.land); ctx.lineTo(G.x0 + 1.0 * B, G.land); ctx.stroke();
  }
  // 耶路撒冷的殿（中丘）：白石与金
  function bTempleJ(ctx, e) {
    const B = BM(), x = e.x * W.w, g = gYb(x, 1) + 0.1 * B, dep = 0.42, sunL = litX() < x;
    const body = [238, 232, 214];
    ctx.fillStyle = sh(LIME_D, dep); ctx.fillRect(x - 2.6 * B, g - 0.5 * B, 5.2 * B, 0.8 * B);
    ctx.fillStyle = sh(body, dep); ctx.fillRect(x - 1.6 * B, g - 1.9 * B, 3.2 * B, 1.45 * B);
    ctx.fillRect(x - 0.7 * B, g - 2.6 * B, 1.4 * B, 2.2 * B);
    ctx.fillStyle = sh(dim(body, 0.8), dep); ctx.fillRect(sunL ? x + 1.2 * B : x - 1.6 * B, g - 1.9 * B, 0.4 * B, 1.45 * B);
    ctx.fillStyle = sh(GOLD, dep, 1, 0.12); ctx.fillRect(x - 0.72 * B, g - 2.66 * B, 1.44 * B, 0.08 * B); ctx.fillRect(x - 1.62 * B, g - 1.95 * B, 3.24 * B, 0.06 * B);
    ctx.fillStyle = sh(DOOR, dep); ctx.fillRect(x - 0.2 * B, g - 1.4 * B, 0.4 * B, 0.9 * B);
    ctx.fillStyle = sh(dim(body, 0.9), dep);
    for (let i = 0; i < 4; i++) { const cx = x - 0.55 * B + i * 0.37 * B; if (Math.abs(cx - x) > 0.15 * B) ctx.fillRect(cx - 0.05 * B, g - 1.5 * B, 0.1 * B, 1.05 * B); }
    ctx.fillStyle = sh(dim(body, 0.7), dep); ctx.fillRect(x - 2.6 * B, g - 0.62 * B, 5.2 * B, 0.12 * B);
    for (let i = 0; i < 9; i++) ctx.fillRect(x - 2.5 * B + i * 0.62 * B, g - 0.95 * B, 0.08 * B, 0.33 * B);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, g - 2 * B, 2.2 * B, 0.08 + 0.18 * W.dusk + 0.12 * nightK());
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = e._a == null ? 1 : e._a;
  }
  // ── 凯撒利亚的公厅：台、三个座位、后面的柱廊与幔子 ─────────────
  function hallG() {
    const r = X('hall'), B = BU(), x0 = r[0] * W.w, x1 = r[1] * W.w;
    const g = gYb((x0 + x1) / 2) + 0.08 * B, dx0 = lerp(x0, x1, tall() ? 0.36 : 0.4), dh = 0.36 * B;
    const seats = [0.3, 0.55, 0.8].map(t => lerp(dx0 + 0.3 * B, x1 - 0.3 * B, t));
    return { x0, x1, g, B, dx0, dh, seats, H: 2.5 * B };
  }
  const seatPt = i => { const G = hallG(); return [G.seats[i], G.g - G.dh + 0.02 * G.B]; };
  function bHall(ctx) {
    const G = hallG(), B = G.B, dep = 0.04, sunL = litX() < (G.x0 + G.x1) / 2;
    // 后墙与柱廊
    ctx.fillStyle = sh([206, 190, 160], dep); ctx.fillRect(G.x0, G.g - G.H, G.x1 - G.x0, G.H + 0.3 * B);
    ctx.fillStyle = sh([176, 160, 132], dep); ctx.fillRect(G.x0, G.g - G.H * 0.35, G.x1 - G.x0, G.H * 0.35 + 0.3 * B);
    ctx.fillStyle = sh([150, 46, 52], dep, 1, -0.02);                  // 座后的幔子
    ctx.fillRect(G.dx0 + 0.1 * B, G.g - G.H * 0.82, G.x1 - G.dx0 - 0.3 * B, G.H * 0.66);
    ctx.fillStyle = sh(MARBLE, dep);
    const n = 7, pw = Math.max(1.4, 0.16 * B);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = lerp(G.x0 + 0.15 * B, G.x1 - 0.15 * B, i / (n - 1)); ctx.rect(x - pw / 2, G.g - G.H, pw, G.H); }
    ctx.fill();
    ctx.fillStyle = sh(MARBLE, dep); ctx.fillRect(G.x0 - 0.1 * B, G.g - G.H - 0.3 * B, G.x1 - G.x0 + 0.2 * B, 0.32 * B);
    ctx.fillStyle = sh(TILE, dep);
    ctx.beginPath(); ctx.moveTo(G.x0 - 0.2 * B, G.g - G.H - 0.3 * B); ctx.lineTo(G.x0 + 0.3 * B, G.g - G.H - 0.75 * B); ctx.lineTo(G.x1 - 0.3 * B, G.g - G.H - 0.75 * B); ctx.lineTo(G.x1 + 0.2 * B, G.g - G.H - 0.3 * B); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh(GOLD, dep, 0.8, 0.1); ctx.fillRect(G.x0, G.g - G.H - 0.06 * B, G.x1 - G.x0, 0.04 * B);
    // 台
    ctx.fillStyle = sh(MARBLE_D, dep); ctx.fillRect(G.dx0, G.g - G.dh, G.x1 - G.dx0, G.dh + 0.3 * B);
    ctx.fillStyle = sh(MARBLE, dep); ctx.fillRect(G.dx0 - 0.05 * B, G.g - G.dh - 0.05 * B, G.x1 - G.dx0 + 0.1 * B, 0.07 * B);
    // 三个座位（高背）
    for (const sx of G.seats) {
      ctx.fillStyle = sh(CEDAR, dep); ctx.fillRect(sx - 0.26 * B, G.g - G.dh - 0.95 * B, 0.1 * B, 0.95 * B);
      ctx.fillStyle = sh(GOLD, dep, 0.9, 0.08); ctx.fillRect(sx - 0.28 * B, G.g - G.dh - 1.0 * B, 0.14 * B, 0.06 * B);
      ctx.fillStyle = sh(CEDAR, dep); ctx.fillRect(sx - 0.26 * B, G.g - G.dh - 0.4 * B, 0.46 * B, 0.08 * B);
    }
    ctx.strokeStyle = sh(lit(MARBLE), dep, rimA(), 0.08); ctx.lineWidth = Math.max(0.5, 0.035 * B);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = lerp(G.x0 + 0.15 * B, G.x1 - 0.15 * B, i / (n - 1)) + (sunL ? -pw / 2 : pw / 2); ctx.moveTo(x, G.g - G.dh); ctx.lineTo(x, G.g - G.H); }
    ctx.stroke();
  }
  // 公厅的里面：昏暗（画在人之前——人仍是看得清的剪影），两盏油灯立在柱间
  const hallLampXs = G => [lerp(G.x0, G.x1, 0.1), lerp(G.x0, G.x1, 0.37), lerp(G.x0, G.x1, 0.985)];
  function drawHallDark(ctx) {
    const d = L('jyDark') * (S.place === 'caesarea' ? clamp(L('jyPlace'), 0, 1) : 0);
    if (d < 0.01) return;
    const G = hallG(), B = G.B, top = G.g - G.H, hh = G.H + 0.3 * B;
    ctx.globalAlpha = 1;
    ctx.fillStyle = rgba([18, 14, 18], 0.66 * d);
    ctx.fillRect(G.x0 - 0.1 * B, top, G.x1 - G.x0 + 0.2 * B, hh);
    ctx.fillStyle = rgba([8, 6, 10], 0.3 * d);
    ctx.fillRect(G.x0 - 0.1 * B, top, G.x1 - G.x0 + 0.2 * B, G.H * 0.45);
    // 油灯：灯台、灯盏、火苗
    const fl = 0.9 + 0.1 * Math.sin(S.clock * 7.3) * Math.sin(S.clock * 4.1);
    for (const lx of hallLampXs(G)) {
      const ly = G.g - 1.25 * B;
      ctx.strokeStyle = sh([120, 96, 60], 0.04, d); ctx.lineWidth = Math.max(0.8, 0.05 * B);
      ctx.beginPath(); ctx.moveTo(lx, G.g + 0.02 * B); ctx.lineTo(lx, ly); ctx.moveTo(lx - 0.16 * B, G.g + 0.02 * B); ctx.lineTo(lx, G.g - 0.2 * B); ctx.lineTo(lx + 0.16 * B, G.g + 0.02 * B); ctx.stroke();
      ctx.fillStyle = sh([176, 132, 70], 0.04, d); ctx.beginPath(); ctx.ellipse(lx, ly, 0.13 * B, 0.05 * B, 0, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([255, 214, 130], 0.95 * d); ctx.beginPath(); ctx.ellipse(lx, ly - 0.08 * B, 0.035 * B, 0.08 * B * fl, 0, 0, TAU); ctx.fill();
      glow(ctx, 'g', lx, ly - 0.1 * B, 1.5 * B * fl, 0.5 * d);
      glow(ctx, 'w', lx, ly - 0.08 * B, 0.14 * B, 0.9 * d);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 公厅里的昏暗，与「比日头还亮的光」；末了公厅满了光
  function drawHallLight(ctx) {
    const d = L('jyDark'), nn = L('jyNoon'), lt = L('jyHallLit');
    if (d < 0.01 && nn < 0.01 && lt < 0.01) return;
    const G = hallG(), B = G.B;
    if (d > 0.01) {
      const cx = (G.x0 + G.x1) / 2 - 0.4 * B, cy = G.g - G.H * 0.45;
      glow(ctx, 'k', cx, cy, (G.x1 - G.x0) * 0.85, 0.3 * d, G.H * 1.1);
    }
    if (lt > 0.01) {
      // 暖光灌满公厅：柱子、幔子、台都亮起来
      ctx.globalCompositeOperation = 'lighter';
      glow(ctx, 'g', (G.x0 + G.x1) / 2, G.g - G.H * 0.45, (G.x1 - G.x0) * 0.72, 0.5 * lt, G.H * 0.85);
      glow(ctx, 'r', (G.x0 + G.x1) / 2, G.g - G.H * 0.5, (G.x1 - G.x0) * 0.55, 0.3 * lt, G.H * 0.6);
      const n = 7, pw = Math.max(1.4, 0.16 * B);
      ctx.globalAlpha = 1;
      ctx.fillStyle = rgba([255, 230, 176], 0.3 * lt);
      for (let i = 0; i < n; i++) { const x = lerp(G.x0 + 0.15 * B, G.x1 - 0.15 * B, i / (n - 1)); ctx.fillRect(x - pw / 2, G.g - G.H, pw, G.H - G.dh); }
      ctx.fillStyle = rgba([255, 176, 120], 0.2 * lt);
      ctx.fillRect(G.dx0 + 0.1 * B, G.g - G.H * 0.82, G.x1 - G.dx0 - 0.3 * B, G.H * 0.66);
      ctx.fillStyle = rgba([255, 236, 190], 0.22 * lt);
      ctx.fillRect(G.x0 - 0.1 * B, G.g - G.H - 0.3 * B, G.x1 - G.x0 + 0.2 * B, 0.32 * B);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (nn > 0.01) {
      const f = fpos('paul'); if (!f) return;
      ctx.globalCompositeOperation = 'lighter';
      beam(ctx, f.x, -10, f.y + 4, f.h * 5, 0.5 * nn);
      glow(ctx, 'w', f.x, f.y - f.h * 0.5, f.h * 3.4, 0.45 * nn);
      glow(ctx, 'r', (G.x0 + G.x1) / 2, G.g - G.H * 0.5, (G.x1 - G.x0) * 0.8, 0.3 * nn, G.H);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // ── 腓立比城外的河 ───────────────────────────────────────────
  const RIVER_L = [[1.03, 0.26], [0.88, 0.36], [0.76, 0.42], [0.64, 0.47], [0.52, 0.6], [0.41, 0.95]];
  const RIVER_P = [[1.03, 0.24], [0.86, 0.36], [0.7, 0.44], [0.56, 0.56], [0.44, 0.9]];
  function riverPts() {
    const P = tall() ? RIVER_P : RIVER_L, out = [];
    for (let i = 0; i < P.length - 1; i++) for (let k = 0; k < 6; k++) {
      const t = k / 6, x = lerp(P[i][0], P[i + 1][0], t), v = lerp(P[i][1], P[i + 1][1], t);
      out.push([x * W.w, fieldY(Math.min(1, x), v), v]);
    }
    const q = P[P.length - 1]; out.push([q[0] * W.w, fieldY(q[0], q[1]), q[1]]);
    return out;
  }
  function riverYAt(xf) {
    const P = tall() ? RIVER_P : RIVER_L;
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1];
      if ((xf <= a[0] && xf >= b[0])) { const t = (a[0] - xf) / (a[0] - b[0]); return lerp(a[1], b[1], t); }
    }
    return 0.5;
  }
  function bRiver(ctx) {
    const pts = riverPts(), B = BU();
    const wd = p => (0.16 + 0.34 * p[2]) * B;
    const water = mix([46, 84, 118], [150, 186, 214], W.daylight * 0.6);
    ctx.fillStyle = sh([96, 120, 70], 0.03);
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - wd(p) - 0.08 * B) : ctx.moveTo(p[0], p[1] - wd(p) - 0.08 * B)));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + wd(pts[i]) + 0.08 * B);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(W.shade(water, 0.02), 1);
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] - wd(p)) : ctx.moveTo(p[0], p[1] - wd(p))));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + wd(pts[i]));
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba([236, 244, 252], 0.35 * (0.3 + 0.7 * W.daylight)); ctx.lineWidth = Math.max(0.6, 0.03 * B);
    ctx.beginPath();
    for (let i = 0; i < pts.length - 1; i += 2) {
      const p = pts[i], ph = U.fract(S.clock * 0.15 + i * 0.37);
      const q = pts[Math.min(pts.length - 1, i + 1)];
      ctx.moveTo(lerp(p[0], q[0], ph), lerp(p[1], q[1], ph) + (hsh(i) - 0.5) * wd(p)); ctx.lineTo(lerp(p[0], q[0], ph + 0.4), lerp(p[1], q[1], ph + 0.4) + (hsh(i) - 0.5) * wd(p));
    }
    ctx.stroke();
  }
  // 吕底亚家门前晾着的紫色布疋
  function bCloths(ctx) {
    const hx = X('lhouse') * W.w, B = BU(), x0 = hx - (tall() ? 1.6 : 2.4) * B, x1 = hx - (tall() ? 0.9 : 1.1) * B;
    const g0 = gYb(x0) + 0.05 * B, g1 = gYb(x1) + 0.05 * B, ph = 1.45 * B;
    ctx.strokeStyle = sh(WOOD_D, 0.04); ctx.lineWidth = Math.max(0.8, 0.05 * B);
    ctx.beginPath(); ctx.moveTo(x0, g0); ctx.lineTo(x0, g0 - ph); ctx.moveTo(x1, g1); ctx.lineTo(x1, g1 - ph); ctx.stroke();
    ctx.strokeStyle = sh([70, 60, 50], 0.04, 0.8); ctx.lineWidth = Math.max(0.5, 0.02 * B);
    ctx.beginPath(); ctx.moveTo(x0, g0 - ph * 0.95); ctx.quadraticCurveTo((x0 + x1) / 2, g0 - ph * 0.86, x1, g1 - ph * 0.95); ctx.stroke();
    const n = 3;
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n, cx = lerp(x0, x1, t), top = lerp(g0, g1, t) - ph * 0.9, w = (x1 - x0) / n * 0.8, h = 0.8 * B * (0.8 + 0.3 * hsh(i + 5));
      const sway = Math.sin(S.clock * 1.3 + i * 1.7) * 0.06 * B;
      ctx.fillStyle = sh(i % 2 ? PURPLE : PURPLE_L, 0.04, 1, 0.04);
      ctx.beginPath(); ctx.moveTo(cx - w / 2, top); ctx.lineTo(cx + w / 2, top); ctx.lineTo(cx + w / 2 + sway, top + h); ctx.lineTo(cx - w / 2 + sway, top + h * 0.94); ctx.closePath(); ctx.fill();
    }
  }
  // ── 马耳他：沙岸、礁石、火 ─────────────────────────────────────
  function bBeach(ctx) {
    const r = X('beach'), B = BU(), x0 = r[0] * W.w, x1 = r[1] * W.w, N = 16;
    ctx.fillStyle = sh(SAND, 0.03);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(x0 - 0.5 * B, x1, i / N); const y = gY(x) - 0.03 * B; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(x0 - 1.2 * B, x1 - 0.6 * B, i / N); ctx.lineTo(x, fieldY(clamp(x / W.w, 0, 1), 0.34 * (1 - Math.abs(i / N - 0.5)))); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh([120, 112, 100], 0.03);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const x = lerp(x0, x1, hsh(i + 60)), y = gY(x) + (0.1 + 0.3 * hsh(i + 70)) * B, r0 = (0.12 + 0.15 * hsh(i + 80)) * B; ctx.moveTo(x + r0, y); ctx.ellipse(x, y, r0, r0 * 0.6, 0, 0, TAU); }
    ctx.fill();
  }
  function drawReef(ctx) {
    const P = X('reef'), u = shipU(), x = P[0] * W.w, y = P[1] * W.h;
    ctx.fillStyle = sh([58, 54, 50], 0.1);
    ctx.beginPath();
    const rocks = [[-2.8, 0.3, 0.5], [-1.9, 0.5, 0.35], [2.2, 0.35, 0.45], [3.1, 0.2, 0.6], [0.5, 0.55, 0.3]];
    for (const r of rocks) { const rx = x + r[0] * u, ry = y + r[1] * u * 0.3; ctx.moveTo(rx - r[2] * u, ry); ctx.quadraticCurveTo(rx - r[2] * u * 0.5, ry - r[2] * u * 0.7, rx, ry - r[2] * u * 0.55); ctx.quadraticCurveTo(rx + r[2] * u * 0.6, ry - r[2] * u * 0.6, rx + r[2] * u, ry); ctx.closePath(); }
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba([226, 236, 248], 0.35 + 0.25 * Math.sin(S.clock * 2)); ctx.lineWidth = Math.max(0.6, 0.04 * u);
    ctx.beginPath();
    for (const r of rocks) { const rx = x + r[0] * u, ry = y + r[1] * u * 0.3; ctx.moveTo(rx - r[2] * u * 1.2, ry + 0.02 * u); ctx.quadraticCurveTo(rx, ry + (0.08 + 0.04 * Math.sin(S.clock * 3 + r[0])) * u, rx + r[2] * u * 1.2, ry + 0.02 * u); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }
  function fireG() { const x = X('fire') * W.w, B = BU(); return { x, y: fieldY(X('fire'), 0.12), B }; }
  function drawFire(ctx) {
    const k = L('jyFire'); if (k < 0.01) return;
    const G = fireG(), B = G.B;
    ctx.globalAlpha = Math.min(1, k * 1.5);
    ctx.strokeStyle = sh([70, 50, 34], 0.03); ctx.lineWidth = Math.max(1.2, 0.08 * B); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(G.x - 0.4 * B, G.y); ctx.lineTo(G.x + 0.35 * B, G.y - 0.1 * B); ctx.moveTo(G.x - 0.3 * B, G.y - 0.12 * B); ctx.lineTo(G.x + 0.4 * B, G.y + 0.02 * B); ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.globalCompositeOperation = 'lighter';
    const rain = 1 - 0.3 * (W.lv.rain || 0);
    for (let i = 0; i < 6; i++) {
      const ph = S.clock * (3 + i * 0.7) + i * 1.3, fh = (0.45 + 0.35 * Math.sin(ph) * 0.5 + 0.2 * hsh(i)) * B * k * rain;
      const fx0 = G.x + (i - 2.5) * 0.09 * B;
      ctx.fillStyle = rgba(i % 2 ? [255, 150, 60] : [255, 206, 110], 0.55 * k);
      ctx.beginPath(); ctx.moveTo(fx0 - 0.1 * B, G.y - 0.05 * B); ctx.quadraticCurveTo(fx0 - 0.06 * B, G.y - fh * 0.6, fx0 + Math.sin(ph) * 0.04 * B, G.y - fh); ctx.quadraticCurveTo(fx0 + 0.07 * B, G.y - fh * 0.5, fx0 + 0.1 * B, G.y - 0.05 * B); ctx.closePath(); ctx.fill();
    }
    glow(ctx, 'f', G.x, G.y - 0.3 * B, 2.6 * B, 0.5 * k);
    glow(ctx, 'g', G.x, G.y - 0.2 * B, 1.1 * B, 0.6 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  各处的布景（近地 near、中丘 mid；横屏 / 竖屏各一套）
  // ════════════════════════════════════════════════════════════
  const PLACE_NAME = {
    antioch: '安提阿', cyprus: '塞浦路斯', galatia: '彼西底的安提阿', lystra: '路司得', troas: '特罗亚', philippi: '腓立比', prison: '腓立比的监',
    athens: '雅典', corinth: '哥林多', miletus: '米利都', jerusalem: '耶路撒冷', caesarea: '凯撒利亚', crete: '大海', malta: '马耳他', rome: '罗马',
  };
  const PCACHE = {};
  function placeDef(key) {
    const P = tall(), ck = key + (P ? 'P' : 'L');
    if (PCACHE[ck]) return PCACHE[ck];
    let d = { mid: [], near: [] };
    const acro = { k: 'mesa', l: 1, x0: P ? 0.66 : 0.7, x1: P ? 0.99 : 0.94, h: 1.5 };
    const corM = { k: 'mesa', l: 1, x0: P ? 0.7 : 0.74, x1: P ? 1.02 : 0.99, h: 2.2, peak: true, c: [138, 132, 116] };
    switch (key) {
      case 'antioch': d = {
        mid: [{ k: 'town', x0: P ? 0.55 : 0.58, x1: P ? 0.97 : 0.86, seed: 3, tile: true }, { k: 'tree', t: 'palm', l: 1, x: P ? 0.6 : 0.9, s: 0.9 }],
        near: P ? [{ k: 'quay' }, { k: 'house', x: 0.8, w: 1.8, h: 1.5, door: 0.5, win: 1 }, { k: 'house', x: 0.95, w: 1.4, h: 1.9, roof: 'tile', c: OCHRE, win: 1 }]
          : [{ k: 'quay' }, { k: 'house', x: 0.875, w: 1.9, h: 1.6, door: 0.5, win: 2 }, { k: 'house', x: 0.945, w: 1.6, h: 2.1, roof: 'tile', door: 0.3, win: 1, c: OCHRE }, { k: 'tree', t: 'palm', x: 0.995, s: 1.1 }],
      }; break;
      case 'cyprus': d = {
        mid: [{ k: 'town', x0: 0.6, x1: 0.8, seed: 7 }, { k: 'tree', t: 'cypress', l: 1, x: 0.86, s: 0.9 }, { k: 'tree', t: 'cypress', l: 1, x: 0.9, s: 0.7 }],
        near: P ? [{ k: 'quay' }, { k: 'house', x: 0.8, w: 1.7, h: 1.3, win: 1 }, { k: 'temple', x: 0.94, w: 2.1, h: 1.9, n: 4 }]
          : [{ k: 'quay' }, { k: 'house', x: 0.82, w: 1.8, h: 1.3, win: 1 }, { k: 'house', x: 0.895, w: 2, h: 1.7, roof: 'tile', door: 0.5, win: 1 }, { k: 'temple', x: 0.975, w: 2.2, h: 2, n: 4 }],
      }; break;
      case 'galatia': d = {
        mid: [{ k: 'town', x0: 0.55, x1: 0.97, seed: 11, hk: 0.6 }],
        near: P ? [{ k: 'house', x: 0.5, w: 1.3, h: 1.2, win: 1 }, { k: 'house', x: 0.66, w: 2.4, h: 2.0, roof: 'tile', door: 0.5, win: 2, c: LIME_D }, { k: 'wall', x0: 0.84, x1: 1.02, gate: 0.93, h: 1.4 }]
          : [{ k: 'house', x: 0.53, w: 1.6, h: 1.3, win: 1 }, { k: 'house', x: 0.665, w: 3.0, h: 2.1, roof: 'tile', door: 0.5, win: 3, c: LIME_D }, { k: 'house', x: 0.775, w: 1.8, h: 1.5, win: 1 }, { k: 'wall', x0: 0.84, x1: 1.02, gate: 0.9, h: 1.4 }],
      }; break;
      case 'lystra': d = {
        mid: [{ k: 'town', x0: 0.6, x1: 0.95, seed: 17, hk: 0.7 }],
        near: P ? [{ k: 'temple', x: 0.5, w: 2.2, h: 2, n: 4, c: MARBLE_D }, { k: 'wall', x0: 0.8, x1: 1.02, gate: 0.88, h: 1.4 }]
          : [{ k: 'temple', x: 0.575, w: 2.8, h: 2.3, n: 4, c: MARBLE_D }, { k: 'wall', x0: 0.81, x1: 1.02, gate: 0.865, h: 1.45, towers: [0.975] }],
      }; break;
      case 'troas': d = {
        mid: [],
        near: P ? [{ k: 'quay' }, { k: 'house', x: 0.8, w: 1.6, h: 1.4, win: 1, lamp: 1 }, { k: 'house', x: 0.94, w: 1.5, h: 1.8, roof: 'tile', win: 1, lamp: 0.8 }]
          : [{ k: 'quay' }, { k: 'house', x: 0.86, w: 1.7, h: 1.4, win: 1, lamp: 1 }, { k: 'house', x: 0.93, w: 2, h: 1.8, roof: 'tile', win: 2, lamp: 1 }, { k: 'house', x: 0.99, w: 1.4, h: 1.3, win: 1, lamp: 0.7 }],
      }; break;
      case 'philippi': case 'prison': d = {
        mid: [{ k: 'wall', l: 1, x0: P ? 0.62 : 0.66, x1: P ? 1.0 : 0.96, gate: P ? 0.8 : 0.78, h: 1.3 }, { k: 'town', x0: P ? 0.66 : 0.7, x1: P ? 0.98 : 0.94, seed: 21, tile: true, hk: 0.8 }],
        near: key === 'prison'
          ? (P ? [{ k: 'prison' }] : [{ k: 'prison' }, { k: 'house', x: X('jhouse') || 0.965, w: 1.3, h: 1.5, door: 0.3, win: 1, lamp: 1, roof: 'tile' }])
          : (P ? [{ k: 'river' }, { k: 'cloths' }, { k: 'house', x: 0.93, w: 1.4, h: 1.6, roof: 'tile', door: 0.3, win: 1 }]
            : [{ k: 'river' }, { k: 'cloths' }, { k: 'house', x: X('lhouse'), w: 1.9, h: 1.7, roof: 'tile', door: 0.28, win: 2 }, { k: 'tree', t: 'olive', x: 0.575, s: 0.9 }]),
      }; break;
      case 'athens': d = {
        mid: [acro, { k: 'temple', l: 1, x: P ? 0.83 : 0.82, w: P ? 3.6 : 4.4, h: 2.2, n: 8, onMesa: acro }, { k: 'town', x0: P ? 0.5 : 0.52, x1: P ? 0.66 : 0.7, seed: 31 }],
        near: P ? [{ k: 'stoa', x0: 0.42, x1: 0.53, h: 1.8 }, { k: 'idol', x: 0.47, arm: true }, { k: 'idol', x: 0.54, spear: true, c: MARBLE_D }, { k: 'altar' }, { k: 'rock' }, { k: 'idol', x: 0.66, s: 1.1, arm: true }, { k: 'tree', t: 'cypress', x: 0.97, s: 0.9 }]
          : [{ k: 'stoa', x0: 0.49, x1: 0.61, h: 1.9 }, { k: 'idol', x: 0.535, arm: true }, { k: 'idol', x: 0.585, spear: true, c: MARBLE_D }, { k: 'altar' }, { k: 'idol', x: 0.698, s: 1.15, arm: true }, { k: 'rock' }, { k: 'tree', t: 'cypress', x: 0.93, s: 1 }, { k: 'tree', t: 'cypress', x: 0.965, s: 0.8 }],
      }; break;
      case 'corinth': d = {
        mid: [corM, { k: 'temple', l: 1, x: P ? 0.87 : 0.87, w: 1.8, h: 1.3, n: 4, onMesa: corM, peak: true }, { k: 'town', x0: P ? 0.5 : 0.52, x1: P ? 0.72 : 0.74, seed: 41, tile: true, city: 0.15 }],
        near: P ? [{ k: 'tent', x: 0.52, w: 1.6 }, { k: 'tent', x: 0.62, w: 1.5, c: [96, 76, 62] }, { k: 'house', x: 0.77, w: 1.5, h: 1.6, roof: 'tile', win: 1, city: 0.2 }, { k: 'house', x: 0.92, w: 1.5, h: 1.9, win: 2, city: 0.5 }]
          : [{ k: 'tent', x: 0.62, w: 1.9 }, { k: 'tent', x: 0.695, w: 1.7, c: [96, 76, 62] }, { k: 'house', x: 0.79, w: 1.8, h: 1.6, roof: 'tile', door: 0.5, win: 2, city: 0.1 }, { k: 'house', x: 0.87, w: 1.6, h: 2.0, win: 2, city: 0.35 }, { k: 'house', x: 0.95, w: 1.9, h: 1.5, roof: 'tile', win: 2, city: 0.6 }],
      }; break;
      case 'miletus': d = {
        mid: [{ k: 'town', x0: 0.56, x1: 0.8, seed: 51 }, { k: 'tree', t: 'cypress', l: 1, x: 0.84, s: 0.8 }],
        near: P ? [{ k: 'quay' }, { k: 'house', x: 0.74, w: 1.3, h: 1.3, win: 1 }, { k: 'stoa', x0: 0.84, x1: 1.02, h: 1.7, tile: true }]
          : [{ k: 'quay' }, { k: 'house', x: 0.8, w: 1.4, h: 1.4, win: 1 }, { k: 'stoa', x0: 0.86, x1: 1.02, h: 1.8, tile: true }],
      }; break;
      case 'jerusalem': d = {
        mid: [{ k: 'wall', l: 1, x0: P ? 0.5 : 0.52, x1: P ? 0.98 : 0.86, h: 1.2, towers: P ? [0.58] : [0.56, 0.8] }, { k: 'templeJ', x: P ? 0.74 : 0.68 }, { k: 'town', x0: P ? 0.86 : 0.86, x1: P ? 1.0 : 0.99, seed: 61 }],
        near: P ? [{ k: 'fort' }] : [{ k: 'house', x: 0.53, w: 1.5, h: 1.3, win: 1 }, { k: 'fort' }],
      }; break;
      case 'caesarea': d = {
        mid: [{ k: 'beacon', l: 1, x: P ? 0.53 : 0.525, h: 2.4 }, { k: 'town', x0: 0.6, x1: 0.95, seed: 71, tile: true }, { k: 'temple', l: 1, x: P ? 0.82 : 0.78, w: 2.6, h: 1.8, n: 6 }],
        near: [{ k: 'quay' }, { k: 'hall' }],
      }; break;
      case 'crete': d = { mid: [], near: [] }; break;
      case 'malta': d = {
        mid: [{ k: 'tree', t: 'olive', l: 1, x: 0.7, s: 0.8 }, { k: 'tree', t: 'olive', l: 1, x: 0.86, s: 0.7 }],
        near: P ? [{ k: 'beach' }, { k: 'house', x: X('pub'), w: 1.3, h: 1.3, door: 0.3, win: 1 }] : [{ k: 'beach' }, { k: 'house', x: X('pub'), w: 1.7, h: 1.4, door: 0.3, win: 1, c: [214, 196, 160] }, { k: 'tree', t: 'olive', x: 0.975, s: 1 }],
      }; break;
      case 'rome': d = {
        mid: P ? [{ k: 'aqueduct', x0: 0.49, x1: 0.64, h: 1.2 }, { k: 'town', x0: 0.62, x1: 1.0, seed: 81, tile: true, rome: true, hk: 1.2 }, { k: 'temple', l: 1, x: 0.78, w: 2.6, h: 2, n: 6, gold: true }, { k: 'tree', t: 'pine', l: 1, x: 0.95, s: 0.9 }]
          : [{ k: 'aqueduct', x0: 0.5, x1: 0.68, h: 1.3 }, { k: 'town', x0: 0.66, x1: 1.0, seed: 81, tile: true, rome: true, hk: 1.2 }, { k: 'temple', l: 1, x: 0.75, w: 3, h: 2.1, n: 6, gold: true }, { k: 'temple', l: 1, x: 0.9, w: 2.4, h: 1.8, n: 4 }, { k: 'tree', t: 'pine', l: 1, x: 0.62, s: 1 }, { k: 'tree', t: 'cypress', l: 1, x: 0.84, s: 0.9 }],
        near: P ? [{ k: 'quay' }, { k: 'house', x: X('rhouse'), w: 1.8, h: 1.7, roof: 'tile', door: 0.35, win: 1, open: 'jyOpen', rome: true }, { k: 'house', x: 0.96, w: 1.3, h: 2.1, roof: 'tile', win: 1, rome: true }]
          : [{ k: 'quay' }, { k: 'house', x: X('rhouse'), w: 2.2, h: 1.8, roof: 'tile', door: 0.33, win: 2, open: 'jyOpen', rome: true }, { k: 'house', x: 0.935, w: 1.7, h: 2.2, roof: 'tile', win: 2, rome: true, c: OCHRE }, { k: 'tree', t: 'pine', x: 0.99, s: 1.1 }],
      }; break;
      default: break;
    }
    PCACHE[ck] = d;
    return d;
  }
  const DRAW = {
    house: bHouse, temple: bTemple, stoa: bStoa, wall: bWall, idol: bIdol, tent: bTent, tree: bTree, town: bTown, mesa: bMesa, beacon: bBeacon,
    aqueduct: bAqueduct, templeJ: bTempleJ, altar: bAltar, rock: bRock, quay: bQuay, prison: bPrison, fort: bFort, hall: bHall, river: bRiver,
    cloths: bCloths, beach: bBeach,
  };
  function drawEls(ctx, list, a) {
    for (const e of list) {
      const f = DRAW[e.k]; if (!f) continue;
      e._a = a;
      ctx.globalAlpha = a;
      safe('jy.el.' + e.k, () => f(ctx, e));
    }
    ctx.globalAlpha = 1;
  }
  function placeAlpha() { return { cur: clamp(L('jyPlace'), 0, 1), prev: S.prev ? clamp(1 - L('jyPlace'), 0, 1) : 0 }; }
  function drawPlaces(ctx, pass) {
    const A = placeAlpha();
    if (S.prev && A.prev > 0.01) drawEls(ctx, placeDef(S.prev)[pass] || [], A.prev);
    if (A.cur > 0.01) drawEls(ctx, placeDef(S.place)[pass] || [], A.cur);
  }
  function drawWindowGlows(ctx) {
    if (nightK() < 0.05 && L('jyAll') < 0.05) return;
    const A = placeAlpha();
    ctx.globalCompositeOperation = 'lighter';
    for (const [key, a] of [[S.prev, A.prev], [S.place, A.cur]]) {
      if (!key || a < 0.05) continue;
      for (const e of placeDef(key).near) if (e.k === 'house') safe('jy.lamps', () => { lampGlows(ctx, e); });
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  船（有方帆的大船：船尾高翘如鹅颈，船头有斜桅与小帆）
  // ════════════════════════════════════════════════════════════
  const shipU = () => H2() * X('shipK');
  function spot(name) { const s = X(name); return s && s.length ? s : X('moor'); }
  function shipPos() {
    const A = spot(S.shipA), B = spot(S.shipB), e = ease(L('jyShip'));
    return { x: lerp(A[0], B[0], e) * W.w, y: lerp(A[1], B[1], e) * W.h };
  }
  function shipRoll() {
    const g = L('jyStorm'), c = S.clock, k = 1 - L('jyWreck');
    return {
      roll: (Math.sin(c * 1.1) * 0.01 + g * (Math.sin(c * 1.9) * 0.085 + Math.sin(c * 3.1) * 0.03)) * k,
      bob: (Math.sin(c * 1.4) * 0.012 + g * Math.sin(c * 2.5) * 0.09) * k,
    };
  }
  const wreckTilt = () => -S.shipDir * 0.085 * ease(L('jyWreck'));
  // 甲板上的位子（以船长的单位 u 自船中量向船头）
  const SLOTS = { stern: -1.85, a: -1.25, b: -0.68, f: -0.1, c: 0.62, d: 1.15, e: 1.68, g: 2.15 };
  function deckPt(slot) {
    const P = shipPos(), u = shipU(), R = shipRoll(), s = SLOTS[slot] != null ? SLOTS[slot] : 0, d = S.shipDir;
    const x = P.x + d * s * u;
    const y = P.y + R.bob * u - 0.5 * u + d * s * u * Math.sin(R.roll + wreckTilt());
    return [x, y];
  }
  const deckFn = slot => () => deckPt(slot);
  function board(id, slot) {
    const c = C(); if (!c || !c.get(id)) return;
    S.aboard[id] = String(slot);
    c.attach(id, deckFn(slot));
    const p = c.get(id);
    p.nx = deckPt(slot)[0] / W.w; p.tx = null; p.fly = null; p.ny = null;
    if (p.pose === 'walk' || p.pose === 'run') c.pose(id, 'stand');
  }
  function unboard(id, x, b) {
    const c = C(); if (!c || !c.get(id)) return;
    delete S.aboard[id];
    c.attach(id, null);
    c.place(id, x);
    const p = c.get(id); if (p) { p.ny = null; if (!inst(b)) p.emerge = 1; }
  }
  const anyAboard = () => { for (const k in S.aboard) if (has(k)) return true; return false; };
  function shipTo(name, b) {
    S.shipA = S.shipB; S.shipB = name;
    const A = spot(S.shipA), B = spot(S.shipB);
    if (Math.abs(B[0] - A[0]) > 1e-4) S.shipDir = B[0] > A[0] ? 1 : -1;
    W.set('jyShip', 0, true);
    lv('jyShip', 1, b);
  }
  function shipAt(name, dir) { S.shipA = S.shipB = name; if (dir) S.shipDir = dir; W.set('jyShip', 1, true); }
  function shipVisible() { const P = shipPos(), u = shipU(); return L('jyShipA') > 0.01 && P.x > -4 * u && P.x < W.w + 4 * u; }
  function hullPath(ctx, u) {
    ctx.beginPath();
    ctx.moveTo(-2.6 * u, -0.8 * u);
    ctx.lineTo(2.45 * u, -0.8 * u);
    ctx.quadraticCurveTo(2.72 * u, -0.84 * u, 2.86 * u, -1.08 * u);
    ctx.lineTo(2.98 * u, -1.02 * u);
    ctx.quadraticCurveTo(2.86 * u, -0.22 * u, 2.1 * u, 0.1 * u);
    ctx.lineTo(-2.05 * u, 0.1 * u);
    ctx.quadraticCurveTo(-2.75 * u, -0.08 * u, -2.9 * u, -0.74 * u);
    ctx.closePath();
  }
  // 搁浅之后，船尾（x < −0.9u）断开、被浪冲歪
  function wreckParts(ctx, u, fn) {
    const w = ease(L('jyWreck'));
    if (w < 0.01) { fn(); return; }
    const bx = -0.9 * u;
    ctx.save(); ctx.beginPath(); ctx.rect(bx, -8 * u, 12 * u, 12 * u); ctx.clip(); fn(); ctx.restore();
    ctx.save();
    ctx.translate(bx, 0); ctx.translate(-0.28 * u * w, 0.3 * u * w); ctx.rotate(0.16 * w); ctx.translate(-bx, 0);
    ctx.beginPath(); ctx.rect(-8 * u, -8 * u, 8 * u + bx, 12 * u); ctx.clip();
    fn();
    ctx.restore();
  }
  function shipXform(ctx) {
    const P = shipPos(), u = shipU(), R = shipRoll();
    ctx.translate(P.x, P.y + R.bob * u);
    ctx.rotate(R.roll + wreckTilt());
    ctx.scale(S.shipDir, 1);
    return u;
  }
  // 船的后半（画在人之前）：远侧的船舷内壁、船尾的舱、桅、帆、绳
  function drawShipBack(ctx) {
    if (!shipVisible()) return;
    const A = L('jyShipA'), sail = L('jySail'), w = ease(L('jyWreck'));
    ctx.save();
    const u = shipXform(ctx);
    ctx.globalAlpha = A;
    wreckParts(ctx, u, () => {
      ctx.fillStyle = sh(WOOD_D, 0.05, 1, -0.05);
      ctx.beginPath(); ctx.moveTo(-2.55 * u, -0.8 * u); ctx.lineTo(2.4 * u, -0.8 * u); ctx.lineTo(2.35 * u, -0.9 * u); ctx.lineTo(-2.5 * u, -0.9 * u); ctx.closePath(); ctx.fill();
      // 船尾的舱
      ctx.fillStyle = sh(WOOD_L, 0.05); ctx.fillRect(-2.4 * u, -1.32 * u, 0.95 * u, 0.55 * u);
      ctx.fillStyle = sh(WOOD_D, 0.05); ctx.fillRect(-2.5 * u, -1.4 * u, 1.15 * u, 0.1 * u);
      ctx.fillStyle = sh(DOOR, 0.05); ctx.fillRect(-1.85 * u, -1.18 * u, 0.22 * u, 0.3 * u);
      // 鹅颈似的船尾柱
      ctx.strokeStyle = sh(WOOD, 0.05); ctx.lineWidth = Math.max(1.2, 0.16 * u); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-2.72 * u, -0.6 * u); ctx.quadraticCurveTo(-3.15 * u, -1.25 * u, -2.95 * u, -1.72 * u); ctx.quadraticCurveTo(-2.82 * u, -1.9 * u, -2.7 * u, -1.72 * u); ctx.stroke();
      ctx.lineCap = 'butt';
    });
    // 主桅（搁浅时歪斜）
    ctx.save();
    ctx.translate(0.2 * u, -0.8 * u); ctx.rotate(0.12 * w);
    ctx.fillStyle = sh(WOOD_D, 0.05); ctx.fillRect(-0.05 * u, -3.7 * u, 0.1 * u, 3.8 * u);
    const yard = -3.45 * u, bil = (0.1 + 0.25 * Math.max(W.lv.gale || 0, L('jyStorm'))) * sail;
    ctx.fillStyle = sh(WOOD, 0.05); ctx.fillRect(-1.75 * u, yard - 0.05 * u, 3.5 * u, 0.1 * u);
    if (sail > 0.02) {
      const hgt = 2.35 * u * sail;
      ctx.fillStyle = sh(SAIL, 0.05, 1, 0.06);
      ctx.beginPath();
      ctx.moveTo(-1.7 * u, yard); ctx.lineTo(1.7 * u, yard);
      ctx.quadraticCurveTo((1.7 + bil * 1.6) * u, yard + hgt * 0.5, 1.6 * u, yard + hgt);
      ctx.lineTo(-1.6 * u, yard + hgt);
      ctx.quadraticCurveTo((-1.7 + bil * 1.6) * u, yard + hgt * 0.5, -1.7 * u, yard);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = sh(STRIPE, 0.05, 0.75);
      ctx.fillRect(-1.66 * u, yard + hgt * 0.42, 3.3 * u, hgt * 0.1);
      ctx.strokeStyle = sh([176, 158, 128], 0.05, 0.6); ctx.lineWidth = Math.max(0.5, 0.025 * u);
      ctx.beginPath();
      for (let i = 1; i < 6; i++) { const x = (-1.7 + i * 0.57) * u; ctx.moveTo(x, yard + 0.02 * u); ctx.lineTo(x + bil * 0.5 * u, yard + hgt); }
      ctx.stroke();
    }
    if (sail < 0.98) {
      ctx.globalAlpha = A * (1 - sail);
      ctx.fillStyle = sh(SAIL, 0.05, 1, -0.05);
      ctx.beginPath(); ctx.ellipse(0, yard + 0.1 * u, 1.65 * u, 0.12 * u, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = A;
    }
    ctx.restore();
    // 船头的斜桅与小帆
    ctx.strokeStyle = sh(WOOD_D, 0.05); ctx.lineWidth = Math.max(0.8, 0.07 * u);
    ctx.beginPath(); ctx.moveTo(2.25 * u, -0.85 * u); ctx.lineTo(3.05 * u, -2.15 * u); ctx.stroke();
    const fore = Math.max(sail, L('jyWreck') > 0.01 ? 0 : 0) * (1 - w);
    if (fore > 0.05) {
      ctx.fillStyle = sh(SAIL, 0.05, 1, 0.03);
      ctx.beginPath(); ctx.moveTo(2.55 * u, -2.0 * u); ctx.lineTo(3.3 * u, -2.0 * u); ctx.lineTo(3.25 * u, -2.0 * u + 0.75 * u * fore); ctx.lineTo(2.6 * u, -2.0 * u + 0.75 * u * fore); ctx.closePath(); ctx.fill();
    }
    // 绳
    ctx.strokeStyle = sh([70, 56, 44], 0.05, 0.7); ctx.lineWidth = Math.max(0.5, 0.02 * u);
    ctx.beginPath();
    ctx.moveTo(0.2 * u, -4.4 * u); ctx.lineTo(2.9 * u, -1.0 * u);
    ctx.moveTo(0.2 * u, -4.4 * u); ctx.lineTo(-2.6 * u, -0.85 * u);
    ctx.moveTo(0.2 * u, -4.4 * u); ctx.lineTo(3.02 * u, -2.12 * u);
    ctx.stroke();
    // 船尾的灯
    const lk = lanternK();
    if (lk > 0.02) {
      ctx.fillStyle = rgba([255, 214, 140], 0.6 + 0.4 * lk);
      ctx.fillRect(-2.92 * u, -1.64 * u, 0.12 * u, 0.16 * u);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const lanternK = () => (L('jyShipA') > 0.05 ? Math.max(nightK(), W.lv.storm || 0) * L('jyShipA') * L('jyLantern') : 0);
  function lanternPt() {
    const P = shipPos(), u = shipU(), R = shipRoll(), a = R.roll + wreckTilt(), x = -2.86 * u * S.shipDir, y = -1.56 * u;
    return [P.x + x * Math.cos(a) - y * Math.sin(a), P.y + R.bob * u + x * Math.sin(a) + y * Math.cos(a)];
  }
  // 船的前半：近侧的船舷与船板、舵桨（有人在船上时画在人之后，遮住膝下）
  function drawShipFront(ctx) {
    if (!shipVisible()) return;
    const A = L('jyShipA');
    ctx.save();
    const u = shipXform(ctx);
    ctx.globalAlpha = A;
    wreckParts(ctx, u, () => {
      hullPath(ctx, u);
      ctx.fillStyle = sh(WOOD, 0.05); ctx.fill();
      ctx.fillStyle = sh(STRIPE, 0.05, 0.9);
      ctx.beginPath(); ctx.moveTo(-2.7 * u, -0.5 * u); ctx.lineTo(2.62 * u, -0.52 * u); ctx.lineTo(2.58 * u, -0.42 * u); ctx.lineTo(-2.62 * u, -0.4 * u); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh(WOOD_D, 0.05, 0.9); ctx.lineWidth = Math.max(0.6, 0.022 * u);
      ctx.beginPath();
      ctx.moveTo(-2.4 * u, -0.22 * u); ctx.quadraticCurveTo(0, -0.18 * u, 2.4 * u, -0.26 * u);
      ctx.moveTo(-2.1 * u, -0.02 * u); ctx.quadraticCurveTo(0, 0.01 * u, 2.2 * u, -0.05 * u);
      ctx.stroke();
      const litR = (litX() >= shipPos().x ? 1 : -1) * S.shipDir;
      ctx.strokeStyle = sh(WOOD_L, 0.05, 0.9, 0.2); ctx.lineWidth = Math.max(0.8, 0.04 * u);
      ctx.beginPath(); ctx.moveTo(-2.6 * u, -0.8 * u); ctx.lineTo(2.45 * u, -0.8 * u); if (litR > 0) ctx.quadraticCurveTo(2.72 * u, -0.84 * u, 2.86 * u, -1.08 * u); ctx.stroke();
      // 舵桨
      ctx.strokeStyle = sh(WOOD_L, 0.05); ctx.lineWidth = Math.max(1, 0.08 * u);
      ctx.beginPath(); ctx.moveTo(-2.25 * u, -0.95 * u); ctx.lineTo(-2.95 * u, 0.2 * u); ctx.stroke();
      ctx.fillStyle = sh(WOOD_L, 0.05);
      ctx.beginPath(); ctx.ellipse(-2.9 * u, 0.12 * u, 0.1 * u, 0.26 * u, 0.55, 0, TAU); ctx.fill();
    });
    ctx.restore();
    // 船边的水沫
    const P = shipPos(), R = shipRoll();
    const k = 0.25 + 0.6 * L('jyStorm') + 0.5 * L('jyWreck');
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(226,236,248)';
    ctx.globalAlpha = k * A * (0.4 + 0.6 * W.daylight + 0.3 * W.night * W.lv.moon);
    ctx.lineWidth = Math.max(0.7, 0.03 * u);
    ctx.beginPath(); ctx.ellipse(P.x, P.y + (R.bob + 0.1) * u, 2.6 * u, 0.12 * u, 0, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawShipShadow(ctx) {
    if (!shipVisible()) return;
    const P = shipPos(), u = shipU(), R = shipRoll(), A = L('jyShipA');
    ctx.save();
    ctx.translate(P.x, P.y + R.bob * u + 0.14 * u);
    ctx.scale(S.shipDir, -0.5);
    ctx.globalAlpha = A * 0.26 * (1 - 0.8 * L('jyStorm'));
    hullPath(ctx, u);
    ctx.fillStyle = 'rgb(8,14,24)';
    ctx.fill();
    ctx.fillRect(0.15 * u, 0, 0.1 * u, 3.4 * u);
    ctx.restore();
    const k = lanternK();
    if (k > 0.02) {
      const q = lanternPt();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) glow(ctx, 'g', q[0] + Math.sin(S.clock * 2 + i) * 0.1 * u, P.y + (0.25 + i * 0.22) * u, 0.5 * u, 0.22 * k * (1 - i / 6), 0.08 * u);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawLantern(ctx) {
    const k = lanternK(); if (k < 0.02) return;
    const q = lanternPt(), u = shipU(), fl = 0.9 + 0.1 * Math.sin(S.clock * 9) * Math.sin(S.clock * 5.3);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', q[0], q[1], 3.2 * u, 0.45 * k * fl);
    glow(ctx, 'g', q[0] + S.shipDir * 2.2 * u, q[1] + 0.9 * u, 3.6 * u, 0.26 * k * fl, 1.5 * u);
    glow(ctx, 'w', q[0], q[1], 0.25 * u, 0.9 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  海：本幕自己的风浪
  // ════════════════════════════════════════════════════════════
  function drawWaves(ctx, pass) {
    const g0 = L('jyStorm');
    if (g0 < 0.03) return;
    const q = W.quality || 1, tl = tall();
    ctx.strokeStyle = 'rgba(230,240,250,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const NC = Math.round(170 * q * g0);
    for (let i = 0; i < NC; i++) {
      const ph = U.fract(S.clock * (0.3 + 0.2 * hsh(i + 760)) + hsh(i + 761));
      const y = W.horizonY + (0.008 + 0.4 * Math.pow(hsh(i + 762), 0.85)) * W.h;
      const x = (hsh(i + 763) * 1.04 - 0.03) * W.w + ph * 20;
      if (W.seaBand(y) !== pass || ph > 0.6 || !W.isSea(x, y)) continue;
      const len = (8 + 16 * hsh(i + 764)) * W.seaScale(y) * (tl ? 1.5 : 1);
      ctx.moveTo(x, y); ctx.lineTo(x + len * (0.4 + ph), y - 0.5);
    }
    ctx.globalAlpha = 0.7 * g0;
    ctx.stroke();
    const N = Math.round(70 * q);
    for (let i = 0; i < N; i++) {
      const ph = U.fract(S.clock * (0.1 + 0.05 * hsh(i + 710)) + hsh(i + 711));
      const y = W.horizonY + (0.012 + 0.4 * Math.pow(hsh(i + 701), 0.7)) * W.h;
      const x = (hsh(i + 700) * 1.06 - 0.04 + ph * 0.05) * W.w;
      if (W.seaBand(y) !== pass || !W.isSea(x, y)) continue;
      const g = g0;
      const s = W.seaScale(y) * (tl ? 1.7 : 1.2);
      const w = (46 + 60 * hsh(i + 702)) * s, h = (7 + 12 * hsh(i + 703)) * s * (0.4 + 0.9 * g);
      const env = Math.sin(Math.PI * ph);
      const lift = h * env;
      ctx.globalAlpha = g * env * 0.85;
      ctx.fillStyle = 'rgba(12,26,42,0.55)';
      ctx.beginPath(); ctx.ellipse(x - w * 0.1, y + lift * 0.3, w * 0.8, lift * 0.45 + 1, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(40,66,92,0.9)';
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.35, y - lift * 0.5, x, y - lift); ctx.quadraticCurveTo(x + w * 0.25, y - lift * 0.8, x + w * 0.55, y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(236,244,252,0.95)'; ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath(); ctx.moveTo(x - w * 0.5, y - lift * 0.62); ctx.quadraticCurveTo(x - w * 0.15, y - lift * 1.05, x + w * 0.02, y - lift); ctx.quadraticCurveTo(x + w * 0.2, y - lift * 0.7, x + w * 0.28, y - lift * 0.2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光：众教会的灯、外邦人的光、门、异象、站在旁边的主……
  // ════════════════════════════════════════════════════════════
  const lampX = i => { const x = LAMPS[i][1]; return (tall() ? 0.53 + (x - 0.55) / 0.45 * 0.45 : x) * W.w; };
  const lampY = i => gYb(lampX(i), 0) - Math.max(1.5, 2.5 * W.unit);
  function drawChurchLamps(ctx) {
    const all = L('jyAll'), day = W.daylight;
    ctx.globalCompositeOperation = 'lighter';
    const r0 = Math.max(5, 11 * W.unit) * (tall() ? 1.5 : 1);
    for (let i = 0; i < LAMPS.length; i++) {
      const k = LA[i]; if (k < 0.01) continue;
      const x = lampX(i), y = lampY(i), fl = 0.88 + 0.12 * Math.sin(S.clock * (5 + i) + i * 1.7);
      const a = k * (0.5 + 0.5 * (1 - day) + 0.6 * all) * fl;
      glow(ctx, 'g', x, y, r0 * (1.6 + 1.4 * all), 0.35 * a);
      glow(ctx, 'w', x, y, r0 * 0.35, 0.95 * a);
    }
    if (all > 0.02) {
      // 光沿着远山一路亮到右边的尽头
      const n = 40;
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = lerp(lampX(0), W.w + 6, t), y = gYb(Math.min(x, W.w - 1), 0) - 2;
        glow(ctx, 'g', x, y, r0 * 1.4, 0.16 * all * (0.6 + 0.4 * Math.sin(S.clock * 2 - t * 9)));
      }
      glow(ctx, 'w', W.w, gYb(W.w - 1, 0) - 4, r0 * 6, 0.35 * all);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 外邦人的光：远近的村落一处处亮起（自左往右，直到地极）
  let VILL = null;
  function villages() {
    if (VILL) return VILL;
    VILL = [];
    for (let i = 0; i < 46; i++) {
      const layer = i < 26 ? 1 : 0;
      const xf = layer === 1 ? 0.49 + 0.51 * hsh(i + 900) : 0.55 + 0.45 * hsh(i + 900);
      const x = xf * W.w;
      if (!W.hasLandBase(layer, x, 2)) continue;
      const y = gYb(x, layer) + (layer === 1 ? 0.25 : 0.1) * H1() * hsh(i + 950);
      VILL.push({ x, y, layer, t: 0.04 + 0.86 * clamp((xf - 0.45) / 0.57, 0, 1) + 0.06 * hsh(i + 990) });
    }
    return VILL;
  }
  function drawVillages(ctx, layer) {
    const k = L('jyGentile'); if (k < 0.01) return;
    const r0 = Math.max(5, (layer === 1 ? 12 : 8) * W.unit) * (tall() ? 1.5 : 1), nightA = 0.7 + 0.3 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const v of villages()) {
      if (v.layer !== layer) continue;
      const on = ss(v.t, v.t + 0.06, k);
      if (on < 0.01) continue;
      glow(ctx, 'g', v.x, v.y, r0 * 2.2, 0.3 * on * nightA);
      glow(ctx, 'w', v.x, v.y, r0 * 0.4, 0.8 * on * nightA);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawGentileFront(ctx) {
    const k = L('jyGentile'); if (k < 0.01 || k > 0.995) return;
    const xf = 0.45 + 0.6 * k / 0.95, x = xf * W.w, env = Math.sin(Math.PI * Math.min(1, k * 1.05));
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'r', x, W.horizonY + 0.02 * W.h, 0.08 * W.w, 0.35 * env, 0.16 * W.h);
    glow(ctx, 'g', x, W.horizonY + 0.08 * W.h, 0.05 * W.w, 0.3 * env, 0.08 * W.h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 圣灵说话：光自天落在二人身上
  function drawSpirit(ctx) {
    const k = L('jySpirit'); if (k < 0.01) return;
    const x = S.spiritX * W.w, y = gY(x), h = H2();
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, x, -10, y + 4, h * 3, 0.26 * k);
    glow(ctx, 'w', x, y - h * 0.6, h * 1.8, 0.18 * k);
    for (const id of ['barnabas', 'paul']) { const f = fpos(id); if (f) glow(ctx, 'r', f.x, f.y - f.h * 0.55, f.h * 1.1, 0.35 * k); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 信道的门：一扇光的门在会众中间打开
  function doorG() { const x = S.doorX * W.w, B = BU(); return { x, g: gYb(x) + 0.05 * B, B, w: 1.3 * B, h: 2.3 * B }; }
  function drawDoorFrame(ctx) {
    const k = L('jyDoor'); if (k < 0.01) return;
    const G = doorG(), B = G.B, op = ease(k);
    ctx.globalAlpha = Math.min(1, k * 1.6);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rgba([255, 240, 206], 0.75 * op);
    ctx.beginPath(); arch(ctx, G.x, G.g, G.w * 0.92, G.h * 0.97); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = sh(GOLD, 0.03, 1, 0.25);
    ctx.fillRect(G.x - G.w / 2 - 0.1 * B, G.g - G.h, 0.12 * B, G.h); ctx.fillRect(G.x + G.w / 2 - 0.02 * B, G.g - G.h, 0.12 * B, G.h);
    ctx.fillRect(G.x - G.w / 2 - 0.14 * B, G.g - G.h - 0.12 * B, G.w + 0.28 * B, 0.14 * B);
    const lw = G.w / 2 * Math.max(0.1, Math.cos(op * 1.35));
    ctx.fillStyle = sh(WOOD_L, 0.03, 1, 0.1);
    ctx.fillRect(G.x - G.w / 2 + 0.02 * B, G.g - G.h + 0.05 * B, lw, G.h - 0.05 * B);
    ctx.fillRect(G.x + G.w / 2 - 0.02 * B - lw, G.g - G.h + 0.05 * B, lw, G.h - 0.05 * B);
    ctx.globalAlpha = 1;
  }
  function drawDoorLight(ctx) {
    const k = L('jyDoor'); if (k < 0.01) return;
    const G = doorG(), B = G.B;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'r', G.x, G.g - G.h * 0.5, G.h * 1.2, 0.4 * k, G.h * 0.9);
    glow(ctx, 'g', G.x, G.g + 0.1 * B, G.w * 2.6, 0.3 * k, 0.3 * B);
    beam(ctx, G.x, -10, G.g - G.h * 0.9, G.w * 1.5, 0.18 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 耶路撒冷来的书信：展开的卷
  function drawScroll(ctx) {
    const k = L('jyScroll'); if (k < 0.02) return;
    const q = handPt(S.scrollId); if (!q) return;
    const h = H2(), w = 0.36 * h * k;
    ctx.globalAlpha = Math.min(1, k * 1.5);
    ctx.fillStyle = sh([236, 222, 188], 0.02, 1, 0.1);
    ctx.fillRect(q[0] - w / 2, q[1] - 0.12 * h, w, 0.16 * h);
    ctx.fillStyle = sh(WOOD, 0.02);
    ctx.fillRect(q[0] - w / 2 - 0.025 * h, q[1] - 0.14 * h, 0.04 * h, 0.2 * h); ctx.fillRect(q[0] + w / 2 - 0.015 * h, q[1] - 0.14 * h, 0.04 * h, 0.2 * h);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', q[0], q[1] - 0.04 * h, 0.8 * h, 0.35 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 马其顿人的异象：海那边一个站着的人，一道光的路跨过海面
  function drawVision(ctx) {
    const k = L('jyVision'); if (k < 0.01) return;
    const f = fpos('mac'), p = fpos('paul'); if (!f) return;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'b', f.x, f.y - f.h * 0.6, f.h * 4.5, 0.5 * k, f.h * 3.2);
    glow(ctx, 'w', f.x, f.y - f.h * 0.5, f.h * 1.9, 0.22 * k, f.h * 1.5);
    beam(ctx, f.x, f.y - f.h * 5, f.y + 2, f.h * 1.6, 0.3 * k);
    if (p) {
      const n = 16;
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = lerp(f.x, p.x, t), y = lerp(f.y + 0.2 * f.h, p.y - 0.1 * p.h, t * t);
        const sw = Math.sin(S.clock * 2 + i * 0.9);
        if (!W.isSea(x, y) && t > 0.08 && t < 0.9) continue;
        glow(ctx, 'b', x + sw * 2, y, (0.6 + 1.2 * t) * f.h, 0.34 * k * (0.7 + 0.3 * sw), (0.1 + 0.12 * t) * f.h);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 吕底亚的心：胸中一盏光
  function drawHeart(ctx) {
    const k = L('jyHeart'); if (k < 0.01) return;
    const f = fpos(S.heartId); if (!f) return;
    const x = f.x, y = f.y - f.h * (f.p.pose === 'sit' ? 0.42 : 0.62);
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', x, y, f.h * 1.3, 0.45 * k);
    glow(ctx, 'w', x, y, f.h * 0.25, 0.9 * k);
    ctx.strokeStyle = rgba([255, 226, 170], 0.35 * k); ctx.lineWidth = Math.max(0.6, 0.02 * f.h);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = S.clock * 0.3 + i * TAU / 8, r1 = f.h * 0.3, r2 = f.h * (0.55 + 0.1 * Math.sin(S.clock * 2 + i)); ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.lineTo(x + Math.cos(a) * r2, y + Math.sin(a) * r2); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 河里受洗：一圈一圈的光
  function drawBapt(ctx) {
    const k = L('jyBapt'); if (k < 0.01) return;
    const xf = X('bapt'), x = xf * W.w, y = fieldY(xf, riverYAt(xf)), h = H2();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      const q = U.fract(S.clock * 0.35 + i / 3), r = h * (0.3 + 1.6 * q);
      ctx.strokeStyle = rgba([226, 240, 255], 0.5 * k * (1 - q)); ctx.lineWidth = Math.max(0.7, 0.03 * h);
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.22, 0, 0, TAU); ctx.stroke();
    }
    glow(ctx, 'b', x, y, h * 1.8, 0.35 * k, h * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 半夜唱诗：二人身边的光
  function drawSingGlow(ctx) {
    const k = L('jySing'); if (k < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const id of ['paul', 'silas']) { const f = fpos(id); if (f) glow(ctx, 'g', f.x, f.y - f.h * 0.4, f.h * 1.4, 0.3 * k); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 主站在保罗旁边：一道站立的光（不画形像）
  function lordPt() { const x = S.lordX * W.w; return [x, S.lordY ? S.lordY * W.h : gY(x)]; }
  function drawLord(ctx) {
    const k = L('jyLord'); if (k < 0.01) return;
    const q = lordPt(), h = H2() * 1.05, br = 0.92 + 0.08 * Math.sin(S.clock * 1.3);
    ctx.globalCompositeOperation = 'lighter';
    beam(ctx, q[0], q[1] - h * 4.5, q[1], h * 1.4, 0.2 * k);
    glow(ctx, 'r', q[0], q[1] - h * 0.62, h * 0.9, 0.5 * k * br, h * 1.25);
    glow(ctx, 'w', q[0], q[1] - h * 0.62, h * 0.32, 0.8 * k * br, h * 0.8);
    glow(ctx, 'g', q[0], q[1], h * 1.5, 0.3 * k, h * 0.2);
    glow(ctx, 'w', q[0], q[1] - h * 0.5, h * 3, 0.12 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 往罗马去：一道光自保罗向西（右）伸去，到地极
  function drawWest(ctx) {
    const k = L('jyWest'); if (k < 0.01) return;
    const f = fpos('paul'); if (!f) return;
    const x0 = f.x, y0 = f.y - f.h * 0.6, x1 = W.w + 10, y1 = gYb(W.w - 1, 0) - 6, n = 34;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i <= n; i++) {
      const t = i / n; if (t > k) break;
      const x = lerp(x0, x1, t), y = lerp(y0, y1, Math.sin(t * Math.PI / 2)) - Math.sin(Math.PI * t) * 0.06 * W.h;
      glow(ctx, 'g', x, y, f.h * (0.5 - 0.3 * t), 0.35 * (1 - 0.5 * t) * (0.7 + 0.3 * Math.sin(S.clock * 3 - i)));
    }
    if (k > 0.97) glow(ctx, 'w', x1 - 8, y1, f.h * 2, 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 使者站在旁边：船的四围一圈光
  function drawAngelPool(ctx) {
    const k = L('jyAngel'); if (k < 0.01 || !shipVisible()) return;
    const P = shipPos(), u = shipU();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'r', P.x, P.y - 1.4 * u, 4.2 * u, 0.3 * k, 2.8 * u);
    glow(ctx, 'b', P.x, P.y + 0.1 * u, 4.8 * u, 0.3 * k, 0.45 * u);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawBread(ctx) {
    const k = L('jyBread'); if (k < 0.01) return;
    const q = handPt(S.breadId); if (!q) return;
    const h = H2();
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', q[0], q[1], h * 1.1, 0.5 * k);
    glow(ctx, 'w', q[0], q[1], h * 0.18, 0.9 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = sh([214, 164, 96], 0.02, 1, 0.2);
    ctx.beginPath(); ctx.ellipse(q[0], q[1], 0.09 * h, 0.05 * h, 0, 0, TAU); ctx.fill();
  }
  // 毒蛇：悬在保罗手上；甩进火里
  function drawViper(ctx) {
    const hang = L('jyViper'), th = L('jyThrow');
    if (hang < 0.03 && (th < 0.01 || th > 0.99)) return;
    const q = handPt(S.viperId); if (!q) return;
    const h = H2(), col = sh([52, 44, 30], 0.02), len = 0.55 * h;
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1.6, 0.06 * h); ctx.lineCap = 'round';
    if (th < 0.01) {
      ctx.globalAlpha = Math.min(1, hang);
      const sw = Math.sin(S.clock * 3) * 0.05 * h;
      ctx.beginPath(); ctx.moveTo(q[0], q[1]);
      ctx.bezierCurveTo(q[0] + 0.12 * h + sw, q[1] + len * 0.3, q[0] - 0.12 * h + sw, q[1] + len * 0.6, q[0] + sw * 0.6, q[1] + len);
      ctx.stroke();
    } else {
      const G = fireG(), t = th, x = lerp(q[0], G.x, t), y = lerp(q[1], G.y - 0.2 * G.B, t) - Math.sin(Math.PI * t) * 1.2 * h, a = t * 9;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5);
      ctx.quadraticCurveTo(x + Math.cos(a + 1.6) * len * 0.2, y + Math.sin(a + 1.6) * len * 0.2, x - Math.cos(a) * len * 0.5, y - Math.sin(a) * len * 0.5);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
    ctx.globalAlpha = 1;
  }
  function drawHeal(ctx) {
    const k = L('jyHeal'); if (k < 0.01) return;
    const f = fpos('father'); if (!f) return;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'r', f.x, f.y - f.h * 0.3, f.h * 1.5, 0.35 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一盏小灯（陶灯：特罗亚的夜、哥林多的帐棚边）
  function drawSmallLamp(ctx) {
    const k = L('jyLamp'); if (k < 0.01) return;
    const x = S.lampX * W.w, y = fieldY(S.lampX, 0.08), h = H2(), fl = 0.88 + 0.12 * Math.sin(S.clock * 8) * Math.sin(S.clock * 5.1);
    ctx.globalAlpha = Math.min(1, k * 1.5);
    ctx.fillStyle = sh([150, 100, 64], 0.02);
    ctx.beginPath(); ctx.ellipse(x, y - 0.04 * h, 0.1 * h, 0.045 * h, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = rgba([255, 214, 130], 0.9 * k);
    ctx.beginPath(); ctx.ellipse(x + 0.08 * h, y - 0.1 * h, 0.022 * h, 0.05 * h * fl, 0, 0, TAU); ctx.fill();
    glow(ctx, 'g', x + 0.08 * h, y - 0.12 * h, h * 1.6 * fl, 0.4 * k * (0.4 + 0.6 * nightK()));
    glow(ctx, 'w', x + 0.08 * h, y - 0.1 * h, h * 0.16, 0.8 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 未识之神被传明：一口金色的气息遍地
  function drawKnown(ctx) {
    const k = L('jyKnown'); if (k < 0.01) return;
    const f = fpos('paul'); if (!f) return;
    ctx.globalCompositeOperation = 'lighter';
    glow(ctx, 'g', f.x, f.y - f.h, W.w * 0.5, 0.16 * k, W.h * 0.36);
    glow(ctx, 'w', f.x, f.y - f.h * 0.7, f.h * 2.2, 0.28 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 锁链：手腕间一道灰色的链子（连到看守的兵）
  function drawChains(ctx) {
    for (const id in S.chains) {
      if (!has(id)) continue;
      const f = fpos(id); if (!f || !f.p._vis) continue;
      const q = handPt(id); if (!q) continue;
      const h = f.h, r = Math.max(1, 0.035 * h);
      ctx.strokeStyle = sh([150, 150, 156], 0.02, 0.95, 0.1); ctx.lineWidth = Math.max(0.7, 0.018 * h);
      ctx.beginPath();
      for (let i = -2; i <= 2; i++) { ctx.moveTo(q[0] + i * r * 1.6 + r, q[1]); ctx.ellipse(q[0] + i * r * 1.6, q[1], r, r * 0.6, 0, 0, TAU); }
      ctx.stroke();
      const to = S.chains[id];
      const g = to && to !== true ? handPt(to) : null;
      ctx.beginPath();
      if (g && has(to)) { ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo((q[0] + g[0]) / 2, Math.max(q[1], g[1]) + 0.25 * h, g[0], g[1]); }
      else { ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + 0.05 * h, q[1] + 0.2 * h, q[0] - 0.02 * h, q[1] + 0.36 * h); }
      ctx.stroke();
    }
  }
  function drawFXL(ctx) {
    for (const e of FXL) {
      const q = c01(e.t / e.dur), env = Math.sin(Math.PI * q);
      if (e.type === 'crate') {
        // 抛在海里的货物
        const x = e.x + e.vx * e.t, y = e.y + e.vy * e.t + 300 * e.t * e.t * (e.s || 1);
        if (y > e.y0 + 0.02 * W.h) continue;
        ctx.fillStyle = sh([120, 92, 60], 0.05);
        ctx.save(); ctx.translate(x, y); ctx.rotate(e.t * 3); ctx.fillRect(-e.r, -e.r * 0.7, e.r * 2, e.r * 1.4); ctx.restore();
      } else if (e.type === 'link') {
        // 松开的锁链落在地上
        const y = Math.min(e.y + 260 * e.t * e.t, e.y1);
        ctx.strokeStyle = rgba([180, 180, 190], 1 - q * 0.5); ctx.lineWidth = Math.max(0.7, e.r * 0.5);
        ctx.beginPath(); ctx.ellipse(e.x + e.vx * e.t, y, e.r, e.r * 0.6, e.t * 4, 0, TAU); ctx.stroke();
      } else if (e.type === 'ring') {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba(e.c || [255, 236, 190], 0.6 * (1 - q)); ctx.lineWidth = Math.max(1, e.w || 2);
        ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * (0.2 + q), e.r * (0.2 + q) * (e.flat || 1), 0, 0, TAU); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'plank') {
        const x = e.x + e.vx * Math.min(e.t, 2.5), y = e.y + Math.sin(e.t * 2 + e.x) * 2;
        ctx.globalAlpha = 1 - q;
        ctx.fillStyle = sh(WOOD, 0.05);
        ctx.save(); ctx.translate(x, y); ctx.rotate(e.rot); ctx.fillRect(-e.r, -e.r * 0.12, e.r * 2, e.r * 0.24); ctx.restore();
        ctx.globalAlpha = 1;
      } else if (e.type === 'spark') {
        if (e.t < 0) continue;
        const u = ease(q), x = lerp(e.x0, e.x1, u), y = lerp(e.y0, e.y1, u) - Math.sin(Math.PI * q) * 0.07 * W.h;
        const a = Math.min(1, q * 6) * (1 - Math.max(0, q - 0.85) / 0.15);
        ctx.globalCompositeOperation = 'lighter';
        glow(ctx, 'g', x, y, e.r * 5, 0.45 * a);
        glow(ctx, 'w', x, y, e.r * 1.6, 0.85 * a);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'shine') {
        const f = fpos(e.id); if (!f) continue;
        ctx.globalCompositeOperation = 'lighter';
        beam(ctx, f.x, 0, f.y + 4, f.h * 3, 0.35 * env);
        glow(ctx, 'w', f.x, f.y - f.h * 0.55, f.h * 1.6, 0.4 * env);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    const k = dt * (W.fast || 1);
    S.clock += k;
    if (!cur()) { if (FXL.length) FXL.length = 0; return; }
    for (let i = 0; i < LAMPS.length; i++) LA[i] = U.approach(LA[i], i < S.lamps ? 1 : 0, 1.4, k);
    for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += k; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    if (W.replaying) return;
    const f = fx(); if (!f) return;
    // 圣灵的光：细细的光尘落下
    if (L('jySpirit') > 0.3) {
      const x = S.spiritX * W.w, h = H2();
      if (Math.random() < k * 14 * L('jySpirit')) f.add({ x: x + rnd(-0.8, 0.8) * h, y: rnd(0.05, 0.6) * W.h, vx: rnd(-6, 6), vy: rnd(30, 60), max: rnd(1.5, 3), size: rnd(1, 2), c: [255, 246, 222], drag: 0.2, a: 0.8, pass: 'air', twinkle: true });
    }
    // 半夜的诗歌：光点自二人身上升起，穿过屋顶
    if (L('jySing') > 0.3 && S.place === 'prison') {
      S.singAcc += k * 7 * L('jySing');
      while (S.singAcc > 1) {
        S.singAcc -= 1;
        const id = Math.random() < 0.5 ? 'paul' : 'silas', p = fpos(id); if (!p) continue;
        f.add({ x: p.x + rnd(-0.2, 0.2) * p.h, y: p.y - p.h * 0.8, vx: rnd(-10, 10), vy: -rnd(28, 55) * Math.max(0.5, W.unit), max: rnd(3, 5), size: rnd(1.2, 2.4), c: [255, 226, 160], drag: 0.1, a: 0.9, pass: 'top', twinkle: true });
      }
    }
    // 风浪打进船里
    const st = L('jyStorm');
    if (st > 0.3 && shipVisible()) {
      S.sprayAcc += k * 9 * st;
      const P = shipPos(), R = shipRoll(), u = shipU();
      while (S.sprayAcc > 1) {
        S.sprayAcc -= 1;
        f.add({ x: P.x + S.shipDir * (2.4 + rnd(-0.2, 0.4)) * u, y: P.y + R.bob * u - 0.3 * u, vx: rnd(-40, 70) * u / 40, vy: -rnd(60, 160) * u / 40, max: rnd(0.5, 1.1),
          size: rnd(0.9, 1.9), c: [220, 234, 250], drag: 0.8, grav: 260 * u / 40, a: 0.8, pass: 'air' });
      }
      if (W.lv.storm > 0.6 && S.clock - S.lastBolt > 5 && Math.random() < k * 0.25 && GS.weather && GS.weather.bolt) { S.lastBolt = S.clock; safe('jy.bolt', () => GS.weather.bolt({ x: rnd(0.1, 0.9), near: Math.random() < 0.3 })); }
    }
    // 火：火星与雨中的烟
    if (L('jyFire') > 0.3) {
      S.fireAcc += k * 6 * L('jyFire');
      const G = fireG();
      while (S.fireAcc > 1) {
        S.fireAcc -= 1;
        const smoke = Math.random() < 0.5;
        f.add({ x: G.x + rnd(-0.2, 0.2) * G.B, y: G.y - 0.4 * G.B, vx: rnd(-8, 8) + (W.wind || 0) * 10, vy: -rnd(20, 45) * Math.max(0.5, W.unit), max: rnd(1, 2.4), size: smoke ? rnd(3, 6) * Math.max(0.5, W.unit) : rnd(0.8, 1.6),
          c: smoke ? [150, 150, 156] : [255, 180, 90], drag: 0.4, a: smoke ? 0.18 : 0.8 * (1 - 0.6 * W.daylight), pass: 'air', twinkle: !smoke });
      }
    }
  }
  function drawUnder(ctx, pass) {
    if (!cur()) return;
    if (pass === 'far') { safe('jy.lampsFar', () => drawChurchLamps(ctx)); safe('jy.villF', () => drawVillages(ctx, 0)); return; }
    if (pass === 'mid') { safe('jy.placeMid', () => drawPlaces(ctx, 'mid')); safe('jy.villM', () => drawVillages(ctx, 1)); return; }
    if (pass === 'near') { safe('jy.placeNear', () => drawPlaces(ctx, 'near')); safe('jy.hallDark', () => drawHallDark(ctx)); safe('jy.door', () => drawDoorFrame(ctx)); return; }
    if (pass === 'air') {
      if (anyAboard()) safe('jy.shipFront', () => drawShipFront(ctx));
      if (S.place === 'prison' && L('jyPlace') > 0.3) safe('jy.prisonFront', () => drawPrisonFront(ctx));
      safe('jy.chains', () => drawChains(ctx));
      safe('jy.hallLight', () => { if (S.place === 'caesarea') drawHallLight(ctx); });
      safe('jy.windows', () => drawWindowGlows(ctx));
    }
  }
  function draw(ctx, pass) {
    if (!cur()) return;
    if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') {
      safe('jy.waves', () => drawWaves(ctx, pass));
      if (pass === 'seaNear' || pass === 'seaMid') safe('jy.shipShadow', () => { if (W.seaBand(shipPos().y) === pass) drawShipShadow(ctx); });
      if (pass === 'seaNear' && (S.place === 'malta' || S.prev === 'malta')) safe('jy.reef', () => { ctx.globalAlpha = S.place === 'malta' ? L('jyPlace') : 1 - L('jyPlace'); drawReef(ctx); ctx.globalAlpha = 1; });
      return;
    }
    if (pass === 'near') {
      safe('jy.shipBack', () => drawShipBack(ctx));
      if (!anyAboard()) safe('jy.shipFront', () => drawShipFront(ctx));
      safe('jy.fire', () => drawFire(ctx));
      return;
    }
    if (pass === 'air') {
      safe('jy.known', () => drawKnown(ctx));
      safe('jy.spirit', () => drawSpirit(ctx));
      safe('jy.lamp', () => drawSmallLamp(ctx));
      safe('jy.front', () => drawGentileFront(ctx));
      safe('jy.doorLight', () => drawDoorLight(ctx));
      safe('jy.scroll', () => drawScroll(ctx));
      safe('jy.vision', () => drawVision(ctx));
      safe('jy.heart', () => drawHeart(ctx));
      safe('jy.bapt', () => drawBapt(ctx));
      safe('jy.sing', () => drawSingGlow(ctx));
      safe('jy.lord', () => drawLord(ctx));
      safe('jy.west', () => drawWest(ctx));
      safe('jy.angel', () => drawAngelPool(ctx));
      safe('jy.bread', () => drawBread(ctx));
      safe('jy.viper', () => drawViper(ctx));
      safe('jy.heal', () => drawHeal(ctx));
      safe('jy.lantern', () => drawLantern(ctx));
      safe('jy.fxl', () => drawFXL(ctx));
    }
  }
  function pick(x, y, r) {
    if (!cur()) return null;
    let best = null;
    const test = (label, cx, cy, top, rad) => {
      if (!isFinite(cx) || !isFinite(cy)) return;
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - (rad || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: cx, y: top, d };
    };
    const B = BU();
    if (shipVisible() && L('jyShipA') > 0.5) { const P = shipPos(), u = shipU(); test('船', P.x, P.y - 0.6 * u, P.y - 4.4 * u, 2 * u); }
    if (L('jyPlace') > 0.5) {
      const d = placeDef(S.place);
      for (const e of d.near) {
        if (e.k === 'house') { const bx = e.x * W.w, g = gYb(bx); const lab = S.place === 'philippi' && Math.abs(e.x - X('lhouse')) < 0.01 ? '吕底亚的家' : S.place === 'rome' && Math.abs(e.x - X('rhouse')) < 0.01 ? '保罗所租的房子' : S.place === 'galatia' && e.w >= 2.4 ? '会堂' : S.place === 'malta' ? '部百流的家' : PLACE_NAME[S.place]; test(lab, bx, g - e.h * B * 0.5, g - e.h * B, e.w * B * 0.4); }
        else if (e.k === 'prison') { const G = prisonG(); test('内监', (G.x0 + G.xi) / 2, G.g - G.H * 0.5, G.g - G.H, (G.xi - G.x0) * 0.4); test('监', (G.xi + G.x1) / 2, G.g - G.H * 0.5, G.g - G.H, (G.x1 - G.xi) * 0.4); }
        else if (e.k === 'fort') { const G = fortG(); test('营楼', (G.x0 + G.x1) / 2, G.g - G.H * 0.5, G.g - G.H * 1.2, (G.x1 - G.x0) * 0.4); test('台阶', (G.sx0 + G.sx1) / 2, (G.g + G.land) / 2, G.land, 0.5 * B); }
        else if (e.k === 'hall') { const G = hallG(); test('公厅', (G.x0 + G.x1) / 2, G.g - G.H * 0.5, G.g - G.H, (G.x1 - G.x0) * 0.35); }
        else if (e.k === 'altar') { const G = altarG(); test('坛', G.x, G.g - G.h * 0.5, G.g - G.h, G.w * 0.5); }
        else if (e.k === 'rock') { const G = rockG(); test('亚略‧巴古', G.x, G.g - G.h * 0.5, G.g - G.h, G.w * 0.4); }
        else if (e.k === 'tent') { const bx = e.x * W.w, g = gYb(bx); test('帐棚', bx, g - 0.5 * B, g - 1.1 * B, 0.8 * B); }
        else if (e.k === 'idol') { const bx = e.x * W.w, g = gYb(bx); test('偶像', bx, g - 1 * B, g - 1.7 * B, 0.3 * B); }
        else if (e.k === 'river') { const xf = X('bapt'); test('河边', xf * W.w, fieldY(xf, riverYAt(xf)), fieldY(xf, riverYAt(xf)) - 0.3 * B, 0.8 * B); }
        else if (e.k === 'temple') { const bx = e.x * W.w, g = gYb(bx); test(S.place === 'lystra' ? '宙斯庙' : '庙', bx, g - e.h * B * 0.5, g - e.h * B, e.w * B * 0.4); }
      }
      if (S.place === 'athens') { const G = rockG(); test('亚略‧巴古', G.x, G.g - G.h * 0.5, G.g - G.h, G.w * 0.4); }
    }
    if (L('jyFire') > 0.5) { const G = fireG(); test('火', G.x, G.y - 0.3 * G.B, G.y - 0.8 * G.B, 0.5 * G.B); }
    if (L('jyDoor') > 0.5) { const G = doorG(); test('信道的门', G.x, G.g - G.h * 0.5, G.g - G.h, G.w * 0.5); }
    for (let i = 0; i < LAMPS.length; i++) if (LA[i] > 0.5) test('众教会', lampX(i), lampY(i), lampY(i) - 6, -40 * Math.max(0.6, W.unit));
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const VEG = {
    antioch: { grass: 0.75, bloom: 0.45, bare: 0.1 }, cyprus: { grass: 0.8, bloom: 0.55, bare: 0.08 }, galatia: { grass: 0.6, bloom: 0.3, bare: 0.25 },
    lystra: { grass: 0.55, bloom: 0.3, bare: 0.3 }, troas: { grass: 0.6, bloom: 0.25, bare: 0.15 }, philippi: { grass: 0.9, bloom: 0.7, bare: 0.03 },
    prison: { grass: 0.9, bloom: 0.6, bare: 0.03 }, athens: { grass: 0.4, bloom: 0.25, bare: 0.45 }, corinth: { grass: 0.6, bloom: 0.35, bare: 0.2 },
    miletus: { grass: 0.7, bloom: 0.5, bare: 0.1 }, jerusalem: { grass: 0.45, bloom: 0.2, bare: 0.3 }, caesarea: { grass: 0.6, bloom: 0.35, bare: 0.12 },
    crete: { grass: 0.35, bloom: 0.05, bare: 0.5 }, malta: { grass: 0.45, bloom: 0.2, bare: 0.35 }, rome: { grass: 1, bloom: 1, bare: 0 },
  };
  function ring(c, rgb) { if (!c.instant) safe('jy.ring', () => fx().ring(c.x, c.y, rgb || TINT, Math.min(W.w, W.h) * 0.3, 1.8, 1.5)); }
  function flashAt(b, id, rgb, n) {
    if (inst(b)) return;
    const f = fpos(id); if (!f) return;
    safe('jy.flash', () => { fx().ring(f.x, f.y - f.h * 0.5, rgb || [255, 248, 232], f.h * 3, 1.6, 1.4); fx().sparkle(f.x, f.y - f.h * 0.5, n || 30, rgb || [255, 248, 232], f.h * 0.4, 'air'); });
  }
  function dust(b, x, y, n, rgb, sp) { if (!inst(b)) safe('jy.dust', () => fx().dust(x, y, n || 20, rgb || [200, 186, 160], sp || 10, 'near')); }
  function nameAt(b, str, x, y, rgb, hold) {
    if (inst(b)) return;
    const size = Math.max(0.036 * M(), 15);
    safe('jy.name', () => fx().nameStr(str, x, y, size, rgb || [255, 230, 180], () => [x + rnd(-70, 70), y + rnd(-10, 60)], { hold: hold || 3.4 }));
  }
  function placeName(b, key) { const n = X('names'); nameAt(b, PLACE_NAME[key], n[0] * W.w, n[1] * W.h, [255, 236, 204], 3.6); }
  function nameOver(b, id, str, dy, rgb) { const f = fpos(id); if (f) nameAt(b, str, f.x, f.y - f.h * (dy || 2), rgb); }
  function toPlace(key, b) {
    if (S.place !== key) { S.prev = S.place; S.place = key; W.set('jyPlace', 0, true); lv('jyPlace', 1, b); }
    const v = VEG[key]; if (v) for (const k in v) if (W.hasLevel(k)) lv(k, v[k], b);
  }
  function lampOn(b, i, from) {
    S.lamps = Math.max(S.lamps, i + 1);
    if (inst(b)) return;
    const f = from ? fpos(from) : null, x = lampX(i), y = lampY(i);
    // 几点光自说话的人飞向远山上的那盏灯：本幕自己画的圆形柔光（白昼里也不是方的像素点）
    if (f) for (let j = 0; j < 4; j++) FXL.push({ type: 'spark', t: -0.5 * j, dur: 2.4, x0: f.x, y0: f.y - f.h * 0.8, x1: x, y1: y, r: Math.max(1.6, (2.6 - 0.4 * j) * Math.max(0.7, W.unit)) });
    safe('jy.lampOn', () => { fx().ring(x, y, [255, 226, 170], Math.max(22, 44 * W.unit), 2.2, 1.2); });
  }
  function chain(id, to) { S.chains[id] = to || true; }
  function unchain(id, b) {
    if (!S.chains[id]) return;
    delete S.chains[id];
    if (inst(b)) return;
    const q = handPt(id), f = fpos(id); if (!q || !f) return;
    for (let i = 0; i < 5; i++) FXL.push({ type: 'link', t: 0, dur: 1.6, x: q[0] + (i - 2) * f.h * 0.05, y: q[1], y1: f.y - 2, vx: (i - 2) * 6, r: Math.max(1, f.h * 0.035) });
  }
  // 重新出场（在别处）：先立即除去旧的，再淡入
  function reAdd(id, look, o) { rm(id, false); delete S.aboard[id]; if (look) addLook(id, look, o); else add(id, o); }
  function landP(id) { const p = person(id); if (p) { p.ny = null; p.fly = null; } }
  function flyTo(id, q, dur, ps) { const c = C(); if (c && c.get(id) && q) c.fly(id, q[0] / W.w, q[1] / W.h, { dur: dur || 1.4, pose: ps || 'stand' }); }
  function crewOn() {
    add('sailor1', { label: '水手', sex: 'm', robe: ROBE.sailor, accent: [196, 180, 150], hair: 'cloth', x: 0.5, from: 'none', glow: 0.12 });
    add('sailor2', { label: '水手', sex: 'm', robe: [110, 100, 88], accent: [170, 150, 120], x: 0.5, from: 'none', glow: 0.12 });
    board('sailor1', 'stern'); board('sailor2', 'g');
    face('sailor1', S.shipDir); face('sailor2', S.shipDir);
  }
  function crewOff(b) { for (const id of ['sailor1', 'sailor2']) { delete S.aboard[id]; rm(id, !inst(b)); } }
  function shipShow(b, name, dir) { shipAt(name || 'moor', dir); lv('jyShipA', 1, b); lv('jyLantern', 1, b); crewOn(); }
  function shipHide(b) { lv('jyShipA', 0, b); crewOff(b); }
  // 瞬间补完时，本幕的程度一并到位（船、光、门……）——与恢复存档一样
  const END = b => { if (inst(b)) for (const k of MY) W.lv[k] = W.lt[k]; };
  function TL(c, beats) { let mx = 0; for (const b of beats) mx = Math.max(mx, b[0]); T(c, beats.concat([[mx + 0.05, END]])); }
  const paulLook = o => Object.assign({ label: '保罗' }, o);
  const barnLook = o => Object.assign({ label: '巴拿巴', robe: ROBE.barnabas, accent: [206, 190, 150] }, o);
  const silasLook = o => Object.assign({ label: '西拉', robe: ROBE.silas, accent: [192, 198, 208] }, o);
  const timLook = o => Object.assign({ label: '提摩太', robe: ROBE.timothy, accent: [200, 190, 160], beard: false, hair: 'short' }, o);
  const soldier = (id, x, o) => add(id, Object.assign({ label: '兵丁', sex: 'm', robe: ROBE.roman, accent: ROMAN_ACC, hair: 'short', beard: false, prop: 'spear', x, glow: 0.12 }, o));
  const mid2 = (a, b) => (X(a) + X(b)) / 2;

  // ════════════════════════════════════════════════════════════
  //  布置（从目录直接跳到这一幕也完整）
  // ════════════════════════════════════════════════════════════
  function setup() {
    S = fresh();
    FXL.length = 0;
    for (let i = 0; i < LA.length; i++) LA[i] = i < S.lamps ? 1 : 0;
    const base0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.75, herbs: 0.6, trees: 0.22,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in base0) if (W.hasLevel(k)) W.set(k, base0[k], true);
    for (const k of MY) W.set(k, 0, true);
    for (const k of ['rain', 'storm', 'gale', 'hail', 'gloom']) if (W.hasLevel(k)) W.set(k, 0, true);
    W.set('bare', 0.1, true); W.set('bloom', 0.45, true);
    W.set('jyPlace', 1, true);
    // 树只在右边的高处：海边与城里不挡人
    const ox = W.w * 0.75, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy);
    W.setOrigin('trees', W.w * 0.998, W.ridgeBaseY(2, W.w * 0.998));
    W.freeClock = false;
    W.goTo(0.62, 0, true);
    W.setPop('fish', 70, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, ox, oy, true);
    W.setPop('beast', 0, ox, oy, true);
    W.setPop('creeper', 4, ox, oy, true);
    W.setPop('human', 0, ox, oy, true);
    const c = C();
    c.clear({ fade: false });
    shipShow({ instant: true }, 'moor', -1);
    addLook('paul', 'paul', { label: '扫罗', x: X('saul0'), facing: 1, from: 'none', pose: 'pray' });
    addLook('barnabas', 'disciple', barnLook({ x: X('barn0'), facing: 1, from: 'none', pose: 'pray' }));
    crowd('churchA', { n: 5, x0: X('church')[0], x1: X('church')[1], label: '安提阿的教会', from: 'none', pose: 'pray', mill: false });
    crowd('churchB', { n: 5, x0: X('church2')[0], x1: X('church2')[1], label: '安提阿的教会', from: 'none', pose: 'pray', mill: false });
    crowdFaceX('churchA', mid2('barn0', 'saul0')); crowdFaceX('churchB', mid2('barn0', 'saul0'));
    avoid([[0.4, 1]]);
  }

  function run(id, x, o) { walk(id, x, Object.assign({ run: true }, o || {})); }
  function attachSeat(id, i) { const c = C(); if (!c || !c.get(id)) return; c.attach(id, () => seatPt(i)); const p = c.get(id); p.nx = seatPt(i)[0] / W.w; p.tx = null; }
  // 下船：自船边踏上岸（离船很远的一边——竖屏——就在岸上淡入）
  function ashore(b, id, x, sp) {
    const slot = S.aboard[id]; if (slot == null) return;
    const q = deckPt(slot), from = clamp(q[0] / W.w, 0.46, 0.98);
    unboard(id, from, b);
    const p = person(id);
    if (p && !inst(b) && Math.abs(from - q[0] / W.w) > 0.06) p.alpha = 0;
    walk(id, x, { speed: sp || 0.035 });
  }
  function bolt(b, x, near) { if (!inst(b) && GS.weather && GS.weather.bolt) safe('jy.bolt', () => GS.weather.bolt({ x, near: !!near })); }
  function crates(b) {
    if (inst(b)) return;
    const P = shipPos(), u = shipU(), k = Math.max(0.5, W.unit);
    for (let i = 0; i < 3; i++) FXL.push({ type: 'crate', t: 0, dur: 1.6, x: P.x + (-0.6 + i * 0.5) * u, y: P.y - 0.9 * u, y0: P.y, vx: (i - 1) * 22 * k - 30 * k, vy: -110 * k, r: 0.13 * u, s: k });
  }
  function planks() {
    const P = shipPos(), u = shipU();
    for (let i = 0; i < 7; i++) FXL.push({ type: 'plank', t: 0, dur: 9, x: P.x - S.shipDir * (1.2 + i * 0.35) * u, y: P.y + (0.05 + 0.1 * (i % 3)) * u, vx: -S.shipDir * (6 + i * 3), r: (0.25 + 0.15 * (i % 2)) * u, rot: (i - 3) * 0.3 });
  }
  const JULIUS = () => ({ label: '百夫长犹流', sex: 'm', robe: ROBE.roman, accent: [236, 200, 120], hair: 'short', glow: 0.16, prop: 'staff' });
  const ARIST = () => ({ label: '亚里达古', sex: 'm', robe: DR(6), accent: [210, 196, 170], beard: true, glow: 0.14 });

  // ════════════════════════════════════════════════════════════
  //  十五句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 一 · 使徒行传 13：安提阿 → 塞浦路斯 ──────────────────────
    {
      kind: 'call', utter: '要为我分派巴拿巴和扫罗', cmd: 'sudo assign 巴拿巴 扫罗 --by 圣灵  # 禁食祷告', ref: '13:2', tint: [236, 240, 255],
      verse: [
        { text: '他们事奉主、禁食的时候，圣灵说：「要为我分派巴拿巴和扫罗，去做我召他们所做的工。」', ref: '使徒行传 13:2', hold: 7 },
        { text: '于是禁食祷告，按手在他们头上，就打发他们去了。', ref: '使徒行传 13:3', hold: 5 },
        { text: '他们既被圣灵差遣，就下到西流基，从那里坐船往塞浦路斯去。', ref: '使徒行传 13:4', hold: 5.5 },
        { text: '扫罗又名保罗，被圣灵充满……', ref: '使徒行传 13:9', hold: 4.5 },
      ],
      apply(c) {
        ring(c, [236, 240, 255]);
        TL(c, [
          [0, b => {
            time(0.74, 24, b);
            S.spiritX = mid2('barn0', 'saul0');
            lv('jySpirit', 1, b);
            glowP('paul', 0.5); glowP('barnabas', 0.5);
            pose('paul', 'kneel'); pose('barnabas', 'kneel');
            sfx(b, 'wind', { soft: true }); sfx(b, 'dove');
          }],
          [1.6, b => { nameOver(b, 'barnabas', '巴拿巴', 2.7, [255, 240, 214]); nameOver(b, 'paul', '扫罗', 1.75, [255, 240, 214]); }],
          [6.8, b => {
            crowdWalk('churchA', X('laying')[0], X('laying')[1], { speed: 0.02, pose: 'point' });
            crowdWalk('churchB', X('laying')[2], X('church2')[1] - 0.04, { speed: 0.02, pose: 'point' });
            lv('jySpirit', 0.45, b);
          }],
          [11, b => { lv('jySpirit', 0, b); pose('paul', 'stand'); pose('barnabas', 'stand'); glowP('paul', 0.3); glowP('barnabas', 0.2); }],
          [12, b => {
            crowdPose('churchA', 'stand'); crowdPose('churchB', 'stand');
            walk('barnabas', X('quay')[0] + 0.012, { speed: 0.04 }); walk('paul', X('quay')[0] + 0.03, { speed: 0.04 });
          }],
          [14.2, b => {
            board('barnabas', 'b'); board('paul', 'f'); face('paul', -1); face('barnabas', -1);
            crowdWalk('churchA', X('quay')[0] + 0.035, X('quay')[1] + 0.02, { speed: 0.03, pose: 'raise' });
            crowdPose('churchB', 'raise');
            lv('jySail', 1, b); sfx(b, 'wave', { soft: true });
          }],
          [15.2, b => { shipTo('off', b); }],
          [18.6, b => { toPlace('cyprus', b); crowdRm('churchA'); crowdRm('churchB'); }],
          [19.2, b => { shipTo('moor', b); placeName(b, 'cyprus'); }],
          [22.6, b => { lv('jySail', 0, b); }],
          [23.2, b => { ashore(b, 'barnabas', X('ashore')[0], 0.062); ashore(b, 'paul', X('ashore')[1], 0.062); }],
          // 扫罗上了岸、站定了，名才换作「保罗」（名字写在他站定之处）
          [26.4, b => {
            face('paul', 1);
            const f = fpos('paul'); if (f) nameAt(b, '保罗', X('ashore')[1] * W.w, f.y - f.h * 1.9, [255, 236, 196]);
            add('paul', { label: '保罗' });
            glowP('paul', 0.6); flashAt(b, 'paul', [255, 240, 214], 24);
            sfx(b, 'chime'); lampOn(b, 1, 'paul');
          }],
          [29, b => { glowP('paul', 0.24); }],
        ]);
      },
    },
    // ── 二 · 使徒行传 13：彼西底的安提阿 ─────────────────────────
    {
      kind: 'promise', utter: '我已经立你作外邦人的光', cmd: 'export LIGHT=外邦人 && ping 地极', ref: '13:47', tint: [255, 236, 196],
      verse: [
        { text: '到下安息日，合城的人几乎都来聚集，要听神的道。', ref: '使徒行传 13:44', hold: 5.5 },
        { text: '保罗和巴拿巴放胆说：「……我们就转向外邦人去。因为主曾这样吩咐我们说：我已经立你作外邦人的光，叫你施行救恩，直到地极。」', ref: '使徒行传 13:46–47', hold: 8.5 },
        { text: '外邦人听见这话，就欢喜了，赞美神的道……于是主的道传遍了那一带地方。', ref: '使徒行传 13:48–49', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 236, 196]);
        TL(c, [
          [0, b => { time(0.58, 8, b); rm('paul'); rm('barnabas'); shipHide(b); }],
          [1, b => { toPlace('galatia', b); }],
          [1.8, b => { placeName(b, 'galatia'); }],
          [2.6, b => {
            reAdd('paul', 'paul', paulLook({ x: X('paul2'), facing: 1 }));
            reAdd('barnabas', 'disciple', barnLook({ x: X('barn2'), facing: 1 }));
            crowd('city2L', { n: 5, x0: 0.36, x1: 0.44, label: '彼西底的安提阿人' });
            crowdWalk('city2L', X('city2L')[0], X('city2L')[1], { speed: 0.03 });
            crowd('city2R', { n: 7, x0: 1.0, x1: 1.1, label: '外邦人' });
            crowdWalk('city2R', X('city2R')[0], X('city2R')[1], { speed: 0.04 });
            sfx(b, 'crowd', { soft: true });
          }],
          [7.4, b => { crowdFaceX('city2L', X('paul2')); crowdFaceX('city2R', X('paul2')); pose('paul', 'raise'); face('paul', 1); }],
          [10.4, b => {
            flashAt(b, 'paul', [255, 240, 200], 30); glowP('paul', 0.6);
            lv('jyGentile', 1, b); sfx(b, 'harp');
            lampOn(b, 2, 'paul');
          }],
          [11.2, b => { time(0.765, 9, b); pose('paul', 'point'); }],
          [15.8, b => { crowdPose('city2R', 'raise'); crowdFaceX('city2R', X('paul2')); sfx(b, 'sing', { soft: true }); }],
          [17.2, b => { crowdPose('city2L', 'raise'); crowdFaceX('city2L', X('paul2')); pose('barnabas', 'raise'); }],
          [21.4, b => {
            pose('paul', 'stand'); pose('barnabas', 'stand'); glowP('paul', 0.3);
            crowdPose('city2R', 'stand'); crowdPose('city2L', 'stand');
            crowdFaceX('city2R', X('paul2')); crowdFaceX('city2L', X('paul2'));
          }],
        ]);
      },
    },
    // ── 三 · 使徒行传 14—15：路司得 → 安提阿 ─────────────────────
    {
      kind: 'act', utter: '神怎样为外邦人开了信道的门', cmd: 'open 信道的门 --for 外邦人', ref: '14:27', tint: [255, 240, 206],
      verse: [
        { text: '路司得城里坐着一个两脚无力的人，生来是瘸腿的，从来没有走过……保罗定睛看他……就大声说：「你起来，两脚站直！」那人就跳起来，而且行走。', ref: '使徒行传 14:8–10', hold: 8 },
        { text: '到了那里，聚集了会众，就述说神藉他们所行的一切事，并神怎样为外邦人开了信道的门。', ref: '使徒行传 14:27', hold: 7 },
        { text: '他们既奉了差遣，就下安提阿去，聚集众人，交付书信。众人念了，因为信上安慰的话就欢喜了。', ref: '使徒行传 15:30–31', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 240, 206]);
        TL(c, [
          [0, b => { time(0.36, 6, b); lv('jyGentile', 0, b); crowdRm('city2L'); crowdRm('city2R'); rm('paul'); rm('barnabas'); }],
          [0.8, b => { toPlace('lystra', b); }],
          [1.4, b => {
            placeName(b, 'lystra');
            add('lame', { label: '瘸腿的人', sex: 'm', robe: ROBE.lame, accent: [150, 136, 116], hair: 'cloth', beard: true, x: X('lame'), facing: -1, pose: 'sit', glow: 0.1 });
            crowd('lys', { n: 6, x0: X('lys')[0], x1: X('lys')[1], label: '路司得人' });
            crowd('lys2', { n: 4, x0: X('lys2')[0], x1: X('lys2')[1], label: '路司得人' });
            crowdFaceX('lys', X('paul3')); crowdFaceX('lys2', X('paul3'));
          }],
          [2.4, b => {
            reAdd('paul', 'paul', paulLook({ x: X('paul3'), facing: 1, pose: 'raise' }));
            reAdd('barnabas', 'disciple', barnLook({ x: X('barn3'), facing: 1 }));
          }],
          [4.2, b => { pose('paul', 'point'); face('paul', 1); }],
          [5.4, b => { flashAt(b, 'lame', [255, 244, 220], 28); pose('lame', 'stand'); glowP('lame', 0.45); sfx(b, 'harp'); }],
          [6.3, b => { const f = fpos('lame'); if (f) flyTo('lame', [f.x, f.y - f.h * 0.42], 0.4, 'raise'); }],
          [6.8, b => { const cc = C(); if (cc && cc.get('lame')) cc.fly('lame', X('lame'), null, { dur: 0.4, pose: 'raise' }); dust(b, X('lame') * W.w, gY(X('lame') * W.w), 14); }],
          [7.6, b => {
            landP('lame'); walk('lame', X('lame') + 0.05, { speed: 0.05, pose: 'raise' });
            crowdPose('lys', 'raise'); crowdPose('lys2', 'raise'); sfx(b, 'crowd');
            pose('paul', 'stand'); lampOn(b, 3, 'paul');
          }],
          [9.4, b => { rm('lame'); crowdRm('lys'); crowdRm('lys2'); rm('paul'); rm('barnabas'); }],
          [10.2, b => { toPlace('antioch', b); time(0.5, 6, b); }],
          [10.8, b => {
            reAdd('paul', 'paul', paulLook({ x: X('paul3b'), facing: 1 }));
            reAdd('barnabas', 'disciple', barnLook({ x: X('barn3b'), facing: 1 }));
            crowd('churchC', { n: 5, x0: X('church3')[0], x1: X('church3')[1], label: '安提阿的教会' });
            crowdFaceX('churchC', X('paul3b'));
          }],
          [12, b => { S.doorX = X('door'); lv('jyDoor', 1, b); sfx(b, 'gate'); sfx(b, 'harp', { soft: true }); pose('paul', 'point'); }],
          [13.4, b => {
            // 外邦人从光的门里出来，向左走进会众那里（面向教会）
            crowd('gent', { n: 6, x0: X('door') - 0.004, x1: X('door') + 0.004, label: '外邦人', from: 'light', glow: 0.3 });
            crowdWalk('gent', X('gentiles')[0], X('gentiles')[1], { speed: 0.022 });
          }],
          [16.4, b => { pose('paul', 'stand'); reAdd('silas', 'disciple', silasLook({ x: 1.04, facing: -1 })); walk('silas', X('silas3'), { speed: 0.06 }); }],
          [21.8, b => { crowdFaceX('gent', X('silas3')); crowdFaceX('churchC', X('silas3')); face('paul', 1); S.scrollId = 'silas'; pose('silas', 'carry'); lv('jyScroll', 1, b); sfx(b, 'scroll'); }],
          [23, b => { crowdPose('churchC', 'raise'); crowdPose('gent', 'raise'); pose('barnabas', 'raise'); sfx(b, 'sing', { soft: true }); }],
          [26, b => { crowdPose('churchC', 'stand'); crowdPose('gent', 'stand'); pose('barnabas', 'stand'); }],
        ]);
      },
    },
    // ── 四 · 使徒行传 15—16：特罗亚的异象 ────────────────────────
    {
      kind: 'call', utter: '神召我们传福音给那里的人听', cmd: 'ssh 马其顿  # 请你过来帮助我们', ref: '16:10', tint: [214, 226, 255],
      verse: [
        { text: '保罗拣选了西拉，也出去，蒙弟兄们把他交于主的恩中。', ref: '使徒行传 15:40', hold: 5.5 },
        { text: '在夜间有异象现与保罗。有一个马其顿人站着求他说：「请你过到马其顿来帮助我们。」', ref: '使徒行传 16:9', hold: 7 },
        { text: '保罗既看见这异象，我们随即想要往马其顿去，以为神召我们传福音给那里的人听。于是从特罗亚开船……', ref: '使徒行传 16:10–11', hold: 7.5 },
      ],
      apply(c) {
        ring(c, [214, 226, 255]);
        TL(c, [
          [0, b => {
            time(0.7, 7, b); lv('jyScroll', 0, b); lv('jyDoor', 0, b); crowdRm('gent');
            walk('barnabas', 1.08, { speed: 0.045 });
            walk('silas', X('part') + 0.028, { speed: 0.03 }); walk('paul', X('part'), { speed: 0.03 });
          }],
          [2.4, b => { pose('paul', 'kneel'); pose('silas', 'kneel'); crowdFaceX('churchC', X('part')); crowdPose('churchC', 'point'); crowdFaceX('churchC', X('part')); }],
          [3.8, b => { rm('barnabas'); }],
          [5.4, b => { pose('paul', 'stand'); pose('silas', 'stand'); walk('paul', 1.04, { speed: 0.04 }); walk('silas', 1.08, { speed: 0.04 }); crowdPose('churchC', 'raise'); }],
          [7, b => { rm('paul'); rm('silas'); crowdRm('churchC'); }],
          [7.8, b => { toPlace('troas', b); time(0.99, 5, b); shipShow(b, 'moor', -1); }],
          [8.6, b => { placeName(b, 'troas'); }],
          [9.6, b => {
            reAdd('paul', 'paul', paulLook({ x: X('sleep'), facing: -1, pose: 'lie', glow: 0.34 }));
            reAdd('silas', 'disciple', silasLook({ x: X('silas4'), facing: -1, pose: 'sit', glow: 0.26 }));
            reAdd('timothy', 'disciple', timLook({ x: X('tim4'), facing: -1, pose: 'sit', glow: 0.26 }));
            S.lampX = X('sleep') - 0.028; lv('jyLamp', 1, b);
          }],
          [11.8, b => {
            add('mac', { label: '马其顿人', sex: 'm', layer: 1, x: X('mac'), robe: [226, 220, 204], accent: [190, 176, 150], hair: 'short', beard: true, glow: 0.5, scale: 1.45, from: 'light', pose: 'raise', facing: X('mac') < X('sleep') ? 1 : -1 });
            lv('jyVision', 1, b); sfx(b, 'whisper'); sfx(b, 'angel', { soft: true });
          }],
          [15.4, b => { pose('paul', 'stand'); face('paul', X('mac') < X('sleep') ? -1 : 1); glowP('paul', 0.5); }],
          [17.6, b => { lv('jyVision', 0, b); rm('mac'); time(0.28, 6, b); pose('silas', 'stand'); pose('timothy', 'stand'); }],
          [19.2, b => {
            lv('jyLamp', 0, b); glowP('paul', 0.24);
            walk('paul', X('quay')[0] + 0.012, { speed: 0.045 }); walk('silas', X('quay')[0] + 0.03, { speed: 0.045 }); walk('timothy', X('quay')[0] + 0.048, { speed: 0.045 });
          }],
          [22, b => {
            board('paul', 'c'); board('silas', 'b'); board('timothy', 'a');
            ['paul', 'silas', 'timothy'].forEach(id => face(id, -1));
            lv('jySail', 1, b); sfx(b, 'wave', { soft: true });
          }],
          [23, b => { shipTo('off', b); }],
          [27.1, b => { lv('jySail', 1, b); }],
        ]);
      },
    },
    // ── 五 · 使徒行传 16：腓立比的河边 ───────────────────────────
    {
      kind: 'act', utter: '主就开导她的心', cmd: 'unlock 吕底亚.心  # 请到我家里来住', ref: '16:14', tint: [236, 206, 240],
      verse: [
        { text: '当安息日，我们出城门，到了河边，知道那里有一个祷告的地方，我们就坐下对那聚会的妇女讲道。', ref: '使徒行传 16:13', hold: 7 },
        { text: '有一个卖紫色布疋的妇人，名叫吕底亚……素来敬拜神。她听见了，主就开导她的心，叫她留心听保罗所讲的话。', ref: '使徒行传 16:14', hold: 8 },
        { text: '她和她一家既领了洗，便求我们说：「你们若以为我是真信主的，请到我家里来住」；于是强留我们。', ref: '使徒行传 16:15', hold: 7.5 },
      ],
      apply(c) {
        ring(c, [236, 206, 240]);
        TL(c, [
          [0, b => { time(0.36, 7, b); shipHide(b); for (const id of ['paul', 'silas', 'timothy']) { delete S.aboard[id]; rm(id, false); } lv('jySail', 0, b); }],
          [0.8, b => { toPlace('philippi', b); shipAt('moor', -1); }],
          [1.6, b => {
            placeName(b, 'philippi');
            const R = [[150, 108, 96], [128, 112, 130], [166, 132, 100]];
            ['w1', 'w2', 'w3'].forEach((id, i) => add(id, { label: '妇女', sex: 'f', robe: R[i], hair: 'veil', x: X('women')[i], v: 0.14, facing: 1, pose: 'sit', glow: 0.12 }));
            add('lydia', { label: '吕底亚', sex: 'f', robe: ROBE.lydia, accent: [222, 204, 226], hair: 'veil', x: X('lydia'), v: 0.14, facing: 1, pose: 'sit', glow: 0.18 });
          }],
          [2.4, b => {
            addLook('paul', 'paul', paulLook({ x: 1.04, facing: -1 })); addLook('silas', 'disciple', silasLook({ x: 1.08, facing: -1 })); addLook('timothy', 'disciple', timLook({ x: 1.11, facing: -1 }));
            walk('paul', X('paul5'), { speed: 0.05 }); walk('silas', X('silas5'), { speed: 0.05 }); walk('timothy', X('tim5'), { speed: 0.05 });
          }],
          [7.8, b => { pose('paul', 'sit'); pose('silas', 'sit'); pose('timothy', 'sit'); face('paul', -1); face('silas', -1); face('timothy', -1); }],
          [11.8, b => { S.heartId = 'lydia'; lv('jyHeart', 1, b); glowP('lydia', 0.55); flashAt(b, 'lydia', [255, 226, 180], 20); sfx(b, 'harp'); }],
          [15, b => { pose('lydia', 'stand'); pose('paul', 'stand'); }],
          [16.2, b => {
            add('lh1', { label: '吕底亚的家人', sex: 'm', robe: [140, 110, 96], beard: true, x: X('lhouse') - 0.01, facing: -1, glow: 0.12 });
            add('lh2', { label: '吕底亚的家人', sex: 'f', age: 'child', robe: [180, 150, 170], x: X('lhouse') + 0.012, facing: -1, glow: 0.12 });
            walk('lh1', X('bapt') + 0.028, { speed: 0.05 }); walk('lh2', X('bapt') + 0.05, { speed: 0.05 });
            walk('lydia', X('bapt'), { speed: 0.03 }); walk('paul', X('bapt') + 0.078, { speed: 0.04 });
          }],
          [19.6, b => {
            for (const id of ['lydia', 'lh1', 'lh2']) { const p = person(id); if (p) p.v = riverYAt(p.tx != null ? p.tx : p.nx) - 0.03; }
            lv('jyBapt', 1, b); sfx(b, 'splash'); sfx(b, 'harp', { soft: true }); pose('paul', 'raise');
          }],
          [22.6, b => { lv('jyBapt', 0, b); for (const id of ['lydia', 'lh1', 'lh2']) setV(id, 0.08); lv('jyHeart', 0.4, b); pose('paul', 'stand'); }],
          [23.2, b => {
            walk('lydia', X('lhouse') - 0.05, { speed: 0.035, pose: 'point' }); walk('lh1', X('lhouse') - 0.022, { speed: 0.035 }); walk('lh2', X('lhouse'), { speed: 0.035 });
            lampOn(b, 4, 'lydia');
          }],
          [24.6, b => { walk('paul', X('lhouse') - 0.085, { speed: 0.03 }); walk('silas', X('lhouse') - 0.11, { speed: 0.03 }); walk('timothy', X('lhouse') - 0.13, { speed: 0.03 }); }],
        ]);
      },
    },
    // ── 六 · 使徒行传 16：半夜的监 ───────────────────────────────
    {
      kind: 'act', utter: '监门立刻全开，众囚犯的锁链也都松开了', cmd: 'kill -HUP 监门 && release --all 锁链', ref: '16:26', tint: [255, 226, 180],
      verse: [
        { text: '禁卒领了这样的命，就把他们下在内监里，两脚上了木狗。', ref: '使徒行传 16:24', hold: 5.5 },
        { text: '约在半夜，保罗和西拉祷告，唱诗赞美神，众囚犯也侧耳而听。', ref: '使徒行传 16:25', hold: 6 },
        { text: '忽然，地大震动，甚至监牢的地基都摇动了，监门立刻全开，众囚犯的锁链也都松开了。', ref: '使徒行传 16:26', hold: 7 },
        { text: '禁卒……战战兢兢地俯伏在保罗、西拉面前；又领他们出来，说：「二位先生，我当怎样行才可以得救？」他们说：「当信主耶稣，你和你一家都必得救。」', ref: '使徒行传 16:29–31', hold: 8 },
      ],
      apply(c) {
        ring(c, [255, 226, 180]);
        TL(c, [
          [0, b => { time(0.96, 7, b); for (const id of ['w1', 'w2', 'w3', 'lydia', 'lh1', 'lh2', 'timothy', 'paul', 'silas']) rm(id); lv('jyHeart', 0, b); }],
          [0.8, b => { toPlace('prison', b); W.set('jyQuake', 0, true); W.set('jyStocks', 1, true); }],
          [2.2, b => {
            reAdd('paul', 'paul', paulLook({ x: X('paul6'), facing: 1, pose: 'sit', glow: 0.36 }));
            reAdd('silas', 'disciple', silasLook({ x: X('silas6'), facing: -1, pose: 'sit', glow: 0.32 }));
            chain('paul'); chain('silas');
            // 众囚犯也在内监里，坐在二人的左边侧耳而听
            add('pr1', { label: '囚犯', sex: 'm', robe: ROBE.prisoner, hair: 'cloth', beard: true, x: X('prisoners')[0], facing: 1, pose: 'sit', glow: 0.1 });
            add('pr2', { label: '囚犯', sex: 'm', robe: [92, 88, 84], hair: 'short', beard: true, x: X('prisoners')[1], facing: 1, pose: 'sit', glow: 0.1 });
            chain('pr1'); chain('pr2');
            add('jailer', { label: '禁卒', sex: 'm', robe: ROBE.jailer, accent: [170, 150, 120], hair: 'short', beard: true, x: X('jailer'), facing: -1, prop: 'torch', glow: 0.24 });
          }],
          [5.4, b => { pose('jailer', 'sit'); }],
          [7, b => { lv('jySing', 1, b); sfx(b, 'sing'); glowP('paul', 0.5); glowP('silas', 0.46); }],
          [9.6, b => { face('pr1', 1); face('pr2', 1); glowP('pr1', 0.22); glowP('pr2', 0.22); }],
          [14.4, b => {
            if (!inst(b)) { W.shake = 1; W.flash = 0.25; }
            sfx(b, 'quake'); sfx(b, 'collapse', { soft: true });
            lv('jyQuake', 1, b); lv('jyStocks', 0, b);
            ['paul', 'silas', 'pr1', 'pr2'].forEach(id => unchain(id, b));
            if (!inst(b)) { const G = prisonG(); dust(b, (G.x0 + G.x1) / 2, G.ceil + 4, 30, [150, 140, 126], (G.x1 - G.x0) * 0.4); }
            sfx(b, 'chains', { soft: true });
          }],
          [15.6, b => { pose('pr1', 'stand'); pose('pr2', 'stand'); lv('jySing', 0.5, b); }],
          [16.6, b => { pose('jailer', 'stand'); face('jailer', -1); }],
          [18, b => { pose('paul', 'raise'); pose('silas', 'stand'); }],
          // 禁卒跳进内监，俯伏在保罗、西拉面前（在二人的前面，面向他们）
          [19.4, b => { run('jailer', X('silas6') + (tall() ? 0.06 : 0.045), { speed: 0.085 }); }],
          [22.6, b => { pose('jailer', 'fall'); face('jailer', -1); pose('paul', 'stand'); }],
          [25.2, b => { pose('jailer', 'kneel'); face('jailer', -1); }],
          // 又领他们出来：到外监的灯下；他的家人拿着光从外门进来
          [26.6, b => {
            const m = X('meet6');
            walk('silas', m[0], { speed: 0.04 }); walk('paul', m[1], { speed: 0.04 }); walk('jailer', m[2], { speed: 0.04 });
            lv('jySing', 0, b); glowP('jailer', 0.34);
            crowd('jfam', { n: 3, x0: X('jfam0')[0], x1: X('jfam0')[1], label: '禁卒的家人', glow: 0.34, mill: false });
            crowdWalk('jfam', X('jfam')[0], X('jfam')[1], { speed: 0.04 });
          }],
          [29.6, b => {
            face('paul', 1); face('silas', 1); face('jailer', -1); crowdFaceX('jfam', X('meet6')[1]);
            pose('paul', 'raise'); crowdPose('jfam', 'raise'); glowP('jailer', 0.42); flashAt(b, 'jailer', [255, 230, 190], 20); sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
    // ── 七 · 使徒行传 17：雅典 ───────────────────────────────────
    {
      kind: 'act', utter: '我们生活、动作、存留，都在乎他', cmd: 'grep -r 未识之神 /雅典  # 其实他离我们各人不远', ref: '17:28', tint: [255, 232, 186],
      verse: [
        { text: '保罗在雅典等候他们的时候，看见满城都是偶像，就心里着急', ref: '使徒行传 17:16', hold: 5.5 },
        { text: '保罗站在亚略‧巴古当中，说：「……我游行的时候，观看你们所敬拜的，遇见一座坛，上面写着『未识之神』。你们所不认识而敬拜的，我现在告诉你们。」', ref: '使徒行传 17:22–23', hold: 8.5 },
        { text: '「要叫他们寻求神，或者可以揣摩而得，其实他离我们各人不远；我们生活、动作、存留，都在乎他。」', ref: '使徒行传 17:27–28', hold: 7.5 },
        { text: '但有几个人贴近他，信了主……', ref: '使徒行传 17:34', hold: 4.5 },
      ],
      apply(c) {
        ring(c, [255, 232, 186]);
        TL(c, [
          [0, b => { time(0.46, 10, b); for (const id of ['jailer', 'pr1', 'pr2', 'silas', 'paul']) rm(id); crowdRm('jfam'); S.chains = {}; }],
          [0.8, b => { toPlace('athens', b); }],
          [1.4, b => { lampOn(b, 5); }],
          [2.4, b => {
            W.set('jyQuake', 0, true); W.set('jyStocks', 0, true);
            placeName(b, 'athens');
            reAdd('paul', 'paul', paulLook({ x: X('athens')[0], facing: 1 }));
            walk('paul', X('athens')[1], { speed: 0.022, pose: 'gaze' });
            crowd('ath', { n: 6, x0: X('stoa')[0] - 0.02, x1: X('stoa')[1], label: '雅典人' });
          }],
          [8.8, b => {
            flyTo('paul', rockTop(), 1.4, 'stand');
            crowdWalk('ath', X('near7')[0], X('near7')[1], { speed: 0.03 });
            crowd('ath2', { n: 4, x0: 1.0, x1: 1.08, label: '雅典人' });
            crowdWalk('ath2', X('near7')[2], X('near7')[3], { speed: 0.035 });
          }],
          [11.2, b => { pose('paul', 'raise'); face('paul', -1); }],
          [12, b => { lv('jyAltar', 1, b); const G = altarG(); nameAt(b, '未识之神', G.x, G.g - G.h - 1.35 * G.B, [236, 214, 170], 4); sfx(b, 'write', { soft: true }); }],
          [15.4, b => { crowdFaceX('ath', X('rock')); crowdFaceX('ath2', X('rock')); }],
          [19, b => {
            lv('jyKnown', 1, b); lv('bloom', 0.9, b); lv('grass', 0.75, b); lv('bare', 0.15, b); lv('jyAltar', 0, b);
            flashAt(b, 'paul', [255, 236, 190], 40);
            if (!inst(b)) { const f = fpos('paul'); if (f) safe('jy.known', () => fx().ring(f.x, f.y - f.h, [255, 226, 170], M() * 0.8, 3.2, 2)); }
            W.setPop('bird', 34, X('rock') * W.w, W.h * 0.4, inst(b));
            sfx(b, 'harp'); sfx(b, 'bird', { soft: true });
          }],
          [23.4, b => { lv('jyKnown', 0.3, b); pose('paul', 'stand'); crowdWalk('ath2', 1.03, 1.1, { speed: 0.03 }); }],
          [24.8, b => {
            add('dionysius', { label: '丢尼修', sex: 'm', age: 'elder', robe: ROBE.dionysius, accent: [150, 60, 60], x: X('rock') - (tall() ? 0.1 : 0.058), facing: 1, glow: 0.2 });
            add('damaris', { label: '大马哩', sex: 'f', robe: ROBE.damaris, hair: 'veil', x: X('rock') + (tall() ? 0.1 : 0.062), facing: -1, glow: 0.2 });
          }],
          [26.8, b => { glowP('dionysius', 0.42); glowP('damaris', 0.42); pose('dionysius', 'kneel'); pose('damaris', 'kneel'); lampOn(b, 6, 'paul'); crowdRm('ath2'); }],
        ]);
      },
    },
    // ── 八 · 使徒行传 18：哥林多 ★ ───────────────────────────────
    {
      kind: 'promise', utter: '不要怕，只管讲，不要闭口', cmd: 'echo 只管讲  # 在这城里我有许多的百姓', ref: '18:9', tint: [230, 236, 255], hold: 3.6,
      verse: [
        { text: '这事以后，保罗离了雅典，来到哥林多……他们本是制造帐棚为业。保罗因与他们同业，就和他们同住做工。', ref: '使徒行传 18:1–3', hold: 7.5 },
        { text: '夜间，主在异象中对保罗说：「不要怕，只管讲，不要闭口，有我与你同在，必没有人下手害你，因为在这城里我有许多的百姓。」', ref: '使徒行传 18:9–10', hold: 9 },
        { text: '保罗在那里住了一年零六个月，将神的道教训他们。', ref: '使徒行传 18:11', hold: 5.5 },
      ],
      apply(c) {
        ring(c, [230, 236, 255]);
        TL(c, [
          [0, b => { time(0.56, 7, b); lv('jyKnown', 0, b); crowdRm('ath'); rm('dionysius'); rm('damaris'); rm('paul'); }],
          [0.8, b => { toPlace('corinth', b); }],
          [1.6, b => {
            placeName(b, 'corinth');
            add('aquila', { label: '亚居拉', sex: 'm', robe: ROBE.aquila, accent: [196, 176, 146], beard: true, x: X('aquila'), facing: 1, pose: 'sit', glow: 0.18 });
            add('prisca', { label: '百基拉', sex: 'f', robe: ROBE.prisca, accent: [214, 196, 176], hair: 'veil', x: X('prisca'), facing: -1, pose: 'sit', glow: 0.18 });
          }],
          [2.2, b => { reAdd('paul', 'paul', paulLook({ x: X('tents')[0] - 0.1, facing: 1 })); walk('paul', X('paul8'), { speed: 0.035 }); }],
          [6.4, b => { pose('paul', 'sit'); face('paul', 1); }],
          [7, b => { time(0.97, 5, b); }],
          [8.8, b => { walk('aquila', X('corHouses')[0], { speed: 0.035 }); walk('prisca', X('corHouses')[0] + 0.02, { speed: 0.035 }); S.lampX = X('paul8') + 0.024; lv('jyLamp', 1, b); }],
          [10.6, b => { rm('aquila'); rm('prisca'); pose('paul', 'kneel'); }],
          [11.2, b => { S.lordX = X('paul8') + (tall() ? 0.075 : 0.042); S.lordY = 0; lv('jyLord', 1, b); sfx(b, 'angel'); face('paul', 1); glowP('paul', 0.5); }],
          [13.4, b => { pose('paul', 'gaze'); }],
          [15.6, b => { lv('jyCityL', 1, b); sfx(b, 'stars'); sfx(b, 'chime', { soft: true }); }],
          [19.4, b => { lv('jyLord', 0, b); time(0.4, 6, b); }],
          [21.2, b => {
            lv('jyLamp', 0, b);
            crowd('cor', { n: 5, x0: X('cor')[0], x1: X('cor')[1], label: '哥林多人', pose: 'sit' });
            crowd('cor2', { n: 5, x0: X('cor')[2], x1: X('cor')[3], label: '哥林多人', pose: 'sit' });
            crowdFaceX('cor', X('paul8')); crowdFaceX('cor2', X('paul8'));
            pose('paul', 'raise'); glowP('paul', 0.3); lampOn(b, 7, 'paul');
          }],
        ]);
      },
    },
    // ── 九 · 使徒行传 19—20：米利都 ──────────────────────────────
    {
      kind: 'bless', utter: '施比受更为有福', cmd: 'give > receive  # 当记念主耶稣的话', ref: '20:35', tint: [255, 228, 190],
      verse: [
        { text: '这样有两年之久，叫一切住在亚细亚的，无论是犹太人，是希腊人，都听见主的道。', ref: '使徒行传 19:10', hold: 6.5 },
        { text: '保罗从米利都打发人往以弗所去，请教会的长老来。', ref: '使徒行传 20:17', hold: 5 },
        { text: '「我凡事给你们作榜样，叫你们知道应当这样劳苦，扶助软弱的人，又当记念主耶稣的话，说：『施比受更为有福。』」', ref: '使徒行传 20:35', hold: 7.5 },
        { text: '保罗说完了这话，就跪下同众人祷告。众人痛哭，抱着保罗的颈项……于是送他上船去了。', ref: '使徒行传 20:36–38', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 228, 190]);
        TL(c, [
          [0, b => { time(0.63, 8, b); crowdRm('cor'); crowdRm('cor2'); lv('jyCityL', 0, b); rm('paul'); lampOn(b, 8); }],
          [0.8, b => { toPlace('miletus', b); shipShow(b, 'moor', -1); }],
          [1.6, b => {
            placeName(b, 'miletus');
            reAdd('paul', 'paul', paulLook({ x: X('paul9'), facing: 1 }));
            reAdd('timothy', 'disciple', timLook({ x: X('tim9'), facing: 1 }));
          }],
          [5.2, b => {
            X('elders').forEach((x, i) => {
              add('el' + i, { label: '以弗所的长老', sex: 'm', age: i % 2 ? 'elder' : 'adult', robe: mix(ROBE.elder, DR(i + 3), 0.5), beard: true, x: 1.03 + i * 0.02, facing: -1, glow: 0.14 });
              walk('el' + i, x, { speed: 0.06 });
            });
          }],
          [12.4, b => { X('elders').forEach((x, i) => face('el' + i, -1)); pose('paul', 'raise'); face('paul', 1); }],
          [18, b => {
            pose('paul', 'point'); glowP('paul', 0.5);
            flashAt(b, 'paul', [255, 232, 190], 30);
            if (!inst(b)) X('elders').forEach((x, i) => { const f = fpos('el' + i); if (f) FXL.push({ type: 'ring', t: 0, dur: 2.2, x: f.x, y: f.y - f.h * 0.5, r: f.h * 1.2, c: [255, 226, 170], w: 1.5, flat: 0.8 }); });
            sfx(b, 'harp');
          }],
          [21, b => { pose('paul', 'pray'); pose('timothy', 'kneel'); X('elders').forEach((x, i) => pose('el' + i, i % 2 ? 'pray' : 'kneel')); glowP('paul', 0.3); sfx(b, 'weep', { soft: true }); }],
          [23.2, b => {
            X('elders').forEach((x, i) => { if (i) pose('el' + i, 'weep'); });
            pose('timothy', 'stand');
            const cc = C(); if (cc && cc.embrace) cc.embrace('paul', 'el0', { weep: true });
          }],
          [25.2, b => {
            const pp = person('paul'), e0 = person('el0'); if (pp) { pp.embrace = null; pp.sobbing = false; } if (e0) { e0.embrace = null; }
            pose('el0', 'weep');
            walk('paul', X('quay')[0] + 0.012, { speed: 0.045 }); walk('timothy', X('quay')[0] + 0.032, { speed: 0.045 });
          }],
          [26.6, b => {
            board('paul', 'c'); board('timothy', 'b'); face('paul', 1); face('timothy', 1);
            lv('jySail', 1, b);
            X('elders').forEach((x, i) => pose('el' + i, 'raise'));
          }],
          [27.2, b => { shipTo('off', b); }],
          [31.3, b => { lv('jySail', 1, b); }],
        ]);
      },
    },
    // ── 十 · 使徒行传 21—23：耶路撒冷 ────────────────────────────
    {
      kind: 'promise', utter: '放心吧！', cmd: 'route 保罗 --via 耶路撒冷 --to 罗马', ref: '23:11', tint: [236, 232, 255], hold: 2.8,
      verse: [
        { text: '合城都震动，百姓一齐跑来，拿住保罗，拉他出殿……千夫长上前拿住他，吩咐用两条铁链捆锁', ref: '使徒行传 21:30–33', hold: 7 },
        { text: '保罗就站在台阶上，向百姓摆手，他们都静默无声……「主向我说：『你去吧！我要差你远远地往外邦人那里去。』」', ref: '使徒行传 21:40—22:21', hold: 8 },
        { text: '当夜，主站在保罗旁边，说：「放心吧！你怎样在耶路撒冷为我作见证，也必怎样在罗马为我作见证。」', ref: '使徒行传 23:11', hold: 8 },
      ],
      apply(c) {
        ring(c, [236, 232, 255]);
        TL(c, [
          [0, b => {
            time(0.44, 8, b); shipHide(b);
            for (const id of ['paul', 'timothy']) { delete S.aboard[id]; rm(id, false); }
            for (let i = 0; i < 6; i++) rm('el' + i);
            lv('jySail', 0, b);
          }],
          [0.8, b => { toPlace('jerusalem', b); shipAt('moor', 1); }],
          [1.4, b => {
            placeName(b, 'jerusalem');
            addLook('paul', 'paul', paulLook({ x: X('paul10'), facing: 1 }));
            crowd('jer', { n: 10, x0: X('jer')[0], x1: X('jer')[1], label: '百姓' });
            crowdFaceX('jer', X('paul10'));
          }],
          [3, b => { crowdWalk('jer', X('paul10') - 0.08, X('paul10') + 0.075, { speed: 0.04, pose: 'raise' }); sfx(b, 'crowd'); sfx(b, 'shout', { soft: true }); }],
          [4.2, b => {
            soldier('s1', X('stair')[0] + 0.02); soldier('s2', X('stair')[0] + 0.05);
            add('tribune', { label: '千夫长', sex: 'm', robe: ROBE.tribune, accent: [224, 192, 120], hair: 'short', x: X('stair')[0] + 0.035, facing: -1, glow: 0.16, prop: 'blade' });
            run('s1', X('paul10') + 0.028, { speed: 0.08 }); run('s2', X('paul10') + 0.06, { speed: 0.08 }); walk('tribune', X('paul10') + 0.09, { speed: 0.06 });
          }],
          [7, b => { chain('paul', 's1'); sfx(b, 'chains'); face('s1', -1); crowdWalk('jer', X('jer')[0] - 0.02, X('paul10') - 0.035, { speed: 0.03, pose: 'raise' }); }],
          [8.6, b => { walk('paul', X('stair')[0], { speed: 0.045 }); walk('s1', X('stair')[0] + 0.02, { speed: 0.045 }); walk('s2', X('stair')[0] - 0.025, { speed: 0.045 }); walk('tribune', X('stair')[0] + 0.045, { speed: 0.045 }); }],
          [11.6, b => { flyTo('paul', stairTop(), 1.2, 'stand'); const q = stairTop(); flyTo('s1', [q[0] + 0.55 * BU(), q[1]], 1.3, 'stand'); }],
          [13.2, b => { face('paul', -1); pose('paul', 'raise'); crowdPose('jer', 'stand'); crowdFaceX('jer', X('stair')[1]); }],
          [16.6, b => { crowdPose('jer', 'raise'); crowdFaceX('jer', X('stair')[1]); sfx(b, 'shout'); }],
          [18, b => { time(0.01, 5, b); crowdRm('jer'); rm('s2'); rm('tribune'); pose('paul', 'sit'); face('s1', -1); }],
          [20.2, b => {
            // 主的光站在台阶上、保罗的旁边：脚落在那一级台阶的面上
            const q = stairTop(), G = fortG(), lx = q[0] - (tall() ? 0.07 : 0.036) * W.w;
            const t = clamp((lx - G.sx0) / Math.max(1, G.sx1 - G.sx0), 0, 1);
            S.lordX = lx / W.w; S.lordY = lerp(G.g + 0.1 * G.B, G.land, t) / W.h;
            lv('jyLord', 1, b); sfx(b, 'angel'); face('paul', -1); glowP('paul', 0.45);
          }],
          [23.2, b => { pose('paul', 'stand'); lv('jyWest', 1, b); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },
    // ── 十一 · 使徒行传 24—26：凯撒利亚 ──────────────────────────
    {
      kind: 'call', utter: '从黑暗中归向光明', cmd: 'mv 黑暗 光明  # 比日头还亮', ref: '26:18', tint: [255, 244, 214],
      verse: [
        { text: '保罗讲论公义、节制，和将来的审判。腓力斯甚觉恐惧，说：「你暂且去吧，等我得便再叫你来。」', ref: '使徒行传 24:25', hold: 6.8 },
        { text: '保罗说：「……我要上告于凯撒。」非斯都和议会商量了，就说：「你既上告于凯撒，可以往凯撒那里去。」', ref: '使徒行传 25:10–12', hold: 6.3 },
        { text: '「王啊，我在路上，晌午的时候，看见从天发光，比日头还亮，四面照着我并与我同行的人。」', ref: '使徒行传 26:13', hold: 6.3 },
        { text: '主说：『……我差你到他们那里去，要叫他们的眼睛得开，从黑暗中归向光明，从撒但权下归向神……』', ref: '使徒行传 26:15–18', hold: 7 },
      ],
      apply(c) {
        ring(c, [255, 244, 214]);
        TL(c, [
          [0, b => { time(0.4, 8, b); lv('jyLord', 0, b); lv('jyWest', 0, b); rm('paul'); rm('s1'); }],
          [0.8, b => { toPlace('caesarea', b); shipShow(b, 'moor', 1); lv('jyDark', 1, b); }],
          [1.6, b => {
            placeName(b, 'caesarea');
            reAdd('paul', 'paul', paulLook({ x: X('paul11'), facing: 1 }));
            reAdd('s1', null, { label: '兵丁', sex: 'm', robe: ROBE.roman, accent: ROMAN_ACC, hair: 'short', beard: false, prop: 'spear', x: X('guard11')[0], facing: 1, glow: 0.12 });
            soldier('s2', X('guard11')[1], { facing: -1 });
            chain('paul', 's1');
            add('felix', { label: '腓力斯', sex: 'm', robe: ROBE.felix, accent: [150, 60, 80], hair: 'short', x: seatPt(1)[0] / W.w, facing: -1, pose: 'seat', glow: 0.12 });
            attachSeat('felix', 1);
          }],
          [3, b => { pose('paul', 'raise'); face('paul', 1); }],
          [5.8, b => { pose('felix', 'point'); }],
          [7.4, b => { time(0.39, 6, b); pose('paul', 'stand'); }],
          [8.2, b => { rm('felix'); }],
          [10, b => {
            add('festus', { label: '非斯都', sex: 'm', robe: ROBE.festus, accent: [120, 60, 60], hair: 'short', x: seatPt(2)[0] / W.w, facing: -1, pose: 'seat', glow: 0.12 });
            attachSeat('festus', 2); pose('paul', 'raise');
          }],
          [12.6, b => { pose('festus', 'point'); sfx(b, 'seal', { soft: true }); }],
          [14.6, b => {
            pose('festus', 'seat'); pose('paul', 'stand');
            add('agrippa', { label: '亚基帕王', sex: 'm', robe: ROBE.agrippa, accent: [236, 200, 110], hair: 'short', beard: true, x: seatPt(1)[0] / W.w, facing: -1, pose: 'seat', glow: 0.14 });
            attachSeat('agrippa', 1);
            add('bernice', { label: '百妮基', sex: 'f', robe: ROBE.bernice, accent: [240, 214, 160], hair: 'veil', x: seatPt(0)[0] / W.w, facing: -1, pose: 'seat', glow: 0.12 });
            attachSeat('bernice', 0);
            crowd('pomp', { n: 4, x0: X('hall')[1] - 0.04, x1: X('hall')[1] + 0.02, label: '尊贵人', robe: [150, 64, 60] });
            sfx(b, 'trumpet', { soft: true });
          }],
          [16.8, b => { pose('paul', 'point'); face('paul', 1); }],
          [18.2, b => { lv('jyNoon', 1, b); if (!inst(b)) W.flash = 0.45; sfx(b, 'harp'); sfx(b, 'thunder', { soft: true }); }],
          [21.8, b => { lv('jyNoon', 0.25, b); pose('paul', 'raise'); }],
          [25.6, b => {
            lv('jyDark', 0, b); lv('jyNoon', 0, b); lv('jyHallLit', 1, b);
            flashAt(b, 'paul', [255, 244, 220], 36); sfx(b, 'chime');
            if (!inst(b)) { const G = hallG(); safe('jy.hallRing', () => fx().ring((G.x0 + G.x1) / 2, G.g - G.H * 0.5, [255, 240, 210], (G.x1 - G.x0), 2.4, 1.6)); }
          }],
          [28, b => { pose('paul', 'stand'); }],
        ]);
      },
    },
    // ── 十二 · 使徒行传 27：友拉革罗 ──────────────────────────────
    {
      kind: 'promise', utter: '保罗，不要害怕，你必定站在凯撒面前', cmd: "trap 'echo 不要害怕' 友拉革罗", ref: '27:24', tint: [214, 226, 255],
      verse: [
        { text: '……叫我们坐船往意大利去，便将保罗和别的囚犯交给御营里的一个百夫长，名叫犹流。', ref: '使徒行传 27:1', hold: 6 },
        { text: '不多几时，狂风从岛上扑下来；那风名叫「友拉革罗」。船被风抓住，敌不住风，我们就任风刮去。', ref: '使徒行传 27:14–15', hold: 7 },
        { text: '太阳和星辰多日不显露，又有狂风大浪催逼，我们得救的指望就都绝了。', ref: '使徒行传 27:20', hold: 5.5 },
        { text: '「因我所属所事奉的神，他的使者昨夜站在我旁边，说：『保罗，不要害怕，你必定站在凯撒面前，并且与你同船的人，神都赐给你了。』」', ref: '使徒行传 27:23–24', hold: 8.5 },
      ],
      apply(c) {
        ring(c, [214, 226, 255]);
        TL(c, [
          [0, b => { time(0.44, 5, b); for (const id of ['felix', 'festus', 'agrippa', 'bernice', 's2']) rm(id); crowdRm('pomp'); lv('jyDark', 0, b); lv('jyNoon', 0, b); lv('jyHallLit', 0, b); }],
          [0.8, b => {
            const q = X('quay');
            add('julius', Object.assign(JULIUS(), { x: q[1] + 0.03, facing: -1 }));
            add('aristarchus', Object.assign(ARIST(), { x: q[1] + 0.055, facing: -1 }));
            add('pr3', { label: '囚犯', sex: 'm', robe: ROBE.prisoner, hair: 'cloth', beard: true, x: q[1] + 0.075, facing: -1, glow: 0.1 });
            walk('paul', q[0] + 0.02, { speed: 0.04 }); walk('s1', q[0] + 0.035, { speed: 0.04 });
            walk('julius', q[0] + 0.01, { speed: 0.045 }); walk('aristarchus', q[0] + 0.045, { speed: 0.045 }); walk('pr3', q[0] + 0.06, { speed: 0.045 });
          }],
          [3.6, b => {
            board('julius', 'a'); board('aristarchus', 'b'); board('s1', 'f'); board('paul', 'c'); board('pr3', 'e');
            ['julius', 'aristarchus', 's1', 'paul', 'pr3'].forEach(id => face(id, 1));
            chain('paul', 's1');
          }],
          [5, b => { lv('jySail', 1, b); lv('gale', 0.25, b); lv('clouds', 0.55, b); sfx(b, 'wave', { soft: true }); }],
          [6.6, b => { toPlace('crete', b); shipTo('sea', b); }],
          [8.6, b => {
            lv('gale', 1, b); lv('storm', 0.9, b); lv('rain', 0.55, b); lv('clouds', 1, b); lv('jyStorm', 1, b);
            time(0.86, 6, b); sfx(b, 'wind'); sfx(b, 'thunder'); sfx(b, 'wave');
          }],
          [9.6, b => { bolt(b, 0.78); }],
          [10.8, b => { ['aristarchus', 'pr3', 'julius', 'paul'].forEach(id => pose(id, 'kneel')); }],
          [13.4, b => { bolt(b, 0.62, true); }],
          [17.4, b => { bolt(b, 0.9); }],
          [20.2, b => { bolt(b, 0.7, true); sfx(b, 'thunder'); }],
          [11.6, b => { lv('jySail', 0, b); pose('sailor2', 'carry'); }],
          [12.8, b => { crates(b); sfx(b, 'splash'); }],
          [14.4, b => { crates(b); sfx(b, 'splash'); pose('sailor2', 'stand'); }],
          [15.6, b => { time(0.96, 5, b); lv('gloom', 0.3, b); ['aristarchus', 'pr3'].forEach(id => pose(id, 'weep')); ['julius', 'aristarchus', 'pr3', 's1', 'sailor1', 'sailor2'].forEach(id => glowP(id, 0.3)); glowP('paul', 0.4); sfx(b, 'thunder'); }],
          [22.4, b => {
            add('angel', { label: '神的使者', sex: 'm', angel: true, glow: 1, x: deckPt('d')[0] / W.w, from: 'light', facing: -1 });
            board('angel', 'd'); face('angel', -1);
            lv('jyAngel', 1, b); sfx(b, 'angel');
            pose('paul', 'stand'); face('paul', 1); glowP('paul', 0.5);
          }],
          [26.6, b => { pose('paul', 'raise'); face('paul', -1); ['aristarchus', 'pr3', 'julius'].forEach(id => pose(id, 'stand')); }],
          [29.8, b => { rm('angel'); delete S.aboard.angel; lv('jyAngel', 0.45, b); glowP('paul', 0.34); }],
        ]);
      },
    },
    // ── 十三 · 使徒行传 27：搁浅，众人都上了岸 ────────────────────
    {
      kind: 'act', utter: '这样，众人都得了救，上了岸', cmd: 'count 276 --saved all', ref: '27:44', tint: [255, 236, 206],
      verse: [
        { text: '保罗说了这话，就拿着饼，在众人面前祝谢了神，擘开吃。', ref: '使徒行传 27:35', hold: 5.5 },
        { text: '到了天亮，他们不认识那地方，但见一个海湾，有岸可登，就商议能把船拢进去不能。', ref: '使徒行传 27:39', hold: 6 },
        { text: '但遇着两水夹流的地方，就把船搁了浅；船头胶住不动，船尾被浪的猛力冲坏。', ref: '使徒行传 27:41', hold: 6 },
        { text: '其余的人可以用板子或船上的零碎东西上岸。这样，众人都得了救，上了岸。', ref: '使徒行传 27:44', hold: 6.5 },
      ],
      apply(c) {
        ring(c, [255, 236, 206]);
        TL(c, [
          [0, b => {
            time(0.16, 6, b); lv('storm', 0.45, b); lv('rain', 0.2, b); lv('gale', 0.5, b); lv('gloom', 0.25, b); lv('jyStorm', 0.5, b); lv('jyAngel', 0, b);
            S.breadId = 'paul';
          }],
          [0.8, b => { pose('paul', 'raise'); lv('jyBread', 1, b); sfx(b, 'chime', { soft: true }); glowP('paul', 0.45); }],
          [3.2, b => { pose('paul', 'stand'); ['aristarchus', 'pr3', 'julius', 's1'].forEach(id => pose(id, 'stand')); sfx(b, 'harp', { soft: true }); }],
          [5.8, b => { lv('jyBread', 0, b); glowP('paul', 0.3); }],
          [6.8, b => { time(0.29, 8, b); lv('storm', 0.05, b); lv('rain', 0, b); lv('gloom', 0, b); lv('gale', 0.35, b); lv('clouds', 0.5, b); lv('jyStorm', 0.22, b); }],
          [8, b => { toPlace('malta', b); }],
          [11.4, b => { lv('jySail', 0.45, b); shipTo('reef', b); sfx(b, 'wave', { soft: true }); }],
          [15.4, b => {
            lv('jyWreck', 1, b); lv('jySail', 0, b); lv('jyStorm', 0, b);
            if (!inst(b)) { W.shake = 0.7; planks(); }
            sfx(b, 'collapse'); sfx(b, 'shatter', { soft: true }); sfx(b, 'wave');
            ['aristarchus', 'pr3', 'julius', 's1', 'paul', 'sailor1', 'sailor2'].forEach(id => pose(id, 'kneel'));
          }],
          [17.6, b => {
            unchain('paul', b);
            const A = X('shore13');
            ashore(b, 'sailor1', A.sailor1); ashore(b, 'sailor2', A.sailor2); ashore(b, 'julius', A.julius);
            if (!inst(b)) { const P = shipPos(), u = shipU(); for (let i = 0; i < 3; i++) FXL.push({ type: 'ring', t: 0, dur: 1.6, x: P.x + S.shipDir * (1.6 + i * 0.4) * u, y: P.y + 0.1 * u, r: 0.8 * u, c: [226, 240, 255], w: 1.2, flat: 0.25 }); }
            sfx(b, 'splash');
          }],
          [19, b => { const A = X('shore13'); ashore(b, 's1', A.s1); ashore(b, 'aristarchus', A.aristarchus); ashore(b, 'pr3', A.pr3); sfx(b, 'splash'); }],
          [20.4, b => { ashore(b, 'paul', X('shore13').paul); sfx(b, 'splash', { soft: true }); }],
          [21.8, b => { crowd('saved', { n: 12, x0: X('saved')[0], x1: X('saved')[1], label: '同船的人' }); }],
          [24.2, b => {
            flashAt(b, 'paul', [255, 240, 210], 30);
            if (!inst(b)) { const r = X('saved'), mx = (r[0] + r[1]) / 2; safe('jy.savedRing', () => fx().ring(mx * W.w, gY(mx * W.w) - H2() * 0.5, [255, 236, 200], (r[1] - r[0] + 0.2) * W.w, 2.6, 1.6)); }
            pose('paul', 'pray'); crowdPose('saved', 'kneel'); sfx(b, 'harp');
          }],
          [27.2, b => { pose('paul', 'stand'); crowdPose('saved', 'stand'); }],
        ]);
      },
    },
    // ── 十四 · 使徒行传 28：马耳他（马可福音 16:18）──────────────
    {
      kind: 'promise', utter: '手能拿蛇；若喝了什么毒物，也必不受害', cmd: 'throw 毒蛇 > 火  # 并没有受伤', ref: '马可福音 16:18', tint: [255, 214, 170],
      verse: [
        { text: '我们既已得救，才知道那岛名叫马耳他。土人看待我们，有非常的情分；因为当时下雨，天气又冷，就生火接待我们众人。', ref: '使徒行传 28:1–2', hold: 7.5 },
        { text: '那时，保罗拾起一捆柴，放在火上，有一条毒蛇，因为热了出来，咬住他的手。', ref: '使徒行传 28:3', hold: 6 },
        { text: '保罗竟把那毒蛇甩在火里，并没有受伤。', ref: '使徒行传 28:5', hold: 5 },
        { text: '耶稣……又对他们说：「……信的人必有神迹随着他们……手能拿蛇；若喝了什么毒物，也必不受害；手按病人，病人就必好了。」', ref: '马可福音 16:14–18', hold: 8 },
      ],
      apply(c) {
        ring(c, [255, 214, 170]);
        TL(c, [
          [0, b => {
            time(0.36, 6, b); lv('rain', 0.5, b); lv('clouds', 0.85, b); lv('storm', 0.25, b); lv('gale', 0.2, b);
            crewOff(b); rm('pr3');
          }],
          [1.2, b => {
            placeName(b, 'malta');
            crowd('isl', { n: 6, x0: 1.02, x1: 1.12, label: '马耳他的土人', robe: ROBE.islander });
            crowdWalk('isl', X('isl')[0], X('isl')[1], { speed: 0.04 });
            crowdWalk('saved', X('saved14')[0], X('saved14')[1], { speed: 0.025 });
            walk('paul', X('fire') - 0.045, { speed: 0.03 }); walk('julius', X('fire') + 0.05, { speed: 0.03 });
            walk('s1', X('fire') - 0.075, { speed: 0.03 }); walk('aristarchus', X('fire') - 0.1, { speed: 0.03 });
          }],
          [3.8, b => { lv('jyFire', 1, b); sfx(b, 'fire'); }],
          [6.4, b => { crowdFaceX('isl', X('fire')); crowdFaceX('saved', X('fire')); face('paul', 1); }],
          [8.8, b => { propP('paul', 'wood'); walk('paul', X('fire') - 0.022, { speed: 0.018, pose: 'carry' }); }],
          [10.8, b => {
            propP('paul', null); pose('paul', 'stand'); face('paul', 1);
            if (!inst(b)) { const G = fireG(); safe('jy.sparks', () => fx().sparkle(G.x, G.y - 0.4 * G.B, 30, [255, 190, 100], G.B * 0.4, 'air')); }
            sfx(b, 'fire');
          }],
          [12, b => {
            S.viperId = 'paul'; pose('paul', 'point'); face('paul', 1);
            W.set('jyThrow', 0, true); lv('jyViper', 1, b); sfx(b, 'whisper', { soft: true });
            crowdWalk('isl', X('isl')[0] + 0.02, X('isl')[1] + 0.02, { speed: 0.02, pose: 'point' });
          }],
          [16.8, b => { lv('jyThrow', 1, b); }],
          [17.7, b => {
            lv('jyViper', 0, b); pose('paul', 'stand');
            if (!inst(b)) { const G = fireG(); safe('jy.sparks2', () => fx().sparkle(G.x, G.y - 0.3 * G.B, 40, [255, 170, 80], G.B * 0.5, 'air')); }
            sfx(b, 'fire'); flashAt(b, 'paul', [255, 236, 200], 16);
          }],
          [20.4, b => { crowdPose('isl', 'raise'); crowdFaceX('isl', X('fire') - 0.02); }],
          // 部百流的父亲躺在地当中（房子只作背景）；土人退到火边，面向那里
          [22.4, b => {
            lv('rain', 0, b); lv('clouds', 0.35, b); lv('storm', 0, b); lv('gale', 0, b); time(0.48, 6, b);
            const H = X('heal14');
            add('father', { label: '部百流的父亲', sex: 'm', age: 'elder', robe: ROBE.father, accent: [200, 196, 186], x: H.father, v: 0.1, facing: -1, pose: 'lie', glow: 0.14 });
            add('publius', { label: '部百流', sex: 'm', robe: [150, 120, 96], accent: [220, 200, 160], beard: true, x: X('pub') - 0.02, facing: -1, glow: 0.16 });
            walk('publius', H.publius, { speed: 0.03 });
            crowdWalk('isl', H.isl[0], H.isl[1], { speed: 0.042, pose: 'stand' });
            { const g = crowdOf('isl'); if (g) g.members.forEach(m => { m.mill = false; }); }
            walk('julius', H.julius, { speed: 0.045 });
            walk('paul', H.paul, { speed: 0.03 });
          }],
          [25.8, b => { pose('paul', 'kneel'); face('paul', 1); crowdFaceX('isl', X('heal14').father); }],
          [26.8, b => { lv('jyHeal', 1, b); flashAt(b, 'father', [255, 244, 220], 26); sfx(b, 'harp'); }],
          [28.2, b => { pose('father', 'stand'); pose('paul', 'stand'); glowP('father', 0.36); lampOn(b, 9, 'paul'); }],
          [29.4, b => { pose('publius', 'raise'); crowdPose('isl', 'raise'); crowdFaceX('isl', X('heal14').father); }],
        ]);
      },
    },
    // ── 十五 · 使徒行传 28：罗马 ─────────────────────────────────
    {
      kind: 'act', utter: '神这救恩，如今传给外邦人', cmd: 'broadcast 救恩 --to 地极  # 并没有人禁止', ref: '28:28', tint: [255, 240, 206],
      verse: [
        { text: '……这样，我们来到罗马。那里的弟兄们一听见我们的信息就出来……迎接我们。保罗见了他们，就感谢神，放心壮胆。', ref: '使徒行传 28:14–15', hold: 7.5 },
        { text: '「所以你们当知道，神这救恩，如今传给外邦人，他们也必听受。」', ref: '使徒行传 28:28', hold: 6 },
        { text: '保罗在自己所租的房子里住了足足两年。凡来见他的人，他全都接待，', ref: '使徒行传 28:30', hold: 6 },
        { text: '放胆传讲神国的道，将主耶稣基督的事教导人，并没有人禁止。', ref: '使徒行传 28:31', hold: 6.5 },
      ],
      apply(c) {
        ring(c, [255, 240, 206]);
        TL(c, [
          [0, b => {
            time(0.42, 8, b); lv('jyShipA', 0, b); crewOff(b);
            crowdRm('isl'); crowdRm('saved'); rm('father'); rm('publius'); lv('jyFire', 0, b); lv('jyHeal', 0, b);
            for (const id of ['paul', 'julius', 'aristarchus', 's1']) rm(id);
          }],
          [1, b => { toPlace('rome', b); }],
          [1.6, b => {
            W.set('jyWreck', 0, true); shipAt('off', 1); W.set('jyShipA', 1, true); W.set('jySail', 1, true);
            crewOn();
            reAdd('paul', 'paul', paulLook({ x: 0.1, facing: 1 })); reAdd('julius', null, Object.assign(JULIUS(), { x: 0.1, facing: 1 })); reAdd('aristarchus', null, Object.assign(ARIST(), { x: 0.1, facing: 1 }));
            board('paul', 'c'); board('julius', 'a'); board('aristarchus', 'b');
            shipTo('moor', b);
          }],
          [2.2, b => { placeName(b, 'rome'); }],
          [5.2, b => {
            ['bro1', 'bro2', 'bro3'].forEach((id, i) => {
              add(id, { label: '罗马的弟兄', sex: i === 1 ? 'f' : 'm', robe: DR(i + 7), hair: i === 1 ? 'veil' : undefined, beard: i !== 1, x: 1.03 + i * 0.03, facing: -1, glow: 0.2 });
              walk(id, X('bro')[i], { speed: 0.06 });
            });
          }],
          [5.8, b => { lv('jySail', 0, b); ashore(b, 'paul', X('bro')[0] - 0.04); ashore(b, 'julius', X('quay')[0] + 0.01); ashore(b, 'aristarchus', X('quay')[0] + 0.03); }],
          [8.2, b => { const cc = C(); if (cc && cc.embrace) cc.embrace('paul', 'bro1', {}); }],
          [9.6, b => {
            const pp = person('paul'), e1 = person('bro1'); if (pp) pp.embrace = null; if (e1) e1.embrace = null;
            pose('bro1', 'stand'); pose('paul', 'raise'); glowP('paul', 0.5);
          }],
          [10.8, b => {
            pose('paul', 'stand'); walk('paul', X('paul15'), { speed: 0.04 }); rm('julius');
            soldier('guard', X('guard15') + 0.03, { label: '看守他的兵', facing: -1 }); walk('guard', X('guard15'), { speed: 0.03 });
            crowd('rome', { n: 6, x0: X('rome15')[0], x1: X('rome15')[1], label: '犹太人的首领' });
            crowdFaceX('rome', X('paul15'));
          }],
          [13.6, b => {
            chain('paul', 'guard'); face('paul', -1); pose('paul', 'raise');
            lv('jyAll', 1, b); flashAt(b, 'paul', [255, 240, 210], 36);
            sfx(b, 'harp'); sfx(b, 'sing', { soft: true });
            lampOn(b, 10, 'paul');
          }],
          [16.6, b => {
            time(0.74, 12, b); lv('jyOpen', 1, b);
            crowd('rome2', { n: 5, x0: 1.02, x1: 1.1, label: '凡来见他的人' });
            crowdWalk('rome2', X('rome15b')[0], X('rome15b')[1], { speed: 0.03 });
            pose('paul', 'stand');
          }],
          [23, b => {
            crowdPose('rome', 'sit'); crowdPose('rome2', 'sit'); crowdFaceX('rome', X('paul15')); crowdFaceX('rome2', X('paul15'));
            pose('paul', 'raise'); glowP('paul', 0.45);
            ['bro1', 'bro2', 'bro3', 'aristarchus'].forEach(id => pose(id, 'sit'));
          }],
          [27, b => { pose('paul', 'point'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '直到地极', sub: '使徒行传 13 — 28', tint: TINT, music: 'jeremiah',
    outro: 26,
    intro: [
      { text: '在安提阿的教会中，有几位先知和教师，就是巴拿巴……并扫罗。', ref: '使徒行传 13:1', hold: 6 },
    ],
    setup,
    stages: STAGES,
    behold: {
      '保罗': { text: '我却不以性命为念，也不看为宝贵，只要行完我的路程，成就我从主耶稣所领受的职事，证明神恩惠的福音。', ref: '使徒行传 20:24' },
      '扫罗': { text: '他们事奉主、禁食的时候，圣灵说：「要为我分派巴拿巴和扫罗，去做我召他们所做的工。」', ref: '使徒行传 13:2' },
      '巴拿巴': { text: '这巴拿巴原是个好人，被圣灵充满，大有信心。', ref: '使徒行传 11:24' },
      '西拉': { text: '约在半夜，保罗和西拉祷告，唱诗赞美神，众囚犯也侧耳而听。', ref: '使徒行传 16:25' },
      '提摩太': { text: '在那里有一个门徒，名叫提摩太，是信主之犹太妇人的儿子，他父亲却是希腊人。', ref: '使徒行传 16:1' },
      '安提阿的教会': { text: '在安提阿的教会中，有几位先知和教师，就是巴拿巴和称呼尼结的西面、古利奈人路求，与分封之王希律同养的马念，并扫罗。', ref: '使徒行传 13:1' },
      '彼西底的安提阿人': { text: '到下安息日，合城的人几乎都来聚集，要听神的道。', ref: '使徒行传 13:44' },
      '外邦人': { text: '外邦人听见这话，就欢喜了，赞美神的道；凡预定得永生的人都信了。', ref: '使徒行传 13:48' },
      '瘸腿的人': { text: '就大声说：「你起来，两脚站直！」那人就跳起来，而且行走。', ref: '使徒行传 14:10' },
      '路司得人': { text: '众人看见保罗所做的事，就用吕高尼的话大声说：「有神藉着人形降临在我们中间了。」', ref: '使徒行传 14:11' },
      '马其顿人': { text: '在夜间有异象现与保罗。有一个马其顿人站着求他说：「请你过到马其顿来帮助我们。」', ref: '使徒行传 16:9' },
      '妇女': { text: '当安息日，我们出城门，到了河边，知道那里有一个祷告的地方，我们就坐下对那聚会的妇女讲道。', ref: '使徒行传 16:13' },
      '吕底亚': { text: '有一个卖紫色布疋的妇人，名叫吕底亚，是推雅推喇城的人，素来敬拜神。她听见了，主就开导她的心，叫她留心听保罗所讲的话。', ref: '使徒行传 16:14' },
      '吕底亚的家人': { text: '她和她一家既领了洗，便求我们说：「你们若以为我是真信主的，请到我家里来住」；于是强留我们。', ref: '使徒行传 16:15' },
      '吕底亚的家': { text: '二人出了监，往吕底亚家里去，见了弟兄们，劝慰他们一番，就走了。', ref: '使徒行传 16:40' },
      '河边': { text: '当安息日，我们出城门，到了河边，知道那里有一个祷告的地方', ref: '使徒行传 16:13' },
      '禁卒': { text: '于是禁卒领他们上自己家里去，给他们摆上饭。他和全家，因为信了神，都很喜乐。', ref: '使徒行传 16:34' },
      '禁卒的家人': { text: '他们就把主的道讲给他和他全家的人听。', ref: '使徒行传 16:32' },
      '囚犯': { text: '忽然，地大震动，甚至监牢的地基都摇动了，监门立刻全开，众囚犯的锁链也都松开了。', ref: '使徒行传 16:26' },
      '内监': { text: '禁卒领了这样的命，就把他们下在内监里，两脚上了木狗。', ref: '使徒行传 16:24' },
      '监': { text: '约在半夜，保罗和西拉祷告，唱诗赞美神，众囚犯也侧耳而听。', ref: '使徒行传 16:25' },
      '雅典人': { text: '雅典人和住在那里的客人都不顾别的事，只将新闻说说听听。', ref: '使徒行传 17:21' },
      '偶像': { text: '保罗在雅典等候他们的时候，看见满城都是偶像，就心里着急', ref: '使徒行传 17:16' },
      '坛': { text: '我游行的时候，观看你们所敬拜的，遇见一座坛，上面写着『未识之神』。', ref: '使徒行传 17:23' },
      '亚略‧巴古': { text: '保罗站在亚略‧巴古当中，说：「众位雅典人哪，我看你们凡事很敬畏鬼神。', ref: '使徒行传 17:22' },
      '丢尼修': { text: '但有几个人贴近他，信了主，其中有亚略‧巴古的官丢尼修', ref: '使徒行传 17:34' },
      '大马哩': { text: '……并一个妇人，名叫大马哩，还有别人一同信从。', ref: '使徒行传 17:34' },
      '亚居拉': { text: '他们本是制造帐棚为业。保罗因与他们同业，就和他们同住做工。', ref: '使徒行传 18:3' },
      '百基拉': { text: '百基拉、亚居拉听见，就接他来，将神的道给他讲解更加详细。', ref: '使徒行传 18:26' },
      '帐棚': { text: '他们本是制造帐棚为业。', ref: '使徒行传 18:3' },
      '哥林多人': { text: '还有许多哥林多人听了，就相信受洗。', ref: '使徒行传 18:8' },
      '以弗所的长老': { text: '众人痛哭，抱着保罗的颈项，和他亲嘴。', ref: '使徒行传 20:37' },
      '百姓': { text: '合城都震动，百姓一齐跑来，拿住保罗，拉他出殿，殿门立刻都关了。', ref: '使徒行传 21:30' },
      '千夫长': { text: '于是千夫长上前拿住他，吩咐用两条铁链捆锁；又问他是什么人，做的是什么事。', ref: '使徒行传 21:33' },
      '兵丁': { text: '千夫长恐怕保罗被他们扯碎了，就吩咐兵丁下去，把他从众人当中抢出来，带进营楼去。', ref: '使徒行传 23:10' },
      '营楼': { text: '当夜，主站在保罗旁边，说：「放心吧！你怎样在耶路撒冷为我作见证，也必怎样在罗马为我作见证。」', ref: '使徒行传 23:11' },
      '台阶': { text: '千夫长准了。保罗就站在台阶上，向百姓摆手，他们都静默无声', ref: '使徒行传 21:40' },
      '腓力斯': { text: '腓力斯甚觉恐惧，说：「你暂且去吧，等我得便再叫你来。」', ref: '使徒行传 24:25' },
      '非斯都': { text: '非斯都和议会商量了，就说：「你既上告于凯撒，可以往凯撒那里去。」', ref: '使徒行传 25:12' },
      '亚基帕王': { text: '亚基帕对保罗说：「你想少微一劝，便叫我作基督徒啊！」', ref: '使徒行传 26:28' },
      '百妮基': { text: '第二天，亚基帕和百妮基大张威势而来，同着众千夫长和城里的尊贵人进了公厅。', ref: '使徒行传 25:23' },
      '尊贵人': { text: '第二天，亚基帕和百妮基大张威势而来，同着众千夫长和城里的尊贵人进了公厅。', ref: '使徒行传 25:23' },
      '公厅': { text: '非斯都吩咐一声，就有人将保罗带进来。', ref: '使徒行传 25:23' },
      '百夫长犹流': { text: '但百夫长要救保罗，不准他们任意而行，就吩咐会洑水的，跳下水去先上岸；', ref: '使徒行传 27:43' },
      '亚里达古': { text: '有马其顿的帖撒罗尼迦人亚里达古和我们同去。', ref: '使徒行传 27:2' },
      '水手': { text: '水手想要逃出船去，把小船放在海里，假作要从船头抛锚的样子。', ref: '使徒行传 27:30' },
      '神的使者': { text: '因我所属所事奉的神，他的使者昨夜站在我旁边', ref: '使徒行传 27:23' },
      '同船的人': { text: '我们在船上的共有二百七十六个人。', ref: '使徒行传 27:37' },
      '船': { text: '到了天亮，他们不认识那地方，但见一个海湾，有岸可登，就商议能把船拢进去不能。', ref: '使徒行传 27:39' },
      '马耳他的土人': { text: '土人看待我们，有非常的情分；因为当时下雨，天气又冷，就生火接待我们众人。', ref: '使徒行传 28:2' },
      '火': { text: '保罗竟把那毒蛇甩在火里，并没有受伤。', ref: '使徒行传 28:5' },
      '部百流': { text: '离那地方不远，有田产是岛长部百流的；他接纳我们，尽情款待三日。', ref: '使徒行传 28:7' },
      '部百流的父亲': { text: '当时，部百流的父亲患热病和痢疾躺着。保罗进去，为他祷告，按手在他身上，治好了他。', ref: '使徒行传 28:8' },
      '部百流的家': { text: '从此，岛上其余的病人也来，得了医治。', ref: '使徒行传 28:9' },
      '罗马的弟兄': { text: '那里的弟兄们一听见我们的信息就出来，到亚比乌市和三馆地方迎接我们。保罗见了他们，就感谢神，放心壮胆。', ref: '使徒行传 28:15' },
      '看守他的兵': { text: '进了罗马城，保罗蒙准和一个看守他的兵另住在一处。', ref: '使徒行传 28:16' },
      '犹太人的首领': { text: '过了三天，保罗请犹太人的首领来。', ref: '使徒行传 28:17' },
      '凡来见他的人': { text: '保罗在自己所租的房子里住了足足两年。凡来见他的人，他全都接待，', ref: '使徒行传 28:30' },
      '保罗所租的房子': { text: '放胆传讲神国的道，将主耶稣基督的事教导人，并没有人禁止。', ref: '使徒行传 28:31' },
      '众教会': { text: '于是众教会信心越发坚固，人数天天加增。', ref: '使徒行传 16:5' },
      '信道的门': { text: '到了那里，聚集了会众，就述说神藉他们所行的一切事，并神怎样为外邦人开了信道的门。', ref: '使徒行传 14:27' },
      '会堂': { text: '他们离了别加往前行，来到彼西底的安提阿，在安息日进会堂坐下。', ref: '使徒行传 13:14' },
      '宙斯庙': { text: '有城外宙斯庙的祭司牵着牛，拿着花圈，来到门前，要同众人向使徒献祭。', ref: '使徒行传 14:13' },
      '庙': { text: '创造宇宙和其中万物的神，既是天地的主，就不住人手所造的殿', ref: '使徒行传 17:24' },
      '安提阿': { text: '他们事奉主、禁食的时候，圣灵说：「要为我分派巴拿巴和扫罗，去做我召他们所做的工。」', ref: '使徒行传 13:2' },
      '塞浦路斯': { text: '他们既被圣灵差遣，就下到西流基，从那里坐船往塞浦路斯去。', ref: '使徒行传 13:4' },
      '彼西底的安提阿': { text: '他们离了别加往前行，来到彼西底的安提阿，在安息日进会堂坐下。', ref: '使徒行传 13:14' },
      '路司得': { text: '路司得城里坐着一个两脚无力的人，生来是瘸腿的，从来没有走过。', ref: '使徒行传 14:8' },
      '特罗亚': { text: '他们就越过每西亚，下到特罗亚去。', ref: '使徒行传 16:8' },
      '腓立比': { text: '从那里来到腓立比，就是马其顿这一方的头一个城', ref: '使徒行传 16:12' },
      '腓立比的监': { text: '约在半夜，保罗和西拉祷告，唱诗赞美神，众囚犯也侧耳而听。', ref: '使徒行传 16:25' },
      '雅典': { text: '保罗在雅典等候他们的时候，看见满城都是偶像，就心里着急', ref: '使徒行传 17:16' },
      '哥林多': { text: '这事以后，保罗离了雅典，来到哥林多。', ref: '使徒行传 18:1' },
      '米利都': { text: '保罗从米利都打发人往以弗所去，请教会的长老来。', ref: '使徒行传 20:17' },
      '耶路撒冷': { text: '到了耶路撒冷，弟兄们欢欢喜喜地接待我们。', ref: '使徒行传 21:17' },
      '凯撒利亚': { text: '马兵来到凯撒利亚，把文书呈给巡抚，便叫保罗站在他面前。', ref: '使徒行传 23:33' },
      '马耳他': { text: '我们既已得救，才知道那岛名叫马耳他。', ref: '使徒行传 28:1' },
      '罗马': { text: '在那里遇见弟兄们，请我们与他们同住了七天。这样，我们来到罗马。', ref: '使徒行传 28:14' },
    },
    scene: {
      init() { sprites(); },
      resize() { VILL = null; for (const k in PCACHE) delete PCACHE[k]; },
      update,
      drawUnder,
      draw,
      reset() { S = fresh(); FXL.length = 0; },
      restore() { FXL.length = 0; for (let i = 0; i < LA.length; i++) LA[i] = i < S.lamps ? 1 : 0; },
      pick,
      sig() {
        const ab = Object.keys(S.aboard).filter(has).sort().map(k => k + ':' + S.aboard[k]);
        const ch = Object.keys(S.chains).filter(has).sort().map(k => k + (S.chains[k] === true ? '' : '>' + S.chains[k]));
        return { place: S.place, ship: S.shipA + '>' + S.shipB + ':' + S.shipDir, aboard: ab, lamps: S.lamps, chains: ch };
      },
    },
  });
})(window.GS);
