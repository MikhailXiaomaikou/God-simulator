/* ─────────────────────────────────────────────────────────────
 * book/jacob.js —— 卷 · 雅各（创世记 25:19 — 36:43）
 *
 * 两国在利百加腹内；红豆汤与长子的名分；神向以撒显现、百倍的收成与三口井、别是巴的夜；
 * 天上的甘露、地上的肥土——被夺去的祝福；伯特利：梯子立在地上，头顶着天，神的使者上去下来，
 * 「我也与你同在」；井边的拉结，七年如同几天；利亚与拉结，众子一个一个生在哈兰；
 * 「神顾念拉结」——约瑟；有点有斑的羊群；「你要回你祖、你父之地」；基列的石堆；
 * 玛哈念的两队神的军兵；雅博渡口的夜里摔跤直到黎明，「以色列」自微光中聚成；
 * 以扫跑来，两个人就哭了；示剑的黑暗；「起来！上伯特利去」；拉结死在以法他的路旁，便雅悯；
 * 以撒归到他列祖那里；以扫就是以东，他的族长如远去的名字，散往西珥。
 *
 * 本卷的布景（自画）：帐棚、井（哈兰的井口压着大石头）、红豆汤的火、百倍收成的田、
 * 伯特利的石枕与柱子、天梯（一道自地通天的光的阶梯，使者上去下来——本卷的标志）、
 * 饮羊的水槽与剥皮的枝子、基列的石堆、雅博河、示剑城与橡树、坛、拉结的墓碑、麦比拉洞、西珥山。
 * 画面的方位：左 = 南地（以撒的家、别是巴、幔利、以法他），往右是伯特利、雅博河、基列，右端是哈兰。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'jacob';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('jbLadder', 'lin', 0.22);   // 天梯（28:12）
  W.defineLevel('jbDrought', 'exp', 0.45);  // 饥荒（26:1）
  W.defineLevel('jbDew', 'exp', 0.6);       // 天上的甘露（27:28）
  W.defineLevel('jbShadow', 'exp', 0.45);   // 示剑的黑暗（34）
  W.defineLevel('jbSeir', 'exp', 0.3);      // 西珥山——以东（32:3；36:8）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    spring: 0.505, tentI: 0.545, tentR: 0.585, stew: 0.628, field: 0.6,
    esek: 0.628, sitnah: 0.672, rehoboth: 0.716, altarI: 0.622,
    bethel: 0.66, ladder: 0.676, altarB: 0.642,
    ephrath: 0.605, tentM: 0.54, cave: 0.5,
    city: 0.668, altarS: 0.7, tentS: 0.727, oak: 0.752,
    meet: 0.69, jabbok: 0.776, peniel: 0.792,
    mahanaim: 0.8, gilead: 0.818,
    troughs: 0.8, wellH: 0.85, tentJ: 0.886, tentRa: 0.922, tentLa: 0.965,
  };
  const ROBE = {
    isaac: [150, 132, 100], rebekah: [176, 96, 88], esau: [172, 82, 58], jacob: [98, 106, 140], laban: [132, 114, 84],
    rachel: [192, 132, 118], leah: [142, 118, 150], bilhah: [172, 150, 118], zilpah: [154, 140, 112],
    man: [222, 216, 202], midwife: [150, 128, 108],
    reuben: [138, 98, 76], simeon: [112, 92, 80], levi: [118, 110, 142], judah: [158, 124, 72], dan: [104, 96, 84], naphtali: [118, 132, 100],
    gad: [132, 104, 96], asher: [156, 142, 100], issachar: [112, 100, 124], zebulun: [94, 120, 134], dinah: [196, 142, 152],
    joseph: [206, 172, 116], benjamin: [184, 162, 128],
  };
  // 哈兰所生的孩子：[x, 纵深 v, 性别]（v 越大越靠前）
  const KID = {
    reuben: [0.866, 0.16, 'm'], simeon: [0.879, 0.3, 'm'], levi: [0.892, 0.1, 'm'], judah: [0.905, 0.24, 'm'],
    dan: [0.934, 0.18, 'm'], naphtali: [0.947, 0.32, 'm'], gad: [0.838, 0.22, 'm'], asher: [0.851, 0.34, 'm'],
    issachar: [0.862, 0.44, 'm'], zebulun: [0.884, 0.4, 'm'], dinah: [0.9, 0.46, 'f'], joseph: [0.93, 0.08, 'm'],
  };
  const LEAH_KIDS = ['reuben', 'simeon', 'levi', 'judah', 'issachar', 'zebulun', 'dinah'];
  const SONS12 = ['reuben', 'simeon', 'levi', 'judah', 'dan', 'naphtali', 'gad', 'asher', 'issachar', 'zebulun', 'joseph', 'benjamin'];
  const FAMILY = ['jacob', 'leah', 'rachel', 'bilhah', 'zilpah', 'reuben', 'simeon', 'levi', 'judah', 'dan', 'naphtali', 'gad', 'asher', 'issachar', 'zebulun', 'dinah', 'joseph', 'benjamin'];
  // 一家人在路上的次序（向左走时，其余的人跟在雅各右后方）
  const HH = [
    ['rachel', 0.016], ['joseph', 0.022], ['benjamin', 0.027],
    ['leah', 0.04], ['reuben', 0.046], ['simeon', 0.052], ['levi', 0.058], ['judah', 0.064], ['issachar', 0.07], ['zebulun', 0.076], ['dinah', 0.082],
    ['bilhah', 0.094], ['dan', 0.1], ['naphtali', 0.106],
    ['zilpah', 0.118], ['gad', 0.124], ['asher', 0.13],
    ['cam1', 0.15], ['cam2', 0.174], ['cam3', 0.198], ['don1', 0.218],
  ];
  const FLOCKS = ['flockS', 'goatS', 'flockS2'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { twins: 0, stars: [] }; }

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
  const lighten = (c, k) => U.mixRGB(c, [238, 228, 208], k == null ? 0.35 : k);

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const fig = id => { const c = C(); return c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { C().walk(id, x, o); }
  function run(id, x, o) { const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
  function pose(id, p, o) { C().pose(id, p, o); }
  function face(id, d) { C().face(id, d); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function relabel(id, label) { const f = fig(id); if (f) f.label = label; }
  function hold(id, what) {        // 手中之物（杖、水瓶、包袱……）
    const c = C();
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, what || null)); return; }
    const f = fig(id); if (f) f.prop = what || null;
  }
  function carry(id, what) {       // 怀中抱着（婴孩 / 羊羔）
    const c = C();
    if (c.carry) { U.safe('cast.carry', () => c.carry(id, what || null)); return; }
    const f = fig(id); if (f) f.carry = what || null;
  }
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return null;
    return U.safe('cast.herd', () => c.herd(gid, o));
  }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function ride(id, mount) { const c = C(); if (c.ride) U.safe('cast.ride', () => c.ride(id, mount)); }
  function holdHands(a, b, on) { const c = C(); if (c.holdHands) U.safe('cast.hands', () => c.holdHands(a, b, on)); }
  function embrace(a, b, o) {
    const c = C();
    if (c.embrace) { U.safe('cast.embrace', () => c.embrace(a, b, o)); return; }
    const A = fig(a), B = fig(b);
    if (!A || !B) return;
    const mid = (A.nx + B.nx) / 2;
    walk(a, mid - 0.004, { pose: 'stand', speed: 0.07 }); walk(b, mid + 0.004, { pose: 'stand', speed: 0.07 });
  }

  // 旁白（极少用：经文大多在每一句的 verse 里，按时序显出）
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

  // 一整个昼夜（dur 秒）：时辰走到次日的同一刻（W.passDay 只走到下一个白昼的静止时辰）
  function fullDay(b, dur) {
    const t0 = U.fract(W.cycling ? W.clockTo : W.clock);
    W.goTo(t0 < 0.5 ? t0 + 0.5 : t0 - 0.5, dur * 0.5, b.instant);
    W.goTo(t0, dur, b.instant);
  }

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * (f.isAnimal ? 0.6 : 1) * frac];
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    const h = f.isAnimal ? 20 * LS(l) : 34 * LS(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0));
    return [x, y - h * frac];
  }
  // 名字的位置：在画面之内
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某人头上聚成一个名字（微尘自 src 而来）
  function nameOver(b, id, str, rgb, src, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.7, W.h * 0.8];
    const size = (o.size || 0.045) * M(), n = Array.from(str).length;
    const c = nameAt(p[0], p[1] - size * (o.lift || 0.95) - 6, size, n);
    const from = src || (() => [p[0] + rand(-50, 50) * SU(), p[1] + rand(-20, 40) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, from, { hold: o.hold || 2.4, dot: o.dot, delay: o.delay });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0]));
  }
  const srcAround = (id, r) => () => { const p = figPt(id, 0.5) || [W.w * 0.7, W.h * 0.8]; const k = (r || 60) * SU(); return [p[0] + rand(-k, k), p[1] + rand(-k * 0.6, k * 0.4)]; };
  const srcGround = (xf, w) => () => { const x = (xf + rand(-1, 1) * (w || 0.06)) * W.w, g = gY(2, x / W.w); return [x, g + rand(0, 1) * (W.h - g) * 0.7]; };
  const srcSky = () => [rand(0.1, 0.9) * W.w, rand(0.02, 0.45) * W.h];

  // ════════════════════════════════════════════════════════════
  //  布景：物件
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.9, fire: 0.6, lit: 0.7, grow: 0.3, open: 0.45, stand: 0.45, oil: 0.5, gold: 0.14, dark: 0.3, ember: 0.35, seal: 0.7, rods: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, { x, layer, size, label, lid, show, fire, lit, grow, open, stand, oil, gold, dark, ember, seal, rods, tx, spd })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind: kind || 'tent', x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02, lid: false };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'size', 'label', 'lid', 'spd']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.tx != null) p.tx = o.tx;
    if (!isNew && p.dying && o.show !== false) { p.dying = false; p.ta = 1; }
    if (!p.model) p.model = MODEL[p.kind] ? MODEL[p.kind](p) : null;
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
    oak(p) {
      const r = U.mulberry32(p.seed * 7919 + 13), blobs = [], br = [];
      for (let i = 0; i < 17; i++) {
        const a = Math.PI * (0.04 + 0.92 * (i / 16));
        blobs.push([-Math.cos(a) * (0.44 + r() * 0.12) + (r() - 0.5) * 0.08, -0.6 - Math.sin(a) * (0.24 + r() * 0.1) + (r() - 0.5) * 0.06, 0.12 + r() * 0.09, 0]);
      }
      for (let i = 0; i < 7; i++) blobs.push([(r() - 0.5) * 0.66, -0.66 - r() * 0.14, 0.17 + r() * 0.08, 0]);
      blobs.forEach(b => { b[3] = b[2] * (0.68 + r() * 0.16); });
      for (let i = 0; i < 4; i++) br.push([(i - 1.5) * 0.19 + (r() - 0.5) * 0.08, -0.6 - r() * 0.14]);
      return { blobs, br, lean: (r() - 0.5) * 0.05 };
    },
    altar(p) {
      const r = U.mulberry32(p.seed * 131 + 7), st = [];
      [[4, 0], [3, 1], [2, 2]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.48 + (r() - 0.5) * 0.08, -0.2 - row * 0.34 + (r() - 0.5) * 0.04, 0.27 + r() * 0.06, 0.19 + r() * 0.04, (r() - 0.5) * 0.4]);
      });
      return { st };
    },
    heap(p) {
      const r = U.mulberry32(p.seed + 77), st = [];
      [[6, 0], [5, 1], [4, 2], [2, 3], [1, 4]].forEach(([n, row]) => {
        for (let i = 0; i < n; i++) st.push([(i - (n - 1) / 2) * 0.44 + (r() - 0.5) * 0.1, -0.18 - row * 0.3 + (r() - 0.5) * 0.05, 0.25 + r() * 0.07, 0.17 + r() * 0.05, (r() - 0.5) * 0.5]);
      });
      return { st };
    },
    city(p) {
      const r = U.mulberry32(p.seed * 104729 + 3), n = 11, hs = [];
      const half = 0.42;
      for (let i = 0; i < n; i++) {
        const ox = (i / (n - 1) - 0.5) * 2 * half + (r() - 0.5) * 0.05;
        hs.push({ ox, w: 0.07 + r() * 0.06, h: (0.12 + r() * 0.16) * (1 - 0.45 * Math.abs(ox) / half), dome: r() < 0.16, win: r() < 0.7, tw: r() * TAU });
      }
      hs.sort((a, b) => b.h - a.h);
      return { hs, half, gate: (r() - 0.5) * 0.2 };
    },
    tent(p) {
      const r = U.mulberry32(p.seed + 11);
      return { pk: [0.9 + r() * 0.1, 0.8 + r() * 0.14, 0.95 + r() * 0.05], tilt: (r() - 0.5) * 0.06 };
    },
    tomb(p) {
      const r = U.mulberry32(p.seed + 23), st = [];
      for (let i = 0; i < 7; i++) st.push([(i - 3) * 0.38 + (r() - 0.5) * 0.12, 0.22 + r() * 0.08, 0.16 + r() * 0.05]);
      return { st };
    },
    cave(p) {
      const r = U.mulberry32(p.seed + 99), pts = [];
      for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([-1 + 2 * t, -Math.sin(t * Math.PI) * (0.78 + r() * 0.22) - (r() - 0.5) * 0.08]); }
      const trees = [[-1.3, 0.7], [1.22, 0.85], [1.5, 0.6]];
      return { pts, trees };
    },
    field(p) {
      const r = U.mulberry32(p.seed + 5), tuft = [];
      for (let i = 0; i < 240; i++) tuft.push([r(), r(), r()]);
      return { tuft };
    },
    stream(p) {
      const r = U.mulberry32(p.seed + 3), gl = [];
      for (let i = 0; i < 18; i++) gl.push([r(), r() - 0.5, 0.5 + r()]);
      return { gl };
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
      pale: radial([228, 222, 255], 1), ember: radial([255, 96, 40], 1), smoke: radial([132, 124, 118], 0.8, 0.55),
      rose: radial([255, 150, 112], 1), dawn: radial([255, 206, 150], 1),
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
    // 横扫大地的光带（35:12）：下亮上淡
    const s = cnv(64, 128), sg = s.getContext('2d');
    const sh = sg.createLinearGradient(0, 0, 64, 0);
    sh.addColorStop(0, 'rgba(255,226,160,0)'); sh.addColorStop(0.5, 'rgba(255,232,176,1)'); sh.addColorStop(1, 'rgba(255,226,160,0)');
    sg.fillStyle = sh; sg.fillRect(0, 0, 64, 128);
    sg.globalCompositeOperation = 'destination-in';
    const sv = sg.createLinearGradient(0, 0, 0, 128);
    sv.addColorStop(0, 'rgba(0,0,0,0)'); sv.addColorStop(0.7, 'rgba(0,0,0,0.6)'); sv.addColorStop(1, 'rgba(0,0,0,1)');
    sg.fillStyle = sv; sg.fillRect(0, 0, 64, 128);
    SP.band = s;
    // 天梯的光柱：横向高斯，纵向两端柔和
    const f = cnv(64, 256), fg = f.getContext('2d');
    const fh = fg.createLinearGradient(0, 0, 64, 0);
    fh.addColorStop(0, 'rgba(255,236,196,0)'); fh.addColorStop(0.3, 'rgba(255,238,200,0.35)'); fh.addColorStop(0.5, 'rgba(255,246,226,1)');
    fh.addColorStop(0.7, 'rgba(255,238,200,0.35)'); fh.addColorStop(1, 'rgba(255,236,196,0)');
    fg.fillStyle = fh; fg.fillRect(0, 0, 64, 256);
    fg.globalCompositeOperation = 'destination-in';
    const fv = fg.createLinearGradient(0, 0, 0, 256);
    fv.addColorStop(0, 'rgba(0,0,0,0)'); fv.addColorStop(0.08, 'rgba(0,0,0,0.9)'); fv.addColorStop(0.5, 'rgba(0,0,0,0.55)'); fv.addColorStop(0.95, 'rgba(0,0,0,0.9)'); fv.addColorStop(1, 'rgba(0,0,0,0)');
    fg.fillStyle = fv; fg.fillRect(0, 0, 64, 256);
    SP.shaft = f;
    return SP;
  }

  // 确定性的随机表（甘露、尘沙、名字的位置……）
  const RT = [];
  (function () { const r = U.mulberry32(2528); for (let i = 0; i < 512; i++) RT.push(r()); })();
  const rt = i => RT[((i % 512) + 512) % 512];

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
  function smoke(ctx, x, y, k, H, w, seed, rate) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 11, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：物件
  // ════════════════════════════════════════════════════════════
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, hw = 31 * s, h = 23 * s, m = p.model;
    const k = m.pk;
    ctx.globalAlpha = p.a;
    // 绳与橛子
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k[0] * h * 0.86); ctx.lineTo(x - 1.38 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k[2] * h * 0.84); ctx.lineTo(x + 1.36 * hw, y);
    ctx.stroke();
    // 山羊毛织的黑帐棚：三根柱子撑起的顶
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k[0]], [-0.3, -0.74], [0.02, -1.0 * k[1] - 0.06], [0.32, -0.76], [0.62, -0.86 * k[2]], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css([54, 44, 40], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * m.tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([84, 70, 60], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.66, -0.34, 0.34, 0.66]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.74 - Math.abs(f) * 0.06) * h); }
    ctx.stroke();
    // 门帘掀起
    const dw = 0.2 * hw, dh = 0.62 * h, dx = x - 0.04 * hw;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
    // 夜里门口一盏灯；筵席时透出暖光
    const lamp = clamp(nightK() * 1.05, 0, 1) * 0.8 + p.lit;
    if (lamp > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + p.seed);
      ctx.globalAlpha = p.a * Math.min(1, lamp) * fl * 0.55;
      ctx.fillStyle = p.lit > 0.3 ? 'rgb(255,206,130)' : 'rgb(255,160,84)';
      ctx.beginPath(); ctx.moveTo(dx - dw, y); ctx.lineTo(dx - dw * 0.9, y - dh); ctx.lineTo(dx + dw * 0.9, y - dh * 1.04); ctx.lineTo(dx + dw, y); ctx.closePath(); ctx.fill();
      const g = hw * (2.1 + p.lit * 2.2);
      ctx.globalAlpha = p.a * Math.min(1, lamp) * fl * (0.5 + 0.3 * p.lit);
      ctx.drawImage(SP.warm, dx - g / 2, y - dh * 0.5 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let i = k0; i <= k1; i++) { const q = pts[i], X1 = x + (q[0] + q[1] * m.tilt) * hw, Y1 = y + q[1] * h; if (i === k0) ctx.moveTo(X1, Y1); else ctx.lineTo(X1, Y1); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 井：一圈石栏；哈兰的井口压着大石头（29:2），转离井口（29:10）
  function drawWell(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const R = 12 * s, rh = 4.3 * s, hh = 5.5 * s * g;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([128, 116, 98], l);
    ctx.beginPath(); ctx.ellipse(x, y - hh, R, rh, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - R, y - hh, 2 * R, hh);
    ctx.beginPath(); ctx.ellipse(x, y, R, rh, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = css([92, 82, 70], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) { ctx.moveTo(x + i * R * 0.42, y - hh + rh * 0.9); ctx.lineTo(x + i * R * 0.42, y + rh * 0.8); }
    ctx.stroke();
    ctx.fillStyle = css([22, 28, 38], l);
    ctx.beginPath(); ctx.ellipse(x, y - hh - 0.2 * s, R * 0.72, rh * 0.62, 0, 0, TAU); ctx.fill();
    // 水光
    const open = p.lid ? p.open : 1;
    const glint = (0.25 + 0.75 * p.lit) * open;
    if (glint > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(236,244,255)';
      for (let i = 0; i < 4; i++) {
        const gx = x + Math.sin(W.t * 0.9 + i * 1.7 + p.seed) * 5.5 * s, gy = y - hh + (i - 1.5) * 0.6 * s;
        ctx.globalAlpha = p.a * glint * (0.35 + 0.35 * Math.sin(W.t * 3 + i * 2.1)) * (0.4 + 0.6 * W.daylight + nightK() * 0.3);
        ctx.fillRect(gx - 1.6 * s, gy - 0.4, 3.2 * s, Math.max(0.8, 0.9 * s));
      }
      if (p.lit > 0.02) {
        SP || sprites();
        const gg = 70 * s * (0.6 + p.lit);
        ctx.globalAlpha = p.a * p.lit * 0.5;
        ctx.drawImage(SP.gold, x - gg / 2, y - hh - gg / 2, gg, gg);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 井口的大石头
    if (p.lid) {
      ctx.globalAlpha = p.a;
      const o = p.open, sx = x + o * R * 1.75, sy = y - hh - 1.8 * s * (1 - o) + o * (hh + 0.5 * s), th = 3.2 * s;
      ctx.fillStyle = css([112, 104, 94], l);
      ctx.beginPath(); ctx.ellipse(sx, sy + th * 0.5, R * 0.98, rh * 0.95, 0, 0, Math.PI); ctx.fill();
      ctx.fillRect(sx - R * 0.98, sy - th * 0.5, R * 1.96, th);
      ctx.fillStyle = css([140, 132, 120], l);
      ctx.beginPath(); ctx.ellipse(sx, sy - th * 0.5, R * 0.98, rh * 0.95, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([226, 214, 190], l, 0.35 * (0.3 + 0.7 * W.daylight), 0.2);
      ctx.beginPath(); ctx.ellipse(sx, sy - th * 0.5, R * 0.98, rh * 0.95, 0, Math.PI * 1.05, Math.PI * 1.85); ctx.stroke();
    }
    // 迎光的边
    const d = litX() >= x ? 1 : -1;
    ctx.globalAlpha = p.a * 0.45;
    ctx.strokeStyle = css([226, 210, 180], l, 1, 0.25); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.ellipse(x, y - hh, R, rh, 0, d > 0 ? Math.PI * 1.5 : Math.PI, d > 0 ? Math.PI * 2 : Math.PI * 1.5); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 雅各熬的红豆汤（25:29）
  function drawStew(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 2 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([110, 100, 90], l);
    ctx.beginPath();
    for (const o of [-5, 0, 5]) { ctx.moveTo(x + o * s + 2.4 * s, y); ctx.ellipse(x + o * s, y, 2.4 * s, 1.8 * s, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
    flame(ctx, x, y - 1 * s, 6.5 * s, p.fire * p.a, p.seed);
    // 锅
    ctx.globalAlpha = p.a;
    const py = y - 5 * s;
    ctx.fillStyle = css([46, 38, 34], l);
    ctx.beginPath(); ctx.moveTo(x - 6.5 * s, py - 2 * s); ctx.quadraticCurveTo(x - 6.5 * s, py + 4.5 * s, x, py + 4.5 * s); ctx.quadraticCurveTo(x + 6.5 * s, py + 4.5 * s, x + 6.5 * s, py - 2 * s); ctx.closePath(); ctx.fill();
    // 红汤
    SP || sprites();
    ctx.fillStyle = css([176, 58, 38], l, 1, 0.25);
    ctx.beginPath(); ctx.ellipse(x, py - 2 * s, 6.2 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.a * (0.25 + 0.35 * p.fire) * (0.5 + 0.5 * nightK());
    ctx.drawImage(SP.rose, x - 14 * s, py - 16 * s, 28 * s, 28 * s);
    ctx.globalCompositeOperation = 'source-over';
    // 热气
    ctx.strokeStyle = U.rgba(236, 230, 222, 0.22 * p.a * p.fire * (0.4 + 0.6 * W.daylight));
    ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const ph = U.fract(W.t * 0.35 + i / 3), sx = x + (i - 1) * 3 * s, top = py - 3 * s - ph * 16 * s;
      ctx.moveTo(sx, py - 3 * s - ph * 4 * s);
      ctx.quadraticCurveTo(sx + Math.sin(W.t * 2 + i) * 3 * s, top + 4 * s, sx + Math.sin(W.t * 1.4 + i * 2) * 2 * s, top);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 百倍的收成（26:12）：前景里的田，由青转金
  function drawField(ctx, p) {
    const g = p.grow * p.a;
    if (g < 0.01) return;
    const s = LS(2), cx = p.x * W.w, top = gY(2, p.x) + 5 * s, bot = top + (W.h - top) * 0.66;
    const hwT = 0.055 * W.w, hwB = 0.09 * W.w;
    ctx.globalAlpha = g * 0.85;
    ctx.fillStyle = css([88, 66, 44], 2);
    ctx.beginPath();
    ctx.moveTo(cx - hwT, top); ctx.lineTo(cx + hwT, top); ctx.lineTo(cx + hwB, bot); ctx.lineTo(cx - hwB, bot); ctx.closePath(); ctx.fill();
    const col = U.mixRGB([78, 118, 58], [218, 178, 86], p.gold);
    const ROWS = 9;
    ctx.strokeStyle = css(col, 2, 1, 0.05 + 0.15 * p.gold);
    ctx.lineCap = 'round';
    for (let k = 0; k < ROWS; k++) {
      const f = (k + 0.5) / ROWS, y = lerp(top, bot, Math.pow(f, 1.25)), hw = lerp(hwT, hwB, f) * 0.94;
      ctx.lineWidth = Math.max(0.7, lerp(1, 2.6, f) * s);
      ctx.globalAlpha = g * 0.9;
      ctx.beginPath(); ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); ctx.stroke();
    }
    // 麦穗：长高、摇曳
    const hgt = p.grow * (0.4 + 0.6 * p.gold);
    if (hgt > 0.05) {
      const tuft = p.model.tuft, sway = W.wind * 2.2 * s;
      ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.globalAlpha = g;
      ctx.beginPath();
      for (let i = 0; i < tuft.length; i++) {
        const q = tuft[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS;
        const y = lerp(top, bot, Math.pow(f, 1.25)), hw = lerp(hwT, hwB, f) * 0.94;
        const tx = cx + (q[1] * 2 - 1) * hw, th = lerp(3, 10, f) * s * hgt * (0.7 + 0.5 * q[2]);
        const sw = sway * f + Math.sin(W.t * 1.6 + q[2] * 9) * 0.6 * s;
        ctx.moveTo(tx, y); ctx.lineTo(tx + sw, y - th);
      }
      ctx.stroke();
      if (p.gold > 0.3) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,226,150)';
        ctx.globalAlpha = g * (p.gold - 0.3) * 0.5 * (0.3 + 0.7 * W.daylight);
        for (let i = 0; i < tuft.length; i += 3) {
          const q = tuft[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS;
          const y = lerp(top, bot, Math.pow(f, 1.25)), hw = lerp(hwT, hwB, f) * 0.94;
          const tx = cx + (q[1] * 2 - 1) * hw, th = lerp(3, 10, f) * s * hgt * (0.7 + 0.5 * q[2]);
          const sw = sway * f + Math.sin(W.t * 1.6 + q[2] * 9) * 0.6 * s, r = lerp(0.6, 1.5, f) * s;
          ctx.fillRect(tx + sw - r * 0.5, y - th - r, r, r * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // 伯特利的石头：先是枕头，后立作柱子，浇油在上面（28:18；35:14）
  function drawStone(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, st = p.stand;
    const w = lerp(13, 7.5, st) * s, h = lerp(5, 27, st) * s;
    ctx.globalAlpha = p.a;
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const g = 60 * s * (0.8 + p.lit) + h * 1.5;
      ctx.globalAlpha = p.a * p.lit * (0.35 + 0.1 * Math.sin(W.t * 1.2)) * (0.55 + 0.45 * nightK());
      ctx.drawImage(SP.gold, x - g / 2, y - h * 0.6 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    ctx.fillStyle = css([118, 110, 100], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x - w * 0.47, y - h * 0.78);
    ctx.quadraticCurveTo(x - w * 0.42, y - h, x - w * 0.02, y - h * 1.02);
    ctx.quadraticCurveTo(x + w * 0.44, y - h * 1.0, x + w * 0.48, y - h * 0.76);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 214, 196], l, 0.55 * (0.3 + 0.7 * W.daylight) + 0.2 * p.lit, 0.25); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * w * 0.48, y - h * 0.1); ctx.lineTo(x + d * w * 0.47, y - h * 0.78); ctx.quadraticCurveTo(x + d * w * 0.42, y - h, x, y - h * 1.02); ctx.stroke();
    // 浇上的油：一道光润的流痕
    if (p.oil > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 226, 150, 0.55 * p.oil * p.a);
      ctx.lineWidth = Math.max(0.8, 1.6 * s);
      ctx.beginPath(); ctx.moveTo(x - w * 0.05, y - h * 1.0); ctx.quadraticCurveTo(x + w * 0.12, y - h * 0.62, x + w * 0.05, y - h * 0.62 * (1 - p.oil * 0.5)); ctx.stroke();
      ctx.fillStyle = U.rgba(255, 244, 214, 0.8 * p.oil * p.a * (0.7 + 0.3 * Math.sin(W.t * 2.3)));
      ctx.beginPath(); ctx.arc(x - w * 0.06, y - h * 0.98, Math.max(0.8, 1.3 * s), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
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
      flame(ctx, x, top + 1 * s, 13 * s, p.fire * p.a, p.seed);
    }
  }

  // 饮羊的水槽，插着剥成白纹的枝子（30:37–38）
  function drawTroughs(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 3 * s, w = 46 * s, h = 5 * s;
    ctx.globalAlpha = p.a * p.grow;
    ctx.fillStyle = css([104, 78, 54], l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css([74, 56, 40], l);
    ctx.fillRect(x - w / 2 - 1.5 * s, y - h - 1 * s, 3 * s, h + 1 * s); ctx.fillRect(x + w / 2 - 1.5 * s, y - h - 1 * s, 3 * s, h + 1 * s);
    // 水面
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(160,196,230)';
    ctx.globalAlpha = p.a * p.grow * (0.25 + 0.3 * W.daylight + 0.2 * nightK());
    ctx.fillRect(x - w / 2 + 2 * s, y - h, w - 4 * s, Math.max(0.8, 1 * s));
    ctx.globalCompositeOperation = 'source-over';
    // 剥了皮的枝子：白纹
    const rk = p.rods * p.a;
    if (rk > 0.01) {
      const n = 6, L = 17 * s * rk;
      for (let i = 0; i < n; i++) {
        const rx = x - w / 2 + (i + 0.5) * w / n, lean = (rt(i * 7 + 3) - 0.5) * 0.35, seg = 5;
        for (let k = 0; k < seg; k++) {
          const a0 = k / seg, a1 = (k + 1) / seg;
          ctx.strokeStyle = k % 2 ? css([238, 230, 210], l, 1, 0.15) : css([96, 74, 52], l);
          ctx.lineWidth = Math.max(0.7, 1.2 * s);
          ctx.globalAlpha = rk;
          ctx.beginPath(); ctx.moveTo(rx + lean * L * a0, y - h - L * a0); ctx.lineTo(rx + lean * L * a1, y - h - L * a1); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // 基列的石堆与柱子（31:45–49）
  function drawHeap(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 2 * s, u = 11 * s, m = p.model, n = m.st.length;
    const shown = p.grow * n;
    ctx.globalAlpha = p.a;
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const g = 130 * s;
      ctx.globalAlpha = p.a * p.lit * 0.45;
      ctx.drawImage(SP.gold, x - g / 2, y - u - g / 2, g, g);
      ctx.globalAlpha = p.a * p.lit * 0.25;
      ctx.drawImage(SP.beam, x - 14 * s, -10, 28 * s, y - u + 10);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    // 柱子
    const px = x + 1.9 * u, ph = 24 * s * clamp(p.grow * 1.6, 0, 1);
    if (ph > 0.5) {
      ctx.fillStyle = css([116, 108, 98], l);
      ctx.beginPath(); ctx.moveTo(px - 3.2 * s, y); ctx.lineTo(px - 2.8 * s, y - ph * 0.85); ctx.quadraticCurveTo(px, y - ph * 1.04, px + 2.9 * s, y - ph * 0.82); ctx.lineTo(px + 3.3 * s, y); ctx.closePath(); ctx.fill();
    }
    if (shown > 0.01) {
      ctx.fillStyle = css([130, 120, 104], l);
      ctx.beginPath();
      for (let i = 0; i < n && i < shown; i++) {
        const q = m.st[i], k = clamp(shown - i, 0, 1), cx = x + q[0] * u, cy = y + q[1] * u - (1 - k) * 8 * s;
        ctx.moveTo(cx + q[2] * u, cy); ctx.ellipse(cx, cy, q[2] * u, q[3] * u * k, q[4], 0, TAU);
      }
      ctx.fill();
      const d = litX() >= x ? 1 : -1;
      ctx.fillStyle = css([214, 200, 176], l, 0.32 * (0.3 + 0.7 * W.daylight), 0.2);
      ctx.beginPath();
      for (let i = 0; i < n && i < shown - 0.5; i++) {
        const q = m.st[i], cx = x + q[0] * u + d * q[2] * u * 0.25, cy = y + q[1] * u - q[3] * u * 0.35;
        ctx.moveTo(cx + q[2] * u * 0.5, cy); ctx.ellipse(cx, cy, q[2] * u * 0.5, q[3] * u * 0.38, q[4], 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 雅博河：自中丘后面流下，穿过近地，越往前越宽
  const STR_N = 16, STR_L = new Float32Array(STR_N * 2), STR_R = new Float32Array(STR_N * 2), STR_C = new Float32Array(STR_N * 2);
  function streamGeom(p) {
    const s = LS(2), x0 = p.x * W.w, y0 = gY(2, p.x) + 1, x1 = x0 - 0.05 * W.w, y1 = W.h + 6;
    const c1x = x0 + 0.03 * W.w, c1y = lerp(y0, y1, 0.35), c2x = x1 - 0.035 * W.w, c2y = lerp(y0, y1, 0.72);
    for (let i = 0; i < STR_N; i++) {
      const t = i / (STR_N - 1), mt = 1 - t;
      const X1 = mt * mt * mt * x0 + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * x1;
      const Y1 = mt * mt * mt * y0 + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * y1;
      STR_C[2 * i] = X1; STR_C[2 * i + 1] = Y1;
    }
    for (let i = 0; i < STR_N; i++) {
      const t = i / (STR_N - 1);
      const i0 = Math.max(0, i - 1), i1 = Math.min(STR_N - 1, i + 1);
      let dx = STR_C[2 * i1] - STR_C[2 * i0], dy = STR_C[2 * i1 + 1] - STR_C[2 * i0 + 1];
      const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
      const w = lerp(2.5, 34, Math.pow(t, 1.3)) * s;
      STR_L[2 * i] = STR_C[2 * i] - dy * w; STR_L[2 * i + 1] = STR_C[2 * i + 1] + dx * w * 0.35;
      STR_R[2 * i] = STR_C[2 * i] + dy * w; STR_R[2 * i + 1] = STR_C[2 * i + 1] - dx * w * 0.35;
    }
  }
  function drawStream(ctx, p) {
    streamGeom(p);
    const s = LS(2);
    ctx.globalAlpha = p.a;
    // 河岸（深）
    ctx.fillStyle = css([58, 50, 38], 2, 0.8);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { const X1 = STR_L[2 * i] - 2.5 * s * (i / STR_N), Y1 = STR_L[2 * i + 1]; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(STR_R[2 * i] + 2.5 * s * (i / STR_N), STR_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 水：映着天
    const sky = U.mixRGB(W.haze, [70, 110, 150], 0.45);
    const lit = 0.35 + 0.65 * W.daylight + 0.15 * nightK();
    ctx.fillStyle = U.rgb(sky[0] * lit, sky[1] * lit, sky[2] * lit);
    ctx.beginPath();
    for (let i = 0; i < STR_N; i++) { if (i) ctx.lineTo(STR_L[2 * i], STR_L[2 * i + 1]); else ctx.moveTo(STR_L[0], STR_L[1]); }
    for (let i = STR_N - 1; i >= 0; i--) ctx.lineTo(STR_R[2 * i], STR_R[2 * i + 1]);
    ctx.closePath(); ctx.fill();
    // 顺流而下的粼光
    ctx.globalCompositeOperation = 'lighter';
    const gl = p.model.gl, moon = W.lv.moon * W.night * 0.6;
    ctx.fillStyle = moon > W.daylight * 0.8 ? 'rgb(214,226,255)' : 'rgb(255,246,226)';
    for (let i = 0; i < gl.length; i++) {
      const q = gl[i], t = U.fract(q[0] + W.t * 0.035 * q[2]), f = t * (STR_N - 1), k = Math.min(STR_N - 2, Math.floor(f)), r = f - k;
      const cx = lerp(STR_C[2 * k], STR_C[2 * k + 2], r), cy = lerp(STR_C[2 * k + 1], STR_C[2 * k + 3], r);
      const w = lerp(2.5, 34, Math.pow(t, 1.3)) * s;
      ctx.globalAlpha = p.a * (0.18 + 0.4 * W.daylight + moon) * Math.sin(t * Math.PI) * (0.5 + 0.5 * Math.sin(W.t * 2 + i));
      const gw = w * 0.5 * (0.5 + 0.5 * q[2]);
      ctx.fillRect(cx + q[1] * w - gw / 2, cy, gw, Math.max(0.7, 0.9 * s));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function drawOak(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, H = 88 * s, x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
    const sway = W.wind * 0.01 * H + Math.sin(W.t * 0.55 + p.seed) * 0.004 * H;
    ctx.globalAlpha = p.a;
    const trunk = css([60, 44, 32], l);
    ctx.fillStyle = trunk;
    ctx.beginPath();
    ctx.moveTo(x - 0.08 * H, y);
    ctx.quadraticCurveTo(x - 0.028 * H, y - 0.26 * H, x - 0.036 * H + m.lean * H, y - 0.5 * H);
    ctx.lineTo(x + 0.036 * H + m.lean * H, y - 0.5 * H);
    ctx.quadraticCurveTo(x + 0.03 * H, y - 0.26 * H, x + 0.085 * H, y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = trunk; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, 0.026 * H);
    ctx.beginPath();
    for (const b of m.br) { ctx.moveTo(x + m.lean * H, y - 0.46 * H); ctx.quadraticCurveTo(x + b[0] * 0.45 * H, y - 0.56 * H, x + b[0] * H + sway, y + b[1] * H); }
    ctx.stroke();
    ctx.fillStyle = css([44, 68, 40], l);
    ctx.beginPath();
    for (const b of m.blobs) { const cx = x + b[0] * H + sway, cy = y + b[1] * H; ctx.moveTo(cx + b[2] * H, cy); ctx.ellipse(cx, cy, b[2] * H, b[3] * H, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([96, 128, 72], l, 0.5 * (0.2 + 0.8 * W.daylight), 0.1);
    ctx.beginPath();
    for (let i = 0; i < m.blobs.length; i++) {
      const b = m.blobs[i];
      if (b[0] * d < -0.08 || i % 2) continue;
      const cx = x + b[0] * H + sway + d * b[2] * H * 0.28, cy = y + b[1] * H - b[3] * H * 0.3;
      ctx.moveTo(cx + b[2] * 0.62 * H, cy); ctx.ellipse(cx, cy, b[2] * H * 0.62, b[3] * H * 0.5, 0, 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 示剑城（中景的丘上）：夜里有窗光；34 章里灯火熄灭，一阵暗红
  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l), u = 100 * s, x = p.x * W.w, m = p.model;
    const body = U.mixRGB([184, 160, 126], [96, 84, 76], p.dark * 0.6), side = U.mixRGB([148, 124, 98], [70, 60, 56], p.dark * 0.6);
    ctx.globalAlpha = p.a;
    const wx0 = x - m.half * u, wx1 = x + m.half * u, wh = 0.07 * u;
    ctx.fillStyle = css(side, l);
    ctx.beginPath();
    ctx.moveTo(wx0, gY(l, wx0 / W.w) + 2);
    for (let i = 0; i <= 8; i++) { const xx = lerp(wx0, wx1, i / 8); ctx.lineTo(xx, gY(l, xx / W.w) - wh); }
    ctx.lineTo(wx1, gY(l, wx1 / W.w) + 2);
    ctx.closePath(); ctx.fill();
    const lx = litX() >= x ? 1 : -1;
    const wins = [];
    for (const h of m.hs) {
      const hx = x + h.ox * u, g = gY(l, hx / W.w) + 2, hh = h.h * u, ww = h.w * u;
      ctx.fillStyle = css(body, l);
      ctx.fillRect(hx - ww / 2, g - hh, ww, hh);
      if (h.dome) { ctx.beginPath(); ctx.ellipse(hx, g - hh, ww * 0.4, ww * 0.36, 0, Math.PI, 0); ctx.fill(); }
      ctx.fillStyle = css(side, l, 0.8);
      ctx.fillRect(lx > 0 ? hx - ww / 2 : hx + ww * 0.2, g - hh, ww * 0.3, hh);
      if (h.win) wins.push([hx, g - hh, hh, h.tw]);
    }
    // 城门
    const gx = x + m.gate * u, gg = gY(l, gx / W.w) + 2;
    ctx.fillStyle = css([30, 24, 22], l);
    ctx.beginPath(); ctx.moveTo(gx - 3 * s, gg); ctx.lineTo(gx - 3 * s, gg - 5 * s); ctx.quadraticCurveTo(gx, gg - 8 * s, gx + 3 * s, gg - 5 * s); ctx.lineTo(gx + 3 * s, gg); ctx.closePath(); ctx.fill();
    const nk = nightK() * (1 - p.dark);
    if (nk > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,178,96)';
      const ws = Math.max(1, 2.2 * s);
      for (const w of wins) {
        ctx.globalAlpha = p.a * nk * (0.55 + 0.35 * Math.sin(W.t * 0.8 + w[3]));
        ctx.fillRect(w[0] - ws / 2, w[1] + w[2] * 0.35, ws, ws * 1.4);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (p.ember > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const g = u * (1.2 + 0.6 * p.ember);
      ctx.globalAlpha = p.a * p.ember * (0.4 + 0.15 * Math.sin(W.t * 3 + p.seed));
      ctx.drawImage(SP.ember, x - g / 2, gY(l, p.x) - u * 0.1 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      smoke(ctx, x, gY(l, p.x) - 12 * s, p.ember * 0.8, W.h * 0.25, 14 * s, 5, 0.05);
    }
    ctx.globalAlpha = 1;
  }

  // 拉结的墓碑（35:20）
  function drawTomb(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) + 2 * s, g = p.grow;
    if (g < 0.01) return;
    const h = 24 * s * g, w = 7 * s;
    ctx.globalAlpha = p.a;
    SP || sprites();
    const k = (0.25 + 0.75 * nightK()) * (0.6 + 0.4 * p.lit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.a * k * 0.35;
    const gg = 80 * s;
    ctx.drawImage(SP.pale, x - gg / 2, y - h * 0.5 - gg / 2, gg, gg);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 142, 130], l);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w * 0.46, y - h * 0.84); ctx.quadraticCurveTo(x, y - h * 1.06, x + w * 0.46, y - h * 0.84); ctx.lineTo(x + w / 2, y);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([118, 110, 100], l);
    ctx.beginPath();
    for (const q of p.model.st) { const cx = x + q[0] * w * 1.6, cy = y - q[1] * 4 * s * g, r = q[2] * 14 * s; ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.66, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([236, 228, 212], l, 0.5 * (0.3 + 0.7 * W.daylight), 0.25); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * w * 0.49, y - h * 0.1); ctx.lineTo(x + d * w * 0.46, y - h * 0.84); ctx.quadraticCurveTo(x + d * w * 0.3, y - h * 1.0, x, y - h * 1.01); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 麦比拉洞（幔利前）
  function drawCave(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s, hw = 32 * s, h = 34 * s, m = p.model;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([42, 60, 40], l);
    ctx.beginPath();
    for (const t of m.trees) { const tx = x + t[0] * hw, ty = gY(l, tx / W.w) + 2 * s, th = t[1] * h * 1.4; ctx.moveTo(tx, ty - th); ctx.quadraticCurveTo(tx + 5 * s, ty - th * 0.5, tx + 3 * s, ty); ctx.lineTo(tx - 3 * s, ty); ctx.quadraticCurveTo(tx - 5 * s, ty - th * 0.5, tx, ty - th); }
    ctx.fill();
    ctx.fillStyle = css([112, 106, 98], l);
    ctx.beginPath();
    m.pts.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([214, 196, 168], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    m.pts.forEach((q, i) => { if (q[0] * d < -0.2) return; const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i && m.pts[i - 1][0] * d >= -0.2) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.stroke();
    const mx = x - 0.12 * hw, mw = 0.3 * hw, mh = 0.48 * h;
    ctx.fillStyle = css([16, 12, 10], l);
    ctx.beginPath(); ctx.moveTo(mx - mw, y); ctx.quadraticCurveTo(mx - mw, y - mh * 1.3, mx, y - mh * 1.3); ctx.quadraticCurveTo(mx + mw, y - mh * 1.3, mx + mw, y); ctx.closePath(); ctx.fill();
    if (p.lit > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.a * p.lit * 0.6;
      const g = mw * 5;
      ctx.drawImage(SP.gold, mx - g / 2, y - mh * 0.6 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = p.a;
    }
    if (p.seal > 0.01) {
      const sx = mx + mw * 1.9 * (1 - p.seal);
      ctx.fillStyle = css([134, 120, 104], l);
      ctx.beginPath(); ctx.ellipse(sx, y - mh * 0.62, mw * 1.08, mh * 0.66, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 抬尸的架（白布覆盖）
  function drawBier(ctx, p) {
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) - 15 * s, len = 30 * s;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([80, 60, 44], l); ctx.lineWidth = Math.max(0.8, 1.3 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - len * 0.62, y + 1.5 * s); ctx.lineTo(x + len * 0.62, y + 1.5 * s); ctx.stroke();
    ctx.fillStyle = css([222, 214, 200], l, 1, 0.1);
    ctx.beginPath(); ctx.moveTo(x - len * 0.5, y); ctx.quadraticCurveTo(x - len * 0.45, y - 5 * s, x - len * 0.15, y - 4.6 * s);
    ctx.quadraticCurveTo(x + len * 0.3, y - 4 * s, x + len * 0.45, y - 5.6 * s); ctx.quadraticCurveTo(x + len * 0.55, y - 2 * s, x + len * 0.5, y); ctx.closePath(); ctx.fill();
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.a * 0.3;
    ctx.drawImage(SP.gold, x - len * 0.6, y - len * 0.6, len * 1.2, len * 1.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 西珥山（以东）：东边（左）的地平线上，一抹赤褐的远山
  const SEIR = [];
  (function () { const r = U.mulberry32(3608); for (let i = 0; i <= 40; i++) { const t = i / 40; SEIR.push(Math.sin(t * Math.PI) * (0.55 + 0.45 * Math.abs(U.noise1(t * 6 + 3.3))) + (r() - 0.5) * 0.06); } })();
  function drawSeir(ctx) {
    const k = W.lv.jbSeir;
    if (k < 0.01) return;
    const x0 = W.w * 0.015, x1 = W.w * 0.3, base = W.horizonY + 1.5, H = W.h * 0.05;
    ctx.globalAlpha = Math.min(1, k);
    ctx.fillStyle = W.shadeCSS([150, 92, 72], 0.8);
    ctx.beginPath();
    ctx.moveTo(x0, base);
    for (let i = 0; i <= 40; i++) ctx.lineTo(lerp(x0, x1, i / 40), base - Math.max(0, SEIR[i]) * H * Math.min(1, k));
    ctx.lineTo(x1, base);
    ctx.closePath(); ctx.fill();
    if (k > 1.01) {                     // 以东诸王之后：赤色的余晖
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (k - 1) * 0.6 * (0.4 + 0.6 * nightK());
      const g = (x1 - x0) * 1.2;
      ctx.drawImage(SP.rose, (x0 + x1) / 2 - g / 2, base - H - g * 0.3, g, g * 0.6);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天梯（28:12）——一道自地通天的光的阶梯，神的使者上去下来
  // ════════════════════════════════════════════════════════════
  const LG = { bx: 0, by: 0, tx: 0, ty: 0, ux: 0, uy: 0, nx: 0, ny: 0, w0: 0, w1: 0, s: 1 };
  function ladderGeom() {
    const s = SU();
    LG.s = s;
    LG.bx = X.ladder * W.w; LG.by = gY(2, X.ladder) + 3 * LS(2);
    LG.tx = LG.bx + W.w * 0.035; LG.ty = -W.h * 0.06;
    const dx = LG.tx - LG.bx, dy = LG.ty - LG.by, d = Math.hypot(dx, dy) || 1;
    LG.ux = dx / d; LG.uy = dy / d; LG.nx = -LG.uy; LG.ny = LG.ux; LG.len = d;
    LG.w0 = 22 * s; LG.w1 = 2.6 * s;
    return LG;
  }
  const LP = [0, 0];
  function lad(t, side) {
    const x = lerp(LG.bx, LG.tx, t), y = lerp(LG.by, LG.ty, t), hw = lerp(LG.w0, LG.w1, Math.pow(t, 0.7)) * side;
    LP[0] = x + LG.nx * hw; LP[1] = y + LG.ny * hw;
    return LP;
  }
  // 发光的人形（天梯上的使者）
  function lightFigure(ctx, x, y, h, a, seed) {
    if (a < 0.01 || h < 0.8) return;
    ctx.globalAlpha = a * 0.55;
    ctx.drawImage(SP.gold, x - h * 0.9, y - h * 1.4, h * 1.8, h * 1.8);
    ctx.globalAlpha = a * 0.92;
    ctx.fillStyle = 'rgb(255,244,222)';
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
  function drawLadder(ctx, A, r0, r1, angels) {
    if (A < 0.004 || r1 <= r0 + 0.001) return;
    SP || sprites();
    ladderGeom();
    const s = LG.s;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    // 光柱：沿梯而上的一道柔光
    {
      const ang = Math.atan2(LG.ux, -LG.uy);
      const L0 = LG.len * r0, L1 = LG.len * r1;
      ctx.save();
      ctx.translate(LG.bx, LG.by); ctx.rotate(ang);
      ctx.globalAlpha = A * 0.34;
      ctx.drawImage(SP.shaft, -LG.w0 * 3.2, -L1, LG.w0 * 6.4, L1 - L0);
      ctx.globalAlpha = A * 0.5;
      ctx.drawImage(SP.shaft, -LG.w0 * 1.3, -L1, LG.w0 * 2.6, L1 - L0);
      ctx.restore();
    }
    // 光雾：沿梯而上
    for (let i = 0; i < 18; i++) {
      const t = (i + 0.5) / 18;
      if (t < r0 || t > r1) continue;
      const x = lerp(LG.bx, LG.tx, t), y = lerp(LG.by, LG.ty, t), r = lerp(110, 34, t) * s;
      ctx.globalAlpha = A * 0.16 * (0.85 + 0.15 * Math.sin(W.t * 1.3 + i));
      ctx.drawImage(SP.gold, x - r, y - r, 2 * r, 2 * r);
    }
    // 地上的一片光（雅各躺卧之处）
    if (r0 < 0.05) {
      const g = 170 * s;
      ctx.globalAlpha = A * 0.42;
      ctx.drawImage(SP.gold, LG.bx - g, LG.by - g * 0.32, 2 * g, g * 0.64);
    }
    // 两根梯柱：宽而淡的光 + 细而亮的线
    const N = 36;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const t = lerp(r0, r1, i / N), p = lad(t, side); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.strokeStyle = 'rgb(255,222,160)'; ctx.lineWidth = 6.5 * s; ctx.globalAlpha = A * 0.16; ctx.stroke();
      ctx.strokeStyle = 'rgb(255,246,224)'; ctx.lineWidth = Math.max(1, 1.5 * s); ctx.globalAlpha = A * 0.8; ctx.stroke();
    }
    // 阶：光自下而上流过
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(255,240,208)';
    const R = 32;
    for (let i = 1; i < R; i++) {
      const t = Math.pow(i / R, 0.8);
      if (t < r0 || t > r1) continue;
      const a0 = lad(t, -1), ax = a0[0], ay = a0[1], b0 = lad(t, 1);
      const flow = Math.pow(0.5 + 0.5 * Math.sin(t * 24 - W.t * 2.1), 3);
      const wd = Math.max(0.8, lerp(2.4, 0.8, t) * s);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(b0[0], b0[1]);
      ctx.globalAlpha = A * (0.12 + 0.2 * flow) * (1 - t * 0.4);
      ctx.lineWidth = wd * 3.2; ctx.stroke();
      ctx.globalAlpha = A * (0.4 + 0.6 * flow) * (1 - t * 0.3);
      ctx.lineWidth = wd; ctx.stroke();
    }
    // 天的门：梯子的头顶着天
    if (r1 > 0.85) {
      let gt = (LG.by - W.h * 0.05) / Math.max(1, LG.by - LG.ty);
      gt = clamp(gt, 0.6, 0.98);
      const gx = lerp(LG.bx, LG.tx, gt), gy = lerp(LG.by, LG.ty, gt);
      let pulse = 0;
      for (const e of FXL) if (e.type === 'gate') { const q = e.t / e.dur; pulse = Math.max(pulse, smoothstep(0, 0.2, q) * (1 - smoothstep(0.6, 1, q))); }
      const k = A * smoothstep(0.85, 1, r1) * (1 + 1.3 * pulse);
      const g1 = 300 * s, g2 = 520 * s;
      ctx.globalAlpha = Math.min(1, k * 0.55);
      ctx.drawImage(SP.white, gx - g1 / 2, gy - g1 / 2, g1, g1);
      ctx.globalAlpha = Math.min(1, k * 0.3);
      ctx.drawImage(SP.gold, gx - g2 / 2, gy - g2 / 2, g2, g2);
      // 光芒
      ctx.strokeStyle = 'rgb(255,242,214)';
      ctx.lineWidth = Math.max(0.8, 1.2 * s);
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + W.t * 0.04, L = (150 + 90 * rt(i * 5)) * s * (1 + 0.5 * pulse);
        ctx.globalAlpha = Math.min(1, k * 0.09 * (0.6 + 0.4 * Math.sin(W.t * 0.9 + i * 1.7)));
        ctx.beginPath(); ctx.moveTo(gx + Math.cos(a) * 20 * s, gy + Math.sin(a) * 20 * s); ctx.lineTo(gx + Math.cos(a) * L, gy + Math.sin(a) * L); ctx.stroke();
      }
    }
    // 神的使者：左边上去，右边下来
    if (angels > 0.01) {
      const NA = 12, h0 = 32 * LS(2);
      for (let k = 0; k < NA; k++) {
        const up = k % 2 === 0, sp = 0.024 * (0.85 + 0.3 * rt(k * 3 + 1));
        let t = U.fract(k / NA + rt(k * 11) * 0.05 + W.t * sp * (up ? 1 : -1));
        const q = t;
        if (q < r0 || q > r1) continue;
        t = Math.pow(q, 1.15);
        const side = up ? -0.42 : 0.42;
        const p = lad(t, side);
        const hgt = h0 * lerp(1.05, 0.09, Math.pow(t, 0.62));
        const bob = Math.abs(Math.sin(W.t * 3.2 + k * 1.3)) * hgt * 0.04;
        const a = A * angels * smoothstep(0, 0.07, q) * (1 - smoothstep(0.86, 0.99, q));
        lightFigure(ctx, p[0], p[1] - bob, hgt, a, k);
      }
    }
    ctx.restore();
  }
  function ladderState() {
    const lv = W.lv.jbLadder, growing = W.lt.jbLadder >= lv;
    const reach = smoothstep(0, 0.75, lv), A = smoothstep(0, 0.4, lv);
    return growing ? [A, 0, reach, smoothstep(0.45, 0.95, lv)] : [A, 1 - reach, 1, smoothstep(0.2, 0.7, lv)];
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function beam(b, xf, layer, o) {
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 6, xf, l, w: (o.w || 70) * SU(), k: o.k || 1, white: !!o.white });
    if (o.ring !== false) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), o.white ? [226, 232, 255] : [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  function beamOn(b, id, o) { const f = fig(id); if (f) beam(b, f.nx, f.layer, o); }
  function gate(b, dur) { if (!b.instant) FXL.push({ type: 'gate', t: 0, dur: dur || 8 }); }
  function ghost(b, dur) { if (!b.instant) FXL.push({ type: 'ghost', t: 0, dur: dur || 10 }); }
  function mote(b, from, to, c, dur) { if (!b.instant) FXL.push({ type: 'mote', t: 0, dur: dur || 3, a: from, b: to, c: c || [255, 226, 160] }); }
  function touch(b, id) { if (!b.instant) FXL.push({ type: 'touch', t: 0, dur: 2.4, id }); }
  function glint(b, id) { if (!b.instant) FXL.push({ type: 'glint', t: 0, dur: 3.2, id }); }
  function earth(b, xf, dur) { if (!b.instant) FXL.push({ type: 'earth', t: 0, dur: dur || 11, xf }); }
  function sweep(b, dur) { if (!b.instant) FXL.push({ type: 'sweep', t: 0, dur: dur || 7 }); }
  function idols(b, xf) { if (!b.instant) FXL.push({ type: 'idols', t: 0, dur: 5, xf }); }
  // 灵魂升天，化作一颗星（状态：星留在天上）
  function soul(b, id, star) {
    S.stars.push({ x: star[0], y: star[1], born: b.instant ? 0 : W.t + 4.6 / (W.fast || 1) });
    if (b.instant) return;
    const p = figPt(id, 0.45);
    if (!p) return;
    FXL.push({ type: 'soul', t: 0, dur: 4.6, x0: p[0] / W.w, y0: p[1] / W.h, x1: star[0], y1: star[1] });
  }

  function drawFX(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (pass === 'air') {
        if (e.type === 'beam') {
          const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
          const x = e.xf * W.w, y = gY(e.l, e.xf);
          ctx.globalAlpha = env * 0.5 * e.k;
          ctx.drawImage(SP.beam, x - e.w / 2, -10, e.w, y + 10);
          ctx.globalAlpha = env * 0.55 * e.k;
          const g = e.w * 2.4;
          ctx.drawImage(e.white ? SP.white : SP.gold, x - g / 2, y - g * 0.45, g, g * 0.9);
        } else if (e.type === 'earth') {
          // 地上的尘沙：自雅各躺卧之处向东西开展
          const R = (0.04 + 0.5 * U.easeOut(q)) * W.w, env = 1 - smoothstep(0.7, 1, q);
          ctx.fillStyle = 'rgb(255,236,196)';
          for (let i = 0; i < 150; i++) {
            const side = rt(i * 3) * 2 - 1, xf = e.xf + side * R / W.w;
            if (xf < 0.3 || xf > 1.02) continue;
            const g = gY(2, xf), y = g + rt(i * 3 + 1) * (W.h - g) * 0.85;
            const tw = Math.max(0, Math.sin(W.t * (2 + rt(i * 3 + 2) * 4) + i));
            const edge = 1 - smoothstep(0.6, 1, Math.abs(side));
            ctx.globalAlpha = env * tw * edge * 0.8;
            const sz = (0.8 + rt(i + 90) * 1.4) * u;
            ctx.fillRect(xf * W.w - sz / 2, y - sz / 2, sz, sz);
          }
        } else if (e.type === 'sweep') {
          const x = lerp(0.3, 1.12, U.easeInOut(q)) * W.w, w = 0.16 * W.w, top = W.horizonY - W.h * 0.08;
          const env = smoothstep(0, 0.12, q) * (1 - smoothstep(0.8, 1, q));
          ctx.globalAlpha = env * 0.5;
          ctx.drawImage(SP.band, x - w / 2, top, w, W.h - top);
          ctx.fillStyle = 'rgb(255,236,190)';
          for (let i = 0; i < 40; i++) {
            const xf = x / W.w + (rt(i * 5) - 0.5) * 0.12;
            const g = gY(2, clamp(xf, 0, 1)), y = g + rt(i * 5 + 1) * (W.h - g) * 0.8;
            ctx.globalAlpha = env * Math.max(0, Math.sin(W.t * 5 + i)) * 0.7;
            ctx.fillRect(xf * W.w - 1, y - 1, 2 * u, 2 * u);
          }
        } else if (e.type === 'mote') {
          const A = figPt(e.a, 0.62), B = figPt(e.b, 0.55);
          if (!A || !B) continue;
          const k = U.easeInOut(q), x = lerp(A[0], B[0], k), y = lerp(A[1], B[1], k) - Math.sin(k * Math.PI) * 26 * u;
          const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.85, 1, q));
          const g = 34 * u;
          ctx.globalAlpha = env * 0.8;
          ctx.drawImage(SP.gold, x - g / 2, y - g / 2, g, g);
          ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
          ctx.fillRect(x - 1.5 * u, y - 1.5 * u, 3 * u, 3 * u);
        } else if (e.type === 'touch') {
          const p = figPt(e.id, 0.42);
          if (!p) continue;
          const env = Math.pow(1 - q, 2);
          const g = 110 * u * (0.6 + q);
          ctx.globalAlpha = env * 0.9;
          ctx.drawImage(SP.white, p[0] - g / 2, p[1] - g / 2, g, g);
        } else if (e.type === 'glint') {
          const p = figPt(e.id, 0.8);
          if (!p) continue;
          const env = Math.sin(q * Math.PI);
          ctx.globalAlpha = env * 0.9;
          ctx.fillStyle = 'rgb(255,230,170)';
          const L = 6 * u;
          ctx.fillRect(p[0] - L, p[1] - 0.5, L * 2, 1); ctx.fillRect(p[0] - 0.5, p[1] - L, 1, L * 2);
          ctx.globalAlpha = env * 0.6;
          ctx.drawImage(SP.gold, p[0] - L * 1.5, p[1] - L * 1.5, L * 3, L * 3);
        } else if (e.type === 'idols') {
          // 外邦的神像与耳环：落入橡树底下，隐没于土中
          const x0 = e.xf * W.w, g = gY(2, e.xf);
          ctx.fillStyle = 'rgb(236,196,120)';
          for (let i = 0; i < 9; i++) {
            const d = clamp((q - i * 0.05) / 0.6, 0, 1);
            const x = x0 + (rt(i * 7) - 0.5) * 26 * u, y = lerp(g - (18 + rt(i * 7 + 1) * 14) * u, g + 5 * u, U.easeIn(d));
            ctx.globalAlpha = (1 - d) * 0.85;
            ctx.fillRect(x - 1.2 * u, y - 1.2 * u, 2.4 * u, 2.4 * u);
          }
        } else if (e.type === 'soul') {
          const k = U.easeInOut(q);
          const x = lerp(e.x0, e.x1, k) * W.w + Math.sin(q * 7) * 8 * u * (1 - q), y = lerp(e.y0, e.y1, k) * W.h;
          const env = smoothstep(0, 0.1, q);
          const g = 40 * u * (1 - 0.5 * q);
          ctx.globalAlpha = env * 0.75;
          ctx.drawImage(SP.pale, x - g / 2, y - g / 2, g, g);
          ctx.fillStyle = 'rgb(246,244,255)';
          ctx.fillRect(x - 1.2 * u, y - 1.2 * u, 2.4 * u, 2.4 * u);
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 两国在你腹内：利百加身上两点相争的光（一赤一白）
  function drawTwins(ctx) {
    if (!S.twins) return;
    const p = figPt('rebekah', 0.44);
    if (!p) return;
    SP || sprites();
    const u = Math.max(0.5, W.unit), k = S.twins >= 2 ? 1 : 0.55;
    const sp = S.twins >= 2 ? 2.6 : 1.3, a = W.t * sp, r = (3.6 + 1.4 * Math.sin(W.t * 4.7)) * u;
    const jx = Math.sin(W.t * 11) * 0.8 * u * (S.twins >= 2 ? 1 : 0.3);
    const pts = [[p[0] + Math.cos(a) * r + jx, p[1] + Math.sin(a) * r * 0.55, SP.rose, 'rgb(255,178,140)'], [p[0] - Math.cos(a) * r - jx, p[1] - Math.sin(a) * r * 0.55, SP.pale, 'rgb(232,236,255)']];
    ctx.globalCompositeOperation = 'lighter';
    for (const q of pts) {
      const g = 22 * u;
      ctx.globalAlpha = k * 0.6;
      ctx.drawImage(q[2], q[0] - g / 2, q[1] - g / 2, g, g);
      ctx.globalAlpha = k * 0.9;
      ctx.fillStyle = q[3];
      ctx.fillRect(q[0] - 1.1 * u, q[1] - 1.1 * u, 2.2 * u, 2.2 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 天上的甘露（27:28）：自天降在田野上的微光
  function drawDew(ctx) {
    const k = W.lv.jbDew;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236,244,255)';
    const n = Math.round(90 * Math.min(1, k));
    for (let i = 0; i < n; i++) {
      const xf = 0.4 + rt(i * 4) * 0.62, sp = 0.05 + rt(i * 4 + 1) * 0.07;
      const ph = U.fract(rt(i * 4 + 2) + W.t * sp);
      const g = gY(2, xf), y = lerp(-0.02 * W.h, g + rt(i * 4 + 3) * (W.h - g) * 0.5, ph);
      ctx.globalAlpha = Math.min(1, k) * 0.7 * Math.sin(ph * Math.PI) * (0.6 + 0.4 * Math.sin(W.t * 6 + i));
      ctx.fillRect(xf * W.w - 0.8 * u, y - 1.6 * u, 1.6 * u, 3.2 * u);
    }
    // 地上的肥土：一层金色的润泽
    ctx.globalAlpha = Math.min(1, k) * 0.28;
    const g0 = gY(2, 0.62);
    ctx.drawImage(SP.gold, W.w * 0.36, g0 - (W.h - g0) * 0.4, W.w * 0.7, (W.h - g0) * 1.8);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 天上的新星：拉结、以撒
  function drawStars(ctx) {
    if (!S.stars.length) return;
    const A = W.lv.stars * clamp(W.night * 1.3 + W.dusk * 0.3, 0, 1);
    if (A < 0.01) return;
    SP || sprites();
    const u = Math.max(0.7, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    for (const st of S.stars) {
      if (W.t < st.born) continue;
      const x = st.x * W.w, y = st.y * W.h, a = A * (0.85 + 0.15 * Math.sin(W.t * 1.3 + st.x * 20)) * smoothstep(st.born, st.born + 2, W.t);
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(246,242,255)';
      ctx.beginPath(); ctx.arc(x, y, 1.6 * u, 0, TAU); ctx.fill();
      ctx.globalAlpha = a * 0.4;
      ctx.fillRect(x - 7 * u, y - 0.5, 14 * u, 1); ctx.fillRect(x - 0.5, y - 7 * u, 1, 14 * u);
      ctx.globalAlpha = a * 0.5;
      ctx.drawImage(SP.pale, x - 9 * u, y - 9 * u, 18 * u, 18 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'tent': drawTent(ctx, p); break;
      case 'well': drawWell(ctx, p); break;
      case 'stew': drawStew(ctx, p); break;
      case 'field': drawField(ctx, p); break;
      case 'stone': drawStone(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'troughs': drawTroughs(ctx, p); break;
      case 'heap': drawHeap(ctx, p); break;
      case 'stream': drawStream(ctx, p); break;
      case 'oak': drawOak(ctx, p); break;
      case 'city': drawCity(ctx, p); break;
      case 'tomb': drawTomb(ctx, p); break;
      case 'cave': drawCave(ctx, p); break;
      case 'bier': drawBier(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { field: -3, stream: -2, city: 0, oak: 1, cave: 1, tent: 2, tomb: 3, heap: 3, well: 4, troughs: 4, altar: 4, stone: 5, stew: 5, bier: 9 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  const HGT = { tent: 18, well: 5, stew: 6, field: -6, stone: 14, altar: 8, troughs: 5, heap: 10, stream: -8, oak: 60, city: 16, tomb: 14, cave: 16, bier: 16 };
  const SCENE = {
    init() { sprites(); },
    resize() {},
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
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStars(ctx); return; }
      if (pass === 'far') drawSeir(ctx);
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        const list = sortProps();
        for (const p of list) {
          if (p.layer !== l || p.a < 0.005 || p.kind === 'bier') continue;
          drawKind(ctx, p);
        }
        if (pass === 'near') {
          // 饥荒：尘土的黄雾
          const dk = W.lv.jbDrought;
          if (dk > 0.01) {
            const g = ctx.createLinearGradient(0, 0, 0, W.h);
            g.addColorStop(0, U.rgba(190, 150, 96, 0)); g.addColorStop(0.5, U.rgba(196, 150, 92, 0.16 * dk)); g.addColorStop(1, U.rgba(150, 110, 64, 0.22 * dk));
            ctx.fillStyle = g; ctx.fillRect(0, 0, W.w, W.h);
          }
        }
      }
      if (pass === 'air') {
        drawDew(ctx);
        drawTwins(ctx);
        drawFX(ctx, 'air');
        // 示剑的黑暗（34 章）
        const sk = W.lv.jbShadow;
        if (sk > 0.01) { ctx.fillStyle = U.rgba(8, 5, 12, 0.55 * sk); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'near') {
        // 天梯：在生灵之后、人之前（雅各躺在它的脚下）
        const L = ladderState();
        if (L[0] > 0.004) drawLadder(ctx, L[0], L[1], L[2], L[3]);
        for (const e of FXL) {
          if (e.type !== 'ghost') continue;
          const q = e.t / e.dur, env = smoothstep(0, 0.25, q) * (1 - smoothstep(0.6, 1, q));
          drawLadder(ctx, env * (0.3 + 0.2 * W.night), 0, 1, env * 0.8);
        }
        for (const p of sortProps()) if (p.layer === 2 && p.kind === 'bier' && p.a >= 0.005) drawBier(ctx, p);
      }
    },
    reset() { P.clear(); FXL.length = 0; sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4) continue;
        const s = LS(p.layer) * (p.size || 1), px = (p.kind === 'stream' ? p.x - 0.02 : p.x) * W.w, gy = gY(p.layer, p.x);
        const py = gy - (HGT[p.kind] || 10) * s;
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 10 * s, d };
      }
      // 天梯
      const L = ladderState();
      if (L[0] > 0.3) {
        ladderGeom();
        const vx = LG.tx - LG.bx, vy = LG.ty - LG.by, t = clamp(((x - LG.bx) * vx + (y - LG.by) * vy) / (vx * vx + vy * vy), 0, 1);
        const d = Math.hypot(LG.bx + vx * t - x, LG.by + vy * t - y);
        if (d < r && (!best || d < best.d)) best = { label: '天梯', x, y: y - 14, d };
      }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  // 一家人迁移：x 为雅各的位置；其余的人依次在他右后方（k 压缩间距）
  function household(x, o) {
    o = o || {};
    const k = o.k || 1, sp = o.speed || 0.024;
    if (o.jacob !== false) walk('jacob', clamp(x, 0.36, 1.12), { speed: sp, pose: o.pose });
    for (const [id, dx] of HH) {
      const f = fig(id);
      if (!f || f.dying || f.mount) continue;
      walk(id, clamp(x + dx * k, 0.36, 1.14), { speed: sp, pose: f.isAnimal ? undefined : o.pose });
    }
  }
  // 群畜随行（x0..x1 之间）
  function flocks(x0, x1, o) {
    const live = FLOCKS.filter(hasCrowd);
    live.forEach((g, i) => { const a = lerp(x0, x1, i / live.length), b = lerp(x0, x1, (i + 1) / live.length); crowdWalk(g, a, b, Object.assign({ speed: 0.024 }, o || {})); });
  }
  // 生孩子：一个小小的人自光中出现，头上聚成他的名字
  function birth(b, id, cn, mother) {
    const k = KID[id];
    if (!k) return;
    add(id, { label: cn, sex: k[2], age: 'child', x: k[0], v: k[1], facing: k[0] > 0.9 ? -1 : 1, robe: ROBE[id], glow: 0.35, from: b.instant ? 'none' : 'light', prop: null });
    if (b.instant) return;
    const m = figPt(mother, 0.45);
    if (m) fx().sparkle(m[0], m[1], 18, [255, 240, 214], 10, 'top');
    nameOver(b, id, cn, [246, 232, 206], srcAround(mother, 40), { size: 0.034, hold: 2.2, dot: 1.8, lift: 0.7 });
  }
  function everyone(fn) { for (const id of FAMILY) if (fig(id)) fn(id); }

  // 以东的名字：远去的族长，散往东边（左）的西珥
  function edomNames(b, list, y0) {
    if (b.instant) return;
    const f = figPt('esau', 0.8) || [W.w * 0.5, W.h * 0.8];
    list.forEach((nm, i) => {
      const n = Array.from(nm).length, size = M() * 0.03;
      const x = lerp(0.4, 0.08, (i + 0.5) / list.length) * W.w + (rt(i * 13) - 0.5) * 0.03 * W.w;
      const y = W.horizonY - (y0 + 0.05 * rt(i * 13 + 1)) * W.h;
      const c = nameAt(x, y, size, n);
      fx().nameStr(nm, c[0], c[1], size, [236, 168, 132], () => [f[0] + rand(-30, 30) * SU(), f[1] + rand(-20, 20) * SU()], { delay: i * 1.05, hold: 1.5, dot: 1.7 });
    });
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：庇耳拉海莱的清晨（25:11）
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 1, trees: 0.42, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.2,
      jbLadder: 0, jbDrought: 0, jbDew: 0, jbShadow: 0, jbSeir: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 100, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 4, lx, ly, true);
    W.setPop('beast', 2, lx, ly, true);
    W.setPop('creeper', 20, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    S.twins = 1;
    // 地上本有的：雅博河、庇耳拉海莱的水泉
    prop('stream', 'stream', { x: X.jabbok, label: '雅博河' });
    prop('spring', 'well', { x: X.spring, label: '庇耳拉海莱' });
    prop('tentI', 'tent', { x: X.tentI, label: '以撒的帐棚' });
    prop('tentR', 'tent', { x: X.tentR, size: 0.88, label: '利百加的帐棚' });
    const c = C();
    c.clear({ fade: false });
    add('isaac', { label: '以撒', sex: 'm', age: 'adult', x: X.tentI - 0.014, facing: 1, robe: ROBE.isaac, glow: 0.4, pose: 'pray', from: 'none' });
    add('rebekah', { label: '利百加', sex: 'f', age: 'adult', x: X.tentR + 0.028, facing: -1, robe: ROBE.rebekah, glow: 0.3, pose: 'pray', from: 'none' });
    crowd('svI', { n: 3, x0: 0.63, x1: 0.69, layer: 2, label: '仆人', from: 'none', mill: false });
    herd('herdI', { kind: 'sheep', n: 6, x0: 0.66, x1: 0.76, label: '羊群', from: 'none' });
    animal('camI', 'camel', 0.7, { facing: -1, pose: 'lie', from: 'none' });
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  // ════════════════════════════════════════════════════════════
  // ── 25:23 两国在你腹内 ──────────────────────────────────────
  const V1 = [
    { text: '耶和华对她说：「两国在你腹内；两族要从你身上出来。<br>这族必强于那族；将来大的要服事小的。」', ref: '创世记 25:23', hold: 8 },
    { text: '生产的日子到了，腹中果然是双子。', ref: '创世记 25:24', hold: 4.5 },
    { text: '先产的身体发红，浑身有毛，如同皮衣，他们就给他起名叫以扫。', ref: '创世记 25:25', hold: 6.5 },
    { text: '随后又生了以扫的兄弟，手抓住以扫的脚跟，因此给他起名叫雅各。<br>利百加生下两个儿子的时候，以撒年正六十岁。', ref: '创世记 25:26', hold: 7.5 },
    { text: '两个孩子渐渐长大，以扫善于打猎，常在田野；<br>雅各为人安静，常住在帐棚里。', ref: '创世记 25:27', hold: 7 },
    { text: '以撒爱以扫，因为常吃他的野味；利百加却爱雅各。', ref: '创世记 25:28', hold: 5.5 },
  ];
  // ── 25:29–34 红豆汤与长子的名分 ─────────────────────────────
  const V2 = [
    { text: '有一天，雅各熬汤，以扫从田野回来累昏了。', ref: '创世记 25:29', hold: 5 },
    { text: '以扫对雅各说：「我累昏了，求你把这红汤给我喝。」', ref: '创世记 25:30', hold: 5.5 },
    { text: '雅各说：「你今日把长子的名分卖给我吧。」', ref: '创世记 25:31', hold: 5 },
    { text: '以扫说：「我将要死，这长子的名分于我有什么益处呢？」', ref: '创世记 25:32', hold: 5.5 },
    { text: '雅各说：「你今日对我起誓吧。」<br>以扫就对他起了誓，把长子的名分卖给雅各。', ref: '创世记 25:33', hold: 6.5 },
    { text: '于是雅各将饼和红豆汤给了以扫，以扫吃了喝了，便起来走了。<br>这就是以扫轻看了他长子的名分。', ref: '创世记 25:34', hold: 7.5 },
  ];
  // ── 26 神向以撒显现；百倍的收成；三口井；别是巴 ──────────────
  const V3 = [
    { text: '这时又有饥荒，以撒就往基拉耳去，<br>到非利士人的王亚比米勒那里。', ref: '创世记 26:1', hold: 6 },
    { text: '耶和华向以撒显现，说：「你不要下埃及去，要住在我所指示你的地。<br>你寄居在这地，我必与你同在，赐福给你……」', ref: '创世记 26:2–3', hold: 8 },
    { text: '以撒在那地耕种，那一年有百倍的收成。耶和华赐福给他，<br>他就昌大，日增月盛，成了大富户。', ref: '创世记 26:12–13', hold: 7.5 },
    { text: '基拉耳的牧人与以撒的牧人争竞，说：「这水是我们的。」', ref: '创世记 26:20', hold: 5.5 },
    { text: '以撒离开那里，又挖了一口井，他们不为这井争竞了，他就给那井起名叫利河伯。<br>他说：「耶和华现在给我们宽阔之地，我们必在这地昌盛。」', ref: '创世记 26:22', hold: 8.5 },
    { text: '当夜耶和华向他显现，说：「我是你父亲亚伯拉罕的神，不要惧怕！<br>因为我与你同在，要赐福给你……」', ref: '创世记 26:24', hold: 8 },
    { text: '那一天，以撒的仆人来，将挖井的事告诉他说：「我们得了水了。」<br>他就给那井起名叫示巴；因此那城叫做别是巴，直到今日。', ref: '创世记 26:32–33', hold: 8.5 },
  ];
  // ── 27 被夺去的祝福；28:1–11 往哈兰去，太阳落了 ─────────────
  const V4 = [
    { text: '以撒年老，眼睛昏花，不能看见，就叫了他大儿子以扫来，说：「我儿。」<br>以扫说：「我在这里。」', ref: '创世记 27:1', hold: 7 },
    { text: '利百加又把家里所存大儿子以扫上好的衣服给她小儿子雅各穿上，<br>又用山羊羔皮包在雅各的手上和颈项的光滑处，', ref: '创世记 27:15–16', hold: 7.5 },
    { text: '以撒摸着他，说：「声音是雅各的声音，手却是以扫的手。」', ref: '创世记 27:22', hold: 6 },
    { text: '「……愿神赐你天上的甘露，地上的肥土，并许多五谷新酒。<br>愿多民事奉你，多国跪拜你。」', ref: '创世记 27:28–29', hold: 8 },
    { text: '以扫听了他父亲的话，就放声痛哭，说：「我父啊，求你也为我祝福！」', ref: '创世记 27:34', hold: 6.5 },
    { text: '以扫因他父亲给雅各祝的福，就怨恨雅各。', ref: '创世记 27:41', hold: 5 },
    { text: '以撒叫了雅各来，给他祝福……<br>「愿全能的神赐福给你，使你生养众多，成为多族……」', ref: '创世记 28:1–3', hold: 7.5 },
    { text: '雅各出了别是巴，向哈兰走去；到了一个地方，因为太阳落了，就在那里住宿，<br>便拾起那地方的一块石头枕在头下，在那里躺卧睡了。', ref: '创世记 28:10–11', hold: 9 },
  ];
  // ── 28:12–22 伯特利：天梯 ──────────────────────────────────
  const V5 = [
    { text: '梦见一个梯子立在地上，梯子的头顶着天，<br>有神的使者在梯子上，上去下来。', ref: '创世记 28:12', hold: 7.5 },
    { text: '耶和华站在梯子以上，说：「我是耶和华你祖亚伯拉罕的神，也是以撒的神；<br>我要将你现在所躺卧之地赐给你和你的后裔。」', ref: '创世记 28:13', hold: 8.5 },
    { text: '「你的后裔必像地上的尘沙那样多，必向东西南北开展；<br>地上万族必因你和你的后裔得福。」', ref: '创世记 28:14', hold: 7.5 },
    { text: '「我也与你同在。你无论往哪里去，我必保佑你，领你归回这地，<br>总不离弃你，直到我成全了向你所应许的。」', ref: '创世记 28:15', hold: 8.5 },
    { text: '雅各睡醒了，说：「耶和华真在这里，我竟不知道！」', ref: '创世记 28:16', hold: 5.5 },
    { text: '就惧怕，说：「这地方何等可畏！这不是别的，乃是神的殿，也是天的门。」', ref: '创世记 28:17', hold: 6.5 },
    { text: '雅各清早起来，把所枕的石头立作柱子，浇油在上面。<br>他就给那地方起名叫伯特利。', ref: '创世记 28:18–19', hold: 7 },
    { text: '雅各许愿说：「神若与我同在，在我所行的路上保佑我……<br>我就必以耶和华为我的神。」', ref: '创世记 28:20–21', hold: 7 },
  ];
  // ── 29:1–28 井边的拉结；七年如同几天；利亚与拉结 ────────────
  const V6 = [
    { text: '雅各起行，到了东方人之地，<br>看见田间有一口井，有三群羊卧在井旁……井口上的石头是大的。', ref: '创世记 29:1–2', hold: 7.5 },
    { text: '雅各看见母舅拉班的女儿拉结和母舅拉班的羊群，<br>就上前把石头转离井口，饮他母舅拉班的羊群。', ref: '创世记 29:10', hold: 7.5 },
    { text: '雅各与拉结亲嘴，就放声而哭。', ref: '创世记 29:11', hold: 4.5 },
    { text: '拉班听见外甥雅各的信息，就跑去迎接，抱着他，与他亲嘴，领他到自己的家。', ref: '创世记 29:13', hold: 6.5 },
    { text: '雅各爱拉结，就说：「我愿为你小女儿拉结服事你七年。」', ref: '创世记 29:18', hold: 5.5 },
    { text: '雅各就为拉结服事了七年；他因为深爱拉结，就看这七年如同几天。', ref: '创世记 29:20', hold: 11 },
    { text: '到了早晨，雅各一看是利亚，就对拉班说：<br>「你向我做的是什么事呢？我服事你，不是为拉结吗？你为什么欺哄我呢？」', ref: '创世记 29:25', hold: 8 },
    { text: '雅各就如此行。满了利亚的七日，拉班便将女儿拉结给雅各为妻。', ref: '创世记 29:28', hold: 6.5 },
  ];
  // ── 29:31–30:21 众子 ──────────────────────────────────────
  const V7 = [
    { text: '耶和华见利亚失宠，就使她生育，拉结却不生育。', ref: '创世记 29:31', hold: 6 },
    { text: '利亚怀孕生子，就给他起名叫流便，因而说：<br>「耶和华看见我的苦情，如今我的丈夫必爱我。」', ref: '创世记 29:32', hold: 7 },
    { text: '她又怀孕生子……于是给他起名叫西缅。<br>她又怀孕生子，起名叫利未。', ref: '创世记 29:33–34', hold: 6.5 },
    { text: '她又怀孕生子，说：「这回我要赞美耶和华」，因此给他起名叫犹大。<br>这才停了生育。', ref: '创世记 29:35', hold: 7 },
    { text: '拉结见自己不给雅各生子，就嫉妒她姊姊，<br>对雅各说：「你给我孩子，不然我就死了。」', ref: '创世记 30:1', hold: 7 },
    { text: '拉结说：「神伸了我的冤……」因此给他起名叫但。<br>拉结说：「我与我姊姊大大相争，并且得胜」，于是给他起名叫拿弗他利。', ref: '创世记 30:6–8', hold: 7.5 },
    { text: '利亚说：「万幸！」于是给他起名叫迦得。<br>利亚说：「我有福啊……」于是给他起名叫亚设。', ref: '创世记 30:11–13', hold: 7 },
    { text: '利亚说：「神给了我价值……」于是给他起名叫以萨迦。<br>利亚说：「神赐我厚赏……」于是给他起名西布伦。', ref: '创世记 30:18–20', hold: 7.5 },
    { text: '后来又生了一个女儿，给她起名叫底拿。', ref: '创世记 30:21', hold: 4.8 },
  ];
  // ── 30:22–27 约瑟 ─────────────────────────────────────────
  const V8 = [
    { text: '神顾念拉结，应允了她，使她能生育。', ref: '创世记 30:22', hold: 5.5 },
    { text: '拉结怀孕生子，说：「神除去了我的羞耻」，就给他起名叫约瑟，<br>意思说：「愿耶和华再增添我一个儿子。」', ref: '创世记 30:23–24', hold: 8 },
    { text: '拉结生约瑟之后，雅各对拉班说：<br>「请打发我走，叫我回到我本乡本土去。」', ref: '创世记 30:25', hold: 6.5 },
    { text: '拉班对他说：「我若在你眼前蒙恩，请你仍与我同住，<br>因为我已算定，耶和华赐福与我是为你的缘故。」', ref: '创世记 30:27', hold: 7.5 },
  ];
  // ── 30:31–31:2 有点有斑的羊 ────────────────────────────────
  const V9 = [
    { text: '「你举目观看，跳母羊的公羊都是有纹的、有点的、有花斑的；<br>凡拉班向你所做的，我都看见了。」', ref: '创世记 31:12', hold: 8 },
    { text: '雅各说：「……今天我要走遍你的羊群，把绵羊中凡有点的、有斑的，和黑色的，<br>并山羊中凡有斑的、有点的，都挑出来；将来这一等的就算我的工价。」', ref: '创世记 30:31–32', hold: 9 },
    { text: '雅各拿杨树、杏树、枫树的嫩枝，将皮剥成白纹，使枝子露出白的来，<br>将剥了皮的枝子，对着羊群，插在饮羊的水沟里和水槽里。', ref: '创世记 30:37–38', hold: 9 },
    { text: '羊对着枝子配合，就生下有纹的、有点的、有斑的来。', ref: '创世记 30:39', hold: 5.5 },
    { text: '于是雅各极其发大，得了许多的羊群、仆婢、骆驼，和驴。', ref: '创世记 30:43', hold: 6 },
    { text: '雅各见拉班的气色向他不如从前了。', ref: '创世记 31:2', hold: 4.8 },
  ];
  // ── 31 回你祖你父之地；基列的石堆 ───────────────────────────
  const V10 = [
    { text: '耶和华对雅各说：「你要回你祖、你父之地，到你亲族那里去，<br>我必与你同在。」', ref: '创世记 31:3', hold: 7 },
    { text: '拉结和利亚回答雅各说：「……现今凡神所吩咐你的，你只管去行吧！」', ref: '创世记 31:14–16', hold: 6.5 },
    { text: '雅各起来，使他的儿子和妻子都骑上骆驼，', ref: '创世记 31:17', hold: 4.5 },
    { text: '当时拉班剪羊毛去了，拉结偷了他父亲家中的神像。', ref: '创世记 31:19', hold: 5.5 },
    { text: '拉班带领他的众弟兄去追赶，追了七日，在基列山就追上了。', ref: '创世记 31:23', hold: 6 },
    { text: '夜间，神到亚兰人拉班那里，在梦中对他说：<br>「你要小心，不可与雅各说好说歹。」', ref: '创世记 31:24', hold: 7 },
    { text: '雅各就拿一块石头立作柱子，又对众弟兄说：「你们堆聚石头。」<br>他们就拿石头来堆成一堆，大家便在旁边吃喝。', ref: '创世记 31:45–46', hold: 8 },
    { text: '又叫米斯巴，意思说：「我们彼此离别以后，愿耶和华在你我中间鉴察。」', ref: '创世记 31:49', hold: 6.5 },
    { text: '拉班清早起来，与他外孙和女儿亲嘴，给他们祝福，回往自己的地方去了。', ref: '创世记 31:55', hold: 6.5 },
  ];
  // ── 32:1–27 玛哈念；惧怕与祷告；雅博渡口；摔跤 ──────────────
  const V11 = [
    { text: '雅各仍旧行路，神的使者遇见他。', ref: '创世记 32:1', hold: 5 },
    { text: '雅各看见他们就说：「这是神的军兵」，于是给那地方起名叫玛哈念。', ref: '创世记 32:2', hold: 6.5 },
    { text: '所打发的人回到雅各那里，说：<br>「我们到了你哥哥以扫那里，他带着四百人，正迎着你来。」', ref: '创世记 32:6', hold: 7 },
    { text: '「……你曾说：『我必定厚待你，使你的后裔如同海边的沙，多得不可胜数。』」', ref: '创世记 32:12', hold: 7 },
    { text: '他夜间起来，带着两个妻子，两个使女，并十一个儿子，都过了雅博渡口，', ref: '创世记 32:22', hold: 6.5 },
    { text: '只剩下雅各一人。有一个人来和他摔跤，直到黎明。', ref: '创世记 32:24', hold: 6 },
    { text: '那人见自己胜不过他，就将他的大腿窝摸了一把，<br>雅各的大腿窝正在摔跤的时候就扭了。', ref: '创世记 32:25', hold: 7 },
    { text: '那人说：「天黎明了，容我去吧！」<br>雅各说：「你不给我祝福，我就不容你去。」', ref: '创世记 32:26', hold: 7 },
    { text: '那人说：「你名叫什么？」他说：「我名叫雅各。」', ref: '创世记 32:27', hold: 5.5 },
  ];
  // ── 32:28–31 以色列 ───────────────────────────────────────
  const V12 = [
    { text: '那人说：「你的名不要再叫雅各，要叫以色列；<br>因为你与神与人较力，都得了胜。」', ref: '创世记 32:28', hold: 8 },
    { text: '雅各问他说：「请将你的名告诉我。」那人说：「何必问我的名？」<br>于是在那里给雅各祝福。', ref: '创世记 32:29', hold: 7.5 },
    { text: '雅各便给那地方起名叫毗努伊勒，意思说：<br>「我面对面见了神，我的性命仍得保全。」', ref: '创世记 32:30', hold: 7.5 },
    { text: '日头刚出来的时候，雅各经过毗努伊勒，他的大腿就瘸了。', ref: '创世记 32:31', hold: 6.5 },
  ];
  // ── 33 以扫跑来；34 示剑的黑暗 ─────────────────────────────
  const V13 = [
    { text: '雅各举目观看，见以扫来了，后头跟着四百人。', ref: '创世记 33:1', hold: 5.5 },
    { text: '他自己在他们前头过去，一连七次俯伏在地才就近他哥哥。', ref: '创世记 33:3', hold: 6.5 },
    { text: '以扫跑来迎接他，将他抱住，又搂着他的颈项，与他亲嘴，两个人就哭了。', ref: '创世记 33:4', hold: 8 },
    { text: '雅各说：「……我见了你的面，如同见了神的面，并且你容纳了我。」', ref: '创世记 33:10', hold: 6.5 },
    { text: '于是，以扫当日起行，回往西珥去了。', ref: '创世记 33:16', hold: 4.8 },
    { text: '雅各从巴旦亚兰回来的时候，平平安安地到了迦南地的示剑城，在城东支搭帐棚……<br>在那里筑了一座坛。', ref: '创世记 33:18–20', hold: 7.5 },
    { text: '利亚给雅各所生的女儿底拿出去，要见那地的女子们。', ref: '创世记 34:1', hold: 5.5 },
    { text: '雅各的儿子们听见这事，就从田野回来，人人忿恨，十分恼怒。', ref: '创世记 34:7', hold: 6 },
    { text: '雅各对西缅和利未说：「你们连累我，使我在这地的居民中……有了臭名。」', ref: '创世记 34:30', hold: 6.5 },
  ];
  // ── 35:1–7 上伯特利去 ─────────────────────────────────────
  const V14 = [
    { text: '神对雅各说：「起来！上伯特利去，住在那里；要在那里筑一座坛给神，<br>就是你逃避你哥哥以扫的时候向你显现的那位。」', ref: '创世记 35:1', hold: 8.5 },
    { text: '雅各就对他家中的人并一切与他同在的人说：<br>「你们要除掉你们中间的外邦神，也要自洁，更换衣裳。」', ref: '创世记 35:2', hold: 7.5 },
    { text: '他们就把外邦人的神像和他们耳朵上的环子交给雅各；<br>雅各都藏在示剑那里的橡树底下。', ref: '创世记 35:4', hold: 7.5 },
    { text: '他们便起行前往。神使那周围城邑的人都甚惊惧，就不追赶雅各的众子了。', ref: '创世记 35:5', hold: 7 },
    { text: '他在那里筑了一座坛，就给那地方起名叫伊勒伯特利；<br>因为他逃避他哥哥的时候，神在那里向他显现。', ref: '创世记 35:7', hold: 7.5 },
  ];
  // ── 35:9–20 伯特利又一次；拉结与便雅悯 ──────────────────────
  const V15 = [
    { text: '雅各从巴旦亚兰回来，神又向他显现，赐福与他，<br>且对他说：「你的名原是雅各，从今以后不要再叫雅各，要叫以色列。」', ref: '创世记 35:9–10', hold: 8.5 },
    { text: '神又对他说：「我是全能的神；你要生养众多，<br>将来有一族和多国的民从你而生，又有君王从你而出。」', ref: '创世记 35:11', hold: 8 },
    { text: '雅各便在那里立了一根石柱，在柱子上奠酒，浇油。', ref: '创世记 35:14', hold: 5.5 },
    { text: '他们从伯特利起行，离以法他还有一段路程，拉结临产甚是艰难。', ref: '创世记 35:16', hold: 6.5 },
    { text: '正在艰难的时候，收生婆对她说：「不要怕，你又要得一个儿子了。」', ref: '创世记 35:17', hold: 6 },
    { text: '她将近于死，灵魂要走的时候，就给她儿子起名叫便俄尼；<br>他父亲却给他起名叫便雅悯。', ref: '创世记 35:18', hold: 8 },
    { text: '拉结死了，葬在以法他的路旁；以法他就是伯利恒。<br>雅各在她的坟上立了一统碑，就是拉结的墓碑，到今日还在。', ref: '创世记 35:19–20', hold: 8.5 },
  ];
  // ── 35:12；35:22–29 以撒归到他列祖那里；36 以扫就是以东 ─────
  const V16 = [
    { text: '「我所赐给亚伯拉罕和以撒的地，我要赐给你与你的后裔。」', ref: '创世记 35:12', hold: 6.5 },
    { text: '雅各共有十二个儿子。', ref: '创世记 35:22', hold: 4.5 },
    { text: '雅各来到他父亲以撒那里，到了基列亚巴的幔利，<br>乃是亚伯拉罕和以撒寄居的地方。', ref: '创世记 35:27', hold: 7 },
    { text: '以撒共活了一百八十岁。<br>以撒年纪老迈，日子满足，气绝而死，归到他列祖那里。', ref: '创世记 35:28–29', hold: 8 },
    { text: '他两个儿子以扫、雅各把他埋葬了。', ref: '创世记 35:29', hold: 5 },
    { text: '以扫就是以东，他的后代记在下面。', ref: '创世记 36:1', hold: 5 },
    { text: '以扫带着他的妻子、儿女，与家中一切的人口……往别处去，离了他兄弟雅各。<br>因为二人的财物群畜甚多，寄居的地方容不下他们，所以不能同居。', ref: '创世记 36:6–7', hold: 9 },
    { text: '于是以扫住在西珥山里；以扫就是以东。', ref: '创世记 36:8', hold: 5.5 },
    { text: '以色列人未有君王治理以先，在以东地作王的记在下面。', ref: '创世记 36:31', hold: 6 },
  ];

  const STAGES = [
    // ── 1 · 两国在你腹内 ──────────────────────────────────────
    {
      kind: 'promise', utter: '两国在你腹内；两族要从你身上出来', cmd: 'fork 两国 两族 --from 利百加  # 大的要服事小的', ref: '25:23',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { beamOn(b, 'rebekah', { dur: 7 }); S.twins = 2; pose('isaac', 'stand'); sfx(b, 'harp'); }],
          [L[1] - 2, () => { pose('rebekah', 'stand'); walk('isaac', X.tentR - 0.012, { speed: 0.02 }); }],
          [L[1] + 0.3, b => {
            S.twins = 0;
            carry('isaac', 'baby'); carry('rebekah', 'baby');
            glow('rebekah', 0.45);
            if (!b.instant) {
              const p = figPt('rebekah', 0.45);
              if (p) { fx().ring(p[0], p[1], [255, 232, 200], M() * 0.25, 2.2, 2); fx().sparkle(p[0], p[1], 26, [255, 236, 214], 12, 'top'); }
              W.flash = 0.25;
            }
            sfx(b, 'harp');
          }],
          [L[2] + 0.4, b => nameOver(b, 'isaac', '以扫', [236, 138, 100], srcGround(0.72, 0.1), { size: 0.042 })],
          [L[3] + 0.4, b => nameOver(b, 'rebekah', '雅各', [214, 224, 255], srcAround('rebekah', 70), { size: 0.042 })],
          // 渐渐长大：夜里抱着的婴孩成了孩子，又一夜成了青年
          [L[3] + 5.5, b => fullDay(b, 7)],
          [L[3] + 9, b => {
            carry('isaac', null); carry('rebekah', null);
            add('esauC', { label: '以扫', sex: 'm', age: 'child', x: X.tentR - 0.004, facing: 1, robe: ROBE.esau, glow: 0.25, from: b.instant ? 'none' : 'fade' });
            add('jacobC', { label: '雅各', sex: 'm', age: 'child', x: X.tentR + 0.014, facing: -1, robe: ROBE.jacob, glow: 0.25, from: b.instant ? 'none' : 'fade' });
          }],
          [L[4] + 0.5, () => { walk('esauC', 0.7, { speed: 0.03 }); walk('jacobC', X.tentR + 0.02, { speed: 0.02, pose: 'sit' }); }],
          [L[4] + 3, b => fullDay(b, 7)],
          [L[4] + 6.5, b => {
            rm('esauC', true); rm('jacobC', true);
            add('esau', { label: '以扫', sex: 'm', age: 'adult', x: 0.705, facing: 1, robe: ROBE.esau, glow: 0.25, from: b.instant ? 'none' : 'fade' });
            add('jacob', { label: '雅各', sex: 'm', age: 'adult', x: X.tentR + 0.02, facing: -1, robe: ROBE.jacob, glow: 0.35, pose: 'sit', from: b.instant ? 'none' : 'fade' });
          }],
          [L[5], () => { walk('esau', 0.8, { speed: 0.02 }); walk('isaac', 0.74, { speed: 0.018 }); walk('rebekah', X.tentR + 0.036, { speed: 0.02 }); }],
          [L[5] + 6, () => { face('isaac', 1); face('rebekah', -1); }],
        ]);
      },
    },

    // ── 2 · 红豆汤与长子的名分 ───────────────────────────────
    {
      kind: 'promise', utter: '将来大的要服事小的', cmd: 'swap 长子名分 红豆汤  # 以扫轻看了', ref: '25:23',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            prop('stew', 'stew', { x: X.stew, fire: 1, label: '红豆汤' });
            pose('jacob', 'stand');
            walk('jacob', X.stew - 0.013, { speed: 0.02, pose: 'kneel' });
            W.goTo(0.6, 6, b.instant);
            sfx(b, 'fire');
          }],
          [0.5, () => { walk('isaac', X.tentI + 0.022, { speed: 0.02, pose: 'sit' }); walk('rebekah', X.tentR + 0.012, { speed: 0.02 }); }],
          [1.5, () => walk('esau', X.stew + 0.03, { speed: 0.022, pose: 'sit' })],
          [L[1] + 1.5, () => { face('esau', -1); face('jacob', 1); }],
          [L[2], () => pose('jacob', 'stand')],
          [L[4], () => pose('esau', 'raise')],
          [L[4] + 2, b => mote(b, 'esau', 'jacob', [255, 226, 160], 3)],
          [L[4] + 5, b => {
            pose('esau', 'sit');
            glow('jacob', 0.5);
            if (!b.instant) { const p = figPt('jacob', 0.6); if (p) fx().ring(p[0], p[1], [255, 226, 160], M() * 0.14, 1.8, 1.5); }
          }],
          [L[5], () => { walk('jacob', X.stew + 0.018, { speed: 0.012, pose: 'carry' }); }],
          [L[5] + 3.5, () => pose('jacob', 'stand')],
          [L[5] + 5.5, () => { pose('esau', 'stand'); walk('esau', 0.84, { speed: 0.022 }); prop('stew', null, { fire: 0.25 }); }],
          [L[6], () => { walk('jacob', X.tentR + 0.03, { speed: 0.02 }); glow('jacob', 0.35); }],
        ]);
      },
    },

    // ── 3 · 神向以撒显现；井；别是巴 ─────────────────────────
    {
      kind: 'promise', utter: '我必与你同在，赐福给你', cmd: 'git clone 应许 --from 亚伯拉罕 --to 以撒', ref: '26:3',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => { W.set('jbDrought', 1, b.instant); unprop('stew'); pose('isaac', 'stand'); walk('isaac', 0.6, { speed: 0.02 }); walk('jacob', X.tentR + 0.03, { speed: 0.02 }); }],
          [L[1], b => { beamOn(b, 'isaac', { dur: 7 }); pose('isaac', 'kneel'); sfx(b, 'harp'); }],
          [L[1] + 5.5, () => pose('isaac', 'stand')],
          [L[2], b => {
            W.set('jbDrought', 0, b.instant);
            prop('field', 'field', { x: X.field, grow: 1, label: '田' });
            walk('isaac', X.field + 0.02, { speed: 0.02 });
            crowdWalk('svI', X.field - 0.04, X.field + 0.05, { pose: 'kneel' });
          }],
          [L[2] + 4.5, b => {
            prop('field', null, { gold: 1 });
            crowdPose('svI', 'stand');
            herd('herdI2', { kind: 'sheep', n: 6, x0: 0.68, x1: 0.8, label: '羊群', from: b.instant ? 'none' : 'dust' });
            animal('cowI1', 'cow', 0.742, { facing: -1, from: b.instant ? 'none' : 'dust' });
            animal('cowI2', 'cow', 0.77, { facing: 1, from: b.instant ? 'none' : 'dust' });
            if (!b.instant) fx().sparkle(X.field * W.w, gY(2, X.field) + 30 * LS(2), 40, [255, 232, 170], 50, 'top');
          }],
          [L[3] - 1, b => {
            prop('esek', 'well', { x: X.esek, grow: 1, label: '埃色' });
            if (!hasCrowd('phil')) crowd('phil', { n: 3, x0: 0.44, x1: 0.48, layer: 2, label: '基拉耳的牧人', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('phil', X.esek - 0.04, X.esek - 0.012, { speed: 0.03 });
            walk('isaac', X.esek + 0.02, { speed: 0.02 });
            crowdWalk('svI', X.esek + 0.008, X.esek + 0.04, { speed: 0.02 });
          }],
          [L[3] + 2.5, () => crowdPose('phil', 'point')],
          [L[3] + 4.5, b => {
            prop('sitnah', 'well', { x: X.sitnah, grow: 1, label: '西提拿' });
            crowdWalk('phil', X.sitnah - 0.035, X.sitnah - 0.012, { speed: 0.03, pose: 'point' });
            walk('isaac', X.sitnah + 0.02, { speed: 0.025 });
            crowdWalk('svI', X.sitnah + 0.008, X.sitnah + 0.04, { speed: 0.025 });
          }],
          [L[4], b => {
            prop('rehoboth', 'well', { x: X.rehoboth, grow: 1, label: '利河伯', lit: 0.8 });
            walk('isaac', X.rehoboth - 0.018, { speed: 0.025 });
            crowdWalk('phil', 0.4, 0.44, { speed: 0.03 });
            crowdWalk('svI', X.rehoboth + 0.01, X.rehoboth + 0.045, { speed: 0.025 });
            if (!b.instant) fx().ring(X.rehoboth * W.w, gY(2, X.rehoboth), [255, 236, 190], M() * 0.3, 2.4, 2);
          }],
          [L[4] + 8, () => { uncrowd('phil'); prop('rehoboth', null, { lit: 0 }); }],
          // 上别是巴去；当夜
          [L[5] - 2.5, b => {
            W.goTo(0.02, 5, b.instant);
            walk('isaac', X.altarI - 0.02, { speed: 0.025 });
            crowdWalk('svI', X.spring + 0.012, X.spring + 0.03, { speed: 0.025 });
          }],
          [L[5] + 0.5, b => { beamOn(b, 'isaac', { dur: 7, white: true }); pose('isaac', 'kneel'); }],
          [L[5] + 4.5, b => { prop('altarI', 'altar', { x: X.altarI, grow: 1, label: '坛' }); sfx(b, 'build'); }],
          [L[5] + 7.5, b => { prop('altarI', null, { fire: 1 }); pose('isaac', 'pray'); sfx(b, 'fire'); }],
          [L[6], b => {
            prop('spring', null, { lit: 1, label: '示巴' });
            crowdPose('svI', 'raise');
            sfx(b, 'splash');
            if (!b.instant) fx().sparkle(X.spring * W.w, gY(2, X.spring) - 6, 30, [226, 238, 255], 14, 'top');
          }],
          [L[6] + 4, b => { W.goTo(0.3, 6, b.instant); prop('altarI', null, { fire: 0.3 }); pose('isaac', 'stand'); crowdPose('svI', 'stand'); prop('spring', null, { lit: 0.3 }); }],
        ]);
      },
    },

    // ── 4 · 天上的甘露，地上的肥土 ───────────────────────────
    {
      kind: 'bless', utter: '愿神赐你天上的甘露，地上的肥土', cmd: 'bless 雅各 --as 以扫  # 声音是雅各的声音', ref: '27:28', tint: [255, 232, 186],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            add('isaac', { age: 'elder', glow: 0.15 });
            walk('isaac', X.tentI + 0.022, { speed: 0.02, pose: 'sit' });
            prop('field', null, { gold: 0.55 });
            prop('altarI', null, { fire: 0 });
            walk('esau', X.tentI + 0.05, { speed: 0.035 });
            W.goTo(0.42, 4, b.instant);
          }],
          [3, () => { walk('rebekah', X.tentR + 0.006, { speed: 0.02 }); walk('jacob', X.tentR + 0.03, { speed: 0.02 }); }],
          [7, () => pose('esau', 'bow')],
          [9.5, () => { pose('esau', 'stand'); walk('esau', 0.92, { speed: 0.035 }); }],
          [L[1], b => {
            face('rebekah', 1); face('jacob', -1);
            add('jacob', { robe: ROBE.esau });
            hold('jacob', 'jar');
            if (!b.instant) { const p = figPt('jacob', 0.5); if (p) fx().sparkle(p[0], p[1], 16, [255, 214, 180], 10, 'top'); }
          }],
          [L[1] + 4, () => walk('jacob', X.tentI + 0.046, { speed: 0.02 })],
          [L[2] - 1, () => pose('jacob', 'kneel')],
          [L[2] + 1, () => pose('isaac', 'point')],
          [L[3], b => {
            pose('isaac', 'raise');
            W.set('jbDew', 1, b.instant);
            beamOn(b, 'jacob', { dur: 8 });
            prop('field', null, { gold: 1 });
            sfx(b, 'harp');
            const a = au(); if (!b.instant && a && a.bless) U.safe('audio.bless', () => a.bless());
          }],
          [L[3] + 7, b => { W.set('jbDew', 0.25, b.instant); pose('isaac', 'sit'); }],
          [L[4] - 7, () => { pose('jacob', 'stand'); hold('jacob', null); add('jacob', { robe: ROBE.jacob }); walk('jacob', X.tentR + 0.035, { speed: 0.02 }); }],
          [L[4] - 6, () => { walk('esau', X.tentI + 0.05, { speed: 0.05, pose: 'kneel' }); hold('esau', 'jar'); }],
          [L[4] + 0.5, b => { pose('isaac', 'raise'); if (!b.instant) W.shake = 0.35; }],
          [L[4] + 2.5, b => { hold('esau', null); pose('esau', 'kneel', { weep: true }); pose('isaac', 'sit'); sfx(b, 'weep'); }],
          [L[5], () => { pose('esau', 'stand', { weep: false }); glow('esau', 0.05); walk('esau', 0.43, { speed: 0.02 }); }],
          [L[5] + 7.5, () => rm('esau')],
          [L[6], () => { walk('jacob', X.tentI + 0.046, { speed: 0.02, pose: 'kneel' }); }],
          [L[6] + 2.5, b => { pose('isaac', 'raise'); beamOn(b, 'jacob', { dur: 5, k: 0.6 }); }],
          [L[6] + 5.5, () => { pose('isaac', 'sit'); pose('jacob', 'stand'); hold('jacob', 'staff'); }],
          [L[6] + 6.5, b => { embrace('rebekah', 'jacob', { weep: true }); sfx(b, 'weep'); }],
          // 雅各出了别是巴；太阳落了
          [L[7] - 0.5, b => {
            pose('rebekah', 'stand', { weep: false }); pose('jacob', 'stand', { weep: false });
            W.goTo(0.76, 9, b.instant);
            walk('jacob', X.bethel + 0.014, { speed: 0.012 });
            W.set('jbDew', 0, b.instant);
          }],
          [L[7] + 3, () => { face('rebekah', 1); pose('rebekah', 'weep'); }],
          [L[7] + 7, b => {
            prop('stone', 'stone', { x: X.bethel, label: '石头' });
            hold('jacob', null);
            face('jacob', 1);
            pose('jacob', 'lie');
          }],
          [L[7] + 8.5, b => {
            W.goTo(0.93, 7, b.instant);
            for (const id of ['tentI', 'tentR', 'field', 'esek', 'sitnah', 'rehoboth', 'altarI', 'spring']) unprop(id);
            rm('isaac'); rm('rebekah');
            uncrowd('svI'); uncrowd('herdI'); uncrowd('herdI2');
            rm('camI'); rm('cowI1'); rm('cowI2');
          }],
        ]);
      },
    },

    // ── 5 · 伯特利：我也与你同在 ─────────────────────────────
    {
      kind: 'promise', utter: '我也与你同在', cmd: 'mount 天梯 地 → 天  # 使者上去下来', ref: '28:15', hold: 2.8, tint: [255, 238, 196],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => { W.goTo(0.02, 4, b.instant); W.set('jbLadder', 1, b.instant); glow('jacob', 0.55); sfx(b, 'harp'); }],
          [L[1], b => gate(b, 9)],
          [L[2] + 0.5, b => earth(b, X.bethel, 11)],
          [L[3], b => { beamOn(b, 'jacob', { dur: 8, w: 60 }); glow('jacob', 0.85); }],
          [L[4], () => pose('jacob', 'sit')],
          [L[5], () => pose('jacob', 'fall')],
          [L[5] + 3.5, b => { W.set('jbLadder', 0, b.instant); W.goTo(0.27, 8, b.instant); }],
          [L[6], b => {
            pose('jacob', 'stand');
            prop('stone', null, { stand: 1, label: '柱子' });
            if (!b.instant) fx().dust(X.bethel * W.w, gY(2, X.bethel), 16, [226, 206, 170], 8);
          }],
          [L[6] + 2.5, b => {
            prop('stone', null, { oil: 1, lit: 1 });
            pose('jacob', 'kneel');
            if (!b.instant) fx().sparkle(X.bethel * W.w, gY(2, X.bethel) - 26 * LS(2), 20, [255, 232, 170], 6, 'top');
          }],
          [L[6] + 3.5, b => {
            prop('stone', null, { label: '伯特利' });
            if (!b.instant) {
              const size = M() * 0.06, cx = X.bethel * W.w, cy = gY(2, X.bethel) - 26 * LS(2) - size * 1.6;
              const c2 = nameAt(cx, cy, size, 3);
              fx().nameStr('伯特利', c2[0], c2[1], size, [255, 230, 176], () => (Math.random() < 0.5 ? srcSky() : [cx + rand(-60, 60) * SU(), gY(2, X.bethel) + rand(-10, 30)]), { hold: 3.2 });
              const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime('伯'));
            }
          }],
          [L[7], () => pose('jacob', 'pray')],
          [L[7] + 6, () => { pose('jacob', 'stand'); hold('jacob', 'staff'); prop('stone', null, { lit: 0.25 }); glow('jacob', 0.4); }],
        ]);
      },
    },

    // ── 6 · 你无论往哪里去，我必保佑你：井边、拉班、七年、利亚与拉结 ──
    {
      kind: 'promise', utter: '你无论往哪里去，我必保佑你', cmd: 'route 雅各 → 哈兰  # 七年如同几天', ref: '28:15',
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.42, 5, b.instant);
            walk('jacob', X.wellH - 0.04, { speed: 0.03 });
            prop('wellH', 'well', { x: X.wellH, lid: true, label: '井' });
            prop('tentLa', 'tent', { x: X.tentLa, label: '拉班的帐棚' });
            if (!hasCrowd('flockW')) herd('flockW', { kind: 'sheep', n: 8, x0: X.wellH - 0.035, x1: X.wellH + 0.055, pose: 'lie', label: '羊群', from: b.instant ? 'none' : 'fade' });
            if (!hasCrowd('shep')) crowd('shep', { n: 3, x0: X.wellH + 0.012, x1: X.wellH + 0.05, layer: 2, label: '牧人', from: b.instant ? 'none' : 'fade', mill: false });
            add('laban', { label: '拉班', sex: 'm', age: 'adult', x: X.tentLa - 0.022, facing: -1, robe: ROBE.laban, glow: 0.2, from: b.instant ? 'none' : 'fade' });
          }],
          [6, () => face('jacob', 1)],
          [L[1] - 3, b => {
            add('rachel', { label: '拉结', sex: 'f', age: 'adult', x: 1.05, facing: -1, robe: ROBE.rachel, glow: 0.35, from: b.instant ? 'none' : 'fade' });
            walk('rachel', X.wellH + 0.03, { speed: 0.028 });
            if (!hasCrowd('flockL')) herd('flockL', { kind: 'sheep', n: 5, x0: 1.02, x1: 1.1, label: '拉班的羊群', from: b.instant ? 'none' : 'fade' });
            crowdWalk('flockL', X.wellH + 0.035, X.wellH + 0.1, { speed: 0.028, pose: 'stand' });
          }],
          [L[1] + 2.5, () => walk('jacob', X.wellH - 0.014, { speed: 0.02, pose: 'carry' })],
          [L[1] + 4.5, b => { prop('wellH', null, { open: 1, lit: 0.7 }); pose('jacob', 'stand'); sfx(b, 'splash'); }],
          [L[1] + 6.5, () => { crowdWalk('flockL', X.wellH - 0.02, X.wellH + 0.06, { pose: 'graze' }); crowdPose('flockW', 'stand'); }],
          [L[2], () => { walk('jacob', X.wellH + 0.016, { speed: 0.02 }); face('rachel', -1); }],
          [L[2] + 1.8, b => { pose('jacob', 'weep'); sfx(b, 'weep'); }],
          [L[3] - 2.5, () => { pose('jacob', 'stand'); run('rachel', X.tentLa - 0.04); }],
          [L[3] + 0.3, () => embrace('laban', 'jacob', { run: true })],
          [L[4] - 1, () => { walk('laban', X.tentLa - 0.028, { speed: 0.02 }); walk('jacob', X.tentLa - 0.058, { speed: 0.02 }); prop('wellH', null, { lit: 0 }); }],
          [L[4] + 1.5, () => { face('jacob', 1); walk('rachel', X.tentLa - 0.078, { speed: 0.02 }); }],
          [L[4] + 3, () => pose('jacob', 'point')],
          // 七年如同几天
          [L[5], b => { pose('jacob', 'stand'); walk('jacob', X.wellH + 0.005, { speed: 0.025, pose: 'carry' }); carry('jacob', 'lamb'); fullDay(b, 3); }],
          [L[5] + 3.1, b => { fullDay(b, 3); walk('jacob', X.wellH + 0.045, { speed: 0.02, pose: 'carry' }); }],
          [L[5] + 6.2, b => { fullDay(b, 3); walk('jacob', X.wellH - 0.01, { speed: 0.02, pose: 'carry' }); }],
          // 筵席；到晚上，拉班将利亚送来
          [L[5] + 9.2, b => {
            carry('jacob', null);
            W.goTo(0.8, 1.5, b.instant);
            prop('tentJ', 'tent', { x: X.tentJ, lit: 1, size: 0.9, label: '雅各的帐棚' });
            prop('tentLa', null, { lit: 1 });
            if (!hasCrowd('feast')) crowd('feast', { n: 6, x0: X.tentLa - 0.07, x1: X.tentLa + 0.03, layer: 2, label: '那地方的众人', from: b.instant ? 'none' : 'fade' });
            add('leah', { label: '利亚', sex: 'f', age: 'adult', x: X.tentLa + 0.02, facing: -1, robe: ROBE.leah, glow: 0.3, from: b.instant ? 'none' : 'fade' });
            add('zilpah', { label: '悉帕', sex: 'f', age: 'adult', x: X.tentLa + 0.04, facing: -1, robe: ROBE.zilpah, glow: 0.15, from: b.instant ? 'none' : 'fade' });
            walk('jacob', X.tentJ + 0.014, { speed: 0.025 });
          }],
          [L[5] + 10.6, b => { W.goTo(0.0, 1.6, b.instant); walk('leah', X.tentJ - 0.012, { speed: 0.025 }); walk('zilpah', X.tentJ - 0.035, { speed: 0.025 }); }],
          [L[6] + 0.4, b => { W.goTo(0.27, 3, b.instant); uncrowd('feast'); prop('tentLa', null, { lit: 0 }); prop('tentJ', null, { lit: 0 }); }],
          [L[6] + 2.5, () => walk('jacob', X.tentLa - 0.042, { speed: 0.025 })],
          [L[6] + 5, () => { face('jacob', 1); pose('jacob', 'point'); face('laban', -1); }],
          [L[7], b => {
            pose('jacob', 'stand');
            prop('tentRa', 'tent', { x: X.tentRa, size: 0.84, label: '拉结的帐棚' });
            walk('jacob', X.tentRa - 0.014, { speed: 0.02 });
            walk('rachel', X.tentRa + 0.006, { speed: 0.02 });
            add('bilhah', { label: '辟拉', sex: 'f', age: 'adult', x: X.tentLa + 0.02, facing: -1, robe: ROBE.bilhah, glow: 0.15, from: b.instant ? 'none' : 'fade' });
            walk('bilhah', X.tentRa + 0.03, { speed: 0.02 });
            if (!b.instant) fx().ring(X.tentRa * W.w, gY(2, X.tentRa) - 18 * LS(2), [255, 226, 190], M() * 0.2, 2.2, 1.5);
          }],
          [L[7] + 4, () => holdHands('jacob', 'rachel', true)],
        ]);
      },
    },

    // ── 7 · 耶和华见利亚失宠：众子 ───────────────────────────
    {
      kind: 'act', utter: '耶和华见利亚失宠，就使她生育', cmd: 'spawn 流便 西缅 利未 犹大 …  # 神看见', ref: '29:31',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => { holdHands('jacob', 'rachel', false); beamOn(b, 'leah', { dur: 6, k: 0.8 }); glow('leah', 0.5); walk('leah', X.tentJ + 0.01, { speed: 0.02 }); }],
          [L[1] + 1, b => birth(b, 'reuben', '流便', 'leah')],
          [L[2] + 0.5, b => birth(b, 'simeon', '西缅', 'leah')],
          [L[2] + 3.5, b => birth(b, 'levi', '利未', 'leah')],
          [L[3] + 1, b => birth(b, 'judah', '犹大', 'leah')],
          [L[3] + 4.5, b => fullDay(b, 5)],
          [L[4], () => { walk('rachel', X.tentRa + 0.016, { speed: 0.02, pose: 'kneel' }); pose('rachel', 'kneel', { weep: true }); walk('jacob', X.tentRa - 0.012, { speed: 0.02 }); }],
          [L[4] + 4, () => { face('jacob', 1); face('rachel', -1); }],
          [L[5] + 0.5, b => { pose('rachel', 'kneel', { weep: false }); birth(b, 'dan', '但', 'bilhah'); }],
          [L[5] + 4, b => birth(b, 'naphtali', '拿弗他利', 'bilhah')],
          [L[6] + 0.5, b => birth(b, 'gad', '迦得', 'zilpah')],
          [L[6] + 4, b => birth(b, 'asher', '亚设', 'zilpah')],
          [L[7] - 1.5, b => fullDay(b, 5)],
          [L[7] + 1, b => birth(b, 'issachar', '以萨迦', 'leah')],
          [L[7] + 4.5, b => birth(b, 'zebulun', '西布伦', 'leah')],
          [L[8] + 0.5, b => birth(b, 'dinah', '底拿', 'leah')],
          [L[8] + 4, () => { pose('rachel', 'pray'); glow('leah', 0.3); }],
        ]);
      },
    },

    // ── 8 · 神顾念拉结：约瑟 ────────────────────────────────
    {
      kind: 'act', utter: '神顾念拉结，应允了她，使她能生育', cmd: 'remember 拉结 && spawn 约瑟', ref: '30:22', tint: [255, 226, 170],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => { beamOn(b, 'rachel', { dur: 7, w: 80 }); glow('rachel', 0.6); sfx(b, 'harp'); }],
          [2.5, b => {
            pose('rachel', 'stand');
            carry('rachel', 'baby');
            if (!b.instant) { const p = figPt('rachel', 0.5); if (p) { fx().ring(p[0], p[1], [255, 226, 160], M() * 0.3, 2.4, 2); fx().sparkle(p[0], p[1], 30, [255, 232, 180], 12, 'top'); } W.flash = 0.2; }
          }],
          [L[1] + 1, b => nameOver(b, 'rachel', '约瑟', [255, 226, 160], srcSky, { size: 0.05, hold: 3 })],
          [L[2], () => walk('jacob', X.tentLa - 0.036, { speed: 0.02 })],
          [L[2] + 3.5, () => { face('jacob', 1); pose('jacob', 'point'); face('laban', -1); }],
          [L[3], () => { pose('jacob', 'stand'); pose('laban', 'raise'); }],
          [L[3] + 4, () => pose('laban', 'stand')],
          [L[3] + 6.5, b => {
            carry('rachel', null);
            add('joseph', { label: '约瑟', sex: 'm', age: 'child', x: KID.joseph[0], v: KID.joseph[1], facing: -1, robe: ROBE.joseph, glow: 0.55, from: b.instant ? 'none' : 'fade', prop: null });
            glow('rachel', 0.4);
          }],
        ]);
      },
    },

    // ── 9 · 凡拉班向你所做的，我都看见了：有点有斑的羊 ──────────
    {
      kind: 'judge', utter: '凡拉班向你所做的，我都看见了', cmd: 'filter 羊群 --where 有点 || 有斑 || 有纹', ref: '31:12',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => { beam(b, 0.83, 2, { w: 240, dur: 7, k: 0.6, r: 0.4 }); sfx(b, 'harp'); }],
          [L[1], () => walk('jacob', X.wellH - 0.02, { speed: 0.02, pose: 'point' })],
          [L[1] + 3, b => {
            if (!hasCrowd('flockX')) herd('flockX', { kind: 'goat', n: 4, speckled: true, x0: X.wellH + 0.02, x1: X.wellH + 0.07, label: '有斑的山羊', from: b.instant ? 'none' : 'fade' });
            if (!hasCrowd('lsons')) crowd('lsons', { n: 2, x0: X.wellH + 0.06, x1: X.wellH + 0.08, layer: 2, label: '拉班的儿子们', from: b.instant ? 'none' : 'fade', mill: false });
          }],
          [L[1] + 5, () => { crowdWalk('flockX', 1.06, 1.12, { speed: 0.022 }); crowdWalk('lsons', 1.08, 1.13, { speed: 0.022 }); }],
          [L[2], b => { prop('troughs', 'troughs', { x: X.troughs, grow: 1, label: '水槽' }); walk('jacob', X.troughs + 0.02, { speed: 0.022, pose: 'kneel' }); sfx(b, 'build'); }],
          [L[2] + 3, () => prop('troughs', null, { rods: 1 })],
          [L[2] + 5, () => { crowdWalk('flockW', X.troughs - 0.035, X.troughs + 0.03, { pose: 'graze', speed: 0.02 }); crowdWalk('flockL', X.troughs + 0.03, X.troughs + 0.07, { pose: 'graze', speed: 0.02 }); }],
          [L[2] + 9, () => { uncrowd('flockX'); uncrowd('lsons'); }],
          [L[3], b => {
            if (!hasCrowd('flockS')) herd('flockS', { kind: 'sheep', n: 7, speckled: true, x0: X.troughs - 0.05, x1: X.troughs + 0.05, label: '有点有斑的羊', from: b.instant ? 'none' : 'dust' });
            if (!b.instant) fx().sparkle(X.troughs * W.w, gY(2, X.troughs) - 10, 30, [255, 240, 214], 40, 'top');
          }],
          [L[3] + 3, b => { if (!hasCrowd('goatS')) herd('goatS', { kind: 'goat', n: 5, speckled: true, x0: X.troughs - 0.07, x1: X.troughs - 0.02, label: '有纹有斑的山羊', from: b.instant ? 'none' : 'dust' }); }],
          [L[4], b => {
            if (!hasCrowd('flockS2')) herd('flockS2', { kind: 'sheep', n: 6, speckled: true, x0: 0.73, x1: 0.77, label: '羊群', from: b.instant ? 'none' : 'dust' });
            pose('jacob', 'stand');
            animal('cam1', 'camel', 1.08, { facing: -1, from: b.instant ? 'none' : 'fade' }); walk('cam1', 0.905, { speed: 0.03 });
            animal('cam2', 'camel', 1.12, { facing: -1, from: b.instant ? 'none' : 'fade' }); walk('cam2', 0.94, { speed: 0.03 });
            animal('cam3', 'camel', 1.16, { facing: -1, from: b.instant ? 'none' : 'fade' }); walk('cam3', 0.97, { speed: 0.03 });
            animal('don1', 'donkey', 1.06, { facing: -1, from: b.instant ? 'none' : 'fade' }); walk('don1', 0.87, { speed: 0.03 });
            if (!hasCrowd('sv')) crowd('sv', { n: 4, x0: 1.03, x1: 1.1, layer: 2, label: '仆婢', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('sv', 0.83, 0.9, { speed: 0.03 });
            // 瘦弱的归拉班
            crowdWalk('flockW', 1.04, 1.1, { speed: 0.018 }); crowdWalk('flockL', 1.05, 1.12, { speed: 0.018 });
          }],
          [L[5], () => { face('laban', 1); glow('laban', 0.05); face('jacob', 1); }],
          [L[5] + 5, () => { uncrowd('flockW'); uncrowd('flockL'); uncrowd('shep'); }],
        ]);
      },
    },

    // ── 10 · 你要回你祖、你父之地 ────────────────────────────
    {
      kind: 'cmd', utter: '你要回你祖、你父之地，到你亲族那里去', cmd: 'git checkout 迦南  # 我必与你同在', ref: '31:3',
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => { beamOn(b, 'jacob', { dur: 6 }); pose('jacob', 'kneel'); sfx(b, 'harp'); }],
          [4, () => { pose('jacob', 'stand'); walk('jacob', X.troughs + 0.05, { speed: 0.02 }); walk('rachel', X.troughs + 0.07, { speed: 0.02 }); walk('leah', X.troughs + 0.09, { speed: 0.02 }); }],
          [L[1] + 2, () => { face('rachel', -1); face('leah', -1); face('jacob', 1); }],
          [L[2] - 2, () => {
            walk('laban', 1.08, { speed: 0.022 });
            walk('leah', 0.905, { speed: 0.03 }); walk('rachel', 0.94, { speed: 0.03 }); walk('bilhah', 0.968, { speed: 0.03 }); walk('zilpah', 0.87, { speed: 0.03 });
          }],
          [L[2] + 2.5, () => { ride('leah', 'cam1'); ride('rachel', 'cam2'); ride('bilhah', 'cam3'); ride('zilpah', 'don1'); unprop('troughs'); }],
          [L[3] + 1, b => { glint(b, 'cam2'); rm('laban'); }],
          [L[3] + 3, b => {
            for (const id of ['tentJ', 'tentRa', 'tentLa', 'wellH']) unprop(id);
            walk('jacob', X.gilead - 0.01, { speed: 0.02 });
            walk('cam2', X.gilead + 0.012, { speed: 0.02 }); walk('cam1', X.gilead + 0.04, { speed: 0.02 }); walk('cam3', X.gilead + 0.066, { speed: 0.02 }); walk('don1', X.gilead + 0.09, { speed: 0.02 });
            C().follow && ['joseph'].forEach(id => C().follow(id, 'cam2', 0.012));
            LEAH_KIDS.forEach((id, i) => { if (fig(id)) walk(id, X.gilead + 0.03 + i * 0.006, { speed: 0.02 }); });
            ['dan', 'naphtali'].forEach((id, i) => walk(id, X.gilead + 0.062 + i * 0.006, { speed: 0.02 }));
            ['gad', 'asher'].forEach((id, i) => walk(id, X.gilead + 0.084 + i * 0.006, { speed: 0.02 }));
            flocks(X.gilead + 0.1, X.gilead + 0.17);
            crowdWalk('sv', X.gilead + 0.11, X.gilead + 0.15, { speed: 0.02 });
          }],
          // 拉班追上
          [L[4], b => {
            W.goTo(0.8, 5, b.instant);
            add('laban', { label: '拉班', sex: 'm', age: 'adult', x: 1.08, facing: -1, robe: ROBE.laban, glow: 0.15, from: b.instant ? 'none' : 'fade' });
            walk('laban', X.gilead + 0.2, { speed: 0.04 });
            if (!hasCrowd('lb')) crowd('lb', { n: 5, x0: 1.04, x1: 1.12, layer: 2, label: '拉班的众弟兄', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('lb', X.gilead + 0.21, X.gilead + 0.26, { speed: 0.04 });
            prop('tentLb', 'tent', { x: X.gilead + 0.24, size: 0.85, label: '拉班的帐棚' });
          }],
          [L[4] + 3, () => { ride('leah', null); ride('rachel', null); ride('bilhah', null); ride('zilpah', null); if (C().follow) C().follow('joseph', null); }],
          [L[5] - 1.5, b => { W.goTo(0.98, 4, b.instant); pose('laban', 'lie'); crowdPose('lb', 'sit'); pose('jacob', 'sit'); }],
          [L[5] + 0.5, b => beamOn(b, 'laban', { dur: 6, k: 0.8, white: true })],
          [L[6] - 2.5, b => {
            W.goTo(0.28, 3.5, b.instant);
            pose('laban', 'stand'); pose('jacob', 'stand');
            walk('laban', X.gilead + 0.035, { speed: 0.03 }); walk('jacob', X.gilead - 0.012, { speed: 0.02 });
            crowdWalk('lb', X.gilead + 0.05, X.gilead + 0.1, { speed: 0.03 });
          }],
          [L[6], b => { prop('heap', 'heap', { x: X.gilead + 0.012, grow: 1, label: '迦累得' }); crowdPose('lb', 'carry'); sfx(b, 'build'); }],
          [L[6] + 5, () => { crowdPose('lb', 'sit'); pose('jacob', 'sit'); pose('laban', 'sit'); }],
          [L[7], b => {
            prop('heap', null, { lit: 1, label: '米斯巴' });
            pose('jacob', 'stand'); pose('laban', 'stand'); crowdPose('lb', 'stand');
            if (!b.instant) fx().ring((X.gilead + 0.012) * W.w, gY(2, X.gilead) - 10 * LS(2), [255, 236, 196], M() * 0.35, 2.6, 2);
          }],
          [L[7] + 5, () => prop('heap', null, { lit: 0.15 })],
          [L[8], () => { walk('laban', X.gilead + 0.05, { speed: 0.02, pose: 'raise' }); face('rachel', 1); face('leah', 1); }],
          [L[8] + 3.5, () => {
            pose('laban', 'stand');
            walk('laban', 1.08, { speed: 0.025 });
            crowdWalk('lb', 1.06, 1.14, { speed: 0.025 });
            unprop('tentLb');
          }],
          [L[8] + 11, () => { rm('laban'); uncrowd('lb'); }],
        ]);
      },
    },

    // ── 11 · 神的使者遇见他：玛哈念；惧怕；雅博渡口；摔跤 ────────
    {
      kind: 'act', utter: '神的使者遇见他', cmd: 'spawn 神的军兵 ×2  # 玛哈念', ref: '32:1',
      verse: V11,
      apply(c) {
        const L = starts(V11);
        const angels = ['angA0', 'angA1', 'angA2', 'angA3', 'angB0', 'angB1', 'angB2', 'angB3'];
        T(c, [
          [0, b => {
            angels.forEach((id, i) => {
              const x = i < 4 ? 0.73 + i * 0.013 : 0.83 + (i - 4) * 0.013;
              add(id, { label: '神的使者', sex: 'm', age: 'adult', layer: 1, x, facing: x < X.mahanaim ? 1 : -1, angel: true, glow: 0.9, from: b.instant ? 'none' : 'light' });
            });
            walk('jacob', X.mahanaim, { speed: 0.02 });
            sfx(b, 'harp');
          }],
          [2, () => pose('jacob', 'gaze')],
          [L[1] + 0.5, b => {
            if (b.instant) return;
            const size = M() * 0.055, cx = X.mahanaim * W.w, cy = gY(1, X.mahanaim) - W.h * 0.16;
            const c2 = nameAt(cx, cy, size, 3);
            fx().nameStr('玛哈念', c2[0], c2[1], size, [255, 238, 206], () => { const i = Math.floor(Math.random() * 8), p = figPt(angels[i], 0.6); return p ? [p[0] + rand(-6, 6), p[1] + rand(-8, 8)] : srcSky(); }, { hold: 3 });
            const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime('玛'));
          }],
          [L[1] + 6.5, () => angels.forEach(id => rm(id))],
          [L[2] - 1, b => {
            W.set('jbSeir', 1, b.instant);
            pose('jacob', 'stand');
            if (!hasCrowd('edomM')) crowd('edomM', { n: 10, x0: 0.5, x1: 0.6, layer: 1, label: '以扫的四百人', from: b.instant ? 'none' : 'fade', mill: false });
          }],
          [L[2] + 3, () => {
            // 分做两队
            crowdWalk('flockS', X.mahanaim + 0.01, X.mahanaim + 0.05, { speed: 0.02 }); crowdWalk('goatS', X.mahanaim + 0.02, X.mahanaim + 0.06, { speed: 0.02 });
            crowdWalk('flockS2', X.mahanaim + 0.11, X.mahanaim + 0.16, { speed: 0.02 });
            walk('cam1', X.mahanaim + 0.12, { speed: 0.02 }); walk('cam3', X.mahanaim + 0.15, { speed: 0.02 });
          }],
          [L[3], () => pose('jacob', 'pray')],
          [L[3] + 3, b => {
            // 礼物先过去了：一群一群，往以扫那里
            if (!hasCrowd('gift1')) herd('gift1', { kind: 'goat', n: 6, x0: 0.86, x1: 0.92, label: '礼物：山羊', from: b.instant ? 'none' : 'fade' });
            if (!hasCrowd('gift2')) herd('gift2', { kind: 'sheep', n: 6, x0: 0.9, x1: 0.96, label: '礼物：绵羊', from: b.instant ? 'none' : 'fade' });
            if (!hasCrowd('gift3')) herd('gift3', { kind: 'cow', n: 3, x0: 0.94, x1: 0.99, label: '礼物：牛', from: b.instant ? 'none' : 'fade' });
            if (!hasCrowd('gsv')) crowd('gsv', { n: 3, x0: 0.9, x1: 0.98, layer: 2, label: '赶群畜的人', from: b.instant ? 'none' : 'fade', mill: false });
          }],
          [L[3] + 4.5, () => {
            crowdWalk('gift1', 0.4, 0.46, { speed: 0.032 }); crowdWalk('gift2', 0.42, 0.48, { speed: 0.03 }); crowdWalk('gift3', 0.44, 0.5, { speed: 0.028 });
            crowdWalk('gsv', 0.43, 0.49, { speed: 0.03 });
          }],
          [L[3] + 22, () => { uncrowd('gift1'); uncrowd('gift2'); uncrowd('gift3'); uncrowd('gsv'); }],
          // 夜间过雅博渡口
          [L[4] - 1, b => { W.goTo(0.93, 6, b.instant); pose('jacob', 'stand'); prop('stream', null, { label: '雅博渡口' }); }],
          [L[4] + 0.5, () => {
            household(0.708, { k: 0.5, jacob: false, speed: 0.022 });
            flocks(0.62, 0.7, { speed: 0.022 });
            crowdWalk('sv', 0.66, 0.7, { speed: 0.022 });
            walk('jacob', X.peniel - 0.004, { speed: 0.02 });
          }],
          [L[5] - 1, b => W.goTo(0.02, 5, b.instant)],
          [L[5] + 0.5, b => {
            add('man', { label: '那人', sex: 'm', age: 'adult', x: X.peniel + 0.05, facing: -1, robe: ROBE.man, glow: 0.9, from: b.instant ? 'none' : 'fade' });
            face('jacob', 1);
          }],
          [L[5] + 2, () => {
            const gap = (34 * LS(2) * 0.3) / Math.max(1, W.w);
            walk('jacob', X.peniel - gap / 2, { speed: 0.02, pose: 'wrestle' });
            walk('man', X.peniel + gap / 2, { speed: 0.03, pose: 'wrestle' });
          }],
          [L[6] + 0.5, b => { touch(b, 'jacob'); if (!b.instant) W.shake = 0.55; sfx(b, 'wind'); }],
          [L[7], b => W.goTo(0.19, 7, b.instant)],
        ]);
      },
    },

    // ── 12 · 你的名不要再叫雅各，要叫以色列 ───────────────────
    {
      kind: 'name', utter: '你的名不要再叫雅各，要叫以色列', cmd: 'git mv 雅各 以色列  # 与神与人较力，都得了胜', ref: '32:28', hold: 3.8, tint: [255, 216, 172],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            pose('jacob', 'stand'); pose('man', 'stand');
            face('jacob', 1); face('man', -1);
            W.goTo(0.262, 12, b.instant);
            relabel('jacob', '以色列');
            glow('jacob', 0.7);
            if (!b.instant) {
              W.flash = 0.3;
              const size = M() * 0.08, p = figPt('jacob', 1) || [X.peniel * W.w, W.h * 0.8];
              const cx = clamp(p[0], W.w * 0.25, W.w * 0.8), cy = Math.min(W.h * 0.42, p[1] - size * 2.2);
              const c2 = nameAt(cx, cy, size, 3);
              // 雅各：自他身上聚成，停一停，散去
              fx().nameStr('雅各', c2[0], c2[1], size * 0.82, [206, 212, 236], srcAround('jacob', 30), { hold: 1.1 });
              // 以色列：黎明的光与散开的旧名一同聚成
              fx().nameStr('以色列', c2[0], c2[1], size, [255, 224, 164], () => (Math.random() < 0.55
                ? [c2[0] + rand(-1, 1) * size * 1.4, c2[1] + rand(-0.6, 0.6) * size]
                : [W.core.x + rand(-80, 80) * SU(), W.horizonY - rand(0, 30) * SU()]), { delay: 2.9, hold: 4.4 });
              const a = au();
              if (a && a.nameChime) { U.safe('audio.nameChime', () => a.nameChime('以')); }
            }
            sfx(b, 'harp');
          }],
          [L[1] - 1, () => pose('jacob', 'kneel')],
          [L[1] + 1.5, b => { pose('man', 'raise'); beamOn(b, 'jacob', { dur: 6, k: 0.8 }); }],
          [L[1] + 6, b => {
            if (!b.instant) { const p = figPt('man', 0.5); if (p) fx().sparkle(p[0], p[1], 40, [255, 240, 214], 14, 'top'); }
            rm('man');
          }],
          [L[3], () => { pose('jacob', 'stand'); hold('jacob', 'staff'); walk('jacob', 0.705, { speed: 0.01 }); glow('jacob', 0.45); }],
        ]);
      },
    },

    // ── 13 · 我必定厚待你：以扫跑来；示剑 ─────────────────────
    {
      kind: 'promise', utter: '我必定厚待你', cmd: 'merge 以扫 雅各  # 两个人就哭了', ref: '32:12', hold: 2.6, tint: [255, 222, 190],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const beats = [
          [0, b => {
            add('esau', { label: '以扫', sex: 'm', age: 'adult', x: 0.45, facing: 1, robe: ROBE.esau, glow: 0.25, from: b.instant ? 'none' : 'fade' });
            walk('esau', 0.6, { speed: 0.028 });
            if (!hasCrowd('edom')) crowd('edom', { n: 7, x0: 0.42, x1: 0.47, layer: 2, label: '以扫的四百人', from: b.instant ? 'none' : 'fade', mill: false });
            crowdWalk('edom', 0.5, 0.58, { speed: 0.028 });
            crowdWalk('edomM', 0.55, 0.64, { speed: 0.02 });
            // 两个使女和她们的孩子在前头，利亚和她的孩子在后头，拉结和约瑟在尽后头（33:2）
            walk('jacob', 0.7, { speed: 0.02 });
            const q = (id, x) => { if (fig(id)) walk(id, x, { speed: 0.025 }); };
            q('bilhah', 0.713); q('dan', 0.717); q('naphtali', 0.721); q('zilpah', 0.726); q('gad', 0.73); q('asher', 0.734);
            q('leah', 0.742); LEAH_KIDS.forEach((id, i) => q(id, 0.746 + i * 0.0035));
            q('rachel', 0.768); q('joseph', 0.772);
          }],
        ];
        // 一连七次俯伏在地
        for (let k = 0; k < 7; k++) beats.push([L[1] + k * 0.95, () => walk('jacob', 0.7 - (k + 1) * 0.0022, { speed: 0.012, pose: k === 6 ? 'fall' : 'bow' })]);
        beats.push(
          [L[2], b => { const j = fig('jacob'); embrace('esau', 'jacob', { run: true, weep: true, at: (j ? j.nx : 0.685) - 0.006 }); sfx(b, 'weep'); }],
          [L[2] + 3.5, b => { if (!b.instant) { const p = figPt('jacob', 0.6); if (p) fx().ring(p[0], p[1], [255, 226, 180], M() * 0.3, 2.6, 2); } glow('esau', 0.5); }],
          [L[3], () => { ['bilhah', 'dan', 'naphtali', 'zilpah', 'gad', 'asher'].forEach(id => { if (fig(id)) pose(id, 'bow'); }); }],
          [L[3] + 2, () => { ['leah'].concat(LEAH_KIDS).forEach(id => { if (fig(id)) pose(id, 'bow'); }); }],
          [L[3] + 4, () => { ['rachel', 'joseph'].forEach(id => { if (fig(id)) pose(id, 'bow'); }); }],
          [L[3] + 6.5, () => { FAMILY.forEach(id => { if (fig(id) && id !== 'jacob') pose(id, 'stand'); }); pose('esau', 'stand', { weep: false }); pose('jacob', 'stand', { weep: false }); }],
          [L[4], () => { walk('esau', 0.43, { speed: 0.026 }); crowdWalk('edom', 0.38, 0.44, { speed: 0.026 }); crowdWalk('edomM', 0.46, 0.5, { speed: 0.02 }); glow('esau', 0.25); }],
          [L[4] + 8, () => { rm('esau'); uncrowd('edom'); uncrowd('edomM'); }],
          // 疏割、示剑：支搭帐棚、筑坛
          [L[5], b => {
            prop('city', 'city', { x: X.city, layer: 1, label: '示剑城' });
            prop('tentS', 'tent', { x: X.tentS, label: '帐棚' });
            prop('oak', 'oak', { x: X.oak, size: 0.95, label: '橡树' });
            prop('altarS', 'altar', { x: X.altarS, grow: 1, label: '伊利伊罗伊以色列' });
            walk('jacob', X.altarS + 0.014, { speed: 0.02 });
            sfx(b, 'build');
          }],
          [L[5] + 1, b => fullDay(b, 7)],
          [L[5] + 4.5, () => {
            // 孩子们长大了
            SONS12.forEach(id => { if (fig(id) && id !== 'joseph' && id !== 'benjamin') add(id, { age: 'adult', scale: 0.96 }); });
            if (fig('dinah')) add('dinah', { age: 'adult' });
            if (fig('joseph')) add('joseph', { scale: 1.2 });
          }],
          [L[5] + 7, b => { prop('altarS', null, { fire: 1 }); pose('jacob', 'pray'); sfx(b, 'fire'); }],
          // 34：底拿出去……暗了
          [L[6], () => { pose('jacob', 'stand'); prop('altarS', null, { fire: 0.2 }); walk('dinah', X.city - 0.018, { speed: 0.02 }); }],
          [L[6] + 5, () => rm('dinah')],
          [L[7], b => {
            W.set('jbShadow', 0.5, b.instant);
            W.goTo(0.7, 5, b.instant);
            ['simeon', 'levi'].forEach((id, i) => { if (fig(id)) walk(id, X.altarS + 0.03 + i * 0.01, { speed: 0.03 }); });
          }],
          [L[7] + 3, () => { walk('simeon', X.city - 0.012, { speed: 0.03 }); walk('levi', X.city - 0.004, { speed: 0.03 }); }],
          [L[7] + 6, b => { prop('city', null, { ember: 1, dark: 1 }); rm('simeon'); rm('levi'); if (!b.instant) W.shake = 0.25; }],
          [L[8] - 1, b => {
            prop('city', null, { ember: 0 });
            W.goTo(0.8, 4, b.instant);
            const who = { simeon: ['西缅', 'm'], levi: ['利未', 'm'], dinah: ['底拿', 'f'] };
            ['simeon', 'levi', 'dinah'].forEach((id, i) => {
              add(id, { label: who[id][0], sex: who[id][1], age: 'adult', scale: id === 'dinah' ? 1 : 0.96, robe: ROBE[id], v: KID[id][1], glow: 0.2,
                x: X.city - 0.01 + i * 0.008, facing: 1, from: b.instant ? 'none' : 'fade' });
              walk(id, X.altarS + 0.028 + i * 0.01, { speed: 0.02 });
            });
          }],
          [L[8] + 1, () => { walk('jacob', X.altarS + 0.004, { speed: 0.02, pose: 'sit' }); face('jacob', 1); }],
          [L[8] + 4, b => W.set('jbShadow', 0.72, b.instant)],
        );
        T(c, beats);
      },
    },

    // ── 14 · 起来！上伯特利去 ───────────────────────────────
    {
      kind: 'cmd', utter: '起来！上伯特利去，住在那里', cmd: 'rm -rf 外邦神 && cd 伯特利', ref: '35:1',
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => { W.set('jbShadow', 0, b.instant); W.goTo(0.3, 6, b.instant); beamOn(b, 'jacob', { dur: 7 }); pose('jacob', 'stand'); prop('city', null, { dark: 0.35 }); sfx(b, 'harp'); }],
          [L[1], () => household(X.oak - 0.012, { k: 0.45, speed: 0.022 })],
          [L[1] + 4.5, b => {
            everyone(id => { if (id !== 'jacob' && ROBE[id]) add(id, { robe: lighten(ROBE[id]) }); });
            add('jacob', { robe: lighten(ROBE.jacob, 0.25) });
            if (!b.instant) everyone(id => { const p = figPt(id, 0.5); if (p) fx().sparkle(p[0], p[1], 5, [255, 244, 222], 6, 'top'); });
          }],
          [L[2], b => { idols(b, X.oak); pose('jacob', 'kneel'); if (!b.instant) fx().dust(X.oak * W.w, gY(2, X.oak), 20, [210, 186, 150], 10); }],
          [L[2] + 5, () => pose('jacob', 'stand')],
          [L[3], b => {
            for (const id of ['tentS', 'altarS']) unprop(id);
            household(X.bethel + 0.012, { k: 0.6, speed: 0.02 });
            flocks(0.76, 0.86, { speed: 0.02 });
            crowdWalk('sv', 0.8, 0.86, { speed: 0.02 });
          }],
          [L[3] + 2, b => { if (!b.instant) { const p = figPt('jacob', 0.5); if (p) fx().ring(p[0] + W.w * 0.05, p[1], [255, 240, 214], M() * 0.55, 3.5, 2.5); } }],
          [L[4], b => { prop('altarB', 'altar', { x: X.altarB, grow: 1, label: '伊勒伯特利' }); prop('stone', null, { lit: 0.5 }); walk('jacob', X.altarB + 0.012, { speed: 0.02 }); sfx(b, 'build'); }],
          [L[4] + 4, b => { prop('altarB', null, { fire: 1 }); pose('jacob', 'pray'); sfx(b, 'fire'); }],
        ]);
      },
    },

    // ── 15 · 我是全能的神；拉结与便雅悯 ───────────────────────
    {
      kind: 'bless', utter: '我是全能的神；你要生养众多', cmd: 'bless 以色列 --be-fruitful --multiply', ref: '35:11',
      verse: V15,
      apply(c) {
        const L = starts(V15);
        T(c, [
          [0, b => {
            ghost(b, 12);
            beamOn(b, 'jacob', { dur: 8 });
            pose('jacob', 'kneel');
            prop('altarB', null, { fire: 0.4 });
            prop('stone', null, { lit: 1 });
            nameOver(b, 'jacob', '以色列', [255, 226, 170], srcSky, { size: 0.05, hold: 3, lift: 1.6 });
            sfx(b, 'harp');
          }],
          [L[1], b => {
            pose('jacob', 'raise');
            if (!b.instant) everyone(id => { const p = figPt(id, 0.5); if (p) fx().sparkle(p[0], p[1], 6, [255, 236, 200], 8, 'top'); });
            const a = au(); if (!b.instant && a && a.bless) U.safe('audio.bless', () => a.bless());
          }],
          [L[1] + 6, () => pose('jacob', 'stand')],
          [L[2], b => { prop('stone', null, { oil: 1, lit: 1 }); pose('jacob', 'kneel'); if (!b.instant) fx().sparkle(X.bethel * W.w, gY(2, X.bethel) - 26 * LS(2), 20, [255, 232, 170], 6, 'top'); }],
          [L[2] + 4, () => { pose('jacob', 'stand'); prop('stone', null, { lit: 0.3 }); prop('altarB', null, { fire: 0 }); }],
          // 往以法他的路上
          [L[3], b => {
            W.goTo(0.66, 8, b.instant);
            household(X.ephrath - 0.02, { k: 0.7, speed: 0.02 });
            flocks(0.7, 0.8, { speed: 0.02 });
            crowdWalk('sv', 0.74, 0.8, { speed: 0.02 });
          }],
          [L[3] + 3, () => { walk('rachel', X.ephrath, { speed: 0.012, pose: 'lie' }); unprop('altarB'); prop('stone', null, { lit: 0.15 }); }],
          [L[4], b => {
            add('midwife', { label: '收生婆', sex: 'f', age: 'elder', x: X.ephrath - 0.04, facing: 1, robe: ROBE.midwife, glow: 0.15, from: b.instant ? 'none' : 'fade', prop: null });
            walk('midwife', X.ephrath - 0.012, { speed: 0.02, pose: 'kneel' });
            walk('jacob', X.ephrath + 0.016, { speed: 0.02, pose: 'kneel' });
          }],
          [L[5], b => { carry('midwife', 'baby'); soul(b, 'rachel', [0.63, 0.19]); glow('rachel', 0.8); }],
          [L[5] + 3, () => rm('rachel')],
          [L[5] + 4.5, b => {
            pose('midwife', 'stand'); carry('midwife', null);
            pose('jacob', 'stand'); carry('jacob', 'baby');
            nameOver(b, 'jacob', '便雅悯', [236, 226, 206], srcAround('jacob', 50), { size: 0.04, hold: 2.6 });
          }],
          [L[6], b => {
            prop('tomb', 'tomb', { x: X.ephrath, grow: 1, lit: 1, label: '拉结的墓碑' });
            rm('midwife');
            pose('jacob', 'kneel', { weep: true });
            walk('joseph', X.ephrath + 0.03, { speed: 0.02, pose: 'kneel' });
            sfx(b, 'weep');
          }],
          [L[6] + 6.5, b => { W.goTo(0.77, 5, b.instant); pose('jacob', 'kneel', { weep: false }); prop('tomb', null, { lit: 0.4 }); }],
        ]);
      },
    },

    // ── 16 · 我所赐给亚伯拉罕和以撒的地：以撒；以东 ──────────────
    {
      kind: 'promise', utter: '我所赐给亚伯拉罕和以撒的地，我要赐给你', cmd: 'transfer 应许之地 --to 以色列  # 以扫就是以东', ref: '35:12',
      verse: V16,
      apply(c) {
        const L = starts(V16);
        const beats = [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            sweep(b, 7);
            pose('jacob', 'stand'); carry('jacob', null);
            add('benjamin', { label: '便雅悯', sex: 'm', age: 'child', x: X.ephrath + 0.03, v: 0.12, facing: -1, robe: ROBE.benjamin, glow: 0.4, from: b.instant ? 'none' : 'fade', prop: null });
            if (fig('joseph')) add('joseph', { age: 'adult', scale: 0.88 });
            pose('joseph', 'stand');
          }],
          // 十二个儿子站成一行，光依次落在他们身上
          [L[1] - 1.5, () => {
            SONS12.forEach((id, i) => { if (fig(id)) walk(id, 0.615 + i * 0.013, { speed: 0.025 }); });
            ['leah', 'bilhah', 'zilpah', 'dinah'].forEach((id, i) => { if (fig(id)) walk(id, 0.78 + i * 0.012, { speed: 0.025 }); });
            walk('jacob', 0.6, { speed: 0.02 });
          }],
        ];
        SONS12.forEach((id, i) => beats.push([L[1] + 0.6 + i * 0.3, b => {
          glow(id, 0.75);
          if (!b.instant) { const p = figPt(id, 0.55); if (p) fx().sparkle(p[0], p[1], 8, [255, 236, 196], 6, 'top'); }
        }]));
        beats.push(
          [L[2] - 1, b => {
            SONS12.forEach(id => glow(id, 0.3));
            prop('tentM', 'tent', { x: X.tentM, label: '以撒的帐棚' });
            prop('cave', 'cave', { x: X.cave, label: '麦比拉洞' });
            add('isaac', { label: '以撒', sex: 'm', age: 'elder', x: X.tentM + 0.022, facing: 1, robe: ROBE.isaac, glow: 0.3, pose: 'sit', from: b.instant ? 'none' : 'fade' });
            walk('jacob', X.tentM + 0.046, { speed: 0.02 });
            face('jacob', -1);
          }],
          [L[2] + 4, () => pose('jacob', 'kneel')],
          [L[3], b => { W.goTo(0.745, 7, b.instant); walk('isaac', X.tentM + 0.018, { speed: 0.01, pose: 'lie' }); glow('isaac', 0.6); pose('jacob', 'kneel'); }],
          [L[3] + 3.5, b => { soul(b, 'isaac', [0.53, 0.13]); glow('isaac', 0.1); }],
          [L[3] + 4, b => {
            add('esau', { label: '以扫', sex: 'm', age: 'elder', x: 0.44, facing: 1, robe: ROBE.esau, glow: 0.2, from: b.instant ? 'none' : 'fade' });
            walk('esau', X.tentM - 0.01, { speed: 0.025 });
          }],
          [L[4], b => {
            const f = fig('isaac'), x = f ? f.nx : X.tentM + 0.018;
            rm('isaac');
            prop('bier', 'bier', { x, label: '以撒' });
            prop('bier', null, { tx: X.cave + 0.012, spd: 0.012 });
            prop('cave', null, { lit: 0.5 });
            pose('jacob', 'stand');
            walk('esau', X.cave - 0.008, { speed: 0.012 }); walk('jacob', X.cave + 0.034, { speed: 0.012 });
          }],
          [L[4] + 6, b => { unprop('bier'); prop('cave', null, { seal: 1, lit: 0 }); pose('esau', 'kneel'); pose('jacob', 'kneel'); sfx(b, 'seal'); }],
          [L[5], b => { pose('esau', 'stand'); pose('jacob', 'stand'); edomNames(b, ['以利法', '流珥', '耶乌施', '雅兰', '可拉'], 0.07); }],
          [L[6], b => {
            if (!hasCrowd('edomH')) crowd('edomH', { n: 5, x0: 0.44, x1: 0.49, layer: 2, label: '以扫的家人', from: b.instant ? 'none' : 'fade', mill: false });
            if (!hasCrowd('edomF')) herd('edomF', { kind: 'goat', n: 5, x0: 0.45, x1: 0.5, label: '以扫的群畜', from: b.instant ? 'none' : 'fade' });
            walk('esau', 0.4, { speed: 0.02 });
            crowdWalk('edomH', 0.35, 0.41, { speed: 0.02 });
            crowdWalk('edomF', 0.36, 0.42, { speed: 0.02 });
          }],
          [L[6] + 9, () => { rm('esau'); uncrowd('edomH'); uncrowd('edomF'); }],
          [L[7], b => { W.set('jbSeir', 1.5, b.instant); edomNames(b, ['提幔', '阿抹', '洗玻', '基纳斯', '亚玛力'], 0.12); }],
          [L[8], b => {
            W.goTo(0.9, 10, b.instant);
            edomNames(b, ['比拉', '约巴', '户珊', '哈达', '桑拉', '扫罗'], 0.18);
            prop('tentJ', 'tent', { x: 0.7, size: 0.95, label: '雅各的帐棚' });
            prop('tentJ2', 'tent', { x: 0.748, size: 0.85, label: '帐棚' });
            walk('jacob', 0.622, { speed: 0.018, pose: 'sit' });
            face('jacob', -1);
            SONS12.forEach((id, i) => { if (fig(id)) walk(id, 0.635 + (i % 6) * 0.011 + (i >= 6 ? 0.095 : 0), { speed: 0.02, pose: 'sit' }); });
          }],
          [L[8] + 7, () => face('jacob', -1)],
        );
        T(c, beats);
      },
    },
  ];

  GS.book.act({
    id: ACT, title: '雅各', sub: '创世记 25:19 — 36:43', tint: [228, 216, 255], outro: 24,
    intro: [
      { text: '亚伯拉罕的儿子以撒的后代记在下面。亚伯拉罕生以撒。', ref: '创世记 25:19', hold: 5.5 },
      { text: '以撒因他妻子不生育，就为她祈求耶和华；<br>耶和华应允他的祈求，他的妻子利百加就怀了孕。', ref: '创世记 25:21', hold: 7 },
      { text: '孩子们在她腹中彼此相争，她就说：「若是这样，我为什么活着呢？」<br>她就去求问耶和华。', ref: '创世记 25:22', hold: 7 },
    ],
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._jacob = { get S() { return S; }, P, X, FXL };
})(window.GS);
