/* ─────────────────────────────────────────────────────────────
 * book/ecclesiastes.js —— 传道书 · 虚空（传道书 1 — 12）
 *
 * 日光之下。右边中丘上是耶路撒冷（城墙、房屋、山顶上神的殿）；近岸是传道者的家：
 * 平顶的石屋、门廊下的石凳、廊梁上用银链挂着的一盏金罐灯、门前的磨；屋前有井，井上有水轮，井旁放着瓶子；
 * 一棵杏树，树下是先前世代的坟；再往东（左）是一块田，田的东头就是海。
 *   1:2     「虚空的虚空」——一口气息（虚空，原是"气"）化成薄雾，飘过全地；「虚空」二字由雾聚成又散去。
 *   1:4–7   签名之景：日头出来，日头落下——天上一道金色的日行之弧，昼夜飞转，夜里众星拖出长长的轨迹；
 *           风不住地旋转；江河顺着地往海里流，化作水汽升上天，又落回山上；一代过去（坟），一代又来（孩子）。
 *   1:9–2:24 王的大工程：葡萄园、果木园、水池一样一样立起，一阵风过，都化作雾气散去；传道者坐下吃饼——出于神的手。
 *   3:1–8   签名之景：凡事都有定期——一年的四季在田里、杏树上、人身上走过：
 *           生（怀中的婴孩）与死（老人躺下，杏树下多一座坟）、撒种与收割、哀哭与篝火旁的跳舞；
 *           秋叶、堆聚石头、相拥；冬雪、静默的夜；
 *   3:11    春天在黎明回来：杏花再开，田里又出青苗；一点金光落进每个人心里（永生安置在世人心里）。
 *   4:8–12  孤身一人背着重担跌倒，有人扶他起来，第三人也来——三股光拧成一根绳子。
 *   5:2–6:12 神在天上：一道光柱落在山顶的殿上，众人跪下，言语寡少；那人放下重担空手而去；云影掠过大地。
 *   7:13–8:17 一片带雨的云从海上移到地上：亨通的日子与患难的日子并列；夜里传道者提灯仰望众星，查不出来。
 *   9:7–10:12 清晨穿白衣吃饭喝酒；尽力做手所当做的；传道者教导孩子，恩言如金色的微光。
 *   11:1–7  少年人把粮食撒在水面，粮食漂进海上的光里；日子过去，粮食化作满海的金光回到他脚前。
 *   12:1–5  孩子在黎明记念造他的主；云彩反回，推磨的止息，窗户昏暗，门关上，杏树开花，吊丧的在街上往来。
 *   12:6–7  签名之景：银链折断，金罐破裂，瓶子在泉旁损坏，水轮在井口破烂；尘土归于地，一点光升上高天。
 *   12:8–14 日头又出来；众人向东跪下：敬畏神，谨守他的诫命。
 *
 * 规矩：本卷的一切状态都只在 setup / apply / 情节（beats）里设定——瞬间重演时得到同样的世界。
 *       布景只在本卷进行时绘制。画面的焦点都在右半边（左下是经文）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'ecclesiastes';
  const isCur = () => GS.book.current(ACT);
  const LV = W.lv;

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LEVELS = [
    ['ecMist', 'exp', 0.35],     // 虚空：薄雾般的气息
    ['ecArc', 'exp', 0.35],      // 日头的行程：天上的金弧，夜里众星的轨迹
    ['ecWind', 'exp', 0.45],     // 风不住地旋转
    ['ecCycle', 'exp', 0.4],     // 江河往海里流，仍归还何处
    ['ecSnow', 'exp', 0.26],     // 冬雪
    ['ecLeaf', 'exp', 0.4],      // 秋叶
    ['ecHeart', 'exp', 0.4],     // 永生安置在世人心里
    ['ecRope', 'exp', 0.45],     // 三股合成的绳子
    ['ecHeaven', 'exp', 0.4],    // 神在天上：光柱落在殿上
    ['ecShade', 'exp', 0.4],     // 如影儿经过：云影掠过大地
    ['ecCloud', 'lin', 0.16],    // 患难的日子：带雨的云（0 在海上 → 1 在地上）
    ['ecRainA', 'exp', 0.5],     // 那片云与它的雨
    ['ecLamp', 'exp', 0.6],      // 夜里寻查的灯
    ['ecBread', 'lin', 0.06],   // 粮食撒在水面：0 在手 → 0.5 漂进光里 → 1 归来
    ['ecSpirit', 'lin', 0.12],  // 灵仍归于赐灵的神：一点光升上高天
    ['ecGlory', 'exp', 0.35],    // 末了的金光
  ];
  LEVELS.forEach(l => W.defineLevel(l[0], l[1], l[2]));
  const MY = LEVELS.map(l => l[0]);

  // ── 地上的位置（画面宽度的比例）：左 = 东（海），右 = 西（耶路撒冷）──────
  const XD = { shore: 0.415, f0: 0.47, f1: 0.655, almond: 0.715, well: 0.79, bench: 0.853, city0: 0.745, city1: 1.02, temple: 0.885, palace: 0.8 };
  const XP = { shore: 0.395, f0: 0.44, f1: 0.575, almond: 0.625, well: 0.722, bench: 0.812, city0: 0.7, city1: 1.03, temple: 0.87, palace: 0.77 };
  const port = () => W.w < W.h * 0.9;
  const X = k => (port() ? XP : XD)[k];
  const fld = t => lerp(X('f0'), X('f1'), t);

  const ROBE = {
    preacher: [92, 72, 124], gA1: [120, 108, 96], gA2: [140, 116, 106], gB1: [126, 98, 72], gB2: [152, 110, 100],
    gC1: [112, 94, 76], gC2: [170, 110, 94], gD1: [88, 108, 136], gE1: [184, 150, 104], lone: [86, 74, 64], white: [236, 230, 216],
    mourn: [58, 54, 62],
  };
  const STONE = [206, 190, 160], STONE2 = [178, 160, 134], LIME = [226, 214, 186], WOOD = [104, 76, 52], CLAY = [184, 122, 78];
  const GOLD = [236, 186, 92], SILVER = [214, 222, 236];
  const CROWD_RB = [[132, 104, 78], [110, 86, 70], [150, 118, 90], [120, 100, 84], [140, 96, 80]];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）─────────
  let S = fresh();
  function fresh() { return { bowl: 'hang', bowlT0: -1e9, spX: 0.85, rope: null, graves: 0 }; }

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const LK = [1.1, 1.2, 1.3];
  const phone = () => W.w < 600;
  const hP = l => 34 * W.layerScale(l) * (phone() ? 1.4 : 1) * (LK[l] || 1);      // 这一层上一个人的身高（像素）
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => { const x = xf * W.w; const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x); return isFinite(y) ? y : W.ridgeY(l, x); };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g));
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], clamp(a, 0, 1));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const litSide = x => ((W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x) >= x ? 1 : -1);
  const rimA = () => clamp(0.2 + 0.5 * W.dusk + 0.3 * W.daylight, 0, 0.8);

  // 人物（皆经人物模块）
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function place(id, x) { if (has(id)) C().place(id, x); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id) { if (has(id)) C().remove(id); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function babe(id, what) { const c = C(); if (c.carry && has(id)) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function hands(a, b, on) { const c = C(); if (c.holdHands && has(a) && has(b)) U.safe('cast.holdHands', () => c.holdHands(a, b, on)); }
  function hug(a, b, o) { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid) { if (hasCrowd(gid)) C().removeCrowd(gid); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d;
      if (W.replaying) m.fd = m.facing;
    }
  }
  const men = (pal, age) => (m, i) => { m.sex = 'm'; m.age = age || 'adult'; m.robe = pal[i % pal.length]; m.accent = null; m.prop = null; };
  const folk = pal => (m, i) => { m.sex = i % 2 ? 'f' : 'm'; m.age = 'adult'; m.robe = pal[i % pal.length]; if (m.sex === 'm') m.accent = null; m.prop = null; };

  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o || {}));
  }
  function lv(name, v, b) { W.set(name, v, !!(b && b.instant) || !!W.replaying); }
  // 一整个昼夜（dur 秒）：时辰走到次日的同一刻
  function fullDay(b, dur) {
    const t0 = U.fract(W.cycling ? W.clockTo : W.clock);
    W.goTo(t0 < 0.5 ? t0 + 0.5 : t0 - 0.5, dur * 0.5, b.instant);
    W.goTo(t0, dur, b.instant);
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶（按姿势估计）
  const POSE_K = { lie: 0.16, fall: 0.16, kneel: 0.62, pray: 0.62, sit: 0.55, seat: 0.72, bow: 0.74 };
  function ptOf(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    const k = (POSE_K[f.pose] || 1) * (frac == null ? 1 : frac);
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k, f._h || 30];
    const h = hP(l) * ({ child: 0.62, baby: 0.34, elder: 0.96 }[f.age] || 1);
    return [f.nx * W.w, baseY(l, f.nx, f.v) - h * k, h];
  }
  function sparkleOn(b, id, n, rgb) {
    if (b.instant || !fx()) return;
    const h = ptOf(id, 0.6);
    if (h) fx().sparkle(h[0], h[1], n || 20, rgb || [255, 232, 180], h[2] * 0.3, 'top');
  }
  function ringOn(b, id, rgb, r) {
    if (b.instant || !fx()) return;
    const h = ptOf(id, 0.6);
    if (h) fx().ring(h[0], h[1], rgb || [255, 236, 196], M() * (r || 0.14), 2.2, 1.4);
  }
  // 字由某种质料聚成（「虚空」由雾聚成）
  function word(b, str, cx, cy, rgb, src, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = Math.min(o.size || Math.max(22, M() * 0.075), (W.w * 0.6) / (n * 1.08));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    fx().nameStr(str, clamp(cx, half + 8, W.w - half - 8), cy, size, rgb, src, { hold: o.hold || 2.4, dark: !!o.dark });
    const a = au();
    if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str));
  }
  // 走兽绕开主要的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // ════════════════════════════════════════════════════════════
  //  布景：物件（位置以比例记；各参数线性缓动；重演时直接到位）
  // ════════════════════════════════════════════════════════════
  const P = new Map();
  // a 显隐 · grow 长出/建成 · gold 黄熟 · reap 收割 · k、k2 各物自己的状态 · fire 火 · lit 灯
  const EASE = { a: 0.9, grow: 0.16, gold: 0.2, reap: 0.09, k: 0.45, k2: 0.45, fire: 0.7, lit: 0.5 };
  function hashStr(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h) % 100000 + 1; }
  function snap(p) { for (const k in EASE) p[k] = p['t' + k]; }
  // prop(id, kind, { x, x0, x1, v, layer, size, label, show, grow, gold, reap, k, k2, fire, lit })
  function prop(id, kind, o) {
    o = o || {};
    let p = P.get(id);
    const isNew = !p;
    if (isNew && !kind) return null;
    if (isNew) {
      p = { id, kind, x: 0.5, x0: 0.5, x1: 0.6, v: 0, layer: 2, size: 1, label: '', seed: hashStr(id) };
      for (const k in EASE) { p[k] = 0; p['t' + k] = 0; }
      p.ta = 1; p.tgrow = 1; p.grow = o.grow != null ? 0 : 1;
      P.set(id, p);
      sortedN = -1;
    }
    for (const k of ['x', 'x0', 'x1', 'v', 'layer', 'size', 'label']) if (o[k] != null) p[k] = o[k];
    for (const k in EASE) if (k !== 'a' && o[k] != null) p['t' + k] = o[k];
    if (o.show != null) p.ta = o.show ? 1 : 0;
    if (o.now) for (const k in EASE) if (k !== 'a' && o[k] != null) p[k] = p['t' + k];
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
  const ORDER = { city: 0, field: 1, works: 2, stones: 3, cairn: 4, almond: 5, well: 6, house: 7, meal: 8, fire: 9, basket: 9, bundle: 9 };
  function sortProps() {
    if (sortedN === P.size && sorted.length === P.size && sorted.every(p => P.get(p.id) === p)) return sorted;
    sorted = Array.from(P.values()).sort((a, b) => (ORDER[a.kind] || 0) - (ORDER[b.kind] || 0) || a.x - b.x);
    sortedN = P.size;
    return sorted;
  }
  function approachLin(cur, tg, step) { return cur < tg ? Math.min(tg, cur + step) : Math.max(tg, cur - step); }

  // ── 转瞬的光（不属于世界的状态；重演时不放）───────────────
  const FXL = [];
  function beam(b, xf, layer, o) {
    if (b.instant) return;
    o = o || {};
    FXL.push({ type: 'beam', t: 0, dur: o.dur || 5, xf, l: layer == null ? 2 : layer, v: o.v || 0, w: (o.w || 70) * SU(), k: o.k || 1, rgb: o.rgb });
  }
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0, dur: 3 }, o)); }

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
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([246, 248, 255], 1), pale: radial([214, 224, 255], 1),
        lamp: radial([255, 150, 60], 1, 0.22), dark: radial([8, 10, 18], 1, 0.5), cloud: radial([62, 66, 80], 1, 0.6), rose: radial([255, 196, 180], 1),
        mist: radial([236, 240, 248], 1, 0.55),
      };
      // 自天而降的光柱
      const b = cnv(64, 256), g = b.getContext('2d');
      const hz = g.createLinearGradient(0, 0, 64, 0);
      hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
      g.globalCompositeOperation = 'destination-in';
      const vt = g.createLinearGradient(0, 0, 0, 256);
      vt.addColorStop(0, 'rgba(0,0,0,0.15)'); vt.addColorStop(0.75, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
      SP.beam = b;
    } catch (e) { SP = null; }
    return SP;
  }
  let ctxA = null;
  function glowAt(img, x, y, r, a, sy) {
    if (!img || !(a > 0.004) || !(r > 0.5) || !isFinite(x) || !isFinite(y)) return;
    ctxA.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctxA.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || !SP) return;
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowAt(SP.warm, x, y - h * 0.45, h * 2.4, k * (0.3 + 0.5 * nightK()));
    const T4 = [[0, 1, 'rgb(255,120,44)', 0.75], [-0.24, 0.7, 'rgb(255,160,64)', 0.7], [0.22, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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

  // ════════════════════════════════════════════════════════════
  //  画：耶路撒冷（中丘）——城墙、房屋、山顶上神的殿、王的宫（2:4）
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function cityGeo(p) {
    const key = W.w + 'x' + W.h + ':' + p.x0 + ':' + p.x1 + ':' + port();
    if (CITY && CITY.key === key) return CITY;
    const r = U.mulberry32(1212), hm = hP(1), out = [];
    const xT = X('temple') * W.w, xPal = X('palace') * W.w;
    let x = p.x0 * W.w;
    while (x < p.x1 * W.w) {
      const w = hm * (0.62 + r() * 0.7), h = hm * (0.7 + r() * 0.75);
      const cx = x + w / 2;
      if ((cx < xT - hm * 2.3 || cx > xT + hm * 1.5) && Math.abs(cx - xPal) > hm * 1.1) out.push({ xf: cx / W.w, w, h, row: r() < 0.45 ? 0 : 1, tone: r(), win: r() < 0.75, wx: r() - 0.5, door: r() < 0.5 });
      x += w * (0.62 + r() * 0.5);
    }
    out.sort((a, b) => a.row - b.row);
    CITY = { key, houses: out };
    return CITY;
  }
  // 一间平顶的石屋：屋身、背光的一面、檐、门窗；夜里窗透出灯光
  function box(ctx, l, x, y, w, h, tone, o) {
    o = o || {};
    const d = litSide(x);
    ctx.fillStyle = css(tone, l);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [44, 36, 32], 0.36), l, 0.85);
    const sw = w * 0.24;
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - sw, y - h, sw, h);
    ctx.fillStyle = css(mix(tone, [80, 66, 52], 0.25), l);
    ctx.fillRect(x - w / 2 - w * 0.04, y - h - h * 0.06, w * 1.08, h * 0.07);
    if (o.win) {
      const s = w * 0.12, wx = x + (o.wx || 0.2) * w * 0.6, wy = y - h * 0.66;
      ctx.fillStyle = css([34, 28, 24], l);
      ctx.fillRect(wx - s / 2, wy - s / 2, s, s * 1.2);
      const lk = (o.lamp || 0) * nightK();
      if (lk > 0.03) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba([255, 184, 104], lk * 0.9 * (o.alpha || 1)); ctx.fillRect(wx - s / 2, wy - s / 2, s, s * 1.2); ctx.globalCompositeOperation = 'source-over'; }
    }
    if (o.door) { ctx.fillStyle = css([30, 24, 20], l); ctx.fillRect(x - w * 0.1, y - h * 0.45, w * 0.2, h * 0.45); }
    ctx.strokeStyle = css([255, 240, 214], l, 0.4 * (0.25 + 0.75 * W.daylight), 0.25);
    ctx.lineWidth = Math.max(0.5, w * 0.03);
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - w * 0.04, y - h - h * 0.06); ctx.lineTo(x + w / 2 + w * 0.04, y - h - h * 0.06);
    if (d > 0) { ctx.moveTo(x + w / 2, y - h); ctx.lineTo(x + w / 2, y); } else { ctx.moveTo(x - w / 2, y - h); ctx.lineTo(x - w / 2, y); }
    ctx.stroke();
  }
  function templeTop() {
    const hm = hP(1), xT = X('temple');
    return [xT * W.w - hm * 0.4, gY(1, xT) - hm * 1.75];
  }
  function drawCity(ctx, p) {
    const G = cityGeo(p), hm = hP(1), l = 1, lk = 0.85;
    const a0 = p.a;
    ctx.globalAlpha = a0;
    // 远一排、近一排的房屋
    for (const hs of G.houses) {
      const x = hs.xf * W.w, y = gY(1, hs.xf) + 1;
      const lift = hs.row ? 0 : hm * 0.28;
      box(ctx, l, x, y - lift, hs.w, hs.h, mix(STONE, STONE2, hs.tone * (hs.row ? 1 : 0.5) + (hs.row ? 0 : 0.2)), { win: hs.win, wx: hs.wx, lamp: lk, alpha: a0, door: hs.row && hs.door });
    }
    // 王的宫（2:4 建造房屋）：自地升起的柱廊
    if (p.k > 0.01) {
      const xp = X('palace') * W.w, yp = gY(1, X('palace')) + 1, w = hm * 2.6, h = hm * 1.5 * U.easeOut(clamp(p.k * 1.2, 0, 1));
      ctx.globalAlpha = a0 * clamp(p.k * 1.6, 0, 1);
      box(ctx, l, xp, yp - hm * 0.1, w, h, LIME, { win: true, wx: 0.3, lamp: 1, alpha: a0 });
      ctx.fillStyle = css([60, 48, 40], l, 0.8);
      for (let i = 0; i < 5; i++) { const cx = xp - w * 0.4 + (w * 0.8 * i) / 4; ctx.fillRect(cx - w * 0.035, yp - hm * 0.1 - h * 0.62, w * 0.07, h * 0.62); }
      ctx.globalAlpha = a0;
    }
    // 神的殿：山顶上的两级平台；东（左）端高起的廊，廊前两根铜柱（雅斤、波阿斯），其后是殿；檐上贴金
    const xT = X('temple'), tx = xT * W.w, ty = gY(1, xT) + 1;
    const TL = [240, 230, 206], TS = [196, 184, 160];
    ctx.fillStyle = css(mix(STONE, [120, 108, 92], 0.3), l);
    ctx.fillRect(tx - hm * 2.1, ty - hm * 0.22, hm * 4.2, hm * 0.22 + 2);
    ctx.fillStyle = css(mix(STONE, [150, 136, 112], 0.2), l);
    ctx.fillRect(tx - hm * 1.8, ty - hm * 0.44, hm * 3.6, hm * 0.23);
    const fy = ty - hm * 0.44;
    // 殿
    box(ctx, l, tx + hm * 0.25, fy, hm * 2.1, hm * 1.25, TL, { win: false });
    ctx.fillStyle = css([60, 50, 40], l, 0.85);
    for (let i = 0; i < 4; i++) ctx.fillRect(tx - hm * 0.5 + i * hm * 0.42, fy - hm * 1.08, hm * 0.1, hm * 0.16);
    // 廊（比殿高）
    box(ctx, l, tx - hm * 1.05, fy, hm * 0.6, hm * 1.8, mix(TL, TS, 0.15), { win: false });
    ctx.fillStyle = css([36, 28, 22], l);
    ctx.beginPath(); ctx.moveTo(tx - hm * 1.17, fy); ctx.lineTo(tx - hm * 1.17, fy - hm * 0.62); ctx.arc(tx - hm * 1.05, fy - hm * 0.62, hm * 0.12, Math.PI, 0); ctx.lineTo(tx - hm * 0.93, fy); ctx.closePath(); ctx.fill();
    // 两根铜柱
    for (const ox of [-1.62, -1.44]) {
      const cx = tx + ox * hm;
      ctx.fillStyle = css([176, 122, 66], l, 1, 0.08);
      ctx.fillRect(cx - hm * 0.045, fy - hm * 1.1, hm * 0.09, hm * 1.1);
      ctx.beginPath(); ctx.ellipse(cx, fy - hm * 1.12, hm * 0.1, hm * 0.07, 0, 0, TAU); ctx.fill();
    }
    // 贴金的檐（神在天上时更亮）
    const gk = 0.6 + 0.4 * LV.ecHeaven;
    ctx.strokeStyle = css([255, 214, 120], l, gk, 0.35);
    ctx.lineWidth = Math.max(0.8, hm * 0.06);
    ctx.beginPath();
    ctx.moveTo(tx - hm * 1.39, fy - hm * 1.86); ctx.lineTo(tx - hm * 0.71, fy - hm * 1.86);
    ctx.moveTo(tx - hm * 0.8, fy - hm * 1.31); ctx.lineTo(tx + hm * 1.34, fy - hm * 1.31);
    ctx.stroke();
    if (SP && gk > 0.02) { ctxA = ctx; ctx.globalCompositeOperation = 'lighter'; glowAt(SP.gold, tx - hm * 1.05, fy - hm * 1.86, hm * 0.9, 0.18 * gk * (0.4 + 0.6 * W.daylight)); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = a0; }
    // 城墙：顺着山势，垛口一个接一个；城门
    const x0 = p.x0 * W.w, x1 = p.x1 * W.w, wh = hm * 0.5, n = 40;
    const wallC = css(mix(STONE2, [110, 96, 80], 0.3), l);
    ctx.fillStyle = wallC;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(1, x / W.w) + 2 - wh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.lineTo(x1, gY(1, x1 / W.w) + 3); ctx.lineTo(x0, gY(1, x0 / W.w) + 3);
    ctx.closePath(); ctx.fill();
    const cw = hm * 0.16;
    for (let x = x0 + cw; x < x1; x += cw * 2.2) { const y = gY(1, x / W.w) + 2 - wh; ctx.fillRect(x - cw / 2, y - cw * 0.9, cw, cw * 0.95); }
    const gxf = lerp(p.x0, p.x1, 0.2), gx = gxf * W.w, gy = gY(1, gxf) + 2;
    ctx.fillStyle = css(mix(STONE2, [110, 96, 80], 0.15), l);
    ctx.fillRect(gx - hm * 0.34, gy - wh - hm * 0.35, hm * 0.68, wh + hm * 0.35);
    ctx.fillStyle = css([30, 24, 20], l);
    ctx.beginPath(); ctx.moveTo(gx - hm * 0.14, gy); ctx.lineTo(gx - hm * 0.14, gy - wh * 0.7); ctx.arc(gx, gy - wh * 0.7, hm * 0.14, Math.PI, 0); ctx.lineTo(gx + hm * 0.14, gy); ctx.closePath(); ctx.fill();
    // 迎光的城头
    ctx.strokeStyle = css([255, 236, 204], l, 0.3 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.lineWidth = Math.max(0.5, hm * 0.03);
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(1, x / W.w) + 2 - wh; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.stroke();
    // 冬天：屋顶与城头的雪
    const sn = LV.ecSnow;
    if (sn > 0.02) {
      ctx.fillStyle = rgba(snowCol(DEP(1)), sn * 0.9 * a0);
      for (const hs of G.houses) { const x = hs.xf * W.w, y = gY(1, hs.xf) + 1 - (hs.row ? 0 : hm * 0.28); ctx.fillRect(x - hs.w * 0.54, y - hs.h * 1.08, hs.w * 1.08, hs.h * 0.05); }
      ctx.fillRect(tx - hm * 0.8, ty - hm * 1.8, hm * 2.15, hm * 0.07); ctx.fillRect(tx - hm * 1.36, ty - hm * 2.34, hm * 0.62, hm * 0.07);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：传道者的家——石屋、门廊、石凳、银链与金罐、磨
  // ════════════════════════════════════════════════════════════
  function houseX() { return X('bench') + (1.55 * hP(2)) / Math.max(1, W.w); }
  // 金罐挂在廊梁上的位置（像素）
  function bowlPos() {
    const hN = hP(2), xb = X('bench') * W.w, y0 = gY(2, X('bench'));
    return { x: xb + hN * 0.04, beamY: y0 - hN * 1.32, y: y0 - hN * 1.32 + hN * 0.3, hN, y0 };
  }
  function millPos() { const hN = hP(2), xf = houseX() + (0.62 * hN) / W.w; return { x: xf * W.w, y: baseY(2, xf, 0.035), hN }; }
  let millA = 0, wheelA = 0;
  function drawHouse(ctx, p) {
    const hN = hP(2), l = 2, xf = houseX(), x = xf * W.w, y0 = gY(2, xf) + 1;
    const w = hN * 2.2, h = hN * 1.55, xL = x - w / 2;
    ctx.globalAlpha = p.a;
    // 影
    ctx.fillStyle = 'rgba(8,10,16,0.2)';
    ctx.beginPath(); ctx.ellipse(x - hN * 0.4, y0 + 1, w * 0.75, hN * 0.07, 0, 0, TAU); ctx.fill();
    // 屋身
    box(ctx, l, x, y0, w, h, [196, 178, 146], { win: false });
    // 门：开着时是暗的门洞，夜里透出灯光；关上时是一扇木门
    const dx = xL + hN * 0.42, dw = hN * 0.36, dh = hN * 0.82;
    ctx.fillStyle = css([26, 20, 16], l);
    ctx.fillRect(dx - dw / 2, y0 - dh, dw, dh);
    const inner = p.lit * (0.3 + 0.7 * nightK()) * (1 - p.k);
    if (inner > 0.02) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba([255, 170, 90], inner * 0.55); ctx.fillRect(dx - dw / 2, y0 - dh, dw, dh); ctx.globalCompositeOperation = 'source-over'; }
    if (p.k > 0.01) {
      ctx.fillStyle = css(WOOD, l);
      ctx.fillRect(dx - dw / 2, y0 - dh, dw * p.k, dh);
      ctx.strokeStyle = css([60, 42, 30], l, 0.8);
      ctx.lineWidth = Math.max(0.5, hN * 0.02);
      ctx.beginPath();
      for (let i = 1; i < 3; i++) { const yy = y0 - dh * (i / 3); ctx.moveTo(dx - dw / 2, yy); ctx.lineTo(dx - dw / 2 + dw * p.k, yy); }
      ctx.stroke();
    }
    // 窗：从窗户往外看的都昏暗（12:3）
    const wx = x + hN * 0.52, wy = y0 - hN * 1.08, ws = hN * 0.24;
    ctx.fillStyle = css([28, 22, 18], l);
    ctx.fillRect(wx - ws / 2, wy - ws / 2, ws, ws * 1.15);
    const wl = p.lit * (0.25 + 0.75 * nightK());
    if (wl > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([255, 184, 104], wl * 0.95);
      ctx.fillRect(wx - ws / 2, wy - ws / 2, ws, ws * 1.15);
      ctxA = ctx;
      glowAt(SP && SP.warm, wx, wy, hN * 0.8, wl * 0.35);
      ctx.globalAlpha = p.a;
      ctx.globalCompositeOperation = 'source-over';
    }
    // 门廊：一根廊梁、一根柱子
    const bx0 = xL - hN * 1.0, by = y0 - hN * 1.32;
    ctx.fillStyle = css(WOOD, l);
    ctx.fillRect(bx0, by - hN * 0.07, xL - bx0 + hN * 0.05, hN * 0.09);
    ctx.fillRect(bx0 + hN * 0.02, by - hN * 0.02, hN * 0.08, y0 - by + 1);
    // 廊顶的席
    ctx.fillStyle = css([150, 124, 84], l, 0.9);
    ctx.beginPath(); ctx.moveTo(bx0 - hN * 0.08, by - hN * 0.06); ctx.lineTo(xL + 1, by - hN * 0.2); ctx.lineTo(xL + 1, by - hN * 0.1); ctx.lineTo(bx0 - hN * 0.08, by + hN * 0.02); ctx.closePath(); ctx.fill();
    // 石凳
    const sx = X('bench') * W.w, sy = gY(2, X('bench')) + 1, sw = hN * 0.62, sh = hN * 0.27;
    ctx.fillStyle = css([164, 150, 128], l);
    ctx.fillRect(sx - sw / 2, sy - sh, sw, sh * 0.3);
    ctx.fillRect(sx - sw * 0.42, sy - sh * 0.75, sw * 0.18, sh * 0.75);
    ctx.fillRect(sx + sw * 0.24, sy - sh * 0.75, sw * 0.18, sh * 0.75);
    // 银链与金罐（12:6）
    drawBowl(ctx, p);
    // 迎光的边
    const ra = rimA();
    if (ra > 0.05) {
      ctx.strokeStyle = css([255, 232, 196], l, ra * 0.5, 0.3);
      ctx.lineWidth = Math.max(0.6, hN * 0.025);
      ctx.beginPath(); ctx.moveTo(bx0 - hN * 0.08, by - hN * 0.06); ctx.lineTo(xL + 1, by - hN * 0.2); ctx.stroke();
    }
    // 雪
    const sn = LV.ecSnow;
    if (sn > 0.02) {
      ctx.fillStyle = rgba(snowCol(0), sn * 0.95 * p.a);
      ctx.fillRect(x - w * 0.54, y0 - h - h * 0.1, w * 1.08, h * 0.06);
      ctx.beginPath(); ctx.moveTo(bx0 - hN * 0.08, by - hN * 0.07); ctx.lineTo(xL + 1, by - hN * 0.21); ctx.lineTo(xL + 1, by - hN * 0.17); ctx.lineTo(bx0 - hN * 0.08, by - hN * 0.04); ctx.closePath(); ctx.fill();
    }
    // 磨（12:3–4 推磨的止息）：两扇圆石，一根把手随推磨转动
    const mp = millPos(), mr = hN * 0.28;
    ctx.fillStyle = css([128, 120, 110], l);
    ctx.beginPath(); ctx.ellipse(mp.x, mp.y - mr * 0.18, mr, mr * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillRect(mp.x - mr, mp.y - mr * 0.48, mr * 2, mr * 0.3);
    ctx.fillStyle = css([150, 142, 130], l);
    ctx.beginPath(); ctx.ellipse(mp.x, mp.y - mr * 0.5, mr * 0.92, mr * 0.28, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([60, 52, 46], l);
    ctx.beginPath(); ctx.ellipse(mp.x, mp.y - mr * 0.52, mr * 0.12, mr * 0.05, 0, 0, TAU); ctx.fill();
    const ha = millA, hx = mp.x + Math.cos(ha) * mr * 0.7, hy = mp.y - mr * 0.5 + Math.sin(ha) * mr * 0.2;
    ctx.strokeStyle = css(WOOD, l);
    ctx.lineWidth = Math.max(1, hN * 0.05);
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - mr * 0.5); ctx.stroke();
    // 推磨时落下的一点细面
    if (p.k2 > 0.3) { ctx.fillStyle = css([240, 232, 212], l, 0.8 * p.k2); ctx.beginPath(); ctx.ellipse(mp.x - mr * 0.95, mp.y - mr * 0.05, mr * 0.2, mr * 0.07, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  function drawBowl(ctx, p) {
    const B = bowlPos(), hN = B.hN, l = 2;
    const cw = Math.max(0.6, hN * 0.018);
    ctx.lineWidth = cw;
    const chain = css(SILVER, l, 0.95, 0.2);
    if (S.bowl === 'hang') {
      ctx.strokeStyle = chain;
      ctx.beginPath(); ctx.moveTo(B.x, B.beamY); ctx.lineTo(B.x, B.y - hN * 0.04); ctx.stroke();
      bowlShape(ctx, B.x, B.y, hN, 0, 1);
      if (p.fire > 0.01) flame(ctx, B.x, B.y - hN * 0.045, hN * 0.16, p.fire, 3.1);
      ctx.globalAlpha = p.a;
      // 银链的光点
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = rgba([230, 236, 255], 0.25 + 0.4 * nightK());
      for (let i = 1; i < 5; i++) ctx.fillRect(B.x - cw * 0.8, lerp(B.beamY, B.y, i / 5) - cw * 0.8, cw * 1.6, cw * 1.6);
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    // 折断的银链：上半截还挂着，微微摆动
    const stub = hN * 0.12;
    const sw = S.bowl === 'fall' ? Math.sin((W.t - S.bowlT0) * 7) * 0.25 * Math.exp(-(W.t - S.bowlT0) * 0.8) : 0;
    ctx.strokeStyle = chain;
    ctx.beginPath(); ctx.moveTo(B.x, B.beamY); ctx.lineTo(B.x + Math.sin(sw) * stub, B.beamY + Math.cos(sw) * stub); ctx.stroke();
    const gy = B.y0 + hN * 0.02;
    if (S.bowl === 'fall') {
      const t = clamp((W.t - S.bowlT0) * (W.fast || 1), 0, 0.9), f = clamp((t * t) / 0.36, 0, 1);
      bowlShape(ctx, B.x - hN * 0.1 * f, lerp(B.y, gy - hN * 0.03, f), hN, f * 1.4, 1);
      return;
    }
    // 金罐破裂：两片落在凳前
    ctx.fillStyle = css(GOLD, l, 1, 0.2);
    for (const [ox, rot, r] of [[-0.2, -0.5, 0.09], [0.1, 0.7, 0.08], [-0.04, 0.2, 0.045]]) {
      ctx.beginPath(); ctx.ellipse(B.x + ox * hN, gy - hN * 0.02, hN * r, hN * r * 0.45, rot, 0, Math.PI); ctx.fill();
    }
    if (SP) { ctxA = ctx; ctx.globalCompositeOperation = 'lighter'; glowAt(SP.gold, B.x - hN * 0.05, gy - hN * 0.03, hN * 0.3, 0.25 * (0.4 + 0.6 * nightK()) * p.a); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = p.a; }
  }
  function bowlShape(ctx, x, y, hN, rot, k) {
    const l = 2, r = hN * 0.13;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = css(GOLD, l, k, 0.12);
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = css([255, 222, 150], l, k, 0.25);
    ctx.fillRect(-r * 1.05, -r * 0.06, r * 2.1, r * 0.16);
    ctx.restore();
  }

  // ════════════════════════════════════════════════════════════
  //  画：井、水轮、井旁的瓶子（12:6）
  // ════════════════════════════════════════════════════════════
  function drawWell(ctx, p) {
    const hN = hP(2), l = 2, x = p.x * W.w, y0 = gY(2, p.x) + 1;
    const rw = hN * 0.36, bh = hN * 0.36;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = 'rgba(8,10,16,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y0 + 1, rw * 1.3, hN * 0.05, 0, 0, TAU); ctx.fill();
    // 井身：石头一圈一圈
    ctx.fillStyle = css([150, 140, 124], l);
    ctx.fillRect(x - rw, y0 - bh, rw * 2, bh);
    ctx.beginPath(); ctx.ellipse(x, y0, rw, rw * 0.22, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = css([100, 92, 82], l, 0.8);
    ctx.lineWidth = Math.max(0.5, hN * 0.015);
    ctx.beginPath();
    for (let i = 1; i < 3; i++) { const yy = y0 - bh * (i / 3); ctx.moveTo(x - rw, yy); ctx.lineTo(x + rw, yy); }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) { const xx = x - rw + ((j + (i % 2) * 0.5) / 4) * rw * 2; ctx.moveTo(xx, y0 - bh * (i / 3)); ctx.lineTo(xx, y0 - bh * ((i + 1) / 3)); }
    ctx.stroke();
    ctx.fillStyle = css([176, 166, 150], l);
    ctx.beginPath(); ctx.ellipse(x, y0 - bh, rw, rw * 0.22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([20, 18, 22], l);
    ctx.beginPath(); ctx.ellipse(x, y0 - bh, rw * 0.78, rw * 0.15, 0, 0, TAU); ctx.fill();
    // 井架与水轮：破烂时一边的柱子歪倒，水轮落在井口
    const br = p.k, top = y0 - hN * 1.12, pw = Math.max(1, hN * 0.05);
    ctx.fillStyle = css(WOOD, l);
    ctx.fillRect(x - rw * 0.86 - pw / 2, top, pw, y0 - bh - top);
    ctx.save();
    ctx.translate(x + rw * 0.86, y0 - bh);
    ctx.rotate(br * 0.42);
    ctx.fillRect(-pw / 2, top - (y0 - bh), pw, y0 - bh - top);
    ctx.restore();
    // 横梁（折断时斜挂）
    ctx.strokeStyle = css(WOOD, l);
    ctx.lineWidth = pw * 0.9;
    const bxR = x + rw * 0.86 + Math.sin(br * 0.42) * (y0 - bh - top), byR = y0 - bh - Math.cos(br * 0.42) * (y0 - bh - top);
    ctx.beginPath(); ctx.moveTo(x - rw * 0.86, top + pw * 0.4); ctx.lineTo(lerp(x + rw * 0.86, bxR, 1), lerp(top, byR, 1) + pw * 0.4); ctx.stroke();
    // 水轮
    const wr = hN * 0.17;
    const wcx = lerp(x, x - rw * 0.2, br), wcy = lerp(top + wr * 0.9, y0 - bh - wr * 0.25, U.easeIn(br));
    const tilt = br * 1.15;
    ctx.save();
    ctx.translate(wcx, wcy);
    ctx.rotate(tilt * 0.6);
    ctx.scale(1, 1 - br * 0.55);
    ctx.strokeStyle = css([120, 88, 58], l);
    ctx.lineWidth = Math.max(0.9, hN * 0.035);
    ctx.beginPath(); ctx.arc(0, 0, wr, 0, TAU); ctx.stroke();
    ctx.lineWidth = Math.max(0.6, hN * 0.02);
    ctx.beginPath();
    const ns = br > 0.5 ? 4 : 6;
    for (let i = 0; i < ns; i++) { const a = wheelA + (i * TAU) / 6; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * wr, Math.sin(a) * wr); }
    ctx.stroke();
    ctx.restore();
    // 绳子垂入井中（水轮破烂后松落）
    if (br < 0.9) {
      ctx.strokeStyle = css([170, 150, 110], l, 0.9 * (1 - br));
      ctx.lineWidth = Math.max(0.5, hN * 0.012);
      ctx.beginPath(); ctx.moveTo(wcx + wr, wcy); ctx.lineTo(wcx + wr * 0.9, y0 - bh - hN * 0.02); ctx.stroke();
    }
    // 井旁的瓶子（在泉旁损坏）
    const jx = x + rw * 1.45, jy = y0 + hN * 0.02, jh = hN * 0.34;
    if (p.k2 < 0.5) {
      ctx.fillStyle = css(CLAY, l);
      ctx.beginPath(); ctx.ellipse(jx, jy - jh * 0.42, jh * 0.26, jh * 0.38, 0, 0, TAU); ctx.fill();
      ctx.fillRect(jx - jh * 0.08, jy - jh * 0.92, jh * 0.16, jh * 0.2);
      ctx.fillRect(jx - jh * 0.13, jy - jh * 0.96, jh * 0.26, jh * 0.06);
      ctx.strokeStyle = css(CLAY, l);
      ctx.lineWidth = Math.max(0.6, jh * 0.05);
      ctx.beginPath(); ctx.arc(jx + jh * 0.2, jy - jh * 0.66, jh * 0.12, -1.4, 1.2); ctx.stroke();
      const ra = rimA();
      if (ra > 0.05) { ctx.strokeStyle = css([255, 222, 180], l, ra * 0.6, 0.3); ctx.lineWidth = Math.max(0.5, jh * 0.04); ctx.beginPath(); ctx.ellipse(jx, jy - jh * 0.42, jh * 0.26, jh * 0.38, 0, litSide(jx) > 0 ? -0.9 : 2.2, litSide(jx) > 0 ? 0.6 : 3.8); ctx.stroke(); }
    } else {
      // 碎片与一滩水
      ctx.fillStyle = css([60, 70, 86], l, 0.5);
      ctx.beginPath(); ctx.ellipse(jx, jy, jh * 0.5, jh * 0.08, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css(CLAY, l);
      for (const [ox, oy, r0, rot] of [[-0.25, -0.05, 0.16, 0.3], [0.1, -0.08, 0.2, -0.6], [0.32, -0.02, 0.12, 1.1]]) {
        ctx.beginPath(); ctx.ellipse(jx + ox * jh, jy + oy * jh, r0 * jh, r0 * jh * 0.45, rot, 0, Math.PI); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：田（撒种、青苗、黄熟、收割）
  // ════════════════════════════════════════════════════════════
  let FG = null;
  function fieldGeo(p) {
    const key = W.w + 'x' + W.h + ':' + p.x0 + ':' + p.x1;
    if (FG && FG.key === key) return FG;
    const R = U.mulberry32(3031), rows = 5, stalks = [];
    const fw = (p.x1 - p.x0) * W.w;
    const per = clamp(Math.round(fw / Math.max(2.6, 5.4 * SU())), 10, 80);
    for (let r = 0; r < rows; r++) for (let i = 0; i < per; i++) {
      const f = (i + 0.5 + (R() - 0.5) * 0.6) / per;
      if (f < 0.02 || f > 0.98) continue;
      stalks.push({ f, r, h: 0.8 + R() * 0.45, lean: (R() - 0.5) * 0.3, ph: R() * TAU });
    }
    FG = { key, rows, stalks };
    return FG;
  }
  const FV = [0.03, 0.3];
  function fieldV(r, rows) { return lerp(FV[0], FV[1], Math.pow(r / rows, 1.2)); }
  function drawField(ctx, p) {
    const G = fieldGeo(p), l = 2, n = 26;
    const x0 = p.x0 * W.w, x1 = p.x1 * W.w;
    ctx.globalAlpha = p.a;
    const soil = W.shade([104, 76, 50], 0), furrow = W.shade([66, 48, 32], 0);
    for (let r = 0; r < G.rows; r++) {
      const va = fieldV(r, G.rows), vb = fieldV(r + 1, G.rows);
      const grd = ctx.createLinearGradient(x0, 0, x1, 0);
      const a = (r % 2 ? 0.55 : 0.72) * (1 - 0.35 * (r / G.rows));
      const col = r % 2 ? furrow : soil;
      grd.addColorStop(0, rgba(col, 0)); grd.addColorStop(0.08, rgba(col, a)); grd.addColorStop(0.92, rgba(col, a)); grd.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = grd;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) { const xf = lerp(p.x0, p.x1, i / n); const y = baseY(2, xf, va); if (i) ctx.lineTo(xf * W.w, y); else ctx.moveTo(xf * W.w, y); }
      for (let i = n; i >= 0; i--) { const xf = lerp(p.x0, p.x1, i / n); ctx.lineTo(xf * W.w, baseY(2, xf, vb)); }
      ctx.closePath(); ctx.fill();
    }
    const grow = p.grow;
    if (grow > 0.01) {
      const h = hP(2), sway = (W.wind || 0) * 0.1 + 0.25 * LV.ecWind;
      const green = [92, 140, 60], ripe = [224, 186, 96];
      const col = mix(green, ripe, p.gold);
      const stalkC = W.shadeCSS(mix(col, [120, 110, 70], 0.2), 0, null, 0.03), headC = W.shadeCSS(mix(col, [255, 220, 140], 0.25), 0, null, 0.08);
      const cutAt = 1 - p.reap;
      ctx.lineCap = 'round';
      const heads = [];
      ctx.beginPath();
      for (const s of G.stalks) {
        const xf = lerp(p.x0, p.x1, s.f), x = xf * W.w;
        const v = (fieldV(s.r, G.rows) + fieldV(s.r + 1, G.rows)) * 0.5, y = baseY(2, xf, v);
        const depthK = 1 + 1.2 * v;
        const edge = smoothstep(0, 0.07, s.f) * smoothstep(1, 0.93, s.f);
        const cut = s.f > cutAt;
        const H = h * (cut ? 0.05 : 0.3 * s.h * grow) * depthK * edge;
        if (H < 0.6) continue;
        const bend = s.lean + sway * Math.sin(W.t * 1.6 + s.ph);
        const tx = x + Math.sin(bend) * H, ty = y - Math.cos(bend) * H;
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + Math.sin(bend) * H * 0.2, y - H * 0.6, tx, ty);
        if (!cut && grow > 0.6) heads.push(tx, ty, bend, depthK);
      }
      ctx.strokeStyle = stalkC;
      ctx.lineWidth = Math.max(0.6, 0.85 * SU());
      ctx.stroke();
      if (heads.length) {
        const hl = h * 0.075 * smoothstep(0.6, 1, grow);
        ctx.beginPath();
        for (let i = 0; i < heads.length; i += 4) {
          const tx = heads[i], ty = heads[i + 1], b = heads[i + 2], k = heads[i + 3];
          ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.sin(b + 0.15) * hl * k, ty - Math.cos(b + 0.15) * hl * k);
        }
        ctx.strokeStyle = headC;
        ctx.lineWidth = Math.max(1.1, 1.9 * SU());
        ctx.stroke();
        const ra = rimA() * p.gold;
        if (ra > 0.05) { ctx.strokeStyle = W.shadeCSS([255, 228, 170], 0, null, 0.4); ctx.globalAlpha = p.a * ra * 0.5; ctx.lineWidth = Math.max(0.5, 0.7 * SU()); ctx.stroke(); ctx.globalAlpha = p.a; }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：王的大工程——葡萄园、果木园、水池（2:4–6），风过即化作雾气
  // ════════════════════════════════════════════════════════════
  function drawWorks(ctx, p) {
    const l = 2, h = hP(2), vap = p.k, a0 = p.a * (1 - vap * 0.92);
    if (a0 < 0.01) return;
    const lift = vap * h * 0.5;
    const at = t => lerp(p.x0, p.x1, t);
    const gv = clamp(p.grow * 2.2, 0, 1), go = clamp(p.grow * 2.2 - 0.6, 0, 1), gp = clamp(p.grow * 2.2 - 1.2, 0, 1);
    const pale = c => mix(c, [236, 240, 248], vap * 0.7);
    ctx.globalAlpha = a0;
    // 水池
    if (gp > 0.01) {
      const cx = at(0.84) * W.w, cy = baseY(2, at(0.84), 0.2) - lift, rx = h * 1.05 * (0.4 + 0.6 * gp), ry = h * 0.2 * (0.4 + 0.6 * gp);
      ctx.fillStyle = css(pale([176, 164, 140]), l);
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, TAU); ctx.fill();
      const wg = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
      const sky = W.haze || [150, 180, 210];
      wg.addColorStop(0, rgba(mix(sky, [255, 255, 255], 0.2), 0.95)); wg.addColorStop(1, rgba(mix(sky, [20, 40, 70], 0.55), 0.95));
      ctx.fillStyle = wg;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx * 0.86, ry * 0.72 * gp, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba([255, 250, 236], 0.4 * gp * (0.3 + 0.7 * W.daylight));
      ctx.lineWidth = Math.max(0.6, h * 0.02);
      ctx.beginPath(); ctx.moveTo(cx - rx * 0.5, cy - ry * 0.15); ctx.lineTo(cx + rx * 0.2, cy - ry * 0.15); ctx.stroke();
    }
    // 果木园：三棵果树
    if (go > 0.01) {
      for (const [t, v, s] of [[0.52, 0.04, 1], [0.6, 0.22, 1.1], [0.69, 0.1, 0.95]]) {
        const xf = at(t), x = xf * W.w, y = baseY(2, xf, v) - lift, k = (1 + 0.35 * v) * s, gg = U.easeOut(go);
        const th = h * 0.55 * k * gg, cr = h * 0.36 * k * gg;
        ctx.fillStyle = css(pale([74, 54, 38]), l);
        ctx.fillRect(x - h * 0.03 * k, y - th, h * 0.06 * k, th);
        ctx.fillStyle = css(pale([58, 96, 50]), l);
        ctx.beginPath(); ctx.ellipse(x, y - th - cr * 0.6, cr, cr * 0.82, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = css(pale([74, 118, 60]), l, 0.9);
        ctx.beginPath(); ctx.ellipse(x - cr * 0.3 * litSide(x) * -1, y - th - cr * 0.85, cr * 0.6, cr * 0.5, 0, 0, TAU); ctx.fill();
        if (gg > 0.7) {
          ctx.fillStyle = css(pale([206, 64, 60]), l, 1, 0.1);
          for (let i = 0; i < 6; i++) { const a = i * 1.1 + t * 7; ctx.beginPath(); ctx.arc(x + Math.cos(a) * cr * 0.62, y - th - cr * 0.6 + Math.sin(a) * cr * 0.5, Math.max(1, h * 0.035), 0, TAU); ctx.fill(); }
        }
      }
    }
    // 葡萄园：一行行木桩与藤
    if (gv > 0.01) {
      for (const [v, ph] of [[0.05, 0], [0.15, 0.4], [0.26, 0.8]]) {
        const k = 1 + 0.35 * v, sh = h * 0.5 * k * U.easeOut(gv), xa = at(0.02), xb = at(0.44);
        const nS = Math.max(4, Math.round(((xb - xa) * W.w) / (h * 0.36)));
        ctx.strokeStyle = css(pale([96, 72, 50]), l);
        ctx.lineWidth = Math.max(0.7, h * 0.025 * k);
        ctx.beginPath();
        const tops = [];
        for (let i = 0; i <= nS; i++) { const xf = lerp(xa, xb, i / nS), x = xf * W.w, y = baseY(2, xf, v) - lift; ctx.moveTo(x, y); ctx.lineTo(x, y - sh); tops.push([x, y - sh]); }
        ctx.stroke();
        // 藤：沿桩顶垂成弧
        ctx.strokeStyle = css(pale([70, 104, 52]), l);
        ctx.lineWidth = Math.max(1, h * 0.04 * k);
        ctx.beginPath();
        for (let i = 0; i < tops.length - 1; i++) { const A = tops[i], B = tops[i + 1]; ctx.moveTo(A[0], A[1]); ctx.quadraticCurveTo((A[0] + B[0]) / 2, (A[1] + B[1]) / 2 + sh * 0.18, B[0], B[1]); }
        ctx.stroke();
        if (gv > 0.5) {
          ctx.fillStyle = css(pale([84, 124, 62]), l);
          for (let i = 0; i < tops.length - 1; i++) {
            const A = tops[i], B = tops[i + 1];
            for (let j = 0; j < 3; j++) { const u = (j + 0.5) / 3, xx = lerp(A[0], B[0], u), yy = lerp(A[1], B[1], u) + Math.sin(u * Math.PI) * sh * 0.14; ctx.beginPath(); ctx.ellipse(xx, yy - h * 0.03, h * 0.05 * k, h * 0.035 * k, 0.3 * (j - 1), 0, TAU); ctx.fill(); }
          }
          ctx.fillStyle = css(pale([96, 52, 104]), l, 1, 0.05);
          for (let i = 0; i < tops.length - 1; i += 1) { const A = tops[i], B = tops[i + 1]; const xx = (A[0] + B[0]) / 2 + ph * h * 0.05, yy = (A[1] + B[1]) / 2 + sh * 0.16; ctx.beginPath(); ctx.ellipse(xx, yy + h * 0.04, h * 0.03 * k, h * 0.05 * k, 0, 0, TAU); ctx.fill(); }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  画：杏树（四季：叶、花、秋黄、冬枯）；先前世代的坟
  // ════════════════════════════════════════════════════════════
  let AG = null;
  function almondGeo() {
    const key = W.w + 'x' + W.h;
    if (AG && AG.key === key) return AG;
    const R = U.mulberry32(777), br = [], tw = [], blobs = [], fl = [];
    // 主干顶端 (0, -0.95) 分出五枝，每枝再生几根细枝（以身高 h 为单位）
    const main = [[-0.95, -1.45], [-0.5, -1.9], [0.08, -2.1], [0.6, -1.88], [0.98, -1.42]];
    const tips = [];
    for (const t of main) {
      const mx = t[0] * 0.45 + (R() - 0.5) * 0.1, my = -0.95 + (t[1] + 0.95) * 0.5;
      br.push([0, -0.95, mx, my, t[0], t[1]]);
      tips.push(t);
      for (let j = 0; j < 3; j++) {
        const f = 0.45 + 0.25 * j, sx = lerp(mx, t[0], f), sy = lerp(my, t[1], f);
        const ex = sx + (R() - 0.5) * 0.7 + t[0] * 0.15, ey = sy - 0.15 - R() * 0.3;
        tw.push([sx, sy, ex, ey]);
        tips.push([ex, ey]);
      }
    }
    for (const t of tips) for (let j = 0; j < 3; j++) blobs.push({ x: t[0] + (R() - 0.5) * 0.34, y: t[1] + (R() - 0.5) * 0.26, r: 0.11 + R() * 0.09, o: R() });
    blobs.sort((a, b) => a.o - b.o);
    for (const t of tips) for (let j = 0; j < 9; j++) { const a = R() * TAU, r = Math.sqrt(R()) * 0.3; fl.push({ x: t[0] + Math.cos(a) * r, y: t[1] + Math.sin(a) * r * 0.8, p: R() < 0.4, o: R(), s: 0.7 + R() * 0.6 }); }
    fl.sort((a, b) => a.o - b.o);
    AG = { key, br, tw, blobs, fl };
    return AG;
  }
  function drawAlmond(ctx, p) {
    const G = almondGeo(), l = 2, h = hP(2) * 0.95, x = p.x * W.w, y = gY(2, p.x) + 1;
    ctx.globalAlpha = p.a;
    const sway = Math.sin(W.t * 0.9) * 0.02 + 0.03 * LV.ecWind * Math.sin(W.t * 2.3);
    const P2 = (px, py) => [x + (px + sway * -py) * h, y + py * h];
    // 花开时，树冠有一层淡淡的粉白
    if (p.k > 0.05 && SP) {
      ctxA = ctx;
      glowAt(SP.rose, x, y - h * 1.75, h * 1.35, p.k * (0.1 + 0.18 * nightK()) * p.a, 0.62);
      ctx.globalAlpha = p.a;
    }
    // 树干、枝、细枝
    ctx.strokeStyle = css([70, 52, 40], l); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.4, h * 0.085);
    const tp = P2(0, -0.95);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * 0.08, y - h * 0.5, tp[0], tp[1]); ctx.stroke();
    ctx.lineWidth = Math.max(0.9, h * 0.04);
    ctx.beginPath();
    for (const b of G.br) { const a = P2(b[0], b[1]), m = P2(b[2], b[3]), e = P2(b[4], b[5]); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(m[0], m[1], e[0], e[1]); }
    ctx.stroke();
    ctx.lineWidth = Math.max(0.6, h * 0.018);
    ctx.beginPath();
    for (const t of G.tw) { const a = P2(t[0], t[1]), e = P2(t[2], t[3]); ctx.moveTo(a[0], a[1]); ctx.lineTo(e[0], e[1]); }
    ctx.stroke();
    // 雪落在枝上
    if (LV.ecSnow > 0.05) {
      ctx.strokeStyle = rgba(snowCol(0), LV.ecSnow * 0.9 * p.a);
      ctx.lineWidth = Math.max(0.8, h * 0.025);
      ctx.beginPath();
      for (const b of G.br) { const m = P2(b[2], b[3] - 0.03), e = P2(b[4], b[5] - 0.03); ctx.moveTo(m[0], m[1]); ctx.lineTo(e[0], e[1]); }
      ctx.stroke();
    }
    // 叶：绿 → 秋黄
    const N = G.blobs.length, leafN = p.grow * N;
    if (leafN > 0.05) {
      const c1 = mix([66, 108, 58], [206, 142, 52], p.gold), c2 = mix([88, 134, 70], [234, 180, 78], p.gold);
      for (let i = 0; i < N; i++) {
        const a = clamp(leafN - i, 0, 1);
        if (a <= 0) continue;
        const bl = G.blobs[i], c = P2(bl.x, bl.y);
        ctx.fillStyle = css(i % 3 ? c1 : c2, l, a * 0.92);
        ctx.beginPath(); ctx.ellipse(c[0], c[1], bl.r * h, bl.r * h * 0.72, 0, 0, TAU); ctx.fill();
      }
    }
    // 花：一朵一朵散在枝头，白里带粉
    const F = G.fl.length, flN = p.k * F;
    if (flN > 0.5) {
      const r0 = Math.max(0.9, h * 0.026);
      for (const pink of [false, true]) {
        ctx.fillStyle = css(pink ? [248, 204, 220] : [255, 250, 248], l, 1, 0.4);
        ctx.beginPath();
        for (let i = 0; i < flN && i < F; i++) {
          const f = G.fl[i];
          if (f.p !== pink) continue;
          const c = P2(f.x, f.y), r = r0 * f.s;
          ctx.moveTo(c[0] + r, c[1]); ctx.arc(c[0], c[1], r, 0, TAU);
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function drawCairn(ctx, p) {
    const l = 2, h = hP(2) * (p.size || 1), x = p.x * W.w, y = gY(2, p.x) + 1 + h * 0.02;
    ctx.globalAlpha = p.a;
    const st = [[-0.2, 0.06, 0.13, 0.08], [0.02, 0.06, 0.14, 0.08], [0.22, 0.06, 0.11, 0.07], [-0.1, 0.16, 0.12, 0.07], [0.12, 0.16, 0.11, 0.07], [0.0, 0.25, 0.1, 0.06]];
    for (let i = 0; i < st.length; i++) {
      const s = st[i], k = ((i * 37 + p.seed) % 7) / 7 - 0.4;
      ctx.fillStyle = css([150 + k * 26, 142 + k * 24, 130 + k * 22], l);
      ctx.beginPath(); ctx.ellipse(x + s[0] * h, y - s[1] * h, s[2] * h, s[3] * h, 0, 0, TAU); ctx.fill();
    }
    if (LV.ecSnow > 0.05) { ctx.fillStyle = rgba(snowCol(0), LV.ecSnow * 0.85 * p.a); ctx.beginPath(); ctx.ellipse(x, y - 0.3 * h, 0.12 * h, 0.035 * h, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  // 石头：抛掷在田里的，堆聚起来成一堆（3:5）
  function drawStones(ctx, p) {
    const l = 2, h = hP(2), x = p.x * W.w, y = gY(2, p.x) + 1;
    ctx.globalAlpha = p.a;
    const n = Math.round(p.grow * 14);
    for (let i = 0; i < n; i++) {
      const row = i < 6 ? 0 : i < 10 ? 1 : i < 13 ? 2 : 3, idx = row === 0 ? i : row === 1 ? i - 6 : row === 2 ? i - 10 : 0, cnt = [6, 4, 3, 1][row];
      const sx = x + (idx - (cnt - 1) / 2) * h * 0.13, sy = y - row * h * 0.09 - h * 0.04, k = (i * 29 % 7) / 7 - 0.4;
      ctx.fillStyle = css([148 + k * 30, 140 + k * 26, 128 + k * 22], l);
      ctx.beginPath(); ctx.ellipse(sx, sy, h * 0.075, h * 0.05, 0, 0, TAU); ctx.fill();
    }
    // 散在田里的石头
    if (p.k2 > 0.02) {
      for (let i = 0; i < 9; i++) {
        const xf = lerp(X('f0'), X('f1'), 0.1 + 0.8 * hsh(i * 3 + 1)), v = 0.05 + 0.22 * hsh(i * 7 + 2), k = (i * 31 % 5) / 5 - 0.4;
        ctx.fillStyle = css([150 + k * 26, 142 + k * 24, 130 + k * 22], l, p.k2);
        ctx.beginPath(); ctx.ellipse(xf * W.w, baseY(2, xf, v), h * 0.06 * (1 + v), h * 0.035 * (1 + v), 0, 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  // 饼与酒（2:24、9:7）
  function drawMeal(ctx, p) {
    const l = 2, h = hP(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([226, 214, 186], l);
    ctx.beginPath(); ctx.ellipse(x, y, h * 0.46, h * 0.09, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([176, 126, 70], l, 1, 0.05);
    ctx.beginPath(); ctx.ellipse(x - h * 0.16, y - h * 0.03, h * 0.1, h * 0.05, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + h * 0.02, y - h * 0.035, h * 0.08, h * 0.045, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([132, 44, 58], l);
    ctx.fillRect(x + h * 0.17, y - h * 0.12, h * 0.07, h * 0.1);
    ctx.fillStyle = css(CLAY, l);
    ctx.beginPath(); ctx.ellipse(x + h * 0.32, y - h * 0.07, h * 0.05, h * 0.07, 0, 0, TAU); ctx.fill();
    if (p.lit > 0.02 && SP) { ctxA = ctx; ctx.globalCompositeOperation = 'lighter'; glowAt(SP.gold, x, y - h * 0.2, h * 1.2, p.lit * 0.35 * p.a); ctx.globalCompositeOperation = 'source-over'; }
    ctx.globalAlpha = 1;
  }
  function drawFire(ctx, p) {
    const h = hP(2), x = p.x * W.w, y = baseY(2, p.x, p.v);
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([60, 44, 34], 2);
    ctx.fillRect(x - h * 0.2, y - h * 0.04, h * 0.4, h * 0.05);
    flame(ctx, x, y - h * 0.02, h * 0.42 * (0.4 + 0.6 * p.fire), p.fire * p.a, 7.7);
    ctx.globalAlpha = 1;
  }
  function drawBasket(ctx, p) {
    const h = hP(2), x = p.x * W.w, y = baseY(2, p.x, p.v), l = 2;
    ctx.globalAlpha = p.a;
    if (p.k > 0.02) {
      ctx.fillStyle = css([222, 176, 100], l, 1, 0.15);
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.ellipse(x + (i - 2) * h * 0.07, y - h * 0.2 - (i % 2) * h * 0.04 * p.k, h * 0.07, h * 0.045, 0, 0, TAU); ctx.fill(); }
      if (SP) { ctxA = ctx; ctx.globalCompositeOperation = 'lighter'; glowAt(SP.gold, x, y - h * 0.22, h * 0.7, p.k * 0.3); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = p.a; }
    }
    ctx.fillStyle = css([160, 120, 70], l);
    ctx.beginPath(); ctx.moveTo(x - h * 0.2, y - h * 0.2); ctx.lineTo(x + h * 0.2, y - h * 0.2); ctx.lineTo(x + h * 0.15, y); ctx.lineTo(x - h * 0.15, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([110, 80, 46], l, 0.8);
    ctx.lineWidth = Math.max(0.5, h * 0.015);
    ctx.beginPath(); for (let i = 1; i < 4; i++) { const yy = y - h * 0.05 * i; ctx.moveTo(x - h * (0.15 + 0.0125 * i), yy); ctx.lineTo(x + h * (0.15 + 0.0125 * i), yy); } ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function drawBundle(ctx, p) {
    const h = hP(2), x = p.x * W.w, y = baseY(2, p.x, p.v), l = 2;
    ctx.globalAlpha = p.a;
    ctx.fillStyle = css([150, 118, 80], l);
    ctx.beginPath(); ctx.ellipse(x, y - h * 0.1, h * 0.2, h * 0.12, 0.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = css([96, 70, 46], l); ctx.lineWidth = Math.max(0.6, h * 0.02);
    ctx.beginPath(); ctx.moveTo(x - h * 0.02, y - h * 0.22); ctx.lineTo(x + h * 0.03, y + h * 0.01); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天与地之间：虚空的雾、日行之弧与星轨、风、江河与水汽、雪、落叶、云影、雨云……
  // ════════════════════════════════════════════════════════════
  const MIST = [], STARS = [], FLAKES = [], LEAVES = [];
  (function seeds() {
    for (let i = 0; i < 11; i++) MIST.push({ x0: hsh(i + 1), y: 0.5 + 0.4 * hsh(i + 20), sp: 0.4 + hsh(i + 40), w: 0.18 + 0.22 * hsh(i + 60), h: 0.018 + 0.03 * hsh(i + 80), ph: hsh(i + 90) * TAU });
    for (let i = 0; i < 90; i++) STARS.push({ r: 0.22 + 1.15 * Math.pow(hsh(i + 200), 0.8), ph: hsh(i + 300), a: 0.25 + 0.55 * hsh(i + 400), c: hsh(i + 500) < 0.2 ? [255, 226, 180] : [226, 234, 255] });
    for (let i = 0; i < 170; i++) FLAKES.push({ x: hsh(i + 600), y: hsh(i + 700), v: 0.6 + hsh(i + 800), s: 0.7 + 1.4 * hsh(i + 900), ph: hsh(i + 1000) * TAU });
    for (let i = 0; i < 46; i++) LEAVES.push({ x: hsh(i + 1100), y: hsh(i + 1200), v: 0.5 + hsh(i + 1300), ph: hsh(i + 1400) * TAU, c: [[222, 150, 56], [200, 96, 48], [236, 188, 84], [176, 70, 44]][i % 4] });
  })();
  const TRAIL = { len: 0, last: null };

  function drawMist(ctx) {
    const k = LV.ecMist;
    if (k < 0.01 || !SP) return;
    ctxA = ctx;
    const day = 0.35 + 0.65 * W.daylight;
    for (let i = 0; i < MIST.length; i++) {
      const m = MIST[i];
      const span = W.w * 1.8;
      const x = ((m.x0 * span + W.t * m.sp * W.w * 0.012) % span) - W.w * 0.4;
      const y = m.y * W.h + Math.sin(W.t * 0.2 + m.ph) * W.h * 0.01;
      const rx = m.w * W.w * (port() ? 1.6 : 1), ry = m.h * W.h;
      glowAt(SP.mist, x, y, rx, k * 0.36 * day * (0.7 + 0.3 * Math.sin(W.t * 0.3 + m.ph)), ry / rx);
    }
    ctx.globalAlpha = 1;
  }

  function sunAt(tod, r) { const a = (tod - 0.25) * TAU, q = r || 1; return [(0.5 - 0.46 * q * Math.cos(a)) * W.w, (W.HZ - Math.sin(a) * 0.47 * q) * W.h]; }
  function drawArc(ctx) {
    const k = LV.ecArc;
    if (k < 0.01) return;
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const vis = k * (0.4 + 0.45 * W.dusk + 0.5 * W.night + 0.25 * W.daylight);
    for (const [wd, al] of [[18, 0.03], [7, 0.07], [1.7, 0.34]]) {
      ctx.strokeStyle = U.rgba(255, 222, 160, clamp(al * vis, 0, 1));
      ctx.lineWidth = wd * u;
      ctx.beginPath();
      for (let i = 0; i <= 56; i++) { const p = sunAt(0.25 + (0.5 * i) / 56); if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    // 十二个时辰的刻度
    ctx.fillStyle = U.rgba(255, 236, 200, clamp(0.55 * vis, 0, 1));
    for (let i = 1; i < 12; i++) { const p = sunAt(0.25 + (0.5 * i) / 12); ctx.beginPath(); ctx.arc(p[0], p[1], 1.6 * u, 0, TAU); ctx.fill(); }
    // 日头出来，日头落下：一日的几个时辰，日头的残影沿着弧一字排开（像一张多次曝光的相）
    if (SP) {
      ctxA = ctx;
      const gA = k * (0.22 + 0.3 * W.dusk + 0.16 * W.daylight) * (1 - 0.6 * W.night);
      for (let i = 0; i < 9; i++) {
        const p = sunAt(0.27 + (0.46 * i) / 8);
        glowAt(SP.gold, p[0], p[1], 24 * u, gA * 0.7);
        ctx.fillStyle = U.rgba(255, 242, 212, clamp(gA * 1.1, 0, 1));
        ctx.beginPath(); ctx.arc(p[0], p[1], 6.5 * u, 0, TAU); ctx.fill();
      }
      // 急归所出之地：时辰飞转时，日头后面拖出一道光
      const L = TRAIL.len;
      if (L > 0.05 && W.sun.elev > -0.08) {
        const td = W.tod, span = Math.min(0.25, L / TAU) * 1.3, n = 14;
        let prev = sunAt(td - span);
        for (let i = 1; i <= n; i++) {
          const f = i / n, q = sunAt(td - span * (1 - f));
          ctx.strokeStyle = U.rgba(255, 236, 190, clamp(k * 0.55 * f * f * smoothstep(0.05, 0.3, L), 0, 1));
          ctx.lineWidth = (3 + 13 * f) * u;
          ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
          prev = q;
        }
      }
      ctx.globalAlpha = 1;
    }
    // 夜里众星的轨迹（与日同行，绕着同一个中心）
    const L = TRAIL.len, nk = W.night * k * smoothstep(0.03, 0.25, L);
    if (nk > 0.02) {
      ctx.lineWidth = Math.max(0.7, 1.05 * u);
      const hz = W.HZ * W.h;
      for (let i = 0; i < STARS.length; i++) {
        const s = STARS[i], a1 = (W.tod + s.ph - 0.25) * TAU, a0 = a1 - L * (0.7 + 0.3 * s.a);
        ctx.strokeStyle = U.rgba(s.c[0], s.c[1], s.c[2], clamp(nk * s.a * 0.8, 0, 1));
        ctx.beginPath();
        let on = false;
        for (let j = 0; j <= 7; j++) {
          const a = lerp(a0, a1, j / 7), x = (0.5 - 0.46 * s.r * Math.cos(a)) * W.w, y = hz - Math.sin(a) * 0.47 * s.r * W.h;
          if (y > hz - 2) { on = false; continue; }
          if (on) ctx.lineTo(x, y); else { ctx.moveTo(x, y); on = true; }
        }
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 风往南刮，又向北转：几条风的带子沿着椭圆的回路不住地旋转
  function drawWind(ctx) {
    const k = LV.ecWind;
    if (k < 0.01) return;
    const u = SU(), day = 0.35 + 0.65 * W.daylight;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const cx = W.w * (port() ? 0.55 : 0.6) + Math.sin(i * 1.7) * W.w * 0.05, cy = W.h * (0.3 + 0.045 * (i % 3)) + (port() ? W.h * 0.1 : 0);
      const rx = W.w * (port() ? 0.44 : 0.3 + 0.03 * i), ry = W.h * (0.06 + 0.018 * i), tilt = -0.1 + 0.05 * (i % 3);
      const head = W.t * (0.5 + 0.08 * i) + i * 1.3, span = 1.5, NS = 16;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      let px = null, py = null;
      for (let s = 0; s <= NS; s++) {
        const th = head - span * (1 - s / NS), ex = Math.cos(th) * rx, ey = Math.sin(th) * ry;
        const x = cx + ex * ct - ey * st, y = cy + ex * st + ey * ct;
        if (px != null) {
          const f = s / NS, front = 0.55 + 0.45 * Math.sin(th);
          ctx.strokeStyle = U.rgba(236, 242, 255, clamp(k * 0.42 * f * f * front * day, 0, 1));
          ctx.lineWidth = (0.6 + 2.2 * f * front) * u;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
        }
        px = x; py = y;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 江河都往海里流，海却不满；江河从何处流，仍归还何处——一条光的回路
  let CYC = null;
  function cycleLUT() {
    const key = W.w + 'x' + W.h;
    if (CYC && CYC.key === key) return CYC;
    const ctl = [];
    const riv = [0.99, 0.95, 0.9, 0.84, 0.77, 0.7, 0.62, 0.55, 0.48, 0.42, 0.37];
    riv.forEach((xf, i) => ctl.push([xf * W.w, baseY(2, xf, 0.1 + 0.08 * Math.sin(i * 1.3)) ]));
    const nR = ctl.length;
    ctl.push([0.3 * W.w, 0.92 * W.h], [0.22 * W.w, 0.78 * W.h], [0.17 * W.w, 0.6 * W.h], [0.2 * W.w, 0.36 * W.h], [0.36 * W.w, 0.2 * W.h],
      [0.62 * W.w, 0.15 * W.h], [0.86 * W.w, 0.2 * W.h], [0.98 * W.w, 0.36 * W.h], [1.02 * W.w, 0.55 * W.h]);
    // Catmull-Rom → 折线
    const pts = [];
    let riverEnd = 0;
    for (let i = 0; i < ctl.length - 1; i++) {
      const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
      for (let j = 0; j < 8; j++) {
        const t = j / 8, t2 = t * t, t3 = t2 * t;
        pts.push([0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)]);
      }
      if (i === nR - 1) riverEnd = pts.length;
    }
    pts.push(ctl[ctl.length - 1]);
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    CYC = { key, pts, cum, L: cum[cum.length - 1], uR: cum[Math.min(riverEnd, cum.length - 1)] / cum[cum.length - 1], riverEnd };
    return CYC;
  }
  function cycAt(u, out) {
    const R = cycleLUT(), d = U.fract(u) * R.L, c = R.cum;
    let lo = 0, hi = c.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (c[m] <= d) lo = m; else hi = m; }
    const f = (d - c[lo]) / Math.max(1e-6, c[hi] - c[lo]), a = R.pts[lo], b = R.pts[hi];
    out[0] = lerp(a[0], b[0], f); out[1] = lerp(a[1], b[1], f);
    return out;
  }
  const PT = [0, 0];
  function drawCycle(ctx) {
    const k = LV.ecCycle;
    if (k < 0.01) return;
    const R = cycleLUT(), u = SU(), vis = 0.45 + 0.55 * Math.max(W.daylight * 0.6, nightK());
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // 河：顺着地势流向海
    for (const [wd, al] of [[9, 0.05], [3.2, 0.12], [1.1, 0.4]]) {
      ctx.strokeStyle = U.rgba(214, 232, 255, clamp(al * k * vis, 0, 1));
      ctx.lineWidth = wd * u;
      ctx.beginPath();
      for (let i = 0; i <= R.riverEnd; i++) { const p = R.pts[i]; if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }
      ctx.stroke();
    }
    // 流动的水与升起的水汽
    const n = 120;
    for (let i = 0; i < n; i++) {
      const uu = U.fract(W.t * 0.028 + i / n + hsh(i) * 0.004);
      cycAt(uu, PT);
      const river = uu < R.uR;
      const j = river ? 0 : Math.sin(W.t * 1.3 + i) * 6 * u;
      const s = river ? 1.5 * u : (2 + 1.2 * hsh(i + 7)) * u;
      const a = k * vis * (river ? 0.85 : 0.48) * (0.6 + 0.4 * Math.sin(W.t * 3 + i));
      ctx.fillStyle = river ? U.rgba(236, 244, 255, clamp(a, 0, 1)) : U.rgba(206, 222, 255, clamp(a, 0, 1));
      ctx.fillRect(PT[0] + j - s / 2, PT[1] - s / 2, s, s);
    }
    // 中丘上的一条小河
    const m0 = 0.97, m1 = 0.5;
    for (let i = 0; i < 36; i++) {
      const uu = U.fract(W.t * 0.05 + i / 36), xf = lerp(m0, m1, uu), y = baseY(1, xf, 0.15 + 0.1 * Math.sin(uu * 9));
      ctx.fillStyle = U.rgba(226, 238, 255, clamp(k * vis * 0.6 * Math.sin(Math.PI * uu), 0, 1));
      ctx.fillRect(xf * W.w - 0.8 * u, y - 0.8 * u, 1.6 * u, 1.6 * u);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 雪的颜色：白天是白，夜里映着月光发蓝
  function snowCol(dep) { return mix(W.shade([236, 242, 252], dep || 0, 0.3), [170, 190, 228], nightK() * 0.62); }
  // 冬雪：地上一层白，屋顶与枝上也有
  function drawSnowGround(ctx, l) {
    const k = LV.ecSnow;
    if (k < 0.01) return;
    const sp = W.landSpan(l);
    if (!sp) return;
    const x0 = sp[0], x1 = Math.min(W.w + 2, sp[1] + 2), n = 50;
    const col = snowCol(DEP(l));
    const bottom = l === 2 ? W.h + 2 : W.waterlineY(l) + 1;
    let top = W.h;
    for (let i = 0; i <= n; i++) top = Math.min(top, gY(l, lerp(x0, x1, i / n) / W.w));
    const g = ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, rgba(col, 0.78 * k)); g.addColorStop(0.35, rgba(col, 0.55 * k)); g.addColorStop(1, rgba(col, 0.4 * k));
    ctx.fillStyle = g;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); const y = gY(l, x / W.w) - 0.6; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    ctx.lineTo(x1, bottom); ctx.lineTo(x0, bottom); ctx.closePath(); ctx.fill();
  }
  function drawFlakes(ctx) {
    const k = W.lt.ecSnow > 0.5 ? LV.ecSnow : LV.ecSnow * 0.2;
    if (k < 0.02) return;
    const u = SU();
    ctx.fillStyle = rgba(mix(snowCol(0), [255, 255, 255], 0.3), 0.9 * k);
    for (let i = 0; i < FLAKES.length; i++) {
      const f = FLAKES[i];
      const y = ((f.y * 1.1 + W.t * f.v * 0.035) % 1.1) * W.h - 0.05 * W.h;
      const x = ((f.x + W.t * 0.006 + Math.sin(W.t * 0.8 + f.ph) * 0.006) % 1) * W.w;
      const s = f.s * u;
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    }
  }
  function drawLeaves(ctx) {
    const k = LV.ecLeaf;
    if (k < 0.02) return;
    const u = SU(), h = hP(2);
    for (let i = 0; i < LEAVES.length; i++) {
      const f = LEAVES[i];
      const yq = (f.y + W.t * f.v * 0.045) % 1;
      const x = (lerp(0.42, 1.0, f.x) + Math.sin(W.t * 1.2 + f.ph) * 0.012 - yq * 0.06) * W.w;
      const y = lerp(0.42, 1.0, yq) * W.h;
      ctx.fillStyle = rgba(W.shade(f.c, 0, 0.1), k * 0.9 * Math.min(1, (1 - yq) * 4));
      ctx.beginPath(); ctx.ellipse(x, y, h * 0.04 + u, h * 0.02 + 0.5 * u, W.t * 2 + f.ph, 0, TAU); ctx.fill();
    }
  }
  // 如影儿经过：云影掠过大地
  function drawShade(ctx, l) {
    const k = LV.ecShade;
    if (k < 0.01 || !SP) return;
    ctxA = ctx;
    for (let i = 0; i < 3; i++) {
      const xq = ((i * 0.47 + W.t * 0.03) % 1.5) - 0.25;
      const x = (1.1 - xq) * W.w, y = l === 2 ? gY(2, clamp(x / W.w, 0, 1)) + W.h * 0.07 : gY(1, clamp(x / W.w, 0, 1)) + W.h * 0.015;
      glowAt(SP.dark, x, y, W.w * (l === 2 ? 0.2 : 0.12), k * (l === 2 ? 0.34 : 0.26), l === 2 ? 0.35 : 0.2);
    }
    ctx.globalAlpha = 1;
  }
  // 患难的日子：一片带雨的云
  const CLOUD_B = [[-0.78, 0.08, 0.3], [-0.55, 0.0, 0.4], [-0.3, -0.12, 0.46], [-0.02, -0.2, 0.52], [0.28, -0.14, 0.48], [0.55, -0.02, 0.42], [0.8, 0.08, 0.3], [-0.4, 0.12, 0.38], [0.0, 0.12, 0.44], [0.4, 0.12, 0.4]];
  function stormGeo() { const R = W.w * (port() ? 0.36 : 0.19); return { x: lerp(port() ? 0.25 : 0.2, port() ? 0.72 : 0.76, LV.ecCloud) * W.w, y: W.h * (port() ? 0.33 : 0.3), R }; }
  function drawStormCloud(ctx) {
    const a = LV.ecRainA;
    if (a < 0.01 || !SP) return;
    const g = stormGeo();
    ctxA = ctx;
    for (const b of CLOUD_B) glowAt(SP.cloud, g.x + b[0] * g.R, g.y + b[1] * g.R, b[2] * g.R, a * 0.9, 0.5);
    ctx.globalCompositeOperation = 'lighter';
    for (const b of CLOUD_B) if (b[1] < 0.05) glowAt(SP.white, g.x + b[0] * g.R, g.y + (b[1] - 0.1) * g.R, b[2] * g.R * 0.75, a * 0.16 * (0.3 + 0.7 * W.daylight), 0.36);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawRain(ctx) {
    const a = LV.ecRainA;
    if (a < 0.01) return;
    const g = stormGeo(), u = SU();
    const y0 = g.y + g.R * 0.1;
    // 云下的暗
    const sh = ctx.createLinearGradient(g.x - g.R, 0, g.x + g.R, 0);
    sh.addColorStop(0, 'rgba(20,24,36,0)'); sh.addColorStop(0.5, U.rgba(20, 24, 36, 0.2 * a)); sh.addColorStop(1, 'rgba(20,24,36,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(g.x - g.R, y0, g.R * 2, W.h - y0);
    ctx.strokeStyle = U.rgba(200, 212, 230, 0.32 * a * (0.4 + 0.6 * W.daylight));
    ctx.lineWidth = Math.max(0.6, 0.9 * u);
    ctx.beginPath();
    for (let i = 0; i < 90; i++) {
      const xq = hsh(i + 2000) * 1.5 - 0.75, sp = 0.9 + hsh(i + 2100) * 0.5;
      const yq = (hsh(i + 2200) + W.t * sp * 1.1) % 1;
      const x = g.x + xq * g.R, y = y0 + yq * (W.h - y0), len = W.h * 0.04;
      ctx.moveTo(x, y); ctx.lineTo(x - len * 0.18, y + len);
    }
    ctx.stroke();
  }
  // 神在天上：光柱落在殿上
  function drawHeaven(ctx) {
    const k = LV.ecHeaven;
    if (k < 0.01 || !SP) return;
    ctxA = ctx;
    const t = templeTop(), w = Math.max(W.w * 0.07, hP(1) * 3.4);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * (0.5 + 0.25 * nightK()), 0, 1);
    ctx.drawImage(SP.beam, t[0] - w / 2, -20, w, t[1] + 20 + hP(1) * 0.6);
    glowAt(SP.gold, t[0], t[1] + hP(1) * 0.5, hP(1) * 3, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 永生安置在世人心里：心口一点温暖的光
  const HEARTS = ['preacher', 'gB2', 'gC1', 'gC2', 'gD1', 'gE1', 'lone'];
  function drawHeart(ctx) {
    const k = LV.ecHeart;
    if (k < 0.01 || !SP) return;
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < HEARTS.length; i++) {
      const f = fig(HEARTS[i]);
      if (!f || !f._vis || f.dying) continue;
      const p = ptOf(HEARTS[i], 0.62);
      if (!p) continue;
      const pulse = 0.8 + 0.2 * Math.sin(W.t * 2 + i * 1.7);
      glowAt(SP.gold, p[0], p[1], p[2] * 0.42, k * 0.55 * pulse * (f.alpha == null ? 1 : f.alpha));
      ctx.fillStyle = rgba([255, 244, 214], k * 0.8 * pulse);
      ctx.fillRect(p[0] - 1.2, p[1] - 1.2, 2.4, 2.4);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 三股合成的绳子：三股光自三人心口升起，在他们头上拧成一根，直升上去
  function drawRope(ctx) {
    const k = LV.ecRope;
    if (k < 0.01 || !S.rope || !SP) return;
    const pts = S.rope.map(id => ptOf(id, 0.62)).filter(Boolean);
    if (pts.length < 3) return;
    const hh = pts[0][2], u = SU();
    const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3, top0 = Math.min(pts[0][1], pts[1][1], pts[2][1]) - hh * 0.55;
    const H = hh * (0.8 + 2.6 * U.easeOut(k)), amp = hh * 0.1, turns = 3.2;
    const COL = [[255, 214, 140], [214, 228, 255], [255, 178, 164]];
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    glowAt(SP.gold, cx, top0 - H * 0.35, hh * 1.1, 0.22 * k, 1.4);
    for (const [wd, al] of [[6, 0.18], [2.3, 0.95]]) {
      for (let s = 0; s < 3; s++) {
        const p = pts[s];
        ctx.strokeStyle = rgba(COL[s], al * k);
        ctx.lineWidth = wd * u;
        ctx.beginPath();
        ctx.moveTo(p[0], p[1]);
        // 自心口到头上汇合
        const ph0 = (s * TAU) / 3 + W.t * 1.4;
        ctx.quadraticCurveTo(p[0], top0 + hh * 0.1, cx + Math.sin(ph0) * amp, top0);
        for (let i = 1; i <= 36; i++) {
          const t = i / 36, fade = 1 - t * 0.35;
          const x = cx + Math.sin(ph0 + t * turns * TAU) * amp * fade, y = top0 - t * H;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    // 绳梢化入光中
    glowAt(SP.white, cx, top0 - H, hh * 0.35, 0.5 * k);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 夜里寻查的灯（8:16–17）
  function drawLamp(ctx) {
    const k = LV.ecLamp;
    if (k < 0.01 || !SP) return;
    const f = fig('preacher');
    if (!f || !f._vis) return;
    const p = ptOf('preacher', 0.5);
    const d = f.fd || f.facing || 1, x = p[0] + d * p[2] * 0.2, y = p[1];
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(SP.lamp, x, y, p[2] * 1.6, k * (0.35 + 0.55 * nightK()));
    glowAt(SP.warm, x, y - p[2] * 0.05, p[2] * 0.3, k * 0.9);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = css(CLAY, 2, k);
    ctx.beginPath(); ctx.ellipse(x, y + p[2] * 0.02, p[2] * 0.07, p[2] * 0.03, 0, 0, TAU); ctx.fill();
  }
  // 粮食撒在水面：出去，漂进海上的光里；日久，化作满海的金光回来
  function breadHome() { const xf = X('shore'); return [xf * W.w, gY(2, xf)]; }
  function drawBread(ctx) {
    const ph = LV.ecBread;
    if (ph < 0.005 || ph > 0.999 || !SP) return;
    const u = SU(), h = hP(2), H = breadHome();
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    if (ph < 0.5) {
      const e = ph / 0.5;
      for (let i = 0; i < 7; i++) {
        const t = clamp(e * 1.35 - i * 0.05, 0, 1);
        if (t <= 0) continue;
        const land = [H[0] - (0.035 + 0.018 * i) * W.w, W.h * (0.89 + 0.014 * (i % 3))], far = [(0.1 + 0.032 * i) * W.w, W.h * (0.64 + 0.005 * i)];
        let x, y, s;
        if (t < 0.12) { const q = t / 0.12; x = lerp(H[0] - h * 0.2, land[0], q); y = lerp(H[1] - h * 0.55, land[1], q) - Math.sin(q * Math.PI) * h * 0.6; s = 1; }
        else { const q = Math.pow((t - 0.12) / 0.88, 1.6); x = lerp(land[0], far[0], q); y = lerp(land[1], far[1], q) + Math.sin(W.t * 1.4 + i) * 1.4 * u; s = lerp(1, 0.3, q); }
        const a = 1 - smoothstep(0.78, 1, t);
        glowAt(SP.gold, x, y, h * 0.42 * s, a * 0.6);
        // 水面上的一道倒影
        glowAt(SP.gold, x, y + h * 0.12 * s, h * 0.3 * s, a * 0.3, 0.25);
        ctx.fillStyle = rgba([255, 220, 150], a);
        ctx.beginPath(); ctx.ellipse(x, y, h * 0.1 * s + 0.8, h * 0.05 * s + 0.5, 0, 0, TAU); ctx.fill();
      }
    } else {
      const e = (ph - 0.5) / 0.5;
      for (let i = 0; i < 24; i++) {
        const t = clamp(e * 1.3 - i * 0.012, 0, 1);
        if (t <= 0) continue;
        const from = [(0.04 + 0.34 * hsh(i + 3000)) * W.w, W.h * (0.625 + 0.02 * hsh(i + 3100))];
        const to = [H[0] + (hsh(i + 3200) - 0.6) * h * 0.5, H[1] - h * 0.1];
        const q = U.easeInOut(t);
        const x = lerp(from[0], to[0], q), y = lerp(from[1], to[1], q) + Math.sin(q * Math.PI) * W.h * 0.04 + Math.sin(W.t * 2 + i) * u;
        const s = lerp(0.3, 1, q), a = smoothstep(0, 0.1, t) * (1 - smoothstep(0.9, 1, t));
        glowAt(SP.gold, x, y, h * 0.3 * s, a * 0.5);
        ctx.fillStyle = rgba([255, 226, 160], a);
        ctx.fillRect(x - 1.3 * s * u, y - 1.3 * s * u, 2.6 * s * u, 2.6 * s * u);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 灵仍归于赐灵的神：一点光自他躺下之处升上高天
  function drawSpirit(ctx) {
    const k = LV.ecSpirit;
    if (k < 0.003 || k > 0.999 || !SP) return;
    const x0 = S.spX * W.w, y0 = gY(2, S.spX) - hP(2) * 0.3, y1 = W.h * (port() ? 0.3 : 0.06);
    const e = U.easeInOut(k), x = x0 + Math.sin(k * 5) * hP(2) * 0.3 * (1 - k), y = lerp(y0, y1, e);
    const a = smoothstep(0, 0.06, k) * (1 - smoothstep(0.8, 1, k)), u = SU();
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= 6; i++) { const kk = Math.max(0, k - i * 0.02), ee = U.easeInOut(kk); glowAt(SP.pale, x0 + Math.sin(kk * 5) * hP(2) * 0.3 * (1 - kk), lerp(y0, y1, ee), 8 * u, a * 0.2 * (1 - i / 7)); }
    glowAt(SP.white, x, y, 26 * u, a * 0.75);
    glowAt(SP.gold, x, y, 60 * u, a * 0.25);
    ctx.fillStyle = rgba([255, 255, 255], a);
    ctx.beginPath(); ctx.arc(x, y, 2.2 * u, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 末了的金光：日出的光铺满全地
  function drawGlory(ctx) {
    const k = LV.ecGlory;
    if (k < 0.01 || !SP) return;
    ctxA = ctx;
    ctx.globalCompositeOperation = 'lighter';
    const sx = clamp(W.sun.x, 0, W.w), sy = Math.min(W.sun.y, W.horizonY);
    glowAt(SP.gold, sx, sy, M() * 0.9, k * 0.22, 0.6);
    glowAt(SP.gold, W.w * 0.75, W.h * 0.8, W.w * 0.45, k * 0.12, 0.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawTransients(ctx) {
    if (!FXL.length || !SP) return;
    ctxA = ctx;
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      if (e.type === 'beam') {
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.55, 1, q));
        const x = e.xf * W.w, y = baseY(e.l, e.xf, e.v) + 4;
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = env * e.k * (0.4 + 0.3 * nightK());
        ctx.drawImage(SP.beam, x - e.w / 2, -30, e.w, y + 34);
        glowAt(SP.gold, x, y - e.w * 0.3, e.w * 1.6, env * e.k * 0.45);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const DRAW = { city: drawCity, house: drawHouse, well: drawWell, field: drawField, works: drawWorks, almond: drawAlmond, cairn: drawCairn,
    stones: drawStones, meal: drawMeal, fire: drawFire, basket: drawBasket, bundle: drawBundle };
  const LAYER_OF_PASS = { far: 0, mid: 1, near: 2 };
  function resetScene() { P.clear(); FXL.length = 0; sorted = []; sortedN = -1; S = fresh(); millA = 0; wheelA = 0; TRAIL.len = 0; TRAIL.last = null; }
  const SCENE = {
    init() { sprites(); },
    resize() { CITY = null; FG = null; AG = null; CYC = null; },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (const [id, p] of P) {
        for (const k in EASE) {
          const tg = k === 'a' ? p.ta : p['t' + k];
          if (p[k] !== tg) p[k] = approachLin(p[k], tg, EASE[k] * f);
        }
        if (p.dying && p.a < 0.01) { P.delete(id); sortedN = -1; }
      }
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      // 磨的把手、井上的水轮（只为画）
      const hs = getP('house'), wl = getP('well');
      if (hs) millA += f * 2.2 * hs.k2;
      if (wl) wheelA += f * 0.7 * (1 - wl.k) * (0.3 + 0.7 * LV.ecWind + 0.4 * LV.ecCycle);
      // 星轨的长短随时辰流转的快慢
      const clk = W.clock;
      if (TRAIL.last != null && dt > 0) {
        const rate = Math.abs(clk - TRAIL.last) / dt;
        TRAIL.len = U.approach(TRAIL.len, clamp(rate * TAU * 1.4, 0, 1.2), 3, dt);
      }
      TRAIL.last = clk;
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      ctxA = ctx;
      if (pass === 'sky') { U.safe('ec.arc', () => drawArc(ctx)); U.safe('ec.cloud', () => drawStormCloud(ctx)); return; }
      if (pass === 'air') {
        U.safe('ec.mist', () => drawMist(ctx));
        U.safe('ec.wind', () => drawWind(ctx));
        U.safe('ec.cycle', () => drawCycle(ctx));
        U.safe('ec.rain', () => drawRain(ctx));
        U.safe('ec.leaves', () => drawLeaves(ctx));
        U.safe('ec.flakes', () => drawFlakes(ctx));
        U.safe('ec.heart', () => drawHeart(ctx));
        U.safe('ec.rope', () => drawRope(ctx));
        U.safe('ec.lamp', () => drawLamp(ctx));
        U.safe('ec.bread', () => drawBread(ctx));
        U.safe('ec.glory', () => drawGlory(ctx));
        U.safe('ec.fxl', () => drawTransients(ctx));
        return;
      }
      if (pass === 'top') { U.safe('ec.spirit', () => drawSpirit(ctx)); return; }
      const l = LAYER_OF_PASS[pass];
      if (l == null) return;
      U.safe('ec.snow', () => drawSnowGround(ctx, l));
      if (l === 1) U.safe('ec.heaven', () => drawHeaven(ctx));
      if (l >= 1) U.safe('ec.shade', () => drawShade(ctx, l));
      for (const p of sortProps()) {
        if (p.layer !== l || p.a < 0.005) continue;
        const fn = DRAW[p.kind];
        if (fn) U.safe('ec.' + p.kind, () => fn(ctx, p));
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    },
    draw() {},
    reset() { P.clear(); FXL.length = 0; sortedN = -1; },
    restore() {
      for (const [id, p] of P) { if (p.dying) { P.delete(id); continue; } p.a = p.ta; snap(p); }
      sortedN = -1;
      FXL.length = 0;
      TRAIL.len = 0; TRAIL.last = null;
    },
    // 看完与恢复是否一致（走查工具比较它）
    sig() {
      const out = {};
      const r2 = v => Math.round(v * 100) / 100;
      for (const p of P.values()) if (!p.dying) out[p.id] = [p.kind, r2(p.x), r2(p.x0), r2(p.x1), p.ta, r2(p.tgrow), r2(p.tgold), r2(p.treap), r2(p.tk), r2(p.tk2), r2(p.tfire), r2(p.tlit), p.label].join('|');
      return { props: out, bowl: S.bowl, rope: S.rope ? S.rope.join(',') : null, spX: r2(S.spX) };
    },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { if (!label || !isFinite(px) || !isFinite(py)) return; const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const h = hP(2), hm = hP(1);
      for (const p of P.values()) {
        if (p.a < 0.4) continue;
        if (p.kind === 'city') {
          const t = templeTop();
          consider('神的殿', t[0], t[1]);
          consider('耶路撒冷', lerp(p.x0, p.x1, 0.3) * W.w, gY(1, lerp(p.x0, p.x1, 0.3)) - hm * 1.2);
        } else if (p.kind === 'house') {
          const xf = houseX();
          consider('传道者的家', xf * W.w, gY(2, xf) - h * 1.6);
          const B = bowlPos();
          consider(S.bowl === 'hang' ? '金罐' : '破裂的金罐', B.x, S.bowl === 'hang' ? B.y : B.y0);
          const mp = millPos();
          consider('磨', mp.x, mp.y - h * 0.3);
        } else if (p.kind === 'well') {
          consider('井', p.x * W.w, gY(2, p.x) - h * 0.9);
        } else if (p.kind === 'field') {
          const xf = (p.x0 + p.x1) / 2; consider(p.label, xf * W.w, baseY(2, xf, 0.15) - h * 0.2);
        } else if (p.kind === 'works') {
          if (p.k > 0.5) continue;
          consider('葡萄园', lerp(p.x0, p.x1, 0.22) * W.w, baseY(2, lerp(p.x0, p.x1, 0.22), 0.1) - h * 0.5);
          consider('水池', lerp(p.x0, p.x1, 0.84) * W.w, baseY(2, lerp(p.x0, p.x1, 0.84), 0.2));
        } else if (p.kind === 'almond') {
          consider(p.label, p.x * W.w, gY(2, p.x) - h * 1.6);
        } else {
          consider(p.label, p.x * W.w, baseY(2, p.x, p.v) - h * 0.25);
        }
      }
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：日光之下，耶路撒冷，传道者的家
  // ════════════════════════════════════════════════════════════
  function graveX(i) { return X('almond') + ((hP(2) / Math.max(1, W.w)) * [-0.85, -0.3, 0.3, 0.85][i % 4]); }
  function setup() {
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 1, herbs: 0.6, trees: 0.2,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    for (const k of MY) W.set(k, 0, true);
    W.set('bare', 0.14, true); W.set('bloom', 0.55, true);
    W.freeClock = false;
    W.goTo(0.3, 0, true);
    W.setOrigin('grass', W.w * 0.8, W.ridgeBaseY(2, W.w * 0.8));
    W.setOrigin('herbs', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    W.setOrigin('trees', W.w * 0.31, W.ridgeBaseY(2, W.w * 0.31));
    const lx = W.w * 0.62, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 30, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 6, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    prop('city', 'city', { x0: X('city0'), x1: X('city1'), layer: 1, label: '耶路撒冷', k: 0, now: true });
    prop('field', 'field', { x0: X('f0'), x1: X('f1'), label: '田', grow: 0.08, gold: 0, reap: 0, now: true });
    prop('almond', 'almond', { x: X('almond'), label: '杏树', grow: 0.75, k: 0, gold: 0, now: true });
    prop('well', 'well', { x: X('well'), label: '井', k: 0, k2: 0, now: true });
    prop('house', 'house', { x: X('bench'), label: '传道者的家', k: 0, k2: 0, lit: 0.6, fire: 1, now: true });
    const c = C();
    c.clear({ fade: false });
    add('preacher', { label: '传道者', sex: 'm', age: 'elder', x: X('bench'), facing: -1, pose: 'seat', robe: ROBE.preacher, accent: [226, 190, 120], glow: 0.45, prop: 'staff' });
    add('gA1', { label: '老人', sex: 'm', age: 'elder', x: graveX(1) + 0.004, facing: -1, pose: 'stand', robe: ROBE.gA1, glow: 0.22 });
    add('gA2', { label: '老妇', sex: 'f', age: 'elder', x: graveX(2) + 0.006, facing: -1, pose: 'stand', robe: ROBE.gA2, glow: 0.22, prop: null });
    add('gB1', { label: '劳碌的人', sex: 'm', x: fld(0.55), facing: -1, pose: 'bow', robe: ROBE.gB1, glow: 0.25, prop: null });
    add('gB2', { label: '妇人', sex: 'f', x: fld(0.86), facing: -1, pose: 'stand', robe: ROBE.gB2, glow: 0.25 });
    add('gC1', { label: '孩童', sex: 'm', age: 'child', x: fld(0.95), facing: -1, pose: 'stand', robe: ROBE.gC1, glow: 0.3 });
    crowd('toil', { n: 2, x0: fld(0.12), x1: fld(0.4), label: '劳碌的人', pose: 'bow', glow: 0.1 }, men(CROWD_RB));
    cface('toil', -1);
    avoid([X('f0') - 0.03, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语（每一句话的故事约三十秒以内：经文一行显出 hold 秒，行与行之间约 1.3 秒）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:2–3 虚空的虚空 ─────────────────────────────────────
    {
      kind: 'judge', utter: '虚空的虚空，凡事都是虚空', cmd: 'du -sh 日光之下/*  # 0 · 虚空的虚空', ref: '1:2', tint: [214, 220, 236],
      verse: [
        { text: '传道者说：虚空的虚空，虚空的虚空，<br>凡事都是虚空。', ref: '传道书 1:2', hold: 6.5 },
        { text: '人一切的劳碌，就是他在日光之下的劳碌，<br>有什么益处呢？', ref: '传道书 1:3', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { lv('ecMist', 1, b); W.goTo(0.45, 13, b.instant); sfx(b, 'wind', { soft: true }); }],
          [0.8, () => { pose('preacher', 'stand'); face('preacher', -1); }],
          [2, b => {
            const cx = W.w * (port() ? 0.66 : 0.7), cy = W.h * (port() ? 0.46 : 0.34);
            word(b, '虚空', cx, cy, [236, 240, 250], () => [rnd(0.35, 1) * W.w, rnd(0.5, 0.9) * W.h, [220, 228, 244]], { hold: 2.6 });
          }],
          [4.5, () => { walk('preacher', X('bench') - 0.03, { speed: 0.012 }); }],
          [7.5, () => { pose('preacher', 'gaze'); face('preacher', -1); }],
          [8, () => { walk('gB1', fld(0.3), { speed: 0.006, pose: 'bow' }); cwalk('toil', fld(0.06), fld(0.24), { speed: 0.004, pose: 'bow' }); }],
          [11, b => lv('ecMist', 0.45, b)],
        ]);
      },
    },

    // ── 1:4–7 一代过去，一代又来；日头、风、江河（签名之景）──────
    {
      kind: 'act', utter: '一代过去，一代又来，地却永远长存', cmd: 'while :; do 日出; 日落; done  # 地却永远长存', ref: '1:4',
      verse: [
        { text: '一代过去，一代又来，地却永远长存。', ref: '传道书 1:4', hold: 6.5 },
        { text: '日头出来，日头落下，急归所出之地。', ref: '传道书 1:5', hold: 5.5 },
        { text: '风往南刮，又向北转，<br>不住地旋转，而且返回转行原道。', ref: '传道书 1:6', hold: 6.5 },
        { text: '江河都往海里流，海却不满；<br>江河从何处流，仍归还何处。', ref: '传道书 1:7', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            lv('ecMist', 0.18, b);
            W.passDay(6.8, b.instant);
            pose('preacher', 'stand'); face('preacher', -1);
            crowd('pass1', { n: 4, x0: 0.93, x1: 1.0, layer: 1, label: '行路的人', glow: 0.06 }, folk(CROWD_RB));
            cwalk('pass1', 0.55, 0.66, { speed: 0.055 });
          }],
          [0.4, () => { pose('gB1', 'stand'); cpose('toil', 'stand'); }],
          [4.1, b => {
            // 夜里：先前的一代过去了——杏树下多了两座坟；孩子长大，娶了妻；父母老了
            rm('gA1'); rm('gA2'); crm('toil'); crm('pass1');
            prop('c1', 'cairn', { x: graveX(0), label: '坟' });
            prop('c2', 'cairn', { x: graveX(1), label: '坟', size: 0.9 });
            add('gB1', { age: 'elder', label: '老人', prop: 'staff' });
            add('gB2', { age: 'elder', label: '老妇' });
            add('gC1', { age: 'adult', label: '劳碌的人' });
            place('gB1', graveX(2) + 0.012); place('gB2', graveX(3) + 0.014); place('gC1', fld(0.62));
            add('gC2', { label: '妻', sex: 'f', x: fld(0.72), facing: -1, pose: 'stand', robe: ROBE.gC2, glow: 0.3 });
            face('gB1', -1); face('gB2', -1); face('gC1', 1);
            crowd('pass2', { n: 4, x0: 0.94, x1: 1.0, layer: 1, label: '行路的人', glow: 0.06 }, folk(CROWD_RB));
          }],
          [5.2, () => cwalk('pass2', 0.55, 0.66, { speed: 0.05 })],
          [7, b => { lv('ecArc', 1, b); W.passDay(6.8, b.instant); sfx(b, 'harp', { soft: true }); }],
          [11, b => {
            // 又一夜：一代又来——孩子生了
            add('gD1', { label: '孩童', sex: 'm', age: 'child', x: fld(0.8), facing: -1, pose: 'stand', robe: ROBE.gD1, glow: 0.34, from: b.instant ? 'none' : 'light' });
            crm('pass2');
            crowd('pass3', { n: 4, x0: 0.94, x1: 1.0, layer: 1, label: '行路的人', glow: 0.06 }, folk(CROWD_RB));
          }],
          [12, () => cwalk('pass3', 0.55, 0.66, { speed: 0.05 })],
          [14, b => { lv('ecWind', 1, b); W.set('gale', 0.55, b.instant); W.passDay(6.8, b.instant); sfx(b, 'wind'); }],
          [17.8, () => { crm('pass3'); crowd('pass4', { n: 5, x0: 0.94, x1: 1.0, layer: 1, label: '行路的人', glow: 0.06 }, folk(CROWD_RB)); }],
          [18.8, () => cwalk('pass4', 0.54, 0.68, { speed: 0.05 })],
          [21.4, b => { lv('ecCycle', 1, b); W.passDay(6.4, b.instant); sfx(b, 'splash', { soft: true, far: true }); }],
          [28, b => { W.set('gale', 0.12, b.instant); lv('ecWind', 0.25, b); lv('ecArc', 0.3, b); crm('pass4'); }],
        ]);
      },
    },

    // ── 1:9；2:4–6，2:11，2:24 王的大工程——都是虚空；吃喝出于神的手 ──
    {
      kind: 'act', utter: '我看这也是出于神的手', cmd: 'build 房屋 葡萄园 园囿 水池 && gc --all  # 都是捕风', ref: '2:24',
      verse: [
        { text: '已有的事后必再有；已行的事后必再行。<br>日光之下并无新事。', ref: '传道书 1:9', hold: 6 },
        { text: '我为自己动大工程，建造房屋，栽种葡萄园，<br>修造园囿，在其中栽种各样果木树；挖造水池，用以浇灌嫩小的树木。', ref: '传道书 2:4–6', hold: 7.5 },
        { text: '后来，我察看我手所经营的一切事和我劳碌所成的功。<br>谁知都是虚空，都是捕风；在日光之下毫无益处。', ref: '传道书 2:11', hold: 7 },
        { text: '人莫强如吃喝，且在劳碌中享福，<br>我看这也是出于神的手。', ref: '传道书 2:24', hold: 6 },
      ],
      apply(c) {
        const works = () => lerp(X('f0'), X('f1'), 0) ;
        T(c, [
          [0, b => {
            W.goTo(0.62, 27, b.instant);
            lv('ecCycle', 0, b); lv('ecArc', 0, b); lv('ecWind', 0, b); W.set('gale', 0, b.instant); lv('ecMist', 0.12, b);
            prop('works', 'works', { x0: works(), x1: X('f1') + 0.01, grow: 0, k: 0, label: '王的工程', now: true, show: true });
            walk('gC1', fld(1.05), { speed: 0.02 }); walk('gC2', fld(1.12), { speed: 0.02 });
            walk('gD1', graveX(3) + 0.02, { speed: 0.02 });
          }],
          [7.3, b => {
            pose('preacher', 'point'); face('preacher', -1);
            prop('works', null, { grow: 1 });
            prop('field', null, { grow: 0 });
            prop('city', null, { k: 1 });
            crowd('servants', { n: 3, x0: fld(0.1), x1: fld(0.5), label: '仆婢', pose: 'bow', glow: 0.1 }, men(CROWD_RB));
            cface('servants', 1);
            const cc = C();
            if (cc.herd) U.safe('cast.herd', () => cc.herd('flock', { kind: 'sheep', n: 6, x0: 0.55, x1: 0.68, layer: 1, label: '羊群', from: b.instant ? 'none' : 'fade', mill: true }));
            sfx(b, 'build'); sfx(b, 'harp', { soft: true });
          }],
          [10, b => sfx(b, 'build', { soft: true })],
          [16.2, b => {
            // 一阵风过：大工程都化作雾气
            lv('ecWind', 0.9, b); W.set('gale', 0.6, b.instant); lv('ecMist', 0.5, b);
            pose('preacher', 'stand');
            sfx(b, 'wind');
          }],
          [17.4, () => { prop('works', null, { k: 1 }); prop('city', null, { k: 0 }); crm('servants'); }],
          [21, b => { lv('ecWind', 0, b); W.set('gale', 0, b.instant); lv('ecMist', 0.2, b); prop('works', null, { show: false }); prop('field', null, { grow: 0.06 }); }],
          [23.4, b => {
            prop('meal', 'meal', { x: (X('well') + X('bench')) / 2 + 0.004, v: 0.16, label: '饼和酒', lit: 1 });
            walk('preacher', X('bench'), { speed: 0.02, pose: 'seat' });
            beam(b, (X('well') + X('bench')) / 2 + 0.004, 2, { v: 0.16, dur: 6, w: 90 });
            sfx(b, 'harp');
          }],
          [25.5, () => { face('preacher', -1); }],
        ]);
      },
    },

    // ── 3:1–4 凡事都有定期（签名之景：春与夏）──────────────────
    {
      kind: 'act', utter: '凡事都有定期，天下万务都有定时', cmd: 'crontab -l  # 生有时，死有时……', ref: '3:1',
      verse: [
        { text: '凡事都有定期，天下万务都有定时。', ref: '传道书 3:1', hold: 6 },
        { text: '生有时，死有时；<br>栽种有时，拔出所栽种的也有时；', ref: '传道书 3:2', hold: 6.5 },
        { text: '杀戮有时，医治有时；<br>拆毁有时，建造有时；', ref: '传道书 3:3', hold: 6 },
        { text: '哭有时，笑有时；<br>哀恸有时，跳舞有时；', ref: '传道书 3:4', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 春天：花开遍地，杏树开花
            W.set('bloom', 1, b.instant); W.set('bare', 0, b.instant);
            prop('almond', null, { k: 1, grow: 0.3 });
            prop('meal', null, { lit: 0 });
            W.goTo(0.74, 29, b.instant);
            lv('ecMist', 0.06, b);
            sfx(b, 'bird', { soft: true });
          }],
          [2.5, () => unprop('meal')],
          [7.3, b => {
            // 生有时：妻怀中有了婴孩
            pose('gC2', 'sit'); babe('gC2', 'baby');
            sparkleOn(b, 'gC2', 22, [255, 236, 206]); ringOn(b, 'gC2', [255, 232, 200], 0.1);
            // 死有时：老人在杏树下躺下
            walk('gB1', graveX(2), { speed: 0.012, pose: 'lie' });
            face('gB2', 'gB1');
          }],
          [8.6, b => {
            // 栽种有时：撒种的人走过田间
            hold('gC1', 'bundle'); place('gC1', fld(0.96));
            walk('gC1', fld(0.06), { speed: 0.02, pose: 'stand' });
            prop('field', null, { grow: 1 });
            if (!b.instant && fx()) {
              for (let i = 0; i < 4; i++) {
                const tg = [];
                for (let k = 0; k < 10; k++) { const xf = lerp(X('f1'), X('f0'), (i + Math.random()) / 4); tg.push([xf * W.w, baseY(2, xf, 0.04 + Math.random() * 0.24), 1.2]); }
                const xs = lerp(X('f1'), X('f0'), (i + 0.5) / 4);
                fx().sow(xs * W.w, gY(2, xs) - hP(2) * 0.5, tg, [255, 236, 190], { pass: 'near', dur: 1.6, stagger: 3.2 * i + 0.5 });
              }
            }
          }],
          [11.2, b => { rm('gB1'); prop('c3', 'cairn', { x: graveX(2), label: '坟' }); if (!b.instant && fx()) { const x = graveX(2) * W.w; fx().dust(x, gY(2, graveX(2)), 16, [210, 196, 170], hP(2) * 0.4); } }],
          [12.5, () => { pose('gB2', 'weep', { weep: true }); }],
          [15.1, b => {
            // 夏：田转金黄，收割的人来了——拔出所栽种的
            hold('gC1', null);
            prop('field', null, { gold: 1 });
            prop('almond', null, { k: 0, grow: 1 });
            crowd('reapers', { n: 3, x0: X('f1') + 0.005, x1: X('f1') + 0.03, label: '收割的人', pose: 'bow', glow: 0.1 }, men(CROWD_RB));
            cface('reapers', -1);
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [17.5, () => { prop('field', null, { reap: 1 }); cwalk('reapers', fld(0.08), fld(0.4), { speed: 0.02, pose: 'bow' }); walk('gC1', fld(0.5), { speed: 0.02, pose: 'bow' }); }],
          [22.4, b => {
            // 哭有时：老妇在新坟前哭；跳舞有时：收完了庄稼，篝火边跳舞
            face('gD1', 'gB2'); pose('gD1', 'kneel');
            prop('fire', 'fire', { x: fld(0.45), v: 0.12, fire: 1, label: '篝火' });
            sfx(b, 'weep', { soft: true });
          }],
          [24.6, b => {
            crm('reapers');
            crowd('dance', { n: 5, x0: fld(0.2), x1: fld(0.72), label: '跳舞的', pose: 'raise', glow: 0.14, v: 0.08 }, folk([[196, 120, 90], [170, 140, 96], [150, 108, 132], [206, 170, 104], [120, 130, 156]]));
            walk('gC1', fld(0.78), { speed: 0.03, pose: 'raise' }); face('gC1', -1);
            sfx(b, 'laugh', { soft: true }); sfx(b, 'harp', { soft: true });
          }],
          [26.2, () => cwalk('dance', fld(0.12), fld(0.62), { speed: 0.025, pose: 'raise' })],
          [27.8, () => cwalk('dance', fld(0.24), fld(0.76), { speed: 0.025, pose: 'raise' })],
        ]);
      },
    },

    // ── 3:5–8，3:11 秋、冬、春——神造万物，各按其时成为美好 ───────
    {
      kind: 'act', utter: '神造万物，各按其时成为美好', cmd: 'schedule 万物 --each 其时  # 永生安置在心里', ref: '3:11',
      verse: [
        { text: '抛掷石头有时，堆聚石头有时；怀抱有时，不怀抱有时；<br>寻找有时，失落有时；保守有时，舍弃有时；', ref: '传道书 3:5–6', hold: 7.5 },
        { text: '撕裂有时，缝补有时；静默有时，言语有时；<br>喜爱有时，恨恶有时；争战有时，和好有时。', ref: '传道书 3:7–8', hold: 7.5 },
        { text: '神造万物，各按其时成为美好，又将永生安置在世人心里。<br>然而神从始至终的作为，人不能参透。', ref: '传道书 3:11', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 秋：叶黄了，落下
            W.set('bare', 0.55, b.instant); W.set('bloom', 0.15, b.instant);
            lv('ecLeaf', 1, b);
            prop('almond', null, { gold: 1 });
            prop('fire', null, { fire: 0.35 });
            W.goTo(0.78, 8, b.instant);
            crm('dance');
            pose('gB2', 'stand'); pose('gD1', 'stand');
            sfx(b, 'wind', { soft: true });
          }],
          [1, b => {
            // 抛掷石头，堆聚石头
            prop('stones', 'stones', { x: X('f0') - 0.012, grow: 0, k2: 1, label: '石堆', now: true });
            walk('gC1', X('f0') + 0.012, { speed: 0.025, pose: 'bow' });
          }],
          [2.4, () => prop('stones', null, { grow: 1, k2: 0 })],
          [5.5, () => {
            // 怀抱有时：婴孩交在老妇怀里；二人相拥
            babe('gC2', null); babe('gB2', 'baby');
            pose('gC2', 'stand');
            pose('gC1', 'stand');
            hug('gC1', 'gC2', { at: fld(0.6) });
          }],
          [8.8, b => {
            // 冬：雪落下，叶落尽；众人回到屋旁，静默
            lv('ecLeaf', 0, b); lv('ecSnow', 1, b);
            prop('almond', null, { grow: 0 });
            prop('fire', null, { fire: 0 });
            W.set('bare', 0.3, b.instant); W.set('bloom', 0, b.instant); W.set('clouds', 0.65, b.instant);
            W.goTo(0.86, 6, b.instant);
            prop('house', null, { lit: 1 });
            sfx(b, 'wind', { soft: true, low: true });
          }],
          [10, () => {
            pose('gC1', 'stand'); pose('gC2', 'stand');
            walk('gC1', X('well') - 0.035, { speed: 0.03, pose: 'sit' });
            walk('gC2', X('well') - 0.06, { speed: 0.03, pose: 'sit' });
            walk('gB2', X('well') + 0.03, { speed: 0.02, pose: 'sit' });
            walk('gD1', X('well') - 0.085, { speed: 0.03, pose: 'sit' });
          }],
          [13, () => unprop('fire')],
          [16, b => {
            // 春在黎明回来
            W.goTo(0.29, 6.5, b.instant);
            lv('ecSnow', 0, b);
            W.set('bare', 0, b.instant); W.set('bloom', 1, b.instant); W.set('clouds', 0.35, b.instant);
            prop('almond', null, { k: 1, grow: 0.3, gold: 0 });
            prop('field', null, { reap: 0, gold: 0, grow: 0, now: true });
            sfx(b, 'bird', { soft: true });
          }],
          [16.6, () => prop('field', null, { grow: 0.35 })],
          [21.5, b => {
            // 又将永生安置在世人心里
            lv('ecHeart', 1, b);
            for (const id of ['preacher', 'gB2', 'gC1', 'gC2', 'gD1']) { glow(id, 0.7); sparkleOn(b, id, 16, [255, 230, 170]); }
            add('gD1', { age: 'adult', label: '少年人' });
            babe('gB2', null);
            add('gE1', { label: '孩童', sex: 'm', age: 'child', x: X('well') + 0.055, facing: -1, pose: 'stand', robe: ROBE.gE1, glow: 0.7, from: b.instant ? 'none' : 'light' });
            for (const id of ['gC1', 'gC2', 'gB2', 'gD1']) pose(id, 'stand');
            if (!b.instant && fx()) fx().ring(X('well') * W.w, gY(2, X('well')) - hP(2) * 0.6, [255, 230, 170], M() * 0.3, 3, 1.6);
            sfx(b, 'harp');
          }],
          [25.5, b => lv('ecHeart', 0.3, b)],
        ]);
      },
    },

    // ── 4:8–12 孤身一人；二人；三股合成的绳子 ─────────────────
    {
      kind: 'bless', utter: '三股合成的绳子不容易折断', cmd: 'braid 你 我 他  # 三股合成，不容易折断', ref: '4:12',
      verse: [
        { text: '有人孤单无二，无子无兄，竟劳碌不息，眼目也不以钱财为足。<br>他说：「我劳劳碌碌，刻苦自己，不享福乐，到底是为谁呢？」', ref: '传道书 4:8', hold: 8 },
        { text: '两个人总比一个人好，因为二人劳碌同得美好的果效。<br>若是跌倒，这人可以扶起他的同伴；若是孤身跌倒，没有别人扶起他来，这人就有祸了。', ref: '传道书 4:9–10', hold: 8.5 },
        { text: '有人攻胜孤身一人，若有二人便能敌挡他；<br>三股合成的绳子不容易折断。', ref: '传道书 4:12', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.4, 8, b.instant);
            lv('ecHeart', 0.2, b);
            walk('gC1', fld(0.3), { speed: 0.025, pose: 'bow' });
            walk('gD1', fld(0.12), { speed: 0.025, pose: 'bow' });
            walk('gC2', X('well') - 0.03, { speed: 0.02 });
            add('lone', { label: '孤身一人', sex: 'm', x: 0.99, facing: -1, pose: 'stand', robe: ROBE.lone, glow: 0.12, prop: 'bundle' });
          }],
          [0.6, () => walk('lone', fld(0.72), { speed: Math.max(0.02, (0.99 - fld(0.72)) / 7.6), pose: 'bow' })],
          [9.6, b => {
            // 若是孤身跌倒……
            place('lone', fld(0.72)); pose('lone', 'fall', { stop: true }); hold('lone', null);
            prop('bundle', 'bundle', { x: fld(0.8), v: 0.04, label: '重担' });
            if (!b.instant && fx()) { const x = fld(0.72) * W.w; fx().dust(x, gY(2, fld(0.72)), 14, [210, 190, 150], hP(2) * 0.5); }
          }],
          [11.4, () => { walk('gC1', fld(0.68), { speed: 0.05, pose: 'bow' }); }],
          [14.2, () => { pose('lone', 'kneel'); face('lone', -1); }],
          [15.4, () => { pose('lone', 'stand'); pose('gC1', 'stand'); face('gC1', 1); hands('gC1', 'lone', true); }],
          [16.4, () => { walk('gD1', fld(0.6), { speed: 0.04 }); }],
          [18.8, b => {
            S.rope = ['gD1', 'gC1', 'lone'];
            face('gD1', 1);
            lv('ecRope', 1, b);
            glow('lone', 0.6);
            sfx(b, 'harp');
          }],
          [21, b => { hands('gC1', 'lone', false); hands('gD1', 'gC1', true); sparkleOn(b, 'gC1', 18, [255, 226, 170]); }],
        ]);
      },
    },

    // ── 5:2，5:15，6:12 神在天上，你在地下 ─────────────────────
    {
      kind: 'act', utter: '神在天上，你在地下', cmd: 'mute --words few  # 神在天上，你在地下', ref: '5:2',
      verse: [
        { text: '你在神面前不可冒失开口，也不可心急发言；<br>因为神在天上，你在地下，所以你的言语要寡少。', ref: '传道书 5:2', hold: 7.5 },
        { text: '他怎样从母胎赤身而来，也必照样赤身而去；<br>他所劳碌得来的，手中分毫不能带去。', ref: '传道书 5:15', hold: 7 },
        { text: '人一生虚度的日子，就如影儿经过，<br>谁知道什么与他有益呢？', ref: '传道书 6:12', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.5, 8, b.instant);
            lv('ecRope', 0, b); hands('gD1', 'gC1', false);
            lv('ecHeaven', 1, b);
            sfx(b, 'harp', { soft: true });
          }],
          [1.2, () => {
            // 众人转向山上神的殿，跪下；言语寡少
            walk('gC1', fld(0.7), { speed: 0.02, pose: 'kneel' });
            walk('gD1', fld(0.58), { speed: 0.02, pose: 'kneel' });
            walk('lone', fld(0.84), { speed: 0.02, pose: 'kneel' });
            walk('gC2', graveX(1) + 0.004, { speed: 0.02, pose: 'kneel' });
            walk('gE1', graveX(3), { speed: 0.02, pose: 'kneel' });
            pose('gB2', 'bow');
            pose('preacher', 'bow');
            for (const id of ['gC1', 'gD1', 'lone', 'gC2', 'gE1', 'gB2', 'preacher']) face(id, 1);
          }],
          [8.8, () => { pose('lone', 'stand'); face('lone', -1); unprop('bundle'); }],
          [10, () => walk('lone', X('shore') + 0.01, { speed: 0.018 })],
          [17.1, b => { lv('ecShade', 1, b); lv('ecHeaven', 0.25, b); rm('lone'); }],
          [19, () => { for (const id of ['gC1', 'gD1', 'gC2', 'gE1', 'gB2', 'preacher']) pose(id, 'stand'); }],
          [23, b => lv('ecShade', 0, b)],
        ]);
      },
    },

    // ── 7:13–14，8:17 神使这两样并列；夜里查不出 ────────────────
    {
      kind: 'act', utter: '神使这两样并列', cmd: 'diff 亨通的日子 患难的日子  # 神使这两样并列', ref: '7:14',
      verse: [
        { text: '你要察看神的作为；<br>因神使为曲的，谁能变为直呢？', ref: '传道书 7:13', hold: 5.5 },
        { text: '遇亨通的日子你当喜乐；遭患难的日子你当思想；<br>因为神使这两样并列，为的是叫人查不出身后有什么事。', ref: '传道书 7:14', hold: 8 },
        { text: '我就看明神一切的作为，知道人查不出日光之下所做的事；<br>任凭他费多少力寻查，都查不出来，就是智慧人虽想知道，也是查不出来。', ref: '传道书 8:17', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.64, 10, b.instant);
            lv('ecHeaven', 0, b); lv('ecShade', 0, b);
            W.set('ecCloud', 0, true);
            lv('ecRainA', 1, b);
            sfx(b, 'thunder', { soft: true, far: true });
          }],
          [2, () => {
            walk('gC1', fld(0.55), { speed: 0.02, pose: 'raise' });
            walk('gC2', fld(0.72), { speed: 0.02, pose: 'raise' });
            walk('gD1', fld(0.35), { speed: 0.02, pose: 'raise' });
            walk('gE1', fld(0.88), { speed: 0.02, pose: 'raise' });
            face('gC1', -1); face('gC2', -1);
          }],
          [6.8, b => { lv('ecCloud', 1, b); sfx(b, 'rain', { soft: true }); }],
          [11, () => { for (const id of ['gC1', 'gC2', 'gD1', 'gE1']) pose(id, 'sit'); }],
          [15.2, b => { lv('ecRainA', 0, b); W.goTo(0.97, 8, b.instant); }],
          [16.6, b => {
            // 夜里：传道者提灯寻查，仰望众星
            lv('ecLamp', 1, b);
            walk('preacher', X('well') - 0.03, { speed: 0.018, pose: 'gaze' });
            pose('gE1', 'lie');
            sfx(b, 'stars', { soft: true });
          }],
          [23, () => { face('preacher', -1); }],
        ]);
      },
    },

    // ── 9:7，9:10，10:12 吃饭喝酒，神已经悦纳；尽力去做；恩言 ─────
    {
      kind: 'bless', utter: '神已经悦纳你的作为', cmd: 'eat 饼 && drink 酒  # 神已经悦纳你的作为', ref: '9:7',
      verse: [
        { text: '你只管去欢欢喜喜吃你的饭，心中快乐喝你的酒，<br>因为神已经悦纳你的作为。', ref: '传道书 9:7', hold: 7 },
        { text: '凡你手所当做的事要尽力去做；<br>因为在你所必去的阴间没有工作，没有谋算，没有知识，也没有智慧。', ref: '传道书 9:10', hold: 8 },
        { text: '智慧人的口说出恩言；愚昧人的嘴吞灭自己。', ref: '传道书 10:12', hold: 5.5 },
      ],
      apply(c) {
        const mx = (X('well') + X('bench')) / 2 + 0.004;
        T(c, [
          [0, b => {
            W.goTo(0.33, 7.5, b.instant);
            W.set('ecCloud', 0, true);
            walk('preacher', X('bench'), { speed: 0.02, pose: 'seat' });
            for (const id of ['gC1', 'gC2', 'gD1', 'gE1']) pose(id, 'stand');
            add('gC1', { robe: ROBE.white }); add('gC2', { robe: ROBE.white });
          }],
          [4.5, b => {
            lv('ecLamp', 0, b);
            prop('meal', 'meal', { x: mx, v: 0.16, label: '饼和酒', lit: 1 });
            walk('gC1', mx - 0.02, { speed: 0.03, pose: 'sit' });
            walk('gC2', mx + 0.012, { speed: 0.03, pose: 'sit' });
            walk('gE1', mx - 0.045, { speed: 0.03, pose: 'sit' });
          }],
          [8, b => {
            beam(b, mx, 2, { v: 0.16, dur: 5, w: 80 });
            face('gC1', 1); face('gC2', -1);
            sfx(b, 'harp', { soft: true });
          }],
          [8.8, b => {
            // 尽力去做：他到田里，她推磨，少年人垒石
            prop('meal', null, { lit: 0 });
            pose('gC1', 'stand'); pose('gC2', 'stand'); pose('gE1', 'stand');
            walk('gC1', fld(0.5), { speed: 0.035, pose: 'bow' });
            walk('gC2', (houseX() + (0.62 * hP(2)) / W.w) - 0.02, { speed: 0.02, pose: 'kneel' });
            walk('gD1', X('f0'), { speed: 0.03, pose: 'bow' });
            prop('field', null, { grow: 0.6 });
          }],
          [12.5, () => { prop('house', null, { k2: 1 }); face('gC2', 1); unprop('meal'); }],
          [17.6, b => {
            // 智慧人的口说出恩言：传道者教导孩子
            walk('gE1', X('bench') - 0.04, { speed: 0.02, pose: 'sit' });
            face('gE1', 1); pose('preacher', 'point'); face('preacher', -1);
          }],
          [19.5, b => {
            if (!b.instant && fx()) {
              const a = ptOf('preacher', 0.85), d = ptOf('gE1', 0.8);
              if (a && d) {
                const tg = [];
                for (let k = 0; k < 18; k++) tg.push([d[0] + (Math.random() - 0.5) * d[2] * 0.5, d[1] + (Math.random() - 0.5) * d[2] * 0.3, 1.2]);
                fx().sow(a[0], a[1], tg, [255, 230, 170], { pass: 'air', dur: 2.2, stagger: 2.5 });
              }
            }
            sfx(b, 'harp', { soft: true });
          }],
          [23, () => pose('preacher', 'seat')],
        ]);
      },
    },

    // ── 11:1，11:6–7 当将你的粮食撒在水面 ─────────────────────
    {
      kind: 'cmd', utter: '当将你的粮食撒在水面', cmd: 'push 粮食 --to 水面 && await 日久  # 必能得着', ref: '11:1',
      verse: [
        { text: '当将你的粮食撒在水面，因为日久必能得着。', ref: '传道书 11:1', hold: 6.5 },
        { text: '早晨要撒你的种，晚上也不要歇你的手，因为你不知道哪一样发旺；<br>或是早撒的，或是晚撒的，或是两样都好。', ref: '传道书 11:6', hold: 8 },
        { text: '光本是佳美的，眼见日光也是可悦的。', ref: '传道书 11:7', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { hold('gD1', 'bundle'); walk('gD1', X('shore'), { speed: 0.035 }); pose('gC2', 'stand'); prop('house', null, { k2: 0.3 }); }],
          [4.2, b => {
            pose('gD1', 'raise'); face('gD1', -1); hold('gD1', null);
            lv('ecBread', 0.5, b);
            sfx(b, 'splash', { soft: true });
          }],
          [6, () => pose('gD1', 'stand')],
          [7.8, b => { fullDay(b, 4); }],
          [8.4, b => {
            // 早晨撒种：田里的人撒下种子
            hold('gC1', 'bundle'); pose('gC1', 'stand');
            walk('gC1', fld(0.1), { speed: 0.02 });
            prop('field', null, { grow: 0.8 });
          }],
          [12, b => { fullDay(b, 4); }],
          [16.2, b => { W.goTo(0.72, 5, b.instant); hold('gC1', null); walk('gC1', fld(0.6), { speed: 0.02, pose: 'bow' }); }],
          [16.6, b => { lv('ecBread', 1, b); face('gD1', -1); sfx(b, 'harp', { soft: true }); }],
          [23.2, b => {
            prop('basket', 'basket', { x: X('shore') + 0.018, v: 0.05, k: 1, label: '粮食' });
            pose('gD1', 'kneel');
            sparkleOn(b, 'gD1', 16, [255, 226, 160]);
          }],
        ]);
      },
    },

    // ── 12:1–5 当记念造你的主；衰败的日子 ─────────────────────
    {
      kind: 'cmd', utter: '当记念造你的主', cmd: 'remember 造你的主 --before 衰败的日子', ref: '12:1',
      verse: [
        { text: '你趁着年幼、衰败的日子尚未来到，就是你所说，<br>我毫无喜乐的那些年日未曾临近之先，当记念造你的主。', ref: '传道书 12:1', hold: 8.5 },
        { text: '不要等到日头、光明、月亮、星宿变为黑暗，雨后云彩反回，<br>看守房屋的发颤，有力的屈身，推磨的稀少就止息，从窗户往外看的都昏暗；', ref: '传道书 12:2–3', hold: 8.5 },
        { text: '人怕高处，路上有惊慌，杏树开花，蚱蜢成为重担，人所愿的也都废掉；<br>因为人归他永远的家，吊丧的在街上往来。', ref: '传道书 12:5', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.goTo(0.27, 7, b.instant); pose('gD1', 'stand'); walk('gC1', fld(0.7), { speed: 0.02 }); }],
          [0.8, () => { walk('gE1', X('f0') + 0.005, { speed: 0.03, pose: 'stand' }); }],
          [3, b => { W.set('ecBread', 0, true); }],
          [7, b => {
            // 孩子在黎明向东跪下
            face('gE1', -1); pose('gE1', 'pray');
            glow('gE1', 1);
            beam(b, X('f0') + 0.005, 2, { dur: 6, w: 70, rgb: [255, 230, 190] });
            sfx(b, 'harp', { soft: true });
          }],
          [10, b => {
            // 雨后云彩反回；日光暗下去
            W.set('clouds', 1, b.instant); W.set('storm', 0.5, b.instant); W.set('rain', 0.35, b.instant);
            W.goTo(0.7, 15, b.instant);
            sfx(b, 'rain', { soft: true });
          }],
          [12, () => { prop('house', null, { k2: 0, lit: 0.15 }); pose('gC2', 'stand'); walk('gC2', X('well') + 0.02, { speed: 0.02 }); }],
          [14.5, b => { W.set('rain', 0, b.instant); W.set('storm', 0.38, b.instant); prop('house', null, { k: 1 }); sfx(b, 'gate', { soft: true }); }],
          [17.1, b => {
            // 杏树开花；有力的屈身；吊丧的在街上往来
            prop('almond', null, { k: 1, grow: 0.25 });
            pose('preacher', 'stand');
            crowd('mourners', { n: 3, x0: 0.96, x1: 1.0, layer: 1, label: '吊丧的', glow: 0.05 }, folk([ROBE.mourn, [70, 62, 70], [52, 50, 58]]));
          }],
          [17.8, () => { cwalk('mourners', 0.6, 0.7, { speed: 0.012 }); pose('preacher', 'bow'); pose('gE1', 'stand'); }],
          [22.5, () => { pose('preacher', 'seat'); }],
        ]);
      },
    },

    // ── 12:6–7 银链折断，金罐破裂……尘土归于地，灵归于神（签名之景）──
    {
      kind: 'act', utter: '尘土仍归于地，灵仍归于赐灵的神', cmd: 'return 尘土 地 && return 灵 赐灵的神', ref: '12:7',
      verse: [
        { text: '银链折断，金罐破裂，<br>瓶子在泉旁损坏，水轮在井口破烂，', ref: '传道书 12:6', hold: 7.5 },
        { text: '尘土仍归于地，<br>灵仍归于赐灵的神。', ref: '传道书 12:7', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.78, 12, b.instant);
            W.set('storm', 0, b.instant); W.set('clouds', 0.45, b.instant);
            crm('mourners');
            walk('gC1', X('well') - 0.045, { speed: 0.03 });
            walk('gC2', X('well') - 0.066, { speed: 0.025 });
            walk('gD1', X('well') - 0.088, { speed: 0.03 });
            walk('gE1', X('bench') - 0.03, { speed: 0.025 });
            walk('gB2', X('well') - 0.11, { speed: 0.02 });
          }],
          [1.6, b => {
            // 银链折断，金罐落下
            S.bowl = 'fall'; S.bowlT0 = b.instant ? -1e9 : W.t;
            prop('house', null, { fire: 0 });
            if (!b.instant && fx()) { const B = bowlPos(); fx().sparkle(B.x, B.beamY + B.hN * 0.1, 12, [230, 236, 255], B.hN * 0.1, 'air'); }
            sfx(b, 'seal', { soft: true });
          }],
          [2.4, b => {
            S.bowl = 'broken';
            if (!b.instant && fx()) { const B = bowlPos(); fx().sparkle(B.x, B.y0 - B.hN * 0.05, 18, [255, 214, 140], B.hN * 0.2, 'air'); }
          }],
          [4, b => {
            prop('well', null, { k2: 1 });
            if (!b.instant && fx()) { const x = X('well') * W.w + hP(2) * 0.52, y = gY(2, X('well')); fx().sparkle(x, y - hP(2) * 0.1, 22, [200, 220, 255], hP(2) * 0.25, 'air'); }
            sfx(b, 'splash', { soft: true });
          }],
          [5.8, b => { prop('well', null, { k: 1 }); sfx(b, 'build', { soft: true }); }],
          [8.8, () => { pose('preacher', 'lie', { stop: true }); face('gE1', 1); pose('gE1', 'kneel'); }],
          [11.4, b => {
            // 尘土仍归于地；灵仍归于赐灵的神
            S.spX = X('bench');
            rm('preacher');
            lv('ecSpirit', 1, b);
            if (!b.instant && fx()) {
              const x = X('bench') * W.w, y = gY(2, X('bench')) - hP(2) * 0.25;
              for (let i = 0; i < 40; i++) fx().add({ x: x + rnd(-0.5, 0.5) * hP(2), y: y + rnd(-0.2, 0.15) * hP(2), vx: rnd(-6, 6), vy: rnd(4, 16), max: rnd(1.4, 2.6), size: rnd(0.8, 1.8), c: [214, 196, 168], drag: 1.4, grav: 14, a: 0.8, pass: 'near' });
            }
            sfx(b, 'harp');
          }],
          [12.6, b => {
            prop('cP', 'cairn', { x: X('bench') - 0.004, label: '传道者的坟', size: 1.05 });
            for (const id of ['gC1', 'gC2', 'gD1', 'gB2']) { face(id, 1); pose(id, 'kneel'); }
            pose('gC2', 'weep', { weep: true });
            sfx(b, 'weep', { soft: true });
          }],
        ]);
      },
    },

    // ── 12:8，12:13–14 敬畏神，谨守他的诫命（终）────────────────
    {
      kind: 'cmd', utter: '敬畏神，谨守他的诫命', cmd: 'echo $总意  # 敬畏神，谨守他的诫命——这是人所当尽的本分', ref: '12:13',
      verse: [
        { text: '传道者说：「虚空的虚空，凡事都是虚空。」', ref: '传道书 12:8', hold: 6 },
        { text: '这些事都已听见了，总意就是：<br>敬畏神，谨守他的诫命，这是人所当尽的本分。', ref: '传道书 12:13', hold: 8 },
        { text: '因为人所做的事，连一切隐藏的事，<br>无论是善是恶，神都必审问。', ref: '传道书 12:14', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.268, 12, b.instant);
            W.set('storm', 0, b.instant); W.set('clouds', 0.3, b.instant);
            lv('ecMist', 0.3, b); lv('ecHeart', 0.4, b);
            lv('ecSpirit', 1, b);
            prop('house', null, { lit: 0 });
          }],
          [2.5, () => {
            for (const id of ['gC1', 'gC2', 'gD1', 'gE1', 'gB2']) pose(id, 'stand');
            hold('gD1', 'staff');
          }],
          [4, () => {
            // 一代又来：众人走到田边，向着日出
            walk('gB2', graveX(3), { speed: 0.02 });
            walk('gC2', X('f1') + 0.01, { speed: 0.025 });
            walk('gC1', fld(0.84), { speed: 0.025 });
            walk('gD1', fld(0.62), { speed: 0.025 });
            walk('gE1', fld(0.72), { speed: 0.025 });
          }],
          [7.3, b => {
            for (const id of ['gC1', 'gC2', 'gD1', 'gE1', 'gB2']) face(id, -1);
            pose('gC1', 'kneel'); pose('gC2', 'kneel'); pose('gD1', 'kneel'); pose('gE1', 'pray'); pose('gB2', 'bow');
            lv('ecArc', 0.45, b);
            sfx(b, 'harp', { soft: true });
          }],
          [12, b => {
            lv('ecGlory', 1, b); lv('ecMist', 0, b);
            if (!b.instant && fx()) fx().ring(fld(0.7) * W.w, gY(2, fld(0.7)) - hP(2) * 0.5, [255, 236, 190], M() * 0.45, 3.4, 1.6);
          }],
          [16.6, b => { lv('ecHeart', 0.6, b); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '传道书', books: [21], title: '虚空', sub: '传道书 1 — 12', tint: [220, 222, 230], music: 'cain',
    outro: 16,
    intro: [
      { text: '在耶路撒冷作王、大卫的儿子、传道者的言语。', ref: '传道书 1:1', hold: 6 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '传道者': { text: '我传道者在耶路撒冷作过以色列的王。', ref: '传道书 1:12' },
      '传道者的坟': { text: '尘土仍归于地，灵仍归于赐灵的神。', ref: '传道书 12:7' },
      '老人': { text: '一代过去，一代又来，地却永远长存。', ref: '传道书 1:4' },
      '老妇': { text: '一代过去，一代又来，地却永远长存。', ref: '传道书 1:4' },
      '妇人': { text: '一代过去，一代又来，地却永远长存。', ref: '传道书 1:4' },
      '劳碌的人': { text: '劳碌的人不拘吃多吃少，睡得香甜；富足人的丰满却不容他睡觉。', ref: '传道书 5:12' },
      '妻': { text: '在你一生虚空的年日，就是神赐你在日光之下虚空的年日，当同你所爱的妻，快活度日……', ref: '传道书 9:9' },
      '少年人': { text: '少年人哪，你在幼年时当快乐。在幼年的日子，使你的心欢畅……', ref: '传道书 11:9' },
      '孩童': { text: '你趁着年幼……当记念造你的主。', ref: '传道书 12:1' },
      '孤身一人': { text: '若是孤身跌倒，没有别人扶起他来，这人就有祸了。', ref: '传道书 4:10' },
      '仆婢': { text: '我买了仆婢，也有生在家中的仆婢；又有许多牛群羊群，胜过以前在耶路撒冷众人所有的。', ref: '传道书 2:7' },
      '羊群': { text: '我买了仆婢，也有生在家中的仆婢；又有许多牛群羊群，胜过以前在耶路撒冷众人所有的。', ref: '传道书 2:7' },
      '收割的人': { text: '栽种有时，拔出所栽种的也有时；', ref: '传道书 3:2' },
      '跳舞的': { text: '哭有时，笑有时；哀恸有时，跳舞有时；', ref: '传道书 3:4' },
      '行路的人': { text: '一代过去，一代又来，地却永远长存。', ref: '传道书 1:4' },
      '吊丧的': { text: '因为人归他永远的家，吊丧的在街上往来。', ref: '传道书 12:5' },
      '耶路撒冷': { text: '我传道者在耶路撒冷作过以色列的王。', ref: '传道书 1:12' },
      '神的殿': { text: '你到神的殿要谨慎脚步；因为近前听，胜过愚昧人献祭，他们本不知道所做的是恶。', ref: '传道书 5:1' },
      '传道者的家': { text: '看守房屋的发颤，有力的屈身，推磨的稀少就止息，从窗户往外看的都昏暗；', ref: '传道书 12:3' },
      '金罐': { text: '银链折断，金罐破裂，瓶子在泉旁损坏，水轮在井口破烂，', ref: '传道书 12:6' },
      '破裂的金罐': { text: '银链折断，金罐破裂，瓶子在泉旁损坏，水轮在井口破烂，', ref: '传道书 12:6' },
      '磨': { text: '街门关闭，推磨的响声微小，雀鸟一叫，人就起来，唱歌的女子也都衰微。', ref: '传道书 12:4' },
      '井': { text: '银链折断，金罐破裂，瓶子在泉旁损坏，水轮在井口破烂，', ref: '传道书 12:6' },
      '杏树': { text: '人怕高处，路上有惊慌，杏树开花，蚱蜢成为重担……', ref: '传道书 12:5' },
      '田': { text: '早晨要撒你的种，晚上也不要歇你的手……', ref: '传道书 11:6' },
      '坟': { text: '都归一处，都是出于尘土，也都归于尘土。', ref: '传道书 3:20' },
      '石堆': { text: '抛掷石头有时，堆聚石头有时；', ref: '传道书 3:5' },
      '葡萄园': { text: '我为自己动大工程，建造房屋，栽种葡萄园，', ref: '传道书 2:4' },
      '水池': { text: '挖造水池，用以浇灌嫩小的树木。', ref: '传道书 2:6' },
      '饼和酒': { text: '你只管去欢欢喜喜吃你的饭，心中快乐喝你的酒，因为神已经悦纳你的作为。', ref: '传道书 9:7' },
      '粮食': { text: '当将你的粮食撒在水面，因为日久必能得着。', ref: '传道书 11:1' },
      '重担': { text: '他所劳碌得来的，手中分毫不能带去。', ref: '传道书 5:15' },
      '篝火': { text: '哭有时，笑有时；哀恸有时，跳舞有时；', ref: '传道书 3:4' },
    },
  });
})(window.GS);
