/* ─────────────────────────────────────────────────────────────
 * book/pentecost.js —— 使徒行传 · 五旬节（使徒行传 1 — 7）
 *
 * 复活之后四十天：橄榄山上，城在对面的中丘上。「但圣灵降临在你们身上，你们就必得着能力」——
 *   光自山顶向外走去：耶路撒冷、犹太全地、撒马利亚、直到地极（天边的海上一线光），名字在天上聚成又散去。
 * 「他就被取上升，有一朵云彩把他接去」——一朵发光的云彩降下，他升入云中，看不见了；两个身穿白衣的人站在旁边；
 *   门徒下山回城去。
 * 城里那间楼房（前面敞开的大屋，看得见里面的人）：一百二十人中的十二使徒、耶稣的母亲马利亚、妇人、耶稣的弟兄。
 *   夜过去，五旬节的早晨——「从天上有响声下来，好像一阵大风吹过」：大风（gale），一道道风的光从天上卷进屋子，灯火乱摇，
 *   屋子里满了光。「又有舌头如火焰显现出来」——灵的光化成一团火，分开，落在各人头上（每人头上一朵小小的火焰）。
 * 「他们就都被圣灵充满」——金色的话语从屋里飞出；天下各国的人（衣色各异）从街上聚来，
 *   金字飞到哪一国的人那里，就变成那一国的文字（巴别的反转）；众人头上的万种文字一齐升起，汇成屋上的一团光。
 * 「我要将我的灵浇灌凡有血气的」——彼得站出来讲道，光像雨一样落在满街的人身上。
 * 「凡求告主名的，就必得救」——众人扎心下跪；水池边受洗，一个一个从水里起来发光；城里亮起三千点灯。
 * 「主将得救的人天天加给他们」——傍晚，屋里擘饼，街上坐满了信的人，地上一盏盏小灯；有人把包袱放在使徒脚前；
 *   日子一天天过去，人一群群加添。
 * 殿的美门：生来瘸腿的人坐在门口；「他的脚和踝子骨立刻健壮了」——他站起来，跳着，同他们进了所罗门的廊。
 * 傍晚守殿官来拿人；第二天在公会：「除他以外，别无拯救」——彼得被圣灵充满：一阵轻风、一道光自天上落在他身上
 *   （舌头如火焰只在五旬节那一日），公会的上空聚成「耶稣」二字。
 * 回到会友那里：「聚会的地方震动」——地震，屋子满了光；使徒出去放胆讲道。
 * 夜里的外监（前面是铁栅）：「但主的使者夜间开了监门，领他们出来」——光的使者，门开，领他们出去；门又关好；天将亮。
 * 所罗门的廊下：七个人站在使徒面前，按手；「神的道兴旺起来」——光自殿向外走过城、中丘与远山，新来的门徒从两边来。
 * 公会里，司提反的面貌好像天使：「天是我的座位，地是我的脚凳」——经上的往事在天上一一显出光影（星、荆棘火、帐幕、殿宇），
 *   殿宇散入天上一道横跨天际的光弧；地的轮廓镶上金边。
 * 「看见神的荣耀，又看见耶稣站在神的右边」——天开了：云彩向两边分开，当中一道光陡陡地落在他身上；众人把他推到城外；衣裳放在扫罗脚前；
 *   他跪下，睡了——一点光顺着天上来的光升上去。黄昏，扫罗站在城门边。
 *
 * 父不显为人形：只有天上来的光、光明的云彩与旁白。子是无面目的人（GS.cast.LOOK.jesus，复活后的光稍强），
 * 升天时进入云彩，此后不再现身；司提反所见的「站在神的右边」只是云缝边、光旁一个光的人形（头、肩、长衣，无面目）。
 * 圣灵从不是人：是风、是火、是落下来的光、是玩家自己的那一点灵光（火焰自灵的所在降下）。
 * 暴力只由旁白说出：不画石头、不画伤——只有众人拥上前去，他跪下、睡了。
 *
 * 画面的方位（桌面）：近地中央 = 橄榄山 / 楼房 / 水池 / 美门与所罗门的廊 / 外监 / 城门；中丘 = 耶路撒冷全城。
 *   经文在左边海上（手机在顶上），人都在近地的中段与右段。竖屏的手机另有一份位置表（XP），人数也少几个。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ease = U.easeInOut;
  const ACT = 'pentecost';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LV = {
    pcReach: ['lin', 0.1],     // 见证的光自山顶走向地极（0 → 1 的前沿）
    pcReachA: ['exp', 0.5],    // 那光的显隐
    pcHeaven: ['exp', 0.6],    // 天上来的一道光（落在 S.beam 处）
    pcCloud: ['exp', 0.5],     // 光明的云彩
    pcCloudY: ['lin', 0.15],   // 云彩的高低（0 高 → 1 低，接他）
    pcWind: ['exp', 0.9],      // 一阵大风：风的光
    pcFlame: ['exp', 1.4],     // 屋上的一团火
    pcDivide: ['lin', 0.42],   // 火分开，落到各人头上（0 → 1）
    pcFire: ['exp', 0.9],      // 各人头上的火焰
    pcTongues: ['exp', 0.9],   // 说起别国的话来（话语的光）
    pcOne: ['exp', 0.5],       // 万种文字汇成的一团光
    pcPour: ['exp', 0.55],     // 灵浇灌下来（光雨）
    pcLights: ['exp', 0.35],   // 信的人家里的灯（三千人、天天加添、神的道兴旺）
    pcRoom: ['exp', 0.6],      // 屋子里满了光
    pcAngel: ['exp', 0.5],     // 司提反的面貌好像天使的面貌
    pcThrone: ['exp', 0.4],    // 天是我的座位：横跨天际的光弧
    pcGlory: ['exp', 0.45],    // 天开了：神的荣耀
    pcSoul: ['lin', 0.17],     // 他的灵顺着光升上去（0 → 1）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 位置（画面宽度的比例）：桌面 XL / 竖屏 XP ───────────────
  const XL = {
    mount: 0.665, city0: 0.7, city1: 0.995, cityT: 0.87,
    room0: 0.505, room1: 0.735, house0: 0.752, house1: 1.04, crowd0: 0.768, crowd1: 0.978, preach: 0.748,
    pool0: 0.54, pool1: 0.775, goods: 0.752,
    // 殿（美门、所罗门的廊、公会）整体靠左：公会的当中约在 0.785，人都在画面的中段
    gate: 0.575, porch0: 0.665, porch1: 1.04, lame: 0.525, pe: 0.49, jo: 0.47, inside: 0.745, council: 0.785, walkIn: 0.09,
    prison0: 0.515, prison1: 0.68, cgate: 0.715, steph: 0.572, saul: 0.645,
  };
  const XP = {
    mount: 0.64, city0: 0.6, city1: 0.995, cityT: 0.83,
    room0: 0.395, room1: 0.705, house0: 0.728, house1: 1.04, crowd0: 0.745, crowd1: 0.978, preach: 0.735,
    pool0: 0.42, pool1: 0.76, goods: 0.735,
    gate: 0.6, porch0: 0.7, porch1: 1.04, lame: 0.482, pe: 0.43, jo: 0.405, inside: 0.84, council: 0.851, walkIn: 0.12,
    prison0: 0.405, prison1: 0.7, cgate: 0.71, steph: 0.47, saul: 0.6,
  };
  let PORT = false;
  const X = Object.assign({}, XL);
  function layout() { PORT = W.w < W.h * 0.9; Object.assign(X, PORT ? XP : XL); }
  // 时辰：竖屏的手机上经文在顶上——日头须落在经文之下（早晨偏早、午后偏晚：日在 0.36·H 以下）
  const tod = (d, p) => (PORT ? p : d);

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  //   scene：此刻的场景；fire：头上有火焰的人；beam：天上来的光落在哪里（比例）；beamG：光自荣耀处来（否则自天顶来）
  let S = fresh();
  function fresh() { return { scene: 'olivet', fire: [], beam: 0.66, beamG: false }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = l => 34 * LS(l == null ? 2 : l);                 // 人的身高（与人物模块一致）
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * fieldH(2, g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const lit = c => [Math.min(255, c[0] * 1.2 + 22), Math.min(255, c[1] * 1.17 + 18), Math.min(255, c[2] * 1.12 + 14)];
  const rgba = (c, a) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  const xo = (xf, n) => xf + (n * PH(2)) / W.w;               // xf 右边 n 个人高

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return c && (c.has ? c.has(id) : !!(c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { VT.delete(id); return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  // 在近地的纵深里前后走动（v 慢慢变；重演时直接到位）——只是画面，不入签名
  const VT = new Map();
  function vTo(id, v, b) {
    const f = fig(id);
    if (!f) return;
    if ((b && b.instant) || W.replaying) { f.v = v; VT.delete(id); return; }
    VT.set(id, v);
  }
  function stepV(dt) {
    for (const [id, tv] of VT) {
      const f = fig(id);
      if (!f || f.dying) { VT.delete(id); continue; }
      f.v = approachLin(f.v || 0, tv, 0.14 * dt);
      if (f.v === tv) VT.delete(id);
    }
  }
  function snapV() { for (const [id, tv] of VT) { const f = fig(id); if (f) f.v = tv; } VT.clear(); }
  function place(id, x, layer) { if (!has(id)) return; C().place(id, x, layer); const f = fig(id); if (f) f.ny = null; }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  // 隐去而不落地（升天时：在云中淡出，不先落回地上）
  function vanish(id) { const f = fig(id); if (!f) return; f.follow = null; f.tx = null; C().remove(id); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && has(id)) c.fly(id, x, y, o); }
  // 退场：先放下一切牵挂（跟随、行走、飞、挂在山上）
  function rm(id, now) {
    const f = fig(id);
    if (!f) return;
    VT.delete(id);
    attach(id, null);
    f.follow = null; f.tx = null; f.fly = null; f.ny = null;
    C().remove(id, now ? { fade: false } : undefined);
  }
  // 人群
  function members(gid) { const c = C(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; }
  function crowd(gid, o) {
    const c = C();
    if (!c || !c.crowd) return;
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    U.safe('cast.crowd', () => c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)));
    if (o.face) for (const m of members(gid)) { m.facing = m.fd = o.face; }
  }
  function cwalk(gid, x0, x1, o) { const c = C(); if (c.crowdWalk && hasCrowd(gid)) c.crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { const c = C(); if (c.crowdPose && hasCrowd(gid)) c.crowdPose(gid, p); }
  function crm(gid, now) { const c = C(); if (hasCrowd(gid)) c.removeCrowd(gid, now ? { fade: false } : undefined); }
  function cglow(gid, v) { for (const m of members(gid)) m.glow = v; }
  function cface(gid, d) { for (const m of members(gid)) { m.facing = d; if (W.replaying) m.fd = d; } }

  // 旁白以外的声音与闪光（瞬间重演时不放）
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }

  // 人的头顶（像素）：按姿势估出头的高低，姿势转换时慢慢跟上（只是画面）
  const HK = { stand: 1, walk: 0.98, run: 0.95, raise: 1, gaze: 1, point: 1, carry: 1, weep: 0.92, embrace: 0.94, wrestle: 0.9, bow: 0.8,
    kneel: 0.73, pray: 0.73, seat: 0.76, sit: 0.6, worship: 0.52, ride: 0.8, lie: 0.16, fall: 0.12 };
  const LEAN = { bow: 0.2, worship: 0.28, fall: 0.35, lie: 0.36 };
  const HS = new Map();
  function headK(f) { const k = HK[f.pose] != null ? HK[f.pose] : 1; if (!f.id || f.crowd) return k; const e = HS.get(f.id); return e != null ? e : k; }
  function headOfF(f, frac) {
    if (!f || !f._vis || !isFinite(f._x)) return null;
    const k = headK(f), fr = frac == null ? 1 : frac;
    return [f._x + (f.fd || 1) * f._h * (LEAN[f.pose] || 0), f._y - f._h * k * fr];
  }
  function headOf(id, frac) {
    const f = fig(id);
    const h = headOfF(f, frac);
    if (h) return h;
    if (f) return [f.nx * W.w, gY(2, f.nx) - PH(2) * (frac == null ? 1 : frac)];
    return [W.w * 0.7, W.h * 0.8];
  }
  // 名字在天上以光聚成
  function nameAt(b, str, cx, cy, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || 44 * u, (W.w * 0.7) / (n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const x = clamp(cx, half + 8, W.w - half - 8);
    const y = Math.max(cy, (PORT ? W.h * 0.36 : W.h * 0.12) + size * 0.5);
    const src = o.src || (() => [x + (Math.random() - 0.5) * 120 * u, y + 40 * u + Math.random() * 60 * u]);
    fx().nameStr(str, x, y, size, o.rgb || [255, 228, 168], src, { hold: Math.max(3, o.hold || 3) });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.6 : frac);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 236, 190], 14 * SU(), 'top');
  }
  function ringOn(b, id, r, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.55 : frac);
    fx().ring(h[0], h[1], rgb || [255, 240, 204], M() * (r || 0.2), 2.4, 1.6);
  }
  function ringAt(b, x, y, r, rgb, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 240, 204], M() * (r || 0.2), dur || 2.4, 1.8); }

  // ── 门徒与众人的样子 ─────────────────────────────────────────
  const DLOOK = {
    peter: ['peter'], john: ['john'],
    james: ['disciple', '雅各', 0], andrew: ['disciple', '安得烈', 2], philip: ['disciple', '腓力', 6], thomas: ['disciple', '多马', 3],
    bartholomew: ['disciple', '巴多罗买', 5], matthew: ['disciple', '马太', 4], jamesA: ['disciple', '亚勒腓的儿子雅各', 7],
    simonZ: ['disciple', '奋锐党的西门', 9], judasJ: ['disciple', '雅各的儿子犹大', 8], matthias: ['disciple', '马提亚', 1],
  };
  const ELEVEN = ['peter', 'john', 'james', 'andrew', 'philip', 'thomas', 'bartholomew', 'matthew', 'jamesA', 'simonZ', 'judasJ'];
  const TWELVE = ELEVEN.concat(['matthias']);
  const OTHER = {
    mary: () => Object.assign({ sex: 'f', robe: [96, 120, 170], hair: 'veil' }, LOOK().mary || {}, { label: '耶稣的母亲马利亚' }),
    magdalene: () => Object.assign({ sex: 'f', robe: [150, 84, 96], hair: 'veil' }, LOOK().magdalene || {}, { label: '抹大拉的马利亚' }),
    woman1: () => ({ label: '妇人', sex: 'f', age: 'adult', robe: [128, 110, 142], accent: [226, 214, 198], hair: 'veil', glow: 0.2 }),
    bro1: () => ({ label: '耶稣的弟兄', sex: 'm', age: 'adult', robe: [118, 100, 86], beard: true, glow: 0.18 }),
    bro2: () => ({ label: '耶稣的弟兄', sex: 'm', age: 'adult', robe: [104, 98, 112], beard: false, glow: 0.18 }),
  };
  function lookOf(id) {
    if (OTHER[id]) return OTHER[id]();
    const d = DLOOK[id] || ['disciple', '门徒', 0], L = LOOK();
    const base = Object.assign({ sex: 'm', age: 'adult' }, L[d[0]] || {});
    if (d[1]) base.label = d[1];
    if (d[2] != null) { const R = (GS.cast && GS.cast.DISCIPLE_ROBES) || []; base.robe = R[d[2]] || [120, 100, 80]; }
    return base;
  }
  // 放一个人（新的淡入；已在的直接到位）
  function put(id, o) {
    const was = has(id);
    add(id, Object.assign(lookOf(id), { layer: 2 }, o));
    if (was) { place(id, o.x); if (o.pose) pose(id, o.pose, { stop: true }); }
    const f = fig(id);
    if (f && o.v != null) f.v = o.v;
  }
  function jesus(o) { return add('jesus', Object.assign({}, LOOK().jesus || { label: '耶稣', sex: 'm', robe: [232, 224, 206] }, { glow: 0.55, layer: 2 }, o)); }

  // 天下各国的人（衣色与文字各异）
  // 文字：1 楔形（帕提亚）· 6 圈与十字（埃及）· 9 拉丁大写（罗马）· 10 希腊大写（克里特）· 3 带点的连笔（阿拉伯）
  const NATIONS = [
    { gid: 'nParthia', label: '帕提亚人', robe: [142, 58, 54], sc: 1 },
    { gid: 'nEgypt', label: '埃及人', robe: [218, 202, 160], sc: 6 },
    { gid: 'nRome', label: '罗马人', robe: [206, 204, 212], sc: 9 },
    { gid: 'nCrete', label: '克里特人', robe: [70, 104, 146], sc: 10 },
    { gid: 'nArab', label: '阿拉伯人', robe: [170, 122, 70], sc: 3 },
  ];
  // 各国之人的站位：[gid, x0, x1, v, n]（手机上站在街屋之前，不贴画面右边）
  function nationLayout() {
    if (PORT) return [['nParthia', 0.775, 0.85, 0.22, 2], ['nEgypt', 0.862, 0.93, 0.26, 2], ['nCrete', 0.78, 0.925, 0.44, 3]];
    return [['nParthia', 0.768, 0.826, 0.02, 3], ['nEgypt', 0.834, 0.89, 0.05, 3], ['nRome', 0.898, 0.955, 0.03, 3], ['nCrete', 0.772, 0.856, 0.27, 3], ['nArab', 0.866, 0.95, 0.3, 3]];
  }
  const nationOf = gid => NATIONS.find(n => n.gid === gid) || NATIONS[0];
  // 领受他话的人（第七句）：[gid, 出现处, x0, x1, v, n]——站在水池的左右两边
  function manyLayout() {
    if (PORT) return [['many1', 0.33, 0.36, 0.41, 0.52, 2], ['many2', 1.03, 0.79, 0.93, 0.6, 3]];
    return [['many1', 0.37, 0.43, 0.525, 0.5, 6], ['many2', 1.03, 0.8, 0.95, 0.54, 7]];
  }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // a 显隐 · k、k2 各物自己的状态 · lit 灯 · open 门 · grow 升起
  const EASE = { a: 0.8, k: 0.5, k2: 0.5, lit: 0.6, open: 0.7, grow: 0.16 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, layer: 2, size: 1, label: '', style: '', seed: hashStr(id) };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = 1;
      P.set(id, p);
    }
    for (const k of ['x', 'x0', 'x1', 'layer', 'size', 'label', 'style']) if (o[k] != null) { if (p[k] !== o[k]) p.model = null; p[k] = o[k]; }
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (W.replaying) snap(p);
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  const liveP = id => { const p = P.get(id); return p && !p.dying ? p : null; };
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function transient(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ── 精灵图（离屏预绘）───────────────────────────────────────
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
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
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 234, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        dawn: radial([255, 214, 150], 1, 0.45), fire: radial([255, 140, 50], 1, 0.3), cloud: radial([250, 248, 240], 1, 0.55),
        cshade: radial([176, 188, 210], 1, 0.55),
      };
      // 自天而降的光柱：上淡、中亮、下渐隐
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.15)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火苗（四舌）：h 高；draft 风吹得摇晃
  function flame(ctx, x, y, h, k, seed, draft) {
    if (k < 0.01 || !SP) return;
    const dr = 1 + 2.5 * (draft || 0);
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.4, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 * dr + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 * dr + i * 3 + seed) * h * 0.06 * dr;
      ctx.globalAlpha = Math.min(1, k * q[3]);
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9, y - H * 0.55, sx + Math.sin(W.t * 8 * dr + seed + i) * w * 0.45 * dr, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 舌头如火焰：白日里也看得清的一朵火（先画实色的焰，再叠一层光）
  function tearDrop(ctx, x, y, H, w, sw) {
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x - w * 1.08, y - H * 0.52, x + sw, y - H);
    ctx.quadraticCurveTo(x + w * 1.08, y - H * 0.52, x + w, y);
    ctx.quadraticCurveTo(x, y + w * 0.9, x - w, y);
    ctx.fill();
  }
  function tongue(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    const f = 0.88 + 0.12 * Math.sin(W.t * 11 + seed) + 0.05 * Math.sin(W.t * 19.3 + seed * 1.7);
    const sw = Math.sin(W.t * 7 + seed) * h * 0.1;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.fire, x, y - h * 0.4, h * 1.5, k * (0.25 + 0.35 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = Math.min(1, k);
    ctx.fillStyle = 'rgb(232,92,34)'; tearDrop(ctx, x, y, h * f, h * 0.3, sw);
    ctx.fillStyle = 'rgb(255,164,56)'; tearDrop(ctx, x, y + h * 0.02, h * 0.72 * f, h * 0.21, sw * 0.8);
    ctx.fillStyle = 'rgb(255,238,176)'; tearDrop(ctx, x, y + h * 0.03, h * 0.4 * f, h * 0.11, sw * 0.6);
    ctx.globalAlpha = 1;
  }
  // 一道光：自 (x0, y0) 落到 (x1, y1)
  function beamLine(ctx, x0, y0, x1, y1, w, a) {
    if (a < 0.004 || !SP) return;
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    if (L < 2) return;
    ctx.save();
    ctx.translate(x0, y0); ctx.rotate(Math.atan2(dy, dx) - Math.PI / 2);
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, -w / 2, 0, w, L);
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  文字：同一的光，与天下各国的文字（程序生成的字形，预渲染成图集；与巴别一幕同源）
  // ════════════════════════════════════════════════════════════
  const SCRIPT_RGB = [
    [255, 236, 190], [255, 150, 118], [118, 222, 208], [196, 164, 255], [255, 206, 108], [150, 230, 138], [96, 228, 214], [255, 144, 196], [232, 232, 150],
    [255, 136, 190], [132, 178, 255],
  ];
  // 白日里用的深色（与上一行一一对应）：天光很亮时，字仍看得出颜色
  const SCRIPT_DEEP = [
    [214, 150, 40], [206, 76, 48], [26, 150, 132], [120, 84, 214], [214, 136, 20], [60, 150, 52], [16, 140, 126], [204, 60, 132], [160, 150, 30],
    [200, 50, 126], [44, 94, 214],
  ];
  const NS = SCRIPT_RGB.length, NV = 6, CELL = 48;
  // 大写字母的笔画（单位坐标 −1..1）：拉丁（罗马）与希腊（克里特）
  const CAPS = {
    9: [
      [[-0.6, 0.85, 0, -0.85], [0, -0.85, 0.6, 0.85], [-0.32, 0.2, 0.32, 0.2]],                                   // A
      [[-0.6, -0.85, 0, 0.85], [0, 0.85, 0.6, -0.85]],                                                             // V
      [[-0.62, 0.85, -0.62, -0.85], [-0.62, -0.85, 0, 0.35], [0, 0.35, 0.62, -0.85], [0.62, -0.85, 0.62, 0.85]],  // M
      [[-0.5, 0.85, -0.5, -0.85], [-0.5, -0.85, 0.5, 0.85], [0.5, 0.85, 0.5, -0.85]],                             // N
      [[0.5, -0.85, -0.5, -0.85], [-0.5, -0.85, -0.5, 0.85], [-0.5, 0.85, 0.5, 0.85], [-0.5, 0, 0.3, 0]],        // E
      [[-0.62, -0.85, 0.62, -0.85], [0, -0.85, 0, 0.85], 'R'],                                                     // T · R
    ],
    10: [
      [[-0.64, 0.85, 0, -0.85], [0, -0.85, 0.64, 0.85], [0.64, 0.85, -0.64, 0.85]],                               // Δ
      [[-0.66, -0.85, 0.66, -0.85], [-0.44, -0.85, -0.44, 0.85], [0.44, -0.85, 0.44, 0.85]],                      // Π
      [[0.55, -0.85, -0.55, -0.85], [-0.55, -0.85, 0.12, 0], [0.12, 0, -0.55, 0.85], [-0.55, 0.85, 0.55, 0.85]],  // Σ
      ['Ω'], ['Φ'], ['Θ'],
    ],
  };
  function drawCaps(g, s, v, k) {
    const set = CAPS[s], T = set[v % set.length];
    g.beginPath();
    for (const q of T) {
      if (Array.isArray(q)) { g.moveTo(q[0] * k, q[1] * k); g.lineTo(q[2] * k, q[3] * k); continue; }
      if (q === 'R') { g.moveTo(-0.62 * k, 0.85 * k); g.lineTo(-0.62 * k, -0.85 * k); g.lineTo(0.1 * k, -0.85 * k); g.quadraticCurveTo(0.6 * k, -0.85 * k, 0.6 * k, -0.42 * k); g.quadraticCurveTo(0.6 * k, 0, 0.1 * k, 0); g.lineTo(-0.62 * k, 0); g.moveTo(-0.05 * k, 0); g.lineTo(0.62 * k, 0.85 * k); }
      else if (q === 'Ω') { g.moveTo(-0.33 * k, 0.8 * k); g.arc(0, -0.08 * k, 0.6 * k, 0.62 * Math.PI, 2.38 * Math.PI); g.lineTo(0.33 * k, 0.8 * k); g.moveTo(-0.72 * k, 0.8 * k); g.lineTo(-0.3 * k, 0.8 * k); g.moveTo(0.3 * k, 0.8 * k); g.lineTo(0.72 * k, 0.8 * k); }
      else if (q === 'Φ') { g.moveTo(0, -0.9 * k); g.lineTo(0, 0.9 * k); g.moveTo(0.55 * k, 0); g.ellipse(0, 0, 0.55 * k, 0.42 * k, 0, 0, TAU); }
      else if (q === 'Θ') { g.moveTo(0.52 * k, 0); g.ellipse(0, 0, 0.52 * k, 0.8 * k, 0, 0, TAU); g.moveTo(-0.3 * k, 0); g.lineTo(0.3 * k, 0); }
    }
    g.stroke();
  }
  let atlas = null;
  function wedge(g, x, y, a, s) {
    const c = Math.cos(a), sn = Math.sin(a);
    const Pt = (p, q) => [x + p * c - q * sn, y + p * sn + q * c];
    const p1 = Pt(-0.35 * s, -0.45 * s), p2 = Pt(-0.35 * s, 0.45 * s), p3 = Pt(0.3 * s, 0);
    g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.lineTo(p3[0], p3[1]); g.closePath(); g.fill();
    const t1 = Pt(0.1 * s, 0), t2 = Pt(1.25 * s, 0);
    g.beginPath(); g.moveTo(t1[0], t1[1]); g.lineTo(t2[0], t2[1]); g.stroke();
  }
  function drawScript(g, s, r, k, v) {
    if (CAPS[s]) { drawCaps(g, s, v || 0, k); return; }
    const R = (a, b) => a + r() * (b - a);
    const L = (x1, y1, x2, y2) => { g.moveTo(x1 * k, y1 * k); g.lineTo(x2 * k, y2 * k); };
    const dot = (x, y, rr) => { g.moveTo(x * k + rr * k, y * k); g.arc(x * k, y * k, rr * k, 0, TAU); };
    switch (s) {
      case 0: {   // 同一的光：一竖为干，顶上一道回钩，旁点一点
        g.beginPath();
        L(0, -0.82, 0, 0.86);
        g.moveTo(0, -0.82 * k); g.quadraticCurveTo(0.62 * k, -0.9 * k, 0.5 * k, -0.36 * k);
        const kind = Math.floor(r() * 3);
        if (kind === 0) { g.moveTo(0, 0.25 * k); g.quadraticCurveTo(-0.55 * k, 0.3 * k, -0.5 * k, 0.8 * k); }
        else if (kind === 1) { g.moveTo(0, 0.05 * k); g.quadraticCurveTo(0.5 * k, 0.12 * k, 0.55 * k, 0.6 * k); }
        else { L(-0.42, 0.42, 0.3, 0.42); }
        g.stroke();
        g.beginPath(); dot(-0.46, -0.3, 0.12); g.fill();
        break;
      }
      case 1: {   // 楔形
        const n = 2 + Math.floor(r() * 3), vert = r() < 0.45;
        for (let i = 0; i < n; i++) {
          const t = -0.66 + 1.32 * (i / (n - 1));
          const ang = vert ? (r() < 0.75 ? Math.PI / 2 : 0) : (r() < 0.75 ? 0 : Math.PI / 2);
          const x = vert ? R(-0.3, 0.1) : t - 0.2, y = vert ? t - 0.2 : R(-0.35, 0.35);
          wedge(g, x * k, y * k, ang, k * 0.36);
        }
        break;
      }
      case 2: {   // 一竿与斜枝
        g.beginPath();
        L(0, -0.88, 0, 0.88);
        const n = 1 + Math.floor(r() * 2);
        for (let i = 0; i < n; i++) {
          const y0 = R(-0.8, 0.1), d = r() < 0.5 ? -1 : 1;
          L(0, y0, d * 0.58, y0 + R(0.25, 0.55));
          if (r() < 0.4) L(0, y0 + 0.5, -d * 0.5, y0 + 0.2);
        }
        g.stroke();
        break;
      }
      case 3: {   // 连笔
        g.beginPath();
        g.moveTo(-0.9 * k, 0.3 * k);
        g.bezierCurveTo(-0.5 * k, 0.4 * k, -0.4 * k, R(-0.7, -0.3) * k, -0.05 * k, -0.1 * k);
        g.bezierCurveTo(0.2 * k, 0.2 * k, 0.05 * k, 0.5 * k, -0.15 * k, 0.32 * k);
        g.quadraticCurveTo(0.45 * k, R(0.0, 0.3) * k, 0.9 * k, 0.2 * k);
        g.stroke();
        g.beginPath(); dot(R(-0.5, 0.5), -0.62, 0.09); if (r() < 0.6) dot(R(-0.4, 0.4), 0.72, 0.08); g.fill();
        break;
      }
      case 4: {   // 悬笔
        g.beginPath();
        L(-0.9, -0.62, 0.9, -0.62);
        const xs = r() < 0.5 ? 0.45 : -0.45;
        L(xs, -0.62, xs, 0.86);
        g.moveTo(-xs * 0.3 * k, -0.62 * k);
        g.quadraticCurveTo(-xs * 1.9 * k, -0.1 * k, -xs * 0.4 * k, 0.2 * k);
        g.quadraticCurveTo(xs * 0.4 * k, 0.45 * k, -xs * 0.8 * k, 0.78 * k);
        g.stroke();
        break;
      }
      case 5: {   // 方字
        g.beginPath();
        const top = r() < 0.8, bot = r() < 0.5, left = r() < 0.35;
        if (top) L(-0.7, -0.7, 0.66, -0.7);
        L(0.66, -0.7, 0.66, 0.82);
        if (bot) L(-0.7, 0.82, 0.66, 0.82);
        if (left || !top) L(-0.7, -0.7, -0.7, 0.2);
        L(-0.7, -0.7, -0.8, -0.45);
        if (r() < 0.5) L(-0.2, -0.2, -0.2, 0.5);
        g.stroke();
        break;
      }
      case 6: {   // 圈点
        g.beginPath();
        const cy = R(-0.3, 0.0);
        g.moveTo(0.42 * k, cy * k); g.arc(0, cy * k, 0.42 * k, 0, TAU);
        if (r() < 0.7) L(0, cy + 0.42, 0, 0.88); else L(0.42, cy, 0.85, cy);
        g.stroke();
        g.beginPath(); dot(0.66, R(-0.7, 0.7), 0.1); if (r() < 0.5) dot(-0.66, R(-0.7, 0.7), 0.1); g.fill();
        break;
      }
      case 7: {   // 笔画
        g.beginPath();
        L(-0.78, -0.34, 0.78, -0.42);
        if (r() < 0.8) L(-0.04, -0.88, 0.02, 0.86);
        g.moveTo(-0.06 * k, 0.02 * k); g.quadraticCurveTo(-0.3 * k, 0.5 * k, -0.74 * k, 0.76 * k);
        if (r() < 0.7) L(0.32, 0.18, 0.62, 0.52);
        if (r() < 0.4) L(-0.6, 0.15, 0.55, 0.12);
        g.stroke();
        break;
      }
      default: {  // 回旋
        g.beginPath();
        const turns = R(1.5, 2.4), dir = r() < 0.5 ? 1 : -1;
        for (let i = 0; i <= 40; i++) {
          const t = i / 40, a = dir * t * turns * TAU, rr = (0.1 + 0.78 * t) * k;
          const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
      }
    }
  }
  function buildAtlas() {
    if (atlas) return atlas;
    try {
      const c = cnv(CELL * NV, CELL * NS * 2), g = c.getContext('2d');
      for (let row = 0; row < NS * 2; row++) {
        const s = row % NS, deep = row >= NS, col = deep ? SCRIPT_DEEP[s] : SCRIPT_RGB[s];
        for (let v = 0; v < NV; v++) {
          const r = U.mulberry32(7001 + s * 97 + v * 13);
          g.save();
          g.translate(v * CELL + CELL / 2, row * CELL + CELL / 2);
          g.strokeStyle = g.fillStyle = U.rgb(col[0], col[1], col[2]);
          g.lineWidth = deep ? 3.4 : 2.8; g.lineCap = 'round'; g.lineJoin = 'round';
          if (deep) { g.shadowColor = 'rgba(255,250,236,0.9)'; g.shadowBlur = 4; }
          else { g.shadowColor = U.rgba(col[0], col[1], col[2], 0.95); g.shadowBlur = 6; }
          drawScript(g, s, r, CELL * 0.3, v);
          g.restore();
        }
      }
      atlas = c;
    } catch (e) { atlas = null; }
    return atlas;
  }
  // 话语的光粒（只是画面：Math.random 可用）
  const GL = [];
  const GL_MAX = 320;
  let tong = null, emitAcc = 0;
  function onePoint() {
    const G = roomG({ x0: X.room0, x1: X.room1 });
    return [G.cx, G.yt - 1.7 * G.ph];
  }
  function emitGlyphs(dt) {
    if (!tong || W.replaying || lv('pcTongues') < 0.25 || GL.length >= GL_MAX) return;
    // 一个一个看得清：字大些、少些
    const rate = tong === 'out' ? 9 : 11;
    emitAcc += dt * rate;
    let guard = 8;
    while (emitAcc >= 1 && guard-- > 0 && GL.length < GL_MAX) {
      emitAcc -= 1;
      const groups = nationLayout().map(q => q[0]).filter(g => hasCrowd(g));
      const u = SU(), ph = PH(2), gsz = () => (13 + Math.random() * 6) * u * 1.6 * (PORT ? 1.3 : 1);
      if (tong === 'out') {
        // 话语只飞向已经来到的各国之人：落到谁那里，就成了谁的乡谈（街上还没有人时不发）
        const vis = [];
        for (const g of groups) for (const m of members(g)) if (m._vis && m.alpha > 0.3 && m._x < W.w - 4) vis.push([g, m]);
        if (!vis.length) continue;
        const src = S.fire.length ? S.fire[(Math.random() * S.fire.length) | 0] : 'peter';
        const a = headOf(src, 1.02);
        const pk = vis[(Math.random() * vis.length) | 0], h = headOfF(pk[1], 1.05), tx = h[0], ty = h[1], sc = nationOf(pk[0]).sc;
        const mx = (a[0] + tx) / 2, my = Math.min(a[1], ty) - (2 + Math.random() * 1.8) * ph;
        GL.push({ sx: a[0], sy: a[1], cx: mx, cy: my, tx, ty, t: 0, dur: 1.9 + Math.random() * 0.9, s0: 0, s1: sc, v: (Math.random() * NV) | 0, size: gsz() });
      } else {
        const gid = groups.length ? groups[(Math.random() * groups.length) | 0] : null;
        const ms = gid ? members(gid).filter(m => m._vis && m.alpha > 0.3) : [];
        if (!ms.length) continue;
        const m = ms[(Math.random() * ms.length) | 0], h = headOfF(m, 1.05), o = onePoint();
        const tx = o[0] + (Math.random() - 0.5) * ph * 0.6, ty = o[1] + (Math.random() - 0.5) * ph * 0.4;
        const cx = lerp(h[0], tx, 0.3) + (Math.random() - 0.5) * ph * 2, cy = Math.min(h[1], ty) - (0.6 + Math.random()) * ph;
        GL.push({ sx: h[0], sy: h[1], cx, cy, tx, ty, t: 0, dur: 2.1 + Math.random() * 1.1, s0: nationOf(gid).sc, s1: 0, v: (Math.random() * NV) | 0, size: gsz() });
      }
    }
  }
  function drawGlyphs(ctx) {
    if (!GL.length) return;
    const A = buildAtlas();
    if (!A) return;
    // 白日：深色的字（本色）；夜里：发光的字
    const day = clamp(W.dayFactor * 1.1 - 0.1, 0, 1), glowK = 0.35 + 0.65 * (1 - day);
    for (const pass of [0, 1]) {
      const a0 = pass ? glowK : day;
      if (a0 < 0.02) continue;
      ctx.globalCompositeOperation = pass ? 'lighter' : 'source-over';
      const off = pass ? 0 : NS;
      for (const g of GL) {
        const q = clamp(g.t / g.dur, 0, 1), e = ease(q), i1 = 1 - e;
        const x = i1 * i1 * g.sx + 2 * i1 * e * g.cx + e * e * g.tx, y = i1 * i1 * g.sy + 2 * i1 * e * g.cy + e * e * g.ty;
        const env = Math.min(1, q * 8) * Math.min(1, (1 - q) * 5) * a0;
        const k1 = U.smoothstep(0.5, 0.85, q), sz = g.size * (1 + 0.15 * Math.sin(q * Math.PI));
        if (k1 < 0.999) { ctx.globalAlpha = env * (1 - k1) * 0.95; ctx.drawImage(A, g.v * CELL, (g.s0 + off) * CELL, CELL, CELL, x - sz / 2, y - sz / 2, sz, sz); }
        if (k1 > 0.001) { ctx.globalAlpha = env * k1 * 0.95; ctx.drawImage(A, g.v * CELL, (g.s1 + off) * CELL, CELL, CELL, x - sz / 2, y - sz / 2, sz, sz); }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶路撒冷（中丘）——城墙、城楼、殿、房屋；灯
  // ════════════════════════════════════════════════════════════
  function cityModel(p) {
    if (p.model && p.model.w === W.w && p.model.h === W.h) return p.model;
    const r = U.mulberry32(p.seed * 13 + 7), hs = [];
    const n = Math.max(3, Math.round((p.x1 - p.x0) * 46));
    for (let i = 0; i < n; i++) hs.push({ f: p.x0 + (p.x1 - p.x0) * (i + 0.15 + r() * 0.7) / n, w: 6 + r() * 8, h: 6 + r() * 11, tone: r(), win: r(), lit: r(), back: r() < 0.45 });
    hs.sort((a, b) => (b.back ? 1 : 0) - (a.back ? 1 : 0));
    const tw = [];
    for (let f = p.x0 + 0.01; f < p.x1; f += 0.05 + r() * 0.02) tw.push({ f, h: 14 + r() * 5 });
    p.model = { w: W.w, h: W.h, hs, tw };
    return p.model;
  }
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, m = cityModel(p), nk = nightK(), bel = lv('pcLights');
    const d = litX() >= (p.x0 + p.x1) * 0.5 * W.w ? 1 : -1;
    const ST = [214, 198, 168], ST2 = [190, 172, 142], ROOF = [170, 150, 120];
    ctx.globalAlpha = p.a;
    const wins = [];
    for (const h of m.hs) {
      const x = h.f * W.w, gy = gY(l, h.f) + 2 * s - (h.back ? 7 * s : 0), w = h.w * s, hh = h.h * s * (h.back ? 1.25 : 1);
      ctx.fillStyle = css(mix(ST, ST2, h.tone), l, 1, h.back ? -0.04 : 0);
      ctx.fillRect(x - w / 2, gy - hh, w, hh + (h.back ? 7 * s : 2 * s));
      ctx.fillStyle = css(mul(mix(ST, ST2, h.tone), 0.72), l, 0.8);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - w * 0.25, gy - hh, w * 0.25, hh);
      ctx.fillStyle = css(ROOF, l);
      ctx.fillRect(x - w / 2 - 0.6 * s, gy - hh - 1.2 * s, w + 1.2 * s, 1.4 * s);
      if (h.win > 0.3) wins.push([x + (h.win - 0.65) * w * 0.8, gy - hh * 0.6, h.lit]);
    }
    // 殿：台基、殿身、金边、门里的灯
    const tx = p.x * W.w, tg = gY(l, p.x) + 2 * s;
    ctx.fillStyle = css([226, 212, 182], l);
    ctx.fillRect(tx - 30 * s, tg - 7 * s, 60 * s, 9 * s);
    ctx.fillStyle = css([236, 226, 204], l, 1, 0.04);
    ctx.fillRect(tx - 11 * s, tg - 31 * s, 22 * s, 24 * s);
    ctx.fillRect(tx - 16 * s, tg - 22 * s, 32 * s, 15 * s);
    ctx.fillStyle = css([222, 186, 96], l, 1, 0.2);
    ctx.fillRect(tx - 12 * s, tg - 32.5 * s, 24 * s, 1.8 * s);
    ctx.fillRect(tx - 17 * s, tg - 23.4 * s, 34 * s, 1.4 * s);
    ctx.fillStyle = css([70, 56, 40], l);
    ctx.fillRect(tx - 2.6 * s, tg - 19 * s, 5.2 * s, 12 * s);
    wins.push([tx, tg - 13 * s, 0.02, 1.6]);
    // 城墙与城楼
    const N = 40, wx0 = p.x0, wx1 = p.x1;
    ctx.fillStyle = css([200, 184, 150], l);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 8 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
    for (let i = N; i >= 0; i--) { const f = lerp(wx0, wx1, i / N); ctx.lineTo(f * W.w, gY(l, f) + 4 * s); }
    ctx.closePath(); ctx.fill();
    for (let f = wx0; f < wx1; f += (3.2 * s) / W.w) { const yy = gY(l, f) + 2 * s - 8 * s; ctx.fillRect(f * W.w, yy - 1.8 * s, 1.6 * s, 1.8 * s); }
    for (const t of m.tw) {
      const x = t.f * W.w, gy = gY(l, t.f) + 2 * s;
      ctx.fillStyle = css([206, 190, 156], l);
      ctx.fillRect(x - 4 * s, gy - t.h * s, 8 * s, t.h * s);
      ctx.fillRect(x - 5 * s, gy - t.h * s - 1.6 * s, 10 * s, 1.8 * s);
      ctx.fillStyle = css([60, 48, 38], l, 0.8);
      ctx.fillRect(x - 0.8 * s, gy - t.h * s + 3 * s, 1.6 * s, 2.6 * s);
    }
    ctx.strokeStyle = css([252, 238, 206], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const f = lerp(wx0, wx1, i / N); const yy = gY(l, f) + 2 * s - 8 * s - 1.8 * s; if (i) ctx.lineTo(f * W.w, yy); else ctx.moveTo(f * W.w, yy); }
    ctx.stroke();
    // 窗里的灯：夜里亮；信的人家里的灯（pcLights）白天也有一点金光
    const lk = Math.max(nk, 0.4 * bel) * p.a, thr = Math.max(p.lit, bel * 0.96);
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of wins) {
        if (q[2] > thr) continue;
        const fl = 0.8 + 0.2 * Math.sin(W.t * 3 + q[0] * 0.07);
        const warm = q[2] > p.lit ? 1 : 0;
        ctx.globalAlpha = Math.min(1, lk * fl);
        ctx.fillStyle = warm ? 'rgb(255,214,140)' : 'rgb(255,190,110)';
        ctx.fillRect(q[0] - 0.8 * s, q[1] - 0.8 * s, 1.6 * s, 1.6 * s * (q[3] || 1));
        glowAt(warm ? SP.gold : SP.lamp, q[0], q[1], (warm ? 9 : 7) * s * (q[3] || 1), lk * fl * 0.5);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：橄榄山（近地的一座缓山，山坡上的橄榄树）
  // ════════════════════════════════════════════════════════════
  const mountHW = () => (PORT ? 4.3 : 4.7) * PH(2);
  const mountH = () => (PORT ? 1.75 : 1.8) * PH(2);
  function mountK(u) {
    if (u <= -1 || u >= 1) return 0;
    const b = Math.pow(1 - u * u, 1.5) * (1 - 0.1 * u);
    return b * (1 + 0.04 * Math.sin(u * 9.3) + 0.025 * Math.sin(u * 23.1));
  }
  function mountY(xf) {
    const p = liveP('mount') || getP('mount');
    const g = gY(2, xf);
    if (!p) return g;
    const cx = p.x * W.w, hw = mountHW(), u = (xf * W.w - cx) / hw;
    const gc = gY(2, p.x) + 3;
    return Math.min(g, gc - mountH() * p.grow * mountK(u) * clamp(p.a * 1.5, 0, 1));
  }
  const summitX = () => { const p = getP('mount'); return (p ? p.x : X.mount) - (0.02 * mountHW()) / W.w; };
  const mountAt = u => (getP('mount') ? getP('mount').x : X.mount) + (u * mountHW()) / W.w;
  function onMount(id) { attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, mountY(f.nx) + 1] : null; }); }
  function drawOlive(ctx, x, y, s, seed) {
    const r = U.mulberry32(seed);
    ctx.fillStyle = css([88, 74, 60], 2);
    ctx.beginPath();
    ctx.moveTo(x - 4.5 * s, y);
    ctx.bezierCurveTo(x - 1 * s, y - 8 * s, x - 6 * s, y - 16 * s, x - 2 * s, y - 26 * s);
    ctx.lineTo(x + 2.2 * s, y - 25 * s);
    ctx.bezierCurveTo(x + 1 * s, y - 16 * s, x + 5 * s, y - 9 * s, x + 4.6 * s, y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 74, 60], 2); ctx.lineWidth = Math.max(0.8, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - 1 * s, y - 22 * s); ctx.quadraticCurveTo(x - 8 * s, y - 27 * s, x - 13 * s, y - 29 * s);
    ctx.moveTo(x + 1 * s, y - 23 * s); ctx.quadraticCurveTo(x + 7 * s, y - 28 * s, x + 12 * s, y - 31 * s); ctx.stroke();
    ctx.lineCap = 'butt';
    const cols = [[112, 128, 96], [98, 116, 86], [132, 146, 112]];
    for (let i = 0; i < 7; i++) {
      const cx = x + (r() - 0.5) * 30 * s, cy = y - (28 + r() * 12) * s, rx = (8 + r() * 6) * s, ry = rx * (0.55 + r() * 0.2);
      ctx.fillStyle = css(cols[i % 3], 2);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, (r() - 0.5) * 0.4, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = css([226, 236, 210], 2, 0.28 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.ellipse(x, y - 36 * s, 16 * s, 7 * s, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  const OLIVE_U = [[-0.86, 0.9], [-0.66, 0.72], [0.66, 0.78], [0.9, 0.95], [1.28, 1.05]];
  function drawMount(ctx, p) {
    const cx = p.x * W.w, hw = mountHW(), H = mountH() * p.grow, gc = gY(2, p.x) + 3, s = LS(2);
    const N = 60, top = u => Math.min(gY(2, (cx + u * hw) / W.w), gc - H * mountK(u));
    ctx.globalAlpha = p.a;
    const gr = ctx.createLinearGradient(0, gc - H, 0, gc + 4 * s);
    gr.addColorStop(0, css([126, 140, 98], 2)); gr.addColorStop(0.55, css([98, 124, 74], 2)); gr.addColorStop(1, css([80, 118, 58], 2));
    ctx.fillStyle = gr;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const u = -1 + (2 * i) / N; const X1 = cx + u * hw; if (i) ctx.lineTo(X1, top(u)); else ctx.moveTo(X1, top(u)); }
    for (let i = N; i >= 0; i--) { const u = -1 + (2 * i) / N; const X1 = cx + u * hw; ctx.lineTo(X1, gY(2, X1 / W.w) + 3 * s); }
    ctx.closePath(); ctx.fill();
    const d = litX() >= cx ? 1 : -1;
    ctx.fillStyle = css([40, 52, 40], 2, 0.2);
    ctx.beginPath();
    ctx.moveTo(cx - d * 0.02 * hw, top(-d * 0.02));
    for (let i = 0; i <= 20; i++) { const u = -d * (0.02 + (0.98 * i) / 20); ctx.lineTo(cx + u * hw, top(u)); }
    ctx.lineTo(cx - d * hw, gY(2, (cx - d * hw) / W.w) + 2 * s);
    ctx.quadraticCurveTo(cx - d * 0.35 * hw, gc - H * 0.25, cx - d * 0.02 * hw, top(-d * 0.02));
    ctx.fill();
    // 石与草丛
    ctx.fillStyle = css([150, 146, 128], 2);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const u = -0.8 + hsh(i * 3.3 + p.seed) * 1.6, k = mountK(u);
      if (k < 0.15) continue;
      const x = cx + u * hw, y = gc - H * k * (0.35 + 0.5 * hsh(i * 7.1)), r = (2.2 + 2.6 * hsh(i * 1.9)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.6, 0, Math.PI, 0);
    }
    ctx.fill();
    ctx.fillStyle = css([66, 92, 54], 2);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const u = -0.92 + hsh(i * 5.7 + p.seed) * 1.84;
      const x = cx + u * hw, y = Math.min(top(u) + (2 + 10 * hsh(i * 2.9)) * s, gc), r = (2.2 + 2.4 * hsh(i * 4.4)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.66, 0, 0, TAU);
    }
    ctx.fill();
    // 下山的小路（右坡，往城去）
    ctx.strokeStyle = css([206, 190, 150], 2, 0.38 * dayA() + 0.1, 0.1); ctx.lineWidth = Math.max(0.6, 1.3 * s);
    ctx.beginPath();
    for (let i = 0; i <= 14; i++) { const u = 0.04 + (1.0 * i) / 14; const X1 = cx + u * hw, Y1 = top(u) + 2 * s; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.stroke();
    // 橄榄树
    for (let i = 0; i < OLIVE_U.length; i++) {
      const q = OLIVE_U[i], x = cx + q[0] * hw;
      if (x > W.w + 40) continue;
      drawOlive(ctx, x, (Math.abs(q[0]) < 1 ? top(q[0]) : gY(2, x / W.w)) + 2 * s, s * q[1] * (PORT ? 0.85 : 1), p.seed + i * 17);
    }
    // 迎光的山脊
    ctx.strokeStyle = css([240, 236, 200], 2, 0.4 * dayA() + 0.08, 0.2); ctx.lineWidth = Math.max(0.7, 1.3 * s);
    ctx.beginPath();
    let first = true;
    for (let i = 0; i <= N; i++) { const u = -1 + (2 * i) / N; if (u * d < -0.05 || mountK(u) < 0.05) continue; const X1 = cx + u * hw; if (first) { ctx.moveTo(X1, top(u)); first = false; } else ctx.lineTo(X1, top(u)); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：城中的街屋（近地，楼房的右边）
  // ════════════════════════════════════════════════════════════
  function housesModel(p) {
    if (p.model && p.model.w === W.w && p.model.h === W.h) return p.model;
    const r = U.mulberry32(p.seed), ph = PH(2), hs = [];
    let x = p.x0 * W.w;
    while (x < p.x1 * W.w) {
      const w = (1.05 + 0.75 * r()) * ph, h = (1.45 + 1.0 * r()) * ph;
      hs.push({ xf: (x + w / 2) / W.w, w, h, win: r(), door: r(), lamp: r(), tone: r(), stair: r() < 0.35, dome: r() < 0.12 });
      x += w + (0.04 + 0.2 * r()) * ph;
    }
    return (p.model = { w: W.w, h: W.h, hs });
  }
  function drawHouses(ctx, p) {
    const m = housesModel(p), ph = PH(2), nk = nightK(), bel = lv('pcLights'), un = Math.max(0.5, W.unit);
    const sunL = litX() < W.w * 0.85;
    const ST = [206, 188, 156], ST2 = [182, 162, 130], ROOF = [150, 128, 98];
    ctx.globalAlpha = p.a;
    const wins = [];
    for (const h of m.hs) {
      const x = h.xf * W.w, g = gY(2, clamp(h.xf, 0, 1)) + 0.1 * ph, w = h.w, hh = h.h;
      const c = mix(ST, ST2, h.tone);
      ctx.fillStyle = css(c, 2);
      ctx.fillRect(x - w / 2, g - hh, w, hh + 0.25 * ph);
      if (h.dome) { ctx.beginPath(); ctx.arc(x, g - hh + 1, w * 0.28, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = css(mul(c, 0.74), 2, 0.9);
      ctx.fillRect(sunL ? x + w / 2 - w * 0.2 : x - w / 2, g - hh, w * 0.2, hh + 0.25 * ph);
      ctx.fillStyle = css(ROOF, 2);
      ctx.fillRect(x - w / 2 - 0.05 * ph, g - hh - 0.08 * ph, w + 0.1 * ph, 0.1 * ph);
      // 门与窗
      ctx.fillStyle = css([54, 42, 32], 2);
      const dx = x + (h.door - 0.5) * w * 0.45;
      ctx.beginPath(); ctx.moveTo(dx - 0.13 * ph, g); ctx.lineTo(dx - 0.13 * ph, g - 0.5 * ph); ctx.arc(dx, g - 0.5 * ph, 0.13 * ph, Math.PI, 0); ctx.lineTo(dx + 0.13 * ph, g); ctx.closePath(); ctx.fill();
      const wx = x + (0.5 - h.win) * w * 0.5, wy = g - hh * 0.74;
      ctx.fillRect(wx - 0.08 * ph, wy, 0.16 * ph, 0.22 * ph);
      wins.push([wx, wy + 0.11 * ph, h.lamp]);
      // 外面上房顶的石阶
      if (h.stair) {
        ctx.fillStyle = css(mul(c, 0.86), 2);
        ctx.beginPath();
        const sx0 = x - w / 2;
        for (let i = 0; i < 5; i++) ctx.rect(sx0 - (5 - i) * 0.12 * ph, g - (i + 1) * hh / 5.5, (5 - i) * 0.12 * ph, hh / 5.5 + 0.02 * ph);
        ctx.fill();
      }
      // 迎光的边
      ctx.strokeStyle = css(lit(c), 2, rimA(), 0.08);
      ctx.lineWidth = Math.max(0.5, 0.8 * un);
      ctx.beginPath(); const ex = sunL ? x - w / 2 : x + w / 2; ctx.moveTo(ex, g - hh * 0.3); ctx.lineTo(ex, g - hh); ctx.lineTo(x + (sunL ? 0.2 : -0.2) * w, g - hh); ctx.stroke();
    }
    const lk = Math.max(nk, 0.35 * bel) * p.a, thr = 0.55 + 0.45 * bel;
    if (lk > 0.03 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of wins) {
        if (q[2] > thr) continue;
        const fl = 0.85 + 0.15 * Math.sin(W.t * 2.6 + q[0] * 0.05);
        ctx.globalAlpha = Math.min(1, lk * fl);
        ctx.fillStyle = 'rgb(255,196,120)';
        ctx.fillRect(q[0] - 0.07 * ph, q[1] - 0.1 * ph, 0.14 * ph, 0.2 * ph);
        glowAt(SP.lamp, q[0], q[1], 0.5 * ph, lk * fl * 0.5);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：那间楼房——前面敞开的大屋（同最后的晚餐那一间的样子）
  // ════════════════════════════════════════════════════════════
  const PLASTER = [214, 198, 166];
  function roomG(p) {
    const ph = PH(2), c = (p.x0 + p.x1) / 2, xa = p.x0 * W.w, xb = p.x1 * W.w;
    const gb = gY(2, c), gf = vY(c, 0.5), H = 3.0 * ph;
    const inset = 0.42 * ph * (PORT ? 0.8 : 1);
    return { ph, c, cx: c * W.w, xa, xb, gb, gf, H, bx0: xa + inset, bx1: xb - inset, fx0: xa - 0.3 * ph, fx1: xb + 0.3 * ph, yc: gb - H, yt: gb - H - 0.5 * ph };
  }
  const LAMPS = [0.2, 0.5, 0.8];
  function lampPos(G, i) { return [lerp(G.bx0, G.bx1, LAMPS[i]), G.yc + 0.85 * G.ph]; }
  function windowCol() {
    const d = W.dayFactor, n = W.night, du = W.dusk;
    const a = U.mixRGB([150, 188, 226], [238, 150, 100], clamp(du * 1.3, 0, 1));
    return U.mixRGB(a, [20, 28, 56], clamp(n * 1.2 + (1 - d) * 0.3, 0, 1));
  }
  function litCSS(rgb, k, a) {
    const s0 = W.shade(rgb, 0), w = [rgb[0] * 0.88, rgb[1] * 0.64, rgb[2] * 0.42];
    const c = U.mixRGB(s0, w, clamp(k, 0, 1));
    return a == null ? 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')' : 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  }
  function drawRoom(ctx, p) {
    const A = p.a;
    const G = roomG(p), { ph, gb, gf, bx0, bx1, fx0, fx1, yc, yt } = G, l = 2;
    const nk = nightK(), lamp = p.lit, lk = lamp * nk, lampEx = lk * 0.4, fill = lv('pcRoom');
    ctx.globalAlpha = A;
    // 屋外：左右两堵外墙与平顶
    ctx.fillStyle = css([176, 156, 124], l, 1, lampEx * 0.2);
    ctx.fillRect(fx0 - 0.28 * ph, yt - 0.28 * ph, 0.28 * ph, gf - yt + 0.28 * ph);
    ctx.fillRect(fx1, yt - 0.28 * ph, 0.28 * ph, gf - yt + 0.28 * ph);
    // 地
    ctx.fillStyle = litCSS([150, 122, 92], lk * 0.62);
    ctx.beginPath(); ctx.moveTo(bx0, gb - 1); ctx.lineTo(bx1, gb - 1); ctx.lineTo(fx1, gf); ctx.lineTo(fx0, gf); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([120, 100, 76], l, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let k = 1; k < 8; k++) { const u = k / 8; ctx.moveTo(lerp(bx0, bx1, u), gb); ctx.lineTo(lerp(fx0, fx1, u), gf); }
    for (let k = 1; k < 4; k++) { const u = k / 4, y = lerp(gb, gf, u * u); ctx.moveTo(lerp(bx0, fx0, u * u), y); ctx.lineTo(lerp(bx1, fx1, u * u), y); }
    ctx.stroke();
    // 两侧墙（斜看的里面）
    ctx.fillStyle = litCSS([178, 154, 120], lk * 0.62);
    ctx.beginPath(); ctx.moveTo(fx0, yt); ctx.lineTo(bx0, yc); ctx.lineTo(bx0, gb); ctx.lineTo(fx0, gf); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(fx1, yt); ctx.lineTo(bx1, yc); ctx.lineTo(bx1, gb); ctx.lineTo(fx1, gf); ctx.closePath(); ctx.fill();
    // 右墙上的门
    const dA = [lerp(bx1, fx1, 0.12), lerp(bx1, fx1, 0.5)];
    const dTop = u => lerp(yc, yt, u) + (gb - yc) * 0.28;
    const dBot = u => lerp(gb, gf, u);
    ctx.fillStyle = litCSS([60, 44, 32], lk * 0.3);
    ctx.beginPath(); ctx.moveTo(dA[0], dTop(0.12)); ctx.lineTo(dA[1], dTop(0.5)); ctx.lineTo(dA[1], dBot(0.5)); ctx.lineTo(dA[0], dBot(0.12)); ctx.closePath(); ctx.fill();
    // 顶棚与梁
    ctx.fillStyle = litCSS([118, 92, 66], lk * 0.5);
    ctx.beginPath(); ctx.moveTo(fx0, yt); ctx.lineTo(fx1, yt); ctx.lineTo(bx1, yc); ctx.lineTo(bx0, yc); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([72, 54, 40], l, 0.8);
    ctx.lineWidth = Math.max(0.8, 0.05 * ph);
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) { const u = k / 6; ctx.moveTo(lerp(bx0, bx1, u), yc); ctx.lineTo(lerp(fx0, fx1, u), yt); }
    ctx.stroke();
    // 后墙与护墙板
    ctx.fillStyle = litCSS(PLASTER, lk);
    ctx.fillRect(bx0, yc, bx1 - bx0, gb - yc);
    ctx.fillStyle = litCSS([150, 122, 90], lk * 0.8, 0.6);
    ctx.fillRect(bx0, gb - 0.55 * ph, bx1 - bx0, 0.55 * ph);
    // 窗：看见外面的天
    const wc = windowCol();
    for (const u of [0.3, 0.7]) {
      const x = lerp(bx0, bx1, u), w = 0.36 * ph, y0 = yc + 0.32 * ph, y1 = yc + 1.22 * ph;
      ctx.fillStyle = litCSS([150, 126, 96], lk * 0.7);
      ctx.beginPath(); ctx.moveTo(x - w * 0.62, y1 + 0.06 * ph); ctx.lineTo(x - w * 0.62, y0 + w * 0.2); ctx.arc(x, y0 + w * 0.2, w * 0.62, Math.PI, 0); ctx.lineTo(x + w * 0.62, y1 + 0.06 * ph); ctx.closePath(); ctx.fill();
      ctx.fillStyle = U.rgb(wc[0], wc[1], wc[2]);
      ctx.beginPath(); ctx.moveTo(x - w * 0.5, y1); ctx.lineTo(x - w * 0.5, y0 + w * 0.2); ctx.arc(x, y0 + w * 0.2, w * 0.5, Math.PI, 0); ctx.lineTo(x + w * 0.5, y1); ctx.closePath(); ctx.fill();
    }
    // 屋顶：平顶与女儿墙
    ctx.fillStyle = css([164, 142, 110], l, 1, lampEx * 0.1);
    ctx.fillRect(fx0 - 0.34 * ph, yt - 0.32 * ph, fx1 - fx0 + 0.68 * ph, 0.34 * ph);
    ctx.fillStyle = css([236, 216, 180], l, 0.4 * dayA() + 0.1 * nk, 0.1);
    ctx.fillRect(fx0 - 0.34 * ph, yt - 0.32 * ph, fx1 - fx0 + 0.68 * ph, Math.max(0.7, 0.04 * ph));
    ctx.fillStyle = css([150, 128, 98], l);
    ctx.fillRect(fx0 - 0.34 * ph, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    ctx.fillRect(fx1 + 0.14 * ph, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    // 前面的两根柱
    ctx.fillStyle = litCSS([158, 136, 104], lk * 0.25);
    ctx.fillRect(fx0 - 0.24 * ph, yt - 0.02 * ph, 0.24 * ph, gf - yt);
    ctx.fillRect(fx1, yt - 0.02 * ph, 0.24 * ph, gf - yt);
    // 挂灯
    const sway = lv('pcWind');
    ctx.strokeStyle = css([60, 48, 40], l, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const q = lampPos(G, i), sw = Math.sin(W.t * 3.1 + i) * sway * 0.14 * ph; ctx.moveTo(q[0], yc - 0.25 * ph); ctx.lineTo(q[0] + sw, q[1] - 0.04 * ph); }
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const q = lampPos(G, i), sw = Math.sin(W.t * 3.1 + i) * sway * 0.14 * ph;
      ctx.fillStyle = css([150, 104, 70], l, 1, lampEx * 0.3);
      ctx.beginPath(); ctx.ellipse(q[0] + sw, q[1], 0.17 * ph, 0.065 * ph, 0, 0, TAU); ctx.fill();
    }
    // 席上的饼与杯（擘饼：p.k）
    if (p.k > 0.01) {
      const my = lerp(gb, gf, 0.34), mw = (bx1 - bx0) * 0.46;
      ctx.globalAlpha = A * p.k;
      ctx.fillStyle = litCSS([214, 200, 172], lk * 0.8);
      ctx.beginPath(); ctx.ellipse(G.cx, my, mw / 2, 0.14 * ph, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = litCSS([206, 160, 100], lk);
      for (let i = 0; i < 5; i++) { const bx = G.cx + (i - 2) * mw * 0.18; ctx.beginPath(); ctx.ellipse(bx, my - 0.03 * ph, 0.09 * ph, 0.045 * ph, 0, 0, TAU); ctx.fill(); }
      ctx.fillStyle = litCSS([150, 96, 70], lk);
      ctx.fillRect(G.cx - 0.03 * ph, my - 0.14 * ph, 0.06 * ph, 0.1 * ph);
      ctx.globalAlpha = A;
    }
    // 灯光把屋里照暖；灵的光充满屋子
    ctx.globalCompositeOperation = 'lighter';
    const warm = lamp * (0.3 + 0.7 * nk) * A;
    if (warm > 0.01 && SP) {
      for (let i = 0; i < 3; i++) { const q = lampPos(G, i); glowAt(SP.warm, q[0], q[1] + 0.6 * ph, 2.1 * ph, warm * 0.3, 1.05); glowAt(SP.gold, q[0], q[1], 0.6 * ph, warm * 0.7); }
      glowAt(SP.warm, G.cx, gb + 0.1 * ph, (bx1 - bx0) * 0.55, warm * 0.2, 0.28);
    }
    if (fill > 0.01 && SP) {
      glowAt(SP.white, G.cx, lerp(yc, gb, 0.55), (bx1 - bx0) * 0.62, 0.4 * fill * A, 0.62);
      glowAt(SP.gold, G.cx, lerp(yc, gb, 0.45), (bx1 - bx0) * 0.9, 0.22 * fill * A, 0.55);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = A;
    for (let i = 0; i < 3; i++) { const q = lampPos(G, i), sw = Math.sin(W.t * 3.1 + i) * sway * 0.14 * ph; flame(ctx, q[0] + sw + 0.1 * ph, q[1] - 0.04 * ph, 0.2 * ph, lamp * A, i * 1.7, sway); }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：街上的小灯、凡物公用、水池、衣裳
  // ════════════════════════════════════════════════════════════
  function lampSpots() {
    const n = PORT ? 3 : 6, out = [];
    for (let i = 0; i < n; i++) out.push([lerp(X.crowd0 + 0.01, X.crowd1 - 0.01, (i + 0.5) / n), i % 2 ? 0.22 : 0.12]);
    return out;
  }
  function drawLamps(ctx, p) {
    const ph = PH(2), nk = nightK();
    ctx.globalAlpha = p.a;
    for (const q of lampSpots()) {
      const x = q[0] * W.w, y = vY(q[0], q[1]);
      ctx.fillStyle = css([150, 104, 70], 2);
      ctx.beginPath(); ctx.ellipse(x, y - 0.04 * ph, 0.12 * ph, 0.05 * ph, 0, 0, TAU); ctx.fill();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.warm, x, y - 0.2 * ph, 1.4 * ph, p.lit * p.a * (0.1 + 0.4 * nk), 0.7);
        ctx.globalCompositeOperation = 'source-over';
      }
      flame(ctx, x + 0.06 * ph, y - 0.06 * ph, 0.16 * ph, p.lit * p.a * (0.5 + 0.5 * nk), q[0] * 40);
      ctx.globalAlpha = p.a;
    }
    ctx.globalAlpha = 1;
  }
  // 放在使徒脚前的：袋、罐、篮、一小堆银子
  const GOODS = [['sack', 0, 0], ['jar', 0.28, 0.02], ['sack', -0.26, 0.04], ['basket', 0.52, 0.06], ['coins', 0.12, 0.1], ['jar', -0.5, 0.02], ['sack', 0.76, 0.03], ['basket', -0.02, 0.12], ['coins', 0.4, 0.14]];
  function drawGoods(ctx, p) {
    const ph = PH(2), x0 = p.x * W.w, y0 = vY(p.x, 0.08), n = Math.round(clamp(p.k, 0, 1) * GOODS.length);
    ctx.globalAlpha = p.a;
    for (let i = 0; i < n; i++) {
      const q = GOODS[i], x = x0 + q[1] * ph, y = y0 + q[2] * ph;
      if (q[0] === 'sack') {
        ctx.fillStyle = css([176, 150, 110], 2);
        ctx.beginPath(); ctx.ellipse(x, y - 0.14 * ph, 0.15 * ph, 0.15 * ph, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = css([140, 116, 84], 2); ctx.fillRect(x - 0.04 * ph, y - 0.33 * ph, 0.08 * ph, 0.06 * ph);
      } else if (q[0] === 'jar') {
        ctx.fillStyle = css([170, 104, 70], 2);
        ctx.beginPath(); ctx.ellipse(x, y - 0.16 * ph, 0.1 * ph, 0.16 * ph, 0, 0, TAU); ctx.fill();
        ctx.fillRect(x - 0.045 * ph, y - 0.38 * ph, 0.09 * ph, 0.1 * ph);
      } else if (q[0] === 'basket') {
        ctx.fillStyle = css([184, 150, 96], 2);
        ctx.beginPath(); ctx.moveTo(x - 0.18 * ph, y - 0.16 * ph); ctx.lineTo(x + 0.18 * ph, y - 0.16 * ph); ctx.lineTo(x + 0.12 * ph, y); ctx.lineTo(x - 0.12 * ph, y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = css([214, 170, 100], 2, 1, 0.08);
        ctx.beginPath(); ctx.ellipse(x, y - 0.17 * ph, 0.16 * ph, 0.05 * ph, 0, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = css([214, 206, 190], 2, 1, 0.15);
        for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.ellipse(x + (j - 2) * 0.05 * ph, y - 0.03 * ph - (j % 2) * 0.03 * ph, 0.045 * ph, 0.022 * ph, 0, 0, TAU); ctx.fill(); }
        if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(SP.gold, x, y - 0.05 * ph, 0.35 * ph, 0.35 * p.a * (0.6 + 0.4 * Math.sin(W.t * 2 + i))); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = p.a; }
      }
    }
    ctx.globalAlpha = 1;
  }
  // 水池：石边、石阶，水映着天
  function poolG(p) {
    const ph = PH(2), c = (p.x0 + p.x1) / 2;
    return { ph, xa: p.x0 * W.w, xb: p.x1 * W.w, cx: c * W.w, yb: vY(c, 0.36), yf: vY(c, 0.86) };
  }
  const POOL_V = 0.62;
  function drawPool(ctx, p) {
    const G = poolG(p), ph = G.ph, ins = 0.55 * ph;
    const bl = G.xa + ins, br = G.xb - ins;
    ctx.globalAlpha = p.a;
    // 石边
    ctx.fillStyle = css([196, 180, 148], 2);
    ctx.beginPath();
    ctx.moveTo(bl - 0.3 * ph, G.yb - 0.14 * ph); ctx.lineTo(br + 0.3 * ph, G.yb - 0.14 * ph);
    ctx.lineTo(G.xb + 0.3 * ph, G.yf + 0.12 * ph); ctx.lineTo(G.xa - 0.3 * ph, G.yf + 0.12 * ph); ctx.closePath(); ctx.fill();
    // 石阶（后边三级）
    for (let i = 0; i < 3; i++) {
      const y0 = lerp(G.yb - 0.1 * ph, G.yf, i * 0.1), y1 = lerp(G.yb - 0.1 * ph, G.yf, (i + 1) * 0.1);
      const xl0 = lerp(bl, G.xa, i * 0.1), xr0 = lerp(br, G.xb, i * 0.1), xl1 = lerp(bl, G.xa, (i + 1) * 0.1), xr1 = lerp(br, G.xb, (i + 1) * 0.1);
      ctx.fillStyle = css(i % 2 ? [176, 160, 128] : [212, 196, 164], 2);
      ctx.beginPath(); ctx.moveTo(xl0, y0); ctx.lineTo(xr0, y0); ctx.lineTo(xr1, y1); ctx.lineTo(xl1, y1); ctx.closePath(); ctx.fill();
    }
    // 水
    const w0 = lerp(G.yb, G.yf, 0.3), xl = lerp(bl, G.xa, 0.3), xr = lerp(br, G.xb, 0.3);
    const gr = ctx.createLinearGradient(0, w0, 0, G.yf);
    gr.addColorStop(0, W.shadeCSS([112, 150, 176], 0.1, 1, 0.05)); gr.addColorStop(1, W.shadeCSS([46, 84, 116], 0.1, 1));
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.moveTo(xl, w0); ctx.lineTo(xr, w0); ctx.lineTo(G.xb - 0.04 * ph, G.yf); ctx.lineTo(G.xa + 0.04 * ph, G.yf); ctx.closePath(); ctx.fill();
    // 水上的亮纹
    ctx.strokeStyle = W.shadeCSS([236, 244, 250], 0.1, 0.45 * dayA() + 0.1, 0.2);
    ctx.lineWidth = Math.max(0.6, 0.03 * ph);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const v = 0.12 + 0.8 * hsh(i * 3.1 + p.seed), y = lerp(w0, G.yf, v), x = lerp(xl, xr, hsh(i * 5.3)) + Math.sin(W.t * 0.8 + i) * 0.2 * ph;
      const L = (0.3 + 0.4 * hsh(i * 2.2)) * ph;
      ctx.moveTo(x - L, y); ctx.lineTo(x + L, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 水里的人：水面遮住下半身
  function drawWaders(ctx) {
    const p = liveP('pool');
    if (!p || p.a < 0.05) return;
    const G = poolG(p), ph = G.ph, ins = 0.55 * ph;
    const w0 = lerp(G.yb, G.yf, 0.3), xl = lerp(G.xa + ins, G.xa, 0.3), xr = lerp(G.xb - ins, G.xb, 0.3);
    let gr = null;
    for (const f of C().people.values()) {
      if (!f._vis || f.isAnimal || (f.v || 0) < 0.45) continue;
      if (f._x < G.xa + 0.1 * ph || f._x > G.xb - 0.1 * ph) continue;
      const k = HK[f.pose] != null ? HK[f.pose] : 1, h = f._h, wl = f._y - h * (k < 0.8 ? 0.6 : 0.32);
      if (!gr) { gr = ctx.createLinearGradient(0, w0, 0, G.yf); gr.addColorStop(0, W.shadeCSS([112, 150, 176], 0.1, 1, 0.05)); gr.addColorStop(1, W.shadeCSS([46, 84, 116], 0.1, 1)); }
      ctx.save();
      ctx.beginPath(); ctx.moveTo(xl, w0); ctx.lineTo(xr, w0); ctx.lineTo(G.xb - 0.04 * ph, G.yf); ctx.lineTo(G.xa + 0.04 * ph, G.yf); ctx.closePath(); ctx.clip();
      ctx.globalAlpha = p.a * f.alpha * 0.92;
      ctx.fillStyle = gr;
      ctx.fillRect(f._x - 0.5 * h, wl, h, f._y - wl + 0.2 * ph);
      ctx.strokeStyle = 'rgba(236,246,252,0.75)'; ctx.lineWidth = Math.max(0.6, 0.03 * ph);
      const rp = 0.02 * ph * Math.sin(W.t * 3 + f._x * 0.1);
      ctx.beginPath(); ctx.ellipse(f._x, wl + rp, 0.34 * h, 0.05 * h, 0, 0, TAU); ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawClothes(ctx, p) {
    const ph = PH(2), x = p.x * W.w, y = vY(p.x, 0.12);
    const cols = [[150, 70, 60], [96, 104, 132], [196, 176, 136], [112, 92, 72], [132, 116, 150]];
    ctx.globalAlpha = p.a;
    for (let i = 0; i < 5; i++) {
      const dx = (i % 2 ? 0.1 : -0.08) * ph, dy = -i * 0.06 * ph;
      ctx.fillStyle = css(cols[i], 2);
      ctx.beginPath(); ctx.ellipse(x + dx, y + dy - 0.05 * ph, (0.26 - i * 0.02) * ph, 0.06 * ph, (i - 2) * 0.06, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：殿的美门、所罗门的廊（公会）、城门
  // ════════════════════════════════════════════════════════════
  const GOLD = [222, 186, 96];
  function gateG(p) { const ph = PH(2), x = p.x * W.w, g = gY(2, p.x) + 0.08 * ph; return { ph, x, g, gw: 1.3 * ph, gh: 2.05 * ph, tw: 0.95 * ph, th: 2.95 * ph }; }
  function wallBand(ctx, xa, xb, H, base, cren) {
    const N = Math.max(2, Math.ceil((xb - xa) / 12));
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(xa, xb, i / N); const y = base(x) - H; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(xa, xb, i / N); ctx.lineTo(x, base(x) + 3); }
    ctx.closePath(); ctx.fill();
    if (cren) {
      ctx.beginPath();
      for (let x = xa; x < xb - cren; x += cren * 2) { const y = base(x + cren / 2) - H; ctx.rect(x, y - cren * 0.7, cren, cren * 0.7 + 1); }
      ctx.fill();
    }
  }
  function drawGate(ctx, p) {
    const G = gateG(p), ph = G.ph, city = p.style === 'city', un = Math.max(0.5, W.unit), nk = nightK();
    const WC = city ? [196, 176, 140] : [226, 212, 182];
    const base = x => gY(2, clamp(x / W.w, 0, 1)) + 0.08 * ph;
    const sunL = litX() < G.x;
    const tl = G.x - G.gw / 2 - G.tw, tr = G.x + G.gw / 2 + G.tw;
    ctx.globalAlpha = p.a;
    // 墙：左边一段；右边到廊（殿）或到画面之外（城）
    ctx.fillStyle = css(mul(WC, 0.96), 2);
    const xl0 = G.x - (city ? 4.6 : 3.2) * ph, xr1 = city ? W.w + 20 : Math.max(tr + 4, p.x1 * W.w);
    if (!city) wallBand(ctx, xl0, tl + 2, 1.75 * ph, base, 0);
    wallBand(ctx, tr - 2, xr1, (city ? 2.0 : 1.75) * ph, base, city ? Math.max(1.5, 0.15 * ph) : 0);
    // 门洞里：殿院里的光（殿）/ 城外的暗（城）
    const gb = G.g, arcY = gb - G.gh + G.gw / 2;
    ctx.fillStyle = city ? css([58, 50, 44], 2) : css([236, 214, 170], 2, 1, 0.12);
    ctx.beginPath(); ctx.moveTo(G.x - G.gw / 2, gb); ctx.lineTo(G.x - G.gw / 2, arcY); ctx.arc(G.x, arcY, G.gw / 2, Math.PI, 0); ctx.lineTo(G.x + G.gw / 2, gb); ctx.closePath(); ctx.fill();
    // 门扇：殿的美门是铜的（开着，贴在两边）
    const open = clamp(p.open, 0, 1), leaf = G.gw / 2 * (1 - 0.8 * open);
    ctx.fillStyle = city ? css([104, 78, 56], 2) : css([196, 148, 80], 2, 1, 0.12);
    ctx.fillRect(G.x - G.gw / 2, arcY - 0.1 * ph, leaf, gb - arcY + 0.1 * ph);
    ctx.fillRect(G.x + G.gw / 2 - leaf, arcY - 0.1 * ph, leaf, gb - arcY + 0.1 * ph);
    if (!city) {
      ctx.fillStyle = css([252, 216, 140], 2, 0.6 * (0.4 + 0.6 * dayA()), 0.2);
      for (const sx of [G.x - G.gw / 2, G.x + G.gw / 2 - leaf]) for (let j = 0; j < 3; j++) ctx.fillRect(sx + leaf * 0.2, arcY + (0.2 + j * 0.45) * ph, leaf * 0.6, Math.max(0.6, 0.04 * ph));
    }
    // 两座门楼
    ctx.fillStyle = css(WC, 2);
    for (const cx of [G.x - G.gw / 2 - G.tw / 2, G.x + G.gw / 2 + G.tw / 2]) ctx.fillRect(cx - G.tw / 2, base(cx) - G.th, G.tw, G.th + 3);
    // 门上的楣
    ctx.fillRect(tl, gb - G.gh - 0.45 * ph, tr - tl, 0.5 * ph);
    ctx.fillStyle = css(mul(WC, 0.78), 2, 0.9);
    for (const cx of [G.x - G.gw / 2 - G.tw / 2, G.x + G.gw / 2 + G.tw / 2]) ctx.fillRect(sunL ? cx + G.tw / 2 - G.tw * 0.24 : cx - G.tw / 2, base(cx) - G.th, G.tw * 0.24, G.th + 3);
    if (city) {
      ctx.fillStyle = css(WC, 2);
      const cr = Math.max(1.5, 0.16 * ph);
      for (const cx of [G.x - G.gw / 2 - G.tw / 2, G.x + G.gw / 2 + G.tw / 2]) for (let j = 0; j < 3; j++) ctx.fillRect(cx - G.tw / 2 + j * G.tw * 0.4, base(cx) - G.th - cr * 0.8, G.tw * 0.22, cr * 0.8 + 1);
    } else {
      // 殿门的金边与檐
      ctx.fillStyle = css(GOLD, 2, 1, 0.18);
      ctx.fillRect(tl - 0.05 * ph, gb - G.gh - 0.5 * ph, tr - tl + 0.1 * ph, 0.07 * ph);
      for (const cx of [G.x - G.gw / 2 - G.tw / 2, G.x + G.gw / 2 + G.tw / 2]) ctx.fillRect(cx - G.tw / 2 - 0.04 * ph, base(cx) - G.th - 0.07 * ph, G.tw + 0.08 * ph, 0.07 * ph);
    }
    // 迎光的边
    ctx.strokeStyle = css(lit(WC), 2, rimA(), 0.1);
    ctx.lineWidth = Math.max(0.6, 0.9 * un);
    ctx.beginPath();
    for (const cx of [G.x - G.gw / 2 - G.tw / 2, G.x + G.gw / 2 + G.tw / 2]) { const ex = sunL ? cx - G.tw / 2 : cx + G.tw / 2; ctx.moveTo(ex, base(cx) - G.th * 0.4); ctx.lineTo(ex, base(cx) - G.th); }
    ctx.stroke();
    // 门里的光（殿院）/ 门上的火把（城，夜里）
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      if (!city) glowAt(SP.gold, G.x, arcY + 0.3 * ph, G.gw * 1.1, (0.12 + 0.3 * nk) * p.a);
      else glowAt(SP.warm, G.x, gb - G.gh - 0.2 * ph, 1.2 * ph, 0.35 * nk * p.a);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 廊的地基：沿地面取几个点，平滑地连起来（地面的小起伏不必跟着）
  function smoothBase(x0, x1, off) {
    const n = 6, ys = [];
    for (let i = 0; i <= n; i++) ys.push(gY(2, clamp(lerp(x0, x1, i / n) / W.w, 0, 1)));
    return x => { const t = clamp((x - x0) / Math.max(1, x1 - x0), 0, 1) * n, i = Math.min(n - 1, Math.floor(t)), f = t - i, e = f * f * (3 - 2 * f); return lerp(ys[i], ys[i + 1], e) + off; };
  }
  // 所罗门的廊：一排石柱、檐与雪松木的顶；公会时廊下摆出石凳（k2）
  function drawPorch(ctx, p) {
    const ph = PH(2), x0 = p.x0 * W.w, x1 = p.x1 * W.w, un = Math.max(0.5, W.unit), nk = nightK();
    const colH = 2.35 * ph, step = 0.78 * ph, pw = 0.15 * ph, sunL = litX() < (x0 + x1) / 2;
    const base = smoothBase(x0 - 0.3 * ph, x1, 0.06 * ph);
    ctx.globalAlpha = p.a;
    // 廊里的后墙（荫凉）
    ctx.fillStyle = css([168, 152, 124], 2, 1, -0.06);
    wallBand(ctx, x0, x1, colH, base, 0);
    // 后墙上的门与灯
    ctx.fillStyle = css([88, 70, 52], 2);
    for (let x = x0 + step * 1.5; x < x1 - step; x += step * 4) { const g = base(x); ctx.fillRect(x - 0.18 * ph, g - 1.0 * ph, 0.36 * ph, 1.0 * ph); }
    // 石的台基
    ctx.fillStyle = css([214, 200, 170], 2);
    ctx.beginPath();
    const N = 24;
    for (let i = 0; i <= N; i++) { const x = lerp(x0 - 0.2 * ph, x1, i / N); if (i) ctx.lineTo(x, base(x) - 0.12 * ph); else ctx.moveTo(x, base(x) - 0.12 * ph); }
    for (let i = N; i >= 0; i--) { const x = lerp(x0 - 0.2 * ph, x1, i / N); ctx.lineTo(x, base(x) + 0.06 * ph); }
    ctx.closePath(); ctx.fill();
    // 柱
    ctx.fillStyle = css([228, 216, 190], 2);
    ctx.beginPath();
    for (let x = x0 + step * 0.4; x < x1 + step; x += step) { const g = base(x) - 0.1 * ph; ctx.rect(x - pw / 2, g - colH, pw, colH); ctx.rect(x - pw * 0.8, g - 0.08 * ph, pw * 1.6, 0.08 * ph); ctx.rect(x - pw * 0.8, g - colH, pw * 1.6, 0.08 * ph); }
    ctx.fill();
    // 檐与顶
    ctx.fillStyle = css([206, 192, 162], 2);
    wallBand(ctx, x0 - 0.1 * ph, x1, 0.22 * ph, x => base(x) - colH - 0.08 * ph, 0);
    ctx.fillStyle = css([112, 84, 60], 2, 0.95);
    wallBand(ctx, x0 - 0.2 * ph, x1, 0.12 * ph, x => base(x) - colH - 0.3 * ph, 0);
    ctx.fillStyle = css(GOLD, 2, 0.8, 0.12);
    wallBand(ctx, x0 - 0.1 * ph, x1, Math.max(0.8, 0.035 * ph), x => base(x) - colH - 0.1 * ph, 0);
    // 迎光的边
    ctx.strokeStyle = css(lit([228, 216, 190]), 2, rimA(), 0.08);
    ctx.lineWidth = Math.max(0.6, 0.8 * un);
    ctx.beginPath();
    for (let x = x0 + step * 0.4; x < x1 + step; x += step) { const g = base(x) - 0.1 * ph, ex = sunL ? x - pw / 2 : x + pw / 2; ctx.moveTo(ex, g); ctx.lineTo(ex, g - colH); }
    ctx.stroke();
    // 公会：石凳（后排长凳；当中大祭司的座）
    if (p.k2 > 0.01) {
      ctx.globalAlpha = p.a * p.k2;
      ctx.fillStyle = css([190, 176, 146], 2);
      wallBand(ctx, x0 + 0.1 * ph, x1, 0.27 * ph, x => base(x) - 0.04 * ph, 0);
      ctx.fillStyle = css(lit([190, 176, 146]), 2, 0.7, 0.05);
      wallBand(ctx, x0 + 0.1 * ph, x1, Math.max(0.8, 0.04 * ph), x => base(x) - 0.3 * ph, 0);
      const hx = councilX('hp') * W.w, hg = base(hx);
      ctx.fillStyle = css([150, 120, 150], 2);
      ctx.fillRect(hx - 0.3 * ph, hg - 1.25 * ph, 0.6 * ph, 1.2 * ph);
      ctx.fillStyle = css(GOLD, 2, 1, 0.12);
      ctx.fillRect(hx - 0.33 * ph, hg - 1.3 * ph, 0.66 * ph, 0.08 * ph);
      ctx.globalAlpha = p.a;
    }
    // 廊下的灯（黄昏以后）
    if (nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let x = x0 + step * 1.5; x < x1 - step; x += step * 4) { const g = base(x); glowAt(SP.warm, x, g - 1.3 * ph, 1.2 * ph, 0.35 * nk * p.a); glowAt(SP.gold, x, g - 1.3 * ph, 0.2 * ph, 0.7 * nk * p.a); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：外监——前面是铁栅的石牢（夜里只有火把、月光与使者的光）
  // ════════════════════════════════════════════════════════════
  function prisonG(p) {
    const ph = PH(2), c = (p.x0 + p.x1) / 2, xa = p.x0 * W.w, xb = p.x1 * W.w, gb = gY(2, c), gf = vY(c, 0.46), H = 2.45 * ph;
    return { ph, c, cx: c * W.w, xa, xb, gb, gf, H, bx0: xa + 0.35 * ph, bx1: xb - 0.35 * ph, fx0: xa - 0.25 * ph, fx1: xb + 0.25 * ph, yc: gb - H, yt: gb - H - 0.4 * ph };
  }
  function drawPrison(ctx, p) {
    const G = prisonG(p), { ph, gb, gf, bx0, bx1, fx0, fx1, yc, yt } = G, nk = nightK();
    const ST = [150, 140, 124];
    ctx.globalAlpha = p.a;
    // 外面的厚墙与顶
    ctx.fillStyle = css(ST, 2);
    ctx.fillRect(fx0 - 0.5 * ph, yt - 0.5 * ph, 0.5 * ph, gf - yt + 0.5 * ph);
    ctx.fillRect(fx1, yt - 0.5 * ph, 0.5 * ph, gf - yt + 0.5 * ph);
    ctx.fillRect(fx0 - 0.6 * ph, yt - 0.62 * ph, fx1 - fx0 + 1.2 * ph, 0.64 * ph);
    ctx.strokeStyle = css(mul(ST, 0.7), 2, 0.5); ctx.lineWidth = Math.max(0.5, 0.025 * ph);
    ctx.beginPath();
    for (let k = 0; k < 6; k++) { const y = yt - 0.5 * ph + k * (gf - yt) / 6; ctx.moveTo(fx0 - 0.5 * ph, y); ctx.lineTo(fx0, y); ctx.moveTo(fx1, y); ctx.lineTo(fx1 + 0.5 * ph, y); }
    ctx.stroke();
    // 里面：地、侧墙、顶、后墙
    const inner = [88, 82, 78];
    ctx.fillStyle = css([96, 88, 76], 2, 1, -0.05);
    ctx.beginPath(); ctx.moveTo(bx0, gb - 1); ctx.lineTo(bx1, gb - 1); ctx.lineTo(fx1, gf); ctx.lineTo(fx0, gf); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mul(inner, 0.85), 2, 1, -0.06);
    ctx.beginPath(); ctx.moveTo(fx0, yt); ctx.lineTo(bx0, yc); ctx.lineTo(bx0, gb); ctx.lineTo(fx0, gf); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(fx1, yt); ctx.lineTo(bx1, yc); ctx.lineTo(bx1, gb); ctx.lineTo(fx1, gf); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(mul(inner, 0.7), 2, 1, -0.08);
    ctx.beginPath(); ctx.moveTo(fx0, yt); ctx.lineTo(fx1, yt); ctx.lineTo(bx1, yc); ctx.lineTo(bx0, yc); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(inner, 2, 1, -0.04);
    ctx.fillRect(bx0, yc, bx1 - bx0, gb - yc);
    // 石缝
    ctx.strokeStyle = css(mul(inner, 0.7), 2, 0.5);
    ctx.beginPath();
    for (let k = 1; k < 6; k++) { const y = lerp(yc, gb, k / 6); ctx.moveTo(bx0, y); ctx.lineTo(bx1, y); for (let j = 0; j < 5; j++) { const x = lerp(bx0, bx1, (j + (k % 2) * 0.5) / 5); ctx.moveTo(x, y); ctx.lineTo(x, y - (gb - yc) / 6); } }
    ctx.stroke();
    // 高处的小窗：月光
    const wx = lerp(bx0, bx1, 0.72), wy = yc + 0.3 * ph, ww = 0.34 * ph, wh = 0.28 * ph;
    const wc = windowCol();
    ctx.fillStyle = U.rgb(wc[0], wc[1], wc[2]);
    ctx.fillRect(wx - ww / 2, wy, ww, wh);
    ctx.fillStyle = css([40, 36, 34], 2);
    for (let j = 1; j < 4; j++) ctx.fillRect(wx - ww / 2 + (ww * j) / 4 - 0.015 * ph, wy, 0.03 * ph, wh);
    if (SP && W.night > 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.12 * W.night * p.a;
      ctx.fillStyle = 'rgb(200,214,255)';
      ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + wh); ctx.lineTo(wx + ww / 2, wy + wh); ctx.lineTo(wx - ww * 0.2 - 1.2 * ph, gb); ctx.lineTo(wx - ww * 1.6 - 1.2 * ph, gb); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 墙上的铁环与链子
    ctx.strokeStyle = css([60, 56, 54], 2, 0.9); ctx.lineWidth = Math.max(0.6, 0.035 * ph);
    ctx.beginPath();
    for (const u of [0.2, 0.46]) { const x = lerp(bx0, bx1, u), y = lerp(yc, gb, 0.45); ctx.moveTo(x + 0.06 * ph, y); ctx.arc(x, y, 0.06 * ph, 0, TAU); ctx.moveTo(x, y + 0.06 * ph); ctx.quadraticCurveTo(x + 0.1 * ph, y + 0.4 * ph, x + 0.05 * ph, y + 0.7 * ph); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 前面的铁栅与门（画在人之前）：门在右边，开时栅门转向门轴
  function drawPrisonFront(ctx, p) {
    const G = prisonG(p), { ph, gf, fx0, fx1, yt } = G, open = clamp(p.open, 0, 1);
    const top = yt + 0.04 * ph, bot = gf, dw = 1.05 * ph, dx1 = fx1, dx0 = fx1 - dw;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([52, 48, 46], 2, 0.95);
    ctx.lineWidth = Math.max(0.8, 0.045 * ph);
    ctx.beginPath();
    const stepB = 0.3 * ph;
    for (let x = fx0 + stepB * 0.5; x < dx0 - 0.02 * ph; x += stepB) { ctx.moveTo(x, top); ctx.lineTo(x, bot); }
    // 门的栅：开时向右边的门轴收拢
    const sq = 1 - 0.82 * open;
    for (let j = 0; j < 4; j++) { const x = dx1 - (dx1 - (dx0 + (j + 0.5) * dw / 4)) * sq; ctx.moveTo(x, top + 0.05 * ph); ctx.lineTo(x, bot - 0.02 * ph); }
    ctx.stroke();
    ctx.lineWidth = Math.max(1, 0.07 * ph);
    ctx.beginPath();
    ctx.moveTo(fx0, top); ctx.lineTo(dx0, top); ctx.moveTo(fx0, lerp(top, bot, 0.52)); ctx.lineTo(dx0, lerp(top, bot, 0.52)); ctx.moveTo(fx0, bot - 0.03 * ph); ctx.lineTo(dx0, bot - 0.03 * ph);
    const dl = dx1 - dw * sq;
    ctx.moveTo(dl, top + 0.05 * ph); ctx.lineTo(dx1, top + 0.05 * ph); ctx.moveTo(dl, lerp(top, bot, 0.52)); ctx.lineTo(dx1, lerp(top, bot, 0.52)); ctx.moveTo(dl, bot - 0.05 * ph); ctx.lineTo(dx1, bot - 0.05 * ph);
    ctx.stroke();
    // 铁上的一点光（火把 / 月）
    ctx.strokeStyle = css([176, 160, 140], 2, 0.3 + 0.3 * nightK(), 0.1);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let x = fx0 + stepB * 0.5; x < dx0 - 0.02 * ph; x += stepB) { ctx.moveTo(x + 0.02 * ph, top); ctx.lineTo(x + 0.02 * ph, lerp(top, bot, 0.5)); }
    ctx.stroke();
    // 锁
    ctx.fillStyle = css([90, 80, 70], 2);
    ctx.fillRect(dl - 0.06 * ph, lerp(top, bot, 0.5) - 0.08 * ph, 0.12 * ph, 0.16 * ph);
    // 门开了：门洞里透出使者的光，门框与门扇的边亮起来
    const lightK = open * clamp(lv('pcHeaven') * 1.4, 0, 1) * p.a;
    if (lightK > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const mx = (dx0 + dl) / 2, my = lerp(top, bot, 0.55);
      glowAt(SP.pale, mx, my, Math.max(dl - dx0, 0.3 * ph) * 1.1, 0.55 * lightK, 1.6);
      glowAt(SP.white, mx, bot - 0.1 * ph, 0.9 * ph, 0.35 * lightK, 0.35);
      ctx.globalAlpha = Math.min(1, 0.55 * lightK);
      ctx.strokeStyle = 'rgb(255,244,214)';
      ctx.lineWidth = Math.max(1, 0.05 * ph);
      ctx.beginPath(); ctx.moveTo(dx0, top); ctx.lineTo(dx0, bot); ctx.moveTo(dl, top + 0.05 * ph); ctx.lineTo(dl, bot - 0.02 * ph); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 使者身上的光：跟着他走，是牢里最亮的
  function drawAngelLight(ctx) {
    const f = fig('angelP');
    if (!f || !f._vis || f.alpha < 0.02 || !SP || !isFinite(f._x)) return;
    const ph = PH(2), a = f.alpha, cy = f._y - f._h * 0.55;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.pale, f._x, cy, 2.3 * ph, 0.38 * a, 1.1);
    glowAt(SP.white, f._x, cy, 1.2 * ph, 0.62 * a, 1.25);
    glowAt(SP.gold, f._x, f._y - 0.05 * ph, 1.5 * ph, 0.3 * a, 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：光——见证的光、云彩、天上来的光、风、火、话语、光雨、座位、荣耀
  // ════════════════════════════════════════════════════════════
  // 见证的光：自山顶，经耶路撒冷、犹太（中丘）、撒马利亚（远山）、直到地极（天边）
  let RP = null;
  function reachPts() {
    if (RP && RP.w === W.w && RP.h === W.h) return RP;
    const pts = [];
    for (const l of [0, 1]) {
      const sp = W.landSpan(l);
      if (!sp) continue;
      const a = sp[0] / W.w, b = sp[1] / W.w, n = l === 0 ? 26 : 18;
      for (let i = 0; i < n; i++) {
        const f = a + (b - a) * ((i + 0.2 + hsh(i * 3.7 + l * 11) * 0.6) / n);
        const inCity = l === 1 && f >= X.city0 - 0.02;
        const thr = l === 1 ? (inCity ? 0.08 + 0.1 * hsh(i * 2.3) : 0.25 + 0.28 * (1 - f)) : 0.46 + 0.3 * (1 - f) * (1 - hsh(i * 1.3) * 0.3);
        // 信的人的灯（pcLights）也借这些点：中丘先亮，远山最后
        const lthr = l === 1 ? 0.15 + 0.6 * hsh(i * 9.1 + 3) : 0.62 + 0.36 * hsh(i * 4.7 + 1);
        pts.push({ l, f, r: hsh(i * 5.1 + l), thr, lthr });
      }
    }
    RP = { w: W.w, h: W.h, pts };
    return RP;
  }
  function drawReach(ctx, l) {
    const k = lv('pcReach'), A = lv('pcReachA'), bel = lv('pcLights');
    if ((k < 0.005 || A < 0.01) && bel < 0.01) return;
    if (!SP) return;
    const s = LS(l), dk = 1 + 0.7 * W.dayFactor;   // 白日里光点大些，才看得见
    ctx.globalCompositeOperation = 'lighter';
    for (const q of reachPts().pts) {
      if (q.l !== l) continue;
      const a = clamp((k - q.thr) * 6, 0, 1) * A, b = clamp((bel - q.lthr) * 5, 0, 1);
      const x = q.f * W.w, y = gY(l, q.f) - 2 * s, tw = 0.8 + 0.2 * Math.sin(W.t * 2 + q.r * 9);
      if (a > 0.01) { glowAt(SP.gold, x, y, (l === 0 ? 10 : 14) * s * dk, a * tw * 0.75); glowAt(SP.white, x, y, (l === 0 ? 3 : 4) * s * dk, a * tw); }
      if (b > 0.01) {
        const nk = nightK();
        glowAt(SP.lamp, x, y + 1 * s, (l === 0 ? 6 : 8) * s, b * tw * 0.7 * nk);
        glowAt(SP.gold, x, y, (l === 0 ? 7 : 10) * s, b * tw * (0.55 - 0.25 * nk));
        glowAt(SP.white, x, y, (l === 0 ? 2 : 2.8) * s, b * tw * 0.8);
      }
    }
    // 光的前沿：一团宽而柔的金光扫过山脊（白日里也看得出光在走）
    if (A > 0.02) {
      const k0 = l === 1 ? 0.25 : 0.46, span = l === 1 ? 0.28 : 0.255, q = (k - k0) / span;
      const sp = W.landSpan(l);
      if (q > 0 && q < 1.05 && sp) {
        const f = clamp(1 - q, sp[0] / W.w, sp[1] / W.w), env = Math.sin(Math.PI * clamp(q, 0, 1)) * A;
        const x = f * W.w, y = gY(l, f) - 3 * s;
        glowAt(SP.gold, x, y, (l === 1 ? 130 : 110) * s, 0.6 * env, 0.42);
        glowAt(SP.white, x, y, (l === 1 ? 34 : 28) * s, 0.7 * env, 0.6);
      }
    }
    // 耶路撒冷：城上一层金光
    if (l === 1 && k > 0.05) {
      const c = liveP('city');
      if (c) glowAt(SP.gold, c.x * W.w, gY(1, c.x) - 14 * s, 150 * s, 0.22 * clamp(k * 6, 0, 1) * A, 0.5);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 地极：天边的海上一线光
  function drawHorizon(ctx) {
    const a = clamp((lv('pcReach') - 0.78) * 5, 0, 1) * lv('pcReachA');
    if (a < 0.01 || !SP) return;
    const y = W.horizonY + 1, sp = W.landSpan(0), xe = sp ? sp[0] + 20 : W.w * 0.4;
    ctx.globalCompositeOperation = 'lighter';
    const gr = ctx.createLinearGradient(0, 0, xe, 0);
    gr.addColorStop(0, 'rgba(255,236,190,' + (0.8 * a).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,236,190,0)');
    ctx.fillStyle = gr;
    ctx.fillRect(0, y - 1.2, xe, 2.4);
    glowAt(SP.gold, W.w * 0.04, y, 60 * SU(), 0.5 * a, 0.35);
    glowAt(SP.white, W.w * 0.04, y, 14 * SU(), 0.7 * a);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 光明的云彩（接他升天）
  const cloudX = () => summitX() * W.w;
  const cloudY = () => lerp(PORT ? W.h * 0.3 : W.h * 0.06, PORT ? W.h * 0.43 : W.h * 0.3, ease(clamp(lv('pcCloudY'), 0, 1)));
  const PUFF = [[0, 0, 1.3], [-1.1, 0.2, 0.95], [1.05, 0.18, 1], [-0.55, -0.35, 0.9], [0.6, -0.32, 0.85], [-1.8, 0.35, 0.6], [1.75, 0.34, 0.62], [0.05, 0.4, 1.05]];
  function drawCloud(ctx) {
    const k = lv('pcCloud');
    if (k < 0.01 || !SP) return;
    const x = cloudX(), y = cloudY(), u = PH(2) * (PORT ? 1.25 : 1.4);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, x, y, u * 4.4, 0.3 * k, 0.55);
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < PUFF.length; i++) {
      const q = PUFF[i], dx = Math.sin(W.t * 0.3 + i * 1.7) * 0.06 * u;
      glowAt(SP.cloud, x + q[0] * u + dx, y + q[1] * u, q[2] * u * 1.1, 0.62 * k, 0.62);
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, x, y, u * 1.9, 0.55 * k, 0.6);
    glowAt(SP.gold, x, y + 0.35 * u, u * 2.6, 0.3 * k, 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天上来的光：自天顶（或自荣耀处）落到 S.beam
  let beamXs = null;
  // 荣耀之处：在人的上方偏左一点（光自那里陡陡地落下），离开顶上的标题与手机的经文
  function gloryPt() { return PORT ? [W.w * 0.56, W.h * 0.445] : [W.w * 0.64, W.h * 0.22]; }
  function beamTarget() {
    const xf = S.beam, ph = PH(2);
    let y = (S.beamV ? vY(xf, S.beamV) : gY(2, xf)) - 1.1 * ph;
    if (S.scene === 'olivet') y = mountY(xf) - 1.0 * ph;
    return [xf * W.w, y];
  }
  function drawHeaven(ctx) {
    const k = lv('pcHeaven');
    if (k < 0.01 || !SP) return;
    const t = beamTarget(), bx = beamXs == null ? t[0] : beamXs;
    // 手机上经文在顶上：光自经文之下的天上落下，不从经文后面穿过
    const top = S.beamG ? gloryPt() : [bx, PORT ? W.h * 0.32 : -10];
    const w = 2.4 * PH(2) * (0.6 + 0.4 * k);
    ctx.globalCompositeOperation = 'lighter';
    beamLine(ctx, top[0], top[1], bx, t[1] + 0.8 * PH(2), w, (S.beamG ? 0.6 : 0.42) * k);
    if (S.beamG) beamLine(ctx, top[0], top[1], bx, t[1] + 0.8 * PH(2), w * 0.35, 0.5 * k);
    glowAt(SP.white, bx, t[1], 1.4 * PH(2), 0.42 * k);
    glowAt(SP.gold, bx, t[1] + 0.5 * PH(2), 1.2 * PH(2), 0.3 * k, 1.3);
    if (!S.beamG) glowAt(SP.white, bx, top[1] + 10, (PORT ? 90 : 200) * SU(), (PORT ? 0.3 : 0.45) * k, 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一阵大风：一道道风的光自左上的天卷进屋子
  function drawWind(ctx) {
    const k = lv('pcWind');
    if (k < 0.02) return;
    const G = roomG({ x0: X.room0, x1: X.room1 }), n = PORT ? 22 : 38, u = SU();
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const h1 = hsh(i * 1.31), h2 = hsh(i * 2.77), h3 = hsh(i * 4.19), h4 = hsh(i * 6.07);
      const sx = (-0.08 + 0.5 * h1) * W.w, sy = (0.03 + 0.22 * h2) * W.h;
      const ex = G.cx + (h3 - 0.5) * (G.bx1 - G.bx0) * 0.9, ey = lerp(G.yc, G.gb, 0.2 + 0.6 * h4);
      const cx = lerp(sx, ex, 0.75), cy = sy - 0.02 * W.h;
      const sp = 0.32 + 0.25 * hsh(i * 8.3), ph0 = hsh(i * 9.7);
      const q = (W.t * sp + ph0) % 1;
      const a = k * Math.sin(Math.PI * q) * (0.4 + 0.4 * h2);
      if (a < 0.01) continue;
      ctx.strokeStyle = 'rgba(255,244,214,' + a.toFixed(3) + ')';
      ctx.lineWidth = (1.2 + 2 * h3) * u;
      ctx.beginPath();
      for (let j = 0; j <= 6; j++) {
        const t = clamp(q - 0.14 + (j / 6) * 0.14, 0, 1), i1 = 1 - t;
        const x = i1 * i1 * sx + 2 * i1 * t * cx + t * t * ex, y = i1 * i1 * sy + 2 * i1 * t * cy + t * t * ey;
        if (j) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    // 屋里的旋风
    const room = liveP('room');
    if (room && room.a > 0.1) {
      for (let i = 0; i < 6; i++) {
        const a = k * room.a * 0.3, r = (0.3 + 0.12 * i) * (G.bx1 - G.bx0) * 0.5, t0 = W.t * (1.3 + 0.2 * i) + i;
        ctx.strokeStyle = 'rgba(255,240,210,' + a.toFixed(3) + ')';
        ctx.lineWidth = 1.2 * u;
        ctx.beginPath(); ctx.ellipse(G.cx, lerp(G.yc, G.gb, 0.45), r, r * 0.28, 0, t0, t0 + 1.2); ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }
  // 火：屋上的一团火（自灵的所在降下）→ 分开 → 落在各人头上
  let flameFrom = null;
  function flameTop() { const G = roomG({ x0: X.room0, x1: X.room1 }); return [G.cx, G.yt - 1.25 * G.ph]; }
  function drawFire(ctx) {
    const kf = lv('pcFlame'), kd = clamp(lv('pcDivide'), 0, 1), kr = lv('pcFire'), ph = PH(2);
    if (kf < 0.01 && kr < 0.01) return;
    const ft = flameTop();
    if (kf > 0.01) {
      // 大火自灵之处落到屋上
      const src = flameFrom || ft, e = ease(clamp(kf * 1.2, 0, 1));
      const x = lerp(src[0], ft[0], e), y = lerp(src[1], ft[1], e);
      const big = (1 - kd) * kf;
      if (big > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.fire, x, y - 0.4 * ph, 2.4 * ph, 0.45 * big);
        glowAt(SP.gold, x, y - 0.4 * ph, 1.2 * ph, 0.5 * big);
        ctx.globalCompositeOperation = 'source-over';
        tongue(ctx, x, y, 1.1 * ph * (0.7 + 0.3 * big), big, 3.1);
      }
    }
    if (!S.fire.length) return;
    const e = ease(kd);
    for (let i = 0; i < S.fire.length; i++) {
      const f = fig(S.fire[i]);
      if (!f || !f._vis || f.alpha < 0.05) continue;
      const h = headOfF(f, 1);
      if (!h) continue;
      const hy = h[1] - 0.04 * ph;
      let x = h[0], y = hy, a = kr;
      if (kd < 0.999) {
        // 分开：各自沿一道弧落下
        const t = clamp(e * 1.25 - (i / S.fire.length) * 0.25, 0, 1);
        x = lerp(ft[0], h[0], t); y = lerp(ft[1], hy, t) - Math.sin(Math.PI * t) * 0.6 * ph;
        a = Math.max(kr, kf * 0.9);
      }
      if (a < 0.01) continue;
      const sz = 0.31 * ph * (0.9 + 0.1 * Math.sin(W.t * 5 + i));
      tongue(ctx, x, y, sz, a * f.alpha, i * 2.3 + 1);
    }
  }
  // 万种文字汇成的一团光（屋子上方）
  function drawOne(ctx) {
    const k = lv('pcOne');
    if (k < 0.01 || !SP) return;
    const o = onePoint(), ph = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, o[0], o[1], 2.4 * ph, 0.4 * k);
    glowAt(SP.white, o[0], o[1], 0.7 * ph, 0.8 * k);
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + W.t * 0.15, R = 2.6 * ph, w = 0.06;
      ctx.globalAlpha = 0.1 * k * (0.7 + 0.3 * Math.sin(W.t * 1.3 + i));
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(o[0] + Math.cos(a - w) * R, o[1] + Math.sin(a - w) * R); ctx.lineTo(o[0] + Math.cos(a + w) * R, o[1] + Math.sin(a + w) * R); ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 灵浇灌下来：柔和的光雨落在满地的人身上
  function drawPour(ctx) {
    const k = lv('pcPour');
    if (k < 0.01 || !SP) return;
    const x0 = (PORT ? 0.36 : 0.47) * W.w, n = PORT ? 60 : 120, u = SU();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.dawn, W.w * 0.74, W.h * 0.2, Math.max(W.w, W.h) * 0.55, 0.14 * k, 0.8);
    // 从天上垂下的一层光幕，落在满街的人身上
    const gyC = gY(2, X.crowd0 + 0.1);
    for (let j = 0; j < 5; j++) { const xf = lerp(PORT ? 0.45 : 0.55, 0.97, j / 4); beamLine(ctx, xf * W.w, -10, xf * W.w, gyC, (PORT ? 0.22 : 0.14) * W.w, 0.1 * k); }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, W.w, hsh(i * 1.37)), sp = 0.1 + 0.07 * hsh(i * 2.9), q = (W.t * sp + hsh(i * 7.3)) % 1;
      const gy = gY(2, x / W.w) - 0.1 * PH(2), y = lerp(W.h * 0.08, gy, q);
      const a = k * Math.sin(Math.PI * q) * (0.45 + 0.45 * hsh(i * 3.3));
      if (a < 0.02) continue;
      glowAt(SP.gold, x, y, 8 * u, a * 0.6, 1.9);
      glowAt(SP.white, x, y, 2.6 * u, a, 1.7);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天是我的座位：横跨天际的光弧；地是我的脚凳：地的轮廓镶上金边
  function drawThrone(ctx) {
    const k = lv('pcThrone');
    if (k < 0.01 || !SP) return;
    const cx = W.w * 0.5, cy = W.horizonY + W.h * 0.02, rx = W.w * (PORT ? 0.9 : 0.66), ry = W.horizonY - (PORT ? W.h * 0.33 : W.h * 0.07);
    const day = W.dayFactor;
    for (let j = 0; j < 3; j++) {
      ctx.strokeStyle = 'rgba(236,190,96,' + (k * day * [0.08, 0.14, 0.3][j]).toFixed(3) + ')';
      ctx.lineWidth = [30, 16, 6][j] * SU();
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 4; j++) {
      ctx.strokeStyle = 'rgba(255,236,190,' + (k * [0.06, 0.1, 0.16, 0.3][j]).toFixed(3) + ')';
      ctx.lineWidth = [34, 20, 10, 3][j] * SU();
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    }
    glowAt(SP.gold, cx, cy - ry, 160 * SU(), 0.35 * k, 0.6);
    glowAt(SP.white, cx, cy - ry, 50 * SU(), 0.5 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawFootstool(ctx, l) {
    const k = lv('pcThrone');
    if (k < 0.01) return;
    const sp = W.landSpan(l);
    if (!sp) return;
    const N = 60, a0 = sp[0], a1 = sp[1];
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,226,160,' + (k * (l === 2 ? 0.45 : 0.3)).toFixed(3) + ')';
    ctx.lineWidth = (l === 2 ? 2.2 : 1.4) * SU();
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(a0, a1, i / N), y = (l === 2 ? gY(2, x / W.w) : W.ridgeY(l, x)) - 1; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天开了：云彩向左右分开，当中一道直直的光（神的荣耀，不是一个物）；
  // 耶稣站在神的右边：云缝边上一个光的人形（头、肩、垂下的手臂、下摆渐宽的长衣；无面目）
  const GPUFF = [[0.3, 0.06, 1.0], [1.05, -0.2, 1.15], [1.9, 0.08, 1.02], [2.65, -0.1, 0.82], [1.4, 0.42, 0.92], [0.7, 0.46, 0.76], [3.25, 0.22, 0.62]];
  function sonFigure(ctx, x, fy, H, a) {
    const top = fy - H, hr = H * 0.078, hy = top + hr, ny = hy + hr * 1.12, sh = ny + H * 0.045;
    const sw = H * 0.148, hw = H * 0.205, hand = sh + H * 0.36;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, x, fy - H * 0.52, H * 0.78, 0.5 * a, 1.35);
    glowAt(SP.gold, x, fy - H * 0.46, H * 1.25, 0.3 * a, 1.1);
    ctx.globalCompositeOperation = 'source-over';
    const body = () => {
      ctx.beginPath();
      ctx.moveTo(x - hr * 0.5, ny);
      ctx.quadraticCurveTo(x - sw * 0.92, sh - H * 0.012, x - sw, sh + H * 0.055);
      ctx.lineTo(x - sw * 1.06, hand);
      ctx.quadraticCurveTo(x - hw * 0.96, fy - H * 0.2, x - hw, fy);
      ctx.quadraticCurveTo(x, fy + H * 0.03, x + hw, fy);
      ctx.quadraticCurveTo(x + hw * 0.96, fy - H * 0.2, x + sw * 1.06, hand);
      ctx.lineTo(x + sw, sh + H * 0.055);
      ctx.quadraticCurveTo(x + sw * 0.92, sh - H * 0.012, x + hr * 0.5, ny);
      ctx.closePath();
      ctx.moveTo(x + hr, hy); ctx.arc(x, hy, hr, 0, TAU);
    };
    const gr = ctx.createLinearGradient(0, top, 0, fy);
    gr.addColorStop(0, 'rgba(255,253,246,1)'); gr.addColorStop(0.62, 'rgba(255,247,226,0.97)'); gr.addColorStop(1, 'rgba(255,238,200,0.5)');
    ctx.globalAlpha = a;
    ctx.fillStyle = gr;
    body(); ctx.fill();
    // 金边：在亮的天与云上也认得出人形；两臂的内缘
    ctx.strokeStyle = 'rgba(206,158,74,0.48)';
    ctx.lineWidth = Math.max(0.8, H * 0.014);
    body(); ctx.stroke();
    ctx.strokeStyle = 'rgba(214,170,92,0.45)';
    ctx.beginPath();
    for (const d of [-1, 1]) { ctx.moveTo(x + d * sw * 0.74, sh + H * 0.08); ctx.quadraticCurveTo(x + d * sw * 0.8, sh + H * 0.22, x + d * sw * 0.86, hand + H * 0.01); }
    ctx.stroke();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, x, hy, hr * 2.2, 0.55 * a);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawGlory(ctx) {
    const k = lv('pcGlory');
    if (k < 0.01 || !SP) return;
    const g = gloryPt(), ph = PH(2), u = ph * (PORT ? 1.15 : 1.3);
    const open = ease(clamp(k, 0, 1)), sep = u * (0.3 + 1.0 * open);
    // 云后柔和的光
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.dawn, g[0], g[1], Math.max(W.w, W.h) * 0.3, 0.2 * k, 0.75);
    glowAt(SP.gold, g[0], g[1] + 0.2 * u, u * 3.2, 0.3 * k, 0.8);
    // 云缝里直直的一道光
    beamLine(ctx, g[0], g[1] - u * (PORT ? 1.5 : 2.6), g[0], g[1] + 1.3 * u, sep * 1.45, 0.6 * k);
    glowAt(SP.white, g[0], g[1], sep * 0.62, 0.5 * k, 2.6);
    // 两边的云，向左右分开（先画云底的影，再画云头，才有团团的样子）
    ctx.globalCompositeOperation = 'source-over';
    const ca = 0.8 * Math.min(1, k * 1.4);
    for (const pass of [0, 1]) {
      for (const side of [-1, 1]) {
        for (let i = 0; i < GPUFF.length; i++) {
          const q = GPUFF[i], dx = Math.sin(W.t * 0.25 + i * 1.3 + side) * 0.05 * u;
          const x = g[0] + side * (sep + q[0] * u) + dx, y = g[1] + q[1] * u, r = q[2] * u * 1.1;
          if (pass === 0) glowAt(SP.cshade, x + side * 0.05 * u, y + 0.2 * u, r * 1.02, ca * 0.45, 0.62);
          else glowAt(SP.cloud, x, y - 0.06 * u, r * 0.94, ca, 0.66);
        }
      }
    }
    // 云向着光的一边镶着金（柔和的一道边）
    ctx.globalCompositeOperation = 'lighter';
    for (const side of [-1, 1]) glowAt(SP.gold, g[0] + side * (sep + 0.05 * u), g[1] + 0.05 * u, u * 0.95, 0.24 * k, 1.3);
    ctx.globalCompositeOperation = 'source-over';
    // 站在神的右边的（光的人形，站在左边那片云的边上，挨着光）
    const sk = clamp(k * 2 - 1, 0, 1);
    if (sk > 0.01) sonFigure(ctx, g[0] - sep * 0.72, g[1] + 0.52 * u, 1.5 * ph, sk);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 他的灵顺着光升上去
  function drawSoul(ctx) {
    const k = lv('pcSoul');
    if (k < 0.005 || k > 0.995 || !SP) return;
    const a = headOf('stephen', 0.6), g = gloryPt(), e = ease(k);
    const x = lerp(a[0], g[0], e), y = lerp(a[1], g[1], e), u = SU();
    const env = Math.sin(Math.PI * k);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i < 6; i++) { const t = clamp(e - i * 0.035, 0, 1); glowAt(SP.pale, lerp(a[0], g[0], t), lerp(a[1], g[1], t), (8 - i) * u, 0.3 * env * (1 - i / 6)); }
    glowAt(SP.white, x, y, 12 * u, 0.9 * env);
    glowAt(SP.gold, x, y, 26 * u, 0.4 * env);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 司提反的面貌好像天使的面貌
  function drawAngelFace(ctx) {
    const k = lv('pcAngel');
    if (k < 0.01 || !SP) return;
    const f = fig('stephen');
    if (!f || !f._vis) return;
    const h = headOfF(f, 0.93), ph = PH(2);
    if (!h) return;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, h[0], h[1], 0.34 * ph, 0.7 * k * f.alpha);
    glowAt(SP.pale, h[0], h[1] + 0.3 * ph, 1.1 * ph, 0.28 * k * f.alpha, 1.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 复活的主身边一层淡淡的光
  function drawPresence(ctx) {
    const f = fig('jesus');
    if (!f || !f._vis || f.alpha < 0.02 || !SP) return;
    const k = f.alpha * (0.16 + 0.4 * nightK() + 0.2 * clamp((f.glow || 0.5) - 0.6, 0, 1));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.pale, f._x, f._y - f._h * 0.5, f._h * 1.2, k, 1.2);
    glowAt(SP.gold, f._x, f._y - f._h * 0.2, f._h * 0.9, k * 0.6, 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 经上的往事：星、荆棘里的火、帐幕、殿宇（天上一一显出光影）
  function visionPt() { return PORT ? [W.w * 0.55, W.h * 0.5] : [W.w * 0.62, W.h * 0.37]; }
  function drawVision(ctx, e) {
    const q = e.t / e.dur, env = Math.sin(Math.PI * clamp(q, 0, 1)), ph = PH(2), c = visionPt(), s = ph * 1.1;
    if (env < 0.01) return;
    const x = c[0], y = c[1] - (e.kind === 'temple' ? q * q * 0.9 * ph * 3 : 0);
    const a = env * (e.kind === 'temple' ? 1 - q * 0.6 : 1);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, x, y, 2.4 * s, 0.35 * a);
    ctx.globalCompositeOperation = 'source-over';
    const day = W.dayFactor, col = day > 0.5 ? [226, 168, 70] : [255, 238, 200];
    ctx.strokeStyle = rgba(col, 0.9 * a);
    ctx.fillStyle = rgba(col, 0.9 * a);
    ctx.lineWidth = Math.max(1.2, 0.07 * ph);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (e.kind === 'stars') {
      for (let i = 0; i < 14; i++) {
        const ang = i * 2.39996, r = Math.sqrt((i + 0.5) / 14) * 1.4 * s, sx = x + Math.cos(ang) * r, sy = y + Math.sin(ang) * r * 0.6, rr = (i === 0 ? 0.16 : 0.09) * s;
        ctx.beginPath(); ctx.moveTo(sx, sy - rr * 2.2); ctx.lineTo(sx + rr * 0.5, sy - rr * 0.5); ctx.lineTo(sx + rr * 2.2, sy); ctx.lineTo(sx + rr * 0.5, sy + rr * 0.5); ctx.lineTo(sx, sy + rr * 2.2); ctx.lineTo(sx - rr * 0.5, sy + rr * 0.5); ctx.lineTo(sx - rr * 2.2, sy); ctx.lineTo(sx - rr * 0.5, sy - rr * 0.5); ctx.closePath(); ctx.fill();
      }
    } else if (e.kind === 'bush') {
      ctx.beginPath();
      for (let i = 0; i < 7; i++) { const bx = x + (i - 3) * 0.16 * s; ctx.moveTo(bx, y + 0.5 * s); ctx.quadraticCurveTo(bx + 0.1 * s, y + 0.1 * s, bx + (i - 3) * 0.08 * s, y - 0.2 * s); }
      ctx.stroke();
      tongue(ctx, x, y + 0.15 * s, 0.9 * s, a, 2.2);
    } else if (e.kind === 'tent') {
      ctx.beginPath(); ctx.moveTo(x - 0.9 * s, y + 0.5 * s); ctx.lineTo(x - 0.5 * s, y - 0.3 * s); ctx.lineTo(x + 0.5 * s, y - 0.3 * s); ctx.lineTo(x + 0.9 * s, y + 0.5 * s); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 0.15 * s, y + 0.5 * s); ctx.lineTo(x - 0.15 * s, y); ctx.lineTo(x + 0.15 * s, y); ctx.lineTo(x + 0.15 * s, y + 0.5 * s); ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.white, x, y + 0.2 * s, 0.4 * s, 0.6 * a);
    } else {
      ctx.beginPath();
      ctx.rect(x - 0.8 * s, y - 0.2 * s, 1.6 * s, 0.7 * s);
      ctx.moveTo(x - 0.95 * s, y - 0.2 * s); ctx.lineTo(x, y - 0.65 * s); ctx.lineTo(x + 0.95 * s, y - 0.2 * s);
      for (let i = 0; i < 5; i++) { const cx = x + (i - 2) * 0.36 * s; ctx.moveTo(cx, y - 0.15 * s); ctx.lineTo(cx, y + 0.5 * s); }
      ctx.stroke();
    }
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光：光丝（按手）、光柱
  function drawTransients(ctx, pass) {
    if (!FXL.length || !SP) return;
    for (const e of FXL) {
      if (e.t < 0) continue;
      const q = e.t / e.dur;
      if (e.type === 'vision') { if (pass === 'sky') drawVision(ctx, e); continue; }
      if (pass !== 'air') continue;
      ctx.globalCompositeOperation = 'lighter';
      if (e.type === 'thread') {
        const a = headOf(e.from, 0.7), b = headOf(e.to, 0.9), n = 7;
        for (let i = 0; i < n; i++) {
          const t = clamp(q * 1.25 - i * 0.05, 0, 1);
          if (t <= 0 || t >= 1) continue;
          const x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t) - Math.sin(Math.PI * t) * 16 * SU();
          ctx.globalAlpha = 0.8 * Math.sin(Math.PI * t) * (1 - i / n);
          ctx.drawImage(SP.pale, x - 6 * SU(), y - 6 * SU(), 12 * SU(), 12 * SU());
        }
        if (q > 0.78) glowAt(SP.gold, b[0], b[1], 12 * SU(), (1 - q) * 3 * 0.7);
      } else if (e.type === 'door') {
        // 门开的一闪：门框上一道亮
        const env = 1 - q, w = Math.max(1.2, 0.07 * PH(2));
        ctx.globalAlpha = Math.min(1, env);
        ctx.fillStyle = 'rgb(255,248,226)';
        ctx.fillRect(e.x - w / 2, e.y0, w, e.y1 - e.y0);
        glowAt(SP.white, e.x, (e.y0 + e.y1) / 2, (e.y1 - e.y0) * 0.6, 0.7 * env, 1.8);
      } else if (e.type === 'beam') {
        const env = Math.sin(Math.PI * Math.min(1, q)), x = e.xf * W.w, y = e.y || W.h * 0.8;
        beamLine(ctx, x, -10, x, y, e.w, 0.5 * env);
        glowAt(SP.white, x, y - 20 * SU(), e.w * 0.7, 0.4 * env);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW_UNDER = { city: drawCity, mount: drawMount, houses: drawHouses, room: drawRoom, lamps: drawLamps, goods: drawGoods, pool: drawPool, gate: drawGate, porch: drawPorch, prison: drawPrison, clothes: drawClothes };
  const ORDER = { city: 0, mount: 1, houses: 2, porch: 3, gate: 4, room: 5, prison: 6, pool: 7, lamps: 8, goods: 9, clothes: 10 };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x0 - b.x0);
    sortedN = P.size;
    return sorted;
  }
  const SCENE = {
    init() { sprites(); },
    resize() { layout(); RP = null; for (const p of P.values()) p.model = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; if (GL.length) GL.length = 0; tong = null; VT.clear(); return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (let i = GL.length - 1; i >= 0; i--) { GL[i].t += f; if (GL[i].t >= GL[i].dur) GL.splice(i, 1); }
      emitGlyphs(f);
      stepV(f);
      // 头的高低随姿势慢慢变（火焰跟着）
      for (const id of S.fire) { const q = fig(id); if (!q) continue; const t = HK[q.pose] != null ? HK[q.pose] : 1; const e = HS.has(id) ? HS.get(id) : t; HS.set(id, e + (t - e) * (1 - Math.exp(-3.5 * f))); }
      // 天上来的光慢慢移到新的地方
      const tb = beamTarget()[0];
      beamXs = beamXs == null || lv('pcHeaven') < 0.02 ? tb : beamXs + (tb - beamXs) * (1 - Math.exp(-1.6 * f));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      SP || sprites();
      if (pass === 'sky') { U.safe('pc.throne', () => drawThrone(ctx)); U.safe('pc.glory', () => drawGlory(ctx)); drawTransients(ctx, 'sky'); return; }
      if (pass === 'air') {
        const pr = liveP('prison') || getP('prison');
        if (pr && pr.a > 0.005) U.safe('pc.prisonFront', () => drawPrisonFront(ctx, pr));
        U.safe('pc.waders', () => drawWaders(ctx));
        U.safe('pc.heaven', () => drawHeaven(ctx));
        U.safe('pc.cloud', () => drawCloud(ctx));
        U.safe('pc.wind', () => drawWind(ctx));
        U.safe('pc.one', () => drawOne(ctx));
        U.safe('pc.pour', () => drawPour(ctx));
        U.safe('pc.fire', () => drawFire(ctx));
        U.safe('pc.glyphs', () => drawGlyphs(ctx));
        U.safe('pc.soul', () => drawSoul(ctx));
        U.safe('pc.angelFace', () => drawAngelFace(ctx));
        U.safe('pc.presence', () => drawPresence(ctx));
        U.safe('pc.angelLight', () => drawAngelLight(ctx));
        drawTransients(ctx, 'air');
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW_UNDER[p.kind];
        if (fn) U.safe('pc.' + p.kind, () => fn(ctx, p));
      }
      if (l < 2) U.safe('pc.reach', () => drawReach(ctx, l));
      U.safe('pc.footstool', () => drawFootstool(ctx, l));
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'seaFar') U.safe('pc.horizon', () => drawHorizon(ctx));
    },
    reset() { P.clear(); FXL.length = 0; GL.length = 0; tong = null; HS.clear(); VT.clear(); sortedN = -1; beamXs = null; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      snapV();
      sortedN = -1;
      FXL.length = 0; GL.length = 0; tong = null; HS.clear(); beamXs = null; flameFrom = null;
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.ta, r2(p.tk), r2(p.tk2), r2(p.tlit), r2(p.topen), r2(p.tgrow), p.label, p.style].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const ph = PH(2);
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || p.dying) continue;
        if (p.kind === 'city') consider(p.label, p.x * W.w, gY(1, p.x) - 26 * LS(1));
        else if (p.kind === 'mount') { const xf = summitX(); consider(p.label, xf * W.w, mountY(xf) - 0.2 * ph); }
        else if (p.kind === 'room') { const G = roomG(p); consider(p.label, G.cx, G.yt - 0.2 * ph); }
        else if (p.kind === 'prison') { const G = prisonG(p); consider(p.label, G.cx, G.yt - 0.3 * ph); }
        else if (p.kind === 'pool') { const G = poolG(p); consider(p.label, G.cx, (G.yb + G.yf) / 2); }
        else if (p.kind === 'gate') { const G = gateG(p); consider(p.label, G.x, G.g - G.gh * 0.6); }
        else if (p.kind === 'porch') consider(p.label, lerp(p.x0, Math.min(1, p.x1), 0.5) * W.w, gY(2, lerp(p.x0, Math.min(1, p.x1), 0.5)) - 2.4 * ph);
        else if (p.kind === 'goods' || p.kind === 'clothes') consider(p.label, p.x * W.w, vY(p.x, 0.08) - 0.2 * ph);
      }
      return best;
    },
  };

  // 本幕开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; GL.length = 0; tong = null; HS.clear(); VT.clear(); sorted = []; sortedN = -1; RP = null; beamXs = null; flameFrom = null;
    S = fresh();
  }

  // ════════════════════════════════════════════════════════════
  //  几处场景与站位
  // ════════════════════════════════════════════════════════════
  function olivet(show) { if (show) prop('mount', 'mount', { x: X.mount, label: '橄榄山' }); else unprop('mount'); }
  function street(show, o) {
    o = o || {};
    if (show) {
      prop('room', 'room', { x0: X.room0, x1: X.room1, lit: o.lit != null ? o.lit : 1, k: o.bread || 0, label: '楼房' });
      prop('houses', 'houses', { x0: X.house0, x1: X.house1 });
    } else { unprop('room'); unprop('houses'); }
  }
  function temple(show, o) {
    o = o || {};
    if (show) {
      prop('gate', 'gate', { x: X.gate, x1: X.porch0, style: 'temple', open: 1, label: '美门' });
      prop('porch', 'porch', { x0: X.porch0, x1: X.porch1, k2: o.council ? 1 : 0, label: o.council ? '公会' : '所罗门的廊' });
    } else { unprop('gate'); unprop('porch'); }
  }
  // 楼房里的座次：后排 v 0.02、前排 v 0.3
  const ROOM_D = { back: ['bro1', 'bro2', 'woman1', 'magdalene', 'matthew', 'jamesA', 'simonZ', 'judasJ', 'bartholomew'], front: ['thomas', 'james', 'john', 'mary', 'peter', 'andrew', 'matthias', 'philip'] };
  const ROOM_P = { back: ['thomas', 'philip', 'magdalene', 'matthew', 'jamesA', 'simonZ', 'judasJ', 'bartholomew'], front: ['james', 'john', 'mary', 'peter', 'andrew', 'matthias'] };
  const roomSet = () => (PORT ? ROOM_P : ROOM_D);
  const roomIds = () => { const r = roomSet(); return r.back.concat(r.front); };
  const roomApostles = () => roomIds().filter(id => DLOOK[id]);
  function roomSlot(id) {
    const r = roomSet(), G = roomG({ x0: X.room0, x1: X.room1 });
    let i = r.front.indexOf(id), v = 0.3, n = r.front.length;
    if (i < 0) { i = r.back.indexOf(id); v = 0.02; n = r.back.length; }
    if (i < 0) return null;
    const pad = v > 0.1 ? 0.05 * G.ph : 0.3 * G.ph;
    const x = lerp(G.bx0 + pad, G.bx1 - pad, (i + 0.5) / n) / W.w;
    return { x, v, face: x < G.c ? 1 : -1 };
  }
  // 楼房里的人（ids 为空则全部）：pose 可为函数
  function intoRoom(ids, o) {
    o = o || {};
    for (const id of ids || roomIds()) {
      const s = roomSlot(id);
      if (!s) continue;
      const ps = typeof o.pose === 'function' ? o.pose(id) : (o.pose || 'stand');
      put(id, { x: s.x, v: s.v, facing: s.face, pose: ps, glow: o.glow });
      face(id, s.face);
    }
  }
  // 楼房里安静祷告的样子（跪、坐、举手）
  const PRAY = id => (id === 'mary' || id === 'peter' || id === 'john' ? 'pray' : id === 'magdalene' || id === 'woman1' || id === 'james' ? 'kneel' : hsh(id.length * 3.1 + id.charCodeAt(0)) < 0.5 ? 'pray' : 'sit');
  // 山上的站位（u = 山的半宽的比例）
  const MOUNT_U = [-0.72, -0.6, -0.48, -0.36, -0.24, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8];
  const MOUNT_NEAR = [-0.54, -0.45, -0.36, -0.27, -0.18, 0.14, 0.23, 0.32, 0.41, 0.5, 0.59];
  const mountCrew = () => (PORT ? ['judasJ', 'simonZ', 'thomas', 'james', 'peter', 'john', 'andrew', 'philip', 'matthew'] : ['judasJ', 'simonZ', 'jamesA', 'thomas', 'james', 'peter', 'john', 'andrew', 'philip', 'bartholomew', 'matthew']);
  function crewU(i, n, near) {
    const U0 = near ? MOUNT_NEAR : MOUNT_U;
    if (n === U0.length) return U0[i];
    const half = Math.ceil(n / 2);
    return i < half ? lerp(near ? -0.56 : -0.74, near ? -0.2 : -0.26, i / Math.max(1, half - 1)) : lerp(near ? 0.16 : 0.22, near ? 0.58 : 0.8, (i - half) / Math.max(1, n - half - 1));
  }
  // 公会的座次：长老坐在廊下，当中是大祭司；被问的人站在前面
  function councilX(k) {
    const c = X.council;
    if (k === 'hp') return c + (PORT ? 0.04 : 0.025);
    if (k === 'c') return c;
    return c;
  }
  function council(show) {
    if (!show) { crm('eldA'); crm('eldB'); rm('hp'); return; }
    const x0 = X.porch0 + (PORT ? 0.02 : 0.012), x1 = Math.min(0.99, X.porch1), c = councilX('c'), gap = PORT ? 0.06 : 0.035;
    crowd('eldA', { n: PORT ? 2 : 4, x0, x1: c - gap, layer: 2, label: '公会的人', robe: [86, 72, 94], pose: 'seat', glow: 0.1, v: 0, face: 1 });
    crowd('eldB', { n: PORT ? 2 : 4, x0: c + gap + 0.02, x1, layer: 2, label: '公会的人', robe: [104, 82, 64], pose: 'seat', glow: 0.1, v: 0, face: -1 });
    add('hp', { label: '大祭司', sex: 'm', age: 'elder', x: councilX('hp'), facing: -1, robe: [84, 92, 150], accent: [222, 190, 110], hair: 'cloth', prop: null, pose: 'seat', glow: 0.12, layer: 2 });
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：复活之后四十天，橄榄山上的早晨
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    W.set('bare', 0.1, true); W.set('bloom', 0.5, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.8, herbs: 0.6, trees: 0.3, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('herbs', W.w * 0.58, W.ridgeBaseY(2, W.w * 0.58));
    W.setOrigin('trees', W.w * 0.44, W.ridgeBaseY(2, W.w * 0.44));
    W.goTo(tod(0.34, 0.3), 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 60, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    prop('city', 'city', { x: X.cityT, x0: X.city0, x1: X.city1, layer: 1, lit: 0.3, label: '耶路撒冷' });
    olivet(true);
    const c = C();
    c.clear({ fade: false });
    jesus({ x: summitX(), facing: -1, from: 'none' });
    onMount('jesus');
    const crew = mountCrew();
    crew.forEach((id, i) => {
      const u = crewU(i, crew.length, false);
      put(id, { x: mountAt(u), facing: u < 0 ? 1 : -1, pose: 'stand', from: 'none' });
      onMount(id);
    });
    W.beastAvoid = [[0.35, 1]];
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const REGIONS = [
    ['耶路撒冷', () => (PORT ? [0.8, 0.63] : [X.cityT, 0.6])],
    ['犹太全地', () => (PORT ? [0.55, 0.56] : [0.57, 0.625])],
    ['撒马利亚', () => (PORT ? [0.36, 0.49] : [0.39, 0.5])],
    ['直到地极', () => (PORT ? [0.24, 0.42] : [0.15, 0.535])],
  ];
  function regionName(b, i) {
    const r = REGIONS[i], q = r[1]();
    nameAt(b, r[0], q[0] * W.w, q[1] * W.h, { size: 0.046 * M(), hold: 3.2, src: () => [summitX() * W.w + (Math.random() - 0.5) * 30, mountY(summitX()) - PH(2) * (0.6 + Math.random() * 0.6)] });
  }

  const STAGES = [
    // ── 1 · 1:8 但圣灵降临在你们身上，你们就必得着能力 ─────────────
    {
      kind: 'promise', utter: '但圣灵降临在你们身上，你们就必得着能力', cmd: 'await 圣灵 && witness --to 耶路撒冷,犹太,撒马利亚,地极', ref: '1:8',
      verse: [
        { text: '他们聚集的时候，问耶稣说：「主啊，你复兴以色列国就在这时候吗？」<br>耶稣对他们说：「父凭着自己的权柄所定的时候、日期，不是你们可以知道的。', ref: '使徒行传 1:6–7', hold: 8.5 },
        { text: '但圣灵降临在你们身上，你们就必得着能力，<br>并要在耶路撒冷、犹太全地，和撒马利亚，直到地极，作我的见证。」', ref: '使徒行传 1:8', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(tod(0.36, 0.315), 14, b.instant);
            const crew = mountCrew();
            crew.forEach((id, i) => { walk(id, mountAt(crewU(i, crew.length, true)), { speed: 0.012, pose: 'stand' }); face(id, 'jesus'); });
          }],
          [2.4, () => { pose('peter', 'point'); face('peter', 'jesus'); pose('john', 'gaze'); }],
          [5.4, () => { pose('peter', 'stand'); pose('jesus', 'point'); face('jesus', 1); }],
          [9.8, b => {
            pose('jesus', 'raise'); glow('jesus', 0.78); face('jesus', -1);
            W.set('pcReach', 1, b.instant); W.set('pcReachA', 1, b.instant);
            ringOn(b, 'jesus', 0.32, [255, 236, 190]);
            sfx(b, 'harp');
          }],
          [10.6, b => { regionName(b, 0); sfx(b, 'bell', { soft: true }); }],
          [12.8, b => regionName(b, 1)],
          [15, b => regionName(b, 2)],
          [17.2, b => regionName(b, 3)],
          [19.6, b => {
            W.set('pcReachA', 0.35, b.instant);
            pose('jesus', 'stand'); glow('jesus', 0.6);
            for (const id of mountCrew()) { pose(id, 'stand'); face(id, 'jesus'); }
          }],
        ]);
      },
    },

    // ── 2 · 1:9 他就被取上升，有一朵云彩把他接去 ─────────────────
    {
      kind: 'act', utter: '他就被取上升，有一朵云彩把他接去', cmd: 'ascend --into 云彩  # 他还要怎样来', ref: '1:9',
      verse: [
        { text: '说了这话，他们正看的时候，他就被取上升，<br>有一朵云彩把他接去，便看不见他了。', ref: '使徒行传 1:9', hold: 7 },
        { text: '当他往上去，他们定睛望天的时候，忽然有两个人身穿白衣，站在旁边，说：<br>「加利利人哪，你们为什么站着望天呢？……他还要怎样来。」', ref: '使徒行传 1:10–11', hold: 8 },
        { text: '当下，门徒从那里回耶路撒冷去，进了城，就上了所住的一间楼房；……<br>都同心合意地恒切祷告。', ref: '使徒行传 1:12–14', hold: 6.5 },
      ],
      apply(c) {
        const crew = mountCrew();
        T(c, [
          [0, b => {
            W.goTo(tod(0.42, 0.33), 22, b.instant);
            for (const id of crew) { pose(id, 'gaze'); face(id, 'jesus'); }
            S.beam = summitX(); S.beamG = false;
            W.set('pcHeaven', 0.75, b.instant);
            W.set('pcReachA', 0, b.instant);
          }],
          [0.3, b => { W.set('pcCloud', 1, b.instant); W.set('pcCloudY', 1, b.instant); }],
          [0.9, b => { pose('jesus', 'raise'); glow('jesus', 0.95); sfx(b, 'angel'); }],
          // 他被取上升
          [2.2, b => {
            const f = fig('jesus');
            if (f && !b.instant) f.ny = (mountY(f.nx) + 1) / W.h;
            attach('jesus', null);
            const yT = (PORT ? W.h * 0.455 : W.h * 0.335) / W.h;
            fly('jesus', summitX(), yT, { dur: 6, pose: 'raise' });
            sfx(b, 'harp', { soft: true });
          }],
          // 云彩把他接去，便看不见他了
          [8, b => {
            flashW(b, 0.22);
            vanish('jesus');
            W.set('pcCloudY', 0, b.instant); W.set('pcCloud', 0, b.instant);
            W.set('pcHeaven', 0.3, b.instant);
          }],
          // 两个人身穿白衣，站在旁边
          [9.6, b => {
            add('angelA', { label: '身穿白衣的人', sex: 'm', age: 'adult', x: mountAt(PORT ? -0.1 : -0.08), facing: -1, angel: true, robe: [252, 252, 246], glow: 1, from: b.instant ? 'none' : 'light', layer: 2 });
            add('angelB', { label: '身穿白衣的人', sex: 'm', age: 'adult', x: mountAt(PORT ? 0.07 : 0.05), facing: 1, angel: true, robe: [252, 252, 246], glow: 1, from: b.instant ? 'none' : 'light', layer: 2 });
            onMount('angelA'); onMount('angelB');
            sfx(b, 'angel', { soft: true });
          }],
          [12.4, () => { pose('angelA', 'point'); pose('angelB', 'point'); }],
          [15.4, () => {
            pose('angelA', 'stand'); pose('angelB', 'stand');
            crew.forEach((id, i) => { pose(id, 'stand'); face(id, i < crew.length / 2 ? -1 : 1); });
          }],
          // 门徒回耶路撒冷去
          [17.6, b => {
            rm('angelA'); rm('angelB');
            W.set('pcHeaven', 0, b.instant);
            crew.forEach((id, i) => walk(id, 1.06 + i * 0.012, { speed: 0.032 + 0.002 * (i % 3) }));
          }],
          [22.8, () => { for (const id of crew) rm(id); }],
        ]);
      },
    },

    // ── 3 · 2:2 从天上有响声下来，好像一阵大风吹过 ────────────────
    {
      kind: 'act', utter: '从天上有响声下来，好像一阵大风吹过', cmd: 'wind --from 天上 --fill 屋子', ref: '2:2',
      verse: [
        { text: '五旬节到了，门徒都聚集在一处。', ref: '使徒行传 2:1', hold: 5 },
        { text: '忽然，从天上有响声下来，好像一阵大风吹过，<br>充满了他们所坐的屋子，', ref: '使徒行传 2:2', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            S.scene = 'room';
            for (const id of ['jesus', 'angelA', 'angelB'].concat(ELEVEN)) rm(id, true);
            olivet(false);
            street(true, { lit: 1 });
            W.goTo(tod(0.36, 0.325), 6.5, b.instant);
            W.set('pcReachA', 0, b.instant); W.set('pcHeaven', 0, b.instant);
            intoRoom(null, { pose: PRAY, glow: 0.26 });
          }],
          // 大风
          [6.3, b => {
            W.set('gale', 0.95, b.instant); W.set('pcWind', 1, b.instant);
            sfx(b, 'wind'); sfx(b, 'whirlwind', { soft: true });
          }],
          [7.4, () => { for (const id of ['peter', 'john', 'james', 'andrew', 'thomas', 'matthias', 'philip']) pose(id, 'gaze'); }],
          [8.4, b => { W.set('pcRoom', 0.9, b.instant); flashW(b, 0.18); }],
          [11.8, b => { W.set('gale', 0.6, b.instant); W.set('pcWind', 0.55, b.instant); }],
        ]);
      },
    },

    // ── 4 · 2:3 又有舌头如火焰显现出来 ──────────────────────────
    {
      kind: 'act', utter: '又有舌头如火焰显现出来', cmd: 'split 火焰 --onto 各人头上', ref: '2:3',
      verse: [
        { text: '又有舌头如火焰显现出来，<br>分开落在他们各人头上。', ref: '使徒行传 2:3', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            if (!b.instant) flameFrom = [W.spirit.x, W.spirit.y];
            W.set('pcFlame', 1, b.instant); W.set('pcRoom', 0.45, b.instant);
            sfx(b, 'fire');
          }],
          [1.8, b => {
            S.fire = roomIds().slice();
            W.set('pcDivide', 1, b.instant);
            sfx(b, 'fire', { soft: true });
          }],
          [4.4, b => {
            W.set('pcFire', 1, b.instant); W.set('pcFlame', 0, b.instant);
            for (const id of roomIds()) glow(id, 0.55);
            W.set('gale', 0.3, b.instant); W.set('pcWind', 0.12, b.instant);
            sfx(b, 'harp');
            if (!b.instant) { const G = roomG({ x0: X.room0, x1: X.room1 }); ringAt(b, G.cx, lerp(G.yc, G.gb, 0.5), 0.3, [255, 214, 150], 2.6); }
          }],
        ]);
      },
    },

    // ── 5 · 2:4 他们就都被圣灵充满 ──────────────────────────────
    {
      kind: 'act', utter: '他们就都被圣灵充满', cmd: 'i18n --every-tongue  # 讲说神的大作为', ref: '2:4',
      verse: [
        { text: '他们就都被圣灵充满，<br>按着圣灵所赐的口才说起别国的话来。', ref: '使徒行传 2:4', hold: 6 },
        { text: '那时，有虔诚的犹太人从天下各国来，住在耶路撒冷。<br>这声音一响，众人都来聚集，各人听见门徒用众人的乡谈说话，就甚纳闷；', ref: '使徒行传 2:5–6', hold: 8.5 },
        { text: '我们帕提亚人、米底亚人、以拦人，和住在美索不达米亚、犹太……<br>克里特和阿拉伯人，都听见他们用我们的乡谈，讲说神的大作为。」', ref: '使徒行传 2:9–11', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            for (const id of roomIds()) { pose(id, 'raise'); glow(id, 0.62); }
            W.set('gale', 0.1, b.instant); W.set('pcWind', 0, b.instant); W.set('pcRoom', 0.5, b.instant);
            sfx(b, 'sing');
          }],
          [1.2, b => { W.set('pcTongues', 1, b.instant); if (!b.instant) tong = 'out'; }],
          // 这声音一响，天下各国的人来聚集（话语只飞向已经来到的人）
          [2.6, b => {
            nationLayout().forEach((q, i) => {
              const n = nationOf(q[0]);
              crowd(q[0], { n: q[4], x0: 1.02 + i * 0.02, x1: 1.1 + i * 0.02, layer: 2, label: n.label, robe: n.robe, pose: 'stand', glow: 0.1, v: q[3] });
              cwalk(q[0], q[1], q[2], { speed: 0.04 + 0.004 * i });
            });
            sfx(b, 'crowd');
          }],
          [13.5, () => { for (const q of nationLayout()) { cpose(q[0], 'gaze'); cface(q[0], -1); } }],
          // 众人的乡谈一齐升起，汇成一团光
          [17.1, b => { if (!b.instant) tong = 'up'; }],
          [20.6, b => {
            W.set('pcOne', 1, b.instant);
            if (!b.instant) { const o = onePoint(); ringAt(b, o[0], o[1], 0.35, [255, 236, 190], 2.8); fx().sparkle(o[0], o[1], 40, [255, 240, 204], 22 * SU(), 'top'); }
            sfx(b, 'bell');
          }],
          [23.4, b => { W.set('pcTongues', 0, b.instant); tong = null; for (const id of roomIds()) pose(id, 'stand'); }],
        ]);
      },
    },

    // ── 6 · 2:17 我要将我的灵浇灌凡有血气的 ───────────────────────
    {
      kind: 'promise', utter: '我要将我的灵浇灌凡有血气的', cmd: 'pour 灵 --to 凡有血气的  # 儿女、少年人、老年人', ref: '2:17',
      verse: [
        { text: '众人就都惊讶猜疑，彼此说：「这是什么意思呢？」<br>还有人讥诮说：「他们无非是新酒灌满了。」', ref: '使徒行传 2:12–13', hold: 7 },
        { text: '彼得和十一个使徒站起，高声说：「犹太人和一切住在耶路撒冷的人哪，<br>这件事你们当知道，也当侧耳听我的话。', ref: '使徒行传 2:14', hold: 7 },
        { text: '这正是先知约珥所说的：神说：在末后的日子，我要将我的灵浇灌凡有血气的。<br>你们的儿女要说预言；你们的少年人要见异象；老年人要做异梦。', ref: '使徒行传 2:16–17', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('pcFire', 0.3, b.instant);
            for (const q of nationLayout()) cpose(q[0], 'stand');
            sfx(b, 'crowd', { soft: true });
          }],
          [3.4, () => { const g = PORT ? 'nEgypt' : 'nRome'; cpose(g, 'point'); cface(g, -1); }],
          [7.2, () => { cpose(PORT ? 'nEgypt' : 'nRome', 'stand'); }],
          // 彼得站起，高声说
          [8.3, b => {
            for (const id of roomApostles()) { pose(id, 'stand'); face(id, 1); }
            walk('peter', X.preach, { speed: 0.03, pose: 'point' });
            glow('peter', 0.75);
          }],
          [11, () => { pose('peter', 'point'); face('peter', 1); }],
          // 神说：我要将我的灵浇灌凡有血气的
          [16.6, b => {
            W.set('pcPour', 1, b.instant);
            for (const q of nationLayout()) { cglow(q[0], 0.34); cpose(q[0], 'gaze'); }
            pose('peter', 'raise');
            sfx(b, 'harp');
            if (!b.instant) for (const q of nationLayout()) { const x = (q[1] + q[2]) / 2 * W.w; fx().sparkle(x, vY((q[1] + q[2]) / 2, q[3]) - PH(2), 14, [255, 236, 190], 30 * SU(), 'top'); }
          }],
          [22.6, b => { W.set('pcPour', 0.3, b.instant); pose('peter', 'point'); }],
        ]);
      },
    },

    // ── 7 · 2:21 凡求告主名的，就必得救 ─────────────────────────
    {
      kind: 'promise', utter: '凡求告主名的，就必得救', cmd: 'baptize --in 耶稣基督的名 --count 3000', ref: '2:21',
      verse: [
        { text: '到那时候，凡求告主名的，就必得救。', ref: '使徒行传 2:21', hold: 4.5 },
        { text: '众人听见这话，觉得扎心……<br>彼得说：「你们各人要悔改，奉耶稣基督的名受洗，叫你们的罪得赦，就必领受所赐的圣灵；', ref: '使徒行传 2:37–38', hold: 8 },
        { text: '于是领受他话的人就受了洗。那一天，门徒约添了三千人，', ref: '使徒行传 2:41', hold: 6 },
      ],
      apply(c) {
        const nW = PORT ? 4 : 5;
        T(c, [
          [0, b => {
            pose('peter', 'raise'); W.set('pcPour', 0.12, b.instant); ringOn(b, 'peter', 0.25, [255, 236, 190]);
            W.set('pcReach', 0, true);   // 见证之光此刻看不见（pcReachA 为 0）：把前沿收回，好在后面再走一次
          }],
          // 众人扎心
          [5.8, b => { for (const q of nationLayout()) cpose(q[0], 'worship'); sfx(b, 'weep', { soft: true }); }],
          [9.2, () => { pose('peter', 'point'); }],
          // 水池：受洗
          [13.6, b => {
            S.scene = 'pool';
            unprop('room');
            prop('pool', 'pool', { x0: X.pool0, x1: X.pool1, label: '水池' });
            W.set('pcFire', 0, b.instant); W.set('pcOne', 0, b.instant); W.set('pcRoom', 0, b.instant); W.set('pcPour', 0, b.instant);
            S.fire = [];
            for (const id of ['mary', 'magdalene', 'woman1', 'bro1', 'bro2']) rm(id);
            for (const q of nationLayout()) cpose(q[0], 'stand');
            pose('peter', 'point');
            // 楼房淡去时，使徒走下来，站到水池的后边
            const aps = roomApostles().filter(id => id !== 'peter');
            aps.forEach((id, i) => {
              walk(id, lerp(X.pool0 + 0.035, X.pool1 - 0.045, (i + 0.5) / aps.length), { speed: 0.03, pose: 'stand' });
              vTo(id, PORT ? (i % 2 ? 0.2 : 0.31) : (i % 2 ? 0.24 : 0.29), b);
            });
          }],
          [15.1, b => {
            W.set('pcLights', 0.45, b.instant);
            // 三千人：满城亮起来，池的两边站满了领受他话的人
            W.set('pcReach', 0.55, b.instant); W.set('pcReachA', 0.9, b.instant);
            for (const q of manyLayout()) {
              crowd(q[0], { n: q[5], x0: q[1], x1: q[1] + 0.05, layer: 2, label: '领受他话的人', pose: 'stand', glow: 0.14, v: q[4] });
              cwalk(q[0], q[2], q[3], { speed: 0.045, pose: 'gaze' });
            }
            sfx(b, 'bell');
            if (!b.instant && fx()) for (let i = 0; i < 7; i++) { const xf = lerp(X.city0, X.city1, (i + 0.5) / 7); fx().sparkle(xf * W.w, gY(1, xf) - 8 * LS(1), 8, [255, 226, 160], 18 * SU(), 'top'); }
          }],
        ].concat(Array.from({ length: nW }, (_, i) => {
          const t0 = 15.4 + 1.1 * i, id = 'bp' + i, n = NATIONS[i % NATIONS.length];
          const G0 = X.pool0 + 0.06, G1 = X.pool1 - 0.05;
          const wx = lerp(G0, G1, i / Math.max(1, nW - 1));
          return [
            [t0, b => {
              add(id, { label: '受洗的人', sex: i % 2 ? 'f' : 'm', age: 'adult', x: X.pool1 + 0.015, facing: -1, robe: n.robe, glow: 0.12, v: POOL_V, layer: 2 });
              const f = fig(id); if (f) f.v = POOL_V;
              walk(id, wx, { speed: 0.05, pose: 'stand' });
            }],
            [t0 + 2.1, b => {
              pose(id, 'kneel');
              if (!b.instant && fx()) { const h = headOf(id, 0.4); fx().sparkle(h[0], h[1], 18, [226, 240, 255], 12 * SU(), 'top'); }
              sfx(b, 'splash', { soft: true });
            }],
            [t0 + 3, b => { pose(id, 'raise'); glow(id, 0.55); ringOn(b, id, 0.1, [255, 244, 220]); }],
            [t0 + 4.3, () => { walk(id, X.pool1 + 0.03, { speed: 0.045 }); }],
            [t0 + 6, () => { rm(id); }],
          ];
        }).flat()).concat([
          [19.5, () => { for (const q of nationLayout().concat(manyLayout())) { cpose(q[0], 'raise'); cglow(q[0], 0.4); } }],
        ]));
      },
    },

    // ── 8 · 2:47 主将得救的人天天加给他们 ──────────────────────
    {
      kind: 'act', utter: '主将得救的人天天加给他们', cmd: 'while (天天) 教会.add(得救的人)', ref: '2:47',
      verse: [
        { text: '都恒心遵守使徒的教训，彼此交接，擘饼，祈祷。', ref: '使徒行传 2:42', hold: 6 },
        { text: '信的人都在一处，凡物公用，<br>并且卖了田产、家业，照各人所需用的分给各人。', ref: '使徒行传 2:44–45', hold: 7 },
        { text: '他们天天同心合意恒切地在殿里，且在家中擘饼，存着欢喜、诚实的心用饭，<br>赞美神，得众民的喜爱。主将得救的人天天加给他们。', ref: '使徒行传 2:46–47', hold: 8.5 },
      ],
      apply(c) {
        const nG = PORT ? 2 : 3;
        const bel = () => (PORT ? [['bel1', X.crowd0, X.crowd1, 0.06, 2], ['bel2', X.crowd0 + 0.01, X.crowd1, 0.3, 2]] : [['bel1', X.crowd0, 0.87, 0.06, 4], ['bel2', 0.88, X.crowd1, 0.08, 3], ['bel3', X.crowd0 + 0.01, X.crowd1 - 0.01, 0.3, 4]]);
        T(c, [
          [0, b => {
            S.scene = 'room';
            W.goTo(0.79, 6, b.instant);
            unprop('pool');
            street(true, { lit: 1, bread: 1 });
            for (const q of nationLayout().concat(manyLayout())) crm(q[0]);
            for (let i = 0; i < 5; i++) rm('bp' + i, true);
            W.set('pcReachA', 0, b.instant);
            W.set('pcRoom', 0.25, b.instant);
            prop('lamps', 'lamps', { lit: 1 });
            prop('goods', 'goods', { x: X.goods, k: 0, label: '凡物公用' });
          }],
          [1.2, b => {
            intoRoom(null, { pose: 'sit', glow: 0.4 });
            bel().forEach(q => { crowd(q[0], { n: q[4], x0: q[1], x1: q[2], layer: 2, label: '信的人', pose: 'sit', glow: 0.26, v: q[3], mill: false }); });
          }],
          [3, b => {
            if (!b.instant && fx()) { const G = roomG({ x0: X.room0, x1: X.room1 }); fx().sparkle(G.cx, lerp(G.gb, G.gf, 0.3), 24, [255, 226, 170], 30 * SU(), 'top'); }
            sfx(b, 'harp', { soft: true });
          }],
        ].concat(Array.from({ length: nG }, (_, i) => {
          const id = 'giver' + i, t0 = 7.4 + 1.5 * i, gx = X.goods + (i - 1) * 0.012;
          return [
            [t0, () => {
              add(id, { label: '信的人', sex: i === 1 ? 'f' : 'm', age: 'adult', x: X.crowd1 + 0.03, facing: -1, robe: [[140, 116, 90], [120, 104, 140], [104, 120, 96]][i % 3], prop: 'bundle', glow: 0.24, v: 0.12, layer: 2 });
              const f = fig(id); if (f) f.v = 0.12;
              walk(id, gx, { speed: 0.05, pose: 'bow' });
            }],
            [t0 + 4.2, () => { hold(id, null); prop('goods', null, { k: (i + 1) / nG }); pose(id, 'stand'); }],
            [t0 + 5.2, () => { walk(id, X.crowd1 + 0.04, { speed: 0.05 }); }],
            [t0 + 7.4, () => { rm(id); }],
          ];
        }).flat()).concat([
          // 日子一天天过去：早晨、晚上；人一群群加添
          [15.6, b => { W.goTo(0.3, 4.2, b.instant); W.set('pcLights', 0.75, b.instant); for (const id of roomIds()) pose(id, 'stand'); }],
          [17.2, b => {
            crowd('bel4', { n: PORT ? 2 : 4, x0: 1.03, x1: 1.1, layer: 2, label: '信的人', pose: 'stand', glow: 0.26, v: 0.18 });
            cwalk('bel4', X.crowd0 + 0.02, X.crowd1 - 0.02, { speed: 0.045, pose: 'raise' });
            sfx(b, 'crowd', { soft: true });
          }],
          [20.2, b => { W.goTo(0.78, 4.2, b.instant); for (const id of roomIds()) pose(id, 'sit'); }],
          [21.6, b => {
            crowd('bel5', { n: PORT ? 1 : 3, x0: 1.03, x1: 1.1, layer: 2, label: '信的人', pose: 'stand', glow: 0.26, v: 0.36 });
            cwalk('bel5', X.crowd0 + 0.03, X.crowd1 - 0.03, { speed: 0.05, pose: 'sit' });
            W.set('pcLights', 0.85, b.instant);
          }],
        ]));
      },
    },

    // ── 9 · 3:7 他的脚和踝子骨立刻健壮了 ────────────────────────
    {
      kind: 'act', utter: '他的脚和踝子骨立刻健壮了', cmd: 'stand && walk && leap  # 美门', ref: '3:7',
      verse: [
        { text: '申初祷告的时候，彼得、约翰上圣殿去。有一个人，生来是瘸腿的，<br>天天被人抬来，放在殿的一个门口（那门名叫美门），要求进殿的人周济。', ref: '使徒行传 3:1–2', hold: 8.5 },
        { text: '彼得说：「金银我都没有，只把我所有的给你：<br>我奉拿撒勒人耶稣基督的名，叫你起来行走！」', ref: '使徒行传 3:6', hold: 6.5 },
        { text: '于是拉着他的右手，扶他起来；他的脚和踝子骨立刻健壮了，<br>就跳起来，站着，又行走，同他们进了殿，走着，跳着，赞美神。', ref: '使徒行传 3:7–8', hold: 8 },
      ],
      apply(c) {
        const lx = () => X.lame;
        T(c, [
          [0, b => {
            S.scene = 'temple';
            W.goTo(tod(0.6, 0.68), 7, b.instant);
            street(false); unprop('lamps'); unprop('goods');
            for (const g of ['bel1', 'bel2', 'bel3', 'bel4', 'bel5']) crm(g);
            for (const id of roomIds()) if (id !== 'peter' && id !== 'john') rm(id);
            for (let i = 0; i < 3; i++) rm('giver' + i, true);
            W.set('pcRoom', 0, b.instant);
            temple(true);
            crowd('wor', { n: PORT ? 3 : 5, x0: X.porch0 + 0.04, x1: Math.min(PORT ? 0.985 : 0.955, X.porch1), layer: 2, label: '进殿的人', pose: 'pray', glow: 0.1, v: 0.03 });
            add('lame', { label: '生来瘸腿的人', sex: 'm', age: 'adult', x: lx(), facing: -1, robe: [118, 104, 88], accent: [92, 80, 66], pose: 'sit', glow: 0.1, layer: 2 });
            put('peter', { x: X.pe - X.walkIn, v: 0, pose: 'stand', facing: 1 });
            put('john', { x: X.jo - X.walkIn, v: 0, pose: 'stand', facing: 1 });
          }],
          [1.2, () => { walk('peter', X.pe, { speed: 0.022 }); walk('john', X.jo, { speed: 0.022 }); }],
          [6.6, () => { face('lame', -1); }],
          // 金银我都没有
          [9.8, () => { pose('peter', 'point'); face('peter', 1); face('john', 1); }],
          [13.2, () => { face('lame', -1); glow('lame', 0.2); }],
          // 拉着他的右手，扶他起来
          [17.6, () => { walk('peter', lx() - 0.018 * (PORT ? 1.8 : 1), { speed: 0.02, pose: 'carry' }); }],
          [18.9, b => {
            pose('lame', 'stand'); glow('lame', 0.6);
            if (!b.instant && fx()) { const h = headOf('lame', 0); fx().ring(h[0], h[1] - 4, [255, 240, 204], M() * 0.18, 2, 2); fx().sparkle(h[0], h[1] - 6, 30, [255, 240, 210], 14 * SU(), 'top'); }
            sfx(b, 'harp');
          }],
          // 跳起来
          [19.9, b => { const g = gY(2, lx() + 0.006); fly('lame', lx() + 0.006, (g - 0.45 * PH(2)) / W.h, { dur: 0.42 }); }],
          [20.35, () => { fly('lame', lx() + 0.012, null, { dur: 0.4, pose: 'stand' }); }],
          [21, b => { const g = gY(2, lx() + 0.02); fly('lame', lx() + 0.02, (g - 0.5 * PH(2)) / W.h, { dur: 0.42 }); sfx(b, 'laugh', { soft: true }); }],
          [21.45, () => { fly('lame', lx() + 0.028, null, { dur: 0.4, pose: 'stand' }); }],
          // 同他们进了殿，赞美神
          [22.2, () => {
            pose('peter', 'stand');
            walk('lame', X.inside, { speed: 0.045, pose: 'raise' });
            walk('peter', X.inside - (PORT ? 0.07 : 0.035), { speed: 0.03 });
            walk('john', X.inside - (PORT ? 0.12 : 0.058), { speed: 0.03 });
          }],
          [24.2, b => { cpose('wor', 'gaze'); cface('wor', -1); sfx(b, 'bell', { soft: true }); }],
        ]);
      },
    },

    // ── 10 · 4:12 除他以外，别无拯救 ────────────────────────────
    {
      kind: 'act', utter: '除他以外，别无拯救', cmd: 'resolve 名 --only 耶稣  # 天下人间', ref: '4:12',
      verse: [
        { text: '使徒对百姓说话的时候，祭司们和守殿官，并撒都该人忽然来了……<br>于是下手拿住他们；因为天已经晚了，就把他们押到第二天。', ref: '使徒行传 4:1–3', hold: 8 },
        { text: '第二天，官府、长老，和文士在耶路撒冷聚会……叫使徒站在当中，<br>就问他们说：「你们用什么能力，奉谁的名做这事呢？」', ref: '使徒行传 4:5–7', hold: 7.5 },
        { text: '那时彼得被圣灵充满，对他们说：……「除他以外，别无拯救；<br>因为在天下人间，没有赐下别的名，我们可以靠着得救。」', ref: '使徒行传 4:8–12', hold: 8 },
      ],
      apply(c) {
        const cx = () => councilX('c'), dd = PORT ? 0.07 : 0.03;
        T(c, [
          [0, b => { W.goTo(tod(0.74, 0.75), 7, b.instant); pose('peter', 'raise'); face('peter', 1); pose('lame', 'stand'); }],
          [2, () => {
            add('guardC', { label: '守殿官', sex: 'm', age: 'adult', x: 1.05, facing: -1, robe: [118, 72, 58], accent: [176, 150, 104], prop: 'torch', glow: 0.12, layer: 2, v: 0.02 });
            add('guard1', { label: '守殿官', sex: 'm', age: 'adult', x: 1.08, facing: -1, robe: [104, 68, 56], accent: [176, 150, 104], prop: 'spear', glow: 0.1, layer: 2, v: 0.04 });
            walk('guardC', X.inside + 0.03, { speed: 0.055 }); walk('guard1', X.inside + (PORT ? 0.1 : 0.05), { speed: 0.055 });
          }],
          // 下手拿住他们
          [5.8, b => {
            pose('peter', 'stand');
            for (const id of ['peter', 'john', 'lame']) walk(id, 1.07, { speed: 0.03 });
            walk('guardC', 1.1, { speed: 0.03 }); walk('guard1', 1.12, { speed: 0.03 });
            crm('wor');
            sfx(b, 'march', { soft: true });
          }],
          [8, b => { W.goTo(tod(0.36, 0.325), 8, b.instant); for (const id of ['peter', 'john', 'lame', 'guardC', 'guard1']) rm(id); }],
          // 第二天：公会
          [9.3, b => {
            S.scene = 'council';
            prop('porch', null, { k2: 1, label: '公会' });
            council(true);
          }],
          [11.4, () => {
            put('peter', { x: 1.04, v: 0.34, pose: 'stand', facing: -1 });
            put('john', { x: 1.07, v: 0.34, pose: 'stand', facing: -1 });
            put('lame', { x: 1.1, v: 0.34, pose: 'stand', facing: -1 });
            walk('peter', cx() - dd * 0.2, { speed: 0.035 }); walk('john', cx() - dd * 1.4, { speed: 0.035 }); walk('lame', cx() + dd, { speed: 0.035 });
          }],
          // 彼得被圣灵充满：一阵轻风，一道光自天上落在他身上（火焰只在五旬节那一日）
          [18.1, b => {
            S.beam = cx() - dd * 0.2; S.beamV = 0.34; S.beamG = false;
            W.set('pcHeaven', 1, b.instant);
            W.set('gale', 0.32, b.instant);
            glow('peter', 0.85); pose('peter', 'raise'); face('peter', 1);
            sparkleOn(b, 'peter', 16, [255, 240, 210], 0.7);
            sfx(b, 'wind', { soft: true });
          }],
          [20.6, b => { W.set('gale', 0.1, b.instant); }],
          [21.4, b => {
            pose('peter', 'point');
            nameAt(b, '耶稣', cx() * W.w, (PORT ? 0.56 : 0.5) * W.h, { size: 0.075 * M(), hold: 3.4, rgb: [255, 236, 190], src: () => { const h = headOf('peter', 1); return [h[0] + (Math.random() - 0.5) * 20, h[1] - Math.random() * 20]; } });
            if (!b.instant) { const h = headOf('peter', 0.6); fx().ring(h[0], h[1], [255, 236, 190], M() * 0.35, 3, 2); }
            sfx(b, 'bell');
          }],
          [25.2, b => { W.set('pcHeaven', 0.22, b.instant); }],
        ]);
      },
    },

    // ── 11 · 4:31 聚会的地方震动 ────────────────────────────────
    {
      kind: 'act', utter: '聚会的地方震动', cmd: 'shake 聚会的地方 && fill 圣灵  # 放胆', ref: '4:31',
      verse: [
        { text: '二人既被释放，就到会友那里去……他们听见了，就同心合意地高声向神说：<br>「主啊！你是造天、地、海，和其中万物的，', ref: '使徒行传 4:23–24', hold: 8 },
        { text: '祷告完了，聚会的地方震动，<br>他们就都被圣灵充满，放胆讲论神的道。', ref: '使徒行传 4:31', hold: 6.5 },
        { text: '那许多信的人都是一心一意的……<br>使徒大有能力，见证主耶稣复活；众人也都蒙大恩。', ref: '使徒行传 4:32–33', hold: 8 },
      ],
      apply(c) {
        const bold = PORT ? ['peter', 'john'] : ['peter', 'john', 'james', 'andrew'];
        T(c, [
          [0, b => {
            S.scene = 'room';
            W.goTo(tod(0.62, 0.68), 6, b.instant);
            temple(false); council(false);
            rm('lame'); rm('guardC', true); rm('guard1', true);
            S.fire = []; W.set('pcFire', 0, b.instant); W.set('pcHeaven', 0, b.instant); S.beamV = 0;
            street(true, { lit: 0.5 });
            intoRoom(roomIds().filter(id => id !== 'peter' && id !== 'john'), { pose: 'stand', glow: 0.34 });
            const sp = roomSlot('peter'), sj = roomSlot('john');
            put('peter', { x: X.crowd1, v: sp.v, pose: 'stand', facing: -1 });
            put('john', { x: X.crowd1 + 0.03, v: sj.v, pose: 'stand', facing: -1 });
            walk('peter', sp.x, { speed: 0.045 }); walk('john', sj.x, { speed: 0.045 });
          }],
          [5, () => { for (const id of roomIds()) { pose(id, 'raise'); } }],
          // 聚会的地方震动
          [9.3, b => {
            shake(b, 1.2); flashW(b, 0.35);
            sfx(b, 'quake'); sfx(b, 'wind', { soft: true });
            W.set('pcRoom', 1, b.instant);
            for (const id of roomIds()) glow(id, 0.66);
            if (!b.instant && fx()) for (const id of roomIds()) sparkleOn(b, id, 6, [255, 236, 190], 0.8);
          }],
          // 放胆讲论神的道
          [12.8, b => {
            bold.forEach((id, i) => walk(id, X.crowd0 + (i * (PORT ? 0.05 : 0.028)), { speed: 0.04, pose: 'point' }));
            crowd('hear', { n: PORT ? 3 : 6, x0: 1.03, x1: 1.12, layer: 2, label: '百姓', pose: 'stand', glow: 0.12, v: 0.22 });
            cwalk('hear', X.crowd0 + (PORT ? 0.07 : 0.1), X.crowd1, { speed: 0.045, pose: 'gaze' });
          }],
          [17.1, b => { W.set('pcLights', 0.9, b.instant); sfx(b, 'harp', { soft: true }); }],
          [20.2, b => { W.set('pcRoom', 0.45, b.instant); cglow('hear', 0.3); }],
        ]);
      },
    },

    // ── 12 · 5:19 但主的使者夜间开了监门，领他们出来 ─────────────
    {
      kind: 'act', utter: '但主的使者夜间开了监门，领他们出来', cmd: 'unlock 监门 --at 夜间  # 领他们出来', ref: '5:19',
      verse: [
        { text: '大祭司和他的一切同人，就是撒都该教门的人，都起来，满心忌恨，<br>就下手拿住使徒，收在外监。', ref: '使徒行传 5:17–18', hold: 7 },
        { text: '但主的使者夜间开了监门，领他们出来，说：<br>「你们去站在殿里，把这生命的道都讲给百姓听。」', ref: '使徒行传 5:19–20', hold: 8.5 },
        { text: '使徒听了这话，天将亮的时候就进殿里去教训人。', ref: '使徒行传 5:21', hold: 5.5 },
      ],
      apply(c) {
        const pris = () => (PORT ? TWELVE.filter(id => id !== 'bartholomew' && id !== 'judasJ') : TWELVE);
        const slot = (i, n) => {
          const G = prisonG({ x0: X.prison0, x1: X.prison1 }), half = Math.ceil(n / 2), front = i >= half, j = front ? i - half : i, m = front ? n - half : half;
          return { x: lerp(G.bx0 + 0.25 * G.ph, G.bx1 - (front ? 1.2 : 0.25) * G.ph, (j + 0.5) / m) / W.w, v: front ? 0.26 : 0.03 };
        };
        const door = () => X.prison1 + (PORT ? 0.03 : 0.018);
        T(c, [
          [0, b => {
            S.scene = 'prison';
            W.goTo(0.02, 7, b.instant);
            crm('hear');
            for (const id of roomIds()) rm(id);
            W.set('pcRoom', 0, b.instant);
          }],
          [1.6, b => {
            street(false);
            prop('prison', 'prison', { x0: X.prison0, x1: X.prison1, open: 0, label: '外监' });
          }],
          [2.8, () => {
            const ids = pris();
            ids.forEach((id, i) => { const s = slot(i, ids.length); put(id, { x: s.x, v: s.v, pose: i % 3 === 0 ? 'sit' : i % 3 === 1 ? 'kneel' : 'pray', facing: i % 2 ? -1 : 1, glow: 0.36 }); });
            add('pg1', { label: '看守的人', sex: 'm', age: 'adult', x: door() + (PORT ? 0.035 : 0.02), facing: 1, robe: [104, 68, 56], accent: [176, 150, 104], prop: 'torch', glow: 0.14, layer: 2, v: 0.1 });
            add('pg2', { label: '看守的人', sex: 'm', age: 'adult', x: door() + (PORT ? 0.1 : 0.045), facing: 1, robe: [96, 72, 60], accent: [176, 150, 104], prop: 'spear', glow: 0.12, layer: 2, v: 0.06 });
          }],
          // 主的使者
          [8.3, b => {
            S.beam = (X.prison0 + X.prison1) / 2; S.beamV = 0; S.beamG = false;
            W.set('pcHeaven', 0.75, b.instant);
            const G = prisonG({ x0: X.prison0, x1: X.prison1 });
            // 使者站在众使徒之前（前排 v 0.26 之前），身上自带一团光
            add('angelP', { label: '主的使者', sex: 'm', age: 'adult', x: G.c + (PORT ? 0.02 : 0.01), facing: 1, angel: true, robe: [252, 252, 246], glow: 1, from: b.instant ? 'none' : 'light', layer: 2, v: 0.36 });
            const f = fig('angelP'); if (f) f.v = 0.36;
            flashW(b, 0.3); sfx(b, 'angel');
          }],
          [10.4, b => {
            prop('prison', null, { open: 1 });
            sfx(b, 'chains'); sfx(b, 'gate', { soft: true });
            for (const id of pris()) { pose(id, 'stand'); face(id, 1); }
            pose('angelP', 'point');
            // 锁开之处一闪
            if (!b.instant && fx()) {
              const G = prisonG({ x0: X.prison0, x1: X.prison1 }), top = G.yt + 0.04 * G.ph, lx = G.fx1 - 1.05 * G.ph, ly = lerp(top, G.gf, 0.5);
              fx().ring(lx, ly, [255, 244, 214], M() * 0.12, 1.6, 2);
              fx().sparkle(lx, ly, 26, [255, 240, 204], 12 * SU(), 'top');
              transient(b, { type: 'door', x: lx, y0: top, y1: G.gf, dur: 1.6 });
            }
          }],
          // 使者在前面走，领他们出来
          [11.6, () => { walk('angelP', PORT ? 0.94 : 0.92, { speed: 0.042 }); }],
          [12.4, () => {
            pris().forEach((id, i) => walk(id, lerp(PORT ? 0.74 : 0.735, PORT ? 0.9 : 0.87, i / (pris().length - 1)) , { speed: 0.028 + 0.002 * (i % 4) }));
          }],
          [16.4, b => { prop('prison', null, { open: 0 }); W.set('pcHeaven', 0, b.instant); rm('angelP'); sfx(b, 'gate', { soft: true }); }],
          // 天将亮的时候就进殿里去
          [18.1, b => {
            W.goTo(0.26, 5.5, b.instant);
            pris().forEach((id, i) => walk(id, 1.06 + i * 0.012, { speed: 0.035 }));
          }],
          [22.4, () => { for (const id of pris()) rm(id); }],
        ]);
      },
    },

    // ── 13 · 6:7 神的道兴旺起来 ────────────────────────────────
    {
      kind: 'act', utter: '神的道兴旺起来', cmd: 'grow 道 --in 耶路撒冷  # 门徒加增的甚多', ref: '6:7',
      verse: [
        { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利……<br>叫他们站在使徒面前。使徒祷告了，就按手在他们头上。', ref: '使徒行传 6:5–6', hold: 8.5 },
        { text: '神的道兴旺起来；在耶路撒冷门徒数目加增的甚多，<br>也有许多祭司信从了这道。', ref: '使徒行传 6:7', hold: 6.5 },
        { text: '司提反满得恩惠、能力，在民间行了大奇事和神迹。', ref: '使徒行传 6:8', hold: 5 },
      ],
      apply(c) {
        const aps = () => (PORT ? ['james', 'john', 'peter', 'andrew', 'matthew', 'thomas'] : TWELVE.slice());
        const seven = () => (PORT ? ['stephen', 'philip7', 'prochorus', 'nicolas'] : ['stephen', 'philip7', 'prochorus', 'nicanor', 'timon', 'parmenas', 'nicolas']);
        const SEVEN = { stephen: ['司提反', [214, 196, 160], [150, 110, 60]], philip7: ['腓利', [120, 132, 110], [200, 190, 160]], prochorus: ['伯罗哥罗', [138, 110, 88], [210, 190, 150]],
          nicanor: ['尼迦挪', [110, 106, 130], [200, 186, 160]], timon: ['提门', [146, 120, 96], [214, 196, 160]], parmenas: ['巴米拿', [100, 116, 124], [206, 196, 170]], nicolas: ['尼哥拉', [132, 100, 110], [210, 190, 170]] };
        const aX = i => lerp(X.porch0 + 0.012, PORT ? 0.93 : 0.87, (i + 0.5) / aps().length);
        const sX = i => lerp(X.porch0 - (PORT ? 0.06 : 0.035), PORT ? 0.9 : 0.845, (i + 0.5) / seven().length);
        // 门徒数目加增：左右两群新来的门徒（[gid, 出现处, x0, x1, v, n]）
        const newcomers = () => (PORT ? [['newL', 0.35, 0.38, 0.5, 0.52, 2], ['newR', 1.03, 0.75, 0.88, 0.62, 2]] : [['newL', 0.37, 0.43, 0.55, 0.46, 5], ['newR', 1.03, 0.72, 0.84, 0.56, 5]]);
        T(c, [
          [0, b => {
            S.scene = 'temple';
            W.goTo(tod(0.42, 0.32), 8, b.instant);
            unprop('prison'); rm('pg1'); rm('pg2');
            temple(true);
            W.set('pcReach', 0, true);   // 见证之光此刻看不见：把前沿收回，好在「兴旺」时再走一次
          }],
          [1.4, () => {
            aps().forEach((id, i) => put(id, { x: aX(i), v: 0.02, pose: 'stand', facing: i < aps().length / 2 ? 1 : -1, glow: 0.3 }));
            crowd('ch', { n: PORT ? 2 : 4, x0: PORT ? 0.93 : 0.88, x1: PORT ? 0.99 : 0.955, layer: 2, label: '门徒', pose: 'stand', glow: 0.2, v: 0.12, face: -1 });
            seven().forEach((id, i) => {
              const L = SEVEN[id];
              add(id, { label: L[0], sex: 'm', age: 'adult', x: sX(i) - (PORT ? 0.16 : 0.12), facing: 1, robe: L[1], accent: L[2], beard: i % 3 !== 1, glow: id === 'stephen' ? 0.34 : 0.22, layer: 2, v: 0.3 });
              const f = fig(id); if (f) f.v = 0.3;
              walk(id, sX(i), { speed: 0.04 });
            });
          }],
          // 使徒祷告了，就按手在他们头上
          [5.6, () => { for (const id of aps()) pose(id, 'raise'); }],
          [7.4, b => {
            for (const id of seven()) { pose(id, 'bow'); face(id, id === 'stephen' ? 1 : -1); }
            aps().forEach((id, i) => { pose(id, 'point'); const t = seven()[Math.min(seven().length - 1, Math.round(i * (seven().length - 1) / Math.max(1, aps().length - 1)))]; face(id, t); transient(b, { type: 'thread', from: id, to: t, dur: 2.4, t: -0.12 * i }); });
            sfx(b, 'harp', { soft: true });
          }],
          [9.2, b => { for (const id of seven()) { glow(id, id === 'stephen' ? 0.5 : 0.4); sparkleOn(b, id, 10, [255, 244, 220], 0.9); } }],
          // 神的道兴旺起来
          [9.8, b => {
            W.set('pcLights', 1, b.instant);
            // 光自殿向外走：城、中丘、远山一处一处亮起来（白日里也看得见）
            W.set('pcReach', 0.7, b.instant); W.set('pcReachA', 1, b.instant);
            for (const id of seven()) pose(id, 'stand');
            for (const id of aps()) pose(id, 'stand');
            // 新来的门徒从两边来
            for (const q of newcomers()) {
              crowd(q[0], { n: q[5], x0: q[1], x1: q[1] + 0.05, layer: 2, label: '新来的门徒', pose: 'stand', glow: 0.24, v: q[4] });
              cwalk(q[0], q[2], q[3], { speed: 0.042, pose: 'raise' });
            }
            sfx(b, 'bell'); sfx(b, 'crowd', { soft: true });
            if (!b.instant && fx()) for (let i = 0; i < 9; i++) { const xf = lerp(X.city0, X.city1, (i + 0.5) / 9); fx().sparkle(xf * W.w, gY(1, xf) - 8 * LS(1), 6, [255, 226, 160], 14 * SU(), 'top'); }
          }],
          [12.4, b => {
            crowd('priests', { n: PORT ? 2 : 3, x0: 1.03, x1: 1.1, layer: 2, label: '祭司', robe: [236, 232, 220], pose: 'stand', glow: 0.2, v: 0.3 });
            cwalk('priests', PORT ? 0.88 : 0.86, PORT ? 0.95 : 0.95, { speed: 0.04, pose: 'pray' });
          }],
          // 司提反满得恩惠、能力
          [17.6, b => {
            glow('stephen', 0.8); pose('stephen', 'raise');
            sparkleOn(b, 'stephen', 30, [255, 240, 210], 0.6); ringOn(b, 'stephen', 0.2, [255, 240, 210]);
            sfx(b, 'harp');
          }],
        ]);
      },
    },

    // ── 14 · 7:49 天是我的座位，地是我的脚凳 ─────────────────────
    {
      kind: 'name', utter: '天是我的座位，地是我的脚凳', cmd: 'mount 天 --as 座位 && mount 地 --as 脚凳', ref: '7:49',
      verse: [
        { text: '他们又耸动了百姓、长老，并文士，就忽然来捉拿他，把他带到公会去……<br>在公会里坐着的人都定睛看他，见他的面貌，好像天使的面貌。', ref: '使徒行传 6:12–15', hold: 8 },
        { text: '司提反说：「诸位父兄请听！当日我们的祖宗亚伯拉罕在美索不达米亚还未住哈兰的时候，<br>荣耀的神向他显现，', ref: '使徒行传 7:2', hold: 7 },
        { text: '其实，至高者并不住人手所造的，就如先知所言：<br>主说：天是我的座位，地是我的脚凳；你们要为我造何等的殿宇？', ref: '使徒行传 7:48–49', hold: 7.5 },
      ],
      apply(c) {
        const cx = () => councilX('c');
        T(c, [
          [0, b => {
            S.scene = 'council';
            W.goTo(tod(0.63, 0.68), 8, b.instant);
            for (const id of TWELVE) rm(id);
            for (const id of ['philip7', 'prochorus', 'nicanor', 'timon', 'parmenas', 'nicolas']) rm(id);
            crm('ch'); crm('priests'); crm('newL'); crm('newR');
            W.set('pcLights', 0.6, b.instant); W.set('pcReachA', 0, b.instant);
          }],
          [1.6, b => {
            prop('porch', null, { k2: 1, label: '公会' });
            council(true);
            walk('stephen', cx(), { speed: 0.03, pose: 'stand' });
            add('wit1', { label: '假见证', sex: 'm', age: 'adult', x: X.gate + 0.02, facing: 1, robe: [70, 62, 60], glow: 0.04, layer: 2, v: 0.14 });
            add('wit2', { label: '假见证', sex: 'm', age: 'adult', x: X.gate - 0.01, facing: 1, robe: [84, 70, 58], glow: 0.04, layer: 2, v: 0.2 });
            walk('wit1', cx() - (PORT ? 0.13 : 0.06), { speed: 0.03, pose: 'point' }); walk('wit2', cx() - (PORT ? 0.2 : 0.09), { speed: 0.03 });
          }],
          // 他的面貌好像天使的面貌
          [4.8, b => { W.set('pcAngel', 1, b.instant); glow('stephen', 0.85); face('stephen', 1); sfx(b, 'angel', { soft: true }); }],
          // 司提反说：荣耀的神向他显现（经上的往事一一显出）
          [9.3, b => { pose('stephen', 'raise'); pose('wit1', 'stand'); }],
          [9.8, b => { transient(b, { type: 'vision', kind: 'stars', dur: 2.6 }); sfx(b, 'stars'); }],
          [12.2, b => transient(b, { type: 'vision', kind: 'bush', dur: 2.6 })],
          [14.6, b => transient(b, { type: 'vision', kind: 'tent', dur: 2.6 })],
          [17, b => transient(b, { type: 'vision', kind: 'temple', dur: 3.4 })],
          // 天是我的座位，地是我的脚凳
          [19.2, b => { W.set('pcThrone', 1, b.instant); pose('stephen', 'point'); sfx(b, 'harp'); sfx(b, 'bell', { soft: true }); }],
          [24.2, b => { W.set('pcThrone', 0.4, b.instant); pose('stephen', 'stand'); }],
        ]);
      },
    },

    // ── 15 · 7:55 看见神的荣耀，又看见耶稣站在神的右边 ──────────────
    {
      kind: 'act', utter: '看见神的荣耀，又看见耶稣站在神的右边', cmd: 'open 天  # 人子站在神的右边', ref: '7:55',
      verse: [
        { text: '但司提反被圣灵充满，定睛望天，看见神的荣耀，又看见耶稣站在神的右边，<br>就说：「我看见天开了，人子站在神的右边。」', ref: '使徒行传 7:55–56', hold: 8.5 },
        { text: '众人大声喊叫，捂着耳朵，齐心拥上前去，把他推到城外……<br>作见证的人把衣裳放在一个少年人名叫扫罗的脚前。', ref: '使徒行传 7:57–58', hold: 7.5 },
        { text: '……司提反呼吁主说：「求主耶稣接收我的灵魂！」<br>又跪下大声喊着说：「主啊，不要将这罪归于他们！」说了这话，就睡了。', ref: '使徒行传 7:59–60', hold: 8.5 },
      ],
      apply(c) {
        const acc = () => [X.steph + (PORT ? 0.05 : 0.025), X.saul - (PORT ? 0.02 : 0.012)];
        T(c, [
          // 天开了
          [0, b => {
            W.set('pcThrone', 0, b.instant); W.set('pcAngel', 0.6, b.instant);
            W.set('pcGlory', 1, b.instant);
            S.beam = councilX('c'); S.beamV = 0.3; S.beamG = true;
            W.set('pcHeaven', 1, b.instant);
            pose('stephen', 'gaze'); glow('stephen', 0.95);
            sfx(b, 'angel'); sfx(b, 'harp', { soft: true });
          }],
          // 众人拥上前去，把他推到城外
          [9.8, b => {
            S.scene = 'outside';
            cpose('eldA', 'stand'); cpose('eldB', 'stand'); pose('hp', 'stand');
            sfx(b, 'crowd'); sfx(b, 'shout', { soft: true });
            W.goTo(tod(0.7, 0.72), 16, b.instant);
          }],
          [11, b => {
            temple(false);
            prop('cgate', 'gate', { x: X.cgate, style: 'city', open: 1, label: '城门' });
            rm('hp');
            cwalk('eldA', acc()[0], acc()[1], { speed: 0.05, pose: 'stand' });
            cwalk('eldB', acc()[0] + 0.01, acc()[1] + 0.01, { speed: 0.05, pose: 'stand' });
            walk('stephen', X.steph, { speed: 0.05, pose: 'stand' });
            walk('wit1', X.saul + 0.012, { speed: 0.05 }); walk('wit2', X.saul + (PORT ? 0.06 : 0.03), { speed: 0.05 });
            S.beam = X.steph;
          }],
          [14.2, () => {
            add('paul', Object.assign({}, LOOK().paul || { sex: 'm', robe: [128, 96, 72] }, { label: '扫罗', x: X.saul, facing: -1, glow: 0.08, pose: 'stand', layer: 2, v: 0.04 }));
          }],
          [15.8, b => {
            prop('clothes', 'clothes', { x: X.saul + (PORT ? 0.035 : 0.016), label: '衣裳' });
            pose('wit1', 'bow'); face('wit1', -1);
            cface('eldA', -1); cface('eldB', -1);
          }],
          // 求主耶稣接收我的灵魂；跪下；睡了
          [18.6, b => { pose('stephen', 'raise'); pose('wit1', 'stand'); }],
          [22.6, b => { pose('stephen', 'kneel'); face('stephen', 1); sfx(b, 'weep', { soft: true }); }],
          [25.4, b => {
            pose('stephen', 'lie'); glow('stephen', 0.32);
            W.set('pcSoul', 1, b.instant); W.set('pcAngel', 0, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          // 众人散去；天上的光慢慢合上
          [27.2, b => {
            cwalk('eldA', 1.04, 1.12, { speed: 0.04 }); cwalk('eldB', 1.05, 1.13, { speed: 0.04 });
            walk('wit1', 1.08, { speed: 0.04 }); walk('wit2', 1.1, { speed: 0.04 });
            W.set('pcHeaven', 0.22, b.instant);
          }],
          [30.4, b => {
            crm('eldA'); crm('eldB'); rm('wit1'); rm('wit2');
            W.set('pcGlory', 0.3, b.instant);
            face('paul', -1);
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '使徒行传', books: [44], title: '五旬节', sub: '使徒行传 1 — 7', tint: [255, 210, 160], music: 'babel',
    outro: 22,
    intro: [
      { text: '他受害之后，用许多的凭据将自己活活地显给使徒看，<br>四十天之久向他们显现，讲说神国的事。', ref: '使徒行传 1:3', hold: 7 },
      { text: '耶稣和他们聚集的时候，嘱咐他们说：「不要离开耶路撒冷，要等候父所应许的……<br>但不多几日，你们要受圣灵的洗。」', ref: '使徒行传 1:4–5', hold: 7.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    behold: {
      '耶稣': { text: '说了这话，他们正看的时候，他就被取上升，有一朵云彩把他接去，便看不见他了。', ref: '使徒行传 1:9' },
      '身穿白衣的人': { text: '「加利利人哪，你们为什么站着望天呢？这离开你们被接升天的耶稣，你们见他怎样往天上去，他还要怎样来。」', ref: '使徒行传 1:11' },
      '橄榄山': { text: '有一座山，名叫橄榄山，离耶路撒冷不远，约有安息日可走的路程。', ref: '使徒行传 1:12' },
      '耶路撒冷': { text: '神的道兴旺起来；在耶路撒冷门徒数目加增的甚多，也有许多祭司信从了这道。', ref: '使徒行传 6:7' },
      '楼房': { text: '进了城，就上了所住的一间楼房；', ref: '使徒行传 1:13' },
      '彼得': { text: '彼得说：「金银我都没有，只把我所有的给你：我奉拿撒勒人耶稣基督的名，叫你起来行走！」', ref: '使徒行传 3:6' },
      '约翰': { text: '他们见彼得、约翰的胆量，又看出他们原是没有学问的小民，就希奇，认明他们是跟过耶稣的；', ref: '使徒行传 4:13' },
      '雅各': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '安得烈': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '腓力': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '多马': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '巴多罗买': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '马太': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '亚勒腓的儿子雅各': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '奋锐党的西门': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '雅各的儿子犹大': { text: '在那里有彼得、约翰、雅各、安得烈、腓力、多马、巴多罗买、马太、亚勒腓的儿子雅各、奋锐党的西门，和雅各的儿子犹大。', ref: '使徒行传 1:13' },
      '马提亚': { text: '于是众人为他们摇签，摇出马提亚来；他就和十一个使徒同列。', ref: '使徒行传 1:26' },
      '耶稣的母亲马利亚': { text: '这些人同着几个妇人和耶稣的母亲马利亚，并耶稣的弟兄，都同心合意地恒切祷告。', ref: '使徒行传 1:14' },
      '抹大拉的马利亚': { text: '这些人同着几个妇人和耶稣的母亲马利亚，并耶稣的弟兄，都同心合意地恒切祷告。', ref: '使徒行传 1:14' },
      '妇人': { text: '这些人同着几个妇人和耶稣的母亲马利亚，并耶稣的弟兄，都同心合意地恒切祷告。', ref: '使徒行传 1:14' },
      '耶稣的弟兄': { text: '这些人同着几个妇人和耶稣的母亲马利亚，并耶稣的弟兄，都同心合意地恒切祷告。', ref: '使徒行传 1:14' },
      '帕提亚人': { text: '我们帕提亚人、米底亚人、以拦人，和住在美索不达米亚、犹太、加帕多家、本都、亚细亚、', ref: '使徒行传 2:9' },
      '埃及人': { text: '弗吕家、旁非利亚、埃及的人，并靠近古利奈的利比亚一带地方的人，从罗马来的客旅中，或是犹太人，或是进教的人，', ref: '使徒行传 2:10' },
      '罗马人': { text: '弗吕家、旁非利亚、埃及的人，并靠近古利奈的利比亚一带地方的人，从罗马来的客旅中，或是犹太人，或是进教的人，', ref: '使徒行传 2:10' },
      '克里特人': { text: '克里特和阿拉伯人，都听见他们用我们的乡谈，讲说神的大作为。」', ref: '使徒行传 2:11' },
      '阿拉伯人': { text: '克里特和阿拉伯人，都听见他们用我们的乡谈，讲说神的大作为。」', ref: '使徒行传 2:11' },
      '受洗的人': { text: '于是领受他话的人就受了洗。那一天，门徒约添了三千人，', ref: '使徒行传 2:41' },
      '水池': { text: '于是领受他话的人就受了洗。那一天，门徒约添了三千人，', ref: '使徒行传 2:41' },
      '领受他话的人': { text: '于是领受他话的人就受了洗。那一天，门徒约添了三千人，', ref: '使徒行传 2:41' },
      '新来的门徒': { text: '神的道兴旺起来；在耶路撒冷门徒数目加增的甚多，也有许多祭司信从了这道。', ref: '使徒行传 6:7' },
      '信的人': { text: '信的人都在一处，凡物公用，', ref: '使徒行传 2:44' },
      '凡物公用': { text: '内中也没有一个缺乏的；因为人人将田产房屋都卖了，把所卖的价银拿来，放在使徒脚前，照各人所需用的，分给各人。', ref: '使徒行传 4:34–35' },
      '生来瘸腿的人': { text: '百姓都看见他行走，赞美神；认得他是那素常坐在殿的美门口求周济的，就因他所遇着的事满心希奇、惊讶。', ref: '使徒行传 3:9–10' },
      '美门': { text: '有一个人，生来是瘸腿的，天天被人抬来，放在殿的一个门口（那门名叫美门），要求进殿的人周济。', ref: '使徒行传 3:2' },
      '进殿的人': { text: '申初祷告的时候，彼得、约翰上圣殿去。', ref: '使徒行传 3:1' },
      '所罗门的廊': { text: '主藉使徒的手在民间行了许多神迹奇事；他们都同心合意地在所罗门的廊下。', ref: '使徒行传 5:12' },
      '守殿官': { text: '使徒对百姓说话的时候，祭司们和守殿官，并撒都该人忽然来了。', ref: '使徒行传 4:1' },
      '公会': { text: '叫使徒站在当中，就问他们说：「你们用什么能力，奉谁的名做这事呢？」', ref: '使徒行传 4:7' },
      '公会的人': { text: '在公会里坐着的人都定睛看他，见他的面貌，好像天使的面貌。', ref: '使徒行传 6:15' },
      '大祭司': { text: '大祭司和他的一切同人，就是撒都该教门的人，都起来，满心忌恨，', ref: '使徒行传 5:17' },
      '百姓': { text: '祷告完了，聚会的地方震动，他们就都被圣灵充满，放胆讲论神的道。', ref: '使徒行传 4:31' },
      '外监': { text: '「我们看见监牢关得极妥当，看守的人也站在门外；及至开了门，里面一个人都不见。」', ref: '使徒行传 5:23' },
      '看守的人': { text: '「我们看见监牢关得极妥当，看守的人也站在门外；及至开了门，里面一个人都不见。」', ref: '使徒行传 5:23' },
      '主的使者': { text: '但主的使者夜间开了监门，领他们出来，说：「你们去站在殿里，把这生命的道都讲给百姓听。」', ref: '使徒行传 5:19–20' },
      '司提反': { text: '司提反满得恩惠、能力，在民间行了大奇事和神迹。', ref: '使徒行传 6:8' },
      '腓利': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '伯罗哥罗': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '尼迦挪': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '提门': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '巴米拿': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '尼哥拉': { text: '大众都喜悦这话，就拣选了司提反，乃是大有信心、圣灵充满的人，又拣选腓利、伯罗哥罗、尼迦挪、提门、巴米拿，并进教的安提阿人尼哥拉，', ref: '使徒行传 6:5' },
      '门徒': { text: '那时，门徒增多，有说希腊话的犹太人向希伯来人发怨言，因为在天天的供给上忽略了他们的寡妇。', ref: '使徒行传 6:1' },
      '祭司': { text: '神的道兴旺起来；在耶路撒冷门徒数目加增的甚多，也有许多祭司信从了这道。', ref: '使徒行传 6:7' },
      '假见证': { text: '设下假见证，说：「这个人说话，不住地糟践圣所和律法。', ref: '使徒行传 6:13' },
      '扫罗': { text: '又跪下大声喊着说：「主啊，不要将这罪归于他们！」说了这话，就睡了。扫罗也喜悦他被害。', ref: '使徒行传 7:60' },
      '衣裳': { text: '作见证的人把衣裳放在一个少年人名叫扫罗的脚前。', ref: '使徒行传 7:58' },
      '城门': { text: '众人大声喊叫，捂着耳朵，齐心拥上前去，把他推到城外，', ref: '使徒行传 7:57–58' },
    },
  });
})(window.GS);
