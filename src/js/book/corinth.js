/* ─────────────────────────────────────────────────────────────
 * book/corinth.js —— 哥林多书 · 爱（哥林多前书 1 — 哥林多后书 13）
 *
 * 哥林多：一座港口的城。海在左（码头边泊着一只船），近岸从左到右——码头、窑匠的作坊（窑与一架瓦器）、
 * 该犹的家（接待全教会的房屋，院子里一张矮桌、墙上的灯与一面铜镜）、城外一块田；中丘上是城（亚波罗的庙
 * 立在城中），右边山坡上凿着坟墓；远处是高高的城山。教会是十几个人：犹太人、希腊人、为奴的、自主的。
 * 信没有情节，只有一幅幅在这世界里成形的光景（如诗篇、箴言两卷）：
 *   1:12–2:2  黎明，院子里分成四伙，各自头上聚成「保罗」「亚波罗」「矶法」「基督」；天边立起一个光的十字，
 *             四伙转身聚成一群；世上愚拙的、软弱的（奴仆、寡妇、孩子、窑匠）亮起来。
 *   3:11–6:19 根基先立，众人站成一行，一座光的殿在他们身上显出（台基、柱子、楣与山墙）；一道光降在殿中，
 *             一点光在他们中间来往，一个一个点亮；城里亚波罗的庙暗下去。（「我要在他们中间居住」，林后 6:16）
 *   11:20–10:17 黄昏，主的晚餐：富足的先吃，穷的站在一旁饥饿；该犹起来招他们，众人围桌坐下；
 *             「这是我的身体，为你们舍的」——饼发光，擘开，一粒粒光到各人手里；杯里是红金的光；我们虽多，仍是一个饼。
 *   12:4–27   夜，众人站成一圈：各人头上点起一朵颜色不同的火（恩赐原有分别）；火光升上天去，
 *             神随自己的意思把它们安排成一个光的身子，一颗一颗连起来；众人牵起手。
 *   13:1–8    希腊人高声说话，一圈圈空洞的灰环（鸣的锣，响的钹）；然后是爱的行为：长者跪下等孩子、
 *             革来氏跪在寡妇身旁、希腊人坐到奴仆身边、两个分过党的人相拥……每一件爱在二人之间牵起一根玫瑰色的光丝；
 *             「爱是永不止息」。
 *   13:8–14:1 头上的火一朵一朵熄了（说方言之能终必停止）；光丝暗下去，墙上的铜镜里模糊不清——自上而来的光照下，
 *             镜子明亮了，外有光环（面对面：只有光）；天上显出三点光：信、望、爱，「其中最大的是爱」（本句的话），
 *             玫瑰金的光铺满全地，光丝又亮起来；天亮。
 *   15:3–43   保罗在田里撒种（桌面：家的右边那块田；手机：院子前面的一条田）；种子埋在地里；「第三天复活了」——
 *             一棵发光的苗破土而出，成了初熟的果子（金色的一捆）；满田的麦子与各样的花长起来，熟成金黄。
 *   15:51–16:14 号筒末次吹响：一道光扫过天空，山坡上的坟墓滚开了石头，光从里面涌出，笼罩坟墓的冷影被吞灭；
 *             众人举手：「感谢神，使我们藉着我们的主耶稣基督得胜。」
 *   林后 4    黄昏到夜，窑火照着一架瓦器；那吩咐光从黑暗里照出来的神——高天上一点光降下，进到保罗心里，
 *             又进到瓦器里，一个一个亮起；一阵风四面扑来，裂了缝的瓦器从裂缝里放出光（打倒了，却不至死亡）。
 *   林后 1–5  黎明：城外独坐的那个忧愁的人——众人走到他那里，司提反抱住他；旧事已过：一圈新的光从他身上漫过全地，
 *             遍地开花，他的灰衣换了颜色，成了新造的人。
 *   林后 7–9  白日：提多从船上下来，保罗迎上去相抱；码头上一只箱子，众人一个一个乐意地捐（寡妇第一个）；
 *             福徒拿都与亚该古把箱子抬上船，帆张开，船往东去，往耶路撒冷去（在这一句里没入天边）。
 *   林后 11–12 夜：众人在院中坐着，保罗独自跪在码头；身旁一团冷而暗的影（一根刺）；他三次求主——三点小光升起又熄灭；
 *             「我的恩典够你用的」：自上而来的光覆庇他，那影缩成一缕；他站起来。
 *   林后 13   天亮，众人围着保罗，彼此相拥问安；恩惠、慈爱、感动——金、玫瑰、淡蓝三道光自天交织而下。
 *
 * 神的显现：父从不成形——只是自上而来的光与经文的声音；圣灵是玩家自己的光与降下的光；
 * 话语是信中所引神的话、主的话（林前 11:24、林后 6:16、林后 12:9）与论到神作为的短句（kind 'act'）。
 * 一切位置都以画面宽度的比例记下（桌面 | 手机竖屏各一套）；一切状态只在 setup / apply / 情节里设定（瞬间重演时一样）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'corinth';
  const LV = W.lv;
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  const LEVELS = [
    ['coCross', 'exp', 0.45],     // 十字架的道理：天边一个光的十字（1:18）
    ['coTemple', 'lin', 0.16],    // 光的殿：台基 → 柱子 → 楣与山墙（3:11、3:16）
    ['coTempleA', 'exp', 0.6],    // 光的殿的显隐
    ['coDwell', 'exp', 0.6],      // 神的灵住在你们里头：降在殿中的一道光
    ['coIdol', 'exp', 0.35],      // 城里的庙暗下去（林后 6:16 神的殿和偶像有什么相同呢）
    ['coLamps', 'exp', 0.8],      // 家里的灯
    ['coTable', 'exp', 0.8],      // 桌上摆好饼与杯
    ['coBread', 'exp', 0.7],      // 饼的光
    ['coCup', 'exp', 0.7],        // 杯的光
    ['coOne', 'exp', 0.45],       // 我们虽多，仍是一个饼：围着桌子的一圈暖光
    ['coBody', 'lin', 0.14],      // 光升上天，排成一个身子（12:12）
    ['coBodyA', 'exp', 0.6],      // 那身子的显隐
    ['coBodyLit', 'exp', 0.5],    // 肢体一颗一颗连起来（12:18）
    ['coLove', 'exp', 0.45],      // 爱是永不止息：光丝都亮起来（13:8）
    ['coLoveA', 'exp', 0.5],      // 光丝的显隐
    ['coMirror', 'lin', 0.3],     // 铜镜：模糊（0.35）→ 明亮（1）（13:12）
    ['coAbove', 'exp', 0.35],     // 自上而来的光（面对面）
    ['coThreeA', 'exp', 0.6],     // 信、望、爱三点光的显隐
    ['coLoveBig', 'exp', 0.3],    // 其中最大的是爱：玫瑰金的光铺满全地
    ['coSown', 'lin', 0.3],       // 撒在地里的种子
    ['coSprout', 'exp', 0.6],     // 第三天复活了：一棵发光的苗
    ['coFirst', 'exp', 0.45],     // 初熟的果子：金色的一捆（15:20）
    ['coGrow', 'lin', 0.1],       // 满田的麦子与花长起来（15:38）
    ['coRipe', 'lin', 0.14],      // 熟成金黄（15:42–43）
    ['coDeath', 'exp', 0.3],      // 笼罩坟墓的冷影（15:55）
    ['coTomb', 'lin', 0.7],       // 坟墓的石头滚开
    ['coTombL', 'exp', 0.5],      // 光从坟墓里涌出
    ['coKiln', 'exp', 0.5],       // 窑火
    ['coShine', 'exp', 0.7],      // 那吩咐光从黑暗里照出来的神：高天上一点光
    ['coShineD', 'lin', 0.26],    // 那点光降下，进到心里
    ['coCrack', 'exp', 0.6],      // 裂了缝的瓦器放出光（4:8–9）
    ['coJarsA', 'exp', 0.5],      // 瓦器里的光（白日里淡些）
    ['coFirstG', 'exp', 0.5],     // 初熟的果子的光（之后淡下去，形仍在）
    ['coGrief', 'exp', 0.5],      // 忧愁的人身上的灰影
    ['coNew', 'lin', 0.12],       // 新造的：一圈新的光漫过全地（林后 5:17）
    ['coChest', 'exp', 0.6],      // 捐资的箱子里的光
    ['coSail', 'exp', 0.5],       // 帆张开
    ['coShip', 'lin', 0.16],      // 船离岸远去（0 泊着 → 1 没入天边；约六秒）
    ['coThorn', 'exp', 0.45],     // 一根刺：保罗身旁冷而暗的影（林后 12:7）
    ['coCover', 'exp', 0.35],     // 好叫基督的能力覆庇我
    ['coTri', 'exp', 0.35],       // 恩惠、慈爱、感动：三道光（林后 13:14）
  ];
  for (const d of LEVELS) W.defineLevel(d[0], d[1], d[2]);
  const MY = LEVELS.map(d => d[0]);

  // ════════════════════════════════════════════════════════════
  //  地上的位置（画面宽度的比例）：桌面 | 手机竖屏
  // ════════════════════════════════════════════════════════════
  const phone = () => W.w < 600;
  const at = (d, p) => (phone() ? p : d);
  const XD = {
    pier0: 0.402, quay: 0.466, ship: 0.372, chest: 0.47, kiln: 0.503, shelf0: 0.518, shelf1: 0.556,
    house0: 0.584, house1: 0.806, door: 0.614, win1: 0.672, win2: 0.782, lampL: 0.648, lampR: 0.758, mirror: 0.72, table: 0.69, cx: 0.69,
    field0: 0.852, field1: 0.962, sheaf: 0.884, sheafV: 0.46, acro0: 0.72, acro1: 0.995, city0: 0.515, city1: 0.83, temple: 0.62, tomb0: 0.856, tomb1: 0.958,
  };
  const XP = {
    pier0: 0.37, quay: 0.445, ship: 0.33, chest: 0.452, kiln: 0.462, shelf0: 0.48, shelf1: 0.535,
    house0: 0.556, house1: 0.826, door: 0.59, win1: 0.66, win2: 0.79, lampL: 0.632, lampR: 0.768, mirror: 0.72, table: 0.70, cx: 0.70,
    // 手机上：田在院子前面（近处的一条），不在屏幕右边的角上
    field0: 0.6, field1: 0.9, sheaf: 0.775, sheafV: 0.88, acro0: 0.7, acro1: 1.0, city0: 0.51, city1: 0.785, temple: 0.605, tomb0: 0.80, tomb1: 0.95,
  };
  // 田的纵深（v）：桌面在家的右边，占满近岸的纵深；手机在院子前面
  const FV = () => (phone() ? [0.76, 1.0] : [0.02, 0.7]);
  const fv = t => { const f = FV(); return f[0] + (t - 0.02) / 0.68 * (f[1] - f[0]); };   // t：桌面的纵深 0.02..0.7
  const X = k => (phone() ? XP : XD)[k];

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.55 : 1) * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const SC = l => PH(l) / 44;                                                             // 布景的比例：与人一同放大
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const fH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fH(2, g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.45, W.unit);
  const ease = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const sm = (a, b, x) => ease((x - a) / (b - a));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.3, 0, 1);
  const hsh = k => U.fract(Math.sin(k * 127.1 + 311.7) * 43758.5453);
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, a);
  const inst = b => !!(b && b.instant) || !!W.replaying;
  function lv(name, v, b) { W.set(name, v, inst(b)); }
  function tod(b, t, dur) { W.goTo(t, inst(b) ? 0 : dur, inst(b)); }
  function sfx(b, name, o) { if (inst(b)) return; const a = au(); if (a && a.sfx) U.safe('corinth.sfx', () => a.sfx(name, o || {})); }
  function flash(b, v) { if (!inst(b)) W.flash = Math.max(W.flash || 0, v); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }

  // ════════════════════════════════════════════════════════════
  //  人（皆经人物模块；新约里反复出场的保罗用共用的样子）
  // ════════════════════════════════════════════════════════════
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const alive = id => { const f = fig(id); return !!(f && !f.dying); };
  function look(key, o) { const L = (C() && C().LOOK) || {}; return Object.assign({}, L[key] || {}, o || {}); }
  const PEOPLE = {
    stephanas: { label: '司提反', sex: 'm', age: 'adult', robe: [128, 108, 78], accent: [70, 56, 42], beard: true },
    fort: { label: '福徒拿都', sex: 'm', age: 'adult', robe: [112, 100, 128], beard: true },
    slave: { label: '奴仆', sex: 'm', age: 'adult', robe: [136, 124, 104], accent: [92, 80, 66], hair: 'short', beard: false },
    greek: { label: '希腊人', sex: 'm', age: 'adult', robe: [218, 212, 196], accent: [104, 96, 150], beard: true },
    gaius: { label: '该犹', sex: 'm', age: 'adult', robe: [150, 62, 58], accent: [226, 198, 146], beard: true },
    achaicus: { label: '亚该古', sex: 'm', age: 'adult', robe: [142, 120, 92], beard: true },
    crispus: { label: '基利司布', sex: 'm', age: 'elder', robe: [74, 88, 124], accent: [228, 224, 214], beard: true, prop: null },
    widow: { label: '寡妇', sex: 'f', age: 'elder', robe: [94, 90, 102], accent: [178, 172, 178], prop: null },
    chloe: { label: '革来氏', sex: 'f', age: 'adult', robe: [96, 128, 102], accent: [232, 222, 200] },
    child: { label: '孩子', sex: 'f', age: 'child', robe: [190, 154, 110] },
    potter: { label: '窑匠', sex: 'm', age: 'adult', robe: [158, 108, 72], accent: [108, 74, 50], beard: true },
    grief: { label: '忧愁的人', sex: 'm', age: 'adult', robe: [98, 98, 104], accent: [78, 78, 84], beard: true, glow: 0.05 },
    titus: { label: '提多', sex: 'm', age: 'adult', robe: [118, 132, 108], accent: [210, 196, 160], beard: false, hair: 'short' },
  };
  const NEW_ROBE = [192, 150, 96];
  const MEMBERS = ['stephanas', 'fort', 'slave', 'greek', 'gaius', 'achaicus', 'crispus', 'widow', 'chloe', 'child', 'potter'];
  const EVERY = () => ['paul'].concat(MEMBERS, ['grief', 'titus']).filter(alive);
  // 教会（城外那个忧愁的人，在被赦免之前不在其中）
  const CHURCH = () => EVERY().filter(id => id !== 'grief' || S.forgiven);
  const HUMBLE = ['slave', 'widow', 'child', 'potter'];

  function person(id, P, o) {
    const base = id === 'paul' ? look('paul') : Object.assign({}, PEOPLE[id]);
    const p = C().add(id, Object.assign(base, {
      x: at(P[0], P[1]), layer: 2, v: vOf(P), facing: P[3] === -1 ? -1 : 1, pose: 'stand', from: W.replaying ? 'none' : 'fade',
      glow: base.glow != null ? base.glow : 0.18,
    }, o || {}));
    if (p) p._coV = null;
    return p;
  }
  function pose(id, ps, o) { if (alive(id)) C().pose(id, ps, o); }
  function face(id, d) { if (alive(id)) C().face(id, d); }
  function glow(id, v) { if (alive(id)) C().glow(id, v); }
  function glowAll(v, ids) { for (const id of ids || CHURCH()) glow(id, v); }
  function hold(a, b, on) { const c = C(); if (c.holdHands && alive(a) && alive(b)) c.holdHands(a, b, on); }
  function embrace(a, b, xf) { const c = C(); if (c.embrace && alive(a) && alive(b)) c.embrace(a, b, xf != null ? { at: xf } : {}); }
  // 纵深 v 的缓动（走过去时一同变；重演时直接到位）
  function setV(f, v, dur) {
    if (v == null || !f) return;
    if (W.replaying) { f.v = v; f._coV = null; return; }
    f._coV = v; f._coVR = Math.max(0.02, Math.abs(v - (f.v || 0)) / Math.max(0.5, dur || 1));
  }
  function faceTo(id, fc) {
    if (fc == null) return;
    if (fc === 'c') face(id, X('cx'));
    else face(id, fc);
  }
  // 走到某处：[桌面 x, 手机 x, 纵深 v, 朝向]；到了换成 ps
  function go(id, P, ps, o) {
    const f = fig(id);
    if (!f || f.dying || !P) return 0;
    o = o || {};
    const x = at(P[0], P[1]), sp = o.speed || 0.034;
    const cur = f.tx != null ? f.tx : f.nx, dx = Math.abs(x - cur);
    if (dx > 0.002) C().walk(id, x, { pose: ps || 'stand', speed: sp });
    else C().pose(id, ps || 'stand');
    setV(f, vOf(P), dx > 0.002 ? dx / sp : 1.2);
    faceTo(id, o.face != null ? o.face : P[3]);
    return dx / sp;
  }
  function arrange(form, ps, o) {
    o = o || {};
    for (const id in form) {
      if (id.charAt(0) === '_' || !alive(id)) continue;
      const q = (o.poses && o.poses[id]) || ps || 'stand';
      go(id, form[id], q, { speed: o.speed });
    }
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶；返回 [x, y, 身高]
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.3 };
  const LOWP = { sit: 0.62, kneel: 0.66, pray: 0.66, seat: 0.66, worship: 0.5, bow: 0.82, lie: 0.2, fall: 0.2 };
  function pt(id, frac) {
    const f = fig(id);
    if (!f || f.dying || f.alpha < 0.02) return null;
    let x, y, h;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) { x = f._x; y = f._y; h = f._h || PH(2); }
    else { x = f.nx * W.w; y = vY(f.nx, f.v || 0); h = PH(2) * (AGE_H[f.age] || 1) * (1 + 0.35 * (f.v || 0)); }
    const low = LOWP[f.pose] || 1;
    return [x, y - h * low * frac, h];
  }

  // ════════════════════════════════════════════════════════════
  //  站处（[桌面 x, 手机 x, 纵深 v, 朝向：1 / -1 / 'c' 朝院子中央 / 某人]）
  // ════════════════════════════════════════════════════════════
  const F = {
    // 1:12 四伙人各自背转
    start: {
      paul: [0.50, 0.468, 0.42, 1],
      stephanas: [0.572, 0.55, 0.30, -1], fort: [0.593, 0.578, 0.10, -1], slave: [0.583, 0.563, 0.56, -1],
      greek: [0.648, 0.636, 0.14, -1], gaius: [0.668, 0.662, 0.44, 1],
      crispus: [0.722, 0.72, 0.12, 1], achaicus: [0.742, 0.748, 0.40, -1], widow: [0.712, 0.705, 0.60, 1],
      chloe: [0.788, 0.792, 0.20, 1], child: [0.80, 0.812, 0.54, -1], potter: [0.815, 0.832, 0.07, 1],
      grief: [0.836, 0.848, 0.12, 1, 0.2],   // 城外独坐：桌面在家的右边、田的左边（靠后）
    },
    // 四伙转身聚成一群，保罗在中间
    one: {
      paul: [0.69, 0.70, 0.30, -1],
      stephanas: [0.60, 0.565, 0.06, 'c'], crispus: [0.632, 0.605, 0.06, 'c'], gaius: [0.662, 0.645, 0.06, 'c'],
      chloe: [0.72, 0.748, 0.06, 'c'], achaicus: [0.75, 0.788, 0.06, 'c'], potter: [0.782, 0.828, 0.06, 'c'],
      slave: [0.57, 0.53, 0.50, 'c'], fort: [0.603, 0.57, 0.52, 'c'], greek: [0.636, 0.61, 0.54, 'c'],
      widow: [0.748, 0.788, 0.54, 'c'], child: [0.78, 0.828, 0.52, 'c'],
    },
    // 光的殿：桌面一行（人如柱子）；手机两行
    temple: null,
    // 主的晚餐（一）：富足的先吃，穷的站在一旁
    sup1: {
      paul: [0.628, 0.62, 0.36, 1],
      gaius: [0.662, 0.662, 0.10, 1], crispus: [0.69, 0.70, 0.06, 1], greek: [0.718, 0.738, 0.10, -1],
      stephanas: [0.605, 0.588, 0.26, 1], chloe: [0.77, 0.80, 0.26, -1], achaicus: [0.792, 0.828, 0.10, -1],
      fort: [0.598, 0.575, 0.56, 1], child: [0.784, 0.818, 0.56, -1],
      slave: [0.566, 0.535, 0.40, 1], widow: [0.58, 0.548, 0.62, 1], potter: [0.55, 0.515, 0.18, 1],
    },
    // 主的晚餐（二）：众人围桌坐下，彼此等待
    sup2: {
      paul: [0.69, 0.70, 0.07, 1],
      chloe: [0.603, 0.57, 0.08, 1], stephanas: [0.626, 0.598, 0.08, 1], gaius: [0.65, 0.628, 0.08, 1],
      crispus: [0.73, 0.772, 0.08, -1], greek: [0.753, 0.802, 0.08, -1], achaicus: [0.776, 0.832, 0.08, -1],
      widow: [0.618, 0.585, 0.56, 1], slave: [0.643, 0.615, 0.56, 1],
      potter: [0.742, 0.785, 0.56, -1], fort: [0.767, 0.815, 0.56, -1], child: [0.792, 0.845, 0.56, -1],
    },
    // 夜：站成一圈（一个身子）
    ring: {
      paul: [0.69, 0.70, 0.36, -1],
      stephanas: [0.625, 0.59, 0.06, 'c'], gaius: [0.65, 0.635, 0.06, 'c'], crispus: [0.675, 0.68, 0.06, 'c'],
      chloe: [0.70, 0.725, 0.06, 'c'], achaicus: [0.725, 0.77, 0.06, 'c'], potter: [0.75, 0.815, 0.06, 'c'],
      fort: [0.60, 0.565, 0.56, 'c'], slave: [0.625, 0.61, 0.56, 'c'], greek: [0.65, 0.655, 0.56, 'c'],
      widow: [0.735, 0.745, 0.56, 'c'], child: [0.76, 0.79, 0.56, 'c'],
    },
    // 爱：一对一对
    love: {
      greek0: [0.69, 0.70, 0.52, 1], greek: [0.648, 0.652, 0.58, -1], slave: [0.625, 0.61, 0.58, 1],
      crispus: [0.668, 0.672, 0.16, 1], child: [0.685, 0.702, 0.20, -1],
      widow: [0.748, 0.768, 0.58, -1], chloe: [0.728, 0.742, 0.56, 1],
      gaius: [0.772, 0.80, 0.30, 1], fort: [0.792, 0.83, 0.30, -1],
      paul: [0.70, 0.715, 0.34, -1],
    },
    // 田边：保罗撒种（桌面在田的左前角；手机在院子前面那一条田的左端）；众人在院中望着
    field: {
      paul: [0.85, 0.64, 0.68, 1, 0.9], potter: [0.806, 0.70, 0.5, 1, 0.56], child: [0.822, 0.73, 0.66, 1, 0.64],
      fort: [0.60, 0.565, 0.30, 1], stephanas: [0.622, 0.595, 0.12, 1], crispus: [0.645, 0.625, 0.30, 1], gaius: [0.668, 0.655, 0.12, 1],
      chloe: [0.692, 0.685, 0.30, 1], widow: [0.716, 0.715, 0.12, 1], greek: [0.74, 0.745, 0.30, 1], slave: [0.764, 0.775, 0.12, 1],
      achaicus: [0.788, 0.805, 0.30, 1],
    },
    // 望着山坡上的坟墓
    tombs: {
      paul: [0.80, 0.83, 0.50, 1],
      stephanas: [0.60, 0.565, 0.16, 1], crispus: [0.63, 0.605, 0.16, 1], gaius: [0.66, 0.645, 0.16, 1], chloe: [0.69, 0.685, 0.16, 1],
      widow: [0.72, 0.725, 0.16, 1], greek: [0.75, 0.765, 0.16, 1],
      fort: [0.615, 0.585, 0.52, 1], slave: [0.645, 0.625, 0.52, 1], child: [0.675, 0.665, 0.52, 1], achaicus: [0.705, 0.705, 0.52, 1],
      potter: [0.735, 0.745, 0.52, 1],
    },
    // 窑边：保罗与窑匠；众人在院中坐着
    work: {
      potter: [0.49, 0.462, 0.34, 1], paul: [0.576, 0.548, 0.40, -1],
      stephanas: [0.62, 0.59, 0.10, -1], crispus: [0.66, 0.64, 0.10, -1], gaius: [0.70, 0.69, 0.10, -1], chloe: [0.74, 0.74, 0.10, -1],
      achaicus: [0.78, 0.79, 0.10, -1],
      fort: [0.64, 0.615, 0.52, -1], slave: [0.68, 0.665, 0.52, -1], greek: [0.72, 0.715, 0.52, -1], widow: [0.76, 0.765, 0.52, -1],
      child: [0.795, 0.815, 0.52, -1],
    },
    // 到忧愁的人那里去
    grief: {
      stephanas: [0.818, 0.815, 0.14, 1, 0.22], chloe: [0.802, 0.792, 0.46, 1], gaius: [0.788, 0.772, 0.12, 1, 0.14], child: [0.852, 0.88, 0.52, -1],
      paul: [0.772, 0.745, 0.44, 1],
    },
    // 码头：提多从船上下来；众人排着来捐
    quay: {
      titus0: [0.442, 0.422, 0.04, 1], titus: [0.466, 0.448, 0.24, 1], paul: [0.486, 0.47, 0.26, -1],
      widowGive: [0.49, 0.472, 0.56, -1], carry1: [0.452, 0.43, 0.3, -1], carry2: [0.468, 0.448, 0.5, -1],
      // 福徒拿都与亚该古站在箱子旁边（等着把它抬上船）；其余的人排着来捐
      fort: [0.515, 0.5, 0.3, -1], achaicus: [0.53, 0.515, 0.64, -1],
      widow: [0.552, 0.535, 0.44, -1], child: [0.572, 0.565, 0.60, -1], slave: [0.592, 0.595, 0.44, -1], chloe: [0.612, 0.625, 0.60, -1],
      gaius: [0.632, 0.655, 0.44, -1], crispus: [0.652, 0.685, 0.60, -1], greek: [0.672, 0.715, 0.44, -1], stephanas: [0.692, 0.745, 0.60, -1],
      potter: [0.712, 0.775, 0.44, -1], grief: [0.732, 0.805, 0.60, -1],
    },
    // 夜：众人在院中坐着；保罗独自跪在码头
    night: {
      paul: [0.482, 0.462, 0.56, -1], paulUp: [0.488, 0.468, 0.56, 1],
      stephanas: [0.61, 0.575, 0.08, -1], gaius: [0.64, 0.615, 0.08, -1], crispus: [0.67, 0.655, 0.08, -1], chloe: [0.70, 0.695, 0.08, -1],
      achaicus: [0.73, 0.735, 0.08, -1], potter: [0.76, 0.775, 0.08, -1], titus: [0.79, 0.815, 0.08, -1],
      fort: [0.625, 0.595, 0.50, -1], slave: [0.655, 0.635, 0.50, -1], greek: [0.685, 0.675, 0.50, -1], widow: [0.715, 0.715, 0.50, -1],
      child: [0.745, 0.755, 0.50, -1], grief: [0.775, 0.795, 0.50, -1],
    },
    // 末了：众人围着保罗
    final: {
      paul: [0.69, 0.70, 0.30, -1],
      stephanas: [0.605, 0.57, 0.06, 'c'], gaius: [0.63, 0.612, 0.06, 'c'], crispus: [0.655, 0.654, 0.06, 'c'],
      chloe: [0.725, 0.746, 0.06, 'c'], achaicus: [0.75, 0.788, 0.06, 'c'], potter: [0.775, 0.83, 0.06, 'c'],
      fort: [0.60, 0.565, 0.56, 'c'], slave: [0.625, 0.607, 0.56, 'c'], greek: [0.65, 0.649, 0.56, 'c'],
      grief: [0.73, 0.751, 0.56, 'c'], widow: [0.755, 0.793, 0.56, 'c'], child: [0.78, 0.835, 0.56, 'c'], titus: [0.805, 0.873, 0.30, 'c'],
    },
  };
  // 光的殿：桌面一行十一人；手机两行
  F.temple = (function () {
    const order = ['slave', 'fort', 'stephanas', 'crispus', 'gaius', 'greek', 'widow', 'achaicus', 'chloe', 'child', 'potter'];
    const back = { slave: 0.56, stephanas: 0.612, gaius: 0.664, widow: 0.716, chloe: 0.768, potter: 0.82 };
    const front = { fort: 0.586, crispus: 0.638, greek: 0.69, achaicus: 0.742, child: 0.794 };
    const o = { paul: [0.556, 0.505, 0.64, 1] };
    order.forEach((id, i) => {
      const xd = 0.592 + i * 0.0196;
      const xp = back[id] != null ? back[id] : front[id];
      const vp = back[id] != null ? 0.08 : 0.46;
      o[id] = [xd, xp, 0.30, 'c', vp];
    });
    return o;
  })();
  // 手机上某些站处的纵深与桌面不同（第 5 项）
  const vOf = P => (phone() && P[4] != null ? P[4] : P[2]);

  // ════════════════════════════════════════════════════════════
  //  状态（只在 setup / apply / 情节里改动）
  // ════════════════════════════════════════════════════════════
  let S = fresh();
  function fresh() {
    return { united: false, dwelt: 0, broken: false, gifts: 0, gOut: 0, links: 0, three: 0, jars: 0, forgiven: false,
      titus: false, chest: 'none', gave: 0, prayers: 0 };
  }

  // ── 画面上转瞬即逝的效果（只关乎画面；瞬间重演时不存在）────────
  const FXL = [];
  function fxl(b, e) { if (inst(b)) return; e.t = 0; FXL.push(e); }
  // 一点光从某处飞到某人（饼、杯、恩赐、捐资）
  function mote(b, from, to, o) { fxl(b, Object.assign({ type: 'mote', from, to, dur: 1.4, rgb: [255, 226, 160], arc: 0.4 }, o || {})); }
  function ringOn(b, id, rgb, rf, dur, frac) {
    if (inst(b) || !fx()) return;
    const q = pt(id, frac == null ? 0.55 : frac);
    if (q) fx().ring(q[0], q[1], rgb || [255, 232, 200], M() * (rf || 0.12), dur || 2, 1.4);
  }
  function sparkOn(b, id, n, rgb, frac) {
    if (inst(b) || !fx()) return;
    const q = pt(id, frac == null ? 0.6 : frac);
    if (q) fx().sparkle(q[0], q[1], n || 18, rgb || [255, 240, 210], q[2] * 0.25, 'top');
  }
  function nameAt(b, str, x, y, rgb, o) {
    if (inst(b) || !fx()) return;
    o = o || {};
    const size = Math.max(0.031 * M(), o.px || 0), n = Array.from(str).length;
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(x, half + 6, W.w - half - 6), cy = clamp(y, size + 6, W.h - size);
    const src = o.src || (() => [cx + U.rand(-60, 60) * SU(), cy + U.rand(-10, 50) * SU()]);
    fx().nameStr(str, cx, cy, size, rgb, src, { hold: o.hold || 3.4, delay: o.delay || 0 });
    const a = au();
    if (a && a.nameChime) U.safe('corinth.chime', () => a.nameChime(str[0]));
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
  // 竖的光：横向柔和，纵向由 stops 给出（0 在上）
  function shaft(rgb, stops) {
    const c = cnv(64, 256), g = c.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, rgba(rgb, 0)); hz.addColorStop(0.3, rgba(rgb, 0.28));
    hz.addColorStop(0.5, rgba(rgb, 1));
    hz.addColorStop(0.7, rgba(rgb, 0.28)); hz.addColorStop(1, rgba(rgb, 0));
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    for (const s of stops) vt.addColorStop(s[0], 'rgba(0,0,0,' + s[1] + ')');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {};
    try {
      SP.warm = radial([255, 186, 110], 1); SP.gold = radial([255, 226, 160], 1); SP.white = radial([252, 250, 242], 1);
      SP.rose = radial([255, 172, 178], 1); SP.pale = radial([214, 226, 255], 1); SP.cold = radial([74, 82, 102], 0.9, 0.55);
      SP.dark = radial([8, 8, 14], 1, 0.5); SP.green = radial([210, 244, 176], 1); SP.wine = radial([236, 108, 78], 1);
      SP.ember = radial([255, 120, 50], 1); SP.mist = radial([132, 140, 164], 0.85, 0.5);
      SP.col = shaft([255, 246, 222], [[0, 0], [0.18, 0.55], [0.8, 0.95], [1, 0]]);
      SP.beam = shaft([255, 238, 200], [[0, 0], [0.12, 0.85], [0.5, 1], [0.88, 0.85], [1, 0]]);
      SP.colG = shaft([255, 222, 150], [[0, 0], [0.3, 0.7], [0.9, 1], [1, 0]]);
      SP.colR = shaft([255, 176, 184], [[0, 0], [0.3, 0.7], [0.9, 1], [1, 0]]);
      SP.colB = shaft([206, 222, 255], [[0, 0], [0.3, 0.7], [0.9, 1], [1, 0]]);
    } catch (e) { /* 无画布时略过 */ }
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a, sy) {
    if (!(a > 0.003) || !sp || !(r > 0.3) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(sp, x - r, y - ry, r * 2, ry * 2);
  }
  // 一道光（精灵图）从 (x0,y0) 到 (x1,y1)，宽 w
  function beam(ctx, sp, x0, y0, x1, y1, w, a) {
    if (!(a > 0.003) || !sp) return;
    const L = Math.hypot(x1 - x0, y1 - y0);
    if (!(L > 1)) return;
    ctx.save();
    ctx.translate(x0, y0);
    ctx.rotate(Math.atan2(y1 - y0, x1 - x0) - Math.PI / 2);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, -w / 2, 0, w, L);
    ctx.restore();
  }
  // 火焰（灯、窑、恩赐的火）
  function flame(ctx, x, y, h, k, seed, outer, inner) {
    if (k < 0.02 || h < 0.5) return;
    const t = W.t * 7 + seed * 11;
    const sx = (Math.sin(t) * 0.12 + Math.sin(t * 2.3 + 1) * 0.06) * h * (1 + 2 * Math.max(0, W.lv.gale || 0));
    const hh = h * (0.86 + 0.14 * Math.sin(t * 1.7 + seed));
    ctx.globalAlpha = k;
    ctx.fillStyle = outer || 'rgba(255,150,60,0.9)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.22, y);
    ctx.quadraticCurveTo(x - h * 0.26, y - hh * 0.45, x + sx, y - hh);
    ctx.quadraticCurveTo(x + h * 0.26, y - hh * 0.45, x + h * 0.22, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = inner || 'rgba(255,238,176,0.95)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.1, y);
    ctx.quadraticCurveTo(x - h * 0.12, y - hh * 0.3, x + sx * 0.6, y - hh * 0.62);
    ctx.quadraticCurveTo(x + h * 0.12, y - hh * 0.3, x + h * 0.1, y);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  几何缓存（随屏幕缩放、大地细节就绪而重算）
  // ════════════════════════════════════════════════════════════
  let G = null;
  function layout() {
    const key = W.w + 'x' + W.h + ':' + Math.round(gY(2, 0.7)) + ':' + Math.round(gY(1, 0.7)) + ':' + Math.round(gY(0, 0.85));
    if (G && G.key === key) return G;
    const r = U.mulberry32(4613);
    // 城（中丘）：一排排的房屋，亚波罗的庙在城中
    const houses = [];
    for (let row = 0; row < 2; row++) {
      let x = X('city0') + row * 0.006;
      while (x < X('city1')) {
        const w = 0.011 + r() * 0.013;
        const far = Math.abs(x - X('temple')) < at(0.038, 0.05);
        if (!far) houses.push({ x, w, h: 0.55 + r() * 0.7, row, roof: r() < 0.72, col: (r() * 4) | 0, lit: r() < 0.55, wx: r(), wy: r() });
        x += w * (0.78 + r() * 0.5);
      }
    }
    // 田：垄沟与麦子、各样的花（按种子定下）
    const stalks = [], flowers = [];
    for (let i = 0; i < 260; i++) stalks.push([r(), r(), 0.75 + r() * 0.5, r()]);
    for (let i = 0; i < 46; i++) flowers.push([r(), r(), (r() * 4) | 0, r()]);
    // 撒下的种子
    const seeds = [];
    for (let i = 0; i < 40; i++) seeds.push([r(), r()]);
    G = { key, houses, stalks, flowers, seeds };
    return G;
  }

  // ════════════════════════════════════════════════════════════
  //  远山：哥林多的城山
  // ════════════════════════════════════════════════════════════
  const ACRO = [[0, 0], [0.06, 0.26], [0.12, 0.64], [0.18, 0.88], [0.26, 0.96], [0.38, 1], [0.52, 0.97], [0.64, 0.92], [0.74, 0.78], [0.84, 0.5], [0.93, 0.22], [1, 0.05]];
  function drawAcro(ctx) {
    const x0 = X('acro0') * W.w, x1 = X('acro1') * W.w, hh = at(0.072, 0.052) * W.h;
    const P = ACRO.map(q => { const x = lerp(x0, x1, q[0]); return [x, gY(0, x / W.w) + 1 - q[1] * hh]; });
    ctx.fillStyle = css([146, 132, 118], 0);
    ctx.beginPath();
    ctx.moveTo(x0, gY(0, x0 / W.w) + 3);
    for (const p of P) ctx.lineTo(p[0], p[1]);
    ctx.lineTo(x1, gY(0, x1 / W.w) + 3);
    ctx.closePath(); ctx.fill();
    // 顶上的城墙
    const s = SC(0);
    ctx.fillStyle = css([170, 156, 138], 0);
    ctx.beginPath();
    for (let u = 0.2; u <= 0.7; u += 0.028) {
      const i = Math.min(ACRO.length - 2, Math.floor(u * (ACRO.length - 1)));
      const a = ACRO[i], b2 = ACRO[i + 1], t = (u - a[0]) / Math.max(1e-6, b2[0] - a[0]);
      const x = lerp(x0, x1, u), y = gY(0, x / W.w) + 1 - lerp(a[1], b2[1], clamp(t, 0, 1)) * hh;
      const th = (Math.round(u / 0.028) % 2 ? 3.2 : 4.6) * s;
      ctx.rect(x - 2.6 * s, y - th, 5.2 * s, th + 1);
    }
    ctx.fill();
    // 迎光的一边：一道细亮
    ctx.strokeStyle = css([226, 208, 178], 0, 0.35 * (0.3 + 0.7 * W.daylight));
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const p = P[i]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  城（中丘）：房屋、亚波罗的庙；夜里窗里有灯
  // ════════════════════════════════════════════════════════════
  const PLASTER = [[222, 208, 182], [206, 190, 164], [232, 220, 196], [196, 176, 150]];
  const TILE = [176, 92, 64], WOOD = [118, 84, 56], STONE = [206, 194, 172], LINEN = [238, 232, 216];
  function drawCity(ctx) {
    const g = layout(), s = SC(1) * 1.15, nk = nightK();
    const win = [];
    for (let row = 1; row >= 0; row--) {
      for (const hs of g.houses) {
        if (hs.row !== row) continue;
        const x = hs.x * W.w, w = hs.w * W.w, gy = gY(1, hs.x + hs.w / 2) + 2 - row * 5 * s, h = (12 + hs.h * 12) * s;
        ctx.fillStyle = css(PLASTER[hs.col], 1, 1, row ? -0.08 : 0);
        ctx.fillRect(x, gy - h, w, h + 3);
        if (hs.roof) {
          ctx.fillStyle = css(TILE, 1, 1, row ? -0.1 : -0.02);
          ctx.beginPath();
          ctx.moveTo(x - 1.2 * s, gy - h); ctx.lineTo(x + w / 2, gy - h - Math.min(w * 0.28, 6 * s)); ctx.lineTo(x + w + 1.2 * s, gy - h);
          ctx.closePath(); ctx.fill();
        }
        if (hs.lit) win.push([x + w * (0.25 + 0.5 * hs.wx), gy - h * (0.35 + 0.3 * hs.wy)]);
      }
    }
    // 亚波罗的庙：台基、七根柱子、楣与山墙（林后 6:16：它暗下去）
    const tx = X('temple') * W.w, tg = gY(1, X('temple')) + 1, idol = -0.45 * LV.coIdol;
    const tw = 74 * s, ch = 26 * s;
    ctx.fillStyle = css(STONE, 1, 1, idol);
    ctx.fillRect(tx - tw / 2 - 4 * s, tg - 5 * s, tw + 8 * s, 6 * s);
    ctx.fillRect(tx - tw / 2 - 2 * s, tg - 7 * s, tw + 4 * s, 3 * s);
    ctx.fillStyle = css([226, 214, 190], 1, 1, idol);
    for (let i = 0; i < 7; i++) {
      const cx = tx - tw / 2 + 3 * s + i * (tw - 6 * s) / 6;
      ctx.fillRect(cx - 2.1 * s, tg - 7 * s - ch, 4.2 * s, ch);
    }
    ctx.fillStyle = css(STONE, 1, 1, idol - 0.04);
    ctx.fillRect(tx - tw / 2 - 2 * s, tg - 7 * s - ch - 5 * s, tw + 4 * s, 5 * s);
    ctx.beginPath();
    ctx.moveTo(tx - tw / 2 - 3 * s, tg - 12 * s - ch); ctx.lineTo(tx, tg - 21 * s - ch); ctx.lineTo(tx + tw / 2 + 3 * s, tg - 12 * s - ch);
    ctx.closePath(); ctx.fill();
    // 夜里的窗
    if (nk > 0.05) {
      const sp = sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < win.length; i++) {
        const q = win[i], fl = 0.8 + 0.2 * Math.sin(W.t * 2 + i * 1.7);
        ctx.globalAlpha = 0.9 * nk * fl;
        ctx.fillStyle = 'rgba(255,196,118,0.95)';
        ctx.fillRect(q[0] - 1.1 * s, q[1] - 1.5 * s, 2.2 * s, 3 * s);
        glowSp(ctx, sp.warm, q[0], q[1], 7 * s, 0.35 * nk * fl);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  山坡上的坟墓（中丘右边）：石头滚开，光涌出，冷影被吞灭
  // ════════════════════════════════════════════════════════════
  const TOMB_U = [0.24, 0.52, 0.78];
  function tombGeo() {
    const x0 = X('tomb0') * W.w, x1 = X('tomb1') * W.w, s = SC(1) * at(1.9, 2.2);
    const g0 = gY(1, X('tomb0')), g1 = gY(1, X('tomb1'));
    const base = Math.max(g0, g1) + 2, hh = 34 * s;
    return { x0, x1, s, base, hh };
  }
  function drawTombs(ctx) {
    const T0 = tombGeo(), { x0, x1, s, base, hh } = T0;
    // 岩壁
    ctx.fillStyle = css([176, 154, 124], 1);
    ctx.beginPath();
    ctx.moveTo(x0 - 6 * s, base + 2);
    ctx.bezierCurveTo(x0 + (x1 - x0) * 0.1, base - hh * 0.9, x0 + (x1 - x0) * 0.35, base - hh * 1.05, x0 + (x1 - x0) * 0.55, base - hh);
    ctx.bezierCurveTo(x0 + (x1 - x0) * 0.8, base - hh * 0.95, x1, base - hh * 0.6, x1 + 8 * s, base + 2);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([204, 180, 150], 1, 0.4);
    ctx.lineWidth = 1;
    ctx.stroke();
    const open = ease(LV.coTomb), L = LV.coTombL, sp = sprites();
    for (let i = 0; i < TOMB_U.length; i++) {
      const cx = lerp(x0, x1, TOMB_U[i]), dw = 9 * s, dh = 12 * s, by = base - 3 * s - (i === 1 ? 5 * s : 0);
      // 门洞
      ctx.fillStyle = L > 0.02 ? rgba([255, 240, 206], 0.25 + 0.75 * L) : css([30, 24, 22], 1);
      ctx.beginPath();
      ctx.moveTo(cx - dw / 2, by); ctx.lineTo(cx - dw / 2, by - dh * 0.6);
      ctx.quadraticCurveTo(cx, by - dh * 1.1, cx + dw / 2, by - dh * 0.6); ctx.lineTo(cx + dw / 2, by);
      ctx.closePath(); ctx.fill();
      if (L > 0.02) { ctx.fillStyle = css([30, 24, 22], 1, 1 - L); ctx.fill(); }
      // 圆石：滚开到门旁
      const rr = dh * 0.55, sx = cx + open * dw * 1.05, ang = open * 2.2;
      ctx.fillStyle = css([150, 138, 120], 1);
      ctx.beginPath(); ctx.arc(sx, by - rr + 1, rr, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([222, 206, 180], 1, 0.4);
      ctx.beginPath(); ctx.arc(sx, by - rr + 1, rr, -2.4, -0.7); ctx.stroke();
      ctx.strokeStyle = css([80, 70, 62], 1, 0.7);
      ctx.beginPath(); ctx.moveTo(sx + Math.cos(ang) * rr * 0.6, by - rr + 1 + Math.sin(ang) * rr * 0.6); ctx.lineTo(sx - Math.cos(ang) * rr * 0.6, by - rr + 1 - Math.sin(ang) * rr * 0.6); ctx.stroke();
      // 光从里面涌出
      if (L > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, sp.white, cx, by - dh * 0.5, 22 * s, 0.75 * L);
        glowSp(ctx, sp.gold, cx, by - dh * 0.5, 50 * s, 0.35 * L);
        beam(ctx, sp.beam, cx, by - dh * 0.4, cx - (7 - i * 5) * s, by - dh * 0.4 - 110 * s, 18 * s, 0.45 * L);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
    // 笼罩坟墓的冷影（死）
    const D = LV.coDeath;
    if (D > 0.01) {
      const cx = (x0 + x1) / 2, cy = base - hh * 0.55, R = (x1 - x0) * 0.7 * (0.35 + 0.65 * D);
      for (let i = 0; i < 5; i++) {
        const a = W.t * 0.12 + i * 1.3, rx = cx + Math.cos(a) * R * 0.35, ry = cy + Math.sin(a * 1.3) * hh * 0.25;
        glowSp(ctx, sp.dark, rx, ry, R * (0.45 + 0.12 * i / 5), 0.2 * D);
      }
      glowSp(ctx, sp.mist, cx, cy, R * 1.05, 0.5 * D);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  船（近海）：泊在码头边；帆张开，往东去，没入天边
  // ════════════════════════════════════════════════════════════
  function shipPos() {
    const t = LV.coShip, e = U.easeInOut(clamp(t, 0, 1));
    const x0 = X('ship') * W.w, y0 = at(0.866, 0.872) * W.h;
    const x = x0 - e * at(0.2, 0.2) * W.w, y = lerp(y0, W.h * 0.634, e);
    const k = SC(2) * 0.95 * (W.seaScale(y) / Math.max(1e-6, W.seaScale(y0)));
    return { x, y, k, a: 1 - sm(0.8, 1, t), t };
  }
  function drawShip(ctx) {
    const P = shipPos();
    if (P.a < 0.01) return;
    const k = P.k, sail = LV.coSail;
    ctx.save();
    ctx.translate(P.x, P.y);
    ctx.scale(k, k);
    ctx.globalAlpha = P.a;
    // 水中的倒影
    ctx.strokeStyle = css([60, 48, 40], 2, 0.28);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const yy = 3 + i * 2.4, w = 30 - i * 5 + Math.sin(W.t * 1.3 + i) * 2; ctx.moveTo(-w, yy); ctx.lineTo(w, yy); }
    ctx.stroke();
    // 船身（船头朝左）
    ctx.fillStyle = css([92, 66, 46], 2);
    ctx.beginPath();
    ctx.moveTo(-40, -12); ctx.quadraticCurveTo(-36, -3, -28, 1); ctx.lineTo(26, 1); ctx.quadraticCurveTo(34, -2, 38, -9);
    ctx.lineTo(41, -16); ctx.lineTo(36, -11); ctx.lineTo(-34, -9); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 110, 72], 2);
    ctx.fillRect(-33, -10.5, 66, 1.8);
    // 桅与横桁
    ctx.fillStyle = css([80, 58, 40], 2);
    ctx.fillRect(-1.2, -58, 2.4, 50);
    ctx.fillRect(-20, -54, 40, 1.8);
    // 帆：收着（一卷）或张开
    if (sail > 0.02) {
      const b = 5 * sail * (1 + 0.15 * Math.sin(W.t * 1.4));
      ctx.fillStyle = css([230, 218, 192], 2, 0.3 + 0.7 * sail);
      ctx.beginPath();
      ctx.moveTo(-19, -52); ctx.lineTo(19, -52);
      ctx.quadraticCurveTo(19 - b, -34, 17, -16 * sail - 36 * (1 - sail));
      ctx.lineTo(-17, -16 * sail - 36 * (1 - sail));
      ctx.quadraticCurveTo(-19 - b, -34, -19, -52);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([170, 150, 120], 2, 0.5 * sail);
      ctx.lineWidth = 0.8;
      ctx.beginPath(); for (let i = -12; i <= 12; i += 8) { ctx.moveTo(i, -52); ctx.lineTo(i * 0.95, -18 * sail - 34 * (1 - sail)); } ctx.stroke();
    }
    if (sail < 0.98) {
      ctx.fillStyle = css([214, 200, 172], 2, 1 - sail);
      ctx.fillRect(-19, -53.5, 38, 4);
    }
    // 船上捐资的光
    if (S.chest === 'ship' && LV.coChest > 0.02) {
      const sp = sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, sp.gold, 8, -14, 22, 0.6 * LV.coChest * P.a);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = P.a;
      ctx.fillStyle = css([150, 104, 60], 2, 1, 0.2);
      ctx.fillRect(3, -16, 10, 5);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  近岸：码头、窑与瓦器、该犹的家、院子、桌子、田
  // ════════════════════════════════════════════════════════════
  function drawPier(ctx) {
    const s = SC(2), xq = X('quay') * W.w, x0 = X('pier0') * W.w;
    const deck = gY(2, X('quay')) - 1.5 * s;
    // 桩
    ctx.fillStyle = css([82, 60, 42], 2);
    for (let x = x0 + 2 * s; x < xq; x += 11 * s) {
      const g = Math.min(gY(2, x / W.w), deck + 26 * s);
      ctx.fillRect(x - 1.4 * s, deck, 2.8 * s, Math.max(4 * s, g - deck + 6 * s));
    }
    // 板
    ctx.fillStyle = css([132, 98, 66], 2);
    ctx.fillRect(x0 - 2 * s, deck - 2.6 * s, xq - x0 + 8 * s, 3.2 * s);
    ctx.fillStyle = css([176, 136, 94], 2, 0.8);
    ctx.fillRect(x0 - 2 * s, deck - 2.6 * s, xq - x0 + 8 * s, 0.9 * s);
    // 系船的桩与缆
    const bx = x0 + 4 * s;
    ctx.fillStyle = css([70, 54, 40], 2);
    ctx.fillRect(bx - 1.8 * s, deck - 7 * s, 3.6 * s, 5 * s);
    if (LV.coShip < 0.03) {
      const P = shipPos();
      ctx.strokeStyle = css([150, 124, 90], 2, 0.8);
      ctx.lineWidth = Math.max(0.8, 0.7 * s);
      ctx.beginPath();
      ctx.moveTo(bx, deck - 6 * s);
      ctx.quadraticCurveTo((bx + P.x + 30 * P.k) / 2, deck + 2 * s, P.x + 32 * P.k, P.y - 9 * P.k);
      ctx.stroke();
    }
  }
  // 瓦器：[横向位置 0..1（架子两端之间）, 在架上?, 高, 宽, 样子, 有裂缝?]
  const JARS = [
    [0.12, false, 17, 9, 'amph', true], [0.02, true, 9, 6, 'jug'], [0.34, true, 11, 5, 'amph'], [0.5, false, 14, 10, 'pot'],
    [0.64, true, 8, 7, 'bowl'], [0.9, true, 10, 6, 'jug'], [0.84, false, 16, 8, 'amph'],
  ];
  const CLAY = [178, 106, 66];
  function jarGeo(i) {
    const j = JARS[i], s = SC(2) * 1.45, xs = lerp(X('shelf0'), X('shelf1'), j[0]);
    const ground = vY(xs, 0.1), shelfY = gY(2, (X('shelf0') + X('shelf1')) / 2) - 15 * SC(2);
    return { x: xs * W.w, y: j[1] ? shelfY : ground, h: j[2] * s, w: j[3] * s, kind: j[4], crack: !!j[5], s };
  }
  function jarPath(ctx, q) {
    const { x, y, h, w } = q;
    ctx.beginPath();
    if (q.kind === 'amph') {
      ctx.moveTo(x - w * 0.12, y);
      ctx.quadraticCurveTo(x - w * 0.62, y - h * 0.45, x - w * 0.2, y - h * 0.82);
      ctx.lineTo(x - w * 0.2, y - h); ctx.lineTo(x + w * 0.2, y - h); ctx.lineTo(x + w * 0.2, y - h * 0.82);
      ctx.quadraticCurveTo(x + w * 0.62, y - h * 0.45, x + w * 0.12, y);
    } else if (q.kind === 'bowl') {
      ctx.moveTo(x - w * 0.5, y - h * 0.62); ctx.quadraticCurveTo(x, y + h * 0.1, x + w * 0.5, y - h * 0.62);
      ctx.lineTo(x + w * 0.42, y - h * 0.7); ctx.lineTo(x - w * 0.42, y - h * 0.7);
    } else if (q.kind === 'jug') {
      ctx.moveTo(x - w * 0.3, y);
      ctx.quadraticCurveTo(x - w * 0.62, y - h * 0.55, x - w * 0.16, y - h * 0.8);
      ctx.lineTo(x - w * 0.2, y - h); ctx.lineTo(x + w * 0.2, y - h); ctx.lineTo(x + w * 0.16, y - h * 0.8);
      ctx.quadraticCurveTo(x + w * 0.62, y - h * 0.55, x + w * 0.3, y);
    } else {
      ctx.moveTo(x - w * 0.34, y);
      ctx.quadraticCurveTo(x - w * 0.6, y - h * 0.6, x - w * 0.3, y - h * 0.9);
      ctx.lineTo(x + w * 0.3, y - h * 0.9);
      ctx.quadraticCurveTo(x + w * 0.6, y - h * 0.6, x + w * 0.34, y);
    }
    ctx.closePath();
  }
  const JA = new Float32Array(JARS.length);           // 各瓦器里的光（画面上缓缓亮起）
  function drawWorkshop(ctx) {
    const s = SC(2), sp = sprites();
    const kx = X('kiln') * W.w, kg = vY(X('kiln'), 0.02);
    // 窑：圆顶、拱口；窑火
    const kw = 30 * s, kh = 25 * s, K = LV.coKiln;
    ctx.fillStyle = css([170, 118, 84], 2);
    ctx.beginPath();
    ctx.moveTo(kx - kw / 2, kg + 1);
    ctx.bezierCurveTo(kx - kw / 2, kg - kh * 0.8, kx - kw * 0.2, kg - kh, kx, kg - kh);
    ctx.bezierCurveTo(kx + kw * 0.2, kg - kh, kx + kw / 2, kg - kh * 0.8, kx + kw / 2, kg + 1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([138, 92, 64], 2);
    ctx.fillRect(kx - 3 * s, kg - kh - 3 * s, 6 * s, 4 * s);
    ctx.fillStyle = K > 0.03 ? rgba([255, 150 + 60 * K, 70], 0.35 + 0.65 * K) : css([34, 24, 20], 2);
    ctx.beginPath();
    ctx.moveTo(kx - 5 * s, kg + 1); ctx.lineTo(kx - 5 * s, kg - 5 * s); ctx.quadraticCurveTo(kx, kg - 11 * s, kx + 5 * s, kg - 5 * s); ctx.lineTo(kx + 5 * s, kg + 1);
    ctx.closePath(); ctx.fill();
    if (K > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, sp.ember, kx, kg - 4 * s, 26 * s, 0.5 * K * (0.85 + 0.15 * Math.sin(W.t * 5)));
      glowSp(ctx, sp.warm, kx, kg - 8 * s, 60 * s, 0.22 * K * (0.4 + 0.6 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 棚与架子
    const a0 = X('shelf0') * W.w - 3 * s, a1 = X('shelf1') * W.w + 3 * s;
    const ag = gY(2, (X('shelf0') + X('shelf1')) / 2);
    ctx.fillStyle = css(WOOD, 2);
    ctx.fillRect(a0 - 1.2 * s, ag - 42 * s, 2.4 * s, 44 * s);
    ctx.fillRect(a1 - 1.2 * s, ag - 46 * s, 2.4 * s, 48 * s);
    ctx.fillRect(a0, ag - 16 * s, a1 - a0, 2 * s);
    ctx.fillStyle = css([184, 160, 120], 2);
    ctx.beginPath();
    ctx.moveTo(a0 - 6 * s, ag - 41 * s); ctx.lineTo(a1 + 6 * s, ag - 48 * s); ctx.lineTo(a1 + 6 * s, ag - 45 * s); ctx.lineTo(a0 - 6 * s, ag - 38 * s);
    ctx.closePath(); ctx.fill();
    // 瓦器里的光（林后 4:7）：光在瓦器后面晕开，瓦器仍看得见；光从瓶口、从裂缝里出来
    const lit = i => JA[i] * LV.coJarsA;
    let any = false;
    for (let i = 0; i < JARS.length; i++) if (lit(i) > 0.01) any = true;
    if (any) {
      ctx.globalCompositeOperation = 'lighter';
      const jA = LV.coJarsA * (0.45 + 0.55 * nightK());
      if (jA > 0.02) glowSp(ctx, sp.warm, (X('shelf0') + X('shelf1')) / 2 * W.w, gY(2, X('shelf0')) - 10 * SC(2), 64 * SC(2), 0.26 * jA * Math.min(1, S.jars / 3));
      for (let i = 0; i < JARS.length; i++) {
        const a = lit(i);
        if (a < 0.01) continue;
        const q = jarGeo(i);
        glowSp(ctx, sp.gold, q.x, q.y - q.h * 0.55, q.w * 2.3, 0.45 * a);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 瓦器
    for (let i = 0; i < JARS.length; i++) {
      const q = jarGeo(i), a = lit(i);
      jarPath(ctx, q);
      ctx.fillStyle = css(CLAY, 2, 1, (i % 3) * 0.03 + 0.18 * a);
      ctx.fill();
      // 迎光一侧
      ctx.strokeStyle = a > 0.05 ? rgba([255, 214, 160], 0.35 + 0.5 * a) : css([226, 170, 120], 2, 0.45);
      ctx.lineWidth = Math.max(0.8, 0.6 * SC(2));
      ctx.stroke();
      if (q.crack) {
        const cx = q.x, cy = q.y - q.h * 0.5;
        ctx.strokeStyle = css([60, 36, 24], 2, 0.9);
        ctx.lineWidth = Math.max(0.8, 0.5 * q.s);
        ctx.beginPath();
        ctx.moveTo(cx - q.w * 0.12, q.y - q.h * 0.9); ctx.lineTo(cx + q.w * 0.08, cy - q.h * 0.12); ctx.lineTo(cx - q.w * 0.1, cy + q.h * 0.08); ctx.lineTo(cx + q.w * 0.14, q.y - q.h * 0.12);
        ctx.moveTo(cx + q.w * 0.08, cy - q.h * 0.12); ctx.lineTo(cx + q.w * 0.3, cy - q.h * 0.02);
        ctx.stroke();
      }
    }
    if (any) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < JARS.length; i++) {
        const a = lit(i);
        if (a < 0.01) continue;
        const q = jarGeo(i), cy = q.y - q.h * 0.5, fl = 0.9 + 0.1 * Math.sin(W.t * 3 + i), mouth = q.kind === 'bowl' ? q.y - q.h * 0.7 : q.y - q.h;
        // 瓶口的光
        glowSp(ctx, sp.white, q.x, mouth, q.w * 0.6, 0.8 * a * fl);
        beam(ctx, sp.beam, q.x, mouth + q.h * 0.05, q.x, mouth - q.h * 1.5, q.w * 0.8, 0.4 * a * fl);
        if (q.crack && LV.coCrack > 0.02) {
          const c = LV.coCrack, cx = q.x;
          ctx.globalAlpha = 0.95 * c * a;
          ctx.strokeStyle = 'rgba(255,248,226,1)';
          ctx.lineWidth = Math.max(1, 0.9 * q.s);
          ctx.beginPath();
          ctx.moveTo(cx - q.w * 0.12, q.y - q.h * 0.9); ctx.lineTo(cx + q.w * 0.08, cy - q.h * 0.12); ctx.lineTo(cx - q.w * 0.1, cy + q.h * 0.08); ctx.lineTo(cx + q.w * 0.14, q.y - q.h * 0.12);
          ctx.moveTo(cx + q.w * 0.08, cy - q.h * 0.12); ctx.lineTo(cx + q.w * 0.3, cy - q.h * 0.02);
          ctx.stroke();
          // 从裂缝里射出的光
          for (let k = 0; k < 5; k++) {
            const ang = Math.PI - (0.2 + k * 0.62) + Math.sin(W.t * 0.7 + k) * 0.05, L = q.h * (1.3 + 0.5 * hsh(k + 3));
            beam(ctx, sp.beam, cx, cy, cx + Math.cos(ang) * L, cy - Math.sin(ang) * L * 0.75, q.w * 0.45, 0.4 * c * a);
          }
          glowSp(ctx, sp.white, cx, cy, q.w * 0.7, 0.5 * c * a);
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 该犹的家：墙、瓦顶、门、窗、墙上的灯、铜镜；院子的石地
  function houseGeo() {
    const s = SC(2), x0 = X('house0') * W.w, x1 = X('house1') * W.w;
    const gm = gY(2, (X('house0') + X('house1')) / 2);
    const top = gm - 64 * s;
    return { s, x0, x1, top, gm };
  }
  function drawCourt(ctx) {
    const s = SC(2), x0 = X('house0') - 0.012, x1 = X('house1') + 0.012;
    ctx.fillStyle = css([190, 178, 154], 2, 0.5);
    ctx.beginPath();
    const N = 16;
    for (let i = 0; i <= N; i++) { const xf = lerp(x0, x1, i / N); const y = gY(2, xf); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = N; i >= 0; i--) { const xf = lerp(x0 + 0.01, x1 - 0.01, i / N); ctx.lineTo(xf * W.w, vY(xf, 0.66)); }
    ctx.closePath(); ctx.fill();
    // 石板的缝
    ctx.strokeStyle = css([128, 116, 96], 2, 0.3);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (const v of [0.2, 0.42]) {
      for (let i = 0; i <= N; i++) { const xf = lerp(x0 + 0.006, x1 - 0.006, i / N); const y = vY(xf, v); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    }
    for (let k = 1; k < 9; k++) {
      const xf = lerp(x0 + 0.01, x1 - 0.01, k / 9);
      ctx.moveTo(xf * W.w, vY(xf, 0.02)); ctx.lineTo((xf + (xf - (x0 + x1) / 2) * 0.12) * W.w, vY(xf, 0.64));
    }
    ctx.stroke();
    void s;
  }
  function drawHouse(ctx) {
    const H = houseGeo(), { s, x0, x1, top } = H, lamps = LV.coLamps, nk = nightK(), sp = sprites();
    // 墙（下沿随地）
    ctx.fillStyle = css([226, 212, 184], 2);
    ctx.beginPath();
    ctx.moveTo(x0, top);
    ctx.lineTo(x1, top);
    const N = 12;
    for (let i = N; i >= 0; i--) { const x = lerp(x0, x1, i / N); ctx.lineTo(x, gY(2, x / W.w) + 3); }
    ctx.closePath(); ctx.fill();
    // 墙脚一道深色
    ctx.fillStyle = css([176, 132, 96], 2);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(x0, x1, i / N); const y = gY(2, x / W.w) - 9 * s; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(x0, x1, i / N); ctx.lineTo(x, gY(2, x / W.w) + 3); }
    ctx.closePath(); ctx.fill();
    // 瓦顶
    ctx.fillStyle = css(TILE, 2);
    ctx.beginPath();
    ctx.moveTo(x0 - 7 * s, top + 1); ctx.lineTo(x0 + 16 * s, top - 13 * s); ctx.lineTo(x1 - 16 * s, top - 13 * s); ctx.lineTo(x1 + 7 * s, top + 1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([120, 58, 40], 2, 0.55);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let k = 1; k < 4; k++) { const y = top + 1 - k * 3.3 * s, dx = 7 * s + k * 5.7 * s; ctx.moveTo(x0 - 7 * s + dx, y); ctx.lineTo(x1 + 7 * s - dx, y); }
    ctx.stroke();
    ctx.strokeStyle = css([240, 190, 150], 2, 0.4);
    ctx.beginPath(); ctx.moveTo(x0 + 16 * s, top - 13 * s); ctx.lineTo(x1 - 16 * s, top - 13 * s); ctx.stroke();
    // 门（夜里门里有灯光）
    const dx = X('door') * W.w, dg = gY(2, X('door')) + 2, dw = 14 * s, dh = 34 * s;
    ctx.fillStyle = css([104, 72, 48], 2);
    ctx.fillRect(dx - dw / 2 - 2 * s, dg - dh - 3 * s, dw + 4 * s, 3 * s);
    const lit = lamps * clamp(0.3 + nk, 0, 1);
    ctx.fillStyle = lit > 0.05 ? rgba([255, 200, 130], 0.3 + 0.6 * lit) : css([46, 34, 28], 2);
    ctx.fillRect(dx - dw / 2, dg - dh, dw, dh);
    if (lit > 0.05) { ctx.fillStyle = css([46, 34, 28], 2, 1 - lit); ctx.fillRect(dx - dw / 2, dg - dh, dw, dh); }
    // 窗
    for (const k of ['win1', 'win2']) {
      const wx = X(k) * W.w, wy = top + 14 * s;
      ctx.fillStyle = lit > 0.05 ? rgba([255, 204, 136], 0.3 + 0.6 * lit) : css([60, 46, 38], 2);
      ctx.fillRect(wx - 4 * s, wy, 8 * s, 9 * s);
      if (lit > 0.05) { ctx.fillStyle = css([60, 46, 38], 2, 1 - lit); ctx.fillRect(wx - 4 * s, wy, 8 * s, 9 * s); }
      ctx.fillStyle = css([150, 110, 78], 2);
      ctx.fillRect(wx - 5 * s, wy + 9 * s, 10 * s, 1.6 * s);
    }
    // 铜镜（13:12）：模糊 → 明亮
    const mx = X('mirror') * W.w, my = top + 20 * s, mr = 9 * s, mc = LV.coMirror;
    ctx.fillStyle = css([128, 96, 58], 2);
    ctx.fillRect(mx - 0.9 * s, my + mr - 1, 1.8 * s, 6 * s);
    ctx.beginPath(); ctx.arc(mx, my, mr + 1.4 * s, 0, TAU); ctx.fill();
    ctx.fillStyle = css([188, 150, 92], 2, 1, 0.08);
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
    if (mc > 0.01 || lamps > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      const blur = 1 - sm(0.4, 1, mc);
      // 模糊不清的一团光（灯的影子）……到那时，一面清清楚楚的亮
      glowSp(ctx, sp.warm, mx + 1.5 * s * blur, my + 1 * s * blur, mr * (0.8 + 1.4 * blur), 0.28 * Math.max(lamps * nk, mc) * (0.6 + 0.4 * blur));
      if (mc > 0.35) {
        // 到那时就要面对面了：镜面清清楚楚地亮，外面一圈光环（这一刻有它自己的像）
        const c = sm(0.4, 1, mc), br = 0.92 + 0.08 * Math.sin(W.t * 1.3);
        ctx.globalAlpha = 0.9 * c;
        ctx.fillStyle = 'rgba(255,250,236,1)';
        ctx.beginPath(); ctx.arc(mx, my, mr * 0.95, 0, TAU); ctx.fill();
        glowSp(ctx, sp.white, mx, my, mr * 5.5 * br, 0.5 * c);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = rgba([255, 244, 222], 0.65 * c * br);
        ctx.lineWidth = Math.max(1.5, 1.4 * s);
        ctx.beginPath(); ctx.arc(mx, my, mr * (1.8 + 0.3 * c), 0, TAU); ctx.stroke();
        ctx.strokeStyle = rgba([255, 244, 222], 0.3 * c * br);
        ctx.lineWidth = Math.max(1, 0.8 * s);
        ctx.beginPath(); ctx.arc(mx, my, mr * (2.6 + 0.5 * c), 0, TAU); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 夜里，灯光照亮院子
    if (lamps > 0.03 && nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      const cx = X('cx') * W.w, cy = vY(X('cx'), 0.28);
      glowSp(ctx, sp.warm, cx, cy, (x1 - x0) * 0.72, 0.3 * lamps * nk, 0.42);
      glowSp(ctx, sp.warm, X('door') * W.w, gY(2, X('door')) - 6 * s, 50 * s, 0.35 * lamps * nk, 0.8);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 墙上的灯
    for (const k of ['lampL', 'lampR']) {
      const lx = X(k) * W.w, ly = top + 26 * s;
      ctx.fillStyle = css([110, 80, 50], 2);
      ctx.fillRect(lx - 3.5 * s, ly, 7 * s, 1.6 * s);
      ctx.fillStyle = css([170, 110, 70], 2);
      ctx.beginPath(); ctx.ellipse(lx, ly - 1.4 * s, 3.4 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      if (lamps > 0.03) {
        flame(ctx, lx + 2 * s, ly - 2 * s, 6 * s, lamps, lx);
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, sp.warm, lx + 2 * s, ly - 5 * s, 34 * s, 0.4 * lamps * (0.35 + 0.65 * nk));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    ctx.globalAlpha = 1;
  }
  // 矮桌：饼与杯
  function tableGeo() {
    const s = SC(2), xt = X('table') * W.w, yf = vY(X('table'), 0.32), sv = s * (1 + 0.35 * 0.32);
    return { s: sv, x: xt, y: yf, top: yf - 9 * sv, w: 50 * sv };
  }
  function drawTable(ctx) {
    const T0 = tableGeo(), { s, x, top, w, y } = T0, sp = sprites();
    ctx.fillStyle = css(WOOD, 2);
    ctx.fillRect(x - w / 2 + 3 * s, top, 2.4 * s, y - top);
    ctx.fillRect(x + w / 2 - 5.4 * s, top, 2.4 * s, y - top);
    ctx.fillStyle = css(LINEN, 2);
    ctx.fillRect(x - w / 2, top - 2.4 * s, w, 2.4 * s);
    ctx.fillStyle = css([220, 212, 194], 2);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w / 2 - 2 * s, top + 4.5 * s); ctx.lineTo(x - w / 2 + 2 * s, top + 4.5 * s);
    ctx.closePath(); ctx.fill();
    const tb = LV.coTable;
    if (tb < 0.02) return;
    ctx.globalAlpha = tb;
    // 饼（擘开之后是两半）
    const bx = x - 9 * s, by = top - 2.4 * s, gap = S.broken ? 2.2 * s : 0;
    ctx.fillStyle = css([206, 164, 104], 2, tb);
    ctx.beginPath(); ctx.ellipse(bx - gap, by - 2 * s, S.broken ? 3.2 * s : 6 * s, 2.8 * s, 0, 0, TAU); ctx.fill();
    if (S.broken) { ctx.beginPath(); ctx.ellipse(bx + gap + 1 * s, by - 2 * s, 3.2 * s, 2.8 * s, 0, 0, TAU); ctx.fill(); }
    // 杯
    const cx = x + 10 * s;
    ctx.fillStyle = css([188, 150, 86], 2, tb);
    ctx.beginPath();
    ctx.moveTo(cx - 3.4 * s, by - 7 * s); ctx.lineTo(cx + 3.4 * s, by - 7 * s); ctx.lineTo(cx + 1 * s, by - 3.4 * s); ctx.lineTo(cx - 1 * s, by - 3.4 * s);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(cx - 0.6 * s, by - 3.6 * s, 1.2 * s, 3 * s);
    ctx.fillRect(cx - 2.4 * s, by - 0.9 * s, 4.8 * s, 1 * s);
    // 桌上的一盏小灯
    const lamps = LV.coLamps;
    if (lamps > 0.03) {
      ctx.fillStyle = css([170, 110, 70], 2, tb);
      ctx.beginPath(); ctx.ellipse(x + 1 * s, by - 1 * s, 3 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
      flame(ctx, x + 2.6 * s, by - 1.8 * s, 5 * s, lamps * tb, 7.3);
    }
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, sp.warm, x, by - 3 * s, 40 * s, 0.35 * lamps * nightK() * tb);
    glowSp(ctx, sp.gold, bx, by - 2 * s, 16 * s, 0.75 * LV.coBread * tb);
    glowSp(ctx, sp.wine, cx, by - 6 * s, 14 * s, 0.75 * LV.coCup * tb);
    glowSp(ctx, sp.gold, cx, by - 6 * s, 6 * s, 0.6 * LV.coCup * tb);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 捐资的箱子（码头上）
  function drawChest(ctx) {
    if (S.chest !== 'quay' && S.chest !== 'carried') return;
    const s = SC(2) * 1.15, sp = sprites();
    let xf = X('chest'), v = 0.5;
    if (S.chest === 'carried') { xf = X('quay') - 0.004; v = 0.52; }
    const x = xf * W.w, y = vY(xf, v);
    ctx.fillStyle = css([128, 90, 58], 2);
    ctx.fillRect(x - 7 * s, y - 8 * s, 14 * s, 8 * s);
    ctx.fillStyle = css([164, 120, 76], 2);
    ctx.fillRect(x - 7.6 * s, y - 10 * s, 15.2 * s, 2.6 * s);
    ctx.fillStyle = css([210, 170, 90], 2);
    ctx.fillRect(x - 1 * s, y - 7 * s, 2 * s, 2.4 * s);
    const c = LV.coChest;
    if (c > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, sp.gold, x, y - 9 * s, 26 * s, 0.6 * c);
      glowSp(ctx, sp.white, x, y - 10 * s, 7 * s, 0.5 * c);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 田：垄沟、种子、麦子与花、初熟的一捆
  const ROWS_T = [0.05, 0.15, 0.26, 0.38, 0.51, 0.65];
  function fieldRows() { return ROWS_T.map(fv); }
  const sheafXY = () => { const xf = X('sheaf'), v = X('sheafV'); return [xf * W.w, vY(xf, v), v]; };
  function drawField(ctx) {
    const g = layout(), s = SC(2), x0 = X('field0'), x1 = X('field1');
    const rows = fieldRows();
    // 翻过的地（淡淡的一块，垄沟一道道）
    ctx.fillStyle = css([150, 118, 84], 2, 0.55);
    ctx.beginPath();
    const N = 10;
    const va = fv(0.02), vb = fv(0.7);
    for (let i = 0; i <= N; i++) { const xf = lerp(x0, x1, i / N); const y = vY(xf, va); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = N; i >= 0; i--) { const xf = lerp(x0 + 0.012, x1, i / N); ctx.lineTo(xf * W.w, vY(xf, vb)); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([98, 72, 50], 2, 0.55);
    ctx.lineWidth = Math.max(0.8, 0.9 * s);
    ctx.beginPath();
    for (let r = 0; r < rows.length; r++) {
      const v = rows[r], xa = x0 + 0.012 * ROWS_T[r];
      for (let i = 0; i <= N; i++) { const xf = lerp(xa, x1, i / N); const y = vY(xf, v); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    }
    ctx.stroke();
    // 撒下的种子（埋下之后渐隐）
    const sw = LV.coSown * (1 - LV.coSprout * 0.85) * (1 - LV.coGrow);
    if (sw > 0.02) {
      ctx.fillStyle = rgba([255, 236, 190], 0.8 * sw);
      for (const q of g.seeds) {
        const r = (q[0] * rows.length) | 0, v = rows[r], xf = lerp(x0 + 0.012 * ROWS_T[r], x1, q[1]);
        ctx.fillRect(xf * W.w - 0.8 * s, vY(xf, v) - 1.2 * s, 1.6 * s, 1.6 * s);
      }
    }
    // 麦子与各样的花（15:38 神随自己的意思给他一个形体）
    const gr = LV.coGrow, ripe = LV.coRipe;
    if (gr > 0.01) {
      const green = [110, 150, 70], gold = [226, 188, 96];
      const head = U.mixRGB ? U.mixRGB(green, gold, ripe) : green;
      ctx.lineWidth = Math.max(0.7, 0.75 * s);
      ctx.strokeStyle = css(U.mixRGB ? U.mixRGB([96, 134, 64], [196, 164, 88], ripe * 0.8) : green, 2);
      ctx.beginPath();
      const heads = [];
      for (const q of g.stalks) {
        const r = (q[0] * rows.length) | 0, v = fv(ROWS_T[r] + (q[3] - 0.5) * 0.05), xf = lerp(x0 + 0.012 * ROWS_T[r], x1, q[1]);
        const k = clamp(gr * 1.25 - q[3] * 0.25, 0, 1);
        if (k < 0.02) continue;
        const x = xf * W.w, y = vY(xf, v), h = (13 + 5 * q[2]) * s * (1 + 0.35 * v) * k;
        const sway = Math.sin(W.t * 1.1 + q[1] * 9) * 1.4 * s * k;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway * 0.3, y - h * 0.5, x + sway, y - h);
        heads.push([x + sway, y - h, k, v]);
      }
      ctx.stroke();
      ctx.fillStyle = css(head, 2, 1, 0.05 * ripe);
      ctx.beginPath();
      for (const hd of heads) { if (hd[2] < 0.5) continue; ctx.moveTo(hd[0] + 1.3 * s, hd[1]); ctx.ellipse(hd[0], hd[1] - 1.5 * s, 1.1 * s * (1 + 0.35 * hd[3]), 3 * s * (1 + 0.35 * hd[3]) * hd[2], 0, 0, TAU); }
      ctx.fill();
      const FC = [[232, 72, 60], [246, 240, 228], [160, 124, 222], [244, 206, 84]];
      for (const q of g.flowers) {
        const k = clamp((gr - 0.45) * 2.2 - q[3] * 0.3, 0, 1);
        if (k < 0.05) continue;
        const t = 0.04 + q[0] * 0.66, v = fv(t), xf = lerp(x0 + 0.012 * t, x1, q[1]), x = xf * W.w, y = vY(xf, v) - 6 * s * (1 + 0.35 * v) * k;
        ctx.fillStyle = css(FC[q[2]], 2, k);
        ctx.beginPath(); ctx.arc(x, y, 1.9 * s * k * (1 + 0.35 * v), 0, TAU); ctx.fill();
      }
    }
    // 第三天复活了：一棵发光的苗 → 初熟的果子（金色的一捆；放大些，是这一句的焦点）
    const sp0 = LV.coSprout, f1 = LV.coFirst;
    if (sp0 > 0.01) {
      const [x, y, v] = sheafXY(), sv = s * (1 + 0.35 * v) * 1.4, sp = sprites();
      const h = (6 + 18 * f1) * sv * sp0;
      const fg = LV.coFirstG;
      ctx.strokeStyle = css(U.mixRGB ? U.mixRGB([150, 220, 120], [255, 214, 120], f1) : [200, 220, 120], 2, 0.95, 0.45 * fg);
      ctx.lineWidth = Math.max(1, 1.2 * sv);
      ctx.beginPath();
      const n = 1 + Math.round(6 * f1);
      for (let i = 0; i < n; i++) {
        const a = (i - (n - 1) / 2) * 0.12;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + a * h * 0.3, y - h * 0.6, x + a * h, y - h);
      }
      ctx.stroke();
      if (f1 > 0.05) {
        ctx.fillStyle = css([255, 214, 110], 2, f1, 0.45 * fg);
        for (let i = 0; i < n; i++) { const a = (i - (n - 1) / 2) * 0.12; ctx.beginPath(); ctx.ellipse(x + a * h, y - h - 2 * sv, 1.4 * sv, 3.4 * sv, a, 0, TAU); ctx.fill(); }
        ctx.fillStyle = css([196, 150, 70], 2, f1, 0.3 * fg);
        ctx.fillRect(x - 3 * sv, y - h * 0.45, 6 * sv, 1.6 * sv);
      }
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, sp.green, x, y - h * 0.5, 16 * sv, 0.55 * sp0 * (1 - f1 * 0.5) * fg);
      glowSp(ctx, sp.gold, x, y - h * 0.7, 34 * sv, 0.55 * f1 * fg);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 新造的：一圈新的光漫过全地（林后 5:17）
  function drawNew(ctx) {
    const t = LV.coNew;
    if (t < 0.005 || t > 0.995) return;
    const o = [at(0.832, 0.84) * W.w, vY(at(0.832, 0.84), 0.2)];
    const R = t * W.w * 0.95, a = Math.sin(Math.PI * t) * 0.55;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba([214, 250, 170], a);
    ctx.lineWidth = Math.max(3, 10 * SU());
    ctx.beginPath(); ctx.ellipse(o[0], o[1], R, R * 0.13, 0, Math.PI, TAU); ctx.stroke();
    ctx.strokeStyle = rgba([255, 244, 200], a * 0.8);
    ctx.lineWidth = Math.max(1, 3 * SU());
    ctx.beginPath(); ctx.ellipse(o[0], o[1], R * 0.97, R * 0.125, 0, Math.PI, TAU); ctx.stroke();
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  天上：光的十字、信望爱、自上而来的光、三道光
  // ════════════════════════════════════════════════════════════
  function crossGeo() {
    const cx = X('cx') * W.w, top = at(0.14, 0.3) * W.h, bot = at(0.585, 0.63) * W.h;
    return { cx, top, bot, bar: top + (bot - top) * 0.27, half: at(0.07, 0.15) * W.w };
  }
  function drawCross(ctx) {
    const a = LV.coCross;
    if (a < 0.01) return;
    const g = crossGeo(), sp = sprites(), wv = at(34, 22) * SU(), day = 0.55 + 0.45 * (1 - W.daylight);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 竖
    beam(ctx, sp.beam, g.cx, g.top, g.cx, g.bot, wv, 0.9 * a * day);
    beam(ctx, sp.beam, g.cx, g.top + 8, g.cx, g.bot - 20, wv * 0.35, 0.9 * a * day);
    // 横
    beam(ctx, sp.beam, g.cx - g.half, g.bar, g.cx + g.half, g.bar, wv, 0.85 * a * day);
    beam(ctx, sp.beam, g.cx - g.half + 6, g.bar, g.cx + g.half - 6, g.bar, wv * 0.35, 0.85 * a * day);
    // 交会处的光与四散的细光
    glowSp(ctx, sp.gold, g.cx, g.bar, at(90, 60) * SU(), 0.55 * a * day);
    glowSp(ctx, sp.white, g.cx, g.bar, at(26, 18) * SU(), 0.8 * a * day);
    ctx.strokeStyle = rgba([255, 236, 200], 0.1 * a * day);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const ang = i * TAU / 12 + 0.13 + W.t * 0.01, r0 = 30 * SU(), r1 = (160 + 60 * hsh(i)) * SU() * at(1, 0.7);
      ctx.moveTo(g.cx + Math.cos(ang) * r0, g.bar + Math.sin(ang) * r0); ctx.lineTo(g.cx + Math.cos(ang) * r1, g.bar + Math.sin(ang) * r1);
    }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 信、望、爱
  const THREE = [['信', [214, 228, 255]], ['爱', [255, 178, 184]], ['望', [255, 224, 150]]];
  const THREE_ORDER = [0, 2, 1];                      // 先信，再望，末了是爱
  const threeOn = i => THREE_ORDER.indexOf(i) < S.three;
  const TA = new Float32Array(3);
  function threePos(i) {
    const cx = X('cx') * W.w;
    if (phone()) return [[cx - 0.2 * W.w, 0.45 * W.h], [cx, 0.39 * W.h], [cx + 0.2 * W.w, 0.45 * W.h]][i];
    return [[cx - 0.11 * W.w, 0.4 * W.h], [cx, 0.32 * W.h], [cx + 0.11 * W.w, 0.4 * W.h]][i];
  }
  function drawThree(ctx) {
    const A = LV.coThreeA, big = LV.coLoveBig;
    if (A < 0.01 && big < 0.01) return;
    const sp = sprites(), u = SU();
    ctx.globalCompositeOperation = 'lighter';
    // 其中最大的是爱：玫瑰金的光铺满全地
    if (big > 0.01) {
      const q = threePos(1);
      glowSp(ctx, sp.rose, q[0], q[1] + W.h * 0.25, M() * 0.62, 0.24 * big);
      glowSp(ctx, sp.gold, q[0], q[1] + W.h * 0.35, M() * 0.42, 0.14 * big);
    }
    for (let i = 0; i < 3; i++) {
      const a = TA[i] * A;
      if (a < 0.01) continue;
      const q = threePos(i), sprC = i === 0 ? sp.pale : i === 1 ? sp.rose : sp.gold;
      const r = (i === 1 ? 1 + 1.2 * big : 1) * 30 * u * at(1, 0.8), br = 0.9 + 0.1 * Math.sin(W.t * 1.6 + i * 2);
      glowSp(ctx, sprC, q[0], q[1], r * 2.6 * br, 0.55 * a);
      glowSp(ctx, sp.white, q[0], q[1], r * 0.55, 0.9 * a);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 自上而来的光从哪里起：桌面自天顶；手机上经文在屏幕上方，光从经文底下柔柔地起（不在字后面亮）
  const skyTop = () => (phone() ? W.h * 0.3 : -10);
  // 自上而来的光（面对面）；三道光（恩惠、慈爱、感动）；降在殿中的光
  function drawFromAbove(ctx) {
    const sp = sprites(), cx = X('cx') * W.w, gyc = vY(X('cx'), 0.3);
    ctx.globalCompositeOperation = 'lighter';
    const ab = LV.coAbove;
    if (ab > 0.01) {
      beam(ctx, sp.col, cx, skyTop(), cx, gyc + 10, at(0.34, 0.5) * W.w, 0.4 * ab);
      beam(ctx, sp.col, cx, skyTop(), cx, gyc, at(0.12, 0.2) * W.w, 0.35 * ab);
    }
    const dw = LV.coDwell;
    if (dw > 0.01) {
      beam(ctx, sp.col, cx, skyTop(), cx, gyc - PH(2) * 0.2, at(0.06, 0.12) * W.w, 0.45 * dw);
      glowSp(ctx, sp.gold, cx, gyc - PH(2) * 1.2, PH(2) * 1.4, 0.22 * dw);
    }
    const tri = LV.coTri;
    if (tri > 0.01) {
      const sps = [sp.colG, sp.colR, sp.colB], y1 = gyc - PH(2) * 0.4;
      for (let i = 0; i < 3; i++) {
        const off = (i - 1) * at(0.2, 0.3) * W.w, sway = Math.sin(W.t * 0.5 + i * 2.1) * 0.012 * W.w;
        beam(ctx, sps[i], cx + off * at(1, 0.7) + sway, skyTop() - 10, cx + (i - 1) * 6 * SU(), y1, at(0.05, 0.09) * W.w, 0.42 * tri);
      }
      glowSp(ctx, sp.white, cx, y1, PH(2) * 2.4, 0.35 * tri);
      glowSp(ctx, sp.rose, cx, y1, PH(2) * 5, 0.18 * tri);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  与人相连的光：殿、恩赐的火、身子、爱的光丝、刺与覆庇、忧愁的灰影、一圈暖光
  // ════════════════════════════════════════════════════════════
  // 光的殿：台基 → 柱子 → 楣与山墙（按众人此刻的位置）
  function drawTemple(ctx) {
    const A = LV.coTempleA, p = LV.coTemple;
    if (A < 0.01 || p < 0.005) return;
    let minX = 1e9, maxX = -1e9, foot = -1e9, head = 1e9, h = PH(2), n = 0;
    for (const id of MEMBERS) {
      const q = pt(id, 0), f = fig(id);
      if (!q || !f) continue;
      minX = Math.min(minX, q[0]); maxX = Math.max(maxX, q[0]);
      foot = Math.max(foot, q[1]); head = Math.min(head, q[1] - q[2]); h = q[2]; n++;
    }
    if (!n) return;
    const pad = h * 0.5, x0 = minX - pad, x1 = maxX + pad, cx = (x0 + x1) / 2, wdt = x1 - x0;
    const sty = foot + h * 0.1, arch = head - h * 0.75, ped = wdt * 0.16;
    const p0 = clamp(p / 0.3, 0, 1), p1 = clamp((p - 0.3) / 0.4, 0, 1), p2 = clamp((p - 0.7) / 0.3, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba([255, 236, 190], 0.7 * A);
    ctx.lineCap = 'round';
    // 台基（根基）：自中间向两边
    ctx.lineWidth = Math.max(1.2, 2.2 * SU());
    ctx.beginPath();
    ctx.moveTo(cx - wdt / 2 * p0, sty); ctx.lineTo(cx + wdt / 2 * p0, sty);
    ctx.moveTo(cx - (wdt / 2 + h * 0.12) * p0, sty + h * 0.08); ctx.lineTo(cx + (wdt / 2 + h * 0.12) * p0, sty + h * 0.08);
    ctx.stroke();
    // 柱子
    if (p1 > 0) {
      const nc = phone() ? 5 : 7;
      ctx.lineWidth = Math.max(1, 1.4 * SU());
      ctx.strokeStyle = rgba([255, 236, 190], 0.45 * A);
      ctx.beginPath();
      for (let i = 0; i < nc; i++) {
        const x = x0 + wdt * i / (nc - 1), yt = lerp(sty, arch, p1);
        ctx.moveTo(x - h * 0.05, sty); ctx.lineTo(x - h * 0.05, yt);
        ctx.moveTo(x + h * 0.05, sty); ctx.lineTo(x + h * 0.05, yt);
      }
      ctx.stroke();
      ctx.fillStyle = rgba([255, 240, 200], 0.07 * A);
      for (let i = 0; i < nc; i++) { const x = x0 + wdt * i / (nc - 1), yt = lerp(sty, arch, p1); ctx.fillRect(x - h * 0.07, yt, h * 0.14, sty - yt); }
    }
    // 楣与山墙
    if (p2 > 0) {
      ctx.lineWidth = Math.max(1.2, 2 * SU());
      ctx.strokeStyle = rgba([255, 236, 190], 0.65 * A * p2);
      ctx.beginPath();
      ctx.moveTo(x0 - h * 0.1, arch); ctx.lineTo(x1 + h * 0.1, arch);
      ctx.moveTo(x0 - h * 0.1, arch - h * 0.12); ctx.lineTo(x1 + h * 0.1, arch - h * 0.12);
      ctx.moveTo(x0 - h * 0.14, arch - h * 0.12); ctx.lineTo(cx, arch - h * 0.12 - ped * p2); ctx.lineTo(x1 + h * 0.14, arch - h * 0.12);
      ctx.stroke();
      glowSp(ctx, sprites().gold, cx, arch - h * 0.12 - ped * 0.4, ped * 1.4, 0.25 * A * p2);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 恩赐的火（12:4）：各人头上一朵颜色不同的火
  const GIFT_COL = [[255, 198, 120], [180, 220, 255], [255, 170, 200], [196, 250, 184], [255, 230, 150], [212, 190, 255],
    [255, 186, 140], [170, 240, 228], [255, 206, 206], [232, 240, 160], [190, 208, 255], [255, 220, 176]];
  const GIFT_IDS = ['paul'].concat(MEMBERS);
  const GA = new Float32Array(GIFT_IDS.length);
  function drawGifts(ctx) {
    let any = false;
    for (let i = 0; i < GA.length; i++) if (GA[i] > 0.01) { any = true; break; }
    if (!any) return;
    const sp = sprites();
    for (let i = 0; i < GIFT_IDS.length; i++) {
      const a = GA[i];
      if (a < 0.01) continue;
      const q = pt(GIFT_IDS[i], 1);
      if (!q) continue;
      const c = GIFT_COL[i % GIFT_COL.length], x = q[0], y = q[1] - q[2] * 0.08, fh = q[2] * 0.2;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, sp.white, x, y - fh * 0.4, fh * 2.2, 0.35 * a);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, y, fh, a, i * 1.7, rgba(c, 0.92), 'rgba(255,252,240,0.95)');
    }
    ctx.globalAlpha = 1;
  }
  // 一个身子（12:12–27）：各人的火光升上天，神把它们安排成一个光的身子
  const BODY_PTS = [[0, 0.05], [0, 0.29], [-0.19, 0.2], [0.19, 0.2], [-0.33, 0.37], [0.33, 0.37], [-0.44, 0.5], [0.44, 0.5],
    [0, 0.56], [-0.1, 0.77], [0.1, 0.77], [-0.13, 0.97], [0.13, 0.97]];
  const BODY_E = [[0, 1], [1, 2], [1, 3], [2, 3], [2, 4], [4, 6], [3, 5], [5, 7], [1, 8], [8, 9], [9, 11], [8, 10], [10, 12]];
  let BODYMAP = null;
  function bodyFrame() {
    const cx = X('cx') * W.w, top = at(0.12, 0.3) * W.h, hh = at(0.4, 0.29) * W.h;
    return { cx, top, hh, ww: hh * 0.72 };
  }
  function bodyMap() {
    if (BODYMAP) return BODYMAP;
    // 人按横向位置排好，身子上的点也按横向排好，一一对应（心口那一点是自上而来的光）
    const ids = GIFT_IDS.filter(alive).map(id => [id, (fig(id).tx != null ? fig(id).tx : fig(id).nx)]).sort((a, b) => a[1] - b[1]);
    const pts = BODY_PTS.map((q, i) => [i, q[0] + q[1] * 0.001]).filter(q => q[0] !== 1).sort((a, b) => a[1] - b[1]);
    const map = {};
    ids.forEach((q, i) => { if (pts[i]) map[q[0]] = pts[i][0]; });
    BODYMAP = map;
    return map;
  }
  function drawBody(ctx) {
    const A = LV.coBodyA, P = LV.coBody;
    if (A < 0.01 || P < 0.005) return;
    const fr = bodyFrame(), sp = sprites(), map = bodyMap(), pos = new Array(BODY_PTS.length).fill(null), done = new Array(BODY_PTS.length).fill(0);
    const bp = i => [fr.cx + BODY_PTS[i][0] * fr.ww, fr.top + BODY_PTS[i][1] * fr.hh];
    const ids = Object.keys(map);
    ids.forEach((id, k) => {
      const i = map[id], q = pt(id, 1.1);
      if (!q) return;
      const e = ease(P * 1.5 - k * 0.04), t = bp(i);
      const mx = (q[0] + t[0]) / 2, my = Math.min(q[1], t[1]) - (q[1] - t[1]) * 0.25;
      const u = e, x = (1 - u) * (1 - u) * q[0] + 2 * u * (1 - u) * mx + u * u * t[0], y = (1 - u) * (1 - u) * q[1] + 2 * u * (1 - u) * my + u * u * t[1];
      pos[i] = [x, y, q]; done[i] = e;
    });
    // 心口：自上而来的光
    { const t = bp(1), e = ease(P * 1.3 - 0.2); pos[1] = [t[0], lerp(phone() ? W.h * 0.26 : -20, t[1], e), null]; done[1] = e; }
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const lit = LV.coBodyLit;
    if (lit > 0.01) {
      ctx.lineWidth = Math.max(1, 1.5 * SU());
      ctx.strokeStyle = rgba([255, 236, 200], 0.55 * lit * A);
      ctx.beginPath();
      for (const e of BODY_E) {
        const a = pos[e[0]], b = pos[e[1]];
        if (!a || !b || done[e[0]] < 0.98 || done[e[1]] < 0.98) continue;
        ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      // 每颗星与地上那人之间一根极细的线（肢体原是他们）
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba([255, 230, 190], 0.14 * lit * A);
      ctx.beginPath();
      for (let i = 0; i < pos.length; i++) { const p = pos[i]; if (p && p[2] && done[i] > 0.98) { ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2][0], p[2][1]); } }
      ctx.stroke();
    }
    for (let i = 0; i < pos.length; i++) {
      const p = pos[i];
      if (!p) continue;
      const br = 0.85 + 0.15 * Math.sin(W.t * 2 + i * 1.3), r = (i === 1 ? 16 : 11) * SU() * at(1, 0.8);
      glowSp(ctx, i === 1 ? sp.gold : sp.pale, p[0], p[1], r * 2.2 * br, 0.5 * A);
      glowSp(ctx, sp.white, p[0], p[1], r * 0.5, 0.95 * A);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 爱的光丝（13:4–8）
  const LINKS = [['crispus', 'child'], ['chloe', 'widow'], ['greek', 'slave'], ['stephanas', 'achaicus'], ['gaius', 'fort']];
  const LA = new Float32Array(LINKS.length);
  function drawLove(ctx) {
    const A = LV.coLoveA;
    if (A < 0.01) return;
    const sp = sprites(), big = LV.coLove;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const mids = [];
    for (let i = 0; i < LINKS.length; i++) {
      const a = LA[i] * A;
      if (a < 0.01) continue;
      const p = pt(LINKS[i][0], 0.6), q = pt(LINKS[i][1], 0.6);
      if (!p || !q) continue;
      // 一根柔软的线，在二人手的高处之间微微拱起（不是高高的环），好叫跪的、坐的、相拥的都看得见
      const hh = Math.max(p[2], q[2]), mx = (p[0] + q[0]) / 2, my = Math.min(p[1], q[1]) - hh * (0.3 + 0.04 * Math.sin(W.t * 1.2 + i));
      ctx.lineWidth = Math.max(1.2, 1.5 * SU());
      ctx.strokeStyle = rgba([255, 168, 184], (0.58 + 0.3 * big) * a);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, q[0], q[1]); ctx.stroke();
      ctx.lineWidth = Math.max(0.6, 0.55 * SU());
      ctx.strokeStyle = rgba([255, 236, 236], (0.5 + 0.3 * big) * a);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, q[0], q[1]); ctx.stroke();
      const hy = (p[1] + q[1]) / 4 + my / 2;
      glowSp(ctx, sp.rose, mx, hy, hh * (0.55 + 0.35 * big), 0.24 * a);
      glowSp(ctx, sp.white, mx, hy, hh * 0.1, 0.4 * a);
      mids.push([mx, hy]);
    }
    // 爱是永不止息：光丝彼此相连；一片玫瑰色的光笼着众人，一点一点往上飘
    if (big > 0.02 && mids.length > 1) {
      mids.sort((a, b) => a[0] - b[0]);
      ctx.lineWidth = Math.max(1, 1.2 * SU());
      ctx.strokeStyle = rgba([255, 196, 204], 0.45 * big * A);
      ctx.beginPath();
      for (let i = 0; i < mids.length; i++) { const m = mids[i]; if (i) ctx.lineTo(m[0], m[1]); else ctx.moveTo(m[0], m[1]); }
      ctx.stroke();
      const cx = X('cx') * W.w, cy = vY(X('cx'), 0.3) - PH(2) * 0.7, R = at(0.16, 0.24) * W.w;
      glowSp(ctx, sp.rose, cx, cy, R * 1.2, 0.2 * big * A, 0.55);
      for (let i = 0; i < 16; i++) {
        const ph = U.fract(W.t * 0.06 + hsh(i + 11)), x = cx + (hsh(i + 3) - 0.5) * R * 2 + Math.sin(W.t * 0.8 + i) * 6 * SU();
        const y = cy + R * 0.2 - ph * W.h * 0.35, a = Math.sin(Math.PI * ph) * big * A;
        glowSp(ctx, sp.rose, x, y, 7 * SU(), 0.55 * a);
        glowSp(ctx, sp.white, x, y, 1.8 * SU(), 0.8 * a);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 主的晚餐：我们虽多，仍是一个饼——围着桌子的一圈暖光
  function drawOne(ctx) {
    const a = LV.coOne;
    if (a < 0.01) return;
    const T0 = tableGeo(), sp = sprites(), h = PH(2);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, sp.gold, T0.x, T0.top, h * 3.2, 0.3 * a, 0.5);
    ctx.strokeStyle = rgba([255, 226, 170], 0.35 * a);
    ctx.lineWidth = Math.max(1, 2 * SU());
    ctx.beginPath(); ctx.ellipse(T0.x, T0.y - h * 0.2, at(0.11, 0.17) * W.w, h * 0.55, 0, 0, TAU); ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 刺（林后 12:7）：保罗身旁一团冷而暗的影；覆庇（12:9）：自上而来的光罩着他
  function drawPaulLight(ctx) {
    const th = LV.coThorn, cv = LV.coCover;
    if (th < 0.01 && cv < 0.01) return;
    const q = pt('paul', 0.4), f = fig('paul');
    if (!q || !f) return;
    const sp = sprites(), h = q[2], dir = f.facing || 1;
    if (th > 0.01) {
      const sx = q[0] - dir * h * 0.42, sy = q[1];
      glowSp(ctx, sp.mist, sx, sy, h * (0.6 + 0.7 * th), 0.7 * th);
      for (let i = 0; i < 4; i++) {
        const a = W.t * 0.35 + i * 1.6, r = h * (0.3 + 0.3 * th);
        glowSp(ctx, sp.dark, sx + Math.cos(a) * r * 0.5, sy + Math.sin(a * 1.2) * r * 0.4, r * 0.9, 0.5 * th);
      }
    }
    if (cv > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const fy = q[1] + h * 0.4 * (LOWP[f.pose] || 1);
      beam(ctx, sp.col, q[0], skyTop(), q[0], fy, h * 1.8, 0.62 * cv);
      ctx.fillStyle = rgba([255, 236, 196], 0.08 * cv);
      ctx.beginPath(); ctx.ellipse(q[0], fy, h * 0.8, h * 1.3, 0, Math.PI, TAU); ctx.fill();
      ctx.strokeStyle = rgba([255, 236, 196], 0.6 * cv);
      ctx.lineWidth = Math.max(1.2, 1.8 * SU());
      ctx.beginPath(); ctx.ellipse(q[0], fy, h * 0.8, h * 1.3, 0, Math.PI, TAU); ctx.stroke();
      glowSp(ctx, sp.gold, q[0], fy - h * 0.55, h * 1.8, 0.42 * cv);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  // 忧愁的人身上的灰影
  function drawGrief(ctx) {
    const g = LV.coGrief;
    if (g < 0.01) return;
    const q = pt('grief', 0.45);
    if (!q) return;
    const sp = sprites();
    glowSp(ctx, sp.cold, q[0], q[1], q[2] * 1.1, 0.5 * g);
    glowSp(ctx, sp.dark, q[0] + q[2] * 0.1, q[1] - q[2] * 0.1, q[2] * 0.7, 0.28 * g);
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的效果：飞行的光点、升起的祷告、扫过天空的号光、空洞的灰环 ──────
  function fpos(v) {
    if (!v) return null;
    if (typeof v === 'function') return v();
    if (typeof v === 'string') return pt(v, 0.55);
    return v;
  }
  function updateFXL(dt) {
    const f = dt * (W.fast || 1);
    for (let i = FXL.length - 1; i >= 0; i--) {
      const e = FXL[i];
      if (e.delay > 0) { e.delay -= f; continue; }
      e.t += f;
      if (e.t >= e.dur) {
        FXL.splice(i, 1);
        if (e.type === 'mote' && e.land && fx()) { const q = fpos(e.to); if (q) fx().sparkle(q[0], q[1], 8, e.rgb, 5, 'top'); }
      }
    }
  }
  function drawFXL(ctx) {
    if (!FXL.length) return;
    const sp = sprites();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      if (e.delay > 0) continue;
      const k = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'mote') {
        const a = fpos(e.from), b = fpos(e.to);
        if (!a || !b) continue;
        const u = ease(k), mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - Math.abs(b[0] - a[0]) * e.arc - 20 * SU();
        const x = (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * mx + u * u * b[0], y = (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * my + u * u * b[1];
        const r = (e.r || 7) * SU();
        glowSp(ctx, sp.white, x, y, r * 0.6, 0.95);
        ctx.globalAlpha = 1;
        glowSp(ctx, e.spr ? sp[e.spr] : sp.gold, x, y, r * 2.2, 0.6);
      } else if (e.type === 'rise') {
        const q = fpos(e.from);
        if (!q) continue;
        const y = q[1] - k * W.h * 0.3, a = Math.sin(Math.PI * Math.min(1, k * 1.3)) * (1 - k);
        glowSp(ctx, sp.pale, q[0], y, 14 * SU(), 0.8 * a);
        glowSp(ctx, sp.white, q[0], y, 4 * SU(), a);
      } else if (e.type === 'sweep') {
        const y = lerp(-0.1, 0.62, ease(k)) * W.h, a = Math.sin(Math.PI * k) * 0.5;
        const gr = ctx.createLinearGradient(0, y - W.h * 0.08, 0, y + W.h * 0.08);
        gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(0.5, 'rgba(255,240,200,' + a.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = gr;
        ctx.fillRect(0, y - W.h * 0.08, W.w, W.h * 0.16);
      } else if (e.type === 'clang') {
        // 鸣的锣，响的钹：自希腊人头上一圈圈冷白的环扩开，一闪冷光，随即归于无有
        const q = fpos(e.from);
        if (!q) continue;
        const fade = 1 - k, u = SU();
        if (k < 0.3) glowSp(ctx, sp.pale, q[0], q[1], q[2] * (0.5 + 0.6 * k), 0.4 * (1 - k / 0.3));
        ctx.lineWidth = Math.max(2, 3 * u * (0.5 + 0.5 * fade));
        for (let j = 0; j < 2; j++) {
          const kk = k - j * 0.16;
          if (kk <= 0) continue;
          ctx.strokeStyle = rgba([200, 212, 230], (j ? 0.32 : 0.55) * (1 - kk));
          ctx.beginPath(); ctx.ellipse(q[0], q[1], q[2] * (0.2 + 1.7 * kk), q[2] * (0.16 + 1.25 * kk), 0, 0, TAU); ctx.stroke();
        }
      } else if (e.type === 'puff') {
        const q = fpos(e.from);
        if (!q) continue;
        ctx.globalCompositeOperation = 'source-over';
        glowSp(ctx, sp.cold, q[0], q[1] - k * q[2] * 0.6, q[2] * (0.15 + 0.3 * k), 0.4 * (1 - k));
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'descend') {
        // 那吩咐光从黑暗里照出来的神：高天上的一点光降下，进到保罗心里
        const b = fpos(e.to), a0 = [at(0.54, 0.51) * W.w, at(0.12, 0.33) * W.h];
        if (!b) continue;
        const u = ease(k), x = lerp(a0[0], b[0], u), y = lerp(a0[1], b[1], u);
        glowSp(ctx, sp.white, x, y, 10 * SU(), 1);
        glowSp(ctx, sp.gold, x, y, 40 * SU(), 0.55);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 那点光在高天上（降下之前）
  function drawShine(ctx) {
    const a = LV.coShine * (1 - LV.coShineD);
    if (a < 0.01) return;
    const sp = sprites(), x = at(0.54, 0.51) * W.w, y = at(0.12, 0.33) * W.h + LV.coShineD * W.h * 0.3;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, sp.white, x, y, 12 * SU(), a);
    glowSp(ctx, sp.gold, x, y, 60 * SU(), 0.5 * a);
    ctx.strokeStyle = rgba([255, 240, 210], 0.25 * a);
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const ang = i * TAU / 8 + W.t * 0.05; ctx.moveTo(x + Math.cos(ang) * 14 * SU(), y + Math.sin(ang) * 14 * SU()); ctx.lineTo(x + Math.cos(ang) * 70 * SU(), y + Math.sin(ang) * 70 * SU()); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的总调度
  // ════════════════════════════════════════════════════════════
  function drawUnder(ctx, pass) {
    if (!isCur()) return;
    sprites();
    if (pass === 'sky') { U.safe('corinth.cross', () => drawCross(ctx)); return; }
    if (pass === 'far') { U.safe('corinth.acro', () => drawAcro(ctx)); return; }
    if (pass === 'mid') { U.safe('corinth.city', () => drawCity(ctx)); U.safe('corinth.tombs', () => drawTombs(ctx)); return; }
    if (pass === 'seaNear') { U.safe('corinth.ship', () => drawShip(ctx)); return; }
    if (pass === 'near') {
      U.safe('corinth.court', () => drawCourt(ctx));
      U.safe('corinth.house', () => drawHouse(ctx));
      U.safe('corinth.pier', () => drawPier(ctx));
      U.safe('corinth.work', () => drawWorkshop(ctx));
      U.safe('corinth.field', () => drawField(ctx));
      U.safe('corinth.table', () => drawTable(ctx));
      U.safe('corinth.chest', () => drawChest(ctx));
      U.safe('corinth.new', () => drawNew(ctx));
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      return;
    }
    if (pass === 'air') {
      U.safe('corinth.above', () => drawFromAbove(ctx));
      U.safe('corinth.temple', () => drawTemple(ctx));
      U.safe('corinth.one', () => drawOne(ctx));
      U.safe('corinth.grief', () => drawGrief(ctx));
      U.safe('corinth.love', () => drawLove(ctx));
      U.safe('corinth.gifts', () => drawGifts(ctx));
      U.safe('corinth.body', () => drawBody(ctx));
      U.safe('corinth.three', () => drawThree(ctx));
      U.safe('corinth.paul', () => drawPaulLight(ctx));
      U.safe('corinth.shine', () => drawShine(ctx));
      U.safe('corinth.fxl', () => drawFXL(ctx));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function pick(x, y, r) {
    if (!isCur()) return null;
    let best = null;
    const test = (label, px, py, d0) => {
      if (!isFinite(px) || !isFinite(py)) return;
      const d = Math.max(0, Math.hypot(px - x, py - y) - (d0 || 0));
      if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d };
    };
    const s = SC(2);
    { const q = jarGeo(0); test('瓦器', q.x, q.y - q.h * 0.5, 14 * s); }
    { const kx = X('kiln') * W.w; test('窑', kx, vY(X('kiln'), 0.02) - 12 * s, 10 * s); }
    { const H = houseGeo(); test('该犹的家', X('door') * W.w, H.top + 30 * s, 12 * s); test('铜镜', X('mirror') * W.w, H.top + 20 * s, 6 * s); }
    if (LV.coTable > 0.5) { const T0 = tableGeo(); test('饼', T0.x - 9 * T0.s, T0.top - 4 * T0.s, 4 * T0.s); test('杯', T0.x + 10 * T0.s, T0.top - 8 * T0.s, 4 * T0.s); }
    { const P = shipPos(); if (P.a > 0.5) test('船', P.x, P.y - 20 * P.k, 20 * P.k); }
    test('码头', X('quay') * W.w - 10 * s, gY(2, X('quay')) - 3 * s, 8 * s);
    { const xf = (X('field0') + X('field1')) / 2; test(LV.coGrow > 0.5 ? '麦子' : '田', xf * W.w, vY(xf, fv(0.35)) - 6 * s, 20 * s); }
    if (LV.coFirst > 0.5) { const q = sheafXY(); test('初熟的果子', q[0], q[1] - 26 * s, 9 * s); }
    { const Tg = tombGeo(); test('坟墓', (Tg.x0 + Tg.x1) / 2, Tg.base - Tg.hh * 0.4, 12 * Tg.s); }
    { const tx = X('temple') * W.w; test('偶像的庙', tx, gY(1, X('temple')) - 20 * SC(1), 20 * SC(1)); }
    test('哥林多', ((X('city0') + X('city1')) / 2) * W.w, gY(1, 0.72) - 16 * SC(1), 30 * SC(1));
    if (S.chest === 'quay') test('捐资', X('chest') * W.w, vY(X('chest'), 0.5) - 8 * s, 6 * s);
    return best;
  }

  const SCENE = {
    init() { sprites(); },
    resize() { G = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      updateFXL(dt);
      // 纵深的缓动
      const c = C();
      if (c && c.people) for (const p of c.people.values()) {
        if (p._coV == null) continue;
        const d = p._coV - (p.v || 0), st = (p._coVR || 0.3) * f;
        if (Math.abs(d) <= st) { p.v = p._coV; p._coV = null; } else p.v = (p.v || 0) + Math.sign(d) * st;
      }
      // 各人头上的火、光丝、三点光、瓦器里的光：按状态缓缓亮起 / 熄灭
      const k = 1 - Math.exp(-f * 2.4);
      for (let i = 0; i < GA.length; i++) GA[i] += ((i < S.gifts && i >= S.gOut ? 1 : 0) - GA[i]) * k;
      for (let i = 0; i < LA.length; i++) LA[i] += ((i < S.links ? 1 : 0) - LA[i]) * k;
      for (let i = 0; i < 3; i++) TA[i] += ((threeOn(i) ? 1 : 0) - TA[i]) * k;
      for (let i = 0; i < JA.length; i++) JA[i] += ((i < S.jars ? 1 : 0) - JA[i]) * k;
    },
    drawUnder,
    draw() {},
    reset() { FXL.length = 0; BODYMAP = null; },
    restore() {
      FXL.length = 0; BODYMAP = null;
      const c = C();
      if (c && c.people) for (const p of c.people.values()) if (p._coV != null) { p.v = p._coV; p._coV = null; }
      snapLights();
    },
    pick,
    sig() {
      return { united: S.united, dwelt: S.dwelt, broken: S.broken, gifts: S.gifts, gOut: S.gOut, links: S.links, three: S.three, jars: S.jars,
        forgiven: S.forgiven, titus: S.titus, chest: S.chest, gave: S.gave, prayers: S.prayers };
    },
    get debug() { return { S: Object.assign({}, S), fxl: FXL.length, lv: MY.reduce((o, k) => { o[k] = +LV[k].toFixed(3); return o; }, {}) }; },
  };
  function snapLights() {
    for (let i = 0; i < GA.length; i++) GA[i] = i < S.gifts && i >= S.gOut ? 1 : 0;
    for (let i = 0; i < LA.length; i++) LA[i] = i < S.links ? 1 : 0;
    for (let i = 0; i < 3; i++) TA[i] = threeOn(i) ? 1 : 0;
    for (let i = 0; i < JA.length; i++) JA[i] = i < S.jars ? 1 : 0;
  }

  // ════════════════════════════════════════════════════════════
  //  幕的开端：哥林多，天将亮（与上一幕怎样结束无关）
  // ════════════════════════════════════════════════════════════
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.32, land: 1, grass: 0.72, herbs: 0.45, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('coDeath', 1, true); W.set('coGrief', 1, true);
    W.set('bloom', 0.3, true); W.set('bare', 0, true);
    W.set('gale', 0.12, true); W.set('rain', 0, true); W.set('storm', 0, true); W.set('gloom', 0, true); W.set('hail', 0, true);
    W.weatherExclude = [];
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.72, W.ridgeBaseY(2, W.w * 0.72)); W.setOrigin('herbs', W.w * 0.72, W.ridgeBaseY(2, W.w * 0.72));
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.244, 0, true);
    W.setPop('fish', 70, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.2, W.h * 0.8, true);
    W.setPop('bird', 10, W.w * 0.3, W.h * 0.3, true);
    W.setPop('cattle', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('beast', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('creeper', 0, W.w * 0.9, W.h * 0.8, true);
    W.setPop('human', 0, W.w * 0.9, W.h * 0.8, true);
    S = fresh();
    FXL.length = 0; G = null; BODYMAP = null;
    snapLights();
    const c = C();
    c.clear({ fade: false });
    for (const id in F.start) person(id, F.start[id], { pose: id === 'grief' ? 'sit' : 'stand', glow: id === 'grief' ? 0.05 : 0.3 });
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  // 四伙的名（1:12）
  function factionNames(b) {
    const h = PH(2), y0 = vY(0.6, 0.1) - h * 2.1, y1 = y0 - h * (phone() ? 0.9 : 0.75);
    const G4 = [['保罗', at(0.583, 0.563), y0], ['亚波罗', at(0.658, 0.649), y1], ['矶法', at(0.726, 0.724), y0], ['基督', at(0.801, 0.812), y1]];
    G4.forEach((g, i) => nameAt(b, g[0], g[1] * W.w, g[2], [226, 206, 176], { delay: i * 0.55, hold: 3.6, px: at(0, 13) }));
  }
  // 一点光在他们中间来往，一个一个点亮（林后 6:16）
  function visitOrder() { return F.temple ? Object.keys(F.temple).filter(id => MEMBERS.indexOf(id) >= 0).sort((a, b) => at(F.temple[a][0], F.temple[a][1]) - at(F.temple[b][0], F.temple[b][1])) : MEMBERS; }
  function releaseAll() {
    for (const id of EVERY()) { const f = fig(id); if (f && f.hold) hold(id, f.hold, false); }
  }
  function standAll(ids) { for (const id of ids || CHURCH()) { const f = fig(id); if (f && f.pose !== 'stand' && f.pose !== 'walk') pose(id, 'stand'); } }

  // ════════════════════════════════════════════════════════════
  //  经文
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '奉神旨意，蒙召作耶稣基督使徒的保罗……<br>写信给在哥林多神的教会，', ref: '哥林多前书 1:1–2', hold: 6 },
    { text: '愿恩惠、平安从神我们的父<br>并主耶稣基督归与你们。', ref: '哥林多前书 1:3', hold: 5 },
  ];
  const V1 = [
    { text: '你们各人说：「我是属保罗的」；「我是属亚波罗的」；<br>「我是属矶法的」；「我是属基督的」。<br>基督是分开的吗？', ref: '哥林多前书 1:12–13', hold: 7 },
    { text: '因为十字架的道理，在那灭亡的人为愚拙；<br>在我们得救的人，却为神的大能。', ref: '哥林多前书 1:18', hold: 6.5 },
    { text: '神却拣选了世上愚拙的，叫有智慧的羞愧；<br>又拣选了世上软弱的，叫那强壮的羞愧。', ref: '哥林多前书 1:27', hold: 7 },
    { text: '因为我曾定了主意，在你们中间不知道别的，<br>只知道耶稣基督并他钉十字架。', ref: '哥林多前书 2:2', hold: 6 },
  ];
  const V2 = [
    { text: '因为那已经立好的根基就是耶稣基督，<br>此外没有人能立别的根基。', ref: '哥林多前书 3:11', hold: 6 },
    { text: '岂不知你们是神的殿，<br>神的灵住在你们里头吗？', ref: '哥林多前书 3:16', hold: 5.5 },
    { text: '因为我们是永生神的殿，就如神曾说：<br>我要在他们中间居住，在他们中间来往；<br>我要作他们的神；他们要作我的子民。', ref: '哥林多后书 6:16', hold: 8 },
    { text: '岂不知你们的身子就是圣灵的殿吗？<br>这圣灵是从神而来，住在你们里头的；', ref: '哥林多前书 6:19', hold: 6.5 },
  ];
  const V3 = [
    { text: '你们聚会的时候，算不得吃主的晚餐；<br>因为吃的时候，各人先吃自己的饭，<br>甚至这个饥饿，那个酒醉。', ref: '哥林多前书 11:20–21', hold: 7 },
    { text: '主耶稣被卖的那一夜，拿起饼来，<br>祝谢了，就擘开，说：<br>「这是我的身体，为你们舍的，<br>你们应当如此行，为的是记念我。」', ref: '哥林多前书 11:23–24', hold: 8 },
    { text: '你们每逢吃这饼，喝这杯，<br>是表明主的死，直等到他来。', ref: '哥林多前书 11:26', hold: 5.5 },
    { text: '我们虽多，仍是一个饼，一个身体，<br>因为我们都是分受这一个饼。', ref: '哥林多前书 10:17', hold: 6 },
  ];
  const V4 = [
    { text: '恩赐原有分别，圣灵却是一位。<br>职事也有分别，主却是一位。<br>功用也有分别，神却是一位，<br>在众人里面运行一切的事。', ref: '哥林多前书 12:4–6', hold: 8 },
    { text: '就如身子是一个，却有许多肢体；<br>而且肢体虽多，仍是一个身子；<br>基督也是这样。', ref: '哥林多前书 12:12', hold: 6.5 },
    { text: '但如今，神随自己的意思<br>把肢体俱各安排在身上了。', ref: '哥林多前书 12:18', hold: 5.5 },
    { text: '你们就是基督的身子，<br>并且各自作肢体。', ref: '哥林多前书 12:27', hold: 5 },
  ];
  const V5 = [
    { text: '我若能说万人的方言，并天使的话语，<br>却没有爱，我就成了鸣的锣，响的钹一般。', ref: '哥林多前书 13:1', hold: 7 },
    { text: '爱是恒久忍耐，又有恩慈；爱是不嫉妒；<br>爱是不自夸，不张狂，不做害羞的事，<br>不求自己的益处，不轻易发怒，<br>不计算人的恶，', ref: '哥林多前书 13:4–5', hold: 9 },
    { text: '不喜欢不义，只喜欢真理；<br>凡事包容，凡事相信，<br>凡事盼望，凡事忍耐。', ref: '哥林多前书 13:6–7', hold: 6.5 },
    { text: '爱是永不止息。', ref: '哥林多前书 13:8', hold: 4.2 },
  ];
  const V6 = [
    { text: '先知讲道之能终必归于无有；<br>说方言之能终必停止；<br>知识也终必归于无有。', ref: '哥林多前书 13:8', hold: 6.5 },
    { text: '我们如今仿佛对着镜子观看，模糊不清，<br>到那时就要面对面了。<br>我如今所知道的有限，<br>到那时就全知道，如同主知道我一样。', ref: '哥林多前书 13:12', hold: 9 },
    { text: '如今常存的有信，有望，有爱这三样，<br>其中最大的是爱。', ref: '哥林多前书 13:13', hold: 6 },
    { text: '你们要追求爱，<br>也要切慕属灵的恩赐，', ref: '哥林多前书 14:1', hold: 4.5 },
  ];
  const V7 = [
    { text: '我当日所领受又传给你们的：第一，<br>就是基督照圣经所说，为我们的罪死了，<br>而且埋葬了；又照圣经所说，第三天复活了，', ref: '哥林多前书 15:3–4', hold: 7.5 },
    { text: '但基督已经从死里复活，<br>成为睡了之人初熟的果子。', ref: '哥林多前书 15:20', hold: 5 },
    { text: '你所种的，若不死就不能生。……<br>但神随自己的意思给他一个形体，<br>并叫各等子粒各有自己的形体。', ref: '哥林多前书 15:36–38', hold: 7.5 },
    { text: '所种的是必朽坏的，复活的是不朽坏的；<br>所种的是羞辱的，复活的是荣耀的；', ref: '哥林多前书 15:42–43', hold: 6 },
  ];
  const V8 = [
    { text: '我如今把一件奥秘的事告诉你们：<br>我们不是都要睡觉，乃是都要改变，<br>就在一霎时，眨眼之间，<br>号筒末次吹响的时候。', ref: '哥林多前书 15:51–52', hold: 7.5 },
    { text: '那时经上所记「死被得胜吞灭」的话就应验了。<br>死啊！你得胜的权势在哪里？<br>死啊！你的毒钩在哪里？', ref: '哥林多前书 15:54–55', hold: 7.5 },
    { text: '感谢神，<br>使我们藉着我们的主耶稣基督得胜。', ref: '哥林多前书 15:57', hold: 5 },
    { text: '你们务要警醒，在真道上站立得稳，<br>要作大丈夫，要刚强。<br>凡你们所做的都要凭爱心而做。', ref: '哥林多前书 16:13–14', hold: 6.5 },
  ];
  const V9 = [
    { text: '那吩咐光从黑暗里照出来的神，<br>已经照在我们心里，<br>叫我们得知神荣耀的光<br>显在耶稣基督的面上。', ref: '哥林多后书 4:6', hold: 8 },
    { text: '我们有这宝贝放在瓦器里，<br>要显明这莫大的能力是出于神，<br>不是出于我们。', ref: '哥林多后书 4:7', hold: 6.5 },
    { text: '我们四面受敌，却不被困住；<br>心里作难，却不至失望；<br>遭逼迫，却不被丢弃；<br>打倒了，却不至死亡。', ref: '哥林多后书 4:8–9', hold: 7.5 },
    { text: '所以，我们不丧胆。<br>外体虽然毁坏，内心却一天新似一天。', ref: '哥林多后书 4:16', hold: 5.5 },
  ];
  const V10 = [
    { text: '愿颂赞归与我们的主耶稣基督的父神，<br>就是发慈悲的父，赐各样安慰的神。', ref: '哥林多后书 1:3', hold: 6.5 },
    { text: '倒不如赦免他，安慰他，<br>免得他忧愁太过，甚至沉沦了。<br>所以我劝你们，<br>要向他显出坚定不移的爱心来。', ref: '哥林多后书 2:7–8', hold: 7.5 },
    { text: '若有人在基督里，他就是新造的人，<br>旧事已过，都变成新的了。', ref: '哥林多后书 5:17', hold: 6 },
    { text: '一切都是出于神；<br>他藉着基督使我们与他和好，<br>又将劝人与他和好的职分赐给我们。', ref: '哥林多后书 5:18', hold: 7 },
  ];
  const V11 = [
    { text: '但那安慰丧气之人的神<br>藉着提多来安慰了我们；', ref: '哥林多后书 7:6', hold: 5 },
    { text: '你们知道我们主耶稣基督的恩典：<br>他本来富足，却为你们成了贫穷，<br>叫你们因他的贫穷，可以成为富足。', ref: '哥林多后书 8:9', hold: 7.5 },
    { text: '各人要随本心所酌定的，<br>不要作难，不要勉强，<br>因为捐得乐意的人是神所喜爱的。', ref: '哥林多后书 9:7', hold: 6.5 },
    { text: '感谢神，因他有说不尽的恩赐！', ref: '哥林多后书 9:15', hold: 6.4 },
  ];
  const V12 = [
    { text: '我若必须自夸，<br>就夸那关乎我软弱的事便了。', ref: '哥林多后书 11:30', hold: 5 },
    { text: '……所以有一根刺加在我肉体上……<br>为这事，我三次求过主，叫这刺离开我。', ref: '哥林多后书 12:7–8', hold: 7 },
    { text: '他对我说：「我的恩典够你用的，<br>因为我的能力是在人的软弱上显得完全。」<br>所以，我更喜欢夸自己的软弱，<br>好叫基督的能力覆庇我。', ref: '哥林多后书 12:9', hold: 9 },
    { text: '……因我什么时候软弱，<br>什么时候就刚强了。', ref: '哥林多后书 12:10', hold: 5 },
  ];
  const V13 = [
    { text: '还有末了的话：愿弟兄们都喜乐。<br>要作完全人；要受安慰；要同心合意；<br>要彼此和睦。<br>如此，仁爱和平的神必常与你们同在。', ref: '哥林多后书 13:11', hold: 8.5 },
    { text: '你们亲嘴问安，彼此务要圣洁。', ref: '哥林多后书 13:12', hold: 4.5 },
    { text: '愿主耶稣基督的恩惠、神的慈爱、<br>圣灵的感动常与你们众人同在！', ref: '哥林多后书 13:14', hold: 7 },
  ];

  // ════════════════════════════════════════════════════════════
  //  话语（每一句的故事约二十五至三十一秒）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:12–2:2 十字架的道理 ─────────────────────────────────
    {
      kind: 'act', utter: '在我们得救的人，却为神的大能', cmd: 'git merge 保罗 亚波罗 矶法 基督 --into 一  # 基督是分开的吗？', ref: '1:18',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { tod(b, 0.29, 28); lv('coCross', 0, b); sfx(b, 'crowd', { soft: true }); }],
          [0.4, b => factionNames(b)],
          [2.4, () => go('paul', F.one.paul, 'stand', { speed: 0.03 })],
          // 十字架的道理：天边立起一个光的十字
          [L[1] + 0.2, b => { lv('coCross', 1, b); sfx(b, 'angel', { soft: true }); }],
          [L[1] + 1.2, b => { S.united = true; arrange(F.one, 'stand', { speed: 0.03 }); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 6, () => glowAll(0.22)],
          // 神却拣选了世上愚拙的、软弱的
          [L[2] + 0.4, b => {
            for (const id of HUMBLE) { glow(id, 0.5); sparkOn(b, id, 16, [255, 236, 196]); }
            pose('greek', 'bow'); pose('gaius', 'bow');
          }],
          [L[2] + 4.2, () => { pose('greek', 'stand'); pose('gaius', 'stand'); }],
          // 只知道耶稣基督并他钉十字架：众人都望着那光
          [L[3] + 0.3, b => { for (const id of MEMBERS) pose(id, 'gaze'); pose('paul', 'raise'); lv('coCross', 0.75, b); }],
          [L[3] + 4.5, () => { standAll(); glowAll(0.26); for (const id of HUMBLE) glow(id, 0.4); }],
        ]);
      },
    },

    // ── 3:11–6:19 你们是神的殿 ────────────────────────────────
    {
      kind: 'promise', utter: '我要在他们中间居住，在他们中间来往', cmd: 'mount 圣灵 --into ./你们  # 岂不知你们是神的殿', ref: '哥林多后书 6:16',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const order = visitOrder();
        const beats = [
          [0, b => { tod(b, 0.36, 24); lv('coCross', 0, b); arrange(F.temple, 'stand'); lv('coTempleA', 1, b); }],
          [1.2, b => { lv('coTemple', 0.3, b); sfx(b, 'build', { soft: true }); }],
          [L[1] + 0.2, b => { lv('coTemple', 0.7, b); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 3, b => lv('coTemple', 1, b)],
          // 我要在他们中间居住：一道光降在殿中
          [L[2] + 0.2, b => { lv('coDwell', 1, b); sfx(b, 'angel', { soft: true }); S.dwelt = 1; }],
          [L[2] + 2.6, b => lv('coIdol', 1, b)],
          [L[3] + 3.5, b => { lv('coDwell', 0.35, b); for (const id of MEMBERS) pose(id, 'gaze'); }],
        ];
        // 在他们中间来往：一点光自一人到一人，一个一个点亮
        order.forEach((id, i) => {
          const t = L[2] + 1.6 + i * 0.55;
          beats.push([t, b => {
            glow(id, 0.42); S.dwelt = 2;
            if (!inst(b)) { const prev = i ? order[i - 1] : null; mote(b, prev ? () => pt(prev, 0.55) : () => [X('cx') * W.w, vY(X('cx'), 0.3) - PH(2)], id, { dur: 0.55, arc: 0.1, r: 6 }); sparkOn(b, id, 10, [255, 240, 210], 0.55); }
          }]);
        });
        beats.push([L[3] + 6, () => standAll()]);
        T(c, beats);
      },
    },

    // ── 11:20–10:17 主的晚餐 ──────────────────────────────────
    {
      kind: 'bless', utter: '这是我的身体，为你们舍的', cmd: 'wait --for 彼此 && break 饼 --share all', ref: '11:24',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const seated = { gaius: 'sit', crispus: 'sit', greek: 'sit' };
        T(c, [
          [0, b => {
            tod(b, 0.752, 14); lv('coTempleA', 0, b); lv('coDwell', 0, b); lv('coTable', 1, b); lv('coIdol', 0.4, b);
            arrange(F.sup1, 'stand', { poses: seated });
            for (const id of ['slave', 'widow', 'potter']) glow(id, 0.12);
          }],
          [4.5, b => { lv('coLamps', 1, b); sfx(b, 'fire', { soft: true }); }],
          // 该犹起来，招那些站在一旁的
          [L[0] + 5.2, () => { pose('gaius', 'stand'); face('gaius', -1); }],
          [L[0] + 6.2, () => { arrange(F.sup2, 'sit'); pose('paul', 'stand'); glowAll(0.3); }],
          // 拿起饼来，祝谢了，就擘开
          [L[1] + 2.4, b => { pose('paul', 'raise'); lv('coBread', 1, b); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 4.6, b => {
            S.broken = true; pose('paul', 'stand');
            const T0 = () => { const q = tableGeo(); return [q.x - 9 * q.s, q.top - 4 * q.s]; };
            MEMBERS.forEach((id, i) => mote(b, T0, id, { dur: 1.2 + i * 0.07, delay: i * 0.12, r: 5, land: true }));
          }],
          [L[1] + 6.6, () => glowAll(0.34)],
          // 喝这杯
          [L[2] + 0.3, b => {
            lv('coCup', 1, b);
            const T1 = () => { const q = tableGeo(); return [q.x + 10 * q.s, q.top - 8 * q.s]; };
            MEMBERS.forEach((id, i) => mote(b, T1, id, { dur: 1.2 + i * 0.07, delay: i * 0.12, r: 5, spr: 'wine', rgb: [255, 160, 120], land: true }));
          }],
          // 我们虽多，仍是一个饼
          [L[3] + 0.3, b => { lv('coOne', 1, b); sfx(b, 'harp', { soft: true }); if (!inst(b) && fx()) { const q = tableGeo(); fx().ring(q.x, q.top, [255, 226, 170], M() * 0.3, 3, 1.4); } }],
        ]);
      },
    },

    // ── 12:4–27 一个身子，许多肢体 ─────────────────────────────
    {
      kind: 'act', utter: '神随自己的意思把肢体俱各安排在身上了', cmd: 'assemble 身子 --members "${许多[@]}" --count 1', ref: '12:18',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const beats = [
          [0, b => { tod(b, 0.84, 14); lv('coOne', 0, b); lv('coBread', 0.25, b); lv('coCup', 0.25, b); arrange(F.ring, 'stand'); glowAll(0.32); BODYMAP = null; }],
          [L[1] + 0.3, b => { BODYMAP = null; lv('coBody', 1, b); lv('coBodyA', 1, b); sfx(b, 'stars', { soft: true }); }],
          [L[1] + 2.5, () => { hold('stephanas', 'gaius'); hold('crispus', 'chloe'); hold('achaicus', 'potter'); hold('fort', 'slave'); hold('widow', 'child'); }],
          [L[2] + 0.3, b => { lv('coBodyLit', 1, b); sfx(b, 'harp', { soft: true }); }],
          [L[3] + 0.3, b => { glowAll(0.4); sfx(b, 'angel', { soft: true }); }],
        ];
        // 恩赐原有分别：各人头上点起一朵颜色不同的火
        GIFT_IDS.forEach((id, i) => {
          beats.push([1.6 + i * 0.45, b => {
            S.gifts = i + 1;
            if (!inst(b)) { mote(b, () => [X('cx') * W.w, W.h * at(0.08, 0.3)], () => pt(id, 1.08), { dur: 0.9, arc: 0.05, r: 5, rgb: GIFT_COL[i], spr: 'pale' }); }
            if (i % 3 === 0) sfx(b, 'chime', { soft: true });
          }]);
        });
        T(c, beats);
      },
    },

    // ── 13:1–8 爱 ──────────────────────────────────────────────
    {
      kind: 'act', utter: '爱是永不止息', cmd: 'while :; do 爱; done  # 永不止息', ref: '13:8',
      verse: V5,
      apply(c) {
        const L = starts(V5), Fl = F.love;
        const link = (i, b) => { S.links = Math.max(S.links, i + 1); if (!inst(b)) { const [a, bb] = LINKS[i]; const p = pt(a, 0.6), q = pt(bb, 0.6); if (p && q && fx()) fx().sparkle((p[0] + q[0]) / 2, Math.min(p[1], q[1]) - p[2] * 0.4, 18, [255, 190, 200], p[2] * 0.3, 'top'); } sfx(b, 'harp', { soft: true }); };
        T(c, [
          [0, b => { tod(b, 0.9, 20); lv('coBodyA', 0, b); lv('coLoveA', 1, b); releaseAll(); }],
          // 鸣的锣，响的钹：希腊人高声说话，一圈圈空洞的灰环
          [0.6, () => go('greek', Fl.greek0, 'raise')],
          [2.6, b => { fxl(b, { type: 'clang', from: () => pt('greek', 0.85), dur: 1.6 }); sfx(b, 'cymbal', { soft: true }); for (const id of ['stephanas', 'chloe', 'crispus']) face(id, id === 'crispus' ? -1 : 1); }],
          [3.7, b => { fxl(b, { type: 'clang', from: () => pt('greek', 0.85), dur: 1.6 }); sfx(b, 'cymbal', { soft: true }); }],
          [4.8, b => fxl(b, { type: 'clang', from: () => pt('greek', 0.85), dur: 1.6 })],
          [6.4, () => { pose('greek', 'stand'); face('greek', -1); }],
          // 爱是恒久忍耐，又有恩慈……
          [L[1] + 0.2, () => { go('child', Fl.child, 'stand'); go('crispus', Fl.crispus, 'kneel'); face('crispus', 1); }],
          [L[1] + 2.4, b => link(0, b)],
          [L[1] + 2.8, () => { go('widow', Fl.widow, 'sit'); go('chloe', Fl.chloe, 'kneel'); }],
          [L[1] + 5.2, b => link(1, b)],
          [L[1] + 5.4, () => { go('greek', Fl.greek, 'sit'); go('slave', Fl.slave, 'sit'); }],
          [L[1] + 8, b => link(2, b)],
          [L[2] + 0.2, () => { go('achaicus', F.ring.stephanas.map((v, i) => (i < 2 ? v + 0.024 : v)), 'stand', { speed: 0.03 }); }],
          [L[2] + 2, () => embrace('stephanas', 'achaicus', at(0.637, 0.61))],
          [L[2] + 3.4, b => link(3, b)],
          [L[2] + 3.6, () => { go('gaius', Fl.gaius, 'stand'); go('fort', Fl.fort, 'stand'); }],
          [L[2] + 6.2, b => { hold('gaius', 'fort'); link(4, b); }],
          [L[2] + 1, () => go('paul', Fl.paul, 'stand')],
          // 爱是永不止息
          [L[3] + 0.2, b => { lv('coLove', 1, b); glowAll(0.38); sfx(b, 'angel', { soft: true }); }],
        ]);
      },
    },

    // ── 13:8–14:1 如今仿佛对着镜子观看……其中最大的是爱 ─────────
    {
      kind: 'act', utter: '其中最大的是爱', cmd: 'max 信 望 爱  # 其中最大的是爱', ref: '13:13',
      verse: V6,
      apply(c) {
        const L = starts(V6);
        const beats = [
          [0, b => { tod(b, 0.247, 28); }],
          // 仿佛对着镜子观看：爱的光丝暗下去，好让墙上的铜镜看得见
          [L[1] + 0.3, b => { lv('coMirror', 0.35, b); lv('coLoveA', 0.35, b); }],
          // 到那时就要面对面了：自上而来的光；镜子明亮了
          [L[1] + 3.2, b => {
            lv('coAbove', 1, b); lv('coMirror', 1, b); flash(b, 0.18); sfx(b, 'angel', { soft: true });
            hold('gaius', 'fort', false);
            for (const id of CHURCH()) pose(id, 'gaze');
            glowAll(0.42);
          }],
          [L[2] + 0.4, b => { S.three = 1; const q = threePos(0); nameAt(b, THREE[0][0], q[0], q[1] + 40 * SU(), THREE[0][1], { px: 0.05 * M(), hold: 3.2, src: () => [q[0] + U.rand(-8, 8), q[1] + U.rand(-8, 8)] }); }],
          [L[2] + 1.6, b => { S.three = 2; const q = threePos(2); nameAt(b, THREE[2][0], q[0], q[1] + 40 * SU(), THREE[2][1], { px: 0.05 * M(), hold: 3.2, src: () => [q[0] + U.rand(-8, 8), q[1] + U.rand(-8, 8)] }); }],
          [L[2] + 2.8, b => { S.three = 3; lv('coThreeA', 1, b); const q = threePos(1); nameAt(b, THREE[1][0], q[0], q[1] + 44 * SU(), THREE[1][1], { px: 0.058 * M(), hold: 3.6, src: () => [q[0] + U.rand(-8, 8), q[1] + U.rand(-8, 8)] }); sfx(b, 'harp', { soft: true }); }],
          // 其中最大的是爱：玫瑰金的光铺满全地，众人之间的光丝又亮起来
          [L[2] + 4.6, b => { lv('coLoveBig', 1, b); lv('coLoveA', 0.7, b); lv('coLamps', 0, b); }],
          [L[3] + 0.3, b => { standAll(); lv('coAbove', 0.35, b); }],
        ];
        // 说方言之能终必停止：头上的火一朵一朵熄了
        GIFT_IDS.forEach((id, i) => beats.push([0.6 + i * 0.42, b => { S.gOut = i + 1; if (!inst(b)) fxl(b, { type: 'puff', from: () => pt(id, 1.1), dur: 1.4 }); }]));
        beats.push([0.1, b => lv('coThreeA', 1, b)]);
        T(c, beats);
      },
    },

    // ── 15:3–43 种的与复活的 ───────────────────────────────────
    {
      kind: 'act', utter: '神随自己的意思给他一个形体', cmd: 'sow 子粒 --die && await 复活  # 初熟的果子', ref: '15:38',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        const toFurrow = i => () => { const r = fieldRows(), v = r[i % r.length], xf = lerp(X('field0') + 0.012 * v, X('field1'), hsh(i + 5)); return [xf * W.w, vY(xf, v)]; };
        const beats = [
          [0, b => {
            tod(b, 0.3, 20); lv('coLoveBig', 0, b); lv('coThreeA', 0, b); lv('coAbove', 0, b); lv('coLoveA', 0, b); lv('coMirror', 0, b);
            arrange(F.field, 'stand', { speed: 0.04 }); face('grief', 1);
          }],
          [5.6, b => { pose('paul', 'point'); sfx(b, 'wind', { soft: true }); for (let i = 0; i < 12; i++) mote(b, () => pt('paul', 0.6), toFurrow(i), { dur: 0.9, delay: i * 0.08, r: 3.5, arc: 0.3, rgb: [255, 236, 190] }); }],
          [6.4, b => lv('coSown', 1, b)],
          [7.2, () => pose('paul', 'stand')],
          // 第三天复活了：一棵发光的苗破土而出
          [L[0] + 7, b => { lv('coSprout', 1, b); lv('coFirstG', 1, b); sfx(b, 'chime', { soft: true }); if (!inst(b) && fx()) { const q = sheafXY(); fx().sparkle(q[0], q[1] - 6, 24, [220, 255, 190], 10, 'top'); } }],
          // 初熟的果子
          [L[1] + 0.4, b => { lv('coFirst', 1, b); sfx(b, 'harp', { soft: true }); if (!inst(b) && fx()) { const q = sheafXY(); fx().ring(q[0], q[1] - PH(2) * 0.55, [255, 220, 140], M() * 0.16, 2.6, 1.3); } }],
          // 各等子粒各有自己的形体：满田长起来
          [L[2] + 0.4, b => { lv('coGrow', 1, b); lv('bloom', 0.55, b); sfx(b, 'wind', { soft: true }); }],
          [L[2] + 3, () => { for (const id of MEMBERS) if (F.field[id] && F.field[id][0] < 0.8) pose(id, 'gaze'); }],
          // 所种的是必朽坏的，复活的是不朽坏的
          [L[3] + 0.3, b => { lv('coRipe', 1, b); glowAll(0.24); }],
          [L[3] + 3, () => standAll()],
        ];
        T(c, beats);
      },
    },

    // ── 15:51–16:14 号筒末次吹响 ───────────────────────────────
    {
      kind: 'ask', utter: '死啊！你得胜的权势在哪里？', cmd: 'kill -9 死  # 死被得胜吞灭', ref: '15:55',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => { tod(b, 0.4, 20); lv('coLoveA', 0, b); arrange(F.tombs, 'stand'); }],
          // 号筒末次吹响：一道光扫过天空；一霎时，眨眼之间
          [L[0] + 5.2, b => { sfx(b, 'trumpet'); fxl(b, { type: 'sweep', dur: 1.8 }); flash(b, 0.3); }],
          [L[0] + 6.2, b => {
            lv('coTomb', 1, b); lv('coTombL', 1, b); sfx(b, 'quake', { soft: true });
            if (!inst(b)) { W.shake = Math.max(W.shake || 0, 0.25); for (const id of CHURCH()) sparkOn(b, id, 10, [255, 250, 236], 0.6); }
            glowAll(0.55);
          }],
          [L[0] + 7.4, () => glowAll(0.32)],
          // 死被得胜吞灭
          [L[1] + 0.8, b => {
            lv('coDeath', 0, b);
            if (!inst(b) && fx()) { const Tg = tombGeo(); fx().ring((Tg.x0 + Tg.x1) / 2, Tg.base - Tg.hh * 0.5, [255, 240, 210], M() * 0.35, 3.2, 1.6); }
            sfx(b, 'angel', { soft: true });
          }],
          // 感谢神，使我们得胜
          [L[2] + 0.3, b => { for (const id of CHURCH()) pose(id, 'raise'); sfx(b, 'sing', { soft: true }); glowAll(0.4); }],
          [L[3] + 0.5, b => { standAll(); lv('coTombL', 0.45, b); lv('coLoveA', 0.6, b); lv('coFirstG', 0.25, b); }],
        ]);
      },
    },

    // ── 林后 4 瓦器里的宝贝 ─────────────────────────────────────
    {
      kind: 'act', utter: '那吩咐光从黑暗里照出来的神', cmd: 'echo 光 > 瓦器/*  # 宝贝放在瓦器里', ref: '哥林多后书 4:6',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        const sitters = {};
        for (const id of MEMBERS) if (id !== 'potter') sitters[id] = 'sit';
        const beats = [
          [0, b => { tod(b, 0.86, 16); lv('coLoveA', 0, b); lv('coTombL', 0, b); lv('coFirstG', 0, b); lv('coJarsA', 1, b); arrange(F.work, 'stand', { poses: Object.assign({ potter: 'kneel' }, sitters) }); }],
          [1, b => lv('coKiln', 1, b)],
          [4, b => { lv('coLamps', 0.7, b); lv('coShine', 1, b); sfx(b, 'stars', { soft: true }); glowAll(0.3); }],
          // 已经照在我们心里：那点光降下，进到保罗心里
          [6.2, b => { lv('coShineD', 1, b); fxl(b, { type: 'descend', to: () => pt('paul', 0.62), dur: 3.4 }); }],
          [9.4, b => { glow('paul', 0.55); ringOn(b, 'paul', [255, 240, 210], 0.14, 2.2, 0.62); sfx(b, 'harp', { soft: true }); }],
          // 宝贝放在瓦器里：瓦器一个一个亮起
          [L[1] + 1.2, () => { pose('potter', 'stand'); pose('paul', 'point'); }],
          [L[1] + 5.8, () => pose('paul', 'stand')],
          // 四面受敌……打倒了，却不至死亡
          [L[2] + 0.3, b => { lv('gale', 0.62, b); sfx(b, 'wind'); }],
          [L[2] + 2.8, b => { lv('coCrack', 1, b); sfx(b, 'chime', { soft: true }); }],
          [L[3] + 0.3, b => { lv('gale', 0.12, b); glowAll(0.34); }],
        ];
        JARS.forEach((j, i) => beats.push([L[1] + 0.6 + i * 0.6, b => {
          S.jars = i + 1;
          if (!inst(b) && fx()) { const q = jarGeo(i); fx().sparkle(q.x, q.y - q.h * 0.6, 10, [255, 240, 200], q.w * 0.5, 'top'); }
          if (i % 2 === 0) sfx(b, 'chime', { soft: true });
        }]));
        T(c, beats);
      },
    },

    // ── 林后 1–5 安慰；赦免他；新造的人 ───────────────────────────
    {
      kind: 'act', utter: '旧事已过，都变成新的了', cmd: 'git commit -am "新造的人"  # 旧事已过', ref: '哥林多后书 5:17',
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { tod(b, 0.262, 18); lv('coShine', 0, b); lv('coKiln', 0.25, b); lv('coLamps', 0.4, b); lv('coCrack', 0.4, b); standAll(); }],
          [0.8, () => { arrange(F.grief, 'stand', { speed: 0.035 }); for (const id of MEMBERS) if (!F.grief[id]) face(id, 1); }],
          // 赦免他，安慰他：司提反抱住他
          [L[1] + 0.3, () => { pose('grief', 'stand'); face('grief', -1); }],
          [L[1] + 1.6, b => { embrace('stephanas', 'grief', at(0.827, 0.832)); sfx(b, 'weep', { soft: true }); }],
          [L[1] + 3.6, b => { lv('coGrief', 0, b); glow('grief', 0.26); }],
          // 旧事已过，都变成新的了：一圈新的光漫过全地
          [L[2] + 0.3, b => {
            lv('coNew', 1, b); lv('bloom', 1, b); lv('grass', 0.95, b); lv('coLamps', 0, b); lv('coKiln', 0, b);
            S.forgiven = true;
            C().add('grief', { robe: NEW_ROBE, label: '新造的人' });
            glow('grief', 0.45);
            ringOn(b, 'grief', [220, 255, 190], 0.2, 2.6, 0.5); sparkOn(b, 'grief', 24, [230, 255, 200], 0.6);
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 3.6, () => { pose('stephanas', 'stand'); pose('grief', 'stand'); }],
          [L[3] + 0.4, b => { glowAll(0.24); face('grief', -1); lv('coCrack', 0, b); lv('coJarsA', 0.4, b); }],
        ]);
      },
    },

    // ── 林后 7–9 提多来了；乐意的捐 ─────────────────────────────
    {
      kind: 'act', utter: '捐得乐意的人是神所喜爱的', cmd: 'give --cheerful | ship 耶路撒冷', ref: '哥林多后书 9:7',
      verse: V11,
      apply(c) {
        const L = starts(V11), Q = F.quay;
        const givers = ['child', 'slave', 'chloe', 'gaius', 'crispus', 'greek', 'stephanas', 'potter', 'grief'];
        const beats = [
          [0, b => {
            tod(b, 0.45, 18); lv('coJarsA', 0.12, b);
            S.titus = true;
            person('titus', Q.titus0, { pose: 'stand', glow: 0.24 });
            const lineup = {};
            for (const id of MEMBERS.concat(['grief'])) if (Q[id]) lineup[id] = Q[id];
            arrange(lineup, 'stand', { speed: 0.04 });
          }],
          [0.6, () => go('titus', Q.titus, 'stand', { speed: 0.03 })],
          [0.8, () => go('paul', Q.paul, 'stand', { speed: 0.045 })],
          // 神藉着提多来安慰了我们
          [L[0] + 3.8, b => { embrace('paul', 'titus', at(0.476, 0.459)); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 0.5, b => { S.chest = 'quay'; lv('coChest', 0.12, b); pose('paul', 'stand'); pose('titus', 'stand'); face('paul', 1); face('titus', 1); }],
          // 捐得乐意的：寡妇第一个
          [L[2] + 0.2, () => go('widow', Q.widowGive, 'stand', { speed: 0.03 })],
          [L[2] + 2.2, b => { S.gave = 1; pose('widow', 'raise'); lv('coChest', 0.3, b); mote(b, () => pt('widow', 0.6), () => { const x = X('chest'); return [x * W.w, vY(x, 0.5) - 8 * SC(2)]; }, { dur: 0.8, r: 6, land: true }); sfx(b, 'coins', { soft: true }); }],
          [L[2] + 4, () => { go('widow', Q.widow, 'stand', { speed: 0.03 }); }],
          // 感谢神，因他有说不尽的恩赐！箱子抬上船，帆张开，船往东去（在这一句里就没入天边）
          [L[3] - 0.8, () => { go('fort', Q.carry1, 'stand', { speed: 0.045 }); go('achaicus', Q.carry2, 'stand', { speed: 0.045 }); }],
          [L[3] + 0.4, b => { S.chest = 'carried'; lv('coChest', 1, b); }],
          [L[3] + 1.0, b => { S.chest = 'ship'; lv('coSail', 1, b); sfx(b, 'wind', { soft: true }); }],
          [L[3] + 1.6, b => { lv('coShip', 1, b); sfx(b, 'wave', { soft: true }); go('fort', Q.fort, 'stand', { speed: 0.04 }); go('achaicus', Q.achaicus, 'stand', { speed: 0.04 }); }],
          [L[3] + 3.6, () => { pose('paul', 'raise'); pose('titus', 'raise'); for (const id of ['widow', 'child', 'slave']) pose(id, 'raise'); }],
          [L[3] + 7.2, () => standAll()],
        ];
        givers.forEach((id, i) => beats.push([L[2] + 3 + i * 0.45, b => {
          S.gave = i + 2; lv('coChest', Math.min(1, 0.3 + (i + 1) * 0.08), b);
          mote(b, () => pt(id, 0.6), () => { const x = X('chest'); return [x * W.w, vY(x, 0.5) - 8 * SC(2)]; }, { dur: 0.9 + i * 0.05, r: 5, land: true });
          if (i % 3 === 0) sfx(b, 'coins', { soft: true });
        }]));
        T(c, beats);
      },
    },

    // ── 林后 11–12 我的恩典够你用的 ─────────────────────────────
    {
      kind: 'promise', utter: '我的恩典够你用的', cmd: 'assert(恩典 >= 软弱)  # 我的能力是在人的软弱上显得完全', ref: '哥林多后书 12:9',
      verse: V12,
      apply(c) {
        const L = starts(V12), N = F.night;
        const sitters = {};
        for (const id in N) sitters[id] = 'sit';
        const prayer = k => b => {
          S.prayers = k; pose('paul', k % 2 ? 'pray' : 'kneel');
          fxl(b, { type: 'rise', from: () => pt('paul', 0.7), dur: 2.6 });
          if (k === 1) sfx(b, 'whisper', { soft: true });
        };
        T(c, [
          [0, b => {
            tod(b, 0.88, 14);
            const rest = {};
            for (const id in N) if (id !== 'paul' && id !== 'paulUp') rest[id] = N[id];
            arrange(rest, 'sit', { speed: 0.04 });
            go('paul', N.paul, 'kneel', { speed: 0.035 });
          }],
          [5, b => { lv('coLamps', 1, b); lv('coJarsA', 0.2, b); glowAll(0.3); }],
          // 一根刺：冷而暗的影
          [L[1] + 0.3, b => { lv('coThorn', 1, b); glow('paul', 0.3); sfx(b, 'wind', { soft: true, low: true }); }],
          [L[1] + 1.4, prayer(1)],
          [L[1] + 3.6, prayer(2)],
          [L[1] + 5.8, prayer(3)],
          // 我的恩典够你用的：自上而来的光覆庇他
          [L[2] + 0.4, b => { lv('coCover', 1, b); lv('coThorn', 0.2, b); glow('paul', 0.55); pose('paul', 'kneel'); ringOn(b, 'paul', [255, 240, 210], 0.18, 2.6, 0.5); sfx(b, 'angel', { soft: true }); }],
          // 因我什么时候软弱，什么时候就刚强了
          [L[3] + 0.4, () => { go('paul', N.paulUp, 'stand', { speed: 0.02 }); }],
          [L[3] + 2.2, () => pose('paul', 'raise')],
        ]);
      },
    },

    // ── 林后 13 末了的话 ────────────────────────────────────────
    {
      kind: 'bless', utter: '仁爱和平的神必常与你们同在', cmd: 'echo 恩惠 慈爱 感动 | tee 众人  # 阿们', ref: '哥林多后书 13:11',
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const PAIRS = [['stephanas', 'gaius'], ['chloe', 'achaicus'], ['fort', 'slave'], ['widow', 'child']];
        T(c, [
          [0, b => { tod(b, 0.272, 20); lv('coCover', 0.2, b); lv('coThorn', 0, b); lv('coJarsA', 0.35, b); standAll(); }],
          [0.6, () => arrange(F.final, 'stand', { speed: 0.04 })],
          [L[2] + 3, b => lv('coLamps', 0, b)],
          // 你们亲嘴问安
          [L[1] + 0.2, b => { PAIRS.forEach(p => { const A = F.final[p[0]], B = F.final[p[1]]; embrace(p[0], p[1], (at(A[0], A[1]) + at(B[0], B[1])) / 2); }); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 4.4, () => { for (const p of PAIRS) { pose(p[0], 'stand'); pose(p[1], 'stand'); } }],
          // 恩惠、慈爱、感动：三道光
          [L[2] + 0.3, b => { lv('coTri', 1, b); lv('coCover', 0, b); glowAll(0.42); for (const id of CHURCH()) pose(id, 'raise'); sfx(b, 'angel', { soft: true }); }],
          [L[2] + 5, () => { standAll(); pose('paul', 'raise'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '哥林多书', books: [46, 47], title: '爱', sub: '哥林多前书 1 — 哥林多后书 13', tint: [255, 214, 210], music: 'song',
    intro: INTRO,
    outro: 24,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '保罗': { text: '然而，我今日成了何等人，是蒙神的恩才成的，<br>并且他所赐我的恩不是徒然的。', ref: '哥林多前书 15:10' },
      '提多': { text: '论到提多，他是我的同伴，<br>一同为你们劳碌的。', ref: '哥林多后书 8:23' },
      '基利司布': { text: '我感谢神，除了基利司布并该犹以外，<br>我没有给你们一个人施洗，', ref: '哥林多前书 1:14' },
      '该犹': { text: '我感谢神，除了基利司布并该犹以外，<br>我没有给你们一个人施洗，', ref: '哥林多前书 1:14' },
      '司提反': { text: '弟兄们，你们晓得司提反一家，是亚该亚初结的果子，<br>并且他们专以服事圣徒为念。', ref: '哥林多前书 16:15' },
      '福徒拿都': { text: '司提反和福徒拿都，并亚该古到这里来，我很喜欢；<br>因为你们待我有不及之处，他们补上了。', ref: '哥林多前书 16:17' },
      '亚该古': { text: '司提反和福徒拿都，并亚该古到这里来，我很喜欢；<br>因为你们待我有不及之处，他们补上了。', ref: '哥林多前书 16:17' },
      '革来氏': { text: '因为革来氏家里的人曾对我提起弟兄们来，<br>说你们中间有纷争。', ref: '哥林多前书 1:11' },
      '希腊人': { text: '犹太人是要神迹，希腊人是求智慧，<br>我们却是传钉在十字架的基督，', ref: '哥林多前书 1:22–23' },
      '奴仆': { text: '因为作奴仆蒙召于主的，就是主所释放的人；<br>作自由之人蒙召的，就是基督的奴仆。', ref: '哥林多前书 7:22' },
      '寡妇': { text: '神也拣选了世上卑贱的，被人厌恶的，<br>以及那无有的，为要废掉那有的，', ref: '哥林多前书 1:28' },
      '孩子': { text: '我作孩子的时候，话语像孩子，<br>心思像孩子，意念像孩子，<br>既成了人，就把孩子的事丢弃了。', ref: '哥林多前书 13:11' },
      '窑匠': { text: '我们有这宝贝放在瓦器里，<br>要显明这莫大的能力是出于神，<br>不是出于我们。', ref: '哥林多后书 4:7' },
      '忧愁的人': { text: '因为依着神的意思忧愁，<br>就生出没有后悔的懊悔来，以致得救；', ref: '哥林多后书 7:10' },
      '新造的人': { text: '若有人在基督里，他就是新造的人，<br>旧事已过，都变成新的了。', ref: '哥林多后书 5:17' },
      '瓦器': { text: '我们有这宝贝放在瓦器里，<br>要显明这莫大的能力是出于神，<br>不是出于我们。', ref: '哥林多后书 4:7' },
      '窑': { text: '那吩咐光从黑暗里照出来的神，<br>已经照在我们心里，', ref: '哥林多后书 4:6' },
      '该犹的家': { text: '你们聚会的时候，各人或有诗歌，或有教训，<br>或有启示，或有方言，或有翻出来的话，<br>凡事都当造就人。', ref: '哥林多前书 14:26' },
      '铜镜': { text: '我们如今仿佛对着镜子观看，模糊不清，<br>到那时就要面对面了。', ref: '哥林多前书 13:12' },
      '饼': { text: '我们所擘开的饼，<br>岂不是同领基督的身体吗？', ref: '哥林多前书 10:16' },
      '杯': { text: '饭后，也照样拿起杯来，说：<br>「这杯是用我的血所立的新约，<br>你们每逢喝的时候，要如此行，为的是记念我。」', ref: '哥林多前书 11:25' },
      '船': { text: '及至我来到了，你们写信举荐谁，<br>我就打发他们，把你们的捐资送到耶路撒冷去。', ref: '哥林多前书 16:3' },
      '码头': { text: '我要从马其顿经过；<br>既经过了，就要到你们那里去，', ref: '哥林多前书 16:5' },
      '捐资': { text: '每逢七日的第一日，<br>各人要照自己的进项抽出来留着，<br>免得我来的时候现凑。', ref: '哥林多前书 16:2' },
      '田': { text: '因为我们是与神同工的；<br>你们是神所耕种的田地，所建造的房屋。', ref: '哥林多前书 3:9' },
      '麦子': { text: '并且你所种的不是那将来的形体，<br>不过是子粒，即如麦子，或是别样的谷。', ref: '哥林多前书 15:37' },
      '初熟的果子': { text: '但基督已经从死里复活，<br>成为睡了之人初熟的果子。', ref: '哥林多前书 15:20' },
      '坟墓': { text: '这必朽坏的总要变成不朽坏的，<br>这必死的总要变成不死的。', ref: '哥林多前书 15:53' },
      '偶像的庙': { text: '论到吃祭偶像之物，我们知道偶像在世上算不得什么，<br>也知道神只有一位，再没有别的神。', ref: '哥林多前书 8:4' },
      '哥林多': { text: '写信给在哥林多神的教会，<br>就是在基督耶稣里成圣、蒙召作圣徒的，', ref: '哥林多前书 1:2' },
    },
  });
})(window.GS);
