/* ─────────────────────────────────────────────────────────────
 * book/plagues.js —— 出埃及记 · 十灾（出埃及记 5 — 13:16）
 *
 * 「容我的百姓去」——法老不认识耶和华；不给草，百姓散在埃及遍地捡碎秸；
 * 「我是耶和华」——名在暮色的天上聚成，伸出来的膀臂是一道越过全地的光；
 * 亚伦的杖变作蛇，吞了术士们的杖；十灾——同一片埃及的地，一次又一次地变了样子：
 *   河水变作血（暗红的尼罗河）· 青蛙遮满了地，死了聚成堆 · 尘土变作虱子 ·
 *   成群的苍蝇（歌珊地前一道光，蝇不能过）· 牲畜卧倒、隐去，惟以色列的羊群无恙 ·
 *   炉灰扬向天，化为落下的灰 · 雹与火搀杂（签名一：乌云、白雹、贴地奔走的火；歌珊地上一道阳光）·
 *   东风一昼一夜，早晨蝗虫遮满地面，西风又把它们吹入红海 ·
 *   遍地乌黑三天，「惟有以色列人家中都有亮光」（签名二：全地漆黑，只有歌珊的屋里亮着）·
 *   逾越节：羊羔、门楣与门框上的血 · 半夜：一阵苍白的风自西而东走过全地，埃及的灯一盏一盏地熄了，
 *   有血的门被越过 · 大哀号 · 月下出埃及，扛着抟面盆 · 黎明：父亲对儿子说「这是什么意思」。
 *
 * 画面的方位（画面宽度的比例）：
 *   0.42–0.52 尼罗河（在近地之内自地的轮廓流向观者；西岸是海边的一条沙地） · 0.48–0.6 法老的宫、宝座（青金石的华盖）、术士 ·
 *   0.57–0.65 田（麻与大麦）· 0.66–0.74 埃及的牲畜 · 0.63–0.75 埃及人的房屋（兰塞城） · 0.75–0.81 砖场、草堆、窑 ·
 *   0.818–1 歌珊：三家以色列人的屋（门都朝西）、羊群。
 *   出埃及的行列自歌珊向左（向东、向日出、向海）而行；大队（六十万人、牛羊、火把）是中丘上自右向左的一长行。远处中丘上是金字塔。
 * 一切位置都以比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'plagues';
  const isCur = () => GS.book.current(ACT);

  // ── 本幕的程度（缓动；恢复存档时由 W.snapAll 对齐）──────────────
  W.defineLevel('plBlood', 'exp', 0.32);     // 河水变作血（7:20）
  W.defineLevel('plFrog', 'lin', 0.3);       // 青蛙上来，遮满了地（8:6）
  W.defineLevel('plFrogDie', 'exp', 0.45);   // 青蛙都死了（8:13）
  W.defineLevel('plHeap', 'lin', 0.16);      // 聚拢成堆（8:14）
  W.defineLevel('plFrogGone', 'exp', 0.3);   // 堆也渐渐没了（下一灾时）
  W.defineLevel('plLice', 'exp', 0.4);       // 尘土变作虱子（8:17）
  W.defineLevel('plFly', 'exp', 0.38);       // 成群的苍蝇（8:24）
  W.defineLevel('plWall', 'exp', 0.45);      // 分别：歌珊地前的一道光（8:22；9:4；9:26）
  W.defineLevel('plAsh', 'exp', 0.3);        // 炉灰化为尘土落下（9:9–10）
  W.defineLevel('plHail', 'exp', 0.5);       // 雹与火（9:23–24）
  W.defineLevel('plShine', 'exp', 0.4);      // 歌珊地上的一道阳光（9:26）
  W.defineLevel('plCrop', 'exp', 0.35);      // 田间的麻与大麦：1 立着，0.35 被雹击打，0 被蝗虫吃尽
  W.defineLevel('plLocust', 'exp', 0.3);     // 蝗虫的密（10:14）
  W.defineLevel('plLocX', 'exp', 0.22);      // 蝗虫的位置：-1 在东边（左）海上，0 落在埃及，-1.9 被吹入红海
  W.defineLevel('plStrip', 'lin', 0.09);     // 连一点青的也没有留下（10:15）
  W.defineLevel('plDark', 'exp', 0.3);       // 埃及遍地乌黑（10:22）
  W.defineLevel('plName', 'exp', 0.45);      // 名的光晕（6:2）
  W.defineLevel('plHost', 'lin', 0.045);     // 出埃及的大队：中丘上一长行自右向左的人与火把（12:37–38）
  W.defineLevel('plShade', 'exp', 0.25);     // 黎明：埃及的城退入阴影（出埃及记 13）

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    nileT: 0.47, nileB: 0.468,              // 尼罗河在近地之内：西岸是海边的一条沙地，东岸是宫
    mag: [0.484, 0.493], throne: 0.505, palace: 0.536,
    aaronP: 0.523, mosesP: 0.537,           // 在法老面前
    field1: 0.594, field2: 0.63,
    houses: [0.648, 0.694, 0.74],
    straw: 0.762, bricks: 0.779, kiln: 0.803,
    wall: 0.818,
    huts: [0.846, 0.9, 0.954],
  };
  const ROBE = {
    moses: [92, 98, 132], aaron: [168, 128, 78], pharaoh: [244, 238, 220],
    mag: [[70, 62, 84], [96, 72, 62], [58, 70, 76]], task: [[196, 170, 124], [182, 158, 118]],
    egy: [[232, 224, 204], [222, 212, 190], [238, 230, 214], [214, 202, 176], [228, 216, 196]],
    heb: [[132, 104, 78], [110, 86, 70], [150, 118, 90], [96, 80, 72], [120, 100, 84], [104, 96, 110], [140, 96, 80], [158, 138, 108], [122, 108, 92]],
    woman: [[150, 108, 96], [138, 112, 128], [156, 124, 100]],
  };
  const GOLD = [236, 194, 96], LAPIS = [64, 98, 160];
  const BLOOD = [128, 18, 26];

  // 以色列人：九个在砖场做工的人（其中四个是四家的父亲），歌珊的妇人与孩子
  const HEB = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'];
  const FATHERS = ['h1', 'h2', 'h3'];
  const HOME = ['w1', 'w2', 'c1', 'c2'];
  const EGY = ['e1', 'e2', 'e3', 'e4'];
  const DIGW = ['e5', 'e6'], DIGW_V = [0.2, 0.34];    // 在河的西岸挖地的两个埃及人（只在河水变血的那一句里）
  const MAGS = ['mag1', 'mag2'];
  const TASK = ['t1', 't2'];
  const ECOWS = ['ec1', 'ec2', 'ec3'];
  const EBEASTS = ['edonkey'];
  const ISHEEP = ['is1', 'is2', 'is3', 'is4', 'is5'];
  const LAMBS = ['lb1', 'lb2', 'lb3'];

  // ── 本幕的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { staffA: 1, mosesLamp: 0, column: 0 }; }   // 亚伦手里有杖、摩西身边的光（黑暗中）、已起行

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
  let DIM = 0;      // 黎明时埃及的城退入阴影：画埃及的物件时把颜色压暗
  const css = (rgb, l, a, ex) => W.shadeCSS(DIM > 0.001 ? [rgb[0] * (1 - DIM), rgb[1] * (1 - DIM), rgb[2] * (1 - DIM)] : rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g); };
  const dayA = () => 0.3 + 0.7 * W.daylight;
  const port = () => W.w < W.h * 0.9;

  // 确定性的随机表
  const RT = [];
  (function () { const r = U.mulberry32(5121); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // 人物（皆经人物模块；新的接口若不在，只是不显出）
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function run(id, x, o) { if (!fig(id)) return; const c = C(); if (c.run) c.run(id, x, o); else c.walk(id, x, Object.assign({ speed: 0.085 }, o || {})); }
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
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function say(b, lines, delay) {           // 情节中途的旁白（重演时不放）
    if (b.instant) return;
    GS.ui.narrate(lines, { replace: false, delay: delay || 0 });
  }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  const fromOf = b => (b.instant ? 'none' : 'fade');
  // 一群人各走到 [x0, x1] 之间确定的位置（先后略有参差）
  function spread(ids, x0, x1, o) {
    o = o || {};
    const live = ids.filter(id => fig(id)), n = live.length;
    live.forEach((id, i) => {
      const x = n > 1 ? lerp(x0, x1, i / (n - 1)) + (rt(i * 13 + (o.seed || 0)) - 0.5) * (o.jit || 0) : (x0 + x1) / 2;
      walk(id, x, { speed: (o.speed || 0.03) * (0.85 + 0.3 * rt(i * 7 + (o.seed || 0))), pose: o.pose, run: o.run });
    });
  }
  function poseAll(ids, p, o) { ids.forEach(id => pose(id, p, o)); }
  function faceAll(ids, d) { ids.forEach(id => face(id, d)); }
  function holdAll(ids, what) { ids.forEach(id => hold(id, what)); }
  function rmAll(ids, now) { ids.forEach(id => rm(id, now)); }
  // 地上的走兽绕开主要人物所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

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
    const h = f.isAnimal ? 20 * LS(l) : 34 * LS(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * (1 + 0.35 * (f.v || 0)) * (W.w < 600 ? 1.4 / 1.15 : 1) * 1.3;
    return [x, y - h * frac];
  }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  const EASE = { a: 0.8, grow: 0.35, lit: 0.6, out: 0.9, stain: 0.34, fire: 0.6 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  // prop(id, kind, { x, layer, size, label, flip, variant, v, show, grow, lit, out, stain, fire })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind: kind || 'house', x: 0.5, layer: 2, size: 1, label: '', seed: hashStr(id), flip: 1, v: 0, variant: '' };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'layer', 'size', 'label', 'flip', 'v', 'variant']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
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
  const ORDER = { pyramid: -3, field: -2, palm: -1, palace: 0, house: 0, hut: 0, kiln: 0, bricks: 1, straw: 1, throne: 2 };
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
      pale: radial([214, 226, 255], 1), smoke: radial([132, 124, 118], 0.8, 0.55), ember: radial([255, 120, 40], 1),
      red: radial([200, 30, 36], 1), ash: radial([150, 146, 142], 0.7, 0.5), dark: radial([4, 4, 8], 1, 0.6),
      murk: radial([40, 34, 30], 0.9, 0.5), fly: radial([20, 18, 16], 0.8, 0.5), green: radial([168, 214, 132], 1),
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
    // 蝗虫的云：无数短短的暗色小划（一只只振翅的蝗虫），聚成一团（预绘，高分辨率，缩放后仍是虫而不是噪点）
    const lc = cnv(1024, 512), lg = lc.getContext('2d'), r = U.mulberry32(9917);
    const NB = 6, buckets = [];
    for (let b = 0; b < NB; b++) buckets.push(new Path2D());
    for (let i = 0; i < 17000; i++) {
      const a = r() * TAU, rr = Math.pow(r(), 0.62);
      const x = 512 + Math.cos(a) * rr * 500 * (0.9 + 0.1 * r()), y = 256 + Math.sin(a) * rr * 236 * (0.85 + 0.15 * r());
      const d = 1 - rr, al = 0.3 + 0.62 * d * r();
      const L = 2 + (r() < 0.45 ? 1.2 : 0), tilt = (r() - 0.5) * 1.4;
      const P2 = buckets[Math.min(NB - 1, Math.floor(al * NB))];
      P2.moveTo(x, y); P2.lineTo(x + L, y + tilt); P2.lineTo(x + L, y + tilt + 1.3); P2.lineTo(x, y + 1.3); P2.closePath();
    }
    buckets.forEach((P2, b) => { lg.fillStyle = U.rgba(42, 33, 18, (b + 0.5) / NB); lg.fill(P2); });
    SP.swarm = lc;
    return SP;
  }

  // ════════════════════════════════════════════════════════════
  //  画：火与烟、柔光、灯
  // ════════════════════════════════════════════════════════════
  const qb = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c;
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
    for (let i = 0; i < 4; i++) {
      const q = T4[i];
      const H = h * q[1] * f * (0.86 + 0.14 * Math.sin(W.t * 9 + i * 2.3 + seed)), w = h * 0.26 * q[1];
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3 + seed) * h * 0.06;
      ctx.globalAlpha = Math.min(1, k * q[3]);
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
    if (k < 0.01) return;
    SP || sprites();
    const N = 9, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.4 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
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
  //  画：埃及的物件（宫、宝座、房屋、棕树、金字塔、田）
  // ════════════════════════════════════════════════════════════
  // 法老的宫：塔门（两座梯形的塔、门楣、旗杆与旗）与其后的柱厅；半夜灯熄（p.out）
  function drawPalace(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const STONE = [230, 210, 168], SHD = [178, 154, 116], DARK = [40, 32, 26];
    ctx.globalAlpha = p.a;
    const d = litX() >= x ? 1 : -1;
    // 柱厅
    const hx0 = x + 6 * s, hx1 = x + 44 * s, hh = 17 * s * g;
    ctx.fillStyle = css(STONE, l);
    ctx.fillRect(hx0, y - hh, hx1 - hx0, hh);
    ctx.fillStyle = css([92, 76, 60], l);
    ctx.fillRect(hx0 + 3 * s, y - hh + 3 * s, hx1 - hx0 - 6 * s, hh - 3 * s);
    ctx.fillStyle = css(STONE, l, 1, 0.04);
    for (let i = 0; i < 7; i++) {
      const cx = lerp(hx0 + 5 * s, hx1 - 4 * s, i / 6);
      ctx.fillRect(cx - 1.4 * s, y - hh + 3 * s, 2.8 * s, hh - 3 * s);
      ctx.beginPath(); ctx.moveTo(cx - 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 2.6 * s, y - hh + 3 * s); ctx.lineTo(cx + 1.4 * s, y - hh + 5.4 * s); ctx.lineTo(cx - 1.4 * s, y - hh + 5.4 * s); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([218, 198, 158], l);
    ctx.fillRect(hx0 - 1 * s, y - hh - 2.2 * s, hx1 - hx0 + 2 * s, 2.6 * s);
    // 塔门
    const TH = 34 * s * g, gw = 4 * s;
    const tower = cx => {
      const bw = 10 * s, tw = 7.6 * s;
      ctx.beginPath(); ctx.moveTo(cx - bw, y); ctx.lineTo(cx - tw, y - TH); ctx.lineTo(cx + tw, y - TH); ctx.lineTo(cx + bw, y); ctx.closePath(); ctx.fill();
      return [cx, bw, tw];
    };
    const flags = [[x - 13 * s, [176, 60, 48]], [x + 13 * s, LAPIS]];
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
    // 塔上的浮雕：一行行的刻纹，与一只高举的手臂的剪影（法老的威势）
    ctx.strokeStyle = css([150, 124, 90], l, 0.4); ctx.lineWidth = Math.max(0.4, 0.6 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) for (let i = 1; i <= 3; i++) { const yy = y - TH * (0.25 + 0.2 * i), w = lerp(t[1], t[2], 0.25 + 0.2 * i) * 0.7; ctx.moveTo(t[0] - w, yy); ctx.lineTo(t[0] + w, yy); }
    ctx.stroke();
    ctx.strokeStyle = css([120, 96, 66], l); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (const fl of flags) { ctx.moveTo(fl[0], y); ctx.lineTo(fl[0], y - TH - 12 * s * g); }
    ctx.stroke();
    const gale = W.lv.gale || 0;
    for (let i = 0; i < flags.length; i++) {
      const fx0 = flags[i][0], fy = y - TH - 12 * s * g + 0.5 * s, wv = Math.sin(W.t * (2.2 + 6 * gale) + i * 1.7) * 1.4 * s * (1 + gale), dir = W.wind >= 0 ? 1 : -1;
      ctx.fillStyle = css(flags[i][1], l, 1, 0.05);
      ctx.beginPath(); ctx.moveTo(fx0, fy); ctx.quadraticCurveTo(fx0 + dir * 4 * s, fy + wv, fx0 + dir * 8 * s, fy + 1.2 * s + wv * 0.6);
      ctx.lineTo(fx0 + dir * 7 * s, fy + 3.2 * s + wv * 0.4); ctx.quadraticCurveTo(fx0 + dir * 3.6 * s, fy + 3.4 * s + wv, fx0, fy + 3.4 * s); ctx.closePath(); ctx.fill();
    }
    // 灯（夜里；半夜之后熄了）
    const lk = Math.max(nightK() * 0.85, p.lit) * (1 - p.out);
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 176, 96, p.a * Math.min(1, lk) * 0.5);
      ctx.fillRect(x - gw, y - TH * 0.6, gw * 2, TH * 0.6);
      ctx.fillRect(hx0 + 3 * s, y - hh + 3 * s, hx1 - hx0 - 6 * s, hh - 3 * s);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, x, y - TH * 0.3, 16 * s * (1 + p.lit), p.a * Math.min(1, lk), p.seed);
      lamp(ctx, (hx0 + hx1) / 2, y - hh * 0.5, 22 * s * (0.8 + p.lit), p.a * Math.min(1, lk) * 0.8, p.seed + 2);
      ctx.globalAlpha = p.a;
    }
    ctx.globalAlpha = p.a * 0.55;
    ctx.strokeStyle = css([255, 244, 222], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath();
    for (const t of [tl, tr]) { ctx.moveTo(t[0] + d * t[1], y); ctx.lineTo(t[0] + d * t[2], y - TH); }
    ctx.moveTo(hx0, y - hh - 2.2 * s); ctx.lineTo(hx1, y - hh - 2.2 * s);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 宝座：金色的椅子与华盖（法老坐在其上）
  function drawThrone(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2 * s, f = p.flip || 1;
    ctx.globalAlpha = p.a;
    // 华盖：两根金柱，青金石色的顶与金的垂穗；宝座后一面乌木嵌青金石的背屏（法老白色的衣袍在其前显出）
    const cw = 13 * s, ch = 31 * s;
    ctx.fillStyle = css([24, 30, 56], l, 1, 0.02);
    ctx.fillRect(x - 10 * s, y - 27 * s, 20 * s, 23 * s);
    ctx.fillStyle = css(LAPIS, l, 0.9, 0.08);
    for (let i = 0; i < 3; i++) ctx.fillRect(x - 8.6 * s + i * 6.2 * s, y - 25.2 * s, 4.8 * s, 1.5 * s);
    ctx.fillRect(x - 8.6 * s, y - 8.4 * s, 17.2 * s, 1.2 * s);
    ctx.strokeStyle = css(GOLD, l, 1, 0.14); ctx.lineWidth = Math.max(0.7, 1.1 * s);
    ctx.strokeRect(x - 10 * s, y - 27 * s, 20 * s, 23 * s);
    ctx.fillStyle = css(GOLD, l, 1, 0.1);
    ctx.fillRect(x - cw - 0.7 * s, y - ch, 1.4 * s, ch - 2 * s);
    ctx.fillRect(x + cw - 0.7 * s, y - ch, 1.4 * s, ch - 2 * s);
    ctx.fillStyle = css([36, 56, 116], l, 1, 0.05);
    ctx.beginPath(); ctx.moveTo(x - cw - 3 * s, y - ch + 1 * s); ctx.lineTo(x - cw + 1 * s, y - ch - 4.5 * s); ctx.lineTo(x + cw - 1 * s, y - ch - 4.5 * s); ctx.lineTo(x + cw + 3 * s, y - ch + 1 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css(GOLD, l, 1, 0.16);
    ctx.fillRect(x - cw - 3 * s, y - ch + 0.4 * s, 2 * (cw + 3 * s), 1.5 * s);
    ctx.fillRect(x - cw + 1 * s, y - ch - 5 * s, 2 * (cw - 1 * s), 1 * s);
    for (let i = 0; i < 11; i++) { const fx0 = lerp(x - cw - 2 * s, x + cw + 2 * s, i / 10); ctx.fillRect(fx0 - 0.4 * s, y - ch + 1.9 * s, 0.8 * s, 2 * s); }
    // 两级的台
    ctx.fillStyle = css([214, 196, 158], l);
    ctx.fillRect(x - 13 * s, y - 2.2 * s, 26 * s, 2.6 * s);
    ctx.fillStyle = css([226, 210, 174], l);
    ctx.fillRect(x - 9 * s, y - 4.2 * s, 18 * s, 2.2 * s);
    // 高背的金椅（背在法老身后，左侧）
    const bx = x - f * 6.5 * s;
    ctx.fillStyle = css(GOLD, l, 1, 0.1);
    ctx.fillRect(bx - 1.3 * s, y - 24 * s, 2.6 * s, 20 * s);
    ctx.fillStyle = css(LAPIS, l, 0.95, 0.05);
    ctx.fillRect(bx - 1.3 * s, y - 24 * s, 2.6 * s, 2.2 * s);
    ctx.fillStyle = css(GOLD, l, 1, 0.1);
    ctx.fillRect(x - 6.5 * s, y - 11.5 * s, 12 * s, 1.8 * s);
    ctx.fillRect(x - 5.4 * s, y - 10 * s, 1.4 * s, 5.8 * s);
    ctx.fillRect(x + 3.6 * s, y - 10 * s, 1.4 * s, 5.8 * s);
    ctx.strokeStyle = css([255, 244, 222], l, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - 13 * s, y - 2.2 * s); ctx.lineTo(x + 13 * s, y - 2.2 * s); ctx.moveTo(bx - 1.3 * s, y - 24 * s); ctx.lineTo(bx - 1.3 * s, y - 11 * s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 埃及人的房屋：粉白的墙、平顶、檐下彩绘、带柱的廊；夜里点灯；半夜之后灯熄（p.out）
  function drawHouse(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 3 * s, g = p.grow;
    if (g < 0.01) return;
    const f = p.flip || 1, hw = 25 * s, h = 19 * s * g;
    const WALL = [232, 220, 194], TRIM = [214, 198, 166], DARK = [44, 34, 28];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(TRIM, l);
    ctx.fillRect(x + f * hw * 0.35 - 5 * s, y - h - 7 * s * g, 10 * s, 7.5 * s * g);
    ctx.fillStyle = css(WALL, l);
    ctx.fillRect(x - hw, y - h, 2 * hw, h);
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([150, 136, 112], l, 0.5);
    ctx.fillRect(d > 0 ? x - hw : x + hw - 5 * s, y - h, 5 * s, h);
    ctx.fillStyle = css(TRIM, l);
    ctx.fillRect(x - hw - 1.4 * s, y - h - 2.4 * s, 2 * hw + 2.8 * s, 2.8 * s);
    const n = Math.max(4, Math.round(hw / (2.6 * s)));
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = css(i % 2 ? LAPIS : [176, 72, 52], l, 0.85);
      ctx.fillRect(x - hw + (i + 0.2) * (2 * hw / n), y - h + 0.6 * s, (2 * hw / n) * 0.6, 1.4 * s);
    }
    const px0 = f > 0 ? x - hw * 0.88 : x + hw * 0.08, px1 = f > 0 ? x - hw * 0.08 : x + hw * 0.88, py0 = y - h * 0.78;
    ctx.fillStyle = css([96, 80, 64], l);
    ctx.fillRect(px0, py0, px1 - px0, y - py0);
    ctx.fillStyle = css(WALL, l, 1, 0.05);
    for (let i = 0; i < 4; i++) {
      const cx = lerp(px0 + 2.2 * s, px1 - 2.2 * s, i / 3);
      ctx.fillRect(cx - 1.1 * s, py0 + 1.6 * s, 2.2 * s, y - py0 - 1.6 * s);
      ctx.beginPath(); ctx.moveTo(cx - 2.2 * s, py0); ctx.lineTo(cx + 2.2 * s, py0); ctx.lineTo(cx + 1.1 * s, py0 + 2 * s); ctx.lineTo(cx - 1.1 * s, py0 + 2 * s); ctx.closePath(); ctx.fill();
    }
    const dx = x + f * hw * 0.5;
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(dx - 3 * s, y - h * 0.62, 6 * s, h * 0.62);
    for (const q of [0.28, 0.72]) ctx.fillRect(x + f * hw * q - 1.2 * s, y - h * 0.9, 2.4 * s, 1.8 * s);
    const lk = Math.max(nightK() * 0.8, p.lit) * (1 - p.out);
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 176, 96, p.a * Math.min(1, lk) * 0.55);
      ctx.fillRect(dx - 3 * s, y - h * 0.62, 6 * s, h * 0.62);
      ctx.fillRect(px0, py0, px1 - px0, y - py0);
      for (const q of [0.28, 0.72]) ctx.fillRect(x + f * hw * q - 1.2 * s, y - h * 0.9, 2.4 * s, 1.8 * s);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, (px0 + px1) / 2, y - h * 0.4, hw * (0.9 + p.lit * 0.9), p.a * Math.min(1, lk), p.seed);
      lamp(ctx, dx, y - h * 0.3, hw * 0.6, p.a * Math.min(1, lk), p.seed + 3);
      ctx.globalAlpha = p.a;
    }
    // 河水变血时，门前的水缸也是红的（7:19）
    const bl = W.lv.plBlood;
    if (bl > 0.02 && l === 2) {
      const jx = dx + f * 5.5 * s, jy = y - 0.5 * s;
      ctx.fillStyle = css([170, 116, 76], l);
      ctx.beginPath(); ctx.ellipse(jx, jy - 2.6 * s, 2.3 * s, 2.9 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = U.rgba(118, 14, 22, p.a * bl * 0.95);
      ctx.beginPath(); ctx.ellipse(jx, jy - 5.2 * s, 1.5 * s, 0.6 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = p.a * 0.55;
    ctx.strokeStyle = css([255, 244, 222], l, 1, 0.3); ctx.lineWidth = Math.max(0.6, 1 * s);
    ctx.beginPath(); ctx.moveTo(x - hw - 1.4 * s, y - h - 2.4 * s); ctx.lineTo(x + hw + 1.4 * s, y - h - 2.4 * s);
    ctx.moveTo(x + d * hw, y - h); ctx.lineTo(x + d * hw, y); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // 以色列人的屋（歌珊）：矮的泥砖屋，平顶，木门框；门楣与左右的门框上可以涂上血（12:7）
  function hutDoor(p) {
    const s = LS(p.layer) * p.size, x = p.x * W.w, y = gY(p.layer, p.x) + 2.5 * s, f = p.flip || 1;
    return { s, x: x + f * 15 * s * 0.3, y, dw: 3.3 * s, dh: 10.8 * s };
  }
  function drawHut(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 2.5 * s, g = p.grow;
    if (g < 0.01) return;
    const f = p.flip || 1, hw = 15 * s, h = 16 * s * g;
    const MUD = [160, 120, 82], MUD2 = [138, 100, 68], WOOD = [118, 84, 54], DARK = [28, 20, 16];
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css(MUD, l);
    ctx.beginPath(); ctx.moveTo(x - hw, y); ctx.lineTo(x - hw * 0.96, y - h); ctx.lineTo(x + hw * 0.96, y - h); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    // 平顶的矮墙与露出的梁头
    ctx.fillStyle = css(MUD2, l);
    ctx.fillRect(x - hw * 0.98, y - h - 1.8 * s * g, hw * 1.96, 1.9 * s * g);
    ctx.fillStyle = css([84, 60, 40], l);
    for (let i = 0; i < 6; i++) ctx.fillRect(x - hw * 0.84 + i * hw * 0.33, y - h + 0.5 * s, 1.1 * s, 1.1 * s);
    // 背光的一侧
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([90, 64, 44], l, 0.45);
    ctx.beginPath(); ctx.moveTo(d > 0 ? x - hw : x + hw, y); ctx.lineTo(d > 0 ? x - hw * 0.96 : x + hw * 0.96, y - h); ctx.lineTo(d > 0 ? x - hw * 0.96 + 4.5 * s : x + hw * 0.96 - 4.5 * s, y - h); ctx.lineTo(d > 0 ? x - hw + 4.5 * s : x + hw - 4.5 * s, y); ctx.closePath(); ctx.fill();
    // 泥砖的层
    ctx.strokeStyle = css([112, 82, 56], l, 0.28); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let r = 1; r < 4; r++) { const yy = y - h * r / 4; ctx.moveTo(x - hw * 0.97, yy); ctx.lineTo(x + hw * 0.97, yy); }
    ctx.stroke();
    // 小窗
    const wx = x - f * hw * 0.5;
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(wx - 1.4 * s, y - h * 0.74, 2.8 * s, 2.2 * s);
    // 门
    const D = hutDoor(p), dx = D.x, dw = D.dw, dh = D.dh * g;
    ctx.fillStyle = css(DARK, l);
    ctx.fillRect(dx - dw, y - dh, dw * 2, dh);
    // 屋里的灯（夜里、黑暗的三天里）
    const lk = Math.max(nightK() * 0.9, p.lit);
    if (lk > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 186, 104, p.a * Math.min(1, lk) * 0.72);
      ctx.fillRect(dx - dw, y - dh, dw * 2, dh);
      ctx.fillRect(wx - 1.4 * s, y - h * 0.74, 2.8 * s, 2.2 * s);
      ctx.globalCompositeOperation = 'source-over';
      lamp(ctx, dx, y - dh * 0.45, hw * (1.05 + 0.5 * p.lit), p.a * Math.min(1, lk), p.seed);
      ctx.globalAlpha = p.a;
    }
    // 门框：门楣与左右的门框
    ctx.fillStyle = css(WOOD, l);
    ctx.fillRect(dx - dw - 1.4 * s, y - dh - 1.7 * s, dw * 2 + 2.8 * s, 1.7 * s);
    ctx.fillRect(dx - dw - 1.2 * s, y - dh, 1.2 * s, dh);
    ctx.fillRect(dx + dw, y - dh, 1.2 * s, dh);
    // 血（12:7；12:22 用一把牛膝草蘸盆里的血，打在门楣上和左右的门框上）
    const st = p.stain;
    if (st > 0.005) {
      const k1 = clamp(st / 0.42, 0, 1), k2 = clamp((st - 0.42) / 0.29, 0, 1), k3 = clamp((st - 0.71) / 0.29, 0, 1);
      const pg = passGlow(p.x), nk = nightK();
      // 夜里门口的灯照着门框上的血：它不随夜色暗下去（12:13 我一见这血）
      const sh = W.shade(BLOOD, DEP(l), 0.45 + 0.4 * nk + 0.5 * pg), litB = clamp(Math.max(nk, lk) * 1.1, 0, 1);
      const bc = U.mixRGB(sh, [172, 26, 34], litB * 0.85);
      ctx.fillStyle = U.rgba(bc[0] | 0, bc[1] | 0, bc[2] | 0, 1);
      const lw = (dw * 2 + 2.8 * s) * k1, lx0 = dx - dw - 1.4 * s;
      if (k1 > 0) {
        ctx.beginPath();
        ctx.moveTo(lx0, y - dh - 1.5 * s);
        for (let i = 0; i <= 6; i++) { const t = i / 6; ctx.lineTo(lx0 + lw * t, y - dh - 1.9 * s - Math.sin(t * 9 + p.seed) * 0.35 * s); }
        for (let i = 6; i >= 0; i--) { const t = i / 6; ctx.lineTo(lx0 + lw * t, y - dh + 0.2 * s + Math.sin(t * 7 + p.seed) * 0.3 * s); }
        ctx.closePath(); ctx.fill();
        // 滴下的血点
        for (let i = 0; i < 3; i++) { const t = (i + 0.5) / 3; if (t > k1) break; ctx.fillRect(lx0 + lw * t / Math.max(k1, 0.01) * k1 - 0.3 * s, y - dh + 0.2 * s, 0.6 * s, (0.8 + 1.4 * rt(p.seed + i)) * s); }
      }
      if (k2 > 0) ctx.fillRect(dx - dw - 1.35 * s, y - dh, 1.5 * s, dh * k2 * 0.82);
      if (k3 > 0) ctx.fillRect(dx + dw - 0.15 * s, y - dh, 1.5 * s, dh * k3 * 0.82);
      if (st > 0.5) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        const sk = clamp((st - 0.5) * 2, 0, 1) * p.a;
        glowSp(ctx, SP.red, dx, y - dh - 0.8 * s, 9 * s, (0.12 + 0.22 * nk) * sk);
        glowSp(ctx, SP.red, dx, y - dh * 0.5, 6 * s, 0.1 * nk * sk);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.a;
      }
      if (pg > 0.01) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.red, dx, y - dh * 0.8, 14 * s, pg * 0.55 * p.a);
        glowSp(ctx, SP.gold, dx, y - dh * 0.6, 20 * s, pg * 0.35 * p.a);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = p.a;
      }
    }
    // 迎光的边
    ctx.globalAlpha = p.a * 0.5;
    ctx.strokeStyle = css([255, 236, 204], l, 1, 0.25); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.98, y - h - 1.8 * s * g); ctx.lineTo(x + hw * 0.98, y - h - 1.8 * s * g);
    ctx.moveTo(x + d * hw * 0.98, y - h); ctx.lineTo(x + d * hw, y); ctx.stroke();
    ctx.globalAlpha = 1;
    // 烤羊羔的火（12:8）：屋前三块石头，一小堆火（在门的一旁，不挡门）
    if (p.fire > 0.01) {
      const fx0 = x - f * hw * 0.15, fy = fieldY(p.x - f * hw * 0.15 / W.w, 0.16);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = css([96, 88, 78], l);
      ctx.beginPath();
      for (const o of [-2.6, 0, 2.6]) { ctx.moveTo(fx0 + o * s + 1.4 * s, fy); ctx.ellipse(fx0 + o * s, fy, 1.4 * s, 1 * s, 0, 0, TAU); }
      ctx.fill();
      flame(ctx, fx0, fy - 0.6 * s, 7.5 * s, p.fire * p.a, p.seed);
      smoke(ctx, fx0, fy - 6 * s, p.fire * p.a * 0.6, 60 * s, 4 * s, p.seed);
    }
  }

  // 棕树：叶被雹打碎、被蝗虫吃尽时（plStrip）只剩光秃的干与残叶
  function drawPalm(ctx, p) {
    const l = p.layer, s = LS(l) * p.size, x = p.x * W.w, y = gY(l, p.x) + 1.5 * s, g = p.grow;
    if (g < 0.01 || p.a < 0.01) return;
    const strip = clamp(W.lv.plStrip, 0, 1);
    const H = 50 * s * (0.8 + 0.35 * rt(p.seed)) * g, lean = (rt(p.seed + 1) - 0.5) * 0.4 * (p.flip || 1);
    const gale = W.lv.gale || 0;
    const sway = W.wind * 1.6 * s + Math.sin(W.t * (0.9 + 3 * gale) + p.seed) * (0.6 + 3 * gale) * s;
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
    if (strip < 0.6) {
      ctx.fillStyle = css([176, 104, 48], l, 1 - strip / 0.6);
      ctx.beginPath(); ctx.ellipse(tx + 1.5 * s, ty + 3 * s, 2.2 * s * g, 3 * s * g, 0.3, 0, TAU); ctx.fill();
    }
    const ANG = [168, 146, 122, 100, 80, 58, 34, 12];
    const leafK = 1 - 0.82 * strip;
    ctx.fillStyle = css(U.mixRGB([66, 104, 56], [118, 96, 60], strip), l);
    ctx.beginPath();
    for (let i = 0; i < ANG.length; i++) {
      if (strip > 0.3 && rt(p.seed + 40 + i) < (strip - 0.3) * 0.9) continue;
      const a = (ANG[i] + (rt(p.seed + 10 + i) - 0.5) * 12) * Math.PI / 180, ux = Math.cos(a), uy = -Math.sin(a);
      const L = (19 + 8 * rt(p.seed + 20 + i)) * s * (0.35 + 0.65 * g) * (0.75 + 0.25 * Math.abs(ux)) * leafK;
      const sw = Math.sin(W.t * (1.3 + 4 * gale) + i * 1.7 + p.seed) * (0.9 + 3 * gale) * s + W.wind * 1.8 * s * (0.5 + Math.abs(ux));
      const ex = tx + ux * L + sw, ey = ty + (uy * 0.5 + 0.48) * L;
      const mx = tx + ux * L * 0.5, my = ty + (uy * 0.78 - 0.16) * L;
      const wd = 2.3 * s * (1 - 0.5 * strip);
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(mx - uy * wd * 0.3, my - wd, ex, ey); ctx.quadraticCurveTo(mx, my + wd, tx, ty + 0.8 * s);
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 金字塔：远处中丘上的三座
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

  // 田：麻开着蓝花，大麦已经吐穗（9:31）；被雹击打便倒伏折断，被蝗虫吃尽便只剩茬
  function drawField(ctx, p) {
    const a = p.a;
    if (a < 0.01) return;
    if (!p.model) { const r = U.mulberry32(p.seed + 5), tuft = [], wob = []; for (let i = 0; i < 140; i++) tuft.push([r(), r(), r()]); for (let i = 0; i < 24; i++) wob.push(r()); p.model = { tuft, wob }; }
    const flax = p.variant === 'flax';
    const crop = clamp(W.lv.plCrop, 0, 1), stand = smoothstep(0.35, 1, crop), alive = smoothstep(0.02, 0.35, crop);
    const s = LS(2), cx = p.x * W.w, top = fieldY(p.x, 0.38), bot = fieldY(p.x, 0.76);
    const hwT = 0.019 * W.w * p.size, hwB = 0.026 * W.w * p.size;
    // 田畦：边是不齐的，边缘柔和（外一层更淡），几道犁沟
    const wob = p.model.wob;
    const bed = grow => cachedPath('bed:' + p.id + ':' + grow, P2 => {
      const N = 6, Lp = [], Rp = [], e = grow * 5 * s;
      for (let i = 0; i <= N; i++) {
        const f = i / N, y = lerp(top, bot, f), hw = lerp(hwT, hwB, f);
        Lp.push([cx - hw * (0.86 + 0.28 * wob[i]) - e, y]); Rp.push([cx + hw * (0.86 + 0.28 * wob[i + 8]) + e, y]);
      }
      P2.moveTo(Lp[0][0], Lp[0][1]);
      P2.quadraticCurveTo(cx + (wob[18] - 0.5) * hwT, top - (2 + 3 * wob[20]) * s - e * 0.6, Rp[0][0], Rp[0][1]);
      for (let i = 1; i <= N; i++) P2.quadraticCurveTo(Rp[i - 1][0] + (wob[i + 12] - 0.3) * 3 * s + e * 0.3, (Rp[i - 1][1] + Rp[i][1]) / 2, Rp[i][0], Rp[i][1]);
      P2.quadraticCurveTo(cx + (wob[19] - 0.5) * hwB, bot + (4 + 4 * wob[21]) * s + e * 0.6, Lp[N][0], Lp[N][1]);
      for (let i = N - 1; i >= 0; i--) P2.quadraticCurveTo(Lp[i + 1][0] - (wob[i + 1] - 0.3) * 3 * s - e * 0.3, (Lp[i + 1][1] + Lp[i][1]) / 2, Lp[i][0], Lp[i][1]);
      P2.closePath();
    });
    ctx.fillStyle = css(U.mixRGB([98, 74, 48], [72, 56, 40], 1 - alive), 2);
    ctx.globalAlpha = a * 0.13;
    ctx.fill(bed(1));
    ctx.globalAlpha = a * 0.3;
    ctx.fill(bed(0));
    ctx.strokeStyle = css([70, 52, 34], 2, 0.3);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.stroke(cachedPath('furrow:' + p.id, P2 => {
      for (let r = 1; r <= 4; r++) {
        const f = r / 5, y = lerp(top, bot, f), hw = lerp(hwT, hwB, f) * 0.84;
        P2.moveTo(cx - hw, y + (wob[r] - 0.5) * s); P2.quadraticCurveTo(cx, y - 1.2 * s, cx + hw, y + (wob[r + 4] - 0.5) * s);
      }
    }));
    const tuft = p.model.tuft, ROWS = 10, stepQ = (W.quality || 1) < 0.75 ? 2 : 1;
    const gale = W.lv.gale || 0;
    const sway = (W.wind * 2.2 + gale * 3 * Math.sin(W.t * 3)) * s;
    // 茬（被吃尽之后）
    if (alive < 0.98) {
      ctx.fillStyle = css([120, 98, 66], 2, 1, 0.04);
      ctx.globalAlpha = a * (1 - alive) * 0.8;
      ctx.beginPath();
      for (let i = 0; i < tuft.length; i += 3) {
        const q = tuft[i], f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        const y = lerp(top, bot, Math.pow(f, 1.3)), x = cx + u * lerp(hwT, hwB, f);
        ctx.rect(x - 0.4 * s, y - 1.6 * s * (0.5 + f), 0.8 * s, 1.6 * s * (0.5 + f));
      }
      ctx.fill();
    }
    if (alive < 0.01) { ctx.globalAlpha = 1; return; }
    const green = flax ? [92, 136, 72] : [168, 156, 78], dryC = [150, 124, 80];
    const col = U.mixRGB(green, dryC, (1 - stand) * 0.6);
    const tips = [];
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = css(pass ? U.mixRGB(col, [236, 226, 150], 0.25) : col, 2, 1, 0.05);
      ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.globalAlpha = a * 0.95 * alive;
      ctx.beginPath();
      for (let i = pass; i < tuft.length; i += 2 * stepQ) {
        const q = tuft[i];
        const f = (Math.floor(q[0] * ROWS) + 0.5) / ROWS, u = q[1] * 2 - 1;
        const y = lerp(top, bot, Math.pow(f, 1.3)) + (q[2] - 0.5) * 2 * s, x = cx + u * lerp(hwT, hwB, f);
        const th = lerp(4, 11, f) * s * (0.7 + 0.5 * q[2]) * (0.35 + 0.65 * stand);
        const bend = (1 - stand) * (q[2] < 0.5 ? -1 : 1) * th * 1.3;
        const sw = sway * (0.3 + f) * stand + Math.sin(W.t * 1.5 + q[2] * 9 + f * 3) * 0.6 * s * stand + bend;
        const ex = x + sw, ey = y - th + Math.abs(bend) * 0.55;
        ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.25, y - th * 0.6, ex, ey);
        if (pass && (i & 3) === 1) tips.push(ex, ey, f);
      }
      ctx.stroke();
    }
    // 花与穗
    if (tips.length) {
      ctx.globalAlpha = a * alive * (0.35 + 0.65 * stand);
      ctx.fillStyle = flax ? css([118, 146, 226], 2, 1, 0.12) : css([232, 200, 112], 2, 1, 0.12);
      ctx.beginPath();
      for (let i = 0; i < tips.length; i += 3) {
        const r = lerp(0.7, 1.4, tips[i + 2]) * s;
        if (flax) { ctx.moveTo(tips[i] + r, tips[i + 1]); ctx.arc(tips[i], tips[i + 1], r, 0, TAU); }
        else ctx.rect(tips[i] - r * 0.5, tips[i + 1] - r * 2.2, r, r * 2.6);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // ── 砖场：一行行晒着的泥砖、两垛砖、木模子、水缸；草堆；窑 ─────────
  function drawBricks(ctx, p) {
    const a = p.a;
    if (a < 0.01) return;
    const s = LS(2) * p.size, cx = p.x * W.w, g = gY(2, p.x);
    const hw = 26 * s;
    ctx.globalAlpha = a;
    // 踏实的场地
    ctx.fillStyle = css([150, 118, 84], 2, 0.45);
    ctx.beginPath();
    ctx.moveTo(cx - hw, g + 2 * s); ctx.lineTo(cx + hw, g + 2 * s); ctx.lineTo(cx + hw * 1.25, fieldY(p.x, 0.5)); ctx.lineTo(cx - hw * 1.25, fieldY(p.x, 0.5)); ctx.closePath(); ctx.fill();
    // 晒着的砖：一行一行，近大远小
    const BR = [184, 136, 92];
    for (let r = 0; r < 4; r++) {
      const v = 0.08 + r * 0.1, y = fieldY(p.x, v), k = 0.8 + v * 0.9, n = 7 + r;
      const w = 2.6 * s * k, h = 1.3 * s * k, span = hw * (1.02 + v * 0.5);
      ctx.fillStyle = css(BR, 2, 1, 0.02);
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const x = cx - span + (i + 0.5) * (2 * span / n); ctx.rect(x - w / 2, y - h, w, h); }
      ctx.fill();
      ctx.fillStyle = css([226, 186, 140], 2, 0.7 * dayA(), 0.1);
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const x = cx - span + (i + 0.5) * (2 * span / n); ctx.rect(x - w / 2, y - h, w, h * 0.3); }
      ctx.fill();
    }
    // 两垛砖（阶梯形）
    for (const [ox, sz] of [[-0.78, 1], [0.62, 0.8]]) {
      const bx = cx + ox * hw, by = g + 2 * s;
      for (let row = 0; row < 5; row++) {
        const n = 5 - row, w = 3 * s * sz, h = 1.8 * s * sz;
        for (let i = 0; i < n; i++) {
          const x = bx + (i - (n - 1) / 2) * w;
          ctx.fillStyle = css(row % 2 ? [176, 128, 86] : [190, 142, 98], 2);
          ctx.fillRect(x - w / 2 + 0.2 * s, by - (row + 1) * h, w - 0.4 * s, h - 0.3 * s);
        }
      }
    }
    // 木模子与水缸
    ctx.strokeStyle = css([96, 70, 46], 2); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    const my = fieldY(p.x, 0.46);
    ctx.strokeRect(cx - 6 * s, my - 1.6 * s, 5 * s, 1.6 * s);
    ctx.strokeRect(cx + 1.5 * s, my - 1.6 * s, 5 * s, 1.6 * s);
    ctx.fillStyle = css([168, 112, 72], 2);
    ctx.beginPath(); ctx.ellipse(cx + hw * 1.05, my - 3 * s, 2.4 * s, 3.2 * s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawStraw(ctx, p) {
    const g = p.grow * p.a;
    if (g < 0.01) return;
    const s = LS(2) * p.size, x = p.x * W.w, y = gY(2, p.x) + 2.5 * s, r = 11 * s * (0.3 + 0.7 * p.grow), h = 8 * s * p.grow;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([214, 180, 104], 2, 1, 0.05);
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x - r * 0.7, y - h * 1.3, x, y - h * 1.35); ctx.quadraticCurveTo(x + r * 0.7, y - h * 1.3, x + r, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([246, 222, 150], 2, 0.7, 0.15); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const t = rt(p.seed + i), px = x + (t * 2 - 1) * r * 0.8, py = y - h * (1.1 - Math.pow(Math.abs(t * 2 - 1), 2)) * rt(p.seed + 30 + i);
      const ang = (rt(p.seed + 60 + i) - 0.5) * 1.6;
      ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * 4 * s, py - Math.sin(ang) * 2 * s);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawKiln(ctx, p) {
    const a = p.a;
    if (a < 0.01) return;
    const s = LS(2) * p.size, x = p.x * W.w, y = gY(2, p.x) + 2.5 * s, r = 9 * s, h = 13 * s;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([150, 104, 70], 2);
    ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x - r * 0.9, y - h * 0.55); ctx.quadraticCurveTo(x - r * 0.7, y - h, x - 1.6 * s, y - h * 1.02);
    ctx.lineTo(x + 1.6 * s, y - h * 1.02); ctx.quadraticCurveTo(x + r * 0.7, y - h, x + r * 0.9, y - h * 0.55); ctx.lineTo(x + r, y); ctx.closePath(); ctx.fill();
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([100, 70, 48], 2, 0.5);
    ctx.beginPath(); ctx.moveTo(x - d * r, y); ctx.lineTo(x - d * r * 0.9, y - h * 0.55); ctx.quadraticCurveTo(x - d * r * 0.7, y - h, x - d * 1.6 * s, y - h * 1.02); ctx.lineTo(x - d * 3 * s, y); ctx.closePath(); ctx.fill();
    // 窑口的火光
    const mw = 3 * s, mh = 4.6 * s;
    ctx.fillStyle = css([26, 18, 14], 2);
    ctx.beginPath(); ctx.moveTo(x - mw, y); ctx.lineTo(x - mw, y - mh * 0.6); ctx.quadraticCurveTo(x, y - mh * 1.2, x + mw, y - mh * 0.6); ctx.lineTo(x + mw, y); ctx.closePath(); ctx.fill();
    const fk = 0.75 + 0.25 * Math.sin(W.t * 5.3 + p.seed);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(255, 128, 50, a * 0.75 * fk);
    ctx.beginPath(); ctx.moveTo(x - mw * 0.8, y); ctx.lineTo(x - mw * 0.8, y - mh * 0.45); ctx.quadraticCurveTo(x, y - mh * 0.95, x + mw * 0.8, y - mh * 0.45); ctx.lineTo(x + mw * 0.8, y); ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    lamp(ctx, x, y - mh * 0.4, 12 * s * (1 + nightK()), a * (0.5 + 0.5 * nightK()), p.seed);
    smoke(ctx, x, y - h * 1.05, a * 0.8, 90 * s, 4.5 * s, p.seed);
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：埃及的地、尼罗河、歌珊、天上的尘
  // ════════════════════════════════════════════════════════════
  const SAND = [[208, 180, 138], [216, 182, 130], [224, 188, 128]];
  const XB = [0.79, 0.8, X.wall];            // 沙地的边界（远 / 中 / 近）：其右是歌珊的青草
  // ── 几何的缓存：地的轮廓、河岸只随画面大小（与地的升起）而变 ──
  let geoKey = '', GEO = null;
  function geo() {
    const k = W.w + 'x' + W.h + ':' + Math.round((W.lv.land || 0) * 64) + ':' + (W.w < 600 ? 1 : 0);
    if (k !== geoKey || !GEO) { geoKey = k; GEO = { path: new Map(), data: new Map(), nileY0: gY(2, X.nileT) }; }
    return GEO;
  }
  function cachedPath(key, build) {
    const G = geo();
    let p = G.path.get(key);
    if (!p) { p = new Path2D(); build(p); G.path.set(key, p); if (G.path.size > 48) G.path.delete(G.path.keys().next().value); }
    return p;
  }
  function cachedData(key, build) {
    const G = geo();
    let d = G.data.get(key);
    if (!d) { d = build(); G.data.set(key, d); if (G.data.size > 24) G.data.delete(G.data.keys().next().value); }
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
  function drawDesert(ctx, l) {
    const xb = XB[l], dep = DEP(l);
    const c = W.shade(SAND[l], dep, 0.06);
    const col = a => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
    const Ae = 0.84, Af = 0.12;
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    g.addColorStop(0, col(Ae)); g.addColorStop(clamp(xb - 0.03, 0, 1), col(Ae));
    g.addColorStop(clamp(xb + 0.02, 0, 1), col(Ae * 0.4));
    g.addColorStop(clamp(xb + 0.06, 0, 1), col(Af)); g.addColorStop(1, col(Af));
    ctx.fillStyle = g;
    ctx.fill(landPath(l, 0.25, 1.0, l === 2 ? 56 : 40));
    // 蝗虫落满之处，地都黑暗了（10:15）
    const lc = locustCover();
    if (lc > 0.01) {
      const d2 = ctx.createLinearGradient(0, 0, W.w, 0);
      const dc = W.shade([46, 36, 22], dep, 0);
      d2.addColorStop(0, U.rgba(dc[0], dc[1], dc[2], 0.7 * lc)); d2.addColorStop(clamp(xb - 0.02, 0, 1), U.rgba(dc[0], dc[1], dc[2], 0.62 * lc));
      d2.addColorStop(clamp(xb + 0.06, 0, 1), U.rgba(dc[0], dc[1], dc[2], 0.2 * lc)); d2.addColorStop(1, U.rgba(dc[0], dc[1], dc[2], 0.15 * lc));
      ctx.fillStyle = d2;
      ctx.fill(landPath(l, 0.25, 1.0, l === 2 ? 56 : 40));
    }
    // 沙地的亮边与风纹（近地）
    const hi = W.shade([252, 226, 178], dep, 0.2);
    ctx.strokeStyle = U.rgba(hi[0], hi[1], hi[2], 0.5 * dayA() * (1 - 0.7 * lc));
    ctx.lineWidth = Math.max(0.6, 1.1 * LS(l));
    ctx.stroke(cachedPath('rim' + l, P2 => {
      for (let i = 0; i <= 30; i++) { const xf = lerp(0.3, xb + 0.02, i / 30), y = gY(l, xf); if (i) P2.lineTo(xf * W.w, y + 0.8); else P2.moveTo(xf * W.w, y + 0.8); }
    }));
    if (l === 2) {
      const dk = W.shade([170, 136, 92], 0, 0);
      ctx.strokeStyle = U.rgba(dk[0], dk[1], dk[2], 0.2);
      ctx.lineWidth = Math.max(0.6, 1.4 * LS(2));
      ctx.stroke(cachedPath('wind', P2 => {
        for (let k = 0; k < 7; k++) {
          const v = 0.14 + k * 0.12, ph = rt(k * 11) * 6;
          for (let i = 0; i <= 22; i++) {
            const xf = lerp(0.47 + k * 0.01, xb - 0.03, i / 22), y = fieldY(xf, v) + Math.sin(xf * 34 + ph) * 3 * LS(2);
            if (i) P2.lineTo(xf * W.w, y); else P2.moveTo(xf * W.w, y);
          }
        }
      }));
    }
  }
  // 歌珊：一片草场（在沙地的右边）
  function drawGoshen(ctx) {
    const c = W.shade([104, 142, 72], 0, 0.02);
    const col = a => U.rgba(c[0], c[1], c[2], a);
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    const a = X.wall, b = 1.0;
    const k = 1 - 0.55 * clamp(W.lv.plStrip, 0, 1);
    g.addColorStop(clamp(a - 0.02, 0, 1), col(0)); g.addColorStop(a + 0.025, col(0.55 * k)); g.addColorStop(1, col(0.55 * k));
    ctx.fillStyle = g;
    ctx.fill(landPath(2, a - 0.02, b, 24));
    const s = LS(2), bl = W.shade([150, 190, 100], 0, 0.1);
    ctx.strokeStyle = U.rgba(bl[0], bl[1], bl[2], 0.5 * k);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    const nT = (W.quality || 1) < 0.75 ? 24 : 44;
    const B = cachedData('blades', () => {
      const out = [];
      for (let i = 0; i < 44; i++) {
        const xf = lerp(a + 0.01, b, rt(i * 3 + 400)), v = rt(i * 3 + 401) * 0.8;
        out.push([xf * W.w, fieldY(xf, v), (2 + 3 * rt(i * 3 + 402)) * s * (0.6 + v)]);
      }
      return out;
    });
    ctx.beginPath();
    const ws = W.wind * 1.2 * s;
    for (let i = 0; i < nT; i++) {
      const q = B[i], sw = ws + Math.sin(W.t * 1.6 + i) * 0.5 * s;
      ctx.moveTo(q[0], q[1]); ctx.lineTo(q[0] + sw, q[1] - q[2] * k);
    }
    ctx.stroke();
  }
  // 尼罗河：自近地的轮廓流向观者；两岸泥滩与芦荻；变作血时自上游（亚伦击打之处）向下红去
  function nilePt(t) {
    const x0 = X.nileT * W.w, y0 = geo().nileY0 + 0.5, x3 = X.nileB * W.w, y3 = W.h + 0.1 * W.h;   // 末端在画面之下（岸的偏移曲线在端点处不打折）
    const x1 = (X.nileT - 0.014) * W.w, y1 = lerp(y0, y3, 0.38), x2 = (X.nileB + 0.012) * W.w, y2 = lerp(y0, y3, 0.72), u = 1 - t;
    const px = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
    const py = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2), dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2), L = Math.hypot(dx, dy) || 1;
    return [px, py, -dy / L, dx / L];
  }
  const nileW = t => (0.007 + 0.082 * Math.pow(t, 1.35)) * W.w;
  // 河在某一纵深（v）上的东岸（画面比例）：人与物都放在其右
  const nileEast = v => { const q = nilePt(clamp(v, 0, 1)); return q[0] / W.w + nileW(clamp(v, 0, 1)) * 0.66 / W.w + 0.004; };
  const nileWest = v => { const q = nilePt(clamp(v, 0, 1)); return q[0] / W.w - nileW(clamp(v, 0, 1)) * 0.66 / W.w - 0.004; };
  function drawNile(ctx) {
    ctx.save();
    ctx.clip(landPath(2, 0.25, 1.0, 56));     // 河与两岸都在地里（不越过海岸）
    drawNileIn(ctx);
    ctx.restore();
  }
  function drawNileIn(ctx) {
    const N = 26, s = LS(2), bl = clamp(W.lv.plBlood, 0, 1);
    const edge = (mul, add) => cachedPath('nile:' + mul + ':' + add.toFixed(2), P2 => {
      const Lp = [], Rp = [];
      for (let i = 0; i <= N; i++) { const t = i / N, p = nilePt(t), w = nileW(t) * mul / 2 + add * (0.3 + t); Lp.push([p[0] + p[2] * w, p[1] + p[3] * w]); Rp.push([p[0] - p[2] * w, p[1] - p[3] * w]); }
      Lp.forEach((q, i) => (i ? P2.lineTo(q[0], q[1]) : P2.moveTo(q[0], q[1])));
      for (let i = Rp.length - 1; i >= 0; i--) P2.lineTo(Rp[i][0], Rp[i][1]);
      P2.closePath();
    });
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = css([150, 124, 86], 2);
    ctx.fill(edge(1.7, 6 * s));
    ctx.globalAlpha = 1;
    ctx.fillStyle = css([116, 96, 66], 2);
    ctx.fill(edge(1.28, 2.5 * s));
    // 水：清的河与血的河（血自上游而下）
    const y0 = geo().nileY0, y2 = W.h;
    const top = W.shade([150, 186, 196], 0.45, 0.05), bot = W.shade([44, 100, 122], 0, 0.02);
    const rT = W.shade([150, 28, 34], 0.3, 0.04), rB = W.shade([86, 10, 18], 0, 0.02);
    const gr = ctx.createLinearGradient(0, y0, 0, y2);
    if (bl < 0.005) {
      gr.addColorStop(0, U.rgb(top[0], top[1], top[2])); gr.addColorStop(1, U.rgb(bot[0], bot[1], bot[2]));
    } else {
      const front = clamp(bl * 1.25 - 0.1, 0, 1.2);
      const mix = t => { const w = U.mixRGB(top, bot, t), r = U.mixRGB(rT, rB, t), k = clamp((front - t) / 0.08 + 0.5, 0, 1); return U.mixRGB(w, r, k); };
      for (const t of [0, 0.2, 0.4, 0.6, 0.8, 1]) { const c = mix(t); gr.addColorStop(t, U.rgb(c[0] | 0, c[1] | 0, c[2] | 0)); }
      if (front > 0.02 && front < 0.98) {
        const c1 = mix(clamp(front - 0.05, 0, 1)), c2 = mix(clamp(front + 0.05, 0, 1));
        gr.addColorStop(clamp(front - 0.05, 0, 1), U.rgb(c1[0] | 0, c1[1] | 0, c1[2] | 0));
        gr.addColorStop(clamp(front + 0.05, 0, 1), U.rgb(c2[0] | 0, c2[1] | 0, c2[2] | 0));
      }
    }
    ctx.fillStyle = gr;
    ctx.fill(edge(1, 0));
    // 湿的岸边：一道浅色的边
    ctx.strokeStyle = css(bl > 0.3 ? [206, 150, 120] : [214, 204, 170], 2, 0.45 * dayA() + 0.1, 0.08);
    ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.stroke(edge(1, 0));
    // 血的河：暗红的水纹，缓缓流动（是水，不是布）
    if (bl > 0.25) {
      const rk = smoothstep(0.25, 0.8, bl);
      ctx.strokeStyle = css([62, 4, 10], 2, 0.55 * rk);
      ctx.lineWidth = Math.max(0.8, 1.3 * s);
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 30; i++) {
        const t = 0.05 + 0.93 * U.fract(rt(i * 5 + 740) + W.t * 0.012 * (0.7 + 0.6 * rt(i * 5 + 741)));
        const q = nilePt(t), w = nileW(t) / 2, off = (rt(i * 5 + 742) * 2 - 1) * 0.72 * w, len = w * (0.3 + 0.35 * rt(i * 5 + 743));
        const cx = q[0] + q[2] * off, cy = q[1] + q[3] * off;
        ctx.moveTo(cx - len, cy); ctx.quadraticCurveTo(cx, cy - 0.8 * s * (0.5 + t), cx + len, cy);
      }
      ctx.stroke();
    }
    // 天光的倒影（血的河上是暗红的微光）
    const night = W.night > 0.5;
    const gc = bl > 0.5 ? [255, 120, 110] : night ? [200, 214, 255] : [255, 246, 222];
    const ga = (night ? 0.35 * W.lv.moon : 0.45 * W.daylight) * (1 - 0.5 * bl);
    if (ga > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(gc[0], gc[1], gc[2], 1);
      ctx.lineWidth = Math.max(0.6, 1 * s);
      for (let band = 0; band < 3; band++) {
        ctx.beginPath();
        let any = false;
        for (let i = band; i < 26; i += 3) {
          const t = U.fract(rt(i * 5 + 700) + W.t * 0.018 * (0.7 + 0.6 * rt(i * 5 + 701)));
          if (t < 0.02) continue;
          const p = nilePt(t), w = nileW(t) / 2, off = (rt(i * 5 + 702) * 2 - 1) * 0.7 * w, len = w * (0.25 + 0.3 * rt(i * 5 + 703));
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
    ctx.lineCap = 'butt';
    // 河里的鱼死了（7:21）：浮起的白肚
    if (bl > 0.45) {
      const k = smoothstep(0.45, 0.9, bl);
      ctx.fillStyle = css([214, 206, 196], 2, 0.85 * k);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const t = 0.12 + 0.86 * U.fract(rt(i * 3 + 820) + W.t * 0.006 * (0.6 + rt(i * 3 + 821)));
        const p = nilePt(t), w = nileW(t) / 2, off = (rt(i * 3 + 822) * 2 - 1) * 0.6 * w;
        const cx = p[0] + p[2] * off, cy = p[1] + p[3] * off, r = (0.8 + 2.2 * t) * s;
        ctx.moveTo(cx + r, cy); ctx.ellipse(cx, cy, r, r * 0.34, (rt(i + 830) - 0.5) * 0.6, 0, TAU);
      }
      ctx.fill();
    }
    // 芦荻
    const rc = U.mixRGB([88, 124, 62], [120, 102, 66], clamp(W.lv.plStrip, 0, 1));
    ctx.strokeStyle = css(rc, 2);
    ctx.lineWidth = Math.max(0.5, 0.8 * s);
    const nR = (W.quality || 1) < 0.75 ? 32 : 64;
    const R = cachedData('reeds', () => {
      const out = [];
      for (let i = 0; i < 64; i++) {
        const t = 0.08 + 0.9 * rt(i * 3 + 900), side = i % 2 ? 1 : -1, p = nilePt(t), w = nileW(t) * 0.62 + 2 * s;
        out.push([p[0] + p[2] * w * side, p[1] + p[3] * w * side, (3 + 6 * rt(i * 3 + 901)) * s * (0.4 + 1.1 * t)]);
      }
      return out;
    });
    ctx.beginPath();
    const ws = W.wind * 1.5 * s + (W.lv.gale || 0) * 3 * s * Math.sin(W.t * 2.3);
    const short = 1 - 0.7 * clamp(W.lv.plStrip, 0, 1);
    for (let i = 0; i < nR; i++) {
      const q = R[i], sw = ws + Math.sin(W.t * 1.7 + i) * 0.6 * s;
      ctx.moveTo(q[0], q[1]); ctx.quadraticCurveTo(q[0] + sw * 0.3, q[1] - q[2] * 0.6 * short, q[0] + sw, q[1] - q[2] * short);
    }
    ctx.stroke();
  }
  // 埃及遍地都有了血（7:21）：地上几处积水也是暗红的
  const POOLS = [[0.536, 0.62, 1.1], [0.556, 0.26, 0.8], [0.636, 0.86, 1.3], [0.668, 0.45, 0.9], [0.742, 0.9, 1.2], [0.735, 0.35, 0.8], [0.538, 0.92, 1.4]];
  function drawPools(ctx) {
    const bl = W.lv.plBlood;
    if (bl < 0.02) return;
    const s = LS(2), k = smoothstep(0.1, 0.9, bl);
    // 每一处积水由两三个交叠的浅椭圆拼成，边上暗一圈
    ctx.fillStyle = css([118, 16, 24], 2, 0.5 * k);
    POOLS.forEach((q, j) => {
      const x = q[0] * W.w, y = fieldY(q[0], q[1]), r = 6 * s * q[2] * (0.6 + 0.8 * q[1]);
      for (let m = 0; m < 3; m++) {
        const ox = (rt(j * 9 + m + 3100) - 0.5) * r * 1.2, oy = (rt(j * 9 + m + 3110) - 0.5) * r * 0.14, rr = r * (0.5 + 0.45 * rt(j * 9 + m + 3120));
        ctx.beginPath(); ctx.ellipse(x + ox, y + oy, rr, rr * 0.28, 0, 0, TAU); ctx.fill();
      }
    });
    ctx.strokeStyle = css([60, 8, 12], 2, 0.45 * k);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (const q of POOLS) {
      const x = q[0] * W.w, y = fieldY(q[0], q[1]), r = 6 * s * q[2] * (0.6 + 0.8 * q[1]);
      ctx.moveTo(x + r * 0.7, y); ctx.ellipse(x, y, r * 0.7, r * 0.7 * 0.3, 0, 0, TAU);
    }
    ctx.stroke();
    ctx.strokeStyle = css([210, 120, 120], 2, 0.35 * bl * dayA(), 0.1);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (const q of POOLS) {
      const x = q[0] * W.w, y = fieldY(q[0], q[1]), r = 6 * s * q[2] * (0.6 + 0.8 * q[1]);
      ctx.moveTo(x - r * 0.5, y - r * 0.12); ctx.lineTo(x + r * 0.3, y - r * 0.14);
    }
    ctx.stroke();
  }
  // 天上：埃及的暖色尘雾
  function drawSkyHaze(ctx) {
    const hz = W.horizonY, top = hz - W.h * 0.34;
    const a = 0.16 * (0.35 + 0.65 * W.daylight);
    if (a < 0.004) return;
    const c = [246, 210, 156];
    const g = ctx.createLinearGradient(0, top, 0, hz + 4);
    g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], a));
    ctx.fillStyle = g;
    ctx.fillRect(0, top, W.w, hz - top + 4);
  }
  // 名的光晕（6:2）：暮色的天上，名所在之处
  const NAME_AT = () => [(port() ? 0.6 : 0.655) * W.w, (port() ? 0.37 : 0.25) * W.h];
  function drawNameHalo(ctx) {
    const k = W.lv.plName;
    if (k < 0.01) return;
    SP || sprites();
    const [x, y] = NAME_AT();
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.9 + 0.1 * Math.sin(W.t * 0.8);
    glowSp(ctx, SP.gold, x, y, M() * 0.34, k * 0.42 * br);
    glowSp(ctx, SP.white, x, y, M() * 0.12, k * 0.3 * br);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：灾——青蛙、虱子、苍蝇、分别之光、灰、雹与火、蝗虫、黑暗
  // ════════════════════════════════════════════════════════════
  // ── 青蛙（8:6）：自河里上来，一跳一跳地遮满了地；死了，被聚拢成堆（8:13–14）──
  const NFROG = 180;
  const HEAPS = [[0.516, 0.44], [0.6, 0.3], [0.668, 0.4], [0.724, 0.62]];
  // 进了宫殿、房屋（8:3）：门槛上、宫前的阶上、宝座旁也有青蛙
  const FROG_AT = () => {
    const out = [];
    X.houses.forEach((x, i) => { const dx = x + (i % 2 ? -1 : 1) * 25 * LS(2) * 1.3 * 0.5 / W.w; out.push([dx - 0.004, 0.02], [dx + 0.003, 0.05], [dx + 0.009, 0.03]); });
    out.push([X.palace - 0.006, 0.03], [X.palace + 0.004, 0.05], [X.palace + 0.012, 0.02], [X.throne + 0.011, 0.02], [X.throne + 0.017, 0.05], [X.throne - 0.013, 0.04]);
    return out;
  };
  function frogData() {
    return cachedData('frogs', () => {
      const out = [], AT = FROG_AT();
      for (let i = 0; i < NFROG; i++) {
        let v = 0.04 + 0.86 * rt(i * 7 + 300);
        let xf = lerp(0.47, 0.8, rt(i * 7 + 301));
        if (i < AT.length) { xf = AT[i][0]; v = AT[i][1]; }
        const rp = nilePt(i < AT.length ? 0.06 : clamp(v, 0, 1)), ex = nileEast(v);
        if (xf < ex + 0.006) xf = ex + 0.006 + 0.03 * rt(i * 7 + 302);
        xf = clamp(xf, 0.36, 0.8);
        let best = 0, bd = 9;
        HEAPS.forEach((h, j) => { const d = Math.abs(h[0] - xf) + Math.abs(h[1] - v) * 0.3; if (d < bd) { bd = d; best = j; } });
        const hp = HEAPS[best], hx = hp[0] + (rt(i * 7 + 303) - 0.5) * 0.012, hv = hp[1] + (rt(i * 7 + 304) - 0.5) * 0.06;
        out.push({ sx: rp[0], sy: rp[1], tx: xf * W.w, ty: fieldY(xf, v), hx: hx * W.w, hy: fieldY(hx, hv) - 3 * LS(2) * rt(i * 7 + 305), v, d: rt(i * 7 + 306) * 0.55,
          dir: xf * W.w >= rp[0] ? 1 : -1, z: 1.5 * (3.4 + 2.8 * v) * LS(2) * (0.85 + 0.3 * rt(i * 7 + 307)), hops: 3 + Math.floor(rt(i * 7 + 308) * 3), heap: best });
      }
      return out;
    });
  }
  function drawFrogs(ctx) {
    const k = W.lv.plFrog, gone = W.lv.plFrogGone;
    if (k < 0.005 || gone > 0.995) return;
    const die = clamp(W.lv.plFrogDie, 0, 1), heap = clamp(W.lv.plHeap, 0, 1), vis = 1 - gone;
    // 堆
    if (heap > 0.01) {
      const hk = smoothstep(0.1, 1, heap) * vis;
      ctx.fillStyle = css(U.mixRGB([92, 104, 64], [128, 120, 98], die), 2);
      ctx.beginPath();
      HEAPS.forEach((h, j) => {
        const s = LS(2) * (0.8 + 0.8 * h[1]), x = h[0] * W.w, y = fieldY(h[0], h[1]) + 1 * s, r = 22 * s * hk, hh = 13.5 * s * hk;
        if (r < 0.3) return;
        ctx.moveTo(x - r, y);
        for (let i = 0; i <= 14; i++) { const t = i / 14, px = x - r + 2 * r * t, py = y - Math.pow(Math.sin(t * Math.PI), 0.8) * hh * (0.75 + 0.5 * rt(j * 20 + i)); ctx.lineTo(px, py); }
        ctx.closePath();
      });
      ctx.fill();
    }
    const F = frogData();
    const alive = U.mixRGB([66, 98, 40], [140, 132, 116], die), belly = U.mixRGB([176, 196, 110], [196, 188, 170], die);
    const cA = css(alive, 2, vis), cB = css(belly, 2, vis);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? cB : cA;
      ctx.beginPath();
      for (let i = 0; i < F.length; i++) {
        const f = F[i];
        const p = clamp((k - f.d) / 0.45, 0, 1);
        if (p <= 0) continue;
        const hp = clamp(heap * 1.35 - rt(i + 1200) * 0.35, 0, 1);
        if (hp > 0.95) continue;
        const e = 1 - Math.pow(1 - p, 2);
        let x = lerp(f.sx, f.tx, e), y = lerp(f.sy, f.ty, e) - Math.abs(Math.sin(p * Math.PI * f.hops)) * f.z * 2.2 * (1 - p * 0.5) * (p < 1 ? 1 : 0);
        if (hp > 0) { x = lerp(x, f.hx, hp); y = lerp(y, f.hy, hp); }
        const z = f.z * (1 - 0.5 * hp), dir = f.dir;
        if (die < 0.5) {
          if (!pass) {
            // 后腿（蜷着的大腿）、身子（前高后低）、头、两只鼓起的眼
            ctx.moveTo(x - dir * z * 0.05, y - z * 0.26); ctx.ellipse(x - dir * z * 0.42, y - z * 0.28, z * 0.46, z * 0.3, dir * -0.25, 0, TAU);
            ctx.moveTo(x + dir * z * 0.7, y - z * 0.5); ctx.ellipse(x + dir * z * 0.08, y - z * 0.5, z * 0.62, z * 0.36, dir * -0.3, 0, TAU);
            ctx.moveTo(x + dir * z * 0.9, y - z * 0.72); ctx.ellipse(x + dir * z * 0.6, y - z * 0.7, z * 0.3, z * 0.22, dir * -0.15, 0, TAU);
            ctx.moveTo(x + dir * z * 0.62, y - z * 0.92); ctx.arc(x + dir * z * 0.5, y - z * 0.92, z * 0.12, 0, TAU);
            ctx.moveTo(x + dir * z * 0.8, y - z * 0.9); ctx.arc(x + dir * z * 0.68, y - z * 0.9, z * 0.11, 0, TAU);
            // 前腿与后脚
            ctx.rect(x + dir * z * 0.38 - z * 0.05, y - z * 0.4, z * 0.1, z * 0.4);
            ctx.moveTo(x - dir * z * 0.8, y); ctx.lineTo(x - dir * z * 0.2, y - z * 0.08); ctx.lineTo(x - dir * z * 0.1, y); ctx.closePath();
          } else {
            ctx.moveTo(x + dir * z * 0.53, y - z * 0.95); ctx.arc(x + dir * z * 0.5, y - z * 0.95, z * 0.05, 0, TAU);
            ctx.moveTo(x + dir * z * 0.71, y - z * 0.93); ctx.arc(x + dir * z * 0.68, y - z * 0.93, z * 0.05, 0, TAU);
            ctx.moveTo(x + dir * z * 0.5, y - z * 0.62); ctx.ellipse(x + dir * z * 0.1, y - z * 0.64, z * 0.4, z * 0.1, dir * -0.3, 0, TAU);
          }
        } else if (!pass) {
          // 死了：翻过来，四脚朝天
          ctx.moveTo(x + z * 0.8, y - z * 0.22); ctx.ellipse(x, y - z * 0.22, z * 0.8, z * 0.26, 0, 0, TAU);
          ctx.rect(x - z * 0.55, y - z * 0.7, z * 0.14, z * 0.45); ctx.rect(x + z * 0.42, y - z * 0.7, z * 0.14, z * 0.45);
        } else {
          ctx.moveTo(x + z * 0.5, y - z * 0.3); ctx.ellipse(x, y - z * 0.3, z * 0.5, z * 0.14, 0, 0, TAU);
        }
      }
      ctx.fill();
    }
  }

  // ── 虱子（8:17）：埃及遍地的尘土都变成虱子——地上一层细细颤动的微尘 ──
  function drawLice(ctx) {
    const k = W.lv.plLice;
    if (k < 0.01) return;
    const s = LS(2), q = W.quality || 1, N = Math.round(520 * q);
    // 尘雾：地上一层灰黄
    const top = gY(2, 0.6) - 80 * s;
    const g = ctx.createLinearGradient(0, top, 0, W.h);
    const hc = W.shade([140, 120, 96], 0.1, 0.05);
    g.addColorStop(0, U.rgba(hc[0], hc[1], hc[2], 0)); g.addColorStop(0.4, U.rgba(hc[0], hc[1], hc[2], 0.2 * k)); g.addColorStop(1, U.rgba(hc[0], hc[1], hc[2], 0.3 * k));
    ctx.fillStyle = g;
    ctx.fill(landPath(2, 0.3, X.wall + 0.02, 40));
    // 地上 20–40 像素高的一层灰雾：尘土变成的虱子，像一层起伏的灰
    const rg = gY(2, 0.6), band = ctx.createLinearGradient(0, rg - 48 * s, 0, rg + 20 * s);
    const bc = W.shade([150, 142, 130], 0.1, 0.06);
    band.addColorStop(0, U.rgba(bc[0], bc[1], bc[2], 0)); band.addColorStop(0.35, U.rgba(bc[0], bc[1], bc[2], 0.3 * k));
    band.addColorStop(0.7, U.rgba(bc[0], bc[1], bc[2], 0.26 * k)); band.addColorStop(1, U.rgba(bc[0], bc[1], bc[2], 0.08 * k));
    ctx.fillStyle = band;
    const bx0 = Math.max(0.4, nileEast(0) - 0.01) * W.w;
    ctx.fillRect(bx0, rg - 48 * s, (X.wall + 0.005) * W.w - bx0, 68 * s);
    const c1 = W.shade([46, 38, 32], 0, 0.02), c2 = W.shade([214, 198, 170], 0, 0.12);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? U.rgba(c2[0], c2[1], c2[2], 0.6 * k * dayA()) : U.rgba(c1[0], c1[1], c1[2], 0.85 * k);
      ctx.beginPath();
      for (let i = pass; i < N; i += 2) {
        const xf = lerp(0.37, X.wall, rt(i * 3 + 1000)), v = rt(i * 3 + 1001), hgt = Math.pow(rt(i * 3 + 1002), 1.4) * 70 * s;
        const ph = rt(i + 1003) * TAU, f1 = 7 + 9 * rt(i + 1004);
        const x = xf * W.w + Math.sin(W.t * f1 + ph) * 2.4 * s + Math.sin(W.t * 1.3 + ph * 2) * 5 * s;
        const y = fieldY(xf, v * 0.95) - hgt + Math.cos(W.t * f1 * 1.3 + ph) * 1.8 * s;
        const r = (0.9 + 0.8 * v) * Math.max(1, s);
        ctx.rect(x - r / 2, y - r / 2, r, r);
      }
      ctx.fill();
    }
    // 在人和牲畜身上（8:17）：一簇一簇颤动的黑点，围着每一个埃及人与牲畜
    ctx.fillStyle = U.rgba(c1[0] * 0.6, c1[1] * 0.6, c1[2] * 0.6, 0.92 * k);
    ctx.beginPath();
    for (let j = 0; j < LICE_ON.length; j++) {
      const f = fig(LICE_ON[j]);
      if (!f || f.dying) continue;
      const p = figPt(LICE_ON[j], 0.5), hh = f.isAnimal ? 12 * s : 22 * s;
      if (!p) continue;
      for (let c = 0; c < 8; c++) {
        const a = rt(j * 40 + c + 2600) * TAU + W.t * (0.8 + 1.4 * rt(c + 2610)) * (c % 2 ? 1 : -1), rr = (0.35 + 0.65 * rt(j * 40 + c + 2620));
        const cx = p[0] + Math.cos(a) * rr * hh * 0.55, cy = p[1] + Math.sin(a) * rr * hh;
        for (let m = 0; m < 3; m++) {
          const tw = Math.sin(W.t * (17 + 6 * m) + c * 2.1 + j) * 1.3 * s;
          const x = cx + (m - 1) * 1.8 * s + tw, y = cy + ((m * 7 + c) % 3 - 1) * 1.4 * s + Math.cos(W.t * 13 + m + c) * 1.1 * s;
          const r = Math.max(2, (2 + 0.8 * ((m + c) % 2)) * Math.min(1.2, s));
          ctx.rect(x - r / 2, y - r / 2, r, r);
        }
      }
    }
    ctx.fill();
  }

  // ── 成群的苍蝇（8:24）：宫殿、房屋、田间各有一团乌黑的蝇群 ──
  const SWARMS = [[0.536, 1.9, 0], [0.585, 0.9, 0.5], [0.648, 1.5, 0], [0.694, 1.2, 0], [0.74, 1.6, 0], [0.47, 0.9, 0.4], [0.62, 1.1, 0.7], [0.71, 1.0, 0.55], [0.53, 1.3, 0.8], [0.77, 0.9, 0.35]];
  const FLY_ON = ['pharaoh', 'mag1', 'mag2', 'e1', 'e2', 'e3', 'e4'];
  const LICE_ON = FLY_ON.concat(['t1', 't2'], ECOWS, EBEASTS);
  function swarm(ctx, cx, cy, R, per, k, j, s) {
    glowSp(ctx, SP.fly, cx, cy, R * 1.9, 0.6 * k);
    glowSp(ctx, SP.fly, cx, cy, R * 0.8, 0.85 * k);      // 密而黑的核
    ctx.beginPath();
    for (let i = 0; i < per; i++) {
      const a = W.t * (2.4 + 3.2 * rt(j * 50 + i)) * (i % 2 ? 1 : -1) + rt(j * 50 + i + 7) * TAU;
      const rr = R * (0.08 + 0.92 * Math.pow(rt(j * 50 + i + 3), 1.25));
      const x = cx + Math.cos(a) * rr + Math.sin(W.t * 17 + i) * 1.6 * s, y = cy + Math.sin(a * 1.3) * rr * 0.6 + Math.cos(W.t * 19 + i) * 1.4 * s;
      const wing = Math.sin(W.t * 47 + i * 1.7) > 0 ? 1.35 : 0.8;     // 翅膀一闪一闪：嗡嗡地动
      const r = Math.max(1.5, 1.7 * s);
      ctx.rect(x - r * wing / 2, y - r / 2, r * wing, r * 0.72);
    }
    ctx.fill();
  }
  // 有两团蝇群一次次冲向歌珊地前的光，又被弹回（8:22）：返回的一刻，光幕上一闪
  const BOUNCE = [4, 9];
  function bounceX(j, x0) {
    const lim = X.wall - 0.02, ph = U.fract(W.t * (0.11 + 0.03 * j / 9) + j * 0.37);
    if (ph < 0.62) { const e = ph / 0.62; return lerp(x0, lim, e * e); }
    const e = (ph - 0.62) / 0.38; return lerp(lim, x0, 1 - Math.pow(1 - e, 3));
  }
  const bounceHit = j => { const ph = U.fract(W.t * (0.11 + 0.03 * j / 9) + j * 0.37); return ph >= 0.6 && ph < 0.8 ? 1 - (ph - 0.6) / 0.2 : 0; };
  function drawFlies(ctx) {
    const k = W.lv.plFly;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), q = W.quality || 1, per = Math.round(64 * q), spreadK = 1 + 2.4 * (1 - k);
    // 埃及遍地因蝇败坏（8:24）：地上一层暗暗的浊气
    ctx.fillStyle = U.rgba(34, 28, 20, 0.16 * k);
    ctx.fill(landPath(2, 0.3, X.wall + 0.01, 40));
    glowSp(ctx, SP.fly, 0.6 * W.w, gY(2, 0.6) - 0.05 * W.h, Math.max(0.26 * W.w, 0.22 * W.h), 0.22 * k);
    ctx.fillStyle = css([12, 10, 8], 2, Math.min(1, 1.1 * k));
    const lim = (X.wall - 0.025) * W.w;
    const hits = [];
    for (let j = 0; j < SWARMS.length; j++) {
      const sw = SWARMS[j], bn = BOUNCE.includes(j);
      const cx0 = (bn ? bounceX(j, sw[0]) : sw[0]) * W.w + Math.sin(W.t * 0.37 + j * 1.9) * (bn ? 4 : 14) * s, cy = fieldY(sw[0], sw[2]) - sw[1] * 20 * s + Math.sin(W.t * 0.5 + j) * 5 * s;
      const R = (15 + 7 * rt(j + 1500)) * s * spreadK;
      swarm(ctx, Math.min(cx0, lim - R * 0.4), cy - (1 - k) * 30 * s, R, per, k, j, s);
      if (bn) { const hk = bounceHit(j); if (hk > 0.01) hits.push(cy - (1 - k) * 30 * s, hk); }
    }
    if (hits.length && W.lv.plWall > 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < hits.length; i += 2) {
        glowSp(ctx, SP.gold, X.wall * W.w, hits[i], 26 * s, hits[i + 1] * 0.7 * k);
        glowSp(ctx, SP.white, X.wall * W.w, hits[i], 9 * s, hits[i + 1] * 0.8 * k);
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = css([12, 10, 8], 2, Math.min(1, 1.1 * k));
    }
    // 落在人身上的（8:21）
    for (let i = 0; i < FLY_ON.length; i++) {
      const p = figPt(FLY_ON[i], 0.85);
      if (!p || p[0] > lim) continue;
      swarm(ctx, p[0] + Math.sin(W.t * 0.8 + i) * 4 * s, p[1] - (1 - k) * 30 * s, 10 * s * spreadK, Math.round(per * 0.5), k, 20 + i, s);
    }
    ctx.globalAlpha = 1;
  }

  // ── 分别之光（8:22；9:4；9:26）：歌珊地前一道温和的光幕，歌珊地上一层暖色 ──
  function drawWall(ctx) {
    const k = W.lv.plWall;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), x = X.wall * W.w, g = gY(2, X.wall), H = Math.min(W.h * 0.42, 220 * s + W.h * 0.12);
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.85 + 0.15 * Math.sin(W.t * 1.3);
    const bw = Math.max(24, Math.min(60, 48 * s));
    ctx.globalAlpha = k * 0.45 * br;
    ctx.drawImage(SP.beam, x - bw / 2, g - H, bw, H + (W.h - g) * 0.9);
    // 地上一道细细的光：分界之处
    const gl = ctx.createLinearGradient(0, g, 0, W.h);
    gl.addColorStop(0, 'rgba(255,238,196,0.9)'); gl.addColorStop(1, 'rgba(255,238,196,0.25)');
    ctx.globalAlpha = k * 0.6 * br;
    ctx.fillStyle = gl;
    ctx.fillRect(x - Math.max(0.7, 0.8 * s), g, Math.max(1.4, 1.6 * s), W.h - g);
    // 沿光幕升起的微光
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < 26; i++) {
      const ph = U.fract(W.t * (0.12 + 0.1 * rt(i + 1600)) + rt(i + 1601));
      const px = x + (rt(i + 1602) - 0.5) * 9 * s + Math.sin(W.t * 1.7 + i) * 2 * s, py = lerp(W.h - 4, g - H * 0.9, ph);
      ctx.globalAlpha = k * 0.7 * Math.sin(ph * Math.PI);
      ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8);
    }
    // 歌珊地上的暖色
    glowSp(ctx, SP.gold, 0.91 * W.w, g - 10 * s, Math.max(0.12 * W.w, 70 * s), k * 0.18);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 灰（9:10）：炉灰扬向天，化为细灰，落在埃及全地 ──
  function drawAsh(ctx) {
    const k = W.lv.plAsh;
    if (k < 0.01) return;
    const s = LS(2), q = W.quality || 1, N = Math.round(320 * q);
    const hc = W.shade([112, 106, 102], 0.2, 0.02);
    const top = gY(2, 0.6) - 20 * s;
    const g = ctx.createLinearGradient(0, top, 0, W.h);
    g.addColorStop(0, U.rgba(hc[0], hc[1], hc[2], 0.2 * k)); g.addColorStop(1, U.rgba(hc[0], hc[1], hc[2], 0.36 * k));
    ctx.fillStyle = g;
    ctx.fill(landPath(2, 0.3, X.wall + 0.02, 40));
    SP || sprites();
    glowSp(ctx, SP.ash, 0.58 * W.w, gY(2, 0.6) - 0.12 * W.h, Math.max(0.32 * W.w, 0.3 * W.h), 0.75 * k);
    const fc = W.shade([92, 88, 84], 0.1, 0.02);
    ctx.fillStyle = U.rgba(fc[0], fc[1], fc[2], 0.8 * k);
    ctx.beginPath();
    const y0 = W.h * 0.08, span = W.h - y0;
    for (let i = 0; i < N; i++) {
      const sp = (16 + 22 * rt(i * 3 + 1700)) * s;
      const yy = y0 + ((rt(i * 3 + 1701) * span + W.t * sp) % span);
      const x = lerp(0.3, X.wall, rt(i * 3 + 1702)) * W.w + Math.sin(W.t * 0.8 + i) * 8 * s;
      const r = (1.1 + 1.5 * rt(i + 1703)) * Math.max(0.9, s);
      ctx.moveTo(x + r, yy); ctx.arc(x, yy, r, 0, TAU);
    }
    ctx.fill();
  }

  // ── 雹与火搀杂（9:23–24）：埃及的地压暗，白雹斜落，火贴着地奔走；惟独歌珊地上有一道阳光 ──
  function drawStormDim(ctx) {
    const k = W.lv.plHail;
    if (k < 0.01) return;
    const g = ctx.createLinearGradient(0, 0, W.w, 0);
    const c = [8, 10, 18];
    g.addColorStop(0, U.rgba(c[0], c[1], c[2], 0.56 * k)); g.addColorStop(clamp(X.wall - 0.04, 0, 1), U.rgba(c[0], c[1], c[2], 0.5 * k));
    g.addColorStop(clamp(X.wall + 0.03, 0, 1), U.rgba(c[0], c[1], c[2], 0)); g.addColorStop(1, U.rgba(c[0], c[1], c[2], 0));
    ctx.fillStyle = g;
    ctx.fillRect(-20, W.horizonY - 2, W.w + 40, W.h - W.horizonY + 22);
  }
  const HUD_Y = 58;
  const FIRES = [];
  (function () { for (let i = 0; i < 16; i++) FIRES.push([lerp(0.37, 0.79, (i + rt(i + 1800)) / 16), 0.03 + 0.7 * rt(i + 1801), rt(i + 1802)]); })();
  function drawHail(ctx) {
    const k = W.lv.plHail;
    if (k < 0.01) return;
    SP || sprites();
    const s = LS(2), u = SU(), q = W.quality || 1;
    const xr = X.wall * W.w;
    // 贴地奔走的火：此起彼伏，一阵一阵地沿着地面跑；地上映着红光
    for (let i = 0; i < FIRES.length; i++) {
      const f = FIRES[i];
      if (f[0] < 0.47 && f[1] < 0.25) continue;
      const pulse = smoothstep(0.25, 1, Math.sin(W.t * (1.3 + 0.6 * f[2]) - f[0] * 30 + f[2] * 6));
      const kk = k * pulse;
      if (kk < 0.02) continue;
      const x = f[0] * W.w + Math.sin(W.t * 0.9 + i) * 6 * s, y = fieldY(f[0], f[1]);
      const h = (11 + 13 * f[2]) * s * (0.8 + 0.7 * f[1]);
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.ember, x, y - h * 0.2, h * 2.4, kk * 0.4);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, y, h, kk, i * 3.7);
    }
    // 雹：白粒带着短短的尾，斜着急落；其中夹着火（9:24 雹与火搀杂）
    const slant = 0.2 + 0.35 * (W.lv.gale || 0);
    const N = Math.round(380 * q * k) + 4, sp = 700 * u, H = W.h + 30;
    const embers = [];
    ctx.strokeStyle = U.rgba(232, 238, 248, 0.55 * k);
    ctx.lineWidth = Math.max(1, 1.3 * u);
    ctx.lineCap = 'round';
    ctx.beginPath();
    const heads = [];
    for (let i = 0; i < N; i++) {
      const hx = rt(i * 3 + 1900), hy = rt(i * 3 + 1901), hs = 0.8 + 0.4 * rt(i * 3 + 1902);
      const yy = hy * H + W.t * sp * hs;
      const y = (yy % H) - 20;
      const span = xr + 0.25 * W.w;
      const x = ((hx * span + slant * yy) % span) - 0.2 * W.w;
      if (x > xr - 30 * rt(i + 1903) || y < HUD_Y) continue;      // 不划过上方的标题与按钮
      const len = (10 + 10 * rt(i + 1904)) * u, r = (1.2 + 1.2 * rt(i + 1905)) * u;
      if (i % 6 === 2) { embers.push(x, y, r, len); continue; }
      ctx.moveTo(x, y); ctx.lineTo(x - slant * len, y - len);
      heads.push(x, y, r);
    }
    ctx.stroke();
    ctx.fillStyle = U.rgba(244, 248, 255, 0.9 * k);
    ctx.beginPath();
    for (let i = 0; i < heads.length; i += 3) { ctx.moveTo(heads[i] + heads[i + 2], heads[i + 1]); ctx.arc(heads[i], heads[i + 1], heads[i + 2], 0, TAU); }
    ctx.fill();
    // 雹打在地上溅起
    ctx.fillStyle = U.rgba(240, 244, 250, 0.75 * k);
    ctx.beginPath();
    for (let i = 0; i < 60; i++) {
      const ph = U.fract(W.t * (1.6 + rt(i + 2000)) + rt(i + 2001));
      if (ph > 0.2) continue;
      const xf = lerp(0.4, X.wall - 0.01, rt(i + 2002)), v = rt(i + 2003) * 0.9, x = xf * W.w, y = fieldY(xf, v);
      const r = (0.7 + 4 * ph) * s;
      ctx.moveTo(x - r * 1.6 + 0.9 * s, y - r * 0.4); ctx.arc(x - r * 1.6, y - r * 0.4, 0.9 * s, 0, TAU);
      ctx.moveTo(x + r * 1.6 + 0.9 * s, y - r * 0.5); ctx.arc(x + r * 1.6, y - r * 0.5, 0.9 * s, 0, TAU);
      ctx.moveTo(x + 1 * s, y - r); ctx.arc(x, y - r, 1 * s, 0, TAU);
    }
    ctx.fill();
    if (embers.length) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < embers.length; i += 8) glowSp(ctx, SP.ember, embers[i], embers[i + 1], embers[i + 2] * 8, 0.6 * k);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = U.rgba(255, 150, 60, 0.85 * k);
      ctx.lineWidth = Math.max(1.2, 1.8 * u);
      ctx.beginPath();
      for (let i = 0; i < embers.length; i += 4) { ctx.moveTo(embers[i], embers[i + 1]); ctx.lineTo(embers[i] - slant * embers[i + 3] * 1.4, embers[i + 1] - embers[i + 3] * 1.4); }
      ctx.stroke();
      ctx.fillStyle = U.rgba(255, 230, 170, 0.95 * k);
      ctx.beginPath();
      for (let i = 0; i < embers.length; i += 4) { ctx.moveTo(embers[i] + embers[i + 2], embers[i + 1]); ctx.arc(embers[i], embers[i + 1], embers[i + 2], 0, TAU); }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 歌珊地上的一道阳光（天上云开一隙——在按钮之下，画面高度的五分之一处）
  const SHINE_AT = () => [0.9 * W.w, (port() ? 0.26 : 0.2) * W.h];
  function drawShineSky(ctx) {
    const k = W.lv.plShine;
    if (k < 0.01) return;
    SP || sprites();
    const [x, y] = SHINE_AT();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, M() * 0.34, k * 0.5);
    glowSp(ctx, SP.white, x, y, M() * 0.13, k * 0.45);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawShine(ctx) {
    const k = W.lv.plShine;
    if (k < 0.01) return;
    SP || sprites();
    const [sx, sy] = SHINE_AT(), s = LS(2), x = 0.91 * W.w, g = gY(2, 0.91), bw = Math.max(0.2 * W.w, 110 * s);
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.9 + 0.1 * Math.sin(W.t * 0.7);
    ctx.globalAlpha = k * 0.36 * br;
    ctx.drawImage(SP.beam, sx - bw / 2, sy - 0.04 * W.h, bw, g + 30 * s - sy + 0.04 * W.h);
    glowSp(ctx, SP.gold, x, g - 6 * s, bw * 0.7, k * 0.25);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 蝗虫（10:13–19）：东风自左边的海上刮来一团暗云，落满埃及；西风又把它们刮起，吹入红海 ──
  function locustCover() {
    const k = W.lv.plLocust, lx = W.lv.plLocX;
    return clamp(k * (1 - Math.abs(lx) * 1.6), 0, 1);
  }
  // 横屏时经文所在的一块（左下，海上）：[外框右, 外框上, 内框右, 内框上]（像素）
  const narrZone = () => (port() ? null : [0.5 * W.w, 0.46 * W.h, 0.44 * W.w, 0.56 * W.h]);
  function drawLocusts(ctx) {
    const k = W.lv.plLocust;
    if (k < 0.01) return;
    SP || sprites();
    const lx = W.lv.plLocX, settle = clamp(1 - Math.abs(lx) * 1.4, 0, 1);
    const s = LS(2), q = W.quality || 1;
    const cw = W.w * 0.92, ch = Math.min(W.h * 0.42, cw * 0.5);
    const cx = (0.585 + 0.95 * lx) * W.w;
    const gy = gY(2, 0.6);
    const cy = lerp(W.horizonY - ch * 0.35, gy - ch * 0.22, settle);
    // 遮天：日光都暗了
    const cover = locustCover();
    if (cover > 0.01) { ctx.fillStyle = U.rgba(40, 30, 16, 0.32 * cover); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); }
    // 云团：四层错开，缓缓翻动。
    // 横屏时经文在左下（海上）：那里的蝗虫云柔和地淡去，免得压在字后——把每一层按格子切开（源图的子矩形），
    // 每格以自己的透明度画（不裁剪、不离屏，便宜）
    const NZ = narrZone(), IMG = SP.swarm, IW = IMG.width, IH = IMG.height;
    const NC = 9, NR = 5, cols = [], rows = [], HX = [], VY = [];
    if (NZ) {
      const xa = NZ[2] - 0.18 * W.w;                     // 羽化带：xa → 区右（NZ[0]）
      cols.push(0); for (let c = 1; c < NC; c++) cols.push(lerp(xa, NZ[0], (c - 1) / (NC - 1))); cols.push(NZ[0]);
      for (let c = 0; c < NC; c++) HX.push(c ? 0.86 * (1 - (c - 0.5) / (NC - 1)) : 0.86);
      for (let r = 0; r < NR; r++) rows.push(r < NR - 1 ? lerp(NZ[1], NZ[3], r / (NR - 1)) : NZ[3]);
      rows.push(W.h + 40);
      for (let r = 0; r < NR; r++) VY.push(r < NR - 1 ? (r + 0.5) / (NR - 1) : 1);
    }
    const piece = (dx, dy, dw, dh, x0, y0, x1, y1, a) => {
      x0 = Math.max(x0, dx); y0 = Math.max(y0, dy); x1 = Math.min(x1, dx + dw); y1 = Math.min(y1, dy + dh);
      if (x1 - x0 < 0.5 || y1 - y0 < 0.5 || a < 0.004) return;
      ctx.globalAlpha = a;
      ctx.drawImage(IMG, (x0 - dx) / dw * IW, (y0 - dy) / dh * IH, (x1 - x0) / dw * IW, (y1 - y0) / dh * IH, x0, y0, x1 - x0, y1 - y0);
    };
    for (let j = 0; j < 4; j++) {
      const ox = Math.sin(W.t * (0.21 + j * 0.07) + j * 2) * 0.05 * cw, oy = Math.cos(W.t * (0.17 + j * 0.05) + j) * 0.05 * ch;
      const sc = 0.75 + 0.17 * j, A = clamp(k * (0.95 - j * 0.16), 0, 1);
      const dx = cx - cw * sc / 2 + ox, dy = cy - ch * sc / 2 + oy, dw = cw * sc, dh = ch * sc;
      if (!NZ || dx >= NZ[0] || dy + dh <= NZ[1]) { ctx.globalAlpha = A; ctx.drawImage(IMG, dx, dy, dw, dh); continue; }
      piece(dx, dy, dw, dh, -1e5, -1e5, 1e5, NZ[1], A);                  // 区上
      piece(dx, dy, dw, dh, NZ[0], NZ[1], 1e5, 1e5, A);                  // 区右
      for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
        const x0 = c ? cols[c] : -1e5;
        piece(dx, dy, dw, dh, x0, rows[r], cols[c + 1], rows[r + 1], A * (1 - HX[c] * VY[r]));
      }
    }
    // 近处飞过的一只只蝗虫
    const N = Math.round(200 * q), vx = (W.lv.gale || 0.3) * 90 * s * (lx < -0.05 && W.lv.plLocX < W.lt.plLocX + 0.01 ? -1 : 1);
    ctx.globalAlpha = clamp(k, 0, 1);
    ctx.fillStyle = css([52, 42, 26], 2);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const bx = rt(i * 3 + 2100), by = rt(i * 3 + 2101);
      const x = cx - cw * 0.55 + U.fract(bx + W.t * (0.02 + 0.03 * rt(i + 2102)) * Math.sign(vx || 1)) * cw * 1.1;
      const y = cy - ch * 0.5 + by * ch * 1.05 + Math.sin(W.t * 3 + i) * 3 * s;
      if (NZ && x < NZ[0] && y > NZ[1]) continue;
      const L = (2.4 + 2.4 * rt(i + 2103)) * s, fl = Math.sin(W.t * 40 + i) > 0 ? 0.9 : 0.3;
      ctx.rect(x - L / 2, y - 0.5 * s, L, 0.9 * s * (1 + fl));
    }
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 落在地上的蝗虫：近地上一层密密的暗点
  function drawLocustGround(ctx) {
    const lc = locustCover();
    if (lc < 0.02) return;
    const s = LS(2), q = W.quality || 1, N = Math.round(620 * q * lc);
    ctx.fillStyle = css([44, 36, 22], 2, 0.85);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const xf = lerp(0.37, 0.82, rt(i * 2 + 2200)), v = rt(i * 2 + 2201);
      const x = xf * W.w + Math.sin(W.t * 2 + i) * 0.6 * s, y = fieldY(xf, v * 0.95);
      const L = (1.2 + 1.6 * v) * s;
      ctx.rect(x - L / 2, y - 0.8 * s, L, 0.8 * s);
    }
    ctx.fill();
  }

  // ── 黑暗（10:21–23）：埃及遍地乌黑，似乎摸得着；惟有以色列人家中都有亮光 ──
  let DK = null, DKg = null;
  const GOSHEN_C = () => [0.9 * W.w, gY(2, 0.9) + 0.02 * W.h];
  // 摩西身边的一点光：照着摩西，也照着宝座上的法老（10:28–29 二人对话）；摩西走远了，光就只随着他
  function lampAt() {
    if (!S.mosesLamp) return null;
    const a = figPt('moses', 0), b = figPt('pharaoh', 0), s = LS(2);
    if (!a) return null;
    const d = b ? Math.abs(a[0] - b[0]) : 1e9, k = b ? 1 - smoothstep(0.06 * W.w, 0.1 * W.w, d) : 0;
    const mx = lerp(a[0], b ? (a[0] + b[0]) / 2 : a[0], k), gy = lerp(a[1], b ? Math.max(a[1], b[1]) : a[1], k);
    return [mx, gy - 20 * s, lerp(40 * s, Math.min(d, 0.1 * W.w) / 2 + 36 * s, k), 38 * s];
  }
  function drawDark(ctx) {
    const k = W.lv.plDark;
    if (k < 0.005) return;
    SP || sprites();
    const sc = 0.5, dw = Math.max(2, Math.ceil(W.w * sc)), dh = Math.max(2, Math.ceil(W.h * sc));
    if (!DK || DK.width !== dw || DK.height !== dh) { DK = cnv(dw, dh); DKg = DK.getContext('2d'); }
    const g = DKg;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over';
    g.clearRect(0, 0, dw, dh);
    g.fillStyle = U.rgba(2, 2, 6, clamp(0.975 * k, 0, 0.975));
    g.fillRect(0, 0, dw, dh);
    g.globalCompositeOperation = 'destination-out';
    // 光透出的洞：预绘的径向遮罩（1 → 0.9 → 0.4 → 0），按椭圆拉伸
    if (!SP.hole) {
      const hc = cnv(128, 128), hg = hc.getContext('2d'), gr = hg.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.35, 'rgba(0,0,0,0.9)'); gr.addColorStop(0.7, 'rgba(0,0,0,0.4)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      hg.fillStyle = gr; hg.fillRect(0, 0, 128, 128);
      SP.hole = hc;
    }
    const hole = (x, y, rx, ry, a) => {
      if (a < 0.01 || rx < 1) return;
      g.globalAlpha = Math.min(1, a);
      g.drawImage(SP.hole, (x - rx) * sc, (y - ry) * sc, 2 * rx * sc, 2 * ry * sc);
    };
    const s = LS(2);
    const [gx, gyy] = GOSHEN_C();
    // 歌珊地整片微微透出；每一家的屋前亮得多（光自屋里出来），屋前的地也亮着（坐着的人连脚带地都看得见）
    const P_ = port();
    hole(gx, gyy, P_ ? 0.24 * W.w : Math.max(0.13 * W.w, 70 * s), Math.max(P_ ? 0.075 * W.h : 0.1 * W.h, 60 * s), 0.72);
    huts((id) => {
      const p = getP(id); if (!p) return;
      const D = hutDoor(p), r = 30 * D.s;
      hole(D.x, D.y - D.dh * 0.4, r * 1.25, r, 1);
      hole(p.x * W.w + (D.x - p.x * W.w) * 0.3, fieldY(p.x, 0.18), 45 * s * (P_ ? 1.35 : 1), 16 * s * (P_ ? 1.35 : 1), 1);
    });
    const LA = lampAt();
    if (LA) hole(LA[0], LA[1], LA[2], LA[3], 0.92);
    g.globalAlpha = 1;
    ctx.globalAlpha = 1;
    ctx.drawImage(DK, 0, 0, W.w, W.h);
    // 屋里的亮光：一家一家暖暖地亮着
    ctx.globalCompositeOperation = 'lighter';
    huts((id) => {
      const p = getP(id); if (!p) return;
      const D = hutDoor(p), fl = 0.88 + 0.12 * Math.sin(W.t * 5 + p.seed);
      glowSp(ctx, SP.warm, D.x, D.y - D.dh * 0.45, 46 * D.s, 0.34 * k * fl);
      glowSp(ctx, SP.gold, D.x, D.y - D.dh * 0.5, 16 * D.s, 0.4 * k * fl);
      // 门前地上的一片暖光
      const fy = fieldY(p.x, 0.16);
      ctx.save(); ctx.translate(D.x, fy); ctx.scale(1, 0.34);
      glowSp(ctx, SP.warm, 0, 0, 40 * s * (P_ ? 1.35 : 1), 0.3 * k * fl);
      ctx.restore();
    });
    if (LA) glowSp(ctx, SP.gold, LA[0], LA[1], LA[2] * 0.9, 0.16 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 出埃及的大队（12:37–38）：中丘上一长行小小的人、火把与牛羊，自右（歌珊）向左（东，向海）缓缓而行，扬起一层尘 ──
  const HOSTN = 110;
  function hostSpan() {
    const sp1 = W.landSpan ? W.landSpan(1) : [0.49 * W.w, W.w];
    const xL = Math.max(0.5, sp1[0] / W.w + 0.035), xR = 1.03;
    return [xL, xR, lerp(xR, xL, clamp(W.lv.plHost, 0, 1))];
  }
  function drawHost(ctx) {
    const k = clamp(W.lv.plHost, 0, 1);
    if (k < 0.005) return;
    SP || sprites();
    const l = 1, s = LS(1), [xL, xR, head] = hostSpan(), route = xR - xL;
    const Hh = 21 * s, nk = nightK(), day = dayA();
    // 尘：一层暖灰的薄雾贴着行列
    ctx.globalCompositeOperation = 'source-over';
    for (let j = 0; j < 9; j++) {
      const xf = lerp(head + 0.02, 1.0, (j + 0.5) / 9) + Math.sin(W.t * 0.3 + j) * 0.01;
      if (xf < head) continue;
      glowSp(ctx, SP.smoke, xf * W.w, gY(l, xf) - Hh * 0.6, Hh * 2.4, 0.2 * (0.35 + 0.65 * day) * smoothstep(head, head + 0.05, xf));
    }
    const PP = [new Path2D(), new Path2D()], BB = [new Path2D(), new Path2D()], torch = [];
    for (let i = 0; i < HOSTN; i++) {
      const u = U.fract(i / HOSTN + rt(i + 3300) * 0.004 + W.t * 0.0032 / route);
      const xf = xR - u * route;
      if (xf < head || xf > 1.02) continue;
      const a = smoothstep(head, head + 0.03, xf) * smoothstep(xL - 0.005, xL + 0.03, xf);
      if (a < 0.33) continue;
      const bi = a < 0.66 ? 1 : 0, x = xf * W.w, y = gY(l, xf) + (0.6 + 2.2 * rt(i + 3310)) * s, kd = i % 6;
      const ph = W.t * 5.2 + i * 1.3, bob = Math.abs(Math.sin(ph)) * 0.5 * s, str = Math.sin(ph) * 0.05 * Hh;
      if (kd === 5) {
        // 牛羊
        const B = BB[bi], big = rt(i + 3330) < 0.35, bw = (big ? 0.42 : 0.3) * Hh, bh = (big ? 0.2 : 0.16) * Hh, by = y - bh * 2.1 - bob * 0.5;
        B.moveTo(x + bw, by); B.ellipse(x, by, bw, bh, 0, 0, TAU);
        B.moveTo(x - bw * 0.9 + bh * 0.7, by - bh * 0.4); B.arc(x - bw * 0.95, by - bh * 0.4, bh * 0.7, 0, TAU);
        for (const lx of [-0.6, -0.3, 0.3, 0.6]) B.rect(x + lx * bw - 0.4 * s, by, 0.8 * s, y - by);
        continue;
      }
      const P2 = PP[bi], hs = rt(i + 3320) < 0.2 ? 0.66 : 1, H = Hh * hs, top = y - H - bob, r = 0.12 * H;
      P2.moveTo(x + r, top + r); P2.arc(x, top + r, r, 0, TAU);
      P2.moveTo(x - 0.1 * H, top + 2 * r); P2.lineTo(x + 0.1 * H, top + 2 * r); P2.lineTo(x + 0.17 * H + str, y); P2.lineTo(x - 0.17 * H - str, y); P2.closePath();
      if (i % 3 === 1 && hs === 1) P2.rect(x + 0.02 * H, top + 2 * r - 0.14 * H, 0.24 * H, 0.17 * H);     // 肩上的抟面盆（12:34）
      if (i % 4 === 2 && hs === 1) {
        P2.rect(x - 0.21 * H, top - 0.12 * H, Math.max(0.6, 0.07 * H), H * 1.1);                  // 杖
        if (i % 8 === 2) torch.push(x - 0.18 * H, top - 0.16 * H, i);                            // 火把
      }
    }
    const pc = css([72, 56, 44], l), bc = css([150, 132, 108], l);
    for (let bi = 0; bi < 2; bi++) {
      ctx.globalAlpha = bi ? 0.5 : 1;
      ctx.fillStyle = bc; ctx.fill(BB[bi]);
      ctx.fillStyle = pc; ctx.fill(PP[bi]);
    }
    if (torch.length) {
      ctx.globalCompositeOperation = 'lighter';
      const tk = 0.35 + 0.65 * nk;
      for (let i = 0; i < torch.length; i += 3) {
        const fl = 0.8 + 0.2 * Math.sin(W.t * 11 + torch[i + 2]);
        glowSp(ctx, SP.warm, torch[i], torch[i + 1], 9 * s * fl + 3, 0.75 * tk);
        glowSp(ctx, SP.gold, torch[i], torch[i + 1], 3 * s + 1.2, 0.95 * tk * fl);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 黎明：为奴之家的城退入阴影（地上压暗；房屋与宫殿的颜色由 DIM 压暗）
  function drawEShadeGround(ctx) {
    const k = W.lv.plShade;
    if (k < 0.01) return;
    const g = ctx.createLinearGradient(0, 0, W.w, 0), c = 'rgba(16,12,26,';
    g.addColorStop(0.36, c + '0)'); g.addColorStop(0.47, c + (0.32 * k).toFixed(3) + ')');
    g.addColorStop(X.wall - 0.035, c + (0.32 * k).toFixed(3) + ')'); g.addColorStop(X.wall + 0.01, c + '0)');
    ctx.fillStyle = g;
    ctx.fill(landPath(2, 0.25, 1.0, 56));
  }

  // ════════════════════════════════════════════════════════════
  //  情节里的光与动（只在"看着"时放；重演时略过）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  let PB = null, PBg = null;
  function fxAdd(b, e) { if (b && b.instant) return null; e.t = 0; FXL.push(e); return e; }
  function beam(b, xf, o) {
    o = o || {};
    if (!fxAdd(b, { type: 'beam', dur: o.dur || 7, xf, w: (o.w || 70) * SU(), k: o.k || 1, white: !!o.white })) return;
    if (o.ring !== false) fx().ring(xf * W.w, gY(2, xf) - 16 * LS(2), o.white ? [226, 232, 255] : [255, 236, 190], M() * (o.r || 0.25), 2.2, 2);
  }
  const mote = (b, from, to, c, dur, n) => fxAdd(b, { type: 'mote', dur: dur || 3, a: from, b: to, c: c || [255, 226, 160], n: n || 14 });
  const glint = (b, id, c, frac) => fxAdd(b, { type: 'glint', dur: 3.2, id, c: c || [255, 236, 190], frac: frac || 0.62 });
  // 半夜走过全地的那一阵（12:12，23）：自左而右的一道苍白的风；有血的门，它便越过
  const PASS = { x0: 0.3, x1: 1.08, dur: 9.5 };
  const passT = xf => PASS.dur * (xf - PASS.x0) / (PASS.x1 - PASS.x0);
  function passGlow(xf) {
    let g = 0;
    for (const e of FXL) {
      if (e.type !== 'pass') continue;
      const bx = lerp(PASS.x0, PASS.x1, clamp(e.t / e.dur, 0, 1));
      g = Math.max(g, Math.exp(-Math.pow((xf - bx) / 0.035, 2)));
    }
    return g;
  }

  // ── 杖变作蛇（7:10–12）：亚伦的杖落地成蛇；术士们的杖也成蛇；亚伦的蛇把它们一条一条地吞了，又成了杖 ──
  // 蛇在宝座前、离观者较近处（近而大）；术士们的蛇在河的东岸之上
  const SNAKE_A = 0.558, SNAKE_M = [0.54, 0.527], SNAKE_V = [0.54, 0.4], SNAKE_VA = 0.47, NSNAKE = SNAKE_M.length;
  const SN_W = 4.2, SN_LA = 55, SN_LM = 42;
  function serpent(ctx, hx, hy, dir, len, amp, raise, w, col, a, t, seed) {
    if (a < 0.01 || len < 1) return;
    const N = 14, seg = len / N, pts = [];
    for (let i = 0; i <= N; i++) {
      const k = i / N;
      const x = hx + dir * -1 * i * seg * (1 - 0.1 * amp);
      const y = hy + Math.sin(i * 0.95 - t * 6.5 + seed) * amp * 1.6 * w * (0.25 + 0.75 * k) - (i === 0 ? raise * 3.2 * w : i === 1 ? raise * 1.6 * w : i === 2 ? raise * 0.5 * w : 0);
      pts.push(x, y);
    }
    ctx.globalAlpha = a;
    ctx.strokeStyle = col;
    ctx.lineCap = 'round';
    for (let i = 0; i < N; i++) {
      const k = i / N;
      ctx.lineWidth = Math.max(0.6, w * (1.15 - 0.85 * k));
      ctx.beginPath(); ctx.moveTo(pts[i * 2], pts[i * 2 + 1]); ctx.lineTo(pts[i * 2 + 2], pts[i * 2 + 3]); ctx.stroke();
    }
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(pts[0] + dir * w * 0.5, pts[1], w * 0.95, w * 0.62, dir * -0.2, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawSerpents(ctx, e) {
    const t = e.t, s = LS(2), w = SN_W * s;
    const bronze = css([196, 150, 72], 2, 1, 0.12), dark = css([52, 46, 44], 2, 1, 0.02);
    const hand = id => { const p = figPt(id, 0.58); return p || [W.w * 0.5, W.h * 0.8]; };
    const yA = fieldY(SNAKE_A, SNAKE_VA);
    // 亚伦的杖/蛇
    const tA0 = 0, tStaff = 0.7, tForm = 1.4;
    let ax = SNAKE_A * W.w, ay = yA, lenA = SN_LA * s, alive = 1;
    if (t < tStaff) {
      // 杖自手中落下：一根直的木杖，自竖而横
      const h = hand('aaron'), k = t / tStaff;
      const x0 = lerp(h[0], ax + 8 * s, k), y0 = lerp(h[1] - 14 * s, ay, k), ang = lerp(-1.4, 0, k * k);
      ctx.strokeStyle = css([112, 82, 52], 2); ctx.lineWidth = Math.max(0.8, 1.6 * s); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x0 - Math.cos(ang) * 16 * s, y0 - Math.sin(ang) * 16 * s); ctx.lineTo(x0 + Math.cos(ang) * 16 * s, y0 + Math.sin(ang) * 16 * s); ctx.stroke();
    } else {
      const form = clamp((t - tStaff) / (tForm - tStaff), 0, 1);
      let dir = -1, amp = form, raise = form;
      // 吞吃：头依次移到每条术士的蛇那里
      let eaten = 0;
      for (let j = 0; j < NSNAKE; j++) {
        const t0 = e.ts + j * 1.8;
        if (t < t0) break;
        const tx = SNAKE_M[j] * W.w + 5 * s, ty = fieldY(SNAKE_M[j], SNAKE_V[j]);
        const k = clamp((t - t0) / 0.9, 0, 1), fromX = j === 0 ? SNAKE_A * W.w : SNAKE_M[j - 1] * W.w + 5 * s, fromY = j === 0 ? yA : fieldY(SNAKE_M[j - 1], SNAKE_V[j - 1]);
        ax = lerp(fromX, tx, k); ay = lerp(fromY, ty, k);
        eaten = j + clamp((t - t0 - 0.9) / 0.9, 0, 1);
      }
      lenA = SN_LA * s * (1 + 0.12 * eaten);
      // 复归为杖：变直、竖起、回到亚伦手中
      if (t > e.te) {
        const k = clamp((t - e.te) / 0.8, 0, 1), k2 = clamp((t - e.te - 0.8) / 0.7, 0, 1);
        amp *= 1 - k; raise *= 1 - k;
        if (k2 > 0) {
          const h = hand('aaron');
          const cx = lerp(ax - lenA * 0.5 * -1, h[0], k2), cy = lerp(ay, h[1] - 12 * s, k2), ang = lerp(0, -1.45, k2);
          ctx.globalAlpha = 1 - clamp((t - e.te - 1.5) / 0.4, 0, 1);
          ctx.strokeStyle = css([112, 82, 52], 2); ctx.lineWidth = Math.max(0.8, 1.2 * s); ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(cx - Math.cos(ang) * 9 * s, cy - Math.sin(ang) * 9 * s); ctx.lineTo(cx + Math.cos(ang) * 9 * s, cy + Math.sin(ang) * 9 * s); ctx.stroke();
          ctx.globalAlpha = 1;
          alive = 0;
        }
      }
      if (alive) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, ax, ay - 2 * s, 22 * s, 0.26 * (0.6 + 0.4 * Math.sin(t * 3)));
        ctx.globalCompositeOperation = 'source-over';
        serpent(ctx, ax, ay, dir, lenA, amp, raise, w, bronze, 1, t, 0);
      }
    }
    // 术士们的杖/蛇
    for (let j = 0; j < NSNAKE; j++) {
      const tm = e.tm + j * 0.25;
      if (t < tm) continue;
      const mx = SNAKE_M[j] * W.w, my = fieldY(SNAKE_M[j], SNAKE_V[j]);
      const k = (t - tm) / 0.7;
      if (k < 1) {
        const h = hand(MAGS[NSNAKE - 1 - j]);
        const x0 = lerp(h[0], mx, k), y0 = lerp(h[1] - 12 * s, my, k), ang = lerp(-1.4, 0, k * k);
        ctx.strokeStyle = css([70, 58, 46], 2); ctx.lineWidth = Math.max(0.8, 1.1 * s); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0 - Math.cos(ang) * 8 * s, y0 - Math.sin(ang) * 8 * s); ctx.lineTo(x0 + Math.cos(ang) * 8 * s, y0 + Math.sin(ang) * 8 * s); ctx.stroke();
        continue;
      }
      const form = clamp(k - 1, 0, 1);
      const te = e.ts + j * 1.8 + 0.9, gone = clamp((t - te) / 0.9, 0, 1);
      if (gone >= 1) continue;
      serpent(ctx, mx, my, 1, SN_LM * s * (1 - gone), form, form * (1 - gone), w * 0.85, dark, 1 - gone * 0.5, t, j * 2.1);
    }
    ctx.globalAlpha = 1;
  }

  function drawFX(ctx) {
    SP || sprites();
    for (const e of FXL) {
      const k = clamp(e.t / 0.8, 0, 1) * clamp((e.dur - e.t) / 1.2, 0, 1);
      if (e.type === 'beam') {
        const x = e.xf * W.w, g = gY(2, e.xf), H = g + 20;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = k * 0.55 * e.k;
        ctx.drawImage(SP.beam, x - e.w / 2, g - H, e.w, H + 8 * LS(2));
        glowSp(ctx, e.white ? SP.white : SP.gold, x, g - 12 * LS(2), e.w * 0.9, k * 0.4 * e.k);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'arm') {
        // 伸出来的膀臂（6:6）：一道自名而出、越过全地、伸到法老宫上的光
        const [x0, y0] = NAME_AT(), x1 = X.palace * W.w, y1 = gY(2, X.palace) - 60 * LS(2);
        const cx = lerp(x0, x1, 0.45), cy = Math.min(y0, y1) - 0.12 * W.h;
        const reach = clamp(e.t / 2.4, 0, 1), fade = clamp((e.dur - e.t) / 2.5, 0, 1);
        const N = 36, n = Math.max(2, Math.round(N * reach));
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        for (let pass = 0; pass < 2; pass++) {
          ctx.strokeStyle = pass ? 'rgba(255,246,222,1)' : 'rgba(255,214,140,1)';
          ctx.lineWidth = (pass ? 1.4 : 6) * SU();
          ctx.globalAlpha = fade * (pass ? 0.85 : 0.22);
          ctx.beginPath();
          for (let i = 0; i < n; i++) { const t = i / (N - 1), x = qb(x0, cx, x1, t), y = qb(y0, cy, y1, t); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
          ctx.stroke();
        }
        const tt = (n - 1) / (N - 1), hx = qb(x0, cx, x1, tt), hy = qb(y0, cy, y1, tt);
        glowSp(ctx, SP.gold, hx, hy, 30 * SU(), fade * 0.7);
        if (reach >= 1) glowSp(ctx, SP.gold, x1, y1 + 30 * LS(2), 70 * LS(2), fade * 0.35);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'mote') {
        const A = figPt(e.a, 0.55), B = figPt(e.b, 0.55);
        if (!A || !B) continue;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgb(e.c[0], e.c[1], e.c[2]);
        for (let i = 0; i < e.n; i++) {
          const f = clamp((e.t - i * 0.08) / (e.dur - 1.2), 0, 1);
          if (f <= 0 || f >= 1) continue;
          const x = lerp(A[0], B[0], f) + Math.sin(i * 2.1 + e.t * 3) * 4, y = lerp(A[1], B[1], f) - Math.sin(f * Math.PI) * 24 * SU();
          ctx.globalAlpha = 0.8 * Math.sin(f * Math.PI);
          ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'host') {
        // 耶和华的军队（12:41）：行列里每个人的头上升起一点金光
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgb(255,228,168)';
        const s = LS(2);
        for (let j = 0; j < e.ids.length; j++) {
          const p = figPt(e.ids[j], 1);
          if (!p) continue;
          for (let m = 0; m < 3; m++) {
            const ph = U.fract(e.t * 0.22 + rt(j * 7 + m + 2700));
            const x = p[0] + Math.sin(e.t * 1.3 + j + m * 2) * 4 * s, y = p[1] - 4 * s - ph * 70 * s;
            ctx.globalAlpha = k * 0.8 * Math.sin(ph * Math.PI);
            ctx.fillRect(x - 1.1, y - 1.1, 2.2, 2.2);
            if (m === 0) glowSp(ctx, SP.gold, x, y, 7 * s, k * 0.3 * Math.sin(ph * Math.PI));
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'glint') {
        const p = figPt(e.id, e.frac);
        if (!p) continue;
        ctx.globalCompositeOperation = 'lighter';
        const tw = 0.7 + 0.3 * Math.sin(e.t * 9);
        glowSp(ctx, SP.gold, p[0], p[1], 16 * SU(), k * 0.7 * tw);
        ctx.strokeStyle = U.rgba(e.c[0], e.c[1], e.c[2], k * 0.8);
        ctx.lineWidth = 1;
        const r = 6 * SU() * tw;
        ctx.beginPath(); ctx.moveTo(p[0] - r, p[1]); ctx.lineTo(p[0] + r, p[1]); ctx.moveTo(p[0], p[1] - r); ctx.lineTo(p[0], p[1] + r); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'pass') {
        // 一道苍白的风：自上而下的冷光与细雾，贴着地走；在有血的门前抬起，越过（12:23）
        const f = clamp(e.t / e.dur, 0, 1), bx = lerp(PASS.x0, PASS.x1, f) * W.w, bw = Math.max(0.12 * W.w, 90 * LS(2)), s = LS(2);
        const a = clamp(e.t / 0.6, 0, 1) * clamp((e.dur - e.t) / 0.8, 0, 1);
        const top = Math.max(0, W.horizonY - 0.34 * W.h), bot = W.h;
        const pw = Math.max(2, Math.ceil(bw / 2)), ph = Math.max(2, Math.ceil((bot - top) / 2));
        if (!PB || PB.width !== pw || PB.height !== ph) { PB = cnv(pw, ph); PBg = PB.getContext('2d'); }
        const g = PBg;
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalCompositeOperation = 'source-over';
        g.clearRect(0, 0, pw, ph);
        const hz = g.createLinearGradient(0, 0, pw, 0);
        hz.addColorStop(0, 'rgba(206,220,255,0)'); hz.addColorStop(0.5, 'rgba(222,232,255,1)'); hz.addColorStop(1, 'rgba(206,220,255,0)');
        g.fillStyle = hz; g.fillRect(0, 0, pw, ph);
        g.globalCompositeOperation = 'destination-in';
        const vt = g.createLinearGradient(0, 0, 0, ph);
        vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.45, 'rgba(0,0,0,0.55)'); vt.addColorStop(0.8, 'rgba(0,0,0,1)'); vt.addColorStop(1, 'rgba(0,0,0,0.6)');
        g.fillStyle = vt; g.fillRect(0, 0, pw, ph);
        // 在有血的门前抬起
        g.globalCompositeOperation = 'destination-out';
        huts((id) => {
          const p = getP(id); if (!p || p.stain < 0.5) return;
          const D = hutDoor(p), lx = (D.x - (bx - bw / 2)) / 2, ly = (D.y - top) / 2;
          if (lx < -60 || lx > pw + 60) return;
          const r = 40 * D.s / 2;
          const gr = g.createRadialGradient(lx, ly, 0, lx, ly, r * 1.6);
          gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.6, 'rgba(0,0,0,0.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = gr; g.fillRect(lx - r * 1.6, ly - r * 3, r * 3.2, r * 3.2 + 4);
        });
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * 0.42;
        ctx.drawImage(PB, bx - bw / 2, top, bw, bot - top);
        // 风里的细线与微尘，向右急走
        ctx.strokeStyle = 'rgb(214,226,255)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 22; i++) {
          const px = bx - bw * 0.6 + U.fract(rt(i + 2400) + e.t * 0.5) * bw * 1.2;
          const xf = clamp(px / W.w, 0.3, 1), gy0 = gY(2, xf);
          const py = gy0 - rt(i + 2401) * 70 * s + Math.sin(e.t * 2 + i) * 3 * s + rt(i + 2403) * (W.h - gy0) * 0.6;
          const L = (10 + 16 * rt(i + 2402)) * s;
          ctx.moveTo(px, py); ctx.lineTo(px + L, py - L * 0.05);
        }
        ctx.globalAlpha = a * 0.4;
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  function hutDoorX(hx) { const p = getP('hut' + (X.huts.indexOf(hx) + 1)); return p ? hutDoor(p).x / W.w : hx; }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function drawKind(ctx, p) {
    switch (p.kind) {
      case 'palm': drawPalm(ctx, p); break;
      case 'pyramid': drawPyramid(ctx, p); break;
      case 'palace': drawPalace(ctx, p); break;
      case 'throne': drawThrone(ctx, p); break;
      case 'house': drawHouse(ctx, p); break;
      case 'hut': drawHut(ctx, p); break;
      case 'field': drawField(ctx, p); break;
      case 'bricks': drawBricks(ctx, p); break;
      case 'straw': drawStraw(ctx, p); break;
      case 'kiln': drawKiln(ctx, p); break;
    }
  }
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  const HGT = { palm: 44, pyramid: 30, palace: 30, throne: 18, house: 20, hut: 14, field: -8, bricks: 4, straw: 8, kiln: 12 };
  let nextBolt = 0;
  const SCENE = {
    init() { sprites(); },
    resize() {
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
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 雹与火：闪电只打在埃及（纯装饰；重演时不打）
      if (W.lv.plHail > 0.5 && W.lt.plHail > 0.5 && !W.replaying && !W.reduced && GS.weather && GS.weather.bolt) {
        if (W.t > nextBolt) {
          nextBolt = W.t + (1.1 + 2.4 * Math.random()) / Math.max(0.5, W.fast || 1);
          U.safe('pl.bolt', () => GS.weather.bolt({ x: 0.04 + 0.7 * Math.random(), near: Math.random() < 0.35 }));
        }
      } else nextBolt = Math.max(nextBolt, W.t + 0.6);
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawSkyHaze(ctx); drawNameHalo(ctx); return; }
      if (pass === 'seaFar') { drawShineSky(ctx); return; }
      const l = LAYER_OF_PASS[pass];
      if (l != null) {
        drawDesert(ctx, l);
        if (l === 2) { drawGoshen(ctx); drawNile(ctx); drawEShadeGround(ctx); }
        const list = sortProps(), dimK = 0.4 * W.lv.plShade;
        for (const p of list) {
          if (p.layer !== l || p.a < 0.005) continue;
          DIM = dimK > 0.004 && l === 2 && p.x < X.wall - 0.005 ? dimK : 0;
          drawKind(ctx, p);
        }
        DIM = 0;
        if (l === 1) drawHost(ctx);
        if (l === 2) { drawPools(ctx); drawLocustGround(ctx); }
        return;
      }
      if (pass === 'air') {
        drawStormDim(ctx);
        drawShine(ctx);
        drawHail(ctx);
        drawWall(ctx);
        drawAsh(ctx);
        drawLice(ctx);
        drawFlies(ctx);
        drawLocusts(ctx);
        drawFX(ctx);
        return;
      }
      if (pass === 'top') drawDark(ctx);
    },
    draw(ctx, pass) {
      // 青蛙与蛇：在走兽之后、人之前画
      if (!isCur() || pass !== 'near') return;
      drawFrogs(ctx);
      for (const e of FXL) if (e.type === 'serpents') drawSerpents(ctx, e);
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
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const dark = W.lv.plDark > 0.5;        // 黑暗的三天里：只有歌珊看得见
      for (const p of P.values()) {
        if (!p.label || p.a < 0.4 || (dark && p.x < X.wall)) continue;
        const s = LS(p.layer) * (p.size || 1), px = p.x * W.w, gy = gY(p.layer, p.x);
        const py = gy - (HGT[p.kind] || 10) * s;
        consider(p.label, px, py - 10 * s);
      }
      if (dark) return best;
      const q = nilePt(0.55);
      consider(W.lv.plBlood > 0.5 ? '变作血的河' : '尼罗河', q[0], q[1] - 12);
      if (W.lv.plHeap > 0.5 && W.lv.plFrogGone < 0.5) HEAPS.forEach(h => consider('青蛙堆', h[0] * W.w, fieldY(h[0], h[1]) - 8));
      if (W.lv.plHost > 0.5) { const hs = hostSpan(), hx = (hs[2] + 1) / 2; consider('以色列人', hx * W.w, gY(1, hx) - 16 * LS(1)); }
      return best;
    },
    sig() {
      const props = {};
      for (const p of Array.from(P.values()).filter(p => !p.dying).sort((a, b) => (a.id < b.id ? -1 : 1))) {
        props[p.id] = [p.ta, p.tlit, p.tout, p.tstain, p.tfire, p.tgrow].map(v => Math.round(v * 100) / 100).join(',');
      }
      return { S: Object.assign({}, S), props };
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：兰塞的早晨——砖场上做工的以色列人，法老坐在宫前
  // ════════════════════════════════════════════════════════════
  const PALMS = [
    ['palmN1', 0.452, 2, 0.95, 1], ['palmN3', 0.625, 2, 1.0, 1], ['palmN4', 0.815, 2, 0.85, -1],
    ['palmM1', 0.508, 1, 1.35, 1], ['palmM2', 0.527, 1, 1.1, -1], ['palmM3', 0.662, 1, 1.2, 1], ['palmM4', 0.7, 1, 1.0, -1], ['palmM5', 0.752, 1, 1.15, 1],
  ];
  const HUT_FLIP = [-1, -1, -1];                           // 三家的门都朝西（朝着埃及，朝着那夜走过来的）
  const doorX = i => X.huts[i] + HUT_FLIP[i] * 0.021;     // 父亲站在门旁（屋角）
  const lambX = i => X.huts[i] + HUT_FLIP[i] * 0.011;
  // 以色列人各家的人：七个做工的人（前三个是三家的父亲）、妇人、孩子
  const HEB_SEX = { h1: 'm', h2: 'm', h3: 'm', h4: 'm', h5: 'm', h6: 'm', h7: 'm' };
  const HEB_AGE = { h1: 'adult', h2: 'adult', h3: 'adult', h4: 'elder', h5: 'adult', h6: 'adult', h7: 'elder' };
  const HEB_V = { h1: 0.04, h2: 0.07, h3: 0.05, h4: 0.3, h5: 0.24, h6: 0.34, h7: 0.18 };
  const BRICK_POSE = { h1: 'bow', h2: 'carry', h3: 'kneel', h4: 'bow', h5: 'carry', h6: 'bow', h7: 'kneel' };
  const HOME_O = {
    w1: { sex: 'f', age: 'adult', x: 0.86, v: 0.22, robe: ROBE.woman[0] }, w2: { sex: 'f', age: 'adult', x: 0.913, v: 0.16, robe: ROBE.woman[1] },
    c1: { sex: 'm', age: 'child', x: 0.923, v: 0.36, robe: [176, 150, 116] }, c2: { sex: 'f', age: 'child', x: 0.966, v: 0.3, robe: [164, 128, 138] },
  };
  const EGY_X = [0.628, 0.671, 0.717, 0.756];
  const ISR = () => HEB.concat(HOME);
  const brickX = i => 0.753 + i * 0.0085;
  // 出埃及的行列（前 → 后）
  const COLUMN = ['h5', 'w1', 'h1', 'c2', 'h3', 'h6', 'h4', 'h7', 'w2', 'h2', 'c1'];
  const FRONT = COLUMN.slice(0, 8);

  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); }
  function addHeb(id, x, o) {
    o = o || {};
    add(id, Object.assign({ label: id === 'h2' ? '父亲' : '以色列人', sex: HEB_SEX[id], age: HEB_AGE[id], x, facing: rt(hashStr(id)) < 0.5 ? 1 : -1,
      robe: ROBE.heb[HEB.indexOf(id) % ROBE.heb.length], glow: 0.12, v: HEB_V[id], from: 'none' }, o));
  }
  function addHome(id, o) {
    const q = HOME_O[id];
    add(id, Object.assign({ label: id === 'c1' ? '儿子' : '以色列人', sex: q.sex, age: q.age, x: q.x, facing: q.x < 0.9 ? 1 : -1, robe: q.robe, glow: 0.12, v: q.v, from: 'none' }, o || {}));
  }
  function addEgy(i, o) {
    const id = EGY[i];
    add(id, Object.assign({ label: '埃及人', sex: i === 2 ? 'f' : 'm', age: i === 3 ? 'elder' : 'adult', x: EGY_X[i], facing: i % 2 ? -1 : 1,
      robe: ROBE.egy[i], accent: [196, 164, 96], hair: i === 2 ? 'veil' : 'short', glow: 0.06, v: [0.12, 0.26, 0.08, 0.3][i], from: 'none' }, o || {}));
  }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.25, land: 1, grass: 0.4, herbs: 0.06, trees: 0.2, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      bare: 0.5, bloom: 0, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0,
      plBlood: 0, plFrog: 0, plFrogDie: 0, plHeap: 0, plFrogGone: 0, plLice: 0, plFly: 0, plWall: 0, plAsh: 0, plHail: 0, plShine: 0,
      plCrop: 1, plLocust: 0, plLocX: -1, plStrip: 0, plDark: 0, plName: 0, plHost: 0, plShade: 0 };
    for (const k in lv) if (W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.33, 0, true);
    const lx = W.w * 0.9, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 24, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 12, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    // 布景
    prop('pyr1', 'pyramid', { x: 0.556, layer: 1, size: 1.25, label: '金字塔' });
    prop('pyr2', 'pyramid', { x: 0.594, layer: 1, size: 0.92, label: '金字塔' });
    prop('pyr3', 'pyramid', { x: 0.62, layer: 1, size: 0.6, label: '金字塔' });
    for (const q of PALMS) prop(q[0], 'palm', { x: q[1], layer: q[2], size: q[3], flip: q[4], label: '棕树' });
    prop('palace', 'palace', { x: X.palace, size: 1.7, label: '法老的宫' });
    prop('throne', 'throne', { x: X.throne, size: 1.15, label: '法老的宝座' });
    prop('field1', 'field', { x: X.field1, variant: 'barley', size: 0.95, label: '大麦田' });
    prop('field2', 'field', { x: X.field2, variant: 'flax', size: 0.95, label: '麻田' });
    X.houses.forEach((x, i) => prop('house' + (i + 1), 'house', { x, flip: i % 2 ? -1 : 1, size: 1.3, label: '埃及人的房屋' }));
    prop('straw', 'straw', { x: X.straw, label: '草' });
    prop('bricks', 'bricks', { x: X.bricks, label: '砖' });
    prop('kiln', 'kiln', { x: X.kiln, label: '窑' });
    X.huts.forEach((x, i) => prop('hut' + (i + 1), 'hut', { x, flip: HUT_FLIP[i], size: 1.6, label: '以色列人的屋' }));
    // 人物
    const c = C();
    c.clear({ fade: false });
    add('pharaoh', { label: '法老', sex: 'm', age: 'adult', x: X.throne, facing: 1, pose: 'seat', robe: ROBE.pharaoh, accent: GOLD, hair: 'cloth', glow: 0.1, from: 'none' });
    MAGS.forEach((id, i) => add(id, { label: '术士', sex: 'm', age: i === 1 ? 'elder' : 'adult', x: X.mag[i], facing: 1, robe: ROBE.mag[i], accent: [196, 160, 92], hair: 'cloth', prop: 'staff', glow: 0.04, v: [0.16, 0.04][i], from: 'none' }));
    add('t1', { label: '督工的', sex: 'm', age: 'adult', x: 0.747, facing: 1, robe: ROBE.task[0], accent: [120, 60, 50], hair: 'short', prop: 'staff', glow: 0.04, v: 0.06, from: 'none' });
    add('t2', { label: '督工的', sex: 'm', age: 'adult', x: 0.81, facing: -1, robe: ROBE.task[1], accent: [120, 60, 50], hair: 'short', prop: 'staff', glow: 0.04, v: 0.22, from: 'none' });
    HEB.forEach((id, i) => addHeb(id, brickX(i), { pose: BRICK_POSE[id], prop: BRICK_POSE[id] === 'carry' ? 'bundle' : null }));
    HOME.forEach(id => addHome(id, { pose: id === 'w1' ? 'sit' : 'stand' }));
    EGY.forEach((id, i) => addEgy(i));
    add('moses', { label: '摩西', sex: 'm', age: 'elder', x: 0.866, facing: -1, robe: ROBE.moses, accent: [210, 200, 180], prop: 'staff', glow: 0.45, v: 0.04, from: 'none' });
    add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: 0.879, facing: -1, robe: ROBE.aaron, accent: [226, 206, 160], prop: 'staff', glow: 0.32, v: 0.1, from: 'none' });
    // 牲畜：埃及人的牛在田间，骆驼与驴在房屋旁；以色列人的羊群在歌珊
    // 牛在田旁（不在田上）
    ECOWS.forEach((id, i) => animal(id, 'cow', 0.662 + i * 0.024, { v: [0.66, 0.8, 0.7][i], facing: i % 2 ? -1 : 1, pose: 'graze', scale: 0.72, label: '埃及的牲畜', from: 'none' }));
    animal('edonkey', 'donkey', 0.74, { v: 0.74, facing: 1, pose: 'graze', scale: 0.72, label: '驴', from: 'none' });
    ISHEEP.forEach((id, i) => animal(id, 'sheep', 0.846 + i * 0.028, { v: [0.66, 0.82, 0.7, 0.86, 0.74][i], facing: i % 2 ? 1 : -1, pose: 'graze', scale: 0.72, label: '以色列人的羊群', from: 'none' }));
    avoid([0.46, 0.99]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行（约半分钟），故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '以色列人住在埃及共有四百三十年。', ref: '出埃及记 12:40', hold: 5 },
  ];
  const V1 = [
    { text: '后来摩西、亚伦去对法老说：「耶和华以色列的神这样说：<br>『容我的百姓去，在旷野向我守节。』」', ref: '出埃及记 5:1', hold: 6.5 },
    { text: '法老说：「耶和华是谁，使我听他的话，容以色列人去呢？<br>我不认识耶和华，也不容以色列人去！」', ref: '出埃及记 5:2', hold: 6.5 },
    { text: '当天，法老吩咐督工的和官长说：<br>「你们不可照常把草给百姓做砖，叫他们自己去捡草。」', ref: '出埃及记 5:6–7', hold: 6.5 },
    { text: '于是百姓散在埃及遍地，捡碎秸当作草。', ref: '出埃及记 5:12', hold: 5 },
  ];
  const V2 = [
    { text: '摩西回到耶和华那里，说：「主啊，你为什么苦待这百姓呢？为什么打发我去呢？」', ref: '出埃及记 5:22', hold: 5.5 },
    { text: '神晓谕摩西说：「我是耶和华。我从前向亚伯拉罕、以撒、雅各显现为全能的神；<br>至于我名耶和华，他们未曾知道。」', ref: '出埃及记 6:2–3', hold: 7 },
    { text: '「……我是耶和华；我要用伸出来的膀臂重重地刑罚埃及人，<br>救赎你们脱离他们的重担，不做他们的苦工。」', ref: '出埃及记 6:6', hold: 6.5 },
    { text: '摩西将这话告诉以色列人，只是他们因苦工愁烦，不肯听他的话。', ref: '出埃及记 6:9', hold: 5 },
  ];
  const V3 = [
    { text: '耶和华对摩西说：「我使你在法老面前代替神，你的哥哥亚伦是替你说话的。」', ref: '出埃及记 7:1', hold: 6 },
    { text: '摩西、亚伦进去见法老，就照耶和华所吩咐的行。<br>亚伦把杖丢在法老和臣仆面前，杖就变作蛇。', ref: '出埃及记 7:10', hold: 6.5 },
    { text: '于是法老召了博士和术士来……他们各人丢下自己的杖，杖就变作蛇；<br>但亚伦的杖吞了他们的杖。', ref: '出埃及记 7:11–12', hold: 8 },
    { text: '法老心里刚硬，不肯听从摩西、亚伦，正如耶和华所说的。', ref: '出埃及记 7:13', hold: 5 },
  ];
  const V4 = [
    { text: '「明日早晨，他出来往水边去，你要往河边迎接他，手里要拿着那变过蛇的杖。」', ref: '出埃及记 7:15', hold: 5.5 },
    { text: '摩西、亚伦就照耶和华所吩咐的行。亚伦在法老和臣仆眼前举杖击打河里的水，<br>河里的水都变作血了。', ref: '出埃及记 7:20', hold: 7 },
    { text: '河里的鱼死了，河也腥臭了，埃及人就不能吃这河里的水；埃及遍地都有了血。', ref: '出埃及记 7:21', hold: 6.5 },
    { text: '埃及人都在河的两边挖地，要得水喝，因为他们不能喝这河里的水。', ref: '出埃及记 7:24', hold: 5.5 },
  ];
  const V5 = [
    { text: '亚伦便伸杖在埃及的诸水以上，青蛙就上来，遮满了埃及地。', ref: '出埃及记 8:6', hold: 5.5 },
    { text: '耶和华就照摩西的话行。凡在房里、院中、田间的青蛙都死了。<br>众人把青蛙聚拢成堆，遍地就都腥臭。', ref: '出埃及记 8:13–14', hold: 6.5 },
    { text: '亚伦伸杖击打地上的尘土，就在人身上和牲畜身上有了虱子；<br>埃及遍地的尘土都变成虱子了。', ref: '出埃及记 8:17', hold: 6.5 },
    { text: '行法术的就对法老说：「这是神的手段。」<br>法老心里刚硬，不肯听摩西、亚伦，正如耶和华所说的。', ref: '出埃及记 8:19', hold: 6 },
  ];
  const V6 = [
    { text: '耶和华就这样行。苍蝇成了大群，进入法老的宫殿，和他臣仆的房屋；<br>埃及遍地就因这成群的苍蝇败坏了。', ref: '出埃及记 8:24', hold: 7 },
    { text: '法老召了摩西、亚伦来，说：「你们去，在这地祭祀你们的神吧！」', ref: '出埃及记 8:25', hold: 5.5 },
    { text: '耶和华就照摩西的话行，叫成群的苍蝇离开法老和他的臣仆并他的百姓，一个也没有留下。', ref: '出埃及记 8:31', hold: 6.5 },
    { text: '这一次法老又硬着心，不容百姓去。', ref: '出埃及记 8:32', hold: 5 },
  ];
  const V7 = [
    { text: '第二天，耶和华就行这事。埃及的牲畜几乎都死了，<br>只是以色列人的牲畜，一个都没有死。', ref: '出埃及记 9:6', hold: 6.5 },
    { text: '法老打发人去看，谁知以色列人的牲畜连一个都没有死。<br>法老的心却是固执，不容百姓去。', ref: '出埃及记 9:7', hold: 6 },
    { text: '摩西、亚伦取了炉灰，站在法老面前。摩西向天扬起来，<br>就在人身上和牲畜身上成了起泡的疮。', ref: '出埃及记 9:10', hold: 6.5 },
    { text: '行法术的在摩西面前站立不住，因为在他们身上和一切埃及人身上都有这疮。', ref: '出埃及记 9:11', hold: 5.5 },
  ];
  const V8 = [
    { text: '摩西向天伸杖，耶和华就打雷下雹，有火闪到地上；耶和华下雹在埃及地上。', ref: '出埃及记 9:23', hold: 6.5 },
    { text: '那时，雹与火搀杂，甚是厉害，自从埃及成国以来，遍地没有这样的。', ref: '出埃及记 9:24', hold: 6 },
    { text: '在埃及遍地，雹击打了田间所有的人和牲畜，并一切的菜蔬，又打坏田间一切的树木。<br>惟独以色列人所住的歌珊地没有冰雹。', ref: '出埃及记 9:25–26', hold: 7 },
    { text: '摩西离了法老出城，向耶和华举手祷告；雷和雹就止住，雨也不再浇在地上了。', ref: '出埃及记 9:33', hold: 6 },
  ];
  const V9 = [
    { text: '摩西就向埃及地伸杖，那一昼一夜，耶和华使东风刮在埃及地上；<br>到了早晨，东风把蝗虫刮了来。', ref: '出埃及记 10:13', hold: 6.5 },
    { text: '因为这蝗虫遮满地面，甚至地都黑暗了……埃及遍地，无论是树木，是田间的菜蔬，<br>连一点青的也没有留下。', ref: '出埃及记 10:15', hold: 7 },
    { text: '于是法老急忙召了摩西、亚伦来，说：「我得罪耶和华你们的神，又得罪了你们。」', ref: '出埃及记 10:16', hold: 5.5 },
    { text: '耶和华转了极大的西风，把蝗虫刮起，吹入红海；在埃及的四境连一个也没有留下。', ref: '出埃及记 10:19', hold: 6.5 },
  ];
  const V10 = [
    { text: '摩西向天伸杖，埃及遍地就乌黑了三天。', ref: '出埃及记 10:22', hold: 5 },
    { text: '三天之久，人不能相见，谁也不敢起来离开本处；<br>惟有以色列人家中都有亮光。', ref: '出埃及记 10:23', hold: 8 },
    { text: '法老对摩西说：「你离开我去吧，你要小心，不要再见我的面！<br>因为你见我面的那日你就必死！」', ref: '出埃及记 10:28', hold: 6.5 },
    { text: '摩西说：「你说得好！我必不再见你的面了。」', ref: '出埃及记 10:29', hold: 5 },
  ];
  const V11 = [
    { text: '「你们吩咐以色列全会众说：本月初十日，各人要按着父家取羊羔，一家一只。」', ref: '出埃及记 12:3', hold: 6 },
    { text: '「各家要取点血，涂在吃羊羔的房屋左右的门框上和门楣上。<br>当夜要吃羊羔的肉；用火烤了，与无酵饼和苦菜同吃。」', ref: '出埃及记 12:7–8', hold: 7.5 },
    { text: '「你们吃羊羔当腰间束带，脚上穿鞋，手中拿杖，赶紧地吃；这是耶和华的逾越节。」', ref: '出埃及记 12:11', hold: 6.5 },
    { text: '耶和华怎样吩咐摩西、亚伦，以色列人就怎样行。', ref: '出埃及记 12:28', hold: 5 },
  ];
  const V12 = [
    { text: '摩西说：「耶和华这样说：『约到半夜，我必出去巡行埃及遍地。』」', ref: '出埃及记 11:4', hold: 5 },
    { text: '到了半夜，耶和华把埃及地所有的长子，就是从坐宝座的法老，直到被掳囚在监里之人的长子，<br>以及一切头生的牲畜，尽都杀了。', ref: '出埃及记 12:29', hold: 7.5 },
    { text: '法老和一切臣仆，并埃及众人，夜间都起来了。<br>在埃及有大哀号，无一家不死一个人的。', ref: '出埃及记 12:30', hold: 6.5 },
    { text: '夜间，法老召了摩西、亚伦来，说：「起来！连你们带以色列人，从我民中出去，<br>依你们所说的，去事奉耶和华吧！」', ref: '出埃及记 12:31', hold: 6.5 },
  ];
  const V13 = [
    { text: '百姓就拿着没有酵的生面，把抟面盆包在衣服中，扛在肩头上。', ref: '出埃及记 12:34', hold: 5.5 },
    { text: '以色列人从兰塞起行，往疏割去；除了妇人孩子，步行的男人约有六十万。<br>又有许多闲杂人，并有羊群牛群，和他们一同上去。', ref: '出埃及记 12:37–38', hold: 7.5 },
    { text: '正满了四百三十年的那一天，耶和华的军队都从埃及地出来了。', ref: '出埃及记 12:41', hold: 5.5 },
    { text: '这夜是耶和华的夜；因耶和华领他们出了埃及地，所以当向耶和华谨守，<br>是以色列众人世世代代该谨守的。', ref: '出埃及记 12:42', hold: 7 },
  ];
  const V14 = [
    { text: '摩西对百姓说：「你们要记念从埃及为奴之家出来的这日，<br>因为耶和华用大能的手将你们从这地方领出来……」', ref: '出埃及记 13:3', hold: 6 },
    { text: '「当那日，你要告诉你的儿子说：『这是因耶和华在我出埃及的时候为我所行的事。』」', ref: '出埃及记 13:8', hold: 6 },
    { text: '「日后，你的儿子问你说：『这是什么意思？』你就说：<br>『耶和华用大能的手将我们从埃及为奴之家领出来。』」', ref: '出埃及记 13:14', hold: 6.5 },
    { text: '「这要在你手上作记号，在你额上作经文，因为耶和华用大能的手将我们从埃及领出来。」', ref: '出埃及记 13:16', hold: 6.5 },
  ];

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  function landLevels(b, o) { for (const k in o) if (!W.hasLevel || W.hasLevel(k)) W.set(k, o[k], b.instant); }
  function killFx(type) { for (let i = FXL.length - 1; i >= 0; i--) if (FXL[i].type === type) FXL.splice(i, 1); }
  // 以色列人回到砖场做工
  function toBricks(speed) {
    HEB.forEach((id, i) => {
      walk(id, brickX(i), { speed: (speed || 0.04) * (0.9 + 0.2 * rt(i + 70)), pose: BRICK_POSE[id] });
      hold(id, BRICK_POSE[id] === 'carry' ? 'bundle' : null);
    });
  }
  // 四家：各家的人（逾越节的夜里各进自己的屋）
  const FAMILY = [['h1', 'w1', 'h4'], ['h2', 'w2', 'c1', 'h5'], ['h3', 'c2', 'h6', 'h7']];
  const famOf = id => FAMILY.findIndex(f => f.includes(id));
  // 各人在自家屋旁的位置：父亲在门旁（屋角）；其余的人在屋前门的另一边（离门至少 0.02，不挡住门与火）
  const HOME_AT = { h1: null, w1: 0.86, h4: 0.871, h2: null, w2: 0.913, c1: 0.923, h5: 0.934, h3: null, c2: 0.966, h6: 0.977, h7: 0.988 };
  // 黑暗的三天里：各家坐在自己的门旁（一家三四个人，相隔约 0.012）
  const SIT_AT = { h1: 0.83, w1: 0.852, h4: 0.864, h2: 0.884, w2: 0.906, c1: 0.916, h5: 0.927, h3: 0.938, c2: 0.96, h6: 0.971, h7: 0.982 };
  function homeSpot(id) {
    const i = famOf(id);
    return HOME_AT[id] == null ? doorX(i) : HOME_AT[id];
  }
  const huts = fn => X.huts.forEach((x, i) => fn('hut' + (i + 1), i));

  // ════════════════════════════════════════════════════════════
  //  话语与情节
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 容我的百姓去（5:1–21）──────────────────────────
    {
      kind: 'cmd', utter: '容我的百姓去', cmd: 'release --people 以色列 --to 旷野  # 法老：我不认识耶和华', ref: '5:1',
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => {
            W.goTo(0.4, 12, b.instant);
            walk('moses', X.mosesP, { speed: 0.046 }); walk('aaron', X.aaronP, { speed: 0.046 });
            pose('pharaoh', 'seat');
            avoid([0.46, 0.99]);
          }],
          [L[1] - 0.8, () => pose('aaron', 'raise')],
          [L[1] + 1.2, b => { pose('aaron', 'stand'); pose('pharaoh', 'point'); pose('mag2', 'point'); sfx(b, 'crowd', { soft: true, x: X.throne }); }],
          [L[1] + 5, () => { pose('pharaoh', 'seat'); pose('mag2', 'stand'); }],
          [L[2], () => { walk('t1', X.straw + 0.008, { speed: 0.03, pose: 'point' }); face('t2', -1); pose('t2', 'point'); }],
          [L[2] + 3, () => unprop('straw')],
          [L[3] - 0.5, () => {
            holdAll(HEB, null);
            spread(HEB, 0.62, 0.985, { speed: 0.034, pose: 'bow', seed: 3, jit: 0.01 });
            pose('t1', 'stand'); pose('t2', 'stand');
            walk('moses', 0.722, { speed: 0.035 }); walk('aaron', 0.708, { speed: 0.035 });
          }],
          [L[3] + 3, () => { walk('t1', 0.69, { speed: 0.03, pose: 'point' }); walk('t2', 0.862, { speed: 0.03, pose: 'point' }); }],
        ]);
      },
    },

    // ── 2 · 我是耶和华（5:22—6:30）──────────────────────────
    //    暮色里摩西跪下；名在天上聚成（微尘自做苦工的人中升起——6:5 我也听见以色列人的哀声）；
    //    伸出来的膀臂：一道自名而出、越过全地、伸到法老宫上的光
    {
      kind: 'name', utter: '我是耶和华', cmd: 'whoami  # 耶和华', ref: '6:2', tint: [255, 232, 180],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.765, 14, b.instant);
            walk('moses', 0.79, { speed: 0.03, pose: 'pray' });
            face('aaron', 1);
            pose('t1', 'stand'); pose('t2', 'stand');
          }],
          [L[1] - 0.4, b => {
            W.set('plName', 1, b.instant);
            if (!b.instant) {
              const [x, y] = NAME_AT(), size = (port() ? 0.1 : 0.088) * M();
              const src = () => { const id = HEB[(Math.random() * HEB.length) | 0], p = figPt(id, 0.6) || [W.w * 0.8, W.h * 0.85]; return [p[0] + rand(-20, 20) * SU(), p[1] + rand(-10, 10) * SU()]; };
              fx().nameStr('耶和华', x, y, size, [255, 226, 160], src, { hold: 5 });
              const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime('耶'));
              W.flash = Math.max(W.flash || 0, 0.1);
            }
            beam(b, 0.79, { dur: 9, w: 56, r: 0.18 });
            sfx(b, 'angel');
            glow('moses', 0.8);
          }],
          [L[2] + 0.6, b => { fxAdd(b, { type: 'arm', dur: 7.5 }); sfx(b, 'harp', { low: true }); }],
          [L[2] + 5.5, b => { W.set('plName', 0, b.instant); glow('moses', 0.45); }],
          [L[3] - 0.6, () => walk('moses', 0.742, { speed: 0.03, pose: 'raise' })],
          [L[3] + 1.4, () => poseAll(HEB, 'weep')],
          [L[3] + 4.4, () => pose('moses', 'stand')],
        ]);
      },
    },

    // ── 3 · 杖变作蛇（7:1–13）───────────────────────────────
    {
      kind: 'cmd', utter: '把杖丢在法老面前，使杖变作蛇', cmd: 'cast 杖 --as 蛇 && 蛇.swallow(术士.杖)', ref: '7:9',
      verse: V3,
      apply(c) {
        const L = starts(V3);
        const t0 = L[1] + 0.6, tm = L[2] + 0.8 - t0, ts = tm + 3, te = ts + NSNAKE * 1.8;
        T(c, [
          [0, b => {
            W.goTo(0.42, 12, b.instant);
            toBricks(0.04);
            walk('moses', X.mosesP, { speed: 0.04 }); walk('aaron', X.aaronP, { speed: 0.04 });
            walk('t1', 0.74, { speed: 0.03 }); walk('t2', 0.806, { speed: 0.03 });
            face('t1', 1); face('t2', -1);
            pose('pharaoh', 'seat');
          }],
          [L[1], () => pose('aaron', 'point')],
          [t0, b => { hold('aaron', null); S.staffA = 0; fxAdd(b, { type: 'serpents', dur: te + 2.4, tm, ts, te }); sfx(b, 'wind', { soft: true }); }],
          [t0 + 1, () => pose('aaron', 'stand')],
          [L[2] - 0.2, () => poseAll(MAGS, 'raise')],
          [L[2] + 0.8, () => { holdAll(MAGS, null); poseAll(MAGS, 'stand'); }],
          [t0 + ts - 0.5, () => pose('pharaoh', 'stand')],
          ...SNAKE_M.map((xm, j) => [t0 + ts + j * 1.8 + 1.1, b => {
            pose(MAGS[NSNAKE - 1 - j], 'bow');           // 术士的蛇被吞了：那术士退缩
            if (!b.instant) {
              const y = fieldY(xm, SNAKE_V[j]);
              fx().ring(xm * W.w, y - 2 * LS(2), [230, 184, 104], M() * 0.06, 1.3, 2);
              fx().sparkle(xm * W.w, y - 4 * LS(2), 14, [255, 222, 150], 10 * LS(2), 'near');
            }
            sfx(b, 'chime', { soft: true, low: true });
          }]),
          [t0 + te + 1.5, b => { if (b.instant) killFx('serpents'); hold('aaron', 'staff'); S.staffA = 1; glint(b, 'aaron', null, 0.72); }],
          [L[3] + 1, () => { pose('pharaoh', 'seat'); poseAll(MAGS, 'stand'); }],
          [L[3] + 2.6, () => { walk('moses', 0.6, { speed: 0.03 }); walk('aaron', 0.588, { speed: 0.03 }); }],
        ]);
      },
    },

    // ── 4 · 河水变作血（7:14–25）────────────────────────────
    {
      kind: 'judge', utter: '叫水都变作血', cmd: 'map 河.水 → 血  # 埃及遍地都有了血', ref: '7:19', tint: [255, 150, 140],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.29, 10, b.instant);           // 明日早晨
            walk('pharaoh', 0.5, { speed: 0.012 });
            walk('mag1', 0.512, { speed: 0.012 }); walk('mag2', 0.522, { speed: 0.012 });
            faceAll(['pharaoh', 'mag1', 'mag2'], -1);
            walk('aaron', nileEast(0.1) + 0.004, { speed: 0.03 }); walk('moses', nileEast(0.04) + 0.012, { speed: 0.03 });
            faceAll(['aaron', 'moses'], -1);
          }],
          [L[1] - 1.2, () => pose('aaron', 'raise')],
          [L[1] + 0.3, b => {
            W.set('plBlood', 1, b.instant);
            if (!b.instant) { const q = nilePt(0.03); fx().ring(q[0], q[1], [210, 70, 70], M() * 0.16, 1.8, 2); }
            sfx(b, 'splash'); sfx(b, 'thunder', { far: true, soft: true });
          }],
          [L[1] + 3.2, () => { pose('aaron', 'stand'); }],
          [L[2] - 3, b => {
            // 河的两边挖地（7:24）：东岸是两个从城里来的，西岸（海边的沙地上）另有两个
            walk('e2', nileEast(0.26) + 0.012, { speed: 0.045 }); walk('e4', nileEast(0.3) + 0.026, { speed: 0.045 });
            DIGW.forEach((id, i) => add(id, { label: '埃及人', sex: 'm', age: 'adult', x: nileWest(DIGW_V[i]) - [0.014, 0.022][i], facing: 1, robe: ROBE.egy[3 + i],
              accent: [196, 164, 96], hair: 'short', glow: 0.06, v: DIGW_V[i], from: fromOf(b) }));
          }],
          [L[3], b => {
            poseAll(EGY.concat(DIGW), 'bow'); faceAll(DIGW, 1);
            if (!b.instant) EGY.concat(DIGW).forEach(id => { const p = figPt(id, 0); if (p) fx().dust(p[0], p[1], 10, [150, 120, 84], 8 * LS(2)); });
          }],
          [L[3] + 2, () => { walk('pharaoh', X.throne, { speed: 0.012, pose: 'seat' }); MAGS.forEach((id, i) => walk(id, X.mag[i], { speed: 0.015 })); }],
        ]);
      },
    },

    // ── 5 · 青蛙；虱子（8:1–19）─────────────────────────────
    {
      kind: 'judge', utter: '使青蛙到埃及地上来', cmd: 'spawn 青蛙 --from 河 --fill 埃及 && chmod 尘土 → 虱子', ref: '8:5',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.set('plBlood', 0, b.instant);          // 满了七天
            W.goTo(0.42, 8, b.instant);
            rmAll(DIGW);
            EGY.forEach((id, i) => walk(id, EGY_X[i], { speed: 0.04 }));
            pose('aaron', 'raise');
          }],
          [0.8, b => { W.set('plFrog', 1, b.instant); sfx(b, 'splash', { soft: true }); }],
          [4, () => pose('aaron', 'stand')],
          [L[1] + 1, b => { W.set('plFrogDie', 1, b.instant); pose('moses', 'pray'); }],
          [L[1] + 3.5, b => { W.set('plHeap', 1, b.instant); poseAll(EGY, 'bow'); }],
          [L[1] + 5.5, () => pose('moses', 'stand')],
          [L[2] - 0.6, () => { pose('aaron', 'bow'); poseAll(EGY, 'stand'); }],
          [L[2] + 0.6, b => {
            W.set('plLice', 1, b.instant);
            if (!b.instant) for (let i = 0; i < 9; i++) { const xf = 0.48 + i * 0.038; fx().dust(xf * W.w, gY(2, xf), 16, [150, 132, 110], 26 * LS(2), 'air'); }
            sfx(b, 'wind', { soft: true });
            poseAll(EGY, 'weep');
          }],
          [L[2] + 2.5, () => pose('aaron', 'stand')],
          [L[3] - 1.5, () => poseAll(MAGS, 'raise')],
          [L[3] + 0.6, () => { pose('mag1', 'bow'); walk('mag2', X.throne - 0.011, { speed: 0.02, pose: 'point' }); }],
          [L[3] + 4, () => pose('mag2', 'bow')],
        ]);
      },
    },

    // ── 6 · 成群的苍蝇；分别歌珊地（8:20–32）───────────────────
    {
      kind: 'promise', utter: '我必分别我百姓所住的歌珊地', cmd: 'firewall --allow 歌珊 --deny 苍蝇', ref: '8:22', tint: [255, 226, 170],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.set('plLice', 0, b.instant); W.set('plFrogGone', 1, b.instant);
            W.set('plWall', 1, b.instant);
            W.goTo(0.5, 8, b.instant);
            poseAll(EGY, 'stand'); poseAll(MAGS, 'stand');
            walk('mag2', X.mag[1], { speed: 0.02 });
            walk('moses', X.mosesP, { speed: 0.03 }); walk('aaron', X.aaronP, { speed: 0.03 });
            sfx(b, 'harp', { soft: true });
          }],
          [1.2, b => { W.set('plFly', 1, b.instant); sfx(b, 'wings'); }],
          [4, b => { sfx(b, 'wings', { soft: true }); poseAll(EGY, 'weep'); }],
          [L[1], () => pose('pharaoh', 'point')],
          [L[1] + 3.5, () => pose('pharaoh', 'seat')],
          [L[2] - 2.5, () => walk('moses', 0.61, { speed: 0.035, pose: 'pray' })],
          [L[2], b => { W.set('plFly', 0, b.instant); sfx(b, 'wind', { soft: true }); }],
          [L[2] + 3, () => poseAll(EGY, 'stand')],
          [L[3], () => pose('moses', 'stand')],
        ]);
      },
    },

    // ── 7 · 牲畜的瘟疫；起泡的疮（9:1–12）─────────────────────
    {
      kind: 'judge', utter: '明天耶和华必在此地行这事', cmd: 'schedule 明天 --here  # 以色列人的牲畜，一个都没有死', ref: '9:5',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.6, 8, b.instant);               // 第二天
            W.set('plWall', 1, b.instant);
            walk('moses', X.kiln - 0.015, { speed: 0.032 }); walk('aaron', X.kiln + 0.013, { speed: 0.032 });
          }],
          [2.2, b => { poseAll(ECOWS.concat(EBEASTS), 'lie'); sfx(b, 'cow', { soft: true, x: 0.58 }); }],
          [L[1] + 1.2, () => rmAll(ECOWS.concat(EBEASTS))],
          [L[1], () => { walk('e1', 0.795, { speed: 0.042 }); pose('pharaoh', 'point'); }],
          [L[1] + 1, () => { pose('moses', 'bow'); pose('aaron', 'bow'); }],
          [L[1] + 2.6, () => { walk('moses', X.mosesP, { speed: 0.045 }); walk('aaron', X.aaronP, { speed: 0.045 }); }],
          [L[1] + 4.6, () => { walk('e1', EGY_X[0], { speed: 0.042 }); pose('pharaoh', 'seat'); }],
          [L[2] + 1.2, b => {
            pose('moses', 'raise');
            if (!b.instant) {
              const p = figPt('moses', 1.05);
              if (p) for (let i = 0; i < 70; i++) fx().add({ x: p[0] + rand(-5, 5), y: p[1], vx: rand(-50, 50) * SU(), vy: rand(-280, -110) * SU(), max: rand(1.4, 2.8), size: rand(1, 2.6), c: [170, 164, 158], drag: 1.1, grav: 26, a: 0.85, pass: 'air' });
            }
            sfx(b, 'wind', { soft: true });
          }],
          [L[2] + 2.4, b => W.set('plAsh', 1, b.instant)],
          [L[2] + 4, () => { pose('moses', 'stand'); poseAll(EGY, 'weep'); }],
          [L[3], () => poseAll(MAGS, 'sit')],
          [L[3] + 1.5, () => pose('pharaoh', 'stand')],
        ]);
      },
    },

    // ── 8 · 雹与火（9:13–35）── 签名之一 ──────────────────────
    {
      kind: 'cmd', utter: '你向天伸杖', cmd: 'storm --hail --fire --exclude 歌珊', ref: '9:22', tint: [236, 238, 255],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.set('plAsh', 0, b.instant);
            W.goTo(0.46, 4.4, b.instant);            // 「明天约在这时候」：过了一夜，到了早晨
            W.set('clouds', 0.9, b.instant);
            poseAll(MAGS, 'stand'); pose('pharaoh', 'seat');
            EGY.forEach((id, i) => walk(id, EGY_X[i], { speed: 0.045 }));
            holdAll(HEB, null);
            HEB.forEach((id, i) => walk(id, lerp(0.832, 0.985, i / 8) + (rt(i + 60) - 0.5) * 0.008, { speed: 0.045 }));
            walk('t1', 0.676, { speed: 0.04 }); walk('t2', 0.716, { speed: 0.04 });
            walk('moses', 0.586, { speed: 0.035 }); walk('aaron', 0.573, { speed: 0.035 });
          }],
          [4.7, b => {
            pose('moses', 'raise');
            W.set('storm', 0.95, b.instant); W.set('gale', 0.45, b.instant); W.set('rain', 0.26, b.instant);
            W.weatherExclude = [[X.wall - 0.005, 1]];     // 惟独歌珊地没有冰雹（9:26）：雨也不下在那里
            W.set('plShine', 1, b.instant);
            sfx(b, 'thunder');
          }],
          [5.6, b => { W.set('plHail', 1, b.instant); if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.5, near: true }); sfx(b, 'rain'); }],
          [L[1] + 1, b => { W.set('plCrop', 0.35, b.instant); W.set('plStrip', 0.25, b.instant); poseAll(EGY, 'kneel'); poseAll(['t1', 't2'], 'kneel'); }],
          [L[2], () => { poseAll(HEB, 'gaze'); poseAll(HOME, 'gaze'); pose('pharaoh', 'stand'); }],
          [L[3] - 0.6, () => pose('moses', 'pray')],
          [L[3] + 0.8, b => {
            W.set('plHail', 0, b.instant); W.set('storm', 0, b.instant); W.set('rain', 0, b.instant); W.set('gale', 0.08, b.instant);
            W.set('plShine', 0, b.instant); W.set('clouds', 0.3, b.instant); W.set('plWall', 0, b.instant);
            W.weatherExclude = [];
          }],
          [L[3] + 4.5, () => {
            pose('moses', 'stand'); pose('pharaoh', 'seat');
            poseAll(EGY, 'stand'); poseAll(['t1', 't2'], 'stand'); poseAll(HEB, 'stand'); poseAll(HOME, 'stand');
          }],
        ]);
      },
    },

    // ── 9 · 蝗虫（10:1–20）──────────────────────────────────
    {
      kind: 'judge', utter: '使蝗虫到埃及地上来', cmd: 'wind --from 东 --for 一昼一夜 | spawn 蝗虫 ; wind --from 西 --into 红海', ref: '10:12',
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.3, 11, b.instant);             // 那一昼一夜，到了早晨
            W.set('gale', 0.75, b.instant);
            W.set('plLocust', 1, b.instant);
            face('moses', -1); pose('moses', 'point');
            sfx(b, 'wind');
          }],
          [3, () => pose('moses', 'stand')],
          [6.5, b => { W.set('plLocX', 0, b.instant); sfx(b, 'wind'); }],
          [L[1] + 0.5, b => {
            W.set('plStrip', 1, b.instant); W.set('plCrop', 0, b.instant);
            landLevels(b, { grass: 0.06, herbs: 0.02, trees: 0.08, bare: 0.95 });
            poseAll(EGY, 'weep');
          }],
          [L[2] - 1.5, () => { walk('moses', X.mosesP, { speed: 0.045 }); walk('aaron', X.aaronP, { speed: 0.045 }); }],
          [L[2] + 1, () => pose('pharaoh', 'stand')],
          [L[2] + 2.6, () => pose('pharaoh', 'bow')],
          [L[3], b => { W.set('plLocX', -1.9, b.instant); W.set('gale', 0.8, b.instant); pose('moses', 'pray'); sfx(b, 'wind'); }],
          [L[3] + 4, b => W.set('plLocust', 0, b.instant)],
          [L[3] + 6, b => { W.set('gale', 0.1, b.instant); pose('moses', 'stand'); pose('pharaoh', 'seat'); poseAll(EGY, 'stand'); }],
        ]);
      },
    },

    // ── 10 · 黑暗三天（10:21–29）── 签名之二 ──────────────────
    //    全地漆黑；惟有歌珊的屋里亮着；摩西身边一点光，照见法老——「不要再见我的面」
    {
      kind: 'judge', utter: '使埃及地黑暗；这黑暗似乎摸得着', cmd: 'set --lights 0 --except "以色列人家中"', ref: '10:21', tint: [214, 218, 255],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.45, 5, b.instant);             // 白日：黑暗临到有日头的天
            W.set('gale', 0, b.instant);
            // 各家回到自己的门旁坐下（10:23 谁也不敢起来离开本处——以色列人却在家中有亮光）
            ISR().forEach(id => walk(id, SIT_AT[id], { speed: 0.036, pose: 'sit' }));
          }],
          [0.8, b => { pose('moses', 'raise'); sfx(b, 'wind', { soft: true, low: true }); }],
          [1.6, b => { W.set('plDark', 1, b.instant); S.mosesLamp = 1; }],
          [3.6, () => pose('moses', 'stand')],
          [L[1], b => {
            huts(id => prop(id, null, { lit: 1 }));
            sfx(b, 'harp', { soft: true });
          }],
          [L[2], () => pose('pharaoh', 'stand')],
          [L[2] + 0.8, () => pose('pharaoh', 'point')],
          [L[3], () => { face('moses', 1); pose('pharaoh', 'stand'); }],
          [L[3] + 0.8, () => { walk('moses', 0.806, { speed: 0.045 }); walk('aaron', 0.794, { speed: 0.045 }); }],
          [L[3] + 2, () => pose('pharaoh', 'seat')],
        ]);
      },
    },

    // ── 11 · 逾越节（11:1—12:28）────────────────────────────
    {
      kind: 'promise', utter: '我一见这血，就越过你们去', cmd: 'mark 门楣 门框 --with 血  # passover', ref: '12:13', tint: [255, 176, 160],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.set('plDark', 0, b.instant); S.mosesLamp = 0;
            W.goTo(0.745, 12, b.instant);            // 黄昏的时候
            huts(id => prop(id, null, { lit: 0 }));
            ISR().forEach(id => walk(id, homeSpot(id), { speed: 0.03 }));
            FATHERS.forEach((id, i) => face(id, X.huts[i]));
            LAMBS.forEach((id, i) => animal(id, 'lamb', lambX(i), { v: 0.24, facing: HUT_FLIP[i], pose: 'stand', label: '羊羔', from: fromOf(b) }));
            sfx(b, 'bleat');
          }],
          ...[0, 1, 2].map(i => [L[1] + i * 1.6, b => { prop('hut' + (i + 1), null, { stain: 1 }); pose(FATHERS[i], 'raise'); if (!i) sfx(b, 'seal', { soft: true }); }]),
          ...[0, 1, 2].map(i => [L[1] + i * 1.6 + 2.8, () => pose(FATHERS[i], 'stand')]),
          [L[1] + 6, () => rmAll(LAMBS)],
          [L[2], b => {
            huts(id => prop(id, null, { fire: 1 }));
            holdAll(FATHERS, 'staff');
            W.goTo(0.88, 9, b.instant);
            sfx(b, 'fire', { soft: true });
          }],
          [L[3], () => { ISR().forEach(id => pose(id, 'bow')); pose('moses', 'bow'); pose('aaron', 'bow'); }],
          [L[3] + 3.5, () => { ISR().forEach(id => pose(id, 'stand')); pose('moses', 'stand'); pose('aaron', 'stand'); }],
        ]);
      },
    },

    // ── 12 · 半夜（11:4–8；12:29–33）──────────────────────────
    //    一阵苍白的风自左而右走过全地：埃及的灯一盏一盏地熄了；有血的门，它越过
    {
      kind: 'judge', utter: '那夜我要巡行埃及地', cmd: 'at 00:00 巡行 埃及地 --skip 有血的门', ref: '12:12', tint: [214, 222, 255],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        const outAt = x => L[1] + 0.3 + passT(x);
        T(c, [
          [0, b => {
            W.goTo(0.995, 7, b.instant);             // 半夜
            huts(id => prop(id, null, { fire: 0.25 }));
            ISR().forEach(id => walk(id, X.huts[famOf(id)] + HUT_FLIP[famOf(id)] * 0.004, { speed: 0.03 }));
            walk('pharaoh', X.palace, { speed: 0.02 });
            pose('moses', 'pray'); pose('aaron', 'kneel');
          }],
          [3.5, () => { rmAll(ISR()); rmAll(EGY); rmAll(MAGS); rmAll(['t1', 't2', 'pharaoh']); }],
          [L[1] + 0.3, b => { fxAdd(b, { type: 'pass', dur: PASS.dur }); sfx(b, 'wind', { low: true }); }],
          [outAt(X.palace), () => prop('palace', null, { out: 1 })],
          ...X.houses.map((x, i) => [outAt(x), () => prop('house' + (i + 1), null, { out: 1 })]),
          [L[2], b => {
            EGY.forEach((id, i) => addEgy(i, { pose: i === 1 ? 'fall' : 'weep', from: fromOf(b) }));
            add('pharaoh', { label: '法老', sex: 'm', age: 'adult', x: X.palace, facing: 1, pose: 'weep', robe: ROBE.pharaoh, accent: GOLD, hair: 'cloth', glow: 0.1, prop: 'torch', from: fromOf(b) });
            sfx(b, 'weep'); sfx(b, 'crowd', { soft: true });
          }],
          [L[3], () => { pose('pharaoh', 'raise'); walk('moses', X.palace + 0.024, { speed: 0.075 }); walk('aaron', X.palace + 0.037, { speed: 0.075 }); }],
          [L[3] + 4, () => pose('pharaoh', 'point')],
        ]);
      },
    },

    // ── 13 · 出埃及（12:34–51）───────────────────────────────
    {
      kind: 'promise', utter: '把你们的军队从埃及地领出来', cmd: 'git checkout -b 出埃及  # 正满了四百三十年', ref: '12:17', tint: [255, 236, 200],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.goTo(0.06, 18, b.instant);
            const f = fromOf(b);
            HEB.forEach(id => addHeb(id, homeSpot(id), { pose: 'carry', prop: FATHERS.includes(id) ? 'staff' : 'bundle', from: f }));
            HOME.forEach(id => addHome(id, { x: homeSpot(id), pose: 'stand', prop: id[0] === 'w' ? 'jar' : null, from: f }));
            pose('pharaoh', 'stand');
            faceAll(['moses', 'aaron'], 1);
          }],
          [2.5, b => {
            EGY.forEach((id, i) => walk(id, 0.772 + i * 0.008, { speed: 0.04, pose: 'stand' }));
          }],
          [5, b => { FATHERS.forEach((id, i) => mote(b, EGY[i], id, [255, 222, 150], 3.2, 10)); sfx(b, 'chime', { soft: true }); }],
          [L[1] - 0.5, b => {
            S.column = 1;
            // 大队：步行的男人约有六十万，又有许多闲杂人，并有羊群牛群（12:37–38）——中丘上一长行人与火把，自歌珊向东（左）而去
            W.set('plHost', 1, b.instant);
            spread(COLUMN, 0.645, 0.9, { speed: 0.0085, seed: 9 });
            walk('moses', 0.622, { speed: 0.012 }); walk('aaron', 0.634, { speed: 0.012 });
            ISHEEP.forEach((id, i) => walk(id, 0.87 + i * 0.02, { speed: 0.008, pose: 'walk' }));
            EGY.forEach((id, i) => walk(id, EGY_X[i], { speed: 0.03, pose: 'bow' }));
            sfx(b, 'bleat', { soft: true });
          }],
          [L[2] + 0.5, b => { fxAdd(b, { type: 'host', dur: 9, ids: ISR().concat(['moses', 'aaron']) }); sfx(b, 'harp'); }],
          [L[3], () => pose('pharaoh', 'weep')],
        ]);
      },
    },

    // ── 14 · 记念（13:1–16）── 全幕的末一句 ─────────────────────
    //    黎明：行列向着日出而行；一个母亲抱着头生的孩子；儿子问父亲「这是什么意思」
    {
      kind: 'cmd', utter: '要分别为圣归我', cmd: 'echo "这是什么意思？" >> 世世代代', ref: '13:2', tint: [255, 240, 214], hold: 2.6,
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            W.goTo(0.258, 14, b.instant);            // 黎明
            rmAll(EGY); rm('pharaoh');
            W.set('plShade', 1, b.instant);          // 为奴之家的城退入阴影
            spread(FRONT, 0.61, 0.76, { speed: 0.008, seed: 11 });
            walk('moses', 0.585, { speed: 0.008 }); walk('aaron', 0.597, { speed: 0.008 });
            ISHEEP.forEach((id, i) => walk(id, 0.83 + i * 0.02, { speed: 0.008, pose: 'walk' }));
            // 一家人停在砖场上——「为奴之家」——让行列从身边过去
            walk('w2', 0.772, { speed: 0.02 }); walk('h2', 0.79, { speed: 0.02 }); walk('c1', 0.8, { speed: 0.02 });
          }],
          [3.2, b => { carry('w2', 'baby'); pose('w2', 'raise'); beam(b, 0.772, { dur: 7, w: 44, r: 0.15 }); sfx(b, 'harp', { soft: true }); }],
          [8.2, () => pose('w2', 'stand')],
          [L[1], () => { face('c1', 'h2'); face('h2', 'c1'); pose('h2', 'point'); }],
          [L[2], b => { pose('c1', 'gaze'); pose('h2', 'raise'); glint(b, 'h2', null, 0.92); }],
          [L[3], b => { pose('c1', 'raise'); glint(b, 'h2', null, 0.66); face('moses', -1); pose('moses', 'raise'); }],
          [L[3] + 3.2, () => {
            // 行列起行：摩西在前，向东（左）、向着日出、向着海走去，直到落幕
            walk('moses', 0.49, { speed: 0.0062 }); walk('aaron', 0.502, { speed: 0.0062 });
            FRONT.forEach((id, i) => walk(id, 0.516 + i * 0.0125, { speed: 0.0062 * (0.95 + 0.1 * rt(i + 90)) }));
            ['w2', 'h2', 'c1'].forEach((id, i) => walk(id, 0.62 + i * 0.012, { speed: 0.0062 }));
            ISHEEP.forEach((id, i) => walk(id, 0.66 + i * 0.016, { speed: 0.0062, pose: 'walk' }));
          }],
        ]);
      },
    },
  ];

  // 全书终后，按住本幕的人与物，显出与它相关的经文
  const B = (text, ref) => ({ text, ref });
  const AGE = B('摩西、亚伦与法老说话的时候，摩西八十岁，亚伦八十三岁。', '出埃及记 7:7');
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '十灾', sub: '出埃及记 5 — 13:16', tint: [255, 190, 150], music: 'joseph',
    outro: 18,
    intro: INTRO,
    behold: {
      '摩西': AGE, '亚伦': AGE,
      '法老': B('法老打发人召摩西、亚伦来，对他们说：「这一次我犯了罪了。耶和华是公义的；我和我的百姓是邪恶的。」', '出埃及记 9:27'),
      '术士': B('行法术的就对法老说：「这是神的手段。」', '出埃及记 8:19'),
      '督工的': B('督工的催着说：「你们一天当完一天的工，与先前有草一样。」', '出埃及记 5:13'),
      '以色列人': B('「我要以你们为我的百姓，我也要作你们的神。」', '出埃及记 6:7'),
      '父亲': B('「日后，你的儿子问你说：『这是什么意思？』你就说：『耶和华用大能的手将我们从埃及为奴之家领出来。』」', '出埃及记 13:14'),
      '儿子': B('「你们的儿女问你们说：『行这礼是什么意思？』」', '出埃及记 12:26'),
      '埃及人': B('耶和华叫百姓在埃及人眼前蒙恩，以致埃及人给他们所要的。', '出埃及记 12:36'),
      '法老的宫': B('法老转身进宫，也不把这事放在心上。', '出埃及记 7:23'),
      '法老的宝座': B('到了半夜，耶和华把埃及地所有的长子，就是从坐宝座的法老，直到被掳囚在监里之人的长子，以及一切头生的牲畜，尽都杀了。', '出埃及记 12:29'),
      '以色列人的屋': B('「……他看见血在门楣上和左右的门框上，就必越过那门，不容灭命的进你们的房屋，击杀你们。」', '出埃及记 12:23'),
      '埃及人的房屋': B('「你的宫殿和你众臣仆的房屋，并一切埃及人的房屋，都要被蝗虫占满了……」', '出埃及记 10:6'),
      '砖': B('「现在你们去做工吧！草是不给你们的，砖却要如数交纳。」', '出埃及记 5:18'),
      '草': B('「你们不可照常把草给百姓做砖，叫他们自己去捡草。」', '出埃及记 5:7'),
      '窑': B('耶和华吩咐摩西、亚伦说：「你们取几捧炉灰，摩西要在法老面前向天扬起来。」', '出埃及记 9:8'),
      '尼罗河': B('「……我要用我手里的杖击打河中的水，水就变作血；因此，你必知道我是耶和华。」', '出埃及记 7:17'),
      '变作血的河': B('河里的鱼死了，河也腥臭了，埃及人就不能吃这河里的水；埃及遍地都有了血。', '出埃及记 7:21'),
      '青蛙堆': B('众人把青蛙聚拢成堆，遍地就都腥臭。', '出埃及记 8:14'),
      '大麦田': B('那时，麻和大麦被雹击打；因为大麦已经吐穗，麻也开了花。', '出埃及记 9:31'),
      '麻田': B('那时，麻和大麦被雹击打；因为大麦已经吐穗，麻也开了花。', '出埃及记 9:31'),
      '棕树': B('……埃及遍地，无论是树木，是田间的菜蔬，连一点青的也没有留下。', '出埃及记 10:15'),
      '金字塔': B('以色列人住在埃及共有四百三十年。', '出埃及记 12:40'),
      '以色列人的羊群': B('「我们的牲畜也要带去，连一蹄也不留下……」', '出埃及记 10:26'),
      '埃及的牲畜': B('第二天，耶和华就行这事。埃及的牲畜几乎都死了……', '出埃及记 9:6'),
      '驴': B('「耶和华的手加在你田间的牲畜上，就是在马、驴、骆驼、牛群、羊群上，必有重重的瘟疫。」', '出埃及记 9:3'),
      '羊羔': B('「要无残疾、一岁的公羊羔，你们或从绵羊里取，或从山羊里取，都可以。」', '出埃及记 12:5'),
    },
    setup, stages: STAGES, scene: SCENE,
  });

  // 测试用
  GS._plagues = { get S() { return S; }, P, X, FXL };
})(window.GS);
