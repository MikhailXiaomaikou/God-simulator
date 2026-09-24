/* ─────────────────────────────────────────────────────────────
 * book/david.js —— 卷 · 大卫（撒母耳记上 16 — 31）
 *
 * 撒母耳带着盛满膏油的角到伯利恒；耶西的七个儿子从他面前经过——「人是看外貌；耶和华是看内心」；
 * 放羊的小儿子被叫回来，在他诸兄中受膏，耶和华的灵大大感动他；耶和华的灵离开扫罗，大卫弹琴，恶魔离了他；
 * 以拉谷：两山之间的溪，歌利亚骂阵四十日，少年人挑了五块光滑石子，「我来攻击你，是靠着万军之耶和华的名」——
 * 机弦一甩，石子进入额内（本卷的标志）；约拿单的外袍与盟约，妇女们唱和「千千」「万万」，扫罗怒视；
 * 墙上的枪，以色磐石旁的三枝箭，二人彼此哭泣；挪伯的刀，亚杜兰洞里的四百人，神却不将大卫交在扫罗手里；
 * 隐基底的洞中割下的衣襟；撒母耳死了；亚比该与她的驴，「你的性命……如包裹宝器一样」；
 * 哈基拉山的夜里，耶和华使他们沉沉地睡了，大卫拿了枪和水瓶；洗革拉被焚，「你可以追，必追得上，都救得回来」；
 * 基利波：神不回答扫罗，国权赐与别人；扫罗和他三个儿子一同死亡；雅比的勇士走了一夜，把骸骨葬在垂丝柳树下。
 *
 * 本卷的布景（自画）：伯利恒的小城、坛、垂丝柳树与石座、以拉谷的溪与两军的帐棚、扫罗的房、以色磐石、
 * 亚杜兰洞 / 隐基底的洞（一片石崖）、橄榄树、拿八剪羊毛的帐棚、营中的火、洗革拉、书念的营火、雅比的坟。
 * 人身上的器物也是自画的：扫罗的枪与冠冕、歌利亚的铜盔与机轴一般的枪、拿盾牌的人的盾、约拿单的弓、大卫的琴与机弦。
 * 经文在左边的海上，故一切要紧的事都在 x ≥ 0.5 的地上发生；一切位置以画面宽度的比例记下；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'david';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时对齐）───────────────────
  W.defineLevel('dvDark', 'exp', 0.45);     // 有恶魔从耶和华那里来扰乱扫罗（16:14；18:10；19:9）
  W.defineLevel('dvVeil', 'exp', 0.4);      // 神却不将大卫交在他手里（23:14）：遮护山寨的光
  W.defineLevel('dvSleep', 'exp', 0.35);    // 耶和华使他们沉沉地睡了（26:12）
  W.defineLevel('dvSilence', 'exp', 0.3);   // 耶和华却不回答他（28:6）
  W.defineLevel('dvShunem', 'exp', 0.5);    // 书念的营火（28:4）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 伯利恒（16）
    beth: 0.888, altar: 0.548, samuel: 0.6, before: 0.638, anoint: 0.615, jesse: 0.684, field: 0.8,
    queue: [0.722, 0.743, 0.764, 0.785, 0.806, 0.827, 0.848],
    left: [0.532, 0.519, 0.506, 0.493, 0.48, 0.467, 0.455],
    // 基比亚（16:14–23；18；19:9–10）
    tam: 0.752, seat: 0.778, harp: 0.72, house: 0.655,
    // 以拉谷（17）
    brook: 0.748, g0: 0.548, g1: 0.603, g2: 0.623, g3: 0.634, saulE: 0.905, jonE: 0.93,
    // 以色磐石（20）
    ezel: 0.618,
    // 亚杜兰洞 / 隐基底的洞（22–24）
    cave: 0.672,
    // 迦密（25）
    shear: 0.935,
    // 哈基拉山（26）
    bed: 0.762, spear: 0.779, jar: 0.746, abner: 0.797, hill: 0.936,
    // 洗革拉（27；30）
    ziklag: 0.872,
    // 基利波（28；31）与雅比的垂丝柳树
    gil: 0.84, tamJ: 0.622, mound: 0.604,
  };
  const ROBE = {
    david: [150, 118, 80], royal: [92, 86, 152], jonathanT: [178, 160, 128], saul: [134, 58, 70], samuel: [212, 204, 186], jesse: [150, 130, 98],
    b1: [124, 96, 70], b2: [112, 102, 84], b3: [132, 108, 78], b4: [104, 92, 78], b5: [138, 116, 90], b6: [116, 100, 92], b7: [126, 110, 96],
    goliath: [124, 100, 62], bearer: [112, 96, 80], young: [150, 132, 104], lad: [176, 156, 124], priest: [234, 228, 210],
    abigail: [188, 112, 118], nabal: [156, 110, 58], abishai: [118, 100, 84], abner: [120, 84, 76],
    israel: [104, 100, 122], phil: [168, 104, 70], men: [118, 104, 88], saulmen: [124, 76, 72], jabesh: [112, 104, 96],
    son1: [142, 92, 92], son2: [128, 98, 112], armsman: [122, 110, 96],
  };
  const ISR_CROWDS = ['isr', 'phil', 'saulmen', 'hunt'];        // 持枪的队伍

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return {
      heart: {},                  // 心里的光（16:7）：id → 亮度
      spear: { who: 'saul', x: 0 }, // 扫罗的枪：在谁手里 / 'ground' 插在地上 / 'wall' 刺入墙内
      jar: { who: null, x: 0 },   // 扫罗头旁的水瓶（26:11）
      shield: { who: 'bearer', x: 0 }, gspear: 'goliath',
      horn: 0, pour: 0, harp: 0, play: 0, sling: 0, stones: 0, armor: 0, corner: 0, bundle: 0,
      swordD: 0, swords: 0, timbrel: 0, crown: 1, caveDeep: 0, bow: 1, gaze: 0,
    };
  }
  // 画出来的量（缓动，不属于状态）
  const E = { spearQ: 99, horn: 0, pour: 0, harp: 0, play: 0, sling: 0, stones: 0, armor: 0, corner: 0, bundle: 0, swordD: 0, swords: 0, timbrel: 0, crown: 1, caveDeep: 0, gaze: 0, heart: {} };
  const EKEYS = ['horn', 'pour', 'harp', 'play', 'sling', 'stones', 'armor', 'corner', 'bundle', 'swordD', 'swords', 'timbrel', 'crown', 'caveDeep', 'gaze'];
  function snapE() {
    for (const k of EKEYS) E[k] = S[k];
    E.spearQ = 99;
    E.heart = {};
    for (const k in S.heart) E.heart[k] = S.heart[k];
  }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
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
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const approachLin = (cur, tg, step) => (cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step));
  const appr = (cur, tg, rate, dt) => cur + (tg - cur) * (1 - Math.exp(-rate * dt));
  // 手机竖屏：地上的位置向中间收一点，免得右边的人与物被画面的边切掉（画面外的出入口不动）
  const XF = x => (W.w < 600 && x <= 1 ? 0.47 + (x - 0.47) * 0.9 : x);

  // 人物（皆经人物模块）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const has = id => { const c = C(); return c.has ? c.has(id) : !!fig(id); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const members = gid => { const c = C(); const g = c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; };
  function add(id, o) {
    const q = Object.assign({ from: W.replaying ? 'none' : 'fade' }, o);
    if (W.replaying) q.from = 'none';
    if (o.x != null) q.x = XF(o.x);
    const existed = !!fig(id);
    const r = C().add(id, q);
    // 已在场上（也许正走着、正淡出）：就在所给之处站定
    if (existed && o.x != null) { C().place(id, q.x, o.layer); if (o.pose) C().pose(id, o.pose, { stop: true }); }
    return r;
  }
  function walk(id, x, o) { if (fig(id)) C().walk(id, XF(x), o); }
  function run(id, x, o) { if (fig(id)) C().walk(id, XF(x), Object.assign({ run: true, speed: 0.085 }, o || {})); }
  function place(id, x, l) { if (fig(id)) C().place(id, XF(x), l); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id) { if (fig(id)) C().remove(id); }
  function hold(id, what) { const c = C(); if (c.prop && fig(id)) U.safe('cast.prop', () => c.prop(id, what || null)); }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function embrace(a, b, o) { const c = C(); if (c.embrace && fig(a) && fig(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function holdHands(a, b, on) { const c = C(); if (c.holdHands && fig(a) && fig(b)) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x: XF(x), layer: 2, from: W.replaying ? 'none' : 'fade' }, o || {})));
  }
  const xs = o => Object.assign({}, o, o.x0 != null ? { x0: XF(o.x0) } : null, o.x1 != null ? { x1: XF(o.x1) } : null);
  // 一群人：军兵只是成年的男子
  function crowd(gid, o, sex) {
    const c = C();
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    const ms = c.crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, xs(o))) || [];
    if (sex) for (const m of ms) {
      m.sex = sex;
      if (sex === 'm') { m.accent = null; if (m.age !== 'adult') m.age = 'adult'; }
      else if (m.age === 'elder') m.age = 'adult';
    }
    if (o.facing) for (const m of ms) { m.facing = m.fd = o.facing; }
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return;
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, xs(o))));
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, XF(x0), XF(x1), o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function cface(gid, d) {
    for (const m of members(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  function cprop(gid, kind) { for (const m of members(gid)) { m.prop = kind || null; m.propDefault = false; } }
  // 地上的走兽避开这几段（画面宽度的比例）
  function avoid(...r) { W.beastAvoid = r; }

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

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(1716); for (let i = 0; i < 512; i++) RT.push(r()); })();
  const rt = i => RT[((i % 512) + 512) % 512];

  // ════════════════════════════════════════════════════════════
  //  人身上的点：头、手、胸（按姿势，缓缓随姿势而变）
  // ════════════════════════════════════════════════════════════
  // [向前, 向上]（以身高为 1）
  const HEADO = {
    stand: [0.02, 0.97], walk: [0.04, 0.96], run: [0.1, 0.92], raise: [0.0, 0.97], gaze: [-0.02, 0.97], point: [0.03, 0.97], carry: [0.03, 0.97],
    bow: [0.33, 0.66], weep: [0.08, 0.86], kneel: [0.06, 0.73], pray: [0.13, 0.67], sit: [0.04, 0.6], seat: [0.04, 0.74],
    fall: [0.54, 0.07], lie: [-0.54, 0.07], embrace: [0.12, 0.92], wrestle: [0.2, 0.8], ride: [0.03, 0.97],
  };
  const HANDO = {
    stand: [0.13, 0.47], walk: [0.12, 0.47], run: [0.22, 0.52], raise: [0.06, 1.1], gaze: [0.12, 0.47], point: [0.44, 0.64], carry: [0.2, 0.55],
    bow: [0.3, 0.36], weep: [0.1, 0.78], kneel: [0.2, 0.36], pray: [0.22, 0.56], sit: [0.22, 0.3], seat: [0.24, 0.44],
    fall: [0.78, 0.05], lie: [0.02, 0.1], embrace: [0.26, 0.66], wrestle: [0.3, 0.6], ride: [0.16, 0.6],
  };
  const ANC = new Map();
  function ancT(f) {
    const hp = HEADO[f.pose] || HEADO.stand, hd = HANDO[f.pose] || HANDO.stand;
    return [hp[0], hp[1], hd[0], hd[1]];
  }
  function ancStep(dt) {
    const c = C();
    if (!c || !c.people) return;
    for (const [id, f] of c.people) {
      if (f.isAnimal || f.crowd) continue;
      let a = ANC.get(id);
      const t = ancT(f);
      if (!a || W.replaying) { a = [t[0], t[1], t[2], t[3]]; ANC.set(id, a); continue; }
      const k = 1 - Math.exp(-5 * dt);
      for (let i = 0; i < 4; i++) a[i] += (t[i] - a[i]) * k;
    }
    for (const id of Array.from(ANC.keys())) if (!c.people.has(id)) ANC.delete(id);
  }
  // 人的脚下与身高：按人物模块同样的算法由 nx 求出（不依赖上一帧画出的位置）
  const AGEH = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figFoot(f) {
    if ((f.attach || f.ny != null || f.mount) && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y, f._h || 30];
    const l = f.layer == null ? 2 : f.layer, x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.v ? g + f.v * fh * 0.8 : g;
    const h = 34 * W.layerScale(l) * (AGEH[f.age] || 1) * (f.scale || 1) * (W.w < 600 ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1) * (1 + 0.35 * (f.v || 0));
    return [x, y, h];
  }
  // → { x, y（脚）, h, d（朝向 −1..1）, a（显出）, pose, head:[x,y], hand:[x,y], chest:[x,y] }
  function A(id) {
    const f = fig(id);
    if (!f || f.isAnimal || !isFinite(f.nx) || (f.alpha != null && f.alpha < 0.01)) return null;
    const ft = figFoot(f), x = ft[0], y = ft[1], h = ft[2], d = f.fd == null ? f.facing || 1 : f.fd;
    if (!isFinite(y)) return null;
    const a = ANC.get(id) || ancT(f);
    return {
      x, y, h, d, a: f.alpha == null ? 1 : f.alpha, pose: f.pose, f,
      head: [x + d * a[0] * h, y - a[1] * h], hand: [x + d * a[2] * h, y - a[3] * h],
      chest: [x + d * a[0] * h * 0.75, y - a[1] * h * 0.7],
    };
  }
  function Am(m) {         // 人群里的一个人（不缓动）
    if (!m || m.delay > 0 || !isFinite(m.nx) || (m.alpha != null && m.alpha < 0.01)) return null;
    const ft = figFoot(m), x = ft[0], y = ft[1], h = ft[2], d = m.fd == null ? m.facing || 1 : m.fd;
    if (!isFinite(y)) return null;
    const t = ancT(m);
    return { x, y, h, d, a: m.alpha == null ? 1 : m.alpha, pose: m.pose, head: [x + d * t[0] * h, y - t[1] * h], hand: [x + d * t[2] * h, y - t[3] * h] };
  }
  const UPR = { stand: 1, walk: 1, run: 1, raise: 1, gaze: 1, point: 1, carry: 1, embrace: 1, weep: 1 };

  // 名字的位置：在画面之内
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某人头上聚成几个字（微尘自 src 而来）
  function nameOver(b, id, str, rgb, o) {
    if (b.instant) return;
    o = o || {};
    const p = A(id);
    const hx = p ? p.head[0] : W.w * 0.7, hy = p ? p.head[1] : W.h * 0.7;
    const size = (o.size || 0.042) * M(), n = Array.from(str).length;
    let cy = hy - size * (o.lift || 1.2) - 6;
    if (o.sea) {
      // 写在远处的海面上（比近处的地与中景的岛深，字才显得出来）
      cy = W.horizonY + size * 0.95;
      const rg = gY(1, clamp(hx / W.w, 0, 1));
      if (rg < W.waterlineY(1) - 1) cy = Math.min(cy, rg - size * 0.8);
    }
    const c = nameAt(hx, cy, size, n);
    const k = 60 * SU();
    const src = o.src || (() => [hx + rand(-k, k), hy + rand(-k * 0.5, k * 0.6)]);
    fx().nameStr(str, c[0], c[1], size, rgb, src, { hold: o.hold || 2.6, dot: o.dot || 2, delay: o.delay });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }

  // ════════════════════════════════════════════════════════════
  //  布景：物件
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.9, fire: 0.6, lit: 0.7, grow: 0.3, ember: 0.35, dark: 0.25 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  // prop(id, kind, { x, layer, size, label, show, fire, lit, grow, ember, dark, col })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), col: null };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'size', 'label', 'col']) if (o[k] != null) p[k] = k === 'x' ? XF(o[k]) : o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (!p.model) p.model = MODEL[p.kind] ? MODEL[p.kind](p) : {};
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

  // ── 模型（与屏幕大小无关，以单位长度记）─────────────────────
  const MODEL = {
    town(p) {
      const r = U.mulberry32(p.seed * 7 + 5), hs = [], n = 9, half = 0.52;
      for (let i = 0; i < n; i++) {
        const ox = (i / (n - 1) - 0.5) * 2 * half + (r() - 0.5) * 0.05;
        hs.push({ ox, w: 0.15 + r() * 0.09, h: (0.26 + r() * 0.24) * (1 - 0.4 * Math.abs(ox) / half), win: r() < 0.8, door: r() < 0.55, tw: r() * TAU, dome: r() < 0.12, fire: r() < 0.6 });
      }
      hs.sort((a, b) => b.h - a.h);
      return { hs, half };
    },
    altar(p) {
      const r = U.mulberry32(p.seed * 131 + 7), st = [];
      [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.48 + (r() - 0.5) * 0.08, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.27 + r() * 0.06, 0.19 + r() * 0.04, (r() - 0.5) * 0.4]);
      });
      return { st };
    },
    olive(p) {
      const r = U.mulberry32(p.seed * 7919 + 13), blobs = [];
      for (let i = 0; i < 16; i++) {
        const a = Math.PI * (0.05 + 0.9 * (i / 15));
        blobs.push([-Math.cos(a) * (0.4 + r() * 0.14), -0.52 - Math.sin(a) * (0.2 + r() * 0.1) + (r() - 0.5) * 0.06, 0.1 + r() * 0.08, 0]);
      }
      for (let i = 0; i < 6; i++) blobs.push([(r() - 0.5) * 0.6, -0.58 - r() * 0.1, 0.13 + r() * 0.06, 0]);
      blobs.forEach(b => { b[3] = b[2] * (0.62 + r() * 0.16); });
      return { blobs, lean: (r() - 0.5) * 0.1, twist: 0.04 + r() * 0.05 };
    },
    tamarisk(p) {
      const r = U.mulberry32(p.seed * 31 + 3), st = [], mass = [];
      for (let i = 0; i < 64; i++) {
        const a = Math.PI * (0.08 + 0.84 * r()), rr = 0.3 + 0.2 * r();
        const x0 = -Math.cos(a) * rr * 1.25, y0 = -0.6 - Math.sin(a) * rr * 0.62;
        st.push([x0, y0, 0.16 + r() * 0.28, (r() - 0.5) * 0.12, r()]);
      }
      // 冠：几团不透明的叶簇（向光的一面亮，背光的一面暗），垂丝自簇里垂下
      for (let i = 0; i < 7; i++) { const u = i / 6 - 0.5; mass.push([u * 0.95 + (r() - 0.5) * 0.08, -0.7 - (1 - Math.abs(u) * 1.6) * 0.14 - r() * 0.05, 0.13 + r() * 0.05]); }
      return { st, mass };
    },
    cliff(p) {
      // 一片参差的石崖：左面陡，右面一级一级的石阶；洞口在中间偏左
      const r = U.mulberry32(p.seed + 101), pts = [];
      const prof = [[-1.2, 0], [-1.08, -0.14], [-1.02, -0.36], [-0.92, -0.46], [-0.86, -0.64], [-0.72, -0.7], [-0.64, -0.88], [-0.46, -0.93], [-0.3, -1.02],
        [-0.12, -0.98], [0.04, -1.05], [0.2, -0.99], [0.32, -0.9], [0.46, -0.88], [0.56, -0.74], [0.72, -0.7], [0.8, -0.55], [0.94, -0.5], [1.0, -0.32], [1.12, -0.22], [1.26, 0]];
      for (const q of prof) pts.push([q[0] + (r() - 0.5) * 0.04, q[1] + (q[1] ? (r() - 0.5) * 0.04 : 0)]);
      const ledges = [], cracks = [], rocks = [];
      for (let i = 0; i < 6; i++) ledges.push([-0.9 + r() * 1.7, 0.18 + r() * 0.3, -0.25 - r() * 0.62]);
      for (let i = 0; i < 7; i++) { const cx = -0.95 + r() * 1.9; cracks.push([cx, -0.15 - r() * 0.7, (r() - 0.5) * 0.12, 0.12 + r() * 0.2]); }
      for (const q of [[-1.3, 0.12, 0.13], [-1.12, 0.08, 0.09], [0.62, 0.1, 0.1], [1.3, 0.13, 0.12], [1.42, 0.08, 0.08]]) rocks.push(q);
      const arch = [];
      for (let i = 0; i <= 10; i++) { const t = i / 10, a = Math.PI * (1 - t); arch.push([Math.cos(a) * (1 + (r() - 0.5) * 0.08), -Math.pow(Math.sin(a), 0.8) * (1 + (r() - 0.5) * 0.08)]); }
      const bush = [[-0.62, -0.88], [-0.25, -1.0], [0.3, -0.92], [0.78, -0.62], [0.98, -0.34]];
      return { pts, ledges, cracks, rocks, arch, bush };
    },
    tent(p) { const r = U.mulberry32(p.seed + 11); return { pk: [0.9 + r() * 0.1, 0.8 + r() * 0.14, 0.95 + r() * 0.05], tilt: (r() - 0.5) * 0.06 }; },
    stream(p) {
      const r = U.mulberry32(p.seed + 3), reeds = [], wob = [];
      // 岸边的芦苇：[沿溪的位置 t, 哪一岸, 高, 斜, 几茎]
      for (let i = 0; i < 26; i++) reeds.push([0.1 + r() * 0.85, r() < 0.5 ? -1 : 1, 0.7 + r() * 0.6, (r() - 0.5) * 0.5, 2 + Math.floor(r() * 3)]);
      for (let i = 0; i < STR_N; i++) wob.push(1 + (r() - 0.5) * 0.5);
      return { reeds, wob };
    },
    mound(p) { const r = U.mulberry32(p.seed + 23), st = []; for (let i = 0; i < 7; i++) st.push([(i - 3) * 0.3 + (r() - 0.5) * 0.1, 0.15 + r() * 0.1, 0.12 + r() * 0.05]); return { st }; },
  };

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
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
      pale: radial([228, 222, 255], 1), ember: radial([255, 96, 40], 1), smoke: radial([126, 118, 112], 0.8, 0.55),
      dark: radial([10, 6, 16], 0.9, 0.5), cold: radial([190, 210, 255], 1), silver: radial([200, 214, 240], 0.9, 0.5),
    };
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 冷光柱（28:16）
    const cb = cnv(64, 256), cg = cb.getContext('2d');
    const ch = cg.createLinearGradient(0, 0, 64, 0);
    ch.addColorStop(0, 'rgba(200,214,255,0)'); ch.addColorStop(0.5, 'rgba(214,226,255,1)'); ch.addColorStop(1, 'rgba(200,214,255,0)');
    cg.fillStyle = ch; cg.fillRect(0, 0, 64, 256);
    cg.globalCompositeOperation = 'destination-in';
    cg.fillStyle = vt; cg.fillRect(0, 0, 64, 256);
    SP.coldBeam = cb;
    // 立在二人中间的光（24:12）：上下柔和
    const f = cnv(64, 256), fg = f.getContext('2d');
    const fh = fg.createLinearGradient(0, 0, 64, 0);
    fh.addColorStop(0, 'rgba(255,236,196,0)'); fh.addColorStop(0.35, 'rgba(255,238,200,0.35)'); fh.addColorStop(0.5, 'rgba(255,248,230,1)');
    fh.addColorStop(0.65, 'rgba(255,238,200,0.35)'); fh.addColorStop(1, 'rgba(255,236,196,0)');
    fg.fillStyle = fh; fg.fillRect(0, 0, 64, 256);
    fg.globalCompositeOperation = 'destination-in';
    const fv = fg.createLinearGradient(0, 0, 0, 256);
    fv.addColorStop(0, 'rgba(0,0,0,0)'); fv.addColorStop(0.2, 'rgba(0,0,0,0.8)'); fv.addColorStop(0.85, 'rgba(0,0,0,0.9)'); fv.addColorStop(1, 'rgba(0,0,0,0)');
    fg.fillStyle = fv; fg.fillRect(0, 0, 64, 256);
    SP.pillar = f;
    return SP;
  }
  function glowAt(ctx, spr, x, y, r, a) {
    if (a < 0.004 || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  画：火与烟
  // ════════════════════════════════════════════════════════════
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    const g = h * 4.2;
    ctx.globalAlpha = k * (0.3 + 0.45 * nightK());
    ctx.drawImage(SP.warm, x - g / 2, y - h * 0.45 - g / 2, g, g);
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
  function smoke(ctx, x, y, k, H, w, seed, rate, dark) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 11, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.6 : 0.42) * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(dark ? SP.dark : SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：物件
  // ════════════════════════════════════════════════════════════
  // 小城（伯利恒、洗革拉）：平顶的石屋依着山坡；夜里有窗光；被火焚烧（30:1）
  function drawTown(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, u = 64 * s, x = p.x * W.w, m = p.model;
    const burnt = p.dark;
    const body = U.mixRGB([200, 182, 150], [70, 58, 52], burnt * 0.75), side = U.mixRGB([156, 136, 108], [48, 40, 38], burnt * 0.75);
    const lx = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    const wins = [], tops = [];
    for (const hs of m.hs) {
      const hx = x + hs.ox * u, g = gY(l, hx / W.w) + 3 * s, hh = hs.h * u, ww = hs.w * u;
      ctx.fillStyle = css(body, l);
      ctx.fillRect(hx - ww / 2, g - hh, ww, hh + 2 * s);
      if (hs.dome) { ctx.beginPath(); ctx.ellipse(hx, g - hh, ww * 0.34, ww * 0.26, 0, Math.PI, 0); ctx.fill(); }
      // 背光的一面
      ctx.fillStyle = css(side, l, 0.85);
      ctx.fillRect(lx > 0 ? hx - ww / 2 : hx + ww * 0.22, g - hh, ww * 0.28, hh + 2 * s);
      // 屋顶的矮墙
      ctx.fillStyle = css(U.mixRGB(side, [60, 50, 44], 0.3), l, 0.9);
      ctx.fillRect(hx - ww / 2 - 0.6 * s, g - hh - 1.6 * s, ww + 1.2 * s, 1.8 * s);
      // 迎光的边
      ctx.fillStyle = css([236, 222, 196], l, 0.4 * (0.25 + 0.75 * W.daylight) * (1 - burnt * 0.7), 0.25);
      ctx.fillRect(lx > 0 ? hx + ww / 2 - 1.1 * s : hx - ww / 2, g - hh - 1.6 * s, 1.1 * s, hh);
      if (hs.door) {
        ctx.fillStyle = css([34, 26, 22], l);
        const dw = Math.min(ww * 0.28, 4 * s), dh = Math.min(hh * 0.45, 7 * s), dx = hx + (hs.ox > 0 ? -1 : 1) * ww * 0.12;
        ctx.beginPath(); ctx.moveTo(dx - dw / 2, g + 1); ctx.lineTo(dx - dw / 2, g - dh * 0.7); ctx.quadraticCurveTo(dx, g - dh * 1.05, dx + dw / 2, g - dh * 0.7); ctx.lineTo(dx + dw / 2, g + 1); ctx.closePath(); ctx.fill();
      }
      if (hs.win) wins.push([hx + ww * 0.12, g - hh * 0.62, hs.tw]);
      if (hs.fire) tops.push([hx, g - hh, ww, hs.tw]);
    }
    // 窗
    const nk = nightK() * (1 - burnt);
    const ws = Math.max(1, 2.1 * s);
    ctx.fillStyle = css([40, 32, 28], l, 0.8);
    for (const w of wins) ctx.fillRect(w[0] - ws / 2, w[1], ws, ws * 1.3);
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,182,100)';
      for (const w of wins) {
        ctx.globalAlpha = p.a * nk * (0.55 + 0.35 * Math.sin(W.t * 0.8 + w[2]));
        ctx.fillRect(w[0] - ws / 2, w[1], ws, ws * 1.3);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    // 火：屋顶上的火焰与浓烟
    if (p.ember > 0.01) {
      SP || sprites();
      const k = p.ember * p.a;
      ctx.globalCompositeOperation = 'lighter';
      const g0 = u * (1.6 + 0.5 * k);
      ctx.globalAlpha = k * (0.35 + 0.12 * Math.sin(W.t * 3 + p.seed));
      ctx.drawImage(SP.ember, x - g0 / 2, gY(l, p.x) - u * 0.25 - g0 / 2, g0, g0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (let i = 0; i < tops.length; i++) {
        const q = tops[i];
        flame(ctx, q[0], q[1], (10 + 8 * rt(i + 7)) * s * clamp(k * 1.4 - rt(i) * 0.4, 0, 1), k, p.seed + i);
      }
      smoke(ctx, x - u * 0.15, gY(l, p.x) - u * 0.4, k, W.h * 0.45, 22 * s, p.seed, 0.06, true);
      smoke(ctx, x + u * 0.2, gY(l, p.x) - u * 0.3, k * 0.8, W.h * 0.36, 16 * s, p.seed + 3, 0.07, true);
    }
  }

  // 扫罗的房（19:9–12）：两层的石屋，楼上有窗
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, g = gY(l, p.x) + 3 * s;
    const w = 34 * s, h = 46 * s, lx = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([188, 170, 140], l);
    ctx.fillRect(x - w / 2, g - h, w, h + 2 * s);
    ctx.fillStyle = css([144, 124, 98], l, 0.85);
    ctx.fillRect(lx > 0 ? x - w / 2 : x + w * 0.2, g - h, w * 0.3, h + 2 * s);
    ctx.fillStyle = css([112, 96, 80], l, 0.9);
    ctx.fillRect(x - w / 2 - s, g - h - 2.2 * s, w + 2 * s, 2.4 * s);
    // 石缝
    ctx.strokeStyle = css([120, 104, 86], l, 0.35); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let i = 1; i < 6; i++) { const yy = g - h * i / 6; ctx.moveTo(x - w / 2, yy); ctx.lineTo(x + w / 2, yy); }
    ctx.stroke();
    // 门与窗
    ctx.fillStyle = css([30, 24, 20], l);
    ctx.fillRect(x - 3.5 * s, g - 11 * s, 7 * s, 11 * s + 1);
    const wx = x + w * 0.18, wy = g - h * 0.78;
    ctx.fillRect(wx - 3.2 * s, wy, 6.4 * s, 7 * s);
    const lamp = nightK();
    if (lamp > 0.05) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * lamp * 0.75;
      ctx.fillStyle = 'rgb(255,190,110)';
      ctx.fillRect(wx - 3.2 * s, wy, 6.4 * s, 7 * s);
      glowAt(ctx, SP.warm, wx, wy + 3.5 * s, 18 * s, p.a * lamp * 0.45);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = p.a * 0.5;
    ctx.fillStyle = css([236, 222, 196], l, 0.6 * (0.25 + 0.75 * W.daylight), 0.25);
    ctx.fillRect(lx > 0 ? x + w / 2 - 1.2 * s : x - w / 2, g - h - 2 * s, 1.2 * s, h);
    ctx.globalAlpha = 1;
  }

  function drawAltar(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, u = 12 * s, m = p.model, n = m.st.length;
    const shown = p.grow * n;
    if (shown <= 0.01) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.beginPath();
    for (let i = 0; i < n && i < shown; i++) {
      const q = m.st[i], k = clamp(shown - i, 0, 1);
      const cx = x + q[0] * u, cy = y + q[1] * u - (1 - k) * 6 * s;
      ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * k, q[4], 0, TAU);
    }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([210, 196, 170], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.beginPath();
    for (let i = 0; i < n && i < shown - 0.5; i++) {
      const q = m.st[i], cx = x + q[0] * u + d * q[2] * u * 0.25, cy = y + q[1] * u - q[3] * u * 0.35;
      ctx.moveTo(cx + q[2] * u * 0.55, cy); ctx.ellipse(cx, cy, q[2] * u * 0.55, q[3] * u * 0.4, q[4], 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    const top = y - 0.98 * u;
    if (p.fire > 0.01) {
      smoke(ctx, x, top - 6 * s, p.fire * p.a, 150 * s + W.h * 0.12, 7 * s, p.seed, 0.07);
      flame(ctx, x, top + 1 * s, 12 * s, p.fire * p.a, p.seed);
    }
  }

  // 橄榄树：扭曲的干，银绿的冠
  function drawOlive(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, H = 70 * s, x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
    const sway = W.wind * 0.01 * H + Math.sin(W.t * 0.6 + p.seed) * 0.004 * H;
    ctx.globalAlpha = p.a;
    const trunk = css([74, 62, 50], l);
    ctx.fillStyle = trunk;
    ctx.beginPath();
    ctx.moveTo(x - 0.09 * H, y);
    ctx.bezierCurveTo(x - 0.02 * H, y - 0.15 * H, x - 0.1 * H + m.lean * H, y - 0.3 * H, x - 0.04 * H + m.lean * H, y - 0.5 * H);
    ctx.lineTo(x + 0.03 * H + m.lean * H, y - 0.5 * H);
    ctx.bezierCurveTo(x + m.twist * H, y - 0.3 * H, x + 0.02 * H, y - 0.14 * H, x + 0.1 * H, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([82, 102, 76], l);
    ctx.beginPath();
    for (const b of m.blobs) { const cx = x + b[0] * H + sway, cy = y + b[1] * H; ctx.moveTo(cx + b[2] * H, cy); ctx.ellipse(cx, cy, b[2] * H, b[3] * H, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([150, 166, 134], l, 0.5 * (0.2 + 0.8 * W.daylight), 0.1);
    ctx.beginPath();
    for (let i = 0; i < m.blobs.length; i++) {
      const b = m.blobs[i];
      if (b[0] * d < -0.06 || i % 2) continue;
      const cx = x + b[0] * H + sway + d * b[2] * H * 0.3, cy = y + b[1] * H - b[3] * H * 0.3;
      ctx.moveTo(cx + b[2] * 0.6 * H, cy); ctx.ellipse(cx, cy, b[2] * H * 0.6, b[3] * H * 0.46, 0, 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 垂丝柳树（22:6；31:13）：短而多分叉的干，冠上垂下千万细枝
  function drawTamarisk(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, H = 96 * s, x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
    const sway = W.wind * 0.012 * H;
    ctx.globalAlpha = p.a;
    const trunk = css([70, 56, 44], l);
    ctx.strokeStyle = trunk; ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.5, 0.07 * H);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 0.03 * H, y - 0.2 * H, x + 0.01 * H, y - 0.38 * H); ctx.stroke();
    ctx.lineWidth = Math.max(1, 0.035 * H);
    ctx.beginPath();
    for (const q of [[-0.34, -0.66], [-0.08, -0.8], [0.22, -0.74], [0.4, -0.6]]) { ctx.moveTo(x + 0.01 * H, y - 0.36 * H); ctx.quadraticCurveTo(x + q[0] * 0.4 * H, y - 0.5 * H, x + q[0] * H + sway * 0.4, y + q[1] * H); }
    ctx.stroke();
    // 冠的体：背光的暗色，再是向光一面的亮色
    const dL = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([70, 86, 66], l);
    ctx.beginPath();
    for (const q of m.mass) { const cx = x + q[0] * H + sway * 0.6, cy = y + q[1] * H; ctx.moveTo(cx + q[2] * H, cy); ctx.ellipse(cx, cy, q[2] * H, q[2] * H * 0.62, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css([104, 124, 94], l, 1, 0.05);
    ctx.beginPath();
    for (const q of m.mass) {
      const rr = q[2] * H * 0.68, cx = x + q[0] * H + sway * 0.6 + dL * q[2] * H * 0.26, cy = y + q[1] * H - q[2] * H * 0.16;
      ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 0.56, 0, 0, TAU);
    }
    ctx.fill();
    // 垂丝
    const col = [118, 136, 108];
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass ? css([164, 182, 150], l, 0.55 * (0.25 + 0.75 * W.daylight), 0.15) : css(col, l, 0.9);
      ctx.lineWidth = Math.max(0.6, (pass ? 0.8 : 1.2) * s);
      ctx.beginPath();
      const d = litX() >= x ? 1 : -1;
      for (let i = pass; i < m.st.length; i += pass ? 3 : 1) {
        const q = m.st[i];
        if (pass && q[0] * d < 0) continue;
        const x0 = x + q[0] * H + sway * 0.7, y0 = y + q[1] * H, len = q[2] * H;
        const sw = sway * (0.5 + q[4]) + Math.sin(W.t * 0.9 + i) * 0.012 * H;
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(x0 + q[3] * H, y0 + len * 0.5, x0 + q[3] * H * 0.5 + sw, y0 + len);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 石座（扫罗坐在垂丝柳树下）
  // 座面的高与人物模块里「坐在座上」的髋同高（髋高 0.27 身高；扫罗的身量 1.08）
  function drawSeat(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, g = gY(l, p.x), y = g + 2 * s;
    const hs = 34 * W.layerScale(l) * 1.08 * (W.w < 600 ? 1.4 : 1) * 1.3, top = g - 0.235 * hs, hw = 0.2 * hs;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([124, 112, 98], l);
    ctx.beginPath();
    ctx.moveTo(x - hw, y); ctx.lineTo(x - hw * 0.94, top + 0.1 * (y - top)); ctx.quadraticCurveTo(x, top - 0.08 * (y - top), x + hw * 0.94, top + 0.1 * (y - top)); ctx.lineTo(x + hw, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([220, 206, 180], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.fillRect(x - hw * 0.94, top, hw * 1.88, 1.1 * s);
    ctx.globalAlpha = 1;
  }

  // 帐棚：以色列人黑山羊毛的帐棚 / 非利士人色浅的帐棚
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, hw = 26 * s, h = 20 * s, m = p.model, k = m.pk;
    const col = p.col || [54, 44, 40];
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k[0] * h * 0.86); ctx.lineTo(x - 1.38 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k[2] * h * 0.84); ctx.lineTo(x + 1.36 * hw, y);
    ctx.stroke();
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k[0]], [-0.3, -0.74], [0.02, -1.0 * k[1] - 0.06], [0.32, -0.76], [0.62, -0.86 * k[2]], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css(col, l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * m.tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    const dw = 0.2 * hw, dh = 0.62 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    const lamp = clamp(nightK() * 1.05, 0, 1) * 0.8 + p.lit;
    if (lamp > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + p.seed);
      ctx.globalAlpha = p.a * Math.min(1, lamp) * fl * 0.55;
      ctx.fillStyle = p.lit > 0.3 ? 'rgb(255,206,130)' : 'rgb(255,160,84)';
      ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
      glowAt(ctx, SP.warm, dx, y - dh * 0.5, hw * (1 + p.lit * 1.1), p.a * Math.min(1, lamp) * fl * (0.5 + 0.3 * p.lit));
      ctx.globalCompositeOperation = 'source-over';
    }
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css(U.mixRGB(col, [236, 214, 180], 0.6), l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let i = k0; i <= k1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * m.tilt) * hw, Y1 = y + q[1] * h; if (i === k0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 以拉谷的溪（17:40）
  const STR_N = 20, STR_C = new Float32Array(STR_N * 2), STR_L = new Float32Array(STR_N * 2), STR_R = new Float32Array(STR_N * 2);
  function streamGeom(p) {
    const s = LS(2), x0 = p.x * W.w, y0 = gY(2, p.x) + 1, x1 = x0 - 0.05 * W.w, y1 = W.h + 6;
    const c1x = x0 + 0.03 * W.w, c1y = lerp(y0, y1, 0.35), c2x = x1 - 0.035 * W.w, c2y = lerp(y0, y1, 0.72);
    for (let i = 0; i < STR_N; i++) {
      const t = i / (STR_N - 1), mt = 1 - t;
      STR_C[2 * i] = mt * mt * mt * x0 + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * x1;
      STR_C[2 * i + 1] = mt * mt * mt * y0 + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * y1;
    }
    for (let i = 0; i < STR_N; i++) {
      const t = i / (STR_N - 1);
      const i0 = Math.max(0, i - 1), i1 = Math.min(STR_N - 1, i + 1);
      let dx = STR_C[2 * i1] - STR_C[2 * i0], dy = STR_C[2 * i1 + 1] - STR_C[2 * i0 + 1];
      const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const w = lerp(1.5, 9, Math.pow(t, 1.3)) * s * (p.model.wob ? p.model.wob[i] : 1);
      STR_L[2 * i] = STR_C[2 * i] - dy * w; STR_L[2 * i + 1] = STR_C[2 * i + 1] + dx * w * 0.35;
      STR_R[2 * i] = STR_C[2 * i] + dy * w; STR_R[2 * i + 1] = STR_C[2 * i + 1] - dx * w * 0.35;
    }
  }
  // 自谷底的褶皱里渐渐显出来（上端 15% 由透明到不透明）
  function streamFill(ctx, rgb, a, y0, y1) {
    const gr = ctx.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    gr.addColorStop(0.15, U.rgba(rgb[0], rgb[1], rgb[2], a));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], a));
    return gr;
  }
  function drawStream(ctx, p) {
    streamGeom(p);
    const s = LS(2), y0 = STR_C[1], y1 = STR_C[2 * STR_N - 1];
    ctx.globalAlpha = p.a;
    // 河床：比两岸的草深一些的湿土
    const bed = W.shade(U.mixRGB([58, 60, 44], [96, 84, 60], Math.min(1, W.lv.bare || 0) * 0.5), 0);
    ctx.fillStyle = streamFill(ctx, bed, 0.9, y0, y1);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { const X1 = STR_L[2 * i] - 2.2 * s * (i / STR_N), Y1 = STR_L[2 * i + 1]; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(STR_R[2 * i] + 2.2 * s * (i / STR_N), STR_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 水：映着天色，远处（上游）亮些
    const sky = U.mixRGB(W.haze, [70, 118, 160], 0.55);
    const lit = 0.22 + 0.62 * W.daylight + 0.12 * W.lv.moon * W.night;
    ctx.fillStyle = streamFill(ctx, [sky[0] * lit, sky[1] * lit, sky[2] * lit], 1, y0, y1);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { if (i) ctx.lineTo(STR_L[2 * i], STR_L[2 * i + 1]); else ctx.moveTo(STR_L[0], STR_L[1]); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(STR_R[2 * i], STR_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 近岸一侧的水色深些（岸的影子落在水里）
    const sh = W.shade([30, 44, 52], 0);
    ctx.fillStyle = streamFill(ctx, sh, 0.45, y0, y1);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { const X1 = lerp(STR_L[2 * i], STR_R[2 * i], 0.62), Y1 = lerp(STR_L[2 * i + 1], STR_R[2 * i + 1], 0.62); if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(STR_R[2 * i], STR_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 河床里光滑的石子（露出水面的几块）
    ctx.fillStyle = css([176, 168, 150], 2, 0.85, 0.1);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const t = 0.3 + rt(i * 5 + 3) * 0.5, f = t * (STR_N - 1), k = Math.min(STR_N - 2, Math.floor(f));
      const cx = STR_C[2 * k] + (rt(i * 5 + 4) - 0.5) * lerp(3, 11, t) * s * 1.6, cy = STR_C[2 * k + 1] + 1 * s;
      const r = (0.6 + rt(i) * 0.6) * s;
      ctx.moveTo(cx + r * 1.3, cy); ctx.ellipse(cx, cy, r * 1.3, r * 0.8, 0, 0, TAU);
    }
    ctx.fill();
    // 天光：远岸一侧一条柔和的亮带（不是线）
    const moon = W.lv.moon * W.night * 0.6;
    const hl = moon > W.daylight * 0.8 ? [214, 226, 255] : [255, 248, 232];
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.a * (0.08 + 0.2 * W.daylight + moon * 0.4);
    ctx.fillStyle = streamFill(ctx, hl, 1, y0, y1);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { const X1 = lerp(STR_L[2 * i], STR_R[2 * i], 0.12), Y1 = lerp(STR_L[2 * i + 1], STR_R[2 * i + 1], 0.12); if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(lerp(STR_L[2 * i], STR_R[2 * i], 0.4), lerp(STR_L[2 * i + 1], STR_R[2 * i + 1], 0.4));
    ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // 岸边的芦苇
    const reedC = css([58, 82, 44], 2), reedL = css([120, 146, 84], 2, 0.8, 0.05);
    ctx.lineCap = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.globalAlpha = p.a;
      ctx.strokeStyle = pass ? reedL : reedC;
      ctx.lineWidth = Math.max(0.6, (pass ? 0.6 : 1) * s);
      ctx.beginPath();
      for (let j = 0; j < p.model.reeds.length; j++) {
        const q = p.model.reeds[j], f = q[0] * (STR_N - 1), k = Math.min(STR_N - 2, Math.floor(f)), r = f - k;
        const B = q[1] < 0 ? STR_L : STR_R;
        const bx = lerp(B[2 * k], B[2 * k + 2], r) + q[1] * 1.2 * s, by = lerp(B[2 * k + 1], B[2 * k + 3], r) + 0.5 * s;
        const hh = q[2] * lerp(4, 11, Math.pow(q[0], 1.2)) * s, sw = Math.sin(W.t * 1.1 + j) * 0.06 * hh + W.wind * 0.1 * hh;
        for (let n = 0; n < q[4]; n++) {
          if (pass && n) continue;
          const ox = (n - (q[4] - 1) / 2) * 1.1 * s, lean = q[3] + (n - 1) * 0.25;
          ctx.moveTo(bx + ox, by);
          ctx.quadraticCurveTo(bx + ox + lean * hh * 0.3, by - hh * 0.6, bx + ox + lean * hh * 0.55 + sw, by - hh * (1 - n * 0.12));
        }
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 以拉谷两边的山（17:3「这边山上……那边山上，当中有谷」）：营后一道山冈（比近处的地远一点，带些雾气），谷底是溪
  const riseY = (p, u) => Math.pow(Math.max(0, Math.cos(u * Math.PI / 2)), 0.75) * (1 + 0.06 * Math.sin(u * 7 + p.seed));
  function drawRise(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, hw = 0.5 * p.size * 0.14 * W.w * (W.w < 600 ? 1.4 : 1), H = 30 * s * (p.grow == null ? 1 : p.grow);
    if (H < 0.3) return;
    const N = 28, d = litX() >= x ? 1 : -1;
    const top = (u, xx) => gY(l, clamp(xx / W.w, 0, 1)) + 3 * s - H * riseY(p, u);
    const base = W.shade(U.mixRGB([76, 112, 58], [168, 142, 92], Math.min(1, W.lv.bare || 0) * 0.75), 0.16);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = U.rgb(base[0], base[1], base[2]);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const u = i / N * 2 - 1, xx = x + u * hw; if (i) ctx.lineTo(xx, top(u, xx)); else ctx.moveTo(xx, top(u, xx)); }
    for (let i = N; i >= 0; i--) { const xx = x + (i / N * 2 - 1) * hw; ctx.lineTo(xx, gY(l, clamp(xx / W.w, 0, 1)) + 1.5 * s); }
    ctx.closePath(); ctx.fill();
    // 背光的坡
    ctx.fillStyle = U.rgba(base[0] * 0.8, base[1] * 0.8, base[2] * 0.84, 0.75);
    ctx.beginPath();
    ctx.moveTo(x, top(0, x));
    for (let i = 0; i <= N / 2; i++) { const u = -d * (i / (N / 2)), xx = x + u * hw; ctx.lineTo(xx, top(u, xx)); }
    for (let i = N / 2; i >= 0; i--) { const xx = x - d * hw * (0.25 + 0.75 * i / (N / 2)); ctx.lineTo(xx, gY(l, clamp(xx / W.w, 0, 1)) + 1.5 * s); }
    ctx.closePath(); ctx.fill();
    // 迎光的脊线
    ctx.strokeStyle = css([240, 228, 190], 1, 0.35 * (0.25 + 0.75 * W.daylight), 0.15);
    ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.beginPath();
    for (let i = 0; i <= N / 2; i++) { const u = d * (i / (N / 2)) * 0.85, xx = x + u * hw; if (i) ctx.lineTo(xx, top(u, xx)); else ctx.moveTo(xx, top(u, xx)); }
    ctx.stroke();
    // 坡上几丛矮树
    ctx.fillStyle = U.rgba(base[0] * 0.62, base[1] * 0.7, base[2] * 0.62, 0.9);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const u = (rt(p.seed + i * 3) - 0.5) * 1.5, xx = x + u * hw, yy = top(u, xx) + H * (0.12 + 0.3 * rt(p.seed + i * 3 + 1)), r = (2 + 2.2 * rt(p.seed + i * 3 + 2)) * s;
      ctx.moveTo(xx + r, yy); ctx.ellipse(xx, yy, r, r * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 以色磐石（20:19）
  function drawStone(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    const w = 26 * s, h = 24 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([126, 118, 106], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.bezierCurveTo(x - w * 0.56, y - h * 0.6, x - w * 0.32, y - h * 1.02, x - w * 0.02, y - h);
    ctx.bezierCurveTo(x + w * 0.3, y - h * 1.0, x + w * 0.52, y - h * 0.62, x + w * 0.5, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([96, 90, 82], l, 0.6);
    ctx.beginPath(); ctx.moveTo(x - w * 0.1, y); ctx.quadraticCurveTo(x - w * 0.05, y - h * 0.5, x + w * 0.2, y - h * 0.82); ctx.quadraticCurveTo(x + w * 0.45, y - h * 0.5, x + w * 0.5, y); ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 214, 196], l, 0.5 * (0.3 + 0.7 * W.daylight), 0.25); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * w * 0.5, y - h * 0.1); ctx.bezierCurveTo(x + d * w * 0.54, y - h * 0.6, x + d * w * 0.32, y - h, x, y - h); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 石崖与洞（亚杜兰洞 22:1；隐基底的洞 24:3）
  function cliffDims(p) {
    const s = LS(p.layer) * p.size;
    const hw = Math.max(76 * s, 0.07 * W.w), h = Math.max(100 * s, hw * 1.2);
    return { s, hw, h, mw: hw * 0.42, mh: Math.min(h * 0.56, Math.max(62 * s, hw * 0.7)) };
  }
  function drawCliff(ctx, p) {
    const l = p.layer, x = p.x * W.w, y = gY(l, p.x) + 4, m = p.model, D = cliffDims(p), hw = D.hw, h = D.h, s = D.s;
    const yb = xx => Math.max(y, gY(l, clamp(xx / W.w, 0, 1)) + 4);
    const d = litX() >= x ? 1 : -1, day = 0.3 + 0.7 * W.daylight;
    ctx.globalAlpha = p.a;
    // 顶上与石缝里的矮树丛
    ctx.fillStyle = css([56, 70, 48], l);
    ctx.beginPath();
    for (const b of m.bush) { const bx = x + b[0] * hw, by = y + b[1] * h; ctx.moveTo(bx + 8 * s, by); ctx.ellipse(bx, by, 8 * s, 5 * s, 0, 0, TAU); ctx.moveTo(bx + 13 * s, by + 1 * s); ctx.ellipse(bx + 6 * s, by + 1 * s, 6 * s, 4 * s, 0, 0, TAU); }
    ctx.fill();
    // 石体
    ctx.fillStyle = css([156, 138, 114], l);
    ctx.beginPath();
    m.pts.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = q[1] === 0 ? yb(X1) : y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    // 背光的一面
    ctx.fillStyle = css([98, 86, 74], l, 0.6);
    ctx.beginPath();
    ctx.moveTo(x - d * 0.08 * hw, y + 2); ctx.lineTo(x - d * 0.14 * hw, y - h * 1.0);
    m.pts.forEach(q => { if (q[0] * d <= -0.12) ctx.lineTo(x + q[0] * hw, q[1] === 0 ? yb(x + q[0] * hw) : y + q[1] * h); });
    ctx.closePath(); ctx.fill();
    // 石阶：迎光的上缘
    ctx.strokeStyle = css([226, 210, 182], l, 0.5 * day, 0.2); ctx.lineWidth = Math.max(0.7, 1.3 * s);
    ctx.beginPath();
    for (const q of m.ledges) { const x0 = x + q[0] * hw, yy = y + q[2] * h; ctx.moveTo(x0, yy); ctx.quadraticCurveTo(x0 + q[1] * hw * 0.5, yy - 0.02 * h, x0 + q[1] * hw, yy + 0.01 * h); }
    ctx.stroke();
    ctx.strokeStyle = css([84, 72, 62], l, 0.55); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (const q of m.ledges) { const x0 = x + q[0] * hw, yy = y + q[2] * h + 2.2 * s; ctx.moveTo(x0 + 2 * s, yy); ctx.lineTo(x0 + q[1] * hw - 2 * s, yy + 0.01 * h); }
    for (const q of m.cracks) { const cx = x + q[0] * hw, cy = y + q[1] * h; ctx.moveTo(cx, cy); ctx.lineTo(cx + q[2] * hw, cy + q[3] * h); }
    ctx.stroke();
    // 迎光的轮廓
    ctx.strokeStyle = css([240, 226, 200], l, 0.55 * day, 0.25); ctx.lineWidth = Math.max(0.7, 1.4 * s);
    ctx.beginPath();
    let on = false;
    m.pts.forEach(q => { if (q[1] === 0 || q[0] * d < -0.2) { on = false; return; } const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (on) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); on = true; });
    ctx.stroke();
    // 脚下的乱石
    ctx.fillStyle = css([136, 122, 104], l);
    ctx.beginPath();
    for (const q of m.rocks) { const rx = x + q[0] * hw, ry = yb(rx) - q[1] * 0.2 * h, rr = q[2] * hw; ctx.moveTo(rx + rr, ry); ctx.ellipse(rx, ry, rr, rr * 0.62, 0, Math.PI, 0); }
    ctx.fill();
    // 洞口：先一圈悬垂的暗影，再是洞
    ctx.fillStyle = css([70, 60, 52], l, 0.7);
    mouthPath(ctx, x, y, D, 1.18, m);
    ctx.fill();
    ctx.fillStyle = css([14, 10, 9], l);
    mouthPath(ctx, x, y, D, 1, m);
    ctx.fill();
    if (p.lit > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x, y - D.mh * 0.4, D.mw * 1.6, p.a * p.lit * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function mouthPath(ctx, x, y, D, k, m) {
    const mw = D.mw * (k || 1), mh = D.mh * (k || 1), arch = m ? m.arch : null;
    ctx.beginPath();
    if (!arch) {
      ctx.moveTo(x - mw, y + 3);
      ctx.bezierCurveTo(x - mw * 1.05, y - mh * 0.7, x - mw * 0.6, y - mh * 1.02, x - mw * 0.05, y - mh);
      ctx.bezierCurveTo(x + mw * 0.55, y - mh * 0.98, x + mw * 1.02, y - mh * 0.66, x + mw, y + 3);
    } else {
      ctx.moveTo(x - mw, y + 3);
      for (const q of arch) ctx.lineTo(x + q[0] * mw, y + q[1] * mh);
      ctx.lineTo(x + mw, y + 3);
    }
    ctx.closePath();
  }

  // 营中的火（26 章；基利波 28 章）
  function drawPit(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([96, 88, 80], l);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const cx = x + (i - 2.5) * 2.6 * s, cy = y - (i === 0 || i === 5 ? 0 : 0.6) * s, r = 1.6 * s; ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.7, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.warm, x, y - 4 * s, 52 * s, p.a * p.fire * (0.4 + 0.45 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, y - 0.5 * s, 8 * s * (0.5 + 0.5 * p.fire), p.fire * p.a, p.seed);
    }
    if (p.ember > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.ember, x, y - 1 * s, 10 * s, p.a * p.ember * (0.5 + 0.2 * Math.sin(W.t * 2 + p.seed)));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 雅比的坟（31:13）
  function drawMound(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s, g = p.grow;
    if (g < 0.01) return;
    const w = 26 * s, h = 9 * s * g;
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.pale, x, y - h * 0.6, w * 1.6, p.a * p.lit * (0.35 + 0.25 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 0.9)));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([112, 90, 66], l);
    ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.5, y - h * 1.1, x, y - h); ctx.quadraticCurveTo(x + w * 0.55, y - h * 1.05, x + w, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 140, 126], l);
    ctx.beginPath();
    for (const q of p.model.st) { const cx = x + q[0] * w, cy = y - q[1] * h * 3, r = q[2] * 12 * s * g; ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.66, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([228, 206, 170], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x, y - h); ctx.quadraticCurveTo(x + d * w * 0.55, y - h * 1.05, x + d * w, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  人身上的器物
  // ════════════════════════════════════════════════════════════
  const BRONZE = [206, 156, 88], DULLB = [150, 132, 106], STEEL = [206, 208, 214], WOODC = [104, 80, 56];
  function spearLine(ctx, x0, y0, x1, y1, w, a, tip, glint) {
    if (a < 0.01) return;
    ctx.globalAlpha = a;
    ctx.strokeStyle = css(WOODC, 2, 1); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(0.8, w);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const tl = Math.max(4, w * 6), tw = Math.max(1.5, w * 1.6);
    ctx.fillStyle = css(tip || BRONZE, 2, 1, 0.04);
    ctx.beginPath();
    ctx.moveTo(x1 + ux * tl, y1 + uy * tl);
    ctx.lineTo(x1 - uy * tw, y1 + ux * tw);
    ctx.lineTo(x1 - ux * tl * 0.2, y1 - uy * tl * 0.2);
    ctx.lineTo(x1 + uy * tw, y1 - ux * tw);
    ctx.closePath(); ctx.fill();
    if (glint) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, x1 + ux * tl * 0.5, y1 + uy * tl * 0.5, tl * 1.2, a * glint);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 枪尖只在日光里闪一闪；黄昏与夜里不发光（免得像一排蜡烛）
  const tipGlint = () => 0.08 + 0.22 * W.daylight * (0.7 + 0.3 * Math.sin(W.t * 1.7));
  // 手持的枪：直立在身旁
  function heldSpear(ctx, q, len, w, tip, lift, gl) {
    const low = !UPR[q.pose] && q.pose !== 'seat' && q.pose !== 'sit' && q.pose !== 'kneel';
    if (q.pose === 'lie' || q.pose === 'fall' || q.pose === 'pray' || q.pose === 'weep') {
      // 放在身旁的地上
      const y = q.y + 0.02 * q.h, x = q.x;
      spearLine(ctx, x - q.d * 0.55 * len * q.h, y, x + q.d * 0.6 * len * q.h, y - 0.03 * q.h, w, q.a, tip, 0.1);
      return;
    }
    const bx = q.x + q.d * (q.pose === 'seat' ? 0.3 : 0.2) * q.h, by = q.y + 0.02 * q.h - (lift || 0) * q.h;
    const tx = bx + q.d * 0.05 * q.h, ty = by - len * q.h;
    if (low) return;
    spearLine(ctx, bx, by, tx, ty, w, q.a, tip, tipGlint() * (gl == null ? 1 : gl));
  }
  // 冠冕（扫罗）
  function crown(ctx, q, k) {
    if (k < 0.02) return;
    const hx = q.head[0], hy = q.head[1], h = q.h, w = 0.085 * h;
    const lowp = q.pose === 'fall' || q.pose === 'lie';
    if (lowp) return;
    ctx.globalAlpha = q.a * k;
    ctx.fillStyle = css([226, 182, 86], 2, 1, 0.3);
    ctx.beginPath();
    ctx.moveTo(hx - w, hy + 0.018 * h);
    ctx.lineTo(hx - w, hy - 0.02 * h); ctx.lineTo(hx - w * 0.55, hy + 0.004 * h); ctx.lineTo(hx, hy - 0.035 * h); ctx.lineTo(hx + w * 0.55, hy + 0.004 * h);
    ctx.lineTo(hx + w, hy - 0.02 * h); ctx.lineTo(hx + w, hy + 0.018 * h);
    ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, hx, hy, 0.12 * h, q.a * k * (0.2 + 0.35 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 铜盔（歌利亚）
  function helmet(ctx, q) {
    const h = q.h, lowp = q.pose === 'fall' || q.pose === 'lie';
    let hx = q.head[0], hy = q.head[1] + 0.035 * h;
    ctx.globalAlpha = q.a;
    ctx.fillStyle = css(BRONZE, 2, 1, 0.1);
    if (lowp) { hx = q.x + q.d * 0.6 * h; hy = q.y - 0.03 * h; ctx.beginPath(); ctx.ellipse(hx, hy, 0.06 * h, 0.035 * h, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; return; }
    ctx.beginPath(); ctx.ellipse(hx, hy, 0.066 * h, 0.056 * h, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillRect(hx - q.d * 0.066 * h - (q.d < 0 ? 0 : 0.022 * h), hy - 0.004 * h, 0.022 * h, 0.05 * h);
    // 盔上的冠
    ctx.strokeStyle = css([150, 60, 44], 2, 1); ctx.lineWidth = Math.max(1, 0.02 * h); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - q.d * 0.05 * h, hy - 0.05 * h); ctx.quadraticCurveTo(hx, hy - 0.085 * h, hx + q.d * 0.05 * h, hy - 0.052 * h); ctx.stroke();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, hx + q.d * 0.02 * h, hy - 0.03 * h, 0.07 * h, q.a * tipGlint());
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 铠甲的鳞光（五千舍客勒，17:5）
  function mail(ctx, q, k) {
    if (k < 0.02 || !UPR[q.pose]) return;
    const h = q.h, cx = q.x + q.d * 0.03 * h;
    ctx.globalAlpha = q.a * k * (0.35 + 0.35 * W.daylight + 0.2 * nightK());
    ctx.strokeStyle = css([236, 196, 126], 2, 1, 0.25); ctx.lineWidth = Math.max(0.6, 0.012 * h);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const yy = q.y - (0.58 + i * 0.075) * h;
      ctx.moveTo(cx - 0.07 * h, yy); ctx.quadraticCurveTo(cx, yy + 0.02 * h, cx + 0.07 * h, yy);
    }
    ctx.stroke();
    // 腿上的铜护膝
    ctx.beginPath();
    ctx.moveTo(q.x - 0.04 * h, q.y - 0.22 * h); ctx.lineTo(q.x - 0.04 * h, q.y - 0.12 * h);
    ctx.moveTo(q.x + 0.04 * h, q.y - 0.22 * h); ctx.lineTo(q.x + 0.04 * h, q.y - 0.12 * h);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 盾：拿盾牌的人举在身前 / 丢在地上
  function shieldAt(ctx, x, y, w, h, a, flat) {
    ctx.globalAlpha = a;
    ctx.fillStyle = css([120, 88, 58], 2);
    ctx.beginPath();
    if (flat) ctx.ellipse(x, y, w * 1.2, h * 0.16, 0, 0, TAU);
    else ctx.ellipse(x, y, w, h, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = css(BRONZE, 2, 1, 0.15); ctx.lineWidth = Math.max(0.8, w * 0.12);
    ctx.stroke();
    if (!flat) {
      ctx.fillStyle = css([226, 186, 110], 2, 1, 0.2);
      ctx.beginPath(); ctx.arc(x, y, w * 0.2, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // 约拿单的弓
  function bowOnBack(ctx, q) {
    if (!UPR[q.pose] && q.pose !== 'kneel' && q.pose !== 'sit') return;
    const h = q.h, cx = q.x - q.d * 0.07 * h, cy = q.y - 0.62 * h, r = 0.26 * h;
    ctx.globalAlpha = q.a;
    ctx.strokeStyle = css([96, 70, 44], 2); ctx.lineWidth = Math.max(0.8, 0.02 * h); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 - 0.9 + (q.d < 0 ? Math.PI : 0) * 0, -Math.PI / 2 + 0.9); ctx.stroke();
    ctx.strokeStyle = css([210, 200, 180], 2, 0.6); ctx.lineWidth = Math.max(0.4, 0.006 * h);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(-Math.PI / 2 - 0.9) * r, cy + Math.sin(-Math.PI / 2 - 0.9) * r); ctx.lineTo(cx + Math.cos(-Math.PI / 2 + 0.9) * r, cy + Math.sin(-Math.PI / 2 + 0.9) * r); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function bowDrawn(ctx, q) {       // 挽弓（20:36）
    const h = q.h, hx = q.hand[0], hy = q.hand[1], r = 0.3 * h;
    ctx.globalAlpha = q.a;
    ctx.strokeStyle = css([96, 70, 44], 2); ctx.lineWidth = Math.max(0.8, 0.022 * h); ctx.lineCap = 'round';
    const a0 = q.d > 0 ? -0.95 : Math.PI - 0.95, a1 = q.d > 0 ? 0.95 : Math.PI + 0.95;
    const cx = hx - q.d * r * 0.72;
    ctx.beginPath(); ctx.arc(cx, hy, r, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke();
    ctx.strokeStyle = css([220, 210, 190], 2, 0.7); ctx.lineWidth = Math.max(0.4, 0.006 * h);
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a0) * r, hy + Math.sin(a0) * r); ctx.lineTo(q.x + q.d * 0.02 * h, hy); ctx.lineTo(cx + Math.cos(a1) * r, hy + Math.sin(a1) * r); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 大卫的琴（16:23）
  function harp(ctx, q, k, playing) {
    if (k < 0.02) return;
    const h = q.h, sit = q.pose === 'sit' || q.pose === 'kneel';
    const cx = q.x + q.d * (sit ? 0.24 : 0.18) * h, by = q.y - (sit ? 0.26 : 0.4) * h, H = 0.26 * h, w = 0.075 * h;
    ctx.globalAlpha = q.a * k;
    ctx.strokeStyle = css([150, 108, 62], 2, 1, 0.1); ctx.lineWidth = Math.max(0.9, 0.022 * h); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.5, by); ctx.quadraticCurveTo(cx - w * 1.3, by - H * 0.55, cx - w * 0.8, by - H);
    ctx.moveTo(cx + w * 0.5, by); ctx.quadraticCurveTo(cx + w * 1.3, by - H * 0.55, cx + w * 0.8, by - H);
    ctx.moveTo(cx - w * 0.95, by - H * 0.92); ctx.lineTo(cx + w * 0.95, by - H * 0.92);
    ctx.stroke();
    ctx.fillStyle = css([130, 92, 54], 2, 1);
    ctx.beginPath(); ctx.ellipse(cx, by, w * 0.7, 0.03 * h, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = playing > 0.05 ? U.rgba(255, 236, 190, 0.5 + 0.4 * playing) : css([226, 214, 190], 2, 0.7);
    ctx.lineWidth = Math.max(0.4, 0.006 * h);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const f = (i + 0.5) / 4 - 0.5, vib = playing * Math.sin(W.t * 40 + i * 2) * 0.006 * h;
      ctx.moveTo(cx + f * w * 1.1, by); ctx.lineTo(cx + f * w * 1.5 + vib, by - H * 0.92);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 撒母耳的角（16:13）
  function horn(ctx, q, k, pour) {
    if (k < 0.02) return;
    const h = q.h, hx = q.hand[0], hy = q.hand[1], L = 0.2 * h;
    const tilt = lerp(-0.9, 0.7, pour);   // 倒油时角口向下
    const ax = Math.cos(tilt) * q.d, ay = Math.sin(tilt);
    ctx.globalAlpha = q.a * k;
    ctx.fillStyle = css([232, 214, 170], 2, 1, 0.2);
    // 弯角：尖端在手里，角口向外（倒油时朝下）
    const tx = hx - ax * L * 0.25, ty = hy - ay * L * 0.25, mx = hx + ax * L, my = hy + ay * L;
    const nx = -ay * q.d, ny = ax * q.d, bw = 0.045 * h, cx0 = (tx + mx) / 2 - nx * L * 0.25, cy0 = (ty + my) / 2 - Math.abs(ny) * L * 0.25 - 0.03 * h;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(cx0, cy0, mx + nx * bw, my + ny * bw);
    ctx.lineTo(mx - nx * bw, my - ny * bw);
    ctx.quadraticCurveTo(cx0 + nx * bw * 0.5, cy0 + ny * bw * 0.5, tx, ty);
    ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, hx + ax * L, hy + ay * L, 0.1 * h, q.a * k * (0.3 + 0.4 * pour));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 机弦：垂在手上的一根绳与兜
  function sling(ctx, q, k) {
    if (k < 0.02 || q.pose === 'raise') return;
    const h = q.h, hx = q.hand[0], hy = q.hand[1];
    ctx.globalAlpha = q.a * k;
    ctx.strokeStyle = css([150, 124, 90], 2, 0.9); ctx.lineWidth = Math.max(0.5, 0.008 * h);
    const sw = Math.sin(W.t * 2.2) * 0.02 * h;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + q.d * 0.02 * h + sw, hy + 0.12 * h, hx + sw * 1.5, hy + 0.2 * h); ctx.stroke();
    ctx.fillStyle = css([130, 104, 74], 2);
    ctx.beginPath(); ctx.ellipse(hx + sw * 1.5, hy + 0.2 * h, 0.018 * h, 0.012 * h, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 牧人的囊（五块光滑石子，17:40）
  function pouch(ctx, q, k) {
    if (k < 0.02 || !UPR[q.pose] && q.pose !== 'kneel') return;
    const h = q.h, px = q.x - q.d * 0.06 * h, py = q.y - 0.42 * h;
    ctx.globalAlpha = q.a;
    ctx.fillStyle = css([120, 96, 66], 2);
    ctx.beginPath(); ctx.ellipse(px, py, 0.045 * h, 0.035 * h, 0, 0, TAU); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.white, px, py - 0.01 * h, 0.05 * h, q.a * k * 0.12 * (0.6 + 0.4 * Math.sin(W.t * 3)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 割下的衣襟（24:4）
  function corner(ctx, q, k) {
    if (k < 0.02) return;
    const h = q.h, hx = q.hand[0], hy = q.hand[1];
    ctx.globalAlpha = q.a * k;
    ctx.fillStyle = css(ROBE.saul, 2, 1, 0.15);
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + q.d * 0.06 * h, hy - 0.01 * h); ctx.lineTo(hx + q.d * 0.045 * h, hy + 0.07 * h); ctx.lineTo(hx - q.d * 0.01 * h, hy + 0.05 * h); ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, hx + q.d * 0.025 * h, hy + 0.03 * h, 0.09 * h, q.a * k * (0.25 + 0.3 * (q.pose === 'raise' ? 1 : 0)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 挂在腰间的刀（歌利亚的刀，21:9）
  function hipSword(ctx, q, k) {
    if (k < 0.02 || !UPR[q.pose] && q.pose !== 'kneel' && q.pose !== 'sit') return;
    const h = q.h;
    ctx.globalAlpha = q.a * k;
    ctx.strokeStyle = css([70, 56, 44], 2); ctx.lineWidth = Math.max(0.8, 0.02 * h); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(q.x - q.d * 0.02 * h, q.y - 0.46 * h); ctx.lineTo(q.x - q.d * 0.2 * h, q.y - 0.2 * h); ctx.stroke();
    ctx.strokeStyle = css(STEEL, 2, 1, 0.2); ctx.lineWidth = Math.max(0.6, 0.012 * h);
    ctx.beginPath(); ctx.moveTo(q.x - q.d * 0.0 * h, q.y - 0.5 * h); ctx.lineTo(q.x + q.d * 0.03 * h, q.y - 0.53 * h); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 手中的刀（25:13）
  function drawnSword(ctx, q, k) {
    if (k < 0.02 || !UPR[q.pose]) return;
    const h = q.h, hx = q.hand[0], hy = q.hand[1];
    const tx = hx + q.d * 0.12 * h, ty = hy - 0.36 * h;
    ctx.globalAlpha = q.a * k;
    ctx.strokeStyle = css(STEEL, 2, 1, 0.3); ctx.lineWidth = Math.max(0.6, 0.014 * h); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.globalAlpha = q.a * k * (0.25 + 0.3 * W.daylight);
    ctx.strokeStyle = 'rgb(255,250,236)'; ctx.lineWidth = Math.max(0.4, 0.006 * h);
    ctx.beginPath(); ctx.moveTo(lerp(hx, tx, 0.3), lerp(hy, ty, 0.3)); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 鼓（18:6）：举起的手鼓
  function timbrel(ctx, q, k) {
    if (k < 0.02) return;
    const h = q.h, hx = q.hand[0], hy = q.hand[1] - (q.pose === 'raise' ? 0.02 * h : 0), r = 0.06 * h;
    ctx.globalAlpha = q.a * k;
    ctx.fillStyle = css([224, 206, 170], 2, 1, 0.1);
    ctx.beginPath(); ctx.ellipse(hx, hy, r, r * 0.9, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([176, 128, 70], 2, 1, 0.1); ctx.lineWidth = Math.max(0.6, 0.014 * h); ctx.stroke();
    if (q.pose === 'raise') {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, hx, hy, r * 2.2, q.a * k * (0.18 + 0.2 * Math.max(0, Math.sin(W.t * 9 + hx))));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 水瓶（26:11）
  function jarAt(ctx, x, y, s, a) {
    ctx.globalAlpha = a;
    ctx.fillStyle = css([176, 118, 76], 2);
    ctx.beginPath(); ctx.ellipse(x, y - 4 * s, 3.2 * s, 4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - 1.2 * s, y - 10 * s, 2.4 * s, 3 * s);
    ctx.fillStyle = css([226, 186, 140], 2, 0.45 * (0.3 + 0.7 * W.daylight + 0.5 * W.lv.moon * W.night), 0.2);
    ctx.beginPath(); ctx.ellipse(x + 1.2 * s, y - 5 * s, 1 * s, 2.4 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 身后的：枪、背上的弓、腰间的刀、地上的盾与瓶
  function drawGearBack(ctx) {
    const s2 = LS(2);
    // 军兵的枪
    for (const gid of ISR_CROWDS) {
      if (!hasCrowd(gid)) continue;
      const ms = members(gid);
      for (const m of ms) {
        if (m.layer !== 2) continue;
        const q = Am(m);
        if (!q || q.a < 0.03) continue;
        heldSpear(ctx, q, 1.4, Math.max(1, 0.026 * q.h), gid === 'phil' ? DULLB : STEEL, 0, 0.3);
      }
    }
    // 扫罗的枪
    const sp = S.spear;
    if (sp.who === 'saul') {
      const q = A('saul');
      if (q) heldSpear(ctx, q, 1.5, Math.max(0.9, 0.022 * q.h), STEEL, 0, 0.45);
    } else if (sp.who === 'david' || sp.who === 'abishai') {
      const q = A(sp.who);
      if (q) {
        if (q.pose === 'raise') spearLine(ctx, q.hand[0] - q.d * 0.5 * q.h, q.hand[1] + 0.12 * q.h, q.hand[0] + q.d * 0.7 * q.h, q.hand[1] - 0.2 * q.h, Math.max(0.9, 0.022 * q.h), q.a, STEEL, tipGlint() + 0.3);
        else heldSpear(ctx, q, 1.5, Math.max(0.9, 0.022 * q.h), STEEL, 0);
      }
    } else if (sp.who === 'ground') {
      const x = sp.x * W.w, y = gY(2, sp.x) + 3 * s2, h = 44 * s2 * (W.w < 600 ? 1.2 : 1);
      spearLine(ctx, x, y, x + 0.03 * h, y - 1.4 * h, Math.max(0.9, 1 * s2), 1, STEEL, tipGlint());
    } else if (sp.who === 'wall') {
      const x = sp.x * W.w, y = gY(2, sp.x) - 30 * s2, h = 44 * s2;
      const vib = Math.sin(W.t * 30) * Math.exp(-Math.min(40, E.spearQ)) * 0.02;
      spearLine(ctx, x + (0.95 + vib) * h, y - 0.12 * h, x, y, Math.max(0.9, 1 * s2), 1, STEEL, 0.1);
    }
    // 歌利亚的枪（枪杆粗如织布的机轴）
    if (S.gspear === 'goliath') {
      const q = A('goliath');
      if (q) {
        if (q.pose === 'fall') spearLine(ctx, q.x - q.d * 0.15 * q.h, q.y + 0.01 * q.h, q.x + q.d * 1.05 * q.h, q.y - 0.01 * q.h, Math.max(1.2, 0.03 * q.h), q.a, [150, 150, 156], 0.05);
        else if (q.pose === 'raise') spearLine(ctx, q.x + q.d * 0.1 * q.h, q.y - 0.3 * q.h, q.x + q.d * 0.35 * q.h, q.y - 1.62 * q.h, Math.max(1.2, 0.03 * q.h), q.a, [150, 150, 156], tipGlint());
        else heldSpear(ctx, q, 1.36, Math.max(1.2, 0.03 * q.h), [150, 150, 156], 0, 0.6);
      }
    }
    // 约拿单的弓
    if (S.bow) {
      const q = A('jonathan');
      if (q && q.pose !== 'point') bowOnBack(ctx, q);
    }
    // 大卫腰间的刀
    if (E.swordD > 0.02) { const q = A('david'); if (q) hipSword(ctx, q, E.swordD); }
    // 地上的盾
    if (S.shield.who === 'ground') {
      const x = S.shield.x * W.w, y = gY(2, S.shield.x) + 4 * s2, h = 60 * s2;
      shieldAt(ctx, x, y, 0.2 * h, 0.35 * h, 1, true);
    }
    // 扫罗头旁的水瓶
    if (S.jar.who === 'ground') jarAt(ctx, S.jar.x * W.w, gY(2, S.jar.x) + 4 * s2, s2 * (W.w < 600 ? 1.2 : 1), 1);
  }
  // 身前的：冠冕、铜盔与铠甲、盾、琴、角、机弦、衣襟、手鼓、刀
  function drawGearFront(ctx) {
    const qs = A('saul');
    if (qs) crown(ctx, qs, E.crown);
    const qg = A('goliath');
    if (qg) { mail(ctx, qg, 1); helmet(ctx, qg); }
    if (S.shield.who === 'bearer') {
      const q = A('bearer');
      if (q && UPR[q.pose]) shieldAt(ctx, q.x + q.d * 0.2 * q.h, q.y - 0.46 * q.h, 0.17 * q.h, 0.3 * q.h, q.a, false);
    }
    const qd = A('david');
    if (qd) {
      if (E.armor > 0.02) {
        // 扫罗的战衣与铜盔，大卫穿不惯（17:38–39）
        mail(ctx, qd, E.armor);
        ctx.save(); ctx.globalAlpha = E.armor; helmet(ctx, Object.assign({}, qd, { a: qd.a * E.armor })); ctx.restore();
      }
      harp(ctx, qd, E.harp, E.play);
      sling(ctx, qd, E.sling);
      pouch(ctx, qd, E.stones);
      corner(ctx, qd, E.corner);
    }
    const qm = A('samuel');
    if (qm) horn(ctx, qm, E.horn, E.pour);
    const qj = A('jonathan');
    if (qj && S.bow && qj.pose === 'point') bowDrawn(ctx, qj);
    if (E.timbrel > 0.02) for (const m of members('women')) { const q = Am(m); if (q) timbrel(ctx, q, E.timbrel); }
    if (E.swords > 0.02) {
      for (const m of members('men')) { const q = Am(m); if (q) drawnSword(ctx, q, E.swords); }
      if (qd) drawnSword(ctx, qd, E.swords);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  光与影：心里的光、恶魔、琴声、遮护、沉睡、寂静、营火
  // ════════════════════════════════════════════════════════════
  function drawHearts(ctx) {
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (const id in E.heart) {
      const k = E.heart[id];
      if (k < 0.01) continue;
      const q = A(id);
      if (!q) continue;
      const david = id === 'david';
      const r = q.h * (david ? 0.34 + 0.08 * Math.sin(W.t * 2.2) : 0.26);
      glowAt(ctx, david ? SP.gold : SP.ember, q.chest[0], q.chest[1], r, q.a * k * (david ? 0.8 : 0.6));
      ctx.globalAlpha = q.a * k * (david ? 0.95 : 0.7);
      ctx.fillStyle = david ? 'rgb(255,246,214)' : 'rgb(214,140,106)';
      const d = Math.max(1.2, q.h * (david ? 0.035 : 0.026));
      ctx.beginPath(); ctx.arc(q.chest[0], q.chest[1], d, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 耶和华是看内心：撒母耳面前一道清冷的光，经过的人心里的光显出来（16:7）
  function drawGaze(ctx) {
    const k = E.gaze;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU(), xb = XF(X.before), x = xb * W.w, g = gY(2, xb), w = 40 * u;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.32;
    ctx.drawImage(SP.coldBeam, x - w / 2, -10, w, g + 10);
    glowAt(ctx, SP.cold, x, g - 22 * u, 40 * u, k * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 恶魔扰乱扫罗：围着他打转的暗影
  function drawDark(ctx) {
    const k = W.lv.dvDark;
    if (k < 0.01) return;
    const q = A('saul');
    if (!q) return;
    SP || sprites();
    const cx = q.chest[0], cy = q.chest[1] - 0.1 * q.h;
    for (let i = 0; i < 9; i++) {
      const a = W.t * (0.5 + rt(i) * 0.5) * (i % 2 ? 1 : -1) + i * 0.7;
      const r = q.h * (0.25 + 0.3 * rt(i + 20)) * (1 + 0.15 * Math.sin(W.t * 1.3 + i));
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.6;
      glowAt(ctx, SP.dark, x, y, q.h * (0.26 + 0.12 * rt(i + 40)), k * 0.42 * q.a);
    }
    glowAt(ctx, SP.dark, cx, cy, q.h * 0.55, k * 0.35 * q.a);
    ctx.globalAlpha = 1;
  }
  // 琴声：自琴上一圈圈金色的微光飘向扫罗
  function drawNotes(ctx) {
    const k = E.play;
    if (k < 0.02) return;
    const q = A('david'), t = A('saul');
    if (!q) return;
    SP || sprites();
    const sit = q.pose === 'sit' || q.pose === 'kneel';
    const hx = q.x + q.d * (sit ? 0.24 : 0.18) * q.h, hy = q.y - (sit ? 0.4 : 0.54) * q.h;
    const tx = t ? t.chest[0] : hx + q.d * 0.15 * W.w, ty = t ? t.chest[1] : hy - 30;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < 12; i++) {
      const ph = U.fract(W.t * 0.28 + i / 12);
      const x = lerp(hx, tx, ph) + Math.sin(ph * 9 + i) * q.h * 0.12;
      const y = lerp(hy, ty, ph) - Math.sin(ph * Math.PI) * q.h * (0.5 + 0.3 * rt(i)) + Math.cos(ph * 7 + i) * q.h * 0.05;
      const a = k * Math.sin(ph * Math.PI) * 0.8;
      glowAt(ctx, SP.gold, x, y, q.h * 0.09, a * 0.5);
      ctx.globalAlpha = a;
      ctx.fillRect(x - 0.8, y - 0.8, 1.6 * SU(), 1.6 * SU());
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 遮护山寨的光（23:14）
  function drawVeil(ctx) {
    const k = W.lv.dvVeil;
    if (k < 0.01) return;
    const p = getP('cliff');
    if (!p) return;
    SP || sprites();
    const D = cliffDims(p), x = p.x * W.w, y = gY(2, p.x);
    ctx.globalCompositeOperation = 'lighter';
    // 一片穹形的柔光罩着山寨（不画线）
    const br = 0.22 + 0.05 * Math.sin(W.t * 0.8);
    glowAt(ctx, SP.gold, x, y - D.h * 0.55, D.hw * 1.9, k * p.a * br);
    ctx.globalAlpha = k * p.a * br * 0.8;
    const R = D.hw * 1.7;
    ctx.drawImage(SP.gold, x - R, y - R * 1.05, R * 2, R * 1.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 洞里的深处（24:3）：洞口的暗盖住藏在里面的人
  function drawDeep(ctx) {
    const k = E.caveDeep;
    const p = getP('cliff');
    if (k < 0.02 || !p) return;
    const D = cliffDims(p), x = p.x * W.w, y = gY(2, p.x) + 4;
    ctx.globalAlpha = k * p.a * 0.62;
    ctx.fillStyle = 'rgb(10,8,7)';
    mouthPath(ctx, x, y, D, 0.97, p.model);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 耶和华使他们沉沉地睡了：一层月白的雾，落在营上
  function drawSleep(ctx) {
    const k = W.lv.dvSleep;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      const xf = XF(0.63 + i * 0.034) + Math.sin(W.t * 0.15 + i) * 0.01;
      const g = gY(2, xf);
      glowAt(ctx, SP.silver, xf * W.w, g + 4 * u, 0.064 * W.w * (0.8 + 0.3 * rt(i + 3)), k * 0.26);
    }
    ctx.fillStyle = 'rgb(220,230,255)';
    for (let i = 0; i < 50; i++) {
      const xf = XF(0.62 + rt(i * 3) * 0.3), ph = U.fract(W.t * (0.04 + rt(i * 3 + 1) * 0.05) + rt(i * 3 + 2));
      const g = gY(2, xf), y = g - ph * 60 * u + 10 * u;
      ctx.globalAlpha = k * 0.7 * Math.sin(ph * Math.PI) * (0.5 + 0.5 * Math.sin(W.t * 3 + i));
      ctx.fillRect(xf * W.w - 0.8 * u, y - 0.8 * u, 1.6 * u, 1.6 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 书念的营火：中景的岛上一片闪烁的火点
  function drawShunem(ctx) {
    const k = W.lv.dvShunem;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU() * 0.7;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) {
      const xf = 0.53 + rt(i * 7 + 1) * 0.3;
      const g = gY(1, xf);
      if (!(g < W.waterlineY(1) - 2)) continue;
      const y = g + rt(i * 7 + 2) * Math.max(0, W.waterlineY(1) - g) * 0.7;
      const fl = 0.7 + 0.3 * Math.sin(W.t * (5 + rt(i) * 4) + i);
      const kk = k * clamp(k * 1.6 - rt(i * 7 + 3) * 0.6, 0, 1);
      glowAt(ctx, SP.warm, xf * W.w, y - 1.5 * u, 9 * u, kk * 0.55 * fl);
      ctx.globalAlpha = kk * fl;
      ctx.fillStyle = 'rgb(255,200,120)';
      ctx.fillRect(xf * W.w - 0.9 * u, y - 2.4 * u, 1.8 * u, 2.4 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 天的寂静（28:6）
  function drawSilence(ctx) {
    const k = W.lv.dvSilence;
    if (k < 0.01) return;
    ctx.globalAlpha = k * 0.5;
    ctx.fillStyle = 'rgb(8,10,20)';
    ctx.fillRect(-20, -20, W.w + 40, W.horizonY + 20);
    ctx.globalAlpha = 1;
  }
  // 雅比勇士手里的火把：光画在「遍地的黑暗」之上（人物模块的火焰在其下）
  function drawTorches(ctx) {
    if (!hasCrowd('jabesh')) return;
    const k = Math.max(nightK(), W.lv.gloom * 1.4);
    if (k < 0.05) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    let i = 0;
    for (const m of members('jabesh')) {
      i++;
      if (m.prop !== 'torch') continue;
      const q = Am(m);
      if (!q || q.a < 0.05) continue;
      const up = UPR[q.pose] ? 1 : 0;
      const fx0 = up ? q.x + q.d * 0.3 * q.h : q.x + q.d * 0.25 * q.h, fy0 = up ? q.y - 0.98 * q.h : q.y - 0.55 * q.h;
      const fl = 0.85 + 0.15 * Math.sin(W.t * 9 + i * 1.7);
      glowAt(ctx, SP.warm, fx0, fy0, q.h * 0.75, q.a * Math.min(1, k) * 0.5 * fl);
      glowAt(ctx, SP.gold, fx0, fy0, q.h * 0.12, q.a * Math.min(1, k) * 0.8 * fl);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 你的性命……如包裹宝器一样（25:29）
  function drawBundle(ctx) {
    const k = E.bundle;
    if (k < 0.02) return;
    const q = A('david');
    if (!q) return;
    SP || sprites();
    const cx = q.chest[0], cy = q.chest[1];
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, cx, cy, q.h * (0.5 + 0.05 * Math.sin(W.t * 1.5)), k * 0.55 * q.a);
    // 七点金光绕着他的胸口缓缓地转，像把宝器包裹起来
    ctx.fillStyle = 'rgb(255,244,214)';
    for (let i = 0; i < 7; i++) {
      const a = W.t * 0.7 + i * TAU / 7, R = q.h * (0.24 + 0.03 * Math.sin(W.t * 1.3 + i));
      const mx = cx + Math.cos(a) * R, my = cy - 0.08 * q.h + Math.sin(a) * R * 0.38;
      const front = 0.55 + 0.45 * Math.sin(a);
      glowAt(ctx, SP.gold, mx, my, q.h * 0.07, k * 0.7 * q.a * front);
      ctx.globalAlpha = k * 0.85 * q.a * front;
      ctx.fillRect(mx - 0.8, my - 0.8, 1.6 * SU(), 1.6 * SU());
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  一时的光（不属于状态；瞬间重演时不出现）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxl(b, e) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, e)); }
  function beam(b, xf, layer, o) {
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 6, xf, l, w: (o.w || 70) * SU() * (l === 2 ? 1 : 0.7), k: o.k || 1, cold: !!o.cold });
    // 光柱默认不带光圈；一句话里至多一圈小的（r ≤ 0.08）
    if (o.ring && fx()) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), o.cold ? [210, 222, 255] : [255, 236, 190], M() * Math.min(0.08, o.r || 0.06), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.tx != null ? f.tx : f.nx, f.layer, o); }
  function ringOn(b, id, rgb, r, frac) {
    if (b.instant) return;
    const q = A(id), f = fig(id);
    const x = q ? q.x : f ? f.nx * W.w : W.w * 0.7, y = q ? q.y - q.h * (frac == null ? 0.6 : frac) : W.h * 0.8;
    fx().ring(x, y, rgb || [255, 236, 190], M() * Math.min(0.08, r || 0.06), 2, 1.6);
  }
  function glint(b, id, frac) { fxl(b, { type: 'glint', dur: 2.4, id, frac: frac == null ? 0.5 : frac }); }
  // 一点光自 a 飞到 b（像素比例），或自某人升起
  function orb(b, from, to, o) { fxl(b, Object.assign({ type: 'orb', dur: 4, from, to, c: 'gold', size: 1 }, o || {})); }
  function orbFrom(b, id, to, o) {
    const q = A(id);
    if (!q) return;
    orb(b, [q.chest[0] / W.w, q.chest[1] / W.h], to, o);
  }

  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
        const x = e.xf * W.w, y = gY(e.l, e.xf);
        ctx.globalAlpha = env * 0.5 * e.k;
        ctx.drawImage(e.cold ? SP.coldBeam : SP.beam, x - e.w / 2, -10, e.w, y + 10);
        glowAt(ctx, e.cold ? SP.cold : SP.gold, x, y - e.w * 0.3, e.w * 1.1, env * 0.5 * e.k);
      } else if (e.type === 'orb') {
        const k = U.easeInOut(q);
        const x = lerp(e.from[0], e.to[0], k) * W.w + Math.sin(q * 7) * 6 * u * (1 - q);
        const y = lerp(e.from[1], e.to[1], k) * W.h - Math.sin(k * Math.PI) * (e.arc || 0) * W.h;
        const env = smoothstep(0, 0.12, q) * (e.fade ? 1 - smoothstep(e.fade, 1, q) : 1 - smoothstep(0.85, 1, q));
        const spr = e.c === 'pale' ? SP.pale : e.c === 'cold' ? SP.cold : SP.gold;
        glowAt(ctx, spr, x, y, 18 * u * e.size, env * 0.8);
        ctx.globalAlpha = env;
        ctx.fillStyle = e.c === 'gold' ? 'rgb(255,244,214)' : 'rgb(240,242,255)';
        ctx.fillRect(x - 1.2 * u, y - 1.2 * u, 2.4 * u, 2.4 * u);
      } else if (e.type === 'glint') {
        const p = A(e.id);
        if (!p) continue;
        const x = p.x + p.d * 0.1 * p.h, y = p.y - p.h * e.frac;
        const env = Math.sin(q * Math.PI);
        ctx.globalAlpha = env * 0.9;
        ctx.fillStyle = 'rgb(255,236,190)';
        const L = 7 * u;
        ctx.fillRect(x - L, y - 0.5, L * 2, 1); ctx.fillRect(x - 0.5, y - L, 1, L * 2);
        glowAt(ctx, SP.gold, x, y, L * 1.6, env * 0.6);
      } else if (e.type === 'oil') {
        // 角里的膏油，缓缓倒在大卫头上
        const s = A('samuel'), d = A('david');
        if (!s || !d) continue;
        // 角口（与 horn() 同一算法，倒油时角口朝下）；离得太远时就自他头上方落下
        const L = 0.2 * s.h, tilt = lerp(-0.9, 0.7, E.pour);
        let x0 = s.hand[0] + s.d * Math.cos(tilt) * L, y0 = s.hand[1] + Math.sin(tilt) * L;
        const x1 = d.head[0], y1 = d.head[1] - 0.04 * d.h;
        if (Math.abs(x0 - x1) > 0.3 * d.h || y0 > y1 - 0.12 * d.h) { x0 = d.head[0] + d.d * 0.04 * d.h; y0 = d.head[1] - 0.3 * d.h; }
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.8, 1, q));
        ctx.fillStyle = 'rgb(255,226,150)';
        for (let i = 0; i < 6; i++) {
          const ph = U.fract(W.t * 0.55 + i / 6), g = ph * ph;
          const x = lerp(x0, x1, Math.min(1, ph * 1.6)), y = lerp(y0, y1, g);
          ctx.globalAlpha = env * 0.85 * (1 - smoothstep(0.85, 1, ph));
          ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.8, 0.012 * s.h), Math.max(1.1, 0.02 * s.h), 0, 0, TAU); ctx.fill();
        }
        glowAt(ctx, SP.gold, x0, y0, d.h * 0.12, env * 0.5);
        glowAt(ctx, SP.gold, x1, y1, d.h * (0.25 + 0.3 * q), env * 0.65);
      } else if (e.type === 'spirit') {
        // 耶和华的灵大大感动大卫：自天旋下的光点
        const d = A('david');
        if (!d) continue;
        ctx.fillStyle = 'rgb(255,248,226)';
        for (let i = 0; i < 44; i++) {
          const st = rt(i * 3) * 0.5, ph = clamp((q - st) / 0.5, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const a = rt(i * 3 + 1) * TAU + ph * 5, R = (1 - ph) * (60 + 80 * rt(i * 3 + 2)) * u;
          const x = d.chest[0] + Math.cos(a) * R, y = lerp(-0.02 * W.h, d.chest[1], U.easeIn(ph)) + Math.sin(a) * R * 0.25;
          ctx.globalAlpha = Math.sin(ph * Math.PI) * 0.9;
          ctx.fillRect(x - u, y - u, 2 * u, 2 * u);
        }
        glowAt(ctx, SP.gold, d.chest[0], d.chest[1], d.h * (0.6 + q * 0.4), Math.sin(q * Math.PI) * 0.7);
      } else if (e.type === 'roar') {
        // 骂阵：自歌利亚脚下漫开的一片暗影（没有线）
        const g = A('goliath');
        if (!g) continue;
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 2; i++) {
          const ph = clamp(q * 1.3 - i * 0.3, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const R = g.h * (0.4 + ph * 1.4);
          ctx.globalAlpha = Math.sin(ph * Math.PI) * 0.5;
          ctx.drawImage(SP.dark, g.x - R, g.y - R * 0.28, R * 2, R * 0.56);
        }
        ctx.globalAlpha = Math.sin(q * Math.PI) * 0.3;
        ctx.drawImage(SP.dark, g.x - g.h * 0.5, g.y - g.h * 1.05, g.h, g.h * 1.1);
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'stones') {
        // 五块光滑石子：自溪中一粒一粒到他囊里
        const d = A('david');
        if (!d) continue;
        const bx = e.xf * W.w, by = gY(2, e.xf) + 8 * u;
        ctx.fillStyle = 'rgb(246,242,232)';
        for (let i = 0; i < 5; i++) {
          const ph = clamp((q - i * 0.14) / 0.3, 0, 1);
          if (ph <= 0 || ph >= 1) continue;
          const tx = d.x - d.d * 0.06 * d.h, ty = d.y - 0.42 * d.h;
          const x = lerp(bx + (i - 2) * 4 * u, tx, U.easeInOut(ph)), y = lerp(by, ty, U.easeInOut(ph)) - Math.sin(ph * Math.PI) * 14 * u;
          glowAt(ctx, SP.white, x, y, 7 * u, Math.sin(ph * Math.PI) * 0.8);
          ctx.globalAlpha = 0.95;
          ctx.beginPath(); ctx.ellipse(x, y, 1.6 * u, 1.2 * u, 0, 0, TAU); ctx.fill();
        }
      } else if (e.type === 'whirl') {
        // 机弦在头上旋转
        const d = A('david');
        if (!d) continue;
        const cx = d.x + d.d * 0.04 * d.h, cy = d.y - 1.16 * d.h, R = 0.3 * d.h;
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.9, 1, q));
        const a = W.t * (12 + 10 * q);
        ctx.strokeStyle = 'rgb(255,240,210)';
        glowAt(ctx, SP.gold, cx, cy, R * 1.8, env * 0.35);
        for (let k = 0; k < 3; k++) {
          ctx.lineWidth = Math.max(0.8, (1.6 - k * 0.4) * u);
          ctx.globalAlpha = env * (0.7 - k * 0.2);
          ctx.beginPath(); ctx.ellipse(cx, cy, R * (1 - k * 0.06), R * 0.42, 0, a - k * 1.4, a + 2.4 - k * 1.4); ctx.stroke();
        }
        ctx.globalAlpha = env;
        const sx = cx + Math.cos(a + 2.4) * R, sy = cy + Math.sin(a + 2.4) * R * 0.42;
        glowAt(ctx, SP.white, sx, sy, 9 * u, env);
        ctx.strokeStyle = 'rgb(200,180,150)'; ctx.lineWidth = Math.max(0.5, 0.6 * u);
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath(); ctx.moveTo(d.x + d.d * 0.05 * d.h, d.y - 1.0 * d.h); ctx.lineTo(sx, sy); ctx.stroke();
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'stone') {
        // 石子：一道白金的光，打中额
        const d = A('david'), g = A('goliath');
        if (!d || !g) continue;
        const x0 = d.x + d.d * 0.04 * d.h, y0 = d.y - 1.14 * d.h;
        const x1 = g.head[0] + g.d * 0.03 * g.h, y1 = g.head[1] + 0.07 * g.h;
        const k = 0.15 * q + 0.85 * U.easeIn(q);
        const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 0.18 * d.h;
        // 机弦放手处的一点白光
        glowAt(ctx, SP.white, x0, y0, 16 * u, (1 - smoothstep(0, 0.45, q)) * 0.9);
        // 一道渐渐淡去的长尾
        for (let i = 1; i <= 20; i++) {
          const kk = Math.max(0, k - i * 0.022);
          const tx = lerp(x0, x1, kk), ty = lerp(y0, y1, kk) - Math.sin(kk * Math.PI) * 0.18 * d.h;
          const f = 1 - i / 21;
          glowAt(ctx, SP.white, tx, ty, (3 + 7 * f) * u, f * f * 0.75);
        }
        glowAt(ctx, SP.gold, x, y, 14 * u, 0.7);
        ctx.globalAlpha = 1; ctx.fillStyle = 'rgb(255,255,246)';
        ctx.beginPath(); ctx.arc(x, y, 2.2 * u, 0, TAU); ctx.fill();
      } else if (e.type === 'flash') {
        const x = e.x * W.w, y = e.y * W.h;
        const env = Math.pow(1 - q, 2);
        glowAt(ctx, SP.white, x, y, (40 + 200 * q) * u, env);
        glowAt(ctx, SP.gold, x, y, (80 + 420 * q) * u, env * 0.55);
      } else if (e.type === 'spearFly') {
        // 扫罗抡枪（19:10）
        const x0 = e.x0 * W.w, y0 = e.y0 * W.h, x1 = e.x1 * W.w, y1 = e.y1 * W.h;
        const k = U.easeIn(q), x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 10 * u;
        const L = 50 * LS(2), dx = x1 - x0, dy = y1 - y0, n = Math.hypot(dx, dy) || 1;
        ctx.globalCompositeOperation = 'source-over';
        spearLine(ctx, x - dx / n * L, y - dy / n * L, x, y, Math.max(0.9, LS(2)), 1, STEEL, 0.3);
        ctx.globalCompositeOperation = 'lighter';
      } else if (e.type === 'arrow') {
        // 箭：自约拿单的弓飞过童子
        const x0 = e.x0 * W.w, x1 = e.x1 * W.w, y0 = gY(2, e.x0) - 30 * LS(2), y1 = gY(2, e.x1) + 2;
        const k = q, x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 40 * u;
        if (q < 0.98) {
          const px = lerp(x0, x1, Math.max(0, k - 0.06)), py = lerp(y0, y1, Math.max(0, k - 0.06)) - Math.sin(Math.max(0, k - 0.06) * Math.PI) * 40 * u;
          ctx.strokeStyle = 'rgb(255,236,190)'; ctx.lineWidth = Math.max(0.8, 1.1 * u);
          ctx.globalAlpha = 0.9;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
          glowAt(ctx, SP.gold, x, y, 6 * u, 0.6);
        } else glowAt(ctx, SP.gold, x1, y1, 8 * u, (1 - q) * 20);
      } else if (e.type === 'thread') {
        // 「愿耶和华在你我中间……为证，直到永远」：一线金光连着二人
        const a = A(e.a), b = A(e.b);
        if (!a || !b) continue;
        const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.55, 1, q));
        ctx.strokeStyle = 'rgb(255,232,176)';
        ctx.lineWidth = Math.max(0.6, 1 * u);
        ctx.globalAlpha = env * 0.7;
        const mx = (a.chest[0] + b.chest[0]) / 2, my = Math.min(a.chest[1], b.chest[1]) - 20 * u;
        ctx.beginPath(); ctx.moveTo(a.chest[0], a.chest[1]); ctx.quadraticCurveTo(mx, my, b.chest[0], b.chest[1]); ctx.stroke();
        glowAt(ctx, SP.gold, a.chest[0], a.chest[1], 12 * u, env * 0.6);
        glowAt(ctx, SP.gold, b.chest[0], b.chest[1], 12 * u, env * 0.6);
      } else if (e.type === 'pillar') {
        // 「愿耶和华在你我中间判断是非」：立在二人中间的一柱光
        const x = e.xf * W.w, y = gY(2, e.xf) + 6 * u;
        const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.7, 1, q));
        const w = 44 * u;
        ctx.globalAlpha = env * 0.55;
        ctx.drawImage(SP.pillar, x - w / 2, y - W.h * 0.62, w, W.h * 0.62);
        glowAt(ctx, SP.gold, x, y - 6 * u, w * 1.2, env * 0.4);
      } else if (e.type === 'lament') {
        // 倒下的人：一点小光升起，渐渐淡去
        const k = U.easeOut(q);
        const x = e.x * W.w + Math.sin(q * 6 + e.x * 40) * 5 * u, y = lerp(e.y, e.y - 0.22, k) * W.h;
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.35, 1, q));
        glowAt(ctx, SP.pale, x, y, 14 * u, env * 0.7);
        ctx.globalAlpha = env;
        ctx.fillStyle = 'rgb(236,238,255)';
        ctx.fillRect(x - u, y - u, 2 * u, 2 * u);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'town': drawTown(ctx, p); break;
      case 'house': drawHouse(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'olive': drawOlive(ctx, p); break;
      case 'tamarisk': drawTamarisk(ctx, p); break;
      case 'seat': drawSeat(ctx, p); break;
      case 'tent': drawTent(ctx, p); break;
      case 'stream': drawStream(ctx, p); break;
      case 'stone': drawStone(ctx, p); break;
      case 'cliff': drawCliff(ctx, p); break;
      case 'pit': drawPit(ctx, p); break;
      case 'mound': drawMound(ctx, p); break;
      case 'rise': drawRise(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { rise: -4, stream: -3, town: -2, cliff: -1, house: -1, olive: 0, tamarisk: 0, tent: 1, altar: 2, stone: 2, seat: 3, pit: 3, mound: 3 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  const HGT = { rise: 8, town: 22, house: 30, altar: 8, olive: 50, tamarisk: 60, seat: 6, tent: 14, stream: -6, stone: 16, cliff: 60, pit: 4, mound: 5 };

  const SCENE = {
    init() { sprites(); },
    resize() {
      if (!isCur()) return;
      const ox = W.w * 0.995;
      W.setOrigin('trees', ox, W.ridgeBaseY(2, ox));
    },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (const k of EKEYS) if (E[k] !== S[k]) E[k] = approachLin(E[k], S[k], f * 0.9);
      for (const k in S.heart) { const v = E.heart[k] || 0; if (v !== S.heart[k]) E.heart[k] = approachLin(v, S.heart[k], f * 0.8); }
      if (S.spear.who === 'wall') E.spearQ += f * 3;
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      U.safe('david.anc', () => ancStep(dt));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawSilence(ctx); return; }
      if (pass === 'mid') drawShunem(ctx);
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        for (const p of sortProps()) {
          if (p.layer !== l || p.a < 0.005) continue;
          drawKind(ctx, p);
        }
      }
      if (pass === 'air') {
        drawDeep(ctx);
        drawGearFront(ctx);
        drawDark(ctx);
        drawGaze(ctx);
        drawHearts(ctx);
        drawNotes(ctx);
        drawBundle(ctx);
        drawVeil(ctx);
        drawSleep(ctx);
        drawTorches(ctx);
        drawFX(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'near') drawGearBack(ctx);
      if (pass === 'mid' && hasCrowd('hunt')) {
        for (const m of members('hunt')) { const q = Am(m); if (q && q.a > 0.03) heldSpear(ctx, q, 1.38, Math.max(0.5, 0.018 * q.h), STEEL, 0, 0.2); }
      }
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; ANC.clear(); },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      ANC.clear();
      snapE();
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1), px = (p.kind === 'stream' ? p.x - 0.02 : p.x) * W.w, gy = gY(p.layer, p.x);
        const py = gy - (HGT[p.kind] || 10) * s;
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 12 * s, d };
      }
      // 扫罗的枪
      if (S.spear.who === 'ground' || S.spear.who === 'wall') {
        const s2 = LS(2), px = S.spear.x * W.w, py = gY(2, S.spear.x) - 40 * s2, d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: '扫罗的枪', x: px, y: py - 20 * s2, d };
      }
      return best;
    },
    // 恢复与看完一致的核对（走查工具用）
    sig() {
      const props = Array.from(P.values()).filter(p => !p.dying && p.ta > 0.5).map(p => [p.id, p.kind, Math.round(p.x * 100), p.label || '', Math.round(p.tfire * 10), Math.round(p.tlit * 10), Math.round(p.tgrow * 10), Math.round(p.tember * 10), Math.round(p.tdark * 10)].join(':')).sort();
      const hearts = Object.keys(S.heart).filter(k => S.heart[k] > 0.01).map(k => k + ':' + Math.round(S.heart[k] * 10)).sort();
      const st = {};
      for (const k of EKEYS) st[k] = Math.round(S[k] * 100) / 100;
      return { props, hearts, st, spear: S.spear.who + '@' + Math.round(S.spear.x * 100), jar: S.jar.who + '@' + Math.round(S.jar.x * 100), shield: S.shield.who, gspear: S.gspear, bow: S.bow };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：伯利恒的早晨（16:4–5）
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; ANC.clear(); S = fresh(); snapE(); }
  function setup() {
    // 犹大的山地：草青，花不多，树只在远处
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.4, land: 1, grass: 1, herbs: 0.7, trees: 0.3, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      bare: 0.2, bloom: 0.4, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0,
      dvDark: 0, dvVeil: 0, dvSleep: 0, dvSilence: 0, dvShunem: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    const ox = W.w * 0.995;
    W.setOrigin('trees', ox, W.ridgeBaseY(2, ox));
    W.goTo(0.31, 0, true);
    const lx = W.w * 0.96, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 26, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    // 伯利恒：小城、坛上献祭的火；撒母耳手里拿着盛满膏油的角；耶西和他的七个儿子排在城前
    prop('beth', 'town', { x: X.beth, size: 1.45, label: '伯利恒' });
    prop('altar', 'altar', { x: X.altar, fire: 0.8, label: '坛' });
    prop('oliveW', 'olive', { x: 0.468, size: 0.95, label: '橄榄树' });
    add('samuel', { label: '撒母耳', sex: 'm', age: 'elder', x: X.samuel, facing: 1, robe: ROBE.samuel, glow: 0.4, prop: null });
    S.horn = 1;
    add('jesse', { label: '耶西', sex: 'm', age: 'elder', x: X.jesse, facing: -1, robe: ROBE.jesse, glow: 0.25, v: 0.22 });
    const NAMES = ['以利押', '亚比拿达', '沙玛', '耶西的儿子', '耶西的儿子', '耶西的儿子', '耶西的儿子'];
    for (let i = 0; i < 7; i++) {
      add('b' + (i + 1), { label: NAMES[i], sex: 'm', age: 'adult', x: X.queue[i], facing: -1, robe: ROBE['b' + (i + 1)], glow: 0.12, scale: i === 0 ? 1.1 : 1 - i * 0.012, v: 0.04 + (i % 2) * 0.08, prop: null });
    }
    // 远处中景的岛上：放羊的少年站在羊群的左头，心里有一点光
    add('david', { label: '大卫', sex: 'm', age: 'adult', layer: 1, x: X.field, facing: -1, robe: ROBE.david, glow: 0.35, pose: 'stand', scale: 1, prop: 'staff' });
    herd('flockM', { kind: 'sheep', n: 6, x0: X.field + 0.02, x1: X.field + 0.1, layer: 1, label: '羊群' });
    S.heart.david = 0.35;
    avoid([0.44, 0.93]);
    snapE();
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每句话的经文不过四行，它的故事约三十秒：一按一放，便是一步）
  // ════════════════════════════════════════════════════════════
  const R = r => '撒母耳记上 ' + r;
  // ── 16:6–11 人是看外貌 ─────────────────────────────────────
  const V1 = [
    { text: '他们来的时候，撒母耳看见以利押，就心里说，耶和华的受膏者必定在他面前。', ref: R('16:6'), hold: 5.5 },
    { text: '耶和华却对撒母耳说：「不要看他的外貌和他身材高大，我不拣选他。<br>因为，耶和华不像人看人：人是看外貌；耶和华是看内心。」', ref: R('16:7'), hold: 8 },
    { text: '耶西叫他七个儿子都从撒母耳面前经过，撒母耳说：「这都不是耶和华所拣选的。」', ref: R('16:10'), hold: 6 },
    { text: '撒母耳对耶西说：「你的儿子都在这里吗？」<br>他回答说：「还有个小的，现在放羊。」', ref: R('16:11'), hold: 6 },
  ];
  // ── 16:12–13 你起来膏他 ────────────────────────────────────
  const V2 = [
    { text: '耶西就打发人去叫了他来。他面色光红，双目清秀，容貌俊美。<br>耶和华说：「这就是他，你起来膏他。」', ref: R('16:12'), hold: 8 },
    { text: '撒母耳就用角里的膏油，在他诸兄中膏了他。从这日起，耶和华的灵就大大感动大卫。<br>撒母耳起身回拉玛去了。', ref: R('16:13'), hold: 8 },
  ];
  // ── 16:14–23 耶和华的灵离开扫罗；琴 ─────────────────────────
  const V3 = [
    { text: '耶和华的灵离开扫罗，有恶魔从耶和华那里来扰乱他。', ref: R('16:14'), hold: 5.5 },
    { text: '其中有一个少年人说：「我曾见伯利恒人耶西的一个儿子善于弹琴，是大有勇敢的战士，<br>说话合宜，容貌俊美，耶和华也与他同在。」', ref: R('16:18'), hold: 8 },
    { text: '大卫到了扫罗那里，就侍立在扫罗面前。扫罗甚喜爱他，他就作了扫罗拿兵器的人。', ref: R('16:21'), hold: 5.5 },
    { text: '从神那里来的恶魔临到扫罗身上的时候，大卫就拿琴，用手而弹，<br>扫罗便舒畅爽快，恶魔离了他。', ref: R('16:23'), hold: 7.5 },
  ];
  // ── 17:3–37 以拉谷 ─────────────────────────────────────────
  const V4 = [
    { text: '非利士人站在这边山上，以色列人站在那边山上，当中有谷。<br>从非利士营中出来一个讨战的人，名叫歌利亚，是迦特人，身高六肘零一虎口；', ref: R('17:3–4'), hold: 7.5 },
    { text: '那非利士人又说：「我今日向以色列人的军队骂阵。你们叫一个人出来，与我战斗。」<br>扫罗和以色列众人听见非利士人的这些话，就惊惶，极其害怕。', ref: R('17:10–11'), hold: 7.5 },
    { text: '大卫对扫罗说：「人都不必因那非利士人胆怯。你的仆人要去与那非利士人战斗。」', ref: R('17:32'), hold: 5.5 },
    { text: '大卫又说：「耶和华救我脱离狮子和熊的爪，也必救我脱离这非利士人的手。」<br>扫罗对大卫说：「你可以去吧！耶和华必与你同在。」', ref: R('17:37'), hold: 7.5 },
  ];
  // ── 17:40–51 机弦与石子 ────────────────────────────────────
  const V5 = [
    { text: '他手中拿杖，又在溪中挑选了五块光滑石子，放在袋里，就是牧人带的囊里；<br>手中拿着甩石的机弦，就去迎那非利士人。', ref: R('17:40'), hold: 6.5 },
    { text: '大卫对非利士人说：「你来攻击我，是靠着刀枪和铜戟；<br>我来攻击你，是靠着万军之耶和华的名，就是你所怒骂带领以色列军队的神。」', ref: R('17:45'), hold: 7.5 },
    { text: '大卫用手从囊中掏出一块石子来，用机弦甩去，<br>打中非利士人的额，石子进入额内，他就仆倒，面伏于地。', ref: R('17:49'), hold: 7 },
    { text: '这样，大卫用机弦甩石，胜了那非利士人……<br>非利士众人看见他们讨战的勇士死了，就都逃跑。', ref: R('17:50–51'), hold: 6 },
  ];
  // ── 18 约拿单；千千与万万 ───────────────────────────────────
  const V6 = [
    { text: '约拿单爱大卫如同爱自己的性命，就与他结盟。<br>约拿单从身上脱下外袍，给了大卫，又将战衣、刀、弓、腰带都给了他。', ref: R('18:3–4'), hold: 7.5 },
    { text: '众妇女舞蹈唱和，说：「扫罗杀死千千，大卫杀死万万。」', ref: R('18:7'), hold: 5.5 },
    { text: '扫罗甚发怒，不喜悦这话……从这日起，扫罗就怒视大卫。', ref: R('18:8–9'), hold: 5.5 },
    { text: '扫罗见耶和华与大卫同在，又知道女儿米甲爱大卫，就更怕大卫，常作大卫的仇敌。', ref: R('18:28–29'), hold: 6.5 },
  ];
  // ── 19:10；20:36–42 墙上的枪；以色磐石 ─────────────────────
  const V7 = [
    { text: '扫罗用枪想要刺透大卫，钉在墙上，他却躲开，扫罗的枪刺入墙内。当夜大卫逃走，躲避了。', ref: R('19:10'), hold: 6.5 },
    { text: '「至于你我今日所说的话，有耶和华在你我中间为证，直到永远。」<br>……童子跑去，约拿单就把箭射在童子前头。', ref: R('20:23，36'), hold: 7 },
    { text: '童子一去，大卫就从磐石的南边出来，俯伏在地，拜了三拜；<br>二人亲嘴，彼此哭泣，大卫哭得更恸。', ref: R('20:41'), hold: 7 },
    { text: '约拿单对大卫说：「我们二人曾指着耶和华的名起誓说：<br>『愿耶和华在你我中间，并你我后裔中间为证，直到永远。』如今你平平安安地去吧！」', ref: R('20:42'), hold: 8 },
  ];
  // ── 21:9；22:1–2；23:14–17 山寨 ────────────────────────────
  const V8 = [
    { text: '祭司说：「你在以拉谷杀非利士人歌利亚的那刀在这里……」<br>大卫说：「这刀没有可比的！求你给我。」', ref: R('21:9'), hold: 6.5 },
    { text: '大卫就离开那里，逃到亚杜兰洞……凡受窘迫的、欠债的、心里苦恼的都聚集到大卫那里；<br>大卫就作他们的头目，跟随他的约有四百人。', ref: R('22:1–2'), hold: 7.5 },
    { text: '大卫住在旷野的山寨里，常在西弗旷野的山地。<br>扫罗天天寻索大卫，神却不将大卫交在他手里。', ref: R('23:14'), hold: 7 },
    { text: '扫罗的儿子约拿单起身，往那树林里去见大卫，使他倚靠神得以坚固，<br>对他说：「不要惧怕！……你必作以色列的王，我也作你的宰相……」', ref: R('23:16–17'), hold: 7 },
  ];
  // ── 24 隐基底的洞 ─────────────────────────────────────────
  const V9 = [
    { text: '到了路旁的羊圈，在那里有洞，扫罗进去大解。大卫和跟随他的人正藏在洞里的深处。', ref: R('24:3'), hold: 6 },
    { text: '……大卫就起来，悄悄地割下扫罗外袍的衣襟。……<br>「我的主乃是耶和华的受膏者，我在耶和华面前万不敢伸手害他，因他是耶和华的受膏者。」', ref: R('24:4–6'), hold: 7.5 },
    { text: '「我父啊，看看你外袍的衣襟在我手中……<br>愿耶和华在你我中间判断是非，在你身上为我伸冤，我却不亲手加害于你。」', ref: R('24:11–12'), hold: 7.5 },
    { text: '扫罗说：「我儿大卫，这是你的声音吗？」就放声大哭，<br>对大卫说：「你比我公义；因为你以善待我，我却以恶待你。」', ref: R('24:16–17'), hold: 6.5 },
  ];
  // ── 25 撒母耳死了；亚比该 ──────────────────────────────────
  const V10 = [
    { text: '撒母耳死了，以色列众人聚集，为他哀哭，将他葬在拉玛他自己的坟墓里。', ref: R('25:1'), hold: 6 },
    { text: '亚比该急忙将二百饼，两皮袋酒，五只收拾好了的羊……都驮在驴上……<br>亚比该骑着驴，正下山坡，见大卫和跟随他的人从对面下来，亚比该就迎接他们。', ref: R('25:18–20'), hold: 7.5 },
    { text: '「虽有人起来追逼你，寻索你的性命，<br>你的性命却在耶和华你的神那里蒙保护，如包裹宝器一样……」', ref: R('25:29'), hold: 7 },
    { text: '大卫对亚比该说：「耶和华以色列的神是应当称颂的，因为他今日使你来迎接我。<br>你和你的见识也当称赞；因为你今日拦阻我亲手报仇、流人的血。」', ref: R('25:32–33'), hold: 7.5 },
  ];
  // ── 26 哈基拉山的夜 ───────────────────────────────────────
  const V11 = [
    { text: '于是大卫和亚比筛夜间到了百姓那里，见扫罗睡在辎重营里；<br>他的枪在头旁，插在地上。押尼珥和百姓睡在他周围。', ref: R('26:7'), hold: 7 },
    { text: '大卫从扫罗的头旁拿了枪和水瓶，二人就走了，没有人看见，没有人知道，也没有人醒起，<br>都睡着了，因为耶和华使他们沉沉地睡了。', ref: R('26:12'), hold: 8 },
    { text: '扫罗听出是大卫的声音，就说：「我儿大卫，这是你的声音吗？」', ref: R('26:17'), hold: 5.5 },
    { text: '扫罗对大卫说：「我儿大卫，愿你得福！你必做大事，也必得胜。」<br>于是大卫起行，扫罗回他的本处去了。', ref: R('26:25'), hold: 7 },
  ];
  // ── 27；29–30 洗革拉 ──────────────────────────────────────
  const V12 = [
    { text: '大卫心里说：「必有一日我死在扫罗手里，不如逃奔非利士地去……」<br>当日亚吉将洗革拉赐给他。', ref: R('27:1，6'), hold: 6.5 },
    { text: '于是大卫和跟随他的人早晨起来，回往非利士地去……<br>第三日，大卫和跟随他的人到了洗革拉……不料，城已烧毁，他们的妻子儿女都被掳去了。', ref: R('29:11—30:3'), hold: 7.5 },
    { text: '大卫和跟随他的人就放声大哭，直哭得没有气力……大卫却倚靠耶和华他的神，心里坚固。……<br>耶和华说：「你可以追，必追得上，都救得回来。」', ref: R('30:4–8'), hold: 7.5 },
    { text: '凡亚玛力人所掳去的，无论大小、儿女、财物，大卫都夺回来，没有失落一个。', ref: R('30:19'), hold: 6 },
  ];
  // ── 28；31 基利波 ─────────────────────────────────────────
  const V13 = [
    { text: '非利士人聚集，来到书念安营；扫罗聚集以色列众人在基利波安营……<br>扫罗求问耶和华，耶和华却不藉梦，或乌陵，或先知回答他。', ref: R('28:4–6'), hold: 7 },
    { text: '撒母耳说：「耶和华已经离开你，且与你为敌，你何必问我呢？<br>耶和华照他藉我说的话，已经从你手里夺去国权，赐与别人，就是大卫。」', ref: R('28:16–17'), hold: 8 },
    { text: '这样，扫罗和他三个儿子，与拿他兵器的人，以及跟随他的人，都一同死亡。', ref: R('31:6'), hold: 6 },
    { text: '他们中间所有的勇士就起身，走了一夜……<br>将他们骸骨葬在雅比的垂丝柳树下，就禁食七日。', ref: R('31:12–13'), hold: 7.5 },
  ];

  // 以拉谷的布景
  function elah(b) {
    // 这边山上、那边山上，当中有谷：两道山冈，谷底是溪
    prop('riseP', 'rise', { x: 0.53, size: 1.3, label: '非利士人的山' });
    prop('riseI', 'rise', { x: 0.87, size: 1.4, label: '以色列人的山' });
    prop('brook', 'stream', { x: X.brook, label: '以拉谷的溪' });
    prop('tentP1', 'tent', { x: 0.458, size: 0.9, col: [150, 120, 92], label: '非利士人的帐棚' });
    prop('tentP2', 'tent', { x: 0.497, size: 0.8, col: [140, 108, 84] });
    prop('tentI1', 'tent', { x: 0.915, size: 0.9, label: '以色列人的帐棚' });
    prop('tentI2', 'tent', { x: 0.948, size: 0.8 });
    crowd('isr', { n: 12, x0: 0.79, x1: 0.94, layer: 2, label: '以色列人', robe: ROBE.israel, facing: -1, glow: 0.1 }, 'm');
    crowd('phil', { n: 12, x0: 0.47, x1: 0.585, layer: 2, label: '非利士人', robe: ROBE.phil, facing: 1, glow: 0.06 }, 'm');
    add('goliath', { label: '歌利亚', sex: 'm', age: 'adult', x: X.g0, facing: 1, robe: ROBE.goliath, glow: 0.05, scale: 1.72, v: 0.12, prop: null, beard: true });
    add('bearer', { label: '拿盾牌的人', sex: 'm', age: 'adult', x: X.g0 + 0.016, facing: 1, robe: ROBE.bearer, glow: 0.06, v: 0.18, prop: null });
    S.shield = { who: 'bearer', x: 0 }; S.gspear = 'goliath';
  }

  const STAGES = [
    // ── 1 · 人是看外貌；耶和华是看内心 ─────────────────────────
    {
      kind: 'judge', utter: '人是看外貌；耶和华是看内心', cmd: 'grep --heart 耶西/* | sort -r  # 不看外貌和身材', ref: '16:7',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        const beats = [
          // 以利押先到撒母耳面前，站住
          [0.3, () => { walk('b1', X.before, { speed: 0.05 }); }],
          [2.4, b => { pose('samuel', 'raise'); S.pour = 0; sfx(b, 'harp', { soft: true }); }],
          // 耶和华却对撒母耳说……：神看他的心——一点暗淡的光
          [L[1] + 0.8, b => { S.heart.b1 = 0.6; S.gaze = 1; pose('samuel', 'stand'); if (!b.instant) { const q = A('b1'); if (q) fx().ring(q.chest[0], q.chest[1], [220, 226, 255], M() * 0.08, 1.6, 1.2); } }],
          [L[1] + 5.2, () => { S.heart.b1 = 0; walk('b1', X.left[0], { speed: 0.05 }); }],
        ];
        // 其余的儿子一个一个从撒母耳面前经过
        for (let i = 1; i < 7; i++) {
          const t0 = L[1] + 5.6 + (i - 1) * 1.25, sp = 0.058;
          const reach = t0 + (X.queue[i] - X.before) / sp;
          const id = 'b' + (i + 1);
          beats.push([t0, () => walk(id, X.left[i], { speed: sp })]);
          beats.push([reach - 0.35, () => { S.heart[id] = 0.55; }]);
          beats.push([reach + 0.8, () => { S.heart[id] = 0; }]);
        }
        beats.push(
          [L[3] + 0.2, () => { face('samuel', 1); face('jesse', 1); S.gaze = 0; }],
          [L[3] + 2.2, () => { pose('jesse', 'point'); }],
          // 远处的田野上：放羊的小儿子，心里的光
          [L[3] + 3.4, b => { beamOn(b, 'david', { dur: 7, w: 60, r: 0.14 }); S.heart.david = 1; sfx(b, 'harp'); }],
          [L[3] + 4.6, () => { pose('david', 'stand'); face('david', -1); pose('jesse', 'stand'); }],
        );
        T(c, beats);
      },
    },
    // ── 2 · 这就是他，你起来膏他 ──────────────────────────────
    {
      kind: 'cmd', utter: '这就是他，你起来膏他', cmd: 'anoint 大卫 --oil 角 --among 诸兄', ref: '16:12',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, () => { walk('david', 1.07, { speed: 0.06 }); }],
          [0.6, () => { for (let i = 1; i <= 4; i++) walk('b' + i, [0.668, 0.688, 0.708, 0.728][i - 1], { speed: 0.05 }); walk('jesse', 0.752, { speed: 0.03 }); }],
          // 他跑到撒母耳面前，跪下（走到了就跪着）
          [3.8, b => { place('david', 1.04, 2); if (fig('david')) fig('david').scale = 1; hold('david', null); run('david', X.anoint, { speed: 0.085, pose: 'kneel' }); face('david', -1); if (!b.instant) glow('david', 0.45); }],
          [5.2, () => { for (let i = 1; i <= 7; i++) face('b' + i, i <= 4 ? -1 : 1); face('jesse', -1); }],
          // 撒母耳就用角里的膏油……膏了他：角口朝下，油一滴一滴落在他头上
          [L[1] + 0.4, b => { pose('samuel', 'raise'); S.pour = 1; sfx(b, 'harp', { soft: true }); }],
          [L[1] + 1.2, b => { fxl(b, { type: 'oil', dur: 3.4 }); }],
          // 耶和华的灵就大大感动大卫
          [L[1] + 3.4, b => {
            S.pour = 0; pose('samuel', 'stand');
            beamOn(b, 'david', { dur: 6.5, w: 90 }); fxl(b, { type: 'spirit', dur: 4.5 });
            glow('david', 0.6); S.heart.david = 1; sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 5.4, () => { pose('david', 'stand'); face('david', 1); }],
          [L[1] + 6.4, () => { S.horn = 0; walk('samuel', 1.1, { speed: 0.045 }); }],
        ]);
      },
    },
    // ── 3 · 耶和华的灵离开扫罗 ─────────────────────────────────
    {
      kind: 'judge', utter: '耶和华的灵离开扫罗', cmd: 'revoke 扫罗 --spirit 耶和华的灵  # 有恶魔来扰乱他', ref: '16:14',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.72, 28, b.instant);
            unprop('beth'); unprop('altar');
            for (let i = 1; i <= 7; i++) rm('b' + i);
            rm('jesse'); rm('samuel'); S.horn = 0;
            crm('flockM');
            walk('david', 1.08, { speed: 0.05 });
            S.heart.david = 0.35;
            // 基比亚：垂丝柳树下，扫罗坐着，手里拿着枪
            prop('tam', 'tamarisk', { x: X.tam, size: 1, label: '垂丝柳树' });
            prop('seat', 'seat', { x: X.seat });
            add('saul', { label: '扫罗', sex: 'm', age: 'adult', x: X.seat, facing: -1, robe: ROBE.saul, glow: 0.3, pose: 'seat', scale: 1.08, prop: null, beard: true });
            S.spear = { who: 'saul', x: 0 }; S.crown = 1;
            crowd('court', { n: 3, x0: 0.83, x1: 0.88, layer: 2, label: '扫罗的臣仆', robe: [140, 118, 96], facing: -1 }, 'm');
            avoid([0.6, 0.95]);
          }],
          // 耶和华的灵离开扫罗：一点光自他身上升去
          [1.6, b => { orbFrom(b, 'saul', [0.9, 0.08], { dur: 4.5, c: 'pale', size: 1.4 }); sfx(b, 'wind', { soft: true }); }],
          // 他从石座上起来，站在座旁（不站在座上）
          [3.4, () => { W.set('dvDark', 1); walk('saul', X.seat + 0.016, { speed: 0.02, pose: 'weep' }); face('saul', -1); }],
          [4.6, () => { rm('david'); }],
          // 少年人说……
          [L[1] + 0.3, () => { add('young', { label: '少年人', sex: 'm', age: 'adult', x: 0.825, facing: -1, robe: ROBE.young, glow: 0.15, v: 0.2 }); pose('young', 'bow'); }],
          [L[1] + 2.4, () => { pose('young', 'point'); face('young', 1); }],
          [L[1] + 3.2, () => {
            add('david', { label: '大卫', sex: 'm', age: 'adult', layer: 2, x: 1.05, facing: -1, robe: ROBE.david, glow: 0.5, scale: 1, pose: 'stand', prop: null });
            S.harp = 1;
            walk('david', X.harp, { speed: 0.05 });
            animal('ass', 'donkey', 1.09, { facing: -1, pack: true, label: '驴' });
            walk('ass', 0.9, { speed: 0.045 });
          }],
          [L[1] + 4.2, () => { face('young', -1); pose('young', 'stand'); }],
          // 大卫侍立在扫罗面前
          [L[2] + 0.2, () => { face('david', 1); walk('saul', X.seat, { speed: 0.02, pose: 'seat' }); face('saul', -1); }],
          [L[2] + 1.2, () => { pose('david', 'bow'); }],
          [L[2] + 2.8, () => { pose('david', 'stand'); }],
          // 大卫就拿琴，用手而弹……恶魔离了他
          [L[3] + 0.2, b => { pose('david', 'sit'); S.play = 1; sfx(b, 'harp'); }],
          [L[3] + 1.8, b => { W.set('dvDark', 0); sfx(b, 'harp', { soft: true }); }],
          [L[3] + 3.6, b => { glow('saul', 0.4); sfx(b, 'harp'); }],
        ]);
      },
    },
    // ── 4 · 耶和华使人得胜，不是用刀用枪 ───────────────────────
    {
      kind: 'act', utter: '耶和华使人得胜，不是用刀用枪', cmd: 'unequip 扫罗.armor --keep 杖,机弦  # 争战的胜败全在乎耶和华', ref: '17:47',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          // 一夜过去：以拉谷的早晨
          [0, b => {
            W.goTo(0.31, 8, b.instant);
            S.play = 0; S.harp = 0; W.set('dvDark', 0);
            walk('david', 1.08, { speed: 0.05 }); walk('ass', 1.12, { speed: 0.05 });
            crm('court'); rm('young');
          }],
          [2.6, () => {
            unprop('tam'); unprop('seat');
            rm('david'); rm('ass');
            elah();
            walk('saul', X.saulE, { speed: 0.04 });
            add('jonathan', { label: '约拿单', sex: 'm', age: 'adult', x: X.jonE, facing: -1, robe: ROBE.royal, glow: 0.3, prop: null, v: 0.1 });
            S.bow = 1;
            avoid([0.44, 0.99]);
          }],
          // 歌利亚出来讨战
          [5.4, () => { walk('goliath', X.g1, { speed: 0.016 }); walk('bearer', X.g1 + 0.017, { speed: 0.016 }); }],
          [L[1] + 0.2, b => {
            pose('goliath', 'raise'); fxl(b, { type: 'roar', dur: 3.2 }); sfx(b, 'thunder', { soft: true, low: true, far: true });
            if (!b.instant) { W.shake = Math.max(W.shake, 0.25); const g = A('goliath'); if (g) fx().dust(g.x, g.y, 26, [196, 176, 140], 26 * SU()); }
          }],
          [L[1] + 1.2, () => { cwalk('isr', 0.83, 0.95, { speed: 0.03, pose: 'bow' }); pose('saul', 'bow'); }],
          [L[1] + 3.6, () => { pose('goliath', 'stand'); }],
          // 大卫送食物到营里来
          [L[1] + 3.8, () => {
            add('david', { label: '大卫', sex: 'm', age: 'adult', layer: 2, x: 1.05, facing: -1, robe: ROBE.david, glow: 0.5, prop: 'bundle', v: 0.3 });
            walk('david', 0.878, { speed: 0.05 });
          }],
          [L[2] + 0.2, () => { face('david', 1); pose('saul', 'stand'); face('saul', -1); cpose('isr', 'stand'); }],
          // 扫罗的战衣与铜盔
          [L[2] + 2.2, () => { S.armor = 1; hold('david', null); }],
          [L[2] + 5.0, () => { S.armor = 0; }],
          // 耶和华必与你同在
          [L[3] + 0.3, b => { beamOn(b, 'david', { dur: 5, w: 56 }); pose('saul', 'raise'); }],
          [L[3] + 3.2, () => { pose('saul', 'stand'); hold('david', 'staff'); face('david', -1); walk('david', X.brook - 0.004, { speed: 0.05, pose: 'kneel' }); }],
        ]);
      },
    },
    // ── 5 · 我来攻击你，是靠着万军之耶和华的名 ───────────────────
    {
      kind: 'cmd', utter: '我来攻击你，是靠着万军之耶和华的名', cmd: 'sling --stones 5 --in-the-name 万军之耶和华  # 靠着他的名', ref: '17:45',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          // 五块光滑石子
          [0, b => { W.goTo(0.745, 19, b.instant); fxl(b, { type: 'stones', dur: 3, xf: XF(X.brook - 0.01) }); sfx(b, 'water', { soft: true }); }],
          [2.8, () => { S.stones = 1; S.sling = 1; pose('david', 'stand'); face('david', -1); }],
          [3.8, () => { walk('goliath', X.g2, { speed: 0.01 }); walk('bearer', X.g2 + 0.017, { speed: 0.01 }); }],
          // 靠着万军之耶和华的名
          [L[1] + 0.2, b => { pose('goliath', 'point'); face('goliath', 1); }],
          [L[1] + 1.4, b => {
            beamOn(b, 'david', { dur: 7, w: 70 });
            nameOver(b, 'david', '万军之耶和华', [255, 230, 160], { size: 0.04, sea: true, hold: 3.6 });
            sfx(b, 'angel', { soft: true });
          }],
          [L[1] + 4.6, () => { pose('goliath', 'stand'); }],
          // 大卫急忙往战场跑去；机弦；石子进入额内
          [L[2] + 0.3, () => { walk('goliath', X.g3, { speed: 0.012 }); walk('bearer', X.g3 + 0.017, { speed: 0.012 }); run('david', 0.702, { speed: 0.075 }); }],
          [L[2] + 1.4, b => { pose('david', 'raise'); fxl(b, { type: 'whirl', dur: 1.5 }); sfx(b, 'wind', { soft: true }); }],
          // 石子飞去（慢一点，看得见它的光）
          [L[2] + 2.85, b => { S.stones = 0; fxl(b, { type: 'stone', dur: 0.75 }); }],
          [L[2] + 3.6, b => {
            S.sling = 0.6;
            pose('goliath', 'fall');
            if (!b.instant) {
              const g = A('goliath');
              if (g) { fxl(b, { type: 'flash', dur: 1.6, x: g.head[0] / W.w, y: g.head[1] / W.h }); fx().dust(g.x + g.d * 0.4 * g.h, g.y, 50, [214, 190, 150], 34 * SU()); }
              W.shake = Math.max(W.shake, 0.9); W.flash = Math.max(W.flash, 0.35);
            }
            sfx(b, 'thunder', { soft: true, low: true });
          }],
          [L[2] + 4.6, () => { pose('david', 'stand'); S.shield = { who: 'ground', x: XF(X.g3 + 0.03) }; run('bearer', 0.4, { speed: 0.07 }); }],
          [L[2] + 4.8, b => { beamOn(b, 'david', { dur: 7, w: 80 }); }],
          [L[2] + 6.8, () => { rm('bearer'); }],
          // 非利士众人就都逃跑；以色列人呐喊
          [L[3] + 0.2, b => { cwalk('phil', 0.33, 0.44, { run: true, speed: 0.07 }); cpose('isr', 'raise'); sfx(b, 'crowd'); }],
          [L[3] + 2.4, () => { crm('phil'); cpose('isr', 'stand'); cwalk('isr', 0.76, 0.92, { speed: 0.04 }); unprop('tentP1'); unprop('tentP2'); }],
        ]);
      },
    },
    // ── 6 · 耶和华与大卫同在 ───────────────────────────────────
    {
      kind: 'act', utter: '耶和华与大卫同在', cmd: 'echo $WITH  # => 耶和华与大卫同在', ref: '18:28',
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          // 仍是以拉谷的黄昏（上一句已走到 0.745）：先结盟，妇女们出来迎接；夜才降下
          [0, () => {
            rm('goliath'); S.gspear = null; S.shield = { who: null, x: 0 }; S.sling = 0;
            unprop('brook'); unprop('tentI1'); unprop('tentI2'); unprop('riseP'); unprop('riseI');
            cwalk('isr', 1.02, 1.16, { speed: 0.04 });
            walk('saul', 0.8, { speed: 0.03 }); face('saul', -1);
            walk('jonathan', 0.742, { speed: 0.045 });
            walk('david', 0.716, { speed: 0.03 });
            avoid([0.6, 0.99]);
          }],
          [2.2, () => { crm('isr'); face('david', 1); face('jonathan', -1); }],
          // 约拿单与他结盟：外袍、刀、弓、腰带
          [3.2, b => { holdHands('david', 'jonathan', true); if (!b.instant) { const q = A('david'), p = A('jonathan'); if (q && p) fx().ring((q.chest[0] + p.chest[0]) / 2, q.chest[1], [255, 226, 160], M() * 0.07, 1.8, 1.4); } sfx(b, 'covenant'); }],
          [5.0, () => { add('david', { robe: ROBE.royal }); add('jonathan', { robe: ROBE.jonathanT }); S.swordD = 1; holdHands('david', 'jonathan', false); }],
          [5.6, b => { glint(b, 'david', 0.5); }],
          // 妇女们打鼓击磬，歌唱跳舞（黄昏里迎接得胜回来的人）
          [L[1] - 1.8, () => {
            crowd('women', { n: 8, x0: 1.03, x1: 1.16, layer: 2, label: '以色列的妇女', facing: -1, glow: 0.12 }, 'f');
            cwalk('women', 0.82, 0.94, { speed: 0.05 });
            S.timbrel = 1;
          }],
          [L[1] + 2.4, () => { cpose('women', 'raise'); }],
          [L[1] + 3.2, b => { cpose('women', 'stand'); nameOver(b, 'saul', '千千', [176, 190, 214], { size: 0.045, sea: true, hold: 2.8 }); sfx(b, 'crowd', { soft: true }); }],
          [L[1] + 3.8, b => { cpose('women', 'raise'); nameOver(b, 'david', '万万', [255, 222, 140], { size: 0.07, sea: true, hold: 3.2 }); }],
          [L[1] + 5.0, () => { cpose('women', 'stand'); }],
          [L[1] + 5.8, () => { cpose('women', 'raise'); }],
          // 扫罗就怒视大卫：夜降下来
          [L[2] + 0.2, b => { W.goTo(0.93, 12, b.instant); cpose('women', 'stand'); W.set('dvDark', 0.55); face('saul', -1); }],
          // 耶和华与大卫同在
          [L[3] + 0.2, b => { beamOn(b, 'david', { dur: 6, w: 64 }); cwalk('women', 1.04, 1.16, { speed: 0.04 }); S.timbrel = 0; }],
          [L[3] + 1.8, () => { walk('saul', 0.9, { speed: 0.025 }); }],
          [L[3] + 4.2, () => { crm('women'); face('saul', -1); }],
        ]);
      },
    },
    // ── 7 · 有耶和华在你我中间为证，直到永远 ────────────────────
    {
      kind: 'act', utter: '有耶和华在你我中间为证，直到永远', cmd: 'git commit -S --witness 耶和华 -m "你我中间，直到永远"', ref: '20:23',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          // 夜里，扫罗的房前：大卫弹琴，扫罗手里拿枪
          [0, b => {
            W.goTo(0.97, 5, b.instant);
            walk('jonathan', 1.08, { speed: 0.05 });
            prop('house', 'house', { x: X.house, size: 1.5, label: '扫罗的房' });
            prop('lamp7', 'pit', { x: 0.75, fire: 0.8, label: '火盆' });
            prop('seat', 'seat', { x: X.seat });
            walk('saul', X.seat, { speed: 0.05, pose: 'seat' }); face('saul', -1);
            walk('david', X.harp, { speed: 0.04, pose: 'sit' });
            S.harp = 1; W.set('dvDark', 1);
            avoid([0.58, 0.9]);
          }],
          [2.2, b => { rm('jonathan'); face('david', 1); S.play = 1; sfx(b, 'harp', { soft: true }); }],
          // 扫罗的枪刺入墙内
          [3.6, b => {
            pose('saul', 'seat');
            if (!b.instant) {
              const q = A('saul');
              const x0 = q ? q.hand[0] / W.w : X.seat, y0 = q ? q.hand[1] / W.h : 0.8;
              fxl(b, { type: 'spearFly', dur: 0.45, x0, y0, x1: XF(X.house + 0.022), y1: (gY(2, XF(X.house + 0.018)) - 30 * LS(2)) / W.h });
            }
            S.spear = { who: 'thrown', x: 0 }; S.play = 0;
            pose('david', 'kneel');
          }],
          [4.05, b => { S.spear = { who: 'wall', x: XF(X.house + 0.022) }; if (!b.instant) E.spearQ = 0; sfx(b, 'stone'); }],
          [4.6, () => { S.harp = 0; run('david', 0.5, { speed: 0.08 }); }],
          [6.6, () => { rm('david'); }],
          // 夜渐渐过去（十秒）
          [L[1] - 1.8, b => { W.goTo(0.3, 10, b.instant); }],
          // 次日早晨：以色磐石；约拿单与童子
          [L[1] - 0.6, () => {
            W.set('dvDark', 0);
            unprop('house'); unprop('seat'); unprop('lamp7'); rm('saul');
            S.spear = { who: 'saul', x: 0 };
            prop('ezel', 'stone', { x: X.ezel, size: 1.1, label: '以色磐石' });
            add('david', { label: '大卫', sex: 'm', age: 'adult', layer: 2, x: X.ezel - 0.02, facing: 1, robe: ROBE.royal, glow: 0.25, pose: 'kneel', prop: null, v: 0 });
            add('jonathan', { label: '约拿单', sex: 'm', age: 'adult', x: 1.05, facing: -1, robe: ROBE.jonathanT, glow: 0.3, prop: null, v: 0.1 });
            add('lad', { label: '童子', sex: 'm', age: 'child', x: 1.08, facing: -1, robe: ROBE.lad, glow: 0.2, prop: null, v: 0.2 });
            walk('jonathan', 0.8, { speed: 0.06 }); walk('lad', 0.783, { speed: 0.06 });
          }],
          [L[1] + 3.6, () => { run('lad', 0.7, { speed: 0.075 }); pose('jonathan', 'point'); face('jonathan', -1); }],
          [L[1] + 4.6, b => { fxl(b, { type: 'arrow', dur: 1.1, x0: XF(0.79), x1: XF(0.672) }); sfx(b, 'wind', { soft: true }); }],
          [L[1] + 5.2, b => { fxl(b, { type: 'arrow', dur: 1.1, x0: XF(0.79), x1: XF(0.662) }); }],
          [L[1] + 5.8, b => { fxl(b, { type: 'arrow', dur: 1.1, x0: XF(0.79), x1: XF(0.655) }); }],
          [L[1] + 6.6, () => { pose('jonathan', 'stand'); walk('lad', 0.664, { speed: 0.05, pose: 'bow' }); }],
          [L[2] - 0.4, () => { walk('lad', 0.787, { speed: 0.06 }); }],
          [L[2] + 1.6, () => { face('lad', 1); walk('lad', 1.1, { speed: 0.05 }); }],
          // 大卫从磐石的南边出来，俯伏在地，拜了三拜；二人彼此哭泣
          [L[2] + 0.4, () => { pose('david', 'stand'); walk('david', 0.705, { speed: 0.04, pose: 'bow' }); }],
          [L[2] + 3.0, () => { pose('david', 'stand'); }],
          [L[2] + 3.6, () => { pose('david', 'bow'); }],
          [L[2] + 4.3, () => { embrace('david', 'jonathan', { weep: true, at: 0.752 }); }],
          [L[2] + 4.0, () => { rm('lad'); }],
          // 如今你平平安安地去吧！
          [L[3] + 2.8, b => {
            pose('david', 'stand'); pose('jonathan', 'stand');
            walk('david', 0.56, { speed: 0.028 }); walk('jonathan', 0.95, { speed: 0.028 });
            fxl(b, { type: 'thread', dur: 7, a: 'david', b: 'jonathan' });
          }],
        ]);
      },
    },
    // ── 8 · 神却不将大卫交在他手里 ─────────────────────────────
    {
      kind: 'act', utter: '神却不将大卫交在他手里', cmd: 'shield 大卫 --from 扫罗  # 天天寻索，神却不交', ref: '23:14',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          // 挪伯：祭司把歌利亚的刀给他
          // 一整日缓缓过去：挪伯的早晨 → 山寨的黄昏
          [0, b => {
            W.goTo(0.73, 26, b.instant);
            W.set('bare', 0.55); W.set('bloom', 0.15); W.set('herbs', 0.45);
            unprop('ezel'); rm('jonathan');
            add('priest', { label: '亚希米勒', sex: 'm', age: 'elder', x: 0.53, facing: 1, robe: ROBE.priest, glow: 0.3, v: 0.1 });
            walk('david', 0.556, { speed: 0.04 });
            prop('cliff', 'cliff', { x: X.cave, label: '亚杜兰洞' });
            avoid([0.5, 0.97]);
          }],
          [1.8, () => { face('david', -1); face('priest', 1); }],
          [2.8, b => { S.swordD = 1; glint(b, 'david', 0.45); sfx(b, 'chime', { soft: true }); }],
          [5.0, () => { rm('priest'); face('david', 1); walk('david', X.cave - 0.012, { speed: 0.04 }); }],
          // 凡受窘迫的……都聚集到大卫那里
          [L[1] + 0.3, () => {
            crowd('men', { n: 9, x0: 1.03, x1: 1.2, layer: 2, label: '跟随大卫的人', robe: ROBE.men, facing: -1, glow: 0.1 }, 'm');
            cwalk('men', 0.7, 0.86, { speed: 0.035 });
          }],
          [L[1] + 3.0, () => { face('david', 1); }],
          [L[1] + 6.0, () => { cface('men', -1); }],
          // 扫罗天天寻索大卫：中景的山上一队人来来去去；神的遮护
          [L[2] + 0.2, b => {
            crowd('hunt', { n: 9, x0: 1.02, x1: 1.12, layer: 1, label: '扫罗的人', robe: ROBE.saulmen, facing: -1, glow: 0.04 }, 'm');
            cwalk('hunt', 0.5, 0.64, { speed: 0.03 });
            W.set('dvVeil', 1);
            cpose('men', 'sit');
            sfx(b, 'harp', { soft: true });
          }],
          [L[2] + 2.0, () => { prop('grove1', 'olive', { x: 0.878, size: 1.05, label: '树林' }); prop('grove2', 'olive', { x: 0.925, size: 0.9 }); }],
          // 约拿单往那树林里去见大卫
          [L[3] + 0.1, () => {
            add('jonathan', { label: '约拿单', sex: 'm', age: 'adult', x: 1.05, facing: -1, robe: ROBE.jonathanT, glow: 0.3, prop: null, v: 0.14 });
            walk('jonathan', X.cave + 0.012, { speed: 0.065 });
            walk('david', X.cave - 0.01, { speed: 0.03 });
          }],
          [L[3] + 5.6, b => { holdHands('david', 'jonathan', true); if (!b.instant) { const q = A('david'); if (q) fx().ring(q.chest[0] + q.h * 0.3, q.chest[1], [255, 226, 160], M() * 0.07, 1.8, 1.4); } sfx(b, 'covenant'); }],
        ]);
      },
    },
    // ── 9 · 愿耶和华在你我中间判断是非 ─────────────────────────
    {
      kind: 'act', utter: '愿耶和华在你我中间判断是非', cmd: 'diff 扫罗 大卫 | judge --by 耶和华  # 我却不亲手加害于你', ref: '24:12',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        const MOUTH = X.cave;
        T(c, [
          // 隐基底的野羊的磐石；扫罗领三千精兵来
          // 仍是黄昏（上一句已走到 0.73）：不再一句之内昼夜翻转
          [0, () => {
            holdHands('david', 'jonathan', false);
            walk('jonathan', 1.08, { speed: 0.06 });
            crm('hunt'); W.set('dvVeil', 0);
            unprop('grove1'); unprop('grove2');
            prop('cliff', 'cliff', { x: X.cave, label: '隐基底的洞' });
            herd('goats', { kind: 'goat', n: 5, x0: 0.86, x1: 0.94, label: '野羊', mill: true });
            cwalk('men', MOUTH - 0.024, MOUTH + 0.016, { speed: 0.03, pose: 'sit' });
            walk('david', MOUTH - 0.006, { speed: 0.03, pose: 'kneel' });
            avoid([0.55, 0.84]);
          }],
          [1.6, () => { S.caveDeep = 1; rm('jonathan'); }],
          [1.8, () => {
            crowd('saulmen', { n: 9, x0: 1.02, x1: 1.18, layer: 2, label: '扫罗的精兵', robe: ROBE.saulmen, facing: -1, glow: 0.05 }, 'm');
            cwalk('saulmen', 0.86, 0.98, { speed: 0.05 });
            add('saul', { label: '扫罗', sex: 'm', age: 'adult', x: 1.06, facing: -1, robe: ROBE.saul, glow: 0.3, scale: 1.08, prop: null, beard: true, pose: 'stand' });
            S.spear = { who: 'saul', x: 0 }; S.crown = 1;
            walk('saul', MOUTH + 0.036, { speed: 0.06, pose: 'sit' });
          }],
          [L[1] - 0.8, () => { face('saul', 1); crm('goats'); }],
          // 悄悄地割下扫罗外袍的衣襟
          [L[1] + 0.4, () => { pose('david', 'stand'); walk('david', MOUTH + 0.024, { speed: 0.012 }); }],
          [L[1] + 3.2, b => { S.corner = 1; glint(b, 'saul', 0.25); }],
          [L[1] + 3.8, () => { walk('david', MOUTH - 0.004, { speed: 0.015, pose: 'kneel' }); }],
          [L[1] + 5.6, b => { ringOn(b, 'david', [80, 60, 60], 0.06, 0.5); }],
          // 扫罗起来出去；大卫出来，呼叫；屈身，脸伏于地
          [L[2] + 0.1, () => { pose('saul', 'stand'); walk('saul', 0.83, { speed: 0.035 }); }],
          [L[2] + 1.6, () => { pose('david', 'stand'); walk('david', 0.738, { speed: 0.035 }); }],
          [L[2] + 3.8, () => { face('saul', -1); }],
          [L[2] + 4.3, () => { pose('david', 'fall'); }],
          [L[2] + 6.2, b => { pose('david', 'raise'); fxl(b, { type: 'pillar', dur: 11, xf: XF(0.784) }); sfx(b, 'harp'); }],
          // 扫罗放声大哭
          [L[3] + 0.3, b => { pose('saul', 'weep'); pose('david', 'stand'); sfx(b, 'weep', { soft: true }); }],
        ]);
      },
    },
    // ── 10 · 你的性命却在耶和华你的神那里蒙保护 ──────────────────
    {
      kind: 'act', utter: '你的性命却在耶和华你的神那里蒙保护', cmd: 'wrap --precious 大卫.life  # 如包裹宝器一样', ref: '25:29',
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          // 撒母耳死了：远处一点淡光升起
          [0, b => {
            W.goTo(0.42, 18, b.instant);
            pose('saul', 'stand'); walk('saul', 1.1, { speed: 0.05 }); cwalk('saulmen', 1.05, 1.2, { speed: 0.05 });
            S.caveDeep = 0; S.corner = 0;
            orb(b, [0.9, (gY(1, 0.9) - 6) / W.h], [0.93, 0.12], { dur: 6, c: 'pale', size: 1.2, fade: 0.55 });
            cpose('men', 'kneel'); pose('david', 'kneel');
            sfx(b, 'weep', { soft: true, far: true });
          }],
          [3.6, () => {
            rm('saul'); crm('saulmen');
            unprop('cliff');
            // 迦密：拿八剪羊毛
            prop('shear', 'tent', { x: X.shear, size: 1.05, lit: 0.5, col: [96, 70, 56], label: '拿八的帐棚' });
            // 拿八的羊在远处中景的岛上吃草（不挡着近处的人与驴）
            herd('nabalF', { kind: 'sheep', n: 7, x0: 0.8, x1: 0.95, layer: 1, label: '拿八的羊', mill: true });
            add('nabal', { label: '拿八', sex: 'm', age: 'adult', x: 0.905, facing: -1, robe: ROBE.nabal, glow: 0.05, pose: 'sit', scale: 1.1, beard: true });
            avoid([0.55, 0.93]);
          }],
          [4.4, () => { cpose('men', 'stand'); pose('david', 'stand'); }],
          [5.2, b => { S.swords = 1; cwalk('men', 0.6, 0.71, { speed: 0.03 }); walk('david', 0.726, { speed: 0.03 }); sfx(b, 'chime', { soft: true }); }],
          // 亚比该骑着驴下山坡
          [L[1] + 0.2, () => {
            animal('don0', 'donkey', 1.04, { facing: -1, label: '驴' });
            add('abigail', { label: '亚比该', sex: 'f', age: 'adult', x: 1.04, facing: -1, robe: ROBE.abigail, glow: 0.35, prop: null });
            ride('abigail', 'don0');
            animal('don1', 'donkey', 1.09, { facing: -1, pack: true, label: '驮着礼物的驴' });
            animal('don2', 'donkey', 1.13, { facing: -1, pack: true, label: '驮着礼物的驴' });
            walk('don0', 0.79, { speed: 0.04 }); walk('don1', 0.835, { speed: 0.04 }); walk('don2', 0.872, { speed: 0.04 });
          }],
          [L[1] + 6.6, () => { ride('abigail', null); }],
          [L[1] + 7.0, () => { walk('abigail', 0.752, { speed: 0.03, pose: 'fall' }); }],
          // 如包裹宝器一样
          [L[2] + 0.4, b => { S.bundle = 1; S.swords = 0.35; sfx(b, 'harp'); }],
          // 大卫祝福亚比该；收刀
          [L[3] + 0.2, b => { pose('david', 'raise'); S.swords = 0; sfx(b, 'harp', { soft: true }); }],
          [L[3] + 2.2, () => { pose('david', 'stand'); pose('abigail', 'stand'); }],
          [L[3] + 3.6, () => { S.bundle = 0.35; walk('abigail', 1.06, { speed: 0.035 }); walk('don0', 1.09, { speed: 0.035 }); walk('don1', 0.6, { speed: 0.03 }); walk('don2', 0.585, { speed: 0.03 }); }],
        ]);
      },
    },
    // ── 11 · 耶和华使他们沉沉地睡了 ────────────────────────────
    {
      kind: 'act', utter: '耶和华使他们沉沉地睡了', cmd: 'sleep --deep 扫罗营  # 没有人看见，没有人知道', ref: '26:12',
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.99, 8, b.instant);
            W.set('bare', 0.5);
            unprop('shear'); crm('nabalF'); rm('nabal'); rm('abigail'); rm('don0'); rm('don1'); rm('don2');
            crm('men'); S.bundle = 0; S.swords = 0;
            walk('david', 0.56, { speed: 0.035 }); glow('david', 0.6);
            add('abishai', { label: '亚比筛', sex: 'm', age: 'adult', x: 0.525, facing: 1, robe: ROBE.abishai, glow: 0.35, prop: null, v: 0.12 });
            avoid([0.52, 0.99]);
          }],
          // 扫罗睡在辎重营里；他的枪在头旁，插在地上（夜已深了，营才显出来）
          [6.2, () => {
            add('saul', { label: '扫罗', sex: 'm', age: 'adult', x: X.bed, facing: 1, robe: ROBE.saul, glow: 0.25, scale: 1.08, prop: null, beard: true, pose: 'lie', v: 0.1 });
            S.spear = { who: 'ground', x: XF(X.spear) }; S.jar = { who: 'ground', x: XF(X.jar) }; S.crown = 1;
            add('abner', { label: '押尼珥', sex: 'm', age: 'adult', x: X.abner, facing: -1, robe: ROBE.abner, glow: 0.12, pose: 'lie', v: 0.2 });
            crowd('sleepers', { n: 9, x0: 0.64, x1: 0.9, layer: 2, label: '扫罗的百姓', robe: ROBE.saulmen, pose: 'lie', glow: 0.1 }, 'm');
            prop('pit1', 'pit', { x: 0.708, fire: 0.8, label: '营火' });
            prop('pit2', 'pit', { x: 0.858, fire: 0.7 });
            face('david', 1); face('abishai', 1);
          }],
          [6.8, () => { walk('david', 0.742, { speed: 0.034 }); walk('abishai', 0.727, { speed: 0.034 }); }],
          // 耶和华使他们沉沉地睡了
          [L[1] + 0.2, b => { W.set('dvSleep', 1); prop('pit1', null, { fire: 0.5, ember: 1 }); prop('pit2', null, { fire: 0.45, ember: 1 }); sfx(b, 'harp', { soft: true }); }],
          [L[1] + 4.4, b => { S.spear = { who: 'david', x: 0 }; glint(b, 'david', 0.8); }],
          [L[1] + 5.0, () => { S.jar = { who: 'abishai', x: 0 }; hold('abishai', 'jar'); }],
          [L[1] + 5.8, () => { walk('david', X.hill, { speed: 0.03 }); walk('abishai', X.hill - 0.016, { speed: 0.03 }); }],
          // 大卫呼叫；扫罗听出是大卫的声音
          [L[2] + 1.4, b => { face('david', -1); face('abishai', -1); ringOn(b, 'david', [226, 232, 255], 0.07, 0.9); sfx(b, 'chime'); }],
          [L[2] + 2.4, () => { pose('abner', 'sit'); W.set('dvSleep', 0.25); }],
          [L[2] + 3.0, () => { pose('saul', 'sit'); }],
          [L[2] + 4.8, () => { pose('saul', 'stand'); face('saul', 1); }],
          // 我儿大卫，愿你得福
          [L[3] + 0.2, () => { pose('david', 'raise'); }],
          [L[3] + 1.6, b => { pose('saul', 'raise'); W.goTo(0.26, 12, b.instant); W.set('dvSleep', 0); }],
          [L[3] + 3.4, () => { cpose('sleepers', 'sit'); pose('abner', 'stand'); }],
          [L[3] + 4.6, () => { pose('saul', 'stand'); pose('david', 'stand'); S.spear = { who: 'ground', x: XF(X.hill - 0.026) }; }],
        ]);
      },
    },
    // ── 12 · 你可以追，必追得上，都救得回来 ──────────────────────
    {
      kind: 'promise', utter: '你可以追，必追得上，都救得回来', cmd: 'git restore --source=亚玛力 --all  # 没有失落一个', ref: '30:8',
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          // 投奔非利士地；亚吉将洗革拉赐给他
          [0, b => {
            W.goTo(0.4, 9, b.instant);
            W.set('bare', 0.42);
            rm('saul'); rm('abner'); crm('sleepers'); unprop('pit1'); unprop('pit2');
            S.spear = { who: null, x: 0 }; S.jar = { who: null, x: 0 }; hold('abishai', null);
            W.set('dvSleep', 0);
            walk('david', 0.705, { speed: 0.04 }); walk('abishai', 0.69, { speed: 0.04 });
            avoid([0.45, 0.99]);
          }],
          [2.4, () => {
            prop('ziklag', 'town', { x: X.ziklag, size: 1.35, label: '洗革拉' });
            crowd('men', { n: 9, x0: 1.03, x1: 1.18, layer: 2, label: '跟随大卫的人', robe: ROBE.men, facing: -1, glow: 0.1 }, 'm');
            cwalk('men', 0.72, 0.82, { speed: 0.05 });
            crowd('fam', { n: 8, x0: 1.04, x1: 1.2, layer: 2, label: '他们的妻子儿女', facing: -1, glow: 0.14 });
            cwalk('fam', 0.8, 0.95, { speed: 0.05 });
            add('abigail', { label: '亚比该', sex: 'f', age: 'adult', x: 1.06, facing: -1, robe: ROBE.abigail, glow: 0.35, prop: null, v: 0.2 });
            walk('abigail', 0.79, { speed: 0.05 });
          }],
          // 回来的第三日：城已烧毁
          [L[1] + 0.2, () => { cwalk('men', 0.47, 0.58, { speed: 0.055 }); walk('david', 0.6, { speed: 0.055 }); walk('abishai', 0.585, { speed: 0.055 }); }],
          [L[1] + 1.8, b => { prop('ziklag', null, { ember: 1 }); sfx(b, 'fire'); }],
          [L[1] + 2.8, () => { crm('fam'); rm('abigail'); }],
          [L[1] + 4.8, () => { prop('ziklag', null, { ember: 0.3, dark: 1 }); cwalk('men', 0.66, 0.8, { speed: 0.05 }); walk('david', 0.716, { speed: 0.05 }); walk('abishai', 0.7, { speed: 0.05 }); }],
          // 放声大哭；大卫倚靠耶和华；你可以追
          [L[2] + 0.2, b => { cpose('men', 'weep'); pose('david', 'weep'); pose('abishai', 'weep'); sfx(b, 'weep'); }],
          [L[2] + 3.0, b => { pose('david', 'pray'); beamOn(b, 'david', { dur: 6, w: 64 }); }],
          [L[2] + 5.4, b => { ringOn(b, 'david', [255, 236, 190], 0.07, 0.6); sfx(b, 'harp'); }],
          [L[2] + 6.6, () => { cpose('men', 'stand'); pose('david', 'stand'); pose('abishai', 'stand'); face('david', 1); }],
          [L[2] + 7.4, () => { cwalk('men', 1.08, 1.22, { run: true, speed: 0.08 }); run('david', 1.1, { speed: 0.08 }); run('abishai', 1.12, { speed: 0.08 }); }],
          // 都夺回来，没有失落一个
          [L[3] + 0.3, () => {
            prop('ziklag', null, { ember: 0 });
            cwalk('men', 0.62, 0.76, { speed: 0.055 }); walk('david', 0.705, { speed: 0.055 }); walk('abishai', 0.688, { speed: 0.055 });
            crowd('fam', { n: 8, x0: 1.08, x1: 1.24, layer: 2, label: '他们的妻子儿女', facing: -1, glow: 0.14 });
            cwalk('fam', 0.78, 0.93, { speed: 0.06 });
            add('abigail', { label: '亚比该', sex: 'f', age: 'adult', x: 1.12, facing: -1, robe: ROBE.abigail, glow: 0.35, prop: null, v: 0.2 });
            walk('abigail', 0.728, { speed: 0.065 });
            herd('spoil', { kind: 'sheep', n: 7, x0: 1.1, x1: 1.26, label: '夺回的群畜' });
            cwalk('spoil', 0.85, 0.95, { speed: 0.05 });
          }],
          [L[3] + 4.6, b => { face('david', 1); beamOn(b, 'david', { dur: 5, w: 80 }); sfx(b, 'crowd', { soft: true }); }],
        ]);
      },
    },
    // ── 13 · 已经从你手里夺去国权，赐与别人，就是大卫 ─────────────
    {
      kind: 'judge', utter: '已经从你手里夺去国权，赐与别人，就是大卫', cmd: 'chown -R 大卫 以色列.kingdom  # 基利波', ref: '28:17',
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const FALLEN = ['jonathan', 'abinadab', 'malchishua', 'saul', 'armsman'];
        T(c, [
          // 洗革拉隐去；基利波的夜，书念的营火
          [0, b => {
            W.goTo(0.97, 8, b.instant);
            W.set('bare', 0.3);
            rm('david'); rm('abigail'); rm('abishai'); crm('men'); crm('fam'); crm('spoil');
            unprop('ziklag');
            avoid([0.7, 0.99]);
          }],
          [2.6, () => {
            add('saul', { label: '扫罗', sex: 'm', age: 'adult', x: X.gil, facing: -1, robe: ROBE.saul, glow: 0.3, scale: 1.08, prop: null, beard: true, pose: 'stand', v: 0.1 });
            S.spear = { who: 'saul', x: 0 }; S.crown = 1;
            add('jonathan', { label: '约拿单', sex: 'm', age: 'adult', x: 0.868, facing: -1, robe: ROBE.jonathanT, glow: 0.3, prop: null, v: 0.14 });
            add('abinadab', { label: '亚比拿达', sex: 'm', age: 'adult', x: 0.888, facing: -1, robe: ROBE.son1, glow: 0.2, prop: null, v: 0.06 });
            add('malchishua', { label: '麦基舒亚', sex: 'm', age: 'adult', x: 0.906, facing: -1, robe: ROBE.son2, glow: 0.2, prop: null, v: 0.18 });
            add('armsman', { label: '拿兵器的人', sex: 'm', age: 'adult', x: 0.82, facing: -1, robe: ROBE.armsman, glow: 0.15, prop: null, v: 0.22 });
            crowd('isr', { n: 8, x0: 0.76, x1: 0.94, layer: 2, label: '以色列人', robe: ROBE.israel, facing: -1, glow: 0.06 }, 'm');
            prop('pitG1', 'pit', { x: 0.785, fire: 0.7, label: '营火' });
            prop('pitG2', 'pit', { x: 0.945, fire: 0.6 });
            W.set('dvShunem', 1);
          }],
          [4.4, () => { walk('saul', 0.8, { speed: 0.03, pose: 'pray' }); }],
          // 耶和华却不藉梦，或乌陵，或先知回答他：天沉默，暗下来（不改动天上的星的程度）
          [6.2, b => { W.set('dvSilence', 1); if (!b.instant) { const q = A('saul'); if (q) orb(b, [q.head[0] / W.w, q.head[1] / W.h], [q.head[0] / W.w + 0.02, 0.3], { dur: 4, c: 'pale', size: 0.8, fade: 0.3 }); } }],
          // 耶和华已经离开你……国权赐与别人
          [L[1] + 0.4, b => { beamOn(b, 'saul', { dur: 6, w: 50, cold: true }); sfx(b, 'thunder', { soft: true, far: true }); }],
          [L[1] + 1.8, () => { pose('saul', 'fall'); }],
          [L[1] + 3.6, b => { S.crown = 0.25; if (!b.instant) { const q = A('saul'); if (q) orb(b, [q.chest[0] / W.w, q.chest[1] / W.h], [1.04, 0.5], { dur: 5, c: 'gold', size: 1.2, arc: 0.06 }); } sfx(b, 'chime', { soft: true }); }],
          // 夜的末了：天只渐渐发白（停在破晓之前，不再回到白昼或黑夜）
          [L[2] - 2.4, b => { W.goTo(0.235, 9, b.instant); }],
          [L[2] - 0.6, () => { pose('saul', 'stand'); }],
          // 扫罗和他三个儿子……都一同死亡
          [L[2] + 0.2, b => {
            W.set('dvShunem', 0); prop('pitG1', null, { fire: 0, ember: 0.4 }); prop('pitG2', null, { fire: 0, ember: 0.4 });
            cwalk('isr', 1.05, 1.24, { run: true, speed: 0.07 }); sfx(b, 'crowd', { far: true });
          }],
          [L[2] + 1.2, b => { lamentFall(b, 'jonathan'); }],
          [L[2] + 1.9, b => { lamentFall(b, 'abinadab'); }],
          [L[2] + 2.4, () => { crm('isr'); }],
          [L[2] + 2.6, b => { lamentFall(b, 'malchishua'); }],
          [L[2] + 3.6, b => { lamentFall(b, 'saul'); S.crown = 0; }],
          [L[2] + 4.3, b => { lamentFall(b, 'armsman'); sfx(b, 'weep', { soft: true }); }],
          // 倒下的人渐渐隐去，只留下升起的小光；黑暗落在地上
          [L[2] + 5.8, () => {
            for (const id of FALLEN) rm(id);
            S.spear = { who: null, x: 0 }; unprop('pitG1'); unprop('pitG2');
            W.set('dvSilence', 0.5); W.set('gloom', 0.45);
          }],
          // 雅比的勇士走了一夜（火把），把骸骨葬在垂丝柳树下，就禁食七日
          [L[3] + 0.1, () => {
            prop('tamJ', 'tamarisk', { x: X.tamJ, size: 1.05, label: '雅比的垂丝柳树' });
            crowd('jabesh', { n: 6, x0: 1.02, x1: 1.12, layer: 2, label: '雅比的勇士', robe: ROBE.jabesh, facing: -1, glow: 0.12, prop: 'torch' }, 'm');
            cwalk('jabesh', 0.8, 0.9, { speed: 0.07 });
          }],
          [L[3] + 3.4, () => { cwalk('jabesh', X.tamJ + 0.022, X.tamJ + 0.1, { speed: 0.07 }); cface('jabesh', -1); }],
          // 天亮了：黑暗退去，太阳出来（只变亮）
          [L[3] + 4.5, b => { W.set('gloom', 0); W.set('dvSilence', 0); W.goTo(0.268, 9, b.instant); }],
          [L[3] + 5.2, () => { prop('mound', 'mound', { x: X.mound, grow: 1, label: '雅比的坟' }); }],
          [L[3] + 7.6, () => { cpose('jabesh', 'sit'); prop('mound', null, { lit: 0.8 }); }],
        ]);
      },
    },
  ];
  // 倒下：内里的光熄灭，一点小光升起
  function lamentFall(b, id) {
    pose(id, 'fall');
    glow(id, 0);
    if (b.instant) return;
    const q = A(id);
    if (q) fxl(b, { type: 'lament', dur: 5.5, x: q.chest[0] / W.w, y: q.chest[1] / W.h });
  }

  GS.book.act({
    id: ACT, book: '撒母耳记上', books: [9], title: '大卫', sub: '撒母耳记上 16 — 31', tint: [255, 220, 180], music: 'jacob',
    // 末一句的故事约 32 秒；再让晨光里的坟与坐着的勇士停留十余秒，才落幕
    outro: 46,
    intro: [
      { text: '耶和华对撒母耳说：「我既厌弃扫罗作以色列的王，你为他悲伤要到几时呢？<br>你将膏油盛满了角，我差遣你往伯利恒人耶西那里去；因为我在他众子之内，预定一个作王的。」', ref: '撒母耳记上 16:1', hold: 8 },
      { text: '撒母耳就照耶和华的话去行。到了伯利恒……<br>撒母耳就使耶西和他众子自洁，请他们来吃祭肉。', ref: '撒母耳记上 16:4–5', hold: 6.5 },
    ],
    // 全书终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '大卫': { text: '大卫做事无不精明，耶和华也与他同在。', ref: '撒母耳记上 18:14' },
      '扫罗': { text: '扫罗惧怕大卫；因为耶和华离开自己，与大卫同在。', ref: '撒母耳记上 18:12' },
      '约拿单': { text: '……约拿单的心与大卫的心深相契合。约拿单爱大卫，如同爱自己的性命。', ref: '撒母耳记上 18:1' },
      '撒母耳': { text: '撒母耳就用角里的膏油，在他诸兄中膏了他。', ref: '撒母耳记上 16:13' },
      '耶西': { text: '大卫是犹大伯利恒的以法他人耶西的儿子。耶西有八个儿子。', ref: '撒母耳记上 17:12' },
      '以利押': { text: '他们来的时候，撒母耳看见以利押，就心里说，耶和华的受膏者必定在他面前。', ref: '撒母耳记上 16:6' },
      '歌利亚': { text: '从非利士营中出来一个讨战的人，名叫歌利亚，是迦特人，身高六肘零一虎口；', ref: '撒母耳记上 17:4' },
      '拿盾牌的人': { text: '非利士人也渐渐地迎着大卫来，拿盾牌的走在前头。', ref: '撒母耳记上 17:41' },
      '以拉谷的溪': { text: '他手中拿杖，又在溪中挑选了五块光滑石子，放在袋里，就是牧人带的囊里；', ref: '撒母耳记上 17:40' },
      '以色列人': { text: '又使这众人知道耶和华使人得胜，不是用刀用枪，因为争战的胜败全在乎耶和华。', ref: '撒母耳记上 17:47' },
      '以色列的妇女': { text: '众妇女舞蹈唱和，说：「扫罗杀死千千，大卫杀死万万。」', ref: '撒母耳记上 18:7' },
      '童子': { text: '童子却不知道这是什么意思，只有约拿单和大卫知道。', ref: '撒母耳记上 20:39' },
      '以色磐石': { text: '你等三日，就要速速下去，到你从前遇事所藏的地方，在以色磐石那里等候。', ref: '撒母耳记上 20:19' },
      '亚希米勒': { text: '祭司就拿圣饼给他；因为在那里没有别样饼，只有更换新饼，从耶和华面前撤下来的陈设饼。', ref: '撒母耳记上 21:6' },
      '亚杜兰洞': { text: '大卫就离开那里，逃到亚杜兰洞。他的弟兄和他父亲的全家听见了，就都下到他那里。', ref: '撒母耳记上 22:1' },
      '隐基底的洞': { text: '到了路旁的羊圈，在那里有洞，扫罗进去大解。大卫和跟随他的人正藏在洞里的深处。', ref: '撒母耳记上 24:3' },
      '跟随大卫的人': { text: '大卫对亚比亚他说：「……你可以住在我这里，不要惧怕。因为寻索你命的就是寻索我的命；你在我这里可得保全。」', ref: '撒母耳记上 22:22–23' },
      '亚比该': { text: '……他的妻名叫亚比该，是聪明俊美的妇人。', ref: '撒母耳记上 25:3' },
      '拿八': { text: '过了十天，耶和华击打拿八，他就死了。', ref: '撒母耳记上 25:38' },
      '亚比筛': { text: '大卫对亚比筛说：「不可害死他。有谁伸手害耶和华的受膏者而无罪呢？」', ref: '撒母耳记上 26:9' },
      '押尼珥': { text: '大卫呼叫百姓和尼珥的儿子押尼珥说：「押尼珥啊，你为何不答应呢？」', ref: '撒母耳记上 26:14' },
      '扫罗的枪': { text: '大卫说：「王的枪在这里，可以吩咐一个仆人过来拿去。」', ref: '撒母耳记上 26:22' },
      '洗革拉': { text: '大卫甚是焦急……大卫却倚靠耶和华他的神，心里坚固。', ref: '撒母耳记上 30:6' },
      '垂丝柳树': { text: '扫罗在基比亚的拉玛，坐在垂丝柳树下，手里拿着枪，众臣仆侍立在左右。', ref: '撒母耳记上 22:6' },
      '雅比的垂丝柳树': { text: '将他们骸骨葬在雅比的垂丝柳树下，就禁食七日。', ref: '撒母耳记上 31:13' },
      '雅比的勇士': { text: '基列‧雅比的居民听见非利士人向扫罗所行的事，', ref: '撒母耳记上 31:11' },
      '雅比的坟': { text: '这样，扫罗和他三个儿子，与拿他兵器的人，以及跟随他的人，都一同死亡。', ref: '撒母耳记上 31:6' },
      '伯利恒': { text: '撒母耳就照耶和华的话去行。到了伯利恒，那城里的长老都战战兢兢地出来迎接他……', ref: '撒母耳记上 16:4' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._david = { get S() { return S; }, P, X, FXL, E };
})(window.GS);
