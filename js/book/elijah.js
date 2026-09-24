/* ─────────────────────────────────────────────────────────────
 * book/elijah.js —— 列王纪上 · 以利亚（列王纪上 12 — 22）
 *
 * 示剑：罗波安用严厉的话回答百姓，国分为二——「各归各家去吧！因为这事出于我」；
 * 耶罗波安铸了两个金牛犊，一只安在伯特利，一只安在但；神人向伯特利的坛呼叫，坛破裂，灰倾撒；
 * 北国的王一个接一个起来又倒下，「仍使他在耶路撒冷有灯光」——远山上那一点不灭的灯；
 * 暗利造撒马利亚，亚哈娶耶洗别，为巴力建庙。
 * 提斯比人以利亚：不降露、不下雨，地枯黄；基立溪旁乌鸦早晚叼饼和肉来，溪水干了；
 * 撒勒法的寡妇：坛内的面不减少，瓶里的油不缺短；孩子的灵魂仍入他的身体。
 * 迦密山：巴力的先知从早晨求告到晚祭，没有声音；十二块石头重修耶和华的坛，水倒三次，沟里也满了；
 * 「于是耶和华降下火来」——自天而降的火烧尽燔祭、木柴、石头、尘土，又烧干沟里的水（本卷的签名）；
 * 众民俯伏：「耶和华是神！」；山顶七次向海观看，一小片云如人手，天因风云黑暗，降下大雨，旱地复青。
 * 罗腾树下的天使与炭火烧的饼；四十昼夜到何烈山；烈风、地震、火，火后有微小的声音（第二个签名）；
 * 七千未曾向巴力屈膝的人——遍地亮起的小灯；以利沙在十二对牛后耕地，外衣搭在他身上。
 * 亚兰人满了地面却交在以色列手中；拿伯的葡萄园；米该雅看见以色列众民散在山上，如同没有牧人的羊群；
 * 亚哈中箭，日落时「各归本城，各归本地吧！」——正如耶和华所说的话。
 *
 * 本卷的布景（自画）：远山上的耶路撒冷与它的灯、示剑、撒马利亚（山上的城与象牙宫）、伯特利与但的金牛犊、
 * 巴力的庙与亚舍拉、基立溪、撒勒法的城门与寡妇的楼、坛与瓶、迦密山与山顶的两座坛（十二块石头、沟里的水）、
 * 自天降下的火、如人手的小云、罗腾树、何烈山与洞、七千盏小灯、耕过的田、拿伯的葡萄园、耶斯列的宫、
 * 撒马利亚的城门与两个王座、亚兰人的营……
 * 一切位置都以画面宽度的比例记下，随屏幕缩放不变；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'elijah';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时对齐）───────────────────
  W.defineLevel('elDry', 'exp', 0.3);      // 旱：天色发白，地气蒸腾（17:1）
  W.defineLevel('elLamp', 'exp', 0.5);     // 耶路撒冷的灯光（15:4）
  W.defineLevel('elBaal', 'exp', 0.5);     // 巴力庙前的红火（16:32）
  W.defineLevel('elHush', 'exp', 2.2);     // 火降下之前，天地屏息
  W.defineLevel('elHeaven', 'exp', 1.1);   // 自天降下的火（18:38）
  W.defineLevel('elHand', 'lin', 0.14);    // 如人手的一小片云从海里上来（18:44）
  W.defineLevel('elWind', 'exp', 0.9);     // 烈风大作，崩山碎石（19:11）
  W.defineLevel('elQuake', 'exp', 1.4);    // 风后地震
  W.defineLevel('elBlaze', 'exp', 0.9);    // 地震后有火（19:12）
  W.defineLevel('elStill', 'exp', 0.4);    // 火后有微小的声音
  W.defineLevel('elSeven', 'lin', 0.12);   // 七千未曾向巴力屈膝的人（19:18）
  W.defineLevel('elAram', 'exp', 0.6);     // 亚兰人满了地面（20:27）
  const MY_LEVELS = { elDry: 0, elLamp: 0.3, elBaal: 0, elHush: 0, elHeaven: 0, elHand: 0, elWind: 0, elQuake: 0, elBlaze: 0, elStill: 0, elSeven: 0, elAram: 0 };

  // ── 地上的位置（画面宽度的比例）───────────────────────────
  const X = {
    reho: 0.56, jero: 0.665, king: 0.79, seam: 0.612,
    bethel: 0.615, bethelAlt: -0.055, shechem: 0.79, dan: 0.968, jeru: 0.665, kingsM: 0.75,
    samaria: 0.905, temple: 0.95, ahab: 0.858, jez: 0.888,
    brook: 0.585, gate: 0.615, house: 0.77, jars: 0.712,
    carmel: 0.67, baalAlt: 0.642, lordAlt: 0.713,
    broom: 0.6, horeb: 0.75,
    vine0: 0.56, vine1: 0.745, palace: 0.885,
    gateS: 0.955, throneA: 0.845, throneJ: 0.885,
  };
  const MOUNTS = { carmel: { hw: 0.19, hmax: 0.2, hpx: 150, hr: 0.9 }, horeb: { hw: 0.16, hmax: 0.3, hpx: 230, hr: 1.5 } };
  // 竖屏时，靠右边缘的布景（巴力的庙、撒马利亚的城门、但的金牛犊……）收进画面里
  const pX = (xf, cap) => (W.w < W.h * 0.9 ? Math.min(xf, cap == null ? 0.88 : cap) : xf);
  const WITHER = [98, 100, 96];   // 王的手枯干了：灰白的袍（13:4）
  const CAVE_U = -0.53;
  const ROBE = {
    elijah: [98, 74, 54], reho: [72, 66, 134], jero: [72, 102, 66], mog: [188, 176, 152], ahab: [138, 50, 58], jez: [106, 44, 86],
    widow: [74, 68, 76], son: [152, 128, 100], servant: [128, 110, 88], baal: [132, 50, 42], elisha: [146, 120, 88],
    naboth: [104, 120, 80], jehos: [72, 86, 138], micaiah: [178, 170, 150], sack: [86, 78, 66], army: [96, 88, 112],
  };
  const GOLD = [236, 196, 96];
  const OX0 = 0.66;   // 第一对牛起步之处（19:19）
  const PLOW = [['ox0a', 'ox0b', 'plow1'], ['ox1a', 'ox1b', 'plow2'], ['ox2a', 'ox2b', 'elisha']];
  const KINGS = [['k1', '拿答'], ['k2', '巴沙'], ['k3', '以拉'], ['k4', '心利'], ['k5', '暗利']];
  const BP = ['bp0', 'bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { withered: 0, fed: 0, jarDays: 0, stones: 0, poured: 0, consumed: 0, looked: 0, seven: 0, mantle: 0, sack: 0, arrow: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.3 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; return GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldH = g => Math.max(0, W.h - g);
  const port = () => W.w < W.h * 0.9;
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function place(id, x, l) { if (has(id)) C().place(id, x, l); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) {
    const c = C();
    if (!has(id)) return;
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, p || null)); return; }
    const f = fig(id); if (f) f.prop = p || null;
  }
  const ride = (id, m) => { const c = C(); if (c.ride && has(id)) U.safe('cast.ride', () => c.ride(id, m || null)); };
  const embrace = (a, b, o) => { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } };
  const attach = (id, fn) => { const c = C(); if (c.attach && has(id)) c.attach(id, fn || null); };
  const follow = (id, o, dx) => { const c = C(); if (c.follow && has(id)) U.safe('cast.follow', () => c.follow(id, o, dx)); };
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd || hasCrowd(gid)) return;
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function crowd(gid, o) {
    if (hasCrowd(gid)) return;
    C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o));
  }
  function crowdEach(gid, fn) { const c = C(); const g = c.crowds && c.crowds.get && c.crowds.get(gid); if (g) g.members.forEach(fn); }
  function crowdFace(gid, d) { crowdEach(gid, m => { if (typeof d === 'number' && d !== 1 && d !== -1) m.facing = d >= m.nx ? 1 : -1; else m.facing = d; if (W.replaying) m.fd = m.facing; }); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdWalk(gid, a, b, o) { if (hasCrowd(gid)) C().crowdWalk(gid, a, b, o); }
  function rmCrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人脚下的一点（像素）
  function footOf(id) {
    const f = fig(id);
    if (!f) return null;
    if (f.attach && f._ax != null) return [f._ax, f._ay];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, l === 2 ? surfY(f.nx) : gY(l, f.nx)];
  }
  function headOf(id, lift) {
    const p = footOf(id), f = fig(id);
    if (!p) return [W.w * 0.7, W.h * 0.7];
    const l = f && f.layer != null ? f.layer : 2;
    return [p[0], p[1] - (lift || 34) * LS(l) * (W.w < 600 ? 1.1 : 1.3)];
  }
  // 名字的位置：在画面之内（竖屏时经文在顶上，名字稍低一些，不与经文相叠）
  function nameAt(xf, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    if (W.w < W.h * 0.75) cy = Math.max(cy, W.h * 0.36);
    return [clamp(xf * W.w, half + 8, W.w - half - 8), cy];
  }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  function lv(name, v, b) { W.set(name, v, !!(b && b.instant)); }

  // ════════════════════════════════════════════════════════════
  //  山：迦密山与何烈山（在近处升起；人站在山上时，脚下是山的轮廓）
  // ════════════════════════════════════════════════════════════
  // 迦密山：面海的一端（左）陡起，山梁向内陆缓缓升高；山顶一片平缓的高处，可筑两座坛；向东落到平地
  const CARMEL_PTS = [[-1, 0], [-0.95, 0.1], [-0.88, 0.3], [-0.8, 0.5], [-0.71, 0.64], [-0.6, 0.73], [-0.46, 0.8], [-0.3, 0.87], [-0.14, 0.93],
    [0.02, 0.97], [0.18, 0.99], [0.34, 1.0], [0.47, 0.975], [0.58, 0.9], [0.68, 0.76], [0.78, 0.56], [0.87, 0.33], [0.94, 0.14], [1, 0]];
  function kPts(P0, u) {
    for (let i = 1; i < P0.length; i++) {
      const a = P0[i - 1], b = P0[i];
      if (u <= b[0]) { const t = (u - a[0]) / Math.max(1e-6, b[0] - a[0]); return lerp(a[1], b[1], t * t * (3 - 2 * t)); }
    }
    return 0;
  }
  const kCarmel = u => kPts(CARMEL_PTS, u);
  // 何烈山：几座嶙峋的峰；左肩上有一道平台，洞口就在那里
  const HOREB_PTS = [[-1, 0], [-0.86, 0.1], [-0.72, 0.24], [-0.63, 0.35], [-0.43, 0.37], [-0.38, 0.56], [-0.3, 0.8], [-0.22, 0.68],
    [-0.1, 0.8], [0.0, 0.93], [0.08, 1.0], [0.16, 0.9], [0.27, 0.76], [0.4, 0.66], [0.52, 0.62], [0.63, 0.45], [0.77, 0.25], [0.9, 0.08], [1, 0]];
  const kHoreb = u => kPts(HOREB_PTS, u);
  function kAt(m, u) {
    const pts = m.pts, f = clamp((u + 1) / 2, 0, 1) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f));
    return lerp(pts[i][1], pts[i + 1][1], f - i);
  }
  const mSpec = p => MOUNTS[p.kind === 'horeb' ? 'horeb' : 'carmel'];
  function mountH(p) { const m = mSpec(p), hw = m.hw * W.w; return Math.min(m.hmax * W.h, m.hpx * LS(2), m.hr * hw * (port() ? 1.6 : 1)); }
  function mountYOf(p, xf) {
    if (!p || !p.model || p.grow < 0.005) return null;
    const u = (xf - p.x) / mSpec(p).hw;
    if (u <= -1 || u >= 1) return null;
    const k = kAt(p.model, u), gc = gY(2, p.x);
    return Math.min(gY(2, xf), gc + 3 - k * mountH(p) * p.grow);
  }
  function surfY(xf) {
    let y = gY(2, xf);
    for (const id of ['carmel', 'horeb']) { const m = mountYOf(P.get(id), xf); if (m != null && m < y) y = m; }
    return y;
  }
  // 人站到山上（随山面高低），或下山（回到地面）
  function onMount(id) { attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, surfY(f.nx)] : null; }); }
  function offMount(id) { attach(id, null); }
  function crowdMount(gid, on) { crowdEach(gid, m => { m.attach = on === false ? null : () => [m.nx * W.w, surfY(m.nx)]; }); }
  // 洞口前的平台（19:9 他在那里进了一个洞）
  function caveXY(dx) {
    const p = P.get('horeb');
    const xf = (p ? p.x : X.horeb) + CAVE_U * MOUNTS.horeb.hw + (dx || 0);
    const y = p ? mountYOf(p, xf) : null;
    return [xf * W.w, y == null ? gY(2, xf) : y];
  }

  // ════════════════════════════════════════════════════════════
  //  布景：物件
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.9, grow: 0.25, fire: 0.7, lit: 0.6, crack: 0.45, wet: 0.45, burn: 0.3, dim: 0.4 };
  const KEYS = Object.keys(EASE);
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k of KEYS) p[k] = p['t' + k]; }
  // prop(id, kind, {x, layer, size, label, show, grow, fire, lit, crack, wet, burn, dim, gs, ...})
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), gs: 0 };
      for (const k of KEYS) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'x0', 'x1', 'layer', 'size', 'label', 'variant', 'hill', 'noAltar', 'lord', 'wood', 'bull', 'trench', 'gs', 'stone', 'ax', 'ak', 'teams', 'cap']) if (o[k] !== undefined) p[k] = o[k];
    for (const k of KEYS) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (!p.model) p.model = MODEL[p.kind] ? MODEL[p.kind](p) : {};
    if (W.replaying) { snap(p); p.a = p.ta; }
    return p;
  }
  function unprop(id) {
    const p = P.get(id);
    if (!p) return;
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;

  // ── 模型（与屏幕大小无关）───────────────────────────────────
  function mountModel(p, kfn, n, seed) {
    const r = U.mulberry32(p.seed + seed), pts = [];
    const rough = p.kind === 'horeb' ? 0.07 : 0.05;
    for (let i = 0; i <= n; i++) {
      const u = -1 + 2 * i / n, a = Math.abs(u);
      const flat = p.kind === 'horeb' ? (u > -0.66 && u < -0.4) : (u > -0.34 && u < 0.5);
      pts.push([u, Math.max(0, kfn(u) + (flat || a > 0.95 ? 0 : (r() - 0.5) * rough))]);
    }
    pts[0][1] = 0; pts[n][1] = 0;
    const strata = [], scrub = [], rocks = [], cracks = [], gullies = [];
    const hb = p.kind === 'horeb';
    for (let i = 0; i < (hb ? 16 : 7); i++) strata.push([-0.85 + r() * 1.7, 0.1 + r() * 0.74, (hb ? 0.06 : 0.04) + r() * (hb ? 0.14 : 0.08)]);
    for (let i = 0; i < (hb ? 18 : 0); i++) cracks.push([-0.7 + r() * 1.4, 0.1 + r() * 0.5, (r() - 0.5) * 0.3, 0.1 + r() * 0.14]);
    if (hb) { for (let i = 0; i < 6; i++) { const u = (r() < 0.45 ? -1 : 1) * (0.12 + r() * 0.8); scrub.push([u, 0.15 + r() * 0.8, 0.6 + r() * 0.9]); } }
    else {
      // 迦密的灌木：成丛，多在山沟里（面海的陡坡两道沟，向内陆的长坡两道沟），山顶零星几丛
      for (const gu of [-0.74, -0.5, 0.62, 0.8]) {
        gullies.push([gu, (r() - 0.5) * 0.08]);
        const kk = kfn(gu);
        for (let j = 0; j < 5; j++) scrub.push([gu + (r() - 0.5) * 0.07, kk * (0.18 + r() * 0.62), 0.55 + r() * 0.5]);
      }
      for (let j = 0; j < 5; j++) { const u = j > 2 ? 0.5 + r() * 0.08 : -0.46 + r() * 0.12; scrub.push([u, kfn(u) - 0.04 - r() * 0.08, 0.5 + r() * 0.35]); }
    }
    for (let i = 0; i < 6; i++) rocks.push([(r() < 0.5 ? -1 : 1) * (0.7 + r() * 0.32), 0.05 + r() * 0.05, 0.5 + r() * 0.7]);
    return { pts, strata, scrub, rocks, cracks, gullies };
  }
  const MODEL = {
    mount: p => mountModel(p, kCarmel, 52, 222),
    horeb: p => mountModel(p, kHoreb, 60, 818),
    city(p) {
      const r = U.mulberry32(p.seed * 104729 + 3), v = p.variant || 'town';
      const n = v === 'jeru' ? 9 : v === 'samaria' ? 11 : v === 'jezreel' ? 5 : 7;
      const half = v === 'jeru' ? 0.5 : v === 'samaria' ? 0.52 : v === 'jezreel' ? 0.34 : 0.42;
      const hs = [];
      for (let i = 0; i < n; i++) {
        const ox = (n === 1 ? 0 : (i / (n - 1) - 0.5) * 2 * half) + (r() - 0.5) * 0.05;
        hs.push({ ox, w: 0.08 + r() * 0.06, h: (0.12 + r() * 0.16) * (1 - 0.45 * Math.abs(ox) / half), dome: r() < 0.12, win: r() < 0.65, tw: r() * TAU });
      }
      hs.sort((a, b) => b.h - a.h);
      return { hs, half };
    },
    altar(p) {
      const r = U.mulberry32(p.seed * 131 + 7), st = [], ruin = [];
      if (p.lord) {
        // 十二块石头（18:31）：五、四、三
        [[5, 0], [4, 1], [3, 2]].forEach(([n, row]) => {
          for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.46 + (r() - 0.5) * 0.06, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.26 + r() * 0.05, 0.19 + r() * 0.03, (r() - 0.5) * 0.4]);
        });
        for (let i = 0; i < 9; i++) ruin.push([(r() - 0.5) * 2.4, 0.04 + r() * 0.1, 0.18 + r() * 0.1, (r() - 0.5) * 1.2]);
      } else {
        // 巴力的坛：凿过的方石
        [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => {
          for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.5, -0.17 - row * 0.32, 0.25, 0.16, 0]);
        });
      }
      return { st, ruin };
    },
    broom(p) {
      // 罗腾树：几枝主干分开，细枝向上又向外弯，合成一个圆顶
      const r = U.mulberry32(p.seed + 5), tw = [], st = [[-0.16, -0.3], [0.02, -0.36], [0.18, -0.28]];
      for (let i = 0; i < 44; i++) {
        const a = (i / 43 - 0.5) * 2.6 + (r() - 0.5) * 0.25, k = st[Math.min(2, Math.max(0, Math.round((a / 2.6 + 0.5) * 2)))];
        const ex = Math.sin(a) * (0.62 + r() * 0.1), ey = -0.3 - Math.cos(a * 0.8) * (0.62 + r() * 0.14);
        tw.push([k[0], k[1], ex, ey, r() * TAU]);
      }
      return { tw, st };
    },
    vines(p) {
      const r = U.mulberry32(p.seed + 71), vs = [];
      for (let row = 0; row < 3; row++) for (let i = 0; i < 7; i++) vs.push({ row, t: (i + 0.5 + (row % 2) * 0.5) / 7.5, lean: (r() - 0.5) * 0.3, g: r() < 0.7, s: 0.85 + r() * 0.3 });
      return { vs };
    },
    camp(p) {
      const r = U.mulberry32(p.seed + 404), ts = [];
      for (let i = 0; i < 60; i++) ts.push({ x: 0.5 + r() * 0.49, v: r() * 0.75, s: 0.7 + r() * 0.5, fire: r() < 0.35, flag: r() < 0.18, ph: r() * TAU });
      ts.sort((a, b) => a.v - b.v);
      return { ts };
    },
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([236, 242, 255], 1),
      ember: radial([255, 92, 36], 1), smoke: radial([140, 132, 124], 0.8, 0.55), soot: radial([34, 28, 26], 0.85, 0.55),
      red: radial([230, 70, 40], 1), pale: radial([200, 216, 255], 1), steam: radial([232, 236, 242], 0.7, 0.55),
      cloud: radial([236, 238, 244], 0.95, 0.6), cloudD: radial([96, 102, 118], 0.9, 0.6),
    };
    // 竖直的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.1)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 光幕：上淡下浓，到地为止（末端只有很短的一段淡出）
    const cu = cnv(64, 256), cg = cu.getContext('2d');
    const ch = cg.createLinearGradient(0, 0, 64, 0);
    ch.addColorStop(0, 'rgba(255,240,206,0)'); ch.addColorStop(0.5, 'rgba(255,246,224,1)'); ch.addColorStop(1, 'rgba(255,240,206,0)');
    cg.fillStyle = ch; cg.fillRect(0, 0, 64, 256);
    cg.globalCompositeOperation = 'destination-in';
    const cv2 = cg.createLinearGradient(0, 0, 0, 256);
    cv2.addColorStop(0, 'rgba(0,0,0,0.04)'); cv2.addColorStop(0.55, 'rgba(0,0,0,0.45)'); cv2.addColorStop(0.955, 'rgba(0,0,0,0.9)'); cv2.addColorStop(1, 'rgba(0,0,0,0)');
    cg.fillStyle = cv2; cg.fillRect(0, 0, 64, 256);
    SP.curtain = cu;
    // 火柱：白的心、金的身、橙红的边，自上而下
    const f = cnv(96, 256), fg = f.getContext('2d');
    const fh = fg.createLinearGradient(0, 0, 96, 0);
    fh.addColorStop(0, 'rgba(255,90,30,0)'); fh.addColorStop(0.22, 'rgba(255,120,40,0.55)'); fh.addColorStop(0.4, 'rgba(255,214,120,0.95)');
    fh.addColorStop(0.5, 'rgba(255,252,236,1)'); fh.addColorStop(0.6, 'rgba(255,214,120,0.95)'); fh.addColorStop(0.78, 'rgba(255,120,40,0.55)'); fh.addColorStop(1, 'rgba(255,90,30,0)');
    fg.fillStyle = fh; fg.fillRect(0, 0, 96, 256);
    fg.globalCompositeOperation = 'destination-in';
    const fv = fg.createLinearGradient(0, 0, 0, 256);
    fv.addColorStop(0, 'rgba(0,0,0,0.25)'); fv.addColorStop(0.3, 'rgba(0,0,0,0.9)'); fv.addColorStop(1, 'rgba(0,0,0,1)');
    fg.fillStyle = fv; fg.fillRect(0, 0, 96, 256);
    SP.fire = f;
    // 火柱的横截面（每一层一条横向渐变）
    const prof = stops => { const c = cnv(128, 2), g2 = c.getContext('2d'), gr = g2.createLinearGradient(0, 0, 128, 0); stops.forEach(st => gr.addColorStop(st[0], st[1])); g2.fillStyle = gr; g2.fillRect(0, 0, 128, 2); return c; };
    SP.fOut = prof([[0, 'rgba(255,70,24,0)'], [0.22, 'rgba(255,92,34,0.35)'], [0.5, 'rgba(255,140,56,0.75)'], [0.78, 'rgba(255,92,34,0.35)'], [1, 'rgba(255,70,24,0)']]);
    SP.fMid = prof([[0, 'rgba(255,150,60,0)'], [0.25, 'rgba(255,190,100,0.7)'], [0.5, 'rgba(255,236,186,1)'], [0.75, 'rgba(255,190,100,0.7)'], [1, 'rgba(255,150,60,0)']]);
    SP.fCore = prof([[0, 'rgba(255,252,240,0)'], [0.3, 'rgba(255,253,245,0.9)'], [0.5, 'rgba(255,255,255,1)'], [0.7, 'rgba(255,253,245,0.9)'], [1, 'rgba(255,252,240,0)']]);
    // 竖直的渐变条：拉伸到所需的宽高，以 globalAlpha 调深浅（免去每帧新建渐变）
    const strip = stops => { const c = cnv(2, 128), g2 = c.getContext('2d'), gr = g2.createLinearGradient(0, 0, 0, 128); stops.forEach(st => gr.addColorStop(st[0], st[1])); g2.fillStyle = gr; g2.fillRect(0, 0, 2, 128); return c; };
    SP.dryHaze = strip([[0, 'rgba(240,214,160,0)'], [1, 'rgba(246,222,170,1)']]);
    SP.dryNear = strip([[0, 'rgba(206,170,110,0.375)'], [1, 'rgba(170,128,76,1)']]);
    SP.hushSky = strip([[0, 'rgba(8,10,28,1)'], [0.6, 'rgba(18,16,40,0.85)'], [1, 'rgba(28,20,46,0.69)']]);
    return SP;
  }
  // 满屏的晕（径向渐变）：以四分之一的分辨率预绘，按屏幕大小与中心缓存
  const VIG = {};
  function vig(name, key, paint) {
    const k = key + '|' + W.w + 'x' + W.h;
    let v = VIG[name];
    if (!v || v.k !== k) {
      const w4 = Math.max(8, Math.ceil(W.w / 4)), h4 = Math.max(8, Math.ceil(W.h / 4));
      const c = cnv(w4, h4), g = c.getContext('2d');
      g.scale(w4 / W.w, h4 / W.h);
      paint(g);
      v = VIG[name] = { k, c };
    }
    return v.c;
  }

  // ── 火与烟（程序化，按时间确定）─────────────────────────────
  function flame(ctx, x, y, h, k, seed, red) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    const g = h * 4.2;
    ctx.globalAlpha = k * (0.3 + 0.45 * nightK());
    ctx.drawImage(red ? SP.red : SP.warm, x - g / 2, y - h * 0.45 - g / 2, g, g);
    const T4 = red
      ? [[0, 1, 'rgb(220,60,36)', 0.75], [-0.26, 0.68, 'rgb(240,96,44)', 0.75], [0.24, 0.72, 'rgb(230,80,40)', 0.7], [0, 0.5, 'rgb(255,180,110)', 0.85]]
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
  function smoke(ctx, x, y, k, H, w, seed, kind, rate) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 12, day = 0.3 + 0.7 * W.daylight;
    const spr = kind === 'dark' ? SP.soot : kind === 'steam' ? SP.steam : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (kind === 'dark' ? 0.6 : kind === 'steam' ? 0.55 : 0.42 * day);
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(spr, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  function glowAt(ctx, spr, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：各种物件
  // ════════════════════════════════════════════════════════════
  // 城：示剑、撒马利亚（山上的城与象牙宫）、耶路撒冷（远山上，殿与灯）、耶斯列（王宫）
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, u = 110 * s, x = pX(p.x, p.cap) * W.w, m = p.model, g = p.grow, v = p.variant || 'town';
    if (g <= 0.01) return;
    const HW = m.half * u, HR = HW * 1.8;
    const hillH = (p.hill || 0) * u * Math.min(1, g * 2.2);
    const hk = t => (Math.abs(t) >= 1 ? 0 : Math.pow(1 - t * t, 0.8));
    const base = xx => gY(l, xx / W.w) + 2 - hillH * hk((xx - x) / HR);
    const d = litX() >= x ? 1 : -1, day = 0.3 + 0.7 * W.daylight;
    ctx.globalAlpha = p.a;
    if (hillH > 0.5) {
      ctx.fillStyle = css(U.mixRGB([96, 114, 76], [150, 128, 88], clamp(W.lv.bare, 0, 1)), l);
      ctx.beginPath();
      ctx.moveTo(x - HR, gY(l, (x - HR) / W.w) + 3);
      for (let i = 0; i <= 28; i++) { const xx = x - HR + (2 * HR * i) / 28; ctx.lineTo(xx, base(xx)); }
      ctx.lineTo(x + HR, gY(l, (x + HR) / W.w) + 3);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = css([222, 208, 164], l, 0.4 * day, 0.2); ctx.lineWidth = Math.max(0.6, 1.2 * s);
      ctx.beginPath();
      for (let i = 0; i <= 12; i++) { const xx = x + d * HR * 0.92 * (i / 12); if (i) ctx.lineTo(xx, base(xx)); else ctx.moveTo(xx, base(xx)); }
      ctx.stroke();
    }
    const stone = p.stone || (v === 'jezreel' ? [214, 204, 184] : [186, 162, 128]);
    const body = css(stone, l), side = css([stone[0] * 0.78, stone[1] * 0.76, stone[2] * 0.76], l);
    // 城墙
    const wh = 0.075 * u * g, wx0 = x - HW, wx1 = x + HW;
    ctx.fillStyle = side;
    ctx.beginPath();
    ctx.moveTo(wx0, base(wx0) + 2);
    for (let i = 0; i <= 12; i++) { const xx = lerp(wx0, wx1, i / 12); ctx.lineTo(xx, base(xx) - wh * (i % 2 ? 0.82 : 1)); }
    ctx.lineTo(wx1, base(wx1) + 2);
    ctx.closePath(); ctx.fill();
    // 房屋
    ctx.fillStyle = body;
    ctx.beginPath();
    for (const h of m.hs) {
      const hx = x + h.ox * u, hh = h.h * u * g, ww = h.w * u, b0 = base(hx);
      h._g = b0; h._hh = hh;
      ctx.rect(hx - ww / 2, b0 - hh, ww, hh + 2);
      if (h.dome) { ctx.moveTo(hx + ww * 0.4, b0 - hh); ctx.ellipse(hx, b0 - hh, ww * 0.4, ww * 0.34, 0, 0, Math.PI, true); }
    }
    // 殿（耶路撒冷）/ 王宫与望楼（撒马利亚、耶斯列）
    let lampX = null, lampY = null;
    if (v === 'jeru') {
      const tx = x + 0.1 * u, b0 = base(tx), th = 0.36 * u * g, tw = 0.16 * u;
      ctx.rect(tx - tw / 2, b0 - th, tw, th + 2);
      ctx.rect(tx - tw * 0.7, b0 - th * 0.55, tw * 1.4, th * 0.55 + 2);
      lampX = tx; lampY = b0 - th - 2 * s;
    } else if (v === 'samaria' || v === 'jezreel') {
      const px = x + (v === 'jezreel' ? 0 : -0.06) * u, b0 = base(px), ph = (v === 'jezreel' ? 0.34 : 0.28) * u * g, pw = (v === 'jezreel' ? 0.46 : 0.3) * u;
      ctx.rect(px - pw / 2, b0 - ph, pw, ph + 2);
      const tx = px + pw * 0.42, th = ph * 1.5;
      ctx.rect(tx - 0.045 * u, base(tx) - th, 0.09 * u, th + 2);
    }
    ctx.fill();
    // 象牙宫的白墙（22:39）
    if (v === 'samaria' || v === 'jezreel') {
      const px = x + (v === 'jezreel' ? 0 : -0.06) * u, b0 = base(px), ph = (v === 'jezreel' ? 0.34 : 0.28) * u * g, pw = (v === 'jezreel' ? 0.46 : 0.3) * u;
      ctx.fillStyle = css([236, 226, 204], l, 1, 0.08);
      ctx.fillRect(px - pw / 2 + pw * 0.06, b0 - ph + ph * 0.1, pw * 0.88, ph * 0.9);
      ctx.fillStyle = css([150, 128, 96], l);
      for (let i = 0; i < 5; i++) ctx.fillRect(px - pw * 0.38 + i * pw * 0.19, b0 - ph * 0.72, Math.max(1, pw * 0.05), ph * 0.72);
      ctx.fillStyle = css([40, 30, 26], l);
      ctx.fillRect(px - pw * 0.08, b0 - ph * 0.42, pw * 0.16, ph * 0.42);
    }
    // 背光的一侧
    ctx.fillStyle = side;
    ctx.globalAlpha = p.a * 0.75;
    ctx.beginPath();
    for (const h of m.hs) {
      const hx = x + h.ox * u, ww = h.w * u;
      ctx.rect(d > 0 ? hx - ww / 2 : hx + ww * 0.2, h._g - h._hh, ww * 0.3, h._hh);
    }
    ctx.fill();
    ctx.globalAlpha = p.a;
    // 迎光的边
    ctx.strokeStyle = css([240, 224, 190], l, 0.45 * day, 0.25); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const h of m.hs) { const hx = x + h.ox * u, ww = h.w * u; ctx.moveTo(hx - ww / 2, h._g - h._hh); ctx.lineTo(hx + ww / 2, h._g - h._hh); }
    ctx.stroke();
    // 夜里的窗
    const nk = nightK();
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,178,96)';
      const ws = Math.max(1, 2.2 * s);
      for (const h of m.hs) {
        if (!h.win) continue;
        ctx.globalAlpha = p.a * nk * (0.55 + 0.35 * Math.sin(W.t * 0.8 + h.tw)) * (1 - p.dim);
        ctx.fillRect(x + h.ox * u - ws / 2, h._g - h._hh * 0.62, ws, ws * 1.4);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 耶路撒冷的灯（15:4）：远处一点不灭的光
    if (lampX != null) {
      SP || sprites();
      const k = W.lv.elLamp, fl = 0.88 + 0.12 * Math.sin(W.t * 2.3) + 0.05 * Math.sin(W.t * 7.1);
      const a = k * fl * (0.35 + 0.65 * nk);
      const r = Math.max(10, 70 * s) * (0.6 + 0.6 * k);
      glowAt(ctx, SP.gold, lampX, lampY, r, a * 0.8 * p.a);
      glowAt(ctx, SP.warm, lampX, lampY, r * 0.4, a * p.a);
      ctx.globalAlpha = Math.min(1, a * 1.4) * p.a;
      ctx.fillStyle = 'rgb(255,244,210)';
      const cs = Math.max(1.4, 2.4 * s);
      ctx.fillRect(lampX - cs / 2, lampY - cs / 2, cs, cs);
    }
    ctx.globalAlpha = 1;
  }

  // 金牛犊（12:28）：伯特利的在近处（台、座、有角的坛），但的在远处
  function calfShape(ctx, cx, cy, s, l, a) {
    // cx, cy：四蹄所立之处；面向左
    ctx.globalAlpha = a;
    const gold = css([204, 158, 64], l, 1, 0.12), dark = css([150, 108, 40], l, 1, 0.05);
    ctx.strokeStyle = dark; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.8, 1.5 * s);
    ctx.beginPath();
    for (const lx of [-4.6, -2.4, 2.8, 4.8]) { ctx.moveTo(cx + lx * s, cy - 4.2 * s); ctx.lineTo(cx + lx * s * 1.02, cy); }
    ctx.moveTo(cx + 6.4 * s, cy - 7 * s); ctx.quadraticCurveTo(cx + 8.6 * s, cy - 5 * s, cx + 7.8 * s, cy - 2.4 * s);
    ctx.stroke();
    ctx.fillStyle = gold;
    ctx.beginPath(); ctx.ellipse(cx, cy - 6.6 * s, 7 * s, 3.3 * s, 0, 0, TAU); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 5 * s, cy - 9.2 * s); ctx.quadraticCurveTo(cx - 7.2 * s, cy - 10.4 * s, cx - 9 * s, cy - 10.2 * s);
    ctx.lineTo(cx - 10 * s, cy - 7.6 * s); ctx.quadraticCurveTo(cx - 8 * s, cy - 6.6 * s, cx - 5.6 * s, cy - 4.8 * s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - 10.4 * s, cy - 8.8 * s, 2.3 * s, 2.7 * s, 0.5, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx - 11.8 * s, cy - 7.2 * s, 1.5 * s, 1.3 * s, 0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = gold; ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    ctx.moveTo(cx - 9.8 * s, cy - 11 * s); ctx.quadraticCurveTo(cx - 9.2 * s, cy - 12.8 * s, cx - 8 * s, cy - 12.6 * s);
    ctx.moveTo(cx - 11.2 * s, cy - 11 * s); ctx.quadraticCurveTo(cx - 12.2 * s, cy - 12.6 * s, cx - 13 * s, cy - 12.2 * s);
    ctx.stroke();
    // 金光：一道亮光在背上移动
    ctx.globalCompositeOperation = 'lighter';
    const sweep = U.fract(W.t * 0.23 + cx * 0.001);
    ctx.fillStyle = 'rgb(255,236,160)';
    ctx.globalAlpha = a * (0.35 + 0.35 * W.daylight);
    ctx.beginPath(); ctx.ellipse(cx - 1 * s, cy - 8.4 * s, 4.6 * s, 1.1 * s, -0.05, 0, TAU); ctx.fill();
    const gx = cx + lerp(-7, 6, sweep) * s;
    ctx.globalAlpha = a * Math.sin(sweep * Math.PI) * 0.9;
    ctx.fillRect(gx - 0.6 * s, cy - 10.6 * s, 1.2 * s, 3.4 * s);
    ctx.fillRect(gx - 1.8 * s, cy - 9.5 * s, 3.6 * s, 1.1 * s);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const ALTAR_L = [[0, 0], [0.5, -2.8], [-0.6, -5.6], [0.4, -8.2], [0, -11]];
  // 伯特利的高处：坛在左，金牛犊的座在右，各站在自己的地上（ax：坛相对于牛犊的位置，画面宽度的比例；ak：坛的大小）
  function calfGeom(p) {
    const l = p.layer, s = LS(l) * p.size, xf = pX(p.x, p.cap), x = xf * W.w, A = p.ak || 1, sep = p.ax != null;
    const ax = sep ? (xf + p.ax) * W.w : x - 10 * s, cx = sep ? x : x + 9 * s;
    const aw = 6 * s * A, ah = 11 * s * A;
    const top = xx => gY(l, xx / W.w) + 2 * s - 3.4 * s;   // 石台的面
    return { l, s, A, ax, cx, aw, ah, ay: top(ax), cy: top(cx), top };
  }
  function drawCalf(ctx, p) {
    const g = p.grow;
    if (g <= 0.01) return;
    const G = calfGeom(p), l = G.l, s = G.s, cx = G.cx, a = p.a * Math.min(1, g * 1.4);
    ctx.globalAlpha = a;
    // 高处的石台：随地势起伏
    const x0 = p.noAltar ? cx - 17 * s : Math.min(G.ax - G.aw - 8 * s, cx - 17 * s), x1 = cx + 17 * s;
    ctx.fillStyle = css([138, 122, 104], l);
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const xx = lerp(x0 + 3 * s, x1 - 3 * s, i / 10); if (i) ctx.lineTo(xx, G.top(xx)); else ctx.moveTo(xx, G.top(xx)); }
    for (let i = 10; i >= 0; i--) { const xx = lerp(x0, x1, i / 10); ctx.lineTo(xx, gY(l, xx / W.w) + 2 * s); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([226, 210, 180], l, 0.3 * (0.3 + 0.7 * W.daylight), 0.15); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const xx = lerp(x0 + 3 * s, x1 - 3 * s, i / 10); if (i) ctx.lineTo(xx, G.top(xx)); else ctx.moveTo(xx, G.top(xx)); }
    ctx.stroke();
    // 座与金牛犊
    const py = G.cy, ph = 7 * s * g;
    ctx.fillStyle = css([150, 134, 112], l);
    ctx.fillRect(cx - 7 * s, py - ph, 14 * s, ph + 1);
    ctx.fillStyle = css([176, 160, 134], l);
    ctx.fillRect(cx - 8 * s, py - ph - 1.4 * s, 16 * s, 1.6 * s);
    calfShape(ctx, cx + 1 * s, py - ph - 1.2 * s, s * Math.min(1, g * 1.2), l, a);
    SP || sprites();
    glowAt(ctx, SP.gold, cx - 2 * s, py - ph - 8 * s, 22 * s, a * (0.15 + 0.2 * W.daylight + 0.25 * p.lit) * (1 - p.dim));
    if (p.noAltar) { ctx.globalAlpha = 1; return; }
    // 坛（13:3 这坛必破裂，坛上的灰必倾撒）
    const A = G.A, ax = G.ax, ay = G.ay, aw = G.aw, ah = G.ah * Math.min(1, g * 1.3), c = p.crack;
    const off = c * 2.8 * s * A, rot = c * 0.1;
    ctx.globalAlpha = a;
    // 倾撒的灰：两半之外各一堆灰，细灰撒在地上
    if (c > 0.01) {
      ctx.fillStyle = css([112, 108, 104], l);
      ctx.beginPath();
      for (const sd of [-1, 1]) {
        const hx = ax + sd * (aw + off + 2 * s * A), rx = 6.5 * s * A * c, ry = 2.4 * s * A * c;
        ctx.moveTo(hx + rx, ay + 0.6 * s); ctx.ellipse(hx, ay + 0.6 * s, rx, ry, 0, Math.PI, 0);
      }
      ctx.fill();
      ctx.fillStyle = css([158, 154, 148], l, 1, 0.05);
      ctx.beginPath();
      for (let i = 0; i < 22; i++) {
        const sd = i % 2 ? 1 : -1, f = hsh(i * 3.7 + 1), d = aw + off + f * 13 * s * A * c;
        const hx = ax + sd * d, hy = ay + 0.4 * s - (1 - f) * 2.2 * s * A * c - hsh(i * 5.1) * 1.4 * s * c;
        const r = (0.45 + 0.7 * hsh(i * 7.3)) * s;
        ctx.rect(hx - r, hy - r, 2 * r, 2 * r);
      }
      ctx.fill();
    }
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(ax + side * off, ay);
      ctx.rotate(side * rot);
      ctx.globalAlpha = a;
      ctx.fillStyle = css([156, 138, 116], l);
      ctx.beginPath();
      ctx.moveTo(side * aw, 0);
      ctx.lineTo(side * aw * 0.95, -ah + 1.5 * s * A);
      ctx.lineTo(side * aw * 1.08, -ah - 1.6 * s * A);      // 坛角
      ctx.lineTo(side * aw * 0.6, -ah);
      for (let i = ALTAR_L.length - 1; i >= 0; i--) ctx.lineTo(ALTAR_L[i][0] * s * A, ALTAR_L[i][1] * ah / 11);
      ctx.closePath(); ctx.fill();
      // 背光的半边稍暗
      if (side === (litX() >= ax ? -1 : 1)) { ctx.fillStyle = U.rgba(20, 16, 24, 0.18); ctx.fill(); }
      ctx.strokeStyle = css([226, 210, 180], l, 0.4 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(side * aw * 0.6, -ah); ctx.lineTo(side * aw * 1.08, -ah - 1.6 * s * A); ctx.stroke();
      ctx.restore();
    }
    // 坛上的灰（未破裂时）
    if (c < 0.99) {
      ctx.globalAlpha = a * (1 - c);
      ctx.fillStyle = css([118, 114, 110], l);
      ctx.beginPath(); ctx.ellipse(ax, ay - ah + 0.4 * s, aw * 0.62, 1.8 * s * A, 0, Math.PI, 0); ctx.fill();
      ctx.globalAlpha = a;
    }
    // 坛上的火与香烟
    if (p.fire > 0.01) {
      smoke(ctx, ax, ay - ah - 3 * s, p.fire * a, 90 * s + W.h * 0.06, 3 * s * A, p.seed, 'smoke', 0.07);
      flame(ctx, ax, ay - ah + 0.5 * s, 5.5 * s * A, p.fire * a, p.seed);
    }
    ctx.globalAlpha = 1;
  }

  // 巴力的庙（16:32）与亚舍拉（16:33）
  function drawTemple(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = pX(p.x, p.cap) * W.w, g = p.grow;
    if (g <= 0.01) return;
    const a = p.a * Math.min(1, g * 1.5), W0 = 22 * s, H0 = 24 * s * g, st = 6 * s;
    const y = Math.max(gY(l, (x - W0) / W.w), gY(l, (x + W0) / W.w)) + 2 * s;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([112, 86, 74], l);
    ctx.fillRect(x - W0 - 7 * s, y - 3 * s, 2 * W0 + 14 * s, 3 * s + 1);
    ctx.fillRect(x - W0 - 3.5 * s, y - st, 2 * W0 + 7 * s, 3 * s + 1);
    ctx.fillStyle = css([128, 90, 76], l);
    ctx.fillRect(x - W0, y - st - H0, 2 * W0, H0 + 1);
    ctx.fillStyle = css([150, 108, 88], l);
    ctx.fillRect(x - W0 - 2 * s, y - st - H0 - 3 * s, 2 * W0 + 4 * s, 3.2 * s);
    // 柱廊的暗处
    ctx.fillStyle = css([36, 24, 22], l);
    for (let i = 0; i < 4; i++) ctx.fillRect(x - W0 * 0.78 + i * W0 * 0.46, y - st - H0 * 0.8, W0 * 0.2, H0 * 0.8);
    // 顶上的角
    ctx.fillStyle = css([150, 108, 88], l);
    ctx.beginPath();
    ctx.moveTo(x - W0 - 2 * s, y - st - H0 - 3 * s); ctx.lineTo(x - W0 - 3 * s, y - st - H0 - 7 * s); ctx.lineTo(x - W0 + 3 * s, y - st - H0 - 3 * s);
    ctx.moveTo(x + W0 + 2 * s, y - st - H0 - 3 * s); ctx.lineTo(x + W0 + 3 * s, y - st - H0 - 7 * s); ctx.lineTo(x + W0 - 3 * s, y - st - H0 - 3 * s);
    ctx.fill();
    // 柱像（石柱）
    const mx = x + W0 + 12 * s, mh = 34 * s * g;
    ctx.fillStyle = css([92, 70, 62], l);
    ctx.beginPath(); ctx.moveTo(mx - 3 * s, y); ctx.lineTo(mx - 2.4 * s, y - mh + 2 * s); ctx.quadraticCurveTo(mx, y - mh - 1 * s, mx + 2.4 * s, y - mh + 2 * s); ctx.lineTo(mx + 3 * s, y); ctx.closePath(); ctx.fill();
    // 亚舍拉（木偶）
    const ax = x - W0 - 12 * s, ah = 30 * s * g;
    ctx.strokeStyle = css([80, 60, 44], l); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, 2.2 * s);
    ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax + 0.6 * s, y - ah);
    ctx.moveTo(ax + 0.3 * s, y - ah * 0.62); ctx.lineTo(ax - 5 * s, y - ah * 0.82);
    ctx.moveTo(ax + 0.4 * s, y - ah * 0.75); ctx.lineTo(ax + 5.5 * s, y - ah * 0.95);
    ctx.stroke();
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([236, 196, 170], l, 0.4 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x + d * W0, y - st); ctx.lineTo(x + d * W0, y - st - H0); ctx.lineTo(x, y - st - H0); ctx.stroke();
    ctx.globalAlpha = 1;
    // 庙前的红火
    const k = Math.max(p.fire, W.lv.elBaal) * a * (1 - p.dim);
    if (k > 0.01) {
      SP || sprites();
      const fx0 = x - W0 * 0.1, fy = y - st;
      ctx.fillStyle = css([70, 50, 40], l);
      ctx.fillRect(fx0 - 4 * s, fy - 3 * s, 8 * s, 3 * s);
      flame(ctx, fx0, fy - 3 * s, 10 * s, k, p.seed, true);
      glowAt(ctx, SP.red, fx0, fy - 10 * s, 60 * s, k * (0.12 + 0.4 * nightK()));
    }
  }

  // 基立溪（17:3）：自山间流下的一道溪水；旱时干了，只剩龟裂的泥
  function drawBrook(ctx, p) {
    const l = 2, s = LS(l), x = p.x * W.w, g0 = gY(l, p.x), wet = p.wet, a = p.a;
    const bottom = W.h + 4, dx = -0.05 * W.w;
    const at = t => [x + dx * t * t, lerp(g0 + 1, bottom, t)];
    ctx.globalAlpha = a;
    // 两岸
    ctx.fillStyle = css([74, 62, 48], l, 0.9);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const t = i / 12, q = at(t), w = (2 + 26 * t) * s * 1.4; if (i) ctx.lineTo(q[0] - w, q[1]); else ctx.moveTo(q[0] - w, q[1]); }
    for (let i = 12; i >= 0; i--) { const t = i / 12, q = at(t), w = (2 + 26 * t) * s * 1.4; ctx.lineTo(q[0] + w, q[1]); }
    ctx.closePath(); ctx.fill();
    // 溪床：水 / 干泥
    const bed = U.mixRGB([168, 146, 112], [52, 86, 112], wet);
    ctx.fillStyle = css(bed, l, 1, 0.05 * wet);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const t = i / 12, q = at(t), w = (1 + 17 * t) * s * (0.7 + 0.3 * wet); if (i) ctx.lineTo(q[0] - w, q[1]); else ctx.moveTo(q[0] - w, q[1]); }
    for (let i = 12; i >= 0; i--) { const t = i / 12, q = at(t), w = (1 + 17 * t) * s * (0.7 + 0.3 * wet); ctx.lineTo(q[0] + w, q[1]); }
    ctx.closePath(); ctx.fill();
    if (wet > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(226,238,255)';
      for (let i = 0; i < 14; i++) {
        const t = U.fract(W.t * 0.12 + i / 14), q = at(t), w = (1 + 14 * t) * s;
        ctx.globalAlpha = a * wet * (0.25 + 0.3 * Math.sin(W.t * 3 + i * 1.7)) * (0.4 + 0.6 * W.daylight + 0.3 * nightK());
        ctx.fillRect(q[0] + Math.sin(i * 2.3 + W.t) * w * 0.5 - 2 * s * (0.3 + t), q[1], 4 * s * (0.3 + t), Math.max(0.7, 0.8 * s));
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (wet < 0.7) {
      ctx.strokeStyle = css([96, 78, 58], l, (0.7 - wet) * 1.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) { const t = 0.15 + 0.8 * hsh(i * 3.1), q = at(t), w = (1 + 15 * t) * s; const ox = (hsh(i * 7.3) - 0.5) * w * 1.4; ctx.moveTo(q[0] + ox, q[1]); ctx.lineTo(q[0] + ox + (hsh(i) - 0.5) * 8 * s, q[1] + 3 * s * (0.4 + t)); }
      ctx.stroke();
    }
    ctx.globalAlpha = a;
    // 岸上的石与芦苇
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) { const t = 0.12 + 0.12 * i, q = at(t), w = (2 + 26 * t) * s * 1.4, sd = i % 2 ? 1 : -1, rr = (2 + 3 * hsh(i * 5)) * s * (0.5 + t); ctx.moveTo(q[0] + sd * w + rr, q[1]); ctx.ellipse(q[0] + sd * w, q[1], rr * 1.3, rr, 0, Math.PI, 0); }
    ctx.fill();
    ctx.strokeStyle = css(U.mixRGB([150, 132, 86], [74, 106, 60], wet), l); ctx.lineWidth = Math.max(0.6, 0.9 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const t = 0.05 + 0.07 * i, q = at(t), w = (2 + 22 * t) * s * 1.2, sd = i % 2 ? 1 : -1, h = (8 + 8 * hsh(i * 9)) * s * (0.4 + t) * (0.5 + 0.5 * wet);
      const sw = Math.sin(W.t * 1.2 + i) * 1.2 * s;
      ctx.moveTo(q[0] + sd * w, q[1]); ctx.quadraticCurveTo(q[0] + sd * w + 1.5 * s, q[1] - h * 0.6, q[0] + sd * w + sw, q[1] - h);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 城门（撒勒法、撒马利亚）
  function drawGate(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = pX(p.x, p.cap) * W.w, y = Math.max(gY(l, (x - 15 * s) / W.w), gY(l, (x + 15 * s) / W.w)) + 2 * s;
    const tw = 8 * s, th = 28 * s, ow = 7 * s, oh = 17 * s, wallW = 30 * s, wallH = 17 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([164, 142, 112], l);
    ctx.beginPath();
    for (const sd of [-1, 1]) {
      const x0 = sd < 0 ? x - ow - tw - wallW : x + ow + tw, x1 = x0 + wallW;
      const g0 = gY(l, x0 / W.w) + 2 * s, g1 = gY(l, x1 / W.w) + 2 * s;
      ctx.moveTo(x0, g0 + 2); ctx.lineTo(x0, g0 - wallH); ctx.lineTo(x1, g1 - wallH); ctx.lineTo(x1, g1 + 2); ctx.closePath();
    }
    ctx.fill();
    ctx.fillStyle = css([178, 156, 124], l);
    ctx.beginPath();
    ctx.rect(x - ow - tw, y - th, tw, th + 1);
    ctx.rect(x + ow, y - th, tw, th + 1);
    ctx.rect(x - ow, y - th + 3 * s, 2 * ow, th - oh - 3 * s);
    for (let i = 0; i < 3; i++) { ctx.rect(x - ow - tw + i * tw * 0.4, y - th - 2.6 * s, tw * 0.26, 2.6 * s); ctx.rect(x + ow + i * tw * 0.4, y - th - 2.6 * s, tw * 0.26, 2.6 * s); }
    ctx.fill();
    ctx.fillStyle = css([34, 26, 22], l);
    ctx.beginPath(); ctx.moveTo(x - ow, y); ctx.lineTo(x - ow, y - oh + ow); ctx.quadraticCurveTo(x - ow, y - oh, x, y - oh); ctx.quadraticCurveTo(x + ow, y - oh, x + ow, y - oh + ow); ctx.lineTo(x + ow, y); ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([240, 222, 186], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    const ex = d > 0 ? x + ow + tw : x - ow - tw;
    ctx.moveTo(ex, y - th); ctx.lineTo(ex, y); ctx.moveTo(x - ow - tw, y - th); ctx.lineTo(x + ow + tw, y - th);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 寡妇的家：平顶的屋，屋顶上有楼（17:19），外面的梯，门口的炉
  function drawHouse(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w, hw = 16 * s, hh = 16 * s, uw = 8 * s, uh = 9 * s;
    const y = Math.max(gY(l, (x - hw) / W.w), gY(l, (x + hw) / W.w)) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([176, 146, 108], l);
    ctx.fillRect(x - hw, y - hh, 2 * hw, hh + 1);
    ctx.fillRect(x + hw - 2 * uw - 1 * s, y - hh - uh, 2 * uw, uh + 1);
    ctx.fillStyle = css([150, 120, 88], l);
    ctx.fillRect(x - hw - 1 * s, y - hh - 1.6 * s, 2 * hw + 2 * s, 1.8 * s);
    // 梯
    ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(x - hw - 8 * s, y); ctx.lineTo(x - hw, y - hh + 1 * s); ctx.closePath(); ctx.fill();
    // 门与楼的窗
    ctx.fillStyle = css([30, 22, 18], l);
    ctx.fillRect(x - 2 * s, y - 9 * s, 5 * s, 9 * s);
    const wx = x + hw - uw - 1 * s, wy = y - hh - uh * 0.62;
    ctx.fillRect(wx - 1.6 * s, wy - 1.8 * s, 3.2 * s, 3.6 * s);
    const lamp = clamp(nightK() * 0.8 * (1 - p.dim) + p.lit, 0, 1.6);
    if (lamp > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * Math.min(1, lamp) * (0.8 + 0.2 * Math.sin(W.t * 6));
      ctx.fillStyle = p.lit > 0.3 ? 'rgb(255,226,160)' : 'rgb(255,168,90)';
      ctx.fillRect(wx - 1.6 * s, wy - 1.8 * s, 3.2 * s, 3.6 * s);
      ctx.globalCompositeOperation = 'source-over';
      glowAt(ctx, p.lit > 0.3 ? SP.gold : SP.warm, wx, wy, (14 + 30 * p.lit) * s, p.a * Math.min(1, lamp) * 0.5);
    }
    // 炉
    const ox = x + hw + 7 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 104, 72], l);
    ctx.beginPath(); ctx.ellipse(ox, y, 4.4 * s, 5.4 * s, 0, Math.PI, 0); ctx.fill();
    if (p.fire > 0.01) {
      ctx.fillStyle = U.rgba(255, 150, 70, p.fire * p.a);
      ctx.fillRect(ox - 1.5 * s, y - 2.4 * s, 3 * s, 2.4 * s);
      smoke(ctx, ox, y - 6 * s, p.fire * p.a * 0.6, 50 * s, 3 * s, p.seed, 'smoke', 0.09);
      SP || sprites();
      glowAt(ctx, SP.warm, ox, y - 3 * s, 16 * s, p.fire * p.a * (0.3 + 0.4 * nightK()));
    }
    // 柴
    ctx.strokeStyle = css([96, 72, 50], l); ctx.lineWidth = Math.max(0.6, 1 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { ctx.moveTo(x - hw + 3 * s + i * 1.3 * s, y - 0.2 * s); ctx.lineTo(x - hw + 9 * s + i * 0.8 * s, y - 2.4 * s - i * 0.4 * s); }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([242, 222, 186], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x + d * hw, y); ctx.lineTo(x + d * hw, y - hh); ctx.lineTo(x - d * hw, y - hh); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 坛内的面、瓶里的油（17:14）；炭火烧的饼与一瓶水（19:6）
  function drawJars(ctx, p) {
    const l = 2, s = LS(l) * 1.2 * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    if (p.variant === 'meal') {
      ctx.fillStyle = css([120, 110, 100], l);
      ctx.beginPath(); ctx.ellipse(x, y - 1 * s, 5 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([210, 170, 110], l, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(x, y - 2.4 * s, 3.4 * s, 1.1 * s, 0, 0, TAU); ctx.fill();
      SP || sprites();
      glowAt(ctx, SP.ember, x, y - 1.2 * s, 7 * s, p.a * 0.55);
    } else {
      ctx.fillStyle = css([168, 112, 74], l);
      ctx.beginPath(); ctx.ellipse(x, y - 4.6 * s, 3.4 * s, 4.4 * s, 0, 0, TAU); ctx.fill();
      ctx.fillRect(x - 1.8 * s, y - 10.2 * s, 3.6 * s, 2.4 * s);
      ctx.fillRect(x - 2.4 * s, y - 10.8 * s, 4.8 * s, 1 * s);
    }
    const cx = x + (p.variant === 'meal' ? -6 : 6) * s;
    ctx.fillStyle = css([150, 104, 70], l);
    ctx.beginPath(); ctx.ellipse(cx, y - 2.6 * s, 2.1 * s, 2.6 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(cx - 0.8 * s, y - 6.4 * s, 1.6 * s, 2 * s);
    ctx.beginPath(); ctx.moveTo(cx + 1.6 * s, y - 4 * s); ctx.lineTo(cx + 3.4 * s, y - 5.2 * s); ctx.lineTo(cx + 1.6 * s, y - 3 * s); ctx.fill();
    ctx.strokeStyle = css([236, 200, 160], l, 0.4 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.arc(x, y - 4.6 * s, 3.2 * s, -1.2, 0.2); ctx.stroke();
    ctx.globalAlpha = 1;
    if (p.lit > 0.01) {
      SP || sprites();
      const pl = 0.8 + 0.2 * Math.sin(W.t * 2.2);
      glowAt(ctx, SP.gold, x + 3 * s, y - 5 * s, 26 * s, p.a * p.lit * pl * 0.7);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,240,200)';
      for (let i = 0; i < 6; i++) {
        const ph = U.fract(W.t * 0.35 + i / 6);
        ctx.globalAlpha = p.a * p.lit * (1 - ph) * 0.8;
        ctx.fillRect(x + (hsh(i * 3.3) - 0.3) * 12 * s, y - 6 * s - ph * 16 * s, 1.3 * s, 1.3 * s);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // 山（迦密山：石灰岩与灌木；何烈山：暗红的花岗岩，有洞）
  const SHADE = '22,18,30';
  function drawMount(ctx, p) {
    const g = p.grow;
    if (g <= 0.005 || !p.model) return;
    const horeb = p.kind === 'horeb';
    const l = 2, m = p.model, hw = mSpec(p).hw * W.w, H = mountH(p) * g, s = LS(l);
    const qk0 = horeb ? W.lv.elQuake : 0;
    const cx = p.x * W.w + (qk0 > 0.02 ? Math.sin(W.t * 43) * 2.2 * qk0 * s : 0), gc = gY(l, p.x) + 3;
    const top = u => { const x = cx + u * hw; return Math.min(gY(l, x / W.w), gc - H * kAt(m, u)); };
    const day = 0.3 + 0.7 * W.daylight, nk = nightK();
    const ex = horeb ? 0.22 * nk + 0.45 * W.lv.elBlaze : 0.05 * nk;
    const c0 = horeb ? [150, 122, 112] : [170, 158, 128], c1 = horeb ? [112, 90, 86] : [138, 128, 102], c2 = horeb ? [76, 62, 62] : [98, 92, 74];
    ctx.globalAlpha = p.a;
    // 山体
    const body = new Path2D();
    m.pts.forEach((q, i) => { const X1 = cx + q[0] * hw, Y1 = Math.min(gY(l, X1 / W.w), gc - q[1] * H); if (i) body.lineTo(X1, Y1); else body.moveTo(X1, Y1); });
    body.lineTo(cx + hw, gY(l, (cx + hw) / W.w) + 8); body.lineTo(cx - hw, gY(l, (cx - hw) / W.w) + 8);
    body.closePath();
    const gr = ctx.createLinearGradient(0, gc - H, 0, gc);
    gr.addColorStop(0, css(c0, l, null, ex)); gr.addColorStop(0.55, css(c1, l, null, ex)); gr.addColorStop(1, css(c2, l, null, ex * 0.7));
    ctx.fillStyle = gr;
    ctx.fill(body);
    // 背光的一面：横向柔和地暗下去（渐变按几何缓存）
    const d = litX() >= cx ? 1 : -1, cx0 = Math.round(p.x * W.w);     // 渐变不随地震的抖动重建
    const sk = cx0 + '|' + Math.round(hw) + '|' + d;
    if (!m._sg || m._sgk !== sk || m._sgc !== ctx) {
      const sg = ctx.createLinearGradient(cx0 + d * 0.25 * hw, 0, cx0 - d * hw, 0), A0 = horeb ? 0.46 : 0.42;
      sg.addColorStop(0, `rgba(${SHADE},0)`); sg.addColorStop(0.3, `rgba(${SHADE},${A0 * 0.25})`);
      sg.addColorStop(0.65, `rgba(${SHADE},${A0 * 0.7})`); sg.addColorStop(1, `rgba(${SHADE},${A0})`);
      // 迎光的一侧：一层淡淡的暖光
      const lg = ctx.createLinearGradient(cx0 + d * hw, 0, cx0, 0);
      lg.addColorStop(0, 'rgba(255,226,180,0.16)'); lg.addColorStop(0.6, 'rgba(255,226,180,0.05)'); lg.addColorStop(1, 'rgba(255,226,180,0)');
      m._sg = sg; m._lg = lg; m._sgk = sk; m._sgc = ctx;
    }
    ctx.fillStyle = m._sg;
    ctx.fill(body);
    ctx.globalAlpha = p.a * (0.35 + 0.65 * W.daylight + 0.5 * W.dusk) * (1 - 0.7 * W.lv.storm);
    ctx.fillStyle = m._lg;
    ctx.fill(body);
    ctx.globalAlpha = p.a;
    ctx.save();
    ctx.clip(body);
    ctx.lineCap = 'round';
    // 山沟（迦密）：几道柔和的暗痕，自山脊下到山脚
    if (m.gullies && m.gullies.length) {
      for (const pass of [0, 1]) {
        ctx.strokeStyle = `rgba(${SHADE},${pass ? 0.05 : 0.045})`;
        ctx.lineWidth = Math.max(2, (pass ? 5 : 12) * s);
        ctx.beginPath();
        for (const q of m.gullies) {
          const u0 = q[0], y0 = gc - kAt(m, u0) * H + 6 * s, out = u0 < 0 ? -1 : 1;
          for (let i = 0; i <= 6; i++) {
            const t = i / 6, u = u0 + (q[1] + out * 0.06) * t;
            const xx = cx + u * hw, yy = lerp(y0, gc + 2, t);
            if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
          }
        }
        ctx.stroke();
      }
    }
    // 岩层（柔和：暗的一道用背光的颜色，亮的一道在其上）
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? css(horeb ? [206, 176, 160] : [226, 212, 184], l, (horeb ? 0.2 : 0.1) * day, 0.15) : `rgba(${SHADE},${horeb ? 0.3 : 0.1})`;
      ctx.lineWidth = Math.max(0.6, (pass ? 0.9 : 1.6) * s);
      ctx.beginPath();
      for (const q of m.strata) {
        const k = kAt(m, q[0]);
        if (q[1] > k - 0.08) continue;
        const y = gc - q[1] * H - (pass ? 1.6 * s : 0);
        ctx.moveTo(cx + (q[0] - q[2]) * hw, y + 1.5 * s); ctx.quadraticCurveTo(cx + q[0] * hw, y - 1.2 * s, cx + (q[0] + q[2]) * hw, y + 0.8 * s);
      }
      ctx.stroke();
    }
    // 裂纹（何烈山；地震时发光）
    const qk = horeb ? W.lv.elQuake : 0;
    if (m.cracks.length) {
      ctx.strokeStyle = `rgba(${SHADE},0.3)`; ctx.lineWidth = Math.max(0.6, (1 + qk * 0.8) * s);
      ctx.beginPath();
      for (const q of m.cracks) {
        const k = kAt(m, q[0]);
        if (q[1] > k - 0.1) continue;
        const x = cx + q[0] * hw, y = gc - q[1] * H;
        ctx.moveTo(x, y); ctx.lineTo(x + q[2] * hw * 0.3, y + q[3] * H * 0.5); ctx.lineTo(x + q[2] * hw * 0.1, y + q[3] * H);
      }
      ctx.stroke();
      if (qk > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = U.rgba(255, 140, 70, 0.8 * qk * (0.6 + 0.4 * Math.sin(W.t * 17)));
        ctx.lineWidth = Math.max(0.8, 1.4 * s);
        ctx.stroke();
        ctx.strokeStyle = U.rgba(255, 110, 50, 0.22 * qk);
        ctx.lineWidth = Math.max(2, 5 * s);
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
    ctx.globalAlpha = p.a;
    // 灌木：成丛的两色小丛（迦密是林木茂盛的山；旱时枯黄）
    const dry = clamp(W.lv.bare, 0, 1);
    const scrubC = horeb ? [70, 70, 52] : U.mixRGB([46, 70, 42], [88, 84, 54], dry);
    const bush = (q, fn) => {
      const k = kAt(m, q[0]);
      if (k < 0.1) return;
      const y = gc - Math.min(q[1], k - 0.03) * H, rr = (horeb ? 3.6 : 4.4) * s * q[2];
      fn(cx + q[0] * hw, y, rr);
    };
    ctx.fillStyle = css(scrubC, l);
    ctx.beginPath();
    for (const q of m.scrub) bush(q, (bx, y, rr) => {
      ctx.moveTo(bx + rr, y); ctx.ellipse(bx, y, rr, rr * 0.7, 0, 0, TAU);
      if (!horeb) {
        ctx.moveTo(bx - rr * 0.5 + rr * 0.6, y - rr * 0.35); ctx.ellipse(bx - rr * 0.5, y - rr * 0.35, rr * 0.6, rr * 0.5, 0, 0, TAU);
        ctx.moveTo(bx + rr * 0.45 + rr * 0.55, y - rr * 0.45); ctx.ellipse(bx + rr * 0.45, y - rr * 0.45, rr * 0.55, rr * 0.46, 0, 0, TAU);
      }
    });
    ctx.fill();
    if (!horeb) {
      ctx.fillStyle = css(U.mixRGB([106, 138, 76], [136, 132, 82], dry), l, 0.6 * day, 0.1);
      ctx.beginPath();
      for (const q of m.scrub) bush(q, (bx, y, rr) => { const hx = bx + d * rr * 0.35, hy = y - rr * 0.55; ctx.moveTo(hx + rr * 0.55, hy); ctx.ellipse(hx, hy, rr * 0.55, rr * 0.3, 0, 0, TAU); });
      ctx.fill();
    }
    // 山脚的大石
    ctx.fillStyle = css(horeb ? [100, 82, 78] : [122, 112, 98], l);
    ctx.beginPath();
    for (const q of m.rocks) { const x = cx + q[0] * hw, y = gY(l, x / W.w) + 2, rr = 7 * s * q[2]; ctx.moveTo(x + rr * 1.3, y); ctx.ellipse(x, y, rr * 1.3, rr, 0, Math.PI, 0); }
    ctx.fill();
    // 何烈山的洞（19:9）；火后有微小的声音：洞口一点慢慢呼吸的微光
    if (horeb && g > 0.3) {
      const cxv = cx + (CAVE_U + 0.06) * hw, cy = top(CAVE_U + 0.06), cw = 6.5 * s, ch = 13 * s * Math.min(1, (g - 0.3) / 0.5);
      ctx.fillStyle = css([18, 12, 12], l);
      ctx.beginPath(); ctx.moveTo(cxv - cw, cy + 1); ctx.quadraticCurveTo(cxv - cw * 1.1, cy - ch, cxv + cw * 0.2, cy - ch * 1.05); ctx.quadraticCurveTo(cxv + cw * 1.2, cy - ch * 0.7, cxv + cw, cy + 1); ctx.closePath(); ctx.fill();
      const still = W.lv.elStill;
      if (still > 0.01) { SP || sprites(); glowAt(ctx, SP.pale, cxv, cy - ch * 0.5, 26 * s, still * (0.16 + 0.12 * (0.5 + 0.5 * Math.sin(W.t * TAU / 6))) * p.a); }
    }
    // 迎光的山脊：一道细细的暖边（夜里是月光的冷边）
    ctx.globalAlpha = p.a;
    const warm = U.mixRGB([240, 222, 186], [255, 200, 140], clamp(W.dusk * 1.3, 0, 1));
    ctx.lineWidth = Math.max(0.6, 1.0 * s);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const u = d * (-0.08 + 1.0 * i / 20); if (i) ctx.lineTo(cx + u * hw, top(u)); else ctx.moveTo(cx + u * hw, top(u)); }
    ctx.strokeStyle = css(warm, l, (0.34 + 0.24 * W.dusk) * day, 0.3);
    ctx.stroke();
    if (nk > 0.2 && W.lv.moon > 0.2) { ctx.strokeStyle = U.rgba(196, 210, 240, 0.22 * nk * W.lv.moon); ctx.stroke(); }
    // 地震后有火（19:12）：火沿着山脊与山坡烧过
    if (horeb && W.lv.elBlaze > 0.01) {
      const k = W.lv.elBlaze * p.a;
      SP || sprites();
      glowAt(ctx, SP.warm, cx, gc - H * 0.55, hw * 1.25, k * 0.55);
      smoke(ctx, cx + 0.1 * hw, gc - H * 0.95, k, W.h * 0.35, 26 * s, 9, 'dark', 0.06);
      for (let i = 0; i < 26; i++) {
        const u = -0.88 + 1.76 * hsh(i * 3.3), dd = Math.pow(hsh(i * 7.1), 1.4), t0 = top(u), y = t0 + dd * (gc - t0) * 0.7 + 3 * s;
        const hgt = (14 + 18 * hsh(i * 1.9)) * s * (1 - 0.35 * dd);
        flame(ctx, cx + u * hw, y, hgt, k * (0.75 + 0.25 * Math.sin(W.t * 3 + i)), i * 3.7);
      }
    }
    ctx.globalAlpha = 1;
  }

  // 迦密山顶的坛：巴力的（凿过的方石）与耶和华的（十二块石头、四围的沟）
  function drawAltar(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w, y = surfY(p.x) + 1.5 * s, u = 11 * s, m = p.model, n = m.st.length;
    const burn = p.burn, alive = 1 - smoothstep(0.3, 0.95, burn);
    const day = 0.3 + 0.7 * W.daylight;
    ctx.globalAlpha = p.a;
    // 沟（18:32）与沟里的水（18:35）
    if (p.lord && p.trench) {
      ctx.fillStyle = css([58, 46, 38], l);
      ctx.beginPath(); ctx.ellipse(x, y + 1.2 * s, 1.75 * u, 0.4 * u, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([150, 132, 110], l);
      ctx.beginPath(); ctx.ellipse(x, y + 0.6 * s, 1.35 * u, 0.26 * u, 0, 0, TAU); ctx.fill();
      const w = p.wet * (1 - burn);
      if (w > 0.01) {
        ctx.fillStyle = U.rgba(96, 138, 170, 0.85 * w * p.a);
        ctx.beginPath(); ctx.ellipse(x, y + 1.2 * s, 1.72 * u, 0.38 * u, 0, 0, TAU); ctx.ellipse(x, y + 0.6 * s, 1.37 * u, 0.28 * u, 0, 0, TAU); ctx.fill('evenodd');
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(236,244,255)';
        for (let i = 0; i < 6; i++) {
          const a = i / 6 * TAU + W.t * 0.3;
          ctx.globalAlpha = p.a * w * (0.3 + 0.3 * Math.sin(W.t * 3 + i * 2)) * (0.5 + 0.5 * day);
          ctx.fillRect(x + Math.cos(a) * 1.55 * u - 1.5 * s, y + 1 * s + Math.sin(a) * 0.33 * u, 3 * s, Math.max(0.6, 0.6 * s));
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.a;
      }
    }
    // 毁坏的坛：散落的石头（修好之前）
    if (p.lord && p.grow < 0.999 && burn < 0.01) {
      ctx.fillStyle = css([130, 118, 102], l);
      ctx.globalAlpha = p.a * (1 - p.grow);
      ctx.beginPath();
      for (const q of m.ruin) { const cx = x + q[0] * u, cy = y - q[1] * u; ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[2] * u * 0.66, q[3], 0, TAU); }
      ctx.fill();
      ctx.globalAlpha = p.a;
    }
    // 石头
    const shown = p.grow * n;
    if (shown > 0.01 && alive > 0.01) {
      const col = burn > 0.01 ? U.mixRGB(p.lord ? [132, 120, 104] : [146, 130, 112], [255, 150, 70], clamp(burn * 2.2, 0, 1)) : (p.lord ? [132, 120, 104] : [146, 130, 112]);
      ctx.fillStyle = burn > 0.05 ? U.rgba(col[0], col[1], col[2], 1) : css(col, l);
      ctx.globalAlpha = p.a * alive;
      ctx.beginPath();
      for (let i = 0; i < n && i < shown; i++) {
        const q = m.st[i], k = clamp(shown - i, 0, 1);
        const cx = x + q[0] * u, cy = y + q[1] * u - (1 - k) * 8 * s;
        if (p.lord) { ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * k, q[4], 0, TAU); }
        else ctx.rect(cx - q[2] * u, cy - q[3] * u * k, q[2] * u * 2, q[3] * u * 2 * k);
      }
      ctx.fill();
      if (burn < 0.05) {
        const d = litX() >= x ? 1 : -1;
        ctx.fillStyle = css([222, 206, 178], l, 0.35 * day, 0.2);
        ctx.beginPath();
        for (let i = 0; i < n && i < shown - 0.5; i++) {
          const q = m.st[i], cx = x + q[0] * u + d * q[2] * u * 0.25, cy = y + q[1] * u - q[3] * u * 0.35;
          ctx.moveTo(cx + q[2] * u * 0.55, cy); ctx.ellipse(cx, cy, q[2] * u * 0.55, q[3] * u * 0.4, q[4], 0, TAU);
        }
        ctx.fill();
        // 浇透了的石头：一层湿亮
        if (p.wet > 0.05) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = U.rgba(170, 200, 230, 0.22 * p.wet * p.a);
          ctx.beginPath();
          for (let i = 0; i < n && i < shown - 0.5; i++) { const q = m.st[i], cx = x + q[0] * u, cy = y + q[1] * u - q[3] * u * 0.5; ctx.moveTo(cx + q[2] * u * 0.4, cy); ctx.ellipse(cx, cy, q[2] * u * 0.4, q[3] * u * 0.22, 0, 0, TAU); }
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.globalAlpha = p.a;
    }
    const topY = y - 0.98 * u;
    // 柴与切成块子的牛犊（18:23, 33）
    if (p.wood && p.grow > 0.95 && alive > 0.01) {
      ctx.globalAlpha = p.a * alive;
      ctx.strokeStyle = burn > 0.05 ? U.rgba(255, 140, 60, 1) : css([88, 62, 40], l); ctx.lineWidth = Math.max(1, 1.6 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) { const oy = -i * 1.3 * s; ctx.moveTo(x - 0.62 * u + i * 0.5 * s, topY + oy); ctx.lineTo(x + 0.6 * u - i * 0.4 * s, topY + oy - 0.4 * s); }
      ctx.stroke();
      if (p.bull) {
        ctx.fillStyle = burn > 0.05 ? U.rgba(255, 120, 50, 1) : css([120, 60, 50], l);
        ctx.beginPath();
        for (let i = 0; i < 3; i++) { const bx = x + (i - 1) * 0.36 * u, by = topY - 6 * s; ctx.moveTo(bx + 3.2 * s, by); ctx.ellipse(bx, by, 3.2 * s, 1.8 * s, (i - 1) * 0.2, 0, TAU); }
        ctx.fill();
      }
      ctx.globalAlpha = p.a;
    }
    // 烧尽之后：焦黑的地与余烬（18:38）
    if (burn > 0.05) {
      ctx.fillStyle = U.rgba(30, 22, 18, 0.85 * p.a * burn);
      ctx.beginPath(); ctx.ellipse(x, y + 0.5 * s, 1.9 * u * burn, 0.42 * u, 0, 0, TAU); ctx.fill();
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 12; i++) {
        const ex = x + (hsh(i * 2.7) - 0.5) * 2.8 * u, ey = y + (hsh(i * 5.1) - 0.5) * 0.5 * u;
        ctx.globalAlpha = p.a * burn * (0.35 + 0.35 * Math.sin(W.t * (2 + hsh(i) * 3) + i));
        ctx.fillStyle = 'rgb(255,120,50)';
        ctx.fillRect(ex - 0.9 * s, ey - 0.9 * s, 1.8 * s, 1.8 * s);
      }
      glowAt(ctx, SP.ember, x, y - 2 * s, 2.2 * u, p.a * burn * (0.25 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
      // 沟里的水被烧干：白汽
      if (p.lord) smoke(ctx, x, y - 2 * s, p.a * clamp(burn * 1.5, 0, 1) * (1 - smoothstep(0.7, 1, p.burn)), 70 * s + W.h * 0.05, 7 * s, 5, 'steam', 0.16);
    }
    if (p.fire > 0.01) {
      smoke(ctx, x, topY - 8 * s, p.fire * p.a, 170 * s + W.h * 0.12, 8 * s, p.seed, 'smoke', 0.08);
      flame(ctx, x, topY + 2 * s, 20 * s, p.fire * p.a, p.seed);
    }
    ctx.globalAlpha = 1;
  }

  // 罗腾树（19:4）：细枝丛生的小树，开白花
  function drawBroom(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, g = p.grow, H = 44 * s * (0.3 + 0.7 * g), m = p.model;
    if (g <= 0.01) return;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = U.rgba(20, 18, 14, 0.18 * W.daylight * p.a);
    ctx.beginPath(); ctx.ellipse(x, y + 1 * s, H * 0.6, 3 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([86, 70, 54], l); ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, 2.2 * s);
    ctx.beginPath();
    for (const q of m.st) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + q[0] * H * 0.3, y + q[1] * H * 0.6, x + q[0] * H, y + q[1] * H); }
    ctx.stroke();
    // 细枝：暗的一层在后，亮的一层在前
    for (const pass of [0, 1]) {
      ctx.strokeStyle = pass ? css([150, 162, 120], l, 0.9, 0.05) : css([96, 112, 80], l, 0.95);
      ctx.lineWidth = Math.max(0.5, (pass ? 0.7 : 1.1) * s);
      ctx.beginPath();
      for (let i = pass; i < m.tw.length; i += 2) {
        const t = m.tw[i], sw = Math.sin(W.t * 0.9 + t[4]) * 0.015 * H + W.wind * 0.025 * H;
        const bx = x + t[0] * H, by = y + t[1] * H, ex = x + t[2] * H + sw, ey = y + t[3] * H;
        ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + (ex - bx) * 0.25, ey + (by - ey) * 0.25, ex, ey);
      }
      ctx.stroke();
    }
    ctx.fillStyle = css([246, 240, 226], l, 0.9, 0.1);
    for (let i = 0; i < m.tw.length; i += 2) {
      const t = m.tw[i], sw = Math.sin(W.t * 0.9 + t[4]) * 0.015 * H + W.wind * 0.025 * H;
      for (const f of [1, 0.8]) ctx.fillRect(x + t[0] * H + (t[2] - t[0]) * H * f + sw * f - 0.8 * s, y + t[1] * H + (t[3] - t[1]) * H * f - 0.8 * s, 1.6 * s, 1.6 * s);
    }
    ctx.globalAlpha = 1;
  }

  // 耕过的田（19:19）
  function drawField(ctx, p) {
    const l = 2, s = LS(l), x0 = p.x0 * W.w, x1 = p.x1 * W.w;
    ctx.globalAlpha = p.a;
    for (let r = 0; r < 7; r++) {
      const v = 0.05 + r * 0.075;
      ctx.strokeStyle = css(r % 2 ? [96, 72, 50] : [112, 86, 60], l, 0.8); ctx.lineWidth = Math.max(0.7, (1.2 + r * 0.25) * s);
      ctx.beginPath();
      for (let i = 0; i <= 14; i++) {
        const xx = lerp(x0 + r * 4 * s, x1 - r * 3 * s, i / 14), g = gY(l, xx / W.w), y = g + v * fieldH(g) * 0.8;
        if (i) ctx.lineTo(xx, y); else ctx.moveTo(xx, y);
      }
      ctx.stroke();
    }
    // 轭与犁（19:19）：每对牛颈上一道轭，一根辕杆向后连到犁，扶犁的人握着犁把
    if (p.teams) {
      ctx.lineCap = 'round';
      const wood = css([92, 68, 46], l), dark = css([60, 46, 34], l);
      // 位置按人与牛此刻的 nx 算（与 cast 同一算法：近地的比例、纵深 v）
      const at = f => {
        const g = gY(2, f.nx), v = f.v || 0, k = W.layerScale(2) * (W.w < 600 ? 1.4 : 1) * 1.3 * (f.scale || 1) * (1 + 0.35 * v);
        return [f.nx * W.w, v ? g + v * Math.max(0, W.h - g) * 0.8 : g, f.isAnimal ? k : 34 * k];
      };
      for (const t of p.teams) {
        const oa = fig(t[0]), ob = fig(t[1]), mn = fig(t[2]);
        if (!oa || !mn || oa.nx == null || mn.nx == null) continue;
        const al = p.a * Math.min(oa.alpha == null ? 1 : oa.alpha, mn.alpha == null ? 1 : mn.alpha);
        if (al < 0.02) continue;
        const A = at(oa), Mn = at(mn), f = oa.facing || -1, h = A[2];
        const nx = A[0] + f * 13 * h, ny = A[1] - 20 * h;                 // 牛颈（轭）
        const px = Mn[0] + f * 9 * s, py = Mn[1] - 5 * s;                 // 犁头之上
        const hx = Mn[0] + f * 3.5 * s, hy = Mn[1] - Mn[2] * 0.44;        // 扶犁的手
        ctx.globalAlpha = al;
        ctx.strokeStyle = wood; ctx.lineWidth = Math.max(0.8, 1.3 * s);
        ctx.beginPath();
        ctx.moveTo(nx, ny); ctx.quadraticCurveTo((nx + px) / 2, Math.max(ny, py) - 2 * s, px, py);   // 辕杆
        ctx.moveTo(px, py); ctx.lineTo(hx, hy);                                                        // 犁把
        ctx.stroke();
        ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, 1.8 * s);
        ctx.beginPath();
        ctx.moveTo(px, py); ctx.lineTo(px + f * 3.5 * s, Mn[1] + 1.2 * s);                           // 犁头入土
        if (ob && ob.nx != null) { const B = at(ob), bx = B[0] + f * 13 * B[2], by = B[1] - 20 * B[2]; ctx.moveTo(nx - f * 2 * s, ny - 1.5 * s); ctx.lineTo(bx - f * 2 * s, by - 1.5 * s); }   // 轭
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  // 拿伯的葡萄园（21:1）
  function drawVines(ctx, p) {
    const l = 2, x0 = p.x0 * W.w, x1 = p.x1 * W.w, m = p.model, dim = p.dim;
    ctx.globalAlpha = p.a;
    for (let row = 2; row >= 0; row--) {
      const v = 0.04 + row * 0.12;
      for (const q of m.vs) {
        if (q.row !== row) continue;
        const xx = lerp(x0, x1, q.t), g = gY(l, xx / W.w), y = g + v * fieldH(g) * 0.8, s = LS(l) * (1 + 0.35 * v) * q.s * p.size;
        ctx.strokeStyle = css([80, 60, 42], l); ctx.lineWidth = Math.max(0.8, 1.4 * s); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(xx, y); ctx.quadraticCurveTo(xx + q.lean * 6 * s, y - 5 * s, xx, y - 10 * s);
        ctx.moveTo(xx - 7 * s, y - 10 * s); ctx.lineTo(xx + 7 * s, y - 10 * s); ctx.stroke();
        ctx.fillStyle = css(U.mixRGB([62, 98, 50], [70, 70, 56], dim), l);
        ctx.beginPath();
        for (let k = 0; k < 4; k++) { const bx = xx + (k - 1.5) * 4 * s, by = y - 11 * s - (k % 2) * 2 * s; ctx.moveTo(bx + 3.4 * s, by); ctx.ellipse(bx, by, 3.4 * s, 2.6 * s, 0, 0, TAU); }
        ctx.fill();
        if (q.g) {
          ctx.fillStyle = css([92, 50, 96], l, 1 - 0.5 * dim);
          ctx.beginPath();
          for (let k = 0; k < 2; k++) { const bx = xx + (k ? 3 : -3) * s, by = y - 7.4 * s; ctx.moveTo(bx + 1.5 * s, by); ctx.ellipse(bx, by, 1.5 * s, 2.2 * s, 0, 0, TAU); }
          ctx.fill();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // 撒马利亚城门前的空场：两个王座（22:10）
  function drawThrones(ctx, p) {
    const l = 2, s = LS(l) * p.size;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 128, 100], l);
    const xa = X.throneA * W.w, xb = X.throneJ * W.w, ya = gY(l, X.throneA) + 2 * s, yb = gY(l, X.throneJ) + 2 * s;
    ctx.beginPath(); ctx.moveTo(xa - 12 * s, ya); ctx.lineTo(xa - 11 * s, ya - 3 * s); ctx.lineTo(xb + 11 * s, yb - 3 * s); ctx.lineTo(xb + 12 * s, yb); ctx.closePath(); ctx.fill();
    for (const [x, y, d] of [[xa, ya, 1], [xb, yb, -1]]) {
      ctx.fillStyle = css([118, 84, 56], l);
      ctx.fillRect(x - 5 * s, y - 12 * s, 10 * s, 9 * s);
      ctx.fillRect(x + d * 4 * s - 1.2 * s, y - 24 * s, 2.4 * s, 21 * s);
      ctx.fillStyle = css(GOLD, l, 1, 0.1);
      ctx.fillRect(x + d * 4 * s - 1.8 * s, y - 25 * s, 3.6 * s, 1.8 * s);
    }
    ctx.globalAlpha = 1;
  }

  // 亚兰人的营：满了地面（20:27）
  let CAMP = null;
  function drawCamp(ctx) {
    const k = W.lv.elAram;
    if (k < 0.01) return;
    const m = CAMP || (CAMP = MODEL.camp({ seed: 404 }));
    const l = 1, nk = 0.3 + 0.7 * nightK();
    SP || sprites();
    const key = W.w + 'x' + W.h;
    if (m.key !== key) {
      m.key = key;
      for (const t of m.ts) { const g = gY(l, t.x); t.p = [t.x * W.w, g + t.v * Math.max(0, W.waterlineY(l) - g) * 0.7, LS(l) * t.s * (1 + 0.3 * t.v) * 1.8]; }
    }
    const pos = t => t.p;
    ctx.fillStyle = css([132, 70, 52], l, k, 0.15);
    ctx.beginPath();
    for (const t of m.ts) { const [x, y, s] = pos(t); ctx.moveTo(x - 6 * s, y); ctx.lineTo(x - 1 * s, y - 7 * s); ctx.lineTo(x + 1 * s, y - 7 * s); ctx.lineTo(x + 6 * s, y); ctx.closePath(); }
    ctx.fill();
    ctx.fillStyle = css([80, 42, 34], l, k, 0.1);
    ctx.beginPath();
    for (const t of m.ts) { const [x, y, s] = pos(t); ctx.moveTo(x + 0.3 * s, y - 6.6 * s); ctx.lineTo(x + 1 * s, y - 7 * s); ctx.lineTo(x + 6 * s, y); ctx.lineTo(x + 1.6 * s, y); ctx.closePath(); }
    ctx.fill();
    // 旗
    ctx.strokeStyle = css([70, 50, 40], l, k); ctx.lineWidth = 1;
    ctx.beginPath();
    for (const t of m.ts) { if (!t.flag) continue; const [x, y, s] = pos(t); ctx.moveTo(x, y - 7 * s); ctx.lineTo(x, y - 13 * s); }
    ctx.stroke();
    ctx.fillStyle = css([206, 64, 46], l, k, 0.25);
    ctx.beginPath();
    for (const t of m.ts) { if (!t.flag) continue; const [x, y, s] = pos(t), fl = Math.sin(W.t * 3 + t.ph) * s; ctx.moveTo(x, y - 13 * s); ctx.lineTo(x + 5 * s, y - 12 * s + fl); ctx.lineTo(x, y - 10.4 * s); ctx.closePath(); }
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    for (const t of m.ts) {
      if (!t.fire) continue;
      const [x0, y] = pos(t), x = x0 + 8 * LS(l);
      ctx.globalAlpha = k * nk * (0.6 + 0.3 * Math.sin(W.t * 4 + t.ph));
      ctx.drawImage(SP.warm, x - 7, y - 9, 14, 14);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 七千人（19:18）：遍地亮起的小灯
  const SEVEN = [];
  function buildSeven() {
    const r = U.mulberry32(7000);
    for (let i = 0; i < 640; i++) {
      const l = i < 220 ? 0 : i < 430 ? 1 : 2;
      const x0 = l === 0 ? 0.12 : l === 1 ? 0.5 : 0.36;
      const x = x0 + r() * (1 - x0);
      SEVEN.push({ l, x, v: r(), rank: 0.55 * Math.min(1, Math.abs(x - 0.62) / 0.5) + 0.45 * r(), sz: 1 + r() * 1.4, big: r() < 0.24, ph: r() * TAU });
    }
  }
  function drawSeven(ctx, l) {
    const k = W.lv.elSeven;
    if (k < 0.005 || !SEVEN.length) return;
    SP || sprites();
    const nk = nightK(), A = 0.1 + 0.9 * nk, u = Math.max(0.55, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,222,160)';
    ctx.globalAlpha = A * 0.9;
    ctx.beginPath();
    const pts = [];
    const key = W.w + 'x' + W.h;
    for (const q of SEVEN) {
      if (q.l !== l || q.rank > k) continue;
      if (q.key !== key) {
        q.key = key;
        const g = gY(l, q.x), bot = l === 2 ? W.h - 6 : W.waterlineY(l) - 1;
        q.y = g < bot ? g + q.v * (bot - g) * (l === 2 ? 0.7 : 0.8) + (l === 2 ? 2 : 0.5) : null;
      }
      if (q.y == null) continue;
      const y = q.y;
      const s = q.sz * u * (l === 0 ? 0.6 : l === 1 ? 0.8 : 1.1) * (0.8 + 0.2 * Math.sin(W.t * 1.7 + q.ph));
      ctx.rect(q.x * W.w - s / 2, y - s / 2, s, s);
      if (q.big) pts.push(q.x * W.w, y, s);
    }
    ctx.fill();
    ctx.globalAlpha = A * 0.5;
    for (let i = 0; i < pts.length; i += 3) { const r = pts[i + 2] * 5.5; ctx.drawImage(SP.warm, pts[i] - r, pts[i + 1] - r, r * 2, r * 2); }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 天象 ────────────────────────────────────────────────────
  // 旱：天边发白、地气蒸腾（17:1）——预绘的渐变条，按程度调深浅
  function drawDrySky(ctx) {
    const k = W.lv.elDry, a = 0.34 * k * W.daylight;
    if (k < 0.01 || a < 0.004) return;
    SP || sprites();
    const hz = W.horizonY;
    ctx.globalAlpha = a;
    ctx.drawImage(SP.dryHaze, 0, hz * 0.35, W.w, hz * 0.65 + 1);
    ctx.globalAlpha = 1;
  }
  function drawDryNear(ctx) {
    const k = W.lv.elDry;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalAlpha = 0.16 * k * (0.4 + 0.6 * W.daylight);
    ctx.drawImage(SP.dryNear, 0, W.horizonY, W.w, W.h - W.horizonY);
    ctx.globalAlpha = 1;
  }
  // 如人手的一小片云从海里上来（18:44）
  function drawHand(ctx) {
    const k = W.lv.elHand;
    if (k < 0.005 || W.lv.storm > 0.7) return;
    SP || sprites();
    // 从海里上来：自海平线升起，升到经文之上的天空里
    const x = (port() ? 0.3 : 0.34) * W.w, hz = W.horizonY, rise = smoothstep(0, 1, k), u = Math.max(0.6, W.unit);
    const y = lerp(hz - 4 * u, port() ? W.h * 0.42 : W.h * 0.36, rise);
    const R = (7 + 15 * rise) * u, fade = 1 - smoothstep(0.35, 0.7, W.lv.storm);
    const lit = W.dusk * 0.7 + W.daylight * 0.3, A = fade * clamp(k * 4, 0, 1);
    for (let i = 0; i < 5; i++) {
      const ox = (i - 2) * R * 0.42 + Math.sin(W.t * 0.4 + i) * R * 0.06, oy = -(i % 2) * R * 0.28 + Math.abs(i - 2) * R * 0.08;
      ctx.globalAlpha = A * 0.9;
      ctx.drawImage(SP.cloudD, x + ox - R * 0.75, y + oy - R * 0.55, R * 1.5, R * 1.1);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const ox = (i - 2) * R * 0.42 + R * 0.12, oy = -(i % 2) * R * 0.28 + Math.abs(i - 2) * R * 0.08 - R * 0.22;
      ctx.globalAlpha = A * (0.18 + 0.4 * lit);
      ctx.drawImage(SP.cloud, x + ox - R * 0.5, y + oy - R * 0.3, R, R * 0.55);
    }
    ctx.globalAlpha = A * (0.2 + 0.35 * lit);
    ctx.drawImage(SP.gold, x - R * 1.6, y - R * 1.2, R * 3.2, R * 2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  const FIRE_LAYERS = [['fOut', 1.55, 0.75, 45], ['fMid', 0.85, 1.05, 70], ['fCore', 0.3, 1.15, 90]];   // 名、宽、亮、每层至多几条
  // 天开之处：画面上方聚拢的云向四围分开，当中一圈金边；火从那里降下
  function riftXY() { return [X.lordAlt * W.w, W.h * (port() ? 0.22 : 0.085)]; }
  const RIFT_N = 7;
  function riftPuff(i, rh, open) {
    const m = M(), a = i / RIFT_N * TAU + 0.35, P = m * (0.13 + 0.06 * hsh(i * 3.1)), dd = rh + P * (0.35 + 0.45 * open);
    return [Math.cos(a), Math.sin(a), P, dd];
  }
  function drawRift(ctx, A, h) {
    SP || sprites();
    const [cx, cy] = riftXY(), m = M();
    const open = smoothstep(0, 0.4, h), rh = m * lerp(0.012, 0.07, open);
    // 沿天顶铺开的云
    for (let i = 0; i < 6; i++) {
      const sd = i % 2 ? 1 : -1, j = i >> 1;
      const P = m * (0.26 + 0.1 * hsh(i * 2.3)), ox = sd * (0.17 + 0.15 * j + 0.04 * open) * W.w, oy = (-0.025 + 0.05 * hsh(i * 4.1)) * W.h;
      ctx.globalAlpha = A * 0.5;
      ctx.drawImage(SP.cloudD, cx + ox - P, cy + oy - P * 0.4, P * 2, P * 0.8);
    }
    // 围着天开之处的云
    for (let i = 0; i < RIFT_N; i++) {
      const [ca, sa, P, dd] = riftPuff(i, rh, open);
      ctx.globalAlpha = A * 0.85;
      ctx.drawImage(SP.cloudD, cx + ca * dd * 1.7 - P, cy + sa * dd * 0.55 - P * 0.5, P * 2, P);
    }
    if (h > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      // 云朝里的一面被照亮：每朵云的内半边染上金光（大而淡，彼此相融，不成一圈）
      ctx.globalAlpha = h * 0.3;
      ctx.drawImage(SP.gold, cx - rh * 6, cy - rh * 2.6, rh * 12, rh * 5.2);
      for (let i = 0; i < RIFT_N; i++) {
        const [ca, sa, P, dd] = riftPuff(i, rh, open), f = 0.62;
        const px = cx + ca * dd * 1.7 * f, py = cy + sa * dd * 0.55 * f;
        ctx.globalAlpha = h * (0.2 + 0.12 * hsh(i * 5.7));
        ctx.drawImage(SP.gold, px - P * 0.85, py - P * 0.42, P * 1.7, P * 0.84);
      }
      // 当中的光
      ctx.globalAlpha = h * 0.85;
      ctx.drawImage(SP.gold, cx - rh * 3.6, cy - rh * 1.7, rh * 7.2, rh * 3.4);
      ctx.globalAlpha = h;
      ctx.drawImage(SP.white, cx - rh * 1.6, cy - rh * 0.72, rh * 3.2, rh * 1.44);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 自天降下的火（18:38）：天开一处，火从那里倾下，落在坛上，火舌四溅
  function drawHeaven(ctx) {
    const k = W.lv.elHeaven, A = Math.max(W.lv.elHush, k);
    if (A < 0.01) return;
    SP || sprites();
    drawRift(ctx, A, k);
    if (k < 0.01) return;
    const s = LS(2), xf = X.lordAlt, x = xf * W.w, yA = surfY(xf) - 8 * s;
    const ry = riftXY()[1];
    const reach = smoothstep(0, 0.42, k);
    const yB = lerp(ry, yA, reach);
    const w0 = Math.max(20, 46 * s) * (0.9 + 0.1 * Math.sin(W.t * 9));
    const span = Math.max(1, yA - ry), y0 = Math.round(ry);
    const wf = t => 0.78 + 0.85 * Math.pow(1 - t, 3) + 0.42 * Math.pow(t, 4);   // 出处宽，中间收，落处又散开
    ctx.globalCompositeOperation = 'lighter';
    // 坛的四围映亮（只在近处，不染满天）
    const G = M() * 0.5;
    ctx.globalAlpha = 0.38 * k * reach;
    ctx.drawImage(SP.warm, x - G, yA - G * 0.75, G * 2, G * 1.5);
    // 火柱：一条一条横向的细片，边缘柔和，轮廓随时间翻滚
    const wob = y => 1 + Math.sin(y * 0.012 - W.t * 6.3) * 0.12 + Math.sin(y * 0.026 + W.t * 9.1) * 0.06;
    const fadeEnd = reach < 0.97;
    for (const L of FIRE_LAYERS) {
      const base = Math.min(1, k * L[2]), spr = SP[L[0]], step = Math.max(3, Math.ceil(span / L[3]));
      for (let y = y0; y < yB; y += step) {
        const t = (y - ry) / span, w = w0 * L[1] * wf(t) * wob(y);
        const cxx = x + Math.sin(y * 0.03 + W.t * 5) * w0 * 0.035;
        let al = base * smoothstep(-0.01, 0.1, t);             // 自天开之处的光里渐渐显出
        if (fadeEnd) al *= clamp((yB - y) / (60 * s + 20), 0, 1);
        if (al < 0.004) continue;
        ctx.globalAlpha = al;
        ctx.drawImage(spr, cxx - w, y, 2 * w, step);
      }
    }
    // 柱边翻出的火舌
    for (let i = 0; i < 22; i++) {
      const ph = U.fract(W.t * (0.7 + 0.4 * hsh(i * 1.7)) + i / 22), yy = lerp(ry, yB, ph), side = i % 2 ? 1 : -1;
      const ww = w0 * 0.85 * wf((yy - ry) / span), off = side * ww * (0.85 + 0.3 * Math.sin(W.t * 6 + i));
      ctx.globalAlpha = k * Math.sin(ph * Math.PI) * 0.42;
      const r = ww * 0.34;
      ctx.drawImage(i % 3 ? SP.ember : SP.warm, x + off - r, yy - r * 1.5, r * 2, r * 3);
    }
    // 落处：一团白金的光，火在坛的四围
    if (reach > 0.9) {
      const e = (reach - 0.9) / 0.1, R = w0 * 2.7;
      ctx.globalAlpha = k * e * 0.7;
      ctx.drawImage(SP.gold, x - R, yA - R * 0.62, R * 2, R * 1.2);
      ctx.globalAlpha = k * e * 0.6;
      ctx.drawImage(SP.white, x - R * 0.4, yA - R * 0.3, R * 0.8, R * 0.55);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (let i = 0; i < 9; i++) {
        const fxp = x + (i - 4) * w0 * 0.3, h = w0 * (0.55 + 0.45 * hsh(i * 3.1)) * (1 - Math.abs(i - 4) * 0.08);
        flame(ctx, fxp, yA + 8 * s + Math.abs(i - 4) * 1.5 * s, h * (0.6 + 0.4 * k), k * e, i * 2.3);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 降下大雨（18:45）：在核心的雨之上，再加几道远处移过海面的雨幕与更密的雨丝
  function drawGreatRain(ctx) {
    const r = W.lv.rain;
    if (r < 0.3) return;
    SP || sprites();
    const k = (r - 0.3) / 0.7, u = Math.max(0.6, W.unit), hz = W.horizonY, top = W.h * 0.08;
    for (let i = 0; i < 4; i++) {
      const ph = U.fract(W.t * 0.011 + i * 0.27), x = (ph * 1.4 - 0.2) * W.w, w = W.w * (0.12 + 0.06 * hsh(i * 3.3));
      ctx.globalAlpha = k * 0.26;
      ctx.drawImage(SP.cloudD, x - w / 2, top, w, hz - top + 24);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = U.rgba(200, 210, 230, (0.16 + 0.1 * W.daylight) * k);
    ctx.lineWidth = Math.max(0.7, 0.9 * u);
    ctx.beginPath();
    const n = Math.round(150 * (W.quality || 1));
    for (let i = 0; i < n; i++) {
      const len = (18 + 22 * hsh(i * 2.1)) * u, spd = (1100 + 500 * hsh(i * 4.7)) * u, H = W.h + len;
      const yy = hsh(i * 7.3) * H + W.t * spd, y = (yy % H) - len;
      const x = ((hsh(i * 1.9) * W.w * 1.3 + 0.25 * yy) % (W.w * 1.3)) - W.w * 0.15;
      ctx.moveTo(x, y); ctx.lineTo(x + 0.25 * len, y + len);
    }
    ctx.stroke();
  }
  // 屏息：天色沉为深靛（预绘的渐变条）
  function drawHushSky(ctx) {
    const k = Math.max(W.lv.elHush, W.lv.elHeaven * 0.9);
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalAlpha = 0.8 * k;
    ctx.drawImage(SP.hushSky, -20, -20, W.w + 40, W.horizonY + 21);
    ctx.globalAlpha = 1;
  }
  // 屏息：四围压暗，只余山顶（预绘的晕）
  function drawHush(ctx) {
    const k = Math.max(W.lv.elHush, W.lv.elHeaven * 0.75);
    if (k < 0.01) return;
    const x = X.lordAlt * W.w, y = surfY(X.lordAlt) - 20 * LS(2);
    const c = vig('hush', Math.round(x) + ',' + Math.round(y), g => {
      const gr = g.createRadialGradient(x, y, M() * 0.08, x, y, Math.hypot(W.w, W.h) * 0.85);
      gr.addColorStop(0, 'rgba(6,8,22,0)'); gr.addColorStop(0.35, 'rgba(6,8,22,0.45)'); gr.addColorStop(1, 'rgba(6,8,22,1)');
      g.fillStyle = gr; g.fillRect(0, 0, W.w, W.h);
    });
    ctx.globalAlpha = 0.62 * k;
    ctx.drawImage(c, -2, -2, W.w + 4, W.h + 4);
    ctx.globalAlpha = 1;
  }
  // 地震后有火：天边映红（预绘的晕）
  function drawBlazeSky(ctx) {
    const k = W.lv.elBlaze;
    if (k < 0.01) return;
    const x = X.horeb * W.w, y = W.horizonY, R = Math.max(W.w, W.h) * 0.7;
    const c = vig('blaze', String(Math.round(y)), g => {
      const gr = g.createRadialGradient(x, y, 0, x, y, R);
      gr.addColorStop(0, 'rgba(255,110,50,1)'); gr.addColorStop(0.5, 'rgba(190,60,36,0.44)'); gr.addColorStop(1, 'rgba(120,30,20,0)');
      g.fillStyle = gr; g.fillRect(0, 0, W.w, y + 1);
    });
    ctx.globalAlpha = 0.5 * k;
    ctx.drawImage(c, 0, 0, W.w, W.h);
    ctx.globalAlpha = 1;
  }
  // 烈风：尘与碎石横扫而过（19:11）
  function drawWind(ctx) {
    const k = W.lv.elWind;
    if (k < 0.01) return;
    const u = Math.max(0.55, W.unit), n = Math.round(90 * (W.quality || 1) * k);
    ctx.strokeStyle = U.rgba(214, 196, 170, 0.3 * k);
    ctx.lineWidth = 1 * u;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const sp = (1400 + 900 * hsh(i * 3.3)) * u, y = (0.15 + 0.8 * hsh(i * 1.7)) * W.h, len = (40 + 90 * hsh(i * 5.1)) * u;
      const x = ((hsh(i * 7.7) * W.w * 1.4 + W.t * sp) % (W.w * 1.4)) - W.w * 0.2;
      ctx.moveTo(x, y); ctx.lineTo(x - len, y + len * 0.06);
    }
    ctx.stroke();
    ctx.fillStyle = U.rgba(120, 100, 90, 0.8 * k);
    ctx.beginPath();
    for (let i = 0; i < n * 0.4; i++) {
      const sp = (700 + 500 * hsh(i * 9.1)) * u, ph = hsh(i * 2.9);
      const x = ((ph * W.w * 1.3 + W.t * sp) % (W.w * 1.3)) - W.w * 0.15, y = (0.45 + 0.45 * hsh(i * 4.4)) * W.h + Math.sin(W.t * 5 + i) * 6 * u, r = (1 + 2.2 * hsh(i * 6.2)) * u;
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU);
    }
    ctx.fill();
    // 天色被风扬起的尘染暗
    ctx.fillStyle = U.rgba(96, 84, 76, 0.16 * k);
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
  }
  // 火后有微小的声音（19:12）：一切止息。没有形状——洞口一点慢慢呼吸的微光，
  // 几粒清冷的微尘从以利亚身旁飘过，月光落在他肩上；静与止便是这一幕
  function drawStill(ctx) {
    const k = W.lv.elStill;
    if (k < 0.01) return;
    SP || sprites();
    const v = vig('still', '', g => {
      const gr = g.createRadialGradient(W.w * 0.6, W.h * 0.55, M() * 0.2, W.w * 0.6, W.h * 0.55, Math.hypot(W.w, W.h) * 0.75);
      gr.addColorStop(0, 'rgba(10,14,30,0)'); gr.addColorStop(1, 'rgba(10,14,30,1)');
      g.fillStyle = gr; g.fillRect(0, 0, W.w, W.h);
    });
    ctx.globalAlpha = 0.42 * k;
    ctx.drawImage(v, -2, -2, W.w + 4, W.h + 4);
    const c = caveXY(0.009), s = LS(2), cx = c[0], cy = c[1] - 10 * s;
    const br = 0.5 + 0.5 * Math.sin(W.t * TAU / 6);      // 约六秒一次的呼吸
    ctx.globalCompositeOperation = 'lighter';
    const R = 64 * s * (0.92 + 0.12 * br);
    ctx.globalAlpha = k * (0.14 + 0.16 * br);
    ctx.drawImage(SP.pale, cx - R, cy - R * 0.62, R * 2, R * 1.24);
    ctx.globalAlpha = k * (0.04 + 0.05 * br);
    ctx.drawImage(SP.pale, cx - R * 2.6, cy - R * 1.3, R * 5.2, R * 2.6);
    // 飘过的微尘
    ctx.fillStyle = 'rgb(214,226,255)';
    for (let i = 0; i < 12; i++) {
      const ph = U.fract(W.t * (0.022 + 0.012 * hsh(i * 1.3)) + hsh(i * 3.7));
      const x = cx + (-120 + 260 * ph) * s, y = cy - (4 + 70 * hsh(i * 5.3)) * s + Math.sin(W.t * 0.35 + i * 1.9) * 7 * s;
      const r = (0.6 + 0.7 * hsh(i * 9.1)) * s, a = k * 0.5 * Math.sin(ph * Math.PI);
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      ctx.globalAlpha = a * 0.3;
      ctx.drawImage(SP.pale, x - r * 5, y - r * 5, r * 10, r * 10);
    }
    // 月光在他肩上
    if (has('elijah')) {
      const h = headOf('elijah', 26), side = W.moon && W.moon.x < h[0] ? -1 : 1;
      ctx.globalAlpha = k * 0.3;
      ctx.drawImage(SP.pale, h[0] + side * 4 * s - 10 * s, h[1] - 8 * s, 20 * s, 22 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); }
  function beam(b, xf, yPx, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, y: yPx, w: (o.w || 70) * Math.max(0.55, W.unit), k: o.k || 1 });
    if (o.ring !== false) bloom(b, xf, yPx - 16 * LS(2), o.r || 0.3, 1.6, 0.45);
  }
  // 柔和的一团光：由小而大，渐渐淡去（代替硬边的光圈）
  function bloom(b, xf, yPx, r, dur, k) { if (!b.instant) FXL.push({ type: 'bloom', t: 0, dur: dur || 1.4, xf, yf: yPx / W.h, r: r || 0.3, k: k == null ? 0.6 : k }); }
  function beamOn(b, id, o) { const f = footOf(id); if (f) beam(b, f[0] / W.w, f[1], o); }
  function drawTransients(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = e.y + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.42 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        ctx.globalAlpha = env * e.k * 0.5;
        const g = e.w * 1.8;
        ctx.drawImage(SP.gold, x - g / 2, y - g * 0.55, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'bloom' && pass === 'air') {
        const f = smoothstep(0, 1, q), Rr = M() * e.r * lerp(0.3, 1, f), a = (1 - q) * (1 - q) * e.k * smoothstep(0, 0.08, q);
        const x = e.xf * W.w, y = e.yf * W.h;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a;
        ctx.drawImage(SP.gold, x - Rr, y - Rr * 0.7, Rr * 2, Rr * 1.4);
        ctx.globalAlpha = a * 0.5;
        ctx.drawImage(SP.white, x - Rr * 0.3, y - Rr * 0.2, Rr * 0.6, Rr * 0.4);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'seam' && pass === 'air') {
        // 「这事出于我」：一幅柔和的光幕落在两群人之间，到地为止；光再沿着地面向两边淡淡地铺开
        const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = gY(2, e.xf), u = Math.max(0.6, W.unit);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.55;
        ctx.drawImage(SP.curtain, x - 24 * u, -30, 48 * u, y + 32);
        ctx.globalAlpha = env * 0.4;
        ctx.drawImage(SP.curtain, x - 7 * u, -30, 14 * u, y + 32);
        const spread = smoothstep(0.04, 0.6, q) * 0.045 * W.w;
        for (let i = -5; i <= 5; i++) {
          const xx = x + (i / 5) * spread, yy = gY(2, xx / W.w) + 1, r = (11 - Math.abs(i)) * 1.5 * u;
          ctx.globalAlpha = env * 0.4 * (1 - Math.abs(i) / 6.5);
          ctx.drawImage(SP.gold, xx - r, yy - r * 0.32, r * 2, r * 0.64);
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'crack' && pass === 'air') {
        // 坛裂开：两半之间一道发光的缝，两三秒才暗下去
        const p = getP('calfB');
        if (!p || p.noAltar) continue;
        const G = calfGeom(p), s = G.s, A = G.A, ax = G.ax, ay = G.ay, ah = G.ah;
        const env = smoothstep(0, 0.05, q) * (1 - smoothstep(0.4, 1, q));
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.6;
        ctx.drawImage(SP.gold, ax - 6 * s * A, ay - ah * 1.2, 12 * s * A, ah * 1.35);
        ctx.strokeStyle = 'rgb(255,236,190)'; ctx.lineWidth = Math.max(1, 1.5 * s);
        ctx.globalAlpha = env;
        ctx.beginPath();
        ALTAR_L.forEach((pt, i) => { const px = ax + pt[0] * s * A, py = ay + pt[1] * ah / 11; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
        ctx.stroke();
        ctx.globalAlpha = env * 0.55;
        ctx.drawImage(SP.gold, ax - 26 * s * A, ay - ah * 0.5 - 26 * s * A, 52 * s * A, 52 * s * A);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'crown' && pass === 'air') {
        const h = headOf(e.id, 36), env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.6, 1, q));
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.8;
        const r = 18 * Math.max(0.6, W.unit);
        ctx.drawImage(e.fire ? SP.ember : SP.gold, h[0] - r, h[1] - r, r * 2, r * 2);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'ravens' && pass === 'air') {
        drawRavens(ctx, e, q);
      } else if (e.type === 'pour' && pass === 'air') {
        // 四个桶盛满水，倒在燔祭和柴上（18:33）
        const a = getP('lordAlt');
        if (!a) continue;
        const s = LS(2), tx = a.x * W.w, ty = surfY(a.x) - 12 * s, env = 1 - smoothstep(0.75, 1, q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(200,226,255)';
        for (const id of e.ids) {
          const h = headOf(id, 26);
          for (let i = 0; i < 14; i++) {
            const f = U.fract(e.t * 1.6 + i / 14), bx = lerp(h[0], tx, f), by = lerp(h[1], ty, f) - Math.sin(f * Math.PI) * 14 * s;
            ctx.globalAlpha = env * 0.75 * (1 - f * 0.3);
            ctx.fillRect(bx - 1 * s, by - 1 * s, 2 * s, 2.4 * s);
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'mantle' && pass === 'air') {
        // 以利亚将自己的外衣搭在他身上（19:19）
        const a = headOf(e.from, 26), b2 = headOf(e.to, 26), f = smoothstep(0, 1, q), s = LS(2) * 1.2;
        const x = lerp(a[0], b2[0], f), y = lerp(a[1], b2[1], f) - Math.sin(f * Math.PI) * 30 * s;
        ctx.globalAlpha = 1 - smoothstep(0.85, 1, q);
        ctx.fillStyle = css(ROBE.elijah, 2);
        ctx.beginPath(); ctx.moveTo(x - 7 * s, y - 2 * s); ctx.quadraticCurveTo(x, y - 6 * s - Math.sin(e.t * 12) * 2 * s, x + 7 * s, y - 2 * s); ctx.lineTo(x + 5 * s, y + 5 * s); ctx.quadraticCurveTo(x, y + 3 * s, x - 5 * s, y + 5 * s); ctx.closePath(); ctx.fill();
        glowAt(ctx, SP.gold, x, y, 16 * s, 0.4 * (1 - q));
      } else if (e.type === 'arrow' && pass === 'air') {
        // 有一人随便开弓（22:34）
        const b2 = headOf('ahab', 22), x0 = W.w * 0.28, y0 = W.horizonY - 0.06 * W.h, f = smoothstep(0, 0.5, q);
        const x = lerp(x0, b2[0], f), y = lerp(y0, b2[1], f) - Math.sin(f * Math.PI) * 0.12 * W.h, env = 1 - smoothstep(0.6, 1, q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = U.rgba(255, 226, 180, 0.8 * env); ctx.lineWidth = 1.2 * Math.max(0.6, W.unit);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - (b2[0] - x0) * 0.08, y + 0.02 * W.h * (1 - f)); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'battle' && pass === e.pass) {
        const p = Math.pow(Math.max(0, Math.sin(e.t * 4.1 + e.xf * 9)), 5) * (1 - q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = p * 0.55;
        const g = W.h * 0.28, l = e.pass === 'far' ? 0 : 1;
        ctx.drawImage(SP.ember, e.xf * W.w - g / 2, gY(l, e.xf) - g / 2, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'tally' && pass === 'air') {
        // 如此七次：仆人头上一次一次亮起的小点
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.7, 1, q)), u = Math.max(0.6, W.unit);
        const h = headOf('servant', 40), a = (e.i - 3) * 0.28;
        const x = h[0] + Math.sin(a) * 26 * u, y = h[1] - Math.cos(a) * 16 * u;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * 0.8;
        ctx.drawImage(SP.gold, x - 6 * u, y - 6 * u, 12 * u, 12 * u);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 乌鸦早晚给他叼饼和肉来（17:6）
  function drawRavens(ctx, e, q) {
    const tgt = headOf('elijah', 30), u = Math.max(0.6, W.unit) * (W.w < 600 ? 1.2 : 1.4);
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const tq = clamp((e.t - i * 0.4) / (e.dur - 1.2), 0, 1);
      if (tq <= 0 || tq >= 1) continue;
      const sx = W.w * (1.04 + i * 0.03), sy = W.h * (0.14 + 0.05 * i), tx = tgt[0] + (i - 1) * 12 * u, ty = tgt[1] - 14 * u - i * 4 * u;
      const ex = W.w * (0.72 + 0.1 * i), ey = -0.06 * W.h;
      let x, y, carry;
      if (tq < 0.45) { const f = smoothstep(0, 1, tq / 0.45); x = lerp(sx, tx, f); y = lerp(sy, ty, f) - Math.sin(f * Math.PI) * 30 * u; carry = true; }
      else if (tq < 0.62) { const f = (tq - 0.45) / 0.17; x = tx + Math.sin(f * TAU) * 8 * u; y = ty + Math.cos(f * TAU) * 3 * u; carry = f < 0.5; }
      else { const f = smoothstep(0, 1, (tq - 0.62) / 0.38); x = lerp(tx, ex, f); y = lerp(ty, ey, f); carry = false; }
      const fl = Math.sin(e.t * 11 + i * 1.7) * 4 * u;
      ctx.strokeStyle = U.rgba(20, 18, 24, 0.92);
      ctx.lineWidth = 2 * u;
      ctx.beginPath(); ctx.moveTo(x - 9 * u, y - fl); ctx.quadraticCurveTo(x - 4 * u, y - 3 * u, x, y); ctx.quadraticCurveTo(x + 4 * u, y - 3 * u, x + 9 * u, y - fl); ctx.stroke();
      ctx.fillStyle = U.rgba(20, 18, 24, 0.92);
      ctx.beginPath(); ctx.ellipse(x, y + 0.5 * u, 3.2 * u, 1.6 * u, 0, 0, TAU); ctx.fill();
      if (carry) {
        ctx.fillStyle = 'rgb(236,210,160)';
        ctx.fillRect(x - 1.4 * u, y + 2 * u, 2.8 * u, 2 * u);
      }
    }
  }

  // 崩山碎石：碎石被风卷起，滚落（纯装饰，重演时不放）
  function rockfall(b) {
    if (b.instant) return;
    const p = getP('horeb');
    if (!p) return;
    const s = LS(2), hw = MOUNTS.horeb.hw;
    for (let i = 0; i < 46; i++) {
      const u = -0.7 + 1.4 * Math.random(), xf = p.x + u * hw, y = surfY(xf) - Math.random() * 6 * s;
      fx().add({ x: xf * W.w, y, vx: (60 + Math.random() * 180) * s, vy: (-80 + Math.random() * 60) * s, max: 1.2 + Math.random() * 1.4,
        size: (1.4 + Math.random() * 2.4) * s, c: [120 + Math.random() * 30, 100, 92], drag: 0.6, grav: 240 * s, a: 0.95, pass: 'near' });
    }
    for (let i = 0; i < 5; i++) { const u = -0.5 + i * 0.25, xf = p.x + u * hw; fx().dust(xf * W.w, surfY(xf), 30, [150, 128, 116], 18 * s, 'near'); }
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'city': drawCity(ctx, p); break;
      case 'calf': drawCalf(ctx, p); break;
      case 'temple': drawTemple(ctx, p); break;
      case 'brook': drawBrook(ctx, p); break;
      case 'gate': drawGate(ctx, p); break;
      case 'house': drawHouse(ctx, p); break;
      case 'jars': drawJars(ctx, p); break;
      case 'mount': case 'horeb': drawMount(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'broom': drawBroom(ctx, p); break;
      case 'field': drawField(ctx, p); break;
      case 'vines': drawVines(ctx, p); break;
      case 'thrones': drawThrones(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { city: 0, field: 0.5, vines: 0.6, brook: 1, mount: 2, horeb: 2, temple: 3, gate: 3, house: 3.2, broom: 3.5, calf: 4, thrones: 4, altar: 5, jars: 6 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  const SCENE = {
    init() { sprites(); if (!SEVEN.length) buildSeven(); },
    resize() {},
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k of KEYS) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, (k === 'grow' && p.gs ? p.gs : EASE[k]) * f);
        }
        if (p.dying && p.a < 0.01) P.delete(id);
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 地震：大地摇动
      if (W.lv.elQuake > 0.15 && !W.replaying && !W.reduced) W.shake = Math.max(W.shake || 0, 0.55 * W.lv.elQuake + 0.15 * Math.sin(W.t * 23));
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawDrySky(ctx); drawHushSky(ctx); drawBlazeSky(ctx); drawHand(ctx); drawTransients(ctx, 'sky'); return; }
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        if (l === 1) drawCamp(ctx);
        for (const p of sortProps()) {
          if (p.layer !== l || p.a < 0.005) continue;
          drawKind(ctx, p);
        }
        drawSeven(ctx, l);
        if (pass === 'near') drawDryNear(ctx);
        if (pass === 'far' || pass === 'mid') drawTransients(ctx, pass);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'air') {
        drawHush(ctx);
        drawGreatRain(ctx);
        drawWind(ctx);
        drawStill(ctx);
        drawHeaven(ctx);
        drawTransients(ctx, 'air');
      }
    },
    reset() { P.clear(); FXL.length = 0; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      FXL.length = 0;
    },
    // 走查时比对"看完"与"恢复"：本卷布景的目标状态
    sig() {
      const out = {};
      for (const p of P.values()) {
        if (p.dying) continue;
        out[p.id] = [p.kind, +p.x.toFixed(3), p.layer, p.ta, +p.tgrow.toFixed(2), +p.tfire.toFixed(2), +p.tlit.toFixed(2), +p.tcrack.toFixed(2), +p.twet.toFixed(2), +p.tburn.toFixed(2), +p.tdim.toFixed(2), p.label].join('|');
      }
      return { props: out, S };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || p.grow < 0.3) continue;
        const s = LS(p.layer) * (p.size || 1);
        let px = (p.kind === 'mount' || p.kind === 'horeb' || p.kind === 'field' || p.kind === 'vines' ? p.x : pX(p.x, p.cap)) * W.w, py;
        if (p.kind === 'mount' || p.kind === 'horeb') py = surfY(p.x) + 20 * s;
        else if (p.kind === 'altar') py = surfY(p.x) - 8 * s;
        else if (p.kind === 'field' || p.kind === 'vines') { px = (p.x0 + p.x1) / 2 * W.w; py = gY(2, (p.x0 + p.x1) / 2) + 8 * s; }
        else if (p.kind === 'city') py = gY(p.layer, p.x) - 110 * s * 0.15 - (p.hill || 0) * 110 * s;
        else if (p.kind === 'thrones') { px = (X.throneA + X.throneJ) / 2 * W.w; py = gY(2, X.throneA) - 14 * s; }
        else py = gY(p.layer, p.x) - ({ calf: 14, temple: 18, brook: -12, gate: 16, house: 14, jars: 5, broom: 22 }[p.kind] || 10) * s;
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 10 * s, d };
      }
      return best;
    },
  };

  // 本卷开始时（幕后）重置布景
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：示剑，清晨
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 迦南的丘陵：青草、橄榄树多在西边（右）的山上
    const L = Object.assign({ deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 0.85, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      bare: 0.16, bloom: 0.55, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 }, MY_LEVELS);
    for (const k in L) if (!W.hasLevel || W.hasLevel(k)) W.set(k, L[k], true);
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.setOrigin('grass', W.w * 0.72, W.ridgeBaseY(2, W.w * 0.72));
    W.setOrigin('herbs', W.w * 0.85, W.ridgeBaseY(2, W.w * 0.85));
    W.freeClock = false;
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.95, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 110, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.5, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 16, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 远山上的耶路撒冷；示剑
    prop('jeru', 'city', { x: X.jeru, layer: 0, size: 1.1, variant: 'jeru', label: '耶路撒冷' });
    prop('shechem', 'city', { x: X.shechem, layer: 1, size: 1.15, variant: 'town', label: '示剑' });
    const c = C();
    c.clear({ fade: false });
    add('reho', { label: '罗波安', sex: 'm', age: 'adult', x: X.reho, facing: 1, robe: ROBE.reho, accent: GOLD, glow: 0.35, from: 'none' });
    crowd('judah', { n: 4, x0: 0.49, x1: 0.54, layer: 2, label: '犹大人', robe: [96, 88, 118], from: 'none' });
    crowdFace('judah', 1);
    add('jero', { label: '耶罗波安', sex: 'm', age: 'adult', x: X.jero, facing: -1, robe: ROBE.jero, glow: 0.3, from: 'none' });
    crowd('isr', { n: 13, x0: 0.695, x1: 0.95, layer: 2, label: '以色列众民', from: 'none' });
    crowdFace('isr', -1);
    avoid([0.45, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 12 国分为二；金牛犊 ──────────────────────────────────
    {
      kind: 'cmd', utter: '各归各家去吧！因为这事出于我', cmd: 'git branch 以色列 && git branch 犹大  # 这事出于我', ref: '12:24',
      verse: [
        { text: '以色列众民见王不依从他们，就对王说：我们与大卫有什么分儿呢？……<br>以色列人哪，各回各家去吧！大卫家啊，自己顾自己吧！', ref: '列王纪上 12:16', hold: 6.5 },
        { text: '以色列众人听见耶罗波安回来了，……立他作以色列众人的王。<br>除了犹大支派以外，没有顺从大卫家的。', ref: '列王纪上 12:20', hold: 6 },
        { text: '「耶和华如此说：你们不可上去与你们的弟兄以色列人争战。各归各家去吧！因为这事出于我。」<br>众人就听从耶和华的话，遵着耶和华的命回去了。', ref: '列王纪上 12:24', hold: 7 },
        { text: '王就筹划定妥，铸造了两个金牛犊，……<br>他就把牛犊一只安在伯特利，一只安在但。', ref: '列王纪上 12:28–29', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            flash(b, { type: 'seam', xf: X.seam, dur: 4.5 });
            flash(b, { type: 'crown', id: 'reho', dur: 2.6 });
            sfx(b, 'thunder', { far: true, low: true }); W.goTo(0.42, 24, b.instant);
          }],
          [0.6, b => { flash(b, { type: 'crown', id: 'jero', dur: 2.6 }); }],
          // 两群人各自退开：以色列转身离去，犹大人随罗波安退后
          [1, () => { crowdFace('isr', 1); crowdWalk('isr', 0.72, 0.97, { speed: 0.018 }); walk('jero', 0.7, { speed: 0.02 }); }],
          [1.6, () => { crowdWalk('judah', 0.46, 0.515, { speed: 0.02 }); }],
          [2.2, () => { pose('reho', 'raise'); }],
          [4.5, () => { pose('reho', 'stand'); walk('reho', 0.52, { speed: 0.024 }); crowdWalk('judah', 0.44, 0.5, { speed: 0.024 }); }],
          // 立耶罗波安作王
          [7, b => {
            walk('jero', X.king, { speed: 0.022 });
            sfx(b, 'crowd');
          }],
          [10.5, b => {
            add('jero', { accent: GOLD, glow: 0.5 });
            beamOn(b, 'jero', { dur: 5 });
            flash(b, { type: 'crown', id: 'jero', dur: 3 });
            crowdFace('isr', X.king);
            rm('reho'); rmCrowd('judah');
          }],
          [11.5, () => { crowdPose('isr', 'bow'); face('jero', -1); }],
          // 罗波安招聚犹大人要争战；神人示玛雅传耶和华的话，众人回去了
          [14, b => {
            crowdPose('isr', 'stand');
            crowd('army', { n: 7, x0: 0.41, x1: 0.48, layer: 2, label: '犹大的战士', robe: ROBE.army, prop: 'spear' });
            crowdFace('army', 1);
            crowdWalk('army', 0.47, 0.565, { speed: 0.03 });
            sfx(b, 'crowd', { far: true });
          }],
          [18.5, b => { flash(b, { type: 'seam', xf: 0.615, dur: 3.2 }); sfx(b, 'harp'); crowdFace('army', -1); }],
          [19.5, () => { crowdWalk('army', 0.41, 0.47, { speed: 0.026 }); }],
          // 两个金牛犊：伯特利与但
          [22, b => {
            rmCrowd('army');
            prop('calfB', 'calf', { x: X.bethel, ax: X.bethelAlt, ak: 2.2, size: 1.6, grow: 1, label: '金牛犊' });
            prop('calfD', 'calf', { x: X.dan, layer: 1, size: 1.5, noAltar: true, grow: 1, label: '但的金牛犊' });
            walk('jero', X.bethel + 0.05, { speed: 0.03 });
            crowdWalk('isr', 0.7, 0.97, { speed: 0.02 });
            sfx(b, 'build');
          }],
          [26.5, () => { face('jero', -1); pose('jero', 'point'); crowdFace('isr', X.bethel); }],
          [28.5, () => { pose('jero', 'stand'); crowdPose('isr', 'bow'); }],
        ]);
      },
    },

    // ── 13—14 神人向伯特利的坛呼叫；坛破裂；亚希雅的话 ─────────
    {
      kind: 'judge', utter: '这坛必破裂，坛上的灰必倾撒', cmd: 'rm -rf /伯特利/坛  # 灰必倾撒', ref: '13:3',
      verse: [
        { text: '那时，有一个神人奉耶和华的命从犹大来到伯特利。耶罗波安正站在坛旁要烧香；<br>神人奉耶和华的命向坛呼叫，说：「坛哪，坛哪！……」', ref: '列王纪上 13:1–2', hold: 7 },
        { text: '王向神人所伸的手就枯干了，不能弯回；<br>坛也破裂了，坛上的灰倾撒了，正如神人奉耶和华的命所设的预兆。', ref: '列王纪上 13:4–5', hold: 7 },
        { text: '于是神人从别的路回去，不从伯特利来的原路回去。', ref: '列王纪上 13:10', hold: 4.5 },
        { text: '耶和华必击打以色列人，使他们摇动，像水中的芦苇一般；……<br>因为他们做木偶，惹耶和华发怒。', ref: '列王纪上 14:15', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            crowdPose('isr', 'stand');
            prop('calfB', null, { fire: 1 });
            // 耶罗波安站在坛旁要烧香：坛在他与牛犊之间
            walk('jero', X.bethel + X.bethelAlt - 0.05, { speed: 0.04 });
            add('mog', { label: '神人', sex: 'm', age: 'adult', x: 0.41, facing: 1, robe: ROBE.mog, glow: 0.45, from: b.instant ? 'none' : 'fade' });
            walk('mog', 0.445, { speed: 0.03 });
            sfx(b, 'fire', { soft: true });
          }],
          [4.2, () => { face('jero', 1); pose('jero', 'raise'); }],
          [4.5, b => { pose('mog', 'point'); face('mog', 1); beamOn(b, 'mog', { dur: 3.5, w: 50, r: 0.2 }); }],
          // 王伸手：「拿住他吧！」——手就枯干了
          [8, () => { pose('jero', 'point'); face('jero', -1); crowdFace('isr', 0.5); }],
          [9.2, b => {
            S.withered = 1;
            glow('jero', 0.05);
            add('jero', { robe: WITHER });           // 伸出的手枯干了，不能弯回：他就那样僵在那里
            prop('calfB', null, { crack: 1, fire: 0 });
            flash(b, { type: 'crack', dur: 2.8 });
            if (!b.instant) {
              W.shake = 0.9; W.flash = Math.max(W.flash || 0, 0.25);
              const p = getP('calfB');
              if (p) {
                const G = calfGeom(p);
                fx().dust(G.ax, G.ay - G.ah * 0.4, 60, [150, 146, 140], 14 * G.s, 'near');
                fx().dust(G.ax, G.ay - 2 * G.s, 40, [128, 124, 120], 20 * G.s, 'near');
              }
            }
            sfx(b, 'thunder', { low: true }); sfx(b, 'stone');
          }],
          [11.5, () => { crowdPose('isr', 'kneel'); }],
          [13, () => { pose('mog', 'pray'); }],
          [15, b => { S.withered = 0; add('jero', { robe: ROBE.jero }); glow('jero', 0.4); pose('jero', 'stand'); sfx(b, 'harp', { soft: true }); }],
          [16, () => { pose('mog', 'stand'); walk('mog', 0.39, { speed: 0.028 }); crowdPose('isr', 'stand'); }],
          // 像水中的芦苇一般
          [20, b => { W.set('gale', 0.65, b.instant); sfx(b, 'wind'); rm('mog'); }],
          [22, () => { crowdPose('isr', 'bow'); }],
          [24.5, b => { W.set('gale', 0.08, b.instant); crowdPose('isr', 'stand'); }],
        ]);
      },
    },

    // ── 15—16 北国诸王起落；耶路撒冷的灯；撒马利亚；亚哈与耶洗别 ──
    {
      kind: 'act', utter: '仍使他在耶路撒冷有灯光', cmd: 'keep-alive --lamp 耶路撒冷  # 因大卫的缘故', ref: '15:4',
      verse: [
        { text: '然而耶和华他的神因大卫的缘故，仍使他在耶路撒冷有灯光，<br>叫他儿子接续他作王，坚立耶路撒冷。', ref: '列王纪上 15:4', hold: 6.5 },
        { text: '暗利行耶和华眼中看为恶的事，比他以前的列王作恶更甚。', ref: '列王纪上 16:25', hold: 5.5 },
        { text: '暗利用二他连得银子向撒玛买了撒马利亚山，在山上造城，<br>就按着山的原主撒玛的名，给所造的城起名叫撒马利亚。', ref: '列王纪上 16:24', hold: 6.5 },
        { text: '暗利的儿子亚哈行耶和华眼中看为恶的事，比他以前的列王更甚，……<br>又娶了西顿王谒巴力的女儿耶洗别为妻，去事奉敬拜巴力，<br>在撒马利亚建造巴力的庙，在庙里为巴力筑坛。', ref: '列王纪上 16:30–32', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.765, 14, b.instant);
            lv('elLamp', 1, b);
            const p = getP('jeru');
            if (p && !b.instant) beam(b, p.x, gY(0, p.x) - 12 * LS(0), { dur: 6, w: 40, r: 0.18 });
            sfx(b, 'harp');
            prop('calfB', null, { dim: 0.6 }); prop('calfD', null, { dim: 0.6 });
            crowdWalk('isr', 0.7, 0.99, { speed: 0.02 });
            walk('jero', 0.7, { speed: 0.02 });
          }],
          [3, () => { rmCrowd('isr'); rm('jero'); }],
          // 北国的王一个接一个（拿答、巴沙、以拉、心利、暗利）
          ...KINGS.map((k, i) => [3.5 + i * 1.8, b => {
            if (i > 0) rm(KINGS[i - 1][0]);
            add(k[0], { label: k[1], sex: 'm', age: 'adult', x: X.kingsM + (i % 2 ? 0.014 : -0.01), facing: i % 2 ? -1 : 1, robe: [110 + i * 8, 74, 70], accent: GOLD, glow: 0.5, from: b.instant ? 'none' : 'light' });
            flash(b, { type: 'crown', id: k[0], dur: 2.2, fire: i === 3 });
            if (i === 3) sfx(b, 'fire', { far: true });
            else sfx(b, 'chime', { soft: true });
          }]),
          [14.5, b => { lv('elLamp', 1, b); sfx(b, 'harp', { soft: true }); }],
          // 暗利造撒马利亚
          [15, b => {
            prop('samaria', 'city', { x: X.samaria, layer: 1, size: 1.3, variant: 'samaria', hill: 0.22, grow: 1, gs: 0.18, cap: 0.86, label: '撒马利亚' });
            walk('k5', 0.86, { speed: 0.02 });
            sfx(b, 'build');
          }],
          [20.5, () => { rm('k5'); }],
          // 亚哈与耶洗别；巴力的庙
          [21, b => {
            add('ahab', { label: '亚哈', sex: 'm', age: 'adult', x: X.ahab + 0.03, facing: 1, robe: ROBE.ahab, accent: GOLD, glow: 0.35, from: b.instant ? 'none' : 'fade' });
            add('jez', { label: '耶洗别', sex: 'f', age: 'adult', x: X.jez + 0.02, facing: 1, robe: ROBE.jez, accent: GOLD, glow: 0.2, from: b.instant ? 'none' : 'fade' });
            walk('ahab', X.ahab, { speed: 0.02 });
            prop('temple', 'temple', { x: X.temple, size: 1.45, grow: 1, gs: 0.3, label: '巴力的庙' });
            avoid([0.8, 1]);
          }],
          [25, b => { prop('temple', null, { fire: 1 }); lv('elBaal', 1, b); sfx(b, 'fire'); face('ahab', 1); face('jez', 1); }],
          [26.5, () => { pose('ahab', 'bow'); pose('jez', 'bow'); }],
        ]);
      },
    },

    // ── 17:1—7 不降露，不下雨；基立溪旁的乌鸦 ────────────────
    {
      kind: 'promise', utter: '我已吩咐乌鸦在那里供养你', cmd: 'cron "早,晚" 乌鸦 --deliver 饼,肉 --to 基立溪', ref: '17:4',
      verse: [
        { text: '基列寄居的提斯比人以利亚对亚哈说：<br>「我指着所事奉永生耶和华以色列的神起誓，这几年我若不祷告，必不降露，不下雨。」', ref: '列王纪上 17:1', hold: 7.5 },
        { text: '耶和华的话临到以利亚说：「你离开这里往东去，藏在约旦河东边的基立溪旁。<br>你要喝那溪里的水，我已吩咐乌鸦在那里供养你。」', ref: '列王纪上 17:2–4', hold: 7.5 },
        { text: '乌鸦早晚给他叼饼和肉来，他也喝那溪里的水。', ref: '列王纪上 17:6', hold: 5 },
        { text: '过了些日子，溪水就干了，因为雨没有下在地上。', ref: '列王纪上 17:7', hold: 5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.33, 6, b.instant);
            pose('ahab', 'stand'); pose('jez', 'stand');
            add('elijah', { label: '以利亚', sex: 'm', age: 'adult', x: 0.745, facing: 1, robe: ROBE.elijah, hair: 'long', beard: true, prop: 'staff', accent: [70, 52, 36], glow: 0.45, from: b.instant ? 'none' : 'fade' });
            walk('elijah', X.ahab - 0.05, { speed: 0.022 });
            face('ahab', -1);
            unprop('calfB'); unprop('calfD');
            avoid([0.55, 1]);
          }],
          [3.2, b => { pose('elijah', 'raise'); beamOn(b, 'elijah', { dur: 4, w: 56, r: 0.2 }); }],
          // 不降露，不下雨：地枯黄
          [4.5, b => {
            W.set('bare', 0.9, b.instant); W.set('bloom', 0, b.instant); W.set('clouds', 0.06, b.instant);
            W.set('grass', 0.45, b.instant); W.set('herbs', 0.25, b.instant); W.set('trees', 0.08, b.instant);
            lv('elDry', 1, b);
            sfx(b, 'wind');
          }],
          [8, b => {
            pose('elijah', 'stand');
            prop('brook', 'brook', { x: X.brook, wet: 1, label: '基立溪' });
            beamOn(b, 'elijah', { dur: 3.5, w: 46, r: 0.15 });
          }],
          [9, () => { walk('elijah', X.brook + 0.016, { speed: 0.03, pose: 'sit' }); face('ahab', 1); }],
          // 乌鸦早晚
          [15.5, b => { flash(b, { type: 'ravens', dur: 5.5 }); sfx(b, 'raven'); }],
          [17.5, b => { S.fed = 1; if (!b.instant) { const h = headOf('elijah', 18); fx().sparkle(h[0], h[1], 12, [255, 236, 190], 8, 'top'); } }],
          [18, b => { W.goTo(0.74, 3.5, b.instant); }],
          [20.5, b => { flash(b, { type: 'ravens', dur: 5 }); sfx(b, 'raven'); }],
          [22.5, b => { S.fed = 2; if (!b.instant) { const h = headOf('elijah', 18); fx().sparkle(h[0], h[1], 12, [255, 236, 190], 8, 'top'); } }],
          // 溪水干了
          [24, b => { W.goTo(0.5, 5, b.instant); prop('brook', null, { wet: 0 }); }],
          [27, () => { pose('elijah', 'stand'); face('elijah', 1); }],
        ]);
      },
    },

    // ── 17:8—24 撒勒法的寡妇：面与油；孩子活了 ────────────────
    {
      kind: 'promise', utter: '坛内的面必不减少，瓶里的油必不缺短', cmd: 'while (旱) { assert(面 > 0 && 油 > 0) }', ref: '17:14',
      verse: [
        { text: '以利亚就起身往撒勒法去。到了城门，<br>见有一个寡妇在那里捡柴，', ref: '列王纪上 17:10', hold: 5 },
        { text: '以利亚对她说：「不要惧怕！……因为耶和华以色列的神如此说：<br>坛内的面必不减少，瓶里的油必不缺短，直到耶和华使雨降在地上的日子。」', ref: '列王纪上 17:13–14', hold: 7.5 },
        { text: '坛内的面果不减少，瓶里的油也不缺短，<br>正如耶和华藉以利亚所说的话。', ref: '列王纪上 17:16', hold: 5.5 },
        { text: '耶和华应允以利亚的话，孩子的灵魂仍入他的身体，他就活了。<br>以利亚……说：「看哪，你的儿子活了！」', ref: '列王纪上 17:22–23', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 撒马利亚的一幕退去；往西顿的撒勒法
            rm('ahab'); rm('jez'); unprop('temple'); lv('elBaal', 0, b);
            unprop('brook');
            prop('gate', 'gate', { x: X.gate, size: 1.7, label: '撒勒法的城门' });
            prop('house', 'house', { x: X.house, size: 1.8, label: '寡妇的家' });
            add('widow', { label: '寡妇', sex: 'f', age: 'adult', x: X.gate + 0.056, facing: -1, robe: ROBE.widow, hair: 'veil', prop: 'wood', glow: 0.25, pose: 'bow', from: b.instant ? 'none' : 'fade' });
            add('son', { label: '寡妇的儿子', sex: 'm', age: 'child', x: X.house - 0.03, facing: -1, robe: ROBE.son, glow: 0.2, from: b.instant ? 'none' : 'fade' });
            walk('elijah', X.gate + 0.012, { speed: 0.028 });
            avoid([0.55, 0.85]);
          }],
          [4.5, () => { pose('widow', 'stand'); face('widow', -1); face('elijah', 1); pose('elijah', 'raise'); }],
          // 坛内的面、瓶里的油
          [6.5, b => {
            pose('elijah', 'stand');
            prop('jars', 'jars', { x: X.jars, size: 1.4, lit: 1, label: '坛与瓶' });
            if (!b.instant) { const s = LS(2); fx().sparkle(X.jars * W.w, gY(2, X.jars) - 8 * s, 30, [255, 236, 190], 10 * s, 'top'); }
            sfx(b, 'harp');
          }],
          [9, () => { hold('widow', null); walk('widow', X.house - 0.044, { speed: 0.024 }); walk('elijah', X.jars - 0.02, { speed: 0.024 }); }],
          [12.5, b => { prop('house', null, { fire: 1 }); sfx(b, 'fire', { soft: true }); pose('widow', 'kneel'); }],
          // 许多日子
          [14, b => { W.goTo(0.98, 3, b.instant); prop('jars', null, { lit: 0.6 }); pose('widow', 'stand'); }],
          [17, b => { S.jarDays = 1; W.goTo(0.4, 3, b.instant); prop('jars', null, { lit: 1 }); if (!b.instant) { const s = LS(2); fx().sparkle(X.jars * W.w, gY(2, X.jars) - 8 * s, 20, [255, 236, 190], 10 * s, 'top'); } }],
          // 孩子病了，身无气息：他不见了（被抱到楼上），楼窗暗了，母亲跪在门前哭
          [20, b => {
            W.goTo(0.765, 4, b.instant);
            prop('jars', null, { lit: 0.3 });
            walk('son', X.house + 0.002, { speed: 0.02 }); glow('son', 0.02);
            prop('house', null, { dim: 1 });
            walk('widow', X.house - 0.035, { speed: 0.024, pose: 'kneel' });
            pose('widow', 'kneel', { weep: true }); sfx(b, 'weep');
          }],
          [21.5, () => { rm('son'); }],
          [22, () => { walk('elijah', X.house - 0.018, { speed: 0.03 }); }],
          // 以利亚把孩子抱到楼上，三次伏在他身上求告耶和华：楼窗亮了
          [24, b => { walk('elijah', X.house + 0.004, { speed: 0.03 }); prop('house', null, { dim: 0, lit: 1 }); }],
          [25, b => { rm('elijah'); const s = LS(2); bloom(b, X.house + 8 * s / W.w, gY(2, X.house) - 22 * s, 0.12, 1.5, 0.5); }],
          [26, b => { const s = LS(2); bloom(b, X.house + 8 * s / W.w, gY(2, X.house) - 22 * s, 0.16, 1.5, 0.5); }],
          [27, b => {
            prop('house', null, { lit: 0.3 });
            add('elijah', { label: '以利亚', sex: 'm', age: 'adult', x: X.house - 0.004, facing: -1, robe: ROBE.elijah, hair: 'long', beard: true, prop: 'staff', accent: [70, 52, 36], glow: 0.45, pose: 'stand', from: b.instant ? 'none' : 'fade' });
            add('son', { label: '寡妇的儿子', sex: 'm', age: 'child', x: X.house - 0.014, facing: -1, robe: ROBE.son, glow: 0.5, pose: 'stand', from: b.instant ? 'none' : 'light' });
            pose('widow', 'stand', { weep: false });
            bloom(b, X.house, gY(2, X.house) - 14 * LS(2), 0.3, 2, 0.5);
            sfx(b, 'harp');
          }],
          [28, () => { embrace('widow', 'son', { weep: false }); }],
        ]);
      },
    },

    // ── 18:1—29 去见亚哈；迦密山；巴力的先知从早晨求告到晚上 ─────
    {
      kind: 'cmd', utter: '你去，使亚哈得见你', cmd: 'ssh 亚哈@撒马利亚 && mount /迦密山', ref: '18:1',
      verse: [
        { text: '过了许久，到第三年，耶和华的话临到以利亚说：<br>「你去，使亚哈得见你；我要降雨在地上。」<br>以利亚就去，要使亚哈得见他。那时，撒马利亚有大饥荒；', ref: '列王纪上 18:1–2', hold: 7 },
        { text: '亚哈就差遣人招聚以色列众人和先知都上迦密山。<br>以利亚前来对众民说：「你们心持两意要到几时呢？<br>若耶和华是神，就当顺从耶和华；若巴力是神，就当顺从巴力。」众民一言不答。', ref: '列王纪上 18:20–21', hold: 8 },
        { text: '「……那降火显应的神，就是神。」众民回答说：「这话甚好。」', ref: '列王纪上 18:24', hold: 5 },
        { text: '他们……从早晨到午间，求告巴力的名说：「巴力啊，求你应允我们！」<br>却没有声音，没有应允的。……他们狂呼乱叫，却没有声音，没有应允的，也没有理会的。', ref: '列王纪上 18:26–29', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.3, 5, b.instant);
            unprop('gate'); unprop('house'); unprop('jars'); rm('widow'); rm('son');
            W.set('bare', 0.95, b.instant); W.set('grass', 0.32, b.instant); W.set('herbs', 0.15, b.instant);
            walk('elijah', 0.868, { speed: 0.03 });
            glow('elijah', 0.65);                       // 天未亮：以利亚身上的光要看得见
            add('ahab', { label: '亚哈', sex: 'm', age: 'adult', x: 1.04, facing: -1, robe: ROBE.ahab, accent: GOLD, glow: 0.35, from: b.instant ? 'none' : 'fade' });
            walk('ahab', 0.925, { speed: 0.03 });
            avoid([0.5, 1]);
          }],
          [5.5, () => { face('elijah', 1); face('ahab', -1); pose('ahab', 'point'); glow('elijah', 0.45); }],
          [7, () => { pose('ahab', 'stand'); pose('elijah', 'raise'); }],
          // 迦密山升起；众人与先知都上迦密山
          [8, b => {
            pose('elijah', 'stand');
            prop('carmel', 'mount', { x: X.carmel, grow: 1, gs: 0.16, label: '迦密山' });
            if (!b.instant) { W.shake = 0.5; sfx(b, 'thunder', { low: true, far: true }); }
          }],
          [10, b => {
            crowd('isr', { n: 12, x0: 0.95, x1: 1.06, layer: 2, label: '以色列众民' });
            crowdFace('isr', -1);
            crowdMount('isr');
            BP.forEach((id, i) => {
              add(id, { label: '巴力的先知', sex: 'm', age: 'adult', x: 0.5 + i * 0.012, facing: 1, robe: ROBE.baal, glow: 0.1, from: b.instant ? 'none' : 'fade' });
              onMount(id);
            });
            sfx(b, 'crowd');
          }],
          [14, b => {
            prop('baalAlt', 'altar', { x: X.baalAlt, size: 1.55, lord: false, wood: true, bull: true, label: '巴力的坛' });
            prop('lordAlt', 'altar', { x: X.lordAlt, size: 1.6, lord: true, grow: 0, trench: false, label: '耶和华的坛' });
            BP.forEach((id, i) => walk(id, X.baalAlt - 0.032 + i * 0.0095 + (i > 3 ? 0.014 : 0), { speed: 0.022 }));
            onMount('elijah');
            walk('elijah', X.lordAlt + 0.024, { speed: 0.024 });
            add('servant', { label: '仆人', sex: 'm', age: 'adult', x: 0.86, facing: -1, robe: ROBE.servant, glow: 0.15, from: b.instant ? 'none' : 'fade' });
            onMount('servant');
            walk('servant', X.lordAlt + 0.045, { speed: 0.024 });
            // 众民站在山东边的平地上；亚哈在山脚
            crowdWalk('isr', 0.885, 0.995, { speed: 0.02 });
            walk('ahab', 0.855, { speed: 0.02 });
          }],
          [18.5, () => { face('elijah', 1); pose('elijah', 'point'); face('ahab', -1); }],
          [20, () => { pose('elijah', 'stand'); face('elijah', -1); BP.forEach(id => face(id, X.baalAlt)); }],
          // 从早晨到午间，从午后直到献晚祭
          [21, b => { W.goTo(0.62, 10, b.instant); sfx(b, 'crowd'); }],
          ...[0, 1, 2, 3, 4, 5].map(k => [22 + k * 1.3, () => { BP.forEach((id, i) => pose(id, (i + k) % 2 ? 'raise' : 'bow')); }]),
          [29.5, () => { BP.forEach((id, i) => pose(id, i % 3 ? 'kneel' : 'stand')); }],
        ]);
      },
    },

    // ── 18:30—36 十二块石头；水倒三次 ─────────────────────────
    {
      kind: 'name', utter: '你的名要叫以色列', cmd: 'rename 雅各 以色列 && build 坛 --stones 12 && pour 水 x3', ref: '18:31',
      verse: [
        { text: '以利亚对众民说：「你们到我这里来。」众民就到他那里。<br>他便重修已经毁坏耶和华的坛。', ref: '列王纪上 18:30', hold: 5.5 },
        { text: '以利亚照雅各子孙支派的数目，取了十二块石头<br>（耶和华的话曾临到雅各说：「你的名要叫以色列」），<br>用这些石头为耶和华的名筑一座坛，在坛的四围挖沟，', ref: '列王纪上 18:31–32', hold: 7.5 },
        { text: '「你们用四个桶盛满水，倒在燔祭和柴上」；又说：「倒第二次。」……<br>又说：「倒第三次。」他们就倒第三次。水流在坛的四围，沟里也满了水。', ref: '列王纪上 18:33–35', hold: 7.5 },
        { text: '到了献晚祭的时候，先知以利亚近前来，说：<br>「亚伯拉罕、以撒、以色列的神，耶和华啊，求你今日使人知道你是以色列的神……」', ref: '列王纪上 18:36', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.735, 8, b.instant); face('elijah', 1); pose('elijah', 'raise'); crowdWalk('isr', 0.872, 0.99, { speed: 0.02 }); }],
          [2.5, () => { pose('elijah', 'stand'); walk('elijah', X.lordAlt + 0.02, { speed: 0.02 }); face('elijah', -1); }],
          // 十二块石头
          [5.5, b => {
            prop('lordAlt', null, { grow: 1, gs: 0.19 });
            pose('elijah', 'carry');
            sfx(b, 'stone');
          }],
          [7, b => {
            S.stones = 12;
            if (!b.instant) {
              const s = LS(2), size = Math.max(22, Math.min(46, M() * 0.06));
              const cx = nameAt(X.lordAlt, 0, size, 3), cy = Math.min(surfY(X.lordAlt) - 90 * s, W.h * 0.44);
              const src = () => [X.lordAlt * W.w + (Math.random() - 0.5) * 40 * s, surfY(X.lordAlt) - Math.random() * 10 * s];
              fx().nameStr('以色列', cx[0], Math.max(cy, port() ? W.h * 0.36 : W.h * 0.2), size, [255, 226, 160], src, { hold: 3.4 });
              sfx(b, 'chime');
            }
          }],
          [9.5, b => { sfx(b, 'stone'); }],
          [11.5, b => { prop('lordAlt', null, { trench: true, wood: true, bull: true }); pose('elijah', 'stand'); sfx(b, 'build'); }],
          // 四个桶，倒三次
          [14, b => {
            ['p1', 'p2', 'p3', 'p4'].forEach((id, i) => {
              add(id, { label: '取水的人', sex: 'm', age: 'adult', x: X.lordAlt + 0.035 + i * 0.013, facing: -1, robe: [120 + i * 6, 104, 86], prop: 'jar', glow: 0.1, from: b.instant ? 'none' : 'fade' });
              onMount(id);
            });
            walk('servant', X.lordAlt - 0.04, { speed: 0.02 });
          }],
          ...[0, 1, 2].map(k => [15.5 + k * 2.5, b => {
            S.poured = k + 1;
            prop('lordAlt', null, { wet: (k + 1) / 3 });
            ['p1', 'p2', 'p3', 'p4'].forEach(id => pose(id, 'carry'));
            flash(b, { type: 'pour', ids: ['p1', 'p2', 'p3', 'p4'], dur: 1.8 });
            sfx(b, 'splash');
          }]),
          [22.5, () => { ['p1', 'p2', 'p3', 'p4'].forEach(id => { pose(id, 'stand'); hold(id, null); }); }],
          // 取水的人下山，回到众民中间
          [23, () => { ['p1', 'p2', 'p3', 'p4'].forEach((id, i) => walk(id, 0.878 + i * 0.03, { speed: 0.035 })); }],
          // 献晚祭的时候：以利亚近前来
          [24, b => { walk('elijah', X.lordAlt + 0.016, { speed: 0.015 }); face('elijah', -1); }],
          [25.5, b => { pose('elijah', 'raise'); glow('elijah', 0.7); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 18:37—40 耶和华降下火来（本卷的签名）─────────────────
    {
      kind: 'act', utter: '耶和华降下火来', cmd: 'fire --from heaven --target 坛 --consume all  # 连沟里的水', ref: '18:38', hold: 3.6,
      verse: [
        { text: '于是，耶和华降下火来，烧尽燔祭、木柴、石头、尘土，<br>又烧干沟里的水。', ref: '列王纪上 18:38', hold: 7 },
        { text: '众民看见了，就俯伏在地，说：<br>「耶和华是神！耶和华是神！」', ref: '列王纪上 18:39', hold: 6.5 },
        { text: '以利亚对他们说：「拿住巴力的先知，不容一人逃脱！」<br>众人就拿住他们。', ref: '列王纪上 18:40', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('elHush', 1, b); }],
          [0.9, b => {
            lv('elHeaven', 1, b);
            prop('lordAlt', null, { fire: 1, burn: 1, wet: 0 });
            S.consumed = 1;
            if (!b.instant) {
              W.flash = Math.max(W.flash || 0, 0.9); W.shake = 1.1;
              const s = LS(2), x = X.lordAlt * W.w, y = surfY(X.lordAlt) - 6 * s;
              bloom(b, X.lordAlt, y - 10 * s, 0.55, 1.2, 0.75);   // 落处一团柔和的金光，一秒内散开
              fx().burst(x, y - 20 * s, { c: [255, 214, 150], motes: 120, dur: 1.4, strength: 0.6 });
              fx().sparkle(x, y - 10 * s, 60, [255, 200, 120], 30 * s, 'top');
            }
            sfx(b, 'fire'); sfx(b, 'thunder');
            glow('elijah', 0.9);
          }],
          [2, () => { pose('elijah', 'kneel'); pose('servant', 'fall'); }],
          [3.2, b => { if (!b.instant) W.shake = 0.6; }],
          [4.8, b => { lv('elHeaven', 0, b); lv('elHush', 0, b); prop('lordAlt', null, { fire: 0.55 }); }],
          // 众民俯伏：「耶和华是神！」
          [6, b => {
            // 众民在山下的平地上俯伏；巴力的先知站在一边，身上的光灭了
            crowdPose('isr', 'fall');
            ['p1', 'p2', 'p3', 'p4'].forEach(id => pose(id, 'fall'));
            pose('ahab', 'kneel');
            BP.forEach(id => glow(id, 0));
            if (!b.instant) {
              const s = LS(2), size = Math.max(20, Math.min(40, M() * 0.052));
              const at = nameAt(0.8, port() ? W.h * 0.42 : W.h * 0.3, size, 5);
              const src = () => { const xx = 0.92 + (Math.random() - 0.5) * 0.14; return [xx * W.w, surfY(xx) - 10 * s]; };
              fx().nameStr('耶和华是神', at[0], at[1], size, [255, 232, 176], src, { hold: 3.2 });
            }
            sfx(b, 'crowd'); sfx(b, 'angel', { soft: true });
          }],
          [12.5, () => { crowdPose('isr', 'kneel'); pose('elijah', 'stand'); glow('elijah', 0.5); prop('lordAlt', null, { fire: 0 }); }],
          // 拿住巴力的先知：他们被带下山去（不见了）
          [13.5, () => { pose('elijah', 'point'); face('elijah', -1); crowdPose('isr', 'stand'); ['p1', 'p2', 'p3', 'p4'].forEach(id => pose(id, 'stand')); }],
          // 拿住巴力的先知：众人把他们往东带下山去，往基顺河边（出了画面）
          [14.5, b => {
            prop('baalAlt', null, { dim: 1 });
            BP.forEach((id, i) => walk(id, 1.06 + i * 0.012, { speed: 0.055 }));
            sfx(b, 'crowd', { far: true });
          }],
          [16.5, () => {
            crowdWalk('isr', 1.0, 1.14, { speed: 0.03 });
            ['p1', 'p2', 'p3', 'p4'].forEach((id, i) => walk(id, 1.02 + i * 0.03, { speed: 0.03 }));
            pose('elijah', 'stand');
          }],
          [21, () => { BP.forEach(id => rm(id)); rmCrowd('isr'); ['p1', 'p2', 'p3', 'p4'].forEach(id => rm(id)); unprop('baalAlt'); pose('ahab', 'stand'); pose('servant', 'stand'); }],
        ]);
      },
    },

    // ── 18:41—46 七次向海观看；如人手的小云；大雨 ──────────────
    {
      kind: 'promise', utter: '我要降雨在地上', cmd: 'while ((看 = 仆人.向海观看()) != "云") 看++  # 七次', ref: '18:1',
      verse: [
        { text: '以利亚对亚哈说：「你现在可以上去吃喝，因为有多雨的响声了。」……<br>以利亚上了迦密山顶，屈身在地，将脸伏在两膝之中；', ref: '列王纪上 18:41–42', hold: 6.5 },
        { text: '对仆人说：「你上去，向海观看。」仆人就上去观看，说：「没有什么。」<br>他说：「你再去观看。」如此七次。', ref: '列王纪上 18:43', hold: 6.5 },
        { text: '第七次仆人说：「我看见有一小片云从海里上来，不过如人手那样大。」', ref: '列王纪上 18:44', hold: 5.5 },
        { text: '霎时间，天因风云黑暗，降下大雨。亚哈就坐车往耶斯列去了。<br>耶和华的灵降在以利亚身上，他就束上腰，奔在亚哈前头，直到耶斯列的城门。', ref: '列王纪上 18:45–46', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.755, 8, b.instant);
            walk('elijah', 0.628, { speed: 0.02, pose: 'kneel' });
            walk('servant', 0.645, { speed: 0.02 });
            // 王的车：两匹马套着车，停在山东边的平地上
            animal('horse', 'horse', 0.972, { label: '马', facing: 1, from: b.instant ? 'none' : 'fade' });
            animal('horse2', 'horse', 0.966, { label: '马', col: [66, 48, 36], facing: 1, v: 0.05, from: b.instant ? 'none' : 'fade' });
            animal('chariot', 'wagon', 0.938, { label: '亚哈的车', facing: 1, from: b.instant ? 'none' : 'fade' });
            walk('ahab', 0.895, { speed: 0.02 });
            avoid([0.88, 1]);
          }],
          // 如此七次
          ...[0, 1, 2, 3, 4, 5, 6].map(k => [7 + k * 1.3, b => {
            S.looked = k + 1;
            face('servant', -1); pose('servant', 'gaze');
            flash(b, { type: 'tally', i: k, dur: 13 - k * 1.1 });
            if (k < 6) sfx(b, 'chime', { soft: true });
          }]),
          ...[0, 1, 2, 3, 4, 5].map(k => [7.7 + k * 1.3, () => { face('servant', 1); pose('servant', 'stand'); }]),
          // 一小片云从海里上来
          [15.5, b => { lv('elHand', 1, b); pose('servant', 'point'); sfx(b, 'wind', { soft: true }); }],
          [18, () => { pose('elijah', 'stand'); pose('servant', 'stand'); face('servant', 1); walk('servant', 0.8, { speed: 0.04 }); }],
          // 天因风云黑暗，降下大雨
          [20.5, b => {
            W.set('storm', 0.8, b.instant); W.set('clouds', 1, b.instant); W.set('gale', 0.45, b.instant);
            lv('elDry', 0, b);
            sfx(b, 'wind');
            ride('ahab', 'chariot');
            follow('horse2', 'horse', 0.006);
            follow('chariot', 'horse', 0.034);
          }],
          [22, b => {
            lv('elHand', 0, b);
            W.set('rain', 1, b.instant);
            sfx(b, 'rain'); sfx(b, 'thunder');
            if (GS.weather && GS.weather.bolt && !b.instant) GS.weather.bolt({ x: 0.3, near: false });
            // 旱地复青
            W.set('bare', 0.15, b.instant); W.set('bloom', 0.45, b.instant);
            W.set('grass', 1, b.instant); W.set('herbs', 0.9, b.instant); W.set('trees', 0.22, b.instant);
            walk('horse', 1.12, { speed: 0.05 });
            glow('elijah', 0.8);
            walk('elijah', 1.16, { speed: 0.075 });
            crowdWalk('isr', 1.02, 1.15, { speed: 0.03 });
            walk('servant', 1.1, { speed: 0.03 });
          }],
          [27.5, () => { rm('horse'); rm('horse2'); rm('chariot'); rm('ahab'); rm('elijah'); rm('servant'); rmCrowd('isr'); }],
        ]);
      },
    },

    // ── 19:1—8 罗腾树下；天使；四十昼夜到何烈山 ────────────────
    {
      kind: 'cmd', utter: '起来吃吧！因为你当走的路甚远', cmd: 'sleep; wake --by 天使 && eat 饼 && walk --days 40 --to 何烈山', ref: '19:7',
      verse: [
        { text: '耶洗别就差遣人去见以利亚……以利亚见这光景就起来逃命，……<br>来到一棵罗腾树下，就坐在那里求死，说：<br>「耶和华啊，罢了！求你取我的性命，因为我不胜于我的列祖。」', ref: '列王纪上 19:2–4', hold: 8.5 },
        { text: '他就躺在罗腾树下，睡着了。有一个天使拍他，说：「起来吃吧！」<br>他观看，见头旁有一瓶水与炭火烧的饼，他就吃了喝了，仍然躺下。', ref: '列王纪上 19:5–6', hold: 8 },
        { text: '耶和华的使者第二次来拍他，说：「起来吃吧！因为你当走的路甚远。」<br>他就起来吃了喝了，仗着这饮食的力，走了四十昼夜，到了神的山，就是何烈山。', ref: '列王纪上 19:7–8', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('storm', 0, b.instant); W.set('rain', 0, b.instant); W.set('gale', 0, b.instant); W.set('clouds', 0.3, b.instant);
            W.goTo(0.46, 8, b.instant);
            prop('carmel', null, { grow: 0, gs: 0.18 });
            unprop('lordAlt');
            // 旷野：光秃的地，没有花
            W.set('bare', 0.85, b.instant); W.set('grass', 0.35, b.instant); W.set('herbs', 0.2, b.instant); W.set('bloom', 0.05, b.instant);
            prop('broom', 'broom', { x: X.broom, size: 1.8, grow: 1, gs: 0.3, label: '罗腾树' });
            add('elijah', { label: '以利亚', sex: 'm', age: 'adult', x: 1.04, facing: -1, robe: ROBE.elijah, hair: 'long', beard: true, prop: 'staff', accent: [70, 52, 36], glow: 0.6, from: b.instant ? 'none' : 'fade' });
            offMount('elijah');
            walk('elijah', X.broom + 0.02, { speed: 0.05, pose: 'sit' });
            avoid([0.5, 0.9]);
          }],
          [8.5, () => { pose('elijah', 'lie'); glow('elijah', 0.4); }],
          [9.5, b => {
            add('angel', { label: '天使', angel: true, sex: 'm', age: 'adult', x: X.broom + 0.05, facing: -1, glow: 0.8, from: b.instant ? 'none' : 'light' });
            sfx(b, 'angel');
          }],
          [11.5, b => { pose('angel', 'bow'); prop('meal', 'jars', { x: X.broom + 0.004, size: 1.3, variant: 'meal', label: '炭火烧的饼' }); if (!b.instant) { const s = LS(2); fx().sparkle((X.broom + 0.002) * W.w, gY(2, X.broom) - 4 * s, 20, [255, 220, 170], 6 * s, 'top'); } }],
          [12.5, () => { pose('elijah', 'sit'); pose('angel', 'stand'); }],
          [15, () => { pose('elijah', 'lie'); rm('angel'); }],
          // 第二次
          [17.5, b => {
            add('angel', { label: '天使', angel: true, sex: 'm', age: 'adult', x: X.broom + 0.05, facing: -1, glow: 0.8, from: b.instant ? 'none' : 'light' });
            sfx(b, 'angel', { soft: true });
          }],
          [18.5, () => { pose('angel', 'bow'); }],
          [19.5, () => { pose('elijah', 'sit'); pose('angel', 'stand'); }],
          [21.5, b => { pose('elijah', 'stand'); rm('angel'); unprop('meal'); glow('elijah', 0.55); prop('horeb', 'horeb', { x: X.horeb, grow: 1, gs: 0.13, label: '何烈山' }); }],
          // 四十昼夜
          [22, b => { W.goTo(0.98, 1.5, b.instant); onMount('elijah'); walk('elijah', X.horeb + CAVE_U * MOUNTS.horeb.hw + 0.012, { speed: 0.011 }); }],
          [23.5, b => { W.goTo(0.45, 1.5, b.instant); }],
          [25, b => { W.goTo(0.98, 1.5, b.instant); }],
          [26.5, b => { W.goTo(0.45, 1.5, b.instant); }],
          [28, b => { W.goTo(0.755, 2.5, b.instant); unprop('broom'); }],
          [29.5, () => {
            // 进了一个洞
            attach('elijah', () => caveXY(0.012));
            pose('elijah', 'sit'); glow('elijah', 0.3);
            face('elijah', -1);
          }],
        ]);
      },
    },

    // ── 19:9—14 何烈山：烈风、地震、火，微小的声音（第二个签名）───
    {
      kind: 'ask', utter: '以利亚啊，你在这里做什么？', cmd: 'whisper --volume 0.01 "以利亚啊，你在这里做什么？"', ref: '19:9',
      verse: [
        { text: '他在那里进了一个洞，就住在洞中。<br>耶和华的话临到他说：「以利亚啊，你在这里做什么？」', ref: '列王纪上 19:9', hold: 5.5 },
        { text: '耶和华说：「你出来站在山上，在我面前。」那时耶和华从那里经过，<br>在他面前有烈风大作，崩山碎石，耶和华却不在风中；<br>风后地震，耶和华却不在其中；', ref: '列王纪上 19:11', hold: 8 },
        { text: '地震后有火，耶和华也不在火中；<br>火后有微小的声音。', ref: '列王纪上 19:12', hold: 6 },
        { text: '以利亚听见，就用外衣蒙上脸，出来站在洞口。<br>有声音向他说：「以利亚啊，你在这里做什么？」', ref: '列王纪上 19:13', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.765, 4, b.instant); attach('elijah', () => caveXY(0.012)); pose('elijah', 'sit'); }],
          [2.5, () => { pose('elijah', 'gaze'); }],
          // 烈风
          [6.5, b => { lv('elWind', 1, b); W.set('gale', 1, b.instant); sfx(b, 'wind'); pose('elijah', 'sit'); }],
          [7.5, b => { rockfall(b); sfx(b, 'stone'); }],
          [9.2, b => { rockfall(b); }],
          [9, b => { sfx(b, 'wind'); }],
          // 地震
          [10.5, b => { lv('elWind', 0, b); W.set('gale', 0.1, b.instant); lv('elQuake', 1, b); sfx(b, 'thunder', { low: true }); }],
          [12.5, b => { sfx(b, 'thunder', { low: true, far: true }); }],
          // 火
          [14.2, b => { lv('elQuake', 0, b); lv('elBlaze', 1, b); sfx(b, 'fire'); }],
          // 微小的声音
          [17.8, b => { lv('elBlaze', 0, b); W.set('gale', 0, b.instant); W.goTo(0.88, 7, b.instant); }],
          [18.6, b => { lv('elStill', 1, b); sfx(b, 'stars', { soft: true }); }],
          [21, b => {
            attach('elijah', () => caveXY(-0.004));
            pose('elijah', 'weep', { weep: false });
            glow('elijah', 0.6);
          }],
          [24.5, () => { face('elijah', 1); }],
        ]);
      },
    },

    // ── 19:15—21 七千人；以利沙 ──────────────────────────────
    {
      kind: 'promise', utter: '我在以色列人中为自己留下七千人', cmd: 'SELECT count(*) FROM 以色列 WHERE 未曾向巴力屈膝  -- 7000', ref: '19:18',
      verse: [
        { text: '耶和华对他说：「你回去，从旷野往大马士革去。……<br>并膏……沙法的儿子以利沙作先知接续你。」', ref: '列王纪上 19:15–16', hold: 6 },
        { text: '但我在以色列人中为自己留下七千人，<br>是未曾向巴力屈膝的，未曾与巴力亲嘴的。', ref: '列王纪上 19:18', hold: 7 },
        { text: '于是，以利亚离开那里走了，遇见沙法的儿子以利沙耕地；在他前头有十二对牛，<br>自己赶着第十二对。以利亚到他那里去，将自己的外衣搭在他身上。', ref: '列王纪上 19:19', hold: 7.5 },
        { text: '……随后就起身跟随以利亚，服事他。', ref: '列王纪上 19:21', hold: 4.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('elStill', 0, b);
            W.goTo(0.96, 6, b.instant);
            pose('elijah', 'stand');
            glow('elijah', 0.65);
          }],
          // 「你回去……」：以利亚下山，往东走去
          [2, b => { prop('horeb', null, { grow: 0, gs: 0.16 }); onMount('elijah'); walk('elijah', 0.95, { speed: 0.022 }); }],
          // 七千人：遍地亮起的小灯
          [6.5, b => { lv('elSeven', 1, b); S.seven = 7000; sfx(b, 'stars'); }],
          [9, b => { sfx(b, 'stars', { soft: true }); }],
          // 以利沙耕地
          [13.5, b => {
            unprop('horeb');
            offMount('elijah'); glow('elijah', 0.45);
            W.goTo(0.34, 5, b.instant);
            W.set('bare', 0.4, b.instant); W.set('grass', 0.8, b.instant); W.set('herbs', 0.55, b.instant); W.set('bloom', 0.25, b.instant);
            // 十二对牛在前头：画出三对，每对之后是扶犁的人；以利沙赶着最后一对（19:19）
            prop('field', 'field', { x: 0.75, x0: 0.56, x1: 0.99, label: '田', teams: PLOW });
            [0, 1, 2].forEach(k => {
              const x = OX0 + k * 0.1;
              animal('ox' + k + 'a', 'cow', x, { label: '牛', facing: -1, from: b.instant ? 'none' : 'fade' });
              animal('ox' + k + 'b', 'cow', x + 0.012, { label: '牛', facing: -1, v: 0.05, from: b.instant ? 'none' : 'fade' });
            });
            add('plow1', { label: '耕地的人', sex: 'm', age: 'adult', x: OX0 + 0.047, facing: -1, robe: [118, 100, 80], glow: 0.08, from: b.instant ? 'none' : 'fade' });
            add('plow2', { label: '耕地的人', sex: 'm', age: 'adult', x: OX0 + 0.147, facing: -1, robe: [126, 104, 84], glow: 0.08, from: b.instant ? 'none' : 'fade' });
            add('elisha', { label: '以利沙', sex: 'm', age: 'adult', x: OX0 + 0.247, facing: -1, robe: ROBE.elisha, glow: 0.35, from: b.instant ? 'none' : 'fade' });
            avoid([0.5, 1]);
          }],
          [15, () => {
            [0, 1, 2].forEach(k => { walk('ox' + k + 'a', OX0 - 0.06 + k * 0.1, { speed: 0.006 }); walk('ox' + k + 'b', OX0 - 0.048 + k * 0.1, { speed: 0.006 }); });
            walk('plow1', OX0 - 0.013, { speed: 0.006 }); walk('plow2', OX0 + 0.087, { speed: 0.006 }); walk('elisha', OX0 + 0.187, { speed: 0.006 });
          }],
          // 外衣搭在他身上
          [20.5, b => {
            face('elijah', -1); pose('elijah', 'raise'); pose('elisha', 'stand', { stop: true });
            flash(b, { type: 'mantle', from: 'elijah', to: 'elisha', dur: 1.6 });
          }],
          [22, b => {
            S.mantle = 1;
            add('elisha', { accent: ROBE.elijah, glow: 0.6 });
            beamOn(b, 'elisha', { dur: 4, w: 50, r: 0.18 });
            pose('elijah', 'stand');
            face('elisha', 1);
            sfx(b, 'harp');
          }],
          // 以利沙就离开牛，跑到以利亚那里
          [22.5, () => { prop('field', null, { teams: PLOW.slice(0, 2) }); }],
          [24, () => { walk('elisha', 0.905, { speed: 0.03 }); }],
          [25.5, () => { walk('elijah', 0.99, { speed: 0.024 }); walk('elisha', 0.96, { speed: 0.024 }); }],
        ]);
      },
    },

    // ── 20—21 亚兰人交在你手中；拿伯的葡萄园 ──────────────────
    {
      kind: 'ask', utter: '你杀了人，又得他的产业吗？', cmd: 'git blame 葡萄园  # 拿伯', ref: '21:19',
      verse: [
        { text: '有神人来见以色列王，说：「耶和华如此说：『亚兰人既说我耶和华是山神，不是平原的神，<br>所以我必将这一大群人都交在你手中，你们就知道我是耶和华。』」', ref: '列王纪上 20:28', hold: 8 },
        { text: '拿伯对亚哈说：「我敬畏耶和华，万不敢将我先人留下的产业给你。」', ref: '列王纪上 21:3', hold: 5.5 },
        { text: '「你要对他说：『耶和华如此说：你杀了人，又得他的产业吗？』……」', ref: '列王纪上 21:19', hold: 6 },
        { text: '亚哈听见这话，就撕裂衣服，禁食，身穿麻布，<br>睡卧也穿着麻布，并且缓缓而行。', ref: '列王纪上 21:27', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.38, 6, b.instant);
            unprop('field');
            ['ox0a', 'ox0b', 'ox1a', 'ox1b', 'ox2a', 'ox2b', 'plow1', 'plow2', 'elisha'].forEach(id => rm(id));
            rm('elijah');
            lv('elAram', 1, b);
            sfx(b, 'crowd', { far: true });
          }],
          [4.5, b => {
            flash(b, { type: 'battle', pass: 'mid', xf: 0.62, dur: 4 });
            flash(b, { type: 'battle', pass: 'mid', xf: 0.8, dur: 4.5 });
            flash(b, { type: 'battle', pass: 'mid', xf: 0.93, dur: 3.8 });
            sfx(b, 'thunder', { far: true });
          }],
          [6, b => { lv('elAram', 0, b); }],
          // 拿伯的葡萄园，靠近亚哈的宫
          [8, b => {
            prop('vines', 'vines', { x: 0.65, x0: X.vine0, x1: X.vine1, size: 1.5, label: '拿伯的葡萄园' });
            prop('palace', 'city', { x: X.palace, layer: 2, size: 1.05, variant: 'jezreel', label: '耶斯列的宫' });
            add('naboth', { label: '拿伯', sex: 'm', age: 'adult', x: 0.665, facing: 1, robe: ROBE.naboth, glow: 0.3, from: b.instant ? 'none' : 'fade' });
            add('ahab', { label: '亚哈', sex: 'm', age: 'adult', x: X.palace - 0.04, facing: -1, robe: ROBE.ahab, accent: GOLD, glow: 0.3, from: b.instant ? 'none' : 'fade' });
            walk('ahab', 0.705, { speed: 0.02 });
            avoid([0.55, 1]);
          }],
          [11.5, () => { pose('ahab', 'point'); face('naboth', 1); }],
          [12.5, () => { pose('ahab', 'stand'); pose('naboth', 'raise'); }],
          [14, () => { pose('naboth', 'stand'); walk('ahab', X.palace - 0.035, { speed: 0.02, pose: 'sit' }); }],
          // 拿伯被拉到城外（不见了）
          [16, b => { walk('naboth', 0.99, { speed: 0.03 }); prop('vines', null, { dim: 0.45 }); }],
          [18.5, b => { rm('naboth'); sfx(b, 'stone', { far: true }); }],
          // 亚哈下去要得葡萄园；以利亚见他
          [19, () => { pose('ahab', 'stand'); walk('ahab', 0.69, { speed: 0.02 }); }],
          [20, b => {
            add('elijah', { label: '以利亚', sex: 'm', age: 'adult', x: 0.58, facing: 1, robe: ROBE.elijah, hair: 'long', beard: true, prop: 'staff', accent: [70, 52, 36], glow: 0.5, from: b.instant ? 'none' : 'fade' });
            walk('elijah', 0.64, { speed: 0.02 });
          }],
          [22, b => { pose('elijah', 'point'); face('ahab', -1); beamOn(b, 'elijah', { dur: 3.5, w: 50, r: 0.18 }); }],
          // 撕裂衣服，身穿麻布
          [24, b => {
            S.sack = 1;
            pose('elijah', 'stand');
            add('ahab', { robe: ROBE.sack, accent: null, glow: 0.15 });
            pose('ahab', 'kneel', { weep: true });
            sfx(b, 'weep');
          }],
          [27.5, () => { pose('ahab', 'stand', { weep: false }); walk('ahab', 0.74, { speed: 0.01 }); }],
        ]);
      },
    },

    // ── 22 米该雅：散在山上的羊群；亚哈中箭；各归本城 ───────────
    {
      kind: 'judge', utter: '他们可以平平安安地各归各家去', cmd: 'exit 0  # 各归本城，各归本地', ref: '22:17',
      verse: [
        { text: '米该雅说：「我看见以色列众民散在山上，如同没有牧人的羊群一般。<br>耶和华说：『这民没有主人，他们可以平平安安地各归各家去。』」', ref: '列王纪上 22:17', hold: 7.5 },
        { text: '有一人随便开弓，恰巧射入以色列王的甲缝里。', ref: '列王纪上 22:34', hold: 5 },
        { text: '……到晚上，王就死了，血从伤处流在车中。约在日落的时候，<br>有号令传遍军中，说：「各归本城，各归本地吧！」', ref: '列王纪上 22:35–36', hold: 7 },
        { text: '王既死了，众人将他送到撒马利亚，就葬在那里；……<br>狗来舔他的血，正如耶和华所说的话。', ref: '列王纪上 22:37–38', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.45, 6, b.instant);
            unprop('vines'); unprop('palace');
            rm('elijah');
            prop('gateS', 'gate', { x: X.gateS, size: 1.25, label: '撒马利亚的城门' });
            prop('thrones', 'thrones', { x: (X.throneA + X.throneJ) / 2, size: 1.3, label: '王座' });
            add('ahab', { label: '亚哈', sex: 'm', age: 'adult', robe: ROBE.ahab, accent: GOLD, glow: 0.35, x: X.throneA, facing: -1, from: b.instant ? 'none' : 'fade' });
            place('ahab', X.throneA); face('ahab', -1); pose('ahab', 'seat');
            add('jehos', { label: '约沙法', sex: 'm', age: 'adult', x: X.throneJ, facing: -1, robe: ROBE.jehos, accent: GOLD, glow: 0.3, pose: 'seat', from: b.instant ? 'none' : 'fade' });
            crowd('four', { n: 11, x0: 0.58, x1: 0.76, layer: 2, label: '四百先知', robe: [140, 116, 92] });
            crowdFace('four', 1);
            add('micaiah', { label: '米该雅', sex: 'm', age: 'elder', x: 0.8, facing: 1, robe: ROBE.micaiah, glow: 0.5, from: b.instant ? 'none' : 'fade' });
            avoid([0.55, 1]);
          }],
          // 散在山上，如同没有牧人的羊群
          [2.5, b => {
            herd('lost', { kind: 'sheep', n: 9, x0: 0.52, x1: 0.99, layer: 1, label: '没有牧人的羊群', mill: false });
            pose('micaiah', 'point'); face('micaiah', -1);
            sfx(b, 'bleat', { far: true });
          }],
          [6.5, () => { pose('micaiah', 'stand'); face('micaiah', 1); }],
          // 上基列的拉末：亚哈改装上阵
          [8, b => {
            rmCrowd('four');
            add('ahab', { robe: [110, 100, 88], accent: null });
            pose('ahab', 'stand'); pose('jehos', 'stand');
            animal('horse', 'horse', 0.66, { label: '马', facing: -1, from: b.instant ? 'none' : 'fade' });
            animal('horse2', 'horse', 0.666, { label: '马', col: [66, 48, 36], facing: -1, v: 0.05, from: b.instant ? 'none' : 'fade' });
            animal('chariot', 'wagon', 0.694, { label: '亚哈的车', facing: -1, from: b.instant ? 'none' : 'fade' });
            walk('ahab', 0.695, { speed: 0.03 });
            walk('jehos', 0.52, { speed: 0.03 }); walk('micaiah', 0.9, { speed: 0.02 });
            unprop('thrones');
            flash(b, { type: 'battle', pass: 'far', xf: 0.35, dur: 12 });
            flash(b, { type: 'battle', pass: 'far', xf: 0.5, dur: 11 });
          }],
          [10.5, () => { ride('ahab', 'chariot'); follow('horse2', 'horse', 0.006); follow('chariot', 'horse', 0.034); walk('horse', 0.56, { speed: 0.012 }); rm('jehos'); }],
          [11.5, b => { S.arrow = 1; flash(b, { type: 'arrow', dur: 1.6 }); sfx(b, 'wings', { soft: true }); }],
          [12.8, b => { glow('ahab', 0.05); pose('ahab', 'ride'); sfx(b, 'thunder', { far: true, low: true }); }],
          // 日落：各归本城
          [14, b => { W.goTo(0.745, 9, b.instant); }],
          [18, b => {
            ride('ahab', null);
            rm('ahab'); rm('chariot'); rm('horse'); rm('horse2');
            crowd('home', { n: 10, x0: 0.55, x1: 0.8, layer: 2, label: '以色列的兵' });
            sfx(b, 'crowd', { far: true });
          }],
          [19.5, () => { crowdWalk('home', 0.84, 1.1, { speed: 0.02 }); }],
          [22, b => { lv('elLamp', 1, b); face('micaiah', -1); W.goTo(0.768, 7, b.instant); }],
          [27, () => { rmCrowd('home'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '列王纪上', books: [11], title: '以利亚', sub: '列王纪上 12 — 22', tint: [255, 180, 120], music: 'cain',
    intro: [
      { text: '罗波安往示剑去；因为以色列人都到了示剑要立他作王。', ref: '列王纪上 12:1', hold: 5.5 },
      { text: '王用严厉的话回答百姓，……<br>「我父亲使你们负重轭，我必使你们负更重的轭！」', ref: '列王纪上 12:13–14', hold: 6 },
    ],
    outro: 18,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '以利亚': { text: '基列寄居的提斯比人以利亚对亚哈说：「我指着所事奉永生耶和华以色列的神起誓，<br>这几年我若不祷告，必不降露，不下雨。」', ref: '列王纪上 17:1' },
      '亚哈': { text: '暗利的儿子亚哈行耶和华眼中看为恶的事，比他以前的列王更甚，', ref: '列王纪上 16:30' },
      '耶洗别': { text: '又娶了西顿王谒巴力的女儿耶洗别为妻，去事奉敬拜巴力，', ref: '列王纪上 16:31' },
      '罗波安': { text: '惟独住犹大城邑的以色列人，罗波安仍作他们的王。', ref: '列王纪上 12:17' },
      '耶罗波安': { text: '以色列众人听见耶罗波安回来了，就打发人去请他到会众面前，<br>立他作以色列众人的王。', ref: '列王纪上 12:20' },
      '神人': { text: '那时，有一个神人奉耶和华的命从犹大来到伯特利。', ref: '列王纪上 13:1' },
      '寡妇': { text: '妇人对以利亚说：「现在我知道你是神人，耶和华藉你口所说的话是真的。」', ref: '列王纪上 17:24' },
      '寡妇的儿子': { text: '以利亚将孩子从楼上抱下来，进屋子交给他母亲，说：「看哪，你的儿子活了！」', ref: '列王纪上 17:23' },
      '仆人': { text: '第七次仆人说：「我看见有一小片云从海里上来，不过如人手那样大。」', ref: '列王纪上 18:44' },
      '巴力的先知': { text: '他们大声求告，按着他们的规矩，用刀枪自割、自刺，直到身体流血。', ref: '列王纪上 18:28' },
      '以色列众民': { text: '众民看见了，就俯伏在地，说：「耶和华是神！耶和华是神！」', ref: '列王纪上 18:39' },
      '天使': { text: '他就躺在罗腾树下，睡着了。有一个天使拍他，说：「起来吃吧！」', ref: '列王纪上 19:5' },
      '以利沙': { text: '以利沙就离开牛，跑到以利亚那里，说：「求你容我先与父母亲嘴，然后我便跟随你。」', ref: '列王纪上 19:20' },
      '拿伯': { text: '拿伯对亚哈说：「我敬畏耶和华，万不敢将我先人留下的产业给你。」', ref: '列王纪上 21:3' },
      '米该雅': { text: '米该雅说：「我指着永生的耶和华起誓，耶和华对我说什么，我就说什么。」', ref: '列王纪上 22:14' },
      '约沙法': { text: '约沙法行他父亲亚撒所行的道，不偏离左右，行耶和华眼中看为正的事；', ref: '列王纪上 22:43' },
      '耶路撒冷': { text: '然而耶和华他的神因大卫的缘故，仍使他在耶路撒冷有灯光，<br>叫他儿子接续他作王，坚立耶路撒冷。', ref: '列王纪上 15:4' },
      '示剑': { text: '罗波安往示剑去；因为以色列人都到了示剑要立他作王。', ref: '列王纪上 12:1' },
      '撒马利亚': { text: '暗利用二他连得银子向撒玛买了撒马利亚山，在山上造城，<br>就按着山的原主撒玛的名，给所造的城起名叫撒马利亚。', ref: '列王纪上 16:24' },
      '金牛犊': { text: '王就筹划定妥，铸造了两个金牛犊，对众民说：「以色列人哪，你们上耶路撒冷去实在是难；<br>这就是领你们出埃及地的神。」', ref: '列王纪上 12:28' },
      '巴力的庙': { text: '在撒马利亚建造巴力的庙，在庙里为巴力筑坛。', ref: '列王纪上 16:32' },
      '基立溪': { text: '于是以利亚照着耶和华的话，去住在约旦河东的基立溪旁。', ref: '列王纪上 17:5' },
      '坛与瓶': { text: '坛内的面果不减少，瓶里的油也不缺短，<br>正如耶和华藉以利亚所说的话。', ref: '列王纪上 17:16' },
      '迦密山': { text: '亚哈就差遣人招聚以色列众人和先知都上迦密山。', ref: '列王纪上 18:20' },
      '耶和华的坛': { text: '于是，耶和华降下火来，烧尽燔祭、木柴、石头、尘土，<br>又烧干沟里的水。', ref: '列王纪上 18:38' },
      '罗腾树': { text: '自己在旷野走了一日的路程，来到一棵罗腾树下，就坐在那里求死，', ref: '列王纪上 19:4' },
      '何烈山': { text: '他就起来吃了喝了，仗着这饮食的力，走了四十昼夜，到了神的山，就是何烈山。', ref: '列王纪上 19:8' },
      '拿伯的葡萄园': { text: '这事以后，又有一事。耶斯列人拿伯在耶斯列有一个葡萄园，<br>靠近撒马利亚王亚哈的宫。', ref: '列王纪上 21:1' },
      '没有牧人的羊群': { text: '米该雅说：「我看见以色列众民散在山上，如同没有牧人的羊群一般。」', ref: '列王纪上 22:17' },
    },
  });
})(window.GS);
