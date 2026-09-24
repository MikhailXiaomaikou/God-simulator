/* ─────────────────────────────────────────────────────────────
 * book/leviticus.js —— 利未记 · 圣洁（利未记 1 — 27）
 *
 * 西奈山下的旷野：以色列的营安在会幕的四围，云彩停在会幕以上，夜间云中有火。
 * 耶和华从会幕中呼叫摩西（1:1）——燔祭、素祭、平安祭；「在坛上必有常常烧着的火，不可熄灭」（6:13），
 * 一整夜坛上的火与云中的火照着全营；招聚会众到会幕门口，亚伦和他儿子洗濯、穿圣衣、受膏，七天住在会幕门口（8）；
 * 第八天，「有火从耶和华面前出来」，在坛上烧尽燔祭，众民欢呼，俯伏在地（9:24 —— 本卷的签名）；
 * 拿答、亚比户献上凡火——只以光与缺席讲述（10）；「你们要成为圣洁，因为我是圣洁的」（11:44），
 * 生育的妇人带来两只斑鸠（12）、独居营外的人（13）、活鸟放在田野里，他得洁净回营（14—15）；
 * 赎罪日：香的烟云，归与阿撒泻勒的羊担当他们一切的罪孽，被送到无人之地（16—17）；
 * 「要爱人如己」——寄居的外人坐到营火旁（18—20）；「我在以色列人中，却要被尊为圣」——「圣」字成于云中（21—22）；
 * 住棚节的棚与常点的灯（23—24）；禧年的角声，在遍地宣告自由（25）；时雨降下，旷野发青，
 * 「我要在你们中间行走」——荣光走过营中，帐棚一一亮起（26）；十分之一归耶和华为圣，西奈山的命令（27）。
 *
 * 本卷的布景（自画）：西奈山、营中的帐棚、会幕的院子（院帷与门帘）、燔祭坛与坛上的火、洗濯盆、帐幕、
 * 云柱（日间是云，夜间云中有火）、承接圣职的七盏小灯、营火、住棚节的棚、转瞬的光（火、香、活鸟、角声……）。
 * 一切位置都以画面宽度的比例记下，随屏幕缩放不变；一切情节都可瞬间重演。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'leviticus';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时对齐）───────────────────
  W.defineLevel('levGlory', 'exp', 0.55);   // 云柱中的荣光（9:23）
  W.defineLevel('levFire', 'exp', 0.8);     // 坛上的火（6:13）；> 1：自耶和华面前出来的火（9:24）
  W.defineLevel('levHoly', 'exp', 0.35);    // 圣洁的光遍满全营（11:44）
  W.defineLevel('levIncense', 'exp', 0.45); // 香的烟云遮掩施恩座（16:13）
  W.defineLevel('levDays', 'lin', 0.14);    // 承接圣职的七天（8:35）：会幕门前七盏小灯
  W.defineLevel('levBooths', 'lin', 0.12);  // 住棚节的棚（23:42）
  W.defineLevel('levLamp', 'exp', 0.5);     // 精金灯台上的灯常常点着（24:2–4）
  W.defineLevel('levHearth', 'exp', 0.6);   // 营火（19:34）
  W.defineLevel('levTents', 'lin', 0.06);   // 「我要在你们中间行走」：荣光走过之处，帐棚一一亮起（26:12）
  W.defineLevel('levGlean', 'exp', 0.6);    // 田角留下的庄稼（23:22）：留给穷人和寄居的

  // ── 地上的位置（画面宽度的比例）：左 = 东（会幕的门朝东），右 = 西 ──
  // 营的东边（左）止于 CAMP0：再往左是海岸的陡坡——「营外」，长大麻风的人独居之处
  const X = {
    leper: 0.372, tentL1: 0.456, tentL2: 0.486, hearth: 0.5, tentMA: 0.518,
    gate: 0.552, altar: 0.614, laver: 0.662, tabL: 0.702, tabR: 0.802, courtR: 0.838,
    tentR1: 0.876, tentR2: 0.925, tentR3: 0.972,
    sinai: 0.645,
  };
  const CAMP0 = 0.445;
  const PILLAR_X = (X.tabL + X.tabR) / 2 + 0.006;
  const FORE = 0.28;          // 故事里的人站得稍靠前（画面更低、更大），不淹没在会众里，也不贴在白色的院帷上
  const PRV = 0.14;           // 摩西、亚伦与祭司们站的一排（比会众靠前，比献祭的人靠后）
  const NEAR_TENTS = [
    { id: 'tL1', x: X.tentL1, size: 0.82 }, { id: 'tL2', x: X.tentL2, size: 0.76 }, { id: 'tMA', x: X.tentMA, size: 0.95, label: '摩西的帐棚' },
    { id: 'tR1', x: X.tentR1, size: 0.86 }, { id: 'tR2', x: X.tentR2, size: 0.8 }, { id: 'tR3', x: X.tentR3, size: 0.9 },
  ];
  // 中丘上的营：十二支派的帐棚一排一排
  const MID_TENTS = (() => {
    const r = U.mulberry32(3027), out = [];
    for (let i = 0; i < 17; i++) out.push({ x: 0.525 + i * 0.028 + (r() - 0.5) * 0.01, size: 0.7 + r() * 0.35, seed: (r() * 1000) | 0 });
    return out;
  })();
  const NEAR_BOOTHS = [0.452, 0.49, 0.53, 0.853, 0.9, 0.948, 0.99];
  const MID_BOOTHS = [0.54, 0.595, 0.648, 0.71, 0.77, 0.83, 0.888, 0.945];
  const ROBE = {
    moses: [118, 96, 74], aaron: [134, 112, 88], hp: [54, 72, 142], hpAcc: [228, 192, 104], linen: [240, 238, 230], linenAcc: [184, 160, 124],
    nadab: [128, 104, 82], abihu: [120, 100, 86], eleazar: [138, 114, 88], ithamar: [126, 108, 90],
    offerer: [142, 106, 78], woman: [164, 112, 98], mother: [178, 128, 112], leper: [124, 120, 112], stranger: [66, 92, 128],
    sent: [108, 94, 78], levite: [150, 128, 100],
  };

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() { return { garb: 0, sons: 0, healed: 0, stranger: 0, horns: 0, green: 0 }; }

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
  const port = () => W.w < W.h * 0.9;
  const PK = () => (port() ? 1.8 : 1);          // 竖屏的手机上：转瞬的光放大，看得见

  // 人物
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function fig(id) { const c = C(); return c.get ? c.get(id) : null; }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) {
    const c = C();
    if (!has(id)) return;
    if (c.prop) { U.safe('cast.prop', () => c.prop(id, p || null)); return; }
    const f = fig(id); if (f) f.prop = p || null;
  }
  const embrace = (a, b, o) => { const c = C(); if (c.embrace && has(a) && has(b)) U.safe('cast.embrace', () => c.embrace(a, b, o)); else { pose(a, 'stand'); pose(b, 'stand'); } };
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
  function crowdEach(gid, fn) { const c = C(); const g = c.crowds && c.crowds.get && c.crowds.get(gid); if (g) g.members.forEach(fn); }
  function crowdFace(gid, d) { crowdEach(gid, m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function crowdMill(gid, on) { crowdEach(gid, m => { m.mill = on; }); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crowdWalk(gid, a, b, o) { if (hasCrowd(gid)) C().crowdWalk(gid, a, b, o); }
  const CROWDS = ['campL', 'campR'];
  // 众人（会众）：一齐做同一个姿势
  function people(p, dir) { CROWDS.forEach(g => { if (dir) crowdFace(g, dir); crowdPose(g, p); }); }
  const PRIESTS = ['aaron', 'nadab', 'abihu', 'eleazar', 'ithamar'];

  // 亚伦的衣服：0 平常的衣服 · 1 圣衣（蓝袍、以弗得、金牌，8:7–9）· 2 细麻布圣服（赎罪日，16:4）
  function aaronLook() {
    if (S.garb === 1) return { robe: ROBE.hp, accent: ROBE.hpAcc, hair: 'cloth', glow: 0.55 };
    if (S.garb === 2) return { robe: ROBE.linen, accent: ROBE.linenAcc, hair: 'cloth', glow: 0.55 };
    return { robe: ROBE.aaron, accent: null, hair: 'cloth', glow: 0.35 };
  }
  function putAaron(x, o) {
    return add('aaron', Object.assign({ label: '亚伦', sex: 'm', age: 'elder', x, facing: -1, prop: null, beard: true, v: PRV }, aaronLook(), o || {}));
  }
  function dressAaron(g) { S.garb = g; if (has('aaron')) add('aaron', aaronLook()); }
  function putMoses(x, o) {
    return add('moses', Object.assign({ label: '摩西', sex: 'm', age: 'elder', x, facing: 1, robe: ROBE.moses, glow: 0.5, prop: 'staff', v: PRV }, o || {}));
  }
  // 细麻布的内袍配上深一些的腰带与裹头巾，免得白衣隐没在白色的院帷前
  function sonLook(id) { return S.sons ? { robe: ROBE.linen, hair: 'cloth', accent: ROBE.linenAcc } : { robe: ROBE[id], hair: 'short', accent: null }; }
  function dressSons(on) { S.sons = on ? 1 : 0; ['nadab', 'abihu', 'eleazar', 'ithamar'].forEach(id => { if (has(id)) add(id, sonLook(id)); }); }

  // 旁白（情节里补充的经文；瞬间重演时不念）
  function say(b, lines) { if (!b.instant && GS.ui) GS.ui.narrate(lines, { replace: false }); }
  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物头顶（像素）：画过一帧之后用其真实的位置
  function headOf(id, k) {
    const f = fig(id);
    if (!f) return null;
    const l = f.layer == null ? 2 : f.layer;
    if (f._vis && f._h) return [f._x, f._y - f._h * (k == null ? 0.9 : k)];
    return [f.nx * W.w, gY(l, f.nx) - 44 * LS(l) * (k == null ? 0.9 : k)];
  }
  function memberHead(m, k) {
    if (m._vis && m._h) return [m._x, m._y - m._h * (k == null ? 0.9 : k)];
    const l = m.layer == null ? 2 : m.layer;
    return [m.nx * W.w, gY(l, m.nx) - 40 * LS(l) * (k == null ? 0.9 : k)];
  }
  // 名字的位置：在画面之内（竖屏时经文在顶上，名字稍低一些，不与经文相叠）
  function nameAt(xf, cy, size) {
    if (port()) cy = Math.max(cy, W.h * 0.4);
    return [clamp(xf * W.w, size * 0.7 + 8, W.w - size * 0.7 - 8), cy];
  }
  // 地上的走兽绕开营与会幕
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

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
  function sprites() {
    if (SP) return SP;
    SP = {
      warm: radial([255, 172, 92], 1), gold: radial([255, 228, 166], 1), white: radial([240, 244, 255], 1),
      ember: radial([255, 104, 40], 1), smoke: radial([200, 196, 190], 0.8, 0.55), soot: radial([60, 54, 60], 0.8, 0.55),
      puff: radial([250, 248, 244], 1, 0.6), puffD: radial([120, 124, 138], 1, 0.6), fire: radial([255, 150, 60], 1, 0.4),
      violet: radial([120, 104, 140], 1, 0.5), fireSoft: radial([255, 156, 70], 1, 0.62), incense: radial([240, 212, 150], 0.9, 0.55),
    };
    const b = cnv(64, 256), g = b.getContext('2d');
    const hz = g.createLinearGradient(0, 0, 64, 0);
    hz.addColorStop(0, 'rgba(255,244,214,0)'); hz.addColorStop(0.5, 'rgba(255,247,226,1)'); hz.addColorStop(1, 'rgba(255,244,214,0)');
    g.fillStyle = hz; g.fillRect(0, 0, 64, 256);
    g.globalCompositeOperation = 'destination-in';
    const vt = g.createLinearGradient(0, 0, 0, 256);
    vt.addColorStop(0, 'rgba(0,0,0,0)'); vt.addColorStop(0.25, 'rgba(0,0,0,0.9)'); vt.addColorStop(0.8, 'rgba(0,0,0,0.9)'); vt.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = vt; g.fillRect(0, 0, 64, 256);
    SP.column = b;
    // 柔和的光环（角声、呼叫的声音）：中空，一圈宽宽的光带
    const rc = cnv(128, 128), rg = rc.getContext('2d'), rr = rg.createRadialGradient(64, 64, 0, 64, 64, 64);
    rr.addColorStop(0, 'rgba(255,230,176,0)'); rr.addColorStop(0.62, 'rgba(255,230,176,0)'); rr.addColorStop(0.84, 'rgba(255,236,190,1)');
    rr.addColorStop(0.93, 'rgba(255,230,176,0.35)'); rr.addColorStop(1, 'rgba(255,230,176,0)');
    rg.fillStyle = rr; rg.fillRect(0, 0, 128, 128);
    SP.ring = rc;
    // 贴着地面的一道光（竖直方向：上淡、近地最亮、地下很快淡去）
    const bd = cnv(4, 64), bg = bd.getContext('2d'), bv = bg.createLinearGradient(0, 0, 0, 64);
    bv.addColorStop(0, 'rgba(255,240,206,0)'); bv.addColorStop(0.45, 'rgba(255,238,200,0.22)'); bv.addColorStop(0.7, 'rgba(255,242,212,0.62)');
    bv.addColorStop(0.82, 'rgba(255,248,226,0.95)'); bv.addColorStop(0.9, 'rgba(255,244,216,0.5)'); bv.addColorStop(1, 'rgba(255,240,206,0)');
    bg.fillStyle = bv; bg.fillRect(0, 0, 4, 64);
    SP.band = bd;
    return SP;
  }
  // 扁的精灵（椭圆）
  function sprE(ctx, img, x, y, rx, ry, a) {
    if (a < 0.004 || rx < 0.5 || ry < 0.3) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - rx, y - ry, rx * 2, ry * 2);
  }
  function spr(ctx, img, x, y, r, a) {
    if (a < 0.004 || r < 0.5) return;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  火与烟
  // ════════════════════════════════════════════════════════════
  function flame(ctx, x, y, h, k, seed) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    spr(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    const T4 = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.3, 0.68, 'rgb(255,160,64)', 0.75], [0.28, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
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
  function smoke(ctx, x, y, k, H, w, seed, img, rate, alpha) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 12, day = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * (rate || 0.085) + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.3) * ph * ph * H * 0.4 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.6);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (alpha || 0.4) * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(img || SP.smoke, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  西奈山（远山之上）：花岗岩的群峰
  // ════════════════════════════════════════════════════════════
  let SINAI = null;
  function sinaiModel() {
    const r = U.mulberry32(1446), N = 60, pts = [];
    const bump = (u, c, w, h, p) => h * Math.pow(Math.max(0, 1 - Math.abs(u - c) / w), p);
    for (let i = 0; i <= N; i++) {
      const u = -1 + 2 * i / N;
      let h = Math.max(bump(u, -0.06, 0.94, 1, 1.35), bump(u, 0.42, 0.52, 0.74, 1.3), bump(u, -0.6, 0.42, 0.5, 1.15), bump(u, 0.82, 0.3, 0.3, 1.1));
      if (Math.abs(u) < 0.96) h *= 1 + (r() - 0.5) * 0.1;
      pts.push([u, h]);
    }
    pts[0][1] = 0; pts[N][1] = 0;
    const gul = [];
    for (let i = 0; i < 12; i++) { const u = -0.75 + r() * 1.5; gul.push([u, 0.1 + r() * 0.2, (r() - 0.5) * 0.18, 0.25 + r() * 0.35]); }
    return { pts, gul };
  }
  function sinaiDims() {
    const H = Math.min(W.h * 0.235, W.w * 0.34), HW = H * (port() ? 1.3 : 1.62);
    return { H, HW, cx: X.sinai * W.w };
  }
  function sinaiTop(u) {        // 山的轮廓在 u 处的高度（像素 y）
    const m = SINAI || (SINAI = sinaiModel()), d = sinaiDims();
    const f = clamp((u + 1) / 2, 0, 1) * (m.pts.length - 1), i = Math.min(m.pts.length - 2, f | 0), r = f - i;
    const h = lerp(m.pts[i][1], m.pts[i + 1][1], r);
    const x = d.cx + u * d.HW;
    return gY(0, x / W.w) - h * d.H;
  }
  function drawSinai(ctx) {
    const m = SINAI || (SINAI = sinaiModel()), d = sinaiDims(), dep = 0.52;
    const n = m.pts.length;
    ctx.fillStyle = W.shadeCSS([122, 90, 76], dep);
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const u = m.pts[i][0], x = d.cx + u * d.HW;
      const y = gY(0, x / W.w) - m.pts[i][1] * d.H;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    for (let i = n - 1; i >= 0; i--) { const x = d.cx + m.pts[i][0] * d.HW; ctx.lineTo(x, gY(0, x / W.w) + 3); }
    ctx.closePath(); ctx.fill();
    // 背光的一面
    const lx = litX(), sideR = lx < d.cx;     // 光在左 → 右面背光
    ctx.fillStyle = W.shadeCSS([60, 44, 42], dep, 0.35 + 0.2 * W.daylight);
    ctx.beginPath();
    let first = true;
    for (let i = 0; i < n; i++) {
      const u = m.pts[i][0];
      if (sideR ? u < -0.06 : u > -0.06) continue;
      const x = d.cx + u * d.HW, y = gY(0, x / W.w) - m.pts[i][1] * d.H;
      if (first) { ctx.moveTo(d.cx - 0.06 * d.HW, sinaiTop(-0.06)); first = false; }
      ctx.lineTo(x, y);
    }
    ctx.lineTo(d.cx + (sideR ? 1 : -1) * d.HW, gY(0, (d.cx + (sideR ? 1 : -1) * d.HW) / W.w) + 3);
    ctx.lineTo(d.cx + (sideR ? 0.2 : -0.32) * d.HW, gY(0, d.cx / W.w) + 3);
    ctx.closePath(); ctx.fill();
    // 沟壑
    ctx.strokeStyle = W.shadeCSS([56, 40, 38], dep, 0.45);
    ctx.lineWidth = Math.max(0.8, 1.4 * W.unit); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const g of m.gul) {
      const x = d.cx + g[0] * d.HW, top = sinaiTop(g[0]), base = gY(0, x / W.w);
      const y0 = lerp(top, base, g[1]), y1 = lerp(top, base, Math.min(0.95, g[1] + g[3]));
      ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + g[2] * d.HW * 0.3, (y0 + y1) / 2, x + g[2] * d.HW, y1);
    }
    ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = W.shadeCSS([255, 214, 170], dep, 0.35 * (0.3 + 0.7 * W.daylight), 0.25);
    ctx.lineWidth = Math.max(0.8, 1.3 * W.unit);
    ctx.beginPath();
    first = true;
    for (let i = 0; i < n; i++) {
      const u = m.pts[i][0];
      if (sideR ? u > 0.1 : u < -0.2) { continue; }
      const x = d.cx + u * d.HW, y = gY(0, x / W.w) - m.pts[i][1] * d.H;
      if (m.pts[i][1] < 0.12) continue;
      if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  帐棚（山羊毛织的黑帐棚）
  // ════════════════════════════════════════════════════════════
  const TENT = [[-1, 0], [-0.9, -0.46], [-0.64, -0.8], [-0.34, -0.66], [0, -1], [0.34, -0.68], [0.64, -0.82], [0.9, -0.48], [1, 0]];
  // lit：荣光走过之后的金光（0..1）
  function drawTent(ctx, xf, l, size, seed, lit) {
    const s = LS(l) * size, x = xf * W.w, y = gY(l, xf) + 2 * s, hw = 30 * s, h = 24 * s;
    if (l === 2) {
      ctx.strokeStyle = css([96, 82, 64], l, 0.75); ctx.lineWidth = Math.max(0.5, 0.7 * s);
      ctx.beginPath();
      ctx.moveTo(x - 0.64 * hw, y - 0.8 * h); ctx.lineTo(x - 1.35 * hw, y);
      ctx.moveTo(x + 0.64 * hw, y - 0.82 * h); ctx.lineTo(x + 1.35 * hw, y);
      ctx.stroke();
    }
    ctx.fillStyle = css([56, 45, 40], l);
    ctx.beginPath();
    for (let i = 0; i < TENT.length; i++) { const q = TENT[i], X1 = x + q[0] * hw, Y1 = y + q[1] * h; if (i) ctx.lineTo(X1, Y1); else ctx.moveTo(X1, Y1); }
    ctx.closePath(); ctx.fill();
    if (l === 2) {
      ctx.strokeStyle = css([86, 70, 58], l, 0.55); ctx.lineWidth = Math.max(0.5, 0.9 * s);
      ctx.beginPath();
      for (const f of [-0.62, -0.3, 0.32, 0.62]) { ctx.moveTo(x + f * hw, y); ctx.lineTo(x + f * hw * 1.02, y - (0.72 - Math.abs(f) * 0.05) * h); }
      ctx.stroke();
    }
    const dw = 0.17 * hw, dh = 0.6 * h;
    ctx.fillStyle = css([20, 15, 13], l);
    ctx.fillRect(x - dw, y - dh, dw * 2, dh);
    // 夜里门口一盏灯；荣光经过之后透出金光
    const holy = W.lv.levHoly;
    const lamp = clamp(nightK() * 1.1, 0, 1) * 0.8 * (0.55 + 0.45 * U.fract(seed * 0.618 + 0.3)) + lit * 1.5;
    // 圣洁的光遍满全营时，每一个帐棚的门口都透出淡淡的、呼吸一样的光
    const breathe = holy * (0.34 + 0.16 * Math.sin(W.t * 1.2 + seed * 0.37));
    if (lamp > 0.02 || breathe > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7 + seed);
      if (lamp > 0.02) {
        ctx.globalAlpha = Math.min(1, lamp) * fl * 0.6;
        ctx.fillStyle = lit > 0.3 ? 'rgb(255,216,146)' : 'rgb(255,160,84)';
        ctx.fillRect(x - dw, y - dh, dw * 2, dh);
        const g = hw * (1.8 + lit * 2.4);
        ctx.globalAlpha = Math.min(1, lamp) * fl * (0.45 + 0.3 * lit);
        ctx.drawImage(lit > 0.3 ? SP.gold : SP.warm, x - g / 2, y - dh * 0.5 - g / 2, g, g);
      }
      if (breathe > 0.02) {
        ctx.globalAlpha = Math.min(1, breathe);
        ctx.fillStyle = 'rgb(255,240,214)';
        ctx.fillRect(x - dw, y - dh, dw * 2, dh);
        const g = hw * 1.6;
        ctx.globalAlpha = Math.min(1, breathe * 0.8);
        ctx.drawImage(SP.gold, x - g / 2, y - dh * 0.45 - g / 2, g, g);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边（圣洁的光遍满全营时，边上多一道白金）
    ctx.globalAlpha = 0.45 + 0.4 * holy;
    const d = litX() >= x ? 1 : -1;
    ctx.strokeStyle = holy > 0.05 ? css([255, 240, 206], l, 1, 0.35 + 0.3 * holy) : css([226, 196, 160], l, 1, 0.3);
    ctx.lineWidth = Math.max(0.6, 1.1 * s);
    ctx.beginPath();
    const k0 = d > 0 ? 4 : 1, k1 = d > 0 ? 7 : 4;
    for (let i = k0; i <= k1; i++) { const q = TENT[i]; if (i === k0) ctx.moveTo(x + q[0] * hw, y + q[1] * h); else ctx.lineTo(x + q[0] * hw, y + q[1] * h); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 住棚节的棚：四根杆子，棕树的枝子、茂密树的枝条、河旁的柳枝搭成的顶（23:40）──
  function drawBooth(ctx, xf, l, k, seed) {
    if (k <= 0.01) return;
    const s = LS(l), x = xf * W.w, y = gY(l, xf) + 1.5 * s, w = 17 * s, h = 27 * s;
    const pk = clamp(k * 2, 0, 1), rk = clamp(k * 2 - 1, 0, 1);
    ctx.strokeStyle = css([112, 86, 60], l); ctx.lineWidth = Math.max(0.6, 1.3 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (const f of [-1, -0.35, 0.35, 1]) { ctx.moveTo(x + f * w, y); ctx.lineTo(x + f * w * 0.96, y - h * pk); }
    ctx.stroke();
    if (rk <= 0.01) return;
    const r = U.mulberry32(seed * 31 + 7);
    const top = y - h;
    // 顶：一层厚厚的枝叶
    ctx.globalAlpha = rk;
    ctx.fillStyle = css([64, 98, 50], l);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) { const cx = x + (i / 8 - 0.5) * 2.3 * w, cy = top - 1.5 * s + (r() - 0.5) * 2 * s, rr = (4 + r() * 3) * s; ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 0.62, 0, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = css([104, 140, 72], l, 0.85, 0.05);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) { const cx = x + (i / 5 - 0.5) * 2 * w + (r() - 0.5) * 3 * s, cy = top - 3.2 * s, rr = (2.6 + r() * 2) * s; ctx.moveTo(cx + rr, cy); ctx.ellipse(cx, cy, rr, rr * 0.55, 0, 0, TAU); }
    ctx.fill();
    // 垂下的柳枝与棕叶
    ctx.strokeStyle = css([86, 124, 62], l, 0.9); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const fx0 = x + (r() - 0.5) * 2.2 * w, len = (6 + r() * 9) * s * rk, sw = Math.sin(W.t * 1.3 + i + seed) * 1.2 * s;
      ctx.moveTo(fx0, top); ctx.quadraticCurveTo(fx0 + sw, top + len * 0.5, fx0 + sw * 1.6, top + len);
    }
    ctx.stroke();
    // 棚里的灯
    const lamp = nightK() * rk;
    if (lamp > 0.02) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const g = 26 * s, fl = 0.85 + 0.15 * Math.sin(W.t * 6.3 + seed);
      spr(ctx, SP.warm, x, y - h * 0.45, g, lamp * 0.7 * fl);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  会幕：院子、燔祭坛、洗濯盆、帐幕
  // ════════════════════════════════════════════════════════════
  const TAB_H = 56;
  function tabGeom() {
    const s = LS(2), x0 = X.tabL * W.w, x1 = X.tabR * W.w;
    const g0 = gY(2, X.tabL) + 2 * s, g1 = gY(2, X.tabR) + 2 * s;
    const H = TAB_H * s;
    return { s, x0, x1, g0, g1, top: Math.min(g0, g1) - H, H, dw: (x1 - x0) * 0.17 };
  }
  // 院帷：细麻布的帷子挂在一根根柱子上（后面一道，两头各一道斜着伸向后方；门在东头——左边）
  function drawCourt(ctx) {
    const s = LS(2), x0 = X.gate * W.w, x1 = X.courtR * W.w, h = 30 * s, lift = 6 * s, back = 9 * s;
    const yb = x => gY(2, x / W.w) - lift;
    // 院帷的细麻：暖一些、暗一些（穿白细麻衣的祭司站在前面也看得清），下半截在影子里
    const linen = css([214, 204, 182], 2), fold = css([150, 138, 116], 2, 0.34), post = css([120, 96, 66], 2), cap = css([214, 214, 220], 2, 1, 0.1);
    const shadow = css([92, 80, 64], 2, 0.42);
    // 后面一道
    const N = 26;
    const backPath = () => {
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const x = lerp(x0 + back, x1 - back, i / N); const y = yb(x) - h; if (i) ctx.lineTo(x, y + (i % 2 ? 1.2 * s : 0)); else ctx.moveTo(x, y); }
      for (let i = N; i >= 0; i--) { const x = lerp(x0 + back, x1 - back, i / N); ctx.lineTo(x, yb(x)); }
      ctx.closePath();
    };
    ctx.fillStyle = linen;
    backPath(); ctx.fill();
    ctx.fillStyle = shadow;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) { const x = lerp(x0 + back, x1 - back, i / N); const y = yb(x) - h * 0.42; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
    for (let i = N; i >= 0; i--) { const x = lerp(x0 + back, x1 - back, i / N); ctx.lineTo(x, yb(x)); }
    ctx.closePath(); ctx.fill();
    // 圣洁的光遍满全营（11:44）：院帷透出白金的光
    const holy = W.lv.levHoly;
    if (holy > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,232,186)';
      ctx.globalAlpha = holy * (0.2 + 0.05 * Math.sin(W.t * 1.1));
      backPath(); ctx.fill();
      ctx.strokeStyle = 'rgb(255,242,210)'; ctx.lineWidth = Math.max(1, 1.6 * s); ctx.globalAlpha = holy * 0.55;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) { const x = lerp(x0 + back, x1 - back, i / N); const y = yb(x) - h; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = fold; ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 0; i < N * 2; i++) { const x = lerp(x0 + back, x1 - back, (i + 0.5) / (N * 2)); ctx.moveTo(x, yb(x) - h + 2 * s); ctx.lineTo(x, yb(x) - 1 * s); }
    ctx.stroke();
    // 柱子与银帽
    ctx.fillStyle = post;
    const pw = Math.max(1, 1.6 * s);
    for (let i = 0; i <= 13; i++) { const x = lerp(x0 + back, x1 - back, i / 13); ctx.fillRect(x - pw / 2, yb(x) - h - 2.5 * s, pw, h + 2.5 * s); }
    ctx.fillStyle = cap;
    for (let i = 0; i <= 13; i++) { const x = lerp(x0 + back, x1 - back, i / 13); ctx.fillRect(x - pw, yb(x) - h - 3.6 * s, pw * 2, 1.6 * s); }
    // 两头：斜着伸向后方的帷子（东头是门帘：蓝色、紫色、朱红色线和捻的细麻）
    for (const end of [0, 1]) {
      const xa = end ? x1 : x0, xb = end ? x1 - back : x0 + back;
      const ya = gY(2, xa / W.w) + 1 * s, ybk = yb(xb);
      if (!end) {
        const cols = [[58, 78, 156], [108, 60, 126], [184, 52, 56], [236, 230, 216]];
        const K = 8;
        for (let j = 0; j < K; j++) {
          const t0 = j / K, t1 = (j + 1) / K;
          ctx.fillStyle = css(cols[j % 4], 2, 1, j % 4 === 3 ? 0 : 0.08);
          ctx.beginPath();
          ctx.moveTo(lerp(xa, xb, t0), lerp(ya, ybk, t0) - h * lerp(1.1, 1, t0));
          ctx.lineTo(lerp(xa, xb, t1), lerp(ya, ybk, t1) - h * lerp(1.1, 1, t1));
          ctx.lineTo(lerp(xa, xb, t1), lerp(ya, ybk, t1));
          ctx.lineTo(lerp(xa, xb, t0), lerp(ya, ybk, t0));
          ctx.closePath(); ctx.fill();
        }
      } else {
        ctx.fillStyle = linen;
        ctx.beginPath();
        ctx.moveTo(xa, ya - h * 1.1); ctx.lineTo(xb, ybk - h); ctx.lineTo(xb, ybk); ctx.lineTo(xa, ya);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = post;
      ctx.fillRect(xa - pw / 2, ya - h * 1.1 - 2.5 * s, pw, h * 1.1 + 2.5 * s);
      ctx.fillStyle = cap;
      ctx.fillRect(xa - pw, ya - h * 1.1 - 3.6 * s, pw * 2, 1.6 * s);
    }
  }
  function drawTabernacle(ctx) {
    const G = tabGeom(), s = G.s, x0 = G.x0, x1 = G.x1, top = G.top, H = G.H;
    const baseAt = x => lerp(G.g0, G.g1, (x - x0) / (x1 - x0));
    // 包金的板
    const boardTop = top + 0.3 * H;
    ctx.fillStyle = css([188, 148, 70], 2, 1, 0.05);
    ctx.beginPath();
    ctx.moveTo(x0, boardTop); ctx.lineTo(x1, boardTop); ctx.lineTo(x1, G.g1); ctx.lineTo(x0, G.g0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([120, 88, 40], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let x = x0 + G.dw + 5 * s; x < x1 - 1; x += 5.2 * s) { ctx.moveTo(x, boardTop); ctx.lineTo(x, baseAt(x)); }
    ctx.stroke();
    // 银座
    ctx.fillStyle = css([200, 202, 210], 2, 1, 0.08);
    for (let x = x0 + G.dw + 2 * s; x < x1 - 2 * s; x += 5.2 * s) ctx.fillRect(x, baseAt(x) - 2.6 * s, 4.2 * s, 2.6 * s);
    // 门帘（东头）：蓝色、紫色、朱红色线，五根包金的柱子
    const cols = [[58, 78, 156], [108, 60, 126], [184, 52, 56], [232, 226, 212]];
    const dx0 = x0, dx1 = x0 + G.dw, K = 8;
    for (let j = 0; j < K; j++) {
      const a = lerp(dx0, dx1, j / K), b = lerp(dx0, dx1, (j + 1) / K);
      ctx.fillStyle = css(cols[j % 4], 2, 1, 0.06);
      ctx.beginPath(); ctx.moveTo(a, top + 0.22 * H); ctx.lineTo(b, top + 0.22 * H); ctx.lineTo(b, baseAt(b)); ctx.lineTo(a, baseAt(a)); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = css([226, 184, 88], 2, 1, 0.15);
    for (let j = 0; j < 5; j++) { const x = lerp(dx0 + 1 * s, dx1 - 1 * s, j / 4); ctx.fillRect(x - 0.8 * s, top + 0.2 * H, 1.6 * s, baseAt(x) - top - 0.2 * H); }
    // 灯台的光从门帘透出（24:2–4）；荣光大时整座帐幕透亮
    const lampK = W.lv.levLamp * (0.35 + 0.65 * nightK()) + 0.5 * smoothstep(0.5, 1, W.lv.levGlory);
    if (lampK > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, lampK) * 0.55;
      ctx.fillStyle = 'rgb(255,206,120)';
      ctx.fillRect(dx0, top + 0.22 * H, dx1 - dx0, baseAt(dx1) - top - 0.22 * H);
      // 七盏灯
      const lk = W.lv.levLamp;
      if (lk > 0.02) {
        const cy = top + 0.55 * H, cx = (dx0 + dx1) / 2;
        for (let j = 0; j < 7; j++) {
          const ox = (j - 3) * (dx1 - dx0) * 0.12, oy = Math.abs(j - 3) * -0.3 * s;
          spr(ctx, SP.gold, cx + ox, cy + oy, 3.2 * s, lk * (0.8 + 0.2 * Math.sin(W.t * 7 + j)));
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 盖在上面的海狗皮（深色），两头垂下
    const cov = css([64, 55, 50], 2), droop = 0.75 * H, sag = 2.2 * s;
    ctx.fillStyle = cov;
    ctx.beginPath();
    ctx.moveTo(x0 - 1.5 * s, top + droop * 0.36);
    ctx.quadraticCurveTo(x0 - 1 * s, top - 1 * s, x0 + 4 * s, top);
    ctx.quadraticCurveTo((x0 + x1) / 2, top - sag, x1 - 4 * s, top);
    ctx.quadraticCurveTo(x1 + 1 * s, top - 1 * s, x1 + 1.5 * s, top + droop);
    // 下缘：一道一道垂下的幅
    const n = Math.max(6, Math.round((x1 - x0) / (7 * s)));
    for (let i = n; i >= 0; i--) {
      const x = lerp(x0 + G.dw, x1, i / n), y = top + 0.62 * H + (i % 2 ? 2 * s : 0) + (i === n ? droop - 0.62 * H : 0);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(x0 + G.dw, top + 0.24 * H);
    ctx.lineTo(x0 - 1.5 * s, top + 0.24 * H);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([96, 84, 76], 2, 0.5); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath();
    for (let i = 1; i < n; i++) { const x = lerp(x0 + G.dw, x1, i / n); ctx.moveTo(x, top + 1 * s); ctx.lineTo(x, top + 0.6 * H); }
    ctx.stroke();
    // 迎光的边
    const d = litX() >= (x0 + x1) / 2 ? 1 : -1;
    ctx.strokeStyle = css([236, 214, 180], 2, 0.55 * (0.3 + 0.7 * W.daylight) + 0.3 * W.lv.levGlory, 0.3);
    ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath();
    if (d > 0) { ctx.moveTo((x0 + x1) / 2, top - sag * 0.95); ctx.quadraticCurveTo(x1 - 8 * s, top - sag * 0.4, x1 - 4 * s, top); ctx.quadraticCurveTo(x1 + 1 * s, top - 1 * s, x1 + 1.5 * s, top + droop * 0.5); }
    else { ctx.moveTo((x0 + x1) / 2, top - sag * 0.95); ctx.quadraticCurveTo(x0 + 8 * s, top - sag * 0.4, x0 + 4 * s, top); ctx.quadraticCurveTo(x0 - 1 * s, top - 1 * s, x0 - 1.5 * s, top + droop * 0.3); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function altarGeom() {
    const s = LS(2), x = X.altar * W.w, y = gY(2, X.altar) + 1.5 * s, w = 17 * s, h = 23 * s;
    return { s, x, y, w, h, top: y - h };
  }
  function drawAltar(ctx) {
    const A = altarGeom(), s = A.s, x = A.x, y = A.y, w = A.w, h = A.h, top = A.top;
    const bronze = [170, 112, 60];
    ctx.fillStyle = css(bronze, 2);
    ctx.fillRect(x - w, top, w * 2, h);
    // 铜网
    ctx.fillStyle = css([70, 48, 32], 2);
    ctx.fillRect(x - w, top + h * 0.38, w * 2, h * 0.24);
    ctx.strokeStyle = css([176, 122, 70], 2, 0.6); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let xx = x - w + 3 * s; xx < x + w; xx += 3.4 * s) { ctx.moveTo(xx, top + h * 0.38); ctx.lineTo(xx + 2 * s, top + h * 0.62); ctx.moveTo(xx + 2 * s, top + h * 0.38); ctx.lineTo(xx, top + h * 0.62); }
    ctx.stroke();
    // 四角的角
    ctx.fillStyle = css(bronze, 2, 1, 0.08);
    for (const sx of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + sx * w, top + 1 * s); ctx.lineTo(x + sx * (w - 5 * s), top + 1 * s);
      ctx.quadraticCurveTo(x + sx * (w - 1.2 * s), top - 1.5 * s, x + sx * (w + 0.8 * s), top - 5.5 * s);
      ctx.closePath(); ctx.fill();
    }
    // 迎光
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css([255, 214, 160], 2, 0.3 * (0.3 + 0.7 * W.daylight) + 0.25 * clamp(W.lv.levFire, 0, 1), 0.2);
    ctx.fillRect(d > 0 ? x + w - 2.4 * s : x - w, top, 2.4 * s, h);
    // 坛上的柴与火
    ctx.strokeStyle = css([80, 56, 36], 2); ctx.lineWidth = Math.max(1, 1.8 * s); ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < 3; i++) { ctx.moveTo(x - w * 0.75 + i * 2 * s, top - i * 1.4 * s); ctx.lineTo(x + w * 0.7 - i * 1.6 * s, top - i * 1.4 * s - 0.6 * s); }
    ctx.stroke();
    const f = W.lv.levFire;
    if (f > 0.01) {
      const k = clamp(f, 0, 1), big = Math.max(0, f - 1);
      smoke(ctx, x, top - 10 * s, k, 120 * s + W.h * 0.1 + big * W.h * 0.2, 6 * s * (1 + big), 3, null, 0.07, 0.34);
      flame(ctx, x, top + 0.5 * s, 12 * s * (0.5 + 0.5 * k) + 48 * s * big, k, 5);
      if (big > 0.02) flame(ctx, x - 7 * s, top + 0.5 * s, 34 * s * big, Math.min(1, big * 1.5), 9);
      if (big > 0.02) flame(ctx, x + 8 * s, top + 0.5 * s, 28 * s * big, Math.min(1, big * 1.5), 13);
    }
  }
  function drawLaver(ctx) {
    const s = LS(2), x = X.laver * W.w, y = gY(2, X.laver) + 1.5 * s;
    const bronze = css([176, 122, 66], 2), dark = css([96, 64, 38], 2);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(x - 5 * s, y); ctx.lineTo(x - 2 * s, y - 8 * s); ctx.lineTo(x + 2 * s, y - 8 * s); ctx.lineTo(x + 5 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = bronze;
    ctx.beginPath(); ctx.moveTo(x - 9 * s, y - 13.5 * s); ctx.quadraticCurveTo(x, y - 3 * s, x + 9 * s, y - 13.5 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([150, 190, 214], 2, 0.8, 0.2);
    ctx.beginPath(); ctx.ellipse(x, y - 13.5 * s, 8.5 * s, 1.6 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([255, 240, 210], 2, 0.4 * (0.3 + 0.7 * W.daylight), 0.2);
    ctx.fillRect(x - 5 * s, y - 14 * s, 4 * s, 0.8 * s);
  }
  // 承接圣职的七天（8:35）：会幕门前七盏小灯，一天亮一盏
  function drawDays(ctx) {
    const k = W.lv.levDays;
    if (k < 0.005) return;
    SP || sprites();
    const G = tabGeom(), s = G.s, cx = G.x0 - 7 * s, cy = G.g0 - 36 * s;
    ctx.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 7; j++) {
      const on = clamp(k * 7 - j, 0, 1);
      if (on <= 0) continue;
      const a = (j - 3) * 0.3, x = cx + Math.sin(a) * 14 * s, y = cy + (1 - Math.cos(a)) * 14 * s;
      const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + j * 1.7);
      spr(ctx, SP.warm, x, y, 7 * s, on * 0.55 * fl);
      spr(ctx, SP.gold, x, y, 2.6 * s, on * fl);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 营火（19:34：寄居的外人坐到火旁）
  // 营火与坐在火旁的人同在稍靠前的一排（cast 的 v）
  function hearthY() { const g = gY(2, X.hearth); return g + FORE * Math.max(0, W.h - g) * 0.8; }
  function drawHearth(ctx) {
    const k = W.lv.levHearth;
    if (k < 0.01) return;
    const s = LS(2), x = X.hearth * W.w, y = hearthY();
    ctx.fillStyle = css([90, 80, 72], 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const cx = x + (i - 2) * 2.6 * s; ctx.moveTo(cx + 1.8 * s, y); ctx.ellipse(cx, y, 1.8 * s, 1.1 * s, 0, 0, TAU); }
    ctx.fill();
    flame(ctx, x, y - 0.6 * s, 9 * s, k, 21);
  }

  // 田角留下不割的庄稼（23:22）：一小片金黄的麦穗，在灯光里微微发亮
  const GLEAN_X = 0.474;
  function drawGlean(ctx) {
    const k = W.lv.levGlean;
    if (k < 0.01) return;
    const s = LS(2), x0 = GLEAN_X * W.w, g = gY(2, GLEAN_X), y = g + FORE * 0.55 * Math.max(0, W.h - g) * 0.8;
    const r = U.mulberry32(2322);
    ctx.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const x = x0 + (i - 7.5) * 1.9 * s + (r() - 0.5) * 1.4 * s, hh = (9 + r() * 6) * s * k, sw = Math.sin(W.t * 1.4 + i * 0.7) * 1.2 * s;
      ctx.strokeStyle = css([196, 158, 78], 2, 0.95, 0.12); ctx.lineWidth = Math.max(0.6, 0.8 * s);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.3, y - hh * 0.6, x + sw, y - hh); ctx.stroke();
      ctx.fillStyle = css([232, 196, 104], 2, 1, 0.2);
      ctx.beginPath(); ctx.ellipse(x + sw, y - hh - 1.8 * s, 0.9 * s, 2.4 * s, sw * 0.1, 0, TAU); ctx.fill();
    }
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    sprE(ctx, SP.gold, x0, y - 8 * s, 30 * s, 14 * s, k * (0.2 + 0.25 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 云柱：日间是云，夜间云中有火（出 40:38）；荣光大时满是金光 ──
  // 云团的精灵图按此刻的天光着色（颜色变了才重画）
  const CSP = { lit: null, shade: null, key: '' };
  function cloudSprite(rgb) {
    const c = cnv(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    const [r, gg, b] = rgb.map(v => Math.round(clamp(v, 0, 255)));
    gr.addColorStop(0, U.rgba(r, gg, b, 1)); gr.addColorStop(0.5, U.rgba(r, gg, b, 0.9));
    gr.addColorStop(0.78, U.rgba(r, gg, b, 0.42)); gr.addColorStop(1, U.rgba(r, gg, b, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return c;
  }
  function cloudSprites() {
    const lit = W.shade([252, 250, 246], 0.12, 0.32), sh = W.shade([168, 170, 186], 0.12, 0.12);
    const q = v => Math.round(v / 6);
    const key = lit.map(q).join(',') + '|' + sh.map(q).join(',');
    if (key !== CSP.key || !CSP.lit) { CSP.key = key; CSP.lit = cloudSprite(lit); CSP.shade = cloudSprite(sh); }
    return CSP;
  }
  const PUFF = (() => { const r = U.mulberry32(4040), out = []; for (let i = 0; i < 64; i++) out.push([r(), r(), r(), r()]); return out; })();
  function pillarBase() { const G = tabGeom(); return G.top + 2 * G.s; }
  // 云柱画在两张离屏的画布上：云（常规叠加）每十分之一秒重画一次——云走得很慢；
  // 火与荣光（加亮叠加）夜里每秒三十次，火的闪动才不会一顿一顿
  const PC = { a: null, b: null, ta: -99, tb: -99, w: 0, h: 0, glow: false };
  function pillarGeom() {
    const G = tabGeom(), L = G.x1 - G.x0, cx = PILLAR_X * W.w, base = pillarBase();
    const pt = port(), top = pt ? W.h * 0.3 : -W.h * 0.12;
    const w0 = Math.max(L * 0.5, W.h * 0.042);
    return { G, L, cx, base, top, Hh: base - top, w0, pt };
  }
  function drawPillar(ctx) {
    SP || sprites();
    const P = pillarGeom();
    const bx = P.cx - P.w0 * 2.6, bw = P.w0 * 5.2, by = Math.max(-20, P.top - P.w0 * 1.6), bh = P.base + P.w0 * 2.5 - by;
    const sc = W.w < 600 ? 0.6 : 0.5;
    const cw = Math.max(8, Math.ceil(bw * sc)), ch = Math.max(8, Math.ceil(bh * sc));
    if (!PC.a || PC.a.width !== cw || PC.a.height !== ch) { PC.a = cnv(cw, ch); PC.b = cnv(cw, ch); PC.ta = PC.tb = -99; }
    const resized = PC.w !== W.w || PC.h !== W.h;
    PC.w = W.w; PC.h = W.h;
    const prep = g => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cw, ch); g.setTransform(sc, 0, 0, sc, -bx * sc, -by * sc); };
    if (resized || Math.abs(W.t - PC.ta) >= 0.1) {
      PC.ta = W.t;
      const ga = PC.a.getContext('2d');
      prep(ga); renderCloud(ga, P);
    }
    const nk = nightK(), fast = nk > 0.2 || W.lv.levGlory > 0.6 || W.lv.levIncense > 0.05;
    if (resized || Math.abs(W.t - PC.tb) >= (fast ? 1 / 30 : 0.1)) {
      PC.tb = W.t;
      const gb = PC.b.getContext('2d');
      prep(gb); PC.glow = renderGlow(gb, P);
    }
    ctx.drawImage(PC.a, bx, by, bw, bh);
    if (PC.glow) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.drawImage(PC.b, bx, by, bw, bh);
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  const PN = 30;
  const pillarFadeTop = ph => 1 - smoothstep(0.5, 1, ph);
  // 云柱中的一团：越往上越宽、越柔（不左右扭动）
  function puffAt(P, i, ph) {
    const R = PUFF[i], w0 = P.w0;
    const y = P.base - ph * P.Hh;
    const sw = Math.sin(W.t * 0.15 + ph * 3) * w0 * 0.03 + (R[0] - 0.5) * w0 * 0.08;
    const r = w0 * (0.6 + 0.9 * ph) * (0.85 + 0.3 * R[1]) * (1 + 0.04 * Math.sin(W.t * 0.6 + i));
    return [P.cx + sw, y, r];
  }
  const puffPh = i => U.fract(i / PN + W.t * 0.006 + PUFF[i][2] * 0.02);
  // 歇在帐幕以上的云：扁扁的一层，盖在帐幕上（出 40:34），云柱自其中升起  [x（按帐幕长）, 半宽, 半高, 高出顶]
  const REST = [[-0.04, 0.2, 0.085, 0.0], [0.16, 0.25, 0.1, 0.04], [0.38, 0.29, 0.115, 0.07], [0.62, 0.28, 0.11, 0.065], [0.84, 0.23, 0.095, 0.035], [1.02, 0.17, 0.075, -0.01], [0.52, 0.3, 0.12, 0.13]];
  function renderCloud(ctx, P) {
    const cs = cloudSprites();
    const G = P.G, s = G.s, L = P.L, Hh = P.Hh;
    const day = W.daylight, nk = nightK(), inc = W.lv.levIncense;
    const lx = litX() >= P.cx ? 1 : -1;
    // 夜里云淡下去，让火透出来
    const dim = 1 - 0.6 * nk;
    const aLit = (0.36 + 0.26 * day) * dim, aSh = (0.46 + 0.3 * day) * dim;
    // 背光的一面
    for (let i = 0; i < PN; i++) {
      const ph = puffPh(i), [x, y, r] = puffAt(P, i, ph);
      const a = Math.min(1, ph * 10) * pillarFadeTop(ph);
      spr(ctx, cs.shade, x - lx * r * 0.18, y + r * 0.12, r, a * aSh);
    }
    const restAt = (q, k) => {
      const b = 1 + 0.03 * Math.sin(W.t * 0.4 + q[0] * 9);
      return [G.x0 + L * q[0], G.top - L * q[3] * k, L * q[1] * b, L * q[2] * b];
    };
    for (const q of REST) { const [x, y, rx, ry] = restAt(q, 1); sprE(ctx, cs.shade, x - lx * rx * 0.1, y + ry * 0.3, rx, ry, aSh * 0.9); }
    for (const q of REST) { const [x, y, rx, ry] = restAt(q, 1); sprE(ctx, cs.lit, x + lx * rx * 0.08, y - ry * 0.25, rx * 0.86, ry * 0.8, aLit * 0.95); }
    // 迎光的一面
    for (let i = 0; i < PN; i++) {
      const ph = puffPh(i), [x, y, r] = puffAt(P, i, ph);
      const a = Math.min(1, ph * 10) * pillarFadeTop(ph);
      spr(ctx, cs.lit, x + lx * r * 0.16, y - r * 0.1, r * 0.72, a * aLit);
    }
    // 香的烟云（16:13）：金色的香烟自帐幕中升起，遮掩施恩座
    if (inc > 0.01) for (let j = 0; j < 3; j++) smoke(ctx, G.x0 + L * (0.3 + 0.2 * j), G.top + 4 * s, inc, Hh * 0.35, L * 0.12, 7 + j * 3, SP.incense, 0.11, 0.55);
    ctx.globalAlpha = 1;
  }
  function renderGlow(gl, P) {
    const G = P.G, s = G.s, cx = P.cx, base = P.base, L = P.L, Hh = P.Hh, w0 = P.w0;
    const day = W.daylight, nk = nightK(), g = W.lv.levGlory, inc = W.lv.levIncense;
    if (inc > 0.01) spr(gl, SP.gold, cx, G.top, L * 0.9, inc * 0.35);
    // 日间：云柱里一道极淡的金光；夜间：云中有火，中间一道白金的芯
    for (let i = 0; i < 26; i++) {
      const ph = U.fract(i / 26 + W.t * 0.01);
      const y = base - ph * Hh * 0.92, sw = Math.sin(W.t * 0.5 + i * 1.3) * w0 * 0.05;
      const fl = 0.8 + 0.2 * Math.sin(W.t * 3.1 + i * 2.7);
      const a = Math.min(1, ph * 8) * pillarFadeTop(ph) * (1 - ph * 0.4);
      const r = w0 * (0.68 + 0.8 * ph);
      spr(gl, SP.gold, cx + sw, y, r * 0.8, a * day * 0.045);
      if (nk > 0.02) {
        spr(gl, SP.fireSoft, cx + sw, y, r, a * nk * 0.75 * fl);
        if (ph < 0.7) spr(gl, SP.white, cx + sw * 0.5, y, w0 * 0.35 * (1 + ph), a * nk * 0.4 * (0.85 + 0.15 * fl));
      }
      if (g > 0.02) spr(gl, SP.gold, cx + sw, y, r * 1.05, a * g * (0.07 + 0.29 * nk) * fl);
    }
    if (nk > 0.02) spr(gl, SP.warm, cx, base - Hh * 0.12, w0 * 2, nk * 0.45);
    if (g > 0.02) spr(gl, SP.gold, cx, base - 6 * s, w0 * 2.4, g * (0.22 + 0.25 * nk));
    gl.globalAlpha = 1;
    return true;
  }

  // ── 圣洁的光（11:44）：一道白金的光贴着全营的地面（近地与中丘），预先画好，只随 levHoly 明暗 ──
  const HB = { c: null, w: 0, h: 0, y0: 0, hh: 0 };
  function holyBand() {
    if (HB.c && HB.w === W.w && HB.h === W.h) return HB;
    SP || sprites();
    HB.w = W.w; HB.h = W.h;
    const sc = 0.5, s2 = LS(2), s1 = LS(1);
    const sp1 = W.landSpan ? W.landSpan(1) : null;
    const rows = [[2, 0.36, 1.0, 54 * s2, 1], [1, sp1 ? sp1[0] / W.w + 0.02 : 0.5, 1.0, 32 * s1, 0.75]];
    let y0 = 1e9, y1 = -1e9;
    for (const r of rows) for (let i = 0; i <= 40; i++) { const xf = lerp(r[1], r[2], i / 40), y = gY(r[0], xf); y0 = Math.min(y0, y - r[3] * 0.8); y1 = Math.max(y1, y + r[3] * 0.2); }
    y0 = Math.floor(y0); y1 = Math.ceil(Math.min(W.h, y1));
    HB.y0 = y0; HB.hh = Math.max(4, y1 - y0);
    const cw = Math.ceil(W.w * sc), ch = Math.ceil(HB.hh * sc);
    const c = HB.c && HB.c.width === cw && HB.c.height === ch ? HB.c : cnv(cw, ch);
    const g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, cw, ch);
    g.globalCompositeOperation = 'lighter';
    // 一个像素一列（离屏的像素），列与列不相叠，光带才是连续平滑的
    for (const r of rows) {
      const xa = r[1] * W.w, xb = r[2] * W.w, bh = r[3] * sc;
      for (let px = Math.floor(xa * sc); px < Math.min(cw, Math.ceil(xb * sc)); px++) {
        const x = (px + 0.5) / sc, y = gY(r[0], x / W.w);
        const edge = smoothstep(xa, xa + 70, x) * (1 - smoothstep(xb - 20, xb + 10, x));
        if (edge <= 0.004) continue;
        g.globalAlpha = r[4] * edge;
        g.drawImage(SP.band, 0, 0, SP.band.width, SP.band.height, px, (y - y0) * sc - bh * 0.8, 1, bh);
      }
    }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    HB.c = c;
    return HB;
  }

  // ── 夜里的光：坛上的火、云中的火、营火、灯台、荣光——照亮近处的人 ──
  function drawLights(ctx) {
    SP || sprites();
    const nk = nightK(), s = LS(2), mm = M();
    ctx.globalCompositeOperation = 'lighter';
    const A = altarGeom(), f = W.lv.levFire;
    if (f > 0.01) {
      const fl = 0.9 + 0.1 * Math.sin(W.t * 9.3);
      spr(ctx, SP.warm, A.x, A.top - 4 * s, (60 + 40 * Math.max(0, f - 1)) * s, clamp(f, 0, 1.4) * (0.08 + 0.3 * nk) * fl);
      // 自耶和华面前出来的火（9:24）：暖光铺满会众所在的地面
      const kf = smoothstep(1.3, 2.0, f);
      if (kf > 0.01) {
        const gx = lerp(CAMP0, X.altar, 0.55), gy = gY(2, gx) + 18 * s;
        sprE(ctx, SP.warm, gx, gy, W.w * 0.2, 46 * s, kf * (0.5 + 0.3 * nk) * fl);
        sprE(ctx, SP.fire, A.x, A.y, 110 * s, 60 * s, kf * 0.45 * fl);
      }
    }
    // 云中的火照着全营（出 40:38）
    if (nk > 0.02) spr(ctx, SP.fire, PILLAR_X * W.w, pillarBase() + 10 * s, mm * 0.45, nk * 0.35);
    const hk = W.lv.levHearth;
    if (hk > 0.01) spr(ctx, SP.warm, X.hearth * W.w, hearthY() - 6 * s, 50 * s, hk * (0.1 + 0.35 * nk) * (0.9 + 0.1 * Math.sin(W.t * 11)));
    const g = W.lv.levGlory;
    if (g > 0.35) {
      const k = smoothstep(0.35, 1, g);
      spr(ctx, SP.gold, PILLAR_X * W.w, pillarBase() + 6 * s, mm * 0.6, k * 0.5);
    }
    const hl = W.lv.levHoly;
    if (hl > 0.01) {
      const B = holyBand();
      ctx.globalAlpha = Math.min(1, hl * (0.62 + 0.08 * Math.sin(W.t * 0.9)) * (1 - 0.35 * W.daylight + 0.35));
      ctx.drawImage(B.c, 0, B.y0, W.w, B.hh);
      spr(ctx, SP.gold, PILLAR_X * W.w, gY(2, PILLAR_X) - 10 * s, mm * 0.32, hl * 0.16);
    }
    const lp = W.lv.levLamp;
    if (lp > 0.01) spr(ctx, SP.gold, (X.tabL - 0.012) * W.w, gY(2, X.tabL) - 10 * s, 40 * s, lp * (0.15 + 0.35 * nk));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ── 荣光在营中行走（26:12）：由 levTents 决定其位置（重演时已走完，不再显出）──
  // 先向西（右）走到营的尽头，再转回，向东走遍全营
  const WK_E = CAMP0 - 0.01;
  function walkerX(v) { return v < 0.28 ? lerp(PILLAR_X, 0.985, v / 0.28) : lerp(0.985, WK_E, (v - 0.28) / 0.72); }
  function tentLit(xf) {
    const v = W.lv.levTents;
    if (v <= 0) return 0;
    const need = xf >= PILLAR_X ? 0.28 * (xf - PILLAR_X) / (0.985 - PILLAR_X) : 0.28 + 0.72 * (0.985 - xf) / (0.985 - WK_E);
    return clamp((v - need) * 12, 0, 1);
  }
  function drawWalker(ctx) {
    const v = W.lv.levTents;
    if (v <= 0.002 || v >= 0.998) return;
    SP || sprites();
    const env = smoothstep(0, 0.04, v) * (1 - smoothstep(0.95, 0.998, v));
    const xf = walkerX(v), s = LS(2) * (port() ? 1.3 : 1), x = xf * W.w, y = gY(2, xf) + 6 * s, H = 124 * s, w = 42 * s;
    const br = 0.92 + 0.08 * Math.sin(W.t * 1.7);
    ctx.globalCompositeOperation = 'lighter';
    // 地上一片光，随行随照
    sprE(ctx, SP.gold, x, y + 4 * s, w * 3.4, w * 0.8, env * 0.7 * br);
    sprE(ctx, SP.warm, x, y, W.w * 0.09, w * 1.2, env * 0.3);
    ctx.globalAlpha = env * 0.9 * br;
    ctx.drawImage(SP.column, x - w / 2, y - H, w, H + 6 * s);
    ctx.drawImage(SP.column, x - w * 0.22, y - H * 0.92, w * 0.44, H * 0.92);
    spr(ctx, SP.gold, x, y - H * 0.38, w * 2.6, env * 0.55 * br);
    spr(ctx, SP.white, x, y - H * 0.42, w * 0.9, env * 0.7);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的光（不属于世界的状态；重演时不放）
  // ════════════════════════════════════════════════════════════
  const FXL = [];
  function fl(b, o) { if (!b.instant) FXL.push(Object.assign({ t: 0 }, o)); }
  // 人物手中之处（像素）：走动时跟着人
  function handOf(id) {
    const f = fig(id);
    if (!f) return null;
    const h = f._vis ? f._h : 44 * LS(2), x = f._vis ? f._x : f.nx * W.w, y = f._vis ? f._y : gY(2, f.nx);
    return [x + (f.facing || 1) * h * 0.2, y - h * 0.5, h];
  }
  // 香炉：一只小铜炉，炉中有火，冒着一缕香烟
  function drawCenser(ctx, x, y, s, k, lying) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = Math.min(1, k * 1.5);
    ctx.fillStyle = css([150, 104, 60], 2, 1, 0.1);
    ctx.beginPath();
    if (lying) ctx.ellipse(x, y - 1.2 * s, 3.4 * s, 1.6 * s, 0.35, 0, TAU);
    else { ctx.moveTo(x - 3.4 * s, y - 1.5 * s); ctx.quadraticCurveTo(x, y + 3 * s, x + 3.4 * s, y - 1.5 * s); ctx.closePath(); }
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    const fl0 = 0.8 + 0.2 * Math.sin(W.t * 11 + x);
    spr(ctx, SP.ember, x, y - 1.8 * s, 9 * s, k * fl0);
    spr(ctx, SP.warm, x, y - 2 * s, 22 * s, k * 0.45 * fl0);
    spr(ctx, SP.gold, x, y - 2 * s, 3 * s, k * fl0);
  }
  // 柔和的光环（中空的光带），椭圆
  function ring(ctx, x, y, R, fy, a) { sprE(ctx, SP.ring, x, y, R / 0.84, R * fy / 0.84, a); }
  function drawTransients(ctx) {
    if (!FXL.length) return;
    SP || sprites();
    const mm = M(), u = Math.max(0.55, W.unit) * PK(), s2 = LS(2) * PK();
    for (const e of FXL) {
      const q = clamp(e.t / e.dur, 0, 1);
      ctx.globalCompositeOperation = 'lighter';
      if (e.type === 'voice') {
        // 从会幕中呼叫：门口一团光，几道柔和的光环自门口荡开
        const G = tabGeom(), x = G.x0 + G.dw * 0.5, y = G.g0 - G.H * 0.45;
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.5, 1, q));
        spr(ctx, SP.gold, x, y, 60 * s2, env * 0.8);
        for (let k = 0; k < 3; k++) {
          const p = clamp(q * 1.6 - k * 0.22, 0, 1);
          if (p <= 0 || p >= 1) continue;
          ring(ctx, x, y, p * mm * 0.5, 0.32, (1 - p) * 0.5);
        }
      } else if (e.type === 'firefall') {
        // 有火从耶和华面前出来（9:24）：自云柱下部、会幕门前的荣光中出来，高高扬起，重重落在坛上
        const A = altarGeom(), P = pillarGeom();
        const x0 = P.cx - P.w0 * 0.3, y0 = P.base - 0.35 * P.Hh, x1 = A.x, y1 = A.top;
        const cxp = lerp(x0, x1, 0.82), cyp = y0 - 34 * s2;
        const head = smoothstep(0, 0.24, q), env = 1 - smoothstep(0.5, 1, q);
        spr(ctx, SP.gold, x0, y0, 70 * s2, env * 0.6 * smoothstep(0, 0.08, q));
        const N = 30;
        for (let i = 0; i < N; i++) {
          const k = i / (N - 1) * head, m = 1 - k;
          const cx = m * m * x0 + 2 * m * k * cxp + k * k * x1, cy = m * m * y0 + 2 * m * k * cyp + k * k * y1;
          const r = (14 + 22 * k) * s2 * (0.8 + 0.2 * Math.sin(e.t * 30 + i));
          spr(ctx, SP.fire, cx, cy, r * 2.2, env * 0.7);
          spr(ctx, SP.white, cx, cy, r * 0.8, env * 0.6);
        }
        if (q > 0.22) {
          const bq = clamp((q - 0.22) / 0.78, 0, 1);
          spr(ctx, SP.gold, x1, y1, (70 + 200 * bq) * s2, (1 - bq) * 0.6);
          spr(ctx, SP.white, x1, y1, (24 + 50 * bq) * s2, (1 - bq) * 0.5);
        }
      } else if (e.type === 'strike') {
        // 拿答、亚比户：有火从耶和华面前出来——一道白金的光自会幕门口射出
        const G = tabGeom(), x0 = G.x0 + G.dw * 0.5, y0 = G.g0 - G.H * 0.45;
        const env = smoothstep(0, 0.08, q) * (1 - smoothstep(0.3, 1, q));
        spr(ctx, SP.gold, x0, y0, 40 * s2, env * 0.8);
        for (const id of e.ids) {
          const h = headOf(id, 0.55);
          if (!h) continue;
          ctx.lineCap = 'round';
          ctx.strokeStyle = 'rgb(255,214,150)'; ctx.globalAlpha = env * 0.45; ctx.lineWidth = 9 * s2;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(h[0], h[1]); ctx.stroke();
          ctx.strokeStyle = 'rgb(255,248,230)'; ctx.globalAlpha = env * 0.95; ctx.lineWidth = Math.max(1.5, 2.6 * s2);
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(h[0], h[1]); ctx.stroke();
          spr(ctx, SP.gold, h[0], h[1], 34 * s2, env * 0.85);
          spr(ctx, SP.white, h[0], h[1], 12 * s2, env * 0.8);
        }
      } else if (e.type === 'censer') {
        // 各拿自己的香炉，盛上火，加上香（10:1）
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.94, 1, q));
        for (const id of e.ids) {
          const h = handOf(id);
          if (!h) continue;
          const sc = h[2] / 38;
          smoke(ctx, h[0], h[1] - 3 * sc, env, 26 * sc, 2.4 * sc, id.length, SP.incense, 0.3, 0.5);
          drawCenser(ctx, h[0], h[1], sc * PK(), env, false);
        }
      } else if (e.type === 'embers') {
        // 他们倒下之处：两只香炉落在地上，炉中的火渐渐暗去——只剩缺席
        const env = smoothstep(0, 0.06, q) * Math.pow(1 - q, 0.8);
        for (const pt of e.pts) {
          const g = gY(2, pt[0]), y = g + pt[1] * Math.max(0, W.h - g) * 0.8, sc = LS(2) * (1 + 0.35 * pt[1]) * PK();
          drawCenser(ctx, pt[0] * W.w, y, sc, env * 0.8, true);
        }
      } else if (e.type === 'oil') {
        // 把膏油倒在亚伦的头上（8:12）
        const h = headOf('aaron', 1.05);
        if (!h) continue;
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.7, 1, q));
        spr(ctx, SP.gold, h[0], h[1] + 8 * s2, 40 * s2, env * 0.7);
        ctx.fillStyle = 'rgb(255,226,150)';
        for (let i = 0; i < 12; i++) {
          const p = U.fract(e.t * 0.9 + i / 12), yy = h[1] - 14 * s2 + p * 40 * s2, xx = h[0] + Math.sin(i * 2.4) * 4 * s2;
          ctx.globalAlpha = env * (1 - p) * 0.9;
          ctx.fillRect(xx - 0.8 * u, yy, 1.6 * u, 2.6 * u);
        }
      } else if (e.type === 'wash') {
        const env = 1 - q;
        for (const id of e.ids) { const h = headOf(id, 0.8); if (h) spr(ctx, SP.white, h[0], h[1], 18 * s2, env * 0.5); }
      } else if (e.type === 'doves') {
        // 两只斑鸠（12:8）：在妇人手里，后来飞进院子
        const h = headOf('mother', 0.55);
        if (!h) continue;
        const flyK = smoothstep(0.78, 1, q);
        const A = altarGeom();
        for (let i = 0; i < 2; i++) {
          const f = fig('mother'), dir = f ? f.facing : 1;
          const bx = lerp(h[0] + dir * (10 + i * 8) * s2, A.x, flyK), by = lerp(h[1] - i * 5 * s2, A.top - 20 * s2, flyK) - Math.sin(flyK * Math.PI) * 30 * s2;
          const flap = Math.sin(e.t * (flyK > 0 ? 18 : 3) + i) * 4.4 * s2;
          ctx.globalCompositeOperation = 'lighter';
          spr(ctx, SP.white, bx, by, 12 * s2, 0.35 * (1 - smoothstep(0.9, 1, q)));
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 1 - smoothstep(0.9, 1, q);
          ctx.fillStyle = css([226, 218, 206], 2, 1, 0.25);
          ctx.beginPath(); ctx.ellipse(bx, by, 4.8 * s2, 3.2 * s2, 0, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.ellipse(bx + dir * 4.2 * s2, by - 2 * s2, 1.9 * s2, 1.7 * s2, 0, 0, TAU); ctx.fill();
          ctx.beginPath(); ctx.moveTo(bx - 6.4 * s2, by - flap); ctx.lineTo(bx, by - 1.2 * s2); ctx.lineTo(bx + 6.4 * s2, by - flap); ctx.lineTo(bx, by + 0.8 * s2); ctx.closePath(); ctx.fill();
        }
      } else if (e.type === 'sprinkle') {
        // 洒七次（14:7）
        const a = headOf(e.from, 0.55), b = headOf(e.to, 0.6);
        if (!a || !b) continue;
        ctx.fillStyle = 'rgb(214,236,255)';
        for (let k = 0; k < 7; k++) {
          const p = clamp((q * 7.6 - k), 0, 1);
          if (p <= 0 || p >= 1) continue;
          for (let j = 0; j < 5; j++) {
            const pp = clamp(p + j * 0.04, 0, 1), xx = lerp(a[0], b[0], pp), yy = lerp(a[1], b[1], pp) - Math.sin(pp * Math.PI) * 14 * s2;
            ctx.globalAlpha = (1 - p) * 0.95;
            ctx.fillRect(xx - 1.2 * u, yy - 1.2 * u, 2.4 * u, 2.4 * u);
          }
          if (p > 0.8) spr(ctx, SP.white, b[0], b[1], 14 * s2, (1 - p) * 3);
        }
      } else if (e.type === 'bird') {
        // 又把活鸟放在田野里（14:7）：一只白鸟自祭司手中飞起，飞过海面，没入天空，身后一道淡淡的光
        const x0 = e.xf * W.w, y0 = e.yf * W.h, x2 = W.w * 0.08, y2 = W.h * 0.14, x1 = lerp(x0, x2, 0.3), y1 = y0 - W.h * 0.28;
        const at = p => [(1 - p) * (1 - p) * x0 + 2 * (1 - p) * p * x1 + p * p * x2, (1 - p) * (1 - p) * y0 + 2 * (1 - p) * p * y1 + p * p * y2];
        const p = U.easeInOut(q);
        const [bx, by] = at(p);
        const sz = lerp(8.4, 3.4, p) * Math.max(0.8, u) * (W.w < 600 ? 1.2 : 1), flap = Math.sin(e.t * 16) * sz;
        const fade = 1 - smoothstep(0.85, 1, q);
        ctx.globalCompositeOperation = 'lighter';
        for (let j = 1; j <= 10; j++) {
          const pj = Math.max(0, p - j * 0.012);
          const [tx, ty] = at(pj);
          spr(ctx, SP.gold, tx, ty, sz * (1.6 - j * 0.1), fade * (1 - j / 11) * 0.35);
        }
        spr(ctx, SP.white, bx, by, sz * 4, fade * 0.45);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = fade;
        ctx.strokeStyle = 'rgb(250,248,242)'; ctx.lineWidth = Math.max(1.2, sz * 0.45); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(bx - sz * 1.6, by - flap); ctx.quadraticCurveTo(bx - sz * 0.6, by - sz * 0.5, bx, by); ctx.quadraticCurveTo(bx + sz * 0.6, by - sz * 0.5, bx + sz * 1.6, by - flap); ctx.stroke();
        ctx.fillStyle = 'rgb(250,248,242)';
        ctx.beginPath(); ctx.ellipse(bx, by + sz * 0.1, sz * 0.5, sz * 0.32, 0, 0, TAU); ctx.fill();
      } else if (e.type === 'sins') {
        // 承认一切罪孽，都归在羊的头上（16:21）：暗紫的微尘自众人飘向羊头
        const g = headOf('goatA', 0.3);
        if (!g) continue;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgb(84,70,100)';
        const env = 1 - smoothstep(0.85, 1, q);
        for (let i = 0; i < e.src.length; i++) {
          const m = e.src[i];
          if (!m) continue;
          const h = memberHead(m, 0.7);
          for (let j = 0; j < 3; j++) {
            const p = clamp(q * 1.5 - (i % 7) * 0.05 - j * 0.12, 0, 1);
            if (p <= 0 || p >= 1) continue;
            const xx = lerp(h[0], g[0], p), yy = lerp(h[1], g[1], p) - Math.sin(p * Math.PI) * 26 * s2;
            ctx.globalAlpha = env * Math.sin(p * Math.PI) * 0.8;
            ctx.beginPath(); ctx.arc(xx, yy, 2 * u, 0, TAU); ctx.fill();
          }
        }
        ctx.globalCompositeOperation = 'lighter';
        spr(ctx, SP.violet, g[0], g[1], 24 * s2, env * smoothstep(0.3, 0.7, q) * 0.55);
      } else if (e.type === 'lots') {
        // 为那两只羊拈阄（16:8）：一点金光落在归与耶和华的羊，一点暗光落在归与阿撒泻勒的羊
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.75, 1, q));
        const drop = smoothstep(0.05, 0.45, q);
        const a = headOf('goatB', 0.5), b = headOf('goatA', 0.5), h = headOf('aaron', 0.6);
        for (const [t, col, k] of [[a, SP.gold, 1], [b, SP.violet, 0.8]]) {
          if (!t) continue;
          const sx = h ? h[0] : t[0], sy = (h ? h[1] : t[1]) - 20 * s2;
          const x = lerp(sx, t[0], drop), y = lerp(sy, t[1] - 10 * s2, drop) - Math.sin(drop * Math.PI) * 24 * s2;
          spr(ctx, col, x, y, 16 * s2, env * 0.9 * k);
          spr(ctx, SP.white, x, y, 4 * s2, env * 0.8);
          if (drop >= 1) spr(ctx, col, t[0], t[1] - 6 * s2, 30 * s2, env * 0.6 * k);
        }
      } else if (e.type === 'threads') {
        // 要爱人如己（19:18）：邻舍之间一道道金色的线
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.8, 1, q));
        const pts = [];
        for (const gid of CROWDS) crowdEach(gid, m => { if (!m.dying && m.layer === 2) pts.push(memberHead(m, 0.72)); });
        for (const id of e.ids) { const h = headOf(id, 0.72); if (h) pts.push(h); }
        pts.sort((a, b) => a[0] - b[0]);
        ctx.strokeStyle = 'rgb(255,214,140)'; ctx.lineWidth = Math.max(0.8, 1.3 * u);
        for (let i = 0; i + 1 < pts.length; i++) {
          const a = pts[i], b = pts[i + 1];
          if (b[0] - a[0] > W.w * 0.08) continue;
          const pulse = 0.6 + 0.4 * Math.sin(e.t * 2.2 + i * 1.3);
          ctx.globalAlpha = env * 0.55 * pulse;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 16 * s2, b[0], b[1]); ctx.stroke();
          spr(ctx, SP.gold, a[0], a[1], 7 * s2, env * 0.5 * pulse);
        }
      } else if (e.type === 'bound') {
        // 将圣的、俗的分别出来（10:10）：院帷的上缘一道光
        const env = smoothstep(0, 0.2, q) * (1 - smoothstep(0.6, 1, q));
        const x0 = X.gate * W.w, x1 = X.courtR * W.w, sL = LS(2), h = 30 * sL, lift = 6 * sL;
        ctx.strokeStyle = 'rgb(255,236,190)'; ctx.lineWidth = Math.max(1, 2 * u);
        ctx.globalAlpha = env * 0.8;
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) { const x = lerp(x0, x1, i / 24), y = gY(2, x / W.w) - lift - h; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
      } else if (e.type === 'campEdge') {
        // 营的边：一道细细的光划在地上，他在营外
        const env = smoothstep(0, 0.15, q) * (1 - smoothstep(0.7, 1, q));
        const x = (CAMP0 - 0.012) * W.w, g = gY(2, CAMP0 - 0.012), sL = LS(2);
        ctx.globalAlpha = env * 0.6;
        ctx.drawImage(SP.column, x - 6 * sL * PK(), g - 46 * sL * PK(), 12 * sL * PK(), 58 * sL * PK());
      } else if (e.type === 'crown') {
        // 圣冠上的金牌（8:9）
        const h = headOf('aaron', 0.97);
        if (!h) continue;
        const env = smoothstep(0, 0.1, q) * (1 - smoothstep(0.7, 1, q));
        spr(ctx, SP.gold, h[0], h[1], 26 * s2, env * 0.8);
        ctx.strokeStyle = 'rgb(255,244,210)'; ctx.lineWidth = Math.max(0.8, 1.1 * u); ctx.globalAlpha = env * 0.9;
        const R = 12 * s2 * (0.8 + 0.2 * Math.sin(e.t * 3));
        ctx.beginPath(); ctx.moveTo(h[0] - R, h[1]); ctx.lineTo(h[0] + R, h[1]); ctx.moveTo(h[0], h[1] - R); ctx.lineTo(h[0], h[1] + R); ctx.stroke();
      } else if (e.type === 'horns') {
        // 禧年的角（25:9）：吹角的人口边一支弯弯的羊角，角口一团光
        const env = smoothstep(0, 0.06, q) * (1 - smoothstep(0.88, 1, q));
        for (const id of e.ids) {
          const f = fig(id), h = headOf(id, 0.9);
          if (!f || !h) continue;
          const dir = f.facing || 1, L = 20 * s2;
          const bx = h[0] + dir * L, by = h[1] - L * 0.72;
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = env;
          ctx.strokeStyle = css([226, 204, 164], 2, 1, 0.2); ctx.lineCap = 'round';
          ctx.lineWidth = Math.max(1.4, 3 * s2);
          ctx.beginPath(); ctx.moveTo(h[0] + dir * 2 * s2, h[1] + 2 * s2); ctx.quadraticCurveTo(h[0] + dir * L * 0.95, h[1] + 2 * s2, bx, by); ctx.stroke();
          ctx.lineWidth = Math.max(2, 4.6 * s2);
          ctx.beginPath(); ctx.moveTo(bx - dir * 1.2 * s2, by + 2.2 * s2); ctx.lineTo(bx + dir * 0.6 * s2, by - 1.2 * s2); ctx.stroke();
          ctx.globalCompositeOperation = 'lighter';
          const blast = Math.max(0, Math.sin(e.t * 1.35 * Math.PI * 0.5 - 0.3));
          spr(ctx, SP.gold, bx, by, 30 * s2, env * (0.25 + 0.6 * blast));
          spr(ctx, SP.white, bx, by, 8 * s2, env * blast * 0.7);
        }
      } else if (e.type === 'sweep') {
        // 一道宽宽的光沿着地面走过（圣洁、禧年、地是我的）：前头一道光的帷幕，身后留下贴地的光
        const env = 1 - smoothstep(0.7, 1, q), hx = lerp(e.x0, e.x1, U.easeOut(q)), l = e.l == null ? 2 : e.l, sL = LS(l) * PK();
        const bh = (l === 2 ? 70 : l === 1 ? 44 : 30) * sL, step = 8;
        const xa = Math.min(e.x0, hx) * W.w, xb = Math.max(e.x0, hx) * W.w;
        for (let x = xa; x < xb; x += step) {
          const xf = (x + step / 2) / W.w, d = Math.abs(xf - hx) / Math.max(0.05, Math.abs(e.x1 - e.x0));
          ctx.globalAlpha = env * 0.55 * Math.max(0.25, 1 - d * 1.5);
          ctx.drawImage(SP.band, x, gY(l, xf) - bh * 0.8, step + 1, bh);
        }
        const gy = gY(l, hx), H = (l === 2 ? 90 : l === 1 ? 60 : 44) * sL, w = (l === 2 ? 60 : 40) * sL;
        ctx.globalAlpha = env * 0.75;
        ctx.drawImage(SP.column, hx * W.w - w / 2, gy - H, w, H * 1.1);
        spr(ctx, SP.gold, hx * W.w, gy - H * 0.3, w * 1.4, env * 0.5);
      } else if (e.type === 'lift') {
        // 他必蒙赦免：一点光自人身上升起
        const h = headOf(e.id, 0.7);
        if (!h) continue;
        const env = 1 - q;
        for (let i = 0; i < 6; i++) { const p = U.fract(q * 1.4 + i / 6); spr(ctx, SP.gold, h[0] + Math.sin(i * 2 + e.t) * 6 * s2, h[1] - p * 70 * s2, 5 * s2, env * (1 - p) * 0.9); }
        spr(ctx, SP.gold, h[0], h[1], 26 * s2, env * 0.4);
      } else if (e.type === 'touch') {
        const f = fig(e.id);
        if (!f) continue;
        const x = (f._vis ? f._x : f.nx * W.w) + (f.facing || 1) * 9 * s2, y = (f._vis ? f._y : gY(2, f.nx)) - 16 * s2;
        spr(ctx, SP.gold, x, y, 22 * s2, (1 - q) * Math.min(1, q * 6) * 0.8);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // 角声与呼声的光环：柔和的光带贴着大地向四方荡开；画在人物之下，到了海边（左）渐渐隐去
  const WV = { c: null };
  function drawWaves(ctx) {
    let any = false;
    for (const e of FXL) if (e.type === 'waves') { any = true; break; }
    if (!any) return;
    SP || sprites();
    const sc = 0.5, cw = Math.max(8, Math.ceil(W.w * sc)), ch = Math.max(8, Math.ceil(W.h * sc));
    if (!WV.c || WV.c.width !== cw || WV.c.height !== ch) WV.c = cnv(cw, ch);
    const g = WV.c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, cw, ch);
    g.setTransform(sc, 0, 0, sc, 0, 0);
    g.globalCompositeOperation = 'lighter';
    const s2 = LS(2) * PK();
    for (const e of FXL) {
      if (e.type !== 'waves') continue;
      const q = clamp(e.t / e.dur, 0, 1);
      for (const pt of e.pts) {
        const px = pt[0] * W.w, py = pt[1] * W.h;
        for (let k = 0; k < 2; k++) {
          const p = clamp(q * 1.25 - k * 0.22, 0, 1);
          if (p <= 0 || p >= 1) continue;
          ring(g, px, py, 12 * s2 + p * e.R * W.w, 0.24, Math.pow(1 - p, 1.4) * (0.55 - 0.15 * k));
        }
        spr(g, SP.gold, px, py, 30 * s2, (1 - q) * 0.7);
      }
    }
    // 左边海上渐隐
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'destination-in';
    const gr = g.createLinearGradient(0.33 * cw, 0, 0.45 * cw, 0);
    gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(0, 0, cw, ch);
    g.globalCompositeOperation = 'source-over';
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1;
    ctx.drawImage(WV.c, 0, 0, W.w, W.h);
    ctx.globalCompositeOperation = 'source-over';
  }

  // 一道扁扁的光环贴着地面荡开（位置、半径都按画面的比例记下）
  function halo(b, xf, y, R, dur) { fl(b, { type: 'waves', pts: [[xf, y / W.h]], R: R / W.w, dur: dur || 3 }); }

  // ════════════════════════════════════════════════════════════
  //  布景模块
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() { sprites(); },
    resize() {},
    update(dt) {
      if (!isCur()) { FXL.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'far') { drawSinai(ctx); return; }
      if (pass === 'mid') {
        for (let i = 0; i < MID_TENTS.length; i++) { const t = MID_TENTS[i]; drawTent(ctx, t.x, 1, t.size, t.seed, tentLit(t.x) * 0.8); }
        const bk = W.lv.levBooths;
        if (bk > 0.005) for (let i = 0; i < MID_BOOTHS.length; i++) drawBooth(ctx, MID_BOOTHS[i], 1, clamp(bk * 1.6 - i * 0.07, 0, 1), 40 + i);
        return;
      }
      if (pass === 'near') {
        for (const t of NEAR_TENTS) drawTent(ctx, t.x, 2, t.size, t.x * 997, tentLit(t.x));
        const bk = W.lv.levBooths;
        if (bk > 0.005) for (let i = 0; i < NEAR_BOOTHS.length; i++) drawBooth(ctx, NEAR_BOOTHS[i], 2, clamp(bk * 1.6 - i * 0.07, 0, 1), 10 + i);
        drawCourt(ctx);
        drawTabernacle(ctx);
        drawLaver(ctx);
        drawAltar(ctx);
        drawHearth(ctx);
        drawPillar(ctx);
        drawDays(ctx);
        drawGlean(ctx);
        drawWaves(ctx);
      }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'air') { drawLights(ctx); drawWalker(ctx); drawTransients(ctx); }
    },
    reset() { FXL.length = 0; },
    restore() { FXL.length = 0; },
    // 调试：本卷的状态（"看完"与"恢复"须一致）
    sig() { return { garb: S.garb, sons: S.sons, healed: S.healed, stranger: S.stranger, horns: S.horns, green: S.green }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const s = LS(2);
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10 * s, d }; };
      const G = tabGeom();
      cand('会幕', (G.x0 + G.x1) / 2, G.top + G.H * 0.3);
      const A = altarGeom();
      cand('燔祭坛', A.x, A.top);
      cand('洗濯盆', X.laver * W.w, gY(2, X.laver) - 14 * s);
      cand('院子', (X.gate * 0.3 + X.courtR * 0.7) * W.w, gY(2, X.courtR) - 36 * s);
      cand('云柱', PILLAR_X * W.w, pillarBase() - Math.min(W.h * 0.3, pillarBase() * 0.5));
      const d = sinaiDims();
      cand('西奈山', d.cx - 0.06 * d.HW, sinaiTop(-0.06) + 8);
      for (const t of NEAR_TENTS) cand(t.label || '帐棚', t.x * W.w, gY(2, t.x) - 22 * s * t.size);
      if (W.lv.levBooths > 0.5) for (const bx of NEAR_BOOTHS) cand('棚', bx * W.w, gY(2, bx) - 26 * s);
      if (W.lv.levHearth > 0.5) cand('营火', X.hearth * W.w, hearthY() - 6 * s);
      return best;
    },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：西奈山下，会幕立起之后的清晨
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 西奈的旷野：枯黄的地，花隐去，几乎没有树
    const lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 1, herbs: 0.35, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0,
      bare: 0.86, bloom: 0, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0,
      levGlory: 0.28, levFire: 0.75, levHoly: 0, levIncense: 0, levDays: 0, levBooths: 0, levLamp: 0, levHearth: 0, levTents: 0, levGlean: 0 };
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    const ox = W.w * 0.997, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('trees', ox, oy);
    W.setOrigin('grass', W.w * 0.7, W.ridgeBaseY(2, W.w * 0.7));
    W.setOrigin('herbs', W.w * 0.9, W.ridgeBaseY(2, W.w * 0.9));
    W.goTo(0.27, 0, true);
    const lx = W.w * 0.9, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 90, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 18, W.w * 0.4, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 10, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    FXL.length = 0;
    S = fresh();
    const c = C();
    c.clear({ fade: false });
    // 摩西站在院子的门前；亚伦和他儿子在东边、营与院门之间（民 3:38）；以利亚撒在坛旁供职
    putMoses(X.gate - 0.006, { facing: 1, from: 'none' });
    putAaron(0.531, { facing: 1, from: 'none' });
    add('nadab', Object.assign({ label: '拿答', sex: 'm', age: 'adult', x: 0.503, facing: 1, glow: 0.2, v: PRV, from: 'none' }, sonLook('nadab')));
    add('abihu', Object.assign({ label: '亚比户', sex: 'm', age: 'adult', x: 0.489, facing: 1, glow: 0.2, v: PRV, from: 'none' }, sonLook('abihu')));
    add('eleazar', Object.assign({ label: '以利亚撒', sex: 'm', age: 'adult', x: X.altar + 0.028, facing: -1, glow: 0.25, v: PRV, from: 'none' }, sonLook('eleazar')));
    add('ithamar', Object.assign({ label: '以他玛', sex: 'm', age: 'adult', x: 0.517, facing: 1, glow: 0.2, v: PRV, from: 'none' }, sonLook('ithamar')));
    add('offerer', { label: '献祭的人', sex: 'm', age: 'adult', x: HOME.offerer, facing: 1, robe: ROBE.offerer, glow: 0.25, v: FORE, from: 'none' });
    add('woman', { label: '他的妻子', sex: 'f', age: 'adult', x: HOME.woman, facing: 1, robe: ROBE.woman, glow: 0.2, v: FORE, from: 'none' });
    c.crowd('campL', { n: 9, x0: CAMP0, x1: 0.54, layer: 2, label: '以色列人', from: 'none' });
    c.crowd('campR', { n: 7, x0: 0.86, x1: 0.99, layer: 2, label: '以色列人', from: 'none' });
    c.crowd('campM', { n: 9, x0: 0.53, x1: 0.99, layer: 1, label: '以色列人', from: 'none' });
    // 羊群在中丘上吃草：不挡住营中的人，也不挡住被送走的羊
    herd('flock', { kind: 'sheep', n: 6, x0: 0.58, x1: 0.7, layer: 1, label: '羊群', from: 'none' });
    avoid([CAMP0 - 0.09, 1]);
  }
  // 献祭的人与他的妻子平常坐在营的前头（稍靠前的一排）
  const HOME = { offerer: 0.482, woman: 0.468 };
  // 众人：一齐做同一个姿势（含中丘上的会众）
  function allPeople(p, dir) { people(p, dir); if (dir) crowdFace('campM', dir); crowdPose('campM', p); }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  一天的光（不跳过整夜）：1 早晨 → 2 黄昏、一整夜、黎明 → 3 白日、日落，七盏灯在夜里亮起 → 4 夜尽，火在黎明前落下，日出
  //  → 5–8 白日到黄昏 → 9 营火的夜 → 10–11 夜（圣字、住棚的灯）→ 12 黎明的角声 → 13 雨后的午后到黄昏，荣光走过亮起的营
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1—3 耶和华从会幕中呼叫摩西：燔祭、素祭、平安祭 ─────────
    {
      kind: 'act', utter: '耶和华从会幕中呼叫摩西', cmd: 'listen --from 会幕 --to 摩西  # 你晓谕以色列人说', ref: '1:1',
      verse: [
        { text: '耶和华从会幕中呼叫摩西，对他说：「你晓谕以色列人说：<br>你们中间若有人献供物给耶和华，要从牛群羊群中献牲畜为供物。」', ref: '利未记 1:1–2', hold: 7.5 },
        { text: '他要按手在燔祭牲的头上，燔祭便蒙悦纳，为他赎罪。', ref: '利未记 1:4', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { fl(b, { type: 'voice', dur: 4.5 }); W.set('levGlory', 0.75, b.instant); W.goTo(0.36, 26, b.instant); sfx(b, 'angel', { soft: true }); }],
          [0.6, () => { face('moses', 1); pose('moses', 'kneel'); }],
          [3.4, () => { W.set('levGlory', 0.3); pose('moses', 'stand'); face('moses', -1); }],
          [4.2, () => pose('moses', 'point')],
          [5, b => {
            animal('bull', 'cow', HOME.offerer - 0.03, { label: '公牛', facing: 1, v: FORE, from: b.instant ? 'none' : 'fade' });
            walk('offerer', X.gate + 0.036, { speed: 0.028 });
            U.safe('cast.follow', () => C().follow('bull', 'offerer', 0.034));
            sfx(b, 'cow');
          }],
          [8, () => pose('moses', 'stand')],
          [10.2, b => { face('offerer', 1); pose('offerer', 'bow'); fl(b, { type: 'touch', id: 'offerer', dur: 2.4 }); }],
          [12.4, b => { rm('bull'); W.set('levFire', 1.2); pose('offerer', 'stand'); pose('eleazar', 'raise'); sfx(b, 'fire'); }],
          [14.2, b => {
            say(b, [{ text: '凡献为素祭的供物都要用盐调和，<br>在素祭上不可缺了你神立约的盐。', ref: '利未记 2:13', hold: 6 }]);
            walk('offerer', HOME.offerer, { speed: 0.03 });
            pose('eleazar', 'stand');
            hold('woman', 'jar');
            walk('woman', X.gate + 0.03, { speed: 0.032 });
          }],
          [19.4, b => { face('woman', 1); pose('woman', 'kneel'); pose('eleazar', 'carry'); W.set('levFire', 1.05); if (!b.instant) fx().sparkle(altarGeom().x, altarGeom().top - 10, 26, [255, 244, 214], 10, 'air'); }],
          [21.6, b => { say(b, [{ text: '人献供物为平安祭，若是从牛群中献，无论是公的是母的，<br>必用没有残疾的献在耶和华面前。', ref: '利未记 3:1', hold: 6 }]); }],
          [22.2, () => { pose('eleazar', 'stand'); hold('woman', null); walk('woman', HOME.woman, { speed: 0.03, pose: 'sit' }); pose('offerer', 'sit'); W.set('levFire', 0.9); }],
        ]);
      },
    },

    // ── 4—7 坛上的火常常烧着：赎罪祭、认罪、一整夜的火 ───────
    {
      kind: 'cmd', utter: '在坛上必有常常烧着的火，不可熄灭', cmd: 'while (true) 坛.火.feed(柴)  // 不可熄灭', ref: '6:13',
      verse: [
        { text: '坛上的火要在其上常常烧着，不可熄灭。祭司要每日早晨在上面烧柴……<br>在坛上必有常常烧着的火，不可熄灭。', ref: '利未记 6:12–13', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => { W.set('levFire', 1.25, b.instant); if (!b.instant) fx().sparkle(altarGeom().x, altarGeom().top - 14, 30, [255, 210, 150], 14, 'air'); W.goTo(0.76, 13, b.instant); sfx(b, 'fire'); }],
          [2.4, b => {
            pose('offerer', 'stand');
            animal('shegoat', 'goat', HOME.offerer - 0.03, { label: '母山羊', facing: 1, v: FORE, from: b.instant ? 'none' : 'fade' });
            walk('offerer', X.gate + 0.036, { speed: 0.028 });
            U.safe('cast.follow', () => C().follow('shegoat', 'offerer', 0.03));
            sfx(b, 'goat');
          }],
          [8.4, b => say(b, [{ text: '民中若有人……误犯了罪，所犯的罪自己知道了，<br>就要为所犯的罪牵一只没有残疾的母山羊为供物，', ref: '利未记 4:27–28', hold: 6 }])],
          [8.8, () => { face('offerer', 1); pose('offerer', 'pray'); }],
          [12.6, b => { rm('shegoat'); W.set('levFire', 1.2); pose('eleazar', 'raise'); sfx(b, 'fire'); }],
          // 一整夜：黄昏 → 夜 → 黎明（约十六秒）
          [13, b => { W.goTo(0.28, 16, b.instant); }],
          [15.8, b => {
            say(b, [{ text: '他有了罪的时候，就要承认所犯的罪……<br>至于他的罪，祭司要为他赎了。', ref: '利未记 5:5–6', hold: 6 }]);
            fl(b, { type: 'lift', id: 'offerer', dur: 4 });
          }],
          [17.6, () => { pose('offerer', 'stand'); walk('offerer', HOME.offerer, { speed: 0.03, pose: 'sit' }); pose('eleazar', 'stand'); }],
          [20.6, b => { pose('eleazar', 'carry'); if (!b.instant) fx().sparkle(altarGeom().x, altarGeom().top - 6, 24, [255, 190, 110], 10, 'air'); sfx(b, 'fire', { soft: true }); }],
          [23.2, b => say(b, [{ text: '这就是燔祭、素祭、赎罪祭、赎愆祭，和平安祭的条例……<br>都是耶和华在西奈山所吩咐摩西的，', ref: '利未记 7:37–38', hold: 6.5 }])],
          [24, () => { pose('eleazar', 'stand'); W.set('levFire', 1); }],
        ]);
      },
    },

    // ── 8 招聚会众；亚伦和他儿子洗濯、穿圣衣、受膏；七天住在会幕门口 ──
    {
      kind: 'cmd', utter: '招聚会众到会幕门口', cmd: 'broadcast 会众 --to 会幕门口', ref: '8:3',
      verse: [
        { text: '「你将亚伦和他儿子一同带来……又招聚会众到会幕门口。」<br>摩西就照耶和华所吩咐的行了；于是会众聚集在会幕门口。', ref: '利未记 8:2–4', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.42, 14, b.instant);
            crowdMill('campL', false); crowdMill('campR', false);
            crowdWalk('campR', 0.47, 0.545, { speed: 0.036 });
            crowdWalk('campL', CAMP0, 0.53, { speed: 0.03 });
            sfx(b, 'crowd', { soft: true });
          }],
          // 在洗濯盆旁：摩西在左，亚伦和他四个儿子一字排开（靠前一排，衬着包金的板）
          [1, () => {
            walk('moses', X.laver - 0.03, { speed: 0.03 });
            PRIESTS.forEach((id, i) => walk(id, X.laver + 0.02 + i * 0.021, { speed: 0.03 + i * 0.002 }));
          }],
          [8.3, b => {
            say(b, [{ text: '摩西带了亚伦和他儿子来，用水洗了他们。', ref: '利未记 8:6', hold: 5 }]);
            face('moses', 1); pose('moses', 'raise');
            PRIESTS.forEach(id => { face(id, -1); pose(id, 'bow'); });
            fl(b, { type: 'wash', ids: PRIESTS, dur: 3 });
            if (!b.instant) PRIESTS.forEach(id => { const h = headOf(id, 0.8); if (h) fx().sparkle(h[0], h[1], 12, [210, 232, 255], 8, 'air'); });
            sfx(b, 'splash', { soft: true });
          }],
          [11.4, b => {
            PRIESTS.forEach(id => pose(id, 'stand'));
            dressAaron(1); dressSons(true);
            W.goTo(0.9, 15, b.instant);           // 日头渐渐落下：七天昼夜，七盏灯在夜里一盏一盏亮起
            if (!b.instant) PRIESTS.forEach(id => { const h = headOf(id, 0.5); if (h) fx().sparkle(h[0], h[1], 16, [255, 226, 160], 12, 'air'); });
            sfx(b, 'chime');
          }],
          [14.4, b => {
            say(b, [{ text: '又把膏油倒在亚伦的头上膏他，使他成圣。', ref: '利未记 8:12', hold: 5.5 }]);
            pose('aaron', 'bow'); pose('moses', 'raise');
            fl(b, { type: 'oil', dur: 4 });
            sfx(b, 'harp');
          }],
          // 七天住在会幕门口：在门前坐成一排，彼此分开
          [18.2, () => {
            pose('aaron', 'stand'); pose('moses', 'stand');
            walk('aaron', X.tabL - 0.012, { speed: 0.025, pose: 'sit' });
            walk('eleazar', X.tabL - 0.034, { speed: 0.025, pose: 'sit' });
            walk('ithamar', X.tabL - 0.056, { speed: 0.025, pose: 'sit' });
            walk('nadab', X.tabL - 0.078, { speed: 0.025, pose: 'sit' });
            walk('abihu', X.tabL - 0.1, { speed: 0.025, pose: 'sit' });
            walk('moses', X.gate + 0.018, { speed: 0.025 });
          }],
          [21, b => {
            say(b, [{ text: '七天你们要昼夜住在会幕门口，遵守耶和华的吩咐……', ref: '利未记 8:35', hold: 6 }]);
            W.set('levDays', 1, b.instant);
          }],
        ]);
      },
    },

    // ── 9 第八天：有火从耶和华面前出来（本卷的签名）────────────
    {
      kind: 'act', utter: '有火从耶和华面前出来', cmd: 'fire --from 耶和华面前 --to 坛  # 众民欢呼，俯伏', ref: '9:24',
      verse: [
        { text: '亚伦向百姓举手，为他们祝福……摩西、亚伦进入会幕，<br>又出来为百姓祝福，耶和华的荣光就向众民显现。', ref: '利未记 9:22–23', hold: 7.6 },
        { text: '有火从耶和华面前出来，在坛上烧尽燔祭和脂油；<br>众民一见，就都欢呼，俯伏在地。', ref: '利未记 9:24', hold: 10 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('levDays', 0);
            W.goTo(0.22, 11, b.instant);             // 夜将尽：火在黎明前落下
            ['nadab', 'abihu', 'eleazar', 'ithamar'].forEach(id => pose(id, 'stand'));
            // 四个儿子分站在坛的两旁，彼此分开
            walk('eleazar', X.altar + 0.034, { speed: 0.03 }); walk('ithamar', X.altar + 0.056, { speed: 0.03 });
            walk('nadab', X.gate + 0.004, { speed: 0.03 }); walk('abihu', X.gate - 0.016, { speed: 0.03 });
            pose('aaron', 'stand');
            walk('aaron', X.altar - 0.02, { speed: 0.045, pose: 'raise' });
            walk('moses', X.gate + 0.024, { speed: 0.03 });
            people('stand', 1);
          }],
          [2.4, () => face('aaron', -1)],
          [3.6, () => { walk('aaron', X.tabL + 0.004, { speed: 0.045 }); walk('moses', X.tabL - 0.004, { speed: 0.05 }); }],
          [5.8, () => { rm('aaron'); rm('moses'); }],
          [7, b => {
            putAaron(X.tabL + 0.004, { from: b.instant ? 'none' : 'fade' });
            putMoses(X.tabL - 0.004, { from: b.instant ? 'none' : 'fade' });
            walk('aaron', X.tabL - 0.018, { speed: 0.02, pose: 'raise' });
            walk('moses', X.tabL - 0.04, { speed: 0.02, pose: 'raise' });
            W.set('levGlory', 1, b.instant);
            halo(b, PILLAR_X, gY(2, PILLAR_X), M() * 0.9, 3.2);
            sfx(b, 'angel');
          }],
          [8.9, b => {
            fl(b, { type: 'firefall', dur: 3.6 });
            W.set('levFire', 2.1, b.instant);
            if (!b.instant) { W.flash = Math.max(W.flash || 0, 0.45); W.shake = Math.max(W.shake || 0, 0.5); }
            sfx(b, 'fire', { size: 2 }); sfx(b, 'thunder', { soft: true, far: true });
          }],
          // 众民一见，就都欢呼：前面的人举起手来，其余的跪下
          [10.2, b => {
            crowdFace('campL', 1); crowdFace('campR', 1); crowdFace('campM', 1);
            crowdPose('campL', 'kneel'); crowdPose('campR', 'raise'); crowdPose('campM', 'raise');
            sfx(b, 'crowd');
          }],
          // 俯伏在地：会众屈身下拜；摩西、亚伦脸伏于地
          [12.4, () => {
            allPeople('bow', 1);
            ['moses', 'aaron'].forEach(id => { face(id, 1); pose(id, 'fall'); });
            ['nadab', 'abihu', 'eleazar', 'ithamar'].forEach(id => { face(id, id === 'nadab' || id === 'abihu' ? 1 : -1); pose(id, 'bow'); });
          }],
          [13, b => { W.goTo(0.33, 12, b.instant); }],   // 日出
          [17, () => { W.set('levFire', 1.3); W.set('levGlory', 0.5); }],
          [20.5, () => { allPeople('kneel', 1); pose('moses', 'kneel'); pose('aaron', 'kneel'); }],
        ]);
      },
    },

    // ── 10 拿答、亚比户献凡火；亚伦默默不言 ─────────────────────
    {
      kind: 'judge', utter: '我在亲近我的人中要显为圣', cmd: 'assert(近我者.holy)  // 在众民面前，我要得荣耀', ref: '10:3',
      verse: [
        { text: '亚伦的儿子拿答、亚比户各拿自己的香炉，盛上火，加上香，<br>在耶和华面前献上凡火，是耶和华没有吩咐他们的，', ref: '利未记 10:1', hold: 7 },
        { text: '就有火从耶和华面前出来，把他们烧灭，他们就死在耶和华面前。', ref: '利未记 10:2', hold: 5.5 },
        { text: '于是摩西对亚伦说：「这就是耶和华所说：『我在亲近我的人中要显为圣；<br>在众民面前，我要得荣耀。』」亚伦就默默不言。', ref: '利未记 10:3', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.4, 24, b.instant);
            W.set('levFire', 1.05);
            people('stand', -1); crowdPose('campM', 'stand');
            crowdMill('campL', true); crowdMill('campR', true);
            ['moses', 'aaron', 'eleazar', 'ithamar'].forEach(id => pose(id, 'stand'));
            walk('aaron', X.gate + 0.03, { speed: 0.03 }); walk('moses', X.gate + 0.006, { speed: 0.03 });
            walk('eleazar', X.tabL + 0.04, { speed: 0.03 }); walk('ithamar', X.tabL + 0.062, { speed: 0.03 });
            walk('nadab', X.altar + 0.014, { speed: 0.03 }); walk('abihu', X.altar - 0.012, { speed: 0.034 });
          }],
          // 各拿自己的香炉，盛上火，加上香
          [3.2, b => { fl(b, { type: 'censer', ids: ['nadab', 'abihu'], dur: 5.2 }); sfx(b, 'fire', { soft: true }); }],
          [4, () => { walk('nadab', X.tabL - 0.03, { speed: 0.03, pose: 'carry' }); walk('abihu', X.tabL - 0.054, { speed: 0.03, pose: 'carry' }); face('aaron', 1); face('eleazar', -1); face('ithamar', -1); }],
          [8.3, b => {
            fl(b, { type: 'strike', ids: ['nadab', 'abihu'], dur: 2.6 });
            const pts = [];
            ['nadab', 'abihu'].forEach(id => { const f = fig(id); if (f) pts.push([f.tx != null ? f.tx : f.nx, f.v || 0]); });
            fl(b, { type: 'embers', pts, dur: 17 });
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.2);
            pose('nadab', 'fall'); pose('abihu', 'fall');
            sfx(b, 'fire', { size: 1.5 });
          }],
          [10.2, b => {
            if (!b.instant) ['nadab', 'abihu'].forEach(id => { const h = headOf(id, 0.2); if (h) fx().sparkle(h[0], h[1], 18, [255, 236, 200], 10, 'air'); });
            rm('nadab'); rm('abihu');
          }],
          [11, () => { face('aaron', 1); pose('aaron', 'bow'); walk('moses', X.gate + 0.016, { speed: 0.02 }); }],
          [14.6, b => { face('moses', 1); halo(b, X.tabL, gY(2, X.tabL), M() * 0.6, 3); }],
          [21.6, b => {
            say(b, [{ text: '使你们可以将圣的、俗的，洁净的、不洁净的，分别出来；', ref: '利未记 10:10', hold: 5.5 }]);
            fl(b, { type: 'bound', dur: 6 });
          }],
          [24, () => { pose('aaron', 'stand'); }],
        ]);
      },
    },

    // ── 11—13 你们要成为圣洁：活物的条例、生育的妇人、独居营外的人 ──
    {
      kind: 'cmd', utter: '你们要成为圣洁，因为我是圣洁的', cmd: 'class 以色列 extends 圣洁 {}  // 因为我是圣洁的', ref: '11:44',
      verse: [
        { text: '我是耶和华你们的神；所以你们要成为圣洁，因为我是圣洁的。', ref: '利未记 11:44', hold: 6 },
        { text: '这是走兽、飞鸟，和水中游动的活物，并地上爬物的条例。<br>要把洁净的和不洁净的，可吃的与不可吃的活物，都分别出来。', ref: '利未记 11:46–47', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('levHoly', 1, b.instant);
            W.goTo(0.5, 26, b.instant);
            fl(b, { type: 'sweep', x0: PILLAR_X, x1: 0.36, dur: 4.2 }); fl(b, { type: 'sweep', x0: PILLAR_X, x1: 1.0, dur: 3.4 });
            fl(b, { type: 'sweep', x0: PILLAR_X, x1: 0.5, l: 1, dur: 3.6 }); fl(b, { type: 'sweep', x0: PILLAR_X, x1: 1.0, l: 1, dur: 3.2 });
            halo(b, PILLAR_X, gY(2, PILLAR_X), Math.hypot(W.w, W.h) * 0.5, 3.6);
            allPeople('gaze');
            sfx(b, 'chime');
          }],
          [4, () => { allPeople('stand'); walk('eleazar', X.gate + 0.07, { speed: 0.03 }); walk('ithamar', X.altar + 0.036, { speed: 0.03 }); }],
          [7.2, b => {
            W.setPop('bird', 30, W.w * 0.3, W.h * 0.35, b.instant);
            if (!b.instant) for (let i = 0; i < 5; i++) fx().sparkle(W.w * (0.06 + i * 0.07), W.h * (0.7 + (i % 2) * 0.1), 10, [220, 240, 255], 20, 'seaNear');
            sfx(b, 'bird');
          }],
          // 生育的妇人带着两只斑鸠，到院门前（靠前的一排）
          [13.4, b => {
            add('mother', { label: '生育的妇人', sex: 'f', age: 'adult', x: X.tentL1, facing: 1, robe: ROBE.mother, glow: 0.3, carry: 'baby', v: FORE, from: b.instant ? 'none' : 'fade' });
            walk('mother', X.gate + 0.008, { speed: 0.03 });
            fl(b, { type: 'doves', dur: 8.5 });
          }],
          [15, b => say(b, [{ text: '她的力量若不够献一只羊羔，她就要取两只斑鸠或是两只雏鸽……<br>祭司要为她赎罪，她就洁净了。', ref: '利未记 12:8', hold: 6.5 }])],
          [17.6, () => { walk('ithamar', X.gate + 0.048, { speed: 0.03 }); }],
          [19.6, b => { face('mother', 1); pose('mother', 'bow'); face('ithamar', -1); pose('ithamar', 'raise'); sfx(b, 'dove'); }],
          [21.6, () => { pose('mother', 'stand'); glow('mother', 0.45); walk('mother', X.tentL1 + 0.006, { speed: 0.03 }); }],
          // 独居营外：离开众人，坐在营外的坡上
          [22.4, b => {
            say(b, [{ text: '灾病在他身上的日子，他便是不洁净；<br>他既是不洁净，就要独居营外。', ref: '利未记 13:46', hold: 5.5 }]);
            add('leper', { label: '长大麻风的人', sex: 'm', age: 'adult', x: X.tentL1 - 0.004, facing: -1, robe: ROBE.leper, glow: 0, v: 0.12, from: b.instant ? 'none' : 'fade' });
            walk('leper', X.leper, { speed: 0.022, pose: 'sit' });
            pose('ithamar', 'stand');
            fl(b, { type: 'campEdge', dur: 7 });
          }],
        ]);
      },
    },

    // ── 14—15 活鸟放在田野里：得洁净的人回营 ───────────────────
    {
      kind: 'cmd', utter: '又把活鸟放在田野里', cmd: 'release 活鸟 --to 田野  # 定他为洁净', ref: '14:7',
      verse: [
        { text: '祭司要出到营外察看，若见他的大麻风痊愈了，', ref: '利未记 14:3', hold: 5 },
        { text: '……用以在那长大麻风求洁净的人身上洒七次，就定他为洁净，<br>又把活鸟放在田野里。', ref: '利未记 14:7', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.58, 24, b.instant);
            W.set('levHoly', 0.35);
            walk('eleazar', X.leper + 0.026, { speed: 0.042 });
            pose('leper', 'stand'); face('leper', 1);
            fl(b, { type: 'campEdge', dur: 8 });
          }],
          [6.3, b => { face('eleazar', -1); pose('eleazar', 'point'); fl(b, { type: 'sprinkle', from: 'eleazar', to: 'leper', dur: 4 }); sfx(b, 'splash', { soft: true }); }],
          [10.4, b => {
            pose('eleazar', 'raise');
            const h = headOf('eleazar', 1.05);
            if (h) fl(b, { type: 'bird', xf: h[0] / W.w, yf: h[1] / W.h, dur: 9 });
            sfx(b, 'wings'); sfx(b, 'dove');
            S.healed = 1;
            add('leper', { label: '得洁净的人', glow: 0.35 });
            if (!b.instant) { const hh = headOf('leper', 0.6); if (hh) fx().sparkle(hh[0], hh[1], 20, [230, 244, 255], 10, 'air'); }
          }],
          [13, b => {
            say(b, [{ text: '……然后可以进营，只是要在自己的帐棚外居住七天。', ref: '利未记 14:8', hold: 5.5 }]);
            pose('eleazar', 'stand');
            walk('leper', X.tentL2 + 0.004, { speed: 0.026, pose: 'sit' });
            walk('eleazar', X.altar + 0.026, { speed: 0.04 });
          }],
          [19.8, b => {
            say(b, [{ text: '「你们要这样使以色列人与他们的污秽隔绝，免得他们玷污我的帐幕，<br>就因自己的污秽死亡。」', ref: '利未记 15:31', hold: 6.5 }]);
            halo(b, PILLAR_X, gY(2, PILLAR_X), M() * 0.55, 3);
          }],
        ]);
      },
    },

    // ── 16—17 赎罪日：两只羊拈阄；香的烟云；这羊要担当他们一切的罪孽 ─────────
    {
      kind: 'cmd', utter: '这羊要担当他们一切的罪孽', cmd: 'mv 罪孽/* 羊/ && send 羊 --to 无人之地', ref: '16:22',
      verse: [
        { text: '为那两只羊拈阄，一阄归与耶和华，一阄归与阿撒泻勒。', ref: '利未记 16:8', hold: 5.5 },
        { text: '两手按在羊头上，承认以色列人诸般的罪孽过犯……<br>把这罪都归在羊的头上，藉着所派之人的手，送到旷野去。', ref: '利未记 16:21', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.745, 26, b.instant);
            W.set('levHoly', 0);
            dressAaron(2);
            if (!b.instant) { const h = headOf('aaron', 0.5); if (h) fx().sparkle(h[0], h[1], 16, [250, 248, 240], 12, 'air'); }
            walk('aaron', X.gate + 0.056, { speed: 0.03 });
            // 两只公山羊安置在会幕门口（16:7）：最靠前的一排，走在众人前面
            animal('goatA', 'goat', X.gate + 0.004, { label: '归与阿撒泻勒的羊', facing: 1, v: 0.46, from: b.instant ? 'none' : 'fade', col: [66, 56, 50] });
            animal('goatB', 'goat', X.gate + 0.03, { label: '归与耶和华的羊', facing: 1, v: 0.46, from: b.instant ? 'none' : 'fade', col: [206, 196, 180] });
            people('kneel', 1);
            sfx(b, 'goat');
          }],
          // 为那两只羊拈阄（16:8）
          [1.4, b => { face('aaron', -1); pose('aaron', 'point'); fl(b, { type: 'lots', dur: 4.2 }); sfx(b, 'chime'); }],
          // 归与耶和华的羊献为赎罪祭（16:9）；亚伦进入幔内，香的烟云遮掩施恩座（16:12–13）
          [4.2, b => {
            pose('aaron', 'stand');
            walk('eleazar', X.gate + 0.05, { speed: 0.04 });
            walk('aaron', X.tabL + 0.004, { speed: 0.036 });
          }],
          [5.6, () => { walk('eleazar', X.altar + 0.016, { speed: 0.03 }); U.safe('cast.follow', () => C().follow('goatB', 'eleazar', 0.026)); }],
          [7.4, b => { rm('aaron'); W.set('levIncense', 1, b.instant); }],
          [8.6, b => { rm('goatB'); W.set('levFire', 1.3); pose('eleazar', 'raise'); sfx(b, 'fire'); }],
          [9.8, b => {
            putAaron(X.tabL + 0.004, { from: b.instant ? 'none' : 'fade' });
            walk('aaron', X.gate + 0.032, { speed: 0.04 });
            W.set('levIncense', 0);
            pose('eleazar', 'stand'); W.set('levFire', 1.05);
          }],
          // 两手按在羊头上，承认一切的罪孽（16:21）
          [13.2, b => {
            face('aaron', -1); pose('aaron', 'bow');
            const src = [];
            CROWDS.forEach(g => crowdEach(g, m => { if (!m.dying) src.push(m); }));
            fl(b, { type: 'sins', src, dur: 4.5 });
            sfx(b, 'weep', { soft: true });
          }],
          [15, b => {
            add('sent', { label: '所派的人', sex: 'm', age: 'adult', x: X.gate + 0.05, facing: 1, robe: ROBE.sent, glow: 0.2, v: 0.46, from: b.instant ? 'none' : 'fade' });
          }],
          [15.6, b => say(b, [{ text: '要把这羊放在旷野，这羊要担当他们一切的罪孽，带到无人之地。', ref: '利未记 16:22', hold: 6.5 }])],
          // 藉着所派之人的手，送到旷野去：走在众人前面，向西没入落日
          [17.4, b => {
            pose('aaron', 'stand');
            walk('sent', 1.0, { speed: 0.03 });
            U.safe('cast.follow', () => C().follow('goatA', 'sent', 0.03));
            sfx(b, 'wind', { soft: true });
          }],
          [20, b => {
            people('raise', 1);
            fl(b, { type: 'sweep', x0: CAMP0 - 0.02, x1: 1.0, dur: 4 });
            W.set('levHoly', 0.5);
            sfx(b, 'chime');
          }],
          [22.2, b => say(b, [{ text: '因为活物的生命是在血中。我把这血赐给你们，<br>可以在坛上为你们的生命赎罪……', ref: '利未记 17:11', hold: 6 }])],
          [23, () => { people('stand'); dressAaron(1); }],
          [29, () => { rm('goatA'); rm('sent'); crowdMill('campL', true); crowdMill('campR', true); }],
        ]);
      },
    },

    // ── 18—20 要爱人如己：寄居的外人坐到营火旁 ───────────────────
    {
      kind: 'cmd', utter: '要爱人如己。我是耶和华', cmd: 'love(邻舍) === love(自己)  // 我是耶和华', ref: '19:18',
      verse: [
        { text: '所以，你们要守我的律例典章；人若遵行，就必因此活着。我是耶和华。', ref: '利未记 18:5', hold: 6 },
        { text: '不可报仇，也不可埋怨你本国的子民，却要爱人如己。我是耶和华。', ref: '利未记 19:18', hold: 6.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.82, 26, b.instant);
            W.set('levHoly', 0.2);
            W.set('levHearth', 1, b.instant);
            pose('offerer', 'stand'); pose('woman', 'stand'); pose('leper', 'stand');
            fl(b, { type: 'threads', ids: ['offerer', 'woman', 'leper', 'mother', 'moses'], dur: 24 });
            sfx(b, 'harp');
          }],
          [4.5, () => { walk('offerer', X.tentL2 + 0.018, { speed: 0.03 }); face('leper', 1); }],
          [7.6, () => { embrace('offerer', 'leper'); }],
          [13.8, b => {
            say(b, [{ text: '和你们同居的外人，你们要看他如本地人一样，并要爱他如己，<br>因为你们在埃及地也作过寄居的。我是耶和华你们的神。', ref: '利未记 19:34', hold: 7.5 }]);
            S.stranger = 1;
            add('stranger', { label: '寄居的外人', sex: 'm', age: 'adult', x: 0.37, facing: 1, robe: ROBE.stranger, hair: 'cloth', glow: 0.25, v: FORE, from: b.instant ? 'none' : 'fade' });
            walk('stranger', X.hearth - 0.016, { speed: 0.026 });
            walk('woman', X.hearth - 0.032, { speed: 0.02 });
          }],
          [18.4, () => { face('woman', 1); face('stranger', 1); pose('woman', 'point'); }],
          [20.2, () => {
            pose('woman', 'sit'); pose('stranger', 'sit');
            pose('offerer', 'stand');
            walk('offerer', X.hearth + 0.016, { speed: 0.02, pose: 'sit' }); walk('leper', X.hearth + 0.032, { speed: 0.02, pose: 'sit' });
          }],
          [21.4, () => { face('offerer', -1); face('leper', -1); }],
          [22.8, b => {
            say(b, [{ text: '你们要归我为圣，因为我耶和华是圣的，<br>并叫你们与万民有分别，使你们作我的民。', ref: '利未记 20:26', hold: 6.5 }]);
            halo(b, PILLAR_X, gY(2, PILLAR_X), M() * 0.7, 3.2);
            W.set('levHoly', 0.45);
          }],
        ]);
      },
    },

    // ── 21—22 我在以色列人中，却要被尊为圣：「圣」字成于云中 ─────
    {
      kind: 'promise', utter: '我在以色列人中，却要被尊为圣', cmd: 'hallow(名)  // 我是叫你们成圣的耶和华', ref: '22:32',
      verse: [
        { text: '要归神为圣，不可亵渎神的名……所以他们要成为圣。', ref: '利未记 21:6', hold: 5.5 },
        { text: '你们不可亵渎我的圣名；我在以色列人中，却要被尊为圣。我是叫你们成圣的耶和华，<br>把你们从埃及地领出来，作你们的神。我是耶和华。', ref: '利未记 22:32–33', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.93, 16, b.instant);
            walk('aaron', X.tabL - 0.014, { speed: 0.03 }); walk('eleazar', X.tabL - 0.036, { speed: 0.03 }); walk('ithamar', X.tabL - 0.058, { speed: 0.03 });
            walk('moses', X.gate + 0.02, { speed: 0.03 });
            fl(b, { type: 'crown', dur: 9 });
            W.set('levGlory', 0.8, b.instant);
          }],
          [1.6, b => {
            if (!b.instant) {
              const sz = Math.min(W.w * 0.2, W.h * 0.2), cx = PILLAR_X, cy = Math.max(W.h * (port() ? 0.36 : 0.2), pillarBase() - W.h * 0.3);
              const [nx, ny] = nameAt(cx, cy, sz);
              const src = () => [PILLAR_X * W.w + (Math.random() - 0.5) * 60, pillarBase() - Math.random() * W.h * 0.3];
              fx().name('圣', nx, ny, sz, [255, 232, 176], src, { hold: 6 });
            }
            sfx(b, 'angel');
          }],
          [3.6, () => { allPeople('bow', 1); ['aaron', 'eleazar', 'ithamar', 'moses'].forEach(id => { face(id, 1); pose(id, 'bow'); }); }],
          [12, () => { allPeople('stand'); ['aaron', 'eleazar', 'ithamar', 'moses'].forEach(id => pose(id, 'stand')); W.set('levGlory', 0.45); }],
        ]);
      },
    },

    // ── 23—24 住棚节：棕树的枝子、河旁的柳枝；灯常常点着（整夜）───────────
    {
      kind: 'cmd', utter: '你们要住在棚里七日', cmd: 'mkdir -p 棚/{1..7}  # 在耶和华面前欢乐七日', ref: '23:42',
      verse: [
        { text: '「在你们的地收割庄稼，不可割尽田角，也不可拾取所遗落的；<br>要留给穷人和寄居的。我是耶和华你们的神。」', ref: '利未记 23:22', hold: 6 },
        { text: '第一日要拿美好树上的果子和棕树上的枝子，与茂密树的枝条并河旁的柳枝，<br>在耶和华你们的神面前欢乐七日。', ref: '利未记 23:40', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.2, 26, b.instant);
            W.set('levHearth', 0);
            W.set('levGlean', 1, b.instant);
            ['offerer', 'woman', 'leper', 'stranger'].forEach(id => pose(id, 'stand'));
            crowdMill('campL', true); crowdMill('campR', true);
          }],
          // 田角留给穷人和寄居的：外人与那妇人弯腰拾取
          [1.4, () => { face('stranger', -1); face('woman', 1); pose('stranger', 'bow'); pose('woman', 'bow'); }],
          [5.8, () => { pose('stranger', 'stand'); pose('woman', 'stand'); }],
          [7, b => { W.set('levBooths', 1, b.instant); W.set('levGlean', 0); sfx(b, 'build'); sfx(b, 'wind', { soft: true }); }],
          [11, b => { people('raise'); sfx(b, 'crowd'); sfx(b, 'harp'); }],
          [14, b => {
            say(b, [{ text: '你们要住在棚里七日；凡以色列家的人都要住在棚里，<br>好叫你们世世代代知道，我领以色列人出埃及地的时候曾使他们住在棚里。', ref: '利未记 23:42–43', hold: 7 }]);
          }],
          [15.5, () => { people('sit'); ['offerer', 'woman', 'leper', 'stranger'].forEach(id => pose(id, 'sit')); }],
          [22.6, b => {
            say(b, [{ text: '「要吩咐以色列人，把那为点灯捣成的清橄榄油拿来给你，使灯常常点着。」', ref: '利未记 24:2', hold: 5.5 }]);
            W.set('levLamp', 1, b.instant);
            walk('aaron', X.tabL - 0.006, { speed: 0.02, pose: 'carry' });
            sfx(b, 'chime');
          }],
        ]);
      },
    },

    // ── 25 禧年：大发角声，在遍地宣告自由（黎明）─────────────────────────
    {
      kind: 'cmd', utter: '在遍地给一切的居民宣告自由', cmd: 'broadcast 自由 --to 遍地 --year 50  # 各归本家', ref: '25:10',
      verse: [
        { text: '当年七月初十日，你要大发角声；这日就是赎罪日，要在遍地发出角声。', ref: '利未记 25:9', hold: 6.5 },
        { text: '第五十年，你们要当作圣年，在遍地给一切的居民宣告自由。<br>这年必为你们的禧年，各人要归自己的产业，各归本家。', ref: '利未记 25:10', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.3, 14, b.instant);
            W.set('levBooths', 0, b.instant);
            W.set('levLamp', 0.4);
            people('stand');
            ['offerer', 'woman', 'leper', 'stranger'].forEach(id => pose(id, 'stand'));
            pose('aaron', 'stand');
            S.horns = 1;
            add('levi1', { label: '吹角的利未人', sex: 'm', age: 'adult', x: CAMP0 + 0.004, facing: -1, robe: ROBE.levite, hair: 'cloth', glow: 0.2, v: 0.1, from: b.instant ? 'none' : 'fade' });
            add('levi2', { label: '吹角的利未人', sex: 'm', age: 'adult', x: 0.955, facing: 1, robe: ROBE.levite, hair: 'cloth', glow: 0.2, v: 0.1, from: b.instant ? 'none' : 'fade' });
            walk('eleazar', X.gate - 0.006, { speed: 0.03, pose: 'gaze' }); walk('ithamar', X.courtR + 0.012, { speed: 0.03, pose: 'gaze' });
          }],
          [2.6, b => {
            ['levi1', 'levi2'].forEach(id => pose(id, 'gaze'));
            face('eleazar', -1); face('ithamar', 1);
            fl(b, { type: 'horns', ids: ['eleazar', 'ithamar', 'levi1', 'levi2'], dur: 11 });
          }],
          [3.8, b => blast(b, 0)],
          [6.2, b => blast(b, 1)],
          [8.6, b => blast(b, 2)],
          [9.8, b => {
            allPeople('raise');
            fl(b, { type: 'sweep', x0: CAMP0 - 0.02, x1: 1, dur: 5 }); fl(b, { type: 'sweep', x0: 0.5, x1: 1, l: 1, dur: 5 });
            W.set('levHoly', 0.7);
            sfx(b, 'crowd'); sfx(b, 'bird');
            W.setPop('bird', 44, W.w * 0.6, W.h * 0.3, b.instant);
          }],
          [13, () => {
            allPeople('stand');
            crowdMill('campL', true); crowdMill('campR', true);
            crowdWalk('campL', CAMP0, 0.54, { speed: 0.03 }); crowdWalk('campR', 0.86, 0.99, { speed: 0.03 });
            ['eleazar', 'ithamar', 'levi1', 'levi2'].forEach(id => pose(id, 'stand'));
            walk('offerer', HOME.offerer, { speed: 0.025 }); walk('woman', HOME.woman, { speed: 0.025 });
            walk('leper', X.tentL2 + 0.004, { speed: 0.025 }); walk('stranger', X.hearth, { speed: 0.025 });
          }],
          [16.6, b => {
            say(b, [{ text: '「地不可永卖，因为地是我的；你们在我面前是客旅，是寄居的。」', ref: '利未记 25:23', hold: 6.5 }]);
            walk('eleazar', X.altar + 0.026, { speed: 0.03 }); walk('ithamar', X.tabL - 0.036, { speed: 0.03 });
            rm('levi1'); rm('levi2');
            W.set('levHoly', 0.3);
          }],
        ]);
      },
    },

    // ── 26—27 时雨降下，旷野发青；我要在你们中间行走（黄昏）；西奈山的命令 ──
    {
      kind: 'promise', utter: '我要在你们中间行走', cmd: 'walk --among 你们  # 我要作你们的神', ref: '26:12',
      verse: [
        { text: '我就给你们降下时雨，叫地生出土产，田野的树木结果子。', ref: '利未记 26:4', hold: 6 },
        { text: '我要在你们中间立我的帐幕；我的心也不厌恶你们。<br>我要在你们中间行走；我要作你们的神，你们要作我的子民。', ref: '利未记 26:11–12', hold: 8 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('rain', 0.75, b.instant); W.set('storm', 0.22, b.instant); W.set('clouds', 0.75, b.instant);
            W.goTo(0.62, 9, b.instant);
            sfx(b, 'rain');
          }],
          [1.5, b => {
            S.green = 1;
            W.set('bare', 0.22, b.instant); W.set('bloom', 0.9, b.instant); W.set('herbs', 1, b.instant); W.set('trees', 0.12, b.instant);
          }],
          [6.4, b => { W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('clouds', 0.4, b.instant); W.goTo(0.772, 16, b.instant); }],
          [8, b => { W.set('levTents', 1, b.instant); W.set('levGlory', 0.85, b.instant); people('stand'); sfx(b, 'angel', { soft: true }); }],
          [11, () => { allPeople('gaze'); }],
          [15.4, b => {
            say(b, [{ text: '地上所有的，无论是地上的种子是树上的果子，<br>十分之一是耶和华的，是归给耶和华为圣的。', ref: '利未记 27:30', hold: 6.5 }]);
          }],
          [21, () => { allPeople('stand'); W.set('levGlory', 0.7); }],
          [22.8, b => say(b, [{ text: '这就是耶和华在西奈山为以色列人所吩咐摩西的命令。', ref: '利未记 27:34', hold: 7 }])],
          [23, () => { face('moses', -1); pose('moses', 'raise'); }],
        ]);
      },
    },
  ];

  // 禧年的角声：三次，一次比一次远——声音化作贴着大地荡开的柔和光环
  function blast(b, i) {
    if (b.instant) return;
    const pts = [];
    for (const id of ['eleazar', 'ithamar', 'levi1', 'levi2']) { const h = headOf(id, 0.9); if (h) pts.push([h[0] / W.w, h[1] / W.h]); }
    fl(b, { type: 'waves', pts, R: 0.16 + 0.07 * i, dur: 3.6 });
    sfx(b, 'horn'); sfx(b, 'wind', { soft: true });
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '利未记', books: [3], title: '圣洁', sub: '利未记 1 — 27', tint: [255, 226, 180], music: 'abraham',
    intro: [{ text: '日间，耶和华的云彩是在帐幕以上；夜间，云中有火，<br>在以色列全家的眼前。在他们所行的路上都是这样。', ref: '出埃及记 40:38', hold: 7.5 }],
    outro: 18,
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '摩西': { text: '摩西就照耶和华所吩咐的行了；于是会众聚集在会幕门口。', ref: '利未记 8:4' },
      '亚伦': { text: '亚伦向百姓举手，为他们祝福。他献了赎罪祭、燔祭、平安祭就下来了。', ref: '利未记 9:22' },
      '以利亚撒': { text: '摩西带了亚伦的儿子来，给他们穿上内袍，束上腰带，包上裹头巾，<br>都是照耶和华所吩咐摩西的。', ref: '利未记 8:13' },
      '以他玛': { text: '摩西带了亚伦的儿子来，给他们穿上内袍，束上腰带，包上裹头巾，<br>都是照耶和华所吩咐摩西的。', ref: '利未记 8:13' },
      '献祭的人': { text: '他要按手在燔祭牲的头上，燔祭便蒙悦纳，为他赎罪。', ref: '利未记 1:4' },
      '他的妻子': { text: '若有人献素祭为供物给耶和华，要用细面浇上油，加上乳香，', ref: '利未记 2:1' },
      '生育的妇人': { text: '她的力量若不够献一只羊羔，她就要取两只斑鸠或是两只雏鸽……<br>祭司要为她赎罪，她就洁净了。', ref: '利未记 12:8' },
      '得洁净的人': { text: '……用以在那长大麻风求洁净的人身上洒七次，就定他为洁净，<br>又把活鸟放在田野里。', ref: '利未记 14:7' },
      '寄居的外人': { text: '和你们同居的外人，你们要看他如本地人一样，并要爱他如己，<br>因为你们在埃及地也作过寄居的。我是耶和华你们的神。', ref: '利未记 19:34' },
      '以色列人': { text: '你晓谕以色列全会众说：你们要圣洁，因为我耶和华你们的神是圣洁的。', ref: '利未记 19:2' },
      '羊群': { text: '凡牛群羊群中，一切从杖下经过的，每第十只要归给耶和华为圣。', ref: '利未记 27:32' },
      '会幕': { text: '我要在你们中间立我的帐幕；我的心也不厌恶你们。', ref: '利未记 26:11' },
      '燔祭坛': { text: '在坛上必有常常烧着的火，不可熄灭。', ref: '利未记 6:13' },
      '洗濯盆': { text: '摩西带了亚伦和他儿子来，用水洗了他们。', ref: '利未记 8:6' },
      '院子': { text: '在帐幕和坛的四围立了院帷，把院子的门帘挂上。这样，摩西就完了工。', ref: '出埃及记 40:33' },
      '云柱': { text: '……因为我要从云中显现在施恩座上。', ref: '利未记 16:2' },
      '西奈山': { text: '这些律例、典章，和法度是耶和华与以色列人在西奈山藉着摩西立的。', ref: '利未记 26:46' },
      '帐棚': { text: '我要赐平安在你们的地上；你们躺卧，无人惊吓。', ref: '利未记 26:6' },
      '摩西的帐棚': { text: '七天你们要昼夜住在会幕门口，遵守耶和华的吩咐……', ref: '利未记 8:35' },
      '棚': { text: '你们要住在棚里七日；凡以色列家的人都要住在棚里，', ref: '利未记 23:42' },
      '营火': { text: '不可报仇，也不可埋怨你本国的子民，却要爱人如己。我是耶和华。', ref: '利未记 19:18' },
    },
  });
})(window.GS);
