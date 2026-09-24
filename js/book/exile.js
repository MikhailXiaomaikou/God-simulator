/* ─────────────────────────────────────────────────────────────
 * book/exile.js —— 列王纪下 · 亡国（列王纪下 14 — 25）
 *
 * 两国的灯：北方以色列的城邑（中丘上的撒马利亚、远山上的众城）与南方犹大的耶路撒冷（近地：
 * 城墙、王宫、亚哈斯的台阶、山上的殿），王宫之上一盏小小的「大卫的灯」（8:19）。
 * 耶户的四代如四朵小火，第四朵熄了，「这话果然应验了」；加利利的灯先暗（15:29）。
 * 亚哈斯照大马士革的样式筑坛，邱坛的烟布满山冈；众先知劝戒，百姓转过身去。
 * 夜里亚述的营火围住撒马利亚——北国的灯一盏一盏熄灭，被掳的人往东去了，只剩下犹大（17:18，第一幅大画）。
 * 希西家废去邱坛、打碎铜蛇；亚述大军扎营城前，拉伯沙基喊话；书信在耶和华面前展开，光罩住这城；
 * 当夜，耶和华的使者走过亚述营，营火一处一处熄灭（19:35，第二幅大画）。
 * 希西家病得要死，转脸朝墙；「我听见了你的祷告」；亚哈斯的日晷——日影往后退了十度（20:11，第三幅大画）。
 * 玛拿西为天上的万象筑坛，殿中的光暗了；量撒马利亚的准绳拉在耶路撒冷上。
 * 约西亚：修殿时得了律法书，王撕裂衣服；柱旁立约，汲沦溪旁焚烧偶像，家家有灯；然而怒气仍不止息。
 * 迦勒底人来了：约雅斤出城投降，大卫的灯随他往东去，成了远处一点余烬。
 * 夜里城被攻破，火焚烧耶和华的殿和王宫，城墙倒塌，百姓被掳（25:9–11，本卷的签名，庄严、抽象）；
 * 最穷的人留下修理葡萄园。三十七年后，巴比伦的门前，那点余烬重新亮起：约雅斤抬头出监，脱了囚服，
 * 坐在王的席上——一盏小小的灯（25:27–30）。
 *
 * 画面的方位：近地右 = 耶路撒冷；近地左 = 城前的平原（亚述营、迦勒底营、汲沦溪、往东去的路、巴比伦的门）；
 *            中丘 = 撒马利亚；远山 = 北方的众城。东在左边（日出之处），被掳的人都往左去。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'exile';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时直接到位）────────────────
  const LV = {
    exNorth: ['lin', 0.055],   // 北国诸城的灯：1 全亮 → 0 全暗（加利利先暗 15:29，撒马利亚最后 17:6）
    exGen: ['lin', 0.9],       // 耶户的子孙：天上几朵小火（15:12）
    exCrown: ['exp', 0.6],     // 四代之火的显隐
    exHigh: ['exp', 0.35],     // 邱坛上的烟（14:4；16:4；18:4 废去；21:3 重建；23:8 污秽）
    exAltar: ['exp', 0.4],     // 亚哈斯照大马士革的样式所筑的坛（16:11）
    exSiege: ['exp', 0.4],     // 亚述围困撒马利亚的营火（17:5）
    exAssyr: ['exp', 0.4],     // 亚述大军扎营在城前的平原（18:17）
    exSweep: ['lin', 0.13],    // 当夜：使者走过亚述营（0 → 1），营火一处一处熄灭（19:35）
    exLetter: ['exp', 0.6],    // 在耶和华面前展开的书信（19:14）
    exDome: ['exp', 0.35],     // 保护这城的光（19:34）
    exBed: ['exp', 0.8],       // 希西家的病榻（20:1）
    exShadow: ['lin', 2.4],    // 亚哈斯日晷上的日影（以"度"计：自顶往下盖住几级，0 … 20）
    exHalo: ['exp', 0.5],      // 日头周围的光环（20:11）
    exGold: ['exp', 0.6],      // 宝库的金银给巴比伦的使者看（20:13）
    exIdol: ['exp', 0.35],     // 殿的两院中为天上万象所筑的坛、殿内的亚舍拉像（21:3–7）
    exGlory: ['exp', 0.4],     // 殿中的光
    exLine: ['exp', 0.35],     // 撒马利亚的准绳、亚哈家的线铊（21:13）
    exRepair: ['exp', 0.5],    // 修理殿的架子（22:5–6）
    exKidron: ['exp', 0.4],    // 汲沦溪旁焚烧偶像的器皿（23:4）
    exCov: ['exp', 0.6],       // 王站在柱旁立约（23:3）
    exPass: ['exp', 0.35],     // 家家有灯（23:21–23）
    exBab: ['exp', 0.35],      // 迦勒底人的营（24:10；25:1）
    exMound: ['exp', 0.25],    // 四围筑垒（25:1）
    exFamine: ['exp', 0.3],    // 城里的大饥荒（25:3）：灯渐稀
    exBreach: ['exp', 0.6],    // 城被攻破（25:4）
    exBurn: ['exp', 0.26],     // 火焚烧殿、王宫、房屋（25:9）
    exWalls: ['lin', 0.1],     // 拆毁四围的城墙（25:10）
    exRuin: ['lin', 0.14],     // 坍塌、焦黑、余烟
    exVines: ['lin', 0.07],    // 民中最穷的，修理葡萄园（25:12）
    exBabel: ['exp', 0.3],     // 巴比伦王宫的门墙（25:27）
    exLamp: ['exp', 0.5],      // 大卫的灯（8:19）
    exTable: ['exp', 0.5],     // 王的席（25:29）
  };
  for (const k in LV) W.defineLevel(k, LV[k][0], LV[k][1]);

  // ── 地上的位置（画面宽度的比例）─────────────────────────────
  const X = {
    // 耶路撒冷（近地）：王宫是城的西北角（左），城墙自王宫向右
    w0: 0.748, w1: 0.978,
    st1: 0.676, stV: 0.2,                          // 亚哈斯的台阶（日晷）：自城外的地升到王宫楼顶（亚哈斯的楼）
    pal0: 0.672, pal1: 0.748, palC: 0.71,           // 王宫
    dam: 0.776, alt: 0.796,                         // 大马士革样式的坛、铜坛（燔祭坛）
    tem0: 0.812, tem1: 0.884, por0: 0.826, por1: 0.864, door0: 0.839, door1: 0.851, pil: [0.8305, 0.8595], temC: 0.845,
    serp: 0.905,                                    // 铜蛇
    idols: [0.807, 0.819, 0.87, 0.883],             // 为天上万象所筑的坛（殿的两院中，21:5）
    // 城前的平原（近地左）
    plain0: 0.462, plain1: 0.572, kidron: 0.515, east: 0.44,
    bab0: 0.462, bab1: 0.618, babC: 0.54, table: 0.582,   // 巴比伦的门墙与王的席（25:27–30）
    // 中丘 / 远山
    sam: 0.566,
  };
  const ROBE = {
    king: [124, 90, 150], hez: [126, 88, 146], jos: [92, 104, 158], man: [138, 70, 88], jeh: [120, 80, 128], zed: [110, 84, 110],
    prison: [104, 100, 94], freed: [236, 228, 206], isaiah: [150, 130, 100], priest: [236, 230, 212], scribe: [136, 116, 88],
    huldah: [152, 100, 92], mom: [148, 100, 120], prophet: [142, 124, 98], envoy: [70, 96, 150], rab: [150, 64, 50],
    assyr: [126, 72, 54], bab: [56, 70, 118], nebu: [44, 54, 100], evil: [64, 84, 150], work: [150, 120, 88],
  };
  const GOLD = [236, 196, 104], BRONZE = [184, 122, 62], STONE = [218, 200, 164], STONE_S = [158, 138, 110], CHAR = [72, 58, 50];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { lamp: 'palace', serpent: 'whole', scroll: null, gen4: false, table: false };
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
  const vK = v => 1 + 0.35 * v;

  // 确定性的随机表（只用于形状，不用于状态）
  const RT = [];
  (function () { const r = U.mulberry32(2512); for (let i = 0; i < 2048; i++) RT.push(r()); })();
  const rt = i => RT[((i % 2048) + 2048) % 2048];

  // ── 人物（皆经人物模块）──────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  const hasCrowd = gid => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(gid)); };
  function add(id, o) { return C().add(id, o); }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (fig(id)) C().pose(id, p, o); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function glow(id, v) { if (fig(id)) C().glow(id, v); }
  function rm(id, now) { if (fig(id)) C().remove(id, now ? { fade: false } : undefined); }
  function follow(id, other, dx) { const c = C(); if (c.follow && fig(id)) c.follow(id, other, dx); }
  function animal(id, kind, x, o) { const c = C(); if (!c.animal) return null; return U.safe('cast.animal', () => c.animal(id, Object.assign({ kind, x, layer: 2 }, o || {}))); }
  function crowd(gid, o) { const c = C(); if (c.crowd) return c.crowd(gid, o); return null; }
  function crowdWalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function crowdPose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function uncrowd(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function crowdFace(gid, d) { const c = C(); if (!c.crowds || !c.crowds.get) return; const g = c.crowds.get(gid); if (g) g.members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
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
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function figPt(id, frac) {
    const f = fig(id);
    if (!f) return null;
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * frac];
    const l = f.layer == null ? 2 : f.layer;
    const x = f.nx * W.w, g = gY(l, f.nx);
    const fh = l === 2 ? Math.max(0, W.h - g) : Math.max(0, W.waterlineY(l) - g);
    const y = f.ny != null ? f.ny * W.h : g + (f.v || 0) * fh * 0.8;
    return [x, y - PH(l) * (f.age === 'elder' ? 0.96 : 1) * vK(f.v || 0) * frac];
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.12, dur || 1.8, 1.4); }
  function sparkAt(b, x, y, n, rgb, spread, pass) { if (!b.instant && fx()) fx().sparkle(x, y, n || 20, rgb || [255, 236, 190], spread || 10, pass || 'near'); }
  function dustAt(b, x, y, n, rgb, spread) { if (!b.instant && fx()) fx().dust(x, y, n || 20, rgb || [200, 180, 150], spread || 14, 'near'); }
  function ringFig(b, id, rgb, k) { const p = figPt(id, 0.55); if (p) ringAt(b, p[0], p[1], rgb, PH(2) * (k || 2.2), 2); }
  // 一行字在某处聚成（言语、名字）
  function wordsAt(b, str, x, y, rgb, o) {
    if (b.instant || !fx()) return;
    o = o || {};
    const n = Array.from(str).length;
    const size = Math.min((o.size || 0.03) * M(), (W.w * 0.44) / Math.max(1, n * 1.08));
    const half = (size * 1.08 * (n - 1)) / 2 + size * 0.6;
    const cx = clamp(x, half + 8, W.w - half - 8), cy = clamp(y, size + 8, W.h - size);
    const src = o.src || (() => [x + (Math.random() - 0.5) * 60 * SU(), y + 30 * SU() * Math.random()]);
    fx().nameStr(str, cx, cy, size, rgb, src, { hold: o.hold || 2.4, delay: o.delay, dark: o.dark });
  }

  // ════════════════════════════════════════════════════════════
  //  精灵图（离屏预绘的柔光）
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
      warm: radial([255, 172, 92], 1), gold: radial([255, 226, 160], 1), white: radial([240, 244, 255], 1),
      pale: radial([226, 236, 255], 1), smoke: radial([112, 104, 100], 0.8, 0.55), ember: radial([255, 110, 44], 1, 0.4),
      violet: radial([196, 170, 255], 1), red: radial([230, 56, 44], 1), dust: radial([176, 150, 118], 0.85, 0.55),
      dark: radial([10, 8, 8], 0.9, 0.5), smokeLit: radial([176, 104, 66], 0.8, 0.55),
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
    if (!(a > 0.004) || !(r > 0.5)) return;
    const a0 = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(sp, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a0;
  }

  // ── 火、烟、灯 ────────────────────────────────────────────────
  const FL = [[0, 1, 'rgb(255,112,40)', 0.75], [-0.26, 0.68, 'rgb(255,160,64)', 0.75], [0.24, 0.72, 'rgb(255,140,56)', 0.7], [0, 0.52, 'rgb(255,238,176)', 0.9]];
  function flame(ctx, x, y, h, k, seed, noGlow) {
    if (k < 0.01 || h < 0.5) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    const f = 0.82 + 0.12 * Math.sin(W.t * 13 + seed) + 0.08 * Math.sin(W.t * 23.7 + seed * 2);
    if (!noGlow) glowSp(ctx, SP.warm, x, y - h * 0.45, h * 2.1, k * (0.3 + 0.45 * nightK()));
    for (let i = 0; i < 4; i++) {
      const q = FL[i];
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
  function smoke(ctx, x, y, k, H, w, seed, dark, lit) {
    if (k < 0.01) return;
    SP || sprites();
    const N = 9, day = lit ? Math.max(0.3 + 0.7 * W.daylight, lit) : 0.3 + 0.7 * W.daylight;
    const sp = lit && nightK() > 0.2 ? SP.smokeLit : SP.smoke;
    for (let i = 0; i < N; i++) {
      const ph = U.fract(W.t * 0.07 + i / N + seed * 0.37);
      const drift = (W.wind * 0.6 + 0.35) * ph * ph * H * 0.45 + Math.sin(W.t * 0.7 + i * 1.7 + seed) * w * 0.35 * ph;
      const s = w * (0.6 + ph * 2.8);
      const a = k * Math.min(1, ph * 6) * (1 - ph) * (dark ? 0.55 : 0.4) * day;
      if (a < 0.004) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(sp, x + drift - s, y - ph * H - s, s * 2, s * 2);
    }
    ctx.globalAlpha = 1;
  }
  // 一缕细烟（邱坛上烧香）
  function wisp(ctx, x, y, k, H, w, seed, rgb) {
    if (k < 0.01) return;
    const day = 0.35 + 0.65 * W.daylight;
    ctx.strokeStyle = U.rgba(rgb[0], rgb[1], rgb[2], 0.34 * k * day);
    ctx.lineWidth = Math.max(0.8, w);
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const u = i / 10, yy = y - u * H;
      const xx = x + Math.sin(u * 5 + W.t * 0.9 + seed) * w * 1.6 * u + (W.wind * 0.5 + 0.3) * u * u * H * 0.35;
      if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
    }
    ctx.stroke();
  }

  // ════════════════════════════════════════════════════════════
  //  耶路撒冷：房屋、王宫、亚哈斯的台阶、殿、城墙（近地）
  // ════════════════════════════════════════════════════════════
  const CITY = (() => {
    const r = U.mulberry32(7125);
    const houses = [];
    const N = 20;
    const TONES = [[214, 194, 158], [206, 184, 150], [222, 204, 170], [198, 180, 150], [212, 188, 160]];
    for (let i = 0; i < N; i++) {
      const x = lerp(0.694, 0.972, (i + 0.5) / N) + (r() - 0.5) * 0.008;
      houses.push({ x, w: 0.013 + 0.011 * r(), h: 1.35 + 0.8 * r(), win: r() < 0.85, win2: r() < 0.45, tw: r() * 6, dome: r() < 0.14, k: r(), j: r(), tone: TONES[i % TONES.length] });
    }
    const NS = 12, segs = [];
    for (let i = 0; i < NS; i++) segs.push({ tower: i === 0 || i % 4 === 3 || i === NS - 1, fall: 0.03 + 0.86 * r(), h: 0.95 + 0.1 * r(), lean: r() < 0.5 ? -1 : 1 });
    const rub = [];
    for (let i = 0; i < 90; i++) rub.push([r(), r(), r()]);
    // 城中的柏树（给石城一点绿）
    const trees = [[0.772, 1.9], [0.899, 2.3], [0.957, 2.0], [0.935, 1.6]];
    return { houses, NS, segs, rub, trees, gate: 1, breach: 2 };
  })();
  const segX = i => lerp(X.w0, X.w1, i / CITY.NS);
  function segFall(i) {
    const sg = CITY.segs[i];
    let f = clamp((W.lv.exWalls - sg.fall) * 6, 0, 1);
    if (i === CITY.breach) f = Math.max(f, W.lv.exBreach * 0.9);
    return f;
  }
  const burnK = () => clamp(W.lv.exBurn, 0, 1);
  // 夜里的石城：月光与灯火把城墙照出来（故事里的人与城要看得见）
  const moonL = () => (0.2 + 0.2 * W.lv.exBurn) * nightK() * (1 - 0.6 * W.lv.gloom);
  const ruinK = () => clamp(W.lv.exRuin, 0, 1);
  const litRight = xpx => litX() >= xpx;
  // 窗里的灯：夜深，饥荒时稀少，逾越节时家家都亮
  function winK(seed) {
    const nk = nightK();
    const pass = W.lv.exPass, fam = W.lv.exFamine;
    let k = nk * (0.55 + 0.35 * Math.sin(W.t * 0.8 + seed * 6)) * (1 - fam * (seed < 0.8 ? 1 : 0.6));
    k = Math.max(k, pass * (0.55 + 0.4 * nk) * (0.8 + 0.2 * Math.sin(W.t * 1.3 + seed * 9)));
    return k * (1 - burnK()) * (1 - ruinK());
  }

  function drawHouses(ctx, ph) {
    const burn = burnK(), ruin = ruinK(), cm = clamp(burn * 0.55 + ruin * 0.45, 0, 1), ml = moonL();
    const side = U.mixRGB([150, 130, 104], CHAR, clamp(burn * 0.6 + ruin * 0.4, 0, 1));
    const boxes = [];
    // 按色调分批（五种石色）
    for (let tone = 0; tone < 5; tone++) {
    ctx.fillStyle = css(U.mixRGB(CITY.houses[tone].tone, CHAR, cm), 2, 1, ml);
    ctx.beginPath();
    for (let hi = tone; hi < CITY.houses.length; hi += 5) {
      const h = CITY.houses[hi];
      const x = h.x * W.w, w = h.w * W.w, g = gY(2, h.x) + 1;
      const H = h.h * ph * (1 - ruin * (0.5 + 0.35 * h.k));
      if (ruin > 0.15) {
        const j = h.j;
        ctx.moveTo(x - w / 2, g); ctx.lineTo(x - w / 2, g - H * (0.75 + 0.25 * j)); ctx.lineTo(x - w * 0.1, g - H);
        ctx.lineTo(x + w * 0.12, g - H * 0.7); ctx.lineTo(x + w / 2, g - H * (0.95 - 0.4 * j)); ctx.lineTo(x + w / 2, g); ctx.closePath();
      } else {
        ctx.rect(x - w / 2, g - H, w, H);
        if (h.dome) { ctx.moveTo(x + w * 0.34, g - H); ctx.ellipse(x, g - H, w * 0.34, w * 0.3, 0, Math.PI, TAU); }
      }
      boxes.push([x, g, H, w, h]);
    }
    ctx.fill();
    }
    ctx.fillStyle = css(side, 2, 0.9, ml * 0.6);
    ctx.beginPath();
    for (const q of boxes) { const lr = litRight(q[0]); ctx.rect(lr ? q[0] - q[3] / 2 : q[0] + q[3] * 0.2, q[1] - q[2], q[3] * 0.3, q[2]); }
    ctx.fill();
    // 迎光的屋顶
    if (ruin < 0.5) {
      ctx.strokeStyle = css([255, 236, 200], 2, 0.35 * dayA() * (1 - ruin), 0.25);
      ctx.lineWidth = Math.max(0.6, 0.8 * LS(2));
      ctx.beginPath();
      for (const q of boxes) { ctx.moveTo(q[0] - q[3] / 2, q[1] - q[2]); ctx.lineTo(q[0] + q[3] / 2, q[1] - q[2]); }
      ctx.stroke();
    }
    return boxes;
  }
  function drawHouseLights(ctx, boxes, ph) {
    const ws = Math.max(1.2, 0.07 * ph);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,184,104)';
    for (const q of boxes) {
      const h = q[4];
      if (!h.win) continue;
      const k = winK(h.k);
      if (k < 0.02) continue;
      ctx.globalAlpha = Math.min(1, k);
      ctx.fillRect(q[0] - ws / 2, q[1] - q[2] * 0.84, ws, ws * 1.4);
      if (h.win2) ctx.fillRect(q[0] - ws / 2 + q[3] * 0.25, q[1] - q[2] * 0.7, ws, ws * 1.4);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 城中的柏树
  function drawTrees(ctx, ph) {
    const burn = burnK(), ruin = ruinK();
    if (ruin > 0.95) return;
    const col = U.mixRGB([52, 84, 58], [34, 28, 26], clamp(burn * 0.8 + ruin, 0, 1));
    ctx.fillStyle = css(col, 2, 1, moonL() * 0.5);
    ctx.beginPath();
    for (const t of CITY.trees) {
      const x = t[0] * W.w, g = gY(2, t[0]) + 1, H = t[1] * ph * (1 - ruin * 0.8), w = 0.2 * ph;
      ctx.moveTo(x - w * 0.15, g); ctx.lineTo(x - w * 0.15, g - H * 0.12);
      ctx.quadraticCurveTo(x - w, g - H * 0.45, x, g - H); ctx.quadraticCurveTo(x + w, g - H * 0.45, x + w * 0.15, g - H * 0.12);
      ctx.lineTo(x + w * 0.15, g); ctx.closePath();
    }
    ctx.fill();
  }

  // ── 王宫（与亚哈斯的楼）：城的西北角 ─────────────────────────
  function palGeo(ph) {
    const g = Math.min(gY(2, X.pal0), gY(2, X.pal1)) + 1;
    const H = 2.0 * ph * (1 - ruinK() * 0.62), up = 0.72 * ph * (1 - ruinK() * 0.9);
    return { g, H, up, x0: X.pal0 * W.w, x1: X.pal1 * W.w, ux0: X.pal0 * W.w, ux1: (X.pal0 + 0.026) * W.w };
  }
  function drawPalace(ctx, ph) {
    const P = palGeo(ph), burn = burnK(), ruin = ruinK(), s = LS(2), ml = moonL();
    const col = U.mixRGB([222, 204, 168], CHAR, clamp(burn * 0.6 + ruin * 0.4, 0, 1));
    const sh = U.mixRGB([160, 140, 112], CHAR, clamp(burn * 0.6 + ruin * 0.4, 0, 1));
    const top = P.g - P.H;
    ctx.fillStyle = css(col, 2, 1, ml);
    ctx.beginPath();
    if (ruin > 0.15) {
      const n = 9;
      ctx.moveTo(P.x0, P.g);
      for (let i = 0; i <= n; i++) ctx.lineTo(lerp(P.x0, P.x1, i / n), top - (i % 2 ? 0.25 : -0.12) * ph * (1 - ruin * 0.5) * (0.6 + rt(i + 40)));
      ctx.lineTo(P.x1, P.g);
      ctx.closePath();
    } else {
      ctx.rect(P.x0, top, P.x1 - P.x0, P.H);
      ctx.rect(P.ux0, top - P.up, P.ux1 - P.ux0, P.up);           // 亚哈斯的楼（23:12）
      // 角楼的垛口
      const n = 8, mw = (P.x1 - P.x0) / (n * 2);
      for (let k = 0; k < n; k++) { const mx = P.x0 + mw * (2 * k + 0.5); if (mx < P.ux1) continue; ctx.rect(mx, top - 3 * s, mw, 3 * s); }
    }
    ctx.fill();
    // 背光的一面、柱廊
    ctx.fillStyle = css(sh, 2, 0.85, ml * 0.6);
    const lr = litRight((P.x0 + P.x1) / 2);
    ctx.fillRect(lr ? P.x0 : P.x1 - (P.x1 - P.x0) * 0.14, top, (P.x1 - P.x0) * 0.14, P.H);
    if (ruin < 0.3) {
      ctx.fillStyle = css([118, 98, 76], 2, 0.9 * (1 - ruin), ml * 0.5);
      const n = 6, cw = (P.x1 - P.x0) / (n * 2 + 1);
      for (let i = 0; i < n; i++) ctx.fillRect(P.x0 + cw * (2 * i + 1.3), top + P.H * 0.46, cw * 0.55, P.H * 0.46);
      // 檐
      ctx.fillStyle = css(col, 2, 1, 0.12 + ml);
      ctx.fillRect(P.x0 - 2 * s, top + P.H * 0.4, P.x1 - P.x0 + 4 * s, 2.2 * s);
      // 迎光的边
      ctx.strokeStyle = css([255, 234, 196], 2, 0.45 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath(); ctx.moveTo(P.ux1, top); ctx.lineTo(P.x1, top); ctx.moveTo(P.ux0, top - P.up); ctx.lineTo(P.ux1, top - P.up); ctx.stroke();
      // 亚哈斯楼顶上的日晷之柱
      const gx = (P.ux0 + P.ux1) / 2, gy = top - P.up, gh = 0.72 * ph, gw = 0.07 * ph;
      ctx.fillStyle = css([230, 216, 184], 2, 1, ml);
      ctx.beginPath(); ctx.moveTo(gx - gw, gy); ctx.lineTo(gx - gw * 0.4, gy - gh); ctx.lineTo(gx, gy - gh - gw * 1.4); ctx.lineTo(gx + gw * 0.4, gy - gh); ctx.lineTo(gx + gw, gy); ctx.closePath(); ctx.fill();
      // 灯台（大卫的灯安在其上）
      const lx = (X.pal1 - 0.012) * W.w;
      ctx.fillStyle = css([150, 110, 74], 2, 1, ml);
      ctx.fillRect(lx - 0.03 * ph, top - 0.3 * ph, 0.06 * ph, 0.3 * ph);
      ctx.fillRect(lx - 0.1 * ph, top - 0.04 * ph, 0.2 * ph, 0.04 * ph);
    }
    // 夜里的窗
    const k = winK(0.33);
    if (k > 0.02 && ruin < 0.3) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgb(255,186,106)';
      const n = 5, cw = (P.x1 - P.x0) / (n * 2 + 1);
      for (let i = 0; i < n; i++) { ctx.globalAlpha = Math.min(1, k * (0.6 + 0.4 * rt(i + 70))); ctx.fillRect(P.x0 + cw * (2 * i + 1.2), top + P.H * 0.14, cw * 0.7, P.H * 0.14); }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    return P;
  }

  // ── 亚哈斯的台阶：日晷（20:9–11）——自城外的地升到亚哈斯的楼顶 ──────
  const STEPS = 20;
  function stairGeo(ph) {
    const P = palGeo(ph);
    const x1 = X.st1 * W.w, y1 = P.g - P.H - P.up;
    const x0 = x1 - Math.max(0.085 * W.w, 1.6 * ph), y0 = fieldY(x0 / W.w, X.stV);
    return { x0, y0, x1, y1, dx: (x1 - x0) / STEPS, dy: (y0 - y1) / STEPS, g: P.g };
  }
  function stairPath(G) {
    const p = new Path2D();
    p.moveTo(G.x0, G.y0);
    for (let i = 0; i < STEPS; i++) { const x = G.x0 + i * G.dx, y = G.y0 - (i + 1) * G.dy; p.lineTo(x, y); p.lineTo(x + G.dx, y); }
    p.lineTo(G.x1 + 1, G.y1); p.lineTo(G.x1 + 1, Math.max(G.g, G.y0) + 2); p.lineTo(G.x0, G.y0 + 2);
    p.closePath();
    return p;
  }
  function drawStair(ctx, ph) {
    const ruin = ruinK();
    if (ruin > 0.98) return;
    const G = stairGeo(ph), s = LS(2), a = 1 - smoothstep(0.5, 1, ruin), ml = moonL();
    const path = stairPath(G);
    ctx.globalAlpha = a;
    const col = U.mixRGB([222, 204, 170], CHAR, clamp(burnK() * 0.4 + ruin * 0.5, 0, 1));
    // 台阶的侧面（稍暗）与一级一级的刻度（「度」）
    ctx.fillStyle = css(U.mixRGB(col, [128, 110, 88], 0.4), 2, 1, ml);
    ctx.fill(path);
    ctx.strokeStyle = css([96, 80, 64], 2, 0.5, ml * 0.5); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath();
    for (let i = 1; i < STEPS; i++) { const x = G.x0 + i * G.dx, y = G.y0 - i * G.dy; ctx.moveTo(x, y + 0.5); ctx.lineTo(x, y + Math.min(G.dy * 1.6, 5 * s)); }
    ctx.stroke();
    // 踏面（受光）
    ctx.fillStyle = css(col, 2, 1, 0.1 + ml);
    ctx.beginPath();
    const th = Math.max(1.2, G.dy * 0.38);
    for (let i = 0; i < STEPS; i++) { const x = G.x0 + i * G.dx, y = G.y0 - (i + 1) * G.dy; ctx.rect(x, y, G.dx + 0.6, th); }
    ctx.fill();
    // 日影：自顶往下盖住 n 级（柱在楼顶，日在西，影落在台阶上）
    const n = clamp(W.lv.exShadow, 0, STEPS), day = W.daylight * (1 - W.lv.gloom);
    const xs = G.x0 + (STEPS - n) * G.dx, ys = G.y0 - (STEPS - n) * G.dy;
    if (n > 0.01 && day > 0.05) {
      ctx.save();
      ctx.clip(path);
      ctx.fillStyle = U.rgba(24, 18, 34, 0.58 * day);
      ctx.beginPath();
      // 影的边是一道斜线（柱影的边缘）
      ctx.moveTo(xs, ys - G.dy * 3); ctx.lineTo(xs - G.dx * 0.6, ys + G.dy * 3); ctx.lineTo(G.x1 + 4, G.y0 + 8); ctx.lineTo(G.x1 + 4, G.y1 - 8); ctx.closePath();
      ctx.fill();
      ctx.restore();
      // 影的尖端上一点暖光（夕照落在第一级不在影里的台阶上）
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, xs - G.dx * 0.5, ys, Math.max(G.dy, G.dx) * 2.6, 0.4 * day * a);
      ctx.globalCompositeOperation = 'source-over';
    }
    // 日影退回的那十级：一级一级亮起（20:11）
    const hk = W.lv.exHalo;
    if (hk > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = STEPS - 16; i < STEPS - 6; i++) {
        if (i + 0.5 > STEPS - n) continue;
        const x = G.x0 + (i + 0.5) * G.dx, y = G.y0 - (i + 1) * G.dy;
        glowSp(ctx, SP.gold, x, y, Math.max(G.dy, G.dx) * 1.8, 0.28 * hk * a);
      }
      ctx.fillStyle = U.rgba(255, 226, 150, 0.7 * hk * a);
      ctx.beginPath();
      for (let i = STEPS - 16; i < STEPS - 6; i++) {
        if (i + 0.5 > STEPS - n) continue;
        const x = G.x0 + i * G.dx, y = G.y0 - (i + 1) * G.dy;
        ctx.rect(x, y - 0.5, G.dx, Math.max(1.2, 1 * s));
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    // 迎光的边
    ctx.strokeStyle = css([255, 238, 206], 2, 0.45 * dayA(), 0.3);
    ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 0; i < STEPS; i++) { const x = G.x0 + i * G.dx, y = G.y0 - (i + 1) * G.dy; ctx.moveTo(x, y); ctx.lineTo(x + G.dx, y); }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 殿（殿廊朝东，即朝左；雅斤、波阿斯两根铜柱；铜坛）──────────
  function temGeo(ph) {
    const gL = gY(2, X.tem0 - 0.008), gR = gY(2, X.tem1 + 0.008);
    const top = Math.min(gL, gR), plat = 0.38 * ph, base = top - plat;
    const r = ruinK();
    return { gL, gR, top, plat, base, bodyH: 2.35 * ph * (1 - 0.72 * r), porchH: 3.15 * ph * (1 - 0.8 * r), doorH: 1.3 * ph, pilH: 1.8 * ph * (1 - 0.55 * r) };
  }
  function drawTemple(ctx, ph) {
    const G = temGeo(ph), s = LS(2), burn = burnK(), ruin = ruinK(), nk = nightK(), ml = moonL();
    const x = f => f * W.w;
    const cm = clamp(burn * 0.6 + ruin * 0.45, 0, 1);
    const lime = U.mixRGB([232, 218, 184], CHAR, cm), limeS = U.mixRGB([170, 152, 120], CHAR, cm), plat = U.mixRGB([184, 166, 132], CHAR, cm * 0.8);
    // 殿的台基（摩利亚山）
    ctx.fillStyle = css(plat, 2, 1, ml);
    ctx.beginPath();
    ctx.moveTo(x(X.tem0 - 0.016), G.gL + 3); ctx.lineTo(x(X.tem0 - 0.01), G.base); ctx.lineTo(x(X.tem1 + 0.01), G.base); ctx.lineTo(x(X.tem1 + 0.016), G.gR + 3); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = css([240, 226, 196], 2, 0.4 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); ctx.moveTo(x(X.tem0 - 0.01), G.base); ctx.lineTo(x(X.tem1 + 0.01), G.base); ctx.stroke();
    // 殿身与殿廊
    const bx0 = x(X.tem0), bx1 = x(X.tem1), px0 = x(X.por0), px1 = x(X.por1);
    const jag = (x0, x1, y, amp, seed) => {
      const n = 7;
      for (let i = 0; i <= n; i++) ctx.lineTo(lerp(x0, x1, i / n), y - (rt(seed + i) - 0.3) * amp);
    };
    ctx.fillStyle = css(lime, 2, 1, ml * 1.2);
    ctx.beginPath();
    if (ruin > 0.12) {
      ctx.moveTo(bx0, G.base); jag(bx0, bx1, G.base - G.bodyH, 0.5 * ph * ruin, 90); ctx.lineTo(bx1, G.base); ctx.closePath();
      ctx.moveTo(px0, G.base); jag(px0, px1, G.base - G.porchH, 0.6 * ph * ruin, 110); ctx.lineTo(px1, G.base); ctx.closePath();
    } else {
      ctx.rect(bx0, G.base - G.bodyH, bx1 - bx0, G.bodyH);
      ctx.rect(px0, G.base - G.porchH, px1 - px0, G.porchH);
    }
    ctx.fill();
    // 背光的一面
    ctx.fillStyle = css(limeS, 2, 0.8, ml * 0.6);
    const lr = litRight(x(X.temC));
    ctx.fillRect(lr ? bx0 : bx1 - (bx1 - bx0) * 0.12, G.base - G.bodyH, (bx1 - bx0) * 0.12, G.bodyH);
    ctx.fillRect(lr ? px0 : px1 - (px1 - px0) * 0.16, G.base - G.porchH, (px1 - px0) * 0.16, G.porchH);
    if (ruin < 0.35) {
      const ra = 1 - ruin / 0.35;
      // 金的檐与横带
      const gold = U.mixRGB(GOLD, CHAR, burn * 0.8);
      ctx.fillStyle = css(gold, 2, ra, 0.2 + 0.15 * nk);
      ctx.fillRect(bx0 - 1.5 * s, G.base - G.bodyH - 2.4 * s, bx1 - bx0 + 3 * s, 2.4 * s);
      ctx.fillRect(px0 - 1.5 * s, G.base - G.porchH - 2.8 * s, px1 - px0 + 3 * s, 2.8 * s);
      ctx.fillStyle = css(gold, 2, 0.8 * ra, 0.1);
      ctx.fillRect(px0, G.base - G.porchH * 0.62, px1 - px0, 1.4 * s);
      ctx.fillRect(bx0, G.base - G.bodyH * 0.6, px0 - bx0, 1.2 * s);
      ctx.fillRect(px1, G.base - G.bodyH * 0.6, bx1 - px1, 1.2 * s);
      // 殿身两旁的窗（斜开的窗棂）
      ctx.fillStyle = css([120, 100, 80], 2, 0.8 * ra);
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(lerp(bx0, px0, 0.25 + 0.25 * i) - 1 * s, G.base - G.bodyH * 0.85, 2 * s, G.bodyH * 0.14);
        ctx.fillRect(lerp(px1, bx1, 0.25 + 0.25 * i) - 1 * s, G.base - G.bodyH * 0.85, 2 * s, G.bodyH * 0.14);
      }
    }
    // 殿门与门里的光
    const dx0 = x(X.door0), dx1 = x(X.door1), dH = G.doorH * (1 - ruin * 0.4);
    ctx.fillStyle = css([34, 26, 22], 2);
    ctx.beginPath(); ctx.moveTo(dx0, G.base); ctx.lineTo(dx0, G.base - dH * 0.82); ctx.quadraticCurveTo((dx0 + dx1) / 2, G.base - dH * 1.08, dx1, G.base - dH * 0.82); ctx.lineTo(dx1, G.base); ctx.closePath(); ctx.fill();
    const gl = clamp(W.lv.exGlory, 0, 1.6) * (1 - burn) * (1 - ruin), idol = W.lv.exIdol;
    if (gl > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      const cx = (dx0 + dx1) / 2, cy = G.base - dH * 0.45;
      glowSp(ctx, SP.gold, cx, cy, dH * (0.9 + 0.5 * gl), gl * (0.35 + 0.35 * nk) * (1 - 0.6 * idol));
      if (idol > 0.02) glowSp(ctx, SP.violet, cx, cy, dH * 0.9, idol * gl * 0.5);
      ctx.fillStyle = idol > 0.5 ? 'rgb(206,184,255)' : 'rgb(255,222,150)';
      ctx.globalAlpha = Math.min(1, gl * (0.35 + 0.35 * nk));
      ctx.fillRect(dx0 + (dx1 - dx0) * 0.2, G.base - dH * 0.75, (dx1 - dx0) * 0.6, dH * 0.75);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    // 殿内的亚舍拉像（21:7）：门里一根雕刻的柱像的剪影
    if (idol > 0.02 && ruin < 0.3) {
      const cx = (dx0 + dx1) / 2, w = (dx1 - dx0) * 0.14;
      ctx.fillStyle = css([40, 30, 36], 2, idol);
      ctx.beginPath(); ctx.moveTo(cx - w, G.base); ctx.lineTo(cx - w * 0.6, G.base - dH * 0.72); ctx.lineTo(cx, G.base - dH * 0.8); ctx.lineTo(cx + w * 0.6, G.base - dH * 0.72); ctx.lineTo(cx + w, G.base); ctx.closePath(); ctx.fill();
    }
    // 两根铜柱（25:13 打碎；25:17）
    const bz = U.mixRGB(BRONZE, CHAR, cm * 0.8);
    for (let i = 0; i < 2; i++) {
      const cx = x(X.pil[i]), w = 0.11 * ph, h = G.pilH;
      const broke = ruin > 0.4;
      ctx.fillStyle = css(bz, 2, 1, 0.08);
      ctx.beginPath();
      if (broke) { ctx.moveTo(cx - w, G.base); ctx.lineTo(cx - w, G.base - h * 0.85); ctx.lineTo(cx, G.base - h); ctx.lineTo(cx + w, G.base - h * 0.78); ctx.lineTo(cx + w, G.base); ctx.closePath(); }
      else {
        ctx.rect(cx - w, G.base - h, w * 2, h);
        ctx.moveTo(cx + w * 1.6, G.base - h - w * 0.8); ctx.ellipse(cx, G.base - h - w * 0.8, w * 1.6, w * 1.15, 0, 0, TAU);   // 柱顶
      }
      ctx.fill();
      if (!broke) {
        // 石榴与网子
        ctx.fillStyle = css([220, 150, 80], 2, 0.9, 0.15 + 0.2 * nk);
        ctx.beginPath();
        for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU + 0.3; ctx.moveTo(cx + Math.cos(a) * w * 1.5 + w * 0.3, G.base - h - w * 0.8 + Math.sin(a) * w * 0.9); ctx.arc(cx + Math.cos(a) * w * 1.5, G.base - h - w * 0.8 + Math.sin(a) * w * 0.9, w * 0.3, 0, TAU); }
        ctx.fill();
        ctx.strokeStyle = css([255, 214, 150], 2, 0.5 * dayA(), 0.3); ctx.lineWidth = Math.max(0.5, 0.7 * s);
        ctx.beginPath(); ctx.moveTo(cx + (lr ? w : -w), G.base - h); ctx.lineTo(cx + (lr ? w : -w), G.base); ctx.stroke();
      }
    }
    // 修理殿的架子（22:5–6）
    const rp = W.lv.exRepair;
    if (rp > 0.01) {
      ctx.strokeStyle = css([128, 94, 60], 2, rp);
      ctx.lineWidth = Math.max(0.7, 1.1 * s);
      ctx.beginPath();
      const xs = [X.tem0 - 0.004, X.por0 - 0.003, X.por1 + 0.003, X.tem1 + 0.004];
      for (const f of xs) { ctx.moveTo(x(f), G.base); ctx.lineTo(x(f), G.base - G.porchH * (f > X.por0 - 0.004 && f < X.por1 + 0.004 ? 1.05 : 0.78)); }
      for (let k = 1; k <= 3; k++) {
        const y = G.base - G.porchH * 0.26 * k;
        ctx.moveTo(x(X.tem0 - 0.006), y); ctx.lineTo(x(X.tem1 + 0.006), y);
      }
      ctx.stroke();
    }
    return G;
  }

  // ── 殿前：铜坛、大马士革样式的坛、铜蛇、为天上万象所筑的坛 ────────
  function drawCourt(ctx, ph) {
    const s = LS(2), ruin = ruinK(), burn = burnK(), nk = nightK();
    if (ruin > 0.9) return;
    const A = 1 - smoothstep(0.5, 0.9, ruin);
    ctx.globalAlpha = A;
    // 铜坛：常献的燔祭
    {
      const cx = X.alt * W.w, g = fieldY(X.alt, 0.03), w = 0.42 * ph, h = 0.5 * ph;
      ctx.fillStyle = css(U.mixRGB(BRONZE, CHAR, burn * 0.7), 2, 1, 0.06 + moonL());
      ctx.fillRect(cx - w, g - h, w * 2, h);
      ctx.fillRect(cx - w * 1.15, g - h - 1.6 * s, w * 0.3, 2.2 * s); ctx.fillRect(cx + w * 0.85, g - h - 1.6 * s, w * 0.3, 2.2 * s);
      const gk = clamp(W.lv.exGlory, 0, 1) * (1 - burn) * (1 - W.lv.exIdol * 0.7);
      if (gk > 0.05) { flame(ctx, cx, g - h, 0.42 * ph, gk * 0.85, 3.3); smoke(ctx, cx, g - h - 0.3 * ph, gk * 0.7, W.h * 0.12, 0.12 * ph, 1.1, false); ctx.globalAlpha = A; }
    }
    // 大马士革样式的坛（16:10–11）：更大，黑烟
    const al = W.lv.exAltar;
    if (al > 0.01) {
      const cx = X.dam * W.w, g = fieldY(X.dam, 0.07), w = 0.6 * ph * (0.4 + 0.6 * al), h = 0.66 * ph * al;
      ctx.fillStyle = css([150, 128, 108], 2, al);
      ctx.beginPath();
      ctx.rect(cx - w, g - h, w * 2, h);
      for (const e of [-1, 1]) { ctx.moveTo(cx + e * w, g - h); ctx.lineTo(cx + e * (w + 2 * s), g - h - 3.5 * s); ctx.lineTo(cx + e * (w - 3 * s), g - h); }
      ctx.fill();
      ctx.fillStyle = css([110, 92, 78], 2, 0.8 * al);
      ctx.fillRect(cx - w, g - h * 0.55, w * 2, 1.2 * s);
      if (al > 0.4) { flame(ctx, cx, g - h, 0.38 * ph, al * 0.7, 7.7); smoke(ctx, cx, g - h - 0.3 * ph, al, W.h * 0.16, 0.16 * ph, 2.7, true); ctx.globalAlpha = A; }
    }
    // 铜蛇（18:4）：竿上的铜蛇；打碎后成了地上的碎块
    if (S.serpent !== 'none') {
      const cx = X.serp * W.w, g = fieldY(X.serp, 0.1), h = 1.35 * ph;
      if (S.serpent === 'whole') {
        ctx.strokeStyle = css([110, 84, 58], 2); ctx.lineWidth = Math.max(0.8, 1.3 * s);
        ctx.beginPath(); ctx.moveTo(cx, g); ctx.lineTo(cx, g - h); ctx.moveTo(cx - 0.18 * ph, g - h * 0.92); ctx.lineTo(cx + 0.18 * ph, g - h * 0.92); ctx.stroke();
        ctx.strokeStyle = css(BRONZE, 2, 1, 0.2); ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        for (let i = 0; i <= 16; i++) { const u = i / 16, y = g - h * (0.35 + 0.62 * u), xx = cx + Math.sin(u * 9.5) * 0.12 * ph * (1 - u * 0.4); if (i) ctx.lineTo(xx, y); else ctx.moveTo(xx, y); }
        ctx.stroke();
      } else {
        ctx.fillStyle = css(BRONZE, 2, 1, 0.15);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) { const xx = cx + (rt(i + 300) - 0.5) * 0.9 * ph, yy = g - rt(i + 310) * 0.1 * ph; ctx.moveTo(xx + 0.1 * ph, yy); ctx.ellipse(xx, yy, 0.1 * ph, 0.04 * ph, rt(i + 320) * 3, 0, TAU); }
        ctx.fill();
      }
    }
    // 为天上的万象所筑的坛（21:5）：一座座小坛，上面浮着冷白的星
    const id = W.lv.exIdol;
    if (id > 0.01) {
      SP || sprites();
      X.idols.forEach((f, i) => {
        const cx = f * W.w, g = fieldY(f, 0.06 + 0.05 * (i % 2)), w = 0.2 * ph, h = 0.34 * ph * id;
        ctx.fillStyle = css([128, 116, 118], 2, id);
        ctx.fillRect(cx - w, g - h, w * 2, h);
        const sy = g - h - (0.45 + 0.1 * Math.sin(W.t * 0.8 + i)) * ph, r = (0.16 + 0.03 * Math.sin(W.t * 2 + i * 2)) * ph;
        ctx.globalCompositeOperation = 'lighter';
        glowSp(ctx, SP.violet, cx, sy, r * 3.4, id * (0.35 + 0.4 * nk));
        ctx.fillStyle = U.rgba(236, 228, 255, 0.85 * id);
        ctx.beginPath();
        for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU + W.t * 0.2, rr = k % 2 ? r * 0.3 : r; if (k) ctx.lineTo(cx + Math.cos(a) * rr, sy + Math.sin(a) * rr); else ctx.moveTo(cx + Math.cos(a) * rr, sy + Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = A;
      });
    }
    ctx.globalAlpha = 1;
  }

  // ── 城墙（前）：塔、城门、城被攻破、拆毁 ─────────────────────────
  function drawWall(ctx, ph) {
    const s = LS(2), wallH = 1.18 * ph, burn = burnK(), nk = nightK(), ml = moonL();
    const wc = U.mixRGB([204, 184, 148], [96, 80, 64], burn * 0.45), sc = U.mixRGB([150, 134, 110], [80, 68, 56], burn * 0.45);
    const rubC = U.mixRGB([168, 146, 114], [88, 74, 60], burn * 0.4);
    const rims = [], lamps = [];
    for (let i = 0; i < CITY.NS; i++) {
      const sg = CITY.segs[i], xa = segX(i) * W.w, xb = segX(i + 1) * W.w, f = segFall(i);
      const tw = sg.tower ? 0.18 * (xb - xa) : 0;
      const xA = xa - tw, xB = xb + tw;
      const ba = gY(2, xA / W.w) + 2, bb = gY(2, xB / W.w) + 2;
      const cxf = (segX(i) + segX(i + 1)) / 2;
      const court = cxf > X.tem0 - 0.02 && cxf < X.tem1 + 0.004 && !sg.tower;      // 殿前的院墙低一些，殿门与祭坛看得见
      const H0 = wallH * sg.h * (sg.tower ? 1.35 : 1) * (i === CITY.gate ? 1.1 : 1) * (court ? 0.5 : 1);
      const H = H0 * (1 - f * 0.86);
      const shake = f > 0 && f < 1 ? Math.sin(W.t * 37 + i * 3) * 1.2 * s * Math.sin(f * Math.PI) : 0;
      const lean = f * f * 0.2 * sg.lean * H0;
      ctx.fillStyle = css(wc, 2, 1, 0.04 + ml);
      ctx.beginPath();
      if (f > 0.05) {
        ctx.moveTo(xA, ba); ctx.lineTo(xA + shake + lean, ba - H * (0.8 + 0.2 * rt(i + 500))); ctx.lineTo(lerp(xA, xB, 0.4) + lean, lerp(ba, bb, 0.4) - H);
        ctx.lineTo(lerp(xA, xB, 0.7) + lean, lerp(ba, bb, 0.7) - H * 0.72); ctx.lineTo(xB + shake + lean, bb - H * (0.9 - 0.3 * rt(i + 510))); ctx.lineTo(xB, bb);
      } else { ctx.moveTo(xA, ba); ctx.lineTo(xA, ba - H); ctx.lineTo(xB, bb - H); ctx.lineTo(xB, bb); }
      ctx.closePath(); ctx.fill();
      // 石基
      ctx.fillStyle = css(sc, 2, 1, ml * 0.7);
      const shh = Math.min(H, wallH * 0.26);
      ctx.beginPath(); ctx.moveTo(xA, ba); ctx.lineTo(xA, ba - shh); ctx.lineTo(xB, bb - shh); ctx.lineTo(xB, bb); ctx.closePath(); ctx.fill();
      if (f < 0.15) {
        // 垛口
        ctx.fillStyle = css(wc, 2, 1, ml);
        ctx.beginPath();
        const n = sg.tower ? 3 : 4, mw = (xB - xA) / (n * 2);
        for (let k = 0; k < n; k++) { const mx = xA + mw * (2 * k + 0.5); const my = lerp(ba, bb, (mx - xA) / (xB - xA)) - H; ctx.rect(mx, my - 3 * s, mw, 3 * s); }
        ctx.fill();
        rims.push([xA, ba - H, xB, bb - H]);
        lamps.push([(xA + xB) / 2, lerp(ba, bb, 0.5) - H - 3 * s, i]);
      }
      // 城门
      if (i === CITY.gate && f < 0.6) {
        const gx = (xA + xB) / 2, gw = (xB - xA) * 0.26, gh = wallH * 0.66 * (1 - f), gb = (ba + bb) / 2;
        ctx.fillStyle = css([28, 22, 18], 2);
        ctx.beginPath(); ctx.moveTo(gx - gw, gb); ctx.lineTo(gx - gw, gb - gh * 0.72); ctx.quadraticCurveTo(gx, gb - gh * 1.15, gx + gw, gb - gh * 0.72); ctx.lineTo(gx + gw, gb); ctx.closePath(); ctx.fill();
        if (nk > 0.15 && burn < 0.3) { flame(ctx, gx - gw * 1.6, gb - gh * 0.9, 4.5 * s, nk * 0.8 * (1 - W.lv.exFamine * 0.7), 11); flame(ctx, gx + gw * 1.6, gb - gh * 0.9, 4.5 * s, nk * 0.8 * (1 - W.lv.exFamine * 0.7), 17); }
      }
      // 倒下的砖石
      if (f > 0.01) {
        ctx.fillStyle = css(rubC, 2, 1, ml * 0.8);
        ctx.beginPath();
        const rw = (xB - xA) * 0.6, rh = wallH * 0.34 * f;
        for (let k = 0; k < 5; k++) {
          const q = CITY.rub[(i * 5 + k) % CITY.rub.length];
          const rx = lerp(xA, xB, 0.08 + 0.84 * q[0]), ry = lerp(ba, bb, (rx - xA) / (xB - xA)) + 2 * s;
          const r1 = rw * (0.26 + 0.2 * q[1]), r2 = rh * (0.55 + 0.45 * q[2]);
          ctx.moveTo(rx + r1, ry); ctx.ellipse(rx, ry, r1, r2, 0, Math.PI, TAU);
        }
        ctx.fill();
      }
    }
    if (rims.length) {
      ctx.strokeStyle = css([255, 234, 196], 2, 0.42 * dayA(), 0.3); ctx.lineWidth = Math.max(0.6, 0.9 * s);
      ctx.beginPath();
      for (const q of rims) { ctx.moveTo(q[0], q[1]); ctx.lineTo(q[2], q[3]); }
      ctx.stroke();
    }
    // 逾越节：城墙上一盏盏的灯
    const pk = W.lv.exPass * (1 - burn);
    if (pk > 0.02) for (const q of lamps) if (q[2] % 2 === 0) flame(ctx, q[0], q[1], 4.2 * s, pk * 0.85, q[2] * 1.7);
  }

  // 城的火（25:9）与余烟
  function drawCityFire(ctx, ph, boxes, P, G) {
    const burn = burnK(), ruin = ruinK(), nk = nightK();
    const bx0 = X.tem0 * W.w, bx1 = X.tem1 * W.w, px0 = X.por0 * W.w, px1 = X.por1 * W.w;
    if (burn > 0.01) {
      SP || sprites();
      const fl = 0.85 + 0.15 * Math.sin(W.t * 4) * Math.sin(W.t * 2.3 + 1);
      ctx.globalCompositeOperation = 'lighter';
      // 天被火映红
      glowSp(ctx, SP.ember, X.temC * W.w, G.base - G.porchH * 0.4, W.h * (0.42 + 0.2 * burn), burn * (0.28 + 0.4 * nk) * fl);
      glowSp(ctx, SP.warm, (X.pal0 + X.w1) / 2 * W.w, gY(2, 0.8) - ph * 1.6, W.w * 0.3, burn * (0.2 + 0.32 * nk) * fl);
      // 殿与王宫从里面烧透：自下而上的火光
      const inner = (x0, x1, top, bot, k) => {
        if (bot - top < 2) return;
        const gr = ctx.createLinearGradient(0, bot, 0, top);
        gr.addColorStop(0, 'rgba(255,130,50,' + (0.62 * k).toFixed(3) + ')');
        gr.addColorStop(0.6, 'rgba(255,96,36,' + (0.28 * k).toFixed(3) + ')');
        gr.addColorStop(1, 'rgba(255,80,30,0)');
        ctx.fillStyle = gr;
        ctx.fillRect(x0, top, x1 - x0, bot - top);
      };
      const ik = burn * (1 - ruin * 0.5) * fl;
      inner(bx0, bx1, G.base - G.bodyH, G.base, ik);
      inner(px0, px1, G.base - G.porchH, G.base, ik);
      inner(P.x0, P.x1, P.g - P.H, P.g, ik * 0.9);
      ctx.globalCompositeOperation = 'source-over';
      // 火舌：殿身、殿廊、王宫、各大户家的房屋
      const fk = burn * (1 - ruin * 0.45);
      const hk = 0.45 + 0.55 * burn;
      for (let i = 0; i < 6; i++) flame(ctx, lerp(bx0, bx1, (i + 0.5) / 6), G.base - G.bodyH + 2, (1.1 + 0.9 * rt(i + 600)) * ph * hk, fk * 0.95, 1.3 + i * 2.1, i % 2 === 1);
      for (let i = 0; i < 3; i++) flame(ctx, lerp(px0, px1, (i + 0.5) / 3), G.base - G.porchH + 2, (1.6 + 0.8 * rt(i + 620)) * ph * hk, fk, 7.3 + i * 1.7, i !== 1);
      flame(ctx, (X.door0 + X.door1) / 2 * W.w, G.base, 1.1 * ph * hk, fk * 0.9, 6.2, true);
      for (let i = 0; i < 4; i++) flame(ctx, lerp(P.x0, P.x1, (i + 0.5) / 4), P.g - P.H + 2, (0.9 + 0.7 * rt(i + 640)) * ph * hk, fk * 0.9, 8.4 + i * 1.3, i % 2 === 0);
      for (let i = 0; i < boxes.length; i++) { const q = boxes[i]; flame(ctx, q[0], q[1] - q[2] + 2, (0.55 + 0.45 * q[4].k) * ph * hk, fk * 0.85, i * 3.1, i % 3 !== 0); }
    }
    const sk = Math.max(burn * 0.95, ruin * (1 - W.lv.exVines * 0.85) * 0.8);
    if (sk > 0.01) {
      const lit = burn * nk * 0.9;
      smoke(ctx, X.temC * W.w, G.base - G.porchH - 0.6 * ph, sk, W.h * 0.5, 0.7 * ph, 0.4, true, lit);
      smoke(ctx, lerp(bx0, px0, 0.5), G.base - G.bodyH - 0.4 * ph, sk * 0.8, W.h * 0.4, 0.5 * ph, 2.6, true, lit);
      smoke(ctx, (P.x0 + P.x1) / 2, P.g - P.H - 0.4 * ph, sk * 0.85, W.h * 0.38, 0.55 * ph, 1.9, true, lit);
      smoke(ctx, 0.93 * W.w, gY(2, 0.93) - 1.6 * ph, sk * 0.7, W.h * 0.3, 0.4 * ph, 3.3, true, lit);
    }
  }

  // ── 平原上的营：亚述（18:17）与迦勒底（25:1）─────────────────────
  const TENTS = (() => {
    const r = U.mulberry32(9091), t = [];
    for (let i = 0; i < 9; i++) t.push({ x: lerp(X.plain0, X.plain1 - 0.012, (i + 0.5) / 9) + (r() - 0.5) * 0.012, v: [0.04, 0.3, 0.14, 0.5, 0.08, 0.36, 0.2, 0.55, 0.1][i], s: 0.85 + 0.3 * r(), k: r() });
    return t;
  })();
  const FIRES = (() => {
    const r = U.mulberry32(9092), f = [];
    for (let i = 0; i < 11; i++) f.push({ x: lerp(X.plain0 - 0.01, X.plain1 + 0.004, (i + 0.5) / 11) + (r() - 0.5) * 0.01, v: 0.1 + 0.55 * r(), k: r() });
    return f;
  })();
  const SW0 = 0.59, SW1 = 0.43;
  const sweepX = () => lerp(SW0, SW1, clamp(W.lv.exSweep, 0, 1));
  function drawCamp(ctx, ph, which) {
    const k = which === 'as' ? W.lv.exAssyr : W.lv.exBab;
    if (k < 0.01) return;
    const s = LS(2), nk = nightK();
    const cloth = which === 'as' ? [132, 76, 56] : [58, 72, 116], ban = which === 'as' ? [196, 60, 44] : [70, 110, 200], banAcc = which === 'as' ? [230, 190, 120] : [236, 200, 100];
    const dark = which === 'as' && W.lv.exSweep > 0.99;
    for (const t of TENTS) {
      const cx = t.x * W.w, g = fieldY(t.x, t.v), sc = vK(t.v) * t.s, w = 0.55 * ph * sc, h = 0.72 * ph * sc;
      ctx.fillStyle = css(dark ? U.mixRGB(cloth, [30, 26, 24], 0.5) : cloth, 2, k);
      ctx.beginPath(); ctx.moveTo(cx - w, g); ctx.lineTo(cx, g - h); ctx.lineTo(cx + w, g); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([24, 20, 18], 2, 0.8 * k);
      ctx.beginPath(); ctx.moveTo(cx - w * 0.2, g); ctx.lineTo(cx, g - h * 0.5); ctx.lineTo(cx + w * 0.2, g); ctx.closePath(); ctx.fill();
      // 旗
      if (t.k < 0.55) {
        ctx.strokeStyle = css([90, 70, 50], 2, k); ctx.lineWidth = Math.max(0.6, 0.8 * s);
        ctx.beginPath(); ctx.moveTo(cx, g - h); ctx.lineTo(cx, g - h - 0.5 * ph * sc); ctx.stroke();
        const wv = Math.sin(W.t * 3 + t.k * 9) * 0.06 * ph;
        ctx.fillStyle = css(ban, 2, k, 0.1);
        ctx.beginPath(); ctx.moveTo(cx, g - h - 0.5 * ph * sc); ctx.lineTo(cx + 0.34 * ph * sc, g - h - 0.42 * ph * sc + wv); ctx.lineTo(cx, g - h - 0.3 * ph * sc); ctx.closePath(); ctx.fill();
        ctx.fillStyle = css(banAcc, 2, 0.8 * k, 0.15);
        ctx.fillRect(cx + 0.06 * ph * sc, g - h - 0.43 * ph * sc, 0.08 * ph * sc, 0.06 * ph * sc);
      }
    }
    // 营火（夜里）：使者走过之处，火就熄了
    if (nk > 0.05) {
      const sx = which === 'as' ? sweepX() : 2;
      for (const f of FIRES) {
        const cx = f.x * W.w, g = fieldY(f.x, f.v);
        const out = which === 'as' && f.x > sx;
        if (out) { wisp(ctx, cx, g, k * nk * 0.8, 0.9 * ph, 0.9 * s, f.k * 5, [150, 150, 160]); continue; }
        flame(ctx, cx, g, 0.36 * ph * vK(f.v), k * nk * 0.95, f.k * 7);
      }
    }
  }
  // 四围筑垒（25:1）：一道斜土坡靠着城墙
  function drawMound(ctx, ph) {
    const k = W.lv.exMound;
    if (k < 0.01) return;
    const x0 = (X.w0 + 0.004) * W.w, x1 = (X.w0 + 0.048) * W.w, g0 = gY(2, X.w0 + 0.004) + 3, g1 = gY(2, X.w0 + 0.048);
    const top = g1 - 1.05 * ph * k;
    ctx.fillStyle = css([140, 116, 86], 2, Math.min(1, k * 1.5), moonL() * 0.8);
    ctx.beginPath(); ctx.moveTo(x0, g0); ctx.quadraticCurveTo(lerp(x0, x1, 0.6), lerp(g0, top, 0.7), x1, top); ctx.lineTo(x1, g1 + 3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([196, 170, 130], 2, 0.4 * k * dayA(), 0.1); ctx.lineWidth = Math.max(0.6, 0.8 * LS(2));
    ctx.beginPath(); ctx.moveTo(x0, g0); ctx.quadraticCurveTo(lerp(x0, x1, 0.6), lerp(g0, top, 0.7), x1, top); ctx.stroke();
  }

  // ── 汲沦溪旁的火（23:4，23:6）────────────────────────────────
  function drawKidron(ctx, ph) {
    const k = W.lv.exKidron;
    if (k < 0.01) return;
    const cx = X.kidron * W.w, g = fieldY(X.kidron, 0.42);
    // 堆着的木偶与器皿（在火里渐渐成灰）
    ctx.fillStyle = css([60, 48, 44], 2, k);
    ctx.beginPath(); ctx.ellipse(cx, g, 0.7 * ph, 0.16 * ph, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = css([90, 70, 60], 2, k);
    ctx.fillRect(cx - 0.3 * ph, g - 0.55 * ph, 0.08 * ph, 0.5 * ph);
    ctx.fillRect(cx + 0.18 * ph, g - 0.42 * ph, 0.07 * ph, 0.4 * ph);
    flame(ctx, cx, g - 0.05 * ph, 1.1 * ph, k, 12.1);
    flame(ctx, cx - 0.35 * ph, g, 0.7 * ph, k * 0.85, 13.3);
    flame(ctx, cx + 0.32 * ph, g, 0.65 * ph, k * 0.85, 14.7);
    smoke(ctx, cx, g - 0.9 * ph, k, W.h * 0.3, 0.3 * ph, 5.5, true);
  }

  // ── 病榻（20:1）、书信（19:14）、金银（20:13）、王的席（25:29）──────
  function drawMat(ctx, ph) {
    const k = W.lv.exBed;
    if (k < 0.01) return;
    const cx = (X.palC + 0.006) * W.w, g = fieldY(X.palC + 0.006, 0.36), w = 0.85 * ph, s = LS(2);
    ctx.fillStyle = css([150, 72, 64], 2, k);
    ctx.beginPath(); ctx.ellipse(cx, g + 0.02 * ph, w, 0.1 * ph, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = css([226, 206, 160], 2, 0.7 * k);
    ctx.fillRect(cx - w * 0.8, g - 0.02 * ph, w * 1.6, Math.max(1, 1 * s));
  }
  function drawLetter(ctx, ph) {
    const k = W.lv.exLetter;
    if (k < 0.01) return;
    SP || sprites();
    const cx = (X.temC - 0.01) * W.w, y = fieldY(X.temC - 0.01, 0.1) - 0.08 * ph, w = 0.62 * ph, h = 0.26 * ph;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, cx, y - h * 0.3, w * 2.2, k * 0.55);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = U.rgba(246, 236, 210, k);
    ctx.fillRect(cx - w, y - h, w * 2, h);
    ctx.fillStyle = U.rgba(196, 170, 130, k);
    ctx.beginPath(); ctx.ellipse(cx - w, y - h / 2, h * 0.22, h * 0.55, 0, 0, TAU); ctx.ellipse(cx + w, y - h / 2, h * 0.22, h * 0.55, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = U.rgba(90, 70, 60, 0.6 * k);
    for (let i = 0; i < 4; i++) ctx.fillRect(cx - w * 0.75, y - h * (0.8 - 0.18 * i), w * (1.3 - 0.2 * (i % 2)), Math.max(0.6, h * 0.05));
  }
  function drawGold(ctx, ph) {
    const k = W.lv.exGold;
    if (k < 0.01) return;
    SP || sprites();
    const cx = (X.palC + 0.012) * W.w, g = fieldY(X.palC + 0.012, 0.18);
    ctx.fillStyle = css(GOLD, 2, k, 0.25);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const x = cx + (rt(i + 800) - 0.5) * 1.3 * ph, r = (0.1 + 0.08 * rt(i + 810)) * ph;
      if (i % 3 === 0) { ctx.moveTo(x + r, g); ctx.ellipse(x, g - r * 0.6, r, r * 0.8, 0, 0, Math.PI); }
      else ctx.rect(x - r, g - r * 0.6, r * 2, r * 0.6);
    }
    ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, cx, g - 0.2 * ph, 1.4 * ph, k * 0.5);
    for (let i = 0; i < 6; i++) {
      const tw = Math.max(0, Math.sin(W.t * 3 + i * 2.1));
      glowSp(ctx, SP.white, cx + (rt(i + 820) - 0.5) * 1.3 * ph, g - rt(i + 830) * 0.5 * ph, 0.2 * ph, k * tw * 0.9);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawTable(ctx, ph) {
    const k = W.lv.exTable;
    if (k < 0.01) return;
    const cx = (X.table + 0.018) * W.w, g = fieldY(X.table + 0.018, 0.3), w = 0.62 * ph * vK(0.3), h = 0.5 * ph * vK(0.3), s = LS(2);
    // 桌、铺着的细麻布
    ctx.fillStyle = css([120, 86, 58], 2, k);
    ctx.fillRect(cx - w * 0.8, g - h, Math.max(1.5, 1.6 * s), h); ctx.fillRect(cx + w * 0.75, g - h, Math.max(1.5, 1.6 * s), h);
    ctx.fillStyle = css([236, 228, 206], 2, k, 0.15);
    ctx.beginPath(); ctx.moveTo(cx - w, g - h); ctx.lineTo(cx + w, g - h); ctx.lineTo(cx + w * 0.96, g - h * 0.62); ctx.lineTo(cx - w * 0.96, g - h * 0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([226, 196, 110], 2, 0.9 * k, 0.15);
    ctx.fillRect(cx - w * 0.96, g - h * 0.66, w * 1.92, Math.max(1, 0.9 * s));
    // 饼与杯（日日赐他一分）
    ctx.fillStyle = css([214, 170, 110], 2, k, 0.2);
    ctx.beginPath(); ctx.ellipse(cx - w * 0.45, g - h - 0.06 * ph, w * 0.2, 0.07 * ph, 0, Math.PI, TAU); ctx.ellipse(cx - w * 0.05, g - h - 0.05 * ph, w * 0.16, 0.06 * ph, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = css([200, 160, 90], 2, k, 0.2);
    ctx.fillRect(cx + w * 0.55, g - h - 0.16 * ph, 0.08 * ph, 0.16 * ph);
  }

  // ── 巴比伦的门墙（25:27）：琉璃的蓝砖、金的狮子、门里的监 ──────────
  function drawBabel(ctx, ph) {
    const k = W.lv.exBabel;
    if (k < 0.01) return;
    const s = LS(2), x0 = X.bab0 * W.w, x1 = X.bab1 * W.w, g = Math.min(gY(2, X.bab0), gY(2, X.bab1)) + 2, H = 2.35 * ph;
    const cx = X.babC * W.w;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([52, 80, 140], 2, 1, 0.05);
    ctx.beginPath();
    ctx.moveTo(x0, gY(2, X.bab0) + 3); ctx.lineTo(x0, g - H * 0.86); ctx.lineTo(cx - 0.05 * W.w, g - H * 0.86);
    ctx.lineTo(cx - 0.05 * W.w, g - H * 1.1); ctx.lineTo(cx + 0.05 * W.w, g - H * 1.1); ctx.lineTo(cx + 0.05 * W.w, g - H * 0.86);
    ctx.lineTo(x1, g - H * 0.86); ctx.lineTo(x1, gY(2, X.bab1) + 3); ctx.closePath();
    ctx.fill();
    // 垛口
    ctx.beginPath();
    const n = 14;
    for (let i = 0; i < n; i++) {
      const mx = lerp(x0, x1, (i + 0.25) / n), inTower = Math.abs(mx - cx) < 0.05 * W.w, my = g - H * (inTower ? 1.1 : 0.86);
      ctx.moveTo(mx, my); ctx.lineTo(mx, my - 3.4 * s); ctx.lineTo(mx + (x1 - x0) / n * 0.25, my - 5 * s); ctx.lineTo(mx + (x1 - x0) / n * 0.5, my - 3.4 * s); ctx.lineTo(mx + (x1 - x0) / n * 0.5, my);
    }
    ctx.fill();
    // 砖缝与金色的边
    ctx.fillStyle = css([236, 196, 104], 2, 0.9, 0.2);
    ctx.fillRect(x0, g - H * 0.55, x1 - x0, 1.3 * s);
    ctx.fillRect(x0, g - H * 0.25, x1 - x0, 1.3 * s);
    // 狮子（抽象的金色行兽）
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const lx = lerp(x0, x1, [0.12, 0.27, 0.73, 0.88][i]), ly = g - H * 0.4, L = 0.34 * ph, dir = i < 2 ? 1 : -1;
      ctx.moveTo(lx - L * dir, ly); ctx.lineTo(lx + L * dir, ly); ctx.lineTo(lx + L * 1.2 * dir, ly - L * 0.4); ctx.lineTo(lx + L * 0.8 * dir, ly - L * 0.3);
      ctx.lineTo(lx - L * 0.9 * dir, ly - L * 0.28); ctx.lineTo(lx - L * 1.25 * dir, ly - L * 0.5); ctx.lineTo(lx - L * dir, ly - L * 0.1); ctx.closePath();
    }
    ctx.fill();
    // 门（监）：门拱
    const gw = 0.028 * W.w, gh = H * 0.62;
    ctx.fillStyle = css([16, 18, 26], 2);
    ctx.beginPath(); ctx.moveTo(cx - gw, g + 1); ctx.lineTo(cx - gw, g - gh * 0.72); ctx.quadraticCurveTo(cx, g - gh * 1.12, cx + gw, g - gh * 0.72); ctx.lineTo(cx + gw, g + 1); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([236, 196, 104], 2, 0.8, 0.2); ctx.lineWidth = Math.max(0.8, 1.2 * s);
    ctx.beginPath(); ctx.moveTo(cx - gw * 1.15, g); ctx.lineTo(cx - gw * 1.15, g - gh * 0.72); ctx.quadraticCurveTo(cx, g - gh * 1.2, cx + gw * 1.15, g - gh * 0.72); ctx.lineTo(cx + gw * 1.15, g); ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([200, 220, 255], 2, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x0, g - H * 0.86); ctx.lineTo(x1, g - H * 0.86); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // ── 葡萄园（25:12）：废墟前的坡上一行行葡萄 ──────────────────────
  function drawVines(ctx, ph) {
    const k = W.lv.exVines;
    if (k < 0.01) return;
    const s = LS(2);
    const rows = [[0.5, 0.664, 0.95], [0.66, 0.672, 0.955], [0.82, 0.676, 0.96]];
    for (let r = 0; r < rows.length; r++) {
      const [v, xa, xb] = rows[r], n = 9, sc = vK(v);
      ctx.strokeStyle = css([104, 84, 60], 2, Math.min(1, k * 2)); ctx.lineWidth = Math.max(0.6, 0.9 * s * sc);
      ctx.beginPath();
      const pts = [];
      for (let i = 0; i < n; i++) {
        const xf = lerp(xa, xb, (i + 0.5) / n), x = xf * W.w, g = fieldY(xf, v), h = 0.5 * ph * sc;
        ctx.moveTo(x, g); ctx.lineTo(x, g - h);
        pts.push([x, g - h, i]);
      }
      ctx.stroke();
      const grow = clamp(k * 1.25 - r * 0.08, 0, 1);
      if (grow < 0.02) continue;
      ctx.fillStyle = css([92, 132, 64], 2, 1, 0.05);
      ctx.beginPath();
      for (const p of pts) {
        const rr = 0.2 * ph * sc * grow * (0.8 + 0.3 * rt(p[2] + r * 20 + 900));
        ctx.moveTo(p[0] + rr, p[1]); ctx.ellipse(p[0], p[1], rr * 1.25, rr * 0.8, 0, 0, TAU);
        ctx.moveTo(p[0] + rr * 0.8 + rr, p[1] + rr * 0.6); ctx.ellipse(p[0] + rr * 0.9, p[1] + rr * 0.6, rr * 0.8, rr * 0.6, 0, 0, TAU);
      }
      ctx.fill();
    }
  }

  // ════════════════════════════════════════════════════════════
  //  北国：撒马利亚（中丘）与远山上的众城；邱坛
  // ════════════════════════════════════════════════════════════
  // [层, x, 熄灭的门槛 d（exNorth 低于 d 即暗）]
  const TOWNS = [
    [0, 0.585, 0.44], [0, 0.628, 0.32], [0, 0.672, 0.5], [0, 0.712, 0.24], [0, 0.752, 0.56], [0, 0.795, 0.38],
    [0, 0.84, 0.7], [0, 0.884, 0.8], [0, 0.926, 0.9], [0, 0.965, 0.76],
    [1, 0.515, 0.12], [1, 0.622, 0.2], [1, 0.95, 0.66],
  ];
  function townLit(d) { return clamp((W.lv.exNorth - d) * 14, 0, 1); }
  function drawTowns(ctx, layer) {
    const ph = PH(layer), s = LS(layer), nk = nightK();
    const lampsXY = [];
    ctx.fillStyle = css([196, 182, 156], layer);
    ctx.beginPath();
    TOWNS.forEach((t, i) => {
      if (t[0] !== layer) return;
      const cx = t[1] * W.w, g = gY(layer, t[1]) + 1;
      for (let k = 0; k < 4; k++) {
        const w = (0.25 + 0.15 * rt(i * 7 + k)) * ph, h = (0.32 + 0.3 * rt(i * 7 + k + 3)) * ph, x = cx + (k - 1.5) * 0.36 * ph;
        ctx.rect(x - w / 2, g - h, w, h);
        if (k === 1 || k === 2) lampsXY.push([x, g - h * 0.5, t[2], i * 4 + k]);
      }
    });
    ctx.fill();
    if (nk < 0.03) {
      // 白日：还亮着的城邑有炊烟
      TOWNS.forEach((t, i) => { if (t[0] === layer && townLit(t[2]) > 0.5) wisp(ctx, t[1] * W.w, gY(layer, t[1]) - 0.5 * ph, townLit(t[2]) * 0.5, 0.9 * ph, 0.8 * s, i, [214, 214, 218]); });
      return;
    }
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (const q of lampsXY) {
      const k = townLit(q[2]) * nk * (0.7 + 0.3 * Math.sin(W.t * 1.1 + q[3]));
      if (k < 0.02) continue;
      glowSp(ctx, SP.warm, q[0], q[1], (layer ? 1.2 : 1.8) * ph, k * 0.7);
      ctx.globalAlpha = Math.min(1, k);
      ctx.fillStyle = 'rgb(255,196,120)';
      ctx.fillRect(q[0] - 0.05 * ph, q[1] - 0.05 * ph, Math.max(1, 0.1 * ph), Math.max(1, 0.12 * ph));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 撒马利亚：山上的城、象牙的宫
  function drawSamaria(ctx) {
    const ph = PH(1), s = LS(1), nk = nightK();
    const cx = X.sam * W.w, g = gY(1, X.sam) + 1, hw = 0.036 * W.w;
    const dead = 1 - townLit(0.03);
    const col = U.mixRGB([222, 210, 186], [120, 110, 100], dead * 0.6), side = U.mixRGB([160, 146, 124], [90, 82, 76], dead * 0.6);
    // 城墙
    ctx.fillStyle = css(col, 1);
    ctx.beginPath();
    ctx.moveTo(cx - hw, g + 1); ctx.lineTo(cx - hw, g - 0.62 * ph); ctx.lineTo(cx + hw, g - 0.62 * ph); ctx.lineTo(cx + hw, g + 1); ctx.closePath();
    // 房屋与宫
    for (let i = 0; i < 7; i++) { const x = cx + (i - 3) * hw * 0.27, h = (0.9 + 0.55 * rt(i + 200)) * ph * (1 - dead * 0.25), w = hw * 0.2; ctx.rect(x - w / 2, g - h, w, h); }
    ctx.rect(cx + hw * 0.08, g - 1.7 * ph * (1 - dead * 0.3), hw * 0.44, 1.7 * ph * (1 - dead * 0.3));
    ctx.fill();
    ctx.fillStyle = css(side, 1, 0.8);
    ctx.fillRect(litRight(cx) ? cx - hw : cx + hw * 0.8, g - 0.62 * ph, hw * 0.2, 0.62 * ph);
    // 垛口
    ctx.fillStyle = css(col, 1);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) ctx.rect(cx - hw + (i + 0.2) * (hw * 2 / 9), g - 0.62 * ph - 2 * s, hw * 2 / 9 * 0.5, 2 * s);
    ctx.fill();
    ctx.strokeStyle = css([255, 240, 214], 1, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); ctx.moveTo(cx - hw, g - 0.62 * ph); ctx.lineTo(cx + hw, g - 0.62 * ph); ctx.stroke();
    // 灯
    const lit = townLit(0.03);
    if (nk > 0.03 && lit > 0.01) {
      SP || sprites();
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.warm, cx, g - 0.8 * ph, 3.2 * ph, lit * nk * 0.6);
      ctx.fillStyle = 'rgb(255,196,120)';
      for (let i = 0; i < 9; i++) {
        ctx.globalAlpha = Math.min(1, lit * nk * (0.6 + 0.4 * Math.sin(W.t * 0.9 + i * 2.3)));
        ctx.fillRect(cx + (rt(i + 220) - 0.5) * hw * 1.7, g - (0.3 + 0.9 * rt(i + 230)) * ph, Math.max(1, 0.1 * ph), Math.max(1, 0.12 * ph));
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
    // 亚述的营火围住撒马利亚（17:5）
    const sk = W.lv.exSiege;
    if (sk > 0.01) {
      // 亚述的营：撒马利亚两旁的帐棚与营火
      ctx.fillStyle = css([110, 64, 50], 1, sk, 0.08 * nk);
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const xf = X.sam + (i < 5 ? -1 : 1) * (0.05 + 0.014 * (i % 5)) + (rt(i + 260) - 0.5) * 0.006;
        if (!W.hasLand(1, xf * W.w, 0)) continue;
        const x = xf * W.w, g = gY(1, xf) + 1, w = 0.3 * ph, h = 0.42 * ph;
        ctx.moveTo(x - w, g); ctx.lineTo(x, g - h); ctx.lineTo(x + w, g); ctx.closePath();
      }
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const xf = X.sam + (i < 6 ? -1 : 1) * (0.043 + 0.013 * (i % 6)) + (rt(i + 240) - 0.5) * 0.008;
        if (!W.hasLand(1, xf * W.w, 0)) continue;
        flame(ctx, xf * W.w, gY(1, xf) + 1, 0.62 * ph, sk * (0.55 + 0.45 * nk), i * 1.9);
      }
    }
  }
  // 邱坛：山冈上的小坛与一缕香烟
  const HIGH = [[1, 0.53, 0.2], [1, 0.655, 0.6], [1, 0.8, 0.35], [1, 0.93, 0.85], [0, 0.61, 0.5], [0, 0.73, 0.1], [0, 0.86, 0.72], [0, 0.945, 0.4]];
  function drawHigh(ctx, layer) {
    const k = W.lv.exHigh;
    if (k < 0.01) return;
    const ph = PH(layer), s = LS(layer), nk = nightK();
    for (const h of HIGH) {
      if (h[0] !== layer) continue;
      const a = clamp((k - h[2] * 0.9) * 5, 0, 1);
      if (a < 0.01) continue;
      const x = h[1] * W.w, g = gY(layer, h[1]) + 1, w = 0.22 * ph, hh = 0.3 * ph;
      ctx.fillStyle = css([150, 136, 118], layer, a);
      ctx.beginPath(); ctx.moveTo(x - w, g); ctx.lineTo(x - w * 0.8, g - hh); ctx.lineTo(x + w * 0.8, g - hh); ctx.lineTo(x + w, g); ctx.closePath(); ctx.fill();
      wisp(ctx, x, g - hh, a, 2.4 * ph, 0.9 * s, h[1] * 20, [210, 206, 214]);
      if (nk > 0.05) flame(ctx, x, g - hh, 0.28 * ph, a * nk, h[1] * 30, true);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  天上与空中：耶户的四代、日头的光环、保护这城的光、准绳与线铊、大卫的灯
  // ════════════════════════════════════════════════════════════
  function crownXY(i) {
    const gap = Math.max(0.05 * W.w, 42 * SU(), 58);
    const cx = X.sam * W.w + (phone() ? 0.04 * W.w : 0);
    return [cx + (i - 1.5) * gap, W.horizonY - (phone() ? 0.1 : 0.17) * W.h];
  }
  // 名字的字（楷书），离屏预绘
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr;
    let t = TXT.get(key);
    if (t) return t;
    if (TXT.size > 60) TXT.clear();
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const font = Math.round(px * dpr) + 'px ' + FONT;
    g.font = font;
    c.width = Math.max(4, Math.ceil(g.measureText(str).width) + Math.ceil(14 * dpr)); c.height = Math.ceil(px * 1.9 * dpr);
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(10,6,4,0.8)'; g.shadowBlur = 4 * dpr;
    g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    g.fillText(str, c.width / 2, c.height / 2);
    t = { c, w: c.width / dpr, h: c.height / dpr };
    TXT.set(key, t);
    return t;
  }
  // 耶户的四代：约哈斯、约阿施、耶罗波安、撒迦利雅（15:12）
  const GEN = ['约哈斯', '约阿施', '耶罗波安', '撒迦利雅'];
  function crown(ctx, x, y, r, a) {
    ctx.fillStyle = U.rgba(240, 206, 120, a);
    ctx.beginPath();
    ctx.moveTo(x - r, y + r * 0.45); ctx.lineTo(x - r, y - r * 0.25); ctx.lineTo(x - r * 0.5, y + r * 0.1); ctx.lineTo(x, y - r * 0.6);
    ctx.lineTo(x + r * 0.5, y + r * 0.1); ctx.lineTo(x + r, y - r * 0.25); ctx.lineTo(x + r, y + r * 0.45); ctx.closePath(); ctx.fill();
  }
  function drawCrowns(ctx) {
    const k = W.lv.exCrown;
    if (k < 0.01) return;
    SP || sprites();
    const n = W.lv.exGen, u = SU();
    // 一条细细的金线：父传子
    const a0 = crownXY(0), a3 = crownXY(3);
    ctx.strokeStyle = U.rgba(255, 226, 170, 0.35 * k);
    ctx.lineWidth = Math.max(0.8, 0.8 * u);
    ctx.beginPath(); ctx.moveTo(a0[0], a0[1] + 7 * u); ctx.lineTo(a3[0], a3[1] + 7 * u); ctx.stroke();
    const fs = Math.max(10, Math.round(Math.min(W.w, W.h) * 0.017));
    for (let i = 0; i < 4; i++) {
      const a = clamp(n - i, 0, 1) * k;
      const [x, y] = crownXY(i);
      crown(ctx, x, y + 7 * u, 5.5 * u, Math.max(0.3 * k, a) * 0.9);
      const tsp = textSprite(GEN[i], fs, [246, 226, 190]);
      ctx.globalAlpha = k * (0.45 + 0.5 * a);
      ctx.drawImage(tsp.c, x - tsp.w / 2, y + 12 * u, tsp.w, tsp.h);
      ctx.globalAlpha = 1;
      if (a < 0.01) continue;
      ctx.globalCompositeOperation = 'lighter';
      glowSp(ctx, SP.gold, x, y, 18 * u, a * 0.55);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, y + 3 * u, 11 * u, a, i * 2.7, true);
    }
  }
  function drawHalo(ctx) {
    const k = W.lv.exHalo;
    if (k < 0.01 || !W.sun || W.sun.y > W.horizonY) return;
    SP || sprites();
    const R = M(), x = W.sun.x, y = W.sun.y;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, R * 0.3, k * 0.45);
    ctx.strokeStyle = U.rgba(255, 236, 190, 1);
    ctx.lineWidth = Math.max(1, R * 0.003);
    for (let i = 0; i < 3; i++) {
      const r = R * (0.055 + i * 0.032) * (1 + 0.03 * Math.sin(W.t * 0.8 + i));
      ctx.globalAlpha = k * (0.55 - i * 0.14);
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    }
    // 日头往回走的一道光痕（向东，向上）
    ctx.globalAlpha = k * 0.35;
    ctx.lineWidth = Math.max(1, R * 0.006);
    ctx.beginPath(); ctx.arc(x + R * 0.5, y + R * 0.9, R * 1.02, Math.PI * 1.36, Math.PI * 1.43); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawDome(ctx, ph) {
    const k = W.lv.exDome;
    if (k < 0.01) return;
    const cx = 0.803 * W.w, g = gY(2, 0.8) + 4, rx = 0.2 * W.w, ry = Math.min(0.36 * W.h, 7.2 * ph);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = U.rgba(255, 226, 160, (0.16 - i * 0.045) * k * (0.8 + 0.2 * Math.sin(W.t * 0.7 + i)));
      ctx.lineWidth = Math.max(1, (3 + i * 5) * SU());
      ctx.beginPath(); ctx.ellipse(cx, g, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    }
    ctx.strokeStyle = U.rgba(255, 244, 214, 0.45 * k);
    ctx.lineWidth = Math.max(0.8, 1.1 * SU());
    ctx.beginPath(); ctx.ellipse(cx, g, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawLine(ctx, ph) {
    const k = W.lv.exLine;
    if (k < 0.01) return;
    SP || sprites();
    const u = SU(), y0 = W.horizonY - (phone() ? 0.12 : 0.2) * W.h;
    const xa = X.sam * W.w, xb = 0.985 * W.w, xp = X.temC * W.w;
    const G = temGeo(ph), yTop = G.base - G.porchH - 0.9 * ph;
    const drop = clamp((k - 0.4) / 0.6, 0, 1);
    const yP = lerp(y0 + 6 * u, yTop, drop);
    const sw = Math.sin(W.t * 1.1) * 0.012 * (yP - y0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = U.rgba(222, 230, 250, 0.3 * k);
    ctx.lineWidth = Math.max(2, 5 * u);
    ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    ctx.strokeStyle = U.rgba(232, 238, 252, 0.85 * k);
    ctx.lineWidth = Math.max(1, 1.4 * u);
    ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke();
    // 量线上的刻度
    ctx.globalAlpha = 0.6 * k;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const x = lerp(xa, xb, i / 24), t = i % 4 === 0 ? 5 : 2.5; ctx.moveTo(x, y0 - t * u); ctx.lineTo(x, y0 + t * u); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.pale, xa, y0, 12 * u, 0.5 * k);
    // 线铊
    if (drop > 0.01) {
      ctx.strokeStyle = U.rgba(232, 238, 252, 0.8 * k);
      ctx.beginPath(); ctx.moveTo(xp, y0); ctx.lineTo(xp + sw, yP); ctx.stroke();
      glowSp(ctx, SP.pale, xp + sw, yP + 4 * u, 14 * u, 0.6 * k);
      ctx.fillStyle = U.rgba(236, 240, 252, 0.9 * k);
      ctx.beginPath(); ctx.moveTo(xp + sw, yP); ctx.quadraticCurveTo(xp + sw + 4 * u, yP + 5 * u, xp + sw, yP + 10 * u); ctx.quadraticCurveTo(xp + sw - 4 * u, yP + 5 * u, xp + sw, yP); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 大卫的灯：王宫之上；随约雅斤往东去；在远处成了一点余烬；王的席上重新亮起
  let LP = null;
  function lampTarget(ph) {
    if (S.lamp === 'jeh') { const p = figPt('jeh', 1.28); if (p) return p; }
    if (S.lamp === 'palace') { const P = palGeo(ph); return [(X.pal1 - 0.012) * W.w, P.g - P.H - 0.44 * ph]; }
    if (S.lamp === 'table') { const g = fieldY(X.table + 0.018, 0.3); return [(X.table + 0.018 + 0.006) * W.w, g - 0.5 * ph * vK(0.3) - 0.16 * ph]; }
    if (S.lamp === 'prison') return [(X.babC + 0.022) * W.w, fieldY(X.babC + 0.022, 0.12) - 0.3 * ph];
    return [X.east * W.w + 0.4 * ph, fieldY(X.east, 0.2) - 0.55 * ph];
  }
  function drawLamp(ctx, ph) {
    const k = W.lv.exLamp;
    if (k < 0.01 || !LP) return;
    SP || sprites();
    const [x, y] = LP, nk = nightK();
    const r = (0.12 + 0.07 * k) * ph, kk = Math.min(1, k * 1.4);
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, r * (6 + 6 * k), kk * (0.35 + 0.45 * nk));
    glowSp(ctx, SP.warm, x, y, r * 2.6, kk * 0.75);
    ctx.globalCompositeOperation = 'source-over';
    // 小小的陶灯
    if (S.lamp === 'table' || S.lamp === 'palace' || S.lamp === 'prison') {
      ctx.fillStyle = css([156, 108, 72], 2, Math.min(1, k * 2), 0.15);
      ctx.beginPath(); ctx.ellipse(x, y + r * 0.9, r * 1.1, r * 0.42, 0, 0, TAU); ctx.moveTo(x + r * 1.1, y + r * 0.8); ctx.lineTo(x + r * 1.8, y + r * 0.55); ctx.lineTo(x + r * 1.0, y + r * 0.5); ctx.fill();
    }
    flame(ctx, x + r * 1.2, y + r * 0.6, r * 2.3 * (0.6 + 0.4 * k), Math.min(1, k * 1.3), 21.3, true);
  }
  // 律法书（在手中发光）
  function drawScroll(ctx, ph) {
    if (!S.scroll) return;
    const f = fig(S.scroll);
    if (!f) return;
    const p = figPt(S.scroll, 0.56);
    if (!p) return;
    SP || sprites();
    const dir = f.facing || 1, x = p[0] + dir * 0.2 * ph, y = p[1], w = 0.2 * ph, h = 0.1 * ph;
    ctx.globalCompositeOperation = 'lighter';
    glowSp(ctx, SP.gold, x, y, 0.9 * ph, 0.55 * (f.alpha == null ? 1 : f.alpha));
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(250,238,208,0.95)';
    ctx.fillRect(x - w, y - h, w * 2, h * 2);
    ctx.fillStyle = 'rgba(190,160,120,0.95)';
    ctx.fillRect(x - w - 1, y - h * 1.2, Math.max(1.5, w * 0.25), h * 2.4); ctx.fillRect(x + w - 1, y - h * 1.2, Math.max(1.5, w * 0.25), h * 2.4);
  }
  // 立约的柱旁：一道自天而降的光（23:3）
  function drawCov(ctx, ph) {
    const k = W.lv.exCov;
    if (k < 0.01) return;
    SP || sprites();
    const x = X.pil[0] * W.w - 0.02 * W.w, top = 0, bot = fieldY(X.pil[0], 0.12);
    const w = 1.5 * ph;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.4 * k;
    ctx.drawImage(SP.beam, x - w, top, w * 2, bot - top);
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.gold, x, bot - 0.6 * ph, 1.8 * ph, 0.4 * k);
    ctx.globalCompositeOperation = 'source-over';
  }
  // 使者的光（19:35）：随使者走过亚述营
  function drawAngelLight(ctx, ph) {
    const f = fig('angel');
    if (!f) return;
    const p = figPt('angel', 0.5);
    if (!p) return;
    SP || sprites();
    const a = f.alpha == null ? 1 : f.alpha;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.3 * a;
    ctx.drawImage(SP.beam, p[0] - 1.6 * ph, 0, 3.2 * ph, p[1] + 0.8 * ph);
    ctx.globalAlpha = 1;
    glowSp(ctx, SP.white, p[0], p[1], 2.4 * ph, 0.45 * a);
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 只关乎画面的短暂光影（篡位的红光、魂的光、先知的光）──────────
  const FXL = [];
  function fxAdd(e) { if (!W.replaying) FXL.push(Object.assign({ t: 0 }, e)); }
  function drawFX(ctx, ph) {
    if (!FXL.length) return;
    SP || sprites();
    ctx.globalCompositeOperation = 'lighter';
    for (const e of FXL) {
      const k = clamp(e.t / e.dur, 0, 1), a = Math.sin(Math.PI * k);
      if (e.type === 'coup') {
        const x = X.sam * W.w, y = gY(1, X.sam) - 1.4 * PH(1);
        glowSp(ctx, SP.red, x, y, PH(1) * (2 + 2 * k), a * 0.7);
      } else if (e.type === 'soul') {
        const x = e.x * W.w + Math.sin(k * 5) * 6, y = (e.y - 0.14 * k) * W.h;
        glowSp(ctx, SP.gold, x, y, ph * (0.6 + k), a * 0.7);
        glowSp(ctx, SP.white, x, y, ph * 0.25, a * 0.9);
      } else if (e.type === 'out') {
        const x = e.x * W.w, y = e.y * W.h;
        glowSp(ctx, SP.warm, x, y, ph * (1.2 - k), (1 - k) * 0.7);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function soul(b, id) {
    if (b.instant) return;
    const p = figPt(id, 0.4);
    if (p) fxAdd({ type: 'soul', dur: 4.5, x: p[0] / W.w, y: p[1] / W.h });
  }

  // 火中飞起的火星（只关乎画面）
  const EM = [];
  function embers(dt) {
    const b = W.lv.exBurn;
    if (b > 0.3 && !W.replaying && EM.length < 90 && Math.random() < b * dt * 40) {
      const ph = PH(2), G = temGeo(ph);
      const x = lerp(X.pal0, X.tem1, Math.random());
      EM.push({ x: x * W.w, y: G.base - G.porchH * Math.random() * 0.8, vx: (Math.random() - 0.3) * 14 * SU(), vy: -(24 + 40 * Math.random()) * SU(), t: 0, dur: 2 + 2.5 * Math.random() });
    }
    for (let i = EM.length - 1; i >= 0; i--) {
      const e = EM[i];
      e.t += dt; e.x += (e.vx + W.wind * 10) * dt; e.y += e.vy * dt; e.vy *= 0.995;
      if (e.t > e.dur) EM.splice(i, 1);
    }
  }
  function drawEmbers(ctx) {
    if (!EM.length) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgb(255,168,80)';
    for (const e of EM) {
      const a = Math.sin(Math.PI * clamp(e.t / e.dur, 0, 1));
      ctx.globalAlpha = a * 0.9;
      ctx.fillRect(e.x, e.y, Math.max(1, 1.6 * SU()), Math.max(1, 1.6 * SU()));
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  布景
  // ════════════════════════════════════════════════════════════
  function drawNear(ctx) {
    const ph = PH(2);
    drawCamp(ctx, ph, 'as');
    drawCamp(ctx, ph, 'bab');
    drawKidron(ctx, ph);
    drawTrees(ctx, ph);
    const boxes = drawHouses(ctx, ph);
    const P = drawPalace(ctx, ph);
    const G = drawTemple(ctx, ph);
    drawHouseLights(ctx, boxes, ph);
    drawWall(ctx, ph);
    drawCourt(ctx, ph);
    drawMound(ctx, ph);
    drawStair(ctx, ph);
    drawCityFire(ctx, ph, boxes, P, G);
    drawBabel(ctx, ph);
    drawVines(ctx, ph);
    drawMat(ctx, ph);
    drawLetter(ctx, ph);
    drawGold(ctx, ph);
    drawTable(ctx, ph);
  }
  const SCENE = {
    init() {
      sprites();
      try { if (document.fonts && document.fonts.load) document.fonts.load('20px "GS Kai"', GEN.join('')).then(() => TXT.clear()).catch(() => {}); } catch (e) { /* 用系统字 */ }
    },
    resize() {
      LP = null;
      if (!isCur()) return;
      const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
      W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    },
    update(dt) {
      if (!isCur()) { FXL.length = 0; EM.length = 0; return; }
      const f = dt * (W.fast || 1);
      for (let i = FXL.length - 1; i >= 0; i--) { FXL[i].t += f; if (FXL[i].t >= FXL[i].dur) FXL.splice(i, 1); }
      embers(f);
      // 大卫的灯缓缓移向它该在的地方（只关乎画面）
      const tg = lampTarget(PH(2));
      if (!LP || W.replaying) LP = tg.slice();
      else { const k = 1 - Math.exp(-3 * f); LP[0] += (tg[0] - LP[0]) * k; LP[1] += (tg[1] - LP[1]) * k; }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'sky') { drawCrowns(ctx); drawHalo(ctx); return; }
      if (pass === 'far') { drawTowns(ctx, 0); drawHigh(ctx, 0); return; }
      if (pass === 'mid') { drawTowns(ctx, 1); drawSamaria(ctx); drawHigh(ctx, 1); return; }
      if (pass === 'near') { drawNear(ctx); return; }
      if (pass === 'air') {
        const ph = PH(2);
        drawDome(ctx, ph); drawCov(ctx, ph); drawAngelLight(ctx, ph); drawLine(ctx, ph);
        drawEmbers(ctx); drawScroll(ctx, ph); drawLamp(ctx, ph); drawFX(ctx, ph);
      }
    },
    draw() {},
    reset() { FXL.length = 0; EM.length = 0; LP = null; },
    restore() { FXL.length = 0; EM.length = 0; LP = null; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const cand = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py - 10, d }; };
      const ph = PH(2), G = temGeo(ph), P = palGeo(ph), ruin = ruinK();
      if (ruin < 0.5) {
        cand('圣殿', X.temC * W.w, G.base - G.porchH * 0.6);
        cand('王宫', X.palC * W.w, P.g - P.H * 0.6);
        const SG = stairGeo(ph);
        cand('亚哈斯的日晷', (SG.x0 + SG.x1) / 2, (SG.y0 + SG.y1) / 2);
        cand('殿的铜柱', X.pil[0] * W.w, G.base - G.pilH * 0.6);
        cand('耶路撒冷', 0.93 * W.w, gY(2, 0.93) - 1.2 * ph);
      } else {
        cand('耶路撒冷的废墟', X.temC * W.w, G.base - 0.5 * ph);
        if (W.lv.exVines > 0.3) cand('葡萄园', 0.8 * W.w, fieldY(0.8, 0.6) - 0.4 * ph);
      }
      cand('撒马利亚', X.sam * W.w, gY(1, X.sam) - PH(1));
      if (W.lv.exHigh > 0.3) { const h = HIGH[1]; cand('邱坛', h[1] * W.w, gY(1, h[1]) - PH(1) * 0.4); }
      if (S.serpent === 'whole') cand('铜蛇', X.serp * W.w, fieldY(X.serp, 0.1) - 1.1 * ph);
      if (W.lv.exAssyr > 0.5) cand('亚述营', 0.54 * W.w, fieldY(0.54, 0.2) - 0.5 * ph);
      if (W.lv.exBab > 0.5) cand('迦勒底人的营', 0.54 * W.w, fieldY(0.54, 0.2) - 0.5 * ph);
      if (W.lv.exBabel > 0.5) cand('巴比伦', X.babC * W.w, gY(2, X.babC) - 1.8 * ph);
      if (W.lv.exLetter > 0.5) cand('书信', (X.temC - 0.01) * W.w, fieldY(X.temC - 0.01, 0.1) - 0.2 * ph);
      if (W.lv.exLamp > 0.05 && LP) cand('大卫的灯', LP[0], LP[1]);
      return best;
    },
    // 给走查器：本卷的状态摘要（看完 == 直接恢复）
    sig() { return { lamp: S.lamp, serpent: S.serpent, scroll: S.scroll, gen4: S.gen4, table: S.table }; },
  };

  // ════════════════════════════════════════════════════════════
  //  幕后布置：黄昏，两国的灯（14:3–4；14:26–27）
  // ════════════════════════════════════════════════════════════
  function resetScene() { FXL.length = 0; EM.length = 0; LP = null; S = fresh(); }
  const LV0 = {
    exNorth: 1, exGen: 3, exCrown: 0, exHigh: 0.55, exAltar: 0, exSiege: 0, exAssyr: 0, exSweep: 0, exLetter: 0, exDome: 0, exBed: 0,
    exShadow: 12, exHalo: 0, exGold: 0, exIdol: 0, exGlory: 1, exLine: 0, exRepair: 0, exKidron: 0, exCov: 0, exPass: 0, exBab: 0,
    exMound: 0, exFamine: 0, exBreach: 0, exBurn: 0, exWalls: 0, exRuin: 0, exVines: 0, exBabel: 0, exLamp: 0.55, exTable: 0,
  };
  function setup() {
    const lv = Object.assign({ deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.35, land: 1, grass: 0.9, herbs: 0.55, trees: 0,
      lights: 1, moon: 1, stars: 1, life: 1, good: 0, given: 1, sabbath: 0, bare: 0.2, bloom: 0.4 }, LV0);
    for (const k in lv) if (!W.hasLevel || W.hasLevel(k)) W.set(k, lv[k], true);
    W.freeClock = false;
    const ox = W.w * 0.99, oy = W.ridgeBaseY(2, ox);
    W.setOrigin('grass', ox, oy); W.setOrigin('herbs', ox, oy); W.setOrigin('trees', ox, oy);
    W.goTo(0.765, 0, true);
    const lx = W.w * 0.8, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 80, W.w * 0.15, W.h * 0.8, true);
    W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 4, lx, ly, true);
    W.setPop('human', 0, lx, ly, true);
    resetScene();
    const c = C();
    c.clear({ fade: false });
    crowd('jeru', { n: 7, x0: 0.67, x1: 0.95, layer: 2, v: 0.3, label: '耶路撒冷的居民', from: 'none' });
    crowd('samP', { n: 5, x0: 0.535, x1: 0.6, layer: 1, label: '撒马利亚人', from: 'none' });
    avoid([0.42, 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  经文（新标点和合本）——每一句话的经文不过四行，故事随经文一同说完
  // ════════════════════════════════════════════════════════════
  const INTRO = [
    { text: '亚玛谢行耶和华眼中看为正的事……只是邱坛还没有废去，<br>百姓仍在那里献祭烧香。', ref: '列王纪下 14:3–4', hold: 6 },
    { text: '耶和华看见以色列人甚是艰苦……<br>耶和华并没有说要将以色列的名从天下涂抹，乃藉约阿施的儿子耶罗波安拯救他们。', ref: '列王纪下 14:26–27', hold: 7 },
  ];
  const V1 = [
    { text: '犹大王亚撒利雅三十八年，耶罗波安的儿子撒迦利雅在撒马利亚作以色列王六个月……<br>雅比的儿子沙龙背叛他，在百姓面前击杀他，篡了他的位。', ref: '列王纪下 15:8–10', hold: 7 },
    { text: '这是从前耶和华应许耶户说：「你的子孙必坐以色列的国位直到四代。」<br>这话果然应验了。', ref: '列王纪下 15:12', hold: 6 },
    { text: '以色列王比加年间，亚述王提革拉‧毗列色来夺了……加利利，和拿弗他利全地，<br>将这些地方的居民都掳到亚述去了。', ref: '列王纪下 15:29', hold: 6.5 },
  ];
  const V2 = [
    { text: '犹大王约坦的儿子亚哈斯登基……不像他祖大卫行耶和华他神眼中看为正的事……<br>并在邱坛上、山冈上、各青翠树下献祭烧香。', ref: '列王纪下 16:1–4', hold: 7 },
    { text: '亚哈斯王上大马士革去迎接亚述王提革拉‧毗列色，在大马士革看见一座坛……<br>祭司乌利亚照着亚哈斯王从大马士革送来的图样……建筑一座坛。', ref: '列王纪下 16:10–11', hold: 7 },
    { text: '但耶和华藉众先知、先见劝戒以色列人和犹大人说：「当离开你们的恶行，谨守我的诫命律例……」<br>他们却不听从，竟硬着颈项……', ref: '列王纪下 17:13–14', hold: 7 },
  ];
  const V3 = [
    { text: '亚述王上来攻击以色列遍地，上到撒马利亚，围困三年。<br>何细亚第九年亚述王攻取了撒马利亚，将以色列人掳到亚述……', ref: '列王纪下 17:5–6', hold: 7 },
    { text: '所以耶和华向以色列人大大发怒，从自己面前赶出他们，<br>只剩下犹大一个支派。', ref: '列王纪下 17:18', hold: 6 },
    { text: '……这样，以色列人从本地被掳到亚述，直到今日。', ref: '列王纪下 17:23', hold: 5.5 },
  ];
  const V4 = [
    { text: '希西家行耶和华眼中看为正的事……他废去邱坛，毁坏柱像，砍下木偶，<br>打碎摩西所造的铜蛇……', ref: '列王纪下 18:3–4', hold: 6 },
    { text: '希西家倚靠耶和华以色列的神……<br>耶和华与他同在，他无论往何处去尽都亨通。', ref: '列王纪下 18:5–7', hold: 5.5 },
    { text: '希西家王十四年，亚述王西拿基立上来攻击犹大的一切坚固城……<br>亚述王从拉吉差遣……拉伯沙基率领大军往耶路撒冷。', ref: '列王纪下 18:13–17', hold: 6 },
    { text: '拉伯沙基站着，用犹大言语大声喊着说：「……难道耶和华能救耶路撒冷脱离我的手吗？」<br>百姓静默不言，并不回答一句。', ref: '列王纪下 18:28–36', hold: 6.5 },
  ];
  const V5 = [
    { text: '希西家从使者手里接过书信来，看完了，<br>就上耶和华的殿，将书信在耶和华面前展开。', ref: '列王纪下 19:14', hold: 6 },
    { text: '希西家向耶和华祷告说：「……你是天下万国的神，你曾创造天地……<br>现在求你救我们脱离亚述王的手，使天下万国都知道惟独你耶和华是神！」', ref: '列王纪下 19:15–19', hold: 7 },
    { text: '所以，耶和华论亚述王如此说：「他必不得来到这城……<br>因我为自己的缘故，又为我仆人大卫的缘故，必保护拯救这城。」', ref: '列王纪下 19:32–34', hold: 7 },
  ];
  const V6 = [
    { text: '当夜，耶和华的使者出去，在亚述营中杀了十八万五千人。<br>清早有人起来，一看，都是死尸了。', ref: '列王纪下 19:35', hold: 9 },
    { text: '亚述王西拿基立就拔营回去，住在尼尼微。', ref: '列王纪下 19:36', hold: 5.5 },
  ];
  const V7 = [
    { text: '那时，希西家病得要死。亚摩斯的儿子先知以赛亚去见他，对他说：<br>「耶和华如此说：你当留遗命与你的家，因为你必死，不能活了。」', ref: '列王纪下 20:1', hold: 7 },
    { text: '希西家就转脸朝墙，祷告耶和华说：「耶和华啊，求你记念我……」<br>希西家就痛哭了。', ref: '列王纪下 20:2–3', hold: 6 },
    { text: '「……我听见了你的祷告，看见了你的眼泪，我必医治你……」<br>以赛亚说：「当取一块无花果饼来。」……贴在疮上，王便痊愈了。', ref: '列王纪下 20:5–7', hold: 7 },
  ];
  const V8 = [
    { text: '以赛亚说：「……你要日影向前进十度呢？是要往后退十度呢？」<br>希西家回答说：「日影向前进十度容易，我要日影往后退十度。」', ref: '列王纪下 20:9–10', hold: 6.5 },
    { text: '先知以赛亚求告耶和华，耶和华就使亚哈斯的日晷向前进的日影，<br>往后退了十度。', ref: '列王纪下 20:11', hold: 6 },
    { text: '那时，巴比伦王巴拉但的儿子米罗达‧巴拉但……就送书信和礼物给他……<br>希西家没有一样不给他们看的。', ref: '列王纪下 20:12–13', hold: 5.5 },
    { text: '「日子必到，凡你家里所有的，并你列祖积蓄到如今的，<br>都要被掳到巴比伦去，不留下一样。这是耶和华说的。」', ref: '列王纪下 20:17', hold: 6 },
  ];
  const V9 = [
    { text: '玛拿西登基的时候年十二岁……行耶和华眼中看为恶的事……<br>又为巴力筑坛，做亚舍拉像……且敬拜事奉天上的万象。', ref: '列王纪下 21:1–3', hold: 7 },
    { text: '所以耶和华以色列的神如此说：我必降祸与耶路撒冷和犹大，<br>叫一切听见的人无不耳鸣。', ref: '列王纪下 21:12', hold: 6 },
    { text: '我必用量撒马利亚的准绳和亚哈家的线铊拉在耶路撒冷上，<br>必擦净耶路撒冷，如人擦盘，将盘倒扣。', ref: '列王纪下 21:13', hold: 6.5 },
  ];
  const V10 = [
    { text: '大祭司希勒家对书记沙番说：「我在耶和华殿里得了律法书。」<br>希勒家将书递给沙番，沙番就看了。', ref: '列王纪下 22:8', hold: 6.5 },
    { text: '沙番就在王面前读那书。<br>王听见律法书上的话，便撕裂衣服。', ref: '列王纪下 22:10–11', hold: 5.5 },
    { text: '「……你便心里敬服，在我面前自卑，撕裂衣服，向我哭泣，<br>因此我应允了你。这是我耶和华说的。」', ref: '列王纪下 22:19', hold: 6.5 },
  ];
  const V11 = [
    { text: '王就把耶和华殿里所得的约书念给他们听。<br>王站在柱旁，在耶和华面前立约……众民都服从这约。', ref: '列王纪下 23:2–3', hold: 6.5 },
    { text: '在约西亚以前没有王像他尽心、尽性、尽力地归向耶和华，遵行摩西的一切律法；<br>在他以后也没有兴起一个王像他。', ref: '列王纪下 23:25', hold: 6.5 },
    { text: '然而，耶和华向犹大所发猛烈的怒气仍不止息，是因玛拿西诸事惹动他。', ref: '列王纪下 23:26', hold: 5.5 },
    { text: '约西亚年间，埃及王法老尼哥上到幼发拉底河攻击亚述王；约西亚王去抵挡他。<br>埃及王遇见约西亚在米吉多，就杀了他。', ref: '列王纪下 23:29', hold: 6.5 },
  ];
  const V12 = [
    { text: '耶和华使迦勒底军、亚兰军、摩押军，和亚扪人的军来攻击约雅敬，毁灭犹大……<br>这祸临到犹大人，诚然是耶和华所命的……', ref: '列王纪下 24:2–3', hold: 7 },
    { text: '那时，巴比伦王尼布甲尼撒的军兵上到耶路撒冷，围困城……<br>犹大王约雅斤和他母亲、臣仆、首领、太监一同出城，投降巴比伦王。', ref: '列王纪下 24:10–12', hold: 7 },
    { text: '又将耶路撒冷的众民和众首领，并所有大能的勇士，共一万人……都掳了去……<br>并将约雅斤和王母……都从耶路撒冷掳到巴比伦去了。', ref: '列王纪下 24:14–15', hold: 7 },
  ];
  const V13 = [
    { text: '他作王第九年十月初十日，巴比伦王尼布甲尼撒率领全军来攻击耶路撒冷，<br>对城安营，四围筑垒攻城。', ref: '列王纪下 25:1', hold: 6.5 },
    { text: '城里有大饥荒，甚至百姓都没有粮食。<br>城被攻破，一切兵丁就在夜间……逃跑。', ref: '列王纪下 25:3–4', hold: 6 },
    { text: '用火焚烧耶和华的殿和王宫，又焚烧耶路撒冷的房屋……<br>跟从护卫长迦勒底的全军就拆毁耶路撒冷四围的城墙。', ref: '列王纪下 25:9–10', hold: 6.5 },
    { text: '那时护卫长尼布撒拉旦将城里所剩下的百姓……都掳去了。<br>但护卫长留下些民中最穷的，使他们修理葡萄园，耕种田地。', ref: '列王纪下 25:11–12', hold: 6.5 },
  ];
  const V14 = [
    { text: '犹大王约雅斤被掳后三十七年，巴比伦王以未‧米罗达元年十二月二十七日，<br>使犹大王约雅斤抬头，提他出监。', ref: '列王纪下 25:27', hold: 7 },
    { text: '又对他说恩言，使他的位高过与他一同在巴比伦众王的位，<br>给他脱了囚服。他终身常在王面前吃饭。', ref: '列王纪下 25:28–29', hold: 6.5 },
    { text: '王赐他所需用的食物，日日赐他一分，终身都是这样。', ref: '列王纪下 25:30', hold: 6 },
  ];

  // ════════════════════════════════════════════════════════════
  //  话语：神的应许与审判（15:12；17:13；17:18；19:34；20:5；21:12；22:19；23:27），
  //  与经上所记神的作为（18:7；19:35；20:11；23:26；24:3；25:27）
  // ════════════════════════════════════════════════════════════
  const JERU = [0.67, 0.95];
  const STAGES = [
    // ── 1 · 耶户的四代（15）──────────────────────────────────
    {
      kind: 'promise', utter: '你的子孙必坐以色列的国位直到四代', cmd: 'assert(耶户.子孙.length === 4)  # 这话果然应验了', ref: '15:12', tint: [255, 222, 160],
      verse: V1,
      apply(c) {
        const L = starts(V1);
        T(c, [
          [0, b => { W.goTo(0.8, 6, b.instant); W.set('exGen', 3, true); W.set('exCrown', 1, b.instant); sfx(b, 'harp', { soft: true }); }],
          [1.8, b => { W.set('exGen', 4, b.instant); const q = crownXY(3); sparkAt(b, q[0], q[1], 16, [255, 230, 170], 8, 'sky'); sfx(b, 'chime'); }],
          [L[0] + 4.6, b => { S.gen4 = true; W.set('exGen', 3, b.instant); fxAdd({ type: 'coup', dur: 1.2 }); sfx(b, 'wind', { soft: true, far: true }); }],
          [L[1] + 0.5, b => { W.set('exCrown', 0, b.instant); }],
          [L[1] + 1.8, b => fxAdd({ type: 'coup', dur: 0.9 })],
          [L[1] + 2.9, b => fxAdd({ type: 'coup', dur: 0.9 })],
          [L[1] + 4.0, b => fxAdd({ type: 'coup', dur: 1.1 })],
          [L[2] + 0.5, b => { W.set('exNorth', 0.62, b.instant); sfx(b, 'wind', { far: true }); }],
        ]);
      },
    },
    // ── 2 · 众先知的劝戒（16 — 17:14）────────────────────────
    {
      kind: 'cmd', utter: '当离开你们的恶行，谨守我的诫命律例', cmd: 'broadcast --via 众先知,先见 "当离开你们的恶行"  # 他们却不听从', ref: '17:13', tint: [236, 220, 196],
      verse: V2,
      apply(c) {
        const L = starts(V2);
        T(c, [
          [0, b => {
            W.goTo(0.3, 6, b.instant);
            add('ahaz', { label: '亚哈斯王', sex: 'm', age: 'adult', x: 0.735, v: 0.22, facing: 1, robe: ROBE.king, accent: [226, 190, 120], glow: 0.18, from: b.instant ? 'none' : 'fade' });
          }],
          [L[0] + 4.5, b => { W.set('exHigh', 1, b.instant); }],
          [L[1] + 0.5, b => {
            W.set('exAltar', 1, b.instant);
            add('uriah', { label: '祭司乌利亚', sex: 'm', age: 'elder', x: 0.79, v: 0.16, facing: -1, robe: ROBE.priest, prop: null, glow: 0.12, from: b.instant ? 'none' : 'fade' });
            walk('ahaz', 0.757, { speed: 0.012, pose: 'bow' });
            sfx(b, 'build', { soft: true });
          }],
          [L[2], b => {
            add('pro1', { label: '先知', sex: 'm', age: 'elder', x: 0.985, v: 0.36, facing: -1, robe: ROBE.prophet, prop: 'staff', glow: 0.4, from: b.instant ? 'none' : 'fade' });
            walk('pro1', 0.905, { speed: 0.02, pose: 'raise' });
            add('pro2', { label: '先见', sex: 'm', age: 'adult', layer: 1, x: 0.61, facing: -1, robe: ROBE.prophet, glow: 0.4, pose: 'raise', from: b.instant ? 'none' : 'fade' });
          }],
          [L[2] + 3.4, b => {
            const p = figPt('pro1', 1.5);
            if (p) wordsAt(b, '当离开你们的恶行', p[0] - 0.09 * W.w, p[1] - 0.04 * W.h, [255, 232, 186], { size: 0.026, hold: 2.2 });
            crowdFace('jeru', 1);
          }],
          [L[2] + 6.2, b => { crowdFace('jeru', -1); crowdPose('jeru', 'stand'); pose('pro1', 'stand'); pose('pro2', 'stand'); }],
        ]);
      },
    },
    // ── 3 · 北国的灯熄灭（17）——第一幅大画 ──────────────────────
    {
      kind: 'judge', utter: '耶和华向以色列人大大发怒', cmd: 'exile --kingdom 以色列 --to 亚述 && keep 犹大  # 只剩下一个支派', ref: '17:18', tint: [230, 150, 120],
      verse: V3,
      apply(c) {
        const L = starts(V3);
        T(c, [
          [0, b => {
            W.goTo(0.87, 6, b.instant);
            rm('ahaz'); rm('uriah'); rm('pro1'); rm('pro2');
            W.set('exSiege', 1, b.instant);
            add('asN1', { label: '亚述兵', sex: 'm', age: 'adult', layer: 1, x: 0.5, facing: 1, robe: ROBE.assyr, prop: 'torch', glow: 0.2, from: b.instant ? 'none' : 'fade' });
            add('asN2', { label: '亚述兵', sex: 'm', age: 'adult', layer: 1, x: 0.63, facing: -1, robe: ROBE.assyr, prop: 'torch', glow: 0.2, from: b.instant ? 'none' : 'fade' });
            sfx(b, 'fire', { far: true });
          }],
          [L[0] + 3.5, b => { W.set('exNorth', 0, b.instant); sfx(b, 'wind', { far: true }); }],
          [L[0] + 5, b => { crowdWalk('samP', 0.49, 0.515, { speed: 0.012 }); walk('asN2', 0.525, { speed: 0.012 }); sfx(b, 'weep', { soft: true, far: true }); }],
          [L[1] + 1, b => { W.set('exSiege', 0, b.instant); }],
          [L[2], b => { uncrowd('samP'); rm('asN1'); rm('asN2'); }],
        ]);
      },
    },
    // ── 4 · 希西家（18）─────────────────────────────────────
    {
      kind: 'act', utter: '耶和华与他同在', cmd: 'rm -rf 邱坛 柱像 木偶 铜蛇 && trust 耶和华', ref: '18:7', tint: [255, 226, 170],
      verse: V4,
      apply(c) {
        const L = starts(V4);
        T(c, [
          [0, b => {
            W.goTo(0.3, 5, b.instant);
            add('hez', { label: '希西家', sex: 'm', age: 'adult', x: 0.875, v: 0.3, facing: 1, robe: ROBE.hez, accent: [230, 196, 120], glow: 0.3, from: b.instant ? 'none' : 'fade' });
            walk('hez', 0.895, { speed: 0.01 });
            crowdFace('jeru', 1);
          }],
          [L[0] + 4.2, b => {
            W.set('exHigh', 0, b.instant);
            S.serpent = 'broken';
            sparkAt(b, X.serp * W.w, fieldY(X.serp, 0.1) - 1.2 * PH(2), 22, [230, 170, 90], 12);
            sfx(b, 'build');
          }],
          [L[1], b => { W.set('exGlory', 1.2, b.instant); glow('hez', 0.75); ringFig(b, 'hez', [255, 232, 180], 2.4); sfx(b, 'harp'); }],
          [L[2], b => {
            W.goTo(0.47, 6, b.instant);
            W.set('exAssyr', 1, b.instant);
            ['as0', 'as1', 'as2', 'as3', 'as4', 'as5'].forEach((id, i) => add(id, { label: '亚述兵', sex: 'm', age: 'adult', x: [0.474, 0.5, 0.522, 0.54, 0.556, 0.488][i], v: [0.2, 0.34, 0.18, 0.42, 0.26, 0.52][i], facing: 1, robe: ROBE.assyr, accent: [200, 150, 90], prop: null, glow: 0.08, from: b.instant ? 'none' : 'fade' }));
            sfx(b, 'crowd', { far: true });
          }],
          [L[3], b => {
            add('rab', { label: '拉伯沙基', sex: 'm', age: 'adult', x: 0.568, v: 0.26, facing: 1, robe: ROBE.rab, accent: [214, 170, 90], glow: 0.1, pose: 'raise', from: b.instant ? 'none' : 'fade' });
            crowdFace('jeru', -1); crowdPose('jeru', 'stand'); glow('hez', 0.35);
          }],
          [L[3] + 3.5, b => { pose('rab', 'point'); }],
        ]);
      },
    },
    // ── 5 · 书信在耶和华面前展开（19:1–34）────────────────────
    {
      kind: 'promise', utter: '必保护拯救这城', cmd: 'shield 耶路撒冷 --for 大卫的缘故  # 他必不得来到这城', ref: '19:34', tint: [255, 230, 176],
      verse: V5,
      apply(c) {
        const L = starts(V5);
        T(c, [
          [0, b => {
            W.goTo(0.58, 6, b.instant);
            S.serpent = 'none';
            pose('rab', 'stand');
            S.scroll = 'hez';
            walk('hez', 0.815, { speed: 0.02 });
          }],
          [L[0] + 3.2, b => { S.scroll = null; W.set('exLetter', 1, b.instant); pose('hez', 'pray'); face('hez', 1); sfx(b, 'seal', { soft: true }); }],
          [L[1] + 0.5, b => { glow('hez', 0.7); ringFig(b, 'hez', [255, 236, 190], 2); }],
          [L[2], b => {
            add('isaiah', { label: '以赛亚', sex: 'm', age: 'elder', x: 0.94, v: 0.34, facing: -1, robe: ROBE.isaiah, prop: 'staff', glow: 0.45, from: b.instant ? 'none' : 'fade' });
            pose('isaiah', 'raise');
            W.set('exDome', 1, b.instant);
            sfx(b, 'angel', { soft: true });
          }],
          [L[2] + 3.5, b => { pose('isaiah', 'stand'); pose('hez', 'stand'); W.set('exLetter', 0.35, b.instant); walk('rab', 0.512, { speed: 0.02 }); }],
        ]);
      },
    },
    // ── 6 · 当夜（19:35–36）——第二幅大画 ──────────────────────
    {
      kind: 'act', utter: '当夜，耶和华的使者出去', cmd: 'for (火 of 亚述营) 火.off()  # 清早，拔营回去', ref: '19:35', tint: [230, 236, 255],
      verse: V6,
      apply(c) {
        const L = starts(V6);
        const SOL = [['as0', 0.474], ['as1', 0.5], ['as2', 0.522], ['as3', 0.54], ['as4', 0.556], ['as5', 0.488], ['rab', 0.512]];
        const t0 = 2.4, dur = 1 / LV.exSweep[1];
        const tOf = x => t0 + clamp((SW0 - x) / (SW0 - SW1), 0, 1) * dur;
        const beats = [
          [0, b => {
            W.goTo(0.97, 4.5, b.instant);
            rm('hez'); rm('isaiah');
            W.set('exLetter', 0, b.instant); W.set('exDome', 0.45, b.instant);
            crowdPose('jeru', 'sit');
          }],
          [1.2, b => {
            add('angel', { label: '耶和华的使者', angel: true, x: SW0 + 0.004, v: 0.26, facing: -1, glow: 1, from: b.instant ? 'none' : 'light' });
            sfx(b, 'angel');
          }],
          [t0, b => { W.set('exSweep', 1, b.instant); walk('angel', SW1, { speed: (SW0 - SW1) / dur }); }],
          [t0 + dur + 0.6, b => { rm('angel'); W.set('exDome', 0, b.instant); }],
          [L[1] - 0.2, b => { W.goTo(0.27, 5, b.instant); }],
          [L[1] + 2.5, b => { W.set('exAssyr', 0, b.instant); crowdPose('jeru', 'stand'); }],
        ];
        SOL.forEach(([id, x]) => beats.push([tOf(x), b => { rm(id); if (!b.instant) fxAdd({ type: 'out', dur: 1.2, x, y: fieldY(x, 0.3) / W.h - 0.02 }); }]));
        T(c, beats);
      },
    },
    // ── 7 · 希西家病得要死（20:1–7）──────────────────────────
    {
      kind: 'promise', utter: '我听见了你的祷告，看见了你的眼泪', cmd: 'heal 希西家 --add-years 15 --on-day 3', ref: '20:5', tint: [255, 226, 186],
      verse: V7,
      apply(c) {
        const L = starts(V7);
        T(c, [
          [0, b => {
            W.goTo(0.36, 5, b.instant);
            W.set('exSweep', 0, true);
            W.set('exBed', 1, b.instant);
            add('hez', { label: '希西家', sex: 'm', age: 'adult', x: X.palC + 0.006, v: 0.36, facing: 1, robe: ROBE.hez, accent: [230, 196, 120], glow: 0.15, pose: 'lie', from: b.instant ? 'none' : 'fade' });
            add('isaiah', { label: '以赛亚', sex: 'm', age: 'elder', x: 0.6, v: 0.32, facing: 1, robe: ROBE.isaiah, prop: 'staff', glow: 0.35, from: b.instant ? 'none' : 'fade' });
            walk('isaiah', 0.676, { speed: 0.025, pose: 'point' });
          }],
          [L[1], b => { pose('hez', 'lie', { weep: true }); walk('isaiah', 0.61, { speed: 0.02 }); sfx(b, 'weep', { soft: true }); }],
          [L[2], b => { walk('isaiah', 0.68, { speed: 0.03, pose: 'point' }); }],
          [L[2] + 1.8, b => { glow('hez', 0.85); ringFig(b, 'hez', [255, 230, 176], 2.4); sfx(b, 'harp'); }],
          [L[2] + 4.2, b => { pose('hez', 'stand'); face('hez', -1); W.set('exBed', 0, b.instant); }],
          [L[3] - 0.5, b => { glow('hez', 0.4); pose('isaiah', 'stand'); }],
        ]);
      },
    },
    // ── 8 · 日影往后退了十度（20:8–19）——第三幅大画 ──────────────
    {
      kind: 'act', utter: '往后退了十度', cmd: 'git reset --hard HEAD~10 日影  # 亚哈斯的日晷', ref: '20:11', tint: [255, 214, 150],
      verse: V8,
      apply(c) {
        const L = starts(V8);
        T(c, [
          [0, b => {
            W.goTo(0.66, 6, b.instant);
            walk('hez', 0.552, { speed: 0.03, pose: 'gaze' });
            walk('isaiah', 0.528, { speed: 0.03 });
            face('isaiah', 1);
          }],
          [2.5, b => { W.set('exShadow', 16, b.instant); }],
          [L[0] + 5, b => { pose('isaiah', 'raise'); }],
          [L[1] + 0.6, b => { W.set('exShadow', 6, b.instant); W.set('exHalo', 1, b.instant); sfx(b, 'harp'); if (!b.instant && W.sun) ringAt(b, W.sun.x, W.sun.y, [255, 236, 190], M() * 0.12, 2.4); }],
          [L[1] + 4.5, b => { pose('hez', 'kneel'); pose('isaiah', 'stand'); }],
          [L[2], b => {
            W.set('exHalo', 0, b.instant);
            add('env1', { label: '巴比伦的使者', sex: 'm', age: 'adult', x: 0.47, v: 0.3, facing: 1, robe: ROBE.envoy, accent: [226, 190, 110], glow: 0.08, from: b.instant ? 'none' : 'fade' });
            add('env2', { label: '巴比伦的使者', sex: 'm', age: 'elder', x: 0.445, v: 0.36, facing: 1, robe: [90, 110, 160], accent: [226, 190, 110], glow: 0.08, from: b.instant ? 'none' : 'fade' });
            walk('env1', 0.69, { speed: 0.05 }); walk('env2', 0.668, { speed: 0.05 });
            walk('hez', X.palC + 0.026, { speed: 0.035, pose: 'point' });
            animal('envCamel', 'camel', 0.42, { v: 0.3, facing: 1, from: b.instant ? 'none' : 'fade', pack: true, label: '骆驼' });
            walk('envCamel', 0.63, { speed: 0.045 });
          }],
          [L[2] + 3, b => { W.set('exGold', 1, b.instant); sfx(b, 'chime'); }],
          [L[3], b => { walk('isaiah', 0.705, { speed: 0.04, pose: 'point' }); W.set('exGold', 0.25, b.instant); pose('hez', 'bow'); }],
          [L[3] + 3, b => { walk('env1', 0.44, { speed: 0.04 }); walk('env2', 0.43, { speed: 0.04 }); walk('envCamel', 0.43, { speed: 0.04 }); }],
          [L[4] - 0.3, b => { rm('env1'); rm('env2'); rm('envCamel'); W.set('exGold', 0, b.instant); }],
        ]);
      },
    },
    // ── 9 · 玛拿西（21）────────────────────────────────────
    {
      kind: 'judge', utter: '我必降祸与耶路撒冷和犹大', cmd: 'measure 耶路撒冷 --line 撒马利亚 --plummet 亚哈家', ref: '21:12', tint: [214, 180, 200],
      verse: V9,
      apply(c) {
        const L = starts(V9);
        T(c, [
          [0, b => {
            W.goTo(0.772, 6, b.instant);
            if (!b.instant) soul(b, 'hez');
            rm('hez'); rm('isaiah');
            add('man', { label: '玛拿西', sex: 'm', age: 'adult', x: 0.9, v: 0.28, facing: 1, robe: ROBE.man, accent: [220, 180, 120], glow: 0.05, from: b.instant ? 'none' : 'fade' });
          }],
          [L[0] + 1.5, b => {
            W.set('exHigh', 1, b.instant); W.set('exIdol', 1, b.instant); W.set('exGlory', 0.3, b.instant);
            crowdWalk('jeru', 0.86, 0.97, { speed: 0.02, pose: 'bow' });
            pose('man', 'raise');
          }],
          [L[1], b => { pose('man', 'stand'); W.set('exLine', 0.35, b.instant); sfx(b, 'thunder', { far: true, soft: true }); }],
          [L[2], b => { W.set('exLine', 1, b.instant); sfx(b, 'chime'); }],
        ]);
      },
    },
    // ── 10 · 律法书（22）───────────────────────────────────
    {
      kind: 'promise', utter: '因此我应允了你', cmd: 'git blame 律法书 && ack 约西亚  # 心里敬服，在我面前自卑', ref: '22:19', tint: [255, 232, 190],
      verse: V10,
      apply(c) {
        const L = starts(V10);
        T(c, [
          [0, b => {
            W.goTo(0.33, 5, b.instant);
            W.set('exLine', 0, b.instant);
            rm('man');
            crowdWalk('jeru', JERU[0], JERU[1], { speed: 0.03 });
            add('jos', { label: '约西亚', sex: 'm', age: 'adult', x: 0.745, v: 0.3, facing: 1, robe: ROBE.jos, accent: [226, 196, 124], glow: 0.3, from: b.instant ? 'none' : 'fade' });
            W.set('exRepair', 1, b.instant);
            crowd('work', { n: 4, x0: X.tem0, x1: X.tem1, layer: 2, v: 0.05, label: '修理殿的工人', robe: ROBE.work, pose: 'carry', mill: false, from: b.instant ? 'none' : 'fade' });
            sfx(b, 'build');
          }],
          [3.4, b => {
            add('hil', { label: '大祭司希勒家', sex: 'm', age: 'elder', x: X.temC, v: 0.1, facing: -1, robe: ROBE.priest, prop: null, glow: 0.3, from: b.instant ? 'none' : 'fade' });
            S.scroll = 'hil';
            sfx(b, 'chime');
          }],
          [4.4, b => { add('sha', { label: '书记沙番', sex: 'm', age: 'adult', x: 0.8, v: 0.2, facing: 1, robe: ROBE.scribe, glow: 0.12, from: b.instant ? 'none' : 'fade' }); }],
          [L[0] + 5.8, b => { S.scroll = 'sha'; walk('sha', 0.766, { speed: 0.025 }); face('sha', -1); }],
          [L[1], b => { pose('sha', 'carry'); face('sha', -1); face('jos', 1); }],
          [L[1] + 3, b => { pose('jos', 'weep', { weep: true }); sfx(b, 'weep', { soft: true }); }],
          [L[2], b => {
            add('huldah', { label: '女先知户勒大', sex: 'f', age: 'adult', x: 0.94, v: 0.36, facing: -1, robe: ROBE.huldah, glow: 0.45, from: b.instant ? 'none' : 'fade' });
            pose('huldah', 'raise');
            pose('jos', 'kneel');
          }],
          [L[2] + 2.5, b => { glow('jos', 0.85); ringFig(b, 'jos', [255, 234, 190], 2.4); W.set('exGlory', 0.8, b.instant); sfx(b, 'harp'); }],
          [L[3] - 0.5, b => { pose('huldah', 'stand'); }],
        ]);
      },
    },
    // ── 11 · 约西亚立约；然而怒气仍不止息（23）──────────────────
    {
      kind: 'judge', utter: '耶和华向犹大所发猛烈的怒气仍不止息', cmd: 'while (怒气) { /* 仍不止息 */ }  # 虽有约西亚', ref: '23:26', tint: [226, 170, 150],
      verse: V11,
      apply(c) {
        const L = starts(V11);
        T(c, [
          [0, b => {
            W.goTo(0.47, 5, b.instant);
            rm('huldah'); rm('hil'); rm('sha');
            uncrowd('work'); W.set('exRepair', 0, b.instant);
            S.scroll = 'jos';
            glow('jos', 0.5);
            walk('jos', X.pil[0] - 0.012, { speed: 0.03 });
            face('jos', -1);
            crowdWalk('jeru', 0.66, 0.79, { speed: 0.03 });
          }],
          [2.5, b => { W.set('exCov', 1, b.instant); crowdFace('jeru', 1); sfx(b, 'seal'); }],
          [L[0] + 4, b => { crowdPose('jeru', 'bow'); }],
          [L[1], b => {
            W.set('exIdol', 0, b.instant); W.set('exHigh', 0, b.instant); W.set('exAltar', 0, b.instant);
            W.set('exKidron', 1, b.instant); W.set('exGlory', 1.25, b.instant);
            W.goTo(0.785, 8, b.instant);
            crowdPose('jeru', 'stand');
            sfx(b, 'fire');
          }],
          [L[1] + 3.5, b => { W.set('exPass', 1, b.instant); W.set('exCov', 0, b.instant); sfx(b, 'harp', { soft: true }); }],
          [L[2], b => { W.set('exKidron', 0, b.instant); W.set('exGlory', 0.7, b.instant); S.scroll = null; W.set('exPass', 0.45, b.instant); sfx(b, 'thunder', { far: true, soft: true }); }],
          [L[3], b => { walk('jos', 0.5, { speed: 0.05 }); }],
          [L[3] + 4.8, b => { soul(b, 'jos'); rm('jos'); W.set('exPass', 0, b.instant); }],
        ]);
      },
    },
    // ── 12 · 约雅斤被掳（24）────────────────────────────────
    {
      kind: 'act', utter: '这祸临到犹大人，诚然是耶和华所命的', cmd: 'deport 约雅斤 王母 一万人 --to 巴比伦 && mv 大卫的灯 → 东', ref: '24:3', tint: [210, 190, 200],
      verse: V12,
      apply(c) {
        const L = starts(V12);
        T(c, [
          [0, b => {
            W.goTo(0.34, 5, b.instant);
            W.set('exBab', 1, b.instant);
            add('jeh', { label: '约雅斤', sex: 'm', age: 'adult', x: 0.745, v: 0.3, facing: -1, robe: ROBE.jeh, accent: [226, 190, 120], glow: 0.25, from: b.instant ? 'none' : 'fade' });
            add('jehmom', { label: '王母尼护施她', sex: 'f', age: 'elder', x: 0.765, v: 0.34, facing: -1, robe: ROBE.mom, glow: 0.12, from: b.instant ? 'none' : 'fade' });
            crowd('bab', { n: 6, x0: 0.465, x1: 0.56, layer: 2, v: 0.28, label: '迦勒底兵', robe: ROBE.bab, prop: null, mill: false, from: b.instant ? 'none' : 'fade' });
            crowdFace('bab', 1);
            sfx(b, 'crowd', { far: true });
          }],
          [L[1] + 1, b => {
            add('nebu', { label: '巴比伦的将领', sex: 'm', age: 'adult', x: 0.566, v: 0.24, facing: 1, robe: ROBE.nebu, accent: [230, 196, 110], prop: null, glow: 0.08, from: b.instant ? 'none' : 'fade' });
            walk('jeh', 0.598, { speed: 0.03, pose: 'bow' });
            follow('jehmom', 'jeh', 0.03);
            S.lamp = 'jeh';
            sfx(b, 'gate');
          }],
          [L[2], b => {
            W.set('exGlory', 0.35, b.instant);
            crowd('cap1', { n: 8, x0: 0.66, x1: 0.8, layer: 2, v: 0.4, label: '被掳的人', prop: 'bundle', from: b.instant ? 'none' : 'fade' });
            crowdWalk('cap1', 0.44, 0.52, { speed: 0.035 });
            walk('jeh', X.east + 0.012, { speed: 0.028 });
            crowdWalk('bab', 0.43, 0.5, { speed: 0.03 });
            walk('nebu', 0.47, { speed: 0.03 });
            sfx(b, 'weep', { soft: true });
          }],
          [L[2] + 5, b => {
            add('zed', { label: '西底家', sex: 'm', age: 'adult', x: 0.745, v: 0.3, facing: -1, robe: ROBE.zed, accent: [206, 176, 120], glow: 0.1, from: b.instant ? 'none' : 'fade' });
          }],
          [L[3] + 0.2, b => {
            S.lamp = 'east'; W.set('exLamp', 0.22, b.instant);
            rm('jeh'); rm('jehmom'); rm('nebu');
            uncrowd('cap1'); uncrowd('bab');
          }],
        ]);
      },
    },
    // ── 13 · 城被焚烧，城墙拆毁，百姓被掳（25:1–12）——本卷的签名 ────
    {
      kind: 'judge', utter: '我必弃掉我从前所选择的这城', cmd: 'burn 殿 王宫 房屋 && break 城墙 && exile 犹大  # 只留下修理葡萄园的', ref: '23:27', tint: [230, 120, 90],
      verse: V13,
      apply(c) {
        const L = starts(V13);
        T(c, [
          [0, b => {
            W.goTo(0.93, 6, b.instant);
            W.set('exBab', 1, b.instant); W.set('exMound', 1, b.instant);
            crowd('bab2', { n: 7, x0: 0.465, x1: 0.575, layer: 2, v: 0.3, label: '迦勒底兵', robe: ROBE.bab, prop: null, mill: false, from: b.instant ? 'none' : 'fade' });
            crowdFace('bab2', 1);
            face('zed', -1);
            sfx(b, 'crowd', { far: true });
          }],
          [L[1], b => { W.set('exFamine', 1, b.instant); W.set('exGlory', 0.15, b.instant); crowdPose('jeru', 'sit'); }],
          [L[1] + 3.2, b => {
            W.set('exBreach', 1, b.instant);
            dustAt(b, (segX(CITY.breach) + 0.01) * W.w, gY(2, segX(CITY.breach) + 0.01), 30, [160, 140, 110], 22);
            sfx(b, 'build'); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.55);
            walk('zed', 0.45, { speed: 0.07 });
          }],
          [L[2], b => {
            rm('zed');
            W.set('exBurn', 1, b.instant); W.set('exGlory', 0, b.instant); W.set('exLamp', 0.22, b.instant);
            crowdPose('jeru', 'weep');
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.35);
            sfx(b, 'fire');
          }],
          [L[2] + 3, b => { W.set('exWalls', 1, b.instant); sfx(b, 'build', { low: true }); if (!b.instant) W.shake = Math.max(W.shake || 0, 0.45); crowdWalk('bab2', 0.56, 0.66, { speed: 0.02 }); }],
          [L[2] + 5.5, b => { W.set('exRuin', 0.7, b.instant); }],
          [L[3], b => {
            crowdWalk('jeru', 0.44, 0.5, { speed: 0.035 });
            crowdWalk('bab2', 0.43, 0.49, { speed: 0.035 });
            W.set('exBurn', 0.3, b.instant); W.set('exRuin', 1, b.instant); W.set('exFamine', 0, b.instant);
            W.goTo(0.25, 9, b.instant);
            crowd('poor', { n: 3, x0: 0.72, x1: 0.9, layer: 2, v: 0.62, label: '民中最穷的', robe: [120, 104, 88], pose: 'kneel', mill: false, from: b.instant ? 'none' : 'fade' });
            W.set('exVines', 0.14, b.instant);
            sfx(b, 'weep', { soft: true });
          }],
          [L[4] - 0.2, b => { uncrowd('jeru'); uncrowd('bab2'); W.set('exBab', 0, b.instant); W.set('exBurn', 0, b.instant); W.set('exMound', 0, b.instant); }],
        ]);
      },
    },
    // ── 14 · 约雅斤抬头（25:27–30）──────────────────────────
    {
      kind: 'act', utter: '使犹大王约雅斤抬头', cmd: 'lift 约雅斤 --from 监 && seat --at 王的席 && light 大卫的灯  # 日日一分', ref: '25:27', tint: [255, 226, 170],
      verse: V14,
      apply(c) {
        const L = starts(V14);
        T(c, [
          [0, b => {
            W.goTo(0.21, 6, b.instant);
            W.set('exBabel', 1, b.instant); W.set('exVines', 1, b.instant);
            add('jeh', { label: '约雅斤', sex: 'm', age: 'elder', x: X.babC, v: 0.12, facing: 1, robe: ROBE.prison, accent: [150, 144, 136], glow: 0.05, pose: 'sit', from: b.instant ? 'none' : 'fade' });
            S.lamp = 'prison';
            crowdPose('poor', 'bow');
          }],
          [L[0] + 3.8, b => {
            W.set('exLamp', 1, b.instant);
            pose('jeh', 'gaze'); glow('jeh', 0.6);
            ringFig(b, 'jeh', [255, 232, 176], 2.6);
            sfx(b, 'harp');
          }],
          [L[1], b => {
            add('jeh', { robe: ROBE.freed, accent: [236, 204, 130] });
            glow('jeh', 0.8);
            add('evil', { label: '巴比伦王以未‧米罗达', sex: 'm', age: 'adult', x: X.table + 0.05, v: 0.3, facing: -1, robe: ROBE.evil, accent: [236, 200, 110], glow: 0.1, pose: 'seat', from: b.instant ? 'none' : 'fade' });
            W.set('exTable', 1, b.instant); S.table = true;
          }],
          [L[1] + 1.5, b => { walk('jeh', X.table - 0.01, { speed: 0.02, pose: 'seat' }); S.lamp = 'table'; }],
          [L[2], b => { W.goTo(0.29, 8, b.instant); crowdPose('poor', 'gaze'); crowdFace('poor', -1); sfx(b, 'harp', { soft: true }); }],
        ]);
      },
    },
  ];

  const BEHOLD_JERU = { text: '耶和华曾对大卫和他儿子所罗门说：「我在以色列众支派中所选择的耶路撒冷和这殿，必立我的名，直到永远。」', ref: '列王纪下 21:7' };
  GS.book.act({
    id: ACT, book: '列王纪下', books: [12], title: '亡国', sub: '列王纪下 14 — 25', tint: [220, 200, 190], music: 'cain',
    intro: INTRO,
    outro: 18,
    behold: {
      '耶路撒冷': BEHOLD_JERU,
      '圣殿': { text: '耶和华曾指着这殿说：「我必立我的名在耶路撒冷。」', ref: '列王纪下 21:4' },
      '耶路撒冷的废墟': { text: '跟从护卫长迦勒底的全军就拆毁耶路撒冷四围的城墙。', ref: '列王纪下 25:10' },
      '王宫': { text: '希西家其余的事和他的勇力，他怎样挖池、挖沟、引水入城，都写在犹大列王记上。', ref: '列王纪下 20:20' },
      '亚哈斯的日晷': { text: '先知以赛亚求告耶和华，耶和华就使亚哈斯的日晷向前进的日影，往后退了十度。', ref: '列王纪下 20:11' },
      '殿的铜柱': { text: '耶和华殿的铜柱，并耶和华殿的盆座和铜海，迦勒底人都打碎了，将那铜运到巴比伦去了。', ref: '列王纪下 25:13' },
      '撒马利亚': { text: '何细亚第九年亚述王攻取了撒马利亚，将以色列人掳到亚述，把他们安置在哈腊与歌散的哈博河边，并米底亚人的城邑。', ref: '列王纪下 17:6' },
      '撒马利亚人': { text: '亚述王上来攻击以色列遍地，上到撒马利亚，围困三年。', ref: '列王纪下 17:5' },
      '邱坛': { text: '只是邱坛还没有废去，百姓仍在那里献祭烧香。', ref: '列王纪下 14:4' },
      '铜蛇': { text: '他废去邱坛，毁坏柱像，砍下木偶，打碎摩西所造的铜蛇，因为到那时以色列人仍向铜蛇烧香。希西家叫铜蛇为铜块。', ref: '列王纪下 18:4' },
      '亚述营': { text: '当夜，耶和华的使者出去，在亚述营中杀了十八万五千人。', ref: '列王纪下 19:35' },
      '亚述兵': { text: '亚述王从拉吉差遣他珥探、拉伯撒利，和拉伯沙基率领大军往耶路撒冷，到希西家王那里去。', ref: '列王纪下 18:17' },
      '拉伯沙基': { text: '拉伯沙基说：「你们去告诉希西家说，亚述大王如此说：你所倚靠的有什么可仗赖的呢？」', ref: '列王纪下 18:19' },
      '书信': { text: '希西家从使者手里接过书信来，看完了，就上耶和华的殿，将书信在耶和华面前展开。', ref: '列王纪下 19:14' },
      '耶和华的使者': { text: '当夜，耶和华的使者出去，在亚述营中杀了十八万五千人。', ref: '列王纪下 19:35' },
      '希西家': { text: '希西家倚靠耶和华以色列的神，在他前后的犹大列王中没有一个及他的。', ref: '列王纪下 18:5' },
      '以赛亚': { text: '亚摩斯的儿子以赛亚就打发人去见希西家，说：「耶和华以色列的神如此说：你既然求我攻击亚述王西拿基立，我已听见了。」', ref: '列王纪下 19:20' },
      '亚哈斯王': { text: '亚哈斯王上大马士革去迎接亚述王提革拉‧毗列色，在大马士革看见一座坛，就照坛的规模样式作法画了图样，送到祭司乌利亚那里。', ref: '列王纪下 16:10' },
      '祭司乌利亚': { text: '祭司乌利亚就照着亚哈斯王所吩咐的行了。', ref: '列王纪下 16:16' },
      '先知': { text: '但耶和华藉众先知、先见劝戒以色列人和犹大人说：「当离开你们的恶行，谨守我的诫命律例……」', ref: '列王纪下 17:13' },
      '先见': { text: '但耶和华藉众先知、先见劝戒以色列人和犹大人说：「当离开你们的恶行，谨守我的诫命律例……」', ref: '列王纪下 17:13' },
      '巴比伦的使者': { text: '那时，巴比伦王巴拉但的儿子米罗达‧巴拉但听见希西家病而痊愈，就送书信和礼物给他。', ref: '列王纪下 20:12' },
      '玛拿西': { text: '玛拿西引诱他们行恶，比耶和华在以色列人面前所灭的列国更甚。', ref: '列王纪下 21:9' },
      '约西亚': { text: '约西亚行耶和华眼中看为正的事，行他祖大卫一切所行的，不偏左右。', ref: '列王纪下 22:2' },
      '大祭司希勒家': { text: '大祭司希勒家对书记沙番说：「我在耶和华殿里得了律法书。」', ref: '列王纪下 22:8' },
      '书记沙番': { text: '书记沙番又对王说：「祭司希勒家递给我一卷书。」沙番就在王面前读那书。', ref: '列王纪下 22:10' },
      '女先知户勒大': { text: '她对他们说：「耶和华以色列的神如此说：你们可以回复那差遣你们来见我的人……」', ref: '列王纪下 22:15' },
      '修理殿的工人': { text: '就是转交木匠和工人，并瓦匠，又买木料和凿成的石头修理殿宇。', ref: '列王纪下 22:6' },
      '耶路撒冷的居民': { text: '王和犹大众人与耶路撒冷的居民，并祭司、先知，和所有的百姓，无论大小，都一同上到耶和华的殿。', ref: '列王纪下 23:2' },
      '迦勒底兵': { text: '那时，巴比伦王尼布甲尼撒的军兵上到耶路撒冷，围困城。', ref: '列王纪下 24:10' },
      '迦勒底人的营': { text: '巴比伦王尼布甲尼撒率领全军来攻击耶路撒冷，对城安营，四围筑垒攻城。', ref: '列王纪下 25:1' },
      '巴比伦的将领': { text: '犹大王约雅斤和他母亲、臣仆、首领、太监一同出城，投降巴比伦王；巴比伦王便拿住他。', ref: '列王纪下 24:12' },
      '王母尼护施她': { text: '约雅斤登基的时候年十八岁，在耶路撒冷作王三个月。他母亲名叫尼护施她，是耶路撒冷人以利拿单的女儿。', ref: '列王纪下 24:8' },
      '被掳的人': { text: '又将一切勇士七千人和木匠、铁匠一千人，都是能上阵的勇士，全掳到巴比伦去了。', ref: '列王纪下 24:16' },
      '西底家': { text: '西底家登基的时候年二十一岁，在耶路撒冷作王十一年。', ref: '列王纪下 24:18' },
      '民中最穷的': { text: '但护卫长留下些民中最穷的，使他们修理葡萄园，耕种田地。', ref: '列王纪下 25:12' },
      '葡萄园': { text: '但护卫长留下些民中最穷的，使他们修理葡萄园，耕种田地。', ref: '列王纪下 25:12' },
      '巴比伦': { text: '又对他说恩言，使他的位高过与他一同在巴比伦众王的位。', ref: '列王纪下 25:28' },
      '巴比伦王以未‧米罗达': { text: '王赐他所需用的食物，日日赐他一分，终身都是这样。', ref: '列王纪下 25:30' },
      '约雅斤': { text: '给他脱了囚服。他终身常在王面前吃饭。', ref: '列王纪下 25:29' },
      '大卫的灯': { text: '耶和华却因他仆人大卫的缘故，仍不肯灭绝犹大，照他所应许大卫的话，永远赐灯光与他的子孙。', ref: '列王纪下 8:19' },
    },
    setup, stages: STAGES, scene: SCENE,
  });

})(window.GS);
