/* ─────────────────────────────────────────────────────────────
 * book/nativity.js —— 四福音 · 道成肉身（约翰福音 1 · 路加福音 1 — 2 · 马太福音 1 — 2）
 *
 * 新约的第一幕。幕启时天地一片昏暗，只有神的灵的一点光。
 * 「太初有道」——高天里点起一光，众星一颗颗出来，光照在黑暗里，拿撒勒的灯一盏盏亮起，天破晓。
 * 井边的马利亚：天使加百列自光中来——「主和你同在了！」；「耶稣」之名以光聚成。
 * 「出于神的话，没有一句不带能力的」——一团光明的云荫庇她；她跪下：「我是主的使女」，天使升去。
 * 她急忙往山地里去（拿撒勒隐去）：撒迦利亚的家，伊利莎白迎出来相拥，腹里的胎跳动；马利亚的颂歌里，四围开出花来。
 * 夜里，约瑟睡在门前，梦的光里有主的使者——「以马内利」以光聚成；天亮，他把马利亚娶过来。
 * 凯撒的旨意，众人各归各城；约瑟牵着驴，马利亚骑在驴上，拿撒勒渐渐隐去，伯利恒在暮色里出现；
 * 客店的门关上——「他到自己的地方来，自己的人倒不接待他」；他们回到城边石洞里的马棚。
 * 半夜，一道光自高天缓缓降下，落在洞里的马利亚身上；她生了头胎的儿子，用布包起来，俯身放在马槽里——
 * 「道成了肉身，住在我们中间」：包着布的婴孩在马槽里发光。（签名之景）
 * 野地里牧羊的人守着羊群与一堆火；主的使者站在旁边，主的荣光四面照着他们；
 * 一大队天兵布满夜空赞美神，又升天去了；牧羊的人急忙来到马槽前下跪；马利亚把这一切存在心里。
 * 一日过去，东方的星升起，三位博士骑着骆驼来；星在他们前头行，停在房子上头；他们俯伏，献上黄金、乳香、没药；
 * 「那光是真光」——光自孩子向四方漫开；他们从别的路回去。
 * 夜里主的使者在梦中叫约瑟起来；他举着火把，马利亚抱着孩子骑驴，往西去了。伯利恒的灯一盏一盏熄灭——
 * 希律的恶只以黑暗与寂静述说；西边天际一线温暖的光：「我从埃及召出我的儿子来」。
 * 春天，一家人回到拿撒勒；孩子在约瑟的工作台旁渐渐长大，「又有神的恩在他身上」。
 * 末了：耶路撒冷的殿，十二岁的孩子坐在教师中间；父母找到他——「岂不知我应当以我父的事为念吗？」——殿上落下光来；
 * 他同他们下去，暮色金黄。
 *
 * 神的显现（SPEC-NT §2）：父从不以形像出现——只有光、云与经文的声音；子是无面目的人（此幕是婴孩与孩子，
 * 用 GS.cast.LOOK.jesus 的衣色），由光与众人所向认出；圣灵是光（荫庇马利亚的光云）。
 * 天使是发光的人形；天兵是满天的光的人形。梦中的使者画在一团梦的光里。
 *
 * 画面的方位：左 = 东（海），右 = 西。拿撒勒在近地的中段（0.51–0.78），撒迦利亚的家在右边的山地（0.878）；
 *   伯利恒：城边石洞里的马棚（0.738）、房子（0.826）、客店（0.905）；野地在马棚的左边（0.50–0.67）；
 *   耶路撒冷的殿在右（0.76–0.99）。竖屏的手机上，近地的故事按比例收拢（PX）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'nativity';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LEVELS = {
    natWord: ['exp', 0.45],       // 太初有道：高天里的光
    natNaz: ['lin', 0.45],        // 拿撒勒（近地的房屋、井、工作台；中丘上的村子）
    natLiz: ['lin', 0.45],        // 撒迦利亚的家（犹大的山地）
    natFlowers: ['exp', 0.3],     // 马利亚的颂歌：四围开出的花
    natBet: ['lin', 0.42],        // 伯利恒（马棚、房子、客店）
    natTemple: ['lin', 0.42],     // 耶路撒冷的殿
    natLampN: ['exp', 0.5],       // 拿撒勒的灯
    natLampB: ['lin', 0.12],      // 伯利恒的灯（熄灭时一盏接一盏，约七秒灭尽）
    natInn: ['exp', 0.9],         // 客店的门：1 开 · 0 关
    natStable: ['exp', 0.6],      // 马棚里的灯
    natShadow: ['exp', 0.4],      // 至高者的能力要荫庇你：光明的云
    natDream: ['exp', 0.55],      // 梦中的光与使者
    natDescend: ['lin', 0.3],     // 自高天降下的光（0 天顶 → 1 落在马利亚身上）
    natColumn: ['exp', 0.5],      // 那道光柱的亮
    natBirth: ['exp', 0.35],      // 马槽里婴孩的光
    natFire: ['exp', 0.9],        // 牧羊人的火
    natGlory: ['exp', 0.7],       // 主的荣光四面照着他们
    natPoint: ['exp', 0.6],       // 使者所指：一线光通到马槽
    natHost: ['exp', 0.45],       // 一大队天兵
    natStar: ['exp', 0.5],        // 东方的星
    natStarGo: ['lin', 0.11],     // 星在他们前头行（0 东方 → 1 房子上头）
    natStarBeam: ['exp', 0.45],   // 星停住，光落在房子上
    natGifts: ['exp', 0.8],       // 黄金、乳香、没药
    natEgypt: ['exp', 0.3],       // 西边天际的一线光
    natGrace: ['exp', 0.45],      // 神的恩在他身上
    natTempleLight: ['exp', 0.4], // 殿上落下的光
  };
  for (const k in LEVELS) W.defineLevel(k, LEVELS[k][0], LEVELS[k][1]);
  const lv = k => W.lv[k] || 0;

  // ── 地上的位置（画面宽度的比例；宽屏）──────────────────────
  const XL = {
    // 拿撒勒
    maryDoor: 0.541, maryWell: 0.592, well: 0.607, gabriel: 0.64, josDoor: 0.674, josSleep: 0.676, bench: 0.731,
    // 撒迦利亚的家（犹大的山地）
    lizH: 0.878, lizDoor: 0.859, meetM: 0.812, meetE: 0.832,
    // 伯利恒
    stable: 0.738, manger: 0.743, maryK: 0.724, josS: 0.764, ox: 0.79, donkeyS: 0.706,
    oxIn: 0.721, donkeyIn: 0.694, donkeyR: 0.822,   // 牛与驴：生产时驴在牛旁（洞的右边，马槽左边留给牧羊人）；博士来时都挪到洞的左边
    house: 0.826, houseDoor: 0.806, josHouse: 0.832, josSleep2: 0.782, innStop: 0.868,
    // 野地
    fire: 0.573, sh1: 0.543, sh2: 0.601, sh3: 0.566, angel: 0.637, flock0: 0.497, flock1: 0.672,
    shK1: 0.672, shK2: 0.688, shK3: 0.704,
    // 博士
    camel1: 0.665, camel2: 0.62, camel3: 0.575, mK1: 0.787, mK2: 0.771, mK3: 0.755, gifts: 0.797,
    // 耶路撒冷
    tmp0: 0.762, tmp1: 0.99, t1: 0.742, t2: 0.761, t3: 0.812, t4: 0.832, boy: 0.787, pil0: 0.88, pil1: 0.975,
    seekM: 0.708, seekJ: 0.69,
  };
  const X = Object.assign({}, XL);
  let PORT = false;
  // 竖屏：近地左端低而陡，故事整体稍往右挪（画面以外的进出之处不变）
  const PX = x => (!PORT || x >= 1 || x <= 0 ? x : x - 0.035);
  function layout() {
    PORT = W.w < W.h * 0.9;
    for (const k in XL) X[k] = PX(XL[k]);
  }

  // 布景（宽屏的比例；画时经 PX）：房屋 { x, w, h（以人的身高计）, tone, door, win, stairs, lamp, floors, skipPort }
  const NAZ = [
    { x: 0.512, w: 1.2, h: 0.92, tone: [170, 146, 114], door: 0.2, win: -0.22, stairs: -1, lamp: 0.7, skipPort: true },
    { x: 0.556, w: 1.45, h: 1.1, tone: [188, 162, 126], door: -0.3, win: 0.24, lamp: 1 },
    { x: 0.648, w: 1.12, h: 0.84, tone: [160, 138, 110], door: 0.14, win: -0.24, lamp: 0.8 },
    { x: 0.69, w: 1.45, h: 1.06, tone: [178, 152, 118], door: -0.3, win: 0.26, stairs: 1, lamp: 1 },
    { x: 0.786, w: 1.25, h: 0.95, tone: [166, 142, 112], door: -0.2, win: 0.22, lamp: 0.9, east: true },
  ];
  const LIZ = [{ x: 0.878, w: 1.6, h: 1.18, tone: [206, 188, 152], door: -0.3, win: 0.22, lamp: 1, yard: 1 }];
  const BET = [
    { x: 0.826, w: 1.4, h: 1.06, tone: [182, 156, 120], door: -0.3, win: 0.24, lamp: 1, stairs: 1 },
    { x: 0.905, w: 2.1, h: 1.72, tone: [170, 146, 114], door: -0.3, win: 0.2, lamp: 1, floors: 2, inn: true },
    { x: 0.975, w: 1.2, h: 0.9, tone: [160, 138, 108], door: -0.2, win: 0.2, lamp: 0.9, skipPort: true },
  ];
  // 橄榄树：[x, 大小, 所属]
  const OLIVES = [
    [0.586, 0.9, 'naz'], [0.742, 1.0, 'naz'], [0.838, 0.95, 'nazE'],
    [0.935, 1.05, 'liz'], [0.99, 0.9, 'liz'],
    [0.528, 1.0, 'bet'], [0.645, 0.9, 'bet'],
    [0.545, 0.95, 'tmp'], [0.618, 1.05, 'tmp'], [0.685, 0.9, 'tmp'],
  ];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { babe: 0, hostGo: 0, fire: 0, dreamX: 0.676, dreamDir: 1, grow: 0.86 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const PH = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * (LK[l] || 1);   // 人的身高（约与人物模块一致）
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const rimA = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.55 * W.night);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const port = () => W.w < W.h * 0.9;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const lit = c => [Math.min(255, c[0] * 1.2 + 22), Math.min(255, c[1] * 1.17 + 18), Math.min(255, c[2] * 1.12 + 14)];
  const LOOK = () => (GS.cast && GS.cast.LOOK) || {};
  const look = (key, o) => Object.assign({}, LOOK()[key] || {}, o);

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return c && (c.has ? c.has(id) : !!(c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  const FIGK = () => (PORT ? 1.12 : 1);      // 竖屏上人物再大些（与人物模块在手机上的放大相乘）
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, has(id) ? {} : { scale: FIGK() }, o)); }
  function beast(id, o) { const c = C(); if (!c.animal) return null; return c.animal(id, Object.assign({ from: W.replaying ? 'none' : 'fade', scale: FIGK() }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x, layer) { if (has(id)) C().place(id, x, layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function babe(id, what) { const c = C(); if (c.carry && has(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.holdHands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function ride(id, m) { const c = C(); if (c.ride && has(id)) U.safe('cast.ride', () => c.ride(id, m)); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && has(id)) c.fly(id, x, y, o); }
  // 走到某处便隐去（重演时直接移去）
  function leave(id, x, o) {
    if (!has(id)) return;
    if (W.replaying) { rm(id, true); return; }
    walk(id, x, o);
    const f = fig(id);
    if (f) f.fadeOnArrive = true;
  }
  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    if (PORT) ms.forEach(m => { m.scale = (m.scale || 1) * FIGK(); });
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  const TRAV = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [104, 96, 110], [140, 96, 80], [158, 138, 108], [96, 104, 118]];
  const dressAs = (pal, v0, v1, sexes) => (m, i) => {
    m.sex = sexes ? sexes[i % sexes.length] : (i % 3 === 1 ? 'f' : 'm');
    m.age = i % 5 === 3 ? 'elder' : 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.hairOpt = null;
    if (m.age === 'elder') { m.prop = null; m.beardOpt = true; }
    m.v = lerp(v0, v1, (i * 0.618) % 1);
  };

  // 声音（瞬间重演时不放）
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.72, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - PH(l) * k];
  }
  // 名字以光在人的上方、干净的天上聚成（大小 ≥ 0.03·min(W,H)）
  function nameOver(b, xf, yTop, str, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length, u = SU();
    const size = Math.max(M() * 0.05, Math.min(o.size || 56 * u, (W.w * 0.7) / (n * 1.08)));
    let cy = Math.min(yTop - 70 * u, W.horizonY - 30 * u) - size * 0.55;
    cy = Math.max(cy, (port() ? W.h * 0.34 : W.h * 0.14) + size * 0.5);
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(xf * W.w, half + 8, W.w - half - 8);
    const sx = xf * W.w, sy = yTop;
    fx().nameStr(str, cx, cy, size, o.rgb || [255, 230, 170], () => [sx + (Math.random() - 0.5) * 50 * u, sy + (Math.random() - 0.3) * 30 * u], { hold: o.hold || 3.2 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  function sparkleAt(b, x, y, n, rgb, spread) {
    if (b.instant || !fx()) return;
    fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], (spread || 14) * SU(), 'top');
  }
  function sparkleOn(b, id, n, rgb, frac) { const h = headOf(id, frac == null ? 0.6 : frac); sparkleAt(b, h[0], h[1], n, rgb); }
  function ringAt(b, x, y, rgb, r, dur, w) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 190], r || M() * 0.25, dur || 2.2, w || 1.6); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, o) {                // 自天而降的一道光，落在某处（近地）
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, v: o.v || 0, w: (o.w || 70) * SU(), k: o.k || 1 });
    if (o.ring !== false && fx()) fx().ring(xf * W.w, baseY(2, xf, o.v || 0) - 16 * SU(), o.rgb || [255, 236, 190], M() * (o.r || 0.24), 2.2, 1.8);
  }

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
  function vbeam(c0, c1) {
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, c0); hz.addColorStop(0.5, c1); hz.addColorStop(1, c0);
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return b;
  }
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([226, 232, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        soft: radial([255, 240, 214], 1, 0.6), rose: radial([255, 214, 190], 1, 0.45), cream: radial([255, 232, 196], 1, 0.55),
        beam: vbeam('rgba(255,244,214,0)', 'rgba(255,247,226,1)'),
        star: vbeam('rgba(236,240,255,0)', 'rgba(246,248,255,1)'),
      };
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;   // 当前绘制的画布（glowAt 用）
  function glowAt(img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  // 火焰（火堆、灯、火把）
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.2, k * (0.3 + 0.45 * nightK()));
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
  // 发光的人形（天兵、梦中的使者）
  function lightFigure(ctx, x, y, h, a, seed) {
    if (a < 0.01 || h < 0.8 || !SP) return;
    ctx.globalAlpha = Math.min(1, a * 0.45);
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = Math.min(1, a);
    ctx.fillStyle = 'rgb(255,250,236)';
    const sw = Math.sin(W.t * 1.7 + seed) * 0.03 * h;
    ctx.beginPath();
    ctx.moveTo(x - 0.17 * h, y);
    ctx.quadraticCurveTo(x - 0.13 * h + sw, y - 0.45 * h, x - 0.075 * h, y - 0.78 * h);
    ctx.lineTo(x + 0.075 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.13 * h + sw, y - 0.45 * h, x + 0.17 * h, y);
    ctx.closePath();
    ctx.moveTo(x + 0.078 * h, y - 0.88 * h); ctx.arc(x, y - 0.88 * h, 0.078 * h, 0, TAU);
    ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  画：房屋（平顶的土屋 / 石屋；屋外的石阶；夜里门窗透出灯光）
  // ════════════════════════════════════════════════════════════
  const WINDOWS = [];   // 本帧各屋的窗（灯光在 air 层再补一层）
  function house(ctx, l, x, g, w, h, tone, o) {
    o = o || {};
    const s = h / 40, d = litX() >= x ? 1 : -1, hw = w / 2, lo = h < 24;
    const gl = gY(l, (x - hw) / W.w), gr = gY(l, (x + hw) / W.w);
    const y0 = Math.min(gl, gr, g) + 2 * s;
    const gLo = Math.max(gl, gr, g);
    // 坡上的屋：低的一边砌石接到地
    if (gLo > y0 + 1) {
      ctx.fillStyle = css(mix(tone, [118, 106, 90], 0.5), l);
      ctx.beginPath();
      ctx.moveTo(x - hw - s, y0); ctx.lineTo(x + hw + s, y0); ctx.lineTo(x + hw + s, gr + 3 * s); ctx.lineTo(x, g + 3 * s); ctx.lineTo(x - hw - s, gl + 3 * s);
      ctx.closePath(); ctx.fill();
    }
    // 屋外的石阶（通到屋顶）
    if (o.stairs) {
      const sx = x + o.stairs * hw, dir = o.stairs, sh = h * 0.92, sl = 0.5 * h;
      ctx.fillStyle = css(mix(tone, [96, 82, 66], 0.3), l);
      ctx.beginPath(); ctx.moveTo(sx, y0 - sh); ctx.lineTo(sx + dir * sl, y0); ctx.lineTo(sx, y0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css(lit(tone), l, 0.35 * rimA(), 0.05);
      ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      for (let i = 1; i < 6; i++) { const f = i / 6; ctx.moveTo(sx + dir * sl * f, y0 - sh * (1 - f)); ctx.lineTo(sx + dir * sl * f - dir * 3 * s, y0 - sh * (1 - f)); }
      ctx.stroke();
    }
    // 屋身
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - hw, y0 - h, w, h + 1);
    // 背光的一面
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), l, 0.85);
    const sw = w * 0.2;
    ctx.fillRect(d > 0 ? x - hw : x + hw - sw, y0 - h, sw, h + 1);
    // 墙上的斑驳（泥灰补过的几块）
    ctx.fillStyle = css(mix(tone, [220, 206, 178], 0.25), l, 0.35);
    for (let i = 0; i < (lo ? 0 : 3); i++) {
      const px = x - hw + w * (0.2 + 0.6 * hsh(x * 0.013 + i * 3.1)), py = y0 - h * (0.2 + 0.6 * hsh(x * 0.021 + i * 5.3));
      ctx.fillRect(px, py, w * 0.12, h * 0.06);
    }
    // 屋顶：出檐的一道、梁头、矮墙
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.32), l);
    ctx.fillRect(x - hw - 1.5 * s, y0 - h - 2.6 * s, w + 3 * s, 2.8 * s);
    ctx.fillStyle = css([74, 58, 44], l, 0.9);
    const nb = lo ? 0 : Math.max(3, Math.round(w / (7 * s)));
    for (let i = 0; i < nb; i++) ctx.fillRect(x - hw + (i + 0.5) * w / nb - 0.8 * s, y0 - h + 0.2 * s, 1.6 * s, 1.6 * s);
    ctx.fillStyle = css(mix(tone, [96, 80, 62], 0.22), l);
    ctx.fillRect(x - hw - 1.5 * s, y0 - h - 5 * s, w + 3 * s, 1.2 * s);
    ctx.fillRect(x - hw - 1.5 * s, y0 - h - 6.2 * s, 2.4 * s, 3.8 * s);
    ctx.fillRect(x + hw - 0.9 * s, y0 - h - 6.2 * s, 2.4 * s, 3.8 * s);
    // 门（拱顶）与窗
    const floors = o.floors || 1, fh = h / floors;
    const dx = x + (o.door || 0) * w, dw = Math.min(0.22 * fh, 0.2 * w) * (o.inn ? 1.3 : 1), dh = Math.min(0.58 * fh, h - 4 * s);
    const lamp = (o.lamp || 0) * clamp(nightK() * 1.25, 0, 1);
    const open = o.open == null ? 1 : o.open;
    ctx.fillStyle = css([34, 26, 20], l);
    ctx.beginPath(); ctx.moveTo(dx - dw / 2, y0); ctx.lineTo(dx - dw / 2, y0 - dh + dw / 2); ctx.arc(dx, y0 - dh + dw / 2, dw / 2, Math.PI, 0); ctx.lineTo(dx + dw / 2, y0); ctx.closePath(); ctx.fill();
    // 门扇（客店：关门）
    if (open < 0.999) {
      ctx.fillStyle = css([92, 68, 48], l);
      const cw = dw * (1 - open);
      ctx.fillRect(dx - dw / 2, y0 - dh + dw / 2, cw, dh - dw / 2);
      ctx.fillStyle = css([70, 52, 38], l, 0.8);
      for (let i = 1; i < 3; i++) ctx.fillRect(dx - dw / 2 + cw * i / 3 - 0.3 * s, y0 - dh + dw / 2, 0.6 * s, dh - dw / 2);
    }
    const wins = [];
    for (let f = 0; f < floors; f++) {
      const wy = y0 - fh * f - fh * 0.72;
      const list = floors > 1 ? (f === 0 ? [0.22, 0.36] : [-0.3, -0.05, 0.2, 0.38]) : [o.win || 0.28];
      for (const wf of list) wins.push([x + wf * w, wy]);
    }
    const ws = Math.max(1.6, 0.085 * fh);
    ctx.fillStyle = css([30, 24, 20], l);
    for (const q of wins) ctx.fillRect(q[0] - ws / 2, q[1] - ws / 2, ws, ws * 1.15);
    // 迎光的边
    ctx.strokeStyle = css([255, 240, 214], l, 0.42 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - hw - 1.5 * s, y0 - h - 5 * s); ctx.lineTo(x + hw + 1.5 * s, y0 - h - 5 * s);
    if (d > 0) { ctx.moveTo(x + hw, y0 - h); ctx.lineTo(x + hw, y0); } else { ctx.moveTo(x - hw, y0 - h); ctx.lineTo(x - hw, y0); }
    ctx.stroke();
    // 灯（夜里）：窗与门透出暖光
    if (lamp > 0.02 && SP) {
      const a0 = ctx.globalAlpha;
      const fl = 0.86 + 0.14 * Math.sin(W.t * 5.3 + x * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,176,96)';
      wins.forEach((q, i) => {
        const on = o.lampN == null ? 1 : (i + 0.5) / wins.length <= o.lampN + 0.001 ? 1 : 0;
        if (!on) return;
        ctx.globalAlpha = Math.min(1, lamp * fl * 0.9) * a0;
        ctx.fillRect(q[0] - ws / 2, q[1] - ws / 2, ws, ws * 1.15);
        glowAt(SP.warm, q[0], q[1], ws * 3.2, lamp * fl * 0.4 * a0);
      });
      if (open > 0.02) {
        ctx.globalAlpha = Math.min(1, lamp * fl * 0.55 * open) * a0;
        ctx.fillRect(dx - dw / 2, y0 - dh + dw / 2, dw, dh - dw / 2);
        glowAt(SP.warm, dx, y0 - dh * 0.45, dh * 1.1, lamp * fl * 0.35 * open * a0);
      } else {
        ctx.globalAlpha = Math.min(1, lamp * fl * 0.6) * a0;
        ctx.fillRect(dx - dw / 2 + dw * 0.02, y0 - dh + dw / 2, Math.max(0.6, 0.5 * s), dh - dw / 2);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a0;
    }
    // 客店：门里、窗里挤满的人（小小的暗影）
    if (o.inn) {
      ctx.fillStyle = css([28, 22, 18], l, 0.9);
      const hr = Math.max(1, ws * 0.28);
      wins.forEach((q, i) => {
        if (i % 2 === 1) return;
        ctx.beginPath(); ctx.arc(q[0] - ws * 0.1, q[1] - ws * 0.05, hr, 0, TAU); ctx.fill();
        ctx.fillRect(q[0] - ws * 0.1 - hr * 1.3, q[1] + hr * 0.7, hr * 2.6, ws * 0.4);
      });
      if (open > 0.3) {
        const hx = dx + dw * 0.1, hy = y0 - dh * 0.62;
        ctx.globalAlpha = (ctx.globalAlpha || 1) * open;
        ctx.beginPath(); ctx.arc(hx, hy, dw * 0.16, 0, TAU); ctx.fill();
        ctx.fillRect(hx - dw * 0.24, hy + dw * 0.12, dw * 0.48, dh * 0.55);
        ctx.globalAlpha = 1;
      }
    }
    return { y0, dx, dh };
  }
  // 中丘上的村镇（远处的小屋高高低低挤在坡上，屋间几丛树；夜里有灯）
  const TOWN_TONES = [[196, 176, 142], [174, 150, 118], [214, 204, 184], [158, 136, 108], [188, 164, 128]];
  const TOWN = new Map();
  function townModel(seed, x0, x1) {
    const key = seed + '|' + x0 + '|' + x1 + '|' + (PORT ? 1 : 0);
    let m = TOWN.get(key);
    if (m) return m;
    const r = U.mulberry32(seed), n = PORT ? 7 : 12;
    m = [];
    for (let i = 0; i < n; i++) {
      const t = (i + 0.1 + r() * 0.8) / n;
      m.push({ t, w: 0.65 + 0.7 * r(), h: 0.42 + 0.42 * r(), lift: r() < 0.4 ? 0.18 + 0.3 * r() : 0, tone: TOWN_TONES[Math.floor(r() * TOWN_TONES.length)],
        door: r() < 0.5 ? -0.22 : 0.22, win: r() < 0.5 ? -0.26 : 0.26, lamp: r() < 0.7 ? 1 : 0, tree: r() < 0.45, tx: r() });
    }
    m.sort((a, b) => b.lift - a.lift);
    TOWN.set(key, m);
    return m;
  }
  function town(ctx, l, x0, x1, seed, A, lampK) {
    const ph = PH(l), m = townModel(seed, x0, x1);
    // 屋间的树丛（在屋后）
    ctxA.globalAlpha = A;
    ctx.fillStyle = css([72, 92, 64], l, 0.95);
    ctx.beginPath();
    for (const q of m) {
      if (!q.tree) continue;
      const xf = PX(x0 + (x1 - x0) * Math.min(1, q.t + 0.02 + 0.03 * q.tx));
      if (!W.hasLandBase(l, xf * W.w, 4)) continue;
      const x = xf * W.w, g = gY(l, xf), rr = ph * (0.3 + 0.18 * q.tx);
      ctx.moveTo(x + rr, g - rr * 0.9); ctx.ellipse(x, g - rr * 0.9, rr, rr * 0.8, 0, 0, TAU);
      ctx.moveTo(x + rr * 1.1, g - rr * 0.6); ctx.ellipse(x + rr * 0.6, g - rr * 0.6, rr * 0.6, rr * 0.55, 0, 0, TAU);
    }
    ctx.fill();
    for (const q of m) {
      const xf = PX(x0 + (x1 - x0) * q.t);
      if (!W.hasLandBase(l, xf * W.w, 4)) continue;
      ctxA.globalAlpha = A;
      house(ctx, l, xf * W.w, gY(l, xf), q.w * ph, (q.h + q.lift) * ph, q.tone, { door: q.door, win: q.win, lamp: lampK * q.lamp });
    }
    ctxA.globalAlpha = 1;
  }

  // ── 井（拿撒勒）──────────────────────────────────────────
  function drawWell(ctx, A) {
    const l = 2, p = PH(l), x = X.well * W.w, g = gY(l, X.well) + 0.02 * p;
    const w = 0.62 * p, h = 0.27 * p;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([150, 138, 120], l);
    ctx.fillRect(x - w / 2, g - h, w, h);
    ctx.fillStyle = css([118, 108, 94], l, 0.8);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) {
      const bx = x - w / 2 + (k + (r % 2) * 0.5) * w / 4, by = g - h + r * h / 3;
      ctx.fillRect(Math.min(bx, x + w / 2 - 1), by, 0.8, h / 3);
    }
    ctx.fillStyle = css([40, 34, 30], l);
    ctx.beginPath(); ctx.ellipse(x, g - h, w / 2, h * 0.22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([176, 164, 144], l, 1, 0.05); ctx.lineWidth = Math.max(0.8, 0.05 * p);
    ctx.beginPath(); ctx.ellipse(x, g - h, w / 2, h * 0.22, 0, Math.PI, TAU); ctx.stroke();
    // 木架、横梁、绳与水罐
    ctx.strokeStyle = css([96, 72, 50], l); ctx.lineWidth = Math.max(1, 0.05 * p);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, g - h); ctx.lineTo(x - w * 0.36, g - 0.78 * p);
    ctx.moveTo(x + w * 0.42, g - h); ctx.lineTo(x + w * 0.36, g - 0.78 * p);
    ctx.moveTo(x - w * 0.45, g - 0.76 * p); ctx.lineTo(x + w * 0.45, g - 0.76 * p);
    ctx.stroke();
    ctx.strokeStyle = css([150, 130, 100], l, 0.8); ctx.lineWidth = Math.max(0.5, 0.012 * p);
    ctx.beginPath(); ctx.moveTo(x + w * 0.05, g - 0.76 * p); ctx.lineTo(x + w * 0.05, g - h - 0.12 * p); ctx.stroke();
    ctx.fillStyle = css([176, 118, 74], l);
    ctx.beginPath(); ctx.ellipse(x + w * 0.05, g - h - 0.08 * p, 0.05 * p, 0.06 * p, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ── 木匠的工作台（约瑟的家旁）──────────────────────────────
  function drawBench(ctx, A) {
    const l = 2, p = PH(l), x = X.bench * W.w, g = gY(l, X.bench) + 0.03 * p;
    const w = 0.72 * p, top = g - 0.34 * p;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([98, 72, 48], l); ctx.lineWidth = Math.max(1, 0.045 * p);
    ctx.beginPath();
    for (const sx of [-0.38, 0.38]) { ctx.moveTo(x + sx * w - 0.06 * p, g); ctx.lineTo(x + sx * w + 0.03 * p, top); ctx.moveTo(x + sx * w + 0.06 * p, g); ctx.lineTo(x + sx * w - 0.03 * p, top); }
    ctx.stroke();
    ctx.fillStyle = css([150, 112, 72], l);
    ctx.fillRect(x - w / 2, top - 0.05 * p, w, 0.06 * p);
    ctx.fillStyle = css([184, 146, 96], l, 1, 0.05);
    ctx.fillRect(x - w * 0.3, top - 0.1 * p, w * 0.55, 0.05 * p);
    // 靠着的木板与地上的刨花
    ctx.fillStyle = css([140, 104, 68], l);
    ctx.beginPath(); ctx.moveTo(x + w * 0.52, g); ctx.lineTo(x + w * 0.62, g); ctx.lineTo(x + w * 0.5, g - 0.55 * p); ctx.lineTo(x + w * 0.44, g - 0.54 * p); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([214, 186, 140], l, 0.8);
    for (let i = 0; i < 7; i++) ctx.fillRect(x + (hsh(i * 3.3) - 0.5) * w * 1.1, g - 0.02 * p + hsh(i * 7.1) * 0.03 * p, 0.05 * p, 0.018 * p);
    ctx.strokeStyle = css(lit([150, 112, 72]), l, rimA(), 0.05); ctx.lineWidth = Math.max(0.5, 0.012 * p);
    ctx.beginPath(); ctx.moveTo(x - w / 2, top - 0.05 * p); ctx.lineTo(x + w / 2, top - 0.05 * p); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // ── 橄榄树 ──────────────────────────────────────────────────
  function drawOlive(ctx, xf, s, A) {
    const l = 2, hm = PH(l), x = xf * W.w, g = gY(l, xf) + 2, H = 1.9 * hm * s;
    const sd = litX() < x ? -1 : 1;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([78, 66, 54], l);
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
    ctx.fillStyle = css([88, 104, 74], l, 0.97);
    ctx.beginPath();
    for (let k = 0; k < 13; k++) {
      const a = (k / 12) * Math.PI, rr = 0.75 + 0.25 * hsh(k * 2.7 + xf * 13);
      const ex = x + Math.cos(Math.PI - a) * cw * 0.62 * rr, ey = cy - Math.sin(a) * ch * 0.9 * rr + (hsh(k + 3) - 0.5) * ch * 0.3;
      const r0 = cw * (0.13 + 0.07 * hsh(k * 5.1 + 1));
      ctx.moveTo(ex + r0, ey); ctx.arc(ex, ey, r0, 0, TAU);
    }
    ctx.moveTo(x + cw * 0.45, cy); ctx.ellipse(x, cy, cw * 0.45, ch * 0.7, 0, 0, TAU);
    ctx.fill();
    ctx.fillStyle = css([176, 188, 156], l, 0.5, 0.05);
    ctx.beginPath();
    for (let k = 0; k < 16; k++) {
      const a = Math.PI * (0.15 + 0.7 * hsh(k * 3.3 + 2)), rr = 0.45 + 0.5 * hsh(k * 1.9 + 7);
      const ex = x + Math.cos(Math.PI - a) * cw * 0.6 * rr + sd * cw * 0.08, ey = cy - Math.sin(a) * ch * 1.05 * rr;
      const r0 = cw * (0.035 + 0.03 * hsh(k + 11));
      ctx.moveTo(ex + r0, ey); ctx.ellipse(ex, ey, r0, r0 * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([52, 62, 46], l, 0.35);
    ctx.beginPath(); ctx.ellipse(x - sd * cw * 0.15, cy + ch * 0.35, cw * 0.5, ch * 0.28, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ── 撒迦利亚家的院墙与四围的花 ────────────────────────────
  function drawYard(ctx, A) {
    const l = 2, p = PH(l), x0 = PX(0.905) * W.w, x1 = Math.min(W.w + 10, PX(0.99) * W.w);
    ctx.globalAlpha = A;
    ctx.fillStyle = css([184, 168, 136], l);
    ctx.beginPath();
    const n = 10;
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(l, x / W.w) - 0.3 * p; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); ctx.lineTo(x, gY(l, x / W.w) + 2); }
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  const FLOWER_COL = [[244, 211, 94], [232, 106, 146], [246, 241, 231], [154, 127, 224], [240, 150, 120]];
  function drawFlowers(ctx, A) {
    if (A < 0.01) return;
    const l = 2, p = PH(l), n = PORT ? 36 : 60;
    for (let i = 0; i < n; i++) {
      const xf = PX(0.74 + 0.25 * hsh(i * 3.7 + 1)), v = 0.03 + 0.5 * hsh(i * 5.9 + 2);
      const grow = clamp(A * 1.6 - hsh(i * 1.3 + 9) * 0.6, 0, 1);
      if (grow < 0.02) continue;
      const x = xf * W.w, y = baseY(l, xf, v), hgt = (0.1 + 0.12 * hsh(i * 2.1)) * p * (1 + 0.35 * v) * grow;
      ctx.strokeStyle = css([78, 118, 60], l, 0.9); ctx.lineWidth = Math.max(0.5, 0.012 * p);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.01 * p, y - hgt); ctx.stroke();
      const c = FLOWER_COL[i % FLOWER_COL.length];
      ctx.fillStyle = css(c, l, 1, 0.12);
      const r = (0.028 + 0.02 * hsh(i * 4.4)) * p * (1 + 0.35 * v) * grow;
      ctx.beginPath(); ctx.arc(x + 0.01 * p, y - hgt, r, 0, TAU); ctx.fill();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：伯利恒城边的马棚（石洞、草棚、灯、马槽与婴孩）
  // ════════════════════════════════════════════════════════════
  function stableGeom() {
    const l = 2, p = PH(l) * (PORT ? 0.9 : 1.1), x = X.stable * W.w, g = gY(l, X.stable);
    return { l, p, x, g, mx: X.manger * W.w, mg: gY(l, X.manger) + 0.04 * p };
  }
  function drawStable(ctx, A) {
    const G = stableGeom(), { l, p, x, g } = G;
    ctx.globalAlpha = A;
    // 石：一堆起伏的岩
    const x0 = x - 1.45 * p, x1 = x + 1.5 * p, top = g - 1.5 * p;
    ctx.fillStyle = css([120, 106, 90], l);
    ctx.beginPath();
    ctx.moveTo(x0, gY(l, x0 / W.w) + 3);
    ctx.bezierCurveTo(x0 + 0.1 * p, g - 0.9 * p, x0 + 0.5 * p, top + 0.1 * p, x - 0.3 * p, top);
    ctx.bezierCurveTo(x + 0.2 * p, top - 0.12 * p, x + 0.8 * p, top + 0.05 * p, x + 1.05 * p, g - 1.1 * p);
    ctx.bezierCurveTo(x + 1.35 * p, g - 0.85 * p, x1, g - 0.4 * p, x1, gY(l, x1 / W.w) + 3);
    ctx.closePath(); ctx.fill();
    // 岩上的纹与背光
    ctx.fillStyle = css([92, 80, 68], l, 0.6);
    ctx.beginPath(); ctx.ellipse(x + 0.7 * p, g - 0.75 * p, 0.55 * p, 0.35 * p, -0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = css(lit([120, 106, 90]), l, rimA() * 0.9, 0.05); ctx.lineWidth = Math.max(0.8, 0.03 * p);
    ctx.beginPath();
    ctx.moveTo(x0 + 0.3 * p, g - 0.95 * p); ctx.bezierCurveTo(x0 + 0.5 * p, top + 0.1 * p, x - 0.6 * p, top, x - 0.3 * p, top);
    ctx.bezierCurveTo(x + 0.2 * p, top - 0.12 * p, x + 0.8 * p, top + 0.05 * p, x + 1.05 * p, g - 1.1 * p);
    ctx.stroke();
    // 洞口：拱形的暗
    const cx = x - 0.02 * p, cw = 1.35 * p, ch = 1.08 * p;
    ctx.fillStyle = css([38, 30, 24], l);
    ctx.beginPath(); ctx.moveTo(cx - cw / 2, g + 2); ctx.bezierCurveTo(cx - cw / 2, g - ch * 0.9, cx - cw * 0.25, g - ch, cx, g - ch);
    ctx.bezierCurveTo(cx + cw * 0.25, g - ch, cx + cw / 2, g - ch * 0.9, cx + cw / 2, g + 2); ctx.closePath(); ctx.fill();
    // 洞里的暖光（灯与婴孩）
    const warm = Math.max(lv('natStable') * clamp(nightK() * 1.3, 0.25, 1), lv('natBirth'));
    if (warm > 0.01 && SP) {
      ctx.save();
      ctx.beginPath(); ctx.moveTo(cx - cw / 2, g + 2); ctx.bezierCurveTo(cx - cw / 2, g - ch * 0.9, cx - cw * 0.25, g - ch, cx, g - ch);
      ctx.bezierCurveTo(cx + cw * 0.25, g - ch, cx + cw / 2, g - ch * 0.9, cx + cw / 2, g + 2); ctx.closePath(); ctx.clip();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, cx + 0.1 * p, g - 0.5 * p, 1.1 * p, warm * 0.55 * A);
      glowAt(SP.gold, X.manger * W.w, g - 0.3 * p, 0.9 * p, lv('natBirth') * 0.6 * A);
      ctx.restore();
      ctx.globalAlpha = A;
    }
    // 草棚：两根柱、一道梁、斜的草顶
    ctx.strokeStyle = css([92, 70, 48], l); ctx.lineWidth = Math.max(1, 0.06 * p);
    ctx.beginPath();
    ctx.moveTo(cx - 0.78 * p, g + 1); ctx.lineTo(cx - 0.74 * p, g - 1.02 * p);
    ctx.moveTo(cx + 0.74 * p, g + 1); ctx.lineTo(cx + 0.7 * p, g - 1.02 * p);
    ctx.moveTo(cx - 0.92 * p, g - 1.02 * p); ctx.lineTo(cx + 0.86 * p, g - 1.02 * p);
    ctx.stroke();
    ctx.fillStyle = css([150, 124, 78], l);
    ctx.beginPath();
    ctx.moveTo(cx - 1.02 * p, g - 0.98 * p); ctx.lineTo(cx + 0.96 * p, g - 0.98 * p); ctx.lineTo(cx + 0.72 * p, g - 1.24 * p); ctx.lineTo(cx - 0.8 * p, g - 1.26 * p); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([188, 160, 104], l, 0.7, 0.05); ctx.lineWidth = Math.max(0.5, 0.012 * p);
    ctx.beginPath();
    for (let i = 0; i < 16; i++) { const f = i / 15, bx = lerp(cx - 0.98 * p, cx + 0.92 * p, f); ctx.moveTo(bx, g - 0.98 * p); ctx.lineTo(bx + (hsh(i) - 0.5) * 0.05 * p - 0.03 * p, g - 1.22 * p); }
    ctx.stroke();
    // 地上的草
    ctx.strokeStyle = css([204, 176, 110], l, 0.85, 0.05); ctx.lineWidth = Math.max(0.5, 0.014 * p);
    ctx.beginPath();
    for (let i = 0; i < 26; i++) { const bx = cx + (hsh(i * 2.3) - 0.5) * 1.5 * p, by = g + hsh(i * 4.1) * 0.04 * p; ctx.moveTo(bx, by); ctx.lineTo(bx + (hsh(i * 7.7) - 0.5) * 0.12 * p, by - 0.05 * p); }
    ctx.stroke();
    // 挂在梁上的灯
    const lk = lv('natStable');
    const lx = cx + 0.22 * p, ly = g - 0.86 * p;
    ctx.strokeStyle = css([60, 48, 36], l); ctx.lineWidth = Math.max(0.5, 0.01 * p);
    ctx.beginPath(); ctx.moveTo(lx, g - 1.02 * p); ctx.lineTo(lx, ly - 0.03 * p); ctx.stroke();
    ctx.fillStyle = css([150, 110, 70], l);
    ctx.beginPath(); ctx.ellipse(lx, ly, 0.06 * p, 0.025 * p, 0, 0, TAU); ctx.fill();
    if (lk > 0.02) flame(ctx, lx + 0.03 * p, ly - 0.01 * p, 0.07 * p, lk * A, 3.3);
    // 马槽
    drawManger(ctx, G, A);
    ctx.globalAlpha = 1;
  }
  function drawManger(ctx, G, A) {
    const { l, p, mx, mg } = G;
    const w = 0.56 * p, top = mg - 0.36 * p, th = 0.15 * p;
    ctx.globalAlpha = A;
    ctx.strokeStyle = css([100, 74, 50], l); ctx.lineWidth = Math.max(1, 0.04 * p);
    ctx.beginPath();
    for (const sx of [-0.36, 0.36]) { ctx.moveTo(mx + sx * w - 0.08 * p, mg); ctx.lineTo(mx + sx * w + 0.06 * p, top + th * 0.5); ctx.moveTo(mx + sx * w + 0.08 * p, mg); ctx.lineTo(mx + sx * w - 0.06 * p, top + th * 0.5); }
    ctx.stroke();
    // 马槽里的婴孩：包着布（在槽里，身子的上半露在槽沿之上）
    if (S.babe && SP) drawBundle(ctx, G, A, false);
    // 槽身：上宽下窄，槽沿有草
    ctx.fillStyle = css([128, 96, 64], l);
    ctx.beginPath(); ctx.moveTo(mx - w / 2, top); ctx.lineTo(mx + w / 2, top); ctx.lineTo(mx + w * 0.4, top + th); ctx.lineTo(mx - w * 0.4, top + th); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([96, 72, 48], l, 0.7);
    ctx.fillRect(mx - w * 0.42, top + th * 0.45, w * 0.84, Math.max(0.6, 0.02 * p));
    ctx.strokeStyle = css([214, 186, 118], l, 0.9, 0.08); ctx.lineWidth = Math.max(0.5, 0.013 * p);
    ctx.beginPath();
    for (let i = 0; i < 12; i++) { const sx = mx - w * 0.46 + i * w * 0.084; ctx.moveTo(sx, top + 0.005 * p); ctx.lineTo(sx + (hsh(i * 3.1) - 0.5) * 0.08 * p, top - 0.05 * p); }
    ctx.stroke();
    ctx.strokeStyle = css(lit([128, 96, 64]), l, rimA() + 0.25 * lv('natBirth'), 0.1); ctx.lineWidth = Math.max(0.5, 0.015 * p);
    ctx.beginPath(); ctx.moveTo(mx - w / 2, top); ctx.lineTo(mx + w / 2, top); ctx.stroke();
  }
  // 包着布的婴孩（马槽里）：布包、小小的头、几道裹布的带子。
  // over = true：在光之上再画一遍（air 层），好让发光时仍看得出是一个包着布的婴孩（只画槽沿以上的部分）
  function drawBundle(ctx, G, A, over) {
    const { l, p, mx, mg } = G;
    const top = mg - 0.36 * p, bx = mx, by = top - 0.02 * p, bl = 0.34 * p, bh = 0.1 * p;
    const nb = lv('natBirth');
    if (over) {
      ctx.save();
      ctx.beginPath(); ctx.rect(bx - bl, by - bh * 2, bl * 2, top - (by - bh * 2) + 0.004 * p); ctx.clip();
    }
    ctx.globalAlpha = A;
    ctx.fillStyle = over ? 'rgb(250,242,224)' : css([236, 228, 210], l, 1, 0.18 + 0.4 * nb);
    ctx.beginPath(); ctx.ellipse(bx - 0.03 * p, by, bl / 2, bh / 2, -0.06, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + bl * 0.42, by - bh * 0.18, bh * 0.5, 0, TAU); ctx.fill();
    // 布包的轮廓与裹布的带子（发光时要深一些才看得出）
    const lw = Math.max(0.6, 0.014 * p);
    ctx.lineWidth = lw;
    if (over) {
      ctx.strokeStyle = 'rgba(176,138,92,0.6)';
      ctx.beginPath(); ctx.ellipse(bx - 0.03 * p, by, bl / 2, bh / 2, -0.06, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
      ctx.beginPath(); ctx.arc(bx + bl * 0.42, by - bh * 0.18, bh * 0.5, Math.PI * 1.1, Math.PI * 1.95); ctx.stroke();
    }
    ctx.strokeStyle = over ? 'rgba(196,160,112,0.85)' : css([200, 186, 160], l, 0.8, 0.1);
    ctx.lineWidth = over ? Math.max(0.8, 0.018 * p) : Math.max(0.5, 0.012 * p);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { const sx = bx - bl * 0.3 + i * bl * 0.18; ctx.moveTo(sx, by - bh * 0.45); ctx.lineTo(sx + bl * 0.06, by + bh * 0.45); }
    ctx.stroke();
    if (over) ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：野地里牧羊人的火
  // ════════════════════════════════════════════════════════════
  function firePos() { const p = PH(2), xf = X.fire, v = 0.1; return { p, x: xf * W.w, y: baseY(2, xf, v), s: 1 + 0.35 * v }; }
  function drawFireBase(ctx, A) {
    const { p, x, y, s } = firePos();
    ctx.globalAlpha = A;
    ctx.fillStyle = css([110, 100, 88], 2);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 0.16 * p * s, y - 0.01 * p + Math.sin(a) * 0.02 * p, 0.045 * p * s, 0.03 * p * s, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = css([70, 52, 36], 2); ctx.lineWidth = Math.max(1, 0.035 * p);
    ctx.beginPath(); ctx.moveTo(x - 0.12 * p, y); ctx.lineTo(x + 0.1 * p, y - 0.06 * p); ctx.moveTo(x + 0.12 * p, y); ctx.lineTo(x - 0.08 * p, y - 0.07 * p); ctx.stroke();
    const k = lv('natFire');
    if (k > 0.02) flame(ctx, x, y - 0.02 * p, 0.3 * p * s, k * A, 7.1);
    ctx.globalAlpha = 1;
  }
  function drawFireGlow(ctx, A) {
    const k = lv('natFire') * A;
    if (k < 0.02 || !SP) return;
    const { p, x, y } = firePos();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, x, y - 0.2 * p, 1.9 * p, k * (0.18 + 0.4 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 7)));
    // 火星（只是装饰）
    ctx.fillStyle = 'rgb(255,200,120)';
    for (let i = 0; i < 6; i++) {
      const ph = U.fract(W.t * 0.45 + i / 6);
      ctx.globalAlpha = k * (1 - ph) * 0.8 * nightK();
      ctx.fillRect(x + Math.sin(i * 2.3 + W.t) * 0.12 * p, y - 0.3 * p - ph * 0.9 * p, 1.4, 1.4);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：黄金、乳香、没药（放在孩子面前）
  // ════════════════════════════════════════════════════════════
  function drawGifts(ctx) {
    const A = lv('natGifts') * lv('natBet');
    if (A < 0.01 || !SP) return;
    const p = PH(2), v = 0.34, xf = X.gifts, x = xf * W.w, y = baseY(2, xf, v), s = (1 + 0.35 * v);
    const q = 0.16 * p * s;
    ctx.globalAlpha = A;
    // 黄金：小匣
    const gx = x - 1.3 * q;
    ctx.fillStyle = css([214, 170, 70], 2, 1, 0.2);
    ctx.fillRect(gx - q * 0.6, y - q * 0.7, q * 1.2, q * 0.7);
    ctx.fillStyle = css([236, 196, 96], 2, 1, 0.25);
    ctx.fillRect(gx - q * 0.66, y - q * 0.86, q * 1.32, q * 0.2);
    // 乳香：一只小碗，香烟袅袅
    const fxx = x, fy = y;
    ctx.fillStyle = css([170, 140, 110], 2, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(fxx - q * 0.55, fy - q * 0.45); ctx.quadraticCurveTo(fxx, fy + q * 0.25, fxx + q * 0.55, fy - q * 0.45); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(236,230,240,' + (0.35 * A).toFixed(3) + ')'; ctx.lineWidth = Math.max(0.8, 0.02 * p);
    ctx.beginPath();
    for (let i = 0; i < 2; i++) {
      const ph = W.t * 0.8 + i * 2.1;
      ctx.moveTo(fxx + i * q * 0.2, fy - q * 0.5);
      ctx.bezierCurveTo(fxx + Math.sin(ph) * q * 0.5, fy - q * 1.3, fxx - Math.sin(ph * 1.3) * q * 0.6, fy - q * 2.1, fxx + Math.sin(ph * 0.7) * q * 0.4, fy - q * 3.0);
    }
    ctx.stroke();
    // 没药：一只小瓶
    const mx = x + 1.3 * q;
    ctx.fillStyle = css([120, 72, 60], 2, 1, 0.12);
    ctx.beginPath(); ctx.moveTo(mx - q * 0.18, y - q * 1.05); ctx.lineTo(mx + q * 0.18, y - q * 1.05); ctx.quadraticCurveTo(mx + q * 0.6, y - q * 0.5, mx + q * 0.3, y); ctx.lineTo(mx - q * 0.3, y); ctx.quadraticCurveTo(mx - q * 0.6, y - q * 0.5, mx - q * 0.18, y - q * 1.05); ctx.closePath(); ctx.fill();
    // 微光
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, gx, y - q * 0.5, q * 2.2, A * (0.35 + 0.15 * Math.sin(W.t * 2.1)));
    glowAt(SP.amber, x, y - q * 0.4, q * 3, A * 0.25);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：耶路撒冷的殿（白石的殿、廊子、金边；殿外的院）
  // ════════════════════════════════════════════════════════════
  const STONE = [224, 210, 182], STONE_D = [176, 160, 134], GOLD = [230, 190, 100];
  function drawTemple(ctx, A) {
    const l = 2, p = PH(l) * (PORT ? 0.85 : 1);
    const x0 = X.tmp0 * W.w, x1 = Math.min(W.w + 6, X.tmp1 * W.w);
    const g0 = gY(l, X.tmp0), g1 = gY(l, x1 / W.w);
    const base = Math.min(g0, g1, gY(l, (x0 + x1) / 2 / W.w)) - 0.28 * p;   // 殿台的顶
    const lo = Math.max(g0, g1) + 3;
    ctx.globalAlpha = A;
    // 殿台（石层）
    ctx.fillStyle = css(STONE_D, l);
    ctx.fillRect(x0 - 0.1 * p, base, x1 - x0 + 0.2 * p, lo - base);
    ctx.strokeStyle = css(mix(STONE_D, [90, 80, 66], 0.4), l, 0.5); ctx.lineWidth = Math.max(0.5, 0.012 * p);
    ctx.beginPath();
    for (let r = 1; r < 4; r++) { const y = base + r * 0.09 * p; if (y > lo) break; ctx.moveTo(x0 - 0.1 * p, y); ctx.lineTo(x1 + 0.1 * p, y); }
    ctx.stroke();
    // 台阶（在殿台的左端）
    ctx.fillStyle = css(mix(STONE, STONE_D, 0.5), l);
    for (let i = 0; i < 4; i++) { const sx = x0 - 0.1 * p - (4 - i) * 0.1 * p; ctx.fillRect(sx, base + (i) * 0.07 * p, x0 - sx, lo - base - i * 0.07 * p); }
    // 廊子：平的额枋与一排柱
    const px0 = x0 + 0.15 * p, px1 = x0 + (x1 - x0) * 0.5, ph = 1.3 * p, pt = base - ph;
    ctx.fillStyle = css(mix(STONE_D, [60, 50, 40], 0.4), l);
    ctx.fillRect(px0, pt, px1 - px0, ph);
    const nc = Math.max(5, Math.round((px1 - px0) / (0.36 * p)));
    ctx.fillStyle = css(STONE, l);
    for (let i = 0; i <= nc; i++) { const cx = lerp(px0 + 0.05 * p, px1 - 0.05 * p, i / nc); ctx.fillRect(cx - 0.05 * p, pt + 0.1 * p, 0.1 * p, ph - 0.1 * p); }
    ctx.fillRect(px0 - 0.08 * p, pt - 0.02 * p, px1 - px0 + 0.16 * p, 0.14 * p);
    ctx.fillStyle = css(GOLD, l, 0.9, 0.1);
    ctx.fillRect(px0 - 0.08 * p, pt - 0.05 * p, px1 - px0 + 0.16 * p, 0.035 * p);
    // 圣所：高的殿身，正面一道大门（门里是幔子的颜色）
    const sx0 = px1 - 0.05 * p, sx1 = x1 - 0.1 * p, sh = 3.1 * p, st = base - sh;
    ctx.fillStyle = css(STONE, l);
    ctx.fillRect(sx0, st, sx1 - sx0, sh);
    ctx.fillStyle = css(mix(STONE, [40, 32, 28], 0.3), l, 0.85);
    const shw = (sx1 - sx0) * 0.18;
    ctx.fillRect(litX() >= (sx0 + sx1) / 2 ? sx0 : sx1 - shw, st, shw, sh);
    // 门
    const dcx = sx0 + (sx1 - sx0) * 0.45, dw = Math.min(0.75 * p, (sx1 - sx0) * 0.3), dh = 1.8 * p;
    ctx.fillStyle = css(GOLD, l, 0.95, 0.08);
    ctx.fillRect(dcx - dw / 2 - 0.06 * p, base - dh - 0.08 * p, dw + 0.12 * p, dh + 0.08 * p);
    ctx.fillStyle = css([92, 62, 96], l);
    ctx.fillRect(dcx - dw / 2, base - dh, dw, dh);
    ctx.fillStyle = css([140, 54, 60], l, 0.8);
    ctx.fillRect(dcx - dw / 2, base - dh, dw * 0.33, dh);
    ctx.fillStyle = css([60, 70, 128], l, 0.8);
    ctx.fillRect(dcx + dw * 0.17, base - dh, dw * 0.33, dh);
    // 门上的金葡萄树（一串小点）
    ctx.fillStyle = css(GOLD, l, 1, 0.2);
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(dcx - dw * 0.6 + i * dw * 0.15, base - dh - 0.2 * p - Math.sin(i * 1.3) * 0.04 * p, 0.03 * p, 0, TAU); ctx.fill(); }
    // 顶上的金边与小尖
    ctx.fillStyle = css(GOLD, l, 1, 0.15);
    ctx.fillRect(sx0 - 0.06 * p, st - 0.06 * p, sx1 - sx0 + 0.12 * p, 0.08 * p);
    for (let i = 0; i <= 10; i++) { const tx = lerp(sx0, sx1, i / 10); ctx.fillRect(tx - 0.012 * p, st - 0.16 * p, 0.024 * p, 0.1 * p); }
    // 迎光的边
    ctx.strokeStyle = css([255, 244, 220], l, 0.5 * dayA(), 0.25); ctx.lineWidth = Math.max(0.6, 0.02 * p);
    ctx.beginPath(); ctx.moveTo(sx0, st); ctx.lineTo(sx1, st); ctx.moveTo(px0, pt); ctx.lineTo(px1, pt); ctx.moveTo(x0 - 0.1 * p, base); ctx.lineTo(x1, base); ctx.stroke();
    // 夜里：廊下的灯
    const lk = clamp(nightK() * 1.3, 0, 1) * A;
    if (lk > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 1; i < nc; i += 2) glowAt(SP.warm, lerp(px0, px1, i / nc), base - 0.5 * p, 0.35 * p, lk * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    return { x0, x1, sx0, sx1, st, base, dcx };
  }
  // 中丘上的耶路撒冷：城墙与城楼，墙后的房屋
  function drawCityMid(ctx, A) {
    const l = 1, p = PH(l);
    const x0 = PX(0.58) * W.w, x1 = PX(0.97) * W.w;
    town(ctx, l, 0.6, 0.95, 91, A * 0.9, 1);
    ctx.globalAlpha = A;
    ctx.fillStyle = css([188, 172, 142], l);
    ctx.beginPath();
    const n = 18;
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(l, x / W.w) - 0.55 * p; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); ctx.lineTo(x, gY(l, x / W.w) + 2); }
    ctx.closePath(); ctx.fill();
    for (let i = 0; i < 5; i++) {
      const x = lerp(x0, x1, (i + 0.5) / 5), y = gY(l, x / W.w);
      ctx.fillRect(x - 0.22 * p, y - 0.95 * p, 0.44 * p, 0.95 * p);
    }
    ctx.strokeStyle = css([255, 240, 214], l, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.03 * p);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(l, x / W.w) - 0.55 * p; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：天上与光（道的光、光云、光柱、荣光、天兵、星、梦、恩）
  // ════════════════════════════════════════════════════════════
  const wordPt = () => [PX(0.66) * W.w, W.h * (PORT ? 0.36 : 0.2)];
  function drawWord(ctx) {
    const k = lv('natWord');
    if (k < 0.005 || !SP) return;
    const [x, y] = wordPt(), u = SU(), m = M();
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.92 + 0.08 * Math.sin(W.t * 1.3);
    glowAt(SP.soft, x, y, m * 0.42 * k, k * 0.26);
    glowAt(SP.gold, x, y, 110 * u * (0.6 + 0.4 * k) * br, k * 0.55);
    glowAt(SP.white, x, y, 26 * u * br, Math.min(1, k * 1.2));
    // 光芒：细长、缓缓转动（十二道，长短相间）
    ctx.strokeStyle = 'rgb(255,244,220)';
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + W.t * 0.03, L = (i % 2 ? 90 : 170) * u * (0.7 + 0.3 * Math.sin(W.t * 0.7 + i * 1.9)) * (0.5 + 0.5 * k);
      ctx.globalAlpha = k * 0.12 * (0.6 + 0.4 * Math.sin(W.t * 0.9 + i * 1.7));
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 14 * u, y + Math.sin(a) * 14 * u); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 至高者的能力荫庇她：马利亚上方一团光明的云，一道柔光落在她身上
  // 白天加亮的光要收着些（不然成了一团刺眼的白斑）：夜里 1，白天约 0.45
  const dimDay = () => 0.45 + 0.55 * nightK();
  function drawShadow(ctx) {
    const k = lv('natShadow');
    if (k < 0.005 || !SP) return;
    const f = fig('mary');
    const p = PH(2), x = f && f._vis ? f._x : X.maryWell * W.w, g = f && f._vis ? f._y : baseY(2, X.maryWell, 0.12);
    const cy = g - 1.6 * p, dk = k * dimDay(), day = 1 - nightK();
    // 光明的云：几团分开的、暖白的云（白天以常色画出才看得见；夜里再加一层光）
    const puffs = [];
    for (let i = 0; i < 6; i++) {
      const a = W.t * 0.18 + i * 1.05, ox = (i - 2.5) * 0.3 * p + Math.cos(a) * 0.07 * p;
      const oy = Math.sin(a * 1.3 + i) * 0.06 * p - (i === 2 || i === 3 ? 0.12 * p : i === 0 || i === 5 ? -0.05 * p : 0);
      puffs.push([x + ox, cy + oy, p * (0.3 + 0.12 * hsh(i * 3.1))]);
    }
    // 云下一道柔光落在她身上（白天先以常色铺一层淡淡的光柱）
    if (day > 0.02) {
      ctx.globalAlpha = Math.min(1, k * 0.3 * day);
      ctx.drawImage(SP.beam, x - 0.34 * p, cy, 0.68 * p, g - cy + 0.08 * p);
      for (const q of puffs) glowAt(SP.cream, q[0], q[1], q[2] * 1.3, k * 0.85 * day, 0.62);
    }
    ctx.globalCompositeOperation = 'lighter';
    // 宽的一层淡光，中间一道窄而亮的芯
    ctx.globalAlpha = Math.min(1, dk * 0.4);
    ctx.drawImage(SP.beam, x - 0.9 * p, cy, 1.8 * p, g - cy + 0.12 * p);
    ctx.globalAlpha = Math.min(1, dk * 0.5);
    ctx.drawImage(SP.beam, x - 0.26 * p, cy, 0.52 * p, g - cy + 0.08 * p);
    for (const q of puffs) glowAt(SP.cream, q[0], q[1], q[2], dk * 0.3, 0.7);
    glowAt(SP.soft, x, cy, 1.3 * p, dk * 0.14, 0.5);
    glowAt(SP.gold, x, g - 0.5 * p, 0.95 * p, dk * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 自高天降下的光：光柱与它的头——落在洞里的马利亚身上（婴孩是她生的，由她包起来放在马槽里）
  function columnFoot() {
    const f = fig('mary'), G = stableGeom();
    if (f && f._vis && isFinite(f._x)) return [f._x, f._y - (f._h || G.p) * 1.02, G];
    return [X.maryK * W.w, G.mg - 0.9 * G.p, G];
  }
  function drawColumn(ctx) {
    const c = lv('natColumn'), d = lv('natDescend');
    if (c < 0.005 || !SP) return;
    const [x, yT, G] = columnFoot(), y = lerp(-20, yT, smoothstep(0, 1, d));
    const w = 0.7 * G.p, land = smoothstep(0.85, 1, d);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = c * 0.45;
    ctx.drawImage(SP.beam, x - w * 1.6, -20, w * 3.2, y + 20 + land * 0.9 * G.p);
    ctx.globalAlpha = c * 0.55;
    ctx.drawImage(SP.beam, x - w * 0.45, -20, w * 0.9, y + 20);
    // 光柱的头：降下时亮，落定后收成一层柔光（不盖住她怀里的婴孩）
    glowAt(SP.white, x, y, 0.5 * G.p, c * 0.9 * (1 - 0.65 * land));
    glowAt(SP.gold, x, y + land * 0.45 * G.p, 1.4 * G.p, c * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 马槽里婴孩的光（盖过夜色）
  function drawBirthGlow(ctx) {
    const k = lv('natBirth') * (S.babe ? 1 : 0.4) * lv('natBet');
    if (k < 0.005 || !SP) return;
    const G = stableGeom(), x = G.mx, y = G.mg - 0.4 * G.p;
    const br = 0.94 + 0.06 * Math.sin(W.t * 1.1);
    ctx.globalCompositeOperation = 'lighter';
    // 光环在布包的后上方，芯只是淡淡的一层白（布包的形状仍看得清）
    glowAt(SP.gold, x, y - 0.22 * G.p, 1.25 * G.p * br, k * 0.5);
    if (S.babe) glowAt(SP.white, x, y - 0.06 * G.p, 0.3 * G.p, k * 0.3);
    glowAt(SP.soft, x, y - 0.3 * G.p, M() * 0.3, k * 0.14 * (0.4 + 0.6 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    if (S.babe) drawBundle(ctx, G, Math.min(1, k * 1.2), true);
  }
  // 主的荣光四面照着他们
  function drawGlory(ctx) {
    const k = lv('natGlory');
    if (k < 0.005 || !SP) return;
    const p = PH(2), x = ((X.angel + X.sh3) / 2) * W.w, y = baseY(2, X.sh3, 0.12) - 0.7 * p, m = M();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.soft, x, y, m * 0.34, k * 0.3);
    glowAt(SP.gold, x, y, m * 0.2, k * 0.4);
    glowAt(SP.white, X.angel * W.w, y - 0.2 * p, 1.1 * p, k * 0.45);
    ctx.strokeStyle = 'rgb(255,244,214)';
    ctx.lineWidth = Math.max(0.8, 1.2 * SU());
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU + W.t * 0.05, L = m * (0.22 + 0.12 * hsh(i * 5.3)) * (0.9 + 0.1 * Math.sin(W.t + i));
      ctx.globalAlpha = k * 0.08;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 0.5 * p, y + Math.sin(a) * 0.5 * p); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 使者所指：一线光自野地通到马槽
  function drawPoint(ctx) {
    const k = lv('natPoint');
    if (k < 0.01 || !SP) return;
    const p = PH(2), ax = X.angel * W.w, ay = baseY(2, X.angel, 0.12) - 0.9 * p;
    const G = stableGeom(), bx = G.mx, by = G.mg - 0.5 * G.p;
    const cx = (ax + bx) / 2, cy = Math.min(ay, by) - 1.4 * p;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,236,190,' + (0.22 * k).toFixed(3) + ')';
    ctx.lineWidth = Math.max(1, 2.2 * SU());
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(cx, cy, bx, by); ctx.stroke();
    ctx.fillStyle = 'rgb(255,244,214)';
    for (let i = 0; i < 8; i++) {
      const t = U.fract(W.t * 0.35 + i / 8), mt = 1 - t;
      const px = mt * mt * ax + 2 * mt * t * cx + t * t * bx, py = mt * mt * ay + 2 * mt * t * cy + t * t * by;
      ctx.globalAlpha = k * 0.8 * Math.sin(t * Math.PI);
      ctx.beginPath(); ctx.arc(px, py, 1.6 * SU(), 0, TAU); ctx.fill();
    }
    glowAt(SP.gold, bx, by, 0.9 * G.p, k * 0.4 * (0.8 + 0.2 * Math.sin(W.t * 3)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 一大队天兵：满天的光的人形，排成几道弧，环着野地
  const HOST = [];
  (function () {
    const rows = [[15, 0.0], [13, 0.34], [11, 0.66], [7, 1.0]];
    let i = 0;
    for (const [n, r] of rows) for (let k = 0; k < n; k++) { HOST.push({ f: (k + 0.5 + (hsh(i * 3.3) - 0.5) * 0.4) / n, r, s: 0.75 + 0.5 * hsh(i * 7.1), d: hsh(i * 1.9) * 0.6, i }); i++; }
  })();
  function hostPt(q) {
    const cx = PX(0.64), a = Math.PI * (1.05 + 0.9 * q.f);
    const rx = (PORT ? 0.46 : 0.34) - q.r * (PORT ? 0.1 : 0.08), ry = (PORT ? 0.2 : 0.3) - q.r * 0.07;
    const y0 = PORT ? 0.62 : 0.5;
    return [(cx + Math.cos(a) * rx) * W.w, (y0 + Math.sin(a) * ry) * W.h];
  }
  function drawHost(ctx) {
    const k = lv('natHost');
    if (k < 0.005 || !SP) return;
    const h0 = PH(2) * 0.62 * (PORT ? 0.8 : 1), rise = S.hostGo ? (1 - k) * W.h * 0.16 : 0, fade = S.hostGo ? k * k : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const c = hostPt({ f: 0.5, r: 0.5 });
    glowAt(SP.soft, c[0], c[1] - rise, M() * 0.4, k * 0.2);
    for (const q of HOST) {
      const a = clamp((k - q.d * (S.hostGo ? 0 : 0.5)) * 2.2, 0, 1);
      if (a < 0.01) continue;
      const [x, y] = hostPt(q);
      const bob = Math.sin(W.t * 1.2 + q.i * 1.7) * 3 * SU();
      lightFigure(ctx, x, y - rise * (0.7 + 0.6 * q.s) + bob, h0 * q.s * (1 - q.r * 0.25), a * fade * 0.85 * (0.85 + 0.15 * Math.sin(W.t * 1.6 + q.i * 2.3)), q.i);
    }
    ctx.restore();
  }
  // 东方的星：自东方升起，在他们前头行，停在房子上头
  function starPt() {
    const t = smoothstep(0, 1, lv('natStarGo'));
    const hx = X.house * W.w;
    const P0 = PORT ? [0.2 * W.w, 0.4 * W.h] : [0.14 * W.w, 0.26 * W.h];
    const P1 = PORT ? [0.55 * W.w, 0.3 * W.h] : [0.45 * W.w, 0.06 * W.h];
    const P2 = [hx, W.h * (PORT ? 0.4 : 0.2)];
    const mt = 1 - t;
    return [mt * mt * P0[0] + 2 * mt * t * P1[0] + t * t * P2[0], mt * mt * P0[1] + 2 * mt * t * P1[1] + t * t * P2[1]];
  }
  function drawStar(ctx) {
    const k = lv('natStar');
    if (k < 0.005 || !SP) return;
    const [x, y] = starPt(), u = SU(), tw = 0.9 + 0.1 * Math.sin(W.t * 3.1) * Math.sin(W.t * 1.7);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.pale, x, y, 70 * u * tw, k * 0.5);
    glowAt(SP.white, x, y, 12 * u, Math.min(1, k * 1.3));
    ctx.strokeStyle = 'rgb(240,244,255)';
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + Math.PI / 2, L = (i === 0 ? 70 : 34) * u * tw;
      ctx.globalAlpha = k * (i === 0 ? 0.35 : 0.3);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawStarBeam(ctx) {
    const k = lv('natStarBeam') * lv('natStar');
    if (k < 0.005 || !SP) return;
    const [x, y] = starPt(), gx = X.house * W.w, gy = gY(2, X.house);
    const w = 1.1 * PH(2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.35;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(Math.atan2(gx - x, gy - y) * -1);
    const L = Math.hypot(gx - x, gy - y);
    ctx.drawImage(SP.star, -w / 2, 0, w, L);
    ctx.restore();
    glowAt(SP.pale, gx, gy - 0.8 * PH(2), 1.4 * PH(2), k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 梦：睡着的人上方一团柔和的光（一只光的泡，边上一道淡淡的亮），光里有主的使者（发光的人形）
  function drawDream(ctx) {
    const k = lv('natDream');
    if (k < 0.005 || !SP) return;
    const p = PH(2), xf = S.dreamX, x = xf * W.w, g = baseY(2, xf, 0.2), u = SU(), dd = S.dreamDir || 1;
    const cx = x + dd * (dd < 0 && PORT ? 0.5 : 0.3) * p, cy = g - 1.95 * p, rw = 0.8 * p, rh = 0.62 * p;
    ctx.globalCompositeOperation = 'lighter';
    // 自睡着的人升起的一串小光泡
    const pts = [[0.02, 0.32, 0.045], [0.1, 0.62, 0.07], [0.19, 0.98, 0.1]];
    ctx.strokeStyle = 'rgba(226,234,255,' + (0.5 * k).toFixed(3) + ')';
    ctx.lineWidth = Math.max(0.8, 1.1 * u);
    for (const q of pts) {
      glowAt(SP.pale, x + dd * q[0] * p, g - q[1] * p, q[2] * p * 2.4, k * 0.45);
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(x + dd * q[0] * p, g - q[1] * p, q[2] * p, 0, TAU); ctx.stroke();
    }
    // 梦的光泡
    glowAt(SP.pale, cx, cy, rw * 1.45, k * 0.32, rh / rw);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(200,214,255,' + (0.12 * k).toFixed(3) + ')';
    ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(232,238,255,' + (0.55 * k).toFixed(3) + ')';
    ctx.lineWidth = Math.max(1, 1.4 * u);
    ctx.beginPath(); ctx.ellipse(cx, cy, rw, rh, 0, 0, TAU); ctx.stroke();
    lightFigure(ctx, cx, cy + rh * 0.66, rh * 1.1, k * 0.95, 5.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 西边天际一线温暖的光（「我从埃及召出我的儿子来」）
  function drawEgypt(ctx) {
    const k = lv('natEgypt');
    if (k < 0.005 || !SP) return;
    const x = W.w * 1.02, y = W.horizonY - 0.01 * W.h;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.rose, x, y, W.w * 0.36, k * 0.62, 0.35);
    glowAt(SP.gold, x, y, W.w * 0.16, k * 0.55, 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 神的恩在他身上：一片柔和的光落在孩子身上
  function drawGrace(ctx) {
    const k = lv('natGrace') * lv('natNaz');
    if (k < 0.005 || !SP) return;
    const f = fig('jesus');
    if (!f || !f._vis) return;
    const p = f._h || PH(2), x = f._x, y = f._y;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, k * 0.5);
    ctx.drawImage(SP.beam, x - 1.2 * p, y - W.h * 0.55, 2.4 * p, W.h * 0.55 + 0.1 * p);
    glowAt(SP.gold, x, y - 0.5 * p, 1.5 * p, k * 0.6);
    glowAt(SP.white, x, y - 0.6 * p, 0.6 * p, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 殿上落下的光（「我父的事」）
  function drawTempleLight(ctx) {
    const k = lv('natTempleLight') * lv('natTemple');
    if (k < 0.005 || !SP) return;
    const p = PH(2), sx = lerp(X.tmp0, Math.min(X.tmp1, 1), 0.72) * W.w, g = gY(2, X.tmp0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.3;
    ctx.drawImage(SP.beam, sx - 2.4 * p, -20, 4.8 * p, g + 20);
    glowAt(SP.gold, sx, g - 2.6 * p, 2.4 * p, k * 0.35);
    const b = fig('jesus');
    if (b && b._vis) glowAt(SP.gold, b._x, b._y - 0.5 * (b._h || p), 1.1 * (b._h || p), k * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 转瞬的光：自天而降的光柱、向四方漫开的光
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = e.t / e.dur, k = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q)) * (e.k || 1);
      if (k < 0.005) continue;
      if (e.type === 'beam') {
        const x = e.xf * W.w, g = baseY(2, e.xf, e.v);
        ctx.globalAlpha = k * 0.45;
        ctx.drawImage(SP.beam, x - e.w / 2, -20, e.w, g + 20);
        glowAt(SP.gold, x, g - 20 * SU(), e.w * 1.2, k * 0.5);
      } else if (e.type === 'wave') {
        // 光向四方漫开：一片柔和的亮，由近而远，渐渐淡去（不画硬的圈）
        const r = M() * (0.15 + 0.7 * smoothstep(0, 1, q)), x = e.x, y = e.y;
        glowAt(SP.soft, x, y, r, k * 0.3 * (1 - 0.5 * q), 0.55);
        glowAt(SP.gold, x, y, r * 0.45, k * 0.25 * (1 - q), 0.6);
      } else if (e.type === 'leap') {
        const f = fig(e.id);
        if (f && f._vis) glowAt(SP.gold, f._x, f._y - (f._h || 30) * 0.45, (f._h || 30) * (0.3 + 0.5 * q), k * 0.8);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  各层的布景
  // ════════════════════════════════════════════════════════════
  function drawNear(ctx) {
    const aN = lv('natNaz'), aL = lv('natLiz'), aB = lv('natBet'), aT = lv('natTemple');
    // 橄榄树（在房屋之后）
    for (const o of OLIVES) {
      const a = o[2] === 'naz' ? aN : o[2] === 'nazE' ? aN * (1 - aL) : o[2] === 'liz' ? aL : o[2] === 'bet' ? aB : aT;
      if (a < 0.01) continue;
      if (PORT && (o[0] > 0.97 || o[0] < 0.53)) continue;
      U.safe('nat.olive', () => drawOlive(ctx, PX(o[0]), o[1] * (PORT ? 0.8 : 1), a));
    }
    const ph = PH(2) * (PORT ? 0.82 : 1);
    const houses = (list, A, lampK, extra) => {
      if (A < 0.01) return;
      list.forEach((o, i) => {
        if (PORT && o.skipPort) return;
        const xf = PX(o.x), a = o.east ? A * (1 - lv('natLiz')) : A;
        if (a < 0.01) return;
        ctx.globalAlpha = a;
        const opt = Object.assign({ door: o.door, win: o.win, stairs: o.stairs, lamp: (o.lamp || 0) * lampK, floors: o.floors, inn: o.inn }, extra ? extra(o, i) : null);
        house(ctx, 2, xf * W.w, gY(2, xf), o.w * ph, o.h * ph, o.tone, opt);
        ctx.globalAlpha = 1;
      });
    };
    if (aN > 0.01) {
      houses(NAZ, aN, lv('natLampN'));
      drawWell(ctx, aN);
      drawBench(ctx, aN);
    }
    if (aL > 0.01) { drawYard(ctx, aL); houses(LIZ, aL, 1); }
    drawFlowers(ctx, lv('natFlowers') * aL);
    if (aB > 0.01) {
      U.safe('nat.stable', () => drawStable(ctx, aB));
      const lb = lv('natLampB');
      houses(BET, aB, 1, (o, i) => ({ lampN: clamp(lb * 1.15 - i * 0.12, 0, 1), lamp: (o.lamp || 0) * clamp(lb * 2.5, 0, 1), open: o.inn ? lv('natInn') : 1 }));
      if (lv('natFire') > 0.01 || S.fire) drawFireBase(ctx, aB);
    }
    if (aT > 0.01) U.safe('nat.temple', () => drawTemple(ctx, aT));
  }
  function drawMid(ctx) {
    const aN = lv('natNaz'), aB = lv('natBet'), aT = lv('natTemple');
    if (aN > 0.01) town(ctx, 1, 0.6, 0.86, 17, aN, lv('natLampN'));
    if (aB > 0.01) town(ctx, 1, 0.62, 0.96, 29, aB, lv('natLampB'));
    if (aT > 0.01) drawCityMid(ctx, aT);
  }
  // 星光照着驼队（夜里骑在骆驼上的博士也看得清）
  function drawCaravan(ctx) {
    const k = lv('natStar');
    if (k < 0.05 || !SP) return;
    const p = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    for (const id of ['camel1', 'camel2', 'camel3']) {
      const f = fig(id);
      if (!f || !f._vis || f.alpha < 0.05) continue;
      const a = k * f.alpha * (0.3 + 0.5 * nightK());
      glowAt(SP.gold, f._x, f._y - 1.3 * p, 0.7 * p, a * 0.22);
      glowAt(SP.gold, f._x, f._y - 0.05 * p, 1.2 * p, a * 0.45, 0.22);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawAir(ctx) {
    drawCaravan(ctx);
    drawFireGlow(ctx, lv('natBet'));
    drawGifts(ctx);
    drawWord(ctx);
    drawShadow(ctx);
    drawColumn(ctx);
    drawBirthGlow(ctx);
    drawGlory(ctx);
    drawPoint(ctx);
    drawStarBeam(ctx);
    drawDream(ctx);
    drawGrace(ctx);
    drawTempleLight(ctx);
    drawTransients(ctx);
  }

  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.12 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      ctxA = ctx;
      if (pass === 'sky') { U.safe('nat.host', () => drawHost(ctx)); drawStar(ctx); drawEgypt(ctx); return; }
      if (pass === 'mid') { U.safe('nat.mid', () => drawMid(ctx)); return; }
      if (pass === 'near') { U.safe('nat.near', () => drawNear(ctx)); return; }
      if (pass === 'air') { U.safe('nat.air', () => drawAir(ctx)); }
    },
    draw() {},
    reset() { FXL.length = 0; VT.clear(); },
    restore() {
      FXL.length = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      return { S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const p = PH(2);
      if (lv('natNaz') > 0.5) consider('拿撒勒', PX(0.556) * W.w, gY(2, PX(0.556)) - 1.1 * p);
      if (lv('natLiz') > 0.5) consider('撒迦利亚的家', PX(0.878) * W.w, gY(2, PX(0.878)) - 1.2 * p);
      if (lv('natBet') > 0.5) {
        const G = stableGeom();
        consider('马槽', G.mx, G.mg - 0.4 * G.p);
        consider(S.babe ? '婴孩' : '马棚', G.mx, G.mg - 0.55 * G.p);
        consider('客店', PX(0.905) * W.w, gY(2, PX(0.905)) - 1.4 * p);
        consider('伯利恒', PX(0.975) * W.w, gY(2, PX(0.975)) - 0.9 * p);
        if (lv('natGifts') > 0.5) consider('礼物', X.gifts * W.w, baseY(2, X.gifts, 0.34) - 0.2 * p);
      }
      if (lv('natTemple') > 0.5) consider('殿', lerp(X.tmp0, Math.min(1, X.tmp1), 0.72) * W.w, gY(2, X.tmp0) - 2.5 * p);
      if (lv('natStar') > 0.5) { const s = starPt(); consider('星', s[0], s[1]); }
      if (lv('natHost') > 0.5) { const c = hostPt({ f: 0.5, r: 0.4 }); consider('天兵', c[0], c[1]); }
      return best;
    },
  };

  // 本幕开始时（幕后）重置布景
  function resetScene() {
    FXL.length = 0; VT.clear();
    S = fresh();
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：太初——黑暗里的拿撒勒
  // ════════════════════════════════════════════════════════════
  function setup() {
    layout();
    // 冬夜：地是青的，花隐去；天几乎全暗，只有神的灵的一点光
    W.set('bare', 0.1, true); W.set('bloom', 0.22, true); W.set('storm', 0, true); W.set('rain', 0, true);
    W.set('gloom', 0.62, true);
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.72, herbs: 0.5, trees: 0, lights: 1, moon: 0.35, stars: 0.25, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k in LEVELS) W.set(k, 0, true);
    W.set('natNaz', 1, true); W.set('natInn', 1, true);
    W.freeClock = false;
    W.goTo(0.02, 0, true);
    const ox = W.w * PX(0.6), oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.setPop('fish', 60, W.w * 0.16, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.55, W.h * 0.3, true);
    W.setPop('cattle', 0, ox, oy, true);
    W.setPop('beast', 0, ox, oy, true);
    W.setPop('creeper', 4, ox, oy, true);
    W.setPop('human', 0, ox, oy, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    avoid([0.4, 1]);
  }

  // 常用的几件事
  const nameTop = xf => baseY(2, xf, 0.1) - PH(2);
  function lampsNaz(b, v) { W.set('natLampN', v, b.instant); }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 太初有道：黑暗里点起一光；众星；光照在黑暗里；拿撒勒的灯；破晓 ─────
    {
      kind: 'act', utter: '太初有道', cmd: 'echo "道"  # 太初：在一切之先', ref: '约翰福音 1:1',
      verse: [
        { text: '太初有道，道与神同在，道就是神。', ref: '约翰福音 1:1', hold: 6 },
        { text: '万物是藉着他造的；凡被造的，没有一样不是藉着他造的。', ref: '约翰福音 1:3', hold: 6 },
        { text: '生命在他里头，这生命就是人的光。<br>光照在黑暗里，黑暗却不接受光。', ref: '约翰福音 1:4–5', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('natWord', 1, b.instant);
            if (!b.instant) { const p = wordPt(); ringAt(b, p[0], p[1], [255, 244, 220], M() * 0.3, 2.6, 2); sparkleAt(b, p[0], p[1], 30, [255, 246, 226], 20); }
            sfx(b, 'harp');
          }],
          [2.2, b => { W.set('gloom', 0.35, b.instant); W.set('stars', 1, b.instant); sfx(b, 'stars'); }],
          // 万物是藉着他造的：光扫过全地
          [7.3, b => {
            W.set('gloom', 0.12, b.instant); W.set('moon', 0.7, b.instant);
            if (!b.instant) { const p = wordPt(); flash(b, { type: 'wave', x: p[0], y: p[1] + W.h * 0.25, dur: 4.5 }); }
            sfx(b, 'wind', { soft: true });
          }],
          // 这生命就是人的光：拿撒勒的灯一盏盏亮起
          [14.6, b => { lampsNaz(b, 1); sfx(b, 'chime', { soft: true }); }],
          // 光照在黑暗里：天破晓
          [17.2, b => { W.set('gloom', 0, b.instant); W.goTo(0.27, 7, b.instant); }],
          [20.4, b => {
            W.set('natWord', 0, b.instant); lampsNaz(b, 0.25);
            add('mary', look('mary', { x: X.maryDoor, facing: 1, pose: 'stand', prop: 'jar', v: 0.04 }));
            walk('mary', X.maryWell, { speed: 0.022 });
            sink('mary', 0.12);
          }],
        ]);
      },
    },

    // ── 2 天使加百列奉神的差遣：井边的马利亚，天使加百列；「主和你同在了」；「耶稣」之名 ─
    {
      kind: 'act', utter: '天使加百列奉神的差遣', cmd: 'send 加百列 --to 拿撒勒 --msg "主和你同在了"', ref: '路加福音 1:26',
      verse: [
        { text: '到了第六个月，天使加百列奉神的差遣往加利利的一座城去（这城名叫拿撒勒），<br>到一个童女那里……童女的名字叫马利亚；', ref: '路加福音 1:26–27', hold: 7.5 },
        { text: '天使进去，对她说：「蒙大恩的女子，我问你安，主和你同在了！」', ref: '路加福音 1:28', hold: 6 },
        { text: '天使对她说：「马利亚，不要怕！你在神面前已经蒙恩了。<br>你要怀孕生子，可以给他起名叫耶稣。……」', ref: '路加福音 1:30–31', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.33, 4, b.instant); lampsNaz(b, 0);
            if (has('mary')) { place('mary', X.maryWell); pose('mary', 'stand'); hold('mary', 'jar'); sink('mary', 0.12); if (b.instant) fig('mary').v = 0.12; }
            else add('mary', look('mary', { x: X.maryWell, facing: 1, pose: 'stand', prop: 'jar', v: 0.12 }));
            beam(b, X.gabriel, { v: 0.12, dur: 5, w: 90, r: 0.2 });
            sfx(b, 'angel');
          }],
          [1.2, b => {
            add('gabriel', { label: '加百列', sex: 'm', age: 'adult', x: X.gabriel, facing: -1, angel: true, glow: 1, v: 0.12, from: b.instant ? 'none' : 'light' });
            face('mary', 1);
          }],
          [3.4, b => { glow('mary', 0.45); sparkleOn(b, 'mary', 16); }],
          // 蒙大恩的女子：她惊慌，跪下
          [9.2, b => { hold('mary', null); pose('mary', 'kneel'); pose('gabriel', 'raise'); sfx(b, 'harp', { soft: true }); }],
          [16.4, b => { pose('gabriel', 'point'); }],
          // 可以给他起名叫耶稣
          [18.4, b => { nameOver(b, X.maryWell, nameTop(X.maryWell), '耶稣', { hold: 3.4 }); }],
          [22.6, () => { pose('gabriel', 'stand'); }],
        ]);
      },
    },

    // ── 3 出于神的话，没有一句不带能力的：光明的云荫庇她；「我是主的使女」；天使升去 ─
    {
      kind: 'act', utter: '出于神的话，没有一句不带能力的', cmd: 'assert(神的话.every(带能力))  # ✓', ref: '路加福音 1:37',
      verse: [
        { text: '马利亚对天使说：「我没有出嫁，怎么有这事呢？」', ref: '路加福音 1:34', hold: 5 },
        { text: '天使回答说：「圣灵要临到你身上，至高者的能力要荫庇你……<br>因为，出于神的话，没有一句不带能力的。」', ref: '路加福音 1:35–37', hold: 7.5 },
        { text: '马利亚说：「我是主的使女，情愿照你的话成就在我身上。」<br>天使就离开她去了。', ref: '路加福音 1:38', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, () => { pose('mary', 'gaze'); face('mary', 1); pose('gabriel', 'stand'); }],
          // 圣灵要临到你身上，至高者的能力要荫庇你
          [6.6, b => { W.set('natShadow', 1, b.instant); glow('mary', 0.75); sfx(b, 'harp'); sfx(b, 'wind', { soft: true }); }],
          [9.4, b => { sparkleOn(b, 'mary', 26, [255, 246, 226]); }],
          // 我是主的使女
          [15.4, b => { pose('mary', 'pray'); W.set('natShadow', 0.35, b.instant); }],
          // 天使就离开她去了
          [18.8, b => { fly('gabriel', X.gabriel + 0.02, -0.15, { dur: 4 }); sfx(b, 'wings', { soft: true }); }],
          [21.6, b => { rm('gabriel'); W.set('natShadow', 0, b.instant); glow('mary', 0.42); }],
        ]);
      },
    },

    // ── 4 那有权能的，为我成就了大事：往山地去；伊利莎白；胎跳动；颂歌与花 ─────
    {
      kind: 'act', utter: '那有权能的，为我成就了大事', cmd: 'magnify(主)  # 我心尊主为大', ref: '路加福音 1:49',
      verse: [
        { text: '那时候，马利亚起身，急忙往山地里去，来到犹大的一座城；<br>进了撒迦利亚的家，问伊利莎白安。', ref: '路加福音 1:39–40', hold: 6.5 },
        { text: '伊利莎白一听马利亚问安，所怀的胎就在腹里跳动。伊利莎白且被圣灵充满，<br>高声喊着说：「你在妇女中是有福的！你所怀的胎也是有福的！……」', ref: '路加福音 1:41–42', hold: 7.5 },
        { text: '马利亚说：我心尊主为大；我灵以神我的救主为乐；……<br>那有权能的，为我成就了大事；他的名为圣。', ref: '路加福音 1:46–49', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.42, 6, b.instant);
            // 往山地里去：拿撒勒隐去，山上只有撒迦利亚的家、院子与橄榄树
            W.set('natNaz', 0, b.instant); lampsNaz(b, 0);
            W.set('natLiz', 1, b.instant);
            pose('mary', 'stand'); hold('mary', null);
            walk('mary', X.meetM, { speed: 0.04 });
            sfx(b, 'wind', { soft: true });
          }],
          [3.2, b => {
            add('elizabeth', { label: '伊利莎白', sex: 'f', age: 'elder', x: X.lizDoor, facing: -1, pose: 'stand', robe: [128, 106, 136], glow: 0.3, prop: null, v: 0.05 });
            walk('elizabeth', X.meetE, { speed: 0.012 });
          }],
          [7.6, () => { embrace('mary', 'elizabeth', { at: (X.meetM + X.meetE) / 2 }); }],
          // 胎在腹里跳动；伊利莎白被圣灵充满
          [9.4, b => { flash(b, { type: 'leap', id: 'elizabeth', dur: 2.2 }); sparkleOn(b, 'elizabeth', 22, [255, 240, 200], 0.45); glow('elizabeth', 0.75); sfx(b, 'chime'); }],
          [13.6, () => { pose('elizabeth', 'raise'); pose('mary', 'stand'); face('mary', 1); }],
          // 马利亚的颂歌：四围开出花来
          [16.4, b => { pose('mary', 'raise'); pose('elizabeth', 'stand'); W.set('natFlowers', 1, b.instant); W.set('bloom', 0.55, b.instant); sfx(b, 'sing', { soft: true }); sfx(b, 'bird'); }],
          [20, b => { sparkleOn(b, 'mary', 20); }],
          [23, () => { pose('mary', 'stand'); }],
        ]);
      },
    },

    // ── 5 人要称他的名为以马内利：约瑟的梦；以马内利；把妻子娶过来 ─────────
    {
      kind: 'name', utter: '人要称他的名为以马内利', cmd: 'alias 以马内利="神与我们同在"', ref: '马太福音 1:23',
      verse: [
        { text: '正思念这事的时候，有主的使者向他梦中显现，说：<br>「大卫的子孙约瑟，不要怕！只管娶过你的妻子马利亚来，因她所怀的孕是从圣灵来的。……」', ref: '马太福音 1:20', hold: 8 },
        { text: '这一切的事成就是要应验主藉先知所说的话，说：<br>必有童女怀孕生子；人要称他的名为以马内利。<br>（以马内利翻出来就是「神与我们同在」。）', ref: '马太福音 1:22–23', hold: 8 },
        { text: '约瑟醒了，起来，就遵着主使者的吩咐把妻子娶过来；', ref: '马太福音 1:24', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.96, 3, b.instant);
            rm('elizabeth');
            W.set('natLiz', 0, b.instant); W.set('natFlowers', 0, b.instant); W.set('natNaz', 1, b.instant);
            pose('mary', 'stand');
            leave('mary', X.maryDoor, { speed: 0.06 });
            add('josephnt', look('josephnt', { x: X.josSleep, facing: -1, pose: 'sit', v: 0.12, glow: 0.3 }));
          }],
          [2.2, b => { lampsNaz(b, 0.8); }],
          [3.2, () => { pose('josephnt', 'lie'); }],
          // 梦中：主的使者
          [4.2, b => { S.dreamX = X.josSleep; S.dreamDir = 1; W.set('natDream', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          // 以马内利（主藉先知所说的话）
          [11.4, b => { nameOver(b, X.josSleep, baseY(2, X.josSleep, 0.12) - 2.2 * PH(2), '以马内利', { hold: 3.6 }); }],
          // 约瑟醒了
          [18.6, b => { W.set('natDream', 0, b.instant); W.goTo(0.3, 4, b.instant); lampsNaz(b, 0.3); pose('josephnt', 'stand'); glow('josephnt', 0.2); }],
          [20, b => {
            walk('josephnt', X.maryDoor + 0.02, { speed: 0.04 });
            add('mary', look('mary', { x: X.maryDoor, facing: 1, pose: 'stand', v: 0.1, glow: 0.42, carry: null, prop: null }));
          }],
          [23.2, () => { hands('josephnt', 'mary', true); face('josephnt', 1); walk('josephnt', X.josDoor + 0.012, { speed: 0.03 }); walk('mary', X.josDoor - 0.006, { speed: 0.03 }); }],
          [24.6, b => { lampsNaz(b, 0); }],
        ]);
      },
    },

    // ── 6 他到自己的地方来：凯撒的旨意；往伯利恒去；客店的门关上；马棚 ─────────
    {
      kind: 'act', utter: '他到自己的地方来，自己的人倒不接待他', cmd: 'register 约瑟 马利亚 --city 伯利恒  # 客店：0 rooms', ref: '约翰福音 1:11',
      verse: [
        { text: '当那些日子，凯撒奥古斯都有旨意下来，叫天下人民都报名上册。', ref: '路加福音 2:1', hold: 5.5 },
        { text: '约瑟也从加利利的拿撒勒城上犹太去，到了大卫的城，名叫伯利恒……<br>要和他所聘之妻马利亚一同报名上册。那时马利亚的身孕已经重了。', ref: '路加福音 2:4–5', hold: 8 },
        { text: '他到自己的地方来，自己的人倒不接待他。', ref: '约翰福音 1:11', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.46, 3, b.instant);
            hands('josephnt', 'mary', false);
            if (has('josephnt')) place('josephnt', X.josDoor + 0.012);
            beast('donkey', { kind: 'donkey', label: '驴', x: X.josDoor - 0.018, facing: 1, pose: 'stand' });
            if (has('mary')) place('mary', X.josDoor - 0.018);
            ride('mary', 'donkey');
            sfx(b, 'donkey', { soft: true });
          }],
          [1, b => {
            crowd('trav', { n: 6, x0: PX(0.58), x1: PX(0.72), layer: 2, label: '众人', prop: null }, dressAs(TRAV, 0.18, 0.4));
            cwalk('trav', PX(0.94), 1.06, { speed: 0.032 });
            sfx(b, 'crowd', { soft: true });
          }],
          // 往犹太去：拿撒勒隐去，伯利恒在暮色里出现
          [2.6, b => {
            walk('josephnt', X.innStop, { speed: 0.019 });
            walk('donkey', X.innStop - 0.03, { speed: 0.019 });
            W.set('natNaz', 0, b.instant); W.goTo(0.8, 12, b.instant);
          }],
          [4.8, b => { W.set('natBet', 1, b.instant); W.set('natLampB', 1, b.instant); W.set('natInn', 1, b.instant); }],
          [6.2, () => {
            crowd('guests', { n: 4, x0: PX(0.93), x1: PX(0.99), layer: 2, label: '众人', prop: null }, dressAs(TRAV, 0.12, 0.3));
          }],
          [13.6, () => { crm('trav'); face('josephnt', 1); pose('josephnt', 'point'); }],
          // 客店的门关上
          [16.3, b => { W.set('natInn', 0, b.instant); sfx(b, 'gate', { soft: true }); pose('josephnt', 'stand'); }],
          [17.6, () => {
            walk('josephnt', X.josS, { speed: 0.024 });
            walk('donkey', X.maryK + 0.006, { speed: 0.022 });
          }],
          [21, b => { crm('guests'); beast('ox', { kind: 'ox', label: '牛', x: X.ox, facing: -1, pose: 'lie' }); W.set('natStable', 1, b.instant); }],
          [23, () => {
            ride('mary', null);
            // 驴到牛的旁边（洞的右边）：马槽的左边留给跪拜的牧羊人
            walk('donkey', X.donkeyR, { speed: 0.03 }); face('donkey', -1);
          }],
          [24.2, () => { walk('mary', X.maryK, { speed: 0.02, pose: 'sit' }); face('josephnt', -1); }],
          [26, () => { face('mary', 1); }],
        ]);
      },
    },

    // ── 7 道成了肉身，住在我们中间：光自高天降下，落在马利亚身上；她把婴孩包起来放在马槽里（签名之景）
    {
      kind: 'act', utter: '道成了肉身，住在我们中间', cmd: 'deploy 道 --to 马槽  # env: 肉身', ref: '约翰福音 1:14',
      verse: [
        { text: '他们在那里的时候，马利亚的产期到了，就生了头胎的儿子，<br>用布包起来，放在马槽里，因为客店里没有地方。', ref: '路加福音 2:6–7', hold: 7.5 },
        { text: '道成了肉身，住在我们中间，充充满满地有恩典有真理。<br>我们也见过他的荣光，正是父独生子的荣光。', ref: '约翰福音 1:14', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.01, 4, b.instant); W.set('stars', 1, b.instant); W.set('natLampB', 0.7, b.instant);
            if (has('mary') && fig('mary').mount) ride('mary', null);
            place('mary', X.maryK); pose('mary', 'kneel'); face('mary', 1);
            place('josephnt', X.josS); face('josephnt', -1);
          }],
          // 一道光自高天降下，落在洞里的马利亚身上
          [1.2, b => { W.set('natColumn', 1, b.instant); W.set('natDescend', 1, b.instant); sfx(b, 'harp'); }],
          // 就生了头胎的儿子：婴孩在马利亚的怀里，包着布
          [4.6, b => {
            pose('mary', 'stand'); babe('mary', 'baby'); glow('mary', 0.6); glow('josephnt', 0.4);
            if (!b.instant) { const h = headOf('mary', 0.55); ringAt(b, h[0], h[1], [255, 240, 206], M() * 0.22, 2.4, 1.8); sparkleAt(b, h[0], h[1], 26, [255, 246, 226], 12); }
            sfx(b, 'chime');
          }],
          // 用布包起来，放在马槽里：她俯身把他放在马槽里
          [6.4, b => {
            face('mary', 1); pose('mary', 'bow'); babe('mary', null);
            S.babe = 1; W.set('natBirth', 1, b.instant);
            if (!b.instant) { const G = stableGeom(); sparkleAt(b, G.mx, G.mg - 0.4 * G.p, 30, [255, 246, 226], 14); }
            sfx(b, 'angel', { soft: true });
          }],
          [8, () => { pose('mary', 'kneel'); }],
          [8.8, () => { pose('mary', 'pray'); }],
          // 道成了肉身；我们也见过他的荣光
          [9.4, b => {
            W.set('natColumn', 0.3, b.instant); pose('josephnt', 'kneel');
            if (!b.instant) { const G = stableGeom(); flash(b, { type: 'wave', x: G.mx, y: G.mg - 0.4 * G.p, dur: 5 }); }
          }],
          [14.5, b => { W.set('natColumn', 0, b.instant); }],
        ]);
      },
    },

    // ── 8 主的荣光四面照着他们：野地里的牧羊人；主的使者；大喜的信息 ─────────
    {
      kind: 'act', utter: '主的荣光四面照着他们', cmd: 'shine 主的荣光 --around 牧羊的人  # then: broadcast "大喜的信息"', ref: '路加福音 2:9',
      verse: [
        { text: '在伯利恒之野地里有牧羊的人，夜间按着更次看守羊群。<br>有主的使者站在他们旁边，主的荣光四面照着他们；牧羊的人就甚惧怕。', ref: '路加福音 2:8–9', hold: 8 },
        { text: '那天使对他们说：「不要惧怕！我报给你们大喜的信息，是关乎万民的；<br>因今天在大卫的城里，为你们生了救主，就是主基督。……」', ref: '路加福音 2:10–11', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            S.fire = 1; W.set('natFire', 1, b.instant);
            const c0 = C();
            if (c0.herd) U.safe('cast.herd', () => c0.herd('flock', { kind: 'sheep', n: PORT ? 7 : 10, x0: X.flock0, x1: X.flock1, layer: 2, label: '羊群', pose: 'lie', from: b.instant ? 'none' : 'fade', mill: false }));
            add('shep1', { label: '牧羊的人', sex: 'm', age: 'adult', x: X.sh1, facing: 1, pose: 'sit', robe: [118, 98, 74], prop: 'staff', glow: 0.25, v: 0.2 });
            add('shep2', { label: '牧羊的人', sex: 'm', age: 'elder', x: X.sh2, facing: -1, pose: 'sit', robe: [104, 92, 80], prop: null, glow: 0.25, v: 0.22 });
            add('shep3', { label: '牧羊的人', sex: 'm', age: 'adult', x: X.sh3, facing: 1, pose: 'stand', robe: [138, 116, 88], prop: 'staff', glow: 0.25, v: 0.05 });
            sfx(b, 'bleat', { soft: true }); sfx(b, 'fire', { soft: true });
          }],
          // 主的使者站在他们旁边，主的荣光四面照着他们
          [4, b => {
            add('angel', { label: '主的使者', sex: 'm', age: 'adult', x: X.angel, facing: -1, angel: true, glow: 1, v: 0.12, from: b.instant ? 'none' : 'light' });
            W.set('natGlory', 1, b.instant);
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.25); ringAt(b, X.angel * W.w, baseY(2, X.angel, 0.12) - PH(2), [255, 244, 214], M() * 0.3, 2.4, 1.8); }
            sfx(b, 'angel');
          }],
          // 牧羊的人就甚惧怕
          [5.4, b => { pose('shep1', 'fall'); pose('shep2', 'fall'); pose('shep3', 'fall'); face('shep3', 1); cpose('flock', 'stand'); }],
          // 不要惧怕！
          [9.6, () => { pose('shep1', 'kneel'); pose('shep2', 'kneel'); pose('shep3', 'kneel'); face('shep1', 1); face('shep2', 1); face('shep3', 1); pose('angel', 'raise'); }],
          // 为你们生了救主：使者指向大卫的城
          [13.6, b => { face('angel', 1); pose('angel', 'point'); W.set('natPoint', 1, b.instant); sfx(b, 'chime', { soft: true }); }],
          [17.6, b => { W.set('natPoint', 0.35, b.instant); }],
        ]);
      },
    },

    // ── 9 你们要看见一个婴孩：记号；天兵；牧羊的人急忙来；马利亚存在心里 ─────
    {
      kind: 'promise', utter: '你们要看见一个婴孩，包着布，卧在马槽里', cmd: 'sign = find("婴孩", in: "马槽")  # 那就是记号', ref: '路加福音 2:12',
      verse: [
        { text: '「你们要看见一个婴孩，包着布，卧在马槽里，那就是记号了。」<br>忽然，有一大队天兵同那天使赞美神说：', ref: '路加福音 2:12–13', hold: 7 },
        { text: '在至高之处荣耀归与神！<br>在地上平安归与他所喜悦的人！', ref: '路加福音 2:14', hold: 5.5 },
        { text: '众天使离开他们，升天去了……<br>他们急忙去了，就寻见马利亚和约瑟，又有那婴孩卧在马槽里；', ref: '路加福音 2:15–16', hold: 7 },
        { text: '马利亚却把这一切的事存在心里，反复思想。', ref: '路加福音 2:19', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.set('natPoint', 0, b.instant); pose('angel', 'raise'); beam(b, X.manger, { v: 0, dur: 4.5, w: 60, r: 0.14 }); }],
          // 忽然，有一大队天兵
          [3, b => { S.hostGo = 0; W.set('natHost', 1, b.instant); W.set('stars', 1, b.instant); sfx(b, 'angel'); sfx(b, 'sing'); }],
          // 在至高之处荣耀归与神
          [8.6, b => {
            pose('shep1', 'gaze'); pose('shep2', 'gaze'); pose('shep3', 'gaze');
            if (!b.instant) { const q = hostPt({ f: 0.5, r: 0.5 }); flash(b, { type: 'wave', x: q[0], y: q[1], dur: 4 }); }
            sfx(b, 'sing');
          }],
          // 众天使离开他们，升天去了
          [15.2, b => {
            S.hostGo = 1; W.set('natHost', 0, b.instant); W.set('natGlory', 0, b.instant);
            fly('angel', X.angel, -0.15, { dur: 4, pose: 'raise' });
            sfx(b, 'wings', { soft: true });
          }],
          // 他们急忙去了
          [17.2, () => {
            sink('shep1', 0.32); sink('shep2', 0.32); sink('shep3', 0.32);
            walk('shep3', X.shK1, { speed: 0.06, pose: 'kneel' });
            walk('shep1', X.shK2, { speed: 0.055, pose: 'kneel' });
            walk('shep2', X.shK3, { speed: 0.05, pose: 'kneel' });
          }],
          [19.4, b => { rm('angel'); W.set('natFire', 0.35, b.instant); }],
          [21.6, () => { for (const id of ['shep1', 'shep2', 'shep3']) face(id, 1); }],
          // 马利亚却把这一切的事存在心里
          [23.6, b => { glow('mary', 0.7); sparkleOn(b, 'mary', 18, [255, 236, 200], 0.55); }],
          [27, b => { glow('mary', 0.5); }],
        ]);
      },
    },

    // ── 10 将来有一位君王要从你那里出来：一日过去；东方的星；博士与骆驼；星停住 ─────
    {
      kind: 'promise', utter: '将来有一位君王要从你那里出来', cmd: 'follow(星) --from 东方 --until 停住', ref: '马太福音 2:6',
      verse: [
        { text: '当希律王的时候，耶稣生在犹太的伯利恒。有几个博士从东方来到耶路撒冷，说：<br>「那生下来作犹太人之王的在哪里？我们在东方看见他的星，特来拜他。」', ref: '马太福音 2:1–2', hold: 8.5 },
        { text: '他们回答说：「在犹太的伯利恒。因为有先知记着，说：<br>犹大地的伯利恒啊，你在犹大诸城中并不是最小的；<br>因为将来有一位君王要从你那里出来，牧养我以色列民。」', ref: '马太福音 2:5–6', hold: 9 },
        { text: '在东方所看见的那星忽然在他们前头行，直行到小孩子的地方，就在上头停住了。', ref: '马太福音 2:9', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 牧羊的人回去了；过了些日子
            for (const id of ['shep1', 'shep2', 'shep3']) rm(id);
            crm('flock'); S.fire = 0; W.set('natFire', 0, b.instant);
            W.goTo(0.06, 6, b.instant);
            S.babe = 0; W.set('natBirth', 0, b.instant); W.set('natStable', 0.4, b.instant);
            pose('mary', 'stand'); babe('mary', 'baby'); glow('mary', 0.45);
            walk('mary', X.houseDoor, { speed: 0.025, pose: 'sit' });
            pose('josephnt', 'stand'); walk('josephnt', X.josHouse, { speed: 0.025 });
            // 牛与驴回到洞里（马槽的左边）：房子门前只有马利亚、孩子与约瑟
            walk('ox', X.oxIn, { speed: 0.014, pose: 'lie' }); face('ox', 1);
            walk('donkey', X.donkeyIn, { speed: 0.022 }); face('donkey', 1);
          }],
          // 我们在东方看见他的星
          [2.5, b => { W.set('natStar', 1, b.instant); sfx(b, 'stars'); }],
          // 博士骑着骆驼从东方（左边的岸上）来
          [3.5, b => {
            const cm = [['camel1', 'magus1', X.camel1, [60, 74, 132]], ['camel2', 'magus2', X.camel2, [140, 52, 58]], ['camel3', 'magus3', X.camel3, [176, 132, 60]]];
            cm.forEach(([cid, mid, x, robe]) => {
              const x0 = x - 0.16;
              beast(cid, { kind: 'camel', label: '骆驼', x: x0, facing: 1, pose: 'stand' });
              add(mid, { label: '博士', sex: 'm', age: 'adult', x: x0, facing: 1, robe, accent: [232, 200, 120], hair: 'cloth', beard: true, glow: 0.5, prop: null });
              ride(mid, cid);
              walk(cid, x, { speed: 0.0098 });
            });
            sfx(b, 'camel', { soft: true });
          }],
          [4, () => { face('mary', -1); face('josephnt', -1); }],
          // 星在他们前头行，直行到小孩子的地方
          [13.4, b => { W.set('natStarGo', 1, b.instant); }],
          // 就在上头停住了
          [22.6, b => { W.set('natStarBeam', 1, b.instant); sfx(b, 'chime'); if (!b.instant) { const s = starPt(); ringAt(b, s[0], s[1], [236, 240, 255], M() * 0.18, 2, 1.4); } }],
        ]);
      },
    },

    // ── 11 那光是真光：俯伏拜那小孩子；黄金、乳香、没药；光漫开；从别的路回去 ─────
    {
      kind: 'act', utter: '那光是真光，照亮一切生在世上的人', cmd: 'light.render(一切生在世上的人)', ref: '约翰福音 1:9',
      verse: [
        { text: '他们看见那星，就大大地欢喜；进了房子，看见小孩子和他母亲马利亚，<br>就俯伏拜那小孩子，揭开宝盒，拿黄金、乳香、没药为礼物献给他。', ref: '马太福音 2:10–11', hold: 8.5 },
        { text: '那光是真光，照亮一切生在世上的人。', ref: '约翰福音 1:9', hold: 5 },
        { text: '博士因为在梦中被主指示不要回去见希律，就从别的路回本地去了。', ref: '马太福音 2:12', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, () => {
            [['magus1', X.mK1], ['magus2', X.mK2], ['magus3', X.mK3]].forEach(([id, x]) => { ride(id, null); walk(id, x, { speed: 0.036 }); sink(id, 0.3); });
            for (const id of ['camel1', 'camel2', 'camel3']) pose(id, 'lie');
          }],
          [5.6, () => { for (const id of ['magus1', 'magus2', 'magus3']) face(id, 1); }],
          // 俯伏拜那小孩子
          [6.4, b => { for (const id of ['magus1', 'magus2', 'magus3']) pose(id, 'worship'); sfx(b, 'harp', { soft: true }); }],
          [7.6, b => { W.set('natGifts', 1, b.instant); sfx(b, 'chime'); }],
          // 那光是真光，照亮一切生在世上的人
          [10.2, b => {
            glow('mary', 0.6);
            for (const id of ['magus1', 'magus2', 'magus3']) glow(id, 0.5);
            if (!b.instant) { const h = headOf('mary', 0.5); flash(b, { type: 'wave', x: h[0], y: h[1], dur: 5.5 }); sparkleAt(b, h[0], h[1], 30, [255, 240, 206], 16); }
            sfx(b, 'harp');
          }],
          // 从别的路回本地去了
          [16.4, () => {
            [['magus1', X.camel1], ['magus2', X.camel2], ['magus3', X.camel3]].forEach(([id, x]) => { pose(id, 'stand'); glow(id, 0.3); walk(id, x - 0.01, { speed: 0.05 }); sink(id, 0); });
            for (const id of ['camel1', 'camel2', 'camel3']) pose(id, 'stand');
          }],
          [19.8, b => {
            [['magus1', 'camel1'], ['magus2', 'camel2'], ['magus3', 'camel3']].forEach(([m, cid]) => ride(m, cid));
            W.set('natStarBeam', 0, b.instant); W.set('natStar', 0, b.instant);
          }],
          [20.4, () => {
            walk('camel3', PX(0.45), { speed: 0.05 }); walk('camel2', PX(0.49), { speed: 0.05 }); walk('camel1', PX(0.53), { speed: 0.05 });
          }],
          [22.8, () => { for (const id of ['magus1', 'magus2', 'magus3', 'camel1', 'camel2', 'camel3']) rm(id); }],
        ]);
      },
    },

    // ── 12 我从埃及召出我的儿子来：梦中的使者；夜里往埃及去；伯利恒的灯熄灭 ─────
    {
      kind: 'call', utter: '我从埃及召出我的儿子来', cmd: 'route 圣家 --via 埃及 --return later', ref: '马太福音 2:15',
      verse: [
        { text: '他们去后，有主的使者向约瑟梦中显现，说：<br>「起来！带着小孩子同他母亲逃往埃及，住在那里，等我吩咐你……」', ref: '马太福音 2:13', hold: 7.5 },
        { text: '约瑟就起来，夜间带着小孩子和他母亲往埃及去，<br>住在那里，直到希律死了。', ref: '马太福音 2:14–15', hold: 6.5 },
        { text: '这是要应验主藉先知所说的话，说：「我从埃及召出我的儿子来。」', ref: '马太福音 2:15', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.03, 4, b.instant); W.set('natLampB', 0.8, b.instant);
            place('josephnt', X.josSleep2); pose('josephnt', 'lie'); face('josephnt', -1);
            sink('josephnt', 0.2);
            glow('mary', 0.4);
          }],
          // 梦的光泡升在约瑟的左上方（马棚的石上），不压在门前的马利亚与孩子身上
          [2.6, b => { S.dreamX = X.josSleep2; S.dreamDir = -1; W.set('natDream', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          // 约瑟就起来
          [9, b => { W.set('natDream', 0, b.instant); pose('josephnt', 'stand'); hold('josephnt', 'torch'); glow('josephnt', 0.35); walk('donkey', X.houseDoor - 0.012, { speed: 0.04 }); }],
          [10.2, b => { pose('mary', 'stand'); W.set('natGifts', 0, b.instant); }],
          [12.2, () => { ride('mary', 'donkey'); face('donkey', 1); }],
          [12.6, () => { sink('josephnt', 0.08); walk('josephnt', 1.1, { speed: 0.03 }); walk('donkey', 1.08, { speed: 0.027 }); }],
          // 伯利恒的灯一盏一盏熄灭
          [15, b => { W.set('natLampB', 0, b.instant); W.set('natStable', 0, b.instant); }],
          // 我从埃及召出我的儿子来
          [16.8, b => { W.set('natEgypt', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [22.8, () => { rm('josephnt'); rm('donkey'); rm('mary'); }],
        ]);
      },
    },

    // ── 13 又有神的恩在他身上：回到拿撒勒；孩子渐渐长大 ───────────────
    {
      kind: 'act', utter: '又有神的恩在他身上', cmd: 'while (孩子.长大) 恩典++', ref: '路加福音 2:40',
      verse: [
        { text: '希律死了以后，有主的使者在埃及向约瑟梦中显现，说：<br>「起来！带着小孩子和他母亲往以色列地去……」', ref: '马太福音 2:19–20', hold: 7 },
        { text: '到了一座城，名叫拿撒勒，就住在那里。<br>这是要应验先知所说，他将称为拿撒勒人的话了。', ref: '马太福音 2:23', hold: 6.5 },
        { text: '孩子渐渐长大，强健起来，充满智慧，又有神的恩在他身上。', ref: '路加福音 2:40', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('natBet', 0, b.instant); W.set('natEgypt', 0, b.instant); W.set('natLampB', 0, b.instant); W.set('natGifts', 0, b.instant);
            W.set('natNaz', 1, b.instant); lampsNaz(b, 0);
            W.goTo(0.31, 7, b.instant);
            W.set('bloom', 0.85, b.instant); W.set('grass', 0.95, b.instant); W.set('herbs', 0.8, b.instant);
            rm('ox'); rm('donkey'); rm('josephnt'); rm('mary');
            sfx(b, 'bird', { soft: true });
          }],
          [1.6, () => {
            S.grow = 0.86;
            add('josephnt', look('josephnt', { x: 1.0, facing: -1, pose: 'walk', v: 0.08, glow: 0.22, prop: null }));
            add('jesus', look('jesus', { age: 'child', beard: false, x: 1.02, facing: -1, pose: 'walk', v: 0.12, glow: 0.36, scale: FIGK() * S.grow }));
            add('mary', look('mary', { x: 1.045, facing: -1, pose: 'walk', v: 0.1, glow: 0.3, carry: null, prop: null }));
            walk('josephnt', X.bench - 0.02, { speed: 0.03 });
            walk('jesus', X.bench + 0.025, { speed: 0.03 });
            walk('mary', X.josDoor - 0.012, { speed: 0.03 });
          }],
          // 到了一座城，名叫拿撒勒
          [9, b => { nameOver(b, PX(0.62), baseY(2, PX(0.62), 0) - 1.3 * PH(2), '拿撒勒', { hold: 3.2, rgb: [255, 236, 190] }); }],
          [14.2, b => { face('josephnt', 1); pose('josephnt', 'bow'); face('jesus', -1); pose('mary', 'sit'); sfx(b, 'hammer', { soft: true }); }],
          // 孩子渐渐长大……又有神的恩在他身上
          [16.4, b => { W.set('natGrace', 1, b.instant); glow('jesus', 0.5); sparkleOn(b, 'jesus', 20, [255, 240, 200], 0.5); sfx(b, 'harp', { soft: true }); }],
          [17.6, b => { S.grow = 0.93; add('jesus', { scale: FIGK() * S.grow }); sparkleOn(b, 'jesus', 12, [255, 240, 200], 0.6); }],
          [19.4, b => { S.grow = 1; add('jesus', { scale: FIGK() * S.grow }); sparkleOn(b, 'jesus', 12, [255, 240, 200], 0.7); pose('josephnt', 'stand'); face('jesus', 1); }],
          [21.6, b => { W.set('natGrace', 0.35, b.instant); }],
        ]);
      },
    },

    // ── 14 岂不知我应当以我父的事为念吗？：殿里，坐在教师中间 ───────────────
    {
      kind: 'ask', utter: '岂不知我应当以我父的事为念吗？', cmd: 'cd 我父的殿  # 三天后才找到', ref: '路加福音 2:49',
      verse: [
        { text: '当他十二岁的时候，他们按着节期的规矩上去。……<br>过了三天，就遇见他在殿里，坐在教师中间，一面听，一面问。', ref: '路加福音 2:42–46', hold: 7 },
        { text: '他母亲对他说：「我儿！为什么向我们这样行呢？<br>看哪，你父亲和我伤心来找你！」', ref: '路加福音 2:48', hold: 6 },
        { text: '耶稣说：「为什么找我呢？岂不知我应当以我父的事为念吗？」', ref: '路加福音 2:49', hold: 5 },
        { text: '他就同他们下去，回到拿撒勒，并且顺从他们。……<br>耶稣的智慧和身量，并神和人喜爱他的心，都一齐增长。', ref: '路加福音 2:51–52', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('natNaz', 0, b.instant); W.set('natGrace', 0, b.instant); W.set('natTemple', 1, b.instant);
            W.goTo(0.42, 4, b.instant); W.set('bloom', 0.6, b.instant);
            rm('josephnt'); rm('mary');
            S.grow = 1.08;
            add('jesus', look('jesus', { age: 'child', beard: false, x: X.boy, facing: -1, pose: 'sit', v: 0.3, glow: 0.4, scale: FIGK() * S.grow }));
            place('jesus', X.boy); pose('jesus', 'sit'); face('jesus', -1);
            const f = fig('jesus'); if (f) { f.v = 0.3; VT.delete('jesus'); }
            [['teach1', X.t1, 1, 0.22], ['teach2', X.t2, 1, 0.3], ['teach3', X.t3, -1, 0.3], ['teach4', X.t4, -1, 0.22]].forEach(([id, x, fc, v], i) => {
              add(id, { label: '教师', sex: 'm', age: 'elder', x, facing: fc, pose: 'sit', robe: [[190, 182, 164], [150, 132, 110], [172, 160, 140], [126, 118, 104]][i], accent: [226, 220, 204], glow: 0.14, prop: null, v, beard: true });
            });
            crowd('pilgrims', { n: PORT ? 3 : 5, x0: X.pil0, x1: X.pil1, layer: 2, label: '过节的人', prop: null }, dressAs(TRAV, 0.34, 0.5));
            sfx(b, 'crowd', { soft: true });
          }],
          [1.4, () => {
            add('mary', look('mary', { x: PX(0.53), facing: 1, pose: 'walk', v: 0.14, glow: 0.3, carry: null, prop: null }));
            add('josephnt', look('josephnt', { x: PX(0.51), facing: 1, pose: 'walk', v: 0.1, glow: 0.2, prop: null }));
            walk('mary', PX(0.61), { speed: 0.03, pose: 'gaze' }); walk('josephnt', PX(0.592), { speed: 0.03, pose: 'gaze' });
          }],
          [5.6, () => { walk('mary', X.seekM, { speed: 0.03 }); walk('josephnt', X.seekJ, { speed: 0.03 }); }],
          // 他母亲对他说
          [9.4, () => { face('mary', 1); face('josephnt', 1); pose('mary', 'raise'); face('jesus', -1); }],
          [13, () => { pose('mary', 'stand'); }],
          // 岂不知我应当以我父的事为念吗？
          [15.8, b => {
            pose('jesus', 'stand'); glow('jesus', 0.55);
            W.set('natTempleLight', 1, b.instant);
            face('teach1', 1); face('teach2', 1); face('teach3', -1); face('teach4', -1);
            sfx(b, 'harp');
          }],
          // 他就同他们下去
          [22, b => {
            walk('jesus', X.seekM + 0.018, { speed: 0.03 });
            W.goTo(0.745, 7, b.instant); W.set('natTempleLight', 0.45, b.instant);
          }],
          [24, () => {
            hands('jesus', 'mary', true);
            walk('mary', PX(0.6), { speed: 0.022 }); walk('jesus', PX(0.6) + 0.02, { speed: 0.022 }); walk('josephnt', PX(0.58), { speed: 0.022 });
          }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本幕
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '道成肉身', sub: '约翰福音 1 · 路加福音 1 — 2 · 马太福音 1 — 2', tint: [255, 236, 200], music: 'eden',
    outro: 22,
    // 幕启：黑暗里等候从高天临到的清晨的日光
    intro: [
      { text: '因我们神怜悯的心肠，叫清晨的日光从高天临到我们，<br>要照亮坐在黑暗中死荫里的人，把我们的脚引到平安的路上。', ref: '路加福音 1:78–79', hold: 8 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本幕的人与物，显出它的经文
    behold: {
      '马利亚': { text: '马利亚说：「我是主的使女，情愿照你的话成就在我身上。」', ref: '路加福音 1:38' },
      '约瑟': { text: '她丈夫约瑟是个义人，不愿意明明地羞辱她，想要暗暗地把她休了。', ref: '马太福音 1:19' },
      '加百列': { text: '到了第六个月，天使加百列奉神的差遣往加利利的一座城去（这城名叫拿撒勒），', ref: '路加福音 1:26' },
      '伊利莎白': { text: '伊利莎白一听马利亚问安，所怀的胎就在腹里跳动。伊利莎白且被圣灵充满，', ref: '路加福音 1:41' },
      '撒迦利亚的家': { text: '进了撒迦利亚的家，问伊利莎白安。', ref: '路加福音 1:40' },
      '拿撒勒': { text: '到了一座城，名叫拿撒勒，就住在那里。', ref: '马太福音 2:23' },
      '驴': { text: '约瑟也从加利利的拿撒勒城上犹太去，到了大卫的城，名叫伯利恒，', ref: '路加福音 2:4' },
      '众人': { text: '众人各归各城，报名上册。', ref: '路加福音 2:3' },
      '客店': { text: '就生了头胎的儿子，用布包起来，放在马槽里，因为客店里没有地方。', ref: '路加福音 2:7' },
      '马槽': { text: '就生了头胎的儿子，用布包起来，放在马槽里，因为客店里没有地方。', ref: '路加福音 2:7' },
      '马棚': { text: '他们在那里的时候，马利亚的产期到了，', ref: '路加福音 2:6' },
      '婴孩': { text: '他们急忙去了，就寻见马利亚和约瑟，又有那婴孩卧在马槽里；', ref: '路加福音 2:16' },
      '牛': { text: '牛认识主人，驴认识主人的槽，', ref: '以赛亚书 1:3' },
      '伯利恒': { text: '犹大地的伯利恒啊，你在犹大诸城中并不是最小的；', ref: '马太福音 2:6' },
      '牧羊的人': { text: '牧羊的人回去了，因所听见所看见的一切事，正如天使向他们所说的，就归荣耀与神，赞美他。', ref: '路加福音 2:20' },
      '羊群': { text: '在伯利恒之野地里有牧羊的人，夜间按着更次看守羊群。', ref: '路加福音 2:8' },
      '主的使者': { text: '有主的使者站在他们旁边，主的荣光四面照着他们；牧羊的人就甚惧怕。', ref: '路加福音 2:9' },
      '天兵': { text: '在至高之处荣耀归与神！在地上平安归与他所喜悦的人！', ref: '路加福音 2:14' },
      '星': { text: '他们看见那星，就大大地欢喜；', ref: '马太福音 2:10' },
      '博士': { text: '「那生下来作犹太人之王的在哪里？我们在东方看见他的星，特来拜他。」', ref: '马太福音 2:2' },
      '骆驼': { text: '博士因为在梦中被主指示不要回去见希律，就从别的路回本地去了。', ref: '马太福音 2:12' },
      '礼物': { text: '揭开宝盒，拿黄金、乳香、没药为礼物献给他。', ref: '马太福音 2:11' },
      '耶稣': { text: '耶稣的智慧和身量，并神和人喜爱他的心，都一齐增长。', ref: '路加福音 2:52' },
      '教师': { text: '凡听见他的，都希奇他的聪明和他的应对。', ref: '路加福音 2:47' },
      '过节的人': { text: '每年到逾越节，他父母就上耶路撒冷去。', ref: '路加福音 2:41' },
      '殿': { text: '过了三天，就遇见他在殿里，坐在教师中间，一面听，一面问。', ref: '路加福音 2:46' },
    },
  });
})(window.GS);
