/* ─────────────────────────────────────────────────────────────
 * book/supper.js —— 四福音 · 最后的晚餐（马太福音 26 · 路加福音 22 · 约翰福音 13 — 18）
 *
 * 除酵节的下午：耶稣与十二个门徒在城外（桌面：大楼右边的橄榄树下；手机：大楼门前）。「我的时候快到了」——
 * 彼得、约翰先进城，在一间摆设整齐的大楼里点起三盏挂灯，长桌上铺了细麻布，摆上饼与杯；
 * 日落时众人进来坐席（后排七人，耶稣居中；前排六人，彼得最近）。
 * 耶稣离席，束腰、倒水，一个一个跪在门徒面前洗脚；彼得起来推辞，又跪下（约 13）。
 * 「你们中间有一个人要卖我了」：众人彼此对看，那一点饼递给犹大，一团冷而暗的影随他出门——那时候是夜间了。
 * 饼擘开，一粒粒暖光飞到各人手中；杯里是红金色的光，传遍全席：各人胸前从此留着一点暖光。
 * 新命令：一根根光的丝线把众人彼此连起来，又都连到耶稣。「在我父的家里有许多住处」——高天上
 * 显出一层层发光的窗；「我就是道路」：一条光的路从席上升到那里。保惠师的应许：一片柔光从天降下，
 * 被风吹乱的灯火都定住了（道路整条淡去）。他们唱了诗，出来——灯熄了，大楼暗下去、退进夜里。
 * 门外的街上，一棵发光的葡萄树从柱外长起来，枝子拱在众人头上，结出一串串光的果子。
 * 耶稣举目望天：天上的光落在他身上；众人跪下。过了汲沦溪，进了园子（本幕的签名）：
 * 大楼隐去，同一处显出汲沦溪、月光下的橄榄树；八个门徒坐在园口，三个再往前，耶稣俯伏在一块石头旁——
 * 天使从天上显现，加添他的力量。门徒睡着了（或坐或卧，胸前的光也暗了）；远处城里出来一串火把。
 * 犹大领着一队人过溪来了；亲嘴；「我就是！」——火把连人往后倒在地上，又跪起来。
 * 彼得拔刀；「收刀入鞘吧」；耶稣摸那仆人的耳朵，一点光，他站起来了。门徒都逃走了。
 * 大祭司的院子（园子隐去，同一处显出院墙、门楼、炭火；耶稣被带进去，彼得远远跟着）：
 * 使女、门口的使女、旁边站着的人——三次不认，彼得胸前的光一次暗过一次；门楼上的鸡叫了，东方发白；
 * 主转过身来看彼得——一道极淡的光；彼得出去，在黎明的灰光里痛哭。
 *
 * 画面的方位：近地中央 = 大楼（后改为园子，再改为大祭司的院子）；大楼的右边 = 橄榄树；
 *            中丘 = 耶路撒冷城（城墙、房屋、圣殿）。桌面：汲沦溪与园子在大楼的地方随 lspGrove 显出；
 *            手机竖屏：大楼占满近地的中段，出门之后大楼隐去、橄榄园在同一处长出（不画汲沦溪）。
 *            经文在左边的海上（手机在顶上），故事都在右半边；桌面的大楼右移，让出最长的经文行。
 * 天父从不显为形像：只有从天而降的光与声音（经文）；圣灵是灵自己的光；天使是光的形像。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'supper';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('lspRoom', 'lin', 0.7);     // 大楼（隐去 / 显出约一秒半）
  W.defineLevel('lspRoomDim', 'exp', 0.6);  // 灯熄了、人出来之后：大楼暗成夜里的一座房子（不透明，不再像屋里）
  W.defineLevel('lspLamps', 'exp', 0.8);    // 三盏挂灯（1/3、2/3、1 逐盏点起）
  W.defineLevel('lspTable', 'exp', 0.7);    // 桌上摆好筵席
  W.defineLevel('lspCity', 'exp', 0.3);     // 城里的灯
  W.defineLevel('lspBasin', 'exp', 1.4);    // 盆与水
  W.defineLevel('lspDraft', 'exp', 0.5);    // 灯火被风吹乱（忧愁）
  W.defineLevel('lspShade', 'exp', 0.5);    // 犹大身边冷而暗的影
  W.defineLevel('lspShared', 'exp', 0.45);  // 饼与杯之后，各人胸前的一点暖光
  W.defineLevel('lspLove', 'exp', 0.45);    // 彼此相爱：光的丝线
  W.defineLevel('lspHouse', 'exp', 0.3);    // 我父的家：天上许多住处
  W.defineLevel('lspWay', 'lin', 0.2);      // 道路：从席上升到父家的光（长出）
  W.defineLevel('lspWayA', 'exp', 0.7);     // 道路的显隐（整条淡去，不缩回成半截）
  W.defineLevel('lspPeace', 'exp', 0.4);    // 保惠师的应许：一片柔光
  W.defineLevel('lspVine', 'lin', 0.12);    // 葡萄树（长成约八秒）
  W.defineLevel('lspFruit', 'lin', 0.16);   // 结果子
  W.defineLevel('lspVineA', 'exp', 0.7);    // 葡萄树的显隐（离开街上时隐去，不倒着缩回）
  W.defineLevel('lspGlory', 'exp', 0.5);    // 举目望天：天上的光
  W.defineLevel('lspOne', 'exp', 0.5);      // 合而为一
  W.defineLevel('lspGrove', 'lin', 0.45);   // 园子：汲沦溪、石头与园中的橄榄树在大楼的地方显出
  W.defineLevel('lspTorchFar', 'exp', 0.5); // 城里出来的一串火把（远）
  W.defineLevel('lspCourt', 'lin', 0.6);    // 大祭司的院子
  W.defineLevel('lspFire', 'exp', 0.6);     // 炭火
  W.defineLevel('lspLook', 'exp', 0.9);     // 主转过身来看彼得
  W.defineLevel('lspRooster', 'exp', 1.2);  // 门楼上的鸡

  // ════════════════════════════════════════════════════════════
  //  地上的位置（画面宽度的比例）：桌面 | 手机竖屏
  // ════════════════════════════════════════════════════════════
  const phone = () => W.w < 600;
  // 桌面：大楼右移、左边的外墙收窄（最长的经文行到约 0.51 W 为止）；园子在大楼的地方（汲沦溪 0.6，石头 0.8）
  const XD = {
    mid: 0.6275, room0: 0.525, room1: 0.73, tab0: 0.56, tab1: 0.695, brook: 0.6, rock: 0.8,
    door: 0.714, court0: 0.538, house1: 0.596, gate: 0.734, fire: 0.654, city0: 0.5, city1: 0.86, temple: 0.768, bandIn: 0.45,
  };
  const XP = {
    mid: 0.62, room0: 0.42, room1: 0.82, tab0: 0.49, tab1: 0.75, brook: -1, rock: 0.872,
    door: 0.79, court0: 0.42, house1: 0.52, gate: 0.838, fire: 0.63, city0: 0.5, city1: 0.98, temple: 0.735, bandIn: 0.39,
  };
  const X = k => (phone() ? XP : XD)[k];
  // 人的站处：[桌面 x, 手机 x, 纵深 v]
  const at = (d, p) => (phone() ? p : d);

  // 十二门徒与耶稣（太 10:2–4）
  const BACK = ['thomas', 'jamesz', 'john', 'jesus', 'judas', 'matthew', 'philip'];     // 后排（桌后）
  const FRONT = ['andrew', 'bart', 'peter', 'thad', 'simon', 'jamesa'];                   // 前排（桌前）
  const TWELVE = ['peter', 'andrew', 'jamesz', 'john', 'philip', 'bart', 'thomas', 'matthew', 'jamesa', 'thad', 'simon', 'judas'];
  const ELEVEN = TWELVE.filter(id => id !== 'judas');
  const EIGHT = ['andrew', 'thomas', 'philip', 'bart', 'matthew', 'thad', 'simon', 'jamesa'];
  const LABEL = {
    andrew: '安得烈', jamesz: '雅各', philip: '腓力', bart: '巴多罗买', thomas: '多马', matthew: '马太',
    jamesa: '亚勒腓的儿子雅各', thad: '达太', simon: '奋锐党的西门', judas: '加略人犹大',
  };
  const RI = { andrew: 0, jamesz: 1, philip: 2, bart: 3, thomas: 4, matthew: 5, jamesa: 6, thad: 7, simon: 8, judas: 9 };
  function seat(id) {
    const i = BACK.indexOf(id);
    if (i >= 0) { const k = i - 3; return { x: X('mid') + k * at(0.027, 0.05), v: 0, f: k < 0 ? 1 : -1 }; }
    const j = FRONT.indexOf(id);
    const off = at([-0.085, -0.059, -0.033, 0.033, 0.059, 0.085], [-0.17, -0.12, -0.07, 0.07, 0.12, 0.17])[j];
    return { x: X('mid') + off, v: 0.32, f: j < 3 ? 1 : -1 };
  }
  // 除酵节的下午：在城外——桌面在大楼右边的橄榄树下；手机在大楼门前的草地上（两排，都在屋外）
  const START = {
    thomas: [0.762, 0.47, 0.3], andrew: [0.7735, 0.51, 0.62], jamesz: [0.785, 0.55, 0.2], bart: [0.7965, 0.59, 0.72],
    peter: [0.808, 0.63, 0.42], jesus: [0.8195, 0.67, 0.3], john: [0.831, 0.71, 0.55], matthew: [0.8425, 0.75, 0.18],
    judas: [0.854, 0.79, 0.66], thad: [0.8655, 0.83, 0.36], philip: [0.877, 0.87, 0.74], simon: [0.8885, 0.91, 0.26], jamesa: [0.9, 0.95, 0.5],
  };
  const START_VP = { thomas: 0.84, andrew: 0.96, jamesz: 0.84, bart: 0.96, peter: 0.84, jesus: 0.92, john: 0.84, matthew: 0.96, judas: 0.84, thad: 0.96, philip: 0.84, simon: 0.96, jamesa: 0.86 };
  // 出了大楼，门外的街上（葡萄树）
  const STREET = {
    thomas: [0.556, 0.45, 0.7], andrew: [0.571, 0.49, 0.84], jamesz: [0.587, 0.53, 0.64], bart: [0.603, 0.57, 0.86],
    peter: [0.62, 0.61, 0.72], jesus: [0.641, 0.66, 0.66], john: [0.661, 0.7, 0.82], matthew: [0.677, 0.74, 0.62],
    thad: [0.693, 0.78, 0.86], philip: [0.708, 0.82, 0.7], simon: [0.722, 0.87, 0.84], jamesa: [0.736, 0.92, 0.64],
  };
  // 客西马尼：八个在园口，三个再往前，耶稣「稍往前走」（桌面：园子在画面的中段，汲沦溪在它左边）
  const GARDEN = {
    andrew: [0.628, 0.45, 0.66], thomas: [0.636, 0.49, 0.3], philip: [0.646, 0.53, 0.84], bart: [0.655, 0.57, 0.48],
    matthew: [0.664, 0.46, 0.18], thad: [0.672, 0.5, 0.7], simon: [0.682, 0.55, 0.9], jamesa: [0.69, 0.59, 0.36],
    peter: [0.708, 0.66, 0.56], jamesz: [0.716, 0.7, 0.3], john: [0.726, 0.73, 0.76], jesus: [0.748, 0.84, 0.4],
  };
  // 「起来！我们走吧」：耶稣迎上前去（到溪边），门徒在他身后
  const MEET = {
    jesus: [0.645, 0.6, 0.45], peter: [0.667, 0.64, 0.62], john: [0.677, 0.68, 0.34], jamesz: [0.688, 0.71, 0.74],
    andrew: [0.7, 0.745, 0.28], thomas: [0.711, 0.78, 0.6], philip: [0.722, 0.81, 0.4], bart: [0.733, 0.845, 0.78],
    matthew: [0.742, 0.875, 0.24], thad: [0.752, 0.9, 0.56], simon: [0.761, 0.93, 0.8], jamesa: [0.77, 0.955, 0.4],
  };
  // 一队兵和差役（约 18:3）——桌面：停在汲沦溪的西岸
  const BAND = [
    // id, 标签, 衣色, 所拿, [桌面 x, 手机 x, v]
    ['judas', LABEL.judas, null, null, [0.576, 0.555, 0.55]],
    ['malchus', '马勒古', [150, 118, 84], 'torch', [0.562, 0.535, 0.74]],
    ['sol1', '兵丁', [128, 70, 58], 'torch', [0.554, 0.515, 0.42]],
    ['sol2', '差役', [96, 88, 80], 'spear', [0.543, 0.49, 0.82]],
    ['sol3', '兵丁', [118, 64, 54], 'torch', [0.531, 0.47, 0.56]],
    ['sol4', '差役', [104, 94, 86], 'spear', [0.519, 0.45, 0.32]],
    ['sol5', '差役', [112, 100, 88], 'torch', [0.508, 0.43, 0.76]],
    ['sol6', '兵丁', [124, 72, 60], 'spear', [0.497, 0.41, 0.5]],
  ];
  // 大祭司的院子
  const COURT = {
    jesus: [0.567, 0.47, 0.03], sol1: [0.552, 0.445, 0.06], sol3: [0.583, 0.497, 0.08],
    sol5: [0.632, 0.575, 0.22], sol6: [0.698, 0.745, 0.12], peterFire: [0.676, 0.685, 0.3], maid0: [0.58, 0.49, 0.1], maid1: [0.659, 0.655, 0.12],
    peterGate: [0.72, 0.8, 0.26], maidGate: [0.704, 0.77, 0.36], sol6b: [0.702, 0.765, 0.16], sol5b: [0.69, 0.735, 0.46], peterOut: [0.782, 0.905, 0.36],
  };
  // 在石头旁俯伏祷告之处（桌面往前些，好叫俯伏、跪祷的身形大一点）
  const rockSpot = () => ({ x: X('rock') - at(0.026, 0.03), v: at(0.45, 0.3) });
  // 睡着的门徒：或坐或卧，卧的朝向交错（不是一排排直挺挺的）
  const SLEEP = {
    andrew: ['sit', 1], thomas: ['lie', -1], philip: ['sit', 1], bart: ['sit', -1], matthew: ['lie', -1], thad: ['sit', -1],
    simon: ['lie', 1], jamesa: ['sit', 1], peter: ['lie', 1], jamesz: ['sit', 1], john: ['lie', -1],
  };
  function sleep(ids) { ids.forEach(id => { const s = SLEEP[id] || ['lie', 1]; pose(id, s[0]); face(id, s[1]); }); }
  const P = (tab, id) => { const q = tab[id]; return { x: at(q[0], q[1]), v: q[2] }; };
  const startPos = id => { const q = START[id]; return phone() ? { x: q[1], v: START_VP[id] } : { x: q[0], v: q[2] }; };

  const ROBE = { angel: [246, 236, 214], maid: [160, 112, 104] };
  const WOOD = [118, 86, 58], PLASTER = [214, 194, 160], STONE = [190, 170, 138], LINEN = [238, 232, 216], GOLD = [232, 192, 98];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { loaf: 'table', cup: 'table', washed: 0, judasOut: 0, fruit: 0, court: 0, crowed: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.55 : 1) * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const vY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.45, W.unit);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const hsh = k => U.fract(Math.sin(k * 127.1 + 311.7) * 43758.5453);
  const RT = [];
  (function () { const r = U.mulberry32(2613); for (let i = 0; i < 512; i++) RT.push(r()); })();
  const rt = i => RT[((i % 512) + 512) % 512];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const alive = id => { const f = fig(id); return !!(f && !f.dying); };
  function add(id, o) { return C().add(id, o); }
  function pose(id, p, o) {
    const f = fig(id);
    if (!f) return;
    // 正在走的人：走到了再换姿势——与瞬间重演时一样
    if (f._lspMove && !W.replaying) { f._lspMove.pose = p; if (o && o.weep != null) f._lspMove.weep = !!o.weep; return; }
    C().pose(id, p, o);
  }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function prop(id, k) { const c = C(); if (c.prop && fig(id)) c.prop(id, k); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function shake(b, v) { if (!b.instant) W.shake = Math.max(W.shake || 0, v); }
  function flash(b, v) { if (!b.instant) W.flash = Math.max(W.flash || 0, v); }
  function tod(b, t, dur) { W.goTo(t, b.instant ? 0 : dur, b.instant); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 门徒与耶稣：用新约各幕共用的样子
  function lookOf(id) {
    const c = C(), L = c.LOOK || {};
    if (id === 'jesus' || id === 'peter' || id === 'john') return Object.assign({}, L[id]);
    const R = c.DISCIPLE_ROBES || [[122, 104, 84]];
    return Object.assign({}, L.disciple || { sex: 'm', age: 'adult', beard: true }, { label: LABEL[id], robe: R[RI[id] % R.length] });
  }
  function addPerson(id, x, v, o) {
    o = o || {};
    const base = BAND.find(b => b[0] === id && id !== 'judas');
    const look = base ? { label: base[1], sex: 'm', age: 'adult', robe: base[2], beard: true, glow: 0.12 } : lookOf(id);
    return add(id, Object.assign(look, { x, layer: 2, v, facing: o.facing || 1, pose: o.pose || 'stand', from: o.from || 'none', prop: o.prop !== undefined ? o.prop : (base ? base[3] : null) },
      o.glow != null ? { glow: o.glow } : {}));
  }

  // 走到某处（含纵深 v）：左右由人物模块的 walk 走（脚下有步伐、夜里有地上的光），前后（纵深 v）由本幕缓缓推移；
  // 走到了（一个情节拍）再换成要的姿势、转向。重演时直接到位。
  function moveTo(b, id, x, v, o) {
    const f = fig(id);
    if (!f) return 0;
    o = o || {};
    const ps = o.pose || 'stand';
    const tok = f._lspTok = (f._lspTok || 0) + 1;
    if (b.instant || W.replaying) {
      if (Math.abs(x - (f.tx != null ? f.tx : f.nx)) > 1e-4) f.facing = f.fd = x > (f.tx != null ? f.tx : f.nx) ? 1 : -1;
      f.fly = null; f.ny = null; f.tx = null; f.nx = x; f.v = v; f._lspMove = null;
      C().pose(id, ps, { stop: true, weep: !!o.weep });
      if (o.face) faceNow(f, o.face);
      return 0;
    }
    const v0 = f.v || 0;
    const dist = Math.hypot((x - f.nx) * W.w, vY(x, v) - vY(f.nx, v0));
    const dur = o.dur || clamp(Math.max(Math.abs(x - f.nx) / (o.run ? 0.09 : 0.042), Math.abs(v - v0) * 2.4), 0.6, 8);
    if (dist < 1) { f._lspMove = null; f.v = v; C().pose(id, ps, { stop: true, weep: !!o.weep }); if (o.face) faceNow(f, o.face); return 0; }
    f._lspMove = { v0, v1: v, t: 0, dur, pose: ps, face: o.face || 0, weep: !!o.weep };
    if (Math.abs(x - f.nx) > 0.002) C().walk(id, x, { speed: Math.max(0.003, Math.abs(x - f.nx) / dur), pose: ps, run: o.run });
    else { f.tx = null; C().pose(id, o.run ? 'run' : 'walk', { stop: true }); }
    // 这一句的故事等他走到了才算讲完
    GS.book.timeline({ instant: false }, [[dur + 0.05, () => finishMove(id, tok)]]);
    return dur;
  }
  function finishMove(id, tok) {
    const f = fig(id);
    if (!f || f._lspTok !== tok || !f._lspMove) return;
    const m = f._lspMove;
    f._lspMove = null;
    f.v = m.v1;
    if (f.tx != null) { f.nx = f.tx; f.tx = null; }
    C().pose(id, m.pose, { stop: true, weep: m.weep });
    if (m.face) faceNow(f, m.face);
  }
  function faceNow(f, d) {
    if (d === 1 || d === -1) f.facing = d;
    else if (typeof d === 'number') f.facing = d >= f.nx ? 1 : -1;
    else if (typeof d === 'string') { const o = fig(d); if (o) f.facing = o.nx >= f.nx ? 1 : -1; }
    if (W.replaying) f.fd = f.facing;
  }
  // 纵深的推移（每帧）；snap：立即走完
  function settleFlights(dt, snap) {
    const c = C();
    if (!c || !c.people) return;
    for (const f of c.people.values()) {
      const m = f._lspMove;
      if (!m) continue;
      if (snap) { f._lspMove = null; f.v = m.v1; if (f.tx != null) { f.nx = f.tx; f.tx = null; } c.pose(f.id, m.pose, { stop: true, weep: m.weep }); if (m.face) faceNow(f, m.face); f.fd = f.facing; continue; }
      m.t += dt;
      const q = clamp(m.t / m.dur, 0, 1);
      f.v = lerp(m.v0, m.v1, q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2);
    }
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62 };
  function figFoot(f) {
    const x = f.nx * W.w, y = f.ny != null ? f.ny * W.h : vY(f.nx, f.v || 0);
    return [x, y, PH(2) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0))];
  }
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const q = figFoot(f);
    const low = f.pose === 'sit' || f.pose === 'kneel' || f.pose === 'pray' || f.pose === 'seat' ? 0.66 : f.pose === 'lie' || f.pose === 'fall' ? 0.22 : 1;
    return [q[0], q[1] - q[2] * low * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  function nameHere(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const size = Math.max(0.032, o.size || 0.036) * M(), n = Array.from(str).length;
    const c = nameAt(x, y, size, n);
    const src = o.src || (() => [x + U.rand(-50, 50) * SU(), y + U.rand(-20, 30) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 3.2, delay: o.delay });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'top'); }
  function sparkOn(b, id, n, rgb, frac) { const p = figPt(id, frac == null ? 0.6 : frac); if (p) sparkAt(b, p[0], p[1], n || 22, rgb || [255, 240, 210], 10, 'top'); }
  function ringOn(b, id, rgb, r, dur, frac) {
    if (b.instant || !fx()) return;
    const p = figPt(id, frac == null ? 0.55 : frac);
    if (p) fx().ring(p[0], p[1], rgb || [255, 236, 196], r || M() * 0.16, dur || 2, 1.4);
  }

  // 说话、动作的那个人：名字用粒子写在他头上（在屋里时写在屋顶之上），约三秒；dy 错开上下
  function nameOver(b, id, str, o) {
    if (b.instant || W.replaying) return;
    const p = figPt(id, 1);
    if (!p) return;
    o = o || {};
    const h = PH(2);
    let y = p[1] - h * 0.75;
    if (W.lv.lspRoom > 0.5) { const G = roomGeo(); y = Math.min(y, G.yt - 0.62 * G.ph - M() * 0.045); }
    if (W.lv.lspCourt > 0.5) { const G = courtGeo(); y = Math.min(y, G.gb - 1.6 * G.ph - M() * 0.03); }
    y -= (o.dy || 0) * M();
    const src = () => { const q = figPt(id, 0.8) || p; return [q[0] + U.rand(-8, 8) * SU(), q[1] + U.rand(-8, 6) * SU()]; };
    nameHere(b, str, p[0] + (o.dx || 0) * M(), y, o.rgb || [255, 236, 204], { size: phone() ? 0.042 : 0.036, hold: o.hold || 3.2, src, delay: o.delay });
  }

  // ── 画面上转瞬即逝的效果（只关乎画面；瞬间重演时不存在）────────
  const FXL = [];
  function fxl(b, e) { if (b.instant) return; e.t = 0; FXL.push(e); }
  // 一点光从某人飞到另一人（那点饼、擘开的饼、杯中的光）
  function mote(b, from, to, o) { fxl(b, Object.assign({ type: 'mote', from, to, dur: 1.6, rgb: [255, 226, 160] }, o || {})); }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘）
  // ════════════════════════════════════════════════════════════
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
  // 竖的光：横向如高斯，纵向由 stops 给出
  function shaft(rgb, stops) {
    const c = cnv(64, 256), g = c.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 0)); hz.addColorStop(0.3, U.rgba(rgb[0], rgb[1], rgb[2], 0.3));
    hz.addColorStop(0.5, U.rgba(rgb[0], rgb[1], rgb[2], 1));
    hz.addColorStop(0.7, U.rgba(rgb[0], rgb[1], rgb[2], 0.3)); hz.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    for (const s of stops) vt.addColorStop(s[0], 'rgba(0,0,0,' + s[1] + ')');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 178, 98], 1), gold: radial([255, 228, 166], 1), white: radial([246, 246, 255], 1),
      pale: radial([226, 228, 255], 1), wine: radial([236, 104, 76], 1), ember: radial([255, 112, 48], 1),
      dark: radial([12, 10, 16], 1, 0.5), cold: radial([96, 104, 128], 0.9, 0.55), moon: radial([214, 226, 255], 1),
    };
    SP.col = shaft([255, 250, 236], [[0, 0], [0.25, 0.35], [0.8, 0.85], [0.95, 1], [1, 0.4]]);
    SP.soft = shaft([236, 238, 255], [[0, 0], [0.3, 0.5], [0.85, 0.8], [1, 0]]);
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a, sy) {
    if (a < 0.003 || !sp || !(r > 0) || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(sp, x - r, y - ry, r * 2, ry * 2);
  }
  // 火焰（油灯、火把、炭火）
  function flame(ctx, x, y, h, k, seed, sway) {
    if (k < 0.02 || h < 0.5) return;
    const t = W.t * 7 + seed * 11;
    const sx = (Math.sin(t) * 0.12 + Math.sin(t * 2.3 + 1) * 0.06) * h * (1 + (sway || 0) * 3);
    const hh = h * (0.86 + 0.14 * Math.sin(t * 1.7 + seed));
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(255,150,60,0.9)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.22, y);
    ctx.quadraticCurveTo(x - h * 0.26, y - hh * 0.45, x + sx, y - hh);
    ctx.quadraticCurveTo(x + h * 0.26, y - hh * 0.45, x + h * 0.22, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,236,170,0.95)';
    ctx.beginPath();
    ctx.moveTo(x - h * 0.1, y);
    ctx.quadraticCurveTo(x - h * 0.12, y - hh * 0.3, x + sx * 0.6, y - hh * 0.62);
    ctx.quadraticCurveTo(x + h * 0.12, y - hh * 0.3, x + h * 0.1, y);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷城（中丘）：城墙、房屋、圣殿；夜里家家点灯
  // ════════════════════════════════════════════════════════════
  function drawCity(ctx) {
    const l = 1, ph = PH(1), nk = nightK(), lit = W.lv.lspCity;
    const x0 = X('city0'), x1 = X('city1');
    if (!(ph > 0)) return;
    const ridge = xf => gY(1, xf);
    // 城里的房屋：一层层往圣殿山上去（后排高、前排低）
    for (let row = 0; row < 3; row++) {
      let x = x0 * W.w + (row * 0.37) * ph;
      let i = row * 61;
      const lift = (2 - row) * 0.42 * ph;
      while (x < x1 * W.w) {
        const w = (0.75 + 0.7 * rt(i)) * ph, h = (0.6 + 0.9 * rt(i + 7)) * ph;
        const xm = (x + w * 0.5) / W.w;
        const tpos = X('temple');
        if (Math.abs(xm - tpos) < 0.035 * (phone() ? 1.6 : 1) && row < 2) { x += w; i++; continue; }   // 圣殿山上不盖房
        const g = ridge(clamp(xm, 0.3, 1)) - lift + 0.05 * ph;
        ctx.fillStyle = css(row === 2 ? [190, 168, 134] : row === 1 ? [178, 158, 128] : [166, 150, 124], l);
        ctx.fillRect(x, g - h, w - 0.5, h + 0.9 * ph);
        // 平顶上一道亮边
        ctx.fillStyle = css([236, 218, 184], l, 0.45 * dayA(), 0.1);
        ctx.fillRect(x, g - h, w - 0.5, Math.max(0.7, 0.05 * ph));
        // 窗：夜里点灯
        const nw = rt(i + 3) < 0.6 ? 1 : 2;
        for (let k = 0; k < nw; k++) {
          const wx = x + w * (nw === 1 ? 0.42 : 0.26 + k * 0.4), wy = g - h * 0.55, ww = Math.max(1, 0.13 * ph), wh = Math.max(1.2, 0.2 * ph);
          const on = lit * nk * (rt(i * 3 + k) < 0.72 ? 1 : 0);
          ctx.fillStyle = on > 0.05 ? U.rgba(255, 196, 112, clamp(on * (0.75 + 0.25 * Math.sin(W.t * 0.7 + i + k)), 0, 1)) : css([70, 58, 46], l, 0.8);
          ctx.fillRect(wx, wy, ww, wh);
        }
        x += w + (rt(i + 11) < 0.2 ? 0.2 * ph : 0);
        i++;
      }
    }
    // 城墙与城楼
    const wallH = 0.7 * ph;
    ctx.fillStyle = css([184, 164, 130], l);
    ctx.beginPath();
    const n = 40;
    for (let k = 0; k <= n; k++) { const xf = lerp(x0, x1, k / n); const y = ridge(xf) - wallH + 0.15 * ph; if (k) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let k = n; k >= 0; k--) { const xf = lerp(x0, x1, k / n); ctx.lineTo(xf * W.w, ridge(xf) + 0.3 * ph); }
    ctx.closePath(); ctx.fill();
    // 垛口
    ctx.beginPath();
    for (let xx = x0 * W.w; xx < x1 * W.w; xx += 0.28 * ph) { const y = ridge(xx / W.w) - wallH + 0.15 * ph; ctx.rect(xx, y - 0.14 * ph, 0.14 * ph, 0.15 * ph); }
    ctx.fill();
    for (const tx of [x0 + 0.01, lerp(x0, x1, 0.36), lerp(x0, x1, 0.7), x1 - 0.012]) {
      const y = ridge(tx) - wallH + 0.15 * ph, tw = 0.45 * ph;
      ctx.fillStyle = css([176, 156, 124], l);
      ctx.fillRect(tx * W.w - tw / 2, y - 0.6 * ph, tw, 0.6 * ph + wallH);
      ctx.fillStyle = css([236, 218, 184], l, 0.4 * dayA(), 0.1);
      ctx.fillRect(tx * W.w - tw / 2, y - 0.6 * ph, tw, Math.max(0.7, 0.05 * ph));
      if (lit * nk > 0.05) { ctx.fillStyle = U.rgba(255, 186, 100, lit * nk * 0.8); ctx.fillRect(tx * W.w - 0.05 * ph, y - 0.36 * ph, Math.max(1, 0.1 * ph), Math.max(1, 0.14 * ph)); }
    }
    drawTemple(ctx);
  }
  // 圣殿：圣殿山的平台、廊子、白石与金顶，门里挂着幔子
  function drawTemple(ctx) {
    const l = 1, ph = PH(1), nk = nightK(), lit = W.lv.lspCity;
    const xf = X('temple'), x = xf * W.w, g = gY(1, xf) - 0.55 * ph;
    const pw = 2.6 * ph, bw = 1.25 * ph, bh = 1.95 * ph;
    ctx.fillStyle = css([196, 178, 144], l);
    ctx.fillRect(x - pw, g - 0.45 * ph, pw * 2, 0.45 * ph + 0.8 * ph);
    // 廊子
    ctx.fillStyle = css([214, 200, 170], l);
    ctx.fillRect(x - pw * 0.92, g - 0.95 * ph, pw * 1.84, 0.5 * ph);
    ctx.fillStyle = css([150, 132, 106], l, 0.8);
    for (let k = 0; k < 13; k++) ctx.fillRect(x - pw * 0.88 + k * pw * 1.76 / 12.5, g - 0.9 * ph, Math.max(0.6, 0.05 * ph), 0.42 * ph);
    // 圣所
    ctx.fillStyle = css([240, 232, 214], l, 1, 0.05);
    ctx.fillRect(x - bw, g - 0.95 * ph - bh, bw * 2, bh);
    ctx.fillStyle = css(GOLD, l, 1, 0.12);
    ctx.fillRect(x - bw * 1.04, g - 0.95 * ph - bh - 0.08 * ph, bw * 2.08, 0.12 * ph);
    // 顶上的金刺
    ctx.fillStyle = css(GOLD, l, 0.9, 0.12);
    for (let k = 0; k < 7; k++) ctx.fillRect(x - bw + k * bw * 2 / 6.2, g - 0.95 * ph - bh - 0.2 * ph, Math.max(0.6, 0.04 * ph), 0.12 * ph);
    // 门与幔子
    const dw = 0.34 * ph, dh = 1.15 * ph, dy = g - 0.95 * ph - dh;
    ctx.fillStyle = css(GOLD, l, 0.9, 0.08);
    ctx.fillRect(x - dw - 0.08 * ph, dy - 0.1 * ph, dw * 2 + 0.16 * ph, dh + 0.1 * ph);
    ctx.fillStyle = css([128, 48, 52], l, 1, 0.04);
    ctx.fillRect(x - dw, dy, dw * 2, dh);
    // 夜里：殿院的灯
    const k = lit * nk;
    if (k > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, x, g - 0.9 * ph, pw * 1.1, k * 0.22, 0.45);
      glowSp(ctx, SP.gold, x, dy + dh * 0.5, dw * 3, k * 0.25);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 城里出来的一串火把（远）：在中丘上沿着城墙往溪边来
  function drawTorchFar(ctx) {
    const k = W.lv.lspTorchFar;
    if (k < 0.02) return;
    SP || sprites();
    const ph = PH(1), x0 = at(0.6, 0.58), x1 = at(0.7, 0.72);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const u = U.fract(W.t * 0.018 + i * 0.07);
      const xf = lerp(x0, x1, u), y = gY(1, xf) + 0.2 * ph - 0.6 * ph;
      const fl = 0.8 + 0.2 * Math.sin(W.t * 11 + i * 3);
      glowSp(ctx, SP.warm, xf * W.w, y, 0.55 * ph * fl, k * 0.8 * Math.sin(Math.PI * clamp(u * 1.4, 0, 1)));
      glowSp(ctx, SP.gold, xf * W.w, y, 0.18 * ph, k * 0.9 * Math.sin(Math.PI * clamp(u * 1.4, 0, 1)));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  大楼：摆设整齐的一间大楼（路 22:12）——剖开的房间：后墙、两侧墙、顶棚、地、挂灯
  // ════════════════════════════════════════════════════════════
  function roomGeo() {
    const ph = PH(2), c = X('mid'), xa = X('room0') * W.w, xb = X('room1') * W.w;
    const gb = gY(2, c), gf = vY(c, 0.52);
    const H = 3.1 * ph;
    const inset = 0.45 * ph * (phone() ? 0.8 : 1);
    const bx0 = xa + inset, bx1 = xb - inset;
    const fx0 = xa - 0.3 * ph, fx1 = xb + 0.3 * ph;
    const yc = gb - H, yt = yc - 0.5 * ph;
    return { ph, cx: c * W.w, xa, xb, gb, gf, H, bx0, bx1, fx0, fx1, yc, yt };
  }
  const LAMPS = [0.2, 0.5, 0.8];
  function lampPos(G, i) { return [lerp(G.bx0, G.bx1, LAMPS[i]), G.yc + 0.85 * G.ph]; }
  function lampOn(i) { return clamp((W.lv.lspLamps - i / 3) * 3, 0, 1); }
  function lampLight() { return (lampOn(0) + lampOn(1) + lampOn(2)) / 3; }
  function windowCol() {
    const d = W.dayFactor, n = W.night, du = W.dusk;
    const day = [150, 188, 226], dusk = [238, 150, 100], night = [20, 28, 56];
    const a = U.mixRGB(day, dusk, clamp(du * 1.3, 0, 1));
    return U.mixRGB(a, night, clamp(n * 1.2 + (1 - d) * 0.3, 0, 1));
  }
  // 灯下的墙：夜里由灯照成暖色（不只是提亮）
  function litCSS(rgb, k, a) {
    const s0 = W.shade(rgb, 0), w = [rgb[0] * 0.88, rgb[1] * 0.64, rgb[2] * 0.42];
    const c = U.mixRGB(s0, w, clamp(k, 0, 1));
    return a == null ? 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')' : 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a + ')';
  }
  // 细麻布在灯下：仍是白的，只暖一点
  function paleCSS(rgb, k) {
    const s0 = W.shade(rgb, 0), w = [248, 232, 204];
    const c = U.mixRGB(s0, w, clamp(k, 0, 1) * 0.92);
    return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';
  }
  function drawRoom(ctx) {
    const A = W.lv.lspRoom;
    if (A < 0.005) return;
    SP || sprites();
    const G = roomGeo(), { ph, gb, gf, bx0, bx1, fx0, fx1, yc, yt } = G, l = 2;
    const nk = nightK(), lamp = lampLight(), lampEx = lamp * nk * 0.4, lk = lamp * nk;
    ctx.globalAlpha = A;
    // 屋外：左右两堵外墙（房子的厚度）与平顶；桌面上墙薄一些，好让出左边的经文
    const ow = at(0.12, 0.28) * ph, po = at(0.16, 0.34) * ph;
    ctx.fillStyle = css([176, 156, 124], l, 1, lampEx * 0.2);
    ctx.fillRect(fx0 - ow, yt - 0.28 * ph, ow, gf - yt + 0.28 * ph);
    ctx.fillRect(fx1, yt - 0.28 * ph, ow, gf - yt + 0.28 * ph);
    // 地：暖色的石板
    ctx.fillStyle = litCSS([150, 122, 92], lk * 0.62);
    ctx.beginPath();
    ctx.moveTo(bx0, gb - 1); ctx.lineTo(bx1, gb - 1);
    ctx.lineTo(fx1, gf); ctx.lineTo(fx0, gf); ctx.closePath(); ctx.fill();
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
    // 右墙上的门（犹大由此出去）
    const dA = [lerp(bx1, fx1, 0.12), lerp(bx1, fx1, 0.5)];
    const dTop = u => lerp(yc, yt, u) + (gb - yc) * 0.28;
    const dBot = u => lerp(gb, gf, u);
    const u0 = 0.12, u1 = 0.5;
    ctx.fillStyle = S.judasOut ? css([34, 34, 52], l, 1, 0.02) : litCSS([60, 44, 32], lk * 0.3);
    ctx.beginPath(); ctx.moveTo(dA[0], dTop(u0)); ctx.lineTo(dA[1], dTop(u1)); ctx.lineTo(dA[1], dBot(u1)); ctx.lineTo(dA[0], dBot(u0)); ctx.closePath(); ctx.fill();
    // 顶棚与梁
    ctx.fillStyle = litCSS([118, 92, 66], lk * 0.5);
    ctx.beginPath(); ctx.moveTo(fx0, yt); ctx.lineTo(fx1, yt); ctx.lineTo(bx1, yc); ctx.lineTo(bx0, yc); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([72, 54, 40], l, 0.8);
    ctx.lineWidth = Math.max(0.8, 0.05 * ph);
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) { const u = k / 6; ctx.moveTo(lerp(bx0, bx1, u), yc); ctx.lineTo(lerp(fx0, fx1, u), yt); }
    ctx.stroke();
    // 后墙
    ctx.fillStyle = litCSS(PLASTER, lk);
    ctx.fillRect(bx0, yc, bx1 - bx0, gb - yc);
    // 后墙下的一道护墙板
    ctx.fillStyle = litCSS([150, 122, 90], lk * 0.8, 0.6);
    ctx.fillRect(bx0, gb - 0.55 * ph, bx1 - bx0, 0.55 * ph);
    // 窗：看见外面的天
    const wc = windowCol();
    for (const u of [0.35, 0.65]) {
      const x = lerp(bx0, bx1, u), w = 0.36 * ph, y0 = yc + 0.32 * ph, y1 = yc + 1.22 * ph;
      ctx.fillStyle = litCSS([150, 126, 96], lk * 0.7);
      ctx.beginPath(); ctx.moveTo(x - w * 0.62, y1 + 0.06 * ph); ctx.lineTo(x - w * 0.62, y0 + w * 0.2); ctx.arc(x, y0 + w * 0.2, w * 0.62, Math.PI, 0); ctx.lineTo(x + w * 0.62, y1 + 0.06 * ph); ctx.closePath(); ctx.fill();
      ctx.fillStyle = U.rgb(wc[0], wc[1], wc[2]);
      ctx.beginPath(); ctx.moveTo(x - w * 0.5, y1); ctx.lineTo(x - w * 0.5, y0 + w * 0.2); ctx.arc(x, y0 + w * 0.2, w * 0.5, Math.PI, 0); ctx.lineTo(x + w * 0.5, y1); ctx.closePath(); ctx.fill();
      if (W.night > 0.4) {
        ctx.fillStyle = U.rgba(255, 246, 224, 0.8 * W.night);
        ctx.fillRect(x - w * 0.18, y0 + w * 0.45, Math.max(1, 0.03 * ph), Math.max(1, 0.03 * ph));
        ctx.fillRect(x + w * 0.2, y0 + w * 1.1, Math.max(1, 0.025 * ph), Math.max(1, 0.025 * ph));
      }
    }
    // 屋顶：平顶与女儿墙
    ctx.fillStyle = css([164, 142, 110], l, 1, lampEx * 0.1);
    ctx.fillRect(fx0 - po, yt - 0.32 * ph, fx1 - fx0 + po * 2, 0.34 * ph);
    ctx.fillStyle = css([236, 216, 180], l, 0.4 * dayA() + 0.1 * nk, 0.1);
    ctx.fillRect(fx0 - po, yt - 0.32 * ph, fx1 - fx0 + po * 2, Math.max(0.7, 0.04 * ph));
    ctx.fillStyle = css([150, 128, 98], l);
    ctx.fillRect(fx0 - po, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    ctx.fillRect(fx1 + po - 0.2 * ph, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    // 前面的两根柱
    ctx.fillStyle = litCSS([158, 136, 104], lk * 0.25);
    const pw = at(0.16, 0.24) * ph;
    ctx.fillRect(fx0 - pw, yt - 0.02 * ph, pw, gf - yt);
    ctx.fillRect(fx1, yt - 0.02 * ph, pw, gf - yt);
    // 挂灯的链与灯盏
    ctx.strokeStyle = css([60, 48, 40], l, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const p = lampPos(G, i); ctx.moveTo(p[0], yc - 0.25 * ph); ctx.lineTo(p[0], p[1] - 0.04 * ph); }
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const p = lampPos(G, i);
      ctx.fillStyle = css([150, 104, 70], l, 1, lampEx * 0.3);
      ctx.beginPath(); ctx.ellipse(p[0], p[1], 0.17 * ph, 0.065 * ph, 0, 0, TAU); ctx.fill();
    }
    // 灯光把屋里照暖
    const warm = lamp * (0.35 + 0.65 * nk) * A;
    if (warm > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        const k = lampOn(i);
        if (k < 0.01) continue;
        const p = lampPos(G, i), fl = 0.94 + 0.06 * Math.sin(W.t * 6 + i * 2) * (1 + 2 * W.lv.lspDraft);
        glowSp(ctx, SP.warm, p[0], p[1] + 0.6 * ph, 2.1 * ph * fl, k * warm * 0.3, 1.05);
        glowSp(ctx, SP.gold, p[0], p[1], 0.6 * ph, k * warm * 0.7);
      }
      glowSp(ctx, SP.warm, G.cx, gb + 0.1 * ph, (bx1 - bx0) * 0.55, warm * 0.2, 0.28);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = A;
    for (let i = 0; i < 3; i++) {
      const p = lampPos(G, i);
      flame(ctx, p[0] + 0.1 * ph, p[1] - 0.04 * ph, 0.2 * ph, lampOn(i) * A, i * 1.7, W.lv.lspDraft);
    }
    ctx.globalAlpha = 1;
  }
  // 灯光也落在人身上（在人之上轻轻一层暖光）
  // 出了大楼：整座房子压暗成夜里的剪影（在桌子之后画，盖住屋里的一切）
  function drawRoomDim(ctx) {
    const A = W.lv.lspRoom, D = W.lv.lspRoomDim;
    if (A < 0.005 || D < 0.01) return;
    const G = roomGeo(), { ph, gf, fx0, fx1, yt } = G;
    const po = at(0.16, 0.34) * ph;
    ctx.globalAlpha = A * D * 0.78;
    ctx.fillStyle = 'rgb(14,16,28)';
    ctx.fillRect(fx0 - po, yt - 0.32 * ph, fx1 - fx0 + po * 2, gf - yt + 0.32 * ph);
    ctx.fillRect(fx0 - po, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    ctx.fillRect(fx1 + po - 0.2 * ph, yt - 0.62 * ph, 0.2 * ph, 0.3 * ph);
    ctx.globalAlpha = 1;
  }
  function drawRoomWash(ctx) {
    const A = W.lv.lspRoom * (1 - W.lv.lspRoomDim), k = lampLight() * (0.3 + 0.7 * nightK()) * A;
    if (k < 0.01) return;
    SP || sprites();
    const G = roomGeo();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, G.cx, G.gb - 0.35 * G.ph, (G.bx1 - G.bx0) * 0.62, k * 0.2, 0.42);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 耶稣：人认出他，是因光与众人所向——胸中的光略亮，身周一层极淡的光（不是光环）
  function drawPresence(ctx) {
    const f = fig('jesus');
    if (!f || f.alpha < 0.05) return;
    SP || sprites();
    const q = figFoot(f), h = q[2];
    const low = f.pose === 'sit' || f.pose === 'kneel' || f.pose === 'pray' ? 0.66 : f.pose === 'lie' || f.pose === 'fall' ? 0.25 : 1;
    const g = clamp(f.glow || 0.3, 0, 1), nk = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.white, q[0], q[1] - h * low * 0.55, h * (0.4 + 0.25 * g), f.alpha * g * 0.3 * nk, 1.25);
    glowSp(ctx, SP.gold, q[0], q[1] - h * low * 0.6, h * 0.13, f.alpha * g * 0.6 * nk);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 长桌（低）：细麻布，前后两排人夹着它
  function tableGeo() {
    const ph = PH(2), c = X('mid'), x0 = X('tab0') * W.w, x1 = X('tab1') * W.w;
    const yF = vY(c, 0.17), th = 0.17 * ph, ts = 0.12 * ph;
    return { ph, cx: c * W.w, x0, x1, yF, th, ts, top: yF - th - ts * 0.5 };
  }
  function drawTable(ctx) {
    const A = W.lv.lspRoom;
    if (A < 0.005) return;
    const G = tableGeo(), { ph, x0, x1, yF, th, ts } = G, l = 2;
    const lampEx = lampLight() * nightK() * 0.45, lk = lampLight() * nightK();
    ctx.globalAlpha = A;
    // 桌下的影
    ctx.fillStyle = 'rgba(40,22,12,' + (0.35 * A).toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse((x0 + x1) / 2, yF + 0.02 * ph, (x1 - x0) * 0.54, 0.1 * ph, 0, 0, TAU); ctx.fill();
    // 桌面（往后收）
    ctx.fillStyle = litCSS([128, 94, 64], lk * 0.7);
    ctx.beginPath(); ctx.moveTo(x0, yF - th); ctx.lineTo(x1, yF - th); ctx.lineTo(x1 - 0.1 * ph, yF - th - ts); ctx.lineTo(x0 + 0.1 * ph, yF - th - ts); ctx.closePath(); ctx.fill();
    ctx.fillStyle = litCSS([92, 62, 40], lk * 0.45);
    ctx.fillRect(x0, yF - th, x1 - x0, th);
    // 细麻布
    const cl = W.lv.lspTable;
    if (cl > 0.01) {
      ctx.globalAlpha = A * cl;
      ctx.fillStyle = paleCSS(LINEN, lk);
      ctx.beginPath(); ctx.moveTo(x0 + 0.05 * ph, yF - th); ctx.lineTo(x1 - 0.05 * ph, yF - th); ctx.lineTo(x1 - 0.13 * ph, yF - th - ts * 0.9); ctx.lineTo(x0 + 0.13 * ph, yF - th - ts * 0.9); ctx.closePath(); ctx.fill();
      ctx.fillStyle = paleCSS([222, 214, 198], lk * 0.85);
      ctx.fillRect(x0 + 0.05 * ph, yF - th, x1 - x0 - 0.1 * ph, th * 0.55);
      // 布边的褶
      ctx.fillStyle = 'rgba(120,90,60,' + (0.25 * A * cl).toFixed(3) + ')';
      for (let k = 1; k < 9; k++) ctx.fillRect(lerp(x0, x1, k / 9), yF - th, Math.max(0.6, 0.02 * ph), th * 0.55);
      void lampEx;
    }
    ctx.globalAlpha = 1;
  }
  // 桌上的饼、盘、杯（在人之上画，故前面走过的人要让开）
  function clipFront(ctx, yRef) {
    const c = C();
    if (!c || !c.people) return false;
    let any = false;
    ctx.beginPath();
    ctx.rect(-10, -10, W.w + 20, W.h + 20);
    for (const p of c.people.values()) {
      if (!p._vis || p.alpha < 0.05 || p.layer !== 2 || !(p._y > yRef + 3)) continue;
      const h = p._h || 30, hw = (p.pose === 'sit' || p.pose === 'kneel' || p.pose === 'pray' ? 0.26 : 0.3) * h;
      ctx.rect(p._x - hw, p._y - h * 1.08, hw * 2, h * 1.12);
      any = true;
    }
    if (any) { ctx.save(); ctx.clip('evenodd'); }
    return any;
  }
  function loafAt(ctx, x, y, s, k, half) {
    const l = 2, lampEx = lampLight() * nightK() * 0.5;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([196, 150, 96], l, 1, lampEx + 0.1);
    ctx.beginPath();
    if (half === 0) ctx.ellipse(x, y, s, s * 0.42, 0, 0, TAU);
    else ctx.ellipse(x, y, s * 0.55, s * 0.42, 0, half < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, half < 0 ? Math.PI * 1.5 : Math.PI * 0.5);
    ctx.fill();
    ctx.fillStyle = css([236, 206, 150], l, 0.6, lampEx + 0.1);
    ctx.beginPath(); ctx.ellipse(x - s * 0.1 * (half || 0), y - s * 0.14, s * (half ? 0.3 : 0.6), s * 0.14, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function cupAt(ctx, x, y, s, k, glowK) {
    const l = 2, lampEx = lampLight() * nightK() * 0.5;
    ctx.globalAlpha = k;
    ctx.fillStyle = css(GOLD, l, 1, lampEx + 0.15);
    ctx.beginPath();
    ctx.moveTo(x - s * 0.42, y - s * 1.1); ctx.quadraticCurveTo(x - s * 0.4, y - s * 0.45, x - s * 0.08, y - s * 0.38);
    ctx.lineTo(x - s * 0.06, y - s * 0.1); ctx.lineTo(x - s * 0.3, y); ctx.lineTo(x + s * 0.3, y); ctx.lineTo(x + s * 0.06, y - s * 0.1);
    ctx.lineTo(x + s * 0.08, y - s * 0.38); ctx.quadraticCurveTo(x + s * 0.4, y - s * 0.45, x + s * 0.42, y - s * 1.1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 40, 44], l, 1, lampEx);
    ctx.beginPath(); ctx.ellipse(x, y - s * 1.1, s * 0.4, s * 0.1, 0, 0, TAU); ctx.fill();
    if (glowK > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.wine, x, y - s * 1.1, s * 2.4, glowK * k * 0.55);
      glowSp(ctx, SP.gold, x, y - s * 1.1, s * 0.9, glowK * k * 0.6);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawTableItems(ctx) {
    const A = W.lv.lspRoom * W.lv.lspTable * (1 - W.lv.lspRoomDim);
    if (A < 0.01) return;
    SP || sprites();
    const G = tableGeo(), ph = G.ph, y = G.top, s = 0.2 * ph;
    const clipped = clipFront(ctx, y);
    const bx = G.cx - at(0.012, 0.022) * W.w, dx = G.cx + at(0.001, 0.002) * W.w, cx = G.cx + at(0.013, 0.022) * W.w;
    // 盘子（蘸饼的盘，太 26:23）
    ctx.globalAlpha = A;
    ctx.fillStyle = css([176, 132, 92], 2, 1, lampLight() * nightK() * 0.5);
    ctx.beginPath(); ctx.ellipse(dx, y + 0.01 * ph, s * 0.9, s * 0.26, 0, 0, TAU); ctx.fill();
    if (S.loaf === 'table') loafAt(ctx, bx, y - s * 0.3, s, A, 0);
    if (S.cup === 'table' || S.cup === 'rest') cupAt(ctx, cx, y + 0.02 * ph, s * 1.05, A, S.cup === 'rest' ? 0.6 : 0.15);
    // 桌上的小灯
    const tl = [G.x0 + 0.3 * ph, G.x1 - 0.3 * ph];
    for (let i = 0; i < 2; i++) {
      ctx.globalAlpha = A;
      ctx.fillStyle = css([160, 110, 74], 2, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(tl[i], y, s * 0.55, s * 0.2, 0, 0, TAU); ctx.fill();
      const k = lampOn(i * 2) * A;
      flame(ctx, tl[i] + s * 0.4, y - s * 0.12, s * 0.8, k, 5 + i, W.lv.lspDraft);
      if (k > 0.01) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.warm, tl[i], y - s * 0.4, 0.9 * ph, k * 0.28 * (0.4 + 0.6 * nightK())); ctx.globalCompositeOperation = 'source-over'; }
    }
    ctx.globalAlpha = 1;
    if (clipped) ctx.restore();
  }
  // 耶稣手中的饼与杯
  function handPt() {
    const f = fig('jesus');
    const p = figPt('jesus', 0.9);
    if (!f || !p) return null;
    const d = f.fd || f.facing || 1;
    return [p[0] + d * 0.12 * PH(2), p[1] - 0.12 * PH(2)];
  }
  function drawHeld(ctx) {
    if (W.lv.lspRoom < 0.2 && S.loaf !== 'hands' && S.cup !== 'hands') return;
    const h = handPt();
    if (!h) return;
    SP || sprites();
    const s = 0.2 * PH(2);
    if (S.loaf === 'hands') {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, h[0], h[1], s * 3.2, 0.5 + 0.1 * Math.sin(W.t * 2));
      ctx.globalCompositeOperation = 'source-over';
      loafAt(ctx, h[0], h[1], s, 1, 0);
    } else if (S.loaf === 'broken' && W.lv.lspShared < 0.95) {
      const k = 1 - W.lv.lspShared;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, h[0], h[1], s * 3.4, 0.6 * k);
      ctx.globalCompositeOperation = 'source-over';
      loafAt(ctx, h[0] - s * 0.5, h[1], s, k, -1);
      loafAt(ctx, h[0] + s * 0.5, h[1], s, k, 1);
    }
    if (S.cup === 'hands') cupAt(ctx, h[0], h[1] + s * 0.6, s * 1.05, 1, 1);
  }
  // 洗脚的盆（在耶稣跪下的膝前）
  function drawBasin(ctx) {
    const k = W.lv.lspBasin;
    if (k < 0.01) return;
    const f = fig('jesus');
    if (!f) return;
    SP || sprites();
    const q = figFoot(f), h = q[2], d = f.fd || f.facing || 1;
    const x = q[0] + d * 0.3 * h, y = q[1] - 0.02 * h, w = 0.22 * h;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([150, 104, 64], 2, 1, 0.15);
    ctx.beginPath(); ctx.moveTo(x - w, y - w * 0.45); ctx.quadraticCurveTo(x - w * 0.9, y + w * 0.05, x, y + w * 0.05); ctx.quadraticCurveTo(x + w * 0.9, y + w * 0.05, x + w, y - w * 0.45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 176, 196], 2, 0.9, 0.25);
    ctx.beginPath(); ctx.ellipse(x, y - w * 0.45, w * 0.94, w * 0.18, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.pale, x, y - w * 0.45, w * 1.6, k * (0.22 + 0.1 * Math.sin(W.t * 3)) * (0.5 + 0.5 * nightK()), 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  犹大身边冷而暗的影（约 13:27 不画撒但的形像，只是一团渐渐退去的暗）
  // ════════════════════════════════════════════════════════════
  function drawShade(ctx) {
    const k = W.lv.lspShade;
    if (k < 0.01) return;
    const p = figPt('judas', 0.5);
    if (!p) return;
    SP || sprites();
    const h = PH(2);
    for (let i = 0; i < 4; i++) {
      const a = W.t * 0.4 + i * 1.6;
      glowSp(ctx, SP.dark, p[0] + Math.cos(a) * 0.2 * h, p[1] + Math.sin(a * 1.3) * 0.15 * h, h * (0.55 + 0.1 * i), k * 0.18);
      glowSp(ctx, SP.cold, p[0] + Math.sin(a) * 0.25 * h, p[1] - 0.2 * h + Math.cos(a) * 0.1 * h, h * 0.45, k * 0.1);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光：各人胸前的暖光、彼此相爱的丝线、父的家与道路、保惠师的柔光、天上的光
  // ════════════════════════════════════════════════════════════
  function present(ids) { return ids.filter(id => { const f = fig(id); return f && !f.dying && f.alpha > 0.2; }); }
  function drawAuras(ctx) {
    const k = W.lv.lspShared;
    if (k < 0.01) return;
    SP || sprites();
    const h = PH(2), outdoor = W.lv.lspRoom < 0.5 || W.lv.lspRoomDim > 0.5 || S.court;
    ctx.globalCompositeOperation = 'lighter';
    for (const id of present(ELEVEN)) {
      const f = fig(id);
      const p = figPt(id, 0.58);
      if (!p) continue;
      const fl = 0.9 + 0.1 * Math.sin(W.t * 1.3 + (RI[id] || 0));
      // 彼得三次不认主：他胸前的光随他的 glow 一次暗过一次（主看他之后又回来）
      const gk = id === 'peter' ? clamp((f.glow == null ? 0.3 : f.glow) / 0.3, 0.12, 1) : 1;
      glowSp(ctx, SP.warm, p[0], p[1], h * (outdoor ? 0.5 : 0.42) * fl, k * gk * f.alpha * (outdoor ? 0.34 : 0.26));
      glowSp(ctx, SP.gold, p[0], p[1], h * 0.13, k * gk * f.alpha * 0.55);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawLove(ctx) {
    const k = Math.max(W.lv.lspLove, W.lv.lspOne);
    if (k < 0.01) return;
    const ids = present(ELEVEN);
    const J = figPt('jesus', 0.62);
    if (!J) return;
    const h = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const pts = ids.map(id => [id, figPt(id, 0.58)]).filter(q => q[1]);
    // 每人都连到耶稣（向上拱起的光线）
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i][1];
      const mx = (p[0] + J[0]) / 2, my = Math.min(p[1], J[1]) - h * (0.5 + 0.25 * Math.abs(p[0] - J[0]) / Math.max(1, h * 3));
      const sh = 0.6 + 0.4 * Math.sin(W.t * 1.6 + i * 0.8);
      ctx.strokeStyle = U.rgba(255, 220, 160, k * 0.34 * sh);
      ctx.lineWidth = Math.max(0.8, 0.05 * h);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo(mx, my, J[0], J[1]); ctx.stroke();
      ctx.strokeStyle = U.rgba(255, 246, 220, k * 0.5 * sh);
      ctx.lineWidth = Math.max(0.5, 0.018 * h);
      ctx.stroke();
    }
    // 彼此相连：按左右排开，相邻的连起来
    const sorted = pts.slice().sort((a, b) => a[1][0] - b[1][0]);
    for (let i = 0; i + 1 < sorted.length; i++) {
      const a = sorted[i][1], b = sorted[i + 1][1];
      const sh = 0.6 + 0.4 * Math.sin(W.t * 1.2 + i);
      ctx.strokeStyle = U.rgba(255, 230, 180, k * 0.4 * sh);
      ctx.lineWidth = Math.max(0.6, 0.03 * h);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h * 0.28, b[0], b[1]); ctx.stroke();
    }
    ctx.lineCap = 'butt';
    SP || sprites();
    glowSp(ctx, SP.gold, J[0], J[1], h * 0.5, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 我父的家：高天上一层层发光的窗（许多住处）
  function houseGeo() {
    if (phone()) return { cx: W.w * 0.64, cy: W.h * 0.42, w: W.w * 0.56, rowH: W.h * 0.028 };
    return { cx: W.w * 0.735, cy: W.h * 0.2, w: W.w * 0.3, rowH: W.h * 0.042 };
  }
  const HOUSE_ROWS = [5, 7, 9];
  function drawHouse(ctx) {
    const k = W.lv.lspHouse;
    if (k < 0.01) return;
    SP || sprites();
    const G = houseGeo();
    const nk = 0.45 + 0.55 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, G.cx, G.cy, G.w * 0.62, k * 0.18 * nk, 0.42);
    let idx = 0;
    for (let r = 0; r < HOUSE_ROWS.length; r++) {
      const n = HOUSE_ROWS[r], y = G.cy - G.rowH * (1.2 - r * 1.1), rw = G.w * (0.46 + r * 0.25);
      const aw = rw / n * 0.46, ah = G.rowH * 0.62;
      for (let i = 0; i < n; i++) {
        const x = G.cx - rw / 2 + rw * (i + 0.5) / n;
        const kk = clamp(k * 1.6 - (idx / 21) * 0.6, 0, 1) * (0.8 + 0.2 * Math.sin(W.t * 0.9 + idx));
        idx++;
        if (kk < 0.01) continue;
        ctx.globalAlpha = kk * 0.85 * nk;
        ctx.fillStyle = 'rgba(255,226,160,0.9)';
        ctx.beginPath(); ctx.moveTo(x - aw / 2, y + ah / 2); ctx.lineTo(x - aw / 2, y - ah / 2 + aw / 2); ctx.arc(x, y - ah / 2 + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(x + aw / 2, y + ah / 2); ctx.closePath(); ctx.fill();
        glowSp(ctx, SP.warm, x, y, aw * 1.8, kk * 0.3 * nk);
      }
      // 每一层的一道光的地板
      ctx.globalAlpha = k * 0.35 * nk;
      ctx.fillStyle = 'rgba(255,236,190,1)';
      ctx.fillRect(G.cx - rw / 2, y + ah / 2 + 1, rw, Math.max(1, G.rowH * 0.06));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 道路：从耶稣所在之处升到父的家
  function wayCurve() {
    const J = figPt('jesus', 0.7), G = houseGeo();
    if (!J) return null;
    const ex = G.cx, ey = G.cy + G.rowH * 1.6;
    return { sx: J[0], sy: J[1], cx: lerp(J[0], ex, 0.25) + (phone() ? 0 : W.w * 0.02), cy: lerp(J[1], ey, 0.75), ex, ey };
  }
  const qpt = (C0, t) => { const u = 1 - t; return [u * u * C0.sx + 2 * u * t * C0.cx + t * t * C0.ex, u * u * C0.sy + 2 * u * t * C0.cy + t * t * C0.ey]; };
  function drawWay(ctx) {
    // 长出由 lspWay 管；淡去由 lspWayA 管：整条一起淡，不缩回成半截的光柱
    const k = W.lv.lspWay, WA = W.lv.lspWayA;
    if (k < 0.005 || WA < 0.01) return;
    const Cv = wayCurve();
    if (!Cv) return;
    SP || sprites();
    const h = PH(2), nk = (0.5 + 0.5 * nightK()) * WA;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const N = 40, end = Math.max(1, Math.round(N * clamp(k, 0, 1)));
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? U.rgba(255, 248, 226, 0.55 * nk) : U.rgba(255, 214, 150, 0.22 * nk);
      ctx.lineWidth = pass ? Math.max(0.8, 0.05 * h) : Math.max(2, 0.3 * h);
      ctx.beginPath();
      for (let i = 0; i <= end; i++) { const p = qpt(Cv, i / N); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    // 沿路上升的光点
    for (let i = 0; i < 9; i++) {
      const t = U.fract(W.t * 0.07 + i / 9);
      if (t > k) continue;
      const p = qpt(Cv, t);
      glowSp(ctx, SP.gold, p[0], p[1], h * 0.12, 0.8 * nk * Math.sin(Math.PI * t));
    }
    // 路的尽头：长的时候亮些，长成之后只留一点；淡去时更快地先没了
    const e = qpt(Cv, clamp(k, 0, 1));
    glowSp(ctx, SP.white, e[0], e[1], h * 0.3, 0.5 * nk * WA * (k < 0.99 ? 1 : 0.4));
    ctx.lineCap = 'butt';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 保惠师的应许：一片柔光自天降下，停在屋上（不是形像）
  function drawPeace(ctx) {
    const k = W.lv.lspPeace;
    if (k < 0.01) return;
    SP || sprites();
    const G = roomGeo(), w = (G.bx1 - G.bx0) * 1.1;
    const nk = 0.5 + 0.5 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * 0.32 * nk, 0, 1);
    ctx.drawImage(SP.soft, G.cx - w / 2, 0, w, G.gb);
    glowSp(ctx, SP.pale, G.cx, G.gb - G.ph * 1.2, w * 0.6, k * 0.2 * nk, 0.7);
    // 缓缓降下的微光
    for (let i = 0; i < 14; i++) {
      const u = U.fract(W.t * 0.05 + rt(i + 40));
      const x = G.cx + (rt(i + 60) - 0.5) * w * 0.9, y = lerp(W.h * 0.1, G.gb - G.ph * 0.8, u);
      glowSp(ctx, SP.white, x, y, G.ph * 0.07, k * 0.7 * nk * Math.sin(Math.PI * u));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 举目望天：天上的光落在耶稣身上（父从不显为形像）
  function drawGlory(ctx) {
    const k = W.lv.lspGlory;
    if (k < 0.01) return;
    const f = fig('jesus');
    if (!f) return;
    SP || sprites();
    const q = figFoot(f), h = q[2], w = h * 1.5;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * 0.5, 0, 1);
    ctx.drawImage(SP.col, q[0] - w / 2, 0, w, q[1] + h * 0.1);
    glowSp(ctx, SP.white, q[0], q[1] - h * 0.6, h * 1.1, k * 0.35);
    glowSp(ctx, SP.gold, q[0], q[1], h * 0.9, k * 0.3, 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 主转过身来看彼得
  function drawLook(ctx) {
    const k = W.lv.lspLook;
    if (k < 0.01) return;
    const a = figPt('jesus', 0.88), b = figPt('peter', 0.8);
    if (!a || !b) return;
    const h = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
    g.addColorStop(0, U.rgba(255, 240, 210, 0.5 * k)); g.addColorStop(1, U.rgba(255, 240, 210, 0.12 * k));
    ctx.strokeStyle = g;
    ctx.lineWidth = Math.max(1, 0.06 * h);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h * 0.3, b[0], b[1]); ctx.stroke();
    SP || sprites();
    glowSp(ctx, SP.gold, b[0], b[1], h * 0.35, k * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  葡萄树（约 15:5）：从门外的地里长出，枝子拱在众人头上
  // ════════════════════════════════════════════════════════════
  function vineGeo() {
    const h = PH(2);
    const bx = at(0.766, 0.955), by = vY(bx, 0.78);   // 根在门外（桌面：在右边的柱子外面）
    const lx = at(0.548, 0.44);
    const top = vY(X('mid'), 0.72) - h * 2.25;
    return { h, bx: bx * W.w, by, lx: lx * W.w, top };
  }
  // 藤的主干：从根往上，再向左拱过去；u ∈ [0,1]
  function vinePt(G, u) {
    const up = 0.22;
    if (u <= up) { const t = u / up; return [G.bx + Math.sin(t * 5) * G.h * 0.06, lerp(G.by, G.top + G.h * 0.3, t)]; }
    const t = (u - up) / (1 - up);
    const x = lerp(G.bx, G.lx, t);
    return [x, G.top + G.h * 0.3 * (1 - t) + Math.sin(t * Math.PI) * -G.h * 0.28 + Math.sin(t * 13) * G.h * 0.05];
  }
  function drawVine(ctx) {
    const k = W.lv.lspVine, VA = W.lv.lspVineA;
    if (k < 0.005 || VA < 0.01) return;
    SP || sprites();
    const G = vineGeo(), h = G.h, l = 2, nk = nightK();
    ctx.save();
    ctx.globalAlpha = VA;
    const N = 60, end = Math.max(1, Math.round(N * k));
    // 主干（木色，带光的边）
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? U.rgba(255, 230, 170, 0.35 + 0.35 * nk) : css([96, 70, 48], l, 1, 0.1);
      ctx.globalAlpha = VA;
      ctx.lineWidth = pass ? Math.max(0.6, 0.03 * h) : Math.max(1.4, 0.1 * h);
      ctx.beginPath();
      for (let i = 0; i <= end; i++) { const p = vinePt(G, i / N); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    // 枝子与叶
    const leaves = [];
    for (let j = 0; j < 16; j++) {
      const u = 0.18 + j * 0.052;
      if (u > k) break;
      const p = vinePt(G, u), s = j % 2 ? 1 : -1;
      const L = h * (0.35 + 0.2 * rt(j + 5)), ex = p[0] + (rt(j) - 0.5) * h * 0.5, ey = p[1] + s * L * 0.6;
      ctx.strokeStyle = css([96, 74, 50], l, 1, 0.05);
      ctx.lineWidth = Math.max(0.8, 0.04 * h);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.quadraticCurveTo((p[0] + ex) / 2 + h * 0.1, (p[1] + ey) / 2 - h * 0.1, ex, ey); ctx.stroke();
      leaves.push([ex, ey, j], [(p[0] + ex) / 2, (p[1] + ey) / 2 - h * 0.05, j + 30]);
    }
    ctx.lineCap = 'butt';
    ctx.fillStyle = css([74, 110, 60], l, 0.95, 0.12 * nk);
    ctx.beginPath();
    for (const q of leaves) { const r = h * (0.12 + 0.05 * rt(q[2] + 9)); ctx.moveTo(q[0] + r, q[1]); ctx.ellipse(q[0], q[1], r, r * 0.8, rt(q[2]) * 3, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = U.rgba(210, 240, 170, 0.18 + 0.2 * nk);
    ctx.beginPath();
    for (const q of leaves) { const r = h * 0.05; ctx.moveTo(q[0] + r, q[1] - r * 0.5); ctx.ellipse(q[0], q[1] - r * 0.5, r, r * 0.6, 0, 0, TAU); }
    ctx.fill();
    // 果子：一串串光（在各人头上）
    const fk = W.lv.lspFruit;
    if (fk > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      const ids = present(ELEVEN.concat(['jesus']));
      ids.forEach((id, i) => {
        const f = fig(id);
        if (!f) return;
        const x = f.nx * W.w;
        const u = clamp(0.22 + (1 - 0.22) * (G.bx - x) / Math.max(1, G.bx - G.lx), 0.22, 1);
        if (u > k) return;
        const p = vinePt(G, u);
        const kk = clamp(fk * 1.4 - i * 0.03, 0, 1) * VA;
        if (kk < 0.01) return;
        const cx = x, cy = p[1] + h * 0.14;
        glowSp(ctx, SP.wine, cx, cy + h * 0.1, h * 0.34, kk * 0.3);
        glowSp(ctx, SP.gold, cx, cy + h * 0.08, h * 0.2, kk * 0.3);
        // 一串葡萄：果粒由上而下渐少（倒三角），深红紫，每粒一点高光；上有一小段梗
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = kk;
        const r = Math.max(1.1, h * 0.036);
        ctx.strokeStyle = 'rgba(120,150,80,0.9)';
        ctx.lineWidth = Math.max(0.6, r * 0.35);
        ctx.beginPath(); ctx.moveTo(cx, p[1]); ctx.lineTo(cx, cy - r * 0.6); ctx.stroke();
        ctx.fillStyle = 'rgba(128,52,86,0.95)';
        ctx.beginPath();
        const rows = [3, 3, 2, 1];
        for (let row = 0; row < rows.length; row++) for (let j = 0; j < rows[row]; j++) {
          const gx = cx + (j - (rows[row] - 1) / 2) * r * 1.75 + (row % 2 ? r * 0.25 : 0), gy = cy + row * r * 1.5;
          ctx.moveTo(gx + r, gy); ctx.arc(gx, gy, r, 0, TAU);
        }
        ctx.fill();
        ctx.fillStyle = 'rgba(255,214,190,0.75)';
        ctx.beginPath();
        for (let row = 0; row < rows.length; row++) for (let j = 0; j < rows[row]; j++) {
          const gx = cx + (j - (rows[row] - 1) / 2) * r * 1.75 + (row % 2 ? r * 0.25 : 0), gy = cy + row * r * 1.5;
          ctx.moveTo(gx - r * 0.2 + r * 0.32, gy - r * 0.35); ctx.arc(gx - r * 0.2, gy - r * 0.35, r * 0.32, 0, TAU);
        }
        ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
      });
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  汲沦溪（桌面）与橄榄园
  // ════════════════════════════════════════════════════════════
  function drawBrook(ctx) {
    const xf = X('brook'), A = W.lv.lspGrove;
    if (xf < 0 || A < 0.01) return;
    const h = PH(2), l = 2, g = gY(2, xf), nk = nightK();
    ctx.globalAlpha = A;
    ctx.fillStyle = css([88, 74, 58], l);
    ctx.beginPath();
    const N = 14;
    for (let i = 0; i <= N; i++) { const t = i / N, y = lerp(g, W.h + 4, t), x = xf * W.w + Math.sin(t * 5 + 1) * h * 0.18 - (0.2 + 0.4 * t) * h; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const t = i / N, y = lerp(g, W.h + 4, t), x = xf * W.w + Math.sin(t * 5 + 1) * h * 0.18 + (0.2 + 0.4 * t) * h; ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([54, 78, 104], l, 1, 0.08);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const t = i / N, y = lerp(g + 1, W.h + 4, t), x = xf * W.w + Math.sin(t * 5 + 1) * h * 0.18 - (0.12 + 0.3 * t) * h; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const t = i / N, y = lerp(g + 1, W.h + 4, t), x = xf * W.w + Math.sin(t * 5 + 1) * h * 0.18 + (0.12 + 0.3 * t) * h; ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill();
    // 月光在水上的闪
    ctx.fillStyle = U.rgba(220, 232, 255, 0.25 + 0.4 * nk * W.lv.moon);
    for (let i = 0; i < 9; i++) {
      const t = U.fract(rt(i + 90) + W.t * 0.03), y = lerp(g + 2, W.h, t), x = xf * W.w + Math.sin(t * 5 + 1) * h * 0.18 + (rt(i + 91) - 0.5) * (0.2 + 0.4 * t) * h;
      ctx.fillRect(x, y, Math.max(1, (0.06 + 0.1 * t) * h), 1);
    }
    // 石头
    ctx.fillStyle = css([132, 120, 104], l);
    for (let i = 0; i < 4; i++) { const t = 0.2 + i * 0.2, y = lerp(g, W.h, t), x = xf * W.w + (i % 2 ? 1 : -1) * (0.3 + 0.4 * t) * h; ctx.beginPath(); ctx.ellipse(x, y, 0.08 * h * (1 + t), 0.05 * h * (1 + t), 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  // 橄榄树：[桌面 x, 手机 x, v, 大小, 组]
  //   'edge' 两处都有；'d-only' 只在桌面（常在）；'deep' 只在手机、随 lspGrove 显出；'dg' 只在桌面、随 lspGrove 显出（园子在大楼的地方）
  const OLIVES = [
    [0.766, 0.975, 0.02, 1.0, 'edge'], [0.8, 0.975, 0.1, 1.15, 'd-only'], [0.83, 0.975, 0.0, 1.0, 'd-only'], [0.862, 0.975, 0.08, 1.2, 'd-only'],
    [0.9, 0.975, 0.0, 1.05, 'd-only'], [0.935, 0.975, 0.14, 1.15, 'd-only'], [0.975, 0.975, 0.03, 1.1, 'd-only'],
    [-1, 0.46, 0.02, 0.95, 'deep'], [-1, 0.57, 0.1, 1.05, 'deep'], [-1, 0.68, 0.0, 1.0, 'deep'], [-1, 0.79, 0.06, 1.1, 'deep'], [-1, 0.9, 0.0, 0.95, 'deep'],
    [0.64, -1, 0.04, 1.0, 'dg'], [0.676, -1, 0.12, 1.12, 'dg'], [0.712, -1, 0.0, 1.05, 'dg'], [0.742, -1, 0.08, 0.95, 'dg'],
  ];
  function drawOlive(ctx, xf, v, s, A, seed) {
    const hm = PH(2), x = xf * W.w, g = vY(xf, v) + 2, H = 2.0 * hm * s * (1 + 0.35 * v);
    const sd = (W.night > 0.5 && W.lv.moon > 0.3 ? W.moon.x : W.core.x) < x ? -1 : 1;
    const sw = Math.sin(W.t * 0.5 + seed) * 0.01 * H;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([78, 66, 54], 2);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.4, 0.14 * hm * s);
    ctx.beginPath();
    ctx.moveTo(x, g); ctx.bezierCurveTo(x + 0.1 * hm * s, g - H * 0.2, x - 0.14 * hm * s, g - H * 0.3, x - 0.2 * hm * s, g - H * 0.5);
    ctx.moveTo(x + 0.02 * hm * s, g - H * 0.14); ctx.bezierCurveTo(x + 0.16 * hm * s, g - H * 0.28, x + 0.1 * hm * s, g - H * 0.4, x + 0.26 * hm * s, g - H * 0.52);
    ctx.stroke();
    ctx.lineWidth = Math.max(0.7, 0.05 * hm * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.2 * hm * s, g - H * 0.5); ctx.lineTo(x - 0.42 * hm * s, g - H * 0.6);
    ctx.moveTo(x + 0.26 * hm * s, g - H * 0.52); ctx.lineTo(x + 0.46 * hm * s, g - H * 0.6);
    ctx.stroke();
    ctx.lineCap = 'butt';
    const cy = g - H * 0.68, cw = H * 0.72, ch = H * 0.26;
    ctx.fillStyle = css([88, 104, 74], 2, 0.97);
    ctx.beginPath();
    for (let k = 0; k < 13; k++) {
      const a = (k / 12) * Math.PI, rr = 0.75 + 0.25 * hsh(k * 2.7 + seed * 13);
      const ex = x + sw + Math.cos(Math.PI - a) * cw * 0.62 * rr, ey = cy - Math.sin(a) * ch * 0.9 * rr + (hsh(k + 3 + seed) - 0.5) * ch * 0.3;
      const r0 = cw * (0.13 + 0.07 * hsh(k * 5.1 + 1 + seed));
      ctx.moveTo(ex + r0, ey); ctx.arc(ex, ey, r0, 0, TAU);
    }
    ctx.moveTo(x + sw + cw * 0.45, cy); ctx.ellipse(x + sw, cy, cw * 0.45, ch * 0.7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = css([176, 188, 156], 2, 0.45, 0.05 + 0.08 * nightK() * W.lv.moon);
    ctx.beginPath();
    for (let k = 0; k < 16; k++) {
      const a = Math.PI * (0.15 + 0.7 * hsh(k * 3.3 + 2 + seed)), rr = 0.45 + 0.5 * hsh(k * 1.9 + 7);
      const ex = x + sw + Math.cos(Math.PI - a) * cw * 0.6 * rr + sd * cw * 0.08, ey = cy - Math.sin(a) * ch * 1.05 * rr;
      const r0 = cw * (0.035 + 0.03 * hsh(k + 11 + seed));
      ctx.moveTo(ex + r0, ey); ctx.ellipse(ex, ey, r0, r0 * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([52, 62, 46], 2, 0.35);
    ctx.beginPath(); ctx.ellipse(x + sw - sd * cw * 0.15, cy + ch * 0.35, cw * 0.5, ch * 0.28, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawGrove(ctx) {
    const ph = phone();
    OLIVES.forEach((o, i) => {
      let A = 1, xf;
      if (ph) {
        if (o[4] === 'deep') A = W.lv.lspGrove; else if (o[4] === 'd-only' || o[4] === 'dg') return;
        xf = o[1];
      } else {
        if (o[4] === 'deep') return;
        if (o[4] === 'dg') A = W.lv.lspGrove;
        xf = o[0];
      }
      if (A < 0.01) return;
      drawOlive(ctx, xf, o[2], o[3], A, i * 1.7);
    });
  }
  // 客西马尼：耶稣俯伏的那块石头
  function drawRock(ctx) {
    const A = W.lv.lspGrove;
    if (A < 0.01) return;
    const xf = X('rock'), h = PH(2), x = xf * W.w, y = vY(xf, at(0.36, 0.2));
    ctx.globalAlpha = A;
    ctx.fillStyle = css([128, 116, 100], 2);
    ctx.beginPath(); ctx.moveTo(x - 0.5 * h, y); ctx.quadraticCurveTo(x - 0.46 * h, y - 0.34 * h, x - 0.05 * h, y - 0.38 * h); ctx.quadraticCurveTo(x + 0.4 * h, y - 0.36 * h, x + 0.52 * h, y); ctx.closePath(); ctx.fill();
    // 月光照在石头顶上（夜里也认得出这块石头）
    ctx.fillStyle = U.rgba(206, 214, 236, clamp((0.2 + 0.35 * nightK() * W.lv.moon) * A, 0, 1));
    ctx.beginPath(); ctx.ellipse(x - 0.12 * h, y - 0.3 * h, 0.3 * h, 0.06 * h, -0.1, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  大祭司的院子：左边是宅子的门（耶稣在那里），中间是院墙与炭火，右边是门楼（上有鸡）
  // ════════════════════════════════════════════════════════════
  function courtGeo() {
    const ph = PH(2), x0 = X('court0') * W.w, x1 = X('gate') * W.w, hx = X('house1') * W.w;
    const gb = gY(2, X('mid')), gf = vY(X('mid'), 0.55);
    return { ph, x0, x1, hx, gb, gf };
  }
  function drawCourt(ctx) {
    const A = W.lv.lspCourt;
    if (A < 0.005) return;
    SP || sprites();
    const G = courtGeo(), { ph, x0, x1, hx, gb, gf } = G, l = 2, fire = W.lv.lspFire, nk = nightK();
    const fireEx = fire * nk * 0.3;
    ctx.globalAlpha = A;
    // 院子的铺石
    ctx.fillStyle = css([150, 136, 114], l, 1, fireEx * 0.7);
    ctx.beginPath();
    ctx.moveTo(x0, gY(2, x0 / W.w)); for (let k = 1; k <= 10; k++) { const x = lerp(x0, x1, k / 10); ctx.lineTo(x, gY(2, x / W.w)); }
    ctx.lineTo(x1 + 0.3 * ph, gf); ctx.lineTo(x0 - 0.3 * ph, gf); ctx.closePath(); ctx.fill();
    // 院墙（后）
    ctx.fillStyle = css(STONE, l, 1, fireEx * 0.6);
    ctx.beginPath();
    for (let k = 0; k <= 10; k++) { const x = lerp(hx, x1, k / 10); const y = gY(2, x / W.w) - 1.35 * ph; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let k = 10; k >= 0; k--) { const x = lerp(hx, x1, k / 10); ctx.lineTo(x, gY(2, x / W.w) + 0.5); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([140, 122, 96], l, 0.5);
    ctx.lineWidth = Math.max(0.5, 0.02 * ph);
    ctx.beginPath();
    for (let r = 1; r < 4; r++) { for (let k = 0; k <= 10; k++) { const x = lerp(hx, x1, k / 10), y = gY(2, x / W.w) - 1.35 * ph * r / 4; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); } }
    ctx.stroke();
    ctx.fillStyle = css([226, 210, 180], l, 0.35 * dayA() + 0.1, 0.1);
    ctx.fillRect(hx, gY(2, (hx + x1) / 2 / W.w) - 1.4 * ph, x1 - hx, Math.max(0.8, 0.06 * ph));
    // 宅子（左）：高墙、门、门上的灯
    const hy = gY(2, (x0 + hx) / 2 / W.w), hh = 3.0 * ph;
    ctx.fillStyle = css([196, 176, 142], l, 1, 0.05);
    ctx.fillRect(x0 - 0.2 * ph, hy - hh, hx - x0 + 0.2 * ph, hh + 0.4 * ph);
    ctx.fillStyle = css([160, 140, 110], l);
    ctx.fillRect(x0 - 0.34 * ph, hy - hh - 0.26 * ph, hx - x0 + 0.5 * ph, 0.28 * ph);
    const dx = (x0 + hx) / 2, dw = Math.min(0.42 * ph, (hx - x0) * 0.28), dh = 1.5 * ph;
    ctx.fillStyle = css([46, 34, 28], l, 1, 0.1 * nk);
    ctx.beginPath(); ctx.moveTo(dx - dw, hy); ctx.lineTo(dx - dw, hy - dh + dw); ctx.arc(dx, hy - dh + dw, dw, Math.PI, 0); ctx.lineTo(dx + dw, hy); ctx.closePath(); ctx.fill();
    // 台阶
    ctx.fillStyle = css([170, 152, 124], l);
    ctx.fillRect(dx - dw * 2.2, hy - 0.08 * ph, dw * 4.4, 0.12 * ph);
    // 窗里的灯
    ctx.fillStyle = U.rgba(255, 196, 112, 0.2 + 0.7 * nk);
    for (const u of [0.18, 0.82]) ctx.fillRect(lerp(x0, hx, u) - 0.06 * ph, hy - 2.3 * ph, Math.max(1, 0.14 * ph), Math.max(1.4, 0.26 * ph));
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, dx, hy - dh * 0.6, 1.3 * ph, A * (0.15 + 0.35 * nk));
    glowSp(ctx, SP.gold, dx + dw * 1.3, hy - dh - 0.1 * ph, 0.35 * ph, A * (0.3 + 0.5 * nk));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = A;
    flame(ctx, dx + dw * 1.3, hy - dh - 0.06 * ph, 0.16 * ph, A, 7, 0);
    // 门楼（右）：两根门柱与门楣
    const gx = x1, gy = gY(2, gx / W.w), pw = 0.24 * ph, gh = 2.0 * ph, gw = 0.62 * ph;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([176, 156, 124], l, 1, fireEx * 0.3);
    ctx.fillRect(gx - gw - pw, gy - gh, pw, gh + 0.2 * ph);
    ctx.fillRect(gx + gw, gy - gh, pw, gh + 0.2 * ph);
    ctx.fillStyle = css([158, 138, 108], l);
    ctx.fillRect(gx - gw - pw * 1.4, gy - gh - 0.24 * ph, gw * 2 + pw * 2.8, 0.26 * ph);
    ctx.fillStyle = css([236, 216, 184], l, 0.35 * dayA() + 0.1, 0.1);
    ctx.fillRect(gx - gw - pw * 1.4, gy - gh - 0.24 * ph, gw * 2 + pw * 2.8, Math.max(0.7, 0.04 * ph));
    ctx.globalAlpha = 1;
    drawRooster(ctx, A);
  }
  // 门楼上的鸡：站在右门柱顶上（s = 鸡的大小）
  function roosterGeo() {
    const G = courtGeo(), ph = G.ph, gx = G.x1, gy = gY(2, gx / W.w);
    const x = gx + 0.62 * ph + 0.24 * ph * 0.5, y = gy - 2.0 * ph - 0.24 * ph, s = PH(2) * 0.45;
    return { x, y, s, hx: x - s * 0.45, hy: y - s * 1.05 };
  }
  function crowUp() { const crow = FXL.find(e => e.type === 'crow'); return crow ? Math.sin(Math.PI * clamp(crow.t / crow.dur, 0, 1)) : 0; }
  // 门楼上的鸡（公鸡的剪影：冠、尾；鸡叫时昂首张口，火光与门上的灯照亮它的边）
  function drawRooster(ctx, A) {
    const k = W.lv.lspRooster * A;
    if (k < 0.01) return;
    SP || sprites();
    const R = roosterGeo(), x = R.x, y = R.y, s = R.s, l = 2;
    const up = crowUp(), nk = nightK();
    // 背后一团暖光（叫的时候更亮），好在夜空里认出它
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, x - s * 0.1, y - s * 0.7, s * (1.5 + 0.8 * up), k * (0.1 + 0.1 * nk + 0.35 * up));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = k;
    ctx.fillStyle = css([92, 64, 48], l, 1, 0.1);
    // 身
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.55, s * 0.5, s * 0.36, -0.15, 0, TAU); ctx.fill();
    // 尾
    ctx.beginPath(); ctx.moveTo(x + s * 0.3, y - s * 0.7); ctx.quadraticCurveTo(x + s * 0.95, y - s * 1.45, x + s * 0.85, y - s * 0.45); ctx.quadraticCurveTo(x + s * 0.7, y - s * 0.7, x + s * 0.3, y - s * 0.45); ctx.closePath(); ctx.fill();
    // 颈与头（鸡叫时昂起）
    const hx = R.hx - up * s * 0.05, hy = R.hy - up * s * 0.25;
    ctx.beginPath(); ctx.moveTo(x - s * 0.2, y - s * 0.8); ctx.quadraticCurveTo(x - s * 0.5, y - s * 0.9, hx, hy + s * 0.1); ctx.lineTo(hx + s * 0.18, hy + s * 0.25); ctx.lineTo(x - s * 0.05, y - s * 0.6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(hx, hy, s * 0.15, 0, TAU); ctx.fill();
    // 暖色的边（火光、门上的灯）
    ctx.strokeStyle = U.rgba(255, 190, 120, clamp((0.25 + 0.2 * nk + 0.45 * up) * k, 0, 1));
    ctx.lineWidth = Math.max(0.8, s * 0.07);
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.55, s * 0.5, s * 0.36, -0.15, Math.PI * 0.95, Math.PI * 1.75); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx, hy, s * 0.15, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.3, y - s * 0.7); ctx.quadraticCurveTo(x + s * 0.95, y - s * 1.45, x + s * 0.85, y - s * 0.45); ctx.stroke();
    // 喙
    ctx.fillStyle = css([210, 170, 90], l, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(hx - s * 0.12, hy - s * 0.02); ctx.lineTo(hx - s * 0.32, hy - s * (0.02 + up * 0.08)); ctx.lineTo(hx - s * 0.12, hy + s * 0.05); ctx.closePath(); ctx.fill();
    // 冠与肉垂
    ctx.fillStyle = css([196, 58, 48], l, 1, 0.15);
    ctx.beginPath(); ctx.ellipse(hx + s * 0.02, hy - s * 0.16, s * 0.12, s * 0.07, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx - s * 0.08, hy + s * 0.14, s * 0.04, s * 0.07, 0, 0, TAU); ctx.fill();
    // 腿
    ctx.strokeStyle = css([180, 140, 80], l, 1, 0.1);
    ctx.lineWidth = Math.max(0.6, s * 0.06);
    ctx.beginPath(); ctx.moveTo(x - s * 0.1, y - s * 0.25); ctx.lineTo(x - s * 0.12, y); ctx.moveTo(x + s * 0.1, y - s * 0.25); ctx.lineTo(x + s * 0.12, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 炭火（约 18:18）：一圈石头，红的炭，火苗在人前
  function fireGeo() { const xf = X('fire'); return { x: xf * W.w, y: vY(xf, 0.3), ph: PH(2) }; }
  function drawFirePit(ctx) {
    const A = W.lv.lspCourt;
    if (A < 0.01) return;
    const G = fireGeo(), { x, y, ph } = G, l = 2;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([110, 100, 88], l);
    for (let i = 0; i < 7; i++) { const a = Math.PI * (i / 6); ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 0.32 * ph, y - Math.sin(a) * 0.06 * ph, 0.08 * ph, 0.05 * ph, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = U.rgba(255, 110, 48, 0.4 + 0.5 * W.lv.lspFire * A);
    ctx.beginPath(); ctx.ellipse(x, y - 0.02 * ph, 0.24 * ph, 0.06 * ph, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawFireLight(ctx) {
    const A = W.lv.lspCourt, k = W.lv.lspFire * A;
    if (k < 0.01) return;
    SP || sprites();
    const G = fireGeo(), { x, y, ph } = G, nk = 0.45 + 0.55 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.9 + 0.1 * Math.sin(W.t * 9) * Math.sin(W.t * 5.3);
    glowSp(ctx, SP.warm, x, y - 0.4 * ph, 2.4 * ph * fl, k * 0.34 * nk, 0.7);
    glowSp(ctx, SP.ember, x, y - 0.1 * ph, 0.8 * ph, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 3; i++) flame(ctx, x + (i - 1) * 0.12 * ph, y - 0.03 * ph, (0.3 - Math.abs(i - 1) * 0.08) * ph, k * 0.95, 20 + i * 3, 0);
    // 火星
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const u = U.fract(W.t * 0.35 + rt(i + 200));
      glowSp(ctx, SP.ember, x + (rt(i + 210) - 0.5) * 0.4 * ph + Math.sin(W.t * 2 + i) * 0.05 * ph, y - 0.2 * ph - u * 1.3 * ph, 0.04 * ph, k * (1 - u) * 0.9 * nk);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬即逝的画面效果
  // ════════════════════════════════════════════════════════════
  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const h = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'mote') {
        const a = typeof e.from === 'string' ? (e.from === 'hand' ? handPt() : figPt(e.from, 0.7)) : e.from;
        const b = typeof e.to === 'string' ? figPt(e.to, 0.6) : e.to;
        if (!a || !b) continue;
        const t = U.easeInOut ? U.easeInOut(q) : q;
        const x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t) - Math.sin(Math.PI * t) * h * 0.5;
        glowSp(ctx, SP.gold, x, y, h * 0.14, 0.9 * (1 - Math.max(0, q - 0.85) / 0.15));
        glowSp(ctx, e.rgb && e.rgb[1] < 150 ? SP.wine : SP.warm, x, y, h * 0.3, 0.4 * (1 - Math.max(0, q - 0.85) / 0.15));
      } else if (e.type === 'crow') {
        // 鸡叫：从喙上一圈圈荡开的声波（向左、向城里）
        const R = roosterGeo(), x = R.hx - R.s * 0.3, y = R.hy - R.s * 0.2;
        for (let i = 0; i < 4; i++) {
          const qq = clamp(q * 1.25 - i * 0.12, 0, 1);
          if (qq <= 0) continue;
          const r = h * (0.25 + qq * 2.2), a = (1 - qq) * 0.85 * (1 - i * 0.15);
          ctx.strokeStyle = U.rgba(255, 238, 205, a);
          ctx.lineWidth = Math.max(1.2, 0.05 * h);
          ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 0.78, Math.PI * 1.22); ctx.stroke();
        }
        glowSp(ctx, SP.warm, x, y, h * 0.5, 0.5 * Math.sin(Math.PI * q));
      } else if (e.type === 'heal') {
        const p = figPt(e.id, 0.9);
        if (!p) continue;
        glowSp(ctx, SP.gold, p[0], p[1], h * (0.2 + 0.4 * q), 0.9 * Math.sin(Math.PI * q));
        glowSp(ctx, SP.white, p[0], p[1], h * 0.12, 0.8 * Math.sin(Math.PI * q));
      } else if (e.type === 'iam') {
        const p = figPt('jesus', 0.55);
        if (!p) continue;
        glowSp(ctx, SP.white, p[0], p[1], h * (0.6 + 3.2 * q), 0.55 * (1 - q));
        glowSp(ctx, SP.gold, p[0], p[1], h * (0.4 + 1.2 * q), 0.6 * (1 - q));
      } else if (e.type === 'glint') {
        const p = figPt(e.id, e.frac || 0.8);
        if (!p) continue;
        glowSp(ctx, SP.white, p[0] + (e.dx || 0) * h, p[1], h * 0.25, 0.9 * (1 - q));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的模块
  // ════════════════════════════════════════════════════════════
  const LBL = [
    ['大楼', () => W.lv.lspRoom > 0.4 ? (G => [G.cx, G.yt - 0.3 * G.ph])(roomGeo()) : null],
    ['饼', () => W.lv.lspRoom > 0.4 && W.lv.lspRoomDim < 0.5 && W.lv.lspTable > 0.4 ? (G => [G.cx - at(0.012, 0.022) * W.w, G.top - 0.1 * G.ph])(tableGeo()) : null],
    ['杯', () => W.lv.lspRoom > 0.4 && W.lv.lspRoomDim < 0.5 && W.lv.lspTable > 0.4 ? (G => [G.cx + at(0.013, 0.022) * W.w, G.top - 0.15 * G.ph])(tableGeo()) : null],
    ['灯', () => W.lv.lspRoom > 0.4 && W.lv.lspLamps > 0.3 ? lampPos(roomGeo(), 1) : null],
    ['盆', () => { if (W.lv.lspBasin < 0.4) return null; const f = fig('jesus'); if (!f) return null; const q = figFoot(f); return [q[0] + (f.fd || 1) * 0.3 * q[2], q[1] - 0.1 * q[2]]; }],
    ['我父的家', () => W.lv.lspHouse > 0.4 ? (G => [G.cx, G.cy])(houseGeo()) : null],
    ['葡萄树', () => W.lv.lspVine > 0.5 && W.lv.lspVineA > 0.5 ? (G => vinePt(G, 0.5))(vineGeo()) : null],
    ['汲沦溪', () => X('brook') > 0 && W.lv.lspGrove > 0.4 ? [X('brook') * W.w, vY(X('brook'), 0.5)] : null],
    ['橄榄树', () => (phone() ? W.lv.lspGrove > 0.4 : true) ? [at(0.9, 0.68) * W.w, vY(at(0.9, 0.68), 0) - 1.4 * PH(2)] : null],
    ['客西马尼', () => W.lv.lspGrove > 0.4 ? [X('rock') * W.w, vY(X('rock'), at(0.36, 0.2)) - 0.3 * PH(2)] : null],
    ['耶路撒冷', () => [lerp(X('city0'), X('city1'), 0.25) * W.w, gY(1, lerp(X('city0'), X('city1'), 0.25)) - PH(1)]],
    ['殿', () => [X('temple') * W.w, gY(1, X('temple')) - 2.6 * PH(1)]],
    ['炭火', () => W.lv.lspCourt > 0.4 ? (G => [G.x, G.y - 0.3 * G.ph])(fireGeo()) : null],
    ['鸡', () => W.lv.lspCourt > 0.4 && W.lv.lspRooster > 0.4 ? (R => [R.x, R.y - R.s * 0.6])(roosterGeo()) : null],
    ['大祭司的院子', () => W.lv.lspCourt > 0.4 ? (G => [G.hx + (G.x1 - G.hx) * 0.5, G.gb - 1.5 * G.ph])(courtGeo()) : null],
  ];
  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      settleFlights(f, false);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawHouse(ctx); return; }
      if (pass === 'mid') { drawCity(ctx); drawTorchFar(ctx); return; }
      if (pass === 'near') {
        drawBrook(ctx);
        drawGrove(ctx);
        drawRock(ctx);
        drawRoom(ctx);
        drawTable(ctx);
        drawRoomDim(ctx);
        drawCourt(ctx);
        drawFirePit(ctx);
        drawVine(ctx);
        return;
      }
      if (pass === 'air') {
        drawRoomWash(ctx);
        drawTableItems(ctx);
        drawBasin(ctx);
        drawHeld(ctx);
        drawShade(ctx);
        drawAuras(ctx);
        drawPresence(ctx);
        drawLove(ctx);
        drawWay(ctx);
        drawPeace(ctx);
        drawGlory(ctx);
        drawFireLight(ctx);
        drawLook(ctx);
        drawFX(ctx);
      }
    },
    draw() {},
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; settleFlights(0, true); },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const [label, fn] of LBL) {
        const p = U.safe('supper.pick', fn);
        if (!p) continue;
        const d = Math.hypot(p[0] - x, p[1] - y);
        if (d < r && (!best || d < best.d)) best = { label, x: p[0], y: p[1] - 8, d };
      }
      return best;
    },
    sig() { return { loaf: S.loaf, cup: S.cup, washed: S.washed, judas: S.judasOut, fruit: S.fruit, court: S.court, crowed: S.crowed }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：除酵节的下午，城外的橄榄园（太 26:17）
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 春天的犹大山地：青草、零星的花；地上的走兽都不在城里
    W.set('bare', 0.18, true); W.set('bloom', 0.4, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.75, herbs: 0.4, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      lspRoom: 1, lspRoomDim: 0, lspLamps: 0, lspTable: 0, lspCity: 0, lspBasin: 0, lspDraft: 0, lspShade: 0, lspShared: 0, lspLove: 0, lspHouse: 0, lspWay: 0, lspWayA: 1, lspPeace: 0,
      lspVine: 0, lspFruit: 0, lspVineA: 1, lspGlory: 0, lspOne: 0, lspGrove: 0, lspTorchFar: 0, lspCourt: 0, lspFire: 0, lspLook: 0, lspRooster: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.goTo(0.7, 0, true);
    const lx = W.w * 0.42, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);   // 加利利海是一个湖：没有大鱼（与相邻的福音各幕一致）
    W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    FXL.length = 0;
    S = fresh();
    const c = C();
    c.clear({ fade: false });
    ['jesus'].concat(TWELVE).forEach(id => {
      const q = startPos(id);
      addPerson(id, q.x, q.v, { facing: id === 'jesus' ? -1 : (q.x > startPos('jesus').x ? -1 : 1), glow: id === 'jesus' ? 0.34 : id === 'peter' || id === 'john' ? 0.22 : 0.18 });
    });
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每句话的经文不过四行，它的故事约三十秒：一按一放，便是一步）
  // ════════════════════════════════════════════════════════════
  const MT = s => '马太福音 ' + s, JN = s => '约翰福音 ' + s, LK = s => '路加福音 ' + s;
  const INTRO = [
    { text: '除酵节，须宰逾越羊羔的那一天到了。', ref: LK('22:7'), hold: 5 },
    { text: '逾越节以前，耶稣知道自己离世归父的时候到了。<br>他既然爱世间属自己的人，就爱他们到底。', ref: JN('13:1'), hold: 7 },
  ];
  const V1 = [
    { text: '耶稣说：「你们进城去，到某人那里，对他说：<br>『夫子说：我的时候快到了，我与门徒要在你家里守逾越节。』」', ref: MT('26:18'), hold: 7.5 },
    { text: '门徒遵着耶稣所吩咐的就去预备了逾越节的筵席。<br>到了晚上，耶稣和十二个门徒坐席。', ref: MT('26:19–20'), hold: 7 },
    { text: '耶稣对他们说：「我很愿意在受害以先和你们吃这逾越节的筵席。」', ref: LK('22:15'), hold: 6 },
  ];
  const V2 = [
    { text: '耶稣……就离席站起来，脱了衣服，拿一条手巾束腰，<br>随后把水倒在盆里，就洗门徒的脚，并用自己所束的手巾擦干。', ref: JN('13:3–5'), hold: 8 },
    { text: '挨到西门‧彼得，彼得对他说：「主啊，你洗我的脚吗？」……<br>彼得说：「你永不可洗我的脚！」耶稣说：「我若不洗你，你就与我无分了。」', ref: JN('13:6–8'), hold: 8 },
    { text: '耶稣洗完了他们的脚，就穿上衣服，又坐下，对他们说：<br>「……我给你们作了榜样，叫你们照着我向你们所做的去做。」', ref: JN('13:12–15'), hold: 7.5 },
  ];
  const V3 = [
    { text: '正吃的时候，耶稣说：「我实在告诉你们，你们中间有一个人要卖我了。」<br>他们就甚忧愁，一个一个地问他说：「主，是我吗？」', ref: MT('26:21–22'), hold: 8 },
    { text: '耶稣回答说：「我蘸一点饼给谁，就是谁。」<br>耶稣就蘸了一点饼，递给加略人西门的儿子犹大。', ref: JN('13:26'), hold: 7 },
    { text: '犹大受了那点饼，立刻就出去。那时候是夜间了。', ref: JN('13:30'), hold: 6 },
  ];
  const V4 = [
    { text: '他们吃的时候，耶稣拿起饼来，祝福，就擘开，递给门徒，<br>说：「你们拿着吃，这是我的身体。」', ref: MT('26:26'), hold: 7.5 },
    { text: '又拿起杯来，祝谢了，递给他们，说：「你们都喝这个；<br>因为这是我立约的血，为多人流出来，使罪得赦。」', ref: MT('26:27–28'), hold: 8 },
    { text: '「但我告诉你们，从今以后，我不再喝这葡萄汁，<br>直到我在我父的国里同你们喝新的那日子。」', ref: MT('26:29'), hold: 6.5 },
  ];
  const V5 = [
    { text: '「我赐给你们一条新命令，乃是叫你们彼此相爱；我怎样爱你们，你们也要怎样相爱。<br>你们若有彼此相爱的心，众人因此就认出你们是我的门徒了。」', ref: JN('13:34–35'), hold: 9 },
    { text: '彼得说：「主啊，我为什么现在不能跟你去？我愿意为你舍命！」<br>耶稣说：「你愿意为我舍命吗？我实实在在地告诉你，鸡叫以先，你要三次不认我。」', ref: JN('13:37–38'), hold: 9 },
  ];
  const V6 = [
    { text: '「你们心里不要忧愁；你们信神，也当信我。<br>在我父的家里有许多住处……我去原是为你们预备地方去。」', ref: JN('14:1–2'), hold: 7.5 },
    { text: '多马对他说：「主啊，我们不知道你往哪里去，怎么知道那条路呢？」<br>耶稣说：「我就是道路、真理、生命；若不藉着我，没有人能到父那里去。」', ref: JN('14:5–6'), hold: 8.5 },
    { text: '耶稣对他说：「腓力，我与你们同在这样长久，你还不认识我吗？<br>人看见了我，就是看见了父……」', ref: JN('14:9'), hold: 7 },
  ];
  const V7 = [
    { text: '「但保惠师，就是父因我的名所要差来的圣灵，<br>他要将一切的事指教你们，并且要叫你们想起我对你们所说的一切话。」', ref: JN('14:26'), hold: 7.5 },
    { text: '「我留下平安给你们；我将我的平安赐给你们。我所赐的，不像世人所赐的。<br>你们心里不要忧愁，也不要胆怯。」', ref: JN('14:27'), hold: 8 },
    { text: '他们唱了诗，就出来往橄榄山去。', ref: MT('26:30'), hold: 5.5 },
  ];
  const V8 = [
    { text: '「我是真葡萄树，我父是栽培的人……<br>我是葡萄树，你们是枝子。常在我里面的，我也常在他里面，这人就多结果子……」', ref: JN('15:1–5'), hold: 8 },
    { text: '「我爱你们，正如父爱我一样；你们要常在我的爱里……<br>人为朋友舍命，人的爱心没有比这个大的。」', ref: JN('15:9–13'), hold: 7.5 },
    { text: '「我将这些事告诉你们，是要叫你们在我里面有平安。<br>在世上，你们有苦难；但你们可以放心，我已经胜了世界。」', ref: JN('16:33'), hold: 7.5 },
  ];
  const V9 = [
    { text: '耶稣说了这话，就举目望天，说：<br>「父啊，时候到了，愿你荣耀你的儿子，使儿子也荣耀你……」', ref: JN('17:1'), hold: 7 },
    { text: '「……使他们都合而为一。正如你父在我里面，我在你里面，<br>使他们也在我们里面，叫世人可以信你差了我来。」', ref: JN('17:21'), hold: 7.5 },
    { text: '耶稣说了这话，就同门徒出去，过了汲沦溪。<br>在那里有一个园子，他和门徒进去了。', ref: JN('18:1'), hold: 6.5 },
  ];
  const V10 = [
    { text: '于是带着彼得和西庇太的两个儿子同去，就忧愁起来，极其难过，<br>便对他们说：「我心里甚是忧伤，几乎要死；你们在这里等候，和我一同警醒。」', ref: MT('26:37–38'), hold: 8.5 },
    { text: '他就稍往前走，俯伏在地，祷告说：「我父啊，倘若可行，求你叫这杯离开我。<br>然而，不要照我的意思，只要照你的意思。」', ref: MT('26:39'), hold: 8.5 },
    { text: '有一位天使从天上显现，加添他的力量。', ref: LK('22:43'), hold: 5.5 },
  ];
  const V11 = [
    { text: '来到门徒那里，见他们睡着了，就对彼得说：「怎么样？你们不能同我警醒片时吗？<br>总要警醒祷告，免得入了迷惑。你们心灵固然愿意，肉体却软弱了。」', ref: MT('26:40–41'), hold: 9 },
    { text: '第二次又去祷告说：「我父啊，这杯若不能离开我，必要我喝，就愿你的意旨成全。」', ref: MT('26:42'), hold: 7 },
    { text: '于是来到门徒那里，对他们说：「……时候到了，人子被卖在罪人手里了。<br>起来！我们走吧。看哪，卖我的人近了！」', ref: MT('26:45–46'), hold: 7.5 },
  ];
  const V12 = [
    { text: '说话之间，那十二个门徒里的犹大来了，并有许多人带着刀棒……<br>犹大随即到耶稣跟前，说：「请拉比安」，就与他亲嘴。', ref: MT('26:47–49'), hold: 8 },
    { text: '耶稣知道将要临到自己的一切事，就出来对他们说：「你们找谁？」<br>他们回答说：「找拿撒勒人耶稣。」耶稣说：「我就是！」', ref: JN('18:4–5'), hold: 8 },
    { text: '耶稣一说「我就是」，他们就退后倒在地上。', ref: JN('18:6'), hold: 5.5 },
  ];
  const V13 = [
    { text: '西门‧彼得带着一把刀，就拔出来，将大祭司的仆人砍了一刀，<br>削掉他的右耳；那仆人名叫马勒古。', ref: JN('18:10'), hold: 7 },
    { text: '耶稣对他说：「收刀入鞘吧！凡动刀的，必死在刀下……」', ref: MT('26:52'), hold: 5.5 },
    { text: '耶稣说：「到了这个地步，由他们吧！」就摸那人的耳朵，把他治好了。', ref: LK('22:51'), hold: 6 },
    { text: '……当下，门徒都离开他，逃走了。', ref: MT('26:56'), hold: 4.5 },
  ];
  const V14 = [
    { text: '彼得在外面院子里坐着，有一个使女前来，说：「你素来也是同那加利利人耶稣一伙的。」<br>彼得在众人面前却不承认，说：「我不知道你说的是什么！」', ref: MT('26:69–70'), hold: 8.5 },
    { text: '过了不多的时候，旁边站着的人前来，对彼得说：「你真是他们一党的，你的口音把你露出来了。」<br>彼得就发咒起誓地说：「我不认得那个人。」立时，鸡就叫了。', ref: MT('26:73–74'), hold: 8.5 },
    { text: '主转过身来看彼得，彼得便想起主对他所说的话：<br>「今日鸡叫以先，你要三次不认我。」他就出去痛哭。', ref: LK('22:61–62'), hold: 8 },
  ];

  const STAGES = [
    // ── 1 · 太 26:17–20 · 路 22:15 预备逾越节的筵席 ──────────────
    {
      kind: 'promise', utter: '我的时候快到了', cmd: 'prepare 逾越节 --room 大楼 --guests 12', ref: '26:18',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0.3, b => {
            // 彼得、约翰先进城去预备（路 22:8）
            moveTo(b, 'peter', X('mid') - at(0.03, 0.06), 0.45, { pose: 'stand', dur: 5.5, face: 1 });
            moveTo(b, 'john', X('mid') + at(0.035, 0.07), 0.45, { pose: 'stand', dur: 5, face: -1 });
            ['jesus'].concat(TWELVE).forEach(id => { if (id !== 'peter' && id !== 'john') face(id, -1); });
          }],
          [5.2, b => { W.set('lspLamps', 1 / 3); sfx(b, 'fire', { soft: true }); }],
          [6.2, b => { W.set('lspLamps', 2 / 3); pose('peter', 'raise'); }],
          [7.2, b => { W.set('lspLamps', 1); sfx(b, 'chime', { soft: true }); }],
          [L[1] - 0.8, b => { W.set('lspTable', 1); pose('peter', 'stand'); const G = tableGeo(); sparkAt(b, G.cx, G.top - G.ph * 0.2, 26, [255, 236, 190], G.ph * 0.8, 'top'); }],
          [L[1], b => { tod(b, 0.772, 13); W.set('lspCity', 1); }],
          [L[1] + 0.6, b => {
            // 到了晚上，耶稣和十二个门徒坐席：从园子进城，各就各位
            const order = ['jesus', 'john', 'judas', 'jamesz', 'thomas', 'matthew', 'philip', 'andrew', 'bart', 'thad', 'simon', 'jamesa', 'peter'];
            order.forEach((id, i) => {
              const s = seat(id);
              if (b.instant) moveTo(b, id, s.x, s.v, { pose: 'sit', face: s.f });
              else later(b, i * 0.35, b2 => moveTo(b2, id, s.x, s.v, { pose: 'sit', face: s.f }));
            });
          }],
          [L[2], b => { glow('jesus', 0.38); ringOn(b, 'jesus', [255, 230, 190], PH(2) * 3, 2.4); sfx(b, 'harp'); }],
          [L[2] + 1, () => { ['peter', 'john'].forEach(id => glow(id, 0.26)); }],
        ]);
      },
    },
    // ── 2 · 约 13:3–15 洗脚 ─────────────────────────────────────
    {
      kind: 'call', utter: '我若不洗你，你就与我无分了', cmd: 'wash --feet 门徒 --towel 手巾  # 榜样', ref: JN('13:8'),
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const kneelBy = (b, id, d) => {
          const s = seat(id);
          const x = s.x + at(0.012, 0.022) * (d || 1);
          return moveTo(b, 'jesus', x, s.v + 0.14, { pose: 'kneel', face: id, dur: 1.4 });
        };
        const washed = (b, id) => { glow(id, 0.3); sparkOn(b, id, 14, [210, 230, 255], 0.1); sfx(b, 'splash', { soft: true }); S.washed++; };
        T(c, [
          [0, b => { pose('jesus', 'stand'); glow('jesus', 0.38); }],
          [1.0, b => { W.set('lspBasin', 1); moveTo(b, 'jesus', seat('jamesa').x + at(0.03, 0.05), 0.5, { pose: 'stand', dur: 2 }); }],
          [3.2, b => { kneelBy(b, 'jamesa', 1); face('jamesa', 1); }],
          [4.8, b => washed(b, 'jamesa')],
          [5.6, b => { face('jamesa', -1); kneelBy(b, 'simon', 1); face('simon', 1); }],
          [7.1, b => washed(b, 'simon')],
          [7.9, b => { face('simon', -1); kneelBy(b, 'thad', 1); face('thad', 1); }],
          [9.4, b => washed(b, 'thad')],
          // 挨到西门‧彼得
          [L[1], b => { face('thad', -1); moveTo(b, 'jesus', seat('peter').x + at(0.014, 0.024), 0.46, { pose: 'kneel', face: 'peter', dur: 1.8 }); face('peter', 1); }],
          [L[1] + 2.4, b => { pose('peter', 'raise'); nameOver(b, 'peter', '彼得'); }],
          [L[1] + 5.4, b => { pose('peter', 'kneel'); }],
          [L[1] + 6.6, b => { washed(b, 'peter'); glow('peter', 0.34); }],
          [L[1] + 7.6, b => { kneelBy(b, 'bart', -1); face('bart', 1); }],
          [L[1] + 8.8, b => { washed(b, 'bart'); pose('peter', 'sit'); }],
          [L[2], b => { kneelBy(b, 'andrew', -1); face('andrew', 1); }],
          [L[2] + 1.4, b => { washed(b, 'andrew'); }],
          [L[2] + 2.4, b => {
            // 其余的人也都洗了；耶稣穿上衣服，又坐下
            W.set('lspBasin', 0);
            ['thomas', 'jamesz', 'john', 'judas', 'matthew', 'philip'].forEach(id => { glow(id, id === 'judas' ? 0.14 : 0.26); });
            const s = seat('jesus');
            moveTo(b, 'jesus', s.x, s.v, { pose: 'sit', face: s.f, dur: 2.6 });
            S.washed = 12;
            if (!b.instant) ELEVEN.forEach((id, i) => { if (FRONT.indexOf(id) < 0) sparkOn(b, id, 8, [220, 236, 255], 0.2); });
          }],
          [L[2] + 5.2, b => { FRONT.forEach(id => face(id, seat(id).f)); ringOn(b, 'jesus', [255, 236, 200], PH(2) * 2.6, 2); }],
        ]);
      },
    },
    // ── 3 · 太 26:21–22 · 约 13:26–30 「你们中间有一个人要卖我了」 ──
    {
      kind: 'judge', utter: '你们中间有一个人要卖我了', cmd: 'whoami  # 主，是我吗？', ref: '26:21',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const ask = ['john', 'peter', 'thomas', 'andrew', 'jamesz', 'bart', 'matthew', 'philip', 'thad', 'simon', 'jamesa'];
        T(c, [
          [0.2, b => { glow('jesus', 0.36); W.set('lspDraft', 0.7); sfx(b, 'wind', { soft: true }); }],
          [2.2, b => {
            // 众人甚忧愁，彼此对看
            ['thomas', 'matthew', 'bart', 'simon'].forEach(id => face(id, -seat(id).f));
            ['andrew', 'jamesa'].forEach(id => pose(id, 'sit', { weep: true }));
          }],
          ...ask.map((id, i) => [3.6 + i * 0.4, b => { face(id, 'jesus'); sparkOn(b, id, 4, [230, 220, 200], 0.9); }]),
          [L[1] + 1.2, b => { pose('jesus', 'point'); face('jesus', 1); }],
          [L[1] + 3.2, b => { mote(b, 'hand', 'judas', { dur: 1.4 }); }],
          [L[1] + 4.8, b => { pose('jesus', 'sit'); glow('judas', 0.02); W.set('lspShade', 1); nameOver(b, 'judas', LABEL.judas, { rgb: [214, 206, 222] }); }],
          // 犹大受了那点饼，立刻就出去
          [L[2], b => { pose('judas', 'stand'); face('judas', 1); }],
          [L[2] + 1.0, b => { moveTo(b, 'judas', X('door') + at(0.02, 0.03), 0.02, { pose: 'stand', dur: 2.6 }); sfx(b, 'gate', { soft: true }); }],
          [L[2] + 3.4, b => { S.judasOut = 1; rm('judas'); W.set('lspShade', 0); }],
          [L[2] + 3.6, b => { tod(b, 0.9, 7); ['andrew', 'jamesa'].forEach(id => pose(id, 'sit', { weep: false })); }],
        ]);
      },
    },
    // ── 4 · 太 26:26–29 饼与杯 ─────────────────────────────────
    {
      kind: 'bless', utter: '你们拿着吃，这是我的身体', cmd: 'break 饼 && pour 杯  # 新约', ref: '26:26',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const eat = ['john', 'thomas', 'jamesz', 'peter', 'bart', 'andrew', 'matthew', 'philip', 'thad', 'simon', 'jamesa'];
        T(c, [
          [0.2, b => { pose('jesus', 'raise'); S.loaf = 'hands'; W.set('lspDraft', 0.3); glow('jesus', 0.6); }],
          [2.4, b => { ringOn(b, 'jesus', [255, 236, 190], PH(2) * 2.2, 2, 0.9); sfx(b, 'harp'); }],
          [4.2, b => { S.loaf = 'broken'; flash(b, 0.05); const h = handPt(); if (h) sparkAt(b, h[0], h[1], 30, [255, 234, 180], 8, 'top'); sfx(b, 'chime'); }],
          ...eat.map((id, i) => [5.0 + i * 0.28, b => mote(b, 'hand', id, { dur: 1.3 + (i % 3) * 0.15 })]),
          [7.6, b => { W.set('lspShared', 0.55); pose('jesus', 'sit'); glow('jesus', 0.4); }],
          // 又拿起杯来
          [L[1], b => { pose('jesus', 'raise'); S.cup = 'hands'; S.loaf = 'shared'; }],
          [L[1] + 2.0, b => { ringOn(b, 'jesus', [255, 180, 150], PH(2) * 2.2, 2, 0.95); sfx(b, 'bell', { soft: true }); }],
          ...eat.map((id, i) => [L[1] + 3.2 + i * 0.3, b => mote(b, 'hand', id, { dur: 1.3, rgb: [236, 110, 80] })]),
          [L[1] + 7.2, b => { W.set('lspShared', 1); ELEVEN.forEach(id => glow(id, 0.3)); }],
          [L[2], b => { S.cup = 'rest'; pose('jesus', 'sit'); glow('jesus', 0.38); }],
          [L[2] + 2, b => { W.set('lspDraft', 0.2); }],
        ]);
      },
    },
    // ── 5 · 约 13:34–38 新命令 ─────────────────────────────────
    {
      kind: 'cmd', utter: '我怎样爱你们，你们也要怎样相爱', cmd: 'commit 新命令  # 彼此相爱', ref: JN('13:34'),
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0.4, b => { W.set('lspLove', 1); glow('jesus', 0.4); sfx(b, 'harp'); }],
          [2.2, b => { ringOn(b, 'jesus', [255, 226, 180], PH(2) * 4, 3); }],
          [4.5, b => { W.set('lspCity', 1); }],
          // 彼得：「我愿意为你舍命！」
          [L[1] + 0.4, b => { pose('peter', 'stand'); face('peter', 1); }],
          [L[1] + 1.6, b => { moveTo(b, 'peter', seat('peter').x + at(0.01, 0.018), 0.28, { pose: 'raise', face: 'jesus', dur: 1 }); nameOver(b, 'peter', '彼得'); }],
          [L[1] + 5.4, b => { W.set('lspLove', 0.35); }],
          [L[1] + 7.2, b => { const s = seat('peter'); moveTo(b, 'peter', s.x, s.v, { pose: 'sit', face: s.f, dur: 1 }); }],
          [L[1] + 8.6, b => { pose('peter', 'sit', { weep: true }); }],
        ]);
      },
    },
    // ── 6 · 约 14:1–9 道路、真理、生命 ────────────────────────
    {
      kind: 'name', utter: '我就是道路、真理、生命', cmd: 'route 父家 --via 道路 --truth --life', ref: JN('14:6'),
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0.3, b => { pose('peter', 'sit', { weep: false }); W.set('lspHouse', 1); sfx(b, 'stars', { soft: true }); }],
          // 多马问：怎么知道那条路呢？
          [L[1], b => { pose('thomas', 'stand'); face('thomas', 1); nameOver(b, 'thomas', LABEL.thomas); }],
          [L[1] + 3.2, b => { W.set('lspWayA', 1); W.set('lspWay', 1); pose('jesus', 'point'); glow('jesus', 0.42); sfx(b, 'angel', { soft: true }); }],
          [L[1] + 4.6, b => {
            const Cv = wayCurve();
            if (!Cv) return;
            ['道路', '真理', '生命'].forEach((s, i) => {
              const p = qpt(Cv, 0.34 + i * 0.22), dx = phone() ? (i % 2 ? 1 : -1) * W.w * 0.17 : M() * 0.06;
              nameHere(b, s, p[0] + dx, p[1] - M() * 0.02, [255, 240, 210], { size: phone() ? 0.042 : 0.036, hold: 3.4, delay: i * 0.7 });
            });
          }],
          [L[1] + 7.4, b => { pose('thomas', 'sit'); pose('jesus', 'sit'); }],
          // 腓力：将父显给我们看
          [L[2], b => { pose('philip', 'stand'); face('philip', -1); nameOver(b, 'philip', LABEL.philip); }],
          [L[2] + 3.2, b => { glow('jesus', 0.46); ringOn(b, 'jesus', [255, 246, 226], PH(2) * 3.2, 2.6); }],
          [L[2] + 6.2, b => { pose('philip', 'sit'); glow('jesus', 0.38); }],
        ]);
      },
    },
    // ── 7 · 约 14:26–27 · 太 26:30 平安；唱诗，出来 ───────────────
    {
      kind: 'bless', utter: '我留下平安给你们', cmd: 'leave 平安 && send 保惠师', ref: JN('14:27'),
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          // 道路整条淡去（不缩回成半截的光柱），好让保惠师的柔光成为这句话的画面
          [0.3, b => { W.set('lspPeace', 1); W.set('lspWayA', 0); if (!b.instant && fx()) fx().ring(W.spirit.x, W.spirit.y, [236, 238, 255], M() * 0.3, 2.6, 1.2); sfx(b, 'whisper'); }],
          [2.0, b => { W.set('lspDraft', 0); W.set('lspHouse', 0.4); }],
          [L[1], b => { ELEVEN.forEach(id => pose(id, 'sit', { weep: false })); glow('jesus', 0.4); ringOn(b, 'jesus', [240, 240, 255], PH(2) * 4.5, 3.2); }],
          [L[1] + 3, b => { ELEVEN.forEach(id => glow(id, 0.34)); }],
          // 他们唱了诗，就出来
          [L[2], b => { sfx(b, 'sing'); ['jesus'].concat(ELEVEN).forEach(id => pose(id, 'stand')); W.set('lspPeace', 0.3); }],
          [L[2] + 1.2, b => {
            W.set('lspWay', 0); W.set('lspHouse', 0); W.set('lspLove', 0);
            ['jesus'].concat(ELEVEN).forEach((id, i) => { const q = P(STREET, id); moveTo(b, id, q.x, q.v, { pose: 'stand', dur: 3.2 + (i % 4) * 0.35 }); });
          }],
          // 灯熄了，大楼暗下去、退进夜里（他们已在屋外）
          [L[2] + 3.4, b => { W.set('lspLamps', 0.12); W.set('lspTable', 0.5); S.cup = 'table'; W.set('lspPeace', 0); W.set('lspRoomDim', 1); }],
          [L[2] + 5.2, b => { ['jesus'].concat(ELEVEN).forEach(id => face(id, id === 'jesus' ? -1 : (P(STREET, id).x < P(STREET, 'jesus').x ? 1 : -1))); }],
        ]);
      },
    },
    // ── 8 · 约 15 — 16 葡萄树 ─────────────────────────────────
    {
      kind: 'name', utter: '我是葡萄树，你们是枝子', cmd: 'graft 枝子 --into 葡萄树', ref: JN('15:5'),
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0.3, b => { W.set('lspVine', 1); sfx(b, 'harp'); const G = vineGeo(); sparkAt(b, G.bx, G.by - G.h * 0.3, 26, [220, 255, 190], G.h * 0.4, 'top'); }],
          [3.5, b => { pose('jesus', 'raise'); glow('jesus', 0.42); }],
          [L[1] - 0.6, b => { W.set('lspFruit', 1); S.fruit = 1; sfx(b, 'chime', { soft: true }); }],
          [L[1] + 2, b => { pose('jesus', 'stand'); W.set('lspOne', 0.6); }],
          [L[2], b => { W.set('lspOne', 0); ringOn(b, 'jesus', [255, 232, 190], PH(2) * 5, 3.4); glow('jesus', 0.38); }],
          [L[2] + 3.2, b => { ELEVEN.forEach(id => face(id, 'jesus')); }],
        ]);
      },
    },
    // ── 9 · 约 17:1–21 · 18:1 举目望天；过了汲沦溪 ──────────────
    {
      kind: 'call', utter: '父啊，时候到了，愿你荣耀你的儿子', cmd: 'pray --to 父 --for 他们  # 合而为一', ref: JN('17:1'),
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0.3, b => { moveTo(b, 'jesus', P(STREET, 'jesus').x, 0.56, { pose: 'gaze', dur: 1.2 }); }],
          [1.8, b => { W.set('lspGlory', 1); glow('jesus', 0.7); sfx(b, 'angel'); }],
          [3.0, b => { ELEVEN.forEach(id => pose(id, 'kneel')); }],
          [L[1] + 0.5, b => { W.set('lspOne', 1); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 6, b => { W.set('lspOne', 0); W.set('lspGlory', 0); pose('jesus', 'stand'); glow('jesus', 0.38); }],
          // 过了汲沦溪，进了园子
          [L[2], b => {
            ELEVEN.forEach(id => pose(id, 'stand'));
            W.set('lspVineA', 0);
            W.set('lspRoom', 0);
            W.set('lspGrove', 1);   // 汲沦溪、园中的橄榄树、石头在大楼的地方显出
            tod(b, 0.04, 8);
          }],
          [L[2] + 0.8, b => {
            ['jesus'].concat(ELEVEN).forEach((id, i) => {
              const q = P(GARDEN, id), pse = id === 'jesus' || id === 'peter' || id === 'jamesz' || id === 'john' ? 'stand' : 'sit';
              moveTo(b, id, q.x, q.v, { pose: pse, dur: 4.5 + (i % 5) * 0.4, face: id === 'jesus' ? -1 : 1 });
            });
            sfx(b, 'splash', { soft: true });
          }],
          [L[2] + 3.2, b => { sfx(b, 'splash', { soft: true }); }],
        ]);
      },
    },
    // ── 10 · 太 26:37–39 · 路 22:43 客西马尼 ─────────────────────
    {
      kind: 'call', utter: '不要照我的意思，只要照你的意思', cmd: 'yield 我的意思 --to 你的意思', ref: '26:39',
      verse: V10,
      apply(c) {
        const L = starts(V10);
        const three = ['peter', 'jamesz', 'john'];
        T(c, [
          [0.3, b => { pose('jesus', 'bow'); glow('jesus', 0.38); sfx(b, 'weep', { soft: true }); }],
          [2.4, b => { three.forEach(id => { const q = P(GARDEN, id); moveTo(b, id, q.x, q.v, { pose: 'sit', face: 1, dur: 1.2 }); }); face('jesus', -1); }],
          [5.2, b => { pose('jesus', 'stand'); face('jesus', 1); }],
          // 稍往前走，俯伏在地（桌面上往前些，身形大一点）
          [L[1], b => { const r = rockSpot(); moveTo(b, 'jesus', r.x, r.v, { pose: 'fall', face: 1, dur: 2.2 }); }],
          [L[1] + 4, b => { sfx(b, 'heart', { soft: true }); }],
          [L[1] + 6.8, b => { pose('jesus', 'pray'); glow('jesus', 0.5); }],
          // 有一位天使从天上显现
          [L[2] - 0.4, b => {
            const x = X('rock') + at(0.01, 0.05), hy = vY(x, 0.3) / W.h - 0.03;
            add('angel', { label: '天使', sex: 'm', age: 'adult', layer: 2, x, v: 0.3, facing: -1, angel: true, glow: 1, from: b.instant ? 'none' : 'light', prop: null });
            const f = fig('angel');
            if (f && !b.instant && !W.replaying) { f.ny = 0.3; C().fly('angel', x, hy, { dur: 2.6, pose: 'bow' }); }
            else if (f) { f.fly = null; f.ny = hy; pose('angel', 'bow'); }
            sfx(b, 'angel');
          }],
          [L[2] + 1.6, b => { glow('jesus', 0.55); ringOn(b, 'jesus', [255, 246, 226], PH(2) * 2.6, 2.4); }],
          // 门徒睡着了：或坐或卧，胸前的光也暗下去
          [L[2] + 2.6, b => { sleep(EIGHT.concat(three)); W.set('lspShared', 0.45); }],
        ]);
      },
    },
    // ── 11 · 太 26:40–46 心灵固然愿意；火把近了 ────────────────────
    {
      kind: 'cmd', utter: '你们心灵固然愿意，肉体却软弱了', cmd: 'watch && pray  # 心灵固然愿意', ref: '26:41',
      verse: V11,
      apply(c) {
        const L = starts(V11);
        const three = ['peter', 'jamesz', 'john'];
        T(c, [
          [0.3, b => { rm('angel'); pose('jesus', 'stand'); glow('jesus', 0.38); }],
          [1.2, b => { const q = P(GARDEN, 'john'); moveTo(b, 'jesus', q.x + at(0.016, 0.04), 0.42, { pose: 'stand', face: -1, dur: 1.6 }); }],
          [3.2, b => { three.forEach(id => pose(id, 'sit')); }],
          // 第二次又去祷告
          [L[1], b => { const r = rockSpot(); moveTo(b, 'jesus', r.x, r.v, { pose: 'pray', face: 1, dur: 1.8 }); sleep(three); }],
          [L[1] + 2.4, b => { W.set('lspTorchFar', 1); sfx(b, 'march', { soft: true, far: true }); }],
          // 起来！我们走吧——犹大领着一队人来了
          [L[2], b => { const q = P(MEET, 'jesus'); moveTo(b, 'jesus', q.x, q.v, { pose: 'stand', face: -1, dur: 3.4 }); }],
          [L[2] + 1.2, b => { EIGHT.concat(three).forEach(id => pose(id, 'stand')); W.set('lspShared', 1); }],
          [L[2] + 2.2, b => { ELEVEN.forEach((id, i) => { const q = P(MEET, id); moveTo(b, id, q.x, q.v, { pose: 'stand', face: -1, dur: 2.6 + (i % 4) * 0.3 }); }); }],
          [L[2] + 2.8, b => {
            BAND.forEach((q, i) => {
              const id = q[0], x = X('bandIn') - i * at(0.006, 0.012), v = q[4][2];
              addPerson(id, x, v, { facing: 1, from: b.instant ? 'none' : 'fade', glow: id === 'judas' ? 0.08 : 0.14 });
              moveTo(b, id, at(q[4][0], q[4][1]), v, { pose: 'stand', face: 1, dur: 4.2 + i * 0.05 });
            });
            W.set('lspTorchFar', 0);
            sfx(b, 'march');
          }],
        ]);
      },
    },
    // ── 12 · 太 26:47–49 · 约 18:4–6 「我就是！」 ──────────────────
    {
      kind: 'name', utter: '我就是', cmd: 'answer 你们找谁 → 我就是', ref: JN('18:5'),
      verse: V12,
      apply(c) {
        const L = starts(V12);
        const J = () => P(MEET, 'jesus');
        const band = BAND.map(q => q[0]);
        T(c, [
          [0.3, b => { band.forEach(id => { const q = BAND.find(r => r[0] === id)[4]; moveTo(b, id, at(q[0], q[1]), q[2], { pose: 'stand', face: 1 }); }); }],
          // 犹大到耶稣跟前，亲嘴
          [L[0] + 3.2, b => { const j = J(); moveTo(b, 'judas', j.x - at(0.012, 0.022), j.v, { pose: 'stand', face: 1, dur: 1.6 }); }],
          [L[0] + 5.2, b => { pose('judas', 'embrace'); pose('jesus', 'embrace'); }],
          [L[0] + 7.6, b => { pose('jesus', 'stand'); const q = BAND[0][4]; moveTo(b, 'judas', at(q[0], q[1]), q[2], { pose: 'stand', face: 1, dur: 1.4 }); }],
          // 就出来对他们说
          [L[1], b => { const j = J(); moveTo(b, 'jesus', j.x - at(0.012, 0.02), j.v, { pose: 'stand', face: -1, dur: 1.2 }); }],
          [L[1] + 5.2, b => { fxl(b, { type: 'iam', dur: 2.2 }); flash(b, 0.12); glow('jesus', 0.8); sfx(b, 'angel'); }],
          // 他们就退后倒在地上（横七竖八），过一会儿又跪起来
          [L[2] + 0.6, b => {
            band.forEach((id, i) => { pose(id, 'lie'); face(id, i % 2 ? -1 : 1); });
            shake(b, 3); sfx(b, 'collapse', { soft: true });
          }],
          [L[2] + 2.6, b => { glow('jesus', 0.4); }],
          [L[2] + 4.0, b => { band.forEach((id, i) => { if (i % 3 !== 2) { pose(id, 'kneel'); face(id, 1); } }); }],
          [L[2] + 4.8, b => { band.forEach((id, i) => { if (i % 3 === 2) { pose(id, 'kneel'); face(id, 1); } }); }],
        ]);
      },
    },
    // ── 13 · 约 18:10 · 太 26:52 · 路 22:51 · 太 26:56 收刀入鞘 ────
    {
      kind: 'cmd', utter: '收刀入鞘吧', cmd: 'sheathe 刀 && heal 马勒古', ref: '26:52',
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const band = BAND.map(q => q[0]);
        const mal = () => { const q = BAND[1][4]; return { x: at(q[0], q[1]), v: q[2] }; };
        T(c, [
          [0.2, b => { band.forEach(id => pose(id, 'stand')); }],
          [1.6, b => { prop('peter', 'blade'); const m = mal(); moveTo(b, 'peter', m.x + at(0.012, 0.028), m.v, { pose: 'stand', face: -1, run: true, dur: 1.6 }); }],
          [3.6, b => { pose('peter', 'raise'); fxl(b, { type: 'glint', id: 'peter', dur: 0.6, frac: 1.1, dx: -0.2 }); sfx(b, 'sword'); }],
          [4.2, b => { pose('malchus', 'kneel'); }],
          [5.6, b => { pose('peter', 'stand'); }],
          // 收刀入鞘吧
          [L[1] + 0.6, b => { prop('peter', null); }],
          [L[1] + 1.8, b => { const q = P(MEET, 'peter'); moveTo(b, 'peter', q.x, q.v, { pose: 'stand', face: -1, dur: 1.6 }); }],
          // 就摸那人的耳朵，把他治好了
          [L[2] + 0.6, b => { const m = mal(); moveTo(b, 'jesus', m.x + at(0.012, 0.024), m.v, { pose: 'point', face: -1, dur: 1.4 }); }],
          [L[2] + 2.6, b => { fxl(b, { type: 'heal', id: 'malchus', dur: 2.2 }); sparkOn(b, 'malchus', 22, [255, 240, 200], 0.9); sfx(b, 'chime'); }],
          [L[2] + 4.0, b => { pose('malchus', 'stand'); glow('malchus', 0.4); pose('jesus', 'stand'); }],
          [L[2] + 5.4, b => {
            // 拿住耶稣（一个在他身后，一个在溪的这边）
            const m = mal(), jx = m.x + at(0.012, 0.024);
            moveTo(b, 'sol1', jx, m.v - 0.1, { pose: 'stand', face: 1, dur: 1.4 });
            moveTo(b, 'sol3', jx - at(0.024, 0.04), m.v + 0.06, { pose: 'stand', face: 1, dur: 1.6 });
          }],
          // 门徒都离开他，逃走了（彼得停在园边，远远地看）
          [L[3], b => {
            ELEVEN.forEach((id, i) => {
              if (id === 'peter') { moveTo(b, 'peter', at(0.87, 0.95), 0.5, { pose: 'stand', face: -1, run: true, dur: 2 }); return; }
              moveTo(b, id, 1.06 + (i % 3) * 0.02, P(MEET, id).v, { pose: 'stand', run: true, dur: 1.8 + (i % 4) * 0.2 });
            });
          }],
          [L[3] + 2.4, b => { ELEVEN.forEach(id => { if (id !== 'peter') rm(id); }); }],
        ]);
      },
    },
    // ── 14 · 太 26:69–74 · 路 22:61–62 鸡叫 ────────────────────────
    {
      kind: 'call', utter: '鸡叫以先，你要三次不认我', cmd: 'await 鸡叫  # 主转过身来看彼得', ref: '26:34',
      verse: V14,
      apply(c) {
        const L = starts(V14);
        const dim = (b, v) => { glow('peter', v); sparkOn(b, 'peter', 6, [150, 150, 170], 0.58); };
        T(c, [
          // 带到大祭司的院子里去：园子隐去，同一处显出院墙、门楼、炭火（「彼得在外面院子里坐着」）
          [0.2, b => {
            W.set('lspGrove', 0);
            tod(b, 0.17, 12);   // 夜深了，往黎明去
            W.set('lspCourt', 1); W.set('lspFire', 1); W.set('lspRooster', 1); S.court = 1;
            const cj = P(COURT, 'jesus');
            moveTo(b, 'jesus', cj.x, cj.v, { pose: 'stand', face: 1, dur: 3.2 });
            moveTo(b, 'sol1', P(COURT, 'sol1').x, P(COURT, 'sol1').v, { pose: 'stand', face: 1, dur: 3.2 });
            moveTo(b, 'sol3', P(COURT, 'sol3').x, P(COURT, 'sol3').v, { pose: 'stand', face: -1, dur: 3.3 });
            moveTo(b, 'sol5', P(COURT, 'sol5').x, P(COURT, 'sol5').v, { pose: 'sit', face: 1, dur: 2.8 });
            moveTo(b, 'sol6', P(COURT, 'sol6').x, P(COURT, 'sol6').v, { pose: 'stand', face: -1, dur: 2.6 });
            ['judas', 'malchus', 'sol2', 'sol4'].forEach(id => rm(id));
            prop('sol5', null); prop('sol6', null);
            const m = P(COURT, 'maid0');
            add('maid', { label: '使女', sex: 'f', age: 'adult', layer: 2, x: m.x, v: m.v, facing: 1, robe: ROBE.maid, glow: 0.16, from: b.instant ? 'none' : 'fade', prop: null });
            sfx(b, 'gate', { soft: true });
          }],
          // 彼得远远地跟着，进到院子里，在炭火旁坐下
          [1.2, b => { const q = P(COURT, 'peterFire'); moveTo(b, 'peter', q.x, q.v, { pose: 'sit', face: -1, dur: 3.4 }); }],
          [3.0, b => { const m = P(COURT, 'maid1'); moveTo(b, 'maid', m.x, m.v, { pose: 'point', face: 1, dur: 2.4 }); sfx(b, 'fire', { soft: true }); }],
          [4.8, b => { nameOver(b, 'peter', '彼得'); }],
          [5.6, b => { nameOver(b, 'maid', '使女', { dy: 0.058, rgb: [236, 214, 206] }); }],
          // 头一次不认（26:70）：胸前的光暗了一层
          [L[0] + 6.6, b => { pose('peter', 'raise'); face('peter', 1); dim(b, 0.2); }],
          [L[0] + 8.0, b => { pose('peter', 'stand'); pose('maid', 'stand'); }],
          // 既出去，到了门口，那使女又看见他（26:71 · 可 14:69）：第二次不认
          [L[1] - 0.6, b => { const q = P(COURT, 'peterGate'); moveTo(b, 'peter', q.x, q.v, { pose: 'stand', face: -1, dur: 2.2 }); }],
          [L[1] - 0.2, b => { const q = P(COURT, 'maidGate'); moveTo(b, 'maid', q.x, q.v, { pose: 'point', face: 1, dur: 2.4 }); }],
          [L[1] + 2.6, b => { pose('peter', 'raise'); face('peter', -1); dim(b, 0.1); }],
          [L[1] + 3.4, b => {
            const q = P(COURT, 'maid1');
            moveTo(b, 'maid', q.x, q.v, { pose: 'stand', face: 1, dur: 2.2 });
            const a = P(COURT, 'sol6b'), d = P(COURT, 'sol5b');
            moveTo(b, 'sol6', a.x, a.v, { pose: 'point', face: 1, dur: 1.8 });
            moveTo(b, 'sol5', d.x, d.v, { pose: 'point', face: 1, dur: 2.2 });
          }],
          [L[1] + 3.8, b => { pose('peter', 'stand'); }],
          // 旁边站着的人：第三次，发咒起誓
          [L[1] + 5.2, b => { pose('peter', 'raise'); face('peter', -1); dim(b, 0.04); }],
          // 立时，鸡就叫了——东方发白
          [L[1] + 7.4, b => {
            S.crowed = 1; fxl(b, { type: 'crow', dur: 2.6 }); sfx(b, 'bird', { x: 0.7 }); tod(b, 0.245, 8);
            if (!b.instant) { const R = roosterGeo(); nameHere(b, '鸡', R.x - R.s * 0.3, R.y - R.s * 1.6 - M() * 0.05, [255, 226, 180], { size: phone() ? 0.042 : 0.036, hold: 3, src: () => [R.hx, R.hy] }); }
          }],
          [L[1] + 8.2, b => { pose('peter', 'stand'); pose('sol6', 'stand'); pose('sol5', 'stand'); }],
          // 主转过身来看彼得
          [L[2] + 0.4, b => { face('jesus', 1); W.set('lspLook', 1); glow('jesus', 0.46); }],
          [L[2] + 4.2, b => { W.set('lspLook', 0); const q = P(COURT, 'peterOut'); moveTo(b, 'peter', q.x + at(0.004, 0), q.v, { pose: 'kneel', face: 1, dur: 2.6, weep: true }); }],
          [L[2] + 5.6, b => { glow('peter', 0.3); sparkOn(b, 'peter', 10, [255, 226, 180], 0.58); }],
          [L[2] + 7.2, b => { sfx(b, 'weep'); W.set('lspFire', 0.55); glow('jesus', 0.36); }],
        ]);
      },
    },
  ];

  // 在一个情节里再错开几件事（看着时按世界时间；重演时立即）
  function later(b, sec, fn) {
    if (b.instant || W.replaying || sec <= 0) { fn(b); return; }
    GS.book.timeline({ instant: false }, [[sec, fn]]);
  }

  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '最后的晚餐', sub: '马太福音 26 · 路加福音 22 · 约翰福音 13 — 18', tint: [255, 214, 170], music: 'job',
    intro: INTRO, outro: 22,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '耶稣': { text: '逾越节以前，耶稣知道自己离世归父的时候到了。<br>他既然爱世间属自己的人，就爱他们到底。', ref: JN('13:1') },
      '彼得': { text: '但我已经为你祈求，叫你不至于失了信心。<br>你回头以后，要坚固你的弟兄。', ref: LK('22:32') },
      '约翰': { text: '有一个门徒，是耶稣所爱的，侧身挨近耶稣的怀里。', ref: JN('13:23') },
      '加略人犹大': { text: '当下，十二门徒里有一个称为加略人犹大的，去见祭司长，<br>说：「我把他交给你们，你们愿意给我多少钱？」他们就给了他三十块钱。', ref: MT('26:14–15') },
      '多马': { text: '多马对他说：「主啊，我们不知道你往哪里去，怎么知道那条路呢？」', ref: JN('14:5') },
      '腓力': { text: '腓力对他说：「求主将父显给我们看，我们就知足了。」', ref: JN('14:8') },
      '马勒古': { text: '耶稣说：「到了这个地步，由他们吧！」就摸那人的耳朵，把他治好了。', ref: LK('22:51') },
      '使女': { text: '那看门的使女对彼得说：「你不也是这人的门徒吗？」他说：「我不是。」', ref: JN('18:17') },
      '天使': { text: '有一位天使从天上显现，加添他的力量。', ref: LK('22:43') },
      '兵丁': { text: '犹大领了一队兵，和祭司长并法利赛人的差役，拿着灯笼、火把、兵器，就来到园里。', ref: JN('18:3') },
      '差役': { text: '犹大领了一队兵，和祭司长并法利赛人的差役，拿着灯笼、火把、兵器，就来到园里。', ref: JN('18:3') },
      '大楼': { text: '他必指给你们摆设整齐的一间大楼，你们就在那里预备。', ref: LK('22:12') },
      '饼': { text: '他们吃的时候，耶稣拿起饼来，祝福，就擘开，递给门徒，<br>说：「你们拿着吃，这是我的身体。」', ref: MT('26:26') },
      '杯': { text: '又拿起杯来，祝谢了，递给他们，说：「你们都喝这个；<br>因为这是我立约的血，为多人流出来，使罪得赦。」', ref: MT('26:27–28') },
      '盆': { text: '随后把水倒在盆里，就洗门徒的脚，并用自己所束的手巾擦干。', ref: JN('13:5') },
      '灯': { text: '犹大受了那点饼，立刻就出去。那时候是夜间了。', ref: JN('13:30') },
      '我父的家': { text: '在我父的家里有许多住处；若是没有，我就早已告诉你们了。<br>我去原是为你们预备地方去。', ref: JN('14:2') },
      '葡萄树': { text: '我是葡萄树，你们是枝子。常在我里面的，我也常在他里面，这人就多结果子；<br>因为离了我，你们就不能做什么。', ref: JN('15:5') },
      '汲沦溪': { text: '耶稣说了这话，就同门徒出去，过了汲沦溪。在那里有一个园子，他和门徒进去了。', ref: JN('18:1') },
      '橄榄树': { text: '耶稣出来，照常往橄榄山去，门徒也跟随他。', ref: LK('22:39') },
      '客西马尼': { text: '耶稣同门徒来到一个地方，名叫客西马尼，就对他们说：<br>「你们坐在这里，等我到那边去祷告。」', ref: MT('26:36') },
      '耶路撒冷': { text: '耶稣说：「你们进城去，到某人那里……」', ref: MT('26:18') },
      '殿': { text: '当时，耶稣对众人说：「你们带着刀棒出来拿我，如同拿强盗吗？<br>我天天坐在殿里教训人，你们并没有拿我。」', ref: MT('26:55') },
      '炭火': { text: '仆人和差役因为天冷，就生了炭火，站在那里烤火；彼得也同他们站着烤火。', ref: JN('18:18') },
      '鸡': { text: '彼得又不承认。立时鸡就叫了。', ref: JN('18:27') },
      '大祭司的院子': { text: '彼得远远地跟着耶稣，直到大祭司的院子，进到里面，<br>就和差役同坐，要看这事到底怎样。', ref: MT('26:58') },
      '安得烈': { text: '这十二使徒的名：头一个叫西门（又称彼得），还有他兄弟安得烈……', ref: MT('10:2') },
      '雅各': { text: '于是带着彼得和西庇太的两个儿子同去，就忧愁起来，极其难过。', ref: MT('26:37') },
    },
  });
})(window.GS);
