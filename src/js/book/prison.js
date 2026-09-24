/* ─────────────────────────────────────────────────────────────
 * book/prison.js —— 监狱书信 · 恩典（以弗所书 · 腓立比书 · 歌罗西书 · 腓利门书）
 *
 * 罗马，保罗自己所租的房子（徒 28:16，30）：近地中右是一间临街敞开的屋子，屋里一盏陶灯、一张小桌、一卷书信；
 * 保罗坐在桌旁写，腕上一条锁链，锁链的那一头是看守他的兵；提摩太坐在桌的另一边，推基古站在门口。
 * 屋前是一方院子（近地中间，玩家最看得清的地方），中丘上是罗马城（庙的山墙、水道的拱、柏树与伞松）。
 * 四封书信一封一封写成；书信里的话，一句一句在世界里显为可见的光：
 *   以弗所书：天上各样属灵的福气如金色的微光落满全地；圣灵的印记（1）。
 *     灰暗坐着的几个外邦人，恩典临到——一个一个站起来，衣袍有了颜色，手中接过一点光（2:1–9，本幕的主句）。
 *     院子当中一道隔断的矮墙，从中间化为光、塌下；两下的人走到一处，房角石亮起，一座光的殿的轮廓（2:13–22）。
 *     保罗屈膝；基督的爱「长阔高深」——四道光从屋上伸向天、地、左右与远方；一条金线穿过众人（3，4:4–6）。
 *     夜里众人睡了，只有保罗在灯下写；「你这睡着的人当醒过来」——上头的光，众人醒来，手里有灯，全城的窗亮起（5）。
 *     黎明，保罗站起，锁在罗马兵的身边，神所赐的全副军装一件一件以光显在他身上（6）；以弗所书封好。
 *   腓立比书：以巴弗提从腓立比带来馈送，极美的香气升起；御营的兵一个一个心里亮了（1，4:18）。
 *     一点光从至高处降下，降到最低，降到中丘上一个小小的十字架的剪影，暗成一点余烬——
 *     「神将他升为至高」：光升回至高处，天上写出「耶稣」，地上、城里、天上的众光都屈膝（2，3:20）。
 *     喜乐；风起云聚，一座平安的光穹罩住屋与院子，风就止了；以巴弗提带着书信回去（4）。
 *   歌罗西书：黄昏，天顶一点光；众星、飞鸟、看不见的光影一齐显出——「万有也靠他而立」：金线从那光牵到万物（1）。
 *     一个逃走的奴仆阿尼西谋跪在门口，头上悬着一卷写满墨字的字据；字一个一个涂抹成光，字据卷起升入光中，
 *     边上阴冷的暗影退去；保罗扶起他，抱住他（2）。「惟有基督是包括一切」——众人心里同一种光，
 *     阿尼西谋身上缠上五道光（怜悯、恩慈、谦虚、温柔、忍耐）与一条金带（爱心）；推基古和他坐船去了（3–4）。
 *   腓利门书：幕一暗一明，已是歌罗西腓利门的家；阿尼西谋回来跪下，腓利门读了信，把他扶起抱住——
 *     「不再是奴仆……是亲爱的兄弟」；「愿我们主耶稣基督的恩常在你的心里」，满屋的灯与恩典的光。
 *
 * 神从不显为形像：父是上头的光与经文；子（在书信里）只是光——降下、升高、万有所靠的那一点光；
 * 圣灵是灵的微光与一条金线。锁链、兵器都不伤人：罗马兵的军装与神所赐的光的军装并立。
 * 方位：左 = 海（东，船往东去）；近地中右 = 保罗的住处；院子在屋前；中丘 = 罗马城（末一句换作歌罗西）。
 * 一切位置都以画面宽度的比例记下（手机竖屏另有一套）；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU } = U;
  const ACT = 'prison';
  const isCur = () => GS.book.current(ACT);
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);

  // ── 本幕的程度（缓动的量；恢复存档时直接到位）────────────────
  const LV = {
    prWrite: ['exp', 1.4],    // 笔下的一点光（写的时候）
    prScroll: ['lin', 0.08],  // 桌上这一封信写了多少（0 → 1）
    prBless: ['exp', 0.35],   // 天上各样属灵的福气：落满全地的金色微光（弗 1:3）
    prPall: ['exp', 0.6],     // 死在过犯罪恶之中：罩着那几个人的冷灰（弗 2:1）
    prGift: ['exp', 0.9],     // 神所赐的：手中的一点光（弗 2:8）
    prWall: ['lin', 0.42],    // 中间隔断的墙（1 立着 → 0 拆毁）（弗 2:14）
    prStone: ['exp', 0.6],    // 房角石（弗 2:20）
    prHouse: ['lin', 0.3],    // 光的殿的轮廓，渐渐画成（弗 2:21）
    prHouseA: ['exp', 0.7],
    prLove: ['lin', 0.22],    // 长阔高深：四道光伸出去（弗 3:18）
    prLoveA: ['exp', 0.8],
    prThread: ['lin', 0.35],  // 贯乎众人之中的一条金线（弗 4:6）
    prThreadA: ['exp', 0.8],
    prShine: ['exp', 0.9],    // 基督就要光照你了（弗 5:14）
    prCity: ['lin', 0.16],    // 全城的窗一扇一扇亮起
    prHand: ['exp', 0.9],     // 手中的灯
    prSong: ['exp', 0.8],     // 诗章、颂词、灵歌（弗 5:19）
    prBelt: ['exp', 1.1], prPlate: ['exp', 1.1], prShoes: ['exp', 1.1],   // 全副军装（弗 6:14–17）
    prShield: ['exp', 1.1], prHelm: ['exp', 1.1], prSword: ['exp', 1.1],
    prChain: ['exp', 0.8],    // 锁链上的光（弗 6:20；腓 1:13；西 4:18）
    prIncense: ['exp', 0.5],  // 极美的香气（腓 4:18）
    prDesc: ['lin', 0.13],    // 虚己：一点光从至高处降下（腓 2:6–8）
    prDescA: ['exp', 0.9],
    prCross: ['exp', 0.7],    // 中丘上小小的十字架的剪影
    prRise: ['lin', 0.45],    // 神将他升为至高（腓 2:9）
    prHigh: ['exp', 0.7],
    prHost: ['exp', 0.6],     // 天上的：众光
    prBowH: ['exp', 0.9],     // 众光屈膝
    prDeep: ['exp', 0.5],     // 地底下的：深处的一点光
    prPeace: ['exp', 0.45],   // 出人意外的平安：一座光穹（腓 4:7）
    prOrb: ['exp', 0.5],      // 那不能看见之神的像：天顶的一点光（西 1:15）
    prMake: ['exp', 0.45],    // 天上的、地上的；能看见的、不能看见的（西 1:16）
    prHold: ['lin', 0.25],    // 万有也靠他而立：金线（西 1:17）
    prHoldA: ['exp', 0.7],
    prShade: ['exp', 0.5],    // 执政的、掌权的：边上阴冷的暗影（西 2:15）
    prDebt: ['exp', 0.8],     // 字据（西 2:14）
    prErase: ['lin', 0.3],    // 涂抹
    prDebtUp: ['lin', 0.22],  // 撤去
    prVirtue: ['lin', 0.2],   // 怜悯、恩慈、谦虚、温柔、忍耐，爱心（西 3:12–14）
    prVirtueA: ['exp', 0.8],
    prBoat: ['lin', 0.12],    // 推基古和阿尼西谋坐的船（西 4:7–9）
    prVeil: ['exp', 2.4],     // 一暗一明：换到歌罗西
    prGrace: ['exp', 0.4],    // 恩常在你的心里（门 1:25）
    prLamps: ['exp', 0.5],    // 腓利门家的灯
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);
  const LV0 = {};
  for (const k in LV) LV0[k] = 0;
  LV0.prWall = 1;

  // ── 地上的位置：[桌面, 手机竖屏]（画面宽度的比例）────────────────
  const POS = {
    house: [0.735, 0.8],
    paul: [0.752, 0.828], table: [0.728, 0.788], tim: [0.704, 0.748], guard: [0.79, 0.905], tych: [0.636, 0.64],
    paulUp: [0.742, 0.815], guardUp: [0.778, 0.878],
    paulDoor: [0.662, 0.668], guardDoor: [0.694, 0.725],
    // 手机竖屏：外邦人站开在崖边以内的草地上，墙与犹太人随之右移（不挤在崖边）
    wall: [0.54, 0.63],
    g0: [0.445, 0.47], g1: [0.525, 0.6], j0: [0.558, 0.652], j1: [0.625, 0.735],
    // 合而为一的众人：桌面上整组在经文区之右（光的殿的左柱不碰经文）
    m0: [0.492, 0.465], m1: [0.635, 0.64],
    exitL: [0.39, 0.4], door: [0.662, 0.668],
    epIn: [0.468, 0.46], ep: [0.655, 0.66], gift: [0.69, 0.7],
    pg1: [0.832, 0.7], pg2: [0.87, 0.86],
    oneFrom: [0.4, 0.41], oneK: [0.649, 0.636], oneStand: [0.5, 0.49], tychGo: [0.522, 0.52],
    dock: [0.412, 0.43],
    // 歌罗西
    phil: [0.69, 0.71], apph: [0.73, 0.775], arch: [0.768, 0.86],
    arrive: [0.432, 0.44], oneMeet: [0.648, 0.646], tychMeet: [0.6, 0.585], philEmb: [0.668, 0.686],
    ch0: [0.455, 0.45], ch1: [0.575, 0.56],
    // 天上
    loveC: [0.735, 0.8],
  };
  const phone = () => W.w < 600;
  const px = k => POS[k][phone() ? 1 : 0];

  const ROBE = {
    grey: [118, 116, 118], soldier: [164, 56, 46], solAcc: [200, 172, 110],
    tim: [110, 128, 112], timAcc: [222, 208, 180], tych: [124, 108, 150], tychAcc: [214, 200, 170],
    ep: [150, 128, 88], epAcc: [224, 204, 156], slave: [112, 104, 96], one: [178, 134, 86], oneAcc: [238, 212, 150],
    phil: [176, 146, 104], philAcc: [232, 218, 190], apph: [150, 96, 110], arch: [100, 120, 140],
  };
  const G_ROBES = [[168, 76, 62], [92, 118, 150], [186, 158, 104], [118, 138, 92], [150, 108, 138]];
  const G_ACC = [[226, 210, 180], [230, 220, 200], [120, 84, 60], [226, 214, 190], [232, 216, 190]];
  const G_SEX = ['m', 'f', 'm', 'f', 'm'], G_AGE = ['adult', 'adult', 'elder', 'adult', 'adult'];
  const G_V = [0.34, 0.5, 0.24, 0.44, 0.3];
  const J_ROBES = [[214, 206, 186], [112, 100, 84], [190, 178, 150], [88, 100, 128]];
  const J_ACC = [[70, 92, 150], [226, 220, 204], [70, 92, 150], [226, 220, 204]];
  const J_SEX = ['m', 'f', 'm', 'm'], J_AGE = ['elder', 'adult', 'adult', 'adult'];
  const J_V = [0.3, 0.46, 0.22, 0.4];
  // 手机竖屏：前后错开，免得叠在一处
  const G_VP = [0.2, 0.45, 0.7], J_VP = [0.35, 0.62, 0.48];
  const gV = i => (phone() ? G_VP[i] : G_V[i]), jV = i => (phone() ? J_VP[i] : J_V[i]);
  const CH_ROBES = [[150, 120, 92], [120, 104, 140], [170, 140, 100], [104, 124, 110], [160, 100, 90]];

  const STUCCO = [226, 208, 174], STUCCO_S = [184, 164, 130], DADO = [156, 66, 50], PLASTER = [190, 164, 124], ROOF = [170, 90, 62];
  const WOOD = [104, 76, 54], IRON = [70, 66, 64], PARCH = [236, 222, 188], INK = [52, 40, 34], GOLD = [255, 226, 150];
  const WHITEW = [238, 232, 216], VINE = [92, 128, 70], CYP = [52, 78, 58], PINE = [66, 96, 64];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { place: 'rome', sealed: 0, gift: false, wall: true, arm: false, one: 'none', boat: 'dock', read: false };
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const BOOST = () => (phone() ? 1.55 : 1);
  const PH = l => 34 * W.layerScale(l) * BOOST() * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const vK = v => 1 + 0.35 * v;
  const rome = () => S.place === 'rome';

  // 确定性的随机表（只用于形状，不用于状态）
  const RT = [];
  (function () { const r = U.mulberry32(4917); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const live = id => { const f = fig(id); return !!(f && !f.dying); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function look(id, key, o) { const L = (C().LOOK && C().LOOK[key]) || {}; return add(id, Object.assign({}, L, o)); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function prop(id, k) { const c = C(); if (c.prop && fig(id)) c.prop(id, k); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function hold(a, b, on) { const c = C(); if (c.holdHands && fig(a) && fig(b)) c.holdHands(a, b, on); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  const from = b => (b.instant ? 'none' : 'fade');
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 众人：外邦人（弗 2:1–10）、犹太人（弗 2:13–22）
  const G_IDS = () => (phone() ? ['g1', 'g2', 'g3'] : ['g1', 'g2', 'g3', 'g4', 'g5']);
  const J_IDS = () => (phone() ? ['j1', 'j2', 'j3'] : ['j1', 'j2', 'j3', 'j4']);
  const gIdx = id => +id.slice(1) - 1;
  const gX = i => lerp(px('g0'), px('g1'), (i + 0.5) / G_IDS().length);
  const jX = i => lerp(px('j0'), px('j1'), (i + 0.5) / J_IDS().length);
  // 两下合而为一：交错站在一处
  function merged() {
    const g = G_IDS(), j = J_IDS(), out = [];
    for (let i = 0; i < Math.max(g.length, j.length); i++) { if (g[i]) out.push(g[i]); if (j[i]) out.push(j[i]); }
    return out;
  }
  const mX = k => lerp(px('m0'), px('m1'), (k + 0.5) / merged().length);
  // 院子里此刻的圣徒（按次序）
  const COURT = () => merged().filter(live);
  const SLEEP = () => (phone() ? ['g1', 'j1'] : ['g1', 'j1', 'g2', 'j2']);

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac, f._h || 30];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = PH(l) * vK(f.v || 0);
    return [x, y - h * frac, h];
  }
  // 手的位置（按姿势大致估出）
  const HAND = { stand: [0.05, 0.48], walk: [0.05, 0.48], carry: [0.24, 0.64], raise: [0.03, 1.1], seat: [0.22, 0.375], kneel: [0.12, 0.36], gaze: [0.05, 0.48], embrace: [0.2, 0.62], point: [0.3, 0.72], worship: [0.2, 0.2], pray: [0.12, 0.52] };
  function handPt(id) {
    const f = fig(id);
    if (!f || !f._vis) return null;
    const q = HAND[f.pose] || HAND.stand, d = f.fd >= 0 ? 1 : -1;
    return [f._x + d * q[0] * f._h, f._y - q[1] * f._h, f._h, f.alpha];
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function ringFig(b, id, rgb, k) { const p = figPt(id, 0.55); if (p) ringAt(b, p[0], p[1], rgb, p[2] * (k || 1.6), 1.8); }
  // 一行字在某处聚成（字号至少 0.03·min(W,H)）
  function wordsAt(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = Math.max(0.03 * M(), Math.min((o.size || 0.04) * M(), (W.w * 0.62) / Math.max(1, n * 1.08)));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(x, half + 8, W.w - half - 8), cy = clamp(y, size + 8, W.h - size);
    const src = o.src || (() => [x + (Math.random() - 0.5) * 60 * SU(), y + 30 * SU() * Math.random()]);
    fx().nameStr(str, cx, cy, size, rgb, src, { hold: o.hold || 3.2, delay: o.delay, dark: o.dark });
  }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）
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
    SP = {
      warm: radial([255, 196, 120], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      soft: radial([255, 238, 206], 1, 0.5), ember: radial([255, 170, 90], 1, 0.4), pale: radial([226, 236, 255], 1),
      dark: radial([14, 16, 26], 1, 0.55), rose: radial([255, 214, 200], 1, 0.45), cold: radial([88, 96, 118], 1, 0.55),
      mist: radial([70, 80, 108], 1, 0.55),
    };
    // 福气的微光：金色的晕，白色的芯（一次画成）
    const bc = cnv(32, 32), bg = bc.getContext('2d'), gr = bg.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,252,240,1)'); gr.addColorStop(0.14, 'rgba(255,238,180,0.85)');
    gr.addColorStop(0.42, 'rgba(255,222,150,0.26)'); gr.addColorStop(1, 'rgba(255,214,140,0)');
    bg.fillStyle = gr; bg.fillRect(0, 0, 32, 32);
    SP.bless = bc;
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!(a > 0.004) || !(r > 0.5)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }
  function beam(ctx, x, y0, y1, w, a) {
    if (a < 0.005) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.beam, x - w / 2, y0, w, Math.max(1, y1 - y0));
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 小火（陶灯、手中的灯）
  const FL = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.4, k * (0.22 + 0.5 * nightK()));
    for (let i = 0; i < 4; i++) {
      const q = FL[i];
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
  // 一道发光的线（宽的柔光 + 细的亮芯）
  function glowLine(ctx, pts, w, rgb, a) {
    if (a < 0.005 || pts.length < 2) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const pass = [[w * 4.5, 0.08], [w * 2, 0.2], [w, 0.75]];
    for (const q of pass) {
      ctx.strokeStyle = U.rgba(rgb[0], rgb[1], rgb[2], Math.min(1, a * q[1]));
      ctx.lineWidth = Math.max(0.6, q[0]);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
    }
    ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    ctx.globalCompositeOperation = 'source-over';
  }
  // 折线取前 k（0..1）的一段
  function partial(pts, k) {
    if (k >= 1) return pts;
    if (k <= 0 || pts.length < 2) return [];
    let tot = 0;
    const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
    let want = tot * k;
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const d = seg[i - 1];
      if (want >= d) { out.push(pts[i]); want -= d; continue; }
      const t = d > 0 ? want / d : 0;
      out.push([lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)]);
      break;
    }
    return out;
  }
  // 经由若干点的平滑曲线（取样成折线）
  function smooth(pts, n) {
    if (pts.length < 3) return pts;
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        ]);
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }

  // ── 一时的光（只关乎画面，不入状态）────────────────────────────
  const FXL = [];
  function fxAdd(e) { if (!W.replaying) FXL.push(Object.assign({ t: 0 }, e)); }
  // 落下的福气（金色的微光）
  function blessFall(b) {
    if (b.instant) return;
    const n = phone() ? 46 : 90;
    for (let i = 0; i < n; i++) {
      const x = W.w * (0.02 + 0.96 * Math.random()), tx = x + (Math.random() - 0.5) * 40;
      const ty = W.h * (0.62 + 0.3 * Math.random());
      fxAdd({ k: 'fall', x, y: -20 - Math.random() * W.h * 0.25, tx, ty, dur: 4.5 + Math.random() * 3, delay: Math.random() * 2.5, s: 0.6 + Math.random() * 0.8 });
    }
  }
  function motes(b, x, y, n, rgb, spread, up) {
    if (b && b.instant) return;
    for (let i = 0; i < n; i++) fxAdd({ k: 'mote', x: x + (Math.random() - 0.5) * spread, y: y + (Math.random() - 0.5) * spread * 0.4, vx: (Math.random() - 0.5) * 18, vy: -(up || 22) * (0.5 + Math.random()), dur: 1.6 + Math.random() * 1.6, c: rgb || GOLD, s: 0.7 + Math.random() * 0.8 });
  }
  // 风（自右向左，与云同向）：t0..t1 秒之间放出 n 道风痕；yr = [y0, y1]（画面高的比例）；skip(x, y) 为真处不放
  function gusts(b, t0, t1, n, yr, skip) {
    if (b.instant) return;
    const u = SU();
    for (let i = 0, tries = 0; i < n && tries < n * 4; tries++) {
      const x = W.w * (0.25 + 0.95 * Math.random()), y = W.h * lerp(yr[0], yr[1], Math.random());
      if (skip && skip(x, y)) continue;
      i++;
      fxAdd({ k: 'gust', x, y, vx: -W.w * (0.32 + 0.3 * Math.random()), len: (50 + 90 * Math.random()) * u, bend: 3 + 6 * Math.random(),
        ph: Math.random() * 6, a: 0.32 + 0.26 * Math.random(), dur: 1.1 + Math.random() * 0.9, delay: t0 + Math.random() * (t1 - t0) });
    }
  }
  const LEAF = [[96, 128, 64], [140, 120, 70], [176, 150, 96], [120, 142, 80], [200, 186, 150]];
  function leaves(b, t0, t1, n) {
    if (b.instant) return;
    for (let i = 0; i < n; i++) {
      const xf = 0.45 + 0.6 * Math.random();
      const y = fieldY(Math.min(0.99, xf), Math.random() * 0.8) - PH(2) * (0.05 + 1.1 * Math.random());
      fxAdd({ k: 'leaf', x: xf * W.w, y, vx: -W.w * (0.16 + 0.2 * Math.random()), vy: -6 - 14 * Math.random(), ph: Math.random() * 6,
        spin: (Math.random() < 0.5 ? -1 : 1) * (4 + 6 * Math.random()), s: 0.8 + 0.7 * Math.random(), c: LEAF[(Math.random() * LEAF.length) | 0],
        dur: 2 + Math.random() * 1.2, delay: t0 + Math.random() * (t1 - t0) });
    }
  }
  function drawFXL(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const t = e.t - (e.delay || 0);
      if (t < 0) continue;
      const k = t / e.dur;
      if (k >= 1) continue;
      if (e.k === 'fall') {
        const q = ease(Math.min(1, k * 1.15));
        const x = lerp(e.x, e.tx, q) + Math.sin(t * 1.3 + e.tx) * 8 * u, y = lerp(e.y, e.ty, q);
        const a = Math.min(1, k * 4) * (1 - Math.pow(Math.max(0, k - 0.8) / 0.2, 2));
        glowSp(ctx, SP.gold, x, y, 5.5 * u * e.s, a * 0.75);
      } else if (e.k === 'mote') {
        const x = e.x + e.vx * t, y = e.y + e.vy * t;
        glowSp(ctx, SP.gold, x, y, 4 * u * e.s, (1 - k) * 0.8);
        if (e.c && e.c !== GOLD) glowSp(ctx, SP.soft, x, y, 2.4 * u * e.s, (1 - k) * 0.6);
      } else if (e.k === 'beam') {
        const a = Math.sin(Math.PI * k) * (e.a || 0.8);
        beam(ctx, e.x, e.y0, e.y1, e.w, a);
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.k === 'note') {
        const x = e.x + Math.sin(t * 2 + e.x) * 10 * u, y = e.y - t * 26 * u;
        glowSp(ctx, SP.soft, x, y, 3.6 * u, Math.sin(Math.PI * k) * 0.8);
      } else if (e.k === 'leap') {   // 海里跃起的鱼：一道小小的光弧
        const x = e.x + (k - 0.5) * 30 * u, y = e.y - Math.sin(Math.PI * k) * 18 * u;
        glowSp(ctx, SP.pale, x, y, 3 * u, Math.sin(Math.PI * k) * 0.7);
      } else if (e.k === 'gust') {   // 风：一道细细的白痕掠过（腓 4 的风，光穹一罩就止了）
        const x = e.x + e.vx * t, y = e.y + Math.sin(t * 2.6 + e.ph) * 5 * u;
        const a = Math.sin(Math.PI * k) * e.a;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = U.rgba(255, 255, 255, a);
        ctx.lineWidth = Math.max(0.7, 1.2 * u);
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + e.len * 0.5, y - e.bend * u, x + e.len, y + e.bend * 0.4 * u); ctx.stroke();
        ctx.lineCap = 'butt';
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.k === 'leaf') {   // 被风吹起的叶子与尘
        const x = e.x + e.vx * t, y = e.y + e.vy * t + Math.sin(t * 3.2 + e.ph) * 7 * u;
        const a = Math.min(1, k * 6) * (1 - c01((k - 0.75) / 0.25));
        ctx.globalCompositeOperation = 'source-over';
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * e.spin + e.ph);
        ctx.fillStyle = U.rgba(e.c[0], e.c[1], e.c[2], a * 0.92);
        ctx.beginPath(); ctx.ellipse(0, 0, 3.4 * u * e.s, 1.5 * u * e.s, 0, 0, TAU); ctx.fill();
        ctx.restore();
        ctx.globalCompositeOperation = 'lighter';
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  房子（罗马：保罗所租的屋子；歌罗西：腓利门的家）
  // ════════════════════════════════════════════════════════════
  function houseGeo() {
    const ph = PH(2), cx = px('house') * W.w, hw = 2.1 * ph;
    let gmax = -1e9;
    for (let i = 0; i <= 6; i++) { const x = cx - hw + (2 * hw * i) / 6; gmax = Math.max(gmax, gY(2, x / W.w)); }
    const base = gmax + 0.06 * ph;
    const ow = 1.62 * ph;
    return {
      ph, cx, hw, base, x0: cx - hw, x1: cx + hw,
      ox0: cx - ow, ox1: cx + ow, otop: base - 1.78 * ph,
      top1: base - 2.15 * ph,             // 底层的顶（楼板）
      top: base - (rome() ? 3.35 : 2.2) * ph,   // 墙顶
      roofH: 0.5 * ph,
    };
  }
  // 屋里的灯：桌上的陶灯
  function lampPt(H) {
    H = H || houseGeo();
    const tx = px('table') * W.w;
    return [tx - 0.16 * H.ph, H.base - 0.5 * H.ph];
  }
  const lampK = () => 0.35 + 0.65 * nightK();

  function drawRomeHouse(ctx) {
    const H = houseGeo(), ph = H.ph, nk = nightK(), ml = nk * 0.2;
    SP || sprites();
    // 屋里的后墙（灯照着的灰泥）
    ctx.fillStyle = css(PLASTER, 2, 1, 0.05 + 0.25 * lampK() * nk);
    ctx.fillRect(H.ox0, H.otop, H.ox1 - H.ox0, H.base - H.otop);
    // 墙上的红底与一道暗线
    ctx.fillStyle = css(DADO, 2, 0.55, 0.05);
    ctx.fillRect(H.ox0, H.base - 0.55 * ph, H.ox1 - H.ox0, 0.55 * ph);
    ctx.fillStyle = css([90, 70, 52], 2, 0.5);
    ctx.fillRect(H.ox0, H.base - 0.57 * ph, H.ox1 - H.ox0, Math.max(1, 0.03 * ph));
    // 灯照在后墙上
    const L = lampPt(H);
    ctx.save();
    ctx.beginPath(); ctx.rect(H.ox0, H.otop, H.ox1 - H.ox0, H.base - H.otop); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, L[0], L[1] - 0.3 * ph, 2.4 * ph, 0.1 + 0.35 * nk);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    // 墙龛与架上封好的书信
    drawShelf(ctx, H);
    // 立面（中间是临街敞开的门面）
    ctx.fillStyle = css(STUCCO, 2, 1, ml);
    ctx.beginPath();
    ctx.rect(H.x0, H.top, H.x1 - H.x0, H.base - H.top);
    ctx.rect(H.ox1, H.otop, H.ox0 - H.ox1, H.base - H.otop);   // 反向：挖空门面
    ctx.fill('evenodd');
    // 两边墙墩的红色墙裙
    ctx.fillStyle = css(DADO, 2, 0.95, ml * 0.5);
    ctx.fillRect(H.x0, H.base - 0.62 * ph, H.ox0 - H.x0, 0.62 * ph);
    ctx.fillRect(H.ox1, H.base - 0.62 * ph, H.x1 - H.ox1, 0.62 * ph);
    // 背光的一面
    const lr = litX() > H.cx;
    ctx.fillStyle = css(STUCCO_S, 2, 0.55, ml * 0.5);
    if (lr) ctx.fillRect(H.x0, H.top, 0.14 * ph, H.base - H.top); else ctx.fillRect(H.x1 - 0.14 * ph, H.top, 0.14 * ph, H.base - H.top);
    // 门楣（木梁）与楼层的线脚
    ctx.fillStyle = css(WOOD, 2, 1, ml);
    ctx.fillRect(H.ox0 - 0.08 * ph, H.otop - 0.12 * ph, H.ox1 - H.ox0 + 0.16 * ph, 0.14 * ph);
    ctx.fillStyle = css([236, 222, 194], 2, 0.9, ml);
    ctx.fillRect(H.x0 - 0.06 * ph, H.top1 - 0.05 * ph, H.x1 - H.x0 + 0.12 * ph, 0.08 * ph);
    // 楼上的两扇小窗（夜里亮灯）
    const wy = H.top + 0.36 * ph, ww = 0.36 * ph, wh = 0.5 * ph;
    for (const k of [-0.9, 0.9]) {
      const wx = H.cx + k * ph - ww / 2;
      ctx.fillStyle = css([60, 46, 38], 2, 1);
      ctx.fillRect(wx, wy, ww, wh);
      const lit = c01((W.lv.prCity - 0.05) * 6) * nk;
      if (lit > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(255, 186, 108, 0.85 * lit);
        ctx.fillRect(wx + 1, wy + 1, ww - 2, wh - 2);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.fillStyle = css(WOOD, 2, 0.9, ml);
      ctx.fillRect(wx - 0.12 * ph, wy, 0.1 * ph, wh);
      ctx.fillRect(wx + ww + 0.02 * ph, wy, 0.1 * ph, wh);
    }
    // 屋顶（陶瓦，四坡顶的正面）
    const ex = 0.3 * ph, rt0 = H.top, rt1 = H.top - H.roofH;
    ctx.fillStyle = css(ROOF, 2, 1, ml);
    ctx.beginPath();
    ctx.moveTo(H.x0 - ex, rt0); ctx.lineTo(H.x1 + ex, rt0); ctx.lineTo(H.x1 - 0.7 * ph, rt1); ctx.lineTo(H.x0 + 0.7 * ph, rt1); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([120, 58, 40], 2, 0.55);
    ctx.lineWidth = Math.max(0.6, 0.035 * ph);
    ctx.beginPath();
    const n = 14;
    for (let i = 1; i < n; i++) {
      const t = i / n;
      ctx.moveTo(lerp(H.x0 - ex, H.x1 + ex, t), rt0);
      ctx.lineTo(lerp(H.x0 + 0.7 * ph, H.x1 - 0.7 * ph, t), rt1);
    }
    ctx.stroke();
    // 檐口的瓦当
    ctx.fillStyle = css([150, 76, 52], 2, 1, ml);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(H.x0 - ex, H.x1 + ex, i / n); ctx.moveTo(x + 0.07 * ph, rt0); ctx.arc(x, rt0, 0.07 * ph, 0, Math.PI); }
    ctx.fill();
    // 迎光的边
    ctx.strokeStyle = css([255, 238, 206], 2, 0.4 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.6, 0.04 * ph);
    ctx.beginPath(); ctx.moveTo(H.x0 + 0.7 * ph, rt1); ctx.lineTo(H.x1 - 0.7 * ph, rt1); ctx.stroke();
    // 门槛
    ctx.fillStyle = css([200, 186, 160], 2, 1, ml);
    ctx.fillRect(H.ox0 - 0.1 * ph, H.base - 0.02 * ph, H.ox1 - H.ox0 + 0.2 * ph, 0.08 * ph);
    // 门外的石凳
    ctx.fillStyle = css([196, 182, 156], 2, 1, ml);
    ctx.fillRect(H.x0 - 0.95 * ph, H.base - 0.3 * ph, 0.7 * ph, 0.12 * ph);
    ctx.fillRect(H.x0 - 0.88 * ph, H.base - 0.2 * ph, 0.1 * ph, 0.2 * ph);
    ctx.fillRect(H.x0 - 0.42 * ph, H.base - 0.2 * ph, 0.1 * ph, 0.2 * ph);
    // 夜里门口洒出的灯光
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.save();
      ctx.translate(H.cx, H.base + 0.15 * ph); ctx.scale(1, 0.28);
      glowSp(ctx, SP.warm, 0, 0, 2.6 * ph, 0.22 * nk * lampK());
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }
    drawFurniture(ctx, H);
  }
  // 屋里：小桌、两只凳子、陶灯、桌上的书信
  function drawFurniture(ctx, H) {
    const ph = H.ph, nk = nightK(), ex = 0.08 + 0.4 * nk;
    const tx = px('table') * W.w, tw = 0.62 * ph, th = 0.42 * ph, ty = H.base - th;
    ctx.fillStyle = css(WOOD, 2, 1, ex);
    ctx.fillRect(tx - tw / 2, ty, tw, 0.06 * ph);
    ctx.fillRect(tx - tw / 2 + 0.05 * ph, ty, 0.05 * ph, th);
    ctx.fillRect(tx + tw / 2 - 0.1 * ph, ty, 0.05 * ph, th);
    // 凳子（保罗与提摩太坐的）
    for (const id of ['paul', 'timothy']) {
      const f = fig(id);
      if (!f || f.pose !== 'seat' || f.dying) continue;
      const sx = f.nx * W.w, sw = 0.34 * ph, sh = 0.25 * ph;
      const fy = figPt(id, 0)[1];
      ctx.fillStyle = css([92, 68, 50], 2, 1, ex);
      ctx.fillRect(sx - sw / 2, fy - sh, sw, 0.05 * ph);
      ctx.fillRect(sx - sw / 2 + 0.03 * ph, fy - sh, 0.04 * ph, sh);
      ctx.fillRect(sx + sw / 2 - 0.07 * ph, fy - sh, 0.04 * ph, sh);
    }
    // 陶灯
    const L = lampPt(H);
    ctx.fillStyle = css([176, 118, 76], 2, 1, ex);
    ctx.beginPath(); ctx.ellipse(L[0], ty - 0.03 * ph, 0.1 * ph, 0.04 * ph, 0, 0, TAU); ctx.fill();
    // 桌上的书信：写了多少，就有几行字
    const sw2 = 0.34 * ph, sx0 = tx - 0.02 * ph, sy = ty - 0.012 * ph;
    ctx.fillStyle = css(PARCH, 2, 1, ex + 0.1);
    ctx.fillRect(sx0 - sw2 * 0.1, sy - 0.035 * ph, sw2, 0.035 * ph);
    ctx.fillStyle = css([200, 184, 150], 2, 1, ex);
    ctx.beginPath(); ctx.arc(sx0 - sw2 * 0.1, sy - 0.02 * ph, 0.03 * ph, 0, TAU); ctx.arc(sx0 + sw2 * 0.9, sy - 0.02 * ph, 0.03 * ph, 0, TAU); ctx.fill();
    // 以巴弗提带来的馈送（腓 4:18）
    if (S.gift && rome()) {
      const gx = px('gift') * W.w, gb = H.base + 0.02 * ph;
      ctx.fillStyle = css([150, 110, 80], 2, 1, ex);
      ctx.beginPath(); ctx.ellipse(gx, gb - 0.13 * ph, 0.16 * ph, 0.13 * ph, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([196, 150, 96], 2, 1, ex);
      ctx.beginPath(); ctx.moveTo(gx + 0.2 * ph, gb); ctx.quadraticCurveTo(gx + 0.13 * ph, gb - 0.3 * ph, gx + 0.26 * ph, gb - 0.34 * ph); ctx.lineTo(gx + 0.32 * ph, gb - 0.34 * ph);
      ctx.quadraticCurveTo(gx + 0.44 * ph, gb - 0.3 * ph, gx + 0.38 * ph, gb); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([230, 214, 180], 2, 0.9, ex);
      ctx.fillRect(gx - 0.16 * ph, gb - 0.16 * ph, 0.32 * ph, 0.04 * ph);
    }
  }
  // 桌上书信的字（在人之上画，好让坐着的人不挡住）
  function drawScrollText(ctx) {
    if (!rome()) return;
    const H = houseGeo(), ph = H.ph;
    const tx = px('table') * W.w, ty = H.base - 0.42 * ph;
    const sw2 = 0.34 * ph, sx0 = tx - 0.02 * ph, sy = ty - 0.012 * ph;
    const n = Math.floor(c01(W.lv.prScroll) * 7 + 0.001);
    if (n > 0) {
      ctx.fillStyle = css(INK, 2, 0.75);
      for (let i = 0; i < n; i++) ctx.fillRect(sx0 + i * sw2 * 0.12, sy - 0.03 * ph, sw2 * 0.07, Math.max(0.6, 0.02 * ph));
    }
    const w = W.lv.prWrite;
    if (w > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, sx0 + n * sw2 * 0.12, sy - 0.03 * ph, 0.28 * ph, w * 0.7);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawShelf(ctx, H) {
    const ph = H.ph, sx = H.ox1 - 0.85 * ph, sy = H.base - 1.25 * ph, sw = 0.62 * ph;
    ctx.fillStyle = css([120, 96, 72], 2, 0.9, 0.05);
    ctx.fillRect(sx - 0.04 * ph, sy - 0.32 * ph, sw + 0.08 * ph, 0.36 * ph);
    ctx.fillStyle = css(WOOD, 2, 1, 0.05);
    ctx.fillRect(sx - 0.06 * ph, sy, sw + 0.12 * ph, 0.05 * ph);
    const k = rome() ? S.sealed + (W.lv.prScroll > 0.02 ? 0 : 0) : 0;
    for (let i = 0; i < 3; i++) {
      const on = i < k;
      ctx.fillStyle = css(on ? PARCH : [150, 130, 104], 2, on ? 1 : 0.5, 0.1);
      ctx.beginPath(); ctx.ellipse(sx + 0.12 * ph + i * 0.19 * ph, sy - 0.07 * ph, 0.07 * ph, 0.07 * ph, 0, 0, TAU); ctx.fill();
      if (on) { ctx.fillStyle = css([170, 40, 40], 2, 1, 0.1); ctx.fillRect(sx + 0.1 * ph + i * 0.19 * ph, sy - 0.1 * ph, 0.04 * ph, 0.06 * ph); }
    }
  }
  // 屋右边的两座楼（桌面才有）
  function drawNeighbors(ctx) {
    if (phone()) return;
    const H = houseGeo(), ph = H.ph, nk = nightK();
    const blocks = [[H.x1 + 0.4 * ph, 2.4 * ph, 2.35 * ph, 0], [H.x1 + 3.0 * ph, 2.8 * ph, 1.95 * ph, 1], [H.x1 + 6.0 * ph, 2.6 * ph, 2.5 * ph, 2]];
    for (const b of blocks) {
      const x = b[0], w = b[1], g = gY(2, Math.min(1, (x + w / 2) / W.w)) + 0.08 * ph, h = b[2];
      if (x > W.w + 10) continue;
      ctx.fillStyle = css(b[3] === 1 ? [212, 186, 150] : [222, 200, 166], 2, 1, nk * 0.15);
      ctx.fillRect(x, g - h, w, h);
      ctx.fillStyle = css(ROOF, 2, 1);
      ctx.fillRect(x - 0.12 * ph, g - h - 0.18 * ph, w + 0.24 * ph, 0.2 * ph);
      ctx.fillStyle = css(STUCCO_S, 2, 0.5);
      ctx.fillRect(x, g - h, 0.14 * ph, h);
      // 窗
      const rows = Math.floor(h / (0.95 * ph)), cols = 3;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const wx = x + (c + 0.5) * (w / cols) - 0.12 * ph, wy = g - h + 0.3 * ph + r * 0.95 * ph;
        ctx.fillStyle = css([64, 50, 40], 2, 1);
        ctx.fillRect(wx, wy, 0.24 * ph, 0.36 * ph);
        const th = rt(b[3] * 17 + r * 5 + c) * 0.7 + 0.15;
        const lit = c01((W.lv.prCity - th) * 5) * nk;
        if (lit > 0.02) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = U.rgba(255, 186, 108, 0.85 * lit);
          ctx.fillRect(wx + 1, wy + 1, 0.24 * ph - 2, 0.36 * ph - 2);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.fillStyle = css([90, 60, 44], 2, 1);
      ctx.fillRect(x + w * 0.4, g - 0.9 * ph, 0.4 * ph, 0.9 * ph);
    }
  }

  // ── 歌罗西：腓利门的家（白墙、平顶、葡萄架）───────────────────
  function drawColHouse(ctx) {
    const H = houseGeo(), ph = H.ph, nk = nightK(), ml = nk * 0.2;
    SP || sprites();
    const lampOn = W.lv.prLamps;
    ctx.fillStyle = css([196, 170, 128], 2, 1, 0.08 + 0.35 * nk * (0.4 + lampOn));
    ctx.fillRect(H.ox0, H.otop, H.ox1 - H.ox0, H.base - H.otop);
    ctx.save();
    ctx.beginPath(); ctx.rect(H.ox0, H.otop, H.ox1 - H.ox0, H.base - H.otop); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, H.cx, H.base - 0.8 * ph, 2.6 * ph, (0.1 + 0.4 * nk) * (0.4 + 0.6 * lampOn) + 0.2 * W.lv.prGrace);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    // 屋里一张长桌（家中的教会在此聚会）
    ctx.fillStyle = css(WOOD, 2, 1, 0.1 + 0.3 * nk);
    ctx.fillRect(H.cx - 0.9 * ph, H.base - 0.4 * ph, 1.8 * ph, 0.06 * ph);
    ctx.fillRect(H.cx - 0.8 * ph, H.base - 0.4 * ph, 0.05 * ph, 0.4 * ph);
    ctx.fillRect(H.cx + 0.75 * ph, H.base - 0.4 * ph, 0.05 * ph, 0.4 * ph);
    // 白墙
    ctx.fillStyle = css(WHITEW, 2, 1, ml);
    ctx.beginPath();
    ctx.rect(H.x0, H.top, H.x1 - H.x0, H.base - H.top);
    ctx.rect(H.ox1, H.otop, H.ox0 - H.ox1, H.base - H.otop);
    ctx.fill('evenodd');
    const lr = litX() > H.cx;
    ctx.fillStyle = css([196, 186, 166], 2, 0.6, ml * 0.5);
    if (lr) ctx.fillRect(H.x0, H.top, 0.14 * ph, H.base - H.top); else ctx.fillRect(H.x1 - 0.14 * ph, H.top, 0.14 * ph, H.base - H.top);
    ctx.fillStyle = css([140, 110, 80], 2, 0.9, ml);
    ctx.fillRect(H.x0, H.base - 0.3 * ph, H.x1 - H.x0, 0.3 * ph);
    // 门楣
    ctx.fillStyle = css(WOOD, 2, 1, ml);
    ctx.fillRect(H.ox0 - 0.08 * ph, H.otop - 0.12 * ph, H.ox1 - H.ox0 + 0.16 * ph, 0.14 * ph);
    // 平顶的边
    ctx.fillStyle = css([214, 204, 184], 2, 1, ml);
    ctx.fillRect(H.x0 - 0.1 * ph, H.top - 0.1 * ph, H.x1 - H.x0 + 0.2 * ph, 0.12 * ph);
    // 门前的葡萄架：几根柱、横梁、满架的叶与几串葡萄
    const px0 = H.x0 - 1.55 * ph, px1 = H.x0 + 0.25 * ph, py = H.top + 0.05 * ph;
    ctx.fillStyle = css([112, 84, 60], 2, 1, ml);
    for (let i = 0; i < 3; i++) { const x = lerp(px0 + 0.05 * ph, px1 - 0.12 * ph, i / 2); ctx.fillRect(x, py, 0.09 * ph, H.base - py); }
    ctx.fillRect(px0 - 0.1 * ph, py - 0.02 * ph, px1 - px0 + 0.2 * ph, 0.08 * ph);
    for (let i = 0; i < 6; i++) { const x = lerp(px0, px1, i / 5); ctx.fillRect(x - 0.03 * ph, py - 0.1 * ph, 0.06 * ph, 0.14 * ph); }
    ctx.fillStyle = css(VINE, 2, 1, ml);
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const x = lerp(px0 - 0.15 * ph, px1 + 0.15 * ph, rt(i + 300)), y = py - 0.12 * ph + rt(i + 320) * 0.32 * ph, r = (0.1 + 0.09 * rt(i + 340)) * ph;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.72, 0, 0, TAU);
    }
    // 垂下的藤
    for (let i = 0; i < 3; i++) {
      const x = lerp(px0 + 0.1 * ph, px1 - 0.08 * ph, i / 2);
      for (let k = 0; k < 4; k++) { const y = py + 0.3 * ph + k * 0.28 * ph, r = 0.08 * ph; ctx.moveTo(x + r + (k % 2 ? 0.06 * ph : 0), y); ctx.ellipse(x + (k % 2 ? 0.06 * ph : 0), y, r, r * 0.8, 0, 0, TAU); }
    }
    ctx.fill();
    ctx.fillStyle = css([118, 62, 116], 2, 0.95, ml);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const x = lerp(px0 + 0.25 * ph, px1 - 0.2 * ph, i / 4), y = py + 0.2 * ph + rt(i + 360) * 0.08 * ph;
      for (let k = 0; k < 4; k++) { const gx = x + (k % 2 - 0.5) * 0.06 * ph, gy = y + k * 0.045 * ph, r = 0.035 * ph; ctx.moveTo(gx + r, gy); ctx.arc(gx, gy, r, 0, TAU); }
    }
    ctx.fill();
    // 门口的两盏灯
    for (const s of [-1, 1]) {
      const lx = (s < 0 ? H.ox0 - 0.2 * ph : H.ox1 + 0.2 * ph), ly = H.otop + 0.2 * ph;
      ctx.fillStyle = css([150, 100, 70], 2, 1, ml);
      ctx.fillRect(lx - 0.05 * ph, ly, 0.1 * ph, 0.08 * ph);
    }
  }
  function drawColLamps(ctx) {
    const k = W.lv.prLamps;
    if (k < 0.01 || rome()) return;
    const H = houseGeo(), ph = H.ph;
    for (const s of [-1, 1]) {
      const lx = (s < 0 ? H.ox0 - 0.2 * ph : H.ox1 + 0.2 * ph), ly = H.otop + 0.2 * ph;
      flame(ctx, lx, ly, 0.2 * ph, k, s * 3);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  中丘：罗马城 / 歌罗西的小城；远山
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function buildCity() {
    const r = U.mulberry32(88);
    const rome = [], col = [];
    let u = 0.0;
    while (u < 1) {
      const k = r();
      let item;
      if (u > 0.36 && u < 0.42 && !rome.some(q => q.kind === 'temple')) item = { kind: 'temple', w: 2.6, h: 1.8 };
      else if (u > 0.62 && u < 0.7 && !rome.some(q => q.kind === 'temple2')) item = { kind: 'temple2', w: 2.0, h: 1.45 };
      else if (k < 0.2) item = { kind: 'cypress', w: 0.22, h: 1.3 + r() * 0.8 };
      else if (k < 0.3) item = { kind: 'pine', w: 1.2, h: 1.4 + r() * 0.4 };
      else item = { kind: 'block', w: 0.8 + r() * 1.0, h: 0.8 + r() * 1.2, tone: (r() * 4) | 0 };
      item.u = u; item.th = r();
      rome.push(item);
      u += (item.w * 0.5 + 0.35) * 0.028;
    }
    u = 0.05;
    while (u < 1) {
      const k = r();
      const item = k < 0.28 ? { kind: 'poplar', w: 0.25, h: 1.4 + r() * 0.8 } : k < 0.4 ? { kind: 'olive', w: 0.9, h: 0.8 } : { kind: 'cube', w: 0.7 + r() * 0.7, h: 0.6 + r() * 0.5 };
      item.u = u; item.th = r();
      col.push(item);
      u += (item.w * 0.5 + 0.45) * 0.03;
    }
    CITY = { rome, col };
  }
  const cityX = u => lerp(phone() ? 0.52 : 0.515, 0.995, u);
  // 罗马城中的一座小山（神殿在山顶）
  const hillC = () => (phone() ? [0.72, 0.12, 2.5] : [0.705, 0.1, 2.3]);
  function hillH(xf) {
    if (!rome()) return 0;
    const h = hillC(), u = Math.abs((xf - h[0]) / h[1]);
    if (u >= 1) return 0;
    return h[2] * PH(1) * (1 - U.smoothstep(0.3, 1, u));
  }
  function drawCityHill(ctx) {
    if (!rome()) return;
    const h = hillC(), n = 28, pts = [];
    for (let i = 0; i <= n; i++) { const xf = h[0] - h[1] + (2 * h[1] * i) / n; pts.push([xf * W.w, gY(1, xf) + 2 - hillH(xf)]); }
    ctx.fillStyle = css([128, 138, 100], 1, 1);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const q of pts) ctx.lineTo(q[0], q[1]);
    for (let i = n; i >= 0; i--) { const xf = h[0] - h[1] + (2 * h[1] * i) / n; ctx.lineTo(xf * W.w, gY(1, xf) + 3); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([178, 160, 128], 1, 0.55);
    ctx.beginPath();
    for (let k = 0; k < 5; k++) { const xf = h[0] + (rt(k + 400) - 0.5) * h[1] * 1.3, y = gY(1, xf) - hillH(xf) * (0.3 + 0.4 * rt(k + 410)); const r = PH(1) * (0.18 + 0.12 * rt(k + 420)); ctx.moveTo(xf * W.w + r, y); ctx.ellipse(xf * W.w, y, r, r * 0.5, 0, 0, TAU); }
    ctx.fill();
    ctx.strokeStyle = css([255, 240, 210], 1, 0.3 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.04 * PH(1));
    ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
  }
  function drawMidCity(ctx) {
    CITY || buildCity();
    const m = PH(1), nk = nightK();
    const list = rome() ? CITY.rome : CITY.col;
    drawCityHill(ctx);
    // 罗马的水道：一排拱
    if (rome()) {
      const a0 = cityX(0.0) * W.w, a1 = cityX(0.22) * W.w, hA = 1.05 * m;
      ctx.fillStyle = css([204, 184, 150], 1, 1);
      ctx.beginPath();
      const g0 = gY(1, a0 / W.w), g1 = gY(1, a1 / W.w), yTop = Math.min(g0, g1) - hA;
      ctx.rect(a0, yTop, a1 - a0, 0.2 * m);
      const nA = Math.max(4, Math.round((a1 - a0) / (0.55 * m)));
      for (let i = 0; i <= nA; i++) { const x = lerp(a0, a1, i / nA); ctx.rect(x - 0.08 * m, yTop, 0.16 * m, gY(1, x / W.w) - yTop + 2); }
      ctx.fill();
    }
    for (const q of list) {
      const xf = cityX(q.u), x = xf * W.w, g = gY(1, xf) + 2 - hillH(xf);
      if (!isFinite(g) || g > W.waterlineY(1)) continue;
      const w = q.w * m, h = q.h * m;
      if (q.kind === 'block' || q.kind === 'cube') {
        const tone = q.kind === 'cube' ? [236, 230, 214] : [[214, 190, 150], [200, 170, 132], [222, 204, 170], [190, 160, 126]][q.tone];
        ctx.fillStyle = css(tone, 1, 1);
        ctx.fillRect(x - w / 2, g - h, w, h);
        if (q.kind === 'block') { ctx.fillStyle = css(ROOF, 1, 1); ctx.fillRect(x - w / 2 - 0.05 * m, g - h - 0.12 * m, w + 0.1 * m, 0.13 * m); }
        ctx.fillStyle = css([150, 130, 104], 1, 0.6);
        if (litX() > x) ctx.fillRect(x - w / 2, g - h, w * 0.22, h); else ctx.fillRect(x + w * 0.28, g - h, w * 0.22, h);
        // 窗灯
        const lit = c01((W.lv.prCity - q.th * 0.85 - 0.08) * 5) * nk + (!rome() ? W.lv.prLamps * nk * 0.8 : 0);
        if (lit > 0.03) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = U.rgba(255, 190, 110, Math.min(1, 0.9 * lit));
          const ws = Math.max(1, 0.1 * m);
          ctx.fillRect(x - ws * 1.2, g - h * 0.62, ws, ws * 1.3);
          if (w > 1.1 * m) ctx.fillRect(x + ws * 0.6, g - h * 0.62, ws, ws * 1.3);
          ctx.globalCompositeOperation = 'source-over';
        }
      } else if (q.kind === 'temple' || q.kind === 'temple2') {
        const pod = 0.25 * m, ch = h - pod - 0.35 * m;
        ctx.fillStyle = css([226, 214, 190], 1, 1);
        ctx.fillRect(x - w / 2, g - pod, w, pod);
        ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.05 * m, g - pod - ch); ctx.lineTo(x, g - h); ctx.lineTo(x + w / 2 + 0.05 * m, g - pod - ch); ctx.closePath(); ctx.fill();
        ctx.fillRect(x - w / 2, g - pod - ch - 0.06 * m, w, 0.08 * m);
        const nc = q.kind === 'temple' ? 6 : 4;
        for (let i = 0; i < nc; i++) { const cx0 = lerp(x - w / 2 + 0.12 * m, x + w / 2 - 0.12 * m, i / (nc - 1)); ctx.fillRect(cx0 - 0.06 * m, g - pod - ch, 0.12 * m, ch); }
        ctx.fillStyle = css([120, 104, 86], 1, 0.7);
        ctx.fillRect(x - w / 2 + 0.2 * m, g - pod - ch, w - 0.4 * m, ch * 0.98);
        ctx.fillStyle = css([226, 214, 190], 1, 1);
        for (let i = 0; i < nc; i++) { const cx0 = lerp(x - w / 2 + 0.12 * m, x + w / 2 - 0.12 * m, i / (nc - 1)); ctx.fillRect(cx0 - 0.06 * m, g - pod - ch, 0.12 * m, ch); }
        ctx.strokeStyle = css([255, 240, 210], 1, 0.4 * dayA(), 0.2);
        ctx.lineWidth = Math.max(0.5, 0.04 * m);
        ctx.beginPath(); ctx.moveTo(x - w / 2 - 0.05 * m, g - pod - ch); ctx.lineTo(x, g - h); ctx.lineTo(x + w / 2 + 0.05 * m, g - pod - ch); ctx.stroke();
      } else if (q.kind === 'cypress' || q.kind === 'poplar') {
        ctx.fillStyle = css(q.kind === 'cypress' ? CYP : [84, 116, 70], 1, 1);
        ctx.beginPath(); ctx.ellipse(x, g - h * 0.5, w * 0.5 * m / m, h * 0.52, 0, 0, TAU); ctx.fill();
      } else if (q.kind === 'pine') {
        ctx.fillStyle = css([88, 70, 56], 1, 1);
        ctx.fillRect(x - 0.04 * m, g - h * 0.8, 0.08 * m, h * 0.8);
        ctx.fillStyle = css(PINE, 1, 1);
        ctx.beginPath(); ctx.ellipse(x, g - h * 0.82, w * 0.5, h * 0.18, 0, 0, TAU); ctx.fill();
      } else if (q.kind === 'olive') {
        ctx.fillStyle = css([96, 124, 86], 1, 1);
        ctx.beginPath(); ctx.ellipse(x, g - h * 0.6, w * 0.5, h * 0.4, 0, 0, TAU); ctx.fill();
      }
    }
  }
  // 歌罗西远处的高山（积雪）
  function drawFarMount(ctx) {
    if (rome()) return;
    const x0 = W.w * (phone() ? 0.55 : 0.66), x1 = W.w * 1.02, pk = W.w * (phone() ? 0.82 : 0.86);
    const g0 = gY(0, x0 / W.w), g1 = gY(0, Math.min(1, x1 / W.w));
    const top = Math.min(g0, g1) - PH(0) * 5.2;
    ctx.fillStyle = css([150, 160, 184], 0, 1);
    ctx.beginPath(); ctx.moveTo(x0, g0 + 2); ctx.lineTo(pk - (pk - x0) * 0.2, top + (g0 - top) * 0.25); ctx.lineTo(pk, top); ctx.lineTo(pk + (x1 - pk) * 0.3, top + (g1 - top) * 0.3); ctx.lineTo(x1, g1 + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([246, 248, 255], 0, 0.9, 0.2);
    ctx.beginPath(); ctx.moveTo(pk - (pk - x0) * 0.14, top + (g0 - top) * 0.2); ctx.lineTo(pk, top); ctx.lineTo(pk + (x1 - pk) * 0.2, top + (g1 - top) * 0.22);
    ctx.lineTo(pk + (x1 - pk) * 0.08, top + (g1 - top) * 0.14); ctx.lineTo(pk, top + (g0 - top) * 0.16); ctx.lineTo(pk - (pk - x0) * 0.07, top + (g0 - top) * 0.2); ctx.closePath(); ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  院子里：中间隔断的墙、房角石、光的殿
  // ════════════════════════════════════════════════════════════
  const WALL_N = 9;
  function wallSeg(i) {       // 第 i 个端点（0 = 远，靠近地的轮廓线；WALL_N = 近）
    const t = i / WALL_N, v = lerp(0.03, 0.74, t);
    const xf = px('wall') + lerp(0.014, -0.016, t);
    const y = fieldY(xf, v), h = 0.5 * PH(2) * vK(v);
    return { x: xf * W.w, y, h, v, w: 0.2 * PH(2) * vK(v) };
  }
  const wallOrd = i => c01(Math.abs(i + 0.5 - WALL_N / 2) / (WALL_N / 2) * 0.9 + 0.02);   // 中间的先塌
  let wallPrev = 1;
  // 一道矮墙，自远而近地横在院子当中（侧面朝着人）：拆毁时从中间一段一段沉下、化为光
  function drawWall(ctx) {
    const k = W.lv.prWall;
    if (k < 0.002) return;
    const gone = 1 - k, nk = nightK();
    const E = [];
    for (let i = 0; i <= WALL_N; i++) E.push(wallSeg(i));
    for (let i = WALL_N - 1; i >= 0; i--) {
      const a = E[i], b = E[i + 1];
      const q = c01((wallOrd(i) - gone) * 6 + (gone < 0.001 ? 1 : 0));
      if (q < 0.01) continue;
      const ha = a.h * q, hb = b.h * q;
      // 侧面
      ctx.fillStyle = css([170, 154, 128], 2, 1, nk * 0.2);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x, b.y - hb); ctx.lineTo(a.x, a.y - ha); ctx.closePath(); ctx.fill();
      // 墙顶的盖石
      const cap = Math.max(1, 0.1 * b.h);
      ctx.fillStyle = css([214, 202, 176], 2, 1, nk * 0.2);
      ctx.beginPath(); ctx.moveTo(a.x - a.w * 0.3, a.y - ha); ctx.lineTo(b.x - b.w * 0.3, b.y - hb); ctx.lineTo(b.x + b.w * 0.2, b.y - hb - cap); ctx.lineTo(a.x + a.w * 0.2, a.y - ha - cap * 0.8); ctx.closePath(); ctx.fill();
      // 石缝
      ctx.strokeStyle = css([110, 96, 78], 2, 0.55);
      ctx.lineWidth = Math.max(0.5, 0.012 * b.h * 3);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y - ha * 0.5); ctx.lineTo(b.x, b.y - hb * 0.5);
      const mx = (a.x + b.x) / 2 + (i % 2 ? 0.15 : -0.15) * (b.x - a.x), my0 = (a.y + b.y) / 2, mh = (ha + hb) / 2;
      ctx.moveTo(mx, my0 - mh * (i % 2 ? 0.5 : 0)); ctx.lineTo(mx, my0 - mh * (i % 2 ? 1 : 0.5));
      ctx.stroke();
    }
    // 迎光的一道边
    ctx.strokeStyle = css([255, 240, 214], 2, 0.35 * dayA() * k, 0.2);
    ctx.lineWidth = Math.max(0.6, 1 * SU());
    ctx.beginPath();
    let on = false;
    for (let i = 0; i <= WALL_N; i++) {
      const s0 = E[i], q = c01((wallOrd(Math.min(i, WALL_N - 1)) - gone) * 6 + (gone < 0.001 ? 1 : 0));
      if (q < 0.99) { on = false; continue; }
      const y = s0.y - s0.h - Math.max(1, 0.1 * s0.h);
      if (!on) { ctx.moveTo(s0.x, y); on = true; } else ctx.lineTo(s0.x, y);
    }
    ctx.stroke();
  }
  // 房角石：墙脚下的一块方石，微微发金光（弗 2:20）
  function drawCornerstone(ctx) {
    const k = W.lv.prStone;
    if (k < 0.01) return;
    const c0 = templePts()[0], s = { x: c0[0], y: c0[1] }, ph = PH(2) * vK(0.5), z = 0.3 * ph;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, s.x, s.y - 0.5 * z, 2.4 * z, k * (0.28 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    // 正面、顶面、侧面
    ctx.fillStyle = css([206, 190, 158], 2, k, 0.25);
    ctx.fillRect(s.x - z / 2, s.y - z, z, z);
    ctx.fillStyle = css([236, 226, 200], 2, k, 0.35);
    ctx.beginPath(); ctx.moveTo(s.x - z / 2, s.y - z); ctx.lineTo(s.x - z * 0.2, s.y - z * 1.3); ctx.lineTo(s.x + z * 0.8, s.y - z * 1.3); ctx.lineTo(s.x + z / 2, s.y - z); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([160, 144, 116], 2, k, 0.15);
    ctx.beginPath(); ctx.moveTo(s.x + z / 2, s.y - z); ctx.lineTo(s.x + z * 0.8, s.y - z * 1.3); ctx.lineTo(s.x + z * 0.8, s.y - z * 0.3); ctx.lineTo(s.x + z / 2, s.y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = U.rgba(255, 228, 160, 0.7 * k);
    ctx.lineWidth = Math.max(0.6, 0.05 * z);
    ctx.beginPath(); ctx.moveTo(s.x - z / 2, s.y - z); ctx.lineTo(s.x - z * 0.2, s.y - z * 1.3); ctx.lineTo(s.x + z * 0.8, s.y - z * 1.3); ctx.lineTo(s.x + z * 0.8, s.y - z * 0.3); ctx.stroke();
  }
  // 光的殿：一座山墙的轮廓，罩在合而为一的众人之上（弗 2:21–22）
  function templePts() {
    const ph = PH(2);
    let x0 = px('m0') * W.w - 0.4 * ph;
    if (!phone()) x0 = Math.max(x0, 0.49 * W.w);   // 桌面：左柱与房角石不进经文区
    const x1 = px('m1') * W.w + 0.4 * ph, xf0 = x0 / W.w;
    const g0 = fieldY(xf0, 0.5), g1 = fieldY(px('m1'), 0.5), top = Math.min(g0, g1) - 2.3 * ph;
    return [[x0, g0], [x0, top], [(x0 + x1) / 2, top - 0.9 * ph], [x1, top], [x1, g1]];
  }
  function drawTemple(ctx) {
    const a = W.lv.prHouseA, k = W.lv.prHouse;
    if (a < 0.01 || k < 0.01) return;
    const pts = partial(templePts(), k), nk = nightK(), w = Math.max(1.4, 2.3 * SU());
    if (pts.length < 2) return;
    // 白日里先描一道金色的实线（在亮的天与海上也看得见），再加上发光的线
    const day = 1 - nk;
    if (day > 0.02) {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = U.rgba(214, 160, 70, 0.55 * a * day);
      ctx.lineWidth = w * 1.5;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.stroke();
      ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
    }
    glowLine(ctx, pts, w, [255, 232, 176], a * 1.1);   // 亮芯 ≥ 0.8
  }

  // ════════════════════════════════════════════════════════════
  //  天上与地上的光
  // ════════════════════════════════════════════════════════════
  // 福气：落定在地上、屋顶上的微光（确定的位置）
  let BLESS = null;
  function blessPts() {
    if (BLESS && BLESS.w === W.w && BLESS.h === W.h && BLESS.p === S.place) return BLESS.pts;
    const pts = [];
    const n = phone() ? 26 : 44;
    for (let i = 0; i < n; i++) {
      const lay = rt(i * 3 + 900) < 0.62 ? 2 : 1;
      const span = W.landSpan(lay) || [W.w * 0.5, W.w];
      const x = lerp(span[0] + 12, span[1] - 6, rt(i * 3 + 901));
      const g = gY(lay, x / W.w), v = lay === 2 ? rt(i * 3 + 902) * 0.9 : rt(i * 3 + 902) * 0.25;
      const fh = lay === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(1) - g);
      pts.push([x, g + v * fh * 0.85, lay, rt(i + 950)]);
    }
    BLESS = { w: W.w, h: W.h, p: S.place, pts };
    return pts;
  }
  function drawBless(ctx) {
    const k = W.lv.prBless;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU(), nk = nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const p of blessPts()) {
      const tw = 0.6 + 0.4 * Math.sin(W.t * (0.8 + p[3]) + p[3] * 20);
      glowSp(ctx, SP.bless, p[0], p[1], (p[2] === 2 ? 7.5 : 4.5) * u, k * tw * (0.55 + 0.3 * nk));
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 罩着灰暗之人的冷雾（弗 2:1）
  function drawPall(ctx) {
    const k = W.lv.prPall;
    if (k < 0.01) return;
    SP || sprites();
    const ph = PH(2), x0 = px('g0') * W.w, x1 = px('g1') * W.w, y = fieldY((px('g0') + px('g1')) / 2, 0.36) - 0.4 * ph;
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 5; i++) {
      const x = lerp(x0, x1, i / 4) + Math.sin(W.t * 0.4 + i) * 0.2 * ph;
      glowSp(ctx, SP.dark, x, y - Math.cos(W.t * 0.3 + i * 2) * 0.1 * ph, 1.1 * ph, k * 0.28);
    }
  }
  // 手中的光（神所赐的）/ 手中的灯
  function drawHands(ctx) {
    const g = W.lv.prGift, l = W.lv.prHand;
    if (g < 0.01 && l < 0.01) return;
    SP || sprites();
    for (const id of merged().concat(['tychicus'])) {
      const h = handPt(id);
      if (!h) continue;
      if (g > 0.01 && id[0] === 'g') {
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, h[0], h[1] - 0.04 * h[2], 0.32 * h[2], g * h[3] * 0.9);
        glowSp(ctx, SP.white, h[0], h[1] - 0.04 * h[2], 0.1 * h[2], g * h[3]);
        ctx.globalCompositeOperation = 'source-over';
      }
      if (l > 0.01) {
        const f = fig(id);
        if (!f || f.pose === 'lie') continue;
        ctx.fillStyle = css([176, 118, 76], 2, h[3] * l, 0.3);
        ctx.beginPath(); ctx.ellipse(h[0], h[1], 0.07 * h[2], 0.028 * h[2], 0, 0, TAU); ctx.fill();
        flame(ctx, h[0] - 0.04 * h[2], h[1] - 0.02 * h[2], 0.14 * h[2], l * h[3], gIdx(id) + (id[0] === 'j' ? 7 : 0));
      }
    }
  }
  // 长阔高深（弗 3:18）
  function loveGeo() {
    const cx = px('loveC') * W.w, cy = W.h * (phone() ? 0.52 : 0.46);
    return { cx, cy, top: W.h * (phone() ? 0.37 : 0.06), bot: W.h, far: [W.w * (phone() ? 0.1 : 0.2), W.h * (phone() ? 0.58 : 0.565)] };
  }
  function drawLove(ctx) {
    const a = W.lv.prLoveA, k = W.lv.prLove;
    if (a < 0.01 || k < 0.005) return;
    const G = loveGeo(), e = ease(c01(k)), w = Math.max(1, 1.3 * SU());
    SP || sprites();
    const rgb = [255, 232, 180];
    glowLine(ctx, [[G.cx, G.cy], [G.cx, lerp(G.cy, G.top, e)]], w, rgb, a);
    glowLine(ctx, [[G.cx, G.cy], [G.cx, lerp(G.cy, G.bot, e)]], w, rgb, a * 0.85);
    glowLine(ctx, [[G.cx, G.cy], [lerp(G.cx, 0, e), G.cy]], w, rgb, a);
    glowLine(ctx, [[G.cx, G.cy], [lerp(G.cx, W.w, e), G.cy]], w, rgb, a);
    glowLine(ctx, [[G.cx, G.cy], [lerp(G.cx, G.far[0], e), lerp(G.cy, G.far[1], e)]], w * 0.8, rgb, a * 0.8);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, G.cx, G.cy, M() * 0.07, a * 0.8);
    glowSp(ctx, SP.white, G.cx, G.cy, M() * 0.018, a);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 一条金线：从众人之上下来，贯乎众人之中，又回到上头（弗 4:4–6）
  function threadPts() {
    const ids = COURT().concat(['tychicus', 'timothy', 'paul'].filter(live));
    const pts = [];
    for (const id of ids) { const p = figPt(id, 0.6); if (p) pts.push(p); }
    if (!pts.length) return [];
    pts.sort((a, b) => a[0] - b[0]);
    const G = loveGeo();
    return smooth([[G.cx, G.cy]].concat(pts.map(p => [p[0], p[1]]), [[G.cx, G.cy]]), 8);
  }
  function drawThread(ctx) {
    const a = W.lv.prThreadA, k = W.lv.prThread;
    if (a < 0.01 || k < 0.005) return;
    glowLine(ctx, partial(threadPts(), c01(k)), Math.max(0.8, 1 * SU()), [255, 228, 160], a * 0.9);
  }
  // 上头来的光（弗 5:14）
  function drawShine(ctx) {
    const k = W.lv.prShine;
    if (k < 0.01) return;
    const x = lerp(px('m0'), px('m1'), 0.5) * W.w, w = (px('m1') - px('m0') + 0.12) * W.w * 1.3;
    beam(ctx, x, 0, fieldY(px('m0'), 0.7), w, k * 0.45);
    beam(ctx, x, 0, fieldY(px('m0'), 0.7), w * 0.35, k * 0.35);
  }
  function drawSong(ctx) {
    const k = W.lv.prSong;
    if (k < 0.01) return;
    SP || sprites();
    const x = lerp(px('m0'), px('m1'), 0.5) * W.w, y = fieldY(px('m0'), 0.4) - 1.6 * PH(2);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.soft, x, y, (px('m1') - px('m0')) * W.w * 0.9, k * 0.18);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 锁链：保罗的手腕到看守的兵
  function drawChain(ctx) {
    if (!rome() || !live('paul') || !live('guard')) return;
    const P = fig('paul'), G = fig('guard');
    if (!P._vis || !G._vis) return;
    const ph = P._h;
    const pSeat = P.pose === 'seat';
    const pd = G._x >= P._x ? 1 : -1;
    const ax = P._x + pd * 0.07 * ph, ay = P._y - (pSeat ? 0.36 : P.pose === 'raise' ? 0.95 : 0.47) * ph;
    const bx = G._x - pd * 0.07 * G._h, by = G._y - 0.47 * G._h;
    const d = Math.hypot(bx - ax, by - ay);
    const sag = Math.max(0.18 * ph, 0.45 * Math.max(0, 1.2 * ph - d) + 0.12 * d);
    const mx = (ax + bx) / 2, my = Math.max(ay, by) + sag;
    const N = Math.max(6, Math.round(d / (0.06 * ph)));
    const al = Math.min(P.alpha, G.alpha);
    const glowK = W.lv.prChain;
    ctx.strokeStyle = css(IRON, 2, al, 0.05 + 0.3 * nightK());
    ctx.lineWidth = Math.max(0.7, 0.028 * ph);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const t = i / N, x = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, y = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by;
      const r = 0.026 * ph;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * (i % 2 ? 0.55 : 1), 0, 0, TAU);
    }
    ctx.stroke();
    if (glowK > 0.02) {
      const pts = [];
      for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([(1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mx + t * t * bx, (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * my + t * t * by]); }
      glowLine(ctx, pts, Math.max(0.8, 0.03 * ph), [255, 220, 150], glowK * al * 0.8);
    }
  }
  // 屋里的灯火（在人之上画）
  function drawLampFlame(ctx) {
    if (!rome()) return;
    const L = lampPt();
    flame(ctx, L[0] + 0.07 * PH(2), L[1] - 0.05 * PH(2), 0.16 * PH(2), 1, 1.7);
  }
  // 神所赐的全副军装（弗 6:14–17）：只是光，显在保罗身上
  function drawArmor(ctx) {
    const P = fig('paul');
    if (!P || !P._vis) return;
    const lv = W.lv, any = Math.max(lv.prBelt, lv.prPlate, lv.prShoes, lv.prShield, lv.prHelm, lv.prSword);
    if (any < 0.02) return;
    SP || sprites();
    const x = P._x, y = P._y, h = P._h, d = P.fd >= 0 ? 1 : -1, al = P.alpha;
    const hip = P.pose === 'seat' ? 0.3 : 0.47;
    const G = [255, 234, 186];
    ctx.globalCompositeOperation = 'lighter';
    // 全身一层淡淡的光
    ctx.save(); ctx.translate(x, y - 0.5 * h); ctx.scale(0.6, 1);
    glowSp(ctx, SP.soft, 0, 0, 0.95 * h, any * al * 0.16);
    ctx.restore();
    if (lv.prShoes > 0.01) {
      for (const s of [-0.06, 0.07]) { glowSp(ctx, SP.gold, x + s * h * d, y - 0.02 * h, 0.16 * h, lv.prShoes * al); glowSp(ctx, SP.white, x + s * h * d, y - 0.02 * h, 0.05 * h, lv.prShoes * al); }
    }
    if (lv.prBelt > 0.01) {
      ctx.strokeStyle = U.rgba(G[0], G[1], G[2], lv.prBelt * al);
      ctx.lineWidth = Math.max(1.4, 0.06 * h);
      ctx.beginPath(); ctx.ellipse(x, y - hip * h, 0.12 * h, 0.035 * h, 0, 0, TAU); ctx.stroke();
      glowSp(ctx, SP.gold, x, y - hip * h, 0.24 * h, lv.prBelt * al * 0.6);
    }
    if (lv.prPlate > 0.01) {
      const cy = y - (hip + 0.19) * h;
      glowSp(ctx, SP.gold, x, cy, 0.26 * h, lv.prPlate * al * 0.45);
      ctx.fillStyle = U.rgba(255, 242, 212, lv.prPlate * al * 0.55);
      ctx.beginPath(); ctx.moveTo(x - 0.1 * h, cy - 0.12 * h); ctx.lineTo(x + 0.1 * h, cy - 0.12 * h); ctx.quadraticCurveTo(x + 0.11 * h, cy + 0.08 * h, x, cy + 0.14 * h); ctx.quadraticCurveTo(x - 0.11 * h, cy + 0.08 * h, x - 0.1 * h, cy - 0.12 * h); ctx.fill();
    }
    if (lv.prHelm > 0.01) {
      const hy = y - (P.pose === 'seat' ? 0.72 : 0.93) * h;
      glowSp(ctx, SP.gold, x, hy, 0.24 * h, lv.prHelm * al * 0.8);
      ctx.fillStyle = U.rgba(255, 240, 206, lv.prHelm * al * 0.85);
      ctx.beginPath(); ctx.arc(x, hy + 0.012 * h, 0.085 * h, Math.PI, TAU); ctx.closePath(); ctx.fill();
      ctx.fillRect(x - 0.012 * h, hy - 0.16 * h, 0.024 * h, 0.09 * h);
    }
    if (lv.prShield > 0.01) {
      const sx = x + d * 0.24 * h, sy = y - (hip + 0.08) * h, r = 0.24 * h;
      glowSp(ctx, SP.gold, sx, sy, r * 1.8, lv.prShield * al * 0.3);
      ctx.fillStyle = U.rgba(255, 236, 190, lv.prShield * al * 0.18);
      ctx.beginPath(); ctx.ellipse(sx, sy, r * 0.6, r, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = U.rgba(255, 248, 226, lv.prShield * al);
      ctx.lineWidth = Math.max(1, 0.04 * h);
      ctx.stroke();
      glowSp(ctx, SP.white, sx, sy, 0.08 * h, lv.prShield * al);
    }
    if (lv.prSword > 0.01) {
      const hx = x - d * 0.12 * h, hy = y - (hip + 0.02) * h;
      const tx = hx - d * 0.1 * h, ty = hy - 0.95 * h;
      glowLine(ctx, [[hx, hy], [tx, ty]], Math.max(1, 0.04 * h), [255, 246, 224], lv.prSword * al);
      glowLine(ctx, [[hx - 0.07 * h, hy - 0.08 * h], [hx + 0.07 * h, hy - 0.06 * h]], Math.max(1, 0.035 * h), [255, 236, 190], lv.prSword * al * 0.8);
      glowSp(ctx, SP.white, tx, ty, 0.12 * h, lv.prSword * al);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 极美的香气（腓 4:18）：从馈送里升起的三缕光
  function drawIncense(ctx) {
    const k = W.lv.prIncense;
    if (k < 0.01 || !S.gift || !rome()) return;
    const H = houseGeo(), ph = H.ph, gx = px('gift') * W.w, gy = H.base - 0.25 * ph;
    for (let s = 0; s < 3; s++) {
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        pts.push([gx + (s - 1) * 0.12 * ph + Math.sin(t * 5 + W.t * 1.3 + s * 2) * 0.18 * ph * t, gy - t * 2.2 * ph]);
      }
      glowLine(ctx, pts, Math.max(0.7, 0.03 * ph), [255, 226, 200], k * 0.55);
    }
  }
  // 虚己与升为至高（腓 2:6–11）
  function crossGeo() {
    const m = PH(1), xf = phone() ? 0.575 : 0.585, x = xf * W.w, g = gY(1, xf) + 1;
    return { m, x, g, H: 1.45 * m, top: [x, g - 1.45 * m] };
  }
  // 至高处（桌面上避开抬头的小标题：光芒不碰 HUD）
  function zenith() { return [W.w * (phone() ? 0.64 : 0.7), W.h * (phone() ? 0.4 : 0.115)]; }
  function drawCrossMid(ctx) {
    const k = W.lv.prCross;
    if (k < 0.01) return;
    const G = crossGeo(), bw = Math.max(1, 0.1 * G.m);
    ctx.fillStyle = css([46, 38, 34], 1, k);
    ctx.fillRect(G.x - bw / 2, G.g - G.H, bw, G.H);
    ctx.fillRect(G.x - 0.42 * G.m, G.g - G.H * 0.78 - bw / 2, 0.84 * G.m, bw);
  }
  function drawDescent(ctx) {
    const a = W.lv.prDescA, r = W.lv.prRise, hi = W.lv.prHigh;
    if (a < 0.01 && hi < 0.01) return;
    SP || sprites();
    const Z = zenith(), X = crossGeo().top, m = M();
    let p, rad, br;
    if (r > 0.001) { const e = ease(c01(r)); p = [lerp(X[0], Z[0], e), lerp(X[1], Z[1], e)]; rad = lerp(0.012, 0.05, e); br = lerp(0.5, 1, e); }
    else { const e = ease(c01(W.lv.prDesc)); p = [lerp(Z[0], X[0], e), lerp(Z[1], X[1], e)]; rad = lerp(0.045, 0.012, e); br = lerp(1, 0.55, e); }
    ctx.globalCompositeOperation = 'lighter';
    // 走过的路：一道极淡的光
    if (r < 0.999 && W.lv.prDesc > 0.01) glowLine(ctx, [Z, p], Math.max(0.6, 0.8 * SU()), [255, 236, 200], a * 0.25 * (1 - r));
    glowSp(ctx, SP.gold, p[0], p[1], m * rad * 2.4, a * br * 0.8);
    glowSp(ctx, SP.white, p[0], p[1], m * rad * 0.7, a * br);
    if (hi > 0.01) {
      // 至高处：光芒
      ctx.save();
      ctx.translate(Z[0], Z[1]);
      ctx.rotate(W.t * 0.03);
      for (let i = 0; i < 12; i++) {
        ctx.rotate(TAU / 12);
        const L = m * (i % 2 ? 0.1 : 0.16) * (0.9 + 0.1 * Math.sin(W.t * 1.3 + i));
        const g = ctx.createLinearGradient(0, 0, L, 0);
        g.addColorStop(0, U.rgba(255, 240, 200, 0.5 * hi)); g.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(0, -m * 0.006); ctx.lineTo(L, 0); ctx.lineTo(0, m * 0.006); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      glowSp(ctx, SP.gold, Z[0], Z[1], m * 0.14, hi * 0.6);
      glowSp(ctx, SP.white, Z[0], Z[1], m * 0.035, hi);
    }
    // 十字架上的一点余烬
    if (W.lv.prCross > 0.05 && r < 0.02 && W.lv.prDesc > 0.98) glowSp(ctx, SP.ember, X[0], X[1] + crossGeo().H * 0.2, crossGeo().m * 0.5, W.lv.prCross * 0.5);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 天上的众光：一弯小小的光的形体，都屈膝
  function hostPts() {
    const out = [];
    if (phone()) {
      const n = 7;
      for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; out.push([W.w * lerp(0.08, 0.94, t), W.h * (0.56 - 0.03 * Math.sin(t * Math.PI))]); }
      return out;
    }
    const Z = zenith();
    for (let i = 0; i < 12; i++) {
      const side = i < 6 ? -1 : 1, k = i % 6;
      const x = Z[0] + side * W.w * (0.1 + 0.05 * k), y = Z[1] + W.h * (0.03 + 0.03 * k + 0.006 * k * k);
      if (x > W.w * 0.97 || x < W.w * 0.36) continue;
      out.push([x, y]);
    }
    return out;
  }
  // 一个光的形体（无面目）：长衣、肩、头；屈膝时身子矮下去，头与肩向前俯下（身子不整个倒转）
  function hostFigure(ctx, x, y, h, a, bw, dir, seed) {
    if (a < 0.01 || h < 1) return;
    const sy = 1 - 0.16 * bw;                          // 屈膝：长衣矮下去
    const th = dir * bw * 0.95;                        // 上身自腰向前俯下（至多约 55°）
    const ux = Math.sin(th), uy = -Math.cos(th), qx = Math.cos(th), qy = Math.sin(th);
    const sw = Math.sin(W.t * 1.7 + seed) * 0.018 * h;
    const wx = x + dir * bw * 0.03 * h, wy = y - 0.46 * h * sy;                                 // 腰
    const sx = wx + ux * 0.32 * h, syy = wy + uy * 0.32 * h;                                   // 肩
    const hx = wx + ux * 0.42 * h, hy = wy + uy * 0.42 * h, hr = 0.08 * h;                     // 头
    glowSp(ctx, SP.gold, (x + sx) / 2, (y + syy) / 2, 0.8 * h, a * 0.4);
    ctx.fillStyle = U.rgba(255, 250, 238, Math.min(1, a * 0.95));
    ctx.beginPath();
    // 长衣（腰以下）
    ctx.moveTo(x - 0.19 * h, y);
    ctx.quadraticCurveTo(x - 0.15 * h + sw, y - 0.25 * h * sy, wx - 0.1 * h, wy);
    ctx.lineTo(wx + 0.1 * h, wy);
    ctx.quadraticCurveTo(x + 0.15 * h + sw, y - 0.25 * h * sy, x + 0.19 * h, y);
    ctx.closePath();
    // 上身（腰到肩），随俯身而转
    ctx.moveTo(wx - qx * 0.1 * h, wy - qy * 0.1 * h);
    ctx.lineTo(sx - qx * 0.1 * h, syy - qy * 0.1 * h);
    ctx.lineTo(sx + qx * 0.1 * h, syy + qy * 0.1 * h);
    ctx.lineTo(wx + qx * 0.1 * h, wy + qy * 0.1 * h);
    ctx.closePath();
    // 头
    ctx.moveTo(hx + hr, hy); ctx.arc(hx, hy, hr, 0, TAU);
    ctx.fill();
    glowSp(ctx, SP.white, hx, hy, 0.16 * h, a * 0.8);
  }
  function drawHost(ctx) {
    const k = W.lv.prHost;
    if (k < 0.01) return;
    SP || sprites();
    const Z = zenith(), h = PH(2) * (phone() ? 1.1 : 1.0), bw = W.lv.prBowH;
    ctx.globalCompositeOperation = 'lighter';
    hostPts().forEach((p, i) => {
      const dir = Z[0] >= p[0] ? 1 : -1, bob = Math.sin(W.t * 1.1 + i * 1.7) * 2.5 * SU();
      hostFigure(ctx, p[0], p[1] + bob, h, k * (0.85 + 0.15 * Math.sin(W.t * 1.4 + i * 2.1)), bw, dir, i * 1.3);
    });
    ctx.globalCompositeOperation = 'source-over';
  }
  // 地底下的：深处的一点光（很淡，不在经文之后放亮光）
  function drawDeep(ctx) {
    const k = W.lv.prDeep;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.save();
    ctx.translate(W.w * (phone() ? 0.2 : 0.26), W.h * 0.95); ctx.scale(1, 0.3);
    glowSp(ctx, SP.pale, 0, 0, W.w * 0.2, k * 0.18);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
  }
  // 出人意外的平安：一座光穹（腓 4:7）
  function peaceGeo() {
    const H = houseGeo(), cx = lerp(px('m0') * W.w, H.x1, 0.5), by = H.base + 0.35 * H.ph;
    const rx = (H.x1 - px('m0') * W.w) * 0.52 + 0.3 * H.ph, ry = Math.min(rx * 0.78, by - W.h * (phone() ? 0.42 : 0.2));
    return { cx, by, rx, ry };
  }
  // 光穹：柔和的渐变，一道细而实的边，边上一段亮光慢慢流过（不是虚线）
  function drawPeace(ctx) {
    const k = W.lv.prPeace;
    if (k < 0.01 || !rome()) return;
    SP || sprites();
    const { cx, by, rx, ry } = peaceGeo(), u = SU();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath(); ctx.ellipse(cx, by, rx, ry, 0, Math.PI, TAU); ctx.closePath();
    const g = ctx.createRadialGradient(cx, by, ry * 0.1, cx, by, rx);
    g.addColorStop(0, U.rgba(255, 232, 176, 0.12 * k)); g.addColorStop(0.62, U.rgba(255, 226, 164, 0.06 * k));
    g.addColorStop(0.9, U.rgba(255, 232, 180, 0.12 * k)); g.addColorStop(1, U.rgba(255, 238, 196, 0.2 * k));
    ctx.fillStyle = g; ctx.fill();
    // 宽而淡的晕边 + 细而实的边
    ctx.strokeStyle = U.rgba(255, 238, 196, 0.12 * k);
    ctx.lineWidth = Math.max(2, 7 * u);
    ctx.beginPath(); ctx.ellipse(cx, by, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    ctx.strokeStyle = U.rgba(255, 242, 210, 0.42 * k);
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    ctx.beginPath(); ctx.ellipse(cx, by, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    // 慢慢流过的微光
    ctx.lineCap = 'round';
    for (let i = 0; i < 2; i++) {
      const s = U.fract(W.t * 0.07 + i * 0.5), a0 = Math.PI + s * Math.PI, span = 0.32;
      const fa = Math.sin(Math.PI * s);
      ctx.strokeStyle = U.rgba(255, 248, 226, 0.4 * k * fa);
      ctx.lineWidth = Math.max(1.4, 2.6 * u);
      ctx.beginPath(); ctx.ellipse(cx, by, rx, ry, 0, Math.max(Math.PI, a0 - span), Math.min(TAU, a0 + span)); ctx.stroke();
    }
    ctx.lineCap = 'butt';
    ctx.restore();
  }
  // 万有也靠他而立（西 1:15–20）
  function orbPt() { return [W.w * (phone() ? 0.62 : 0.64), W.h * (phone() ? 0.43 : 0.2)]; }
  let STARS = null;
  function starPts() {
    if (STARS && STARS.w === W.w && STARS.h === W.h) return STARS.pts;
    const pts = [], n = phone() ? 20 : 32;
    const y0 = phone() ? 0.36 : 0.05, y1 = phone() ? 0.62 : 0.52;
    for (let i = 0; i < n; i++) {
      let x = rt(i * 2 + 1200), y = lerp(y0, y1, rt(i * 2 + 1201));
      if (!phone() && x < 0.52 && y > 0.5) y -= 0.1;
      pts.push([x * W.w, y * W.h, rt(i + 1300)]);
    }
    STARS = { w: W.w, h: W.h, pts };
    return pts;
  }
  function drawCreation(ctx) {
    const o = W.lv.prOrb, mk = W.lv.prMake;
    if (o < 0.01 && mk < 0.01) return;
    SP || sprites();
    const O = orbPt(), m = M();
    ctx.globalCompositeOperation = 'lighter';
    if (mk > 0.01) {
      for (const s of starPts()) {
        const tw = 0.55 + 0.45 * Math.sin(W.t * (1.2 + s[2]) + s[2] * 30);
        glowSp(ctx, SP.bless, s[0], s[1], (2.6 + 2.4 * s[2]) * SU(), mk * tw * 0.95);
      }
      // 能看见的，不能看见的：几道淡淡的光影
      for (let i = 0; i < 5; i++) {
        const x = O[0] + (i - 2) * m * 0.2 + Math.sin(W.t * 0.2 + i) * 6, y = O[1] + m * (0.05 + 0.04 * (i % 2));
        ctx.save(); ctx.translate(x, y); ctx.scale(0.35, 1);
        glowSp(ctx, SP.soft, 0, 0, m * 0.1, mk * 0.14);
        ctx.restore();
      }
    }
    if (o > 0.01) {
      glowSp(ctx, SP.gold, O[0], O[1], m * 0.16, o * 0.55);
      glowSp(ctx, SP.white, O[0], O[1], m * 0.035, o);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function holdTargets() {
    const t = [];
    const st = starPts();
    for (let i = 0; i < st.length; i += 2) t.push([st[i][0], st[i][1]]);
    if (W.lv.lights > 0.5 && W.core.y < W.horizonY) t.push([W.core.x, W.core.y]);
    if (W.moon && W.moon.vis > 0.3 && W.moon.y < W.horizonY) t.push([W.moon.x, W.moon.y]);
    for (const xf of [0.08, 0.18, 0.28]) t.push([xf * W.w, W.h * 0.604]);
    CITY || buildCity();
    const list = rome() ? CITY.rome : CITY.col;
    for (let i = 0; i < list.length; i += 3) { const xf = cityX(list[i].u); t.push([xf * W.w, gY(1, xf) - hillH(xf) - list[i].h * PH(1)]); }
    const c = C();
    if (c && c.people) for (const p of c.people.values()) { if (p._vis && !p.dying && p.alpha > 0.3) t.push([p._x, p._y - p._h * 0.6]); }
    const H = houseGeo();
    t.push([H.cx, H.top - H.roofH]);
    return t;
  }
  function drawHold(ctx) {
    const a = W.lv.prHoldA, k = W.lv.prHold;
    if (a < 0.01 || k < 0.005) return;
    SP || sprites();
    const O = orbPt(), e = c01(k);
    const ts = holdTargets();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 228, 160, 0.32 * a);
    ctx.lineWidth = Math.max(0.6, 0.8 * SU());
    ctx.beginPath();
    ts.forEach((p, i) => {
      const q = c01(e * 1.3 - (i % 7) * 0.04);
      if (q <= 0) return;
      ctx.moveTo(O[0], O[1]); ctx.lineTo(lerp(O[0], p[0], q), lerp(O[1], p[1], q));
    });
    ctx.stroke();
    ts.forEach((p, i) => { if (i % 2) return; const q = c01(e * 1.3 - (i % 7) * 0.04); if (q >= 1) glowSp(ctx, SP.bless, p[0], p[1], 6 * SU(), a * 0.6); });
    // 在他里面：一圈光
    if (e > 0.6) {
      ctx.strokeStyle = U.rgba(255, 236, 190, 0.45 * a * c01((e - 0.6) / 0.4));
      ctx.lineWidth = Math.max(0.8, 1.2 * SU());
      ctx.beginPath(); ctx.arc(O[0], O[1], M() * (0.07 + 0.005 * Math.sin(W.t * 2)), 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 执政的、掌权的：边上阴冷的暗影（西 2:15——被掳去，退去）
  // 一圈冷的灰蓝的雾，贴着院子灯光的边缘（夜里也看得见，并把灯光的边压暗）；退去时往外滑开、淡去
  function drawShade(ctx) {
    const k = W.lv.prShade;
    if (k < 0.01) return;
    SP || sprites();
    const m = M(), H = houseGeo();
    const cx = lerp(px('m0') * W.w, H.x1, 0.5), cy = H.base + 0.3 * H.ph;
    const spots = phone()
      ? [[0.38, 0.8], [0.46, 0.7], [0.6, 0.645], [0.84, 0.66], [0.99, 0.77], [0.99, 0.96], [0.36, 0.99]]
      : [[0.53, 0.665], [0.61, 0.575], [0.74, 0.52], [0.88, 0.575], [0.98, 0.7], [0.99, 0.93], [0.82, 1.02]];
    const a0 = 0.26 + 0.12 * nightK();
    for (let i = 0; i < spots.length; i++) {
      const sx = spots[i][0] * W.w, sy = spots[i][1] * W.h;
      const dx = sx - cx, dy = sy - cy, d = Math.hypot(dx, dy) || 1, out = (1 - k) * m * 0.42;
      for (let j = 0; j < 3; j++) {
        const x = sx + (dx / d) * out + Math.sin(W.t * 0.25 + i + j * 2) * m * 0.022 + (j - 1) * m * 0.05;
        const y = sy + (dy / d) * out + Math.cos(W.t * 0.2 + j + i) * m * 0.016 + (j - 1) * m * 0.01;
        glowSp(ctx, SP.mist, x, y, m * (0.12 + 0.03 * j), k * a0);
      }
    }
  }
  // 字据（西 2:14）：写满墨字的一卷；字被涂抹成光，字据卷起，升入光中
  function debtGeo() {
    const w = W.w * (phone() ? 0.5 : 0.17), h = W.h * (phone() ? 0.055 : 0.075);
    return { x: W.w * (phone() ? 0.52 : 0.56), y: W.h * (phone() ? 0.53 : 0.46), w, h };
  }
  const DEBT_R = 4, DEBT_C = 11;
  function debtOrd(i) { return c01(((i % DEBT_C) + (i / DEBT_C | 0) * 0.35) / (DEBT_C + 1) * 0.85 + rt(i + 1500) * 0.14); }
  function drawDebt(ctx) {
    const a = W.lv.prDebt;
    if (a < 0.01) return;
    SP || sprites();
    const G = debtGeo(), up = ease(c01(W.lv.prDebtUp)), er = c01(W.lv.prErase);
    // 手机竖屏：经文在上头，字据只升到经文框之下（约 0.37 H）就在光中淡去
    const P = phone();
    const w = G.w * (1 - 0.88 * up), cx = G.x, cy = P ? lerp(G.y, W.h * 0.37, up) : lerp(G.y, -G.h, up * up), h = G.h;
    const al = a * (1 - (P ? c01((up - 0.45) / 0.55) : c01((up - 0.75) / 0.25)));
    if (al < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.soft, cx, cy, Math.max(w, h) * 0.8, al * (0.08 + 0.3 * er));
    ctx.globalCompositeOperation = 'source-over';
    const pc = [lerp(206, 246, er), lerp(190, 240, er), lerp(156, 222, er)];
    ctx.fillStyle = U.rgba(pc[0], pc[1], pc[2], al);
    ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    ctx.fillStyle = U.rgba(pc[0] - 40, pc[1] - 44, pc[2] - 50, al);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * w / 2, cy, h * 0.12, h * 0.6, 0, 0, TAU); ctx.fill(); }
    if (up < 0.35) {
      const ga = al * (1 - up / 0.35);
      const cw = (G.w * 0.86) / DEBT_C, ch = (h * 0.74) / DEBT_R;
      ctx.fillStyle = U.rgba(INK[0], INK[1], INK[2], ga * 0.9);
      for (let i = 0; i < DEBT_R * DEBT_C; i++) {
        if (debtOrd(i) < er) continue;
        const r = (i / DEBT_C) | 0, c = i % DEBT_C;
        const gx = cx - G.w * 0.43 + (c + 0.5) * cw, gy = cy - h * 0.37 + (r + 0.5) * ch;
        const s = Math.min(cw, ch) * 0.34;
        ctx.fillRect(gx - s, gy - s * 0.2, s * 2 * (0.6 + 0.4 * rt(i + 1600)), Math.max(0.8, s * 0.3));
        ctx.fillRect(gx - s * 0.2 + (rt(i + 1700) - 0.5) * s, gy - s, Math.max(0.8, s * 0.3), s * 2);
        if (rt(i + 1800) > 0.5) ctx.fillRect(gx - s * 0.8, gy + s * 0.5, s * 1.4, Math.max(0.8, s * 0.26));
      }
    }
    if (up > 0.6) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.white, cx, cy, M() * 0.05, a * c01((up - 0.6) / 0.25) * (1 - c01((up - 0.9) / 0.1)));
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  let erasePrev = 0;
  // 怜悯、恩慈、谦虚、温柔、忍耐，爱心（西 3:12–14）：缠在阿尼西谋身上的光
  const VIRT = [[255, 150, 160], [255, 196, 110], [160, 206, 246], [176, 232, 186], [196, 170, 246], [255, 226, 150]];
  function drawVirtue(ctx) {
    const a = W.lv.prVirtueA, k = W.lv.prVirtue;
    if (a < 0.01 || k < 0.01) return;
    const f = fig('onesimus');
    if (!f || !f._vis) return;
    const x = f._x, y = f._y, h = f._h;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const q = c01((k * 6 - i) * 1.5);
      if (q < 0.01) continue;
      const c = VIRT[i], yy = y - (i === 5 ? 0.47 : 0.18 + i * 0.14) * h, rx = (i === 5 ? 0.1 : 0.16 - i * 0.012) * h;
      ctx.strokeStyle = U.rgba(c[0], c[1], c[2], a * q * 0.9 * f.alpha);
      ctx.lineWidth = Math.max(1, (i === 5 ? 0.05 : 0.028) * h);
      ctx.beginPath(); ctx.ellipse(x, yy, rx, rx * 0.3, 0.12 * Math.sin(W.t + i), 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 船：推基古与阿尼西谋坐船往东去（西 4:7–9）
  function boatGeo() {
    const k = ease(c01(W.lv.prBoat));
    const x0 = px('dock') * W.w - 0.07 * W.w, y0 = W.h * 0.952;
    const x = lerp(x0, -0.14 * W.w, k), y = lerp(y0, W.h * 0.935, k);
    return { x, y, s: W.seaScale(y) * (phone() ? 1.5 : 1), k, x0, y0 };
  }
  function drawDock(ctx) {
    if (!rome()) return;
    const B = boatGeo(), s = W.seaScale(B.y0) * (phone() ? 1.5 : 1);
    const x1 = px('dock') * W.w + 0.02 * W.w, x0 = B.x0 + 14 * s;
    ctx.fillStyle = css([104, 80, 58], 2, 1, 0.05);
    ctx.fillRect(x0, B.y0 - 7 * s, x1 - x0, 3 * s);
    for (let i = 0; i < 4; i++) { const x = lerp(x0 + 2 * s, x1 - 4 * s, i / 3); ctx.fillRect(x, B.y0 - 7 * s, 2.4 * s, 12 * s); }
  }
  function drawBoat(ctx) {
    if (!rome() || S.boat === 'gone') return;
    const B = boatGeo();
    if (B.x < -0.2 * W.w) return;
    const s = B.s, x = B.x, y = B.y + Math.sin(W.t * 1.4) * 0.8 * s;
    const sail = S.boat === 'sailing' ? 1 : 0;
    const al = 1 - c01((B.k - 0.85) / 0.15);
    ctx.globalAlpha = al;
    // 船身
    ctx.fillStyle = css([86, 60, 42], 2, 1, 0.05);
    ctx.beginPath();
    ctx.moveTo(x - 30 * s, y - 8 * s); ctx.quadraticCurveTo(x - 26 * s, y + 3 * s, x - 12 * s, y + 4 * s); ctx.lineTo(x + 16 * s, y + 4 * s);
    ctx.quadraticCurveTo(x + 28 * s, y + 2 * s, x + 32 * s, y - 10 * s); ctx.lineTo(x + 26 * s, y - 6 * s); ctx.lineTo(x - 24 * s, y - 6 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 110, 72], 2, 1, 0.1);
    ctx.fillRect(x - 24 * s, y - 7 * s, 50 * s, 1.6 * s);
    // 桅与帆
    ctx.fillStyle = css([90, 66, 48], 2, 1);
    ctx.fillRect(x - 1 * s, y - 44 * s, 2 * s, 38 * s);
    if (sail) {
      ctx.fillStyle = css([236, 226, 204], 2, 1, 0.15);
      ctx.beginPath(); ctx.moveTo(x - 16 * s, y - 42 * s); ctx.quadraticCurveTo(x - 4 * s, y - 26 * s, x - 15 * s, y - 11 * s); ctx.lineTo(x + 14 * s, y - 11 * s);
      ctx.quadraticCurveTo(x + 10 * s, y - 26 * s, x + 16 * s, y - 42 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([90, 66, 48], 2, 1);
      ctx.fillRect(x - 17 * s, y - 43 * s, 34 * s, 1.6 * s);
      // 船上的两个人
      ctx.fillStyle = css([60, 48, 42], 2, 1, 0.1);
      for (const dx of [-12, 8]) { ctx.fillRect(x + dx * s - 2 * s, y - 16 * s, 4 * s, 10 * s); ctx.beginPath(); ctx.arc(x + dx * s, y - 18 * s, 2.2 * s, 0, TAU); ctx.fill(); }
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x - 12 * s, y - 14 * s, 9 * s, 0.35 * al);
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.fillStyle = css([220, 210, 190], 2, 1, 0.1);
      ctx.fillRect(x - 12 * s, y - 42 * s, 24 * s, 3 * s);
    }
    ctx.globalAlpha = 1;
  }
  // 恩典的光（门 1:25）
  function drawGrace(ctx) {
    const k = W.lv.prGrace;
    if (k < 0.01) return;
    SP || sprites();
    const H = houseGeo(), x = (px('ch0') * W.w + H.x1) / 2, y = H.base - 1.2 * H.ph;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, x, y, (H.x1 - px('ch0') * W.w) * 0.9, k * 0.3);
    glowSp(ctx, SP.gold, H.cx, H.base - 0.9 * H.ph, 2 * H.ph, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 腓利门手中的信
  function drawLetter(ctx) {
    if (!S.read || rome()) return;
    const h = handPt('philemon');
    if (!h) return;
    SP || sprites();
    const w = 0.34 * h[2];
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.soft, h[0], h[1], 0.5 * h[2], 0.35 * h[3]);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = U.rgba(PARCH[0], PARCH[1], PARCH[2], h[3]);
    ctx.fillRect(h[0] - w / 2, h[1] - 0.1 * h[2], w, 0.13 * h[2]);
    ctx.fillStyle = U.rgba(INK[0], INK[1], INK[2], 0.6 * h[3]);
    for (let i = 0; i < 4; i++) ctx.fillRect(h[0] - w * 0.4 + i * w * 0.2, h[1] - 0.07 * h[2], w * 0.14, Math.max(0.6, 0.015 * h[2]));
  }
  function drawVeil(ctx) {
    const k = W.lv.prVeil;
    if (k < 0.005) return;
    ctx.fillStyle = U.rgba(12, 9, 6, Math.min(0.97, k));
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); buildCity(); },
    resize() { BLESS = null; STARS = null; },
    update(dt) {
      if (!isCur()) { FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur + (FXL[i].delay || 0)) FXL.splice(i, 1); }
      // 墙化为光：一段一段沉下时，放出微光（只关乎画面）
      const gone = 1 - W.lv.prWall;
      if (!W.replaying && gone > wallPrev + 1e-4 && FXL.length < 400) {
        for (let i = 0; i < WALL_N; i++) {
          const o = wallOrd(i);
          if (o - 0.08 > wallPrev && o - 0.08 <= gone) {
            const a = wallSeg(i), b = wallSeg(i + 1);
            motes(null, (a.x + b.x) / 2, (a.y + b.y) / 2 - a.h * 0.5, 7, GOLD, Math.abs(b.x - a.x) + a.w * 2, 34);
          }
        }
      }
      wallPrev = gone;
      // 字被涂抹时，每个字化成一点光
      const er = c01(W.lv.prErase);
      if (!W.replaying && er > erasePrev + 1e-4 && W.lv.prDebt > 0.3 && FXL.length < 400) {
        const G = debtGeo(), cw = (G.w * 0.86) / DEBT_C, ch = (G.h * 0.74) / DEBT_R;
        for (let i = 0; i < DEBT_R * DEBT_C; i++) {
          const o = debtOrd(i);
          if (o > erasePrev && o <= er) motes(null, G.x - G.w * 0.43 + ((i % DEBT_C) + 0.5) * cw, G.y - G.h * 0.37 + (((i / DEBT_C) | 0) + 0.5) * ch, 2, GOLD, cw, 26);
        }
      }
      erasePrev = er;
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'far') { drawFarMount(ctx); return; }
      if (pass === 'mid') { drawMidCity(ctx); drawCrossMid(ctx); return; }
      if (pass === 'near') {
        if (rome()) { drawNeighbors(ctx); drawRomeHouse(ctx); } else drawColHouse(ctx);
        drawWall(ctx);
        drawCornerstone(ctx);
        drawBless(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawCreation(ctx); return; }
      if (pass === 'seaNear') { drawDock(ctx); drawBoat(ctx); drawDeep(ctx); return; }
      if (pass === 'air') {
        drawPall(ctx);
        drawScrollText(ctx);
        drawChain(ctx);
        drawLampFlame(ctx);
        drawColLamps(ctx);
        drawHands(ctx);
        drawIncense(ctx);
        drawTemple(ctx);
        drawThread(ctx);
        drawLove(ctx);
        drawShine(ctx);
        drawSong(ctx);
        drawArmor(ctx);
        drawVirtue(ctx);
        drawPeace(ctx);
        drawHold(ctx);
        drawDescent(ctx);
        drawHost(ctx);
        drawShade(ctx);
        drawDebt(ctx);
        drawGrace(ctx);
        drawLetter(ctx);
        drawFXL(ctx);
        return;
      }
      if (pass === 'top') drawVeil(ctx);
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; wallPrev = 1 - W.lv.prWall; erasePrev = c01(W.lv.prErase); BLESS = null; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, cx, cy) => { const d = Math.hypot(cx - x, cy - y); if (d < r && (!best || d < best.d)) best = { label, x: cx, y: cy - 10, d }; };
      const H = houseGeo(), ph = H.ph;
      if (rome()) {
        cand('保罗的住处', H.cx, H.top + 0.4 * ph);
        cand('书信', px('table') * W.w, H.base - 0.5 * ph);
        const L = lampPt(H); cand('灯', L[0], L[1] - 0.1 * ph);
        if (live('paul') && live('guard')) { const P = figPt('paul', 0.3), G = figPt('guard', 0.4); if (P && G) cand('锁链', (P[0] + G[0]) / 2, (P[1] + G[1]) / 2 + 0.2 * ph); }
        if (S.gift) cand('馈送', px('gift') * W.w, H.base - 0.2 * ph);
        cand('罗马', cityX(0.08) * W.w, gY(1, cityX(0.08)) - PH(1));
        if (S.boat !== 'gone') { const B = boatGeo(); if (B.k < 0.9) cand('船', B.x, B.y - 20 * B.s); }
      } else {
        cand('腓利门的家', H.cx, H.top + 0.4 * ph);
        cand('歌罗西', cityX(0.12) * W.w, gY(1, cityX(0.12)) - PH(1));
      }
      if (W.lv.prWall > 0.5) { const s = wallSeg(4); cand('中间隔断的墙', s.x, s.y - s.h); }
      if (W.lv.prStone > 0.5) { const s = templePts()[0]; cand('房角石', s[0], s[1] - 0.2 * ph); }
      if (W.lv.prDebt > 0.5 && W.lv.prDebtUp < 0.3) { const G = debtGeo(); cand('字据', G.x, G.y); }
      return best;
    },
    // 给走查器：本幕的状态摘要（看完 == 直接恢复）
    sig() { return Object.assign({}, S); },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：罗马，保罗所租的屋子，清早
  // ════════════════════════════════════════════════════════════
  function addSoldier(id, x, v, facing, b, o) {
    return add(id, Object.assign({ label: '看守的兵', sex: 'm', age: 'adult', x, v, facing, robe: ROBE.soldier, accent: ROBE.solAcc, hair: 'short', beard: false, prop: 'spear', glow: 0.06, from: b ? from(b) : 'none' }, o || {}));
  }
  function addRomeCore(b) {
    look('paul', 'paul', { x: px('paul'), layer: 2, v: 0.03, facing: -1, pose: 'seat', prop: null, from: b ? from(b) : 'none' });
    addSoldier('guard', px('guard'), 0.02, -1, b);
    add('timothy', { label: '提摩太', sex: 'm', age: 'adult', x: px('tim'), v: 0.03, facing: 1, pose: 'seat', robe: ROBE.tim, accent: ROBE.timAcc, hair: 'short', beard: false, glow: 0.18, from: b ? from(b) : 'none' });
    add('tychicus', { label: '推基古', sex: 'm', age: 'adult', x: px('tych'), v: 0.2, facing: 1, robe: ROBE.tych, accent: ROBE.tychAcc, beard: true, glow: 0.18, from: b ? from(b) : 'none' });
  }
  function setup() {
    const lv = Object.assign({ deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.62, herbs: 0.35, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0, bare: 0.1, bloom: 0.5,
      rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 }, LV0);
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.weatherExclude = [];
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 50, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 12, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    FXL.length = 0;
    S = fresh();
    BLESS = null;
    wallPrev = 0; erasePrev = 0;
    const c = C();
    c.clear({ fade: false });
    addRomeCore(null);
    avoid([0.36, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行，故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '进了罗马城，保罗蒙准和一个看守他的兵另住在一处。', ref: '使徒行传 28:16', hold: 5.5 },
    { text: '保罗在自己所租的房子里住了足足两年。凡来见他的人，他全都接待，<br>放胆传讲神国的道……', ref: '使徒行传 28:30–31', hold: 7 },
  ];
  const V1 = [
    { text: '奉神旨意，作基督耶稣使徒的保罗，<br>写信给在以弗所的圣徒，就是在基督耶稣里有忠心的人。', ref: '以弗所书 1:1', hold: 6.5 },
    { text: '愿颂赞归与我们主耶稣基督的父神！<br>他在基督里曾赐给我们天上各样属灵的福气……', ref: '以弗所书 1:3', hold: 7 },
    { text: '你们既听见真理的道，就是那叫你们得救的福音，也信了基督，<br>既然信他，就受了所应许的圣灵为印记。', ref: '以弗所书 1:13', hold: 7.5 },
  ];
  const V2 = [
    { text: '你们死在过犯罪恶之中，他叫你们活过来。', ref: '以弗所书 2:1', hold: 5.5 },
    { text: '然而，神既有丰富的怜悯，因他爱我们的大爱，<br>当我们死在过犯中的时候，便叫我们与基督一同活过来。', ref: '以弗所书 2:4–5', hold: 7.5 },
    { text: '你们得救是本乎恩，也因着信；这并不是出于自己，乃是神所赐的；<br>也不是出于行为，免得有人自夸。', ref: '以弗所书 2:8–9', hold: 7.5 },
  ];
  const V3 = [
    { text: '你们从前远离神的人，如今却在基督耶稣里，<br>靠着他的血，已经得亲近了。', ref: '以弗所书 2:13', hold: 6 },
    { text: '因他使我们和睦，将两下合而为一，<br>拆毁了中间隔断的墙；', ref: '以弗所书 2:14', hold: 5.5 },
    { text: '这样，你们不再作外人和客旅，是与圣徒同国，是神家里的人了……<br>有基督耶稣自己为房角石，各房靠他联络得合式，渐渐成为主的圣殿。', ref: '以弗所书 2:19–21', hold: 8 },
  ];
  const V4 = [
    { text: '因此，我在父面前屈膝……<br>使基督因你们的信，住在你们心里，叫你们的爱心有根有基，', ref: '以弗所书 3:14–17', hold: 6.5 },
    { text: '能以和众圣徒一同明白基督的爱是何等长阔高深，<br>并知道这爱是过于人所能测度的……', ref: '以弗所书 3:18–19', hold: 6.5 },
    { text: '身体只有一个，圣灵只有一个……一神，就是众人的父，<br>超乎众人之上，贯乎众人之中，也住在众人之内。', ref: '以弗所书 4:4–6', hold: 7.5 },
  ];
  const V5 = [
    { text: '从前你们是暗昧的，但如今在主里面是光明的，<br>行事为人就当像光明的子女。', ref: '以弗所书 5:8', hold: 6 },
    { text: '所以主说：你这睡着的人当醒过来，从死里复活！<br>基督就要光照你了。', ref: '以弗所书 5:14', hold: 6.5 },
    { text: '当用诗章、颂词、灵歌彼此对说，<br>口唱心和地赞美主。', ref: '以弗所书 5:19', hold: 5.5 },
  ];
  const V6 = [
    { text: '要穿戴神所赐的全副军装，就能抵挡魔鬼的诡计。', ref: '以弗所书 6:11', hold: 5.5 },
    { text: '所以要站稳了，用真理当作带子束腰，用公义当作护心镜遮胸，<br>又用平安的福音当作预备走路的鞋穿在脚上。', ref: '以弗所书 6:14–15', hold: 8 },
    { text: '此外，又拿着信德当作盾牌，可以灭尽那恶者一切的火箭；<br>并戴上救恩的头盔，拿着圣灵的宝剑，就是神的道；', ref: '以弗所书 6:16–17', hold: 8 },
    { text: '……我为这福音的奥秘作了带锁链的使者……', ref: '以弗所书 6:20', hold: 5 },
  ];
  const V7 = [
    { text: '……我已经充足，因我从以巴弗提受了你们的馈送，<br>当作极美的香气，为神所收纳、所喜悦的祭物。', ref: '腓立比书 4:18', hold: 7 },
    { text: '我深信那在你们心里动了善工的，必成全这工，<br>直到耶稣基督的日子。', ref: '腓立比书 1:6', hold: 6 },
    { text: '弟兄们，我愿意你们知道，我所遭遇的事更是叫福音兴旺，<br>以致我受的捆锁在御营全军和其余的人中，已经显明是为基督的缘故。', ref: '腓立比书 1:12–13', hold: 8 },
  ];
  const V8 = [
    { text: '他本有神的形象，不以自己与神同等为强夺的；<br>反倒虚己，取了奴仆的形象，成为人的样式；', ref: '腓立比书 2:6–7', hold: 7 },
    { text: '既有人的样子，就自己卑微，存心顺服，<br>以至于死，且死在十字架上。', ref: '腓立比书 2:8', hold: 6 },
    { text: '所以，神将他升为至高，又赐给他那超乎万名之上的名，<br>叫一切在天上的、地上的，和地底下的，因耶稣的名无不屈膝……', ref: '腓立比书 2:9–10', hold: 8 },
    { text: '我们却是天上的国民，<br>并且等候救主，就是主耶稣基督从天上降临。', ref: '腓立比书 3:20', hold: 5.5 },
  ];
  const V9 = [
    { text: '你们要靠主常常喜乐。我再说，你们要喜乐。', ref: '腓立比书 4:4', hold: 5 },
    { text: '应当一无挂虑……<br>神所赐、出人意外的平安必在基督耶稣里保守你们的心怀意念。', ref: '腓立比书 4:6–7', hold: 7 },
    { text: '你们在我身上所学习的，所领受的，所听见的，所看见的，<br>这些事你们都要去行，赐平安的神就必与你们同在。', ref: '腓立比书 4:9', hold: 7.5 },
    { text: '我靠着那加给我力量的，凡事都能做。', ref: '腓立比书 4:13', hold: 5 },
  ];
  const V10 = [
    { text: '爱子是那不能看见之神的像，<br>是首生的，在一切被造的以先。', ref: '歌罗西书 1:15', hold: 6 },
    { text: '因为万有都是靠他造的，无论是天上的，地上的；能看见的，不能看见的……<br>一概都是藉着他造的，又是为他造的。', ref: '歌罗西书 1:16', hold: 8 },
    { text: '他在万有之先；万有也靠他而立。', ref: '歌罗西书 1:17', hold: 5.5 },
    { text: '……便藉着他叫万有无论是地上的、天上的都与自己和好了。', ref: '歌罗西书 1:20', hold: 6 },
  ];
  const V11 = [
    { text: '你们从前在过犯和未受割礼的肉体中死了，<br>神赦免了你们一切过犯，便叫你们与基督一同活过来；', ref: '歌罗西书 2:13', hold: 7.5 },
    { text: '又涂抹了在律例上所写、攻击我们、有碍于我们的字据，<br>把它撤去，钉在十字架上。', ref: '歌罗西书 2:14', hold: 7 },
    { text: '既将一切执政的、掌权的掳来，明显给众人看，<br>就仗着十字架夸胜。', ref: '歌罗西书 2:15', hold: 6 },
  ];
  const V12 = [
    { text: '……为奴的、自主的，惟有基督是包括一切，<br>又住在各人之内。', ref: '歌罗西书 3:11', hold: 6 },
    { text: '所以，你们既是神的选民，圣洁蒙爱的人，就要存怜悯、恩慈、谦虚、温柔、忍耐的心……<br>在这一切之外，要存着爱心，爱心就是联络全德的。', ref: '歌罗西书 3:12–14', hold: 8.5 },
    { text: '我又打发一位亲爱忠心的兄弟阿尼西谋同去；<br>他也是你们那里的人……', ref: '歌罗西书 4:9', hold: 6 },
    { text: '我保罗亲笔问你们安。你们要记念我的捆锁。<br>愿恩惠常与你们同在！', ref: '歌罗西书 4:18', hold: 6.5 },
  ];
  const V13 = [
    { text: '……就是为我在捆锁中所生的儿子阿尼西谋求你。<br>他从前与你没有益处，但如今与你我都有益处。', ref: '腓利门书 1:10–11', hold: 7 },
    { text: '他暂时离开你，或者是叫你永远得着他，<br>不再是奴仆，乃是高过奴仆，是亲爱的兄弟……', ref: '腓利门书 1:15–16', hold: 7 },
    { text: '你若以我为同伴，就收纳他，如同收纳我一样。', ref: '腓利门书 1:17', hold: 5 },
    { text: '愿我们主耶稣基督的恩常在你的心里。阿们！', ref: '腓利门书 1:25', hold: 5.5 },
  ];

  // 众人的一点光：一个一个亮起
  function kindle(b, ids, v, gap, t0) {
    return ids.map((id, i) => [t0 + i * gap, bb => { if (!live(id)) return; glow(id, v); ringFig(bb, id, [255, 234, 190], 1.3); }]);
  }
  const ALL_BELIEVERS = () => merged().concat(['paul', 'timothy', 'tychicus']);
  // 罗马人（腓 2:10「地上的」）：站在看得见的地方，不在屋后——
  // 桌面：屋左的城中（中丘）与邻楼前的街上（近地前景）；手机：屋左的城中与屋前的草地。[层, x, v]
  const ROMANS = () => (phone()
    ? [[1, 0.525, 0.04], [1, 0.585, 0.1], [2, 0.755, 0.64], [2, 0.82, 0.9], [2, 0.885, 0.68], [2, 0.95, 0.88]]
    : [[1, 0.528, 0.04], [1, 0.562, 0.12], [1, 0.612, 0.06], [2, 0.852, 0.56], [2, 0.876, 0.86], [2, 0.9, 0.64], [2, 0.924, 0.9], [2, 0.946, 0.6], [2, 0.968, 0.82]]);
  function romans(b) {
    const P = ROMANS();
    const ms = crowd('romans', { n: P.length, x0: 0.5, x1: 0.95, layer: 2, label: '罗马人', from: from(b), mill: false });
    if (!ms) return;
    const zx = zenith()[0] / W.w;
    ms.forEach((m, i) => {
      const q = P[i];
      if (!q) return;
      m.layer = q[0]; m.nx = q[1]; m.v = q[2]; m.tx = null;
      m.facing = m.fd = zx >= q[1] ? 1 : -1;   // 都朝着至高处
    });
  }
  function armRing(b, frac) { const p = figPt('paul', frac); if (p) ringAt(b, p[0], p[1], [255, 238, 200], p[2] * 1.1, 1.3); }
  function setArmor(v, b) { for (const k of ['prBelt', 'prPlate', 'prShoes', 'prShield', 'prHelm', 'prSword']) W.set(k, v, b.instant); }

  // ════════════════════════════════════════════════════════════
  //  话语：神的作为与话（弗 1:3；2:8；2:14；3:19；5:14 主说；6:17；腓 1:6；2:9；4:9；西 1:17；2:13；3:11；门 1:25）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 天上各样属灵的福气；圣灵的印记（弗 1）──────────────────
    {
      kind: 'bless', utter: '在基督里曾赐给我们天上各样属灵的福气', cmd: 'bless --scope 天上 --all  # 各样属灵的福气', ref: '1:3', tint: [255, 232, 176],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { W.goTo(0.36, 16, b.instant); W.set('prScroll', 0.3, b.instant); W.set('prWrite', 1, b.instant); sfx(b, 'write'); }],
          [3, b => { W.set('prWrite', 0, b.instant); }],
          [L[1] + 1.4, b => {
            W.set('prBless', 1, b.instant);
            blessFall(b);
            sfx(b, 'harp');
            sfx(b, 'stars', { soft: true });
          }],
          [L[2] + 2.2, b => {
            for (const id of ['paul', 'timothy', 'tychicus']) { glow(id, id === 'paul' ? 0.34 : 0.3); ringFig(b, id, [226, 236, 255], 1.6); }
            sfx(b, 'seal', { soft: true });
          }],
          [L[2] + 4.5, b => { W.set('prWrite', 1, b.instant); W.set('prScroll', 0.4, b.instant); }],
          [L[2] + 5.2, b => {
            // 来见他的人：几个灰暗的外邦人，走进院子，低头坐下（死在过犯罪恶之中，弗 2:1）
            G_IDS().forEach((id, i) => {
              add(id, { label: '外邦人', sex: G_SEX[i], age: G_AGE[i], x: px('exitL') + 0.012 * i, v: gV(i), facing: 1, robe: ROBE.grey, accent: [140, 138, 138], glow: 0.02, from: from(b) });
              walk(id, gX(i), { speed: 0.03, pose: 'sit' });
            });
          }],
          [L[2] + 6.5, b => { W.set('prWrite', 0, b.instant); }],
          [L[2] + 7.6, b => { W.set('prPall', 1, b.instant); }],
        ]);
      },
    },
    // ── 2 · 「你们得救是本乎恩，也因着信」（弗 2:1–10）───────────────
    {
      kind: 'act', utter: '你们得救是本乎恩，也因着信', cmd: 'grant 得救 --by 恩 --via 信  # 不是出于行为', ref: '2:8', tint: [255, 236, 196],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const G = G_IDS();
        const beats = [
          [0, b => { W.goTo(0.42, 14, b.instant); }],
          [L[0] + 2.6, b => {
            W.set('prPall', 0, b.instant);
            if (!b.instant) {
              const x = lerp(px('g0'), px('g1'), 0.5) * W.w;
              fxAdd({ k: 'beam', x, y0: 0, y1: fieldY(px('g0'), 0.6), w: (px('g1') - px('g0') + 0.08) * W.w, dur: 5, a: 0.7 });
            }
            sfx(b, 'harp');
          }],
        ];
        G.forEach((id, i) => beats.push([L[0] + 3.2 + i * 0.55, b => {
          add(id, { robe: G_ROBES[i], accent: G_ACC[i], glow: 0.26 });
          pose(id, 'stand');
          ringFig(b, id, [255, 236, 200], 1.3);
          sfx(b, 'chime', { soft: true });
        }]));
        beats.push([L[1] + 1, b => { W.set('prScroll', 0.5, b.instant); G.forEach(id => face(id, 1)); }]);
        beats.push([L[2] + 0.6, b => {
          W.set('prGift', 1, b.instant);
          G.forEach(id => pose(id, 'carry'));
          sfx(b, 'chime');
          G.forEach(id => { const p = figPt(id, 0.9); if (p) motes(b, p[0], p[1] - p[2] * 0.5, 6, GOLD, p[2] * 0.4, 16); });
        }]);
        beats.push([L[2] + 5.8, b => {
          W.set('prGift', 0, b.instant);
          G.forEach(id => { pose(id, 'stand'); glow(id, 0.34); ringFig(b, id, [255, 230, 180], 1.1); });
        }]);
        T(c, beats);
      },
    },
    // ── 3 · 拆毁了中间隔断的墙（弗 2:13–22）─────────────────────────
    {
      kind: 'act', utter: '将两下合而为一，拆毁了中间隔断的墙', cmd: 'rm 中间隔断的墙 && merge 两下 --into 一', ref: '2:14', tint: [255, 226, 180],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const G = G_IDS(), J = J_IDS(), Mg = merged();
        const beats = [
          [0, b => {
            W.goTo(0.47, 12, b.instant);
            W.set('prScroll', 0.6, b.instant);
            J.forEach((id, i) => add(id, { label: '犹太人', sex: J_SEX[i], age: J_AGE[i], x: jX(i), v: jV(i), facing: -1, robe: J_ROBES[i], accent: J_ACC[i],
              hair: J_SEX[i] === 'f' ? 'veil' : 'cloth', beard: J_SEX[i] === 'm', glow: 0.2, from: from(b) }));
            G.forEach(id => face(id, 1));
          }],
          [L[1] + 0.8, b => {
            S.wall = false;
            W.set('prWall', 0, b.instant);
            sfx(b, 'collapse', { soft: true });
            sfx(b, 'harp');
          }],
          [L[1] + 3.6, b => {
            Mg.forEach((id, k) => { walk(id, mX(k), { speed: 0.018 }); });
          }],
          [L[2] + 0.4, b => {
            Mg.forEach((id, k) => { face(id, k % 2 ? -1 : 1); });
            for (let i = 0; i + 1 < Mg.length; i += 2) hold(Mg[i], Mg[i + 1], true);
          }],
          [L[2] + 1.2, b => {
            W.set('prStone', 1, b.instant);
            const s = templePts()[0];
            ringAt(b, s[0], s[1] - 0.2 * PH(2), [255, 232, 180], PH(2) * 1.6, 1.6);
            sfx(b, 'bell', { soft: true });
          }],
          [L[2] + 2.4, b => {
            W.set('prHouseA', 1, b.instant);
            W.set('prHouse', 1, b.instant);
            sfx(b, 'harp');
          }],
        ];
        T(c, beats);
      },
    },
    // ── 4 · 长阔高深；一个身体，一个圣灵（弗 3 — 4:6）─────────────────
    {
      kind: 'act', utter: '这爱是过于人所能测度的', cmd: 'measure 爱 --dims 长,阔,高,深  # 过于人所能测度', ref: '3:19', tint: [255, 222, 190],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const Mg = merged();
        T(c, [
          [0, b => {
            W.goTo(0.7, 24, b.instant);
            W.set('prHouseA', 0, b.instant);
            W.set('prStone', 0, b.instant);
            for (let i = 0; i + 1 < Mg.length; i += 2) hold(Mg[i], Mg[i + 1], false);
          }],
          [1.2, b => { pose('paul', 'kneel'); W.set('prScroll', 0.7, b.instant); }],
          [L[1] + 0.6, b => {
            W.set('prLoveA', 1, b.instant);
            W.set('prLove', 1, b.instant);
            sfx(b, 'harp');
          }],
          [L[1] + 1.4, b => {
            if (b.instant) return;
            const G = loveGeo(), s = 0.05;
            wordsAt(b, '高', G.cx + M() * 0.06, G.top + W.h * 0.05, [255, 236, 200], { size: s, hold: 3.4 });
            wordsAt(b, '阔', W.w * 0.93, G.cy - W.h * 0.06, [255, 236, 200], { size: s, hold: 3.4, delay: 0.6 });
            wordsAt(b, '深', G.cx + M() * 0.06, W.h * (phone() ? 0.95 : 0.94), [255, 236, 200], { size: s, hold: 3.4, delay: 1.2 });
            wordsAt(b, '长', G.far[0], G.far[1] - W.h * 0.06, [255, 236, 200], { size: s, hold: 3.4, delay: 1.8 });
          }],
          [L[2] + 0.5, b => {
            W.set('prThreadA', 1, b.instant);
            W.set('prThread', 1, b.instant);
            sfx(b, 'chime');
          }],
          ...kindle(null, ALL_BELIEVERS(), 0.4, 0.25, L[2] + 1.5),
          [L[2] + 5.5, b => { pose('paul', 'seat'); }],
          [L[2] + 7.2, b => { W.set('prLoveA', 0, b.instant); W.set('prThreadA', 0, b.instant); }],
          [L[2] + 9.6, b => { W.set('prLove', 0, true); W.set('prThread', 0, true); }],
        ]);
      },
    },
    // ── 5 · 「你这睡着的人当醒过来」（弗 5）─────────────────────────
    {
      kind: 'call', utter: '你这睡着的人当醒过来，从死里复活', cmd: 'wake 睡着的人 --light 基督', ref: '5:14', tint: [236, 232, 255],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        const Mg = merged(), sl = SLEEP(), go = Mg.filter(id => sl.indexOf(id) < 0);
        T(c, [
          [0, b => {
            W.goTo(0.02, 8, b.instant);
            go.forEach((id, i) => walk(id, px('exitL') - 0.01 * i, { speed: 0.03 }));
          }],
          [2.6, b => {
            sl.forEach((id, i) => { walk(id, lerp(px('m0'), px('m1'), (i + 0.5) / sl.length), { speed: 0.02, pose: 'lie' }); });
            pose('guard', 'sit'); pose('tychicus', 'lie'); pose('timothy', 'lie');
          }],
          [6.2, b => { go.forEach(id => rm(id)); }],
          [L[1] + 0.8, b => {
            W.set('prShine', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 1.8, b => {
            sl.forEach(id => { pose(id, 'stand'); glow(id, 0.36); });
            pose('guard', 'stand'); pose('tychicus', 'stand'); pose('timothy', 'seat');
            W.set('prHand', 1, b.instant);
            sfx(b, 'chime');
          }],
          [L[1] + 2.4, b => { W.set('prCity', 1, b.instant); }],
          [L[2] + 0.6, b => {
            W.set('prShine', 0.25, b.instant);
            sl.forEach(id => pose(id, 'raise'));
            W.set('prSong', 1, b.instant);
            sfx(b, 'sing');
            if (!b.instant) sl.forEach(id => { const p = figPt(id, 1.1); if (p) for (let i = 0; i < 5; i++) fxAdd({ k: 'note', x: p[0], y: p[1], dur: 3 + Math.random() * 2, delay: i * 0.6 }); });
          }],
          [L[2] + 5.2, b => { sl.forEach(id => pose(id, 'stand')); W.set('prSong', 0, b.instant); W.set('prShine', 0, b.instant); W.set('prScroll', 0.85, b.instant); }],
        ]);
      },
    },
    // ── 6 · 神所赐的全副军装（弗 6）────────────────────────────────
    {
      kind: 'act', utter: '拿着圣灵的宝剑，就是神的道', cmd: 'equip 全副军装 --from 神  # 真理 公义 平安 信德 救恩 神的道', ref: '6:17', tint: [255, 240, 206],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        const nm = (b, str, row, col, delay) => {
          if (b.instant) return;
          const H = houseGeo(), ph = H.ph, sp = (phone() ? 1.6 : 1.95) * ph;
          const y = H.top - H.roofH - (row ? 1.35 : 0.45) * ph, cx = phone() ? W.w * 0.74 : H.cx;
          wordsAt(b, str, cx + (col - 1) * sp, y, [255, 238, 200], { size: 0.034, hold: 4.2, delay: delay || 0 });
        };
        T(c, [
          [0, b => { W.goTo(0.285, 12, b.instant); }],
          [4, b => { W.set('prHand', 0, b.instant); W.set('prCity', 0, b.instant); }],
          [L[0] + 1.2, b => {
            walk('paul', px('paulUp'), { speed: 0.008, pose: 'stand' });
            walk('guard', px('guardUp'), { speed: 0.008 });
            face('guard', -1);
          }],
          [L[1] + 0.6, b => { W.set('prBelt', 1, b.instant); armRing(b, 0.47); nm(b, '真理', 0, 0); sfx(b, 'chime', { soft: true }); }],
          [L[1] + 2.8, b => { W.set('prPlate', 1, b.instant); armRing(b, 0.66); nm(b, '公义', 0, 1); sfx(b, 'chime', { soft: true }); }],
          [L[1] + 5.0, b => { W.set('prShoes', 1, b.instant); armRing(b, 0.02); nm(b, '平安', 0, 2); sfx(b, 'chime', { soft: true }); }],
          [L[2] + 0.6, b => { W.set('prShield', 1, b.instant); armRing(b, 0.55); nm(b, '信德', 1, 0); sfx(b, 'bell', { soft: true }); }],
          [L[2] + 2.8, b => { W.set('prHelm', 1, b.instant); armRing(b, 0.93); nm(b, '救恩', 1, 1); sfx(b, 'bell', { soft: true }); }],
          [L[2] + 5.0, b => { W.set('prSword', 1, b.instant); armRing(b, 1.2); nm(b, '神的道', 1, 2); sfx(b, 'harp'); }],
          [L[3] + 0.4, b => { W.set('prChain', 1, b.instant); sfx(b, 'chains', { soft: true }); }],
          [L[3] + 3.4, b => {
            S.arm = true;
            walk('paul', px('paul'), { speed: 0.008, pose: 'seat' });
            walk('guard', px('guard'), { speed: 0.008 });
            face('paul', -1);
          }],
          [L[3] + 4.6, b => {
            S.sealed = 1;
            W.set('prScroll', 0, true);
            W.set('prChain', 0.25, b.instant);
            sfx(b, 'seal', { soft: true });
          }],
        ]);
      },
    },
    // ── 7 · 以巴弗提带来的馈送；御营全军（腓 1；4:18）──────────────
    {
      kind: 'promise', utter: '那在你们心里动了善工的，必成全这工', cmd: 'resume 善工 --until 耶稣基督的日子', ref: '腓立比书 1:6', tint: [255, 230, 196],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        const soldiers = phone() ? ['pg1'] : ['pg1', 'pg2'];
        T(c, [
          [0, b => {
            W.goTo(0.38, 14, b.instant);
            setArmor(0, b);
            face('paul', -1);
            W.set('prScroll', 0.15, b.instant);
          }],
          [0.6, b => {
            add('epaph', { label: '以巴弗提', sex: 'm', age: 'adult', x: px('epIn'), v: 0.26, facing: 1, robe: ROBE.ep, accent: ROBE.epAcc, beard: true, prop: 'bundle', glow: 0.22, from: from(b) });
            walk('epaph', px('ep'), { speed: 0.034 });
          }],
          [6.4, b => {
            S.gift = true;
            prop('epaph', null);
            face('epaph', 1);
            W.set('prIncense', 1, b.instant);
            sfx(b, 'chime');
          }],
          [L[1] + 1, b => {
            for (const id of ALL_BELIEVERS().concat(['epaph'])) { if (!live(id)) continue; glow(id, 0.42); ringFig(b, id, [255, 232, 186], 1.2); }
            sfx(b, 'harp');
          }],
          [L[2] + 0.4, b => {
            W.set('prIncense', 0, b.instant);
            soldiers.forEach((id, i) => { addSoldier(id, 1.02 + i * 0.03, phone() ? 0.55 : 0.12 + 0.18 * i, -1, b, { label: '御营的兵' }); walk(id, px(id), { speed: 0.03 }); });
            sfx(b, 'march', { soft: true });
          }],
          [L[2] + 4.6, b => { W.set('prChain', 1, b.instant); glow('guard', 0.3); ringFig(b, 'guard', [255, 226, 170], 1.4); sfx(b, 'chains', { soft: true }); }],
          ...soldiers.map((id, i) => [L[2] + 5.6 + i * 0.9, b => { glow(id, 0.28); ringFig(b, id, [255, 226, 170], 1.4); sfx(b, 'chime', { soft: true }); }]),
          [L[2] + 7.6, b => { W.set('prChain', 0.25, b.instant); W.set('prScroll', 0.35, b.instant); }],
        ]);
      },
    },
    // ── 8 · 虚己；「神将他升为至高」；万膝屈下（腓 2 — 3）─────────────
    {
      kind: 'act', utter: '神将他升为至高', cmd: 'exalt 他 --to 至高 && kneel --all', ref: '腓立比书 2:9', tint: [255, 244, 214],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        const people = () => ALL_BELIEVERS().concat(['guard', 'epaph', 'pg1', 'pg2']).filter(live);
        T(c, [
          [0, b => {
            W.goTo(0.46, 10, b.instant);
            W.set('prDesc', 0, true); W.set('prRise', 0, true);
            W.set('prDescA', 1, b.instant);
            W.set('prScroll', 0.45, b.instant);
          }],
          [0.8, b => { W.set('prDesc', 0.55, b.instant); sfx(b, 'angel', { soft: true }); }],
          [L[1] + 0.3, b => { W.set('prDesc', 1, b.instant); }],
          [L[1] + 1.2, b => { W.set('prCross', 1, b.instant); W.set('gloom', 0.32, b.instant); }],
          [L[1] + 4.4, b => { W.set('prDescA', 0.4, b.instant); }],
          [L[2] + 0.3, b => {
            W.set('prRise', 1, b.instant);
            W.set('prDescA', 1, b.instant);
            W.set('gloom', 0, b.instant);
            W.set('prCross', 0, b.instant);   // 光一升起，中丘上的十字架剪影就隐去（没有人对着罗马城里的十字架下拜）
            sfx(b, 'angel');
          }],
          [L[2] + 2.5, b => {
            W.set('prHigh', 1, b.instant);
            W.set('prHost', 1, b.instant);
            W.set('prDeep', 1, b.instant);
            const Z = zenith();
            ringAt(b, Z[0], Z[1], [255, 240, 210], M() * 0.35, 2.4);
            wordsAt(b, '耶稣', Z[0], Z[1] + W.h * (phone() ? 0.07 : 0.12), [255, 240, 206], { size: 0.05, hold: 4.4 });
            romans(b);
          }],
          [L[2] + 3.8, b => {
            for (const id of people()) pose(id, 'worship');
            crowdPose('romans', 'bow');
            W.set('prBowH', 1, b.instant);
            sfx(b, 'sing', { soft: true });
          }],
          [L[3] + 0.4, b => {
            for (const id of people()) pose(id, id === 'paul' || id === 'timothy' ? 'seat' : 'gaze');
            crowdPose('romans', 'gaze');
            W.set('prBowH', 0, b.instant);
            W.set('prDescA', 0, b.instant);
          }],
          [L[3] + 4.4, b => { for (const id of people()) if (id !== 'paul' && id !== 'timothy') pose(id, 'stand'); crowdPose('romans', 'stand'); W.set('prHost', 0.35, b.instant); }],
        ]);
      },
    },
    // ── 9 · 喜乐；出人意外的平安；以巴弗提带信回去（腓 4）─────────────
    {
      kind: 'promise', utter: '赐平安的神就必与你们同在', cmd: 'guard 心怀意念 --with 平安', ref: '腓立比书 4:9', tint: [255, 236, 206],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        const court = () => COURT().concat(['epaph', 'tychicus'].filter(live));
        T(c, [
          [0, b => {
            W.goTo(0.6, 16, b.instant);
            W.set('prHigh', 0, b.instant); W.set('prHost', 0, b.instant); W.set('prDeep', 0, b.instant);
            W.set('prRise', 0, true); W.set('prDesc', 0, true);
            uncrowd('romans');
            // 风起云聚（应当一无挂虑……）：天暗下来，风痕掠过院子，叶与尘被吹起，海上起白浪
            W.set('clouds', 0.9, b.instant); W.set('gale', 0.75, b.instant); W.set('storm', 0.42, b.instant);
            for (const id of ['pg1', 'pg2']) walk(id, 1.05, { speed: 0.03 });
            gusts(b, 0.2, L[1] + 1.4, phone() ? 26 : 46, [0.1, 0.95]);
            leaves(b, 0.6, L[1] + 1.6, phone() ? 18 : 32);
            sfx(b, 'wind');
          }],
          [L[0] + 0.5, b => { for (const id of court()) pose(id, 'raise'); sfx(b, 'timbrel', { soft: true }); motes(b, lerp(px('m0'), px('m1'), 0.5) * W.w, fieldY(px('m0'), 0.3) - 1.2 * PH(2), 18, GOLD, (px('m1') - px('m0')) * W.w, 30); }],
          [L[0] + 4.2, b => { for (const id of court()) pose(id, 'stand'); }],
          [5.5, b => { rm('pg1'); rm('pg2'); }],
          [L[1] + 2.2, b => {
            // 出人意外的平安：光穹罩住屋与院子，穹下风就止了（穹外的天上还有几道余风）
            W.set('prPeace', 1, b.instant);
            W.set('gale', 0, b.instant); W.set('clouds', 0.3, b.instant); W.set('storm', 0, b.instant);
            const P = peaceGeo();
            gusts(b, 0.1, 3.4, phone() ? 8 : 14, [0.08, 0.9], (x, y) => y > P.by - P.ry - 0.04 * W.h && x > P.cx - P.rx - 0.03 * W.w);
            sfx(b, 'harp');
          }],
          [L[2] + 0.5, b => { walk('epaph', px('door') , { speed: 0.02 }); W.set('prScroll', 0.8, b.instant); }],
          [L[2] + 3.4, b => { prop('epaph', 'bundle'); W.set('prScroll', 0, true); sfx(b, 'seal', { soft: true }); face('epaph', -1); }],
          [L[3] + 0.3, b => { walk('epaph', px('exitL'), { speed: 0.04 }); W.set('prPeace', 0.3, b.instant); }],
          [L[3] + 6.2, b => { rm('epaph'); }],
        ]);
      },
    },
    // ── 10 · 万有也靠他而立（西 1）──────────────────────────────────
    {
      kind: 'act', utter: '万有也靠他而立', cmd: 'hold 万有 --in 他', ref: '歌罗西书 1:17', tint: [255, 238, 200],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { W.goTo(0.755, 18, b.instant); W.set('prPeace', 0, b.instant); S.gift = false; W.set('prScroll', 0.2, b.instant); }],
          [L[0] + 1.2, b => { W.set('prOrb', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          [L[1] + 0.8, b => {
            W.set('prMake', 1, b.instant);
            W.setPop('bird', 26, W.w * 0.62, W.h * 0.45, b.instant);
            sfx(b, 'stars');
            if (!b.instant) for (let i = 0; i < 8; i++) fxAdd({ k: 'leap', x: W.w * (0.06 + 0.3 * Math.random()), y: W.h * (0.66 + 0.25 * Math.random()), dur: 1.2, delay: i * 0.7 + Math.random() * 0.4 });
          }],
          [L[2] + 0.6, b => { W.set('prHoldA', 1, b.instant); W.set('prHold', 1, b.instant); sfx(b, 'harp'); }],
          [L[3] + 0.8, b => {
            const O = orbPt();
            ringAt(b, O[0], O[1], [255, 236, 196], Math.hypot(W.w, W.h) * 0.8, 3.2);
            sfx(b, 'bell', { soft: true });
            for (const id of ALL_BELIEVERS()) if (live(id)) glow(id, 0.44);
            glow('guard', 0.34);
          }],
          [L[3] + 5, b => { W.set('prHoldA', 0.4, b.instant); }],
        ]);
      },
    },
    // ── 11 · 字据涂抹（西 2）；阿尼西谋 ──────────────────────────────
    {
      kind: 'act', utter: '神赦免了你们一切过犯', cmd: 'forgive --all && erase 字据', ref: '歌罗西书 2:13', tint: [248, 236, 220],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.795, 10, b.instant);
            W.set('prHoldA', 0, b.instant); W.set('prOrb', 0, b.instant); W.set('prMake', 0, b.instant);
            W.set('prShade', 1, b.instant);
            add('onesimus', { label: '阿尼西谋', sex: 'm', age: 'adult', x: px('oneFrom'), v: 0.03, facing: 1, robe: ROBE.slave, accent: [96, 90, 84], hair: 'short', beard: false, glow: 0.16, from: from(b) });
            walk('onesimus', px('oneK'), { speed: 0.042, pose: 'kneel' });
          }],
          [1.4, b => { W.set('prDebt', 1, b.instant); W.set('prErase', 0, true); W.set('prDebtUp', 0, true); W.set('prHold', 0, true); }],
          [7.6, b => {
            face('onesimus', 1);
            const p = figPt('onesimus', 1.3);
            if (p) wordsAt(b, '阿尼西谋', p[0], p[1] - p[2] * 0.3, [236, 226, 210], { size: 0.032, hold: 3.4 });
          }],
          [L[1] + 1.4, b => { W.set('prErase', 1, b.instant); sfx(b, 'chime'); }],
          [L[1] + 5.0, b => { W.set('prDebtUp', 1, b.instant); sfx(b, 'scroll'); }],
          // 字据一升起，保罗（锁着看守他的兵）就起身走到门口
          [L[1] + 5.5, b => {
            walk('paul', px('paulDoor'), { speed: 0.038, pose: 'stand' });
            walk('guard', px('guardDoor'), { speed: 0.038 });
          }],
          [L[2] + 2.4, b => { W.set('prDebt', 0, b.instant); }],
          [L[2] + 0.1, b => { pose('onesimus', 'stand'); face('onesimus', 1); }],
          [L[2] + 0.5, b => { W.set('prShade', 0, b.instant); const H = houseGeo(); ringAt(b, H.cx, H.base - H.ph, [255, 236, 200], M() * 0.5, 2.6); sfx(b, 'harp'); }],
          // 保罗扶起他，抱住他（至少停留四五秒，才到下一句）
          [L[2] + 1.0, b => {
            const c = C();
            if (c.embrace && live('paul') && live('onesimus')) c.embrace('onesimus', 'paul', { at: (px('oneK') + px('paulDoor')) / 2 });
            else { face('paul', -1); pose('paul', 'embrace'); face('onesimus', 1); pose('onesimus', 'embrace'); }
            glow('onesimus', 0.42); glow('paul', 0.46);
            ringFig(b, 'onesimus', [255, 230, 190], 1.4);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },
    // ── 12 · 惟有基督是包括一切；推基古和阿尼西谋坐船去了（西 3 — 4）──
    {
      kind: 'act', utter: '惟有基督是包括一切，又住在各人之内', cmd: 'include --all && dwell --in 各人', ref: '歌罗西书 3:11', tint: [255, 234, 200],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.34, 12, b.instant);
            W.set('prDebt', 0, b.instant);
            walk('onesimus', px('oneStand'), { speed: 0.02 });
            walk('paul', px('paul'), { speed: 0.012, pose: 'seat' });
            walk('guard', px('guard'), { speed: 0.012 });
            walk('tychicus', px('tychGo'), { speed: 0.02 });
            W.set('prScroll', 0.7, b.instant);
          }],
          [L[0] + 1.2, b => {
            const H = houseGeo();
            ringAt(b, H.cx, H.base - H.ph, [255, 234, 196], M() * 0.6, 2.8);
            for (const id of ALL_BELIEVERS().concat(['guard', 'onesimus'])) if (live(id)) glow(id, 0.42);
            sfx(b, 'harp');
          }],
          [L[1] + 0.5, b => { W.set('prVirtueA', 1, b.instant); W.set('prVirtue', 1, b.instant); sfx(b, 'chime', { soft: true }); }],
          [L[1] + 6.4, b => {
            add('onesimus', { robe: ROBE.one, accent: ROBE.oneAcc, glow: 0.44 });
            ringFig(b, 'onesimus', [255, 230, 180], 1.6);
            W.set('prVirtueA', 0, b.instant);
            sfx(b, 'bell', { soft: true });
          }],
          [L[1] + 8.4, b => { W.set('prVirtue', 0, true); }],
          [L[2] + 0.3, b => {
            S.boat = 'boarding';
            S.sealed = 0;
            prop('tychicus', 'bundle');
            walk('tychicus', px('dock'), { speed: 0.035 });
            walk('onesimus', px('dock') + 0.012, { speed: 0.035 });
            W.set('prScroll', 0, true);
            sfx(b, 'scroll', { soft: true });
          }],
          [L[2] + 3.2, b => { rm('tychicus'); rm('onesimus'); }],
          [L[2] + 3.6, b => { S.boat = 'sailing'; W.set('prBoat', 1, b.instant); sfx(b, 'wave', { soft: true }); }],
          // 船一开，保罗就走到门口；「你们要记念我的捆锁」时举起锁着的手（停留六秒上下）
          [L[2] + 3.8, b => {
            walk('paul', px('paulDoor'), { speed: 0.04, pose: 'stand' });
            walk('guard', px('guardDoor'), { speed: 0.04 });
          }],
          [L[3] + 0.5, b => {
            face('paul', -1);
            pose('paul', 'raise');
            W.set('prChain', 1, b.instant);
            sfx(b, 'chains', { soft: true });
          }],
          [L[3] + 6.2, b => { W.set('prChain', 0.3, b.instant); }],
        ]);
      },
    },
    // ── 13 · 歌罗西，腓利门的家：「亲爱的兄弟」；恩常在你的心里（门）────
    {
      kind: 'bless', utter: '愿我们主耶稣基督的恩常在你的心里', cmd: 'grace --in 你的心里 && receive 阿尼西谋 --as 兄弟', ref: '腓利门书 1:25', tint: [255, 230, 190],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => { W.set('prVeil', 1, b.instant); sfx(b, 'wave', { soft: true }); }],
          [1.7, b => {
            S.place = 'colossae';
            S.boat = 'gone';
            S.read = false;
            BLESS = null;
            const cc = C();
            cc.clear({ fade: false });
            uncrowd('romans', true);
            for (const k of ['prChain', 'prBoat', 'prScroll', 'prWrite', 'prPeace', 'prHoldA', 'prHold', 'prVirtue', 'prVirtueA', 'prStone', 'prIncense']) W.set(k, 0, true);
            W.goTo(0.64, 0, true);
            W.set('prLamps', 0, true);
            const ph = W.replaying;
            W.replaying = true;
            add('philemon', { label: '腓利门', sex: 'm', age: 'adult', x: px('phil'), v: 0.06, facing: -1, robe: ROBE.phil, accent: ROBE.philAcc, beard: true, glow: 0.3, from: 'none' });
            add('apphia', { label: '亚腓亚', sex: 'f', age: 'adult', x: px('apph'), v: 0.03, facing: -1, robe: ROBE.apph, glow: 0.26, from: 'none' });
            add('archippus', { label: '亚基布', sex: 'm', age: 'adult', x: px('arch'), v: 0.03, facing: -1, robe: ROBE.arch, accent: [214, 204, 180], hair: 'short', beard: false, glow: 0.24, from: 'none' });
            crowd('church', { n: phone() ? 3 : 5, x0: px('ch0'), x1: px('ch1'), layer: 2, v: 0.4, label: '在你家的教会', from: 'none', mill: false });
            add('tychicus', { label: '推基古', sex: 'm', age: 'adult', x: px('arrive'), v: 0.22, facing: 1, robe: ROBE.tych, accent: ROBE.tychAcc, beard: true, prop: 'bundle', glow: 0.32, from: 'none' });
            add('onesimus', { label: '阿尼西谋', sex: 'm', age: 'adult', x: px('arrive') - 0.02, v: 0.12, facing: 1, robe: ROBE.one, accent: ROBE.oneAcc, hair: 'short', beard: false, glow: 0.4, from: 'none' });
            W.replaying = ph;
          }],
          [2.5, b => { W.set('prVeil', 0, b.instant); W.goTo(0.7, 24, b.instant); }],
          [3.4, b => {
            walk('onesimus', px('oneMeet'), { speed: 0.032 });
            walk('tychicus', px('tychMeet'), { speed: 0.032 });
          }],
          [L[1] + 2.6, b => {
            pose('onesimus', 'kneel'); face('onesimus', 1);
            prop('tychicus', null);
            S.read = true;
            pose('philemon', 'carry'); face('philemon', -1);
            sfx(b, 'scroll', { soft: true });
          }],
          [L[2] + 0.6, b => {
            S.read = false;
            walk('philemon', px('philEmb'), { speed: 0.01, pose: 'embrace' });
            pose('onesimus', 'embrace');
            face('onesimus', 1);
            glow('onesimus', 0.5); glow('philemon', 0.44);
            ringFig(b, 'onesimus', [255, 232, 190], 1.8);
            sfx(b, 'harp');
          }],
          [L[3] + 0.5, b => {
            W.set('prGrace', 1, b.instant);
            W.set('prLamps', 1, b.instant);
            crowdPose('church', 'raise');
            pose('apphia', 'raise'); pose('archippus', 'raise');
            const H = houseGeo();
            ringAt(b, H.cx, H.base - H.ph, [255, 230, 186], M() * 0.55, 3);
            sfx(b, 'bell', { soft: true });
          }],
          [L[3] + 5.2, b => { crowdPose('church', 'stand'); pose('apphia', 'stand'); pose('archippus', 'stand'); }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, book: '监狱书信', books: [49, 50, 51, 57], title: '恩典', sub: '以弗所书 · 腓立比书 · 歌罗西书 · 腓利门书', tint: [240, 226, 200], music: 'kingdavid',
    intro: INTRO,
    outro: 24,
    behold: {
      '保罗': { text: '因我活着就是基督，我死了就有益处。', ref: '腓立比书 1:21' },
      '看守的兵': { text: '进了罗马城，保罗蒙准和一个看守他的兵另住在一处。', ref: '使徒行传 28:16' },
      '御营的兵': { text: '以致我受的捆锁在御营全军和其余的人中，已经显明是为基督的缘故。', ref: '腓立比书 1:13' },
      '提摩太': { text: '但你们知道提摩太的明证；他兴旺福音，与我同劳，待我像儿子待父亲一样。', ref: '腓立比书 2:22' },
      '推基古': { text: '今有所亲爱、忠心事奉主的兄弟推基古，他要把我的事情，并我的景况如何全告诉你们，叫你们知道。', ref: '以弗所书 6:21' },
      '以巴弗提': { text: '然而，我想必须打发以巴弗提到你们那里去。他是我的兄弟，与我一同做工，一同当兵，是你们所差遣的，也是供给我需用的。', ref: '腓立比书 2:25' },
      '阿尼西谋': { text: '不再是奴仆，乃是高过奴仆，是亲爱的兄弟。', ref: '腓利门书 1:16' },
      '腓利门': { text: '兄弟啊，我为你的爱心，大有快乐，大得安慰，因众圣徒的心从你得了畅快。', ref: '腓利门书 1:7' },
      '亚腓亚': { text: '和妹子亚腓亚并与我们同当兵的亚基布，以及在你家的教会。', ref: '腓利门书 1:2' },
      '亚基布': { text: '要对亚基布说：「务要谨慎，尽你从主所受的职分。」', ref: '歌罗西书 4:17' },
      '在你家的教会': { text: '和妹子亚腓亚并与我们同当兵的亚基布，以及在你家的教会。', ref: '腓利门书 1:2' },
      '外邦人': { text: '这奥秘就是外邦人在基督耶稣里，藉着福音，得以同为后嗣，同为一体，同蒙应许。', ref: '以弗所书 3:6' },
      '犹太人': { text: '并且来传和平的福音给你们远处的人，也给那近处的人。', ref: '以弗所书 2:17' },
      '罗马人': { text: '叫一切在天上的、地上的，和地底下的，因耶稣的名无不屈膝，', ref: '腓立比书 2:10' },
      '保罗的住处': { text: '保罗在自己所租的房子里住了足足两年。凡来见他的人，他全都接待，', ref: '使徒行传 28:30' },
      '书信': { text: '你们念了这书信，便交给老底嘉的教会，叫他们也念；你们也要念从老底嘉来的书信。', ref: '歌罗西书 4:16' },
      '灯': { text: '……你们显在这世代中，好像明光照耀，', ref: '腓立比书 2:15' },
      '锁链': { text: '我保罗亲笔问你们安。你们要记念我的捆锁。愿恩惠常与你们同在！', ref: '歌罗西书 4:18' },
      '馈送': { text: '但我样样都有，并且有余。我已经充足，因我从以巴弗提受了你们的馈送，当作极美的香气，为神所收纳、所喜悦的祭物。', ref: '腓立比书 4:18' },
      '罗马': { text: '众圣徒都问你们安。在凯撒家里的人特特地问你们安。', ref: '腓立比书 4:22' },
      '船': { text: '我特意打发他到你们那里去，好叫你们知道我们的光景，又叫他安慰你们的心。', ref: '歌罗西书 4:8' },
      '中间隔断的墙': { text: '因他使我们和睦，将两下合而为一，拆毁了中间隔断的墙；', ref: '以弗所书 2:14' },
      '房角石': { text: '并且被建造在使徒和先知的根基上，有基督耶稣自己为房角石，', ref: '以弗所书 2:20' },
      '字据': { text: '又涂抹了在律例上所写、攻击我们、有碍于我们的字据，把它撤去，钉在十字架上。', ref: '歌罗西书 2:14' },
      '腓利门的家': { text: '和妹子亚腓亚并与我们同当兵的亚基布，以及在你家的教会。', ref: '腓利门书 1:2' },
      '歌罗西': { text: '写信给歌罗西的圣徒，在基督里有忠心的弟兄。愿恩惠、平安从神我们的父归与你们！', ref: '歌罗西书 1:2' },
    },
    setup, stages: STAGES, scene: SCENE,
  });
})(window.GS);
