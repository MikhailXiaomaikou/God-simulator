/* ─────────────────────────────────────────────────────────────
 * book/numbers.js —— 卷 · 旷野（民数记 1 — 36）
 *
 * 西奈的旷野：数点百姓；「以色列人要各归自己的纛下」——十二面纛一面一面升起，营照着支派排在会幕的四围；
 * 利未人的帐棚环绕会幕，摩西、亚伦在东边向日出之地；祭司的祝福（三道光：赐福保护、脸光照、仰脸赐平安）；
 * 施恩座上的声音、灯台的七盏灯；夜间云柱形状如火；两枝银号——云彩收上去，拔营，离开西奈，停在巴兰的旷野；
 * 「耶和华的膀臂岂是缩短了吗？」——风从海面把鹌鹑刮来，落在营的四围；十二个探子，两个人用杠抬着一挂葡萄；
 * 那夜百姓哭号，约书亚与迦勒；「你们的儿女必在旷野飘流四十年」——昼夜飞逝，旷野里一堆一堆的石头；
 * 地开了口；亚伦站在活人死人中间；十二根杖——亚伦的杖发芽、开花、结了熟杏；纯红的母牛；米利暗葬在加低斯；
 * 击打磐石两下，许多水流出来；何珥山顶，圣衣穿在以利亚撒身上；火蛇——铜蛇挂在杆子上，一望就活了（本卷的画）；
 * 「井啊，涌上水来！」；巴兰的驴看见耶和华的使者；毗珥山顶的七座坛；「有星要出于雅各」——一颗星自营中升起；
 * 摩押平原：约旦河、对面的耶利哥；西罗非哈的五个女儿；约书亚受按手；早晚的燔祭；七月初一吹角；许愿；
 * 吕便、迦得的牲畜；四十二站的路程亮起；迦南四境；六座逃城；「我耶和华住在以色列人中间」。
 *
 * 画面的方位：左 = 海（红海 / 盐海），东；右 = 西（往迦南）。近地是营：会幕在正中偏右，云柱立在其上；
 *            东营（犹大）在会幕之左，西营（以法莲）在其右，南营（吕便）在中丘上（远），北营（但）在近处画面底；
 *            营之右空出一片：磐石、巴兰的路、最后的约旦河与河那边的迦南（中丘上的耶利哥）。远山：西奈 / 何珥 / 毗珥。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'numbers';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('nmFar', 'exp', 0.35);      // 远山（西奈 / 何珥 / 毗珥）
  W.defineLevel('nmSand', 'exp', 0.3);      // 旷野的沙色
  W.defineLevel('nmStrike', 'lin', 0.3);    // 拔营：帐棚收起（1）
  W.defineLevel('nmManna', 'exp', 0.35);    // 地上的吗哪（11:7）
  W.defineLevel('nmQuail', 'lin', 0.12);    // 营四围的鹌鹑（11:31）
  W.defineLevel('nmBless', 'exp', 0.45);    // 祝福之光笼罩全营（6:24–26）
  W.defineLevel('nmGraves', 'lin', 0.075);  // 旷野里的坟（14:29）
  W.defineLevel('nmSnakes', 'exp', 0.4);    // 火蛇（21:6）
  W.defineLevel('nmAltars', 'exp', 0.5);    // 毗珥山顶的七座坛（23:1）
  W.defineLevel('nmFair', 'exp', 0.35);     // 帐棚何等华美（24:5）
  W.defineLevel('nmStar', 'lin', 0.22);     // 有星要出于雅各（24:17）
  W.defineLevel('nmJordan', 'exp', 0.3);    // 约旦河（22:1；26:63）
  W.defineLevel('nmCanaan', 'exp', 0.25);   // 河那边的迦南（绿）
  W.defineLevel('nmPath', 'lin', 0.16);     // 四十二站的路程（33:1–2）
  W.defineLevel('nmBorder', 'lin', 0.2);    // 迦南的四境（34:12）
  W.defineLevel('nmDwell', 'exp', 0.3);     // 我耶和华住在以色列人中间（35:34）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const TABV = 0.12;                         // 会幕在近地纵深里的位置
  const X = {
    tab: 0.66,                               // 会幕（院子约在 0.575–0.745）
    moses: 0.551, aaron: 0.563, eleazar: 0.54, ithamar: 0.575, miriam: 0.52, joshua: 0.53, caleb: 0.51,
    rods: 0.598, serpent: 0.757, well: 0.83, rock: 0.905, cairnM: 0.47,
    jordan: 0.885, jericho: 0.905,
    walls0: 0.7, walls1: 0.9,
  };
  const ROBE = {
    moses: [96, 100, 132], aaron: [238, 232, 216], eleazar: [226, 220, 204], ithamar: [214, 208, 192], miriam: [150, 104, 112],
    joshua: [150, 118, 78], caleb: [128, 96, 68], levite: [214, 206, 188], spy: [126, 100, 76],
    balaam: [120, 58, 64], servant: [116, 100, 84], balak: [118, 70, 120], dau: [170, 112, 108],
  };
  const PRIEST_ACC = [70, 96, 168];
  // 十二支派（2 章）：名、方位、纛的位置（层、x、纵深 v）、纛的颜色
  const TRIBES = [
    { id: 'judah', cn: '犹大', side: 'E', l: 2, x: 0.448, v: 0.34, rgb: [200, 64, 52], ref: '2:3' },
    { id: 'issachar', cn: '以萨迦', side: 'E', l: 2, x: 0.482, v: 0.08, rgb: [62, 88, 176], ref: '2:5' },
    { id: 'zebulun', cn: '西布伦', side: 'E', l: 2, x: 0.505, v: 0.6, rgb: [236, 232, 214], ref: '2:7' },
    { id: 'reuben', cn: '吕便', side: 'S', l: 1, x: 0.59, v: 0.1, rgb: [186, 44, 70], ref: '2:10' },
    { id: 'simeon', cn: '西缅', side: 'S', l: 1, x: 0.66, v: 0.1, rgb: [64, 146, 92], ref: '2:12' },
    { id: 'gad', cn: '迦得', side: 'S', l: 1, x: 0.73, v: 0.1, rgb: [150, 150, 164], ref: '2:14' },
    { id: 'ephraim', cn: '以法莲', side: 'W', l: 2, x: 0.772, v: 0.3, rgb: [48, 44, 56], ref: '2:18' },
    { id: 'manasseh', cn: '玛拿西', side: 'W', l: 2, x: 0.805, v: 0.06, rgb: [104, 70, 128], ref: '2:20' },
    { id: 'benjamin', cn: '便雅悯', side: 'W', l: 2, x: 0.828, v: 0.56, rgb: [214, 168, 70], ref: '2:22' },
    { id: 'dan', cn: '但', side: 'N', l: 2, x: 0.59, v: 0.92, rgb: [52, 112, 196], ref: '2:25' },
    { id: 'asher', cn: '亚设', side: 'N', l: 2, x: 0.66, v: 0.96, rgb: [226, 190, 120], ref: '2:27' },
    { id: 'naphtali', cn: '拿弗他利', side: 'N', l: 2, x: 0.73, v: 0.92, rgb: [150, 84, 54], ref: '2:29' },
  ];
  // 会众（每一个人都是确定的：位置、衣色、老少——四十年里老的一代归于尘土，孩子长大）
  const FOLK = [
    { id: 'f0', x: 0.44, v: 0.66, sex: 'm', age: 'adult', robe: [132, 104, 78] },
    { id: 'f1', x: 0.466, v: 0.46, sex: 'f', age: 'adult', robe: [156, 110, 96] },
    { id: 'f2', x: 0.49, v: 0.74, sex: 'm', age: 'child', robe: [176, 138, 96] },
    { id: 'f3', x: 0.515, v: 0.36, sex: 'f', age: 'elder', robe: [120, 100, 84] },
    { id: 'f4', x: 0.6, v: 0.62, sex: 'm', age: 'adult', robe: [110, 86, 70] },
    { id: 'f5', x: 0.632, v: 0.7, sex: 'f', age: 'adult', robe: [158, 138, 108] },
    { id: 'f6', x: 0.664, v: 0.6, sex: 'm', age: 'elder', robe: [104, 96, 110] },
    { id: 'f7', x: 0.695, v: 0.72, sex: 'f', age: 'child', robe: [184, 120, 110] },
    { id: 'f8', x: 0.728, v: 0.62, sex: 'm', age: 'adult', robe: [140, 96, 80] },
    { id: 'f9', x: 0.758, v: 0.44, sex: 'f', age: 'adult', robe: [120, 110, 140] },
    { id: 'f10', x: 0.79, v: 0.68, sex: 'm', age: 'adult', robe: [96, 80, 72] },
    { id: 'f11', x: 0.572, v: 0.74, sex: 'f', age: 'elder', robe: [150, 118, 90] },
  ];
  const ELDERS = ['f3', 'f6', 'f11'];
  const CHILDREN = ['f2', 'f7'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { far: 'sinai', gen: 0, aaron: 1, miriam: 1 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const port = () => W.w < W.h * 0.9;
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    const x = xf * W.w, L = GS.land;
    let y = L && L.groundY ? L.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  const vS = v => 1 + 0.35 * (v || 0);                    // 纵深越前越大（与人物同一比例）
  // 某层纵深 v 处的地面（与人物的脚下同一算法）
  function posY(l, xf, v) {
    const g = gY(l, xf);
    if (!v) return g;
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    return g + v * fh * 0.8;
  }
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }
  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(4436); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (!fig(id)) return; const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function place(id, x, layer) { if (fig(id)) C().place(id, x, layer); }
  function hold(id, what) {
    const c = C();
    if (!fig(id)) return;
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, what || null)); return; }
    const f = fig(id); if (f) f.prop = what || null;
  }
  const ride = (id, m) => { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, m || null)); };
  const attach = (id, fn) => { const c = C(); if (c.attach && fig(id)) c.attach(id, fn || null); };
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2, from: W.replaying ? 'none' : 'fade' }, o || {})));
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd || hasCrowd(gid)) return;
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function crowd(gid, o) { const c = C(); if (hasCrowd(gid)) return; c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function unCrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function mill(gid, on) { const c = C(); const g = c.crowds && c.crowds.get && c.crowds.get(gid); if (g) g.members.forEach(m => { m.mill = on; }); }
  // 看得见 / 看不见（只有驴看见使者：22:23）
  function fade(id, a) { const f = fig(id); if (f) f.targetAlpha = a; }
  // 地上的走兽绕开营与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 名字 / 字的位置：在画面之内（竖屏时经文在顶上，字稍低一些，不与经文相叠）
  function nameAt(xf, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    if (port()) cy = Math.max(cy, W.h * 0.36);
    return [clamp(xf * W.w, half + 8, W.w - half - 8), cy];
  }

  // ── 会众 ──────────────────────────────────────────────────
  function folkAdd(f, o) {
    add(f.id, Object.assign({ label: '以色列人', sex: f.sex, age: S.gen && CHILDREN.includes(f.id) ? 'adult' : f.age, x: f.x, v: f.v,
      facing: f.x < X.tab ? 1 : -1, robe: f.robe, glow: 0.1, prop: null }, o || {}));
  }
  const folkLive = () => FOLK.filter(f => !(S.gen && ELDERS.includes(f.id)));
  function folkHome(o) {
    const sp = (o && o.speed) || 0.03;
    folkLive().forEach(f => { if (fig(f.id)) walk(f.id, f.x, { speed: sp, pose: (o && o.pose) || 'stand' }); });
  }
  function folkPose(ps, o) {
    folkLive().forEach(f => pose(f.id, ps, o));
  }
  function folkFace(xf) { folkLive().forEach(f => face(f.id, xf)); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（会幕、云柱、纛、杖、磐石、铜蛇、井、墙、城、坟、逃城……）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.9, grow: 0.35, lit: 0.6, fire: 0.6, lift: 0.22, bud: 0.28, glow: 0.5, water: 0.3, dim: 0.4 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, {x, layer, v, size, label, show, grow, lit, fire, lift, bud, glow, water, tx, spd, tribe})
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, v: 0, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.03, tribe: -1 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'layer', 'v', 'size', 'label', 'spd', 'tribe', 'n', 'name']) if (o[k] != null) p[k] = o[k];
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
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  const pv = (id, k) => { const p = P.get(id); return p ? p[k] : 0; };

  // 转瞬的光（不属于世界的状态；重演时不放）
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 4 }, o)); }
  function beam(b, xf, v, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, v: v || 0, w: (o.w || 64) * SU(), k: o.k || 1 });
    if (o.ring !== false) fx().ring(xf * W.w, posY(2, xf, v || 0) - 18 * LS(2), [255, 236, 190], M() * (o.r || 0.26), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.nx, f.v || 0, o); }
  function glory(b, o) { flash(b, Object.assign({ type: 'glory', dur: 5.5 }, o)); }

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
  // 云团：上亮下暗，有体积
  function puff(shade) {
    const c = cnv(96, 96), g = c.getContext('2d');
    const gr = g.createRadialGradient(44, 40, 4, 48, 48, 48);
    if (shade) { gr.addColorStop(0, 'rgba(120,124,140,0.5)'); gr.addColorStop(0.55, 'rgba(110,114,132,0.28)'); gr.addColorStop(1, 'rgba(100,104,124,0)'); }
    else { gr.addColorStop(0, 'rgba(255,255,252,0.96)'); gr.addColorStop(0.45, 'rgba(248,246,240,0.66)'); gr.addColorStop(0.8, 'rgba(236,236,232,0.2)'); gr.addColorStop(1, 'rgba(230,230,228,0)'); }
    g.fillStyle = gr; g.fillRect(0, 0, 96, 96);
    return c;
  }
  // 光柱：横向柔边，顶上渐隐
  function column(c0, c1) {
    const c = cnv(64, 256), g = c.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, U.rgba(c1[0], c1[1], c1[2], 0)); hz.addColorStop(0.28, U.rgba(c1[0], c1[1], c1[2], 0.35));
    hz.addColorStop(0.5, U.rgba(c0[0], c0[1], c0[2], 1));
    hz.addColorStop(0.72, U.rgba(c1[0], c1[1], c1[2], 0.35)); hz.addColorStop(1, U.rgba(c1[0], c1[1], c1[2], 0));
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.25, 'rgba(0,0,0,0.85)'); vt.addColorStop(0.9, 'rgba(0,0,0,1)'); vt.addColorStop(1, 'rgba(0,0,0,0.4)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    return c;
  }
  // 火舌
  function tongue() {
    const c = cnv(32, 96), g = c.getContext('2d');
    g.translate(16, 54); g.scale(1, 2.5);
    const gr = g.createRadialGradient(0, 2, 0, 0, 0, 16);
    gr.addColorStop(0, 'rgba(255,240,190,1)'); gr.addColorStop(0.3, 'rgba(255,182,80,0.85)'); gr.addColorStop(0.65, 'rgba(255,120,40,0.35)'); gr.addColorStop(1, 'rgba(255,90,30,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 16, 0, TAU); g.fill();
    return c;
  }
  function sprites() {
    if (SP) return SP;
    try {
      SP = {
        warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([236, 242, 255], 1),
        ember: radial([255, 92, 36], 1), smoke: radial([146, 138, 130], 0.8, 0.55), soot: radial([34, 28, 26], 0.85, 0.55),
        fire: radial([255, 140, 52], 1, 0.3), core: radial([255, 244, 206], 1, 0.22), blue: radial([170, 206, 255], 1),
        rose: radial([255, 214, 226], 1), green: radial([150, 220, 130], 1), dark: radial([6, 4, 10], 1, 0.5),
        puff: puff(false), puffD: puff(true),
        colW: column([255, 252, 240], [236, 238, 246]), colF: column([255, 214, 130], [255, 120, 40]), colC: column([255, 250, 226], [255, 206, 130]),
        tongue: tongue(),
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
  function glowSp(ctx, sp, x, y, r, a) {
    if (!sp || a < 0.003 || !(r > 0.5)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }

  // ── 几何的缓存：随画面大小而变的路径 ──────────────────────
  let geoKey = '', GEO = null;
  function geo() {
    const k = W.w + 'x' + W.h + ':' + Math.round((W.lv.land || 0) * 64);
    if (k !== geoKey || !GEO) { geoKey = k; GEO = { path: new Map(), data: new Map() }; }
    return GEO;
  }
  function cachedPath(key, build) {
    const G = geo();
    let p = G.path.get(key);
    if (!p) { p = new Path2D(); build(p); G.path.set(key, p); if (G.path.size > 64) G.path.delete(G.path.keys().next().value); }
    return p;
  }
  function cachedData(key, build) {
    const G = geo();
    let d = G.data.get(key);
    if (!d) { d = build(); G.data.set(key, d); if (G.data.size > 32) G.data.delete(G.data.keys().next().value); }
    return d;
  }
  function landPath(l, x0f, x1f, N) {
    return cachedPath('land' + l + ':' + x0f.toFixed(3) + ':' + x1f.toFixed(3) + ':' + N, P2 => {
      const bot = l === 2 ? W.h + 6 : W.waterlineY(l);
      for (let i = 0; i <= N; i++) {
        const xf = lerp(x0f, x1f, i / N), y = Math.min(gY(l, xf), bot);
        if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y);
      }
      P2.lineTo(x1f * W.w, bot); P2.lineTo(x0f * W.w, bot); P2.closePath();
    });
  }

  // ════════════════════════════════════════════════════════════
  //  营：十二支派的帐棚（按支派围着会幕），利未人的帐棚，起先散乱的帐棚
  // ════════════════════════════════════════════════════════════
  const GRP_LEV = 12, GRP_LOOSE = 13;
  function campLayout() {
    return cachedData('camp', () => {
      const T2 = [], T1 = [];
      let k = 0;
      TRIBES.forEach((tr, ti) => {
        const n = tr.l === 1 ? 6 : tr.side === 'N' ? 3 : 4;
        for (let i = 0; i < n; i++) {
          const r1 = rt(ti * 37 + i * 5), r2 = rt(ti * 37 + i * 5 + 1), r3 = rt(ti * 37 + i * 5 + 2);
          const side = i % 2 ? 1 : -1;
          const dx = side * (0.012 + 0.018 * r1) * (tr.l === 1 ? 1.4 : 1);
          const x = tr.x + dx;
          let v;
          if (tr.l === 1) v = clamp(0.06 + r2 * 0.55, 0, 0.7);
          else if (tr.side === 'N') v = clamp(tr.v - 0.06 + r2 * 0.1, 0.8, 1.02);
          else v = clamp(tr.v + (r2 - 0.5) * 0.36, 0, 0.72);
          (tr.l === 1 ? T1 : T2).push({ x, v, l: tr.l, sz: 0.8 + r3 * 0.3, g: ti, k: k++, rgb: tr.rgb });
        }
      });
      // 利未人：革顺（西）、哥辖（南）、米拉利（北）环绕会幕
      [[0.752, 0.24], [0.742, 0.04], [0.61, 0.56], [0.7, 0.6], [0.66, 0.02], [0.755, 0.46]].forEach((q, i) => {
        T2.push({ x: q[0], v: q[1], l: 2, sz: 0.8, g: GRP_LEV, k: k++, rgb: [226, 222, 208] });
      });
      // 起先散乱的帐棚（2 章以前）
      [[0.46, 0.2], [0.53, 0.5], [0.575, 0.12], [0.72, 0.4], [0.77, 0.16], [0.81, 0.46], [0.5, 0.05]].forEach((q, i) => {
        T2.push({ x: q[0], v: q[1], l: 2, sz: 0.9 + rt(900 + i) * 0.2, g: GRP_LOOSE, k: k++, rgb: [150, 120, 90] });
      });
      [[0.62, 0.3], [0.7, 0.2], [0.76, 0.4]].forEach((q, i) => T1.push({ x: q[0], v: q[1], l: 1, sz: 0.9, g: GRP_LOOSE, k: k++, rgb: [150, 120, 90] }));
      T2.sort((a, b) => a.v - b.v);
      T1.sort((a, b) => a.v - b.v);
      return { T2, T1 };
    });
  }
  // 每一组帐棚支起的程度
  function grpGrow(g) {
    const strike = 1 - W.lv.nmStrike;
    if (g === GRP_LOOSE) return pv('loose', 'grow');
    if (g === GRP_LEV) return pv('lev', 'grow') * strike;
    const p = P.get('bn' + g);
    return p ? p.grow * p.a * strike : 0;
  }
  const TENT = [[-1, 0], [-0.9, -0.46], [-0.64, -0.8], [-0.34, -0.66], [0, -1], [0.34, -0.68], [0.64, -0.82], [0.9, -0.48], [1, 0]];
  // 画一层里纵深在 [v0, v1) 的帐棚
  function drawTents(ctx, l, v0, v1) {
    const L = campLayout(), list = l === 2 ? L.T2 : L.T1;
    const base = LS(l);
    const pc = port() ? 0.8 : 1;
    const body = new Path2D(), door = new Path2D(), rim = new Path2D();
    const stripes = new Map();
    const lamps = [];
    const d = litX() >= W.w * 0.6 ? 1 : -1;
    let any = false;
    for (const t of list) {
      if (t.v < v0 || t.v >= v1) continue;
      const k = grpGrow(t.g);
      if (k < 0.02) continue;
      any = true;
      const s = base * vS(t.v) * t.sz * pc * (l === 1 ? 1.45 : 1.18), x = t.x * W.w, y = posY(l, t.x, t.v) + 1.5 * s;
      const hw = 15 * s * (0.55 + 0.45 * k), h = 12 * s * k;
      for (let i = 0; i < TENT.length; i++) { const q = TENT[i], X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) body.lineTo(X1, Y1); else body.moveTo(X1, Y1); }
      body.closePath();
      if (k > 0.5) {
        const dw = 0.16 * hw, dh = 0.58 * h;
        door.rect(x - dw, y - dh, dw * 2, dh);
        // 支派的颜色：帐棚檐下的一道
        let sp = stripes.get(t.g);
        if (!sp) { sp = { p: new Path2D(), rgb: t.rgb }; stripes.set(t.g, sp); }
        sp.p.moveTo(x - 0.9 * hw, y - 0.46 * h); sp.p.lineTo(x - 0.64 * hw, y - 0.78 * h);
        sp.p.moveTo(x + 0.64 * hw, y - 0.8 * h); sp.p.lineTo(x + 0.9 * hw, y - 0.48 * h);
        const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
        for (let i = k0; i <= k1; i++) { const q = TENT[i]; if (i === k0) rim.moveTo(x + q[0] * hw, y + q[1] * h); else rim.lineTo(x + q[0] * hw, y + q[1] * h); }
        if ((t.k % 3 === 0 || t.g === GRP_LEV) && lamps.length < 40) lamps.push([x, y - dh * 0.5, hw, t.k]);
      }
    }
    if (!any) return;
    ctx.fillStyle = css([70, 56, 46], l);
    ctx.fill(body);
    ctx.lineWidth = Math.max(0.9, 2.2 * base * pc);
    for (const sp of stripes.values()) { ctx.strokeStyle = css(sp.rgb, l, 0.8, 0.12); ctx.stroke(sp.p); }
    ctx.fillStyle = css([22, 16, 14], l);
    ctx.fill(door);
    ctx.strokeStyle = css([232, 204, 164], l, 0.6 * (0.3 + 0.7 * W.daylight), 0.3);
    ctx.lineWidth = Math.max(0.6, 1.1 * base * pc);
    ctx.stroke(rim);
    // 夜里门口的灯；帐棚何等华美时（24:5）更亮
    const lamp = clamp(nightK() * 1.1, 0, 1) * 0.8 + W.lv.nmFair * 0.6 + W.lv.nmDwell * 0.3;
    if (lamp > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const q of lamps) {
        const fl = 0.8 + 0.2 * Math.sin(W.t * 6 + q[3] * 1.7);
        const g = q[2] * (2.4 + W.lv.nmFair * 1.6);
        glowSp(ctx, W.lv.nmFair > 0.3 ? SP.gold : SP.warm, q[0], q[1], g, Math.min(1, lamp) * fl * 0.5);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ── 纛（2:2）：杆与燕尾的旗，随风飘动 ─────────────────────────
  function drawBanner(ctx, p) {
    const tr = TRIBES[p.tribe];
    if (!tr) return;
    const k = p.grow * p.a * (1 - W.lv.nmStrike * 0.85);
    if (k < 0.02) return;
    const l = p.layer, s = LS(l) * vS(p.v) * (port() ? 0.85 : 1), x = p.x * W.w, y = posY(l, p.x, p.v);
    const H = 58 * s * k, top = y - H;
    ctx.globalAlpha = Math.min(1, p.a);
    ctx.strokeStyle = css([96, 72, 50], l);
    ctx.lineWidth = Math.max(0.8, 1.5 * s);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top); ctx.stroke();
    // 旗：燕尾，迎风而动
    const fw = 24 * s * k, fh = 13 * s * k, dir = W.wind >= 0 ? 1 : -1;
    const wv = i => Math.sin(W.t * 2.6 + p.seed + i * 1.4) * fh * 0.14 * (i / 4);
    const pts = [];
    for (let i = 0; i <= 4; i++) pts.push([x + dir * fw * i / 4, top + 2 * s + wv(i)]);
    ctx.fillStyle = css(tr.rgb, l, 1, 0.08);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(x + dir * fw * 0.8, top + 2 * s + fh * 0.5 + wv(3));
    ctx.lineTo(x + dir * fw, top + 2 * s + fh + wv(4));
    for (let i = 3; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + fh);
    ctx.closePath(); ctx.fill();
    // 旗上的亮边与金顶
    ctx.strokeStyle = css([255, 240, 210], l, 0.35 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i <= 4; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
    ctx.fillStyle = css([236, 196, 110], l, 1, 0.2);
    ctx.beginPath(); ctx.arc(x, top - 1.5 * s, 2 * s, 0, TAU); ctx.fill();
    if (p.lit > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, top, 26 * s, p.lit * 0.55);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 会幕（院子的白幔、帐幕、燔祭坛、灯台）─────────────────────
  function tabGeom(p) {
    const s = LS(2) * vS(TABV), x = p.x * W.w, y = posY(2, p.x, TABV) + 2 * s;
    const cw = Math.min(104 * s, 0.085 * W.w), k = cw / (80 * s);   // 窄屏上按比例收小
    return { s: s * k, x, y, cw, fh: 17 * s * k, tl: x - 10 * s * k, tr: x + cw - 14 * s * k, th: 44 * s * k };
  }
  function drawTab(ctx, p) {
    if (p.a < 0.01) return;
    const G = tabGeom(p), s = G.s, x = G.x, y = G.y, l = 2;
    ctx.globalAlpha = p.a;
    const d = litX() >= x ? 1 : -1;
    // 帐幕：盖着皮的长方的帐（西在右）
    const ty = y - G.fh + 2 * s, top = y - G.th;
    ctx.fillStyle = css([76, 60, 52], l);
    ctx.beginPath();
    ctx.moveTo(G.tl, ty); ctx.lineTo(G.tl, top + 6 * s); ctx.quadraticCurveTo(G.tl + 2 * s, top, G.tl + 8 * s, top);
    ctx.lineTo(G.tr - 6 * s, top); ctx.quadraticCurveTo(G.tr, top, G.tr, top + 6 * s); ctx.lineTo(G.tr, ty); ctx.closePath(); ctx.fill();
    // 盖的幅
    ctx.strokeStyle = css([110, 90, 76], l, 0.6);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 1; i < 6; i++) { const xx = lerp(G.tl + 6 * s, G.tr - 4 * s, i / 6); ctx.moveTo(xx, top + 1 * s); ctx.lineTo(xx, ty); }
    ctx.stroke();
    // 东面的门帘：蓝色、紫色、朱红色
    const dw = 7 * s;
    [[60, 80, 160], [118, 64, 128], [186, 44, 52]].forEach((c, i) => {
      ctx.fillStyle = css(c, l, 1, 0.05);
      ctx.fillRect(G.tl + i * dw / 3, top + 7 * s, dw / 3 + 0.5, ty - top - 7 * s);
    });
    // 灯台的七盏灯（8:3）：门帘里透出的七点
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const lx = G.tl + dw * 0.5, ly = top + 16 * s;
      glowSp(ctx, SP.gold, lx, ly, 34 * s, p.lit * 0.55);
      ctx.fillStyle = 'rgb(255,232,170)';
      for (let i = 0; i < 7; i++) {
        const fl = 0.75 + 0.25 * Math.sin(W.t * 7 + i * 1.9);
        ctx.globalAlpha = p.lit * fl;
        const lx2 = lx + (i - 3) * 1.6 * s, ly2 = ly - (3 - Math.abs(i - 3)) * 0.9 * s;
        ctx.beginPath(); ctx.arc(lx2, ly2, 0.9 * s, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 施恩座上的声音（7:89）：帐幕里的光
    if (p.glow > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const gx = lerp(G.tl, G.tr, 0.72), gy = (top + ty) / 2;
      glowSp(ctx, SP.gold, gx, gy, 70 * s, p.glow * 0.7);
      glowSp(ctx, SP.core, gx, gy, 20 * s, p.glow * 0.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 迎光的边
    ctx.strokeStyle = css([236, 214, 180], l, 0.5 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(G.tl + 8 * s, top); ctx.lineTo(G.tr - 6 * s, top); ctx.stroke();
    // 燔祭坛（铜）：顶在白幔之上露出，坛上的火常常烧着（6:13 的火在此）
    const ax = x - G.cw * 0.52, aw = 8 * s, ah = 9 * s;
    ctx.fillStyle = css([156, 110, 62], l, 1, 0.04);
    ctx.fillRect(ax - aw, y - G.fh - ah + 3 * s, aw * 2, ah);
    ctx.fillRect(ax - aw - 1 * s, y - G.fh - ah + 1.5 * s, 2 * s, 2 * s);
    ctx.fillRect(ax + aw - 1 * s, y - G.fh - ah + 1.5 * s, 2 * s, 2 * s);
    // 院子的白幔（前面一道）与柱子
    const fy = y - G.fh;
    ctx.fillStyle = css([238, 234, 222], l, 1, 0.06);
    ctx.fillRect(x - G.cw, fy, G.cw * 2, G.fh);
    ctx.fillStyle = css([200, 194, 180], l, 0.6);
    ctx.fillRect(x - G.cw, y - 3 * s, G.cw * 2, 3 * s);
    // 院门：蓝、紫、朱红的帘
    const gx0 = x - G.cw + 10 * s, gw = 20 * s;
    [[60, 80, 160], [118, 64, 128], [186, 44, 52], [238, 234, 222]].forEach((c, i) => {
      ctx.fillStyle = css(c, l, 0.95, 0.05);
      ctx.fillRect(gx0, fy + i * G.fh / 4, gw, G.fh / 4 + 0.5);
    });
    ctx.strokeStyle = css([126, 96, 60], l, 0.9);
    ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const np = Math.max(6, Math.round(G.cw * 2 / (12 * s)));
    for (let i = 0; i <= np; i++) { const xx = x - G.cw + (G.cw * 2) * i / np; ctx.moveTo(xx, fy - 1 * s); ctx.lineTo(xx, y); }
    ctx.stroke();
    ctx.fillStyle = css([226, 226, 232], l, 1, 0.2);
    for (let i = 0; i <= np; i++) { const xx = x - G.cw + (G.cw * 2) * i / np; ctx.fillRect(xx - 1.1 * s, fy - 2 * s, 2.2 * s, 1.4 * s); }
    ctx.strokeStyle = css([255, 250, 236], l, 0.55 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - G.cw, fy + 0.5); ctx.lineTo(x + G.cw, fy + 0.5); ctx.stroke();
    // 坛上的火与烟
    if (p.fire > 0.01) { flame(ctx, ax, y - G.fh - ah + 3 * s, 9 * s, p.fire, p.seed); smoke(ctx, ax, y - G.fh - ah - 4 * s, p.fire * 0.8, W.h * 0.2, 7 * s, p.seed, false); }
    ctx.globalAlpha = 1;
  }

  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
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
  // 烟柱：程序化的烟团（按时间确定）
  function smoke(ctx, x, y, k, H, w, seed, dark, rate) {
    if (k < 0.01 || !SP) return;
    const N = 11, day = 0.3 + 0.7 * W.daylight;
    const spr = dark ? SP.soot : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.6 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ── 云柱 / 火柱（9:15–23）：日间是云，夜间形状如火 ─────────────
  function pillarGeom(p) {
    const G = tabGeom(getP('tab') || { x: p.x });
    const s = G.s;
    const baseRest = posY(2, p.x, TABV) + 2 * s - G.th + 4 * s;
    const top = port() ? W.h * 0.3 : W.h * 0.09;
    const lift = p.lift;
    // lift > 0：收上去（离开帐幕）；lift < 0：降到会幕门口（12:5）
    const base = lift >= 0 ? lerp(baseRest, top + (baseRest - top) * 0.45, lift) : lerp(baseRest, posY(2, p.x, TABV) - 2 * s, -lift);
    return { s, base, top: lift >= 0 ? top - lift * W.h * 0.04 : top + (-lift) * (baseRest - top) * 0.25, w: Math.min(44 * s, 0.045 * W.w) };
  }
  function drawPillar(ctx, p) {
    const a = p.a * (1 - 0.82 * p.dim);
    if (a < 0.01 || !SP) return;
    const g = pillarGeom(p), x = p.x * W.w, H = g.base - g.top;
    if (H < 8) return;
    const nk = nightK(), dayK = 1 - nk * 0.92, w = g.w * (1 + 0.12 * W.lv.nmDwell);
    // 日间：云的柱，上头铺开，遮盖帐幕
    if (dayK > 0.02) {
      const al0 = a * dayK;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = al0 * 0.2;
      ctx.drawImage(SP.colW, x - w * 1.5, g.top - H * 0.05, w * 3, H * 1.05 + 4);
      ctx.globalCompositeOperation = 'source-over';
      const N = clamp(Math.round(H / (w * 0.5)), 18, 44);
      for (let i = 0; i < N; i++) {
        const t = U.fract(i / N + W.t * 0.007 + rt(i * 3 + 50) * 0.02);
        const y = g.base - t * H, env = smoothstep(0, 0.05, t) * (1 - smoothstep(0.62, 1, t));
        const r = w * (0.82 + 0.3 * t) * (0.85 + 0.3 * rt(i * 3 + 51));
        const xx = x + Math.sin(t * 7 + i * 0.9 + W.t * 0.18) * w * 0.16;
        const al = al0 * env;
        if (al < 0.01) continue;
        glowSp(ctx, SP.puffD, xx + r * 0.1, y + r * 0.26, r * 0.95, al * 0.2);
        glowSp(ctx, SP.puff, xx, y, r, al * (0.6 + 0.3 * W.daylight));
      }
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, g.base - H * 0.3, w * 3.4, al0 * 0.16);
      glowSp(ctx, SP.white, x, g.top + H * 0.12, w * 3, al0 * 0.14);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 夜间：形状如火
    const fk = nk * a;
    if (fk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = fk * 0.7;
      ctx.drawImage(SP.colF, x - w * 1.2, g.top, w * 2.4, H + 4);
      ctx.globalAlpha = fk * 0.75;
      ctx.drawImage(SP.colC, x - w * 0.34, g.top + H * 0.08, w * 0.68, H * 0.92 + 4);
      const N = 30;
      for (let i = 0; i < N; i++) {
        const t = U.fract(i / N + W.t * 0.07 + rt(i * 3 + 70) * 0.05);
        const y = g.base - t * H, env = smoothstep(0, 0.04, t) * (1 - smoothstep(0.72, 1, t));
        const tw = w * (0.55 + 0.35 * rt(i * 3 + 71)) * (1 - 0.35 * t), th = tw * 2.4;
        const xx = x + Math.sin(t * 10 + i * 1.3 + W.t * 1.4) * w * 0.26;
        const fl = 0.7 + 0.3 * Math.sin(W.t * 11 + i * 2.1);
        ctx.globalAlpha = Math.min(1, fk * env * 0.6 * fl);
        ctx.drawImage(SP.tongue, xx - tw / 2, y - th * 0.62, tw, th);
      }
      // 火星
      ctx.fillStyle = 'rgb(255,226,160)';
      for (let i = 0; i < 18; i++) {
        const t = U.fract(rt(i * 2 + 130) + W.t * (0.05 + 0.04 * rt(i * 2 + 131)));
        const y = g.base - t * H * 1.05, xx = x + Math.sin(t * 13 + i) * w * (0.4 + 0.5 * t);
        ctx.globalAlpha = fk * (1 - t) * 0.8;
        ctx.fillRect(xx, y, 1.6 * SU(), 1.6 * SU());
      }
      glowSp(ctx, SP.gold, x, g.base - H * 0.3, w * 3.2, fk * 0.3);
      // 地上的火光：照亮全营
      glowSp(ctx, SP.warm, x, g.base, M() * 0.36, fk * 0.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 住在其中（35:34）：柱是金的
    const dk = W.lv.nmDwell * a;
    if (dk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = dk * 0.18 * (1 - 0.6 * nk);
      ctx.drawImage(SP.colF, x - w * 1.3, g.top, w * 2.6, H + 4);
      glowSp(ctx, SP.gold, x, g.base - H * 0.2, w * 2.4, dk * 0.3);
      glowSp(ctx, SP.gold, x, g.base, M() * 0.3, dk * 0.18);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 地上的吗哪（11:7–9）与鹌鹑（11:31–32）────────────────────
  function drawManna(ctx) {
    const k = W.lv.nmManna;
    if (k < 0.01) return;
    const u = SU();
    const pts = cachedData('manna', () => {
      const out = [];
      for (let i = 0; i < 260; i++) { const xf = lerp(0.4, 0.99, rt(i * 2 + 300)), v = Math.pow(rt(i * 2 + 301), 0.8); out.push([xf * W.w, posY(2, xf, v * 1.2), 0.7 + v]); }
      return out;
    });
    const c = W.shade([246, 244, 232], 0, 0.2);
    ctx.fillStyle = U.rgb(c[0], c[1], c[2]);
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i], tw = 0.55 + 0.45 * Math.sin(W.t * 1.3 + i * 2.7);
      ctx.globalAlpha = k * tw * 0.9;
      const sz = q[2] * 1.2 * u;
      ctx.fillRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz * 0.7);
    }
    ctx.globalAlpha = 1;
  }
  function drawQuailGround(ctx) {
    const k = W.lv.nmQuail;
    if (k < 0.01) return;
    const u = SU();
    const pts = cachedData('quail', () => {
      const out = [];
      for (let i = 0; i < 110; i++) { const xf = lerp(0.41, 0.98, rt(i * 3 + 500)), v = rt(i * 3 + 501); out.push([xf * W.w, posY(2, xf, v * 1.15), 0.8 + v * 0.5, rt(i * 3 + 502)]); }
      return out;
    });
    const body = css([128, 98, 66], 2), dark = css([70, 54, 40], 2);
    for (let i = 0; i < pts.length; i++) {
      const q = pts[i];
      if (q[3] > k) continue;
      const s = q[2] * 1.6 * u, hop = Math.max(0, Math.sin(W.t * 3 + i * 1.3)) * (i % 5 === 0 ? 2.5 * s : 0);
      const d = i % 2 ? 1 : -1;
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(q[0], q[1] - 1.6 * s - hop, 2.2 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(q[0] + d * 1.9 * s, q[1] - 2.6 * s - hop, 0.9 * s, 0, TAU); ctx.fill();
    }
  }

  // ── 旷野里的坟（14:29–33）：一堆一堆的石头 ─────────────────────
  function drawGraves(ctx, l) {
    const k = W.lv.nmGraves;
    if (k < 0.01) return;
    const pts = cachedData('graves' + l, () => {
      const out = [];
      const n = l === 2 ? 34 : 22;
      for (let i = 0; i < n; i++) {
        const xf = l === 2 ? lerp(0.4, 0.98, rt(i * 4 + 700 + l * 200)) : lerp(0.52, 0.98, rt(i * 4 + 700 + l * 200));
        if (l === 2 && Math.abs(xf - X.tab) < 0.08) continue;
        const v = l === 2 ? lerp(0.05, 0.95, rt(i * 4 + 701 + l * 200)) : lerp(0, 0.6, rt(i * 4 + 701 + l * 200));
        out.push([xf, v, rt(i * 4 + 702 + l * 200), rt(i * 4 + 703 + l * 200)]);
      }
      return out;
    });
    const s0 = LS(l);
    const stone = css([150, 132, 110], l), shade = css([96, 84, 72], l);
    const cairn = (P2, P3, q) => {
      const s = s0 * vS(q[1]) * (0.8 + q[3] * 0.4), x = q[0] * W.w, y = posY(l, q[0], q[1]);
      P2.moveTo(x + 6 * s, y - 1.5 * s); P2.ellipse(x, y - 1.5 * s, 6 * s, 2.6 * s, 0, 0, TAU);
      P3.moveTo(x + 1.5 * s, y - 3 * s); P3.ellipse(x - 1.5 * s, y - 3 * s, 3 * s, 2 * s, 0, 0, TAU);
      P3.moveTo(x + 4.6 * s, y - 2.6 * s); P3.ellipse(x + 2 * s, y - 2.6 * s, 2.6 * s, 1.8 * s, 0, 0, TAU);
      P3.moveTo(x + 2 * s, y - 5 * s); P3.ellipse(x, y - 5 * s, 2 * s, 1.6 * s, 0, 0, TAU);
    };
    // 都已显出时：一笔画完（缓存）
    if (k >= 0.999) {
      const A = cachedData('gravesP' + l, () => { const P2 = new Path2D(), P3 = new Path2D(); for (const q of pts) cairn(P2, P3, q); return [P2, P3]; });
      ctx.fillStyle = shade; ctx.fill(A[0]);
      ctx.fillStyle = stone; ctx.fill(A[1]);
      return;
    }
    for (const q of pts) {
      const vis = clamp((k - q[2] * 0.95) * 12, 0, 1);
      if (vis < 0.02) continue;
      const s = s0 * vS(q[1]) * (0.8 + q[3] * 0.4), x = q[0] * W.w, y = posY(l, q[0], q[1]);
      ctx.globalAlpha = vis;
      ctx.fillStyle = shade;
      ctx.beginPath(); ctx.ellipse(x, y - 1.5 * s, 6 * s, 2.6 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = stone;
      ctx.beginPath(); ctx.ellipse(x - 1.5 * s, y - 3 * s, 3 * s, 2 * s, 0, 0, TAU); ctx.ellipse(x + 2 * s, y - 2.6 * s, 2.6 * s, 1.8 * s, 0, 0, TAU); ctx.ellipse(x, y - 5 * s, 2 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── 各样物件 ────────────────────────────────────────────────
  // 十二根杖（17:7–8）：亚伦的杖（居中）发芽、开花、结了熟杏
  function drawRods(ctx, p) {
    const s = LS(2) * vS(p.v) * 1.5, x = p.x * W.w, y = posY(2, p.x, p.v);
    const n = p.n == null ? 12 : p.n;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([112, 84, 58], 2);
    ctx.lineWidth = Math.max(0.8, 1.4 * s);
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      if (n === 1 && i !== 5) continue;
      const rx = x + (i - 5.5) * 3.2 * s, h = (30 + 4 * rt(i + 40)) * s;
      ctx.moveTo(rx, y); ctx.lineTo(rx + (rt(i + 60) - 0.5) * 2 * s, y - h);
    }
    ctx.stroke();
    const b = p.bud;
    if (b > 0.01) {
      const rx = x - 0.5 * 3.2 * s, h = (30 + 4 * rt(45)) * s;
      // 杖的金光
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, rx, y - h * 0.6, 44 * s, (p.glow * 0.7 + b * 0.25) * p.a);
        glowSp(ctx, SP.rose, rx, y - h * 0.65, 16 * s, (p.glow * 0.5 + b * 0.2) * p.a);
        ctx.globalCompositeOperation = 'source-over';
      }
      for (let j = 0; j < 14; j++) {
        const t = 0.25 + 0.72 * rt(j * 3 + 80), side = j % 2 ? 1 : -1;
        const bx = rx + side * (1.5 + 2 * rt(j * 3 + 81)) * s, by = y - h * t;
        const kb = clamp(b * 3 - rt(j * 3 + 82) * 0.6, 0, 1);            // 发芽
        const kf = clamp((b - 0.3) * 3 - rt(j * 3 + 82) * 0.5, 0, 1);     // 开花
        const ka = clamp((b - 0.62) * 3 - rt(j * 3 + 82) * 0.4, 0, 1);    // 结了熟杏
        if (kb > 0) { ctx.fillStyle = css([110, 150, 70], 2, kb, 0.1); ctx.beginPath(); ctx.ellipse(bx, by, 1.8 * s * kb, 0.9 * s * kb, side * 0.6, 0, TAU); ctx.fill(); }
        if (kf > 0 && j % 3 !== 2) {
          ctx.fillStyle = css([255, 236, 240], 2, kf, 0.35);
          for (let q = 0; q < 5; q++) { const a = q / 5 * TAU + j; ctx.beginPath(); ctx.arc(bx + Math.cos(a) * 1.7 * s * kf, by - 1.2 * s + Math.sin(a) * 1.7 * s * kf, 1.4 * s * kf, 0, TAU); ctx.fill(); }
          ctx.fillStyle = css([236, 150, 170], 2, kf, 0.2);
          ctx.beginPath(); ctx.arc(bx, by - 1.2 * s, 0.7 * s * kf, 0, TAU); ctx.fill();
        }
        if (ka > 0 && j % 3 === 2) { ctx.fillStyle = css([150, 168, 96], 2, ka, 0.1); ctx.beginPath(); ctx.ellipse(bx, by + 1.5 * s, 1.3 * s * ka, 1.9 * s * ka, 0, 0, TAU); ctx.fill(); }
      }
    }
    ctx.globalAlpha = 1;
  }

  // 磐石（20:8–11）与流出来的水
  function drawRock(ctx, p) {
    const s = LS(2) * vS(p.v) * (port() ? 1 : 1.3), x = p.x * W.w, y = posY(2, p.x, p.v) + 2 * s;
    ctx.globalAlpha = p.a;
    const R = [[-34, 0], [-31, -18], [-22, -34], [-6, -42], [10, -38], [24, -28], [32, -12], [35, 0]];
    ctx.fillStyle = css([150, 106, 86], 2);
    ctx.beginPath();
    R.forEach((q, i) => (i ? ctx.lineTo(x + q[0] * s, y + q[1] * s) : ctx.moveTo(x + q[0] * s, y + q[1] * s)));
    ctx.closePath(); ctx.fill();
    // 背光一面
    ctx.fillStyle = css([90, 62, 54], 2, 0.55);
    const d = litX() >= x ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x - d * 4 * s, y - 40 * s); ctx.lineTo(x - d * 22 * s, y - 34 * s); ctx.lineTo(x - d * 34 * s, y); ctx.lineTo(x - d * 8 * s, y); ctx.closePath(); ctx.fill();
    // 岩纹与裂缝
    ctx.strokeStyle = css([70, 48, 42], 2, 0.7);
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    ctx.moveTo(x - 4 * s, y - 38 * s); ctx.lineTo(x - 1 * s, y - 26 * s); ctx.lineTo(x - 5 * s, y - 14 * s); ctx.lineTo(x - 2 * s, y - 4 * s);
    ctx.moveTo(x + 14 * s, y - 30 * s); ctx.lineTo(x + 20 * s, y - 18 * s);
    ctx.moveTo(x - 20 * s, y - 26 * s); ctx.lineTo(x - 26 * s, y - 12 * s);
    ctx.stroke();
    ctx.strokeStyle = css([236, 196, 160], 2, 0.45 * dayA(), 0.25);
    ctx.beginPath(); ctx.moveTo(x + d * 6 * s, y - 42 * s); ctx.lineTo(x + d * 24 * s, y - 28 * s); ctx.lineTo(x + d * 33 * s, y - 10 * s); ctx.stroke();
    // 水：从裂缝涌出，流下，在地上成溪
    const wk = p.water;
    if (wk > 0.01) {
      const wx = x - 2 * s, wy = y - 22 * s;
      const top = W.shade([196, 226, 240], 0, 0.15), deep = W.shade([70, 130, 170], 0, 0.05);
      // 溪：从石脚向左前方流去
      const path = cachedPath('stream:' + p.x.toFixed(3), P2 => {
        const pts = [];
        for (let i = 0; i <= 16; i++) { const t = i / 16, xf = lerp(p.x - 0.01, p.x - 0.13, t), v = lerp(p.v + 0.02, 0.92, Math.pow(t, 0.9)) ; pts.push([xf * W.w + Math.sin(t * 7) * 6 * s, posY(2, xf, v)]); }
        const wd = i => (2.5 + 9 * (i / 16)) * s;
        pts.forEach((q, i) => (i ? P2.lineTo(q[0], q[1] - wd(i)) : P2.moveTo(q[0], q[1] - wd(i))));
        for (let i = pts.length - 1; i >= 0; i--) P2.lineTo(pts[i][0], pts[i][1] + wd(i) * 0.4);
        P2.closePath();
      });
      ctx.globalAlpha = p.a * Math.min(1, wk * 1.3);
      ctx.fillStyle = U.rgb(deep[0], deep[1], deep[2]);
      ctx.fill(path);
      ctx.strokeStyle = U.rgba(top[0], top[1], top[2], 0.6);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      ctx.stroke(path);
      // 涌出的水柱
      ctx.strokeStyle = U.rgba(top[0], top[1], top[2], 0.85 * wk);
      ctx.lineWidth = Math.max(1, 3 * s * wk);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const sx = wx - i * 2 * s;
        ctx.moveTo(sx, wy); ctx.quadraticCurveTo(sx - 8 * s, wy + 2 * s, sx - 11 * s - i * 2 * s, y);
      }
      ctx.stroke();
      if (SP) {
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 10; i++) {
          const ph = U.fract(W.t * 0.8 + i / 10);
          const sx = wx - ph * 12 * s, sy = wy + ph * ph * 22 * s;
          glowSp(ctx, SP.blue, sx, sy, 3 * s, wk * (1 - ph) * 0.8);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 铜蛇挂在杆子上（21:8–9）：夕照里的铜，望它的人就活了
  const serpH = p => Math.min(150 * LS(2) * vS(p.v) * 1.35, W.h * 0.36);
  function drawSerpent(ctx, p) {
    const k = p.grow;
    if (k < 0.01) return;
    const s = LS(2) * vS(p.v) * 1.35, x = p.x * W.w, y = posY(2, p.x, p.v);
    const H = serpH(p) * k, top = y - H;
    ctx.globalAlpha = p.a;
    const lit = p.lit, d = litX() >= x ? 1 : -1;
    // 光晕与光芒（在杆后）
    if (lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const cy = top + 22 * s;
      glowSp(ctx, SP.gold, x, cy, 80 * s, lit * 0.6);
      glowSp(ctx, SP.warm, x, cy, 210 * s, lit * 0.26);
      glowSp(ctx, SP.core, x, cy, 18 * s, lit * 0.5);
      ctx.fillStyle = 'rgb(255,226,160)';
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * TAU + W.t * 0.04, L = (110 + 60 * Math.sin(i * 2.3 + W.t * 0.6)) * s;
        ctx.globalAlpha = lit * 0.07 * (0.6 + 0.4 * Math.sin(W.t * 0.9 + i));
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x + Math.cos(a - 0.018) * L, cy + Math.sin(a - 0.018) * L);
        ctx.lineTo(x + Math.cos(a + 0.018) * L, cy + Math.sin(a + 0.018) * L);
        ctx.closePath(); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 杆与横木
    ctx.strokeStyle = css([92, 68, 46], 2);
    ctx.lineWidth = Math.max(1.2, 2.6 * s);
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top); ctx.moveTo(x - 13 * s * k, top + 8 * s); ctx.lineTo(x + 13 * s * k, top + 8 * s); ctx.stroke();
    ctx.strokeStyle = css([226, 190, 140], 2, 0.4 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 1 * s, y); ctx.lineTo(x + d * 1 * s, top); ctx.stroke();
    // 铜蛇：绕在杆上，头昂起
    if (k > 0.6) {
      const kk = clamp((k - 0.6) / 0.4, 0, 1);
      const pts = [];
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        const yy = top + 50 * s - t * 50 * s;
        const xx = x + Math.sin(t * TAU * 1.75 + 0.3) * (10 - 4 * t) * s;
        pts.push([xx, yy]);
      }
      // 头：昂起，望着众人
      pts.push([x + 5 * s, top - 4 * s]); pts.push([x + 10 * s, top - 3 * s]);
      const bronzeD = W.shade([112, 70, 34], 0, 0.1), bronzeL = W.shade([236, 176, 96], 0, 0.3 + lit * 0.3);
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.globalAlpha = p.a * kk;
      ctx.strokeStyle = U.rgb(bronzeD[0], bronzeD[1], bronzeD[2]);
      ctx.lineWidth = 5 * s;
      ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.stroke();
      ctx.strokeStyle = U.rgb(bronzeL[0], bronzeL[1], bronzeL[2]);
      ctx.lineWidth = 2 * s;
      ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0] + d * 0.8 * s, q[1] - 0.8 * s) : ctx.moveTo(q[0] + d * 0.8 * s, q[1] - 0.8 * s))); ctx.stroke();
      ctx.fillStyle = U.rgb(bronzeD[0], bronzeD[1], bronzeD[2]);
      ctx.beginPath(); ctx.ellipse(x + 10.5 * s, top - 3.2 * s, 4 * s, 2.6 * s, 0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = U.rgb(bronzeL[0], bronzeL[1], bronzeL[2]);
      ctx.beginPath(); ctx.ellipse(x + 10.8 * s, top - 4.2 * s, 2.4 * s, 1.1 * s, 0.2, 0, TAU); ctx.fill();
      if (lit > 0.01 && SP) {
        ctx.globalCompositeOperation = 'lighter';
        const gl = 0.6 + 0.4 * Math.sin(W.t * 1.6);
        for (let i = 0; i < pts.length; i += 3) glowSp(ctx, SP.gold, pts[i][0], pts[i][1], 7 * s, lit * 0.35 * gl);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 井（21:16–18）：首领用圭用杖所挖的井，水涌上来
  function drawWell(ctx, p) {
    const s = LS(2) * vS(p.v), x = p.x * W.w, y = posY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 110, 92], 2);
    ctx.beginPath(); ctx.ellipse(x, y - 3 * s, 13 * s, 4.5 * s, 0, 0, TAU); ctx.fill();
    const wc = W.shade([96, 150, 186], 0, 0.1);
    ctx.fillStyle = U.rgb(wc[0], wc[1], wc[2]);
    ctx.beginPath(); ctx.ellipse(x, y - 4 * s, 9 * s, 2.8 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([150, 132, 110], 2);
    for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; ctx.beginPath(); ctx.arc(x + Math.cos(a) * 11 * s, y - 3 * s + Math.sin(a) * 3.8 * s, 2 * s, 0, TAU); ctx.fill(); }
    if (p.water > 0.01 && SP) {
      const top = W.shade([214, 236, 248], 0, 0.3);
      ctx.strokeStyle = U.rgba(top[0], top[1], top[2], 0.7 * p.water);
      ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ph = U.fract(W.t * 0.9 + i / 5), hh = 18 * s * p.water * Math.sin(ph * Math.PI);
        const sx = x + (i - 2) * 2.5 * s;
        ctx.moveTo(sx, y - 4 * s); ctx.quadraticCurveTo(sx + (i - 2) * 1.5 * s, y - 4 * s - hh * 1.2, sx + (i - 2) * 4 * s, y - 4 * s - hh * 0.2);
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 8; i++) {
        const ph = U.fract(W.t * 0.7 + i / 8);
        glowSp(ctx, SP.blue, x + Math.sin(i * 2.4) * 8 * s * ph, y - 6 * s - ph * 22 * s * p.water, 3 * s, p.water * (1 - ph) * 0.9);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 葡萄园的窄路：这边有墙，那边也有墙（22:24）
  function drawWalls(ctx, p) {
    const s0 = LS(2);
    ctx.globalAlpha = p.a;
    for (const [v, seed] of [[0.14, 1], [0.78, 2]]) {
      const s = s0 * vS(v), hgt = 9 * s;
      const top = i => posY(2, lerp(X.walls0, X.walls1, i / 30), v) - hgt - (Math.sin(i * 2.1 + seed) * 0.8 + (i % 7 === 3 ? -1.5 : 0)) * s;
      const path = cachedPath('wall' + v, P2 => {
        for (let i = 0; i <= 30; i++) { const xf = lerp(X.walls0, X.walls1, i / 30); if (i) P2.lineTo(xf * W.w, top(i)); else P2.moveTo(xf * W.w, top(i)); }
        for (let i = 30; i >= 0; i--) { const xf = lerp(X.walls0, X.walls1, i / 30); P2.lineTo(xf * W.w, posY(2, xf, v) + 1); }
        P2.closePath();
      });
      // 葡萄树（墙后）
      ctx.fillStyle = css([70, 100, 52], 2);
      for (let i = 0; i < 10; i++) {
        const xf = lerp(X.walls0 + 0.008, X.walls1 - 0.008, (i + 0.5) / 10), bx = xf * W.w, by = posY(2, xf, v) - hgt - 3 * s;
        ctx.beginPath(); ctx.ellipse(bx, by, 6 * s, 4 * s, 0, 0, TAU); ctx.ellipse(bx + 5 * s, by + 1.5 * s, 4.5 * s, 3.2 * s, 0, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = css([112, 60, 110], 2, 0.9);
      for (let i = 0; i < 10; i += 2) {
        const xf = lerp(X.walls0 + 0.008, X.walls1 - 0.008, (i + 0.5) / 10), bx = xf * W.w + 2 * s, by = posY(2, xf, v) - hgt;
        ctx.beginPath(); ctx.arc(bx, by, 1.6 * s, 0, TAU); ctx.arc(bx + 1.8 * s, by + 0.8 * s, 1.4 * s, 0, TAU); ctx.fill();
      }
      // 石墙
      ctx.fillStyle = css([166, 146, 118], 2);
      ctx.fill(path);
      const mk = cachedPath('wallj' + v, P2 => {
        for (let r = 1; r < 3; r++) {
          for (let i = 0; i <= 30; i++) { const xf = lerp(X.walls0, X.walls1, i / 30), y = posY(2, xf, v) - hgt * r / 3; if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y); }
        }
        for (let i = 0; i < 44; i++) {
          const r = i % 3, xf = lerp(X.walls0, X.walls1, (i + (r % 2) * 0.5) / 44), y0 = posY(2, xf, v) - hgt * r / 3;
          P2.moveTo(xf * W.w, y0); P2.lineTo(xf * W.w, y0 - hgt / 3);
        }
      });
      ctx.strokeStyle = css([96, 82, 66], 2, 0.55);
      ctx.lineWidth = Math.max(0.5, 0.7 * s0);
      ctx.stroke(mk);
      ctx.strokeStyle = css([236, 216, 180], 2, 0.45 * dayA(), 0.25);
      ctx.lineWidth = Math.max(0.6, 1 * s0);
      ctx.beginPath();
      for (let i = 0; i <= 30; i++) { const xf = lerp(X.walls0, X.walls1, i / 30); if (i) ctx.lineTo(xf * W.w, top(i)); else ctx.moveTo(xf * W.w, top(i)); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 米利暗的坟（20:1）
  function drawCairn(ctx, p) {
    const s = LS(2) * vS(p.v), x = p.x * W.w, y = posY(2, p.x, p.v);
    ctx.globalAlpha = p.a * p.grow;
    ctx.fillStyle = css([112, 98, 84], 2);
    ctx.beginPath(); ctx.ellipse(x, y - 2 * s, 11 * s, 4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([164, 146, 124], 2);
    [[-5, -4, 4, 3], [3, -4, 4.5, 3], [-1, -8, 4, 3], [6, -7, 3, 2.4], [-7, -7, 3, 2.2], [1, -11.5, 3, 2.4]].forEach(q => { ctx.beginPath(); ctx.ellipse(x + q[0] * s, y + q[1] * s, q[2] * s, q[3] * s, 0, 0, TAU); ctx.fill(); });
    if (p.glow > 0.01 && SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.gold, x, y - 8 * s, 26 * s, p.glow * 0.45); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }

  // 一挂葡萄、石榴、无花果（13:23）：抬回来之后放在地上
  function drawGrapes(ctx, x, y, s, a, hang) {
    ctx.globalAlpha = a;
    const c1 = css([96, 44, 104], 2, 1, 0.1), c2 = css([150, 80, 160], 2, 1, 0.2);
    const n = 26, L = hang ? 22 : 16, W2 = hang ? 8 : 11;
    for (let i = 0; i < n; i++) {
      const t = rt(i * 2 + 1100), side = rt(i * 2 + 1101) - 0.5;
      const gx = hang ? x + side * W2 * (1 - t * 0.7) * s : x + (t - 0.5) * L * s;
      const gy = hang ? y + t * L * s : y - (4 + side * 6 * (1 - Math.abs(t - 0.5) * 1.6)) * s;
      ctx.fillStyle = i % 3 ? c1 : c2;
      ctx.beginPath(); ctx.arc(gx, gy, 2.3 * s, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css([90, 124, 60], 2);
    ctx.beginPath(); ctx.ellipse(x + (hang ? 4 : -8) * s, y + (hang ? 1 : -6) * s, 5 * s, 3 * s, 0.4, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawFruit(ctx, p) {
    const s = LS(2) * vS(p.v) * 1.5, x = p.x * W.w, y = posY(2, p.x, p.v);
    drawGrapes(ctx, x, y, s, p.a, false);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([196, 52, 60], 2, 1, 0.1);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x + (12 + i * 5) * s, y - 2.8 * s, 2.8 * s, 0, TAU); ctx.fill(); }
    ctx.fillStyle = css([110, 90, 110], 2, 1, 0.05);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x - (14 + i * 4) * s, y - 2.2 * s, 2.2 * s, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  // 两个人用杠抬着（在两个探子之间）
  function drawCarried(ctx, p) {
    const a = fig(p.name ? p.name[0] : 'spyA'), b = fig(p.name ? p.name[1] : 'spyB');
    if (!a || !b || a.alpha < 0.05) return;
    const ax = a._x || a.nx * W.w, bx = b._x || b.nx * W.w;
    const ay = (a._y || posY(2, a.nx, a.v)) - (a._h || 40) * 0.78, by = (b._y || posY(2, b.nx, b.v)) - (b._h || 40) * 0.78;
    const s = LS(2) * vS(a.v || 0);
    ctx.globalAlpha = p.a * Math.min(a.alpha, b.alpha);
    ctx.strokeStyle = css([104, 78, 52], 2);
    ctx.lineWidth = Math.max(1.2, 2.4 * s);
    ctx.beginPath(); ctx.moveTo(ax - (bx - ax) * 0.12, ay - (by - ay) * 0.12); ctx.lineTo(bx + (bx - ax) * 0.12, by + (by - ay) * 0.12); ctx.stroke();
    if (p.kind === 'ark') {
      // 约柜，用蓝色毯子蒙着（4:6）
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      ctx.fillStyle = css([60, 84, 170], 2, 1, 0.1);
      ctx.beginPath(); ctx.moveTo(mx - 11 * s, my + 2 * s); ctx.lineTo(mx - 10 * s, my - 8 * s); ctx.quadraticCurveTo(mx, my - 12 * s, mx + 10 * s, my - 8 * s); ctx.lineTo(mx + 11 * s, my + 2 * s); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([226, 196, 110], 2, 0.8, 0.2);
      ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.stroke();
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.gold, mx, my - 4 * s, 26 * s, 0.25 * p.a); ctx.globalCompositeOperation = 'source-over'; }
    } else {
      const mx = (ax + bx) / 2, my = (ay + by) / 2;
      ctx.strokeStyle = css([90, 110, 56], 2);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx, my + 3 * s); ctx.stroke();
      drawGrapes(ctx, mx, my + 3 * s, s * 1.9, p.a * Math.min(a.alpha, b.alpha), true);
    }
    ctx.globalAlpha = 1;
  }

  // 耶利哥（中丘）：城墙、城楼、棕树（26:63 与耶利哥相对）
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = posY(l, p.x, p.v) + 2 * s;
    ctx.globalAlpha = p.a;
    const hw = 34 * s;
    // 棕树
    ctx.strokeStyle = css([80, 64, 46], l);
    ctx.lineWidth = Math.max(0.6, 1.2 * s);
    const palms = [-46, -40, 42, 50, 58];
    ctx.beginPath();
    palms.forEach((dx, i) => { const px = x + dx * s, h = (18 + 5 * rt(i + 1200)) * s; ctx.moveTo(px, y); ctx.quadraticCurveTo(px + 2 * s, y - h * 0.6, px + 1 * s, y - h); });
    ctx.stroke();
    ctx.strokeStyle = css([70, 110, 64], l);
    ctx.lineWidth = Math.max(0.6, 1.3 * s);
    ctx.beginPath();
    palms.forEach((dx, i) => {
      const px = x + dx * s + 1 * s, h = (18 + 5 * rt(i + 1200)) * s, py = y - h;
      for (let j = 0; j < 6; j++) { const a = -Math.PI + j / 5 * Math.PI; ctx.moveTo(px, py); ctx.quadraticCurveTo(px + Math.cos(a) * 5 * s, py + Math.sin(a) * 4 * s - 2 * s, px + Math.cos(a) * 9 * s, py + Math.sin(a) * 2 * s + 3 * s); }
    });
    ctx.stroke();
    // 城里的房屋
    ctx.fillStyle = css([176, 150, 116], l);
    for (let i = 0; i < 9; i++) { const hx = x + (rt(i + 1210) - 0.5) * hw * 1.6, hh = (10 + 10 * rt(i + 1220)) * s, ww = (5 + 4 * rt(i + 1230)) * s; ctx.fillRect(hx - ww, y - 12 * s - hh, ww * 2, hh); }
    // 城墙与城楼
    ctx.fillStyle = css([164, 136, 104], l);
    ctx.fillRect(x - hw, y - 14 * s, hw * 2, 14 * s);
    for (let i = 0; i < 5; i++) { const tx = x - hw + (hw * 2) * i / 4; ctx.fillRect(tx - 4 * s, y - 21 * s, 8 * s, 21 * s); }
    ctx.fillStyle = css([120, 98, 76], l);
    for (let i = 0; i < 18; i++) ctx.fillRect(x - hw + i * hw * 2 / 18, y - 15.5 * s, hw / 18, 1.5 * s);
    ctx.strokeStyle = css([240, 214, 170], l, 0.4 * dayA(), 0.25);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - hw, y - 14 * s); ctx.lineTo(x + hw, y - 14 * s); ctx.stroke();
    // 夜里城中的灯
    const nk = nightK();
    if (nk > 0.05 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) glowSp(ctx, SP.warm, x + (rt(i + 1240) - 0.5) * hw * 1.6, y - (12 + 8 * rt(i + 1250)) * s, 6 * s, nk * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 逃城（35:11–14）：远处的一座小城，城上一盏灯
  function drawRefuge(ctx, p) {
    const l = p.layer, s = LS(l) * (p.size || 1), x = p.x * W.w, y = posY(l, p.x, p.v) + 1 * s;
    ctx.globalAlpha = p.a * p.grow;
    ctx.fillStyle = css([170, 146, 116], l);
    ctx.fillRect(x - 10 * s, y - 8 * s, 20 * s, 8 * s);
    ctx.fillRect(x - 3 * s, y - 15 * s, 6 * s, 15 * s);
    if (p.lit > 0.01 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 5 + p.seed);
      glowSp(ctx, SP.gold, x, y - 17 * s, 30 * s, p.lit * fl * (0.4 + 0.4 * nightK()));
      glowSp(ctx, SP.core, x, y - 17 * s, 5 * s, p.lit * fl * 0.9);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 可拉的帐棚（16:26–27）
  function drawTentOne(ctx, p) {
    const k = p.grow;
    if (k < 0.02) return;
    const l = p.layer, s = LS(l) * vS(p.v) * p.size, x = p.x * W.w, y = posY(l, p.x, p.v) + 1.5 * s;
    const hw = 17 * s, h = 14 * s * k;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([50, 40, 36], l);
    ctx.beginPath();
    TENT.forEach((q, i) => (i ? ctx.lineTo(x + q[0] * hw, y + q[1] * h) : ctx.moveTo(x + q[0] * hw, y + q[1] * h)));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([20, 14, 12], l);
    ctx.fillRect(x - 0.16 * hw, y - 0.58 * h, 0.32 * hw, 0.58 * h);
    ctx.globalAlpha = 1;
  }
  // 香炉的烟（16:47）：站在活人死人中间
  function drawIncense(ctx, p) {
    const f = fig('aaron');
    if (!f || p.fire < 0.01) return;
    const s = LS(2) * vS(f.v || 0), x = (f._x || f.nx * W.w) + (f.facing || 1) * 8 * s, y = (f._y || posY(2, f.nx, f.v)) - (f._h || 44) * 0.62;
    smoke(ctx, x, y, p.fire, W.h * 0.3, 9 * s, 3, false, 0.07);
    if (SP) { ctx.globalCompositeOperation = 'lighter'; glowSp(ctx, SP.warm, x, y, 16 * s, p.fire * 0.6); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  远山：西奈（1–10 章）/ 何珥山（20 章）/ 毗珥山顶（23 章）
  // ════════════════════════════════════════════════════════════
  const FARM = {
    sinai: { x: 0.79, hw: 0.12, h: 0.27, seed: 19, rough: 0.16, plat: 0.03, rgb: [150, 104, 92], label: '西奈山' },
    hor: { x: 0.83, hw: 0.08, h: 0.17, seed: 23, rough: 0.06, plat: 0.16, rgb: [158, 122, 96], label: '何珥山' },
    peor: { x: 0.8, hw: 0.11, h: 0.14, seed: 29, rough: 0.07, plat: 0.3, rgb: [146, 120, 100], label: '毗珥山顶' },
  };
  const FARPTS = {};
  function farModel(name) {
    if (FARPTS[name]) return FARPTS[name];
    const m = FARM[name], r = U.mulberry32(m.seed * 101 + 7), N = 56, pts = [];
    for (let i = 0; i <= N; i++) {
      const u = -1 + 2 * i / N, a = Math.abs(u);
      let k;
      if (a <= m.plat) k = 1 - 0.03 * (a / Math.max(0.01, m.plat)) ** 2;
      else { const s = (a - m.plat) / (1 - m.plat); k = 0.97 * Math.pow(1 - smoothstep(0, 1, s), name === 'sinai' ? 1.5 : 1.15); }
      if (a > m.plat + 0.04 && a < 0.94) k += (r() - 0.5) * m.rough + (i % 4 === 1 ? m.rough * 0.3 : 0);
      pts.push([u, Math.max(0, k)]);
    }
    pts[0][1] = 0; pts[N][1] = 0;
    if (name === 'sinai') { pts[N >> 1][1] += 0.03; pts[(N >> 1) - 3][1] += 0.05; pts[(N >> 1) + 5][1] -= 0.04; }
    const strata = [];
    for (let i = 0; i < 12; i++) strata.push([-0.8 + r() * 1.6, 0.1 + r() * 0.7, 0.08 + r() * 0.16]);
    FARPTS[name] = { pts, strata };
    return FARPTS[name];
  }
  function farH(m) { return Math.min(m.h * W.h, m.hw * W.w * 2.3); }
  function farKAt(model, u) {
    const pts = model.pts, N = pts.length - 1, f = (u + 1) / 2 * N, i = clamp(Math.floor(f), 0, N - 1), t = f - i;
    return lerp(pts[i][1], pts[i + 1][1], t);
  }
  // 远山面在 xf 处的高度（像素 y）
  function farY(xf) {
    const m = FARM[S.far];
    if (!m) return gY(0, xf);
    const u = (xf - m.x) / m.hw, g = W.ridgeBaseY(0, xf * W.w);
    if (u <= -1 || u >= 1) return g;
    return Math.min(g, g - farKAt(farModel(S.far), u) * farH(m) * clamp(W.lv.nmFar, 0, 1));
  }
  function drawFarMount(ctx) {
    const k = W.lv.nmFar, m = FARM[S.far];
    if (k < 0.01 || !m) return;
    const model = farModel(S.far), H = farH(m), dep = 0.62;
    const x0 = (m.x - m.hw) * W.w, x1 = (m.x + m.hw) * W.w, bot = W.waterlineY(0) - 1;
    ctx.globalAlpha = Math.min(1, k * 1.6);
    const kq = Math.round(k * 60) / 60;
    const body = cachedPath('far:' + S.far + ':' + kq, B => {
      model.pts.forEach((q, i) => { const x = lerp(x0, x1, (q[0] + 1) / 2), g = W.ridgeBaseY(0, x), y = g - q[1] * H * kq; if (i) B.lineTo(x, y); else B.moveTo(x, y); });
      for (let i = 12; i >= 0; i--) { const x = lerp(x0, x1, i / 12); B.lineTo(x, Math.min(bot, W.ridgeBaseY(0, x) + 4)); }
      B.closePath();
    });
    ctx.fillStyle = W.shadeCSS(m.rgb, dep);
    ctx.fill(body);
    // 背光一面
    const d = litX() >= m.x * W.w ? 1 : -1;
    ctx.save();
    ctx.clip(body);
    const gx = m.x * W.w;
    const sh = ctx.createLinearGradient(gx - d * m.hw * W.w, 0, gx + d * m.hw * W.w * 0.3, 0);
    sh.addColorStop(0, W.shadeCSS([60, 44, 50], dep, 0.55)); sh.addColorStop(1, W.shadeCSS([60, 44, 50], dep, 0));
    ctx.fillStyle = sh;
    ctx.fillRect(x0, 0, x1 - x0, bot);
    // 岩层
    ctx.strokeStyle = W.shadeCSS([90, 64, 60], dep, 0.35);
    ctx.lineWidth = Math.max(0.5, 0.8 * LS(0));
    ctx.beginPath();
    for (const q of model.strata) {
      const u = q[0], x = gx + u * m.hw * W.w, g = W.ridgeBaseY(0, x), y = g - farKAt(model, u) * H * k * (1 - q[1]);
      ctx.moveTo(x - q[2] * m.hw * W.w, y + 2); ctx.lineTo(x + q[2] * m.hw * W.w, y - 1);
    }
    ctx.stroke();
    ctx.restore();
    // 迎光的山脊
    ctx.strokeStyle = W.shadeCSS([255, 226, 190], dep, 0.45 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.6, 1.1 * LS(0));
    ctx.beginPath();
    let started = false;
    model.pts.forEach(q => {
      if (q[0] * d < -0.1) { started = false; return; }
      const x = lerp(x0, x1, (q[0] + 1) / 2), y = W.ridgeBaseY(0, x) - q[1] * H * k;
      if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
    });
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 毗珥山顶的七座坛与坛上的烟（23:1–2，14，29–30）
  function drawAltars(ctx) {
    const k = W.lv.nmAltars;
    if (k < 0.01 || S.far !== 'peor' || !SP) return;
    const m = FARM.peor, s = LS(0) * 1.3;
    for (let i = 0; i < 7; i++) {
      const xf = m.x + (i - 3) * m.hw * 0.085, x = xf * W.w, y = farY(xf);
      ctx.globalAlpha = k;
      ctx.fillStyle = W.shadeCSS([130, 116, 100], 0.5);
      ctx.fillRect(x - 3 * s, y - 4 * s, 6 * s, 4 * s);
      smoke(ctx, x, y - 5 * s, k * 0.8, W.h * 0.12, 4 * s, i * 1.7, false, 0.06);
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.8 + 0.2 * Math.sin(W.t * 8 + i * 2);
      glowSp(ctx, SP.warm, x, y - 5 * s, 9 * s, k * fl * (0.4 + 0.5 * nightK()));
      glowSp(ctx, SP.core, x, y - 5 * s, 2.5 * s, k * fl);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  摩押平原：约旦河、河那边的迦南
  // ════════════════════════════════════════════════════════════
  function jordanPt(t) {
    const x0 = (X.jordan + 0.012) * W.w, y0 = gY(2, X.jordan + 0.012) + 1, x3 = (X.jordan - 0.022) * W.w, y3 = W.h + 8;
    const x1 = (X.jordan + 0.022) * W.w, y1 = lerp(y0, y3, 0.35), x2 = (X.jordan - 0.03) * W.w, y2 = lerp(y0, y3, 0.7), u = 1 - t;
    const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2), L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const jordanW = t => (0.004 + 0.042 * Math.pow(t, 1.3)) * W.w;
  function drawJordan(ctx) {
    const k = W.lv.nmJordan;
    if (k < 0.01) return;
    const N = 24, s = LS(2);
    const edge = (mul, add) => cachedPath('jordan:' + mul + ':' + add.toFixed(2), P2 => {
      const Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) { const t = i / N, p = jordanPt(t), w = jordanW(t) * mul / 2 + add * (0.3 + t); Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
      for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
      P2.closePath();
    });
    ctx.globalAlpha = Math.min(1, k * 1.3);
    // 河边的绿（约旦河的丛林）
    ctx.fillStyle = css([86, 118, 64], 2, 0.55);
    ctx.fill(edge(2.2, 7 * s));
    ctx.fillStyle = css([118, 100, 70], 2);
    ctx.fill(edge(1.3, 2.5 * s));
    const top = W.shade([160, 196, 214], 0.45, 0.05), bot = W.shade([54, 104, 130], 0, 0.02);
    const y0 = gY(2, X.jordan), gr = ctx.createLinearGradient(0, y0, 0, W.h);
    gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
    ctx.fillStyle = gr;
    ctx.fill(edge(1, 0));
    // 天光（夕照 / 月光）的倒影
    const night = W.night > 0.5, gc = night ? [200, 214, 255] : W.dusk > 0.3 ? [255, 206, 150] : [255, 246, 222];
    const ga = (night ? 0.35 * W.lv.moon : 0.5 * W.daylight + 0.3 * W.dusk) * k + W.lv.nmBorder * 0.3;
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      ctx.beginPath();
      for (let i = 0; i < 22; i++) {
        const t = U.fract(rt(i * 5 + 1500) + W.t * 0.02 * (0.7 + 0.6 * rt(i * 5 + 1501)));
        if (t < 0.03) continue;
        const p = jordanPt(t), w = jordanW(t) / 2, off = (rt(i * 5 + 1502) * 2 - 1) * 0.6 * w, len = w * (0.25 + 0.3 * rt(i * 5 + 1503));
        ctx.moveTo(p[0] + p[2] * off - len, p[1] + p[3] * off); ctx.lineTo(p[0] + p[2] * off + len, p[1] + p[3] * off);
      }
      ctx.globalAlpha = Math.min(1, ga) * (0.7 + 0.3 * Math.sin(W.t * 0.8));
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 旷野的沙色（近地与中丘）
  function drawSand(ctx, l) {
    const k = W.lv.nmSand;
    if (k < 0.01) return;
    const c = W.shade(l === 2 ? [204, 176, 132] : [198, 176, 140], DEP(l), 0.04);
    ctx.fillStyle = U.rgba(c[0], c[1], c[2], (l === 2 ? 0.42 : 0.36) * k);
    ctx.fill(landPath(l, 0.25, 1.0, l === 2 ? 50 : 40));
  }
  // 河那边的迦南：绿的地（近地河右、中丘与远山的右边）
  function drawCanaan(ctx, l) {
    const k = W.lv.nmCanaan;
    if (k < 0.01) return;
    const xb = l === 2 ? X.jordan + 0.01 : l === 1 ? 0.8 : 0.74;
    const c = W.shade(l === 0 ? [110, 138, 104] : [92, 130, 70], DEP(l), 0.04);
    const col = a => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    g.addColorStop(clamp(xb - 0.02, 0, 1), col(0)); g.addColorStop(clamp(xb + 0.03, 0, 1), col(0.55 * k)); g.addColorStop(1, col(0.62 * k));
    ctx.fillStyle = g;
    ctx.fill(landPath(l, clamp(xb - 0.03, 0, 1), 1.0, l === 2 ? 30 : 36));
  }

  // ── 四十二站的路程（33 章）：从海那边（兰塞、红海）一路亮到营中 ────
  function pathPts() {
    return cachedData('path42', () => {
      const out = [];
      const key = [[0.06, 'sea', 0.004], [0.2, 'sea', 0.012], [0.33, 'sea', 0.02], [0.4, 0, 0], [0.5, 0, 0], [0.58, 1, 0.3], [0.52, 1, 0.55], [0.47, 2, 0.5], [0.5, 2, 0.85], [0.56, 2, 0.5]];
      const at = q => {
        if (q[1] === 'sea') return [q[0] * W.w, W.horizonY + q[2] * W.h];
        return [q[0] * W.w, posY(q[1], q[0], q[2]) - 2];
      };
      const K = key.map(at);
      for (let i = 0; i < 42; i++) {
        const f = i / 41 * (K.length - 1), j = Math.min(K.length - 2, Math.floor(f)), t = f - j;
        const a = K[j], b = K[j + 1];
        out.push([lerp(a[0], b[0], t) + (rt(i + 1600) - 0.5) * 6, lerp(a[1], b[1], t) + (rt(i + 1650) - 0.5) * 3, key[Math.round(f)][1] === 'sea' ? 0 : key[Math.round(f)][1]]);
      }
      return out;
    });
  }
  function drawPath(ctx) {
    const k = W.lv.nmPath;
    if (k < 0.005 || !SP) return;
    const pts = pathPts(), n = pts.length, u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,220,160,0.18)';
    ctx.lineWidth = Math.max(0.6, 1 * u);
    ctx.beginPath();
    const lastLit = k * n;
    for (let i = 0; i < n && i < lastLit; i++) { const q = pts[i]; if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }
    ctx.stroke();
    for (let i = 0; i < n; i++) {
      const on = clamp(lastLit - i, 0, 1);
      if (on <= 0) break;
      const q = pts[i], fl = 0.8 + 0.2 * Math.sin(W.t * 3 + i * 1.7), sz = (q[2] === 2 ? 1.2 : q[2] === 1 ? 0.8 : 0.55);
      glowSp(ctx, SP.gold, q[0], q[1] - 2 * u, 9 * u * sz, on * fl * 0.55);
      glowSp(ctx, SP.core, q[0], q[1] - 2 * u, 2.2 * u * sz, on * fl);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 迦南的四境（34:1–12）：金线沿着约旦河，又沿着远山
  function borderSegs() {
    return cachedData('border', () => {
      const A = [], B = [];
      for (let i = 0; i <= 20; i++) { const t = 1 - i / 20, p = jordanPt(t), w = jordanW(t) * 0.6; A.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      for (let i = 0; i <= 22; i++) { const xf = lerp(0.8, 1.0, i / 22); B.push([xf * W.w, W.ridgeBaseY(0, xf * W.w) - 2]); }
      return [A, B];
    });
  }
  function drawBorder(ctx) {
    const k = W.lv.nmBorder;
    if (k < 0.005 || !SP) return;
    const segs = borderSegs(), total = segs.reduce((n, sg) => n + sg.length - 1, 0);
    let lit = k * total;
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(255, 222, 150, 0.55 * Math.min(1, k * 2));
    ctx.lineWidth = Math.max(0.8, 1.6 * SU());
    let head = null;
    for (const pts of segs) {
      if (lit <= 0) break;
      const n = pts.length - 1, upto = Math.min(n, lit);
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= Math.ceil(upto); i++) {
        const f = clamp(upto - (i - 1), 0, 1), pq = pts[i - 1], q = pts[i];
        ctx.lineTo(lerp(pq[0], q[0], f), lerp(pq[1], q[1], f));
        if (f < 1) head = [lerp(pq[0], q[0], f), lerp(pq[1], q[1], f)];
      }
      ctx.stroke();
      if (upto < n) head = head || pts[Math.floor(upto)];
      lit -= n;
    }
    if (k < 1 && head) glowSp(ctx, SP.gold, head[0], head[1], 18 * SU(), 0.7);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 天上：有星要出于雅各（24:17）──────────────────────────
  function starPos() { return port() ? [0.42 * W.w, W.h * 0.34] : [0.555 * W.w, W.h * 0.15]; }
  function drawStar(ctx) {
    const k = W.lv.nmStar;
    if (k < 0.005 || !SP) return;
    const g = pillarGeom(getP('pillar') || { x: X.tab, lift: 0 });
    const [sx, sy] = starPos();
    // 自营中升起：沿着云柱升到天上
    const t = smoothstep(0, 1, k);
    const x = lerp(X.tab * W.w, sx, t), y = lerp(g.base - 10, sy, t);
    const vis = 0.12 + 0.88 * clamp(W.night * 1.4 + W.dusk * 0.5, 0, 1);
    const tw = 0.85 + 0.15 * Math.sin(W.t * 2.3) * Math.sin(W.t * 3.7);
    const R = (6 + 5 * t) * SU();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.white, x, y, R * 9, 0.35 * vis * tw);
    glowSp(ctx, SP.gold, x, y, R * 3.2, 0.7 * vis * tw);
    glowSp(ctx, SP.core, x, y, R * 1.1, vis);
    ctx.fillStyle = 'rgb(255,248,226)';
    for (const [ax, ay, L] of [[1, 0, 14], [0, 1, 18], [0.7, 0.7, 5], [0.7, -0.7, 5]]) {
      const l = L * R * 0.55 * tw;
      ctx.globalAlpha = 0.55 * vis;
      ctx.beginPath();
      ctx.moveTo(x - ax * l, y - ay * l); ctx.lineTo(x - ay * R * 0.12, y + ax * R * 0.12); ctx.lineTo(x + ax * l, y + ay * l); ctx.lineTo(x + ay * R * 0.12, y - ax * R * 0.12);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 火蛇（21:6）：在地上游走，发着火的红光 ─────────────────────
  function drawSnakes(ctx) {
    const k = W.lv.nmSnakes;
    if (k < 0.01) return;
    const s0 = LS(2);
    const body = new Path2D(), glows = [];
    for (let i = 0; i < 16; i++) {
      const v = lerp(0.1, 0.95, rt(i * 5 + 1800)), sp = (0.006 + 0.008 * rt(i * 5 + 1801)) * (i % 2 ? 1 : -1);
      const x0 = 0.42, x1 = 0.86, span = x1 - x0;
      const hx = x0 + U.fract(rt(i * 5 + 1802) + W.t * sp / span) * span;
      const s = s0 * vS(v) * 0.9, dir = sp > 0 ? 1 : -1;
      if (rt(i * 5 + 1803) > k * 1.2) continue;
      for (let j = 0; j <= 10; j++) {
        const xf = hx - dir * j * 0.0035 * (s / s0), wig = Math.sin(W.t * 6 + j * 0.9 + i) * 2.2 * s * (j / 10 + 0.3);
        const x = xf * W.w, y = posY(2, xf, v) - 1.2 * s + wig * 0.4;
        if (j) body.lineTo(x, y + wig * 0.2); else body.moveTo(x, y);
        if (j === 0) glows.push([x, y, s]);
      }
    }
    ctx.globalAlpha = k;
    ctx.strokeStyle = W.shadeCSS([196, 60, 30], 0, 1, 0.3);
    ctx.lineWidth = Math.max(1, 2 * s0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.stroke(body);
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,140,60,0.55)';
      ctx.lineWidth = Math.max(0.6, 0.8 * s0);
      ctx.stroke(body);
      for (const q of glows) glowSp(ctx, SP.ember, q[0], q[1], 9 * q[2], k * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 祝福之光（6:24–26）：笼罩全营的穹光 ─────────────────────
  function drawBless(ctx) {
    const k = W.lv.nmBless;
    if (k < 0.01 || !SP) return;
    const cx = X.tab * W.w, cy = posY(2, X.tab, 0.45), R = W.w * (port() ? 0.36 : 0.3) * (0.97 + 0.03 * Math.sin(W.t * 0.5)), Ry = Math.min(R * 0.7, cy - W.h * 0.35);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
    g.addColorStop(0, U.rgba(255, 226, 160, 0.16 * k)); g.addColorStop(0.7, U.rgba(255, 214, 140, 0.1 * k)); g.addColorStop(0.93, U.rgba(255, 236, 190, 0.22 * k)); g.addColorStop(1, 'rgba(255,236,190,0)');
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(1, Ry / R);
    ctx.beginPath(); ctx.arc(0, 0, R, Math.PI, TAU); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = U.rgba(255, 234, 186, 0.3 * k);
    ctx.lineWidth = Math.max(1, 2 * SU()) * R / Ry;
    ctx.beginPath(); ctx.arc(0, 0, R * 0.985, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
    ctx.restore();
    // 金色的微光自穹顶缓缓落下
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 40; i++) {
      const a = Math.PI + (0.06 + 0.88 * rt(i * 3 + 2300)) * Math.PI, ph = U.fract(rt(i * 3 + 2301) + W.t * 0.06);
      const x = cx + Math.cos(a) * R * 0.95, y0 = cy + Math.sin(a) * Ry * 0.95, y = lerp(y0, cy, ph);
      ctx.globalAlpha = k * (1 - ph) * 0.7;
      const sz = 1.6 * SU();
      ctx.fillRect(x, y, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 帐棚何等华美（24:5–6）：营上一层金色的光，如河旁的园子
  function drawFair(ctx) {
    const k = W.lv.nmFair + W.lv.nmDwell * 0.6;
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const y = posY(2, X.tab, 0.25), x = X.tab * W.w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, W.w * 0.32);
    g.addColorStop(0, U.rgba(255, 214, 140, 0.18 * k)); g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - W.w * 0.34, y - W.w * 0.2, W.w * 0.68, W.w * 0.3);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光：天降之光、荣光、号声、地开口、瘟疫、鹌鹑、光芒……
  // ════════════════════════════════════════════════════════════
  function drawFX(ctx, pass) {
    if (!FXL.length || !SP) return;
    for (const e of FXL) {
      const t = e.t, u = t / e.dur, env = smoothstep(0, 0.15, u) * (1 - smoothstep(0.6, 1, u));
      if (pass === 'air') {
        if (e.type === 'beam') {
          const x = e.xf * W.w, y = posY(2, e.xf, e.v), top = -10;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = env * 0.5 * e.k;
          ctx.drawImage(SP.beam, x - e.w / 2, top, e.w, y - top);
          glowSp(ctx, SP.gold, x, y - 20 * SU(), e.w * 1.2, env * 0.35 * e.k);
          ctx.globalCompositeOperation = 'source-over';
        } else if (e.type === 'glory') {
          const p = getP('pillar'), xf = e.xf != null ? e.xf : (p ? p.x : X.tab);
          const x = xf * W.w, y = posY(2, xf, TABV) - 30 * LS(2);
          ctx.globalCompositeOperation = 'lighter';
          const soft = e.soft ? 0.5 : 1;
          glowSp(ctx, SP.gold, x, y, M() * (0.25 + 0.2 * u) * (e.big || 1), env * 0.7 * soft);
          glowSp(ctx, SP.core, x, y, M() * 0.07, env * 0.8 * soft);
          ctx.fillStyle = 'rgb(255,236,190)';
          for (let i = 0; i < 16; i++) {
            const a = i / 16 * TAU + t * 0.08, L = M() * (0.35 + 0.15 * Math.sin(i * 1.9)) * (0.6 + u);
            ctx.globalAlpha = env * 0.1 * soft * soft;
            ctx.beginPath(); ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a - 0.025) * L, y + Math.sin(a - 0.025) * L); ctx.lineTo(x + Math.cos(a + 0.025) * L, y + Math.sin(a + 0.025) * L);
            ctx.closePath(); ctx.fill();
          }
          ctx.globalCompositeOperation = 'source-over';
        } else if (e.type === 'rays') {
          // 愿耶和华使他的脸光照你：自云柱斜照全营
          const p = getP('pillar'), g = pillarGeom(p || { x: X.tab, lift: 0 }), x = (p ? p.x : X.tab) * W.w, y = lerp(g.base, g.top, 0.5);
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = 'rgb(255,232,176)';
          for (let i = 0; i < 9; i++) {
            const tx = lerp(0.4, 0.98, i / 8) * W.w, ty = W.h;
            const a0 = Math.atan2(ty - y, tx - x), L = Math.hypot(tx - x, ty - y);
            ctx.globalAlpha = env * 0.12 * (0.7 + 0.3 * Math.sin(t * 1.2 + i));
            ctx.beginPath(); ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a0 - 0.035) * L, y + Math.sin(a0 - 0.035) * L); ctx.lineTo(x + Math.cos(a0 + 0.035) * L, y + Math.sin(a0 + 0.035) * L);
            ctx.closePath(); ctx.fill();
          }
          glowSp(ctx, SP.gold, x, y, M() * 0.2, env * 0.4);
          ctx.globalCompositeOperation = 'source-over';
        } else if (e.type === 'trump') {
          // 银号的声音：一圈一圈传遍全营
          const x = e.xf * W.w, y = posY(2, e.xf, e.v || 0) - 34 * LS(2);
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgb(226,236,255)';
          for (let j = 0; j < 4; j++) {
            const ph = U.fract(u * 2.2 - j * 0.22);
            if (u * 2.2 - j * 0.22 < 0) continue;
            ctx.globalAlpha = env * (1 - ph) * 0.5;
            ctx.lineWidth = Math.max(0.8, 1.6 * SU() * (1 - ph));
            ctx.beginPath(); ctx.ellipse(x, y, ph * M() * 0.45, ph * M() * 0.2, 0, 0, TAU); ctx.stroke();
          }
          glowSp(ctx, SP.white, x, y, 18 * SU(), env * 0.8);
          ctx.globalCompositeOperation = 'source-over';
        } else if (e.type === 'plague') {
          // 瘟疫：一片暗影自东（左）漫过来，到亚伦站的地方止住
          const xa = 0.36 * W.w, xb = e.xf * W.w, reach = lerp(xa, xb, smoothstep(0, 0.45, u));
          const gy = posY(2, 0.47, 0.4);
          for (let i = 0; i < 7; i++) {
            const f = (i + 0.5) / 7, cx = lerp(xa, reach, f), R = (reach - xa) / 7 * 1.6 + 30 * SU();
            ctx.globalAlpha = env * 0.55;
            ctx.drawImage(SP.dark, cx - R, gy - R * 0.9, R * 2, R * 1.5);
          }
        } else if (e.type === 'rift') {
          // 地开了口（16:31–33）
          const x = e.xf * W.w, y = posY(2, e.xf, 0.22), s = LS(2);
          const open = Math.sin(Math.PI * clamp(u * 1.1, 0, 1));
          if (open > 0.01) {
            const wdt = 70 * s, dep = 9 * s * open;
            ctx.fillStyle = U.rgba(6, 4, 6, 0.95);
            ctx.beginPath();
            for (let i = 0; i <= 12; i++) { const f = i / 12, xx = x - wdt + 2 * wdt * f, yy = y + Math.sin(f * 19) * 1.5 * s - dep * Math.sin(f * Math.PI) * (0.6 + 0.4 * rt(i + 1900)); if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
            for (let i = 12; i >= 0; i--) { const f = i / 12, xx = x - wdt + 2 * wdt * f, yy = y + Math.sin(f * 17) * 1.5 * s + dep * Math.sin(f * Math.PI) * (0.6 + 0.4 * rt(i + 1920)); ctx.lineTo(xx, yy); }
            ctx.closePath(); ctx.fill();
            ctx.globalCompositeOperation = 'lighter';
            glowSp(ctx, SP.ember, x, y, wdt * 0.9, open * 0.45);
            ctx.globalCompositeOperation = 'source-over';
          }
        } else if (e.type === 'quail') {
          // 鹌鹑由海面刮来（11:31）
          const n = 150, u2 = SU();
          ctx.fillStyle = W.shadeCSS([96, 76, 56], 0.2);
          ctx.globalAlpha = 1;
          for (let i = 0; i < n; i++) {
            const st = rt(i * 3 + 2000) * 0.55, pr = clamp((u - st) / 0.42, 0, 1);
            if (pr <= 0 || pr >= 1) continue;
            const sy = lerp(0.3, 0.62, rt(i * 3 + 2001)) * W.h, sx = -0.05 * W.w;
            const tx = lerp(0.42, 0.98, rt(i * 3 + 2002)) * W.w, ty = posY(2, tx / W.w, rt(i * 3 + 2001) * 1.1) - 4;
            const ee = pr * pr * (3 - 2 * pr);
            const x = lerp(sx, tx, ee), y = lerp(sy, ty, ee) - Math.sin(pr * Math.PI) * W.h * 0.08;
            const fl = Math.sin(t * 22 + i) * 2.4 * u2, s = (1.3 + rt(i) * 0.6) * u2;
            ctx.beginPath();
            ctx.moveTo(x - 3 * s, y - fl); ctx.lineTo(x, y + 0.6 * s); ctx.lineTo(x + 3 * s, y - fl); ctx.lineTo(x, y - 0.6 * s); ctx.closePath();
            ctx.fill();
          }
        } else if (e.type === 'rise') {
          // 星自营中升起时的光迹
          const p = getP('pillar'), g = pillarGeom(p || { x: X.tab, lift: 0 }), [sx, sy] = starPos();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = 'rgb(255,240,200)';
          ctx.lineWidth = Math.max(1, 2 * SU());
          ctx.globalAlpha = env * 0.4;
          ctx.beginPath(); ctx.moveTo(X.tab * W.w, g.base); ctx.quadraticCurveTo(X.tab * W.w, lerp(g.base, sy, 0.6), sx, sy); ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
        } else if (e.type === 'look') {
          // 一望就活了：从铜蛇到每一个仰望的人，一线金光
          const p = getP('serpent');
          if (p) {
            const s = LS(2) * vS(p.v) * 1.35, sx = p.x * W.w, sy = posY(2, p.x, p.v) - serpH(p) + 10 * s;
            const f = fig(e.id);
            if (f && f._x) {
              ctx.globalCompositeOperation = 'lighter';
              ctx.strokeStyle = 'rgb(255,220,150)';
              ctx.lineWidth = Math.max(0.6, 1.2 * SU());
              ctx.globalAlpha = env * 0.35;
              ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(f._x, f._y - f._h * 0.85); ctx.stroke();
              glowSp(ctx, SP.gold, f._x, f._y - f._h * 0.5, f._h * 0.8, env * 0.45);
              ctx.globalCompositeOperation = 'source-over';
            }
          }
        } else if (e.type === 'lay') {
          // 按手：从摩西的手到约书亚
          const a = fig('moses'), b = fig('joshua');
          if (a && b && a._x && b._x) {
            ctx.globalCompositeOperation = 'lighter';
            glowSp(ctx, SP.gold, b._x, b._y - b._h * 0.8, b._h * 1.2, env * 0.6);
            glowSp(ctx, SP.core, b._x, b._y - b._h * 0.95, b._h * 0.3, env * 0.6);
            ctx.globalCompositeOperation = 'source-over';
          }
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'tab': drawTab(ctx, p); break;
      case 'pillar': drawPillar(ctx, p); break;
      case 'banner': drawBanner(ctx, p); break;
      case 'rods': drawRods(ctx, p); break;
      case 'rock': drawRock(ctx, p); break;
      case 'serpent': drawSerpent(ctx, p); break;
      case 'well': drawWell(ctx, p); break;
      case 'walls': drawWalls(ctx, p); break;
      case 'cairn': drawCairn(ctx, p); break;
      case 'fruit': drawFruit(ctx, p); break;
      case 'city': drawCity(ctx, p); break;
      case 'refuge': drawRefuge(ctx, p); break;
      case 'tent1': drawTentOne(ctx, p); break;
    }
  }
  // 近地的东西按纵深排：远的先画（云柱在会幕之后）
  function nearList() {
    const out = [];
    for (const p of P.values()) {
      if (p.layer !== 2 || p.a < 0.005 || p.kind === 'carry' || p.kind === 'ark' || p.kind === 'incense' || p.kind === 'loose' || p.kind === 'lev') continue;
      const v = p.kind === 'pillar' ? TABV - 0.001 : p.kind === 'tab' ? TABV : p.kind === 'walls' ? -0.5 : (p.v || 0);
      out.push([v, p]);
    }
    out.sort((a, b) => a[0] - b[0] || a[1].x - b[1].x);
    return out;
  }

  const SCENE = {
    init() { sprites(); },
    resize() { geoKey = ''; },
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
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else p.x += Math.sign(d) * v;
        }
        if (p.dying && p.a < 0.01) P.delete(id);
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStar(ctx); return; }
      if (pass === 'seaFar') { drawFarMount(ctx); drawPath(ctx); return; }
      if (pass === 'far') { drawCanaan(ctx, 0); drawAltars(ctx); for (const p of P.values()) if (p.layer === 0 && p.a > 0.005) drawKind(ctx, p); return; }
      if (pass === 'mid') {
        drawSand(ctx, 1);
        drawCanaan(ctx, 1);
        drawGraves(ctx, 1);
        drawTents(ctx, 1, -1, 9);
        for (const p of P.values()) if (p.layer === 1 && p.a > 0.005) drawKind(ctx, p);
        return;
      }
      if (pass === 'near') {
        drawSand(ctx, 2);
        drawCanaan(ctx, 2);
        drawJordan(ctx);
        drawManna(ctx);
        drawGraves(ctx, 2);
        drawBless(ctx);
        // 近地：帐棚与物件按纵深交错
        const list = nearList();
        const cuts = [-1, TABV - 0.002, 0.45, 0.78, 9];
        let ci = 0;
        for (const [v, p] of list) {
          while (ci < cuts.length - 1 && v >= cuts[ci + 1]) { drawTents(ctx, 2, cuts[ci], cuts[ci + 1]); ci++; }
          drawKind(ctx, p);
        }
        while (ci < cuts.length - 1) { drawTents(ctx, 2, cuts[ci], cuts[ci + 1]); ci++; }
        drawQuailGround(ctx);
        drawSnakes(ctx);
        drawFair(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'near') {
        for (const p of P.values()) {
          if (p.a < 0.005) continue;
          if (p.kind === 'carry' || p.kind === 'ark') drawCarried(ctx, p);
          else if (p.kind === 'incense') drawIncense(ctx, p);
        }
      }
      if (pass === 'air') { drawBorder(ctx); drawFX(ctx, 'air'); }
    },
    reset() { P.clear(); FXL.length = 0; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      FXL.length = 0;
    },
    // 本卷布景的状态（走查时核对"看完"与"恢复"是否一致）
    sig() {
      const out = {};
      for (const p of P.values()) {
        if (p.dying) continue;
        out[p.id] = [p.kind, +(p.tx != null ? p.tx : p.x).toFixed(2), +p.ta.toFixed(1), +p.tgrow.toFixed(1), +p.tlit.toFixed(1), +p.tfire.toFixed(1), +p.tlift.toFixed(1), +p.tbud.toFixed(1), +p.twater.toFixed(1), p.n == null ? '' : p.n].join('|');
      }
      return { props: out, far: S.far, gen: S.gen };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const test = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const l = p.layer, s = LS(l) * vS(p.v);
        if (p.kind === 'pillar') { const g = pillarGeom(p); test(p.label, p.x * W.w, lerp(g.base, g.top, 0.3)); continue; }
        if (p.kind === 'serpent') { test(p.label, p.x * W.w, posY(2, p.x, p.v) - serpH(p) * p.grow); continue; }
        if (p.kind === 'banner' && p.grow * (1 - W.lv.nmStrike) < 0.4) continue;
        const hgt = { tab: 40, banner: 56, rods: 26, rock: 36, well: 6, cairn: 8, fruit: 6, city: 18, refuge: 14, walls: 10, tent1: 12 }[p.kind] || 10;
        test(p.label, p.x * W.w, posY(l, p.x, p.v) - hgt * s);
      }
      if (W.lv.nmFar > 0.5 && FARM[S.far]) { const m = FARM[S.far]; test(m.label, m.x * W.w, farY(m.x)); }
      if (W.lv.nmStar > 0.8) { const [sx, sy] = starPos(); test('星', sx, sy); }
      if (W.lv.nmJordan > 0.5) { const q = jordanPt(0.55); test('约旦河', q[0], q[1]); }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0;
    S = fresh();
    geoKey = '';
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：西奈的旷野，第二年二月初一日（1:1）
  // ════════════════════════════════════════════════════════════
  function setup() {
    W.set('bare', 0.8, true); W.set('bloom', 0.05, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.3, land: 1, grass: 0.4, herbs: 0.3, trees: 0.12, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      nmFar: 1, nmSand: 1, nmStrike: 0, nmManna: 0, nmQuail: 0, nmBless: 0, nmGraves: 0, nmSnakes: 0, nmAltars: 0, nmFair: 0, nmStar: 0, nmJordan: 0, nmCanaan: 0, nmPath: 0, nmBorder: 0, nmDwell: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    // 旷野：树木只在极右（远处的绿洲；最后是河那边的迦南）
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.set('trees', 0.12, true);
    W.goTo(0.28, 0, true);
    const lx = W.w * 0.9, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 16, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    S.far = 'sinai';
    prop('tab', 'tab', { x: X.tab, v: TABV, label: '会幕', fire: 0.6 });
    prop('pillar', 'pillar', { x: X.tab, label: '云柱' });
    prop('loose', 'loose', {});
    prop('lev', 'lev', { grow: 0 });
    TRIBES.forEach((tr, i) => prop('bn' + i, 'banner', { x: tr.x, layer: tr.l, v: tr.l === 1 ? 0.18 : tr.v, tribe: i, grow: 0, label: tr.cn + '的纛' }));
    const c = C();
    c.clear({ fade: false });
    add('moses', { label: '摩西', sex: 'm', age: 'elder', x: 0.6, v: 0.34, facing: -1, robe: ROBE.moses, glow: 0.45, prop: 'staff', from: 'none' });
    add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: 0.62, v: 0.3, facing: -1, robe: ROBE.aaron, accent: PRIEST_ACC, glow: 0.3, prop: null, from: 'none' });
    add('eleazar', { label: '以利亚撒', sex: 'm', age: 'adult', x: 0.64, v: 0.36, facing: -1, robe: ROBE.eleazar, glow: 0.15, from: 'none' });
    add('miriam', { label: '米利暗', sex: 'f', age: 'elder', x: 0.53, v: 0.42, facing: 1, robe: ROBE.miriam, glow: 0.2, prop: null, from: 'none' });
    add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: 0.58, v: 0.4, facing: -1, robe: ROBE.joshua, glow: 0.2, from: 'none' });
    FOLK.forEach(f => folkAdd(f, { from: 'none' }));
    crowd('mid', { n: 7, x0: 0.58, x1: 0.76, layer: 1, label: '以色列人', from: 'none' });
    herd('flock', { kind: 'sheep', n: 6, x0: 0.86, x1: 0.97, layer: 2, label: '羊群', from: 'none' });
    herd('kine', { kind: 'cow', n: 2, x0: 0.9, x1: 0.98, layer: 2, label: '牛', from: 'none' });
    avoid([0.4, 1]);
  }

  // ── 情节里常用的几步 ────────────────────────────────────────
  // 在东边，向日出之地（3:38）：摩西、亚伦、亚伦的儿子
  function eastFront(o) {
    const sp = (o && o.speed) || 0.03;
    walk('moses', X.moses, { speed: sp, pose: 'stand' }); walk('aaron', X.aaron, { speed: sp, pose: 'stand' });
    walk('eleazar', X.eleazar, { speed: sp }); walk('miriam', X.miriam, { speed: sp }); walk('joshua', X.joshua, { speed: sp });
    ['moses', 'aaron', 'eleazar', 'miriam', 'joshua'].forEach(id => face(id, -1));
  }
  // 十二面纛（一面一面升起）
  function bannersUp(b, t0, dt) {
    const beats = [];
    TRIBES.forEach((tr, i) => beats.push([t0 + i * dt, bb => {
      prop('bn' + i, null, { grow: 1, show: true });
      if (!bb.instant) {
        const s = LS(tr.l) * vS(tr.l === 1 ? 0.18 : tr.v), x = tr.x * W.w, y = posY(tr.l, tr.x, tr.l === 1 ? 0.18 : tr.v) - 58 * s;
        fx().sparkle(x, y, 14, [255, 236, 190], 10, tr.l === 1 ? 'mid' : 'near');
      }
      sfx(bb, 'chime', { soft: true, x: tr.x });
    }]));
    return beats;
  }
  // 拔营 / 安营
  function strike(on, b) { W.set('nmStrike', on ? 1 : 0, b.instant); }
  // 全会众（人与人群）
  function everyone() { return ['moses', 'aaron', 'eleazar', 'miriam', 'joshua', 'caleb'].filter(id => has(id)).concat(folkLive().map(f => f.id).filter(id => has(id))); }
  // 众人（重新）在营中各归其位：新到一处安营时
  function castHome() {
    add('moses', { label: '摩西', sex: 'm', age: 'elder', x: X.moses, v: 0.34, facing: -1, robe: ROBE.moses, glow: 0.45, prop: 'staff' });
    if (S.aaron) add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: X.aaron, v: 0.3, facing: -1, robe: ROBE.aaron, accent: PRIEST_ACC, glow: 0.3, prop: null });
    add('eleazar', S.aaron ? { label: '以利亚撒', sex: 'm', age: 'adult', x: X.eleazar, v: 0.36, facing: -1, robe: ROBE.eleazar, glow: 0.15 }
      : { label: '以利亚撒', sex: 'm', age: 'adult', x: X.aaron, v: 0.3, facing: -1, robe: ROBE.aaron, accent: PRIEST_ACC, glow: 0.25 });
    if (S.miriam) add('miriam', { label: '米利暗', sex: 'f', age: 'elder', x: X.miriam, v: 0.42, facing: 1, robe: ROBE.miriam, glow: 0.2, prop: null });
    add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: X.joshua, v: 0.4, facing: -1, robe: ROBE.joshua, glow: 0.2 });
    ['moses', 'aaron', 'miriam', 'joshua'].forEach(id => { if (has(id)) { place(id, X[id]); pose(id, 'stand'); face(id, -1); } });
    if (has('eleazar')) { place('eleazar', S.aaron ? X.eleazar : X.aaron); pose('eleazar', 'stand'); face('eleazar', -1); }
    if (has('miriam')) face('miriam', 1);
    folkLive().forEach(f => { folkAdd(f); place(f.id, f.x); pose(f.id, 'stand'); });
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1–5 章：各归自己的纛下 ─────────────────────────────────
    {
      kind: 'cmd', utter: '以色列人要各归自己的纛下', cmd: 'census --tribes 12 && camp --around 会幕', ref: '2:2',
      verse: [
        { text: '耶和华晓谕摩西、亚伦说：「以色列人要各归自己的纛下，<br>在本族的旗号那里，对着会幕的四围安营。」', ref: '民数记 2:1–2', hold: 7 },
        { text: '在帐幕前东边，向日出之地安营的是摩西、亚伦，和亚伦的儿子。<br>他们看守圣所，替以色列人守耶和华所吩咐的。', ref: '民数记 3:38', hold: 6.5 },
        { text: '将要起营的时候，亚伦和他儿子把圣所和圣所的一切器具遮盖完了，<br>哥辖的子孙就要来抬，只是不可摸圣物，免得他们死亡。', ref: '民数记 4:15', hold: 6.5 },
        { text: '耶和华晓谕摩西说：「……无论男女都要使他们出到营外，免得污秽他们的营；<br>这营是我所住的。」', ref: '民数记 5:1–3', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { beam(b, X.tab, TABV, { dur: 5, w: 80 }); W.goTo(0.42, 24, b.instant); pose('moses', 'raise'); }],
          [1.2, () => { prop('loose', null, { grow: 0 }); }],
          ...bannersUp(c, 1.4, 1.05),
          [4.5, () => { pose('moses', 'stand'); }],
          [9, () => { eastFront({ speed: 0.02 }); }],
          [15.5, b => {
            prop('lev', null, { grow: 1 });
            crowd('levites', { n: 4, x0: X.tab + 0.06, x1: X.tab + 0.09, layer: 2, label: '利未人', robe: ROBE.levite, mill: false, v: 0.2 });
            sfx(b, 'build', { soft: true, x: X.tab });
          }],
          [19, b => { crowdPose('levites', 'bow'); if (!b.instant) fx().ring(X.tab * W.w, posY(2, X.tab, TABV) - 30 * LS(2), [255, 240, 200], M() * 0.2, 2.4, 1.6); }],
          [23, () => { crowdPose('levites', 'stand'); }],
          [25, b => { glory(b, { big: 1.4, dur: 6 }); sfx(b, 'harp'); folkFace(X.tab); }],
        ]);
      },
    },

    // ── 6–8 章：祭司的祝福；施恩座上的声音；七盏灯 ──────────────────
    {
      kind: 'bless', utter: '愿耶和华赐福给你，保护你', cmd: 'bless 以色列 --keep --shine --peace', ref: '6:24',
      verse: [
        { text: '耶和华晓谕摩西说：「你告诉亚伦和他儿子说：<br>你们要这样为以色列人祝福。」', ref: '民数记 6:22–23', hold: 5 },
        { text: '『愿耶和华赐福给你，保护你。<br>愿耶和华使他的脸光照你，赐恩给你。<br>愿耶和华向你仰脸，赐你平安。』', ref: '民数记 6:24–26', hold: 9 },
        { text: '摩西进会幕要与耶和华说话的时候，听见法柜的施恩座以上、二基路伯中间<br>有与他说话的声音，就是耶和华与他说话。', ref: '民数记 7:89', hold: 7 },
        { text: '亚伦便这样行。他点灯台上的灯，使灯向前发光，<br>是照耶和华所吩咐摩西的。', ref: '民数记 8:3', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { W.goTo(0.7, 22, b.instant); walk('aaron', X.aaron - 0.03, { speed: 0.03 }); walk('eleazar', X.eleazar - 0.03, { speed: 0.03 }); }],
          [2.5, () => { pose('aaron', 'raise'); pose('eleazar', 'raise'); folkFace(X.aaron); folkPose('bow'); }],
          // 赐福给你，保护你：一片穹光罩住全营
          [6.3, b => { W.set('nmBless', 1, b.instant); sfx(b, 'harp'); }],
          // 使他的脸光照你
          [9.3, b => { flash(b, { type: 'rays', dur: 7 }); folkPose('gaze'); }],
          // 向你仰脸，赐你平安
          [12.5, b => { W.set('nmBless', 0.55, b.instant); folkPose('kneel'); sfx(b, 'angel', { soft: true }); }],
          [15.5, () => { pose('aaron', 'stand'); pose('eleazar', 'stand'); walk('moses', X.tab - 0.02, { speed: 0.025 }); }],
          // 二基路伯中间的声音
          [18, b => { rm('moses'); prop('tab', null, { glow: 1 }); sfx(b, 'angel'); }],
          [21.5, b => { W.set('nmBless', 0, b.instant); folkPose('stand'); }],
          [24, b => {
            prop('tab', null, { glow: 0, lit: 1 });
            add('moses', { label: '摩西', sex: 'm', age: 'elder', x: X.tab - 0.02, v: 0.34, facing: -1, robe: ROBE.moses, glow: 0.55, prop: 'staff' });
            place('moses', X.tab - 0.02);
            walk('moses', X.moses, { speed: 0.02 });
            walk('aaron', X.aaron, { speed: 0.02 }); walk('eleazar', X.eleazar, { speed: 0.02 });
            sfx(b, 'fire', { soft: true, x: X.tab });
          }],
        ]);
      },
    },

    // ── 9–10 章：云柱火柱；两枝银号；离开西奈，停在巴兰的旷野 ─────────
    {
      kind: 'cmd', utter: '你要用银子做两枝号', cmd: 'on cloud.lift → trumpet ×2 && march 巴兰', ref: '10:2',
      verse: [
        { text: '立起帐幕的那日，有云彩遮盖帐幕，就是法柜的帐幕；<br>从晚上到早晨，云彩在其上，形状如火。', ref: '民数记 9:15', hold: 6.5 },
        { text: '云彩几时从帐幕收上去，以色列人就几时起行；<br>云彩在哪里停住，以色列人就在那里安营。', ref: '民数记 9:17', hold: 6.5 },
        { text: '耶和华晓谕摩西说：「你要用银子做两枝号，都要锤出来的，<br>用以招聚会众，并叫众营起行。」', ref: '民数记 10:1–2', hold: 6.5 },
        { text: '第二年二月二十日，云彩从法柜的帐幕收上去。<br>以色列人就按站往前行，离开西奈的旷野，云彩停住在巴兰的旷野。', ref: '民数记 10:11–12', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { W.goTo(0.02, 5.5, b.instant); folkPose('sit'); }],
          [6.5, b => { W.goTo(0.3, 6, b.instant); }],
          [11, b => { folkPose('stand'); folkFace(X.tab); prop('pillar', null, { lift: 1 }); sfx(b, 'wind', { soft: true }); }],
          // 两枝银号
          [15.5, b => {
            add('ithamar', { label: '以他玛', sex: 'm', age: 'adult', x: X.ithamar, v: 0.3, facing: -1, robe: ROBE.ithamar, glow: 0.15 });
            pose('eleazar', 'raise'); pose('ithamar', 'raise');
            flash(b, { type: 'trump', xf: X.eleazar, v: 0.36, dur: 3.5 });
            sfx(b, 'trumpet', { x: X.eleazar });
          }],
          [17, b => { flash(b, { type: 'trump', xf: X.ithamar, v: 0.3, dur: 3.5 }); sfx(b, 'trumpet', { x: X.ithamar }); }],
          // 拔营：帐棚收起，会幕拆卸，哥辖的子孙抬着约柜在前头行
          [18.5, b => {
            strike(true, b); prop('tab', null, { show: false }); pose('eleazar', 'stand'); pose('ithamar', 'stand');
            add('kohA', { label: '哥辖的子孙', sex: 'm', age: 'adult', x: X.tab - 0.012, v: 0.3, facing: 1, robe: ROBE.levite, glow: 0.1 });
            add('kohB', { label: '哥辖的子孙', sex: 'm', age: 'adult', x: X.tab + 0.02, v: 0.3, facing: 1, robe: ROBE.levite, glow: 0.1 });
            prop('ark', 'ark', { name: ['kohA', 'kohB'], label: '约柜' });
            unCrowd('levites');
            sfx(b, 'crowd', { soft: true });
          }],
          [20.5, () => {
            prop('pillar', null, { tx: 1.18, spd: 0.07 });
            walk('kohB', 1.14, { speed: 0.075 }); walk('kohA', 1.1, { speed: 0.075 });
            everyone().forEach((id, i) => walk(id, 1.12 + (i % 5) * 0.012, { speed: 0.07 + (i % 3) * 0.006 }));
            if (has('ithamar')) walk('ithamar', 1.13, { speed: 0.075 });
            crowdWalk('mid', 1.08, 1.16, { speed: 0.05 });
            crowdWalk('flock', 1.1, 1.2, { speed: 0.06 }); crowdWalk('kine', 1.12, 1.2, { speed: 0.06 });
          }],
          // 离开西奈：山退去；到了巴兰的旷野，云彩停住
          [25, b => { W.set('nmFar', 0, b.instant); W.set('bare', 0.88, b.instant); W.goTo(0.42, 5, b.instant); }],
          [27.5, b => {
            ['kohA', 'kohB', 'ithamar'].forEach(id => rm(id)); unprop('ark');
            everyone().forEach(id => rm(id));
            prop('pillar', null, { show: false });
          }],
          [29.5, b => {
            prop('pillar', null, { show: true, lift: 0 });
            const p = getP('pillar'); if (p) { p.x = X.tab; p.tx = null; if (!b.instant) p.a = 0; }
            prop('tab', null, { show: true });
            strike(false, b);
            castHome();
            unCrowd('mid'); crowd('mid2', { n: 7, x0: 0.58, x1: 0.76, layer: 1, label: '以色列人' });
            unCrowd('flock'); unCrowd('kine');
            herd('flock2', { kind: 'sheep', n: 6, x0: 0.86, x1: 0.97, layer: 2, label: '羊群' });
            W.set('nmManna', 1, b.instant);
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 11–12 章：哭号要肉；鹌鹑由海面刮来；面对面说话 ───────────────
    {
      kind: 'ask', utter: '耶和华的膀臂岂是缩短了吗', cmd: 'curl 鹌鹑 --from 海 --via 风  # 二肘高', ref: '11:23',
      verse: [
        { text: '以色列人又哭号说：「谁给我们肉吃呢？……<br>除这吗哪以外，在我们眼前并没有别的东西。」', ref: '民数记 11:4–6', hold: 6.5 },
        { text: '耶和华对摩西说：「耶和华的膀臂岂是缩短了吗？<br>现在要看我的话向你应验不应验。」', ref: '民数记 11:23', hold: 6 },
        { text: '有风从耶和华那里刮起，把鹌鹑由海面刮来，<br>飞散在营边和营的四围……离地面约有二肘。', ref: '民数记 11:31', hold: 7 },
        { text: '耶和华在云柱中降临，站在会幕门口……<br>「我要与他面对面说话，乃是明说，不用谜语……」', ref: '民数记 12:5–8', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { folkPose('weep'); sfx(b, 'weep'); W.goTo(0.5, 10, b.instant); }],
          [3, () => { walk('moses', X.tab - 0.07, { speed: 0.025, pose: 'kneel' }); }],
          [7.5, b => { beamOn(b, 'moses', { dur: 5 }); }],
          // 风从海面刮来
          [12, b => { W.set('gale', 0.75, b.instant); W.set('clouds', 0.55, b.instant); W.set('nmManna', 0, b.instant); sfx(b, 'wind'); W.goTo(0.62, 10, b.instant); pose('moses', 'stand'); folkPose('stand'); folkFace(0.3); }],
          [13.5, b => { flash(b, { type: 'quail', dur: 11 }); sfx(b, 'wings'); }],
          [15, b => { W.set('nmQuail', 1, b.instant); }],
          [20, b => { folkPose('bow'); sfx(b, 'bird', { soft: true }); }],
          [23, b => { W.set('gale', 0, b.instant); W.set('clouds', 0.3, b.instant); folkPose('carry'); walk('moses', X.moses, { speed: 0.03 }); }],
          // 云柱中降临，站在会幕门口
          [24, b => {
            prop('pillar', null, { lift: -1, tx: X.tab - 0.045, spd: 0.02 });
            walk('aaron', X.tab - 0.085, { speed: 0.03 }); walk('miriam', X.tab - 0.1, { speed: 0.03 });
            face('aaron', 1); face('miriam', 1);
          }],
          [26.5, b => { glory(b, { xf: X.tab - 0.06, dur: 5 }); pose('moses', 'bow'); sfx(b, 'angel', { soft: true }); }],
          [30, () => { prop('pillar', null, { lift: 0, tx: X.tab, spd: 0.02 }); walk('aaron', X.aaron, { speed: 0.03 }); walk('miriam', X.miriam, { speed: 0.03 }); pose('moses', 'stand'); folkPose('stand'); }],
        ]);
      },
    },

    // ── 13–14 章：十二个探子；一挂葡萄；那夜百姓哭号；约书亚与迦勒 ─────
    {
      kind: 'cmd', utter: '窥探我所赐给以色列人的迦南地', cmd: 'scout 迦南 --days 40 --bring 葡萄', ref: '13:2',
      verse: [
        { text: '耶和华晓谕摩西说：「你打发人去窥探我所赐给以色列人的迦南地，<br>他们每支派中要打发一个人，都要作首领的。」', ref: '民数记 13:1–2', hold: 6.5 },
        { text: '他们到了以实各谷，从那里砍了葡萄树的一枝，上头有一挂葡萄，<br>两个人用杠抬着，又带了些石榴和无花果来。', ref: '民数记 13:23', hold: 6.5 },
        { text: '「我们到了你所打发我们去的那地，果然是流奶与蜜之地；<br>这就是那地的果子。然而住那地的民强壮……」', ref: '民数记 13:27–28', hold: 6.5 },
        { text: '那夜百姓都哭号。……嫩的儿子约书亚和耶孚尼的儿子迦勒……对以色列全会众说：<br>「我们所窥探、经过之地是极美之地。」', ref: '民数记 14:1–7', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => {
            W.set('nmQuail', 0, b.instant);
            add('caleb', { label: '迦勒', sex: 'm', age: 'adult', x: 0.7, v: 0.3, facing: 1, robe: ROBE.caleb, glow: 0.2 });
            add('spyA', { label: '探子', sex: 'm', age: 'adult', x: 0.72, v: 0.3, facing: 1, robe: ROBE.spy, glow: 0.1 });
            add('spyB', { label: '探子', sex: 'm', age: 'adult', x: 0.74, v: 0.3, facing: 1, robe: [110, 92, 70], glow: 0.1 });
            crowd('spies', { n: 8, x0: 0.7, x1: 0.8, layer: 2, label: '探子', robe: ROBE.spy, mill: false, v: 0.25 });
            walk('joshua', 0.69, { speed: 0.04 });
            beamOn(b, 'moses', { dur: 4 });
          }],
          [3, () => { ['joshua', 'caleb', 'spyA', 'spyB'].forEach((id, i) => walk(id, 1.1 + i * 0.01, { speed: 0.075 })); crowdWalk('spies', 1.08, 1.16, { speed: 0.075 }); }],
          [5, b => { W.goTo(0.66, 6, b.instant); }],
          // 过了四十天，他们回来：两个人用杠抬着一挂葡萄
          [9.5, b => {
            ['joshua', 'caleb', 'spyA', 'spyB'].forEach((id, i) => place(id, 1.08 + i * 0.012));
            unCrowd('spies');
            crowd('spies2', { n: 8, x0: 1.1, x1: 1.18, layer: 2, label: '探子', robe: ROBE.spy, mill: false, v: 0.25 });
            crowdWalk('spies2', 0.79, 0.86, { speed: 0.045 });
            face('spyA', -1); face('spyB', -1);
            prop('carry', 'carry', { name: ['spyA', 'spyB'], label: '一挂葡萄' });
            walk('spyA', 0.735, { speed: 0.045 }); walk('spyB', 0.77, { speed: 0.045 });
            walk('joshua', 0.7, { speed: 0.045 }); walk('caleb', 0.715, { speed: 0.045 });
            folkFace(0.9);
          }],
          [18, b => {
            unprop('carry');
            prop('fruit', 'fruit', { x: 0.752, v: 0.32, label: '一挂葡萄' });
            pose('spyA', 'point'); pose('spyB', 'stand');
            sfx(b, 'crowd', { soft: true });
          }],
          // 那夜百姓都哭号
          [21, b => { W.goTo(0.95, 6, b.instant); folkPose('weep'); sfx(b, 'weep'); pose('spyA', 'stand'); }],
          [24, b => {
            pose('joshua', 'raise'); pose('caleb', 'raise'); glow('joshua', 0.6); glow('caleb', 0.6);
            if (!b.instant) { const f = fig('joshua'); if (f) fx().sparkle(f.nx * W.w, posY(2, f.nx, f.v) - 40 * LS(2), 16, [255, 236, 200], 16, 'near'); }
          }],
          [29.5, b => { glory(b, { dur: 5 }); pose('joshua', 'stand'); pose('caleb', 'stand'); }],
        ]);
      },
    },

    // ── 14–15 章：飘流四十年 ─────────────────────────────────
    {
      kind: 'judge', utter: '你们的儿女必在旷野飘流四十年', cmd: 'sleep 40y  # 一年顶一日', ref: '14:33',
      verse: [
        { text: '耶和华说：「我照着你的话赦免了他们。<br>然我指着我的永生起誓，遍地要被我的荣耀充满。」', ref: '民数记 14:20–21', hold: 6.5 },
        { text: '「你们的儿女必在旷野飘流四十年……<br>按你们窥探那地的四十日，一年顶一日，你们要担当罪孽四十年。」', ref: '民数记 14:33–34', hold: 7 },
        { text: '「我是耶和华你们的神，曾把你们从埃及地领出来，要作你们的神。<br>我是耶和华你们的神。」', ref: '民数记 15:41', hold: 6.5 },
      ],
      apply(c) {
        const beats = [
          [0.2, b => {
            folkPose('fall'); pose('spyA', 'fall'); pose('spyB', 'fall'); crowdPose('spies2', 'fall');
            unprop('fruit');
            if (!b.instant) { const [x, y] = nameAt(X.tab + 0.06, W.h * 0.3, 38 * SU(), 3); fx().nameStr('四十年', x, y, 38 * SU(), [255, 232, 190], () => [x + (Math.random() - 0.5) * W.w * 0.4, y + W.h * 0.3], { hold: 5 }); }
          }],
          [3, () => { rm('spyA'); rm('spyB'); unCrowd('spies2'); folkPose('stand'); pose('joshua', 'stand'); pose('caleb', 'stand'); glow('joshua', 0.3); glow('caleb', 0.3); }],
        ];
        // 昼夜飞逝：旷野里一年一年过去，坟一堆一堆多起来，老的一代归于尘土
        for (let i = 0; i < 5; i++) {
          beats.push([3.5 + i * 2.9, b => {
            W.passDay(2.8, b.instant);
            W.set('nmGraves', (i + 1) / 5, b.instant);
            W.set('bare', i % 2 ? 0.92 : 0.72, b.instant);
            if (i === 1) rm('f3');
            if (i === 2) rm('f11');
            if (i === 3) { rm('f6'); }
            if (i === 4) { S.gen = 1; CHILDREN.forEach(id => { const f = fig(id); if (f) { f.age = 'adult'; } }); }
            if (!b.instant && i === 2) sfx(b, 'weep', { soft: true });
          }]);
        }
        beats.push([18.5, b => {
          S.gen = 1;
          CHILDREN.forEach(id => { const f = fig(id); if (f) f.age = 'adult'; });
          W.set('bare', 0.84, b.instant);
          folkHome({ speed: 0.03 });
          pose('moses', 'stand'); glow('moses', 0.5);
          sfx(b, 'harp', { soft: true });
        }]);
        beats.push([21, b => { beam(b, X.tab, TABV, { dur: 5, w: 70 }); }]);
        T(c, beats);
      },
    },

    // ── 16–18 章：地开了口；站在活人死人中间；亚伦的杖发了芽 ─────────
    {
      kind: 'promise', utter: '我所拣选的那人，他的杖必发芽', cmd: 'select 杖 --where bud  # 共十二根', ref: '17:5',
      verse: [
        { text: '摩西刚说完了这一切话，他们脚下的地就开了口，<br>把他们和他们的家眷……都吞下去。', ref: '民数记 16:31–32', hold: 6.5 },
        { text: '亚伦……跑到会中……他就加上香，为百姓赎罪。<br>他站在活人死人中间，瘟疫就止住了。', ref: '民数记 16:47–48', hold: 6.5 },
        { text: '第二天，摩西进法柜的帐幕去。谁知利未族亚伦的杖已经发了芽，<br>生了花苞，开了花，结了熟杏。', ref: '民数记 17:8', hold: 7 },
        { text: '耶和华对亚伦说：「你在以色列人的境内不可有产业，在他们中间也不可有分。<br>我就是你的分，是你的产业。」', ref: '民数记 18:20', hold: 7 },
      ],
      apply(c) {
        const RX = 0.5;                                  // 可拉一党的帐棚（在东营之前）
        T(c, [
          [0.2, b => {
            W.goTo(0.46, 8, b.instant);
            prop('rt0', 'tent1', { x: RX - 0.03, v: 0.18, grow: 1, size: 1, label: '可拉的帐棚' });
            prop('rt1', 'tent1', { x: RX, v: 0.26, grow: 1, size: 0.9, label: '大坍的帐棚' });
            prop('rt2', 'tent1', { x: RX + 0.03, v: 0.2, grow: 1, size: 0.9, label: '亚比兰的帐棚' });
            crowd('korah', { n: 5, x0: RX - 0.035, x1: RX + 0.035, layer: 2, label: '可拉一党', robe: [84, 70, 66], mill: false, v: 0.3 });
            walk('moses', 0.555, { speed: 0.03 }); face('moses', -1);
          }],
          [3, () => { pose('moses', 'raise'); }],
          // 地开了口
          [5.5, b => { flash(b, { type: 'rift', xf: RX, dur: 5.5 }); sfx(b, 'thunder', { low: true }); if (!b.instant) { W.shake = 1; fx().dust(RX * W.w, posY(2, RX, 0.22), 60, [170, 140, 110], 40 * SU()); } }],
          [7.5, () => { unCrowd('korah'); unprop('rt0'); unprop('rt1'); unprop('rt2'); pose('moses', 'stand'); }],
          // 瘟疫：亚伦拿着香炉，跑到会中
          [11, b => {
            flash(b, { type: 'plague', xf: 0.545, dur: 8 });
            crowd('plagued', { n: 4, x0: 0.41, x1: 0.47, layer: 2, label: '以色列人', mill: false, v: 0.5 });
            hold('aaron', 'torch'); run('aaron', 0.535, { pose: 'raise' });
            prop('incense', 'incense', { fire: 1 });
            sfx(b, 'wind', { low: true });
          }],
          [13, () => { crowdPose('plagued', 'lie'); }],
          [17.5, () => { unCrowd('plagued'); unprop('incense'); pose('aaron', 'stand'); hold('aaron', null); }],
          // 十二根杖，存在法柜前；过了一夜
          [18.5, b => {
            prop('rods', 'rods', { x: X.rods, v: 0.52, label: '十二根杖', n: 12 });
            walk('aaron', X.aaron, { speed: 0.03 }); walk('moses', X.moses, { speed: 0.03 });
            W.goTo(0.02, 3.5, b.instant);
          }],
          [22.5, b => { W.goTo(0.3, 3.5, b.instant); }],
          // 第二天：亚伦的杖发了芽，开了花，结了熟杏
          [25, b => {
            prop('rods', null, { bud: 1, glow: 1, label: '亚伦的杖' });
            sfx(b, 'harp');
            if (!b.instant) { const s = LS(2) * vS(0.52) * 1.5; fx().sparkle(X.rods * W.w, posY(2, X.rods, 0.52) - 26 * s, 30, [255, 236, 240], 16, 'near'); }
            folkFace(X.rods);
          }],
          [28, () => { pose('aaron', 'kneel'); glow('aaron', 0.6); }],
        ]);
      },
    },

    // ── 19–20 章：纯红的母牛；米利暗；击打磐石；何珥山 ───────────────
    {
      kind: 'cmd', utter: '吩咐磐石发出水来', cmd: 'rock.speak("水")  # 他却击打了两下', ref: '20:8',
      verse: [
        { text: '耶和华晓谕摩西、亚伦说：「……你要吩咐以色列人，<br>把一只没有残疾、未曾负轭、纯红的母牛牵到你这里来。」', ref: '民数记 19:1–2', hold: 6 },
        { text: '正月间，以色列全会众到了寻的旷野，就住在加低斯。<br>米利暗死在那里，就葬在那里。', ref: '民数记 20:1', hold: 6 },
        { text: '摩西举手，用杖击打磐石两下，就有许多水流出来，<br>会众和他们的牲畜都喝了。', ref: '民数记 20:11', hold: 6.5 },
        { text: '摩西把亚伦的圣衣脱下来，给他的儿子以利亚撒穿上，<br>亚伦就死在山顶那里。', ref: '民数记 20:28', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          // 纯红的母牛，牵到营外
          [0.2, b => {
            unprop('rods'); pose('aaron', 'stand'); glow('aaron', 0.3);
            animal('heifer', 'cow', X.tab - 0.02, { col: [168, 58, 40], label: '纯红的母牛', facing: -1, v: 0.4 });
            walk('eleazar', X.tab - 0.04, { speed: 0.03 });
            W.goTo(0.55, 12, b.instant);
          }],
          [1.5, () => { walk('heifer', 0.405, { speed: 0.035 }); walk('eleazar', 0.43, { speed: 0.035 }); }],
          [6, () => { rm('heifer'); walk('eleazar', X.eleazar, { speed: 0.04 }); }],
          // 加低斯：米利暗死在那里
          [7, b => { W.set('bare', 0.95, b.instant); walk('miriam', X.cairnM, { speed: 0.025 }); }],
          [9.5, () => { pose('miriam', 'lie'); }],
          [11.5, b => {
            rm('miriam'); S.miriam = 0;
            prop('cairnM', 'cairn', { x: X.cairnM, v: 0.42, grow: 1, glow: 0.6, label: '米利暗的坟' });
            if (!b.instant) { const x = X.cairnM * W.w, y = posY(2, X.cairnM, 0.42); fx().sparkle(x, y - 10, 20, [255, 236, 210], 14, 'near'); }
            pose('aaron', 'weep'); pose('moses', 'weep');
            sfx(b, 'weep', { soft: true });
          }],
          // 磐石
          [13.5, b => {
            prop('cairnM', null, { glow: 0 });
            prop('rock', 'rock', { x: X.rock, v: 0.1, label: '磐石' });
            crowdWalk('flock2', 0.955, 1.0, { speed: 0.04 });
            walk('moses', X.rock - 0.045, { speed: 0.05 }); walk('aaron', X.rock - 0.065, { speed: 0.05 });
            folkLive().forEach((f, i) => walk(f.id, lerp(0.7, 0.84, (i + 0.5) / folkLive().length), { speed: 0.045 }));
          }],
          [17.5, b => { pose('moses', 'raise'); sfx(b, 'build', { x: X.rock }); if (!b.instant) { W.shake = 0.6; fx().dust(X.rock * W.w, posY(2, X.rock, 0.1) - 20 * LS(2), 20, [180, 150, 120], 16); } }],
          [18.6, b => { pose('moses', 'point'); sfx(b, 'build', { x: X.rock }); if (!b.instant) { W.shake = 0.6; fx().dust(X.rock * W.w, posY(2, X.rock, 0.1) - 20 * LS(2), 20, [180, 150, 120], 16); } }],
          [19.6, b => { prop('rock', null, { water: 1 }); sfx(b, 'splash'); sfx(b, 'crowd', { soft: true }); folkPose('bow'); crowdWalk('flock2', 0.8, 0.86, { speed: 0.03 }); }],
          // 何珥山：远处的山上，三个人当着会众的眼前上了山
          [21.5, b => {
            pose('moses', 'stand');
            S.far = 'hor'; W.set('nmFar', 1, b.instant);
            W.goTo(0.73, 9, b.instant);
            folkPose('stand'); folkFace(0.84);
          }],
          [23, b => {
            ['moses', 'aaron', 'eleazar'].forEach(id => fade(id, 0));
            const m = FARM.hor, fx0 = m.x + m.hw * 0.9;
            [['fMoses', ROBE.moses, 'elder', 0], ['fAaron', ROBE.aaron, 'elder', 0.012], ['fEleazar', ROBE.eleazar, 'adult', 0.024]].forEach(([id, robe, age, dx]) => {
              add(id, { label: id === 'fAaron' ? '亚伦' : id === 'fMoses' ? '摩西' : '以利亚撒', sex: 'm', age, layer: 0, x: fx0 + dx, facing: -1, robe, glow: 0.4, prop: id === 'fMoses' ? 'staff' : null });
              attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, farY(f.nx)] : null; });
              walk(id, m.x + dx * 0.6, { speed: 0.016 });
            });
          }],
          // 山顶：圣衣穿在以利亚撒身上；亚伦归他列祖
          [28, b => {
            add('fEleazar', { robe: ROBE.aaron, accent: PRIEST_ACC });
            add('eleazar', { robe: ROBE.aaron, accent: PRIEST_ACC });
            pose('fAaron', 'lie');
            sfx(b, 'angel', { soft: true });
          }],
          [30, b => {
            rm('fAaron');
            if (!b.instant) { const m = FARM.hor, x = m.x * W.w, y = farY(m.x); FXL.push({ type: 'beam', t: 0, dur: 5, xf: m.x, v: 0, w: 30 * SU(), k: 0.8 }); fx().sparkle(x, y - 6, 20, [255, 240, 210], 10, 'far'); }
            rm('aaron'); S.aaron = 0;
            folkPose('weep');
            ['fMoses', 'fEleazar'].forEach(id => rm(id));
            fade('moses', 1); fade('eleazar', 1);
            place('moses', X.moses); place('eleazar', X.aaron);
            pose('moses', 'weep'); pose('eleazar', 'weep');
          }],
        ]);
      },
    },

    // ── 21 章：火蛇与铜蛇（本卷的画）；「井啊，涌上水来！」 ────────────
    {
      kind: 'promise', utter: '凡被咬的，一望这蛇，就必得活', cmd: 'mount 铜蛇 /杆子 && look → live', ref: '21:8',
      verse: [
        { text: '百姓因这路难行，心中甚是烦躁……<br>于是耶和华使火蛇进入百姓中间，蛇就咬他们。', ref: '民数记 21:4–6', hold: 6.5 },
        { text: '耶和华对摩西说：「你制造一条火蛇，挂在杆子上；<br>凡被咬的，一望这蛇，就必得活。」', ref: '民数记 21:8', hold: 6.5 },
        { text: '摩西便制造一条铜蛇，挂在杆子上；<br>凡被蛇咬的，一望这铜蛇就活了。', ref: '民数记 21:9', hold: 7.5 },
        { text: '当时，以色列人唱歌说：<br>井啊，涌上水来！你们要向这井歌唱。', ref: '民数记 21:17', hold: 6 },
      ],
      apply(c) {
        const LOOK = ['f0', 'f1', 'f2', 'f4', 'f5', 'f7', 'f8', 'f9', 'f10'];
        const beats = [
          [0.2, b => {
            S.far = 'hor'; W.set('nmFar', 0, b.instant);
            prop('rock', null, { water: 0 }); unprop('rock');
            prop('pillar', null, { dim: 1 });
            crowdWalk('flock2', 0.9, 0.99, { speed: 0.03 });
            W.goTo(0.7, 8, b.instant);
            pose('moses', 'stand'); pose('eleazar', 'stand');
            folkHome({ speed: 0.04 });
            walk('moses', X.moses, { speed: 0.03 }); walk('eleazar', X.aaron, { speed: 0.03 });
          }],
          // 火蛇进入百姓中间
          [3.5, b => { W.set('nmSnakes', 1, b.instant); sfx(b, 'fire', { soft: true }); }],
        ];
        LOOK.forEach((id, i) => beats.push([4.2 + i * 0.45, () => { pose(id, 'lie'); }]));
        beats.push(
          [8.5, () => { pose('moses', 'pray'); }],
          // 摩西便制造一条铜蛇，挂在杆子上
          [10, b => {
            pose('moses', 'stand');
            walk('moses', X.serpent - 0.03, { speed: 0.04 });
            prop('serpent', 'serpent', { x: X.serpent, v: 0.6, grow: 1, label: '铜蛇' });
            sfx(b, 'build', { x: X.serpent });
            W.goTo(0.745, 9, b.instant);
          }],
          [14, b => {
            prop('serpent', null, { lit: 1 });
            pose('moses', 'raise');
            sfx(b, 'harp');
            if (!b.instant) { const p = getP('serpent'); if (p) fx().ring(X.serpent * W.w, posY(2, X.serpent, p.v) - serpH(p), [255, 220, 150], M() * 0.3, 2.6, 2); }
          }],
        );
        // 一望这铜蛇就活了：由近而远，一个一个仰望、起来
        const order = LOOK.slice().sort((a, b2) => Math.abs(FOLK.find(f => f.id === a).x - X.serpent) - Math.abs(FOLK.find(f => f.id === b2).x - X.serpent));
        order.forEach((id, i) => {
          beats.push([15.5 + i * 0.9, b => {
            face(id, X.serpent); pose(id, 'gaze');
            flash(b, { type: 'look', id, dur: 2.6 });
            if (!b.instant) sfx(b, 'chime', { soft: true });
          }]);
        });
        beats.push(
          [19.5, b => { W.set('nmSnakes', 0, b.instant); }],
          [24.5, () => { pose('moses', 'stand'); folkPose('stand'); }],
          // 井啊，涌上水来
          [25.5, b => {
            prop('well', 'well', { x: X.well, v: 0.62, label: '井', water: 1 });
            sfx(b, 'splash');
          }],
          [27, b => { folkPose('raise'); sfx(b, 'angel', { soft: true }); }],
          [30, () => { folkPose('stand'); }],
        );
        T(c, beats);
      },
    },

    // ── 22 章：巴兰的驴看见耶和华的使者 ────────────────────────
    {
      kind: 'cmd', utter: '不可咒诅那民，因为那民是蒙福的', cmd: 'balaam.curse(以色列) → throws 蒙福', ref: '22:12',
      verse: [
        { text: '神对巴兰说：「你不可同他们去，也不可咒诅那民，<br>因为那民是蒙福的。」', ref: '民数记 22:12', hold: 6 },
        { text: '驴看见耶和华的使者站在路上，手里有拔出来的刀，<br>就从路上跨进田间，巴兰便打驴，要叫它回转上路。', ref: '民数记 22:23', hold: 7 },
        { text: '耶和华叫驴开口，对巴兰说：<br>「我向你行了什么，你竟打我这三次呢？」', ref: '民数记 22:28', hold: 6 },
        { text: '当时，耶和华使巴兰的眼目明亮，他就看见耶和华的使者站在路上，<br>手里有拔出来的刀，巴兰便低头俯伏在地。', ref: '民数记 22:31', hold: 7 },
      ],
      apply(c) {
        const AX = 0.765;                                // 使者站在路上
        T(c, [
          // 以色列人起行，在摩押平原安营（远）；近处是摩押的葡萄园与窄路
          [0.2, b => {
            W.goTo(0.3, 5, b.instant);
            unprop('well'); unprop('serpent');
            prop('lev', null, { grow: 0 });
            prop('tab', null, { show: false }); prop('pillar', null, { show: false });
            TRIBES.forEach((tr, i) => { if (tr.l === 2) prop('bn' + i, null, { show: false }); });
            everyone().forEach(id => rm(id));
            unCrowd('flock2');
            prop('walls', 'walls', { label: '葡萄园' });
            W.set('bare', 0.6, b.instant);
          }],
          [2, b => {
            animal('ass', 'donkey', 1.08, { facing: -1, label: '驴', v: 0.46 });
            add('balaam', { label: '巴兰', sex: 'm', age: 'adult', x: 1.08, v: 0.46, facing: -1, robe: ROBE.balaam, glow: 0.2 });
            ride('balaam', 'ass');
            crowd('servants', { n: 2, x0: 1.12, x1: 1.15, layer: 2, label: '仆人', robe: ROBE.servant, mill: false, v: 0.46 });
            add('angel', { label: '耶和华的使者', sex: 'm', age: 'adult', x: AX, v: 0.46, facing: 1, angel: true, prop: 'sword', glow: 0.9, from: 'light' });
            fade('angel', 0.22);
            walk('ass', 0.86, { speed: 0.05 });
            crowdWalk('servants', 0.9, 0.93, { speed: 0.05 });
            sfx(b, 'donkey', { soft: true });
          }],
          // 驴看见使者，跨进田间；巴兰打驴
          [7.5, b => { face('ass', 1); walk('ass', 0.875, { speed: 0.02 }); sfx(b, 'donkey'); }],
          [9.5, () => { face('ass', -1); walk('ass', 0.815, { speed: 0.03 }); }],
          // 窄路上，驴卧在巴兰底下
          [13, b => { pose('ass', 'lie'); sfx(b, 'donkey'); }],
          [14, () => { ride('balaam', null); pose('balaam', 'raise'); hold('balaam', 'staff'); }],
          // 耶和华叫驴开口
          [15.5, b => {
            pose('balaam', 'stand');
            if (!b.instant) {
              const f = fig('ass'), sz = 20 * SU();
              const [x, y] = nameAt(f ? f.nx - 0.03 : 0.79, (f ? posY(2, f.nx, 0.46) : W.h * 0.85) - W.h * 0.2, sz, 7);
              fx().nameStr('我向你行了什么', x, y, sz, [255, 236, 200], () => [f ? f.nx * W.w : x, f ? posY(2, f.nx, 0.46) - 20 : y], { hold: 3.5 });
            }
          }],
          // 巴兰的眼目明亮：使者显出，他便低头俯伏在地
          [22, b => {
            fade('angel', 1); glow('angel', 1);
            if (!b.instant) { const x = AX * W.w, y = posY(2, AX, 0.46) - 30 * LS(2); fx().ring(x, y, [255, 240, 210], M() * 0.25, 2.2, 2); fx().sparkle(x, y, 30, [255, 244, 220], 20, 'near'); }
            sfx(b, 'angel');
            hold('balaam', null);
          }],
          [23.5, () => { pose('balaam', 'fall'); crowdPose('servants', 'bow'); }],
          [29, () => { glow('angel', 0.7); }],
        ]);
      },
    },

    // ── 23–25 章：毗珥山顶；帐棚何等华美；有星要出于雅各 ───────────
    {
      kind: 'promise', utter: '有星要出于雅各', cmd: 'render ★ --from 雅各 --far-future', ref: '24:17',
      verse: [
        { text: '巴兰就题诗歌说：……<br>神非人，必不致说谎，也非人子，必不致后悔。', ref: '民数记 23:18–19', hold: 6.5 },
        { text: '雅各啊，你的帐棚何等华美！以色列啊，你的帐幕何其华丽！<br>如接连的山谷，如河旁的园子……', ref: '民数记 24:5–6', hold: 6.5 },
        { text: '我看他却不在现时；我望他却不在近日。<br>有星要出于雅各，有杖要兴于以色列……', ref: '民数记 24:17', hold: 7 },
        { text: '耶和华晓谕摩西说：「祭司亚伦的孙子，以利亚撒的儿子非尼哈，<br>使我向以色列人所发的怒消了……我将我平安的约赐给他。」', ref: '民数记 25:10–12', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => {
            ['angel', 'balaam', 'ass'].forEach(id => rm(id)); unCrowd('servants'); unprop('walls');
            S.far = 'peor'; W.set('nmFar', 1, b.instant);
            W.goTo(0.8, 7, b.instant);
            W.set('bare', 0.7, b.instant);
          }],
          [2, b => {
            W.set('nmAltars', 1, b.instant);
            const m = FARM.peor;
            [['fBalaam', '巴兰', ROBE.balaam, 0.01], ['fBalak', '巴勒', ROBE.balak, -0.012]].forEach(([id, label, robe, dx]) => {
              add(id, { label, sex: 'm', age: 'adult', layer: 0, x: m.x + dx, facing: -1, robe, glow: 0.3 });
              attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, farY(f.nx)] : null; });
            });
            sfx(b, 'fire', { soft: true, far: true });
          }],
          // 巴兰举目，看见以色列人照着支派居住
          [5, b => {
            pose('fBalaam', 'raise');
            prop('lev', null, { grow: 1 });
            prop('tab', null, { show: true }); prop('pillar', null, { show: true, lift: 0, dim: 0 });
            TRIBES.forEach((tr, i) => prop('bn' + i, null, { show: true, grow: 1 }));
            eastFrontAdd();
            folkLive().forEach(f => folkAdd(f));
            herd('flock3', { kind: 'sheep', n: 5, x0: 0.86, x1: 0.97, layer: 2, label: '羊群' });
            sfx(b, 'harp', { soft: true });
          }],
          [9, b => { W.set('nmFair', 1, b.instant); TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 1 })); folkPose('sit'); }],
          // 有星要出于雅各
          [15.5, b => {
            W.goTo(0.96, 4, b.instant);
            W.set('nmStar', 1, b.instant);
            flash(b, { type: 'rise', dur: 6 });
            sfx(b, 'stars');
            folkPose('gaze'); folkFace(X.tab + 0.02); pose('fBalaam', 'gaze');
          }],
          [22, b => { W.set('nmFair', 0.4, b.instant); TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 0 })); sfx(b, 'harp', { soft: true }); }],
          [24, () => { folkPose('stand'); }],
        ]);
      },
    },

    // ── 26–28 章：摩押平原的约旦河边；西罗非哈的女儿；约书亚；早晚的燔祭 ─
    {
      kind: 'judge', utter: '西罗非哈的女儿说得有理', cmd: 'grant 产业 --to 玛拉,挪阿,曷拉,密迦,得撒', ref: '27:7',
      verse: [
        { text: '他们在摩押平原与耶利哥相对的约旦河边数点以色列人。……<br>除了耶孚尼的儿子迦勒和嫩的儿子约书亚以外，连一个人也没有存留。', ref: '民数记 26:63–65', hold: 7 },
        { text: '耶和华晓谕摩西说：「西罗非哈的女儿说得有理。<br>你定要在她们父亲的弟兄中，把地分给她们为业……」', ref: '民数记 27:6–7', hold: 6.5 },
        { text: '于是摩西照耶和华所吩咐的将约书亚领来，使他站在祭司以利亚撒和全会众面前，<br>按手在他头上，嘱咐他，是照耶和华藉摩西所说的话。', ref: '民数记 27:22–23', hold: 7 },
        { text: '「……没有残疾、一岁的公羊羔，每日两只，作为常献的燔祭。<br>早晨要献一只，黄昏的时候要献一只。」', ref: '民数记 28:3–4', hold: 6 },
      ],
      apply(c) {
        const DX = X.tab - 0.1;
        T(c, [
          // 天亮：远山退去，约旦河与河那边的迦南、耶利哥显出
          [0.2, b => {
            ['fBalaam', 'fBalak'].forEach(id => rm(id));
            W.set('nmFar', 0, b.instant); W.set('nmAltars', 0, b.instant); W.set('nmFair', 0, b.instant); W.set('nmGraves', 0, b.instant);
            W.set('nmStar', 1, b.instant);
            W.goTo(0.36, 6, b.instant);
            W.set('nmJordan', 1, b.instant); W.set('nmCanaan', 1, b.instant);
            W.set('bare', 0.55, b.instant); W.set('grass', 0.6, b.instant); W.set('trees', 0.3, b.instant); W.set('nmSand', 0.4, b.instant);
            prop('jericho', 'city', { x: X.jericho, layer: 1, size: 1.5, label: '耶利哥' });
            unprop('cairnM');
            unCrowd('flock3');
            herd('flock4', { kind: 'sheep', n: 4, x0: 0.38, x1: 0.44, layer: 2, label: '羊群', v: 0.82 });
          }],
          // 第二次数点：迦勒与约书亚
          [2.5, b => {
            TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 1 }));
            if (!has('caleb')) add('caleb', { label: '迦勒', sex: 'm', age: 'elder', x: 0.51, v: 0.4, facing: 1, robe: ROBE.caleb, glow: 0.5 });
            glow('joshua', 0.6); glow('caleb', 0.6); pose('joshua', 'raise'); pose('caleb', 'raise');
            sfx(b, 'chime', { soft: true });
          }],
          [6.5, () => { TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 0 })); pose('joshua', 'stand'); pose('caleb', 'stand'); }],
          // 五个女儿站在会幕门口
          [7.5, b => {
            ['玛拉', '挪阿', '曷拉', '密迦', '得撒'].forEach((nm, i) => {
              add('d' + i, { label: nm, sex: 'f', age: 'adult', x: 0.44 + i * 0.012, v: 0.5, facing: 1, robe: U.mixRGB(ROBE.dau, [236, 214, 170], i * 0.12), glow: 0.2 });
              walk('d' + i, DX + i * 0.014, { speed: 0.03 });
            });
            walk('moses', X.tab - 0.07, { speed: 0.03 }); walk('eleazar', X.tab - 0.055, { speed: 0.03 });
            face('moses', -1); face('eleazar', -1);
          }],
          [13, b => {
            for (let i = 0; i < 5; i++) glow('d' + i, 0.7);
            beam(b, DX + 0.03, 0.5, { dur: 5, w: 90, r: 0.14 });
            sfx(b, 'harp');
          }],
          // 摩西按手在约书亚头上
          [16.5, () => {
            for (let i = 0; i < 5; i++) { glow('d' + i, 0.25); walk('d' + i, 0.45 + i * 0.013, { speed: 0.025 }); }
            walk('joshua', X.tab - 0.05, { speed: 0.035, pose: 'kneel' });
            face('joshua', -1);
            walk('moses', X.tab - 0.065, { speed: 0.03 }); face('moses', 1);
          }],
          [21, b => { pose('moses', 'raise'); flash(b, { type: 'lay', dur: 5 }); glow('joshua', 0.7); sfx(b, 'angel', { soft: true }); }],
          [25, b => { pose('moses', 'stand'); pose('joshua', 'stand'); walk('joshua', X.joshua, { speed: 0.03 }); walk('moses', X.moses, { speed: 0.03 }); walk('eleazar', X.aaron, { speed: 0.03 }); W.goTo(0.76, 6, b.instant); }],
          // 黄昏的燔祭
          [27, b => { prop('tab', null, { fire: 1 }); sfx(b, 'fire', { soft: true }); }],
        ]);
      },
    },

    // ── 29–32 章：七月初一吹角；许愿；米甸；吕便、迦得的牲畜 ────────────
    {
      kind: 'cmd', utter: '是你们当守为吹角的日子', cmd: 'cron "七月初一" --blow 角', ref: '29:1',
      verse: [
        { text: '「七月初一日，你们当有圣会；什么劳碌的工都不可做，<br>是你们当守为吹角的日子。」', ref: '民数记 29:1', hold: 6 },
        { text: '人若向耶和华许愿或起誓，要约束自己，就不可食言，<br>必要按口中所出的一切话行。', ref: '民数记 30:2', hold: 6 },
        { text: '耶和华吩咐摩西说：「你要在米甸人身上报以色列人的仇，<br>后来要归到你列祖那里。」', ref: '民数记 31:1–2', hold: 6 },
        { text: '吕便子孙和迦得子孙的牲畜极其众多；<br>他们看见雅谢地和基列地是可牧放牲畜之地。', ref: '民数记 32:1', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { prop('tab', null, { fire: 0.6 }); W.goTo(0.84, 5, b.instant); folkFace(X.tab); }],
          // 吹角
          [2, b => {
            if (!has('ithamar')) add('ithamar', { label: '以他玛', sex: 'm', age: 'adult', x: X.ithamar, v: 0.3, facing: -1, robe: ROBE.ithamar, glow: 0.15 });
            pose('eleazar', 'raise'); pose('ithamar', 'raise');
            flash(b, { type: 'trump', xf: X.aaron, v: 0.34, dur: 4 }); sfx(b, 'trumpet', { x: X.aaron });
            TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 1 }));
          }],
          [4, b => { flash(b, { type: 'trump', xf: X.ithamar, v: 0.3, dur: 4 }); sfx(b, 'trumpet', { x: X.ithamar }); folkPose('raise'); }],
          [7, () => { pose('eleazar', 'stand'); pose('ithamar', 'stand'); folkPose('kneel'); TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 0 })); }],
          // 许愿
          [10, b => { folkPose('pray'); sfx(b, 'harp', { soft: true }); }],
          // 后来要归到你列祖那里：摩西独自站着
          [13.5, b => {
            folkPose('stand');
            walk('moses', X.tab - 0.1, { speed: 0.02 }); face('moses', 1);
            pose('moses', 'gaze');
            glow('moses', 0.8);
            W.goTo(0.32, 8, b.instant);
          }],
          [19, () => { glow('moses', 0.5); walk('moses', X.moses, { speed: 0.02 }); }],
          // 吕便、迦得的牲畜极其众多：东边（左）的草场
          [20, b => {
            W.set('grass', 0.75, b.instant);
            herd('herdR', { kind: 'cow', n: 4, x0: 0.39, x1: 0.46, layer: 2, label: '吕便子孙的牲畜', v: 0.62 });
            herd('herdG', { kind: 'sheep', n: 6, x0: 0.37, x1: 0.47, layer: 2, label: '迦得子孙的羊群', v: 0.86 });
            herd('herdG2', { kind: 'goat', n: 3, x0: 0.42, x1: 0.48, layer: 2, label: '迦得子孙的羊群', v: 0.4 });
            sfx(b, 'cow'); sfx(b, 'bleat');
          }],
        ]);
      },
    },

    // ── 33–36 章：四十二站的路程；四境；逃城；「我耶和华住在以色列人中间」 ─
    {
      kind: 'promise', utter: '我耶和华住在以色列人中间', cmd: 'git log --stations 42 && dwell 耶和华 --among 以色列', ref: '35:34',
      verse: [
        { text: '以色列人按着军队，在摩西、亚伦的手下出埃及地所行的路程记在下面。<br>摩西遵着耶和华的吩咐记载他们所行的路程……', ref: '民数记 33:1–2', hold: 7 },
        { text: '「你们到了迦南地，就是归你们为业的迦南四境之地……<br>这界要下到约旦河，通到盐海为止。这四围的边界以内，要作你们的地。」', ref: '民数记 34:2–12', hold: 7 },
        { text: '「你们过约旦河，进了迦南地，就要分出几座城，为你们作逃城，<br>使误杀人的可以逃到那里。」', ref: '民数记 35:10–11', hold: 6.5 },
        { text: '这是耶和华在摩押平原约旦河边、耶利哥对面<br>藉着摩西所吩咐以色列人的命令典章。', ref: '民数记 36:13', hold: 7 },
      ],
      apply(c) {
        const REF = [[0.44, 0, 0, 0.9], [0.56, 0, 0, 0.9], [0.62, 1, 0.35, 0.9], [0.9, 1, 0.1, 0.9], [0.84, 0, 0, 0.9], [0.97, 0, 0, 0.9]];
        T(c, [
          [0.2, b => { W.goTo(0.74, 26, b.instant); W.set('nmPath', 1, b.instant); folkFace(0.2); sfx(b, 'stars', { soft: true }); }],
          [8, b => { W.set('nmBorder', 1, b.instant); folkFace(0.9); sfx(b, 'harp', { soft: true }); }],
          ...REF.map((q, i) => [15.5 + i * 0.7, b => {
            prop('ref' + i, 'refuge', { x: q[0], layer: q[1], v: q[2], size: q[3], grow: 1, lit: 1, label: '逃城' });
            sfx(b, 'chime', { soft: true, x: q[0] });
          }]),
          // 我耶和华住在以色列人中间
          [21.5, b => {
            W.set('nmDwell', 1, b.instant);
            glory(b, { big: 0.9, dur: 7, soft: 1 });
            TRIBES.forEach((tr, i) => prop('bn' + i, null, { lit: 1 }));
            prop('tab', null, { lit: 1, glow: 0.6 });
            folkFace(X.tab); folkPose('kneel');
            pose('moses', 'raise');
            sfx(b, 'angel');
          }],
          [27, () => { pose('moses', 'stand'); }],
        ]);
      },
    },
  ];
  // 何珥山之后：摩西、以利亚撒（穿着圣衣）与约书亚回到会幕东边
  function eastFrontAdd() {
    if (!has('moses')) add('moses', { label: '摩西', sex: 'm', age: 'elder', x: X.moses, v: 0.34, facing: -1, robe: ROBE.moses, glow: 0.5, prop: 'staff' });
    if (!has('eleazar')) add('eleazar', { label: '以利亚撒', sex: 'm', age: 'adult', x: X.aaron, v: 0.3, facing: -1, robe: ROBE.aaron, accent: PRIEST_ACC, glow: 0.25 });
    if (!has('joshua')) add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: X.joshua, v: 0.4, facing: -1, robe: ROBE.joshua, glow: 0.3 });
    if (!has('caleb')) add('caleb', { label: '迦勒', sex: 'm', age: 'elder', x: X.caleb, v: 0.44, facing: 1, robe: ROBE.caleb, glow: 0.3 });
    place('moses', X.moses); place('eleazar', X.aaron); place('joshua', X.joshua); place('caleb', X.caleb);
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '民数记', books: [4], title: '旷野', sub: '民数记 1 — 36', tint: [255, 220, 170], music: 'abraham',
    outro: 18,
    intro: [
      { text: '以色列人出埃及地后，第二年二月初一日，耶和华在西奈的旷野、会幕中晓谕摩西说：<br>「你要按以色列全会众的家室、宗族、人名的数目计算所有的男丁。」', ref: '民数记 1:1–2', hold: 8 },
      { text: '这样，凡以色列人中被数的，照着宗族，从二十岁以外，能出去打仗、被数的，<br>共有六十万零三千五百五十名。', ref: '民数记 1:45', hold: 7 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: Object.assign({
      '摩西': { text: '摩西为人极其谦和，胜过世上的众人。', ref: '民数记 12:3' },
      '亚伦': { text: '他站在活人死人中间，瘟疫就止住了。', ref: '民数记 16:48' },
      '米利暗': { text: '米利暗死在那里，就葬在那里。', ref: '民数记 20:1' },
      '米利暗的坟': { text: '正月间，以色列全会众到了寻的旷野，就住在加低斯。<br>米利暗死在那里，就葬在那里。', ref: '民数记 20:1' },
      '约书亚': { text: '耶和华对摩西说：「嫩的儿子约书亚是心中有圣灵的；<br>你将他领来，按手在他头上。」', ref: '民数记 27:18' },
      '迦勒': { text: '惟独我的仆人迦勒，因他另有一个心志，专一跟从我，<br>我就把他领进他所去过的那地；他的后裔也必得那地为业。', ref: '民数记 14:24' },
      '以利亚撒': { text: '摩西把亚伦的圣衣脱下来，给他的儿子以利亚撒穿上，<br>亚伦就死在山顶那里。', ref: '民数记 20:28' },
      '会幕': { text: '立起帐幕的那日，有云彩遮盖帐幕，就是法柜的帐幕；<br>从晚上到早晨，云彩在其上，形状如火。', ref: '民数记 9:15' },
      '云柱': { text: '云彩停留在帐幕上，无论是两天，是一月，是一年，以色列人就住营不起行；<br>但云彩收上去，他们就起行。', ref: '民数记 9:22' },
      '约柜': { text: '约柜往前行的时候，摩西就说：「耶和华啊，求你兴起！<br>愿你的仇敌四散！愿恨你的人从你面前逃跑！」', ref: '民数记 10:35' },
      '一挂葡萄': { text: '他们到了以实各谷，从那里砍了葡萄树的一枝，上头有一挂葡萄，<br>两个人用杠抬着，又带了些石榴和无花果来。', ref: '民数记 13:23' },
      '亚伦的杖': { text: '谁知利未族亚伦的杖已经发了芽，<br>生了花苞，开了花，结了熟杏。', ref: '民数记 17:8' },
      '十二根杖': { text: '后来我所拣选的那人，他的杖必发芽。', ref: '民数记 17:5' },
      '磐石': { text: '这水名叫米利巴水，是因以色列人向耶和华争闹，<br>耶和华就在他们面前显为圣。', ref: '民数记 20:13' },
      '何珥山': { text: '以色列全会众从加低斯起行，到了何珥山。', ref: '民数记 20:22' },
      '西奈山': { text: '耶和华在西奈山晓谕摩西的日子，亚伦和摩西的后代如下：', ref: '民数记 3:1' },
      '毗珥山顶': { text: '巴勒就领巴兰到那下望旷野的毗珥顶上。', ref: '民数记 23:28' },
      '铜蛇': { text: '摩西便制造一条铜蛇，挂在杆子上；<br>凡被蛇咬的，一望这铜蛇就活了。', ref: '民数记 21:9' },
      '井': { text: '当时，以色列人唱歌说：井啊，涌上水来！你们要向这井歌唱。', ref: '民数记 21:17' },
      '巴兰': { text: '巴兰说：「……神将什么话传给我，我就说什么。」', ref: '民数记 22:38' },
      '驴': { text: '驴对巴兰说：「我不是你从小时直到今日所骑的驴吗？」', ref: '民数记 22:30' },
      '耶和华的使者': { text: '耶和华的使者站在路上敌挡他。', ref: '民数记 22:22' },
      '星': { text: '有星要出于雅各，有杖要兴于以色列。', ref: '民数记 24:17' },
      '约旦河': { text: '以色列人起行，在摩押平原、约旦河东，对着耶利哥安营。', ref: '民数记 22:1' },
      '耶利哥': { text: '他们在摩押平原与耶利哥相对的约旦河边数点以色列人。', ref: '民数记 26:63' },
      '玛拉': { text: '西罗非哈的女儿说得有理。', ref: '民数记 27:7' },
      '挪阿': { text: '西罗非哈的女儿说得有理。', ref: '民数记 27:7' },
      '曷拉': { text: '西罗非哈的女儿说得有理。', ref: '民数记 27:7' },
      '密迦': { text: '西罗非哈的女儿说得有理。', ref: '民数记 27:7' },
      '得撒': { text: '西罗非哈的女儿说得有理。', ref: '民数记 27:7' },
      '逃城': { text: '在约旦河东要分出三座城，在迦南地也要分出三座城，都作逃城。', ref: '民数记 35:14' },
      '利未人': { text: '「我从以色列人中拣选了利未人，代替以色列人一切头生的；利未人要归我。」', ref: '民数记 3:12' },
      '以色列人': { text: '以色列人就这样行。凡耶和华所吩咐摩西的，他们就照样行了。', ref: '民数记 1:54' },
      '探子': { text: '过了四十天，他们窥探那地才回来，', ref: '民数记 13:25' },
      '哥辖的子孙': { text: '将要起营的时候，亚伦和他儿子把圣所和圣所的一切器具遮盖完了，<br>哥辖的子孙就要来抬，只是不可摸圣物，免得他们死亡。', ref: '民数记 4:15' },
      '纯红的母牛': { text: '「……你要吩咐以色列人，把一只没有残疾、未曾负轭、纯红的母牛牵到你这里来。」', ref: '民数记 19:2' },
      '葡萄园': { text: '耶和华的使者就站在葡萄园的窄路上；这边有墙，那边也有墙。', ref: '民数记 22:24' },
      '巴勒': { text: '巴勒就领巴兰到那下望旷野的毗珥顶上。', ref: '民数记 23:28' },
      '可拉一党': { text: '摩西刚说完了这一切话，他们脚下的地就开了口，', ref: '民数记 16:31' },
      '吕便子孙的牲畜': { text: '吕便子孙和迦得子孙的牲畜极其众多；<br>他们看见雅谢地和基列地是可牧放牲畜之地。', ref: '民数记 32:1' },
      '迦得子孙的羊群': { text: '吕便子孙和迦得子孙的牲畜极其众多；<br>他们看见雅谢地和基列地是可牧放牲畜之地。', ref: '民数记 32:1' },
      '以他玛': { text: '「你要用银子做两枝号，都要锤出来的，用以招聚会众，并叫众营起行。」', ref: '民数记 10:2' },
    }, (function () {
      const o = {};
      const T3 = {
        judah: '在东边，向日出之地，照着军队安营的是犹大营的纛。', issachar: '挨着他安营的是以萨迦支派。', zebulun: '又有西布伦支派。',
        reuben: '在南边，按着军队是吕便营的纛。', simeon: '挨着他安营的是西缅支派。', gad: '又有迦得支派。',
        ephraim: '在西边，按着军队是以法莲营的纛。', manasseh: '挨着他的是玛拿西支派。', benjamin: '又有便雅悯支派。',
        dan: '在北边，按着军队是但营的纛。', asher: '挨着他安营的是亚设支派。', naphtali: '又有拿弗他利支派。',
      };
      TRIBES.forEach(tr => { o[tr.cn + '的纛'] = { text: T3[tr.id], ref: '民数记 ' + tr.ref }; });
      return o;
    })()),
  });
})(window.GS);
