/* ─────────────────────────────────────────────────────────────
 * book/parables.js —— 四福音 · 比喻（马太福音 13 · 路加福音 10 — 15）
 *
 * 加利利海边的早晨：耶稣坐在岸边的一只小船上，众人都站在岸上（太 13:1–2）。
 * 他用比喻讲道——他一开口，一缕金色的微光便从他那里流向右边的地，比喻就在那里"活"成一幅画：
 * 画里的人自光中显出，脚下一片淡淡的金光；这一幅讲完，下一幅开始时，前一幅的人与物都化回光里。
 *   撒种的（路旁的种子被飞鸟吃尽；石头地上发苗最快，日头一晒就枯干；荆棘长起来把它挤住；好土里结实，
 *   一百倍、六十倍、三十倍）· 芥菜种长成一棵大树，天上的飞鸟来宿在枝上 · 宝贝藏在地里、重价的珠子。
 * 耶稣离开众人，进了房子。其后是路加福音里往耶路撒冷去的路上：
 *   好撒马利亚人（一条自耶路撒冷下耶利哥的路：躺在路旁的人，祭司与利未人从那边过去，撒马利亚人牵着牲口来）·
 *   马大与马利亚（真事：村庄里的一间屋，马利亚坐在耶稣脚前）· 半夜借饼（叩门，灯点着，门开了）·
 *   无知的财主（仓房拆了另盖更大的；「今夜必要你的灵魂」——他身旁的灯灭了，人不见了）·
 *   大筵席（傍晚灯下的长席，贫穷的、残废的、瞎眼的、瘸腿的都来坐满）· 失羊 · 失钱（天上、神的使者面前的欢喜）·
 *   浪子（远方的饥荒与猪；「相离还远，他父亲看见，就动了慈心，跑去抱着他的颈项」——本卷的签名之景；
 *   上好的袍子、戒指、鞋、灯火与乐声）· 大儿子站在门外，父亲出来劝他：「儿啊！你常和我同在」——
 *   父亲的手一直伸着，大儿子没有回答（经上没有说他怎样回答；这话正是说给站在一旁的法利赛人听的）。
 *
 * 神的显现：子（耶稣）如常人行走，无面目，衣袍用 GS.cast.LOOK.jesus；人与光都向他转去。
 * 圣灵只作光（路 11:13 是应许：高处聚起一团柔光，还没有降在人身上——那要到五旬节）。神的使者是光的形。死只以灯灭与不见来说。
 * 画面的方位：左 = 加利利海（船）；近岸 0.4–0.6 = 迦百农一带的村庄与听道的人；右 0.63–0.94 = 比喻之"画"；
 *            浪子一段：父家 0.7，大儿子的田在父家右边，近岸右端（0.83–1）是"远方"。一切位置都以画面宽度的比例记下；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'parables';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('paHeaven', 'exp', 1.1);    // 天上的欢喜（路 15:7、15:10）
  W.defineLevel('paSpirit', 'exp', 0.5);    // 何况天父，岂不更将圣灵给求他的人（路 11:13）：高处聚起的一团柔光（是应许，还没有降下）
  W.defineLevel('paCold', 'exp', 0.35);     // 「今夜必要你的灵魂」：画里冷而静的夜（路 12:20）

  // ── 地上的位置（画面宽度的比例）：桌面 / 竖屏的手机 ─────────────
  const XL = {
    boatX: 0.29, boatY: 0.958, shore: 0.372, peterM: 0.386, johnM: 0.4, crowd0: 0.415, crowd1: 0.585,
    hC: 0.445, hA: 0.5, hB: 0.558,
    // 路加：耶稣与门徒
    jes: 0.515, pet: 0.49, joh: 0.472, d1: 0.456, d2: 0.44, law: 0.558, fire: 0.468,
    // 画
    pic0: 0.625, pic1: 0.935, tree: 0.795, treasure: 0.742, merch: 0.872, road0: 0.615, road1: 0.975, lie: 0.782, inn: 0.668,
    mh: 0.676, fhouse: 0.835, fman0: 0.7, barns: 0.868, rich: 0.815, rf0: 0.632, rf1: 0.79, tab0: 0.664, tab1: 0.842, master: 0.866, called: 0.9,
    flock0: 0.742, flock1: 0.878, lost: 0.928, chouse: 0.806, home: 0.7, efield0: 0.772, efield1: 0.812, far: 0.905, meet: 0.85,
    // 大儿子站住的地方（父家右边、偏屋之外）与父亲出来劝他的地方
    estop: 0.767, plead: 0.747,
  };
  const XP = {
    boatX: 0.24, boatY: 0.962, shore: 0.37, peterM: 0.395, johnM: 0.43, crowd0: 0.45, crowd1: 0.6,
    jes: 0.522, pet: 0.472, joh: 0.428, law: 0.588, fire: 0.462,
    home: 0.715, efield0: 0.806, efield1: 0.846, far: 0.935, meet: 0.886, estop: 0.803, plead: 0.779,
  };
  const X = Object.assign({}, XL);
  let PORT = false;
  function layout() {
    PORT = W.w < W.h * 0.9;
    for (const k in XL) X[k] = PORT && XP[k] != null ? XP[k] : XL[k];
  }
  const port = () => W.w < W.h * 0.9;
  // 白昼的时辰：竖屏的手机上经文在顶上，日头要留在经文框之下（早晨约 0.31、傍晚约 0.7）
  const DAYC = (d, p) => (PORT ? p : d);

  // 衣袍
  const ROBE = {
    sower: [168, 140, 96], planter: [120, 132, 96], plow: [150, 118, 86], merchant: [96, 84, 132],
    traveler: [150, 128, 104], stripped: [214, 204, 184], priest: [236, 234, 226], levite: [150, 160, 188], samaritan: [70, 116, 118],
    innkeeper: [138, 110, 80], lawyer: [84, 92, 120], martha: [176, 104, 72], maryb: [104, 128, 150],
    knocker: [128, 108, 88], friend: [110, 100, 120], rich: [118, 62, 104], master: [166, 128, 70], servant: [150, 142, 120],
    shepherd: [140, 112, 78], woman: [150, 96, 110], father: [120, 110, 132], son: [150, 120, 84], rags: [128, 116, 98],
    best: [244, 236, 214], elder: [98, 108, 86],
  };
  const PLAIN = [[160, 140, 112], [136, 120, 100], [176, 158, 126], [120, 110, 98], [150, 128, 104], [132, 124, 110], [184, 164, 132]];
  const POOR = [[132, 120, 104], [118, 108, 96], [146, 132, 110], [110, 104, 96], [138, 126, 112], [124, 112, 100]];
  const PHAR = [[228, 224, 214], [206, 210, 222], [220, 214, 196]];
  const DR = () => GS.cast.DISCIPLE_ROBES || [[122, 104, 84], [96, 104, 118]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { hx: 0.78, sx: 0.5, boat: 1, where: 'boat' }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.3 : 1) * (LK[l] || 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const easeOut = t => 1 - (1 - t) * (1 - t);
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return !!c && (c.has ? c.has(id) : !!(c.get && c.get(id))); };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c && c.get ? c.get(id) : null; }
  const FIGK = () => (PORT ? 1.12 : 1);
  function add(id, o) {
    o = o || {};
    const base = { from: W.replaying ? 'none' : (o.from || 'fade') };
    if (!has(id)) base.scale = (o.scale || 1) * FIGK();
    const q = Object.assign({}, o, base);
    if (has(id)) delete q.scale;
    return C().add(id, q);
  }
  // 比喻里的人：自光中显出，胸中的光略亮
  function pic(id, o) { return add(id, Object.assign({ from: 'light', glow: 0.3 }, o)); }
  const LOOK = id => Object.assign({}, (GS.cast.LOOK && GS.cast.LOOK[id]) || {});
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (has(id)) C().walk(id, x, Object.assign({ run: true }, o)); }
  function place(id, x, layer) { if (has(id)) C().place(id, x, layer); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { VT.delete(id); if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function carry(id, what) { const c = C(); if (c.carry && has(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.holdHands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function ride(id, m) { const c = C(); if (c.ride && has(id)) U.safe('cast.ride', () => c.ride(id, m || null)); }
  function attach(id, fn) { const c = C(); if (c.attach && has(id)) c.attach(id, fn || null); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && has(id)) U.safe('cast.fly', () => c.fly(id, x, y, o)); }
  function beast(id, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o))); }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    if (PORT) ms.forEach(m => { m.scale = (m.scale || 1) * FIGK(); });
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    return U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o))) || [];
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  function cglow(gid, v) { for (const m of cmembers(gid)) m.glow = v; }
  const man = (pal, v0, v1, age) => (m, i) => { m.sex = 'm'; m.age = age || (i % 5 === 3 ? 'elder' : 'adult'); m.robe = pal[i % pal.length]; m.accent = null; m.prop = null; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };
  const woman = (pal, v0, v1) => (m, i) => { m.sex = 'f'; m.age = 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.hairOpt = null; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };
  const folk = (pal, v0, v1) => (m, i) => { m.robe = pal[i % pal.length]; if (m.age === 'child' && i % 2) m.age = 'adult'; if (v1 != null) m.v = lerp(v0, v1, ((i * 0.618) % 1)); };

  // 人在近地纵深里前后挪动（v 缓动；重演时直接到位）
  const VT = new Map();
  function sink(id, v) {
    const f = fig(id);
    if (!f) return;
    if (W.replaying) { f.v = v; VT.delete(id); } else VT.set(id, v);
  }

  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.7, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - 44 * LS(l) * k];
  }
  // 地上的走兽绕开人与画
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // 各物件缓动的量（每秒的线性步长；物件可以自带 rate 覆盖）
  const EASE = { a: 0.8, grow: 0.12, sow: 0.07, lit: 0.6, k: 0.4, k2: 0.4, k3: 0.4, k4: 0.4, k5: 0.3, k6: 0.3, k7: 0.4 };
  const FIELDS = Object.keys(EASE);
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k of FIELDS) p[k] = k === 'a' ? p.ta : p['t' + k]; }
  // prop(id, kind, { x, x0, x1, y, v, layer, size, label, tone, rate, show, now, …FIELDS })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, y: 0.9, v: 0, layer: 2, size: 1, label: '', tone: null, rate: null, seed: hashStr(id) };
      for (const k of FIELDS) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1;
      P.set(id, p);
      sortedN = -1;
    }
    if (o.rate) p.rate = Object.assign({}, p.rate || {}, o.rate);
    for (const k of ['x', 'x0', 'x1', 'y', 'v', 'layer', 'size', 'label', 'tone']) if (o[k] != null) { p[k] = o[k]; if (k !== 'label') p.model = null; }
    for (const k of FIELDS) if (k !== 'a' && o[k] != null) { p['t' + k] = o[k]; if (o.now) p[k] = o[k]; }
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (W.replaying) snap(p);
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); sortedN = -1; return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  let sorted = [], sortedN = -1;
  const ORDER = { town: 0, house: 1, fhouse: 1, crop: 2, road: 2, field: 3, famine: 3, thorny: 4, barns: 4, tree: 5, treasure: 6, hearth: 7, lamp: 7, coin: 7, pigs: 8, pool: 9, aura: -1 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }
  function beam(b, xf, layer, o) {
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l, v: o.v || 0, w: (o.w || 70) * SU() * (l === 2 ? 1 : 0.7), k: o.k || 1, rgb: o.rgb || null });
    if (o.ring !== false && fx()) fx().ring(xf * W.w, baseY(l, xf, o.v || 0) - 16 * LS(l), o.rgb || [255, 236, 190], M() * (o.r || 0.22), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, Object.assign({ v: f.v }, o)); }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.6 : frac);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }
  // 他一开口：一缕金色的微光自耶稣流向右边的"画"
  function tell(b, xf, v, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'stream', t: 0, dur: o.dur || 3.2, xf, v: v == null ? 0.3 : v, from: o.from || 'jesus' });
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx('harp', { soft: true }));
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
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
        pale: radial([226, 230, 255], 1), amber: radial([255, 206, 120], 1, 0.5), lamp: radial([255, 150, 60], 1, 0.22),
        cold: radial([120, 150, 220], 1, 0.5), dot: radial([255, 240, 200], 1, 0.6), silver: radial([236, 242, 255], 1, 0.4),
      };
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;
  function glowAt(img, x, y, r, a, sy) {
    if (!img || !ctxA || a < 0.004 || !(r > 0)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    const a0 = ctx.globalAlpha;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.4, k * (0.28 + 0.5 * nightK()) * a0);
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = k * q[3] * a0;
      ctx.fillStyle = q[2];
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 0.9, y - H * 0.55, sx + Math.sin(W.t * 8 + seed + i) * w * 0.45, y - H);
      ctx.quadraticCurveTo(sx + w * 0.9, y - H * 0.55, sx + w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a0;
  }

  // ════════════════════════════════════════════════════════════
  //  画：船（加利利海边；耶稣坐在船上，众人站在岸上）
  // ════════════════════════════════════════════════════════════
  const WOOD = [112, 84, 58], WOOD2 = [80, 60, 44], SAILC = [226, 214, 190];
  const sh = (rgb, extra, a) => W.shadeCSS(rgb, 0.1, a == null ? 1 : a, extra || 0);
  function boatGeom(p) {
    const x = p.x * W.w, y = p.y * W.h;
    const L = 150 * W.unit * (W.w < 600 ? 1.25 : 1) * (p.size || 1);
    const bob = Math.sin(W.t * 1.3 + p.seed) * 1.1 * W.unit, roll = Math.sin(W.t * 0.9 + p.seed) * 0.012;
    return { x, y: y + bob, L, roll };
  }
  function boatSeat() {
    const p = P.get('boat');
    if (!p) return null;
    const g = boatGeom(p);
    return [g.x - 0.1 * g.L, g.y - 0.02 * g.L];
  }
  function hullPath(ctx, L) {
    ctx.beginPath();
    ctx.moveTo(-0.5 * L, -0.13 * L);
    ctx.quadraticCurveTo(-0.46 * L, 0.02 * L, -0.33 * L, 0.035 * L);
    ctx.lineTo(0.3 * L, 0.035 * L);
    ctx.quadraticCurveTo(0.45 * L, 0.01 * L, 0.53 * L, -0.17 * L);
    ctx.lineTo(0.46 * L, -0.1 * L);
    ctx.lineTo(-0.44 * L, -0.085 * L);
    ctx.closePath();
  }
  function drawBoat(ctx, p, front) {
    if (p.a < 0.01) return;
    const g = boatGeom(p), L = g.L;
    if (!front && W.seaBand(g.y) === 'seaNear') {
      // 水里的影与倒影
      ctx.globalAlpha = p.a * 0.35;
      ctx.fillStyle = 'rgba(8,18,30,0.8)';
      ctx.beginPath(); ctx.ellipse(g.x, g.y + 0.05 * L, 0.52 * L, 0.05 * L, 0, 0, TAU); ctx.fill();
    }
    ctx.save();
    ctx.translate(g.x, g.y); ctx.rotate(g.roll);
    ctx.globalAlpha = p.a;
    if (!front) {
      // 桅与收起的帆
      ctx.fillStyle = sh(WOOD2);
      ctx.fillRect(0.14 * L - 0.008 * L, -0.56 * L, 0.016 * L, 0.48 * L);
      ctx.save(); ctx.translate(0.14 * L, -0.5 * L); ctx.rotate(-0.32);
      ctx.fillRect(-0.21 * L, -0.006 * L, 0.42 * L, 0.012 * L);
      ctx.fillStyle = sh(SAILC, 0.05);
      ctx.beginPath(); ctx.ellipse(0, 0.012 * L, 0.18 * L, 0.022 * L, 0, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = sh(WOOD2, 0, 0.7); ctx.lineWidth = Math.max(0.5, 0.004 * L);
      ctx.beginPath(); ctx.moveTo(0.14 * L, -0.55 * L); ctx.lineTo(0.5 * L, -0.15 * L); ctx.moveTo(0.14 * L, -0.55 * L); ctx.lineTo(-0.46 * L, -0.11 * L); ctx.stroke();
      // 船里（背光的内舷）
      ctx.fillStyle = sh([58, 44, 34]);
      ctx.beginPath(); ctx.moveTo(-0.47 * L, -0.12 * L); ctx.lineTo(0.47 * L, -0.15 * L); ctx.lineTo(0.42 * L, -0.08 * L); ctx.lineTo(-0.42 * L, -0.07 * L); ctx.closePath(); ctx.fill();
    }
    // 船身（外舷）：在人之后再画一次，遮住坐在船里的人的腿
    hullPath(ctx, L);
    ctx.fillStyle = sh(WOOD);
    ctx.fill();
    ctx.strokeStyle = sh(WOOD2, 0, 0.8); ctx.lineWidth = Math.max(0.6, 0.006 * L);
    ctx.beginPath(); ctx.moveTo(-0.45 * L, -0.04 * L); ctx.quadraticCurveTo(0, -0.03 * L, 0.49 * L, -0.1 * L); ctx.stroke();
    ctx.strokeStyle = sh([255, 236, 204], 0.1, 0.55 * W.daylight + 0.1);
    ctx.lineWidth = Math.max(0.7, 0.008 * L);
    ctx.beginPath(); ctx.moveTo(-0.5 * L, -0.13 * L); ctx.lineTo(-0.44 * L, -0.085 * L); ctx.lineTo(0.46 * L, -0.1 * L); ctx.lineTo(0.53 * L, -0.17 * L); ctx.stroke();
    ctx.restore();
    if (!front) {
      // 船边的水纹
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgb(220,232,246)';
      ctx.globalAlpha = p.a * (0.18 + 0.1 * Math.sin(W.t * 1.7));
      ctx.lineWidth = Math.max(0.7, 0.008 * L);
      ctx.beginPath(); ctx.ellipse(g.x, g.y + 0.035 * L, 0.55 * L, 0.035 * L, 0, 0.15, Math.PI - 0.15); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      // 系船的绳：自船头到岸边的木桩
      const sx = X.shore * W.w + 6 * SU(), sy = gY(2, X.shore + 0.006);
      ctx.globalAlpha = p.a * 0.8;
      ctx.strokeStyle = sh([90, 72, 52], 0, 0.8); ctx.lineWidth = Math.max(0.6, 0.005 * L);
      ctx.beginPath(); ctx.moveTo(g.x + 0.5 * L, g.y - 0.15 * L); ctx.quadraticCurveTo((g.x + 0.5 * L + sx) / 2, Math.max(g.y, sy) + 0.02 * L, sx, sy - 0.07 * L); ctx.stroke();
      ctx.fillStyle = sh(WOOD2);
      ctx.fillRect(sx - 0.008 * L, sy - 0.09 * L, 0.016 * L, 0.1 * L);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：房屋（加利利的平顶土石屋；门可开，夜里窗与门透出灯光）
  // ════════════════════════════════════════════════════════════
  function house(ctx, l, x, y, w, h, tone, o) {
    o = o || {};
    const s = LS(l);
    const d = litX() >= x ? 1 : -1;
    const a0 = ctx.globalAlpha;
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), l, 0.9);
    const sw = w * 0.2;
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - sw, y - h, sw, h);
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.3), l);
    ctx.fillRect(x - w / 2 - 1.2 * s, y - h - 1.8 * s, w + 2.4 * s, 2 * s);
    // 屋顶上的一道矮墙与外梯（申 22:8 的规矩——只是画意）
    if (o.stair) {
      ctx.fillStyle = css(mix(tone, [60, 50, 40], 0.25), l);
      const sx = x + (w / 2) * o.stair;
      for (let i = 0; i < 4; i++) ctx.fillRect(sx + (o.stair > 0 ? i : -i - 1) * 2.2 * s, y - (i + 1) * h * 0.22, 2.4 * s, 1.6 * s);
    }
    const dx = x + (o.door || 0) * w, dw = (o.dw || 4.8) * s, dh = Math.min(h * 0.66, (o.dh || 9.6) * s);
    const wx = x + (o.win != null ? o.win : 0.28) * w * d, wy = y - h * 0.7;
    // 门洞与门（门扇随 open 向内开去）
    ctx.fillStyle = css([26, 20, 16], l);
    if (o.door !== false) ctx.fillRect(dx - dw / 2, y - dh, dw, dh);
    if (o.win !== false) ctx.fillRect(wx - 1.6 * s, wy - 1.6 * s, 3.2 * s, 3.2 * s);
    const open = o.open == null ? 1 : o.open;
    if (o.door !== false && open < 0.999) {
      ctx.fillStyle = css([104, 76, 50], l);
      const ow = dw * (1 - open * 0.82);
      ctx.fillRect(dx - dw / 2, y - dh, ow, dh);
      ctx.fillStyle = css([70, 50, 34], l, 0.8);
      ctx.fillRect(dx - dw / 2 + ow - 0.6 * s, y - dh, 0.6 * s, dh);
    }
    ctx.strokeStyle = css([255, 240, 214], l, 0.4 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 1.2 * s, y - h - 1.8 * s); ctx.lineTo(x + w / 2 + 1.2 * s, y - h - 1.8 * s);
    if (d > 0) { ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); } else { ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2, y); }
    ctx.stroke();
    // 灯：窗里、门里（门开了，光洒在门前的地上）
    const lk = (o.lamp || 0) * Math.min(1, nightK() * 1.1 + (o.lampDay || 0));
    if (lk > 0.02 && SP) {
      const fl = 0.86 + 0.14 * Math.sin(W.t * 6 + x * 0.1);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lk * fl * 0.9) * a0;
      ctx.fillStyle = 'rgb(255,180,100)';
      if (o.win !== false) ctx.fillRect(wx - 1.6 * s, wy - 1.6 * s, 3.2 * s, 3.2 * s);
      if (o.door !== false && open > 0.05) {
        ctx.globalAlpha = Math.min(1, lk * fl * 0.75 * open) * a0;
        const iw = dw * open * 0.82;
        ctx.fillRect(dx - dw / 2 + dw - iw, y - dh, iw, dh);
        // 门前地上的光
        ctx.globalAlpha = Math.min(1, lk * 0.32 * open) * a0;
        ctx.beginPath(); ctx.moveTo(dx - dw / 2, y); ctx.lineTo(dx + dw / 2, y); ctx.lineTo(dx + dw * 1.6, y + dh * 0.5); ctx.lineTo(dx - dw * 1.6, y + dh * 0.5); ctx.closePath(); ctx.fill();
      }
      glowAt(SP.warm, o.door !== false && open > 0.05 ? dx : wx, y - dh * 0.6, (o.door !== false ? 24 : 12) * s, lk * fl * 0.5 * a0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a0;
    }
  }
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w;
    const w = (p.tone && p.tone.w ? p.tone.w : 26) * s, h = (p.tone && p.tone.h ? p.tone.h : 17) * s;
    const gl = gY(l, p.x - w / (2 * W.w)), gr = gY(l, p.x + w / (2 * W.w)), gm = gY(l, p.x);
    const y = Math.min(gl, gm, gr) + 2 * s + (p.v ? p.v * fieldH(l, gm) * 0.8 : 0);
    ctx.globalAlpha = p.a;
    // 屋基：低的一边砌一段石台接到地
    ctx.fillStyle = css([132, 116, 94], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - 2 * s, y); ctx.lineTo(x + w / 2 + 2 * s, y);
    ctx.lineTo(x + w / 2 + 2 * s, Math.max(y, gr + 3 * s)); ctx.lineTo(x - w / 2 - 2 * s, Math.max(y, gl + 3 * s));
    ctx.closePath(); ctx.fill();
    const t = p.tone || {};
    house(ctx, l, x, y, w, h, t.rgb || [168, 146, 116], { door: t.door != null ? t.door : -0.12, win: t.win, lamp: p.lit, lampDay: t.lampDay || 0, open: 1 - p.k, stair: t.stair });
    ctx.globalAlpha = 1;
  }
  // 中丘上远处的村庄（迦百农一带）：几间小屋
  function drawTown(ctx, p) {
    const l = p.layer, s = LS(l) * p.size;
    const r = U.mulberry32(p.seed);
    ctx.globalAlpha = p.a;
    const n = 6;
    for (let i = 0; i < n; i++) {
      const xf = lerp(p.x0, p.x1, (i + 0.2 + r() * 0.6) / n), w = (18 + r() * 12) * s, h = (11 + r() * 8) * s;
      house(ctx, l, xf * W.w, gY(l, xf) + 2 * s, w, h, mix([176, 156, 126], [150, 132, 110], r()), { door: (r() - 0.5) * 0.5, win: r() < 0.8 ? (r() - 0.5) * 0.7 : false, lamp: p.lit });
    }
    ctx.globalAlpha = 1;
  }
  // 父家：院墙、正屋与一间偏屋；筵席时屋顶与院里挂满了灯
  function drawFHouse(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w;
    const w = 34 * s, h = 20 * s;
    const gm = gY(l, p.x), y = Math.min(gm, gY(l, p.x - 0.02), gY(l, p.x + 0.02)) + 2 * s;
    ctx.globalAlpha = p.a;
    // 偏屋（右后）
    house(ctx, l, x + w * 0.62, y - 1 * s, w * 0.5, h * 0.72, [150, 130, 104], { door: false, win: -0.1, lamp: p.lit * 0.8 });
    // 正屋
    house(ctx, l, x, y, w, h, [178, 156, 124], { door: -0.18, dw: 5.6, dh: 11, win: 0.26, lamp: p.lit, lampDay: p.k * 0.5, open: 0.4 + 0.6 * p.k2 });
    // 院墙（左前一段）
    ctx.fillStyle = css([150, 132, 106], l);
    ctx.fillRect(x - w * 0.9, y - 6 * s, w * 0.34, 6 * s);
    ctx.fillStyle = css([176, 158, 128], l, 1, 0.05);
    ctx.fillRect(x - w * 0.92, y - 6.8 * s, w * 0.38, 1.2 * s);
    // 筵席的灯：屋檐下一串小灯，院里两盏
    const k = p.k;
    if (k > 0.02 && SP) {
      const fl = 0.85 + 0.15 * Math.sin(W.t * 5 + p.seed);
      for (let i = 0; i < 7; i++) {
        const lx = x - w * 0.46 + (i / 6) * w * 0.92, ly = y - h - 0.5 * s + Math.sin((i / 6) * Math.PI) * 2.4 * s;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = css([90, 70, 50], l);
        ctx.fillRect(lx - 0.5 * s, ly - 0.3 * s, 1 * s, 1.6 * s);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.lamp, lx, ly + 1.8 * s, 5 * s, k * p.a * (0.55 + 0.45 * nightK()) * (0.8 + 0.2 * Math.sin(W.t * 7 + i)));
        ctx.globalCompositeOperation = 'source-over';
      }
      for (const dx of [-0.72, 0.36]) flame(ctx, x + dx * w, y - 6.8 * s, 5 * s, k * p.a, p.seed + dx * 10);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, x, y - h * 0.4, w * 1.4, k * p.a * (0.12 + 0.3 * nightK()) * fl, 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：撒种的田（太 13:3–8）——路旁、土浅石头地、荆棘、好土，自左向右四段
  // ════════════════════════════════════════════════════════════
  const FV0 = 0.08, FV1 = 0.72;
  const fvOf = v => lerp(FV0, FV1, v);
  const PT = [0, 0];
  // 田在地上向远处收窄（透视）：后边比前边窄一些
  function fpt(p, u, v, out) {
    const xc = (p.x0 + p.x1) / 2, xf = xc + (lerp(p.x0, p.x1, u) - xc) * (0.9 + 0.14 * v);
    out[0] = xf * W.w; out[1] = baseY(2, xf, fvOf(v)); return out;
  }
  const fwav = (p, u) => 0.92 + 0.05 * Math.sin(u * 19 + p.seed) + 0.03 * Math.sin(u * 47 + p.seed * 3);
  function fieldModel(p) {
    const r = U.mulberry32(p.seed);
    const m = { seeds: [], stones: [], sprR: [], sprT: [], bush: [], stalks: [], birds: [] };
    for (let i = 0; i < 18; i++) m.seeds.push({ u: lerp(0.02, 0.19, r()), v: lerp(0.2, 0.8, r()) });
    for (let i = 0; i < 26; i++) m.seeds.push({ u: lerp(0.22, 0.99, r()), v: lerp(0.12, 0.9, r()) });
    for (let i = 0; i < 17; i++) m.stones.push({ u: lerp(0.22, 0.46, r()), v: lerp(0.08, 0.95, r()), r: 1.1 + r() * 2.1, t: r() });
    for (let i = 0; i < 28; i++) m.sprR.push({ u: lerp(0.225, 0.455, r()), v: lerp(0.12, 0.9, r()), h: 0.7 + r() * 0.5, lean: (r() - 0.5) * 0.4 });
    for (let i = 0; i < 24; i++) m.sprT.push({ u: lerp(0.49, 0.71, r()), v: lerp(0.12, 0.9, r()), h: 0.7 + r() * 0.5, lean: (r() - 0.5) * 0.4 });
    for (let i = 0; i < 10; i++) m.bush.push({ u: lerp(0.48, 0.72, (i + r()) / 10), v: lerp(0.05, 0.85, r()), s: 0.8 + r() * 0.5, seed: r() * 100 });
    for (let i = 0; i < 66; i++) {
      const u = lerp(0.745, 0.99, r());
      const grp = u < 0.83 ? 0 : u < 0.91 ? 1 : 2;
      if (grp === 2 && r() < 0.35) continue;
      m.stalks.push({ u, v: lerp(0.1, 0.92, r()), grp, h: 0.85 + r() * 0.3, lean: (r() - 0.5) * 0.3, ph: r() * TAU });
    }
    for (let i = 0; i < 5; i++) m.birds.push({ u: lerp(0.03, 0.18, (i + r()) / 5), v: lerp(0.3, 0.7, r()), ph: r() * TAU, sx: 0.4 + r() * 0.6, sy: 0.35 + r() * 0.25 });
    const byV = (a, b) => a.v - b.v;
    m.stones.sort(byV); m.sprR.sort(byV); m.sprT.sort(byV); m.bush.sort(byV); m.stalks.sort(byV);
    return m;
  }
  const SOIL = { path: [176, 154, 118], rock: [140, 126, 106], thorn: [112, 90, 64], good: [86, 62, 42] };
  // 一段地：后边贴着地的轮廓，前边起伏不齐；两旁微微参差
  function strip(ctx, p, u0, u1, rgb, a) {
    ctx.fillStyle = css(rgb, 2, a);
    ctx.beginPath();
    const n = 8;
    for (let i = 0; i <= n; i++) { fpt(p, lerp(u0, u1, i / n), 0.02, PT); if (i) ctx.lineTo(PT[0], PT[1]); else ctx.moveTo(PT[0], PT[1]); }
    for (let j = 1; j <= 3; j++) { const v = j / 3; fpt(p, u1 + 0.006 * Math.sin(j * 2.1 + u1 * 30), v * fwav(p, u1), PT); ctx.lineTo(PT[0], PT[1]); }
    for (let i = n; i >= 0; i--) { const u = lerp(u0, u1, i / n); fpt(p, u, fwav(p, u), PT); ctx.lineTo(PT[0], PT[1]); }
    for (let j = 2; j >= 1; j--) { const v = j / 3; fpt(p, u0 + 0.006 * Math.sin(j * 2.1 + u0 * 30), v * fwav(p, u0), PT); ctx.lineTo(PT[0], PT[1]); }
    ctx.closePath(); ctx.fill();
  }
  function drawField(ctx, p) {
    const A = p.a;
    if (A < 0.01) return;
    if (!p.model) p.model = fieldModel(p);
    const m = p.model, s = LS(2);
    const sway = t => Math.sin(W.t * 1.5 + t) * (0.05 + 0.08 * Math.abs(W.wind || 0));
    // 四段地
    strip(ctx, p, 0, 0.21, SOIL.path, A * 0.62);
    strip(ctx, p, 0.215, 0.47, SOIL.rock, A * 0.62);
    strip(ctx, p, 0.475, 0.73, SOIL.thorn, A * 0.68);
    strip(ctx, p, 0.735, 1, SOIL.good, A * 0.78);
    // 垄沟
    ctx.strokeStyle = css([60, 44, 30], 2, 0.35 * A);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let r = 1; r < 5; r++) {
      const v = r / 5.6;
      fpt(p, 0.235, v, PT); ctx.moveTo(PT[0], PT[1]);
      for (let i = 1; i <= 6; i++) { fpt(p, lerp(0.235, 0.99, i / 6), v, PT); ctx.lineTo(PT[0], PT[1]); }
    }
    ctx.stroke();
    // 路旁被踩硬的地：两道脚印
    ctx.fillStyle = css([140, 118, 88], 2, 0.5 * A);
    for (let i = 0; i < 9; i++) { fpt(p, 0.02 + i * 0.021, 0.45 + (i % 2) * 0.08, PT); ctx.beginPath(); ctx.ellipse(PT[0], PT[1], 1.4 * s, 0.6 * s, 0, 0, TAU); ctx.fill(); }
    // 石头
    for (const q of m.stones) {
      fpt(p, q.u, q.v, PT);
      const r = q.r * s * (1 + 0.3 * q.v);
      ctx.fillStyle = css(mix([150, 142, 130], [118, 110, 100], q.t), 2, A);
      ctx.beginPath(); ctx.ellipse(PT[0], PT[1] - r * 0.4, r * 1.3, r * 0.75, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([236, 228, 214], 2, 0.35 * A * dayA(), 0.2);
      ctx.beginPath(); ctx.ellipse(PT[0] - r * 0.3, PT[1] - r * 0.8, r * 0.6, r * 0.25, 0, 0, TAU); ctx.fill();
    }
    // 撒下的种子（撒到哪里，种子就落到哪里）；路旁的被飞鸟吃尽
    const eat = p.k7;
    ctx.fillStyle = css([236, 216, 160], 2, A * 0.95, 0.2);
    for (let i = 0; i < m.seeds.length; i++) {
      const q = m.seeds[i];
      if (q.u > p.sow) continue;
      let a = 1;
      if (q.u < 0.21) a = 1 - smoothstep(i / 18 * 0.7, i / 18 * 0.7 + 0.3, eat);
      else a = 1 - smoothstep(0.1, 0.4, q.u < 0.47 ? p.k3 : q.u < 0.73 ? p.k5 : p.grow);
      if (a < 0.02) continue;
      fpt(p, q.u, q.v, PT);
      ctx.globalAlpha = a * A;
      ctx.beginPath(); ctx.ellipse(PT[0], PT[1] - 0.7 * s, 1.3 * s, 0.9 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // 土浅石头地：发苗最快；日头一晒就枯干
    const kr = p.k3, kw = p.k4;
    if (kr > 0.01) {
      const col = mix([96, 150, 70], [168, 136, 70], kw);
      ctx.strokeStyle = css(col, 2, A);
      ctx.lineWidth = Math.max(0.8, 1.3 * s);
      ctx.beginPath();
      for (const q of m.sprR) {
        if (q.u > p.sow) continue;
        fpt(p, q.u, q.v, PT);
        const h = 12 * s * q.h * smoothstep(0, 1, kr) * (1 - 0.35 * kw) * (1 + 0.3 * q.v);
        const ang = q.lean + kw * (0.9 + q.lean) + (1 - kw) * sway(q.u * 30);
        ctx.moveTo(PT[0], PT[1]);
        ctx.quadraticCurveTo(PT[0] + Math.sin(ang) * h * 0.3, PT[1] - h * 0.6, PT[0] + Math.sin(ang) * h, PT[1] - Math.cos(ang) * h);
      }
      ctx.stroke();
    }
    // 荆棘里：苗长起来，荆棘也长起来，把它挤住了
    const kt = p.k5;
    if (kt > 0.01) {
      const sp = smoothstep(0, 0.45, kt), choke = smoothstep(0.45, 1, kt);
      ctx.strokeStyle = css(mix([96, 150, 70], [70, 80, 50], choke), 2, A * (1 - 0.6 * choke));
      ctx.lineWidth = Math.max(0.8, 1.3 * s);
      ctx.beginPath();
      for (const q of m.sprT) {
        if (q.u > p.sow) continue;
        fpt(p, q.u, q.v, PT);
        const h = 11 * s * q.h * sp * (1 - 0.3 * choke) * (1 + 0.3 * q.v), ang = q.lean + choke * 0.5;
        ctx.moveTo(PT[0], PT[1]); ctx.lineTo(PT[0] + Math.sin(ang) * h, PT[1] - Math.cos(ang) * h);
      }
      ctx.stroke();
      const bh = smoothstep(0.2, 1, kt);
      if (bh > 0.01) {
        ctx.strokeStyle = css([52, 40, 30], 2, A);
        ctx.lineWidth = Math.max(0.7, 1.1 * s);
        ctx.beginPath();
        for (const q of m.bush) {
          fpt(p, q.u, q.v, PT);
          const H = 17 * s * q.s * bh * (1 + 0.3 * q.v);
          for (let j = 0; j < 7; j++) {
            const a = -Math.PI / 2 + (j - 3) * 0.33 + (hsh(q.seed + j) - 0.5) * 0.3, L = H * (0.55 + 0.45 * hsh(q.seed * 2 + j));
            const ex = PT[0] + Math.cos(a) * L, ey = PT[1] + Math.sin(a) * L;
            ctx.moveTo(PT[0] + (j - 3) * 0.6 * s, PT[1]);
            ctx.quadraticCurveTo(PT[0] + Math.cos(a) * L * 0.4 + Math.sin(j * 2 + q.seed) * 2 * s, PT[1] + Math.sin(a) * L * 0.5, ex, ey);
            // 刺
            for (let t = 0.35; t < 1; t += 0.22) {
              const tx = lerp(PT[0], ex, t), ty = lerp(PT[1], ey, t), d = (j + Math.round(t * 10)) % 2 ? 1 : -1;
              ctx.moveTo(tx, ty); ctx.lineTo(tx + d * 2 * s, ty - 1.2 * s);
            }
          }
        }
        ctx.stroke();
        ctx.fillStyle = css([64, 70, 44], 2, A * 0.85);
        for (const q of m.bush) {
          fpt(p, q.u, q.v, PT);
          const H = 17 * s * q.s * bh * (1 + 0.3 * q.v);
          ctx.beginPath(); ctx.ellipse(PT[0], PT[1] - H * 0.55, H * 0.42, H * 0.36, 0, 0, TAU); ctx.globalAlpha = 0.45 * A * bh; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }
    // 好土里：结实，一百倍、六十倍、三十倍
    const kg = p.grow, gold = p.k6;
    if (kg > 0.01) {
      const HG = [26, 20, 15], EAR = [1.25, 1, 0.8];
      const col = mix([88, 140, 60], [214, 172, 84], gold), ecol = mix([120, 160, 70], [236, 194, 104], gold);
      ctx.strokeStyle = css(col, 2, A);
      ctx.lineWidth = Math.max(0.6, 0.85 * s);
      ctx.beginPath();
      const tips = [];
      for (const q of m.stalks) {
        if (q.u > p.sow) continue;
        fpt(p, q.u, q.v, PT);
        const h = HG[q.grp] * s * q.h * smoothstep(0, 1, kg) * (1 + 0.3 * q.v), ang = q.lean + sway(q.ph) * (0.4 + kg);
        const ex = PT[0] + Math.sin(ang) * h, ey = PT[1] - Math.cos(ang) * h;
        ctx.moveTo(PT[0], PT[1]); ctx.quadraticCurveTo(PT[0] + Math.sin(ang) * h * 0.2, PT[1] - h * 0.55, ex, ey);
        if (kg > 0.55) tips.push(ex, ey, ang, EAR[q.grp] * (1 + 0.3 * q.v));
      }
      ctx.stroke();
      if (tips.length) {
        const ek = smoothstep(0.55, 1, kg);
        ctx.fillStyle = css(ecol, 2, A, 0.05 * gold);
        ctx.beginPath();
        for (let i = 0; i < tips.length; i += 4) {
          const r = 1.3 * s * tips[i + 3] * ek;
          ctx.moveTo(tips[i] + r * 0.9, tips[i + 1]);
          ctx.ellipse(tips[i], tips[i + 1] - r * 1.6, r * 0.9, r * 2.6, tips[i + 2], 0, TAU);
        }
        ctx.fill();
        if (gold > 0.3 && SP) {
          ctx.globalCompositeOperation = 'lighter';
          const cx = lerp(p.x0, p.x1, 0.87), y0 = baseY(2, cx, fvOf(0.5));
          glowAt(SP.gold, cx * W.w, y0 - 16 * s, (p.x1 - p.x0) * W.w * 0.2, A * 0.3 * gold * (0.5 + 0.5 * dayA()), 0.6);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
  }
  // 飞鸟：落在路旁，把种子吃尽，又飞去（在人之后画）
  function drawFieldBirds(ctx, p) {
    const kin = p.k, kout = p.k2;
    if (!p.model || kin < 0.01 || kout > 0.999 || p.a < 0.05) return;
    const m = p.model, s = LS(2);
    ctx.fillStyle = css([34, 30, 30], 2, p.a);
    ctx.strokeStyle = css([34, 30, 30], 2, p.a);
    ctx.lineWidth = Math.max(0.8, 1.1 * s);
    for (let i = 0; i < m.birds.length; i++) {
      const q = m.birds[i];
      const a = c01(kin * 1.5 - i * 0.1), o = c01(kout * 1.4 - i * 0.08);
      if (a <= 0) continue;
      fpt(p, q.u, q.v, PT);
      const lx = PT[0], ly = PT[1];
      const sx = lx - q.sx * 160 * s, sy = ly - q.sy * W.h;
      let x, y, fly = true;
      if (o > 0) { const e = o * o; x = lx - e * 220 * s * q.sx; y = ly - e * W.h * 0.45; }
      else { const e = easeOut(a); x = lerp(sx, lx, e); y = lerp(sy, ly, e) - Math.sin(e * Math.PI) * 12 * s; fly = a < 1; }
      ctx.globalAlpha = p.a * (1 - smoothstep(0.7, 1, o));
      if (fly) {
        const f = Math.sin(W.t * 14 + q.ph) * 2.6 * s, w = 5 * s;
        ctx.beginPath(); ctx.moveTo(x - w, y - f); ctx.quadraticCurveTo(x - w * 0.4, y - 1.5 * s, x, y); ctx.quadraticCurveTo(x + w * 0.4, y - 1.5 * s, x + w, y - f); ctx.stroke();
      } else {
        const peck = Math.max(0, Math.sin(W.t * 5 + q.ph * 3)) * 1.4 * s;
        ctx.beginPath(); ctx.ellipse(x, y - 1.8 * s, 2.6 * s, 1.5 * s, 0.15, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(x + 2.2 * s, y - 2.8 * s + peck, 1.05 * s, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - 2.4 * s, y - 2 * s); ctx.lineTo(x - 4.6 * s, y - 3 * s); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 日头出来一晒（太 13:6）：一阵灼热的光
  function drawSunGlare(ctx, e, q) {
    const env = Math.sin(Math.PI * q);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, W.sun.x, W.sun.y, M() * 0.34, 0.5 * env);
    const p = getP('field');
    if (p) {
      const xf = lerp(p.x0, p.x1, 0.34), y = baseY(2, xf, fvOf(0.5));
      glowAt(SP.amber, xf * W.w, y - 10 * LS(2), (p.x1 - p.x0) * W.w * 0.2, 0.4 * env, 0.5);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  画：芥菜种长成的树，天上的飞鸟宿在枝上（太 13:31–32）
  // ════════════════════════════════════════════════════════════
  function treeModel(p) {
    const r = U.mulberry32(p.seed);
    const segs = [], tips = [];
    let tmax = 0;
    function br(x, y, ang, len, w, depth, t0) {
      const x1 = x + Math.cos(ang) * len, y1 = y + Math.sin(ang) * len, span = 0.16 + 0.03 * depth;
      segs.push({ x0: x, y0: y, x1, y1, w, t0, t1: t0 + span, depth });
      tmax = Math.max(tmax, t0 + span);
      if (depth >= 4) { tips.push({ x: x1, y: y1, t: t0 + span, r: 0.07 + r() * 0.05 }); return; }
      const n = depth === 0 ? 3 : 2 + (r() < 0.45 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const a = ang + (i - (n - 1) / 2) * (0.5 + r() * 0.28) + (r() - 0.5) * 0.18;
        br(x1, y1, a, len * (0.64 + r() * 0.16), w * 0.64, depth + 1, t0 + span * 0.72);
        if (depth >= 2 && r() < 0.5) tips.push({ x: lerp(x, x1, 0.8), y: lerp(y, y1, 0.8), t: t0 + span, r: 0.05 + r() * 0.04 });
      }
    }
    br(0, 0, -Math.PI / 2 + (r() - 0.5) * 0.08, 0.34, 0.075, 0, 0);
    const k = 0.8 / tmax;
    for (const s of segs) { s.t0 *= k; s.t1 *= k; }
    for (const t of tips) t.t = Math.min(0.95, t.t * k + 0.05);
    const perch = [];
    const cand = tips.slice().sort((a, b) => a.y - b.y);
    for (let i = 0; i < cand.length && perch.length < 8; i += Math.max(1, Math.floor(cand.length / 8))) perch.push(cand[i]);
    return { segs, tips, perch };
  }
  function treeBase(p) { const s = LS(2); return { x: p.x * W.w, y: baseY(2, p.x, p.v) + 1 * s, H: 118 * s * (PORT ? 0.95 : 1) }; }
  function drawTree(ctx, p) {
    if (p.a < 0.01) return;
    if (!p.model) p.model = treeModel(p);
    const m = p.model, b = treeBase(p), H = b.H, g = p.grow, s = LS(2);
    ctx.globalAlpha = p.a;
    // 种子：一粒最小的光
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, b.x, b.y - 2 * s, 9 * s, p.lit * p.a * (1 - 0.6 * g));
      glowAt(SP.white, b.x, b.y - 2 * s, 2.6 * s, p.lit * p.a);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (g < 0.005) { ctx.globalAlpha = 1; return; }
    const sway = Math.sin(W.t * 0.8 + p.seed) * 0.006 * H;
    ctx.strokeStyle = css([86, 64, 46], 2, p.a);
    ctx.lineCap = 'round';
    for (const q of m.segs) {
      if (g <= q.t0) continue;
      const e = c01((g - q.t0) / (q.t1 - q.t0));
      const x0 = b.x + q.x0 * H + sway * (-q.y0), y0 = b.y + q.y0 * H;
      const x1 = b.x + lerp(q.x0, q.x1, e) * H + sway * (-lerp(q.y0, q.y1, e)), y1 = b.y + lerp(q.y0, q.y1, e) * H;
      ctx.lineWidth = Math.max(0.6, q.w * H * (0.4 + 0.6 * c01(g * 1.2)));
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
    ctx.lineCap = 'butt';
    // 叶簇
    const leafA = smoothstep(0.35, 1, g);
    if (leafA > 0.01) {
      const L1 = [72, 118, 62], L2 = [96, 146, 74];
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = css(pass ? L2 : L1, 2, p.a * (pass ? 0.8 : 0.95), pass ? 0.06 : 0);
        ctx.beginPath();
        for (const t of m.tips) {
          const k = c01((g - t.t + 0.25) / 0.25);
          if (k <= 0) continue;
          const r = t.r * H * k * (pass ? 0.62 : 1);
          const x = b.x + t.x * H + sway * (-t.y) - (pass ? r * 0.25 : 0), y = b.y + t.y * H - (pass ? r * 0.3 : 0);
          ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.78, 0, 0, TAU);
        }
        ctx.fill();
      }
      // 小黄花（芥菜开的花）
      ctx.fillStyle = css([240, 214, 90], 2, p.a * leafA * 0.9, 0.1);
      for (let i = 0; i < m.tips.length; i += 2) {
        const t = m.tips[i];
        const x = b.x + t.x * H + sway * (-t.y) + (hsh(i) - 0.5) * t.r * H, y = b.y + t.y * H - hsh(i + 3) * t.r * H * 0.6;
        ctx.fillRect(x - 0.8 * s, y - 0.8 * s, 1.6 * s, 1.6 * s);
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawTreeBirds(ctx, p) {
    if (!p.model || p.k < 0.01 || p.a < 0.05) return;
    const m = p.model, b = treeBase(p), H = b.H, s = LS(2);
    ctx.fillStyle = css([40, 34, 34], 2, p.a);
    ctx.strokeStyle = css([40, 34, 34], 2, p.a);
    ctx.lineWidth = Math.max(0.8, 1 * s);
    for (let i = 0; i < m.perch.length; i++) {
      const q = m.perch[i];
      const a = c01(p.k * 1.6 - i * 0.08);
      if (a <= 0) continue;
      const px = b.x + q.x * H, py = b.y + q.y * H - q.r * H * 0.5;
      const sx = px + (i % 2 ? 1 : -1) * (120 + i * 30) * s, sy = py - 150 * s - i * 12 * s;
      const e = easeOut(a), x = lerp(sx, px, e), y = lerp(sy, py, e) - Math.sin(e * Math.PI) * 20 * s;
      ctx.globalAlpha = p.a * c01(a * 3);
      if (a < 1) {
        const f = Math.sin(W.t * 13 + i) * 2.6 * s, w = 5 * s;
        ctx.beginPath(); ctx.moveTo(x - w, y - f); ctx.quadraticCurveTo(x - w * 0.4, y - 1.5 * s, x, y); ctx.quadraticCurveTo(x + w * 0.4, y - 1.5 * s, x + w, y - f); ctx.stroke();
      } else {
        const d = i % 2 ? 1 : -1, bob = Math.sin(W.t * 2 + i) * 0.4 * s;
        ctx.beginPath(); ctx.ellipse(x, y - 1.6 * s + bob, 2.4 * s, 1.5 * s, d * 0.2, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(x + d * 2 * s, y - 2.8 * s + bob, 1 * s, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - d * 2.2 * s, y - 1.6 * s + bob); ctx.lineTo(x - d * 4.4 * s, y - 0.6 * s + bob); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：藏在地里的宝贝；重价的珠子（太 13:44–46）
  // ════════════════════════════════════════════════════════════
  function drawTreasure(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    const dig = p.k;
    ctx.globalAlpha = p.a;
    if (dig > 0.01) {
      // 翻开的土与坑
      ctx.fillStyle = css([74, 54, 38], 2, p.a * dig);
      ctx.beginPath(); ctx.ellipse(x, y, 9 * s, 2.6 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([110, 84, 58], 2, p.a * dig);
      ctx.beginPath(); ctx.ellipse(x + 9 * s, y - 1 * s, 4 * s, 2 * s, 0, 0, TAU); ctx.fill();
      // 箱子：半露出土
      const up = 3.4 * s * dig;
      ctx.fillStyle = css([112, 76, 42], 2, p.a * dig);
      ctx.fillRect(x - 4.4 * s, y - up - 1 * s, 8.8 * s, up + 1 * s);
      ctx.fillStyle = css([214, 172, 80], 2, p.a * dig, 0.2);
      ctx.fillRect(x - 4.6 * s, y - up - 1.6 * s, 9.2 * s, 1.1 * s);
      ctx.fillRect(x - 0.6 * s, y - up - 1 * s, 1.2 * s, up);
    }
    if (p.lit > 0.01 && SP) {
      const fl = 0.85 + 0.15 * Math.sin(W.t * 3 + p.seed);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.gold, x, y - 3 * s, 26 * s * (0.5 + 0.5 * p.lit), p.lit * p.a * 0.75 * fl);
      glowAt(SP.white, x, y - 3 * s, 6 * s, p.lit * p.a * 0.8);
      // 光芒
      ctx.strokeStyle = 'rgb(255,226,150)';
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.globalAlpha = p.lit * p.a * 0.5;
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.3 + Math.sin(W.t * 0.7 + i) * 0.04, L = (18 + 10 * hsh(i + p.seed)) * s * p.lit;
        ctx.moveTo(x + Math.cos(a) * 5 * s, y - 3 * s + Math.sin(a) * 5 * s); ctx.lineTo(x + Math.cos(a) * L, y - 3 * s + Math.sin(a) * L);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 珠子：在买卖人手里（举起时在他头上）
  function drawPearl(ctx, p) {
    if (p.lit < 0.01 || !SP) return;
    const f = fig('merchant');
    let x, y;
    if (f && f._vis) {
      const up = f.pose === 'raise';
      x = f._x + (up ? 0 : (f.fd || 1) * f._h * 0.14);
      y = f._y - f._h * (up ? 1.12 : 0.56);
    } else { x = p.x * W.w; y = baseY(2, p.x, p.v) - 40 * LS(2); }
    const s = LS(2), fl = 0.9 + 0.1 * Math.sin(W.t * 4);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.white, x, y, 22 * s * p.lit, 0.55 * p.lit * fl);
    glowAt(SP.silver, x, y, 5 * s, 0.95 * p.lit);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.lit;
    ctx.fillStyle = 'rgb(250,250,255)';
    ctx.beginPath(); ctx.arc(x, y, 1.6 * s, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：自耶路撒冷下耶利哥的路（路 10:30）；店（10:34）
  // ════════════════════════════════════════════════════════════
  // 路：自右边的山（耶路撒冷）弯弯地下到左边（耶利哥）；两头淡入地里
  const roadV = u => 0.36 + 0.07 * Math.sin(u * Math.PI * 1.4 + 0.4);
  const RHW = 0.085;
  function drawRoad(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), n = 18;
    const at = (u, dv, out) => { const xf = lerp(p.x0, p.x1, u); out[0] = xf * W.w; out[1] = baseY(2, xf, roadV(u) + dv); return out; };
    const x0 = p.x0 * W.w, x1 = p.x1 * W.w;
    const gr = ctx.createLinearGradient(x0, 0, x1, 0);
    const c1 = css([200, 180, 142], 2, 0.78 * p.a), c0 = css([200, 180, 142], 2, 0);
    gr.addColorStop(0, c0); gr.addColorStop(0.14, c1); gr.addColorStop(0.86, c1); gr.addColorStop(1, c0);
    ctx.fillStyle = gr;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { at(i / n, -RHW * (0.8 + 0.2 * (i / n)), PT); if (i) ctx.lineTo(PT[0], PT[1]); else ctx.moveTo(PT[0], PT[1]); }
    for (let i = n; i >= 0; i--) { at(i / n, RHW * (0.8 + 0.2 * (i / n)), PT); ctx.lineTo(PT[0], PT[1]); }
    ctx.closePath(); ctx.fill();
    // 车辙与路边的石
    ctx.strokeStyle = css([160, 140, 108], 2, 0.4 * p.a);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (const dv of [-0.03, 0.035]) for (let i = 2; i <= n - 2; i++) { at(i / n, dv, PT); if (i === 2) ctx.moveTo(PT[0], PT[1]); else ctx.lineTo(PT[0], PT[1]); }
    ctx.stroke();
    ctx.fillStyle = css([150, 138, 118], 2, p.a * 0.9);
    for (let i = 0; i < 16; i++) {
      const u = (i + 0.5) / 16;
      at(u, (i % 2 ? 1 : -1) * (RHW + 0.02), PT);
      ctx.globalAlpha = p.a * smoothstep(0, 0.14, u) * smoothstep(1, 0.86, u);
      ctx.beginPath(); ctx.ellipse(PT[0], PT[1], (1.2 + hsh(i) * 1.2) * s, 0.9 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  const onRoad = (xf, dv) => { const p = getP('road'); const u = p ? clamp((xf - p.x0) / (p.x1 - p.x0), 0, 1) : 0.5; return roadV(u) + (dv || 0); };
  // 远处的耶路撒冷（右边山上一座小城的剪影，只在这条路的比喻里）
  function drawCity(ctx, p) {
    if (p.a < 0.01) return;
    const l = 1, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([188, 170, 140], l);
    ctx.fillRect(x - 30 * s, y - 9 * s, 60 * s, 9 * s);
    for (let i = 0; i < 6; i++) ctx.fillRect(x - 30 * s + i * 11.6 * s, y - 12 * s, 4 * s, 3 * s);
    ctx.fillStyle = css([214, 196, 160], l, 1, 0.08);
    ctx.fillRect(x - 8 * s, y - 20 * s, 18 * s, 11 * s);
    ctx.fillStyle = css([226, 196, 120], l, 1, 0.15);
    ctx.fillRect(x - 9 * s, y - 21.4 * s, 20 * s, 1.6 * s);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：灶火、灯、仓房、筵席、荆棘石、远方的饥荒与猪
  // ════════════════════════════════════════════════════════════
  function drawHearth(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([96, 84, 72], 2);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(x + (i - 2) * 2.6 * s, y - 0.6 * s, 1.6 * s, 1.1 * s, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = css([70, 50, 34], 2); ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x - 4 * s, y - 0.5 * s); ctx.lineTo(x + 3 * s, y - 3 * s); ctx.moveTo(x + 4 * s, y - 0.5 * s); ctx.lineTo(x - 3 * s, y - 3 * s); ctx.stroke();
    flame(ctx, x, y - 1 * s, 8 * s * (0.6 + 0.4 * p.lit), p.lit * p.a, p.seed);
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, x, y - 4 * s, 60 * s, p.lit * p.a * (0.1 + 0.35 * nightK()), 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 一盏小油灯（财主身旁；灭时冒一缕烟）
  function drawLamp(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 104, 66], 2);
    ctx.beginPath(); ctx.ellipse(x, y - 1.2 * s, 3.2 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x + 2 * s, y - 2 * s, 2 * s, 1 * s);
    if (p.lit > 0.01) {
      const fl = 0.82 + 0.18 * Math.sin(W.t * 11 + p.seed) * (1 + (1 - p.lit) * 2);
      flame(ctx, x + 3.6 * s, y - 2 * s, 4.4 * s * p.lit * fl, p.lit * p.a, p.seed);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, x, y - 5 * s, 40 * s, p.lit * p.a * (0.15 + 0.45 * nightK()), 0.7);
      ctx.globalCompositeOperation = 'source-over';
    } else if (p.k > 0.01) {
      // 灭了：一缕青烟升起，渐渐散去
      ctx.strokeStyle = 'rgba(200,204,214,1)';
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.globalAlpha = p.a * p.k * 0.5;
      ctx.beginPath();
      const x0 = x + 3.6 * s, y0 = y - 2.5 * s;
      ctx.moveTo(x0, y0);
      for (let i = 1; i <= 8; i++) ctx.lineTo(x0 + Math.sin(W.t * 1.3 + i * 0.9) * 2 * s * i * 0.3, y0 - i * 3 * s);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 仓房：两间小仓（拆了）→ 两座大仓（盖起来）；门前堆满了粮食
  function barnShape(ctx, x, y, w, h, tone, k) {
    ctx.fillStyle = css(tone, 2);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), 2, 0.9);
    ctx.fillRect(x + w / 2 - w * 0.2, y - h, w * 0.2, h);
    ctx.fillStyle = css(mix(tone, [80, 62, 44], 0.35), 2);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 2, y - h); ctx.lineTo(x, y - h - h * 0.34); ctx.lineTo(x + w / 2 + 2, y - h); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 30, 24], 2);
    ctx.fillRect(x - w * 0.12, y - h * 0.55, w * 0.24, h * 0.55);
    ctx.strokeStyle = css([255, 240, 214], 2, 0.35 * dayA(), 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 2, y - h); ctx.lineTo(x, y - h - h * 0.34); ctx.lineTo(x + w / 2 + 2, y - h); ctx.stroke();
  }
  function drawBarns(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2) * 1.45, x = p.x * W.w, y = baseY(2, p.x, p.v) + 1 * s;
    ctx.globalAlpha = p.a * (1 - 0.45 * p.k3);
    // 小仓
    const small = 1 - p.k;
    if (small > 0.01) {
      ctx.globalAlpha = p.a * small;
      barnShape(ctx, x - 8 * s, y, 12 * s, 9 * s, [160, 138, 104]);
      barnShape(ctx, x + 8 * s, y, 11 * s, 8 * s, [150, 128, 96]);
    }
    // 大仓：自地而起（脚手架随之升起）
    const g = p.grow;
    if (g > 0.01) {
      ctx.save();
      ctx.beginPath(); ctx.rect(x - 60 * s, y - 60 * s * g, 120 * s, 60 * s * g + 2); ctx.clip();
      ctx.globalAlpha = p.a * (1 - 0.45 * p.k3);
      barnShape(ctx, x - 13 * s, y, 24 * s, 21 * s, [172, 150, 116]);
      barnShape(ctx, x + 15 * s, y, 22 * s, 18 * s, [160, 138, 106]);
      ctx.restore();
      if (g < 0.98) {
        ctx.strokeStyle = css([110, 84, 58], 2, p.a);
        ctx.lineWidth = Math.max(0.6, 0.8 * s);
        const top = y - 32 * s * g;
        ctx.beginPath();
        for (const dx of [-27, -1, 28]) { ctx.moveTo(x + dx * s, y); ctx.lineTo(x + dx * s, top); }
        ctx.moveTo(x - 28 * s, top + 4 * s); ctx.lineTo(x + 29 * s, top + 4 * s);
        ctx.stroke();
      }
    }
    // 粮食堆
    const hp = p.k2;
    if (hp > 0.01) {
      ctx.globalAlpha = p.a * (1 - 0.45 * p.k3);
      ctx.fillStyle = css([220, 180, 96], 2, 1, 0.06);
      for (const q of [[-30, 7, 1], [-20, 9, 0.8], [30, 8, 0.9], [4, 10, 0.7]]) {
        const hx = x + q[0] * s, hy = y + q[1] * s * 0.4, r = 7 * s * q[2] * hp;
        ctx.beginPath(); ctx.moveTo(hx - r * 1.4, hy); ctx.quadraticCurveTo(hx, hy - r * 1.6, hx + r * 1.4, hy); ctx.closePath(); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 一块田（财主的丰盛的田 / 大儿子的田）：边上参差，远边窄、近边宽
  function drawCrop(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), r = U.mulberry32(p.seed), t = p.tone || {};
    const v0 = t.v0 != null ? t.v0 : 0.1, v1 = t.v1 != null ? t.v1 : 0.62, H = t.h || 20;
    const col = mix([96, 146, 64], [222, 184, 96], p.k);
    const xc = (p.x0 + p.x1) / 2;
    const cx = (u, v) => xc + (lerp(p.x0, p.x1, u) - xc) * (0.9 + 0.14 * (v - v0) / Math.max(0.01, v1 - v0));
    const wav = u => 1 - 0.07 * (0.5 + 0.5 * Math.sin(u * 17 + p.seed));
    ctx.fillStyle = css(mix([104, 82, 56], [128, 106, 68], p.k), 2, p.a * 0.62);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) { const u = i / 8, xf = cx(u, v0); const y = baseY(2, xf, v0); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    for (let i = 8; i >= 0; i--) { const u = i / 8, v = lerp(v0, v1, wav(u)), xf = cx(u, v); ctx.lineTo(xf * W.w, baseY(2, xf, v)); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css(col, 2, p.a);
    ctx.lineWidth = Math.max(0.6, 0.85 * s);
    ctx.beginPath();
    const tips = [];
    const n = Math.round((p.x1 - p.x0) * 300);
    for (let i = 0; i < n; i++) {
      const u = r(), vv = r(), v = lerp(v0 + 0.02, v1 - 0.05, vv) * (0.97 + 0.03 * wav(u)), xf = cx(u, v);
      const x = xf * W.w, y = baseY(2, xf, v), h = H * s * (0.8 + 0.3 * r()) * p.grow * (1 + 0.3 * v), a = Math.sin(W.t * 1.4 + xf * 40) * 0.08 + (r() - 0.5) * 0.2;
      ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(a) * h, y - Math.cos(a) * h);
      if (p.grow > 0.6) tips.push(x + Math.sin(a) * h, y - Math.cos(a) * h, a);
    }
    ctx.stroke();
    ctx.fillStyle = css(mix([120, 160, 70], [238, 198, 108], p.k), 2, p.a, 0.05);
    ctx.beginPath();
    for (let i = 0; i < tips.length; i += 3) { ctx.moveTo(tips[i] + 1.2 * s, tips[i + 1] - 2 * s); ctx.ellipse(tips[i], tips[i + 1] - 2.2 * s, 1.1 * s, 2.6 * s, tips[i + 2], 0, TAU); }
    ctx.fill();
  }
  // 筵席：一张长席，席上的饼与杯，一排小灯（在人之后画：坐在席后的人只露出上身）
  function drawTable(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), y0 = baseY(2, (p.x0 + p.x1) / 2, p.v);
    const x0 = p.x0 * W.w, x1 = p.x1 * W.w, top = y0 - 5.5 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([230, 222, 204], 2);
    ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.lineTo(x1 + 2 * s, y0 - 1 * s); ctx.lineTo(x0 - 2 * s, y0 - 1 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([190, 176, 150], 2, 0.9);
    ctx.fillRect(x0 - 2 * s, y0 - 1.6 * s, x1 - x0 + 4 * s, 1.6 * s);
    ctx.fillStyle = css([100, 76, 52], 2);
    ctx.fillRect(x0 + 2 * s, y0 - 1 * s, 1.4 * s, 2.4 * s); ctx.fillRect(x1 - 3.4 * s, y0 - 1 * s, 1.4 * s, 2.4 * s);
    // 饼与杯
    const n = Math.max(4, Math.round((x1 - x0) / (14 * s)));
    for (let i = 0; i < n; i++) {
      const x = lerp(x0 + 6 * s, x1 - 6 * s, (i + 0.5) / n);
      if (p.k > 0.01) {
        ctx.globalAlpha = p.a * p.k;
        ctx.fillStyle = css([206, 160, 98], 2);
        ctx.beginPath(); ctx.ellipse(x - 2.4 * s, top - 0.8 * s, 2.2 * s, 1 * s, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = css([150, 110, 80], 2);
        ctx.fillRect(x + 1.6 * s, top - 2.6 * s, 1.6 * s, 2.4 * s);
      }
    }
    ctx.globalAlpha = p.a;
    // 灯
    if (p.lit > 0.01) {
      for (let i = 0; i <= n; i++) {
        const x = lerp(x0 + 2 * s, x1 - 2 * s, i / n);
        flame(ctx, x, top - 0.6 * s, 3.4 * s, p.lit * p.a, p.seed + i * 3);
      }
      ctx.globalCompositeOperation = 'lighter';
      glowAt(SP.warm, (x0 + x1) / 2, top - 6 * s, (x1 - x0) * 0.75, p.lit * p.a * (0.12 + 0.3 * nightK()), 0.4);
      // 灯照在席上坐着的人身上：一个个暖色的人影（不是黑剪影）
      const nk = nightK();
      for (let i = 0; i < n; i++) {
        const x = lerp(x0 + 6 * s, x1 - 6 * s, (i + 0.5) / n);
        glowAt(SP.warm, x, top - 11 * s, 14 * s, p.lit * p.a * (0.05 + 0.26 * nk), 1.2);
      }
      glowAt(SP.amber, (x0 + x1) / 2, top - 12 * s, (x1 - x0) * 0.62, p.lit * p.a * 0.1 * nk, 0.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 旷野里的荆棘与乱石（那只失去的羊在那里）
  function drawThorny(ctx, p) {
    if (p.a < 0.01) return;
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([124, 112, 100], 2);
    for (const q of [[-9, 0, 5, 3.6], [6, 1, 6.5, 4.4], [15, 0, 4, 3], [-16, 1.5, 3.4, 2.4]]) { ctx.beginPath(); ctx.ellipse(x + q[0] * s, y + q[1] * s - q[3] * s * 0.6, q[2] * s, q[3] * s, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = css([60, 48, 36], 2);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let j = 0; j < 9; j++) {
      const a = -Math.PI / 2 + (j - 4) * 0.3, L = (10 + 6 * hsh(j + p.seed)) * s, bx = x - 2 * s + (j - 4) * 0.8 * s;
      ctx.moveTo(bx, y); ctx.quadraticCurveTo(bx + Math.cos(a) * L * 0.3, y - L * 0.5, bx + Math.cos(a) * L, y + Math.sin(a) * L);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 远方的饥荒：近岸右端的地转为枯黄（路 15:14）；左边一道柔和的边
  function drawFamine(ctx, p) {
    const k = p.k * p.a;
    if (k < 0.01) return;
    const l = p.layer, n = 16, s = LS(l);
    const x0 = p.x0 * W.w, x1 = p.x1 * W.w;
    const gr = ctx.createLinearGradient(x0, 0, x0 + (x1 - x0) * 0.3, 0);
    gr.addColorStop(0, css([160, 128, 80], l, 0)); gr.addColorStop(1, css([160, 128, 80], l, 0.62 * k));
    ctx.fillStyle = gr;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const xf = lerp(p.x0, p.x1, i / n); const y = gY(l, xf) - 1; if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
    ctx.lineTo(x1, W.h + 2); ctx.lineTo(x0, W.h + 2);
    ctx.closePath(); ctx.fill();
    // 枯了的草丛
    ctx.strokeStyle = css([116, 90, 54], l, 0.85 * k);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (let i = 0; i < 22; i++) {
      const xf = lerp(p.x0 + 0.03, p.x1 - 0.005, hsh(i + p.seed)), x = xf * W.w, y = baseY(l, xf, 0.05 + 0.8 * hsh(i * 3 + 1));
      for (let j = -1; j <= 1; j++) { ctx.moveTo(x, y); ctx.lineTo(x + j * 3 * s, y - (4 + hsh(i + j) * 3) * s); }
    }
    ctx.stroke();
  }
  // 猪（远方田里；只是几个圆圆的剪影在拱地）
  function drawPigs(ctx, p) {
    if (p.a < 0.01) return;
    const l = p.layer, s = LS(l) * 0.8;
    ctx.globalAlpha = p.a;
    for (let i = 0; i < 4; i++) {
      const xf = lerp(p.x0, p.x1, (i + 0.3 + hsh(i + p.seed) * 0.4) / 4), d = i % 2 ? 1 : -1;
      const x = xf * W.w + Math.sin(W.t * 0.3 + i * 2) * 2 * s, y = baseY(l, xf, 0.25 + 0.35 * hsh(i * 7));
      const root = Math.max(0, Math.sin(W.t * 1.6 + i * 1.7)) * 1.2 * s;
      ctx.fillStyle = css([150, 112, 100], l);
      ctx.beginPath(); ctx.ellipse(x, y - 4.2 * s, 6.2 * s, 3.6 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + d * 6.2 * s, y - 3.4 * s + root, 2.6 * s, 2.2 * s, d * 0.3, 0, TAU); ctx.fill();
      ctx.fillStyle = css([128, 94, 84], l);
      ctx.fillRect(x + d * 8.2 * s - 0.8 * s, y - 3.4 * s + root, 1.6 * s, 1.8 * s);
      ctx.fillRect(x - 4 * s, y - 1.6 * s, 1.4 * s, 1.8 * s); ctx.fillRect(x + 2.6 * s, y - 1.6 * s, 1.4 * s, 1.8 * s);
      ctx.strokeStyle = css([128, 94, 84], l); ctx.lineWidth = Math.max(0.5, 0.6 * s);
      ctx.beginPath(); ctx.arc(x - d * 6.6 * s, y - 5 * s, 1 * s, 0, Math.PI * 1.5); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 失落的那块钱：地上的一点银光
  function drawCoin(ctx, p) {
    if (p.a < 0.01 || p.k < 0.01 || !SP) return;
    const s = LS(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    const tw = 0.6 + 0.4 * Math.sin(W.t * 6 + p.seed);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.silver, x, y - 1 * s, 15 * s * p.k, p.k * p.a * tw);
    glowAt(SP.white, x, y - 1 * s, 5 * s * p.k, p.k * p.a * 0.8);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.a * p.k;
    ctx.fillStyle = 'rgb(232,236,244)';
    ctx.beginPath(); ctx.ellipse(x, y - 0.8 * s, 2 * s, 1.1 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 一片灯光：门里、院里的灯洒在地上（人之前画），也照在站在那里的人身上（人之后画，淡淡的暖色）
  const poolK = p => p.a * p.lit * (0.3 + 0.7 * nightK());
  function drawPool(ctx, p) {
    if (p.a < 0.01 || p.lit < 0.01 || !SP) return;
    const s = LS(2) * (p.size || 1), x = p.x * W.w, y = baseY(2, p.x, p.v), k = poolK(p);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, x, y, 50 * s, k * 0.6, 0.3);
    glowAt(SP.amber, x, y - 2 * s, 24 * s, k * 0.4, 0.36);
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawPoolAir(ctx, p) {
    if (p.a < 0.01 || p.lit < 0.01 || !SP) return;
    const s = LS(2) * (p.size || 1), x = p.x * W.w, y = baseY(2, p.x, p.v), k = poolK(p);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.warm, x, y - 20 * s, 34 * s, k * 0.34, 1.05);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 比喻之"画"：地上一片淡淡的金光，光里有微尘缓缓上升
  function drawAura(ctx, p) {
    if (p.a < 0.01 || !SP) return;
    const xc = (p.x0 + p.x1) / 2, w = (p.x1 - p.x0) * W.w, g = baseY(2, xc, 0.3);
    const k = p.a * (0.2 + 0.26 * nightK()) * (p.tone && p.tone.cold ? 0.5 : 1);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, xc * W.w, g, w * 0.64, k, 0.36);
    glowAt(SP.gold, xc * W.w, g - w * 0.16, w * 0.54, k * 0.5, 0.62);
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawAuraMotes(ctx, p) {
    if (p.a < 0.01 || !SP) return;
    const s = LS(2), N = PORT ? 12 : 20;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N; i++) {
      const xf = lerp(p.x0, p.x1, hsh(i * 3.1 + p.seed)), ph = U.fract(W.t * (0.06 + 0.04 * hsh(i)) + hsh(i * 7.7));
      const y = baseY(2, xf, 0.1 + 0.6 * hsh(i * 5.3)) - ph * 110 * s;
      const a = p.a * Math.sin(ph * Math.PI) * (0.35 + 0.4 * nightK());
      glowAt(SP.dot, xf * W.w + Math.sin(W.t * 0.8 + i) * 4 * s, y, (1.6 + hsh(i * 9) * 1.4) * s, a);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  天上与光：天上的欢喜、圣灵的光、今夜的冷
  // ════════════════════════════════════════════════════════════
  function drawHeaven(ctx) {
    const k = W.lv.paHeaven;
    if (k < 0.01 || !SP) return;
    const x = S.hx * W.w, y = W.h * (PORT ? 0.4 : 0.22);
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.gold, x, y, M() * 0.42, k * (0.34 + 0.12 * nightK()), 0.7);
    glowAt(SP.warm, x, y, M() * 0.2, k * 0.18, 0.8);
    for (let i = 0; i < 26; i++) {
      const ph = U.fract(W.t * 0.05 + hsh(i * 2.3));
      const a = Math.sin(ph * Math.PI) * k * (0.5 + 0.4 * Math.sin(W.t * 3 + i));
      const px = x + (hsh(i) - 0.5) * M() * 0.7, py = y + (hsh(i * 5) - 0.5) * M() * 0.3 - ph * 30;
      glowAt(SP.dot, px, py, (2.2 + hsh(i * 3) * 2.4) * SU(), a);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 路 11:13 是应许，不是降临（圣灵要到五旬节才降下）：高处聚起一团柔和的光，微光在其中环绕，并不落到人身上
  function drawSpiritLight(ctx) {
    const k = W.lv.paSpirit;
    if (k < 0.01 || !SP) return;
    const x = S.sx * W.w, g = baseY(2, S.sx, 0.3);
    const y = Math.min(g - 120 * LS(2), W.h * (PORT ? 0.5 : 0.42));
    const w = 120 * SU() * (PORT ? 0.8 : 1), br = 0.9 + 0.1 * Math.sin(W.t * 1.2);
    ctx.globalCompositeOperation = 'lighter';
    // 自天而来的一缕淡光，只到这团光为止
    ctx.globalAlpha = k * (0.18 + 0.14 * nightK());
    ctx.drawImage(SP.beam, x - w * 0.3, -20, w * 0.6, y + 20);
    glowAt(SP.pale, x, y, w * 1.2 * br, k * (0.45 + 0.2 * nightK()), 0.62);
    glowAt(SP.white, x, y, w * 0.4, k * 0.7 * br, 0.8);
    glowAt(SP.gold, x, y, w * 0.7, k * 0.2, 0.7);
    for (let i = 0; i < 18; i++) {
      const a = W.t * (0.35 + 0.2 * hsh(i)) + hsh(i * 3.3) * TAU, r = w * (0.25 + 0.45 * hsh(i * 7.1));
      glowAt(SP.dot, x + Math.cos(a) * r, y + Math.sin(a) * r * 0.42, (1.2 + hsh(i * 2) * 1.2) * SU(), k * (0.4 + 0.4 * Math.sin(W.t * 2 + i)));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawCold(ctx) {
    const k = W.lv.paCold;
    if (k < 0.01) return;
    const p = getP('aura');
    const x0 = (p ? p.x0 : 0.62) * W.w, x1 = (p ? p.x1 : 0.95) * W.w;
    const g = ctx.createLinearGradient(x0 - 40, 0, x1 + 40, 0);
    g.addColorStop(0, 'rgba(10,18,40,0)'); g.addColorStop(0.2, 'rgba(10,18,40,1)'); g.addColorStop(0.85, 'rgba(10,18,40,1)'); g.addColorStop(1, 'rgba(10,18,40,0)');
    ctx.globalAlpha = 0.3 * k;
    ctx.fillStyle = g;
    ctx.fillRect(x0 - 40, W.horizonY * 0.5, x1 - x0 + 80, W.h);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光
  // ════════════════════════════════════════════════════════════
  function drawTransients(ctx, pass) {
    if (!FXL.length || !SP) return;
    ctxA = ctx;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = baseY(e.l, e.xf, e.v) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.35 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        glowAt(SP.gold, x, y - e.w * 0.3, e.w * 1.5, env * e.k * 0.4);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'stream' && pass === 'air') {
        // 话语化作光，自耶稣流向画
        const h = headOf(e.from, 0.85), tx = e.xf * W.w, ty = baseY(2, e.xf, e.v) - 30 * LS(2);
        const mx = (h[0] + tx) / 2, my = Math.min(h[1], ty) - 70 * LS(2);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 26; i++) {
          const ph = q * 1.5 - i * 0.02;
          if (ph <= 0 || ph >= 1) continue;
          const u = ph, a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u;
          const x = a * h[0] + b * mx + c * tx + Math.sin(i * 3.1 + W.t * 4) * 5 * SU(), y = a * h[1] + b * my + c * ty + Math.cos(i * 2.3 + W.t * 3) * 4 * SU();
          glowAt(SP.dot, x, y, (1.6 + hsh(i) * 1.6) * SU(), Math.sin(ph * Math.PI) * 0.9);
        }
        if (q > 0.55) glowAt(SP.gold, tx, ty, 60 * SU(), Math.sin((q - 0.55) / 0.45 * Math.PI) * 0.35);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'sun' && pass === 'sky') {
        drawSunGlare(ctx, e, q);
      } else if (e.type === 'joy' && pass === 'sky') {
        // 天上的欢喜（路 15:7）：天上一圈金光绽开
        const x = S.hx * W.w, y = W.h * (PORT ? 0.4 : 0.22), env = Math.sin(Math.PI * Math.min(1, q * 1.4));
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.gold, x, y, M() * (0.2 + 0.4 * easeOut(q)), 0.55 * env, 0.75);
        glowAt(SP.white, x, y, M() * 0.08, 0.5 * env, 0.8);
        ctx.strokeStyle = 'rgb(255,226,160)';
        for (let j = 0; j < 2; j++) {
          const qq = c01(q * 1.3 - j * 0.18);
          if (qq <= 0 || qq >= 1) continue;
          ctx.globalAlpha = (1 - qq) * 0.6;
          ctx.lineWidth = Math.max(1, 2.4 * SU() * (1 - qq));
          ctx.beginPath(); ctx.ellipse(x, y, M() * (0.05 + 0.4 * easeOut(qq)), M() * (0.05 + 0.4 * easeOut(qq)) * 0.62, 0, 0, TAU); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'seeds' && pass === 'air') {
        // 撒种：自撒种的人手里撒出，落在前面的地上
        const f = fig('sower');
        if (!f || !f._vis) continue;
        const s = LS(2), hx = f._x + (f.fd || 1) * f._h * 0.12, hy = f._y - f._h * 0.62;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,232,170)';
        for (let i = 0; i < 12; i++) {
          const ph = U.fract(e.t * 0.9 + i / 12);
          const tx = hx + (f.fd || 1) * (10 + 26 * hsh(i * 3.3)) * s, ty = f._y + (hsh(i * 7.1) * 10 - 2) * s;
          const x = lerp(hx, tx, ph), y = lerp(hy, ty, ph) - Math.sin(ph * Math.PI) * 10 * s;
          ctx.globalAlpha = 0.85 * Math.sin(ph * Math.PI) * (1 - smoothstep(0.85, 1, q));
          ctx.beginPath(); ctx.arc(x, y, 0.9 * s, 0, TAU); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'knock' && pass === 'air') {
        const s = LS(2), x = e.xf * W.w, y = baseY(2, e.xf, e.v || 0) - 9 * s;
        ctx.strokeStyle = 'rgb(255,226,170)';
        ctx.lineWidth = Math.max(0.6, 0.9 * s);
        for (let j = 0; j < 3; j++) {
          const qq = c01((e.t - j * 0.45) / 0.6);
          if (qq <= 0 || qq >= 1) continue;
          ctx.globalAlpha = (1 - qq) * 0.8;
          ctx.beginPath(); ctx.arc(x, y, (2 + qq * 12) * s, -0.9, 0.9); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, (2 + qq * 12) * s, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke();
        }
      } else if (e.type === 'loaves' && pass === 'air') {
        // 三个饼，自门里递到他手中
        const a = headOf('friend', 0.55), b = headOf('knocker', 0.55), s = LS(2);
        for (let j = 0; j < 3; j++) {
          const ph = c01((e.t - j * 0.35) / 1.1);
          if (ph <= 0) continue;
          const x = lerp(a[0], b[0], ph), y = lerp(a[1], b[1], ph) - Math.sin(ph * Math.PI) * 8 * s + j * 2.2 * s;
          ctx.globalAlpha = 1 - smoothstep(0.8, 1, q);
          ctx.fillStyle = css([214, 170, 104], 2, 1, 0.1);
          ctx.beginPath(); ctx.ellipse(x, y, 2.6 * s, 1.3 * s, 0, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'lighter';
          glowAt(SP.warm, x, y, 7 * s, 0.3 * (1 - q));
          ctx.globalCompositeOperation = 'source-over';
        }
      } else if (e.type === 'coins' && pass === 'air') {
        // 银钱：自一人手里交到另一人手里
        const a = headOf(e.from, 0.55), b = headOf(e.to, 0.55), s = LS(2);
        ctx.globalCompositeOperation = 'lighter';
        for (let j = 0; j < (e.n || 2); j++) {
          const ph = c01((e.t - j * 0.3) / 1);
          if (ph <= 0 || ph >= 1) continue;
          const x = lerp(a[0], b[0], ph), y = lerp(a[1], b[1], ph) - Math.sin(ph * Math.PI) * 10 * s;
          glowAt(SP.silver, x, y, 6 * s, 0.9 * Math.sin(ph * Math.PI));
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'oil' && pass === 'air') {
        // 油和酒：一点温暖的光，落在他的伤处（伤不画出，只有光）
        const a = headOf('samaritan', 0.45), b = headOf('traveler', 0.1), s = LS(2);
        ctx.globalCompositeOperation = 'lighter';
        for (let j = 0; j < 8; j++) {
          const ph = U.fract(e.t * 0.8 + j / 8);
          const x = lerp(a[0], b[0], ph), y = lerp(a[1], b[1], ph) + Math.sin(ph * Math.PI) * 2 * s;
          glowAt(SP.amber, x, y, 3 * s, 0.7 * Math.sin(ph * Math.PI) * (1 - smoothstep(0.8, 1, q)));
        }
        glowAt(SP.warm, b[0], b[1], 22 * s, 0.35 * Math.sin(q * Math.PI));
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'shadow' && pass === 'air') {
        // 落在强盗手中：一阵冷暗的影掠过他（不画强盗，只有影与他的倒下）
        const f = fig('traveler');
        const x = f && f._vis ? f._x : e.xf * W.w, y = f && f._vis ? f._y : baseY(2, e.xf, 0.42);
        const env = Math.sin(Math.PI * q), s = LS(2);
        ctx.globalAlpha = env * 0.55;
        ctx.fillStyle = 'rgba(14,16,26,1)';
        for (let j = 0; j < 5; j++) {
          ctx.beginPath();
          ctx.ellipse(x + Math.sin(e.t * 2 + j * 1.7) * 16 * s, y - 16 * s + Math.cos(e.t * 1.6 + j) * 8 * s, (18 + j * 4) * s, (10 + j * 2) * s, 0, 0, TAU);
          ctx.globalAlpha = env * 0.12;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else if (e.type === 'robe' && pass === 'air') {
        const h = headOf('son', 0.5), s = LS(2);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(SP.white, h[0], h[1], 34 * s, Math.sin(q * Math.PI) * 0.8);
        glowAt(SP.gold, h[0], h[1], 60 * s, Math.sin(q * Math.PI) * 0.4);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'four' && pass === 'air') {
        // 从东、从西、从南、从北将有人来（路 13:29）：四方的光聚向筵席
        const p = getP('table');
        if (!p) continue;
        const tx = (p.x0 + p.x1) / 2 * W.w, ty = baseY(2, (p.x0 + p.x1) / 2, p.v) - 12 * LS(2);
        const src = [[-0.1 * W.w, ty - W.h * 0.1], [W.w * 1.1, ty - W.h * 0.08], [tx, W.h * 1.1], [tx, -W.h * 0.1]];
        ctx.globalCompositeOperation = 'lighter';
        for (let d = 0; d < 4; d++) {
          for (let j = 0; j < 14; j++) {
            const ph = c01(q * 1.4 - j * 0.03);
            if (ph <= 0 || ph >= 1) continue;
            const x = lerp(src[d][0], tx, easeOut(ph)) + Math.sin(j * 2.1 + d) * 20 * SU() * (1 - ph), y = lerp(src[d][1], ty, easeOut(ph)) + Math.cos(j * 1.7 + d) * 16 * SU() * (1 - ph);
            glowAt(SP.dot, x, y, (1.6 + hsh(j + d * 20) * 1.4) * SU(), Math.sin(ph * Math.PI) * 0.85);
          }
        }
        glowAt(SP.gold, tx, ty, (p.x1 - p.x0) * W.w * 0.8, Math.sin(q * Math.PI) * 0.3, 0.5);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'glint' && pass === 'air') {
        const h = headOf(e.id, e.frac || 0.55), s = LS(2);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(e.rgb === 'gold' ? SP.gold : SP.silver, h[0] + (e.dx || 0) * s, h[1], (e.r || 10) * s, Math.sin(q * Math.PI) * 0.95);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW = {
    house: drawHouse, town: drawTown, fhouse: drawFHouse, field: drawField, tree: drawTree, treasure: drawTreasure, road: drawRoad, city: drawCity,
    hearth: drawHearth, lamp: drawLamp, barns: drawBarns, crop: drawCrop, thorny: drawThorny, famine: drawFamine, pigs: drawPigs, coin: drawCoin, aura: drawAura, pool: drawPool,
  };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  let seedT = 0;
  const SCENE = {
    init() { sprites(); },
    resize() { if (isCur()) layout(); for (const p of P.values()) p.model = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k of FIELDS) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, ((p.rate && p.rate[k]) || EASE[k]) * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const [id, v] of VT) {
        const q = fig(id);
        if (!q) { VT.delete(id); continue; }
        const st = 0.09 * f;
        if (Math.abs(v - q.v) <= st) { q.v = v; VT.delete(id); } else q.v += Math.sign(v - q.v) * st;
      }
      // 撒种的人一路撒去：种子自他手里撒出（只是装饰）
      const fp = getP('field');
      if (fp && fp.sow < fp.tsow - 0.001 && !W.replaying && has('sower')) {
        seedT -= f;
        if (seedT <= 0) { seedT = 1.1; FXL.push({ type: 'seeds', t: 0, dur: 1.2 }); }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { drawHeaven(ctx); drawTransients(ctx, 'sky'); return; }
      if (pass === 'seaNear' || pass === 'seaMid') return;
      if (pass === 'air') {
        const b = getP('boat');
        if (b) U.safe('parables.boat.front', () => drawBoat(ctx, b, true));
        for (const p of sortProps()) {
          if (p.a < 0.005) continue;
          if (p.kind === 'field') U.safe('parables.birds', () => drawFieldBirds(ctx, p));
          else if (p.kind === 'tree') U.safe('parables.treebirds', () => drawTreeBirds(ctx, p));
          else if (p.kind === 'table') U.safe('parables.table', () => drawTable(ctx, p));
          else if (p.kind === 'pearl') U.safe('parables.pearl', () => drawPearl(ctx, p));
          else if (p.kind === 'aura') U.safe('parables.motes', () => drawAuraMotes(ctx, p));
          else if (p.kind === 'pool') U.safe('parables.poolAir', () => drawPoolAir(ctx, p));
        }
        drawCold(ctx);
        drawSpiritLight(ctx);
        drawTransients(ctx, 'air');
        return;
      }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW[p.kind];
        if (fn) U.safe('parables.' + p.kind, () => fn(ctx, p));
      }
    },
    // 海上的船：在海面之后画（scenesOver）
    draw(ctx, pass) {
      if (!isCur() || (pass !== 'seaNear' && pass !== 'seaMid')) return;
      ctxA = ctx;
      const b = getP('boat');
      if (b) U.safe('parables.boat', () => { const g = boatGeom(b); if (W.seaBand(g.y) === pass) drawBoat(ctx, b, false); });
    },
    reset() { P.clear(); FXL.length = 0; VT.clear(); sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } snap(p); }
      sortedN = -1;
      FXL.length = 0;
      for (const [id, v] of VT) { const q = fig(id); if (q) q.v = v; }
      VT.clear();
    },
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.ta, ...FIELDS.filter(k => k !== 'a').map(k => r2(p['t' + k])), p.label].join('|');
      return { props: out, S: JSON.stringify(S) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1);
        if (p.kind === 'boat') { const g = boatGeom(p); consider(p.label, g.x, g.y - 0.2 * g.L); }
        else if (p.kind === 'field' || p.kind === 'road' || p.kind === 'crop' || p.kind === 'famine' || p.kind === 'pigs') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, baseY(p.layer, xf, p.layer === 2 ? 0.3 : 0.2) - 10 * s); }
        else if (p.kind === 'tree') { const b = treeBase(p); consider(p.label, b.x, b.y - b.H * 0.6 * Math.max(0.1, p.grow)); }
        else if (p.kind === 'table') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, baseY(2, xf, p.v) - 10 * s); }
        else if (p.kind === 'town') { const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, gY(p.layer, xf) - 14 * s); }
        else if (p.kind === 'pearl') { const h = headOf('merchant', 0.9); consider(p.label, h[0], h[1]); }
        else consider(p.label, p.x * W.w, baseY(p.layer, p.x, p.v) - 14 * s);
      }
      return best;
    },
  };

  function resetScene() {
    P.clear(); FXL.length = 0; VT.clear(); sorted = []; sortedN = -1;
    S = fresh();
    seedT = 0;
  }

  // ── 几件常用的事 ────────────────────────────────────────────
  // 画的范围（地上一片淡金的光）
  function aura(x0, x1, o) { prop('aura', 'aura', Object.assign({ x0, x1, show: true }, o || {})); S.hx = (x0 + x1) / 2; }
  // 一幅画讲完：画里的人与物都化回光里
  function fadePic(ids, props, crowds) {
    for (const id of ids || []) rm(id);
    for (const id of props || []) unprop(id);
    for (const g of crowds || []) crm(g);
  }
  // 房屋的门在哪里（画面宽度的比例）
  function doorX(p) {
    if (!p) return null;
    const t = p.tone || {}, w = (t.w || 26) * LS(p.layer) * (p.size || 1);
    return p.x + (t.door != null ? t.door : -0.12) * w / W.w;
  }
  // 耶稣在村庄里（路加的一段）：门徒在他左右
  function lukeGroup(b, o) {
    o = o || {};
    const jx = o.jx != null ? o.jx : X.jes;
    walk('jesus', jx, { speed: 0.03, pose: o.jpose || 'stand' }); sink('jesus', 0.32);
    walk('peter', o.pet != null ? o.pet : X.pet, { speed: 0.03, pose: o.dpose || 'stand' }); sink('peter', 0.4);
    walk('john', o.joh != null ? o.joh : X.joh, { speed: 0.03, pose: o.dpose || 'stand' }); sink('john', 0.26);
    if (!PORT) {
      walk('d1', o.d1 != null ? o.d1 : X.d1, { speed: 0.03, pose: o.dpose || 'stand' }); sink('d1', 0.46);
      walk('d2', o.d2 != null ? o.d2 : X.d2, { speed: 0.03, pose: o.dpose || 'stand' }); sink('d2', 0.3);
    }
  }
  function disciples(fn) { for (const id of ['peter', 'john', 'd1', 'd2']) if (has(id)) fn(id); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：加利利海边的早晨；耶稣坐在船上，众人都站在岸上
  // ════════════════════════════════════════════════════════════
  function setup() {
    W.set('bare', 0.08, true); W.set('bloom', 0.8, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.34, land: 1, grass: 1, herbs: 0.85, trees: 0.3, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      paHeaven: 0, paSpirit: 0, paCold: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    layout();
    W.setOrigin('grass', W.w * 0.62, W.ridgeBaseY(2, W.w * 0.62));
    W.setOrigin('herbs', W.w * 0.66, W.ridgeBaseY(2, W.w * 0.66));
    W.setOrigin('trees', W.w * 0.43, W.ridgeBaseY(2, W.w * 0.43));
    W.goTo(0.29, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 0, W.w * 0.12, W.h * 0.78, true);     // 加利利海是一个湖：没有大鱼
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 船、村庄（近岸的三间屋、中丘上的一片小屋）
    prop('boat', 'boat', { x: X.boatX, y: X.boatY, label: '船' });
    prop('hC', 'house', { x: X.hC, tone: { rgb: [170, 150, 118], w: 22, h: 14, door: 0.1 }, label: '村庄' });
    prop('hA', 'house', { x: X.hA, tone: { rgb: [178, 156, 122], w: 28, h: 18, door: -0.14, stair: 1 }, label: '房子' });
    prop('hB', 'house', { x: X.hB, tone: { rgb: [164, 142, 112], w: 26, h: 16, door: -0.2 }, label: '村庄' });
    prop('town', 'town', { x0: 0.56, x1: 0.68, layer: 1, label: '迦百农' });
    const c = C();
    c.clear({ fade: false });
    add('jesus', Object.assign(LOOK('jesus'), { x: X.boatX, facing: 1, pose: 'sit', v: 0.55 }));
    attach('jesus', boatSeat);
    add('peter', Object.assign(LOOK('peter'), { x: X.peterM, facing: -1, pose: 'stand', v: 0.5 }));
    add('john', Object.assign(LOOK('john'), { x: X.johnM, facing: -1, pose: 'stand', v: 0.3 }));
    add('d1', Object.assign(LOOK('disciple'), { label: '门徒', robe: DR()[0], x: PORT ? 1.1 : 0.44, facing: -1, pose: 'stand', v: 0.62 }));
    add('d2', Object.assign(LOOK('disciple'), { label: '门徒', robe: DR()[3], x: PORT ? 1.12 : 0.455, facing: -1, pose: 'stand', v: 0.2 }));
    if (PORT) { rm('d1', true); rm('d2', true); }
    crowd('crowd', { n: PORT ? 5 : 9, x0: X.crowd0, x1: X.crowd1, layer: 2, label: '众人', glow: 0.1 }, folk(PLAIN, 0.06, 0.62));
    cface('crowd', -1);
    avoid([0.3, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 太 13:3 撒种的比喻：路旁、石头地、荆棘、好土 ─────────────
    {
      kind: 'act', utter: '有一个撒种的出去撒种', cmd: 'sow --on 路旁 石头地 荆棘 好土  # 有耳可听的', ref: '13:3',
      verse: [
        { text: '他用比喻对他们讲许多道理，说：「有一个撒种的出去撒种；<br>撒的时候，有落在路旁的，飞鸟来吃尽了；', ref: '马太福音 13:3–4', hold: 7 },
        { text: '有落在土浅石头地上的，土既不深，发苗最快，<br>日头出来一晒，因为没有根，就枯干了；', ref: '马太福音 13:5–6', hold: 6.5 },
        { text: '有落在荆棘里的，荆棘长起来，把它挤住了；<br>又有落在好土里的，就结实，有一百倍的，有六十倍的，有三十倍的。', ref: '马太福音 13:7–8', hold: 7.5 },
        { text: '有耳可听的，就应当听！」', ref: '马太福音 13:9', hold: 4 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            aura(X.pic0 - 0.01, X.pic1 + 0.01);
            tell(b, (X.pic0 + X.pic1) / 2, 0.35);
            pose('jesus', 'sit'); glow('jesus', 0.4);
            cface('crowd', 1);
          }],
          [1.2, b => {
            prop('field', 'field', { x0: X.pic0, x1: X.pic1, label: '田' });
            pic('sower', { label: '撒种的', x: X.pic0 - 0.012, facing: 1, robe: ROBE.sower, prop: 'bundle', v: 0.46, glow: 0.34 });
          }],
          [2.4, b => {
            prop('field', null, { sow: 1 });
            walk('sower', X.pic1 - 0.02, { speed: (X.pic1 - X.pic0) * 0.07, pose: 'stand' });
            sfx(b, 'wind', { soft: true });
          }],
          // 路旁的：飞鸟来吃尽了
          [3.6, b => { prop('field', null, { k: 1 }); sfx(b, 'wings', { soft: true }); sfx(b, 'bird'); }],
          [6.2, () => { prop('field', null, { k7: 1 }); }],
          [7.8, () => { prop('field', null, { k2: 1 }); }],
          // 石头地：发苗最快；日头出来一晒，就枯干了
          [8.8, () => { prop('field', null, { k3: 1, rate: { k3: 0.6 } }); }],
          [11.6, b => { W.goTo(DAYC(0.37, 0.31), 3, b.instant); flash(b, { type: 'sun', dur: 3.4 }); }],
          [12.4, () => { prop('field', null, { k4: 1, rate: { k4: 0.45 } }); }],
          // 荆棘：长起来，把它挤住了
          [16.2, b => { prop('field', null, { k5: 1, rate: { k5: 0.28 } }); }],
          // 好土：结实，一百倍、六十倍、三十倍
          [19.6, b => { prop('field', null, { grow: 1, rate: { grow: 0.2 } }); sfx(b, 'harp', { soft: true }); }],
          [23, b => { prop('field', null, { k6: 1, rate: { k6: 0.35 } }); }],
          [25, b => {
            face('sower', -1); pose('sower', 'raise'); hold('sower', null);
            cpose('crowd', 'stand'); glow('jesus', 0.45);
            beam(b, lerp(X.pic0, X.pic1, 0.87), 2, { v: 0.3, w: 90, r: 0.14, dur: 4 });
          }],
        ]);
      },
    },

    // ── 太 13:31 芥菜种：长成了树，天上的飞鸟宿在枝上 ─────────────
    {
      kind: 'promise', utter: '天国好像一粒芥菜种', cmd: 'plant 芥菜种 --smallest && grow --into 树 --lodge 飞鸟', ref: '13:31',
      verse: [
        { text: '他又设个比喻对他们说：「天国好像一粒芥菜种，有人拿去种在田里。', ref: '马太福音 13:31', hold: 6 },
        { text: '这原是百种里最小的，等到长起来，却比各样的菜都大，<br>且成了树，天上的飞鸟来宿在它的枝上。」', ref: '马太福音 13:32', hold: 7 },
        { text: '这都是耶稣用比喻对众人说的话；若不用比喻，就不对他们说什么。', ref: '马太福音 13:34', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            fadePic(['sower'], ['field']);
            aura(X.tree - 0.12, X.tree + 0.12);
            tell(b, X.tree, 0.2);
          }],
          [1.6, b => {
            pic('planter', { label: '种芥菜的', x: X.tree - 0.05, facing: 1, robe: ROBE.planter, v: 0.3 });
            walk('planter', X.tree - 0.014, { speed: 0.02, pose: 'kneel' });
          }],
          [3.6, b => {
            prop('tree', 'tree', { x: X.tree, v: 0.1, lit: 1, label: '芥菜种' });
            sparkleOn(b, 'planter', 12, [255, 236, 190], 0.2);
          }],
          [5.4, () => { pose('planter', 'stand'); walk('planter', X.tree - 0.065, { speed: 0.02 }); face('planter', 1); }],
          // 长起来：比各样的菜都大，且成了树
          [7.2, b => { prop('tree', null, { grow: 1, rate: { grow: 0.11 }, label: '芥菜树' }); sfx(b, 'wind', { soft: true }); }],
          [9, () => { pose('planter', 'gaze'); cface('crowd', 1); }],
          // 天上的飞鸟来宿在它的枝上
          [13, b => { prop('tree', null, { k: 1, rate: { k: 0.22 } }); sfx(b, 'wings', { soft: true }); }],
          [14.5, b => { sfx(b, 'bird'); }],
          [16.6, b => { sfx(b, 'bird', { soft: true }); prop('tree', null, { lit: 0 }); }],
          // 他若不用比喻，就不对他们说什么：众人都向着他
          [18.4, b => { cface('crowd', -1); glow('jesus', 0.5); beamOn(b, 'jesus', { dur: 4, w: 80, r: 0.12 }); }],
        ]);
      },
    },

    // ── 太 13:44–46 宝贝与珠子；耶稣离开众人，进了房子 ───────────
    {
      kind: 'promise', utter: '天国好像宝贝藏在地里', cmd: 'sell --all && buy 这块地  # 重价的珠子', ref: '13:44',
      verse: [
        { text: '当下，耶稣离开众人，进了房子。', ref: '马太福音 13:36', hold: 4 },
        { text: '「天国好像宝贝藏在地里，人遇见了就把它藏起来，<br>欢欢喜喜地去变卖一切所有的，买这块地。', ref: '马太福音 13:44', hold: 7 },
        { text: '天国又好像买卖人寻找好珠子，<br>遇见一颗重价的珠子，就去变卖他一切所有的，买了这颗珠子。」', ref: '马太福音 13:45–46', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          // 离开众人：下船，上岸，往村里的房子去
          [0, b => {
            fadePic(['planter'], ['tree']);
            prop('aura', null, { show: false });
            W.goTo(DAYC(0.6, 0.7), 7, b.instant);
            attach('jesus', null);
            place('jesus', X.shore); sink('jesus', 0.3); pose('jesus', 'stand'); glow('jesus', 0.34);
            walk('jesus', X.hA + 0.02, { speed: 0.026, pose: 'sit' });
            cwalk('crowd', X.crowd0 + 0.06, X.crowd1 + 0.04, { speed: 0.02 }); cface('crowd', 1);
          }],
          [1.8, () => { crm('crowd'); }],
          [0.8, () => { walk('peter', X.hA - 0.005, { speed: 0.028, pose: 'sit' }); walk('john', X.hA - 0.022, { speed: 0.028, pose: 'sit' }); }],
          [1.4, () => { if (!PORT) { walk('d1', X.hA - 0.04, { speed: 0.026, pose: 'sit' }); walk('d2', X.hA - 0.055, { speed: 0.026, pose: 'sit' }); } }],
          [4.2, () => { face('jesus', 1); disciples(id => face(id, 1)); }],
          // 宝贝藏在地里：耕地的人遇见了
          [5.6, b => {
            aura(X.pic0 + 0.02, X.pic1);
            tell(b, X.treasure, 0.4, { from: 'jesus' });
            prop('treasure', 'treasure', { x: X.treasure, v: 0.52, lit: 0.18, label: '宝贝' });
          }],
          // 耕地的人牵着牛来；他走到那里，就跪下（牛停在他身后，不在宝贝上）
          [6.2, b => {
            beast('ox', { kind: 'ox', x: X.treasure - 0.1, layer: 2, facing: 1, label: '牛', v: 0.46, pose: 'walk' });
            pic('plowman', { label: '遇见宝贝的人', x: X.treasure - 0.062, facing: 1, robe: ROBE.plow, prop: 'staff', v: 0.52 });
            walk('plowman', X.treasure - 0.013, { speed: 0.024, pose: 'kneel' });
            walk('ox', X.treasure - 0.056, { speed: 0.018, pose: 'graze' });
          }],
          // 人遇见了：地里的宝贝放出光来
          [8.8, b => { prop('treasure', null, { lit: 1, k: 1 }); pose('plowman', 'kneel'); hold('plowman', null); sfx(b, 'chime'); sfx(b, 'coins', { soft: true }); }],
          // 就把它藏起来
          [10.8, b => { prop('treasure', null, { k: 0, lit: 0.3 }); }],
          // 欢欢喜喜地去变卖一切所有的
          [11.8, b => { pose('plowman', 'raise'); sfx(b, 'laugh', { soft: true }); }],
          [13.4, () => { run('plowman', 0.99, { speed: 0.08 }); }],
          // 重价的珠子
          [14, b => {
            prop('pearl', 'pearl', { x: X.merch, v: 0.4, lit: 0, label: '重价的珠子' });
            pic('merchant', { label: '买卖人', x: 0.99, facing: -1, robe: ROBE.merchant, prop: 'bundle', v: 0.4, accent: [206, 176, 110] });
            walk('merchant', X.merch, { speed: 0.03 });
          }],
          // 买这块地：他回来了，站在自己的地里
          [15.4, () => { walk('plowman', X.treasure + 0.012, { speed: 0.05, pose: 'stand' }); }],
          [17.4, b => { prop('pearl', null, { lit: 1 }); sfx(b, 'chime'); }],
          [18.8, b => { pose('merchant', 'raise'); hold('merchant', null); sfx(b, 'coins', { soft: true }); face('plowman', -1); }],
          // 天国：二人都欢欢喜喜——光落在宝贝与珠子上
          [20.2, b => {
            prop('treasure', null, { lit: 1 });
            pose('plowman', 'raise');
            beam(b, (X.treasure + X.merch) / 2, 2, { v: 0.45, w: 150, r: 0.18, dur: 4.5 });
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 路 10:30 一条自耶路撒冷下耶利哥的路：祭司、利未人从那边过去 ─
    {
      kind: 'act', utter: '有一个人从耶路撒冷下耶利哥去', cmd: 'grep 邻舍 --road 耶路撒冷..耶利哥', ref: '路加福音 10:30',
      verse: [
        { text: '有一个律法师起来试探耶稣，说：「夫子！我该做什么才可以承受永生？」', ref: '路加福音 10:25', hold: 5.5 },
        { text: '那人要显明自己有理，就对耶稣说：「谁是我的邻舍呢？」', ref: '路加福音 10:29', hold: 4.5 },
        { text: '耶稣回答说：「有一个人从耶路撒冷下耶利哥去，落在强盗手中。<br>他们剥去他的衣裳，把他打个半死，就丢下他走了。', ref: '路加福音 10:30', hold: 7 },
        { text: '偶然有一个祭司从这条路下来，看见他就从那边过去了。<br>又有一个利未人来到这地方，看见他，也照样从那边过去了。', ref: '路加福音 10:31–32', hold: 7 },
      ],
      apply(c) {
        T(c, [
          // 过了一夜：往耶路撒冷去的路上，一个村庄
          [0, b => {
            fadePic(['plowman', 'merchant', 'ox'], ['treasure', 'pearl', 'aura']);
            W.goTo(DAYC(0.33, 0.31), 6, b.instant);
            prop('boat', null, { show: false });
            S.where = 'luke';
          }],
          [1.6, b => { lukeGroup(b); face('jesus', 1); }],
          [3.2, b => {
            add('lawyer', { label: '律法师', x: X.law + 0.06, facing: -1, robe: ROBE.lawyer, accent: [220, 214, 196], glow: 0.14, v: 0.36 });
            walk('lawyer', X.law, { speed: 0.02, pose: 'raise' });
          }],
          [6, () => { pose('lawyer', 'stand'); face('jesus', 1); }],
          [7.6, () => { pose('lawyer', 'point'); }],
          // 有一个人从耶路撒冷下耶利哥去
          [12.4, b => {
            pose('lawyer', 'stand');
            aura(X.road0, X.road1);
            tell(b, (X.road0 + X.road1) / 2, 0.3);
            prop('road', 'road', { x0: X.road0, x1: X.road1, label: '下耶利哥的路' });
            prop('city', 'city', { x: 0.9, layer: 1, label: '耶路撒冷' });
          }],
          [13.4, b => {
            pic('traveler', { label: '落在强盗手中的人', x: X.road1 - 0.02, facing: -1, robe: ROBE.traveler, prop: 'bundle', v: onRoad(X.road1 - 0.02) });
            sink('traveler', onRoad(X.lie));
            walk('traveler', X.lie + 0.02, { speed: 0.03 });
          }],
          [16.6, b => { flash(b, { type: 'shadow', dur: 2.6, xf: X.lie }); sfx(b, 'wind', { low: true }); }],
          [17.6, b => { hold('traveler', null); add('traveler', { robe: ROBE.stripped }); pose('traveler', 'fall'); sink('traveler', onRoad(X.lie, 0.1)); }],
          [19.2, () => { pose('traveler', 'lie'); glow('traveler', 0.18); }],
          // 祭司从这条路下来，看见他就从那边过去了
          [20.2, b => {
            pic('priest', { label: '祭司', x: X.road1 - 0.01, facing: -1, robe: ROBE.priest, accent: [120, 140, 200], v: onRoad(X.road1), hair: 'cloth' });
            walk('priest', X.lie + 0.05, { speed: 0.04 });
          }],
          [22.6, () => { sink('priest', onRoad(X.lie, -0.1)); walk('priest', X.road0 + 0.01, { speed: 0.04 }); }],
          [23.4, b => {
            pic('levite', { label: '利未人', x: X.road1 - 0.01, facing: -1, robe: ROBE.levite, v: onRoad(X.road1) });
            walk('levite', X.lie + 0.05, { speed: 0.04 });
          }],
          [25.8, () => { rm('priest'); sink('levite', onRoad(X.lie, -0.1)); walk('levite', X.road0 + 0.02, { speed: 0.04 }); }],
          [28.8, () => { rm('levite'); }],
        ]);
      },
    },

    // ── 路 10:37 你去照样行吧：撒马利亚人、油和酒、牲口、店 ─────────
    {
      kind: 'cmd', utter: '你去照样行吧', cmd: 'go --do likewise  # 是怜悯他的', ref: '路加福音 10:37',
      verse: [
        { text: '惟有一个撒马利亚人行路来到那里，看见他就动了慈心，<br>上前用油和酒倒在他的伤处，包裹好了，扶他骑上自己的牲口，带到店里去照应他。', ref: '路加福音 10:33–34', hold: 8.5 },
        { text: '第二天拿出二钱银子来，交给店主，说：<br>『你且照应他；此外所费用的，我回来必还你。』」', ref: '路加福音 10:35', hold: 6.5 },
        { text: '「你想，这三个人哪一个是落在强盗手中的邻舍呢？」<br>他说：「是怜悯他的。」耶稣说：「你去照样行吧。」', ref: '路加福音 10:36–37', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            rm('priest'); rm('levite');
            aura(X.road0, X.road1);
            tell(b, X.lie, 0.4);
            pic('samaritan', { label: '撒马利亚人', x: X.road1 - 0.005, facing: -1, robe: ROBE.samaritan, accent: [214, 196, 160], v: onRoad(X.lie), hair: 'cloth' });
            beast('donkey', { kind: 'donkey', x: X.road1 + 0.02, layer: 2, facing: -1, label: '牲口', v: onRoad(X.lie, -0.02), follow: 'samaritan', dx: 0.03 });
            walk('samaritan', X.lie + 0.022, { speed: 0.04 });
          }],
          [3.6, b => { pose('samaritan', 'kneel'); glow('samaritan', 0.55); sparkleOn(b, 'samaritan', 14, [255, 226, 170]); }],
          [5, b => { hold('samaritan', 'jar'); flash(b, { type: 'oil', dur: 3.2 }); }],
          [8, b => { hold('samaritan', null); add('traveler', { robe: [232, 226, 212] }); glow('traveler', 0.35); }],
          // 扶他骑上自己的牲口，带到店里去
          [9.4, b => {
            prop('inn', 'house', { x: X.inn, v: 0.14, size: 1.2, tone: { rgb: [168, 150, 120], w: 30, h: 17, door: 0.14 }, lit: 1, label: '店' });
            pose('samaritan', 'stand'); pose('traveler', 'stand'); sink('traveler', onRoad(X.lie));
          }],
          [10.2, () => { ride('traveler', 'donkey'); }],
          [11, () => { walk('samaritan', X.inn + 0.045, { speed: 0.03 }); }],
          // 第二天：拿出二钱银子来，交给店主
          [14.2, b => { if (!PORT) W.goTo(0.46, 6, b.instant); pic('innkeeper', { label: '店主', x: X.inn + 0.012, facing: 1, robe: ROBE.innkeeper, v: 0.24 }); }],
          [17.2, b => { ride('traveler', null); place('traveler', X.inn + 0.028); pose('traveler', 'sit'); face('samaritan', -1); }],
          [18.2, b => { flash(b, { type: 'coins', from: 'samaritan', to: 'innkeeper', n: 2, dur: 2 }); sfx(b, 'coins'); pose('samaritan', 'point'); }],
          // 你去照样行吧
          [20.6, b => { pose('samaritan', 'stand'); face('lawyer', -1); face('jesus', 1); pose('lawyer', 'bow'); }],
          [23.6, b => {
            pose('jesus', 'point'); glow('jesus', 0.45);
            beamOn(b, 'samaritan', { dur: 4, w: 70, r: 0.1 });
          }],
          [25.2, () => { pose('lawyer', 'stand'); face('lawyer', 1); walk('lawyer', 0.605, { speed: 0.022 }); pose('jesus', 'stand'); }],
        ]);
      },
    },

    // ── 路 10:41 马大！马大！：村庄里的一间屋，马利亚在耶稣脚前 ─────
    {
      kind: 'call', utter: '马大！马大！你为许多的事思虑烦扰', cmd: 'choose 上好的福分 --keep  # 不可少的只有一件', ref: '路加福音 10:41',
      verse: [
        { text: '他们走路的时候，耶稣进了一个村庄。有一个女人，名叫马大，接他到自己家里。<br>她有一个妹子，名叫马利亚，在耶稣脚前坐着听他的道。', ref: '路加福音 10:38–39', hold: 8 },
        { text: '马大伺候的事多，心里忙乱，就进前来，说：<br>「主啊，我的妹子留下我一个人伺候，你不在意吗？请吩咐她来帮助我。」', ref: '路加福音 10:40', hold: 7.5 },
        { text: '耶稣回答说：「马大！马大！你为许多的事思虑烦扰，<br>但是不可少的只有一件；马利亚已经选择那上好的福分，是不能夺去的。」', ref: '路加福音 10:41–42', hold: 8 },
      ],
      apply(c) {
        // 马大的家在村庄的中间偏右（近岸的空处），耶稣坐在门前，马利亚坐在他脚前
        const MH = X.mh, J = PORT ? 0.742 : 0.722, MY = PORT ? 0.7 : 0.688, HX = PORT ? 0.618 : 0.636;
        const DOOR = () => doorX(getP('mh')) || MH - 0.01;
        T(c, [
          [0, b => {
            fadePic(['samaritan', 'donkey', 'traveler', 'innkeeper', 'lawyer'], ['road', 'city', 'inn', 'aura']);
            if (!PORT) W.goTo(0.6, 6, b.instant);
            prop('mh', 'house', { x: MH, v: 0.04, size: 1.15, tone: { rgb: [182, 158, 124], w: 32, h: 19, door: -0.22, win: 0.26, stair: 1 }, lit: 0.8, label: '马大的家' });
            prop('hearth', 'hearth', { x: HX, v: 0.36, lit: 1, label: '灶' });
          }],
          // 耶稣进了一个村庄；马大接他到自己家里
          [1.2, b => {
            add('martha', { label: '马大', sex: 'f', x: DOOR(), facing: -1, robe: ROBE.martha, accent: [232, 214, 184], glow: 0.28, v: 0.14 });
            walk('jesus', J, { speed: 0.032, pose: 'sit' }); sink('jesus', 0.3);
            walk('peter', PORT ? 0.79 : 0.742, { speed: 0.032, pose: 'sit' }); sink('peter', 0.3);
            walk('john', PORT ? 0.835 : 0.757, { speed: 0.032, pose: 'sit' }); sink('john', 0.2);
            if (!PORT) { walk('d1', 0.6, { speed: 0.03, pose: 'sit' }); walk('d2', 0.585, { speed: 0.03, pose: 'sit' }); }
          }],
          [2.4, () => { pose('martha', 'bow'); }],
          [4.4, b => {
            add('maryb', { label: '马利亚', sex: 'f', x: DOOR() + 0.006, facing: 1, robe: ROBE.maryb, accent: [226, 222, 212], glow: 0.28, v: 0.18 });
            walk('maryb', MY, { speed: 0.02, pose: 'sit' }); sink('maryb', 0.55);
            pose('martha', 'stand'); hold('martha', 'jar');
          }],
          [8.2, () => { face('jesus', -1); face('peter', -1); face('john', -1); disciples(id => { if (id === 'd1' || id === 'd2') face(id, 1); }); }],
          // 马大伺候的事多，心里忙乱
          [6.8, () => { walk('martha', HX + 0.012, { speed: 0.03, pose: 'bow' }); sink('martha', 0.3); }],
          [9.2, () => { walk('martha', DOOR(), { speed: 0.035 }); sink('martha', 0.14); }],
          [11.2, () => { walk('martha', HX + 0.012, { speed: 0.035, pose: 'bow' }); sink('martha', 0.3); }],
          [13.4, () => { walk('martha', MY - 0.016, { speed: 0.035, pose: 'point' }); sink('martha', 0.3); face('martha', 1); }],
          // 马大！马大！——不可少的只有一件
          [18.6, b => { pose('martha', 'stand'); pose('jesus', 'raise'); face('martha', 1); }],
          [20.2, b => { hold('martha', null); glow('martha', 0.4); }],
          [22, b => { beamOn(b, 'maryb', { dur: 5, w: 70, r: 0.12 }); glow('maryb', 0.55); pose('jesus', 'sit'); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 路 11:9 你们祈求，就给你们：半夜叩门借饼；圣灵的光 ──────────
    {
      kind: 'promise', utter: '你们祈求，就给你们', cmd: 'knock --at midnight --until open && give 饼 ×3', ref: '路加福音 11:9',
      verse: [
        { text: '耶稣又说：「你们中间谁有一个朋友半夜到他那里去，说：『朋友！请借给我三个饼；<br>因为我有一个朋友行路，来到我这里，我没有什么给他摆上。』', ref: '路加福音 11:5–6', hold: 7.5 },
        { text: '我告诉你们，虽不因他是朋友起来给他，<br>但因他情词迫切地直求，就必起来照他所需用的给他。', ref: '路加福音 11:8', hold: 6.5 },
        { text: '我又告诉你们，你们祈求，就给你们；寻找，就寻见；叩门，就给你们开门。', ref: '路加福音 11:9', hold: 6.5 },
        { text: '……何况天父，岂不更将圣灵给求他的人吗？」', ref: '路加福音 11:13', hold: 5 },
      ],
      apply(c) {
        const JX = PORT ? 0.524 : 0.518;
        const FH = X.fhouse, FD = () => doorX(getP('fh')) || FH - 0.006;
        T(c, [
          // 夜里：马大、马利亚进屋去；耶稣与门徒坐在灶火旁，他教导他们
          [0, b => {
            W.goTo(0.97, 6, b.instant);
            const d = doorX(getP('mh')) || X.mh;
            walk('martha', d, { speed: 0.03 }); walk('maryb', d + 0.004, { speed: 0.03 });
            prop('mh', null, { lit: 1 });
            prop('hA', null, { lit: 0.8 }); prop('hB', null, { lit: 0.8 });
          }],
          [2.4, b => {
            rm('martha'); rm('maryb'); unprop('mh');
            prop('hearth', null, { x: X.fire, v: 0.5 });
            walk('jesus', JX, { speed: 0.034, pose: 'sit' }); sink('jesus', 0.34);
            walk('peter', X.fire - 0.018, { speed: 0.034, pose: 'sit' }); walk('john', X.fire + (PORT ? 0.028 : 0.024), { speed: 0.034, pose: 'sit' }); sink('john', 0.5);
            if (!PORT) { walk('d1', X.fire - 0.034, { speed: 0.03, pose: 'sit' }); walk('d2', X.fire - 0.05, { speed: 0.03, pose: 'sit' }); }
          }],
          // 他坐着，面向门徒；门徒都向着他
          [5.8, () => { face('jesus', -1); disciples(id => face(id, 1)); }],
          [3.4, b => {
            aura(X.fman0 - 0.03, FH + 0.07);
            tell(b, FH, 0.3);
            prop('fh', 'house', { x: FH, v: 0.12, size: 1.3, tone: { rgb: [170, 148, 118], w: 28, h: 18, door: -0.14, win: 0.28 }, k: 1, lit: 0.25, label: '朋友的家' });
          }],
          [4.6, b => {
            pic('knocker', { label: '半夜借饼的人', x: X.fman0, facing: 1, robe: ROBE.knocker, prop: 'torch', v: 0.42, glow: 0.4 });
            walk('knocker', FD() - 0.02, { speed: 0.03 });
          }],
          // 叩门
          [8.4, b => { pose('knocker', 'raise'); flash(b, { type: 'knock', xf: FD(), v: 0.12, dur: 1.6 }); sfx(b, 'build', { soft: true }); }],
          [10.4, b => { pose('knocker', 'stand'); }],
          [11.6, b => { pose('knocker', 'raise'); flash(b, { type: 'knock', xf: FD(), v: 0.12, dur: 1.6 }); sfx(b, 'build', { soft: true }); }],
          [13.6, b => { prop('fh', null, { lit: 1 }); pose('knocker', 'stand'); }],
          [15.2, b => {
            prop('fh', null, { k: 0 });
            sfx(b, 'gate', { soft: true });
            pic('friend', { label: '朋友', x: FD(), facing: -1, robe: ROBE.friend, v: 0.16, glow: 0.4 });
            walk('friend', FD() - 0.006, { speed: 0.01 }); sink('friend', 0.34);
          }],
          [17.2, b => { flash(b, { type: 'loaves', dur: 2.2 }); hold('knocker', 'bundle'); }],
          [19.2, b => { pose('knocker', 'bow'); beamOn(b, 'knocker', { dur: 4, w: 60, r: 0.1 }); }],
          // 你们祈求，就给你们：他向着门徒
          [16.6, () => { face('jesus', -1); pose('jesus', 'sit'); }],
          // 何况天父，岂不更将圣灵给求他的人：是应许——高处聚起一团柔光，还没有降下
          [24.4, b => {
            S.sx = (X.fire + JX) / 2;
            W.set('paSpirit', 1, b.instant);
            glow('jesus', 0.5);
            sfx(b, 'angel', { soft: true });
          }],
          [28.4, b => { W.set('paSpirit', 0.45, b.instant); }],
        ]);
      },
    },

    // ── 路 12:20 无知的人哪，今夜必要你的灵魂：仓房、灯灭 ───────────
    {
      kind: 'judge', utter: '无知的人哪，今夜必要你的灵魂', cmd: 'return 灵魂 --tonight  # 你所预备的要归谁呢', ref: '路加福音 12:20',
      verse: [
        { text: '就用比喻对他们说：「有一个财主田产丰盛；<br>自己心里思想说：『我的出产没有地方收藏，怎么办呢？』', ref: '路加福音 12:16–17', hold: 6.5 },
        { text: '又说：『我要这么办：要把我的仓房拆了，另盖更大的，……<br>然后要对我的灵魂说：灵魂哪，……只管安安逸逸地吃喝快乐吧！』', ref: '路加福音 12:18–19', hold: 7 },
        { text: '神却对他说：『无知的人哪，今夜必要你的灵魂；你所预备的要归谁呢？』', ref: '路加福音 12:20', hold: 6 },
        { text: '凡为自己积财，在神面前却不富足的，也是这样。」', ref: '路加福音 12:21', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          // 次日午后：许多人聚集来听
          [0, b => {
            fadePic(['knocker', 'friend'], ['fh', 'aura']);
            W.set('paSpirit', 0, b.instant);
            W.goTo(DAYC(0.6, 0.7), 5, b.instant);
            prop('hearth', null, { lit: 0.35 });
            lukeGroup(b); face('jesus', 1);
            crowd('many', { n: PORT ? 4 : 8, x0: PORT ? 0.36 : 0.38, x1: PORT ? 0.44 : 0.43, layer: 2, label: '众人', glow: 0.1 }, folk(PLAIN, 0.1, 0.7));
            cface('many', 1);
          }],
          // 有一个财主田产丰盛
          [1.8, b => {
            aura(X.rf0, X.pic1);
            tell(b, (X.rf0 + X.rf1) / 2, 0.3);
            prop('crop', 'crop', { x0: X.rf0, x1: X.rf1, grow: 1, k: 1, tone: { v0: 0.12, v1: 0.7, h: 22 }, label: '财主的田' });
            prop('barns', 'barns', { x: X.barns, v: 0.1, label: '仓房' });
          }],
          [3, b => {
            pic('rich', { label: '财主', x: X.rich, facing: -1, robe: ROBE.rich, accent: [220, 190, 120], v: 0.46, glow: 0.34 });
          }],
          [5, () => { pose('rich', 'point'); }],
          // 把仓房拆了，另盖更大的
          [7.6, b => { prop('barns', null, { k: 1, rate: { k: 0.6 } }); sfx(b, 'collapse', { soft: true }); face('rich', 1); pose('rich', 'stand'); W.goTo(0.765, 4.5, b.instant); }],
          [8.8, b => { prop('barns', null, { grow: 1, rate: { grow: 0.2 } }); sfx(b, 'build'); }],
          [11.2, b => { prop('barns', null, { k2: 1, rate: { k2: 0.3 } }); prop('crop', null, { grow: 0.12, rate: { grow: 0.3 } }); sfx(b, 'build', { soft: true }); }],
          // 天黑了：灵魂哪，只管安安逸逸地吃喝快乐吧（「今夜」的话出来之前，夜已经到了，灯已经点着）
          [12.4, b => { W.goTo(0.93, 3.2, b.instant); }],
          [13.2, b => {
            face('rich', -1); pose('rich', 'sit');
            prop('lamp', 'lamp', { x: X.rich - 0.02, v: 0.5, lit: 1, label: '灯' });
          }],
          // 今夜必要你的灵魂：灯灭了，人不见了
          [16.4, b => { W.set('paCold', 1, b.instant); prop('aura', null, { tone: { cold: 1 } }); sfx(b, 'whisper'); }],
          [18.2, b => { prop('lamp', null, { lit: 0, k: 1, rate: { lit: 0.7 } }); }],
          [19.8, () => { pose('rich', 'lie'); glow('rich', 0.05); }],
          [21.4, () => { rm('rich'); }],
          // 凡为自己积财，在神面前却不富足的
          [22.6, b => { prop('barns', null, { k3: 1, rate: { k3: 0.4 } }); prop('lamp', null, { k: 0 }); prop('hearth', null, { lit: 1 }); }],
          [26, b => { W.set('paCold', 0.5, b.instant); }],
        ]);
      },
    },

    // ── 路 14:23 勉强人进来，坐满我的屋子：大筵席 ─────────────────
    {
      kind: 'cmd', utter: '勉强人进来，坐满我的屋子', cmd: 'invite --from 大街小巷 路上 篱笆 --until full', ref: '路加福音 14:23',
      verse: [
        { text: '耶稣对他说：「有一人摆设大筵席，请了许多客。<br>到了坐席的时候，打发仆人去对所请的人说：『请来吧！样样都齐备了。』', ref: '路加福音 14:16–17', hold: 7 },
        { text: '众人一口同音地推辞。……家主就动怒，对仆人说：<br>『快出去，到城里大街小巷，领那贫穷的、残废的、瞎眼的、瘸腿的来。』', ref: '路加福音 14:18–21', hold: 7.5 },
        { text: '主人对仆人说：『你出去到路上和篱笆那里，勉强人进来，坐满我的屋子。』」', ref: '路加福音 14:23', hold: 6 },
        { text: '从东、从西、从南、从北将有人来，在神的国里坐席。', ref: '路加福音 13:29', hold: 5 },
      ],
      apply(c) {
        const TV = 0.44, T0 = X.tab0, T1 = X.tab1;
        T(c, [
          [0, b => {
            fadePic([], ['crop', 'barns', 'lamp']);
            W.set('paCold', 0, b.instant);
            // 另一日的傍晚：到了坐席的时候（晚饭）——灯已点上，人还看得见颜色
            W.goTo(0.745, 6, b.instant);
            prop('aura', null, { tone: { cold: 0 } });
            aura(T0 - 0.04, X.pic1 + 0.01);
            tell(b, (T0 + T1) / 2, TV);
            prop('table', 'table', { x0: T0, x1: T1, v: TV, lit: 1, k: 1, label: '大筵席' });
            crm('many');
          }],
          [1.2, b => {
            pic('master', { label: '家主', x: X.master, facing: -1, robe: ROBE.master, accent: [230, 200, 130], v: 0.3, age: 'elder', prop: null });
            pic('servant', { label: '仆人', x: X.master - 0.02, facing: 1, robe: ROBE.servant, v: 0.5 });
            walk('servant', X.called - 0.012, { speed: 0.035, pose: 'raise' });
          }],
          [3.4, b => {
            crowd('invited', { n: 3, x0: X.called + 0.004, x1: X.called + 0.036, layer: 2, label: '所请的人', glow: 0.3, from: 'light' }, man([[120, 96, 70], [96, 110, 120], [146, 118, 90]], 0.42, 0.66, 'adult'));
            cface('invited', -1);
          }],
          // 众人一口同音地推辞：转身，往右边走开
          [8.2, b => { cface('invited', 1); cwalk('invited', 1.06, 1.12, { speed: 0.03 }); sfx(b, 'crowd', { soft: true }); pose('servant', 'stand'); }],
          [10, () => { walk('servant', X.master - 0.03, { speed: 0.035 }); crm('invited'); }],
          [11.4, b => { pose('master', 'point'); face('master', -1); }],
          // 领那贫穷的、残废的、瞎眼的、瘸腿的来
          [12.6, b => {
            walk('servant', T0 - 0.03, { speed: 0.04 });
            crowd('poor', { n: PORT ? 3 : 6, x0: T0 - 0.05, x1: T0 - 0.01, layer: 2, label: '贫穷的、残废的、瞎眼的、瘸腿的', glow: 0.22, from: 'light' }, (m, i) => {
              folk(POOR)(m, i); m.v = 0.2 + (i % 3) * 0.05; if (i % 2 === 0) { m.prop = 'staff'; m.age = 'elder'; }
            });
          }],
          [15, b => { cwalk('poor', T0 + 0.01, lerp(T0, T1, PORT ? 0.35 : 0.5), { speed: 0.022, pose: 'sit' }); cface('poor', 1); pose('master', 'stand'); }],
          [17.2, () => { cglow('poor', 0.4); }],
          // 到路上和篱笆那里，勉强人进来
          [17.8, b => {
            walk('servant', X.called + 0.01, { speed: 0.05, pose: 'raise' });
            crowd('hedge', { n: PORT ? 3 : 6, x0: X.called + 0.03, x1: X.called + 0.07, layer: 2, label: '路上和篱笆那里的人', glow: 0.26, from: 'light' }, (m, i) => { folk(PLAIN)(m, i); m.v = 0.2 + (i % 3) * 0.05; });
          }],
          [18.4, b => {
            cwalk('hedge', lerp(T0, T1, PORT ? 0.45 : 0.55), T1 - 0.01, { speed: 0.04, pose: 'sit' }); cface('hedge', -1);
            sfx(b, 'crowd', { soft: true });
          }],
          [20.2, () => { walk('servant', X.master + 0.024, { speed: 0.035 }); face('servant', -1); }],
          // 坐满了
          [23.4, () => { cglow('hedge', 0.4); }],
          // 从东、从西、从南、从北将有人来
          [24.4, b => {
            flash(b, { type: 'four', dur: 4.2 });
            pose('master', 'raise');
            sfx(b, 'harp');
          }],
          [27.4, b => { pose('master', 'stand'); beamOn(b, 'master', { dur: 3, w: 60, r: 0.1 }); }],
        ]);
      },
    },

    // ── 路 15:6 失羊：税吏和罪人挨近来听；九十九只，那一只 ────────────
    {
      kind: 'bless', utter: '我失去的羊已经找着了', cmd: 'find 羊 --lost 1 --of 100 && rejoice --with 朋友 邻舍', ref: '路加福音 15:6',
      verse: [
        { text: '众税吏和罪人都挨近耶稣，要听他讲道。<br>法利赛人和文士私下议论说：「这个人接待罪人，又同他们吃饭。」', ref: '路加福音 15:1–2', hold: 6.5 },
        { text: '耶稣就用比喻说：「你们中间谁有一百只羊失去一只，<br>不把这九十九只撇在旷野、去找那失去的羊，直到找着呢？', ref: '路加福音 15:3–4', hold: 6.5 },
        { text: '找着了，就欢欢喜喜地扛在肩上，回到家里，<br>就请朋友邻舍来，对他们说：『我失去的羊已经找着了，你们和我一同欢喜吧！』', ref: '路加福音 15:5–6', hold: 7.5 },
        { text: '我告诉你们，一个罪人悔改，在天上也要这样为他欢喜，<br>较比为九十九个不用悔改的义人欢喜更大。」', ref: '路加福音 15:7', hold: 6 },
      ],
      apply(c) {
        T(c, [
          // 天亮：税吏和罪人挨近耶稣；法利赛人和文士站在一旁
          [0, b => {
            fadePic(['master', 'servant'], ['table', 'aura'], ['poor', 'hedge', 'invited']);
            W.goTo(DAYC(0.34, 0.31), 5, b.instant);
            prop('hearth', null, { lit: 0 });
            lukeGroup(b, PORT ? {} : { pet: 0.486, joh: 0.47, d1: 0.456, d2: 0.442 });
          }],
          [1.4, b => {
            crowd('sinners', { n: PORT ? 4 : 7, x0: 0.63, x1: 0.68, layer: 2, label: '税吏和罪人', glow: 0.14 }, folk(POOR, 0.3, 0.72));
            cwalk('sinners', PORT ? 0.55 : 0.535, PORT ? 0.6 : 0.595, { speed: 0.025 });
            crowd('phar', { n: PORT ? 2 : 3, x0: PORT ? 0.35 : 0.395, x1: PORT ? 0.39 : 0.425, layer: 2, label: '法利赛人和文士', glow: 0.1 }, man(PHAR, 0.1, 0.5, 'adult'));
            cface('phar', 1);
          }],
          [4.6, b => { cface('sinners', -1); sfx(b, 'crowd', { soft: true }); }],
          [5.4, b => { cface('phar', -1); sfx(b, 'murmur', { soft: true }); }],
          // 一百只羊失去一只
          [7.8, b => {
            aura(X.flock0 - 0.03, X.pic1 + 0.01);
            tell(b, (X.flock0 + X.flock1) / 2, 0.2);
            herd('flock', { kind: 'sheep', n: PORT ? 7 : 11, x0: X.flock0, x1: X.flock1, layer: 2, label: '九十九只羊', from: 'fade', mill: true });
            pic('shepherd', { label: '找羊的人', x: X.flock0 + 0.02, facing: 1, robe: ROBE.shepherd, prop: 'staff', v: 0.4 });
            prop('thorny', 'thorny', { x: X.lost, v: 0.12, label: '旷野' });
            beast('lost', { kind: 'lamb', x: X.lost - 0.006, layer: 2, facing: -1, label: '失去的羊', v: 0.16, pose: 'stand' });
            sfx(b, 'bleat', { soft: true });
          }],
          [10.4, b => { cface('phar', 1); cface('sinners', 1); walk('shepherd', X.lost - 0.03, { speed: 0.022 }); sfx(b, 'bleat', { far: true }); }],
          // 找着了，就欢欢喜喜地扛在肩上
          [15.8, b => { pose('shepherd', 'kneel'); }],
          [17, b => { rm('lost', true); carry('shepherd', 'lamb'); pose('shepherd', 'stand'); glow('shepherd', 0.5); sparkleOn(b, 'shepherd', 16, [255, 236, 190]); sfx(b, 'bleat'); }],
          [18.2, () => { walk('shepherd', X.flock0 - 0.02, { speed: 0.03 }); }],
          [20.4, b => {
            crowd('friends', { n: PORT ? 2 : 4, x0: X.flock0 - 0.08, x1: X.flock0 - 0.045, layer: 2, label: '朋友邻舍', glow: 0.22, from: 'light' }, (m, i) => { folk(PLAIN)(m, i); m.v = 0.3 + i * 0.08; });
            cface('friends', 1);
          }],
          [22.6, b => { cpose('friends', 'raise'); pose('shepherd', 'raise'); sfx(b, 'laugh', { soft: true }); }],
          // 在天上也要这样为他欢喜：天上一圈金光绽开，欢喜的光留在天上
          [23.8, b => {
            S.hx = (X.flock0 + X.pic1) / 2;
            W.set('paHeaven', 1, b.instant);
            flash(b, { type: 'joy', dur: 3.6 });
            cglow('sinners', 0.3);
            sfx(b, 'angel', { soft: true });
          }],
          [27, () => { cpose('friends', 'stand'); pose('shepherd', 'stand'); }],
        ]);
      },
    },

    // ── 路 15:9 失钱：点上灯，打扫屋子，细细地找 ──────────────────
    {
      kind: 'bless', utter: '我失落的那块钱已经找着了', cmd: 'light 灯 && sweep 屋子 --until found', ref: '路加福音 15:9',
      verse: [
        { text: '「或是一个妇人有十块钱，若失落一块，<br>岂不点上灯，打扫屋子，细细地找，直到找着吗？', ref: '路加福音 15:8', hold: 6.5 },
        { text: '找着了，就请朋友邻舍来，对他们说：<br>『我失落的那块钱已经找着了，你们和我一同欢喜吧！』', ref: '路加福音 15:9', hold: 6.5 },
        { text: '我告诉你们，一个罪人悔改，在神的使者面前也是这样为他欢喜。」', ref: '路加福音 15:10', hold: 5.5 },
      ],
      apply(c) {
        // 门口：她点上灯，就在门里门外、灯光照着的地上细细地找
        const HX = X.chouse, D = () => doorX(getP('ch')) || HX - 0.009, CX = () => D() - (PORT ? 0.02 : 0.014);
        T(c, [
          [0, b => {
            fadePic(['shepherd'], ['thorny', 'aura'], ['flock', 'friends']);
            W.set('paHeaven', 0, b.instant);
            W.goTo(0.745, 5, b.instant);
            aura(HX - 0.1, HX + 0.08);
            tell(b, HX, 0.1);
            prop('ch', 'house', { x: HX, v: 0.06, size: 1.25, tone: { rgb: [170, 148, 116], w: 30, h: 18, door: -0.2, lampDay: 0.4 }, lit: 0, label: '妇人的屋子' });
            prop('coin', 'coin', { x: CX(), v: 0.46, k: 0, label: '失落的那块钱' });
          }],
          [1.4, b => { pic('woman', { label: '妇人', sex: 'f', x: D(), facing: -1, robe: ROBE.woman, accent: [230, 214, 196], v: 0.2, glow: 0.36 }); }],
          // 点上灯：门里的灯光洒到门前的地上
          [3, b => {
            prop('ch', null, { lit: 1 }); hold('woman', 'torch'); sfx(b, 'fire', { soft: true });
            prop('pool', 'pool', { x: D() - 0.006, v: 0.34, size: 1.1, lit: 1, rate: { lit: 0.8 } });
          }],
          // 打扫屋子，细细地找（手里拿着灯，弯着腰）
          [4.6, () => { walk('woman', D() - (PORT ? 0.04 : 0.03), { speed: 0.018, pose: 'bow' }); sink('woman', 0.36); }],
          [7.6, () => { walk('woman', D() + 0.012, { speed: 0.02, pose: 'bow' }); sink('woman', 0.44); }],
          [9.2, b => { prop('coin', null, { k: 1 }); sfx(b, 'chime', { soft: true }); }],
          // 找着了
          [10.4, () => { walk('woman', CX() + 0.01, { speed: 0.025, pose: 'kneel' }); face('woman', -1); }],
          [12.2, b => { prop('coin', null, { k: 0, rate: { k: 1.2 } }); flash(b, { type: 'glint', id: 'woman', frac: 0.8, r: 18, dur: 2.6 }); sfx(b, 'coins', { soft: true }); }],
          [13.2, b => {
            hold('woman', null); pose('woman', 'raise');
            crowd('nbrs', { n: PORT ? 2 : 4, x0: HX - 0.14, x1: HX - 0.1, layer: 2, label: '朋友邻舍', glow: 0.22, from: 'light' }, woman([[160, 120, 100], [120, 128, 150], [176, 150, 110], [140, 110, 130]], 0.3, 0.55));
            cface('nbrs', 1);
          }],
          [15.2, b => { cpose('nbrs', 'raise'); sfx(b, 'timbrel', { soft: true }); }],
          // 在神的使者面前也是这样为他欢喜
          [16.4, b => {
            S.hx = HX - 0.04;
            W.set('paHeaven', 0.85, b.instant);
            for (let i = 0; i < 3; i++) {
              const ax = HX - 0.16 + i * 0.1;
              add('ang' + i, { label: '神的使者', angel: true, x: ax, layer: 2, facing: i === 2 ? -1 : 1, pose: 'raise', glow: 0.7, from: 'light' });
              fly('ang' + i, ax, (PORT ? 0.44 : 0.33) + (i % 2) * 0.05, { dur: 2.4 });
            }
            sfx(b, 'angel');
          }],
          [19.6, () => { cpose('nbrs', 'stand'); pose('woman', 'stand'); }],
        ]);
      },
    },

    // ── 路 15:11 一个人有两个儿子：分家业，往远方去；饥荒与猪；醒悟 ──────
    {
      kind: 'act', utter: '一个人有两个儿子', cmd: 'split 家业 && cd 远方  # 任意放荡', ref: '路加福音 15:11',
      verse: [
        { text: '耶稣又说：「一个人有两个儿子。小儿子对父亲说：<br>『父亲，请你把我应得的家业分给我。』他父亲就把产业分给他们。', ref: '路加福音 15:11–12', hold: 6.5 },
        { text: '过了不多几日，小儿子就把他一切所有的都收拾起来，往远方去了。<br>在那里任意放荡，浪费资财。', ref: '路加福音 15:13', hold: 6 },
        { text: '既耗尽了一切所有的，又遇着那地方大遭饥荒，就穷苦起来。<br>于是去投靠那地方的一个人；那人打发他到田里去放猪。', ref: '路加福音 15:14–15', hold: 6.5 },
        { text: '他醒悟过来，就说：『我父亲有多少的雇工，口粮有余，我倒在这里饿死吗？<br>我要起来，到我父亲那里去……』', ref: '路加福音 15:17–18', hold: 6.5 },
      ],
      apply(c) {
        const H = X.home;
        T(c, [
          // 第二天清早：父家
          [0, b => {
            fadePic(['woman', 'ang0', 'ang1', 'ang2'], ['ch', 'coin', 'pool', 'aura'], ['nbrs']);
            W.set('paHeaven', 0, b.instant);
            W.goTo(DAYC(0.33, 0.31), 6, b.instant);
            aura(H - 0.06, X.pic1 + 0.04);
            tell(b, H, 0.3);
            // 父家；大儿子的田在父家的那一边（与听比喻的人隔开）
            prop('fhouse', 'fhouse', { x: H + 0.022, lit: 0.6, k: 0, k2: 0, label: '父家' });
            prop('efield', 'crop', { x0: X.efield0, x1: X.efield1, grow: 1, k: 0.3, tone: { h: 13, v0: 0.08, v1: 0.42 }, label: '大儿子的田' });
            // 听比喻的人静静地站着（光都在画上）
            cglow('sinners', 0.05); cglow('phar', 0.04);
          }],
          [1.4, b => {
            pic('father', { label: '父亲', x: H, facing: -1, robe: ROBE.father, accent: [226, 220, 206], age: 'elder', v: 0.34, prop: 'staff', glow: 0.36 });
            pic('elder', { label: '大儿子', x: H + (PORT ? 0.04 : 0.03), facing: -1, robe: ROBE.elder, v: 0.24 });
            pic('son', { label: '小儿子', x: H - (PORT ? 0.05 : 0.03), facing: 1, robe: ROBE.son, v: 0.44, glow: 0.34 });
            if (!PORT) pic('sv1', { label: '仆人', x: H + 0.046, facing: -1, robe: ROBE.servant, v: 0.14 });
          }],
          [3.6, () => { walk('son', H - (PORT ? 0.03 : 0.014), { speed: 0.012, pose: 'raise' }); }],
          [5.4, b => { pose('father', 'point'); flash(b, { type: 'coins', from: 'father', to: 'son', n: 3, dur: 2 }); sfx(b, 'coins'); }],
          [6.6, () => { hold('son', 'bundle'); pose('son', 'stand'); pose('father', 'stand'); }],
          // 往远方去了
          [8, () => { walk('son', X.far, { speed: 0.032 }); }],
          [9.6, () => { face('father', 1); pose('father', 'gaze'); walk('elder', X.efield0 + 0.02, { speed: 0.02, pose: 'bow' }); hold('elder', 'staff'); }],
          // 在那里任意放荡，浪费资财
          [15.6, b => { hold('son', null); flash(b, { type: 'glint', id: 'son', frac: 0.5, r: 14, dur: 1.8, rgb: 'gold' }); sfx(b, 'coins', { far: true }); }],
          // 饥荒：远方的地枯了；放猪
          [17.2, b => {
            prop('famine', 'famine', { x0: X.far - 0.08, x1: 1.01, layer: 2, k: 1, rate: { k: 0.3 }, label: '远方' });
            add('son', { robe: ROBE.rags }); glow('son', 0.2);
            sfx(b, 'wind', { soft: true });
          }],
          [19.8, b => { prop('pigs', 'pigs', { x0: X.far - 0.05, x1: X.far + 0.06, layer: 2, label: '猪' }); pose('son', 'sit'); }],
          // 他醒悟过来
          [23.6, b => {
            pose('son', 'stand'); face('son', -1); glow('son', 0.42);
            sparkleOn(b, 'son', 10, [255, 236, 190]);
          }],
          [26, () => { pose('son', 'gaze'); }],
        ]);
      },
    },

    // ── 路 15:24 我这个儿子是死而复活，失而又得的：父亲跑去抱着他 ─────────
    {
      kind: 'bless', utter: '我这个儿子是死而复活，失而又得的', cmd: 'run --to 儿子 && restore 袍子 戒指 鞋  # 失而又得', ref: '路加福音 15:24',
      verse: [
        { text: '于是起来，往他父亲那里去。相离还远，他父亲看见，就动了慈心，<br>跑去抱着他的颈项，连连与他亲嘴。', ref: '路加福音 15:20', hold: 7 },
        { text: '儿子说：『父亲！我得罪了天，又得罪了你；<br>从今以后，我不配称为你的儿子。』', ref: '路加福音 15:21', hold: 5.5 },
        { text: '父亲却吩咐仆人说：『把那上好的袍子快拿出来给他穿；<br>把戒指戴在他指头上；把鞋穿在他脚上；……』', ref: '路加福音 15:22', hold: 6.5 },
        { text: '『因为我这个儿子是死而复活，失而又得的。』他们就快乐起来。', ref: '路加福音 15:24', hold: 5.5 },
      ],
      apply(c) {
        const H = X.home, MEET = X.meet;
        T(c, [
          // 相离还远，他父亲看见，就动了慈心，跑去抱着他的颈项
          [0, b => {
            W.goTo(0.7, 6, b.instant);
            prop('pigs', null, { show: false });
            prop('famine', null, { k: 0, rate: { k: 0.12 } });
            walk('son', X.far - 0.03, { speed: 0.03 });
            face('father', 1); pose('father', 'gaze');
          }],
          [1, b => { hold('father', null); embrace('father', 'son', { run: true, at: MEET, weep: true }); sfx(b, 'heart', { soft: true }); }],
          [3.8, b => { beam(b, MEET, 2, { v: 0.4, w: 110, r: 0.2, dur: 5.5 }); glow('father', 0.55); glow('son', 0.5); sfx(b, 'weep', { soft: true }); }],
          // 父亲！我得罪了天，又得罪了你
          [8.2, () => { pose('son', 'kneel'); pose('father', 'stand'); face('father', 1); }],
          [10.6, () => { pose('father', 'raise'); face('father', -1); }],
          // 上好的袍子、戒指、鞋
          [13, b => {
            pic('sv1', { label: '仆人', x: H + 0.056, facing: 1, robe: ROBE.servant, v: 0.14 });
            pic('sv2', { label: '仆人', x: H + 0.04, facing: 1, robe: [134, 126, 108], v: 0.3 });
            run('sv1', MEET - 0.034, { speed: 0.08 }); run('sv2', MEET + 0.036, { speed: 0.08 });
            hold('sv1', 'coat');
          }],
          [16.4, b => {
            hold('sv1', null); pose('son', 'stand');
            add('son', { robe: ROBE.best, accent: [226, 190, 110] }); glow('son', 0.6);
            flash(b, { type: 'robe', dur: 2.2 }); sfx(b, 'harp');
          }],
          [18, b => { flash(b, { type: 'glint', id: 'son', frac: 0.5, dx: 4, r: 8, dur: 1.6, rgb: 'gold' }); sfx(b, 'chime'); face('son', -1); face('father', -1); }],
          // 他们就快乐起来：回家，点上灯，作乐跳舞
          [19.6, () => {
            walk('father', H + 0.004, { speed: 0.03 }); walk('son', H - (PORT ? 0.03 : 0.016), { speed: 0.03 }); hands('father', 'son', true);
            walk('sv1', H - (PORT ? 0.05 : 0.036), { speed: 0.034 }); walk('sv2', H - (PORT ? 0.075 : 0.056), { speed: 0.034 });
          }],
          [21.4, b => { prop('fhouse', null, { k: 1, k2: 1, lit: 1 }); prop('hearth', null, { lit: 1 }); W.goTo(0.742, 5, b.instant); sfx(b, 'lyre'); }],
          [24.2, b => { pose('sv1', 'raise'); pose('sv2', 'raise'); sfx(b, 'timbrel', { soft: true }); }],
          [26, b => { pose('sv1', 'stand'); pose('sv2', 'raise'); face('sv2', -1); }],
          [27.6, () => { pose('sv2', 'stand'); pose('sv1', 'raise'); }],
        ]);
      },
    },

    // ── 路 15:31 儿啊！你常和我同在：大儿子站在门外，父亲出来劝他 ─────────
    {
      kind: 'call', utter: '儿啊！你常和我同在，我一切所有的都是你的', cmd: 'open 门 --for 大儿子  # 理当欢喜快乐', ref: '路加福音 15:31',
      verse: [
        { text: '那时，大儿子正在田里。他回来，离家不远，听见作乐跳舞的声音，', ref: '路加福音 15:25', hold: 5.5 },
        { text: '大儿子却生气，不肯进去；他父亲就出来劝他。', ref: '路加福音 15:28', hold: 4.5 },
        { text: '他对父亲说：『我服事你这多年，从来没有违背过你的命，<br>你并没有给我一只山羊羔，叫我和朋友一同快乐。……』', ref: '路加福音 15:29', hold: 6.5 },
        { text: '父亲对他说：『儿啊！你常和我同在，我一切所有的都是你的；<br>只是你这个兄弟是死而复活、失而又得的，所以我们理当欢喜快乐。』」', ref: '路加福音 15:31–32', hold: 8 },
      ],
      apply(c) {
        // 筵席在父家门前、院墙那一边；大儿子从田里回来，站在父家的另一边（院里的灯照到那里），父亲出来劝他
        const H = X.home, E = X.estop, PL = X.plead;
        T(c, [
          [0, b => {
            W.goTo(0.75, 8, b.instant);      // 日落时分：灯都点着，人还看得清
            pose('sv1', 'stand'); pose('sv2', 'stand');
            hands('father', 'son', false);
            walk('father', H + 0.008, { speed: 0.02 }); walk('son', H - (PORT ? 0.022 : 0.014), { speed: 0.02 });
            sink('son', 0.3); sink('father', 0.2);
            walk('sv1', H - (PORT ? 0.05 : 0.036), { speed: 0.02, pose: 'raise' }); walk('sv2', H - (PORT ? 0.075 : 0.056), { speed: 0.02 });
            prop('epool', 'pool', { x: (PL + E) / 2, v: 0.38, size: 1.05, lit: 0.7 });
          }],
          // 大儿子从田里回来，离家不远，听见作乐跳舞的声音
          [1.2, b => { pose('elder', 'stand'); hold('elder', null); walk('elder', E, { speed: 0.01 }); sink('elder', 0.4); glow('elder', 0.36); face('elder', -1); sfx(b, 'lyre', { soft: true }); }],
          [3.2, b => { sfx(b, 'timbrel', { soft: true }); pose('sv2', 'raise'); }],
          // 却生气，不肯进去：转过身去
          [6.8, () => { face('elder', 1); pose('sv2', 'stand'); pose('sv1', 'stand'); }],
          // 他父亲就出来劝他：伸出手来
          [8.2, () => { walk('father', PL, { speed: 0.02, pose: 'point' }); sink('father', 0.38); glow('father', 0.5); }],
          // 我服事你这多年……
          [12.6, () => { face('elder', -1); pose('elder', 'point'); pose('father', 'stand'); }],
          [16.6, () => { pose('elder', 'stand'); face('elder', 1); }],
          // 儿啊！你常和我同在，我一切所有的都是你的——父亲的手一直伸着；比喻停在这里，大儿子怎样回答，经上没有说
          [20, b => {
            pose('father', 'point'); glow('father', 0.6);
            prop('fhouse', null, { k2: 1, lit: 1 });
            prop('epool', null, { lit: 1 });
            beam(b, (PL + E) / 2, 2, { v: 0.4, w: 110, r: 0.18, dur: 5.5 });
            sfx(b, 'harp', { soft: true });
          }],
          [26.6, () => { face('son', -1); pose('son', 'raise'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '四福音', books: [40, 41, 42, 43], title: '比喻', sub: '马太福音 13 · 路加福音 10 — 15', tint: [255, 226, 180], music: 'ruth',
    outro: 24,
    intro: [
      { text: '当那一天，耶稣从房子里出来，坐在海边。<br>有许多人到他那里聚集，他只得上船坐下，众人都站在岸上。', ref: '马太福音 13:1–2', hold: 7.5 },
    ],
    setup, stages: STAGES, scene: SCENE,
    behold: {
      '耶稣': { text: '这都是耶稣用比喻对众人说的话；若不用比喻，就不对他们说什么。', ref: '马太福音 13:34' },
      '彼得': { text: '彼得说：「主啊，这比喻是为我们说的呢？还是为众人呢？」', ref: '路加福音 12:41' },
      '约翰': { text: '耶稣转身暗暗地对门徒说：「看见你们所看见的，那眼睛就有福了。」', ref: '路加福音 10:23' },
      '门徒': { text: '但你们的眼睛是有福的，因为看见了；你们的耳朵也是有福的，因为听见了。', ref: '马太福音 13:16' },
      '众人': { text: '有许多人到他那里聚集，他只得上船坐下，众人都站在岸上。', ref: '马太福音 13:2' },
      '船': { text: '有许多人到他那里聚集，他只得上船坐下，众人都站在岸上。', ref: '马太福音 13:2' },
      '房子': { text: '当下，耶稣离开众人，进了房子。', ref: '马太福音 13:36' },
      '村庄': { text: '他们走路的时候，耶稣进了一个村庄。', ref: '路加福音 10:38' },
      '迦百农': { text: '当那一天，耶稣从房子里出来，坐在海边。', ref: '马太福音 13:1' },
      '撒种的': { text: '他用比喻对他们讲许多道理，说：「有一个撒种的出去撒种。」', ref: '马太福音 13:3' },
      '田': { text: '撒在好地上的，就是人听道明白了，后来结实，有一百倍的，有六十倍的，有三十倍的。', ref: '马太福音 13:23' },
      '种芥菜的': { text: '天国好像一粒芥菜种，有人拿去种在田里。', ref: '马太福音 13:31' },
      '芥菜种': { text: '这原是百种里最小的，等到长起来，却比各样的菜都大。', ref: '马太福音 13:32' },
      '芥菜树': { text: '且成了树，天上的飞鸟来宿在它的枝上。', ref: '马太福音 13:32' },
      '宝贝': { text: '天国好像宝贝藏在地里，人遇见了就把它藏起来，欢欢喜喜地去变卖一切所有的，买这块地。', ref: '马太福音 13:44' },
      '遇见宝贝的人': { text: '人遇见了就把它藏起来，欢欢喜喜地去变卖一切所有的，买这块地。', ref: '马太福音 13:44' },
      '牛': { text: '天国好像宝贝藏在地里，人遇见了就把它藏起来。', ref: '马太福音 13:44' },
      '买卖人': { text: '天国又好像买卖人寻找好珠子，', ref: '马太福音 13:45' },
      '重价的珠子': { text: '遇见一颗重价的珠子，就去变卖他一切所有的，买了这颗珠子。', ref: '马太福音 13:46' },
      '律法师': { text: '有一个律法师起来试探耶稣，说：「夫子！我该做什么才可以承受永生？」', ref: '路加福音 10:25' },
      '下耶利哥的路': { text: '有一个人从耶路撒冷下耶利哥去，落在强盗手中。', ref: '路加福音 10:30' },
      '耶路撒冷': { text: '有一个人从耶路撒冷下耶利哥去，落在强盗手中。', ref: '路加福音 10:30' },
      '落在强盗手中的人': { text: '他们剥去他的衣裳，把他打个半死，就丢下他走了。', ref: '路加福音 10:30' },
      '祭司': { text: '偶然有一个祭司从这条路下来，看见他就从那边过去了。', ref: '路加福音 10:31' },
      '利未人': { text: '又有一个利未人来到这地方，看见他，也照样从那边过去了。', ref: '路加福音 10:32' },
      '撒马利亚人': { text: '惟有一个撒马利亚人行路来到那里，看见他就动了慈心。', ref: '路加福音 10:33' },
      '牲口': { text: '上前用油和酒倒在他的伤处，包裹好了，扶他骑上自己的牲口，带到店里去照应他。', ref: '路加福音 10:34' },
      '店': { text: '扶他骑上自己的牲口，带到店里去照应他。', ref: '路加福音 10:34' },
      '店主': { text: '第二天拿出二钱银子来，交给店主，说：『你且照应他；此外所费用的，我回来必还你。』', ref: '路加福音 10:35' },
      '马大': { text: '马大伺候的事多，心里忙乱。', ref: '路加福音 10:40' },
      '马利亚': { text: '她有一个妹子，名叫马利亚，在耶稣脚前坐着听他的道。', ref: '路加福音 10:39' },
      '灶': { text: '马大伺候的事多，心里忙乱，就进前来。', ref: '路加福音 10:40' },
      '半夜借饼的人': { text: '你们中间谁有一个朋友半夜到他那里去，说：『朋友！请借给我三个饼。』', ref: '路加福音 11:5' },
      '朋友': { text: '但因他情词迫切地直求，就必起来照他所需用的给他。', ref: '路加福音 11:8' },
      '朋友的家': { text: '寻找，就寻见；叩门，就给你们开门。', ref: '路加福音 11:9' },
      '财主': { text: '有一个财主田产丰盛；自己心里思想说：『我的出产没有地方收藏，怎么办呢？』', ref: '路加福音 12:16–17' },
      '财主的田': { text: '有一个财主田产丰盛。', ref: '路加福音 12:16' },
      '仓房': { text: '要把我的仓房拆了，另盖更大的，在那里好收藏我一切的粮食和财物。', ref: '路加福音 12:18' },
      '灯': { text: '无知的人哪，今夜必要你的灵魂；你所预备的要归谁呢？', ref: '路加福音 12:20' },
      '大筵席': { text: '有一人摆设大筵席，请了许多客。', ref: '路加福音 14:16' },
      '家主': { text: '家主就动怒，对仆人说：『快出去，到城里大街小巷，领那贫穷的、残废的、瞎眼的、瘸腿的来。』', ref: '路加福音 14:21' },
      '仆人': { text: '仆人说：『主啊，你所吩咐的已经办了，还有空座。』', ref: '路加福音 14:22' },
      '所请的人': { text: '众人一口同音地推辞。', ref: '路加福音 14:18' },
      '贫穷的、残废的、瞎眼的、瘸腿的': { text: '快出去，到城里大街小巷，领那贫穷的、残废的、瞎眼的、瘸腿的来。', ref: '路加福音 14:21' },
      '路上和篱笆那里的人': { text: '你出去到路上和篱笆那里，勉强人进来，坐满我的屋子。', ref: '路加福音 14:23' },
      '税吏和罪人': { text: '众税吏和罪人都挨近耶稣，要听他讲道。', ref: '路加福音 15:1' },
      '法利赛人和文士': { text: '法利赛人和文士私下议论说：「这个人接待罪人，又同他们吃饭。」', ref: '路加福音 15:2' },
      '九十九只羊': { text: '不把这九十九只撇在旷野、去找那失去的羊，直到找着呢？', ref: '路加福音 15:4' },
      '失去的羊': { text: '找着了，就欢欢喜喜地扛在肩上，回到家里。', ref: '路加福音 15:5' },
      '找羊的人': { text: '你们中间谁有一百只羊失去一只，不把这九十九只撇在旷野、去找那失去的羊，直到找着呢？', ref: '路加福音 15:4' },
      '旷野': { text: '不把这九十九只撇在旷野、去找那失去的羊，直到找着呢？', ref: '路加福音 15:4' },
      '朋友邻舍': { text: '就请朋友邻舍来，对他们说：『我失去的羊已经找着了，你们和我一同欢喜吧！』', ref: '路加福音 15:6' },
      '妇人': { text: '或是一个妇人有十块钱，若失落一块，岂不点上灯，打扫屋子，细细地找，直到找着吗？', ref: '路加福音 15:8' },
      '妇人的屋子': { text: '岂不点上灯，打扫屋子，细细地找，直到找着吗？', ref: '路加福音 15:8' },
      '失落的那块钱': { text: '我失落的那块钱已经找着了，你们和我一同欢喜吧！', ref: '路加福音 15:9' },
      '神的使者': { text: '我告诉你们，一个罪人悔改，在神的使者面前也是这样为他欢喜。', ref: '路加福音 15:10' },
      '父亲': { text: '相离还远，他父亲看见，就动了慈心，跑去抱着他的颈项，连连与他亲嘴。', ref: '路加福音 15:20' },
      '小儿子': { text: '因为我这个儿子是死而复活，失而又得的。', ref: '路加福音 15:24' },
      '大儿子': { text: '儿啊！你常和我同在，我一切所有的都是你的。', ref: '路加福音 15:31' },
      '马大的家': { text: '有一个女人，名叫马大，接他到自己家里。', ref: '路加福音 10:38' },
      '大儿子的田': { text: '那时，大儿子正在田里。', ref: '路加福音 15:25' },
      '父家': { text: '我要起来，到我父亲那里去。', ref: '路加福音 15:18' },
      '远方': { text: '既耗尽了一切所有的，又遇着那地方大遭饥荒，就穷苦起来。', ref: '路加福音 15:14' },
      '猪': { text: '他恨不得拿猪所吃的豆荚充饥，也没有人给他。', ref: '路加福音 15:16' },
    },
  });
})(window.GS);
