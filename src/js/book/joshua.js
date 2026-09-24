/* ─────────────────────────────────────────────────────────────
 * book/joshua.js —— 约书亚记 · 耶利哥（约书亚记 1 — 24）
 *
 * 摩西死了。约旦河东、什亭的营里，光落在约书亚身上——「你当刚强壮胆」；河那边的地亮起来。
 * 夜里两个探子进了耶利哥，住在城墙上的喇合把他们从窗户里缒下去，朱红线绳系在窗上。
 * 收割的日子，约旦河涨过两岸；抬约柜的祭司脚一入水，上游的水便在极远之处停住，立起成垒
 * （一道发光的水墙），下流的水全然断绝，众百姓从干地上过去（本卷的第一幅大画）。
 * 十二块石头从河中扛到吉甲，水流回原处；逾越节，吗哪止住；拔刀的耶和华军队的元帅——圣地。
 * 耶利哥：城门关得严紧；七个祭司拿七个羊角走在约柜前，一日绕城一次，六日；第七日绕城七次，
 * 角声拖长，百姓大声呼喊——城墙塌陷，惟独系着朱红线绳的那一段仍站着（本卷的签名）。
 * 亚干与亚割谷的石堆；向艾城伸出短枪，城中烟气冲天；基遍人的旧口袋；冰雹；
 * 日头在天当中停住，月亮止在亚雅仑谷；北方诸王多如海边的沙，车辆焚烧；国中太平；三十一个王。
 * 约书亚年纪老迈：拈阄分地，十二支派的名字一一落在地上；迦勒要那山地；西罗非哈的女儿；
 * 会幕设在示罗；六座逃城如灯；利未人的四十八城；证坛；「没有一句落空」；
 * 示剑的橡树下立起大石头；「至于我和我家」；约书亚一百一十岁；约瑟的骸骨终于葬在示剑。
 *
 * 画面的方位：左 = 约旦河东（什亭的营）；约旦河自近地的地脊（上游、远处）流向观者（下游、盐海）；
 *            河西 = 吉甲的营；右 = 耶利哥（城墙、城门、城墙上喇合的房子、棕树）；
 *            中丘 = 艾城、示罗的会幕、希伯仑；远山 = 北方（夏琐）。经文在左边的海上，故事都在右半边。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'joshua';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  W.defineLevel('joPromise', 'exp', 0.3);   // 河那边应许之地上的金光（1:2–3）
  W.defineLevel('joBeam', 'exp', 0.6);      // 落在约书亚身上的光（1:5）
  W.defineLevel('joManna', 'exp', 0.35);    // 地上的吗哪（5:12 止住）
  W.defineLevel('joFlood', 'exp', 0.3);     // 约旦河涨过两岸（3:15）
  W.defineLevel('joHeap', 'exp', 0.3);      // 上游的水立起成垒（3:16）
  W.defineLevel('joDry', 'lin', 0.13);      // 下流的水断绝：干的前缘自上而下
  W.defineLevel('joFill', 'lin', 0.42);     // 水流到原处：水的前缘自上而下（4:18）
  W.defineLevel('joHoly', 'exp', 0.5);      // 圣地（5:15）
  W.defineLevel('joRings', 'lin', 2.2);     // 六日：每日绕城一次（6:14）
  W.defineLevel('joRings7', 'lin', 2.2);    // 第七日：绕城七次（6:15）
  W.defineLevel('joHorn', 'exp', 1.4);      // 角声（6:8，6:20）
  W.defineLevel('joSun', 'exp', 0.45);      // 日头停留（10:13）
  W.defineLevel('joMoon', 'exp', 0.4);      // 月亮止在亚雅仑谷
  W.defineLevel('joHail', 'exp', 0.5);      // 从天上降的大冰雹落在远山（10:11）
  W.defineLevel('joHost', 'exp', 0.35);     // 北方诸王的众军，多如海边的沙（11:4）
  W.defineLevel('joFires', 'exp', 0.35);    // 焚烧车辆的火（11:9）
  W.defineLevel('joLevi', 'exp', 0.3);      // 利未人的四十八座城（21:41）
  W.defineLevel('joGroves', 'lin', 0.09);   // 非你们所栽种的葡萄园、橄榄园（24:13）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 约旦河东：什亭
    tentE: [0.428, 0.466, 0.503, 0.536], josh: 0.508, off1: 0.45, off2: 0.482,
    // 约旦河：上游（近地的地脊）→ 下游（画面底）
    jT: 0.588, jB: 0.548,
    // 河西：吉甲
    tentW: [0.618, 0.648, 0.677, 0.703], ark: 0.668, arkV: 0.26, stones: 0.636, stonesV: 0.74, gilgalJ: 0.685,
    field0: 0.93, field1: 0.985,
    // 耶利哥（城与绕城的圈都在画面之内：圈的右端 ≤ 0.95 宽）
    city: 0.8, cityHW: 0.078, outside: 0.915,
    // 中丘 / 远山
    ai: 0.655, shiloh: 0.8, hebron: 0.955, hazor: 0.925,
    // 示剑
    oak: 0.705, stele: 0.742, grave: 0.8,
  };
  const ROBE = {
    joshua: [92, 102, 148], priest: [236, 230, 212], spy: [118, 106, 90], spy2: [134, 112, 88], rahab: [170, 92, 86],
    officer: [138, 118, 92], guard: [88, 66, 60], eleazar: [240, 236, 222], caleb: [146, 116, 72],
    gib: [150, 138, 118], arm: [120, 96, 78], rear: [112, 100, 92], elder: [168, 150, 124],
  };
  const GOLD = [232, 192, 98];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { camp: 'east', ark: 'none', arkX: X.ark, arkV: X.arkV, march: false, horns: false, sword: false, spear: false,
      rope: false, carry12: false, gold: false, lots: [], lotDim: false, rings: 0, rings7: 0, crowns: false, hostL: 0 };
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
  // 近地纵深里的一点（与人物模块的站位相同）：v 0 = 地的轮廓线，1 = 画面底
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const easeOut = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(6106); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
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
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function members(gid) { const c = C(); const g = c.crowds && c.crowds.get ? c.crowds.get(gid) : null; return g ? g.members : []; }
  // 纵深 v 的缓动（人物模块里 v 是瞬间的）：一群人或一个人走向画面的前 / 后；重演时直接到位
  const VE = new Set();
  function vTo(id, v) {
    const list = hasCrowd(id) ? members(id) : (fig(id) ? [fig(id)] : []);
    const n = list.length;
    list.forEach((m, i) => {
      const t = Array.isArray(v) ? lerp(v[0], v[1], n > 1 ? U.fract(i * 0.618 + 0.21) : 0.5) : v;
      if (W.replaying) { m.v = t; m._jv = null; VE.delete(m); } else { m._jv = t; VE.add(m); }
    });
  }
  function easeV(dt) {
    if (!VE.size) return;
    const k = 1 - Math.exp(-2.2 * dt * (W.fast || 1));
    for (const m of VE) {
      if (m._jv == null || m.dying) { VE.delete(m); continue; }
      if (W.replaying || Math.abs(m._jv - m.v) < 0.002) { m.v = m._jv; m._jv = null; VE.delete(m); continue; }
      m.v += (m._jv - m.v) * k;
    }
  }
  function snapV() { for (const m of VE) { if (m._jv != null) m.v = m._jv; m._jv = null; } VE.clear(); }
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
    return [x, y - PH(l) * (f.age === 'elder' ? 0.96 : 1) * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  // 在某处聚成一个名字（微尘自 src 而来）
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
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().dust(x, y, n || 20, rgb || [214, 184, 140], spread || 14, 'near'); }

  // ── 装饰性的补间（只关乎画面；瞬间重演时不存在）───────────────
  const TW = {};
  function tween(b, name, v0, v1, dur) { if (b.instant) { delete TW[name]; return; } TW[name] = { v0, v1, t0: W.t, dur: Math.max(0.05, dur / (W.fast || 1)) }; }
  function tv(name, def) {
    const q = TW[name];
    if (!q) return def;
    const k = clamp((W.t - q.t0) / q.dur, 0, 1);
    return lerp(q.v0, q.v1, k);
  }
  const tweening = name => { const q = TW[name]; return !!q && W.t - q.t0 < q.dur; };

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.8, grow: 0.3, lit: 0.6, fire: 0.35, open: 0.9, cord: 0.3, fall: 0.3, ruin: 0.18, smoke: 0.3, bury: 0.22 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; if (p.tx != null) { p.x = p.tx; p.tx = null; } }
  // prop(id, kind, { x, layer, v, size, label, flip, show, grow, lit, fire, open, cord, fall, ruin, smoke, bury, tx, spd, name, rgb })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, layer: 2, v: 0, size: 1, label: '', seed: hashStr(id), tx: null, spd: 0.02, flip: 1 };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'v', 'size', 'label', 'spd', 'flip', 'name', 'rgb', 'v1', 'x1']) if (o[k] != null) p[k] = o[k];
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
  const ORDER = { lot: -6, field: -5, levi: -4, town: -3, grove: -3, tab: -2, ai: -2, hazor: -2, refuge: -1, stones: 1, cairn: 1, pfire: 1.5, tent: 2, glint: 2.5, palm: 3, city: 4, oak: 5, stele: 6, altar: 6 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || (a.v || 0) - (b.v || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }
  // 物件的地面（近地可有纵深 v）
  const baseOf = p => (p.layer === 2 ? fieldY(p.x, p.v || 0) : gY(p.layer, p.x));

  // ── 精灵图（离屏预绘的柔光）──────────────────────────────────
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      pale: radial([226, 240, 255], 1), smoke: radial([120, 112, 106], 0.8, 0.55), red: radial([236, 60, 56], 1),
      water: radial([170, 220, 246], 1), ember: radial([255, 120, 50], 1, 0.4), silver: radial([226, 234, 250], 1),
      dust: radial([178, 150, 116], 0.85, 0.55),
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
    return SP;
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }
  // 名字的字（楷书），离屏预绘
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb, halo) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr + '|' + rgb.join(',') + '|' + (halo ? 1 : 0);
    let s = TXT.get(key);
    if (s) return s;
    if (TXT.size > 120) TXT.clear();
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const font = Math.round(px * dpr) + 'px ' + FONT;
    g.font = font;
    const tw = Math.ceil(g.measureText(str).width) + Math.ceil(18 * dpr);
    c.width = Math.max(4, tw); c.height = Math.ceil(px * 2 * dpr);
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (halo) {
      // 远山上的名字：一圈暗的晕，好在淡的远山上看得清
      g.shadowColor = 'rgba(10, 8, 6, 0.9)'; g.shadowBlur = 7 * dpr;
      g.lineJoin = 'round'; g.strokeStyle = 'rgba(16, 12, 10, 0.72)'; g.lineWidth = 3.2 * dpr;
      g.strokeText(str, c.width / 2, c.height / 2);
    }
    g.shadowColor = 'rgba(14, 9, 5, 0.85)'; g.shadowBlur = 5 * dpr;
    g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    g.fillText(str, c.width / 2, c.height / 2);
    g.shadowColor = U.rgba(rgb[0], rgb[1], rgb[2], 0.5); g.shadowBlur = 9 * dpr;
    g.fillText(str, c.width / 2, c.height / 2);
    s = { c, w: c.width / dpr, h: c.height / dpr };
    TXT.set(key, s);
    return s;
  }
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "GS Kai"', '吕便迦得玛拿西犹大以法莲').then(() => TXT.clear()).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => TXT.clear()).catch(() => {});
      }
    } catch (e) { /* 老浏览器：用系统字 */ }
  }

  // ── 火、烟、灯 ────────────────────────────────────────────────
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
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
  function smoke(ctx, x, y, k, H, w, seed, dark) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 10, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.8);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.55 : 0.4) * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  function lamp(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  约旦河：自近地的地脊（上游、远）流到画面底（下游、近）
  // ════════════════════════════════════════════════════════════
  let RV = null;
  function rv() {
    // 以地的「全然升起」之形为准（与地此刻是否已画好无关——恢复存档时也一样）
    const k = W.w + 'x' + W.h;
    if (RV && RV.k === k) return RV;
    const x0 = X.jT * W.w, y0 = Math.min(W.ridgeBaseY(2, x0), W.h * 0.97) + 0.5, x3 = X.jB * W.w, y3 = W.h + 8;
    RV = { k, x0, y0, x3, y3, x1: lerp(x0, x3, 0.3) + 0.012 * W.w, y1: lerp(y0, y3, 0.33), x2: lerp(x0, x3, 0.66) - 0.01 * W.w, y2: lerp(y0, y3, 0.68), peb: null };
    return RV;
  }
  function rPt(t) {
    const R = rv(), u = 1 - t;
    const px = u * u * u * R.x0 + 3 * u * u * t * R.x1 + 3 * u * t * t * R.x2 + t * t * t * R.x3;
    const py = u * u * u * R.y0 + 3 * u * u * t * R.y1 + 3 * u * t * t * R.y2 + t * t * t * R.y3;
    const dx = 3 * u * u * (R.x1 - R.x0) + 6 * u * t * (R.x2 - R.x1) + 3 * t * t * (R.x3 - R.x2);
    const dy = 3 * u * u * (R.y1 - R.y0) + 6 * u * t * (R.y2 - R.y1) + 3 * t * t * (R.y3 - R.y2);
    const L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];          // 法线指向东岸（左）
  }
  // 河的半宽（像素）：随纵深变宽；涨水时更宽
  const floodK = () => 1 + 0.42 * W.lv.joFlood;
  const rHW = (t, k) => (0.14 + 1.05 * Math.pow(t, 1.15)) * PH(2) * (k == null ? floodK() : k);
  function tAtY(y) {
    let a = 0, b = 1;
    for (let i = 0; i < 16; i++) { const m = (a + b) / 2; if (rPt(m)[1] < y) a = m; else b = m; }
    return (a + b) / 2;
  }
  // 纵深 v 处河心 / 河岸的横坐标（比例）
  function riverAtV(v, side) {
    const y = lerp(rv().y0, W.h, 0.8 * v), t = tAtY(y), p = rPt(t);
    if (!side) return p[0] / W.w;
    return (p[0] + side * rHW(t) * 1.05) / W.w;
  }
  function riverPath(ta, tb, mul, add) {
    const N = 24, Lp = [], Rp = [];
    for (let i = 0; i <= N; i++) {
      const t = lerp(ta, tb, i / N), p = rPt(t), w = rHW(t) * mul + add * (0.3 + t);
      Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]);
    }
    const P2 = new Path2D();
    Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
    for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
    P2.closePath();
    return P2;
  }
  let RPC = { key: '', bank: null, bed: null };
  function drawJordan(ctx) {
    const R = rv(), s = LS(2), fl = W.lv.joFlood;
    const key = R.k + ':' + Math.round(fl * 40);
    if (RPC.key !== key) { RPC = { key, bank: riverPath(0, 1, 1.55, 5 * s), bed: riverPath(0, 1, 1.02, 0), gk: '', wk: '' }; }
    // 泥滩与芦苇的岸
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = css([132, 116, 84], 2);
    ctx.fill(RPC.bank);
    // 河床（干时露出卵石）
    ctx.globalAlpha = 1;
    ctx.fillStyle = css([150, 132, 104], 2);
    ctx.fill(RPC.bed);
    const dry = W.lv.joDry, fill = W.lv.joFill;
    if (dry > 0.01) {
      if (!R.peb) {
        R.peb = [];
        for (let i = 0; i < 90; i++) { const t = rt(i * 3 + 11), side = rt(i * 3 + 12) * 2 - 1; R.peb.push([t, side, 0.6 + rt(i * 3 + 13)]); }
      }
      ctx.fillStyle = css([118, 106, 92], 2);
      ctx.beginPath();
      for (const q of R.peb) {
        if (q[0] > dry + 0.02) continue;
        const p = rPt(q[0]), w = rHW(q[0]) * 0.85 * q[1], r = (0.6 + 1.8 * q[0]) * s * q[2];
        const x = p[0] + p[2] * w, y = p[1] + p[3] * w;
        ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.55, 0, 0, TAU);
      }
      ctx.fill();
      // 湿的石头，在光里微亮
      ctx.fillStyle = css([220, 206, 180], 2, 0.35 * dayA(), 0.1);
      ctx.beginPath();
      for (let i = 0; i < R.peb.length; i += 3) {
        const q = R.peb[i];
        if (q[0] > dry) continue;
        const p = rPt(q[0]), w = rHW(q[0]) * 0.85 * q[1], r = (0.6 + 1.8 * q[0]) * s * q[2];
        const x = p[0] + p[2] * w - r * 0.3, y = p[1] + p[3] * w - r * 0.25;
        ctx.moveTo(x + r * 0.4, y); ctx.ellipse(x, y, r * 0.4, r * 0.2, 0, 0, TAU);
      }
      ctx.fill();
    }
    // 河中的十二块石头（4:9）：在水下仍隐约可见
    const cj = getP('cairnJ');
    if (cj && cj.a > 0.01) drawCairn(ctx, cj);
    // 水：[0, fill] ∪ [dry, 1]
    const segs = [];
    if (fill >= dry - 0.002) segs.push([0, 1]);
    else { if (fill > 0.004) segs.push([0, fill]); if (dry < 0.996) segs.push([dry, 1]); }
    const night = W.night > 0.5;
    const top = W.shade([150, 190, 206], 0.4, 0.05), bot = W.shade([40, 94, 118], 0, 0.02);
    const gk = R.k + top.map(Math.round).join(',') + bot.map(Math.round).join(',');
    if (RPC.gk !== gk) {
      const gr = ctx.createLinearGradient(0, R.y0, 0, W.h);
      gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
      RPC.gk = gk; RPC.gr = gr;
    }
    const wk = key + ':' + segs.map(q => q[0].toFixed(3) + '-' + q[1].toFixed(3)).join('/');
    if (RPC.wk !== wk) { RPC.wk = wk; RPC.water = segs.map(sg => [riverPath(sg[0], sg[1], 1.4, 2 * s), riverPath(sg[0], sg[1], 1, 0)]); }
    for (const [over, body] of RPC.water) {
      // 涨过两岸的浅水
      if (fl > 0.02) {
        ctx.globalAlpha = 0.45 * fl;
        ctx.fillStyle = css([120, 150, 150], 2);
        ctx.fill(over);
      }
      ctx.globalAlpha = 0.93;
      ctx.fillStyle = RPC.gr;
      ctx.fill(body);
    }
    ctx.globalAlpha = 1;
    // 天光的倒影
    const gc = night ? [200, 214, 255] : [255, 246, 222];
    const ga = night ? 0.3 * W.lv.moon : 0.42 * W.daylight;
    if (ga > 0.01 && segs.length) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        let any = false;
        for (let i = band; i < 30; i += 3) {
          const t = U.fract(rt(i * 5 + 700) + W.t * 0.03 * (0.7 + 0.6 * rt(i * 5 + 701)));
          if (t < 0.03 || !segs.some(sg => t >= sg[0] && t <= sg[1])) continue;
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
    }
    // 水的前缘：泡沫
    const front = (t, a) => {
      if (t <= 0.01 || t >= 0.99 || a < 0.01) return;
      const p = rPt(t), w = rHW(t);
      ctx.strokeStyle = U.rgba(240, 246, 250, a * dayA());
      ctx.lineWidth = Math.max(1, 1.8 * s);
      ctx.beginPath();
      for (let i = -4; i <= 4; i++) {
        const k = i / 4, x = p[0] + p[2] * w * k, y = p[1] + p[3] * w * k + Math.sin(W.t * 7 + i * 1.7) * 1.2 * s;
        if (i === -4) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    if (dry > 0.01 && dry < 0.99 && fill < dry - 0.01) front(dry, 0.6);
    if (fill > 0.01 && fill < dry - 0.01) front(fill, 0.85);
    // 两岸的芦苇
    ctx.strokeStyle = css([96, 120, 66], 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const ws = W.wind * 1.5 * s;
    const nR = (W.quality || 1) < 0.75 ? 26 : 48;
    for (let i = 0; i < nR; i++) {
      const t = 0.05 + 0.92 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = rPt(t), w = rHW(t) * 1.25 + 2 * s;
      const x = p[0] + p[2] * w * side, y = p[1] + p[3] * w * side, h = (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t);
      const sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
    }
    ctx.stroke();
  }

  // ── 立起成垒的水（3:16）：上游的水在远处停住，堆成一道发光的水垒 ──
  //    水垒的脚盖过涨满的两岸；顶上一道亮的浪脊；背后是一条满溢、加宽的上游河面，直伸到中丘的地脊
  let HC = { key: '' };
  function heapGrad(ctx, base, crest, hwF, d, nk) {
    const ex = 0.1 + 0.25 * nk;
    const c0 = W.shade([176, 228, 242], 0.08, ex + 0.14), c1 = W.shade([40, 124, 158], 0.05, ex), c2 = W.shade([10, 52, 76], 0, ex * 0.6);
    const key = [Math.round(HC.cx), Math.round(base), Math.round(crest), Math.round(hwF), d, c0.map(Math.round).join(','), c2.map(Math.round).join(',')].join('|');
    if (HC.key === key) return HC;
    const g = ctx.createLinearGradient(0, crest, 0, base);
    g.addColorStop(0, U.rgb(c0[0], c0[1], c0[2]));
    g.addColorStop(0.2, U.rgb(c1[0], c1[1], c1[2]));
    g.addColorStop(1, U.rgb(c2[0], c2[1], c2[2]));
    const cx = HC.cx;
    const sg = ctx.createLinearGradient(cx - d * hwF, 0, cx + d * hwF * 0.3, 0);
    sg.addColorStop(0, 'rgba(4,20,34,0.5)'); sg.addColorStop(1, 'rgba(4,20,34,0)');
    const my0 = gY(1, X.jT + 0.004);
    const ug = ctx.createLinearGradient(0, my0, 0, crest + 2);
    const u0 = W.shade([92, 150, 178], 0.4, ex), u1 = W.shade([168, 220, 236], 0.2, ex + 0.1);
    ug.addColorStop(0, U.rgba(u0[0], u0[1], u0[2], 0)); ug.addColorStop(0.4, U.rgba(u0[0], u0[1], u0[2], 0.85)); ug.addColorStop(1, U.rgb(u1[0], u1[1], u1[2]));
    HC = { key, g, sg, ug, cx };
    return HC;
  }
  function drawHeap(ctx) {
    const h = W.lv.joHeap;
    if (h < 0.01) return;
    SP || sprites();
    const p = rPt(0.01), cx = p[0], base = p[1] + 1.5, s = LS(2), ph = PH(2);
    const e = easeOut(h), nk = nightK(), lit = 0.5 + 0.5 * W.daylight;
    const wl1 = W.waterlineY(1);
    const top = Math.min(base - ph * 1.3, wl1 - 0.006 * W.h);
    const H = (base - top) * e, crest = base - H;
    const bank = rHW(0.03, 1.42) * 1.55 + 5 * s;
    const hwF = Math.max(bank * 2.6, ph * 1.55) * (phone() ? 1.15 : 1);   // 脚：盖过两岸
    const hwT = hwF * (0.48 + 0.1 * e);                                   // 顶：较窄
    const d = litX() >= cx ? 1 : -1;
    HC.cx = cx;
    const G = heapGrad(ctx, base, crest, hwF, d, nk);
    // 上游：中丘上一条满溢、加宽的河面，自地脊一直到水垒的顶
    const ua = h * smoothstep(0.35, 0.95, e);
    const mx = (X.jT + 0.004) * W.w, my0 = gY(1, X.jT + 0.004) + 1;
    if (ua > 0.01 && crest > my0 + 2) {
      const wt = ph * 0.3, wb = hwT * 1.02;
      ctx.globalAlpha = ua * 0.95;
      ctx.fillStyle = G.ug;
      ctx.beginPath();
      ctx.moveTo(mx - wt, my0);
      ctx.quadraticCurveTo(mx - wt * 1.4, lerp(my0, crest, 0.6), cx - wb, crest + 2);
      ctx.lineTo(cx + wb, crest + 2);
      ctx.quadraticCurveTo(mx + wt * 1.4, lerp(my0, crest, 0.6), mx + wt, my0);
      ctx.closePath(); ctx.fill();
      // 满到岸边：两道亮的水边与几道向前涌的波光
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(214, 240, 252, (0.35 * lit + 0.15 * nk) * ua);
      ctx.lineWidth = Math.max(0.8, 1.1 * s);
      ctx.beginPath();
      ctx.moveTo(mx - wt, my0); ctx.quadraticCurveTo(mx - wt * 1.4, lerp(my0, crest, 0.6), cx - wb, crest + 2);
      ctx.moveTo(mx + wt, my0); ctx.quadraticCurveTo(mx + wt * 1.4, lerp(my0, crest, 0.6), cx + wb, crest + 2);
      ctx.stroke();
      for (let i = 0; i < 4; i++) {
        const f = U.fract(W.t * 0.12 + i / 4), yy = lerp(my0, crest, f), ww = lerp(wt, wb, f) * 0.7;
        ctx.globalAlpha = ua * Math.sin(f * Math.PI) * (0.3 * lit + 0.12 * nk);
        ctx.beginPath(); ctx.moveTo(mx + (cx - mx) * f - ww, yy); ctx.lineTo(mx + (cx - mx) * f + ww, yy); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 背后的光：水垒透出的天光
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.water, cx, base - H * 0.55, hwF * 1.6 + H * 0.4, h * (0.12 + 0.3 * nk));
    ctx.globalCompositeOperation = 'source-over';
    // 形：脚向两边铺开，两侧陡起，顶上一道几乎平的浪脊（像一道凝住的浪，背后连着上游）
    const wob = W.t * 0.9, N = 18, topPts = [];
    for (let i = 0; i <= N; i++) {
      const k = (i / N) * 2 - 1, lobe = 0.028 * Math.cos(k * 7 + 0.6) + 0.01 * Math.sin(k * 11 + wob) * e;
      topPts.push([cx + k * hwT, crest + H * (0.05 * k * k + lobe)]);
    }
    const body = () => {
      ctx.beginPath();
      ctx.moveTo(cx - hwF, base + 2 * s);
      ctx.bezierCurveTo(cx - hwF * 0.7, base - H * 0.06, cx - hwT * 1.14, base - H * 0.42, topPts[0][0], topPts[0][1]);
      for (let i = 1; i <= N; i++) ctx.lineTo(topPts[i][0], topPts[i][1]);
      ctx.bezierCurveTo(cx + hwT * 1.14, base - H * 0.42, cx + hwF * 0.7, base - H * 0.06, cx + hwF, base + 2 * s);
      ctx.closePath();
    };
    ctx.globalAlpha = 0.94;
    ctx.fillStyle = G.g;
    body(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.save();
    body(); ctx.clip();
    // 背光的一侧更深：水的厚度
    ctx.fillStyle = G.sg;
    ctx.fillRect(cx - hwF * 1.1, crest - 4, hwF * 2.2, H + 8);
    ctx.globalCompositeOperation = 'lighter';
    // 顶面：一道斜向后方的亮面，接上上游的河面
    ctx.fillStyle = U.rgba(214, 244, 255, 0.3 * h * lit + 0.12 * nk);
    ctx.beginPath(); ctx.ellipse(cx, crest + H * 0.05, hwT * 1.02, Math.max(2, H * 0.07), 0, 0, TAU); ctx.fill();
    // 迎光的一侧：玻璃似的一道亮面
    const hx = cx + d * hwT * 0.55;
    ctx.fillStyle = U.rgba(210, 242, 255, 0.12 * h * lit + 0.05 * nk);
    ctx.beginPath(); ctx.moveTo(hx - hwT * 0.2, crest); ctx.lineTo(hx + hwT * 0.22, crest); ctx.lineTo(hx + d * hwF * 0.35 + hwT * 0.3, base); ctx.lineTo(hx + d * hwF * 0.2 - hwT * 0.2, base); ctx.closePath(); ctx.fill();
    // 水中的光：几道缓缓上涌、起伏的亮带，与游动的光斑
    ctx.lineWidth = Math.max(1, 1.5 * s);
    for (let i = 0; i < 4; i++) {
      const f = U.fract(W.t * 0.05 + i / 4), yy = base - H * (0.08 + 0.84 * f), a = Math.sin(f * Math.PI);
      const wq = lerp(hwF * 0.9, hwT, f);
      ctx.strokeStyle = U.rgba(190, 236, 255, 0.15 * a * h * lit + 0.07 * a * nk);
      ctx.beginPath();
      for (let j = 0; j <= 10; j++) {
        const k = (j / 10) * 2 - 1, xx = cx + k * wq, y2 = yy - (1 - k * k) * H * 0.04 + Math.sin(k * 5 + W.t * 0.8 + i * 2) * H * 0.02;
        if (j) ctx.lineTo(xx, y2); else ctx.moveTo(xx, y2);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 9; i++) {
      const u = rt(i * 5 + 520), v = U.fract(rt(i * 5 + 521) + W.t * (0.015 + 0.02 * rt(i * 5 + 522)));
      const x = cx + (u * 2 - 1) * lerp(hwF * 0.8, hwT * 0.8, v), y = base - H * (0.06 + 0.84 * v), r = hwT * (0.26 + 0.2 * rt(i * 5 + 523));
      glowSp(ctx, SP.water, x, y, r, (0.15 + 0.1 * Math.sin(W.t * 1.3 + i * 2.2)) * h * lit + 0.05 * nk);
    }
    ctx.restore();
    // 浪脊：一道白的边与翻起的沫
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(248, 252, 255, 0.72 * h * lit + 0.25 * nk);
    ctx.lineWidth = Math.max(1.3, 2.2 * s);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const q = topPts[i]; if (i === 0) ctx.moveTo(q[0], q[1] + 1); else ctx.lineTo(q[0], q[1] + 1); }
    ctx.stroke();
    ctx.fillStyle = U.rgba(250, 252, 255, 0.75 * h * lit + 0.2 * nk);
    ctx.beginPath();
    for (let i = 0; i <= N; i += 1) {
      const q = topPts[i], jy = Math.sin(W.t * 3.4 + i * 2.1) * 1.2 * s, r = (0.9 + rt(i + 90) * 1.4) * s;
      ctx.moveTo(q[0] + r, q[1] + jy); ctx.arc(q[0], q[1] + jy, r, 0, TAU);
    }
    ctx.fill();
    SP || sprites();
    for (let i = 0; i < 14; i++) {
      const ph2 = U.fract(W.t * 0.4 + rt(i * 3 + 300)), q = topPts[Math.floor(rt(i * 3 + 301) * N)];
      const x = q[0] + Math.sin(i * 1.7) * ph2 * 9 * s, y = q[1] - ph2 * 14 * s;
      glowSp(ctx, SP.white, x, y, (2.2 + 2 * ph2) * s, h * (1 - ph2) * 0.55);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // 水垒脚下：盖过两岸的一片浅水、湿的河床与一线白沫
    ctx.fillStyle = U.rgba(20, 44, 56, 0.32 * h);
    ctx.beginPath(); ctx.ellipse(cx, base + 2 * s, hwF * 1.12, 3.6 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = U.rgba(96, 150, 170, 0.35 * h);
    ctx.beginPath(); ctx.ellipse(cx, base + 1 * s, hwF * 1.02, 2.4 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = U.rgba(236, 244, 248, 0.55 * h * lit + 0.15 * nk);
    ctx.beginPath(); ctx.ellipse(cx, base, hwF * 0.98, 1.5 * s, 0, 0, TAU); ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  耶利哥城：土丘、城墙（十二段，城门居中偏左）、城墙上喇合的房子、城里的房屋与高台
  // ════════════════════════════════════════════════════════════
  const CM = (() => {
    const r = U.mulberry32(4471);
    const N = 12, seg = [];
    for (let i = 0; i < N; i++) seg.push({ h: 0.95 + 0.1 * r(), tower: i === 0 || i === N - 1 || i === 4 || i === 6, jit: r() });
    // 城里平顶的房屋：后排在土丘高处（较高），前排紧贴在城墙之后
    const houses = [];
    for (let i = 0; i < 15; i++) {
      const tier = i % 2;
      houses.push({ ox: -0.88 + 1.76 * (i + 0.5) / 15 + (r() - 0.5) * 0.05, w: 0.1 + 0.08 * r(), h: (tier ? 1.0 : 0.84) + 0.34 * r(), tier, win: r() < 0.8, tw: r() * 6, slot: r() });
    }
    const rub = [];
    for (let i = 0; i < 120; i++) rub.push([r(), r(), r(), r()]);
    return { N, seg, houses, rub, gate: 5, rahab: 1, palace: { ox: 0.22, w: 0.27, h: 1.5 } };
  })();
  // 城的尺度：土丘（tell）、斜坡（glacis）、石砌的护墙（revetment）、其上的泥砖城墙
  function cityG(p) {
    const ph = PH(2), cx = p.x * W.w, hw = X.cityHW * W.w, wallH = 0.98 * ph;
    return { ph, cx, hw, wallH, revH: 0.3 * wallH, glH: 0.2 * wallH, moundH: 0.26 * ph, s: LS(2) };
  }
  function cityBase(G, x) {              // 土丘顶面（护墙的脚）
    const u = (x - G.cx) / (G.hw * 1.32);
    const k = Math.abs(u) >= 1 ? 0 : Math.pow(Math.cos(u * Math.PI / 2), 0.55);
    return gY(2, x / W.w) + 1 - G.moundH * k;
  }
  const wallFoot = (G, x) => cityBase(G, x) - G.revH;     // 泥砖城墙的脚（护墙顶）
  const segX = (G, i) => G.cx + G.hw * (-1 + (2 * i) / CM.N);
  // 各段城墙的倒塌（自城门向两边）；喇合那一段不倒
  function segFall(p, i) {
    if (i === CM.rahab) return 0;
    const d = Math.abs(i - CM.gate) / 7;
    return clamp(p.fall * 2.2 - d * 1.2, 0, 1);
  }
  function rahabWin(p) {       // 喇合的窗（像素）
    const G = cityG(p), x0 = segX(G, CM.rahab), x1 = segX(G, CM.rahab + 1), xm = (x0 + x1) / 2;
    const b = wallFoot(G, xm);
    return { x: xm + (x1 - x0) * 0.1, y: b - G.wallH * 0.86, roof: b - G.wallH * 1.55, base: b, w: x1 - x0 };
  }
  // 城里的房屋（墙倒之后塌下一半；火后只剩残垣）
  function cityHouses(G, p) {
    const fallK = clamp(p.fall * 1.25, 0, 1), cave = Math.min(0.92, 0.64 * fallK + 0.2 * p.fire + 0.4 * p.ruin);
    const one = (ox, w, h, tier, i) => {
      const hx = G.cx + ox * G.hw, ww = w * G.hw;
      const g0 = wallFoot(G, hx) - G.wallH * (tier ? 0.34 : 0.04) * (1 - 0.6 * fallK);
      const hh = h * G.wallH * (1 - cave * (0.84 + 0.12 * Math.sin(ox * 9 + i)));
      return { hx, g0, hh, ww, broken: fallK > 0.15, j: 0.5 + 0.5 * Math.sin(ox * 13 + i) };
    };
    const HB = CM.houses.map((q, i) => one(q.ox, q.w, q.h, q.tier, i));
    const PB = one(CM.palace.ox, CM.palace.w, CM.palace.h, 1, 20);
    return { HB, PB, fallK, cave };
  }
  // 一段倒下的墙：自脚下向前（向观者）翻倒，两边的也向外斜；落地后碎成砖块，滑下斜坡
  const KF = 0.56;
  function slabQuad(G, i, f) {
    const sg = CM.seg[i], xa = segX(G, i), xb = segX(G, i + 1), tw = sg.tower ? 0.12 * (xb - xa) : 0;
    const xA = xa - tw, xB = xb + tw, fA = wallFoot(G, xA), fB = wallFoot(G, xB);
    let H0 = G.wallH * sg.h * (sg.tower ? 1.32 : 1);
    if (i === CM.gate) H0 = G.wallH * 1.06;
    const side = i < CM.gate ? -1 : i > CM.gate ? 1 : 0, dist = Math.abs(i - CM.gate) / 6;
    const fk = clamp((f - 0.1) / 0.75, 0, 1), a = fk * fk * Math.PI / 2;
    const lat = side * (0.05 + 0.16 * dist) * H0 * Math.sin(a);
    const sl = smoothstep(0.8, 1, f) * G.glH * 0.8;
    const tr = f < 0.1 ? Math.sin(W.t * 41 + i * 3) * 1.3 * G.s * (f / 0.1) : 0;
    const bat = 0.03 * H0;
    const dy = -H0 * Math.cos(a) + KF * H0 * Math.sin(a);
    return { xA, xB, fA, fB, H0, a, side, lat, sl, tr, bat, dy,
      pts: [[xA + lat * 0.12 + tr, fA + sl * 0.6], [xA + bat + lat + tr, fA + dy + sl], [xB - bat + lat + tr, fB + dy + sl], [xB + lat * 0.12 + tr, fB + sl * 0.6]] };
  }
  function polyFill(ctx, pts) { ctx.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k][0], pts[k][1]); ctx.closePath(); }
  // 碎砖：一段墙落地之后的样子（在护墙前的斜坡上）
  function rubbleOf(G, i, k, out) {
    const q0 = slabQuad(G, i, 1), xA = q0.xA, xB = q0.xB, n = 6, sw = xB - xA;
    for (let j = 0; j < n; j++) {
      const r = CM.rub[(i * n + j) % CM.rub.length];
      const u = (j + 0.2 + 0.6 * r[0]) / n, x = lerp(xA, xB, u) + q0.lat * (0.5 + 0.6 * r[1]) + (r[3] - 0.5) * sw * 0.3;
      const y = lerp(q0.fA, q0.fB, u) + G.revH * (0.3 + 0.5 * r[2]) + (j % 3 === 0 ? G.glH * (0.6 + 0.8 * r[3]) : 0);
      const w = sw * (0.2 + 0.2 * r[1]) * (0.5 + 0.5 * k), h = w * (0.45 + 0.25 * r[2]);
      out.push([x, y, w, h, r[3]]);
    }
  }
  // 倒下的墙在护墙上与斜坡上堆成的一道砖土堆
  function heapPath(ctx, G, i, k) {
    const Q = slabQuad(G, i, 1), sw = Q.xB - Q.xA, sp = sw * 0.18, n = 6;
    const x0 = Q.xA - sp + Q.lat * 0.3, x1 = Q.xB + sp + Q.lat * 0.3;
    ctx.moveTo(x0, cityBase(G, x0) + G.glH * 0.7);
    for (let j = 0; j <= n; j++) {
      const u = j / n, x = lerp(x0, x1, u), r = CM.rub[(i * 11 + j) % CM.rub.length];
      const top = wallFoot(G, x) - Q.H0 * 0.1 * (0.5 + r[1]) * k + G.revH * 0.15 * (1 - Math.sin(u * Math.PI));
      ctx.lineTo(x, lerp(cityBase(G, x) + G.glH * 0.5, top, k));
    }
    ctx.lineTo(x1, cityBase(G, x1) + G.glH * 0.7);
    ctx.closePath();
  }
  function drawCityBody(ctx, p, G, A) {
    const s = G.s, l = 2, cx = G.cx, hw = G.hw;
    const ruin = p.ruin, burn = p.fire, nk = nightK(), lx = litX() >= cx ? 1 : -1;
    // 土丘
    const soil = U.mixRGB([152, 126, 90], [104, 128, 70], ruin);
    ctx.globalAlpha = A;
    ctx.fillStyle = css(soil, l);
    ctx.beginPath();
    const x0m = cx - hw * 1.36, x1m = cx + hw * 1.36;
    ctx.moveTo(x0m, gY(2, x0m / W.w) + 3);
    for (let i = 0; i <= 26; i++) { const x = lerp(x0m, x1m, i / 26); ctx.lineTo(x, cityBase(G, x) - (ruin * G.wallH * 0.3) * Math.max(0, 1 - Math.pow((x - cx) / (hw * 1.05), 2))); }
    ctx.lineTo(x1m, gY(2, x1m / W.w) + 3);
    ctx.closePath(); ctx.fill();
    const standA = A * (1 - smoothstep(0.62, 1, ruin));
    if (standA < 0.01) { ctx.globalAlpha = 1; return; }
    ctx.globalAlpha = standA;
    // 城里的房屋与高台：平顶，迎光一面亮、背光一面暗，窄窄的窗
    const H = cityHouses(G, p);
    const hc = U.mixRGB([206, 180, 138], [96, 76, 60], burn * 0.8), hs = U.mixRGB([150, 124, 94], [60, 48, 40], burn * 0.8);
    const order = H.HB.map((b, i) => [b, CM.houses[i].tier]).sort((a, b) => b[1] - a[1]);
    const boxPath = b => {
      const { hx, g0, hh, ww } = b;
      if (b.broken) {
        const j = b.j;
        ctx.moveTo(hx - ww / 2, g0); ctx.lineTo(hx - ww / 2, g0 - hh * (0.82 + 0.18 * j)); ctx.lineTo(hx - ww * 0.15, g0 - hh);
        ctx.lineTo(hx + ww * 0.1, g0 - hh * 0.86); ctx.lineTo(hx + ww * 0.3, g0 - hh * 0.93); ctx.lineTo(hx + ww / 2, g0 - hh * (0.9 - 0.2 * j)); ctx.lineTo(hx + ww / 2, g0); ctx.closePath();
      } else ctx.rect(hx - ww / 2, g0 - hh, ww, hh);
    };
    for (const tier of [1, 0]) {
      ctx.fillStyle = css(tier ? U.mixRGB(hc, [180, 160, 130], 0.25) : hc, l, 1, tier ? 0 : 0.03);
      ctx.beginPath();
      for (const [b, t] of order) if (t === tier) boxPath(b);
      if (tier) boxPath(H.PB);
      ctx.fill();
    }
    // 背光的一面、屋顶的边、窗
    ctx.fillStyle = css(hs, l, 0.8);
    ctx.beginPath();
    for (const b of H.HB.concat([H.PB])) ctx.rect(lx > 0 ? b.hx - b.ww / 2 : b.hx + b.ww * 0.2, b.g0 - b.hh, b.ww * 0.3, b.hh);
    ctx.fill();
    if (!H.fallK) {
      ctx.fillStyle = css([236, 216, 180], l, 0.5 * dayA(), 0.15);
      ctx.beginPath();
      for (const b of H.HB.concat([H.PB])) ctx.rect(b.hx - b.ww / 2 - 0.5 * s, b.g0 - b.hh - 1.2 * s, b.ww + 1 * s, 1.2 * s);
      ctx.fill();
      ctx.fillStyle = css([40, 30, 24], l, 0.85);
      ctx.beginPath();
      H.HB.forEach((b, i) => { const q = CM.houses[i]; const ww = Math.max(1, 0.12 * b.ww); ctx.rect(b.hx + (q.slot - 0.5) * b.ww * 0.5 - ww / 2, b.g0 - b.hh * 0.7, ww, Math.max(2, b.hh * 0.2)); });
      for (let k = 0; k < 3; k++) ctx.rect(H.PB.hx - H.PB.ww * 0.3 + k * H.PB.ww * 0.25, H.PB.g0 - H.PB.hh * 0.8, Math.max(1, 0.06 * H.PB.ww), H.PB.hh * 0.14);
      ctx.fill();
    }
    // 斜坡（抹了灰的土坡）与石砌的护墙
    const gx0 = cx - hw * 1.14, gx1 = cx + hw * 1.14, NG = 24;
    ctx.fillStyle = css(U.mixRGB([212, 194, 158], [120, 130, 84], ruin), l, 1, 0.02);
    ctx.beginPath();
    for (let i = 0; i <= NG; i++) { const x = lerp(gx0, gx1, i / NG), e = Math.min(1, Math.min(i, NG - i) / 3); const y = cityBase(G, x) + 0.5; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = NG; i >= 0; i--) { const x = lerp(gx0, gx1, i / NG), e = Math.min(1, Math.min(i, NG - i) / 3); ctx.lineTo(x, cityBase(G, x) + G.glH * e); }
    ctx.closePath(); ctx.fill();
    const rx0 = cx - hw * 1.07, rx1 = cx + hw * 1.07;
    const stoneC = U.mixRGB([160, 148, 126], [80, 70, 60], burn * 0.6);
    ctx.fillStyle = css(stoneC, l);
    ctx.beginPath();
    ctx.moveTo(rx0, cityBase(G, rx0) + 1);
    for (let i = 0; i <= NG; i++) { const x = lerp(rx0 + hw * 0.025, rx1 - hw * 0.025, i / NG); ctx.lineTo(x, wallFoot(G, x)); }
    ctx.lineTo(rx1, cityBase(G, rx1) + 1);
    for (let i = NG; i >= 0; i--) { const x = lerp(rx0, rx1, i / NG); ctx.lineTo(x, cityBase(G, x) + 1); }
    ctx.closePath(); ctx.fill();
    // 护墙的石缝
    ctx.strokeStyle = css([96, 86, 72], l, 0.4); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    const sw = Math.max(4, 7 * s);
    for (let row = 1; row <= 2; row++) {
      for (let x = rx0 + (row % 2) * sw * 0.5; x < rx1 - 1; x += sw) {
        const y = lerp(cityBase(G, x), wallFoot(G, x), row / 3);
        ctx.moveTo(x, y); ctx.lineTo(Math.min(rx1, x + sw), lerp(cityBase(G, x + sw), wallFoot(G, x + sw), row / 3));
        ctx.moveTo(x, y); ctx.lineTo(x, lerp(cityBase(G, x), wallFoot(G, x), (row - 1) / 3));
      }
    }
    ctx.stroke();
    // 城墙：泥砖，微向内收；城楼略高，平顶，窄窗
    const wallC = U.mixRGB([196, 158, 112], [96, 76, 58], burn * 0.6), topC = U.mixRGB([226, 196, 150], [110, 90, 70], burn * 0.6);
    const rubC = U.mixRGB([176, 144, 106], [84, 70, 56], burn * 0.5);
    const rims = [], rubble = [], slabs = [];
    for (let i = 0; i < CM.N; i++) {
      if (i === CM.rahab) continue;                        // 喇合的房子另画
      const f = segFall(p, i);
      if (f >= 0.999) { rubbleOf(G, i, 1, rubble); continue; }
      const Q = slabQuad(G, i, f);
      if (f > 0.85) rubbleOf(G, i, (f - 0.85) / 0.15, rubble);
      slabs.push([i, f, Q]);
    }
    // 站着的与正在倒的（先画已倒得多的，站着的在后面盖住它们的脚）
    slabs.sort((a, b) => (b[1] - a[1]) || ((CM.seg[a[0]].tower ? 1 : 0) - (CM.seg[b[0]].tower ? 1 : 0)));
    // 正在倒的墙在前面的斜坡上投下的影
    ctx.fillStyle = css([30, 22, 16], l, 0.3);
    ctx.beginPath();
    for (const [i, f, Q] of slabs) {
      if (f <= 0.1 || f >= 0.9) continue;
      const k = Math.sin(Q.a), xm = (Q.xA + Q.xB) / 2 + Q.lat * 0.6, ym = (Q.fA + Q.fB) / 2 + KF * Q.H0 * 0.55 + Q.sl;
      ctx.moveTo(xm + (Q.xB - Q.xA) * 0.6, ym); ctx.ellipse(xm, ym, (Q.xB - Q.xA) * 0.6, KF * Q.H0 * 0.45 * k, 0, 0, TAU);
    }
    ctx.globalAlpha = standA;
    ctx.fill();
    for (const [i, f, Q] of slabs) {
      const sg = CM.seg[i], face = Math.sin(Q.a) ** 2, fadeA = f > 0.85 ? 1 - (f - 0.85) / 0.15 : 1;
      const u = ((Q.xA + Q.xB) / 2 - cx) / hw, tone = 1 + 0.06 * lx * u;
      const col = U.mixRGB(wallC, topC, face).map(c => c * tone);
      ctx.globalAlpha = standA * fadeA;
      ctx.fillStyle = css(col, l, 1, 0.05 + 0.1 * nk);
      ctx.beginPath(); polyFill(ctx, Q.pts); ctx.fill();
      if (f <= 0.001) {
        // 砖的层缝
        const c = Math.max(2.4, 0.11 * G.wallH), hgt = Q.H0;
        ctx.strokeStyle = css([120, 92, 66], l, 0.2); ctx.lineWidth = Math.max(0.4, 0.5 * s);
        ctx.beginPath();
        for (let yy = c; yy < hgt - c * 0.5; yy += c) {
          const k = yy / hgt, xl = Q.xA + Q.bat * k, xr = Q.xB - Q.bat * k;
          ctx.moveTo(xl, lerp(Q.fA, Q.fA - hgt, k)); ctx.lineTo(xr, lerp(Q.fB, Q.fB - hgt, k));
          const off = (Math.round(yy / c) % 2) * c;
          for (let xx = xl + off + c; xx < xr - c * 0.5; xx += c * 2.2) { const yb = lerp(Q.fA, Q.fB, (xx - Q.xA) / (Q.xB - Q.xA)) - yy; ctx.moveTo(xx, yb); ctx.lineTo(xx, yb + c); }
        }
        ctx.stroke();
        // 背光的一侧（城楼）与窄窗
        if (sg.tower) {
          ctx.fillStyle = css([80, 62, 46], l, 0.3);
          const bw = (Q.xB - Q.xA) * 0.26;
          ctx.beginPath(); ctx.moveTo(lx > 0 ? Q.xA : Q.xB - bw, lx > 0 ? Q.fA : Q.fB); ctx.lineTo(lx > 0 ? Q.xA + Q.bat : Q.xB - bw, (lx > 0 ? Q.fA : Q.fB) - Q.H0);
          ctx.lineTo(lx > 0 ? Q.xA + bw : Q.xB - Q.bat, (lx > 0 ? Q.fA : Q.fB) - Q.H0); ctx.lineTo(lx > 0 ? Q.xA + bw : Q.xB, lx > 0 ? Q.fA : Q.fB); ctx.closePath(); ctx.fill();
          ctx.fillStyle = css([30, 22, 18], l, 0.9);
          ctx.beginPath();
          const mx = (Q.xA + Q.xB) / 2, my = (Q.fA + Q.fB) / 2 - Q.H0, sw2 = Math.max(1, 0.07 * (Q.xB - Q.xA));
          ctx.rect(mx - (Q.xB - Q.xA) * 0.18 - sw2 / 2, my + Q.H0 * 0.22, sw2, Q.H0 * 0.2); ctx.rect(mx + (Q.xB - Q.xA) * 0.18 - sw2 / 2, my + Q.H0 * 0.22, sw2, Q.H0 * 0.2);
          ctx.fill();
          ctx.fillStyle = css(topC, l, 1, 0.08);
          ctx.fillRect(Q.xA + Q.bat - 1.2 * s, my - 1.6 * s, Q.xB - Q.xA - 2 * Q.bat + 2.4 * s, 1.6 * s);
        }
        // 城门：一道方的门洞（门扇另画）
        if (i === CM.gate) {
          const gx = (Q.xA + Q.xB) / 2, gw = (Q.xB - Q.xA) * 0.2, gb = (cityBase(G, Q.xA) + cityBase(G, Q.xB)) / 2 + 1, gh = (G.wallH + G.revH) * 0.62;
          ctx.fillStyle = css([24, 18, 14], l);
          ctx.fillRect(gx - gw, gb - gh, gw * 2, gh);
          ctx.fillStyle = css(topC, l, 1, 0.05);
          ctx.fillRect(gx - gw * 1.2, gb - gh - 1.6 * s, gw * 2.4, 1.6 * s);
        }
        rims.push([Q.pts[1], Q.pts[2]]);
      } else {
        // 倒下时：迎天的一面（原来的墙面）亮起来
        ctx.strokeStyle = css([255, 232, 190], l, 0.5 * face * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
        ctx.beginPath(); ctx.moveTo(Q.pts[1][0], Q.pts[1][1]); ctx.lineTo(Q.pts[2][0], Q.pts[2][1]); ctx.stroke();
      }
    }
    ctx.globalAlpha = standA;
    // 碎砖与残垣（留在护墙上的一截断墙）：一道砖土堆，其上散着砖块
    if (rubble.length) {
      ctx.fillStyle = css(U.mixRGB(rubC, [150, 120, 88], 0.4), l);
      ctx.beginPath();
      for (let i = 0; i < CM.N; i++) { const f = segFall(p, i); if (i !== CM.rahab && f >= 0.85) heapPath(ctx, G, i, clamp((f - 0.85) / 0.15, 0, 1)); }
      ctx.fill();
      ctx.fillStyle = css(rubC, l);
      ctx.beginPath();
      for (let i = 0; i < CM.N; i++) {
        if (i === CM.rahab || segFall(p, i) < 0.85) continue;
        const Q = slabQuad(G, i, 0), k = (segFall(p, i) - 0.85) / 0.15, st = Q.H0 * 0.16 * Math.min(1, k * 1.5);
        const n = 5;
        ctx.moveTo(Q.xA, Q.fA);
        for (let j = 0; j <= n; j++) { const u = j / n; ctx.lineTo(lerp(Q.xA, Q.xB, u), lerp(Q.fA, Q.fB, u) - st * (0.4 + 0.6 * CM.rub[(i * 7 + j) % CM.rub.length][1])); }
        ctx.lineTo(Q.xB, Q.fB); ctx.closePath();
      }
      for (const r of rubble) {
        const [x, y, w, h, t] = r;
        ctx.moveTo(x - w * 0.5, y); ctx.lineTo(x - w * 0.42, y - h * 0.8); ctx.lineTo(x - w * 0.05 + t * w * 0.2, y - h); ctx.lineTo(x + w * 0.45, y - h * 0.7); ctx.lineTo(x + w * 0.52, y); ctx.closePath();
      }
      ctx.fill();
      ctx.fillStyle = css([232, 204, 160], l, 0.45 * dayA() + 0.1, 0.15);
      ctx.beginPath();
      for (const r of rubble) { const [x, y, w, h, t] = r; ctx.moveTo(x - w * 0.4, y - h * 0.78); ctx.lineTo(x - w * 0.05 + t * w * 0.2, y - h); ctx.lineTo(x + w * 0.42, y - h * 0.7); ctx.lineTo(x, y - h * 0.62); ctx.closePath(); }
      ctx.fill();
    }
    // 迎光的墙头
    if (rims.length) {
      ctx.strokeStyle = css([255, 232, 190], l, 0.45 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
      ctx.beginPath();
      for (const q of rims) { ctx.moveTo(q[0][0], q[0][1]); ctx.lineTo(q[1][0], q[1][1]); }
      ctx.stroke();
    }
    drawRahabHouse(ctx, p, G, standA, wallC, stoneC);
    ctx.globalAlpha = 1;
  }
  // ── 静止的城预绘在离屏的画布上（尺寸、光、倒塌 / 火 / 废墟的程度为键）──
  const BK = { key: '', c: null, x0: 0, y0: 0, w: 0, h: 0 };
  function lightKey(G) {
    const c = W.shade([200, 200, 200], 0, 0);
    return Math.round(c[0] / 4) + ',' + Math.round(c[1] / 4) + ',' + Math.round(c[2] / 4) + ',' + Math.round(nightK() * 12) + ',' + Math.round(W.daylight * 16) + ',' + (litX() >= G.cx ? 1 : 0);
  }
  function bakeCity(p, G, key) {
    const x0 = Math.floor(G.cx - G.hw * 1.7), x1 = Math.ceil(G.cx + G.hw * 1.7);
    const y0 = Math.floor(cityBase(G, G.cx) - G.revH - G.wallH * 2.9 - 6);
    const y1 = Math.ceil(Math.max(gY(2, x0 / W.w), gY(2, x1 / W.w), cityBase(G, G.cx) + G.glH) + G.wallH * 0.9);
    const dpr = Math.min(2, W.dpr || 1), w = Math.max(4, x1 - x0), h = Math.max(4, y1 - y0);
    try {
      if (!BK.c) BK.c = document.createElement('canvas');
      const cw = Math.ceil(w * dpr), ch = Math.ceil(h * dpr);
      if (BK.c.width !== cw || BK.c.height !== ch) { BK.c.width = cw; BK.c.height = ch; }
      const g = BK.c.getContext('2d');
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, cw, ch);
      g.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
      drawCityBody(g, p, G, 1);
      Object.assign(BK, { key, x0, y0, w, h });
    } catch (e) { BK.key = ''; BK.c = null; }
  }
  function drawCity(ctx, p) {
    const G = cityG(p), A = p.a;
    // 墙倒时，黎明的暖光从城后透出
    const rim = tweening('rim') ? tv('rim', 0) : 0;
    if (rim > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, G.cx, wallFoot(G, G.cx) - G.wallH * 0.8, G.hw * 2.2, rim * 0.55 * A);
      ctx.globalCompositeOperation = 'source-over';
    }
    const still = p.fall <= 0.0005 || p.fall >= 0.9995;
    if (still) {
      // 结构（尺寸、倒塌、火、废墟）变了立即重绘；只是天光变了，每 0.3 秒才重绘一次
      const sk = [W.w, W.h, W.dpr, p.fall > 0.5 ? 1 : 0, Math.round(p.fire * 12), Math.round(p.ruin * 24)].join('|'), lk = lightKey(G);
      if (BK.sk !== sk || (BK.lk !== lk && !(Math.abs(W.t - (BK.t || 0)) < 0.3))) { bakeCity(p, G, sk + '#' + lk); BK.sk = BK.key ? sk : ''; BK.lk = lk; BK.t = W.t; }
    }
    if (still && BK.c && BK.key) {
      ctx.globalAlpha = A;
      ctx.drawImage(BK.c, BK.x0, BK.y0, BK.w, BK.h);
      ctx.globalAlpha = 1;
    } else drawCityBody(ctx, p, G, A);
    drawCityLive(ctx, p, G);
  }
  // 会动的部分：门扇、火把、夜里的窗、喇合的灯与朱红线绳、火、烟、尘
  function drawCityLive(ctx, p, G) {
    const s = G.s, l = 2, cx = G.cx, A = p.a, nk = nightK(), burn = p.fire;
    const standA = A * (1 - smoothstep(0.62, 1, p.ruin));
    if (standA > 0.01) {
      const H = cityHouses(G, p);
      // 城门的门扇（6:1 关得严紧）与两旁的火把
      const gf = segFall(p, CM.gate);
      if (gf < 0.1) {
        const Q = slabQuad(G, CM.gate, 0), gx = (Q.xA + Q.xB) / 2, gw = (Q.xB - Q.xA) * 0.2, gb = (cityBase(G, Q.xA) + cityBase(G, Q.xB)) / 2 + 1, gh = (G.wallH + G.revH) * 0.62;
        const shut = 1 - p.open;
        ctx.globalAlpha = standA;
        if (shut > 0.02) {
          ctx.fillStyle = css([118, 84, 54], l);
          ctx.fillRect(gx - gw, gb - gh, gw * shut, gh);
          ctx.fillRect(gx + gw - gw * shut, gb - gh, gw * shut, gh);
          ctx.strokeStyle = css([64, 46, 32], l, 0.8); ctx.lineWidth = Math.max(0.5, 0.7 * s);
          ctx.beginPath(); ctx.moveTo(gx - gw * (1 - shut), gb - gh); ctx.lineTo(gx - gw * (1 - shut), gb); ctx.moveTo(gx - gw, gb - gh * 0.5); ctx.lineTo(gx + gw, gb - gh * 0.5); ctx.stroke();
        }
        if (nk > 0.1 && burn < 0.3) { flame(ctx, gx - gw * 1.9, gb - gh * 0.95, 5 * s, standA * nk * 0.9, 11); flame(ctx, gx + gw * 1.9, gb - gh * 0.95, 5 * s, standA * nk * 0.9, 17); }
        ctx.globalAlpha = 1;
      }
      // 夜里的窗
      if (nk > 0.05 && H.fallK < 0.15 && burn < 0.3) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,178,96)';
        CM.houses.forEach((q, i) => {
          if (!q.win) return;
          const b = H.HB[i], ww = Math.max(1, 0.12 * b.ww);
          ctx.globalAlpha = standA * nk * (1 - burn) * (0.55 + 0.35 * Math.sin(W.t * 0.8 + q.tw));
          ctx.fillRect(b.hx + (q.slot - 0.5) * b.ww * 0.5 - ww / 2, b.g0 - b.hh * 0.7, ww, Math.max(2, b.hh * 0.2));
        });
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
      drawRahabLive(ctx, p, G, standA);
      // 火（6:24）
      if (burn > 0.01) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.ember, cx, wallFoot(G, cx) - G.wallH * 0.8, G.hw * (1.1 + 0.4 * burn), burn * standA * (0.5 + 0.2 * Math.sin(W.t * 5)));
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < H.HB.length; i += 2) { const b = H.HB[i]; flame(ctx, b.hx, b.g0 - b.hh * 0.55, 8 * s * (0.5 + burn), burn * standA * 0.9, i * 3.1); }
        flame(ctx, H.PB.hx, H.PB.g0 - H.PB.hh * 0.6, 12 * s * (0.5 + burn), burn * standA, 5.5);
        ctx.globalAlpha = 1;
      }
    }
    if (p.smoke > 0.01) {
      for (let i = 0; i < 3; i++) smoke(ctx, cx + (i - 1) * G.hw * 0.45, wallFoot(G, cx) - G.wallH * 1.2, p.smoke * A, W.h * 0.3, 10 * s, i * 2.3, true);
    }
    drawPuffs(ctx);
  }
  // 喇合的房子：在城墙上，高出一截；窗有框（2:15）；房顶的矮墙与麻秸（2:6）
  function drawRahabHouse(ctx, p, G, A, wallC, stoneC) {
    const s = G.s, l = 2, R = rahabWin(p), x0 = segX(G, CM.rahab), x1 = segX(G, CM.rahab + 1);
    const b0 = wallFoot(G, x0), b1 = wallFoot(G, x1), H = G.wallH * 1.55;
    ctx.globalAlpha = A;
    ctx.fillStyle = css(U.mixRGB(wallC, [210, 176, 130], 0.4), l, 1, 0.03);
    ctx.beginPath(); ctx.moveTo(x0, b0); ctx.lineTo(x0 + 0.5 * s, b0 - H); ctx.lineTo(x1 - 0.5 * s, b1 - H); ctx.lineTo(x1, b1); ctx.closePath(); ctx.fill();
    // 房顶的矮墙与一束束麻秸
    ctx.fillStyle = css([204, 178, 128], l);
    ctx.beginPath(); ctx.rect(x0, b0 - H - 2.2 * s, x1 - x0, 2.2 * s); ctx.fill();
    ctx.fillStyle = css([214, 190, 120], l, 0.9);
    ctx.beginPath();
    for (let k = 0; k < 3; k++) { const bx = x0 + (x1 - x0) * (0.2 + k * 0.2); ctx.ellipse(bx, b0 - H - 2.6 * s, 2.2 * s, 1.2 * s, 0, Math.PI, TAU); }
    ctx.fill();
    // 背光的一侧
    const lx = litX() >= R.x ? 1 : -1;
    ctx.fillStyle = css([90, 70, 52], l, 0.32);
    ctx.fillRect(lx > 0 ? x0 : x1 - (x1 - x0) * 0.22, b0 - H, (x1 - x0) * 0.22, H);
    // 窗：暗的洞，浅色的框（楣与台）
    const ww = (x1 - x0) * 0.24, wh = G.wallH * 0.26;
    ctx.fillStyle = css([24, 18, 14], l);
    ctx.fillRect(R.x - ww / 2, R.y - wh, ww, wh);
    ctx.fillStyle = css([236, 214, 170], l, 1, 0.08);
    ctx.fillRect(R.x - ww / 2 - 1.2 * s, R.y - wh - 1.4 * s, ww + 2.4 * s, 1.4 * s);
    ctx.fillRect(R.x - ww / 2 - 1.6 * s, R.y, ww + 3.2 * s, 1.5 * s);
    ctx.globalAlpha = 1;
  }
  function drawRahabLive(ctx, p, G, A) {
    const s = G.s, R = rahabWin(p), ww = (R.w) * 0.24, wh = G.wallH * 0.26;
    SP || sprites();
    // 窗里的灯：夜里、或喇合在家时
    const lk = Math.min(1, nightK() * 0.85 + (p.lit || 0));
    if (lk > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = A * lk * 0.75;
      ctx.fillStyle = 'rgb(255,170,90)';
      ctx.fillRect(R.x - ww / 2, R.y - wh, ww, wh);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, R.x, R.y - wh / 2, ww * 3.4 + (p.lit || 0) * G.wallH * 0.8, A * lk, 3);
    }
    // 朱红线绳：细、深红，从窗台垂下，微微摇动；台上一个小结
    const cord = p.cord;
    if (cord > 0.005) {
      const len = (R.base - R.y) * 0.78 * cord, sw = Math.sin(W.t * 1.1) * 0.9 * s + Math.sin(W.t * 2.3 + 1) * 0.3 * s;
      const ax = R.x + ww * 0.28, ay = R.y + 0.6 * s;
      const a = A * Math.min(1, cord * 4);
      ctx.globalAlpha = a;
      ctx.strokeStyle = css([150, 18, 30], 2, 1, 0.12 + 0.2 * nightK());
      ctx.lineWidth = Math.max(1, 1.25 * s);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.bezierCurveTo(ax + 2.2 * s, ay + len * 0.3, ax + 1.2 * s + sw * 0.6, ay + len * 0.7, ax + 0.6 * s + sw, ay + len); ctx.stroke();
      ctx.fillStyle = css([170, 24, 36], 2, 1, 0.15 + 0.2 * nightK());
      ctx.beginPath(); ctx.arc(ax, ay, Math.max(1, 1.3 * s), 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 150, 150, 0.22 * a * (0.4 + 0.6 * dayA()));
      ctx.lineWidth = Math.max(0.5, 0.5 * s);
      ctx.beginPath(); ctx.moveTo(ax + 0.4 * s, ay + len * 0.1); ctx.bezierCurveTo(ax + 2.4 * s, ay + len * 0.32, ax + 1.4 * s + sw * 0.6, ay + len * 0.55, ax + 1.1 * s + sw * 0.8, ay + len * 0.7); ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 城墙倒塌时腾起的尘（圆的、柔的，向外向上翻滚；只关乎画面）
  const PUFF = [];
  const segPrev = new Array(12).fill(0);
  let lastFall = -1;
  function spawnPuffs(dt) {
    for (let i = PUFF.length - 1; i >= 0; i--) { PUFF[i].t += dt * (W.fast || 1); if (PUFF[i].t >= PUFF[i].dur) PUFF.splice(i, 1); }
    const c = getP('jericho');
    if (!c) { lastFall = -1; return; }
    const natural = lastFall >= 0 && Math.abs(c.fall - lastFall) < 0.05 && !W.replaying;
    lastFall = c.fall;
    for (let i = 0; i < CM.N; i++) {
      const f = segFall(c, i), was = segPrev[i];
      segPrev[i] = f;
      if (!natural || !(was < 0.8 && f >= 0.8)) continue;
      const G = cityG(c), Q = slabQuad(G, i, 1), n = phone() ? 4 : 6;
      for (let k = 0; k < n; k++) {
        const u = (k + Math.random()) / n, x = lerp(Q.xA, Q.xB, u) + Q.lat * 0.5, y = lerp(Q.fA, Q.fB, u) + KF * Q.H0 * 0.6;
        PUFF.push({ x: x / W.w, y: y / W.h, vx: (Q.side || (Math.random() - 0.5)) * (0.2 + Math.random() * 0.5) * G.wallH / W.w, vy: -(0.5 + Math.random() * 0.7) * G.wallH / W.h,
          r0: G.wallH * (0.22 + 0.15 * Math.random()), r1: G.wallH * (0.7 + 0.6 * Math.random()), t: 0, dur: 2.6 + Math.random() * 1.6 });
      }
    }
  }
  function shockAt(b, x, y, r) {
    if (b.instant) return;
    PUFF.push({ type: 'shock', x: x / W.w, y: y / W.h, r1: r / M(), t: 0, dur: 1.8 });
  }
  function drawPuffs(ctx) {
    if (!PUFF.length) return;
    SP || sprites();
    const day = 0.35 + 0.65 * W.daylight;
    for (const q of PUFF) {
      const k = clamp(q.t / q.dur, 0, 1), e = 1 - Math.pow(1 - k, 2.2);
      if (q.type === 'shock') {
        // 地面上一圈扁扁的震波
        const rx = q.r1 * M() * e, x = q.x * W.w, y = q.y * W.h;
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = U.rgba(255, 226, 180, 0.5 * (1 - k));
        ctx.lineWidth = Math.max(1, 3 * (1 - k) * SU());
        ctx.beginPath(); ctx.ellipse(x, y, rx, rx * 0.16, 0, 0, TAU); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        continue;
      }
      const r = lerp(q.r0, q.r1, e), x = (q.x + q.vx * e) * W.w, y = (q.y + q.vy * e) * W.h;
      const a = Math.min(1, k * 6) * Math.pow(1 - k, 1.4) * 0.48 * day;
      glowSp(ctx, SP.dust, x, y, r, a);
    }
    ctx.globalAlpha = 1;
  }

  // ── 帐棚（与创世记诸卷同一种画法）────────────────────────────
  function drawTent(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = baseOf(p) + 2 * s, hw = 30 * s, h = 22 * s;
    const k0 = 0.86 + 0.1 * rt(p.seed), k1 = 1 + 0.08 * rt(p.seed + 1), k2 = 0.84 + 0.1 * rt(p.seed + 2), tilt = (rt(p.seed + 3) - 0.5) * 0.06;
    ctx.globalAlpha = p.a;
    ctx.strokeStyle = css([96, 82, 64], l, 0.7); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    ctx.moveTo(x - 0.62 * hw, y - k0 * h * 0.86); ctx.lineTo(x - 1.36 * hw, y);
    ctx.moveTo(x + 0.6 * hw, y - k2 * h * 0.84); ctx.lineTo(x + 1.34 * hw, y);
    ctx.stroke();
    const pts = [[-1, 0], [-0.94, -0.42], [-0.62, -0.86 * k0], [-0.3, -0.74], [0.02, -k1 - 0.06], [0.32, -0.76], [0.62, -0.86 * k2], [0.94, -0.44], [1, 0]];
    ctx.fillStyle = css([58, 46, 40], l);
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) { const X1 = x + (pts[i][0] + pts[i][1] * tilt) * hw, Y1 = y + pts[i][1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 72, 62], l, 0.5); ctx.lineWidth = Math.max(0.5, 0.9 * s);
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
    // 营火（逾越节的晚上）
    if (p.fire > 0.01) flame(ctx, x + 1.6 * hw, y + 4 * s, 8 * s, p.fire * p.a, p.seed);
    ctx.globalAlpha = 1;
  }

  // ── 棕树（耶利哥是棕树城）────────────────────────────────────
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
    ctx.fillStyle = css([176, 104, 48], l);
    ctx.beginPath(); ctx.ellipse(tx + 1.5 * s, ty + 3 * s, 2.2 * s * g, 3 * s * g, 0.3, 0, TAU); ctx.fill();
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    ctx.fillStyle = css([66, 104, 56], l);
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

  // ── 约柜：金的柜，施恩座上两个基路伯，杠抬在祭司的肩上 ──────────
  const BEARERS = ['p1', 'p2', 'p3', 'p4'];
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  // 人物此刻的脚下与身高（按人物的状态算，不依赖上一帧画出的位置）
  function footOf(f) {
    const l = f.layer == null ? 2 : f.layer;
    let x, y;
    if (f.attach && f._ax != null) { x = f._ax; y = f._ay; }
    else {
      x = f.nx * W.w;
      const g = gY(l, f.nx), fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
      y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    }
    return [x, y, PH(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0))];
  }
  function arkPos() {
    if (S.ark === 'carry') {
      let n = 0, x = 0, y = 0, h = 0, a = 0, x0 = 1e9, x1 = -1e9;
      for (const id of BEARERS) {
        const f = fig(id);
        if (!f || f.alpha < 0.01) continue;
        const q = footOf(f);
        n++; x += q[0]; y += q[1]; h += q[2]; a += f.alpha; x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]);
      }
      if (!n) return null;
      x /= n; y /= n; h /= n; a /= BEARERS.length;
      if (a < 0.02) return null;
      return { x, y: y - h * 0.7, s: h / 49, span: Math.max(x1 - x0, h * 0.5), carried: true, a };
    }
    if (S.ark === 'ground') {
      const x = S.arkX * W.w, y = fieldY(S.arkX, S.arkV);
      return { x, y, s: PH(2) / 49, span: 0, carried: false, a: 1 };
    }
    return null;
  }
  function drawArk(ctx) {
    const q = arkPos();
    if (!q) return;
    SP || sprites();
    const s = q.s * 1.35, w = 13 * s, h = 8.5 * s, x = q.x, b = q.y;
    ctx.globalAlpha = q.a;
    // 光
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, b - h * 0.8, w * (3 + 1.6 * nightK()) * (S.arkLit ? 1.5 : 1), q.a * (0.18 + 0.35 * nightK()) * (S.arkLit ? 1.6 : 1));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = q.a;
    // 杠（抬着时伸到两边的祭司肩上）
    if (q.carried) {
      ctx.strokeStyle = css([150, 112, 56], 2); ctx.lineWidth = Math.max(1, 1.5 * s); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - q.span * 0.62 - 3 * s, b + 1 * s); ctx.lineTo(x + q.span * 0.62 + 3 * s, b + 1 * s); ctx.stroke();
    }
    // 柜身（夜里也是金的：自己发光，不是一个暗的箱子）
    const em = 0.18 + 0.55 * nightK();
    ctx.fillStyle = css(GOLD, 2, 1, em);
    ctx.fillRect(x - w, b - h, w * 2, h);
    ctx.fillStyle = css([176, 132, 58], 2, 1, em * 0.6);
    ctx.fillRect(x - w, b - h * 0.42, w * 2, h * 0.14);
    ctx.fillRect(x - w, b - 1.2 * s, w * 2, 1.2 * s);
    // 施恩座与两个基路伯（翅膀相对）
    ctx.fillStyle = css([246, 214, 128], 2, 1, 0.25 + 0.55 * nightK());
    ctx.fillRect(x - w * 1.06, b - h - 1.6 * s, w * 2.12, 1.6 * s);
    ctx.beginPath();
    for (const d of [-1, 1]) {
      const cx0 = x + d * w * 0.72, cy0 = b - h - 1.6 * s;
      ctx.moveTo(cx0, cy0); ctx.lineTo(cx0 + d * 1.2 * s, cy0 - 4.2 * s); ctx.lineTo(cx0 - d * 1.4 * s, cy0 - 3.6 * s); ctx.closePath();
      ctx.moveTo(cx0 + d * 0.4 * s, cy0 - 3.6 * s);
      ctx.quadraticCurveTo(cx0 - d * w * 0.2, cy0 - 8.5 * s, cx0 - d * w * 0.66, cy0 - 5.2 * s);
      ctx.quadraticCurveTo(cx0 - d * w * 0.3, cy0 - 5.8 * s, cx0 - d * 0.6 * s, cy0 - 2.4 * s);
      ctx.closePath();
    }
    ctx.fill();
    // 夜里：施恩座与基路伯的金边微微发亮
    if (nightK() > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 214, 130, 0.55 * nightK() * q.a);
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.stroke();
      ctx.strokeRect(x - w, b - h, w * 2, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边
    const lx = litX() >= x ? 1 : -1;
    ctx.strokeStyle = U.rgba(255, 242, 200, 0.55 * dayA() + 0.3 * nightK());
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - w * 1.06, b - h - 1.6 * s); ctx.lineTo(x + w * 1.06, b - h - 1.6 * s); ctx.moveTo(x + lx * w, b - h); ctx.lineTo(x + lx * w, b); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 石头：吉甲的十二块（4:20）、河中的石堆（4:9）、亚割谷的石堆（7:26）──
  // 石堆预绘（尺寸、光、亮度、块数为键；天光只变时每 0.3 秒重绘一次）
  const STB = new Map();
  function drawStones(ctx, p) {
    const n = Math.round(p.grow * 12);
    if (n < 1) return;
    const ph = PH(2) * (p.size || 1) * (1 + 0.35 * (p.v || 0)), cx = p.x * W.w, cy = fieldY(p.x, p.v) + 1;
    if (p.lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, cx, cy - ph * 0.12, ph * 1.3, p.lit * p.a * (0.3 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    let B = STB.get(p.id);
    const sk = [W.w, W.h, W.dpr, n, Math.round(p.lit * 10), Math.round(cx), Math.round(cy)].join('|'), lk = lightKey({ cx });
    if (!B || B.sk !== sk || (B.lk !== lk && !(Math.abs(W.t - B.t) < 0.3))) {
      const x0 = Math.floor(cx - ph * 0.75), y0 = Math.floor(cy - ph * 0.6), w = Math.ceil(ph * 1.5), h = Math.ceil(ph * 0.75);
      const dpr = Math.min(2, W.dpr || 1);
      B = B || { c: document.createElement('canvas') };
      try {
        B.c.width = Math.max(4, Math.ceil(w * dpr)); B.c.height = Math.max(4, Math.ceil(h * dpr));
        const g = B.c.getContext('2d');
        g.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
        stonesBody(g, p, n, ph, cx, cy);
        Object.assign(B, { sk, lk, t: W.t, x0, y0, w, h });
        STB.set(p.id, B);
      } catch (e) { STB.delete(p.id); return; }
    }
    ctx.globalAlpha = p.a;
    ctx.drawImage(B.c, B.x0, B.y0, B.w, B.h);
    ctx.globalAlpha = 1;
  }
  function stonesBody(ctx, p, n, ph, cx, cy) {
    const l = 2;
    // 十二块河里的圆石，垒成一个矮矮的石堆（下五、四、二、一）；宽过于高，大小不一
    if (!p.model) {
      const r = U.mulberry32(p.seed + 77), st = [], rows = [5, 4, 2, 1];
      rows.forEach((cnt, row) => {
        for (let j = 0; j < cnt; j++) {
          const w = 0.18 + 0.1 * r(), h = Math.min(w * 0.8, 0.12 + 0.08 * r());
          const x = ((j + 0.5) / cnt - 0.5) * (1.02 - row * 0.24) + (r() - 0.5) * 0.04, y = -row * 0.1 - (row === 3 ? 0.02 : 0);
          const nv = 5 + Math.floor(r() * 3), pts = [];
          for (let v = 0; v < nv; v++) {
            const ang = (v / nv) * TAU + (r() - 0.5) * 0.5, rr = 0.85 + 0.3 * r();
            let py = Math.sin(ang) * h / 2 * rr;
            if (py > 0) py *= 0.55;
            pts.push([Math.cos(ang) * w / 2 * rr, py]);
          }
          st.push({ x, y, w, h, pts, row, tone: 0.9 + 0.2 * r() });
        }
      });
      p.model = st;
    }
    const d = litX() >= cx ? 1 : -1;
    // 地上的影
    ctx.fillStyle = css([40, 34, 28], l, 0.35);
    ctx.beginPath(); ctx.ellipse(cx, cy + ph * 0.02, ph * 0.6, ph * 0.07, 0, 0, TAU); ctx.fill();
    for (let i = p.model.length - 1; i >= 0; i--) {
      if (i >= n) continue;
      const q = p.model[i], x0 = cx + q.x * ph, y0 = cy + q.y * ph - q.h * ph * 0.35;
      const path = () => { ctx.beginPath(); q.pts.forEach((v, k) => (k ? ctx.lineTo(x0 + v[0] * ph, y0 + v[1] * ph) : ctx.moveTo(x0 + v[0] * ph, y0 + v[1] * ph))); ctx.closePath(); };
      ctx.fillStyle = css([188 * q.tone, 172 * q.tone, 142 * q.tone], l, 1, 0.04 + 0.12 * p.lit);
      path(); ctx.fill();
      // 背光的下半与迎光的顶面
      ctx.save(); path(); ctx.clip();
      ctx.fillStyle = css([92, 80, 64], l, 0.45);
      ctx.beginPath(); ctx.ellipse(x0 - d * q.w * ph * 0.3, y0 + q.h * ph * 0.25, q.w * ph * 0.5, q.h * ph * 0.45, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([240, 226, 196], l, 0.55 * dayA() + 0.35 * p.lit, 0.2);
      ctx.beginPath(); ctx.ellipse(x0 + d * q.w * ph * 0.12, y0 - q.h * ph * 0.32, q.w * ph * 0.34, q.h * ph * 0.2, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
  function drawCairn(ctx, p) {
    const l = 2, ph = PH(2) * p.size, x = p.x * W.w, y = fieldY(p.x, p.v) + 1, g = p.grow;
    if (g < 0.01) return;
    const n = Math.max(1, Math.round(12 * g));
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(p.name === 'river' ? [120, 116, 104] : [128, 120, 108], l);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const row = i < 5 ? 0 : i < 9 ? 1 : i < 11 ? 2 : 3, inRow = [0, 5, 9, 11][row], cnt = [5, 4, 2, 1][row];
      const k = (i - inRow + 0.5) / cnt - 0.5;
      const cx = x + k * ph * (0.62 - row * 0.12) + (rt(p.seed + i) - 0.5) * ph * 0.05, cy = y - row * ph * 0.1 - ph * 0.04;
      const r = ph * (0.075 + 0.02 * rt(p.seed + i + 30));
      ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.72, 0, 0, TAU);
    }
    ctx.fill();
    ctx.fillStyle = css([220, 210, 190], l, 0.3 * dayA(), 0.15);
    ctx.beginPath();
    for (let i = 0; i < n; i += 2) {
      const row = i < 5 ? 0 : i < 9 ? 1 : i < 11 ? 2 : 3, inRow = [0, 5, 9, 11][row], cnt = [5, 4, 2, 1][row];
      const k = (i - inRow + 0.5) / cnt - 0.5, r = ph * 0.04;
      const cx = x + k * ph * (0.62 - row * 0.12) - r * 0.3, cy = y - row * ph * 0.1 - ph * 0.07;
      ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.5, 0, 0, TAU);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 亚干藏在帐棚里的东西：一闪一闪的金与红（7:21）
  function drawGlint(ctx, p) {
    const k = p.lit * p.a;
    if (k < 0.01) return;
    SP || sprites();
    const x = p.x * W.w, y = fieldY(p.x, p.v) - 2, ph = PH(2);
    const pulse = 0.6 + 0.4 * Math.sin(W.t * 2.2);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.red, x, y, ph * 0.5, k * 0.35 * pulse);
    glowSp(ctx, SP.gold, x + ph * 0.05, y - 1, ph * 0.22, k * 0.8 * pulse);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 逾越节的火（5:10）：地上一圈石头，一堆小火；人围着火跪坐
  function drawPFire(ctx, p) {
    const k = p.a * p.fire;
    if (k < 0.01) return;
    SP || sprites();
    const x = p.x * W.w, y = fieldY(p.x, p.v), s = LS(2) * (1 + 0.35 * (p.v || 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.warm, x, y, 30 * s, k * (0.22 + 0.4 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([84, 74, 64], 2, 1, 0.15 * k);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU, sx = x + Math.cos(a) * 5.5 * s, sy = y + Math.sin(a) * 1.7 * s; ctx.moveTo(sx + 1.5 * s, sy); ctx.ellipse(sx, sy, 1.5 * s, 1.05 * s, 0, 0, TAU); }
    ctx.fill();
    flame(ctx, x, y, 9 * s, k, p.seed);
    ctx.globalAlpha = 1;
  }
  // 火光照在围坐的人身上（画在人之后，淡淡的暖色）；元帅的光照在约书亚身上
  function drawFireLight(ctx) {
    const nk = nightK();
    if (nk < 0.05) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const cf = fig('commander'), jp = figPt('joshua', 0.35);
    if (cf && cf.alpha > 0.02 && jp) glowSp(ctx, SP.pale, jp[0], jp[1], PH(2) * 0.9, cf.alpha * nk * 0.32);
    // 房顶上的喇合：窗里的灯照亮她（2:8）
    const rf = fig('rahab'), city = getP('jericho');
    if (rf && rf.alpha > 0.02 && city && city.lit > 0.02) {
      const rp = figPt('rahab', 0.45);
      if (rp) { glowSp(ctx, SP.warm, rp[0], rp[1], PH(2) * 0.95, rf.alpha * city.lit * nk * 0.55); glowSp(ctx, SP.gold, rp[0], rp[1] - PH(2) * 0.3, PH(2) * 0.4, rf.alpha * city.lit * nk * 0.35); }
    }
    for (const p of P.values()) {
      if (p.kind !== 'pfire' || p.a * p.fire < 0.02) continue;
      const x = p.x * W.w, y = fieldY(p.x, p.v), ph = PH(2);
      glowSp(ctx, SP.warm, x, y - ph * 0.35, ph * 1.5, p.a * p.fire * nk * 0.3 * (0.9 + 0.1 * Math.sin(W.t * 7 + p.seed)));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 大麦田（3:15 收割的日子；5:11 那地的出产）
  function drawField(ctx, p) {
    const k = p.a;
    if (k < 0.01) return;
    const s = LS(2), g = p.grow, x0 = p.x, x1 = p.x1 || p.x + 0.04, v0 = p.v || 0.4, v1 = p.v1 || 1;
    const col = U.mixRGB([110, 138, 66], [222, 186, 96], g);
    ctx.globalAlpha = k;
    ctx.strokeStyle = css(col, 2, 1, 0.05);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    const n = (W.quality || 1) < 0.75 ? 40 : 80;
    for (let i = 0; i < n; i++) {
      const v = lerp(v0, v1, rt(i * 2 + p.seed)), u = rt(i * 2 + p.seed + 1), xf = lerp(x0, x1, u) + (v - v0) * 0.012;
      const edge = Math.min(1, Math.min(u, 1 - u) * 5 + 0.2);
      const x = xf * W.w, y = fieldY(xf, v), h = (4 + 3 * rt(i + 70)) * s * (0.6 + v) * edge;
      const sw = W.wind * 1.4 * s + Math.sin(W.t * 1.5 + i * 0.7) * 0.7 * s;
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - h * 0.6, x + sw, y - h);
    }
    ctx.stroke();
    if (g > 0.3) {
      ctx.fillStyle = css([236, 204, 120], 2, (g - 0.3) * 0.9, 0.12);
      ctx.beginPath();
      for (let i = 0; i < n; i += 2) {
        const v = lerp(v0, v1, rt(i * 2 + p.seed)), xf = lerp(x0, x1, rt(i * 2 + p.seed + 1)) + (v - v0) * 0.012;
        const x = xf * W.w, y = fieldY(xf, v), h = (4 + 3 * rt(i + 70)) * s * (0.6 + v);
        const sw = W.wind * 1.4 * s + Math.sin(W.t * 1.5 + i * 0.7) * 0.7 * s;
        ctx.moveTo(x + sw + 1.2 * s, y - h); ctx.ellipse(x + sw, y - h, 1.2 * s, 2.2 * s, 0.2, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // 吗哪：清晨地上如芫荽子的白点（出 16:31）——到吉甲吃了那地的出产，第二日就止住了（5:12）
  let MANNA = null;
  function drawManna(ctx) {
    const k = W.lv.joManna;
    if (k < 0.01) return;
    const s = LS(2), day = 0.4 + 0.6 * W.daylight;
    const key = W.w + 'x' + W.h;
    if (!MANNA || MANNA.k !== key) {
      const pts = [];
      for (let i = 0; i < 140; i++) {
        const xf = lerp(0.4, 0.78, rt(i * 3 + 1200)), v = 0.08 + 0.9 * rt(i * 3 + 1201);
        if (Math.abs(xf - riverAtV(v)) < 0.03 + 0.025 * v) continue;
        if (xf > X.city - X.cityHW * 1.3 && v < 0.2) continue;
        pts.push([xf * W.w, fieldY(xf, v), (0.5 + 0.6 * v) * s, i]);
      }
      MANNA = { k: key, pts };
    }
    ctx.fillStyle = U.rgba(248, 244, 232, 0.8 * k * day);
    ctx.beginPath();
    for (const q of MANNA.pts) { const r = q[2] * (0.8 + 0.4 * Math.sin(W.t * 2 + q[3])); ctx.moveTo(q[0] + r, q[1]); ctx.arc(q[0], q[1], r, 0, TAU); }
    ctx.fill();
  }

  // ── 艾城（中丘上）：伏兵夺了城，放火焚烧，城中烟气冲天（8:19–20）──
  function drawAi(ctx, p) {
    const l = 1, ph = PH(1), x = p.x * W.w, y = gY(1, p.x) + 1, w = ph * 1.9, A = p.a * (1 - p.ruin * 0.7);
    if (A < 0.01) return;
    ctx.globalAlpha = A;
    ctx.fillStyle = css([184, 156, 118], l);
    ctx.beginPath();
    ctx.moveTo(x - w, y); ctx.lineTo(x - w, y - ph * 0.62); ctx.lineTo(x - w * 0.62, y - ph * 0.62); ctx.lineTo(x - w * 0.62, y - ph * 0.84);
    ctx.lineTo(x - w * 0.4, y - ph * 0.84); ctx.lineTo(x - w * 0.4, y - ph * 0.62);
    ctx.lineTo(x + w * 0.3, y - ph * 0.62); ctx.lineTo(x + w * 0.3, y - ph * 0.92); ctx.lineTo(x + w * 0.56, y - ph * 0.92); ctx.lineTo(x + w * 0.56, y - ph * 0.62);
    ctx.lineTo(x + w, y - ph * 0.62); ctx.lineTo(x + w, y); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = css([146, 120, 90], l);
    ctx.beginPath(); ctx.rect(x - w * 0.2, y - ph * 1.08, w * 0.28, ph * 0.46); ctx.rect(x + w * 0.62, y - ph * 0.8, w * 0.24, ph * 0.18); ctx.fill();
    ctx.fillStyle = css([30, 22, 18], l);
    ctx.fillRect(x - w * 0.1, y - ph * 0.34, w * 0.14, ph * 0.34);
    if (nightK() > 0.1 && p.fire < 0.2) lamp(ctx, x, y - ph * 0.4, ph * 1.4, A * nightK() * 0.6, 7);
    ctx.globalAlpha = 1;
    // 城中烟气冲天（8:20）：大火与一道高高的烟柱
    if (p.fire > 0.01) {
      SP || sprites();
      const k = p.fire * A;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.ember, x, y - ph * 0.6, w * 2.4, k * (0.55 + 0.25 * nightK()));
      glowSp(ctx, SP.warm, x, y - ph * 0.9, w * 1.3, k * 0.5);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x - w * 0.55, y - ph * 0.5, ph * 0.8, k, 2); flame(ctx, x - w * 0.05, y - ph * 0.9, ph * 1.25, k, 5);
      flame(ctx, x + w * 0.42, y - ph * 0.7, ph * 1.0, k, 8); flame(ctx, x + w * 0.8, y - ph * 0.45, ph * 0.7, k, 3.3);
    }
    if (p.smoke > 0.01) {
      smoke(ctx, x, y - ph * 1.1, p.smoke * A, W.h * 0.46, ph * 0.75, 3.3, true);
      smoke(ctx, x + w * 0.3, y - ph * 0.9, p.smoke * A * 0.8, W.h * 0.36, ph * 0.55, 1.1, true);
    }
  }
  // ── 夏琐（远山）：约书亚又用火焚烧夏琐（11:11）──
  function drawHazor(ctx, p) {
    const l = 0, ph = PH(0), x = p.x * W.w, y = gY(0, p.x) + 1, w = ph * 1.8;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 132, 110], l);
    ctx.beginPath();
    ctx.moveTo(x - w, y); ctx.lineTo(x - w * 0.9, y - ph * 0.5); ctx.lineTo(x - w * 0.2, y - ph * 0.55); ctx.lineTo(x - w * 0.15, y - ph * 0.85); ctx.lineTo(x + w * 0.15, y - ph * 0.85);
    ctx.lineTo(x + w * 0.2, y - ph * 0.55); ctx.lineTo(x + w * 0.9, y - ph * 0.5); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    if (p.fire > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.ember, x, y - ph * 0.5, w * 2.4, p.fire * p.a * 0.7);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x - w * 0.4, y - ph * 0.4, ph * 0.9, p.fire * p.a, 1); flame(ctx, x + w * 0.3, y - ph * 0.5, ph * 1.1, p.fire * p.a, 4);
    }
    if (p.smoke > 0.01) smoke(ctx, x, y - ph * 0.8, p.smoke * p.a, W.h * 0.22, ph * 0.8, 1.7, true);
  }
  // ── 示罗的会幕（18:1）：细麻的院帷，院中的帐幕，其上一片柔光的云 ──
  function drawTab(ctx, p) {
    const l = 1, ph = PH(1) * p.size, x = p.x * W.w, y = gY(1, p.x) + 1, w = ph * 2.1, A = p.a * p.grow;
    if (A < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y - ph * 0.9, w * 1.9, A * (0.22 + 0.3 * nightK()) * (0.85 + 0.15 * Math.sin(W.t * 0.6)));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = A;
    // 帐幕：深色的顶（海狗皮），金的柱
    ctx.fillStyle = css([92, 70, 64], l);
    ctx.fillRect(x - w * 0.2, y - ph * 0.9, w * 0.62, ph * 0.9);
    ctx.fillStyle = css([118, 58, 64], l);
    ctx.fillRect(x - w * 0.2, y - ph * 0.9, w * 0.62, ph * 0.12);
    ctx.fillStyle = css(GOLD, l, 1, 0.1);
    for (let i = 0; i < 4; i++) ctx.fillRect(x - w * 0.2 + i * w * 0.2, y - ph * 0.78, ph * 0.05, ph * 0.78);
    // 院帷：白色细麻
    ctx.fillStyle = css([236, 232, 216], l, 1, 0.08);
    ctx.fillRect(x - w, y - ph * 0.4, w * 2, ph * 0.4);
    ctx.fillStyle = css([150, 140, 120], l, 0.8);
    for (let i = 0; i <= 10; i++) ctx.fillRect(x - w + i * w * 0.2 - ph * 0.02, y - ph * 0.44, ph * 0.04, ph * 0.44);
    // 院门
    ctx.fillStyle = css([90, 108, 160], l);
    ctx.fillRect(x - w * 0.62, y - ph * 0.4, w * 0.3, ph * 0.4);
    // 烟柱似的云（耶和华的荣光）
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const ph2 = U.fract(W.t * 0.04 + i / 5), yy = y - ph * (1.1 + ph2 * 2.6), r = w * (0.45 + ph2 * 0.35);
      glowSp(ctx, SP.white, x + w * 0.1 + Math.sin(W.t * 0.3 + i) * w * 0.1, yy, r, A * 0.1 * Math.sin(ph2 * Math.PI));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // ── 城邑（中丘、远山）：平顶的小屋一簇，夜里窗中有灯 ──
  function drawTown(ctx, p) {
    const l = p.layer, ph = PH(l) * p.size, x = p.x * W.w, y = baseOf(p) + 1, A = p.a * p.grow;
    if (A < 0.01) return;
    const n = 3 + (p.seed % 3);
    ctx.globalAlpha = A;
    ctx.fillStyle = css([196, 174, 138], l);
    ctx.beginPath();
    const W0 = [];
    for (let i = 0; i < n; i++) {
      const hx = x + (i - (n - 1) / 2) * ph * 0.42 + (rt(p.seed + i) - 0.5) * ph * 0.1, hw = ph * (0.18 + 0.1 * rt(p.seed + i + 5)), hh = ph * (0.3 + 0.28 * rt(p.seed + i + 9));
      ctx.rect(hx - hw, y - hh, hw * 2, hh);
      W0.push([hx, y - hh * 0.55]);
    }
    ctx.fill();
    ctx.fillStyle = css([130, 110, 84], l, 0.6);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const hx = x + (i - (n - 1) / 2) * ph * 0.42 + (rt(p.seed + i) - 0.5) * ph * 0.1, hw = ph * (0.18 + 0.1 * rt(p.seed + i + 5)), hh = ph * (0.3 + 0.28 * rt(p.seed + i + 9)); ctx.rect(litX() >= hx ? hx - hw : hx + hw * 0.4, y - hh, hw * 0.6, hh); }
    ctx.fill();
    const nk = nightK();
    if (nk > 0.05 || p.lit > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,184,104)';
      const ws = Math.max(0.8, ph * 0.06);
      for (let i = 0; i < W0.length; i++) { ctx.globalAlpha = A * Math.min(1, nk + p.lit) * (0.6 + 0.3 * Math.sin(W.t * 0.7 + i + p.seed)); ctx.fillRect(W0[i][0] - ws / 2, W0[i][1] - ws, ws, ws * 1.4); }
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, x, y - ph * 0.3, ph * 1.6, A * Math.min(1, nk + p.lit) * 0.7, p.seed);
    }
    ctx.globalAlpha = 1;
  }
  // ── 示剑的橡树（24:26）──
  function drawOak(ctx, p) {
    const l = 2, s = LS(l) * p.size, H = 90 * s * (0.3 + 0.7 * p.grow), x = p.x * W.w, y = baseOf(p) + 3 * s;
    if (!p.model) {
      const r = U.mulberry32(p.seed), blobs = [], br = [];
      for (let i = 0; i < 12; i++) { const a = -Math.PI * (0.08 + 0.84 * r()); blobs.push([Math.cos(a) * (0.3 + 0.25 * r()), -0.62 + Math.sin(a) * 0.3 - 0.06 * r(), 0.14 + 0.1 * r(), 0.1 + 0.07 * r()]); }
      for (let i = 0; i < 5; i++) br.push([(r() - 0.5) * 0.8, -0.72 - 0.15 * r()]);
      p.model = { blobs, br, lean: (r() - 0.5) * 0.04 };
    }
    const m = p.model, sway = W.wind * 0.01 * H + Math.sin(W.t * 0.55 + p.seed) * 0.004 * H;
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
    ctx.fillStyle = css([46, 70, 40], l);
    ctx.beginPath();
    for (const b of m.blobs) { const cx = x + b[0] * H + sway, cy = y + b[1] * H; ctx.moveTo(cx + b[2] * H, cy); ctx.ellipse(cx, cy, b[2] * H, b[3] * H, 0, 0, TAU); }
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([100, 132, 74], l, 0.5 * (0.2 + 0.8 * W.daylight), 0.1);
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
  // ── 大石头（24:26–27）：立在橡树下，作见证 ──
  function drawStele(ctx, p) {
    const l = 2, ph = PH(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2, g = easeOut(p.grow), h = ph * 1.1 * g, w = ph * 0.2;
    if (g < 0.01) return;
    SP || sprites();
    if (p.lit > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y - h * 0.5, ph * 1.1, p.lit * p.a * (0.25 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([142, 134, 122], l);
    ctx.beginPath();
    ctx.moveTo(x - w, y); ctx.lineTo(x - w * 0.86, y - h * 0.85); ctx.quadraticCurveTo(x - w * 0.2, y - h * 1.04, x + w * 0.8, y - h * 0.9); ctx.lineTo(x + w, y); ctx.closePath();
    ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([226, 218, 200], l, 0.35 * dayA() + 0.3 * p.lit, 0.2);
    ctx.beginPath(); ctx.moveTo(x + d * w * 0.2, y - h * 0.9); ctx.lineTo(x + d * w * 0.85, y - h * 0.86); ctx.lineTo(x + d * w * 0.95, y - h * 0.05); ctx.lineTo(x + d * w * 0.35, y - h * 0.05); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ── 证坛（22:10，34）：约旦河边一座高大的坛——没有凿过的整石，一层层垒起 ──
  function drawAltar(ctx, p) {
    const l = 2, ph = PH(2) * p.size, x = p.x * W.w, y = baseOf(p) + 2, rows = 5, shown = p.grow * rows;
    if (shown < 0.05) return;
    SP || sprites();
    if (p.lit > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y - ph * 0.55, ph * 1.4, p.lit * p.a * (0.25 + 0.3 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
    }
    const d = litX() >= x ? 1 : -1, stones = [];
    for (let r = 0; r < rows && r < shown; r++) {
      const k = clamp(shown - r, 0, 1), rw = ph * (0.56 - r * 0.07), rh = ph * 0.19, cy = y - r * rh * 0.9 - rh * 0.45 - (1 - k) * 6;
      const n = r < 2 ? 4 : r < 4 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const j = rt(p.seed + r * 7 + i), j2 = rt(p.seed + r * 7 + i + 40);
        const sx = x - rw + (i + 0.5) * (rw * 2) / n + (j - 0.5) * rw * 0.12;
        stones.push([sx, cy + (j2 - 0.5) * rh * 0.16, (rw / n) * (0.92 + 0.3 * j), rh * 0.52 * k * (0.8 + 0.4 * j2), (j - 0.5) * 0.5]);
      }
    }
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([118, 110, 98], l);
    ctx.beginPath();
    for (const q of stones) { ctx.moveTo(q[0] + q[2], q[1]); ctx.ellipse(q[0], q[1], q[2], q[3], q[4], 0, TAU); }
    ctx.fill();
    // 石缝的阴影与迎光的石面
    ctx.fillStyle = css([80, 72, 64], l, 0.45);
    ctx.beginPath();
    for (const q of stones) { ctx.moveTo(q[0] - d * q[2] * 0.2 + q[2] * 0.8, q[1] + q[3] * 0.35); ctx.ellipse(q[0] - d * q[2] * 0.2, q[1] + q[3] * 0.35, q[2] * 0.8, q[3] * 0.5, q[4], 0, Math.PI); }
    ctx.fill();
    ctx.fillStyle = css([214, 204, 186], l, (0.16 + 0.14 * p.lit) * dayA() + 0.1 * p.lit, 0.15);
    ctx.beginPath();
    for (const q of stones) { ctx.moveTo(q[0] + d * q[2] * 0.3 + q[2] * 0.45, q[1] - q[3] * 0.4); ctx.ellipse(q[0] + d * q[2] * 0.3, q[1] - q[3] * 0.4, q[2] * 0.45, q[3] * 0.32, q[4], 0, TAU); }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // ── 约瑟的棺材（创 50:26）——从埃及带上来，葬在示剑（24:32）──
  function drawCoffin(ctx, p) {
    const l = 2, s = LS(l) * p.size, x = p.x * W.w, y0 = baseOf(p) + 2.5 * s, L = 30 * s;
    const bury = p.bury, lift = p.grow;          // grow：抬着（离地）
    SP || sprites();
    const y = y0 - lift * PH(2) * 0.66 + bury * 7 * s;
    ctx.save();
    if (bury > 0.01) { ctx.beginPath(); ctx.rect(x - L, y0 - PH(2) * 2, L * 2, PH(2) * 2 - 1); ctx.clip(); }
    ctx.globalAlpha = p.a * (1 - bury);
    const b = y - 1.5 * s;
    const pts = [[-0.5, 0], [-0.52, -3.2], [-0.4, -4.4], [-0.1, -4.0], [0.16, -4.8], [0.3, -5.2], [0.38, -6.6], [0.48, -6.8], [0.54, -5.2], [0.53, 0]];
    ctx.fillStyle = css([150, 108, 58], l, 1, 0.04);
    ctx.beginPath(); pts.forEach((q, i) => { const X1 = x + q[0] * L, Y1 = b + q[1] * s; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([236, 194, 96], l, 1, 0.16);
    for (const q of [-0.36, -0.2, -0.04, 0.12]) ctx.fillRect(x + q * L - 0.55 * s, b - 4.3 * s, 1.1 * s, 4.3 * s);
    ctx.fillStyle = css([64, 98, 160], l, 0.95, 0.05);
    ctx.fillRect(x + 0.24 * L, b - 5 * s, 0.08 * L, 5 * s);
    ctx.fillStyle = css([246, 206, 112], l, 1, 0.22);
    ctx.beginPath(); ctx.ellipse(x + 0.44 * L, b - 4 * s, 0.1 * L, 3.1 * s, 0, 0, TAU); ctx.fill();
    ctx.restore();
    if (p.lit > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y0 - 4 * s, L * 1.6, p.lit * p.a * (0.3 + 0.35 * nightK()));
      ctx.globalAlpha = p.lit * p.a * 0.35;
      ctx.drawImage(SP.beam, x - L * 0.7, y0 - Math.min(W.h * 0.4, L * 8), L * 1.4, Math.min(W.h * 0.4, L * 8));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 坟（葬后：一小片新土）
    if (bury > 0.3) {
      ctx.globalAlpha = p.a * (bury - 0.3) / 0.7;
      ctx.fillStyle = css([110, 90, 64], l);
      ctx.beginPath(); ctx.ellipse(x, y0, L * 0.62, 2.6 * s, 0, Math.PI, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ── 支派的地业：地上一片柔光与名字（13–19 章）───────────────
  const LOTS = {
    reuben: ['吕便', 2, 0.43, 0.62, [236, 150, 130]],
    gad: ['迦得', 2, 0.465, 0.34, [226, 196, 128]],
    manE: ['玛拿西', 2, 0.532, 0.06, [170, 206, 150]],
    judah: ['犹大', 2, 0.905, 0.5, [240, 206, 120]],
    simeon: ['西缅', 2, 0.966, 0.8, [226, 176, 150]],
    benjamin: ['便雅悯', 2, 0.7, 0.86, [200, 214, 240]],
    dan: ['但', 2, 0.845, 0.95, [190, 170, 224]],
    ephraim: ['以法莲', 1, 0.628, 0, [168, 220, 170]],
    manW: ['玛拿西', 1, 0.735, 0, [170, 206, 150]],
    issachar: ['以萨迦', 1, 0.85, 0, [210, 200, 150]],
    zebulun: ['西布伦', 1, 0.945, 0, [150, 200, 214]],
    asher: ['亚设', 0, 0.68, 0, [226, 214, 170]],
    naphtali: ['拿弗他利', 0, 0.84, 0, [196, 220, 190]],
  };
  function lotXY(p) { return p.layer === 2 ? [p.x * W.w, fieldY(p.x, p.v)] : [p.x * W.w, gY(p.layer, p.x)]; }
  function drawLot(ctx, p) {
    const k = p.a * p.grow;
    if (k < 0.01) return;
    SP || sprites();
    const [x, y] = lotXY(p), ph = PH(p.layer), rgb = p.rgb || [255, 230, 180];
    const r = ph * (p.layer === 2 ? 2.2 : 2.6), dim = S.lotDim ? 0.5 : 1;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * dim * (0.28 + 0.22 * nightK() + 0.3 * p.lit) * (0.85 + 0.15 * Math.sin(W.t * 0.8 + p.seed));
    const sp = p._sp || (p._sp = radial(rgb, 1));
    ctx.drawImage(sp, x - r, y - r * 0.28, r * 2, r * 0.56);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawLotName(ctx, p) {
    const k = p.a * p.grow;
    if (k < 0.02) return;
    const [x, y] = lotXY(p), ph = PH(p.layer);
    const far = p.layer === 0;
    const px = Math.round(clamp((p.layer === 2 ? 15 : p.layer === 1 ? 13.5 : 13.5) * (phone() ? 0.8 : 1) * Math.max(0.85, Math.min(1.2, W.unit)), far ? 13 : 10, 19));
    const t = textSprite(p.name, px, U.mixRGB(p.rgb || [255, 230, 180], [255, 248, 232], 0.45), far);
    const lift = p.layer === 2 ? ph * 0.25 + px * 0.6 : ph * 0.9 + px * 0.5;
    // 刚拈出时亮约六秒，然后退为淡淡的一层（按住时仍可看见经文）
    const fresh = smoothstep(0, 0.3, tv('lotf_' + p.id, 0));
    const base = S.lotDim ? 0.3 : 0.45;
    ctx.globalAlpha = k * (base + (0.95 - base) * fresh);
    ctx.drawImage(t.c, x - t.w / 2, y - lift - t.h / 2, t.w, t.h);
    ctx.globalAlpha = 1;
  }
  // 逃城：六盏安稳的灯（20:7–8）
  function drawRefuge(ctx, p) {
    const k = p.a * p.grow;
    if (k < 0.01) return;
    SP || sprites();
    const [x, y0] = lotXY(p), ph = PH(p.layer), y = y0 - ph * 0.35;
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.85 + 0.15 * Math.sin(W.t * 0.9 + p.seed);
    glowSp(ctx, SP.warm, x, y, ph * 1.15, k * (0.4 + 0.4 * nightK()) * br);
    glowSp(ctx, SP.gold, x, y, ph * 0.5, k * 0.9 * br);
    ctx.strokeStyle = U.rgba(255, 226, 170, k * 0.3 * br);
    ctx.lineWidth = Math.max(0.6, ph * 0.025);
    ctx.beginPath(); ctx.ellipse(x, y0, ph * 0.6, ph * 0.12, 0, 0, TAU); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 利未人的四十八座城：散在全地的小灯（21:41）
  let LEVI = null;
  function leviPts() {
    if (LEVI && LEVI.k === W.w + 'x' + W.h) return LEVI.pts;
    const pts = [];
    for (let i = 0; i < 48; i++) {
      const r1 = rt(i * 5 + 1500), r2 = rt(i * 5 + 1501), l = r1 < 0.3 ? 0 : r1 < 0.72 ? 1 : 2;
      const xf = l === 0 ? lerp(0.4, 0.99, r2) : l === 1 ? lerp(0.53, 0.99, r2) : lerp(0.4, 0.99, r2);
      if (l === 2 && Math.abs(xf - X.jT) < 0.04) continue;
      pts.push([l, xf, l === 2 ? rt(i * 5 + 1502) * 0.25 : 0, rt(i * 5 + 1503) * 6]);
    }
    LEVI = { k: W.w + 'x' + W.h, pts };
    return pts;
  }
  function drawLevi(ctx, l) {
    const k = W.lv.joLevi;
    if (k < 0.01) return;
    SP || sprites();
    const nk = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of leviPts()) {
      if (q[0] !== l) continue;
      const x = q[1] * W.w, y = (l === 2 ? fieldY(q[1], q[2]) : gY(l, q[1])) - PH(l) * 0.2, r = PH(l) * 0.55;
      glowSp(ctx, SP.warm, x, y, r, k * nk * (0.55 + 0.25 * Math.sin(W.t * 1.3 + q[3])));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 葡萄园与橄榄园（24:13）：一行行的橄榄树与葡萄架，在山坡上长出来
  let GROVE = null;
  function grovePts() {
    if (GROVE && GROVE.k === W.w + 'x' + W.h) return GROVE.pts;
    const pts = [];
    // 中丘：橄榄树成行
    for (let i = 0; i < 26; i++) pts.push([1, lerp(0.555, 0.985, (i + 0.5) / 26) + (rt(i + 1700) - 0.5) * 0.008, 0, 'olive', rt(i + 1720)]);
    // 远山：更小的橄榄树与葡萄园
    for (let i = 0; i < 30; i++) pts.push([0, lerp(0.5, 0.99, (i + 0.5) / 30) + (rt(i + 1760) - 0.5) * 0.01, 0, i % 3 ? 'olive' : 'vine', rt(i + 1790)]);
    // 近地的右边：葡萄园（一行行的架）
    for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) pts.push([2, 0.8 + i * 0.022 + r * 0.006, 0.12 + r * 0.16, 'vine', rt(r * 9 + i + 1830)]);
    GROVE = { k: W.w + 'x' + W.h, pts };
    return pts;
  }
  function drawGroves(ctx, l) {
    const k = W.lv.joGroves;
    if (k < 0.01) return;
    const ph = PH(l), s = LS(l);
    ctx.fillStyle = css([92, 112, 80], l);
    ctx.strokeStyle = css([70, 56, 40], l);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    const olive = [], vine = [];
    for (const q of grovePts()) {
      if (q[0] !== l) continue;
      const g = clamp((k * 1.5 - q[4] * 0.5), 0, 1);
      if (g < 0.02) continue;
      (q[3] === 'olive' ? olive : vine).push([q[1] * W.w, l === 2 ? fieldY(q[1], q[2]) : gY(l, q[1]), g]);
    }
    // 树干
    ctx.beginPath();
    for (const o of olive) { ctx.moveTo(o[0], o[1]); ctx.lineTo(o[0], o[1] - ph * 0.3 * o[2]); }
    ctx.stroke();
    // 橄榄树的冠：灰绿的圆
    ctx.beginPath();
    for (const o of olive) { const r = ph * 0.22 * o[2]; ctx.moveTo(o[0] + r * 1.2, o[1] - ph * 0.36 * o[2]); ctx.ellipse(o[0], o[1] - ph * 0.36 * o[2], r * 1.2, r, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css([150, 170, 130], l, 0.45 * dayA(), 0.1);
    ctx.beginPath();
    for (const o of olive) { const r = ph * 0.12 * o[2], d = litX() >= o[0] ? 1 : -1; ctx.moveTo(o[0] + d * r * 0.6 + r, o[1] - ph * 0.42 * o[2]); ctx.ellipse(o[0] + d * r * 0.6, o[1] - ph * 0.42 * o[2], r, r * 0.6, 0, 0, TAU); }
    ctx.fill();
    // 葡萄架：短桩与一抹绿
    ctx.strokeStyle = css([96, 74, 52], l);
    ctx.beginPath();
    for (const o of vine) { ctx.moveTo(o[0], o[1]); ctx.lineTo(o[0], o[1] - ph * 0.22 * o[2]); }
    ctx.stroke();
    ctx.fillStyle = css([80, 118, 60], l);
    ctx.beginPath();
    for (const o of vine) { const r = ph * 0.13 * o[2]; ctx.moveTo(o[0] + r * 1.4, o[1] - ph * 0.2 * o[2]); ctx.ellipse(o[0], o[1] - ph * 0.2 * o[2], r * 1.4, r * 0.8, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css([110, 50, 90], l, 0.8);
    ctx.beginPath();
    for (const o of vine) { if (o[2] < 0.7) continue; const r = ph * 0.035; ctx.moveTo(o[0] + r, o[1] - ph * 0.14); ctx.arc(o[0], o[1] - ph * 0.14, r, 0, TAU); }
    ctx.fill();
  }

  // ════════════════════════════════════════════════════════════
  //  绕城：祭司、约柜、带兵器的与后队，沿着城外的一圈（前一半看得见，后一半在城后）
  // ════════════════════════════════════════════════════════════
  const MARCH = [
    ['mA1', '带兵器的', 'arm'], ['mA2', '带兵器的', 'arm'], ['mA3', '带兵器的', 'arm'], ['mA4', '带兵器的', 'arm'],
    ['mH1', '吹角的祭司', 'horn'], ['mH2', '吹角的祭司', 'horn'], ['mH3', '吹角的祭司', 'horn'], ['mH4', '吹角的祭司', 'horn'],
    ['mH5', '吹角的祭司', 'horn'], ['mH6', '吹角的祭司', 'horn'], ['mH7', '吹角的祭司', 'horn'],
    ['p1', '抬约柜的祭司', 'bear'], ['p2', '抬约柜的祭司', 'bear'], ['p3', '抬约柜的祭司', 'bear'], ['p4', '抬约柜的祭司', 'bear'],
    ['mR1', '后队', 'rear'], ['mR2', '后队', 'rear'], ['mR3', '后队', 'rear'],
  ];
  const HORNS = MARCH.filter(m => m[2] === 'horn').map(m => m[0]);
  // 每人在队伍中的位置（以圈计的落后量）与纵深的微差
  const MOFF = { mA1: 0, mA2: 1, mA3: 2, mA4: 3, mH1: 4.3, mH2: 5.3, mH3: 6.3, mH4: 7.3, mH5: 8.3, mH6: 9.3, mH7: 10.3, p1: 11.6, p2: 11.6, p3: 12.9, p4: 12.9, mR1: 14.3, mR2: 15.3, mR3: 16.3 };
  const MDV = { p2: 0.05, p4: 0.05 };
  const DS = 0.021;
  function ellG() {
    const ph = PH(2);
    return { cx: X.city * W.w, rx: (X.cityHW + 0.028) * W.w + ph * 0.2, vc: 0.2, vr: 0.3 };
  }
  // 圈上的一点：s 以圈计（0 = 左端，0.25 = 正前方，0.5 = 右端，0.75 = 城后）
  function ellPt(s, dv) {
    const E = ellG(), th = Math.PI - s * TAU, sn = Math.sin(th);
    const x = E.cx + E.rx * Math.cos(th), v = E.vc + E.vr * sn + (dv || 0);
    const xf = x / W.w, g = gY(2, xf);
    const y = v >= 0 ? g + v * Math.max(0, W.h - g) * 0.8 : g + v * 30 * LS(2);
    return { x, y, v, sn, dir: Math.cos(th) > 0 ? -Math.sign(Math.sin(th)) || 1 : Math.sign(sn) || 1 };
  }
  const marchHead = () => tv('march', S.marchS || 0);
  function marcherPos(id) {
    const s = marchHead() - MOFF[id] * DS;
    return ellPt(s, MDV[id] || 0);
  }
  function marchAttach(id) {
    attach(id, () => {
      const f = fig(id), q = marcherPos(id);
      if (f) {
        f.v = Math.max(0, q.v);
        f.facing = q.sn >= 0 ? 1 : -1;
        f.targetAlpha = q.sn > -0.08 ? 1 : 0;
      }
      return [q.x, q.y];
    });
  }
  // 第七日，第七次绕完：队伍分站在城的两侧（城墙两端之外），面向城，谁也不挡住城墙
  //   [哪一侧, 离圈端的距离（人高为单位，正 = 向外）, 纵深 v]
  const FLANK = {
    mA1: [1, 0.55, 0.04], mA2: [1, 0.2, 0.09], mA3: [1, 0.6, 0.15], mA4: [1, 0.15, 0.21], mH1: [1, 0.5, 0.27], mH2: [1, 0.05, 0.32], mH3: [1, 0.45, 0.38], mH4: [1, 0.0, 0.44],
    mH5: [-1, 0.0, 0.08], mH6: [-1, 0.45, 0.14], mH7: [-1, 0.05, 0.21], p1: [-1, -0.22, 0.3], p2: [-1, -0.22, 0.36], p3: [-1, 0.36, 0.3], p4: [-1, 0.36, 0.36],
    mR1: [-1, 0.62, 0.43], mR2: [-1, 0.2, 0.5], mR3: [-1, 0.78, 0.56],
  };
  function marchFlank() {
    const E = ellG(), ph = PH(2);
    for (const m of MARCH) {
      const id = m[0], f = fig(id), q = FLANK[id];
      if (!f || !q) continue;
      attach(id, null);
      f.v = q[2];
      f.targetAlpha = 1;
      place(id, (E.cx + q[0] * (E.rx + q[1] * ph)) / W.w);
      face(id, -q[0]);
    }
  }
  function addMarchers(b, withHorns) {
    const from = b.instant ? 'none' : 'fade';
    for (const m of MARCH) {
      const [id, label, role] = m;
      const robe = role === 'arm' ? ROBE.arm : role === 'rear' ? ROBE.rear : ROBE.priest;
      add(id, { label, sex: 'm', age: 'adult', x: X.outside, facing: 1, robe, glow: role === 'arm' || role === 'rear' ? 0.08 : 0.2, from,
        prop: role === 'arm' ? 'staff' : null, accent: role === 'horn' || role === 'bear' ? [214, 200, 170] : null, scale: role === 'arm' ? 1.02 : 0.98, pose: 'walk' });
    }
    S.horns = !!withHorns;
    S.ark = 'carry';
  }
  function rmMarchers(now) { for (const m of MARCH) rm(m[0], now); S.horns = false; }

  // ════════════════════════════════════════════════════════════
  //  画：各层的物件、天上的事、空中的光
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'tent': drawTent(ctx, p); break;
      case 'city': drawCity(ctx, p); break;
      case 'palm': drawPalm(ctx, p); break;
      case 'stones': drawStones(ctx, p); break;
      case 'cairn': if (p.name !== 'river') drawCairn(ctx, p); break;
      case 'glint': drawGlint(ctx, p); break;
      case 'field': drawField(ctx, p); break;
      case 'ai': drawAi(ctx, p); break;
      case 'hazor': drawHazor(ctx, p); break;
      case 'tab': drawTab(ctx, p); break;
      case 'town': drawTown(ctx, p); break;
      case 'oak': drawOak(ctx, p); break;
      case 'stele': drawStele(ctx, p); break;
      case 'altar': drawAltar(ctx, p); break;
      case 'lot': drawLot(ctx, p); break;
      case 'refuge': drawRefuge(ctx, p); break;
      case 'pfire': drawPFire(ctx, p); break;
    }
  }
  // 应许之地上的金光（1:3–4）
  function drawPromise(ctx) {
    const k = W.lv.joPromise;
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const y = W.horizonY + 0.08 * W.h;
    glowSp(ctx, SP.gold, 0.8 * W.w, y, 0.42 * W.w, k * 0.42);
    glowSp(ctx, SP.gold, 0.88 * W.w, W.horizonY + 0.02 * W.h, 0.3 * W.w, k * 0.36);
    ctx.fillStyle = U.rgba(255, 226, 160, 0.9);
    for (let i = 0; i < 70; i++) {
      const xf = lerp(0.62, 0.99, rt(i * 3 + 2000)), l = rt(i * 3 + 2001) < 0.5 ? 1 : 0, y2 = gY(l, xf) - rt(i * 3 + 2002) * 8;
      ctx.globalAlpha = k * 0.75 * (0.5 + 0.5 * Math.sin(W.t * (0.8 + rt(i) * 1.5) + i));
      ctx.fillRect(xf * W.w, y2, 2 * SU(), 2 * SU());
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 自天而降的一道光，落在约书亚身上
  function drawBeam(ctx) {
    const k = W.lv.joBeam;
    if (k < 0.01) return;
    const p = figPt('joshua', 0);
    if (!p) return;
    SP || sprites();
    const ph = PH(2), bw = ph * 1.6, bh = Math.min(p[1], W.h * 0.7);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * (0.35 + 0.25 * nightK());
    ctx.drawImage(SP.beam, p[0] - bw / 2, p[1] - bh, bw, bh);
    glowSp(ctx, SP.gold, p[0], p[1] - ph * 0.5, ph * 1.3, k * 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 圣地（5:15）：约书亚与元帅脚下的一圈金光
  function drawHoly(ctx) {
    const k = W.lv.joHoly;
    const p = figPt('joshua', 0), q = figPt('commander', 0), cf = fig('commander');
    SP || sprites();
    // 元帅身上的光落在地上（也照见俯伏的约书亚）
    if (q && cf && cf.alpha > 0.02) {
      const ph = PH(2), tx = p ? (p[0] + q[0]) / 2 : q[0];
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = cf.alpha * (0.35 + 0.4 * nightK());
      ctx.drawImage(SP.white, tx - ph * 2, q[1] - ph * 0.32, ph * 4, ph * 0.64);
      ctx.globalAlpha = cf.alpha * (0.25 + 0.3 * nightK());
      ctx.drawImage(SP.gold, q[0] - ph * 1.1, q[1] - ph * 1.6, ph * 2.2, ph * 2.2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    if (k < 0.01 || !p) return;
    const x = q ? (p[0] + q[0]) / 2 : p[0], y = p[1], ph = PH(2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.5;
    const sp = SP.gold;
    ctx.drawImage(sp, x - ph * 2.2, y - ph * 0.35, ph * 4.4, ph * 0.7);
    ctx.strokeStyle = U.rgba(255, 228, 170, 0.45 * k);
    ctx.lineWidth = Math.max(0.8, ph * 0.03);
    for (let i = 0; i < 2; i++) {
      const r = ph * (1.3 + 0.35 * i + 0.08 * Math.sin(W.t * 1.2 + i));
      ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.16, 0, 0, TAU); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 绕城的圈（前一半，在城之后、人之前画）与一日一圈的光（时光飞逝）
  function drawRings(ctx) {
    const r6 = W.lv.joRings, r7 = W.lv.joRings7;
    const cm = tweening('comet') ? tv('comet', 0) : -1;
    if (r6 < 0.01 && r7 < 0.01 && cm < 0) return;
    const ph = PH(2);
    const arc = (dv, dr, col, a, w) => {
      if (a < 0.01) return;
      ctx.strokeStyle = U.rgba(col[0], col[1], col[2], a);
      ctx.lineWidth = w;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const s = lerp(-0.02, 0.52, i / 40), q = ellPt(s, dv), x = q.x + (q.x - ellG().cx) * dr;
        if (i) ctx.lineTo(x, q.y); else ctx.moveTo(x, q.y);
      }
      ctx.stroke();
    };
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) arc(0.16 + i * 0.035, i * 0.012, [214, 226, 255], clamp(r6 - i, 0, 1) * (0.22 + 0.1 * nightK()), Math.max(0.8, ph * 0.025));
    for (let i = 0; i < 7; i++) arc(0.14 + i * 0.03, i * 0.012, [255, 214, 140], clamp(r7 - i, 0, 1) * (i === 6 ? 0.5 : 0.28), Math.max(0.8, ph * (i === 6 ? 0.04 : 0.028)));
    // 一日一圈的光：领头的一点金光（约柜）与一串微光（队伍）
    if (cm >= 0) {
      SP || sprites();
      const s0 = U.fract(cm);
      for (let j = 0; j < 14; j++) {
        const q = ellPt(s0 - j * 0.012, 0.2);
        if (q.sn < -0.1) continue;
        const a = (1 - j / 14) * clamp((q.sn + 0.1) * 4, 0, 1);
        glowSp(ctx, j === 6 ? SP.gold : SP.pale, q.x, q.y - ph * 0.4, ph * (j === 6 ? 0.9 : 0.4), a * 0.8);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 空中：角、刀、枪、石、绳（画在人之后）
  function drawHorns(ctx) {
    if (!S.horns) return;
    const blow = W.lv.joHorn;
    for (const id of HORNS) {
      const f = fig(id);
      if (!f || !f._vis || f.alpha < 0.05) continue;
      const h = f._h, d = f.fd >= 0 ? 1 : -1, x = f._x, y = f._y;
      const mx = x + 0.07 * h * d, my = y - 0.85 * h, bx = x + 0.36 * h * d, by = y - (0.98 + 0.1 * blow) * h;
      ctx.globalAlpha = f.alpha;
      ctx.strokeStyle = css([226, 204, 156], 2, 1, 0.1);
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1, 0.035 * h);
      ctx.beginPath(); ctx.moveTo(mx, my); ctx.quadraticCurveTo(x + 0.24 * h * d, my + 0.02 * h, bx, by); ctx.stroke();
      ctx.lineWidth = Math.max(1.2, 0.06 * h);
      ctx.beginPath(); ctx.moveTo(lerp(mx, bx, 0.6), lerp(my, by, 0.55)); ctx.quadraticCurveTo(x + 0.3 * h * d, my - 0.04 * h, bx, by); ctx.stroke();
      if (blow > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        for (let k = 0; k < 3; k++) {
          const ph2 = U.fract(W.t * 0.9 + k / 3 + id.length * 0.1), r = h * (0.15 + ph2 * 0.9);
          ctx.strokeStyle = U.rgba(255, 234, 190, blow * 0.45 * (1 - ph2) * f.alpha);
          ctx.lineWidth = Math.max(0.6, 0.02 * h);
          ctx.beginPath(); ctx.arc(bx, by, r, d > 0 ? -1.1 : Math.PI - 0.4, d > 0 ? 0.4 : Math.PI + 1.1); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawSword(ctx) {
    if (!S.sword) return;
    const f = fig('commander');
    if (!f || !f._vis) return;
    SP || sprites();
    const h = f._h, d = f.fd >= 0 ? 1 : -1, hx = f._x + 0.2 * h * d, hy = f._y - 0.62 * h, tx = hx + 0.06 * h * d, ty = hy - 0.78 * h;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.white, (hx + tx) / 2, (hy + ty) / 2, h * 0.6, f.alpha * (0.35 + 0.3 * nightK()));
    ctx.globalAlpha = f.alpha;
    ctx.strokeStyle = 'rgb(255,246,222)';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 0.045 * h);
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.lineWidth = Math.max(1, 0.03 * h);
    ctx.beginPath(); ctx.moveTo(hx - 0.09 * h, hy - 0.02 * h); ctx.lineTo(hx + 0.09 * h, hy + 0.02 * h); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawSpear(ctx) {
    if (!S.spear) return;
    const f = fig('joshua');
    if (!f || !f._vis) return;
    SP || sprites();
    // 短枪：长长的一杆，举向艾城（8:18）
    const h = f._h, d = f.fd >= 0 ? 1 : -1, hx = f._x + 0.3 * h * d, hy = f._y - 0.8 * h;
    const bx = hx - 0.42 * h * d, by = hy + 0.26 * h, tx = hx + 0.62 * h * d, ty = hy - 0.42 * h;
    ctx.globalAlpha = f.alpha;
    ctx.strokeStyle = css([126, 96, 62], 2, 1, 0.15);
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.2, 0.036 * h);
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = css([236, 232, 222], 2, 1, 0.4);
    const ux = (tx - bx), uy = (ty - by), L = Math.hypot(ux, uy) || 1, nx = -uy / L, ny = ux / L;
    ctx.beginPath(); ctx.moveTo(tx + ux / L * 0.14 * h, ty + uy / L * 0.14 * h); ctx.lineTo(tx + nx * 0.04 * h, ty + ny * 0.04 * h); ctx.lineTo(tx - nx * 0.04 * h, ty - ny * 0.04 * h); ctx.closePath(); ctx.fill();
    const px = tx + ux / L * 0.07 * h, py = ty + uy / L * 0.07 * h;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, px, py, h * 0.45, f.alpha * (0.5 + 0.2 * Math.sin(W.t * 3)));
    // 一道细细的金光自枪尖划向艾城
    const ai = getP('ai');
    if (ai && ai.a > 0.1) {
      const ax = ai.x * W.w, ay = gY(1, ai.x) - PH(1) * 0.6, cxq = (px + ax) / 2, cyq = Math.min(py, ay) - Math.abs(px - ax) * 0.35;
      ctx.strokeStyle = U.rgba(255, 224, 150, 0.22 * f.alpha);
      ctx.lineWidth = Math.max(0.6, 0.012 * h);
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(cxq, cyq, ax, ay); ctx.stroke();
      ctx.setLineDash([]);
      for (let j = 0; j < 3; j++) {
        const t = U.fract(W.t * 0.45 + j / 3), gx = qb(px, cxq, ax, t), gy = qb(py, cyq, ay, t);
        glowSp(ctx, SP.gold, gx, gy, h * (0.22 - 0.08 * t), f.alpha * Math.sin(t * Math.PI) * 0.85);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawCarried(ctx) {
    if (!S.carry12) return;
    const ms = members('twelve');
    ctx.fillStyle = css([150, 142, 130], 2);
    ctx.beginPath();
    for (const m of ms) {
      if (!m._vis || m.alpha < 0.2) continue;
      const h = m._h, d = m.fd >= 0 ? 1 : -1, x = m._x - 0.04 * h * d, y = m._y - 0.86 * h, r = 0.12 * h;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.78, 0.2, 0, TAU);
    }
    ctx.fill();
  }
  function drawRope(ctx) {
    if (!S.rope) return;
    const c = getP('jericho');
    if (!c) return;
    const R = rahabWin(c);
    ctx.strokeStyle = css([170, 150, 120], 2, 0.9);
    ctx.lineWidth = Math.max(0.8, 0.9 * LS(2));
    ctx.beginPath();
    for (const id of ['spy1', 'spy2']) {
      const f = fig(id);
      if (!f || !f._vis || f.ny == null) continue;
      ctx.moveTo(R.x, R.y); ctx.lineTo(f._x, f._y - f._h * 1.02);
    }
    ctx.stroke();
  }
  // 日头停留，月亮止住（10:12–13）：日头在天当中，柔和的光芒一动不动，只有光晕缓缓呼吸
  let RAY = null;
  function raySprite() {
    if (RAY) return RAY;
    const c = cnv(48, 256), g = c.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 48, 0);
    hz.addColorStop(0, 'rgba(255,240,200,0)'); hz.addColorStop(0.5, 'rgba(255,244,214,1)'); hz.addColorStop(1, 'rgba(255,240,200,0)');
    g.fillStyle = hz;
    g.beginPath(); g.moveTo(22, 256); g.lineTo(0, 0); g.lineTo(48, 0); g.lineTo(26, 256); g.closePath(); g.fill();
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.55, 'rgba(0,0,0,0.55)'); vt.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = vt; g.fillRect(0, 0, 48, 256);
    RAY = c;
    return c;
  }
  function drawStill(ctx) {
    const ks = W.lv.joSun, km = W.lv.joMoon;
    if (ks < 0.01 && km < 0.01) return;
    SP || sprites();
    const R = M();
    ctx.globalCompositeOperation = 'lighter';
    if (ks > 0.01) {
      const x = W.sun.x, y = W.sun.y, br = 1 + 0.05 * Math.sin(W.t * 0.45);
      glowSp(ctx, SP.gold, x, y, R * 0.36 * br, ks * 0.42);
      glowSp(ctx, SP.white, x, y, R * 0.12 * br, ks * 0.35);
      const rs = raySprite();
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * TAU + 0.11 + (rt(i + 4100) - 0.5) * 0.12, len = R * (0.2 + 0.16 * rt(i + 4120)), wid = R * (0.022 + 0.018 * rt(i + 4140));
        ctx.save();
        ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
        ctx.globalAlpha = ks * (0.2 + 0.1 * rt(i + 4160)) * (0.85 + 0.15 * Math.sin(W.t * 0.3 + i * 1.3));
        ctx.drawImage(rs, -wid / 2, -len - R * 0.05, wid, len);
        ctx.restore();
      }
    }
    if (km > 0.01) {
      const x = 0.87 * W.w, y = W.horizonY - 0.3 * W.h * (W.w < W.h ? 0.55 : 1);
      glowSp(ctx, SP.silver, x, y, R * 0.14, km * 0.45);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = km * 0.92;
      ctx.fillStyle = 'rgb(236,240,250)';
      const r = R * 0.022;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(190,200,222,0.5)';
      ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.3, 0, TAU); ctx.arc(x + r * 0.35, y + r * 0.3, r * 0.2, 0, TAU); ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.silver, x, y, r * 4 * (1 + 0.05 * Math.sin(W.t * 0.4 + 1)), km * 0.3);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 大冰雹落在远山上的敌军（10:11）：一片灰白的斜线与地上的白点
  function drawHail(ctx) {
    const k = W.lv.joHail;
    if (k < 0.01) return;
    const n = Math.round(90 * (W.quality || 1) * k), sp = 0.9;
    ctx.strokeStyle = U.rgba(232, 238, 248, 0.6 * k);
    ctx.lineWidth = Math.max(1, 1.2 * SU());
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const xf = lerp(0.62, 1.0, rt(i * 3 + 2400)), ph = U.fract(W.t * sp * (0.8 + 0.4 * rt(i * 3 + 2401)) + rt(i * 3 + 2402));
      const g = gY(0, xf), y = lerp(0.28 * W.h, g, ph), x = xf * W.w - (1 - ph) * 0.03 * W.w;
      ctx.moveTo(x, y); ctx.lineTo(x - 2 * SU(), y - 7 * SU());
    }
    ctx.stroke();
  }
  // 北方诸王的众军，多如海边的沙（11:4）：一排排拿枪的人、马与车的剪影，预绘成一条（每次改尺寸时重绘）
  const HOSTB = { key: '', c: null, x0: 0, y0: 0, w: 0, h: 0, glints: [] };
  function hostSpan(l) { return l === 1 ? [0.665, 0.985] : [0.56, 0.995]; }
  function hostY(l, xf, v) { const g = gY(l, xf); return l === 1 ? g + v * Math.max(0, W.waterlineY(1) - g) * 0.8 : g + 0.5; }
  function bakeHost(l) {
    const [xa, xb] = hostSpan(l), ph = PH(l) * (l === 1 ? 0.82 : 0.75), s = ph / 30;
    const key = [W.w, W.h, W.dpr, l, lightKey({ cx: 0 })].join('|');
    if (HOSTB.key === key && HOSTB.c) return HOSTB;
    const r = U.mulberry32(9131 + l), items = [];
    const n = Math.round((l === 1 ? 64 : 110) * (phone() ? 0.6 : 1));
    for (let i = 0; i < n; i++) {
      const xf = lerp(xa, xb, (i + r()) / n), v = l === 1 ? 0.05 + 0.6 * r() : 0, kind = r();
      items.push({ xf, v, t: kind < 0.1 ? 'chariot' : kind < 0.22 ? 'horse' : 'man', sc: 0.85 + 0.3 * r(), f: r() < 0.5 ? -1 : 1, sp: r() < 0.8, sh: r() < 0.35 });
    }
    items.sort((a, b) => a.v - b.v);
    let y0 = 1e9, y1 = -1e9;
    for (const q of items) { const y = hostY(l, q.xf, q.v); y0 = Math.min(y0, y - ph * 1.5); y1 = Math.max(y1, y + 2); }
    const x0 = Math.floor(xa * W.w - ph * 2), x1 = Math.ceil(xb * W.w + ph * 2);
    y0 = Math.floor(y0); y1 = Math.ceil(y1);
    const dpr = Math.min(2, W.dpr || 1), w = x1 - x0, h = y1 - y0;
    try {
      if (!HOSTB.c) HOSTB.c = document.createElement('canvas');
      HOSTB.c.width = Math.max(4, Math.ceil(w * dpr)); HOSTB.c.height = Math.max(4, Math.ceil(h * dpr));
      const g = HOSTB.c.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
      const body = css([54, 44, 40], l), glints = [];
      g.fillStyle = body; g.strokeStyle = body; g.lineCap = 'round';
      for (const q of items) {
        const x = q.xf * W.w, y = hostY(l, q.xf, q.v), k = ph * q.sc * (1 + 0.25 * q.v), d = q.f;
        g.beginPath();
        if (q.t === 'man') {
          g.moveTo(x - k * 0.13, y); g.lineTo(x - k * 0.08, y - k * 0.62); g.lineTo(x + k * 0.08, y - k * 0.62); g.lineTo(x + k * 0.13, y); g.closePath();
          g.moveTo(x + k * 0.08, y - k * 0.78); g.arc(x, y - k * 0.78, k * 0.085, 0, TAU);
          g.fill();
          if (q.sh) { g.beginPath(); g.ellipse(x + d * k * 0.12, y - k * 0.42, k * 0.08, k * 0.14, 0, 0, TAU); g.fill(); }
          if (q.sp) { g.lineWidth = Math.max(0.6, 0.9 * s); g.beginPath(); g.moveTo(x + d * k * 0.1, y - k * 0.1); g.lineTo(x + d * k * 0.16, y - k * 1.25); g.stroke(); glints.push([x + d * k * 0.16, y - k * 1.25]); }
        } else if (q.t === 'horse') {
          g.ellipse(x, y - k * 0.5, k * 0.34, k * 0.13, 0, 0, TAU); g.fill();
          g.beginPath(); g.moveTo(x + d * k * 0.26, y - k * 0.56); g.lineTo(x + d * k * 0.42, y - k * 0.86); g.lineTo(x + d * k * 0.5, y - k * 0.8); g.lineTo(x + d * k * 0.34, y - k * 0.5); g.closePath(); g.fill();
          g.lineWidth = Math.max(0.6, 1 * s); g.beginPath();
          for (const lx of [-0.26, -0.16, 0.16, 0.26]) { g.moveTo(x + lx * k, y - k * 0.45); g.lineTo(x + lx * k + d * k * 0.03, y); }
          g.stroke();
        } else {
          // 车：车厢与轮，前面一匹马
          g.rect(x - k * 0.22, y - k * 0.62, k * 0.44, k * 0.3); g.fill();
          g.lineWidth = Math.max(0.6, 1 * s);
          g.beginPath(); g.arc(x, y - k * 0.2, k * 0.2, 0, TAU); g.stroke();
          g.beginPath(); g.moveTo(x + d * k * 0.22, y - k * 0.45); g.lineTo(x + d * k * 0.55, y - k * 0.5); g.stroke();
          const hx = x + d * k * 0.78;
          g.beginPath(); g.ellipse(hx, y - k * 0.5, k * 0.3, k * 0.12, 0, 0, TAU); g.fill();
          g.beginPath(); g.moveTo(hx + d * k * 0.22, y - k * 0.55); g.lineTo(hx + d * k * 0.36, y - k * 0.84); g.lineTo(hx + d * k * 0.44, y - k * 0.78); g.lineTo(hx + d * k * 0.3, y - k * 0.48); g.closePath(); g.fill();
          g.beginPath(); for (const lx of [-0.22, 0.22]) { g.moveTo(hx + lx * k, y - k * 0.45); g.lineTo(hx + lx * k, y); } g.stroke();
          g.beginPath(); g.moveTo(x - d * k * 0.05, y - k * 0.62); g.lineTo(x - d * k * 0.02, y - k * 1.0); g.stroke();
          glints.push([x - d * k * 0.02, y - k * 0.98], [x + d * k * 0.2, y - k * 0.6]);
        }
      }
      Object.assign(HOSTB, { key, x0, y0, w, h, glints });
    } catch (e) { HOSTB.key = ''; HOSTB.c = null; }
    return HOSTB;
  }
  function drawHost(ctx, l) {
    const k = W.lv.joHost;
    if (k < 0.01) return;
    const B = bakeHost(l);
    if (!B.c) return;
    const dx = (1 - k) * 0.05 * W.w;        // 散去时向右（向北）退去
    ctx.globalAlpha = Math.min(1, k * 1.1) * (l === 1 ? 0.95 : 0.85);
    ctx.drawImage(B.c, B.x0 + dx, B.y0, B.w, B.h);
    // 枪尖与车上的铜光
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(240,196,124)';
    const u = Math.max(0.8, PH(l) / 26);
    for (let i = 0; i < B.glints.length; i += 2) {
      const q = B.glints[i];
      ctx.globalAlpha = k * (0.25 + 0.55 * Math.max(0, Math.sin(W.t * 2 + i * 1.7)));
      ctx.fillRect(q[0] + dx - 0.8 * u, q[1] - 0.8 * u, 1.6 * u, 1.6 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 用火焚烧他们的车辆（11:9）：中丘上一处处的火与烟
  function drawFires(ctx, l) {
    const k = W.lv.joFires;
    if (k < 0.01) return;
    const [xa, xb] = hostSpan(l), ph = PH(l);
    for (let i = 0; i < 11; i++) {
      const xf = lerp(xa + 0.01, xb - 0.01, (i + 0.5) / 11) + (rt(i + 3300) - 0.5) * 0.015, v = l === 1 ? 0.1 + 0.5 * rt(i + 3340) : 0;
      const y = hostY(l, xf, v);
      flame(ctx, xf * W.w, y, ph * (0.45 + 0.35 * rt(i + 3320)), k * 0.95, i * 1.9);
      if (i % 3 === 0) smoke(ctx, xf * W.w, y - ph * 0.4, k * 0.75, W.h * 0.2, ph * 0.35, i * 0.7, true);
    }
  }
  // 三十一个王（12:24）：三十一顶冠，在远山之上排成两行，悬着一会儿，然后沉入地里
  function drawCrowns(ctx) {
    if (!tweening('crowns')) return;
    const t = tv('crowns', 0);
    SP || sprites();
    const u = SU(), r = 8 * u;
    for (let i = 0; i < 31; i++) {
      const appear = clamp((t / 0.3) * 1.4 - (i / 31) * 1.4 + 0.4, 0, 1), sink = clamp((t - 0.76 - (i / 31) * 0.08) / 0.16, 0, 1);
      if (appear <= 0) continue;
      const row = i % 2, xf = lerp(0.55, 0.96, (i + 0.5 * row) / 31), g = gY(0, xf);
      const y0 = W.horizonY - (0.11 + 0.055 * row + 0.015 * Math.sin(i * 0.9)) * W.h * (phone() ? 0.65 : 1), y = lerp(y0, g - 2, sink * sink);
      const a = appear * (1 - sink) * 0.92;
      if (a < 0.01) continue;
      const x = xf * W.w;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y, r * 2.6, a * 0.32);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgb(240,206,120)';
      ctx.beginPath();
      ctx.moveTo(x - r, y + r * 0.5); ctx.lineTo(x - r, y - r * 0.2); ctx.lineTo(x - r * 0.5, y + r * 0.1); ctx.lineTo(x, y - r * 0.6);
      ctx.lineTo(x + r * 0.5, y + r * 0.1); ctx.lineTo(x + r, y - r * 0.2); ctx.lineTo(x + r, y + r * 0.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,244,210,0.8)';
      ctx.fillRect(x - r, y + r * 0.3, r * 2, r * 0.2);
    }
    ctx.globalAlpha = 1;
  }
  // 魂的光（约书亚归到列祖）
  const FXL = [];
  function soul(b, id) {
    if (b.instant) return;
    const p = figPt(id, 0.3);
    if (p) FXL.push({ type: 'soul', t: 0, dur: 4.5, x0: p[0] / W.w, y0: p[1] / W.h });
  }
  function drawFX(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    for (const e of FXL) {
      const k = e.t / e.dur;
      if (e.type === 'soul') {
        const a = Math.sin(Math.PI * clamp(k, 0, 1));
        const x = e.x0 * W.w + Math.sin(k * 5) * 6, y = (e.y0 - 0.12 * k) * W.h;
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, x, y, PH(2) * (0.6 + k), a * 0.7);
        glowSp(ctx, SP.white, x, y, PH(2) * 0.25, a * 0.9);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const SCENE = {
    init() { sprites(); loadFonts(); },
    resize() {
      RV = null; RPC.key = ''; LEVI = null; GROVE = null; MANNA = null;
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
          if (Math.abs(d) <= v) { p.x = p.tx; p.tx = null; } else p.x += Math.sign(d) * v;
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      for (const k in TW) if (W.t - TW[k].t0 > TW[k].dur + 1) delete TW[k];
      spawnPuffs(dt);
      easeV(dt);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawStill(ctx); drawCrowns(ctx); return; }
      const l = LAYER_OF_PASS[pass];
      if (l == null) {
        if (pass === 'air') {
          drawPromise(ctx); drawBeam(ctx);
          drawHorns(ctx); drawSword(ctx); drawSpear(ctx); drawCarried(ctx); drawRope(ctx);
          for (const p of sortProps()) if (p.kind === 'coffin' && p.a > 0.005) drawCoffin(ctx, p);
          drawFireLight(ctx);
          drawFX(ctx);
        }
        return;
      }
      if (l === 0) { drawHail(ctx); }
      if (l === S.hostL) drawHost(ctx, l);
      if (l === 2) { drawJordan(ctx); drawManna(ctx); drawHoly(ctx); }
      drawLevi(ctx, l);
      drawGroves(ctx, l);
      const list = sortProps();
      for (const p of list) {
        if (p.layer !== l || p.a < 0.005 || p.kind === 'coffin') continue;
        if (p.kind === 'city') { drawCity(ctx, p); drawRings(ctx); continue; }
        drawKind(ctx, p);
      }
      // 支派的名字：画在本层的人之前（人走过时盖住名字，不压在人身上）
      for (const p of list) if (p.kind === 'lot' && p.layer === l && p.a > 0.01) drawLotName(ctx, p);
      if (l === 2) drawHeap(ctx);
      if (l === S.hostL) drawFires(ctx, l);
    },
    draw(ctx, pass) {
      // 约柜：在走兽之后、人之前画（抬着时，祭司在两端）
      if (!isCur() || pass !== 'near') return;
      drawArk(ctx);
    },
    reset() { P.clear(); FXL.length = 0; PUFF.length = 0; sortedN = -1; for (const k in TW) delete TW[k]; snapV(); },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0; PUFF.length = 0;
      for (const k in TW) delete TW[k];
      snapV();
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || p.dying) continue;
        if (p.kind === 'lot') { const q = lotXY(p); cand(p.label, q[0], q[1] - PH(p.layer) * 0.5); continue; }
        if (p.kind === 'city') {
          const G = cityG(p);
          cand(p.ruin > 0.5 ? '耶利哥的废墟' : '耶利哥', G.cx, cityBase(G, G.cx) - G.wallH * 1.2);
          if (p.cord > 0.5 && p.ruin < 0.5) { const R = rahabWin(p); cand('朱红线绳', R.x, R.y + (R.base - R.y) * 0.4); }
          continue;
        }
        const ph = PH(p.layer), px = p.x * W.w, py = baseOf(p) - ph * (p.kind === 'oak' ? 1.4 : p.kind === 'tent' ? 0.35 : 0.5);
        cand(p.label, px, py);
      }
      const a = arkPos();
      if (a) cand('约柜', a.x, a.y - 8);
      if (W.lv.joHeap > 0.5) { const q = rPt(0.01); cand('立起成垒的水', q[0], q[1] - 30 * LS(2)); }
      else { const q = rPt(0.5); cand('约旦河', q[0], q[1]); }
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() {
      const r1 = v => Math.round(v * 10) / 10;
      const props = Array.from(P.values()).filter(p => !p.dying).map(p => [p.id, r1(p.ta), r1(p.tgrow), r1(p.tlit), r1(p.tfire), r1(p.tfall), r1(p.tcord), r1(p.topen), r1(p.truin), r1(p.tbury), Math.round((p.tx != null ? p.tx : p.x) * 100) / 100].join(':')).sort();
      return { camp: S.camp, ark: S.ark, arkX: Math.round(S.arkX * 100), march: S.march, horns: S.horns, sword: S.sword, spear: S.spear, rope: S.rope, carry12: S.carry12, lots: S.lots.slice().sort().join(','), lotDim: S.lotDim, props };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  const fromOf = b => (b.instant ? 'none' : 'fade');
  function tentsE(show) { X.tentE.forEach((x, i) => { if (show) prop('tE' + i, 'tent', { x, v: 0, size: i === 1 ? 1.05 : 0.9, label: '以色列人的帐棚' }); else unprop('tE' + i); }); }
  function tentsW(show, o) { X.tentW.forEach((x, i) => { if (show) prop('tW' + i, 'tent', Object.assign({ x, v: 0, size: i === 2 ? 1.05 : 0.92, label: '吉甲的营' }, o || {})); else unprop('tW' + i); }); }
  function palms() {
    // 耶利哥是棕树城：城右边的一小片棕树
    prop('palm1', 'palm', { x: 0.908, v: 0.0, size: 1.1, label: '棕树' });
    prop('palm2', 'palm', { x: 0.985, v: 0.05, size: 1.0, flip: -1, label: '棕树' });
    prop('palm3', 'palm', { x: 0.948, v: 0.1, size: 0.85, label: '棕树' });
  }
  function lot(b, id, delay) {
    const q = LOTS[id];
    if (!q) return;
    prop('lot_' + id, 'lot', { name: q[0], layer: q[1], x: q[2], v: q[3], rgb: q[4], label: q[0] + (id === 'manE' ? '（约旦河东）' : ''), grow: 1, lit: 1 });
    if (!S.lots.includes(id)) S.lots.push(id);
    tween(b, 'lotf_lot_' + id, 1, 0, 7.5);
    if (!b.instant) {
      const p = getP('lot_' + id);
      if (p) { p.grow = 0; }
      const xy = lotXY(getP('lot_' + id));
      sparkAt(b, xy[0], xy[1] - PH(q[1]) * 0.3, 16, q[4], PH(q[1]) * 0.8, q[1] === 2 ? 'near' : q[1] === 1 ? 'mid' : 'far');
    }
  }
  const REFUGE = [
    ['kedesh', 0, 0.9, 0, '基低斯'], ['shechem', 1, 0.705, 0, '示剑'], ['hebronR', 1, X.hebron, 0, '希伯仑'],
    ['golan', 0, 0.54, 0, '哥兰'], ['ramoth', 2, 0.512, 0.62, '拉末'], ['bezer', 2, 0.405, 0.3, '比悉'],
  ];
  // 约书亚与众人（人物的衣着）
  function joshuaOld(b) { add('joshua', { age: 'elder', robe: [112, 116, 150], prop: 'staff' }); }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：约旦河东，摩押平原上什亭的营，清晨（1:1）
  // ════════════════════════════════════════════════════════════
  function resetScene() { P.clear(); FXL.length = 0; PUFF.length = 0; VE.clear(); sorted = []; sortedN = -1; for (const k in TW) delete TW[k]; S = fresh(); RV = null; RPC.key = ''; BK.key = ''; BK.sk = ''; lastFall = -1; STB.clear(); }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 1, herbs: 0.85, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.15,
      bare: 0.12, bloom: 0.75, joPromise: 0, joBeam: 0, joManna: 1, joFlood: 0.35, joHeap: 0, joDry: 0, joFill: 0, joHoly: 0, joRings: 0, joRings7: 0, joHorn: 0,
      joSun: 0, joMoon: 0, joHail: 0, joHost: 0, joFires: 0, joLevi: 0, joGroves: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.27, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 26, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 8, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 河东的营、河西的城
    tentsE(true);
    prop('jericho', 'city', { x: X.city, label: '耶利哥', open: 1 });
    palms();
    prop('field', 'field', { x: X.field0, x1: X.field1, v: 0.62, v1: 1, grow: 0.25, label: '大麦田' });
    prop('ai', 'ai', { x: X.ai, layer: 1, label: '艾城' });
    const c = C();
    c.clear({ fade: false });
    add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: X.josh, v: 0.3, facing: 1, robe: ROBE.joshua, accent: [206, 192, 160], glow: 0.45, prop: 'staff', from: 'none' });
    add('officer1', { label: '百姓的官长', sex: 'm', age: 'adult', x: X.off1, v: 0.12, facing: 1, robe: ROBE.officer, glow: 0.12, from: 'none' });
    add('officer2', { label: '百姓的官长', sex: 'm', age: 'elder', x: X.off2, v: 0.2, facing: -1, robe: [150, 132, 104], glow: 0.12, from: 'none' });
    crowd('isrA', { n: 10, x0: 0.42, x1: 0.535, layer: 2, v: 0.05, label: '以色列人', from: 'none' });
    crowd('isrB', { n: 7, x0: 0.405, x1: 0.5, layer: 2, v: 0.4, label: '以色列人', from: 'none' });
    S.camp = 'east';
    avoid([0.38, 0.63], [0.74, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟），故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '耶和华的仆人摩西死了以后，<br>耶和华晓谕摩西的帮手，<br>嫩的儿子约书亚，说：', ref: '约书亚记 1:1', hold: 6 },
  ];
  const V1 = [
    { text: '「我的仆人摩西死了。<br>现在你要起来，和众百姓过这约旦河，<br>往我所要赐给以色列人的地去。」', ref: '约书亚记 1:2', hold: 7 },
    { text: '「……我怎样与摩西同在，<br>也必照样与你同在；<br>我必不撇下你，也不丢弃你。」', ref: '约书亚记 1:5', hold: 6 },
    { text: '「我岂没有吩咐你吗？你当刚强壮胆！<br>不要惧怕，也不要惊惶；<br>因为你无论往哪里去，<br>耶和华你的神必与你同在。」', ref: '约书亚记 1:9', hold: 7.5 },
  ];
  const V2 = [
    { text: '嫩的儿子约书亚从什亭<br>暗暗打发两个人作探子……<br>来到一个妓女名叫喇合的家里……', ref: '约书亚记 2:1', hold: 7 },
    { text: '于是女人用绳子将二人从窗户里缒下去；<br>因她的房子是在城墙边上，<br>她也住在城墙上。', ref: '约书亚记 2:15', hold: 6.5 },
    { text: '女人说：「照你们的话行吧！」<br>于是打发他们去了，<br>又把朱红线绳系在窗户上。', ref: '约书亚记 2:21', hold: 6 },
  ];
  const V3 = [
    { text: '「等到抬普天下主耶和华约柜的祭司<br>把脚站在约旦河水里，<br>约旦河的水……必然断绝，立起成垒。」', ref: '约书亚记 3:13', hold: 6.5 },
    { text: '那从上往下流的水便在极远之地……<br>立起成垒；那往亚拉巴的海，就是盐海，<br>下流的水全然断绝。<br>于是百姓在耶利哥的对面过去了。', ref: '约书亚记 3:16', hold: 7.5 },
    { text: '抬耶和华约柜的祭司<br>在约旦河中的干地上站定，<br>以色列众人都从干地上过去，<br>直到国民尽都过了约旦河。', ref: '约书亚记 3:17', hold: 6.5 },
  ];
  const V4 = [
    { text: '「……这是因为约旦河的水<br>在耶和华的约柜前断绝……<br>这些石头要作以色列人永远的纪念。」', ref: '约书亚记 4:7', hold: 6 },
    { text: '抬耶和华约柜的祭司从约旦河里上来，<br>脚掌刚落旱地，<br>约旦河的水就流到原处，仍旧涨过两岸。', ref: '约书亚记 4:18', hold: 6.5 },
    { text: '……就在吉甲，在耶利哥的东边安营。<br>他们从约旦河中取来的那十二块石头，<br>约书亚就立在吉甲。', ref: '约书亚记 4:19–20', hold: 6.5 },
  ];
  const V5 = [
    { text: '以色列人在吉甲安营。<br>正月十四日晚上，<br>在耶利哥的平原守逾越节……<br>第二日吗哪就止住了……', ref: '约书亚记 5:10–12', hold: 6 },
    { text: '约书亚靠近耶利哥的时候……<br>有一个人手里有拔出来的刀……<br>「我来是要作耶和华军队的元帅。」<br>约书亚就俯伏在地下拜……', ref: '约书亚记 5:13–14', hold: 7 },
    { text: '耶和华军队的元帅对约书亚说：<br>「把你脚上的鞋脱下来，<br>因为你所站的地方是圣的。」<br>约书亚就照着行了。', ref: '约书亚记 5:15', hold: 6.5 },
  ];
  const V6 = [
    { text: '耶利哥的城门因以色列人<br>就关得严紧，无人出入。', ref: '约书亚记 6:1', hold: 5 },
    { text: '耶和华晓谕约书亚说：<br>「看哪，我已经把耶利哥和耶利哥的王，<br>并大能的勇士，都交在你手中。」', ref: '约书亚记 6:2', hold: 6 },
    { text: '约书亚对百姓说完了话，<br>七个祭司拿七个羊角<br>走在耶和华面前吹角；<br>耶和华的约柜在他们后面跟随。', ref: '约书亚记 6:8', hold: 6 },
    { text: '第二日，众人把城绕了一次，<br>就回营里去。六日都是这样行。', ref: '约书亚记 6:14', hold: 5.5 },
  ];
  const V7 = [
    { text: '第七日清早，黎明的时候，<br>他们起来，照样绕城七次；<br>惟独这日把城绕了七次。', ref: '约书亚记 6:15', hold: 6 },
    { text: '到了第七次，祭司吹角的时候，<br>约书亚吩咐百姓说：「呼喊吧，<br>因为耶和华已经把城交给你们了！」', ref: '约书亚记 6:16', hold: 6 },
    { text: '于是百姓呼喊，祭司也吹角。<br>百姓听见角声，便大声呼喊，<br>城墙就塌陷，百姓便上去进城……', ref: '约书亚记 6:20', hold: 6.5 },
    { text: '约书亚却把妓女喇合与她父家，<br>并她所有的，都救活了……<br>她就住在以色列中，直到今日。', ref: '约书亚记 6:25', hold: 6 },
  ];
  const V8 = [
    { text: '以色列人在当灭的物上犯了罪……<br>亚干取了当灭的物；<br>耶和华的怒气就向以色列人发作。', ref: '约书亚记 7:1', hold: 6 },
    { text: '约书亚便撕裂衣服……<br>在耶和华的约柜前俯伏在地……<br>耶和华吩咐约书亚说：<br>「起来！你为何这样俯伏在地呢？」', ref: '约书亚记 7:6–10', hold: 6.5 },
    { text: '众人在亚干身上堆成一大堆石头……<br>于是耶和华转意，不发他的烈怒。', ref: '约书亚记 7:26', hold: 5.5 },
    { text: '约书亚就向城伸出手里的短枪。<br>他一伸手，<br>伏兵就从埋伏的地方急忙起来，<br>夺了城，跑进城去，放火焚烧。', ref: '约书亚记 8:18–19', hold: 6 },
  ];
  const V9 = [
    { text: '基遍的居民听见约书亚<br>向耶利哥和艾城所行的事……<br>于是约书亚与他们讲和，<br>与他们立约，容他们活着……', ref: '约书亚记 9:3–15', hold: 6 },
    { text: '他们在以色列人面前逃跑，<br>正在伯‧和仑下坡的时候，<br>耶和华从天上降大冰雹在他们身上……', ref: '约书亚记 10:11', hold: 6 },
    { text: '约书亚就祷告耶和华，<br>在以色列人眼前说：<br>日头啊，你要停在基遍；<br>月亮啊，你要止在亚雅仑谷。', ref: '约书亚记 10:12', hold: 6.5 },
    { text: '于是日头停留，月亮止住……<br>日头在天当中停住，<br>不急速下落，约有一日之久。', ref: '约书亚记 10:13', hold: 6 },
  ];
  const V10 = [
    { text: '这些王和他们的众军都出来，<br>人数多如海边的沙，<br>并有许多马匹车辆。', ref: '约书亚记 11:4', hold: 6.5 },
    { text: '这样，约书亚照着<br>耶和华所吩咐摩西的一切话<br>夺了那全地……<br>于是国中太平，没有争战了。', ref: '约书亚记 11:23', hold: 6.5 },
    { text: '他们的王：一个是耶利哥王，<br>一个是靠近伯特利的艾城王……<br>共计三十一个王。', ref: '约书亚记 12:9–24', hold: 6.5 },
  ];
  const V11 = [
    { text: '约书亚年纪老迈，<br>耶和华对他说：「你年纪老迈了，<br>还有许多未得之地……」', ref: '约书亚记 13:1', hold: 5.5 },
    { text: '迦勒对约书亚说：「……<br>现今我八十五岁了，我还是强壮……<br>求你将耶和华那日<br>应许我的这山地给我……」', ref: '约书亚记 14:6–12', hold: 7 },
    { text: '犹大支派按着宗族拈阄所得之地<br>是在尽南边，到以东的交界，<br>向南直到寻的旷野。', ref: '约书亚记 15:1', hold: 5.5 },
    { text: '约瑟的儿子玛拿西、以法莲<br>就得了他们的地业。', ref: '约书亚记 16:4', hold: 5 },
  ];
  const V12 = [
    { text: '西罗非哈没有儿子，只有女儿……<br>她们……说：「耶和华曾吩咐摩西<br>在我们弟兄中分给我们产业。」', ref: '约书亚记 17:3–4', hold: 6 },
    { text: '以色列的全会众都聚集在示罗，<br>把会幕设立在那里，<br>那地已经被他们制伏了。', ref: '约书亚记 18:1', hold: 5.5 },
    { text: '……在示罗会幕门口，耶和华面前，<br>拈阄所分的地业。<br>这样，他们把地分完了。', ref: '约书亚记 19:51', hold: 5.5 },
    { text: '「你吩咐以色列人说：<br>你们要……为自己设立逃城，<br>使那无心而误杀人的，可以逃到那里。」', ref: '约书亚记 20:2–3', hold: 6 },
  ];
  const V13 = [
    { text: '这样，耶和华将从前向他们列祖<br>起誓所应许的全地赐给以色列人，<br>他们就得了为业，住在其中。', ref: '约书亚记 21:43', hold: 6 },
    { text: '吕便人、迦得人，<br>和玛拿西半支派的人……<br>就在约旦河那里筑了一座坛；<br>那坛看着高大。', ref: '约书亚记 22:10', hold: 6 },
    { text: '「我现在要走世人必走的路……<br>耶和华你们神所应许赐福与你们的话<br>没有一句落空，都应验在你们身上了。」', ref: '约书亚记 23:14', hold: 7 },
  ];
  const V14 = [
    { text: '「……今日就可以选择所要事奉的……<br>至于我和我家，<br>我们必定事奉耶和华。」', ref: '约书亚记 24:15', hold: 6 },
    { text: '当日，约书亚就与百姓立约……<br>又将一块大石头立在橡树下<br>耶和华的圣所旁边。', ref: '约书亚记 24:25–26', hold: 5.5 },
    { text: '这些事以后，<br>耶和华的仆人嫩的儿子约书亚，<br>正一百一十岁，就死了。', ref: '约书亚记 24:29', hold: 5.5 },
    { text: '以色列人从埃及所带来约瑟的骸骨，<br>葬埋在示剑……<br>这就作了约瑟子孙的产业。', ref: '约书亚记 24:32', hold: 6 },
  ];

  // ════════════════════════════════════════════════════════════
  //  话语：神对约书亚说的话（1:9；3:8；4:3；6:3；6:5；8:18；13:6；20:2；24:13），
  //  元帅的话（5:15），与经上所记神所行的事（2:11；10:13；21:45）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 你当刚强壮胆（1:1–18）──────────────────────────────
    {
      kind: 'cmd', utter: '你当刚强壮胆', cmd: 'git checkout -b 约书亚 --from 摩西  # 我必不撇下你', ref: '1:9', tint: [255, 226, 170],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.31, 7, b.instant);
            W.set('joBeam', 1, b.instant);
            walk('joshua', X.josh + 0.004, { speed: 0.02, pose: 'bow' });
            sfx(b, 'harp');
          }],
          [2.5, b => { W.set('joPromise', 1, b.instant); sfx(b, 'angel', { soft: true }); }],
          [L[1], () => { pose('joshua', 'stand'); face('joshua', 1); }],
          [L[2], b => { pose('joshua', 'raise'); const p = figPt('joshua', 0.6); if (p) ringAt(b, p[0], p[1], [255, 232, 180], PH(2) * 2.4, 2.2); }],
          [L[2] + 3.5, b => {
            // 百姓回答约书亚（1:16）
            walk('officer1', 0.53, { speed: 0.02 }); walk('officer2', 0.43, { speed: 0.018 });
            crowdPose('isrA', 'raise'); crowdPose('isrB', 'raise'); crowdFace('isrA', 1); crowdFace('isrB', 1);
            sfx(b, 'crowd', { soft: true });
          }],
          [L[2] + 5.5, b => { pose('joshua', 'stand'); W.set('joBeam', 0.35, b.instant); W.set('joPromise', 0.45, b.instant); }],
          [L[2] + 7, () => { crowdPose('isrA', 'stand'); crowdPose('isrB', 'stand'); }],
        ]);
      },
    },

    // ── 2 · 耶和华你们的神本是上天下地的神（2:1–24）── 探子、喇合、朱红线绳 ──
    //    （话语是喇合所认的神——经上所记神的本性，kind 'act'）
    {
      kind: 'act', utter: '耶和华你们的神本是上天下地的神', cmd: 'curl 耶利哥 --via 喇合 --hide 麻秸  # 朱红线绳', ref: '2:11', tint: [236, 214, 255],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        const R = () => rahabWin(getP('jericho')), winX = () => R().x / W.w;
        T(c, [
          [0, b => {
            W.set('joBeam', 0, b.instant); W.set('joPromise', 0, b.instant);
            W.goTo(0.8, 8, b.instant);
            const f = fromOf(b);
            add('spy1', { label: '探子', sex: 'm', age: 'adult', x: X.josh + 0.016, v: 0.1, facing: -1, robe: ROBE.spy, glow: 0.25, from: f });
            add('spy2', { label: '探子', sex: 'm', age: 'adult', x: X.josh + 0.03, v: 0.14, facing: -1, robe: ROBE.spy2, glow: 0.25, from: f });
            face('joshua', 1); pose('joshua', 'point');
          }],
          [2, () => {
            pose('joshua', 'stand');
            walk('spy1', winX() - 0.012, { speed: 0.036 }); walk('spy2', winX() + 0.004, { speed: 0.035 });
          }],
          [6.5, b => { W.goTo(0.95, 7, b.instant); }],
          [L[1] - 0.3, b => {
            // 二人进了喇合的家；喇合上房顶（2:6，2:8），窗里点着灯
            rm('spy1'); rm('spy2');
            prop('jericho', null, { lit: 1 });
            add('rahab', { label: '喇合', sex: 'f', age: 'adult', x: winX(), facing: -1, robe: ROBE.rahab, accent: [226, 70, 64], glow: 0.6, from: fromOf(b) });
            attach('rahab', () => { const q = R(); return [q.x + q.w * 0.05, q.roof]; });
          }],
          [L[1] + 0.7, b => {
            // 耶利哥王的人举着火把出城门，往约旦河的渡口追去，城门就关了（2:7）
            const G = cityG(getP('jericho')), gx = ((segX(G, CM.gate) + segX(G, CM.gate + 1)) / 2) / W.w;
            prop('jericho', null, { open: 1 });
            add('guard1', { label: '耶利哥王的人', sex: 'm', age: 'adult', x: gx, v: 0.04, facing: -1, robe: ROBE.guard, glow: 0.05, prop: 'torch', from: fromOf(b) });
            add('guard2', { label: '耶利哥王的人', sex: 'm', age: 'adult', x: gx + 0.012, v: 0.08, facing: -1, robe: ROBE.guard, glow: 0.05, prop: 'torch', from: fromOf(b) });
            walk('guard1', 0.615, { speed: 0.05 }); walk('guard2', 0.63, { speed: 0.048 });
            sfx(b, 'gate');
          }],
          [L[1] + 2.7, b => { prop('jericho', null, { open: 0 }); sfx(b, 'gate', { soft: true }); }],
          [L[1] + 3.2, b => {
            // 用绳子从窗户里缒下去（2:15）
            const q = R();
            for (const [id, dx, robe, dl] of [['spy1', -0.004, ROBE.spy, 0], ['spy2', 0.008, ROBE.spy2, 1.4]]) {
              add(id, { label: '探子', sex: 'm', age: 'adult', x: q.x / W.w + dx, v: 0, facing: -1, robe, glow: 0.25, from: 'none', pose: 'raise' });
              const f = fig(id);
              if (f && !b.instant) { f.ny = (q.y + (dl ? -2 : 0)) / W.h; f.alpha = 0; f.targetAlpha = 1; }
              fly(id, q.x / W.w + dx, null, { dur: 3.2 + dl, pose: 'stand' });
            }
            S.rope = true;
            sfx(b, 'wind', { soft: true });
          }],
          [L[1] + 4.5, () => { rm('guard1'); rm('guard2'); }],
          [L[2] - 0.5, b => {
            S.rope = false;
            walk('spy1', 1.03, { speed: 0.034 }); walk('spy2', 1.05, { speed: 0.034 });
          }],
          [L[2] + 0.8, b => {
            prop('jericho', null, { cord: 1 });
            sfx(b, 'harp');
            const q = R();
            sparkAt(b, q.x, q.y + 6, 14, [236, 90, 80], 5);
          }],
          [L[2] + 5, b => { rm('spy1'); rm('spy2'); attach('rahab', null); rm('rahab'); prop('jericho', null, { lit: 0 }); }],
        ]);
      },
    },

    // ── 3 · 就要在约旦河水里站住（3:1–17）── 水立起成垒，百姓从干地上过去 ──
    {
      kind: 'cmd', utter: '就要在约旦河水里站住', cmd: 'kill -STOP 约旦河 --upstream  # 立起成垒', ref: '3:8', tint: [210, 236, 255],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const edge = v => riverAtV(v, -1) - 0.008;
        T(c, [
          [0, b => {
            W.goTo(0.29, 7, b.instant);
            W.set('joFlood', 1, b.instant);
            const f = fromOf(b);
            // 抬约柜的祭司：前两人、后两人（站在河的上游一侧，百姓从他们前面过去，约柜不被挡住）
            add('p1', { label: '抬约柜的祭司', sex: 'm', age: 'adult', x: 0.47, v: 0.18, facing: 1, robe: ROBE.priest, accent: [214, 200, 170], glow: 0.25, from: f });
            add('p2', { label: '抬约柜的祭司', sex: 'm', age: 'adult', x: 0.47, v: 0.23, facing: 1, robe: ROBE.priest, accent: [214, 200, 170], glow: 0.25, from: f });
            add('p3', { label: '抬约柜的祭司', sex: 'm', age: 'adult', x: 0.443, v: 0.18, facing: 1, robe: ROBE.priest, accent: [214, 200, 170], glow: 0.25, from: f });
            add('p4', { label: '抬约柜的祭司', sex: 'm', age: 'adult', x: 0.443, v: 0.23, facing: 1, robe: ROBE.priest, accent: [214, 200, 170], glow: 0.25, from: f });
            S.ark = 'carry';
            walk('joshua', 0.45, { speed: 0.02 }); vTo('joshua', 0.42);
            // 百姓到东岸的前面来，等着过河
            crowdWalk('isrA', 0.43, 0.52, { speed: 0.02 }); crowdWalk('isrB', 0.41, 0.5, { speed: 0.02 });
            vTo('isrA', [0.56, 0.74]); vTo('isrB', [0.66, 0.88]);
            rm('officer1'); rm('officer2');
          }],
          [2.5, () => {
            const e = edge(0.2);
            walk('p1', e, { speed: 0.022 }); walk('p2', e, { speed: 0.022 });
            walk('p3', e - 0.027, { speed: 0.022 }); walk('p4', e - 0.027, { speed: 0.022 });
          }],
          [L[1] - 0.6, b => {
            // 脚一入水（3:15）
            const p = figPt('p1', 0);
            if (p) { ringAt(b, p[0], p[1], [220, 240, 255], PH(2) * 1.6, 1.6); sparkAt(b, p[0], p[1], 16, [220, 240, 255], 8); }
            W.set('joHeap', 1, b.instant); W.set('joDry', 1, b.instant);
            sfx(b, 'wind', { low: true }); sfx(b, 'splash', { size: 2 });
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.25);
          }],
          [L[1] + 1.5, () => {
            const cx = riverAtV(0.2);
            walk('p1', cx + 0.013, { speed: 0.018 }); walk('p2', cx + 0.013, { speed: 0.018 });
            walk('p3', cx - 0.014, { speed: 0.018 }); walk('p4', cx - 0.014, { speed: 0.018 });
          }],
          [L[1] + 3, b => { S.arkLit = true; sfx(b, 'angel', { soft: true }); }],
          [L[1] + 4, b => {
            // 百姓从左岸横过干的河床，到右岸（在祭司的前面）
            crowdWalk('isrA', 0.61, 0.73, { speed: 0.03 }); crowdWalk('isrB', 0.62, 0.745, { speed: 0.028 });
            tentsE(false);
            avoid([0.38, 0.8]);
          }],
          [L[1] + 5.5, () => { walk('joshua', X.gilgalJ, { speed: 0.026 }); }],
          [L[2] + 3, b => { crowdFace('isrA', -1); crowdFace('isrB', -1); face('joshua', -1); sfx(b, 'crowd', { soft: true }); }],
        ]);
      },
    },

    // ── 4 · 取十二块石头带过去（4:1–24）── 水流到原处；吉甲 ──────────
    {
      kind: 'cmd', utter: '取十二块石头带过去', cmd: 'git commit -m "十二块石头"  # 要作以色列人永远的纪念', ref: '4:3', tint: [236, 230, 214],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        const bed = () => [riverAtV(0.5) - 0.018, riverAtV(0.5) + 0.018];
        T(c, [
          [0, b => {
            S.arkLit = true;
            crowd('twelve', { n: 12, x0: 0.61, x1: 0.68, layer: 2, v: 0.5, label: '十二个人', from: fromOf(b) });
          }],
          [1.2, () => { const q = bed(); crowdWalk('twelve', q[0], q[1], { speed: 0.03 }); }],
          [4, () => crowdPose('twelve', 'kneel')],
          [5.2, b => {
            S.carry12 = true;
            crowdWalk('twelve', X.stones - 0.034, X.stones + 0.034, { speed: 0.022, pose: 'stand' });
            vTo('twelve', [0.62, 0.84]);
            // 约书亚另把十二块石头立在约旦河中（4:9）
            prop('cairnJ', 'cairn', { x: riverAtV(0.42), v: 0.42, size: 0.8, name: 'river', grow: 1, label: '河中的十二块石头' });
            sfx(b, 'stone');
          }],
          [L[1] - 0.3, () => {
            // 祭司抬着约柜从河里上来
            walk('p1', X.ark + 0.013, { speed: 0.02 }); walk('p2', X.ark + 0.013, { speed: 0.02 });
            walk('p3', X.ark - 0.014, { speed: 0.02 }); walk('p4', X.ark - 0.014, { speed: 0.02 });
          }],
          [L[1] + 2.5, b => {
            S.carry12 = false;
            crowdPose('twelve', 'kneel');
            prop('stones', 'stones', { x: X.stones, v: X.stonesV, grow: 1, lit: 1, label: '十二块石头' });
            sfx(b, 'stone');
          }],
          [L[1] + 3.2, b => {
            // 脚掌刚落旱地，水就流到原处，仍旧涨过两岸（4:18）
            W.set('joHeap', 0, b.instant); W.set('joFill', 1, b.instant); W.set('joFlood', 1, b.instant);
            sfx(b, 'splash', { size: 3 }); sfx(b, 'wind', { low: true });
            if (!b.instant) W.shake = Math.max(W.shake || 0, 0.2);
          }],
          [L[1] + 4.5, () => crowdPose('twelve', 'stand')],
          [L[2] - 0.8, b => { W.set('joDry', 0, true); W.set('joFill', 0, true); W.set('joFlood', 0.55, b.instant); }],
          [L[2], b => {
            // 在吉甲安营
            tentsW(true);
            uncrowd('twelve');
            S.camp = 'gilgal'; S.arkLit = false;
            S.ark = 'ground'; S.arkX = X.ark; S.arkV = X.arkV;
            BEARERS.forEach(id => rm(id));
            walk('joshua', X.stones + 0.03, { speed: 0.02, pose: 'point' }); vTo('joshua', 0.5);
            crowdWalk('isrA', 0.6, 0.71, { speed: 0.02 }); crowdWalk('isrB', 0.69, 0.76, { speed: 0.02 });
            vTo('isrA', [0.04, 0.18]); vTo('isrB', [0.46, 0.64]);
            prop('stones', null, { lit: 1 });
            avoid([0.38, 0.8]);
          }],
          [L[2] + 3.5, () => { pose('joshua', 'stand'); prop('stones', null, { lit: 0.35 }); }],
        ]);
      },
    },

    // ── 5 · 我今日将埃及的羞辱从你们身上滚去了（5:1–15）── 逾越节、吗哪止住、耶和华军队的元帅 ──
    {
      kind: 'cmd', utter: '我今日将埃及的羞辱从你们身上滚去了', cmd: 'rm -rf ~/埃及的羞辱  # 那地方名叫吉甲', ref: '5:9', tint: [255, 230, 190],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.8, 7, b.instant);
            tentsW(true, { lit: 0.6 });
            // 逾越节的晚上：地上两堆小火，众人围着火跪坐（5:10–11）
            prop('pf1', 'pfire', { x: 0.622, v: 0.44, fire: 1, label: '逾越节的火' });
            prop('pf2', 'pfire', { x: 0.686, v: 0.52, fire: 1, label: '逾越节的火' });
            W.set('joManna', 0, b.instant);
            prop('field', null, { grow: 1 });
            crowdWalk('isrA', 0.594, 0.662, { speed: 0.02, pose: 'kneel' }); crowdWalk('isrB', 0.652, 0.712, { speed: 0.02, pose: 'kneel' });
            vTo('isrA', [0.32, 0.6]); vTo('isrB', [0.38, 0.66]);
            walk('joshua', 0.66, { speed: 0.02 }); vTo('joshua', 0.28);
            sfx(b, 'fire', { soft: true });
          }],
          [L[1] - 1.5, b => {
            W.goTo(0.97, 7, b.instant);
            walk('joshua', 0.713, { speed: 0.02 }); vTo('joshua', 0.32);
            tentsW(true, { lit: 0.25 });
            prop('pf1', null, { fire: 0.7 }); prop('pf2', null, { fire: 0.7 });
          }],
          [L[1] + 1.5, b => {
            add('commander', { label: '耶和华军队的元帅', sex: 'm', age: 'adult', x: 0.757, v: 0.34, facing: -1, angel: true, glow: 0.9, from: b.instant ? 'none' : 'light', pose: 'point', scale: 1.08 });
            S.sword = true;
            glow('joshua', 0.6);
            sfx(b, 'angel');
          }],
          [L[1] + 2.5, () => { face('joshua', 1); pose('joshua', 'point'); }],
          [L[1] + 5, b => { pose('joshua', 'fall'); pose('commander', 'stand'); sfx(b, 'harp', { low: true }); }],
          [L[2], b => {
            pose('joshua', 'kneel');
            W.set('joHoly', 1, b.instant);
            const p = figPt('joshua', 0);
            if (p) ringAt(b, p[0], p[1], [255, 226, 160], PH(2) * 2.6, 2.4);
          }],
        ]);
      },
    },

    // ── 6 · 一日围绕一次，六日都要这样行（6:1–14）──────────────
    {
      kind: 'cmd', utter: '一日围绕一次，六日都要这样行', cmd: 'for d in {1..6}; do orbit 耶利哥 --once --silent; done', ref: '6:3', tint: [236, 226, 206],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            rm('commander'); S.sword = false; W.set('joHoly', 0, b.instant);
            glow('joshua', 0.45);
            pose('joshua', 'stand'); walk('joshua', 0.7, { speed: 0.02 }); vTo('joshua', 0.3);
            tentsW(true, { lit: 0 });
            unprop('pf1'); unprop('pf2');
            crowdWalk('isrA', 0.6, 0.7, { speed: 0.02 }); crowdWalk('isrB', 0.64, 0.72, { speed: 0.02 });
            vTo('isrA', [0.04, 0.2]); vTo('isrB', [0.46, 0.64]);
            prop('jericho', null, { open: 0 });
            sfx(b, 'gate');
            avoid([0.38, 1]);
          }],
          [3, b => {
            // 队伍：带兵器的在前，七个祭司拿七个羊角，约柜，后队
            addMarchers(b, true);
            S.march = true; S.marchS = 0.9;
            for (const m of MARCH) marchAttach(m[0]);
            tween(b, 'march', -0.02, 0.9, 13.8);
          }],
          [L[2], b => { W.set('joHorn', 1, b.instant); sfx(b, 'horn'); }],
          [16.9, b => {
            // 队伍转到城后去了——第一日
            for (const m of MARCH) attach(m[0], null);
            rmMarchers(); S.march = false;
            S.ark = 'ground'; S.arkX = X.ark; S.arkV = X.arkV;
            W.set('joRings', 1, b.instant);
            W.goTo(0.7, 11, b.instant);
            tween(b, 'comet', 1, 6, 9);
          }],
          [L[2] + 3.5, b => { W.set('joHorn', 0, b.instant); }],
          [18.7, b => W.set('joRings', 2, b.instant)],
          [20.5, b => W.set('joRings', 3, b.instant)],
          [22.3, b => W.set('joRings', 4, b.instant)],
          [24.1, b => W.set('joRings', 5, b.instant)],
          [25.9, b => { W.set('joRings', 6, b.instant); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },

    // ── 7 · 众百姓要大声呼喊，城墙就必塌陷（6:15–27）── 本卷的签名 ──
    {
      kind: 'cmd', utter: '众百姓要大声呼喊，城墙就必塌陷', cmd: 'shout && rm -rf 城墙 --except 朱红线绳', ref: '6:5', tint: [255, 214, 150],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        const R = () => rahabWin(getP('jericho'));
        T(c, [
          [0, b => {
            W.goTo(0.27, 5, b.instant);
            W.set('joRings', 0, b.instant);
            addMarchers(b, true);
            S.march = true; S.marchS = 0.36;
            for (const m of MARCH) marchAttach(m[0]);
            tween(b, 'march', 0.05, 0.36, 7.6);
            tween(b, 'comet', 0, 6, 7.2);
            // 百姓都到城前来（在城墙之下，谁也不挡住城墙）
            crowdWalk('isrA', 0.62, 0.79, { speed: 0.03 }); crowdWalk('isrB', 0.81, 0.95, { speed: 0.03 });
            vTo('isrA', [0.62, 0.86]); vTo('isrB', [0.62, 0.84]);
            walk('joshua', 0.645, { speed: 0.02 }); vTo('joshua', 0.46);
          }],
          [1.2, b => W.set('joRings7', 1, b.instant)],
          [2.4, b => W.set('joRings7', 2, b.instant)],
          [3.6, b => W.set('joRings7', 3, b.instant)],
          [4.8, b => W.set('joRings7', 4, b.instant)],
          [6.0, b => W.set('joRings7', 5, b.instant)],
          [7.2, b => W.set('joRings7', 6, b.instant)],
          [7.6, b => {
            // 第七次绕完：队伍站定，分站在城的两侧
            const E = ellG(), ph = PH(2), head = marchHead();
            for (const m of MARCH) {
              const id = m[0], f = fig(id), q = FLANK[id];
              if (!f || !q) continue;
              attach(id, null);
              const e = ellPt(head - MOFF[id] * DS, MDV[id] || 0);
              f.v = clamp(e.v, 0, 1); f.targetAlpha = 1;
              place(id, e.x / W.w);
              walk(id, (E.cx + q[0] * (E.rx + q[1] * ph)) / W.w, { speed: 0.05, pose: 'stand' });
              vTo(id, q[2]);
            }
            S.march = false;
            W.set('joRings7', 7, b.instant);
          }],
          [L[1] + 3.3, b => {
            // 祭司吹角（6:16）
            MARCH.forEach(m => face(m[0], -FLANK[m[0]][0]));
            HORNS.forEach(id => pose(id, 'carry'));
            W.set('joHorn', 1, b.instant); sfx(b, 'horn');
          }],
          [L[1] + 4.3, () => { face('joshua', 1); pose('joshua', 'raise'); crowdFace('isrA', 1); crowdFace('isrB', -1); }],
          [L[2], b => {
            // 百姓大声呼喊
            crowdPose('isrA', 'raise'); crowdPose('isrB', 'raise');
            MARCH.forEach(m => { if (m[2] !== 'bear') pose(m[0], 'raise'); });
            sfx(b, 'crowd'); sfx(b, 'horn');
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.45); }
          }],
          [L[2] + 0.8, b => {
            // 城墙就塌陷（6:20）：一段一段向外倒下，惟独系着朱红线绳的那一段仍站着
            prop('jericho', null, { fall: 1 });
            tween(b, 'rim', 1, 0, 6);
            const c0 = getP('jericho');
            if (c0) { const G = cityG(c0); shockAt(b, G.cx, cityBase(G, G.cx) + G.glH, G.hw * 1.8); }
            if (!b.instant) W.shake = Math.max(W.shake || 0, 1.1);
            sfx(b, 'thunder', { low: true }); sfx(b, 'stone');
          }],
          [L[2] + 2.4, b => {
            const c0 = getP('jericho');
            if (c0) { const G = cityG(c0); shockAt(b, G.cx, cityBase(G, G.cx) + G.glH * 1.5, G.hw * 2.4); }
            sfx(b, 'stone');
          }],
          [L[2] + 4.2, b => {
            W.set('joHorn', 0, b.instant); W.set('joRings7', 0, b.instant); HORNS.forEach(id => pose(id, 'stand'));
            // 各人往前直上；抬约柜的回到营里
            MARCH.forEach(m => { if (m[2] === 'arm' || m[2] === 'rear') { walk(m[0], 0.75 + 0.12 * rt(MOFF[m[0]] * 7), { speed: 0.045 }); vTo(m[0], 0.1 + 0.2 * rt(MOFF[m[0]] * 7 + 1)); } });
            BEARERS.forEach((id, i) => walk(id, X.ark + (i < 2 ? 0.013 : -0.014), { speed: 0.02 }));
            crowdWalk('isrA', 0.74, 0.88, { speed: 0.05 }); vTo('isrA', [0.08, 0.32]);
            pose('joshua', 'stand');
          }],
          [L[2] + 6.5, b => { prop('jericho', null, { fire: 1, smoke: 1 }); sfx(b, 'fire'); }],
          [L[3], b => {
            // 二人进那妓女的家，将喇合与她的父母、弟兄带出来（6:22–23）
            const q = R(), x = q.x / W.w, f = fromOf(b);
            add('rahab', { label: '喇合', sex: 'f', age: 'adult', x, v: 0.06, facing: 1, robe: ROBE.rahab, accent: [226, 70, 64], glow: 0.45, from: f });
            add('rahabF', { label: '喇合的父家', sex: 'm', age: 'elder', x: x + 0.01, v: 0.1, facing: 1, robe: [140, 120, 100], glow: 0.15, from: f });
            add('rahabM', { label: '喇合的父家', sex: 'f', age: 'elder', x: x + 0.02, v: 0.03, facing: 1, robe: [150, 116, 104], glow: 0.15, from: f });
            add('rahabB', { label: '喇合的父家', sex: 'm', age: 'child', x: x + 0.005, v: 0.14, facing: 1, robe: [130, 110, 90], glow: 0.15, from: f });
            add('spy1', { label: '探子', sex: 'm', age: 'adult', x: x - 0.012, v: 0.08, facing: 1, robe: ROBE.spy, glow: 0.2, from: f });
            add('spy2', { label: '探子', sex: 'm', age: 'adult', x: x + 0.028, v: 0.12, facing: 1, robe: ROBE.spy2, glow: 0.2, from: f });
            BEARERS.forEach(id => rm(id)); HORNS.forEach(id => rm(id));
            S.ark = 'ground'; S.arkX = X.ark; S.arkV = X.arkV; S.horns = false;
          }],
          [L[3] + 0.8, () => {
            // 安置在以色列的营外（城的右边，棕树下）
            [['spy1', -0.012, 0.44], ['rahab', 0, 0.5], ['rahabF', 0.012, 0.46], ['rahabM', 0.024, 0.54], ['rahabB', 0.006, 0.58], ['spy2', 0.036, 0.5]]
              .forEach(([id, dx, v]) => { walk(id, X.outside + dx, { speed: 0.03 }); vTo(id, v); });
          }],
          [L[3] + 3.2, b => {
            MARCH.forEach(m => { if (m[2] === 'arm' || m[2] === 'rear') rm(m[0]); });
            crowdWalk('isrA', 0.6, 0.7, { speed: 0.04 }); vTo('isrA', [0.04, 0.2]);
            crowdWalk('isrB', 0.64, 0.72, { speed: 0.04 }); vTo('isrB', [0.46, 0.64]);
            prop('jericho', null, { fire: 0.6 });
            sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 8 · 你向艾城伸出手里的短枪（7:1—8:35）── 亚干，亚割谷；艾城的烟 ──
    {
      kind: 'cmd', utter: '你向艾城伸出手里的短枪', cmd: 'git revert 亚干 && point 短枪 --at 艾城', ref: '8:18', tint: [255, 214, 180],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.6, 6, b.instant);
            ['rahab', 'rahabF', 'rahabM', 'rahabB', 'spy1', 'spy2'].forEach(id => rm(id));
            prop('jericho', null, { fire: 0, smoke: 0.35, ruin: 0.4 });
            // 亚干藏在帐棚内的地里的：一件美好的示拿衣服、银子、金子（7:21）
            prop('glint', 'glint', { x: X.tentW[3] - 0.002, v: 0.02, lit: 1, label: '当灭的物' });
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [L[1] - 0.5, b => {
            W.goTo(0.76, 7, b.instant);
            add('elder1', { label: '以色列的长老', sex: 'm', age: 'elder', x: X.ark + 0.03, v: 0.34, facing: -1, robe: ROBE.elder, glow: 0.12, from: fromOf(b) });
            add('elder2', { label: '以色列的长老', sex: 'm', age: 'elder', x: X.ark + 0.045, v: 0.4, facing: -1, robe: [150, 140, 120], glow: 0.12, from: fromOf(b) });
            walk('joshua', X.ark + 0.02, { speed: 0.025, pose: 'fall' }); vTo('joshua', 0.3);
          }],
          [L[1] + 1.5, () => { pose('elder1', 'fall'); pose('elder2', 'fall'); }],
          [L[1] + 5, b => { pose('joshua', 'stand'); face('joshua', 1); sfx(b, 'harp', { low: true }); }],
          [L[1] + 6, () => { pose('elder1', 'stand'); pose('elder2', 'stand'); }],
          [L[2], b => {
            W.goTo(0.02, 6, b.instant);
            prop('glint', null, { lit: 0 }); unprop('glint');
            prop('achor', 'cairn', { x: 0.745, v: 0.93, size: 1.25, grow: 1, label: '亚割谷的石堆' });
            sfx(b, 'stone');
          }],
          [L[2] + 3, () => { rm('elder1'); rm('elder2'); }],
          [L[3] - 1.5, b => {
            W.goTo(0.28, 5, b.instant);
            // 伏兵在城西（中丘的前沿，浅色的衣）
            crowd('ambush', { n: 7, x0: 0.69, x1: 0.735, layer: 1, v: 0.75, pose: 'kneel', label: '伏兵', robe: [226, 210, 172], glow: 0.2, from: fromOf(b) });
            vTo('ambush', [0.6, 0.9]);
            // 约书亚走到众人前面空旷的地方
            walk('joshua', 0.622, { speed: 0.035 }); vTo('joshua', 0.62);
          }],
          [L[3], b => { face('joshua', 1); pose('joshua', 'point'); S.spear = true; glow('joshua', 0.6); sfx(b, 'wind', { soft: true }); }],
          [L[3] + 1.2, () => { crowdPose('ambush', 'stand'); crowdWalk('ambush', X.ai - 0.014, X.ai + 0.014, { speed: 0.03, run: true }); vTo('ambush', [0.05, 0.3]); }],
          [L[3] + 3.6, b => { prop('ai', null, { fire: 1, smoke: 1 }); uncrowd('ambush'); sfx(b, 'fire'); }],
        ]);
      },
    },

    // ── 9 · 日头停留，月亮止住（9:1—10:43）── 基遍人；冰雹；那一日 ──────
    {
      kind: 'act', utter: '日头停留，月亮止住', cmd: 'sleep ∞ && touch 日头 月亮  # 约有一日之久', ref: '10:13', tint: [255, 236, 200],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.34, 5, b.instant);
            S.spear = false; glow('joshua', 0.45); pose('joshua', 'stand'); walk('joshua', 0.7, { speed: 0.02 }); vTo('joshua', 0.3);
            prop('ai', null, { fire: 0, smoke: 0.6, ruin: 1 });
            prop('jericho', null, { smoke: 0 });
            S.hostL = 0;
            const f = fromOf(b);
            // 基遍人：旧口袋、旧鞋、旧衣服，驴驮着破裂的皮酒袋（9:4–5）
            add('gib1', { label: '基遍人', sex: 'm', age: 'elder', x: 1.02, v: 0.3, facing: -1, robe: ROBE.gib, glow: 0.06, prop: 'staff', from: f });
            animal('don1', 'donkey', 1.05, { v: 0.34, facing: -1, pack: true, from: f, label: '驴' });
            add('gib2', { label: '基遍人', sex: 'm', age: 'adult', x: 1.08, v: 0.26, facing: -1, robe: [136, 128, 112], glow: 0.06, prop: 'bundle', from: f });
            add('gib3', { label: '基遍人', sex: 'm', age: 'adult', x: 1.11, v: 0.36, facing: -1, robe: [158, 142, 122], glow: 0.06, from: f });
            walk('gib1', 0.745, { speed: 0.03 }); walk('don1', 0.772, { speed: 0.03 }); walk('gib2', 0.79, { speed: 0.03 }); walk('gib3', 0.812, { speed: 0.03 });
            sfx(b, 'donkey');
          }],
          [3.6, () => { face('joshua', 1); }],
          [4.0, () => pose('gib1', 'bow')],
          [4.5, () => pose('gib2', 'kneel')],
          [5.0, () => pose('gib3', 'bow')],
          [L[1] - 1, b => {
            pose('gib1', 'stand'); pose('gib2', 'stand'); pose('gib3', 'stand');
            const p = figPt('joshua', 0.5);
            if (p) ringAt(b, p[0] + PH(2) * 0.8, p[1], [255, 236, 200], PH(2) * 1.6, 1.8);
            sfx(b, 'seal');
          }],
          [L[1], b => {
            walk('gib1', 1.05, { speed: 0.03 }); walk('don1', 1.08, { speed: 0.03 }); walk('gib2', 1.1, { speed: 0.03 }); walk('gib3', 1.12, { speed: 0.03 });
            // 五王的军在远山；耶和华从天上降大冰雹
            W.set('joHost', 0.75, b.instant);
            W.set('storm', 0.72, b.instant); W.set('rain', 0.32, b.instant); W.set('joHail', 1, b.instant); W.set('hail', 0.35, b.instant);
            prop('ai', null, { smoke: 0.2 });
            crowd('army', { n: 8, x0: 0.62, x1: 0.72, layer: 2, v: 0.14, label: '以色列的兵丁', robe: ROBE.arm, prop: 'staff', from: fromOf(b) });
            sfx(b, 'thunder');
          }],
          [L[1] + 1, () => crowdWalk('army', 1.02, 1.1, { speed: 0.045 })],
          [L[1] + 3.5, b => { W.set('joHost', 0, b.instant); }],
          [L[1] + 6.5, b => { rm('gib1'); rm('gib2'); rm('gib3'); rm('don1'); uncrowd('army'); }],
          [L[2], b => {
            W.set('storm', 0, b.instant); W.set('rain', 0, b.instant); W.set('joHail', 0, b.instant); W.set('hail', 0, b.instant);
            prop('ai', null, { smoke: 0 });
            // 日头在天当中（稍偏一点，不压在卷名上）
            W.goTo(0.46, 6.5, b.instant);
            walk('joshua', 0.68, { speed: 0.02, pose: 'raise' });
            crowdFace('isrA', -1); crowdFace('isrB', -1);
          }],
          [L[3], b => {
            W.set('joSun', 1, b.instant); W.set('joMoon', 1, b.instant);
            pose('joshua', 'gaze'); crowdPose('isrA', 'gaze'); crowdPose('isrB', 'gaze');
            sfx(b, 'angel'); sfx(b, 'harp', { soft: true });
          }],
        ]);
      },
    },

    // ── 10 · 你不要因他们惧怕（11:1—12:24）── 多如海边的沙；国中太平 ──
    {
      kind: 'promise', utter: '你不要因他们惧怕', cmd: 'kill -9 $(pgrep 车辆) && echo 国中太平', ref: '11:6', tint: [255, 226, 190],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        const CH = [['hzH1', 'horse', 0.735, 0.5], ['hzC1', 'wagon', 0.765, 0.5], ['hzH2', 'horse', 0.845, 0.3], ['hzC2', 'wagon', 0.875, 0.3], ['hzH3', 'horse', 0.93, 0.62]];
        T(c, [
          [0, b => {
            W.set('joSun', 0, b.instant); W.set('joMoon', 0, b.instant);
            pose('joshua', 'stand'); crowdPose('isrA', 'stand'); crowdPose('isrB', 'stand');
            W.goTo(0.68, 6, b.instant);
            // 北方诸王的众军，多如海边的沙，并有许多马匹车辆——在中丘上（11:4）
            S.hostL = 1;
            W.set('joHost', 1, b.instant);
            prop('hazor', 'hazor', { x: X.hazor, layer: 0, label: '夏琐' });
            const f = fromOf(b);
            CH.forEach(([id, kind, x, v]) => animal(id, kind, x, { layer: 1, v, facing: -1, from: f, label: '马匹车辆', pack: false }));
            follow('hzC1', 'hzH1', 0.03); follow('hzC2', 'hzH2', 0.03);
            face('joshua', -1);
            sfx(b, 'crowd', { far: true });
          }],
          [4.8, b => { W.goTo(0.9, 4, b.instant); }],
          [5.6, b => {
            // 用火焚烧他们的车辆（11:9）
            W.set('joFires', 1, b.instant); W.set('joHost', 0, b.instant);
            CH.forEach(([id]) => { unfollow(id); rm(id); });
            sfx(b, 'fire', { far: true });
          }],
          [7.2, b => { prop('hazor', null, { fire: 1, smoke: 1 }); }],
          [L[1], b => {
            // 国中太平
            W.goTo(0.31, 8, b.instant);
            W.set('joFires', 0, b.instant);
            prop('hazor', null, { fire: 0, smoke: 0.4 });
            W.set('bloom', 1, b.instant);
            W.setPop('bird', 40, W.w * 0.75, W.h * 0.35, b.instant);
          }],
          [L[1] + 4, b => { sfx(b, 'bird'); sfx(b, 'harp', { soft: true }); prop('hazor', null, { smoke: 0 }); }],
          [L[1] + 4.5, b => { tween(b, 'crowns', 0, 1, 10.5); sfx(b, 'stars', { soft: true }); }],
          [L[2] + 4, b => { unprop('hazor'); }],
        ]);
      },
    },

    // ── 11 · 将这地拈阄分给以色列人为业（13:1—16:10）── 迦勒；犹大；约瑟的子孙 ──
    {
      kind: 'cmd', utter: '将这地拈阄分给以色列人为业', cmd: 'shuf --lots 迦南 | split --tribes 9½', ref: '13:6', tint: [240, 226, 196],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.37, 5, b.instant);
            joshuaOld(b);
            prop('jericho', null, { ruin: 1, cord: 0, smoke: 0 });
            unprop('achor');
            ['palm1', 'palm2', 'palm3'].forEach(id => prop(id, null, { show: true }));
            add('eleazar', { label: '祭司以利亚撒', sex: 'm', age: 'elder', x: X.ark + 0.022, v: 0.36, facing: -1, robe: ROBE.eleazar, accent: [150, 170, 220], glow: 0.3, from: fromOf(b) });
            walk('joshua', X.ark - 0.024, { speed: 0.02 }); vTo('joshua', 0.36);
            // 摩西在约旦河东已分给的两个半支派（13:8）
            lot(b, 'reuben'); lot(b, 'gad'); lot(b, 'manE');
            sfx(b, 'chime');
          }],
          [2.5, () => { face('joshua', 1); pose('joshua', 'raise'); pose('eleazar', 'raise'); }],
          [5, () => { pose('joshua', 'stand'); pose('eleazar', 'stand'); }],
          [L[1] - 0.5, b => {
            add('caleb', { label: '迦勒', sex: 'm', age: 'elder', x: 0.63, v: 0.42, facing: 1, robe: ROBE.caleb, glow: 0.3, prop: 'staff', from: fromOf(b) });
            walk('caleb', X.ark - 0.045, { speed: 0.028 });
          }],
          [L[1] + 3, () => { face('caleb', 1); pose('caleb', 'point'); face('joshua', -1); }],
          [L[1] + 6, b => {
            pose('caleb', 'stand'); pose('joshua', 'raise');
            const p = figPt('caleb', 0.6);
            if (p) ringAt(b, p[0], p[1], [255, 232, 180], PH(2) * 1.6, 1.8);
            sfx(b, 'harp');
          }],
          [L[2] - 0.8, b => {
            pose('joshua', 'stand');
            walk('caleb', 1.04, { speed: 0.03 });
            prop('hebron', 'town', { x: X.hebron, layer: 1, size: 1.1, grow: 1, lit: 0.8, label: '希伯仑' });
          }],
          [L[2], b => { lot(b, 'judah'); sfx(b, 'chime'); }],
          [L[3], b => { lot(b, 'ephraim'); lot(b, 'manW'); rm('caleb'); sfx(b, 'chime'); }],
        ]);
      },
    },

    // ── 12 · 为自己设立逃城（17:1—20:9）── 西罗非哈的女儿；示罗；拈阄；逃城 ──
    {
      kind: 'cmd', utter: '为自己设立逃城', cmd: 'mkdir -p 逃城/{基低斯,示剑,希伯仑,比悉,拉末,哥兰}', ref: '20:2', tint: [255, 220, 170],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        const DAU = [['d1', '玛拉'], ['d2', '挪阿'], ['d3', '曷拉'], ['d4', '密迦'], ['d5', '得撒']];
        T(c, [
          [0, b => {
            W.goTo(0.4, 4, b.instant);
            S.lotDim = true;
            DAU.forEach(([id, nm], i) => {
              add(id, { label: nm + '（西罗非哈的女儿）', sex: 'f', age: 'adult', x: 0.6 + i * 0.008, v: 0.5 + (i % 2) * 0.08, facing: 1, robe: [[176, 120, 110], [150, 130, 160], [190, 160, 110], [130, 150, 130], [180, 140, 150]][i], glow: 0.18, from: fromOf(b) });
              walk(id, X.ark - 0.05 + i * 0.009, { speed: 0.022 });
            });
          }],
          [4, () => { pose('d1', 'bow'); pose('d4', 'kneel'); face('joshua', -1); face('eleazar', -1); }],
          [4.4, () => { pose('d2', 'kneel'); pose('d5', 'kneel'); }],
          [4.8, () => pose('d3', 'bow')],
          [6, b => {
            pose('joshua', 'raise');
            const p = getP('lot_manW');
            if (p) { const q = lotXY(p); sparkAt(b, q[0], q[1] - PH(1) * 0.3, 20, [200, 236, 180], PH(1), 'mid'); }
          }],
          [L[1] - 1, () => { pose('joshua', 'stand'); DAU.forEach(([id]) => pose(id, 'stand')); }],
          [L[1], b => {
            // 会幕设立在示罗；营离开吉甲
            prop('tab', 'tab', { x: X.shiloh, layer: 1, size: 1, grow: 1, label: '示罗的会幕' });
            S.ark = 'none';
            tentsW(false);
            S.camp = 'shiloh';
            crowdWalk('isrA', 0.7, 0.88, { speed: 0.025 }); crowdWalk('isrB', 0.66, 0.8, { speed: 0.025 });
            vTo('isrA', [0.04, 0.2]); vTo('isrB', [0.3, 0.5]);
            walk('joshua', X.shiloh - 0.02, { speed: 0.025 }); walk('eleazar', X.shiloh + 0.006, { speed: 0.025 });
            DAU.forEach(([id], i) => walk(id, 0.64 + i * 0.01, { speed: 0.022 }));
            sfx(b, 'angel', { soft: true });
            avoid([0.38, 1]);
          }],
          [L[2], b => { pose('joshua', 'raise'); pose('eleazar', 'raise'); sfx(b, 'chime'); }],
          ...['benjamin', 'simeon', 'zebulun', 'issachar', 'asher', 'naphtali', 'dan'].map((id, i) => [L[2] + 0.4 + i * 0.75, b => lot(b, id)]),
          [L[2] + 5.5, () => { pose('joshua', 'stand'); pose('eleazar', 'stand'); DAU.forEach(([id]) => rm(id)); }],
          [L[3], b => {
            REFUGE.forEach(q => prop('ref_' + q[0], 'refuge', { layer: q[1], x: q[2], v: q[3], grow: 1, label: '逃城' + q[4] }));
            sfx(b, 'harp');
          }],
        ]);
      },
    },

    // ── 13 · 一句也没有落空，都应验了（21:1—23:16）── 利未人的城；证坛；约书亚的遗言 ──
    {
      kind: 'act', utter: '一句也没有落空，都应验了', cmd: 'assert(应许.every(话 => 话.应验))  # 没有一句落空', ref: '21:45', tint: [255, 236, 196],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        const TOWNS = [['tw1', 1, 0.58], ['tw2', 1, 0.712], ['tw3', 1, 0.9], ['tw4', 0, 0.62], ['tw5', 0, 0.74], ['tw6', 0, 0.86], ['tw7', 0, 0.97]];
        T(c, [
          [0, b => {
            W.goTo(0.46, 5, b.instant);
            // 利未人的四十八座城；以色列人住在其中
            W.set('joLevi', 1, b.instant);
            TOWNS.forEach(q => prop(q[0], 'town', { layer: q[1], x: q[2], size: q[1] ? 0.9 : 1.1, grow: 1, label: '以色列人的城邑' }));
            S.lotDim = true;
            sfx(b, 'harp', { soft: true });
          }],
          [L[1] - 0.8, b => {
            crowd('east', { n: 8, x0: 0.66, x1: 0.74, layer: 2, v: 0.22, label: '吕便人、迦得人、玛拿西半支派的人', prop: 'bundle', from: fromOf(b) });
          }],
          [L[1] + 0.5, () => crowdWalk('east', 0.615, 0.65, { speed: 0.028 })],
          [L[1] + 2.5, b => { prop('witness', 'altar', { x: 0.627, v: 0.1, size: 1.25, grow: 1, label: '证坛' }); sfx(b, 'build'); }],
          [L[1] + 4.5, b => {
            prop('witness', null, { lit: 1 });
            const p = getP('witness');
            if (p) nameHere(b, '证坛', p.x * W.w, baseOf(p) - PH(2) * 1.1, [255, 234, 196], { size: 0.036 });
            crowdWalk('east', 0.42, 0.5, { speed: 0.028 });
          }],
          [L[2] - 1, b => {
            W.goTo(0.7, 9, b.instant);
            uncrowd('east');
            crowd('elders', { n: 7, x0: X.shiloh - 0.06, x1: X.shiloh + 0.07, layer: 2, v: 0.46, label: '以色列的长老', robe: ROBE.elder, pose: 'kneel', from: fromOf(b) });
            vTo('elders', [0.38, 0.6]);
            rm('eleazar');
            walk('joshua', X.shiloh, { speed: 0.02 }); vTo('joshua', 0.22);
          }],
          [L[2] + 1, b => { face('joshua', 1); pose('joshua', 'raise'); crowdFace('elders', -1); }],
          [L[2] + 6, () => pose('joshua', 'stand')],
        ]);
      },
    },

    // ── 14 · 我赐给你们地土，非你们所修治的（24:1–33）── 示剑；约瑟的骸骨 ──
    {
      kind: 'bless', utter: '我赐给你们地土，非你们所修治的', cmd: 'deploy 葡萄园 橄榄园 --prebuilt  # 至于我和我家', ref: '24:13', tint: [255, 230, 176], hold: 3.2,
      verse: V14,
      apply(c) {
        const L = starts(V14);
        const HOUSE = [['hh1', 'f', 'adult', 0.01], ['hh2', 'm', 'adult', 0.022], ['hh3', 'f', 'child', 0.03]];
        const CB = ['cb1', 'cb2', 'cb3', 'cb4'];
        T(c, [
          [0, b => {
            W.goTo(0.56, 4, b.instant);
            uncrowd('elders');
            unprop('jericho'); ['palm1', 'palm2', 'palm3'].forEach(id => unprop(id)); unprop('field');
            // 非你们所栽种的葡萄园、橄榄园
            W.set('joGroves', 1, b.instant);
            prop('oak', 'oak', { x: X.oak, v: 0, size: 1.25, grow: 1, label: '示剑的橡树' });
            S.camp = 'shechem';
            crowdWalk('isrA', 0.76, 0.96, { speed: 0.025 }); crowdWalk('isrB', 0.8, 0.95, { speed: 0.025 });
            vTo('isrA', [0.06, 0.3]); vTo('isrB', [0.36, 0.6]);
            walk('joshua', X.oak - 0.005, { speed: 0.02 }); vTo('joshua', 0.12);
            HOUSE.forEach(([id, sex, age, dx]) => {
              add(id, { label: '约书亚的家', sex, age, x: X.oak - 0.045 - dx, v: 0.34 + dx * 2, facing: 1, robe: [[150, 120, 110], [120, 110, 96], [170, 150, 120]][HOUSE.findIndex(h => h[0] === id)], glow: 0.18, from: fromOf(b) });
            });
            sfx(b, 'harp');
            avoid([0.38, 1]);
          }],
          [2, () => { face('joshua', 1); pose('joshua', 'raise'); }],
          [L[1] - 2, () => { crowdPose('isrA', 'raise'); crowdPose('isrB', 'raise'); crowdFace('isrA', -1); crowdFace('isrB', -1); }],
          [L[1], b => {
            pose('joshua', 'stand'); crowdPose('isrA', 'stand'); crowdPose('isrB', 'stand');
            prop('stele', 'stele', { x: X.stele, v: 0.04, grow: 1, lit: 1, label: '大石头' });
            const p = getP('oak');
            if (p) ringAt(b, X.stele * W.w, baseOf(p), [255, 232, 180], PH(2) * 2.2, 2);
            sfx(b, 'seal');
          }],
          [L[2], b => {
            W.goTo(0.745, 9, b.instant);
            prop('stele', null, { lit: 0.4 });
            pose('joshua', 'lie');
            soul(b, 'joshua');
            HOUSE.forEach(([id]) => pose(id, 'weep'));
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] + 2.6, () => { rm('joshua'); crowdPose('isrA', 'kneel'); crowdPose('isrB', 'kneel'); }],
          [L[3] - 0.5, b => {
            // 约瑟的骸骨：从埃及带上来的棺（创 50:25–26）
            prop('coffin', 'coffin', { x: 0.68, v: 0.5, grow: 1, lit: 0.6, label: '约瑟的骸骨' });
            prop('coffin', null, { tx: X.grave, spd: 0.024 });
            CB.forEach((id, i) => {
              add(id, { label: '抬骸骨的人', sex: 'm', age: 'adult', x: 0.665 + (i % 2) * 0.03, v: 0.46 + (i > 1 ? 0.06 : 0), facing: 1, robe: [130 + i * 6, 110, 90], glow: 0.1, from: fromOf(b) });
              walk(id, X.grave - 0.015 + (i % 2) * 0.03, { speed: 0.024 });
            });
            HOUSE.forEach(([id]) => pose(id, 'stand'));
          }],
          [L[3] + 5, b => {
            prop('coffin', null, { grow: 0, bury: 1, lit: 1 });
            pose('cb1', 'bow'); pose('cb2', 'kneel');
            sfx(b, 'harp', { low: true });
          }],
          [L[3] + 5.5, () => { pose('cb3', 'kneel'); pose('cb4', 'bow'); }],
          [L[3] + 7, b => {
            W.goTo(0.86, 22, b.instant);
            prop('coffin', null, { lit: 0.5 });
            crowdPose('isrA', 'stand'); crowdPose('isrB', 'stand');
          }],
        ]);
      },
    },
  ];

  const STAND = { text: '于是日头停留，月亮止住……在这日以前，这日以后，耶和华听人的祷告，没有像这日的，是因耶和华为以色列争战。', ref: '约书亚记 10:13–14' };
  const LOTTXT = { text: '约书亚就在示罗，耶和华面前，为他们拈阄。约书亚在那里，按着以色列人的支派，将地分给他们。', ref: '约书亚记 18:10' };
  const REFTXT = { text: '「……使那无心而误杀人的，可以逃到那里。这些城可以作你们逃避报血仇人的地方。」', ref: '约书亚记 20:3' };
  GS.book.act({
    id: ACT, book: '约书亚记', books: [6], title: '耶利哥', sub: '约书亚记 1 — 24', tint: [255, 210, 160], music: 'abraham',
    outro: 20,
    intro: INTRO,
    // 全卷终后，按住本卷的人与物，显出与它相关的经文
    behold: {
      '约书亚': { text: '当那日，耶和华使约书亚在以色列众人眼前尊大。在他平生的日子，百姓敬畏他，像从前敬畏摩西一样。', ref: '约书亚记 4:14' },
      '喇合': { text: '约书亚却把妓女喇合与她父家，并她所有的，都救活了……她就住在以色列中，直到今日。', ref: '约书亚记 6:25' },
      '朱红线绳': { text: '「我们来到这地的时候，你要把这条朱红线绳系在缒我们下去的窗户上……」', ref: '约书亚记 2:18' },
      '探子': { text: '又对约书亚说：「耶和华果然将那全地交在我们手中；那地的一切居民在我们面前心都消化了。」', ref: '约书亚记 2:24' },
      '约柜': { text: '约书亚说：「看哪，普天下主的约柜必在你们前头过去，到约旦河里……」', ref: '约书亚记 3:10' },
      '抬约柜的祭司': { text: '抬耶和华约柜的祭司在约旦河中的干地上站定，以色列众人都从干地上过去……', ref: '约书亚记 3:17' },
      '约旦河': { text: '「……约旦河的水，就是从上往下流的水，必然断绝，立起成垒。」', ref: '约书亚记 3:13' },
      '立起成垒的水': { text: '那从上往下流的水便在极远之地、撒拉但旁的亚当城那里停住，立起成垒……', ref: '约书亚记 3:16' },
      '十二块石头': { text: '「日后你们的子孙问他们的父亲说：『这些石头是什么意思？』你们就告诉他们说：『以色列人曾走干地过这约旦河。』」', ref: '约书亚记 4:21–22' },
      '河中的十二块石头': { text: '约书亚另把十二块石头立在约旦河中，在抬约柜的祭司脚站立的地方；直到今日，那石头还在那里。', ref: '约书亚记 4:9' },
      '吉甲的营': { text: '耶和华对约书亚说：「我今日将埃及的羞辱从你们身上滚去了。」因此，那地方名叫吉甲，直到今日。', ref: '约书亚记 5:9' },
      '以色列人的帐棚': { text: '约书亚清早起来，和以色列众人都离开什亭，来到约旦河，就住在那里，等候过河。', ref: '约书亚记 3:1' },
      '大麦田': { text: '逾越节的次日，他们就吃了那地的出产；正当那日吃无酵饼和烘的谷。', ref: '约书亚记 5:11' },
      '耶和华军队的元帅': { text: '他回答说：「不是的，我来是要作耶和华军队的元帅。」', ref: '约书亚记 5:14' },
      '耶利哥': { text: '耶利哥的城门因以色列人就关得严紧，无人出入。', ref: '约书亚记 6:1' },
      '耶利哥的废墟': { text: '于是百姓呼喊，祭司也吹角。百姓听见角声，便大声呼喊，城墙就塌陷……', ref: '约书亚记 6:20' },
      '吹角的祭司': { text: '七个祭司要拿七个羊角走在约柜前。到第七日，你们要绕城七次，祭司也要吹角。', ref: '约书亚记 6:4' },
      '带兵器的': { text: '带兵器的走在吹角的祭司前面，后队随着约柜行。祭司一面走一面吹。', ref: '约书亚记 6:9' },
      '后队': { text: '带兵器的走在吹角的祭司前面，后队随着约柜行。祭司一面走一面吹。', ref: '约书亚记 6:9' },
      '棕树': { text: '以色列人在吉甲安营。正月十四日晚上，在耶利哥的平原守逾越节。', ref: '约书亚记 5:10' },
      '逾越节的火': { text: '以色列人在吉甲安营。正月十四日晚上，在耶利哥的平原守逾越节。', ref: '约书亚记 5:10' },
      '马匹车辆': { text: '这些王和他们的众军都出来，人数多如海边的沙，并有许多马匹车辆。', ref: '约书亚记 11:4' },
      '艾城': { text: '艾城的人回头一看，不料，城中烟气冲天，他们就无力向左向右逃跑。', ref: '约书亚记 8:20' },
      '亚割谷的石堆': { text: '众人在亚干身上堆成一大堆石头，直存到今日。于是耶和华转意，不发他的烈怒。因此那地方名叫亚割谷，直到今日。', ref: '约书亚记 7:26' },
      '基遍人': { text: '他们回答说：「仆人从极远之地而来，是因听见耶和华你神的名声和他在埃及所行的一切事。」', ref: '约书亚记 9:9' },
      '夏琐': { text: '当时，约书亚转回夺了夏琐，用刀击杀夏琐王。（素来夏琐在这诸国中是为首的。）', ref: '约书亚记 11:10' },
      '祭司以利亚撒': LOTTXT,
      '迦勒': { text: '于是约书亚为耶孚尼的儿子迦勒祝福，将希伯仑给他为业。', ref: '约书亚记 14:13' },
      '希伯仑': { text: '所以希伯仑作了基尼洗族耶孚尼的儿子迦勒的产业，直到今日，因为他专心跟从耶和华以色列的神。', ref: '约书亚记 14:14' },
      '示罗的会幕': { text: '以色列的全会众都聚集在示罗，把会幕设立在那里，那地已经被他们制伏了。', ref: '约书亚记 18:1' },
      '吕便': { text: '吕便人的境界就是约旦河与靠近约旦河的地。', ref: '约书亚记 13:23' },
      '迦得': { text: '摩西按着迦得支派的宗族分给他们产业。', ref: '约书亚记 13:24' },
      '玛拿西（约旦河东）': { text: '摩西把产业分给玛拿西半支派，是按着玛拿西半支派的宗族所分的。', ref: '约书亚记 13:29' },
      '玛拿西': { text: '玛拿西是约瑟的长子，他的支派拈阄所得之地记在下面。', ref: '约书亚记 17:1' },
      '犹大': { text: '犹大支派按着宗族拈阄所得之地是在尽南边，到以东的交界，向南直到寻的旷野。', ref: '约书亚记 15:1' },
      '以法莲': { text: '约瑟的儿子玛拿西、以法莲就得了他们的地业。', ref: '约书亚记 16:4' },
      '便雅悯': LOTTXT, '西缅': LOTTXT, '西布伦': LOTTXT, '以萨迦': LOTTXT, '亚设': LOTTXT, '拿弗他利': LOTTXT, '但': LOTTXT,
      '逃城基低斯': REFTXT, '逃城示剑': REFTXT, '逃城希伯仑': REFTXT, '逃城哥兰': REFTXT, '逃城拉末': REFTXT, '逃城比悉': REFTXT,
      '以色列人的城邑': { text: '利未人在以色列人的地业中所得的城，共四十八座，并有属城的郊野。', ref: '约书亚记 21:41' },
      '证坛': { text: '吕便人、迦得人给坛起名叫证坛，意思说：这坛在我们中间证明耶和华是神。', ref: '约书亚记 22:34' },
      '示剑的橡树': { text: '约书亚将这些话都写在神的律法书上，又将一块大石头立在橡树下耶和华的圣所旁边。', ref: '约书亚记 24:26' },
      '大石头': { text: '约书亚对百姓说：「看哪，这石头可以向我们作见证；因为是听见了耶和华所吩咐我们的一切话……」', ref: '约书亚记 24:27' },
      '约书亚的家': { text: '「……至于我和我家，我们必定事奉耶和华。」', ref: '约书亚记 24:15' },
      '约瑟的骸骨': { text: '以色列人从埃及所带来约瑟的骸骨，葬埋在示剑……这就作了约瑟子孙的产业。', ref: '约书亚记 24:32' },
      '以色列人': { text: '约书亚在世和约书亚死后，那些知道耶和华为以色列人所行诸事的长老还在的时候，以色列人事奉耶和华。', ref: '约书亚记 24:31' },
      '日头': STAND,
      '十二个人': { text: '以色列人就照约书亚所吩咐的，按着以色列人支派的数目，从约旦河中取了十二块石头……', ref: '约书亚记 4:8' },
      '以色列的长老': { text: '就把以色列众人的长老、族长、审判官，并官长都召了来，对他们说：「我年纪已经老迈。」', ref: '约书亚记 23:2' },
      '伏兵': { text: '他一伸手，伏兵就从埋伏的地方急忙起来，夺了城，跑进城去，放火焚烧。', ref: '约书亚记 8:19' },
      '以色列的兵丁': { text: '于是约书亚和他一切兵丁，并大能的勇士，都从吉甲上去。', ref: '约书亚记 10:7' },
      '吕便人、迦得人、玛拿西半支派的人': { text: '吕便人、迦得人，和玛拿西半支派的人到了靠近约旦河的一带迦南地，就在约旦河那里筑了一座坛；那坛看着高大。', ref: '约书亚记 22:10' },
      '当灭的物': { text: '「我在所夺的财物中看见一件美好的示拿衣服，二百舍客勒银子，一条金子重五十舍客勒，我就贪爱这些物件，便拿去了……」', ref: '约书亚记 7:21' },
      '抬骸骨的人': { text: '以色列人从埃及所带来约瑟的骸骨，葬埋在示剑……这就作了约瑟子孙的产业。', ref: '约书亚记 24:32' },
      '百姓的官长': { text: '「你们要走遍营中，吩咐百姓说：『当预备食物；因为三日之内你们要过这约旦河……』」', ref: '约书亚记 1:11' },
      '耶利哥王的人': { text: '那些人就往约旦河的渡口追赶他们去了。追赶他们的人一出去，城门就关了。', ref: '约书亚记 2:7' },
      '喇合的父家': { text: '当探子的两个少年人就进去，将喇合与她的父母、弟兄，和她所有的，并她一切的亲眷，都带出来，安置在以色列的营外。', ref: '约书亚记 6:23' },
      ...Object.fromEntries(['玛拉', '挪阿', '曷拉', '密迦', '得撒'].map(n => [n + '（西罗非哈的女儿）', { text: '……于是约书亚照耶和华所吩咐的，在她们伯叔中，把产业分给她们。', ref: '约书亚记 17:4' }])),
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._joshua = { get S() { return S; }, P, X, TW, riverAtV, ellPt, rPt, rv };
})(window.GS);
