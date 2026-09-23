/* ─────────────────────────────────────────────────────────────
 * book/abraham.js —— 卷 · 亚伯拉罕（创世记 12:1 — 25:18）
 *
 * 神呼召亚伯兰离开本地、本族、父家；应许这地（举目向东西南北观看，后裔如尘沙）；
 * 至高的神把敌人交在他手里；「你向天观看，数算众星」——夜空开满数不过来的星；
 * 冒烟的炉并烧着的火把从肉块中经过；夏甲与看顾人的神；「我是全能的神」与两个新名；
 * 幔利橡树下的三位客人、撒拉的笑、「耶和华岂有难成的事吗？」；为所多玛代求（五十……十）；
 * 「逃命吧！不可回头看」——硫磺与火、盐柱；以撒出生；夏甲的井；摩利亚山——
 * 「亚伯拉罕！」「你不可在这童子身上下手」、公羊、耶和华以勒、如同天上的星海边的沙；
 * 撒拉葬在麦比拉洞；井边的利百加；亚伯拉罕寿高年迈，归到他列祖那里。
 *
 * 本卷的布景（自画）：帐棚、坛与坛上的烟、摩利与幔利的橡树、平原诸城（所多玛、蛾摩拉、琐珥）、
 * 盐柱、肉块与经过其间的炉与火把、数不过来的众星、旷野的水泉（庇耳拉海莱）、垂丝柳树、
 * 麦比拉洞、摩利亚山顶的坛与稠密小树中的公羊、以实玛利十二族的营火……
 * 左边的海在本卷里是盐海：平原诸城在它的岸边（中景），日从那里升起。
 * 一切位置都以画面宽度的比例记下，随屏幕缩放不变；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'abraham';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('abStars', 'lin', 0.075);   // 数不过来的众星（15:5）
  W.defineLevel('abDrought', 'exp', 0.45);  // 饥荒（12:10）
  W.defineLevel('abDark', 'exp', 0.55);     // 惊人的大黑暗（15:12）
  W.defineLevel('abPass', 'lin', 0.1);      // 冒烟的炉并烧着的火把经过（15:17）
  W.defineLevel('abFire', 'exp', 0.9);      // 硫磺与火（19:24）
  W.defineLevel('abSmoke', 'exp', 0.3);     // 烟气上腾，如同烧窑（19:28）
  W.defineLevel('abTwelve', 'exp', 0.35);   // 以实玛利十二族的营火（25:16）

  // ── 地上的位置（画面宽度的比例）：左 = 东（盐海与平原），右 = 西（往埃及、往哈兰的路）──
  const X = {
    spring: 0.424, shrub: 0.46, pieces: 0.492, sleep: 0.582, look: 0.575,
    moreh: 0.52, altarS: 0.548,                                   // 示剑
    tentL: 0.575, altarB: 0.603, tentB: 0.632,                    // 伯特利
    oakA: 0.672, tent: 0.742, oakB: 0.8, altarM: 0.83,            // 幔利（希伯仑）
    cave: 0.875, tamarisk: 0.918, wellN: 0.958,
    // 中景（盐海岸边的平原）
    lotTent: 0.505, sodom: 0.53, gomorrah: 0.578, salt: 0.618, zoar: 0.668,
  };
  const ROBE = {
    abram: [150, 118, 84], sarai: [168, 112, 100], lot: [112, 96, 82], hagar: [196, 186, 162], ishmael: [136, 104, 72],
    isaac: [150, 132, 100], rebekah: [176, 96, 88], servant: [120, 104, 86], mel: [236, 212, 160], angel: [238, 234, 222],
    wife: [150, 116, 104], dau: [164, 120, 110],
  };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { bloom: false, moriah: 0.8, abStar: null, family: true }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LS = l => W.layerScale(l) * (W.w < 600 ? 1.15 : 1);
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; return GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { C().walk(id, x, o); }
  function pose(id, p, o) { C().pose(id, p, o); }
  function face(id, d) { C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function relabel(id, label) { const f = fig(id); if (f) f.label = label; }
  function setAge(id, age, scale) { const f = fig(id); if (f) { f.age = age; if (scale != null) f.scale = scale; } }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) {           // 手中之物（柴、火把、水瓶、包袱、帕子）
    const c = C();
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, p || null)); return; }
    const f = fig(id); if (f) f.prop = p || null;
  }
  function babe(id, what) {        // 怀中抱着婴孩
    const c = C();
    if (c.carry) { U.safe('cast.carry', () => c.carry(id, what || null)); return; }
    const f = fig(id); if (f) f.carry = what || null;
  }
  const ride = (id, m) => { const c = C(); if (c.ride) U.safe('cast.ride', () => c.ride(id, m || null)); };
  const embrace = (a, b, o) => { const c = C(); if (c.embrace) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } };
  const attach = (id, fn) => { const c = C(); if (c.attach) c.attach(id, fn || null); };
  // 羊群、牛群（人物模块若支持）
  function herd(gid, o) {
    const c = C();
    if (!c.herd || hasCrowd(gid)) return;
    U.safe('cast.herd', () => c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)));
  }
  function mill(gid, on) { const c = C(); const g = c.crowds && c.crowds.get && c.crowds.get(gid); if (g) g.members.forEach(m => { m.mill = on; }); }
  // 牲口（人物模块若支持动物则有骆驼、驴、羊；否则只是不显出）
  function animal(id, kind, x, o) {
    const c = C();
    if (!c.animal) return null;
    return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {})));
  }
  const ANIMALS = ['cam1', 'cam2', 'cam3', 'don1'];

  // 一家人（与牲口）随亚伯兰迁移：x 为亚伯兰的位置，余者在其后（dir 1 = 在他右边）
  function family(x, o) {
    o = o || {};
    const sp = o.speed || 0.02, d = o.dir || 1;
    const q = (id, dx) => walk(id, clamp(x + dx * d, 0.36, 1.12), { speed: sp, pose: o.pose });
    q('abram', 0); q('sarai', 0.022); q('hagar', 0.046); q('ishmael', 0.058); q('isaac', 0.012);
    if (o.lot !== false) q('lot', -0.026);
    if (hasCrowd('hh')) C().crowdWalk('hh', clamp(x + 0.07 * d, 0.36, 1.12), clamp(x + 0.12 * d, 0.36, 1.14), { speed: sp });
    ANIMALS.forEach((id, i) => q(id, 0.085 + i * 0.026));
    for (const [gid, a, b] of [['flock', 0.11, 0.17], ['flock2', 0.1, 0.19], ['herdC', 0.16, 0.22]]) {
      if (hasCrowd(gid)) C().crowdWalk(gid, clamp(x + a * d, 0.36, 1.16), clamp(x + b * d, 0.36, 1.2), { speed: sp });
    }
  }

  // 回到幔利的帐棚：各人各归其位；仆婢、骆驼、羊群在帐棚东边的草场
  function home(o) {
    o = o || {};
    const sp = o.speed || 0.022, t = X.tent;
    const q = (id, x) => walk(id, x, { speed: sp });
    q('abram', t - 0.028); q('sarai', t + 0.016); q('hagar', t + 0.04); q('ishmael', t + 0.056); q('isaac', t + 0.028);
    if (hasCrowd('hh')) C().crowdWalk('hh', t + 0.058, t + 0.088, { speed: sp });
    q('cam1', t + 0.1); q('cam2', t + 0.124); q('cam3', t + 0.148); q('don1', t + 0.078);
    if (hasCrowd('flock2')) C().crowdWalk('flock2', t + 0.17, t + 0.25, { speed: sp });
    if (hasCrowd('herdC')) C().crowdWalk('herdC', t + 0.2, t + 0.245, { speed: sp });
  }

  // 牧人把牲畜赶到西边（左）的草场去（帐棚与麦比拉那边留给情节）
  function pasture(o) {
    const sp = (o && o.speed) || 0.02;
    if (hasCrowd('hh')) C().crowdWalk('hh', 0.5, 0.54, { speed: sp });
    if (hasCrowd('flock2')) C().crowdWalk('flock2', 0.44, 0.53, { speed: sp });
    if (hasCrowd('herdC')) C().crowdWalk('herdC', 0.47, 0.52, { speed: sp });
    ['cam1', 'cam2', 'cam3'].forEach((id, i) => walk(id, 0.545 + i * 0.024, { speed: sp }));
  }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物头顶的一点（像素）
  function headOf(id, lift) {
    const f = fig(id);
    if (!f) return [W.w * 0.6, W.h * 0.7];
    const x = f.nx * W.w;
    return [x, gY(f.layer == null ? 2 : f.layer, f.nx) - (lift || 30) * LS(f.layer == null ? 2 : f.layer)];
  }
  // 名字的位置：在画面之内
  function nameAt(xf, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(xf * W.w, half + 8, W.w - half - 8), cy];
  }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（帐棚、坛、橡树、城……）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.9, fire: 0.6, lit: 0.7, grow: 0.28, ruin: 0.2, seal: 0.7 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, {x, layer, size, label, show, fire, lit, grow, ruin, seal, tx, spd, ...})
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind: kind || 'tent', x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
    }
    for (const k of ['x', 'layer', 'size', 'label', 'wood', 'ram', 'spd']) if (o[k] != null) p[k] = o[k];
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
    if (W.replaying) { P.delete(id); return; }
    p.ta = 0; p.dying = true;
  }
  const getP = id => P.get(id) || null;
  // 坛顶（柴上）的一点：以撒被放在坛的柴上（22:9）
  function altarTop(id) {
    const p = P.get(id);
    if (!p) return null;
    const s = LS(p.layer) * p.size, y = gY(p.layer, p.x) + 1.5 * s - 0.98 * 12 * s - (p.wood ? 4.5 * s : 0);
    return [p.x * W.w, y];
  }

  // 转瞬的光（不属于世界的状态；重演时不放）
  const FXL = [];
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); }
  function beam(b, xf, layer, o) {                // 自天而降的一道光，落在某处
    if (b.instant) return;
    o = o || {};
    const l = layer == null ? 2 : layer;
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l, w: (o.w || 70) * Math.max(0.55, W.unit), k: o.k || 1 });
    if (o.ring !== false) fx().ring(xf * W.w, gY(l, xf) - 16 * LS(l), [255, 236, 190], M() * (o.r || 0.3), 2.2, 2);
  }
  function beamOn(b, id, o) {
    const f = fig(id);
    if (f) beam(b, f.nx, f.layer, o);
  }

  // ── 模型（与屏幕大小无关，以单位长度记）─────────────────────
  const MODEL = {
    oak(p) {
      const r = U.mulberry32(p.seed * 7919 + 13), blobs = [], br = [];
      for (let i = 0; i < 17; i++) {
        const a = Math.PI * (0.04 + 0.92 * (i / 16));
        blobs.push([-Math.cos(a) * (0.44 + r() * 0.12) + (r() - 0.5) * 0.08, -0.6 - Math.sin(a) * (0.24 + r() * 0.1) + (r() - 0.5) * 0.06,
          0.12 + r() * 0.09, 0]);
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
    city(p) {
      const r = U.mulberry32(p.seed * 104729 + 3), n = Math.round(6 + p.size * 8), hs = [];
      const half = 0.3 + p.size * 0.22;
      for (let i = 0; i < n; i++) {
        const ox = (n === 1 ? 0 : (i / (n - 1) - 0.5) * 2 * half) + (r() - 0.5) * 0.05;
        hs.push({ ox, w: 0.07 + r() * 0.06, h: (0.14 + r() * 0.2) * (1 - 0.5 * Math.abs(ox) / half), dome: r() < 0.14, win: r() < 0.6, tw: r() * TAU, br: 0.5 + r() * 0.5 });
      }
      hs.sort((a, b) => b.h - a.h);
      return { hs, half, tower: { ox: (r() - 0.5) * half * 0.6, w: 0.06, h: 0.34 + p.size * 0.14 } };
    },
    pieces() {
      // 三样牲畜各劈成两半，一半对着一半；鸟没有劈开
      return { back: [-0.075, -0.03, 0.015], front: [-0.068, -0.022, 0.024], birds: [0.058, 0.068] };
    },
    cave(p) {
      const r = U.mulberry32(p.seed + 99), pts = [];
      for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push([-1.1 + 2.2 * t + (r() - 0.5) * 0.05, -Math.pow(Math.sin(t * Math.PI), 0.7) * (0.62 + r() * 0.3) * (t < 0.5 ? 1 : 0.8)]); }
      pts[0][1] = 0; pts[16][1] = 0;
      const rocks = [[-1.35, 0.22], [1.3, 0.28], [1.55, 0.16], [-1.6, 0.13]];
      const trees = [[-1.95, 0.9], [1.95, 1.05], [2.3, 0.75]];
      const cracks = [];
      for (let i = 0; i < 5; i++) cracks.push([(r() - 0.5) * 1.4, -0.2 - r() * 0.4, (r() - 0.5) * 0.3, 0.1 + r() * 0.15]);
      return { pts, trees, rocks, cracks };
    },
    tamarisk(p) {
      const r = U.mulberry32(p.seed + 5), strands = [];
      for (let i = 0; i < 22; i++) { const a = (i / 21 - 0.5) * 1.9; strands.push([Math.sin(a) * 0.36 + (r() - 0.5) * 0.08, -0.82 + Math.abs(a) * 0.12 + (r() - 0.5) * 0.06, 0.3 + r() * 0.34, r() * TAU]); }
      return { strands };
    },
    spring(p) {
      const r = U.mulberry32(p.seed + 17), reeds = [];
      for (let i = 0; i < 9; i++) reeds.push([(r() - 0.5) * 2.6, 0.5 + r() * 0.8, (r() - 0.5) * 0.3]);
      return { reeds };
    },
    shrub(p) {
      const r = U.mulberry32(p.seed + 41), b = [];
      for (let i = 0; i < 8; i++) b.push([(r() - 0.5) * 1.3, -0.35 - r() * 0.5, 0.28 + r() * 0.2]);
      return { b };
    },
    thicket(p) {
      const r = U.mulberry32(p.seed + 3), tw = [];
      for (let i = 0; i < 26; i++) { const a = -Math.PI * r(); tw.push([(r() - 0.5) * 1.2, Math.cos(a) * 0.5, -0.2 - Math.abs(Math.sin(a)) * 0.9]); }
      return { tw };
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
      ember: radial([255, 92, 36], 1), smoke: radial([132, 124, 118], 0.8, 0.55), soot: radial([34, 28, 26], 0.85, 0.55),
      salt: radial([250, 250, 244], 1),
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
    // 银河：数不过来的众星汇成的光雾
    const m = cnv(768, 384), mg = m.getContext('2d'), rr = U.mulberry32(1505);
    mg.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 900; i++) {
      const t = rr(), x = t * 768, y = (0.12 + t * 0.62) * 384 + (rr() + rr() + rr() - 1.5) * 46, s = 7 + rr() * 30;
      const gr = mg.createRadialGradient(x, y, 0, x, y, s);
      const c = rr() < 0.3 ? '255,226,196' : '206,220,255';
      gr.addColorStop(0, 'rgba(' + c + ',0.07)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
      mg.fillStyle = gr; mg.fillRect(x - s, y - s, s * 2, s * 2);
    }
    SP.band = m;
    return SP;
  }

  // ── 众星（15:5）：数不过来的星，自灵经过之处开放 ────────────
  const STARS = [];
  let starA = null, starHit = null;
  function buildStars() {
    const r = U.mulberry32(1505);
    for (let i = 0; i < 1200; i++) {
      let x, y;
      if (i < 540) { const t = r(); x = t; y = 0.12 * 0.6 + t * 0.62 * 0.6 + (r() + r() + r() - 1.5) * 0.05; }
      else { x = r(); y = Math.pow(r(), 1.2) * 0.56; }
      STARS.push({ x, y: clamp(y, 0.012, 0.56), m: Math.pow(r(), 3.2), rank: r(), tw: r() * TAU, sp: 0.7 + r() * 2.4, warm: r() < 0.22 });
    }
    starA = new Float32Array(STARS.length);
    starHit = new Uint8Array(STARS.length);
    for (const st of STARS) { st.base = (0.42 + 0.58 * st.m) * (1 - smoothstep(0.42, 0.58, st.y)); st.sz = 0.6 + st.m * 1.7; st.tw = st.tw / TAU * 256; st.sp = st.sp / TAU * 256; }
    for (let b = 0; b < BUCK; b++) BUCKETS.push(new Int16Array(STARS.length));
  }
  const SIN = new Float32Array(256);
  for (let i = 0; i < 256; i++) SIN[i] = Math.sin(i / 256 * TAU);
  const BUCK = 5, BUCKETS = [], BN = new Int32Array(BUCK);
  function starTarget(i) { return (STARS[i].rank < W.lv.abStars || starHit[i]) ? 1 : 0; }

  // ════════════════════════════════════════════════════════════
  //  画：各种物件
  // ════════════════════════════════════════════════════════════
  function drawOak(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, H = 90 * s, x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
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

  const TENT = [[-1, 0], [-0.9, -0.46], [-0.64, -0.8], [-0.34, -0.66], [0, -1], [0.34, -0.68], [0.64, -0.82], [0.9, -0.48], [1, 0]];
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, hw = 34 * s, h = 27 * s;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.75); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.64 * hw, y - 0.8 * h); ctx.lineTo(x - 1.4 * hw, y);
    ctx.moveTo(x + 0.64 * hw, y - 0.82 * h); ctx.lineTo(x + 1.4 * hw, y);
    ctx.moveTo(x, y - h); ctx.lineTo(x - 0.5 * hw, y - 1.1 * h);
    ctx.stroke();
    ctx.fillStyle = css([58, 46, 40], l);
    ctx.beginPath();
    for (let i = 0; i < TENT.length; i++) { const q = TENT[i], X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    // 山羊毛织的幅
    ctx.strokeStyle = css([86, 70, 58], l, 0.55); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (const f of [-0.62, -0.3, 0.32, 0.62]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.72 - Math.abs(f) * 0.05) * h); }
    ctx.stroke();
    const dw = 0.17 * hw, dh = 0.6 * h;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.fillRect(x - dw, y - dh, dw * 2, dh);
    // 夜里门口一盏灯；蒙应许时透出金光
    const lamp = clamp(nightK() * 1.1, 0, 1) * 0.85 + p.lit;
    if (lamp > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + p.seed);
      ctx.globalAlpha = p.a * Math.min(1, lamp) * fl * 0.6;
      ctx.fillStyle = p.lit > 0.3 ? 'rgb(255,214,140)' : 'rgb(255,160,84)';
      ctx.fillRect(x - dw, y - dh, dw * 2, dh);
      const g = hw * (2.2 + p.lit * 2);
      ctx.globalAlpha = p.a * Math.min(1, lamp) * fl * (0.55 + 0.25 * p.lit);
      ctx.drawImage(p.lit > 0.3 ? SP.gold : SP.warm, x - g / 2, y - dh * 0.5 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边
    ctx.globalAlpha = p.a * 0.5;
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([226, 196, 160], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let i = k0; i <= k1; i++) { const q = TENT[i]; if (i === k0) ctx.moveTo(x + q[0] * hw, y + q[1] * h); else ctx.lineTo(x + q[0] * hw, y + q[1] * h); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

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

  // 烟柱：程序化的烟团（无粒子，按时间确定）
  function smoke(ctx, x, y, k, H, w, seed, dark, rate) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 13, day = 0.3 + 0.7 * W.daylight;
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
    const top = y - 0.98 * u;
    if (p.wood && p.grow > 0.95) {        // 柴摆在坛上
      ctx.strokeStyle = css([88, 62, 40], l); ctx.lineWidth = Math.max(1, 1.6 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) { const oy = -i * 1.3 * s; ctx.moveTo(x - 0.62 * u + i * 0.5 * s, top + oy); ctx.lineTo(x + 0.6 * u - i * 0.4 * s, top + oy - 0.4 * s); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      smoke(ctx, x, top - 6 * s, p.fire * p.a, 150 * s + W.h * 0.12, 7 * s, p.seed, false, 0.07);
      flame(ctx, x, top + 1 * s, 13 * s, p.fire * p.a, p.seed);
    }
  }

  function drawCity(ctx, p) {
    const l = p.layer, s = LS(l), u = 110 * s, x = p.x * W.w, m = p.model, ruin = p.ruin;
    const bodyC = css(U.mixRGB([186, 160, 124], [58, 46, 40], ruin), l), sideC = css(U.mixRGB([150, 124, 96], [40, 32, 28], ruin), l);
    ctx.globalAlpha = p.a;
    // 城墙
    const wx0 = x - m.half * u, wx1 = x + m.half * u, wh = 0.07 * u * (1 - 0.5 * ruin);
    ctx.fillStyle = sideC;
    ctx.beginPath();
    ctx.moveTo(wx0, gY(l, wx0 / W.w) + 2);
    for (let i = 0; i <= 8; i++) { const xx = lerp(wx0, wx1, i / 8); ctx.lineTo(xx, gY(l, xx / W.w) - wh * (ruin > 0.2 && i % 2 ? 0.5 : 1)); }
    ctx.lineTo(wx1, gY(l, wx1 / W.w) + 2);
    ctx.closePath(); ctx.fill();
    // 房屋（平顶、少许圆顶）与一座高台：先画一切房身，再画背光的一侧
    const lx = litX() >= x ? 1 : -1, broken = ruin > 0.15;
    const g0 = gY(l, p.x) + 2;
    const box = (h, ox, w, hgt, dome, o) => {
      const hx = x + ox * u, hh = hgt * u * (1 - 0.74 * ruin * h), ww = w * u, g0 = gY(l, hx / W.w) + 2;
      if (o) o._g = g0;
      if (broken) {
        ctx.moveTo(hx - ww / 2, g0); ctx.lineTo(hx - ww / 2, g0 - hh);
        ctx.lineTo(hx - ww * 0.15, g0 - hh * (0.7 + 0.2 * h)); ctx.lineTo(hx + ww * 0.1, g0 - hh * 0.9); ctx.lineTo(hx + ww / 2, g0 - hh * 0.55);
        ctx.lineTo(hx + ww / 2, g0); ctx.closePath();
      } else {
        ctx.rect(hx - ww / 2, g0 - hh, ww, hh);
        if (dome) { ctx.moveTo(hx + ww * 0.4, g0 - hh); ctx.ellipse(hx, g0 - hh, ww * 0.4, ww * 0.36, 0, 0, Math.PI, true); }
      }
      return hh;
    };
    ctx.fillStyle = bodyC;
    ctx.beginPath();
    const tw = m.tower;
    box(1, tw.ox, tw.w, tw.h, false, null);
    for (const h of m.hs) h._hh = box(h.br, h.ox, h.w, h.h, h.dome, h);
    ctx.fill();
    ctx.fillStyle = sideC;
    ctx.globalAlpha = p.a * 0.8;
    ctx.beginPath();
    for (const h of m.hs) {
      const hx = x + h.ox * u, ww = h.w * u, hh = h._hh * (broken ? 0.6 : 1);
      ctx.rect(lx > 0 ? hx - ww / 2 : hx + ww * 0.2, h._g - hh, ww * 0.3, hh);
    }
    ctx.fill();
    // 夜里的窗
    const nk = nightK();
    if (nk > 0.05 && ruin < 0.5) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,178,96)';
      const ws = Math.max(1, 2.2 * s);
      for (const h of m.hs) {
        if (!h.win) continue;
        ctx.globalAlpha = p.a * nk * (1 - ruin * 2) * (0.55 + 0.35 * Math.sin(W.t * 0.8 + h.tw));
        ctx.fillRect(x + h.ox * u - ws / 2, h._g - h._hh * 0.65, ws, ws * 1.4);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    // 火与余烬
    if (p.fire > 0.01) {
      SP || sprites();
      const g = u * (1.1 + 0.9 * p.fire);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = p.fire * (0.45 + 0.2 * Math.sin(W.t * 5 + p.seed));
      ctx.drawImage(SP.ember, x - g / 2, g0 - u * 0.12 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (let i = 0; i < m.hs.length; i += 2) { const h = m.hs[i]; flame(ctx, x + h.ox * u, h._g - h._hh, 9 * s * (0.6 + p.fire), p.fire * 0.9, p.seed + i); }
    }
  }

  function drawSalt(ctx, p) {
    const l = p.layer, s = LS(l), h = 31 * s, x = p.x * W.w, y = gY(l, p.x) + 1;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([226, 222, 212], l, 1, 0.12);
    ctx.beginPath();
    ctx.moveTo(x - 0.16 * h, y);
    ctx.quadraticCurveTo(x - 0.12 * h, y - 0.5 * h, x - 0.085 * h, y - 0.8 * h);
    ctx.quadraticCurveTo(x - 0.07 * h, y - 1.02 * h, x + 0.01 * h, y - 1.02 * h);
    ctx.quadraticCurveTo(x + 0.09 * h, y - 1.0 * h, x + 0.08 * h, y - 0.78 * h);
    ctx.quadraticCurveTo(x + 0.12 * h, y - 0.45 * h, x + 0.15 * h, y);
    ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([255, 252, 246], l, 0.6, 0.35); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath(); ctx.moveTo(x + d * 0.14 * h, y); ctx.quadraticCurveTo(x + d * 0.1 * h, y - 0.5 * h, x + d * 0.07 * h, y - 0.9 * h); ctx.stroke();
    // 盐的微光
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.a * (0.18 + 0.12 * Math.sin(W.t * 1.3)) * (0.4 + 0.6 * nightK());
    ctx.drawImage(SP.salt, x - h * 0.5, y - h * 1.0, h, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function drawPieces(ctx, p, row) {
    const l = 2, s = LS(l), x = p.x * W.w, m = p.model, u = W.w;
    const n = row === 'back' ? m.back : m.front;
    const dy = row === 'back' ? -3 * s : 6 * s;
    const k = p.grow;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(row === 'back' ? [84, 50, 42] : [96, 58, 46], l);
    ctx.beginPath();
    n.forEach((o, i) => {
      if (k < (i + (row === 'back' ? 0 : 0.5)) / 3.5) return;
      const cx = x + o * u, cy = gY(l, cx / W.w) + dy;
      ctx.moveTo(cx + 9 * s, cy); ctx.ellipse(cx, cy - 3 * s, 9 * s, 4.4 * s, (i - 1) * 0.12, 0, TAU);
    });
    ctx.fill();
    if (row === 'front' && k > 0.9) {
      ctx.fillStyle = css([188, 178, 164], l);
      ctx.beginPath();
      m.birds.forEach((o, i) => { const cx = x + o * u, cy = gY(l, cx / W.w) + (i ? 6 : -3) * s; ctx.moveTo(cx + 3.6 * s, cy - 2 * s); ctx.ellipse(cx, cy - 2 * s, 3.6 * s, 2.2 * s, 0, 0, TAU); });
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawSpring(ctx, p, well) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, m = p.model;
    ctx.globalAlpha = p.a;
    if (well) {
      // 井：一圈石栏
      ctx.fillStyle = css([130, 118, 100], l);
      ctx.beginPath(); ctx.ellipse(x, y - 4 * s, 13 * s, 4.6 * s, 0, 0, TAU); ctx.fill();
      ctx.fillRect(x - 13 * s, y - 4 * s, 26 * s, 5 * s);
      ctx.beginPath(); ctx.ellipse(x, y + 1 * s, 13 * s, 4.6 * s, 0, 0, Math.PI); ctx.fill();
      ctx.fillStyle = css([24, 30, 40], l);
      ctx.beginPath(); ctx.ellipse(x, y - 4.4 * s, 9.5 * s, 2.8 * s, 0, 0, TAU); ctx.fill();
      // 槽
      ctx.fillStyle = css([110, 96, 80], l);
      ctx.fillRect(x - 33 * s, y - 2.5 * s, 16 * s, 3 * s);
    } else {
      // 泉：一汪水与几茎芦苇
      ctx.fillStyle = css([40, 62, 84], l, 0.95);
      ctx.beginPath(); ctx.ellipse(x, y, 16 * s, 3.6 * s, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([86, 110, 62], l); ctx.lineWidth = Math.max(0.6, 0.9 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (const r of m.reeds) { const rx = x + r[0] * 9 * s, sw = Math.sin(W.t * 1.2 + r[0] * 3) * 1.2 * s; ctx.moveTo(rx, y); ctx.quadraticCurveTo(rx + r[2] * 6 * s, y - r[1] * 7 * s, rx + r[2] * 10 * s + sw, y - r[1] * 13 * s); }
      ctx.stroke();
    }
    // 水光（被看见时更亮）
    const glint = 0.25 + 0.75 * p.lit;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(236,244,255)';
    for (let i = 0; i < 4; i++) {
      const gx = x + Math.sin(W.t * 0.9 + i * 1.7 + p.seed) * (well ? 6 : 10) * s, gy = y - (well ? 4.4 : 0) * s + (i - 1.5) * 0.6 * s;
      ctx.globalAlpha = p.a * glint * (0.35 + 0.35 * Math.sin(W.t * 3 + i * 2.1)) * (0.4 + 0.6 * W.daylight + nightK() * 0.3);
      ctx.fillRect(gx - 1.6 * s, gy - 0.4, 3.2 * s, Math.max(0.8, 0.9 * s));
    }
    if (p.lit > 0.02) {
      SP || sprites();
      const g = 70 * s * (0.6 + p.lit);
      ctx.globalAlpha = p.a * p.lit * 0.55;
      ctx.drawImage(SP.gold, x - g / 2, y - 4 * s - g / 2, g, g);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  function drawShrub(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, u = 16 * s;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([62, 72, 46], l);
    ctx.beginPath();
    for (const b of p.model.b) { const cx = x + b[0] * u, cy = y + b[1] * u; ctx.moveTo(cx + b[2] * u, cy); ctx.ellipse(cx, cy, b[2] * u, b[2] * u * 0.75, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawTamarisk(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, g = p.grow;
    if (g <= 0.01) return;
    const H = 72 * s * (0.25 + 0.75 * g), m = p.model;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([66, 50, 38], l); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 3.2 * s * (0.4 + 0.6 * g));
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 0.05 * H, y - 0.45 * H, x + 0.02 * H, y - 0.8 * H); ctx.stroke();
    ctx.strokeStyle = css([96, 120, 92], l, 0.85); ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    for (const q of m.strands) {
      const sx = x + q[0] * H, sy = y + q[1] * H, len = q[2] * H * g, sw = Math.sin(W.t * 0.9 + q[3]) * 0.03 * H + W.wind * 0.04 * H;
      ctx.moveTo(x + 0.02 * H, y - 0.78 * H); ctx.quadraticCurveTo(sx, sy - 0.08 * H, sx + sw * 0.5, sy);
      ctx.quadraticCurveTo(sx + sw, sy + len * 0.5, sx + sw * 1.4, sy + len);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawCave(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 4 * s, hw = 34 * s, h = 36 * s, m = p.model;
    ctx.globalAlpha = p.a;
    // 田间四围的树木
    ctx.fillStyle = css([42, 60, 40], l);
    ctx.beginPath();
    for (const t of m.trees) { const tx = x + t[0] * hw, ty = gY(l, tx / W.w) + 2 * s, th = t[1] * h * 1.4; ctx.moveTo(tx, ty - th); ctx.quadraticCurveTo(tx + 5 * s, ty - th * 0.5, tx + 3 * s, ty); ctx.lineTo(tx - 3 * s, ty); ctx.quadraticCurveTo(tx - 5 * s, ty - th * 0.5, tx, ty - th); }
    ctx.fill();
    // 磐石
    ctx.fillStyle = css([112, 106, 98], l);
    ctx.beginPath();
    m.pts.forEach((q, i) => { const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    for (const r of m.rocks) { const rx = x + r[0] * hw, rr = r[1] * h; ctx.moveTo(rx + rr * 1.3, y); ctx.ellipse(rx, y, rr * 1.3, rr, 0, Math.PI, 0); }
    ctx.fill();
    ctx.strokeStyle = css([70, 64, 58], l, 0.7); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (const c of m.cracks) { const cx = x + c[0] * hw, cy = y + c[1] * h; ctx.moveTo(cx, cy); ctx.lineTo(cx + c[2] * hw, cy + c[3] * h); }
    ctx.stroke();
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = css([214, 196, 168], l, 0.45 * (0.3 + 0.7 * W.daylight), 0.2); ctx.lineWidth = Math.max(0.6, 1.2 * s);
    ctx.beginPath();
    m.pts.forEach((q, i) => { if (q[0] * d < -0.2) return; const X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i && m.pts[i - 1][0] * d >= -0.2) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); });
    ctx.stroke();
    // 洞口
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
    // 封洞的石
    if (p.seal > 0.01) {
      const sx = mx + mw * 1.9 * (1 - p.seal);
      ctx.fillStyle = css([134, 120, 104], l);
      ctx.beginPath(); ctx.ellipse(sx, y - mh * 0.62, mw * 1.08, mh * 0.66, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([220, 204, 176], l, 0.35, 0.2);
      ctx.beginPath(); ctx.ellipse(sx, y - mh * 0.62, mw * 1.08, mh * 0.66, 0, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawThicket(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1, u = 16 * s;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([60, 56, 40], l); ctx.lineWidth = Math.max(0.6, 1.1 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const t of p.model.tw) { ctx.moveTo(x + t[0] * u, y); ctx.quadraticCurveTo(x + (t[0] + t[1] * 0.5) * u, y + t[2] * u * 0.6, x + (t[0] + t[1]) * u, y + t[2] * u); }
    ctx.stroke();
    ctx.fillStyle = css([54, 64, 40], l, 0.9);
    ctx.beginPath();
    for (let i = 0; i < p.model.tw.length; i += 3) { const t = p.model.tw[i], cx = x + (t[0] + t[1]) * u, cy = y + t[2] * u; ctx.moveTo(cx + 3.2 * s, cy); ctx.ellipse(cx, cy, 3.2 * s, 2.4 * s, 0, 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 两角扣在稠密小树中的公羊（22:13）
  function drawRam(ctx, p) {
    const l = p.layer, s = LS(l) * 1.05 * p.size, x = p.x * W.w, y = gY(l, p.x) + 1, f = -1;
    ctx.globalAlpha = p.a;
    const wool = css([222, 214, 196], l), dark = css([70, 60, 52], l);
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.8, 1.5 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const lx of [-5, -2, 3, 5.5]) { ctx.moveTo(x + lx * s * f, y - 5 * s); ctx.lineTo(x + lx * s * f + Math.sin(W.t * 2 + lx) * 0.3 * s, y); }
    ctx.stroke();
    ctx.fillStyle = wool;
    ctx.beginPath(); ctx.ellipse(x, y - 8 * s, 8 * s, 4.6 * s, 0, 0, TAU); ctx.fill();
    const hx = x + 8.5 * s * f, hy = y - 11.5 * s + Math.sin(W.t * 1.7) * 0.5 * s;
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(hx, hy, 2.6 * s, 3.4 * s, f * 0.5, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([150, 132, 100], l); ctx.lineWidth = Math.max(0.8, 1.3 * s);
    ctx.beginPath(); ctx.arc(hx - 1.2 * s * f, hy - 1.8 * s, 2.4 * s, Math.PI * 0.2, Math.PI * 1.6); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 抬尸的架（以白布覆盖）
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

  // 摩利亚山顶的一圈光（22:4 远远地看见那地方）
  function drawHalo(ctx, p) {
    if (p.lit < 0.01) return;
    SP || sprites();
    const l = p.layer, s = LS(l), x = p.x * W.w, y = gY(l, p.x) - 8 * s, g = 170 * s;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = p.lit * p.a * (0.5 + 0.1 * Math.sin(W.t * 1.4));
    ctx.drawImage(SP.gold, x - g / 2, y - g / 2, g, g);
    ctx.globalAlpha = p.lit * p.a * 0.3;
    ctx.drawImage(SP.beam, x - 16 * s, -20, 32 * s, y + 20);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 冒烟的炉并烧着的火把（15:17）
  function drawPassing(ctx) {
    const k = W.lv.abPass, pc = getP('pieces');
    if (!pc || k <= 0.001 || k >= 0.999) return;
    const env = smoothstep(0, 0.08, k) * (1 - smoothstep(0.88, 1, k));
    if (env < 0.01) return;
    const s = LS(2) * 1.5, xf = lerp(pc.x - 0.085, pc.x + 0.085, k), x = xf * W.w;
    const y = gY(2, xf) + 1.5 * LS(2) - 11 * s + Math.sin(W.t * 1.6) * 1.5 * s;
    SP || sprites();
    // 照亮肉块之间的地
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = env * 0.7;
    const g = 190 * s;
    ctx.drawImage(SP.warm, x + 10 * s - g / 2, y - g / 2, g, g);
    ctx.globalAlpha = env * 0.35;
    ctx.drawImage(SP.gold, x + 10 * s - g, y - g * 0.9, g * 2, g * 2);
    ctx.globalCompositeOperation = 'source-over';
    // 炉：陶的，口里有火，冒着浓烟
    smoke(ctx, x, y - 10 * s, env, 190 * s + W.h * 0.12, 7 * s, 3, true, 0.11);
    ctx.globalAlpha = env;
    ctx.fillStyle = 'rgb(62,42,32)';
    ctx.beginPath();
    ctx.moveTo(x - 7 * s, y); ctx.quadraticCurveTo(x - 9.5 * s, y - 7 * s, x - 4.5 * s, y - 10.5 * s); ctx.lineTo(x + 4.5 * s, y - 10.5 * s);
    ctx.quadraticCurveTo(x + 9.5 * s, y - 7 * s, x + 7 * s, y); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,128,52)';
    ctx.globalAlpha = env * (0.75 + 0.25 * Math.sin(W.t * 11));
    ctx.beginPath(); ctx.ellipse(x, y - 10.5 * s, 4.4 * s, 1.5 * s, 0, 0, TAU); ctx.fill();
    ctx.fillRect(x - 2.2 * s, y - 5.5 * s, 4.4 * s, 2.6 * s);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    flame(ctx, x, y - 10.5 * s, 7 * s, env * 0.8, 11);
    // 火把：在前
    const tx = x + 24 * s, ty = y - 5 * s + Math.sin(W.t * 2.1 + 1) * 1.5 * s;
    ctx.strokeStyle = U.rgba(84, 58, 38, env); ctx.lineWidth = Math.max(1, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tx - 2 * s, ty + 10 * s); ctx.lineTo(tx, ty - 3 * s); ctx.stroke();
    flame(ctx, tx, ty - 2 * s, 17 * s, env, 7);
  }

  // 以实玛利十二族的营火（25:16），在远山上
  function drawTwelve(ctx) {
    const k = W.lv.abTwelve;
    if (k < 0.01) return;
    SP || sprites();
    const nk = 0.25 + 0.75 * nightK(), s = LS(0);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 12; i++) {
      const xf = 0.6 + (i / 11) * 0.37 + (U.hash1(i * 13 + 5) - 0.5) * 0.02, x = xf * W.w, y = gY(0, xf) - 1;
      const f = 0.7 + 0.3 * Math.sin(W.t * (3 + U.hash1(i + 40) * 3) + i);
      ctx.globalAlpha = k * nk * f * 0.9;
      const g = 26 * s + 10;
      ctx.drawImage(SP.warm, x - g / 2, y - g / 2, g, g);
      ctx.fillStyle = 'rgb(255,214,150)';
      ctx.fillRect(x - 1, y - 1.5, 2, 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 数不过来的众星
  function drawStars(ctx) {
    const A = W.lv.stars * clamp(W.night * 1.3 + W.dusk * 0.28, 0, 1) * (1 - W.lv.abDark * 0.9);
    if (A < 0.01 || !starA) return;
    SP || sprites();
    const band = W.lv.abStars;
    ctx.globalCompositeOperation = 'lighter';
    if (band > 0.01) {
      ctx.globalAlpha = A * band * 0.24;
      ctx.drawImage(SP.band, 0, 0, W.w, W.horizonY);
    }
    BN.fill(0);
    const u = Math.max(0.7, W.unit), hz = W.horizonY, T = W.t;
    const stepQ = W.quality < 0.75 ? 2 : 1;
    for (let i = 0; i < STARS.length; i += stepQ) {
      const a0 = starA[i];
      if (a0 < 0.02) continue;
      const st = STARS[i];
      const a = a0 * st.base * (0.72 + 0.28 * SIN[(T * st.sp + st.tw) & 255]);
      if (a < 0.03) continue;
      const bi = a >= 0.8 ? 4 : (a * BUCK) | 0;
      BUCKETS[bi][BN[bi]++] = i;
    }
    ctx.fillStyle = 'rgb(255,248,232)';
    for (let b = 0; b < BUCK; b++) {
      const n = BN[b];
      if (!n) continue;
      const list = BUCKETS[b];
      ctx.globalAlpha = A * (b + 0.7) / BUCK;
      ctx.beginPath();
      for (let j = 0; j < n; j++) {
        const st = STARS[list[j]], s = st.sz * u;
        ctx.rect(st.x * W.w - s / 2, st.y * W.h - s / 2, s, s);
      }
      ctx.fill();
    }
    // 亚伯拉罕之星（25:8 之后）
    if (S.abStar) {
      const x = S.abStar[0] * W.w, y = S.abStar[1] * hz;
      const a = A * (0.85 + 0.15 * Math.sin(W.t * 1.3));
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(255,236,190)';
      ctx.beginPath(); ctx.arc(x, y, 1.7 * u, 0, TAU); ctx.fill();
      ctx.globalAlpha = a * 0.4;
      ctx.fillRect(x - 7 * u, y - 0.5, 14 * u, 1); ctx.fillRect(x - 0.5, y - 7 * u, 1, 14 * u);
      ctx.globalAlpha = a * 0.5;
      ctx.drawImage(SP.gold, x - 9 * u, y - 9 * u, 18 * u, 18 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 硫磺与火
  function drawBrimstone(ctx) {
    const k = W.lv.abFire;
    if (k < 0.01) return;
    SP || sprites();
    const x0 = (X.sodom - 0.07) * W.w, x1 = (X.gomorrah + 0.05) * W.w, u = Math.max(0.55, W.unit);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const N = W.quality < 0.75 ? 30 : 46;
    for (let i = 0; i < N; i++) {
      const h1 = U.hash1(i * 17 + 3), h2 = U.hash1(i * 29 + 11), h3 = U.hash1(i * 7 + 101);
      const per = 1.0 + h2 * 1.3, ph = U.fract(W.t / per + h1);
      const tx = lerp(x0, x1, h3), ty = gY(1, tx / W.w);
      const sy = lerp(-0.08 * W.h, ty, Math.pow(ph, 1.25)), sx = tx + (1 - ph) * 0.18 * W.h;
      const len = (40 + 30 * h2) * u;
      ctx.globalAlpha = k * (0.45 + 0.4 * h2);
      ctx.strokeStyle = 'rgb(255,120,44)';
      ctx.lineWidth = (1.2 + 1.4 * h1) * u;
      ctx.beginPath(); ctx.moveTo(sx + len * 0.28, sy - len); ctx.lineTo(sx, sy); ctx.stroke();
      ctx.fillStyle = 'rgb(255,236,180)';
      ctx.fillRect(sx - 1.5 * u, sy - 1.5 * u, 3 * u, 3 * u);
      if (ph > 0.9) {
        const g = (60 + 40 * h1) * u * (1 - (ph - 0.9) * 5);
        ctx.globalAlpha = k * 0.6;
        ctx.drawImage(SP.ember, tx - g / 2, ty - g / 2, g, g);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 转瞬的光
  function drawTransients(ctx, pass) {
    if (!FXL.length) return;
    SP || sprites();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam' && pass === 'air') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = gY(e.l, e.xf) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.42 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        ctx.globalAlpha = env * e.k * 0.5;
        const g = e.w * 1.8;
        ctx.drawImage(SP.gold, x - g / 2, y - g * 0.55, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'sweep' && pass === 'air') {
        const env = 1 - smoothstep(0.7, 1, q), hx = lerp(e.x0, e.x1, U.easeOut(q));
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgb(255,232,176)';
        ctx.lineWidth = Math.max(1, 2 * W.unit);
        ctx.globalAlpha = env * 0.5;
        ctx.beginPath();
        for (let i = 0; i <= 16; i++) { const xf = lerp(e.x0, hx, i / 16); const yy = gY(e.l, xf) - 2; if (i) ctx.lineTo(xf * W.w, yy); else ctx.moveTo(xf * W.w, yy); }
        ctx.stroke();
        const g = 90 * LS(e.l) + 20;
        ctx.globalAlpha = env * 0.8;
        ctx.drawImage(SP.gold, hx * W.w - g / 2, gY(e.l, hx) - g / 2, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'plague' && pass === 'far') {
        const p = Math.pow(Math.max(0, Math.sin(e.t * 5.3)), 4) * (1 - q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = p * 0.8;
        const g = W.h * 0.7;
        ctx.drawImage(SP.ember, W.w * 1.02 - g / 2, W.horizonY - g / 2, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'battle' && pass === 'far') {
        const p = Math.pow(Math.max(0, Math.sin(e.t * 4.1 + 1)), 5) * (1 - q);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = p * 0.5;
        const g = W.h * 0.35;
        ctx.drawImage(SP.ember, W.w * 0.62 - g / 2, gY(0, 0.62) - g / 2, g, g);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'raptor' && pass === 'air') {
        const pc = getP('pieces');
        if (!pc) continue;
        const cx = pc.x * W.w, cy = gY(2, pc.x) - 60 * LS(2), u = Math.max(0.6, W.unit);
        ctx.strokeStyle = U.rgba(26, 24, 30, 0.85 * (1 - smoothstep(0.85, 1, q)));
        ctx.lineWidth = 1.6 * u; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          const a = e.t * 1.6 + i * 2.1, flee = smoothstep(0.55, 1, q);
          const bx = cx + Math.cos(a) * 60 * u * (1 + flee * 3) + flee * 200 * u * (i - 1), by = cy + Math.sin(a) * 18 * u - flee * 260 * u + Math.max(0, 1 - q * 3) * -40 * u;
          const fl = Math.sin(e.t * 9 + i) * 3 * u;
          ctx.beginPath(); ctx.moveTo(bx - 9 * u, by - fl); ctx.quadraticCurveTo(bx - 4 * u, by - 3 * u, bx, by); ctx.quadraticCurveTo(bx + 4 * u, by - 3 * u, bx + 9 * u, by - fl); ctx.stroke();
        }
      } else if (e.type === 'sand' && pass === 'air') {
        // 海边的沙：海面上数不清的微光
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.6, 1, q));
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,240,206)';
        for (let i = 0; i < e.pts.length; i++) {
          const pt = e.pts[i], tw = Math.max(0, Math.sin(e.t * pt[2] + pt[3]));
          ctx.globalAlpha = env * tw * 0.8;
          const s = (0.8 + pt[4] * 1.4) * Math.max(0.6, W.unit);
          ctx.fillRect(pt[0] * W.w - s / 2, pt[1] * W.h - s / 2, s, s);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'oak': drawOak(ctx, p); break;
      case 'tent': drawTent(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'city': drawCity(ctx, p); break;
      case 'salt': drawSalt(ctx, p); break;
      case 'spring': drawSpring(ctx, p, false); break;
      case 'well': drawSpring(ctx, p, true); break;
      case 'shrub': drawShrub(ctx, p); break;
      case 'tamarisk': drawTamarisk(ctx, p); break;
      case 'cave': drawCave(ctx, p); break;
      case 'thicket': drawThicket(ctx, p); break;
      case 'ram': drawRam(ctx, p); break;
      case 'halo': drawHalo(ctx, p); break;
      case 'bier': drawBier(ctx, p); break;
      case 'pieces': drawPieces(ctx, p, 'back'); drawPieces(ctx, p, 'front'); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const ORDER = { cave: 0, oak: 1, tamarisk: 2, city: 1, salt: 3, shrub: 2, tent: 3, halo: 0, thicket: 3, altar: 4, spring: 4, well: 4, pieces: 5, ram: 5, bier: 9 };
  let sorted = [], sortedN = -1;
  function sortProps() {
    if (sortedN === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }

  const SCENE = {
    init() { sprites(); if (!STARS.length) buildStars(); },
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
        if (p.dying && p.a < 0.01) P.delete(id);
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 众星：灵经过之处开放
      if (starA) {
        const blooming = S.bloom && W.lv.abStars < 1;
        const sp = W.spirit, R = 95 * Math.max(0.6, W.unit), R2 = R * R;
        for (let i = 0; i < STARS.length; i++) {
          if (blooming && !starHit[i]) {
            const dx = STARS[i].x * W.w - sp.x, dy = STARS[i].y * W.h - sp.y;
            if (dx * dx + dy * dy < R2) starHit[i] = 1;
          }
          const tg = starTarget(i);
          if (starA[i] !== tg) starA[i] = approachLin(starA[i], tg, dt * 1.4);
        }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') {
        drawStars(ctx);
        // 硫磺与火时天边的红
        const k = W.lv.abFire;
        if (k > 0.01) {
          const cx = X.sodom * W.w, cy = W.horizonY;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, W.w * 0.75);
          g.addColorStop(0, U.rgba(255, 96, 40, 0.5 * k)); g.addColorStop(0.5, U.rgba(200, 60, 30, 0.22 * k)); g.addColorStop(1, 'rgba(120,30,20,0)');
          ctx.fillStyle = g; ctx.fillRect(0, 0, W.w, W.horizonY + 10);
        }
        return;
      }
      if (pass === 'far') { drawTwelve(ctx); drawTransients(ctx, 'far'); }
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        const list = sortProps();
        for (const p of list) {
          if (p.layer !== l || p.a < 0.005 || p.kind === 'bier' || p.kind === 'ram') continue;
          drawKind(ctx, p);
        }
        if (pass === 'mid') {
          // 平原的烟（19:28）
          const sk = W.lv.abSmoke;
          if (sk > 0.01) {
            const s = LS(1);
            smoke(ctx, X.sodom * W.w, gY(1, X.sodom) - 10 * s, sk, W.h * 0.46, 44 * s, 11, true, 0.04);
            smoke(ctx, (X.sodom + 0.02) * W.w, gY(1, X.sodom + 0.02) - 8 * s, sk * 0.8, W.h * 0.38, 34 * s, 17, true, 0.047);
            smoke(ctx, X.gomorrah * W.w, gY(1, X.gomorrah) - 8 * s, sk * 0.85, W.h * 0.4, 38 * s, 23, true, 0.043);
          }
        }
        if (pass === 'near') {
          // 饥荒：尘土的黄雾
          const dk = W.lv.abDrought;
          if (dk > 0.01) {
            const g = ctx.createLinearGradient(0, 0, 0, W.h);
            g.addColorStop(0, U.rgba(190, 150, 96, 0)); g.addColorStop(0.5, U.rgba(196, 150, 92, 0.16 * dk)); g.addColorStop(1, U.rgba(150, 110, 64, 0.22 * dk));
            ctx.fillStyle = g; ctx.fillRect(0, 0, W.w, W.h);
          }
        }
      }
      if (pass === 'air') {
        // 惊人的大黑暗（15:12）
        const dk = W.lv.abDark;
        if (dk > 0.01) { ctx.fillStyle = U.rgba(3, 3, 8, 0.84 * dk); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
        drawBrimstone(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      const l = LAYER_OF_PASS[pass];
      if (l != null) for (const p of sortProps()) if (p.layer === l && p.a >= 0.005 && (p.kind === 'bier' || p.kind === 'ram')) drawKind(ctx, p);
      if (pass === 'air') { drawPassing(ctx); drawTransients(ctx, 'air'); }
    },
    reset() { P.clear(); FXL.length = 0; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      FXL.length = 0;
      if (starA) for (let i = 0; i < STARS.length; i++) starA[i] = starTarget(i);
    },
    // 调试：本卷布景的状态（测试"看完"与"恢复"是否一致）
    dump() {
      const out = {};
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, +p.x.toFixed(3), p.layer, +p.ta.toFixed(2), +p.tfire.toFixed(2), +p.tlit.toFixed(2), +p.truin.toFixed(2), +p.tseal.toFixed(2), p.label];
      return { props: out, abStar: S.abStar, moriah: S.moriah };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || p.kind === 'halo') continue;
        const s = LS(p.layer) * (p.size || 1), px = p.x * W.w, gy = gY(p.layer, p.x);
        const hgt = { oak: 70, tent: 16, altar: 8, city: 18, salt: 16, cave: 16, tamarisk: 40, spring: 2, well: 4, thicket: 6, ram: 8, shrub: 6, pieces: 3, bier: 16 }[p.kind] || 10;
        const py = gy - hgt * s;
        const d = Math.hypot(px - x, py - y);
        if (d < r && (!best || d < best.d)) best = { label: p.label, x: px, y: py - 10 * s, d };
      }
      return best;
    },
  };
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // 本卷开始时（幕后）重置布景
  function resetScene() {
    P.clear(); FXL.length = 0; sorted = []; sortedN = -1;
    S = fresh();
    if (starHit) starHit.fill(0);
    if (starA) starA.fill(0);
  }

  // 中景的最高处：摩利亚山
  function summitX() {
    let best = 0.8, by = Infinity;
    for (let f = 0.74; f <= 0.9; f += 0.004) { const y = W.ridgeBaseY(1, f * W.w); if (y < by) { by = y; best = f; } }
    return best;
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：哈兰的清晨
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 迦南的丘陵：半干的草场
    GS.W.set('bare', 0.26, true); GS.W.set('bloom', 0.45, true);
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.5, land: 1, grass: 1, herbs: 1, trees: 0.5, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1,
      abStars: 0, abDrought: 0, abDark: 0, abPass: 0, abFire: 0, abSmoke: 0, abTwelve: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    // 迦南是山地：树木多在西边（右）的山上，平原与旷野（左）开阔
    W.setOrigin('trees', W.w * 0.98, W.ridgeBaseY(2, W.w * 0.98));
    W.set('trees', 0.5, true);
    W.goTo(0.27, 0, true);
    const lx = W.w * 0.78, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 110, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 34, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 4, lx, ly, true);
    W.setPop('beast', 2, lx, ly, true);
    W.setPop('creeper', 26, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    S.moriah = summitX();
    // 地上本有的：橡树、平原诸城、旷野的水泉、小树、麦比拉田间的磐石
    prop('oakMoreh', 'oak', { x: X.moreh, size: 0.9, label: '摩利橡树' });
    prop('oakA', 'oak', { x: X.oakA, size: 1.02, label: '幔利的橡树' });
    prop('oakB', 'oak', { x: X.oakB, size: 0.92, label: '幔利的橡树' });
    prop('sodom', 'city', { x: X.sodom, layer: 1, size: 1, label: '所多玛' });
    prop('gomorrah', 'city', { x: X.gomorrah, layer: 1, size: 0.78, label: '蛾摩拉' });
    prop('zoar', 'city', { x: X.zoar, layer: 1, size: 0.3, label: '琐珥' });
    prop('spring', 'spring', { x: X.spring, label: '水泉' });
    prop('shrub', 'shrub', { x: X.shrub, label: '小树' });
    prop('cave', 'cave', { x: X.cave, label: '磐石' });
    // 哈兰的帐棚
    prop('tH1', 'tent', { x: 0.905, label: '帐棚' });
    prop('tH2', 'tent', { x: 0.962, size: 0.8, label: '帐棚' });
    const c = C();
    c.clear({ fade: false });
    add('abram', { label: '亚伯兰', sex: 'm', age: 'adult', x: 0.88, facing: -1, robe: ROBE.abram, glow: 0.4, from: 'none' });
    add('sarai', { label: '撒莱', sex: 'f', age: 'adult', x: 0.93, facing: -1, robe: ROBE.sarai, glow: 0.2, from: 'none' });
    add('lot', { label: '罗得', sex: 'm', age: 'adult', x: 0.855, facing: -1, robe: ROBE.lot, glow: 0.15, from: 'none' });
    c.crowd('hh', { n: 4, x0: 0.92, x1: 0.99, layer: 2, label: '仆婢', from: 'none', mill: false });
    animal('cam1', 'camel', 0.975, { facing: -1 });
    animal('cam2', 'camel', 0.94, { facing: -1 });
    herd('flock', { kind: 'sheep', n: 5, x0: 0.955, x1: 0.995, layer: 2, label: '羊群', from: 'none' });
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 12:1 呼召 ────────────────────────────────────────────
    {
      kind: 'call', utter: '你要离开本地、本族、父家', cmd: 'cd 迦南  # 往我所要指示你的地去', ref: '12:1',
      verse: [
        { text: '耶和华对亚伯兰说：「你要离开本地、本族、父家，<br>往我所要指示你的地去。', ref: '创世记 12:1', hold: 6.5 },
        { text: '我必叫你成为大国。我必赐福给你，叫你的名为大；<br>你也要叫别人得福。', ref: '创世记 12:2', hold: 6.5 },
        { text: '地上的万族都要因你得福。」', ref: '创世记 12:3', hold: 4.5 },
        { text: '亚伯兰就照着耶和华的吩咐去了；罗得也和他同去。<br>亚伯兰出哈兰的时候年七十五岁。', ref: '创世记 12:4', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { beamOn(b, 'abram', { dur: 6 }); sfx(b, 'wind'); }],
          [0.8, () => { pose('abram', 'bow'); }],
          [4.5, () => { pose('abram', 'stand'); unprop('tH1'); unprop('tH2'); }],
          [6, b => {
            family(X.moreh + 0.03, { speed: 0.016 });
            W.goTo(0.4, 20, b.instant);
            sfx(b, 'camel');
          }],
          [27, b => say(b, [{ text: '亚伯兰经过那地，到了示剑地方、摩利橡树那里。<br>那时迦南人住在那地。', ref: '创世记 12:6', hold: 6.5 }])],
          [30, () => { face('abram', -1); }],
        ]);
      },
    },

    // ── 12:7 应许这地；筑坛 ──────────────────────────────────
    {
      kind: 'promise', utter: '我要把这地赐给你的后裔', cmd: 'chown -R 后裔 ./迦南', ref: '12:7',
      verse: [
        { text: '耶和华向亚伯兰显现，说：「我要把这地赐给你的后裔。」<br>亚伯兰就在那里为向他显现的耶和华筑了一座坛。', ref: '创世记 12:7', hold: 7.5 },
        { text: '从那里他又迁到伯特利东边的山，支搭帐棚；<br>西边是伯特利，东边是艾。<br>他在那里又为耶和华筑了一座坛，求告耶和华的名。', ref: '创世记 12:8', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { beamOn(b, 'abram'); }],
          [1.2, () => pose('abram', 'kneel')],
          [2.5, b => { walk('abram', X.altarS - 0.018, { speed: 0.02 }); prop('altarS', 'altar', { x: X.altarS, grow: 1, label: '坛' }); sfx(b, 'build'); }],
          [6.5, b => { prop('altarS', null, { fire: 1 }); pose('abram', 'pray'); sfx(b, 'fire'); }],
          [11, b => { pose('abram', 'stand'); family(X.tentB - 0.035, { speed: 0.02 }); W.goTo(0.5, 12, b.instant); }],
          [15, b => { prop('tentB', 'tent', { x: X.tentB, label: '帐棚' }); prop('tentL', 'tent', { x: X.tentL, size: 0.85, label: '罗得的帐棚' }); prop('altarS', null, { fire: 0 }); sfx(b, 'build'); }],
          [17, () => { walk('abram', X.altarB - 0.018, { speed: 0.02 }); prop('altarB', 'altar', { x: X.altarB, grow: 1, label: '坛' }); }],
          [21, b => { prop('altarB', null, { fire: 1 }); pose('abram', 'pray'); sfx(b, 'fire'); }],
          // 饥荒：下埃及
          [26, b => { W.set('abDrought', 1, b.instant); prop('altarB', null, { fire: 0 }); say(b, [{ text: '那地遭遇饥荒。因饥荒甚大，<br>亚伯兰就下埃及去，要在那里暂居。', ref: '创世记 12:10', hold: 6.5 }]); }],
          [29, () => { unprop('tentB'); unprop('tentL'); pose('abram', 'stand'); mill('flock', false); family(1.08, { speed: 0.024, dir: 1 }); walk('lot', 1.1, { speed: 0.024 }); }],
          [44, () => { C().removeCrowd('flock'); }],
        ]);
      },
    },

    // ── 12:17 神降大灾与法老；回到伯特利；罗得选择平原 ─────────
    {
      kind: 'judge', utter: '降大灾与法老和他的全家', cmd: 'raise 大灾 --to 法老  # 为撒莱的缘故', ref: '12:17',
      verse: [
        { text: '耶和华因亚伯兰妻子撒莱的缘故，<br>降大灾与法老和他的全家。', ref: '创世记 12:17', hold: 6.5 },
        { text: '亚伯兰的金、银、牲畜极多。', ref: '创世记 13:2', hold: 4.6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { flash(b, { type: 'plague', dur: 7 }); sfx(b, 'thunder'); if (!b.instant) W.shake = 0.6; }],
          [3.2, b => { sfx(b, 'thunder'); }],
          [6, b => {
            W.set('abDrought', 0, b.instant);
            W.goTo(0.64, 24, b.instant);
            // 从埃及上来：多了使女夏甲、骆驼、驴与牛羊
            if (!has('hagar')) add('hagar', { label: '夏甲', sex: 'f', age: 'adult', x: 1.1, facing: -1, robe: ROBE.hagar, glow: 0.15, from: 'none' });
            animal('cam3', 'camel', 1.14, { facing: -1 });
            animal('don1', 'donkey', 1.12, { facing: -1 });
            walk('lot', X.tentL + 0.02, { speed: 0.03 });
            C().removeCrowd('flock');
            herd('flock2', { kind: 'sheep', n: 7, x0: 1.12, x1: 1.2, layer: 2, label: '羊群' });
            herd('herdC', { kind: 'cow', n: 3, x0: 1.16, x1: 1.24, layer: 2, label: '牛群' });
            family(X.tentB - 0.035, { speed: 0.03, lot: false });
            sfx(b, 'camel');
          }],
          [19, b => { prop('tentB', 'tent', { x: X.tentB, label: '帐棚' }); prop('tentL', 'tent', { x: X.tentL, size: 0.85, label: '罗得的帐棚' }); prop('altarB', null, { fire: 1 }); walk('abram', X.altarB - 0.018, { speed: 0.02, pose: 'pray' }); sfx(b, 'fire'); }],
          [24, b => {
            prop('altarB', null, { fire: 0 });
            walk('abram', X.tentB + 0.005, { speed: 0.02 });
            face('lot', -1);
            say(b, [{ text: '亚伯兰就对罗得说：……「遍地不都在你眼前吗？请你离开我：<br>你向左，我就向右；你向右，我就向左。」', ref: '创世记 13:8–9', hold: 7.5 }]);
          }],
          [28, () => { face('abram', 1); pose('abram', 'point'); }],
          [33, b => {
            say(b, [{ text: '于是罗得选择约旦河的全平原，往东迁移；<br>他们就彼此分离了。', ref: '创世记 13:11', hold: 6.5 }]);
            unprop('tentL');
            pose('abram', 'stand');
            walk('lot', 0.41, { speed: 0.022 });
            if (!hasCrowd('lh')) C().crowd('lh', { mill: false, n: 2, x0: X.tentL + 0.03, x1: X.tentL + 0.06, layer: 2, label: '罗得的牧人', from: W.replaying ? 'none' : 'fade' });
            C().crowdWalk('lh', 0.43, 0.46, { speed: 0.022 });
            herd('lotflock', { kind: 'goat', n: 3, x0: X.tentL + 0.02, x1: X.tentL + 0.08, layer: 2, label: '罗得的羊群' });
            mill('lotflock', false);
            C().crowdWalk('lotflock', 0.42, 0.47, { speed: 0.022 });
          }],
          [45, () => { rm('lot'); C().removeCrowd('lh'); C().removeCrowd('lotflock'); }],
          [48, b => {
            add('lotM', { label: '罗得', sex: 'm', age: 'adult', layer: 1, x: X.lotTent + 0.025, facing: 1, robe: ROBE.lot, glow: 0.15, from: 'fade' });
            prop('tentLm', 'tent', { x: X.lotTent, layer: 1, size: 0.9, label: '罗得的帐棚' });
            say(b, [{ text: '罗得住在平原的城邑，渐渐挪移帐棚，直到所多玛。<br>所多玛人在耶和华面前罪大恶极。', ref: '创世记 13:12–13', hold: 6.5 }]);
          }],
        ]);
      },
    },

    // ── 13:14 举目观看；如尘沙；幔利 ──────────────────────────
    {
      kind: 'promise', utter: '你举目向东西南北观看', cmd: 'ls 东 西 南 北 | grant 后裔 --forever', ref: '13:14',
      verse: [
        { text: '耶和华对亚伯兰说：「从你所在的地方，你举目向东西南北观看；<br>凡你所看见的一切地，我都要赐给你和你的后裔，直到永远。', ref: '创世记 13:14–15', hold: 7.5 },
        { text: '我也要使你的后裔如同地上的尘沙那样多，<br>人若能数算地上的尘沙才能数算你的后裔。」', ref: '创世记 13:16', hold: 7 },
        { text: '亚伯兰就搬了帐棚，来到希伯仑幔利的橡树那里居住，<br>在那里为耶和华筑了一座坛。', ref: '创世记 13:18', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => { beamOn(b, 'abram'); pose('abram', 'raise'); W.goTo(0.71, 10, b.instant); }],
          [1.2, b => {
            const f = fig('abram'), ax = f ? f.nx : X.tentB;
            flash(b, { type: 'sweep', l: 2, x0: ax, x1: 0.36, dur: 3.2 });
            flash(b, { type: 'sweep', l: 2, x0: ax, x1: 0.99, dur: 3.2 });
            flash(b, { type: 'sweep', l: 1, x0: 0.62, x1: 0.47, dur: 3.6 });
            flash(b, { type: 'sweep', l: 1, x0: 0.62, x1: 0.99, dur: 3.6 });
            flash(b, { type: 'sweep', l: 0, x0: 0.75, x1: 0.56, dur: 4 });
            flash(b, { type: 'sweep', l: 0, x0: 0.75, x1: 0.99, dur: 4 });
            sfx(b, 'wind');
          }],
          // 如同地上的尘沙
          [8, b => {
            if (b.instant) return;
            const span = W.landSpan(2, W.h * 0.02) || [W.w * 0.4, W.w];
            for (let i = 0; i < 16; i++) {
              const x = lerp(span[0] + 10, span[1] - 10, (i + Math.random()) / 16);
              fx().dust(x, W.ridgeBaseY(2, x) + rand(0, 30) * W.unit, 26, [242, 214, 160], 30 * W.unit);
              fx().sparkle(x, W.ridgeBaseY(2, x) - 4, 6, [255, 236, 190], 20, 'near');
            }
          }],
          [14, () => { pose('abram', 'stand'); unprop('tentB'); home({ speed: 0.022 }); }],
          [22, b => { prop('tentM', 'tent', { x: X.tent, size: 1.08, label: '亚伯兰的帐棚' }); sfx(b, 'build'); }],
          [23, () => { walk('abram', X.altarM - 0.02, { speed: 0.02 }); prop('altarM', 'altar', { x: X.altarM, grow: 1, label: '坛' }); }],
          [27, b => { prop('altarM', null, { fire: 1 }); pose('abram', 'pray'); sfx(b, 'fire'); }],
          // 四王攻打平原：罗得被掳
          [33, b => {
            prop('altarM', null, { fire: 0 });
            prop('sodom', null, { fire: 0.55 });
            W.goTo(0.79, 7, b.instant);
            flash(b, { type: 'battle', dur: 6 });
            sfx(b, 'crowd');
            unprop('tentLm');
            rm('lotM');
            say(b, [{ text: '又把亚伯兰的侄儿罗得和罗得的财物掳掠去了。<br>当时罗得正住在所多玛。', ref: '创世记 14:12', hold: 6.5 }]);
          }],
          [36, () => { pose('abram', 'stand'); face('abram', -1); }],
        ]);
      },
    },

    // ── 14:20 至高的神把敌人交在你手里；麦基洗德 ─────────────────
    {
      kind: 'act', utter: '至高的神把敌人交在你手里', cmd: 'rescue 罗得 --with 318 && tithe 10%', ref: '14:20',
      verse: [
        { text: '亚伯兰听见他侄儿被掳去，<br>就率领他家里生养的精练壮丁三百一十八人，直追到但，', ref: '创世记 14:14', hold: 6.5 },
        { text: '将被掳掠的一切财物夺回来，连他侄儿罗得和他的财物，<br>以及妇女、人民也都夺回来。', ref: '创世记 14:16', hold: 6.5 },
        { text: '又有撒冷王麦基洗德带着饼和酒出来迎接；<br>他是至高神的祭司。', ref: '创世记 14:18', hold: 6 },
        { text: '他为亚伯兰祝福，说：「愿天地的主、至高的神赐福与亚伯兰！<br>至高的神把敌人交在你手里，是应当称颂的！」<br>亚伯兰就把所得的拿出十分之一来，给麦基洗德。', ref: '创世记 14:19–20', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => {
            C().crowd('men', { mill: false, n: 9, x0: X.tent + 0.02, x1: X.tent + 0.16, layer: 2, label: '精练的壮丁', robe: [96, 80, 66], from: b.instant ? 'none' : 'fade' });
            beamOn(b, 'abram', { dur: 4 });
            sfx(b, 'crowd');
          }],
          [2.5, b => { walk('abram', 0.42, { speed: 0.045 }); C().crowdWalk('men', 0.43, 0.52, { speed: 0.045 }); W.goTo(0.93, 6, b.instant); }],
          [7, b => { C().removeCrowd('men'); flash(b, { type: 'battle', dur: 5 }); prop('sodom', null, { fire: 0 }); }],
          [11, b => {
            W.goTo(0.33, 7, b.instant);
            C().crowd('men2', { mill: false, n: 8, x0: 0.4, x1: 0.47, layer: 2, label: '精练的壮丁', robe: [96, 80, 66], from: b.instant ? 'none' : 'fade' });
            C().crowdWalk('men2', 0.45, 0.52, { speed: 0.03 });
            walk('abram', X.look + 0.012, { speed: 0.03 });
            add('lotM', { label: '罗得', sex: 'm', age: 'adult', layer: 1, x: X.sodom + 0.03, facing: -1, robe: ROBE.lot, glow: 0.15, from: 'fade' });
          }],
          [15, b => {
            add('mel', { label: '麦基洗德', sex: 'm', age: 'elder', x: X.moreh + 0.03, facing: -1, robe: ROBE.mel, glow: 0.6, from: 'light' });
            hold('mel', 'jar');
            walk('mel', X.look + 0.036, { speed: 0.012 });
            face('abram', 1);
            sfx(b, 'harp');
          }],
          [20, b => { face('mel', -1); pose('mel', 'raise'); pose('abram', 'kneel'); if (!b.instant) fx().ring(X.look * W.w, gY(2, X.look) - 20 * LS(2), [255, 230, 170], M() * 0.35, 2.4, 2); }],
          [25, b => {
            pose('mel', 'stand');
            if (!b.instant) { const a = headOf('abram', 14), m = headOf('mel', 18); const tg = []; for (let i = 0; i < 10; i++) tg.push([m[0] + rand(-4, 4), m[1] + rand(-4, 4), 1.6]); fx().sow(a[0], a[1], tg, [255, 222, 150], { stagger: 1.2, dur: 1.8, pass: 'top' }); }
          }],
          [29, () => { pose('abram', 'stand'); rm('mel'); C().crowdWalk('men2', X.tent + 0.05, X.tent + 0.14, { speed: 0.025 }); home({ speed: 0.022 }); }],
          [37, b => { C().removeCrowd('men2'); W.goTo(0.76, 9, b.instant); }],
          [41, b => say(b, [{ text: '这事以后，耶和华在异象中有话对亚伯兰说：<br>「亚伯兰，你不要惧怕！我是你的盾牌，必大大地赏赐你。」', ref: '创世记 15:1', hold: 7 }])],
        ]);
      },
    },

    // ── 15:5 你向天观看，数算众星 ────────────────────────────
    {
      kind: 'promise', utter: '你向天观看，数算众星', cmd: 'count(众星)  // overflow → 后裔', ref: '15:5', hold: 3.4,
      verse: [
        { text: '于是领他走到外边，说：「你向天观看，数算众星，能数得过来吗？」<br>又对他说：「你的后裔将要如此。」', ref: '创世记 15:5', hold: 9 },
        { text: '亚伯兰信耶和华，耶和华就以此为他的义。', ref: '创世记 15:6', hold: 7 },
      ],
      apply(c) {
        W.goTo(0.015, 7, c.instant);
        S.bloom = !c.instant;
        W.set('abStars', 1, c.instant);
        if (!c.instant) {
          // 灵撒出的第一批星，正落在众星将开之处
          const tg = [];
          for (let i = 0; i < STARS.length && tg.length < 150; i++) if (STARS[i].rank < 0.3) tg.push([STARS[i].x * W.w, STARS[i].y * W.h, 1 + STARS[i].m * 1.4]);
          fx().sow(c.x, Math.min(c.y, W.horizonY - 20), tg, [255, 250, 236], { stagger: 3, dur: 3.4, pass: 'sky' });
          fx().ring(c.x, c.y, [230, 236, 255], M() * 0.5, 2.6, 2);
        }
        T(c, [
          [0.5, () => { pose('abram', 'stand'); walk('abram', X.tent - 0.075, { speed: 0.018 }); }],
          [5.5, () => { face('abram', -1); pose('abram', 'gaze'); }],
          [9, b => sfx(b, 'harp')],
          [17, () => pose('abram', 'kneel')],
          [22, () => { S.bloom = false; }],
        ]);
      },
    },

    // ── 15:17 冒烟的炉并烧着的火把 ───────────────────────────
    {
      kind: 'act', utter: '冒烟的炉并烧着的火把', cmd: 'sign 约 --path 肉块之间 --by 火', ref: '15:17',
      verse: [
        { text: '亚伯兰就取了这些来，每样劈开，分成两半，<br>一半对着一半地摆列，只有鸟没有劈开。', ref: '创世记 15:10', hold: 6.5 },
        { text: '日头正落的时候，亚伯兰沉沉地睡了；<br>忽然有惊人的大黑暗落在他身上。', ref: '创世记 15:12', hold: 6.5 },
        { text: '日落天黑，不料有冒烟的炉并烧着的火把<br>从那些肉块中经过。', ref: '创世记 15:17', hold: 6.5 },
        { text: '当那日，耶和华与亚伯兰立约，<br>说：「我已赐给你的后裔，从埃及河直到伯拉大河之地……」', ref: '创世记 15:18', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.42, 6, b.instant); S.bloom = false; pose('abram', 'stand'); walk('abram', X.pieces + 0.13, { speed: 0.03 }); }],
          [3, b => { prop('pieces', 'pieces', { x: X.pieces, grow: 1, label: '肉块' }); sfx(b, 'build'); }],
          [6.5, b => { flash(b, { type: 'raptor', dur: 5.5 }); }],
          [8.5, () => { face('abram', -1); pose('abram', 'point'); }],
          [11, b => { pose('abram', 'stand'); W.goTo(0.755, 7, b.instant); walk('abram', X.sleep, { speed: 0.02 }); }],
          [15, b => { pose('abram', 'lie'); W.set('abDark', 0.85, b.instant); }],
          [18.5, b => { W.goTo(0.92, 5, b.instant); W.set('abPass', 1, b.instant); sfx(b, 'fire'); }],
          [28.5, b => {
            W.set('abDark', 0, b.instant);
            unprop('pieces');
            if (!b.instant) { const x = X.pieces * W.w, y = gY(2, X.pieces) - 10; fx().ring(x, y, [255, 214, 150], M() * 0.6, 3, 2.5); fx().sparkle(x, y, 40, [255, 220, 160], 50, 'top'); }
            sfx(b, 'seal');
          }],
          [31, () => { pose('abram', 'stand'); }],
          [33, b => { W.goTo(0.3, 8, b.instant); home({ speed: 0.022 }); }],
          // 16:1—6 撒莱与夏甲；夏甲逃走
          [37, b => say(b, [{ text: '亚伯兰的妻子撒莱不给他生儿女。<br>撒莱有一个使女，名叫夏甲，是埃及人。', ref: '创世记 16:1', hold: 6 }])],
          [43, b => {
            say(b, [{ text: '撒莱苦待她，她就从撒莱面前逃走了。', ref: '创世记 16:6', hold: 5.5 }]);
            walk('hagar', X.spring + 0.022, { speed: 0.032, pose: 'sit' });
          }],
        ]);
      },
    },

    // ── 16:11 耶和华听见了你的苦情 ───────────────────────────
    {
      kind: 'promise', utter: '耶和华听见了你的苦情', cmd: 'hear 夏甲  # 看顾人的神', ref: '16:11',
      verse: [
        { text: '耶和华的使者在旷野书珥路上的水泉旁遇见她，', ref: '创世记 16:7', hold: 5 },
        { text: '「你如今怀孕要生一个儿子，可以给他起名叫以实玛利，<br>因为耶和华听见了你的苦情。」', ref: '创世记 16:11', hold: 7 },
        { text: '夏甲就称那对她说话的耶和华为「看顾人的神」。', ref: '创世记 16:13', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => { walk('hagar', X.spring + 0.022, { speed: 0.075, pose: 'sit' }); prop('spring', null, { lit: 1 }); beam(b, X.spring + 0.05, 2, { dur: 7 }); sfx(b, 'harp'); }],
          [3.2, () => {
            add('angel', { label: '耶和华的使者', sex: 'm', age: 'adult', x: X.spring + 0.058, facing: -1, robe: ROBE.angel, glow: 1, angel: true, from: 'light' });
          }],
          [5, () => { pose('hagar', 'kneel'); face('hagar', 1); }],
          [13, b => { prop('spring', null, { lit: 0.3, label: '庇耳拉海莱' }); rm('angel'); if (!b.instant) fx().sparkle((X.spring + 0.058) * W.w, gY(2, X.spring + 0.058) - 20 * LS(2), 30, [255, 244, 220], 14, 'top'); }],
          [15, b => { pose('hagar', 'stand'); walk('hagar', X.tent + 0.046, { speed: 0.028 }); W.goTo(0.42, 12, b.instant); }],
          [27, b => {
            babe('hagar', 'baby');
            if (!b.instant) fx().ring((X.tent + 0.05) * W.w, gY(2, X.tent + 0.05) - 12 * LS(2), [255, 236, 200], M() * 0.25, 2, 2);
            say(b, [{ text: '后来夏甲给亚伯兰生了一个儿子；亚伯兰给他起名叫以实玛利。', ref: '创世记 16:15', hold: 6 }]);
          }],
        ]);
      },
    },

    // ── 17:1 我是全能的神 ────────────────────────────────────
    {
      kind: 'call', utter: '我是全能的神', cmd: 'whoami  # 全能的神', ref: '17:1', hold: 2.4,
      verse: [
        { text: '亚伯兰年九十九岁的时候，耶和华向他显现，对他说：<br>「我是全能的神。你当在我面前作完全人，<br>我就与你立约，使你的后裔极其繁多。」', ref: '创世记 17:1–2', hold: 8.5 },
        { text: '亚伯兰俯伏在地；神又对他说：<br>「我与你立约：你要作多国的父。」', ref: '创世记 17:3–4', hold: 6.5 },
      ],
      apply(c) {
        // 十三年过去了
        setAge('abram', 'elder'); setAge('sarai', 'elder');
        babe('hagar', null);
        if (!has('ishmael')) add('ishmael', { label: '以实玛利', sex: 'm', age: 'child', scale: 1.12, x: X.tent + 0.062, facing: -1, robe: ROBE.ishmael, glow: 0.2, from: c.instant ? 'none' : 'fade' });
        T(c, [
          [0.1, b => { beamOn(b, 'abram', { dur: 7, w: 110, r: 0.6 }); if (!b.instant) W.flash = 0.45; sfx(b, 'harp'); }],
          [1.1, () => pose('abram', 'fall')],
          [9.5, b => { if (!b.instant) { const h = headOf('abram', 8); fx().sparkle(h[0], h[1], 30, [255, 236, 190], 20, 'top'); } }],
        ]);
      },
    },

    // ── 17:5 改名：亚伯兰 → 亚伯拉罕，撒莱 → 撒拉 ──────────────
    {
      kind: 'name', utter: '你的名不再叫亚伯兰，要叫亚伯拉罕', cmd: 'git mv 亚伯兰 亚伯拉罕 && git mv 撒莱 撒拉', ref: '17:5', hold: 4.2,
      verse: [
        { text: '「从此以后，你的名不再叫亚伯兰，要叫亚伯拉罕，<br>因为我已立你作多国的父。」', ref: '创世记 17:5', hold: 7.5 },
        { text: '神又对亚伯拉罕说：「你的妻子撒莱不可再叫撒莱，她的名要叫撒拉。<br>我必赐福给她，也要使你从她得一个儿子。」', ref: '创世记 17:15–16', hold: 8 },
        { text: '神说：「不然，你妻子撒拉要给你生一个儿子，<br>你要给他起名叫以撒。」', ref: '创世记 17:19', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.1, b => {
            if (b.instant) return;
            const sz = M() * 0.07, a = headOf('abram', 20), at = nameAt(a[0] / W.w, W.h * 0.34, sz, 3);
            fx().nameStr('亚伯兰', at[0], at[1], sz, [236, 226, 206], () => [a[0] + rand(-14, 14), a[1] + rand(-14, 10), [236, 226, 206]], { hold: 1.1 });
          }],
          [4.4, b => {
            relabel('abram', '亚伯拉罕');
            pose('abram', 'kneel');
            if (b.instant) return;
            const sz = M() * 0.08, a = headOf('abram', 20), at = nameAt(a[0] / W.w, W.h * 0.34, sz, 4);
            // 「多国的父」——以天上的星尘写成
            fx().nameStr('亚伯拉罕', at[0], at[1], sz, [255, 232, 176], () => [rand(0, W.w), rand(0, W.horizonY * 0.7), [255, 240, 206]], { hold: 3.6 });
            fx().ring(a[0], a[1], [255, 232, 176], M() * 0.5, 2.6, 2);
            au().nameChime && au().nameChime('亚');
          }],
          [11.5, b => {
            if (b.instant) return;
            const sz = M() * 0.07, a = headOf('sarai', 20), at = nameAt(a[0] / W.w, W.h * 0.38, sz, 2);
            fx().nameStr('撒莱', at[0], at[1], sz, [236, 214, 200], () => [a[0] + rand(-12, 12), a[1] + rand(-12, 10), [236, 214, 200]], { hold: 1 });
          }],
          [15.5, b => {
            relabel('sarai', '撒拉');
            glow('sarai', 0.5);
            if (b.instant) return;
            const sz = M() * 0.08, a = headOf('sarai', 20), at = nameAt(a[0] / W.w, W.h * 0.38, sz, 2);
            // 「多国之母」——以地上温暖的尘土写成
            fx().nameStr('撒拉', at[0], at[1], sz, [255, 214, 176], () => { const x = rand(W.w * 0.4, W.w); return [x, W.ridgeBaseY(2, x) + rand(0, W.h * 0.1), [255, 206, 160]]; }, { hold: 3.2 });
            au().nameChime && au().nameChime('撒');
          }],
          [22, b => { pose('abram', 'fall'); sfx(b, 'laugh'); }],
          [26, b => {
            pose('abram', 'stand');
            if (b.instant) return;
            const sz = M() * 0.055, tx = X.tent, at = nameAt(tx, W.h * 0.42, sz, 2), t = headOf('abram', 10);
            fx().nameStr('以撒', at[0], at[1], sz, [255, 226, 150], () => [t[0] + rand(-40, 40), t[1] + rand(-20, 20), [255, 226, 150]], { hold: 2.6 });
          }],
          // 那时正热：他坐在帐棚门口
          [31, b => { W.goTo(0.5, 7, b.instant); walk('abram', X.tent - 0.022, { speed: 0.02, pose: 'sit' }); walk('sarai', X.tent + 0.01, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 18:10 幔利橡树下的三人；撒拉暗笑 ──────────────────────
    {
      kind: 'promise', utter: '你的妻子撒拉必生一个儿子', cmd: 'schedule 以撒 --at 明年这时候', ref: '18:10',
      verse: [
        { text: '耶和华在幔利橡树那里向亚伯拉罕显现出来。<br>那时正热，亚伯拉罕坐在帐棚门口，', ref: '创世记 18:1', hold: 6.5 },
        { text: '举目观看，见有三个人在对面站着。<br>他一见，就从帐棚门口跑去迎接他们，俯伏在地，', ref: '创世记 18:2', hold: 6.5 },
        { text: '三人中有一位说：「到明年这时候，我必要回到你这里；<br>你的妻子撒拉必生一个儿子。」<br>撒拉在那人后边的帐棚门口也听见了这话。', ref: '创世记 18:10', hold: 8 },
        { text: '撒拉心里暗笑，说：<br>「我既已衰败，我主也老迈，岂能有这喜事呢？」', ref: '创世记 18:12', hold: 6.5 },
      ],
      apply(c) {
        const vx = [X.oakA - 0.032, X.oakA - 0.013, X.oakA + 0.006];
        T(c, [
          [0, b => {
            W.goTo(0.5, 3, b.instant);
            ['v1', 'v2', 'v3'].forEach((id, i) => add(id, { label: '三人', sex: 'm', age: 'adult', x: vx[i], facing: 1, robe: ROBE.angel, glow: 0.75, angel: true, from: 'light' }));
            sfx(b, 'harp');
          }],
          [8, () => { pose('abram', 'stand'); walk('abram', X.oakA + 0.028, { run: true, speed: 0.08, pose: 'fall' }); face('abram', -1); }],
          [13, () => { ['v1', 'v2', 'v3'].forEach(id => pose(id, 'sit')); pose('abram', 'stand'); walk('abram', X.tent - 0.012, { speed: 0.05 }); }],
          [15.5, () => { walk('abram', X.oakA + 0.03, { speed: 0.04, pose: 'carry' }); }],
          [19, () => { pose('abram', 'stand'); face('abram', -1); walk('sarai', X.tent + 0.014, { speed: 0.02 }); face('sarai', -1); }],
          [18.5, b => { if (!b.instant) { const h = headOf('v2', 20); fx().sparkle(h[0], h[1], 18, [255, 240, 210], 10, 'top'); } }],
          [26, b => { sfx(b, 'laugh'); if (!b.instant) { const h = headOf('sarai', 16); fx().sparkle(h[0], h[1], 14, [255, 226, 180], 8, 'top'); } pose('sarai', 'bow'); }],
          [29, () => pose('sarai', 'stand')],
        ]);
      },
    },

    // ── 18:14 耶和华岂有难成的事吗？ ─────────────────────────
    {
      kind: 'ask', utter: '耶和华岂有难成的事吗？', cmd: 'assert(!难成(耶和华))  // pass', ref: '18:14',
      verse: [
        { text: '「耶和华岂有难成的事吗？到了日期，明年这时候，<br>我必回到你这里，撒拉必生一个儿子。」', ref: '创世记 18:14', hold: 7 },
        { text: '撒拉就害怕，不承认，说：「我没有笑。」<br>那位说：「不然，你实在笑了。」', ref: '创世记 18:15', hold: 6 },
        { text: '三人就从那里起行，向所多玛观看，<br>亚伯拉罕也与他们同行，要送他们一程。', ref: '创世记 18:16', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0.2, b => {
            glow('sarai', 0.9);
            prop('tentM', null, { lit: 1 });
            if (!b.instant) { const h = headOf('sarai', 18); fx().sow(c.x, c.y, [[h[0], h[1], 2.6], [h[0] + 3, h[1] + 4, 1.6], [h[0] - 3, h[1] + 2, 1.6]], [255, 226, 160], { stagger: 0.4, dur: 2.4, pass: 'top' }); fx().ring(h[0], h[1], [255, 226, 160], M() * 0.3, 2.4, 2); }
          }],
          [3, () => { pose('sarai', 'bow'); }],
          [8, () => { pose('sarai', 'stand'); glow('sarai', 0.5); prop('tentM', null, { lit: 0.35 }); }],
          [13, b => {
            W.goTo(0.63, 14, b.instant);
            ['v1', 'v2', 'v3'].forEach((id, i) => { pose(id, 'stand'); walk(id, X.look - 0.02 - i * 0.02, { speed: 0.024 }); });
            walk('abram', X.look + 0.012, { speed: 0.024 });
          }],
          [22, b => { ['v1', 'v2', 'v3', 'abram'].forEach(id => face(id, -1)); say(b, [{ text: '耶和华说：「所多玛和蛾摩拉的罪恶甚重，声闻于我。」', ref: '创世记 18:20', hold: 6 }]); }],
          [26, b => { walk('v2', 0.41, { speed: 0.02 }); walk('v3', 0.4, { speed: 0.02 }); say(b, [{ text: '二人转身离开那里，向所多玛去；<br>但亚伯拉罕仍旧站在耶和华面前。', ref: '创世记 18:22', hold: 6 }]); }],
          [33, () => { rm('v2'); rm('v3'); face('abram', 'v1'); face('v1', 'abram'); relabel('v1', '那位'); }],
        ]);
      },
    },

    // ── 18:32 为这十个的缘故 ─────────────────────────────────
    {
      kind: 'promise', utter: '为这十个的缘故，我也不毁灭那城', cmd: 'if (义人 >= 10) spare(所多玛)', ref: '18:32', hold: 3.8,
      verse: [
        { text: '亚伯拉罕近前来，说：「无论善恶，你都要剿灭吗？<br>假若那城里有五十个义人，你还剿灭那地方吗？」', ref: '创世记 18:23–24', hold: 7 },
        { text: '耶和华说：「我若在所多玛城里见有五十个义人，<br>我就为他们的缘故饶恕那地方的众人。」', ref: '创世记 18:26', hold: 6.5 },
        { text: '亚伯拉罕说：「求主不要动怒，我再说这一次，假若在那里见有十个呢？」<br>他说：「为这十个的缘故，我也不毁灭那城。」', ref: '创世记 18:32', hold: 8 },
      ],
      apply(c) {
        const nums = ['五十', '四十五', '四十', '三十', '二十', '十'];
        const steps = nums.map((n, i) => [1 + i * 3.1, b => {
          if (i === 0) { walk('abram', X.look + 0.002, { speed: 0.01 }); pose('abram', 'kneel'); }
          if (b.instant) return;
          const last = i === nums.length - 1;
          const sz = M() * (last ? 0.085 : 0.055) , ab = headOf('abram', 14);
          const at = nameAt((X.sodom + X.gomorrah) / 2, W.h * (0.42 - i * 0.012), sz, Array.from(n).length);
          fx().nameStr(n, at[0], at[1], sz, last ? [255, 226, 160] : [230, 226, 214],
            () => [ab[0] + rand(-10, 10), ab[1] + rand(-10, 6), last ? [255, 226, 160] : [214, 212, 206]], { hold: last ? 4.6 : 0.5 });
          if (last) au().nameChime && au().nameChime('十');
        }]);
        T(c, steps.concat([
          [23, b => { pose('abram', 'stand'); rm('v1'); if (!b.instant) { const h = headOf('v1', 18); fx().sparkle(h[0], h[1], 36, [255, 244, 220], 16, 'top'); } }],
          [24.5, b => { home({ speed: 0.022 }); say(b, [{ text: '耶和华与亚伯拉罕说完了话就走了；<br>亚伯拉罕也回到自己的地方去了。', ref: '创世记 18:33', hold: 5.5 }]); }],
          [28, b => { W.goTo(0.77, 8, b.instant); }],
          [33, b => {
            add('a2', { label: '天使', sex: 'm', age: 'adult', layer: 1, x: X.sodom + 0.05, facing: -1, robe: ROBE.angel, glow: 0.8, angel: true, from: 'light' });
            add('a3', { label: '天使', sex: 'm', age: 'adult', layer: 1, x: X.sodom + 0.066, facing: -1, robe: ROBE.angel, glow: 0.8, angel: true, from: 'light' });
            if (!has('lotM')) add('lotM', { label: '罗得', sex: 'm', age: 'adult', layer: 1, x: X.sodom + 0.03, facing: 1, robe: ROBE.lot, glow: 0.15, from: 'fade' });
            walk('lotM', X.sodom + 0.036, { speed: 0.01, pose: 'bow' });
            face('lotM', 1);
            sfx(b, 'gate');
            say(b, [{ text: '那两个天使晚上到了所多玛；罗得正坐在所多玛城门口，<br>看见他们，就起来迎接，脸伏于地下拜，', ref: '创世记 19:1', hold: 6.5 }]);
          }],
        ]));
      },
    },

    // ── 19:17 逃命吧！不可回头看 ─────────────────────────────
    {
      kind: 'cmd', utter: '逃命吧！不可回头看', cmd: 'evacuate 罗得 --no-look-back', ref: '19:17',
      verse: [
        { text: '领他们出来以后，就说：「逃命吧！不可回头看，也不可在平原站住。<br>要往山上逃跑，免得你被剿灭。」', ref: '创世记 19:17', hold: 7.5 },
      ],
      apply(c) {
        W.goTo(0.215, 5, c.instant);        // 天明了
        T(c, [
          [0, b => {
            const o = { layer: 1, from: b.instant ? 'none' : 'fade' };
            if (!has('lotM')) add('lotM', Object.assign({ label: '罗得', sex: 'm', age: 'adult', x: X.sodom + 0.036, robe: ROBE.lot, glow: 0.15 }, o));
            add('wife', Object.assign({ label: '罗得的妻子', sex: 'f', age: 'adult', x: X.sodom + 0.03, robe: ROBE.wife, glow: 0.1 }, o));
            add('d1', Object.assign({ label: '罗得的女儿', sex: 'f', age: 'adult', x: X.sodom + 0.042, robe: ROBE.dau, glow: 0.1, scale: 0.92 }, o));
            add('d2', Object.assign({ label: '罗得的女儿', sex: 'f', age: 'adult', x: X.sodom + 0.048, robe: ROBE.dau, glow: 0.1, scale: 0.88 }, o));
            pose('lotM', 'stand');
            walk('a2', X.sodom + 0.08, { speed: 0.02 }); walk('a3', X.sodom + 0.09, { speed: 0.02 });
            walk('lotM', X.zoar - 0.004, { speed: 0.013 }); walk('d1', X.zoar + 0.008, { speed: 0.013 }); walk('d2', X.zoar + 0.018, { speed: 0.013 });
            walk('wife', X.salt, { speed: 0.01 });
          }],
          [8, b => { W.goTo(0.285, 7, b.instant); say(b, [{ text: '罗得到了琐珥，日头已经出来了。', ref: '创世记 19:23', hold: 4.6 }]); }],
          [12.5, b => {
            W.set('abFire', 1, b.instant);
            rm('a2'); rm('a3');
            prop('sodom', null, { fire: 1, ruin: 1 }); prop('gomorrah', null, { fire: 1, ruin: 1 });
            if (!b.instant) { W.flash = 0.9; W.shake = 1; }
            sfx(b, 'thunder'); sfx(b, 'fire');
            say(b, [{ text: '当时，耶和华将硫磺与火从天上耶和华那里<br>降与所多玛和蛾摩拉，', ref: '创世记 19:24', hold: 5.5 }]);
          }],
          [18.5, () => { face('wife', -1); }],
          [20, b => {
            const f = fig('wife'), x = f ? f.nx : X.salt;
            rm('wife', true);
            prop('salt', 'salt', { x, layer: 1, label: '盐柱' });
            if (!b.instant) fx().sparkle(x * W.w, gY(1, x) - 14 * LS(1), 34, [250, 250, 244], 10, 'top');
            say(b, [{ text: '罗得的妻子在后边回头一看，就变成了一根盐柱。', ref: '创世记 19:26', hold: 6 }]);
          }],
          [25, b => {
            W.set('abFire', 0, b.instant); W.set('abSmoke', 1, b.instant);
            prop('sodom', null, { fire: 0.3 }); prop('gomorrah', null, { fire: 0.3 });
            walk('abram', X.look, { speed: 0.02 });
          }],
          [31, b => { face('abram', -1); say(b, [{ text: '亚伯拉罕清早起来，……向所多玛和蛾摩拉与平原的全地观看，<br>不料，那地方烟气上腾，如同烧窑一般。', ref: '创世记 19:27–28', hold: 7 }]); }],
          [36, () => { walk('lotM', 0.75, { speed: 0.014 }); walk('d1', 0.76, { speed: 0.014 }); walk('d2', 0.77, { speed: 0.014 }); }],
          [39, b => say(b, [{ text: '当神毁灭平原诸城的时候，他纪念亚伯拉罕，<br>正在倾覆罗得所住之城的时候，就打发罗得从倾覆之中出来。', ref: '创世记 19:29', hold: 7 }])],
          [44, b => { rm('lotM'); rm('d1'); rm('d2'); home({ speed: 0.02 }); W.goTo(0.4, 10, b.instant); }],
          [47, b => { W.set('abSmoke', 0.4, b.instant); prop('sodom', null, { fire: 0 }); prop('gomorrah', null, { fire: 0 }); say(b, [{ text: '亚伯拉罕从那里向南地迁去，<br>寄居在加低斯和书珥中间的基拉耳。', ref: '创世记 20:1', hold: 5.5 }]); }],
          [54, b => say(b, [{ text: '亚伯拉罕祷告神，神就医好了亚比米勒和他的妻子，<br>并他的众女仆，她们便能生育。', ref: '创世记 20:17', hold: 6 }])],
        ]);
      },
    },

    // ── 21:1 以撒生了 ────────────────────────────────────────
    {
      kind: 'act', utter: '耶和华按着先前的话眷顾撒拉', cmd: 'resolve(应许)  // 以撒 ✓', ref: '21:1',
      verse: [
        { text: '耶和华按着先前的话眷顾撒拉，<br>便照他所说的给撒拉成就。', ref: '创世记 21:1', hold: 6 },
        { text: '当亚伯拉罕年老的时候，撒拉怀了孕；<br>到神所说的日期，就给亚伯拉罕生了一个儿子。', ref: '创世记 21:2', hold: 6.5 },
        { text: '亚伯拉罕给撒拉所生的儿子起名叫以撒。', ref: '创世记 21:3', hold: 5 },
        { text: '撒拉说：「神使我喜笑，凡听见的必与我一同喜笑。」', ref: '创世记 21:6', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0.1, b => { W.goTo(0.42, 4, b.instant); W.set('abSmoke', 0.25, b.instant); walk('sarai', X.tent + 0.014, { speed: 0.03 }); beamOn(b, 'sarai', { dur: 6 }); sfx(b, 'harp'); }],
          [1.8, b => {
            babe('sarai', 'baby');
            glow('sarai', 0.8);
            prop('tentM', null, { lit: 0.6 });
          }],
          [3.5, () => { walk('abram', X.tent - 0.004, { speed: 0.03, pose: 'raise' }); }],
          [13.5, b => {
            if (b.instant) return;
            const sz = M() * 0.06, at = nameAt(X.tent, W.h * 0.4, sz, 2), h = headOf('sarai', 14);
            fx().nameStr('以撒', at[0], at[1], sz, [255, 226, 150], () => [h[0] + rand(-30, 30), h[1] + rand(-16, 8), [255, 230, 170]], { hold: 3 });
          }],
          [21, b => { sfx(b, 'laugh'); if (!b.instant) { for (let i = 0; i < 5; i++) { const x = (X.tent + rand(-0.06, 0.08)) * W.w; fx().sparkle(x, gY(2, x / W.w) - 30 * LS(2), 10, [255, 232, 180], 20, 'top'); } } pose('abram', 'stand'); }],
          // 断奶的筵席；夏甲与以实玛利被打发走
          [27, b => {
            babe('sarai', null); glow('sarai', 0.4); prop('tentM', null, { lit: 0.3 });
            add('isaac', { label: '以撒', sex: 'm', age: 'child', scale: 0.8, x: X.tent + 0.03, facing: -1, robe: ROBE.isaac, glow: 0.5, from: b.instant ? 'none' : 'fade' });
            C().crowd('feast', { n: 6, x0: X.tent + 0.07, x1: X.tent + 0.17, layer: 2, label: '赴筵的人', from: b.instant ? 'none' : 'fade' });
            sfx(b, 'crowd');
            say(b, [{ text: '孩子渐长，就断了奶。<br>以撒断奶的日子，亚伯拉罕设摆丰盛的筵席。', ref: '创世记 21:8', hold: 5.5 }]);
          }],
          [34, b => {
            C().removeCrowd('feast');
            hold('hagar', 'bundle');
            say(b, [{ text: '亚伯拉罕清早起来，拿饼和一皮袋水，给了夏甲，搭在她的肩上，<br>又把孩子交给她，打发她走。<br>夏甲就走了，在别是巴的旷野走迷了路。', ref: '创世记 21:14', hold: 8 }]);
            pose('hagar', 'stand');
            walk('hagar', X.shrub - 0.005, { speed: 0.02 }); walk('ishmael', X.shrub + 0.012, { speed: 0.02 });
          }],
          [50, () => { pose('ishmael', 'lie'); walk('hagar', X.spring + 0.028, { speed: 0.012, pose: 'sit' }); pose('hagar', 'sit', { weep: true }); face('hagar', 1); prop('spring', null, { lit: 0 }); }],
        ]);
      },
    },

    // ── 21:17 夏甲，你为何这样呢？ ───────────────────────────
    {
      kind: 'call', utter: '夏甲，你为何这样呢？不要害怕', cmd: 'open 井 --for 夏甲 以实玛利', ref: '21:17',
      verse: [
        { text: '神听见童子的声音；神的使者从天上呼叫夏甲说：<br>「夏甲，你为何这样呢？不要害怕，神已经听见童子的声音了。」', ref: '创世记 21:17', hold: 8 },
        { text: '神使夏甲的眼睛明亮，她就看见一口水井，<br>便去将皮袋盛满了水，给童子喝。', ref: '创世记 21:19', hold: 6.5 },
        { text: '神保佑童子，他就渐长，住在旷野，成了弓箭手。', ref: '创世记 21:20', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { walk('ishmael', X.shrub + 0.012, { speed: 0.04, pose: 'lie' }); walk('hagar', X.spring + 0.028, { speed: 0.04, pose: 'sit' }); beam(b, X.spring + 0.026, 2, { dur: 7, w: 90 }); sfx(b, 'harp'); }],
          [2, b => { pose('hagar', 'stand', { weep: false }); prop('spring', null, { lit: 1 }); if (!b.instant) fx().sparkle(X.spring * W.w, gY(2, X.spring), 30, [220, 240, 255], 14, 'top'); sfx(b, 'splash'); }],
          [3.5, () => { walk('hagar', X.spring + 0.012, { speed: 0.02, pose: 'kneel' }); }],
          [8, () => { walk('hagar', X.shrub - 0.004, { speed: 0.02, pose: 'kneel' }); }],
          [11.5, () => { pose('ishmael', 'stand'); face('ishmael', -1); }],
          [15, b => { setAge('ishmael', 'adult', 1); if (!b.instant) { const h = headOf('ishmael', 16); fx().sparkle(h[0], h[1], 26, [255, 236, 190], 14, 'top'); } pose('hagar', 'stand'); prop('spring', null, { lit: 0.35 }); }],
          [19, () => { walk('ishmael', 0.37, { speed: 0.014 }); walk('hagar', 0.355, { speed: 0.014 }); hold('hagar', null); }],
          [25, b => {
            rm('ishmael'); rm('hagar');
            walk('abram', X.tamarisk - 0.02, { speed: 0.02 });
            prop('tamarisk', 'tamarisk', { x: X.tamarisk, grow: 1, label: '垂丝柳树' });
            W.goTo(0.56, 12, b.instant);
            say(b, [{ text: '亚伯拉罕在别是巴栽上一棵垂丝柳树，<br>又在那里求告耶和华永生神的名。', ref: '创世记 21:33', hold: 6 }]);
          }],
          [30, () => pose('abram', 'pray')],
          [38, () => { pose('abram', 'stand'); walk('abram', X.tent - 0.03, { speed: 0.02 }); }],
        ]);
      },
    },

    // ── 22:1 亚伯拉罕！——往摩利亚地去 ─────────────────────────
    {
      kind: 'call', utter: '亚伯拉罕！', cmd: 'ping 亚伯拉罕  # 我在这里', ref: '22:1', hold: 2.8,
      verse: [
        { text: '这些事以后，神要试验亚伯拉罕，就呼叫他说：「亚伯拉罕！」<br>他说：「我在这里。」', ref: '创世记 22:1', hold: 7 },
        { text: '神说：「你带着你的儿子，就是你独生的儿子，你所爱的以撒，<br>往摩利亚地去，在我所要指示你的山上，把他献为燔祭。」', ref: '创世记 22:2', hold: 8.5 },
      ],
      apply(c) {
        const mo = S.moriah;
        T(c, [
          [0, b => { walk('abram', X.tent - 0.03, { speed: 0.04 }); beamOn(b, 'abram', { dur: 5 }); pose('abram', 'raise'); prop('tentM', null, { lit: 0 }); }],
          [3, () => pose('abram', 'bow')],
          [7, b => {
            W.goTo(0.27, 4, b.instant);
            pose('abram', 'stand');
            setAge('isaac', 'adult', 0.84);
            C().crowd('sv', { mill: false, n: 2, x0: X.tent + 0.03, x1: X.tent + 0.06, layer: 2, label: '仆人', from: b.instant ? 'none' : 'fade' });
            pasture();
            hold('isaac', 'wood'); hold('abram', 'torch');
          }],
          [9, b => {
            walk('abram', 0.9, { speed: 0.015 }); walk('isaac', 0.915, { speed: 0.015 });
            C().crowdWalk('sv', 0.93, 0.955, { speed: 0.015 });
            walk('don1', 0.94, { speed: 0.015 });
            sfx(b, 'wind');
          }],
          // 三日的路
          [11, b => W.goTo(0.86, 4, b.instant)],
          [15, b => W.goTo(0.26, 4, b.instant)],
          [19, b => W.goTo(0.86, 4, b.instant)],
          [23, b => W.goTo(0.3, 4, b.instant)],
          [26, b => {
            prop('moriah', 'halo', { x: mo, layer: 1, lit: 1, label: '摩利亚山' });
            face('abram', -1); pose('abram', 'point');
            say(b, [{ text: '到了第三日，亚伯拉罕举目远远地看见那地方。', ref: '创世记 22:4', hold: 5.5 }]);
          }],
          [30, () => {
            pose('abram', 'stand');
            C().crowdPose('sv', 'sit');
            walk('abram', 1.07, { speed: 0.025 }); walk('isaac', 1.09, { speed: 0.025 });
          }],
          [34, b => {
            rm('abram', true); rm('isaac', true);
            add('abramM', { label: '亚伯拉罕', sex: 'm', age: 'elder', layer: 1, x: 1.03, facing: -1, robe: ROBE.abram, glow: 0.45, scale: 1.4, from: b.instant ? 'none' : 'fade' });
            add('isaacM', { label: '以撒', sex: 'm', age: 'adult', layer: 1, x: 1.05, facing: -1, robe: ROBE.isaac, glow: 0.4, scale: 1.18, from: b.instant ? 'none' : 'fade' });
            hold('isaacM', 'wood'); hold('abramM', 'torch');
            walk('abramM', mo + 0.022, { speed: 0.02 }); walk('isaacM', mo + 0.04, { speed: 0.02 });
          }],
          [37, b => say(b, [{ text: '以撒对他父亲亚伯拉罕说：「父亲哪！」亚伯拉罕说：「我儿，我在这里。」<br>以撒说：「请看，火与柴都有了，但燔祭的羊羔在哪里呢？」', ref: '创世记 22:7', hold: 7.5 }])],
          [45.5, b => say(b, [{ text: '亚伯拉罕说：「我儿，神必自己预备作燔祭的羊羔。」<br>于是二人同行。', ref: '创世记 22:8', hold: 6 }])],
          [48, b => { prop('altarMo', 'altar', { x: mo, layer: 1, grow: 1, wood: 1, size: 1.6, label: '坛' }); hold('isaacM', null); sfx(b, 'build'); }],
          [53, b => {
            walk('isaacM', mo, { speed: 0.01, pose: 'lie' });
            attach('isaacM', () => altarTop('altarMo'));
            walk('abramM', mo + 0.024, { speed: 0.01, pose: 'raise' });
            face('abramM', -1);
            say(b, [{ text: '他们到了神所指示的地方，亚伯拉罕在那里筑坛，把柴摆好，<br>捆绑他的儿子以撒，放在坛的柴上。', ref: '创世记 22:9', hold: 7 }]);
          }],
        ]);
      },
    },

    // ── 22:12 你不可在这童子身上下手——耶和华以勒 ────────────────
    {
      kind: 'cmd', utter: '你不可在这童子身上下手', cmd: 'abort 燔祭 && provide 公羊  # 耶和华以勒', ref: '22:12',
      verse: [
        { text: '耶和华的使者从天上呼叫他说：「亚伯拉罕！亚伯拉罕！」<br>他说：「我在这里。」', ref: '创世记 22:11', hold: 5.5 },
        { text: '天使说：「你不可在这童子身上下手。一点不可害他！<br>现在我知道你是敬畏神的了；因为你没有将你的儿子，<br>就是你独生的儿子，留下不给我。」', ref: '创世记 22:12', hold: 8.5 },
        { text: '亚伯拉罕举目观看，不料，有一只公羊，两角扣在稠密的小树中。<br>亚伯拉罕就取了那只公羊来，献为燔祭，代替他的儿子。', ref: '创世记 22:13', hold: 7.5 },
        { text: '亚伯拉罕给那地方起名叫「耶和华以勒」，<br>直到今日人还说：「在耶和华的山上必有预备。」', ref: '创世记 22:14', hold: 7 },
      ],
      apply(c) {
        const mo = S.moriah;
        T(c, [
          [0, b => { beam(b, mo, 1, { dur: 8, w: 120, r: 0.7 }); if (!b.instant) W.flash = 0.6; sfx(b, 'harp'); }],
          [1.4, () => { pose('abramM', 'kneel'); }],
          [4.5, () => { attach('isaacM', null); pose('isaacM', 'stand'); pose('abramM', 'stand'); embrace('abramM', 'isaacM'); }],
          [9, b => {
            prop('thicket', 'thicket', { x: mo + 0.04, layer: 1, size: 1.4, label: '稠密的小树' });
            prop('ram', 'ram', { x: mo + 0.04, layer: 1, size: 1.4, label: '公羊' });
            pose('abramM', 'stand'); pose('isaacM', 'stand');
            face('abramM', 1); face('isaacM', 1);
            sfx(b, 'bleat');
          }],
          [15, () => { walk('abramM', mo + 0.032, { speed: 0.008 }); }],
          [17.5, () => { unprop('ram'); walk('abramM', mo + 0.02, { speed: 0.008, pose: 'pray' }); walk('isaacM', mo - 0.02, { speed: 0.008, pose: 'kneel' }); }],
          [20, b => { prop('altarMo', null, { fire: 1 }); sfx(b, 'fire'); }],
          [25, b => {
            if (b.instant) return;
            const sz = M() * 0.066, at = nameAt(mo, W.h * 0.3, sz, 5), sx = mo * W.w, sy = gY(1, mo);
            fx().nameStr('耶和华以勒', at[0], at[1], sz, [255, 226, 150], () => [sx + rand(-20, 20), rand(0, sy), [255, 236, 190]], { hold: 4.4 });
            au().nameChime && au().nameChime('以');
          }],
          [32, b => { prop('moriah', null, { lit: 0 }); prop('altarMo', null, { fire: 0.35 }); W.goTo(0.79, 8, b.instant); }],
          // 第二次呼叫：如同天上的星，海边的沙
          [36, b => {
            say(b, [{ text: '「论福，我必赐大福给你；论子孙，我必叫你的子孙多起来，<br>如同天上的星，海边的沙。', ref: '创世记 22:17', hold: 7 }]);
            if (b.instant) return;
            const pts = [];
            for (let i = 0; i < 900 && pts.length < 320; i++) { const x = Math.random() * W.w, y = rand(W.horizonY + 2, W.h); if (W.isSea(x, y)) pts.push([x / W.w, y / W.h, rand(2, 7), rand(0, TAU), Math.random()]); }
            flash(b, { type: 'sand', dur: 14, pts });
            const tg = [];
            for (let i = 0; i < STARS.length && tg.length < 120; i += 5) tg.push([STARS[i].x * W.w, STARS[i].y * W.h, 1 + STARS[i].m]);
            fx().sow(mo * W.w, gY(1, mo) - 20, tg, [255, 246, 226], { stagger: 3, dur: 3.2, pass: 'sky' });
          }],
          [44, b => say(b, [{ text: '并且地上万国都必因你的后裔得福，因为你听从了我的话。」', ref: '创世记 22:18', hold: 6 }])],
          [47, () => { pose('abramM', 'stand'); pose('isaacM', 'stand'); walk('abramM', 1.05, { speed: 0.022 }); walk('isaacM', 1.07, { speed: 0.022 }); }],
          [53, b => {
            rm('abramM', true); rm('isaacM', true); prop('altarMo', null, { fire: 0 });
            add('abram', { label: '亚伯拉罕', sex: 'm', age: 'elder', x: 1.04, facing: -1, robe: ROBE.abram, glow: 0.45, from: b.instant ? 'none' : 'fade' });
            add('isaac', { label: '以撒', sex: 'm', age: 'adult', x: 1.06, facing: -1, robe: ROBE.isaac, glow: 0.4, scale: 0.84, from: b.instant ? 'none' : 'fade' });
            hold('abram', null); hold('isaac', null);
            walk('abram', X.tent - 0.03, { speed: 0.022 }); walk('isaac', X.tent - 0.05, { speed: 0.022 });
            C().crowdWalk('sv', X.tent + 0.1, X.tent + 0.14, { speed: 0.022 });
            walk('don1', X.tent + 0.17, { speed: 0.022 });
          }],
          [64, () => { C().removeCrowd('sv'); }],
        ]);
      },
    },

    // ── 23:1 撒拉；麦比拉洞 ──────────────────────────────────
    {
      kind: 'act', utter: '撒拉享寿一百二十七岁', cmd: 'rest 撒拉 --age 127  # 麦比拉洞', ref: '23:1', hold: 3,
      verse: [
        { text: '撒拉享寿一百二十七岁，这是撒拉一生的岁数。', ref: '创世记 23:1', hold: 6 },
        { text: '撒拉死在迦南地的基列亚巴，就是希伯仑。<br>亚伯拉罕为她哀恸哭号。', ref: '创世记 23:2', hold: 6.5 },
        { text: '「我在你们中间是外人，是寄居的。求你们在这里给我一块地，<br>我好埋葬我的死人，使她不在我眼前。」', ref: '创世记 23:4', hold: 7.5 },
        { text: '此后，亚伯拉罕把他妻子撒拉埋葬在<br>迦南地幔利前的麦比拉田间的洞里。', ref: '创世记 23:19', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.745, 6, b.instant); walk('sarai', X.tent + 0.02, { speed: 0.02, pose: 'lie' }); glow('sarai', 0.25); pasture(); walk('don1', 0.6, { speed: 0.02 }); }],
          [3, b => { walk('abram', X.tent + 0.042, { speed: 0.02, pose: 'kneel' }); face('abram', -1); walk('isaac', X.tent - 0.012, { speed: 0.02, pose: 'kneel' }); sfx(b, 'weep'); }],
          [7, () => { pose('abram', 'kneel', { weep: true }); }],
          [12, b => {
            C().crowd('heth', { n: 5, x0: X.cave - 0.07, x1: X.cave + 0.06, layer: 2, label: '赫人', robe: [118, 100, 90], from: b.instant ? 'none' : 'fade' });
            pose('abram', 'stand', { weep: false }); walk('abram', X.cave - 0.1, { speed: 0.02, pose: 'bow' });
          }],
          [18, b => {
            pose('abram', 'stand');
            if (!b.instant) { const a = headOf('abram', 16), tg = []; for (let i = 0; i < 16; i++) tg.push([(X.cave - 0.03) * W.w + rand(-12, 12), gY(2, X.cave) - 22 * LS(2) + rand(-6, 6), 1.3]); fx().sow(a[0], a[1], tg, [230, 234, 244], { stagger: 1.4, dur: 1.6, pass: 'top' }); }
          }],
          [22, b => {
            W.goTo(0.3, 6, b.instant);
            const f = fig('sarai'), x = f ? f.nx : X.tent + 0.02;
            rm('sarai');
            prop('bier', 'bier', { x, label: '撒拉' });
            prop('bier', null, { tx: X.cave - 0.01, spd: 0.013 });
            add('bearer', { label: '仆人', sex: 'm', age: 'adult', x: x + 0.02, facing: 1, robe: ROBE.servant, glow: 0.1, from: b.instant ? 'none' : 'fade' });
            pose('isaac', 'stand');
            walk('isaac', X.cave - 0.024, { speed: 0.013, pose: 'stand' });
            walk('bearer', X.cave + 0.004, { speed: 0.013 });
            walk('abram', X.cave - 0.045, { speed: 0.013 });
            prop('cave', null, { lit: 0.5, label: '麦比拉洞' });
          }],
          [34, b => { unprop('bier'); prop('cave', null, { seal: 1, lit: 0 }); C().removeCrowd('heth'); pose('abram', 'kneel'); sfx(b, 'seal'); }],
          [38, () => { pose('abram', 'stand'); walk('abram', X.tent - 0.03, { speed: 0.018 }); walk('isaac', X.tent - 0.05, { speed: 0.018 }); walk('bearer', X.tent + 0.1, { speed: 0.018 }); }],
          [46, () => rm('bearer')],
        ]);
      },
    },

    // ── 24 井边的利百加 ──────────────────────────────────────
    {
      kind: 'act', utter: '耶和华在路上引领我', cmd: 'route 仆人 → 拿鹤的城  # 井边', ref: '24:27',
      verse: [
        { text: '那仆人从他主人的骆驼里取了十匹骆驼，并带些他主人各样的财物，<br>起身往美索不达米亚去，到了拿鹤的城。', ref: '创世记 24:10', hold: 7 },
        { text: '天将晚，众女子出来打水的时候，<br>他便叫骆驼跪在城外的水井那里。', ref: '创世记 24:11', hold: 6 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            add('servant', { label: '老仆人', sex: 'm', age: 'elder', x: X.tent + 0.04, facing: 1, robe: ROBE.servant, glow: 0.2, from: b.instant ? 'none' : 'fade' });
            pose('abram', 'raise');
          }],
          [2, b => {
            pose('abram', 'stand');
            W.goTo(0.74, 13, b.instant);
            walk('servant', X.wellN - 0.04, { speed: 0.02 });
            walk('cam1', X.wellN - 0.075, { speed: 0.022, pose: 'lie' }); walk('cam2', X.wellN - 0.1, { speed: 0.022, pose: 'lie' }); walk('cam3', X.wellN - 0.125, { speed: 0.022, pose: 'lie' });
            sfx(b, 'camel');
          }],
          [8, () => { prop('wellN', 'well', { x: X.wellN, label: '水井' }); }],
          [15, b => {
            pose('servant', 'pray');
            add('rebekah', { label: '利百加', sex: 'f', age: 'adult', x: 1.06, facing: -1, robe: ROBE.rebekah, glow: 0.35, from: b.instant ? 'none' : 'fade' });
            hold('rebekah', 'jar');
            walk('rebekah', X.wellN + 0.012, { speed: 0.028 });
            say(b, [{ text: '话还没有说完，不料，利百加肩头上扛着水瓶出来。', ref: '创世记 24:15', hold: 5.5 }]);
          }],
          [20, () => { pose('servant', 'stand'); walk('servant', X.wellN - 0.018, { speed: 0.03 }); face('rebekah', -1); pose('rebekah', 'carry'); }],
          [23.5, b => {
            say(b, [{ text: '女子给他喝了，就说：「我再为你的骆驼打水，叫骆驼也喝足。」', ref: '创世记 24:19', hold: 6 }]);
            walk('rebekah', X.wellN - 0.034, { speed: 0.03, pose: 'carry' });
            prop('wellN', null, { lit: 0.5 });
          }],
          [27, () => walk('rebekah', X.wellN + 0.012, { speed: 0.03 })],
          [30, () => walk('rebekah', X.wellN - 0.034, { speed: 0.03, pose: 'carry' })],
          [33, b => {
            walk('rebekah', X.wellN + 0.014, { speed: 0.03 });
            pose('servant', 'bow');
            if (!b.instant) { const h = headOf('servant', 10); fx().sparkle(h[0], h[1], 20, [255, 236, 200], 12, 'top'); }
            say(b, [{ text: '那人就低头向耶和华下拜，说：「……至于我，耶和华在路上引领我，<br>直走到我主人的兄弟家里。」', ref: '创世记 24:26–27', hold: 7 }]);
            sfx(b, 'harp');
          }],
          [41, b => {
            pose('servant', 'stand'); pose('rebekah', 'stand'); hold('rebekah', null);
            walk('rebekah', X.wellN - 0.072, { speed: 0.03 }); walk('servant', X.wellN - 0.05, { speed: 0.03 });
            say(b, [{ text: '就叫了利百加来，问她说：「你和这人同去吗？」<br>利百加说：「我去。」', ref: '创世记 24:58', hold: 6 }]);
          }],
          [43.5, () => { ride('rebekah', 'cam1'); }],
          // 夜里起程，次日天将晚到了南地
          [45, b => {
            W.goTo(0.22, 6, b.instant);
            prop('wellN', null, { lit: 0 }); unprop('wellN');
            walk('servant', 0.66, { speed: 0.02 });
            walk('cam1', 0.685, { speed: 0.02 }); walk('cam2', 0.715, { speed: 0.02 }); walk('cam3', 0.745, { speed: 0.02 });
            setAge('isaac', 'adult', 1);
            walk('isaac', X.spring + 0.02, { speed: 0.025 });
          }],
          [52, b => { W.goTo(0.76, 9, b.instant); walk('isaac', 0.585, { speed: 0.02, pose: 'pray' }); }],
          [60, b => { pose('isaac', 'stand'); face('isaac', 1); say(b, [{ text: '天将晚，以撒出来在田间默想，举目一看，见来了些骆驼。', ref: '创世记 24:63', hold: 6 }]); }],
          [63, () => { ride('rebekah', null); walk('rebekah', 0.64, { speed: 0.02 }); face('rebekah', -1); }],
          [68, b => {
            walk('isaac', X.tent - 0.012, { speed: 0.014 }); walk('rebekah', X.tent + 0.012, { speed: 0.014 });
            walk('servant', X.tent + 0.05, { speed: 0.014 });
            prop('tentM', null, { lit: 0.8 });
            say(b, [{ text: '以撒便领利百加进了他母亲撒拉的帐棚，娶了她为妻，并且爱她。<br>以撒自从他母亲不在了，这才得了安慰。', ref: '创世记 24:67', hold: 8 }]);
          }],
          [78, b => { prop('tentM', null, { lit: 0.2 }); if (!b.instant) fx().ring(X.tent * W.w, gY(2, X.tent) - 20 * LS(2), [255, 220, 170], M() * 0.35, 2.4, 2); }],
        ]);
      },
    },

    // ── 25 亚伯拉罕归到他列祖那里；神赐福给以撒 ─────────────────
    {
      kind: 'bless', utter: '神赐福给他的儿子以撒', cmd: 'bless 以撒  # 应许传下去', ref: '25:11',
      verse: [
        { text: '亚伯拉罕一生的年日是一百七十五岁。', ref: '创世记 25:7', hold: 5 },
        { text: '亚伯拉罕寿高年迈，气绝而死，归到他列祖那里。', ref: '创世记 25:8', hold: 6.5 },
        { text: '他两个儿子以撒、以实玛利把他埋葬在麦比拉洞里。', ref: '创世记 25:9', hold: 6 },
        { text: '亚伯拉罕死了以后，神赐福给他的儿子以撒。<br>以撒靠近庇耳拉海莱居住。', ref: '创世记 25:11', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.745, 7, b.instant); walk('abram', X.tent - 0.02, { speed: 0.02, pose: 'lie' }); glow('abram', 0.6); pasture(); }],
          [3, b => { walk('isaac', X.tent - 0.045, { speed: 0.02, pose: 'kneel' }); walk('rebekah', X.tent + 0.01, { speed: 0.02, pose: 'kneel' }); pose('isaac', 'kneel', { weep: true }); sfx(b, 'weep'); }],
          [7.5, b => {
            S.abStar = [0.3 + 0.4 * ((X.tent - 0.4) / 0.6), 0.22];
            if (!b.instant) { const h = headOf('abram', 8); fx().sow(h[0], h[1], [[S.abStar[0] * W.w, S.abStar[1] * W.horizonY, 2.4]], [255, 236, 190], { stagger: 0, dur: 4.5, pass: 'sky' }); fx().sparkle(h[0], h[1], 30, [255, 236, 200], 12, 'top'); }
            glow('abram', 0.1);
          }],
          [10, b => {
            add('ishmael', { label: '以实玛利', sex: 'm', age: 'adult', x: 1.05, facing: -1, robe: ROBE.ishmael, glow: 0.2, from: b.instant ? 'none' : 'fade' });
            walk('ishmael', X.tent + 0.05, { speed: 0.03 });
          }],
          [16, b => {
            W.goTo(0.28, 6, b.instant);
            const f = fig('abram'), x = f ? f.nx : X.tent - 0.02;
            rm('abram');
            prop('cave', null, { seal: 0, lit: 0.5 });
            prop('bier', 'bier', { x, label: '亚伯拉罕' });
            prop('bier', null, { tx: X.cave - 0.01, spd: 0.013 });
            pose('isaac', 'stand', { weep: false }); pose('rebekah', 'stand');
            walk('isaac', X.cave - 0.024, { speed: 0.013 }); walk('ishmael', X.cave + 0.004, { speed: 0.013 });
          }],
          [28, b => { unprop('bier'); prop('cave', null, { seal: 1, lit: 0 }); pose('isaac', 'kneel'); pose('ishmael', 'kneel'); sfx(b, 'seal'); }],
          [31, b => {
            pose('isaac', 'stand'); pose('ishmael', 'stand');
            beamOn(b, 'isaac', { dur: 7, w: 90, r: 0.8 });
            glow('isaac', 0.7);
            sfx(b, 'harp');
            if (au().bless && !b.instant) au().bless();
          }],
          [36, b => {
            W.goTo(0.02, 9, b.instant);
            W.set('abTwelve', 1, b.instant);
            walk('ishmael', 1.06, { speed: 0.02 });
            say(b, [{ text: '这是以实玛利众子的名字，照着他们的村庄、营寨，<br>作了十二族的族长。', ref: '创世记 25:16', hold: 6.5 }]);
          }],
          [42, () => { walk('isaac', X.spring + 0.03, { speed: 0.018 }); walk('rebekah', X.spring + 0.05, { speed: 0.018 }); prop('spring', null, { lit: 0.6 }); }],
          [50, () => { rm('ishmael'); face('isaac', 1); face('rebekah', -1); }],
        ]);
      },
    },
  ];

  GS.book.act({
    id: ACT, title: '亚伯拉罕', sub: '创世记 12:1 — 25:18', tint: [255, 214, 150], outro: 22,
    setup, stages: STAGES, scene: SCENE,
  });
})(window.GS);
