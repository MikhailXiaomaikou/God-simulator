/* ─────────────────────────────────────────────────────────────
 * book/solomon.js —— 列王纪上 · 所罗门（列王纪上 1 — 11）
 *
 * 大卫王年纪老迈；亚多尼雅在隐·罗结旁设筵，自尊说「我必作王」。拔示巴进见，大卫起誓：
 * 所罗门骑王的骡子下到基训，撒督用角里的膏油膏他，吹角，众民欢呼，声音震地；众客四散（1）。
 * 大卫嘱咐所罗门「你当刚强，作大丈夫」，与列祖同睡；所罗门的国甚是坚固（2）。
 * 基遍极大的邱坛，一千牺牲的烟；夜间梦中——「你愿我赐你什么？你可以求」，他求智慧；
 * 神应允他，又赐他所没有求的；两个妇人与一个活孩子：「将活孩子给这妇人」（3）。
 * 智慧如同海沙——岸边的沙一粒一粒亮起；各在自己的葡萄树下和无花果树下安然居住；
 * 他讲论草木、飞禽走兽、昆虫水族（4）。希兰的香柏木扎成筏子浮海而来，山中凿出大石（5）。
 * ★ 殿在寂静中建成：石头在山中凿好，一块一块无声地落在墙上；香柏木的栋梁；全殿贴上金子；
 *   七年；两根铜柱雅斤、波阿斯，铜海立在十二只铜牛上（6—7）。
 * ★ 约柜抬进至圣所，祭司出来——云充满耶和华的殿，荣光充满了殿，祭司不能站立供职（8:10–11）。
 * ★ 所罗门向天举手：「天和天上的天尚且不足你居住的」——夜空里一层一层的天展开（8:27）。
 * 耶和华二次显现：「使我的名永远在其中」——一道光停在至圣所上；俄斐的船运来金子（9）。
 * 示巴女王的驼队，香料、宝石与金子；象牙的宝座，六层台阶上十二个狮子（10）。
 * 所罗门年老，心偏离了——对面山上邱坛的火，殿的金色暗下去；亚希雅把新衣撕成十二片，
 * 耶罗波安拿去十片；夜里，耶路撒冷仍有一盏灯亮着——「在我面前长有灯光」（11）。
 *
 * 画面的方位：近地左 = 基训泉（一道小溪流向海）；中 = 摩利亚山上的殿（门朝东，即朝左），
 *            殿前的院里有铜海与铜坛；右 = 审判的廊与宝座、大卫的床、约柜的帐幕。
 *            中丘：左端是基遍的大邱坛（亦是隐·罗结的筵席与对面山上的邱坛之处）；右边是大卫城与王宫。
 * 神从不画出形像：只有光、云、荣耀与声音。一切位置都以画面宽度的比例记下；
 * 一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const ACT = 'solomon';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LVL = {
    soCity: ['exp', 0.5],      // 大卫城与王宫（中丘）
    soFeast: ['exp', 0.5],     // 亚多尼雅的筵席之火（1:9）
    soBed: ['exp', 0.6],       // 大卫的床（1:47；2:10）
    soTent: ['exp', 0.5],      // 约柜的帐幕（大卫城，8:1）
    soGibeon: ['exp', 0.35],   // 基遍大邱坛上的燔祭（3:4）
    soDream: ['exp', 0.6],     // 夜间梦中（3:5；9:2）
    soPresence: ['exp', 0.45], // 耶和华显现的光（从不画出形像）
    soSand: ['exp', 0.3],      // 如同海沙（4:29）
    soSite: ['exp', 0.4],      // 殿的根基（5:17；6:37）
    soStones: ['exp', 0.5],    // 山中凿成的石头（5:17）
    soLogs: ['exp', 0.5],      // 香柏木（5:10）
    soBuild: ['lin', 0.092],   // 石墙一层一层（6:7）
    soCedar: ['lin', 0.28],    // 香柏木的栋梁（6:9）
    soGold: ['exp', 0.3],      // 全殿都贴上金子（6:22）
    soPillars: ['lin', 0.24],  // 雅斤与波阿斯（7:21）
    soSea: ['exp', 0.4],       // 铜海与铜坛（7:23）
    soFire: ['exp', 0.6],      // 坛上的火（8:5，62）
    soCloud: ['exp', 0.3],     // 云充满耶和华的殿（8:10）
    soGlory: ['exp', 0.35],    // 荣光在殿里（8:11）
    soHeaven: ['exp', 0.2],    // 天和天上的天（8:27）
    soName: ['exp', 0.35],     // 使我的名永远在其中（9:3）
    soThrone: ['exp', 0.4],    // 象牙的宝座（10:18）
    soHigh: ['exp', 0.3],      // 对面山上的邱坛（11:7）
    soDim: ['exp', 0.25],      // 心偏离——殿的金色暗了（11:4，9）
    soLamp: ['exp', 0.4],      // 在我面前长有灯光（11:36）
    soTorch: ['exp', 0.5],     // 会众中间的火把（8:65–66，夜里）
  };
  for (const k in LVL) W.defineLevel(k, LVL[k][0], LVL[k][1]);

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 近地
    gihon: 0.47, logs: 0.425, temple: 0.555, stones: 0.772,
    throne: 0.826, bed: 0.897, tent: 0.967, dream: 0.58,
    // 中丘
    gibeon: 0.532, feast: 0.603, city0: 0.772, city1: 0.996, palace: 0.878,
    // 远山：耶路撒冷对面的山（11:7）——在大卫城之后的远岭上（远岭高于海面线）
    high1: 0.865, high2: 0.935,
  };
  const ROBE = {
    solomon: [70, 68, 140], david: [120, 90, 124], bathsheba: [154, 98, 114], nathan: [94, 98, 118], zadok: [236, 232, 218],
    benaiah: [134, 90, 62], adonijah: [160, 82, 64], priest: [238, 234, 222], woman1: [172, 122, 96], woman2: [124, 108, 124],
    servant: [140, 118, 90], queen: [182, 72, 100], jeroboam: [118, 110, 84], ahijah: [88, 92, 106], rehoboam: [98, 78, 136],
    worker: [150, 122, 92], envoy: [120, 132, 150],
  };
  const KING_ACC = [232, 192, 96], LINEN = [236, 232, 218];
  const WIVES = [[178, 88, 96], [96, 120, 168], [196, 150, 80], [128, 92, 152], [168, 110, 70], [86, 138, 120]];
  const PRIESTS = ['pr1', 'pr2', 'pr3', 'pr4'];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { ark: 'tent', pres: null }; }

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
  const tall = () => W.w / Math.max(1, W.h) < 0.75;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g) * 0.8; };
  const dayA = () => 0.3 + 0.7 * W.daylight;
  // 与近地的人同一比例（成人约高 44 个单位）
  const PK = () => (34 * W.layerScale(2) * (W.w < 600 ? 1.4 : 1) * 1.3) / 44;

  const RT = [];
  (function () { const r = U.mulberry32(1011); for (let i = 0; i < 1024; i++) RT.push(r()); })();
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
  function relabel(id, label) { const f = fig(id); if (f) f.label = label; }
  function prop(id, what) { const c = C(); if (fig(id) && c.prop) U.safe('cast.prop', () => c.prop(id, what || null)); }
  function carry(id, what) { const c = C(); if (fig(id) && c.carry) U.safe('cast.carry', () => c.carry(id, what || null)); }
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function crowd(gid, o) { const c = C(); return c.crowd ? c.crowd(gid, o) : null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function scatter(gid) { if (hasCrowd(gid)) C().scatter(gid); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  // 人群在近地纵深里散开（v 越大越靠前），并可改作全是女子
  function depth(gid, v0, v1, female) {
    const c = C(); if (!c.crowds || !c.crowds.get) return;
    const g = c.crowds.get(gid); if (!g) return;
    g.members.forEach((m, i) => { m.v = lerp(v0, v1, rt(i * 13 + 5)); if (female) { m.sex = 'f'; if (m.age === 'child') m.age = 'adult'; } });
  }
  // 人群让出一段空地（被膏的人站在那里）
  function clearGap(gid, a, b) {
    const c = C(); if (!c.crowds || !c.crowds.get) return;
    const g = c.crowds.get(gid); if (!g) return;
    g.members.forEach((m, i) => { if (m.nx > a && m.nx < b) m.nx = m.nx < (a + b) / 2 ? a - rt(i * 7 + 3) * 0.03 : b + rt(i * 7 + 3) * 0.03; if (m.tx != null) m.tx = m.nx; });
  }
  function ride(id, mount) { const c = C(); if (c.ride && fig(id)) U.safe('cast.ride', () => c.ride(id, mount)); }
  function attach(id, fn) { const c = C(); if (c.attach && fig(id)) c.attach(id, fn); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  function say(b, lines, delay) { if (b.instant) return; GS.ui.narrate(lines, { replace: false, delay: delay || 0 }); }
  // 经文行的开始时刻（秒）：与 ui.narrate 的节奏相同（每行 hold 秒，行间 1.3 秒）
  function starts(verse) {
    const t = [];
    let acc = 0;
    for (const v of verse) { t.push(acc); acc += (v.hold || Math.max(4.2, 1.6 + v.text.length * 0.2)) + 1.3; }
    t.push(acc);
    return t;
  }
  // 地上的走兽绕开主要人物所在的几段
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  const AGE_H = { adult: 1, elder: 0.96, child: 0.62, baby: 0.34 };
  const ACT_K = [1.1, 1.2, 1.3];
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer, bo = W.w < 600 ? 1.4 : 1, ak = ACT_K[l] || 1;
    let x, y;
    if (f.attach && f._ax != null && isFinite(f._ax)) { x = f._ax; y = f._ay; }
    else {
      x = f.nx * W.w;
      const g = gY(l, f.nx), fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
      y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    }
    const h = f.isAnimal ? 22 * W.layerScale(l) * bo * ak * (f.scale || 1) : 34 * W.layerScale(l) * (AGE_H[f.age] || 1) * (f.scale || 1) * bo * ak * (1 + 0.35 * (f.v || 0));
    return [x, y - h * frac];
  }
  function nameAt(x, cy, size, n) {
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    return [clamp(x, half + 8, W.w - half - 8), clamp(cy, size * 0.8 + 8, W.h - size)];
  }
  function chime(str) { const a = au(); if (a && a.nameChime) U.safe('audio.nameChime', () => a.nameChime(str[0])); }
  // 在某人头上聚成几个字（微尘自 src 而来）
  function nameOver(b, id, str, rgb, o) {
    if (b.instant) return;
    o = o || {};
    const p = figPt(id, 1) || [W.w * 0.7, W.h * 0.8];
    const size = (o.size || 0.042) * M(), n = Array.from(str).length;
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = tall() ? p[0] : Math.max(p[0], W.w * 0.49 + half);
    const c = nameAt(cx, p[1] - size * (o.lift || 1.0) - 6, size, n);
    const from = o.src || (() => [p[0] + rand(-50, 50) * SU(), p[1] + rand(-20, 40) * SU()]);
    fx().nameStr(str, c[0], c[1], size, rgb, from, { hold: o.hold || 2.6 });
    chime(str);
  }
  // 在画面某处聚成几个字
  function nameAtPt(b, str, x, y, rgb, src, o) {
    if (b.instant) return;
    o = o || {};
    const size = (o.size || 0.036) * M(), n = Array.from(str).length;
    // 横屏时经文在左边的海上：名字不落进经文框
    if (!tall()) x = Math.max(x, W.w * 0.49 + (size * 1.08 * (n - 1)) / 2 + size * 0.6);
    const c = nameAt(x, y, size, n);
    fx().nameStr(str, c[0], c[1], size, rgb, src || (() => [x + rand(-60, 60) * SU(), y + rand(-30, 60) * SU()]), { hold: o.hold || 2.6, delay: o.delay || 0 });
    chime(str);
  }

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
  // 一朵云：几团柔光叠成，上亮下暖；under = 底下一层淡淡的冷紫（使云有体积）；gold = 整朵染成金色（给 'lighter' 的内光）
  function puff(seed, under, gold) {
    const c = cnv(128, 128), g = c.getContext('2d'), r = U.mulberry32(seed);
    for (let i = 0; i < 11; i++) {
      const a = r() * TAU, d = r() * 28, x = 64 + Math.cos(a) * d, y = 66 + Math.sin(a) * d * 0.62, rad = 20 + r() * 22;
      const gr = g.createRadialGradient(x, y - rad * 0.3, 0, x, y, rad);
      gr.addColorStop(0, 'rgba(255,253,246,0.62)');
      gr.addColorStop(0.5, 'rgba(252,244,226,0.3)');
      gr.addColorStop(1, 'rgba(246,232,206,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
    }
    g.globalCompositeOperation = 'source-atop';
    if (gold) { g.fillStyle = 'rgb(255,208,128)'; g.fillRect(0, 0, 128, 128); }
    else if (under) {
      const v = g.createLinearGradient(0, 30, 0, 110);
      v.addColorStop(0, 'rgba(176,166,214,0)'); v.addColorStop(0.55, U.rgba(176, 166, 214, under * 0.5)); v.addColorStop(1, U.rgba(150, 140, 200, under));
      g.fillStyle = v; g.fillRect(0, 0, 128, 128);
    }
    return c;
  }
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
      smoke: radial([132, 124, 118], 0.8, 0.55), dsmoke: radial([70, 56, 60], 0.85, 0.55), red: radial([230, 76, 56], 1),
      violet: radial([196, 186, 255], 1), sand: radial([255, 238, 196], 1, 0.25),
    };
    SP.puff = [puff(11, 0.36), puff(23, 0.36), puff(37, 0.36)];
    SP.puffV = [puff(11, 0.7), puff(23, 0.7), puff(37, 0.7)];
    SP.puffG = [puff(11, 0, true), puff(23, 0, true), puff(37, 0, true)];
    // 自天而降的光柱
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,248,230,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0.05)'); vt.addColorStop(0.7, 'rgba(0,0,0,0.85)'); vt.addColorStop(1, 'rgba(0,0,0,0.2)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.beam = b;
    // 自天而降、上端渐渐隐入天空的光柱（不从画面顶上截断，免得穿过标题与经文）
    const b2 = cnv(64, 256), g2 = b2.getContext('2d'), hz2 = g2.createLinearGradient(0, 0, 64, 0);
    hz2.addColorStop(0, 'rgba(255,244,214,0)'); hz2.addColorStop(0.5, 'rgba(255,248,230,1)'); hz2.addColorStop(1, 'rgba(255,244,214,0)');
    g2.fillStyle = hz2; g2.fillRect(0, 0, 64, 256);
    g2.globalCompositeOperation = 'destination-in';
    const vt2 = g2.createLinearGradient(0, 0, 0, 256);
    vt2.addColorStop(0, 'rgba(0,0,0,0)'); vt2.addColorStop(0.24, 'rgba(0,0,0,0.5)'); vt2.addColorStop(0.72, 'rgba(0,0,0,0.9)'); vt2.addColorStop(1, 'rgba(0,0,0,0.25)');
    g2.fillStyle = vt2; g2.fillRect(0, 0, 64, 256);
    SP.shaft = b2;
    return SP;
  }
  // 光柱的上端：横屏在标题之下，竖屏在经文之下
  const beamTop = () => (tall() ? W.h * 0.34 : W.h * 0.09);
  function shaft(ctx, x, w, y1, a) {
    const t = beamTop();
    if (a < 0.004 || y1 < t + 8) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(SP.shaft, x - w / 2, t, w, y1 - t);
  }
  function glowSp(ctx, sp, x, y, r, a) {
    if (a < 0.004 || r < 0.5 || !isFinite(x) || !isFinite(y)) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  function flame(ctx, x, y, h, k, seed, red) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    glowSp(ctx, red ? SP.red : SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = red
      ? [[0, 1, 'rgb(200,52,40)', 0.75], [-0.26, 0.68, 'rgb(220,86,48)', 0.7], [0.24, 0.72, 'rgb(190,60,44)', 0.7], [0, 0.5, 'rgb(255,170,110)', 0.8]]
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
  function smoke(ctx, x, y, k, H, w, seed, dark) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 11, day = dark ? 1 : 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.4 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.8);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * 0.42 * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(dark ? SP.dsmoke : SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  function lampGlow(ctx, x, y, r, k, seed) {
    if (k < 0.01) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
    glowSp(ctx, SP.warm, x, y, r, k * fl * 0.55);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  殿：几何（每帧算一次）
  //  坐标以 k 为单位，自廊的前（东）面量起；fy = 台基的顶
  //  廊 0–44 高 118；殿 44–200 高 100；旁屋三层 48–200 高 46（6:3–6）；至圣所 160–200（6:16）
  // ════════════════════════════════════════════════════════════
  const STONE = [234, 221, 194], STONE2 = [214, 198, 168], OPEN = [36, 28, 24];
  const CEDAR = [132, 80, 50], GOLDS = [246, 212, 138], BRONZE = [186, 126, 70];
  const TP = 44, TL = 200, TH_P = 118, TH_H = 100, TH_S = 46, HOLY = 160;
  const TCH = 8, T_NC = 15;
  let TGc = null, TGf = -1;
  function TG() {
    if (TGc && TGf === W.frame && TGc.w === W.w && TGc.h === W.h) return TGc;
    const k = LS(2) * (tall() ? 0.82 : 1.1), x0 = X.temple * W.w, len = TL * k;
    let gmin = Infinity;
    for (let i = 0; i <= 12; i++) { const xf = (x0 - 56 * k + (i / 12) * (len + 64 * k)) / W.w; gmin = Math.min(gmin, gY(2, xf)); }
    TGc = { k, x0, len, x1: x0 + len, fy: gmin - 7 * k, w: W.w, h: W.h };
    TGf = W.frame;
    return TGc;
  }
  const goldK = () => W.lv.soGold * (1 - 0.6 * W.lv.soDim);
  function rowSpan(i) { return (i + 1) * TCH <= TH_H + 0.5 ? [0, TL] : [0, TP]; }
  // 在砌的程度 b 时，下一块石头落下的地方（像素）
  function frontier(b) {
    const G = TG(), tot = clamp(b, 0, 0.9999) * T_NC, row = Math.floor(tot), fr = tot - row, sp = rowSpan(row);
    return [G.x0 + (sp[0] + (sp[1] - sp[0]) * fr) * G.k, G.fy - (row + 0.5) * TCH * G.k];
  }
  const doorX = () => { const G = TG(); return (G.x0 + 22 * G.k) / W.w; };
  const holyX = () => { const G = TG(); return G.x0 + 180 * G.k; };
  const altarX = () => { const G = TG(); return G.x0 - 14 * G.k; };
  const seaX = () => { const G = TG(); return G.x0 - 38 * G.k; };

  // 台基：摩利亚山上凿成的石台，东面有台阶
  function drawPodium(ctx, G) {
    const site = W.lv.soSite;
    if (site < 0.01) return;
    const k = G.k, xa = G.x0 - 56 * k, xb = G.x1 + 8 * k, fy = G.fy;
    ctx.globalAlpha = site;
    ctx.fillStyle = css(STONE2, 2);
    ctx.beginPath();
    ctx.moveTo(xa, fy); ctx.lineTo(xb, fy);
    for (let i = 10; i >= 0; i--) { const xx = xa + ((xb - xa) * i) / 10; ctx.lineTo(xx, gY(2, xx / W.w) + 4 * k); }
    ctx.closePath(); ctx.fill();
    // 台阶
    const gl = gY(2, xa / W.w) + 3 * k, hh = Math.max(0, gl - fy), n = 4;
    for (let i = 0; i < n; i++) {
      const top = fy + (hh * i) / n;
      ctx.fillStyle = css([220, 206, 176], 2);
      ctx.fillRect(xa - (i + 1) * 4.5 * k, top, (i + 1) * 4.5 * k + 1, gl - top);
      ctx.fillStyle = css([252, 244, 222], 2, 0.5 * dayA(), 0.15);
      ctx.fillRect(xa - (i + 1) * 4.5 * k, top, 4.5 * k, 0.8 * k);
    }
    // 石缝与台沿
    ctx.strokeStyle = css([150, 134, 106], 2, 0.35); ctx.lineWidth = Math.max(0.5, 0.6 * k);
    ctx.beginPath();
    for (let x = xa + 12 * k; x < xb; x += 22 * k) { ctx.moveTo(x, fy + 1.5 * k); ctx.lineTo(x, fy + 7 * k); }
    ctx.moveTo(xa, fy + 4.2 * k); ctx.lineTo(xb, fy + 4.2 * k);
    ctx.stroke();
    ctx.fillStyle = css([252, 242, 218], 2, 0.75 * dayA(), 0.15);
    ctx.fillRect(xa, fy - 0.8 * k, xb - xa, 1.6 * k);
    ctx.globalAlpha = 1;
  }

  // 墙：一层一层地砌起（在砌成的范围之内画出整座殿）
  function drawWalls(ctx, G) {
    const b = W.lv.soBuild;
    if (b < 0.002) return;
    const k = G.k, x0 = G.x0, fy = G.fy, gold = goldK(), done = b > 0.999;
    const tot = b * T_NC, full = Math.floor(tot), fr = tot - full;
    ctx.save();
    if (!done) {
      ctx.beginPath();
      ctx.rect(x0 - 2, fy - full * TCH * k, TL * k + 4, full * TCH * k + 2);
      if (full < T_NC) { const sp = rowSpan(full); ctx.rect(x0 + sp[0] * k - 1, fy - (full + 1) * TCH * k, (sp[1] - sp[0]) * k * fr + 1, TCH * k + 0.5); }
      ctx.clip();
    }
    const st = U.mixRGB(STONE, GOLDS, 0.32 * gold), st2 = U.mixRGB(STONE2, GOLDS, 0.28 * gold), trim = U.mixRGB([244, 234, 210], GOLDS, 0.5 * gold);
    const d = litX() >= x0 + 100 * k ? 1 : -1;
    // 廊与殿
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(x0, fy - TH_P * k, TP * k, TH_P * k);
    ctx.fillRect(x0 + TP * k, fy - TH_H * k, (TL - TP) * k, TH_H * k);
    // 背光的一面
    ctx.fillStyle = css([112, 98, 90], 2, 0.26);
    if (d > 0) ctx.fillRect(x0 + (TL - 12) * k, fy - TH_H * k, 12 * k, TH_H * k);
    else ctx.fillRect(x0, fy - TH_P * k, 9 * k, TH_P * k);
    // 廊：两旁的壁柱、门周围凹进的框
    ctx.fillStyle = css(trim, 2);
    ctx.fillRect(x0, fy - TH_P * k, 3 * k, TH_P * k);
    ctx.fillRect(x0 + (TP - 3) * k, fy - TH_P * k, 3 * k, TH_P * k);
    ctx.fillStyle = css(U.mixRGB([200, 184, 154], GOLDS, 0.3 * gold), 2);
    ctx.fillRect(x0 + 9 * k, fy - 80 * k, 26 * k, 80 * k);
    ctx.fillStyle = css(st, 2);
    ctx.fillRect(x0 + 11 * k, fy - 78 * k, 22 * k, 78 * k);
    // 至圣所：殿后部，稍稍突出的壁柱（6:16）
    ctx.fillStyle = css(trim, 2, 0.8);
    ctx.fillRect(x0 + HOLY * k, fy - TH_H * k, 2.4 * k, (TH_H - TH_S) * k);
    ctx.fillRect(x0 + (TL - 2.4) * k, fy - TH_H * k, 2.4 * k, TH_H * k);
    // 旁屋（三层，6:5–6）
    ctx.fillStyle = css(st2, 2);
    ctx.fillRect(x0 + (TP + 4) * k, fy - TH_S * k, (TL - TP - 4) * k, TH_S * k);
    ctx.fillStyle = css([250, 242, 220], 2, 0.5 * dayA(), 0.1);
    for (const yy of [15.3, 30.6]) ctx.fillRect(x0 + (TP + 4) * k, fy - yy * k - 1.1 * k, (TL - TP - 4) * k, 1.1 * k);
    ctx.fillStyle = css([150, 132, 106], 2, 0.35);
    for (const yy of [15.3, 30.6]) ctx.fillRect(x0 + (TP + 4) * k, fy - yy * k, (TL - TP - 4) * k, 0.7 * k);
    // 旁屋的门（6:8）
    ctx.fillStyle = css(OPEN, 2, 0.9);
    ctx.fillRect(x0 + 118 * k, fy - 11 * k, 5 * k, 11 * k);
    // 殿的高窗：严紧的窗棂（6:4）
    const WX = [];
    for (let i = 0; i < 6; i++) WX.push(x0 + (60 + i * 23) * k);
    ctx.fillStyle = css(OPEN, 2);
    for (const wx of WX) ctx.fillRect(wx, fy - 91 * k, 4.2 * k, 13 * k);
    ctx.fillStyle = css(U.mixRGB(CEDAR, GOLDS, 0.55 * gold), 2, 0.95);
    for (const wx of WX) { ctx.fillRect(wx, fy - 85 * k, 4.2 * k, 0.8 * k); ctx.fillRect(wx + 1.7 * k, fy - 91 * k, 0.8 * k, 13 * k); }
    // 门：橄榄木的门扇包着金子（6:31–35）
    const dx0 = x0 + 14 * k, dx1 = x0 + 30 * k, dtop = fy - 66 * k;
    ctx.fillStyle = css(OPEN, 2);
    ctx.fillRect(dx0, dtop, dx1 - dx0, fy - dtop);
    const leaf = U.mixRGB([156, 112, 64], GOLDS, 0.35 + 0.6 * gold);
    ctx.fillStyle = css(leaf, 2, 1, 0.05);
    ctx.fillRect(dx0, dtop, 3.4 * k, fy - dtop);
    ctx.fillRect(dx1 - 3.4 * k, dtop, 3.4 * k, fy - dtop);
    ctx.fillStyle = css(U.mixRGB([204, 176, 124], GOLDS, gold), 2);
    ctx.fillRect(dx0 - 3 * k, dtop - 4 * k, dx1 - dx0 + 6 * k, 4 * k);
    // 石缝：大块凿好的石头
    const jointA = 0.22 * (1 - 0.5 * gold);
    ctx.strokeStyle = css([140, 122, 96], 2, jointA); ctx.lineWidth = Math.max(0.4, 0.5 * k);
    ctx.beginPath();
    const rows = done ? T_NC : Math.min(T_NC, full + 1);
    for (let i = 1; i <= rows; i++) {
      const yy = fy - i * TCH * k, sp = rowSpan(i - 1), top = i * TCH;
      if (top <= TH_P) { ctx.moveTo(x0 + sp[0] * k, yy); ctx.lineTo(x0 + (top <= TH_H ? TL : TP) * k, yy); }
      const off = (i % 2) * 11;
      for (let xx = sp[0] + 4 + off; xx < sp[1] - 2; xx += 22) {
        if (xx > 9 && xx < 35 && top <= 80) continue;
        ctx.moveTo(x0 + xx * k, yy); ctx.lineTo(x0 + xx * k, yy + TCH * k);
      }
    }
    ctx.stroke();
    // 迎光一边的亮边
    ctx.globalAlpha = 0.55 * dayA();
    ctx.strokeStyle = css([255, 246, 226], 2, 1, 0.25); ctx.lineWidth = Math.max(0.6, 1 * k);
    ctx.beginPath();
    if (d < 0) { ctx.moveTo(x0 + 0.5, fy); ctx.lineTo(x0 + 0.5, fy - TH_P * k); } else { ctx.moveTo(x0 + TL * k - 0.5, fy); ctx.lineTo(x0 + TL * k - 0.5, fy - TH_H * k); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    // 窗与门里的光：灯台（7:49）、荣光（8:11）、至圣所里的名（9:3）
    if (b > 0.97) {
      const glory = W.lv.soGlory, name = W.lv.soName * (1 - 0.5 * W.lv.soDim), dim = 1 - 0.55 * W.lv.soDim;
      const lamp = (0.15 + 0.85 * nightK()) * Math.min(1, gold * 1.4) * 0.55 * dim;
      const lk = Math.min(1.2, lamp + glory * 0.8 * dim);
      if (lk > 0.02 || name > 0.02) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < WX.length; i++) {
          const inHoly = WX[i] > x0 + HOLY * k ? name : 0;
          const a = Math.min(1, lk + inHoly * 0.9) * (0.85 + 0.15 * Math.sin(W.t * 1.3 + i));
          if (a < 0.02) continue;
          ctx.globalAlpha = a * 0.8;
          ctx.fillStyle = glory > 0.3 ? 'rgb(255,244,214)' : 'rgb(255,208,130)';
          ctx.fillRect(WX[i], fy - 91 * k, 4.2 * k, 13 * k);
          glowSp(ctx, glory > 0.3 ? SP.gold : SP.warm, WX[i] + 2.1 * k, fy - 84 * k, (12 + 14 * glory) * k, a * 0.32);
        }
        // 大卫的灯点着时，门里暗下来，只剩那一盏灯（11:36）
        const da = Math.min(1, lk * 0.9 + (S.ark === 'temple' ? 0.25 : 0) * (0.3 + 0.7 * nightK())) * clamp(1 - (W.lv.soLamp - 0.3) / 0.5, 0, 1);
        if (da > 0.02) {
          ctx.globalAlpha = da * 0.75;
          ctx.fillStyle = 'rgb(255,224,156)';
          ctx.fillRect(dx0 + 3.4 * k, dtop, dx1 - dx0 - 6.8 * k, fy - dtop);
          glowSp(ctx, SP.gold, (dx0 + dx1) / 2, fy - 32 * k, (26 + 30 * glory) * k, da * 0.4);
        }
        if (name > 0.02) glowSp(ctx, SP.gold, holyX(), fy - 74 * k, 56 * k, name * (0.18 + 0.3 * nightK()));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
  }

  // 香柏木的栋梁与檐（自左向右铺上）
  function drawRoof(ctx, G) {
    const c = W.lv.soCedar;
    if (c < 0.005 || W.lv.soBuild < 0.9) return;
    const k = G.k, x0 = G.x0, fy = G.fy, gold = goldK();
    const reach = x0 - 4 * k + (TL + 10) * k * c;
    ctx.save();
    ctx.beginPath(); ctx.rect(x0 - 5 * k, 0, reach - (x0 - 5 * k), W.h); ctx.clip();
    const cd = U.mixRGB(CEDAR, GOLDS, 0.5 * gold), cap = U.mixRGB([238, 226, 198], GOLDS, 0.45 * gold);
    // 檐：香柏木的梁，其上一道石的压顶
    ctx.fillStyle = css(cd, 2);
    ctx.fillRect(x0 - 3 * k, fy - (TH_P + 5) * k, (TP + 6) * k, 5 * k);
    ctx.fillRect(x0 + TP * k, fy - (TH_H + 4.4) * k, (TL - TP + 2.5) * k, 4.4 * k);
    ctx.fillRect(x0 + (TP + 2) * k, fy - (TH_S + 3.2) * k, (TL - TP + 0.5) * k, 3.2 * k);
    ctx.fillStyle = css(cap, 2);
    ctx.fillRect(x0 - 4 * k, fy - (TH_P + 7.4) * k, (TP + 8) * k, 2.6 * k);
    ctx.fillRect(x0 + (TP - 1) * k, fy - (TH_H + 6.6) * k, (TL - TP + 4.5) * k, 2.4 * k);
    ctx.fillRect(x0 + 10 * k, fy - (TH_P + 11) * k, (TP - 20) * k, 3.8 * k);
    // 梁头（6:6，10）
    ctx.fillStyle = css(U.mixRGB([104, 62, 40], GOLDS, 0.4 * gold), 2);
    for (let xx = TP + 3; xx < TL; xx += 6) ctx.fillRect(x0 + xx * k, fy - (TH_H - 0.4) * k, 2.4 * k, 2.4 * k);
    for (let xx = TP + 5; xx < TL; xx += 7) ctx.fillRect(x0 + xx * k, fy - (TH_S - 0.2) * k, 2 * k, 1.8 * k);
    // 金边
    if (gold > 0.02) {
      ctx.fillStyle = css(GOLDS, 2, gold * 0.95, 0.25);
      ctx.fillRect(x0 - 3 * k, fy - TH_P * k - 0.9 * k, (TP + 6) * k, 0.9 * k);
      ctx.fillRect(x0 + TP * k, fy - TH_H * k - 0.9 * k, (TL - TP + 2.5) * k, 0.9 * k);
      ctx.fillRect(x0 + (TP + 2) * k, fy - TH_S * k - 0.8 * k, (TL - TP + 0.5) * k, 0.8 * k);
    }
    ctx.globalAlpha = 0.55 * dayA();
    ctx.fillStyle = css([255, 244, 220], 2, 1, 0.3);
    ctx.fillRect(x0 - 4 * k, fy - (TH_P + 7.4) * k, (TP + 8) * k, 0.8 * k);
    ctx.fillRect(x0 + (TP - 1) * k, fy - (TH_H + 6.6) * k, (TL - TP + 4.5) * k, 0.8 * k);
    ctx.fillRect(x0 + 10 * k, fy - (TH_P + 11) * k, (TP - 20) * k, 0.8 * k);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // 两根铜柱：波阿斯（左）与雅斤（右）（7:15–22）
  const PILLAR_X = [5, 39];
  function drawPillars(ctx, G) {
    const pl = W.lv.soPillars;
    if (pl < 0.005) return;
    const k = G.k, fy = G.fy, d = litX() >= G.x0 ? 1 : -1;
    const H = 96 * k * pl, shaft = 76 * k, w = 4.1 * k;
    for (let n = 0; n < 2; n++) {
      const cx = G.x0 + PILLAR_X[n] * k;
      const sh = Math.min(H, shaft);
      ctx.fillStyle = css(BRONZE, 2);
      ctx.fillRect(cx - w, fy - sh, w * 2, sh);
      ctx.fillStyle = css([96, 60, 34], 2, 0.45);
      ctx.fillRect(d > 0 ? cx - w : cx + w * 0.35, fy - sh, w * 0.65, sh);
      ctx.fillStyle = css([255, 218, 156], 2, 0.6 * dayA(), 0.2);
      ctx.fillRect(d > 0 ? cx + w * 0.4 : cx - w * 0.75, fy - sh, w * 0.35, sh);
      // 柱础
      ctx.fillStyle = css([150, 98, 54], 2);
      ctx.fillRect(cx - w * 1.5, fy - 3.4 * k, w * 3, 3.4 * k);
      if (H > shaft) {
        const ch = H - shaft, top = fy - H, cw = w * 1.75;
        // 柱顶：如球的顶，罩着网子，两行石榴，上刻百合花（7:16–22）
        ctx.fillStyle = css([164, 106, 58], 2);
        ctx.fillRect(cx - w * 1.25, fy - shaft - 1.6 * k, w * 2.5, 1.6 * k);
        ctx.fillStyle = css(BRONZE, 2);
        ctx.beginPath();
        ctx.moveTo(cx - w * 1.1, fy - shaft - 1.4 * k);
        ctx.bezierCurveTo(cx - cw * 1.25, fy - shaft - ch * 0.35, cx - cw * 1.15, top + ch * 0.35, cx - cw * 0.8, top + ch * 0.18);
        ctx.lineTo(cx + cw * 0.8, top + ch * 0.18);
        ctx.bezierCurveTo(cx + cw * 1.15, top + ch * 0.35, cx + cw * 1.25, fy - shaft - ch * 0.35, cx + w * 1.1, fy - shaft - 1.4 * k);
        ctx.closePath(); ctx.fill();
        if (ch > 6 * k) {
          ctx.strokeStyle = css([112, 70, 38], 2, 0.55); ctx.lineWidth = Math.max(0.4, 0.4 * k);
          ctx.beginPath();
          for (let i = -2; i <= 2; i++) { ctx.moveTo(cx + i * cw * 0.34 - cw * 0.3, fy - shaft - ch * 0.12); ctx.lineTo(cx + i * cw * 0.34 + cw * 0.3, top + ch * 0.45); }
          ctx.stroke();
          ctx.fillStyle = css([222, 156, 92], 2, 0.95, 0.12);
          for (const rr of [0.28, 0.5]) for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(cx + i * cw * 0.4, fy - shaft - ch * rr, 0.85 * k, 0, TAU); ctx.fill(); }
          // 百合花
          ctx.fillStyle = css([232, 178, 108], 2, 1, 0.15);
          for (let i = -2; i <= 2; i++) {
            const px = cx + i * cw * 0.34, py = top + ch * 0.2, lh = (4.4 - Math.abs(i) * 0.8) * k;
            ctx.beginPath(); ctx.moveTo(px - 1.3 * k, py); ctx.quadraticCurveTo(px - 0.6 * k, py - lh * 0.7, px, py - lh); ctx.quadraticCurveTo(px + 0.6 * k, py - lh * 0.7, px + 1.3 * k, py); ctx.closePath(); ctx.fill();
          }
        }
        if (W.lv.soGold > 0.2) {
          SP || sprites();
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.gold, cx, top + ch * 0.45, 10 * k, 0.1 + 0.2 * nightK());
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // 铜海：圆的，立在十二只铜牛上，牛尾都向内（7:23–26）
  function drawBronzeSea(ctx, G) {
    const s = W.lv.soSea;
    if (s < 0.01) return;
    const k = G.k, x = seaX(), y = G.fy, rw = 15 * k * (0.6 + 0.4 * s);
    ctx.globalAlpha = s;
    ctx.fillStyle = css([150, 98, 54], 2);
    for (const o of [[-10, -1], [-3.5, -1], [3.5, 1], [10, 1]]) {
      const ox = x + o[0] * k, dir = o[1], by = y - 3.2 * k;
      ctx.fillRect(ox - 3.2 * k, by - 3.6 * k, 6.4 * k, 3.6 * k);
      ctx.fillRect(ox - 2.8 * k, by, 1.1 * k, 3.2 * k); ctx.fillRect(ox + 1.7 * k, by, 1.1 * k, 3.2 * k);
      ctx.beginPath();
      ctx.moveTo(ox + dir * 3.2 * k, by - 3.4 * k); ctx.lineTo(ox + dir * 5.4 * k, by - 2.6 * k); ctx.lineTo(ox + dir * 5.2 * k, by - 0.8 * k); ctx.lineTo(ox + dir * 3 * k, by - 1.2 * k); ctx.closePath(); ctx.fill();
      ctx.fillRect(ox + dir * 4.2 * k - 0.4 * k, by - 5 * k, 0.8 * k, 1.8 * k);
    }
    const top = y - 17 * k, bot = y - 7 * k;
    ctx.fillStyle = css(BRONZE, 2);
    ctx.beginPath();
    ctx.moveTo(x - rw * 1.08, top);
    ctx.quadraticCurveTo(x - rw * 0.98, bot + 0.5 * k, x, bot);
    ctx.quadraticCurveTo(x + rw * 0.98, bot + 0.5 * k, x + rw * 1.08, top);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([228, 172, 106], 2, 0.9, 0.15);
    ctx.fillRect(x - rw * 1.1, top - 1 * k, rw * 2.2, 1.3 * k);
    ctx.fillStyle = css([120, 76, 40], 2, 0.6);
    for (const rr of [0.35, 0.62]) for (let i = -6; i <= 6; i++) {
      const px = x + i * rw * 0.14 * (1 - rr * 0.3), py = top + (bot - top) * rr;
      ctx.beginPath(); ctx.arc(px, py, 0.6 * k, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = css([200, 222, 240], 2, 0.5 * dayA(), 0.2);
    ctx.beginPath(); ctx.ellipse(x, top - 0.2 * k, rw * 0.95, 1 * k, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 铜坛：燔祭的坛，四角有角（8:64）
  function drawAltar(ctx, G) {
    const s = W.lv.soSea;
    if (s < 0.01) return;
    const k = G.k, x = altarX(), y = G.fy;
    ctx.globalAlpha = s;
    ctx.fillStyle = css([160, 104, 58], 2);
    ctx.fillRect(x - 11 * k, y - 4 * k, 22 * k, 4 * k);
    ctx.fillRect(x - 9.2 * k, y - 10 * k, 18.4 * k, 6.2 * k);
    ctx.fillRect(x - 7.8 * k, y - 14 * k, 15.6 * k, 4.2 * k);
    ctx.fillRect(x - 8.4 * k, y - 16.2 * k, 2.6 * k, 2.4 * k); ctx.fillRect(x + 5.8 * k, y - 16.2 * k, 2.6 * k, 2.4 * k);
    ctx.fillStyle = css([236, 180, 110], 2, 0.6 * dayA(), 0.2);
    ctx.fillRect(x - 9.2 * k, y - 10 * k, 18.4 * k, 0.9 * k); ctx.fillRect(x - 7.8 * k, y - 14 * k, 15.6 * k, 0.8 * k);
    ctx.globalAlpha = 1;
    const f = W.lv.soFire * s;
    if (f > 0.01) {
      smoke(ctx, x, y - 20 * k, f, 150 * k + W.h * 0.12, 7 * k, 3.1);
      flame(ctx, x, y - 13.6 * k, 12 * k, f, 3.1);
    }
  }

  // 殿的一切（近地）
  function drawTemple(ctx) {
    const G = TG();
    drawPodium(ctx, G);
    drawWalls(ctx, G);
    drawRoof(ctx, G);
    drawPillars(ctx, G);
    drawBronzeSea(ctx, G);
    drawAltar(ctx, G);
    drawDimVeil(ctx, G);
    drawLampstand(ctx, G);
  }
  // 心偏离：殿上罩着一层灰暗（11:4–9）
  function drawDimVeil(ctx, G) {
    const d = W.lv.soDim;
    if (d < 0.01 || W.lv.soBuild < 0.5) return;
    const k = G.k;
    ctx.fillStyle = U.rgba(46, 40, 70, 0.24 * d);
    ctx.fillRect(G.x0 - 4 * k, G.fy - (TH_P + 11) * k, (TP + 8) * k, (TH_P + 11) * k);
    ctx.fillRect(G.x0 + TP * k, G.fy - (TH_H + 7) * k, (TL - TP + 4.5) * k, (TH_H + 7) * k);
  }
  // 大卫的灯：殿门前一座小灯台（11:36）
  function lampPt() { const G = TG(); return [G.x0 + 22 * G.k, G.fy]; }
  function drawLampstand(ctx, G) {
    const L = W.lv.soLamp;
    if (L < 0.01) return;
    const k = G.k, p = lampPt(), x = p[0], y = p[1];
    ctx.globalAlpha = Math.min(1, L * 1.5);
    ctx.strokeStyle = css(GOLDS, 2, 1, 0.2); ctx.lineWidth = Math.max(0.7, 1 * k);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 14 * k); ctx.moveTo(x - 3.4 * k, y); ctx.lineTo(x + 3.4 * k, y); ctx.stroke();
    ctx.fillStyle = css(GOLDS, 2, 1, 0.2);
    ctx.beginPath(); ctx.ellipse(x, y - 14.5 * k, 2.8 * k, 1.2 * k, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    flame(ctx, x, y - 15.2 * k, 7.5 * k, L, 7.7);
  }

  // ════════════════════════════════════════════════════════════
  //  近地的其余：基训泉、香柏木、石头、审判的廊与宝座、床、帐幕、约柜
  // ════════════════════════════════════════════════════════════
  function drawGihon(ctx) {
    const s = PK(), x = X.gihon * W.w, y = fieldY(X.gihon, 0.1), rw = 15 * s, rh = 3.4 * s;
    // 小溪：自泉向左下流向海
    const ex = (X.gihon - 0.06) * W.w, ey = fieldY(X.gihon - 0.06, 0.5);
    ctx.strokeStyle = css([64, 100, 138], 2, 0.9); ctx.lineWidth = Math.max(1, 2.4 * s); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - rw * 0.7, y + rh * 0.4); ctx.quadraticCurveTo(x - rw * 1.6, y + 9 * s, ex, ey); ctx.stroke();
    ctx.strokeStyle = css([200, 226, 246], 2, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.setLineDash([3 * s, 5 * s]); ctx.lineDashOffset = -W.t * 12 * s;
    ctx.beginPath(); ctx.moveTo(x - rw * 0.7, y + rh * 0.4); ctx.quadraticCurveTo(x - rw * 1.6, y + 9 * s, ex, ey); ctx.stroke();
    ctx.setLineDash([]);
    // 石岸与泉水
    ctx.fillStyle = css([140, 128, 108], 2);
    ctx.beginPath(); ctx.ellipse(x, y, rw * 1.12, rh * 1.5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([58, 98, 136], 2);
    ctx.beginPath(); ctx.ellipse(x, y + rh * 0.1, rw, rh, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([210, 232, 250], 2, 0.4 * dayA() + 0.15 * nightK(), 0.25);
    const sh = Math.sin(W.t * 1.4);
    ctx.fillRect(x - rw * 0.5 + sh * rw * 0.1, y - rh * 0.2, rw * 0.6, 0.8 * s);
    ctx.fillRect(x - rw * 0.2 - sh * rw * 0.1, y + rh * 0.35, rw * 0.4, 0.6 * s);
  }
  // 希兰的香柏木，从筏子上卸下，堆在岸边（5:9–10）：一垛 3-2-1 的木头，截面朝外
  function drawLogs(ctx) {
    const a = W.lv.soLogs * (1 - W.lv.soCedar);
    if (a < 0.01) return;
    const s = PK() * 1.5, x = X.logs * W.w, y = fieldY(X.logs, 0.1);
    const n = Math.max(1, Math.round(6 * a)), r0 = 1.9 * s;
    let i = 0;
    for (let row = 0; row < 3; row++) for (let j = 0; j < 3 - row && i < n; j++, i++) {
      const cx = x + (j - (2 - row) / 2) * r0 * 2.05 - 8 * s, cy = y - r0 - row * r0 * 1.75;
      ctx.fillStyle = css(row % 2 ? [124, 76, 48] : CEDAR, 2);
      ctx.fillRect(cx, cy - r0, 16 * s, r0 * 2);
      ctx.fillStyle = css([236, 206, 160], 2, 0.35 * dayA(), 0.1);
      ctx.fillRect(cx, cy - r0, 16 * s, 0.5 * s);
      ctx.fillStyle = css([200, 154, 106], 2);
      ctx.beginPath(); ctx.ellipse(cx, cy, r0 * 0.62, r0, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = css([150, 104, 70], 2, 0.75); ctx.lineWidth = Math.max(0.4, 0.4 * s);
      ctx.beginPath(); ctx.ellipse(cx, cy, r0 * 0.3, r0 * 0.5, 0, 0, TAU); ctx.stroke();
    }
  }
  // 山中凿成的大石（5:17）：堆在殿地旁，砌墙时渐渐用尽
  function drawStones(ctx) {
    const a = W.lv.soStones * (1 - W.lv.soBuild);
    if (a < 0.01) return;
    const s = PK(), x = X.stones * W.w, y = fieldY(X.stones, 0.3);
    const n = Math.max(1, Math.round(9 * a));
    const P = [[-9, 0], [0, 0], [9, 0], [-4.5, 1], [4.5, 1], [0, 2], [-13.5, 0], [13.5, 0], [-9, 1]];
    for (let i = 0; i < n; i++) {
      const bx = x + P[i][0] * s, by = y - P[i][1] * 5 * s;
      ctx.fillStyle = css(i % 3 ? STONE : STONE2, 2);
      ctx.fillRect(bx - 4.4 * s, by - 5 * s, 8.8 * s, 5 * s);
      ctx.fillStyle = css([255, 246, 226], 2, 0.4 * dayA(), 0.2);
      ctx.fillRect(bx - 4.4 * s, by - 5 * s, 8.8 * s, 0.7 * s);
    }
  }

  // 审判的廊（7:7）与宝座（10:18–20）
  const STEP = 1.8;
  function seatFoot() { const k = PK(); return [X.throne * W.w, gY(2, X.throne) + 1.5 * k - 6 * STEP * k]; }
  function drawPavilion(ctx) {
    const k = PK(), x = X.throne * W.w, y = gY(2, X.throne) + 1.5 * k, iv = W.lv.soThrone;
    const d = litX() >= x ? 1 : -1;
    // 宝座后的朱红帷子，金边
    ctx.fillStyle = css([150, 54, 62], 2);
    ctx.fillRect(x - 16 * k, y - 56 * k, 32 * k, 56 * k - 6 * STEP * k);
    ctx.fillStyle = css([176, 76, 80], 2, 0.55);
    for (let i = 0; i < 4; i++) ctx.fillRect(x - 13 * k + i * 8.4 * k, y - 55 * k, 1.1 * k, 48 * k);
    ctx.fillStyle = css(GOLDS, 2, 0.9, 0.15);
    ctx.fillRect(x - 16 * k, y - 56 * k, 32 * k, 1.4 * k);
    ctx.fillRect(x - 16 * k, y - 56 * k, 1 * k, 56 * k - 6 * STEP * k); ctx.fillRect(x + 15 * k, y - 56 * k, 1 * k, 56 * k - 6 * STEP * k);
    // 香柏木的柱与顶（审判的廊，7:7）
    ctx.fillStyle = css([140, 92, 60], 2);
    for (const cx of [-30, 30]) ctx.fillRect(x + cx * k - 2 * k, y - 62 * k, 4 * k, 62 * k);
    ctx.fillStyle = css([164, 112, 74], 2);
    for (const cx of [-30, 30]) { ctx.fillRect(x + cx * k - 3 * k, y - 62 * k, 6 * k, 2 * k); ctx.fillRect(x + cx * k - 3 * k, y - 2 * k, 6 * k, 2 * k); }
    ctx.fillStyle = css([230, 218, 190], 2);
    ctx.beginPath(); ctx.moveTo(x - 38 * k, y - 62 * k); ctx.lineTo(x - 34 * k, y - 69 * k); ctx.lineTo(x + 34 * k, y - 69 * k); ctx.lineTo(x + 38 * k, y - 62 * k); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([140, 92, 60], 2);
    ctx.fillRect(x - 36 * k, y - 62.6 * k, 72 * k, 2.2 * k);
    ctx.fillStyle = css(GOLDS, 2, 0.5 + 0.5 * iv, 0.15);
    ctx.fillRect(x - 34 * k, y - 69.8 * k, 68 * k, 0.9 * k);
    ctx.fillStyle = css([255, 244, 222], 2, 0.5 * dayA(), 0.25);
    ctx.fillRect(d > 0 ? x + 31 * k : x - 32 * k, y - 62 * k, 1 * k, 62 * k);
    // 六层台阶（10:19）
    const ST = U.mixRGB([196, 180, 150], [244, 236, 216], iv);
    for (let i = 0; i < 6; i++) {
      const hw = (22 - i * 2.4) * k;
      ctx.fillStyle = css(ST, 2);
      ctx.fillRect(x - hw, y - (i + 1) * STEP * k, hw * 2, STEP * k + 0.5);
      ctx.fillStyle = css([255, 248, 230], 2, 0.45 * dayA(), 0.2);
      ctx.fillRect(x - hw, y - (i + 1) * STEP * k, hw * 2, 0.5 * k);
    }
    const top = y - 6 * STEP * k;
    // 宝座：座的后背是圆的，两旁有扶手（10:19）
    const TC = U.mixRGB([126, 88, 60], [244, 238, 222], iv);
    ctx.fillStyle = css(TC, 2);
    ctx.beginPath();
    ctx.moveTo(x - 7 * k, top - 12 * k);
    ctx.lineTo(x - 7 * k, top - 30 * k);
    ctx.quadraticCurveTo(x - 7 * k, top - 37 * k, x, top - 37 * k);
    ctx.quadraticCurveTo(x + 7 * k, top - 37 * k, x + 7 * k, top - 30 * k);
    ctx.lineTo(x + 7 * k, top - 12 * k);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(x - 10 * k, top - 12.5 * k, 20 * k, 2.6 * k);
    ctx.fillRect(x - 9 * k, top - 10 * k, 1.8 * k, 10 * k); ctx.fillRect(x + 7.2 * k, top - 10 * k, 1.8 * k, 10 * k);
    ctx.fillRect(x - 11 * k, top - 18.5 * k, 3.6 * k, 1.6 * k); ctx.fillRect(x + 7.4 * k, top - 18.5 * k, 3.6 * k, 1.6 * k);
    ctx.fillStyle = css(GOLDS, 2, 0.5 + 0.5 * iv, 0.15);
    ctx.fillRect(x - 7 * k, top - 30.5 * k, 14 * k, 0.9 * k);
    ctx.fillRect(x - 10 * k, top - 12.5 * k, 20 * k, 0.8 * k);
    // 十二个狮子站在台阶上，每层两个；扶手旁两个狮子（10:19–20）
    if (iv > 0.02) {
      ctx.globalAlpha = iv;
      ctx.fillStyle = css(GOLDS, 2, 1, 0.1);
      const lionFill = css(GOLDS, 2, 1, 0.1), lionLine = css([132, 92, 40], 2, 0.85);
      ctx.lineWidth = 1;
      const lion = (lx, ly, dir, sc) => {
        const u = k * sc;
        ctx.beginPath(); ctx.ellipse(lx, ly - 2.2 * u, 2.4 * u, 1.3 * u, 0, 0, TAU);
        ctx.moveTo(lx + dir * 2.3 * u + 1.35 * u, ly - 3.4 * u); ctx.arc(lx + dir * 2.3 * u, ly - 3.4 * u, 1.35 * u, 0, TAU);
        ctx.rect(lx - 2 * u, ly - 1.4 * u, 0.7 * u, 1.4 * u); ctx.rect(lx + 1.3 * u, ly - 1.4 * u, 0.7 * u, 1.4 * u);
        ctx.strokeStyle = lionLine; ctx.stroke();
        ctx.fillStyle = lionFill; ctx.fill();
      };
      for (let i = 0; i < 6; i++) {
        const hw = (22 - i * 2.4) * k, ly = y - (i + 1) * STEP * k;
        lion(x - hw + 2.2 * k, ly, 1, 1); lion(x + hw - 2.2 * k, ly, -1, 1);
      }
      lion(x - 12.5 * k, top - 10 * k, 1, 1.05); lion(x + 12.5 * k, top - 10 * k, -1, 1.05);
      ctx.globalAlpha = 1;
      if (iv > 0.3) {
        SP || sprites();
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.gold, x, top - 20 * k, 40 * k, iv * (0.16 + 0.2 * nightK()));
        glowSp(ctx, SP.warm, x, top - 4 * k, 28 * k, iv * (0.1 + 0.12 * nightK()));
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
      }
    }
    // 廊里的灯
    lampGlow(ctx, x - 20 * k, y - 50 * k, 22 * k, nightK() * 1.1, 3);
    lampGlow(ctx, x + 20 * k, y - 50 * k, 22 * k, nightK() * 1.1, 5);
  }
  // 大卫的床（1:47；2:10）
  function bedFoot() { const k = PK(); return [X.bed * W.w, fieldY(X.bed, 0.22) - 7.4 * k]; }
  function drawBed(ctx) {
    const a = W.lv.soBed;
    if (a < 0.01) return;
    const k = PK(), x = X.bed * W.w, y = fieldY(X.bed, 0.22), hw = 14 * k, top = y - 6.4 * k;
    ctx.globalAlpha = a;
    ctx.strokeStyle = css([96, 70, 46], 2); ctx.lineWidth = Math.max(0.8, 1.4 * k); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const q of [-0.9, 0.9]) { ctx.moveTo(x + q * hw, top); ctx.lineTo(x + q * hw, y); }
    ctx.moveTo(x + 0.9 * hw, top - 5 * k); ctx.lineTo(x + 0.9 * hw, top);
    ctx.stroke();
    ctx.fillStyle = css([112, 84, 58], 2);
    ctx.fillRect(x - hw, top - 1 * k, hw * 2, 2 * k);
    ctx.fillStyle = css([226, 214, 190], 2);
    ctx.fillRect(x - hw * 0.95, top - 2.6 * k, hw * 1.9, 1.8 * k);
    ctx.fillStyle = css([150, 92, 110], 2);
    ctx.fillRect(x - hw * 0.4, top - 2.9 * k, hw * 1.3, 1.6 * k);
    ctx.fillStyle = css([236, 228, 210], 2);
    ctx.beginPath(); ctx.ellipse(x + hw * 0.75, top - 3 * k, 2.6 * k, 1.3 * k, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 约柜的帐幕（撒下 6:17；王上 8:1）
  function drawTent(ctx) {
    const a = W.lv.soTent;
    if (a < 0.01) return;
    const k = PK(), x = X.tent * W.w, y = gY(2, X.tent) + 2 * k, hw = 20 * k, h = 24 * k;
    ctx.globalAlpha = a;
    ctx.strokeStyle = css([110, 94, 72], 2, 0.8); ctx.lineWidth = Math.max(0.5, 0.7 * k);
    ctx.beginPath(); ctx.moveTo(x - hw * 0.8, y - h * 0.8); ctx.lineTo(x - hw * 1.5, y); ctx.moveTo(x + hw * 0.8, y - h * 0.8); ctx.lineTo(x + hw * 1.5, y); ctx.stroke();
    ctx.fillStyle = css([222, 212, 188], 2);
    ctx.beginPath();
    ctx.moveTo(x - hw, y); ctx.lineTo(x - hw * 0.9, y - h * 0.82); ctx.quadraticCurveTo(x, y - h * 1.12, x + hw * 0.9, y - h * 0.82); ctx.lineTo(x + hw, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([70, 84, 140], 2, 0.85);
    ctx.fillRect(x - hw * 0.94, y - h * 0.5, hw * 1.88, 1.6 * k);
    ctx.fillStyle = css([130, 60, 90], 2, 0.8);
    ctx.fillRect(x - hw * 0.96, y - h * 0.28, hw * 1.92, 1.2 * k);
    // 门帘
    const dw = hw * 0.34;
    ctx.fillStyle = css([30, 24, 22], 2);
    ctx.beginPath(); ctx.moveTo(x - dw - 3 * k, y); ctx.lineTo(x - dw * 0.8 - 3 * k, y - h * 0.62); ctx.lineTo(x + dw * 0.8 - 3 * k, y - h * 0.62); ctx.lineTo(x + dw - 3 * k, y); ctx.closePath(); ctx.fill();
    if (S.ark === 'tent') {
      SP || sprites();
      const ax = x - 3 * k, ay = y - 1 * k;
      drawArkBody(ctx, ax, ay - 1.5 * k, k * 0.7, 1);
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, ax, ay - 6 * k, 18 * k, 0.25 + 0.35 * nightK());
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 约柜：包金的柜，施恩座上两个基路伯（出 25:10–22），两根杠
  function drawArkBody(ctx, x, y, k, a) {
    ctx.globalAlpha = a;
    const G1 = U.mixRGB(GOLDS, [255, 240, 200], 0.2);
    ctx.fillStyle = css(G1, 2, 1, 0.2);
    ctx.fillRect(x - 9 * k, y - 7 * k, 18 * k, 7 * k);
    ctx.fillStyle = css([196, 150, 80], 2, 1, 0.1);
    ctx.fillRect(x - 9.6 * k, y - 8 * k, 19.2 * k, 1.4 * k);
    ctx.fillRect(x - 9 * k, y - 3.2 * k, 18 * k, 0.7 * k);
    // 基路伯：面对面，翅膀向上张开
    ctx.fillStyle = css(G1, 2, 1, 0.25);
    for (const dir of [-1, 1]) {
      const cx = x + dir * 5 * k;
      ctx.beginPath(); ctx.arc(cx, y - 10.4 * k, 1.1 * k, 0, TAU); ctx.fill();
      ctx.fillRect(cx - 0.9 * k, y - 9.6 * k, 1.8 * k, 2 * k);
      ctx.beginPath();
      ctx.moveTo(cx, y - 9.4 * k); ctx.quadraticCurveTo(cx - dir * 1 * k, y - 15 * k, cx - dir * 5.2 * k, y - 13.4 * k);
      ctx.quadraticCurveTo(cx - dir * 2.4 * k, y - 11.6 * k, cx - dir * 0.6 * k, y - 8.4 * k); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // 抬着的约柜：在前后两个祭司的肩上
  function arkPos() {
    if (S.ark !== 'carried') return null;
    const a = figPt('pr1', 0.8), b = figPt('pr2', 0.8);
    if (!a || !b) return null;
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  function drawCarriedArk(ctx) {
    const p = arkPos();
    if (!p) return;
    const k = PK(), f1 = fig('pr1'), f2 = fig('pr2');
    const al = Math.min(f1 ? f1.alpha : 1, f2 ? f2.alpha : 1);
    if (al < 0.02) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, p[0], p[1] - 6 * k, 26 * k, al * (0.2 + 0.35 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    // 杠
    ctx.strokeStyle = css([200, 160, 90], 2, al, 0.15); ctx.lineWidth = Math.max(0.8, 1.1 * k);
    ctx.beginPath(); ctx.moveTo(p[0] - 21 * k, p[1]); ctx.lineTo(p[0] + 21 * k, p[1]); ctx.stroke();
    drawArkBody(ctx, p[0], p[1] - 1 * k, k, al);
  }

  // ════════════════════════════════════════════════════════════
  //  中丘：大卫城与王宫、基遍的邱坛、筵席、对面山上的邱坛
  // ════════════════════════════════════════════════════════════
  let CITY = null;
  function cityModel() {
    if (CITY) return CITY;
    const r = U.mulberry32(9011), houses = [];
    for (let i = 0; i < 44; i++) {
      const row = r() < 0.34 ? 2 : r() < 0.55 ? 1 : 0;
      const xf = lerp(X.city0 + 0.006, X.city1 - 0.004, r());
      if (Math.abs(xf - X.palace) < 0.028 && row > 0) continue;
      houses.push({ xf, w: 11 + r() * 9, h: 9 + r() * 8 + row * 7, lift: row * 7 + r() * 3, lamp: r() < 0.5, ph: r() * 6, side: 3 + r() * 3, tone: 0.9 + r() * 0.16 });
    }
    houses.sort((a, b) => b.lift - a.lift);
    const towers = [];
    for (let x = X.city0 + 0.004; x < X.city1; x += 0.034 + r() * 0.01) towers.push(x);
    CITY = { houses, towers };
    return CITY;
  }
  function drawCity(ctx) {
    const a = W.lv.soCity;
    if (a < 0.01) return;
    const l = 1, s = LS(1), m = cityModel(), nk = nightK(), d = litX() >= W.w * 0.88 ? 1 : -1;
    ctx.globalAlpha = a;
    // 房屋（后排在上）
    for (const h of m.houses) {
      const x = h.xf * W.w, g = gY(l, h.xf) + 2 * s, top = g - (h.lift + h.h) * s, w = h.w * s;
      const col = [214 * h.tone, 198 * h.tone, 168 * h.tone];
      ctx.fillStyle = css(col, l);
      ctx.fillRect(x - w / 2, top, w, g - top);
      ctx.fillStyle = css([150, 134, 110], l, 0.5);
      ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - h.side * s, top, h.side * s, g - top);
      ctx.fillStyle = css([246, 236, 212], l, 0.5 * dayA(), 0.1);
      ctx.fillRect(x - w / 2, top, w, 0.9 * s);
      ctx.fillStyle = css([40, 32, 28], l, 0.8);
      ctx.fillRect(x - w * 0.15, top + h.h * s * 0.35, 2 * s, 2.6 * s);
    }
    // 王宫：黎巴嫩林宫（7:2），香柏木柱三行
    const px = X.palace * W.w, pg = gY(l, X.palace) + 2 * s, pw = 44 * s, ph = 30 * s;
    ctx.fillStyle = css([226, 212, 182], l);
    ctx.fillRect(px - pw / 2, pg - ph, pw, ph);
    ctx.fillStyle = css([120, 78, 52], l);
    for (let i = 0; i < 8; i++) ctx.fillRect(px - pw / 2 + 3 * s + i * 5.5 * s, pg - ph + 7 * s, 1.8 * s, ph - 9 * s);
    ctx.fillStyle = css([236, 222, 192], l);
    ctx.fillRect(px - pw / 2 - 2 * s, pg - ph - 3 * s, pw + 4 * s, 3.4 * s);
    for (let xx = -pw / 2 - 1 * s; xx < pw / 2; xx += 5 * s) ctx.fillRect(px + xx, pg - ph - 5.6 * s, 2.6 * s, 2.8 * s);
    // 城墙与城楼
    const x0 = X.city0 * W.w, x1 = X.city1 * W.w;
    ctx.fillStyle = css([196, 180, 150], l);
    ctx.beginPath();
    ctx.moveTo(x0, gY(l, X.city0) + 3 * s);
    for (let i = 0; i <= 24; i++) { const xf = lerp(X.city0, X.city1, i / 24); ctx.lineTo(xf * W.w, gY(l, xf) - 9 * s); }
    for (let i = 24; i >= 0; i--) { const xf = lerp(X.city0, X.city1, i / 24); ctx.lineTo(xf * W.w, gY(l, xf) + 3 * s); }
    ctx.closePath(); ctx.fill();
    for (const tf of m.towers) {
      const tx = tf * W.w, tg = gY(l, tf) + 3 * s;
      ctx.fillStyle = css([204, 188, 158], l);
      ctx.fillRect(tx - 4.5 * s, tg - 17 * s, 9 * s, 17 * s);
      for (let j = 0; j < 3; j++) ctx.fillRect(tx - 4.5 * s + j * 3.6 * s, tg - 19.5 * s, 2 * s, 2.6 * s);
      ctx.fillStyle = css([246, 236, 212], l, 0.4 * dayA(), 0.1);
      ctx.fillRect(d > 0 ? tx + 3.6 * s : tx - 4.5 * s, tg - 17 * s, 0.9 * s, 17 * s);
    }
    ctx.fillStyle = css([150, 136, 112], l, 0.4);
    ctx.fillRect(x0, gY(l, X.city0) - 1 * s, x1 - x0, 0.8 * s);
    ctx.globalAlpha = 1;
    // 夜里的灯
    if (nk > 0.05) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (const h of m.houses) {
        if (!h.lamp) continue;
        const x = h.xf * W.w, g = gY(l, h.xf) + 2 * s, wy = g - (h.lift + h.h) * s + h.h * s * 0.35;
        const k = nk * a * (0.75 + 0.25 * Math.sin(W.t * 1.7 + h.ph)) * (1 - 0.4 * W.lv.soDim);
        ctx.globalAlpha = k * 0.9;
        ctx.fillStyle = 'rgb(255,200,120)';
        ctx.fillRect(x - h.w * s * 0.15, wy, 2 * s, 2.6 * s);
        glowSp(ctx, SP.warm, x - h.w * s * 0.15 + s, wy + 1.3 * s, 7 * s, k * 0.5);
      }
      glowSp(ctx, SP.warm, px, pg - ph * 0.5, 30 * s, nk * a * 0.35);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 基遍极大的邱坛（3:4）
  function drawGibeon(ctx) {
    SP || sprites();
    const l = 1, s = LS(1) * 1.35, x = X.gibeon * W.w, y = gY(l, X.gibeon) + 2 * s;
    ctx.fillStyle = css([150, 138, 116], l);
    ctx.beginPath(); ctx.moveTo(x - 20 * s, y); ctx.lineTo(x - 15 * s, y - 6 * s); ctx.lineTo(x + 15 * s, y - 6 * s); ctx.lineTo(x + 20 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([128, 116, 100], l);
    ctx.fillRect(x - 7 * s, y - 13 * s, 14 * s, 7.2 * s);
    ctx.fillStyle = css([230, 216, 190], l, 0.4 * dayA(), 0.1);
    ctx.fillRect(x - 15 * s, y - 6 * s, 30 * s, 0.9 * s);
    const f = W.lv.soGibeon;
    if (f > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, x, y - 16 * s, 60 * s, f * (0.12 + 0.4 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      smoke(ctx, x, y - 18 * s, f, W.h * 0.32, 11 * s, 1.7);
      flame(ctx, x, y - 12.6 * s, 14 * s, f, 1.7);
    }
  }
  // 对面山上的邱坛：基抹与摩洛（11:7）——一座石台、一根苍白的柱像与木偶的杆，暗红的火，一道发黑的烟柱
  function drawHigh(ctx) {
    const h = W.lv.soHigh;
    if (h < 0.01) return;
    SP || sprites();
    const l = 0, s = LS(1) * 2.4, nk = nightK();
    for (const [xf, seed, dir] of [[X.high1, 4.2, -1], [X.high2, 6.6, 1]]) {
      const x = xf * W.w, y = Math.min(gY(l, xf), W.waterlineY(0) - 8) + 1.5 * s;
      // 烟柱（在台后升起）
      smoke(ctx, x, y - 12 * s, h, W.h * 0.3, 8 * s, seed, true);
      ctx.globalAlpha = h;
      // 石台
      ctx.fillStyle = css([74, 62, 64], l);
      ctx.beginPath(); ctx.moveTo(x - 13 * s, y); ctx.lineTo(x - 10 * s, y - 5 * s); ctx.lineTo(x + 10 * s, y - 5 * s); ctx.lineTo(x + 13 * s, y); ctx.closePath(); ctx.fill();
      ctx.fillRect(x - 5 * s, y - 9 * s, 10 * s, 4.2 * s);
      // 苍白的柱像（立在台的一边）
      const px = x + dir * 8.5 * s;
      ctx.fillStyle = css([206, 192, 170], l, 1, 0.1);
      ctx.beginPath(); ctx.moveTo(px - 2 * s, y - 5 * s); ctx.lineTo(px - 2 * s, y - 15 * s); ctx.quadraticCurveTo(px, y - 18.5 * s, px + 2 * s, y - 15 * s); ctx.lineTo(px + 2 * s, y - 5 * s); ctx.closePath(); ctx.fill();
      // 木偶的杆（亚舍拉）
      const qx = x - dir * 8 * s;
      ctx.fillStyle = css([52, 40, 38], l);
      ctx.fillRect(qx - 0.7 * s, y - 27 * s, 1.4 * s, 22 * s);
      ctx.beginPath(); ctx.moveTo(qx, y - 22 * s); ctx.lineTo(qx - 3.4 * s, y - 27.5 * s); ctx.lineTo(qx - 2.6 * s, y - 28 * s); ctx.lineTo(qx, y - 24 * s); ctx.lineTo(qx + 2.6 * s, y - 28 * s); ctx.lineTo(qx + 3.4 * s, y - 27.5 * s); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.red, x, y - 11 * s, 34 * s, h * (0.35 + 0.45 * nk));
      glowSp(ctx, SP.warm, x, y - 9 * s, 12 * s, h * (0.3 + 0.3 * nk));
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, y - 8.8 * s, 9 * s, h, seed, true);
    }
  }
  // 亚多尼雅的筵席（1:9）：一堆火、一张长席
  function drawFeast(ctx) {
    const f = W.lv.soFeast;
    if (f < 0.01) return;
    const l = 1, s = LS(1), x = X.feast * W.w, y = gY(l, X.feast) + 2 * s;
    ctx.globalAlpha = f;
    ctx.fillStyle = css([150, 110, 76], l);
    ctx.fillRect(x - 16 * s, y - 4 * s, 22 * s, 1.8 * s);
    ctx.fillRect(x - 15 * s, y - 2.4 * s, 1.2 * s, 2.4 * s); ctx.fillRect(x + 4.6 * s, y - 2.4 * s, 1.2 * s, 2.4 * s);
    ctx.globalAlpha = 1;
    smoke(ctx, x + 12 * s, y - 6 * s, f * 0.7, W.h * 0.12, 5 * s, 2.2);
    flame(ctx, x + 12 * s, y - 1 * s, 7 * s, f, 2.2);
  }

  // ════════════════════════════════════════════════════════════
  //  如同海沙（4:29）：岸边的沙一粒一粒亮起
  // ════════════════════════════════════════════════════════════
  let SAND = null;
  function sandPts() {
    if (SAND && SAND.w === W.w && SAND.h === W.h) return SAND;
    const r = U.mulberry32(4029), near = [], mid = [], far = [];
    // 近地的海岸：地的轮廓线自海中升起之处，与岸边的浅水
    for (let i = 0; i < 220; i++) {
      const xf = lerp(0.3, 0.48, r()), g = gY(2, xf);
      if (!isFinite(g) || g > W.h + 4) continue;
      near.push([xf, g + (r() - 0.3) * 16 * Math.max(0.6, W.unit), r() * TAU, 0.6 + r() * 1.4, r()]);
    }
    // 中丘朝着我们的岸（水线）
    const wl1 = W.waterlineY(1);
    for (let i = 0; i < 260; i++) { const xf = lerp(0.49, 0.995, r()); if (gY(1, xf) < wl1 - 1) mid.push([xf, wl1 - r() * 4 + 1, r() * TAU, 0.5 + r() * 1.2, r()]); }
    const wl0 = W.waterlineY(0);
    for (let i = 0; i < 160; i++) { const xf = lerp(0.1, 0.995, r()); if (gY(0, xf) < wl0 - 1) far.push([xf, wl0 - r() * 2 + 0.5, r() * TAU, 0.4 + r() * 0.9, r()]); }
    SAND = { w: W.w, h: W.h, near, mid, far };
    return SAND;
  }
  function drawSand(ctx, which, scale) {
    const s = W.lv.soSand;
    if (s < 0.01) return;
    SP || sprites();
    const P = sandPts()[which], u = Math.max(0.75, W.unit) * scale, glowK = 0.35 + 0.65 * nightK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,236,190)';
    for (let i = 0; i < P.length; i++) {
      const q = P[i];
      const reveal = smoothstep(q[4] * 0.7, q[4] * 0.7 + 0.3, s);
      if (reveal < 0.01) continue;
      const tw = 0.5 + 0.5 * Math.sin(W.t * (1.1 + q[3]) + q[2]);
      const a = reveal * (0.3 + 0.7 * tw * tw);
      const x = q[0] * W.w, y = q[1], sz = (1 + q[3] * 0.8) * u;
      ctx.globalAlpha = a;
      ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      if (tw > 0.8) {
        ctx.globalAlpha = a * 0.55;
        ctx.fillRect(x - sz * 2.4, y - 0.3, sz * 4.8, 0.6); ctx.fillRect(x - 0.3, y - sz * 2.4, 0.6, sz * 4.8);
        glowSp(ctx, SP.sand, x, y, sz * 4, a * 0.35 * glowK);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  天上：天和天上的天（8:27）；显现的光；名的光；梦
  // ════════════════════════════════════════════════════════════
  const ARC_STARS = [];
  (function () { const r = U.mulberry32(827); for (let i = 0; i < 7; i++) { const a = []; for (let j = 0; j < 40; j++) a.push([Math.PI * (1.02 + 0.96 * r()), r() * TAU, 0.5 + r()]); ARC_STARS.push(a); } })();
  function drawHeavens(ctx) {
    const h = W.lv.soHeaven;
    if (h < 0.01) return;
    SP || sprites();
    // 竖屏时一层一层的天收在画面之内（否则只见两道弧）
    const narrow = tall(), G = TG();
    const cx = narrow ? W.w * 0.62 : G.x0 + 98 * G.k, cy = W.horizonY + W.h * 0.03, base = narrow ? W.w * 0.42 : Math.max(W.w * 0.62, W.h * 0.7);
    const A = h * (0.3 + 0.7 * clamp(W.night * 1.2 + W.dusk * 0.4, 0, 1)) * (narrow ? 1.4 : 1);
    const u = SU();
    ctx.globalCompositeOperation = 'lighter';
    // 祷告的光：自殿前升到天上
    const sp = figPt('solomon', 0.9);
    if (sp) shaft(ctx, sp[0], 32 * u, sp[1], A * 0.28);
    for (let i = 0; i < 7; i++) {
      const rv = smoothstep(i * 0.1, i * 0.1 + 0.34, h);
      if (rv < 0.01) continue;
      const R = base * (0.2 + 0.2 * i) * (0.82 + 0.18 * rv), ry = R * 0.8, a = A * rv * (0.62 - i * 0.06);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = U.rgba(255, 230, 186, a * 0.07); ctx.lineWidth = (7 + i * 4) * u;
      ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, Math.PI, TAU); ctx.stroke();
      ctx.strokeStyle = U.rgba(255, 246, 226, a * 0.32); ctx.lineWidth = Math.max(0.6, 0.8 * u);
      ctx.beginPath(); ctx.ellipse(cx, cy, R, ry, 0, Math.PI, TAU); ctx.stroke();
      ctx.fillStyle = 'rgb(255,248,232)';
      for (const st of ARC_STARS[i]) {
        const tw = 0.55 + 0.45 * Math.sin(W.t * (0.9 + st[2]) + st[1]);
        const x = cx + Math.cos(st[0]) * R, y = cy + Math.sin(st[0]) * ry;
        if (y > W.horizonY) continue;
        ctx.globalAlpha = a * tw;
        const z = (1.1 + st[2] * 0.8) * u;
        ctx.fillRect(x - z / 2, y - z / 2, z, z);
        ctx.globalAlpha = a * tw * 0.35;
        ctx.fillRect(x - z * 2.5, y - 0.3, z * 5, 0.6); ctx.fillRect(x - 0.3, y - z * 2.5, 0.6, z * 5);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 夜间梦中（3:5；9:2）
  function drawDream(ctx) {
    const d = W.lv.soDream;
    if (d < 0.01) return;
    ctx.fillStyle = U.rgba(18, 12, 44, 0.2 * d);
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.violet, W.w * 0.62, W.h * 0.55, Math.max(W.w, W.h) * 0.5, 0.07 * d);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 耶和华显现：自天而降的一道光（从不画出形像）
  function presX() {
    if (S.pres === 'temple') return holyX();
    if (S.pres === 'gibeon') { const p = figPt('solomon', 0); return p ? p[0] : X.dream * W.w; }
    return null;
  }
  function drawPresence(ctx) {
    const p = W.lv.soPresence;
    if (p < 0.01) return;
    const x = presX();
    if (x == null) return;
    SP || sprites();
    const G = TG(), gy = S.pres === 'temple' ? G.fy - 60 * G.k : (figPt('solomon', 0.3) || [x, W.h * 0.85])[1];
    const u = SU(), br = 0.88 + 0.12 * Math.sin(W.t * 0.8);
    ctx.globalCompositeOperation = 'lighter';
    shaft(ctx, x, 88 * u, gy, p * 0.75 * br);
    shaft(ctx, x, 28 * u, gy, p * 0.5 * br);
    glowSp(ctx, SP.gold, x, gy, 70 * u, p * 0.5 * br);
    glowSp(ctx, SP.gold, x, gy + 6 * u, 160 * u, p * 0.3 * br);
    glowSp(ctx, SP.warm, x, gy + 10 * u, 120 * u, p * 0.22 * br);
    glowSp(ctx, SP.white, x, gy - 10 * u, 34 * u, p * 0.35 * br);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 名的光：停在至圣所上（9:3）——「我的眼、我的心也必常在那里」
  function drawNameLight(ctx) {
    const n = W.lv.soName;
    if (n < 0.01 || W.lv.soBuild < 0.9) return;
    SP || sprites();
    const G = TG(), x = holyX(), y = G.fy - 70 * G.k, u = SU();
    const k = n * (1 - 0.55 * W.lv.soDim) * (0.25 + 0.75 * nightK()) * (0.9 + 0.1 * Math.sin(W.t * 0.6));
    ctx.globalCompositeOperation = 'lighter';
    shaft(ctx, x, 20 * u, y - 40 * G.k, k * 0.2);
    glowSp(ctx, SP.gold, x, G.fy - 118 * G.k, 26 * u, k * 0.3);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 大卫的灯在夜里的光（11:36）
  function drawLampLight(ctx) {
    const L = W.lv.soLamp;
    if (L < 0.01) return;
    SP || sprites();
    const G = TG(), p = lampPt(), u = SU(), fl = 0.9 + 0.1 * Math.sin(W.t * 5.3) * Math.sin(W.t * 3.1);
    const a = L * (0.35 + 0.65 * nightK()) * fl;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.warm, p[0], p[1] - 14 * G.k, 140 * u, a * 0.55);
    glowSp(ctx, SP.gold, p[0], p[1] - 14 * G.k, 34 * u, a * 0.7);
    glowSp(ctx, SP.warm, p[0], p[1] + 4 * G.k, 90 * u, a * 0.25);
    shaft(ctx, p[0], 12 * u, p[1] - 14 * G.k, a * 0.12);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 云充满耶和华的殿（8:10–11）─────────────────────────────
  // 每一朵：[dx, dy（k，相对廊的左端与台基顶）, 半径, 出现的先后, 相位, 样式, 浓淡]
  // 约 37 朵较大的云团（每帧的开销与 1 ms 的预算相称）
  const PUFFS = [];
  (function () {
    const r = U.mulberry32(810);
    // 殿上的云：宽而低垂的一片
    for (let i = 0; i < 10; i++) { const f = i / 9; PUFFS.push([-40 + f * 280 + (r() - 0.5) * 20, -170 - r() * 44 - Math.sin(f * Math.PI) * 30, 58 + r() * 34, 0.01 + r() * 0.12, r() * TAU, i % 3, 0.84]); }
    // 降到殿顶
    for (let i = 0; i < 8; i++) PUFFS.push([-16 + (i / 7) * 232 + (r() - 0.5) * 20, -112 - r() * 40, 40 + r() * 26, 0.14 + r() * 0.14, r() * TAU, i % 3, 0.8]);
    // 充满殿：沿着墙根与两端涌出（殿身仍隐约可见）
    for (let i = 0; i < 10; i++) { const side = i % 2 === 0; const xx = side ? -40 + r() * 50 : 170 + r() * 70; const yy = -r() * 110; PUFFS.push([xx, yy, 28 + r() * 22, 0.34 + (1 + yy / 110) * 0.3 + r() * 0.06, r() * TAU, i % 3, 0.62]); }
    for (let i = 0; i < 5; i++) PUFFS.push([20 + (i / 4) * 170 + (r() - 0.5) * 16, -4 - r() * 14, 22 + r() * 16, 0.5 + r() * 0.2, r() * TAU, i % 3, 0.52]);
    // 从门里涌出
    for (let i = 0; i < 4; i++) PUFFS.push([14 - i * 16, -10 - r() * 40, 20 + r() * 14, 0.55 + i * 0.06, r() * TAU, i % 3, 0.62]);
  })();
  function drawCloud(ctx) {
    const c = W.lv.soCloud;
    if (c < 0.01) return;
    SP || sprites();
    const G = TG(), k = G.k, nk = clamp((nightK() - 0.35) / 0.65, 0, 1), cx = G.x0 + 100 * k;
    // 殿里透出的荣光
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, cx, G.fy - 70 * k, 240 * k, c * 0.13);
    glowSp(ctx, SP.gold, cx, G.fy - 150 * k, 200 * k, c * 0.06);
    ctx.globalCompositeOperation = 'source-over';
    const A = Math.min(1, c * 1.25) * (0.75 + 0.25 * W.daylight);
    const P = [];
    for (const q of PUFFS) {
      const p = smoothstep(q[3], q[3] + 0.3, c);
      if (p < 0.01) continue;
      const drift = Math.sin(W.t * 0.21 + q[4]) * 7 * k, bob = Math.cos(W.t * 0.17 + q[4] * 1.3) * 4 * k;
      const x = G.x0 + q[0] * k + drift, y = G.fy + q[1] * k - (1 - p) * 80 * k + bob, R = q[2] * k * (0.6 + 0.4 * p) * 1.5;
      P.push([x, y, R, p, q]);
      // 下半的云团带一点冷紫，使云有上下、有体积
      ctx.globalAlpha = p * q[6] * A * (1 - 0.62 * nk);
      ctx.drawImage((q[1] > -80 ? SP.puffV : SP.puff)[q[5]], x - R, y - R, R * 2, R * 2);
    }
    // 云里的金光：白昼也从里面发亮（夜里更亮）
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, R, p, q] of P) {
      ctx.globalAlpha = p * q[6] * A * (0.06 + 0.14 * nk) * (q[1] > -80 ? 0.4 : 1);
      ctx.drawImage(SP.puffG[q[5]], x - R, y - R, R * 2, R * 2);
    }
    // 自云中垂下的几缕光（柔边的光柱，自云团里面开始）
    const rays = smoothstep(0.5, 1, c);
    if (rays > 0.01) {
      const top = G.fy - 140 * k, H = G.fy - top;
      for (let i = 0; i < 7; i++) {
        const x0 = G.x0 + (-10 + i * 36) * k + Math.sin(W.t * 0.3 + i * 1.7) * 6 * k, w0 = (6 + (i % 3) * 3) * k;
        ctx.globalAlpha = rays * (0.1 + 0.05 * Math.sin(W.t * 0.5 + i * 2.3));
        ctx.drawImage(SP.beam, x0 - w0 * 1.5, top, w0 * 3, H);
      }
      glowSp(ctx, SP.white, G.x0 + 22 * k, G.fy - 34 * k, 50 * k, rays * 0.35 * c);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fxAdd(b, e) { if (b && b.instant) return null; e.t = 0; e.delay = e.delay || 0; e.tail = e.tail || 0; FXL.push(e); return e; }
  const ease = U.easeInOut;
  // 石头与香柏木无声地飞到它的地方（6:7）
  function glideStones(b, dur, n) {
    if (b.instant) return;
    const r = U.mulberry32(607), rate = LVL.soBuild[1];
    for (let j = 0; j < n; j++) {
      const t0 = (j / n) * dur, fl = 1.5 + r() * 0.5;
      const bAt = Math.min(1, (t0 + fl) * rate * (W.fast || 1) + W.lv.soBuild);
      const tg = frontier(bAt);
      const sx = X.stones * W.w + (r() - 0.5) * 30 * PK(), sy = fieldY(X.stones, 0.3) - 6 * PK();
      fxAdd(b, { type: 'glide', kind: 'stone', delay: t0, dur: fl, tail: 0.5, x0: sx / W.w, y0: sy / W.h, x1: tg[0] / W.w, y1: tg[1] / W.h, arc: 0.06 + r() * 0.05 });
    }
  }
  function glideLogs(b, dur, n) {
    if (b.instant) return;
    const r = U.mulberry32(609), G = TG();
    for (let j = 0; j < n; j++) {
      const t0 = (j / n) * dur, fl = 2 + r() * 0.5;
      const tx = G.x0 + (10 + (j / Math.max(1, n - 1)) * 184) * G.k, ty = G.fy - (j % 3 ? TH_H + 2 : TH_P + 3) * G.k;
      fxAdd(b, { type: 'glide', kind: 'log', delay: t0, dur: fl, tail: 0.5, x0: X.logs, y0: fieldY(X.logs, 0.16) / W.h - 0.01, x1: tx / W.w, y1: ty / W.h, arc: 0.12 + r() * 0.05 });
    }
  }
  function drawGlide(ctx, e, tt) {
    SP || sprites();
    const k = TG().k, p = clamp(tt / e.dur, 0, 1), q = ease(p);
    const x = lerp(e.x0, e.x1, q) * W.w, y = lerp(e.y0, e.y1, q) * W.h - Math.sin(p * Math.PI) * e.arc * W.h;
    if (tt > e.dur) {
      const f = 1 - (tt - e.dur) / e.tail;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, e.x1 * W.w, e.y1 * W.h, (e.kind === 'log' ? 16 : 9) * k, f * 0.45);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      return;
    }
    const a = smoothstep(0, 0.12, p);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, (e.kind === 'log' ? 20 : 15) * k, 0.4 * a * (0.55 + 0.45 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = a;
    if (e.kind === 'log') {
      ctx.fillStyle = css(CEDAR, 2);
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(p * Math.PI) * -0.3);
      ctx.fillRect(-12 * k, -1.4 * k, 24 * k, 2.8 * k);
      ctx.restore();
    } else {
      ctx.fillStyle = css(STONE, 2);
      ctx.fillRect(x - 5 * k, y - 3.2 * k, 10 * k, 6.4 * k);
      ctx.fillStyle = css([255, 246, 226], 2, 0.6, 0.2);
      ctx.fillRect(x - 5 * k, y - 3.2 * k, 10 * k, 0.9 * k);
    }
    ctx.globalAlpha = 1;
  }
  // 筏子与船：从远海来到岸边（5:9；9:26–28）
  // path：[[xf, yf], …]（画面比例）；以 Chaikin 法磨圆，再按路程均匀行进
  function smoothPath(pts) {
    let P = pts.slice();
    for (let it = 0; it < 3; it++) {
      const Q = [P[0]];
      for (let i = 0; i < P.length - 1; i++) {
        const a = P[i], b = P[i + 1];
        Q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
      }
      Q.push(P[P.length - 1]);
      P = Q;
    }
    const L = [0];
    for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot((P[i][0] - P[i - 1][0]) * 1.6, P[i][1] - P[i - 1][1]));
    return { P, L };
  }
  function pathAt(pp, q) {
    const P = pp.P, L = pp.L, d = q * L[L.length - 1];
    let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const f = L[i] > L[i - 1] ? clamp((d - L[i - 1]) / (L[i] - L[i - 1]), 0, 1) : 0;
    return [lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)];
  }
  function craft(b, kind, delay, dur, path, o) {
    fxAdd(b, Object.assign({ type: 'craft', kind, delay, dur, tail: 0.01, path: smoothPath(path), ph: rand(0, TAU) }, o || {}));
  }
  // 横屏：自大卫城之后的海面绕过中丘的尖角，进到近岸（经文框在左边的海上）；竖屏：经文在上，仍自左边远海而来
  function fleetPath(i) {
    if (tall()) return [[[0.03, 0.628], [0.372, 0.915]], [[0.1, 0.624], [0.352, 0.94]], [[0.16, 0.63], [0.33, 0.965]]][i];
    const E = [[0.406, 0.9], [0.419, 0.879], [0.432, 0.862]][i], dy = i * 0.004;
    return [[0.94 + i * 0.03, 0.634 + dy], [0.7, 0.648 + dy], [0.55, 0.69 + dy * 0.5], [0.492, 0.726], [0.462, 0.776], E];
  }
  const fleetEnd = () => (tall() ? [0.36, 0.93] : [0.42, 0.875]);
  function drawCraft(ctx, pass) {
    for (const e of FXL) {
      if (e.type !== 'craft') continue;
      const tt = e.t - e.delay;
      if (tt < 0) continue;
      const p = clamp(tt / e.dur, 0, 1), q = ease(p), pt = pathAt(e.path, q);
      const x = pt[0] * W.w, y = pt[1] * W.h;
      if (W.seaBand(y) !== pass) continue;
      const s = Math.max(0.15, W.seaScale ? W.seaScale(y) : 1) * (e.kind === 'raft' ? 1.7 : 1.45) * 1.5, a = smoothstep(0, 0.08, p) * (1 - smoothstep(0.93, 1, p));
      const bob = Math.sin(W.t * 1.6 + e.ph) * 1.2 * s;
      ctx.globalAlpha = a;
      // 水痕
      ctx.strokeStyle = U.rgba(230, 240, 250, 0.28 * a * dayA()); ctx.lineWidth = Math.max(0.5, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x - 30 * s, y + 3 * s); ctx.quadraticCurveTo(x - 12 * s, y + 1 * s, x + 16 * s, y + 2 * s); ctx.stroke();
      if (e.kind === 'raft') {
        ctx.fillStyle = W.shadeCSS(CEDAR, 0.2);
        for (let i = 0; i < 4; i++) ctx.fillRect(x - 18 * s, y - (i * 1.8 + 1.8) * s + bob, 36 * s, 1.7 * s);
        ctx.fillStyle = W.shadeCSS([60, 44, 34], 0.2);
        for (const fx0 of [-10, 8]) {
          const fxp = x + fx0 * s, fy0 = y - 8 * s + bob;
          ctx.fillRect(fxp - 1.2 * s, fy0 - 8 * s, 2.4 * s, 8 * s);
          ctx.beginPath(); ctx.arc(fxp, fy0 - 9.4 * s, 1.4 * s, 0, TAU); ctx.fill();
          ctx.strokeStyle = W.shadeCSS([90, 70, 50], 0.2); ctx.lineWidth = Math.max(0.5, 0.6 * s);
          ctx.beginPath(); ctx.moveTo(fxp + 1 * s, fy0 - 6 * s); ctx.lineTo(fxp + 7 * s, y + 3 * s); ctx.stroke();
        }
      } else {
        ctx.fillStyle = W.shadeCSS([74, 54, 40], 0.2);
        ctx.beginPath();
        ctx.moveTo(x - 24 * s, y - 6 * s + bob); ctx.quadraticCurveTo(x - 20 * s, y + 1 * s + bob, x - 8 * s, y + 1.5 * s + bob);
        ctx.lineTo(x + 14 * s, y + 1.5 * s + bob); ctx.quadraticCurveTo(x + 22 * s, y + 0.5 * s + bob, x + 26 * s, y - 7 * s + bob);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(x - 0.8 * s, y - 34 * s + bob, 1.6 * s, 34 * s);
        ctx.fillStyle = W.shadeCSS([236, 226, 204], 0.2);
        ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 31 * s + bob); ctx.quadraticCurveTo(x + 2 * s, y - 27 * s + bob, x + 13 * s, y - 31 * s + bob);
        ctx.lineTo(x + 12 * s, y - 12 * s + bob); ctx.quadraticCurveTo(x, y - 9 * s + bob, x - 11 * s, y - 12 * s + bob); ctx.closePath(); ctx.fill();
        ctx.fillStyle = W.shadeCSS([176, 72, 60], 0.2);
        ctx.fillRect(x - 11.5 * s, y - 22 * s + bob, 23 * s, 2 * s);
        // 俄斐的金子（回程）：船舱里的金光
        if (e.gold) {
          SP || sprites();
          ctx.fillStyle = W.shadeCSS([240, 196, 96], 0.2, 1, 0.3);
          for (let i = 0; i < 4; i++) ctx.fillRect(x - 12 * s + i * 5.4 * s, y - 3.4 * s + bob - (i % 2) * 1.2 * s, 4.4 * s, 2.4 * s);
          ctx.globalCompositeOperation = 'lighter';
          glowSp(ctx, SP.gold, x, y - 4 * s + bob, 22 * s, a * (0.45 + 0.25 * Math.sin(W.t * 2 + e.ph)));
          glowSp(ctx, SP.warm, x, y - 2 * s + bob, 12 * s, a * 0.35);
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = a;
        }
      }
      ctx.globalAlpha = 1;
    }
  }
  // 光点自 A 飞向 B（A、B 为 [xf, yf] 或人物 id）
  function motes(b, from, to, o) {
    o = o || {};
    fxAdd(b, { type: 'motes', from, to, dur: o.dur || 3.2, delay: o.delay || 0, n: o.n || 24, c: o.c || [255, 226, 160], seed: rand(0, 1000), spread: o.spread || 40 });
  }
  function ptOf(v, frac) { if (typeof v === 'string') return figPt(v, frac == null ? 0.6 : frac); return [v[0] * W.w, v[1] * W.h]; }
  function drawMotes(ctx, e, tt) {
    const A = ptOf(e.from, 0.9), B = ptOf(e.to, 0.55);
    if (!A || !B) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(e.c[0], e.c[1], e.c[2], 1);
    const u = SU();
    for (let i = 0; i < e.n; i++) {
      const d0 = rt(i * 7 + (e.seed | 0)) * 0.45, p = clamp((tt - d0 * e.dur) / (e.dur * 0.55), 0, 1);
      if (p <= 0 || p >= 1) continue;
      const q = ease(p), off = (rt(i * 3 + 11 + (e.seed | 0)) - 0.5) * e.spread * u;
      const x = lerp(A[0] + off, B[0], q), y = lerp(A[1], B[1], q) - Math.sin(p * Math.PI) * (30 + off * 0.6) * u;
      const a = Math.sin(p * Math.PI);
      ctx.globalAlpha = a * 0.9;
      ctx.fillRect(x - 1 * u, y - 1 * u, 2 * u, 2 * u);
      glowSp(ctx, SP.gold, x, y, 6 * u, a * 0.3);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 膏油：角里的油倒在他头上（1:39）
  function drawOil(ctx, e, tt) {
    const p = figPt(e.id, 1);
    if (!p) return;
    SP || sprites();
    const u = PK(), a = Math.sin(clamp(tt / e.dur, 0, 1) * Math.PI);
    const hx = p[0] + 5 * u, hy = p[1] - 13 * u, tilt = -0.2 - 0.9 * smoothstep(0, 0.35, tt / e.dur);
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
    ctx.globalAlpha = a;
    ctx.fillStyle = css([230, 206, 160], 2, 1, 0.2);
    ctx.beginPath(); ctx.moveTo(-5 * u, -1.2 * u); ctx.quadraticCurveTo(0, -3.4 * u, 6 * u, -0.4 * u); ctx.lineTo(5.6 * u, 1 * u); ctx.quadraticCurveTo(0, -1 * u, -5 * u, 1.4 * u); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,224,150)';
    for (let i = 0; i < 9; i++) {
      const ph = U.fract(tt * 0.9 + i / 9);
      ctx.globalAlpha = a * (1 - ph) * 0.9;
      ctx.beginPath(); ctx.arc(hx - 5 * u + Math.sin(i * 2.3) * 1.2 * u, hy + ph * 12 * u, 0.9 * u, 0, TAU); ctx.fill();
    }
    glowSp(ctx, SP.gold, p[0], p[1] + 2 * u, 24 * u, a * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 与列祖同睡：一团柔光自床上升起（2:10；11:43）
  function drawSoul(ctx, e, tt) {
    SP || sprites();
    const p = clamp(tt / e.dur, 0, 1), u = SU();
    const x = e.x * W.w + Math.sin(tt * 0.9) * 4 * u, y = e.y * W.h - ease(p) * W.h * 0.3;
    const a = Math.sin(p * Math.PI);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, 30 * u, a * 0.55);
    glowSp(ctx, SP.white, x, y, 10 * u, a * 0.65);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 撕成十二片的新衣：十片落到耶罗波安的怀里；余下的两片飘向殿前的那盏灯（11:30–36）
  function drawCloth(ctx, e, tt) {
    const A = figPt('ahijah', 0.62), B = figPt('jeroboam', 0.5);
    if (!A) return;
    SP || sprites();
    const u = PK(), p = tt / e.dur, G = TG(), lp = lampPt(), LX = lp[0], LY = lp[1] - 15.2 * G.k;
    const burst = ease(clamp(p / 0.2, 0, 1));
    for (let i = 0; i < 12; i++) {
      const ang = -Math.PI / 2 + ((i - 5.5) / 12) * Math.PI * 1.5;
      let x = A[0] + Math.cos(ang) * 36 * u * burst, y = A[1] + Math.sin(ang) * 24 * u * burst - 8 * u * burst;
      let a = 1;
      const toJ = i < 10;
      if (toJ) {
        const q = ease(clamp((p - 0.26 - i * 0.012) / 0.3, 0, 1));
        if (B) { x = lerp(x, B[0] + ((i % 5) - 2) * 1.6 * u, q); y = lerp(y, B[1] - Math.floor(i / 5) * 2.4 * u, q); }
        a = 1 - smoothstep(0.8, 0.95, p);
      } else {
        const q = ease(clamp((p - 0.22 - (i - 10) * 0.03) / 0.24, 0, 1));
        x = lerp(x, LX + (i - 10.5) * 2 * u, q); y = lerp(y, LY, q) - Math.sin(q * Math.PI) * 18 * u;
        a = 1 - smoothstep(0.42, 0.5, p);
      }
      if (a < 0.02) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = css(i >= 10 ? [206, 190, 236] : [236, 216, 160], 2, 1, 0.75);
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(tt * 2 + i) * 0.5 * (1 - (toJ ? clamp((p - 0.5) / 0.1, 0, 1) : 0)) + i);
      ctx.fillRect(-4 * u, -2.5 * u, 8 * u, 5 * u);
      ctx.restore();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y, 9 * u, a * 0.3);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 金光自左向右扫过殿墙（6:22）
  function drawSheen(ctx, e, tt) {
    const G = TG(), k = G.k, p = clamp(tt / e.dur, 0, 1);
    const bx = G.x0 - 20 * k + p * 244 * k, a = Math.sin(p * Math.PI);
    ctx.save();
    ctx.beginPath(); ctx.rect(G.x0 - 4 * k, G.fy - (TH_P + 12) * k, (TP + 8) * k, (TH_P + 12) * k); ctx.rect(G.x0 + TP * k, G.fy - (TH_H + 7) * k, (TL - TP + 5) * k, (TH_H + 7) * k); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(bx - 24 * k, 0, bx + 24 * k, 0);
    g.addColorStop(0, 'rgba(255,220,140,0)'); g.addColorStop(0.5, 'rgba(255,230,160,0.55)'); g.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.fillRect(bx - 24 * k, G.fy - 140 * k, 48 * k, 140 * k);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 根基立定：一道金线沿着台基展开（6:37）
  function drawFound(ctx, e, tt) {
    SP || sprites();
    const G = TG(), k = G.k, p = clamp(tt / e.dur, 0, 1), a = Math.sin(p * Math.PI);
    const cx = G.x0 + 57 * k, half = 150 * k * ease(Math.min(1, p * 1.6));
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a * 0.9;
    ctx.fillStyle = 'rgb(255,226,150)';
    ctx.fillRect(cx - half, G.fy - 1.2 * k, half * 2, 2.4 * k);
    glowSp(ctx, SP.gold, cx - half, G.fy, 16 * k, a * 0.6);
    glowSp(ctx, SP.gold, cx + half, G.fy, 16 * k, a * 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 刀光一闪（3:24）
  function drawGlint(ctx, e, tt) {
    const p = figPt(e.id, 1.25);
    if (!p) return;
    SP || sprites();
    const a = Math.sin(clamp(tt / e.dur, 0, 1) * Math.PI), u = PK();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgb(236,242,255)';
    ctx.fillRect(p[0] - 9 * u * a, p[1] - 0.4, 18 * u * a, 0.8);
    ctx.fillRect(p[0] - 0.4, p[1] - 9 * u * a, 0.8, 18 * u * a);
    glowSp(ctx, SP.white, p[0], p[1], 10 * u, a * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawFX(ctx) {
    for (const e of FXL) {
      const tt = e.t - e.delay;
      if (tt < 0) continue;
      switch (e.type) {
        case 'glide': drawGlide(ctx, e, tt); break;
        case 'motes': drawMotes(ctx, e, tt); break;
        case 'oil': drawOil(ctx, e, tt); break;
        case 'soul': drawSoul(ctx, e, tt); break;
        case 'cloth': drawCloth(ctx, e, tt); break;
        case 'sheen': drawSheen(ctx, e, tt); break;
        case 'found': drawFound(ctx, e, tt); break;
        case 'glint': drawGlint(ctx, e, tt); break;
      }
    }
  }
  // 黎巴嫩的香柏树（4:33）：他讲论草木时，中丘上显出一棵层层平展的香柏树（转瞬的异象，中丘一层）
  const CEDAR_X = 0.645;
  const cedarS = () => LS(1) * 2;
  function cedarTop() { const s = cedarS(); return [CEDAR_X * W.w, gY(1, CEDAR_X) + s - 44 * s]; }
  // 黎巴嫩香柏树：一层一层平展的枝，宽过于高
  const CEDAR_T = [[-13, 26, -3], [-20.5, 23, 3], [-27.5, 18, -2], [-34, 12.5, 2.5], [-39.5, 7, -0.5], [-43, 3.2, 0]];
  function drawCedarTree(ctx, e, tt) {
    const a = smoothstep(0, 1.4, tt) * (1 - smoothstep(e.dur - 1.8, e.dur, tt));
    if (a < 0.01) return;
    const s = cedarS(), x = CEDAR_X * W.w, y = gY(1, CEDAR_X) + s;
    ctx.globalAlpha = a;
    ctx.fillStyle = css([88, 64, 46], 1);
    ctx.beginPath(); ctx.moveTo(x - 2.2 * s, y); ctx.lineTo(x - 1.1 * s, y - 40 * s); ctx.lineTo(x + 1.1 * s, y - 40 * s); ctx.lineTo(x + 2.2 * s, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([88, 64, 46], 1); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath();
    for (const t of CEDAR_T) { ctx.moveTo(x, y + (t[0] + 4) * s); ctx.lineTo(x + t[2] * s + t[1] * 0.55 * s, y + t[0] * s); ctx.moveTo(x, y + (t[0] + 4) * s); ctx.lineTo(x + t[2] * s - t[1] * 0.55 * s, y + t[0] * s); }
    ctx.stroke();
    for (let i = 0; i < CEDAR_T.length; i++) {
      const t = CEDAR_T[i], cx = x + t[2] * s, cy = y + t[0] * s, hw = t[1] * s;
      ctx.fillStyle = css(i % 2 ? [60, 94, 68] : [50, 82, 60], 1);
      ctx.beginPath(); ctx.ellipse(cx, cy, hw, 2.8 * s, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - hw * 0.45, cy + 0.8 * s, hw * 0.45, 2.2 * s, 0, 0, TAU); ctx.ellipse(cx + hw * 0.5, cy + 0.6 * s, hw * 0.42, 2.1 * s, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = css([150, 196, 146], 1, 0.3 * dayA() + 0.1, 0.12);
      ctx.beginPath(); ctx.ellipse(cx - hw * 0.08, cy - 1.7 * s, hw * 0.78, 1.1 * s, 0, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function drawMidFX(ctx) { for (const e of FXL) { const tt = e.t - e.delay; if (tt >= 0 && e.type === 'cedar') drawCedarTree(ctx, e, tt); } }

  // 会众中间的火把（8:65–66 的夜里）：人群读得出
  const TORCH = [0.6, 0.69, 0.772];
  function drawTorches(ctx) {
    const t = W.lv.soTorch;
    if (t < 0.01) return;
    const k = PK();
    for (let i = 0; i < TORCH.length; i++) {
      const xf = TORCH[i], x = xf * W.w, y = fieldY(xf, 0.34), top = y - 30 * k;
      ctx.globalAlpha = Math.min(1, t * 1.5);
      ctx.strokeStyle = css([84, 62, 44], 2); ctx.lineWidth = Math.max(0.8, 1.3 * k); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, top); ctx.stroke();
      ctx.globalAlpha = 1;
      flame(ctx, x, top, 6.5 * k, t, 11 + i * 2.3);
    }
  }
  function drawTorchLight(ctx) {
    const t = W.lv.soTorch;
    if (t < 0.01) return;
    SP || sprites();
    const k = PK(), nk = nightK();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < TORCH.length; i++) {
      const xf = TORCH[i], x = xf * W.w, top = fieldY(xf, 0.34) - 30 * k, fl = 0.85 + 0.15 * Math.sin(W.t * 6.3 + i * 2);
      glowSp(ctx, SP.warm, x, top + 10 * k, 72 * k, t * fl * (0.1 + 0.26 * nk));
      glowSp(ctx, SP.warm, x, top + 34 * k, 50 * k, t * fl * (0.06 + 0.16 * nk));
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function soul(b, id, dur) { const p = figPt(id, 0.5); if (p) fxAdd(b, { type: 'soul', dur: dur || 6, x: p[0] / W.w, y: p[1] / W.h }); }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  function origins() {
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
  }
  const SCENE = {
    init() { sprites(); },
    resize() { SAND = null; TGf = -1; if (!isCur()) return; origins(); },
    update(dt) {
      if (!isCur()) { if (FXL.length) FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { const e = FXL[i]; e.t += f; if (e.t >= e.delay + e.dur + e.tail) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawHeavens(ctx); return; }
      if (pass === 'far') { drawHigh(ctx); drawSand(ctx, 'far', 0.6); return; }
      if (pass === 'mid') { drawGibeon(ctx); drawFeast(ctx); drawCity(ctx); drawMidFX(ctx); drawSand(ctx, 'mid', 0.8); return; }
      if (pass === 'near') {
        drawSand(ctx, 'near', 1);
        drawGihon(ctx);
        drawLogs(ctx);
        drawTemple(ctx);
        drawStones(ctx);
        drawTent(ctx);
        drawPavilion(ctx);
        drawBed(ctx);
        drawTorches(ctx);
        return;
      }
      if (pass === 'air') { drawDream(ctx); drawNameLight(ctx); drawPresence(ctx); drawLampLight(ctx); drawTorchLight(ctx); drawFX(ctx); }
      // 荣耀的云画在飞鸟之上（'top' 在帷幕与字之前）
      if (pass === 'top') drawCloud(ctx);
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawCraft(ctx, pass);
      else if (pass === 'near') drawCarriedArk(ctx);
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    // 测试用：本卷的状态（看完与恢复应一致）
    sig() { return { ark: S.ark, pres: S.pres }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const G = TG(), k = G.k;
      if (W.lv.soBuild > 0.5) consider('耶和华的殿', G.x0 + 110 * k, G.fy - 88 * k);
      else if (W.lv.soSite > 0.5) consider('殿的根基', G.x0 + 60 * k, G.fy - 6 * k);
      if (W.lv.soPillars > 0.8) { consider('波阿斯', G.x0 + PILLAR_X[0] * k, G.fy - 60 * k); consider('雅斤', G.x0 + PILLAR_X[1] * k, G.fy - 60 * k); }
      if (W.lv.soSea > 0.6) { consider('铜海', seaX(), G.fy - 16 * k); consider('铜坛', altarX(), G.fy - 14 * k); }
      if (W.lv.soLamp > 0.5) { const p = lampPt(); consider('灯', p[0], p[1] - 16 * k); }
      const pk = PK();
      consider(W.lv.soThrone > 0.5 ? '象牙宝座' : '宝座', X.throne * W.w, gY(2, X.throne) - 40 * pk);
      if (W.lv.soTent > 0.5) consider(S.ark === 'tent' ? '约柜' : '帐幕', X.tent * W.w, gY(2, X.tent) - 18 * pk);
      const ap = arkPos(); if (ap) consider('约柜', ap[0], ap[1] - 8 * pk);
      consider('基训', X.gihon * W.w, fieldY(X.gihon, 0.1) - 6 * pk);
      if (W.lv.soLogs * (1 - W.lv.soCedar) > 0.4) consider('香柏木', X.logs * W.w, fieldY(X.logs, 0.16) - 8 * pk);
      if (W.lv.soStones * (1 - W.lv.soBuild) > 0.4) consider('凿成的石头', X.stones * W.w, fieldY(X.stones, 0.3) - 10 * pk);
      const s1 = LS(1);
      consider('基遍的邱坛', X.gibeon * W.w, gY(1, X.gibeon) - 12 * s1);
      if (W.lv.soHigh > 0.5) for (const xf of [X.high1, X.high2]) consider('邱坛', xf * W.w, gY(0, xf) - 14 * s1);
      consider('耶路撒冷', X.palace * W.w, gY(1, X.palace) - 30 * s1);
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  情节的助手
  // ════════════════════════════════════════════════════════════
  function toThrone(id) { attach(id, () => seatFoot()); pose(id, 'seat'); face(id, -1); }
  function offThrone(id) { attach(id, null); }
  function onBed(id, on) { attach(id, on ? () => bedFoot() : null); }
  const fromOf = b => (b.instant ? 'none' : 'fade');
  const king = (o) => Object.assign({ label: '所罗门', sex: 'm', age: 'adult', robe: ROBE.solomon, glow: 0.5, hair: 'cloth', accent: KING_ACC }, o || {});
  function priest(id, x, b, o) {
    add(id, Object.assign({ label: '祭司', sex: 'm', age: 'adult', x, facing: -1, robe: ROBE.priest, glow: 0.2, hair: 'cloth', accent: LINEN, prop: null, from: fromOf(b) }, o || {}));
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：大卫王年纪老迈（1:1–10）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; S = fresh(); SAND = null; TGf = -1; }
  function setup() {
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.9, herbs: 0.75, trees: 0.26, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0.12, bare: 0.08, bloom: 0.75 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    for (const k in LVL) W.set(k, 0, true);
    W.set('soCity', 1, true); W.set('soBed', 1, true); W.set('soTent', 1, true); W.set('soFeast', 1, true);
    origins();
    W.freeClock = false;
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.4, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 24, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);   // 这是王宫里的一卷：没有羊群挡在基训与香柏木之前
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 10, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    add('david', { label: '大卫', sex: 'm', age: 'elder', x: X.bed, v: 0.22, facing: -1, robe: ROBE.david, glow: 0.45, prop: null, pose: 'sit', from: 'none' });
    onBed('david', true);
    add('bathsheba', { label: '拔示巴', sex: 'f', age: 'adult', x: 0.868, v: 0.3, facing: 1, robe: ROBE.bathsheba, glow: 0.3, from: 'none' });
    add('nathan', { label: '拿单', sex: 'm', age: 'elder', x: 0.846, facing: 1, robe: ROBE.nathan, glow: 0.3, from: 'none' });
    add('solomon', king({ x: 0.79, facing: 1, from: 'none' }));
    add('zadok', { label: '撒督', sex: 'm', age: 'elder', x: 0.768, facing: 1, robe: ROBE.zadok, glow: 0.3, hair: 'cloth', accent: LINEN, prop: null, from: 'none' });
    add('benaiah', { label: '比拿雅', sex: 'm', age: 'adult', x: 0.748, facing: 1, robe: ROBE.benaiah, glow: 0.2, from: 'none' });
    animal('mule', 'donkey', 0.808, { label: '骡子', facing: -1, v: 0.14, col: [98, 80, 66], from: 'none' });
    // 隐·罗结旁的筵席（中丘）
    add('adonijah', { label: '亚多尼雅', sex: 'm', age: 'adult', layer: 1, x: X.feast - 0.012, facing: 1, robe: ROBE.adonijah, glow: 0.15, from: 'none' });
    crowd('guests', { n: 6, x0: X.feast - 0.03, x1: X.feast + 0.03, layer: 1, label: '亚多尼雅的众客', pose: 'sit', from: 'none', mill: false });
    avoid([0.47, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '大卫王年纪老迈，虽用被遮盖，仍不觉暖。', ref: '列王纪上 1:1', hold: 5 },
    { text: '那时，哈及的儿子亚多尼雅自尊，说：「我必作王」，<br>就为自己预备车辆、马兵，又派五十人在他前头奔走。', ref: '列王纪上 1:5', hold: 7 },
  ];
  const V1 = [
    { text: '王起誓说：「……我既然指着耶和华以色列的神向你起誓说：<br>你儿子所罗门必接续我作王，坐在我的位上。我今日就必照这话而行。」', ref: '列王纪上 1:29–30', hold: 7.5 },
    { text: '祭司撒督就从帐幕中取了盛膏油的角来，用膏膏所罗门。<br>人就吹角，众民都说：「愿所罗门王万岁！」', ref: '列王纪上 1:39', hold: 7.5 },
    { text: '众民跟随他上来，且吹笛，大大欢呼，声音震地。……<br>并且所罗门登了国位。', ref: '列王纪上 1:40–46', hold: 6.5 },
    { text: '亚多尼雅的众客听见这话就都惊惧，起来四散。', ref: '列王纪上 1:49', hold: 5 },
  ];
  const V2 = [
    { text: '大卫的死期临近了，就嘱咐他儿子所罗门说：<br>「我现在要走世人必走的路。所以，你当刚强，作大丈夫……」', ref: '列王纪上 2:1–2', hold: 7 },
    { text: '「耶和华必成就向我所应许的话说：『你的子孙若谨慎自己的行为，<br>尽心尽意诚诚实实地行在我面前，就不断人坐以色列的国位。』」', ref: '列王纪上 2:4', hold: 7.5 },
    { text: '大卫与他列祖同睡，葬在大卫城。', ref: '列王纪上 2:10', hold: 5 },
    { text: '所罗门坐他父亲大卫的位，他的国甚是坚固。', ref: '列王纪上 2:12', hold: 5.5 },
  ];
  const V3 = [
    { text: '所罗门王上基遍去献祭；因为在那里有极大的邱坛，<br>他在那坛上献一千牺牲作燔祭。', ref: '列王纪上 3:4', hold: 6.5 },
    { text: '在基遍，夜间梦中，耶和华向所罗门显现，<br>对他说：「你愿我赐你什么？你可以求。」', ref: '列王纪上 3:5', hold: 6.5 },
    { text: '所罗门说：「……但我是幼童，不知道应当怎样出入。……<br>所以求你赐我智慧，可以判断你的民，能辨别是非……」', ref: '列王纪上 3:6–9', hold: 8 },
    { text: '所罗门因为求这事，就蒙主喜悦。', ref: '列王纪上 3:10', hold: 5 },
  ];
  const V4 = [
    { text: '神对他说：「你既然求这事，不为自己求寿、求富，……<br>单求智慧可以听讼，我就应允你所求的，赐你聪明智慧……」', ref: '列王纪上 3:11–12', hold: 7.5 },
    { text: '「你所没有求的，我也赐给你，就是富足、尊荣，<br>使你在世的日子，列王中没有一个能比你的。」', ref: '列王纪上 3:13', hold: 7 },
    { text: '所罗门醒了，不料是个梦。他就回到耶路撒冷，站在耶和华的约柜前，<br>献燔祭和平安祭，又为他众臣仆设摆筵席。', ref: '列王纪上 3:15', hold: 7.5 },
  ];
  const V5 = [
    { text: '一日，有两个妓女来，站在王面前。……<br>那妇人说：「不然，活孩子是我的，死孩子是你的。」……她们在王面前如此争论。', ref: '列王纪上 3:16–22', hold: 7.5 },
    { text: '就吩咐说：「拿刀来！」人就拿刀来。……活孩子的母亲为自己的孩子心里急痛，<br>就说：「求我主将活孩子给那妇人吧，万不可杀他！」', ref: '列王纪上 3:24–26', hold: 8 },
    { text: '王说：「将活孩子给这妇人，万不可杀他；这妇人实在是他的母亲。」<br>以色列众人……就都敬畏他；因为见他心里有神的智慧，能以断案。', ref: '列王纪上 3:27–28', hold: 8 },
  ];
  const V6 = [
    { text: '所罗门在世的日子，从但到别是巴的犹大人和以色列人<br>都在自己的葡萄树下和无花果树下安然居住。', ref: '列王纪上 4:25', hold: 7 },
    { text: '神赐给所罗门极大的智慧聪明和广大的心，如同海沙不可测量。', ref: '列王纪上 4:29', hold: 6 },
    { text: '他讲论草木，自黎巴嫩的香柏树直到墙上长的牛膝草，<br>又讲论飞禽走兽、昆虫水族。', ref: '列王纪上 4:33', hold: 7 },
    { text: '天下列王听见所罗门的智慧，就都差人来听他的智慧话。', ref: '列王纪上 4:34', hold: 5 },
  ];
  const V7 = [
    { text: '所罗门也差遣人去见希兰，说：「……我定意要为耶和华我神的名建殿……」', ref: '列王纪上 5:2–5', hold: 6 },
    { text: '希兰打发人去见所罗门，说：「……我的仆人必将这木料从黎巴嫩运到海里，<br>扎成筏子，浮海运到你所指定我的地方……」', ref: '列王纪上 5:8–9', hold: 8 },
    { text: '王下令，人就凿出又大又宝贵的石头来，用以立殿的根基。', ref: '列王纪上 5:17', hold: 5.5 },
  ];
  const V8 = [
    { text: '建殿是用山中凿成的石头。<br>建殿的时候，锤子、斧子，和别样铁器的响声都没有听见。', ref: '列王纪上 6:7', hold: 7 },
    { text: '所罗门建殿，安置香柏木的栋梁，又用香柏木板遮盖。……<br>全殿都贴上金子，直到贴完……', ref: '列王纪上 6:9–22', hold: 6.5 },
    { text: '……殿和一切属殿的都按着样式造成。他建殿的工夫共有七年。', ref: '列王纪上 6:38', hold: 5.5 },
    { text: '他将两根柱子立在殿廊前头：右边立一根，起名叫雅斤；<br>左边立一根，起名叫波阿斯。', ref: '列王纪上 7:21', hold: 6.5 },
  ];
  const V9 = [
    { text: '那时，所罗门将以色列的长老和各支派的首领……招聚到耶路撒冷，<br>要把耶和华的约柜从大卫城就是锡安运上来。', ref: '列王纪上 8:1', hold: 7.5 },
    { text: '祭司将耶和华的约柜抬进内殿，就是至圣所，放在两个基路伯的翅膀底下。', ref: '列王纪上 8:6', hold: 6.5 },
    { text: '祭司从圣所出来的时候，有云充满耶和华的殿；<br>甚至祭司不能站立供职，因为耶和华的荣光充满了殿。', ref: '列王纪上 8:10–11', hold: 8 },
  ];
  const V10 = [
    { text: '所罗门当着以色列会众，站在耶和华的坛前，向天举手说：', ref: '列王纪上 8:22', hold: 5 },
    { text: '「神果真住在地上吗？看哪，天和天上的天尚且不足你居住的，<br>何况我所建的这殿呢？」', ref: '列王纪上 8:27', hold: 8 },
    { text: '「你仆人和你民以色列向此处祈祷的时候，<br>求你在天上你的居所垂听，垂听而赦免……」', ref: '列王纪上 8:30', hold: 7 },
    { text: '第八日，王遣散众民；他们都为王祝福……就都心中喜乐，各归各家去了。', ref: '列王纪上 8:66', hold: 6 },
  ];
  const V11 = [
    { text: '耶和华就二次向所罗门显现……对他说：「……我已将你所建的这殿分别为圣，<br>使我的名永远在其中；我的眼、我的心也必常在那里。」', ref: '列王纪上 9:2–3', hold: 8 },
    { text: '「倘若你们和你们的子孙转去不跟从我……<br>我为己名所分别为圣的殿也必舍弃不顾……」', ref: '列王纪上 9:6–7', hold: 6.5 },
    { text: '所罗门王在以东地红海边……制造船只。……<br>他们到了俄斐，从那里得了四百二十他连得金子，运到所罗门王那里。', ref: '列王纪上 9:26–28', hold: 7.5 },
  ];
  const V12 = [
    { text: '示巴女王听见所罗门因耶和华之名所得的名声，<br>就来要用难解的话试问所罗门。', ref: '列王纪上 10:1', hold: 6 },
    { text: '跟随她到耶路撒冷的人甚多，<br>又有骆驼驮着香料、宝石，和许多金子。', ref: '列王纪上 10:2', hold: 6 },
    { text: '对王说：「……及至我来亲眼见了<br>才知道人所告诉我的还不到一半……」', ref: '列王纪上 10:6–7', hold: 6 },
    { text: '「耶和华你的神是应当称颂的！他喜悦你，使你坐以色列的国位；<br>因为他永远爱以色列，所以立你作王，使你秉公行义。」', ref: '列王纪上 10:9', hold: 7.5 },
  ];
  const V13 = [
    { text: '所罗门年老的时候，他的妃嫔诱惑他的心去随从别神，<br>不效法他父亲大卫诚诚实实地顺服耶和华他的神。', ref: '列王纪上 11:4', hold: 7.5 },
    { text: '所罗门为摩押可憎的神基抹和亚扪人可憎的神摩洛，<br>在耶路撒冷对面的山上建筑邱坛。', ref: '列王纪上 11:7', hold: 6.5 },
    { text: '耶和华向所罗门发怒……所以耶和华对他说：<br>「你既行了这事，不遵守我所吩咐你守的约和律例，我必将你的国夺回，赐给你的臣子。」', ref: '列王纪上 11:9–11', hold: 8 },
  ];
  const V14 = [
    { text: '一日，耶罗波安出了耶路撒冷，示罗人先知亚希雅在路上遇见他……<br>亚希雅将自己穿的那件新衣撕成十二片，对耶罗波安说：「你可以拿十片……」', ref: '列王纪上 11:29–31', hold: 8 },
    { text: '「……还留一个支派给他的儿子，使我仆人大卫在我所选择立我名的耶路撒冷城里，<br>在我面前长有灯光。」', ref: '列王纪上 11:36', hold: 8 },
    { text: '所罗门在耶路撒冷作以色列众人的王共四十年。<br>所罗门与他列祖同睡，葬在他父亲大卫的城里。他儿子罗波安接续他作王。', ref: '列王纪上 11:42–43', hold: 8 },
  ];

  // ════════════════════════════════════════════════════════════
  //  十四句话
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1 · 基训：膏所罗门作王（1:28–53）────────────────────────
    {
      kind: 'promise', utter: '我必使你的后裔接续你的位', cmd: 'anoint 所罗门 --oil 角 --at 基训  # 愿所罗门王万岁', ref: '撒母耳记下 7:12',
      verse: V1,
      apply(c) {
        const L = starts(V1), gx = X.gihon;
        T(c, [
          [0, b => { pose('bathsheba', 'bow'); face('nathan', 1); W.goTo(0.4, 24, b.instant); avoid([0.4, 1]); }],
          [1.6, b => {
            pose('bathsheba', 'stand');
            ride('solomon', 'mule');
            walk('mule', gx + 0.03, { speed: 0.045 });
            walk('zadok', gx - 0.016, { speed: 0.045 });
            walk('nathan', gx - 0.034, { speed: 0.043 });
            walk('benaiah', gx + 0.07, { speed: 0.047 });
            crowd('israel', { n: 12, x0: gx - 0.1, x1: gx + 0.13, label: '以色列人', from: fromOf(b), mill: false });
            depth('israel', 0, 0.16);
            clearGap('israel', gx - 0.03, gx + 0.05);
            sfx(b, 'donkey');
          }],
          [9.4, () => {
            ride('solomon', null);
            add('solomon', { v: 0.14 });
            walk('solomon', gx + 0.004, { speed: 0.03, pose: 'kneel' });
            walk('mule', gx + 0.055, { speed: 0.02 });
            face('zadok', 1);
          }],
          [10.4, b => {
            pose('zadok', 'raise');
            fxAdd(b, { type: 'oil', id: 'solomon', dur: 4.2 });
            glow('solomon', 0.95);
            sfx(b, 'harp');
          }],
          [12.6, b => { nameOver(b, 'solomon', '所罗门王', [255, 226, 150], { lift: 1.6 }); relabel('solomon', '所罗门王'); }],
          [14, b => {
            pose('solomon', 'stand'); pose('zadok', 'stand');
            crowdPose('israel', 'raise');
            sfx(b, 'angel'); sfx(b, 'crowd');
            if (!b.instant) fx().ring(gx * W.w, gY(2, gx) - 20 * PK(), [255, 232, 180], M() * 0.35, 2.4, 2);
          }],
          [L[2], b => {
            glow('solomon', 0.6);
            ride('solomon', 'mule');
            walk('mule', X.throne - 0.034, { speed: 0.042 });
            add('solomon', { v: 0 });
            crowdWalk('israel', 0.58, 0.76, { speed: 0.04 });
            walk('zadok', 0.77, { speed: 0.04 }); walk('nathan', 0.755, { speed: 0.04 }); walk('benaiah', 0.74, { speed: 0.04 });
            sfx(b, 'harp');
          }],
          [L[2] + 1.6, b => { if (!b.instant) { W.shake = 0.45; fx().ring(0.6 * W.w, gY(2, 0.6), [255, 240, 210], M() * 0.5, 2.6, 1.6); } sfx(b, 'crowd'); }],
          [L[3], b => { scatter('guests'); walk('adonijah', X.gibeon - 0.02, { layer: 1, speed: 0.03 }); W.set('soFeast', 0, b.instant); }],
          [L[3] + 1.2, () => {
            ride('solomon', null);
            walk('solomon', X.throne, { speed: 0.03 });
            walk('mule', 0.99, { speed: 0.03 });
            crowdPose('israel', 'stand');
          }],
          [L[3] + 2.4, () => { toThrone('solomon'); crowdFace('israel', 1); }],
          [L[3] + 3.5, () => { uncrowd('guests'); rm('adonijah'); rm('mule'); crowdPose('israel', 'bow'); }],
        ]);
      },
    },

    // ── 2 · 大卫与列祖同睡；国甚是坚固（2:1–46）─────────────────
    {
      kind: 'promise', utter: '就不断人坐以色列的国位', cmd: 'throne.lock --heir 所罗门  # 你的子孙若谨慎自己的行为', ref: '2:4',
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.735, 7, b.instant);
            crowdPose('israel', 'stand');
            crowdWalk('israel', 0.5, 0.64, { speed: 0.03 });
            offThrone('solomon');
            walk('solomon', X.bed - 0.024, { speed: 0.03, pose: 'kneel' });
            walk('bathsheba', X.bed + 0.03, { speed: 0.025 });
            walk('nathan', X.throne - 0.046, { speed: 0.025 });
            walk('zadok', X.throne - 0.07, { speed: 0.02 });
            walk('benaiah', X.throne - 0.094, { speed: 0.02 });
          }],
          [3, () => { face('solomon', 1); face('bathsheba', -1); glow('david', 0.8); }],
          [6, () => uncrowd('israel')],
          // 应许的国位：空着的宝座上有光，落到跪着的儿子身上（2:4）
          [L[1] + 1.2, b => {
            if (!b.instant) { const sf = seatFoot(); motes(b, [X.throne, (sf[1] - 24 * PK()) / W.h], 'solomon', { n: 26, dur: 4.2, spread: 26 }); }
            glow('solomon', 0.8);
            sfx(b, 'chime');
          }],
          [L[2] + 0.4, b => { pose('david', 'lie'); glow('solomon', 0.6); sfx(b, 'weep'); }],
          [L[2] + 1.2, b => { soul(b, 'david', 6.5); pose('bathsheba', 'weep'); pose('nathan', 'bow'); pose('solomon', 'weep'); }],
          [L[2] + 4, b => { rm('david'); W.set('soBed', 0, b.instant); }],
          [L[2] + 4.4, b => { W.goTo(0.28, 6, b.instant); }],
          [L[3], b => {
            pose('solomon', 'stand'); pose('bathsheba', 'stand'); pose('nathan', 'stand');
            walk('solomon', X.throne, { speed: 0.025 });
            walk('bathsheba', X.throne + 0.03, { speed: 0.02 });
            // 群臣退到台阶之外（台阶半宽约 0.022）再下拜
            walk('nathan', X.throne - 0.05, { speed: 0.025 }); walk('zadok', X.throne - 0.074, { speed: 0.025 }); walk('benaiah', X.throne - 0.098, { speed: 0.025 });
            sfx(b, 'seal');
          }],
          [L[3] + 2.8, b => {
            toThrone('solomon');
            face('bathsheba', -1);
            face('nathan', 1); face('zadok', 1); face('benaiah', 1);
            if (!b.instant) fx().ring(X.throne * W.w, gY(2, X.throne) - 30 * PK(), [255, 226, 160], M() * 0.3, 2.4, 2);
          }],
          [L[3] + 3.4, () => { pose('nathan', 'bow'); pose('zadok', 'bow'); pose('benaiah', 'bow'); }],
          [L[3] + 5.6, () => { pose('nathan', 'stand'); pose('zadok', 'stand'); pose('benaiah', 'stand'); }],
        ]);
      },
    },

    // ── 3 · 基遍：你愿我赐你什么？（3:1–10）──────────────────────
    {
      kind: 'ask', utter: '你愿我赐你什么？你可以求', cmd: 'ask --what ?  # 在基遍，夜间梦中', ref: '3:5', tint: [236, 230, 255],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.64, 6, b.instant);
            offThrone('solomon');
            walk('solomon', X.dream, { speed: 0.038 });
            walk('zadok', X.dream + 0.032, { speed: 0.038 });
            walk('bathsheba', 1.04, { speed: 0.03 }); walk('nathan', 1.06, { speed: 0.03 }); walk('benaiah', 1.02, { speed: 0.03 });
            W.set('soGibeon', 1, b.instant);
            sfx(b, 'fire');
            avoid([0.5, 0.66]);
          }],
          [4, () => { rm('bathsheba'); rm('nathan'); rm('benaiah'); }],
          [L[1] - 1.4, b => W.goTo(0.99, 6, b.instant)],
          [9.5, () => { face('solomon', -1); pose('zadok', 'bow'); }],
          [L[1] + 2.6, b => { rm('zadok'); pose('solomon', 'lie'); W.set('soGibeon', 0.7, b.instant); }],
          [L[1] + 3.6, b => {
            S.pres = 'gibeon';
            W.set('soDream', 1, b.instant);
            W.set('soPresence', 1, b.instant);
            sfx(b, 'angel');
          }],
          [L[2], b => { pose('solomon', 'kneel'); face('solomon', 1); sfx(b, 'harp'); }],
          [L[2] + 1.5, () => pose('solomon', 'pray')],
          [L[3], b => { glow('solomon', 0.7); if (!b.instant) fx().ring(X.dream * W.w, gY(2, X.dream) - 20 * PK(), [255, 236, 190], M() * 0.25, 2.2, 1.6); }],
        ]);
      },
    },

    // ── 4 · 我就应允你所求的（3:11–15）──────────────────────────
    {
      kind: 'promise', utter: '我就应允你所求的，赐你聪明智慧', cmd: 'grant 智慧 聪明 --bonus 富足 尊荣', ref: '3:12', tint: [255, 236, 180],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            motes(b, [X.dream, beamTop() / W.h + 0.04], 'solomon', { n: 44, dur: 5, spread: 70 });
            glow('solomon', 1);
            sfx(b, 'angel');
          }],
          [2.6, b => { nameOver(b, 'solomon', '智慧', [255, 232, 160], { size: 0.05, lift: 1.4, hold: 3 }); }],
          [4.5, b => { pose('solomon', 'kneel'); if (!b.instant) fx().ring(X.dream * W.w, gY(2, X.dream) - 22 * PK(), [255, 226, 150], M() * 0.3, 2.4, 2); }],
          [L[1] + 1, b => { motes(b, [X.dream, beamTop() / W.h + 0.12], 'solomon', { n: 30, dur: 4, spread: 110, c: [255, 210, 120] }); sfx(b, 'chime'); }],
          [L[2] - 1.4, b => { W.set('soPresence', 0, b.instant); W.set('soDream', 0, b.instant); W.goTo(0.28, 6, b.instant); S.pres = null; }],
          [L[2] - 1, () => pose('solomon', 'lie')],
          [L[2] + 0.6, b => { pose('solomon', 'stand'); glow('solomon', 0.6); W.set('soGibeon', 0, b.instant); }],
          [L[2] + 2, b => { walk('solomon', X.tent - 0.036, { speed: 0.052, pose: 'bow' }); avoid([0.47, 1]); }],
        ]);
      },
    },

    // ── 5 · 两个妇人与一个活孩子（3:16–28）──────────────────────
    {
      kind: 'act', utter: '因为见他心里有神的智慧，能以断案', cmd: 'judge --case 活孩子 --by 神的智慧', ref: '3:28',
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.44, 6, b.instant);
            pose('solomon', 'stand');
            walk('solomon', X.throne, { speed: 0.03 });
            add('woman1', { label: '妇人', sex: 'f', age: 'adult', x: 0.64, facing: 1, robe: ROBE.woman1, glow: 0.25, from: fromOf(b) });
            add('woman2', { label: '妇人', sex: 'f', age: 'adult', x: 0.62, facing: 1, robe: ROBE.woman2, glow: 0.2, carry: 'baby', from: fromOf(b) });
            walk('woman1', 0.772, { speed: 0.03 });
            walk('woman2', 0.745, { speed: 0.03 });
            crowd('israel', { n: 9, x0: 0.56, x1: 0.72, label: '以色列人', from: fromOf(b), mill: false });
            depth('israel', 0.05, 0.4);
            avoid([0.47, 1]);
          }],
          [2.6, () => toThrone('solomon')],
          [6.4, () => { crowdFace('israel', 1); face('woman1', -1); pose('woman1', 'point'); }],
          [8.2, () => { pose('woman1', 'stand'); face('woman2', 1); pose('woman2', 'point'); }],
          [L[1], b => {
            pose('woman2', 'stand'); face('woman1', -1); face('woman2', 1);
            add('servant', { label: '仆人', sex: 'm', age: 'adult', x: 0.88, facing: -1, robe: ROBE.servant, glow: 0.15, prop: null, from: fromOf(b) });
            walk('servant', 0.796, { speed: 0.03 });
          }],
          [L[1] + 2.2, b => { prop('servant', 'sword'); fxAdd(b, { type: 'glint', id: 'servant', dur: 1.4, delay: 0.5 }); }],
          [L[1] + 4.4, b => { pose('woman1', 'fall', { weep: true }); sfx(b, 'weep'); }],
          [L[2], b => { pose('solomon', 'point'); face('solomon', -1); sfx(b, 'harp'); }],
          [L[2] + 1.6, b => {
            prop('servant', null); walk('servant', X.throne + 0.048, { speed: 0.03, pose: 'bow' }); face('servant', -1);
            carry('woman2', null);
            pose('woman1', 'stand', { weep: false });
            carry('woman1', 'baby');
            motes(b, 'woman2', 'woman1', { n: 16, dur: 1.8, spread: 10 });
          }],
          [L[2] + 3, b => { pose('solomon', 'seat'); relabel('woman1', '孩子的母亲'); face('woman1', 1); glow('woman1', 0.5); crowdPose('israel', 'bow'); sfx(b, 'crowd', { soft: true }); }],
          [L[2] + 5, () => { walk('woman1', 0.6, { speed: 0.025 }); walk('woman2', 0.58, { speed: 0.03 }); walk('servant', 0.94, { speed: 0.03 }); }],
          [L[2] + 7, () => { crowdPose('israel', 'stand'); }],
          [L[2] + 8.6, () => { rm('woman1'); rm('woman2'); rm('servant'); }],
        ]);
      },
    },

    // ── 6 · 如同海沙（4:1–34）───────────────────────────────────
    {
      kind: 'act', utter: '神赐给所罗门极大的智慧聪明和广大的心', cmd: 'wisdom.size = 海沙  # 不可测量', ref: '4:29', tint: [255, 240, 196],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        T(c, [
          [0, b => {
            W.goTo(0.745, 15, b.instant);
            crowdWalk('israel', 0.56, 0.76, { speed: 0.025, pose: 'sit' });
          }],
          [4, b => { crowdPose('israel', 'sit'); }],
          [L[1], b => { W.set('soSand', 1, b.instant); sfx(b, 'stars'); }],
          [L[2] + 0.4, b => {
            if (b.instant) return;
            // 黎巴嫩的香柏树在中丘上显出；飞禽在天；走兽在右边的地上；水族在殿地前的海湾里（都在经文框之外）
            fxAdd(b, { type: 'cedar', dur: 7.5 });
            const ct = cedarTop();
            nameAtPt(b, '香柏树', ct[0], ct[1] - 22 * SU(), [190, 236, 170], null, { delay: 0.8 });
            nameAtPt(b, '飞禽', W.w * 0.74, W.h * 0.3, [236, 244, 255], null, { delay: 1.8 });
            nameAtPt(b, '走兽', W.w * 0.9, fieldY(0.9, 0.1) - 70 * PK(), [240, 214, 170], null, { delay: 2.8 });
            nameAtPt(b, '水族', W.w * 0.57, W.h * 0.8, [190, 224, 255], () => [W.w * rand(0.5, 0.64), W.h * rand(0.76, 0.84)], { delay: 3.8 });
            sfx(b, 'bird');
          }],
          [L[3], b => {
            crowd('envoys', { n: 4, x0: 1.02, x1: 1.1, label: '列王差来的人', robe: ROBE.envoy, from: fromOf(b), mill: false });
            crowdWalk('envoys', 0.862, 0.94, { speed: 0.04, pose: 'bow' });
            sfx(b, 'camel', { soft: true });
          }],
          [L[3] + 4.2, () => { crowdFace('envoys', -1); crowdPose('envoys', 'bow'); }],
        ]);
      },
    },

    // ── 7 · 香柏木浮海而来；山中凿石（5:1–18）───────────────────
    {
      kind: 'promise', utter: '他必为我的名建殿', cmd: 'import 香柏木 --from 黎巴嫩 --via 海  # 扎成筏子', ref: '5:5',
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.36, 8, b.instant);
            crowdWalk('envoys', 1.06, 1.14, { speed: 0.04 });
            W.set('soSand', 0, b.instant);
            crowdPose('israel', 'stand');
          }],
          [3, () => { uncrowd('envoys'); uncrowd('israel'); }],
          [3.4, b => {
            crowd('workers', { n: 8, x0: 0.58, x1: 0.74, label: '匠人', robe: ROBE.worker, from: fromOf(b), mill: false });
            depth('workers', 0.04, 0.3);
          }],
          [L[1] - 1.2, b => {
            craft(b, 'raft', 0, 11, fleetPath(0));
            craft(b, 'raft', 1.6, 10.5, fleetPath(1));
            craft(b, 'raft', 3.2, 10, fleetPath(2));
          }],
          [L[1] + 9.2, b => { W.set('soLogs', 1, b.instant); sfx(b, 'splash'); }],
          [L[2], b => { W.set('soStones', 1, b.instant); sfx(b, 'build', { far: true }); crowdWalk('workers', 0.66, 0.79, { speed: 0.035, pose: 'carry' }); }],
          [L[2] + 1.5, b => sfx(b, 'build', { far: true, soft: true })],
          [L[2] + 3, b => { W.set('soSite', 1, b.instant); fxAdd(b, { type: 'found', dur: 3.2 }); sfx(b, 'seal'); crowdPose('workers', 'stand'); }],
        ]);
      },
    },

    // ── 8 · 殿在寂静中建成（6:1—7:51）───────────────────────────
    {
      kind: 'promise', utter: '我必住在以色列人中间', cmd: 'build 耶和华的殿 --silent  # 锤子、斧子的响声都没有听见', ref: '6:13',
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.set('soBuild', 1, b.instant);
            glideStones(b, 10.4, 46);
            W.goTo(0.36, 5.2, b.instant);
            crowdPose('workers', 'stand');
            sfx(b, 'chime');
            avoid([0.47, 1]);
          }],
          [5.4, b => W.goTo(0.36, 5.2, b.instant)],
          [L[1] + 2, b => { W.set('soCedar', 1, b.instant); glideLogs(b, 2.4, 8); }],
          [L[1] + 4.6, b => { W.set('soLogs', 0, b.instant); W.set('soStones', 0, b.instant); W.set('soGold', 1, b.instant); fxAdd(b, { type: 'sheen', dur: 3.4 }); sfx(b, 'angel'); }],
          [L[2], b => { W.goTo(0.42, 4.5, b.instant); crowdWalk('workers', 0.78, 0.94, { speed: 0.03 }); }],
          [L[2] + 3, () => uncrowd('workers')],
          [L[3], b => { W.set('soPillars', 1, b.instant); W.set('soSea', 1, b.instant); sfx(b, 'build', { soft: true }); }],
          [L[3] + 4.4, b => {
            if (b.instant) return;
            const G = TG(), k = G.k;
            nameAtPt(b, '波阿斯', G.x0 + PILLAR_X[0] * k - 18 * SU(), G.fy - 104 * k, [255, 214, 150], () => [G.x0 + PILLAR_X[0] * k + rand(-6, 6), G.fy - rand(10, 90) * k], { size: 0.03 });
            nameAtPt(b, '雅斤', G.x0 + PILLAR_X[1] * k + 22 * SU(), G.fy - 146 * k, [255, 214, 150], () => [G.x0 + PILLAR_X[1] * k + rand(-6, 6), G.fy - rand(10, 90) * k], { size: 0.03, delay: 0.6 });
            sfx(b, 'seal');
          }],
        ]);
      },
    },

    // ── 9 · 约柜进殿，云充满耶和华的殿（8:1–13）★ ────────────────
    {
      kind: 'act', utter: '有云充满耶和华的殿', cmd: 'cloud.fill 耶和华的殿  # 祭司不能站立供职', ref: '8:10', tint: [255, 248, 230],
      verse: V9,
      apply(c) {
        const L = starts(V9), dx = doorX();
        T(c, [
          [0, b => {
            W.goTo(0.72, 22, b.instant);
            S.ark = 'carried';
            priest('pr1', X.tent - 0.028, b, { v: 0.1 });
            priest('pr2', X.tent - 0.004, b, { v: 0.1 });
            priest('pr3', X.tent - 0.022, b, { v: 0 });
            priest('pr4', X.tent + 0.002, b, { v: 0 });
            add('zadok', { label: '撒督', sex: 'm', age: 'elder', x: X.tent - 0.05, facing: -1, robe: ROBE.zadok, glow: 0.3, hair: 'cloth', accent: LINEN, prop: null, from: fromOf(b) });
            PRIESTS.forEach(id => pose(id, 'carry'));
            crowd('elders', { n: 6, x0: 0.64, x1: 0.76, label: '以色列的长老', from: fromOf(b), mill: false });
            crowd('israel', { n: 12, x0: 0.58, x1: 0.8, label: '以色列会众', from: fromOf(b), mill: false });
            depth('israel', 0.14, 0.5); depth('elders', 0.02, 0.12);
            offThrone('solomon');
            walk('solomon', altarX() / W.w - 0.02, { speed: 0.035 });
            sfx(b, 'crowd');
            avoid([0.47, 1]);
          }],
          [1, () => {
            walk('zadok', dx - 0.02, { speed: 0.028 });
            walk('pr1', dx, { speed: 0.028, pose: 'carry' }); walk('pr2', dx + 0.024, { speed: 0.028, pose: 'carry' });
            walk('pr3', dx + 0.006, { speed: 0.028, pose: 'carry' }); walk('pr4', dx + 0.03, { speed: 0.028, pose: 'carry' });
          }],
          [3, b => { W.set('soFire', 1, b.instant); W.set('soTent', 0, b.instant); sfx(b, 'fire'); sfx(b, 'bleat'); }],
          [9.4, () => { face('solomon', 1); crowdFace('israel', -1); crowdFace('elders', -1); }],
          [14.2, b => { PRIESTS.forEach(id => rm(id)); S.ark = 'temple'; W.set('soGlory', 0.35, b.instant); sfx(b, 'seal'); pose('zadok', 'bow'); }],
          [15.8, b => {
            PRIESTS.forEach((id, i) => { priest(id, dx, b, { v: 0.04 * i }); walk(id, dx + 0.022 + i * 0.013, { speed: 0.03 }); });
            pose('zadok', 'stand');
          }],
          [L[2], b => { W.set('soCloud', 1, b.instant); sfx(b, 'angel'); if (!b.instant) W.flash = 0.25; }],
          [L[2] + 2.4, b => {
            PRIESTS.forEach(id => pose(id, 'fall')); pose('zadok', 'fall');
            crowdPose('israel', 'bow'); crowdPose('elders', 'bow');
            pose('solomon', 'kneel');
            W.set('soGlory', 1, b.instant);
          }],
        ]);
      },
    },

    // ── 10 · 天和天上的天（8:14–66）★ ───────────────────────────
    {
      kind: 'act', utter: '天和天上的天尚且不足你居住的', cmd: 'heaven.contains(神)  # false', ref: '8:27', tint: [226, 232, 255],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.755, 5, b.instant);
            W.set('soCloud', 0, b.instant);
            W.set('soTorch', 1, b.instant);
            PRIESTS.forEach(id => pose(id, 'stand')); pose('zadok', 'stand');
            crowdPose('israel', 'stand'); crowdPose('elders', 'stand');
            pose('solomon', 'stand'); face('solomon', 1);
          }],
          [1.6, b => { pose('solomon', 'raise'); glow('solomon', 0.85); sfx(b, 'harp'); }],
          [L[1] - 1, b => W.goTo(0.99, 6, b.instant)],
          [L[1], b => { W.set('soHeaven', 1, b.instant); W.set('soCloud', 0, b.instant); sfx(b, 'stars'); }],
          [L[2], b => { pose('solomon', 'pray'); crowdPose('israel', 'bow'); crowdPose('elders', 'bow'); sfx(b, 'angel'); }],
          [L[3] - 1.4, b => { W.goTo(0.3, 7, b.instant); W.set('soHeaven', 0, b.instant); W.set('soTorch', 0, b.instant); pose('solomon', 'stand'); }],
          [L[3], b => {
            crowdPose('israel', 'stand'); crowdPose('elders', 'stand');
            crowdWalk('israel', 0.9, 1.1, { speed: 0.04 }); crowdWalk('elders', 0.95, 1.1, { speed: 0.035 });
            sfx(b, 'crowd');
          }],
          [L[3] + 1.5, () => { PRIESTS.forEach(id => rm(id)); rm('zadok'); }],
          [L[3] + 4, () => { uncrowd('israel'); uncrowd('elders'); }],
        ]);
      },
    },

    // ── 11 · 使我的名永远在其中（9:1–28）────────────────────────
    {
      kind: 'promise', utter: '使我的名永远在其中', cmd: 'name.bind 殿 --forever  # 我的眼、我的心也必常在那里', ref: '9:3', tint: [255, 236, 190],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => { W.goTo(0.97, 6, b.instant); walk('solomon', 0.64, { speed: 0.025 }); W.set('soFire', 0.5, b.instant); }],
          [3, () => { face('solomon', 1); pose('solomon', 'lie'); }],
          [3.8, b => { S.pres = 'temple'; W.set('soDream', 0.8, b.instant); W.set('soPresence', 1, b.instant); sfx(b, 'angel'); }],
          [6.4, b => {
            W.set('soName', 1, b.instant);
            if (!b.instant) fx().ring(holyX(), TG().fy - 70 * TG().k, [255, 232, 180], M() * 0.3, 2.6, 2);
            sfx(b, 'seal');
          }],
          [L[1] + 0.6, b => W.set('soDim', 0.4, b.instant)],
          [L[1] + 4.6, b => W.set('soDim', 0, b.instant)],
          [L[2] - 1.6, b => { W.set('soPresence', 0, b.instant); W.set('soDream', 0, b.instant); S.pres = null; W.goTo(0.34, 7, b.instant); }],
          [L[2] - 0.6, () => pose('solomon', 'stand')],
          [L[2], b => {
            craft(b, 'ship', 0, 9, fleetPath(0), { gold: true });
            craft(b, 'ship', 2.2, 8.5, fleetPath(2), { gold: true });
            sfx(b, 'splash', { far: true });
          }],
          [L[2] + 1.2, () => walk('solomon', X.throne, { speed: 0.034 })],
          [L[2] + 8.6, b => { toThrone('solomon'); motes(b, fleetEnd(), 'solomon', { n: 30, dur: 3.4, spread: 60 }); sfx(b, 'chime'); }],
        ]);
      },
    },

    // ── 12 · 示巴女王（10:1–29）─────────────────────────────────
    {
      kind: 'act', utter: '因为他永远爱以色列', cmd: 'sheba.visit 所罗门  # 还不到一半', ref: '10:9',
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.46, 8, b.instant);
            add('queen', { label: '示巴女王', sex: 'f', age: 'adult', x: 1.06, facing: -1, robe: ROBE.queen, glow: 0.4, hair: 'veil', accent: [236, 196, 110], from: fromOf(b) });
            walk('queen', 0.868, { speed: 0.03 });
            W.set('soFire', 0.4, b.instant);
            // 驼队排成一行、彼此不相叠（末一匹半在画外）
            animal('cam1', 'camel', 1.1, { label: '骆驼', facing: -1, pack: true, v: 0.02, from: fromOf(b) });
            animal('cam2', 'camel', 1.16, { label: '骆驼', facing: -1, pack: true, v: 0.07, from: fromOf(b) });
            animal('cam3', 'camel', 1.22, { label: '骆驼', facing: -1, pack: true, v: 0.04, from: fromOf(b) });
            walk('cam1', 0.912, { speed: 0.03 }); walk('cam2', 0.966, { speed: 0.03 }); walk('cam3', 1.02, { speed: 0.03 });
            // 仆从在驼队之前（近处）
            crowd('sheba', { n: 4, x0: 1.04, x1: 1.12, label: '示巴的仆从', robe: [168, 120, 70], from: fromOf(b), mill: false });
            depth('sheba', 0.36, 0.5);
            crowdWalk('sheba', 0.874, 0.93, { speed: 0.032 });
            sfx(b, 'camel');
          }],
          [6.8, () => { pose('queen', 'bow'); pose('cam2', 'lie'); pose('cam3', 'lie'); }],
          [8.8, () => { pose('queen', 'stand'); face('queen', -1); }],
          [L[2], b => { pose('queen', 'gaze'); fxAdd(b, { type: 'sheen', dur: 3.6 }); }],
          [L[2] + 4, () => pose('queen', 'stand')],
          [L[3], b => { pose('queen', 'raise'); glow('queen', 0.6); sfx(b, 'harp'); }],
          [L[3] + 1.8, b => {
            motes(b, 'cam1', 'solomon', { n: 34, dur: 3.6, spread: 30 });
            motes(b, 'cam2', 'solomon', { n: 20, dur: 3.6, spread: 30, delay: 0.6, c: [255, 196, 150] });
            W.set('soThrone', 1, b.instant);
            if (!b.instant) { const sf = seatFoot(); fx().ring(sf[0], sf[1] - 18 * PK(), [255, 238, 200], M() * 0.2, 2.4, 1.8); }
            sfx(b, 'chime');
          }],
          [L[3] + 5, () => { pose('queen', 'stand'); pose('cam2', 'stand'); pose('cam3', 'stand'); }],
        ]);
      },
    },

    // ── 13 · 心偏离了（11:1–13）─────────────────────────────────
    {
      kind: 'judge', utter: '我必将你的国夺回，赐给你的臣子', cmd: 'kingdom.split --give 臣子  # 因大卫的缘故，留一支派', ref: '11:11', tint: [214, 196, 214],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        // 王与妃嫔在殿前的田野里（近处）：背向殿，面向大卫城后面、对面山上的邱坛
        const WPOS = [0.612, 0.636, 0.684, 0.708, 0.732, 0.756], WV = [0.36, 0.5, 0.52, 0.34, 0.46, 0.3];
        T(c, [
          [0, b => {
            W.goTo(0.76, 12, b.instant);
            face('queen', 1); walk('queen', 1.08, { speed: 0.032 });
            walk('cam1', 1.12, { speed: 0.03 }); walk('cam2', 1.16, { speed: 0.03 }); walk('cam3', 1.2, { speed: 0.03 });
            crowdWalk('sheba', 1.06, 1.16, { speed: 0.032 });
            add('solomon', { age: 'elder' });
            WIVES.forEach((rb, i) => add('w' + i, { label: '妃嫔', sex: 'f', age: 'adult', x: WPOS[i] - 0.05, facing: 1, robe: rb, glow: 0.14, hair: 'veil', accent: [236, 210, 150], v: WV[i], from: fromOf(b) }));
          }],
          [3, () => {
            ['queen', 'cam1', 'cam2', 'cam3'].forEach(id => rm(id)); uncrowd('sheba');
            WIVES.forEach((rb, i) => walk('w' + i, WPOS[i], { speed: 0.02 }));
            offThrone('solomon');
            add('solomon', { v: 0.42 });
            walk('solomon', 0.66, { speed: 0.032 });
          }],
          [L[1], b => { W.set('soHigh', 1, b.instant); W.set('soFire', 0.2, b.instant); sfx(b, 'fire', { low: true }); }],
          [L[1] + 1.6, b => { face('solomon', 1); pose('solomon', 'bow'); WIVES.forEach((rb, i) => { face('w' + i, 1); pose('w' + i, 'bow'); }); W.set('soDim', 1, b.instant); }],
          [L[2], b => { W.set('storm', 0.55, b.instant); sfx(b, 'thunder', { far: true, low: true }); if (!b.instant) W.flash = 0.12; }],
          [L[2] + 3, () => { pose('solomon', 'stand'); face('solomon', -1); }],
        ]);
      },
    },

    // ── 14 · 在我面前长有灯光（11:14–43）────────────────────────
    {
      kind: 'promise', utter: '在我面前长有灯光', cmd: 'lamp.keep 耶路撒冷 --always  # 因我仆人大卫', ref: '11:36', tint: [255, 214, 150],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        // 亚希雅与耶罗波安在田野里相遇（殿前的近处，殿门那盏灯照得到）
        const AX = 0.628, JX = 0.684;
        T(c, [
          [0, b => {
            W.goTo(0.97, 7, b.instant);
            W.set('storm', 0.12, b.instant);
            W.set('soFire', 0, b.instant);
            WIVES.forEach((rb, i) => { face('w' + i, 1); walk('w' + i, 0.78 + i * 0.03, { speed: 0.03 }); });
            walk('solomon', X.throne, { speed: 0.036 });
            add('ahijah', { label: '亚希雅', sex: 'm', age: 'elder', x: 0.47, v: 0.42, facing: 1, robe: ROBE.ahijah, glow: 0.45, from: fromOf(b) });
            walk('ahijah', AX, { speed: 0.026 });
          }],
          [3.6, b => {
            WIVES.forEach((rb, i) => rm('w' + i));
            add('jeroboam', { label: '耶罗波安', sex: 'm', age: 'adult', x: 0.76, v: 0.38, facing: -1, robe: ROBE.jeroboam, glow: 0.4, from: fromOf(b) });
            walk('jeroboam', JX, { speed: 0.026 });
          }],
          [5.2, () => toThrone('solomon')],
          [6.8, () => { face('ahijah', 1); face('jeroboam', -1); pose('ahijah', 'raise'); }],
          [7.2, b => { fxAdd(b, { type: 'cloth', dur: 8 }); sfx(b, 'wings'); }],
          [9.4, () => { pose('jeroboam', 'carry'); glow('jeroboam', 0.6); pose('ahijah', 'stand'); }],
          [L[1] + 1.8, b => { W.set('soLamp', 1, b.instant); W.set('soHigh', 0.4, b.instant); sfx(b, 'chime'); if (!b.instant) { const p = lampPt(); fx().ring(p[0], p[1] - 14 * TG().k, [255, 214, 150], M() * 0.25, 2.6, 1.6); } }],
          [L[1] + 4.6, () => { pose('jeroboam', 'stand'); glow('jeroboam', 0.3); walk('jeroboam', 0.54, { speed: 0.03 }); walk('ahijah', 0.5, { speed: 0.026 }); }],
          [L[1] + 7.4, () => { rm('jeroboam'); rm('ahijah'); }],
          [L[2], b => { pose('solomon', 'lie'); W.set('soDim', 0.5, b.instant); W.set('storm', 0, b.instant); sfx(b, 'weep', { soft: true }); }],
          [L[2] + 1.4, b => { soul(b, 'solomon', 7); }],
          [L[2] + 3.4, b => {
            rm('solomon');
            add('rehoboam', { label: '罗波安', sex: 'm', age: 'adult', x: 0.9, facing: -1, robe: ROBE.rehoboam, glow: 0.6, hair: 'cloth', accent: KING_ACC, from: fromOf(b) });
            walk('rehoboam', X.throne, { speed: 0.025 });
          }],
          [L[2] + 6.6, () => { toThrone('rehoboam'); glow('rehoboam', 0.6); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '列王纪上', books: [11], title: '所罗门', sub: '列王纪上 1 — 11', tint: [255, 222, 150], music: 'joseph',
    intro: INTRO,
    outro: 18,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '所罗门': { text: '所罗门的智慧超过东方人和埃及人的一切智慧。', ref: '列王纪上 4:30' },
      '所罗门王': { text: '所罗门王的财宝与智慧胜过天下的列王。', ref: '列王纪上 10:23' },
      '大卫': { text: '大卫作以色列王四十年：在希伯仑作王七年，在耶路撒冷作王三十三年。', ref: '列王纪上 2:11' },
      '拔示巴': { text: '吩咐人为王母设一座位，她便坐在王的右边。', ref: '列王纪上 2:19' },
      '拿单': { text: '祭司撒督和先知拿单在基训已经膏他作王。', ref: '列王纪上 1:45' },
      '撒督': { text: '祭司撒督就从帐幕中取了盛膏油的角来，用膏膏所罗门。', ref: '列王纪上 1:39' },
      '比拿雅': { text: '王就立耶何耶大的儿子比拿雅作元帅，代替约押……', ref: '列王纪上 2:35' },
      '亚多尼雅': { text: '亚多尼雅惧怕所罗门，就起来，去抓住祭坛的角。', ref: '列王纪上 1:50' },
      '骡子': { text: '于是，祭司撒督、先知拿单、耶何耶大的儿子比拿雅……<br>都下去使所罗门骑大卫王的骡子，将他送到基训。', ref: '列王纪上 1:38' },
      '基训': { text: '祭司撒督和先知拿单在基训已经膏他作王。<br>众人都从那里欢呼着上来，声音使城震动……', ref: '列王纪上 1:45' },
      '基遍的邱坛': { text: '所罗门王上基遍去献祭；因为在那里有极大的邱坛，<br>他在那坛上献一千牺牲作燔祭。', ref: '列王纪上 3:4' },
      '邱坛': { text: '所罗门为摩押可憎的神基抹和亚扪人可憎的神摩洛，<br>在耶路撒冷对面的山上建筑邱坛。', ref: '列王纪上 11:7' },
      '以色列人': { text: '犹大人和以色列人如同海边的沙那样多，都吃喝快乐。', ref: '列王纪上 4:20' },
      '以色列会众': { text: '他们都为王祝福。因见耶和华向他仆人大卫和他民以色列所施的一切恩惠，<br>就都心中喜乐，各归各家去了。', ref: '列王纪上 8:66' },
      '孩子的母亲': { text: '王说：「将活孩子给这妇人，万不可杀他；这妇人实在是他的母亲。」', ref: '列王纪上 3:27' },
      '妇人': { text: '一日，有两个妓女来，站在王面前。', ref: '列王纪上 3:16' },
      '匠人': { text: '所罗门的匠人和希兰的匠人，并迦巴勒人，都将石头凿好，预备木料和石头建殿。', ref: '列王纪上 5:18' },
      '香柏木': { text: '于是希兰照着所罗门所要的，给他香柏木和松木。', ref: '列王纪上 5:10' },
      '凿成的石头': { text: '王下令，人就凿出又大又宝贵的石头来，用以立殿的根基。', ref: '列王纪上 5:17' },
      '殿的根基': { text: '在位第四年西弗月，立了耶和华殿的根基。', ref: '列王纪上 6:37' },
      '耶和华的殿': { text: '我已经建造殿宇作你的居所，为你永远的住处。', ref: '列王纪上 8:13' },
      '雅斤': { text: '他将两根柱子立在殿廊前头：右边立一根，起名叫雅斤……', ref: '列王纪上 7:21' },
      '波阿斯': { text: '……左边立一根，起名叫波阿斯。在柱顶上刻着百合花。', ref: '列王纪上 7:21–22' },
      '铜海': { text: '他又铸一个铜海，样式是圆的，高五肘，径十肘，围三十肘。', ref: '列王纪上 7:23' },
      '铜坛': { text: '当日，王因耶和华殿前的铜坛太小，容不下燔祭、素祭，和平安祭牲的脂油……', ref: '列王纪上 8:64' },
      '约柜': { text: '约柜里惟有两块石版，就是以色列人出埃及地后，<br>耶和华与他们立约的时候摩西在何烈山所放的。', ref: '列王纪上 8:9' },
      '帐幕': { text: '祭司和利未人将耶和华的约柜运上来，又将会幕和会幕的一切圣器具都带上来。', ref: '列王纪上 8:4' },
      '祭司': { text: '甚至祭司不能站立供职，因为耶和华的荣光充满了殿。', ref: '列王纪上 8:11' },
      '以色列的长老': { text: '以色列长老来到，祭司便抬起约柜。', ref: '列王纪上 8:3' },
      '宝座': { text: '所罗门坐他父亲大卫的位，他的国甚是坚固。', ref: '列王纪上 2:12' },
      '象牙宝座': { text: '王用象牙制造一个宝座，用精金包裹。宝座有六层台阶，座的后背是圆的……<br>六层台阶上有十二个狮子站立……在列国中没有这样做的。', ref: '列王纪上 10:18–20' },
      '示巴女王': { text: '示巴女王一切所要所求的，所罗门王都送给她，另外照自己的厚意馈送她。', ref: '列王纪上 10:13' },
      '骆驼': { text: '跟随她到耶路撒冷的人甚多，又有骆驼驮着香料、宝石，和许多金子。', ref: '列王纪上 10:2' },
      '列王差来的人': { text: '普天下的王都求见所罗门，要听神赐给他智慧的话。', ref: '列王纪上 10:24' },
      '妃嫔': { text: '所罗门有妃七百，都是公主；还有嫔三百。这些妃嫔诱惑他的心。', ref: '列王纪上 11:3' },
      '耶罗波安': { text: '耶罗波安是大有才能的人。所罗门见这少年人殷勤，就派他监管约瑟家的一切工程。', ref: '列王纪上 11:28' },
      '亚希雅': { text: '亚希雅将自己穿的那件新衣撕成十二片，对耶罗波安说：「你可以拿十片……」', ref: '列王纪上 11:30–31' },
      '罗波安': { text: '所罗门与他列祖同睡，葬在他父亲大卫的城里。他儿子罗波安接续他作王。', ref: '列王纪上 11:43' },
      '灯': { text: '使我仆人大卫在我所选择立我名的耶路撒冷城里，在我面前长有灯光。', ref: '列王纪上 11:36' },
      '耶路撒冷': { text: '只是我不将全国夺回，要因我仆人大卫和我所选择的耶路撒冷，还留一支派给你的儿子。', ref: '列王纪上 11:13' },
    },
  });
})(window.GS);
