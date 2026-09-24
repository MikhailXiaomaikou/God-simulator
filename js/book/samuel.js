/* ─────────────────────────────────────────────────────────────
 * book/samuel.js —— 撒母耳记上 · 撒母耳（撒母耳记上 1 — 15）
 *
 * 以法莲山地：左边是拉玛（以利加拿与哈拿的家），右边是示罗耶和华的殿——石墙、门框、殿顶覆着
 * 染红的公羊皮；殿门之内，神的灯与约柜。哈拿在殿前痛哭祈祷，以利坐在门框旁的位上看她的嘴；
 * 「耶和华顾念哈拿」——撒母耳生在拉玛。断了奶，孩子被带上示罗，归与耶和华；哈拿的歌，
 * 灰尘里升起的微光。以利的两个儿子藐视祭物，坛上的烟低沉；神人来见以利。
 * 夜里，神的灯还没有熄灭（本卷的签名）：「撒母耳！」孩子三次跑到以利那里；第四次，
 * 耶和华又来站着——一根从天到地的光立在殿门前，孩子跪下：「请说，仆人敬听！」天亮了，
 * 从但到别是巴，远山上一处一处亮起灯来。
 * 往西（右边，日落之处）是非利士地：以便以谢的两营；约柜被抬出、被掳去；以利往后跌倒；
 * 殿上的荣光熄灭——「以迦博」以黑暗聚成。亚实突的大衮庙：两个清早，大衮仆倒在约柜前，
 * 头和两手折断在门槛上；两只有乳的母牛拉着新车，一面走一面叫，直往伯示麦的麦田。
 * 米斯巴：打水浇在耶和华面前；耶和华大发雷声，惊乱非利士人；以便以谢的石头在夕照里立起。
 * 拉玛：长老求立王——「他们不是厌弃你，乃是厌弃我」。扫罗来了，比众民高过一头；
 * 黎明时膏油倒在他头上。米斯巴掣签，他藏在器具中。吉甲：割麦子的时候打雷降雨。
 * 密抹的隘口：约拿单与拿兵器的爬上播薛，地也震动。亚玛力：羊叫牛鸣；「听命胜于献祭」；
 * 衣襟撕断，膏油的光离开扫罗，落在远山（伯利恒）之上；撒母耳在拉玛为扫罗悲伤。
 *
 * 画面的方位：日出在左（东），日落在右（西）。左 = 拉玛；中 = 示罗 / 米斯巴 / 吉甲；
 *            右 = 非利士地（亚弗、亚实突）、伯示麦、密抹的隘口。中丘上是基列耶琳（约柜在那里二十年）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'samuel';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('smHouse', 'exp', 0.5);     // 示罗耶和华的殿
  W.defineLevel('smGlory', 'exp', 0.3);     // 殿上的荣光（4:21 离开以色列）
  W.defineLevel('smLamp', 'exp', 0.6);      // 神的灯（3:3）
  W.defineLevel('smAltar', 'exp', 0.5);     // 殿前坛上的火
  W.defineLevel('smSour', 'exp', 0.4);      // 祭物被藐视：烟低沉（2:17）
  W.defineLevel('smPresence', 'exp', 0.45); // 耶和华又来站着（3:10）
  W.defineLevel('smKnown', 'lin', 0.14);    // 从但到别是巴（3:20）
  W.defineLevel('smRamah', 'exp', 0.5);     // 拉玛
  W.defineLevel('smCampI', 'exp', 0.5);     // 以色列人的营（4:1）
  W.defineLevel('smCampP', 'exp', 0.5);     // 非利士人的营
  W.defineLevel('smDagon', 'exp', 0.5);     // 亚实突的大衮庙（5:2）
  W.defineLevel('smFall', 'lin', 1.3);      // 大衮仆倒（0 立着 → 1 脸伏于地）
  W.defineLevel('smBroken', 'exp', 0.9);    // 头和两手折断在门槛上（5:4）
  W.defineLevel('smPlague', 'exp', 0.4);    // 耶和华的手重重加在亚实突（5:6）
  W.defineLevel('smWheat', 'lin', 0.28);    // 麦田（6:13；12:17）
  W.defineLevel('smGold', 'exp', 0.35);     // 麦熟
  W.defineLevel('smEben', 'lin', 0.32);     // 以便以谢的石头立起（7:12）
  W.defineLevel('smEbenLit', 'exp', 0.5);
  W.defineLevel('smRoyal', 'exp', 0.5);     // 扫罗头上膏油的光（10:1）
  W.defineLevel('smBag', 'exp', 0.8);       // 器具（10:22）
  W.defineLevel('smCrags', 'lin', 0.4);     // 密抹的隘口：西尼与播薛（14:4）
  W.defineLevel('smRout', 'lin', 0.35);     // 防营战兢、溃散（14:15）
  W.defineLevel('smStar', 'exp', 0.3);      // 比你更好的人：远山上的一点光（15:28）
  W.defineLevel('smAlt2', 'exp', 0.6);      // 田野里的坛（米斯巴、吉甲）
  W.defineLevel('smAlt2Fire', 'exp', 0.5);
  W.defineLevel('smEliBed', 'exp', 0.6);    // 以利睡卧的地方（3:2）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  // 经文显在左边的海上，故一切要紧的事都在 x ≥ 0.5 的地上发生
  const X = {
    ramah: 0.527,                  // 拉玛
    house: 0.668,                  // 示罗耶和华的殿（殿门的中线）
    altar: 0.59,                   // 殿前的坛
    seat: 0.624,                   // 以利的位，在门框旁
    hannah: 0.655,                 // 哈拿在耶和华面前祈祷
    bed: 0.678,                    // 撒母耳睡在殿门前
    pres: 0.636,                   // 耶和华又来站着
    eliBed: 0.772,                 // 以利睡卧的地方
    campI: [0.758, 0.795], campP: [0.878, 0.91, 0.942, 0.974],
    dagon: 0.868,                  // 亚实突的大衮庙
    field6: 0.705,                 // 伯示麦的麦田
    kj: 0.598,                     // 基列耶琳（中丘）
    mizpah: 0.636, eben: 0.792,    // 米斯巴；以便以谢
    gate: 0.585,                   // 城门 / 城角
    bag: 0.888,                    // 器具
    field12: 0.672,                // 吉甲的麦田
    cragL: 0.812, cragR: 0.905, pass: 0.858,
    star: 0.618,                   // 远山上的光（伯利恒）
  };
  const ROBE = {
    elkanah: [122, 104, 84], hannah: [172, 102, 118], peninnah: [152, 128, 90], kid1: [164, 142, 104], kid2: [136, 110, 96],
    eli: [218, 210, 190], hophni: [190, 168, 136], phinehas: [170, 146, 120], linen: [240, 236, 224],
    samuel: [198, 190, 172], samOld: [180, 170, 150], mangod: [112, 104, 96], runner: [118, 96, 80],
    saul: [126, 92, 74], servant: [142, 122, 98], jonathan: [98, 108, 142], armor: [124, 106, 86], agag: [150, 66, 58],
    phil: [178, 92, 66], elder: [150, 132, 106],
  };
  const GOLD = [232, 192, 98], STONE = [206, 188, 152], CEDAR = [138, 98, 62];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { ark: 'house', arkBy: null, lots: 0, torn: 0, fieldX: X.field6, alt2X: X.mizpah - 0.03, idolUp: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const phone = () => W.w < 600;
  const LS = l => W.layerScale(l) * (phone() ? 1.15 : 1);
  const PH = l => 34 * W.layerScale(l) * (phone() ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1);   // 人的身高（像素），与人物模块一致
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
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(9310); for (let i = 0; i < 1024; i++) RT.push(r()); })();
  const rt = i => RT[((i % 1024) + 1024) % 1024];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (!fig(id)) return; const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function place(id, x, layer) { if (fig(id)) C().place(id, x, layer); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  function carry(id, what) { const c = C(); if (c.carry && fig(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && fig(a) && fig(b)) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function members(gid) { const c = C(); const g = c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; }
  function crowdFace(gid, d) { members(gid).forEach(m => { if (m.tx != null && !W.replaying) m.faceEnd = d; else { m.facing = d; if (W.replaying) m.fd = d; } }); }
  function crowdLabel(gid, label) { members(gid).forEach(m => { m.label = label; }); }
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
  // 地上的走兽绕开人与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    return [x, y - PH(l) * (f.age === 'elder' ? 0.96 : f.age === 'child' ? 0.62 : 1) * (f.scale || 1) * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某处聚成字（微尘自 src 而来）
  function nameHere(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const size = (o.size || 0.04) * M(), n = Array.from(str).length;
    const c = nameAt(x, y - size * 0.9, size, n);
    const src = o.src || (() => [x + rand(-60, 60) * SU(), y + rand(-20, 30) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 2.6, delay: o.delay, dark: o.dark, dot: o.dot });
    const a = au();
    if (a && a.nameChime && !o.dark) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  function nameOver(b, id, str, rgb, o) {
    const p = figPt(id, 1);
    if (!p) return;
    o = o || {};
    const src = o.src || (() => { const q = figPt(id, 0.5) || p; return [q[0] + rand(-40, 40) * SU(), q[1] + rand(-20, 30) * SU()]; });
    nameHere(b, str, p[0], p[1] - (o.lift || 0.4) * PH(2), rgb, Object.assign({}, o, { src }));
  }
  function ringAt(b, x, y, rgb, r, dur, wd) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, wd || 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().dust(x, y, n || 20, rgb || [214, 184, 140], spread || 14); }
  function sparkOn(b, id, n, rgb) { const p = figPt(id, 0.6); if (p) sparkAt(b, p[0], p[1], n || 24, rgb || [255, 240, 210], 12, 'top'); }

  // ── 画面上转瞬即逝的效果（只关乎画面；瞬间重演时不存在）────────
  const FXL = [];
  function fxl(b, e) { if (b.instant) return; e.t = 0; FXL.push(e); }
  function beamAt(b, xf, o) { o = o || {}; fxl(b, { type: 'beam', xf, dur: o.dur || 6, w: o.w || 1.6, k: o.k || 1, white: !!o.white, l: o.l == null ? 2 : o.l }); }
  function beamOn(b, id, o) { const f = fig(id); if (f) beamAt(b, f.tx != null ? f.tx : f.nx, o); }

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
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([244, 246, 255], 1),
      pale: radial([232, 228, 255], 1), ember: radial([255, 96, 40], 1), smoke: radial([132, 124, 118], 0.8, 0.55),
      grey: radial([96, 92, 90], 0.85, 0.55), dark: radial([20, 14, 10], 1, 0.5), dawn: radial([255, 206, 150], 1),
    };
    SP.beam = shaft([255, 247, 226], [[0, 0.1], [0.75, 0.85], [1, 0]]);
    // 耶和华又来站着：自天而下的光柱（下亮上淡）
    SP.col = shaft([250, 246, 236], [[0, 0], [0.35, 0.18], [0.8, 0.75], [0.94, 1], [1, 0.5]]);
    // 立着的光：一道竖长的椭圆
    const f = cnv(64, 256), fg = f.getContext('2d');
    fg.save(); fg.scale(1, 4);
    const fr = fg.createRadialGradient(32, 34, 0, 32, 34, 32);
    fr.addColorStop(0, 'rgba(255,252,240,1)'); fr.addColorStop(0.3, 'rgba(255,246,222,0.75)'); fr.addColorStop(0.62, 'rgba(255,236,200,0.22)'); fr.addColorStop(1, 'rgba(255,230,190,0)');
    fg.fillStyle = fr; fg.fillRect(0, 0, 64, 64);
    fg.restore();
    SP.form = f;
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a, sy) {
    if (a < 0.003 || !sp || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(sp, x - r, y - ry, r * 2, ry * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  画：火与烟
  // ════════════════════════════════════════════════════════════
  function flame(ctx, x, y, h, k, seed, sour) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    const g = h * 2.2;
    glowSp(ctx, sour ? SP.ember : SP.warm, x, y - h * 0.45, g, k * (0.3 + 0.45 * nightK()) * (sour ? 0.6 : 1));
    const T4 = sour
      ? [[0, 0.7, 'rgb(190,70,36)', 0.6], [-0.24, 0.5, 'rgb(170,64,34)', 0.55], [0.22, 0.52, 'rgb(180,72,40)', 0.5], [0, 0.34, 'rgb(230,130,70)', 0.6]]
      : [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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
  // 烟：sour > 0 时又灰又沉，贴着地面散开（被藐视的祭物）
  function smoke(ctx, x, y, k, H, w, seed, sour) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 11, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.075 + i / N + seed * 0.37);
      const rise = lerp(1, 0.22, sour), spread = lerp(0.35, 1.4, sour);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 * (1 - sour * 0.5) + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * spread * ph + (sour ? (i % 2 ? 1 : -1) * ph * w * 3 * sour : 0);
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(sour > 0.5 ? SP.grey : SP.smoke, x + drift - s, y - ph * H * rise + (sour ? ph * ph * w * 2 * sour : 0) - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：约柜（金的柜，施恩座上两个基路伯，翅膀相对）
  // ════════════════════════════════════════════════════════════
  function drawArkAt(ctx, x, b, w, a, lit, poles) {
    if (a < 0.01) return;
    SP || sprites();
    const h = w * 0.62;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, b - h * 0.9, w * (2.6 + 1.6 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 1.1)), a * (0.14 + 0.36 * nightK()) * (lit == null ? 1 : lit));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    if (poles) {
      ctx.strokeStyle = css([150, 112, 56], 2); ctx.lineWidth = Math.max(1, w * 0.1); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(poles[0], b - h * 0.35); ctx.lineTo(poles[1], b - h * 0.35); ctx.stroke();
    }
    ctx.fillStyle = css(GOLD, 2, 1, 0.2);
    ctx.fillRect(x - w, b - h, w * 2, h);
    ctx.fillStyle = css([178, 134, 60], 2, 1, 0.08);
    ctx.fillRect(x - w, b - h * 0.45, w * 2, h * 0.12);
    ctx.fillRect(x - w, b - h * 0.1, w * 2, h * 0.1);
    // 施恩座与两个基路伯
    ctx.fillStyle = css([248, 216, 132], 2, 1, 0.28);
    ctx.fillRect(x - w * 1.06, b - h - w * 0.12, w * 2.12, w * 0.12);
    ctx.beginPath();
    const ct = b - h - w * 0.12;
    for (const d of [-1, 1]) {
      const cx0 = x + d * w * 0.72;
      ctx.moveTo(cx0 - w * 0.1, ct); ctx.lineTo(cx0 + d * w * 0.06, ct - w * 0.34); ctx.lineTo(cx0 + w * 0.1, ct); ctx.closePath();
      ctx.moveTo(cx0 + d * w * 0.03, ct - w * 0.3);
      ctx.quadraticCurveTo(cx0 - d * w * 0.2, ct - w * 0.72, cx0 - d * w * 0.66, ct - w * 0.42);
      ctx.quadraticCurveTo(cx0 - d * w * 0.3, ct - w * 0.46, cx0 - d * w * 0.05, ct - w * 0.18);
      ctx.closePath();
    }
    ctx.fill();
    const lx = litX() >= x ? 1 : -1;
    ctx.strokeStyle = U.rgba(255, 242, 200, a * (0.5 * dayA() + 0.35 * nightK()));
    ctx.lineWidth = Math.max(0.6, w * 0.07);
    ctx.beginPath(); ctx.moveTo(x - w * 1.06, ct); ctx.lineTo(x + w * 1.06, ct); ctx.moveTo(x + lx * w, b - h); ctx.lineTo(x + lx * w, b); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const arkW = () => 0.36 * PH(2);

  // ════════════════════════════════════════════════════════════
  //  画：示罗耶和华的殿（正面：石墙、门框、殿顶覆着染红的公羊皮；门内是神的灯与约柜）
  // ════════════════════════════════════════════════════════════
  function houseGeo() {
    const ph = PH(2), x = X.house * W.w, g = gY(2, X.house);
    const hw = Math.min(2.1 * ph, 0.078 * W.w), H = 2.45 * ph, base = g + 0.1 * ph;
    const dw = hw * 0.38, dh = 1.66 * ph;
    return { ph, x, g, hw, H, base, top: base - H, dw, dh, sill: base - 0.12 * ph };
  }
  function drawGlory(ctx) {
    const k = W.lv.smGlory * W.lv.smHouse;
    if (k < 0.01) return;
    SP || sprites();
    const G = houseGeo(), br = 0.9 + 0.1 * Math.sin(W.t * 0.5);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, G.x, G.top - 0.2 * G.ph, G.hw * 2.4 + 1.8 * G.ph, k * br * (0.1 + 0.3 * nightK()), 0.8);
    // 殿上的一片光云
    for (let i = 0; i < 5; i++) {
      const q = U.fract(W.t * 0.03 + i / 5), yy = G.top - G.ph * (0.6 + q * 2.4), r = G.hw * (0.8 + q * 0.6);
      glowSp(ctx, SP.white, G.x + Math.sin(W.t * 0.2 + i * 2) * G.hw * 0.3, yy, r, k * 0.08 * Math.sin(q * Math.PI) * (0.5 + 0.5 * nightK()), 0.5);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawHouse(ctx) {
    const a = W.lv.smHouse;
    if (a < 0.005) return;
    SP || sprites();
    const G = houseGeo(), { ph, x, hw, H, base, top, dw, dh, sill } = G, l = 2;
    const nk = nightK(), lamp = W.lv.smLamp, lx = litX() >= x ? 1 : -1;
    ctx.globalAlpha = a;
    // 台基
    ctx.fillStyle = css([150, 134, 108], l);
    ctx.fillRect(x - hw * 1.12, base - 0.14 * ph, hw * 2.24, 0.14 * ph + 0.22 * ph);
    ctx.fillStyle = css([226, 212, 184], l, 0.35 * dayA(), 0.2);
    ctx.fillRect(x - hw * 1.12, base - 0.14 * ph, hw * 2.24, Math.max(1, 0.03 * ph));
    // 墙（夜里受一点月光）
    const moon = 0.1 * nk * W.lv.moon;
    ctx.fillStyle = css(STONE, l, 1, moon);
    ctx.fillRect(x - hw, top, hw * 2, H - 0.14 * ph);
    // 石层
    ctx.strokeStyle = css([150, 134, 104], l, 0.45);
    ctx.lineWidth = Math.max(0.5, 0.025 * ph);
    ctx.beginPath();
    for (let r = 1; r < 7; r++) {
      const y = top + (H - 0.14 * ph) * r / 7;
      ctx.moveTo(x - hw, y); ctx.lineTo(x + hw, y);
      const off = (r % 2) * 0.5;
      for (let c = 0; c < 5; c++) { const xx = x - hw + hw * 2 * (c + off) / 5; ctx.moveTo(xx, y); ctx.lineTo(xx, y - (H - 0.14 * ph) / 7); }
    }
    ctx.stroke();
    // 背光的一侧
    ctx.fillStyle = css([120, 104, 82], l, 0.28);
    ctx.fillRect(lx > 0 ? x - hw : x + hw * 0.7, top, hw * 0.3, H - 0.14 * ph);
    // 殿顶：会幕的罩棚——海狗皮与染红的公羊皮
    ctx.fillStyle = css([150, 132, 104], l);
    ctx.fillRect(x - hw * 1.06, top - 0.1 * ph, hw * 2.12, 0.12 * ph);
    ctx.fillStyle = css([78, 60, 52], l);
    ctx.beginPath();
    ctx.moveTo(x - hw * 1.04, top - 0.08 * ph);
    ctx.quadraticCurveTo(x - hw * 0.5, top - 0.62 * ph, x, top - 0.66 * ph);
    ctx.quadraticCurveTo(x + hw * 0.5, top - 0.62 * ph, x + hw * 1.04, top - 0.08 * ph);
    for (let i = 8; i >= 0; i--) { const xx = x - hw * 1.04 + hw * 2.08 * i / 8; ctx.lineTo(xx, top + (i % 2 ? 0.12 : 0.02) * ph); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([150, 58, 52], l, 0.9, 0.05);
    ctx.lineWidth = Math.max(1, 0.07 * ph);
    ctx.beginPath();
    ctx.moveTo(x - hw * 1.0, top - 0.02 * ph);
    ctx.quadraticCurveTo(x - hw * 0.5, top - 0.5 * ph, x, top - 0.54 * ph);
    ctx.quadraticCurveTo(x + hw * 0.5, top - 0.5 * ph, x + hw * 1.0, top - 0.02 * ph);
    ctx.stroke();
    ctx.strokeStyle = css([236, 214, 180], l, 0.35 * dayA() + 0.15 * nk, 0.2);
    ctx.lineWidth = Math.max(0.6, 0.03 * ph);
    ctx.beginPath();
    ctx.moveTo(x - hw * 1.04, top - 0.08 * ph);
    ctx.quadraticCurveTo(x - hw * 0.5, top - 0.62 * ph, x, top - 0.66 * ph);
    ctx.quadraticCurveTo(x + hw * 0.5, top - 0.62 * ph, x + hw * 1.04, top - 0.08 * ph);
    ctx.stroke();
    // 夜里，门里的灯把殿的正面照暖
    const wash = lamp * nk * a;
    if (wash > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, x, sill - dh * 0.5, hw * 1.25, wash * 0.22, 0.95);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 门洞：殿内昏暗，夜里被灯照暖
    const d0 = x - dw, d1 = x + dw, dt = sill - dh;
    const ig = ctx.createLinearGradient(0, dt, 0, sill);
    ig.addColorStop(0, css([26, 20, 18], l)); ig.addColorStop(1, css([54, 40, 30], l));
    ctx.fillStyle = ig;
    ctx.fillRect(d0, dt, dw * 2, dh);
    // 殿内：神的灯（七盏）与约柜
    const warm = lamp * (0.35 + 0.65 * nk);
    if (warm > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, x, sill - dh * 0.45, dw * 1.5, a * warm * 0.55, 1.1);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 约柜在殿内（门内深处）
    if (S.ark === 'house') drawArkAt(ctx, x + dw * 0.32, sill - dh * 0.05, arkW() * 0.72, a, 0.8 + 0.6 * W.lv.smPresence, null);
    ctx.globalAlpha = a;
    drawMenorah(ctx, x - dw * 0.48, sill - dh * 0.02, dh * 0.42, a, lamp);
    ctx.globalAlpha = a;
    // 门框（1:9）与门楣
    ctx.fillStyle = css(CEDAR, l, 1, 0.04);
    const pw = Math.max(1.5, 0.12 * ph);
    ctx.fillRect(d0 - pw, dt - pw, pw, dh + pw);
    ctx.fillRect(d1, dt - pw, pw, dh + pw);
    ctx.fillRect(d0 - pw * 1.6, dt - pw * 1.8, dw * 2 + pw * 3.2, pw * 1.1);
    ctx.fillStyle = css(GOLD, l, 0.8, 0.1);
    ctx.fillRect(d0 - pw * 1.6, dt - pw * 0.8, dw * 2 + pw * 3.2, Math.max(0.8, pw * 0.25));
    ctx.strokeStyle = css([240, 220, 180], l, 0.4 * dayA() + 0.2 * nk * lamp, 0.2);
    ctx.lineWidth = Math.max(0.6, 0.03 * ph);
    ctx.beginPath(); ctx.moveTo(x + lx * hw, top); ctx.lineTo(x + lx * hw, base - 0.14 * ph); ctx.moveTo(x - hw * 1.06, top - 0.1 * ph); ctx.lineTo(x + hw * 1.06, top - 0.1 * ph); ctx.stroke();
    // 夜里，门里的光铺在门前的地上（撒母耳睡在那里）
    if (warm > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, x, sill + 0.35 * ph, dw * 2.6, a * warm * 0.4 * nk, 0.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 神的灯：一座灯台，七个灯盏
  function drawMenorah(ctx, x, b, h, a, lamp) {
    const l = 2;
    ctx.globalAlpha = a;
    ctx.strokeStyle = css(GOLD, l, 1, 0.15 + 0.25 * lamp * nightK());
    ctx.lineWidth = Math.max(0.8, h * 0.06);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, b); ctx.lineTo(x, b - h);
    ctx.moveTo(x - h * 0.2, b); ctx.lineTo(x + h * 0.2, b);
    for (let i = 1; i <= 3; i++) {
      const r = h * 0.13 * i;
      ctx.moveTo(x - r, b - h); ctx.quadraticCurveTo(x - r, b - h * 0.5 + i * h * 0.02, x, b - h * 0.5 + i * h * 0.04);
      ctx.moveTo(x + r, b - h); ctx.quadraticCurveTo(x + r, b - h * 0.5 + i * h * 0.02, x, b - h * 0.5 + i * h * 0.04);
    }
    ctx.stroke();
    if (lamp < 0.01) { ctx.globalAlpha = 1; return; }
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const nk = nightK();
    for (let i = -3; i <= 3; i++) {
      const fx0 = x + i * h * 0.13, fy = b - h - h * 0.04, fl = 0.85 + 0.15 * Math.sin(W.t * (7 + i) + i * 1.7);
      glowSp(ctx, SP.warm, fx0, fy - h * 0.05, h * 0.28, a * lamp * fl * (0.25 + 0.6 * nk));
      ctx.globalAlpha = a * lamp * fl;
      ctx.fillStyle = 'rgb(255,226,150)';
      ctx.beginPath(); ctx.ellipse(fx0, fy - h * 0.05, h * 0.028, h * 0.07 * fl, 0, 0, TAU); ctx.fill();
    }
    glowSp(ctx, SP.gold, x, b - h, h * 1.4, a * lamp * (0.15 + 0.45 * nk));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 以利的位（门框旁的石座）、以利睡卧的地方、撒母耳的席子
  function drawShiloh(ctx) {
    const a = W.lv.smHouse;
    if (a < 0.005) return;
    const ph = PH(2), l = 2;
    ctx.globalAlpha = a;
    // 石座
    const sx = X.seat * W.w, sy = gY(2, X.seat) + 0.04 * ph, sw = 0.26 * ph;
    ctx.fillStyle = css([164, 148, 120], l);
    ctx.fillRect(sx - sw, sy - 0.3 * ph, sw * 2, 0.3 * ph);
    ctx.fillRect(sx - sw * 1.15, sy - 0.34 * ph, sw * 2.3, 0.06 * ph);
    // 以利睡卧的地方：一个小棚
    const ex = X.eliBed * W.w, ey = gY(2, X.eliBed) + 0.04 * ph, ew = Math.min(0.9 * ph, 0.03 * W.w);
    ctx.globalAlpha = a * W.lv.smEliBed;
    ctx.strokeStyle = css([96, 78, 58], l);
    ctx.lineWidth = Math.max(1, 0.05 * ph);
    ctx.beginPath(); ctx.moveTo(ex - ew, ey); ctx.lineTo(ex - ew, ey - 1.0 * ph); ctx.moveTo(ex + ew, ey); ctx.lineTo(ex + ew, ey - 0.84 * ph); ctx.stroke();
    ctx.fillStyle = css([184, 168, 140], l, 0.9);
    ctx.beginPath(); ctx.moveTo(ex - ew * 1.25, ey - 1.02 * ph); ctx.lineTo(ex + ew * 1.25, ey - 0.84 * ph); ctx.lineTo(ex + ew * 1.2, ey - 0.74 * ph); ctx.lineTo(ex - ew * 1.2, ey - 0.9 * ph); ctx.closePath(); ctx.fill();
    // 席子
    ctx.fillStyle = css([196, 178, 140], l, 0.8);
    const m1 = X.bed * W.w, my1 = fieldY(X.bed, 0.05) + 0.02 * ph;
    ctx.beginPath(); ctx.ellipse(ex, ey + 0.02 * ph, 0.55 * ph, 0.06 * ph, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = a;
    ctx.beginPath(); ctx.ellipse(m1, my1, 0.55 * ph, 0.06 * ph, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：拉玛（撒母耳的家）
  // ════════════════════════════════════════════════════════════
  const RAMAH = (function () {
    const r = U.mulberry32(3301), hs = [];
    for (let i = 0; i < 7; i++) hs.push({ ox: -1 + 2 * (i + 0.5) / 7 + (r() - 0.5) * 0.12, w: 0.24 + r() * 0.12, h: 0.55 + r() * 0.6, win: r() < 0.75, door: r() < 0.5, tw: r() * TAU, stair: r() < 0.3 });
    hs.sort((a, b) => b.h - a.h);
    return hs;
  })();
  function drawRamah(ctx) {
    const a = W.lv.smRamah;
    if (a < 0.005) return;
    const ph = PH(2), l = 2, x = X.ramah * W.w, hwR = Math.min(1.35 * ph, 0.036 * W.w);
    const body = [192, 170, 134], side = [150, 128, 100], lx = litX() >= x ? 1 : -1, nk = nightK();
    ctx.globalAlpha = a;
    const wins = [];
    for (const h of RAMAH) {
      const hx = x + h.ox * hwR, g = gY(2, hx / W.w) + 0.08 * ph, hh = h.h * ph, ww = h.w * hwR * 1.1;
      ctx.fillStyle = css(body, l);
      ctx.fillRect(hx - ww, g - hh, ww * 2, hh);
      ctx.fillStyle = css(side, l, 0.85);
      ctx.fillRect(lx > 0 ? hx - ww : hx + ww * 0.45, g - hh, ww * 0.55, hh);
      ctx.fillStyle = css([150, 130, 100], l);
      ctx.fillRect(hx - ww * 1.06, g - hh - 0.05 * ph, ww * 2.12, 0.06 * ph);
      if (h.door) { ctx.fillStyle = css([40, 30, 26], l); ctx.fillRect(hx - ww * 0.2, g - 0.42 * ph, ww * 0.4, 0.42 * ph); }
      if (h.win) wins.push([hx + ww * 0.35 * (h.door ? 1 : 0), g - hh * 0.62, h.tw]);
      ctx.strokeStyle = css([236, 220, 190], l, 0.35 * dayA(), 0.2);
      ctx.lineWidth = Math.max(0.5, 0.03 * ph);
      ctx.beginPath(); ctx.moveTo(hx - ww * 1.06, g - hh - 0.05 * ph); ctx.lineTo(hx + ww * 1.06, g - hh - 0.05 * ph); ctx.stroke();
    }
    ctx.fillStyle = css([34, 26, 22], l);
    const ws = Math.max(1.2, 0.07 * ph);
    for (const w of wins) ctx.fillRect(w[0] - ws / 2, w[1], ws, ws * 1.4);
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,182,100)';
      for (const w of wins) { ctx.globalAlpha = a * nk * (0.55 + 0.35 * Math.sin(W.t * 0.8 + w[2])); ctx.fillRect(w[0] - ws / 2, w[1], ws, ws * 1.4); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：两营（4:1）——以色列人的黑帐棚，非利士人的白帐棚
  // ════════════════════════════════════════════════════════════
  function drawTent(ctx, xf, kind, a, seed) {
    if (a < 0.01) return;
    const ph = PH(2), l = 2, x = xf * W.w, y = gY(2, xf) + 0.06 * ph, hw = Math.min(1.15 * ph, 0.03 * W.w), h = 0.92 * ph;
    ctx.globalAlpha = a;
    if (kind === 'I') {
      ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.02 * ph);
      ctx.beginPath(); ctx.moveTo(x - 0.6 * hw, y - 0.8 * h); ctx.lineTo(x - 1.3 * hw, y); ctx.moveTo(x + 0.6 * hw, y - 0.8 * h); ctx.lineTo(x + 1.3 * hw, y); ctx.stroke();
      ctx.fillStyle = css([56, 46, 42], l);
      ctx.beginPath();
      ctx.moveTo(x - hw, y); ctx.lineTo(x - 0.94 * hw, y - 0.42 * h); ctx.lineTo(x - 0.6 * hw, y - 0.86 * h); ctx.lineTo(x - 0.3 * hw, y - 0.74 * h);
      ctx.lineTo(x, y - h); ctx.lineTo(x + 0.3 * hw, y - 0.76 * h); ctx.lineTo(x + 0.62 * hw, y - 0.86 * h); ctx.lineTo(x + 0.94 * hw, y - 0.44 * h); ctx.lineTo(x + hw, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([30, 24, 22], l);
      ctx.fillRect(x - 0.18 * hw, y - 0.5 * h, 0.36 * hw, 0.5 * h);
    } else {
      ctx.fillStyle = css([214, 196, 164], l);
      ctx.beginPath(); ctx.moveTo(x - hw * 0.95, y); ctx.lineTo(x, y - h * 1.08); ctx.lineTo(x + hw * 0.95, y); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([168, 70, 52], l, 0.9);
      ctx.beginPath(); ctx.moveTo(x - hw * 0.62, y - h * 0.34); ctx.lineTo(x + hw * 0.62, y - h * 0.34); ctx.lineTo(x + hw * 0.56, y - h * 0.42); ctx.lineTo(x - hw * 0.56, y - h * 0.42); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([40, 30, 26], l);
      ctx.beginPath(); ctx.moveTo(x - hw * 0.2, y); ctx.lineTo(x, y - h * 0.5); ctx.lineTo(x + hw * 0.2, y); ctx.closePath(); ctx.fill();
      // 尖顶的小旗
      ctx.strokeStyle = css([90, 70, 50], l); ctx.lineWidth = Math.max(0.5, 0.02 * ph);
      ctx.beginPath(); ctx.moveTo(x, y - h * 1.08); ctx.lineTo(x, y - h * 1.35); ctx.stroke();
      ctx.fillStyle = css([190, 60, 46], l);
      const fl = Math.sin(W.t * 3 + seed) * 0.04 * ph;
      ctx.beginPath(); ctx.moveTo(x, y - h * 1.35); ctx.lineTo(x + 0.3 * ph, y - h * 1.3 + fl); ctx.lineTo(x, y - h * 1.24); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawCamps(ctx) {
    const aI = W.lv.smCampI, aP = W.lv.smCampP;
    if (aI > 0.01) X.campI.forEach((x, i) => drawTent(ctx, x, 'I', aI, i));
    if (aP > 0.01) X.campP.forEach((x, i) => drawTent(ctx, x, 'P', aP, i + 5));
  }

  // ════════════════════════════════════════════════════════════
  //  画：亚实突的大衮庙与大衮（5:2–4）
  // ════════════════════════════════════════════════════════════
  function dagonGeo() {
    const ph = PH(2), x = X.dagon * W.w, g = gY(2, X.dagon);
    const hw = Math.min(1.9 * ph, 0.072 * W.w), H = 2.6 * ph, base = g + 0.1 * ph;
    return { ph, x, g, hw, H, base, top: base - H, sill: base - 0.14 * ph };
  }
  function drawDagon(ctx) {
    const a = W.lv.smDagon;
    if (a < 0.005) return;
    const D = dagonGeo(), { ph, x, hw, H, base, top, sill } = D, l = 2, lx = litX() >= x ? 1 : -1, nk = nightK();
    const stone = [178, 150, 116], dark = [34, 26, 22];
    ctx.globalAlpha = a;
    // 台基与门槛
    ctx.fillStyle = css([142, 118, 92], l);
    ctx.fillRect(x - hw * 1.12, base - 0.14 * ph, hw * 2.24, 0.36 * ph);
    // 殿内的暗
    ctx.fillStyle = css(dark, l);
    ctx.fillRect(x - hw * 0.74, top + 0.36 * ph, hw * 1.48, H - 0.5 * ph);
    // 约柜的光照亮殿内
    if (S.ark === 'dagon') {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x - hw * 0.42, sill - 0.4 * ph, hw * 0.9, a * (0.25 + 0.5 * nk), 1.1);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
    }
    // 大衮
    drawIdol(ctx, D, a);
    // 约柜在大衮旁边
    if (S.ark === 'dagon') drawArkAt(ctx, x - hw * 0.42, sill, arkW() * 0.9, a, 1.2, null);
    ctx.globalAlpha = a;
    // 两旁厚墙（夜里受一点月光）
    const moon = 0.1 * nk * W.lv.moon;
    ctx.fillStyle = css(stone, l, 1, moon);
    ctx.fillRect(x - hw, top + 0.3 * ph, hw * 0.26, H - 0.44 * ph);
    ctx.fillRect(x + hw * 0.74, top + 0.3 * ph, hw * 0.26, H - 0.44 * ph);
    // 中间两根柱子
    const cw = Math.max(1.5, 0.1 * ph);
    for (const sx of [-0.3, 0.3]) {
      const cx = x + sx * hw;
      ctx.fillStyle = css(stone, l, 1, moon);
      ctx.fillRect(cx - cw, top + 0.34 * ph, cw * 2, H - 0.48 * ph);
      ctx.fillRect(cx - cw * 1.6, top + 0.3 * ph, cw * 3.2, 0.08 * ph);
      ctx.fillRect(cx - cw * 1.6, sill - 0.08 * ph, cw * 3.2, 0.08 * ph);
    }
    // 楣与三角的顶（外邦的式样）
    ctx.fillStyle = css([164, 136, 104], l);
    ctx.fillRect(x - hw * 1.08, top + 0.12 * ph, hw * 2.16, 0.22 * ph);
    ctx.fillStyle = css(stone, l, 1, moon);
    ctx.beginPath(); ctx.moveTo(x - hw * 1.1, top + 0.14 * ph); ctx.lineTo(x, top - 0.42 * ph); ctx.lineTo(x + hw * 1.1, top + 0.14 * ph); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([130, 60, 48], l, 0.8);
    ctx.fillRect(x - hw * 1.08, top + 0.22 * ph, hw * 2.16, Math.max(1, 0.05 * ph));
    ctx.strokeStyle = css([240, 218, 180], l, 0.4 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.6, 0.03 * ph);
    ctx.beginPath(); ctx.moveTo(x - hw * 1.1, top + 0.14 * ph); ctx.lineTo(x, top - 0.42 * ph); ctx.lineTo(x + hw * 1.1, top + 0.14 * ph); ctx.moveTo(x + lx * hw, top + 0.3 * ph); ctx.lineTo(x + lx * hw, base - 0.14 * ph); ctx.stroke();
    // 门槛上折断的头和两手（5:4）
    const bk = W.lv.smBroken;
    if (bk > 0.01) {
      ctx.globalAlpha = a * bk;
      const c = css([138, 118, 92], l), cr = css([196, 156, 76], l, 1, 0.1);
      const hx = x - hw * 0.1, hy = base - 0.14 * ph;
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(hx, hy - 0.09 * ph, 0.1 * ph, 0.085 * ph, 0.5, 0, TAU); ctx.fill();
      ctx.fillStyle = cr;
      ctx.beginPath(); ctx.moveTo(hx + 0.05 * ph, hy - 0.16 * ph); ctx.lineTo(hx + 0.26 * ph, hy - 0.1 * ph); ctx.lineTo(hx + 0.08 * ph, hy - 0.03 * ph); ctx.closePath(); ctx.fill();
      ctx.fillStyle = c;
      for (const hx2 of [x - hw * 0.62, x + hw * 0.5]) {
        ctx.beginPath(); ctx.ellipse(hx2, hy - 0.04 * ph, 0.09 * ph, 0.04 * ph, 0.2, 0, TAU); ctx.fill();
        ctx.fillRect(hx2 + 0.04 * ph, hy - 0.06 * ph, 0.08 * ph, 0.025 * ph);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 大衮：人身鱼尾，戴高冠；fall 0..1 向左仆倒（脸伏于地），broken 时头与两手不在身上
  function drawIdol(ctx, D, a) {
    const { ph, x, hw, sill } = D, l = 2;
    const fall = W.lv.smFall, bk = W.lv.smBroken;
    const h = Math.min(1.7 * ph, 1.55 * hw), bx = x + hw * 0.32;
    // 台座
    ctx.fillStyle = css([120, 100, 80], l);
    ctx.fillRect(bx - h * 0.16, sill - h * 0.1, h * 0.32, h * 0.1);
    ctx.save();
    ctx.beginPath(); ctx.rect(x - hw * 0.74, D.top, hw * 1.48, sill - D.top + 0.02 * ph); ctx.clip();
    const px = bx - h * 0.14, py = sill - h * 0.1;
    ctx.translate(px, py);
    ctx.rotate(-ease(clamp(fall, 0, 1)) * Math.PI * 0.5);
    ctx.translate(h * 0.14, 0);
    // 以 (0,0) 为脚下正中，向上为负
    const body = css([146, 124, 94], l, 1, 0.04), crown = css([200, 158, 74], l, 1, 0.12);
    ctx.fillStyle = body;
    ctx.beginPath();
    // 鱼尾
    ctx.moveTo(-h * 0.14, 0); ctx.quadraticCurveTo(-h * 0.02, -h * 0.08, -h * 0.05, -h * 0.14);
    ctx.lineTo(-h * 0.09, -h * 0.5); ctx.lineTo(-h * 0.13, -h * 0.66);
    // 肩
    ctx.lineTo(-h * 0.14, -h * 0.72); ctx.lineTo(-h * 0.05, -h * 0.76);
    ctx.lineTo(h * 0.05, -h * 0.76); ctx.lineTo(h * 0.14, -h * 0.72);
    ctx.lineTo(h * 0.13, -h * 0.66); ctx.lineTo(h * 0.09, -h * 0.5); ctx.lineTo(h * 0.05, -h * 0.14);
    ctx.quadraticCurveTo(h * 0.02, -h * 0.08, h * 0.14, 0);
    ctx.closePath(); ctx.fill();
    // 鳞纹
    ctx.strokeStyle = css([110, 92, 70], l, 0.6);
    ctx.lineWidth = Math.max(0.5, h * 0.012);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const y = -h * (0.18 + i * 0.07); ctx.moveTo(-h * 0.07, y); ctx.quadraticCurveTo(0, y + h * 0.03, h * 0.07, y); }
    ctx.stroke();
    if (bk < 0.5) {
      // 两手（向前伸出）与头、高冠
      ctx.fillStyle = body;
      ctx.fillRect(-h * 0.2, -h * 0.66, h * 0.07, h * 0.2);
      ctx.fillRect(h * 0.13, -h * 0.66, h * 0.07, h * 0.2);
      ctx.beginPath(); ctx.arc(0, -h * 0.84, h * 0.075, 0, TAU); ctx.fill();
      ctx.fillStyle = crown;
      ctx.beginPath(); ctx.moveTo(-h * 0.07, -h * 0.88); ctx.lineTo(-h * 0.04, -h * 1.02); ctx.lineTo(0, -h * 0.95); ctx.lineTo(h * 0.04, -h * 1.02); ctx.lineTo(h * 0.07, -h * 0.88); ctx.closePath(); ctx.fill();
    } else {
      // 只剩下大衮的残体：断口
      ctx.fillStyle = css([96, 80, 62], l);
      ctx.fillRect(-h * 0.06, -h * 0.79, h * 0.12, h * 0.04);
    }
    ctx.restore();
    ctx.globalAlpha = a;
  }
  // 耶和华的手重重加在亚实突（5:6）：沉重的暗影
  function drawPlague(ctx) {
    const k = W.lv.smPlague;
    if (k < 0.01) return;
    const x0 = (X.dagon - 0.2) * W.w;
    const g = ctx.createLinearGradient(x0, 0, W.w, 0);
    g.addColorStop(0, 'rgba(30,18,12,0)'); g.addColorStop(0.35, U.rgba(30, 18, 12, 0.34 * k)); g.addColorStop(1, U.rgba(30, 18, 12, 0.44 * k));
    ctx.fillStyle = g;
    ctx.fillRect(x0, W.horizonY - W.h * 0.25, W.w - x0, W.h);
  }

  // ════════════════════════════════════════════════════════════
  //  画：麦田（伯示麦 6:13；吉甲 12:17）
  // ════════════════════════════════════════════════════════════
  const TUFT = (function () { const r = U.mulberry32(613), a = []; for (let i = 0; i < 380; i++) a.push([r(), r(), r()]); return a; })();
  function drawField(ctx) {
    const g0 = W.lv.smWheat;
    if (g0 < 0.01) return;
    const s = LS(2), xf = S.fieldX, cx = xf * W.w, top = gY(2, xf) + 3 * s, bot = top + (W.h - top) * 0.66;
    const hwT = 0.06 * W.w, hwB = 0.1 * W.w, gold = W.lv.smGold;
    ctx.globalAlpha = g0 * 0.3;
    ctx.fillStyle = css([118, 92, 56], 2);
    ctx.beginPath();
    ctx.moveTo(cx - hwT, top); ctx.quadraticCurveTo(cx, top - 2 * s, cx + hwT, top);
    ctx.lineTo(cx + hwB, bot); ctx.quadraticCurveTo(cx, bot + 8 * s, cx - hwB, bot);
    ctx.closePath(); ctx.fill();
    const hgt = g0, ROWS = 14;
    const sway = (W.wind * 2.4 + 5 * W.lv.rain + 6 * W.lv.gale) * s;
    const lit = 0.05 + 0.16 * gold;
    for (let pass = 0; pass < 2; pass++) {
      const col = pass ? U.mixRGB([104, 142, 70], [240, 204, 112], gold) : U.mixRGB([70, 104, 52], [200, 154, 72], gold);
      ctx.strokeStyle = css(col, 2, 1, lit);
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.globalAlpha = g0 * 0.95;
      ctx.beginPath();
      for (let i = pass; i < TUFT.length; i += 2) {
        const q = TUFT[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        if (Math.abs(u) > 0.9 && q[2] < 0.6) continue;
        const y = lerp(top, bot, Math.pow(f, 1.3)) + (q[2] - 0.5) * 2 * s, x = cx + u * lerp(hwT, hwB, f);
        const th = lerp(4, 14, f) * s * hgt * (0.7 + 0.5 * q[2]);
        const sw = sway * (0.3 + f) + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.7 * s;
        ctx.moveTo(x, y); ctx.lineTo(x + sw, y - th);
      }
      ctx.stroke();
    }
    if (gold > 0.15) {
      ctx.fillStyle = css([246, 216, 132], 2, 1, 0.14);
      ctx.globalAlpha = g0 * smoothstep(0.15, 0.8, gold);
      ctx.beginPath();
      for (let i = 0; i < TUFT.length; i += 2) {
        const q = TUFT[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        if (Math.abs(u) > 0.9 && q[2] < 0.6) continue;
        const y = lerp(top, bot, Math.pow(f, 1.3)) + (q[2] - 0.5) * 2 * s, x = cx + u * lerp(hwT, hwB, f);
        const th = lerp(4, 14, f) * s * hgt * (0.7 + 0.5 * q[2]);
        const sw = sway * (0.3 + f) + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.7 * s, r = lerp(0.7, 1.5, f) * s;
        ctx.rect(x + sw - r * 0.55, y - th - r * 2.4, r * 1.1, r * 2.6);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：坛（殿前的坛；米斯巴、吉甲田野里的坛）
  // ════════════════════════════════════════════════════════════
  function drawAltarAt(ctx, xf, a, fire, sour, seed, bronze) {
    if (a < 0.01) return;
    const ph = PH(2), l = 2, x = xf * W.w, y = gY(2, xf) + 0.05 * ph, hw = Math.min(0.42 * ph, 0.016 * W.w) * (bronze ? 1.1 : 1), h = 0.5 * ph;
    ctx.globalAlpha = a;
    if (bronze) {
      ctx.fillStyle = css([150, 104, 62], l, 1, 0.05);
      ctx.fillRect(x - hw, y - h, hw * 2, h);
      ctx.fillStyle = css([118, 80, 48], l);
      ctx.fillRect(x - hw, y - h * 0.55, hw * 2, h * 0.1);
      ctx.fillStyle = css([170, 120, 72], l, 1, 0.1);
      for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + d * hw, y - h); ctx.lineTo(x + d * hw * 0.8, y - h - 0.12 * ph); ctx.lineTo(x + d * hw * 0.62, y - h); ctx.closePath(); ctx.fill(); }
    } else {
      // 未凿的石头垒成
      ctx.fillStyle = css([140, 128, 110], l);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const row = i < 3 ? 0 : i < 5 ? 1 : 2, n = row === 0 ? 3 : row === 1 ? 2 : 2, j = row === 0 ? i : row === 1 ? i - 3 : i - 5;
        const cx = x + (j - (n - 1) / 2) * hw * 0.78, cy = y - h * 0.18 - row * h * 0.3, rw = hw * 0.46, rh = h * 0.2;
        ctx.moveTo(cx + rw, cy); ctx.ellipse(cx, cy, rw, rh, (rt(seed + i) - 0.5) * 0.4, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const topY = y - h - 0.02 * ph;
    if (fire > 0.01) {
      smoke(ctx, x, topY - 0.1 * ph, fire * a, 3.2 * ph + W.h * 0.1, 0.16 * ph, seed, sour);
      flame(ctx, x, topY + 0.02 * ph, 0.32 * ph, fire * a, seed, sour > 0.5);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  画：以便以谢的石头（7:12）
  // ════════════════════════════════════════════════════════════
  function drawEben(ctx) {
    const st = W.lv.smEben;
    if (st < 0.005) return;
    SP || sprites();
    const ph = PH(2), l = 2, x = X.eben * W.w, y = gY(2, X.eben) + 0.05 * ph, w = 0.34 * ph, h = 1.3 * ph * ease(clamp(st, 0, 1));
    const lit = W.lv.smEbenLit;
    if (lit > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y - h * 0.6, ph * (1.2 + lit), lit * (0.25 + 0.1 * Math.sin(W.t * 1.2)) * (0.6 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = css([128, 118, 104], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x - w * 0.47, y - h * 0.8);
    ctx.quadraticCurveTo(x - w * 0.4, y - h, x - w * 0.02, y - h * 1.03);
    ctx.quadraticCurveTo(x + w * 0.44, y - h, x + w * 0.48, y - h * 0.76);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([236, 220, 196], l, 0.55 * dayA() + 0.3 * lit, 0.25); ctx.lineWidth = Math.max(0.6, 0.035 * ph);
    ctx.beginPath(); ctx.moveTo(x + d * w * 0.48, y - h * 0.1); ctx.lineTo(x + d * w * 0.47, y - h * 0.78); ctx.quadraticCurveTo(x + d * w * 0.42, y - h, x, y - h * 1.03); ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  画：密抹的隘口——西尼（左，向迦巴）与播薛（右，向密抹），播薛上是非利士人的防营（14:4–5）
  // ════════════════════════════════════════════════════════════
  const CRAG = [
    { xf: X.cragL, H: 2.3, W: 1.15, seed: 41, label: '西尼', flat: null, prof: [[-1, 0], [-0.86, 0.22], [-0.78, 0.36], [-0.66, 0.44], [-0.58, 0.66], [-0.4, 0.78], [-0.26, 0.96], [-0.1, 1], [0.08, 0.9], [0.22, 0.93], [0.36, 0.74], [0.5, 0.66], [0.64, 0.46], [0.8, 0.3], [0.9, 0.12], [1, 0]] },
    { xf: X.cragR, H: 3.0, W: 1.3, seed: 77, label: '播薛', flat: [-0.62, 0.34], prof: [[-1, 0], [-0.92, 0.18], [-0.84, 0.36], [-0.76, 0.5], [-0.7, 0.68], [-0.62, 0.9], [-0.5, 0.98], [-0.2, 1], [0.1, 0.99], [0.34, 0.96], [0.46, 0.82], [0.56, 0.7], [0.66, 0.6], [0.78, 0.42], [0.88, 0.24], [1, 0]] },
  ];
  // 岩的轮廓：在控制点之间加上参差（顶上可站之处保持平整）；岩上的台阶、裂缝与小灌木
  CRAG.forEach(c => {
    const r = U.mulberry32(c.seed * 97 + 5), out = [];
    for (let i = 0; i < c.prof.length - 1; i++) {
      const A = c.prof[i], B = c.prof[i + 1];
      out.push(A);
      for (let k = 1; k < 3; k++) {
        const t = k / 3, u = lerp(A[0], B[0], t), v = lerp(A[1], B[1], t);
        const flat = c.flat && u > c.flat[0] && u < c.flat[1];
        out.push([u + (r() - 0.5) * 0.05, v + (flat ? (r() - 0.5) * 0.015 : (r() - 0.35) * 0.07)]);
      }
    }
    out.push(c.prof[c.prof.length - 1]);
    c.jag = out;
    c.ledge = []; c.crack = []; c.bush = [];
    for (let i = 0; i < 6; i++) { const v = 0.12 + (i + r() * 0.8) / 6 * 0.74; c.ledge.push([(r() - 0.5) * 1.2 * (1 - v * 0.45), v, 0.1 + r() * 0.22]); }
    for (let i = 0; i < 5; i++) { const u = (r() - 0.5) * 1.1, v0 = 0.05 + r() * 0.3; c.crack.push([u, v0, v0 + 0.25 + r() * 0.35, (r() - 0.5) * 0.12]); }
    for (let i = 0; i < 4; i++) { const v = 0.2 + r() * 0.5; c.bush.push([(r() - 0.5) * 1.2 * (1 - v * 0.5), v, 0.05 + r() * 0.04]); }
  });
  function cragGeo(i) {
    const c = CRAG[i], ph = PH(2), cw = Math.min(c.W * ph, 0.05 * W.w), k = W.lv.smCrags;
    const x = c.xf * W.w, g = gY(2, c.xf) + 0.1 * ph, H = c.H * ph * (0.75 + 0.25 * k);
    return { c, ph, cw, x, g, H, k };
  }
  // 播薛顶上一点（u -1..1 横向）：[x 比例, y 比例]
  function cragTop(u) {
    const G = cragGeo(1), p = G.c.prof;
    let v = 0;
    for (let i = 1; i < p.length; i++) if (u <= p[i][0]) { const t = (u - p[i - 1][0]) / (p[i][0] - p[i - 1][0]); v = lerp(p[i - 1][1], p[i][1], t); break; }
    const gg = gY(2, X.cragR) + 0.1 * G.ph, H = G.c.H * G.ph;
    return [(G.x + u * G.cw) / W.w, (gg - v * H) / W.h];
  }
  function cragPath(ctx, G, pts) {
    ctx.beginPath();
    pts.forEach((q, j) => { const xx = G.x + q[0] * G.cw, yy = G.g - q[1] * G.H; if (j) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); });
  }
  function drawCrags(ctx) {
    const k = W.lv.smCrags;
    if (k < 0.005) return;
    const l = 2;
    for (let i = 0; i < CRAG.length; i++) {
      const G = cragGeo(i), c = G.c, p = c.jag, lx = litX() >= G.x ? 1 : -1, A = clamp(k * 1.4, 0, 1);
      ctx.globalAlpha = A;
      // 岩体：下暗上亮
      const gr = ctx.createLinearGradient(0, G.g - G.H, 0, G.g);
      gr.addColorStop(0, css([168, 150, 124], l)); gr.addColorStop(1, css([118, 102, 84], l));
      ctx.fillStyle = gr;
      cragPath(ctx, G, p); ctx.closePath(); ctx.fill();
      // 背光的一面
      ctx.fillStyle = css([70, 60, 52], l, 0.34);
      const half = lx > 0 ? p.filter(q => q[0] <= 0.1) : p.filter(q => q[0] >= -0.1);
      cragPath(ctx, G, half);
      ctx.lineTo(G.x + lx * -0.05 * G.cw, G.g); ctx.closePath(); ctx.fill();
      // 裂缝
      ctx.strokeStyle = css([62, 52, 44], l, 0.55);
      ctx.lineWidth = Math.max(0.5, 0.025 * G.ph);
      ctx.beginPath();
      for (const q of c.crack) {
        const x0 = G.x + q[0] * G.cw, y0 = G.g - q[1] * G.H, y1 = G.g - q[2] * G.H;
        ctx.moveTo(x0, y0); ctx.lineTo(x0 + q[3] * G.cw, lerp(y0, y1, 0.5)); ctx.lineTo(x0 - q[3] * G.cw * 0.5, y1);
      }
      ctx.stroke();
      // 台阶：几道参差的受光的岩沿
      ctx.lineWidth = Math.max(0.6, 0.03 * G.ph);
      ctx.strokeStyle = css([226, 206, 172], l, 0.42 * dayA(), 0.15);
      ctx.beginPath();
      for (const q of c.ledge) {
        const x0 = G.x + q[0] * G.cw, y0 = G.g - q[1] * G.H, w = q[2] * G.cw;
        ctx.moveTo(x0 - w, y0 + w * 0.18); ctx.lineTo(x0 - w * 0.2, y0); ctx.lineTo(x0 + w * 0.7, y0 + w * 0.12);
      }
      ctx.stroke();
      // 石缝里的小灌木
      ctx.fillStyle = css([72, 96, 56], l, 0.9);
      ctx.beginPath();
      for (const q of c.bush) { const x0 = G.x + q[0] * G.cw, y0 = G.g - q[1] * G.H, r = q[2] * G.ph * 2.2; ctx.moveTo(x0 + r, y0); ctx.ellipse(x0, y0 - r * 0.4, r, r * 0.7, 0, 0, TAU); }
      ctx.fill();
      // 迎光的边
      ctx.strokeStyle = css([244, 226, 194], l, 0.55 * dayA(), 0.25);
      ctx.lineWidth = Math.max(0.6, 0.035 * G.ph);
      const rim = lx > 0 ? p.filter(q => q[0] >= -0.3) : p.filter(q => q[0] <= 0.3);
      cragPath(ctx, G, rim); ctx.stroke();
      // 脚下的碎石
      ctx.fillStyle = css([128, 112, 94], l);
      ctx.beginPath();
      for (let j = 0; j < 6; j++) { const u = -1.2 + 2.4 * rt(c.seed + j * 5), r = (0.08 + 0.08 * rt(c.seed + j * 5 + 1)) * G.ph; const xx = G.x + u * G.cw, yy = G.g - 0.02 * G.ph; ctx.moveTo(xx + r, yy); ctx.ellipse(xx, yy, r, r * 0.6, 0, Math.PI, 0); }
      ctx.fill();
    }
    drawGarrison(ctx);
    ctx.globalAlpha = 1;
  }
  // 播薛顶上的防营：几个戴羽冠的兵与一顶小帐棚；smRout 时战兢、滚落、逃散
  function drawGarrison(ctx) {
    const k = W.lv.smCrags, r = W.lv.smRout;
    if (k < 0.3) return;
    const ph = PH(2), l = 2;
    // 帐棚
    const tp = cragTop(0.2), tx = tp[0] * W.w, ty = tp[1] * W.h + 0.02 * ph, tw = 0.5 * ph * Math.min(1, 0.05 * W.w / (1.3 * ph) + 0.4);
    ctx.globalAlpha = clamp(k * 1.4 - 0.4, 0, 1) * (1 - r * 0.6);
    ctx.fillStyle = css([214, 196, 164], l);
    ctx.beginPath(); ctx.moveTo(tx - tw, ty); ctx.lineTo(tx, ty - 0.6 * ph); ctx.lineTo(tx + tw, ty); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([168, 70, 52], l, 0.9);
    ctx.fillRect(tx - tw * 0.6, ty - 0.24 * ph, tw * 1.2, 0.05 * ph);
    const body = css([74, 58, 50], l), helm = css([196, 150, 80], l, 1, 0.15);
    const U0 = [-0.02, 0.1, 0.34, 0.46];
    for (let i = 0; i < U0.length; i++) {
      const q = clamp(r * 1.7 - i * 0.18, 0, 1), top = cragTop(U0[i]);
      let fx0 = top[0] * W.w, fy = top[1] * W.h;
      // 逃散：往右（密抹）滚落
      fx0 += q * (0.9 + 0.5 * i) * ph; fy += q * q * 2.2 * ph;
      const al = clamp(k * 1.4 - 0.4, 0, 1) * (1 - q);
      if (al < 0.02) continue;
      ctx.globalAlpha = al;
      const h = 0.78 * ph, sh = Math.sin(W.t * 23 + i * 3) * 0.03 * ph * Math.min(1, r * 4);
      const tilt = q * 1.2;
      ctx.save();
      ctx.translate(fx0 + sh, fy);
      ctx.rotate(tilt);
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.moveTo(-0.12 * h, 0); ctx.lineTo(-0.09 * h, -0.62 * h); ctx.lineTo(0.09 * h, -0.62 * h); ctx.lineTo(0.12 * h, 0); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -0.72 * h, 0.08 * h, 0, TAU); ctx.fill();
      // 羽冠
      ctx.strokeStyle = helm; ctx.lineWidth = Math.max(0.6, 0.025 * h);
      ctx.beginPath();
      for (let j = -2; j <= 2; j++) { ctx.moveTo(j * 0.03 * h, -0.78 * h); ctx.lineTo(j * 0.045 * h, -0.95 * h); }
      ctx.stroke();
      // 枪
      ctx.strokeStyle = css([110, 90, 70], l); ctx.lineWidth = Math.max(0.6, 0.02 * h);
      ctx.beginPath(); ctx.moveTo(0.14 * h, 0.02 * h); ctx.lineTo(0.2 * h, -1.05 * h); ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：器具（10:22）——扫罗藏在其中；画在人之后（'air'），挡住他
  // ════════════════════════════════════════════════════════════
  const BAG = (function () {
    const r = U.mulberry32(1022), items = [];
    for (let i = 0; i < 15; i++) {
      const row = i < 6 ? 0 : i < 11 ? 1 : 2;
      const n = row === 0 ? 6 : row === 1 ? 5 : 4, j = row === 0 ? i : row === 1 ? i - 6 : i - 11;
      items.push({ u: (j - (n - 1) / 2) / (n / 2) * (1 - row * 0.2) + (r() - 0.5) * 0.12, row, kind: Math.floor(r() * 4), s: 0.8 + r() * 0.4, c: Math.floor(r() * 4), rot: (r() - 0.5) * 0.4 });
    }
    return items;
  })();
  const BAGC = [[150, 120, 86], [120, 96, 70], [176, 150, 112], [168, 108, 70]];
  function drawBaggage(ctx) {
    const a = W.lv.smBag;
    if (a < 0.01) return;
    const ph = PH(2), l = 2, x = X.bag * W.w, g = gY(2, X.bag) + 0.12 * ph, hw = Math.min(1.25 * ph, 0.042 * W.w), H = 0.98 * ph;
    ctx.globalAlpha = a;
    for (const it of BAG) {
      const cx = x + it.u * hw, cy = g - H * (0.16 + it.row * 0.3), s = H * 0.2 * it.s;
      ctx.fillStyle = css(BAGC[it.c], l);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(it.rot);
      if (it.kind === 0) {           // 口袋
        ctx.beginPath(); ctx.ellipse(0, 0, s * 1.2, s, 0, 0, TAU); ctx.fill();
        ctx.fillRect(-s * 0.2, -s * 1.25, s * 0.4, s * 0.4);
      } else if (it.kind === 1) {    // 瓦罐
        ctx.fillStyle = css([184, 122, 78], l);
        ctx.beginPath(); ctx.ellipse(0, 0, s * 0.8, s * 1.05, 0, 0, TAU); ctx.fill();
        ctx.fillRect(-s * 0.3, -s * 1.45, s * 0.6, s * 0.5);
      } else if (it.kind === 2) {    // 卷起的席子
        ctx.fillRect(-s * 1.5, -s * 0.55, s * 3, s * 1.1);
        ctx.fillStyle = css([90, 70, 52], l, 0.7);
        ctx.fillRect(-s * 0.9, -s * 0.55, s * 0.15, s * 1.1); ctx.fillRect(s * 0.75, -s * 0.55, s * 0.15, s * 1.1);
      } else {                       // 包袱
        ctx.beginPath(); ctx.moveTo(-s * 1.1, s * 0.7); ctx.quadraticCurveTo(-s * 1.2, -s * 0.9, 0, -s * 1.0); ctx.quadraticCurveTo(s * 1.2, -s * 0.9, s * 1.1, s * 0.7); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    ctx.strokeStyle = css([236, 216, 180], l, 0.3 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.5, 0.025 * ph);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.8, g - H * 0.62); ctx.quadraticCurveTo(x, g - H * 1.02, x + hw * 0.8, g - H * 0.62); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：光——耶和华又来站着（3:10）、从但到别是巴的灯（3:20）、膏油的光、签、远山上的光
  // ════════════════════════════════════════════════════════════
  function drawPresence(ctx, front) {
    const k = W.lv.smPresence;
    if (k < 0.005) return;
    SP || sprites();
    const ph = PH(2), x = X.pres * W.w, g = gY(2, X.pres) + 0.08 * ph, t = W.t, br = 0.93 + 0.07 * Math.sin(t * 1.3);
    ctx.globalCompositeOperation = 'lighter';
    if (!front) {
      // 自天而降的光柱
      const sw = 1.35 * ph * (0.94 + 0.06 * Math.sin(t * 0.7));
      ctx.globalAlpha = Math.min(1, 0.5 * k * br);
      ctx.drawImage(SP.col, x - sw, -10, sw * 2, g + 10);
      // 立着的光（比人高）
      const fh = 2.9 * ph, fw = 0.62 * ph;
      ctx.globalAlpha = Math.min(1, 0.9 * k * br);
      ctx.drawImage(SP.form, x - fw, g - fh, fw * 2, fh * 1.02);
      // 放射的光芒
      ctx.strokeStyle = 'rgb(255,244,220)';
      ctx.lineWidth = Math.max(0.6, 0.03 * ph);
      const cy = g - 1.5 * ph;
      for (let i = 0; i < 14; i++) {
        const an = (i / 14) * TAU + t * 0.05, len = (1.8 + 1.4 * rt(i * 7)) * ph, flick = 0.5 + 0.5 * Math.sin(t * (0.8 + rt(i) * 0.9) + i);
        ctx.globalAlpha = 0.07 * k * flick;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * 0.5 * ph, cy + Math.sin(an) * 0.9 * ph); ctx.lineTo(x + Math.cos(an) * len, cy + Math.sin(an) * len * 1.2); ctx.stroke();
      }
      // 地上的光
      glowSp(ctx, SP.white, x, g, 2.8 * ph, 0.45 * k, 0.28);
    } else {
      // 光晕覆在孩子与殿门之上
      glowSp(ctx, SP.pale, x, g - 1.3 * ph, 3.4 * ph, 0.2 * k * br, 1);
      // 光中缓缓上升的微尘
      ctx.fillStyle = 'rgb(255,250,236)';
      for (let i = 0; i < 28; i++) {
        const ph0 = U.fract(t * (0.05 + rt(i * 3) * 0.05) + rt(i * 3 + 1));
        const yy = g - ph0 * 3.6 * ph, xx = x + (rt(i * 3 + 2) - 0.5) * 1.1 * ph + Math.sin(t * 0.8 + i) * 0.1 * ph;
        ctx.globalAlpha = k * Math.sin(ph0 * Math.PI) * 0.8;
        const sz = (0.8 + rt(i + 50) * 1.2) * SU();
        ctx.fillRect(xx - sz / 2, yy - sz / 2, sz, sz);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const KNOWN_N = 15;
  function drawKnown(ctx) {
    const k = W.lv.smKnown;
    if (k < 0.01) return;
    SP || sprites();
    const nk = nightK(), vis = 0.3 + 0.7 * Math.max(nk, W.dusk);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < KNOWN_N; i++) {
      const a = clamp(k * KNOWN_N - i, 0, 1);
      if (a < 0.01) continue;
      const xf = lerp(0.3, 0.985, i / (KNOWN_N - 1)) + (rt(i * 11) - 0.5) * 0.02, x = xf * W.w, y = gY(0, xf) + 1;
      const fl = 0.8 + 0.2 * Math.sin(W.t * (2 + rt(i) * 2) + i);
      glowSp(ctx, SP.warm, x, y - 2, 9 * SU(), a * vis * 0.8 * fl);
      ctx.globalAlpha = a * vis * fl;
      ctx.fillStyle = 'rgb(255,226,160)';
      ctx.fillRect(x - 1, y - 3, 2, 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawStar(ctx) {
    const k = W.lv.smStar;
    if (k < 0.01) return;
    SP || sprites();
    const x = X.star * W.w, y = gY(0, X.star) - 0.075 * W.h, v = k * (0.45 + 0.55 * Math.max(nightK(), W.dusk)), tw = 0.85 + 0.15 * Math.sin(W.t * 2.1);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, 0.035 * M(), v * 0.7 * tw);
    ctx.strokeStyle = 'rgb(255,244,214)';
    ctx.globalAlpha = v * 0.7 * tw;
    ctx.lineWidth = Math.max(0.6, SU() * 0.9);
    const r = 0.022 * M() * tw;
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r * 1.3); ctx.lineTo(x, y + r * 1.3); ctx.stroke();
    ctx.globalAlpha = v; ctx.fillStyle = 'rgb(255,250,236)';
    ctx.beginPath(); ctx.arc(x, y, Math.max(1, 1.6 * SU()), 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 扫罗头上膏油的光
  function drawRoyal(ctx) {
    const k = W.lv.smRoyal;
    if (k < 0.01 || !fig('saul')) return;
    const f = fig('saul');
    if (f.alpha != null && f.alpha < 0.05) return;
    SP || sprites();
    const p = figPt('saul', 0.92);
    if (!p) return;
    const ph = PH(2), hid = W.lv.smBag > 0.5 && Math.abs(f.nx - X.bag) < 0.03 ? 0.45 : 1;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], ph * 0.9, k * hid * (0.22 + 0.25 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 1.7)) * (f.alpha == null ? 1 : f.alpha));
    ctx.fillStyle = 'rgb(255,236,180)';
    for (let i = 0; i < 5; i++) {
      const q = U.fract(W.t * 0.18 + i / 5);
      ctx.globalAlpha = k * hid * Math.sin(q * Math.PI) * 0.7;
      const xx = p[0] + Math.sin(W.t * 0.9 + i * 1.3) * 0.25 * ph, yy = p[1] - q * 0.7 * ph;
      ctx.fillRect(xx - 1, yy - 1, 2 * SU(), 2 * SU());
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 十二支派的签（10:20–21）：众人头上十二点光，只剩一点，那一点去寻找
  const LOTS = { a: new Float32Array(12), x: X.bag, y: 0 };
  const lotX = i => lerp(0.615, 0.852, i / 11);
  const BENJ = 10;
  function lotTargets() {
    const t = new Float32Array(12);
    if (S.lots === 1) t.fill(1);
    else if (S.lots === 2 || S.lots === 3) t[BENJ] = 1;
    return t;
  }
  function updateLots(dt, snap) {
    const t = lotTargets();
    for (let i = 0; i < 12; i++) LOTS.a[i] = snap ? t[i] : U.approach(LOTS.a[i], t[i], t[i] > LOTS.a[i] ? 2.2 - i * 0.12 : 1.6, dt);
    const tx = S.lots === 3 ? X.bag : lotX(BENJ);
    LOTS.x = snap ? tx : U.approach(LOTS.x, tx, 0.9, dt);
  }
  function drawLots(ctx) {
    let any = false;
    for (let i = 0; i < 12; i++) if (LOTS.a[i] > 0.01) { any = true; break; }
    if (!any) return;
    SP || sprites();
    const ph = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const a = LOTS.a[i];
      if (a < 0.01) continue;
      const xf = i === BENJ ? LOTS.x : lotX(i), x = xf * W.w, y = gY(2, xf) - (1.85 + 0.08 * Math.sin(W.t * 1.4 + i)) * ph;
      glowSp(ctx, SP.gold, x, y, 0.45 * ph, a * 0.55);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(255,246,220)';
      ctx.beginPath(); ctx.arc(x, y, Math.max(1.2, 0.05 * ph), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 基列耶琳：约柜在山上亚比拿达的家中（7:1–2）
  function drawKJ(ctx) {
    if (S.ark !== 'kj') return;
    const l = 1, ph = PH(1), x = X.kj * W.w, y = gY(1, X.kj) + 1;
    ctx.fillStyle = css([176, 156, 124], l);
    ctx.fillRect(x - 0.7 * ph, y - 0.7 * ph, 1.4 * ph, 0.7 * ph);
    ctx.fillStyle = css([150, 130, 100], l);
    ctx.fillRect(x - 0.76 * ph, y - 0.76 * ph, 1.52 * ph, 0.08 * ph);
    ctx.fillStyle = css([40, 30, 26], l);
    ctx.fillRect(x - 0.14 * ph, y - 0.42 * ph, 0.28 * ph, 0.42 * ph);
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y - 0.4 * ph, ph * (0.55 + 0.3 * nightK()), 0.14 + 0.3 * nightK());
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 约柜现在在哪里 ─────────────────────────────────────────
  function arkPos() {
    const w = arkW();
    if (S.ark === 'carried' && S.arkBy) {
      const a = figPt(S.arkBy[0], 0.74), b = figPt(S.arkBy[1], 0.74);
      if (!a || !b) return null;
      const fa = fig(S.arkBy[0]), al = fa && fa.alpha != null ? fa.alpha : 1;
      return { x: (a[0] + b[0]) / 2, b: (a[1] + b[1]) / 2 + w * 0.5, w, poles: [Math.min(a[0], b[0]) - w * 0.4, Math.max(a[0], b[0]) + w * 0.4], a: al };
    }
    if (S.ark === 'cart') {
      const f = fig('cart');
      if (!f) return null;
      let x, y, s;
      if (f._vis && isFinite(f._x)) { x = f._x; y = f._y; s = f._h || PH(2) / 34; }
      else { x = f.nx * W.w; y = gY(2, f.nx); s = W.layerScale(2) * (phone() ? 1.4 : 1) * 1.3; }
      return { x: x + (f.fd || f.facing || 1) * 1 * s, b: y - 21.5 * s, w: w * 0.9, poles: null, a: f.alpha != null ? f.alpha : 1 };
    }
    return null;
  }
  function drawArkLoose(ctx) {
    const q = arkPos();
    if (q) drawArkAt(ctx, q.x, q.b, q.w, q.a, 1, q.poles);
  }

  // ════════════════════════════════════════════════════════════
  //  画：转瞬即逝的效果
  // ════════════════════════════════════════════════════════════
  function drawFX(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    const ph = PH(2), u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (pass === 'near') {
        if (e.type === 'beam') {
          const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
          const x = e.xf * W.w, y = gY(e.l, e.xf), w = e.w * ph;
          ctx.globalAlpha = env * 0.5 * e.k;
          ctx.drawImage(SP.beam, x - w / 2, -10, w, y + 10);
          glowSp(ctx, e.white ? SP.white : SP.gold, x, y - 0.2 * ph, w * 1.3, env * 0.5 * e.k, 0.5);
        }
        continue;
      }
      if (e.type === 'voice') {
        // 呼唤：从约柜那里，一圈一圈柔和的光
        const G = houseGeo(), cx = G.x + G.dw * 0.3, cy = G.sill - G.dh * 0.35;
        for (let i = 0; i < 3; i++) {
          const qq = q * 1.3 - i * 0.16;
          if (qq <= 0 || qq >= 1) continue;
          const r = (0.3 + 3.4 * qq) * ph;
          ctx.globalAlpha = Math.pow(1 - qq, 1.5) * 0.55;
          ctx.strokeStyle = 'rgb(255,238,204)';
          ctx.lineWidth = (1 + 2.2 * (1 - qq)) * u;
          ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.35, r * 0.8, 0, 0, TAU); ctx.stroke();
        }
        glowSp(ctx, SP.gold, cx, cy, ph * 1.2, 0.35 * Math.sin(q * Math.PI));
      } else if (e.type === 'motes') {
        // 从灰尘里抬举（2:8）：地上的微尘升起，化作光
        const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.8, 1, q));
        for (let i = 0; i < 70; i++) {
          const xf = lerp(e.x0, e.x1, rt(i * 5)), g = fieldY(xf, rt(i * 5 + 1) * 0.5);
          const ph0 = U.fract(e.t * (0.06 + rt(i * 5 + 2) * 0.05) + rt(i * 5 + 3));
          const yy = g - ph0 * ph * 5, xx = xf * W.w + Math.sin(e.t * 0.7 + i) * 0.2 * ph;
          const c = U.mixRGB([196, 170, 130], [255, 236, 180], ph0);
          ctx.fillStyle = U.rgb(c[0], c[1], c[2]);
          ctx.globalAlpha = env * Math.sin(ph0 * Math.PI) * 0.8;
          const sz = (0.8 + rt(i + 300) * 1.4) * u;
          ctx.fillRect(xx - sz / 2, yy - sz / 2, sz, sz);
        }
      } else if (e.type === 'oil') {
        // 膏油自瓶中倒在扫罗的头上
        const src = figPt('samuel', 1.02), dst = figPt('saul', 0.9);
        if (!src || !dst) continue;
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.75, 1, q));
        const sx = lerp(src[0], dst[0], 0.55), sy = src[1] - 0.1 * ph;
        // 瓶
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = env;
        ctx.fillStyle = css([200, 180, 140], 2, 1, 0.1);
        ctx.beginPath(); ctx.ellipse(sx, sy, 0.07 * ph, 0.1 * ph, 0.6, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,226,140)';
        for (let i = 0; i < 16; i++) {
          const ph0 = U.fract(e.t * 1.1 + i / 16);
          const xx = lerp(sx, dst[0], ph0) + Math.sin(i) * 0.02 * ph, yy = lerp(sy, dst[1], ph0);
          ctx.globalAlpha = env * 0.9;
          ctx.fillRect(xx - u, yy - u * 1.4, 2 * u, 2.8 * u);
        }
        glowSp(ctx, SP.gold, dst[0], dst[1], ph * (0.5 + 0.4 * q), env * 0.6);
      } else if (e.type === 'pour') {
        // 打水浇在耶和华面前（7:6）
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.7, 1, q));
        ctx.fillStyle = 'rgb(214,232,255)';
        for (let i = 0; i < e.xs.length; i++) {
          const xf = e.xs[i], g = gY(2, xf), x = xf * W.w;
          for (let j = 0; j < 7; j++) {
            const ph0 = U.fract(e.t * 1.4 + j / 7 + i * 0.3);
            ctx.globalAlpha = env * 0.7;
            ctx.fillRect(x + 0.2 * ph + Math.sin(j) * 0.02 * ph - u * 0.6, g - 0.7 * ph + ph0 * 0.7 * ph, 1.2 * u, 2.2 * u);
          }
        }
      } else if (e.type === 'fight') {
        // 争战：尘土与铜的闪光（抽象）
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.7, 1, q));
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 9; i++) {
          const xf = lerp(e.x0, e.x1, rt(i * 7)), g = gY(2, xf), r = (0.8 + rt(i * 7 + 1)) * ph;
          glowSp(ctx, SP.smoke, xf * W.w + Math.sin(e.t * 0.6 + i) * 0.3 * ph, g - 0.5 * ph, r, env * 0.5, 0.7);
        }
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,220,150)';
        for (let i = 0; i < 16; i++) {
          const xf = lerp(e.x0, e.x1, rt(i * 13 + 5)), g = gY(2, xf);
          const on = Math.max(0, Math.sin(e.t * (6 + rt(i) * 5) + i * 2)) ** 6;
          ctx.globalAlpha = env * on;
          ctx.fillRect(xf * W.w - u, g - (0.4 + rt(i * 3) * 0.7) * ph - u, 2 * u, 2 * u);
        }
      } else if (e.type === 'fly') {
        // 一点光飞去（约柜往基列耶琳；膏油的光离开扫罗）
        const a = e.a(), b = e.b();
        if (!a || !b) continue;
        const k = ease(q), x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k) - Math.sin(q * Math.PI) * e.arc * W.h;
        const env = smoothstep(0, 0.08, q) * (1 - smoothstep(0.9, 1, q) * 0.7);
        glowSp(ctx, SP.gold, x, y, (e.r || 0.03) * M(), env * 0.8);
        ctx.globalAlpha = env; ctx.fillStyle = 'rgb(255,248,226)';
        ctx.beginPath(); ctx.arc(x, y, Math.max(1.2, 1.8 * u), 0, TAU); ctx.fill();
        for (let i = 1; i < 8; i++) {
          const qq = Math.max(0, q - i * 0.02), kk = ease(qq);
          const tx = lerp(a[0], b[0], kk), ty = lerp(a[1], b[1], kk) - Math.sin(qq * Math.PI) * e.arc * W.h;
          ctx.globalAlpha = env * (1 - i / 8) * 0.5;
          ctx.fillRect(tx - u, ty - u, 2 * u, 2 * u);
        }
      } else if (e.type === 'quake') {
        // 地也震动（14:15）：岩上落下的尘土
        const env = 1 - smoothstep(0.5, 1, q);
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 6; i++) {
          const xf = lerp(X.cragL - 0.04, X.cragR + 0.05, rt(i * 9)), g = gY(2, xf);
          glowSp(ctx, SP.smoke, xf * W.w, g - (0.3 + q * 0.8) * ph, (0.6 + q * 1.4) * ph, env * 0.55, 0.6);
        }
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'sweep') {
        // 那日，耶和华使以色列人得胜：一道光扫过大地
        const x = lerp(0.45, 1.1, ease(q)) * W.w, w = 0.14 * W.w, env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.8, 1, q));
        const g0 = ctx.createLinearGradient(x - w, 0, x + w, 0);
        g0.addColorStop(0, 'rgba(255,230,170,0)'); g0.addColorStop(0.5, U.rgba(255, 234, 180, 0.22 * env)); g0.addColorStop(1, 'rgba(255,230,170,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle = g0;
        ctx.fillRect(x - w, W.horizonY - W.h * 0.1, w * 2, W.h);
      } else if (e.type === 'tear') {
        // 衣襟撕断：一小片布飘动
        const p = figPt('saul', 0.5);
        if (!p) continue;
        const env = 1 - smoothstep(0.8, 1, q);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = env;
        ctx.fillStyle = css(ROBE.samOld, 2, 1, 0.1);
        const fl = Math.sin(e.t * 9) * 0.05 * ph;
        ctx.beginPath(); ctx.moveTo(p[0] - 0.3 * ph, p[1]); ctx.lineTo(p[0] - 0.52 * ph, p[1] - 0.06 * ph + fl); ctx.lineTo(p[0] - 0.5 * ph, p[1] + 0.12 * ph - fl); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'lighter';
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 撕下的衣襟留在扫罗手里（15:27）
  function drawTorn(ctx) {
    if (!S.torn) return;
    const f = fig('saul');
    if (!f || (f.alpha != null && f.alpha < 0.05)) return;
    const p = figPt('saul', 0.45), ph = PH(2);
    if (!p) return;
    const d = f.facing || 1;
    ctx.globalAlpha = f.alpha == null ? 1 : f.alpha;
    ctx.fillStyle = css(ROBE.samOld, 2, 1, 0.1);
    const fl = Math.sin(W.t * 2.3) * 0.03 * ph;
    ctx.beginPath(); ctx.moveTo(p[0] + d * 0.16 * ph, p[1]); ctx.lineTo(p[0] + d * 0.3 * ph, p[1] + 0.02 * ph + fl); ctx.lineTo(p[0] + d * 0.26 * ph, p[1] + 0.2 * ph); ctx.lineTo(p[0] + d * 0.14 * ph, p[1] + 0.14 * ph); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景的模块
  // ════════════════════════════════════════════════════════════
  const LBL = [
    // [标签, 取点函数 → [x, y] | null]
    ['耶和华的殿', () => W.lv.smHouse > 0.4 ? (G => [G.x, G.top - 0.2 * G.ph])(houseGeo()) : null],
    ['神的灯', () => W.lv.smHouse > 0.4 && W.lv.smLamp > 0.3 ? (G => [G.x - G.dw * 0.48, G.sill - G.dh * 0.5])(houseGeo()) : null],
    ['约柜', () => {
      if (S.ark === 'house' && W.lv.smHouse > 0.4) { const G = houseGeo(); return [G.x + G.dw * 0.32, G.sill - G.dh * 0.3]; }
      if (S.ark === 'dagon' && W.lv.smDagon > 0.4) { const D = dagonGeo(); return [D.x - D.hw * 0.42, D.sill - 0.4 * D.ph]; }
      if (S.ark === 'kj') return [X.kj * W.w, gY(1, X.kj) - 0.5 * PH(1)];
      const q = arkPos(); return q ? [q.x, q.b - q.w * 0.6] : null;
    }],
    ['拉玛', () => W.lv.smRamah > 0.4 ? [X.ramah * W.w, gY(2, X.ramah) - 1.1 * PH(2)] : null],
    ['大衮', () => W.lv.smDagon > 0.4 ? (D => [D.x + D.hw * 0.32, D.sill - (W.lv.smFall > 0.5 ? 0.3 : 1.2) * D.ph])(dagonGeo()) : null],
    ['大衮庙', () => W.lv.smDagon > 0.4 ? (D => [D.x, D.top - 0.2 * D.ph])(dagonGeo()) : null],
    ['麦田', () => W.lv.smWheat > 0.4 ? [S.fieldX * W.w, fieldY(S.fieldX, 0.3)] : null],
    ['以便以谢', () => W.lv.smEben > 0.5 ? [X.eben * W.w, gY(2, X.eben) - 1.1 * PH(2)] : null],
    ['器具', () => W.lv.smBag > 0.4 ? [X.bag * W.w, gY(2, X.bag) - 0.6 * PH(2)] : null],
    ['西尼', () => W.lv.smCrags > 0.5 ? (G => [G.x, G.g - G.H * 0.8])(cragGeo(0)) : null],
    ['播薛', () => W.lv.smCrags > 0.5 ? (G => [G.x, G.g - G.H * 0.8])(cragGeo(1)) : null],
    ['坛', () => W.lv.smHouse > 0.4 ? [X.altar * W.w, gY(2, X.altar) - 0.5 * PH(2)] : W.lv.smAlt2 > 0.4 ? [S.alt2X * W.w, gY(2, S.alt2X) - 0.5 * PH(2)] : null],
  ];
  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      W.setOrigin('trees', W.w * 0.995, W.ridgeBaseY(2, W.w * 0.995));
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      updateLots(f, false);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStar(ctx); return; }
      if (pass === 'far') { drawKnown(ctx); return; }
      if (pass === 'mid') { drawKJ(ctx); return; }
      if (pass === 'near') {
        drawField(ctx);
        drawRamah(ctx);
        drawCamps(ctx);
        drawGlory(ctx);
        drawHouse(ctx);
        drawShiloh(ctx);
        drawAltarAt(ctx, X.altar, W.lv.smHouse, W.lv.smAltar, W.lv.smSour, 3, true);
        drawAltarAt(ctx, S.alt2X, W.lv.smAlt2, W.lv.smAlt2Fire, W.lv.smSour * (1 - W.lv.smHouse), 17, false);
        drawDagon(ctx);
        drawCrags(ctx);
        drawEben(ctx);
        return;
      }
      if (pass === 'air') {
        drawPresence(ctx, true);
        drawRoyal(ctx);
        drawBaggage(ctx);
        drawTorn(ctx);
        drawLots(ctx);
        drawPlague(ctx);
        drawFX(ctx, 'air');
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'near') {
        drawPresence(ctx, false);
        drawFX(ctx, 'near');
        drawArkLoose(ctx);
      }
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; updateLots(0, true); },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const [label, fn] of LBL) {
        const p = U.safe('samuel.pick', fn);
        if (!p) continue;
        const d = Math.hypot(p[0] - x, p[1] - y);
        if (d < r && (!best || d < best.d)) best = { label, x: p[0], y: p[1] - 8, d };
      }
      return best;
    },
    sig() { return { ark: S.ark, by: S.arkBy ? S.arkBy.join(',') : null, lots: S.lots, torn: S.torn, field: S.fieldX, alt2: S.alt2X }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：示罗，献祭的日子（1:3–9）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; S = fresh(); updateLots(0, true); }
  function setup() {
    // 以法莲山地：草木青青，远处的橄榄园
    W.set('bare', 0.14, true); W.set('bloom', 0.5, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.42, land: 1, grass: 1, herbs: 0.8, trees: 0.26, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      smHouse: 1, smGlory: 1, smLamp: 0.75, smAltar: 0.8, smSour: 0, smPresence: 0, smKnown: 0, smRamah: 1, smCampI: 0, smCampP: 0, smDagon: 0, smFall: 0, smBroken: 0,
      smPlague: 0, smWheat: 0, smGold: 0, smEben: 0, smEbenLit: 0, smRoyal: 0, smBag: 0, smCrags: 0, smRout: 0, smStar: 0, smAlt2: 0, smAlt2Fire: 0, smEliBed: 1 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    W.setOrigin('trees', W.w * 0.995, W.ridgeBaseY(2, W.w * 0.995));
    W.goTo(0.34, 0, true);
    const lx = W.w * 0.42, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 26, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 2, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 12, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    add('eli', { label: '以利', sex: 'm', age: 'elder', x: X.seat, facing: 1, robe: ROBE.eli, glow: 0.35, pose: 'seat', scale: 1.06, from: 'none', prop: null });
    add('hannah', { label: '哈拿', sex: 'f', age: 'adult', x: X.hannah, facing: 1, robe: ROBE.hannah, glow: 0.35, pose: 'weep', from: 'none', v: 0.1 });
    add('elkanah', { label: '以利加拿', sex: 'm', age: 'adult', x: 0.756, facing: -1, robe: ROBE.elkanah, glow: 0.25, pose: 'sit', from: 'none', v: 0.14 });
    add('peninnah', { label: '毗尼拿', sex: 'f', age: 'adult', x: 0.784, facing: -1, robe: ROBE.peninnah, glow: 0.2, pose: 'sit', from: 'none', v: 0.2 });
    add('pk1', { label: '毗尼拿的儿女', sex: 'm', age: 'child', x: 0.802, facing: -1, robe: ROBE.kid1, glow: 0.15, pose: 'sit', from: 'none', v: 0.26 });
    add('pk2', { label: '毗尼拿的儿女', sex: 'f', age: 'child', x: 0.818, facing: -1, robe: ROBE.kid2, glow: 0.15, pose: 'stand', from: 'none', v: 0.16 });
    avoid([0.49, 0.99]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每句话的经文不过四行，它的故事约三十秒：一按一放，便是一步）
  // ════════════════════════════════════════════════════════════
  const R = s => '撒母耳记上 ' + s;
  const INTRO = [
    { text: '以法莲山地……有一个以法莲人，名叫以利加拿……<br>他有两个妻：一名哈拿，一名毗尼拿。毗尼拿有儿女，哈拿没有儿女。', ref: R('1:1–2'), hold: 7 },
    { text: '这人每年从本城上到示罗，敬拜祭祀万军之耶和华；<br>在那里有以利的两个儿子何弗尼、非尼哈当耶和华的祭司。', ref: R('1:3'), hold: 7 },
  ];
  const V1 = [
    { text: '哈拿心里愁苦，就痛痛哭泣，祈祷耶和华，许愿说：<br>「万军之耶和华啊，你若垂顾婢女的苦情，眷念不忘婢女，赐我一个儿子，我必使他终身归与耶和华……」', ref: R('1:10–11'), hold: 8.5 },
    { text: '以利说：「你可以平平安安地回去。愿以色列的神允准你向他所求的！」', ref: R('1:17'), hold: 5.5 },
    { text: '……耶和华顾念哈拿，哈拿就怀孕。日期满足，生了一个儿子，<br>给他起名叫撒母耳，说：「这是我从耶和华那里求来的。」', ref: R('1:19–20'), hold: 8 },
  ];
  const V2 = [
    { text: '妇人说：「主啊……我祈求为要得这孩子；耶和华已将我所求的赐给我了。<br>所以，我将这孩子归与耶和华，使他终身归与耶和华。」', ref: R('1:26–28'), hold: 8 },
    { text: '哈拿祷告说：我的心因耶和华快乐；我的角因耶和华高举……<br>只有耶和华为圣；除他以外没有可比的，也没有磐石像我们的神。', ref: R('2:1–2'), hold: 8 },
    { text: '他从灰尘里抬举贫寒人，从粪堆中提拔穷乏人，<br>使他们与王子同坐，得着荣耀的座位。', ref: R('2:8'), hold: 6.5 },
  ];
  const V3 = [
    { text: '以利的两个儿子是恶人，不认识耶和华。', ref: R('2:12'), hold: 4.4 },
    { text: '如此，这二少年人的罪在耶和华面前甚重了，<br>因为他们藐视耶和华的祭物。', ref: R('2:17'), hold: 5.6 },
    { text: '有神人来见以利，对他说：「耶和华如此说：『……尊重我的，我必重看他；<br>藐视我的，他必被轻视。』」', ref: R('2:27–30'), hold: 7 },
    { text: '童子撒母耳在以利面前事奉耶和华。<br>当那些日子，耶和华的言语稀少，不常有默示。', ref: R('3:1'), hold: 6.4 },
  ];
  const V4 = [
    { text: '神的灯在神耶和华殿内约柜那里，还没有熄灭，撒母耳已经睡了。<br>耶和华呼唤撒母耳。撒母耳说：「我在这里！」', ref: R('3:3–4'), hold: 8 },
    { text: '就跑到以利那里，说：「你呼唤我？我在这里。」<br>以利回答说：「我没有呼唤你，你去睡吧。」他就去睡了。', ref: R('3:5'), hold: 6.8 },
    { text: '耶和华第三次呼唤撒母耳……以利才明白是耶和华呼唤童子。<br>因此以利对撒母耳说：「……若再呼唤你，你就说：『耶和华啊，请说，仆人敬听！』」', ref: R('3:8–9'), hold: 8.5 },
  ];
  const V5 = [
    { text: '耶和华又来站着，像前三次呼唤说：「撒母耳啊！撒母耳啊！」<br>撒母耳回答说：「请说，仆人敬听！」', ref: R('3:10'), hold: 8 },
    { text: '耶和华对撒母耳说：「我在以色列中必行一件事，<br>叫听见的人都必耳鸣。」', ref: R('3:11'), hold: 6.2 },
    { text: '撒母耳长大了，耶和华与他同在，使他所说的话一句都不落空。<br>从但到别是巴所有的以色列人都知道耶和华立撒母耳为先知。', ref: R('3:19–20'), hold: 8.5 },
  ];
  const V6 = [
    { text: '于是百姓打发人到示罗，从那里将坐在二基路伯上万军之耶和华的约柜抬来。', ref: R('4:4'), hold: 6 },
    { text: '非利士人和以色列人打仗，以色列人败了，各向各家奔逃……<br>神的约柜被掳去，以利的两个儿子何弗尼、非尼哈也都被杀了。', ref: R('4:10–11'), hold: 7 },
    { text: '他一提神的约柜，以利就从他的位上往后跌倒……<br>以利作以色列的士师四十年。', ref: R('4:18'), hold: 5.8 },
    { text: '她给孩子起名叫以迦博，说：「荣耀离开以色列了！」<br>这是因神的约柜被掳去，又因她公公和丈夫都死了。', ref: R('4:21'), hold: 6.5 },
  ];
  const V7 = [
    { text: '非利士人将神的约柜抬进大衮庙，放在大衮的旁边。<br>次日清早，亚实突人起来，见大衮仆倒在耶和华的约柜前，脸伏于地……', ref: R('5:2–3'), hold: 7.5 },
    { text: '又次日清早起来，见大衮仆倒在耶和华的约柜前，脸伏于地，<br>并且大衮的头和两手都在门槛上折断，只剩下大衮的残体。', ref: R('5:4'), hold: 7.2 },
    { text: '牛直行大道，往伯‧示麦去，一面走一面叫，不偏左右。', ref: R('6:12'), hold: 5.2 },
    { text: '伯‧示麦人正在平原收割麦子，举目看见约柜，就欢喜了。', ref: R('6:13'), hold: 5.2 },
  ];
  const V8 = [
    { text: '他们就聚集在米斯巴，打水浇在耶和华面前，当日禁食，<br>说：「我们得罪了耶和华。」于是撒母耳在米斯巴审判以色列人。', ref: R('7:6'), hold: 7.5 },
    { text: '撒母耳正献燔祭的时候，非利士人前来要与以色列人争战。<br>当日，耶和华大发雷声，惊乱非利士人，他们就败在以色列人面前。', ref: R('7:10'), hold: 8 },
    { text: '撒母耳将一块石头立在米斯巴和善的中间，给石头起名叫以便以谢，<br>说：「到如今耶和华都帮助我们。」', ref: R('7:12'), hold: 7 },
  ];
  const V9 = [
    { text: '以色列的长老都聚集，来到拉玛见撒母耳，对他说：<br>「你年纪老迈了，你儿子不行你的道。现在求你为我们立一个王治理我们，像列国一样。」', ref: R('8:4–5'), hold: 7.8 },
    { text: '耶和华对撒母耳说：「百姓向你说的一切话，你只管依从；<br>因为他们不是厌弃你，乃是厌弃我，不要我作他们的王。」', ref: R('8:7'), hold: 7.5 },
    { text: '百姓竟不肯听撒母耳的话，说：「不然！我们定要一个王治理我们，<br>使我们像列国一样，有王治理我们，统领我们，为我们争战。」', ref: R('8:19–20'), hold: 7 },
  ];
  const V10 = [
    { text: '他有一个儿子，名叫扫罗，又健壮、又俊美，在以色列人中没有一个能比他的；<br>身体比众民高过一头。', ref: R('9:2'), hold: 7 },
    { text: '撒母耳看见扫罗的时候，耶和华对他说：<br>「看哪，这人就是我对你所说的，他必治理我的民。」', ref: R('9:17'), hold: 6.5 },
    { text: '撒母耳拿瓶膏油倒在扫罗的头上，与他亲嘴，<br>说：「这不是耶和华膏你作他产业的君吗？」', ref: R('10:1'), hold: 7 },
  ];
  const V11 = [
    { text: '于是，撒母耳使以色列众支派近前来掣签，就掣出便雅悯支派来……<br>从其中又掣出基士的儿子扫罗。众人寻找他却寻不着，', ref: R('10:20–21'), hold: 7.5 },
    { text: '就问耶和华说：「那人到这里来了没有？」耶和华说：「他藏在器具中了。」<br>众人就跑去从那里领出他来。他站在百姓中间，身体比众民高过一头。', ref: R('10:22–23'), hold: 8 },
    { text: '撒母耳对众民说：「你们看耶和华所拣选的人，众民中有可比他的吗？」<br>众民就大声欢呼说：「愿王万岁！」', ref: R('10:24'), hold: 7 },
  ];
  const V12 = [
    { text: '众百姓就到了吉甲那里，在耶和华面前立扫罗为王，又在耶和华面前献平安祭。<br>扫罗和以色列众人大大欢喜。', ref: R('11:15'), hold: 7.5 },
    { text: '于是撒母耳求告耶和华，耶和华就在这日打雷降雨，<br>众民便甚惧怕耶和华和撒母耳。', ref: R('12:18'), hold: 6.5 },
    { text: '撒母耳对百姓说：「不要惧怕！……耶和华既喜悦选你们作他的子民，<br>就必因他的大名不撇弃你们。」', ref: R('12:20–22'), hold: 7.5 },
  ];
  const V13 = [
    { text: '非利士人聚集，要与以色列人争战……步兵像海边的沙那样多……<br>以色列百姓见自己危急窘迫，就藏在山洞、丛林、石穴、隐密处，和坑中。', ref: R('13:5–6'), hold: 7 },
    { text: '约拿单对拿兵器的少年人说：「我们不如过到未受割礼人的防营那里去，或者耶和华为我们施展能力；<br>因为耶和华使人得胜，不在乎人多人少。」', ref: R('14:6'), hold: 7.6 },
    { text: '于是在营中、在田野、在众民内都有战兢……<br>地也震动，战兢之势甚大。', ref: R('14:15'), hold: 5.5 },
    { text: '那日，耶和华使以色列人得胜，一直战到伯‧亚文。', ref: R('14:23'), hold: 4.5 },
  ];
  const V14 = [
    { text: '耶和华的话临到撒母耳说：「我立扫罗为王，我后悔了；<br>因为他转去不跟从我，不遵守我的命令。」', ref: R('15:10–11'), hold: 6.3 },
    { text: '撒母耳说：耶和华喜悦燔祭和平安祭，岂如喜悦人听从他的话呢？<br>听命胜于献祭；顺从胜于公羊的脂油。', ref: R('15:22'), hold: 6.8 },
    { text: '撒母耳转身要走，扫罗就扯住他外袍的衣襟，衣襟就撕断了。<br>撒母耳对他说：「如此，今日耶和华使以色列国与你断绝，将这国赐与比你更好的人。」', ref: R('15:27–28'), hold: 7.6 },
    { text: '撒母耳直到死的日子，再没有见扫罗；但撒母耳为扫罗悲伤，<br>是因耶和华后悔立他为以色列的王。', ref: R('15:35'), hold: 6.3 },
  ];

  const STAGES = [
    // ── 1 · 1:10–20 哈拿的祈祷；耶和华顾念哈拿 ─────────────────
    {
      kind: 'act', utter: '耶和华顾念哈拿', cmd: 'remember 哈拿  # 这是我从耶和华那里求来的', ref: '1:19',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { pose('hannah', 'pray', { weep: true }); sfx(b, 'weep', { soft: true }); }],
          [2.6, () => { face('eli', X.hannah); }],
          [L[1] - 0.4, b => { pose('eli', 'point'); face('eli', X.hannah); glow('eli', 0.45); }],
          [L[1] + 1.8, () => { pose('hannah', 'bow', { weep: false }); face('hannah', -1); }],
          [L[1] + 4.2, () => {
            pose('eli', 'seat');
            walk('hannah', 0.552, { speed: 0.03 });
            walk('elkanah', 0.534, { speed: 0.034 });
            walk('peninnah', 0.585, { speed: 0.034 });
            walk('pk1', 0.598, { speed: 0.034 });
            walk('pk2', 0.609, { speed: 0.036 });
          }],
          [L[2], b => { beamAt(b, 0.552, { dur: 7, w: 1.4 }); sfx(b, 'harp'); glow('hannah', 0.55); }],
          [L[2] + 3, b => {
            carry('hannah', 'baby'); face('hannah', 1);
            sparkOn(b, 'hannah', 26, [255, 244, 220]);
            nameOver(b, 'hannah', '撒母耳', [255, 240, 210], { size: 0.036, hold: 2.8, lift: 0.5 });
          }],
          [L[2] + 4.2, () => { face('elkanah', 1); face('peninnah', -1); face('pk1', -1); face('pk2', -1); }],
        ]);
      },
    },
    // ── 2 · 1:24–2:8 孩子归与耶和华；哈拿的歌 ──────────────────
    {
      kind: 'act', utter: '耶和华已将我所求的赐给我了', cmd: 'lend 撒母耳 --to 耶和华 --for-life', ref: '1:27',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            // 孩子断了奶
            carry('hannah', null);
            add('samuel', { label: '撒母耳', sex: 'm', age: 'child', x: 0.566, facing: 1, robe: ROBE.linen, glow: 0.45, from: b.instant ? 'none' : 'light', prop: null, v: 0.05 });
            rm('peninnah'); rm('pk1'); rm('pk2');
          }],
          [0.6, () => {
            hands('hannah', 'samuel', true);
            walk('hannah', 0.582, { speed: 0.028 });
            walk('samuel', 0.596, { speed: 0.028 });
            walk('elkanah', 0.562, { speed: 0.028 });
            animal('bull', 'ox', 0.52, { facing: 1, label: '公牛', from: 'fade' });
            walk('bull', 0.545, { speed: 0.02 });
          }],
          [2, () => { face('eli', -1); }],
          [4.2, () => { pose('hannah', 'bow'); pose('elkanah', 'bow'); }],
          [6.4, () => { hands('hannah', 'samuel', false); walk('samuel', X.seat + 0.02, { speed: 0.02 }); face('samuel', -1); }],
          [8.6, () => { glow('eli', 0.45); glow('samuel', 0.6); }],
          [L[1], b => {
            pose('hannah', 'raise'); pose('elkanah', 'stand'); glow('hannah', 0.6);
            fxl(b, { type: 'motes', dur: 17, x0: 0.52, x1: 0.8 });
            sfx(b, 'harp');
          }],
          [L[1] + 1.5, b => { walk('bull', X.altar - 0.012, { speed: 0.02 }); }],
          [L[1] + 4.5, b => { rm('bull'); W.set('smAltar', 1.25); sfx(b, 'fire', { soft: true }); }],
          [L[2] + 2, () => {
            pose('hannah', 'stand'); W.set('smAltar', 0.85);
            walk('hannah', 0.553, { speed: 0.025 });
            walk('elkanah', 0.538, { speed: 0.025 });
          }],
          [L[2] + 4, () => { face('samuel', 1); pose('samuel', 'stand'); face('hannah', 1); }],
        ]);
      },
    },
    // ── 3 · 2:12–3:1 以利的两个儿子；神人；言语稀少 ─────────────
    {
      kind: 'judge', utter: '尊重我的，我必重看他', cmd: 'weigh 以利家  # 藐视我的，他必被轻视', ref: '2:30',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            rm('hannah'); rm('elkanah');
            add('hophni', { label: '何弗尼', sex: 'm', age: 'adult', x: X.altar + 0.028, facing: -1, robe: ROBE.hophni, glow: 0.12, prop: 'staff', from: b.instant ? 'none' : 'fade' });
            add('phinehas', { label: '非尼哈', sex: 'm', age: 'adult', x: X.altar + 0.045, facing: -1, robe: ROBE.phinehas, glow: 0.12, prop: 'staff', from: b.instant ? 'none' : 'fade' });
            crowd('worship', { n: 3, x0: 0.5, x1: 0.54, layer: 2, label: '献祭的人', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('worship', 0.548, 0.572, { speed: 0.025 });
          }],
          [2.2, b => { pose('hophni', 'point'); walk('phinehas', 0.576, { speed: 0.03, pose: 'carry' }); W.set('smSour', 1); sfx(b, 'crowd', { soft: true, low: true }); }],
          [L[1] + 0.6, () => { crowdWalk('worship', 0.45, 0.5, { speed: 0.028 }); crowdFace('worship', -1); }],
          [L[1] + 3.2, () => { uncrowd('worship'); walk('phinehas', X.altar + 0.045, { speed: 0.025 }); face('phinehas', -1); pose('hophni', 'stand'); }],
          [L[1] + 2.2, b => {
            // 孩子穿着细麻布的以弗得，侍立在耶和华面前；渐渐长大
            walk('samuel', X.house - 0.002, { speed: 0.02 });
            add('samuel', { scale: 1.12 });
            glow('samuel', 0.6);
            sparkOn(b, 'samuel', 18, [255, 246, 226]);
          }],
          [L[2], b => {
            add('mangod', { label: '神人', sex: 'm', age: 'elder', x: 0.5, facing: 1, robe: ROBE.mangod, glow: 0.3, prop: 'staff', from: b.instant ? 'none' : 'fade' });
            walk('mangod', 0.598, { speed: 0.04, pose: 'point' });
          }],
          [L[2] + 3.4, b => { pose('eli', 'bow'); glow('eli', 0.15); W.set('smGlory', 0.7); sfx(b, 'seal', { soft: true }); }],
          [L[3] - 0.6, () => { walk('mangod', 0.47, { speed: 0.04 }); }],
          [L[3], b => {
            tod(b, 0.93, 7.5);
            walk('hophni', 0.86, { speed: 0.035 }); walk('phinehas', 0.875, { speed: 0.035 });
            W.set('smSour', 0); W.set('smAltar', 0.45); W.set('smLamp', 1);
          }],
          [L[3] + 2.4, () => { rm('mangod'); pose('eli', 'stand'); walk('eli', X.eliBed, { speed: 0.02, pose: 'lie' }); }],
          [L[3] + 3.4, () => { walk('samuel', X.bed, { speed: 0.02, pose: 'lie' }); }],
          [L[3] + 5.6, () => { rm('hophni'); rm('phinehas'); }],
        ]);
      },
    },
    // ── 4 · 3:2–9 夜里，神的灯还没有熄灭；三次呼唤 ──────────────
    {
      kind: 'act', utter: '耶和华呼唤撒母耳', cmd: 'ping 撒母耳  # 我在这里', ref: '3:4', tint: [255, 236, 200],
      verse: V4,
      apply(c) {
        T(c, [
          [0, b => { tod(b, 0.02, 3.5); W.set('smLamp', 1); W.set('smAltar', 0.35); glow('samuel', 0.5); }],
          // 第一次
          [2.4, b => { fxl(b, { type: 'voice', dur: 3.2 }); sfx(b, 'harp', { soft: true }); }],
          [3.6, () => { pose('samuel', 'sit'); }],
          [4.8, () => { run('samuel', X.eliBed - 0.022, { pose: 'stand' }); }],
          [6.3, () => { pose('eli', 'sit'); face('eli', -1); }],
          [8.6, () => { pose('eli', 'lie'); walk('samuel', X.bed, { speed: 0.04, pose: 'lie' }); }],
          // 第二次
          [11.8, b => { fxl(b, { type: 'voice', dur: 3.2 }); sfx(b, 'harp', { soft: true }); }],
          [12.8, () => { pose('samuel', 'sit'); }],
          [13.6, () => { run('samuel', X.eliBed - 0.022, { pose: 'stand' }); }],
          [14.9, () => { pose('eli', 'sit'); face('eli', -1); }],
          [15.9, () => { pose('eli', 'lie'); walk('samuel', X.bed, { speed: 0.045, pose: 'lie' }); }],
          // 第三次：以利才明白
          [18.8, b => { fxl(b, { type: 'voice', dur: 3.4 }); sfx(b, 'harp', { soft: true }); }],
          [19.6, () => { pose('samuel', 'sit'); }],
          [20.3, () => { run('samuel', X.eliBed - 0.022, { pose: 'stand' }); }],
          [21.6, b => { pose('eli', 'sit'); face('eli', -1); glow('eli', 0.5); }],
          [22.8, () => { pose('eli', 'point'); }],
          [24.4, () => { walk('samuel', X.bed, { speed: 0.04, pose: 'lie' }); }],
          [25.6, () => { pose('eli', 'lie'); glow('eli', 0.3); }],
        ]);
      },
    },
    // ── 5 · 3:10–20 耶和华又来站着（本卷的签名）─────────────────
    {
      kind: 'call', utter: '撒母耳啊！撒母耳啊！', cmd: 'listen --as 仆人  # 请说，仆人敬听', ref: '3:10', tint: [255, 240, 214],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => { W.set('smPresence', 1); W.set('smLamp', 1); flash(b, 0.18); sfx(b, 'angel', { soft: true }); }],
          [1.6, () => { pose('samuel', 'kneel'); face('samuel', -1); glow('samuel', 0.7); }],
          [4.4, b => {
            pose('samuel', 'pray');
            const p = figPt('samuel', 0.5);
            if (p) nameHere(b, '请说仆人敬听', X.pres * W.w, p[1] - 2.1 * PH(2), [255, 244, 222], { size: 0.028, hold: 3.2, dot: 1.8, src: () => [p[0] + rand(-14, 14) * SU(), p[1] + rand(-10, 10) * SU()] });
          }],
          [L[1], b => {
            const G = houseGeo();
            ringAt(b, X.pres * W.w, G.base - 1.2 * G.ph, [255, 238, 204], M() * 0.42, 3.4, 1.1);
            shake(b, 0.18); sfx(b, 'seal', { soft: true });
          }],
          [L[1] + 4.6, b => { W.set('smPresence', 0); tod(b, 0.285, 8); }],
          [L[2], b => {
            pose('samuel', 'stand'); face('samuel', 1);
            add('samuel', { age: 'adult', scale: 1, robe: ROBE.samuel });
            sparkOn(b, 'samuel', 30, [255, 244, 220]);
            W.set('smKnown', 1); W.set('smLamp', 0.8);
          }],
          [L[2] + 3, () => { pose('eli', 'sit'); face('eli', -1); }],
        ]);
      },
    },
    // ── 6 · 4 约柜被掳；以利跌倒；荣耀离开以色列 ─────────────────
    {
      kind: 'judge', utter: '我必始终应验在以利身上', cmd: 'fulfill 以利家 --all  # 荣耀离开以色列了', ref: '3:12',
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            tod(b, 0.42, 3);
            W.set('smCampI', 1); W.set('smCampP', 1); W.set('smLamp', 0.7); W.set('smEliBed', 0);
            walk('samuel', 0.553, { speed: 0.03 });
            pose('eli', 'stand'); walk('eli', X.seat, { speed: 0.03, pose: 'seat' }); face('eli', 1);
            add('hophni', { label: '何弗尼', sex: 'm', age: 'adult', x: X.house - 0.01, facing: 1, robe: ROBE.hophni, glow: 0.12, prop: null, from: b.instant ? 'none' : 'fade' });
            add('phinehas', { label: '非尼哈', sex: 'm', age: 'adult', x: X.house + 0.012, facing: 1, robe: ROBE.phinehas, glow: 0.12, prop: null, from: b.instant ? 'none' : 'fade' });
            S.ark = 'carried'; S.arkBy = ['hophni', 'phinehas'];
            crowd('israel', { n: 7, x0: 0.745, x1: 0.815, layer: 2, label: '以色列人', from: b.instant ? 'none' : 'fade', mill: false });
            crowd('phil', { n: 7, x0: 0.88, x1: 0.99, layer: 2, label: '非利士人', robe: ROBE.phil, from: b.instant ? 'none' : 'fade', mill: false, prop: 'staff' });
          }],
          [0.8, () => { walk('hophni', 0.774, { speed: 0.024 }); walk('phinehas', 0.796, { speed: 0.024 }); }],
          [5.6, b => { crowdPose('israel', 'raise'); shake(b, 0.35); sfx(b, 'crowd'); }],
          [L[1] - 0.2, b => { crowdWalk('phil', 0.8, 0.9, { run: true, speed: 0.06 }); fxl(b, { type: 'fight', dur: 7, x0: 0.76, x1: 0.9 }); sfx(b, 'crowd'); }],
          [L[1] + 1.8, () => { crowdWalk('israel', 0.5, 0.64, { run: true, speed: 0.08 }); }],
          [L[1] + 2.6, b => {
            pose('hophni', 'fall'); pose('phinehas', 'fall'); glow('hophni', 0); glow('phinehas', 0);
            const q = arkPos(), ax = q ? q.x / W.w : 0.785;
            add('ph1', { label: '非利士人', sex: 'm', age: 'adult', x: ax - 0.012, facing: 1, robe: ROBE.phil, glow: 0.05, prop: null, from: b.instant ? 'none' : 'fade' });
            add('ph2', { label: '非利士人', sex: 'm', age: 'adult', x: ax + 0.012, facing: 1, robe: ROBE.phil, glow: 0.05, prop: null, from: b.instant ? 'none' : 'fade' });
            S.arkBy = ['ph1', 'ph2'];
          }],
          [L[1] + 3.4, () => { walk('ph1', 1.04, { speed: 0.026 }); walk('ph2', 1.064, { speed: 0.026 }); }],
          [L[1] + 4.6, () => { uncrowd('israel'); rm('hophni'); rm('phinehas'); }],
          [L[1] + 5.2, b => {
            add('runner', { label: '便雅悯人', sex: 'm', age: 'adult', x: 0.8, facing: -1, robe: ROBE.runner, glow: 0.1, from: b.instant ? 'none' : 'fade' });
            run('runner', X.seat + 0.022, { pose: 'weep' });
          }],
          [L[2], b => { pose('eli', 'lie'); glow('eli', 0); sfx(b, 'weep', { soft: true }); dustAt(b, X.seat * W.w, gY(2, X.seat), 14); }],
          [L[2] + 2.8, () => { rm('eli'); }],
          [L[2] + 4.2, () => { rm('runner'); crowdWalk('phil', 1.02, 1.12, { speed: 0.04 }); }],
          [L[3], b => {
            W.set('smGlory', 0); W.set('smLamp', 0); W.set('smKnown', 0); W.set('smAltar', 0);
            const G = houseGeo();
            nameHere(b, '以迦博', G.x, G.top - 0.9 * G.ph, [40, 30, 34], { dark: true, size: 0.05, hold: 3, src: () => [G.x + rand(-1, 1) * G.hw * 2, G.top - rand(0, 2.5) * G.ph] });
            sfx(b, 'weep', { soft: true, low: true });
          }],
          [L[3] + 2, () => { uncrowd('phil'); rm('ph1'); rm('ph2'); S.ark = null; S.arkBy = null; }],
          [L[3] + 3, () => { W.set('smCampI', 0); W.set('smCampP', 0); }],
        ]);
      },
    },
    // ── 7 · 5–6 大衮仆倒；新车与母牛；伯示麦的麦田 ─────────────────
    {
      kind: 'act', utter: '耶和华的手重重加在亚实突人身上', cmd: 'topple 大衮 --face-down && return 约柜', ref: '5:6',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.set('smHouse', 0); W.set('smDagon', 1); W.set('smFall', 0); W.set('smBroken', 0);
            S.ark = 'dagon'; S.arkBy = null;
            tod(b, 0.06, 3);
            crowd('ashdod', { n: 3, x0: 0.78, x1: 0.815, layer: 2, label: '亚实突人', robe: ROBE.phil, from: b.instant ? 'none' : 'fade', mill: false });
            crowdFace('ashdod', 1);
            pose('samuel', 'pray');
          }],
          // 第一夜：大衮仆倒在约柜前
          [3.2, b => { W.set('smFall', 1); shake(b, 0.2); sfx(b, 'build', { soft: true, low: true }); }],
          [3.8, b => { tod(b, 0.27, 3.4); }],
          [7.2, () => { crowdPose('ashdod', 'bow'); }],
          [8.6, b => { W.set('smFall', 0); crowdPose('ashdod', 'stand'); }],
          // 第二夜：头和两手都折断在门槛上
          [L[1] - 0.2, b => { tod(b, 0.8, 2.4); }],
          [L[1] + 2.4, b => { tod(b, 0.05, 1.6); }],
          [L[1] + 3.4, b => { W.set('smFall', 1); W.set('smBroken', 1); shake(b, 0.3); sfx(b, 'build', { low: true }); }],
          [L[1] + 4.2, b => { tod(b, 0.28, 2.6); }],
          [L[1] + 6.4, b => { W.set('smPlague', 1); crowdPose('ashdod', 'weep'); sfx(b, 'weep', { soft: true }); }],
          // 新车，两只有乳的母牛
          [L[2] - 0.4, b => {
            S.ark = 'cart';
            animal('cow1', 'cow', 0.812, { facing: -1, label: '母牛', from: b.instant ? 'none' : 'fade', v: 0.02 });
            animal('cow2', 'cow', 0.815, { facing: -1, label: '母牛', from: b.instant ? 'none' : 'fade', v: 0.14 });
            animal('cart', 'wagon', 0.848, { facing: -1, label: '新车', from: b.instant ? 'none' : 'fade', pack: false });
          }],
          [L[2] + 0.4, b => {
            walk('cow1', 0.735, { speed: 0.012 }); walk('cow2', 0.738, { speed: 0.012 }); walk('cart', 0.771, { speed: 0.012 });
            sfx(b, 'cow');
          }],
          [L[2] + 2.6, b => { W.set('smPlague', 0); W.set('smDagon', 0); uncrowd('ashdod'); sfx(b, 'cow', { far: true }); S.fieldX = X.field6; W.set('smWheat', 1); W.set('smGold', 1); }],
          [L[2] + 3.4, b => {
            crowd('reapers', { n: 4, x0: 0.648, x1: 0.73, layer: 2, label: '伯‧示麦人', pose: 'bow', v: 0.28, from: b.instant ? 'none' : 'fade', mill: false });
            crowdFace('reapers', 1);
          }],
          [L[3] + 0.4, b => { crowdPose('reapers', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [L[3] + 2.4, b => { sfx(b, 'cow', { soft: true }); }],
        ]);
      },
    },
    // ── 8 · 7:3–12 米斯巴；耶和华大发雷声；以便以谢 ───────────────
    {
      kind: 'act', utter: '耶和华大发雷声，惊乱非利士人', cmd: 'thunder --on 非利士人 && mkstone 以便以谢', ref: '7:10',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            // 约柜到了基列耶琳，在那里二十年（7:1–2）
            if (!b.instant) {
              const q = arkPos();
              if (q) { const from = [q.x, q.b - q.w]; fxl(b, { type: 'fly', dur: 3.2, arc: 0.1, r: 0.03, a: () => from, b: () => [X.kj * W.w, gY(1, X.kj) - 0.5 * PH(1)] }); }
            }
            S.ark = 'kj';
            rm('cow1'); rm('cow2'); rm('cart'); uncrowd('reapers');
            W.set('smWheat', 0); W.set('smGold', 0); W.set('smFall', 0); W.set('smBroken', 0);
            tod(b, 0.4, 3);
            walk('samuel', X.mizpah, { speed: 0.035 }); pose('samuel', 'stand');
            crowd('mizpah', { n: 9, x0: 0.66, x1: 0.8, layer: 2, label: '以色列人', from: b.instant ? 'none' : 'fade', mill: false });
            crowdFace('mizpah', -1);
          }],
          [2.4, b => { fxl(b, { type: 'pour', dur: 4.5, xs: [0.672, 0.702, 0.735, 0.77] }); }],
          [4.2, () => { crowdPose('mizpah', 'kneel'); face('samuel', 1); }],
          [L[1] - 0.8, b => {
            S.alt2X = X.mizpah - 0.03; W.set('smAlt2', 1); W.set('smAlt2Fire', 1);
            face('samuel', -1); pose('samuel', 'raise');
            crowd('phil2', { n: 7, x0: 1.02, x1: 1.12, layer: 2, label: '非利士人', robe: ROBE.phil, from: b.instant ? 'none' : 'fade', mill: false, prop: 'staff' });
            crowdWalk('phil2', 0.86, 0.97, { speed: 0.05 });
            sfx(b, 'fire', { soft: true });
          }],
          [L[1] + 1.6, b => { W.set('storm', 0.72); W.set('gale', 0.3); }],
          [L[1] + 3.2, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.9, near: true }); shake(b, 0.5); flash(b, 0.3); }],
          [L[1] + 4.3, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.84, near: true }); crowdWalk('phil2', 1.06, 1.2, { run: true, speed: 0.09 }); shake(b, 0.4); }],
          [L[1] + 5.4, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.96 }); }],
          [L[1] + 6, () => { crowdPose('mizpah', 'stand'); crowdWalk('mizpah', 0.7, 0.86, { speed: 0.05 }); }],
          [L[1] + 7.6, () => { W.set('storm', 0); W.set('gale', 0); uncrowd('phil2'); W.set('smAlt2Fire', 0.4); }],
          [L[2] - 0.6, b => { tod(b, 0.72, 7); }],
          [L[2], b => { W.set('smEben', 1); walk('samuel', X.eben - 0.03, { speed: 0.04, pose: 'raise' }); sfx(b, 'build', { soft: true }); }],
          [L[2] + 3.4, b => {
            W.set('smEbenLit', 1);
            nameHere(b, '以便以谢', X.eben * W.w, gY(2, X.eben) - 1.9 * PH(2), [255, 232, 180], { size: 0.036, hold: 3.2 });
            sfx(b, 'harp');
          }],
          [L[2] + 5, () => { crowdFace('mizpah', 1); pose('samuel', 'stand'); }],
        ]);
      },
    },
    // ── 9 · 8 求立王：他们不是厌弃你，乃是厌弃我 ──────────────────
    {
      kind: 'judge', utter: '他们不是厌弃你，乃是厌弃我', cmd: 'sudo 立王 --like 列国  # 厌弃的是我', ref: '8:7',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            uncrowd('mizpah'); W.set('smAlt2', 0); W.set('smAlt2Fire', 0);
            tod(b, 0.4, 4);
            walk('samuel', X.ramah + 0.03, { speed: 0.042 });
            crowd('elders', { n: 5, x0: 0.96, x1: 1.04, layer: 2, label: '长老', robe: ROBE.elder, from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('elders', 0.61, 0.69, { speed: 0.045 });
          }],
          [5, b => { add('samuel', { age: 'elder', prop: 'staff', robe: ROBE.samOld }); sparkOn(b, 'samuel', 20, [240, 236, 226]); }],
          [6.6, () => { face('samuel', 1); crowdPose('elders', 'bow'); crowdFace('elders', -1); }],
          [L[1], b => { pose('samuel', 'pray'); beamOn(b, 'samuel', { dur: 7, w: 1.3, white: true }); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 5.4, () => { pose('samuel', 'stand'); crowdPose('elders', 'stand'); }],
          [L[2], b => {
            crowdPose('elders', 'raise'); sfx(b, 'crowd', { soft: true });
            nameHere(b, '王', 0.65 * W.w, gY(2, 0.65) - 2.2 * PH(2), [236, 200, 140], { size: 0.075, hold: 3, src: () => [lerp(0.61, 0.69, Math.random()) * W.w, gY(2, 0.65) - rand(0.4, 1) * PH(2)] });
          }],
          [L[2] + 4.2, () => { face('samuel', -1); crowdWalk('elders', 1.0, 1.1, { speed: 0.04 }); }],
          [L[2] + 7, () => { uncrowd('elders'); }],
        ]);
      },
    },
    // ── 10 · 9–10:1 扫罗；黎明时的膏油 ──────────────────────────
    {
      kind: 'cmd', utter: '你要膏他作我民以色列的君', cmd: 'anoint 扫罗 --oil --at dawn', ref: '9:16', tint: [255, 226, 170],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            add('saul', { label: '扫罗', sex: 'm', age: 'adult', x: 1.03, facing: -1, robe: ROBE.saul, glow: 0.3, scale: 1.14, from: b.instant ? 'none' : 'fade' });
            add('servant', { label: '仆人', sex: 'm', age: 'adult', x: 1.065, facing: -1, robe: ROBE.servant, glow: 0.12, prop: 'staff', from: b.instant ? 'none' : 'fade' });
            walk('saul', 0.618, { speed: 0.046 }); walk('servant', 0.648, { speed: 0.046 });
            tod(b, 0.45, 3);
          }],
          [3.6, () => { walk('samuel', X.gate, { speed: 0.02 }); face('samuel', 1); }],
          [L[1], b => { beamOn(b, 'saul', { dur: 6, w: 1.4 }); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 1.4, () => { pose('saul', 'bow'); face('saul', -1); }],
          [L[1] + 1.8, b => { tod(b, 0.8, 2.2); }],
          [L[1] + 3, () => { pose('saul', 'stand'); }],
          [L[1] + 4.2, b => { tod(b, 0.26, 3.2); }],
          [L[1] + 5.4, () => { walk('servant', 0.76, { speed: 0.04 }); }],
          [L[2], b => {
            pose('saul', 'kneel'); face('saul', -1); pose('samuel', 'raise');
            fxl(b, { type: 'oil', dur: 4.2 }); sfx(b, 'harp');
          }],
          [L[2] + 1.2, () => { rm('servant'); }],
          [L[2] + 2.6, b => { W.set('smRoyal', 1); glow('saul', 0.6); sparkOn(b, 'saul', 26, [255, 232, 170]); }],
          [L[2] + 4.8, () => { pose('samuel', 'stand'); pose('saul', 'stand'); }],
          [L[2] + 6.2, () => { walk('saul', 0.74, { speed: 0.03 }); }],
        ]);
      },
    },
    // ── 11 · 10:17–24 米斯巴掣签；他藏在器具中 ───────────────────
    {
      kind: 'cmd', utter: '他藏在器具中了', cmd: 'find 扫罗 --in 器具', ref: '10:22',
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            tod(b, 0.42, 2);
            W.set('smBag', 1, true);
            pose('saul', 'stand'); place('saul', X.bag + 0.004); pose('saul', 'sit'); face('saul', -1);
            walk('samuel', 0.588, { speed: 0.03 }); face('samuel', 1);
            crowd('tribes', { n: 12, x0: 0.62, x1: 0.85, layer: 2, label: '以色列众支派', from: b.instant ? 'none' : 'fade', mill: false });
            crowdFace('tribes', -1);
            S.lots = 1;
          }],
          [4.4, b => { S.lots = 2; sfx(b, 'stars', { soft: true }); }],
          [6.4, b => { S.lots = 3; }],
          [L[1] + 0.4, b => { beamAt(b, X.bag, { dur: 5, w: 1.3 }); crowdFace('tribes', 1); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 2.4, b => { S.lots = 0; pose('saul', 'stand'); walk('saul', 0.8, { speed: 0.028 }); }],
          [L[1] + 6, () => { crowdFace('tribes', 1); face('saul', -1); }],
          [L[2], b => {
            crowdPose('tribes', 'raise'); shake(b, 0.3); sfx(b, 'crowd');
            sparkOn(b, 'saul', 30, [255, 232, 170]);
          }],
        ]);
      },
    },
    // ── 12 · 11:15–12:22 吉甲；割麦子的时候打雷降雨 ───────────────
    {
      kind: 'promise', utter: '就必因他的大名不撇弃你们', cmd: 'rain --during 割麦子  # 不要惧怕', ref: '12:22',
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            tod(b, 0.45, 2);
            W.set('smBag', 0);
            S.fieldX = X.field12; W.set('smWheat', 1); W.set('smGold', 1);
            S.alt2X = 0.9; W.set('smAlt2', 1); W.set('smAlt2Fire', 1);
            crowdLabel('tribes', '众百姓');
            crowdWalk('tribes', 0.6, 0.84, { speed: 0.03 });
            walk('saul', 0.73, { speed: 0.03 });
            walk('samuel', 0.572, { speed: 0.02 });
          }],
          [3.2, b => { crowdPose('tribes', 'raise'); crowdFace('tribes', 1); sfx(b, 'crowd'); }],
          [L[1] - 0.4, b => { pose('samuel', 'pray'); crowdPose('tribes', 'stand'); W.set('storm', 0.85); W.set('rain', 0.9); W.set('gale', 0.35); W.set('smAlt2Fire', 0); }],
          [L[1] + 1.2, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.7, near: true }); shake(b, 0.4); sfx(b, 'rain'); }],
          [L[1] + 2.2, () => { crowdPose('tribes', 'kneel'); pose('saul', 'kneel'); crowdFace('tribes', -1); }],
          [L[1] + 4.2, b => { if (!b.instant && GS.weather) GS.weather.bolt({ x: 0.88 }); }],
          [L[1] + 6.2, () => { W.set('rain', 0); W.set('storm', 0); W.set('gale', 0); }],
          [L[2], b => {
            pose('samuel', 'raise');
            beamAt(b, 0.7, { dur: 8, w: 5.5, k: 0.8 });
            sfx(b, 'harp');
          }],
          [L[2] + 2.4, () => { crowdPose('tribes', 'stand'); pose('saul', 'stand'); pose('samuel', 'stand'); }],
        ]);
      },
    },
    // ── 13 · 13–14 密抹的隘口：约拿单与拿兵器的 ─────────────────
    {
      kind: 'act', utter: '耶和华使人得胜，不在乎人多人少', cmd: 'grep 耶和华 --not-by 人数', ref: '14:6',
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            tod(b, 0.4, 2);
            W.set('smWheat', 0); W.set('smGold', 0); W.set('smAlt2', 0); W.set('smAlt2Fire', 0);
            W.set('smCrags', 1); W.set('smRout', 0); W.set('smEben', 0); W.set('smEbenLit', 0);
            crowdLabel('tribes', '以色列百姓');
            crowdWalk('tribes', 0.6, 0.73, { speed: 0.035, pose: 'kneel' });
            walk('saul', 0.6, { speed: 0.03, pose: 'sit' });
            walk('samuel', X.ramah + 0.02, { speed: 0.02 });
          }],
          [1.6, b => {
            add('jonathan', { label: '约拿单', sex: 'm', age: 'adult', x: 0.742, facing: 1, robe: ROBE.jonathan, glow: 0.35, prop: 'sword', from: b.instant ? 'none' : 'fade' });
            add('armor', { label: '拿兵器的', sex: 'm', age: 'adult', x: 0.726, facing: 1, robe: ROBE.armor, glow: 0.2, prop: 'staff', from: b.instant ? 'none' : 'fade' });
          }],
          [L[1], b => { walk('jonathan', X.pass, { speed: 0.035 }); walk('armor', X.pass - 0.016, { speed: 0.035 }); }],
          [L[1] + 3.9, b => {
            const t1 = cragTop(-0.3), t2 = cragTop(-0.5);
            fly('jonathan', t1[0], t1[1], { dur: 2.6, pose: 'stand' }); pose('jonathan', 'bow');
            fly('armor', t2[0], t2[1], { dur: 3.0, pose: 'stand' }); pose('armor', 'bow');
          }],
          [L[1] + 7.2, b => { W.set('smRout', 0.45); pose('jonathan', 'raise'); sfx(b, 'crowd', { soft: true }); }],
          [L[2], b => {
            W.set('smRout', 1); shake(b, 1.1); fxl(b, { type: 'quake', dur: 4 });
            if (!b.instant && GS.audio && GS.audio.sfx) sfx(b, 'thunder', { low: true });
            crowdPose('tribes', 'stand');
          }],
          [L[2] + 2.4, () => {
            fly('jonathan', 0.93, null, { dur: 2, pose: 'stand' });
            fly('armor', 0.95, null, { dur: 2.2, pose: 'stand' });
          }],
          [L[2] + 3, b => { pose('saul', 'stand'); walk('saul', 0.78, { run: true, speed: 0.07 }); crowdWalk('tribes', 0.7, 0.9, { run: true, speed: 0.07 }); sfx(b, 'crowd'); }],
          [L[3], b => { fxl(b, { type: 'sweep', dur: 5 }); sfx(b, 'harp', { soft: true }); crowdPose('tribes', 'raise'); }],
        ]);
      },
    },
    // ── 14 · 15 亚玛力；听命胜于献祭；衣襟撕断 ──────────────────
    {
      kind: 'judge', utter: '听命胜于献祭', cmd: 'assert obey > sacrifice', ref: '15:22', hold: 2.6,
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            // 撒母耳终夜哀求耶和华（15:11）
            tod(b, 0.02, 2.8);
            W.set('smCrags', 0); W.set('smRout', 0);
            uncrowd('tribes'); rm('jonathan'); rm('armor');
            walk('samuel', 0.552, { speed: 0.03, pose: 'pray' });
            walk('saul', 0.9, { speed: 0.03 });
          }],
          [3.2, b => {
            tod(b, 0.33, 3.8);
            herd('spoil', { kind: 'sheep', n: 6, x0: 0.83, x1: 0.95, layer: 2, label: '上好的羊', from: b.instant ? 'none' : 'fade', mill: false });
            herd('spoilOx', { kind: 'cow', n: 2, x0: 0.92, x1: 0.97, layer: 2, label: '上好的牛', from: b.instant ? 'none' : 'fade', mill: false });
            add('agag', { label: '亚甲', sex: 'm', age: 'adult', x: 0.97, facing: -1, robe: ROBE.agag, glow: 0.1, accent: [220, 180, 90], from: b.instant ? 'none' : 'fade' });
            crowd('men', { n: 4, x0: 0.94, x1: 1.02, layer: 2, label: '跟随扫罗的人', from: b.instant ? 'none' : 'fade', mill: false, prop: 'staff' });
            S.alt2X = 0.76; W.set('smAlt2', 1); W.set('smAlt2Fire', 1);
          }],
          [5.2, b => { crowdWalk('spoil', 0.78, 0.9, { speed: 0.02 }); walk('saul', 0.705, { speed: 0.03, pose: 'raise' }); sfx(b, 'bleat'); }],
          [L[1] - 0.6, () => { pose('samuel', 'stand'); walk('samuel', 0.648, { speed: 0.03 }); }],
          [L[1] + 1.6, b => { sfx(b, 'bleat'); sfx(b, 'cow', { soft: true }); face('saul', -1); pose('saul', 'stand'); }],
          [L[1] + 2.6, b => { pose('samuel', 'point'); face('samuel', 1); W.set('smAlt2Fire', 0.2); W.set('smSour', 1); }],
          [L[2] - 1.2, () => { walk('samuel', 0.6, { speed: 0.026 }); }],
          [L[2] + 0.2, () => { walk('saul', 0.62, { speed: 0.06, pose: 'kneel' }); }],
          [L[2] + 2.8, b => {
            S.torn = 1; fxl(b, { type: 'tear', dur: 2.2 }); sfx(b, 'wind', { soft: true });
            face('samuel', 1); pose('samuel', 'stand');
          }],
          [L[2] + 4.4, b => {
            // 膏油的光离开扫罗，落在远山之上（将这国赐与比你更好的人）
            if (!b.instant) {
              const p = figPt('saul', 0.92), from = p ? [p[0], p[1]] : [0.62 * W.w, W.h * 0.7];
              fxl(b, { type: 'fly', dur: 4.2, arc: 0.12, r: 0.035, a: () => from, b: () => [X.star * W.w, gY(0, X.star) - 0.075 * W.h] });
            }
            W.set('smRoyal', 0); glow('saul', 0.15);
          }],
          [L[2] + 8.2, b => { W.set('smStar', 1); sfx(b, 'stars', { soft: true }); }],
          [L[3] - 1, () => {
            uncrowd('spoil'); uncrowd('spoilOx'); uncrowd('men'); rm('agag');
            W.set('smAlt2', 0); W.set('smAlt2Fire', 0); W.set('smSour', 0);
          }],
          [L[3], b => {
            tod(b, 0.765, 6);
            walk('samuel', 0.552, { speed: 0.02, pose: 'weep' });
            pose('saul', 'stand'); walk('saul', 0.9, { speed: 0.018 });
          }],
          [L[3] + 5, () => { face('saul', -1); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '撒母耳记上', books: [9], title: '撒母耳', sub: '撒母耳记上 1 — 15', tint: [236, 226, 255], music: 'abraham',
    intro: INTRO, outro: 18,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '哈拿': { text: '哈拿祷告说：我的心因耶和华快乐；我的角因耶和华高举。<br>我的口向仇敌张开；我因耶和华的救恩欢欣。', ref: R('2:1') },
      '以利加拿': { text: '她丈夫以利加拿对她说：「哈拿啊，你为何哭泣，不吃饭，心里愁闷呢？<br>有我不比十个儿子还好吗？」', ref: R('1:8') },
      '毗尼拿': { text: '毗尼拿见耶和华不使哈拿生育，就作她的对头，大大激动她，要使她生气。', ref: R('1:6') },
      '以利': { text: '以利说：「这是出于耶和华，愿他凭自己的意旨而行。」', ref: R('3:18') },
      '撒母耳': { text: '至于我，断不停止为你们祷告，以致得罪耶和华。<br>我必以善道正路指教你们。', ref: R('12:23') },
      '何弗尼': { text: '以利的两个儿子是恶人，不认识耶和华。', ref: R('2:12') },
      '非尼哈': { text: '你的两个儿子何弗尼、非尼哈所遭遇的事可作你的证据：他们二人必一日同死。', ref: R('2:34') },
      '神人': { text: '有神人来见以利，对他说：「耶和华如此说：『……我要为自己立一个忠心的祭司；他必照我的心意而行。』」', ref: R('2:27–35') },
      '便雅悯人': { text: '当日，有一个便雅悯人从阵上逃跑，衣服撕裂，头蒙灰尘，来到示罗。', ref: R('4:12') },
      '耶和华的殿': { text: '……祭司以利在耶和华殿的门框旁边，坐在自己的位上。', ref: R('1:9') },
      '神的灯': { text: '神的灯在神耶和华殿内约柜那里，还没有熄灭，撒母耳已经睡了。', ref: R('3:3') },
      '约柜': { text: '基列‧耶琳人就下来，将耶和华的约柜接上去，放在山上亚比拿达的家中……<br>约柜在基列‧耶琳许久。过了二十年，以色列全家都倾向耶和华。', ref: R('7:1–2') },
      '大衮': { text: '又次日清早起来，见大衮仆倒在耶和华的约柜前，脸伏于地，<br>并且大衮的头和两手都在门槛上折断，只剩下大衮的残体。', ref: R('5:4') },
      '大衮庙': { text: '非利士人将神的约柜抬进大衮庙，放在大衮的旁边。', ref: R('5:2') },
      '新车': { text: '现在你们应当造一辆新车，将两只未曾负轭有乳的母牛套在车上，使牛犊回家去，离开母牛。', ref: R('6:7') },
      '母牛': { text: '牛直行大道，往伯‧示麦去，一面走一面叫，不偏左右。', ref: R('6:12') },
      '伯‧示麦人': { text: '伯‧示麦人正在平原收割麦子，举目看见约柜，就欢喜了。', ref: R('6:13') },
      '麦田': { text: '这不是割麦子的时候吗？我求告耶和华，他必打雷降雨……', ref: R('12:17') },
      '以便以谢': { text: '撒母耳将一块石头立在米斯巴和善的中间，给石头起名叫以便以谢，<br>说：「到如今耶和华都帮助我们。」', ref: R('7:12') },
      '拉玛': { text: '随后回到拉玛，因为他的家在那里；也在那里审判以色列人，且为耶和华筑了一座坛。', ref: R('7:17') },
      '长老': { text: '以色列的长老都聚集，来到拉玛见撒母耳……', ref: R('8:4') },
      '扫罗': { text: '他有一个儿子，名叫扫罗，又健壮、又俊美，在以色列人中没有一个能比他的；<br>身体比众民高过一头。', ref: R('9:2') },
      '仆人': { text: '仆人说：「这城里有一位神人，是众人所尊重的，凡他所说的全都应验……」', ref: R('9:6') },
      '器具': { text: '就问耶和华说：「那人到这里来了没有？」耶和华说：「他藏在器具中了。」', ref: R('10:22') },
      '约拿单': { text: '约拿单对拿兵器的少年人说：「……因为耶和华使人得胜，不在乎人多人少。」', ref: R('14:6') },
      '拿兵器的': { text: '拿兵器的对他说：「随你的心意行吧。你可以上去，我必跟随你，与你同心。」', ref: R('14:7') },
      '播薛': { text: '……这隘口两边各有一个山峰：一名播薛，一名西尼；<br>一峰向北，与密抹相对，一峰向南，与迦巴相对。', ref: R('14:4–5') },
      '西尼': { text: '……这隘口两边各有一个山峰：一名播薛，一名西尼；<br>一峰向北，与密抹相对，一峰向南，与迦巴相对。', ref: R('14:4–5') },
      '亚甲': { text: '撒母耳说：「要把亚玛力王亚甲带到我这里来。」<br>亚甲就欢欢喜喜地来到他面前，心里说，死亡的苦难必定过去了。', ref: R('15:32') },
      '上好的羊': { text: '撒母耳说：「我耳中听见有羊叫、牛鸣，是从哪里来的呢？」', ref: R('15:14') },
      '上好的牛': { text: '撒母耳说：「我耳中听见有羊叫、牛鸣，是从哪里来的呢？」', ref: R('15:14') },
      '坛': { text: '撒母耳就把一只吃奶的羊羔献与耶和华作全牲的燔祭，为以色列人呼求耶和华；耶和华就应允他。', ref: R('7:9') },
      '以色列众支派': { text: '现在你们应当按着支派、宗族都站在耶和华面前。', ref: R('10:19') },
      '非利士人': { text: '从此，非利士人就被制伏，不敢再入以色列人的境内。<br>撒母耳作士师的时候，耶和华的手攻击非利士人。', ref: R('7:13') },
    },
  });
})(window.GS);
