/* ─────────────────────────────────────────────────────────────
 * book/chronicles.js —— 卷「历代」：历代志上 1 — 历代志下 36
 *
 * 历代志把整部历史讲成一座殿的故事：
 * 从亚当起，众名如一道光的河流过天空，一代一代流到锡安（代上 1—9）；雅比斯求告，神就应允他（4:10）；
 * 扫罗死在基利波，国归于耶西的儿子大卫（10）；大卫在希伯仑受膏，攻取锡安，天天有人来帮助他（11—12）；
 * 约柜先是坐新车，后由利未人用杠肩抬，欢呼吹角、敲钹、鼓瑟、弹琴，安放在大卫所搭的帐幕里（13—16）；
 * 「他必为我建造殿宇」——大卫的灯在锡安点起（17）；天使手拿拔出来的刀站在天地间，「够了，住手吧！」
 * 阿珥楠的禾场上筑坛，火从天降（21）；材料、利未人的班次、二百八十八个歌唱的（22—27）；
 * 殿的样式由耶和华用手划出——一幅金线的图画在空中写成（28）；大卫老迈而死（29）。
 * 所罗门求智慧（代下 1），殿在摩利亚山上建成：两根铜柱雅斤、波阿斯，铜坛，铜海（2—4）；
 * ★ 奉献：吹号的、歌唱的声合为一，「耶和华本为善，他的慈爱永远长存」，云充满了殿；
 *   所罗门跪在铜台上向天举手；火从天上降下，烧尽燔祭，荣光充满了殿，以色列众人在铺石地俯伏（5—7）★；
 * 夜间的应许：「这称为我名下的子民……医治他们的地」（7:14）；示巴女王；国分裂，北边的灯火熄了（8—12）；
 * 夜里耶和华的眼目遍察全地，诚实的心一处一处亮起；敌营在海边的山上；次日清早歌唱的走在军前，
 * 歌声所到之处，敌营的火一处一处熄灭（13—20）；亚她利雅的黑暗里，大卫的灯藏在殿中——灯永不熄灭（21—27）；
 * 殿门被封，城中拐角都有坛；门又被打开，光涌出来，逾越节的喜乐，祷告达到天上（28—33）；火焚烧神的殿，
 * 百姓被掳，地享受安息七十年，草木覆盖废墟（34—36:21）；塞鲁士的诏书——光转向归家的路（36:22—23）。
 *
 * 布景（自画）：众名之河、大卫城与王宫（中丘层）、阿珥楠的禾场、约柜、大卫的帐幕、殿（近地，东向，门朝左）、
 * 雅斤与波阿斯、铜坛、铜海、铜台、建殿的材料、金线的样式、云与荣光、自天降下的火、耶和华的使者与刀、
 * 扫罗将熄的灯、大卫的灯、号角与钹琴、声合为一的光、诚实的心、敌营、银柜、拐角的坛、堆垒、焚烧与废墟、归回的路。
 * 院子在近地的平地上（x 0.46 — 0.74）；以色列众人在前景排成几行（纵深），不顺着临海的坡叠上去。
 * 十四句话：神自己的话（代上 11:2、21:15、22:9、28:6，代下 1:7、7:14、20:15），
 * 其余是经文里描述神作为或性情的短句（kind 'act'：代上 4:10、15:26，代下 5:13、21:7、30:20、36:15、36:22）。
 * 六十五章每章都有一句经文讲到（代上 1—3 在卷首的 intro 里）。
 * 一天之中的时辰每句最多挪动一次（经文说「当夜」「夜间」「次日清早」之处才入夜 / 天亮），不来回闪烁。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'chronicles';
  const cur = () => GS.book.current(ACT);
  const safe = U.safe;
  const M = () => Math.min(W.w, W.h);
  const tall = () => W.w / Math.max(1, W.h) <= 0.75;
  const sm = (a, b, x) => U.smoothstep(a, b, x);

  // ── 本卷的程度（恢复时由 W.snapAll 对齐）────────────────────
  const LV = {
    chRiver: ['exp', 0.45],    // 众名之河
    chBorder: ['lin', 0.14],   // 雅比斯扩张的境界（金线向两旁展开）
    chBorderA: ['exp', 0.5],   // 境界线的亮度
    chCity: ['lin', 0.08],     // 耶布斯 → 大卫城 → 耶路撒冷
    chPalace: ['exp', 0.5],    // 大卫香柏木的宫
    chTower: ['exp', 0.4],     // 乌西雅在城上筑的城楼
    chFloor: ['exp', 0.6],     // 阿珥楠的禾场
    chObed: ['exp', 0.6],      // 约柜暂住的那家
    chTent: ['exp', 0.6],      // 大卫所搭的帐幕
    chDAltar: ['exp', 0.5],    // 大卫在禾场上筑的坛
    chDFire: ['exp', 0.8],
    chSite: ['exp', 0.4],      // 「这就是耶和华神的殿」：地上显出殿基的金线
    chMat: ['lin', 0.14],      // 建殿的材料
    chPlan: ['lin', 0.1],      // 样式：金线一笔一笔写出
    chPlanA: ['exp', 0.5],     // 样式的亮度
    chPlanSky: ['exp', 0.7],   // 样式在哪里：1 = 在殿山之上的空中（小，像一卷发光的图），0 = 落在殿基上（原大）
    chBuild: ['lin', 0.075],   // 殿的建造
    chAltar: ['exp', 0.5],     // 铜坛
    chSea: ['exp', 0.5],       // 铜海
    chPlat: ['exp', 0.6],      // 所罗门的铜台
    chFire: ['exp', 0.7],      // 坛上的火
    chDoor: ['exp', 0.5],      // 殿门（1 开 · 0 封锁）
    chGlory: ['exp', 0.45],    // 荣光充满了殿
    chCloud: ['exp', 0.3],     // 云充满了殿
    chPlay: ['exp', 1.2],      // 吹号、敲钹、鼓瑟、弹琴
    chSong: ['exp', 0.9],      // 歌声（声合为一的光环）
    chLamp: ['exp', 0.6],      // 大卫的灯
    chAngel: ['exp', 0.6],     // 耶和华的使者
    chSword: ['exp', 0.9],     // 拔出来的刀（1）→ 收刀入鞘（0）
    chGibeon: ['exp', 0.5],    // 基遍的会幕与铜坛
    chEyes: ['exp', 0.5],      // 耶和华的眼目遍察全地
    chCamp: ['exp', 0.5],      // 敌营的火
    chCampOut: ['lin', 0.16],  // 敌营的火一处一处熄灭
    chChest: ['exp', 0.6],     // 银柜
    chCorner: ['exp', 0.5],    // 城中各处拐角的坛（亚哈斯）
    chHeaps: ['exp', 0.4],     // 堆垒
    chBurn: ['exp', 0.5],      // 焚烧
    chRuin: ['lin', 0.12],     // 殿与城成为废墟
    chWild: ['lin', 0.09],     // 地享受安息：草木覆盖废墟
    chEast: ['exp', 0.35],     // 东方的光（塞鲁士的心被激动）
    chRoad: ['lin', 0.1],      // 归回的路
    chSaul: ['exp', 0.7],      // 扫罗头上将熄的灯
    chHearts: ['lin', 0.12],   // 诚实的心：眼目所到之处一处一处亮起，亮着不灭
    chTribes: ['exp', 0.5],    // 十二支派的灯（远山上）
    chSplit: ['exp', 0.35],    // 国分裂：十个支派的灯熄了
    chExile: ['exp', 0.4],     // 被掳的人走进东方的光里
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 布局（画面宽度的比例；竖屏另有一套）────────────────────
  // 近地的平地约在 x 0.46 — 0.74（更左是临海的陡坡）。院子从左（东）到右（西）：
  // 以色列众人（前景，横的几行）· 歌唱的与吹号的（坛的东边，两排）· 铜台（坛前）· 坛 · 殿（门朝东）。
  // …K：脚下在近地纵深里的位置（0 = 地的轮廓线；1 ≈ 画面底边）——人群排成横的几行，而不是顺着坡一个叠一个。
  // isr：以色列众人的几行 [x0, x1, K]；shore：被掳 / 归回的人在海边走过的地方
  const LAYL = {
    tx0: 0.72, tuW: 0.25, tuH: 0.42, flat: 0.55,
    plat: 0.59, platK: 0.26,
    pr: [0.468, 0.548], prK: 0.13, sg: [0.474, 0.554], sgK: 0,
    isr: [[0.405, 0.49, 0.38], [0.388, 0.55, 0.63], [0.37, 0.574, 0.9]],
    tent: 0.5, obed: 0.93, jabez: 0.58, dav: 0.565, dav2: 0.668, king: 0.598, kingK: 0.3,
    gil: 0.527, palace: 0.625, city: [0.566, 0.9], camp: [0.494, 0.562], shore: [0.372, 0.43], shoreK: 0.84,
    eld: [[0.445, 0.535, 0.3], [0.435, 0.55, 0.62]],
  };
  const LAYP = {
    tx0: 0.655, tuW: 0.31, tuH: 0.6, flat: 0.55,
    plat: 0.505, platK: 0.2,
    pr: [0.405, 0.455], prK: 0.44, sg: [0.415, 0.465], sgK: 0.34,
    isr: [[0.395, 0.5, 0.62], [0.378, 0.56, 0.8], [0.362, 0.62, 0.98]],
    tent: 0.52, obed: 0.93, jabez: 0.52, dav: 0.5, dav2: 0.6, king: 0.52, kingK: 0.3,
    gil: 0.53, palace: 0.625, city: [0.566, 0.93], camp: [0.494, 0.565], shore: [0.37, 0.43], shoreK: 0.86,
    eld: [[0.43, 0.52, 0.42], [0.41, 0.56, 0.72]],
  };
  const X = k => (tall() ? LAYP : LAYL)[k];
  const TU = () => { const L = tall() ? LAYP : LAYL; return Math.max(40, Math.min(W.w * L.tuW, W.h * L.tuH)); };
  // 殿台前缘、台阶起处（自廊前量起，殿长 tu 的比例）
  const PD = 0.14, STP = 0.22;
  const altX = () => (X('tx0') * W.w - 0.38 * TU()) / W.w;       // 铜坛（亦即大卫在禾场上筑坛之处）
  const seaX = () => (X('tx0') * W.w + 0.56 * TU()) / W.w;

  // ── 小工具 ──────────────────────────────────────────────────
  const narrowK = () => (W.w < 600 ? 1.15 : 1);
  const LS = l => W.layerScale(l) * narrowK();
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * [1.1, 1.2, 1.3][l];   // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const lit = c => [Math.min(255, c[0] * 1.22 + 20), Math.min(255, c[1] * 1.18 + 16), Math.min(255, c[2] * 1.14 + 12)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const mix = (a, b, t) => U.mixRGB(a, b, clamp(t, 0, 1));
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const sunLeft = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x) < W.w * 0.62;
  // 近地纵深里第 K 行的脚下（像素）；x 处的人要站到那一行时的 v（与人物模块的 footY 一致）
  const rowY = K => { const g0 = gY(2, X('flat')); return g0 + (K || 0) * Math.max(0, W.h - g0) * 0.8; };
  function vAt(xf, K) {
    if (!K) return 0;
    const g = gY(2, xf), f = Math.max(1, W.h - g) * 0.8;
    return clamp((rowY(K) - g) / f, 0, 0.98);
  }
  const PK = () => (tall() ? 1.18 : 1);      // 竖屏上人稍大一些
  const say = (b, lines) => { if (!b.instant && GS.ui) safe('ch.narrate', () => GS.ui.narrate(lines, { replace: false })); };
  const sfx = (b, name, o) => { if (b && b.instant) return; if (W.replaying) return; const a = au(); if (a && a.sfx) safe('ch.sfx', () => a.sfx(name, o || {})); };
  const avoid = (...rs) => { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); };

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c && c.has ? c.has(id) : !!(c && c.get && c.get(id)); };
  // 正在淡出的（成员都在消逝的）人群算作已不在：同名的人群可以立即重新召集（恢复与快进时一致）
  const hasCrowd = gid => { const c = C(), g = c && c.crowds && c.crowds.get && c.crowds.get(gid); return !!(g && g.members.some(m => !m.dying)); };
  const alive = id => { const p = has(id) ? fig(id) : null; return !!(p && !p.dying); };
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) {
    o = Object.assign({}, o || {});
    // 竖屏上人稍大（新加的人，或重新给了 scale 的人）
    if (!has(id) || o.scale != null) o.scale = (o.scale || 1) * PK();
    return C().add(id, Object.assign({ from: W.replaying ? 'none' : o.from || 'fade' }, o));
  }
  const walk = (id, x, o) => { if (has(id)) C().walk(id, x, o); };
  const pose = (id, p, o) => { if (has(id)) C().pose(id, p, o); };
  const face = (id, d) => { if (has(id)) C().face(id, d); };
  const rm = (id, now) => { if (has(id)) C().remove(id, now ? { fade: false } : undefined); };
  const glow = (id, v) => { if (has(id)) C().glow(id, v); };
  const place = (id, x, l) => { if (has(id)) C().place(id, x, l); };
  function crowd(gid, o) {
    const c = C();
    if (!c || hasCrowd(gid)) return;
    c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o));
  }
  const cwalk = (gid, x0, x1, o) => { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); };
  const cpose = (gid, p) => { if (hasCrowd(gid)) C().crowdPose(gid, p); };
  const crm = gid => { if (hasCrowd(gid)) C().removeCrowd(gid); };
  const members = gid => { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members.filter(m => !m.dying) : []; };
  // n 个位置，排成几行（每行 [x0, x1, K]）：按行宽分人，行与行错开半步，免得俯伏时一个压着一个
  function rowSpots(rows, n) {
    const wd = rows.map(r => Math.abs(r[1] - r[0])), tot = wd.reduce((s, w) => s + w, 0) || 1;
    const want = wd.map(w => w / tot * n), cnt = want.map(Math.floor);
    let left = n - cnt.reduce((s, c) => s + c, 0);
    want.map((w, i) => [w - cnt[i], i]).sort((a, b) => b[0] - a[0]).forEach(q => { if (left > 0) { cnt[q[1]]++; left--; } });
    const out = [];
    rows.forEach((r, ri) => {
      const k = cnt[ri];
      for (let j = 0; j < k; j++) {
        const f = clamp((j + (ri % 2 ? 0.72 : 0.36)) / k, 0, 1);
        const x = lerp(Math.min(r[0], r[1]), Math.max(r[0], r[1]), f) + (U.hash1(ri * 17 + j * 5 + 3) - 0.5) * 0.004;
        out.push({ x, v: vAt(x, r[2]), row: ri });
      }
    });
    return out;
  }
  // 把一群人排到几行里：o.walk 走过去（重演时直接到位），o.face 到了面朝哪边，o.pose 到了的姿势
  function arrange(gid, rows, o) {
    o = o || {};
    const ms = members(gid);
    if (!ms.length) return;
    const sp = rowSpots(rows, ms.length);
    if (o.walk) C().crowdWalk(gid, 0.5, 0.5, { speed: o.speed || 0.035, pose: o.pose || 'stand' });
    ms.forEach((m, i) => {
      const s = sp[i];
      if (tall() && !m.chPK) { m.scale *= PK(); m.chPK = 1; }
      if (o.walk && !W.replaying && m.tx != null) {
        m.tx = s.x; m.facing = s.x >= m.nx ? 1 : -1;
        m.chVT = s.v;                 // 纵深在走的路上慢慢挪过去（见 update）
        if (o.face) m.faceEnd = o.face;
      } else {
        m.v = s.v; m.chVT = null;
        m.nx = s.x; m.tx = null;
        if (o.face) { m.facing = m.fd = o.face; m.faceEnd = null; }
      }
    });
    if (!o.walk && o.pose) C().crowdPose(gid, o.pose);
  }
  // 以色列众人在院中前景的几行
  const isrRows = () => X('isr');
  const isrSpan = () => { const R = isrRows(); return [Math.min(...R.map(r => r[0])), Math.max(...R.map(r => r[1]))]; };
  function animal(id, o) {
    const c = C();
    if (!c || !c.animal) return null;
    return safe('ch.animal', () => c.animal(id, Object.assign({ layer: 2, from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function herd(gid, o) {
    const c = C();
    if (!c || !c.herd || hasCrowd(gid)) return;
    safe('ch.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  const setProp = (id, k) => { const c = C(); if (c && c.prop && has(id)) safe('ch.prop', () => c.prop(id, k || null)); };
  function headOf(id) {
    const f = fig(id);
    if (!f) return [W.w * 0.6, W.h * 0.7];
    if (f._vis && isFinite(f._x) && isFinite(f._y) && f._h > 0) return [f._x, f._y - f._h * 1.02];
    const x = f.nx * W.w;
    return [x, gY(f.layer == null ? 2 : f.layer, f.nx) - PH(f.layer == null ? 2 : f.layer) * 1.02];
  }

  // 衣袍
  const LINEN = [236, 232, 218], LINEN2 = [224, 220, 204], ROYAL = [132, 60, 74], ROYAL2 = [112, 66, 104], GOLDACC = [232, 188, 92];
  const SACK = [98, 86, 70];
  const KING = (robe, extra) => Object.assign({ robe: robe || ROYAL, hair: 'cloth', accent: GOLDACC, glow: 0.35 }, extra || {});

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）──
  function fresh() {
    return {
      riverT0: -1e9, w1T0: -1e9,       // 众名之河（装饰的时刻，不入签名）
      ark: 'none',                     // 'none' | 'cart' | 'poles' | 'obed' | 'tent' | 'in'
      bearers: [],                     // 抬约柜的人
      angel: 'none',                   // 'none' | 'sword' | 'sheath' | 'gone'
      fireT0: -1e9, fireX: 0,          // 自天降下的火（转瞬）
      one: false, oneT0: -1e9,         // 声合为一（状态）与那一刻（装饰）
      lamp: 'none',                    // 'none' | 'zion' | 'hidden' | 'exile' | 'home'
      eyesT0: -1e9, prayT0: -1e9, msgT0: -1e9, sweepT0: -1e9,
      camp: 'none',                    // 'moab' | 'assyria'
      scroll: false,                   // 律法书（约西亚）
      names: [],                       // 情节里写在地上的名 [{ s, xf, l, t0 }]
    };
  }
  let S = fresh();
  // 转瞬的光（不属于世界的状态；重演时不放）
  const FXL = [];
  const flash = (b, o) => { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); };

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
  function vbeam(rgbC, rgbE, headFade, soft) {
    const w = 64, h = 256, c = cnv(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const vy = Math.min(1, v / (headFade || 0.08)) * (v > 0.8 ? Math.pow(Math.max(0, 1 - (v - 0.8) / 0.2), 1.5) : 1);
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1;
        const core = soft ? Math.exp(-hx * hx * 9) : Math.exp(-hx * hx * 40), edge = Math.exp(-hx * hx * (soft ? 3.2 : 5));
        const a = vy * (soft ? edge * 0.7 + core * 0.3 : edge * 0.65 + core * 0.35);
        const i = (y * w + x) * 4;
        d[i] = lerp(rgbE[0], rgbC[0], core); d[i + 1] = lerp(rgbE[1], rgbC[1], core); d[i + 2] = lerp(rgbE[2], rgbC[2], core);
        d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      ember: radial([255, 104, 44], 1), smoke: radial([138, 130, 122], 0.8, 0.55), soot: radial([40, 32, 28], 0.85, 0.55),
      cloud: radial([255, 250, 236], 0.9, 0.55), green: radial([160, 214, 120], 0.8), silver: radial([230, 236, 250], 1),
      beam: vbeam([255, 250, 232], [255, 232, 180], 0.06), fire: vbeam([255, 244, 200], [255, 120, 40], 0.02),
      soft: vbeam([255, 248, 226], [255, 230, 176], 0.35, true),
    };
    return SP;
  }
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr + '|' + rgb.join(',');
    let s = TXT.get(key);
    if (s) return s;
    if (TXT.size > 200) TXT.clear();
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const font = Math.round(px * dpr) + 'px ' + FONT;
    g.font = font;
    const tw = Math.ceil(g.measureText(str).width) + Math.ceil(18 * dpr);
    c.width = Math.max(4, tw); c.height = Math.ceil(px * 2 * dpr);
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(14, 9, 5, 0.8)'; g.shadowBlur = 5 * dpr;
    g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    g.fillText(str, c.width / 2, c.height / 2);
    g.shadowColor = U.rgba(rgb[0], rgb[1], rgb[2], 0.55); g.shadowBlur = 9 * dpr;
    g.fillText(str, c.width / 2, c.height / 2);
    s = { c, w: c.width / dpr, h: c.height / dpr };
    TXT.set(key, s);
    return s;
  }
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "GS Kai"', '亚当塞特大卫所罗门').then(() => { TXT.clear(); RL = null; }).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => { TXT.clear(); RL = null; }).catch(() => {});
      }
    } catch (e) { /* 用系统字 */ }
  }
  function glowAt(ctx, spr, x, y, s, a) {
    if (a <= 0.004 || s <= 0) return;
    ctx.globalAlpha = clamp(a, 0, 1);
    ctx.drawImage(spr, x - s / 2, y - s / 2, s, s);
  }

  // ════════════════════════════════════════════════════════════
  //  众名之河（代上 1—9）：从天边（起初）流到锡安
  // ════════════════════════════════════════════════════════════
  const R_INTRO = [
    ['亚当', 1.3], ['塞特'], ['以挪士'], ['该南'], ['玛勒列'], ['雅列'], ['以诺'], ['玛土撒拉'], ['拉麦'], ['挪亚', 1.15],
    ['闪'], ['亚法撒'], ['希伯'], ['法勒'], ['他拉'], ['亚伯拉罕', 1.25], ['以撒'], ['以色列', 1.25],
    ['吕便', 1, 1], ['西缅', 1, -1], ['利未', 1, 1], ['犹大', 1.1, 0], ['以萨迦', 1, -1], ['西布伦', 1, 1], ['但', 1, -1], ['约瑟', 1, 1],
    ['便雅悯', 1, -1], ['拿弗他利', 1, 1], ['迦得', 1, -1], ['亚设', 1, 1],
    ['法勒斯'], ['希斯伦'], ['兰'], ['亚米拿达'], ['拿顺'], ['撒门'], ['波阿斯'], ['俄备得'], ['耶西'], ['大卫', 1.3], ['所罗门', 1.1],
  ];
  // 第一句话里的名（雅比斯……扫罗、约拿单）：扫罗的名正在他出现在基利波山上的时候写出
  const R_W1 = [
    [0.6, '雅比斯', 1.15], [4.8, '吕便'], [5.4, '迦得'], [6, '玛拿西'], [6.8, '利未'], [7.4, '亚萨', 1.05], [8, '希幔', 1.05], [8.6, '耶杜顿', 1.05],
    [10.2, '以萨迦'], [10.8, '以法莲'], [11.4, '嫩'], [12, '约书亚', 1.1], [12.8, '便雅悯'], [13.4, '基士'], [14, '扫罗', 1.15], [14.8, '约拿单'],
  ];
  const RIVER = [];
  (function () {
    // 相邻两名之间的间隔按字数来算：长的名、大的名，后面空得多一些
    let t = 4.5, prev = null;     // 幕布升起之后才开始写
    R_INTRO.forEach(n => {
      const k = n[1] || 1, w = n[0].length * k;
      if (prev != null) t += 0.15 * (prev + w) / 2 + 0.2;
      RIVER.push({ s: n[0], k, br: n[2] || 0, t, w1: false, u: 0 });
      prev = w;
    });
    R_W1.forEach(n => RIVER.push({ s: n[1], k: n[2] || 1, br: 0, t: n[0], w1: true, u: 0 }));
  })();
  const rLife = () => (tall() ? 4.8 : 5.8);
  const rPx = () => clamp(15 * W.unit, 12, 19);
  // 众名像一行字写在河上：自源头（左）向锡安（右）一个接一个写出，从左往右读是由古至今；
  // 写到河尾就回到源头接着写（前面的早已淡去）。沿弧长排好位置（按字宽，不相挤）。
  const rDrift = () => 12 * Math.max(0.6, W.unit);     // 写出后随水漂的速度（像素/秒）
  function layRiver(L) {
    // 字宽按实际的字模量（没有量到时按方块字估）；先写的名随水漂，后写的名要让出它漂过的那一段
    const px = rPx(), gap = px * 0.9, lo = 0.05 * L, hi = 0.95 * L, dr = rDrift();
    const wOf = n => { const sp = textSprite(n.s, Math.round(px * n.k), [248, 232, 206]); return Math.max(n.s.length * px * n.k, sp.w - 18); };
    const lay = (list, u0) => {
      let u = u0, prev = null;
      for (const n of list) {
        const w = wOf(n), lead = prev ? dr * Math.max(0, n.t - prev.t) : 0;
        if (!prev) u = u0 + w / 2;
        else if (n.br && prev.br && n.br !== prev.br) u += (prev.w + w) / 2 * 0.45 + gap * 0.3 + lead;   // 十二个儿子在河的两岸交错
        else u += (prev.w + w) / 2 + gap + lead;
        if (u + w / 2 > hi) u = lo + w / 2;
        n.u = u / L; n.w = w; prev = n;
      }
    };
    lay(RIVER.filter(n => !n.w1), lo);
    // 第一句话里的名：从河尾（锡安、基利波一带）往回排，扫罗、约拿单落在河将尽之处
    const w1 = RIVER.filter(n => n.w1), hi2 = hi - dr * rLife() * 0.7;
    let u = hi2, next = null;
    for (let i = w1.length - 1; i >= 0; i--) {
      const n = w1[i], w = wOf(n);
      u = next ? u - (next.w + w) / 2 - gap - dr * Math.max(0, next.t - n.t) : hi2 - w / 2;
      if (u - w / 2 < lo) u = hi2 - w / 2;
      n.u = u / L; n.w = w; next = n;
    }
  }
  // 河道：自东边天海相接处（起初）升起，越过高天，落到锡安；按弧长取点，众名匀速而行
  function riverPts() {
    return tall()
      ? [[0.05, 0.57], [0.12, 0.38], [0.64, 0.35], [X('palace'), 0.655]]
      : [[0.05, 0.47], [0.2, 0.13], [0.62, 0.1], [X('palace') + 0.005, 0.645]];
  }
  function bez(P, s) {
    const u = 1 - s;
    return [
      (u * u * u * P[0][0] + 3 * u * u * s * P[1][0] + 3 * u * s * s * P[2][0] + s * s * s * P[3][0]) * W.w,
      (u * u * u * P[0][1] + 3 * u * u * s * P[1][1] + 3 * u * s * s * P[2][1] + s * s * s * P[3][1]) * W.h,
    ];
  }
  let RL = null;
  function riverLUT() {
    if (RL && RL.w === W.w && RL.h === W.h) return RL;
    const P = riverPts(), N = 96, pts = [], cum = [0];
    for (let i = 0; i <= N; i++) pts.push(bez(P, i / N));
    for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    layRiver(cum[N]);
    return (RL = { w: W.w, h: W.h, pts, cum, L: cum[N] });
  }
  // 沿河道弧长的比例 u（0..1）处的点与切向
  function riverAt(u) {
    const R = riverLUT(), d = clamp(u, 0, 1) * R.L, c = R.cum;
    let lo = 0, hi = c.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= d) lo = m; else hi = m; }
    const f = (d - c[lo]) / Math.max(1e-6, c[hi] - c[lo]), a = R.pts[lo], b = R.pts[hi];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), dx / L, dy / L];
  }
  function drawRiver(ctx) {
    const k = lv('chRiver');
    if (k < 0.01) return;
    const R = riverLUT(), un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const night = 0.5 + 0.5 * nightK();
    for (const [wd, a] of [[18, 0.045], [7, 0.08], [1.8, 0.26]]) {
      ctx.strokeStyle = U.rgba(255, 226, 170, a * k * night);
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      R.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
    }
    // 流动的光点
    ctx.fillStyle = 'rgb(255, 238, 200)';
    for (let i = 0; i < 50; i++) {
      const s = U.fract(W.t * 0.05 + i * 0.618);
      const p = riverAt(s), off = (U.hash1(i * 7 + 1) - 0.5) * 12 * un;
      ctx.globalAlpha = clamp(k * Math.sin(Math.PI * s) * 0.7 * night, 0, 1);
      const z = (1 + (i % 3) * 0.6) * un;
      ctx.fillRect(p[0] - p[3] * off - z / 2, p[1] + p[2] * off - z / 2, z, z);
    }
    // 源头与流到锡安的一汪光
    sprites();
    const s0 = R.pts[0], e = R.pts[R.pts.length - 1];
    glowAt(ctx, SP.gold, s0[0], s0[1], 60 * un, 0.3 * k * night);
    glowAt(ctx, SP.gold, e[0], e[1], 100 * un, 0.38 * k * night);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // 众名：一个接一个写在河上（从左往右读是由古至今），写出后随水慢慢向前漂，渐渐淡去；
    // 十二个儿子在河的两岸交错。第一句话开始时，卷首还没写完的名不再写，已写的很快淡去
    const px0 = rPx(), life = rLife(), drift = rDrift();
    const w1On = S.w1T0 > -1e8, introOut = w1On ? 1 - sm(S.w1T0, S.w1T0 + 1.2, W.t) : 1;
    for (const n of RIVER) {
      const t0 = n.w1 ? S.w1T0 + n.t : S.riverT0 + n.t;
      if (n.w1 && !w1On) continue;
      if (!n.w1 && w1On && S.riverT0 + n.t > S.w1T0) continue;
      const age = W.t - t0;
      if (age < 0 || age > life) continue;
      const u = clamp(n.u + (drift * age) / R.L, 0, 0.985);
      const p = riverAt(u);
      let x = p[0], y = p[1];
      if (n.br) { const off = n.br * 0.034 * W.h; x += -p[3] * off; y += p[2] * off; }
      const a = sm(0, 0.6, age) * (1 - sm(life - 1.8, life, age)) * k * (n.w1 ? 1 : introOut);
      if (a < 0.02) continue;
      const sp = textSprite(n.s, Math.round(px0 * n.k), n.k > 1.1 ? [255, 236, 190] : [248, 232, 206]);
      ctx.globalAlpha = a;
      ctx.drawImage(sp.c, x - sp.w / 2, y - sp.h / 2, sp.w, sp.h);
      // 刚写出的一瞬：一点笔尖的光
      if (age < 0.7) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x, y, 34 * un, 0.5 * (1 - age / 0.7) * k); ctx.globalCompositeOperation = 'source-over'; }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  雅比斯的境界（代上 4:10）
  // ════════════════════════════════════════════════════════════
  function drawBorder(ctx) {
    const e = lv('chBorder'), a = lv('chBorderA');
    if (e < 0.01 || a < 0.01) return;
    const cx = X('jabez'), R = 0.72 * e, x0 = Math.max(0.31, cx - R), x1 = Math.min(0.999, cx + R);
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const [wd, al] of [[7, 0.1], [2.2, 0.4]]) {
      ctx.strokeStyle = U.rgba(255, 222, 150, al * a * (0.6 + 0.4 * nightK()));
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      for (let i = 0; i <= 60; i++) {
        const xf = lerp(x0, x1, i / 60), y = gY(2, xf) + 2 * un;
        if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y);
      }
      ctx.stroke();
    }
    sprites();
    for (const xf of [x0, x1]) glowAt(ctx, SP.gold, xf * W.w, gY(2, xf), 40 * un, 0.6 * a * (1 - e * 0.3));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  大卫城（中丘层）：房屋、城墙、城楼、王宫、大卫的灯
  // ════════════════════════════════════════════════════════════
  const STONE = [212, 194, 160], STONE_OLD = [150, 140, 126], CEDAR = [112, 78, 52], HOLE = [52, 38, 30], SOOT = [46, 38, 34];
  let CITY = null;
  function cityLayout() {
    if (CITY && CITY.w === W.w && CITY.h === W.h && CITY.tall === tall()) return CITY;
    const r = U.mulberry32(2913), hm = PH(1), [a, b] = X('city'), core = X('palace'), out = [];
    for (let row = 0; row < 2; row++) {
      let x = a * W.w + r() * hm * 0.5;
      while (x < b * W.w) {
        const w = hm * (0.9 + r() * 1.1) * (row ? 1 : 0.9), h = hm * (0.95 + r() * 0.75) * (row ? 1 : 1.12);
        const xf = (x + w / 2) / W.w;
        const dist = Math.abs(xf - core) / Math.max(0.05, xf < core ? core - a : b - core);
        out.push({ xf, wk: w / hm, hk: h / hm, row, th: clamp(dist * 0.86 + r() * 0.12, 0, 0.98), ruin: r(), door: r() < 0.55, win: r() < 0.75, dx: r(), dome: r() < 0.08 });
        x += w * (0.55 + r() * 0.55);
      }
    }
    return (CITY = { w: W.w, h: W.h, tall: tall(), houses: out });
  }
  const cityEdge = k => { const [a, b] = X('city'), c = X('palace'); return [lerp(c - 0.04, a + 0.01, sm(0.15, 1, k)), lerp(c + 0.06, b - 0.01, sm(0.15, 1, k))]; };
  function drawCity(ctx) {
    const k = lv('chCity');
    if (k < 0.01) return;
    const L = cityLayout(), hm = PH(1), un = W.unit, ruin = lv('chRuin'), wild = lv('chWild'), burn = lv('chBurn');
    const base = mix(STONE, STONE_OLD, ruin * 0.5), sooty = mix(base, SOOT, ruin * 0.55);
    const body = css(sooty, 1), rim = css(lit(sooty), 1, rimA(), 0.1), hole = css(HOLE, 1);
    const sl = sunLeft();
    const [e0, e1] = cityEdge(k);
    for (let row = 0; row < 2; row++) {
      const R = [];
      for (const hs of L.houses) {
        if (hs.row !== row || k < hs.th) continue;
        const v = clamp((k - hs.th) / 0.1, 0, 1), x = hs.xf * W.w, w = hs.wk * hm;
        const g = gY(1, hs.xf) + (row ? 0.05 : -0.18) * hm;
        const h = hs.hk * hm * U.easeOut(v) * (1 - ruin * (0.35 + 0.5 * hs.ruin));
        if (h < 0.5) continue;
        R.push([x - w / 2, g - h, w, h + 3 * un, hs]);
      }
      if (!R.length) continue;
      ctx.fillStyle = body;
      ctx.beginPath();
      for (const q of R) {
        if (ruin > 0.2) {   // 残垣：参差的顶
          const n = 4, jag = q[3] * 0.25 * ruin;
          ctx.moveTo(q[0], q[1] + q[3]);
          for (let i = 0; i <= n; i++) ctx.lineTo(q[0] + q[2] * i / n, q[1] + jag * U.hash1(q[4].xf * 999 + i));
          ctx.lineTo(q[0] + q[2], q[1] + q[3]);
          ctx.closePath();
        } else ctx.rect(q[0], q[1], q[2], q[3]);
      }
      ctx.fill();
      // 背光的一面（给房屋一点体积）与平顶的檐
      ctx.fillStyle = css(dim(sooty, 0.78), 1);
      ctx.beginPath();
      for (const q of R) { const sw = q[2] * (0.18 + 0.12 * q[4].dx); ctx.rect(sl ? q[0] + q[2] - sw : q[0], q[1], sw, q[3]); }
      ctx.fill();
      if (ruin < 0.2) {
        ctx.fillStyle = css(mix(lit(sooty), [196, 170, 130], 0.3), 1, null, 0.04);
        ctx.beginPath();
        for (const q of R) if (!q[4].dome) ctx.rect(q[0] - 0.8 * un, q[1] - 1.2 * un, q[2] + 1.6 * un, 1.6 * un);
        ctx.fill();
        // 偶有圆顶
        ctx.fillStyle = body;
        ctx.beginPath();
        for (const q of R) if (q[4].dome) { const r0 = q[2] * 0.32; ctx.moveTo(q[0] + q[2] / 2 + r0, q[1] + 0.5); ctx.arc(q[0] + q[2] / 2, q[1] + 0.5, r0, 0, Math.PI, true); }
        ctx.fill();
      }
      ctx.fillStyle = hole;
      ctx.beginPath();
      for (const q of R) {
        const hs = q[4];
        if (hs.door && q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.15), dh = Math.min(q[3] * 0.45, hm * 0.4); ctx.rect(q[0] + q[2] * (0.25 + 0.5 * hs.dx) - dw / 2, q[1] + q[3] - 3 * un - dh, dw, dh); }
        if (hs.win && q[3] > hm * 0.7) { const s = Math.max(1, hm * 0.08); ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4); }
      }
      ctx.fill();
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(0.6, un);
      ctx.beginPath();
      for (const q of R) { const ex = sl ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] * 0.5, q[1]); }
      ctx.stroke();
      // 夜里的灯火
      const lamps = W.night * (1 - ruin) * (1 - burn);
      if (lamps > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 196, 120, 0.85 * lamps);
        ctx.beginPath();
        for (const q of R) {
          const hs = q[4];
          if (!hs.win || q[3] < hm * 0.5) continue;
          const s = Math.max(1, hm * 0.08);
          ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s * 1.4);
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      if (row === 0) drawWall(ctx, k, e0, e1, ruin);
    }
    // 草木覆盖（地享受安息）
    if (wild > 0.02) {
      ctx.fillStyle = css([92, 128, 70], 1, 0.75 * wild);
      ctx.beginPath();
      for (const hs of L.houses) {
        if (k < hs.th) continue;
        const x = hs.xf * W.w, w = hs.wk * hm, g = gY(1, hs.xf);
        const hh = hm * (0.12 + 0.4 * hs.ruin) * wild;
        ctx.moveTo(x - w * 0.6, g + 2); ctx.quadraticCurveTo(x - w * 0.1, g - hh * 1.6, x + w * 0.55, g + 2); ctx.closePath();
      }
      ctx.fill();
    }
  }
  function drawWall(ctx, k, x0, x1, ruin) {
    const v = sm(0.05, 0.3, k);
    if (v <= 0) return;
    const hm = PH(1), un = W.unit, wh = hm * 0.7 * v, cren = Math.max(2, hm * 0.2);
    ctx.fillStyle = css(mix(mix([200, 182, 150], STONE_OLD, ruin * 0.5), SOOT, ruin * 0.5), 1);
    ctx.beginPath();
    let x = x0 * W.w, i = 0;
    while (x < x1 * W.w) {
      const seg = cren * 2, xe = Math.min(x1 * W.w, x + seg);
      const broken = ruin > 0.05 && U.hash1(i * 7 + 3) < ruin * 0.55;
      const g0 = gY(1, x / W.w) + hm * 0.12, h = broken ? wh * (0.15 + 0.3 * U.hash1(i + 9)) : wh;
      ctx.rect(x, g0 - h, xe - x + 0.5, h + 4 * un);
      if (!broken) ctx.rect(x, g0 - h - cren * 0.6, cren, cren * 0.6 + 1);
      x = xe; i++;
    }
    // 城楼（乌西雅又筑城楼：代下 26:9）
    const tw = lv('chTower');
    const towers = [x0 + 0.015, x0 + (x1 - x0) * 0.33, x0 + (x1 - x0) * 0.66, x1 - 0.015];
    towers.forEach((f, j) => {
      const gx = f * W.w, g0 = gY(1, f) + hm * 0.12, th = wh * (1.35 + 0.7 * tw * (j % 2 ? 1 : 0.6)) * (1 - ruin * 0.6 * U.hash1(j + 3)), w = hm * 0.62;
      ctx.rect(gx - w / 2, g0 - th, w, th + 4 * un);
      if (ruin < 0.4) { ctx.rect(gx - w / 2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); ctx.rect(gx + w * 0.2, g0 - th - cren * 0.6, w * 0.3, cren * 0.6 + 1); }
    });
    ctx.fill();
    // 城门（锡安的门）
    ctx.fillStyle = css(HOLE, 1);
    ctx.beginPath();
    const gx = (x0 + 0.015) * W.w, g0 = gY(1, x0 + 0.015) + hm * 0.12, gw = hm * 0.26, gh = wh * 0.8;
    ctx.moveTo(gx - gw / 2, g0 + 1); ctx.lineTo(gx - gw / 2, g0 - gh + gw / 2); ctx.arc(gx, g0 - gh + gw / 2, gw / 2, Math.PI, 0); ctx.lineTo(gx + gw / 2, g0 + 1); ctx.closePath();
    ctx.fill();
  }
  // 王宫（大卫香柏木的宫）
  function palaceBox() {
    const x = X('palace') * W.w, hm = PH(1), g = gY(1, X('palace')) + hm * 0.1;
    return { x, g, w: hm * 2.4, h: hm * 1.9, hm };
  }
  function drawPalace(ctx) {
    const k = lv('chPalace');
    if (k < 0.01) return;
    const { x, g, w, h, hm } = palaceBox(), un = W.unit, ruin = lv('chRuin');
    const hh = h * U.easeOut(k) * (1 - 0.5 * ruin);
    ctx.fillStyle = css(mix(mix([214, 198, 166], STONE_OLD, ruin * 0.5), SOOT, ruin * 0.6), 1);
    ctx.beginPath();
    ctx.rect(x - w / 2, g - hh * 0.62, w, hh * 0.62 + 3 * un);
    ctx.rect(x - w * 0.3, g - hh, w * 0.6, hh * 0.4 + 1);
    ctx.fill();
    // 香柏木的梁与柱廊
    if (ruin < 0.6) {
      ctx.fillStyle = css(CEDAR, 1, 1 - ruin);
      ctx.beginPath();
      ctx.rect(x - w / 2 - 2 * un, g - hh * 0.62 - 2.2 * un, w + 4 * un, 2.2 * un);
      ctx.rect(x - w * 0.3 - 1.5 * un, g - hh - 2 * un, w * 0.6 + 3 * un, 2 * un);
      for (let i = 0; i < 6; i++) ctx.rect(x - w * 0.42 + i * w * 0.168, g - hh * 0.55, Math.max(1, hm * 0.07), hh * 0.5);
      ctx.fill();
    }
    ctx.strokeStyle = css(lit([214, 198, 166]), 1, rimA() * (1 - ruin), 0.1);
    ctx.lineWidth = Math.max(0.6, un);
    ctx.beginPath();
    const ex = sunLeft() ? x - w / 2 : x + w / 2;
    ctx.moveTo(ex, g); ctx.lineTo(ex, g - hh * 0.62);
    ctx.stroke();
    if (W.night > 0.05 && ruin < 0.3 && lv('chBurn') < 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 200, 120, 0.8 * W.night * k);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) ctx.rect(x - w * 0.36 + i * w * 0.22, g - hh * 0.4, Math.max(1, hm * 0.1), Math.max(1, hm * 0.12));
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // ── 大卫的灯（代下 21:7）──
  const lampPos = { x: 0, y: 0, init: false };
  function lampTarget() {
    const m = S.lamp;
    if (m === 'hidden') { const t = temple(); return [t.x0 + 0.12 * t.tu, t.top - 0.13 * t.tu * t.vk]; }
    if (m === 'exile') { const [s0] = X('shore'); return [(s0 + 0.012) * W.w, rowY(X('shoreK')) - PH(2) * 2]; }
    const p = palaceBox();
    return [p.x, p.g - p.h - p.hm * (S.lamp === 'home' || lv('chRoad') > 0.3 ? 1.8 : 0.9)];
  }
  function stepLamp(dt, snap) {
    const t = lampTarget();
    if (snap || !lampPos.init) { lampPos.x = t[0]; lampPos.y = t[1]; lampPos.init = true; return; }
    const k = 1 - Math.exp(-dt * (S.lamp === 'exile' ? 0.35 : S.lamp === 'home' ? 0.45 : 1.2));
    lampPos.x += (t[0] - lampPos.x) * k; lampPos.y += (t[1] - lampPos.y) * k;
  }
  function drawLamp(ctx) {
    const k = lv('chLamp');
    if (k < 0.01 || S.lamp === 'none') return;
    sprites();
    const un = Math.max(0.6, W.unit), x = lampPos.x, y = lampPos.y;
    const fl = 0.86 + 0.1 * Math.sin(W.t * 7.3) + 0.05 * Math.sin(W.t * 13.1);
    const small = S.lamp === 'hidden' ? 1.1 : S.lamp === 'exile' ? 0.7 : 1 + 0.5 * lv('chRoad');
    ctx.globalCompositeOperation = 'lighter';
    if (S.lamp === 'hidden') {
      // 藏在神殿里（亚她利雅的黑暗中）：门缝里透出光来，铺在台阶与院中
      const t = temple(), tu = t.tu, dx = t.x0 + 0.12 * tu, dy = t.top - 0.16 * tu * t.vk;
      glowAt(ctx, SP.gold, dx, dy, tu * 0.7, k * 0.5 * fl);
      const g = ctx.createLinearGradient(dx, 0, dx - tu * 0.9, 0);
      g.addColorStop(0, U.rgba(255, 214, 140, 0.28 * k * fl)); g.addColorStop(1, U.rgba(255, 214, 140, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(dx, t.top - 0.3 * tu * t.vk); ctx.lineTo(dx - tu * 0.9, t.top + 0.02 * tu); ctx.lineTo(dx - tu * 0.9, t.top + 0.2 * tu); ctx.lineTo(dx, t.top); ctx.closePath(); ctx.fill();
    }
    glowAt(ctx, SP.warm, x, y, 70 * un * small * (0.8 + 0.4 * k), k * (0.35 + 0.35 * nightK()) * fl);
    glowAt(ctx, SP.gold, x, y, 26 * un * small, k * 0.9 * fl);
    // 小小的火苗
    const h = 7 * un * small * fl, w = 2.4 * un * small;
    ctx.globalAlpha = clamp(k, 0, 1);
    ctx.fillStyle = 'rgb(255, 236, 170)';
    ctx.beginPath();
    ctx.moveTo(x - w, y + h * 0.3); ctx.quadraticCurveTo(x - w, y - h * 0.4, x + Math.sin(W.t * 5) * w * 0.3, y - h);
    ctx.quadraticCurveTo(x + w, y - h * 0.4, x + w, y + h * 0.3); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // 灯盏
    ctx.fillStyle = css([150, 110, 60], 1, k);
    ctx.beginPath(); ctx.ellipse(x, y + h * 0.42, w * 2.2, w * 0.8, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 基利波（扫罗）与基遍（会幕与铜坛）：中丘层的右端 ──
  function drawGibeon(ctx) {
    const k = lv('chGibeon');
    if (k < 0.01) return;
    sprites();
    const xf = X('gil'), x = xf * W.w, g = gY(1, xf), hm = PH(1), un = W.unit;
    ctx.globalAlpha = k;
    // 会幕（摩西在旷野所造的，1:3）
    const tw = hm * 1.9, th = hm * 0.9, tx = x + hm * 0.9;
    ctx.fillStyle = css([118, 64, 52], 1);
    ctx.beginPath();
    ctx.moveTo(tx - tw / 2, g + 2); ctx.lineTo(tx - tw / 2, g - th * 0.8); ctx.lineTo(tx - tw * 0.3, g - th); ctx.lineTo(tx + tw * 0.3, g - th); ctx.lineTo(tx + tw / 2, g - th * 0.8); ctx.lineTo(tx + tw / 2, g + 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 30, 26], 1);
    ctx.fillRect(tx - tw / 2 + tw * 0.08, g - th * 0.6, tw * 0.12, th * 0.6);
    // 铜坛与一千牺牲的火
    const ax = x - hm * 0.4, aw = hm * 0.7, ah = hm * 0.4;
    ctx.fillStyle = css([150, 96, 58], 1);
    ctx.fillRect(ax - aw / 2, g - ah, aw, ah + 2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.8 + 0.2 * Math.sin(W.t * 9);
    glowAt(ctx, SP.warm, ax, g - ah, hm * 3.5, k * (0.35 + 0.45 * nightK()) * fl);
    for (let i = 0; i < 7; i++) {
      const fx0 = ax + (i - 3) * aw * 0.16, h = hm * (0.25 + 0.15 * Math.sin(W.t * 7 + i * 1.7)) * k;
      ctx.fillStyle = i % 2 ? 'rgb(255, 150, 60)' : 'rgb(255, 214, 130)';
      ctx.globalAlpha = 0.8 * k;
      ctx.beginPath(); ctx.moveTo(fx0 - aw * 0.07, g - ah); ctx.quadraticCurveTo(fx0, g - ah - h * 1.4, fx0 + aw * 0.07, g - ah); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    smoke(ctx, ax, g - ah - hm * 0.3, k * 0.8, hm * 7, hm * 0.4, 5, false, 0.06);
  }

  // ════════════════════════════════════════════════════════════
  //  殿（近地）：殿台、廊子、圣所与至圣所、旁屋、雅斤与波阿斯、铜坛、铜海
  //  东向：门朝左（左 = 东，日出之处）
  // ════════════════════════════════════════════════════════════
  const LIME = [226, 210, 178], LIME_D = [180, 164, 136], GOLD = [232, 190, 96], BRONZE = [176, 112, 64], BRONZE_D = [118, 72, 44];
  let TG = null;
  function temple() {
    if (TG && TG.w === W.w && TG.h === W.h && TG.tall === tall()) return TG;
    const tu = TU(), x0 = X('tx0') * W.w;
    let gmin = 1e9, gmax = -1e9;
    for (let i = 0; i <= 12; i++) {
      const x = lerp(x0 - PD * tu, x0 + 1.03 * tu, i / 12), g = gY(2, x / W.w);
      gmin = Math.min(gmin, g); gmax = Math.max(gmax, g);
    }
    const top = gmin - 0.035 * tu;
    // 竖屏时殿稍高一些（画面窄而高，殿不至于缩成一小块）
    const vk = tall() ? 1.35 : 1;
    return (TG = { w: W.w, h: W.h, tall: tall(), tu, vk, x0, x1: x0 + tu, top, base: gmax + 6 * W.unit, hH: 0.42 * tu * vk, hP: 0.7 * tu * vk });
  }
  function drawGloryBack(ctx) {
    const gl = lv('chGlory');
    if (gl < 0.01) return;
    sprites();
    const t = temple(), cx = t.x0 + 0.5 * t.tu, cy = t.top - t.hH * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy, t.tu * 2.4, gl * (0.24 + 0.2 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawTemple(ctx) {
    const b = lv('chBuild');
    if (b < 0.004) return;
    const t = temple(), tu = t.tu, x0 = t.x0, top = t.top, un = W.unit;
    const ruin = lv('chRuin'), wild = lv('chWild'), burn = lv('chBurn'), gl = lv('chGlory'), door = lv('chDoor');
    const soot = ruin * 0.65 + burn * 0.25;
    const body = mix(LIME, SOOT, soot), bodyD = mix(LIME_D, SOOT, soot);
    const sl = sunLeft();
    const cBody = css(body, 2), cDark = css(bodyD, 2), cRim = css(lit(body), 2, rimA() * (1 - ruin * 0.7), 0.12);
    // ── 殿台 ──
    const pk = sm(0, 0.14, b), pTop = lerp(t.base, top, pk);
    ctx.fillStyle = cDark;
    ctx.beginPath();
    ctx.moveTo(x0 - PD * tu, t.base); ctx.lineTo(x0 - PD * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, t.base);
    ctx.closePath(); ctx.fill();
    // 石的层理
    ctx.strokeStyle = css(dim(bodyD, 0.7), 2, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (let y = pTop + 0.018 * tu; y < t.base; y += 0.018 * tu) { ctx.moveTo(x0 - PD * tu, y); ctx.lineTo(x0 + 1.03 * tu, y); }
    ctx.stroke();
    // 台阶（在廊前）
    if (pk > 0.5) {
      const s0 = x0 - STP * tu, s1 = x0 - PD * tu, n = 6;
      ctx.fillStyle = cBody;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const yy = lerp(t.base, pTop, (i + 1) / n);
        ctx.rect(lerp(s0, s1, i / n), yy, s1 - lerp(s0, s1, i / n) + 1, t.base - yy);
      }
      ctx.fill();
    }
    ctx.strokeStyle = cRim; ctx.lineWidth = Math.max(0.8, 1.2 * un);
    ctx.beginPath(); ctx.moveTo(x0 - PD * tu, pTop); ctx.lineTo(x0 + 1.03 * tu, pTop); ctx.stroke();
    if (b < 0.1) return;
    // ── 墙渐渐升起 ──
    const wk = sm(0.1, 0.66, b);
    const hH = t.hH * (1 - ruin * 0.55), hP = t.hP * (1 - ruin * 0.62);
    const clipY = top - Math.max(hH, hP) * wk - 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 - 0.3 * tu, clipY, 1.5 * tu, top - clipY + 2); ctx.clip();
    // 圣所与至圣所（长的殿身）
    const hx0 = x0 + 0.2 * tu, hx1 = x0 + tu;
    const gr = ctx.createLinearGradient(0, top - hH, 0, top);
    gr.addColorStop(0, css(lit(body), 2, null, 0.05 * (1 - ruin))); gr.addColorStop(1, cBody);
    ctx.fillStyle = gr;
    ctx.beginPath();
    if (ruin > 0.05) {
      ctx.moveTo(hx0, top);
      const n = 10;
      for (let i = 0; i <= n; i++) ctx.lineTo(lerp(hx0, hx1, i / n), top - hH * (1 - ruin * 0.6 * U.hash1(i * 3.1 + 7)));
      ctx.lineTo(hx1, top); ctx.closePath();
    } else ctx.rect(hx0, top - hH, hx1 - hx0, hH + 1);
    ctx.fill();
    // 旁屋（三层）
    const sh = 0.2 * tu * t.vk * (1 - ruin * 0.4);
    ctx.fillStyle = css(mix(LIME_D, SOOT, soot), 2);
    ctx.fillRect(hx0 + 0.04 * tu, top - sh, hx1 - hx0 - 0.02 * tu, sh + 1);
    ctx.strokeStyle = css(dim(bodyD, 0.6), 2, 0.5);
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.beginPath();
    for (let j = 1; j < 3; j++) { const y = top - sh * j / 3; ctx.moveTo(hx0 + 0.04 * tu, y); ctx.lineTo(hx1 - 0.02 * tu, y); }
    ctx.stroke();
    // 旁屋的小窗与殿身的窄窗（荣光时透出金光）
    const winGlow = clamp(gl * 0.9 + nightK() * 0.35 * (1 - ruin) * (1 - burn) * door, 0, 1);
    ctx.fillStyle = css(HOLE, 2);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const wx = lerp(hx0 + 0.09 * tu, hx1 - 0.06 * tu, i / 8);
      for (let j = 0; j < 3; j++) ctx.rect(wx - 0.008 * tu, top - sh * (j + 0.72) / 3, 0.016 * tu, sh * 0.13);
      if (ruin < 0.3) ctx.rect(wx - 0.007 * tu, top - hH * 0.84, 0.014 * tu, hH * 0.2);
    }
    ctx.fill();
    if (winGlow > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 214, 130, 0.85 * winGlow);
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const wx = lerp(hx0 + 0.09 * tu, hx1 - 0.06 * tu, i / 8);
        if (ruin < 0.3) ctx.rect(wx - 0.007 * tu, top - hH * 0.84, 0.014 * tu, hH * 0.2);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    // 石的层理与壁柱（分开一间一间的窗）
    ctx.strokeStyle = css(dim(body, 0.72), 2, 0.22);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let y = top - sh - 0.035 * tu; y > top - hH + 0.02 * tu; y -= 0.035 * tu) { ctx.moveTo(hx0, y); ctx.lineTo(hx1, y); }
    ctx.stroke();
    ctx.strokeStyle = css(dim(body, 0.8), 2, 0.4);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath();
    for (let i = 0; i <= 9; i++) { const px = lerp(hx0 + 0.045 * tu, hx1 - 0.015 * tu, i / 9); ctx.moveTo(px, top - sh); ctx.lineTo(px, top - hH * (1 - ruin * 0.6)); }
    ctx.stroke();
    // 檐：一道挑出的檐口，檐下一线阴影，檐上一线金
    const rk = sm(0.6, 0.78, b) * (1 - sm(0.05, 0.3, ruin));
    if (rk > 0.01) {
      ctx.globalAlpha = rk;
      ctx.fillStyle = css(dim(body, 0.62), 2, 0.6);
      ctx.fillRect(hx0, top - hH, hx1 - hx0, 0.012 * tu);
      ctx.fillStyle = css(mix(lit(LIME), SOOT, soot), 2, null, 0.05);
      ctx.fillRect(hx0 - 0.006 * tu, top - hH - 0.024 * tu, hx1 - hx0 + 0.012 * tu, 0.026 * tu);
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12);
      ctx.fillRect(hx0 - 0.006 * tu, top - hH - 0.03 * tu, hx1 - hx0 + 0.012 * tu, 0.007 * tu);
      ctx.globalAlpha = 1;
    }
    // ── 廊子（高耸的门楼，里面贴上精金）──
    const px0 = x0, px1 = x0 + 0.24 * tu;
    const gp = ctx.createLinearGradient(px0, 0, px1, 0);
    gp.addColorStop(0, sl ? css(lit(body), 2, null, 0.06) : cDark); gp.addColorStop(1, sl ? cBody : css(lit(body), 2, null, 0.04));
    ctx.fillStyle = gp;
    ctx.beginPath();
    if (ruin > 0.05) {
      ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.01 * tu, top - hP * (1 - 0.3 * ruin)); ctx.lineTo(px0 + 0.07 * tu, top - hP * (1 - 0.1 * ruin));
      ctx.lineTo(px0 + 0.13 * tu, top - hP * (1 - 0.5 * ruin)); ctx.lineTo(px1 - 0.03 * tu, top - hP * (1 - 0.2 * ruin)); ctx.lineTo(px1, top - hP * 0.55); ctx.lineTo(px1, top);
      ctx.closePath();
    } else {
      ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.008 * tu, top - hP); ctx.lineTo(px1 - 0.008 * tu, top - hP); ctx.lineTo(px1, top); ctx.closePath();
    }
    ctx.fill();
    // 廊的石层、两道金带、挑出的檐
    ctx.strokeStyle = css(dim(body, 0.72), 2, 0.22);
    ctx.lineWidth = Math.max(0.5, 0.55 * un);
    ctx.beginPath();
    for (let y = top - 0.04 * tu; y > top - hP * 0.98; y -= 0.04 * tu) { ctx.moveTo(px0 + 0.004 * tu, y); ctx.lineTo(px1 - 0.004 * tu, y); }
    ctx.stroke();
    if (rk > 0.01) {
      ctx.globalAlpha = rk;
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12);
      ctx.fillRect(px0 + 0.004 * tu, top - hP * 0.62, px1 - px0 - 0.008 * tu, 0.008 * tu);
      ctx.fillStyle = css(dim(body, 0.62), 2, 0.6);
      ctx.fillRect(px0, top - hP, px1 - px0, 0.012 * tu);
      ctx.fillStyle = css(mix(lit(LIME), SOOT, soot), 2, null, 0.05);
      ctx.fillRect(px0 - 0.012 * tu, top - hP - 0.028 * tu, px1 - px0 + 0.024 * tu, 0.03 * tu);
      ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.14);
      ctx.fillRect(px0 - 0.012 * tu, top - hP - 0.036 * tu, px1 - px0 + 0.024 * tu, 0.008 * tu);
      ctx.globalAlpha = 1;
    }
    // 门：金门框，开着时里面是灯台的光；封锁时是深色的门扇
    const dw = 0.1 * tu, dh = 0.32 * tu * t.vk, dx = (px0 + px1) / 2;
    const gk = sm(0.78, 0.95, b) * (1 - ruin);
    ctx.fillStyle = css(dim(body, 0.7), 2);
    ctx.fillRect(dx - dw / 2 - 0.03 * tu, top - dh - 0.04 * tu, dw + 0.06 * tu, dh + 0.04 * tu);
    ctx.fillStyle = css(mix(GOLD, SOOT, soot), 2, null, 0.12 * gk);
    ctx.fillRect(dx - dw / 2 - 0.014 * tu, top - dh - 0.02 * tu, dw + 0.028 * tu, dh + 0.02 * tu);
    const inner = clamp(door * (0.35 + 0.65 * Math.max(gl, nightK() * 0.8)), 0, 1) * (1 - ruin);
    ctx.fillStyle = ruin > 0.4 ? css([30, 24, 20], 2) : U.rgba(lerp(40, 255, inner), lerp(30, 206, inner), lerp(24, 120, inner), 1);
    ctx.fillRect(dx - dw / 2, top - dh, dw, dh);
    if (door < 0.98 && ruin < 0.4) {   // 门扇
      const cw = (dw / 2) * (1 - door);
      ctx.fillStyle = css(mix([120, 84, 52], GOLD, 0.35 * gk), 2);
      ctx.fillRect(dx - dw / 2, top - dh, cw, dh);
      ctx.fillRect(dx + dw / 2 - cw, top - dh, cw, dh);
      ctx.strokeStyle = css(GOLD, 2, 0.6 * gk);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.beginPath(); ctx.moveTo(dx - dw / 2 + cw, top - dh); ctx.lineTo(dx - dw / 2 + cw, top); ctx.moveTo(dx + dw / 2 - cw, top - dh); ctx.lineTo(dx + dw / 2 - cw, top); ctx.stroke();
      // 封锁（代下 28:24）：门上横着一道黑的门闩
      const seal = 1 - sm(0.2, 0.6, door);
      if (seal > 0.01) {
        ctx.fillStyle = css([34, 26, 22], 2, seal);
        ctx.fillRect(dx - dw * 0.72, top - dh * 0.52, dw * 1.44, Math.max(2, 0.018 * tu));
        ctx.fillRect(dx - dw * 0.72, top - dh * 0.3, dw * 1.44, Math.max(2, 0.018 * tu));
      }
    }
    // 迎光的边
    ctx.strokeStyle = cRim; ctx.lineWidth = Math.max(0.8, 1.3 * un);
    ctx.beginPath();
    if (sl) { ctx.moveTo(px0, top); ctx.lineTo(px0 + 0.008 * tu, top - hP); ctx.lineTo(px1, top - hP); ctx.moveTo(px1, top - hH); ctx.lineTo(hx1, top - hH); }
    else { ctx.moveTo(hx1, top); ctx.lineTo(hx1, top - hH); ctx.lineTo(px1, top - hH); ctx.moveTo(px1, top - hP); ctx.lineTo(px0, top - hP); }
    ctx.stroke();
    ctx.restore();
    // 脚手架（建造时）
    const sc = sm(0.08, 0.2, b) * (1 - sm(0.84, 0.97, b));
    if (sc > 0.01) {
      const yT = top - Math.max(hH, hP) * wk;
      ctx.globalAlpha = sc * 0.75;
      ctx.strokeStyle = css([96, 72, 50], 2);
      ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath();
      const xs = [];
      for (let i = 0; i <= 5; i++) xs.push(lerp(x0 - 0.03 * tu, x0 + 1.02 * tu, i / 5));
      for (const x of xs) { ctx.moveTo(x, top); ctx.lineTo(x, yT - 0.06 * tu); }
      for (let y = top - 0.12 * tu; y > yT - 0.05 * tu; y -= 0.12 * tu) { ctx.moveTo(xs[0], y); ctx.lineTo(xs[xs.length - 1], y); }
      for (let i = 0; i < xs.length - 1; i += 2) { ctx.moveTo(xs[i], top - 0.12 * tu); ctx.lineTo(xs[i + 1], Math.max(yT, top - 0.24 * tu)); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // ── 雅斤与波阿斯 ──
    const pl = sm(0.84, 1, b);
    if (pl > 0.01) drawPillars(ctx, t, pl, ruin, soot);
    // 残垣断壁：殿台上与台前的乱石
    if (ruin > 0.2) {
      const rr = sm(0.2, 0.8, ruin);
      ctx.fillStyle = css(mix(LIME_D, SOOT, 0.45), 2);
      ctx.beginPath();
      for (let i = 0; i < 18; i++) {
        const x = lerp(x0 - 0.05 * tu, x0 + 1.0 * tu, U.hash1(i * 7 + 2)), r0 = 0.035 * tu * (0.5 + U.hash1(i + 9)) * rr;
        ctx.moveTo(x + r0, top + 1); ctx.ellipse(x, top + 1, r0, r0 * 0.7, 0, Math.PI, 0, false);
      }
      for (let i = 0; i < 9; i++) {
        const x = lerp(x0 - 0.35 * tu, x0 + 1.05 * tu, U.hash1(i * 11 + 5)), g = gY(2, x / W.w) + 2 * un, bw = 0.03 * tu * (0.6 + U.hash1(i + 3)) * rr;
        ctx.save(); ctx.translate(x, g - bw * 0.3); ctx.rotate((U.hash1(i + 17) - 0.5) * 0.8); ctx.rect(-bw, -bw * 0.5, bw * 2, bw); ctx.restore();
      }
      ctx.fill();
      ctx.strokeStyle = css(dim(LIME_D, 0.5), 2, 0.5 * rr);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.stroke();
    }
    // 废墟上的草木
    if (wild > 0.02) {
      ctx.fillStyle = css([88, 126, 66], 2, 0.8 * wild);
      ctx.beginPath();
      for (let i = 0; i < 14; i++) {
        const x = lerp(x0 - 0.06 * tu, x0 + 1.02 * tu, i / 13), hh = 0.04 * tu * (0.5 + U.hash1(i + 3)) * wild;
        ctx.moveTo(x - 0.05 * tu, top + 1); ctx.quadraticCurveTo(x, top - hh * 2, x + 0.05 * tu, top + 1);
      }
      ctx.fill();
      ctx.strokeStyle = css([76, 110, 58], 2, 0.8 * wild);
      ctx.lineWidth = Math.max(0.6, 0.9 * un);
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const x = lerp(hx0 + 0.05 * tu, hx1 - 0.05 * tu, i / 8), h0 = top - hH * 0.5 * U.hash1(i + 11);
        ctx.moveTo(x, top); ctx.bezierCurveTo(x + 0.02 * tu, lerp(top, h0, 0.4), x - 0.02 * tu, lerp(top, h0, 0.7), x + 0.01 * tu, lerp(top, h0, wild));
      }
      ctx.stroke();
      // 花
      const cols = ['#f4d35e', '#e86a92', '#f6f1e7', '#9a7fe0'];
      for (let i = 0; i < 16; i++) {
        const x = lerp(x0 - 0.3 * tu, x0 + 1.02 * tu, U.hash1(i * 5 + 1)), y = gY(2, x / W.w) + PH(2) * (0.02 + 0.2 * U.hash1(i * 3 + 2));
        ctx.globalAlpha = clamp(wild * 1.4 - 0.4, 0, 1) * (0.4 + 0.6 * W.daylight);
        ctx.fillStyle = cols[i % 4];
        ctx.beginPath(); ctx.arc(x, y, 1.3 * un, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }
  function drawPillars(ctx, t, pl, ruin, soot) {
    const tu = t.tu, un = W.unit, H = 0.45 * tu * t.vk * pl;
    const col = mix([184, 124, 62], SOOT, soot * 0.8), capC = mix([226, 178, 92], SOOT, soot * 0.8), goldC = mix(GOLD, SOOT, soot * 0.8);
    const rimC = css(lit(col), 2, rimA(), 0.18), sl = sunLeft();
    // 波阿斯（左边的，侧看在后）· 雅斤（右边的，侧看在前）：一前一后，都立在殿台上、廊前
    const P = [[t.x0 - 0.035 * tu, 0.03 * tu, 0.9], [t.x0 - 0.105 * tu, 0, 1]];
    for (const [px, dy, k] of P) {
      const y0 = t.top - dy, w = 0.045 * tu * k, h = H * (ruin > 0.3 ? 0.35 + 0.3 * (k - 0.9) * 4 : 1);
      const back = (1 - k) * 1.2;
      // 柱身：一侧迎光的铜柱（暖的铜金色）
      const cL = css(mix(lit(goldC), [40, 30, 26], back), 2, null, 0.1), cM = css(mix(col, [40, 30, 26], back), 2, null, 0.03), cD = css(mix(dim(col, 0.6), [40, 30, 26], back), 2);
      const g = ctx.createLinearGradient(px - w / 2, 0, px + w / 2, 0);
      g.addColorStop(0, sl ? cL : cD); g.addColorStop(0.3, sl ? cM : cD); g.addColorStop(0.7, sl ? cD : cM); g.addColorStop(1, sl ? cD : cL);
      ctx.fillStyle = g;
      ctx.fillRect(px - w / 2, y0 - h, w, h + 1);
      // 柱础
      ctx.fillStyle = css(mix(dim(col, 0.8), [40, 30, 26], back), 2);
      ctx.fillRect(px - w * 0.72, y0 - 0.014 * tu, w * 1.44, 0.014 * tu + 1);
      if (ruin < 0.3) {
        // 柱顶：百合花样的碗（3:15），其下一圈链索与两行石榴（3:16）
        const cy = y0 - h, cw = w * 1.9, ch = 0.06 * tu * k;
        ctx.fillStyle = css(mix(capC, [40, 30, 26], back), 2, null, 0.12);
        ctx.beginPath();
        ctx.moveTo(px - w / 2, cy + 1); ctx.quadraticCurveTo(px - cw * 0.56, cy - ch * 0.35, px - cw * 0.5, cy - ch);
        ctx.quadraticCurveTo(px - cw * 0.3, cy - ch * 0.82, px - cw * 0.16, cy - ch * 1.12);
        ctx.quadraticCurveTo(px, cy - ch * 0.86, px + cw * 0.16, cy - ch * 1.12);
        ctx.quadraticCurveTo(px + cw * 0.3, cy - ch * 0.82, px + cw * 0.5, cy - ch);
        ctx.quadraticCurveTo(px + cw * 0.56, cy - ch * 0.35, px + w / 2, cy + 1); ctx.closePath();
        ctx.fill();
        // 百合的瓣
        ctx.strokeStyle = css(dim(capC, 0.55), 2, 0.7 * k);
        ctx.lineWidth = Math.max(0.5, 0.6 * un);
        ctx.beginPath();
        for (let i = 1; i < 4; i++) { ctx.moveTo(px - cw * 0.46 + i * cw * 0.23, cy - ch * 0.12); ctx.quadraticCurveTo(px - cw * 0.5 + i * cw * 0.23, cy - ch * 0.55, px - cw * 0.46 + i * cw * 0.23 + cw * 0.07, cy - ch * 0.8); }
        ctx.stroke();
        // 链索：柱头下一道交错的金线
        const by = cy + 0.022 * tu, bh = 0.02 * tu;
        ctx.strokeStyle = css(mix(goldC, [40, 30, 26], back), 2, 0.85, 0.12);
        ctx.lineWidth = Math.max(0.6, 0.7 * un);
        ctx.beginPath();
        const nz = 5;
        for (let i = 0; i <= nz; i++) { const x = px - w / 2 + (w * i) / nz, y = i % 2 ? by + bh : by; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        for (let i = 0; i <= nz; i++) { const x = px - w / 2 + (w * i) / nz, y = i % 2 ? by : by + bh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
        // 两行石榴
        ctx.fillStyle = css(mix([196, 64, 60], SOOT, soot), 2, 0.95, 0.06);
        ctx.beginPath();
        const r = Math.max(1, 0.0085 * tu);
        for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) {
          const cx = px - w * 0.42 + (i + row * 0.5) * w * 0.28, cyy = by + bh + r * 1.3 + row * r * 2.1;
          if (cx > px + w * 0.5) continue;
          ctx.moveTo(cx + r, cyy); ctx.arc(cx, cyy, r, 0, TAU);
        }
        ctx.fill();
      }
      ctx.strokeStyle = rimC; ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath(); const ex = sl ? px - w / 2 : px + w / 2; ctx.moveTo(ex, y0); ctx.lineTo(ex, y0 - h); ctx.stroke();
    }
  }
  // 铜坛（4:1）：方的，四角有角；坛东有上去的斜坡
  function altarGeom() {
    const tu = TU(), x = altX() * W.w, g = gY(2, altX()) + 2 * W.unit;
    return { x, g, w: 0.22 * tu, h: 0.13 * tu, tu };
  }
  function drawAltar(ctx) {
    const k = lv('chAltar'), ruin = lv('chRuin');
    if (k < 0.01) return;
    const A = altarGeom(), un = W.unit, col = mix(BRONZE, SOOT, ruin * 0.6);
    const h = A.h * U.easeOut(k) * (1 - ruin * 0.4);
    ctx.fillStyle = css(col, 2);
    ctx.beginPath();
    ctx.rect(A.x - A.w / 2, A.g - h, A.w, h);
    // 坛东的斜坡
    ctx.moveTo(A.x - A.w / 2, A.g - h * 0.72); ctx.lineTo(A.x - A.w * 1.02, A.g); ctx.lineTo(A.x - A.w / 2, A.g); ctx.closePath();
    ctx.fill();
    // 四角的角
    if (ruin < 0.5) {
      ctx.beginPath();
      for (const s of [-1, 1]) { const cx = A.x + s * (A.w / 2 - 0.009 * A.tu); ctx.moveTo(cx - 0.012 * A.tu, A.g - h); ctx.quadraticCurveTo(cx - 0.002 * A.tu, A.g - h - 0.02 * A.tu, cx + s * 0.006 * A.tu, A.g - h - 0.03 * A.tu); ctx.lineTo(cx + 0.012 * A.tu, A.g - h); }
      ctx.fill();
    }
    // 铜网与环
    ctx.strokeStyle = css(dim(col, 0.6), 2, 0.7);
    ctx.lineWidth = Math.max(0.5, 0.7 * un);
    ctx.beginPath();
    ctx.moveTo(A.x - A.w / 2, A.g - h * 0.5); ctx.lineTo(A.x + A.w / 2, A.g - h * 0.5);
    for (let i = 1; i < 6; i++) { const x = A.x - A.w / 2 + A.w * i / 6; ctx.moveTo(x, A.g - h * 0.5); ctx.lineTo(x, A.g); }
    ctx.stroke();
    ctx.strokeStyle = css(lit(col), 2, rimA(), 0.2);
    ctx.lineWidth = Math.max(0.7, 1.1 * un);
    ctx.beginPath(); ctx.moveTo(A.x - A.w / 2, A.g - h); ctx.lineTo(A.x + A.w / 2, A.g - h); ctx.stroke();
    const f = lv('chFire');
    if (f > 0.01) {
      smoke(ctx, A.x, A.g - h - 0.02 * A.tu, Math.min(1, f) * k, W.h * 0.25 + 0.6 * A.tu, 0.03 * A.tu, 3, false, 0.07);
      flame(ctx, A.x, A.g - h + 1, 0.12 * A.tu * (0.55 + 0.45 * Math.min(1.6, f)), Math.min(1, f) * k, 3, A.w * 0.36);
    }
  }
  // 大卫在禾场上筑的坛（石坛）
  function drawDAltar(ctx) {
    const k = lv('chDAltar');
    if (k < 0.01) return;
    const A = altarGeom(), un = W.unit, s = A.tu * 0.012;
    const n = 9, shown = k * n;
    ctx.fillStyle = css([140, 128, 110], 2);
    ctx.beginPath();
    const R = U.mulberry32(77);
    for (let i = 0; i < n && i < shown; i++) {
      const row = i < 4 ? 0 : i < 7 ? 1 : 2, idx = row === 0 ? i : row === 1 ? i - 4 : i - 7, cnt = [4, 3, 2][row];
      const cx = A.x + (idx - (cnt - 1) / 2) * 4.6 * s + (R() - 0.5) * s, cy = A.g - 1.6 * s - row * 3.2 * s, kk = clamp(shown - i, 0, 1);
      ctx.moveTo(cx + 2.6 * s, cy); ctx.ellipse(cx, cy, 2.6 * s, 1.9 * s * kk, (R() - 0.5) * 0.4, 0, TAU);
    }
    ctx.fill();
    const f = lv('chDFire');
    if (f > 0.01) {
      const top = A.g - 9.5 * s;
      smoke(ctx, A.x, top - 4 * s, f * k, W.h * 0.22, 5 * s, 11, false, 0.07);
      flame(ctx, A.x, top + 2 * s, 11 * s * (0.8 + 0.4 * Math.min(1.5, f)), Math.min(1, f) * k, 11, 6 * s);
    }
  }
  // 铜海（4:2–5）：圆的，边如百合花，立在十二只铜牛上
  function drawSea(ctx) {
    const k = lv('chSea'), ruin = lv('chRuin');
    if (k < 0.01 || ruin > 0.9) return;
    const t = temple(), x = seaX() * W.w, g = gY(2, seaX()) + 3 * W.unit, tu = t.tu, un = W.unit;
    const col = mix([160, 104, 60], SOOT, ruin * 0.6), a = k * (1 - sm(0.5, 0.9, ruin)), sl = sunLeft();
    const bw = 0.18 * tu, bh = 0.07 * tu, ob = 0.042 * tu, rimY = g - ob - bh;
    ctx.globalAlpha = a;
    // 铜牛：头朝外，一行站着（侧看只见一半）
    ctx.fillStyle = css(dim(col, 0.72), 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const ox = x - bw * 0.36 + i * bw * 0.18, f = i < 2 ? -1 : i > 2 ? 1 : (i % 2 ? 1 : -1);
      const bx = ob * 0.55, by = ob * 0.3;
      ctx.moveTo(ox + bx, g - ob * 0.62); ctx.ellipse(ox, g - ob * 0.62, bx, by, 0, 0, TAU);
      ctx.moveTo(ox + f * bx * 1.3 + ob * 0.16, g - ob * 0.75); ctx.ellipse(ox + f * bx * 1.3, g - ob * 0.75, ob * 0.16, ob * 0.13, 0, 0, TAU);
      for (const lx of [-0.6, -0.25, 0.25, 0.6]) ctx.rect(ox + lx * bx - 0.3 * un, g - ob * 0.4, Math.max(0.8, 0.004 * tu), ob * 0.4);
    }
    ctx.fill();
    // 碗：深而圆
    const gr = ctx.createLinearGradient(x - bw / 2, 0, x + bw / 2, 0);
    gr.addColorStop(0, css(sl ? lit(col) : dim(col, 0.7), 2, null, 0.06)); gr.addColorStop(0.5, css(col, 2)); gr.addColorStop(1, css(sl ? dim(col, 0.7) : lit(col), 2, null, 0.06));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x - bw / 2, rimY);
    ctx.bezierCurveTo(x - bw * 0.48, rimY + bh * 0.9, x - bw * 0.22, g - ob + 1, x, g - ob + 1);
    ctx.bezierCurveTo(x + bw * 0.22, g - ob + 1, x + bw * 0.48, rimY + bh * 0.9, x + bw / 2, rimY);
    ctx.closePath(); ctx.fill();
    // 碗边（向外翻，如百合花）与一圈瓜样的饰纹（4:3）
    ctx.fillStyle = css(lit(col), 2, null, 0.12);
    ctx.beginPath(); ctx.ellipse(x, rimY, bw * 0.54, Math.max(1.2, 0.012 * tu), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css(dim(col, 0.6), 2, 0.7);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const cx = x - bw * 0.4 + i * bw * 0.1, r = Math.max(0.7, 0.005 * tu); ctx.moveTo(cx + r, rimY + bh * 0.28); ctx.arc(cx, rimY + bh * 0.28, r, 0, TAU); }
    ctx.fill();
    // 水面的反光
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(220, 236, 255, 0.25 * (0.3 + 0.7 * W.daylight));
    ctx.beginPath(); ctx.ellipse(x, rimY - 0.3 * un, bw * 0.46, Math.max(0.8, 0.006 * tu), 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 所罗门的铜台（6:13）：在院中、坛前（前景稍靠前一些，好让跪在台上举手的所罗门在火光前看得清）
  const platG = () => Math.max(gY(2, X('plat')), rowY(X('platK'))) + 2 * W.unit;
  function drawPlatform(ctx) {
    const k = lv('chPlat');
    if (k < 0.01) return;
    const x = X('plat') * W.w, g = platG(), w = PH(2) * 1.05 * PK(), h = PH(2) * 0.2 * PK();
    ctx.globalAlpha = k;
    ctx.fillStyle = css(BRONZE, 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css(dim(BRONZE, 0.7), 2);
    for (const s of [-1, 1]) ctx.fillRect(x + s * w * 0.42 - w * 0.05, g - h * 0.7, w * 0.1, h * 0.7 + 1);
    ctx.fillStyle = css(lit(BRONZE), 2, rimA(), 0.2);
    ctx.fillRect(x - w / 2, g - h, w, Math.max(1, W.unit));
    ctx.globalAlpha = 1;
  }
  // 站在铜台上的人，脚下的高度
  const platY = () => platG() - PH(2) * 0.2 * PK();

  // ── 火与烟 ──
  function flame(ctx, x, y, h, k, seed, wBase) {
    if (k < 0.01) return;
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 4.5, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.3, 0.7, 'rgb(255,160,64)', 0.75], [0.28, 0.74, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    const wb = wBase || h * 0.3;
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = Math.max(h * 0.26 * q[1], wb * q[1] * 0.5);
      const sx = x + q[0] * wb + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
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
  function smoke(ctx, x, y, k, H, w, seed, dark, rate) {
    if (k < 0.01) return;
    sprites();
    const N = 12, day = 0.3 + 0.7 * W.daylight, spr = dark ? SP.soot : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.08) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.6 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  地上的布景：禾场、约柜暂住之家、帐幕、材料、样式、银柜、堆垒
  // ════════════════════════════════════════════════════════════
  function drawFloor(ctx) {
    const k = lv('chFloor');
    if (k < 0.01) return;
    const x = altX() * W.w, g = gY(2, altX()) + 3 * W.unit, rx = TU() * 0.2, ry = PH(2) * 0.1, b = lv('chBuild');
    ctx.globalAlpha = k * (1 - 0.6 * sm(0.3, 1, b));
    ctx.fillStyle = css([196, 168, 120], 2);
    ctx.beginPath(); ctx.ellipse(x, g, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([150, 124, 88], 2, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.8 * W.unit);
    ctx.beginPath(); ctx.ellipse(x, g, rx * 0.7, ry * 0.62, 0, 0, TAU); ctx.stroke();
    // 麦堆（还没有筑坛时）
    const wheat = k * (1 - lv('chDAltar')) * (1 - sm(0.05, 0.3, b));
    if (wheat > 0.01) {
      ctx.globalAlpha = wheat;
      ctx.fillStyle = css([222, 186, 110], 2);
      const hx = x + rx * 0.55;
      ctx.beginPath(); ctx.moveTo(hx - rx * 0.28, g); ctx.quadraticCurveTo(hx, g - PH(2) * 0.55, hx + rx * 0.28, g); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawObed(ctx) {
    const k = lv('chObed');
    if (k < 0.01) return;
    const xf = X('obed'), x = xf * W.w, g = gY(2, xf) + 2 * W.unit, hm = PH(2), w = hm * 1.5, h = hm * 1.05;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([190, 170, 136], 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css([150, 128, 96], 2);
    ctx.fillRect(x - w / 2 - 2 * W.unit, g - h - 3 * W.unit, w + 4 * W.unit, 3 * W.unit);
    ctx.fillStyle = css(HOLE, 2);
    ctx.fillRect(x + w * 0.1, g - h * 0.55, w * 0.18, h * 0.55);
    if (W.night > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 196, 120, 0.7 * W.night);
      ctx.fillRect(x + w * 0.1, g - h * 0.55, w * 0.18, h * 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.strokeStyle = css(lit([190, 170, 136]), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, W.unit);
    ctx.beginPath(); ctx.moveTo(sunLeft() ? x - w / 2 : x + w / 2, g); ctx.lineTo(sunLeft() ? x - w / 2 : x + w / 2, g - h); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 大卫所搭的帐幕（代上 16:1）：幔子的蓝、紫、朱红。帐底沿着地（各角落在地上），绳子拴在地上
  function drawTent(ctx) {
    const k = lv('chTent');
    if (k < 0.01) return;
    const xf = X('tent'), x = xf * W.w, hm = PH(2) * PK(), w = hm * 1.9, h = hm * 1.15, un = W.unit;
    const gA = gY(2, (x - w / 2) / W.w) + 2 * un, gB = gY(2, (x + w / 2) / W.w) + 2 * un, gC = gY(2, xf) + 2 * un;
    const top = Math.min(gA, gB, gC);
    ctx.globalAlpha = k;
    ctx.strokeStyle = css([110, 92, 70], 2, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.8 * un);
    ctx.beginPath();
    for (const s of [-1, 1]) {
      const ex = x + s * w * 0.85, ey = gY(2, ex / W.w) + 2 * un;
      ctx.moveTo(x + s * w / 2, top - h * 0.9); ctx.lineTo(ex, ey);
      ctx.moveTo(ex - 2 * un, ey); ctx.lineTo(ex + 2 * un, ey);
    }
    ctx.stroke();
    ctx.fillStyle = css([226, 216, 196], 2);
    ctx.beginPath(); ctx.moveTo(x - w / 2, gA + 1); ctx.lineTo(x - w / 2, top - h * 0.86); ctx.lineTo(x, top - h); ctx.lineTo(x + w / 2, top - h * 0.86); ctx.lineTo(x + w / 2, gB + 1); ctx.lineTo(x, gC + 1); ctx.closePath(); ctx.fill();
    const bands = [[70, 88, 150], [110, 70, 128], [176, 60, 60]];
    bands.forEach((c, i) => { ctx.fillStyle = css(c, 2); ctx.fillRect(x - w / 2, top - h * (0.6 - i * 0.07), w, h * 0.06); });
    // 门帘；里面约柜的光
    const inner = S.ark === 'tent' ? 1 : 0;
    ctx.fillStyle = inner ? U.rgba(255, 214, 140, 0.9) : css([60, 46, 38], 2);
    ctx.fillRect(x - w * 0.1, top - h * 0.55, w * 0.2, gC - top + h * 0.55);
    if (inner) {
      sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, top - h * 0.3, hm * 2.2, k * (0.3 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 建殿的材料（代上 22:2–5，14）
  const MAT = (function () {
    const r = U.mulberry32(5101), out = [];
    const kinds = ['stone', 'stone', 'cedar', 'stone', 'bronze', 'cedar', 'iron', 'gold', 'stone', 'silver', 'cedar', 'gold', 'stone', 'bronze'];
    kinds.forEach((kd, i) => out.push({ kd, u: 0.02 + i * 0.072 + (r() - 0.5) * 0.02, th: i / kinds.length * 0.9, s: 0.8 + r() * 0.4, seed: r() * 100 }));
    return out;
  })();
  function drawMaterials(ctx) {
    const k = lv('chMat'), b = lv('chBuild');
    const a = 1 - sm(0.12, 0.55, b);
    if (k < 0.01 || a < 0.01) return;
    const t = temple(), tu = t.tu, un = W.unit;
    for (const m of MAT) {
      const v = clamp((k - m.th) / 0.1, 0, 1);
      if (v <= 0) continue;
      const x = t.x0 + m.u * tu, g = gY(2, x / W.w) + 2 * un, s = 0.028 * tu * m.s;
      ctx.globalAlpha = v * a;
      if (m.kd === 'stone') {
        ctx.fillStyle = css([214, 200, 170], 2);
        ctx.fillRect(x - s * 1.5, g - s, s * 3, s); ctx.fillRect(x - s, g - s * 2, s * 2, s * 1.02);
        ctx.strokeStyle = css([160, 146, 118], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.6 * un);
        ctx.strokeRect(x - s * 1.5, g - s, s * 3, s);
      } else if (m.kd === 'cedar') {
        ctx.fillStyle = css(CEDAR, 2);
        for (let j = 0; j < 3; j++) ctx.fillRect(x - s * 1.8 + j * s * 0.3, g - s * 0.7 * (j + 1), s * 3.2, s * 0.64);
        ctx.fillStyle = css([176, 130, 88], 2);
        for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(x - s * 1.8 + j * s * 0.3, g - s * 0.7 * (j + 0.5), s * 0.32, 0, TAU); ctx.fill(); }
      } else {
        const col = m.kd === 'gold' ? [236, 196, 96] : m.kd === 'silver' ? [214, 220, 228] : m.kd === 'bronze' ? BRONZE : [96, 96, 104];
        ctx.fillStyle = css(col, 2, null, m.kd === 'gold' ? 0.15 : 0.05);
        ctx.beginPath(); ctx.moveTo(x - s * 1.3, g); ctx.quadraticCurveTo(x, g - s * 2, x + s * 1.3, g); ctx.closePath(); ctx.fill();
        if (m.kd === 'gold' || m.kd === 'silver') {
          const tw = 0.5 + 0.5 * Math.sin(W.t * 3 + m.seed);
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = m.kd === 'gold' ? 'rgb(255, 236, 170)' : 'rgb(240, 244, 255)';
          ctx.globalAlpha = v * a * tw * 0.8;
          ctx.fillRect(x - s * 0.3 + Math.sin(m.seed) * s * 0.4, g - s * 0.9, 1.6 * un, 1.6 * un);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  // 样式：殿的轮廓，由金线一笔一笔写出（代上 28:19）
  function planPaths() {
    const t = temple(), tu = t.tu, x0 = t.x0, top = t.top, A = altarGeom(), hH = t.hH, hP = t.hP;
    const P = [];
    // 殿台与台阶
    P.push([[x0 - PD * tu, t.base], [x0 - PD * tu, top], [x0 + 1.03 * tu, top], [x0 + 1.03 * tu, t.base]]);
    const st = [];
    for (let i = 0; i <= 6; i++) { const y = lerp(t.base, top, i / 6), x = lerp(x0 - STP * tu, x0 - PD * tu, i / 6); st.push([x, y]); if (i < 6) st.push([x, lerp(t.base, top, (i + 1) / 6)]); }
    P.push(st);
    // 廊子（高一百二十肘）与檐
    P.push([[x0, top], [x0 + 0.008 * tu, top - hP], [x0 + 0.232 * tu, top - hP], [x0 + 0.24 * tu, top]]);
    P.push([[x0 - 0.012 * tu, top - hP - 0.03 * tu], [x0 + 0.252 * tu, top - hP - 0.03 * tu]]);
    // 殿身：长六十肘；至圣所的幔子；三层旁屋
    P.push([[x0 + 0.24 * tu, top - hH], [x0 + tu, top - hH], [x0 + tu, top]]);
    P.push([[x0 + 0.24 * tu, top - hH - 0.024 * tu], [x0 + tu + 0.006 * tu, top - hH - 0.024 * tu]]);
    P.push([[x0 + 0.76 * tu, top], [x0 + 0.76 * tu, top - hH]]);
    const vk = t.vk;
    for (let j = 1; j <= 3; j++) P.push([[x0 + 0.24 * tu, top - 0.2 * tu * vk * j / 3], [x0 + 0.98 * tu, top - 0.2 * tu * vk * j / 3]]);
    // 窗
    for (let i = 0; i < 9; i++) { const wx = lerp(x0 + 0.29 * tu, x0 + 0.94 * tu, i / 8); P.push([[wx, top - hH * 0.84], [wx, top - hH * 0.64]]); }
    // 门
    P.push([[x0 + 0.07 * tu, top], [x0 + 0.07 * tu, top - 0.32 * tu * vk], [x0 + 0.17 * tu, top - 0.32 * tu * vk], [x0 + 0.17 * tu, top]]);
    // 两根柱子与柱顶
    for (const [px, dy, h] of [[x0 - 0.105 * tu, 0, 0.45], [x0 - 0.035 * tu, 0.03, 0.38]]) {
      const y0 = top - dy * tu, yt = y0 - h * tu * vk;
      P.push([[px, y0], [px, yt]]);
      P.push([[px - 0.032 * tu, yt - 0.05 * tu], [px - 0.016 * tu, yt], [px + 0.016 * tu, yt], [px + 0.032 * tu, yt - 0.05 * tu]]);
    }
    // 坛（长二十肘，宽二十肘，高十肘）
    P.push([[A.x - A.w * 1.02, A.g], [A.x - A.w / 2, A.g - A.h * 0.72], [A.x - A.w / 2, A.g - A.h], [A.x + A.w / 2, A.g - A.h], [A.x + A.w / 2, A.g]]);
    // 海（圆的）
    const sx = seaX() * W.w, sg = gY(2, seaX()) + 3 * W.unit, bw = 0.18 * tu, bh = 0.07 * tu, ob = 0.042 * tu, ry = sg - ob - bh;
    const bowl = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; bowl.push([sx - Math.cos(a) * bw / 2, ry + Math.sin(a) * bh]); }
    P.push(bowl);
    // 尺度：殿长的一道量线，两端有记
    const my = t.base + 0.035 * tu;
    P.push([[x0 + 0.24 * tu, my - 0.012 * tu], [x0 + 0.24 * tu, my + 0.012 * tu]]);
    P.push([[x0 + 0.24 * tu, my], [x0 + tu, my]]);
    P.push([[x0 + tu, my - 0.012 * tu], [x0 + tu, my + 0.012 * tu]]);
    let L = 0;
    for (const p of P) for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    return { P, L };
  }
  // 样式的位置：在空中（k = 1）时缩小，悬在殿山之上的天空里；k = 0 时原大，落在殿基上
  function planTf(P) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of P) for (const q of p) { if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1]; }
    const k = clamp(lv('chPlanSky'), 0, 1), bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
    const sc = Math.min(0.6, (tall() ? 0.72 : 0.4) * W.w / bw, 0.3 * W.h / bh);
    const t = temple(), hz = W.horizonY || W.h * 0.6;
    const bot = Math.min(hz - 0.03 * W.h, t.top - t.hP - 0.02 * W.h), top = Math.max(tall() ? 0.3 * W.h : 0.1 * W.h, bot - sc * bh);
    const cx = clamp((x0 + x1) / 2, 0.5 * W.w + sc * bw / 2, 0.97 * W.w - sc * bw / 2), cy = top + sc * bh / 2;
    const bcx = (x0 + x1) / 2, bcy = (y0 + y1) / 2;
    const f = (x, y) => [lerp(x, cx + (x - bcx) * sc, k), lerp(y, cy + (y - bcy) * sc, k)];
    return { f, k, cx, cy, w: sc * bw, h: sc * bh, bw, bh, bcx, bcy, box: [x0, y0, x1, y1] };
  }
  function drawPlan(ctx) {
    const a = lv('chPlanA'), prog = lv('chPlan');
    if (a < 0.01 || prog < 0.005) return;
    const { P, L } = planPaths(), un = Math.max(0.6, W.unit), T = planTf(P), f = T.f, k = T.k;
    const pulse = 0.9 + 0.1 * Math.sin(W.t * 2.2);
    // 空中的样式：一卷发光的图，先展开，金线再一笔一笔写在上面
    // 卷跟着样式一同落下（落下时渐大、渐淡）
    const zw = lerp(T.bw, T.w, k), zh = lerp(T.bh, T.h, k), zc = f(T.bcx, T.bcy);
    const u = clamp(prog * 7, 0, 1), sw = (zw * 1.2 + 16 * un) * u, sh = zh * 1.14 + 16 * un;
    const rx0 = zc[0] - sw / 2, ry0 = zc[1] - sh / 2;
    if (k > 0.02) {
      sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, zc[0], zc[1], Math.max(sw, sh) * 1.6, 0.22 * a * k);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = clamp(a * k * k, 0, 1);
      ctx.fillStyle = 'rgba(250, 238, 206, 0.6)';
      ctx.fillRect(rx0, ry0, sw, sh);
      ctx.strokeStyle = 'rgba(214, 170, 92, 0.55)'; ctx.lineWidth = Math.max(1, un);
      ctx.strokeRect(rx0 + 3 * un, ry0 + 3 * un, Math.max(0, sw - 6 * un), sh - 6 * un);
      // 两端的轴
      ctx.fillStyle = 'rgb(176, 128, 66)';
      const rw = 5 * un;
      ctx.fillRect(rx0 - rw, ry0 - 4 * un, rw, sh + 8 * un);
      ctx.fillRect(rx0 + sw, ry0 - 4 * un, rw, sh + 8 * un);
      ctx.globalAlpha = 1;
    }
    let left = prog * L;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const tip = [0, 0];
    const strokeAll = (rgb, wd, al) => {
      if (al < 0.004) return;
      ctx.strokeStyle = U.rgba(rgb[0], rgb[1], rgb[2], Math.min(1, al));
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      let rem = left;
      for (const p of P) {
        if (rem <= 0) break;
        let q = f(p[0][0], p[0][1]);
        ctx.moveTo(q[0], q[1]);
        for (let i = 1; i < p.length && rem > 0; i++) {
          const d = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
          if (d <= rem) { q = f(p[i][0], p[i][1]); rem -= d; }
          else { const g = rem / d; q = f(lerp(p[i - 1][0], p[i][0], g), lerp(p[i - 1][1], p[i][1], g)); rem = 0; }
          ctx.lineTo(q[0], q[1]); tip[0] = q[0]; tip[1] = q[1];
        }
      }
      ctx.stroke();
    };
    ctx.save();
    if (k > 0.5 && u < 1) { ctx.beginPath(); ctx.rect(rx0, ry0, sw, sh); ctx.clip(); }
    // 图上的线（在空中）：深一些的金，写在发光的卷上
    strokeAll([176, 118, 40], 1.6, 0.9 * a * k);
    // 光的线（落到殿基上时）：柔和的暖金与一层淡淡的光晕
    ctx.globalCompositeOperation = 'lighter';
    const g = a * (1 - 0.75 * k) * pulse;
    strokeAll([255, 220, 150], 8, 0.07 * g);
    strokeAll([255, 220, 150], 1.5, 0.5 * g);
    ctx.restore();
    // 笔尖的光
    ctx.globalCompositeOperation = 'lighter';
    if (prog < 0.999) { sprites(); glowAt(ctx, SP.gold, tip[0], tip[1], 30 * un, 0.9 * a); }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 「这就是耶和华神的殿」：殿基在地上显出（代上 22:1）
  function drawSite(ctx) {
    const k = lv('chSite');
    if (k < 0.01) return;
    const t = temple(), un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 224, 160, 0.4 * k);
    ctx.lineWidth = 2 * un;
    ctx.setLineDash([6 * un, 5 * un]);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const x = lerp(t.x0 - STP * t.tu, t.x0 + 1.03 * t.tu, i / 20), y = gY(2, x / W.w) + 1; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 银柜（代下 24:8–10）：放在殿门外（台阶前，稍靠前）
  const chestX = () => { const t = temple(); return (t.x0 - (STP + 0.05) * t.tu) / W.w; };
  function drawChest(ctx) {
    const k = lv('chChest');
    if (k < 0.01) return;
    const t = temple(), x = chestX() * W.w, g = Math.max(gY(2, chestX()), rowY(0.3)) + 2 * W.unit, w = PH(2) * 0.62 * PK(), h = PH(2) * 0.34 * PK();
    ctx.globalAlpha = k;
    ctx.fillStyle = css([128, 90, 56], 2);
    ctx.fillRect(x - w / 2, g - h, w, h + 1);
    ctx.fillStyle = css(GOLD, 2);
    ctx.fillRect(x - w / 2, g - h, w, Math.max(1, h * 0.14));
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.fillRect(x - w * 0.12, g - h - 0.5, w * 0.24, Math.max(1, h * 0.1));
    // 众人欢欢喜喜投入柜中的银子：从左边（众人那边）一点一点抛进柜里
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    const un = Math.max(0.6, W.unit);
    for (let i = 0; i < 9; i++) {
      const ph = U.fract(W.t * 0.42 + i * 0.37), sx = x - W.w * (0.05 + 0.12 * U.hash1(i * 7 + 1)), sy = g - PH(2) * 0.9;
      const px = lerp(sx, x, ph), py = lerp(sy, g - h, ph) - Math.sin(Math.PI * ph) * PH(2) * 0.9;
      const a = k * Math.min(1, ph * 5) * (1 - sm(0.85, 1, ph));
      glowAt(ctx, SP.silver, px, py, 10 * un, a * 0.7);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(240, 244, 252)';
      ctx.fillRect(px - un, py - un, 2 * un, 2 * un);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 堆垒（代下 31:6）
  function drawHeaps(ctx) {
    const k = lv('chHeaps');
    if (k < 0.01) return;
    const t = temple(), un = W.unit;
    const cols = [[224, 186, 104], [196, 150, 84], [168, 120, 70], [232, 200, 120]];
    for (let i = 0; i < 5; i++) {
      const xf = (t.x0 + (0.3 + i * 0.13) * t.tu) / W.w, x = xf * W.w, g = gY(2, xf) + 3 * un, w = PH(2) * (0.55 + 0.1 * (i % 2)), h = PH(2) * 0.5 * U.easeOut(clamp(k * 1.4 - i * 0.08, 0, 1));
      if (h < 1) continue;
      ctx.fillStyle = css(cols[i % 4], 2, null, 0.05);
      ctx.beginPath(); ctx.moveTo(x - w, g); ctx.quadraticCurveTo(x - w * 0.2, g - h * 1.4, x, g - h); ctx.quadraticCurveTo(x + w * 0.2, g - h * 1.4, x + w, g); ctx.closePath(); ctx.fill();
    }
  }
  // 城中各处拐角的坛（代下 28:24）：房顶上一座一座小石坛，暗红的火，黑烟
  function cornerHouses() {
    const L = cityLayout(), k = lv('chCity'), out = [];
    // 只取殿前露出来的那一段城（殿身后面的看不见）
    const hs = L.houses.filter(q => q.row === 0 && k >= q.th + 0.1 && q.xf < X('tx0') - 0.012).sort((a, b) => a.xf - b.xf);
    const n = Math.min(5, hs.length);
    for (let i = 0; i < n; i++) out.push(hs[Math.floor((i + 0.5) * hs.length / n)]);
    return out;
  }
  function drawCorners(ctx) {
    const k = lv('chCorner');
    if (k < 0.01) return;
    sprites();
    const hm = PH(1), un = W.unit, ruin = lv('chRuin');
    cornerHouses().forEach((hs, i) => {
      const x = hs.xf * W.w + (hs.dx - 0.5) * hs.wk * hm * 0.4, g = gY(1, hs.xf) - 0.18 * hm, top = g - hs.hk * hm * (1 - ruin * (0.35 + 0.5 * hs.ruin));
      const aw = hm * 0.34, ah = hm * 0.26 * k;
      ctx.fillStyle = css([118, 104, 92], 1, k);
      ctx.fillRect(x - aw / 2, top - ah, aw, ah + 1);
      ctx.fillStyle = css([80, 70, 64], 1, k);
      ctx.fillRect(x - aw * 0.6, top - ah - 1.2 * un, aw * 1.2, 1.4 * un);
      smoke(ctx, x, top - ah - hm * 0.2, k * 0.9, hm * 4.2, hm * 0.3, 20 + i, true, 0.08);
      flame(ctx, x, top - ah, hm * 0.42 * (0.8 + 0.2 * Math.sin(W.t * 5 + i)), k * 0.9, 20 + i, aw * 0.3);
    });
    ctx.globalAlpha = 1;
  }
  // 大块的径向光（预先画好，每帧只按大小与亮度贴上去）
  const RAD = {};
  function radSprite(key, stops) {
    if (RAD[key]) return RAD[key];
    const c = cnv(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const s of stops) gr.addColorStop(s[0], s[1]);
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return (RAD[key] = c);
  }
  // 焚烧时，城上的天被火映红
  function drawBurnSky(ctx) {
    const k = lv('chBurn');
    if (k < 0.01) return;
    const t = temple(), cx = (t.x0 + 0.2 * t.tu), cy = W.horizonY, R = W.w * 0.6;
    const f = 0.85 + 0.15 * Math.sin(W.t * 3.1) * Math.sin(W.t * 1.7);
    const spr = radSprite('burn', [[0, 'rgba(255, 110, 50, 1)'], [0.45, 'rgba(190, 60, 30, 0.4)'], [1, 'rgba(120, 30, 20, 0)']]);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W.w, cy + 6); ctx.clip();
    ctx.globalAlpha = clamp(0.45 * k * f, 0, 1);
    ctx.drawImage(spr, cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 焚烧（代下 36:19）：火落在还立着的房顶上，大小、形状不一，此起彼伏，火星上升，浓黑的烟；渐渐烧尽
  function burnHouses() {
    const L = cityLayout(), k = lv('chCity');
    return L.houses.filter(q => k >= q.th + 0.05 && U.hash1(q.xf * 331 + q.row * 7) < 0.5);
  }
  function drawBurn(ctx, pass) {
    const k = lv('chBurn');
    if (k < 0.01) return;
    sprites();
    if (pass === 'mid') {
      const hm = PH(1), ruin = lv('chRuin'), un = Math.max(0.6, W.unit);
      burnHouses().forEach((hs, i) => {
        const r1 = U.hash1(i * 3.7 + 1), r2 = U.hash1(i * 5.3 + 2);
        // 各处的火烧得有先有后：有的已经烧尽
        const life = clamp(k * (1.25 + 0.5 * r1) - 0.35 * r2, 0, 1);
        if (life < 0.02) return;
        const x = hs.xf * W.w + (r2 - 0.5) * hs.wk * hm * 0.5;
        const g = gY(1, hs.xf) + (hs.row ? 0.05 : -0.18) * hm;
        const top = g - hs.hk * hm * (1 - ruin * (0.35 + 0.5 * hs.ruin));
        const pulse = 0.65 + 0.35 * Math.sin(W.t * (0.9 + r1) + i * 2.3);
        if (i % 2 === 0) smoke(ctx, x, top - hm * 0.4, life, W.h * (0.22 + 0.16 * r1), hm * (0.7 + 0.6 * r2), 31 + i, true, 0.04 + 0.02 * r1);
        flame(ctx, x, top + hm * 0.12, hm * (0.45 + 0.75 * r1) * pulse * life, life, 31 + i, hm * (0.18 + 0.3 * r2));
        // 火星
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255, 190, 110)';
        for (let j = 0; j < 3; j++) {
          const ph = U.fract(W.t * (0.35 + 0.2 * U.hash1(i * 9 + j)) + U.hash1(i * 13 + j * 3));
          ctx.globalAlpha = life * (1 - ph) * 0.9;
          ctx.fillRect(x + Math.sin(ph * 5 + i + j) * hm * 0.3, top - ph * hm * 2.6, 1.5 * un, 1.5 * un);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      });
      return;
    }
    const t = temple(), tu = t.tu;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, t.x0 + 0.5 * tu, t.top - t.hH * 0.5, tu * 2.2, 0.35 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i++) {
      const x = t.x0 + (0.02 + i * 0.24) * tu, y = t.top - t.hH * (0.3 + 0.35 * U.hash1(i + 2));
      smoke(ctx, x, y - 0.12 * tu, k, W.h * 0.5, 0.13 * tu, 41 + i, true, 0.035);
    }
    // 火：大小不一，此起彼伏
    for (let i = 0; i < 11; i++) {
      const x = t.x0 + (-0.04 + i * 0.1 + 0.03 * U.hash1(i * 5)) * tu, y = t.top - t.hH * (0.12 + 0.6 * U.hash1(i + 2)) * (i % 3 ? 1 : 0.5);
      const pulse = 0.6 + 0.4 * Math.sin(W.t * (0.7 + U.hash1(i + 8)) + i * 2.3);
      const life = clamp(k * (1.2 + 0.5 * U.hash1(i * 7)) - 0.3 * U.hash1(i * 11), 0, 1);
      flame(ctx, x, y + 0.05 * tu, 0.16 * tu * (0.5 + 0.7 * U.hash1(i + 5)) * pulse * (0.4 + 0.6 * life), life * (0.55 + 0.45 * pulse), 41 + i, 0.05 * tu * (0.6 + U.hash1(i + 1)));
    }
  }

  // ════════════════════════════════════════════════════════════
  //  约柜：金的柜，施恩座上两个基路伯张着翅膀
  // ════════════════════════════════════════════════════════════
  function arkPos() {
    const m = S.ark;
    if (m === 'none' || m === 'tent' || m === 'in') return null;
    if (m === 'obed') { const xf = X('obed') - 0.035; return { x: xf * W.w, y: gY(2, xf) - PH(2) * 0.02, s: 1 }; }
    if (m === 'cart') {
      const c = fig('ch:cart');
      if (!c) return null;
      const xf = c.nx, y = (c._vis ? c._y : gY(2, xf)) - PH(2) * 0.42;
      return { x: xf * W.w, y, s: 1, a: c.alpha == null ? 1 : c.alpha };
    }
    if (m === 'poles') {
      let sx = 0, n = 0, sy = 0, al = 1;
      for (const id of S.bearers) {
        const p = fig(id);
        if (!p) continue;
        sx += p._vis ? p._x : p.nx * W.w; sy += p._vis ? p._y : gY(2, p.nx); n++;
        al = Math.min(al, p.alpha == null ? 1 : p.alpha);
      }
      if (!n) return null;
      return { x: sx / n, y: sy / n - PH(2) * 0.72, s: 1, a: al };
    }
    return null;
  }
  function drawArk(ctx) {
    const p = arkPos();
    if (!p) return;
    const u = PH(2) * 0.5 * p.s, x = p.x, y = p.y, un = W.unit, al = clamp(p.a == null ? 1 : p.a, 0, 1);
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - u * 0.3, u * 5, al * (0.3 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = al;
    // 杠
    if (S.ark === 'poles') {
      ctx.strokeStyle = css([150, 110, 56], 2);
      ctx.lineWidth = Math.max(1, 1.4 * un);
      ctx.beginPath(); ctx.moveTo(x - u * 2.4, y + u * 0.15); ctx.lineTo(x + u * 2.4, y + u * 0.15); ctx.stroke();
    }
    // 柜
    ctx.fillStyle = css([226, 182, 86], 2, null, 0.12);
    ctx.fillRect(x - u * 0.75, y - u * 0.55, u * 1.5, u * 0.7);
    ctx.fillStyle = css([248, 214, 120], 2, null, 0.18);
    ctx.fillRect(x - u * 0.8, y - u * 0.62, u * 1.6, u * 0.1);
    // 两个基路伯（翅膀向前相遮）
    ctx.beginPath();
    for (const s of [-1, 1]) {
      const bx = x + s * u * 0.5;
      ctx.moveTo(bx, y - u * 0.62);
      ctx.quadraticCurveTo(bx + s * u * 0.08, y - u * 1.0, bx - s * u * 0.02, y - u * 1.02);
      ctx.quadraticCurveTo(bx - s * u * 0.35, y - u * 1.15, bx - s * u * 0.52, y - u * 0.98);
      ctx.quadraticCurveTo(bx - s * u * 0.25, y - u * 0.86, bx - s * u * 0.12, y - u * 0.62);
      ctx.closePath();
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  乐器（号、钹、瑟、琴）与声合为一的光环
  // ════════════════════════════════════════════════════════════
  const TRUMP = ['pr0', 'pr1', 'pr2', 'pr3', 'pr4', 'pr5'];
  const SING = ['sg0', 'sg1', 'sg2', 'sg3', 'sg4', 'sg5'];
  const INSTR = { sg0: 'cym', sg1: 'harp', sg2: 'lyre', sg3: 'cym', sg4: 'harp', sg5: 'lyre' };
  const UPRIGHT = { stand: 1, walk: 1, run: 1, raise: 1, point: 1, carry: 1, gaze: 1 };
  function drawInstruments(ctx) {
    const play = lv('chPlay');
    const any = TRUMP.concat(SING).some(id => has(id));
    if (!any) return;
    const un = Math.max(0.6, W.unit);
    const beat = U.fract(W.t / 0.9);
    for (const id of TRUMP) {
      const p = fig(id);
      if (!p || !p._vis || !UPRIGHT[p.pose] || p.alpha < 0.05) continue;
      const h = p._h, f = p.facing || 1, up = play;
      const mx = p._x + f * h * 0.05, my = p._y - h * 0.9;
      const ang = lerp(1.2, -0.35, up), L = h * 0.62;
      const ex = mx + f * Math.cos(ang) * L, ey = my + Math.sin(ang) * L;
      ctx.globalAlpha = p.alpha;
      ctx.strokeStyle = 'rgb(214, 220, 228)';
      ctx.lineWidth = Math.max(0.9, h * 0.028);
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(ex, ey); ctx.stroke();
      // 号口
      const bx = f * Math.cos(ang), by = Math.sin(ang), nx = -by, ny = bx;
      ctx.fillStyle = 'rgb(226, 232, 240)';
      ctx.beginPath();
      ctx.moveTo(ex - bx * h * 0.06 + nx * h * 0.012, ey - by * h * 0.06 + ny * h * 0.012);
      ctx.lineTo(ex + nx * h * 0.05, ey + ny * h * 0.05); ctx.lineTo(ex - nx * h * 0.05, ey - ny * h * 0.05);
      ctx.lineTo(ex - bx * h * 0.06 - nx * h * 0.012, ey - by * h * 0.06 - ny * h * 0.012);
      ctx.closePath(); ctx.fill();
      if (play > 0.5) {
        sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.silver, ex, ey, h * 0.5, 0.35 * play * (0.6 + 0.4 * Math.sin(W.t * 6 + p.nx * 40)));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    for (const id of SING) {
      const p = fig(id);
      if (!p || !p._vis || !UPRIGHT[p.pose] || p.alpha < 0.05) continue;
      const h = p._h, f = p.facing || 1, kind = INSTR[id];
      const cx = p._x + f * h * 0.2, cy = p._y - h * 0.6;
      ctx.globalAlpha = p.alpha;
      if (kind === 'cym') {
        const gap = h * (0.03 + 0.1 * (play > 0.3 ? Math.abs(Math.sin(W.t * Math.PI / 0.9)) : 0.5));
        ctx.fillStyle = 'rgb(232, 196, 100)';
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx, cy + s * gap, h * 0.09, h * 0.025, 0, 0, TAU); ctx.fill(); }
        if (play > 0.3 && beat < 0.15) {
          sprites(); ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, SP.gold, cx, cy, h * 0.6, 0.5 * play * (1 - beat / 0.15));
          ctx.globalCompositeOperation = 'source-over';
        }
      } else if (kind === 'harp') {
        ctx.strokeStyle = 'rgb(176, 128, 72)';
        ctx.lineWidth = Math.max(0.8, h * 0.025);
        ctx.beginPath(); ctx.moveTo(cx - f * h * 0.04, cy + h * 0.14); ctx.lineTo(cx + f * h * 0.08, cy - h * 0.22); ctx.lineTo(cx + f * h * 0.14, cy + h * 0.1); ctx.closePath(); ctx.stroke();
        ctx.strokeStyle = 'rgba(240, 230, 200, 0.7)';
        ctx.lineWidth = Math.max(0.4, h * 0.008);
        ctx.beginPath();
        for (let i = 1; i < 4; i++) { const tt = i / 4; ctx.moveTo(lerp(cx - f * h * 0.04, cx + f * h * 0.08, tt), lerp(cy + h * 0.14, cy - h * 0.22, tt)); ctx.lineTo(lerp(cx - f * h * 0.04, cx + f * h * 0.14, tt), lerp(cy + h * 0.14, cy + h * 0.1, tt)); }
        ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgb(168, 120, 70)';
        ctx.lineWidth = Math.max(0.8, h * 0.025);
        ctx.beginPath(); ctx.moveTo(cx - h * 0.07, cy - h * 0.14); ctx.quadraticCurveTo(cx - h * 0.08, cy + h * 0.08, cx, cy + h * 0.08); ctx.quadraticCurveTo(cx + h * 0.08, cy + h * 0.08, cx + h * 0.07, cy - h * 0.14);
        ctx.moveTo(cx - h * 0.08, cy - h * 0.12); ctx.lineTo(cx + h * 0.08, cy - h * 0.12); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 歌声：每人头上一圈光环，都在同一个拍子上；声合为一时，众声汇成一道光，升到殿上
  function drawSong(ctx) {
    const k = lv('chSong');
    if (k < 0.01) return;
    const un = Math.max(0.6, W.unit), per = 1.8;
    const ids = TRUMP.concat(SING);
    sprites();
    ctx.globalCompositeOperation = 'lighter';
    let cx = 0, cy = 0, n = 0, top = 1e9;
    // 众人在同一个拍子上：头上一团柔和的金光一齐起伏，另有几点光往上升去
    const ph = U.fract(W.t / per), beat = Math.pow(1 - ph, 2);
    for (const id of ids) {
      const p = fig(id);
      if (!p || !p._vis || p.alpha < 0.1) continue;
      const hx = p._x, hy = p._y - p._h * 1.02;
      cx += hx; cy += hy; n++; top = Math.min(top, hy);
      glowAt(ctx, SP.gold, hx, hy - p._h * 0.08, p._h * (0.55 + 0.25 * beat), clamp(0.22 * k * (0.45 + 0.55 * beat) * p.alpha, 0, 0.25));
      const m = U.fract(W.t * 0.45 + U.hash1(p.nx * 97) * 0.9), my = hy - m * p._h * 1.4;
      ctx.globalAlpha = clamp(k * 0.7 * Math.sin(Math.PI * m) * p.alpha, 0, 1);
      ctx.fillStyle = 'rgb(255, 238, 196)';
      ctx.fillRect(hx - un * 0.8 + Math.sin(m * 6 + p.nx * 50) * 2 * un, my, 1.6 * un, 1.6 * un);
    }
    ctx.globalAlpha = 1;
    if (n && S.one) {
      cx /= n; cy = top;
      const since = W.t - S.oneT0, a0 = k * Math.min(1, since / 2);
      sprites();
      // 一个大的光环（众声在同一拍上）
      for (let j = 0; j < 2; j++) {
        const q = U.fract(W.t / 2.4 + j / 2);
        ctx.strokeStyle = U.rgba(255, 236, 184, 0.18 * a0 * (1 - q) * lv('chPlay'));
        ctx.lineWidth = Math.max(1, 1.6 * un);
        ctx.beginPath(); ctx.ellipse(cx, cy, M() * (0.04 + 0.2 * q), M() * (0.012 + 0.06 * q), 0, 0, TAU); ctx.stroke();
      }
      // 一道升起的光：有敌营时落在敌营上（歌声所到，火一处一处灭了）；有殿时落在殿上；否则升到天上
      const t = temple(), built = lv('chBuild') > 0.9 && lv('chRuin') < 0.5, campOn = S.camp !== 'none' && lv('chCamp') > 0.2;
      const cc = campOn ? campCenter() : null;
      const tx = cc ? cc[0] : built ? t.x0 + 0.12 * t.tu : cx + M() * 0.1, ty = cc ? cc[1] : built ? t.top - t.hP : cy - M() * 0.45;
      const mx = (cx + tx) / 2, my = Math.min(cy, ty) - M() * 0.1;
      const g = ctx.createLinearGradient(cx, cy, tx, ty);
      const a = 0.22 * a0 * (0.85 + 0.15 * Math.sin(W.t * 2));
      g.addColorStop(0, U.rgba(255, 230, 170, a)); g.addColorStop(1, U.rgba(255, 244, 214, a * 0.35));
      ctx.strokeStyle = g;
      ctx.lineCap = 'round';
      for (const [wd, f] of [[14, 0.35], [4, 1]]) {
        ctx.lineWidth = Math.max(2, wd * un);
        ctx.globalAlpha = f;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.quadraticCurveTo(mx, my, tx, ty); ctx.stroke();
      }
      // 沿光而上的点
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgb(255, 240, 200)';
      for (let i = 0; i < 14; i++) {
        const s2 = U.fract(W.t * 0.35 + i / 14), u2 = 1 - s2;
        const x = u2 * u2 * cx + 2 * u2 * s2 * mx + s2 * s2 * tx, y = u2 * u2 * cy + 2 * u2 * s2 * my + s2 * s2 * ty;
        ctx.globalAlpha = a0 * 0.7 * Math.sin(Math.PI * s2);
        ctx.fillRect(x - un, y - un, 2 * un, 2 * un);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  云充满了殿；荣光（代下 5:13–14，7:1–3）
  // ════════════════════════════════════════════════════════════
  // 云团：预先画好的几朵积云（顶亮、底略暗，边缘柔和），四种色调：白昼 · 黄昏（桃色）· 夜（青灰）· 荣光（暖金）
  const PUFF_TINT = {
    day: [[255, 254, 250], [246, 242, 234], [230, 226, 218], [176, 172, 168]],
    dusk: [[255, 230, 206], [246, 204, 184], [232, 180, 166], [170, 128, 132]],
    night: [[176, 186, 214], [150, 160, 192], [126, 136, 170], [70, 78, 108]],
    warm: [[255, 250, 226], [255, 232, 178], [250, 214, 150], [214, 150, 90]],
  };
  const PUFFS = {};
  function puffs(tone) {
    if (PUFFS[tone]) return PUFFS[tone];
    const T = PUFF_TINT[tone], out = [];
    const rgba = (c, a) => 'rgba(' + c[0] + ', ' + c[1] + ', ' + c[2] + ', ' + a + ')';
    for (let v = 0; v < 4; v++) {
      const W0 = 160, H0 = 112, c = cnv(W0, H0), g = c.getContext('2d'), r = U.mulberry32(7301 + v * 37);
      for (let i = 0; i < 11; i++) {
        const u = r(), x = W0 * (0.16 + 0.68 * u), rad = H0 * (0.17 + 0.15 * r()) * (1 - 0.35 * Math.abs(u - 0.5));
        const y = H0 * 0.7 - rad * (0.2 + 1.1 * Math.sin(Math.PI * u) * r());
        const gr = g.createRadialGradient(x - rad * 0.2, y - rad * 0.35, rad * 0.1, x, y, rad);
        gr.addColorStop(0, rgba(T[0], 1)); gr.addColorStop(0.62, rgba(T[1], 0.9)); gr.addColorStop(1, rgba(T[2], 0));
        g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
      }
      g.globalCompositeOperation = 'source-atop';
      const sh = g.createLinearGradient(0, H0 * 0.35, 0, H0);
      sh.addColorStop(0, rgba(T[3], 0)); sh.addColorStop(1, rgba(T[3], 0.45));
      g.fillStyle = sh; g.fillRect(0, 0, W0, H0);
      out.push(c);
    }
    return (PUFFS[tone] = out);
  }
  // 云的位置（u：自廊前量起的殿长比例；v：高的比例）。
  // zone 0 廊子里（按廊高）· 1 殿身里（按殿身高）——这两处剪在殿的轮廓里，殿的边、金门、柱子透得出来；
  // zone 2 自门口漫到台阶前（少，低）· zone 3 殿顶上的一圈（小）
  const CLOUD = (function () {
    const r = U.mulberry32(5131), out = [];
    for (let i = 0; i < 36; i++) {
      const zone = i < 10 ? 0 : i < 26 ? 1 : i < 30 ? 2 : 3;
      const u = zone === 0 ? -0.02 + r() * 0.28 : zone === 1 ? 0.28 + r() * 0.72 : zone === 2 ? -0.34 + r() * 0.26 : 0.0 + r() * 1.0;
      const v = zone === 0 ? 0.12 + r() * 0.82 : zone === 1 ? 0.2 + r() * 0.78 : zone === 2 ? 0.02 + r() * 0.2 : 1.0 + r() * 0.16;
      const s = zone === 3 ? 0.16 + r() * 0.08 : zone === 2 ? 0.16 + r() * 0.1 : 0.2 + r() * 0.2;
      out.push({ zone, u, v, s, ph: r() * TAU, sp: 0.12 + r() * 0.2, n: i % 4, th: zone >= 2 ? 0.35 + r() * 0.5 : r() * 0.3, flip: r() < 0.5 });
    }
    return out;
  })();
  // 此刻天色给云的色调：[白昼, 黄昏, 夜] 的比重
  function cloudTone() {
    const n = clamp(W.night * 1.2, 0, 1), d = clamp(W.dusk * 1.4, 0, 1) * (1 - n);
    return [Math.max(0, 1 - n - d), d, n];
  }
  function drawCloud(ctx, veil) {
    const k = lv('chCloud');
    if (k < 0.01) return;
    sprites();
    const t = temple(), tu = t.tu, gl = lv('chGlory');
    const tone = cloudTone(), wk = sm(0.6, 0.95, gl);
    if (veil) {
      // 前景一层很淡的纱（整座院子都在云里，祭司不能站立供职）：带着天色，不是一片白
      const cx = t.x0 - 0.1 * tu, cy = t.top - 0.12 * tu, R = tu * 1.3;
      const P0 = puffs('day')[1], P1 = puffs('dusk')[1], P2 = puffs('night')[1];
      const a = 0.16 * k * (1 - 0.5 * wk);
      [[P0, tone[0]], [P1, tone[1]], [P2, tone[2]]].forEach(q => { if (q[1] > 0.02) { ctx.globalAlpha = a * q[1]; ctx.drawImage(q[0], cx - R, cy - R * 0.5, R * 2, R * 0.9); } });
      ctx.globalAlpha = 1;
      return;
    }
    // 云里透出的光（不大）
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, t.x0 + 0.4 * tu, t.top - t.hH * 0.6, tu * 1.5, k * (0.12 + 0.18 * gl));
    ctx.globalCompositeOperation = 'source-over';
    const sets = [[puffs('day'), tone[0] * (1 - wk)], [puffs('dusk'), tone[1] * (1 - wk)], [puffs('night'), tone[2] * (1 - wk)], [puffs('warm'), wk]];
    const px0 = t.x0, px1 = t.x0 + 0.24 * tu, hx1 = t.x0 + tu, hH = t.hH * (1 - lv('chRuin') * 0.55), hP = t.hP * (1 - lv('chRuin') * 0.62);
    for (let pass = 0; pass < 2; pass++) {
      if (pass === 0) {
        // 殿里的云：剪在廊与殿身的轮廓里
        ctx.save();
        ctx.beginPath(); ctx.rect(px0 + 1, t.top - hP + 1, px1 - px0 - 2, hP - 1); ctx.rect(px1, t.top - hH + 1, hx1 - px1 - 1, hH - 1); ctx.clip();
      }
      for (const c of CLOUD) {
        if ((pass === 0) !== (c.zone <= 1)) continue;
        const e = clamp((k - c.th) / 0.35, 0, 1);
        if (e <= 0.01) continue;
        const x = t.x0 + c.u * tu + Math.sin(W.t * c.sp + c.ph) * 0.025 * tu;
        const y = t.top - c.v * (c.zone === 1 ? hH : hP) + Math.cos(W.t * c.sp * 0.8 + c.ph) * 0.015 * tu;
        const w = c.s * tu * (0.6 + 0.4 * e) * 1.4, h = w * 0.7;
        const a = e * (c.zone <= 1 ? 0.5 : c.zone === 2 ? 0.4 : 0.42);
        if (c.flip) { ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); }
        const qx = c.flip ? -w / 2 : x - w / 2, qy = c.flip ? -h * 0.7 : y - h * 0.7;
        for (const q of sets) if (q[1] > 0.02) { ctx.globalAlpha = a * q[1]; ctx.drawImage(q[0][c.n], qx, qy, w, h); }
        if (c.flip) ctx.restore();
      }
      if (pass === 0) ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawGloryFront(ctx) {
    const gl = lv('chGlory');
    if (gl < 0.01) return;
    sprites();
    const t = temple(), tu = t.tu, dx = t.x0 + 0.12 * tu, dy = t.top - 0.16 * tu;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, dx, dy, tu * 0.8, gl * 0.42);
    // 自门里射出的光
    const a = gl * 0.18 * (0.85 + 0.15 * Math.sin(W.t * 1.4));
    const g = ctx.createLinearGradient(dx, dy, dx - tu * 0.9, dy + tu * 0.1);
    g.addColorStop(0, U.rgba(255, 228, 160, a)); g.addColorStop(1, U.rgba(255, 228, 160, 0));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(dx, dy - 0.14 * tu); ctx.lineTo(dx - tu * 0.9, dy - 0.05 * tu); ctx.lineTo(dx - tu * 0.9, dy + 0.25 * tu); ctx.lineTo(dx, dy + 0.16 * tu); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶和华的使者：站在天地间，手里有拔出来的刀，伸在耶路撒冷以上（代上 21:16）
  // ════════════════════════════════════════════════════════════
  function angelGeom() {
    const tl = tall();
    return { x: (tl ? 0.74 : 0.73) * W.w, y: (tl ? 0.47 : 0.36) * W.h, h: (tl ? 0.2 : 0.33) * W.h };
  }
  function drawAngel(ctx) {
    const k = lv('chAngel');
    if (k < 0.01) return;
    sprites();
    const g = angelGeom(), x = g.x + Math.sin(W.t * 0.5) * 3 * W.unit, y = g.y + Math.sin(W.t * 0.7) * 4 * W.unit, H = g.h, sw = lv('chSword');
    ctx.globalCompositeOperation = 'lighter';
    // 光晕
    glowAt(ctx, SP.white, x, y, H * 2.2, 0.28 * k);
    glowAt(ctx, SP.gold, x, y - H * 0.35, H * 0.8, 0.4 * k);
    // 身形：一道长长的光，像袍
    const gr = ctx.createLinearGradient(0, y - H * 0.5, 0, y + H * 0.5);
    gr.addColorStop(0, U.rgba(255, 250, 236, 0.75 * k)); gr.addColorStop(0.6, U.rgba(250, 236, 200, 0.42 * k)); gr.addColorStop(1, U.rgba(240, 220, 180, 0));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(x, y - H * 0.4);
    ctx.bezierCurveTo(x + H * 0.1, y - H * 0.36, x + H * 0.13, y - H * 0.05, x + H * 0.2, y + H * 0.5);
    ctx.lineTo(x - H * 0.2, y + H * 0.5);
    ctx.bezierCurveTo(x - H * 0.13, y - H * 0.05, x - H * 0.1, y - H * 0.36, x, y - H * 0.4);
    ctx.fill();
    // 头
    glowAt(ctx, SP.white, x, y - H * 0.46, H * 0.2, 0.9 * k);
    // 光的衣边：一层淡淡的、向下飘动的光
    for (let i = 0; i < 3; i++) {
      const sw2 = Math.sin(W.t * 0.8 + i * 2.1) * H * 0.03;
      ctx.strokeStyle = U.rgba(255, 244, 220, (0.16 - i * 0.04) * k);
      ctx.lineWidth = Math.max(1, H * (0.01 + i * 0.008));
      ctx.beginPath();
      ctx.moveTo(x - H * 0.05, y - H * 0.34);
      ctx.bezierCurveTo(x - H * (0.18 + i * 0.05), y - H * 0.1, x - H * (0.24 + i * 0.05) + sw2, y + H * 0.2, x - H * (0.28 + i * 0.06) + sw2, y + H * 0.5);
      ctx.moveTo(x + H * 0.05, y - H * 0.34);
      ctx.bezierCurveTo(x + H * (0.18 + i * 0.05), y - H * 0.1, x + H * (0.24 + i * 0.05) - sw2, y + H * 0.2, x + H * (0.28 + i * 0.06) - sw2, y + H * 0.5);
      ctx.stroke();
    }
    // 刀：自手中伸向城上（伸在耶路撒冷以上）
    if (sw > 0.01) {
      const hx = x - H * 0.14, hy = y - H * 0.18;
      const tx = X('palace') * W.w, ty = gY(1, X('palace')) - PH(1) * 3;
      const dx = tx - hx, dy = ty - hy, L = Math.hypot(dx, dy) || 1;
      const len = Math.min(L * 0.7, H * 0.95) * sw;
      const ux = dx / L, uy = dy / L;
      const ex = hx + ux * len, ey = hy + uy * len;
      const flick = 0.85 + 0.15 * Math.sin(W.t * 5);
      ctx.strokeStyle = U.rgba(255, 252, 240, 0.9 * k * flick);
      ctx.lineWidth = Math.max(1.2, H * 0.014);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.strokeStyle = U.rgba(255, 236, 200, 0.25 * k * flick);
      ctx.lineWidth = Math.max(4, H * 0.05);
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ex, ey); ctx.stroke();
      glowAt(ctx, SP.white, ex, ey, H * 0.2, 0.6 * k * sw);
      // 臂
      ctx.strokeStyle = U.rgba(255, 248, 230, 0.5 * k);
      ctx.lineWidth = Math.max(1.5, H * 0.03);
      ctx.beginPath(); ctx.moveTo(x - H * 0.04, y - H * 0.3); ctx.lineTo(hx, hy); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶和华的眼目遍察全地（代下 16:9）：一道柔和的光自天而来，在地上从东（左）到西（右）走过；
  //  所到之处，向他心存诚实的人心里亮起来，亮着不灭（chHearts：光已走到了哪里）
  // ════════════════════════════════════════════════════════════
  const HEARTS = (function () {
    const r = U.mulberry32(1609), out = [];
    for (let i = 0; i < 12; i++) out.push({ xf: 0.5 + 0.48 * r(), l: r() < 0.3 ? 0 : 1, ph: r() * TAU });
    return out;
  })();
  const sweepX = hk => lerp(0.34, 1.0, clamp(hk, 0, 1));
  const heartLit = (hk, xf) => clamp((hk - (xf - 0.34) / 0.66) / 0.05, 0, 1);
  function drawEyes(ctx) {
    const k = lv('chEyes'), hk = lv('chHearts');
    if (k < 0.01 && hk < 0.01) return;
    sprites();
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    if (k > 0.01) {
      const sx = sweepX(hk) + 0.015 * Math.sin(W.t * 0.7), x = sx * W.w;
      for (const l of [2, 1]) {
        const y = l === 2 ? rowY(0.45) : gY(1, clamp(sx, 0.5, 0.99)), R = (l === 2 ? 0.12 : 0.07) * W.w;
        ctx.globalAlpha = clamp(k * (l === 2 ? 0.6 : 0.4), 0, 1);
        ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.26); ctx.drawImage(SP.gold, -R, -R, R * 2, R * 2); ctx.restore();
      }
      const y = rowY(0.45), R = 0.1 * W.w;
      ctx.globalAlpha = clamp(k * 0.26, 0, 1);
      ctx.drawImage(SP.soft, x - R * 0.9, W.h * 0.06, R * 1.8, y - W.h * 0.06);
    }
    if (hk > 0.01) {
      // 诚实的心：院中众人的心里（跟着各人）……
      for (const m of members('ch:isr')) {
        if (!m._vis) continue;
        const lit = heartLit(hk, m.nx) * m.alpha;
        if (lit < 0.01) continue;
        const up = m.pose === 'fall' || m.pose === 'lie' ? 0.12 : m.pose === 'kneel' || m.pose === 'pray' ? 0.4 : 0.6;
        const x = m._x, y = m._y - m._h * up, pulse = 0.78 + 0.22 * Math.sin(W.t * 1.6 + m.nx * 40);
        glowAt(ctx, SP.gold, x, y, m._h * 0.9, lit * 0.32 * pulse);
        glowAt(ctx, SP.white, x, y, m._h * 0.16, lit * 0.85 * pulse);
      }
      // ……城里、远山上的人家
      for (const h of HEARTS) {
        const lit = heartLit(hk, h.xf);
        if (lit < 0.01) continue;
        const x = h.xf * W.w, y = gY(h.l, h.xf) - PH(h.l) * 0.7, pulse = 0.78 + 0.22 * Math.sin(W.t * 1.6 + h.ph);
        glowAt(ctx, SP.gold, x, y, (h.l ? 22 : 14) * un, lit * 0.4 * pulse);
        glowAt(ctx, SP.white, x, y, (h.l ? 5 : 3.5) * un, lit * 0.8 * pulse);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  十二支派的灯（远山上）：国分裂时，十个支派的灯熄了，只剩犹大与便雅悯（代下 10—11）
  // ════════════════════════════════════════════════════════════
  const tribeX = i => lerp(X('palace') + 0.03, 0.985, Math.pow(i / 11, 0.85));
  function drawTribes(ctx) {
    const k = lv('chTribes'), sp = lv('chSplit');
    if (k < 0.01) return;
    sprites();
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const xf = tribeX(i), x = xf * W.w, y = gY(0, xf) - PH(0) * 0.9;
      const a = k * (i < 2 ? 1 : clamp(1 - sp * 1.25 + (i - 2) * 0.03, 0, 1)) * (0.8 + 0.2 * Math.sin(W.t * 2.1 + i * 1.3));
      if (a < 0.01) continue;
      glowAt(ctx, SP.warm, x, y, 26 * un, a * (0.35 + 0.35 * nightK()));
      glowAt(ctx, SP.gold, x, y, 7 * un, a * 0.95);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  敌营（摩押、亚扪、西珥山人 · 亚述）：中丘层的左端（海那边的岬上）——帐棚、兵、营火
  // ════════════════════════════════════════════════════════════
  const CAMP = (function () {
    const r = U.mulberry32(8811), out = [];
    for (let i = 0; i < 30; i++) {
      const kind = i < 7 ? 'tent' : i < 13 ? 'fire' : 'man';
      out.push({ kind, u: r(), v: r(), ph: r() * TAU, out: 0.04 + 0.9 * r(), s: 0.75 + 0.5 * r() });
    }
    return out;
  })();
  const campCenter = () => { const [a, b] = X('camp'), xf = (a + b) / 2; return [xf * W.w, gY(1, xf) - PH(1) * 0.8]; };
  function drawCamp(ctx) {
    const k = lv('chCamp');
    if (k < 0.01) return;
    sprites();
    const [a, b] = X('camp'), o = lv('chCampOut'), un = Math.max(0.6, W.unit), hm = PH(1);
    const alive = c => clamp((c.out - o) / 0.08, 0, 1);
    const at = c => { const xf = lerp(a, b, c.u); return [xf * W.w, gY(1, xf) + 1 + c.v * hm * 0.18]; };
    // 帐棚
    ctx.fillStyle = css(S.camp === 'assyria' ? [70, 58, 52] : [92, 72, 58], 1, k);
    ctx.beginPath();
    for (const c of CAMP) {
      if (c.kind !== 'tent') continue;
      const [x, g] = at(c), w = hm * 1.1 * c.s, h = hm * 0.78 * c.s;
      ctx.moveTo(x - w / 2, g); ctx.lineTo(x - w * 0.1, g - h); ctx.lineTo(x + w * 0.1, g - h); ctx.lineTo(x + w / 2, g); ctx.closePath();
    }
    ctx.fill();
    // 兵的剪影（持枪）
    ctx.fillStyle = css([34, 28, 26], 1, k * 0.95);
    ctx.strokeStyle = css([60, 50, 46], 1, k * 0.9);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    const spear = [];
    for (const c of CAMP) {
      if (c.kind !== 'man') continue;
      const al = alive(c);
      if (al < 0.5) continue;
      const [x, g] = at(c), hh = hm * 0.95 * c.s;
      ctx.moveTo(x - hh * 0.1, g); ctx.lineTo(x - hh * 0.05, g - hh * 0.8); ctx.lineTo(x + hh * 0.05, g - hh * 0.8); ctx.lineTo(x + hh * 0.1, g); ctx.closePath();
      ctx.moveTo(x + hh * 0.08, g - hh * 0.9); ctx.arc(x, g - hh * 0.9, hh * 0.08, 0, TAU);
      spear.push([x + hh * 0.14, g, g - hh * 1.35]);
    }
    ctx.fill();
    ctx.beginPath();
    for (const q of spear) { ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0], q[2]); }
    ctx.stroke();
    // 营火：一处一处熄灭
    for (const c of CAMP) {
      if (c.kind !== 'fire') continue;
      const al = alive(c);
      const [x, g] = at(c);
      if (al > 0.01) flame(ctx, x, g, hm * 0.62 * c.s * (0.6 + 0.4 * al), k * al, 70 + c.ph, hm * 0.18);
      else if (o - c.out < 0.25) smoke(ctx, x, g - hm * 0.2, k * (1 - (o - c.out) / 0.25), hm * 2.5, hm * 0.15, 70 + c.ph, false, 0.1);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  东方的光与归回的路（代下 36:22–23）
  // ════════════════════════════════════════════════════════════
  function drawEast(ctx) {
    const k = lv('chEast');
    if (k < 0.01) return;
    const hy = W.horizonY, x = 0.02 * W.w, R = W.w * 0.9;
    const spr = radSprite('east', [[0, 'rgba(255, 214, 140, 1)'], [0.35, 'rgba(255, 180, 110, 0.4)'], [1, 'rgba(255, 170, 100, 0)']]);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W.w, hy + 4); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(0.55 * k, 0, 1);
    ctx.drawImage(spr, x - R, hy - R, R * 2, R * 2);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 被掳的人走进东方的光里（air 层：在海边，低处的一团光）
  function drawExileLight(ctx) {
    const k = lv('chExile');
    if (k < 0.01) return;
    sprites();
    const [s0] = X('shore'), x = (s0 - 0.01) * W.w, y = rowY(X('shoreK')) - PH(2) * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y, W.w * 0.2, 0.3 * k);
    glowAt(ctx, SP.gold, x, y, W.w * 0.07, 0.4 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 归回的路：东方（左）天海相接处的光，像日光铺在水面上的一条碎金，弯过来到岸边；再沿着地，上到锡安的废墟
  // 横屏时经文的框在左下的海面上：路很快弯向右边，框里的那一段淡去
  function roadEnds() {
    const [s0] = X('shore'), hy = W.horizonY, ly = rowY(X('shoreK'));
    return { sx: 0.08 * W.w, sy: hy + 1, cx: (s0 + 0.01) * W.w, cy: ly, mx: (tall() ? 0.3 : 0.5) * W.w, my: hy + (ly - hy) * 0.22,
      x0: s0 + 0.01, x1: X('king') };
  }
  function roadAt(E, t) {
    const u = 1 - t;
    return [u * u * E.sx + 2 * u * t * E.mx + t * t * E.cx, u * u * E.sy + 2 * u * t * E.my + t * t * E.cy];
  }
  // 经文框（横屏）：框里的路淡去
  function boxFade(x, y) {
    if (tall()) return 1;
    const x0 = 0.03 * W.w, x1 = 0.49 * W.w, y0 = 0.53 * W.h, y1 = 0.75 * W.h;
    const d = Math.max(x0 - x, x - x1, y0 - y, y - y1);
    return d >= 0 ? 1 : 0.15 + 0.85 * clamp(1 + d / (24 * W.unit), 0, 1);
  }
  function drawRoadSea(ctx) {
    const k = lv('chRoad');
    if (k < 0.01) return;
    sprites();
    const E = roadEnds(), e1 = clamp(k / 0.6, 0, 1), un = Math.max(0.6, W.unit), hy = W.horizonY;
    const dawn = mix([255, 214, 150], [255, 188, 140], W.dusk);
    ctx.globalCompositeOperation = 'lighter';
    // 一道柔和的金带（没有硬边）：一团一团压扁的光沿着路
    for (let i = 0; i < 26; i++) {
      const t = (i + 0.5) / 26;
      if (t > e1) break;
      const [x, y] = roadAt(E, t), persp = clamp((y - hy) / Math.max(1, E.cy - hy), 0.05, 1);
      const R = W.w * (0.012 + 0.05 * persp);
      ctx.globalAlpha = clamp(0.3 * (0.4 + 0.6 * persp) * boxFade(x, y) * k, 0, 1);
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.22); ctx.drawImage(SP.gold, -R, -R, R * 2, R * 2); ctx.restore();
    }
    // 水面上闪烁的碎光：短的横线，参差，远小近大
    ctx.strokeStyle = U.rgb(dawn[0], dawn[1], dawn[2]);
    ctx.lineCap = 'round';
    for (let j = 0; j < 110; j++) {
      const t = Math.pow(U.hash1(j * 7 + 3), 0.75);
      if (t > e1) continue;
      const [x0, y0] = roadAt(E, t), persp = clamp((y0 - hy) / Math.max(1, E.cy - hy), 0.05, 1);
      const spread = W.w * (0.008 + 0.04 * persp);
      const x = x0 + (U.hash1(j * 13 + 1) - 0.5) * spread * 2, y = y0 + (U.hash1(j * 5 + 9) - 0.5) * 8 * un * persp;
      const f = Math.max(0, Math.sin(W.t * (1.3 + U.hash1(j) * 2.2) + j * 2.1));
      const len = W.w * (0.004 + 0.022 * persp) * (0.5 + U.hash1(j + 5));
      ctx.globalAlpha = clamp(0.95 * f * (0.35 + 0.65 * persp) * boxFade(x, y) * k, 0, 1);
      ctx.lineWidth = Math.max(0.6, (0.5 + 1.2 * persp) * un);
      ctx.beginPath(); ctx.moveTo(x - len / 2, y); ctx.lineTo(x + len / 2, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawRoadLand(ctx) {
    const k = lv('chRoad');
    const e2 = clamp((k - 0.5) / 0.5, 0, 1);
    if (e2 < 0.01) return;
    const E = roadEnds(), un = Math.max(0.6, W.unit), xe = lerp(E.x0, E.x1, e2);
    const yAt = xf => Math.max(gY(2, xf) + PH(2) * 0.1, lerp(E.cy, rowY(0.5), clamp((xf - E.x0) / Math.max(0.01, E.x1 - E.x0), 0, 1)));
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const [wd, a] of [[12, 0.06], [4, 0.14], [1.4, 0.34]]) {
      ctx.strokeStyle = U.rgba(255, 222, 150, a);
      ctx.lineWidth = wd * un;
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) { const xf = lerp(E.x0, xe, i / 30), y = yAt(xf); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
      ctx.stroke();
    }
    // 往锡安去的光点
    ctx.fillStyle = 'rgb(255, 240, 200)';
    for (let i = 0; i < 16; i++) {
      const s2 = U.fract(W.t * 0.06 + i * 0.618), xf = lerp(E.x0, xe, s2);
      ctx.globalAlpha = 0.7 * Math.sin(Math.PI * s2) * e2;
      ctx.fillRect(xf * W.w - un, yAt(xf) - 3 * un, 2 * un, 2 * un);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光：自天降下的火、光柱、传递的冠冕、使者（先知）的光、上升的祷告……
  // ════════════════════════════════════════════════════════════
  function drawFireFall(ctx) {
    const age = W.t - S.fireT0;
    if (age < 0 || age > 4.6) return;
    sprites();
    const x = S.fireX * W.w, A = altarGeom(), gy = A.g - A.h * 0.9, land = 0.85;
    const head = lerp(-W.h * 0.08, gy, U.easeIn(clamp(age / land, 0, 1)));
    const tail = age < land ? -W.h * 0.12 : lerp(-W.h * 0.12, gy - A.tu * 0.1, U.easeIn(clamp((age - land) / 1.5, 0, 1)));
    const a = 1 - sm(2.8, 4.6, age);
    const w = Math.max(W.w * 0.05, A.tu * 0.36) * (1 + 0.07 * Math.sin(W.t * 23));
    ctx.globalCompositeOperation = 'lighter';
    if (head - tail > 2) {
      // 外层：一团一团翻滚的火光顺着落下（不是一道硬的光柱）
      const n = Math.max(6, Math.round((head - tail) / (w * 0.55)));
      for (let i = 0; i < n; i++) {
        const q = (i + U.fract(W.t * 1.7)) / n, y = lerp(tail, head, q);
        const jx = Math.sin(W.t * 7 + i * 1.9) * w * 0.28, sz = w * (1.1 + 0.5 * U.hash1(i * 3 + 1)) * (0.7 + 0.3 * q);
        glowAt(ctx, SP.warm, x + jx, y, sz * 1.6, a * 0.3 * (1 - 0.5 * sm(0.75, 1, q)));
        glowAt(ctx, SP.ember, x + jx * 0.6, y, sz, a * 0.34);
      }
      ctx.globalAlpha = a * 0.8;
      ctx.drawImage(SP.fire, x - w * 0.42, tail, w * 0.84, head - tail);
      ctx.globalAlpha = a * 0.7;
      ctx.drawImage(SP.beam, x - w * 0.12, tail, w * 0.24, head - tail);
    }
    // 着地：坛上一团火光
    if (age > land - 0.05) {
      const b2 = clamp((age - land) / 0.5, 0, 1);
      glowAt(ctx, SP.warm, x, gy, A.tu * (0.5 + 0.6 * b2), a * 0.55);
      glowAt(ctx, SP.gold, x, gy - A.h * 0.3, A.tu * 0.3, a * 0.6);
    }
    // 火星
    for (let i = 0; i < 34; i++) {
      const s2 = U.fract(i * 0.618 + age * 0.9), yy = lerp(tail, Math.max(tail + 1, head), s2);
      ctx.fillStyle = i % 3 ? 'rgb(255, 200, 110)' : 'rgb(255, 244, 210)';
      ctx.globalAlpha = a * 0.8 * Math.sin(Math.PI * s2);
      ctx.fillRect(x + (U.hash1(i) - 0.5) * w * 0.9, yy, 2 * W.unit, 2 * W.unit);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawFXL(ctx) {
    if (!FXL.length) return;
    sprites();
    const un = Math.max(0.6, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (const f of FXL) {
      const e = f.t / f.dur;
      if (f.type === 'beam') {
        const x = f.xf * W.w, gy = gY(f.l, f.xf), w = f.w * un;
        const a = Math.min(1, f.t / 0.6) * (1 - sm(0.6, 1, e)) * (f.k || 1), y0 = Math.min(gy - PH(f.l) * 4, W.h * (tall() ? 0.3 : 0.12));
        ctx.globalAlpha = a * 0.6;
        ctx.drawImage(SP.soft, x - w * 0.8, y0, w * 1.6, gy - y0);
        glowAt(ctx, SP.gold, x, gy - PH(f.l) * 0.5, PH(f.l) * 3, a * 0.6);
      } else if (f.type === 'travel') {
        // 一点光从 a 飞到 b（国归于大卫、灯回锡安）
        const s = U.easeInOut(clamp(e, 0, 1));
        const x = lerp(f.x0, f.x1, s) * W.w, y = lerp(f.y0, f.y1, s) * W.h - Math.sin(Math.PI * s) * W.h * 0.12;
        glowAt(ctx, SP.gold, x, y, 40 * un, 0.9 * (1 - sm(0.9, 1, e)));
        glowAt(ctx, SP.white, x, y, 12 * un, 1 - sm(0.9, 1, e));
      } else if (f.type === 'rise') {
        // 祷告达到天上（代下 30:27）
        for (let i = 0; i < 40; i++) {
          const s = clamp(e * 1.6 - U.hash1(i * 3 + 1) * 0.6, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const x0 = lerp(f.x0, f.x1, U.hash1(i * 7 + 2)) * W.w, y0 = gY(2, x0 / W.w) - PH(2);
          const x = x0 + Math.sin(s * 6 + i) * 8 * un, y = lerp(y0, -10, s);
          ctx.globalAlpha = Math.sin(Math.PI * s) * 0.8;
          ctx.fillStyle = 'rgb(255, 236, 196)';
          ctx.fillRect(x - un, y - un, 2 * un, 2 * un);
        }
      } else if (f.type === 'messengers') {
        // 从早起来差遣使者（代下 36:15）：光一再飞向城中，又被吹灭
        const t0 = temple();
        for (let i = 0; i < 6; i++) {
          const s = clamp(e * 2.2 - i * 0.22, 0, 1);
          if (s <= 0 || s >= 1) continue;
          const tx = lerp(X('city')[0] + 0.03, X('city')[1] - 0.2, U.hash1(i + 4)) * W.w, ty = gY(1, tx / W.w) - PH(1);
          const sx = t0.x0 + 0.12 * t0.tu, sy = t0.top - 0.2 * t0.tu;
          const q = clamp(s / 0.7, 0, 1), x = lerp(sx, tx, q), y = lerp(sy, ty, q) - Math.sin(Math.PI * q) * W.h * 0.1;
          const a = s < 0.7 ? 1 : 1 - (s - 0.7) / 0.3;
          glowAt(ctx, SP.gold, x, y, 22 * un, a * 0.8);
        }
      } else if (f.type === 'sweep') {
        // 耶和华的使者进入亚述王营中（代下 32:21）
        const [a, b] = X('camp');
        const x = lerp(b + 0.04, a - 0.03, U.easeInOut(clamp(e, 0, 1))) * W.w, g = gY(1, lerp(a, b, 0.5));
        glowAt(ctx, SP.white, x, g - PH(1) * 1.2, W.w * 0.1, 0.6 * Math.sin(Math.PI * e));
        ctx.globalAlpha = 0.3 * Math.sin(Math.PI * e);
        ctx.drawImage(SP.soft, x - W.w * 0.035, W.h * 0.12, W.w * 0.07, g - W.h * 0.12);
      } else if (f.type === 'heal') {
        // 医治他们的地：一道绿光在地上漫开
        const R = e * W.w * 0.9, x = f.x * W.w;
        for (const l of [2, 1]) {
          ctx.globalAlpha = 0.35 * (1 - e);
          ctx.save(); ctx.translate(x, gY(l, f.x)); ctx.scale(1, 0.12);
          ctx.drawImage(SP.green, -R, -R, R * 2, R * 2);
          ctx.restore();
        }
      } else if (f.type === 'lights') {
        // 大卫的家：一行灯沿着远山点起（直到永远）
        const n = 11;
        for (let i = 0; i < n; i++) {
          const s = clamp(e * 1.8 - i / n, 0, 1);
          if (s <= 0) continue;
          const xf = lerp(X('palace') + 0.02, 0.99, Math.pow(i / (n - 1), 0.8)), y = gY(0, xf) - PH(0) * 0.8, z = (1 - i / n * 0.5);
          glowAt(ctx, SP.gold, xf * W.w, y, 16 * un * z, Math.min(1, s * 3) * (1 - sm(0.7, 1, e)) * 0.75 * z);
        }
      } else if (f.type === 'steps') {
        // 桑树梢上的脚步声：光一步一步走过树梢
        f.pts.forEach((q, i) => {
          const s2 = clamp((f.t - i * 0.4) / 1.1, 0, 1);
          if (s2 <= 0 || s2 >= 1) return;
          const x = q[0] * W.w, y = q[1] * W.h;
          glowAt(ctx, SP.gold, x, y, 60 * un * (0.5 + s2), 0.8 * Math.sin(Math.PI * s2));
          ctx.strokeStyle = U.rgba(255, 240, 200, 0.6 * (1 - s2));
          ctx.lineWidth = 1.2 * un;
          ctx.beginPath(); ctx.ellipse(x, y, 40 * un * s2, 14 * un * s2, 0, 0, TAU); ctx.stroke();
        });
      } else if (f.type === 'lots') {
        // 掣签：各人头上亮一下
        f.pts.forEach((xf, i) => {
          const s2 = clamp((f.t - i * 0.25) / 0.9, 0, 1);
          if (s2 <= 0 || s2 >= 1) return;
          glowAt(ctx, SP.gold, xf * W.w, gY(2, xf) - PH(2) * 1.35, 22 * un, Math.sin(Math.PI * s2));
        });
      } else if (f.type === 'rays') {
        // 殿门大开：光从门里涌出来，铺满院子
        const t0 = temple(), tu = t0.tu, dx = t0.x0 + 0.12 * tu, dy = t0.top - 0.16 * tu * t0.vk;
        const a = Math.min(1, f.t / 0.3) * (1 - sm(0.4, 1, e));
        glowAt(ctx, SP.gold, dx, dy, tu * (0.6 + 1.2 * e), a * 0.7);
        ctx.globalAlpha = a * 0.5;
        for (let i = 0; i < 7; i++) {
          const ang = Math.PI + (i - 3) * 0.13, L = tu * (0.6 + 1.6 * U.easeOut(clamp(e * 1.4, 0, 1))) * (0.8 + 0.3 * U.hash1(i));
          ctx.save(); ctx.translate(dx, dy); ctx.rotate(ang - Math.PI / 2);
          ctx.drawImage(SP.beam, -tu * 0.04, 0, tu * 0.08, L);
          ctx.restore();
        }
      } else if (f.type === 'burst') {
        const x = f.xf * W.w, y = gY(f.l, f.xf) - PH(f.l) * 0.8;
        glowAt(ctx, SP.white, x, y, PH(f.l) * 6 * (0.5 + e), 0.8 * (1 - e));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 扫罗头上将熄的灯（代上 10）：一点小火，他倒下时摇曳、暗下去、熄灭
  const saulLampXY = () => { const xf = X('gil'); return [xf * W.w, gY(1, xf) - PH(1) * 1.55]; };
  function drawSaul(ctx) {
    const k = lv('chSaul');
    if (k < 0.01) return;
    sprites();
    const un = Math.max(0.6, W.unit), [x, y] = saulLampXY(), gut = 1 - clamp(W.lt.chSaul, 0, 1);
    const fl = (0.84 + 0.16 * Math.sin(W.t * 9.3)) * (1 - gut * 0.7 * Math.max(0, Math.sin(W.t * 13.1) * Math.sin(W.t * 4.7)));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y, 46 * un * (0.4 + 0.6 * k), k * (0.35 + 0.35 * nightK()) * fl);
    glowAt(ctx, SP.gold, x, y, 14 * un, k * 0.9 * fl);
    const h = 6 * un * (0.4 + 0.6 * k) * fl, w = 1.8 * un;
    ctx.globalAlpha = clamp(k * 1.2, 0, 1);
    ctx.fillStyle = 'rgb(255, 226, 150)';
    ctx.beginPath();
    ctx.moveTo(x - w, y + h * 0.3); ctx.quadraticCurveTo(x - w, y - h * 0.4, x + Math.sin(W.t * 6) * w * (0.3 + gut), y - h);
    ctx.quadraticCurveTo(x + w, y - h * 0.4, x + w, y + h * 0.3); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = css([130, 96, 56], 1, clamp(k * 1.5, 0, 1));
    ctx.beginPath(); ctx.ellipse(x, y + h * 0.42, w * 2, w * 0.7, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 情节里写在人头上的名（诸王）：跟着那人的头
  function drawNames(ctx) {
    if (!S.names.length) return;
    const px = Math.round(clamp(17 * W.unit, 13, 21));
    for (const n of S.names) {
      const age = W.t - n.t0;
      if (age < 0 || age > 6) continue;
      const p = n.id ? fig(n.id) : null;
      // 那人已被挪去（或正在隐去）：名也在半秒内隐去，不留在空处
      if (n.id && n.gone == null && (!p || p.dying)) n.gone = W.t;
      const out = n.gone == null ? 1 : 1 - clamp((W.t - n.gone) / 0.5, 0, 1);
      const a = clamp(age / 0.8, 0, 1) * (1 - sm(4, 6, age)) * out;
      if (a < 0.01) continue;
      const live = p && p._vis && !p.dying;
      if (live) { n.lx = p._x; n.ly = p._y - p._h; }
      const hx = live ? p._x : n.lx != null ? n.lx : n.xf * W.w, hy = live ? p._y - p._h : n.ly != null ? n.ly : gY(n.l, n.xf) - PH(n.l);
      const x = hx, y = hy - PH(n.l) * 0.9 - age * 3 * W.unit;
      const sp = textSprite(n.s, px, [255, 232, 186]);
      ctx.globalAlpha = a;
      ctx.drawImage(sp.c, x - sp.w / 2, y - sp.h / 2, sp.w, sp.h);
    }
    ctx.globalAlpha = 1;
  }
  // 律法书（代下 34:15）：发光的书卷
  function drawScroll(ctx) {
    if (!S.scroll) return;
    const p = fig('hilkiah');
    if (!p || !p._vis) return;
    sprites();
    const h = p._h, f = p.facing || 1, x = p._x + f * h * 0.22, y = p._y - h * 0.62;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y, h * 1.2, 0.6 * p.alpha);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = 'rgb(240, 226, 190)';
    ctx.fillRect(x - h * 0.1, y - h * 0.04, h * 0.2, h * 0.08);
    ctx.fillStyle = 'rgb(150, 110, 70)';
    ctx.fillRect(x - h * 0.12, y - h * 0.06, h * 0.03, h * 0.12);
    ctx.fillRect(x + h * 0.09, y - h * 0.06, h * 0.03, h * 0.12);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  let buildT = 2, heartsOn = false;
  function update(dt) {
    if (!cur()) { FXL.length = 0; return; }
    const f = dt * (W.fast || 1);
    for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    stepLamp(dt, W.replaying);
    // 写在头上的名：过了就丢掉
    if (S.names.length) S.names = S.names.filter(n => W.t - n.t0 < 6.5);
    // 诚实的心：眼目的光走过之处，众人胸中的光亮起来
    const hk = lv('chHearts');
    if (hk > 0.01 || heartsOn) {
      heartsOn = hk > 0.01;
      for (const m of members('ch:isr')) { if (m.chG0 == null) m.chG0 = m.glow || 0.08; m.glow = Math.max(m.chG0, 0.95 * heartLit(hk, m.nx)); }
    }
    // 人群在走的路上把纵深慢慢挪到新的那一行（到了就对齐）
    const c = C();
    if (c && c.crowds) for (const g of c.crowds.values()) for (const m of g.members) {
      if (m.chVT == null) continue;
      if (m.tx == null || W.replaying) { m.v = m.chVT; m.chVT = null; continue; }
      const d = Math.abs(m.tx - m.nx), step = Math.min(1, (m.speed || 0.03) * f / Math.max(0.004, d));
      m.v += (m.chVT - m.v) * step;
    }
    if (W.replaying) return;
    // 殿在建造时：敲打之声与石粉
    if (W.lv.chBuild < W.lt.chBuild - 0.002 && W.lv.chBuild > 0.05) {
      buildT -= dt;
      if (buildT <= 0) {
        buildT = 1.6 + Math.random() * 2;
        const t = temple();
        safe('ch.dust', () => fx().dust(t.x0 + Math.random() * t.tu, t.top - Math.max(t.hH, t.hP) * W.lv.chBuild * 0.8, 6, [228, 214, 186], t.tu * 0.1));
        const a = au(); if (a && a.sfx) safe('ch.sfx', () => a.sfx('build', { soft: true }));
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function beam(b, xf, l, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l: l == null ? 2 : l, w: o.w || 70, k: o.k || 1 });
    if (o.ring !== false) safe('ch.ring', () => fx().ring(xf * W.w, gY(l == null ? 2 : l, xf) - PH(l == null ? 2 : l) * 0.5, [255, 236, 190], M() * (o.r || 0.25), 2.2, 1.8));
  }
  const beamOn = (b, id, o) => { const p = fig(id); if (p) beam(b, p.nx, p.layer == null ? 2 : p.layer, o); };
  function ring(b, x, y, r, rgb) { if (!b.instant) safe('ch.ring', () => fx().ring(x, y, rgb || [255, 232, 186], M() * (r || 0.3), 2.2, 1.6)); }
  function nameAbove(b, s, xf, l, id) {
    if (b.instant) return;
    // 新王的名出来时，同一处（或同一人）先前的名在半秒内隐去，不叠在一起
    for (const n of S.names) if (n.gone == null && ((id && n.id === id) || Math.abs(n.xf - xf) < 0.06)) n.gone = W.t;
    S.names.push({ s, xf, l: l == null ? 2 : l, t0: W.t, id: id || null });
  }
  function fireFall(b, xf) {
    if (b.instant) return;
    S.fireT0 = W.t; S.fireX = xf;
    safe('ch.flash', () => { W.flash = 0.6; W.shake = 0.6; });
  }
  // 利未人的歌唱班与吹号的祭司：站在坛的东边（代下 5:12）
  // 竖屏上院子窄：各三人
  const trumps = () => (tall() ? TRUMP.slice(0, 3) : TRUMP);
  const sings = () => (tall() ? SING.slice(0, 3) : SING);
  function choir(b, o) {
    o = o || {};
    const [p0, p1] = X('pr'), [s0, s1] = X('sg'), T6 = trumps(), S6 = sings();
    T6.forEach((id, i) => {
      const x = lerp(p0, p1, i / Math.max(1, T6.length - 1));
      if (!alive(id)) add(id, { label: '吹号的祭司', x: o.fromX != null ? o.fromX + i * 0.012 : x, facing: 1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.2, v: vAt(x, X('prK')) });
      if (o.walk) walk(id, x, { speed: o.speed || 0.035, pose: o.pose || 'stand' }); else if (o.pose) pose(id, o.pose);
    });
    S6.forEach((id, i) => {
      const x = lerp(s0, s1, i / Math.max(1, S6.length - 1));
      if (!alive(id)) add(id, { label: '歌唱的利未人', x: o.fromX != null ? o.fromX + 0.08 + i * 0.012 : x, facing: 1, robe: i % 2 ? LINEN2 : LINEN, hair: 'cloth', accent: [196, 186, 160], glow: 0.2, v: vAt(x, X('sgK')) });
      if (o.walk) walk(id, x, { speed: o.speed || 0.035, pose: o.pose || 'stand' }); else if (o.pose) pose(id, o.pose);
    });
  }
  // 回到院中的两排（站定的纵深也一并放回）
  function choirHome() {
    const [p0, p1] = X('pr'), [s0, s1] = X('sg'), T6 = trumps(), S6 = sings();
    T6.forEach((id, i) => { const x = lerp(p0, p1, i / Math.max(1, T6.length - 1)); add(id, { v: vAt(x, X('prK')) }); walk(id, x, { speed: 0.035, pose: 'stand' }); face(id, 1); });
    S6.forEach((id, i) => { const x = lerp(s0, s1, i / Math.max(1, S6.length - 1)); add(id, { v: vAt(x, X('sgK')) }); walk(id, x, { speed: 0.035, pose: 'stand' }); face(id, 1); });
  }
  function choirPose(p, tp) { TRUMP.forEach(id => pose(id, tp || p)); SING.forEach(id => pose(id, p)); }
  function choirOff() { TRUMP.concat(SING).forEach(id => rm(id)); }
  // 一位王：到院中，头上金冠（金色的包头），名字浮在头上
  function king(b, id, name, o) {
    o = o || {};
    const x = o.x != null ? o.x : X('king'), K = o.K != null ? o.K : X('kingK');
    add(id, KING(o.robe, { label: name, x: o.fromX != null ? o.fromX : x, facing: o.facing || 1, age: o.age || 'adult', from: o.from || 'fade', v: vAt(x, K) }));
    if (o.fromX != null) walk(id, x, { speed: o.speed || 0.04, pose: o.pose || 'stand' });
    else if (o.pose) pose(id, o.pose);
    nameAbove(b, name, x, 2, id);
  }
  // 以色列众人：院中前景横的几行，面朝殿
  function israel(b, o) {
    o = o || {};
    const [a, c] = isrSpan();
    const had = hasCrowd('ch:isr');
    crowd('ch:isr', { n: o.n || (tall() ? 10 : 14), x0: a, x1: c, layer: 2, label: '以色列众人', v: 0.35 });
    if (!had) arrange('ch:isr', isrRows(), { face: 1, pose: o.pose });
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  const TINT = [255, 232, 190];
  GS.book.act({
    id: ACT, book: '历代志', books: [13, 14], title: '历代', sub: '历代志上 1 — 历代志下 36', tint: TINT, music: 'babel',
    intro: [
      { text: '亚当生塞特；塞特生以挪士；以挪士生该南；……<br>拉麦生挪亚；挪亚生闪、含、雅弗。', ref: '历代志上 1:1–4', hold: 6 },
      { text: '以色列的儿子是吕便……犹大……七子大卫。……<br>大卫在耶路撒冷所生的儿子是……拿单、所罗门。', ref: '历代志上 2:1—3:5', hold: 7 },
    ],
    outro: 20,
    behold: {
      '雅比斯': { text: '雅比斯求告以色列的神说：「甚愿你赐福与我，扩张我的境界，常与我同在，保佑我不遭患难，不受艰苦。」<br>神就应允他所求的。', ref: '历代志上 4:10' },
      '大卫': { text: '大卫日见强盛，因为万军之耶和华与他同在。', ref: '历代志上 11:9' },
      '所罗门': { text: '所罗门王的财宝与智慧胜过天下的列王。', ref: '历代志下 9:22' },
      '扫罗': { text: '这样，扫罗死了。因为他干犯耶和华，没有遵守耶和华的命；', ref: '历代志上 10:13' },
      '大卫城': { text: '然而大卫攻取锡安的保障，就是大卫的城。', ref: '历代志上 11:5' },
      '耶路撒冷': { text: '迦勒底人焚烧神的殿，拆毁耶路撒冷的城墙，用火烧了城里的宫殿，毁坏了城里宝贵的器皿。', ref: '历代志下 36:19' },
      '大卫的宫': { text: '大卫住在自己宫中，对先知拿单说：「看哪，我住在香柏木的宫中，耶和华的约柜反在幔子里。」', ref: '历代志上 17:1' },
      '约柜': { text: '祭司将耶和华的约柜抬进内殿，就是至圣所，放在两个基路伯的翅膀底下。', ref: '历代志下 5:7' },
      '大卫的帐幕': { text: '众人将神的约柜请进去，安放在大卫所搭的帐幕里，就在神面前献燔祭和平安祭。', ref: '历代志上 16:1' },
      '阿珥楠的禾场': { text: '耶和华的使者吩咐迦得去告诉大卫，叫他上去，在耶布斯人阿珥楠的禾场上为耶和华筑一座坛；', ref: '历代志上 21:18' },
      '耶和华的使者': { text: '耶和华吩咐使者，他就收刀入鞘。', ref: '历代志上 21:27' },
      '建殿的材料': { text: '我在困难之中为耶和华的殿预备了金子十万他连得，银子一百万他连得，铜和铁多得无法可称；<br>我也预备了木头、石头，你还可以增添。', ref: '历代志上 22:14' },
      '殿的样式': { text: '说：「这一切工作的样式都是耶和华用手划出来使我明白的。」', ref: '历代志上 28:19' },
      '耶和华的殿': { text: '现在我已选择这殿，分别为圣，使我的名永在其中，<br>我的眼、我的心也必常在那里。', ref: '历代志下 7:16' },
      '殿的废墟': { text: '这就应验耶和华藉耶利米口所说的话：地享受安息；<br>因为地土荒凉便守安息，直满了七十年。', ref: '历代志下 36:21' },
      '雅斤': { text: '将两根柱子立在殿前，一根在右边，一根在左边；<br>右边的起名叫雅斤，左边的起名叫波阿斯。', ref: '历代志下 3:17' },
      '波阿斯': { text: '将两根柱子立在殿前，一根在右边，一根在左边；<br>右边的起名叫雅斤，左边的起名叫波阿斯。', ref: '历代志下 3:17' },
      '铜坛': { text: '所罗门祈祷已毕，就有火从天上降下来，烧尽燔祭和别的祭。耶和华的荣光充满了殿；', ref: '历代志下 7:1' },
      '铜海': { text: '又铸一个铜海，样式是圆的，高五肘，径十肘，围三十肘；', ref: '历代志下 4:2' },
      '坛': { text: '大卫在那里为耶和华筑了一座坛，献燔祭和平安祭，求告耶和华。<br>耶和华就应允他，使火从天降在燔祭坛上。', ref: '历代志上 21:26' },
      '吹号的祭司': { text: '……同着他们有一百二十个祭司吹号。', ref: '历代志下 5:12' },
      '歌唱的利未人': { text: '吹号的、歌唱的都一齐发声，声合为一，赞美感谢耶和华。', ref: '历代志下 5:13' },
      '以色列众人': { text: '……以色列众人看见，就在铺石地俯伏叩拜，称谢耶和华说：<br>耶和华本为善，他的慈爱永远长存！', ref: '历代志下 7:3' },
      '大卫的灯': { text: '耶和华却因自己与大卫所立的约，不肯灭大卫的家，<br>照他所应许的，永远赐灯光与大卫和他的子孙。', ref: '历代志下 21:7' },
      '示巴女王': { text: '示巴女王听见所罗门的名声，就来到耶路撒冷，要用难解的话试问所罗门；<br>跟随她的人甚多，又有骆驼驮着香料、宝石，和许多金子。', ref: '历代志下 9:1' },
      '基遍的会幕': { text: '所罗门和会众都往基遍的邱坛去，因那里有神的会幕，<br>就是耶和华仆人摩西在旷野所制造的。', ref: '历代志下 1:3' },
      '约阿施': { text: '于是领王子出来，给他戴上冠冕，将律法书交给他，立他作王。<br>耶何耶大和众子膏他，众人说：「愿王万岁！」', ref: '历代志下 23:11' },
      '希西家': { text: '凡他所行的，无论是办神殿的事，是遵律法守诫命，是寻求他的神，都是尽心去行，无不亨通。', ref: '历代志下 31:21' },
      '约西亚': { text: '约西亚在世的日子，就跟从耶和华他们列祖的神，总不离开。', ref: '历代志下 34:33' },
      '归回的人': { text: '你们中间凡作他子民的，可以上去，<br>愿耶和华他的神与他同在。', ref: '历代志下 36:23' },
      '归回的路': { text: '波斯王塞鲁士元年，耶和华为要应验藉耶利米口所说的话，<br>就激动波斯王塞鲁士的心，使他下诏通告全国，说：', ref: '历代志下 36:22' },
      '堆垒': { text: '……就是十分取一之物，尽都送来，积成堆垒；', ref: '历代志下 31:6' },
    },
    setup() {
      // 犹大的山地：略干的草场，锡安与摩利亚山
      W.set('bare', 0.16, true); W.set('bloom', 0.5, true);
      S = fresh(); FXL.length = 0; TG = null; CITY = null; RL = null; lampPos.init = false;
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 0.85, trees: 0.3,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      for (const k in LV) W.set(k, 0, true);
      W.set('chRiver', 1, true);
      W.set('chCity', 0.3, true);
      W.set('chFloor', 1, true);
      W.set('chObed', 1, true);
      W.set('chDoor', 1, true);
      // 树只在西边（右缘）：锡安与摩利亚一带开阔
      const tx = W.w * 0.995, gx = W.w * 0.6;
      W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
      W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
      W.freeClock = false;
      W.goTo(0.215, 0, true);
      const lx = W.w * 0.4, ly = W.ridgeBaseY(2, lx);
      W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 30, W.w * 0.55, W.h * 0.3, true);
      W.setPop('cattle', 0, lx, ly, true);      // 院子里不放牛羊（牲畜只在需要时由情节牵来）
      W.setPop('beast', 0, lx, ly, true);
      W.setPop('creeper', 14, lx, ly, true);
      W.setPop('human', 0, lx, ly, true);
      S.riverT0 = W.t;
      cast().clear({ fade: false });
      avoid([0.34, 0.99]);
    },
    stages: [
      // ── 代上 1—10：众名之河；雅比斯；扫罗死了（头上的灯熄了），国归于大卫 ─────────
      {
        kind: 'act', utter: '神就应允他所求的', cmd: 'git log --graph 亚当..大卫  # 雅比斯：已应允', ref: '4:10',
        verse: [
          { text: '雅比斯求告以色列的神说：「甚愿你赐福与我，扩张我的境界……」<br>神就应允他所求的。', ref: '历代志上 4:10', hold: 6 },
          { text: '……他们在阵上呼求神，倚赖神，神就应允他们。<br>……大卫派人在耶和华殿中管理歌唱的事。', ref: '历代志上 5:20—6:31', hold: 6.5 },
          { text: '……嫩的儿子是约书亚。……基士生扫罗……<br>以色列人都按家谱计算……', ref: '历代志上 7:27—9:1', hold: 5 },
          { text: '这样，扫罗死了……所以耶和华使他被杀，<br>把国归于耶西的儿子大卫。', ref: '历代志上 10:13–14', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              S.w1T0 = b.instant ? -1e9 : W.t;
              W.goTo(0.32, 22, b.instant);
              add('jabez', { label: '雅比斯', x: X('jabez'), facing: -1, robe: [132, 104, 80], glow: 0.45, from: 'light', pose: 'pray' });
            }],
            [1.2, b => { beamOn(b, 'jabez', { dur: 6, r: 0.22 }); sfx(b, 'harp'); }],
            [3, b => {
              // 扩张我的境界：金线沿着地向两边展开，地上开花
              W.set('chBorder', 1, b.instant);
              W.set('chBorderA', 1, b.instant);
              W.set('bloom', 0.9, b.instant);
              W.set('bare', 0.05, b.instant);
              glow('jabez', 0.8);
            }],
            [8, () => { pose('jabez', 'stand'); }],
            [13, b => {
              // 基利波山上的扫罗（不画刀剑：他的死只用光来讲）：头上一盏将熄的灯
              add('saul', { label: '扫罗', layer: 1, x: X('gil'), facing: -1, robe: [128, 52, 56], hair: 'cloth', accent: [210, 170, 90], glow: 0.5, prop: null });
              W.set('chSaul', 1, b.instant);
              W.set('chBorderA', 0.3, b.instant);
              walk('jabez', 0.47, { speed: 0.02 });
            }],
            // 扫罗仆倒：灯摇曳、暗下去、熄灭
            [19, b => { pose('saul', 'fall'); glow('saul', 0); W.set('chSaul', 0, b.instant); }],
            [20.5, b => {
              // 国归于耶西的儿子大卫：一点光自那将熄的灯飞到牧羊的少年那里
              add('david', { label: '大卫', x: X('dav') + 0.05, facing: -1, robe: [122, 98, 70], glow: 0.55, from: 'light', age: 'adult', scale: 0.92 });
              herd('ch:flock', { kind: 'sheep', n: 5, x0: X('dav') + 0.08, x1: X('dav') + 0.17, layer: 2, label: '羊群' });
              const sy = saulLampXY()[1] / W.h;
              flash(b, { type: 'travel', dur: 3, x0: X('gil'), y0: sy, x1: X('dav') + 0.05, y1: gY(2, X('dav') + 0.05) / W.h - 0.07 });
              rm('jabez');
            }],
            [23.5, b => { rm('saul'); glow('david', 0.9); ring(b, (X('dav') + 0.05) * W.w, gY(2, X('dav') + 0.05) - PH(2) * 0.6, 0.2); sfx(b, 'harp', { soft: true }); }],
            [25, b => { W.set('chRiver', 0, b.instant); }],
          ]);
        },
      },

      // ── 代上 11—14：大卫在希伯仑受膏；锡安；大军；约柜坐新车；桑树梢上的脚步声 ─────
      {
        kind: 'promise', utter: '你必牧养我的民以色列', cmd: 'sudo anoint 大卫 --king 以色列 && mount 锡安', ref: '11:2',
        verse: [
          { text: '……他们就膏大卫作以色列的王……<br>然而大卫攻取锡安的保障，就是大卫的城。', ref: '历代志上 11:3–5', hold: 5.5 },
          { text: '大卫日见强盛……<br>那时天天有人来帮助大卫，以致成了大军，如神的军一样。', ref: '历代志上 11:9—12:22', hold: 5.5 },
          { text: '大卫和以色列众人在神前用琴、瑟、锣、鼓、号作乐，极力跳舞歌唱。', ref: '历代志上 13:8', hold: 5 },
          { text: '「你听见桑树梢上有脚步的声音，就要出战，<br>因为神已经在你前头去……」', ref: '历代志上 14:15', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.55, 22, b.instant);
              W.set('chBorderA', 0, b.instant);
              crowd('ch:elders', { n: 6, x0: 1.02, x1: 1.12, layer: 2, label: '以色列的长老', robe: [150, 132, 104] });
              cwalk('ch:elders', X('dav') + 0.08, X('dav') + 0.18, { speed: 0.05 });
              face('david', 1);
              crm('ch:flock');
            }],
            [3.2, b => {
              // 膏大卫作王
              pose('david', 'kneel');
              beamOn(b, 'david', { dur: 4.5, r: 0.2 });
              sfx(b, 'harp');
            }],
            [5.5, b => {
              add('david', KING(ROYAL, { scale: 1 }));
              pose('david', 'stand');
              glow('david', 0.6);
              cpose('ch:elders', 'bow');
            }],
            [7.5, b => {
              // 攻取锡安的保障：耶布斯成了大卫的城
              W.set('chCity', 0.62, b.instant);
              W.set('chPalace', 1, b.instant);
              walk('david', X('dav') - 0.02, { speed: 0.03, pose: 'point' });
              cwalk('ch:elders', X('dav') + 0.04, X('dav') + 0.14, { speed: 0.03 });
              if (!b.instant) { const p = palaceBox(); fx().dust(p.x, p.g, 26, [224, 206, 170], p.w); sfx(b, 'gate'); }
            }],
            [12, b => {
              // 天天有人来帮助大卫，成了大军
              crowd('ch:army', { n: 12, x0: 1.02, x1: 1.2, layer: 2, label: '大卫的军', robe: [112, 96, 80], prop: 'staff' });
              cwalk('ch:army', 0.7, 0.93, { speed: 0.045 });
              sfx(b, 'crowd', { soft: true });
            }],
            [15.5, b => {
              // 约柜坐新车，牛拉着，众人在神前作乐跳舞
              pose('david', 'stand');
              animal('ch:cart', { kind: 'wagon', x: 1.1, facing: -1, label: '新车' });
              animal('ch:ox1', { kind: 'cow', x: 1.04, facing: -1, label: '牛', follow: 'ch:cart', dx: -0.035 });
              S.ark = 'cart';
              walk('ch:cart', X('obed') - 0.035, { speed: 0.035 });
            }],
            [19, b => {
              crm('ch:elders');
              cwalk('ch:army', 0.62, 0.8, { speed: 0.03, pose: 'raise' });
              walk('david', 0.66, { speed: 0.03, pose: 'raise' });
              sfx(b, 'harp');
            }],
            [22.5, b => {
              // 约柜转到那家（不在经文里说出：只是车停下，约柜留在那家的院中）
              S.ark = 'obed';
              rm('ch:cart'); rm('ch:ox1');
              cpose('ch:army', 'stand');
              pose('david', 'stand');
            }],
            [23.5, b => {
              // 桑树梢上的脚步声：光在右边的树梢上走过，往前头去
              if (!b.instant) {
                const spots = (GS.land && GS.land.treeSpots ? GS.land.treeSpots() : []).filter(q => q.layer === 2 && q.grown > 0.5).sort((a, c) => c.x - a.x).slice(0, 6);
                if (spots.length) flash(b, { type: 'steps', dur: 4.5, pts: spots.map(q => [q.x / W.w, q.top / W.h]) });
                sfx(b, 'wind', { soft: true });
              }
              cwalk('ch:army', 0.5, 0.64, { speed: 0.05 });
              walk('david', 0.55, { speed: 0.04, pose: 'point' });
            }],
            [26.5, b => { flash(b, { type: 'burst', dur: 1.6, xf: 0.52, l: 1 }); sfx(b, 'thunder', { soft: true, far: true }); }],
          ]);
        },
      },

      // ── 代上 15—20：利未人肩抬约柜；帐幕；日落；「他必为我建造殿宇」；大卫得胜 ─────
      {
        kind: 'act', utter: '神赐恩与抬耶和华约柜的利未人', cmd: 'mv 约柜 → 大卫城 --on 利未人的肩 --with 角,号,钹,瑟,琴', ref: '15:26',
        verse: [
          { text: '这样，以色列众人欢呼吹角、吹号、敲钹、鼓瑟、弹琴，<br>……将耶和华的约柜抬上来。', ref: '历代志上 15:28', hold: 6 },
          { text: '众人将神的约柜请进去，安放在大卫所搭的帐幕里……<br>……他的慈爱永远长存！', ref: '历代志上 16:1–34', hold: 5.5 },
          { text: '当夜，神的话临到拿单……<br>「他必为我建造殿宇；我必坚定他的国位直到永远。」', ref: '历代志上 17:3–12', hold: 5.5 },
          { text: '……耶和华都使他得胜。……于是亚兰人不敢再帮助亚扪人了。<br>……人将这冠冕戴在大卫头上。', ref: '历代志上 18:6—20:2', hold: 6.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.set('chTent', 1, b.instant);
              crm('ch:army');
              // 利未人用杠肩抬神的约柜（15:15）
              // 抬约柜的在前，吹号的、歌唱的随后，大卫穿着细麻布的以弗得跳舞，以色列众人欢呼
              const ox = X('obed') - 0.035, tx = X('tent');
              S.bearers = ['lv0', 'lv1', 'lv2', 'lv3'];
              S.bearers.forEach((id, i) => add(id, { label: '抬约柜的利未人', x: ox - 0.027 + i * 0.018, facing: -1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.25 }));
              S.ark = 'poles';
              S.bearers.forEach((id, i) => walk(id, tx + 0.03 + i * 0.018, { speed: 0.03, pose: 'stand' }));
              choir(b, { fromX: ox + 0.05, walk: false });
              trumps().forEach((id, i) => walk(id, tx + 0.105 + i * 0.012, { speed: 0.034, pose: 'point' }));
              sings().forEach((id, i) => walk(id, tx + 0.18 + i * 0.012, { speed: 0.036, pose: 'raise' }));
              add('david', KING([236, 230, 214], { label: '大卫', x: 1.14, facing: -1 }));
              walk('david', tx + 0.26, { speed: 0.04, pose: 'raise' });
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 0.6, b.instant);
              crowd('ch:isr', { n: 10, x0: 1.06, x1: 1.2, layer: 2, label: '以色列众人', v: 0.3 });
              cwalk('ch:isr', tx + 0.29, tx + 0.45, { speed: 0.04, pose: 'raise' });
              sfx(b, 'harp'); sfx(b, 'crowd', { soft: true });
            }],
            // 日头平西：约柜安放的时候，天渐渐黑了（「当夜」）
            [12, b => { W.goTo(0.9, 12, b.instant); }],
            [15, b => {
              // 请进去，安放在帐幕里
              S.ark = 'tent';
              S.bearers.forEach((id, i) => walk(id, X('tent') + 0.035 + i * 0.016, { speed: 0.03, pose: 'bow' }));
              S.bearers = [];
              W.set('chPlay', 0.3, b.instant);
              W.set('chSong', 0.35, b.instant);
              cpose('ch:isr', 'bow');
              pose('david', 'raise');
              if (!b.instant) { const x = X('tent') * W.w; ring(b, x, gY(2, X('tent')) - PH(2) * 0.6, 0.22); sfx(b, 'angel'); }
            }],
            [19, b => {
              // 当夜，神的话临到拿单
              W.set('chPlay', 0, b.instant); W.set('chSong', 0, b.instant);
              crm('ch:isr');
              ['lv0', 'lv1', 'lv2', 'lv3'].forEach(id => rm(id));
              choirOff();
              add('david', KING(ROYAL, { label: '大卫' }));
              walk('david', X('tent') + 0.05, { speed: 0.03, pose: 'sit' });
            }],
            [22, b => {
              // 大卫的家：一盏灯在锡安点起；一行灯沿着远山亮起，直到永远；将来的殿的影子
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              flash(b, { type: 'lights', dur: 6 });
              W.set('chPlan', 1, b.instant);
              W.set('chPlanA', 0.22, b.instant);
              sfx(b, 'stars');
            }],
            [25.5, b => {
              // 大卫得胜：远处的战事，掳来的金、银、铜分别为圣（18:8，18:11）
              W.set('chPlanA', 0, b.instant);
              W.set('chMat', 0.3, b.instant);
              pose('david', 'stand');
              flash(b, { type: 'burst', dur: 1.5, xf: 0.6, l: 0 });
              sfx(b, 'thunder', { soft: true, far: true });
            }],
            [28, b => { flash(b, { type: 'burst', dur: 1.5, xf: 0.9, l: 0 }); }],
          ]);
        },
      },

      // ── 代上 21—22:1：「够了，住手吧！」阿珥楠的禾场，火从天降，天亮了 ─────
      {
        kind: 'cmd', utter: '够了，住手吧！', cmd: 'kill -STOP 灭城的天使  # 够了', ref: '21:15', hold: 3,
        verse: [
          { text: '……耶和华看见后悔，就不降这灾了，<br>吩咐灭城的天使说：「够了，住手吧！」', ref: '历代志上 21:15', hold: 5.5 },
          { text: '……耶和华的使者站在天地间，手里有拔出来的刀……<br>大卫和长老都身穿麻衣，面伏于地。', ref: '历代志上 21:16', hold: 6.5 },
          { text: '……耶和华就应允他，使火从天降在燔祭坛上。<br>耶和华吩咐使者，他就收刀入鞘。', ref: '历代志上 21:26–27', hold: 5.5 },
          { text: '大卫说：「这就是耶和华神的殿，为以色列人献燔祭的坛。」', ref: '历代志上 22:1', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 清早（撒下 24:15「从早晨……」），天色阴沉：使者持刀而来；神说够了——刀停在城上
              W.goTo(0.3, 14, b.instant);
              W.set('gloom', 0.3, b.instant);
              W.set('storm', 0.3, b.instant);
              S.angel = 'sword';
              W.set('chAngel', 1, b.instant);
              W.set('chSword', 1, b.instant);
              add('ornan', { label: '阿珥楠', x: altX() + 0.03, facing: -1, robe: [140, 120, 90], glow: 0.2, pose: 'carry' });
              animal('ch:oxA', { kind: 'cow', x: altX() + 0.075, facing: -1, label: '牛' });
              if (!b.instant) { W.flash = 0.35; sfx(b, 'wind'); }
            }],
            [2, b => { const g = angelGeom(); ring(b, g.x, g.y, 0.45, [255, 248, 230]); sfx(b, 'angel'); }],
            [7.5, b => {
              // 大卫和长老身穿麻衣，面伏于地（长老在前景排成两行，俯伏时不相压）
              add('david', KING(SACK, { label: '大卫' }));
              walk('david', X('dav') - 0.01, { speed: 0.035, pose: 'fall' });
              crowd('ch:elders', { n: 5, x0: X('eld')[0][0], x1: X('eld')[0][1], layer: 2, label: '长老', robe: SACK, pose: 'fall' });
              arrange('ch:elders', X('eld'), { face: 1, pose: 'fall' });
              pose('ornan', 'bow');
            }],
            [14.5, b => {
              // 在阿珥楠的禾场上筑坛
              pose('david', 'stand');
              walk('david', altX() - 0.035, { speed: 0.035, pose: 'kneel' });
              walk('ornan', altX() + 0.06, { speed: 0.03, pose: 'stand' });
              W.set('chDAltar', 1, b.instant);
              cpose('ch:elders', 'kneel');
              sfx(b, 'build');
            }],
            [17.5, b => {
              // 火从天降在燔祭坛上
              fireFall(b, altX());
              pose('david', 'pray');
              if (!b.instant) sfx(b, 'fire');
            }],
            [18.4, b => {
              // 灾止住了：阴云散去
              W.set('chDFire', 1, b.instant);
              W.set('gloom', 0, b.instant);
              W.set('storm', 0, b.instant);
              cpose('ch:elders', 'fall');
              pose('ornan', 'fall');
            }],
            [21, b => { S.angel = 'sheath'; W.set('chSword', 0, b.instant); if (!b.instant) sfx(b, 'seal'); }],
            [23.5, b => { S.angel = 'gone'; W.set('chAngel', 0, b.instant); }],
            [25, b => {
              // 这就是耶和华神的殿
              pose('david', 'stand');
              face('david', 1);
              W.set('chSite', 1, b.instant);
              rm('ornan'); rm('ch:oxA');
              cpose('ch:elders', 'stand');
              if (!b.instant) { const t = temple(); ring(b, t.x0 + 0.5 * t.tu, t.top, 0.35); sfx(b, 'harp'); }
            }],
          ]);
        },
      },

      // ── 代上 22—27：他的名要叫所罗门；材料；利未人的班次；歌唱的；守门的 ─────
      {
        kind: 'name', utter: '他的名要叫所罗门', cmd: 'name 所罗门  # 太平的人；为我的名建造殿宇', ref: '22:9', hold: 3,
        verse: [
          { text: '「你要生一个儿子，他必作太平的人……他的名要叫所罗门……<br>他必为我的名建造殿宇。」', ref: '历代志上 22:9–10', hold: 6.5 },
          { text: '每日早晚，站立称谢赞美耶和华……<br>都掣签分立，彼此一样。', ref: '历代志上 23:30—24:5', hold: 5 },
          { text: '他们和他们的弟兄学习颂赞耶和华；善于歌唱的共有二百八十八人。', ref: '历代志上 25:7', hold: 5 },
          { text: '他们无论大小，都按着宗族掣签分守各门。……<br>每班是二万四千人，周年按月轮流……', ref: '历代志上 26:13—27:1', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.5, 18, b.instant);
              W.set('chSite', 0.25, b.instant);
              W.set('chDFire', 0.35, b.instant);
              crm('ch:elders');
              add('david', KING(ROYAL, { label: '大卫', age: 'elder' }));
              walk('david', X('dav'), { speed: 0.03, pose: 'stand' });
              add('solomon', { label: '所罗门', x: X('dav2'), facing: -1, age: 'child', robe: [176, 140, 84], glow: 0.6, from: 'light' });
              if (!b.instant) {
                const size = M() * 0.1, cx = clamp(X('dav2') * W.w, size * 1.8, W.w - size * 1.8), cy = tall() ? W.h * 0.44 : W.horizonY * 0.55;
                safe('ch.name', () => fx().nameStr('所罗门', cx, cy, size, [255, 226, 160], () => [cx + (Math.random() - 0.5) * size * 3, cy + (Math.random() - 0.5) * size, [255, 236, 190]], { hold: 3.5 }));
                if (au() && au().nameChime) safe('ch.chime', () => au().nameChime('所'));
              }
            }],
            [3, b => {
              // 材料：石头、香柏木、铜、铁、金、银（22:2–5，14）
              W.set('chMat', 1, b.instant);
              crowd('ch:work', { n: 6, x0: 1.02, x1: 1.12, layer: 2, label: '石匠', robe: [150, 130, 104], prop: 'bundle' });
              cwalk('ch:work', 0.72, 0.9, { speed: 0.05, pose: 'carry' });
              sfx(b, 'build');
            }],
            [9, b => {
              // 利未人、祭司掣签分班：在院中站成两排
              crm('ch:work');
              choir(b, {});
              flash(b, { type: 'lots', dur: 5, pts: [...TRUMP, ...SING].map(id => { const p = fig(id); return p ? p.nx : null; }).filter(v => v != null) });
            }],
            [14.5, b => {
              // 学习颂赞：二百八十八个歌唱的
              W.set('chPlay', 0.8, b.instant);
              W.set('chSong', 0.45, b.instant);
              TRUMP.forEach(id => pose(id, 'point'));
              sfx(b, 'harp');
            }],
            [20, b => {
              W.set('chPlay', 0, b.instant);
              W.set('chSong', 0.15, b.instant);
              TRUMP.forEach(id => pose(id, 'stand'));
              // 守门的与轮班的军
              add('gk0', { label: '守门的', layer: 1, x: cityEdge(0.62)[0] + 0.012, facing: -1, robe: [140, 120, 96], prop: 'staff', glow: 0.2 });
              add('gk1', { label: '守门的', x: 0.96, facing: -1, robe: [140, 120, 96], prop: 'staff', glow: 0.2 });
              crowd('ch:watch', { n: 8, x0: 1.02, x1: 1.12, layer: 1, label: '轮班的军', robe: [112, 96, 80], prop: 'staff' });
              cwalk('ch:watch', 0.66, 0.84, { speed: 0.04 });
              pose('solomon', 'stand');
            }],
          ]);
        },
      },

      // ── 代上 28—29：「我拣选他作我的子」；样式；乐意奉献；大卫老迈，日落时死了 ─────
      {
        kind: 'promise', utter: '我拣选他作我的子', cmd: 'adopt 所罗门 --as 子 && render 殿.样式  # 耶和华用手划出', ref: '28:6',
        verse: [
          { text: '耶和华对我说：『你儿子所罗门必建造我的殿和院宇；<br>因为我拣选他作我的子，我也必作他的父。』', ref: '历代志上 28:6', hold: 7 },
          { text: '「这一切工作的样式都是耶和华用手划出来使我明白的。」', ref: '历代志上 28:19', hold: 5 },
          { text: '耶和华啊，尊大、能力、荣耀、强胜、威严都是你的；<br>凡天上地下的都是你的……', ref: '历代志上 29:11', hold: 5.5 },
          { text: '他年纪老迈，日子满足，享受丰富、尊荣，就死了。<br>他儿子所罗门接续他作王。', ref: '历代志上 29:28', hold: 5.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              crm('ch:watch'); rm('gk0'); rm('gk1');
              W.set('chSong', 0, b.instant);
              add('solomon', { label: '所罗门', age: 'adult', robe: [176, 140, 84], glow: 0.6 });
              walk('solomon', X('dav2'), { speed: 0.03, pose: 'kneel' });
              face('solomon', -1);
              beamOn(b, 'solomon', { dur: 5, r: 0.2 });
              sfx(b, 'harp');
            }],
            [2.5, b => {
              // 殿的样式：金线在殿山之上的空中一笔一笔写出（小小的一卷发光的图）
              W.set('chPlanSky', 1, true);
              W.set('chPlan', 0, true);
              W.set('chPlan', 1, b.instant);
              W.set('chPlanA', 1, b.instant);
              pose('david', 'point');
              face('david', 1);
            }],
            [12.5, b => {
              // 众人乐意奉献；大卫称颂耶和华（众人在院前排成几行）
              israel(b, {});
              pose('david', 'raise');
              pose('solomon', 'stand');
              W.set('chMat', 1, b.instant);
              flash(b, { type: 'rise', dur: 5, x0: isrSpan()[0], x1: isrSpan()[1] });
              sfx(b, 'crowd', { soft: true });
            }],
            [13, b => {
              // 写成了：样式缓缓落到殿基上，淡下去，像地上的一个应许
              W.set('chPlan', 1, true);
              W.set('chPlanSky', 0, b.instant);
              W.set('chPlanA', 0.3, b.instant);
            }],
            [17, () => { cpose('ch:isr', 'bow'); }],
            [19.5, b => {
              // 他年纪老迈，日子满足，就死了：日头西沉
              W.goTo(0.74, 10, b.instant);
              pose('david', 'lie');
              glow('david', 0.1);
              if (!b.instant) sfx(b, 'weep', { soft: true });
            }],
            [24, b => {
              rm('david');
              add('solomon', KING([176, 140, 84], { label: '所罗门', glow: 0.6 }));
              W.set('chLamp', 1, b.instant);
              cpose('ch:isr', 'stand');
              ring(b, X('dav') * W.w, gY(2, X('dav')) - PH(2), 0.2);
            }],
          ]);
        },
      },

      // ── 代下 1—4：基遍的夜，求智慧；夜尽天明，殿在摩利亚山上建成 ─────
      {
        kind: 'ask', utter: '你愿我赐你什么，你可以求', cmd: 'prompt 所罗门 "你愿我赐你什么？"  # → 智慧聪明', ref: '历代志下 1:7', hold: 3.4,
        verse: [
          { text: '「……求你赐我智慧聪明……」<br>神对所罗门说：「……我必赐你智慧聪明……」', ref: '历代志下 1:10–12', hold: 5.5 },
          { text: '天和天上的天，尚且不足他居住的，谁能为他建造殿宇呢？', ref: '历代志下 2:6', hold: 5 },
          { text: '所罗门就在耶路撒冷……摩利亚山上，<br>就是耶布斯人阿珥楠的禾场上……开工建造耶和华的殿。', ref: '历代志下 3:1', hold: 6.5 },
          { text: '……右边的起名叫雅斤，左边的起名叫波阿斯。<br>他又制造一座铜坛……又铸一个铜海……', ref: '历代志下 3:17—4:2', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 当夜，在基遍（黄昏入夜，夜尽天明——一次走完）
              W.goTo(0.4, 22, b.instant);
              crm('ch:isr');
              choirOff();
              W.set('chGibeon', 1, b.instant);
              W.set('chPlanA', 0.1, b.instant);
              rm('solomon');
              add('sol:g', KING([176, 140, 84], { label: '所罗门', layer: 1, x: X('gil') - 0.028, facing: 1, glow: 0.7, from: 'fade', pose: 'kneel' }));
            }],
            [2.5, b => { beam(b, X('gil') - 0.028, 1, { dur: 6, w: 50, r: 0.15 }); sfx(b, 'angel'); }],
            [5.5, b => { glow('sol:g', 1); if (!b.instant) { const p = fig('sol:g'); if (p) fx().sparkle(p.nx * W.w, gY(1, p.nx) - PH(1), 20, [255, 236, 190], 10, 'mid'); } }],
            [10, b => {
              // 所罗门回到耶路撒冷；工人与香柏木
              W.set('chGibeon', 0, b.instant);
              rm('sol:g');
              add('solomon', KING([176, 140, 84], { label: '所罗门', x: X('dav'), facing: 1, glow: 0.6 }));
              crowd('ch:work', { n: 8, x0: 1.02, x1: 1.14, layer: 2, label: '工匠', robe: [150, 130, 104], prop: 'bundle' });
              cwalk('ch:work', 0.72, 0.95, { speed: 0.05, pose: 'carry' });
            }],
            [14.5, b => {
              // 天亮了，开工建造：墙一层一层升起，样式渐渐被石头填满
              W.set('chBuild', 1, b.instant);
              W.set('chPlanA', 0, b.instant);
              W.set('chDFire', 0, b.instant);
              W.set('chSite', 0, b.instant);
              sfx(b, 'build');
            }],
            [23, b => {
              // 铜坛与铜海
              W.set('chDAltar', 0, b.instant);
              W.set('chAltar', 1, b.instant);
              W.set('chSea', 1, b.instant);
              W.set('chFloor', 0, b.instant);
              W.set('chObed', 0, b.instant);
              W.set('chMat', 0, b.instant);
              cwalk('ch:work', 0.93, 1.1, { speed: 0.05 });
              sfx(b, 'build');
            }],
            [26, b => { crm('ch:work'); }],
          ]);
        },
      },

      // ── 代下 5—7:10 ★ 奉献：声合为一，云充满了殿；铜台上的祷告；火从天降；众人俯伏 ─────
      {
        kind: 'act', utter: '耶和华本为善，他的慈爱永远长存', cmd: 'sync 号 钹 琴 瑟 歌 --one-voice && fill 殿 --cloud --fire', ref: '历代志下 5:13', hold: 3.6,
        verse: [
          { text: '吹号的、歌唱的都一齐发声，声合为一……<br>那时，耶和华的殿有云充满……', ref: '历代志下 5:13', hold: 5 },
          { text: '……甚至祭司不能站立供职，因为耶和华的荣光充满了神的殿。<br>……所罗门……向天举手……', ref: '历代志下 5:14—6:13', hold: 6.5 },
          { text: '所罗门祈祷已毕，就有火从天上降下来，烧尽燔祭和别的祭。<br>耶和华的荣光充满了殿；', ref: '历代志下 7:1', hold: 6 },
          { text: '……以色列众人……就在铺石地俯伏叩拜……<br>耶和华本为善，他的慈爱永远长存！', ref: '历代志下 7:3', hold: 5.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 祭司将约柜从帐幕抬进内殿（5:7）；日头渐渐偏西
              W.goTo(0.72, 22, b.instant);
              const t = temple(), door = (t.x0 + 0.12 * t.tu) / W.w;
              S.bearers = ['lv0', 'lv1', 'lv2', 'lv3'];
              S.bearers.forEach((id, i) => add(id, { label: '抬约柜的祭司', x: X('tent') - 0.02 + i * 0.02, facing: 1, robe: LINEN, hair: 'cloth', accent: [206, 196, 170], glow: 0.3 }));
              S.ark = 'poles';
              S.bearers.forEach((id, i) => walk(id, door - 0.03 + i * 0.02, { speed: 0.05 }));
              choir(b, {});
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'stand'));
              W.set('chPlay', 0.8, b.instant);
              W.set('chSong', 0.45, b.instant);
              israel(b, {});
              add('solomon', KING([176, 140, 84], { label: '所罗门', x: X('plat') - 0.045, facing: 1, glow: 0.6, v: vAt(X('plat') - 0.045, X('platK')) }));
              W.set('chTent', 0, b.instant);
              W.set('chPlat', 1, b.instant);
              W.set('chFire', 0.5, b.instant);
            }],
            [4.2, b => {
              S.ark = 'in';
              S.bearers.forEach(id => rm(id));
              S.bearers = [];
            }],
            [5, b => {
              // 声合为一
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'raise'));
              sfx(b, 'angel'); sfx(b, 'harp');
            }],
            [7.5, b => {
              // 云充满了殿，祭司不能站立供职
              W.set('chCloud', 1, b.instant);
              W.set('chGlory', 0.55, b.instant);
              if (!b.instant) sfx(b, 'wind', { soft: true });
            }],
            [10.5, b => {
              TRUMP.forEach(id => pose(id, 'kneel'));
              W.set('chPlay', 0.35, b.instant);
              // 所罗门站在铜台上，跪下，向天举手
              walk('solomon', X('plat'), { speed: 0.03, pose: 'pray' });
              C().attach && C().attach('solomon', null);
            }],
            [12, b => {
              const c2 = C();
              if (c2 && c2.attach) c2.attach('solomon', () => { const p = fig('solomon'); return p ? [p.nx * W.w, platY()] : null; });
            }],
            [18, b => {
              // 火从天上降下来
              fireFall(b, altX());
              W.set('chCloud', 0.6, b.instant);
              sfx(b, 'fire'); sfx(b, 'thunder', { soft: true });
            }],
            [18.9, b => {
              // 以色列众人俯伏（前景的几行，一行一行，不相压）
              W.set('chFire', 1.5, b.instant);
              W.set('chGlory', 1, b.instant);
              cpose('ch:isr', 'fall');
              SING.forEach(id => pose(id, 'kneel'));
              W.set('chSong', 0.7, b.instant);
              W.set('chPlay', 0, b.instant);
            }],
            [24.5, b => {
              W.set('chFire', 1, b.instant);
              W.set('chSong', 0.55, b.instant);
              sfx(b, 'angel');
            }],
          ]);
        },
      },

      // ── 代下 7:11—12：夜间的应许；示巴女王；所罗门死；国分裂（十个支派的灯熄了）；示撒 ─────
      {
        kind: 'promise', utter: '这称为我名下的子民，若是自卑、祷告', cmd: 'if (自卑 && 祷告 && 寻求我面 && 转离恶行) { 垂听(); 赦免(); 医治(地); }', ref: '历代志下 7:14', hold: 3.6,
        verse: [
          { text: '「这称为我名下的子民，若是自卑、祷告，寻求我的面……<br>我必从天上垂听，赦免他们的罪，医治他们的地。」', ref: '历代志下 7:14', hold: 7 },
          { text: '……耶和华的殿全然完毕。……<br>示巴女王听见所罗门的名声，就来到耶路撒冷……', ref: '历代志下 8:16—9:1', hold: 5.5 },
          { text: '……以色列众人都回自己家里去了。……<br>凡立定心意寻求耶和华以色列神的……', ref: '历代志下 10:16—11:16', hold: 5.5 },
          { text: '耶和华见他们自卑，耶和华的话就临到示玛雅说：<br>「他们既自卑，我必不灭绝他们……」', ref: '历代志下 12:7', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 夜间耶和华向所罗门显现（7:12）；远山上十二支派的灯都亮着
              W.goTo(0.92, 9, b.instant);
              C().attach && C().attach('solomon', null);
              add('solomon', KING([176, 140, 84], { label: '所罗门', v: vAt(X('dav') - 0.03, X('kingK')) }));
              walk('solomon', X('dav') - 0.03, { speed: 0.03, pose: 'sit' });
              W.set('chPlat', 0, b.instant);
              W.set('chCloud', 0, b.instant);
              W.set('chGlory', 0.45, b.instant);
              W.set('chFire', 0.6, b.instant);
              W.set('chSong', 0, b.instant);
              W.set('chTribes', 1, b.instant);
              S.one = false;
              cwalk('ch:isr', 1.02, 1.15, { speed: 0.05 });
              choirPose('stand');
            }],
            [3, b => { crm('ch:isr'); beamOn(b, 'solomon', { dur: 6, r: 0.18 }); sfx(b, 'angel'); }],
            [5.5, b => {
              // 医治他们的地
              flash(b, { type: 'heal', dur: 5, x: altX() });
              W.set('bloom', 1, b.instant);
              W.set('bare', 0, b.instant);
              sfx(b, 'harp');
            }],
            [9, b => {
              // 示巴女王的驼队（夜里，月光下）
              choirOff();
              add('solomon', KING([176, 140, 84], { label: '所罗门' }));
              walk('solomon', X('dav') + 0.03, { speed: 0.03, pose: 'stand' });
              face('solomon', 1);
              add('sheba', { label: '示巴女王', sex: 'f', x: 1.06, facing: -1, robe: [150, 64, 112], accent: [236, 200, 110], glow: 0.45 });
              walk('sheba', X('dav') + 0.1, { speed: 0.045, pose: 'bow' });
              animal('ch:cam1', { kind: 'camel', x: 1.12, facing: -1, label: '骆驼', pack: true });
              animal('ch:cam2', { kind: 'camel', x: 1.18, facing: -1, label: '骆驼', pack: true });
              walk('ch:cam1', X('dav') + 0.17, { speed: 0.045 });
              walk('ch:cam2', X('dav') + 0.23, { speed: 0.045 });
              sfx(b, 'camel');
            }],
            [14.5, b => {
              // 所罗门与他列祖同睡
              rm('sheba'); rm('ch:cam1'); rm('ch:cam2');
              pose('solomon', 'lie');
              glow('solomon', 0.1);
            }],
            [17, b => {
              // 国分裂：以色列众人都回自己家里去了——远山上十个支派的灯一盏一盏熄了，只剩犹大与便雅悯
              rm('solomon');
              king(b, 'k:rehob', '罗波安', { robe: ROYAL2 });
              crowd('ch:north', { n: 10, x0: 0.62, x1: 0.8, layer: 2, label: '以色列众人', from: 'fade' });
              cwalk('ch:north', 1.06, 1.25, { speed: 0.04 });
              W.set('chSplit', 1, b.instant);
              crowd('ch:levn', { n: 4, x0: 1.04, x1: 1.12, layer: 2, label: '利未人', robe: LINEN });
              cwalk('ch:levn', X('king') + 0.04, X('king') + 0.1, { speed: 0.035 });
              sfx(b, 'crowd', { soft: true });
            }],
            [21.5, b => {
              // 示撒上来；王和首领自卑
              crm('ch:north');
              crowd('ch:egypt', { n: 8, x0: 1.04, x1: 1.16, layer: 2, label: '埃及的军', robe: [70, 62, 60], prop: 'spear' });
              cwalk('ch:egypt', 0.86, 0.98, { speed: 0.045 });
              pose('k:rehob', 'kneel');
              cpose('ch:levn', 'bow');
            }],
            [25, b => {
              cwalk('ch:egypt', 1.06, 1.2, { speed: 0.04 });
              pose('k:rehob', 'stand');
              glow('k:rehob', 0.6);
            }],
            [27.5, () => { crm('ch:egypt'); crm('ch:levn'); }],
          ]);
        },
      },

      // ── 代下 13—20：夜里耶和华的眼目遍察全地，诚实的心亮起；敌营在海那边；次日清早歌唱的走在军前 ─────
      {
        kind: 'promise', utter: '胜败不在乎你们，乃在乎神', cmd: 'scan --all-earth --for 诚实的心 && send 歌唱的 --before 军', ref: '历代志下 20:15',
        verse: [
          { text: '犹大人……就呼求耶和华……<br>「耶和华啊，惟有你能帮助软弱的，胜过强盛的……」', ref: '历代志下 13:14—14:11', hold: 6 },
          { text: '……你们若寻求他，就必寻见……<br>耶和华的眼目遍察全地，要显大能帮助向他心存诚实的人。', ref: '历代志下 15:2—16:9', hold: 6.5 },
          { text: '他高兴遵行耶和华的道……<br>约沙法一呼喊，耶和华就帮助他……引导民归向耶和华……', ref: '历代志下 17:6—19:4', hold: 6 },
          { text: '耶和华对你们如此说：『……胜败不在乎你们，乃在乎神。』……<br>众人方唱歌赞美的时候，耶和华就派伏兵……', ref: '历代志下 20:15–22', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 夜里，一道柔和的光自东往西走遍全地；所到之处，诚实的心亮起来，亮着不灭
              rm('k:rehob');
              W.set('chTribes', 0, b.instant);
              S.eyesT0 = b.instant ? -1e9 : W.t;
              W.set('chEyes', 1, b.instant);
              W.set('chHearts', 1, b.instant);
              israel(b, {});
              sfx(b, 'harp', { soft: true });
            }],
            [8.5, b => {
              // 摩押人、亚扪人、西珥山人的大军从海那边来（20:2）：营火在岬上
              king(b, 'k:jehosh', '约沙法', { robe: ROYAL });
              S.camp = 'moab';
              W.set('chCampOut', 0, true);
              W.set('chCamp', 1, b.instant);
              sfx(b, 'crowd', { soft: true, far: true });
            }],
            [12, b => {
              // 约沙法和众人面伏于地（20:18）；利未人站起来大声赞美（20:19）；东方渐渐发白
              W.goTo(0.3, 13, b.instant);
              pose('k:jehosh', 'fall');
              cpose('ch:isr', 'fall');
              choir(b, {});
              choirPose('stand');
              W.set('chSong', 0.5, b.instant);
              sfx(b, 'harp');
            }],
            [15.5, b => {
              // 次日清早：歌唱的穿上圣洁的礼服，走在军前；歌声如一道光，落在敌营上
              W.set('chEyes', 0, b.instant);
              pose('k:jehosh', 'stand');
              cpose('ch:isr', 'stand');
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              SING.forEach(id => pose(id, 'raise'));
              TRUMP.forEach(id => pose(id, 'point'));
              sfx(b, 'angel');
            }],
            [20.5, b => {
              // 伏兵：敌营的火一处一处熄灭
              W.set('chCampOut', 1, b.instant);
              const [a, c2] = X('camp');
              flash(b, { type: 'burst', dur: 1.5, xf: lerp(a, c2, 0.3), l: 1 });
              sfx(b, 'thunder', { soft: true, far: true });
            }],
            [23, b => { const [a, c2] = X('camp'); flash(b, { type: 'burst', dur: 1.5, xf: lerp(a, c2, 0.75), l: 1 }); }],
            [26.5, b => {
              W.set('chCamp', 0, b.instant);
              S.camp = 'none';
              S.one = false;
              W.set('chPlay', 0.2, b.instant);
              W.set('chSong', 0.4, b.instant);
              cpose('ch:isr', 'raise');
              SING.forEach(id => pose(id, 'stand'));
            }],
          ]);
        },
      },

      // ── 代下 21—27：亚她利雅的黑暗里，大卫的灯藏在殿中；约阿施出来；银柜；城楼 ─────
      {
        kind: 'act', utter: '永远赐灯光与大卫和他的子孙', cmd: 'while (王) { 灯.keepAlive(大卫家); }', ref: '历代志下 21:7', hold: 3.4,
        verse: [
          { text: '耶和华却因自己与大卫所立的约，不肯灭大卫的家……<br>永远赐灯光与大卫和他的子孙。', ref: '历代志下 21:7', hold: 6 },
          { text: '约阿施……藏在神殿里六年……<br>于是领王子出来，给他戴上冠冕……「愿王万岁！」', ref: '历代志下 22:12—23:11', hold: 6 },
          { text: '众首领和百姓都欢欢喜喜地将银子送来，投入柜中……<br>亚玛谢……只是心不专诚。', ref: '历代志下 24:10—25:2', hold: 5.5 },
          { text: '……他寻求耶和华，神就使他亨通。……<br>约坦在耶和华他神面前行正道，以致日渐强盛。', ref: '历代志下 26:5—27:6', hold: 6 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.goTo(0.5, 22, b.instant);
              W.set('chPlay', 0, b.instant); W.set('chSong', 0, b.instant);
              W.set('chHearts', 0, b.instant);
              S.one = false;
              choirOff();
              crm('ch:isr');
              rm('k:jehosh');
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              if (!b.instant) { ring(b, lampPos.x, lampPos.y, 0.2); sfx(b, 'harp'); }
              king(b, 'k:joram', '约兰', { robe: [90, 60, 70] });
            }],
            [3.5, b => {
              // 亚她利雅篡了国位：全城沉入黑暗；大卫的灯藏进神殿，门缝里透出光来（约阿施藏在神殿里六年）
              rm('k:joram');
              W.set('gloom', 0.62, b.instant);
              S.lamp = 'hidden';
              W.set('chLamp', 1, b.instant);
              W.set('chDoor', 0.3, b.instant);
            }],
            [10, b => {
              // 第七年：领王子出来
              add('jehoiada', { label: '耶何耶大', x: X('king') + 0.07, facing: -1, robe: LINEN, hair: 'cloth', accent: [226, 200, 120], age: 'elder', glow: 0.5, v: vAt(X('king') + 0.07, X('kingK')) });
              king(b, 'joash', '约阿施', { age: 'child', robe: ROYAL, fromX: (temple().x0 - 0.1 * temple().tu) / W.w, speed: 0.03 });
              W.set('chDoor', 1, b.instant);
              israel(b, {});
            }],
            [12.5, b => {
              // 戴上冠冕：黑暗散去，灯回到锡安
              W.set('gloom', 0, b.instant);
              S.lamp = 'zion';
              W.set('chLamp', 1, b.instant);
              cpose('ch:isr', 'raise');
              glow('joash', 0.9);
              if (!b.instant) { const p = fig('joash'); if (p) ring(b, p.nx * W.w, gY(2, p.nx) - PH(2), 0.16); }
              sfx(b, 'crowd');
            }],
            [16, b => {
              // 银柜：众人欢欢喜喜地将银子投入柜中
              W.set('chChest', 1, b.instant);
              rm('jehoiada');
            }],
            [20, b => {
              W.set('chChest', 0, b.instant);
              rm('joash');
              king(b, 'k:amaz', '亚玛谢', { robe: ROYAL2 });
              W.set('chLamp', 0.6, b.instant);
            }],
            [22.5, b => {
              rm('k:amaz');
              king(b, 'k:uzz', '乌西雅', { robe: ROYAL });
              W.set('chTower', 1, b.instant);
              W.set('chLamp', 1, b.instant);
              sfx(b, 'build');
            }],
            [25.5, b => {
              rm('k:uzz');
              king(b, 'k:jotham', '约坦', { robe: ROYAL2 });
              crm('ch:isr');
            }],
          ]);
        },
      },

      // ── 代下 28—33：殿门被封，城中拐角都有坛；门大开，光涌出；逾越节；堆垒；亚述；玛拿西 ─────
      {
        kind: 'act', utter: '耶和华垂听希西家的祷告，就饶恕百姓', cmd: 'git revert 亚哈斯 && open 殿门 && resume 歌', ref: '历代志下 30:20', hold: 3.6,
        verse: [
          { text: '亚哈斯……封锁耶和华殿的门……<br>……元年正月，开了耶和华殿的门，重新修理。', ref: '历代志下 28:24—29:3', hold: 5.5 },
          { text: '……燔祭一献，就唱赞美耶和华的歌……<br>耶和华垂听希西家的祷告，就饶恕百姓。……他们的祷告达到天上的圣所。', ref: '历代志下 29:27—30:27', hold: 7 },
          { text: '……积成堆垒。……<br>耶和华就差遣一个使者进入亚述王营中……', ref: '历代志下 31:6—32:21', hold: 5 },
          { text: '他在急难的时候，就恳求耶和华他的神……<br>玛拿西这才知道惟独耶和华是神。', ref: '历代志下 33:12–13', hold: 5.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 亚哈斯封锁殿门（门上横着门闩）；城中各处的拐角都有坛，冒着黑烟；天色阴沉
              W.goTo(0.7, 24, b.instant);
              rm('k:jotham');
              king(b, 'k:ahaz', '亚哈斯', { robe: [70, 56, 62] });
              W.set('chDoor', 0, b.instant);
              W.set('chGlory', 0, b.instant);
              W.set('chFire', 0, b.instant);
              W.set('chCorner', 1, b.instant);
              W.set('storm', 0.35, b.instant);
              W.set('chLamp', 0.45, b.instant);
              sfx(b, 'seal');
            }],
            [4.5, b => {
              // 希西家
              rm('k:ahaz');
              king(b, 'k:hez', '希西家', { robe: ROYAL, fromX: X('king') - 0.06 });
            }],
            [6.5, b => {
              // 开了耶和华殿的门：光从门里涌出来；拐角的坛都除掉了（30:14）
              W.set('chDoor', 1, b.instant);
              W.set('chGlory', 0.6, b.instant);
              W.set('chCorner', 0, b.instant);
              W.set('storm', 0, b.instant);
              W.set('chLamp', 1, b.instant);
              flash(b, { type: 'rays', dur: 3.5 });
              if (!b.instant) { const t = temple(); ring(b, t.x0 + 0.12 * t.tu, t.top - 0.16 * t.tu * t.vk, 0.3); sfx(b, 'gate'); }
            }],
            [9, b => {
              // 燔祭一献，就唱赞美耶和华的歌；守逾越节的人来到院中
              W.set('chFire', 1, b.instant);
              choir(b, {});
              TRUMP.forEach(id => pose(id, 'point'));
              SING.forEach(id => pose(id, 'raise'));
              W.set('chPlay', 1, b.instant);
              W.set('chSong', 1, b.instant);
              S.one = true;
              S.oneT0 = b.instant ? -1e9 : W.t;
              crowd('ch:pass', { n: tall() ? 10 : 12, x0: 1.02, x1: 1.16, layer: 2, label: '守逾越节的人', v: 0.3 });
              arrange('ch:pass', isrRows(), { walk: true, speed: 0.06, face: 1, pose: 'raise' });
              sfx(b, 'angel');
            }],
            [13, b => { flash(b, { type: 'rise', dur: 6, x0: isrSpan()[0], x1: isrSpan()[1] }); sfx(b, 'stars', { soft: true }); }],
            [16.5, b => {
              // 堆垒；亚述王的营在城外
              W.set('chHeaps', 1, b.instant);
              W.set('chPlay', 0, b.instant); W.set('chSong', 0.2, b.instant);
              S.one = false;
              S.camp = 'assyria';
              W.set('chCampOut', 0, true);
              W.set('chCamp', 1, b.instant);
              pose('k:hez', 'pray');
            }],
            [20, b => {
              // 耶和华差遣一个使者进入亚述王营中
              flash(b, { type: 'sweep', dur: 3 });
              W.set('chCampOut', 1, b.instant);
              sfx(b, 'angel');
            }],
            [23, b => {
              W.set('chCamp', 0, b.instant);
              S.camp = 'none';
              crm('ch:pass');
              choirOff();
              W.set('chSong', 0, b.instant);
              rm('k:hez');
              // 玛拿西：被带到巴比伦，在急难中自卑（海边，东方）；神垂听，他归回耶路撒冷
              king(b, 'k:man', '玛拿西', { robe: [84, 60, 66], x: X('shore')[0] + 0.02, K: X('shoreK'), pose: 'kneel' });
            }],
            [25.5, b => {
              glow('k:man', 0.8);
              walk('k:man', X('king'), { speed: 0.045, pose: 'stand' });
            }],
          ]);
        },
      },

      // ── 代下 34—36:21：律法书；约西亚；使者；焚烧；被掳，走进东方的光里；地享受安息 ─────
      {
        kind: 'act', utter: '因为爱惜自己的民和他的居所', cmd: 'retry --from-early 使者 → 百姓  # 因为爱惜', ref: '历代志下 36:15', hold: 3.4,
        verse: [
          { text: '希勒家对书记沙番说：「我在耶和华殿里得了律法书。」……<br>耶利米为约西亚作哀歌……', ref: '历代志下 34:15—35:25', hold: 6 },
          { text: '……因为爱惜自己的民和他的居所，从早起来差遣使者去警戒他们。<br>他们却嘻笑神的使者……', ref: '历代志下 36:15–16', hold: 6.5 },
          { text: '迦勒底人焚烧神的殿，拆毁耶路撒冷的城墙……<br>凡脱离刀剑的，迦勒底王都掳到巴比伦去……', ref: '历代志下 36:19–20', hold: 6.5 },
          { text: '……地享受安息；因为地土荒凉便守安息，直满了七十年。', ref: '历代志下 36:21', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.set('chHeaps', 0, b.instant);
              rm('k:man');
              king(b, 'k:jos', '约西亚', { robe: ROYAL });
              const t = temple(), door = (t.x0 - 0.1 * t.tu) / W.w;
              add('hilkiah', { label: '希勒家', x: door, facing: -1, robe: LINEN, hair: 'cloth', accent: [226, 200, 120], age: 'elder', glow: 0.4, from: 'fade', v: vAt(X('king') + 0.035, X('kingK')) });
              walk('hilkiah', X('king') + 0.035, { speed: 0.03, pose: 'carry' });
              S.scroll = true;
              israel(b, {});
              sfx(b, 'harp');
            }],
            [4.5, b => {
              // 约西亚死了，众人悲哀
              pose('k:jos', 'lie');
              glow('k:jos', 0.1);
              cpose('ch:isr', 'weep');
              pose('hilkiah', 'weep');
              if (!b.instant) sfx(b, 'weep');
            }],
            [7.5, b => {
              rm('k:jos'); rm('hilkiah'); S.scroll = false;
              S.msgT0 = b.instant ? -1e9 : W.t;
              flash(b, { type: 'messengers', dur: 7 });
              cpose('ch:isr', 'stand');
              W.set('chLamp', 0.5, b.instant);
            }],
            [11.5, b => { cpose('ch:isr', 'point'); W.set('chGlory', 0.2, b.instant); }],
            [14.5, b => {
              // 焚烧神的殿，拆毁城墙（浓烟遮天）；被掳的人低着头，沿着海边慢慢走向东方的光
              W.set('chBurn', 1, b.instant);
              W.set('chRuin', 1, b.instant);
              W.set('storm', 0.4, b.instant);
              W.set('chGlory', 0, b.instant);
              W.set('chFire', 0, b.instant);
              W.set('chDoor', 0.4, b.instant);
              W.set('chTower', 0, b.instant);
              W.set('chExile', 1, b.instant);
              S.lamp = 'exile';
              W.set('chLamp', 0.45, b.instant);
              members('ch:isr').forEach(m => { m.glow = 0.45; });
              const [s0, s1] = X('shore'), K = X('shoreK');
              arrange('ch:isr', [[s0 + 0.014, s1 + 0.035, K - 0.16], [s0, s1 + 0.07, K + 0.06]], { walk: true, speed: 0.024, face: -1, pose: 'bow' });
              if (!b.instant) { W.shake = 0.5; sfx(b, 'fire'); sfx(b, 'weep', { soft: true }); }
            }],
            [20.5, b => { crm('ch:isr'); }],
            [21.5, b => { W.set('chBurn', 0, b.instant); W.set('storm', 0, b.instant); W.set('chExile', 0, b.instant); }],
            [22.5, b => {
              // 地享受安息：火熄了，夜来了；草木覆盖废墟
              W.goTo(0.95, 10, b.instant);
              W.set('chLamp', 0.2, b.instant);
              W.set('chWild', 1, b.instant);
              W.set('bloom', 1, b.instant);
              W.set('grass', 1, b.instant);
            }],
          ]);
        },
      },

      // ── 代下 36:22–23：塞鲁士的诏书——夜尽天明，光转向归家的路 ─────
      {
        kind: 'act', utter: '激动波斯王塞鲁士的心', cmd: 'exec 塞鲁士 --decree "可以上去"  # 七十年满', ref: '历代志下 36:22', hold: 3.2,
        verse: [
          { text: '波斯王塞鲁士元年……耶和华……就激动波斯王塞鲁士的心，<br>使他下诏通告全国，说：', ref: '历代志下 36:22', hold: 6 },
          { text: '「波斯王塞鲁士如此说：耶和华天上的神已将天下万国赐给我，<br>又嘱咐我在犹大的耶路撒冷为他建造殿宇。', ref: '历代志下 36:23', hold: 7 },
          { text: '你们中间凡作他子民的，可以上去，<br>愿耶和华他的神与他同在。」', ref: '历代志下 36:23', hold: 5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              // 东方破晓
              W.goTo(0.26, 12, b.instant);
              W.set('chEast', 1, b.instant);
              sfx(b, 'wind', { soft: true });
            }],
            [3, b => { sfx(b, 'harp'); }],
            [6.5, b => {
              // 归回的路：自东方越过海面，上岸，到锡安
              W.set('chRoad', 1, b.instant);
              S.lamp = 'home';
              W.set('chLamp', 1, b.instant);
            }],
            [13.5, b => {
              const [s0, s1] = X('shore');
              crowd('ch:ret', { n: tall() ? 10 : 12, x0: s0, x1: s1, layer: 2, label: '归回的人', from: 'light', glow: 0.35, v: 0.2 });
              arrange('ch:ret', [[s0, s1, X('shoreK')]], {});
              arrange('ch:ret', isrRows(), { walk: true, speed: 0.024, face: 1, pose: 'stand' });
              sfx(b, 'crowd', { soft: true });
            }],
            [20, b => {
              S.lamp = 'zion';
              W.set('chEast', 0.5, b.instant);
              if (!b.instant) sfx(b, 'harp');
            }],
            [22.5, () => { cpose('ch:ret', 'kneel'); }],
          ]);
        },
      },
    ],

    scene: {
      init() { sprites(); loadFonts(); },
      resize() { TG = null; CITY = null; RL = null; lampPos.init = false; },
      update,
      drawUnder(ctx, pass) {
        if (!cur()) return;
        if (pass === 'sky') { drawEast(ctx); drawBurnSky(ctx); return; }
        if (pass === 'far') { drawTribes(ctx); return; }
        if (pass === 'mid') { drawCity(ctx); drawPalace(ctx); drawCorners(ctx); drawBurn(ctx, 'mid'); drawGibeon(ctx); drawCamp(ctx); return; }
        if (pass === 'seaNear') { drawRoadSea(ctx); return; }
        if (pass === 'near') {
          drawBorder(ctx);
          drawRoadLand(ctx);
          drawFloor(ctx);
          drawSite(ctx);
          drawObed(ctx);
          drawTent(ctx);
          drawGloryBack(ctx);
          drawMaterials(ctx);
          drawTemple(ctx);
          drawCloud(ctx, false);
          drawSea(ctx);
          drawHeaps(ctx);
          drawDAltar(ctx);
          drawAltar(ctx);
          drawPlatform(ctx);
          drawChest(ctx);
          drawBurn(ctx, 'near');
        }
      },
      draw(ctx, pass) {
        if (!cur()) return;
        if (pass !== 'air') return;
        drawPlan(ctx);
        drawArk(ctx);
        drawGloryFront(ctx);
        drawCloud(ctx, true);
        drawInstruments(ctx);
        drawSong(ctx);
        drawScroll(ctx);
        drawEyes(ctx);
        drawAngel(ctx);
        drawFireFall(ctx);
        drawFXL(ctx);
        drawLamp(ctx);
        drawSaul(ctx);
        drawExileLight(ctx);
        drawRiver(ctx);
        drawNames(ctx);
      },
      reset() { FXL.length = 0; },
      restore() { FXL.length = 0; TG = null; CITY = null; RL = null; stepLamp(0, true); },
      sig() {
        return { ark: S.ark, bearers: S.bearers.slice(), angel: S.angel, lamp: S.lamp, camp: S.camp, scroll: S.scroll, one: S.one };
      },
      pick(x, y, r) {
        if (!cur()) return null;
        let best = null;
        const put = (label, px, py, d) => { if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
        const t = temple(), hn = PH(2), hm = PH(1);
        if (lv('chBuild') > 0.3 && x > t.x0 - STP * t.tu && x < t.x1 + 0.03 * t.tu && y > t.top - t.hP && y < t.base) {
          const ruin = lv('chRuin') > 0.5;
          if (!ruin && lv('chBuild') > 0.9 && x < t.x0 - 0.01 * t.tu && x > t.x0 - 0.13 * t.tu) put(x < t.x0 - 0.07 * t.tu ? '雅斤' : '波阿斯', x, t.top - 0.5 * t.tu * t.vk, r * 0.5);
          else put(ruin ? '殿的废墟' : '耶和华的殿', t.x0 + 0.5 * t.tu, t.top - t.hP - 10, r * 0.7);
        }
        const A = altarGeom();
        if (lv('chAltar') > 0.5) put('铜坛', A.x, A.g - A.h - 12, Math.hypot(x - A.x, y - (A.g - A.h * 0.5)));
        else if (lv('chDAltar') > 0.5) put('坛', A.x, A.g - hn * 0.4, Math.hypot(x - A.x, y - (A.g - hn * 0.2)));
        else if (lv('chFloor') > 0.5) put('阿珥楠的禾场', A.x, A.g - hn * 0.5, Math.hypot(x - A.x, (y - A.g) * 2));
        if (lv('chSea') > 0.5 && lv('chRuin') < 0.5) { const sx = seaX() * W.w, sg = gY(2, seaX()); put('铜海', sx, sg - 0.12 * t.tu, Math.hypot(x - sx, y - (sg - 0.07 * t.tu))); }
        if (lv('chTent') > 0.5) { const tx = X('tent') * W.w, tg = gY(2, X('tent')); put('大卫的帐幕', tx, tg - hn * 1.3, Math.hypot(x - tx, y - (tg - hn * 0.5))); }
        const ap = arkPos();
        if (ap) put('约柜', ap.x, ap.y - hn * 0.5, Math.hypot(x - ap.x, y - ap.y));
        if (lv('chCity') > 0.2) {
          const [a, b2] = cityEdge(lv('chCity'));
          if (x > a * W.w && x < b2 * W.w) { const gy = gY(1, x / W.w); if (y > gy - hm * 2.2 && y < gy + hm * 0.4) put(lv('chCity') > 0.8 ? '耶路撒冷' : lv('chCity') > 0.5 ? '大卫城' : '耶布斯', x, gy - hm * 2.3, r * 0.75); }
          if (lv('chPalace') > 0.5) { const p = palaceBox(); put('大卫的宫', p.x, p.g - p.h - 8, Math.hypot(x - p.x, y - (p.g - p.h * 0.5)) * 1.2); }
        }
        if (lv('chLamp') > 0.3 && S.lamp !== 'none') put('大卫的灯', lampPos.x, lampPos.y - 12, Math.hypot(x - lampPos.x, y - lampPos.y));
        if (lv('chMat') > 0.3 && lv('chBuild') < 0.3 && x > t.x0 && x < t.x1 && y > t.top - hn && y < t.base) put('建殿的材料', x, t.top - hn, r * 0.6);
        if (lv('chPlanA') > 0.3 && lv('chPlan') > 0.5) {
          const PT = planTf(planPaths().P), a0 = PT.f(PT.box[0], PT.box[1]), a1 = PT.f(PT.box[2], PT.box[3]);
          if (x > a0[0] && x < a1[0] && y > a0[1] && y < a1[1]) put('殿的样式', (a0[0] + a1[0]) / 2, a0[1] - 10, r * 0.8);
        }
        if (lv('chGibeon') > 0.5) { const gx = X('gil') * W.w, gg = gY(1, X('gil')); put('基遍的会幕', gx, gg - hm * 1.5, Math.hypot(x - gx, y - gg)); }
        if (lv('chAngel') > 0.5) { const g = angelGeom(); put('耶和华的使者', g.x, g.y - g.h * 0.55, Math.hypot(x - g.x, y - g.y) * 0.6); }
        if (lv('chHeaps') > 0.5) { const hx = t.x0 + 0.56 * t.tu; put('堆垒', hx, gY(2, hx / W.w) - hn, Math.hypot(x - hx, y - gY(2, hx / W.w)) * 0.8); }
        if (lv('chRoad') > 0.5) { const E = roadEnds(); put('归回的路', E.cx, E.cy - 14, Math.hypot(x - E.cx, y - E.cy) * 1.2); }
        return best;
      },
    },
  });
})(window.GS);
