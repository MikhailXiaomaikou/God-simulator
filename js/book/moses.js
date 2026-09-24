/* ─────────────────────────────────────────────────────────────
 * book/moses.js —— 出埃及记 · 摩西（出埃及记 1 — 4）
 *
 * 约瑟那一代的人都死了；以色列人在埃及生养众多。不认识约瑟的新王起来：督工的、重担、泥与砖，
 * 两座积货城比东和兰塞一层一层地升起——「他们越发多起来，越发蔓延」。两个收生婆敬畏神，
 * 歌珊的小屋一间间亮起灯来；法老吩咐把男孩丢在河里，尼罗河暗了下来。
 * 清晨，一个蒲草箱搁在河边的芦荻中；姊姊远远站着；法老的女儿来到河边——「她给孩子起名叫摩西」。
 * 摩西长大，打死埃及人，逃往米甸：井旁，七个女儿，群羊，西坡拉。
 * 过了多年，哀声如微光自砖场升上天去——「神听见他们的哀声」；一颗星移向旷野，神的山何烈山升起。
 * 黄昏，山上的荆棘被火烧着，却没有烧毁（本卷的签名画面）；「摩西！摩西！」；脱鞋，圣地发光；
 * 「我必与你同在」；深夜，「我是自有永有的」以火写在星空之下；杖变作蛇，又变为杖；
 * 天亮：「现在去吧，我必赐你口才」——摩西带着妻儿下山；亚伦在神的山迎接他；长老聚集，百姓低头下拜。
 *
 * 画面的方位：左 = 尼罗河（自远处流向观者）与法老的宫，远处中丘上的金字塔与两座积货城；
 *            中 = 砖场与歌珊（以色列人的小屋）；右 = 米甸的旷野：井、叶忒罗的帐棚，与升起的何烈山。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'moses';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('msEgypt', 'exp', 0.4);     // 埃及的沙地与米甸的旷野
  W.defineLevel('msNile', 'exp', 0.4);      // 尼罗河
  W.defineLevel('msDark', 'exp', 0.3);      // 法老的命令：河水暗沉（1:22）
  W.defineLevel('msHoreb', 'lin', 0.16);    // 神的山，何烈山（3:1），自旷野中升起
  W.defineLevel('msHoly', 'exp', 0.45);     // 圣地（3:5）
  W.defineLevel('msCry', 'exp', 0.45);      // 哀声达于神（2:23）
  W.defineLevel('msPromise', 'exp', 0.3);   // 流奶与蜜之地（3:8）
  W.defineLevel('msWith', 'exp', 0.5);      // 我必与你同在（3:12）
  W.defineLevel('msVisit', 'exp', 0.35);    // 耶和华眷顾他们（4:31）
  W.defineLevel('msAway', 'exp', 0.3);      // 摩西在米甸与何烈山时：埃及退到远处的暮霭里（2:15 — 4:20）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 埃及
    nileT: 0.53, bank: 0.542, palace: 0.585, pharaoh: 0.563,
    bricks: 0.64, pithom: 0.598, raamses: 0.69,
    huts: [0.692, 0.708, 0.724, 0.74, 0.756], goshen0: 0.684, goshen1: 0.766,
    // 旷野的边界（一道乱石与沙丘），米甸与何烈山
    edge0: 0.764, edge1: 0.792,
    well: 0.808, tent: 0.962, tent2: 0.992,
    // 神的山：整座山都在画面里（竖屏时稍往左、稍宽）
    get horeb() { return portrait() ? 0.84 : 0.875; },
  };
  const ROBE = {
    pharaoh: [242, 236, 216], task: [228, 218, 194], prince: [238, 232, 214], shepherd: [128, 100, 76],
    mother: [150, 108, 96], sister: [184, 138, 112], princess: [246, 240, 226], maid: [230, 220, 198],
    shiphrah: [146, 114, 98], puah: [120, 104, 124], heb: [124, 100, 80],
    jethro: [96, 86, 112], zipporah: [176, 94, 76], gershom: [168, 142, 110], aaron: [112, 96, 142],
    shep: [118, 98, 74],
  };
  const DAUGHTERS = [[166, 112, 92], [140, 98, 104], [178, 142, 98], [128, 112, 132], [168, 122, 104], [150, 132, 100]];
  const ELDERS = [[104, 90, 76], [120, 104, 88], [96, 92, 104], [132, 110, 84], [110, 96, 82], [126, 116, 104]];
  const GOLD = [236, 194, 96];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { mount: {} }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.35 : 1);
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
  const portrait = () => W.w < W.h * 0.75;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const dayA = () => 0.3 + 0.7 * W.daylight;
  // 近地纵深里的一点：v 0 = 地的轮廓线，1 = 画面底
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g); };
  // 竖屏时经文在画面顶上：天上的东西略往下放
  const skyDY = () => (portrait() ? 0.24 : 0);

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(4012); for (let i = 0; i < 1024; i++) RT.push(r()); })();
  const rt = i => RT[((i % 1024) + 1024) % 1024];

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function hold(id, what) {
    const c = C();
    if (!fig(id)) return;
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, what || null)); return; }
    const f = fig(id); if (f) f.prop = what || null;
  }
  function carry(id, what) {
    const c = C();
    if (!fig(id)) return;
    if (c.carry) { U.safe('cast.carry', () => c.carry(id, what || null)); return; }
    const f = fig(id); if (f) f.carry = what || null;
  }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) { const c = C(); if (!c.herd) return null; return U.safe('cast.herd', () => c.herd(gid, o)); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function embrace(a, b, o) {
    const c = C();
    if (!fig(a) || !fig(b)) return;
    if (c.embrace) { U.safe('cast.embrace', () => c.embrace(a, b, o)); return; }
    const A = fig(a), B = fig(b), mid = (A.nx + B.nx) / 2;
    walk(a, mid - 0.004, { speed: 0.03 }); walk(b, mid + 0.004, { speed: 0.03 });
  }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  const fromOf = b => (b.instant ? 'none' : 'fade');
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 一群人走到 [x0, x1] 之间，各在各的位置
  function spread(ids, x0, x1, o) {
    o = o || {};
    const live = ids.filter(id => fig(id)), n = live.length;
    live.forEach((id, i) => {
      const x = n > 1 ? lerp(x0, x1, i / (n - 1)) : (x0 + x1) / 2;
      walk(id, x, { speed: (o.speed || 0.03) * (0.85 + 0.3 * rt(i * 7 + (o.seed || 0))), pose: o.pose });
    });
  }
  // 俯伏在地时，杖放下（俯伏的姿势里杖会竖起来）；起来时再拿起
  function prostrate(id) { hold(id, null); pose(id, 'fall'); }
  function arise(id, p) { hold(id, 'staff'); pose(id, p); }
  // 地上的走兽绕开主要人物与布景所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const x = f.nx * W.w, g = l === 2 ? surfY(f.nx) : gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = f.isAnimal ? 20 * LS(l) : 34 * LS(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * 1.3;
    return [x, y - h * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    if (portrait()) cy = Math.max(cy, W.h * 0.36);
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某人头上聚成一个名字（微尘自 src 而来）
  function nameOver(b, id, str, rgb, src, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.6, W.h * 0.8];
    const size = (o.size || 0.045) * M(), n = Array.from(str).length;
    const c = nameAt(p[0], p[1] - size * (o.lift || 1.1) - 6, size, n);
    const from = src || (() => [p[0] + rand(-50, 50) * SU(), p[1] + rand(-20, 40) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, from, { hold: o.hold || 2.6 });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }

  // ════════════════════════════════════════════════════════════
  //  何烈山（神的山，3:1）：红色花岗岩的山自旷野升起；山脚一道宽平的岩台，其后岩壁陡起直到山顶，右后还有一肩
  // ════════════════════════════════════════════════════════════
  // 左脚上一小段坡（有小路），u ≈ −0.86 … −0.18 是一道宽平的岩台（荆棘在岩台的尽头、岩壁脚下；人在台上可跪、可俯伏），
  // 其后陡起的岩壁直到山顶，右后还有一肩
  const HB_PTS = [[-1, 0], [-0.95, 0.07], [-0.9, 0.17], [-0.86, 0.235], [-0.8, 0.255], [-0.6, 0.262], [-0.4, 0.27], [-0.24, 0.278],
    [-0.16, 0.3], [-0.1, 0.44], [-0.04, 0.6], [0.02, 0.73], [0.08, 0.84], [0.15, 0.93], [0.22, 0.985], [0.29, 1.0], [0.36, 0.975], [0.43, 0.93],
    [0.5, 0.9], [0.58, 0.8], [0.67, 0.64], [0.76, 0.46], [0.85, 0.27], [0.93, 0.11], [1, 0]];
  // 荆棘、摩西初站、近前的位置（山上的 u）；俯伏时身子向前伸出约一身之长，故近前处离荆棘留出一身有余
  const BU = -0.24, STAND_U = -0.8, NEAR_U = -0.61;
  const TERR0 = -0.86, TERR1 = -0.17;               // 岩台的两端
  const HB_N = 240;
  const HB_TAB = (function () {
    const P = HB_PTS, out = new Float32Array(HB_N + 1);
    for (let j = 0; j <= HB_N; j++) {
      const u = -1 + 2 * j / HB_N;
      let i = 0;
      while (i < P.length - 2 && P[i + 1][0] < u) i++;
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      const t = clamp((u - p1[0]) / (p2[0] - p1[0]), 0, 1), t2 = t * t, t3 = t2 * t;
      const v = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
      out[j] = clamp(v, 0, 1.02);
    }
    out[0] = 0; out[HB_N] = 0;
    return out;
  })();
  function hbK(u) {
    if (u <= -1 || u >= 1) return 0;
    const f = (u + 1) / 2 * HB_N, i = Math.min(HB_N - 1, Math.floor(f));
    return lerp(HB_TAB[i], HB_TAB[i + 1], f - i);
  }
  const hbHW = () => (portrait() ? 0.16 : 0.12);
  function hbH() { const hw = hbHW() * W.w; return Math.min(0.25 * W.h, 1.32 * hw, 190 * LS(2)); }
  const HU = u => X.horeb + u * hbHW();            // 山上 u 处的画面比例
  const hbG = () => smoothstep(0, 1, W.lv.msHoreb);
  // 山面在 xf 处的高度（像素 y）；不在山上、或山未升起时为 null
  function horebY(xf) {
    const g = hbG();
    if (g < 0.002) return null;
    const u = (xf - X.horeb) / hbHW();
    if (u <= -1 || u >= 1) return null;
    return gY(2, xf) + 2 - hbK(u) * hbH() * g;
  }
  function surfY(xf) { const m = horebY(xf), g = gY(2, xf); return m == null ? g : Math.min(g, m); }
  // 人站到山上：脚下随山面高低（离了山，山面便是地面）
  function onMount(id) { S.mount[id] = 1; attach(id, () => { const f = fig(id); return f ? [f.nx * W.w, surfY(f.nx)] : null; }); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.8, grow: 0.3, lit: 0.6, fire: 0.45, build: 0.055, work: 0.6, float: 0.55, morph: 0.9, fill: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, { x, layer, size, label, flip, show, grow, lit, fire, build, work, float, morph, fill, tx, spd })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind: kind || 'hut', x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02, flip: 1, fd: 1 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'size', 'label', 'spd', 'flip']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.tx != null) { p.tx = o.tx; p.fd = o.tx >= p.x ? 1 : -1; }
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
  const ORDER = { palm: -1, pyramid: -2, city: -3, palace: 0, hut: 0, bricks: 1, well: 2, tent: 1, mound: 3, bush: 4, sandals: 5, basket: 6, serpent: 7 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

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
    SP = {
      warm: radial([255, 164, 80], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      fire: radial([255, 132, 52], 1, 0.3), pale: radial([228, 222, 255], 1), smoke: radial([132, 124, 118], 0.8, 0.55),
      blue: radial([176, 206, 255], 1), ember: radial([255, 96, 40], 1, 0.4),
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
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5 || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  // 灯：门口、窗里的暖光
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  画：埃及的物件
  // ════════════════════════════════════════════════════════════
  // 棕树
  function drawPalm(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, g = p.grow;
    if (g < 0.01 || p.a < 0.01) return;
    const H = 50 * s * (0.8 + 0.35 * rt(p.seed)) * g, lean = (rt(p.seed + 1) - 0.5) * 0.4 * (p.flip || 1);
    const sway = W.wind * 1.6 * s + Math.sin(W.t * 0.9 + p.seed) * 0.6 * s;
    const tx = x + lean * H + sway, ty = y - H, cxp = x + lean * H * 0.15, cyp = y - H * 0.5;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([110, 86, 60], l);
    ctx.beginPath();
    ctx.moveTo(x - 2.3 * s, y); ctx.quadraticCurveTo(cxp - 1.7 * s, cyp, tx - 1.2 * s, ty);
    ctx.lineTo(tx + 1.2 * s, ty); ctx.quadraticCurveTo(cxp + 1.7 * s, cyp, x + 2.3 * s, y); ctx.closePath(); ctx.fill();
    if (l === 2) {
      ctx.strokeStyle = css([78, 60, 42], l, 0.8); ctx.lineWidth = Math.max(0.4, 0.55 * s);
      ctx.beginPath();
      for (let i = 1; i < 10; i++) { const t = i / 10, px = qb(x, cxp, tx, t), py = qb(y, cyp, ty, t), w = 2.1 * s * (1 - t * 0.4); ctx.moveTo(px - w, py); ctx.lineTo(px + w, py - 0.9 * s); }
      ctx.stroke();
    }
    ctx.fillStyle = css([176, 104, 48], l);
    ctx.beginPath(); ctx.ellipse(tx + 1.5 * s, ty + 3 * s, 2.2 * s * g, 3 * s * g, 0.3, 0, TAU); ctx.fill();
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    const leaf = i => {
      const a = (ANG[i] + (rt(p.seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      const L = (19 + 8 * rt(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux));
      const sw = Math.sin(W.t * 1.3 + i * 1.7 + p.seed) * 0.9 * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      return [ux, uy, L, sw];
    };
    ctx.fillStyle = css([66, 104, 56], l);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const [ux, uy, L, sw] = leaf(i);
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L, mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L, wd = 2.3 * s;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 236, 170], l, 0.35 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      const [ux, uy, L, sw] = leaf(i);
      if (ux * d < -0.2) continue;
      const wd = 2.3 * s, mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, tx + ux * L + sw, ty + (uy * 0.5 + 0.48) * L);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 金字塔：远处中丘上（受日光一面亮、一面暗）
  function drawPyramid(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2.5 * s, a = p.a;
    if (a < 0.01) return;
    const hw = 40 * s, h = hw * 0.92, ax = x + hw * 0.16;
    const sunR = litX() >= x;
    const LIT = [232, 204, 150], SHD = [168, 134, 96];
    ctx.globalAlpha = a;
    ctx.fillStyle = css(sunR ? SHD : LIT, l, 1, sunR ? 0 : 0.08);
    ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(ax, y - h); ctx.lineTo(ax, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(sunR ? LIT : SHD, l, 1, sunR ? 0.08 : 0);
    ctx.beginPath(); ctx.moveTo(ax, y); ctx.lineTo(ax, y - h); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([120, 96, 70], l, 0.18);
    ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 1; i < 7; i++) { const k = i / 7, yy = y - h * k; ctx.moveTo(lerp(x - hw, ax, k), yy); ctx.lineTo(lerp(x + hw, ax, k), yy); }
    ctx.stroke();
    if (W.daylight > 0.2) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, ax, y - h, 6 * s + 3, a * 0.35 * W.daylight);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 法老的宫：塔门（两座梯形的塔、门楣、旗杆与旗）与其后的柱厅
  function drawPalace(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const STONE = [230, 210, 168], SHD = [178, 154, 116], DARK = [40, 32, 26];
    ctx.globalAlpha = p.a;
    const d = litX() >= x ? 1 : -1;
    const hx0 = x + 6 * s, hx1 = x + 40 * s, hh = 17 * s * g;
    ctx.fillStyle = css(STONE, l);
    ctx.fillRect(hx0, y - hh, hx1 - hx0, hh);
    ctx.fillStyle = css([92, 76, 60], l);
    ctx.fillRect(hx0 + 3 * s, y - hh + 3 * s, hx1 - hx0 - 6 * s, hh - 3 * s);
    ctx.fillStyle = css(STONE, l, 1, 0.04);
    for (let i = 0; i < 6; i++) {
      const cx = lerp(hx0 + 5 * s, hx1 - 4 * s, i / 5);
      ctx.fillRect(cx - 1.4 * s, y - hh + 3 * s, 2.8 * s, hh - 3 * s);
      ctx.beginPath(); ctx.moveTo(cx - 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 1.4 * s, y - hh + 5.4 * s); ctx.lineTo(cx - 1.4 * s, y - hh + 5.4 * s); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([218, 198, 158], l);
    ctx.fillRect(hx0 - 1 * s, y - hh - 2.2 * s, hx1 - hx0 + 2 * s, 2.6 * s);
    const TH = 34 * s * g, gw = 4 * s;
    const tower = cx => {
      const bw = 10 * s, tw = 7.6 * s;
      ctx.beginPath(); ctx.moveTo(cx - bw, y); ctx.lineTo(cx - tw, y - TH); ctx.lineTo(cx + tw, y - TH); ctx.lineTo(cx + bw, y); ctx.closePath(); ctx.fill();
      return [cx, bw, tw];
    };
    const flags = [[x - 13 * s, [176, 60, 48]], [x + 13 * s, [64, 98, 160]]];
    ctx.fillStyle = css(STONE, l);
    const tl = tower(x - 12 * s), tr = tower(x + 12 * s);
    ctx.fillStyle = css(SHD, l, 0.55);
    ctx.fillRect(d > 0 ? tl[0] - tl[2] : tl[0] + tl[2] - 3 * s, y - TH, 3 * s, TH);
    ctx.fillRect(d > 0 ? tr[0] - tr[2] : tr[0] + tr[2] - 3 * s, y - TH, 3 * s, TH);
    ctx.fillStyle = css([222, 202, 160], l);
    ctx.fillRect(x - gw - 2 * s, y - TH * 0.66, (gw + 2 * s) * 2, 3 * s);
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(x - gw, y - TH * 0.6, gw * 2, TH * 0.6);
    ctx.fillStyle = css([236, 220, 180], l);
    ctx.fillRect(tl[0] - tl[2] - 0.8 * s, y - TH - 1.8 * s, tl[2] * 2 + 1.6 * s, 2.2 * s);
    ctx.fillRect(tr[0] - tr[2] - 0.8 * s, y - TH - 1.8 * s, tr[2] * 2 + 1.6 * s, 2.2 * s);
    ctx.strokeStyle = css([150, 124, 90], l, 0.4); ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) for (let i = 1; i <= 3; i++) { const yy = y - TH * (0.25 + 0.2 * i), w = lerp(t[1], t[2], 0.25 + 0.2 * i) * 0.7; ctx.moveTo(t[0] - w, yy); ctx.lineTo(t[0] + w, yy); }
    ctx.stroke();
    ctx.strokeStyle = css([120, 96, 66], l); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (const fl of flags) { ctx.moveTo(fl[0], y); ctx.lineTo(fl[0], y - TH - 12 * s * g); }
    ctx.stroke();
    for (let i = 0; i < flags.length; i++) {
      const fx0 = flags[i][0], fy = y - TH - 12 * s * g + 0.5 * s, wv = Math.sin(W.t * 2.2 + i * 1.7) * 1.4 * s, dir = W.wind >= 0 ? 1 : -1;
      ctx.fillStyle = css(flags[i][1], l, 1, 0.05);
      ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.quadraticCurveTo(fx0 + dir * 4 * s, fy + wv, fx0 + dir * 8 * s, fy + 1.2 * s + wv * 0.6);
      ctx.lineTo(fx0 + dir * 7 * s, fy + 3.2 * s + wv * 0.4); ctx.quadraticCurveTo(fx0 + dir * 3.6 * s, fy + 3.4 * s + wv, fx0, fy + 3.4 * s); ctx.closePath(); ctx.fill();
    }
    const lk = Math.max(nightK() * 0.85, p.lit);
    if (lk > 0.02) {
      lamp(ctx, x, y - TH * 0.3, 16 * s * (1 + p.lit), p.a * Math.min(1, lk), p.seed);
      lamp(ctx, (hx0 + hx1) / 2, y - hh * 0.5, 22 * s * (0.8 + p.lit), p.a * Math.min(1, lk) * 0.8, p.seed + 2);
    }
    ctx.globalAlpha = p.a * 0.55;
    ctx.strokeStyle = css([255, 244, 222], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) { ctx.moveTo(t[0] + d * t[1], y); ctx.lineTo(t[0] + d * t[2], y - TH); }
    ctx.moveTo(hx0, y - hh - 2.2 * s); ctx.lineTo(hx1, y - hh - 2.2 * s);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 以色列人的小屋（歌珊）：泥砖的方屋，平顶上铺着苇席；夜里门口有灯（1:21 神便叫她们成立家室）
  function drawHut(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2.5 * s;
    const f = p.flip || 1, hw = 10 * s, h = 11 * s * (0.9 + 0.2 * rt(p.seed));
    const MUD = [178, 140, 100];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(MUD, l);
    ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(x - hw * 0.95, y - h); ctx.lineTo(x + hw * 0.95, y - h * 1.02); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    // 苇席的顶与伸出的椽头
    ctx.fillStyle = css([152, 130, 86], l);
    ctx.fillRect(x - hw * 1.12, y - h - 2.2 * s, hw * 2.24, 2.6 * s);
    ctx.strokeStyle = css([96, 76, 52], l, 0.8); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { const xx = x - hw * 0.8 + i * hw * 0.53; ctx.moveTo(xx, y - h + 0.4 * s); ctx.lineTo(xx, y - h + 1.8 * s); }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([118, 90, 64], l, 0.5);
    ctx.fillRect(d > 0 ? x - hw : x + hw - 3.5 * s, y - h, 3.5 * s, h);
    // 门与小窗
    const dx = x + f * hw * 0.32;
    ctx.fillStyle = css([24, 18, 14], l);
    ctx.fillRect(dx - 2.4 * s, y - 7.2 * s, 4.8 * s, 7.2 * s);
    ctx.fillRect(x - f * hw * 0.45 - 1.2 * s, y - h * 0.74, 2.4 * s, 1.8 * s);
    // 门边的水罐
    ctx.fillStyle = css([164, 104, 70], l);
    ctx.beginPath(); ctx.ellipse(dx + f * 5 * s, y - 2 * s, 1.8 * s, 2.2 * s, 0, 0, TAU); ctx.fill();
    // 灯
    const lk = Math.min(1, Math.max(nightK() * 0.55, p.lit * (0.35 + 0.65 * nightK())));
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 170, 90, p.a * lk * 0.7);
      ctx.fillRect(dx - 2.4 * s, y - 7.2 * s, 4.8 * s, 7.2 * s);
      ctx.fillRect(x - f * hw * 0.45 - 1.2 * s, y - h * 0.74, 2.4 * s, 1.8 * s);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, y - 3.5 * s, hw * (1.3 + p.lit * 2.2), p.a * lk, p.seed);
      // 门前地上的一片暖光：一家一家亮起来（1:21）
      if (p.lit > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.save(); ctx.translate(dx, y + 1.5 * s); ctx.scale(1, 0.3);
        glowSp(ctx, SP.warm, 0, 0, hw * 2.8, p.a * p.lit * (0.2 + 0.45 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 5 + p.seed)));
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([246, 226, 190], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - hw * 1.12, y - h - 2.2 * s); ctx.lineTo(x + hw * 1.12, y - h - 2.2 * s); ctx.moveTo(x + d * hw, y - h); ctx.lineTo(x + d * hw, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 积货城（1:11）：比东和兰塞——泥砖的城墙与塔楼、城中高起的仓台；建造时有脚手架与运砖的小人
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, b = p.build;
    if (b < 0.004) return;
    const BR = [188, 128, 90], BR2 = [150, 102, 74];
    const hw = 40 * s, wallH = 17 * s, towH = 27 * s, coreH = 38 * s;
    const kW = clamp(b * 1.6, 0, 1), kT = clamp(b * 1.3 - 0.1, 0, 1), kC = clamp(b * 1.4 - 0.4, 0, 1);
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a;
    // 城中的仓台（阶梯形）
    if (kC > 0.01) {
      const ch = coreH * kC, cw = 17 * s;
      ctx.fillStyle = css(BR2, l);
      ctx.beginPath();
      ctx.moveTo(x - cw, y); ctx.lineTo(x - cw, y - ch * 0.5); ctx.lineTo(x - cw * 0.7, y - ch * 0.5); ctx.lineTo(x - cw * 0.7, y - ch * 0.8);
      ctx.lineTo(x - cw * 0.4, y - ch * 0.8); ctx.lineTo(x - cw * 0.4, y - ch); ctx.lineTo(x + cw * 0.4, y - ch); ctx.lineTo(x + cw * 0.4, y - ch * 0.8);
      ctx.lineTo(x + cw * 0.7, y - ch * 0.8); ctx.lineTo(x + cw * 0.7, y - ch * 0.5); ctx.lineTo(x + cw, y - ch * 0.5); ctx.lineTo(x + cw, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([120, 86, 62], l, 0.45);
      ctx.fillRect(d > 0 ? x - cw : x + cw * 0.55, y - ch * 0.5, cw * 0.45, ch * 0.5);
    }
    // 城墙（一层一层地砌高）
    const wh = wallH * kW;
    ctx.fillStyle = css(BR, l);
    ctx.fillRect(x - hw, y - wh, hw * 2, wh);
    if (kW > 0.9) {
      ctx.beginPath();
      const n = 14;
      for (let i = 0; i < n; i++) { const xx = x - hw + (i + 0.2) * (2 * hw / n); ctx.rect(xx, y - wh - 2.2 * s, (2 * hw / n) * 0.5, 2.2 * s); }
      ctx.fill();
    }
    // 塔楼
    if (kT > 0.01) {
      for (const q of [-1, -0.34, 0.34, 1]) {
        const tx = x + q * hw, th = towH * kT * (Math.abs(q) > 0.5 ? 1 : 1.12), tw = 5.5 * s;
        ctx.fillStyle = css(BR, l, 1, 0.02);
        ctx.fillRect(tx - tw, y - th, tw * 2, th);
        ctx.fillStyle = css(BR2, l, 0.6);
        ctx.fillRect(d > 0 ? tx - tw : tx + tw * 0.3, y - th, tw * 0.7, th);
        if (kT > 0.9) { ctx.fillStyle = css(BR, l); ctx.fillRect(tx - tw * 1.15, y - th - 2 * s, tw * 2.3, 2 * s); }
      }
      // 城门
      ctx.fillStyle = css([40, 30, 24], l);
      ctx.fillRect(x - 3 * s, y - Math.min(wh, 9 * s), 6 * s, Math.min(wh, 9 * s));
    }
    // 砖的层线
    ctx.strokeStyle = css([128, 90, 64], l, 0.35); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let yy = 3 * s; yy < wh; yy += 3 * s) { ctx.moveTo(x - hw, y - yy); ctx.lineTo(x + hw, y - yy); }
    ctx.stroke();
    // 脚手架、坡道与运砖的人（在造的时候）
    const wk = p.work * (b < 0.999 ? 1 : 0.5);
    if (wk > 0.02) {
      ctx.globalAlpha = p.a * wk;
      ctx.strokeStyle = css([112, 88, 60], l, 0.9); ctx.lineWidth = Math.max(0.4, 0.6 * s);
      ctx.beginPath();
      const top = y - Math.max(wh, towH * kT) - 3 * s;
      for (const q of [-0.8, -0.55, 0.55, 0.8]) { const xx = x + q * hw; ctx.moveTo(xx, y); ctx.lineTo(xx, top); }
      for (let yy = y - 5 * s; yy > top; yy -= 6 * s) { ctx.moveTo(x - 0.84 * hw, yy); ctx.lineTo(x - 0.5 * hw, yy); ctx.moveTo(x + 0.5 * hw, yy); ctx.lineTo(x + 0.84 * hw, yy); }
      ctx.stroke();
      // 坡道
      ctx.fillStyle = css([184, 150, 108], l, 0.9);
      ctx.beginPath(); ctx.moveTo(x + hw + 22 * s, y); ctx.lineTo(x + hw, y - Math.max(wh, 3 * s)); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
      // 小人：沿坡道上下
      ctx.fillStyle = css([70, 54, 42], l);
      for (let i = 0; i < 5; i++) {
        const ph = U.fract(W.t * 0.05 + i / 5 + rt(p.seed + i) * 0.1), up = ph < 0.5 ? ph * 2 : 2 - ph * 2;
        const xx = x + hw + 22 * s * (1 - up), yy = y - Math.max(wh, 3 * s) * up;
        ctx.fillRect(xx - 0.8 * s, yy - 4.2 * s, 1.6 * s, 4.2 * s);
        ctx.fillRect(xx - 0.9 * s, yy - 5.6 * s, 1.8 * s, 1.4 * s);
      }
      ctx.globalAlpha = p.a;
    }
    // 夜里的灯
    const lk = nightK() * kW;
    if (lk > 0.05) { lamp(ctx, x - hw * 0.34, y - wh * 0.5, 10 * s, lk * 0.7, p.seed); lamp(ctx, x + hw * 0.34, y - wh * 0.5, 10 * s, lk * 0.7, p.seed + 3); }
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([255, 232, 196], l, 1, 0.3); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - hw, y - wh); ctx.lineTo(x + hw, y - wh); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 砖场（1:14 和泥，做砖）：泥坑、一排排晒着的砖、草堆
  function drawBricks(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, b = p.build;
    ctx.globalAlpha = p.a;
    // 泥坑
    const px = x - 0.024 * W.w, py = fieldY(px / W.w, 0.1);
    ctx.fillStyle = css([92, 70, 50], 2);
    ctx.beginPath(); ctx.ellipse(px, py, 13 * s, 3.4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([118, 92, 66], 2, 0.8);
    ctx.beginPath(); ctx.ellipse(px, py - 0.6 * s, 10 * s, 2.2 * s, 0, 0, TAU); ctx.fill();
    if (W.daylight > 0.2) {
      ctx.strokeStyle = U.rgba(255, 240, 210, 0.25 * W.daylight); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath(); ctx.moveTo(px - 6 * s, py - 1.2 * s); ctx.lineTo(px + 3 * s, py - 1.4 * s); ctx.stroke();
    }
    // 草堆
    const hx = x + 0.034 * W.w, hy = fieldY(hx / W.w, 0.05);
    ctx.fillStyle = css([206, 176, 102], 2);
    ctx.beginPath(); ctx.ellipse(hx, hy, 7 * s, 4.6 * s, 0, Math.PI, TAU); ctx.fill();
    // 晒着的砖：四排，按 build 逐渐摆满
    const ROWS = [0.2, 0.32, 0.44, 0.56], N = 11;
    const total = ROWS.length * N, show = Math.floor(total * clamp(b, 0, 1) + 0.001);
    let k = 0;
    ctx.fillStyle = css([164, 104, 70], 2);
    ctx.beginPath();
    for (let r = 0; r < ROWS.length; r++) {
      const v = ROWS[r], sc = 1 + v * 0.5;
      for (let i = 0; i < N; i++, k++) {
        if (k >= show) break;
        const xf = x / W.w - 0.012 + i * 0.0048 * (portrait() ? 1.6 : 1) + r * 0.002, y = fieldY(xf, v * 0.5);
        ctx.rect(xf * W.w - 2 * s * sc, y - 1.8 * s * sc, 4 * s * sc, 1.8 * s * sc);
      }
    }
    ctx.fill();
    // 砖的亮面
    ctx.fillStyle = css([222, 168, 124], 2, 0.7 * dayA());
    ctx.beginPath();
    k = 0;
    for (let r = 0; r < ROWS.length; r++) {
      const v = ROWS[r], sc = 1 + v * 0.5;
      for (let i = 0; i < N; i++, k++) {
        if (k >= show) break;
        const xf = x / W.w - 0.012 + i * 0.0048 * (portrait() ? 1.6 : 1) + r * 0.002, y = fieldY(xf, v * 0.5);
        ctx.rect(xf * W.w - 2 * s * sc, y - 1.8 * s * sc, 4 * s * sc, 0.5 * s * sc);
      }
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 蒲草箱（2:3）：抹了石漆的小箱，搁在河边的芦荻中；被拉上岸时移到岸边
  function basketPos(p) {
    const t = 0.44, q = nilePt(t), w = nileW(t, 1) / 2;
    const wx = q[0] - q[2] * w * 0.45, wy = q[1] - q[3] * w * 0.45;
    const bx = (X.bank + 0.004) * W.w, by = fieldY(X.bank + 0.004, 0.37);
    return [lerp(bx, wx, p.float), lerp(by, wy, p.float)];
  }
  function drawBasket(ctx, p) {
    const s = LS(2) * p.size * 1.15, pt = basketPos(p), bob = Math.sin(W.t * 1.7 + p.seed) * 0.7 * s * p.float;
    const x = pt[0], y = pt[1] + bob;
    ctx.globalAlpha = p.a;
    // 水面的影与涟漪
    if (p.float > 0.3) {
      ctx.strokeStyle = U.rgba(220, 236, 250, 0.3 * p.float * (0.4 + 0.6 * W.daylight)); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      const r = 1 + 0.2 * Math.sin(W.t * 1.2);
      ctx.beginPath(); ctx.ellipse(x, y + 1.2 * s, 9 * s * r, 1.8 * s * r, 0, 0, TAU); ctx.stroke();
    }
    // 箱身：两头圆的长箱，下半抹着黑的石漆（2:3）
    const bw = 7.4 * s, bh = 3.4 * s;
    ctx.fillStyle = css([62, 48, 34], 2);
    ctx.beginPath();
    ctx.moveTo(x - bw, y - bh); ctx.quadraticCurveTo(x - bw * 1.06, y + 0.6 * s, x - bw * 0.55, y + 1 * s);
    ctx.lineTo(x + bw * 0.55, y + 1 * s); ctx.quadraticCurveTo(x + bw * 1.06, y + 0.6 * s, x + bw, y - bh); ctx.closePath(); ctx.fill();
    // 上半：编的蒲草
    ctx.fillStyle = css([178, 138, 80], 2);
    ctx.beginPath();
    ctx.moveTo(x - bw, y - bh); ctx.quadraticCurveTo(x - bw * 1.03, y - bh * 0.35, x - bw * 0.9, y - bh * 0.25);
    ctx.lineTo(x + bw * 0.9, y - bh * 0.25); ctx.quadraticCurveTo(x + bw * 1.03, y - bh * 0.35, x + bw, y - bh); ctx.closePath(); ctx.fill();
    // 盖：圆拱
    ctx.fillStyle = css([200, 162, 100], 2);
    ctx.beginPath(); ctx.ellipse(x, y - bh, bw * 0.96, 3.6 * s, 0, Math.PI, TAU); ctx.fill();
    // 编纹
    ctx.strokeStyle = css([120, 88, 48], 2, 0.8); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = -3; i <= 3; i++) { const xx = x + i * bw * 0.27; ctx.moveTo(xx, y - bh - Math.sqrt(Math.max(0, 1 - (i / 3.4) * (i / 3.4))) * 3.4 * s); ctx.lineTo(xx * 0.98 + x * 0.02, y - bh * 0.3); }
    ctx.moveTo(x - bw * 0.96, y - bh); ctx.lineTo(x + bw * 0.96, y - bh);
    ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([250, 226, 180], 2, 0.5 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.ellipse(x, y - bh, bw * 0.96, 3.6 * s, 0, Math.PI * 1.15, Math.PI * 1.75); ctx.stroke();
    // 箱里的一点暖光（孩子）
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y - 5 * s, 16 * s, 0.3 * p.a * (0.5 + 0.5 * nightK() + 0.3 * p.lit));
    ctx.globalCompositeOperation = 'source-over';
    // 前面的芦荻
    if (p.float > 0.2) {
      ctx.globalAlpha = p.a * p.float;
      ctx.strokeStyle = css([86, 122, 62], 2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath();
      for (let i = 0; i < 7; i++) {
        const rx = x + (rt(p.seed + i) - 0.5) * 20 * s, ry = y + (1.5 + rt(p.seed + 9 + i) * 2.5) * s, h = (6 + 7 * rt(p.seed + 20 + i)) * s;
        const sw = W.wind * 1.4 * s + Math.sin(W.t * 1.6 + i) * 0.6 * s;
        ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + sw * 0.3, ry - h * 0.6, rx + sw, ry - h);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 米甸的井（2:15–17）：石砌的井口、木架与吊桶，一旁是饮羊的石槽
  function drawWell(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = gY(2, p.x) + 2 * s;
    const STONE = [158, 140, 118];
    ctx.globalAlpha = p.a;
    // 槽
    const tx = x + 11 * s;
    ctx.fillStyle = css([128, 112, 94], 2);
    ctx.fillRect(tx - 6 * s, y - 3.2 * s, 12 * s, 3.2 * s);
    if (p.fill > 0.02) {
      ctx.fillStyle = U.rgba(160, 200, 230, 0.75 * p.fill * (0.35 + 0.65 * W.daylight));
      ctx.fillRect(tx - 5.2 * s, y - 3.2 * s, 10.4 * s, 1 * s);
    }
    // 井口
    ctx.fillStyle = css(STONE, 2);
    ctx.beginPath(); ctx.moveTo(x - 7 * s, y); ctx.lineTo(x - 7 * s, y - 6 * s); ctx.ellipse(x, y - 6 * s, 7 * s, 2.2 * s, 0, Math.PI, TAU); ctx.lineTo(x + 7 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([40, 34, 30], 2);
    ctx.beginPath(); ctx.ellipse(x, y - 6 * s, 5.4 * s, 1.4 * s, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([110, 96, 80], 2, 0.6); ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath(); for (const q of [-3.5, 0, 3.5]) { ctx.moveTo(x + q * s, y - 5 * s); ctx.lineTo(x + q * s, y); } ctx.moveTo(x - 7 * s, y - 3 * s); ctx.lineTo(x + 7 * s, y - 3 * s); ctx.stroke();
    // 木架、绳、桶
    ctx.strokeStyle = css([96, 72, 48], 2); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - 6 * s, y - 6 * s); ctx.lineTo(x - 5 * s, y - 17 * s); ctx.moveTo(x + 6 * s, y - 6 * s); ctx.lineTo(x + 5 * s, y - 17 * s); ctx.moveTo(x - 6.5 * s, y - 16.5 * s); ctx.lineTo(x + 6.5 * s, y - 16.5 * s); ctx.stroke();
    ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath(); ctx.moveTo(x + 1 * s, y - 16.5 * s); ctx.lineTo(x + 1 * s, y - 10 * s); ctx.stroke();
    ctx.fillStyle = css([110, 80, 52], 2);
    ctx.fillRect(x - 0.6 * s, y - 10.2 * s, 3.2 * s, 2.6 * s);
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([240, 226, 200], 2, 1, 0.25); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 7 * s, y - 6 * s); ctx.lineTo(x + d * 7 * s, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 帐棚（叶忒罗的家）
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, hw = 26 * s, h = 20 * s;
    const k0 = 0.86 + 0.1 * rt(p.seed), k1 = 1 + 0.08 * rt(p.seed + 1), k2 = 0.84 + 0.1 * rt(p.seed + 2), tilt = (rt(p.seed + 3) - 0.5) * 0.06;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k0 * h * 0.86); ctx.lineTo(x - 1.36 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k2 * h * 0.84); ctx.lineTo(x + 1.34 * hw, y);
    ctx.stroke();
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k0], [-0.3, -0.74], [0.02, -k1 - 0.06], [0.32, -0.76], [0.62, -0.86 * k2], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css([62, 48, 42], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([92, 74, 60], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.66, -0.34, 0.34, 0.66]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.74 - Math.abs(f) * 0.06) * h); }
    ctx.stroke();
    const dw = 0.2 * hw, dh = 0.62 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    const lk = clamp(nightK() * 1.05, 0, 1) * 0.8 + p.lit;
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * Math.min(1, lk) * 0.5;
      ctx.fillStyle = 'rgb(255,168,90)';
      ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, y - dh * 0.5, hw * (1.1 + p.lit), p.a * Math.min(1, lk), p.seed);
    }
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const a0 = d > 0 ? 4 : 1, a1 = d > 0 ? 7 : 4;
    for (let i = a0; i <= a1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * tilt) * hw, Y1 = y + q[1] * h; if (i === a0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 沙土（2:12）：一小堆新翻的沙
  function drawMound(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = fieldY(p.x, 0.12);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([204, 170, 120], 2);
    ctx.beginPath(); ctx.ellipse(x, y, 9 * s, 2.6 * s, 0, Math.PI, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：何烈山、荆棘与火、鞋、杖与蛇
  // ════════════════════════════════════════════════════════════
  let HB_MODEL = null;
  function hbModel() {
    if (HB_MODEL) return HB_MODEL;
    const r = U.mulberry32(3031), strata = [], cracks = [], scrub = [], rocks = [], jit = [], speck = [];
    for (let i = 0; i <= 60; i++) jit.push((r() - 0.5));
    // 岩层：少而长，顺着山面（与山的轮廓平行，往里一段），两头尖
    const ST = [[-0.12, 0.3, 0.1], [-0.02, 0.36, 0.16], [0.06, 0.4, 0.3], [0.2, 0.62, 0.12], [0.3, 0.64, 0.28], [0.44, 0.52, 0.2], [0.56, 0.5, 0.36],
      [0.66, 0.4, 0.16], [-0.6, 0.24, 0.1]];
    for (const q of ST) strata.push([q[0] + (r() - 0.5) * 0.04, q[1] * (0.9 + r() * 0.2), q[2], 0.5 + r() * 0.5]);
    // 裂纹：自山面往下，渐细
    for (let i = 0; i < 7; i++) cracks.push([-0.1 + r() * 0.85, 0.06 + r() * 0.1, (r() - 0.5) * 0.12, 0.14 + r() * 0.16]);
    for (let i = 0; i < 12; i++) { const u = r() < 0.35 ? -(0.88 + r() * 0.1) : 0.3 + r() * 0.62; scrub.push([u, 0.1 + r() * 0.6, 0.5 + r() * 0.7]); }
    for (let i = 0; i < 6; i++) rocks.push([(r() < 0.5 ? -1 : 1) * (0.72 + r() * 0.26), 0.5 + r() * 0.7]);
    // 花岗岩的斑点
    for (let i = 0; i < 70; i++) speck.push([-0.95 + r() * 1.9, 0.04 + r() * 0.9, r(), 0.5 + r()]);
    const path = [[-0.99, 0.01], [-0.95, 0.06], [-0.975, 0.1], [-0.92, 0.14], [-0.94, 0.18], [-0.89, 0.21], [-0.86, 0.235]];
    HB_MODEL = { strata, cracks, scrub, rocks, path, jit, speck };
    return HB_MODEL;
  }
  // 画的轮廓：小路、岩台是人要走的地方，不加起伏；岩壁与右坡带些嶙峋
  function hbDrawK(u, m) {
    const k = hbK(u);
    if (u < -0.12 && u > -0.97) return k;
    const f = (u + 1) * 30, i = Math.min(59, Math.max(0, Math.floor(f)));
    const j = lerp(m.jit[i], m.jit[i + 1], f - i);
    return Math.max(0, k + j * 0.05 * smoothstep(0, 0.15, k));
  }
  // 光照的档位：缓存渐变时用（日光、黄昏、昼夜、风暴稍有变化才重建）
  const shadeKey = () => Math.round(W.daylight * 48) + ':' + Math.round(W.dusk * 24) + ':' + Math.round((W.dayFactor || 0) * 24) + ':' + Math.round((W.lv.storm || 0) * 10);
  const cachedGrad = (key, build) => cachedData('g:' + key + ':' + shadeKey(), build);
  function drawHoreb(ctx) {
    const g = hbG();
    if (g < 0.004) return;
    const m = hbModel(), cx = X.horeb * W.w, hw = hbHW() * W.w, H = hbH() * g, s = LS(2), nk = nightK();
    const yAt = u => { const xf = X.horeb + u * hbHW(); return gY(2, xf) + 2 - hbDrawK(u, m) * H; };
    const yK = (u, k) => gY(2, X.horeb + u * hbHW()) + 2 - k * H;
    const N = 72;
    const a = clamp(W.lv.msHoreb * 3, 0, 1);
    // 山的轮廓只随画面大小与升起的程度而变：缓存（升起的时候不缓存）
    const gk = Math.round(g * 400), full = gk >= 400;
    const path = (key, build) => { if (full) return cachedPath(key, build); const P2 = new Path2D(); build(P2); return P2; };
    const body = path('hb:' + X.horeb, P2 => {
      for (let i = 0; i <= N; i++) { const u = -1 + 2 * i / N, X1 = cx + u * hw, Y1 = yAt(u); if (i) P2.lineTo(X1, Y1); else P2.moveTo(X1, Y1); }
      P2.lineTo(cx + hw, gY(2, X.horeb + hbHW()) + 8); P2.lineTo(cx - hw, gY(2, X.horeb - hbHW()) + 8);
      P2.closePath();
    });
    ctx.globalAlpha = a;
    // 山身：上浅下深的红色花岗岩
    const top = gY(2, X.horeb) - H, base = gY(2, X.horeb) + 4;
    const mkBody = () => {
      const gr = ctx.createLinearGradient(0, top, 0, base);
      gr.addColorStop(0, css([176, 118, 92], 2)); gr.addColorStop(0.45, css([140, 94, 76], 2)); gr.addColorStop(1, css([100, 74, 62], 2));
      return gr;
    };
    ctx.fillStyle = full ? cachedGrad('hb:' + Math.round(top) + ':' + Math.round(base), mkBody) : mkBody();
    ctx.fill(body);
    ctx.save();
    ctx.clip(body);
    // 迎光一面到背光一面：柔和的明暗
    const d = litX() >= cx ? 1 : -1;
    ctx.fillStyle = cachedGrad('hbx:' + d + ':' + Math.round(cx) + ':' + Math.round(hw), () => {
      const gx = ctx.createLinearGradient(cx - d * hw, 0, cx + d * hw, 0);
      const hi = W.shade([255, 226, 190], 0, 0.1), lo = W.shade([40, 28, 30], 0, 0);
      gx.addColorStop(0, U.rgba(lo[0], lo[1], lo[2], 0.42)); gx.addColorStop(0.45, U.rgba(lo[0], lo[1], lo[2], 0.08));
      gx.addColorStop(0.62, U.rgba(hi[0], hi[1], hi[2], 0)); gx.addColorStop(1, U.rgba(hi[0], hi[1], hi[2], 0.14 * dayA()));
      return gx;
    });
    ctx.fillRect(cx - hw, top - 4, hw * 2, base - top + 12);
    // 背光的一面（自山脊往下）
    ctx.fillStyle = css([62, 46, 44], 2, 0.34);
    ctx.beginPath();
    const u0 = d > 0 ? 0.22 : -0.1;
    ctx.moveTo(cx + u0 * hw, yAt(u0) - 4);
    for (let i = 0; i <= 18; i++) { const u = u0 - d * (i / 18) * (1 + d * u0); ctx.lineTo(cx + u * hw, yAt(u) - 4); }
    ctx.lineTo(cx - d * hw, gY(2, X.horeb - d * hbHW()) + 10);
    ctx.quadraticCurveTo(cx + (u0 - d * 0.3) * hw, gY(2, X.horeb) - H * 0.25, cx + u0 * hw, yAt(u0) - 4);
    ctx.fill();
    // 岩层：顺着山面的长条，两头尖（暗的一道，其上一线亮）
    const sliver = (P2, q, off, wid) => {
      const n = 12;
      const pt = (t, w) => { const u = q[0] - q[2] / 2 + q[2] * t, k = hbK(u); return [cx + u * hw, yK(u, Math.max(0, k - q[1] * 0.42)) + off + w]; };
      for (let i = 0; i <= n; i++) { const p = pt(i / n, 0); if (i) P2.lineTo(p[0], p[1]); else P2.moveTo(p[0], p[1]); }
      for (let i = n; i >= 0; i--) { const t = i / n, p = pt(t, wid * Math.sin(Math.PI * t)); P2.lineTo(p[0], p[1]); }
      P2.closePath();
    };
    ctx.fillStyle = css([74, 50, 44], 2, 0.34);
    ctx.fill(path('hbst:' + X.horeb, P2 => { for (const q of m.strata) sliver(P2, q, 0, 2.2 * s * q[3] + 0.6); }));
    ctx.fillStyle = css([236, 196, 164], 2, 0.2 * dayA(), 0.12);
    ctx.fill(path('hbsh:' + X.horeb, P2 => { for (const q of m.strata) sliver(P2, q, -1.3 * s, 1.1 * s * q[3] + 0.4); }));
    // 裂纹：自山面往下，渐细
    ctx.fillStyle = css([60, 42, 38], 2, 0.4);
    ctx.fill(path('hbcr:' + X.horeb, P2 => {
      for (const q of m.cracks) {
        const k = hbK(q[0]);
        if (k < 0.45) continue;
        const x0 = cx + q[0] * hw, y0 = yK(q[0], k - q[1]), L = q[3] * H, w = 1.1 * s;
        const x1 = x0 + q[2] * hw, y1 = y0 + L;
        P2.moveTo(x0 - w, y0); P2.quadraticCurveTo(x0 + q[2] * hw * 0.5 - w * 0.4, y0 + L * 0.5, x1, y1);
        P2.quadraticCurveTo(x0 + q[2] * hw * 0.5 + w * 0.4, y0 + L * 0.5, x0 + w, y0); P2.closePath();
      }
    }));
    // 花岗岩的斑点
    for (const pass of [0, 1]) {
      ctx.fillStyle = pass ? css([232, 206, 180], 2, 0.3 * dayA(), 0.1) : css([70, 50, 46], 2, 0.3);
      ctx.fill(path('hbsp' + pass + ':' + X.horeb, P2 => {
        for (let i = pass; i < m.speck.length; i += 2) {
          const q = m.speck[i], k = hbK(q[0]);
          if (k < 0.08) continue;
          const x = cx + q[0] * hw, y = yK(q[0], k * (1 - q[1])) + 3, r = (0.5 + 0.6 * q[3]) * s;
          P2.moveTo(x + r, y); P2.ellipse(x, y, r, r * 0.7, 0, 0, TAU);
        }
      }));
    }
    // 火光照在岩壁上（荆棘燃烧时）：只照在山上
    const b = getP('bush');
    if (b && b.fire > 0.01) {
      SP || sprites();
      const bx = b.x * W.w, by = surfY(b.x), fk = b.fire * a;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.fire, bx + 10 * s, by - 34 * s, 170 * s, fk * (0.22 + 0.5 * nk));
      glowSp(ctx, SP.gold, bx + 4 * s, by - 18 * s, 70 * s, fk * (0.16 + 0.36 * nk));
      ctx.globalCompositeOperation = 'source-over';
    }
    // 圣地（3:5）：岩台上一片金色的地光——只在山身里（照在台面与其下的岩上）
    const hk = W.lv.msHoly;
    if (hk > 0.01) {
      SP || sprites();
      const hxf = HU((TERR0 + BU) / 2 + 0.04), hx = hxf * W.w, hy = surfY(hxf);
      const rr = (BU - TERR0) * 0.62 * hw * (1 + 0.04 * Math.sin(W.t * 1.3));
      ctx.globalCompositeOperation = 'lighter';
      ctx.save();
      ctx.translate(hx, hy);
      ctx.scale(1, 0.34);
      glowSp(ctx, SP.gold, 0, 0, rr, a * hk * (0.5 + 0.35 * nk));
      ctx.restore();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = a;
    // 岩台：一道迎光的平边；圣地时是金色的
    const terr = path('hbt:' + X.horeb, P2 => {
      for (let i = 0; i <= 16; i++) { const u = TERR0 + (TERR1 - TERR0) * i / 16; if (i) P2.lineTo(cx + u * hw, yAt(u) + 0.6); else P2.moveTo(cx + u * hw, yAt(u) + 0.6); }
    });
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([226, 184, 150], 2, 0.5 * (0.35 + 0.65 * Math.max(dayA(), (b ? b.fire : 0) * nk)), 0.15); ctx.lineWidth = Math.max(0.8, 1.4 * s);
    ctx.stroke(terr);
    if (hk > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 214, 140, a * hk * (0.35 + 0.35 * nk)); ctx.lineWidth = Math.max(1, 1.8 * s);
      ctx.stroke(terr);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 上山的小路（左脚）
    ctx.strokeStyle = css([214, 184, 150], 2, 0.35 * dayA(), 0.08); ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    m.path.forEach((q, i) => { const X1 = cx + q[0] * hw, Y1 = yK(q[0], Math.min(q[1], hbK(q[0]) * 0.94)); if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.stroke();
    // 灌木
    ctx.fillStyle = css([62, 68, 42], 2);
    ctx.beginPath();
    for (const q of m.scrub) {
      const k = hbK(q[0]);
      if (k < 0.1) continue;
      const yy = yK(q[0], Math.min(q[1], k - 0.03)), rr = 2.8 * s * q[2];
      ctx.moveTo(cx + q[0] * hw + rr, yy); ctx.ellipse(cx + q[0] * hw, yy, rr, rr * 0.7, 0, 0, TAU);
    }
    ctx.fill();
    // 山脚的大石
    ctx.fillStyle = css([124, 94, 80], 2);
    ctx.beginPath();
    for (const q of m.rocks) { const xf = X.horeb + q[0] * hbHW(), x = xf * W.w, yy = gY(2, xf) + 2, rr = 7 * s * q[1] * g; ctx.moveTo(x + rr * 1.3, yy); ctx.ellipse(x, yy, rr * 1.3, rr, 0, Math.PI, 0); }
    ctx.fill();
    // 迎光的山脊；夜里是一道冷的月光边
    ctx.strokeStyle = css([240, 206, 170], 2, 0.5 * dayA(), 0.25); ctx.lineWidth = Math.max(0.7, 1.3 * s);
    const ridge = path('hbr:' + X.horeb + ':' + d, P2 => {
      for (let i = 0; i <= 30; i++) { const u = d > 0 ? -0.14 + 1.1 * i / 30 : 0.26 - 1.14 * i / 30; if (i) P2.lineTo(cx + u * hw, yAt(u)); else P2.moveTo(cx + u * hw, yAt(u)); }
    });
    ctx.stroke(ridge);
    if (nk > 0.2) { ctx.strokeStyle = U.rgba(176, 194, 232, 0.28 * nk * a); ctx.stroke(ridge); }
    ctx.globalAlpha = 1;
  }

  // 荆棘：一丛圆顶的多刺灌木（在山上的岩台）——枝、刺、叶，以 R 为单位，y 向上为负
  let BUSH = null;
  function bushModel() {
    if (BUSH) return BUSH;
    const r = U.mulberry32(777), br = [], leaves = [], crown = [];
    const dome = a => [Math.sin(a) * 0.95, -0.28 - Math.cos(a) * 1.02];      // 圆顶上的一点
    for (let i = 0; i < 9; i++) {
      const a = -1.2 + 2.4 * (i / 8) + (r() - 0.5) * 0.18, bx = (r() - 0.5) * 0.22;
      const tip = dome(a), k = 0.86 + r() * 0.16, x1 = tip[0] * k, y1 = tip[1] * k;
      const mx = bx + (x1 - bx) * 0.35 + (r() - 0.5) * 0.1, my = y1 * 0.45;
      br.push([bx, 0, mx, my, x1, y1, 1]);
      for (let j = 0; j < 3; j++) {
        const t = 0.35 + j * 0.2 + r() * 0.08, px = qb(bx, mx, x1, t), py = qb(0, my, y1, t);
        const sa = Math.atan2(x1 - bx, -(y1)) + (r() < 0.5 ? -1 : 1) * (0.55 + r() * 0.4), L = 0.18 + r() * 0.18;
        br.push([px, py, px + Math.sin(sa) * L * 0.5, py - Math.cos(sa) * L * 0.5, px + Math.sin(sa) * L, py - Math.cos(sa) * L, 0]);
      }
    }
    for (let i = 0; i < 30; i++) {
      const a = (r() - 0.5) * 2.5, d = Math.sqrt(r()), p = dome(a);
      leaves.push([p[0] * d * 0.95, -0.12 + (p[1] + 0.12) * (0.35 + 0.65 * d), 0.07 + r() * 0.07, r() * 3]);
    }
    for (let i = 0; i < 13; i++) { const a = -1.15 + 2.3 * (i / 12) + (r() - 0.5) * 0.08; crown.push(dome(a).concat([0.6 + r() * 0.55, r() * 10, 0.8 + r() * 0.5])); }
    BUSH = { br, leaves, crown };
    return BUSH;
  }
  const bushS = p => LS(2) * p.size * 1.25;
  function bushTwigs(ctx, x, y, R, s, m) {
    ctx.beginPath();
    for (const q of m.br) { ctx.moveTo(x + q[0] * R, y + q[1] * R); ctx.quadraticCurveTo(x + q[2] * R, y + q[3] * R, x + q[4] * R, y + q[5] * R); }
    ctx.stroke();
  }
  function drawBush(ctx, p) {
    const vis = p.a * smoothstep(0.55, 0.95, W.lv.msHoreb);
    if (vis < 0.01) return;
    const s = bushS(p), x = p.x * W.w, y = surfY(p.x) + 1 * s, R = 15 * s, m = bushModel();
    ctx.globalAlpha = vis;
    ctx.lineCap = 'round';
    ctx.strokeStyle = css([56, 44, 36], 2);
    ctx.lineWidth = Math.max(0.7, 1.3 * s);
    bushTwigs(ctx, x, y, R, s, m);
    ctx.fillStyle = css([60, 76, 44], 2);
    ctx.beginPath();
    for (const q of m.leaves) { ctx.moveTo(x + q[0] * R + q[2] * R, y + q[1] * R); ctx.ellipse(x + q[0] * R, y + q[1] * R, q[2] * R, q[2] * R * 0.7, q[3], 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 火：火舌根在荆棘丛里，底宽顶尖，外侧的顺着圆顶向外斜；各层以竖向的渐变着色（白金的焰心 → 橙 → 顶上透明的红），
  // 先画在一张小的离屏画布上，再以微微的模糊贴上，边缘柔和；枝与叶的剪影始终在火里（3:2 却没有烧毁）
  let flareT = -99;
  const FIRE = { c: null, g: null, w: 0, h: 0, grad: null, gk: '' };
  const FLAY = [      // [尺度, 渐变停点 [位置, r, g, b, a] …]（自火根往上）
    [1, [[0, 255, 150, 60, 0.85], [0.4, 255, 104, 36, 0.72], [0.75, 214, 54, 24, 0.3], [1, 170, 30, 16, 0]]],
    [0.78, [[0, 255, 196, 92, 1], [0.45, 255, 150, 58, 0.75], [0.85, 255, 110, 40, 0]]],
    [0.56, [[0, 255, 238, 170, 1], [0.4, 255, 206, 110, 0.8], [0.8, 255, 170, 70, 0]]],
    [0.34, [[0, 255, 255, 244, 1], [0.35, 255, 246, 206, 0.85], [0.7, 255, 226, 160, 0]]],
  ];
  function fireCanvas(w, h) {
    if (!FIRE.c || FIRE.w !== w || FIRE.h !== h) { FIRE.c = cnv(w, h); FIRE.w = w; FIRE.h = h; FIRE.g = FIRE.c.getContext('2d'); FIRE.grad = null; FIRE.gk = ''; }
    return FIRE;
  }
  function drawBushFire(ctx, p) {
    const k = p.fire * p.a * smoothstep(0.55, 0.95, W.lv.msHoreb);
    if (k < 0.01) return;
    SP || sprites();
    const s = bushS(p), x = p.x * W.w, y = surfY(p.x) + 1 * s, R = 15 * s, m = bushModel();
    const fl = Math.max(0, 1 - (W.t - flareT) / 2.2), boost = 1 + 0.5 * fl * fl;
    const FR = R * (1 + 0.3 * k);                             // 火的半宽
    const H = 46 * s * (0.4 + 0.6 * k) * boost;                // 火舌高出丛顶多少
    const Hn = 46 * s + 1.4 * R;                               // 渐变的全高（不随闪动而变，好缓存）
    const nk = nightK(), cy = y - 0.75 * R;
    // 离屏画布：够最高、最斜的火舌
    const pad = Math.ceil(6 * s + 4);
    const cw = Math.ceil(FR * 3.4 + pad * 2), chh = Math.ceil(46 * s * 1.95 + 2 * R + pad * 2);
    const F = fireCanvas(cw, chh), g = F.g;
    const ox = cw / 2, oy = chh - pad;                          // 荆棘的根处
    const gkey = cw + 'x' + chh + ':' + Math.round(Hn);
    if (F.gk !== gkey) {
      F.grad = FLAY.map(L => {
        const y0 = oy - 0.2 * R, gr = g.createLinearGradient(0, y0, 0, y0 - Hn * (0.55 + 0.45 * L[0]));
        for (const q of L[1]) gr.addColorStop(q[0], U.rgba(q[1], q[2], q[3], q[4]));
        return gr;
      });
      F.gk = gkey;
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = 1;
    g.clearRect(0, 0, cw, chh);
    for (let li = 0; li < FLAY.length; li++) {
      const sc = FLAY[li][0];
      g.fillStyle = F.grad[li];
      g.beginPath();
      for (let i = 0; i < m.crown.length; i++) {
        const q = m.crown[i], ph = q[3];
        if (li === 3 && (i < 2 || i > 10)) continue;
        const f = 0.8 + 0.2 * Math.sin(W.t * (8 + q[4] * 4) + ph) + 0.1 * Math.sin(W.t * 21 + ph * 2);
        const up = 1 - Math.pow(Math.abs(q[0]), 1.4) * 0.72;       // 中间的火舌最高，两旁渐低：外形是一团向上收尖的火
        const hh = (H * q[2] * f * up + R * 0.6 * up) * sc;
        // 根在圆顶之内、高低不一（没有平平的底）；底宽，顶尖；外侧的向外斜
        const bx = ox + q[0] * FR * 0.8 * (0.6 + 0.4 * sc);
        const by = oy + q[1] * R * 0.55 * (0.7 + 0.3 * sc) + (rt(i * 7 + 500) - 0.5) * 0.4 * R;
        const w = FR * (0.24 + 0.1 * rt(i * 7 + 501)) * (0.55 + 0.45 * sc);
        const tipx = bx + q[0] * R * 0.7 * sc + Math.sin(W.t * 6 + ph) * w * 0.7 + W.wind * 2 * s;
        const ty = by - hh;
        g.moveTo(bx - w, by);
        g.bezierCurveTo(bx - w * 1.1, by - hh * 0.4, tipx - w * 0.2, ty + hh * 0.3, tipx, ty);
        g.bezierCurveTo(tipx + w * 0.2, ty + hh * 0.3, bx + w * 1.1, by - hh * 0.4, bx + w, by);
        g.quadraticCurveTo(bx, by + w * 0.9, bx - w, by);
        g.closePath();
      }
      // 离开火舌、往上飘散的小焰（外两层）
      if (li < 2) {
        for (let j = 0; j < 5; j++) {
          const ph = U.fract(W.t * (0.7 + 0.3 * rt(j + 540)) + rt(j + 541));
          const bx = ox + (rt(j + 542) - 0.5) * FR * 1.1 + Math.sin(W.t * 3 + j) * R * 0.2, by = oy - 1.2 * R - H * (0.35 + 0.75 * ph);
          const w = R * 0.16 * (1 - ph) * sc, hh = R * 0.7 * (1 - ph * 0.5) * sc;
          if (w < 0.3) continue;
          g.moveTo(bx - w, by); g.quadraticCurveTo(bx - w, by - hh * 0.5, bx, by - hh); g.quadraticCurveTo(bx + w, by - hh * 0.5, bx + w, by); g.quadraticCurveTo(bx, by + w, bx - w, by);
        }
      }
      g.fill();
    }
    const X0 = x - ox, Y0 = y - oy, hasF = 'filter' in ctx;
    ctx.save();
    // 大的暖光与丛中的光
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.fire, x, cy - H * 0.3, (R + H) * 1.8, k * (0.24 + 0.4 * nk) * boost);
    glowSp(ctx, SP.gold, x, cy, R * 1.35, k * 0.45);
    // 火身（微模糊，边缘柔和）
    ctx.globalCompositeOperation = 'source-over';
    if (hasF) ctx.filter = 'blur(' + Math.max(0.6, 0.75 * s).toFixed(2) + 'px)';
    ctx.globalAlpha = k * 0.94;
    ctx.drawImage(F.c, X0, Y0);
    // 一层泛光
    ctx.globalCompositeOperation = 'lighter';
    if (hasF) ctx.filter = 'blur(' + Math.max(1.5, 3.2 * s).toFixed(1) + 'px)';
    ctx.globalAlpha = k * (0.3 + 0.25 * nk);
    ctx.drawImage(F.c, X0, Y0);
    if (hasF) ctx.filter = 'none';
    glowSp(ctx, SP.white, x, cy - R * 0.1, R * 0.9, k * (0.34 + 0.14 * Math.sin(W.t * 3.1)));
    ctx.globalCompositeOperation = 'source-over';
    // 枝与叶的剪影仍在火中：暗枝，叶边一点青
    ctx.lineCap = 'round';
    ctx.globalAlpha = k * 0.66;
    ctx.strokeStyle = 'rgb(70,28,14)';
    ctx.lineWidth = Math.max(0.7, 1.15 * s);
    bushTwigs(ctx, x, y, R, s, m);
    ctx.globalAlpha = k * 0.52;
    ctx.fillStyle = 'rgb(58,70,34)';
    ctx.beginPath();
    for (const q of m.leaves) { ctx.moveTo(x + q[0] * R + q[2] * R * 0.8, y + q[1] * R); ctx.ellipse(x + q[0] * R, y + q[1] * R, q[2] * R * 0.8, q[2] * R * 0.55, q[3], 0, TAU); }
    ctx.fill();
    // 火星
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,214,150)';
    for (let i = 0; i < 18; i++) {
      const ph = U.fract(W.t * (0.32 + 0.2 * rt(i * 5 + 300)) + rt(i * 5 + 301));
      const sx = x + (rt(i * 5 + 302) - 0.5) * R * 1.6 + Math.sin(ph * 7 + i) * R * 0.3 * ph + W.wind * ph * 20 * s;
      const sy = cy - R * 0.6 - ph * (H + R) * 1.8;
      ctx.globalAlpha = k * Math.sin(ph * Math.PI) * 0.85;
      const sz = (0.8 + rt(i) * 1.2) * Math.max(0.7, s);
      ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 火光照在人身上（画在人之后，柔和）
  function drawBushLight(ctx) {
    const p = getP('bush');
    if (!p) return;
    const k = p.fire * p.a * smoothstep(0.55, 0.95, W.lv.msHoreb);
    if (k < 0.01) return;
    SP || sprites();
    const s = bushS(p), x = p.x * W.w, y = surfY(p.x);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, x, y - 16 * s, 80 * s, k * (0.12 + 0.22 * nightK()));
    // 夜里，火上一道淡淡的光柱
    const nk = nightK();
    if (nk > 0.2) {
      ctx.globalAlpha = k * 0.12 * nk;
      const w = 34 * s;
      ctx.drawImage(SP.beam, x - w / 2, y - W.h * 0.5, w, W.h * 0.5 - 8 * s);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 脱下的鞋（3:5）
  function drawSandals(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, y = surfY(p.x) + 0.5 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([74, 54, 38], 2);
    ctx.beginPath(); ctx.ellipse(x - 2 * s, y, 2.4 * s, 0.9 * s, -0.1, 0, TAU); ctx.ellipse(x + 2.2 * s, y + 0.3 * s, 2.4 * s, 0.9 * s, 0.1, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 杖与蛇（4:3–4）：丢在地上的杖化作蛇，蜿蜒而行；拿住尾巴，又在手中变为杖
  function drawSerpent(ctx, p) {
    const s = LS(2) * p.size, x = p.x * W.w, m = p.morph, dir = p.fd || 1;
    ctx.globalAlpha = p.a;
    const N = 18, L = 11 * s;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, xx = x + (t - 0.5) * 2 * L * (1 - 0.15 * m) * dir;
      const wv = Math.sin(t * 9 - W.t * 6) * 1.7 * s * m * (0.4 + 0.6 * t);
      const yy = surfY(xx / W.w) - 1 * s - wv - (1 - m) * (t * 1.2 * s);
      pts.push([xx + Math.cos(t * 9 - W.t * 6) * 0.8 * s * m, yy]);
    }
    const col = U.mixRGB([112, 84, 56], [66, 72, 42], m);
    ctx.strokeStyle = css(col, 2);
    ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const t = i / N;
      ctx.lineWidth = Math.max(0.8, (1.4 + 1.2 * m * Math.sin(Math.PI * Math.min(1, t * 1.3))) * s);
      ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
    }
    // 头（蛇）或杖头的弯（杖）
    const hd = pts[N];
    if (m > 0.3) {
      ctx.fillStyle = css([58, 64, 38], 2, clamp((m - 0.3) * 2, 0, 1));
      ctx.beginPath(); ctx.ellipse(hd[0] + dir * 1.2 * s, hd[1] - 0.6 * s * m, 2.4 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
    }
    if (m < 0.7) {
      ctx.strokeStyle = css([112, 84, 56], 2, clamp((0.7 - m) * 2, 0, 1)); ctx.lineWidth = Math.max(0.8, 1.4 * s);
      ctx.beginPath(); ctx.arc(hd[0] - dir * 1.5 * s, hd[1] - 1.8 * s, 1.8 * s, 0, Math.PI * 1.2); ctx.stroke();
    }
    // 鳞上的光
    if (m > 0.2) {
      ctx.globalAlpha = p.a * m * 0.5 * (0.4 + 0.6 * Math.max(W.daylight, nightK() * 0.6));
      ctx.strokeStyle = 'rgb(220,230,180)'; ctx.lineWidth = Math.max(0.4, 0.5 * s);
      ctx.beginPath();
      for (let i = 2; i < N; i += 2) { ctx.moveTo(pts[i][0], pts[i][1] - 0.9 * s); ctx.lineTo(pts[i + 1][0], pts[i + 1][1] - 0.9 * s); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：埃及的地、尼罗河、米甸的旷野、天上的尘
  // ════════════════════════════════════════════════════════════
  const SAND = [[206, 180, 140], [214, 182, 134], [222, 188, 132]];
  const WILD = [[170, 132, 112], [172, 124, 96], [176, 124, 92]];
  const XW = [0.8, 0.79, 0.785];              // 沙地与旷野的分界（远 / 中 / 近）
  let geoKey = '', GEO = null;
  function geo() {
    const k = W.w + 'x' + W.h + ':' + Math.round((W.lv.land || 0) * 64);
    if (k !== geoKey || !GEO) { geoKey = k; GEO = { path: new Map(), data: new Map(), nileY0: gY(2, X.nileT) }; }
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
    if (!d) { d = build(); G.data.set(key, d); if (G.data.size > 64) G.data.delete(G.data.keys().next().value); }
    return d;
  }
  function landPath(l, x0f, x1f, N) {
    return cachedPath('land' + l + ':' + x0f + ':' + x1f + ':' + N, P2 => {
      const bot = l === 2 ? W.h + 6 : W.waterlineY(l);
      for (let i = 0; i <= N; i++) {
        const xf = lerp(x0f, x1f, i / N), y = Math.min(gY(l, xf), bot);
        if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y);
      }
      P2.lineTo(x1f * W.w, bot); P2.lineTo(x0f * W.w, bot); P2.closePath();
    });
  }
  function drawGround(ctx, l) {
    const e = W.lv.msEgypt;
    if (e < 0.01) return;
    const xb = XW[l], dep = DEP(l), A = 0.86 * e;
    ctx.fillStyle = cachedGrad('gr' + l + ':' + Math.round(e * 32), () => {
      const cs = W.shade(SAND[l], dep, 0.06), cw = W.shade(WILD[l], dep, 0.03);
      const g = ctx.createLinearGradient(0, 0, W.w, 0);
      g.addColorStop(0, U.rgba(cs[0], cs[1], cs[2], A)); g.addColorStop(clamp(xb - 0.04, 0, 1), U.rgba(cs[0], cs[1], cs[2], A));
      g.addColorStop(clamp(xb + 0.04, 0, 1), U.rgba(cw[0], cw[1], cw[2], A)); g.addColorStop(1, U.rgba(cw[0], cw[1], cw[2], A));
      return g;
    });
    ctx.fill(landPath(l, 0.2, 1.0, l === 2 ? 56 : 40));
    // 亮边
    const hi = W.shade([252, 226, 178], dep, 0.2);
    ctx.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.45 * e * dayA());
    ctx.lineWidth = Math.max(0.6, 1.1 * LS(l));
    ctx.stroke(cachedPath('rim' + l, P2 => {
      for (let i = 0; i <= 40; i++) { const xf = lerp(0.3, 1, i / 40), y = gY(l, xf); if (i) P2.lineTo(xf * W.w, y + 0.8); else P2.moveTo(xf * W.w, y + 0.8); }
    }));
    if (l === 2) {
      // 风纹（沙地）与石砾（旷野）
      const dk = W.shade([170, 136, 92], 0, 0);
      ctx.strokeStyle = U.rgba(dk[0], dk[1], dk[2], 0.2 * e);
      ctx.lineWidth = Math.max(0.6, 1.4 * LS(2));
      ctx.stroke(cachedPath('wind', P2 => {
        for (let k = 0; k < 7; k++) {
          const v = 0.14 + k * 0.12, ph = rt(k * 11) * 6;
          for (let i = 0; i <= 22; i++) {
            const xf = lerp(0.56 + k * 0.006, 0.78, i / 22), y = fieldY(xf, v) + Math.sin(xf * 34 + ph) * 3 * LS(2);
            if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y);
          }
        }
      }));
      ctx.fillStyle = W.shadeCSS([112, 84, 66], 0, 0.55 * e);
      ctx.fill(cachedPath('stones', P2 => {
        for (let i = 0; i < 40; i++) {
          const xf = lerp(0.8, 1, rt(i * 3 + 60)), v = rt(i * 3 + 61) * 0.9, y = fieldY(xf, v), r = (0.8 + 1.8 * rt(i * 3 + 62)) * LS(2) * (1 + v);
          P2.moveTo(xf * W.w + r, y); P2.ellipse(xf * W.w, y, r, r * 0.5, 0, Math.PI, TAU);
        }
      }));
      // 歌珊：一片浅浅的草色
      ctx.fillStyle = cachedGrad('goshen:' + Math.round(e * 32), () => {
        const gc = W.shade([118, 146, 78], 0, 0.02);
        const gg = ctx.createLinearGradient(0, 0, W.w, 0);
        gg.addColorStop(clamp(X.goshen0 - 0.03, 0, 1), U.rgba(gc[0], gc[1], gc[2], 0)); gg.addColorStop(X.goshen0 + 0.02, U.rgba(gc[0], gc[1], gc[2], 0.34 * e));
        gg.addColorStop(X.goshen1 - 0.02, U.rgba(gc[0], gc[1], gc[2], 0.34 * e)); gg.addColorStop(clamp(X.goshen1 + 0.02, 0, 1), U.rgba(gc[0], gc[1], gc[2], 0));
        return gg;
      });
      ctx.fill(landPath(2, X.goshen0 - 0.03, X.goshen1 + 0.02, 20));
      // 歌珊与旷野之间：一道乱石与低低的沙丘（出了埃及，就是米甸的旷野）
      ctx.fillStyle = W.shadeCSS([196, 162, 120], 0, 0.9 * e, 0.04);
      ctx.fill(cachedPath('dunes', P2 => {
        for (let j = 0; j < 3; j++) {
          const a0 = lerp(X.edge0, X.edge1, j / 3) - 0.004, a1 = a0 + 0.016 + 0.006 * rt(j + 90), v = 0.06 + 0.1 * j;
          const N2 = 10;
          for (let i = 0; i <= N2; i++) { const xf = lerp(a0, a1, i / N2), y = fieldY(xf, v) - Math.sin(Math.PI * i / N2) * (3 + 1.5 * j) * LS(2); if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y); }
          P2.closePath();
        }
      }));
      ctx.fillStyle = W.shadeCSS([118, 92, 74], 0, e, 0.02);
      ctx.fill(cachedPath('edgeRocks', P2 => {
        for (let i = 0; i < 11; i++) {
          const xf = lerp(X.edge0, X.edge1, rt(i * 3 + 130)), v = rt(i * 3 + 131) * 0.5, y = fieldY(xf, v) + 1, r = (1.4 + 2.4 * rt(i * 3 + 132)) * LS(2) * (1 + 0.6 * v);
          P2.moveTo(xf * W.w + r * 1.25, y); P2.ellipse(xf * W.w, y, r * 1.25, r, 0, Math.PI, TAU);
        }
      }));
    }
  }
  // 尼罗河：自远处的地的轮廓流向观者；两岸是青绿的田与芦荻
  function nilePt(t) {
    const x0 = X.nileT * W.w, y0 = geo().nileY0 + 0.5, x3 = 0.478 * W.w, y3 = W.h + 8;
    const x1 = 0.5 * W.w, y1 = lerp(y0, y3, 0.38), x2 = 0.552 * W.w, y2 = lerp(y0, y3, 0.72), u = 1 - t;
    const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2), L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const nileW = (t, k) => (0.006 + 0.07 * Math.pow(t, 1.4)) * W.w * k;
  function drawNile(ctx) {
    const k = W.lv.msNile;
    if (k < 0.01) return;
    const N = 26, dark = W.lv.msDark, s = LS(2);
    const edge = (mul, add) => cachedPath('nile:' + mul + ':' + add.toFixed(2), P2 => {
      const Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) { const t = i / N, p = nilePt(t), w = nileW(t, 1) * mul / 2 + add * (0.3 + t); Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
      for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
      P2.closePath();
    });
    // 两岸的青田
    ctx.globalAlpha = Math.min(1, k * 1.4) * 0.5;
    ctx.fillStyle = css([106, 138, 70], 2);
    ctx.fill(edge(2.6, 12 * s));
    // 泥滩
    ctx.globalAlpha = Math.min(1, k * 1.4) * 0.8;
    ctx.fillStyle = css([118, 98, 68], 2);
    ctx.fill(edge(1.28, 2.5 * s));
    // 水（法老的命令之后暗沉）
    const y0 = geo().nileY0, y2 = W.h, dq = Math.round(dark * 32) / 32;
    ctx.fillStyle = cachedGrad('nile:' + dq, () => {
      const top = W.shade(U.mixRGB([150, 186, 196], [70, 74, 92], dq), 0.45, 0.05), bot = W.shade(U.mixRGB([44, 100, 122], [26, 30, 44], dq), 0, 0.02);
      const gr = ctx.createLinearGradient(0, y0, 0, y2);
      gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
      return gr;
    });
    ctx.globalAlpha = Math.min(1, k * 1.4);
    ctx.fill(edge(1, 0));
    // 法老的命令（1:22）：一道冷黑自上游顺流而下，河面暗了，倒影全无
    if (dark > 0.01) {
      const f = Math.round(clamp(dark * 1.25, 0, 1) * 40) / 40;
      ctx.fillStyle = cachedData('nileInk:' + f + ':' + Math.round(y0), () => {
        const g = ctx.createLinearGradient(0, y0, 0, y2);
        g.addColorStop(0, 'rgba(6,8,18,0.72)');
        if (f < 1) { g.addColorStop(Math.max(0, f - 0.14), 'rgba(6,8,18,0.72)'); g.addColorStop(f, 'rgba(6,8,18,0)'); }
        else g.addColorStop(1, 'rgba(6,8,18,0.72)');
        return g;
      });
      ctx.fill(edge(1, 0));
    }
    // 天光的倒影（夜里是月光）
    const night = W.night > 0.5;
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = (night ? 0.35 * W.lv.moon : 0.45 * W.daylight) * k * (1 - dark);
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        for (let i = band; i < 26; i += 3) {
          const t = U.fract(rt(i * 5 + 700) + W.t * 0.018 * (0.7 + 0.6 * rt(i * 5 + 701)));
          if (t < 0.02) continue;
          const p = nilePt(t), w = nileW(t, 1) / 2, off = (rt(i * 5 + 702) * 2 - 1) * 0.7 * w, len = w * (0.25 + 0.3 * rt(i * 5 + 703));
          const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off;
          ctx.moveTo(cx - len, cy); ctx.lineTo(cx + len, cy);
        }
        ctx.globalAlpha = ga * (0.35 + 0.3 * band) * (0.6 + 0.4 * Math.sin(W.t * (0.7 + band * 0.37) + band * 2.1));
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 芦荻
    ctx.globalAlpha = Math.min(1, k * 1.4);
    ctx.strokeStyle = css([88, 124, 62], 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    const nR = (W.quality || 1) < 0.75 ? 36 : 72;
    const R = cachedData('reeds', () => {
      const out = [];
      for (let i = 0; i < 72; i++) {
        const t = 0.06 + 0.92 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = nilePt(t), w = nileW(t, 1) * 0.6 + 2 * s;
        out.push([p[0] + p[2] * w * side, p[1] + p[3] * w * side, (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t)]);
      }
      return out;
    });
    ctx.beginPath();
    const ws = W.wind * 1.5 * s;
    for (let i = 0; i < nR; i++) {
      const q = R[i], sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + sw * 0.3, q[1] - q[2] * 0.6, q[0] + sw, q[1] - q[2]);
    }
    ctx.stroke();
    // 纸草的伞形穗
    ctx.fillStyle = css([120, 150, 76], 2, 0.9);
    ctx.beginPath();
    for (let i = 0; i < nR; i += 3) { const q = R[i], sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s; ctx.moveTo(q[0] + sw + 1.6 * s, q[1] - q[2]); ctx.ellipse(q[0] + sw, q[1] - q[2], 1.6 * s, 0.9 * s, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 天上：埃及的暖色尘雾
  function drawSkyHaze(ctx) {
    const e = W.lv.msEgypt;
    if (e < 0.01) return;
    const hz = W.horizonY, top = hz - W.h * 0.34;
    const a = 0.14 * e * (0.35 + 0.65 * W.daylight);
    if (a < 0.004) return;
    const aq = Math.round(a * 400) / 400;
    ctx.fillStyle = cachedData('skyHaze:' + aq + ':' + Math.round(top), () => {
      const g = ctx.createLinearGradient(0, top, 0, hz + 4);
      g.addColorStop(0, 'rgba(246,210,156,0)'); g.addColorStop(1, U.rgba(246, 210, 156, aq));
      return g;
    });
    ctx.fillRect(0, top, W.w, hz - top + 4);
  }

  // ════════════════════════════════════════════════════════════
  //  画：哀声、应许之地、同在的光、眷顾
  // ════════════════════════════════════════════════════════════
  // 哀声达于神（2:23）：自砖场与小屋升起的微光，渐渐聚向天上的一处
  function drawCry(ctx) {
    const k = W.lv.msCry;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU(), top = W.h * (0.14 + skyDY()), cxT = 0.7 * W.w;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 48; i++) {
      const x0 = lerp(0.6, 0.79, rt(i * 3 + 2000));
      const ph = U.fract(W.t * (0.045 + 0.03 * rt(i * 3 + 2001)) + rt(i * 3 + 2002));
      const gy = gY(2, x0) - 24 * LS(2);
      const y = lerp(gy, top, ph), x = lerp(x0 * W.w, cxT, ph * ph) + Math.sin(ph * 7 + i) * 10 * u * (1 - ph);
      const a = k * Math.sin(ph * Math.PI) * (0.3 + 0.55 * nightK());
      glowSp(ctx, SP.pale, x, y, 6 * u, a * 0.7);
      ctx.globalAlpha = a; ctx.fillStyle = 'rgb(236,236,255)';
      ctx.fillRect(x - 0.9 * u, y - 0.9 * u, 1.8 * u, 1.8 * u);
    }
    glowSp(ctx, SP.pale, cxT, top, 26 * u, k * 0.35 * (0.3 + 0.7 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 流奶与蜜之地（3:8）：远方的山地泛起金绿的光
  function drawPromiseFar(ctx) {
    const k = W.lv.msPromise;
    if (k < 0.01) return;
    SP || sprites();
    const c = W.shade([150, 190, 96], DEP(0), 0.3);
    const g = ctx.createLinearGradient(0.5 * W.w, 0, W.w, 0);
    g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(0.35, U.rgba(c[0], c[1], c[2], 0.5 * k)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], 0.6 * k));
    ctx.fillStyle = g;
    ctx.fill(landPath(0, 0.5, 1.0, 40));
    ctx.globalCompositeOperation = 'lighter';
    const u = SU();
    for (let i = 0; i < 40; i++) {
      const xf = lerp(0.58, 1, rt(i * 3 + 2500)), y = gY(0, xf) + rt(i * 3 + 2501) * 8 * u, tw = 0.5 + 0.5 * Math.sin(W.t * (0.8 + rt(i * 3 + 2502) * 1.6) + i);
      ctx.globalAlpha = k * tw * 0.8; ctx.fillStyle = 'rgb(255,236,170)';
      ctx.fillRect(xf * W.w - 0.9 * u, y - 0.9 * u, 1.8 * u, 1.8 * u);
    }
    glowSp(ctx, SP.gold, 0.84 * W.w, gY(0, 0.84), M() * 0.3, k * (0.18 + 0.25 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawPromiseNear(ctx) {
    const k = W.lv.msPromise;
    if (k < 0.01) return;
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 70; i++) {
      const f = rt(i * 4 + 1200), xf = lerp(0.6, 1.0, f), v = 0.2 + 0.1 * Math.sin(f * 7) + (rt(i * 4 + 1201) - 0.5) * 0.08;
      const y = fieldY(xf, v), tw = 0.5 + 0.5 * Math.sin(W.t * (0.8 + rt(i * 4 + 1202) * 1.6) + i * 2.3);
      const reach = smoothstep(f - 0.2, f, k * 1.2);
      ctx.globalAlpha = k * tw * reach * (0.35 + 0.45 * nightK());
      const sz = (0.8 + rt(i * 4 + 1203)) * u;
      ctx.fillRect(xf * W.w - sz / 2, y - sz / 2, sz, sz);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 我必与你同在（3:12）：摩西在哪里，一道柔和的光就在哪里
  function drawWith(ctx) {
    const k = W.lv.msWith;
    if (k < 0.01) return;
    const f = fig('moses');
    const p = f && !f.dying ? figPt('moses', 0.55) : null;
    if (!p) return;
    SP || sprites();
    const u = SU(), br = 0.88 + 0.12 * Math.sin(W.t * 0.9);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1], 44 * u, k * (0.14 + 0.3 * nightK()) * br);
    glowSp(ctx, SP.white, p[0], p[1] - 4 * u, 16 * u, k * (0.08 + 0.18 * nightK()) * br);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 耶和华眷顾他们（4:31）：一片温暖的光自上而下，落在低头下拜的百姓身上
  function drawVisit(ctx) {
    const k = W.lv.msVisit;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU(), x0 = 0.6 * W.w, x1 = 0.8 * W.w, gy = gY(2, 0.7);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * (0.3 + 0.15 * Math.sin(W.t * 0.7));
    ctx.drawImage(SP.beam, x0, -10, x1 - x0, gy + 20);
    glowSp(ctx, SP.gold, 0.7 * W.w, gy - 10 * u, (x1 - x0) * 0.8, k * 0.42);
    ctx.fillStyle = 'rgb(255,240,200)';
    for (let i = 0; i < 40; i++) {
      const ph = U.fract(W.t * (0.05 + 0.04 * rt(i * 3 + 3000)) + rt(i * 3 + 3001));
      const x = lerp(x0, x1, rt(i * 3 + 3002)) + Math.sin(ph * 5 + i) * 8 * u, y = lerp(W.h * 0.1, gy, ph);
      ctx.globalAlpha = k * Math.sin(ph * Math.PI) * 0.7;
      ctx.fillRect(x - 0.9 * u, y - 0.9 * u, 1.8 * u, 1.8 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, e) { if (b && b.instant) return null; e.t = 0; FXL.push(e); return e; }
  function beam(b, xf, o) {
    o = o || {};
    if (!fxAdd(b, { type: 'beam', dur: o.dur || 7, xf, w: (o.w || 70) * SU(), k: o.k || 1, white: !!o.white })) return;
    if (o.ring !== false) fx().ring(xf * W.w, surfY(xf) - 16 * LS(2), o.white ? [226, 232, 255] : [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  const glint = (b, id, c, frac, dur) => fxAdd(b, { type: 'glint', dur: dur || 3.2, id, c: c || [236, 242, 255], frac: frac == null ? 0.45 : frac });
  // 三颗星：亚伯拉罕、以撒、雅各（2:24；3:6）
  const FATHERS = [[0.71, 0.2], [0.77, 0.145], [0.83, 0.2]];
  function fathers(b, dur) { fxAdd(b, { type: 'fathers', dur: dur || 9 }); }
  // 天上的光移向神的山
  function guide(b, from, to, dur) { fxAdd(b, { type: 'guide', dur: dur || 5, a: from, b: to }); }
  // 自天而降的火星：耶和华的使者从荆棘里火焰中显现（3:2）
  function spark(b, dur) { fxAdd(b, { type: 'spark', dur: dur || 2.2 }); }
  // 火一涌（呼叫之时）
  function flare(b) { if (b.instant) return; flareT = W.t; const p = getP('bush'); if (p) fx().ring(p.x * W.w, surfY(p.x) - 14 * LS(2), [255, 214, 150], M() * 0.22, 1.8, 2.2); }
  // 自摩西到法老宫的一道光（3:10 我要打发你去见法老）
  function send(b) { fxAdd(b, { type: 'send', dur: 4.2 }); }

  // ── 以火写成的名（3:14）：预先以毛笔字画在离屏上，带火的颜色与光晕 ──
  const NAME = '我是自有永有的';
  let NMC = null, nmKey = '';
  function nameCanvas(size) {
    const key = Math.round(size) + ':' + (document.fonts && document.fonts.check ? (document.fonts.check('40px "GS Brush"') ? 1 : 0) : 1);
    if (NMC && key === nmKey) return NMC;
    const n = Array.from(NAME).length, pad = size * 0.7, gap = size * 1.12;
    const c = cnv(gap * n + pad * 2, size * 1.4 + pad * 2), g = c.getContext('2d');
    g.font = '400 ' + Math.round(size) + 'px "GS Brush", "Kaiti SC", "STKaiti", "KaiTi", "Noto Serif CJK SC", serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const cy = c.height / 2;
    const grd = g.createLinearGradient(0, cy - size * 0.6, 0, cy + size * 0.6);
    grd.addColorStop(0, '#fff8e4'); grd.addColorStop(0.45, '#ffd684'); grd.addColorStop(1, '#ff8a3c');
    const chars = Array.from(NAME);
    g.shadowColor = 'rgba(255,120,40,0.95)'; g.shadowBlur = size * 0.45;
    g.fillStyle = grd;
    chars.forEach((ch, i) => g.fillText(ch, pad + gap * (i + 0.5), cy));
    g.shadowBlur = size * 0.12; g.shadowColor = 'rgba(255,220,160,0.9)';
    chars.forEach((ch, i) => g.fillText(ch, pad + gap * (i + 0.5), cy));
    NMC = c; nmKey = key;
    return c;
  }
  function namePlace() {
    const size = portrait() ? 0.075 * M() : 0.056 * M();
    return { size, cx: (portrait() ? 0.52 : 0.745) * W.w, cy: (portrait() ? 0.42 : 0.29) * W.h };
  }
  function fireName(b) {
    if (b.instant) return;
    fxAdd(b, { type: 'fireName', dur: 15 });
    const pl = namePlace(), p = getP('bush');
    const bx = p ? p.x * W.w : W.w * 0.88, by = p ? surfY(p.x) - 20 * LS(2) : W.h * 0.6;
    fx().nameStr(NAME, pl.cx, pl.cy, pl.size, [255, 214, 150], () => [bx + rand(-12, 12) * SU(), by + rand(-16, 6) * SU()], { hold: 9.5 });
  }

  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      switch (e.type) {
        case 'beam': {
          const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
          const x = e.xf * W.w, y = surfY(e.xf);
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = env * 0.5 * e.k;
          ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
          glowSp(ctx, e.white ? SP.white : SP.gold, x, y - e.w * 0.3, e.w * 1.2, env * 0.55 * e.k);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'glint': {
          const p = figPt(e.id, e.frac);
          if (!p) break;
          const env = Math.sin(q * Math.PI), L = 8 * u;
          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = env * 0.95; ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
          ctx.fillRect(p[0] - L, p[1] - 0.5, L * 2, 1); ctx.fillRect(p[0] - 0.5, p[1] - L, 1, L * 2);
          glowSp(ctx, SP.white, p[0], p[1], L * 1.8, env * 0.7);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'fathers': {
          const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.7, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          for (let i = 0; i < 3; i++) {
            const k = env * smoothstep(i * 0.08, i * 0.08 + 0.15, q);
            const x = FATHERS[i][0] * W.w, y = (FATHERS[i][1] + skyDY()) * W.h, tw = 0.85 + 0.15 * Math.sin(W.t * 1.4 + i * 2);
            glowSp(ctx, SP.gold, x, y, 14 * u, k * 0.6 * tw);
            ctx.globalAlpha = k * tw; ctx.fillStyle = 'rgb(255,248,228)';
            ctx.beginPath(); ctx.arc(x, y, 1.9 * u, 0, TAU); ctx.fill();
            ctx.globalAlpha = k * tw * 0.45;
            ctx.fillRect(x - 9 * u, y - 0.5, 18 * u, 1); ctx.fillRect(x - 0.5, y - 9 * u, 1, 18 * u);
          }
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'guide': {
          const k = U.easeInOut(q), ax = e.a[0] * W.w, ay = (e.a[1] + skyDY()) * W.h, bx = e.b[0] * W.w, by = e.b[1] * W.h;
          const x = lerp(ax, bx, k), y = lerp(ay, by, k) - Math.sin(k * Math.PI) * 30 * u;
          const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.85, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          for (let j = 1; j <= 6; j++) {
            const kk = Math.max(0, k - j * 0.02), tx = lerp(ax, bx, kk), ty = lerp(ay, by, kk) - Math.sin(kk * Math.PI) * 30 * u;
            glowSp(ctx, SP.gold, tx, ty, (10 - j) * u, env * 0.25 * (1 - j / 7));
          }
          glowSp(ctx, SP.gold, x, y, 22 * u, env * 0.8);
          ctx.globalAlpha = env; ctx.fillStyle = 'rgb(255,250,236)';
          ctx.beginPath(); ctx.arc(x, y, 2.2 * u, 0, TAU); ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'spark': {
          const p = getP('bush');
          if (!p) break;
          const bx = p.x * W.w, by = surfY(p.x) - 8 * LS(2);
          const k = U.easeIn(q), x = bx + Math.sin(q * 5) * 10 * u * (1 - q), y = lerp(W.h * (0.06 + skyDY()), by, k);
          const env = smoothstep(0, 0.15, q);
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.white, x, y, 20 * u, env * 0.9);
          glowSp(ctx, SP.gold, x, y, 46 * u, env * 0.35);
          ctx.globalAlpha = env * 0.35;
          ctx.strokeStyle = 'rgb(255,244,220)'; ctx.lineWidth = Math.max(1, 1.2 * u);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.sin(q * 5) * 6 * u, y - 60 * u * (1 - q * 0.5)); ctx.stroke();
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'send': {
          const A = figPt('moses', 0.6), pal = getP('palace');
          if (!A || !pal) break;
          const bx = pal.x * W.w, by = gY(2, pal.x) - 30 * LS(2);
          const k = U.easeInOut(q), x = lerp(A[0], bx, k), y = lerp(A[1], by, k) - Math.sin(k * Math.PI) * 60 * u;
          const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.85, 1, q));
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.gold, x, y, 16 * u, env * 0.85);
          ctx.globalAlpha = env; ctx.fillStyle = 'rgb(255,246,220)';
          ctx.fillRect(x - 1.4 * u, y - 1.4 * u, 2.8 * u, 2.8 * u);
          if (q > 0.85) glowSp(ctx, SP.gold, bx, by, 40 * u, (1 - q) * 4 * 0.5);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
        case 'fireName': {
          const pl = namePlace(), c = nameCanvas(pl.size);
          const env = smoothstep(0.08, 0.2, q) * (1 - smoothstep(0.75, 1, q));
          if (env < 0.005) break;
          const fl = 0.86 + 0.08 * Math.sin(W.t * 7.3) + 0.06 * Math.sin(W.t * 13.1);
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.fire, pl.cx, pl.cy, c.width * 0.62, env * 0.3);
          ctx.globalAlpha = env * fl;
          ctx.drawImage(c, pl.cx - c.width / 2, pl.cy - c.height / 2);
          ctx.globalCompositeOperation = 'source-over';
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'palm': drawPalm(ctx, p); break;
      case 'pyramid': drawPyramid(ctx, p); break;
      case 'palace': drawPalace(ctx, p); break;
      case 'hut': drawHut(ctx, p); break;
      case 'city': drawCity(ctx, p); break;
      case 'bricks': drawBricks(ctx, p); break;
      case 'well': drawWell(ctx, p); break;
      case 'tent': drawTent(ctx, p); break;
      case 'mound': drawMound(ctx, p); break;
      case 'bush': drawBush(ctx, p); break;
      case 'sandals': drawSandals(ctx, p); break;
      case 'basket': drawBasket(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const HGT = { palm: 44, pyramid: 30, palace: 30, hut: 12, city: 26, bricks: 2, well: 14, tent: 18, mound: 2, bush: 12, sandals: 1, basket: 4, serpent: 3 };
  const SCENE = {
    init() {
      sprites();
      try { if (document.fonts && document.fonts.load) document.fonts.load('60px "GS Brush"', NAME + '摩西').catch(() => {}); } catch (e) { /* 无字体接口时略过 */ }
    },
    resize() { if (!isCur()) return; origins(); },
    update(dt) {
      if (!isCur()) return;
      const f = dt * (W.fast || 1);
      const bp = P.get('bush');
      if (bp) bp.x = HU(BU);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.tx != null) {
          const d = p.tx - p.x, v = p.spd * f;
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else { p.x += Math.sign(d) * v; p.fd = Math.sign(d); }
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawSkyHaze(ctx); return; }
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        drawGround(ctx, l);
        if (l === 0) drawPromiseFar(ctx);
        if (l === 2) { drawNile(ctx); drawHoreb(ctx); }
        const list = sortProps();
        for (const p of list) {
          if (p.layer !== l || p.a < 0.005 || p.kind === 'serpent') continue;
          drawKind(ctx, p);
        }
        if (l === 2) { drawPromiseNear(ctx); drawWith(ctx); }
        return;
      }
      if (pass === 'air') {
        drawBushLight(ctx);
        drawCry(ctx);
        drawVisit(ctx);
        drawFX(ctx);
      }
    },
    draw(ctx, pass) {
      // 火与蛇：在走兽之后、人之前画
      if (!isCur() || pass !== 'near') return;
      for (const p of sortProps()) {
        if (p.layer !== 2 || p.a < 0.005) continue;
        if (p.kind === 'bush') drawBushFire(ctx, p);
        else if (p.kind === 'serpent') drawSerpent(ctx, p);
      }
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
    },
    // 测试用：本卷布景的状态（看完与恢复应一致）
    sig() {
      const out = [];
      for (const p of P.values()) if (!p.dying) out.push([p.id, p.kind, +(p.tx != null ? p.tx : p.x).toFixed(3), p.ta, +p.tfire.toFixed(2), +p.tbuild.toFixed(2), +p.tlit.toFixed(2), +p.tfloat.toFixed(2), +p.tmorph.toFixed(2), +p.tfill.toFixed(2)].join('|'));
      return { props: out.sort(), mount: Object.keys(S.mount).sort() };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1);
        if (p.kind === 'basket') { const q = basketPos(p); consider(p.label, q[0], q[1] - 12 * s); continue; }
        if (p.kind === 'bush') { if (W.lv.msHoreb < 0.8) continue; consider(p.fire > 0.3 ? '燃烧的荆棘' : p.label, p.x * W.w, surfY(p.x) - 22 * s); continue; }
        const px = p.x * W.w, gy = p.layer === 2 ? surfY(p.x) : gY(p.layer, p.x);
        consider(p.label, px, gy - (HGT[p.kind] || 10) * s - 10 * s);
      }
      if (W.lv.msNile > 0.5) { const q = nilePt(0.62); consider('尼罗河', q[0], q[1] - 12); }
      if (W.lv.msHoreb > 0.8) { const xf = X.horeb + 0.29 * hbHW(); consider('何烈山', xf * W.w, surfY(xf) - 10); }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const PALMS = [
    ['palmW1', 0.452, 2, 0.95, 1], ['palmW2', 0.472, 2, 1.12, -1], ['palmW3', 0.43, 2, 0.8, 1], ['palmE1', 0.548, 2, 1.0, 1],
    ['palmE2', 0.676, 2, 0.9, -1], ['palmM1', 0.58, 1, 1.2, 1], ['palmM2', 0.645, 1, 1.05, -1], ['palmM3', 0.74, 1, 1.15, 1],
  ];
  function origins() {
    const nx = X.nileT * W.w, ny = W.ridgeBaseY(2, nx);
    W.setOrigin('grass', nx, ny); W.setOrigin('herbs', nx, ny);
    const ox = W.w * 0.99; W.setOrigin('trees', ox, W.ridgeBaseY(2, ox));
  }
  function egyptProps() {
    prop('palace', 'palace', { x: X.palace, label: '法老的宫' });
    for (const q of PALMS) prop(q[0], 'palm', { x: q[1], layer: q[2], size: q[3], flip: q[4], label: '棕树' });
    prop('pyr1', 'pyramid', { x: 0.512, layer: 1, size: 1.1, label: '金字塔' });
    prop('pyr2', 'pyramid', { x: 0.542, layer: 1, size: 0.8, label: '金字塔' });
    prop('pyr3', 'pyramid', { x: 0.562, layer: 1, size: 0.55, label: '金字塔' });
    prop('pithom', 'city', { x: X.pithom, layer: 1, size: 1.45, label: '比东', build: 0 });
    prop('raamses', 'city', { x: X.raamses, layer: 1, size: 1.65, label: '兰塞', build: 0 });
    prop('bricks', 'bricks', { x: X.bricks, label: '砖场', build: 0.12 });
    X.huts.forEach((x, i) => prop('hut' + i, 'hut', { x, size: 0.9 + 0.2 * rt(i + 40), flip: i % 2 ? -1 : 1, label: '以色列人的房屋' }));
  }
  function midianProps() {
    prop('well', 'well', { x: X.well, label: '井' });
    prop('tentJ', 'tent', { x: X.tent, label: '叶忒罗的帐棚' });
    prop('tentJ2', 'tent', { x: X.tent2, size: 0.8, label: '帐棚' });
    prop('bush', 'bush', { x: HU(BU), label: '荆棘' });
  }
  const HUTS = () => X.huts.map((x, i) => 'hut' + i);
  const DAUS = ['dau1', 'dau2', 'dau3', 'dau4', 'dau5', 'dau6'];
  const ELD = ['eld1', 'eld2', 'eld3', 'eld4', 'eld5', 'eld6'];

  // ════════════════════════════════════════════════════════════
  //  幕后布置：埃及，歌珊（1:1–7）
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.25, land: 1, grass: 0.3, herbs: 0.24, trees: 0, lights: 1, moon: 1, stars: 1, life: 1,
      good: 0, given: 1, sabbath: 0.15, bare: 0.55, bloom: 0.25,
      msEgypt: 1, msNile: 1, msDark: 0, msHoreb: 0, msHoly: 0, msCry: 0, msPromise: 0, msWith: 0, msVisit: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    origins();
    W.freeClock = false;
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.72, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 24, W.w * 0.55, W.h * 0.3, true);
    W.setPop('cattle', 2, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 14, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    egyptProps();
    midianProps();
    const c = C();
    c.clear({ fade: false });
    crowd('israel', { n: 9, x0: 0.69, x1: 0.785, label: '以色列人', from: 'none' });
    herd('goats', { kind: 'goat', n: 3, x0: 0.745, x1: 0.785, label: '山羊', from: 'none' });
    herd('flockJ', { kind: 'sheep', n: 7, x0: 0.9, x1: 0.95, label: '叶忒罗的羊群', from: 'none' });
    add('jethro', { label: '叶忒罗', sex: 'm', age: 'elder', x: X.tent - 0.03, facing: -1, robe: ROBE.jethro, glow: 0.2, pose: 'sit', from: 'none' });
    avoid([0.52, 0.8], [0.8, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟），故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '以色列的众子，各带家眷，和雅各一同来到埃及……<br>凡从雅各而生的，共有七十人。约瑟已经在埃及。', ref: '出埃及记 1:1、5', hold: 7 },
    { text: '约瑟和他的弟兄，并那一代的人，都死了。<br>以色列人生养众多，并且繁茂，极其强盛，满了那地。', ref: '出埃及记 1:6–7', hold: 7.5 },
  ];
  const V1 = [
    { text: '有不认识约瑟的新王起来，治理埃及，对他的百姓说：<br>「看哪，这以色列民比我们还多，又比我们强盛。」', ref: '出埃及记 1:8–9', hold: 6.5 },
    { text: '于是埃及人派督工的辖制他们，加重担苦害他们。<br>他们为法老建造两座积货城，就是比东和兰塞。', ref: '出埃及记 1:11', hold: 6.5 },
    { text: '只是越发苦害他们，他们越发多起来，越发蔓延……', ref: '出埃及记 1:12', hold: 5 },
    { text: '埃及人严严地使以色列人做工，使他们因做苦工觉得命苦；<br>无论是和泥，是做砖，是做田间各样的工，在一切的工上都严严地待他们。', ref: '出埃及记 1:13–14', hold: 7.5 },
  ];
  const V2 = [
    { text: '有希伯来的两个收生婆，一名施弗拉，一名普阿；埃及王对她们说：<br>「……若是男孩，就把他杀了；若是女孩，就留她存活。」', ref: '出埃及记 1:15–16', hold: 7 },
    { text: '但是收生婆敬畏神，不照埃及王的吩咐行，竟存留男孩的性命。', ref: '出埃及记 1:17', hold: 5.5 },
    { text: '神厚待收生婆。以色列人多起来，极其强盛。<br>收生婆因为敬畏神，神便叫她们成立家室。', ref: '出埃及记 1:20–21', hold: 7 },
    { text: '法老吩咐他的众民说：「以色列人所生的男孩，你们都要丢在河里……」', ref: '出埃及记 1:22', hold: 6 },
  ];
  const V3 = [
    { text: '那女人怀孕，生一个儿子，见他俊美，就藏了他三个月，<br>后来不能再藏，就取了一个蒲草箱……将孩子放在里头，把箱子搁在河边的芦荻中。', ref: '出埃及记 2:2–3', hold: 8 },
    { text: '孩子的姊姊远远站着……法老的女儿来到河边洗澡……<br>她打开箱子，看见那孩子。孩子哭了，她就可怜他……', ref: '出埃及记 2:4–6', hold: 7.5 },
    { text: '孩子渐长，妇人把他带到法老的女儿那里，就作了她的儿子。<br>她给孩子起名叫摩西，意思说：「因我把他从水里拉出来。」', ref: '出埃及记 2:10', hold: 8 },
  ];
  const V4 = [
    { text: '后来，摩西长大，他出去到他弟兄那里，看他们的重担，<br>见一个埃及人打希伯来人的一个弟兄。', ref: '出埃及记 2:11', hold: 6 },
    { text: '他左右观看，见没有人，就把埃及人打死了，藏在沙土里……<br>法老听见这事，就想杀摩西，但摩西躲避法老，逃往米甸地居住。', ref: '出埃及记 2:12、15', hold: 7.5 },
    { text: '一日，他在井旁坐下。米甸的祭司有七个女儿；她们来打水……<br>摩西却起来帮助她们，又饮了她们的群羊。', ref: '出埃及记 2:16–17', hold: 6.5 },
    { text: '摩西甘心和那人同住；那人把他的女儿西坡拉给摩西为妻。<br>西坡拉生了一个儿子，摩西给他起名叫革舜……', ref: '出埃及记 2:21–22', hold: 6.5 },
  ];
  const V5 = [
    { text: '过了多年，埃及王死了。以色列人因做苦工，就叹息哀求，<br>他们的哀声达于神。', ref: '出埃及记 2:23', hold: 6.5 },
    { text: '神听见他们的哀声，就记念他与亚伯拉罕、以撒、雅各所立的约。<br>神看顾以色列人，也知道他们的苦情。', ref: '出埃及记 2:24–25', hold: 7.5 },
    { text: '摩西牧养他岳父米甸祭司叶忒罗的羊群；一日领羊群往野外去，<br>到了神的山，就是何烈山。', ref: '出埃及记 3:1', hold: 7 },
  ];
  const V6 = [
    { text: '耶和华的使者从荆棘里火焰中向摩西显现。<br>摩西观看，不料，荆棘被火烧着，却没有烧毁。', ref: '出埃及记 3:2', hold: 9.5 },
    { text: '摩西说：「我要过去看这大异象，这荆棘为何没有烧坏呢？」', ref: '出埃及记 3:3', hold: 6.5 },
  ];
  const V7 = [
    { text: '耶和华神见他过去要看，就从荆棘里呼叫说：「摩西！摩西！」<br>他说：「我在这里。」', ref: '出埃及记 3:4', hold: 7.5 },
  ];
  const V8 = [
    { text: '神说：「不要近前来。当把你脚上的鞋脱下来，因为你所站之地是圣地」；<br>又说：「我是你父亲的神，是亚伯拉罕的神，以撒的神，雅各的神。」', ref: '出埃及记 3:5–6', hold: 9 },
    { text: '摩西蒙上脸，因为怕看神。', ref: '出埃及记 3:6', hold: 5 },
  ];
  const V9 = [
    { text: '耶和华说：「我的百姓在埃及所受的困苦，我实在看见了……」', ref: '出埃及记 3:7', hold: 5.5 },
    { text: '「我下来是要救他们脱离埃及人的手，领他们出了那地，到美好、宽阔、流奶与蜜之地……<br>故此，我要打发你去见法老，使你可以将我的百姓以色列人从埃及领出来。」', ref: '出埃及记 3:8–10', hold: 8 },
    { text: '摩西对神说：「我是什么人，竟能去见法老，将以色列人从埃及领出来呢？」', ref: '出埃及记 3:11', hold: 6 },
    { text: '神说：「我必与你同在。你将百姓从埃及领出来之后，你们必在这山上事奉我；<br>这就是我打发你去的证据。」', ref: '出埃及记 3:12', hold: 7 },
  ];
  const V10 = [
    { text: '摩西对神说：「我到以色列人那里……他们若问我说：『他叫什么名字？』<br>我要对他们说什么呢？」', ref: '出埃及记 3:13', hold: 6.5 },
    { text: '神对摩西说：「我是自有永有的」；又说：「你要对以色列人这样说：<br>『那自有的打发我到你们这里来。』」', ref: '出埃及记 3:14', hold: 8.5 },
    { text: '神又对摩西说：「……耶和华是我的名，直到永远；<br>这也是我的纪念，直到万代。」', ref: '出埃及记 3:15', hold: 6.5 },
  ];
  const V11 = [
    { text: '摩西回答说：「他们必不信我，也不听我的话……」<br>耶和华对摩西说：「你手里是什么？」他说：「是杖。」', ref: '出埃及记 4:1–2', hold: 7 },
    { text: '耶和华说：「丢在地上。」他一丢下去，就变作蛇；摩西便跑开。', ref: '出埃及记 4:3', hold: 6 },
    { text: '耶和华对摩西说：「伸出手来，拿住它的尾巴，它必在你手中仍变为杖……」', ref: '出埃及记 4:4', hold: 6 },
    { text: '耶和华又对他说：「把手放在怀里。」……及至抽出来，不料，手长了大麻风，有雪那样白。', ref: '出埃及记 4:6', hold: 6.5 },
  ];
  const V12 = [
    { text: '摩西对耶和华说：「主啊，我素日不是能言的人……我本是拙口笨舌的。」', ref: '出埃及记 4:10', hold: 6 },
    { text: '耶和华对他说：「谁造人的口呢？……岂不是我耶和华吗？<br>现在去吧，我必赐你口才，指教你所当说的话。」', ref: '出埃及记 4:11–12', hold: 7.5 },
    { text: '于是，摩西回到他岳父叶忒罗那里……叶忒罗对摩西说：「你可以平平安安地去吧！」', ref: '出埃及记 4:18', hold: 6.5 },
    { text: '摩西就带着妻子和两个儿子，叫他们骑上驴，回埃及地去。摩西手里拿着神的杖。', ref: '出埃及记 4:20', hold: 6.5 },
  ];
  const V13 = [
    { text: '耶和华对亚伦说：「你往旷野去迎接摩西。」他就去，在神的山遇见摩西，和他亲嘴。', ref: '出埃及记 4:27', hold: 7 },
    { text: '摩西将耶和华打发他所说的言语和嘱咐他所行的神迹都告诉了亚伦。<br>摩西、亚伦就去招聚以色列的众长老。', ref: '出埃及记 4:28–29', hold: 7.5 },
    { text: '亚伦将耶和华对摩西所说的一切话述说了一遍，又在百姓眼前行了那些神迹，<br>百姓就信了。以色列人听见耶和华眷顾他们，鉴察他们的困苦，就低头下拜。', ref: '出埃及记 4:30–31', hold: 9.5 },
  ];

  // 话语：神在一、二章里没有开口——所言说的，是经上明说神所行的事（神厚待收生婆、神听见他们的哀声），
  // 或这段经文里的一句；从何烈山起，是神自己的话
  const STAGES = [
    // ── 1 · 他们越发多起来（1:8–14）──────────────────────────
    {
      kind: 'act', utter: '他们越发多起来，越发蔓延', cmd: 'while (苦害) { 以色列.count++ }  # 越发多起来', ref: '1:12',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.4, 5, b.instant);
            add('pharaoh', { label: '法老', sex: 'm', age: 'adult', x: X.pharaoh, facing: 1, robe: ROBE.pharaoh, accent: GOLD, glow: 0.18, from: fromOf(b) });
            avoid([0.52, 0.8], [0.8, 1]);
          }],
          [2.5, () => pose('pharaoh', 'point')],
          [6, () => pose('pharaoh', 'stand')],
          [L[1], b => {
            add('task1', { label: '督工的', sex: 'm', age: 'adult', x: X.pharaoh + 0.012, facing: 1, robe: ROBE.task, accent: [70, 60, 50], glow: 0.05, prop: 'staff', from: fromOf(b) });
            add('task2', { label: '督工的', sex: 'm', age: 'adult', x: X.pharaoh + 0.02, facing: 1, robe: ROBE.task, accent: [70, 60, 50], glow: 0.05, prop: 'staff', from: fromOf(b) });
            walk('task1', 0.614, { speed: 0.03 }); walk('task2', 0.678, { speed: 0.03 });
            crowdWalk('israel', 0.618, 0.672, { speed: 0.03, pose: 'carry' });
            prop('bricks', null, { build: 1 });
            prop('pithom', null, { build: 1, work: 1 }); prop('raamses', null, { build: 1, work: 1 });
            sfx(b, 'build');
          }],
          [L[1] + 3, () => { face('task2', -1); pose('task1', 'point'); }],
          [L[1] + 5.5, () => pose('task1', 'stand')],
          [L[2], b => {
            crowd('israel2', { n: 7, x0: 0.694, x1: 0.786, label: '以色列人', from: fromOf(b) });
            if (!b.instant) for (let i = 0; i < 5; i++) { const xf = lerp(0.7, 0.78, i / 4); fx().sparkle(xf * W.w, gY(2, xf) - 14 * LS(2), 10, [255, 232, 190], 8, 'near'); }
            sfx(b, 'crowd', { soft: true });
          }],
          [L[3], b => { crowdPose('israel', 'bow'); pose('task2', 'point'); sfx(b, 'build'); }],
          [L[3] + 3.5, () => { crowdPose('israel', 'carry'); crowdPose('israel2', 'carry'); pose('task2', 'stand'); }],
        ]);
      },
    },

    // ── 2 · 神厚待收生婆（1:15–22）──────────────────────────
    {
      kind: 'act', utter: '神厚待收生婆', cmd: 'if (收生婆.敬畏神) 收生婆.家室 = true  # 竟存留男孩的性命', ref: '1:20',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.76, 8, b.instant);
            prop('pithom', null, { work: 0 }); prop('raamses', null, { work: 0 });
            crowdWalk('israel', 0.69, 0.785, { speed: 0.028, pose: 'sit' });
            crowdPose('israel2', 'stand');
            walk('task1', 0.596, { speed: 0.03 }); walk('task2', 0.604, { speed: 0.03 });
          }],
          [1, b => {
            add('shiphrah', { label: '施弗拉', sex: 'f', age: 'adult', x: 0.72, facing: -1, robe: ROBE.shiphrah, glow: 0.2, from: fromOf(b) });
            add('puah', { label: '普阿', sex: 'f', age: 'adult', x: 0.734, facing: -1, robe: ROBE.puah, glow: 0.2, from: fromOf(b) });
            walk('shiphrah', 0.584 + 0.018, { speed: 0.034 }); walk('puah', 0.584 + 0.03, { speed: 0.034 });
          }],
          [3.5, () => { rm('task1'); rm('task2'); }],
          [5.5, () => { pose('shiphrah', 'bow'); pose('puah', 'bow'); face('pharaoh', 1); pose('pharaoh', 'point'); }],
          [L[1], () => {
            pose('pharaoh', 'stand');
            walk('shiphrah', 0.722, { speed: 0.03 }); walk('puah', 0.744, { speed: 0.03 });
          }],
          [L[1] + 3, () => { glow('shiphrah', 0.55); glow('puah', 0.55); }],
          [L[2], b => {
            W.goTo(0.86, 6, b.instant);
            beam(b, 0.733, { dur: 7, w: 90 });
            prop('hut0', null, { lit: 1 }); prop('hut2', null, { lit: 1 });
            add('mom1', { label: '希伯来妇人', sex: 'f', age: 'adult', x: X.huts[1] + 0.008, facing: 1, robe: ROBE.mother, glow: 0.2, carry: 'baby', v: 0.42, from: fromOf(b) });
            if (!b.instant) for (const i of [0, 2]) { const xf = X.huts[i]; fx().sparkle(xf * W.w, gY(2, xf) - 8 * LS(2), 16, [255, 226, 170], 8, 'near'); }
            sfx(b, 'harp');
          }],
          [L[2] + 2.5, b => {
            prop('hut1', null, { lit: 1 }); prop('hut3', null, { lit: 1 }); prop('hut4', null, { lit: 1 });
            add('mom2', { label: '希伯来妇人', sex: 'f', age: 'adult', x: X.huts[3] + 0.01, facing: -1, robe: [150, 120, 96], glow: 0.2, carry: 'baby', from: fromOf(b) });
            if (!b.instant) for (const i of [1, 3, 4]) { const xf = X.huts[i]; fx().sparkle(xf * W.w, gY(2, xf) - 8 * LS(2), 12, [255, 226, 170], 8, 'near'); }
          }],
          [L[3], b => {
            face('pharaoh', -1); pose('pharaoh', 'point');
            W.set('msDark', 1, b.instant);
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [L[3] + 4.5, () => pose('pharaoh', 'stand')],
        ]);
      },
    },

    // ── 3 · 蒲草箱与法老的女儿（2:1–10）────────────────────────
    {
      kind: 'name', utter: '她给孩子起名叫摩西', cmd: 'mv 孩子 ./蒲草箱 && rename 孩子 摩西  # 从水里拉出来', ref: '2:10', tint: [206, 228, 255],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.27, 6, b.instant);
            W.set('msDark', 0, b.instant);
            rm('shiphrah'); rm('puah'); rm('mom2'); rm('pharaoh');
            HUTS().forEach(id => prop(id, null, { lit: 0 }));
            crowdPose('israel', 'stand');
            // 那抱着孩子的妇人，就是孩子的母亲
            rm('mom1', true);
            add('mother', { label: '孩子的母亲', sex: 'f', age: 'adult', x: X.huts[1] + 0.008, facing: -1, robe: ROBE.mother, glow: 0.3, carry: 'baby', v: 0.42, from: 'none' });
            add('sister', { label: '孩子的姊姊', sex: 'f', age: 'child', x: X.huts[1] + 0.02, facing: -1, robe: ROBE.sister, glow: 0.25, from: fromOf(b) });
            walk('mother', X.bank + 0.008, { speed: 0.032 });
            avoid([0.52, 0.8], [0.8, 1]);
          }],
          [1.2, () => walk('sister', 0.578, { speed: 0.03 })],
          [6, () => pose('mother', 'kneel')],
          [7, b => {
            carry('mother', null);
            prop('basket', 'basket', { float: 1, size: 1.7, label: '蒲草箱' });
            if (!b.instant) { const q = basketPos(getP('basket')); fx().sparkle(q[0], q[1], 14, [210, 232, 255], 8, 'near'); }
            sfx(b, 'splash', { soft: true });
          }],
          [8.5, () => { pose('mother', 'stand'); walk('mother', X.huts[1], { speed: 0.024 }); }],
          [L[1], () => face('sister', -1)],
          [L[1] + 0.5, b => {
            add('princess', { label: '法老的女儿', sex: 'f', age: 'adult', x: X.palace, facing: -1, robe: ROBE.princess, accent: GOLD, glow: 0.25, v: 0.42, from: fromOf(b) });
            add('maid1', { label: '使女', sex: 'f', age: 'adult', x: X.palace + 0.01, facing: -1, robe: ROBE.maid, glow: 0.08, v: 0.5, from: fromOf(b) });
            add('maid2', { label: '使女', sex: 'f', age: 'adult', x: X.palace + 0.018, facing: -1, robe: ROBE.maid, glow: 0.08, v: 0.22, from: fromOf(b) });
            walk('princess', X.bank + 0.016, { speed: 0.022 }); walk('maid1', X.bank + 0.026, { speed: 0.022 }); walk('maid2', X.bank + 0.03, { speed: 0.022 });
          }],
          [L[1] + 3.5, () => { walk('maid1', X.bank + 0.004, { speed: 0.02, pose: 'kneel' }); }],
          [L[1] + 5, () => prop('basket', null, { float: 0 })],
          [L[1] + 6.5, b => {
            unprop('basket');
            carry('princess', 'baby'); pose('maid1', 'stand');
            if (!b.instant) { const p = figPt('princess', 0.6); if (p) fx().sparkle(p[0], p[1], 10, [255, 236, 200], 6, 'near'); }
          }],
          [L[1] + 7.5, () => walk('sister', X.bank + 0.024, { speed: 0.04 })],
          [L[2], b => {
            carry('princess', null);
            add('moses', { label: '摩西', sex: 'm', age: 'child', x: X.huts[1] - 0.01, facing: -1, robe: [214, 204, 180], glow: 0.35, v: 0.36, from: fromOf(b) });
            walk('mother', 0.578, { speed: 0.03 }); walk('moses', 0.566, { speed: 0.03 });
            walk('sister', 0.6, { speed: 0.03 });
          }],
          [L[2] + 4.5, b => {
            face('princess', 1); pose('mother', 'bow');
            nameOver(b, 'moses', '摩西', [206, 230, 255], () => { const q = nilePt(0.2 + Math.random() * 0.6); return [q[0] + rand(-8, 8), q[1]]; }, { hold: 3 });
            sfx(b, 'harp');
          }],
          [L[2] + 7, () => { pose('mother', 'stand'); walk('moses', X.bank + 0.018, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 4 · 逃往米甸（2:11–22）────────────────────────────────
    {
      kind: 'act', utter: '摩西躲避法老，逃往米甸地居住', cmd: 'nohup 摩西 &> /米甸/井旁  # 他左右观看', ref: '2:15',
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.45, 5, b.instant);
            ['princess', 'maid1', 'maid2', 'mother', 'sister', 'mom1'].forEach(id => rm(id));
            // 过了些年：孩子长成了法老宫中的人
            rm('moses', true);
            add('moses', { label: '摩西', sex: 'm', age: 'adult', x: X.palace + 0.012, facing: 1, robe: ROBE.prince, accent: GOLD, glow: 0.35, from: fromOf(b) });
            walk('moses', 0.622, { speed: 0.025 });
            add('task1', { label: '督工的', sex: 'm', age: 'adult', x: 0.664, facing: -1, robe: ROBE.task, accent: [70, 60, 50], glow: 0.05, prop: 'staff', from: fromOf(b) });
            add('task2', { label: '督工的', sex: 'm', age: 'adult', x: 0.608, facing: 1, robe: ROBE.task, accent: [70, 60, 50], glow: 0.05, prop: 'staff', from: fromOf(b) });
            add('heb', { label: '希伯来人', sex: 'm', age: 'adult', x: 0.652, facing: 1, robe: ROBE.heb, glow: 0.1, pose: 'carry', from: fromOf(b) });
            crowdWalk('israel', 0.614, 0.646, { speed: 0.03, pose: 'carry' });
            crowdWalk('israel2', 0.694, 0.785, { speed: 0.03, pose: 'carry' });
            prop('pithom', null, { work: 1 }); prop('raamses', null, { work: 1 });
          }],
          [3.5, () => { pose('task1', 'raise'); pose('heb', 'fall'); }],
          [5, () => pose('task1', 'stand')],
          [L[1], () => walk('moses', 0.642, { speed: 0.02 })],
          [L[1] + 1.4, () => face('moses', -1)],
          [L[1] + 2.4, () => face('moses', 1)],
          [L[1] + 3.2, b => { pose('task1', 'fall'); if (!b.instant) { const p = figPt('task1', 0.2); if (p) fx().dust(p[0], p[1], 26, [214, 182, 134], 12 * SU()); } }],
          [L[1] + 4.4, b => { rm('task1'); prop('mound', 'mound', { x: 0.666 }); pose('heb', 'stand'); if (!b.instant) fx().dust(0.666 * W.w, fieldY(0.666, 0.12), 20, [214, 182, 134], 10 * SU()); }],
          [L[1] + 4.6, b => { add('pharaoh', { label: '法老', sex: 'm', age: 'adult', x: X.pharaoh, facing: 1, robe: ROBE.pharaoh, accent: GOLD, glow: 0.18, from: fromOf(b) }); }],
          [L[1] + 5.4, () => { face('pharaoh', 1); pose('pharaoh', 'point'); }],
          [L[1] + 6.2, () => walk('moses', X.well + 0.009, { speed: 0.05, pose: 'sit' })],
          [L[1] + 8.5, () => pose('pharaoh', 'stand')],
          [L[2], b => {
            W.goTo(0.62, 6, b.instant);
            const f = fromOf(b);
            DAUS.forEach((id, i) => add(id, { label: '米甸祭司的女儿', sex: 'f', age: 'adult', x: X.tent - 0.02 + i * 0.006, facing: -1, robe: DAUGHTERS[i], glow: 0.1, prop: i % 2 ? 'jar' : null, scale: 0.94, from: f }));
            add('zipporah', { label: '西坡拉', sex: 'f', age: 'adult', x: X.tent - 0.026, facing: -1, robe: ROBE.zipporah, accent: [236, 214, 170], glow: 0.25, prop: 'jar', from: f });
            spread(['zipporah'].concat(DAUS), 0.814, 0.852, { speed: 0.03, seed: 4 });
            crowdWalk('flockJ', 0.818, 0.856, { speed: 0.03 });
          }],
          [L[2] + 2.5, b => {
            const f = fromOf(b);
            add('shep1', { label: '牧羊的人', sex: 'm', age: 'adult', x: 0.92, facing: -1, robe: ROBE.shep, glow: 0.05, prop: 'staff', from: f });
            add('shep2', { label: '牧羊的人', sex: 'm', age: 'adult', x: 0.935, facing: -1, robe: [100, 88, 70], glow: 0.05, prop: 'staff', from: f });
            walk('shep1', 0.836, { speed: 0.04, pose: 'point' }); walk('shep2', 0.85, { speed: 0.04 });
            spread(['zipporah'].concat(DAUS), 0.862, 0.9, { speed: 0.035, seed: 6 });
          }],
          [L[2] + 4.2, () => { walk('moses', 0.815, { speed: 0.03, pose: 'raise' }); }],
          [L[2] + 5.4, () => { walk('shep1', 1.06, { speed: 0.05 }); walk('shep2', 1.07, { speed: 0.05 }); }],
          [L[2] + 6.3, b => {
            pose('moses', 'carry'); prop('well', null, { fill: 1 });
            spread(['zipporah'].concat(DAUS), 0.826, 0.862, { speed: 0.03, seed: 8 });
            crowdWalk('flockJ', 0.812, 0.842, { speed: 0.025, pose: 'graze' });
            sfx(b, 'splash'); sfx(b, 'bleat', { soft: true });
          }],
          [L[3], b => {
            W.goTo(0.66, 5, b.instant);
            rm('shep1'); rm('shep2');
            add('moses', { robe: ROBE.shepherd, accent: [214, 200, 170] });
            pose('moses', 'stand');
            walk('zipporah', 0.823, { speed: 0.02 });
            spread(DAUS, X.tent - 0.04, X.tent - 0.005, { speed: 0.028, seed: 9 });
          }],
          [L[3] + 3, b => { face('zipporah', -1); face('moses', 1); hold('zipporah', null); carry('zipporah', 'baby'); if (!b.instant) { const p = figPt('zipporah', 0.55); if (p) fx().sparkle(p[0], p[1], 12, [255, 232, 190], 6, 'near'); } }],
        ]);
      },
    },

    // ── 5 · 神听见他们的哀声（2:23–3:1）──────────────────────
    {
      kind: 'act', utter: '神听见他们的哀声', cmd: 'tail -f 哀声.log | 记念 --约 亚伯拉罕,以撒,雅各', ref: '2:24', tint: [226, 228, 255],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.95, 7, b.instant);
            DAUS.forEach(id => rm(id));
            rm('heb'); rm('task2');
            unprop('mound');
            prop('pithom', null, { work: 0 }); prop('raamses', null, { work: 0 });
            prop('well', null, { fill: 0 });
            crowdWalk('israel', 0.616, 0.668, { speed: 0.03, pose: 'kneel' });
            crowdWalk('israel2', 0.69, 0.78, { speed: 0.03, pose: 'kneel' });
            pose('pharaoh', 'lie');
            walk('zipporah', X.tent - 0.045, { speed: 0.02 });
            carry('zipporah', null);
          }],
          [2, b => { W.set('msCry', 1, b.instant); rm('pharaoh'); sfx(b, 'weep', { soft: true, far: true }); }],
          [4, b => {
            add('gershom', { label: '革舜', sex: 'm', age: 'child', x: X.tent - 0.036, facing: -1, robe: ROBE.gershom, glow: 0.2, from: fromOf(b) });
          }],
          [L[1], b => { fathers(b, 10); beam(b, 0.68, { dur: 8, w: 110, white: true, r: 0.4 }); sfx(b, 'harp'); }],
          [L[1] + 5, b => { W.set('msCry', 0, b.instant); guide(b, [0.7, 0.14], [X.horeb - 0.005, 0.56], 5.5); }],
          [L[2] - 2.5, b => { W.goTo(0.34, 5, b.instant); }],
          [L[2] + 4, b => { W.goTo(0.52, 5, b.instant); }],
          [L[2], b => {
            // 神的山，何烈山：光落下之处，山自旷野中升起
            W.set('msHoreb', 1, b.instant);
            add('moses', { age: 'elder', prop: 'staff', beard: true });
            walk('moses', HU(-0.98), { speed: 0.02 });
            crowdWalk('flockJ', 0.772, 0.8, { speed: 0.02 });
            crowdPose('israel', 'carry'); crowdPose('israel2', 'carry');
            sfx(b, 'wind', { soft: true });
          }],
          [L[2] + 6.5, () => { onMount('moses'); walk('moses', HU(STAND_U), { speed: 0.012 }); }],
        ]);
      },
    },

    // ── 6 · 荆棘被火烧着，却没有烧毁（3:2–3）── 本卷的签名画面 ──
    {
      kind: 'act', utter: '荆棘被火烧着，却没有烧毁', cmd: 'ignite 荆棘 --consume=false  # 这大异象', ref: '3:2', tint: [255, 196, 128],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => { W.goTo(0.735, 7, b.instant); onMount('moses'); walk('moses', HU(STAND_U), { speed: 0.008 }); face('moses', 1); avoid([0.52, 0.77], [0.77, 1]); }],
          [1, b => spark(b, 2.2)],
          [3, b => {
            prop('bush', null, { fire: 1 });
            if (!b.instant) { flare(b); W.flash = Math.max(W.flash || 0, 0.25); }
            sfx(b, 'fire');
          }],
          [5, () => { crowdPose('flockJ', 'stand'); pose('moses', 'gaze'); }],
          [L[1] - 0.5, () => pose('moses', 'stand')],
          [L[1] + 1.5, () => walk('moses', HU(NEAR_U), { speed: 0.004, pose: 'gaze' })],
          [L[2] + 1.5, () => pose('moses', 'stand')],
        ]);
      },
    },

    // ── 7 · 摩西！摩西！（3:4）──────────────────────────────
    {
      kind: 'call', utter: '摩西！摩西！', cmd: 'ping 摩西 && ping 摩西  # 我在这里', ref: '3:4', tint: [255, 214, 160],
      verse: V7,
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.775, 7, b.instant); flare(b); sfx(b, 'fire', { soft: true }); pose('moses', 'stand'); face('moses', 1); }],
          [1.6, b => flare(b)],
          [3.5, () => pose('moses', 'gaze')],
          [5.8, () => pose('moses', 'raise')],
          [9, () => pose('moses', 'stand')],
        ]);
      },
    },

    // ── 8 · 把你脚上的鞋脱下来（3:5–6）──────────────────────
    {
      kind: 'cmd', utter: '把你脚上的鞋脱下来', cmd: 'rm ./鞋  # 你所站之地是圣地', ref: '3:5', tint: [255, 222, 170],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => { W.goTo(0.82, 8, b.instant); walk('moses', HU(NEAR_U - 0.03), { speed: 0.006 }); }],
          [2.5, b => {
            pose('moses', 'kneel');
            prop('sandals', 'sandals', { x: HU(NEAR_U - 0.07), label: '鞋' });
            W.set('msHoly', 1, b.instant);
            if (!b.instant) { const p = getP('bush'); if (p) fx().ring(p.x * W.w, surfY(p.x), [255, 230, 170], M() * 0.18, 2.4, 1.6); }
            sfx(b, 'harp');
          }],
          [5, b => fathers(b, 9)],
          [L[1], () => prostrate('moses')],
        ]);
      },
    },

    // ── 9 · 我必与你同在（3:7–12）────────────────────────────
    {
      kind: 'promise', utter: '我必与你同在', cmd: 'export 同在=我  # 这就是我打发你去的证据', ref: '3:12', tint: [255, 230, 180],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => { W.goTo(0.9, 7, b.instant); arise('moses', 'kneel'); W.set('msCry', 0.7, b.instant); }],
          [L[1], b => { W.set('msPromise', 1, b.instant); W.set('msCry', 0, b.instant); sfx(b, 'harp'); }],
          [L[1] + 4.5, b => send(b)],
          [L[2], () => prostrate('moses')],
          [L[3], b => {
            W.set('msWith', 1, b.instant);
            arise('moses', 'kneel');
            const f = fig('moses'); if (f) beam(b, f.nx, { dur: 7, w: 60, r: 0.2 });
            sfx(b, 'angel', { soft: true });
          }],
          [L[3] + 4, b => W.set('msPromise', 0.3, b.instant)],
        ]);
      },
    },

    // ── 10 · 我是自有永有的（3:13–15）── 以火写成的名，在星空之下 ──
    {
      kind: 'name', utter: '我是自有永有的', cmd: 'echo $NAME  # 我是自有永有的', ref: '3:14', tint: [255, 206, 140], hold: 3.4,
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { W.goTo(0.99, 6, b.instant); W.set('msPromise', 0, b.instant); arise('moses', 'stand'); face('moses', 1); }],
          [2, () => pose('moses', 'gaze')],
          [L[1] - 1.2, b => { flare(b); sfx(b, 'fire'); }],
          [L[1], b => { fireName(b); sfx(b, 'angel'); }],
          [L[1] + 2.5, () => pose('moses', 'kneel')],
          [L[2], () => prostrate('moses')],
          [L[2] + 5, () => arise('moses', 'kneel')],
        ]);
      },
    },

    // ── 11 · 丢在地上（4:1–7）────────────────────────────────
    {
      kind: 'cmd', utter: '丢在地上', cmd: 'cast 杖 → 蛇 && grab --tail 蛇 → 杖', ref: '4:3', tint: [236, 230, 190],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => { W.goTo(0.15, 8, b.instant); arise('moses', 'stand'); face('moses', 1); }],
          [L[1] - 2.5, b => { pose('moses', 'point'); glint(b, 'moses', [255, 240, 210], 0.62); }],
          [L[1], b => {
            pose('moses', 'stand');
            hold('moses', null);
            prop('serpent', 'serpent', { x: HU(NEAR_U + 0.06), morph: 1, label: '杖' });
            if (!b.instant) fx().dust(HU(NEAR_U + 0.06) * W.w, surfY(HU(NEAR_U + 0.06)), 14, [200, 160, 130], 6 * SU());
            sfx(b, 'wind', { soft: true });
          }],
          [L[1] + 1, () => { walk('moses', HU(NEAR_U - 0.2), { speed: 0.03 }); }],
          [L[1] + 2, () => prop('serpent', null, { tx: HU(NEAR_U + 0.02), spd: 0.004 })],
          [L[1] + 3.2, () => face('moses', 1)],
          [L[2] + 1, () => walk('moses', HU(NEAR_U - 0.06), { speed: 0.01, pose: 'kneel' })],
          [L[2] + 3.5, () => prop('serpent', null, { morph: 0 })],
          [L[2] + 5, b => { unprop('serpent'); hold('moses', 'staff'); pose('moses', 'stand'); glint(b, 'moses', [255, 236, 200], 0.5); }],
          [L[3] + 2, b => glint(b, 'moses', [250, 252, 255], 0.55, 4.2)],
        ]);
      },
    },

    // ── 12 · 现在去吧，我必赐你口才（4:10–20）────────────────
    {
      kind: 'promise', utter: '现在去吧，我必赐你口才', cmd: 'sudo -u 耶和华 mount /dev/口才 摩西  # 指教你所当说的话', ref: '4:12', tint: [255, 226, 176],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => { W.goTo(0.235, 8, b.instant); pose('moses', 'bow'); }],
          [L[1], b => { glint(b, 'moses', [255, 236, 190], 0.9); pose('moses', 'stand'); }],
          [L[1] + 4, () => pose('moses', 'raise')],
          [L[2], b => {
            pose('moses', 'stand');
            prop('bush', null, { fire: 0.3 });
            W.set('msHoly', 0.3, b.instant);
            unprop('sandals');
            walk('moses', HU(-0.8), { speed: 0.012 });
            pose('jethro', 'stand');
            walk('jethro', 0.825, { speed: 0.022 });
            crowdWalk('flockJ', 0.83, 0.88, { speed: 0.02 });
          }],
          [L[2] + 3.5, () => { pose('jethro', 'raise'); face('moses', 1); }],
          [L[3], b => {
            pose('jethro', 'stand');
            animal('donkey', 'donkey', X.tent - 0.05, { facing: -1, from: fromOf(b), label: '驴' });
            ride('zipporah', 'donkey');
            carry('zipporah', 'baby');
            walk('donkey', 0.808, { speed: 0.025 });
            walk('gershom', 0.795, { speed: 0.025 });
            walk('moses', HU(-0.93), { speed: 0.012 });
            face('jethro', -1);
          }],
        ]);
      },
    },

    // ── 13 · 你往旷野去迎接摩西（4:27–31）────────────────────
    {
      kind: 'cmd', utter: '你往旷野去迎接摩西', cmd: 'git merge 亚伦 摩西 && broadcast 长老  # 百姓就信了', ref: '4:27', tint: [255, 228, 180],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            walk('jethro', X.tent - 0.03, { speed: 0.02, pose: 'sit' });
            add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: 0.7, facing: 1, robe: ROBE.aaron, accent: [220, 210, 190], glow: 0.35, from: fromOf(b) });
            walk('aaron', 0.768, { speed: 0.03 });
            walk('moses', 0.778, { speed: 0.012 });
            walk('donkey', 0.8, { speed: 0.015 }); walk('gershom', 0.789, { speed: 0.015 });
          }],
          [3.2, () => embrace('aaron', 'moses', { at: 0.774 })],
          [L[1], () => { pose('moses', 'point'); pose('aaron', 'stand'); }],
          [L[1] + 3.2, () => {
            pose('moses', 'stand'); pose('aaron', 'stand');
            walk('aaron', 0.728, { speed: 0.028 }); walk('moses', 0.742, { speed: 0.028 });
            walk('donkey', 0.772, { speed: 0.028 }); walk('gershom', 0.758, { speed: 0.028 });
          }],
          [L[2], b => {
            const f = fromOf(b);
            ELD.forEach((id, i) => add(id, { label: '以色列的长老', sex: 'm', age: 'elder', x: X.huts[i % 5] + 0.006, facing: 1, robe: ELDERS[i], glow: 0.15, from: f }));
            spread(ELD, 0.664, 0.714, { speed: 0.03, seed: 12 });
            crowdWalk('israel', 0.612, 0.664, { speed: 0.03 });
            crowdWalk('israel2', 0.64, 0.7, { speed: 0.03 });
            sfx(b, 'crowd', { soft: true });
          }],
          [L[2] + 3, () => { face('aaron', -1); face('moses', -1); pose('aaron', 'raise'); crowdFace('israel', 1); crowdFace('israel2', 1); }],
          [L[2] + 5.5, b => { pose('aaron', 'stand'); pose('moses', 'raise'); glint(b, 'moses', [255, 240, 210], 0.7); }],
          [L[2] + 7.5, b => {
            pose('moses', 'stand');
            ELD.forEach(prostrate);
            crowdPose('israel', 'bow'); crowdPose('israel2', 'bow');
            W.set('msVisit', 1, b.instant);
            if (!b.instant) fx().ring(0.68 * W.w, gY(2, 0.68) - 20 * LS(2), [255, 236, 190], M() * 0.45, 3, 2);
            sfx(b, 'harp');
          }],
        ]);
      },
    },
  ];

  const MOSES_B = { text: '孩子渐长，妇人把他带到法老的女儿那里，就作了她的儿子。<br>她给孩子起名叫摩西，意思说：「因我把他从水里拉出来。」', ref: '出埃及记 2:10' };
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '摩西', sub: '出埃及记 1 — 4', tint: [255, 214, 160], music: 'joseph', outro: 16,
    intro: INTRO,
    // 全书终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '摩西': MOSES_B,
      '亚伦': { text: '耶和华对亚伦说：「你往旷野去迎接摩西。」他就去，在神的山遇见摩西，和他亲嘴。', ref: '出埃及记 4:27' },
      '法老': { text: '有不认识约瑟的新王起来，治理埃及，', ref: '出埃及记 1:8' },
      '督工的': { text: '于是埃及人派督工的辖制他们，加重担苦害他们。', ref: '出埃及记 1:11' },
      '以色列人': { text: '只是越发苦害他们，他们越发多起来，越发蔓延……', ref: '出埃及记 1:12' },
      '希伯来人': { text: '后来，摩西长大，他出去到他弟兄那里，看他们的重担，<br>见一个埃及人打希伯来人的一个弟兄。', ref: '出埃及记 2:11' },
      '施弗拉': { text: '但是收生婆敬畏神，不照埃及王的吩咐行，竟存留男孩的性命。', ref: '出埃及记 1:17' },
      '普阿': { text: '但是收生婆敬畏神，不照埃及王的吩咐行，竟存留男孩的性命。', ref: '出埃及记 1:17' },
      '希伯来妇人': { text: '收生婆对法老说：「因为希伯来妇人与埃及妇人不同；希伯来妇人本是健壮的……」', ref: '出埃及记 1:19' },
      '孩子的母亲': { text: '那女人怀孕，生一个儿子，见他俊美，就藏了他三个月……', ref: '出埃及记 2:2' },
      '孩子的姊姊': { text: '孩子的姊姊远远站着，要知道他究竟怎么样。', ref: '出埃及记 2:4' },
      '法老的女儿': { text: '她打开箱子，看见那孩子。孩子哭了，她就可怜他，说：「这是希伯来人的一个孩子。」', ref: '出埃及记 2:6' },
      '使女': { text: '法老的女儿来到河边洗澡，她的使女们在河边行走。', ref: '出埃及记 2:5' },
      '蒲草箱': { text: '后来不能再藏，就取了一个蒲草箱，抹上石漆和石油，将孩子放在里头，把箱子搁在河边的芦荻中。', ref: '出埃及记 2:3' },
      '尼罗河': { text: '法老吩咐他的众民说：「以色列人所生的男孩，你们都要丢在河里……」', ref: '出埃及记 1:22' },
      '比东': { text: '他们为法老建造两座积货城，就是比东和兰塞。', ref: '出埃及记 1:11' },
      '兰塞': { text: '他们为法老建造两座积货城，就是比东和兰塞。', ref: '出埃及记 1:11' },
      '砖场': { text: '无论是和泥，是做砖，是做田间各样的工，在一切的工上都严严地待他们。', ref: '出埃及记 1:14' },
      '以色列人的房屋': { text: '收生婆因为敬畏神，神便叫她们成立家室。', ref: '出埃及记 1:21' },
      '法老的宫': { text: '法老听见这事，就想杀摩西，但摩西躲避法老，逃往米甸地居住。', ref: '出埃及记 2:15' },
      '井': { text: '一日，他在井旁坐下。米甸的祭司有七个女儿；她们来打水，打满了槽，要饮父亲的群羊。', ref: '出埃及记 2:16' },
      '米甸祭司的女儿': { text: '一日，他在井旁坐下。米甸的祭司有七个女儿；她们来打水，打满了槽，要饮父亲的群羊。', ref: '出埃及记 2:16' },
      '牧羊的人': { text: '有牧羊的人来，把她们赶走了，摩西却起来帮助她们，又饮了她们的群羊。', ref: '出埃及记 2:17' },
      '西坡拉': { text: '摩西甘心和那人同住；那人把他的女儿西坡拉给摩西为妻。', ref: '出埃及记 2:21' },
      '革舜': { text: '西坡拉生了一个儿子，摩西给他起名叫革舜，意思说：「因我在外邦作了寄居的。」', ref: '出埃及记 2:22' },
      '叶忒罗': { text: '叶忒罗对摩西说：「你可以平平安安地去吧！」', ref: '出埃及记 4:18' },
      '叶忒罗的帐棚': { text: '于是，摩西回到他岳父叶忒罗那里……', ref: '出埃及记 4:18' },
      '叶忒罗的羊群': { text: '摩西牧养他岳父米甸祭司叶忒罗的羊群；一日领羊群往野外去，到了神的山，就是何烈山。', ref: '出埃及记 3:1' },
      '驴': { text: '摩西就带着妻子和两个儿子，叫他们骑上驴，回埃及地去。摩西手里拿着神的杖。', ref: '出埃及记 4:20' },
      '何烈山': { text: '摩西牧养他岳父米甸祭司叶忒罗的羊群；一日领羊群往野外去，到了神的山，就是何烈山。', ref: '出埃及记 3:1' },
      '荆棘': { text: '耶和华的使者从荆棘里火焰中向摩西显现。摩西观看，不料，荆棘被火烧着，却没有烧毁。', ref: '出埃及记 3:2' },
      '燃烧的荆棘': { text: '神对摩西说：「我是自有永有的」；又说：「你要对以色列人这样说：『那自有的打发我到你们这里来。』」', ref: '出埃及记 3:14' },
      '鞋': { text: '神说：「不要近前来。当把你脚上的鞋脱下来，因为你所站之地是圣地」；', ref: '出埃及记 3:5' },
      '杖': { text: '耶和华说：「丢在地上。」他一丢下去，就变作蛇；摩西便跑开。', ref: '出埃及记 4:3' },
      '以色列的长老': { text: '摩西、亚伦就去招聚以色列的众长老。', ref: '出埃及记 4:29' },
      '金字塔': { text: '以色列的众子，各带家眷，和雅各一同来到埃及。', ref: '出埃及记 1:1' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._moses = { get S() { return S; }, P, X, FXL, FIRE };
})(window.GS);
