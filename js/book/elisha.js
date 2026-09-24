/* ─────────────────────────────────────────────────────────────
 * book/elisha.js —— 列王纪下 · 以利沙（列王纪下 1 — 13）
 *
 * 以利亚正坐在山顶上；王的五十夫长上来，火从天上降下——「岂因以色列中没有神吗？」
 * 以利亚与以利沙从耶利哥往约旦河去，外衣打水，水就左右分开；二人走干地而过。
 * 黄昏，忽有火车火马将二人隔开，以利亚乘旋风升天，外衣从天上飘落（本卷的第一幅大画）。
 * 以利沙拾起外衣，打水——「耶和华以利亚的神在哪里呢？」水也左右分开；耶利哥的水源被盐治好。
 * 以东的旷野：三王的营，弹琴的，谷中满处挖沟；夜过去，水从以东而来，日光照在水上，水红如血。
 * 寡妇的器皿一个一个倒满了油；二十个大麦饼，众人吃了还剩下。书念妇人墙上的小楼，
 * 孩子晌午死了，神人伏在他身上，身体渐渐温和，打了七个喷嚏，睁开眼睛。
 * 乃缦的车马停在门前，他在约旦河里沐浴七回，肉复原如小孩子。砍树的人斧头落水，木头抛下，斧头漂上来。
 * 多坍：夜里亚兰的车马军兵围困了城；清早，少年人的眼目被开——满山有火车火马围绕以利沙（本卷的第二幅大画）。
 * 撒马利亚被围；黄昏，主使亚兰人听见车马的声音，他们撇下帐棚逃命；次日城门口细面、大麦贱卖。
 * 少年先知把膏油倒在耶户头上，衣服铺在台阶上，车赶得甚猛，巴力的柱像烧毁。
 * 夜里殿中的灯没有熄灭：约阿施藏在耶和华的殿里六年，七岁戴上冠冕；柜盖上钻了窟窿。
 * 以利沙病重，王开朝东的窗户，射出耶和华的得胜箭，直飞向初升的日头；以利沙的坟墓，
 * 死人一碰着他的骸骨就复活站起——神仍施恩给以色列人。
 *
 * 画面的方位：左 = 约旦河东（旋风升天、基列的拉末）；约旦河自近地的地脊（上游）流到画面底（下游）；
 *            右 = 河西（耶利哥、书念、多坍、撒马利亚、耶路撒冷的殿……每一句话换一处布景）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU } = U;
  const ACT = 'elisha';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('esPart', 'exp', 1.1);      // 约旦河的水左右分开（2:8，2:14）
  W.defineLevel('esWhirl', 'exp', 0.55);    // 旋风（2:11）
  W.defineLevel('esGlory', 'exp', 0.45);    // 以利亚升天之处，天开的光
  W.defineLevel('esBeam', 'exp', 0.8);      // 自天落在人身上的光
  W.defineLevel('esScorch', 'exp', 0.3);    // 天火落下之处的余烬（1:10）
  W.defineLevel('esSpring', 'exp', 0.4);    // 耶利哥的水源被治好（2:21）
  W.defineLevel('esDitch', 'lin', 0.17);    // 谷中满处挖沟（3:16）
  W.defineLevel('esFill', 'lin', 0.2);      // 遍地就满了水（3:20）
  W.defineLevel('esRed', 'exp', 0.35);      // 日光照在水上，水红如血（3:22）
  W.defineLevel('esOil', 'lin', 0.95);      // 倒满了油的器皿（个数，4:6）
  W.defineLevel('esWarm', 'exp', 0.3);      // 孩子的身体渐渐温和（4:34）
  W.defineLevel('esGrief', 'exp', 0.35);    // 晌午的阴影（4:20）
  W.defineLevel('esClean', 'exp', 0.7);     // 乃缦洁净了（5:14）
  W.defineLevel('esAxe', 'exp', 0.9);       // 斧头漂上来（6:6）
  W.defineLevel('esHost', 'exp', 0.6);      // 亚兰的车马军兵（6:14）
  W.defineLevel('esFire', 'lin', 0.2);      // 满山有火车火马（6:17）
  W.defineLevel('esBlind', 'exp', 0.5);     // 眼目昏迷（6:18）
  W.defineLevel('esRumble', 'exp', 0.9);    // 车马的声音（7:6）
  W.defineLevel('esLamp', 'exp', 0.4);      // 永远赐灯光（8:19）
  W.defineLevel('esEcho', 'exp', 0.35);     // 以色列的战车马兵（13:14，天上的回声）
  W.defineLevel('esGrace', 'exp', 0.3);     // 仍施恩给以色列人（13:23）
  W.defineLevel('esSpirit', 'exp', 0.6);    // 耶和华的灵降在以利沙身上（3:15）
  const LEVELS0 = ['esPart', 'esWhirl', 'esGlory', 'esBeam', 'esScorch', 'esSpring', 'esDitch', 'esFill', 'esRed', 'esOil', 'esWarm', 'esGrief',
    'esClean', 'esAxe', 'esHost', 'esFire', 'esBlind', 'esRumble', 'esLamp', 'esEcho', 'esGrace', 'esSpirit'];

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    jT: 0.628, jB: 0.598, partV: 0.5,          // 约旦河：上游 → 下游；过河之处的纵深
    knoll: 0.775, samFar: 0.925,                // 1：山顶；远处的撒马利亚（中丘）
    jericho: 0.872, spring: 0.768, springV: 0.5,
    elijahE: 0.53, elishaE: 0.562,              // 河东：二人站住之处（以利亚在左，以利沙在右）
    mantle: 0.545, mantleV: 0.58,                // 外衣落地之处
    house: 0.868, dothan: 0.815, samaria: 0.878, temple: 0.862, tomb: 0.895,
  };
  const ROBE = {
    elijah: [96, 72, 52], elisha: [112, 118, 146], mantle: [104, 78, 56], captain: [120, 74, 62], soldier: [96, 70, 62],
    son: [138, 122, 98], widow: [118, 92, 108], shun: [164, 108, 90], husband: [134, 118, 92], gehazi: [124, 110, 84],
    naaman: [158, 58, 50], aram: [70, 58, 56], king: [112, 72, 124], jehu: [92, 104, 150], youth: [140, 126, 100],
    priest: [236, 230, 212], joash: [214, 176, 96], nurse: [150, 120, 108], leper: [196, 190, 176],
  };
  const GOLD = [236, 196, 110], FIRE = [255, 170, 80], PALE = [255, 246, 222];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { mantle: 'elijah', beam: null, spirit: null, harp: false, leper: false, dips: 0, wade: null, axe: 'none',
      crown: null, bow: false, torches: false, strewn: false };
  }

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
  const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const ease = t => { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const rgba = (c, a) => U.rgba(c[0] | 0, c[1] | 0, c[2] | 0, a);

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(2211); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function place(id, x, layer) { if (fig(id)) C().place(id, x, layer); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function unfollow(id) { const f = fig(id); if (f) f.follow = null; }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function fly(id, x, y, o) { const c = C(); if (c.fly && fig(id)) c.fly(id, x, y, o); }
  function carry(id, what) { const c = C(); if (c.carry && fig(id)) c.carry(id, what); }
  function propOf(id, what) { const c = C(); if (c.prop && fig(id)) c.prop(id, what); }
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function crowdProp(gid, what) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.prop = what || null; }); }
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
  // 地上的走兽绕开主要人物与布景所在的几段
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
    return [x, y - PH(l) * (f.age === 'elder' ? 0.96 : f.age === 'child' ? 0.62 : 1) * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  function nameHere(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const size = (o.size || 0.042) * M(), n = Array.from(str).length;
    const c = nameAt(x, y - size * 0.9, size, n);
    const src = o.src || (() => [x + rand(-60, 60) * SU(), y + rand(-20, 30) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 2.6, delay: o.delay });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx() && isFinite(x) && isFinite(y)) fx().dust(x, y, n || 20, rgb || [214, 184, 140], spread || 14, 'near'); }
  function ringOn(b, id, frac, rgb, r, dur) { const p = figPt(id, frac); if (p) ringAt(b, p[0], p[1], rgb, r, dur); }
  function sparkOn(b, id, frac, n, rgb, spread) { const p = figPt(id, frac); if (p) sparkAt(b, p[0], p[1], n, rgb, spread); }
  function shake(b, v) { if (!b.instant) W.shake = Math.max(W.shake || 0, v); }
  function flash(b, v) { if (!b.instant) W.flash = Math.max(W.flash || 0, v); }

  // ── 装饰性的补间（只关乎画面；瞬间重演时不存在）───────────────
  const TW = {};
  function tween(b, name, dur, data) { if (b.instant) { delete TW[name]; return; } TW[name] = { t0: W.t, dur: Math.max(0.05, dur / (W.fast || 1)), data: data || null }; }
  function tk(name) { const q = TW[name]; if (!q) return -1; const k = (W.t - q.t0) / q.dur; return k > 1 ? -1 : Math.max(0, k); }
  const twData = name => (TW[name] ? TW[name].data : null);

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.8, grow: 0.5, lit: 0.6, fire: 0.45, open: 0.9, fall: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, { x, layer, v, size, label, flip, show, grow, lit, fire, open, fall, tx, spd, rgb, style, n, x1, v1, hw, wh })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, v: 0, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02, flip: 1, ph: 0 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'v', 'size', 'label', 'spd', 'flip', 'rgb', 'style', 'n', 'x1', 'v1', 'hw', 'wh', 'town', 'gate']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.tx != null) p.tx = o.tx;
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
  const ORDER = { field: -6, ditch: -5, spring: -4, samfar: -3, tomb: -1, knoll: -2, temple: 0, city: 0, house: 0, tent: 1, palm: 2, tree: 2, altar: 3,
    stair: 3, pillar: 3, chest: 4, jars: 4, loaves: 4, beams: 4, sacks: 4, cloths: 4, chariot: 6 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || (a.v || 0) - (b.v || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }
  const baseOf = p => (p.layer === 2 ? fieldY(p.x, p.v || 0) : gY(p.layer, p.x));

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
  let SP = null;
  function cnv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
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
        warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
        pale: radial([226, 240, 255], 1), smoke: radial([120, 112, 106], 0.8, 0.55), ember: radial([255, 120, 50], 1, 0.4),
        fire: radial([255, 150, 60], 1, 0.3), water: radial([170, 220, 246], 1), dust: radial([178, 150, 116], 0.85, 0.55),
        red: radial([236, 80, 56], 1), blue: radial([150, 180, 230], 1, 0.5), mist: radial([200, 206, 214], 0.9, 0.6),
      };
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
      // 自天而降的火柱（1:10）
      const f = cnv(64, 256), h = f.getContext('2d');
      const fz = h.createLinearGradient(0, 0, 64, 0);
      fz.addColorStop(0, 'rgba(255,120,40,0)'); fz.addColorStop(0.3, 'rgba(255,150,60,0.9)'); fz.addColorStop(0.5, 'rgba(255,242,200,1)');
      fz.addColorStop(0.7, 'rgba(255,150,60,0.9)'); fz.addColorStop(1, 'rgba(255,120,40,0)');
      h.fillStyle = fz; h.fillRect(0, 0, 64, 256);
      h.globalCompositeOperation = 'destination-in';
      const fv = h.createLinearGradient(0, 0, 0, 256);
      fv.addColorStop(0, 'rgba(0,0,0,0.2)'); fv.addColorStop(0.85, 'rgba(0,0,0,1)'); fv.addColorStop(1, 'rgba(0,0,0,0.6)');
      h.fillStyle = fv; h.fillRect(0, 0, 64, 256);
      SP.firecol = f;
    } catch (e) { SP = null; }
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (!sp || a < 0.004 || r < 0.5 || !isFinite(x) || !isFinite(y)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }

  // ── 火、烟、灯 ────────────────────────────────────────────────
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    if (SP) glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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
  function smoke(ctx, x, y, k, H, w, seed) {
    if (k < 0.01 || !SP) return;
    const N = 9, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.8);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 一束火舌（自 (x, y) 顺着 (dx, dy) 方向飘出）
  function tongue(ctx, x, y, len, dx, dy, w) {
    const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const ex = x + ux * len, ey = y + uy * len;
    ctx.moveTo(x + nx * w, y + ny * w);
    ctx.quadraticCurveTo(x + ux * len * 0.5 + nx * w * 1.1, y + uy * len * 0.5 + ny * w * 1.1, ex, ey);
    ctx.quadraticCurveTo(x + ux * len * 0.45 - nx * w * 0.9, y + uy * len * 0.45 - ny * w * 0.9, x - nx * w, y - ny * w);
    ctx.closePath();
  }

  // ════════════════════════════════════════════════════════════
  //  约旦河：自近地的地脊（上游、远）流到画面底（下游、近）；外衣打水，水就左右分开
  // ════════════════════════════════════════════════════════════
  let RV = null;
  function rv() {
    const k = W.w + 'x' + W.h;
    if (RV && RV.k === k) return RV;
    const x0 = X.jT * W.w, y0 = Math.min(W.ridgeBaseY(2, x0), W.h * 0.97) + 0.5, x3 = X.jB * W.w, y3 = W.h + 8;
    RV = { k, x0, y0, x3, y3, x1: lerp(x0, x3, 0.3) + 0.014 * W.w, y1: lerp(y0, y3, 0.33), x2: lerp(x0, x3, 0.66) - 0.012 * W.w, y2: lerp(y0, y3, 0.68), peb: null };
    return RV;
  }
  function rPt(t) {
    const R = rv(), u = 1 - t;
    const px = u * u * u * R.x0 + 3 * u * u * t * R.x1 + 3 * u * t * t * R.x2 + t * t * t * R.x3;
    const py = u * u * u * R.y0 + 3 * u * u * t * R.y1 + 3 * u * t * t * R.y2 + t * t * t * R.y3;
    const dx = 3 * u * u * (R.x1 - R.x0) + 6 * u * t * (R.x2 - R.x1) + 3 * t * t * (R.x3 - R.x2);
    const dy = 3 * u * u * (R.y1 - R.y0) + 6 * u * t * (R.y2 - R.y1) + 3 * t * t * (R.y3 - R.y2);
    const L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const rHW = t => (0.16 + 1.1 * Math.pow(Math.max(0, t), 1.15)) * PH(2);
  function tAtY(y) {
    let a = 0, b = 1;
    for (let i = 0; i < 16; i++) { const m = (a + b) / 2; if (rPt(m)[1] < y) a = m; else b = m; }
    return (a + b) / 2;
  }
  // 纵深 v 处河心 / 河岸的横坐标（比例）；side −1 = 河东（左）岸，+1 = 河西（右）岸
  function riverAtV(v, side) {
    const y = lerp(rv().y0, W.h, 0.8 * v), t = tAtY(y), p = rPt(t);
    if (!side) return p[0] / W.w;
    return (p[0] + side * rHW(t) * 1.05) / W.w;
  }
  const westEdge = v => riverAtV(v, 1) + 0.012;
  const eastEdge = v => riverAtV(v, -1) - 0.012;
  function riverPath(ta, tb, mul_, add_) {
    const N = 22, Lp = [], Rp = [];
    for (let i = 0; i <= N; i++) {
      const t = lerp(ta, tb, i / N), p = rPt(t), w = rHW(t) * mul_ + add_ * (0.3 + t);
      Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]);
    }
    const P2 = new Path2D();
    Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
    for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
    P2.closePath();
    return P2;
  }
  // 分开之处：t 的两端
  function partSpan() {
    const k = W.lv.esPart;
    if (k < 0.01) return null;
    const yc = fieldY(X.jT, X.partV), gp = k * PH(2) * 0.5;
    return [tAtY(yc - gp), tAtY(yc + gp), k];
  }
  let RPC = { key: '', bank: null, bed: null, segs: null };
  function drawJordan(ctx) {
    const R = rv(), s = LS(2), sp = partSpan();
    const key = R.k + ':' + (sp ? Math.round(sp[0] * 400) + ',' + Math.round(sp[1] * 400) : '-');
    if (RPC.key !== key) {
      RPC.key = key;
      if (!RPC.bank || RPC.bk !== R.k) { RPC.bank = riverPath(0, 1, 1.55, 5 * s); RPC.bed = riverPath(0, 1, 1.02, 0); RPC.bk = R.k; }
      RPC.segs = sp ? [riverPath(0, sp[0], 1, 0), riverPath(sp[1], 1, 1, 0)] : [riverPath(0, 1, 1, 0)];
    }
    // 泥滩与芦苇的岸
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = css([132, 116, 84], 2);
    ctx.fill(RPC.bank);
    ctx.globalAlpha = 1;
    ctx.fillStyle = css([126, 110, 86], 2);
    ctx.fill(RPC.bed);
    // 分开之处露出的河床：湿的卵石
    if (sp) {
      if (!R.peb) { R.peb = []; for (let i = 0; i < 40; i++) R.peb.push([rt(i * 3 + 11), rt(i * 3 + 12) * 2 - 1, 0.6 + rt(i * 3 + 13)]); }
      ctx.fillStyle = css([98, 88, 76], 2);
      ctx.beginPath();
      for (const q of R.peb) {
        const t = lerp(sp[0], sp[1], q[0]), p = rPt(t), w = rHW(t) * 0.85 * q[1], r = (0.8 + 1.6 * t) * s * q[2];
        const x = p[0] + p[2] * w, y = p[1] + p[3] * w;
        ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.55, 0, 0, TAU);
      }
      ctx.fill();
    }
    // 水
    const night = W.night > 0.5;
    const red = W.lv.esRed * 0.35;
    const top = mix3(W.shade([150, 190, 206], 0.4, 0.05), [210, 120, 90], red), bot = mix3(W.shade([40, 94, 118], 0, 0.02), [140, 60, 50], red);
    const gr = ctx.createLinearGradient(0, R.y0, 0, W.h);
    gr.addColorStop(0, U.rgb(top[0] | 0, top[1] | 0, top[2] | 0)); gr.addColorStop(1, U.rgb(bot[0] | 0, bot[1] | 0, bot[2] | 0));
    ctx.globalAlpha = 0.93;
    ctx.fillStyle = gr;
    for (const P2 of RPC.segs) ctx.fill(P2);
    ctx.globalAlpha = 1;
    // 天光的倒影
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = night ? 0.3 * W.lv.moon : 0.42 * W.daylight;
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba(gc, 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        let any = false;
        for (let i = band; i < 30; i += 3) {
          const t = U.fract(rt(i * 5 + 700) + W.t * 0.03 * (0.7 + 0.6 * rt(i * 5 + 701)));
          if (t < 0.03 || (sp && t > sp[0] - 0.01 && t < sp[1] + 0.01)) continue;
          const p = rPt(t), w = rHW(t) / 2, off = (rt(i * 5 + 702) * 2 - 1) * 0.8 * w, len = w * (0.25 + 0.35 * rt(i * 5 + 703));
          const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off;
          ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
          any = true;
        }
        if (!any) continue;
        ctx.globalAlpha = ga * (0.35 + 0.3 * band) * (0.6 + 0.4 * Math.sin(W.t * (0.7 + band * 0.37) + band * 2.1));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 分开的水：两道立起的水墙，边上发光
    if (sp) {
      const k = sp[2];
      for (const [t, dir] of [[sp[0], -1], [sp[1], 1]]) {
        const p = rPt(t), w = rHW(t) * 1.02, hgt = PH(2) * 0.42 * k;
        const x0 = p[0] + p[2] * w, y0 = p[1] + p[3] * w, x1 = p[0] - p[2] * w, y1 = p[1] - p[3] * w;
        // 水墙的面（上游的水墙面朝下游，看得见它的面；下游的水墙只见顶）
        const face = dir < 0 ? hgt * 1.35 : hgt * 0.4;
        const wg = ctx.createLinearGradient(0, y0 - face, 0, y0 + 2);
        const c1 = W.shade([120, 176, 200], 0.2, 0.1), c2 = W.shade([46, 104, 128], 0, 0.05);
        wg.addColorStop(0, rgba(c1, 0.95)); wg.addColorStop(1, rgba(c2, 0.95));
        ctx.fillStyle = wg;
        ctx.beginPath();
        ctx.moveTo(x0, y0 + 1);
        for (let i = 0; i <= 8; i++) {
          const f = i / 8, x = lerp(x0, x1, f), y = lerp(y0, y1, f) - face * (0.75 + 0.25 * Math.sin(f * Math.PI)) + Math.sin(W.t * 5 + i * 1.3) * 0.8 * s;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(x1, y1 + 1);
        ctx.closePath(); ctx.fill();
        // 顶上的白沫与光
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = rgba([232, 244, 255], 0.65 * k * (0.5 + 0.5 * dayA()));
        ctx.lineWidth = Math.max(1, 1.6 * s);
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const f = i / 8, x = lerp(x0, x1, f), y = lerp(y0, y1, f) - face * (0.75 + 0.25 * Math.sin(f * Math.PI)) + Math.sin(W.t * 5 + i * 1.3) * 0.8 * s;
          if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
        if (SP) glowSp(ctx, SP.water, (x0 + x1) / 2, (y0 + y1) / 2 - face * 0.6, Math.abs(x1 - x0) * 0.9, 0.25 * k);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 两岸的芦苇
    ctx.strokeStyle = css([96, 120, 66], 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const ws = W.wind * 1.5 * s;
    const nR = (W.quality || 1) < 0.75 ? 24 : 44;
    for (let i = 0; i < nR; i++) {
      const t = 0.05 + 0.92 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = rPt(t), w = rHW(t) * 1.25 + 2 * s;
      if (sp && t > sp[0] - 0.02 && t < sp[1] + 0.02) continue;
      const x = p[0] + p[2] * w * side, y = p[1] + p[3] * w * side, h = (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t);
      const sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
    }
    ctx.stroke();
  }
  // 站在水里的人：脚下一圈圈的涟漪（在人之前画）
  function drawRipples(ctx) {
    if (!S.wade) return;
    const p = figPt(S.wade, 0);
    if (!p) return;
    const s = LS(2);
    ctx.strokeStyle = rgba([226, 240, 250], 0.5 * dayA());
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    for (let i = 0; i < 3; i++) {
      const k = U.fract(W.t * 0.45 + i / 3), r = (5 + 18 * k) * s;
      ctx.globalAlpha = (1 - k) * 0.8;
      ctx.beginPath(); ctx.ellipse(p[0], p[1], r, r * 0.3, 0, 0, TAU); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 水面盖住人的小腿（在人之后画）
  function drawWaterLine(ctx) {
    if (!S.wade) return;
    const f = fig(S.wade), p = figPt(S.wade, 0);
    if (!f || !p) return;
    const s = LS(2), h = f._h || PH(2), low = f.pose === 'kneel' || f.pose === 'pray' || f.pose === 'bow';
    const depth = h * (low ? 0.24 : 0.13), w = h * 0.3;
    const c = W.shade([64, 120, 142], 0, 0.05);
    ctx.fillStyle = rgba(c, 0.9);
    ctx.beginPath(); ctx.ellipse(p[0], p[1] - depth * 0.3, w, depth * 0.7, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba([236, 246, 252], 0.6 * dayA());
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.ellipse(p[0], p[1] - depth * 0.3, w, depth * 0.7, 0, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  马与车：人高约 30 单位；马面向 +x，原点在地面（前后蹄之间）
  // ════════════════════════════════════════════════════════════
  const BODY = (() => { const a = []; for (let i = 0; i < 16; i++) { const t = i / 16 * TAU; a.push([Math.cos(t) * 13, -18 + Math.sin(t) * 5.8]); } return a; })();
  const LEGS = [[-10, -17, 0, 0], [-7.5, -17, Math.PI * 0.85, 0], [8.2, -16, Math.PI * 0.35, 1], [10.6, -16, Math.PI * 1.3, 1]];
  // 马身（身、颈、头）加入当前路径
  function horseBody(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2, n = gait * Math.sin(ph * 2 + 0.6) * 1.2 - (1 - gait) * 0.8;
    const X_ = u => x + d * u * k, Y_ = v => y + (v + bob) * k;
    ctx.moveTo(X_(BODY[0][0]), Y_(BODY[0][1]));
    for (let i = 1; i < BODY.length; i++) ctx.lineTo(X_(BODY[i][0]), Y_(BODY[i][1]));
    ctx.closePath();
    ctx.moveTo(X_(6), Y_(-21));
    ctx.quadraticCurveTo(X_(10.5), Y_(-28 + n), X_(14.5), Y_(-32.5 + n));
    ctx.lineTo(X_(15.6), Y_(-35.4 + n)); ctx.lineTo(X_(16.9), Y_(-32.2 + n));
    ctx.quadraticCurveTo(X_(20.6), Y_(-29.4 + n), X_(23.2), Y_(-25.6 + n));
    ctx.lineTo(X_(22.2), Y_(-23.6 + n));
    ctx.quadraticCurveTo(X_(19.4), Y_(-24.2 + n), X_(16.6), Y_(-25.2 + n));
    ctx.quadraticCurveTo(X_(14.2), Y_(-20), X_(12.6), Y_(-14.6));
    ctx.lineTo(X_(7.5), Y_(-14.2));
    ctx.closePath();
  }
  function horseLegs(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2;
    for (const L of LEGS) {
      const sw = Math.sin(ph + L[2]);
      const a1 = (L[3] ? 0.08 : -0.08) + gait * (L[3] ? 0.7 : 0.55) * sw;
      const bend = gait * Math.max(0, Math.cos(ph + L[2])) * (L[3] ? -1.3 : 0.9);
      const kx = L[0] + Math.sin(a1) * 8.6, ky = L[1] + bob + Math.cos(a1) * 8.6;
      const a2 = a1 + bend;
      const hx = kx + Math.sin(a2) * 8.8, hy = ky + Math.cos(a2) * 8.8;
      ctx.moveTo(x + d * L[0] * k, y + (L[1] + bob) * k); ctx.lineTo(x + d * kx * k, y + ky * k); ctx.lineTo(x + d * hx * k, y + hy * k);
    }
  }
  function horseMane(ctx, x, y, k, d, ph, gait) {
    const bob = -gait * Math.abs(Math.sin(ph)) * 1.2, n = gait * Math.sin(ph * 2 + 0.6) * 1.2 - (1 - gait) * 0.8;
    const X_ = u => x + d * u * k, Y_ = v => y + (v + bob) * k;
    ctx.moveTo(X_(6.5), Y_(-22)); ctx.quadraticCurveTo(X_(9.5), Y_(-29 + n), X_(14), Y_(-33 + n));
    const tw = Math.sin(W.t * 4 + ph) * 1.5;
    ctx.moveTo(X_(-12.5), Y_(-20)); ctx.quadraticCurveTo(X_(-17), Y_(-18 + tw * 0.3), X_(-19 - gait * 3), Y_(-11 - gait * 5 + tw));
  }
  // 一辆车（两匹马）；style：{ horse, horse2, leg, car, wheel, rim }（颜色）或 'fire'
  function chariotUnit(ctx, x, y, k, d, ph, gait, style, a, noCar) {
    if (a < 0.01) return;
    const fire = style === 'fire';
    const lw = Math.max(0.6, 2.3 * k);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (fire) ctx.globalCompositeOperation = 'lighter';
    // 远处的马
    const fx2 = x + d * 3.2 * k, fy2 = y - 1.6 * k, ph2 = ph + 0.9;
    ctx.globalAlpha = a * (fire ? 0.55 : 1);
    ctx.strokeStyle = fire ? 'rgb(230,110,40)' : style.horse2;
    ctx.lineWidth = lw * 0.9;
    ctx.beginPath(); horseLegs(ctx, fx2, fy2, k, d, ph2, gait); ctx.stroke();
    ctx.fillStyle = fire ? 'rgb(230,110,40)' : style.horse2;
    ctx.beginPath(); horseBody(ctx, fx2, fy2, k, d, ph2, gait); ctx.fill();
    // 车
    if (!noCar) {
      const wx = x - d * 24 * k, wy = y - 7.4 * k, r = 7.4 * k;
      ctx.globalAlpha = a * (fire ? 0.85 : 1);
      ctx.strokeStyle = fire ? 'rgb(255,190,90)' : style.leg;
      ctx.lineWidth = Math.max(0.6, 1.4 * k);
      ctx.beginPath(); ctx.moveTo(x - d * 17 * k, y - 11 * k); ctx.quadraticCurveTo(x - d * 4 * k, y - 13 * k, x + d * 6 * k, y - 17 * k); ctx.stroke();
      ctx.fillStyle = fire ? 'rgb(255,176,80)' : style.car;
      ctx.beginPath();
      ctx.moveTo(x - d * 31 * k, y - 9.5 * k); ctx.lineTo(x - d * 17.5 * k, y - 9.5 * k);
      ctx.quadraticCurveTo(x - d * 15.2 * k, y - 16 * k, x - d * 18 * k, y - 21.5 * k);
      ctx.lineTo(x - d * 20.5 * k, y - 21 * k); ctx.quadraticCurveTo(x - d * 19 * k, y - 16.5 * k, x - d * 24 * k, y - 15.5 * k);
      ctx.lineTo(x - d * 31 * k, y - 15 * k); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = fire ? 'rgb(255,214,130)' : style.wheel;
      ctx.lineWidth = Math.max(0.6, 1.3 * k);
      ctx.beginPath(); ctx.arc(wx, wy, r, 0, TAU); ctx.stroke();
      ctx.lineWidth = Math.max(0.4, 0.7 * k);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) { const an = -ph * 0.7 * d + (i / 3) * Math.PI; ctx.moveTo(wx - Math.cos(an) * r, wy - Math.sin(an) * r); ctx.lineTo(wx + Math.cos(an) * r, wy + Math.sin(an) * r); }
      ctx.stroke();
    }
    // 近处的马
    ctx.globalAlpha = a * (fire ? 0.8 : 1);
    ctx.strokeStyle = fire ? 'rgb(255,150,60)' : style.leg;
    ctx.lineWidth = lw;
    ctx.beginPath(); horseLegs(ctx, x, y, k, d, ph, gait); ctx.stroke();
    ctx.fillStyle = fire ? 'rgb(255,150,60)' : style.horse;
    ctx.beginPath(); horseBody(ctx, x, y, k, d, ph, gait); ctx.fill();
    ctx.strokeStyle = fire ? 'rgb(255,236,190)' : style.rim;
    ctx.lineWidth = Math.max(0.5, (fire ? 1.2 : 0.9) * k);
    ctx.beginPath(); horseMane(ctx, x, y, k, d, ph, gait); ctx.stroke();
    if (fire) {
      // 白热的芯
      ctx.globalAlpha = a * 0.7;
      ctx.strokeStyle = 'rgb(255,242,210)';
      ctx.lineWidth = Math.max(0.5, 0.8 * k);
      ctx.beginPath(); horseBody(ctx, x, y, k, d, ph, gait); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 火车火马：车、马之上的火舌与光
  function fireAura(ctx, x, y, k, d, a, vx, vy, seed) {
    if (a < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.fire, x - d * 6 * k, y - 18 * k, 46 * k, a * 0.5);
    glowSp(ctx, SP.gold, x - d * 4 * k, y - 18 * k, 22 * k, a * 0.35);
    // 火舌向运动的反方向飘
    const bx = -(vx || d * 1), by = -(vy || 0) - 0.9;
    const P_ = [[-28, -20], [-23, -21], [-18, -22], [-8, -24], [-2, -24], [4, -25], [10, -30], [13, -34], [-13, -20]];
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? 'rgba(255,236,180,0.8)' : 'rgba(255,140,50,0.7)';
      ctx.globalAlpha = a * (pass ? 0.6 : 0.8);
      ctx.beginPath();
      for (let i = 0; i < P_.length; i++) {
        const q = P_[i], fl = 0.7 + 0.3 * Math.sin(W.t * (9 + i) + seed + i * 1.7);
        const len = (pass ? 6 : 10) * k * fl, w = (pass ? 1.2 : 2.2) * k;
        tongue(ctx, x + d * q[0] * k, y + q[1] * k, len, bx * 1.2 + Math.sin(W.t * 5 + i) * 0.3, by, w);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 预绘的火车火马（满山的火车火马：远近多辆，每辆只画一张图）
  let FIRE_SP = null;
  function fireSprites() {
    if (FIRE_SP) return FIRE_SP;
    try {
      const mk = (ph, noCar, rider) => {
        const k = 2.2, c = cnv(46 * k + 20, 42 * k), g = c.getContext('2d');
        const x = 33 * k, y = 40 * k;
        chariotUnit(g, x, y, k, 1, ph, 0.35, 'fire', 1, noCar);
        if (rider) {
          g.globalCompositeOperation = 'lighter';
          g.fillStyle = 'rgba(255,200,110,0.9)';
          g.beginPath(); g.ellipse(x - 1 * k, y - 29 * k, 2.6 * k, 5.4 * k, 0.15, 0, TAU); g.fill();
          g.beginPath(); g.arc(x + 0.2 * k, y - 36.5 * k, 2.1 * k, 0, TAU); g.fill();
          g.globalCompositeOperation = 'source-over';
        }
        // 火舌（静）
        g.globalCompositeOperation = 'lighter';
        g.fillStyle = 'rgba(255,150,60,0.55)';
        g.beginPath();
        for (let i = 0; i < 9; i++) tongue(g, x + (-26 + i * 4.5) * k, y - (19 + (i > 5 ? 6 : 2)) * k, (7 + 5 * rt(i + 40)) * k, -0.7, -1, 2 * k);
        g.fill();
        g.globalCompositeOperation = 'source-over';
        return { c, k, ox: x, oy: y };
      };
      FIRE_SP = [mk(0.3, false, false), mk(2.1, false, false), mk(1.1, true, true), mk(3.9, true, true)];
    } catch (e) { FIRE_SP = null; }
    return FIRE_SP;
  }
  function drawFireSprite(ctx, i, x, y, k, d, a) {
    const A = fireSprites();
    if (!A || a < 0.01) return;
    const sp = A[i % A.length], sc = k / sp.k;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.translate(x, y);
    ctx.scale(d * sc, sc);
    ctx.drawImage(sp.c, -sp.ox, -sp.oy);
    ctx.restore();
  }
  // 马车的颜色（受光）
  function chariotStyle(kind, l) {
    const C0 = kind === 'naaman' ? [[196, 180, 160], [150, 136, 120], [170, 58, 46], [120, 90, 52], [240, 220, 190]]
      : kind === 'jehu' ? [[120, 92, 70], [92, 70, 56], [110, 118, 160], [100, 76, 50], [230, 206, 170]]
        : [[62, 52, 48], [46, 40, 38], [96, 74, 50], [80, 64, 48], [196, 150, 96]];
    return { horse: css(C0[0], l), horse2: css(C0[1], l), leg: css(mul(C0[0], 0.8), l), car: css(C0[2], l), wheel: css(C0[3], l), rim: css(C0[4], l, 0.8, 0.1) };
  }

  // ════════════════════════════════════════════════════════════
  //  各种布景
  // ════════════════════════════════════════════════════════════
  // ── 小山（以利亚坐在山顶上；多坍城在山上）────────────────────
  function knollG(p) {
    const s = LS(2) * p.size;
    return { s, cx: p.x * W.w, hw: (p.hw || 56) * s, h: (p.wh || 58) * s };
  }
  function knollY(p, xpx) {
    const G = knollG(p), u = (xpx - G.cx) / G.hw;
    const g = gY(2, xpx / W.w) + 3 * G.s;
    if (Math.abs(u) >= 1) return g;
    return g - G.h * Math.pow(1 - u * u, 0.8);
  }
  function knollPt(id, f) { return () => { const p = getP(id); if (!p) return null; const G = knollG(p), x = G.cx + f * G.hw; return [x, knollY(p, x) + 1]; }; }
  function drawKnoll(ctx, p) {
    const G = knollG(p), s = G.s, N = 30;
    const sod = mix3([70, 108, 52], [168, 142, 92], 0.75 * Math.min(1, W.lv.bare || 0));
    ctx.globalAlpha = p.a;
    const top = G.h + 6 * s, gb = gY(2, p.x);
    const gr = ctx.createLinearGradient(0, gb - G.h, 0, gb + 4 * s);
    gr.addColorStop(0, css([138, 124, 100], 2)); gr.addColorStop(0.55, css(mix3([128, 116, 90], sod, 0.5), 2)); gr.addColorStop(1, css(sod, 2));
    ctx.fillStyle = gr;
    ctx.beginPath();
    const x0 = G.cx - G.hw * 1.02, x1 = G.cx + G.hw * 1.02;
    ctx.moveTo(x0, gY(2, x0 / W.w) + 6 * s);
    for (let i = 0; i <= N; i++) { const x = lerp(x0, x1, i / N); ctx.lineTo(x, knollY(p, x)); }
    ctx.lineTo(x1, gY(2, x1 / W.w) + 6 * s);
    ctx.closePath(); ctx.fill();
    // 石与灌木
    ctx.fillStyle = css([92, 84, 72], 2);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const u = rt(p.seed + i) * 1.6 - 0.8, x = G.cx + u * G.hw, y = knollY(p, x) + (2 + 7 * rt(p.seed + 20 + i)) * s, r = (1.4 + 2.2 * rt(p.seed + 40 + i)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.55, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css(mix3([52, 78, 40], sod, 0.3), 2);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const u = rt(p.seed + 60 + i) * 1.8 - 0.9, x = G.cx + u * G.hw, y = knollY(p, x) + 1.5 * s, r = (2 + 2.5 * rt(p.seed + 70 + i)) * s;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y - r * 0.4, r, r * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    // 迎光的一边
    const d = litX() >= G.cx ? 1 : -1;
    ctx.strokeStyle = css([236, 220, 190], 2, 0.45 * dayA(), 0.2);
    ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const u = d > 0 ? i / 12 * 0.9 : -i / 12 * 0.9, x = G.cx + u * G.hw, y = knollY(p, x); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (p.town) drawTown(ctx, p, G);
  }
  // 多坍：山顶的小城
  function townG(p, G) { G = G || knollG(p); const tw = G.hw * 0.46, base = knollY(p, G.cx) + 3 * G.s; return { tw, base, wh: 15 * G.s, gx: G.cx - tw * 0.55 }; }
  function drawTown(ctx, p, G) {
    const s = G.s, Tn = townG(p, G), cx = G.cx, st = [192, 176, 146];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(mul(st, 0.85), 2);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const fx_ = -0.8 + i * 0.32, w = (0.2 + 0.1 * rt(p.seed + i)) * Tn.tw, h = (6 + 9 * rt(p.seed + 10 + i)) * s; ctx.rect(cx + fx_ * Tn.tw - w / 2, Tn.base - Tn.wh - h, w, h + 2); }
    ctx.fill();
    ctx.fillStyle = css(st, 2);
    ctx.beginPath(); ctx.rect(cx - Tn.tw, Tn.base - Tn.wh, Tn.tw * 2, Tn.wh + 4 * s); ctx.fill();
    ctx.beginPath();
    for (let x = cx - Tn.tw; x < cx + Tn.tw - 1; x += 6 * s) ctx.rect(x, Tn.base - Tn.wh - 2.6 * s, 3 * s, 2.8 * s);
    ctx.rect(cx - Tn.tw - 2 * s, Tn.base - Tn.wh * 1.45, 9 * s, Tn.wh * 1.45); ctx.rect(cx + Tn.tw - 7 * s, Tn.base - Tn.wh * 1.45, 9 * s, Tn.wh * 1.45);
    ctx.fill();
    ctx.fillStyle = css([34, 26, 22], 2);
    ctx.beginPath(); ctx.moveTo(Tn.gx - 3.5 * s, Tn.base); ctx.lineTo(Tn.gx - 3.5 * s, Tn.base - 6.5 * s); ctx.arc(Tn.gx, Tn.base - 6.5 * s, 3.5 * s, Math.PI, 0); ctx.lineTo(Tn.gx + 3.5 * s, Tn.base); ctx.fill();
    // 夜里窗中的灯
    const nk = nightK();
    if (nk > 0.05) {
      ctx.fillStyle = rgba([255, 200, 120], 0.75 * nk);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) ctx.rect(cx + (-0.7 + i * 0.33) * Tn.tw, Tn.base - Tn.wh - (4 + 5 * rt(p.seed + 30 + i)) * s, 1.8 * s, 1.8 * s);
      ctx.fill();
    }
    const d = litX() >= cx ? 1 : -1;
    ctx.fillStyle = css([248, 234, 204], 2, 0.3 * dayA(), 0.2);
    ctx.fillRect(d > 0 ? cx + Tn.tw - 7 * s : cx - Tn.tw - 2 * s, Tn.base - Tn.wh * 1.45, 3 * s, Tn.wh * 1.45);
    ctx.globalAlpha = 1;
  }

  // ── 城（耶利哥、撒马利亚）：城墙、城楼、城门、城里的房屋 ─────────
  function cityG(p) {
    const s = LS(p.layer) * p.size, cx = p.x * W.w, base = baseOf(p) + 3 * s;
    const hw = (p.hw || 62) * s, wh = (p.wh || 24) * s;
    return { s, cx, base, hw, wh, gx: cx + (p.gate == null ? -0.5 : p.gate) * hw, top: base - wh };
  }
  function drawCity(ctx, p) {
    const l = p.layer, G = cityG(p), s = G.s, cx = G.cx, base = G.base, hw = G.hw, wh = G.wh;
    const st = p.rgb || [186, 162, 124];
    ctx.globalAlpha = p.a;
    // 城里的房屋（与宫）
    ctx.fillStyle = css(mul(st, 0.84), l);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const fx_ = -0.86 + i * 0.215 + (rt(p.seed + i) - 0.5) * 0.08, w = (0.13 + 0.09 * rt(p.seed + 10 + i)) * hw, h = (0.45 + 0.9 * rt(p.seed + 20 + i)) * wh;
      ctx.rect(cx + fx_ * hw - w / 2, base - wh - h, w, h + 2);
    }
    if (p.style === 'palace') ctx.rect(cx + hw * 0.25, base - wh * 2.35, hw * 0.5, wh * 1.4);
    ctx.fill();
    if (p.style === 'palace') {
      ctx.fillStyle = css(mul(st, 0.92), l);
      ctx.beginPath(); ctx.rect(cx + hw * 0.22, base - wh * 2.45, hw * 0.56, 3 * s); ctx.fill();
    }
    // 城墙
    ctx.fillStyle = css(st, l);
    ctx.beginPath();
    ctx.rect(cx - hw, base - wh, 2 * hw, wh + 3 * s);
    for (let x = cx - hw; x < cx + hw - 1; x += 6.5 * s) ctx.rect(x, base - wh - 3 * s, 3.2 * s, 3.2 * s);
    // 城楼：两端与城门两旁
    const tw = 10 * s, th = wh * 1.45;
    for (const tx of [cx - hw - 2 * s, cx + hw - tw + 2 * s, G.gx - 9 * s - tw / 2, G.gx + 9 * s - tw / 2]) {
      ctx.rect(tx, base - th, tw, th);
      for (let j = 0; j < 2; j++) ctx.rect(tx + j * 6 * s, base - th - 3 * s, 3.4 * s, 3.2 * s);
    }
    ctx.fill();
    // 石缝
    ctx.strokeStyle = css(mul(st, 0.7), l, 0.35);
    ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath();
    for (let j = 1; j < 4; j++) { const y = base - wh + j * wh / 4; ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); }
    ctx.stroke();
    // 城门
    const gw = 5.5 * s, gh = 13 * s, gx = G.gx;
    ctx.fillStyle = css([28, 22, 18], l);
    ctx.beginPath(); ctx.moveTo(gx - gw, base); ctx.lineTo(gx - gw, base - gh); ctx.arc(gx, base - gh, gw, Math.PI, 0); ctx.lineTo(gx + gw, base); ctx.closePath(); ctx.fill();
    if (p.open < 0.98) {
      ctx.fillStyle = css([96, 70, 46], l);
      const o = p.open;
      ctx.fillRect(gx - gw, base - gh, gw * (1 - o), gh);
      ctx.fillRect(gx + gw * o, base - gh, gw * (1 - o), gh);
    }
    if (p.open > 0.02 && SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.warm, gx, base - gh * 0.5, gh * 1.3, p.open * p.a * (0.25 + 0.4 * nightK())); ctx.globalCompositeOperation = 'source-over'; }
    // 夜里窗中的灯
    const nk = nightK() * (0.5 + 0.5 * (1 - (p.dim || 0)));
    if (nk > 0.05) {
      ctx.fillStyle = rgba([255, 200, 120], 0.8 * nk * p.a);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) { const fx_ = -0.8 + i * 0.26, y = base - wh - (3 + 8 * rt(p.seed + 50 + i)) * s; ctx.rect(cx + fx_ * hw, y, 2 * s, 2 * s); }
      ctx.fill();
      if (SP) { ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i += 2) glowSp(ctx, SP.warm, cx + (-0.8 + i * 0.26) * hw, base - wh - 7 * s, 9 * s, 0.25 * nk * p.a); ctx.globalCompositeOperation = 'source-over'; }
    }
    // 迎光的一边
    const d = litX() >= cx ? 1 : -1;
    ctx.fillStyle = css([248, 232, 200], l, 0.3 * dayA(), 0.2);
    ctx.beginPath();
    ctx.rect(d > 0 ? cx + hw - 4 * s : cx - hw - 2 * s, base - th, 3 * s, th);
    ctx.rect(cx - hw, base - wh, 2 * hw, 1.2 * s);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ── 远处中丘上的撒马利亚（第一句：王的窗） ─────────────────────
  function drawSamFar(ctx, p) {
    const l = 1, s = LS(l) * 1.1, cx = p.x * W.w, base = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([176, 164, 140], l);
    ctx.beginPath();
    ctx.rect(cx - 30 * s, base - 12 * s, 60 * s, 14 * s);
    ctx.rect(cx - 24 * s, base - 20 * s, 14 * s, 9 * s); ctx.rect(cx - 6 * s, base - 17 * s, 12 * s, 6 * s);
    ctx.rect(cx + 8 * s, base - 30 * s, 16 * s, 19 * s);
    for (let x = cx - 30 * s; x < cx + 29 * s; x += 5 * s) ctx.rect(x, base - 14 * s, 2.5 * s, 2.4 * s);
    ctx.fill();
    // 王的楼：窗里的灯（1:2 亚哈谢从楼上的栏杆里掉下来，就病了）
    const k = p.lit;
    ctx.fillStyle = rgba([255, 206, 128], 0.9 * k * p.a);
    ctx.fillRect(cx + 14 * s, base - 25 * s, 4 * s, 4 * s);
    if (k > 0.01 && SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.warm, cx + 16 * s, base - 23 * s, 14 * s, 0.6 * k * p.a); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }

  // ── 棕树（耶利哥是棕树城）────────────────────────────────────
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  function drawPalm(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseOf(p) + 1.5 * s, g = p.grow;
    if (g < 0.01 || p.a < 0.01) return;
    const H = 50 * s * (0.8 + 0.35 * rt(p.seed)) * g, lean = (rt(p.seed + 1) - 0.5) * 0.4 * (p.flip || 1);
    const sway = W.wind * 1.6 * s + Math.sin(W.t * 0.9 + p.seed) * 0.6 * s;
    const tx = x + lean * H + sway, ty = y - H, cxp = x + lean * H * 0.15, cyp = y - H * 0.5;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([110, 86, 60], l);
    ctx.beginPath();
    ctx.moveTo(x - 2.3 * s, y); ctx.quadraticCurveTo(cxp - 1.7 * s, cyp, tx - 1.2 * s, ty);
    ctx.lineTo(tx + 1.2 * s, ty); ctx.quadraticCurveTo(cxp + 1.7 * s, cyp, x + 2.3 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([78, 60, 42], l, 0.8); ctx.lineWidth = Math.max(0.4, 0.55 * s);
    ctx.beginPath();
    for (let i = 1; i < 10; i++) { const t = i / 10, px = qb(x, cxp, tx, t), py = qb(y, cyp, ty, t), w = 2.1 * s * (1 - t * 0.4); ctx.moveTo(px - w, py); ctx.lineTo(px + w, py - 0.9 * s); }
    ctx.stroke();
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    ctx.fillStyle = css(mix3([66, 104, 56], [150, 132, 80], 0.5 * Math.min(1, W.lv.bare || 0)), l);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const a = (ANG[i] + (rt(p.seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      const L = (19 + 8 * rt(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + p.seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L;
      const mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L;
      const wd = 2.3 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ── 河边的树（6:4 砍伐树木）：垂丝的柽柳；砍了就倒下 ──────────────
  function treeModel(p) {
    if (p.model) return p.model;
    const r = U.mulberry32(p.seed), cl = [], br = [];
    for (let i = 0; i < 15; i++) {
      const a = -Math.PI * (0.06 + 0.88 * r());
      cl.push([Math.cos(a) * (0.2 + 0.14 * r()), -0.64 + Math.sin(a) * (0.18 + 0.1 * r()), 0.08 + 0.05 * r(), r()]);
    }
    for (let i = 0; i < 5; i++) br.push([(r() - 0.5) * 0.5, -0.66 - 0.18 * r()]);
    p.model = { cl, br, lean: (r() - 0.5) * 0.06 };
    return p.model;
  }
  function drawTree(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, g = p.grow;
    if (g < 0.01) return;
    const H = 84 * s * (0.85 + 0.3 * rt(p.seed)) * g, m = treeModel(p);
    const fall = easeOut(p.fall) * (Math.PI * 0.47) * -(p.flip || 1);
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.translate(x, y);
    ctx.rotate(fall);
    const sway = (W.wind * 1.2 + Math.sin(W.t * 0.8 + p.seed) * 0.5) * s * (1 - p.fall);
    const trunk = css([70, 54, 40], l);
    ctx.fillStyle = trunk;
    ctx.beginPath(); ctx.moveTo(-3.4 * s, 0); ctx.quadraticCurveTo(-1.6 * s, -H * 0.3, -1.1 * s + m.lean * H, -H * 0.5); ctx.lineTo(1.1 * s + m.lean * H, -H * 0.5); ctx.quadraticCurveTo(1.8 * s, -H * 0.3, 3.6 * s, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = trunk; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.8, 1.4 * s);
    ctx.beginPath();
    for (const b of m.br) { ctx.moveTo(m.lean * H, -H * 0.46); ctx.quadraticCurveTo(b[0] * 0.4 * H, -H * 0.56, b[0] * H + sway, b[1] * H); }
    ctx.stroke();
    // 垂丝的枝叶：暗的一团，其下垂下细丝，迎光处亮
    ctx.fillStyle = css([74, 98, 80], l);
    ctx.beginPath();
    for (const c of m.cl) { const cx = c[0] * H + sway, cy = c[1] * H, rx = c[2] * H; ctx.moveTo(cx + rx, cy); ctx.ellipse(cx, cy, rx, rx * 0.72, 0, 0, TAU); }
    ctx.fill();
    ctx.strokeStyle = css([86, 112, 90], l, 0.85);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < m.cl.length; i++) {
      const c = m.cl[i], cx = c[0] * H + sway, cy = c[1] * H, rx = c[2] * H;
      for (let j = -2; j <= 2; j++) { const fx0 = cx + j * rx * 0.38, fy0 = cy + rx * 0.5, L = rx * (0.7 + 0.5 * ((i + j + 5) % 3) / 2); ctx.moveTo(fx0, fy0); ctx.quadraticCurveTo(fx0 + sway * 0.3, fy0 + L * 0.6, fx0 + sway * 0.6 + j * 0.3 * s, fy0 + L); }
    }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([150, 172, 140], l, 0.45 * dayA(), 0.1);
    ctx.beginPath();
    for (const c of m.cl) { if (c[0] * d < -0.05 || c[3] < 0.35) continue; const rx = c[2] * H * 0.55, cx = c[0] * H + sway + d * rx * 0.4, cy = c[1] * H - rx * 0.35; ctx.moveTo(cx + rx, cy); ctx.ellipse(cx, cy, rx, rx * 0.6, 0, 0, TAU); }
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // ── 木料（砍下的树）──────────────────────────────────────────
  function drawBeams(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 1.5 * s, n = Math.round(p.grow * 6);
    if (n < 1) return;
    ctx.globalAlpha = p.a;
    const R = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1.5, 1], [1, 2]];
    for (let i = 0; i < n; i++) {
      const q = R[i], cx = x + (q[0] - 1) * 4.2 * s, cy = y - q[1] * 3.6 * s - 1.8 * s, L = 26 * s;
      ctx.fillStyle = css([112, 84, 58], 2);
      ctx.beginPath(); ctx.ellipse(cx - L * 0.5 + 12 * s, cy, L * 0.5, 1.9 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([196, 164, 118], 2);
      ctx.beginPath(); ctx.ellipse(cx + 12 * s, cy, 1.5 * s, 1.9 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // ── 帐棚（三王的营、亚兰人的营）──────────────────────────────
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, hw = 36 * s, h = 27 * s;
    const k0 = 0.86 + 0.1 * rt(p.seed), k1 = 1 + 0.08 * rt(p.seed + 1), k2 = 0.84 + 0.1 * rt(p.seed + 2), tilt = (rt(p.seed + 3) - 0.5) * 0.06;
    ctx.globalAlpha = p.a;
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k0], [-0.3, -0.74], [0.02, -k1 - 0.06], [0.32, -0.76], [0.62, -0.86 * k2], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css(p.style === 'aram' ? [74, 60, 56] : [70, 56, 46], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([98, 80, 66], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.66, -0.34, 0.34, 0.66]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.74 - Math.abs(f) * 0.06) * h); }
    ctx.stroke();
    const dw = 0.2 * hw, dh = 0.6 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    const lk = clamp(nightK() * 1.05, 0, 1) * 0.7 * (p.lit > 0.01 ? 1 : 0.4);
    if (lk > 0.02) lamp(ctx, dx, y - dh * 0.5, hw * 1.1, p.a * lk, p.seed);
    // 旗（三王）
    if (p.rgb) {
      const px = x + 0.02 * hw, py = y - (k1 + 0.06) * h;
      ctx.strokeStyle = css([80, 64, 50], l); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py - 12 * s); ctx.stroke();
      ctx.fillStyle = css(p.rgb, l);
      const fl = Math.sin(W.t * 3 + p.seed) * 1.2 * s;
      ctx.beginPath(); ctx.moveTo(px, py - 12 * s); ctx.quadraticCurveTo(px + 5 * s, py - 12 * s + fl, px + 10 * s, py - 10.5 * s + fl); ctx.lineTo(px + 9 * s, py - 6.5 * s + fl); ctx.quadraticCurveTo(px + 5 * s, py - 8 * s - fl, px, py - 7.5 * s); ctx.closePath(); ctx.fill();
    }
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const a0 = d > 0 ? 4 : 1, a1 = d > 0 ? 7 : 4;
    for (let i = a0; i <= a1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * tilt) * hw, Y1 = y + q[1] * h; if (i === a0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    // 营火
    if (p.fire > 0.01) { ctx.globalAlpha = 1; flame(ctx, x + 1.5 * hw, y + 5 * s, 7 * s, p.fire * p.a, p.seed); if (SP) smoke(ctx, x + 1.5 * hw, y - 2 * s, p.fire * p.a * 0.5, 40 * s, 5 * s, p.seed); }
    ctx.globalAlpha = 1;
  }

  // ── 房屋（寡妇的家、书念妇人墙上的小楼、以利沙的家、病榻之屋）──────
  function houseG(p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, w = 66 * s, h = 34 * s;
    return { s, x, y, w, h, x0: x - w / 2, x1: x + w / 2, roof: y - h, rw: 32 * s, rh: 36 * s };
  }
  // 墙上的小楼：地板上的一点（f 0..1 自左至右）
  const upperPt = (id, f, lift) => () => { const p = getP(id); if (!p) return null; const G = houseG(p); return [G.x0 + 4 * G.s + f * G.rw, G.roof + 0.5 - (lift || 0) * G.s]; };
  // 敞开的屋子里的床（病榻）
  const roomPt = (id, f) => () => { const p = getP(id); if (!p) return null; const G = houseG(p); return [G.x0 + f * G.w, G.y - 6 * G.s]; };
  function drawHouse(ctx, p) {
    const G = houseG(p), s = G.s, st = [196, 172, 136];
    const d = litX() >= G.x ? 1 : -1, nk = nightK();
    ctx.globalAlpha = p.a;
    if (p.style === 'sick') {
      // 前面敞开的屋子：看得见里面的床与朝东的窗
      ctx.fillStyle = css(mul(st, 0.62), 2);
      ctx.fillRect(G.x0, G.roof, G.w, G.h + 2 * s);
      ctx.fillStyle = css(st, 2);
      ctx.fillRect(G.x0 - 3 * s, G.roof - 3.5 * s, G.w + 6 * s, 4 * s);
      ctx.fillRect(G.x0 - 3 * s, G.roof, 5 * s, G.h + 2 * s);
      ctx.fillRect(G.x1 - 2 * s, G.roof, 5 * s, G.h + 2 * s);
      // 东窗（在左墙上）：开时透进晨光
      const wx = G.x0 + 2 * s, wy = G.roof + 7 * s, wh = 8 * s;
      ctx.fillStyle = css([40, 30, 24], 2);
      ctx.fillRect(wx, wy, 5 * s, wh);
      if (p.open > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rgba([255, 214, 150], 0.7 * p.open * p.a);
        ctx.fillRect(wx, wy, 5 * s, wh);
        const lg = ctx.createLinearGradient(wx, 0, wx + 34 * s, 0);
        lg.addColorStop(0, rgba([255, 214, 150], 0.3 * p.open * p.a)); lg.addColorStop(1, rgba([255, 214, 150], 0));
        ctx.fillStyle = lg;
        ctx.beginPath(); ctx.moveTo(wx + 5 * s, wy); ctx.lineTo(wx + 34 * s, wy + 10 * s); ctx.lineTo(wx + 34 * s, G.y); ctx.lineTo(wx + 5 * s, wy + wh); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.fillStyle = css([110, 82, 56], 2);
      ctx.fillRect(wx - 1 * s - p.open * 3 * s, wy, 1.5 * s, wh);
      // 床
      ctx.fillStyle = css([126, 96, 68], 2);
      ctx.fillRect(G.x0 + 0.42 * G.w, G.y - 5.5 * s, 0.5 * G.w, 2.2 * s);
      ctx.fillRect(G.x0 + 0.43 * G.w, G.y - 4 * s, 1.4 * s, 4 * s); ctx.fillRect(G.x0 + 0.9 * G.w, G.y - 4 * s, 1.4 * s, 4 * s);
      ctx.fillStyle = css([222, 212, 190], 2);
      ctx.fillRect(G.x0 + 0.44 * G.w, G.y - 6.8 * s, 0.46 * G.w, 1.6 * s);
      if (nk > 0.05) lamp(ctx, G.x0 + 0.3 * G.w, G.roof + 9 * s, 20 * s, nk * p.a, p.seed);
      ctx.globalAlpha = 1;
      return;
    }
    // 土房：平顶、矮墙、门
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(G.x0, G.roof, G.w, G.h + 2 * s);
    ctx.fillStyle = css(mul(st, 0.86), 2);
    ctx.fillRect(G.x0 - 1.5 * s, G.roof - 3 * s, G.w + 3 * s, 3.2 * s);
    // 门
    const dx = G.x0 + 0.3 * G.w, dw = 10 * s, dh = 18 * s;
    ctx.fillStyle = css([36, 28, 22], 2);
    ctx.fillRect(dx - dw / 2, G.y - dh, dw, dh);
    if (p.open < 0.98) { ctx.fillStyle = css([112, 84, 58], 2); ctx.fillRect(dx - dw / 2, G.y - dh, dw * (1 - p.open), dh); }
    // 窗
    ctx.fillStyle = css([40, 30, 24], 2);
    ctx.fillRect(G.x0 + 0.7 * G.w, G.roof + 6 * s, 5 * s, 5 * s);
    if (nk > 0.05) {
      ctx.fillStyle = rgba([255, 198, 120], 0.8 * nk * p.a);
      ctx.fillRect(G.x0 + 0.7 * G.w, G.roof + 6 * s, 5 * s, 5 * s);
      lamp(ctx, G.x0 + 0.7 * G.w + 2.5 * s, G.roof + 8.5 * s, 14 * s, nk * p.a, p.seed);
    }
    // 外面的台阶（上房顶）
    ctx.fillStyle = css(mul(st, 0.8), 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) ctx.rect(G.x1 - (i + 1) * 3 * s, G.y - (i + 1) * 4.6 * s, 3 * s + i * 3 * s, 4.6 * s);
    ctx.fill();
    if (p.style === 'upper') {
      // 墙上的小楼（4:10）：床榻、桌子、椅子、灯台；前面敞开
      const rx = G.x0 + 3 * s, ry = G.roof, rw = G.rw + 2 * s, rh = G.rh;
      ctx.fillStyle = css(mul(st, 0.6), 2);
      ctx.fillRect(rx, ry - rh, rw, rh);
      ctx.fillStyle = css(mul(st, 0.95), 2);
      ctx.fillRect(rx - 2 * s, ry - rh - 3 * s, rw + 4 * s, 3.2 * s);
      ctx.fillRect(rx - 2 * s, ry - rh, 2.6 * s, rh);
      ctx.fillRect(rx + rw - 0.6 * s, ry - rh, 2.6 * s, rh);
      // 床
      ctx.fillStyle = css([126, 96, 68], 2);
      ctx.fillRect(rx + 2 * s, ry - 4.4 * s, rw * 0.62, 1.8 * s);
      ctx.fillRect(rx + 2.4 * s, ry - 3 * s, 1.2 * s, 3 * s); ctx.fillRect(rx + 1.4 * s + rw * 0.6, ry - 3 * s, 1.2 * s, 3 * s);
      ctx.fillStyle = css([222, 212, 190], 2);
      ctx.fillRect(rx + 2.4 * s, ry - 5.4 * s, rw * 0.58, 1.2 * s);
      // 灯台
      ctx.fillStyle = css([150, 120, 70], 2);
      ctx.fillRect(rx + rw - 5 * s, ry - 8.5 * s, 1 * s, 8.5 * s);
      const warm = W.lv.esWarm, lk = Math.max(nk, 0.35) * 0.9 + warm * 0.8;
      flame(ctx, rx + rw - 4.5 * s, ry - 8.6 * s, 2.6 * s, p.a, p.seed);
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.warm, rx + rw * 0.5, ry - rh * 0.4, rw * (0.7 + 0.5 * warm), p.a * (0.12 * lk + 0.5 * warm));
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 迎光的一边
    ctx.fillStyle = css([250, 236, 206], 2, 0.3 * dayA(), 0.2);
    ctx.fillRect(d > 0 ? G.x1 - 2.5 * s : G.x0, G.roof, 2.5 * s, G.h);
    ctx.fillRect(G.x0 - 1.5 * s, G.roof - 3 * s, G.w + 3 * s, 1 * s);
    ctx.globalAlpha = 1;
  }

  // ── 耶和华的殿（11—12）：台阶、廊子、两根铜柱、门里的灯 ─────────
  function templeG(p) { const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s; return { s, x, y, door: x - 40 * s, top: y - 9 * s }; }
  function drawTemple(ctx, p) {
    const G = templeG(p), s = G.s, x = G.x, y = G.y, st = [222, 208, 176];
    ctx.globalAlpha = p.a;
    // 台阶
    ctx.fillStyle = css(mul(st, 0.84), 2);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) ctx.rect(x - (58 - i * 3) * s, y - (i + 1) * 3 * s, (104 - i * 6) * s, 3 * s + 1);
    ctx.fill();
    const b = y - 9 * s;
    // 殿
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(x - 32 * s, b - 40 * s, 76 * s, 40 * s);
    ctx.fillStyle = css(mul(st, 1.02), 2);
    ctx.fillRect(x - 48 * s, b - 54 * s, 18 * s, 54 * s);                  // 廊子
    ctx.fillStyle = css(GOLD, 2, 1, 0.15);
    ctx.fillRect(x - 34 * s, b - 42.5 * s, 80 * s, 2.5 * s);
    ctx.fillRect(x - 50 * s, b - 56.5 * s, 22 * s, 2.5 * s);
    // 高窗
    ctx.fillStyle = css([60, 48, 36], 2);
    for (let i = 0; i < 5; i++) ctx.fillRect(x - 24 * s + i * 13 * s, b - 36 * s, 3 * s, 7 * s);
    // 门与门里的灯
    const dx = x - 39 * s, dw = 9 * s, dh = 24 * s;
    ctx.fillStyle = css([30, 22, 16], 2);
    ctx.fillRect(dx - dw / 2, b - dh, dw, dh);
    const lk = W.lv.esLamp * 0.85 + 0.15, nk = nightK();
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([255, 200, 120], 0.5 * lk * p.a);
      ctx.fillRect(dx - dw / 2, b - dh, dw, dh);
      // 金灯台：七盏灯
      const ly = b - dh * 0.42, lh = dh * 0.36, aw = dw * 0.36;
      ctx.strokeStyle = rgba([255, 214, 130], 0.9 * p.a);
      ctx.lineWidth = Math.max(0.6, 0.7 * s);
      ctx.beginPath();
      ctx.moveTo(dx, b - 1 * s); ctx.lineTo(dx, ly - lh * 0.1);
      for (let i = 1; i <= 3; i++) { const r = aw * i / 3; ctx.moveTo(dx - r, ly - lh * 0.1); ctx.quadraticCurveTo(dx - r, ly + lh * 0.45 * i / 3, dx, ly + lh * 0.5 * i / 3); ctx.quadraticCurveTo(dx + r, ly + lh * 0.45 * i / 3, dx + r, ly - lh * 0.1); }
      ctx.stroke();
      for (let i = -3; i <= 3; i++) glowSp(ctx, SP.gold, dx + aw * i / 3, ly - lh * 0.2, 2.2 * s, lk * p.a * (0.8 + 0.2 * Math.sin(W.t * 7 + i)));
      glowSp(ctx, SP.warm, dx, b - dh * 0.45, dh * (0.9 + 1.4 * W.lv.esLamp), lk * p.a * (0.3 + 0.5 * nk));
      glowSp(ctx, SP.warm, dx + 8 * s, b, dh * 2.6 * W.lv.esLamp, 0.22 * lk * p.a * nk);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 两根铜柱（雅斤、波阿斯）
    ctx.fillStyle = css([176, 128, 72], 2, 1, 0.08);
    for (const px of [x - 56 * s, x - 45.5 * s]) { ctx.fillRect(px - 2 * s, b - 34 * s, 4 * s, 34 * s); ctx.beginPath(); ctx.ellipse(px, b - 35 * s, 3.6 * s, 2.6 * s, 0, 0, TAU); ctx.fill(); }
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([255, 244, 220], 2, 0.3 * dayA(), 0.2);
    ctx.fillRect(d > 0 ? x + 42 * s : x - 48 * s, b - (d > 0 ? 40 : 54) * s, 2 * s, (d > 0 ? 40 : 54) * s);
    ctx.globalAlpha = 1;
  }
  // ── 坛（铜坛上的火）──────────────────────────────────────────
  function drawAltar(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 112, 70], 2);
    ctx.fillRect(x - 9 * s, y - 10 * s, 18 * s, 10 * s);
    ctx.beginPath(); for (const hx of [-9, 7]) ctx.rect(x + hx * s, y - 12.5 * s, 2 * s, 2.6 * s); ctx.fill();
    ctx.fillStyle = css([220, 180, 110], 2, 0.4 * dayA(), 0.1);
    ctx.fillRect(x - 9 * s, y - 10 * s, 18 * s, 1 * s);
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) { flame(ctx, x, y - 10 * s, 9 * s, p.fire * p.a, p.seed); if (SP) smoke(ctx, x, y - 16 * s, p.fire * p.a * 0.5, 50 * s, 5 * s, p.seed); }
  }
  // ── 柜子（12:9）：柜盖上钻了一个窟窿 ───────────────────────────
  function drawChest(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([118, 86, 56], 2);
    ctx.fillRect(x - 6 * s, y - 7 * s, 12 * s, 7 * s);
    ctx.fillStyle = css([140, 104, 68], 2);
    ctx.fillRect(x - 6.6 * s, y - 8.4 * s, 13.2 * s, 1.8 * s);
    ctx.fillStyle = css([30, 22, 16], 2);
    ctx.fillRect(x - 1.2 * s, y - 8.3 * s, 2.4 * s, 0.9 * s);
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.white, x, y - 9 * s, 10 * s, p.lit * p.a * 0.5);
      for (let i = 0; i < 3; i++) { const k = U.fract(W.t * 0.6 + i / 3); glowSp(ctx, SP.white, x + (i - 1) * 1.5 * s, y - 9 * s - (1 - k) * 12 * s, 2 * s, p.lit * p.a * Math.sin(k * Math.PI) * 0.8); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // ── 以利沙的坟墓（13:20–21）──────────────────────────────────
  function tombMouth(p) { const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s; return [x - 12 * s, y]; }
  function drawTomb(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, hw = 44 * s, h = 34 * s * (0.3 + 0.7 * easeOut(p.grow));
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 98], 2);
    ctx.beginPath();
    ctx.moveTo(x - hw, y + 2 * s);
    for (let i = 0; i <= 16; i++) { const u = i / 16 * 2 - 1, yy = y - h * Math.pow(1 - u * u, 0.6) * (0.85 + 0.15 * rt(p.seed + i)); ctx.lineTo(x + u * hw, yy); }
    ctx.lineTo(x + hw, y + 2 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([98, 88, 74], 2);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const u = rt(p.seed + 30 + i) * 1.6 - 0.8, yy = y - h * 0.35 * rt(p.seed + 40 + i) - 4 * s, r = (2 + 3 * rt(p.seed + 50 + i)) * s; ctx.moveTo(x + u * hw + r, yy); ctx.ellipse(x + u * hw, yy, r, r * 0.6, 0, 0, TAU); }
    ctx.fill();
    // 墓门
    const [mx, my] = tombMouth(p), mw = 6 * s, mh = 13 * s;
    ctx.fillStyle = css([24, 18, 14], 2);
    ctx.beginPath(); ctx.moveTo(mx - mw, my); ctx.lineTo(mx - mw, my - mh); ctx.arc(mx, my - mh, mw, Math.PI, 0); ctx.lineTo(mx + mw, my); ctx.closePath(); ctx.fill();
    // 滚开的石头
    ctx.fillStyle = css([150, 138, 118], 2);
    ctx.beginPath(); ctx.ellipse(mx - 14 * s, my - 8 * s, 4 * s, 8 * s, 0, 0, TAU); ctx.fill();
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([255, 226, 160], 0.55 * p.lit * p.a);
      ctx.beginPath(); ctx.moveTo(mx - mw, my); ctx.lineTo(mx - mw, my - mh); ctx.arc(mx, my - mh, mw, Math.PI, 0); ctx.lineTo(mx + mw, my); ctx.closePath(); ctx.fill();
      glowSp(ctx, SP.gold, mx, my - mh * 0.6, mh * 2.4, p.lit * p.a * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([236, 222, 196], 2, 0.4 * dayA(), 0.15);
    ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) { const u = d > 0 ? i / 8 * 0.9 : -i / 8 * 0.9, yy = y - h * Math.pow(1 - u * u, 0.6) * (0.85 + 0.15 * rt(p.seed + Math.round((u + 1) * 8))); if (i) ctx.lineTo(x + u * hw, yy); else ctx.moveTo(x + u * hw, yy); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // ── 耶利哥的水源（2:21）──────────────────────────────────────
  function drawSpring(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p), rx = 17 * s, ry = 4.6 * s, k = W.lv.esSpring;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([118, 104, 84], 2);
    ctx.beginPath(); ctx.ellipse(x, y, rx + 3 * s, ry + 1.6 * s, 0, 0, TAU); ctx.fill();
    const c = mix3([112, 98, 72], [110, 176, 200], k);
    ctx.fillStyle = css(c, 2, 1, 0.05 + 0.1 * k);
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
    // 石
    ctx.fillStyle = css([150, 138, 116], 2);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + 0.3, px = x + Math.cos(a) * (rx + 2 * s), py = y + Math.sin(a) * (ry + 1.2 * s), r = (1.4 + rt(p.seed + i)) * s; ctx.moveTo(px + r, py); ctx.ellipse(px, py, r, r * 0.6, 0, 0, TAU); }
    ctx.fill();
    if (k > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rgba([240, 250, 255], 0.5 * k * dayA());
      ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) { const ph = U.fract(W.t * 0.2 + i / 4), px = x + (ph * 2 - 1) * rx * 0.7, py = y + (rt(p.seed + 20 + i) - 0.5) * ry; ctx.moveTo(px - 2.5 * s, py); ctx.lineTo(px + 2.5 * s, py); }
      ctx.stroke();
      if (SP) glowSp(ctx, SP.water, x, y, rx * 1.1, 0.18 * k * p.a);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // ── 谷中的沟（3:16–22）：挖出、满了水、在朝阳里红如血 ────────────
  let DITCH = null;
  function ditchModel() {
    const k = W.w + 'x' + W.h;
    if (DITCH && DITCH.k === k) return DITCH;
    const L = [];
    const xa = 0.665, xb = 0.985;
    for (let i = 0; i < 5; i++) {
      const v = 0.22 + i * 0.17;
      const pts = [];
      for (let j = 0; j <= 14; j++) { const xf = lerp(xa + 0.01 * i, xb, j / 14); pts.push([xf * W.w, fieldY(xf, v + 0.025 * Math.sin(j * 0.9 + i * 1.7))]); }
      L.push({ pts, rev: pts.slice().reverse(), order: i });
    }
    // 几道斜的支沟
    for (let i = 0; i < 6; i++) {
      const xf = 0.7 + i * 0.048, pts = [];
      for (let j = 0; j <= 6; j++) { const v = lerp(0.22, 0.9, j / 6); pts.push([(xf + 0.012 * Math.sin(j + i)) * W.w, fieldY(xf, v)]); }
      L.push({ pts, rev: pts.slice().reverse(), order: 5 + i });
    }
    DITCH = { k, L };
    return DITCH;
  }
  function strokePart(ctx, pts, f) {
    if (f <= 0) return;
    const n = pts.length - 1, e = f * n;
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let j = 1; j <= n; j++) {
      if (j <= e) ctx.lineTo(pts[j][0], pts[j][1]);
      else { const r = e - (j - 1); ctx.lineTo(lerp(pts[j - 1][0], pts[j][0], r), lerp(pts[j - 1][1], pts[j][1], r)); break; }
    }
  }
  function drawDitches(ctx) {
    const dg = W.lv.esDitch, fl = W.lv.esFill, red = W.lv.esRed;
    if (dg < 0.005) return;
    const D = ditchModel(), s = LS(2), n = D.L.length;
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([84, 66, 46], 2, 0.9);
    ctx.lineWidth = Math.max(1.4, 4 * s);
    ctx.beginPath();
    D.L.forEach(q => strokePart(ctx, q.pts, clamp(dg * n - q.order * 0.6, 0, 1)));
    ctx.stroke();
    // 挖出的土堆在沟边
    ctx.strokeStyle = css([176, 148, 104], 2, 0.6);
    ctx.lineWidth = Math.max(0.8, 1.4 * s);
    ctx.beginPath();
    D.L.forEach(q => { const f = clamp(dg * n - q.order * 0.6, 0, 1); if (f > 0) { ctx.save(); ctx.translate(0, -2.4 * s); strokePart(ctx, q.pts, f); ctx.restore(); } });
    ctx.stroke();
    if (fl < 0.005) return;
    // 水：自右（以东）流进来
    const wc = mix3(W.shade([120, 176, 200], 0.1, 0.12), [196, 36, 28], red * 0.92);
    ctx.strokeStyle = rgba(wc, 0.95);
    ctx.lineWidth = Math.max(1.1, 3 * s);
    ctx.beginPath();
    D.L.forEach(q => { const f = clamp(fl * 1.4 - q.order * 0.04, 0, 1); if (f > 0) strokePart(ctx, q.rev, f); });
    ctx.stroke();
    // 光
    ctx.globalCompositeOperation = 'lighter';
    const gl = red > 0.05 ? [255, 96, 60] : [230, 244, 255];
    if (red > 0.02 && SP) glowSp(ctx, SP.red, 0.83 * W.w, fieldY(0.83, 0.55), W.w * 0.14, 0.22 * red);
    ctx.strokeStyle = rgba(gl, (0.18 + 0.55 * red) * Math.min(1, fl * 2) * (0.4 + 0.6 * W.daylight + red));
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.setLineDash([3 * s, 9 * s]);
    ctx.lineDashOffset = -W.t * 6 * s;
    ctx.beginPath();
    D.L.forEach(q => { const f = clamp(fl * 1.4 - q.order * 0.04, 0, 1); if (f > 0) { ctx.save(); ctx.translate(0, -0.6 * s); strokePart(ctx, q.rev, f); ctx.restore(); } });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = 'source-over';
  }
  // ── 麦田（书念：收割的人）────────────────────────────────────
  function drawField(ctx, p) {
    const s = LS(2), x0 = p.x, x1 = p.x1 || p.x + 0.1, v0 = p.v || 0.05, v1 = p.v1 || 0.6, g = p.grow;
    if (g < 0.01) return;
    ctx.globalAlpha = p.a;
    const sw = W.wind * 1.4 * s;
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = css(pass ? [236, 204, 120] : [196, 160, 84], 2, pass ? 0.55 : 1, pass ? 0.08 : 0);
      ctx.lineWidth = Math.max(0.5, (pass ? 0.6 : 0.9) * s);
      ctx.beginPath();
      const N = (W.quality || 1) < 0.75 ? 70 : 130;
      for (let i = 0; i < N; i++) {
        const xf = lerp(x0, x1, rt(p.seed + i * 2)), v = lerp(v0, v1, rt(p.seed + i * 2 + 1));
        const x = xf * W.w, y = fieldY(xf, v), h = (7 + 4 * rt(p.seed + 400 + i)) * s * (0.8 + 0.5 * v) * g;
        const b = sw + Math.sin(W.t * 1.6 + i * 0.7) * 0.8 * s;
        if (pass) { ctx.moveTo(x + b, y - h); ctx.lineTo(x + b * 1.1, y - h - 2.4 * s); }
        else { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + b * 0.3, y - h * 0.6, x + b, y - h); }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // ── 器皿（4:3–6）：一个一个倒满了油 ───────────────────────────
  function jarPos(p, i) {
    const n = p.n || 8, row = i % 2, col = Math.floor(i / 2), cols = Math.ceil(n / 2);
    const xf = lerp(p.x, p.x1 || p.x + 0.1, cols > 1 ? col / (cols - 1) : 0.5) + row * 0.008;
    const v = (p.v || 0.4) + row * 0.14;
    return [xf * W.w, fieldY(xf, v), 1 + 0.25 * row];
  }
  function drawJars(ctx, p) {
    const n = p.n || 8, shown = p.grow * n, oil = W.lv.esOil, s = LS(2) * p.size;
    ctx.globalAlpha = p.a;
    for (let i = 0; i < n; i++) {
      const vis = clamp(shown - i, 0, 1);
      if (vis < 0.01) continue;
      const [x, y, k] = jarPos(p, i), h = (10.5 + 3.5 * rt(p.seed + i)) * s * k, w = h * 0.36;
      ctx.globalAlpha = p.a * vis;
      ctx.fillStyle = css([176, 120, 76], 2);
      ctx.beginPath(); ctx.ellipse(x, y - h * 0.42, w, h * 0.42, 0, 0, TAU); ctx.fill();
      ctx.fillRect(x - w * 0.42, y - h * 0.98, w * 0.84, h * 0.3);
      ctx.fillStyle = css([150, 100, 62], 2);
      ctx.fillRect(x - w * 0.55, y - h * 1.02, w * 1.1, h * 0.08);
      const d = litX() >= x ? 1 : -1;
      ctx.fillStyle = css([236, 200, 150], 2, 0.4 * dayA(), 0.1);
      ctx.beginPath(); ctx.ellipse(x + d * w * 0.45, y - h * 0.5, w * 0.25, h * 0.25, 0, 0, TAU); ctx.fill();
      const f = clamp(oil - i, 0, 1);
      if (f > 0.01 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = rgba([255, 214, 110], 0.85 * f * vis * p.a);
        ctx.beginPath(); ctx.ellipse(x, y - h * 1.0, w * 0.4, h * 0.05, 0, 0, TAU); ctx.fill();
        glowSp(ctx, SP.gold, x, y - h * 0.8, h * (1.4 + 0.3 * Math.sin(W.t * 2 + i)), 0.6 * f * vis * p.a);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // ── 饼（4:42–44）：二十个大麦饼，众人吃了还剩下 ─────────────────
  function drawLoaves(ctx, p) {
    const n = p.n || 20, shown = Math.round(p.grow * n), s = LS(2) * p.size;
    if (shown < 1) return;
    ctx.globalAlpha = p.a;
    const x0 = p.x, x1 = p.x1 || p.x + 0.1, v = p.v || 0.7;
    // 铺开的布
    ctx.fillStyle = css([214, 200, 172], 2, 0.9);
    ctx.beginPath(); ctx.ellipse((x0 + x1) / 2 * W.w, fieldY((x0 + x1) / 2, v), (x1 - x0) / 2 * W.w + 6 * s, 4 * s, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < shown; i++) {
      const xf = lerp(x0, x1, (i + 0.5) / n + (rt(p.seed + i) - 0.5) * 0.02), y = fieldY(xf, v + (rt(p.seed + 30 + i) - 0.5) * 0.06);
      ctx.fillStyle = css([196, 150, 84], 2);
      ctx.beginPath(); ctx.ellipse(xf * W.w, y - 1.2 * s, 2.8 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
    }
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < shown; i += 3) { const xf = lerp(x0, x1, (i + 0.5) / n); glowSp(ctx, SP.gold, xf * W.w, fieldY(xf, v) - 2 * s, 7 * s, p.lit * p.a * (0.35 + 0.15 * Math.sin(W.t * 2 + i))); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // ── 台阶上铺的衣服（9:13）────────────────────────────────────
  function stairTop(id) { return () => { const p = getP(id); if (!p) return null; const s = LS(2) * p.size; return [p.x * W.w + 2 * s, baseOf(p) + 2 * s - 12 * s]; }; }
  function drawStair(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([188, 170, 140], 2);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) ctx.rect(x - (16 - i * 4) * s, y - (i + 1) * 4 * s, (32 - i * 8) * s, 4 * s + 1);
    ctx.fill();
    const COL = [[172, 62, 56], [70, 96, 150], [206, 170, 80], [96, 120, 72], [140, 80, 130]];
    const shown = p.grow * 5;
    for (let i = 0; i < 5; i++) {
      const vis = clamp(shown - i, 0, 1);
      if (vis < 0.02) continue;
      const lvl = [0, 0, 1, 1, 2][i], off = [-9, 6, -4, 5, 0][i];
      ctx.globalAlpha = p.a * vis;
      ctx.fillStyle = css(COL[i], 2);
      ctx.beginPath(); ctx.ellipse(x + off * s, y - (lvl + 1) * 4 * s + 0.6 * s, 5.5 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // ── 巴力的柱像（10:26–27）：烧了，拆毁了 ───────────────────────
  function drawPillar(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, H = 38 * s;
    ctx.save();
    ctx.globalAlpha = p.a;
    ctx.translate(x, y);
    ctx.rotate(easeOut(p.fall) * 1.35);
    ctx.fillStyle = css([64, 56, 54], 2);
    ctx.beginPath(); ctx.moveTo(-4.5 * s, 0); ctx.lineTo(-3 * s, -H); ctx.lineTo(3 * s, -H); ctx.lineTo(4.5 * s, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-3 * s, -H); ctx.quadraticCurveTo(-7 * s, -H - 4 * s, -5 * s, -H - 9 * s); ctx.lineTo(-2 * s, -H - 2 * s); ctx.lineTo(2 * s, -H - 2 * s); ctx.lineTo(5 * s, -H - 9 * s); ctx.quadraticCurveTo(7 * s, -H - 4 * s, 3 * s, -H); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      flame(ctx, x - 4 * s, y, 16 * s * p.fire, p.fire * p.a, p.seed);
      flame(ctx, x + 5 * s, y, 12 * s * p.fire, p.fire * p.a, p.seed + 3);
      if (SP) smoke(ctx, x, y - 20 * s, p.fire * p.a, 70 * s, 7 * s, p.seed);
    }
  }
  // ── 城门口的细面与大麦（7:16）────────────────────────────────
  function drawSacks(ctx, p) {
    const s = LS(2) * p.size, n = Math.round(p.grow * 5);
    ctx.globalAlpha = p.a;
    for (let i = 0; i < n; i++) {
      const xf = p.x + (i - 2) * 0.011, y = fieldY(xf, (p.v || 0.3) + (i % 2) * 0.08), x = xf * W.w;
      ctx.fillStyle = css(i % 2 ? [224, 190, 110] : [232, 224, 206], 2);
      ctx.beginPath(); ctx.ellipse(x, y - 4 * s, 3.6 * s, 4.4 * s, 0, 0, TAU); ctx.fill();
      ctx.fillRect(x - 1.5 * s, y - 10 * s, 3 * s, 2.5 * s);
    }
    if (p.lit > 0.01 && SP && n) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.gold, p.x * W.w, fieldY(p.x, p.v || 0.3) - 6 * s, 24 * s, p.lit * p.a * 0.45); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }
  // ── 满道上丢弃的衣服器具（7:15）──────────────────────────────
  function drawCloths(ctx, p) {
    const s = LS(2), n = Math.round(p.grow * 9);
    ctx.globalAlpha = p.a;
    for (let i = 0; i < n; i++) {
      const xf = lerp(p.x, p.x1 || p.x - 0.1, rt(p.seed + i)), v = lerp(p.v || 0.3, p.v1 || 0.7, rt(p.seed + 20 + i));
      const x = xf * W.w, y = fieldY(xf, v);
      ctx.fillStyle = css([[120, 64, 58], [150, 132, 104], [92, 88, 110], [176, 150, 90]][i % 4], 2);
      ctx.beginPath(); ctx.ellipse(x, y - 0.6 * s, (3 + 2 * rt(p.seed + 40 + i)) * s, 1.1 * s, (rt(p.seed + 60 + i) - 0.5) * 0.6, 0, TAU); ctx.fill();
      if (i % 3 === 0) { ctx.fillStyle = css([170, 130, 80], 2); ctx.beginPath(); ctx.ellipse(x + 4 * s, y - 1.5 * s, 1.5 * s, 1.8 * s, 0, 0, TAU); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  // ── 抬尸首的床（13:21）──────────────────────────────────────
  function bierPt(id) { return () => { const p = getP(id); if (!p) return null; const s = LS(2); return [p.x * W.w - 6 * s, baseOf(p) - PH(2) * 0.62]; }; }
  function drawBier(ctx, p) {
    const s = LS(2), x = p.x * W.w, y = baseOf(p) - PH(2) * 0.6;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([110, 82, 56], 2); ctx.lineWidth = Math.max(0.8, 1.5 * s);
    ctx.beginPath(); ctx.moveTo(x - 22 * s, y); ctx.lineTo(x + 22 * s, y); ctx.stroke();
    ctx.fillStyle = css([150, 120, 88], 2);
    ctx.fillRect(x - 13 * s, y - 1.6 * s, 26 * s, 2 * s);
    ctx.globalAlpha = 1;
  }
  // ── 马车（乃缦的车、耶户的车、亚兰人的车）──────────────────────
  function chariotK(p) { return PH(p.layer) / 30 * p.size; }
  function chariotBase(p) { return [p.x * W.w, baseOf(p) + 1]; }
  const chariotFloor = id => () => { const p = getP(id); if (!p) return null; const k = chariotK(p), b = chariotBase(p), d = p.flip || 1; return [b[0] - d * 24 * k, b[1] - 9.5 * k]; };
  function drawChariotProp(ctx, p) {
    const k = chariotK(p), [x, y] = chariotBase(p), d = p.flip || 1, moving = p.tx != null ? 1 : 0;
    p.gait = p.gait == null ? moving : p.gait + (moving - p.gait) * 0.1;
    chariotUnit(ctx, x, y, k, d, p.ph, p.gait, chariotStyle(p.style, p.layer), p.a);
    if (p.style === 'aram') {
      // 铜光
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([255, 200, 120], 0.35 * p.a * (0.3 + 0.7 * dayA()));
      ctx.beginPath(); ctx.ellipse(x - d * 26 * k, y - 14 * k, 2 * k, 1 * k, 0, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 车厢的前栏（在人之后画，挡住车上人的腿）
  function drawChariotRail(ctx, p) {
    if (p.a < 0.01) return;
    const k = chariotK(p), [x, y] = chariotBase(p), d = p.flip || 1, st = chariotStyle(p.style, p.layer);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = st.car;
    ctx.beginPath();
    ctx.moveTo(x - d * 31 * k, y - 9.5 * k); ctx.lineTo(x - d * 17.5 * k, y - 9.5 * k);
    ctx.quadraticCurveTo(x - d * 15.2 * k, y - 16 * k, x - d * 18 * k, y - 21.5 * k);
    ctx.lineTo(x - d * 20.5 * k, y - 21 * k); ctx.quadraticCurveTo(x - d * 19 * k, y - 16.5 * k, x - d * 24 * k, y - 15.5 * k);
    ctx.lineTo(x - d * 31 * k, y - 15 * k); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = st.wheel; ctx.lineWidth = Math.max(0.6, 1.3 * k);
    ctx.beginPath(); ctx.arc(x - d * 24 * k, y - 7.4 * k, 7.4 * k, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  const DRAW = {
    knoll: drawKnoll, city: drawCity, samfar: drawSamFar, palm: drawPalm, tree: drawTree, beams: drawBeams, tent: drawTent,
    house: drawHouse, temple: drawTemple, altar: drawAltar, chest: drawChest, tomb: drawTomb, spring: drawSpring, field: drawField,
    jars: drawJars, loaves: drawLoaves, stair: drawStair, pillar: drawPillar, sacks: drawSacks, cloths: drawCloths,
  };

  // ════════════════════════════════════════════════════════════
  //  天上与空中：旋风、火车火马、天开的光、火柱、光束……
  // ════════════════════════════════════════════════════════════
  // 以利亚升天之处
  const ASC = () => [0.58 * W.w, W.h * 0.22];
  // 火车火马的路（2:11）：自右上的天降下，从二人中间掠过，随旋风上升
  const CH_KEYS = [[0, 1.06, 0.1], [0.2, 0.86, 0.26], [0.36, 0.66, 0.6], [0.45, 0.546, -1], [0.55, 0.505, -1.8], [0.72, 0.535, 0.5], [1, 0.6, 0.2]];
  function chPos(u) {
    // y：负数表示「地上 −n × 人高」
    const ky = (k, i) => (k[2] < 0 ? fieldY(k[1], X.partV + 0.02) + k[2] * PH(2) * 0.5 : k[2] * W.h);
    let i = 0;
    while (i < CH_KEYS.length - 2 && u > CH_KEYS[i + 1][0]) i++;
    const a = CH_KEYS[Math.max(0, i - 1)], b = CH_KEYS[i], c = CH_KEYS[i + 1], d = CH_KEYS[Math.min(CH_KEYS.length - 1, i + 2)];
    const t = clamp((u - b[0]) / (c[0] - b[0]), 0, 1), t2 = t * t, t3 = t2 * t;
    const cr = (p0, p1, p2, p3) => 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    return [cr(a[1], b[1], c[1], d[1]) * W.w, cr(ky(a), ky(b), ky(c), ky(d))];
  }
  function drawSkyChariot(ctx) {
    const u = tk('chariot');
    if (u < 0) return;
    SP || sprites();
    const [x, y] = chPos(u), [x2, y2] = chPos(Math.min(1, u + 0.01));
    const vx = x2 - x, vy = y2 - y, d = vx >= 0 ? 1 : -1;
    const k = PH(2) / 30 * 1.35 * (1 - 0.35 * Math.max(0, (u - 0.7) / 0.3));
    const a = Math.min(1, u * 8) * (1 - clamp((u - 0.86) / 0.14, 0, 1));
    const ph = W.t * 11;
    // 火的尾迹
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= 6; i++) {
      const [tx, ty] = chPos(Math.max(0, u - i * 0.012));
      glowSp(ctx, SP.fire, tx - d * 8 * k, ty - 16 * k, (26 - i * 2.5) * k, a * 0.22 * (1 - i / 7));
    }
    ctx.globalCompositeOperation = 'source-over';
    fireAura(ctx, x, y, k, d, a, vx / (Math.hypot(vx, vy) || 1), vy / (Math.hypot(vx, vy) || 1), 3.3);
    chariotUnit(ctx, x, y, k, d, ph, 1, 'fire', a);
  }
  // 旋风：一根发光的漏斗，自以利亚脚下直上云天；一缕缕的风旋着往上升
  function drawWhirl(ctx) {
    const k = W.lv.esWhirl;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const bx = X.elijahE * W.w, by = fieldY(X.elijahE, X.partV + 0.02), [tx, ty] = ASC();
    const s = SU(), grow = clamp(k * 1.2, 0, 1);
    const axis = u => lerp(bx, tx, Math.pow(u, 1.25)) + Math.sin(u * 3.2 + W.t * 0.8) * 9 * u * s;
    const rad = u => (4 + 78 * Math.pow(u, 1.45)) * s;
    ctx.globalCompositeOperation = 'lighter';
    // 柔和的风柱
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      if (u > grow) break;
      glowSp(ctx, SP.pale, axis(u), lerp(by, ty, u), rad(u) * 1.5 + 10 * s, 0.1 * k);
    }
    glowSp(ctx, SP.gold, bx, by - 6 * s, 30 * s, 0.35 * k);
    // 一缕缕旋着上升的风
    ctx.lineCap = 'round';
    const N = (W.quality || 1) < 0.75 ? 16 : 26, SEG = 30;
    for (let i = 0; i < N; i++) {
      const u0 = U.fract(rt(i * 7 + 1) + W.t * 0.11 * (0.8 + 0.4 * rt(i * 7 + 2))), len = 0.22 + 0.3 * rt(i * 7 + 3);
      const ph0 = rt(i * 7 + 4) * TAU, sp = 2.2 + 1.8 * rt(i * 7 + 5), rr = 0.7 + 0.55 * rt(i * 7 + 6);
      ctx.beginPath();
      let n = 0;
      for (let j = 0; j <= SEG; j++) {
        const u = u0 + len * j / SEG;
        if (u > grow || u > 1) break;
        const a = ph0 + W.t * sp + u * 7.5, r = rad(u) * rr;
        const x = axis(u) + Math.cos(a) * r, y = lerp(by, ty, u) + Math.sin(a) * r * 0.22;
        if (n++) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      if (n < 2) continue;
      const env = Math.sin(Math.PI * clamp(u0 / (1 - len * 0.5), 0, 1));
      ctx.strokeStyle = i % 4 === 0 ? 'rgba(255,200,130,1)' : 'rgba(255,244,222,1)';
      ctx.globalAlpha = Math.min(1, k * env * (0.24 + 0.36 * rt(i * 7 + 5)));
      ctx.lineWidth = Math.max(0.6, (0.7 + 1.9 * rt(i * 7 + 6)) * s);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // 升天的以利亚：在旋风里发光
    const f = fig('elijah');
    if (f && f.ny != null && f._vis) {
      const p = figPt('elijah', 0.5);
      if (p) { glowSp(ctx, SP.gold, p[0], p[1], PH(2) * 1.5, 0.55 * k); glowSp(ctx, SP.white, p[0], p[1], PH(2) * 0.55, 0.7 * k); }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 天开的光（以利亚升天之处）：光自天上的开口向地倾下
  function drawGlory(ctx) {
    const k = W.lv.esGlory;
    if (k < 0.01) return;
    SP || sprites();
    if (!SP) return;
    const [x, y] = ASC(), R0 = M() * 0.13;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, R0 * 1.7, 0.3 * k);
    glowSp(ctx, SP.white, x, y, R0 * 0.5, 0.55 * k);
    ctx.strokeStyle = 'rgba(255,238,200,1)';
    ctx.lineWidth = Math.max(1, 2 * SU());
    ctx.lineCap = 'round';
    for (let i = 0; i < 11; i++) {
      const a = Math.PI * (0.12 + 0.76 * i / 10) + Math.sin(W.t * 0.3 + i) * 0.03, L = R0 * (1.6 + 0.9 * rt(i + 90)) * (0.85 + 0.15 * Math.sin(W.t * 0.9 + i));
      ctx.globalAlpha = 0.1 * k;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * R0 * 0.3, y + Math.sin(a) * R0 * 0.3); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 自天落在人身上的光
  function drawBeamOn(ctx, id, k, tint) {
    if (!id || k < 0.01 || !SP) return;
    const p = figPt(id, 0.5);
    if (!p) return;
    const w = PH(2) * 1.1, top = -20;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.45;
    ctx.drawImage(SP.beam, p[0] - w / 2, top, w, p[1] + PH(2) * 0.55 - top);
    glowSp(ctx, tint === 'pale' ? SP.pale : SP.gold, p[0], p[1], PH(2) * 1.1, k * 0.35);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 天火（1:10）：一道火柱落在五十人身上
  function drawFireFall(ctx) {
    const u = tk('firefall'), sc = W.lv.esScorch;
    SP || sprites();
    if (!SP) return;
    const d = twData('firefall'), xf = d ? d.x : 0.905;
    const x = xf * W.w, y = fieldY(xf, 0.12);
    if (sc > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.ember, x, y, PH(2) * 1.6, 0.45 * sc);
      for (let i = 0; i < 7; i++) glowSp(ctx, SP.ember, x + (rt(i + 300) - 0.5) * PH(2) * 1.6, y + (rt(i + 310) - 0.5) * 6, 5 * SU(), sc * (0.5 + 0.5 * Math.sin(W.t * 5 + i)));
      ctx.globalCompositeOperation = 'source-over';
    }
    if (u < 0) return;
    const fall = easeOut(u / 0.35), fade = 1 - clamp((u - 0.45) / 0.55, 0, 1);
    const bot = lerp(-40, y + 6, fall), w = PH(2) * (1.3 + 0.5 * Math.sin(W.t * 17));
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = fade;
    ctx.drawImage(SP.firecol, x - w, -40, w * 2, bot + 40);
    glowSp(ctx, SP.fire, x, bot, PH(2) * 2.6 * fall, fade * 0.8);
    glowSp(ctx, SP.white, x, bot - PH(2) * 0.4, PH(2) * 1.2 * fall, fade * 0.7);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 外衣：打水时甩出的一道；从天上飘落；落在地上
  function drawMantle(ctx) {
    const s = LS(2);
    // 打水
    const u = tk('whip');
    if (u >= 0) {
      const d = twData('whip');
      const hand = d && figPt(d.id, 0.55), wx = d ? d.wx * W.w : 0, wy = fieldY(X.jT, X.partV);
      if (hand) {
        const e = Math.sin(Math.PI * clamp(u, 0, 1));
        const mx = lerp(hand[0], wx, 0.5), my = Math.min(hand[1], wy) - PH(2) * 0.5 * (1 - u);
        ctx.strokeStyle = css(ROBE.mantle, 2, e);
        ctx.lineWidth = Math.max(1.5, 3.2 * s);
        ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.quadraticCurveTo(mx, my, lerp(hand[0], wx, 0.4 + 0.6 * clamp(u * 1.6, 0, 1)), lerp(hand[1], wy, clamp(u * 1.6, 0, 1))); ctx.stroke();
      }
    }
    // 飘落
    const f = tk('mfall');
    if (f >= 0) {
      const [ax, ay] = ASC(), gx = X.mantle * W.w, gy = fieldY(X.mantle, X.mantleV);
      const sx = lerp(ax, gx, 0.2), sy = lerp(ay, gy, 0.35);
      const e = ease(f), x = lerp(sx, gx, e) + Math.sin(f * 9) * 22 * s * (1 - e), y = lerp(sy, gy, e);
      const rot = Math.sin(f * 7) * 0.8 * (1 - e);
      clothShape(ctx, x, y, s * (1 + 0.3 * (1 - e)), rot, 1);
    } else if (S.mantle === 'ground') {
      const gx = X.mantle * W.w, gy = fieldY(X.mantle, X.mantleV);
      clothShape(ctx, gx, gy, s, 0.1, 0);
    }
  }
  function clothShape(ctx, x, y, s, rot, flut) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = css(ROBE.mantle, 2);
    const w = 11 * s, h = flut ? 7 * s : 2.4 * s, fl = flut ? Math.sin(W.t * 8) * 2 * s : 0;
    ctx.beginPath();
    ctx.moveTo(-w, 0); ctx.quadraticCurveTo(-w * 0.4, -h - fl, 0, -h * 0.6); ctx.quadraticCurveTo(w * 0.5, -h + fl, w, -h * 0.2);
    ctx.lineTo(w * 0.9, h * 0.3); ctx.quadraticCurveTo(0, h * 0.6 + fl, -w, h * 0.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([70, 52, 38], 2, 0.8);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(-w * 0.6, -h * 0.3); ctx.lineTo(w * 0.6, -h * 0.2); ctx.stroke();
    ctx.restore();
  }
  // 弹琴的（3:15）：琴与音符的光
  function drawHarp(ctx) {
    if (!S.harp) return;
    const p = figPt('harpist', 0.4);
    if (!p) return;
    const s = LS(2), f = fig('harpist'), d = f ? (f.fd >= 0 ? 1 : -1) : 1;
    const x = p[0] + d * 5 * s, y = p[1];
    ctx.strokeStyle = css([150, 110, 60], 2); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x, y + 5 * s); ctx.quadraticCurveTo(x + d * 6 * s, y - 2 * s, x + d * 2 * s, y - 9 * s); ctx.moveTo(x, y + 5 * s); ctx.lineTo(x - d * 1 * s, y - 8 * s); ctx.stroke();
    ctx.strokeStyle = css([240, 230, 200], 2, 0.6); ctx.lineWidth = Math.max(0.3, 0.4 * s);
    ctx.beginPath(); for (let i = 1; i < 4; i++) { ctx.moveTo(x - d * 0.3 * i * s, y + (5 - i * 3) * s); ctx.lineTo(x + d * (1 + i * 1.3) * s, y + (4 - i * 3.5) * s); } ctx.stroke();
    if (!SP) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const k = U.fract(W.t * 0.35 + i / 5), nx = x + d * (4 + 26 * k) * s + Math.sin(W.t * 2 + i) * 4 * s, ny = y - 8 * s - k * 34 * s;
      glowSp(ctx, SP.gold, nx, ny, 4 * s, Math.sin(k * Math.PI) * 0.7);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 乃缦的大麻风（5:1）：身上灰白的斑，沐浴七回之后散去
  function drawLeprosy(ctx) {
    if (!S.leper) return;
    const k = 1 - W.lv.esClean;
    if (k < 0.02) return;
    const f = fig('naaman');
    if (!f || !f._vis) return;
    const h = f._h || PH(2);
    ctx.fillStyle = rgba([226, 226, 214], 0.55 * k * f.alpha);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const x = f._x + (rt(i * 3 + 500) - 0.5) * h * 0.22, y = f._y - h * (0.15 + 0.75 * rt(i * 3 + 501)), r = h * (0.02 + 0.025 * rt(i * 3 + 502));
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.8, 0, 0, TAU);
    }
    ctx.fill();
  }
  // 沐浴七回：河上七盏小光，一回亮一盏
  function drawDips(ctx) {
    if (!S.dips || !SP) return;
    const k = 1 - clamp(W.lv.esClean * 1.2 - 0.2, 0, 1) * 0.6;
    const cx = riverAtV(0.46) * W.w, cy = fieldY(X.jT, 0.46) - PH(2) * 1.9, R = PH(2) * 1.1;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.12 + 0.76 * i / 6), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.5 + R * 0.4;
      const on = i < S.dips ? 1 : 0.12;
      glowSp(ctx, SP.gold, x, y, 7 * SU(), on * k * 0.8);
      glowSp(ctx, SP.white, x, y, 2.5 * SU(), on * k);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 斧头：落水、漂上来、被拿起（6:5–7）
  function drawAxe(ctx) {
    const s = LS(2);
    const u = tk('axefly');
    if (u >= 0) {
      const d = twData('axefly'), from = d ? figPt(d.id, 0.9) : null;
      if (from) {
        const tx = d.tx * W.w, ty = fieldY(X.jT, d.v), x = lerp(from[0], tx, u), y = lerp(from[1], ty, u) - Math.sin(u * Math.PI) * PH(2) * 0.8;
        axeHead(ctx, x, y, s * 1.6, u * 9);
      }
    }
    const st = tk('stick');
    if (st >= 0) {
      const d = twData('stick'), from = d ? figPt(d.id, 0.6) : null;
      if (from) {
        const tx = d.tx * W.w, ty = fieldY(X.jT, d.v), x = lerp(from[0], tx, st), y = lerp(from[1], ty, st) - Math.sin(st * Math.PI) * PH(2) * 0.6;
        ctx.save(); ctx.translate(x, y); ctx.rotate(st * 8);
        ctx.fillStyle = css([150, 118, 80], 2); ctx.fillRect(-6 * s, -0.8 * s, 12 * s, 1.6 * s);
        ctx.restore();
      }
    }
    const fl = W.lv.esAxe;
    if (fl > 0.02 && S.axe !== 'taken') {
      const xf = riverAtV(0.3), x = xf * W.w + 3 * s, y = fieldY(X.jT, 0.3) - 1 * s + Math.sin(W.t * 2.2) * 0.8 * s - (fl - 1) * 4 * s;
      ctx.globalAlpha = fl;
      axeHead(ctx, x, y, s * 1.8, 0.2);
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.white, x + 2.5 * s, y - 1.5 * s, 12 * s, 0.7 * fl * (0.6 + 0.4 * Math.sin(W.t * 3))); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = rgba([230, 244, 252], 0.4 * fl);
      ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath(); ctx.ellipse(x, y + 1.5 * s, 7 * s * (1 + 0.2 * Math.sin(W.t * 2)), 1.8 * s, 0, 0, TAU); ctx.stroke();
    }
  }
  function axeHead(ctx, x, y, s, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = css([88, 92, 100], 2);
    ctx.beginPath(); ctx.moveTo(-3 * s, -1.2 * s); ctx.lineTo(2 * s, -2.4 * s); ctx.quadraticCurveTo(3.6 * s, 0, 2 * s, 2.4 * s); ctx.lineTo(-3 * s, 1.2 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([210, 216, 224], 2, 0.8, 0.1);
    ctx.fillRect(1.6 * s, -2 * s, 0.8 * s, 4 * s);
    ctx.restore();
  }
  // 满山的火车火马（6:17）与亚兰的军兵
  let HOST = null;
  function hostModel() {
    const k = W.w + 'x' + W.h;
    if (HOST && HOST.k === k) return HOST;
    const fire = [], foe = [];
    const xd = X.dothan;
    // 远山、中丘
    for (let i = 0; i < 17; i++) { const x = 0.575 + i * 0.026 + (rt(i + 100) - 0.5) * 0.01; fire.push({ l: 0, x, v: 0, i }); }
    for (let i = 0; i < 14; i++) { const x = 0.515 + i * 0.035 + (rt(i + 130) - 0.5) * 0.012; fire.push({ l: 1, x, v: 0, i: i + 1 }); }
    // 近处：围绕多坍的山，与河东
    for (const [x, v] of [[0.508, 0.1], [0.555, 0.3], [0.525, 0.46], [0.59, 0.07], [0.975, 0.3], [0.955, 0.62]]) fire.push({ l: 2, x, v, i: fire.length });
    for (const f of fire) { f.thr = clamp(Math.abs(f.x - xd) / 0.42, 0, 1) * 0.75 + (f.l === 0 ? 0.12 : 0); f.d = f.x < xd ? 1 : -1; }
    for (let i = 0; i < 16; i++) foe.push({ l: 1, x: 0.53 + i * 0.03 + (rt(i + 160) - 0.5) * 0.01, torch: i % 2 === 0 });
    // 山脊的线（火光沿着山脊）
    const ridge = l => { const pts = []; const x0 = l ? 0.5 : 0.56; for (let i = 0; i <= 40; i++) { const xf = lerp(x0, 1, i / 40); pts.push([xf * W.w, gY(l, xf) + 1]); } return pts; };
    HOST = { k, fire, foe, r0: ridge(0), r1: ridge(1) };
    return HOST;
  }
  function drawFireHost(ctx, l) {
    const k = W.lv.esFire, rb = W.lv.esRumble;
    if (k < 0.01 && rb < 0.01) return;
    const H = hostModel();
    SP || sprites();
    // 山脊上的火光
    if (k > 0.01 && l < 2) {
      const pts = l ? H.r1 : H.r0;
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [lw, a, c] of [[16, 0.06, 'rgb(255,140,60)'], [6, 0.16, 'rgb(255,170,80)'], [2, 0.35, 'rgb(255,230,170)']]) {
        ctx.strokeStyle = c; ctx.lineWidth = lw * SU() * (l ? 1 : 0.7); ctx.globalAlpha = a * Math.min(1, k * 1.4);
        ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    for (const f of H.fire) {
      if (f.l !== l) continue;
      let a = clamp((k * 1.25 - f.thr) * 3.2, 0, 1);
      let x = f.x * W.w;
      if (rb > 0.01 && l === 0) { a = Math.max(a, rb * 0.3); x -= ((W.t * 0.02 * W.w) % (0.1 * W.w)) * rb; }
      if (a < 0.01) continue;
      const y = l === 2 ? fieldY(f.x, f.v) : gY(l, f.x) + 1, kk = PH(l) / 30 * (l === 2 ? 1.05 : 1.15);
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + f.i * 1.3);
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.fire, x - f.d * 6 * kk, y - 16 * kk, 34 * kk, a * 0.45 * fl); ctx.globalCompositeOperation = 'source-over'; }
      drawFireSprite(ctx, f.i, x, y, kk, f.d, a * fl);
    }
    ctx.globalAlpha = 1;
  }
  function drawFoeHost(ctx) {
    const k = W.lv.esHost;
    if (k < 0.01) return;
    const H = hostModel(), s = LS(1), nk = nightK(), bl = W.lv.esBlind;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([54, 46, 44], 1);
    ctx.beginPath();
    for (const f of H.foe) {
      const x = f.x * W.w, y = gY(1, f.x) + 1, h = PH(1) * 0.9;
      ctx.rect(x - h * 0.08, y - h * 0.8, h * 0.16, h * 0.8);
      ctx.moveTo(x + h * 0.08, y - h * 0.88); ctx.arc(x, y - h * 0.88, h * 0.08, 0, TAU);
    }
    ctx.fill();
    ctx.strokeStyle = css([90, 76, 60], 1);
    ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath();
    for (const f of H.foe) { const x = f.x * W.w, y = gY(1, f.x) + 1, h = PH(1) * 0.9; ctx.moveTo(x + h * 0.18, y); ctx.lineTo(x + h * 0.18, y - h * 1.25); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (S.torches && nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const f of H.foe) {
        if (!f.torch) continue;
        const x = f.x * W.w + PH(1) * 0.18, y = gY(1, f.x) - PH(1) * 1.2;
        glowSp(ctx, SP.warm, x, y, 10 * SU(), k * nk * (0.6 + 0.2 * Math.sin(W.t * 9 + f.x * 50)) * (1 - bl));
        glowSp(ctx, SP.gold, x, y, 2 * SU(), k * nk * (1 - bl));
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 眼目昏迷（6:18）：一层灰白的雾罩住亚兰人
  function drawBlind(ctx) {
    const k = W.lv.esBlind;
    if (k < 0.01 || !SP) return;
    const c = C();
    if (!c || !c.crowds) return;
    ctx.globalAlpha = 1;
    for (const gid of ['aramA', 'aramB']) {
      const g = c.crowds.get(gid);
      if (!g) continue;
      for (const m of g.members) {
        if (!m._vis) continue;
        glowSp(ctx, SP.mist, m._x, m._y - (m._h || 30) * 0.8, (m._h || 30) * 0.5, 0.5 * k * m.alpha);
      }
    }
  }
  // 车马的声音（7:6）：远山上滚过一阵阵的尘与声波
  function drawRumble(ctx) {
    const k = W.lv.esRumble;
    if (k < 0.01 || !SP) return;
    const s = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 4; i++) {
      const ph = U.fract(W.t * 0.35 + i / 4), x = lerp(1.05, 0.55, ph) * W.w, y = gY(0, clamp(lerp(1.05, 0.55, ph), 0, 1)) - 4 * s;
      ctx.strokeStyle = 'rgba(255,226,180,1)';
      ctx.lineWidth = Math.max(0.8, 1.4 * s);
      ctx.globalAlpha = k * 0.25 * Math.sin(ph * Math.PI);
      for (let j = 0; j < 3; j++) { const r = (30 + j * 26 + ph * 40) * s; ctx.beginPath(); ctx.arc(x, y, r, Math.PI * 1.05, Math.PI * 1.6); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 10; i++) {
      const ph = U.fract(W.t * 0.12 + i / 10), xf = lerp(1.02, 0.56, ph), x = xf * W.w, y = gY(0, clamp(xf, 0, 1));
      const r = (14 + 22 * ph) * s;
      ctx.globalAlpha = k * 0.35 * Math.sin(ph * Math.PI) * (0.4 + 0.6 * W.daylight + 0.3);
      ctx.drawImage(SP.dust, x - r, y - r * 0.9, r * 2, r * 1.4);
    }
    ctx.globalAlpha = 1;
  }
  // 冠冕（11:12）与弓箭（13:15–17）
  function drawCrown(ctx) {
    if (!S.crown) return;
    const p = figPt(S.crown, 1.02);
    if (!p) return;
    const s = LS(2) * 0.9;
    ctx.fillStyle = css(GOLD, 2, 1, 0.3);
    ctx.beginPath();
    ctx.moveTo(p[0] - 3 * s, p[1] + 1 * s); ctx.lineTo(p[0] - 3 * s, p[1] - 1.5 * s); ctx.lineTo(p[0] - 1.5 * s, p[1] - 0.3 * s); ctx.lineTo(p[0], p[1] - 2.2 * s);
    ctx.lineTo(p[0] + 1.5 * s, p[1] - 0.3 * s); ctx.lineTo(p[0] + 3 * s, p[1] - 1.5 * s); ctx.lineTo(p[0] + 3 * s, p[1] + 1 * s); ctx.closePath(); ctx.fill();
    if (SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.gold, p[0], p[1], 7 * s, 0.5); ctx.globalCompositeOperation = 'source-over'; }
  }
  function drawBow(ctx) {
    if (!S.bow) return;
    const p = figPt('kingJ', 0.62), f = fig('kingJ');
    if (!p || !f) return;
    const s = LS(2), d = f.fd >= 0 ? 1 : -1, x = p[0] + d * 5 * s, y = p[1];
    ctx.strokeStyle = css([120, 86, 50], 2); ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath(); ctx.arc(x - d * 4 * s, y, 8 * s, -0.95, 0.95, false); ctx.stroke();
    if (d < 0) { ctx.beginPath(); ctx.arc(x - d * 4 * s, y, 8 * s, Math.PI - 0.95, Math.PI + 0.95, false); ctx.stroke(); }
    ctx.strokeStyle = css([230, 220, 200], 2, 0.7); ctx.lineWidth = Math.max(0.3, 0.5 * s);
    const bx = x - d * 4 * s + d * Math.cos(0.95) * 8 * s;
    ctx.beginPath(); ctx.moveTo(bx, y - Math.sin(0.95) * 8 * s); ctx.lineTo(bx, y + Math.sin(0.95) * 8 * s); ctx.stroke();
  }
  // 耶和华的得胜箭（13:17）：自东窗射向初升的日头
  function drawArrow(ctx) {
    const u = tk('arrow');
    if (u < 0 || !SP) return;
    const d = twData('arrow');
    if (!d) return;
    const tx = W.sun && isFinite(W.sun.x) ? W.sun.x : W.w * 0.12, ty = W.sun && isFinite(W.sun.y) ? W.sun.y : W.h * 0.5;
    const pos = t => { const e = ease(t); return [lerp(d.x, tx, e), lerp(d.y, ty, e) - Math.sin(e * Math.PI) * W.h * 0.12]; };
    const [x, y] = pos(u);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,226,160,1)';
    for (let i = 0; i < 3; i++) {
      const t0 = Math.max(0, u - 0.08 - i * 0.06);
      const [ax, ay] = pos(t0);
      ctx.globalAlpha = (0.6 - i * 0.18) * (1 - clamp((u - 0.9) / 0.1, 0, 1));
      ctx.lineWidth = Math.max(0.8, (2.4 - i * 0.6) * SU());
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.gold, x, y, 16 * SU(), 0.9);
    glowSp(ctx, SP.white, x, y, 5 * SU(), 1);
    if (u > 0.85) glowSp(ctx, SP.gold, tx, ty, M() * 0.2 * (u - 0.85) / 0.15, (1 - u) * 6);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 以色列的战车马兵（13:14）：天上远远的一辆火车的影
  function drawEcho(ctx) {
    const k = W.lv.esEcho;
    if (k < 0.01) return;
    const x = W.w * (0.8 + 0.02 * Math.sin(W.t * 0.2)), y = W.h * 0.24, kk = PH(2) / 30 * 1.1;
    fireAura(ctx, x, y, kk, -1, k * 0.35, -1, 0, 1.2);
    chariotUnit(ctx, x, y, kk, -1, W.t * 7, 1, 'fire', k * 0.4);
  }
  // 膏油（9:6）：金色的油滴落在头上
  function drawOil(ctx) {
    const u = tk('oil');
    if (u < 0 || !SP) return;
    const p = figPt('jehu', 1);
    if (!p) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const k = U.fract(u * 3 + i / 7), x = p[0] + (rt(i + 700) - 0.5) * 6 * SU(), y = p[1] - PH(2) * 0.3 + k * PH(2) * 0.35;
      glowSp(ctx, SP.gold, x, y, 3 * SU(), Math.sin(k * Math.PI) * (1 - u));
    }
    glowSp(ctx, SP.gold, p[0], p[1], PH(2) * 0.5, 0.5 * Math.sin(u * Math.PI));
    ctx.globalCompositeOperation = 'source-over';
  }
  // 孩子的温和、晌午的阴影（4:20，4:34）
  function drawShunem(ctx) {
    const gk = W.lv.esGrief, wk = W.lv.esWarm;
    const p = getP('shunem');
    if (!p || p.a < 0.01 || !SP) return;
    const G = houseG(p);
    if (gk > 0.01) {
      const x = G.x, y = G.y - G.h * 0.5, r = G.w * 1.6;
      const gr = ctx.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(24,32,58,' + (0.26 * gk).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(24,32,58,0)');
      ctx.fillStyle = gr;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    if (wk > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, G.x0 + 4 * G.s + G.rw * 0.35, G.roof - G.rh * 0.35, G.rw * 1.2, wk * 0.45 * p.a);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 恩典（13:23）：金光铺满全地，微光自地上升起
  function drawGrace(ctx) {
    const k = W.lv.esGrace;
    if (k < 0.01 || !SP) return;
    const y0 = W.h * 0.62;
    const gr = ctx.createLinearGradient(0, y0, 0, W.h);
    gr.addColorStop(0, 'rgba(255,214,150,0)'); gr.addColorStop(1, 'rgba(255,214,150,' + (0.16 * k).toFixed(3) + ')');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gr;
    ctx.fillRect(W.w * 0.36, y0, W.w * 0.64, W.h - y0);
    for (let i = 0; i < 26; i++) {
      const ph = U.fract(W.t * 0.05 + rt(i + 800)), xf = 0.42 + 0.56 * rt(i + 820), y = lerp(fieldY(xf, rt(i + 840) * 0.8), W.h * 0.55, ph);
      glowSp(ctx, SP.gold, xf * W.w, y, 3 * SU(), k * Math.sin(ph * Math.PI) * 0.8);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 魂的光（以利沙归到列祖）；七个喷嚏；等
  const FXL = [];
  function soul(b, id) {
    if (b.instant) return;
    const p = figPt(id, 0.3);
    if (p) FXL.push({ type: 'soul', t: 0, dur: 4.5, x0: p[0] / W.w, y0: p[1] / W.h });
  }
  function drawFX(ctx) {
    if (!FXL.length || !SP) return;
    for (const e of FXL) {
      const k = e.t / e.dur;
      if (e.type === 'soul') {
        const a = Math.sin(Math.PI * clamp(k, 0, 1));
        const x = e.x0 * W.w + Math.sin(k * 5) * 6, y = (e.y0 - 0.14 * k) * W.h;
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, x, y, PH(2) * (0.6 + k), a * 0.7);
        glowSp(ctx, SP.white, x, y, PH(2) * 0.25, a * 0.9);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  }

  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const SCENE = {
    init() { sprites(); },
    resize() {
      RV = null; RPC.key = ''; RPC.bk = ''; DITCH = null; HOST = null;
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.tx != null) {
          const d = p.tx - p.x, v = p.spd * f;
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else { p.x += Math.sign(d) * v; p.ph += v * W.w / Math.max(4, chariotK(p) * 9) * Math.PI; }
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const k in TW) if (W.t - TW[k].t0 > TW[k].dur + 1) delete TW[k];
      // 装饰：车过处的尘土、旋风脚下的尘
      if (!W.replaying && fx()) {
        dustT += dt;
        if (dustT > 0.14) {
          dustT = 0;
          for (const p of P.values()) if (p.kind === 'chariot' && p.tx != null && p.a > 0.5) { const b = chariotBase(p); fx().dust(b[0] - (p.flip || 1) * 20 * chariotK(p), b[1], 3, [200, 176, 136], 8 * SU(), 'near'); }
          if (W.lv.esWhirl > 0.3) fx().dust(X.elijahE * W.w, fieldY(X.elijahE, X.partV + 0.02), 3, [230, 214, 180], 16 * SU(), 'near');
        }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawGlory(ctx); drawEcho(ctx); return; }
      const l = LAYER_OF_PASS[pass];
      if (l == null) {
        if (pass === 'air') {
          drawWaterLine(ctx);
          for (const p of sortProps()) if (p.kind === 'chariot' && p.a > 0.01 && p.rail) drawChariotRail(ctx, p);
          drawFireHost(ctx, 2);
          drawBlind(ctx);
          drawShunem(ctx);
          drawBeamOn(ctx, S.beam, W.lv.esBeam, 'gold');
          drawBeamOn(ctx, S.spirit, W.lv.esSpirit, 'pale');
          drawWhirl(ctx);
          drawSkyChariot(ctx);
          drawFireFall(ctx);
          drawMantle(ctx);
          drawHarp(ctx);
          drawLeprosy(ctx);
          drawDips(ctx);
          drawAxe(ctx);
          drawOil(ctx);
          drawCrown(ctx);
          drawBow(ctx);
          drawArrow(ctx);
          drawGrace(ctx);
          drawFX(ctx);
        }
        return;
      }
      if (l === 0) { drawRumble(ctx); drawFireHost(ctx, 0); }
      if (l === 1) { drawFoeHost(ctx); drawFireHost(ctx, 1); }
      if (l === 2) { drawJordan(ctx); drawDitches(ctx); drawRipples(ctx); }
      const list = sortProps();
      for (const p of list) {
        if (p.layer !== l || p.a < 0.005 || p.kind === 'chariot' || p.kind === 'bier') continue;
        const fn = DRAW[p.kind];
        if (fn) fn(ctx, p);
      }
    },
    draw(ctx, pass) {
      // 车与抬尸的床：在走兽之后、人之前画（车上的人、床上的人随后画在其上）
      if (!isCur() || pass !== 'near') return;
      for (const p of sortProps()) {
        if (p.a < 0.005) continue;
        if (p.kind === 'chariot') drawChariotProp(ctx, p);
        else if (p.kind === 'bier') drawBier(ctx, p);
      }
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; for (const k in TW) delete TW[k]; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      for (const k in TW) delete TW[k];
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || p.dying) continue;
        const ph = PH(p.layer);
        let px = p.x * W.w, py = baseOf(p) - ph * 0.5;
        if (p.kind === 'knoll') { const G = knollG(p); px = G.cx; py = knollY(p, G.cx) + G.h * 0.3; }
        else if (p.kind === 'city') { const G = cityG(p); py = G.base - G.wh * 1.2; }
        else if (p.kind === 'house') { const G = houseG(p); py = G.roof + G.h * 0.4; }
        else if (p.kind === 'temple') py = baseOf(p) - ph * 1.1;
        else if (p.kind === 'tomb') py = baseOf(p) - ph * 0.4;
        else if (p.kind === 'field' || p.kind === 'loaves' || p.kind === 'cloths') { px = (p.x + (p.x1 || p.x)) / 2 * W.w; py = fieldY(px / W.w, ((p.v || 0) + (p.v1 || p.v || 0)) / 2) - ph * 0.2; }
        else if (p.kind === 'jars') { const q = jarPos(p, 0); px = (p.x + (p.x1 || p.x)) / 2 * W.w; py = q[1] - ph * 0.2; }
        else if (p.kind === 'spring') py = baseOf(p) - ph * 0.1;
        else if (p.kind === 'chariot') { const b = chariotBase(p); px = b[0] - (p.flip || 1) * 10 * chariotK(p); py = b[1] - ph * 0.5; }
        cand(p.label, px, py);
      }
      if (W.lv.esPart > 0.5) { const q = rPt(tAtY(fieldY(X.jT, X.partV))); cand('分开的约旦河水', q[0], q[1]); }
      else { const q = rPt(0.6); cand('约旦河', q[0], q[1]); }
      if (S.mantle === 'ground') cand('以利亚的外衣', X.mantle * W.w, fieldY(X.mantle, X.mantleV));
      if (W.lv.esWhirl > 0.4) { const q = ASC(); cand('旋风', lerp(X.elijahE * W.w, q[0], 0.5), lerp(fieldY(X.elijahE, 0.3), q[1], 0.5)); }
      if (W.lv.esGlory > 0.3) { const q = ASC(); cand('火车火马', q[0], q[1]); }
      if (W.lv.esDitch > 0.5) cand(W.lv.esRed > 0.5 ? '水红如血' : W.lv.esFill > 0.5 ? '满了水的沟' : '谷中的沟', 0.84 * W.w, fieldY(0.84, 0.55));
      if (W.lv.esFire > 0.5) { const H = hostModel(); for (const f of H.fire) if (f.l === 1) cand('满山的火车火马', f.x * W.w, gY(1, f.x) - PH(1) * 0.6); }
      if (W.lv.esAxe > 0.5 && S.axe === 'float') cand('斧头', riverAtV(0.3) * W.w, fieldY(X.jT, 0.3));
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() {
      const r1 = v => Math.round(v * 10) / 10;
      const props = Array.from(P.values()).filter(p => !p.dying).map(p => [p.id, r1(p.ta), r1(p.tgrow), r1(p.tlit), r1(p.tfire), r1(p.topen), r1(p.tfall), Math.round((p.tx != null ? p.tx : p.x) * 100) / 100].join(':')).sort();
      return Object.assign({}, S, { props });
    },
  };
  let dustT = 0;

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const fromOf = b => (b.instant ? 'none' : 'fade');
  function addElisha(b, o) {
    return add('elisha', Object.assign({ label: '以利沙', sex: 'm', age: 'adult', hair: 'none', beard: true, robe: S.mantle === 'elisha' ? ROBE.mantle : ROBE.elisha,
      accent: S.mantle === 'elisha' ? [70, 52, 38] : null, glow: 0.4, from: fromOf(b) }, o || {}));
  }
  // 从高处（山顶、城墙、楼上）下到地上
  function descend(b, id, x, dur) {
    const f = fig(id);
    if (!f) return;
    const p = figPt(id, 0);
    attach(id, null);
    if (p && !b.instant) f.ny = p[1] / W.h;
    fly(id, x, null, { dur: dur || 1.6, pose: 'stand' });
  }
  function palms() {
    prop('palm1', 'palm', { x: 0.79, v: 0.02, size: 1.1, label: '棕树' });
    prop('palm2', 'palm', { x: 0.975, v: 0.06, size: 1.0, flip: -1, label: '棕树' });
    prop('palm3', 'palm', { x: 0.73, v: 0.14, size: 0.8, label: '棕树' });
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：清晨；以利亚正坐在山顶上（1:9）；远处中丘上是撒马利亚
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; for (const k in TW) delete TW[k]; S = fresh(); RV = null; RPC.key = ''; RPC.bk = ''; DITCH = null; HOST = null; }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 0.9, herbs: 0.75, trees: 0, lights: 1, moon: 1, stars: 1, life: 1,
      good: 0, given: 1, sabbath: 0.1, bare: 0.15, bloom: 0.55 };
    for (const k of LEVELS0) lv[k] = 0;
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 22, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    prop('knoll', 'knoll', { x: X.knoll, hw: 58, wh: 60, label: '山顶' });
    prop('samfar', 'samfar', { x: X.samFar, layer: 1, lit: 1, label: '撒马利亚' });
    const c = C();
    c.clear({ fade: false });
    add('elijah', { label: '以利亚', sex: 'm', age: 'elder', robe: ROBE.elijah, accent: [58, 40, 28], glow: 0.45, prop: 'staff', pose: 'sit', facing: 1, x: X.knoll, from: 'none' });
    attach('elijah', knollPt('knoll', 0));
    avoid([0.42, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟）
  // ════════════════════════════════════════════════════════════
  const R_ = ref => '列王纪下 ' + ref;
  const INTRO = [
    { text: '亚哈死后，摩押背叛以色列。', ref: R_('1:1'), hold: 4 },
    { text: '亚哈谢在撒马利亚，一日从楼上的栏杆里掉下来，就病了；于是差遣使者说：<br>「你们去问以革伦的神巴力‧西卜，我这病能好不能好。」', ref: R_('1:2'), hold: 7 },
  ];
  const V1 = [
    { text: '但耶和华的使者对提斯比人以利亚说：「你起来，去迎着撒马利亚王的使者，<br>对他们说：『你们去问以革伦神巴力‧西卜，岂因以色列中没有神吗？』」', ref: R_('1:3'), hold: 7 },
    { text: '于是，王差遣五十夫长，带领五十人去见以利亚……以利亚正坐在山顶上……<br>于是有火从天上降下来，烧灭五十夫长和他那五十人。', ref: R_('1:9–10'), hold: 7.5 },
    { text: '王第三次差遣一个五十夫长……这五十夫长上去，双膝跪在以利亚面前……<br>耶和华的使者对以利亚说：「你同着他下去，不要怕他！」以利亚就起来，同着他下去见王', ref: R_('1:13–15'), hold: 7.5 },
    { text: '亚哈谢果然死了，正如耶和华藉以利亚所说的话。', ref: R_('1:17'), hold: 5 },
  ];
  const V2 = [
    { text: '以利亚对以利沙说：「耶和华差遣我往约旦河去，你可以在这里等候。」<br>以利沙说：「我指着永生的耶和华，又敢在你面前起誓，我必不离开你。」于是二人一同前往。', ref: R_('2:6'), hold: 8 },
    { text: '有先知门徒去了五十人，远远地站在他们对面；二人在约旦河边站住。', ref: R_('2:7'), hold: 5.5 },
    { text: '以利亚将自己的外衣卷起来，用以打水，水就左右分开，二人走干地而过。', ref: R_('2:8'), hold: 6 },
  ];
  const V3 = [
    { text: '过去之后，以利亚对以利沙说：「我未曾被接去离开你，你要我为你做什么，只管求我。」<br>以利沙说：「愿感动你的灵加倍地感动我。」', ref: R_('2:9'), hold: 7.5 },
    { text: '他们正走着说话，忽有火车火马将二人隔开，以利亚就乘旋风升天去了。', ref: R_('2:11'), hold: 6.5 },
    { text: '以利沙看见，就呼叫说：「我父啊！我父啊！以色列的战车马兵啊！」<br>以后不再见他了。', ref: R_('2:12'), hold: 7 },
  ];
  const V4 = [
    { text: '他拾起以利亚身上掉下来的外衣，回去站在约旦河边……<br>打水之后，水也左右分开，以利沙就过来了。', ref: R_('2:13–14'), hold: 7 },
    { text: '住耶利哥的先知门徒从对面看见他，就说：「感动以利亚的灵感动以利沙了。」<br>他们就来迎接他，在他面前俯伏于地', ref: R_('2:15'), hold: 7 },
    { text: '他出到水源，将盐倒在水中，说：「耶和华如此说：<br>『我治好了这水，从此必不再使人死，也不再使地土不生产。』」', ref: R_('2:21'), hold: 7 },
    { text: '于是那水治好了，直到今日，正如以利沙所说的。', ref: R_('2:22'), hold: 4.8 },
  ];
  const V5 = [
    { text: '于是，以色列王和犹大王，并以东王，都一同去绕行七日的路程；<br>军队和所带的牲畜没有水喝。', ref: R_('3:9'), hold: 6.5 },
    { text: '弹琴的时候，耶和华的灵就降在以利沙身上。<br>他便说：「耶和华如此说：『你们要在这谷中满处挖沟……』」', ref: R_('3:15–16'), hold: 7 },
    { text: '次日早晨，约在献祭的时候，有水从以东而来，遍地就满了水。', ref: R_('3:20'), hold: 6 },
    { text: '次日早晨，日光照在水上，摩押人起来，看见对面水红如血', ref: R_('3:22'), hold: 5.5 },
  ];
  const V6 = [
    { text: '以利沙问她说：「我可以为你做什么呢？你告诉我，你家里有什么？」<br>她说：「婢女家中除了一瓶油之外，没有什么。」', ref: R_('4:2'), hold: 6.5 },
    { text: '……儿子把器皿拿来，她就倒油。器皿都满了……<br>儿子说：「再没有器皿了。」油就止住了。', ref: R_('4:5–6'), hold: 6.5 },
    { text: '有一个人从巴力‧沙利沙来，带着初熟大麦做的饼二十个……<br>以利沙说：「你只管给众人吃吧！因为耶和华如此说，众人必吃了，还剩下。」', ref: R_('4:42–43'), hold: 7.5 },
    { text: '仆人就摆在众人面前，他们吃了，果然还剩下，正如耶和华所说的。', ref: R_('4:44'), hold: 5.5 },
  ];
  const V7 = [
    { text: '以利沙说：「明年到这时候，你必抱一个儿子。」……<br>妇人果然怀孕，到了那时候，生了一个儿子，正如以利沙所说的。', ref: R_('4:16–17'), hold: 6.5 },
    { text: '他对父亲说：「我的头啊，我的头啊！」……孩子坐在母亲的膝上，到晌午就死了。<br>他母亲抱他上了楼，将他放在神人的床上', ref: R_('4:19–21'), hold: 7 },
    { text: '上床伏在孩子身上，口对口，眼对眼，手对手；<br>既伏在孩子身上，孩子的身体就渐渐温和了。', ref: R_('4:34'), hold: 7 },
    { text: '……孩子打了七个喷嚏，就睁开眼睛了……<br>妇人就进来，在以利沙脚前俯伏于地，抱起她儿子出去了。', ref: R_('4:35–37'), hold: 6.5 },
  ];
  const V8 = [
    { text: '亚兰王的元帅乃缦在他主人面前为尊为大……<br>他又是大能的勇士，只是长了大麻风。', ref: R_('5:1'), hold: 6.5 },
    { text: '于是，乃缦带着车马到了以利沙的家，站在门前。以利沙打发一个使者，对乃缦说：<br>「你去在约旦河中沐浴七回，你的肉就必复原，而得洁净。」', ref: R_('5:9–10'), hold: 7.5 },
    { text: '于是乃缦下去，照着神人的话，在约旦河里沐浴七回；<br>他的肉复原，好像小孩子的肉，他就洁净了。', ref: R_('5:14'), hold: 7 },
    { text: '乃缦带着一切跟随他的人，回到神人那里，站在他面前，说：<br>「如今我知道，除了以色列之外，普天下没有神……」', ref: R_('5:15'), hold: 6.5 },
  ];
  const V9 = [
    { text: '先知门徒对以利沙说：「看哪，我们同你所住的地方过于窄小，<br>求你容我们往约旦河去，各人从那里取一根木料建造房屋居住。」', ref: R_('6:1–2'), hold: 7 },
    { text: '于是以利沙与他们同去。到了约旦河，就砍伐树木。有一人砍树的时候，<br>斧头掉在水里，他就呼叫说：「哀哉！我主啊，这斧子是借的。」', ref: R_('6:4–5'), hold: 7 },
    { text: '神人问说：「掉在哪里了？」他将那地方指给以利沙看。以利沙砍了一根木头，抛在水里，斧头就漂上来了。<br>以利沙说：「拿起来吧！」那人就伸手拿起来了。', ref: R_('6:6–7'), hold: 8 },
  ];
  const V10 = [
    { text: '神人的仆人清早起来出去，看见车马军兵围困了城……<br>神人说：「不要惧怕！与我们同在的比与他们同在的更多。」', ref: R_('6:15–16'), hold: 7.5 },
    { text: '以利沙祷告说：「耶和华啊，求你开这少年人的眼目，使他能看见。」<br>耶和华开他的眼目，他就看见满山有火车火马围绕以利沙。', ref: R_('6:17'), hold: 8 },
    { text: '……耶和华就照以利沙的话，使他们的眼目昏迷……<br>从此，亚兰军不再犯以色列境了。', ref: R_('6:18–23'), hold: 6.5 },
  ];
  const V11 = [
    { text: '此后，亚兰王便‧哈达聚集他的全军，上来围困撒马利亚。<br>于是撒马利亚被围困，有饥荒……', ref: R_('6:24–25'), hold: 6 },
    { text: '以利沙说：「你们要听耶和华的话，耶和华如此说：<br>明日约到这时候，在撒马利亚城门口，一细亚细面要卖银一舍客勒……」', ref: R_('7:1'), hold: 7 },
    { text: '因为主使亚兰人的军队听见车马的声音，是大军的声音……所以，在黄昏的时候他们起来逃跑，<br>撇下帐棚、马、驴，营盘照旧，只顾逃命。', ref: R_('7:6–7'), hold: 7 },
    { text: '众人就出去，掳掠亚兰人的营盘。于是一细亚细面卖银一舍客勒，<br>二细亚大麦也卖银一舍客勒，正如耶和华所说的。', ref: R_('7:16'), hold: 7 },
  ];
  const V12 = [
    { text: '先知以利沙叫了一个先知门徒来，吩咐他说：<br>「你束上腰，手拿这瓶膏油往基列的拉末去。」', ref: R_('9:1'), hold: 6.5 },
    { text: '耶户就起来，进了屋子，少年人将膏油倒在他头上，对他说：<br>「耶和华以色列的神如此说：『我膏你作耶和华民以色列的王。』」', ref: R_('9:6'), hold: 7.5 },
    { text: '他们就急忙各将自己的衣服铺在上层台阶，使耶户坐在其上；<br>他们吹角，说：「耶户作王了！」', ref: R_('9:13'), hold: 6.5 },
    { text: '……车赶得甚猛，像宁示的孙子耶户的赶法……<br>这样，耶户在以色列中灭了巴力。', ref: R_('9:20—10:28'), hold: 6.5 },
  ];
  const V13 = [
    { text: '耶和华却因他仆人大卫的缘故，仍不肯灭绝犹大，<br>照他所应许大卫的话，永远赐灯光与他的子孙。', ref: R_('8:19'), hold: 7 },
    { text: '……亚哈谢的妹子约示巴，将亚哈谢的儿子约阿施从那被杀的王子中偷出来……<br>约阿施和他的乳母藏在耶和华的殿里六年', ref: R_('11:2–3'), hold: 7 },
    { text: '祭司领王子出来，给他戴上冠冕，将律法书交给他，膏他作王；<br>众人就拍掌说：「愿王万岁！」', ref: R_('11:12'), hold: 6.5 },
    { text: '祭司耶何耶大取了一个柜子，在柜盖上钻了一个窟窿，<br>放于坛旁，在进耶和华殿的右边', ref: R_('12:9'), hold: 6 },
  ];
  const V14 = [
    { text: '以利沙得了必死的病，以色列王约阿施下来看他，伏在他脸上哭泣，说：<br>「我父啊！我父啊！以色列的战车马兵啊！」', ref: R_('13:14'), hold: 6.5 },
    { text: '以利沙说：「射箭吧！」他就射箭。<br>以利沙说：「这是耶和华的得胜箭，就是战胜亚兰人的箭……」', ref: R_('13:17'), hold: 6.5 },
    { text: '以利沙死了，人将他葬埋……有人正葬死人，忽然看见一群人，就把死人抛在以利沙的坟墓里，<br>一碰着以利沙的骸骨，死人就复活，站起来了。', ref: R_('13:20–21'), hold: 7.5 },
    { text: '耶和华却因与亚伯拉罕、以撒、雅各所立的约，仍施恩给以色列人，<br>怜恤他们，眷顾他们，不肯灭尽他们……', ref: R_('13:23'), hold: 7 },
  ];

  // ════════════════════════════════════════════════════════════
  //  十四句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 岂因以色列中没有神吗？（1:1–18）── 山顶；天火；王死了 ─────────
    {
      kind: 'ask', utter: '岂因以色列中没有神吗？', cmd: 'grep -r 神 ./以色列  # 何必去问以革伦', ref: '1:3', tint: [255, 214, 170],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        const band = 0.905;
        T(c, [
          [0, b => {
            W.goTo(0.36, 9, b.instant);
            S.beam = 'elijah'; W.set('esBeam', 0.85, b.instant);
            crowd('msgs', { n: 3, x0: 1.02, x1: 1.08, layer: 2, v: 0.14, label: '王的使者', robe: [134, 110, 92], from: fromOf(b), mill: false });
            crowdWalk('msgs', 0.86, 0.9, { speed: 0.03 });
            pose('elijah', 'stand'); face('elijah', 1);
            sfx(b, 'harp', { soft: true });
          }],
          [3.5, () => { pose('elijah', 'point'); }],
          [L[1] - 1.8, b => { crowdWalk('msgs', 1.05, 1.1, { speed: 0.03 }); W.set('esBeam', 0.25, b.instant); pose('elijah', 'sit'); }],
          [L[1], b => {
            uncrowd('msgs');
            add('cap1', { label: '五十夫长', sex: 'm', age: 'adult', x: 1.03, v: 0.1, facing: -1, robe: ROBE.captain, prop: 'staff', glow: 0.1, from: fromOf(b) });
            crowd('band1', { n: 6, x0: 1.04, x1: 1.12, layer: 2, v: 0.06, label: '五十人', robe: ROBE.soldier, prop: 'staff', from: fromOf(b), mill: false });
            walk('cap1', 0.865, { speed: 0.035 });
            crowdWalk('band1', 0.88, 0.95, { speed: 0.035 });
          }],
          [L[1] + 3.2, () => { pose('cap1', 'point'); pose('elijah', 'stand'); }],
          [L[1] + 4.2, b => { pose('elijah', 'raise'); tween(b, 'firefall', 2.4, { x: band }); sfx(b, 'fire'); sfx(b, 'thunder', { low: true }); }],
          [L[1] + 5.1, b => {
            // 火从天上降下来（1:10）：五十夫长和他那五十人不见了，只剩地上的余烬
            rm('cap1', true); uncrowd('band1', true);
            W.set('esScorch', 1, true); W.set('esScorch', 0, b.instant);
            flash(b, 0.5); shake(b, 0.35);
            ringAt(b, band * W.w, fieldY(band, 0.1), [255, 190, 120], PH(2) * 3, 1.6);
          }],
          [L[1] + 7, () => { pose('elijah', 'sit'); }],
          [L[2], b => {
            add('cap3', { label: '第三个五十夫长', sex: 'm', age: 'adult', x: 1.03, v: 0.12, facing: -1, robe: [132, 100, 80], glow: 0.15, from: fromOf(b) });
            crowd('band3', { n: 5, x0: 1.04, x1: 1.1, layer: 2, v: 0.05, label: '五十个仆人', robe: [120, 100, 84], from: fromOf(b), mill: false });
            walk('cap3', 0.83, { speed: 0.04, pose: 'pray' });
            crowdWalk('band3', 0.9, 0.97, { speed: 0.035, pose: 'kneel' });
          }],
          [L[2] + 3.4, b => {
            // 耶和华的使者对以利亚说：「你同着他下去，不要怕他！」
            add('angel', { label: '耶和华的使者', angel: true, x: X.knoll + 0.02, from: b.instant ? 'none' : 'light', glow: 0.8, facing: -1 });
            attach('angel', knollPt('knoll', 0.4));
            W.set('esBeam', 0.9, b.instant);
            pose('elijah', 'stand'); face('elijah', 1);
            sfx(b, 'angel', { soft: true });
          }],
          [L[2] + 5.8, b => {
            attach('angel', null); rm('angel');
            W.set('esBeam', 0.3, b.instant);
            attach('elijah', null);
            const f = fig('elijah'), top = knollPt('knoll', 0)();
            if (f && top && !b.instant) f.ny = top[1] / W.h;
            fly('elijah', X.knoll + 0.052, null, { dur: 1.8, pose: 'stand' });
            pose('cap3', 'stand'); crowdPose('band3', 'stand');
          }],
          [L[2] + 7.8, () => {
            walk('cap3', 1.06, { speed: 0.03 }); crowdWalk('band3', 1.08, 1.14, { speed: 0.03 });
            walk('elijah', 1.04, { speed: 0.03 });
          }],
          [L[3], b => {
            // 亚哈谢果然死了：远处王楼上的灯熄了
            prop('samfar', null, { lit: 0 });
            W.set('esBeam', 0, b.instant); S.beam = null;
            sfx(b, 'weep', { soft: true, far: true });
          }],
          [L[3] + 3.5, () => { rm('elijah'); rm('cap3'); uncrowd('band3'); }],
        ]);
      },
    },

    // ── 2 · 耶和华差遣我往约旦河去（2:1–8）── 耶利哥；外衣打水，水左右分开 ───
    {
      kind: 'act', utter: '耶和华差遣我往约旦河去', cmd: 'cd ~/约旦河  # 我必不离开你', ref: '2:6', tint: [230, 220, 200],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const v = X.partV;
        T(c, [
          [0, b => {
            unprop('knoll'); unprop('samfar');
            prop('jericho', 'city', { x: X.jericho, hw: 60, wh: 24, gate: -0.55, rgb: [190, 164, 122], label: '耶利哥' });
            palms();
            W.goTo(0.62, 14, b.instant);
            add('elijah', { label: '以利亚', sex: 'm', age: 'elder', robe: ROBE.elijah, accent: [58, 40, 28], glow: 0.45, prop: 'staff', x: 1.03, v, facing: -1, from: 'none' });
            addElisha(b, { x: 1.065, v, facing: -1, from: 'none' });
            walk('elijah', 0.8, { speed: 0.032 });
            follow('elisha', 'elijah', 0.03);
            crowd('sons', { n: 8, x0: 0.8, x1: 0.94, layer: 2, v: 0.04, label: '先知门徒', robe: ROBE.son, from: fromOf(b) });
            avoid([0.42, 1]);
          }],
          [6.5, () => { walk('elijah', westEdge(v), { speed: 0.03 }); }],
          [L[1], () => {
            crowdWalk('sons', 0.72, 0.8, { speed: 0.02 });
            crowdFace('sons', -1);
          }],
          [L[1] + 3.5, () => { crowdFace('sons', -1); face('elijah', -1); face('elisha', -1); }],
          [L[2] - 0.4, b => { unfollow('elisha'); pose('elijah', 'raise'); tween(b, 'whip', 1.2, { id: 'elijah', wx: riverAtV(v) }); }],
          [L[2] + 0.7, b => {
            W.set('esPart', 1, b.instant);
            const x = riverAtV(v) * W.w, y = fieldY(X.jT, v);
            ringAt(b, x, y, [220, 240, 255], PH(2) * 1.6, 1.4); sparkAt(b, x, y, 20, [220, 240, 255], 10);
            sfx(b, 'splash', { size: 2 }); sfx(b, 'wind', { low: true });
            shake(b, 0.15);
          }],
          [L[2] + 1.6, () => {
            pose('elijah', 'stand');
            walk('elijah', X.elijahE, { speed: 0.03 }); follow('elisha', 'elijah', 0.028);
          }],
          [L[2] + 6, b => {
            unfollow('elisha'); walk('elisha', X.elishaE, { speed: 0.02 });
            W.set('esPart', 0, b.instant);
            face('elijah', 1); face('elisha', -1);
            sfx(b, 'splash', { size: 1.5, soft: true });
          }],
        ]);
      },
    },

    // ── 3 · 耶和华要用旋风接以利亚升天（2:9–12）── 火车火马；旋风；外衣飘落 ──
    {
      kind: 'act', utter: '耶和华要用旋风接以利亚升天', cmd: 'chariot --fire --horses 火 | whirlwind --up 以利亚', ref: '2:1', tint: [255, 196, 120],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.765, 13, b.instant);
            W.set('clouds', 0.7, b.instant);
            face('elijah', 1); face('elisha', -1);
            pose('elisha', 'stand'); pose('elijah', 'point');
          }],
          [3.5, () => { pose('elijah', 'stand'); pose('elisha', 'raise'); }],
          [6, () => { pose('elisha', 'stand'); }],
          [L[1] - 2, b => { W.set('gale', 0.45, b.instant); sfx(b, 'wind'); }],
          [L[1] - 0.6, b => { tween(b, 'chariot', 10); sfx(b, 'fire'); sfx(b, 'thunder', { low: true, far: true }); }],
          [L[1] + 3.2, b => {
            // 火车火马将二人隔开
            walk('elisha', X.elishaE + 0.026, { speed: 0.04, pose: 'raise' });
            face('elisha', -1);
            flash(b, 0.35); shake(b, 0.25);
            W.set('esWhirl', 1, b.instant);
            sfx(b, 'wind', { low: true });
          }],
          [L[1] + 4.8, b => {
            // 以利亚就乘旋风升天去了
            const [ax, ay] = ASC();
            pose('elijah', 'raise');
            add('elijah', { robe: [236, 218, 184], accent: [255, 236, 200], prop: null });
            fly('elijah', ax / W.w, ay / W.h + 0.04, { dur: 7, pose: 'raise' });
            glow('elijah', 0.9);
            W.set('esGlory', 1, b.instant);
            tween(b, 'mfall', 6.5);
            sfx(b, 'angel');
          }],
          [L[2], b => { pose('elisha', 'raise'); face('elisha', -1); sfx(b, 'weep', { soft: true }); }],
          [L[2] + 1.2, b => { rm('elijah'); S.mantle = 'ground'; W.set('gale', 0.1, b.instant); }],
          [L[2] + 3.2, b => { pose('elisha', 'weep'); W.set('esWhirl', 0, b.instant); }],
          [L[2] + 6, b => { pose('elisha', 'kneel'); W.set('esGlory', 0.3, b.instant); }],
        ]);
      },
    },

    // ── 4 · 耶和华以利亚的神在哪里呢？（2:13–25）── 外衣再打水；水源被盐治好 ──
    {
      kind: 'ask', utter: '耶和华以利亚的神在哪里呢？', cmd: 'which 耶和华以利亚的神  # 水也左右分开', ref: '2:14', tint: [220, 236, 255],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const v = X.partV;
        T(c, [
          [0, b => {
            W.goTo(0.772, 6, b.instant);
            W.set('esGlory', 0, b.instant); W.set('gale', 0, b.instant); W.set('clouds', 0.45, b.instant);
            pose('elisha', 'stand');
            walk('elisha', X.mantle + 0.012, { speed: 0.03, pose: 'bow' });
          }],
          [2.4, b => {
            // 他拾起以利亚身上掉下来的外衣
            S.mantle = 'elisha';
            add('elisha', { robe: ROBE.mantle, accent: [70, 52, 38] });
            sparkOn(b, 'elisha', 0.4, 18, [255, 220, 170], 10);
            sfx(b, 'harp', { soft: true });
          }],
          [3.4, () => { pose('elisha', 'stand'); walk('elisha', eastEdge(v), { speed: 0.03 }); }],
          [5, b => { face('elisha', 1); pose('elisha', 'raise'); tween(b, 'whip', 1.2, { id: 'elisha', wx: riverAtV(v) }); }],
          [6, b => {
            W.set('esPart', 1, b.instant);
            const x = riverAtV(v) * W.w, y = fieldY(X.jT, v);
            ringAt(b, x, y, [220, 240, 255], PH(2) * 1.6, 1.4); sparkAt(b, x, y, 20, [220, 240, 255], 10);
            sfx(b, 'splash', { size: 2 }); sfx(b, 'wind', { low: true });
            shake(b, 0.15);
          }],
          [7, () => { pose('elisha', 'stand'); walk('elisha', 0.69, { speed: 0.03 }); }],
          [L[1], b => {
            crowdProp('sons', 'torch');
            crowdWalk('sons', 0.715, 0.8, { speed: 0.025 });
            crowdFace('sons', -1);
          }],
          [L[1] + 2.4, b => { W.set('esPart', 0, b.instant); sfx(b, 'splash', { soft: true }); }],
          [L[1] + 3.2, b => { crowdPose('sons', 'fall'); sfx(b, 'crowd', { soft: true }); }],
          [L[1] + 6.2, () => { crowdPose('sons', 'stand'); }],
          [L[2], b => {
            W.goTo(0.28, 7, b.instant);
            crowdProp('sons', null);
            prop('spring', 'spring', { x: X.spring, v: X.springV, label: '水源' });
            walk('elisha', X.spring - 0.022, { speed: 0.025 });
            propOf('elisha', 'jar');
          }],
          [L[2] + 3.8, b => { pose('elisha', 'kneel'); face('elisha', 1); }],
          [L[2] + 4.8, b => {
            // 将盐倒在水中
            const x = X.spring * W.w, y = fieldY(X.spring, X.springV);
            sparkAt(b, x, y - 4, 26, [255, 255, 250], 8);
            W.set('esSpring', 1, b.instant);
            ringAt(b, x, y, [200, 240, 255], PH(2) * 1.2, 1.6);
            sfx(b, 'splash', { soft: true }); sfx(b, 'harp');
          }],
          [L[3], b => {
            // 于是那水治好了：水边、城边的地绿了，花开了
            const x = X.spring * W.w, y = fieldY(X.spring, X.springV);
            W.setOrigin('grass', x, y); W.setOrigin('herbs', x, y);
            W.set('grass', 1, b.instant); W.set('herbs', 0.95, b.instant); W.set('bloom', 0.95, b.instant); W.set('bare', 0, b.instant);
            pose('elisha', 'stand'); propOf('elisha', null);
          }],
        ]);
      },
    },

    // ── 5 · 你们虽不见风，不见雨，这谷必满了水（3:1–27）── 挖沟；水红如血 ─────
    {
      kind: 'promise', utter: '你们虽不见风，不见雨，这谷必满了水', cmd: 'fill ./谷 --wind=0 --rain=0  # 必满了水', ref: '3:17', tint: [214, 236, 255],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            unprop('jericho'); unprop('palm1'); unprop('palm2'); unprop('palm3'); unprop('spring');
            W.set('bare', 0.9, b.instant); W.set('grass', 0.3, b.instant); W.set('herbs', 0.2, b.instant); W.set('bloom', 0.05, b.instant);
            W.set('esGlory', 0, b.instant);
            W.goTo(0.46, 6, b.instant);
            uncrowd('sons');
            // 三王的营（以色列、犹大、以东的旗）
            [[0.715, [70, 96, 160]], [0.78, [200, 160, 70]], [0.845, [150, 70, 52]], [0.91, null], [0.965, null]].forEach(([x, rgb], i) =>
              prop('tent' + i, 'tent', { x, v: 0.02 + (i % 2) * 0.03, size: 0.9 + 0.1 * (i % 2), rgb, label: '三王的营' }));
            crowd('army', { n: 10, x0: 0.7, x1: 0.97, layer: 2, v: 0.14, label: '军队', robe: ROBE.soldier, pose: 'sit', from: fromOf(b) });
            animal('dk1', 'donkey', 0.935, { v: 0.4, pose: 'lie', label: '牲畜', facing: -1, from: fromOf(b) });
            animal('dk2', 'donkey', 0.975, { v: 0.52, pose: 'lie', label: '牲畜', facing: -1, from: fromOf(b) });
            add('kingI', { label: '以色列王', sex: 'm', age: 'adult', x: 0.745, v: 0.3, facing: -1, robe: ROBE.king, glow: 0.15, from: fromOf(b) });
            add('kingJ3', { label: '犹大王约沙法', sex: 'm', age: 'elder', x: 0.77, v: 0.34, facing: -1, robe: [150, 120, 70], glow: 0.15, from: fromOf(b) });
            add('kingE', { label: '以东王', sex: 'm', age: 'adult', x: 0.795, v: 0.3, facing: -1, robe: [150, 80, 60], glow: 0.15, from: fromOf(b) });
            pose('elisha', 'stand'); walk('elisha', 0.708, { speed: 0.03 });
            avoid([0.42, 1]);
          }],
          [L[1] - 1.2, b => {
            add('harpist', { label: '弹琴的', sex: 'm', age: 'adult', x: 0.684, v: 0.42, facing: 1, pose: 'sit', robe: [150, 134, 110], glow: 0.2, from: fromOf(b) });
          }],
          [L[1], b => {
            S.harp = true;
            W.goTo(0.765, 9, b.instant);
            sfx(b, 'harp');
          }],
          [L[1] + 1.8, b => {
            // 耶和华的灵就降在以利沙身上
            S.spirit = 'elisha'; W.set('esSpirit', 1, b.instant);
            pose('elisha', 'raise');
            sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 4.2, b => {
            // 你们要在这谷中满处挖沟
            pose('elisha', 'point');
            crowdPose('army', 'bow');
            W.set('esDitch', 1, b.instant);
            sfx(b, 'build', { soft: true });
          }],
          [L[2] - 1.2, b => {
            S.harp = false;
            W.set('esSpirit', 0.15, b.instant);
            crowdPose('army', 'sit'); pose('elisha', 'stand'); pose('harpist', 'sit');
            W.goTo(0.255, 6, b.instant);
          }],
          [L[2] + 2.6, b => {
            // 有水从以东而来，遍地就满了水
            W.set('esFill', 1, b.instant);
            sfx(b, 'splash', { size: 3 }); sfx(b, 'wind', { soft: true });
          }],
          [L[2] + 5, b => {
            crowdPose('army', 'kneel'); pose('dk1', 'stand'); pose('dk2', 'stand');
            sfx(b, 'crowd', { soft: true });
          }],
          [L[3], b => {
            // 日光照在水上，水红如血
            W.goTo(0.305, 5, b.instant);
            W.set('esRed', 1, b.instant);
            W.set('esSpirit', 0, b.instant); S.spirit = null;
            crowd('moab', { n: 6, x0: 0.86, x1: 0.97, layer: 0, label: '摩押人', robe: [90, 70, 64], pose: 'point', from: fromOf(b), mill: false });
            crowdPose('army', 'stand');
          }],
        ]);
      },
    },

    // ── 6 · 众人必吃了，还剩下（4:1–7，38–44）── 器皿满了油；二十个饼 ──────────
    {
      kind: 'promise', utter: '众人必吃了，还剩下', cmd: 'while (器皿) pour 油; done  # 还剩下', ref: '4:43', tint: [255, 222, 150],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            for (let i = 0; i < 5; i++) unprop('tent' + i);
            uncrowd('army'); uncrowd('moab'); rm('dk1'); rm('dk2'); rm('kingI'); rm('kingJ3'); rm('kingE'); rm('harpist');
            W.set('esDitch', 0, b.instant); W.set('esFill', 0, b.instant); W.set('esRed', 0, b.instant);
            W.set('bare', 0.2, b.instant); W.set('grass', 0.9, b.instant); W.set('herbs', 0.7, b.instant); W.set('bloom', 0.6, b.instant);
            W.goTo(0.42, 5, b.instant);
            prop('whouse', 'house', { x: X.house, v: 0.02, open: 1, label: '寡妇的家' });
            add('widow', { label: '先知门徒的妻', sex: 'f', age: 'adult', x: 0.815, v: 0.3, facing: -1, robe: ROBE.widow, glow: 0.3, from: fromOf(b) });
            add('wson1', { label: '她的儿子', sex: 'm', age: 'child', x: 0.838, v: 0.26, facing: -1, robe: [140, 120, 96], glow: 0.2, from: fromOf(b) });
            add('wson2', { label: '她的儿子', sex: 'm', age: 'child', x: 0.853, v: 0.34, facing: -1, robe: [120, 110, 100], glow: 0.2, from: fromOf(b) });
            add('elisha', { v: 0.3 });
            walk('elisha', 0.78, { speed: 0.03 });
            avoid([0.42, 1]);
          }],
          [3, () => { face('elisha', 1); pose('widow', 'bow'); }],
          [5, () => { pose('widow', 'stand'); walk('wson1', 0.872, { speed: 0.04 }); walk('wson2', 0.884, { speed: 0.04 }); }],
          [L[1] - 0.8, b => {
            // 向众邻舍借来的空器皿
            prop('jars', 'jars', { x: 0.705, x1: 0.8, v: 0.46, n: 8, grow: 1, label: '器皿' });
            propOf('wson1', 'jar'); propOf('wson2', 'jar');
            walk('wson1', 0.8, { speed: 0.03 }); walk('wson2', 0.82, { speed: 0.03 });
            walk('widow', 0.7, { speed: 0.03, pose: 'kneel' });
            walk('elisha', 0.66, { speed: 0.03 });
          }],
          [L[1] + 1.5, b => {
            // 她就倒油：一个一个都满了
            propOf('widow', 'jar');
            W.set('esOil', 8, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
          [L[1] + 5, b => { sfx(b, 'harp', { soft: true }); }],
          [L[2] - 0.6, b => {
            // 油就止住了
            propOf('widow', null); pose('widow', 'stand');
            propOf('wson1', null); propOf('wson2', null);
            sparkAt(b, 0.75 * W.w, fieldY(0.75, 0.5) - 10, 24, [255, 220, 140], 30);
          }],
          [L[2], b => {
            walk('widow', 0.85, { speed: 0.025 }); walk('wson1', 0.86, { speed: 0.025 }); walk('wson2', 0.865, { speed: 0.025 });
            add('bsman', { label: '从巴力沙利沙来的人', sex: 'm', age: 'adult', x: 1.03, v: 0.62, facing: -1, robe: [150, 126, 92], prop: 'bundle', glow: 0.2, from: 'none' });
            walk('bsman', 0.79, { speed: 0.035 });
            crowd('feastA', { n: 6, x0: 0.665, x1: 0.8, layer: 2, v: 0.58, label: '先知门徒', robe: ROBE.son, pose: 'sit', from: fromOf(b), mill: false });
            crowd('feastB', { n: 6, x0: 0.68, x1: 0.83, layer: 2, v: 0.86, label: '先知门徒', robe: [124, 112, 96], pose: 'sit', from: fromOf(b), mill: false });
          }],
          [L[2] + 3, () => { rm('widow'); rm('wson1'); rm('wson2'); prop('whouse', null, { open: 0 }); }],
          [L[2] + 4.5, b => {
            prop('loaves', 'loaves', { x: 0.69, x1: 0.8, v: 0.72, n: 20, grow: 1, lit: 0.3, label: '大麦饼' });
            propOf('bsman', null); pose('elisha', 'point');
            sfx(b, 'harp', { soft: true });
          }],
          [L[3], b => {
            // 他们吃了，果然还剩下
            prop('loaves', null, { lit: 1 });
            crowdPose('feastA', 'kneel');
            sfx(b, 'crowd', { soft: true });
          }],
          [L[3] + 3, () => { crowdPose('feastA', 'raise'); pose('elisha', 'stand'); }],
        ]);
      },
    },

    // ── 7 · 耶和华使人死，也使人活（4:8–37）── 书念；墙上的小楼 ─────────────
    {
      kind: 'act', utter: '耶和华使人死，也使人活', cmd: 'revive 孩子 --sneeze 7  # 睁开眼睛', ref: '撒母耳记上 2:6', tint: [255, 214, 180],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        const up = (f, lift) => upperPt('shunem', f, lift);
        T(c, [
          [0, b => {
            unprop('whouse'); unprop('jars'); unprop('loaves');
            uncrowd('feastA'); uncrowd('feastB'); rm('bsman'); rm('widow'); rm('wson1'); rm('wson2');
            W.set('esOil', 0, true);
            W.goTo(0.47, 5, b.instant);
            prop('shunem', 'house', { x: X.house, v: 0.02, open: 1, style: 'upper', size: 1.15, label: '书念妇人的家' });
            prop('field', 'field', { x: 0.655, x1: 0.77, v: 0.04, v1: 0.55, grow: 1, label: '收割的田' });
            crowd('reapers', { n: 3, x0: 0.67, x1: 0.75, layer: 2, v: 0.24, label: '收割的人', robe: [150, 132, 100], pose: 'bow', from: fromOf(b), mill: false });
            add('husband', { label: '她的丈夫', sex: 'm', age: 'elder', x: 0.7, v: 0.42, facing: 1, robe: ROBE.husband, glow: 0.15, from: fromOf(b) });
            add('shun', { label: '书念妇人', sex: 'f', age: 'adult', x: 0.83, v: 0.22, facing: -1, robe: ROBE.shun, glow: 0.35, from: fromOf(b) });
            walk('elisha', 0.8, { speed: 0.03 });
            add('gehazi', { label: '基哈西', sex: 'm', age: 'adult', x: 0.64, v: 0.24, facing: 1, robe: ROBE.gehazi, glow: 0.15, from: fromOf(b) });
            follow('gehazi', 'elisha', 0.028);
            avoid([0.42, 1]);
          }],
          [2.4, () => { face('elisha', 1); pose('elisha', 'point'); pose('shun', 'bow'); }],
          [4.4, b => {
            // 生了一个儿子
            pose('elisha', 'stand'); pose('shun', 'stand');
            carry('shun', 'baby');
            ringOn(b, 'shun', 0.5, [255, 226, 180], PH(2) * 1.2, 1.4);
            sfx(b, 'harp', { soft: true });
          }],
          [5.6, () => { unfollow('gehazi'); walk('elisha', 0.66, { speed: 0.035 }); walk('gehazi', 0.64, { speed: 0.035 }); }],
          [L[1], b => {
            rm('elisha'); rm('gehazi');
            carry('shun', null);
            add('son', { label: '孩子', sex: 'm', age: 'child', x: 0.815, v: 0.26, facing: -1, robe: [200, 180, 140], glow: 0.45, from: fromOf(b) });
            walk('son', 0.715, { speed: 0.03 });
          }],
          [L[1] + 3.4, () => { pose('son', 'weep'); face('husband', 1); pose('husband', 'point'); }],
          [L[1] + 4.6, () => { pose('husband', 'stand'); walk('son', 0.808, { speed: 0.022 }); walk('shun', 0.822, { speed: 0.02, pose: 'sit' }); }],
          [L[1] + 7.6, b => {
            // 到晌午就死了
            place('son', 0.808); place('shun', 0.822); pose('shun', 'sit'); face('shun', -1);
            pose('son', 'lie'); glow('son', 0);
            W.set('esGrief', 1, b.instant);
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] - 1.4, b => {
            // 抱他上了楼，放在神人的床上；关上门出来
            rm('son', true);
            add('son', { label: '孩子', sex: 'm', age: 'child', x: 0.85, facing: 1, pose: 'lie', robe: [200, 180, 140], glow: 0, from: 'none' });
            attach('son', up(0.12, 5));
            pose('shun', 'weep');
          }],
          [L[2], b => {
            addElisha(b, { x: 0.8, v: 0.02, facing: 1 });
            attach('elisha', up(0.78)); pose('elisha', 'pray'); face('elisha', -1);
          }],
          [L[2] + 2.4, b => {
            // 上床伏在孩子身上
            attach('elisha', up(0.52)); pose('elisha', 'bow'); face('elisha', -1);
            W.set('esWarm', 1, b.instant);
          }],
          [L[2] + 5, b => { glow('son', 0.35); W.set('esGrief', 0.4, b.instant); }],
          [L[3], b => {
            // 七个喷嚏
            for (let i = 0; i < 7; i++) if (!b.instant) GS.book.after(i * 0.42, () => { if (isCur()) { const p = figPt('son', 0.4); if (p && fx()) fx().sparkle(p[0], p[1] - 2, 5, [255, 240, 210], 3, 'air'); } });
          }],
          [L[3] + 3, b => {
            pose('son', 'sit'); glow('son', 0.8);
            W.set('esGrief', 0, b.instant);
            ringOn(b, 'son', 0.5, [255, 226, 170], PH(2) * 1.6, 1.8);
            pose('elisha', 'stand');
            sfx(b, 'harp');
          }],
          [L[3] + 4.4, b => {
            pose('shun', 'fall');
            rm('son', true); attach('son', null);
            add('son', { label: '孩子', sex: 'm', age: 'child', x: 0.845, v: 0.1, facing: -1, robe: [200, 180, 140], glow: 0.7, from: b.instant ? 'none' : 'fade' });
          }],
          [L[3] + 5.6, b => { place('shun', 0.83); pose('shun', 'embrace'); face('shun', 1); face('son', -1); descend(b, 'elisha', 0.815); }],
        ]);
      },
    },

    // ── 8 · 你去在约旦河中沐浴七回（5:1–27）── 乃缦 ───────────────────
    {
      kind: 'cmd', utter: '你去在约旦河中沐浴七回', cmd: 'for i in {1..7}; do wash 乃缦 --in 约旦河; done', ref: '5:10', tint: [220, 240, 255],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        const vv = 0.46;
        T(c, [
          [0, b => {
            unprop('shunem'); unprop('field');
            uncrowd('reapers'); rm('husband'); rm('shun'); rm('son'); attach('elisha', null);
            W.set('esWarm', 0, b.instant); W.set('esGrief', 0, b.instant);
            W.goTo(0.58, 6, b.instant);
            prop('ehouse', 'house', { x: X.house + 0.01, v: 0.02, open: 1, label: '以利沙的家' });
            walk('elisha', 0.845, { speed: 0.02 });
            add('gehazi', { label: '基哈西', sex: 'm', age: 'adult', x: 0.826, v: 0.14, facing: 1, robe: ROBE.gehazi, glow: 0.15, from: fromOf(b) });
            // 乃缦的车马
            prop('nchar', 'chariot', { x: 1.12, v: 0.2, flip: -1, style: 'naaman', size: 1.05, label: '乃缦的车马' });
            prop('nchar', null, { tx: Math.min(0.935, 1 - 36 * chariotK(getP('nchar')) / W.w), spd: 0.028 });
            getP('nchar').rail = true;
            add('naaman', { label: '乃缦', sex: 'm', age: 'adult', x: 1.12, v: 0.2, facing: -1, robe: ROBE.naaman, accent: GOLD, glow: 0.25, from: 'none' });
            attach('naaman', chariotFloor('nchar'));
            S.leper = true;
            crowd('retinue', { n: 4, x0: 1.04, x1: 1.1, layer: 2, v: 0.36, label: '跟随乃缦的人', robe: [150, 90, 80], prop: 'bundle', from: 'none', mill: false });
            crowdWalk('retinue', 0.955, 0.995, { speed: 0.028 });
            avoid([0.42, 1]);
          }],
          [L[1] - 1, b => { rm('elisha'); face('gehazi', 1); }],
          [L[1] + 0.8, () => { walk('gehazi', 0.9, { speed: 0.03, pose: 'point' }); }],
          [L[1] + 2.6, b => {
            attach('naaman', null);
            const f = fig('naaman');
            if (f) { f.nx = 0.9; f.v = vv; }
            place('naaman', 0.9);
            walk('naaman', riverAtV(vv), { speed: 0.062 });
          }],
          [L[1] + 5, () => { walk('gehazi', 0.83, { speed: 0.03 }); }],
          [L[2] - 0.2, () => { S.wade = 'naaman'; face('naaman', -1); }],
          ...Array.from({ length: 7 }, (_, i) => [L[2] + 0.4 + i * 1.02, b => {
            pose('naaman', 'kneel');
            S.dips = i + 1;
            const p = figPt('naaman', 0);
            if (p) { ringAt(b, p[0], p[1], [220, 240, 255], PH(2) * 0.9, 1); sparkAt(b, p[0], p[1] - 4, 8, [230, 244, 255], 6); }
            sfx(b, 'splash', { size: 1.2, soft: i < 6 });
          }]),
          ...Array.from({ length: 7 }, (_, i) => [L[2] + 0.9 + i * 1.02, () => { pose('naaman', 'stand'); }]),
          [L[2] + 7.8, b => {
            // 他的肉复原，好像小孩子的肉
            W.set('esClean', 1, b.instant);
            glow('naaman', 0.7);
            ringOn(b, 'naaman', 0.5, [255, 236, 190], PH(2) * 2, 1.8);
            sparkOn(b, 'naaman', 0.6, 30, [255, 244, 220], 12);
            sfx(b, 'harp'); sfx(b, 'angel', { soft: true });
          }],
          [L[3], b => {
            S.wade = null;
            walk('naaman', 0.815, { speed: 0.03 });
            addElisha(b, { x: 0.842, v: 0.08, facing: -1 });
            crowdWalk('retinue', 0.86, 0.95, { speed: 0.025 });
          }],
          [L[3] + 5, () => { pose('naaman', 'bow'); face('naaman', 1); }],
        ]);
      },
    },

    // ── 9 · 斧头就漂上来了（6:1–7）── 约旦河边砍伐树木 ──────────────────
    {
      kind: 'act', utter: '斧头就漂上来了', cmd: 'float 斧头 --on 约旦河  # 这斧子是借的', ref: '6:6', tint: [214, 226, 240],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            prop('nchar', null, { tx: 1.18, spd: 0.03 });
            rm('naaman'); uncrowd('retinue'); rm('gehazi');
            W.set('esClean', 1, true); S.leper = false; S.dips = 0;
            W.goTo(0.68, 10, b.instant);
            crowd('sonsW', { n: 6, x0: 0.79, x1: 0.93, layer: 2, v: 0.22, label: '先知门徒', robe: ROBE.son, from: fromOf(b) });
            [[0.655, 0.06, 1], [0.678, 0.18, 1.1], [0.702, 0.08, 0.95], [0.735, 0.3, 1.05]].forEach(([x, v, sz], i) =>
              prop('tam' + i, 'tree', { x, v, size: sz, grow: 1, flip: 1, label: '河边的树' }));
            place('elisha', 0.845); pose('elisha', 'stand');
            avoid([0.42, 1]);
          }],
          [4, () => { unprop('nchar'); }],
          [L[1] - 2, () => {
            crowdWalk('sonsW', 0.69, 0.79, { speed: 0.03 });
            walk('elisha', 0.77, { speed: 0.03 });
          }],
          [L[1], b => {
            crowdPose('sonsW', 'bow');
            add('axeman', { label: '砍树的人', sex: 'm', age: 'adult', x: 0.667, v: 0.2, facing: -1, robe: [134, 118, 92], glow: 0.2, from: fromOf(b), pose: 'raise' });
            sfx(b, 'build');
          }],
          [L[1] + 0.8, b => { prop('tam0', null, { fall: 1 }); sfx(b, 'build'); }],
          [L[1] + 2, b => { prop('tam2', null, { fall: 1 }); prop('beams', 'beams', { x: 0.76, v: 0.46, grow: 0.5, label: '木料' }); }],
          [L[1] + 3.2, b => {
            // 斧头掉在水里
            tween(b, 'axefly', 0.8, { id: 'axeman', tx: riverAtV(0.3), v: 0.3 });
            pose('axeman', 'stand');
          }],
          [L[1] + 4, b => {
            S.axe = 'sunk';
            const x = riverAtV(0.3) * W.w, y = fieldY(X.jT, 0.3);
            ringAt(b, x, y, [220, 240, 255], PH(2), 1.2); sfx(b, 'splash');
            pose('axeman', 'weep'); crowdPose('sonsW', 'stand');
            unprop('tam0'); unprop('tam2');
            prop('beams', null, { grow: 1 });
          }],
          [L[2], () => { walk('elisha', 0.69, { speed: 0.03, pose: 'point' }); pose('axeman', 'point'); face('axeman', -1); }],
          [L[2] + 3, b => {
            face('elisha', -1); pose('elisha', 'raise');
            tween(b, 'stick', 0.8, { id: 'elisha', tx: riverAtV(0.3), v: 0.3 });
          }],
          [L[2] + 3.8, b => {
            const x = riverAtV(0.3) * W.w, y = fieldY(X.jT, 0.3);
            ringAt(b, x, y, [220, 240, 255], PH(2), 1.2); sfx(b, 'splash', { soft: true });
            pose('elisha', 'stand');
          }],
          [L[2] + 4.6, b => {
            // 斧头就漂上来了
            S.axe = 'float'; W.set('esAxe', 1, b.instant);
            const x = riverAtV(0.3) * W.w, y = fieldY(X.jT, 0.3);
            sparkAt(b, x, y - 3, 16, [230, 240, 255], 6);
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 7.2, b => {
            // 那人就伸手拿起来了
            pose('axeman', 'bow');
            S.axe = 'taken'; W.set('esAxe', 0, b.instant);
          }],
          [L[2] + 8.6, () => { pose('axeman', 'raise'); crowdPose('sonsW', 'raise'); }],
        ]);
      },
    },

    // ── 10 · 耶和华开他的眼目（6:8–23）── 多坍；满山有火车火马 ───────────
    {
      kind: 'act', utter: '耶和华开他的眼目', cmd: 'open --eyes 少年人 | grep 火车火马', ref: '6:17', tint: [255, 190, 110],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        const kp = f => knollPt('dothan', f);
        T(c, [
          [0, b => {
            for (let i = 0; i < 4; i++) unprop('tam' + i);
            unprop('beams'); unprop('ehouse');
            uncrowd('sonsW'); rm('axeman');
            S.axe = 'none';
            W.goTo(0.02, 4, b.instant);
            prop('dothan', 'knoll', { x: X.dothan, hw: 82, wh: 62, town: true, label: '多坍' });
            rm('elisha');
            add('servant', { label: '神人的仆人', sex: 'm', age: 'adult', x: X.dothan - 0.01, facing: -1, robe: [140, 128, 104], glow: 0.3, from: fromOf(b) });
            attach('servant', kp(-0.2));
            // 亚兰的车马军兵，夜间围困那城
            S.torches = true;
            W.set('esHost', 1, b.instant);
            crowd('aramA', { n: 7, x0: 0.655, x1: 0.73, layer: 2, v: 0.14, label: '亚兰的车马军兵', robe: ROBE.aram, prop: 'torch', from: fromOf(b), mill: false });
            crowd('aramA2', { n: 6, x0: 0.66, x1: 0.74, layer: 2, v: 0.5, label: '亚兰的车马军兵', robe: [84, 68, 62], prop: 'staff', from: fromOf(b), mill: false });
            crowd('aramB', { n: 6, x0: 0.905, x1: 0.99, layer: 2, v: 0.28, label: '亚兰的车马军兵', robe: ROBE.aram, prop: 'torch', from: fromOf(b), mill: false });
            prop('dch1', 'chariot', { x: 0.7, v: 0.78, flip: 1, style: 'aram', label: '亚兰的战车' });
            prop('dch2', 'chariot', { x: 0.975, v: 0.72, flip: -1, style: 'aram', label: '亚兰的战车' });
            crowdFace('aramA', 1); crowdFace('aramA2', 1); crowdFace('aramB', -1);
            avoid([0.42, 1]);
          }],
          [1.8, b => { addElisha(b, { x: X.dothan - 0.02, facing: -1 }); attach('elisha', kp(-0.36)); }],
          [4.2, b => { W.goTo(0.27, 7, b.instant); }],
          [4.6, b => {
            // 仆人清早起来出去，看见车马军兵围困了城
            attach('servant', kp(-0.62));
            pose('servant', 'raise');
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [6, () => { pose('servant', 'weep'); pose('elisha', 'point'); }],
          [L[1], () => { pose('elisha', 'pray'); pose('servant', 'stand'); }],
          [L[1] + 2.4, b => {
            // 耶和华开他的眼目
            const p = figPt('servant', 0.9);
            if (p) { ringAt(b, p[0], p[1], [255, 226, 170], PH(2) * 1.4, 1.2); sparkAt(b, p[0], p[1], 20, [255, 236, 200], 6, 'air'); }
            pose('servant', 'gaze');
            W.set('esFire', 1, b.instant);
            S.torches = false;
            flash(b, 0.3);
            sfx(b, 'angel'); sfx(b, 'fire');
          }],
          [L[1] + 5, b => { pose('elisha', 'raise'); sfx(b, 'fire', { soft: true }); }],
          [L[2], b => {
            // 使他们的眼目昏迷；领他们去撒马利亚
            W.set('esBlind', 1, b.instant);
            crowdProp('aramA', null); crowdProp('aramB', null);
            descend(b, 'elisha', X.dothan - 0.075);
            descend(b, 'servant', X.dothan - 0.05);
          }],
          [L[2] + 1.6, () => {
            walk('elisha', 1.04, { speed: 0.03 });
            crowdWalk('aramA', 1.04, 1.12, { speed: 0.028 }); crowdWalk('aramA2', 1.05, 1.13, { speed: 0.028 }); crowdWalk('aramB', 1.06, 1.12, { speed: 0.028 });
            prop('dch1', null, { tx: 1.2, spd: 0.03 }); prop('dch2', null, { tx: 1.22, spd: 0.03 });
          }],
          [L[2] + 3.6, b => { W.set('esFire', 0.35, b.instant); W.set('esHost', 0, b.instant); }],
          [L[2] + 6.4, b => {
            rm('elisha'); uncrowd('aramA'); uncrowd('aramA2'); uncrowd('aramB'); unprop('dch1'); unprop('dch2');
            W.set('esBlind', 0, b.instant);
          }],
        ]);
      },
    },

    // ── 11 · 主使亚兰人的军队听见车马的声音（6:24—7:20）── 撒马利亚；空营 ─────
    {
      kind: 'act', utter: '主使亚兰人的军队听见车马的声音', cmd: 'play --sound 车马 --to 亚兰营  # 营盘照旧', ref: '7:6', tint: [240, 210, 170],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            unprop('dothan'); rm('servant');
            W.set('esFire', 0, b.instant);
            W.goTo(0.45, 6, b.instant);
            prop('samaria', 'city', { x: X.samaria, hw: 70, wh: 26, gate: -0.62, rgb: [206, 194, 164], style: 'palace', open: 0, label: '撒马利亚' });
            [[0.655, 0.02], [0.7, 0.09], [0.745, 0.03]].forEach(([x, v], i) => prop('atent' + i, 'tent', { x, v, size: 0.95, style: 'aram', fire: 1, label: '亚兰人的营盘' }));
            crowd('aramC', { n: 9, x0: 0.64, x1: 0.78, layer: 2, v: 0.3, label: '亚兰人的军队', robe: ROBE.aram, prop: 'staff', from: fromOf(b) });
            animal('adk1', 'donkey', 0.675, { v: 0.56, pose: 'stand', label: '拴着的驴', facing: 1, from: fromOf(b) });
            animal('adk2', 'donkey', 0.74, { v: 0.62, pose: 'graze', label: '拴着的驴', facing: -1, from: fromOf(b) });
            add('king', { label: '以色列王', sex: 'm', age: 'adult', robe: ROBE.king, glow: 0.2, x: X.samaria, facing: -1, from: fromOf(b) });
            attach('king', () => { const p = getP('samaria'); if (!p) return null; const G = cityG(p); return [G.gx + 22 * G.s, G.top]; });
            avoid([0.42, 1]);
          }],
          [2.5, () => { pose('king', 'weep'); }],
          [L[1], b => {
            addElisha(b, { x: X.samaria, facing: -1 });
            attach('elisha', () => { const p = getP('samaria'); if (!p) return null; const G = cityG(p); return [G.gx + 8 * G.s, G.top - 1]; });
            pose('king', 'stand');
            S.beam = 'elisha'; W.set('esBeam', 0.7, b.instant);
          }],
          [L[1] + 2, () => { pose('elisha', 'point'); }],
          [L[2] - 1.4, b => { W.goTo(0.77, 6, b.instant); W.set('esBeam', 0, b.instant); pose('elisha', 'stand'); }],
          [L[2], b => {
            // 主使亚兰人的军队听见车马的声音
            W.set('esRumble', 1, b.instant);
            sfx(b, 'thunder', { low: true, far: true }); sfx(b, 'wind', { low: true });
            shake(b, 0.3);
          }],
          [L[2] + 1.8, b => {
            crowdWalk('aramC', 0.46, 0.55, { run: true, speed: 0.085 });
            prop('cloths', 'cloths', { x: 0.63, x1: 0.5, v: 0.3, v1: 0.75, grow: 1, label: '丢弃的衣服器具' });
            S.strewn = true;
            sfx(b, 'crowd');
          }],
          [L[2] + 4.2, b => { W.set('esRumble', 0, b.instant); sfx(b, 'thunder', { low: true, far: true, soft: true }); }],
          [L[2] + 5.2, b => {
            uncrowd('aramC');
            // 四个长大麻风的人到了营边
            crowd('lepers', { n: 4, x0: 0.8, x1: 0.83, layer: 2, v: 0.2, label: '四个长大麻风的人', robe: ROBE.leper, from: fromOf(b), mill: false });
            crowdWalk('lepers', 0.67, 0.73, { speed: 0.025 });
          }],
          [L[3] - 0.6, b => {
            W.goTo(0.31, 4.2, b.instant);
            [0, 1, 2].forEach(i => prop('atent' + i, null, { fire: 0 }));
          }],
          [L[3] + 3.2, b => {
            // 城门开了，众人出去；城门口细面、大麦贱卖
            prop('samaria', null, { open: 1 });
            crowd('people', { n: 10, x0: 0.8, x1: 0.84, layer: 2, v: 0.32, label: '撒马利亚的众人', from: fromOf(b) });
            crowdWalk('people', 0.64, 0.8, { speed: 0.03 });
            prop('sacks', 'sacks', { x: 0.81, v: 0.2, grow: 1, lit: 1, label: '细面与大麦' });
            sfx(b, 'gate'); sfx(b, 'crowd');
          }],
          [L[3] + 5.6, () => { crowdPose('lepers', 'raise'); }],
        ]);
      },
    },

    // ── 12 · 我膏你作耶和华民以色列的王（9—10）── 耶户 ─────────────────
    {
      kind: 'name', utter: '我膏你作耶和华民以色列的王', cmd: 'anoint 耶户 --with 膏油 --role 王  # 车赶得甚猛', ref: '9:6', tint: [240, 214, 150],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        const vr = 0.4;
        T(c, [
          [0, b => {
            unprop('samaria'); unprop('cloths'); unprop('sacks'); [0, 1, 2].forEach(i => unprop('atent' + i));
            attach('king', null); rm('king'); attach('elisha', null); rm('elisha');
            uncrowd('lepers'); uncrowd('people'); rm('adk1'); rm('adk2');
            S.strewn = false;
            W.goTo(0.44, 5, b.instant);
            // 基列的拉末（河东）：众军长坐着
            prop('rtent', 'tent', { x: 0.505, v: 0.0, size: 1.0, label: '基列的拉末' });
            crowd('captains', { n: 5, x0: 0.49, x1: 0.575, layer: 2, v: 0.22, label: '众军长', robe: [110, 96, 120], pose: 'sit', from: fromOf(b), mill: false });
            add('jehu', { label: '耶户', sex: 'm', age: 'adult', x: 0.55, v: 0.3, facing: 1, robe: ROBE.jehu, glow: 0.3, pose: 'sit', from: fromOf(b) });
            // 河西：以利沙差遣少年先知
            add('youth', { label: '少年先知', sex: 'm', age: 'adult', x: 0.735, v: vr, facing: -1, robe: ROBE.youth, glow: 0.3, prop: 'jar', from: fromOf(b) });
            prop('pillar', 'pillar', { x: 0.92, v: 0.12, label: '巴力的柱像' });
            avoid([0.42, 1]);
          }],
          [1.2, b => { addElisha(b, { x: 0.76, v: vr, facing: -1 }); }],
          [2.2, () => { pose('elisha', 'point'); }],
          [3.2, () => { pose('elisha', 'stand'); walk('youth', westEdge(vr), { speed: 0.08, run: true }); }],
          [4.4, () => { walk('youth', 0.572, { speed: 0.05 }); }],
          [5, b => { const p = figPt('youth', 0); if (p) ringAt(b, p[0], p[1], [220, 240, 255], PH(2), 1); sfx(b, 'splash', { soft: true }); }],
          [L[1], () => { pose('jehu', 'stand'); face('jehu', 1); face('youth', -1); }],
          [L[1] + 1.4, b => { pose('youth', 'raise'); tween(b, 'oil', 2.4); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 3.6, b => {
            // 我膏你作以色列的王
            ringOn(b, 'jehu', 0.9, [255, 226, 150], PH(2) * 1.6, 1.6);
            glow('jehu', 0.7);
            pose('youth', 'stand'); propOf('youth', null);
            sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 5, () => { walk('youth', 1.04, { speed: 0.085, run: true }); }],
          [L[2], b => {
            prop('stair', 'stair', { x: 0.535, v: 0.12, grow: 1, label: '上层台阶' });
            crowdPose('captains', 'stand');
            rm('youth');
          }],
          [L[2] + 2.2, b => {
            add('jehu', { v: 0 });
            attach('jehu', stairTop('stair')); pose('jehu', 'seat'); face('jehu', 1);
          }],
          [L[2] + 3.4, b => {
            // 他们吹角，说：耶户作王了！
            crowdPose('captains', 'raise');
            const p = figPt('jehu', 1);
            if (p) nameHere(b, '耶户', p[0], p[1] - PH(2) * 0.6, [255, 226, 160], { size: 0.036 });
            sfx(b, 'crowd'); sfx(b, 'angel', { soft: true });
          }],
          [L[3], b => {
            // 车赶得甚猛
            crowdPose('captains', 'stand');
            prop('jchar', 'chariot', { x: 0.56, v: 0.34, flip: 1, style: 'jehu', size: 1.05, label: '耶户的车' });
            getP('jchar').rail = true;
            attach('jehu', null);
            add('jehu', { v: 0.34 });
            attach('jehu', chariotFloor('jchar')); pose('jehu', 'stand');
          }],
          [L[3] + 0.8, b => { prop('jchar', null, { tx: 0.86, spd: 0.075 }); sfx(b, 'thunder', { low: true, soft: true }); }],
          [L[3] + 2.2, b => { const x = riverAtV(0.34) * W.w; ringAt(b, x, fieldY(X.jT, 0.34), [220, 240, 255], PH(2) * 1.4, 1.2); sfx(b, 'splash', { size: 2 }); }],
          [L[3] + 4, b => { prop('pillar', null, { fire: 1 }); sfx(b, 'fire'); }],
          [L[3] + 5.6, b => { prop('pillar', null, { fall: 1 }); shake(b, 0.2); sfx(b, 'build'); dustAt(b, 0.935 * W.w, fieldY(0.935, 0.12), 26, [150, 130, 110], 20); }],
        ]);
      },
    },

    // ── 13 · 永远赐灯光与他的子孙（8:19；11—12）── 殿里的灯；约阿施七岁作王 ──
    {
      kind: 'promise', utter: '永远赐灯光与他的子孙', cmd: 'keep-alive 大卫的灯 --forever', ref: '8:19', tint: [255, 214, 140],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            unprop('rtent'); unprop('stair'); unprop('pillar'); unprop('jchar');
            attach('jehu', null); rm('jehu'); uncrowd('captains'); rm('youth'); rm('elisha');
            W.goTo(0.97, 6, b.instant);
            prop('temple', 'temple', { x: X.temple, v: 0.02, size: 1.3, label: '耶和华的殿' });
            prop('altar', 'altar', { x: 0.738, v: 0.2, fire: 1, label: '坛' });
            avoid([0.42, 1]);
          }],
          [2.2, b => { W.set('esLamp', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [L[1], b => {
            add('jehosheba', { label: '约示巴', sex: 'f', age: 'adult', x: 0.6, v: 0.26, facing: 1, robe: [150, 110, 140], glow: 0.35, from: fromOf(b) });
            add('nurse', { label: '乳母', sex: 'f', age: 'adult', x: 0.575, v: 0.3, facing: 1, robe: ROBE.nurse, carry: 'baby', glow: 0.3, from: fromOf(b) });
            walk('jehosheba', 0.826, { speed: 0.04 }); walk('nurse', 0.814, { speed: 0.04 });
          }],
          [L[1] + 5.2, () => { rm('jehosheba'); rm('nurse'); }],
          [L[1] + 5.6, b => { W.goTo(0.245, 8, b.instant); }],
          [L[2], b => {
            // 祭司领王子出来，给他戴上冠冕
            add('jehoiada', { label: '祭司耶何耶大', sex: 'm', age: 'elder', x: 0.826, v: 0.12, facing: -1, robe: ROBE.priest, accent: [210, 190, 120], glow: 0.4, from: fromOf(b) });
            add('joash', { label: '约阿施', sex: 'm', age: 'child', x: 0.816, v: 0.18, facing: -1, robe: ROBE.joash, glow: 0.55, from: fromOf(b) });
            walk('jehoiada', 0.765, { speed: 0.02 }); walk('joash', 0.748, { speed: 0.02 });
            crowd('guards', { n: 6, x0: 0.68, x1: 0.8, layer: 2, v: 0.5, label: '百夫长和护卫兵', robe: [110, 96, 86], prop: 'staff', from: fromOf(b), mill: false });
            crowd('people13', { n: 8, x0: 0.645, x1: 0.72, layer: 2, v: 0.3, label: '国中的众民', from: fromOf(b), mill: false });
            crowdFace('guards', -1); crowdFace('people13', 1);
          }],
          [L[2] + 2.2, b => {
            S.crown = 'joash';
            sparkOn(b, 'joash', 1, 24, [255, 226, 150], 6);
            sfx(b, 'harp');
          }],
          [L[2] + 3.4, b => { crowdPose('people13', 'raise'); crowdPose('guards', 'raise'); sfx(b, 'crowd'); }],
          [L[3], b => {
            crowdPose('people13', 'stand'); crowdPose('guards', 'stand');
            prop('chest', 'chest', { x: 0.775, v: 0.06, lit: 1, label: '柜子' });
            walk('jehoiada', 0.785, { speed: 0.02, pose: 'point' });
          }],
          [L[3] + 2.4, () => { crowdWalk('people13', 0.7, 0.76, { speed: 0.02, pose: 'bow' }); }],
        ]);
      },
    },

    // ── 14 · 仍施恩给以色列人，怜恤他们，眷顾他们（13）── 得胜箭；以利沙的坟墓 ──
    {
      kind: 'act', utter: '仍施恩给以色列人，怜恤他们，眷顾他们', cmd: 'grace 以色列 --because 亚伯拉罕,以撒,雅各', ref: '13:23', tint: [255, 226, 170],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        const room = f => roomPt('sick', f);
        T(c, [
          [0, b => {
            unprop('temple'); unprop('altar'); unprop('chest');
            rm('jehoiada'); rm('joash'); uncrowd('guards'); uncrowd('people13');
            S.crown = null;
            W.set('esLamp', 0, b.instant);
            W.goTo(0.268, 7, b.instant);
            prop('sick', 'house', { x: 0.8, v: 0.02, style: 'sick', open: 0, size: 1.3, label: '以利沙的家' });
            add('elisha', { label: '以利沙', sex: 'm', age: 'elder', hair: 'none', beard: true, robe: ROBE.mantle, accent: [70, 52, 38], glow: 0.4, x: 0.8, facing: 1, pose: 'lie', from: fromOf(b) });
            attach('elisha', room(0.62));
            add('kingJ', { label: '以色列王约阿施', sex: 'm', age: 'adult', x: 0.68, v: 0.06, facing: 1, robe: ROBE.king, glow: 0.3, from: fromOf(b) });
            walk('kingJ', 0.772, { speed: 0.035, pose: 'weep' });
            S.crown = 'kingJ';
            avoid([0.42, 1]);
          }],
          [2.2, b => { W.set('esEcho', 1, b.instant); sfx(b, 'fire', { soft: true, far: true }); }],
          [L[1] - 1.2, b => { W.set('esEcho', 0, b.instant); }],
          [L[1], b => {
            // 开朝东的窗户，射箭
            pose('elisha', 'sit');
            walk('kingJ', 0.764, { speed: 0.02 });
            prop('sick', null, { open: 1 });
            S.bow = true;
          }],
          [L[1] + 1.8, () => { face('kingJ', -1); pose('kingJ', 'point'); }],
          [L[1] + 2.8, b => {
            const p = getP('sick'), G = p ? houseG(p) : null;
            if (G) tween(b, 'arrow', 3.2, { x: G.x0 + 2 * G.s, y: G.roof + 11 * G.s });
            sfx(b, 'wings'); sfx(b, 'harp');
          }],
          [L[1] + 6, b => {
            S.bow = false; pose('kingJ', 'stand');
            if (!b.instant && W.sun && fx()) fx().ring(W.sun.x, W.sun.y, [255, 230, 170], M() * 0.25, 2, 2);
          }],
          [L[2], b => {
            // 以利沙死了，人将他葬埋
            W.goTo(0.4, 7, b.instant);
            pose('elisha', 'lie');
            soul(b, 'elisha');
            pose('kingJ', 'weep');
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] + 1.6, b => {
            attach('elisha', null); rm('elisha'); rm('kingJ'); S.crown = null;
            unprop('sick');
            prop('tomb', 'tomb', { x: X.tomb, v: 0.02, grow: 1, size: 1.3, label: '以利沙的坟墓' });
            // 到了新年
            W.set('bloom', 1, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant);
            prop('bier', 'bier', { x: 0.66, v: 0.14, label: '葬死人的' });
            prop('bier', null, { tx: 0.8, spd: 0.028 });
            add('dead', { label: '那死人', sex: 'm', age: 'adult', x: 0.66, facing: 1, pose: 'lie', robe: [220, 214, 200], glow: 0, from: fromOf(b) });
            attach('dead', bierPt('bier'));
            add('bearer1', { label: '葬死人的', sex: 'm', age: 'adult', x: 0.64, v: 0.14, facing: 1, robe: [120, 104, 88], pose: 'carry', glow: 0.1, from: fromOf(b) });
            add('bearer2', { label: '葬死人的', sex: 'm', age: 'adult', x: 0.68, v: 0.14, facing: 1, robe: [134, 112, 90], pose: 'carry', glow: 0.1, from: fromOf(b) });
            walk('bearer1', 0.78, { speed: 0.028, pose: 'carry' }); walk('bearer2', 0.82, { speed: 0.028, pose: 'carry' });
          }],
          [L[2] + 4.2, b => {
            // 忽然看见一群人（摩押人犯境）
            crowd('raiders', { n: 5, x0: 0.62, x1: 0.72, layer: 1, label: '一群摩押人', robe: [80, 64, 58], prop: 'staff', from: fromOf(b), mill: false });
            face('bearer1', -1); face('bearer2', -1); pose('bearer1', 'point');
          }],
          [L[2] + 5.2, b => {
            // 把死人抛在以利沙的坟墓里
            attach('dead', null);
            const t = getP('tomb'), q = t ? tombMouth(t) : null;
            place('dead', q ? q[0] / W.w - 0.004 : X.tomb - 0.02);
            add('dead', { v: 0.02 });
            unprop('bier');
            run_(['bearer1', 'bearer2'], 0.58);
          }],
          [L[2] + 6.6, b => {
            // 一碰着以利沙的骸骨，死人就复活，站起来了
            prop('tomb', null, { lit: 1 });
            pose('dead', 'stand'); glow('dead', 0.85);
            const d = fig('dead'); if (d) d.label = '复活的人';
            ringOn(b, 'dead', 0.5, [255, 236, 190], PH(2) * 2.4, 2);
            sparkOn(b, 'dead', 0.6, 34, [255, 240, 210], 12);
            flash(b, 0.3);
            sfx(b, 'angel'); sfx(b, 'harp');
          }],
          [L[3], b => {
            rm('bearer1'); rm('bearer2'); uncrowd('raiders');
            W.set('esGrace', 1, b.instant);
            pose('dead', 'raise');
            if (!b.instant && fx()) {
              const size = 0.034 * M(), y = W.h * 0.2;
              [['亚伯拉罕', 0.6], ['以撒', 0.76], ['雅各', 0.88]].forEach(([n, xf], i) => nameHere(b, n, xf * W.w, y + i * size * 0.4, [255, 230, 176], { size: 0.032, hold: 4, delay: i * 0.6, src: () => [xf * W.w + rand(-40, 40), W.h * 0.7 + rand(-20, 20)] }));
            }
            sfx(b, 'stars', { soft: true });
          }],
          [L[3] + 4, () => { pose('dead', 'stand'); }],
        ]);
      },
    },
  ];
  function run_(ids, x) { ids.forEach((id, i) => walk(id, x - i * 0.02, { speed: 0.08, run: true })); }

  const MANTLE_TXT = { text: '他拾起以利亚身上掉下来的外衣，回去站在约旦河边。', ref: R_('2:13') };
  GS.book.act({
    id: ACT, book: '列王纪下', books: [12], title: '以利沙', sub: '列王纪下 1 — 13', tint: [255, 200, 140], music: 'abraham',
    outro: 18,
    intro: INTRO,
    // 全卷终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '以利亚': { text: '他们正走着说话，忽有火车火马将二人隔开，以利亚就乘旋风升天去了。', ref: R_('2:11') },
      '以利沙': { text: '住耶利哥的先知门徒从对面看见他，就说：「感动以利亚的灵感动以利沙了。」', ref: R_('2:15') },
      '山顶': { text: '于是，王差遣五十夫长，带领五十人去见以利亚，他就上到以利亚那里；以利亚正坐在山顶上。', ref: R_('1:9') },
      '撒马利亚': { text: '此后，亚兰王便‧哈达聚集他的全军，上来围困撒马利亚。', ref: R_('6:24') },
      '王的使者': { text: '使者回来见王，王问他们说：「你们为什么回来呢？」', ref: R_('1:5') },
      '五十夫长': { text: '五十夫长对他说：「神人哪，王吩咐你下来！」', ref: R_('1:9') },
      '五十人': { text: '以利亚回答说：「我若是神人，愿火从天上降下来，烧灭你和你那五十人！」', ref: R_('1:10') },
      '第三个五十夫长': { text: '「神人哪，愿我的性命和你这五十个仆人的性命在你眼前看为宝贵！」', ref: R_('1:13') },
      '五十个仆人': { text: '「神人哪，愿我的性命和你这五十个仆人的性命在你眼前看为宝贵！」', ref: R_('1:13') },
      '耶和华的使者': { text: '耶和华的使者对以利亚说：「你同着他下去，不要怕他！」', ref: R_('1:15') },
      '耶利哥': { text: '耶利哥城的人对以利沙说：「这城的地势美好，我主看见了；只是水恶劣，土产不熟而落。」', ref: R_('2:19') },
      '棕树': { text: '耶利哥城的人对以利沙说：「这城的地势美好，我主看见了……」', ref: R_('2:19') },
      '先知门徒': { text: '有先知门徒去了五十人，远远地站在他们对面；二人在约旦河边站住。', ref: R_('2:7') },
      '约旦河': { text: '以利亚将自己的外衣卷起来，用以打水，水就左右分开，二人走干地而过。', ref: R_('2:8') },
      '分开的约旦河水': { text: '他用以利亚身上掉下来的外衣打水，说：「耶和华以利亚的神在哪里呢？」打水之后，水也左右分开，以利沙就过来了。', ref: R_('2:14') },
      '以利亚的外衣': MANTLE_TXT,
      '旋风': { text: '耶和华要用旋风接以利亚升天的时候，以利亚与以利沙从吉甲前往。', ref: R_('2:1') },
      '火车火马': { text: '以利沙看见，就呼叫说：「我父啊！我父啊！以色列的战车马兵啊！」以后不再见他了。', ref: R_('2:12') },
      '水源': { text: '于是那水治好了，直到今日，正如以利沙所说的。', ref: R_('2:22') },
      '三王的营': { text: '于是，以色列王和犹大王，并以东王，都一同去绕行七日的路程；军队和所带的牲畜没有水喝。', ref: R_('3:9') },
      '以色列王': { text: '以色列王对他说：「不要这样说，耶和华招聚我们这三王，乃要交在摩押人的手里。」', ref: R_('3:13') },
      '犹大王约沙法': { text: '约沙法说：「他必有耶和华的话。」于是以色列王和约沙法，并以东王都下去见他。', ref: R_('3:12') },
      '以东王': { text: '于是以色列王和约沙法，并以东王都下去见他。', ref: R_('3:12') },
      '军队': { text: '在耶和华眼中这还算为小事，他也必将摩押人交在你们手中。', ref: R_('3:18') },
      '牲畜': { text: '「……你们虽不见风，不见雨，这谷必满了水，使你们和牲畜有水喝。」', ref: R_('3:17') },
      '弹琴的': { text: '「现在你们给我找一个弹琴的来。」弹琴的时候，耶和华的灵就降在以利沙身上。', ref: R_('3:15') },
      '谷中的沟': { text: '他便说：「耶和华如此说：『你们要在这谷中满处挖沟……』」', ref: R_('3:16') },
      '满了水的沟': { text: '次日早晨，约在献祭的时候，有水从以东而来，遍地就满了水。', ref: R_('3:20') },
      '水红如血': { text: '次日早晨，日光照在水上，摩押人起来，看见对面水红如血，就说：「这是血啊！……」', ref: R_('3:22–23') },
      '摩押人': { text: '次日早晨，日光照在水上，摩押人起来，看见对面水红如血', ref: R_('3:22') },
      '寡妇的家': { text: '于是，妇人离开以利沙去了，关上门，自己和儿子在里面；儿子把器皿拿来，她就倒油。', ref: R_('4:5') },
      '先知门徒的妻': { text: '有一个先知门徒的妻哀求以利沙说：「你仆人我丈夫死了，他敬畏耶和华是你所知道的……」', ref: R_('4:1') },
      '她的儿子': { text: '器皿都满了，她对儿子说：「再给我拿器皿来。」儿子说：「再没有器皿了。」油就止住了。', ref: R_('4:6') },
      '器皿': { text: '妇人去告诉神人，神人说：「你去卖油还债，所剩的你和你儿子可以靠着度日。」', ref: R_('4:7') },
      '从巴力沙利沙来的人': { text: '有一个人从巴力‧沙利沙来，带着初熟大麦做的饼二十个，并新穗子，装在口袋里送给神人。', ref: R_('4:42') },
      '大麦饼': { text: '仆人就摆在众人面前，他们吃了，果然还剩下，正如耶和华所说的。', ref: R_('4:44') },
      '书念妇人的家': { text: '「我们可以为他在墙上盖一间小楼，在其中安放床榻、桌子、椅子、灯台……」', ref: R_('4:10') },
      '书念妇人': { text: '妇人对丈夫说：「我看出那常从我们这里经过的是圣洁的神人。」', ref: R_('4:9') },
      '她的丈夫': { text: '孩子渐渐长大，一日到他父亲和收割的人那里', ref: R_('4:18') },
      '收割的人': { text: '孩子渐渐长大，一日到他父亲和收割的人那里', ref: R_('4:18') },
      '收割的田': { text: '孩子渐渐长大，一日到他父亲和收割的人那里', ref: R_('4:18') },
      '孩子': { text: '然后他下来，在屋里来往走了一趟，又上去伏在孩子身上，孩子打了七个喷嚏，就睁开眼睛了。', ref: R_('4:35') },
      '基哈西': { text: '以利沙吩咐仆人基哈西说：「你叫这书念妇人来。」', ref: R_('4:12') },
      '以利沙的家': { text: '于是，乃缦带着车马到了以利沙的家，站在门前。', ref: R_('5:9') },
      '乃缦': { text: '于是乃缦下去，照着神人的话，在约旦河里沐浴七回；他的肉复原，好像小孩子的肉，他就洁净了。', ref: R_('5:14') },
      '乃缦的车马': { text: '于是，乃缦带着车马到了以利沙的家，站在门前。', ref: R_('5:9') },
      '跟随乃缦的人': { text: '他的仆人进前来，对他说：「我父啊，先知若吩咐你做一件大事，你岂不做吗？何况说你去沐浴而得洁净呢？」', ref: R_('5:13') },
      '河边的树': { text: '于是以利沙与他们同去。到了约旦河，就砍伐树木。', ref: R_('6:4') },
      '木料': { text: '「求你容我们往约旦河去，各人从那里取一根木料建造房屋居住。」', ref: R_('6:2') },
      '砍树的人': { text: '有一人砍树的时候，斧头掉在水里，他就呼叫说：「哀哉！我主啊，这斧子是借的。」', ref: R_('6:5') },
      '斧头': { text: '以利沙说：「拿起来吧！」那人就伸手拿起来了。', ref: R_('6:7') },
      '多坍': { text: '王说：「你们去探他在哪里，我好打发人去捉拿他。」有人告诉王说：「他在多坍。」', ref: R_('6:13') },
      '神人的仆人': { text: '以利沙祷告说：「耶和华啊，求你开这少年人的眼目，使他能看见。」', ref: R_('6:17') },
      '亚兰的车马军兵': { text: '王就打发车马和大军往那里去，夜间到了，围困那城。', ref: R_('6:14') },
      '亚兰的战车': { text: '王就打发车马和大军往那里去，夜间到了，围困那城。', ref: R_('6:14') },
      '满山的火车火马': { text: '耶和华开他的眼目，他就看见满山有火车火马围绕以利沙。', ref: R_('6:17') },
      '亚兰人的营盘': { text: '所以，在黄昏的时候他们起来逃跑，撇下帐棚、马、驴，营盘照旧，只顾逃命。', ref: R_('7:7') },
      '亚兰人的军队': { text: '因为主使亚兰人的军队听见车马的声音，是大军的声音……', ref: R_('7:6') },
      '拴着的驴': { text: '「我们到了亚兰人的营，不见一人在那里，也无人声，只有拴着的马和驴，帐棚都照旧。」', ref: R_('7:10') },
      '丢弃的衣服器具': { text: '他们就追寻到约旦河，看见满道上都是亚兰人急跑时丢弃的衣服器具，使者就回来报告王。', ref: R_('7:15') },
      '四个长大麻风的人': { text: '「我们所做的不好！今日是有好信息的日子，我们竟不作声！……来吧，我们与王家报信去！」', ref: R_('7:9') },
      '撒马利亚的众人': { text: '众人就出去，掳掠亚兰人的营盘。', ref: R_('7:16') },
      '细面与大麦': { text: '于是一细亚细面卖银一舍客勒，二细亚大麦也卖银一舍客勒，正如耶和华所说的。', ref: R_('7:16') },
      '基列的拉末': { text: '到了那里，看见众军长都坐着，就说：「将军哪，我有话对你说。」', ref: R_('9:5') },
      '众军长': { text: '他们就急忙各将自己的衣服铺在上层台阶，使耶户坐在其上；他们吹角，说：「耶户作王了！」', ref: R_('9:13') },
      '耶户': { text: '耶和华对耶户说：「因你办好我眼中看为正的事……你的子孙必接续你坐以色列的国位，直到四代。」', ref: R_('10:30') },
      '少年先知': { text: '于是那少年先知往基列的拉末去了。', ref: R_('9:4') },
      '上层台阶': { text: '他们就急忙各将自己的衣服铺在上层台阶，使耶户坐在其上', ref: R_('9:13') },
      '耶户的车': { text: '守望的人又说：「他到了他们那里，也不回来；车赶得甚猛，像宁示的孙子耶户的赶法。」', ref: R_('9:20') },
      '巴力的柱像': { text: '将巴力庙中的柱像都拿出来烧了；毁坏了巴力柱像……', ref: R_('10:26–27') },
      '耶和华的殿': { text: '约阿施和他的乳母藏在耶和华的殿里六年；亚她利雅篡了国位。', ref: R_('11:3') },
      '坛': { text: '祭司耶何耶大取了一个柜子，在柜盖上钻了一个窟窿，放于坛旁……', ref: R_('12:9') },
      '约示巴': { text: '但约兰王的女儿，亚哈谢的妹子约示巴，将亚哈谢的儿子约阿施从那被杀的王子中偷出来……', ref: R_('11:2') },
      '乳母': { text: '约阿施和他的乳母藏在耶和华的殿里六年', ref: R_('11:3') },
      '祭司耶何耶大': { text: '耶何耶大使王和民与耶和华立约，作耶和华的民；又使王与民立约。', ref: R_('11:17') },
      '约阿施': { text: '约阿施登基的时候年方七岁。', ref: R_('11:21') },
      '百夫长和护卫兵': { text: '护卫兵手中各拿兵器，在坛和殿那里，从殿右直到殿左，站在王子的四围。', ref: R_('11:11') },
      '国中的众民': { text: '国民都欢乐，合城都安静。', ref: R_('11:20') },
      '柜子': { text: '守门的祭司将奉到耶和华殿的一切银子投在柜里。', ref: R_('12:9') },
      '以色列王约阿施': { text: '以利沙对他说：「你取弓箭来。」王就取了弓箭来……以利沙按手在王的手上', ref: R_('13:15–16') },
      '以利沙的坟墓': { text: '以利沙死了，人将他葬埋。到了新年，有一群摩押人犯境', ref: R_('13:20') },
      '那死人': { text: '……就把死人抛在以利沙的坟墓里，一碰着以利沙的骸骨，死人就复活，站起来了。', ref: R_('13:21') },
      '复活的人': { text: '……就把死人抛在以利沙的坟墓里，一碰着以利沙的骸骨，死人就复活，站起来了。', ref: R_('13:21') },
      '葬死人的': { text: '有人正葬死人，忽然看见一群人，就把死人抛在以利沙的坟墓里', ref: R_('13:21') },
      '一群摩押人': { text: '以利沙死了，人将他葬埋。到了新年，有一群摩押人犯境', ref: R_('13:20') },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._elisha = { get S() { return S; }, P, X, TW, riverAtV, rPt, rv, chPos, hostModel };
})(window.GS);
