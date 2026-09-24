/* ─────────────────────────────────────────────────────────────
 * book/livingstone.js —— 普通书信 · 活石（雅各书 · 彼得前书 · 彼得后书）
 *
 * 书信没有情节：一群分散寄居的人，住在海边的山坡上——两顶帐棚、一块旱田、一片石台（锡安的磐石）。
 * 信里的每一句话，在这一日一夜又一日之间成为看得见的光；一座由活石建造的灵宫在他们中间立起来。
 *   雅 1:17   黎明。天上开了一处光：各样美善的恩赐一点一点降下来，落在每个人、田、帐棚、海上。
 *   雅 1:22   听道的人对着镜子看了看，走过穷弟兄身边，随即忘了；彼得提水罐去看顾寡妇孤儿；
 *             行道的妇人背着衣食走到穷弟兄那里——他换上了暖和的衣裳，站起来：信心有了行为，就活了。
 *   雅 3:17   农夫与听道的人争吵，口里的火星随风飞进中丘的树林，林边烧起小小的火；
 *             从上头来的智慧如柔光降下，火灭了，二人相拥；用和平所栽种的一棵小树长起来，结出义果。
 *   雅 4:8    正午。众人从各处走近石台；一团光自天顶降到他们上头；他们跪下，又被叫起来，举手。
 *   雅 5:18   农夫在旱田边坐着等候；众人祷告；云聚，雨降，田里出苗，遍地返青。
 *   彼前 1:3  傍晚。庄稼黄熟；草必枯干，花必凋谢——田地枯黄；惟有主的道永存：「道」字在田上成形，
 *             光的种子落下，田里长出一行行发光的新芽——活泼的盼望。
 *   彼前 2:6  日落。一道光落在匠人所弃、躺在石台边的那块粗石上；它升起来，安放在石台的角上，成了房角石。
 *   彼前 2:5  本幕的签名之景：寄居的人从帐棚那边来；每人胸中升起一块光的石头，飞去砌在房角石旁，
 *             一层一层砌成墙，门楣、山墙——灵宫立起来；众人作圣洁的祭司举手，灵祭如香烟自灵宫升起。
 *   彼前 2:9  夜。黑暗笼罩全地，远处还有在黑暗里的人与迷路的羊；灵宫的门开了，奇妙的光自门里铺开，
 *             他们走进光里；羊回到灵宫门前，归到牧人那里。
 *   彼前 5:7  子夜。远山后暗红的火光（火炼的试验）；众人背着重担低头；一团冷暗的烟影在地边游行（吼叫的狮子）；
 *             他们站稳抵挡；把重担卸下——重担化作光升上天去；烟影退去散了。
 *   彼后 1:17 黎明前。彼得举着灯（如同灯照在暗处）；远山上显出圣山的异象：光明的云，发光的人形——
 *             「这是我的爱子」；异象隐去，东方晨星出来，一缕缕光进到众人心里。
 *   彼后 3:8  天上浮现方舟的异象（挪亚一家八口）；随后日子飞逝：日出日落、星转斗移，树长大，地全然返青，
 *             灵宫依旧；又有悔改的人从远处来。
 *   彼后 3:13 早晨。东边天际起了一片新的光——新天新地的盼望；遍地开花，众人举手。愿荣耀归给他。阿们！
 *
 * 父不显为人形：只是天上的光与旁白的声音。主乃活石——房角石是一块光的石头，不是人形；
 * 圣山的异象里，子只是一个发光的人形（异象，不是面貌）。圣灵是玩家自己漂游的光。
 * 魔鬼不是活物：只是一团冷暗的烟影，被站稳的人抵挡，退去散了。人都无面目。
 *
 * 画面的方位（桌面）：海在左，经文在海上；近地上左边是旱田（0.40–0.53），石台与灵宫在当中（0.60–0.72），
 *   右边是彼得、寡妇孤儿与两顶帐棚（0.74–0.97）；中丘左端是一片树林（0.54–0.64）；远山上是圣山的异象（0.83）。
 * 竖屏的手机：经文在上，诸般位置向左展开、人前后两排（v）；天上的异象放在经文之下。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'livingstone';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时对齐）───────────────────
  const LV = {
    lsAbove: ['exp', 0.5],    // 天上开的一处光（众光之父）
    lsGifts: ['lin', 0.1],    // 美善的恩赐一一降下（0 → 1 约十秒）
    lsMirror: ['exp', 0.9],   // 镜子的反光
    lsFire: ['lin', 0.22],    // 林边小小的火
    lsSteam: ['exp', 0.6],    // 火灭后的白汽
    lsScar: ['exp', 0.3],     // 烧过的一片地
    lsWisdom: ['exp', 0.5],   // 从上头来的智慧（柔光）
    lsPeace: ['lin', 0.13],   // 用和平所栽种的一棵小树
    lsNear: ['exp', 0.6],     // 神就必亲近你们：光的亮度
    lsNearY: ['lin', 0.17],   // 那光自天顶降下的路程
    lsSprout: ['lin', 0.12],  // 田里出苗
    lsGold: ['exp', 0.35],    // 黄熟
    lsWither: ['exp', 0.4],   // 枯干
    lsHope: ['lin', 0.16],    // 活泼的盼望：光的新芽
    lsBeam: ['exp', 0.6],     // 照在被弃的石头上的光
    lsLift: ['lin', 0.22],    // 那石头升起，安放为房角石
    lsBuild: ['lin', 0.075],  // 灵宫一块一块建造（约十三秒）
    lsRoof: ['lin', 0.3],     // 门楣之上的山墙
    lsHouse: ['exp', 0.5],    // 灵宫的光
    lsOffer: ['exp', 0.5],    // 灵祭：自灵宫升起的光
    lsDark: ['exp', 0.45],    // 黑暗
    lsCall: ['lin', 0.14],    // 奇妙光明自门里铺开
    lsDoor: ['exp', 0.8],     // 门里的光
    lsTrial: ['exp', 0.4],    // 火炼的试验：远山后暗红的光
    lsLion: ['exp', 0.9],     // 冷暗的烟影（在不在）
    lsLionX: ['lin', 0.24],   // 烟影游行到哪里
    lsLionBack: ['exp', 0.9], // 被抵挡：烟影往回缩
    lsCast: ['lin', 0.3],     // 重担化作光升上去
    lsHoly: ['exp', 0.6],     // 圣山的异象
    lsLamp: ['exp', 0.8],     // 灯照在暗处
    lsStar: ['exp', 0.35],    // 晨星
    lsArk: ['exp', 0.55],     // 方舟的异象
    lsNew: ['exp', 0.3],      // 新天新地的曙光
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 地上的位置：人 [x, v]（v：在近地纵深里靠前）；布景 x（画面宽度的比例）─────────
  // 右边的人按纵深分成三排（v）：后排（彼得、寡妇、走进来的蒙召的人）、中排（行道的人、孤儿）、前排（寄居的、悔改的人、归来的羊）；
  // 帐棚在最右（≥ 0.93），帐棚前不站人。
  const PD = {
    farmer: [0.458, 0.2], poor: [0.548, 0.3], hearer: [0.7, 0.36], peter: [0.772, 0.06], doer: [0.8, 0.22], widow: [0.848, 0.12], orphan: [0.866, 0.28],
    hearerAway: [0.49, 0.24], peterW: [0.828, 0.08], doerP: [0.568, 0.3],
    gFarmer: [0.503, 0.1], gHearer: [0.526, 0.34], gPoor: [0.549, 0.12], gPeter: [0.762, 0.06], gDoer: [0.786, 0.2], gWidow: [0.814, 0.05], gOrphan: [0.838, 0.22],
    stone: [0.572, 0.3], ptree: [0.536, 0.02], lamp: [0.625, 0.44], door: [0.712, 0.36],
    pAside: [0.606, 0.3], dAside: [0.63, 0.36],
  };
  const PP = {
    farmer: [0.5, 0.62], poor: [0.47, 0.34], hearer: [0.69, 0.5], peter: [0.785, 0.1], doer: [0.83, 0.55], widow: [0.872, 0.25], orphan: [0.9, 0.7],
    hearerAway: [0.45, 0.2], peterW: [0.85, 0.12], doerP: [0.5, 0.36],
    gFarmer: [0.46, 0.1], gHearer: [0.49, 0.36], gPoor: [0.52, 0.16], gPeter: [0.782, 0.08], gDoer: [0.81, 0.5], gWidow: [0.862, 0.24], gOrphan: [0.89, 0.64],
    stone: [0.535, 0.36], ptree: [0.44, 0.02], lamp: [0.62, 0.42], door: [0.73, 0.44],
    pAside: [0.58, 0.3], dAside: [0.61, 0.38],
  };
  const XD = {
    field0: 0.395, field1: 0.515, fieldV0: 0.1, fieldDV: 0.068, site: 0.665, tent1: 0.936, tent2: 0.984, grove0: 0.53, grove1: 0.665,
    saint0: 0.745, saint1: 0.83, saintV: 0.4, dL0: 0.375, dL1: 0.44, dR0: 0.94, dR1: 0.995, dLin0: 0.572, dLin1: 0.598, dRin0: 0.852, dRin1: 0.905, dRV: 0.07,
    fire0: 0.506, fire1: 0.578, fireV: 0.03,
    shL0: 0.61, shL1: 0.636, shR0: 0.728, shR1: 0.756, sheepV: 0.58, lion0: 0.462, lion1: 0.585, lionV: 0.46, lionBack: 0.1,
    holy: 0.835, starX: 0.16, starY: 0.2, arkX: 0.3, arkY: 0.33,
    more0: 0.852, more1: 0.905, moreV: 0.56, aboveY: 0.1, newX: 0.64,
  };
  const XP = {
    field0: 0.425, field1: 0.625, fieldV0: 0.5, fieldDV: 0.07, site: 0.648, tent1: 0.965, tent2: -1, grove0: 0.505, grove1: 0.64,
    saint0: 0.66, saint1: 0.78, saintV: 0.66, dL0: 0.31, dL1: 0.37, dR0: 0.955, dR1: 1.0, dLin0: 0.5, dLin1: 0.53, dRin0: 0.86, dRin1: 0.93, dRV: 0.34,
    fire0: 0.44, fire1: 0.54, fireV: 0.42,
    shL0: 0.555, shL1: 0.585, shR0: 0.758, shR1: 0.79, sheepV: 0.5, lion0: 0.42, lion1: 0.53, lionV: 0.32, lionBack: 0.09,
    holy: 0.82, starX: 0.2, starY: 0.42, arkX: 0.34, arkY: 0.45,
    more0: 0.8, more1: 0.9, moreV: 0.8, aboveY: 0.36, newX: 0.62,
  };
  const X = Object.assign({}, XD);
  let PORT = false;
  const Pk = k => (PORT ? PP[k] : PD[k]) || [0.7, 0];
  function layout() {
    PORT = W.w < W.h * 0.9;
    Object.assign(X, PORT ? XP : XD);
    GROVE = null; FIELD = null;
  }

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { gave: 0, called: 0, sheep: 0, more: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const boost = () => (W.w < 600 ? 1.55 : 1);
  const LS = l => W.layerScale(l) * boost() * (LK[l] || 1);
  const PH = () => 34 * LS(2);
  const DEP = l => (W.LAYERS && W.LAYERS[l] ? W.LAYERS[l].depth : [0.85, 0.45, 0][l]);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const sstep = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);

  // 人物（皆经人物模块）
  const C = () => cast();
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const has = id => { const c = C(); return !!(c && (c.has ? c.has(id) : c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } }
  function sfx(b, name, o) { if (b && b.instant) return; const a = au(); if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o)); }
  function shake(b, k) { if (!b.instant) W.shake = Math.max(W.shake || 0, k); }
  function flashW(b, k) { if (!b.instant) W.flash = Math.max(W.flash || 0, k); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  function crowdGlow(gid, v) { const c = C(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; if (g) g.members.forEach(m => { m.glow = v; }); }
  function crowdPose(gid, p) { const c = C(); if (hasCrowd(gid)) c.crowdPose(gid, p); }
  // 一群人前后错开（v0..v1，按次序，不随机）
  function crowdV(gid, v0, v1) { const c = C(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; if (g) g.members.forEach((m, i) => { m.v = lerp(v0, v1, (i * 0.618) % 1); }); }
  function crowdFace(gid, d) { const c = C(); const g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null; if (g) g.members.forEach(m => { if (!m.tx) { m.facing = d; if (W.replaying) m.fd = d; } }); }

  // 在近地纵深里前后缓缓移动（v）：看时缓缓地走过去，重演时立即到位
  const VT = new Map();
  function setV(id, v) {
    const f = fig(id);
    if (!f || v == null) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }
  // 走到某处（p = [x, v]）
  function go(id, p, o) {
    if (!has(id) || !p) return;
    C().walk(id, p[0], Object.assign({ speed: 0.04, pose: 'stand' }, o || {}));
    setV(id, p[1]);
  }

  // 在大约 t 秒里走到某处（手机上路程的比例不同，按路程定速度）
  function goT(id, p, t, o) {
    const f = fig(id);
    if (!f || !p) return;
    go(id, p, Object.assign({}, o || {}, { speed: Math.max(0.025, Math.abs(p[0] - f.nx) / t) }));
  }

  // 本幕有名字的人
  const NAMED = ['farmer', 'poor', 'hearer', 'peter', 'doer', 'widow', 'orphan'];
  const present = () => NAMED.filter(id => has(id));
  function all(fn) { present().forEach(fn); }
  function crowdsAll(fn) { for (const g of ['saints', 'darkL', 'darkR', 'more']) if (hasCrowd(g)) fn(g); }

  // 人身上的一点（像素）：k 0 = 脚，1 = 头顶
  function ptOf(f, k) {
    if (!f) return null;
    const kk = k == null ? 0.6 : k;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || PH()) * kk];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v || 0) - PH() * kk];
  }
  const figPt = (id, k) => ptOf(fig(id), k);
  function crowdPts(gid, k) {
    const c = C(), g = c && c.crowds && c.crowds.get ? c.crowds.get(gid) : null, out = [];
    if (g) for (const m of g.members) if (!m.dying && (m.alpha == null || m.alpha > 0.3)) { const p = ptOf(m, k); if (p) out.push(p); }
    return out;
  }

  // 名字（光聚成的字）：在干净的天上
  function nameAt(b, str, xf, yf, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(0.034 * M(), Math.min(o.size || (PORT ? 0.07 * W.w : 40 * u), (W.w * 0.8) / (n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 6, W.w - half - 6), cy = yf * W.h;
    const src = o.src || (() => [cx + (Math.random() - 0.5) * 60 * u, cy + 40 * u + Math.random() * 30 * u]);
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 228, 170], src, { hold: o.hold || 3.4 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function ringAt(b, x, y, r, rgb, dur, w) {
    if (b.instant || !fx()) return;
    fx().ring(x, y, rgb || [255, 240, 204], M() * (r || 0.2), dur || 2.4, w || 1.6);
  }
  function sparkleAt(b, x, y, n, rgb, spread) {
    if (b.instant || !fx()) return;
    fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], (spread || 14) * SU(), 'top');
  }
  function ringOn(b, id, r, rgb, k) { const p = figPt(id, k == null ? 0.55 : k); if (p) ringAt(b, p[0], p[1], r, rgb); }
  function sparkleOn(b, id, n, rgb, k) { const p = figPt(id, k == null ? 0.6 : k); if (p) sparkleAt(b, p[0], p[1], n, rgb); }

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
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([248, 248, 255], 1),
        pale: radial([226, 234, 255], 1), lamp: radial([255, 150, 60], 1, 0.22), dawn: radial([255, 214, 150], 1, 0.5),
        cloud: radial([255, 250, 238], 1, 0.6), smoke: radial([40, 34, 34], 1, 0.6), steam: radial([236, 236, 236], 1, 0.55),
        ember: radial([170, 46, 30], 1, 0.4), cold: radial([10, 10, 16], 1, 0.62), green: radial([196, 255, 170], 1, 0.3),
        mist: radial([96, 110, 142], 1, 0.62), core: radial([62, 18, 18], 1, 0.5),
      };
      // 自天而降的光柱：上淡、中亮、下渐隐
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,246,222,0)'); hz.addColorStop(0.5, 'rgba(255,250,236,1)'); hz.addColorStop(1, 'rgba(255,246,222,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.12)'); vt.addColorStop(0.72, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
      // 门里铺出来的光（扇形）：上窄下宽，渐远渐淡
      const f = cnv(128, 64), gf = f.getContext('2d');
      const fv = gf.createLinearGradient(0, 0, 0, 64);
      fv.addColorStop(0, 'rgba(255,232,180,0.24)'); fv.addColorStop(0.6, 'rgba(255,232,180,0.08)'); fv.addColorStop(1, 'rgba(255,232,180,0)');
      gf.fillStyle = fv;
      for (let k = 0; k < 5; k++) {
        const w0 = 8 + k * 3, w1 = 34 + k * 7;
        gf.beginPath(); gf.moveTo(64 - w0, 0); gf.lineTo(64 + w0, 0); gf.lineTo(64 + w1, 64); gf.lineTo(64 - w1, 64); gf.closePath(); gf.fill();
      }
      SP.fan = f;
      // 自地平线向上的光芒：根亮梢淡
      const ry = cnv(32, 256), gr2 = ry.getContext('2d');
      const rh = gr2.createLinearGradient(0, 0, 32, 0);
      rh.addColorStop(0, 'rgba(255,240,206,0)'); rh.addColorStop(0.5, 'rgba(255,244,216,1)'); rh.addColorStop(1, 'rgba(255,240,206,0)');
      gr2.fillStyle = rh; gr2.fillRect(0, 0, 32, 256);
      gr2.globalCompositeOperation = 'destination-in';
      const rv = gr2.createLinearGradient(0, 0, 0, 256);
      rv.addColorStop(0, 'rgba(0,0,0,0)'); rv.addColorStop(1, 'rgba(0,0,0,1)');
      gr2.fillStyle = rv; gr2.fillRect(0, 0, 32, 256);
      SP.ray = ry;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火苗（林边的小火）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP || !(h > 0.3)) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.2, k * (0.28 + 0.4 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
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
  // 发光的人形（圣山的异象、方舟上的人）：没有面目，只有光
  function lightFigure(ctx, x, y, h, a, seed, col, halo) {
    if (a < 0.01 || h < 0.8 || !SP) return;
    ctx.globalAlpha = a * (halo == null ? 0.45 : halo);
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = a;
    ctx.fillStyle = col || 'rgb(255,252,244)';
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
  // 四角的星（晨星）
  function starShape(ctx, x, y, r, a, rgb) {
    if (a < 0.01) return;
    ctx.globalAlpha = a;
    ctx.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * TAU - Math.PI / 2, rr = i % 2 ? r * 0.22 : r * (i % 4 ? 0.62 : 1);
      const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function trans(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

  // ════════════════════════════════════════════════════════════
  //  灵宫：石台（锡安的磐石）上，一块一块光的石头砌成
  // ════════════════════════════════════════════════════════════
  function houseG() {
    const s = LS(2) * (PORT ? 0.9 : 1.3), cx = X.site * W.w, hw = 52 * s, mh = 12 * s;
    const g = Math.max(gY(2, (cx - hw) / W.w), gY(2, X.site), gY(2, (cx + hw) / W.w));
    const y = g + 1.5 * s - mh;
    const ch = 9 * s, wallH = 5 * ch, roofH = 23 * s;
    return { s, cx, hw, y, g, mh, ch, wallH, roofH, top: y - wallH, apex: y - wallH - roofH, door: 8.5 * s, doorH: 3 * ch };
  }
  // 墙上的石头（以 s 为单位的局部坐标）：五层，交错砌；门两旁断开，门上一块门楣
  let STONES = null;
  function stoneModel() {
    if (STONES) return STONES;
    const r = U.mulberry32(2605), HW = 52, DOOR = 8.5, list = [];
    const spans = (a, b, c) => {
      const out = [];
      let x = a;
      if (c % 2 && b - a > 20) { const w0 = 6 + r() * 4; out.push([x, x + w0]); x += w0; }
      while (x < b - 0.5) {
        let w = 11.5 + r() * 6.5, x1 = Math.min(b, x + w);
        if (b - x1 < 6) x1 = b;
        out.push([x, x1]);
        x = x1;
      }
      return out;
    };
    for (let c = 0; c < 5; c++) {
      let row;
      if (c < 3) row = spans(-HW, -DOOR, c).concat(spans(DOOR, HW, c + 1));
      else if (c === 3) row = spans(-HW, -DOOR - 4, c).concat([[-DOOR - 4, DOOR + 4]], spans(DOOR + 4, HW, c + 1));
      else row = spans(-HW, HW, c);
      for (const q of row) list.push({ c, x0: q[0], x1: q[1], seed: r(), lintel: c === 3 && q[0] === -DOOR - 4 });
    }
    // 房角石：第一层最左的一块（本幕第七句安放）
    list[0].corner = true;
    const build = list.filter(q => !q.corner);
    build.forEach((q, i) => { q.k = i; q.th = (i / build.length) * 0.86; });
    STONES = { list, build, corner: list[0] };
    return STONES;
  }
  // 一块石头在画面上的矩形
  function stoneRect(G, q) {
    const s = G.s, gap = 0.7 * s;
    const x0 = G.cx + q.x0 * s + gap / 2, x1 = G.cx + q.x1 * s - gap / 2;
    const y1 = G.y - q.c * G.ch - gap / 2, y0 = G.y - (q.c + 1) * G.ch + gap / 2;
    return { x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
  }
  const STONE_C = [228, 214, 188], STONE_LIVE = [250, 238, 206], ROCK = [150, 142, 128];
  function placed(q) { return q.corner ? lv('lsLift') >= 0.999 : lv('lsBuild') >= q.th + 0.14; }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  }
  // 石台（锡安的磐石）：一座隆起的、顶上平坦的石丘——圆而不齐的岩边，顶上受光，正面在阴影里；灵宫立在其上
  function rockPath(ctx, G, top, gb) {
    const s = G.s;
    const a0 = G.cx - G.hw - 27 * s, a1 = G.cx - G.hw - 6 * s, b1 = G.cx + G.hw + 6 * s, b0 = G.cx + G.hw + 27 * s;
    const h = gb - top;
    ctx.moveTo(a0, gb);
    // 左肩：一块圆石鼓起，再一道缓坡上到顶
    ctx.quadraticCurveTo(a0 + 1 * s, gb - h * 0.5, a0 + 7 * s, gb - h * 0.58);
    ctx.quadraticCurveTo(a0 + 11 * s, gb - h * 0.64, a0 + 13 * s, gb - h * 0.55);
    ctx.bezierCurveTo(a0 + 15 * s, gb - h * 0.9, a1 - 5 * s, top - 0.6 * s, a1, top);
    // 顶：灵宫以外微有起伏
    ctx.lineTo(G.cx - G.hw + 2 * s, top);
    ctx.lineTo(G.cx + G.hw - 2 * s, top);
    ctx.quadraticCurveTo(b1 - 3 * s, top - 0.8 * s, b1, top + 0.2 * s);
    // 右肩：两级岩阶
    ctx.bezierCurveTo(b1 + 5 * s, top + 0.4 * s, b0 - 16 * s, gb - h * 0.95, b0 - 12 * s, gb - h * 0.62);
    ctx.quadraticCurveTo(b0 - 8 * s, gb - h * 0.7, b0 - 5 * s, gb - h * 0.5);
    ctx.quadraticCurveTo(b0 - 1 * s, gb - h * 0.35, b0, gb);
    ctx.closePath();
    return { a0, a1, b1, b0 };
  }
  function drawRock(ctx, G) {
    const s = G.s, l = 2, top = G.y + 0.6 * s, gb = G.g + 4 * s, h = gb - top;
    ctx.beginPath();
    const E = rockPath(ctx, G, top, gb);
    ctx.fillStyle = css(mul(ROCK, 0.8), l);
    ctx.fill();
    ctx.save();
    ctx.clip();
    // 正面：一块块斜着裂开的岩面，深浅不一
    const N = 9, xs = [];
    for (let i = 0; i <= N; i++) xs.push(lerp(E.a0, E.b0, i / N) + (i && i < N ? (hsh(i * 3.7) - 0.5) * 10 * s : 0));
    for (let i = 0; i < N; i++) {
      const k0 = (hsh(i * 2.9) - 0.5) * 6 * s, k1 = (hsh(i * 2.9 + 1) - 0.5) * 6 * s;
      ctx.fillStyle = css(mul(ROCK, 0.74 + 0.26 * hsh(i * 5.3)), l);
      ctx.beginPath();
      ctx.moveTo(xs[i], top - 3 * s); ctx.lineTo(xs[i + 1], top - 3 * s);
      ctx.lineTo(xs[i + 1] + k1, top + h * 0.55); ctx.lineTo(xs[i + 1] + k1 * 0.4, gb + 3 * s);
      ctx.lineTo(xs[i] + k0 * 0.4, gb + 3 * s); ctx.lineTo(xs[i] + k0, top + h * 0.55);
      ctx.closePath(); ctx.fill();
    }
    // 上亮下暗
    const gr = ctx.createLinearGradient(0, top, 0, gb);
    gr.addColorStop(0, U.rgba(255, 246, 226, 0.16 * dayA()));
    gr.addColorStop(0.3, 'rgba(0,0,0,0)');
    gr.addColorStop(1, 'rgba(10,8,12,0.42)');
    ctx.fillStyle = gr;
    ctx.fillRect(E.a0 - 2, top - 4 * s, E.b0 - E.a0 + 4, h + 8 * s);
    // 岩缝：沿着岩面的分界，曲折向下
    ctx.strokeStyle = css(mul(ROCK, 0.42), l, 0.8); ctx.lineWidth = Math.max(0.6, 0.8 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 1; i < N; i++) {
      const k0 = (hsh(i * 2.9) - 0.5) * 6 * s;
      ctx.moveTo(xs[i] + k0 * 0.2, top + h * (0.2 + 0.15 * hsh(i * 8.1)));
      ctx.lineTo(xs[i] + k0, top + h * 0.55); ctx.lineTo(xs[i] + k0 * 0.4, gb);
    }
    // 几道短的横纹
    for (let i = 0; i < 5; i++) {
      const x = lerp(E.a1, E.b1, 0.1 + 0.8 * hsh(i * 7.3)), y = top + h * (0.4 + 0.3 * hsh(i * 4.1)), w = (4 + 6 * hsh(i * 1.9)) * s;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w * 0.5, y + 1 * s, x + w, y - 0.4 * s);
    }
    ctx.stroke(); ctx.lineCap = 'butt';
    ctx.restore();
    // 顶面：一条受光的平台
    ctx.fillStyle = css(mul(ROCK, 1.14), l, 1, 0.08);
    ctx.beginPath();
    ctx.moveTo(E.a1 - 1 * s, top); ctx.lineTo(E.b1 + 1 * s, top); ctx.lineTo(E.b1 - 1.5 * s, top + 2.4 * s); ctx.lineTo(E.a1 + 1.5 * s, top + 2.4 * s); ctx.closePath();
    ctx.fill();
    // 脚下几块圆石
    ctx.fillStyle = css(mul(ROCK, 0.72), l);
    ctx.beginPath();
    ctx.ellipse(E.a0 + 3 * s, gb - 1.6 * s, 4.4 * s, 2.6 * s, 0, 0, TAU);
    ctx.moveTo(E.b0 + 1.8 * s, gb - 1.4 * s); ctx.ellipse(E.b0 - 2 * s, gb - 1.4 * s, 3.8 * s, 2.2 * s, 0, 0, TAU);
    ctx.moveTo(E.b0 + 6.4 * s, gb - 0.8 * s); ctx.ellipse(E.b0 + 4 * s, gb - 0.8 * s, 2.4 * s, 1.5 * s, 0, 0, TAU);
    ctx.fill();
    // 受光的顶边与左肩
    ctx.strokeStyle = css([252, 244, 224], l, 0.5 * dayA() + 0.12, 0.2); ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.beginPath();
    ctx.moveTo(E.a0 + 1 * s, gb - h * 0.45);
    ctx.quadraticCurveTo(E.a0 + 2 * s, gb - h * 0.55, E.a0 + 7 * s, gb - h * 0.58);
    ctx.quadraticCurveTo(E.a0 + 11 * s, gb - h * 0.64, E.a0 + 13 * s, gb - h * 0.55);
    ctx.bezierCurveTo(E.a0 + 15 * s, gb - h * 0.9, E.a1 - 5 * s, top - 0.6 * s, E.a1, top);
    ctx.lineTo(E.b1, top + 0.2 * s);
    ctx.stroke();
  }
  // 被弃的石头：粗糙的八边形；房角石的槽位：矩形。二者之间按 u 变形
  const ROUGH = [[-7.4, 0.6], [-6.2, -3.6], [-2.6, -5.2], [2.4, -4.6], [6.8, -3.4], [7.6, 0.2], [4.2, 1.2], [-3.8, 1.4]];
  function cornerPts(G, u) {
    const s = G.s, q = stoneModel().corner, R = stoneRect(G, q);
    const rp = Pk('stone'), rx = rp[0] * W.w, ry = baseY(2, rp[0], rp[1]);
    // 槽位上的八个点（沿矩形的边）
    const RS = [[R.x0, R.y1], [R.x0, R.cy], [R.x0, R.y0], [R.cx, R.y0], [R.x1, R.y0], [R.x1, R.cy], [R.x1, R.y1], [R.cx, R.y1]];
    const e = sstep(u);
    // 沿一道弧线：先升起，再移过去
    const lift = Math.sin(Math.PI * e) * (28 * s + Math.abs(R.cx - rx) * 0.25);
    const ang = lerp(-0.12, 0, e);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const out = [];
    for (let i = 0; i < 8; i++) {
      const p = ROUGH[i];
      const ax = rx + (p[0] * ca - p[1] * sa) * s * 1.05, ay = ry + (p[0] * sa + p[1] * ca) * s * 1.05;
      const bx = RS[i][0], by = RS[i][1];
      out.push([lerp(ax, bx, e), lerp(ay, by, e) - lift]);
    }
    return { pts: out, R, e, cx: lerp(rx, R.cx, e), cy: lerp(ry - 2.2 * s, R.cy, e) - lift };
  }
  function drawCornerStone(ctx, G) {
    const u = lv('lsLift'), glowK = Math.max(lv('lsBeam'), u > 0.001 ? 1 : 0);
    const P = cornerPts(G, u);
    const col = mix(ROCK, STONE_LIVE, clamp(glowK * 0.35 + P.e * 0.65, 0, 1));
    ctx.fillStyle = css(col, 2, 1, 0.1 + 0.4 * P.e);
    ctx.beginPath();
    P.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath(); ctx.fill();
    if (P.e < 0.6) {
      // 粗石上的一点苔与裂纹
      ctx.strokeStyle = css(mul(ROCK, 0.6), 2, 0.7 * (1 - P.e));
      ctx.lineWidth = Math.max(0.5, 0.6 * G.s);
      ctx.beginPath(); ctx.moveTo(P.pts[1][0] + 2 * G.s, P.pts[1][1] + 1 * G.s); ctx.lineTo(P.cx, P.cy); ctx.stroke();
    }
    ctx.strokeStyle = css([255, 246, 226], 2, 0.4 * dayA() + 0.3 * P.e, 0.2);
    ctx.lineWidth = Math.max(0.5, 0.7 * G.s);
    ctx.beginPath(); ctx.moveTo(P.pts[2][0], P.pts[2][1]); ctx.lineTo(P.pts[3][0], P.pts[3][1]); ctx.lineTo(P.pts[4][0], P.pts[4][1]); ctx.stroke();
  }
  function drawHouse(ctx) {
    const G = houseG(), s = G.s, l = 2, M0 = stoneModel();
    drawRock(ctx, G);
    // 墙
    const d = litX() >= G.cx ? 1 : -1;
    for (const q of M0.list) {
      if (q.corner || !placed(q)) continue;
      const R = stoneRect(G, q), tone = 0.9 + 0.12 * q.seed;
      ctx.fillStyle = css(mul(STONE_C, tone), l, 1, 0.12 * lv('lsHouse'));
      ctx.beginPath(); roundRect(ctx, R.x0, R.y0, R.w, R.h, 1.4 * s); ctx.fill();
      ctx.fillStyle = css(mul(STONE_C, 0.74), l, 0.55);
      ctx.fillRect(d > 0 ? R.x0 : R.x1 - R.w * 0.16, R.y0, R.w * 0.16, R.h);
    }
    // 门：屋里的光
    const built = lv('lsBuild');
    if (built > 0.02) {
      const dh = G.doorH * clamp((built - 0.02) / 0.6, 0, 1);
      const IN = mix([40, 32, 26], [255, 230, 176], clamp(lv('lsHouse') * 0.5 + lv('lsDoor') * 0.5, 0, 1));
      ctx.fillStyle = U.rgb(IN[0] | 0, IN[1] | 0, IN[2] | 0);
      if (dh > 0.8 * s) ctx.fillRect(G.cx - G.door + 0.4 * s, G.y - dh + 0.4 * s, G.door * 2 - 0.8 * s, dh - 0.4 * s);
    }
    // 山墙（门楣之上）
    const rf = lv('lsRoof');
    if (rf > 0.005) {
      const ex = 6 * s;
      ctx.save();
      ctx.beginPath(); ctx.rect(G.cx - G.hw - ex - 2, G.top - G.roofH * rf - 1, (G.hw + ex) * 2 + 4, G.roofH * rf + 3 * s + 2); ctx.clip();
      ctx.fillStyle = css(STONE_C, l, 1, 0.15 * lv('lsHouse'));
      ctx.beginPath();
      ctx.moveTo(G.cx - G.hw - ex, G.top + 0.5 * s); ctx.lineTo(G.cx, G.apex); ctx.lineTo(G.cx + G.hw + ex, G.top + 0.5 * s);
      ctx.closePath(); ctx.fill();
      // 檐口
      ctx.fillStyle = css(mul(STONE_C, 0.82), l);
      ctx.fillRect(G.cx - G.hw - ex, G.top - 0.2 * s, (G.hw + ex) * 2, 2.6 * s);
      // 山墙上的一道道石缝
      ctx.strokeStyle = css(mul(STONE_C, 0.72), l, 0.7); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath();
      for (let i = 1; i < 3; i++) {
        const yy = G.top - (G.roofH * i) / 3, half = (G.hw + ex) * (1 - i / 3);
        ctx.moveTo(G.cx - half, yy); ctx.lineTo(G.cx + half, yy);
      }
      ctx.stroke();
      // 圆窗
      ctx.fillStyle = U.rgba(255, 236, 190, 0.6 + 0.4 * lv('lsHouse'));
      ctx.beginPath(); ctx.arc(G.cx, G.top - G.roofH * 0.42, 3.4 * s, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([255, 246, 226], l, 0.45 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(G.cx - G.hw - ex, G.top + 0.5 * s); ctx.lineTo(G.cx, G.apex); ctx.lineTo(G.cx + G.hw + ex, G.top + 0.5 * s); ctx.stroke();
      ctx.restore();
    }
    // 房角石（或还躺在石台边的被弃的石头）
    drawCornerStone(ctx, G);
  }
  // 灵宫的光：每块活石里的光、门里的光、铺出去的扇形光、灵祭
  function drawHouseLight(ctx) {
    if (!SP) return;
    const G = houseG(), s = G.s, M0 = stoneModel(), nk = nightK(), hk = lv('lsHouse');
    ctx.globalCompositeOperation = 'lighter';
    if (hk > 0.01) {
      glowAt(ctx, SP.gold, G.cx, G.y - G.wallH * 0.6, G.hw * 2.4, hk * (0.1 + 0.34 * nk), 0.8);
      for (const q of M0.list) {
        if (q.corner || !placed(q)) continue;
        const R = stoneRect(G, q), pul = 0.8 + 0.2 * Math.sin(W.t * 1.3 + q.seed * 17);
        glowAt(ctx, SP.gold, R.cx, R.cy, R.w * 0.62, hk * pul * (0.12 + 0.3 * nk));
      }
      if (lv('lsRoof') > 0.9) glowAt(ctx, SP.white, G.cx, G.top - G.roofH * 0.42, 9 * s, hk * (0.35 + 0.4 * nk));
    }
    // 房角石的光
    const cu = lv('lsLift');
    if (cu > 0.001 || lv('lsBeam') > 0.01) {
      const P = cornerPts(G, cu);
      const pul = 0.85 + 0.15 * Math.sin(W.t * 1.7);
      glowAt(ctx, SP.gold, P.cx, P.cy, 16 * s * pul, (0.25 + 0.4 * nk) * Math.max(lv('lsBeam'), cu > 0.001 ? 0.9 : 0));
      glowAt(ctx, SP.white, P.cx, P.cy, 5 * s, 0.5 * Math.max(lv('lsBeam'), cu > 0.001 ? 1 : 0));
    }
    // 门里的光与铺出去的光
    const dk = Math.max(lv('lsDoor'), hk * 0.4) * clamp((lv('lsBuild') - 0.1) / 0.4, 0, 1);
    if (dk > 0.01) {
      glowAt(ctx, SP.warm, G.cx, G.y - G.doorH * 0.5, G.door * 2.6, dk * (0.25 + 0.45 * nk), 1.3);
      const fk = lv('lsDoor');
      if (fk > 0.01 && SP.fan) {
        const fw = G.door * 2.4 + G.hw * (1.2 + 2.6 * lv('lsCall')), fh = (W.h - G.y) * (0.55 + 0.45 * lv('lsCall'));
        ctx.globalAlpha = fk * (0.03 + 0.3 * nk);
        ctx.drawImage(SP.fan, G.cx - fw / 2, G.y - 1 * s, fw, fh);
      }
    }
    // 奇妙的光铺满地面
    const cl = lv('lsCall');
    if (cl > 0.01) {
      const R = lerp(G.hw * 1.6, Math.max(W.w * 0.36, G.hw * 3), sstep(cl));
      glowAt(ctx, SP.gold, G.cx, G.y + 8 * s, R, cl * lv('lsDoor') * (0.12 + 0.24 * nk), 0.3);
    }
    // 灵祭：香烟一样升起的光
    const ok = lv('lsOffer');
    if (ok > 0.01 && lv('lsRoof') > 0.5) {
      for (let k = 0; k < 3; k++) {
        const bx = G.cx + (k - 1) * G.hw * 0.42, by = k === 1 ? G.apex : G.top - G.roofH * 0.3;
        for (let j = 0; j < 12; j++) {
          const ph = ((W.t * 0.35 + j / 12 + k * 0.29) % 1);
          const y = by - ph * G.roofH * 3.4;
          const x = bx + Math.sin(W.t * 0.8 + ph * 7 + k * 2) * 5 * s * ph;
          glowAt(ctx, SP.gold, x, y, (3.2 + 3 * ph) * s, ok * (1 - ph) * (0.3 + 0.35 * nk));
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 光照在被弃的石头上（本幕第七句）：一道光柱，随石头移动
  function drawBeam(ctx) {
    const k = lv('lsBeam');
    if (k < 0.01 || !SP) return;
    const G = houseG(), P = cornerPts(G, lv('lsLift'));
    const w = 26 * G.s * (0.8 + 0.2 * k);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.55;
    ctx.drawImage(SP.beam, P.cx - w / 2, -10, w, P.cy + 12);
    glowAt(ctx, SP.white, P.cx, P.cy, 22 * G.s, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 活石：从各人胸中升起，沿一道弧线飞去砌在墙上
  function stoneSources() {
    const out = [];
    for (const id of NAMED) { const p = figPt(id, 0.6); if (p) out.push(p); }
    for (const g of ['saints']) for (const p of crowdPts(g, 0.6)) out.push(p);
    return out;
  }
  function drawFlights(ctx) {
    const bl = lv('lsBuild');
    if (bl <= 0.001 || bl >= 1 || !SP) return;
    const G = houseG(), M0 = stoneModel(), src = stoneSources();
    if (!src.length) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const q of M0.build) {
      const u = (bl - q.th) / 0.14;
      if (u <= 0 || u >= 1) continue;
      const a = src[(q.k * 5 + (q.k >> 2)) % src.length], R = stoneRect(G, q);
      const e = U.easeInOut ? U.easeInOut(u) : sstep(u);
      const mx = (a[0] + R.cx) / 2, my = Math.min(a[1], R.cy) - 40 * G.s - Math.abs(a[0] - R.cx) * 0.25;
      const mt = 1 - e;
      const x = mt * mt * a[0] + 2 * mt * e * mx + e * e * R.cx, y = mt * mt * a[1] + 2 * mt * e * my + e * e * R.cy;
      const sz = lerp(0.45, 1, e);
      glowAt(ctx, SP.gold, x, y, R.w * 0.9 * sz, 0.75);
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = 'rgb(255,244,214)';
      ctx.beginPath(); roundRect(ctx, x - (R.w * sz) / 2, y - (R.h * sz) / 2, R.w * sz, R.h * sz, 1.4 * G.s); ctx.fill();
      // 尾光
      for (let j = 1; j < 5; j++) {
        const tt = Math.max(0, e - j * 0.05), m2 = 1 - tt;
        const px = m2 * m2 * a[0] + 2 * m2 * tt * mx + tt * tt * R.cx, py = m2 * m2 * a[1] + 2 * m2 * tt * my + tt * tt * R.cy;
        glowAt(ctx, SP.gold, px, py, (5 - j) * G.s, 0.5 * (1 - j / 5));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  帐棚（寄居的人）
  // ════════════════════════════════════════════════════════════
  function tentG(xf) { const s = LS(2) * (PORT ? 0.95 : 1.35); return { s, x: xf * W.w, y: baseY(2, xf, 0.02) + 1 * s, w: 36 * s, h: 17 * s }; }
  function drawTent(ctx, xf, seed) {
    if (!(xf > 0)) return;
    const G = tentG(xf), s = G.s, x = G.x, y = G.y, w = G.w, h = G.h, l = 2, nk = nightK();
    const HAIR = [70, 56, 46];
    // 拉绳与木橛
    ctx.strokeStyle = css([120, 100, 80], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.5 * s);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, y - h * 0.8); ctx.lineTo(x - w * 0.66, y);
    ctx.moveTo(x + w * 0.42, y - h * 0.8); ctx.lineTo(x + w * 0.66, y);
    ctx.stroke();
    ctx.fillStyle = css(HAIR, l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x - w * 0.42, y - h * 0.8);
    ctx.quadraticCurveTo(x - w * 0.22, y - h * 1.02, x, y - h);
    ctx.quadraticCurveTo(x + w * 0.22, y - h * 1.02, x + w * 0.42, y - h * 0.8);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    // 羊毛布的条纹
    ctx.fillStyle = css([104, 86, 66], l, 0.7);
    for (const f of [-0.28, 0.06, 0.34]) ctx.fillRect(x + f * w, y - h * 0.9, 1.6 * s, h * 0.9);
    // 门帘开处：夜里一点灯光
    const ox = x - w * 0.12 + seed * w * 0.1;
    const IN = mix([28, 22, 18], [200, 130, 64], nk);
    ctx.fillStyle = U.rgba(IN[0] | 0, IN[1] | 0, IN[2] | 0, 1);
    ctx.beginPath(); ctx.moveTo(ox - 5 * s, y); ctx.lineTo(ox, y - h * 0.72); ctx.lineTo(ox + 5 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([240, 226, 200], l, 0.3 * dayA(), 0.1); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - h * 0.8); ctx.quadraticCurveTo(x - w * 0.22, y - h * 1.02, x, y - h); ctx.quadraticCurveTo(x + w * 0.22, y - h * 1.02, x + w * 0.42, y - h * 0.8); ctx.stroke();
    if (SP && nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, ox, y - h * 0.3, 10 * s, 0.55 * nk);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  旱田：一行行陇沟；出苗、黄熟、枯干；活泼的盼望（光的新芽）
  // ════════════════════════════════════════════════════════════
  let FIELD = null;
  function fieldModel() {
    if (FIELD) return FIELD;
    const rows = [], NR = 6;
    for (let r = 0; r < NR; r++) {
      const v = X.fieldV0 + r * X.fieldDV;
      // 桌面：陇沟顺着山坡，越往前越短；竖屏：田在石台之前的平地上，越往前越宽
      const a = PORT ? X.field0 + (NR - 1 - r) * 0.006 : X.field0 + (NR - 1 - r) * 0.004, b = PORT ? X.field1 - (NR - 1 - r) * 0.008 : X.field1 - r * 0.006;
      const plants = [];
      const n = Math.max(8, Math.round(((b - a) * W.w) / (3.2 * LS(2))));
      for (let i = 0; i < n; i++) plants.push({ f: lerp(a, b, (i + 0.5) / n), seed: hsh(r * 31 + i * 7.3) });
      rows.push({ v, a, b, plants });
    }
    FIELD = rows;
    return FIELD;
  }
  const SOIL_DRY = [150, 118, 82], SOIL_WET = [88, 64, 44];
  function drawField(ctx) {
    const s = LS(2), l = 2, rows = fieldModel();
    const sp = lv('lsSprout'), gold = lv('lsGold'), wit = lv('lsWither');
    const soil = mix(SOIL_DRY, SOIL_WET, clamp(W.lv.rain * 1.6 + sp * 0.5, 0, 1) * (1 - wit * 0.6));
    for (const row of rows) {
      const N = 10;
      ctx.strokeStyle = css(soil, l, 0.95);
      ctx.lineWidth = Math.max(1, 2.4 * s);
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const f = lerp(row.a, row.b, i / N), y = baseY(2, f, row.v); if (i) ctx.lineTo(f * W.w, y); else ctx.moveTo(f * W.w, y); }
      ctx.stroke();
      ctx.strokeStyle = css(mul(soil, 1.25), l, 0.35 * dayA());
      ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const f = lerp(row.a, row.b, i / N), y = baseY(2, f, row.v) - 1.1 * s; if (i) ctx.lineTo(f * W.w, y); else ctx.moveTo(f * W.w, y); }
      ctx.stroke();
      ctx.lineCap = 'butt';
      if (sp < 0.02) continue;
      // 禾苗 → 麦穗
      let col = mix([84, 138, 60], [222, 184, 92], gold);
      col = mix(col, [178, 158, 116], wit);
      const sk = 1 + 0.22 * (row.v - X.fieldV0) / (X.fieldDV * 5);
      ctx.strokeStyle = css(col, l);
      ctx.lineWidth = Math.max(0.7, 1.1 * s);
      ctx.beginPath();
      const heads = [];
      const leaf = 1 - gold * 0.8;
      for (const p of row.plants) {
        const g = clamp(sp * 1.25 - p.seed * 0.25, 0, 1);
        if (g <= 0) continue;
        const x = p.f * W.w, y = baseY(2, p.f, row.v) - 0.8 * s;
        const h = (3 + 11 * g) * s * sk * (1 - 0.3 * wit) * (0.85 + 0.3 * p.seed);
        const bend = (Math.sin(W.t * 1.3 + p.seed * 9) * 0.6 + W.wind * 0.8 + wit * 3.2 * (p.seed > 0.5 ? 1 : -0.6)) * s;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + bend * 0.3, y - h * 0.6, x + bend, y - h);
        // 两片叶子（青苗时）
        if (leaf > 0.3 && g > 0.25) {
          const ly = y - h * 0.45, lw = 2.6 * s * g * leaf;
          ctx.moveTo(x + bend * 0.15, ly); ctx.quadraticCurveTo(x - lw * 0.6, ly - lw * 0.5, x - lw, ly - lw * 0.2);
          ctx.moveTo(x + bend * 0.2, ly - h * 0.1); ctx.quadraticCurveTo(x + lw * 0.7, ly - h * 0.1 - lw * 0.5, x + lw, ly - h * 0.1 - lw * 0.15);
        }
        if (gold > 0.25 && g > 0.8) heads.push([x + bend, y - h, h]);
      }
      ctx.stroke();
      if (heads.length) {
        ctx.fillStyle = css(mix(mix([226, 190, 96], [244, 214, 120], gold), [184, 166, 124], wit), l, clamp((gold - 0.25) / 0.4, 0, 1));
        ctx.beginPath();
        for (const q of heads) { ctx.moveTo(q[0] + 0.9 * s, q[1]); ctx.ellipse(q[0], q[1], 0.9 * s, 2.2 * s * (1 - 0.3 * wit), 0, 0, TAU); }
        ctx.fill();
      }
    }
  }
  // 活泼的盼望：田里一行行发光的新芽（画在空中这一层，夜里也看得见）
  function drawHope(ctx) {
    const k = lv('lsHope');
    if (k < 0.01 || !SP) return;
    const s = LS(2), rows = fieldModel(), nk = nightK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgb(200,255,160)';
    ctx.lineWidth = Math.max(0.7, 1 * s);
    const path = new Path2D();
    for (const row of rows) {
      for (let i = 0; i < row.plants.length; i += 2) {
        const p = row.plants[i];
        const g = clamp((k - p.seed * 0.5) / 0.5, 0, 1);
        if (g <= 0) continue;
        const x = p.f * W.w + 1.5 * s, y = baseY(2, p.f, row.v) - 0.6 * s;
        const pul = 0.75 + 0.25 * Math.sin(W.t * 2 + p.seed * 13);
        const h = 4.2 * s * g;
        glowAt(ctx, SP.green, x, y - h * 0.6, 4.4 * s * g, (0.35 + 0.35 * nk) * pul);
        path.moveTo(x, y); path.lineTo(x, y - h);
        path.moveTo(x, y - h * 0.55); path.quadraticCurveTo(x + 1.6 * s, y - h * 0.9, x + 2.2 * s, y - h * 0.7);
      }
    }
    ctx.globalAlpha = 0.8;
    ctx.stroke(path);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  中丘左端的树林：最小的火能点着最大的树林（火只在林边，旋即被智慧熄灭）
  // ════════════════════════════════════════════════════════════
  let GROVE = null;
  function groveModel() {
    if (GROVE) return GROVE;
    const r = U.mulberry32(3517), n = PORT ? 6 : 9, out = [];
    for (let i = 0; i < n; i++) {
      const f = lerp(X.grove0, X.grove1, (i + 0.5) / n) + (r() - 0.5) * 0.008;
      out.push({ f, h: 26 + r() * 16, w: 6.5 + r() * 3.5, cyp: r() < 0.55, ph: r() * TAU, burn: i >= 1 && i <= n - 3 && r() < 0.85 });
    }
    GROVE = out;
    return GROVE;
  }
  function grovePt(i) { const g = groveModel(), t = g[clamp(i, 0, g.length - 1)], s = LS(1); return [t.f * W.w, gY(1, t.f) - t.h * 0.4 * s]; }
  function drawGrove(ctx) {
    const l = 1, s = LS(1), trees = groveModel();
    const d = litX() >= trees[0].f * W.w ? 1 : -1;
    for (const t of trees) {
      const x = t.f * W.w, y = gY(l, t.f) + 1.5 * s, sw = Math.sin(W.t * 0.9 + t.ph) * 0.6 * s * (0.4 + W.lv.gale);
      ctx.fillStyle = css([74, 56, 40], l);
      ctx.fillRect(x - 0.7 * s, y - 4 * s, 1.4 * s, 4 * s);
      if (t.cyp) {
        ctx.fillStyle = css([40, 70, 48], l);
        ctx.beginPath();
        ctx.moveTo(x - t.w * 0.5 * s, y - 3 * s);
        ctx.quadraticCurveTo(x - t.w * 0.6 * s, y - t.h * 0.6 * s, x + sw, y - t.h * s);
        ctx.quadraticCurveTo(x + t.w * 0.6 * s, y - t.h * 0.6 * s, x + t.w * 0.5 * s, y - 3 * s);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = css([88, 110, 78], l);
        ctx.beginPath();
        const hh = t.h * 0.62 * s;
        ctx.ellipse(x + sw * 0.5, y - 4 * s - hh * 0.5, t.w * 1.25 * s, hh * 0.5, 0, 0, TAU);
        ctx.ellipse(x - t.w * 0.7 * s + sw * 0.4, y - 4 * s - hh * 0.35, t.w * 0.8 * s, hh * 0.36, 0, 0, TAU);
        ctx.fill();
      }
      ctx.strokeStyle = css([240, 236, 206], l, 0.28 * dayA(), 0.1); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath(); ctx.moveTo(x + d * t.w * 0.2 * s, y - t.h * 0.85 * s); ctx.lineTo(x + d * t.w * 0.5 * s, y - t.h * 0.4 * s); ctx.stroke();
    }
    // 火与烟
    const k = lv('lsFire');
    if (k > 0.01) {
      trees.forEach((t, i) => {
        if (!t.burn) return;
        const x = t.f * W.w, y = gY(l, t.f) + 1 * s;
        const kk = clamp(k * 1.3 - (i % 3) * 0.12, 0, 1);
        flame(ctx, x - 3 * s, y, (8 + 5 * hsh(i)) * s * (0.6 + 0.6 * kk), kk, i * 3.1);
        flame(ctx, x + 4 * s, y, (6 + 4 * hsh(i + 5)) * s * (0.5 + 0.5 * kk), kk * 0.8, i * 5.7);
        if (SP) {
          for (let j = 0; j < 4; j++) {
            const ph = (W.t * 0.22 + j / 4 + i * 0.13) % 1;
            glowAt(ctx, SP.smoke, x + (ph * 14 + Math.sin(W.t + j) * 2) * s * (1 + W.lv.gale), y - (12 + ph * 46) * s, (7 + ph * 13) * s, kk * 0.32 * (1 - ph));
          }
        }
      });
    }
    const st = lv('lsSteam');
    if (st > 0.01 && SP) {
      trees.forEach((t, i) => {
        if (!t.burn) return;
        const x = t.f * W.w, y = gY(l, t.f);
        for (let j = 0; j < 3; j++) {
          const ph = (W.t * 0.18 + j / 3 + i * 0.21) % 1;
          glowAt(ctx, SP.steam, x + Math.sin(W.t * 0.7 + j + i) * 3 * s, y - (6 + ph * 30) * s, (4 + ph * 8) * s, st * 0.35 * (1 - ph));
        }
      });
    }
    ctx.globalAlpha = 1;
  }
  // 舌头就是火：火星落进二人脚边的干草，火沿着地烧开（火苗、黑烟）；火灭后，烧过的一片地
  const FIRE_N = 8;
  function firePt(i) { const f = lerp(X.fire0, X.fire1, i / (FIRE_N - 1)); return [f * W.w, baseY(2, f, X.fireV + (PORT ? (i % 2) * 0.05 : 0)) + 1]; }
  function drawGrassFire(ctx) {
    const sc = lv('lsScar'), k = lv('lsFire'), s = LS(2);
    if (sc > 0.01) {
      ctx.fillStyle = css([52, 40, 32], 2, 0.6 * sc);
      ctx.beginPath();
      for (let i = 0; i < FIRE_N; i++) { const p = firePt(i); ctx.moveTo(p[0] + 7.5 * s, p[1]); ctx.ellipse(p[0], p[1], 7.5 * s, 2.3 * s, 0, 0, TAU); }
      ctx.fill();
    }
    if (k < 0.01) return;
    for (let i = 0; i < FIRE_N; i++) {
      const on = clamp((k - (i / FIRE_N) * 0.55) / 0.3, 0, 1);
      if (on <= 0) continue;
      const p = firePt(i);
      if (SP) for (let j = 0; j < 3; j++) {
        const ph = (W.t * 0.24 + j / 3 + i * 0.17) % 1;
        glowAt(ctx, SP.smoke, p[0] + (ph * 16 + Math.sin(W.t * 0.8 + j + i) * 3) * s * (1 + W.lv.gale), p[1] - (14 + ph * 62) * s, (6 + ph * 15) * s, on * 0.3 * (1 - ph));
      }
      flame(ctx, p[0], p[1], (9 + 6 * hsh(i * 1.7)) * s * on, on, i * 2.3);
    }
    ctx.globalAlpha = 1;
  }
  // 从上头来的智慧：一道柔和的光，光点如细雨落在火上、二人与林子身上
  function drawWisdom(ctx) {
    const k = lv('lsWisdom');
    if (k < 0.01 || !SP) return;
    const x0 = (Math.min(X.fire0, Pk('farmer')[0]) - 0.04) * W.w, x1 = (X.grove1 + 0.01) * W.w;
    const cx = (x0 + x1) / 2, w = x1 - x0, yb = baseY(2, X.fire1, X.fireV + 0.1);
    ctx.globalAlpha = k * 0.3;
    ctx.drawImage(SP.beam, cx - w * 0.7, -10, w * 1.4, yb + 10);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.42;
    ctx.drawImage(SP.beam, cx - w * 0.3, -10, w * 0.6, yb + 10);
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 50; i++) {
      const hx = hsh(i * 3.7), sp = 0.6 + 0.5 * hsh(i * 1.9);
      const y = ((W.t * 0.1 * sp + hsh(i * 7.1)) % 1) * yb;
      const x = x0 + hx * w + Math.sin(W.t * 0.8 + i) * 4;
      const a = k * Math.sin(Math.PI * (y / yb));
      glowAt(ctx, SP.gold, x, y, 5 * SU(), a * 0.5);
      glowAt(ctx, SP.white, x, y, 2 * SU(), a * 0.9);
    }
    ctx.globalAlpha = 1;
  }
  // 用和平所栽种的义果：一棵小树
  function ptreeG() { const p = Pk('ptree'), s = LS(2); return { s, x: p[0] * W.w, y: baseY(2, p[0], p[1]) + 1 * s }; }
  function drawPeaceTree(ctx) {
    const g = lv('lsPeace');
    if (g < 0.01) return;
    const G = ptreeG(), s = G.s, l = 2, e = sstep(g);
    const th = 20 * s * e, cr = 12 * s * sstep((g - 0.15) / 0.85);
    ctx.strokeStyle = css([96, 72, 50], l); ctx.lineWidth = Math.max(0.8, 2.2 * s * e); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(G.x, G.y); ctx.quadraticCurveTo(G.x - 1.5 * s, G.y - th * 0.5, G.x + 0.5 * s, G.y - th);
    ctx.moveTo(G.x, G.y - th * 0.6); ctx.lineTo(G.x - 5 * s * e, G.y - th * 0.85);
    ctx.moveTo(G.x + 0.3 * s, G.y - th * 0.75); ctx.lineTo(G.x + 5 * s * e, G.y - th * 0.95);
    ctx.stroke(); ctx.lineCap = 'butt';
    if (cr > 0.5) {
      const sw = Math.sin(W.t * 0.9) * 0.6 * s;
      ctx.fillStyle = css([72, 116, 62], l);
      ctx.beginPath();
      ctx.ellipse(G.x + sw, G.y - th - cr * 0.35, cr, cr * 0.72, 0, 0, TAU);
      ctx.ellipse(G.x - cr * 0.62 + sw, G.y - th - cr * 0.05, cr * 0.62, cr * 0.5, 0, 0, TAU);
      ctx.ellipse(G.x + cr * 0.66 + sw, G.y - th - cr * 0.02, cr * 0.6, cr * 0.48, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = css([236, 244, 206], l, 0.3 * dayA(), 0.1); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath(); ctx.arc(G.x + sw, G.y - th - cr * 0.35, cr, -2.6, -0.5); ctx.stroke();
    }
  }
  const FRUIT = [[-0.55, -0.1], [0.1, -0.55], [0.55, 0.05], [-0.15, 0.12], [0.35, -0.3], [-0.45, -0.45]];
  function drawFruit(ctx) {
    const g = lv('lsPeace');
    if (g < 0.72 || !SP) return;
    const G = ptreeG(), s = G.s, th = 20 * s, cr = 12 * s, k = clamp((g - 0.72) / 0.28, 0, 1);
    ctx.globalCompositeOperation = 'lighter';
    FRUIT.forEach((q, i) => {
      const kk = clamp(k * 1.6 - i * 0.12, 0, 1);
      if (kk <= 0) return;
      const x = G.x + q[0] * cr, y = G.y - th - cr * 0.35 + q[1] * cr;
      glowAt(ctx, SP.gold, x, y, 4.2 * s, kk * (0.4 + 0.3 * nightK()));
      ctx.globalAlpha = kk;
      ctx.fillStyle = 'rgb(255,214,110)';
      ctx.beginPath(); ctx.arc(x, y, 1.5 * s, 0, TAU); ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天上的光：众光之父（开处与降下的恩赐）；神亲近人（光自天顶降下）
  // ════════════════════════════════════════════════════════════
  const abovePt = () => [X.site * W.w, X.aboveY * W.h];
  function drawAbove(ctx) {
    const k = lv('lsAbove');
    if (k < 0.01 || !SP) return;
    const [x, y] = abovePt(), R = M() * 0.16;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.dawn, x, y, R * 1.6, k * 0.55, 0.7);
    glowAt(ctx, SP.white, x, y, R * 0.35, k * 0.7);
    // 向下散开的光
    for (let i = -3; i <= 3; i++) {
      const ang = i * 0.13 + Math.sin(W.t * 0.2 + i) * 0.015;
      const L = W.h * 0.62;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(ang);
      ctx.globalAlpha = k * (0.16 - Math.abs(i) * 0.02);
      ctx.drawImage(SP.beam, -R * 0.2, 0, R * 0.4, L);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 恩赐降下的去处：各人、田、帐棚、林子、海上（次序固定）
  function giftTargets() {
    const out = [];
    for (const id of ['farmer', 'poor', 'hearer', 'peter', 'doer', 'widow', 'orphan']) out.push(figPt(id, 0.62) || [X.site * W.w, gY(2, X.site)]);
    const rows = fieldModel();
    for (const f of [0.2, 0.55, 0.85]) { const r = rows[2], xf = lerp(r.a, r.b, f); out.push([xf * W.w, baseY(2, xf, r.v) - 4]); }
    for (const t of [X.tent1, X.tent2]) if (t > 0) { const G = tentG(t); out.push([G.x, G.y - G.h]); }
    out.push(grovePt(1)); out.push(grovePt(4));
    out.push([X.site * W.w, gY(2, X.site) - 6]);
    out.push([W.w * 0.24, W.horizonY + 6]); out.push([W.w * 0.4, W.horizonY + 4]);
    return out;
  }
  function drawGifts(ctx) {
    const g = lv('lsGifts');
    if (g <= 0.001 || g >= 0.999 || !SP) return;
    const [ox, oy] = abovePt(), tg = giftTargets(), N = tg.length;
    ctx.globalCompositeOperation = 'lighter';
    tg.forEach((t, i) => {
      const th = (i / N) * 0.7 + hsh(i * 3.3) * 0.05;
      const u = clamp((g - th) / 0.2, 0, 1), fade = clamp((g - th - 0.2) / 0.1, 0, 1);
      if (u <= 0 || fade >= 1) return;
      const sx = ox + (hsh(i * 5.1) - 0.5) * M() * 0.12, sy = oy + M() * 0.02;
      const e = sstep(u), mt = 1 - e;
      const mx = lerp(sx, t[0], 0.3) + (hsh(i * 2.2) - 0.5) * M() * 0.12, my = lerp(sy, t[1], 0.45);
      const x = mt * mt * sx + 2 * mt * e * mx + e * e * t[0], y = mt * mt * sy + 2 * mt * e * my + e * e * t[1];
      if (u < 1) {
        glowAt(ctx, SP.gold, x, y, 13 * SU(), 0.8);
        glowAt(ctx, SP.white, x, y, 4.2 * SU(), 1);
        for (let j = 1; j < 5; j++) {
          const tt = Math.max(0, e - j * 0.045), m2 = 1 - tt;
          glowAt(ctx, SP.gold, m2 * m2 * sx + 2 * m2 * tt * mx + tt * tt * t[0], m2 * m2 * sy + 2 * m2 * tt * my + tt * tt * t[1], (5 - j) * SU(), 0.4 * (1 - j / 5));
        }
      } else {
        glowAt(ctx, SP.gold, t[0], t[1], (8 + 18 * fade) * SU(), 0.6 * (1 - fade));
      }
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 神就必亲近你们：一团光自天顶降到石台之上
  function nearPt() {
    const G = houseG(), e = sstep(lv('lsNearY'));
    return [G.cx, lerp(-M() * 0.08, G.y - 30 * G.s, e)];
  }
  function drawNear(ctx) {
    const k = lv('lsNear');
    if (k < 0.01 || !SP) return;
    const [x, y] = nearPt(), s = LS(2), pul = 0.9 + 0.1 * Math.sin(W.t * 1.4);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.3;
    ctx.drawImage(SP.beam, x - 16 * s, -10, 32 * s, Math.max(10, y + 10));
    glowAt(ctx, SP.dawn, x, y, 60 * s * pul, k * 0.4);
    glowAt(ctx, SP.gold, x, y, 22 * s, k * 0.7);
    glowAt(ctx, SP.white, x, y, 8 * s * pul, k * 0.9);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 镜子（听道的人手里的一面铜镜）：举在脸前，镜面朝着他自己 ──────────────
  function drawMirror(ctx) {
    const k = lv('lsMirror');
    if (k < 0.01 || !SP) return;
    const f = fig('hearer');
    if (!f) return;
    const h = f._h || PH(), fd = f.fd || f.facing || 1, p = ptOf(f, 0.84);
    // 镜在脸前一臂远，稍稍侧着：我们看见镜背的铜边与一线镜面
    const x = p[0] + fd * h * 0.3, y = p[1] + h * 0.01, rx = h * 0.1, ry = h * 0.15;
    ctx.globalAlpha = k;
    // 柄：从手里斜上去
    ctx.strokeStyle = 'rgb(120,86,48)'; ctx.lineWidth = Math.max(1.2, h * 0.035); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - fd * h * 0.07, y + ry + h * 0.13); ctx.lineTo(x - fd * h * 0.012, y + ry * 0.9); ctx.stroke(); ctx.lineCap = 'butt';
    // 镜身：铜边与磨亮的镜面（镜面向着他，亮的一侧在靠他那边）
    ctx.fillStyle = 'rgb(140,100,52)';
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, fd * 0.12, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgb(226,196,128)';
    ctx.beginPath(); ctx.ellipse(x - fd * rx * 0.18, y, rx * 0.72, ry * 0.82, fd * 0.12, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgb(255,246,220)';
    ctx.beginPath(); ctx.ellipse(x - fd * rx * 0.34, y - ry * 0.25, rx * 0.2, ry * 0.34, fd * 0.3, 0, TAU); ctx.fill();
    // 他在镜里：一线反照的光落回他脸上
    ctx.globalCompositeOperation = 'lighter';
    const pul = 0.75 + 0.25 * Math.sin(W.t * 2.4);
    glowAt(ctx, SP.white, x - fd * rx * 0.2, y, h * 0.2 * pul, k * 0.45);
    glowAt(ctx, SP.gold, p[0] + fd * h * 0.08, p[1], h * 0.16, k * 0.35 * pul);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  夜：黑暗与奇妙的光；火炼的试验；冷暗的烟影；卸下的重担
  // ════════════════════════════════════════════════════════════
  // 黑暗：以八分之一的解析度画在离屏上（柔和的渐变放大后仍然柔和），参数不变时不重画
  let DK = null;
  function drawDark(ctx) {
    const k = lv('lsDark');
    if (k < 0.01) return;
    const G = houseG(), a = 0.78 * k;
    const r0 = G.hw * 1.7, r1 = Math.hypot(W.w, W.h) * 0.95, R = lerp(r0, r1, sstep(lv('lsCall')));
    const cx = G.cx, cy = G.y - G.wallH * 0.5;
    const sc = 1 / 8, w = Math.ceil((W.w + 40) * sc) + 1, h = Math.ceil((W.h + 40) * sc) + 1;
    const key = w + ',' + h + ',' + Math.round(a * 200) + ',' + Math.round(R * sc * 2) + ',' + Math.round(cx * sc) + ',' + Math.round(cy * sc);
    if (!DK || DK.key !== key) {
      try {
        if (!DK || DK.c.width !== w || DK.c.height !== h) DK = { c: cnv(w, h), key: '' };
        const g = DK.c.getContext('2d'), ox = (cx + 20) * sc, oy = (cy + 20) * sc;
        g.clearRect(0, 0, w, h);
        const gr = g.createRadialGradient(ox, oy, R * 0.25 * sc, ox, oy, R * sc);
        gr.addColorStop(0, 'rgba(2,3,8,0)');
        gr.addColorStop(0.55, U.rgba(2, 3, 8, a * 0.35));
        gr.addColorStop(1, U.rgba(2, 3, 8, a));
        g.fillStyle = gr; g.fillRect(0, 0, w, h);
        DK.key = key;
      } catch (e) { DK = null; return; }
    }
    ctx.globalAlpha = 1;
    ctx.drawImage(DK.c, -20, -20, w / sc, h / sc);
  }
  function drawTrial(ctx) {
    const k = lv('lsTrial');
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      const f = 0.56 + i * 0.055, x = f * W.w, y = gY(0, f) + 2;
      const fl = 0.75 + 0.25 * Math.sin(W.t * (1.3 + i * 0.2) + i * 2.1);
      glowAt(ctx, SP.ember, x, y, M() * (0.07 + 0.03 * hsh(i)), k * 0.55 * fl, 0.6);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 冷暗的烟影（吼叫的狮子只在旁白里）：在近地亮处、众人之前游行；被抵挡时往回缩、变淡、散去
  function lionPt() {
    const xf = lerp(X.lion0, X.lion1, sstep(lv('lsLionX'))) - X.lionBack * lv('lsLionBack');
    return [xf * W.w, baseY(2, xf, X.lionV) + 2];
  }
  function drawLion(ctx) {
    const k = lv('lsLion');
    if (k < 0.01 || !SP) return;
    const [x, y] = lionPt(), s = LS(2) * (PORT ? 1.05 : 1);
    const L = 104 * s, H = 32 * s, back = lv('lsLionBack');
    // 被抵挡时烟影压扁、拉散
    const LL = L * (1 + 0.3 * back), HH = H * (1 - 0.3 * back);
    const hump = f => Math.sin(Math.PI * clamp(f, 0, 1));
    // 暗的身子：低低的一长团冷烟，微微翻动；没有形体
    for (let i = 0; i < 13; i++) {
      const f = i / 12, ph = W.t * 0.7 + i * 1.3;
      const bx = x + (f - 0.5) * LL + Math.sin(ph) * 2.6 * s, by = y - HH * (0.3 + 0.36 * hump(f)) + Math.cos(ph * 1.2) * 1.8 * s;
      glowAt(ctx, SP.cold, bx, by, HH * (0.5 + 0.3 * hump(f)), k * 0.62);
    }
    // 灰蓝的冷雾罩在上面
    for (let i = 0; i < 9; i++) {
      const f = i / 8, ph = W.t * 0.5 + i * 1.9;
      glowAt(ctx, SP.mist, x + (f - 0.5) * LL * 1.08 + Math.sin(ph) * 3 * s, y - HH * (0.42 + 0.34 * hump(f)), HH * (0.62 + 0.2 * hump(f)), k * 0.26);
    }
    // 当中一团暗而浑的红黑（没有眼睛）
    glowAt(ctx, SP.core, x, y - HH * 0.42, HH * 0.8, k * 0.55 * (0.8 + 0.2 * Math.sin(W.t * 0.7)), 0.65);
    // 往上散去的烟缕
    for (let i = 0; i < 7; i++) {
      const ph = (W.t * 0.22 + i / 7) % 1;
      glowAt(ctx, SP.mist, x + (hsh(i) - 0.5) * LL * 0.8 + ph * 8 * s, y - HH * 0.95 - ph * HH * 1.8, HH * (0.3 + ph * 0.55), k * (0.28 + 0.2 * back) * (1 - ph));
    }
    // 淡白的外缘：沿着上边一线，夜里看得出它的轮廓
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 11; i++) {
      const f = (i + 0.5) / 11, ph = W.t * 0.6 + i;
      glowAt(ctx, SP.pale, x + (f - 0.5) * LL * 0.98 + Math.sin(ph) * 2 * s, y - HH * (0.62 + 0.4 * hump(f)), HH * 0.36, k * 0.2);
    }
    glowAt(ctx, SP.pale, x, y - HH * 0.5, LL * 0.62, k * 0.1, 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 夜里，灵宫的光照在归来的羊身上（白的羊毛看得出来）
  function drawSheepLight(ctx) {
    const nk = nightK(), c = C();
    if (nk < 0.05 || !SP || !c || !c.crowds) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const gid of ['lostL', 'lostR']) {
      const g = c.crowds.get(gid);
      if (!g) continue;
      for (const m of g.members) {
        if (!m._vis || !isFinite(m._x)) continue;
        const k = (m.alpha == null ? 1 : m.alpha) * nk * (0.35 + 0.65 * lv('lsCall'));
        glowAt(ctx, SP.pale, m._x, m._y - 9 * m._h, 15 * m._h, 0.55 * k, 0.6);
        glowAt(ctx, SP.white, m._x, m._y - 9 * m._h, 8 * m._h, 0.28 * k, 0.6);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 卸下的重担：自各人背上升起的光
  function drawBurdens(ctx) {
    const k = lv('lsCast');
    if (k <= 0.001 || k >= 0.999 || !SP) return;
    const pts = [];
    for (const id of NAMED) { const p = figPt(id, 0.66); if (p) pts.push(p); }
    for (const g of ['saints', 'darkL', 'darkR']) for (const p of crowdPts(g, 0.66)) pts.push(p);
    const s = LS(2), top = W.h * 0.04;
    ctx.globalCompositeOperation = 'lighter';
    pts.forEach((p, i) => {
      const u = clamp(k * 1.25 - hsh(i * 2.7) * 0.25, 0, 1);
      if (u <= 0 || u >= 1) return;
      const e = sstep(u);
      const y = lerp(p[1], top, e), x = p[0] + Math.sin(e * 5 + i) * 6 * s * e;
      const a = clamp(u * 5, 0, 1) * (1 - sstep((u - 0.65) / 0.35));
      glowAt(ctx, SP.gold, x, y, (7 - 3 * e) * s, a * 0.8);
      glowAt(ctx, SP.white, x, y, 2.4 * s, a);
    });
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 灯照在暗处：彼得手里的火把
  function drawLamp(ctx) {
    const k = lv('lsLamp');
    if (k < 0.01 || !SP) return;
    const f = fig('peter');
    if (!f) return;
    const p = ptOf(f, 1.05), h = f._h || PH(), fd = f.fd || f.facing || 1;
    const x = p[0] + fd * h * 0.26, y = p[1] + h * 0.02;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 11) * Math.sin(W.t * 7.3);
    glowAt(ctx, SP.lamp, x, y, h * 1.9 * fl, k * (0.2 + 0.45 * nightK()));
    glowAt(ctx, SP.warm, x, y, h * 0.5, k * 0.5 * fl);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  异象：圣山的荣光（远山上）；晨星；方舟；新天新地的曙光
  // ════════════════════════════════════════════════════════════
  function holyPt() { const f = X.holy; return [f * W.w, gY(0, f)]; }
  function drawHoly(ctx) {
    const k = lv('lsHoly');
    if (k < 0.01 || !SP) return;
    const [x, y] = holyPt(), h = Math.max(22, M() * 0.05);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.cloud, x, y - h * 1.1, h * 2.6, k * 0.7, 0.55);
    glowAt(ctx, SP.cloud, x - h * 0.9, y - h * 1.5, h * 1.5, k * 0.5, 0.5);
    glowAt(ctx, SP.cloud, x + h * 1.0, y - h * 1.4, h * 1.6, k * 0.5, 0.5);
    glowAt(ctx, SP.white, x, y - h * 0.5, h * 1.2, k * 0.8);
    ctx.globalCompositeOperation = 'source-over';
    lightFigure(ctx, x, y - 1, h, k, 0.3, 'rgb(255,255,250)', 0.8);
    lightFigure(ctx, x - h * 0.62, y + 1, h * 0.78, k * 0.7, 1.4, 'rgb(250,240,214)', 0.4);
    lightFigure(ctx, x + h * 0.62, y + 1, h * 0.78, k * 0.7, 2.6, 'rgb(250,240,214)', 0.4);
    ctx.globalAlpha = 1;
  }
  const starPt = () => [X.starX * W.w, X.starY * W.h];
  function drawStar(ctx) {
    const k = lv('lsStar');
    if (k < 0.01 || !SP) return;
    const [x, y] = starPt(), r = Math.max(9, M() * 0.022) * (0.9 + 0.1 * Math.sin(W.t * 2.3));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.pale, x, y, r * 4, k * 0.6);
    starShape(ctx, x, y, r * 1.5, k * 0.9, [246, 248, 255]);
    glowAt(ctx, SP.white, x, y, r * 0.8, k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawArk(ctx) {
    const k = lv('lsArk');
    if (k < 0.01 || !SP) return;
    const x = X.arkX * W.w, y = X.arkY * W.h, w = Math.max(70, M() * 0.12), s = w / 100;
    ctx.globalCompositeOperation = 'lighter';
    // 光的水面
    glowAt(ctx, SP.pale, x, y + 6 * s, w * 1.1, k * 0.45, 0.16);
    ctx.strokeStyle = 'rgb(210,226,255)'; ctx.lineWidth = Math.max(0.8, 1.2 * s);
    for (let j = 0; j < 3; j++) {
      ctx.globalAlpha = k * (0.45 - j * 0.12);
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) { const f = i / 24, px = x - w * 0.8 + f * w * 1.6, py = y + (6 + j * 5) * s + Math.sin(f * 14 + W.t * 1.2 + j) * 1.4 * s; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
      ctx.stroke();
    }
    // 方舟：船身与舱
    ctx.globalAlpha = k * 0.85;
    ctx.fillStyle = 'rgb(255,236,196)';
    ctx.beginPath();
    ctx.moveTo(x - 46 * s, y - 6 * s); ctx.lineTo(x + 46 * s, y - 6 * s); ctx.lineTo(x + 38 * s, y + 5 * s); ctx.lineTo(x - 38 * s, y + 5 * s); ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = k * 0.7;
    ctx.fillRect(x - 26 * s, y - 16 * s, 52 * s, 10 * s);
    ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 16 * s); ctx.lineTo(x, y - 23 * s); ctx.lineTo(x + 30 * s, y - 16 * s); ctx.closePath(); ctx.fill();
    // 一家八口：八点光
    for (let i = 0; i < 8; i++) glowAt(ctx, SP.white, x - 21 * s + i * 6 * s, y - 11 * s, 2.6 * s, k * (0.8 + 0.2 * Math.sin(W.t * 2 + i)));
    glowAt(ctx, SP.gold, x, y - 8 * s, w * 0.7, k * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawNew(ctx) {
    const k = lv('lsNew');
    if (k < 0.01 || !SP) return;
    const x = X.newX * W.w, y = W.horizonY, R = Math.max(W.w, W.h) * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.dawn, x, y, R, k * 0.45, 0.55);
    glowAt(ctx, SP.white, x, y, R * 0.35, k * 0.35, 0.5);
    // 一道光带沿着地平线
    ctx.globalAlpha = k * 0.5;
    ctx.drawImage(SP.dawn, x - R * 1.2, y - R * 0.09, R * 2.4, R * 0.18);
    if (SP.ray) for (let i = 0; i < 13; i++) {
      const d = (i - 6) * 0.19 + Math.sin(W.t * 0.07 + i) * 0.02;
      ctx.save(); ctx.translate(x, y); ctx.rotate(d);
      ctx.globalAlpha = k * (0.3 - Math.abs(i - 6) * 0.03) * (0.8 + 0.2 * Math.sin(W.t * 0.5 + i * 1.3));
      const L = R * (0.9 + 0.25 * hsh(i));
      ctx.drawImage(SP.ray, -R * 0.045, -L, R * 0.09, L);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光：火星飞进林子；晨星的光进到人心 ────────────────
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const u = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'spark') {
        const a = typeof e.from === 'function' ? e.from() : e.from, b = typeof e.to === 'function' ? e.to() : e.to;
        if (!a || !b) continue;
        const uu = clamp(u * 1.2 - (e.delay || 0), 0, 1);
        if (uu <= 0 || uu >= 1) continue;
        const mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - M() * 0.06, mt = 1 - uu;
        const x = mt * mt * a[0] + 2 * mt * uu * mx + uu * uu * b[0], y = mt * mt * a[1] + 2 * mt * uu * my + uu * uu * b[1];
        glowAt(ctx, SP.warm, x, y, 4 * SU(), 0.9);
        glowAt(ctx, SP.lamp, x, y, 1.8 * SU(), 1);
      } else if (e.type === 'stream') {
        const a = typeof e.from === 'function' ? e.from() : e.from, b = figPt(e.to, 0.62);
        if (!a || !b) continue;
        const uu = clamp(u - (e.delay || 0), 0, 1);
        if (uu <= 0 || uu >= 1) continue;
        for (let j = 0; j < 6; j++) {
          const tt = clamp(uu * 1.3 - j * 0.05, 0, 1);
          if (tt <= 0 || tt >= 1) continue;
          const mx = lerp(a[0], b[0], 0.5), my = Math.min(a[1], b[1]) - M() * 0.04, mt = 1 - tt;
          const x = mt * mt * a[0] + 2 * mt * tt * mx + tt * tt * b[0], y = mt * mt * a[1] + 2 * mt * tt * my + tt * tt * b[1];
          glowAt(ctx, SP.pale, x, y, (5 - j * 0.6) * SU(), 0.8 * (1 - j / 7));
        }
        if (uu > 0.7) glowAt(ctx, SP.white, b[0], b[1], PH() * 0.35, 0.6 * Math.sin(Math.PI * clamp((uu - 0.7) / 0.3, 0, 1)));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() { layout(); },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; VT.clear(); return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const [id, v] of VT) {
        const p = fig(id);
        if (!p) { VT.delete(id); continue; }
        // 人在走的时候才前后移动（看来像是斜着走过去）
        const k = p.tx != null || p.pose === 'walk' || p.pose === 'run' ? 1.6 : 0.8;
        p.v += (v - p.v) * (1 - Math.exp(-k * f));
        if (Math.abs(p.v - v) < 0.002) { p.v = v; VT.delete(id); }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') {
        U.safe('ls.new', () => drawNew(ctx)); U.safe('ls.trial', () => drawTrial(ctx)); U.safe('ls.above', () => drawAbove(ctx));
        U.safe('ls.star', () => drawStar(ctx)); U.safe('ls.ark', () => drawArk(ctx));
        return;
      }
      if (pass === 'far') { U.safe('ls.holy', () => drawHoly(ctx)); return; }
      if (pass === 'mid') { U.safe('ls.grove', () => drawGrove(ctx)); return; }
      if (pass === 'near') {
        U.safe('ls.field', () => drawField(ctx));
        U.safe('ls.tent', () => { drawTent(ctx, X.tent2, 0.6); drawTent(ctx, X.tent1, 0.1); });
        U.safe('ls.fire', () => drawGrassFire(ctx));
        U.safe('ls.ptree', () => drawPeaceTree(ctx));
        U.safe('ls.house', () => drawHouse(ctx));
        return;
      }
      if (pass === 'air') {
        U.safe('ls.dark', () => drawDark(ctx));
        U.safe('ls.hope', () => drawHope(ctx));
        U.safe('ls.fruit', () => drawFruit(ctx));
        U.safe('ls.houselight', () => drawHouseLight(ctx));
        U.safe('ls.beam', () => drawBeam(ctx));
        U.safe('ls.flights', () => drawFlights(ctx));
        U.safe('ls.wisdom', () => drawWisdom(ctx));
        U.safe('ls.near', () => drawNear(ctx));
        U.safe('ls.gifts', () => drawGifts(ctx));
        U.safe('ls.mirror', () => drawMirror(ctx));
        U.safe('ls.sheep', () => drawSheepLight(ctx));
        U.safe('ls.lion', () => drawLion(ctx));
        U.safe('ls.burdens', () => drawBurdens(ctx));
        U.safe('ls.lamp', () => drawLamp(ctx));
        U.safe('ls.trans', () => drawTransients(ctx));
      }
    },
    draw() {},
    reset() { FXL.length = 0; VT.clear(); },
    restore() { FXL.length = 0; VT.clear(); },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const G = houseG();
      if (lv('lsBuild') > 0.5) consider('灵宫', G.cx, G.top - G.roofH * 0.4);
      const P = cornerPts(G, lv('lsLift'));
      consider(lv('lsLift') > 0.5 ? '房角石' : '被弃的石头', P.cx, P.cy - 4 * G.s);
      for (const t of [X.tent1, X.tent2]) if (t > 0) { const T0 = tentG(t); consider('帐棚', T0.x, T0.y - T0.h * 0.7); }
      const rows = fieldModel(), fr = rows[2];
      consider('田', lerp(fr.a, fr.b, 0.5) * W.w, baseY(2, lerp(fr.a, fr.b, 0.5), fr.v) - 6);
      const g1 = grovePt(2); consider('树林', g1[0], g1[1]);
      if (lv('lsPeace') > 0.7) { const pg = ptreeG(); consider('义果', pg.x, pg.y - 26 * pg.s); }
      if (lv('lsStar') > 0.3) { const sp = starPt(); consider('晨星', sp[0], sp[1]); }
      if (lv('lsLamp') > 0.3) { const pp = figPt('peter', 1.05); if (pp) consider('灯', pp[0], pp[1]); }
      return best;
    },
  };

  function resetScene() { FXL.length = 0; VT.clear(); S = fresh(); GROVE = null; FIELD = null; }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：黎明前，海边山坡上分散寄居的人
  // ════════════════════════════════════════════════════════════
  const ROBE = {
    farmer: [128, 104, 72], poor: [118, 116, 112], poorWarm: [176, 126, 84], hearer: [112, 118, 136], doer: [150, 104, 92], widow: [72, 72, 88], orphan: [172, 150, 116],
  };
  function setup() {
    layout();
    // 旱地：直到第五句的雨以前，山坡是干黄的，草稀，花少
    W.set('bare', 0.66, true); W.set('bloom', 0.06, true);
    const L0 = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.34, herbs: 0.18, trees: 0.32, lights: 1, moon: 0.8, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    L0.trees = 0.24;
    for (const k in L0) if (W.hasLevel(k)) W.set(k, L0[k], true);
    for (const k in LV) W.set(k, 0, true);
    W.freeClock = false;
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.8, W.ridgeBaseY(2, W.w * 0.8));
    W.setOrigin('trees', W.w * 1.0, W.ridgeBaseY(2, W.w * 0.995));
    W.goTo(0.245, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 50, W.w * 0.2, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 8, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    const P = Pk;
    add('farmer', { label: '农夫', sex: 'm', age: 'adult', x: P('farmer')[0], v: P('farmer')[1], facing: -1, robe: ROBE.farmer, accent: [200, 180, 140], beard: true, glow: 0.24, prop: null });
    add('poor', { label: '穷弟兄', sex: 'm', age: 'adult', x: P('poor')[0], v: P('poor')[1], facing: 1, robe: ROBE.poor, accent: [96, 94, 90], beard: true, glow: 0.1, pose: 'sit', prop: null });
    add('hearer', { label: '听道的人', sex: 'm', age: 'adult', x: P('hearer')[0], v: P('hearer')[1], facing: 1, robe: ROBE.hearer, accent: [206, 192, 160], hair: 'short', beard: true, glow: 0.2, prop: null });
    add('peter', Object.assign({}, LOOK().peter || { label: '彼得', sex: 'm', age: 'adult', beard: true }, { x: P('peter')[0], v: P('peter')[1], facing: -1, prop: 'staff', glow: 0.3 }));
    add('doer', { label: '行道的人', sex: 'f', age: 'adult', x: P('doer')[0], v: P('doer')[1], facing: -1, robe: ROBE.doer, accent: [232, 216, 190], hair: 'veil', glow: 0.24 });
    add('widow', { label: '寡妇', sex: 'f', age: 'adult', x: P('widow')[0], v: P('widow')[1], facing: -1, robe: ROBE.widow, accent: [206, 204, 200], hair: 'veil', glow: 0.18, pose: 'sit' });
    add('orphan', { label: '孤儿', sex: 'm', age: 'child', x: P('orphan')[0], v: P('orphan')[1], facing: -1, robe: ROBE.orphan, glow: 0.18, pose: 'sit' });
    avoid([0.34, 1]);
  }
  const faceSite = ids => { for (const id of ids || present()) face(id, X.site); };

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内。经文一行显出 hold 秒，行与行之间约 1.3 秒。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 雅 1:17 众光之父 ────────────────────────────────────
    {
      kind: 'act', utter: '都是从上头来的，从众光之父那里降下来的', cmd: 'rain --gifts all --from 众光之父  # 没有转动的影儿', ref: '1:17',
      verse: [
        { text: '各样美善的恩赐和各样全备的赏赐都是从上头来的，从众光之父那里降下来的；<br>在他并没有改变，也没有转动的影儿。', ref: '雅各书 1:17', hold: 9 },
        { text: '他按自己的旨意，用真道生了我们，<br>叫我们在他所造的万物中好像初熟的果子。', ref: '雅各书 1:18', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.3, 16, b.instant);
            W.set('lsAbove', 1, b.instant);
            all(id => { if (id !== 'poor' && id !== 'widow' && id !== 'orphan') pose(id, 'gaze'); });
            sfx(b, 'harp');
          }],
          [1.2, b => { W.set('lsGifts', 1, b.instant); sfx(b, 'stars', { soft: true }); }],
          [5.2, b => { all(id => glow(id, 0.34)); pose('poor', 'sit'); face('poor', 1); sfx(b, 'chime'); }],
          [8.6, b => { const p = abovePt(); ringAt(b, p[0], p[1], 0.22, [255, 244, 214], 2.6, 1.6); sfx(b, 'bell', { soft: true }); }],
          // 初熟的果子：花开了，鸟醒了
          [11, b => {
            W.set('bloom', 0.2, b.instant); W.set('herbs', 0.28, b.instant);
            W.setPop('bird', 14, W.w * 0.66, W.h * 0.35, b.instant);
            all(id => { if (id !== 'poor' && id !== 'widow' && id !== 'orphan') pose(id, 'stand'); });
            face('hearer', 1); face('peter', -1); face('doer', -1); face('farmer', -1);
            sfx(b, 'bird', { soft: true });
          }],
          [14.6, b => W.set('lsAbove', 0.18, b.instant)],
        ]);
      },
    },

    // ── 2 · 雅 1:22 只是你们要行道；雅 2:5 神岂不是拣选了世上的贫穷人 ─────────────
    {
      kind: 'ask', utter: '神岂不是拣选了世上的贫穷人', cmd: 'choose 贫穷人 --rich-in 信  # 行道，不单听道', ref: '2:5',
      verse: [
        { text: '只是你们要行道，不要单单听道，自己欺哄自己。因为听道而不行道的，<br>就像人对着镜子看自己本来的面目，看见，走后，随即忘了他的相貌如何。', ref: '雅各书 1:22–24', hold: 8.5 },
        { text: '在神我们的父面前，那清洁没有玷污的虔诚，<br>就是看顾在患难中的孤儿寡妇……', ref: '雅各书 1:27', hold: 5.5 },
        { text: '我亲爱的弟兄们，请听，神岂不是拣选了世上的贫穷人，<br>叫他们在信上富足，并承受他所应许给那些爱他之人的国吗？', ref: '雅各书 2:5', hold: 6.5 },
        { text: '若是弟兄或是姊妹，赤身露体，又缺了日用的饮食……<br>这样，信心若没有行为就是死的。', ref: '雅各书 2:15–17', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          // 听道的人举起一面镜子，看自己
          [0, b => {
            W.goTo(0.335, 24, b.instant);
            W.set('lsAbove', 0, b.instant);
            pose('hearer', 'carry'); face('hearer', 1);
            W.set('lsMirror', 1, b.instant);
            sfx(b, 'chime', { soft: true });
          }],
          // 看见，走后，随即忘了：他放下镜子，往左走过穷弟兄身边
          [5.5, b => {
            W.set('lsMirror', 0, b.instant);
            goT('hearer', Pk('hearerAway'), 5, { pose: 'stand' });
            glow('hearer', 0.14);
          }],
          [11, b => { face('hearer', -1); }],
          // 看顾孤儿寡妇：彼得提一罐水过去
          [9.8, b => { hold('peter', 'jar'); go('peter', Pk('peterW'), { speed: 0.03, pose: 'stand' }); }],
          [12.8, b => {
            face('peter', 1); pose('widow', 'stand'); pose('orphan', 'stand'); face('widow', -1); face('orphan', -1);
            hold('peter', 'staff'); hold('widow', 'jar');
            glow('widow', 0.36); glow('orphan', 0.34);
            ringOn(b, 'widow', 0.08, [255, 232, 196], 0.5);
            sfx(b, 'pour', { soft: true });
          }],
          // 神拣选了贫穷人：行道的妇人背着衣食走到穷弟兄那里
          [16.4, b => { hold('doer', 'bundle'); goT('doer', Pk('doerP'), 4.4, { pose: 'stand' }); face('poor', 1); }],
          [21.2, b => {
            face('doer', -1); face('poor', 1);
            hold('doer', null);
            add('poor', { robe: ROBE.poorWarm, accent: [220, 196, 150], label: '弟兄', glow: 0.4 });
            pose('poor', 'stand');
            glow('doer', 0.42);
            S.gave = 1;
            ringOn(b, 'poor', 0.1, [255, 226, 170], 0.55);
            sparkleOn(b, 'poor', 18, [255, 230, 180], 0.6);
            sfx(b, 'harp');
          }],
          // 信心有了行为，就活了
          [23.6, b => { sparkleOn(b, 'doer', 12, [255, 236, 196], 0.62); pose('poor', 'raise'); }],
          [26.8, b => { pose('poor', 'stand'); face('hearer', 1); }],
        ]);
      },
    },

    // ── 3 · 雅 3:17 从上头来的智慧 ─────────────────────────────
    {
      kind: 'act', utter: '从上头来的智慧，先是清洁，后是和平', cmd: 'kill -9 小火 && sow 和平 --fruit 义', ref: '3:17',
      verse: [
        { text: '这样，舌头在百体里也是最小的，却能说大话。<br>看哪，最小的火能点着最大的树林。', ref: '雅各书 3:5', hold: 6.5 },
        { text: '惟独从上头来的智慧，先是清洁，后是和平，温良柔顺，<br>满有怜悯，多结善果，没有偏见，没有假冒。', ref: '雅各书 3:17', hold: 8 },
        { text: '并且使人和平的，是用和平所栽种的义果。', ref: '雅各书 3:18', hold: 5 },
      ],
      apply(c) {
        T(c, [
          // 农夫与听道的人争吵；穷弟兄与行道的妇人往石台那边走开
          [0, b => {
            W.goTo(0.375, 22, b.instant);
            W.set('gale', 0.35, b.instant);
            face('farmer', 'hearer'); face('hearer', 'farmer');
            pose('farmer', 'point'); pose('hearer', 'point');
            go('poor', Pk('pAside'), { speed: 0.03, pose: 'stand' }); go('doer', Pk('dAside'), { speed: 0.03, pose: 'stand' });
            sfx(b, 'crowd', { soft: true });
          }],
          // 口里的火星落进干草，也随风飞进林子
          [1.4, b => {
            const from = id => () => figPt(id, 0.9);
            trans(b, { type: 'spark', from: from('hearer'), to: firePt(0), dur: 1.6 });
            trans(b, { type: 'spark', from: from('farmer'), to: firePt(1), dur: 1.7, delay: 0.1 });
            for (let i = 0; i < 3; i++) trans(b, { type: 'spark', from: from(i % 2 ? 'farmer' : 'hearer'), to: grovePt(1 + i * 2), dur: 3.2, delay: 0.2 + i * 0.12 });
          }],
          [2.6, b => { W.set('lsFire', 1, b.instant); W.set('lsScar', 1, b.instant); sfx(b, 'fire'); }],
          [4.4, b => { W.set('gale', 0.55, b.instant); face('poor', X.fire1); face('doer', X.fire1); }],
          // 从上头来的智慧：柔光降下，火灭了
          [7.8, b => { W.set('lsWisdom', 1, b.instant); W.set('gale', 0.12, b.instant); sfx(b, 'harp'); }],
          [9.6, b => {
            W.set('lsFire', 0, b.instant); W.set('lsSteam', 1, b.instant);
            pose('farmer', 'stand'); pose('hearer', 'bow');
            sfx(b, 'rain', { soft: true });
          }],
          [12.6, b => { embrace('farmer', 'hearer'); glow('farmer', 0.4); glow('hearer', 0.36); sfx(b, 'harp', { soft: true }); }],
          [14.6, b => W.set('lsSteam', 0, b.instant)],
          // 用和平所栽种的义果
          [17, b => { W.set('lsPeace', 1, b.instant); W.set('gale', 0, b.instant); sfx(b, 'chime'); }],
          [21.4, b => { W.set('lsWisdom', 0, b.instant); const G = ptreeG(); sparkleAt(b, G.x, G.y - 26 * G.s, 16, [255, 226, 150], 12); }],
        ]);
      },
    },

    // ── 4 · 雅 4:8 你们亲近神，神就必亲近你们 ──────────────────────
    {
      kind: 'promise', utter: '你们亲近神，神就必亲近你们', cmd: 'approach 神 && await 神.approach(你们)', ref: '4:8',
      verse: [
        { text: '你们亲近神，神就必亲近你们。<br>有罪的人哪，要洁净你们的手！心怀二意的人哪，要清洁你们的心！', ref: '雅各书 4:8', hold: 7.5 },
        { text: '但他赐更多的恩典，所以经上说：<br>神阻挡骄傲的人，赐恩给谦卑的人。', ref: '雅各书 4:6', hold: 6 },
        { text: '务要在主面前自卑，主就必叫你们升高。', ref: '雅各书 4:10', hold: 5 },
      ],
      apply(c) {
        T(c, [
          // 众人从各处走近石台
          [0, b => {
            W.goTo(0.45, 16, b.instant);
            W.set('gale', 0, b.instant);
            for (const id of ['farmer', 'hearer', 'poor', 'peter', 'doer', 'widow', 'orphan']) go(id, Pk('g' + id[0].toUpperCase() + id.slice(1)), { speed: 0.04, pose: 'stand' });
            hold('widow', null);
            sfx(b, 'crowd', { soft: true });
          }],
          // 神就必亲近你们：光自天顶降下
          [2.6, b => { W.set('lsNear', 1, b.instant); W.set('lsNearY', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          [6.4, b => { faceSite(); all(id => pose(id, 'gaze')); }],
          // 赐恩给谦卑的人：跪下
          [8.8, b => { all(id => { pose(id, id === 'orphan' ? 'kneel' : 'pray'); glow(id, 0.34); }); sfx(b, 'bell', { soft: true }); }],
          [11.6, b => { const p = nearPt(); ringAt(b, p[0], p[1], 0.2, [255, 244, 214], 2.4, 1.6); }],
          // 主就必叫你们升高
          [16.1, b => {
            all(id => { pose(id, 'raise'); glow(id, 0.44); });
            const p = nearPt(); ringAt(b, p[0], p[1], 0.45, [255, 240, 200], 3, 2);
            sparkleAt(b, p[0], p[1], 30, [255, 240, 210], 26);
            sfx(b, 'harp');
          }],
          [20.4, b => { all(id => pose(id, 'stand')); }],
        ]);
      },
    },

    // ── 5 · 雅 5:18 天就降下雨来，地也生出土产 ──────────────────────
    {
      kind: 'act', utter: '天就降下雨来，地也生出土产', cmd: 'await 秋雨 && await 春雨  # 忍耐', ref: '5:18',
      verse: [
        { text: '弟兄们哪，你们要忍耐，直到主来。<br>看哪，农夫忍耐等候地里宝贵的出产，直到得了秋雨春雨。', ref: '雅各书 5:7', hold: 7 },
        { text: '义人祈祷所发的力量是大有功效的。以利亚与我们是一样性情的人……<br>他又祷告，天就降下雨来，地也生出土产。', ref: '雅各书 5:16–18', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          // 农夫回到旱田边，坐着等候
          [0, b => {
            W.goTo(0.535, 22, b.instant);
            W.set('lsNear', 0.3, b.instant);
            go('farmer', Pk('farmer'), { speed: 0.035, pose: 'sit' });
            sfx(b, 'wind', { soft: true });
          }],
          [4.4, b => { face('farmer', -1); pose('farmer', 'sit'); }],
          // 众人祷告；云聚起来
          [8.3, b => {
            for (const id of ['hearer', 'poor', 'peter', 'doer', 'widow', 'orphan']) pose(id, 'pray');
            W.set('clouds', 0.85, b.instant); W.set('storm', 0.3, b.instant);
            sfx(b, 'wind');
          }],
          [11.6, b => { W.set('rain', 0.75, b.instant); sfx(b, 'rain'); sfx(b, 'thunder', { far: true, soft: true }); }],
          // 地也生出土产
          [13.6, b => {
            W.set('lsSprout', 1, b.instant); W.set('lsScar', 0, b.instant);
            W.set('bare', 0, b.instant); W.set('grass', 0.92, b.instant); W.set('herbs', 0.72, b.instant); W.set('bloom', 0.6, b.instant);
          }],
          [16.4, b => { pose('farmer', 'raise'); face('farmer', -1); glow('farmer', 0.44); for (const id of ['hearer', 'poor', 'peter', 'doer', 'widow', 'orphan']) pose(id, 'gaze'); }],
          [20.4, b => { W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.4, b.instant); }],
          [22.4, b => { all(id => pose(id, 'stand')); W.setPop('bird', 16, W.w * 0.5, W.h * 0.4, b.instant); sfx(b, 'bird', { soft: true }); }],
        ]);
      },
    },

    // ── 6 · 彼前 1:3 活泼的盼望 ────────────────────────────────
    {
      kind: 'act', utter: '重生了我们，叫我们有活泼的盼望', cmd: 'regenerate --hope 活泼 --seed 不能坏的', ref: '彼得前书 1:3',
      verse: [
        { text: '愿颂赞归与我们主耶稣基督的父神！他曾照自己的大怜悯，<br>藉耶稣基督从死里复活，重生了我们，叫我们有活泼的盼望。', ref: '彼得前书 1:3', hold: 8 },
        { text: '因为凡有血气的，尽都如草；他的美荣都像草上的花。<br>草必枯干，花必凋谢；惟有主的道是永存的。', ref: '彼得前书 1:24–25', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          // 庄稼黄熟
          [0, b => {
            W.goTo(0.64, 20, b.instant);
            W.set('lsNear', 0.18, b.instant);
            W.set('lsGold', 1, b.instant);
            pose('farmer', 'stand'); face('farmer', -1);
            sfx(b, 'harp', { soft: true });
          }],
          // 草必枯干，花必凋谢
          [9.3, b => {
            W.set('lsWither', 1, b.instant);
            W.set('grass', 0.42, b.instant); W.set('bare', 0.55, b.instant); W.set('bloom', 0.08, b.instant); W.set('herbs', 0.3, b.instant);
            all(id => pose(id, 'bow'));
            sfx(b, 'wind', { soft: true });
          }],
          // 惟有主的道是永存的：「道」在田上成形，光的种子落下
          [16.4, b => {
            const rows = fieldModel(), r = rows[2], xf = lerp(r.a, r.b, 0.5);
            nameAt(b, '道', Math.max(xf, PORT ? 0.4 : 0.56), PORT ? 0.56 : 0.5, { rgb: [255, 238, 190], src: () => [xf * W.w + (Math.random() - 0.5) * 40, baseY(2, xf, r.v) - 10] });
            sfx(b, 'chime');
          }],
          [18.4, b => {
            W.set('lsHope', 1, b.instant);
            all(id => { pose(id, 'gaze'); glow(id, 0.42); });
            face('farmer', -1);
            sfx(b, 'stars');
          }],
          [21.4, b => { const rows = fieldModel(), r = rows[3], xf = lerp(r.a, r.b, 0.5); ringAt(b, xf * W.w, baseY(2, xf, r.v), 0.18, [210, 255, 180], 2.4, 1.6); all(id => pose(id, 'stand')); }],
        ]);
      },
    },

    // ── 7 · 彼前 2:6 房角石 ────────────────────────────────────
    {
      kind: 'promise', utter: '我把所拣选、所宝贵的房角石安放在锡安', cmd: 'place 房角石 --at 锡安 --chosen --precious', ref: '彼得前书 2:6',
      verse: [
        { text: '主乃活石，固然是被人所弃的，却是被神所拣选、所宝贵的。', ref: '彼得前书 2:4', hold: 6 },
        { text: '因为经上说：看哪，我把所拣选、所宝贵的房角石安放在锡安；<br>信靠他的人必不至于羞愧。', ref: '彼得前书 2:6', hold: 7.5 },
        { text: '……匠人所弃的石头已作了房角的头块石头。', ref: '彼得前书 2:7', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.68, 18, b.instant);
            W.set('lsNear', 0, b.instant);
            go('farmer', Pk('gFarmer'), { speed: 0.035, pose: 'stand' });
            sfx(b, 'harp', { soft: true });
          }],
          // 一道光落在被弃的石头上
          [1.2, b => { W.set('lsBeam', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          [3.8, b => { const sp = Pk('stone')[0]; all(id => { face(id, sp); pose(id, 'gaze'); }); }],
          // 它升起来，安放在石台的角上
          [7.3, b => { W.set('lsLift', 1, b.instant); sfx(b, 'wings', { soft: true }); }],
          [11.9, b => {
            const G = houseG(), R = stoneRect(G, stoneModel().corner);
            ringAt(b, R.cx, R.cy, 0.28, [255, 240, 200], 2.6, 2);
            shake(b, 0.18);
            sfx(b, 'seal');
            nameAt(b, '房角石', X.site - (PORT ? 0.02 : 0.04), PORT ? 0.6 : 0.62, { src: () => [R.cx + (Math.random() - 0.5) * 20, R.cy] });
          }],
          [14.4, b => { W.set('lsBeam', 0.25, b.instant); faceSite(); }],
          // 匠人所弃的石头作了房角的头块石头：众人俯伏
          [16.1, b => { all(id => { pose(id, id === 'orphan' ? 'kneel' : 'pray'); glow(id, 0.38); }); sfx(b, 'bell', { soft: true }); }],
        ]);
      },
    },

    // ── 8 · 彼前 2:5 活石（本幕的签名之景）──────────────────────────
    {
      kind: 'call', utter: '你们来到主面前，也就像活石', cmd: 'build 灵宫 --from 活石[] --priests all', ref: '彼得前书 2:5',
      verse: [
        { text: '你们来到主面前，也就像活石，被建造成为灵宫，<br>作圣洁的祭司，藉着耶稣基督奉献神所悦纳的灵祭。', ref: '彼得前书 2:5', hold: 9 },
        { text: '各人要照所得的恩赐彼此服事，作神百般恩赐的好管家。', ref: '彼得前书 4:10', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 寄居的人从帐棚那边来
          [0, b => {
            W.goTo(0.742, 24, b.instant);
            W.set('lsBeam', 0, b.instant);
            const c2 = C(), n = PORT ? 3 : 5;
            if (hasCrowd('saints')) c2.removeCrowd('saints', { fade: false });
            c2.crowd('saints', { n, x0: 1.02, x1: 1.09, layer: 2, label: '寄居的', glow: 0.26, from: b.instant ? 'none' : 'fade', mill: false });
            crowdV('saints', X.saintV, X.saintV + 0.09);
            c2.crowdWalk('saints', X.saint0, X.saint1, { speed: 0.05, pose: 'stand' });
            all(id => { pose(id, 'stand'); face(id, X.site); });
            sfx(b, 'crowd', { soft: true });
          }],
          // 每人胸中升起一块光的石头，砌在房角石旁
          [1.6, b => {
            W.set('lsBuild', 1, b.instant); W.set('lsHouse', 0.6, b.instant);
            all(id => pose(id, 'raise'));
            sfx(b, 'build', { soft: true });
          }],
          [4.6, b => sfx(b, 'build', { soft: true })],
          [6, b => { crowdPose('saints', 'raise'); crowdFace('saints', -1); }],
          [7.8, b => sfx(b, 'build', { soft: true })],
          [10.3, b => { all(id => pose(id, id === 'peter' ? 'raise' : 'carry')); sfx(b, 'build', { soft: true }); }],
          [13.2, b => sfx(b, 'build', { soft: true })],
          // 山墙
          [15, b => { W.set('lsRoof', 1, b.instant); sfx(b, 'chime'); }],
          // 灵宫立起来
          [18.4, b => {
            W.set('lsHouse', 1, b.instant);
            const G = houseG();
            ringAt(b, G.cx, G.top - G.roofH * 0.3, 0.5, [255, 240, 204], 3.2, 2.2);
            nameAt(b, '灵宫', X.site, PORT ? 0.58 : 0.54, { src: () => [G.cx + (Math.random() - 0.5) * G.hw * 2, G.top - Math.random() * G.roofH] });
            flashW(b, 0.12);
            sfx(b, 'bell');
          }],
          // 圣洁的祭司，奉献灵祭
          [20, b => {
            W.set('lsOffer', 1, b.instant);
            all(id => { pose(id, 'raise'); glow(id, 0.46); });
            crowdPose('saints', 'raise'); crowdGlow('saints', 0.4);
            sfx(b, 'angel', { soft: true });
          }],
          [24.4, b => { all(id => pose(id, 'stand')); crowdPose('saints', 'stand'); }],
        ]);
      },
    },

    // ── 9 · 彼前 2:9 召你们出黑暗入奇妙光明 ─────────────────────────
    {
      kind: 'call', utter: '召你们出黑暗入奇妙光明', cmd: 'call --from 黑暗 --to 奇妙光明', ref: '彼得前书 2:9',
      verse: [
        { text: '惟有你们是被拣选的族类，是有君尊的祭司，是圣洁的国度，是属神的子民，<br>要叫你们宣扬那召你们出黑暗入奇妙光明者的美德。', ref: '彼得前书 2:9', hold: 8.5 },
        { text: '因基督也曾一次为罪受苦，就是义的代替不义的，<br>为要引我们到神面前……', ref: '彼得前书 3:18', hold: 7 },
        { text: '你们从前好像迷路的羊，如今却归到你们灵魂的牧人监督了。', ref: '彼得前书 2:25', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 夜；黑暗笼罩全地，远处还有在黑暗里的人与迷路的羊
          [0, b => {
            W.goTo(0.9, 10, b.instant);
            W.set('lsDark', 1, b.instant); W.set('lsCall', 0, b.instant); W.set('lsOffer', 0.35, b.instant);
            const c2 = C(), n = PORT ? 2 : 3;
            for (const g of ['darkL', 'darkR', 'lostL', 'lostR']) if (hasCrowd(g)) c2.removeCrowd(g, { fade: false });
            c2.crowd('darkL', { n, x0: X.dL0, x1: X.dL1, layer: 2, label: '蒙召的人', glow: 0.03, from: b.instant ? 'none' : 'fade', mill: false, pose: 'stand' });
            c2.crowd('darkR', { n, x0: X.dR0, x1: X.dR1, layer: 2, label: '蒙召的人', glow: 0.03, from: b.instant ? 'none' : 'fade', mill: false, pose: 'stand' });
            crowdV('darkR', X.dRV, X.dRV + 0.06);
            if (c2.herd) {
              c2.herd('lostL', { kind: 'sheep', n: PORT ? 1 : 2, x0: X.dL0 + 0.01, x1: X.dL1 + 0.02, layer: 2, label: '迷路的羊', v: X.sheepV, pose: 'stand', from: b.instant ? 'none' : 'fade', mill: false });
              c2.herd('lostR', { kind: 'sheep', n: PORT ? 1 : 2, x0: X.dR0 - 0.03, x1: X.dR1, layer: 2, label: '迷路的羊', v: X.sheepV, pose: 'stand', from: b.instant ? 'none' : 'fade', mill: false });
              crowdV('lostL', X.sheepV, X.sheepV + 0.05); crowdV('lostR', X.sheepV, X.sheepV + 0.05);
            }
            S.called = 1;
            crowdFace('darkL', -1); crowdFace('darkR', 1);
            all(id => { pose(id, 'stand'); glow(id, 0.4); });
            sfx(b, 'bleat', { far: true, soft: true });
          }],
          // 灵宫的门开了
          [4.2, b => { W.set('lsDoor', 1, b.instant); sfx(b, 'gate', { soft: true }); }],
          // 奇妙的光自门里铺开
          [5.6, b => { W.set('lsCall', 1, b.instant); sfx(b, 'harp'); const G = houseG(); ringAt(b, G.cx, G.y - G.doorH * 0.5, 0.6, [255, 236, 190], 4, 1.8); }],
          [7.4, b => {
            const c2 = C();
            if (hasCrowd('darkL')) c2.crowdWalk('darkL', X.dLin0, X.dLin1, { speed: 0.03, pose: 'stand' });
            if (hasCrowd('darkR')) c2.crowdWalk('darkR', X.dRin0, X.dRin1, { speed: 0.03, pose: 'stand' });
            sfx(b, 'crowd', { soft: true });
          }],
          [12.6, b => { crowdGlow('darkL', 0.32); crowdGlow('darkR', 0.32); crowdFace('darkL', 1); crowdFace('darkR', -1); crowdPose('darkL', 'gaze'); crowdPose('darkR', 'gaze'); }],
          // 迷路的羊归到牧人那里：彼得立在灵宫门旁
          [16.8, b => {
            go('peter', Pk('door'), { speed: 0.035, pose: 'stand' });
            const c2 = C();
            if (hasCrowd('lostL')) c2.crowdWalk('lostL', X.shL0, X.shL1, { speed: 0.05, pose: 'stand' });
            if (hasCrowd('lostR')) c2.crowdWalk('lostR', X.shR0, X.shR1, { speed: 0.05, pose: 'stand' });
            S.sheep = 1;
            sfx(b, 'bleat', { soft: true });
          }],
          [22.6, b => { face('peter', -1); crowdPose('lostL', 'lie'); crowdPose('lostR', 'lie'); all(id => pose(id, 'stand')); }],
        ]);
      },
    },

    // ── 10 · 彼前 5:7 将一切的忧虑卸给神 ────────────────────────────
    {
      kind: 'promise', utter: '将一切的忧虑卸给神，因为他顾念你们', cmd: 'mv ~/忧虑/* 神/  # 他顾念你们', ref: '彼得前书 5:7',
      verse: [
        { text: '亲爱的弟兄啊，有火炼的试验临到你们，不要以为奇怪……<br>倒要欢喜；因为你们是与基督一同受苦……', ref: '彼得前书 4:12–13', hold: 7 },
        { text: '务要谨守，警醒。因为你们的仇敌魔鬼，如同吼叫的狮子，遍地游行，<br>寻找可吞吃的人。你们要用坚固的信心抵挡他……', ref: '彼得前书 5:8–9', hold: 8 },
        { text: '你们要将一切的忧虑卸给神，因为他顾念你们。', ref: '彼得前书 5:7', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 子夜；远山后暗红的火光；众人背着重担低头
          [0, b => {
            W.goTo(0.015, 14, b.instant);
            W.set('lsDark', 0.5, b.instant); W.set('lsDoor', 0.45, b.instant); W.set('lsOffer', 0.15, b.instant);
            W.set('lsTrial', 1, b.instant);
            for (const id of ['farmer', 'hearer', 'poor', 'doer', 'widow']) hold(id, 'bundle');
            all(id => pose(id, id === 'widow' || id === 'orphan' ? 'sit' : 'bow'));
            crowdPose('saints', 'bow'); crowdPose('darkL', 'bow'); crowdPose('darkR', 'bow');
            sfx(b, 'fire', { far: true, soft: true });
          }],
          [3.2, b => sfx(b, 'weep', { soft: true })],
          // 如同吼叫的狮子遍地游行（只在旁白里）：一团冷暗的烟影从田边向众人游过来；低低的一阵冷风
          [8.3, b => {
            W.set('lsLion', 1, b.instant); W.set('lsLionX', 1, b.instant); W.set('lsLionBack', 0, b.instant);
            sfx(b, 'wind', { far: true, low: true });
          }],
          [10.2, b => { for (const id of ['farmer', 'hearer', 'poor']) face(id, -1); sfx(b, 'thunder', { far: true, soft: true }); }],
          // 用坚固的信心抵挡他
          [12.4, b => {
            all(id => { pose(id, 'stand'); face(id, -1); glow(id, 0.42); });
            crowdFace('saints', -1); crowdFace('darkL', -1); crowdFace('darkR', -1);
            crowdPose('saints', 'stand'); crowdPose('darkL', 'stand'); crowdPose('darkR', 'stand');
            pose('peter', 'raise');
            ringOn(b, 'peter', 0.14, [255, 236, 190], 0.6);
            // 被抵挡：烟影往回缩，变淡
            W.set('lsLionBack', 1, b.instant); W.set('lsLion', 0.5, b.instant);
            const lp = lionPt(); ringAt(b, lp[0], lp[1] - PH() * 0.4, 0.1, [230, 236, 255], 1.8, 1.2);
            sfx(b, 'bell', { soft: true });
          }],
          [15.4, b => { W.set('lsLion', 0, b.instant); }],
          // 将一切的忧虑卸给神：重担化作光升上去
          [17.6, b => {
            for (const id of NAMED) hold(id, id === 'peter' ? 'staff' : null);
            W.set('lsCast', 1, b.instant);
            sfx(b, 'harp');
          }],
          [19.2, b => {
            W.set('lsTrial', 0, b.instant); W.set('lsLion', 0, b.instant);
            all(id => pose(id, 'raise'));
            crowdPose('saints', 'raise');
            sfx(b, 'wind', { soft: true });
          }],
          [22.8, b => {
            all(id => pose(id, 'stand'));
            crowdPose('saints', 'stand');
            const G = houseG(); ringAt(b, G.cx, G.y - G.wallH * 0.5, 0.55, [255, 236, 196], 3.4, 1.8);
          }],
        ]);
      },
    },

    // ── 11 · 彼后 1:17 这是我的爱子，我所喜悦的 ─────────────────────
    {
      kind: 'name', utter: '这是我的爱子，我所喜悦的', cmd: 'voice --from 极大荣光 --on 圣山', ref: '彼得后书 1:17',
      verse: [
        { text: '……乃是亲眼见过他的威荣。他从父神得尊贵荣耀的时候，<br>从极大荣光之中有声音出来，向他说：「这是我的爱子，我所喜悦的。」', ref: '彼得后书 1:16–17', hold: 9 },
        { text: '我们并有先知更确的预言，如同灯照在暗处。你们在这预言上留意，<br>直等到天发亮，晨星在你们心里出现的时候，才是好的。', ref: '彼得后书 1:19', hold: 9 },
      ],
      apply(c) {
        T(c, [
          // 黎明前；彼得举着灯
          [0, b => {
            W.goTo(0.1, 9, b.instant);
            W.set('lsDark', 0.3, b.instant); W.set('lsCast', 0, b.instant); W.set('lsDoor', 0.3, b.instant); W.set('lsHouse', 0.7, b.instant);
            hold('peter', 'torch');
            go('peter', Pk('lamp'), { speed: 0.035, pose: 'stand' });
            W.set('lsLamp', 1, b.instant);
            for (const id of ['farmer', 'hearer', 'poor', 'doer', 'widow', 'orphan']) pose(id, 'sit');
            crowdPose('saints', 'sit'); crowdPose('darkL', 'sit'); crowdPose('darkR', 'sit');
            sfx(b, 'fire', { soft: true });
          }],
          // 远山上显出圣山的异象
          [1.6, b => {
            W.set('lsHoly', 1, b.instant);
            all(id => face(id, X.holy));
            sfx(b, 'angel');
          }],
          // 从极大荣光之中有声音出来
          [5.4, b => {
            const p = holyPt(), h = Math.max(22, M() * 0.05);
            ringAt(b, p[0], p[1] - h, 0.35, [255, 252, 240], 3.2, 2.2);
            flashW(b, 0.18);
            for (const id of ['farmer', 'hearer', 'poor', 'doer']) pose(id, 'kneel');
            pose('peter', 'gaze');
            sfx(b, 'bell');
          }],
          [9.4, b => { W.set('lsHoly', 0, b.instant); }],
          // 如同灯照在暗处
          [10.3, b => { face('peter', -1); pose('peter', 'stand'); ringOn(b, 'peter', 0.12, [255, 200, 130], 1.05); for (const id of ['farmer', 'hearer', 'poor', 'doer', 'widow', 'orphan']) { face(id, Pk('lamp')[0]); pose(id, 'sit'); } }],
          // 直等到天发亮，晨星在你们心里出现
          [14.6, b => { W.goTo(0.232, 11, b.instant); W.set('lsDark', 0, b.instant); W.set('lsStar', 1, b.instant); sfx(b, 'stars'); }],
          [17, b => {
            const from = () => starPt();
            present().forEach((id, i) => trans(b, { type: 'stream', from, to: id, dur: 3.2, delay: i * 0.06 }));
            all(id => { face(id, -1); pose(id, 'gaze'); glow(id, 0.46); });
            crowdPose('saints', 'stand'); crowdPose('darkL', 'stand'); crowdPose('darkR', 'stand');
            sfx(b, 'harp');
          }],
          [21.4, b => { W.set('lsLamp', 0, b.instant); hold('peter', 'staff'); }],
        ]);
      },
    },

    // ── 12 · 彼后 3:8 主看一日如千年，千年如一日 ──────────────────────
    {
      kind: 'act', utter: '主看一日如千年，千年如一日', cmd: 'sleep 1000y == sleep 1d  # 宽容，不是耽延', ref: '彼得后书 3:8',
      verse: [
        { text: '神也没有宽容上古的世代，曾叫洪水临到那不敬虔的世代，<br>却保护了传义道的挪亚一家八口……', ref: '彼得后书 2:5', hold: 7.5 },
        { text: '亲爱的弟兄啊，有一件事你们不可忘记，<br>就是主看一日如千年，千年如一日。', ref: '彼得后书 3:8', hold: 6.5 },
        { text: '主所应许的尚未成就，有人以为他是耽延，其实不是耽延，乃是宽容你们，<br>不愿有一人沉沦，乃愿人人都悔改。', ref: '彼得后书 3:9', hold: 8 },
      ],
      apply(c) {
        T(c, [
          // 天上浮现方舟的异象
          [0, b => {
            W.goTo(0.25, 6, b.instant);
            W.set('lsStar', 0, b.instant); W.set('lsArk', 1, b.instant);
            all(id => { pose(id, 'stand'); face(id, -1); });
            sfx(b, 'wave', { soft: true });
          }],
          [2.4, b => sfx(b, 'dove', { soft: true })],
          [7, b => W.set('lsArk', 0, b.instant)],
          // 一日如千年：日子飞逝，树长大，地返青，灵宫依旧
          [8.8, b => {
            W.goTo(0.245, 2.8, b.instant);
            W.set('trees', 0.28, b.instant); W.set('grass', 0.95, b.instant); W.set('bare', 0, b.instant); W.set('bloom', 0.75, b.instant); W.set('herbs', 0.8, b.instant);
            W.set('lsWither', 0, b.instant); W.set('lsGold', 0, b.instant); W.set('lsHope', 0.7, b.instant);
            sfx(b, 'wind', { soft: true });
          }],
          [11.7, b => { W.goTo(0.245, 2.3, b.instant); }],
          [14.1, b => { W.goTo(0.238, 2.8, b.instant); sfx(b, 'bird', { soft: true }); }],
          // 乃愿人人都悔改：又有人从远处来
          [16.6, b => {
            const c2 = C(), n = PORT ? 2 : 3;
            if (hasCrowd('more')) c2.removeCrowd('more', { fade: false });
            c2.crowd('more', { n, x0: 1.03, x1: 1.08, layer: 2, label: '悔改的人', glow: 0.4, from: b.instant ? 'none' : 'fade', mill: false });
            crowdV('more', X.moreV, X.moreV + 0.06);
            c2.crowdWalk('more', X.more0, X.more1, { speed: 0.045, pose: 'stand' });
            S.more = 1;
            all(id => face(id, 1));
            sfx(b, 'crowd', { soft: true });
          }],
          [21.2, b => { crowdPose('more', 'kneel'); crowdGlow('more', 0.38); ringAt(b, (X.more0 + X.more1) / 2 * W.w, baseY(2, (X.more0 + X.more1) / 2, X.moreV + 0.03) - PH() * 0.4, 0.12, [255, 236, 196], 2.2, 1.4); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 13 · 彼后 3:13 新天新地 ────────────────────────────────
    {
      kind: 'promise', utter: '新天新地，有义居在其中', cmd: 'await 新天新地  # 有义居在其中', ref: '彼得后书 3:13',
      verse: [
        { text: '但我们照他的应许，盼望新天新地，有义居在其中。', ref: '彼得后书 3:13', hold: 6.5 },
        { text: '你们却要在我们主救主耶稣基督的恩典和知识上有长进。<br>愿荣耀归给他，从今直到永远。阿们！', ref: '彼得后书 3:18', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.3, 15, b.instant);
            W.set('lsNew', 1, b.instant); W.set('lsHouse', 1, b.instant); W.set('lsDoor', 0.4, b.instant);
            W.set('bloom', 1, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 0.9, b.instant);
            W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, b.instant);
            all(id => { face(id, -1); pose(id, 'gaze'); glow(id, 0.48); });
            crowdPose('more', 'stand'); crowdFace('more', -1);
            crowdPose('saints', 'gaze'); crowdPose('darkL', 'gaze'); crowdPose('darkR', 'gaze');
            sfx(b, 'harp');
          }],
          [3, b => { nameAt(b, '新天新地', X.newX, PORT ? 0.5 : 0.36, { rgb: [255, 240, 204], hold: 3.6 }); }],
          [7.8, b => {
            W.set('lsOffer', 1, b.instant);
            all(id => pose(id, 'raise'));
            crowdPose('saints', 'raise'); crowdPose('more', 'raise'); crowdPose('darkL', 'raise'); crowdPose('darkR', 'raise');
            const G = houseG(); ringAt(b, G.cx, G.top - G.roofH * 0.3, 0.8, [255, 244, 214], 4, 2.2);
            sfx(b, 'angel');
          }],
          [13, b => { all(id => pose(id, 'stand')); crowdPose('saints', 'stand'); crowdPose('more', 'stand'); crowdPose('darkL', 'stand'); crowdPose('darkR', 'stand'); sfx(b, 'bird', { soft: true }); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '普通书信', books: [59, 60, 61], title: '活石', sub: '雅各书 · 彼得前书 · 彼得后书', tint: [240, 230, 210], music: 'solomon',
    outro: 24,
    intro: [
      { text: '作神和主耶稣基督仆人的雅各请散住十二个支派之人的安。', ref: '雅各书 1:1', hold: 6 },
      { text: '耶稣基督的使徒彼得写信给那分散在本都、加拉太、加帕多家、亚细亚、<br>庇推尼寄居的……', ref: '彼得前书 1:1', hold: 6.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '彼得': { text: '我这作长老、作基督受苦的见证、同享后来所要显现之荣耀的，劝你们中间与我同作长老的人：务要牧养在你们中间神的群羊……', ref: '彼得前书 5:1–2' },
      '农夫': { text: '看哪，农夫忍耐等候地里宝贵的出产，直到得了秋雨春雨。', ref: '雅各书 5:7' },
      '穷弟兄': { text: '我亲爱的弟兄们，请听，神岂不是拣选了世上的贫穷人，叫他们在信上富足，并承受他所应许给那些爱他之人的国吗？', ref: '雅各书 2:5' },
      '弟兄': { text: '我亲爱的弟兄们，请听，神岂不是拣选了世上的贫穷人，叫他们在信上富足，并承受他所应许给那些爱他之人的国吗？', ref: '雅各书 2:5' },
      '听道的人': { text: '因为听道而不行道的，就像人对着镜子看自己本来的面目，看见，走后，随即忘了他的相貌如何。', ref: '雅各书 1:23–24' },
      '行道的人': { text: '惟有详细察看那全备、使人自由之律法的，并且时常如此，这人既不是听了就忘，乃是实在行出来，就在他所行的事上必然得福。', ref: '雅各书 1:25' },
      '寡妇': { text: '在神我们的父面前，那清洁没有玷污的虔诚，就是看顾在患难中的孤儿寡妇，并且保守自己不沾染世俗。', ref: '雅各书 1:27' },
      '孤儿': { text: '在神我们的父面前，那清洁没有玷污的虔诚，就是看顾在患难中的孤儿寡妇，并且保守自己不沾染世俗。', ref: '雅各书 1:27' },
      '寄居的': { text: '亲爱的弟兄啊，你们是客旅，是寄居的。', ref: '彼得前书 2:11' },
      '蒙召的人': { text: '你们从前算不得子民，现在却作了神的子民；从前未曾蒙怜恤，现在却蒙了怜恤。', ref: '彼得前书 2:10' },
      '迷路的羊': { text: '你们从前好像迷路的羊，如今却归到你们灵魂的牧人监督了。', ref: '彼得前书 2:25' },
      '悔改的人': { text: '不愿有一人沉沦，乃愿人人都悔改。', ref: '彼得后书 3:9' },
      '灵宫': { text: '你们来到主面前，也就像活石，被建造成为灵宫，作圣洁的祭司，藉着耶稣基督奉献神所悦纳的灵祭。', ref: '彼得前书 2:5' },
      '房角石': { text: '看哪，我把所拣选、所宝贵的房角石安放在锡安；信靠他的人必不至于羞愧。', ref: '彼得前书 2:6' },
      '被弃的石头': { text: '匠人所弃的石头已作了房角的头块石头。', ref: '彼得前书 2:7' },
      '帐棚': { text: '我以为应当趁我还在这帐棚的时候提醒你们，激发你们。', ref: '彼得后书 1:13' },
      '田': { text: '工人给你们收割庄稼，你们亏欠他们的工钱，这工钱有声音呼叫，并且那收割之人的冤声已经入了万军之主的耳了。', ref: '雅各书 5:4' },
      '树林': { text: '看哪，最小的火能点着最大的树林。', ref: '雅各书 3:5' },
      '义果': { text: '并且使人和平的，是用和平所栽种的义果。', ref: '雅各书 3:18' },
      '晨星': { text: '直等到天发亮，晨星在你们心里出现的时候，才是好的。', ref: '彼得后书 1:19' },
      '灯': { text: '我们并有先知更确的预言，如同灯照在暗处。', ref: '彼得后书 1:19' },
    },
  });
})(window.GS);
