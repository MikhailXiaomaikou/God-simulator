/* ─────────────────────────────────────────────────────────────
 * book/song.js —— 雅歌 · 雅歌（雅歌 1 — 8）
 *
 * 「所罗门的歌，是歌中的雅歌。」冬天：灰的天、细雨，葡萄园里光秃的枝子，谷中的荆棘；
 * 北边远处是黎巴嫩的雪山（亚玛拿、示尼珥、黑门）。书拉密女在葡萄园里看守。
 * 「只管跟随羊群的脚踪去」——一行发光的蹄印引她到基达的黑帐棚旁，晌午羊群歇卧；
 * 「好像百合花在荆棘内」——荆棘中开出第一朵百合；黄昏她回家，窗里点起灯。
 * 良人在本卷里从不画成人形，也不画成走兽：他只是一团行走的光（「好像羚羊」是比喻——雪山坡上另有一对寻常的羚羊）。
 * 夜里这光从雪山上蹿山越岭而来，停在窗棂外，窗子从外面亮起来，
 * 「起来，与我同去！」——天将亮。「冬天已往，雨水止住过去了」（本卷的签名之景）：雨停云开，日出，
 * 遍地百花开放，树发芽开花，葡萄园吐叶放香，斑鸠飞来，百合满谷。磐石穴中的鸽子飞出；小狐狸被赶出葡萄园；
 * 日影飞去，光转回比特山。夜里她在城中寻找，看守的人的火把；寻见了。黎明，旷野上来烟柱：所罗门的轿与勇士，
 * 锡安的众女子出城观看。「你全然美丽，毫无瑕疵」——园墙升起：关锁的园、封闭的泉；泉水涌出，溪水流下，雪山上挂起细瀑。
 * 北风、南风吹过园子，花瓣与香气飘散；良人进入自己的园中。夜里敲门——「求你给我开门」——门开了，他已转身走了；
 * 「他的形状如黎巴嫩」——雪山在月光下发白。黎明，晨光如展开的旌旗：「回来，回来，书拉密女」；二人往葡萄园去，
 * 葡萄结串，石榴开花。苹果树下，心上的印记；海边的磐石上燃起「耶和华的烈焰」——风暴、电光、大水一浪高过一浪，
 * 却不能息灭（第二幅签名之景：浪一次次扑上岸边的磐石，火低一低，又更旺）。末了：「求你使我也得听见」——光跃上香草山，日出的金光照满山与园。
 *
 * 画面的方位：左 = 海；近地自左而右：海边的磐石 · 基达的帐棚 · 无花果树 · 园子（苹果树、百合、泉、石榴树）·
 *            葡萄园 · 她的家（窗棂）与棕树 · 耶路撒冷的城墙与城门；中景的洲：磐石穴、山羊群、所罗门的轿经过之处；
 *            远处：黎巴嫩的雪山（末了是香草山）。竖屏时近地的一切向左展开（经文在上方，海边空出来）。
 * 一切位置都以画面宽度的比例记下；一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const { clamp, lerp, TAU, smoothstep } = U;
  const ACT = 'song';
  const isCur = () => GS.book.current(ACT);

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  W.defineLevel('sgSnow', 'exp', 0.22);    // 黎巴嫩的雪（春来渐消）
  W.defineLevel('sgLeaf', 'exp', 0.3);     // 树发芽长叶（2:13）
  W.defineLevel('sgBlos', 'exp', 0.35);    // 苹果树开花
  W.defineLevel('sgFig', 'exp', 0.3);      // 无花果树的果子渐渐成熟（2:13）
  W.defineLevel('sgApple', 'exp', 0.3);    // 苹果树结果（2:3，8:5）
  W.defineLevel('sgPom', 'exp', 0.35);     // 石榴开花（6:11，7:12）
  W.defineLevel('sgPomFr', 'exp', 0.3);    // 结了石榴（4:13）
  W.defineLevel('sgVine', 'exp', 0.28);    // 葡萄树吐叶开花（2:13）
  W.defineLevel('sgGrape', 'exp', 0.3);    // 葡萄结串（7:12）
  W.defineLevel('sgLily', 'lin', 0.14);    // 谷中的百合一朵一朵开（2:1）
  W.defineLevel('sgLily1', 'exp', 0.7);    // 荆棘内的第一朵百合（2:2）
  W.defineLevel('sgThorn', 'exp', 0.3);    // 荆棘
  W.defineLevel('sgTrack', 'lin', 0.22);   // 羊群的脚踪（1:8）
  W.defineLevel('sgTents', 'exp', 0.45);   // 基达的帐棚（1:5）
  W.defineLevel('sgWin', 'exp', 0.6);      // 从窗棂往里窥探（2:9）
  W.defineLevel('sgLamp', 'exp', 0.5);     // 夜里的灯与火把
  W.defineLevel('sgDoor', 'exp', 0.9);     // 开门（2:10，5:6）
  W.defineLevel('sgSmoke', 'exp', 0.35);   // 形状如烟柱（3:6）
  W.defineLevel('sgLitter', 'exp', 0.5);   // 所罗门的轿（3:7–10）
  W.defineLevel('sgGlow', 'exp', 0.5);     // 你全然美丽，毫无瑕疵（4:7）
  W.defineLevel('sgWall', 'lin', 0.2);     // 关锁的园（4:12）
  W.defineLevel('sgGate', 'exp', 0.7);     // 园门开
  W.defineLevel('sgSpring', 'exp', 0.6);   // 泉源启封、活水涌出（4:15）
  W.defineLevel('sgStream', 'lin', 0.13);  // 溪水流下
  W.defineLevel('sgFalls', 'exp', 0.35);   // 从黎巴嫩流下来的溪水
  W.defineLevel('sgFrag', 'exp', 0.6);     // 园中的香气发出来（4:16）
  W.defineLevel('sgLeb', 'exp', 0.35);     // 他的形状如黎巴嫩（5:15）：月光下的雪山
  W.defineLevel('sgRays', 'exp', 0.3);     // 如晨光发现、如展开旌旗（6:10）
  W.defineLevel('sgSeal', 'exp', 0.5);     // 放在你心上如印记（8:6）
  W.defineLevel('sgFlame', 'exp', 0.55);   // 耶和华的烈焰（8:6）
  W.defineLevel('sgWaves', 'exp', 0.4);    // 众水、大水（8:7）
  W.defineLevel('sgSpice', 'exp', 0.28);   // 香草山（8:14）
  W.defineLevel('sgGz', 'exp', 1.1);       // 良人（行走的光）显现
  W.defineLevel('sgCrown', 'exp', 0.6);    // 头戴冠冕（3:11）
  W.defineLevel('sgMeadow', 'lin', 0.2);   // 地上百花开放（2:12）：田野的银莲花、雏菊、番红花

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  // 物件的尺度与人物相配（人物模块在七日之后把人画大些，手机上再大些）；层 3 = 远处的雪山
  const LK = [1.1, 1.2, 1.3];
  const phoneK = () => (W.w < 600 ? 1.3 : 1);
  const LS = l => (l === 3 ? W.layerScale(0) * 0.8 * phoneK() : W.layerScale(l) * phoneK() * (LK[l] || 1));
  const DEP = l => (l === 3 ? 0.9 : W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const gY = (l, xf) => {
    if (l === 3) return rangeY(xf);
    const x = xf * W.w;
    const y = GS.land && GS.land.groundY ? GS.land.groundY(l, x) : W.ridgeY(l, x);
    return isFinite(y) ? y : W.ridgeY(l, x);
  };
  const fieldH = (l, g) => (l === 2 ? Math.max(0, W.h - g) : l === 1 ? Math.max(0, W.waterlineY(1) - g) : 0);
  const baseY = (l, xf, v) => { const g = gY(l, xf); return v ? g + v * fieldH(l, g) * 0.8 : g; };
  const css = (rgb, l, a, ex) => W.shadeCSS(rgb, DEP(l), a, ex);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const dayA = () => 0.25 + 0.75 * W.daylight;
  const M = () => Math.min(W.w, W.h);
  const SU = () => Math.max(0.6, W.unit);
  const port = () => W.w < W.h * 0.9;
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const r3 = v => Math.round(v * 1000) / 1000;
  const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const lv = n => W.lv[n] || 0;

  // ── 近地的位置：逻辑位置 f（0 = 海边，1 = 右端）映到画面比例；竖屏时向左展开 ──
  const LX = f => (port() ? 0.4 + 0.6 * f : 0.5 + 0.5 * f);
  const F = {
    rock: -0.012, tent1: 0.05, tent2: 0.12, fig: 0.185, wall0: 0.21, wall1: 0.52, apple: 0.29, well: 0.42, pom: 0.468,
    gate: 0.52, vine0: 0.56, vine1: 0.76, house: 0.8, palm: 0.842, city: 0.87, cgate: 0.935,
  };
  // 中洲与远山（画面比例，不随屏幕方向改变）
  const MX = { rock: 0.525, goat0: 0.84, goat1: 0.95 };
  const PK = { amana: 0.62, senir: 0.72, hermon: 0.815, bether: 0.9 };   // 雪山上有名的山顶

  const ROBE = {
    bride: [98, 60, 92], shepherd: [104, 86, 64], keeper: [120, 96, 70], watch: [70, 66, 78], guard: [112, 84, 60],
  };
  const DAUGHTER = [[184, 128, 132], [150, 120, 160], [206, 170, 120], [160, 104, 96], [124, 128, 168], [196, 150, 150]];
  const GUARD = [[150, 58, 48], [176, 128, 64], [128, 46, 44], [190, 150, 80], [140, 70, 56]];   // 勇士：朱红与铜色
  const BARK = [74, 58, 46];

  // ── 本卷的状态（只在 setup / apply / 情节里改动，重演时一样）───────
  let S = fresh();
  function fresh() {
    return { gz: { x: PK.bether, l: 3, v: 0, face: -1, pose: 'stand' }, dove: 'rock', turtle: '', litX: 0.53 };
  }
  // ── 转瞬的事（不属于世界的状态；重演时不放；恢复时清空）──────
  let RUN = null;             // 良人的光正在跳跃的路线
  let LIT = null;             // 所罗门的轿正在前行
  const FXL = [];             // 鸽子飞、狐狸、斑鸠、光……
  const PT = [];              // 自己的粒子：花瓣、香气、浪花、香草山的金尘
  let trailT = 0, sprayN = -1, fragAcc = 0, spiceAcc = 0, blosAcc = 0, emberAcc = 0;

  // ════════════════════════════════════════════════════════════
  //  人物（皆经人物模块）
  // ════════════════════════════════════════════════════════════
  const C = () => cast();
  const has = id => { const c = C(); return c.has ? c.has(id) : !!(c.get && c.get(id)); };
  const hasCrowd = gid => { const c = C(); return !!(c.crowds && c.crowds.has && c.crowds.has(gid)); };
  const fig = id => { const c = C(); return c.get ? c.get(id) : null; };
  function add(id, o) { return C().add(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o)); }
  function walk(id, x, o) { if (has(id)) C().walk(id, x, o); }
  function pose(id, p, o) { if (has(id)) C().pose(id, p, o); }
  function face(id, d) { if (has(id)) C().face(id, d); }
  function rm(id, now) { if (has(id)) C().remove(id, now ? { fade: false } : undefined); }
  function glow(id, v) { if (has(id)) C().glow(id, v); }
  function hold(id, p) { const c = C(); if (c.prop && has(id)) U.safe('cast.prop', () => c.prop(id, p || null)); }
  function follow(id, other, dx) { const c = C(); if (c.follow && has(id)) c.follow(id, other, dx); }
  function beast(id, o) { const c = C(); return c.animal ? U.safe('cast.animal', () => c.animal(id, Object.assign({ from: W.replaying ? 'none' : 'fade' }, o))) : null; }
  function crowd(gid, o, dressFn) {
    if (hasCrowd(gid)) C().removeCrowd(gid, { fade: false });
    const ms = C().crowd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
    if (dressFn) ms.forEach((m, i) => dressFn(m, i, ms.length));
    return ms;
  }
  function herd(gid, o) {
    const c = C();
    if (!c.herd) return [];
    if (hasCrowd(gid)) c.removeCrowd(gid, { fade: false });
    return c.herd(gid, Object.assign({ from: W.replaying ? 'none' : 'fade', mill: false }, o)) || [];
  }
  function cwalk(gid, x0, x1, o) { if (hasCrowd(gid)) C().crowdWalk(gid, x0, x1, o); }
  function cpose(gid, p) { if (hasCrowd(gid)) C().crowdPose(gid, p); }
  function crm(gid, now) { if (hasCrowd(gid)) C().removeCrowd(gid, now ? { fade: false } : undefined); }
  function cmembers(gid) { const g = hasCrowd(gid) && C().crowds.get(gid); return g ? g.members : []; }
  // 一群人都转向某边（正走着的，走到了再转——与瞬间重演一致）
  function cface(gid, d) {
    for (const m of cmembers(gid)) {
      if (m.tx != null && !W.replaying) { m.faceEnd = d; continue; }
      m.faceEnd = null;
      if (d === 1 || d === -1) m.facing = d; else if (typeof d === 'number') m.facing = d >= m.nx ? 1 : -1;
      if (W.replaying) m.fd = m.facing;
    }
  }
  const woman = pal => (m, i) => { m.sex = 'f'; m.age = 'adult'; m.robe = pal[i % pal.length]; m.accent = [226, 206, 180]; m.hairOpt = 'veil'; m.v = 0.02 + ((i * 0.618) % 1) * 0.12; };
  const man = (robe, prop) => (m, i) => {
    m.sex = 'm'; m.age = 'adult'; m.robe = Array.isArray(robe[0]) ? robe[i % robe.length] : robe; m.accent = null; m.propDefault = false;
    m.prop = prop || null; m.v = 0.02 + ((i * 0.618) % 1) * 0.1;
  };
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }

  function sfx(b, name, o) {
    if (b && b.instant) return;
    const a = au();
    if (a && a.sfx) U.safe('audio.sfx', () => a.sfx(name, o));
  }
  // 人物身上的一点（像素）：frac 0 = 脚，1 = 头顶
  function headOf(id, frac) {
    const f = fig(id);
    const k = frac == null ? 1 : frac;
    if (!f) return [W.w * 0.75, W.h * 0.75];
    if (f._vis && isFinite(f._x) && isFinite(f._y)) return [f._x, f._y - (f._h || 30) * k];
    const l = f.layer == null ? 2 : f.layer;
    return [f.nx * W.w, baseY(l, f.nx, f.v) - 34 * LS(l) * k];
  }
  function sparkleOn(b, id, n, rgb, frac) {
    if (b.instant || !fx()) return;
    const h = headOf(id, frac == null ? 0.6 : frac);
    fx().sparkle(h[0], h[1], n || 20, rgb || [255, 232, 180], 14 * SU(), 'top');
  }
  function ringAt(b, x, y, rgb, r, dur) { if (!b.instant && fx()) fx().ring(x, y, rgb || [255, 236, 200], r || M() * 0.2, dur || 2, 1.6); }
  function flash(b, o) { if (!b.instant) FXL.push(Object.assign({ t0: W.t, dur: 3 }, o)); }

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
    try {
      SP = {
        warm: radial([255, 170, 90], 1), gold: radial([255, 226, 160], 1), white: radial([244, 246, 255], 1),
        pale: radial([214, 224, 255], 1), rose: radial([255, 176, 150], 1), lamp: radial([255, 150, 60], 1, 0.22),
        puff: radial([236, 230, 220], 1, 0.55), smoke: radial([196, 184, 172], 1, 0.6), smokeD: radial([70, 66, 78], 1, 0.6), dew: radial([220, 240, 255], 1, 0.3),
      };
    } catch (e) { SP = null; }
    return SP;
  }
  function glowAt(ctx, img, x, y, r, a, sy) {
    if (!img || a < 0.004 || !(r > 0)) return;
    ctx.globalAlpha = Math.min(1, a);
    const ry = r * (sy || 1);
    ctx.drawImage(img, x - r, y - ry, r * 2, ry * 2);
  }

  // ════════════════════════════════════════════════════════════
  //  远处：黎巴嫩的雪山（画在天上，一切陆地之后）
  // ════════════════════════════════════════════════════════════
  const RG = { x0: 0.5, x1: 1.04, n: 120, h: null, ced: null };
  function buildRange() {
    const n = RG.n, h = new Float32Array(n + 1);
    const t = x => (x - RG.x0) / (RG.x1 - RG.x0);
    // [中心, 高, 宽]：亚玛拿、示尼珥、黑门（最高）、比特山，两肩
    const P = [[0.1, 0.3, 0.06], [t(PK.amana), 0.64, 0.055], [t(PK.senir), 0.78, 0.06], [t(PK.hermon), 1.0, 0.07], [t(PK.bether), 0.7, 0.06], [0.93, 0.58, 0.07]];
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      let v = 0;
      for (const p of P) { const d = (u - p[0]) / p[2]; v = Math.max(v, p[1] / (1 + d * d * 0.9)); }
      v *= 0.88 + 0.12 * U.noise1(u * 29 + 5);
      v += 0.05 * U.noise1(u * 71 + 11) * v;
      h[i] = Math.max(0, v * smoothstep(0, 0.08, u));
    }
    RG.h = h;
    const R = U.mulberry32(3301), ced = [];
    for (let k = 0; k < 54; k++) ced.push([0.04 + R() * 0.92, 0.45 + R() * 0.5, 0.7 + R() * 0.6]);
    RG.ced = ced;
  }
  const rangeH = () => W.h * (port() ? 0.085 : 0.105);
  function rangeV(xf) {
    if (!RG.h) buildRange();
    const u = (xf - RG.x0) / (RG.x1 - RG.x0);
    if (u <= 0 || u >= 1) return 0;
    const f = u * RG.n, i = Math.floor(f), r = f - i;
    return RG.h[i] + (RG.h[Math.min(RG.n, i + 1)] - RG.h[i]) * r;
  }
  function rangeY(xf) { return W.horizonY + 1 - rangeV(xf) * rangeH(); }

  function drawRange(ctx) {
    if (!RG.h) buildRange();
    const hz = W.horizonY + 2, H = rangeH(), n = RG.n;
    const X = i => (RG.x0 + (RG.x1 - RG.x0) * (i / n)) * W.w;
    const Y = i => hz - 1 - RG.h[i] * H;
    // 夜里雪山仍隐约可见（月光、星光）
    const nl = clamp(W.night * (0.55 + 0.45 * lv('moon')), 0, 1);
    const spk = lv('sgSpice');
    let body = W.shade([122, 134, 160], 0.88, 0.07 * nl);
    if (spk > 0.01) body = mix(body, W.shade([214, 170, 146], 0.78, 0.08), 0.55 * spk);
    const foot = mix(W.haze, body, 0.35);
    const gr = ctx.createLinearGradient(0, hz - H, 0, hz);
    gr.addColorStop(0, rgba(body, 1)); gr.addColorStop(1, rgba(foot, 1));
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(X(0), hz);
    for (let i = 0; i <= n; i++) ctx.lineTo(X(i), Y(i));
    ctx.lineTo(X(n), hz); ctx.closePath(); ctx.fill();
    // 背光的坡：每个峰的一侧稍暗
    const ld = litX() >= W.w * 0.75 ? 1 : -1;
    ctx.fillStyle = rgba(W.shade([70, 80, 104], 0.86), 0.32);
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      const a = RG.h[i - 1], b = RG.h[i], c = RG.h[i + 1];
      if (b >= a && b >= c && b > 0.25) {
        let j = i;
        const step = -ld;
        ctx.moveTo(X(i), Y(i));
        for (let k = 0; k < 16; k++) { const q = j + step; if (q < 0 || q > n || RG.h[q] > RG.h[j] + 0.001) break; j = q; ctx.lineTo(X(j), Y(j)); }
        ctx.lineTo(X(j), Y(j) + (RG.h[j]) * H * 0.35);
        ctx.quadraticCurveTo(X(i) + (X(j) - X(i)) * 0.2, Y(i) + RG.h[i] * H * 0.6, X(i), hz);
        ctx.closePath();
      }
    }
    ctx.fill();
    // 香柏树（5:15）：山腰上一点一点深色的尖
    ctx.fillStyle = W.shadeCSS([46, 70, 58], 0.84, 0.85);
    ctx.beginPath();
    const cs = Math.max(0.8, 2.1 * SU() * (port() ? 0.7 : 1));
    for (const c of RG.ced) {
      const i = Math.round(c[0] * n), top = Y(i), y = top + (hz - top) * c[1], x = X(i) + (c[0] * n - i) * 2;
      if (RG.h[i] < 0.12 || y > hz - 1) continue;
      const hh = cs * 2.4 * c[2], ww = cs * c[2];
      ctx.moveTo(x - ww, y); ctx.lineTo(x, y - hh); ctx.lineTo(x + ww, y); ctx.closePath();
    }
    ctx.fill();
    // 雪：峰顶的一片，下缘参差（夜里在月光、星光下仍微微发白；清晨染上香草山的金与玫瑰色）
    const snow = lv('sgSnow');
    if (snow > 0.01) {
      const sl = lerp(0.95, 0.3, snow);
      const sp0 = lv('sgSpice');
      const sc = sp0 > 0.01 ? mix([238, 242, 250], [255, 226, 206], sp0 * 0.6) : [238, 242, 250];
      const P = new Path2D();
      let run = false;
      const low = [];
      for (let i = 0; i <= n + 1; i++) {
        const on = i <= n && RG.h[i] > sl;
        if (on && !run) { run = true; low.length = 0; P.moveTo(X(i), Y(i)); }
        if (on) { P.lineTo(X(i), Y(i)); low.push(i); }
        if (!on && run) {
          run = false;
          for (let k = low.length - 1; k >= 0; k--) {
            const j = low[k], d = (RG.h[j] - sl) * H * (0.55 + 0.35 * hsh(j * 3.1)) + (k % 3 === 0 ? 2 : 0);
            P.lineTo(X(j), Y(j) + Math.max(0, d));
          }
          P.closePath();
        }
      }
      ctx.fillStyle = W.shadeCSS(sc, 0.7, Math.min(1, snow * 1.3) * 0.95, 0.12 + 0.22 * nl + 0.3 * lv('sgLeb'));
      ctx.fill(P);
      if (nl > 0.05) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = U.rgba(120, 138, 186, Math.min(1, snow * 1.3) * nl * (0.22 + 0.3 * lv('sgLeb')));
        ctx.fill(P);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    // 迎光的山脊
    ctx.strokeStyle = W.shadeCSS([250, 240, 222], 0.7, 0.35 * dayA() + 0.3 * nl, 0.2 + 0.3 * nl);
    ctx.lineWidth = Math.max(0.6, 0.9 * SU());
    ctx.beginPath();
    for (let i = 0; i <= n; i++) { if (i) ctx.lineTo(X(i), Y(i)); else ctx.moveTo(X(i), Y(i)); }
    ctx.stroke();
    drawHinds(ctx);
    // 从黎巴嫩流下来的溪水：雪线下几道细瀑
    const fl = lv('sgFalls');
    if (fl > 0.01) {
      ctx.lineCap = 'round';
      for (const xf of [0.655, 0.765, 0.86, 0.95]) {
        const i = Math.round(((xf - RG.x0) / (RG.x1 - RG.x0)) * n);
        if (i < 0 || i > n) continue;
        const top = Y(i) + RG.h[i] * H * 0.28, bot = hz - 1, x = X(i);
        const sh = 0.55 + 0.45 * Math.sin(W.t * 3 + xf * 40);
        ctx.strokeStyle = W.shadeCSS([226, 238, 250], 0.7, fl * (0.45 + 0.25 * sh), 0.2);
        ctx.lineWidth = Math.max(0.6, 0.9 * SU());
        ctx.beginPath(); ctx.moveTo(x, top);
        ctx.quadraticCurveTo(x + 2 * SU(), (top + bot) / 2, x - 1 * SU(), bot); ctx.stroke();
      }
    }
    // 月光下的雪山（5:15）与香草山的金光（8:14）
    sprites();
    const leb = lv('sgLeb'), sp = lv('sgSpice');
    if (SP && (leb > 0.01 || sp > 0.01)) {
      ctx.globalCompositeOperation = 'lighter';
      const cx = PK.hermon * W.w, cy = hz - H * 0.55, R = (RG.x1 - RG.x0) * W.w * 0.55;
      if (leb > 0.01) glowAt(ctx, SP.pale, cx, cy, R, leb * 0.28, 0.32);
      if (sp > 0.01) {
        const dk = 1 - 0.55 * W.daylight;
        glowAt(ctx, SP.rose, cx, cy, R * 1.05, sp * 0.26 * dk, 0.36);
        glowAt(ctx, SP.gold, cx, hz - H * 0.95, R * 0.32, sp * 0.22 * dk, 0.5);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // 山上寻常的羚羊与小鹿（2:9、2:17、8:14 的比喻）：不发光的小剪影，站在比特山与黑门的坡上
  const HINDS = [[0.878, -1, 'stand', 1], [0.892, 1, 'graze', 0.86], [0.742, 1, 'stand', 0.95], [0.754, -1, 'graze', 0.82]];
  function drawHinds(ctx) {
    const nl = clamp(W.night * (0.55 + 0.45 * lv('moon')), 0, 1);
    const k = SU() * (port() ? 0.2 : 0.3);
    ctx.fillStyle = W.shadeCSS(mix([112, 86, 64], [196, 150, 120], 0.35 * lv('sgSpice')), 0.86, 1, 0.04 * nl);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const h of HINDS) {
      // 站在雪线下的山坡上（背后是深色的山身，看得出剪影）
      const x = h[0] * W.w, y = W.horizonY + 1 - rangeV(h[0]) * rangeH() * 0.5, s = k * h[3];
      const P = gazellePaths({ mode: h[2] === 'graze' ? 2 : 0, ph: 0 });
      ctx.save();
      ctx.translate(x, y); ctx.scale(h[1] * s, s);
      ctx.lineWidth = 1.6; ctx.stroke(P.legs);
      ctx.fill(P.body);
      ctx.lineWidth = 1.1; ctx.stroke(P.horn);
      ctx.restore();
    }
  }
  // 晨光如展开的旌旗（6:10）：日出之处向上展开的五六面宽而柔的光幅（金与玫瑰色相间），像布一样微微起伏；只在天亮时显出
  const RAYG = {};
  function drawRays(ctx) {
    const k = lv('sgRays') * smoothstep(0.08, 0.45, W.daylight);
    if (k < 0.01) return;
    const ox = clamp(W.sun && isFinite(W.sun.x) ? W.sun.x : W.w * 0.12, -W.w * 0.1, W.w * 0.45);
    const oy = Math.min(W.horizonY + 2, W.sun && isFinite(W.sun.y) ? W.sun.y : W.horizonY);
    const R = Math.hypot(W.w, W.h) * 0.56;
    const A = k * (0.4 + 0.6 * W.dusk);
    if (A < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    const N = 6;
    for (let c = 0; c < 2; c++) {
      // 渐变随原点与大小缓存（原点在日出时缓缓移动，取整后重用）
      const key = c + ':' + Math.round(ox / 6) + ',' + Math.round(oy / 6) + ',' + Math.round(R);
      let g = RAYG[c] && RAYG[c].key === key ? RAYG[c].g : null;
      if (!g) {
        g = ctx.createRadialGradient(ox, oy, R * 0.03, ox, oy, R);
        const col = c ? [255, 180, 168] : [255, 222, 170];
        g.addColorStop(0, rgba(col, 0.26)); g.addColorStop(0.22, rgba(col, 0.15)); g.addColorStop(0.5, rgba(col, 0.05)); g.addColorStop(0.8, rgba(col, 0.012)); g.addColorStop(1, rgba(col, 0));
        RAYG[c] = { key, g };
      }
      ctx.fillStyle = g;
      // 三层由宽到窄叠起来，边缘就柔了
      for (const [wk, al] of [[1.7, 0.3], [1.15, 0.42], [0.65, 0.6]]) {
        ctx.globalAlpha = A * al;
        ctx.beginPath();
        for (let i = c; i < N; i += 2) {
          // 日出在画面左边：旌旗向右上方一面一面展开，横过天空（不往画外去）
          const a = -Math.PI * (0.06 + 0.52 * (i + 0.5) / N) + Math.sin(W.t * 0.25 + i * 1.7) * 0.02;
          const wA = (0.04 + 0.008 * Math.sin(W.t * 0.4 + i * 2.3)) * wk;
          // 一面旌旗：自日出处不远的地方展开，越远越宽，两边像布一样缓缓起伏
          const r1 = 0.45 + 0.05 * Math.sin(W.t * 0.7 + i);
          const b1 = Math.sin(W.t * 0.6 + i * 1.3) * 0.045, b2 = Math.sin(W.t * 0.6 + i * 1.3 + 1.7) * 0.05;
          const P = (ang, r) => [ox + Math.cos(ang) * R * r, oy + Math.sin(ang) * R * r];
          const p0 = P(a - wA * 0.45, 0.07), p1 = P(a - wA * 1.05 + b1, r1), p2 = P(a - wA * 1.3 + b2, 1), p3 = P(a + wA * 1.3 + b2, 1), p4 = P(a + wA * 1.05 + b1, r1), p5 = P(a + wA * 0.45, 0.07);
          const pc = P(a + b2, 1.06);
          ctx.moveTo(p0[0], p0[1]);
          ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]);
          ctx.quadraticCurveTo(pc[0], pc[1], p3[0], p3[1]);
          ctx.quadraticCurveTo(p4[0], p4[1], p5[0], p5[1]);
          ctx.closePath();
        }
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  树：冬天光秃，春天发芽长叶、开花、结果（本卷自己画，好让冬天的枝子是空的）
  // ════════════════════════════════════════════════════════════
  // 模型：以树高为 1 的归一化坐标（y 向上为负）；segs = [x0,y0,x1,y1,w0,w1]，blobs = [x,y,r,tone]，blos / fruit = [x,y,r,ci]
  function treeModel(seed, o) {
    const R = U.mulberry32(seed);
    const segs = [], tips = [];
    const grow = (x, y, a, len, w, d) => {
      const x1 = x + Math.sin(a) * len, y1 = y - Math.cos(a) * len;
      segs.push([x, y, x1, y1, w, w * 0.66]);
      if (d >= o.depth) { tips.push([x1, y1]); return; }
      const n = d === 0 ? (o.fork0 || 3) : R() < 0.55 ? 2 : 3;
      for (let i = 0; i < n; i++) {
        const k = n === 1 ? 0 : i / (n - 1) - 0.5;
        const aa = a * 0.82 + k * o.spread * 2 * (0.8 + 0.4 * R()) + (R() - 0.5) * 0.22;
        grow(x1, y1, aa, len * (0.62 + 0.18 * R()) * (d === 0 ? o.first || 1 : 1), w * 0.64, d + 1);
      }
      if (d >= 1 && R() < 0.6) tips.push([x1, y1]);
    };
    grow(0, 0, o.lean || 0, o.trunk, o.tw, 0);
    let minY = 0;
    for (const s of segs) minY = Math.min(minY, s[1], s[3]);
    const k = 1 / Math.max(0.01, -minY - o.leafR * 0.4);
    for (const s of segs) for (let i = 0; i < 6; i++) s[i] *= k;
    for (const t of tips) { t[0] *= k; t[1] *= k; }
    const blobs = [], blos = [], fruit = [];
    for (const t of tips) {
      const n = o.blobN || 2;
      for (let j = 0; j < n; j++) blobs.push([t[0] + (R() - 0.5) * o.leafR * 1.3, t[1] + (R() - 0.62) * o.leafR * 1.1, o.leafR * (0.62 + 0.55 * R()), R()]);
      if (R() < (o.blosP || 0.8)) blos.push([t[0] + (R() - 0.5) * o.leafR, t[1] + (R() - 0.7) * o.leafR * 0.9, 0.012 + R() * 0.01, R() < 0.6 ? 0 : 1]);
      if (R() < (o.fruitP || 0.5)) fruit.push([t[0] + (R() - 0.5) * o.leafR * 0.9, t[1] + o.leafR * (0.15 + R() * 0.5), 0.02 + R() * 0.012, R() < 0.5 ? 0 : 1]);
    }
    blobs.sort((a, b) => a[3] - b[3]);
    return { segs, blobs, blos, fruit };
  }
  // 近地的树：无花果、苹果（园中）、石榴（园中）、棕树（她的家旁）
  const TREES = [
    { id: 'fig', f: F.fig, v: 0.02, H: 60, label: '无花果树', leaf: [72, 118, 60], o: { depth: 3, spread: 0.55, trunk: 0.36, tw: 0.08, leafR: 0.15, blobN: 3, fork0: 3, first: 0.9, seed: 71 } },
    { id: 'apple', f: F.apple, v: 0.04, H: 70, label: '苹果树', leaf: [82, 128, 64], o: { depth: 4, spread: 0.46, trunk: 0.32, tw: 0.075, leafR: 0.1, blobN: 2, fork0: 3, seed: 29 } },
    { id: 'pom', f: F.pom, v: 0.06, H: 42, label: '石榴树', leaf: [66, 112, 54], o: { depth: 3, spread: 0.6, trunk: 0.2, tw: 0.07, leafR: 0.12, blobN: 2, fork0: 4, seed: 47, fruitP: 0.7 } },
  ];
  const MIDT = [{ x: 0.585, seed: 5, H: 44 }, { x: 0.7, seed: 8, H: 38 }, { x: 0.79, seed: 11, H: 46 }, { x: 0.905, seed: 17, H: 40 }];
  let MODELS = null;
  function models() {
    if (MODELS) return MODELS;
    MODELS = {};
    for (const t of TREES) MODELS[t.id] = treeModel(t.o.seed, t.o);
    MIDT.forEach((t, i) => { MODELS['m' + i] = treeModel(t.seed, { depth: 3, spread: 0.55, trunk: 0.38, tw: 0.09, leafR: 0.15, blobN: 3, fork0: 3 }); });
    return MODELS;
  }
  const treeXY = t => { const xf = LX(t.f); return [xf * W.w, baseY(2, xf, t.v) + 2 * LS(2)]; };
  const treeH = t => t.H * LS(2) * (1 + 0.35 * t.v);
  // o: { leaf, leafCol, blos, blosCol:[c0,c1], fruit, fruitCol:[c0,c1], a }
  function drawTree(ctx, m, x, y, H, l, seed, o) {
    const a = o.a == null ? 1 : o.a;
    const sway = BAKE ? 0 : W.wind * 0.02 + lv('gale') * 0.06 * Math.sin(W.t * 1.9 + seed) + lv('gale') * 0.03 * GUST;
    const px = (mx, my) => x + (mx + sway * my * my * (o.dir || 1)) * H;
    const py = my => y + my * H;
    const P = new Path2D();
    const minW = 0.55;
    for (const s of m.segs) {
      const x0 = px(s[0], s[1]), y0 = py(s[1]), x1 = px(s[2], s[3]), y1 = py(s[3]);
      let dx = x1 - x0, dy = y1 - y0;
      const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
      const w0 = Math.max(minW, s[4] * H) / 2, w1 = Math.max(minW * 0.7, s[5] * H) / 2;
      P.moveTo(x0 - dy * w0, y0 + dx * w0); P.lineTo(x1 - dy * w1, y1 + dx * w1);
      P.lineTo(x1 + dy * w1, y1 - dx * w1); P.lineTo(x0 + dy * w0, y0 - dx * w0); P.closePath();
    }
    ctx.globalAlpha = a;
    ctx.fillStyle = css(BARK, l);
    ctx.fill(P);
    // 叶：背光的一层、迎光的一层
    const L = o.leaf || 0;
    if (L > 0.01) {
      const back = new Path2D(), front = new Path2D();
      const ld = litX() >= x ? 1 : -1;
      const g = Math.min(1, L * 1.25);
      for (const b of m.blobs) {
        const r = b[2] * H * (0.25 + 0.75 * g);
        if (r < 0.35) continue;
        const cx = px(b[0], b[1]), cy = py(b[1]);
        back.moveTo(cx + r, cy); back.ellipse(cx, cy, r, r * 0.8, 0, 0, TAU);
        if (b[3] > 0.4) { const rr = r * 0.6, fx0 = cx + ld * r * 0.28, fy0 = cy - r * 0.26; front.moveTo(fx0 + rr, fy0); front.ellipse(fx0, fy0, rr, rr * 0.76, 0, 0, TAU); }
      }
      ctx.globalAlpha = a * Math.min(1, L * 1.8);
      ctx.fillStyle = css(mix(o.leafCol, [40, 60, 40], 0.18), l);
      ctx.fill(back);
      ctx.fillStyle = css(mix(o.leafCol, [214, 228, 150], 0.3), l, 1, 0.06);
      ctx.fill(front);
    }
    // 花
    const B = o.blos || 0;
    if (B > 0.01 && m.blos.length && o.blosCol) {
      for (let ci = 0; ci < 2; ci++) {
        const p = new Path2D();
        let n = 0;
        for (const f of m.blos) {
          if (f[3] !== ci) continue;
          const r = Math.max(0.7, f[2] * H * (0.4 + 0.6 * B));
          const cx = px(f[0], f[1]), cy = py(f[1]);
          p.moveTo(cx + r, cy); p.arc(cx, cy, r, 0, TAU); n++;
        }
        if (!n) continue;
        ctx.globalAlpha = a * Math.min(1, B * 1.5);
        ctx.fillStyle = css(o.blosCol[ci], l, 1, 0.18);
        ctx.fill(p);
      }
    }
    // 果
    const Fr = o.fruit || 0;
    if (Fr > 0.01 && m.fruit.length && o.fruitCol) {
      for (let ci = 0; ci < 2; ci++) {
        const p = new Path2D();
        let n = 0;
        for (const f of m.fruit) {
          if (f[3] !== ci) continue;
          const r = Math.max(0.7, f[2] * H * (0.35 + 0.65 * Fr));
          const cx = px(f[0], f[1]), cy = py(f[1]);
          p.moveTo(cx + r, cy); p.arc(cx, cy, r, 0, TAU); n++;
        }
        if (!n) continue;
        ctx.globalAlpha = a * Math.min(1, Fr * 1.6);
        ctx.fillStyle = css(o.fruitCol[ci], l, 1, 0.1);
        ctx.fill(p);
      }
    }
    ctx.globalAlpha = 1;
  }
  // 苹果树上一根枝子（鸽子落在这里）
  function appleBranch() {
    const t = TREES[1], xy = treeXY(t), H = treeH(t);
    return [xy[0] + H * 0.26, xy[1] - H * 0.56];
  }
  function drawNearTrees(ctx) {
    const m = models(), L = lv('sgLeaf');
    const figR = lv('sgFig');
    for (const t of TREES) {
      const xy = treeXY(t), H = treeH(t);
      const o = { leaf: L, leafCol: t.leaf };
      if (t.id === 'fig') { o.fruit = figR; o.fruitCol = [mix([128, 150, 72], [110, 52, 82], figR), mix([140, 156, 80], [132, 64, 90], figR)]; }
      if (t.id === 'apple') {
        o.blos = lv('sgBlos'); o.blosCol = [[252, 232, 236], [240, 186, 204]];
        o.fruit = lv('sgApple'); o.fruitCol = [[214, 66, 58], [234, 176, 76]];
      }
      if (t.id === 'pom') {
        o.blos = lv('sgPom'); o.blosCol = [[240, 96, 58], [226, 70, 50]];
        o.fruit = lv('sgPomFr'); o.fruitCol = [[190, 44, 62], [210, 66, 60]];
      }
      drawTree(ctx, m[t.id], xy[0], xy[1], H, 2, t.o.seed, o);
    }
  }
  // 棕树（7:7）：常青
  function drawPalm(ctx) {
    const xf = LX(F.palm), s = LS(2), x = xf * W.w, y = gY(2, xf) + 2 * s, H = 92 * s;
    const lean = 0.1 + W.wind * 0.02 + lv('gale') * 0.04 * Math.sin(W.t * 1.7);
    const tx = x + lean * H, ty = y - H;
    ctx.strokeStyle = css([96, 76, 56], 2); ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, 4.2 * s);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * H * 0.15, y - H * 0.55, tx, ty); ctx.stroke();
    ctx.strokeStyle = css([70, 56, 42], 2, 0.7); ctx.lineWidth = Math.max(0.6, 0.8 * s);
    ctx.beginPath();
    for (let i = 1; i < 12; i++) {
      const u = i / 12, bx = lerp(x, tx, u * u * 0.6 + u * 0.4), by = lerp(y, ty, u);
      ctx.moveTo(bx - 2.2 * s, by); ctx.lineTo(bx + 2.2 * s, by - 0.8 * s);
    }
    ctx.stroke();
    const col = css([70, 116, 60], 2), hi = css([124, 160, 90], 2, 1, 0.06);
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.38 + Math.sin(W.t * 1.3 + i) * 0.03 + lean * 0.3;
      const len = H * (0.32 + 0.06 * Math.sin(i * 2.1));
      const ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * 0.55 + len * 0.28 * Math.abs(Math.cos(a));
      const cx = tx + Math.cos(a) * len * 0.55, cy = ty + Math.sin(a) * len * 0.65 - 4 * s;
      ctx.fillStyle = i % 2 ? col : hi;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.quadraticCurveTo(cx - 2.2 * s, cy - 2 * s, ex, ey);
      ctx.quadraticCurveTo(cx + 2.4 * s, cy + 2.6 * s, tx, ty + 1.5 * s);
      ctx.fill();
    }
    ctx.fillStyle = css([214, 132, 52], 2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) { const cx = tx + (i - 2) * 1.6 * s, cy = ty + 3.2 * s + (i % 2) * 1.4 * s; ctx.moveTo(cx + 1.3 * s, cy); ctx.arc(cx, cy, 1.3 * s, 0, TAU); }
    ctx.fill();
  }
  function drawMidTrees(ctx) {
    const m = models(), L = lv('sgLeaf'), s = LS(1);
    MIDT.forEach((t, i) => {
      const x = t.x * W.w, y = gY(1, t.x) + 1.5 * s;
      const o = { leaf: L, leafCol: i % 2 ? [104, 130, 92] : [86, 124, 74] };
      if (i % 2 === 0) { o.blos = lv('sgBlos'); o.blosCol = [[250, 226, 234], [238, 176, 200]]; }   // 春天，洲上的杏花与苹果花
      drawTree(ctx, m['m' + i], x, y, t.H * s, 1, t.seed, o);
    });
  }

  // ════════════════════════════════════════════════════════════
  //  葡萄园 · 百合与荆棘 · 脚踪 · 泉与溪水
  // ════════════════════════════════════════════════════════════
  let VINES = null, LILIES = null, THORNS = null, TRACK = null;
  function buildNear() {
    const R = U.mulberry32(8080);
    VINES = [];
    const rows = [0.03, 0.14, 0.27, 0.42];
    rows.forEach((v, r) => {
      const n = 7;
      for (let i = 0; i < n; i++) {
        const f = lerp(F.vine0 + 0.01, F.vine1 - 0.01, (i + 0.5 + (r % 2 ? 0.35 : 0)) / (n + 0.35));
        VINES.push({ f, v, k: 0.9 + R() * 0.2, s: R() });
      }
    });
    VINES.sort((a, b) => a.v - b.v);
    LILIES = [];
    for (let i = 0; i < 30; i++) LILIES.push({ f: lerp(0.24, 0.5, R()), v: 0.04 + Math.pow(R(), 1.1) * 0.4, k: 0.8 + R() * 0.4, ph: R() * TAU, o: R() });
    LILIES.sort((a, b) => a.o - b.o);
    THORNS = [];
    for (let i = 0; i < 16; i++) {
      const strokes = [];
      const n = 6 + ((R() * 4) | 0);
      for (let j = 0; j < n; j++) {
        const a = -Math.PI / 2 + (R() - 0.5) * 2.4, len = 0.55 + R() * 0.55, bend = (R() - 0.5) * 0.8;
        strokes.push([a, len, bend, R()]);
      }
      THORNS.push({ f: lerp(0.22, 0.51, R()), v: 0.02 + R() * 0.44, k: 0.8 + R() * 0.5, strokes });
    }
    THORNS.sort((a, b) => a.v - b.v);
    TRACK = [];
    const n = 22;
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      TRACK.push({ f: lerp(0.64, 0.17, u), v: 0.1 + 0.035 * Math.sin(u * 7.3) + 0.02 * (i % 2 ? 1 : -1), u });
    }
  }
  function drawVineyard(ctx) {
    if (!VINES) buildNear();
    const L = lv('sgVine'), G = lv('sgGrape');
    const wood = new Path2D(), arms = new Path2D(), leafB = new Path2D(), leafF = new Path2D(), flow = new Path2D(), grape = new Path2D();
    let nL = 0, nF = 0, nG = 0;
    const gale = lv('gale');
    for (const vn of VINES) {
      const xf = LX(vn.f), x = xf * W.w, y = baseY(2, xf, vn.v), s = LS(2) * (1 + 0.35 * vn.v) * vn.k;
      wood.rect(x - 0.55 * s, y - 15 * s, 1.1 * s, 15 * s);                                  // 橛子
      wood.moveTo(x - 0.9 * s, y); wood.quadraticCurveTo(x + 1.8 * s, y - 5 * s, x - 0.4 * s, y - 10.5 * s);   // 老藤
      wood.lineTo(x + 0.8 * s, y - 10.2 * s); wood.quadraticCurveTo(x + 3 * s, y - 5 * s, x + 0.9 * s, y); wood.closePath();
      const sw = gale * Math.sin(W.t * 2.2 + vn.s * 9) * 1.2 * s;
      arms.moveTo(x - 7.5 * s + sw, y - 11.2 * s); arms.quadraticCurveTo(x - 3 * s, y - 12.6 * s, x, y - 10.6 * s);
      arms.quadraticCurveTo(x + 3 * s, y - 12.4 * s, x + 7.5 * s + sw, y - 11 * s);
      if (L > 0.02) {
        for (let j = 0; j < 6; j++) {
          const u = j / 5 - 0.5, lx = x + u * 14 * s + sw * (0.5 + Math.abs(u)), ly = y - 11.6 * s - Math.sin((u + 0.5) * Math.PI) * 1.2 * s + (j % 2) * 1.2 * s;
          const r = 2.5 * s * Math.min(1, L * 1.15) * (0.8 + 0.3 * hsh(vn.s * 50 + j));
          if (r < 0.3) continue;
          leafB.moveTo(lx + r, ly); leafB.ellipse(lx, ly, r, r * 0.78, 0, 0, TAU);
          if (j % 2 === 0) { leafF.moveTo(lx + r * 0.6, ly - r * 0.3); leafF.ellipse(lx, ly - r * 0.3, r * 0.6, r * 0.45, 0, 0, TAU); }
          nL++;
        }
        if (L > 0.45 && G < 0.7) {
          for (let j = 0; j < 4; j++) {
            const lx = x + (j - 1.5) * 3.6 * s + sw, ly = y - 13.4 * s - (j % 2) * 0.8 * s, r = 0.55 * s + 0.1;
            flow.moveTo(lx + r, ly); flow.arc(lx, ly, r, 0, TAU); nF++;
          }
        }
      }
      if (G > 0.02) {
        for (const side of [-1, 1]) {
          const cx = x + side * 4.2 * s + sw * 0.6, cy = y - 9.6 * s;
          const r = 0.95 * s * Math.min(1, G * 1.3);
          for (let k = 0; k < 6; k++) {
            const row = k < 3 ? 0 : k < 5 ? 1 : 2, col = k < 3 ? k - 1 : k < 5 ? k - 3.5 : 0;
            const gx = cx + col * r * 1.7, gy = cy + row * r * 1.6;
            grape.moveTo(gx + r, gy); grape.arc(gx, gy, r, 0, TAU); nG++;
          }
        }
      }
    }
    ctx.fillStyle = css([88, 66, 50], 2); ctx.fill(wood);
    ctx.strokeStyle = css([96, 74, 54], 2); ctx.lineWidth = Math.max(0.6, 0.9 * LS(2)); ctx.stroke(arms);
    if (nL) {
      ctx.globalAlpha = Math.min(1, L * 1.6);
      ctx.fillStyle = css([74, 120, 56], 2); ctx.fill(leafB);
      ctx.fillStyle = css([132, 170, 86], 2, 1, 0.06); ctx.fill(leafF);
      ctx.globalAlpha = 1;
    }
    if (nF) { ctx.globalAlpha = Math.min(1, (L - 0.45) * 2.2) * (1 - Math.max(0, G - 0.3)); ctx.fillStyle = css([236, 230, 170], 2, 1, 0.2); ctx.fill(flow); ctx.globalAlpha = 1; }
    if (nG) { ctx.globalAlpha = Math.min(1, G * 1.5); ctx.fillStyle = css([96, 48, 104], 2, 1, 0.06); ctx.fill(grape); ctx.globalAlpha = 1; }
  }
  // 百合：一茎、两叶、白的喇叭花；荆棘内的第一朵另有一圈光
  function lilyAt(p, x, y, s, k) {
    const h = 9 * s * (0.5 + 0.5 * k);
    p.stem.moveTo(x, y); p.stem.quadraticCurveTo(x + 0.8 * s, y - h * 0.5, x + 0.3 * s, y - h);
    p.leaf.moveTo(x, y - 0.5 * s); p.leaf.quadraticCurveTo(x - 3.4 * s, y - 3 * s, x - 3.8 * s, y - 5.4 * s); p.leaf.quadraticCurveTo(x - 1.4 * s, y - 3 * s, x + 0.3 * s, y - 1.2 * s);
    p.leaf.moveTo(x + 0.2 * s, y - 1 * s); p.leaf.quadraticCurveTo(x + 3 * s, y - 3.4 * s, x + 3.2 * s, y - 6 * s); p.leaf.quadraticCurveTo(x + 1.2 * s, y - 3.8 * s, x + 0.4 * s, y - 2.2 * s);
    if (k < 0.3) return;
    const fx0 = x + 0.3 * s, fy = y - h, r = 2.1 * s * k;
    for (const a of [-0.75, 0, 0.75]) {
      const ex = fx0 + Math.sin(a) * r * 1.2, ey = fy - Math.cos(a) * r * 1.3;
      p.flower.moveTo(fx0, fy + 0.4 * s);
      p.flower.quadraticCurveTo(fx0 + Math.sin(a - 0.5) * r * 1.1, fy - Math.cos(a - 0.5) * r * 0.9, ex, ey);
      p.flower.quadraticCurveTo(fx0 + Math.sin(a + 0.5) * r * 1.1, fy - Math.cos(a + 0.5) * r * 0.9, fx0, fy + 0.4 * s);
    }
  }
  function drawGarden(ctx) {
    if (!LILIES) buildNear();
    const th = lv('sgThorn');
    if (th > 0.01) {
      const p = new Path2D();
      for (const c of THORNS) {
        const xf = LX(c.f), x = xf * W.w, y = baseY(2, xf, c.v) + 1, s = LS(2) * (1 + 0.35 * c.v) * c.k * 9.5;
        for (const q of c.strokes) {
          const ex = x + Math.cos(q[0]) * q[1] * s, ey = y + Math.sin(q[0]) * q[1] * s * 0.85;
          const cx = x + Math.cos(q[0] + q[2]) * q[1] * s * 0.6, cy = y + Math.sin(q[0] + q[2]) * q[1] * s * 0.5;
          p.moveTo(x, y); p.quadraticCurveTo(cx, cy, ex, ey);
          // 刺
          for (let j = 1; j <= 3; j++) {
            const u = j / 4, bx = lerp(x, ex, u), by = lerp(y, ey, u) - 0.5, d = (j % 2 ? 1 : -1) * (q[3] > 0.5 ? 1 : -1);
            p.moveTo(bx, by); p.lineTo(bx + d * 1.8 * LS(2), by - 1.6 * LS(2));
          }
        }
      }
      ctx.globalAlpha = Math.min(1, th);
      ctx.strokeStyle = css([54, 38, 34], 2); ctx.lineWidth = Math.max(0.6, 1 * LS(2)); ctx.lineCap = 'round';
      ctx.stroke(p);
      ctx.globalAlpha = 1;
    }
    const nOpen = lv('sgLily') * LILIES.length;
    const p = { stem: new Path2D(), leaf: new Path2D(), flower: new Path2D() };
    let any = false;
    for (let i = 0; i < LILIES.length; i++) {
      const k = clamp(nOpen - i, 0, 1);
      if (k <= 0.01) continue;
      const q = LILIES[i], xf = LX(q.f), s = LS(2) * (1 + 0.35 * q.v) * q.k;
      lilyAt(p, xf * W.w + (BAKE ? 0 : (Math.sin(W.t * 1.3 + q.ph) * 1.5 + 2.6 * GUST) * lv('gale') * s), baseY(2, xf, q.v) + 1, s, k);
      any = true;
    }
    // 荆棘内的第一朵
    const k1 = lv('sgLily1');
    if (k1 > 0.01) {
      const xf = LX(0.37), s = LS(2) * 1.6;
      lilyAt(p, xf * W.w, baseY(2, xf, 0.14) + 1, s, k1);
      any = true;
    }
    if (any) {
      ctx.strokeStyle = css([84, 120, 64], 2); ctx.lineWidth = Math.max(0.5, 0.7 * LS(2)); ctx.stroke(p.stem);
      ctx.fillStyle = css([78, 122, 62], 2); ctx.fill(p.leaf);
      ctx.fillStyle = css([250, 248, 240], 2, 1, 0.3); ctx.fill(p.flower);
    }
  }
  // 荆棘内第一朵百合的光（活的，不入缓存）
  function drawLilyGlow(ctx) {
    const k1 = lv('sgLily1');
    if (k1 < 0.01 || !SP) return;
    const xf = LX(0.37), s = LS(2) * 1.6, x = xf * W.w, y = baseY(2, xf, 0.14) + 1;
    ctx.globalCompositeOperation = 'lighter';
    const br = 0.85 + 0.15 * Math.sin(W.t * 1.6);
    glowAt(ctx, SP.white, x, y - 9 * s, 16 * s, k1 * (0.4 + 0.4 * nightK()) * br);
    glowAt(ctx, SP.gold, x, y - 9 * s, 7 * s, k1 * (0.35 + 0.3 * nightK()) * br);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 地上百花开放（2:12）：近地上一片一片的野花——多是红的银莲花，间有白、黄、紫、粉；自园子向四处开去
  let MEADOW = null;
  const MCOL = [[214, 46, 52], [228, 64, 58], [246, 244, 236], [240, 198, 70], [150, 98, 200], [236, 142, 172]];
  function buildMeadow() {
    const R = U.mulberry32(5151);
    MEADOW = [];
    for (let i = 0; i < 250; i++) {
      // 一片一片地开：先定一个花丛的中心，再在其旁撒几朵
      const pc = (i / 6) | 0, cf = hsh(pc * 7.31) * 1.06 - 0.06, cv = 0.08 + Math.pow(hsh(pc * 3.17), 0.75) * 0.86;
      const f = cf + (R() - 0.5) * 0.05, v = clamp(cv + (R() - 0.5) * 0.08, 0.04, 0.96);
      const r = R(), ci = r < 0.3 ? 0 : r < 0.48 ? 1 : r < 0.62 ? 2 : r < 0.76 ? 3 : r < 0.88 ? 4 : 5;
      if (f > F.vine0 - 0.01 && f < F.vine1 + 0.01 && v < 0.5) continue;       // 葡萄园里不开
      MEADOW.push({ f, v, ci, k: 0.75 + R() * 0.5, ph: R() * TAU, o: Math.abs(f - 0.35) + R() * 0.25 });
    }
    MEADOW.sort((a, b) => a.o - b.o);
  }
  function drawMeadow(ctx) {
    const k = lv('sgMeadow');
    if (k < 0.005) return;
    if (!MEADOW) buildMeadow();
    const n = k * MEADOW.length;
    const P = MCOL.map(() => new Path2D()), ctr = new Path2D(), stem = new Path2D();
    const cnt = MCOL.map(() => 0);
    const gale = lv('gale');
    for (let i = 0; i < MEADOW.length && i < n + 1; i++) {
      const q = MEADOW[i], g = clamp(n - i, 0, 1);
      if (g <= 0.02) continue;
      const xf = LX(q.f), s = LS(2) * (0.55 + q.v * 0.95) * q.k * g;
      const sw = BAKE ? 0 : (W.wind * 0.6 + gale * (2.2 * GUST + 1.4 * Math.sin(W.t * 2.4 + q.ph))) * s;
      const x0 = xf * W.w, y0 = baseY(2, xf, q.v) + 1;
      if (y0 > W.h + 4) continue;
      const x = x0 + sw, y = y0 - 3.2 * s;
      stem.moveTo(x0, y0); stem.lineTo(x, y);
      const r = 0.85 * s;
      for (let j = 0; j < 5; j++) {
        const a = j * 1.2566 + q.ph;
        const px = x + Math.cos(a) * r * 0.9, py = y + Math.sin(a) * r * 0.7;
        P[q.ci].moveTo(px + r * 0.62, py); P[q.ci].arc(px, py, r * 0.62, 0, TAU);
      }
      ctr.moveTo(x + r * 0.4, y); ctr.arc(x, y, r * 0.4, 0, TAU);
      cnt[q.ci]++;
    }
    ctx.strokeStyle = css([70, 110, 56], 2); ctx.lineWidth = Math.max(0.5, 0.55 * LS(2)); ctx.stroke(stem);
    for (let c = 0; c < MCOL.length; c++) if (cnt[c]) { ctx.fillStyle = css(MCOL[c], 2, 1, 0.14); ctx.fill(P[c]); }
    ctx.fillStyle = css([60, 40, 40], 2); ctx.fill(ctr);
  }
  // 羊群的脚踪（1:8）：一对一对小小的蹄印，自葡萄园往帐棚那边亮起
  function drawTrack(ctx) {
    const k = lv('sgTrack');
    if (k < 0.01 || !TRACK) return;
    const p = new Path2D();
    const s = LS(2);
    for (const q of TRACK) {
      if (q.u > k) break;
      const xf = LX(q.f), x = xf * W.w, y = baseY(2, xf, q.v);
      for (const d of [-1, 1]) { const px = x + d * 2.3 * s, py = y + d * 0.6 * s; p.moveTo(px + 2 * s, py); p.ellipse(px, py, 2 * s, 1.1 * s, 0, 0, TAU); }
    }
    const a = Math.min(1, k * 3);
    ctx.fillStyle = css([80, 62, 46], 2, 0.6 * a); ctx.fill(p);
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(255, 226, 160, (0.6 + 0.3 * nightK()) * a * (0.8 + 0.2 * Math.sin(W.t * 2)));
    ctx.fill(p);
    if (SP) {
      for (const q of TRACK) {
        if (q.u > k) break;
        const xf = LX(q.f);
        glowAt(ctx, SP.gold, xf * W.w, baseY(2, xf, q.v), 9 * s, a * 0.5 * (0.7 + 0.3 * Math.sin(W.t * 2.2 + q.u * 9)), 0.6);
      }
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  // 泉与溪水（4:12，4:15）：自园中的泉涌出，穿过前墙下的涵洞，弯弯地流下海边
  const STREAM = [[0.42, 0.2], [0.405, 0.3], [0.382, 0.42], [0.352, 0.55], [0.3, 0.64], [0.225, 0.71], [0.14, 0.77], [0.05, 0.83], [-0.04, 0.88]];
  function streamPts() {
    const pts = STREAM.map(q => { const xf = LX(q[0]); return [xf * W.w, baseY(2, xf, q[1]), q[1]]; });
    const sp = W.landSpan(2);
    const x0 = sp ? sp[0] : W.w * 0.3;
    const last = pts[pts.length - 1];
    pts.push([lerp(last[0], x0 + W.w * 0.04, 0.5), lerp(last[1], W.h, 0.55), 0.8], [x0 + W.w * 0.035, W.h + 2, 1]);
    return pts;
  }
  // 平滑的河道：过各段中点的二次曲线，取密集的样点；并求它与前墙的交点（涵洞）
  let SG = null;
  function streamGeom() {
    const key = W.w + 'x' + W.h + ',' + port();
    if (SG && SG.key === key) return SG;
    const P = streamPts(), n = P.length, D = [];
    const q = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let start = P[0];
    D.push([start[0], start[1]]);
    for (let i = 1; i < n - 1; i++) {
      const end = i === n - 2 ? P[n - 1] : mid(P[i], P[i + 1]);
      for (let j = 1; j <= 10; j++) D.push(q(start, P[i], end, j / 10));
      start = end;
    }
    const L = [0];
    for (let i = 1; i < D.length; i++) L.push(L[i - 1] + Math.hypot(D[i][0] - D[i - 1][0], D[i][1] - D[i - 1][1]));
    // 与前墙（地上的一道折线）的第一个交点
    let cross = null;
    const F2 = wallPts().front;
    for (let i = 1; i < D.length && !cross; i++) {
      const a = D[i - 1], b = D[i];
      for (let j = 1; j < F2.length; j++) {
        const c = F2[j - 1], d = F2[j];
        const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
        if (Math.abs(den) < 1e-9) continue;
        const t = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den;
        const u = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) { cross = { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, ang: Math.atan2(d[1] - c[1], d[0] - c[0]) }; break; }
      }
    }
    SG = { key, D, L, tot: L[L.length - 1], cross };
    return SG;
  }
  // 涵洞里的暗处（先于水画，好让水从暗处流出）
  function drawCulvert(ctx) {
    const wk = lv('sgWall');
    if (wk < 0.01) return;
    const G = streamGeom();
    if (!G.cross) return;
    const s = LS(2) * 1.26, c = G.cross;
    ctx.save();
    ctx.translate(c.x, c.y + 1); ctx.rotate(c.ang);
    ctx.globalAlpha = Math.min(1, wk * 1.2);
    ctx.fillStyle = css([34, 30, 28], 2);
    ctx.beginPath(); ctx.moveTo(-3.6 * s, 0); ctx.lineTo(-3.6 * s, -2.6 * s * wk); ctx.arc(0, -2.6 * s * wk, 3.6 * s, Math.PI, 0); ctx.lineTo(3.6 * s, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawStream(ctx) {
    drawCulvert(ctx);
    const k = lv('sgStream');
    if (k < 0.005) return;
    const G = streamGeom(), D = G.D, L = G.L, reach = G.tot * k;
    const sky = mix(W.skyTop || [120, 160, 200], W.haze || [180, 200, 220], 0.5);
    const water = W.shade(mix([90, 140, 180], sky, 0.35), 0, 0.1);
    const s0 = LS(2);
    // 河身：一边一条边线，宽由泉口约 2 到入海处约 5（×s）
    const left = [], right = [];
    let last = 0;
    for (let i = 0; i < D.length; i++) {
      let p = D[i];
      if (L[i] > reach) {
        if (i === 0) break;
        const u = (reach - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
        p = [lerp(D[i - 1][0], D[i][0], u), lerp(D[i - 1][1], D[i][1], u)];
      }
      const a = D[Math.max(0, i - 1)], b = D[Math.min(D.length - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const f = Math.min(L[i], reach) / G.tot;
      const hw = s0 * (1.05 + 1.9 * f) * (0.92 + 0.08 * Math.sin(L[i] * 0.09 + W.t * 1.3));
      left.push([p[0] - ty * hw, p[1] + tx * hw * 0.8]); right.push([p[0] + ty * hw, p[1] - tx * hw * 0.8]);
      last = i;
      if (L[i] > reach) break;
    }
    if (left.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(left[0][0], left[0][1]);
    for (let i = 1; i < left.length; i++) ctx.lineTo(left[i][0], left[i][1]);
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    ctx.fillStyle = rgba(water, 0.95); ctx.fill();
    // 岸边的一道暗线（下侧）
    ctx.strokeStyle = rgba(mix(water, [30, 50, 50], 0.45), 0.45); ctx.lineWidth = Math.max(0.5, 0.6 * s0);
    ctx.beginPath(); left.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke();
    // 水面上漂动的断续亮光（两层，长短不一，随水往下流）
    const hiA = 0.5 * (0.4 + 0.6 * W.daylight) + 0.25 * nightK();
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i <= last; i++) { const p = D[i], y = p[1] - 0.35 * s0; if (i) ctx.lineTo(p[0], y); else ctx.moveTo(p[0], y); }
    ctx.strokeStyle = rgba(mix(water, [240, 248, 255], 0.6), hiA);
    ctx.lineWidth = Math.max(0.5, 0.75 * s0);
    ctx.setLineDash([5 * s0, 9 * s0, 2 * s0, 7 * s0]); ctx.lineDashOffset = -W.t * 14 * s0;
    ctx.stroke();
    ctx.strokeStyle = U.rgba(255, 252, 236, 0.75 * (0.3 + 0.7 * W.daylight));
    ctx.lineWidth = Math.max(0.4, 0.5 * s0);
    ctx.setLineDash([1.5 * s0, 17 * s0]); ctx.lineDashOffset = -W.t * 22 * s0 - 7 * s0;
    ctx.stroke();
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
  }
  // 园中的泉：石砌的井口；封闭时有一方石盖与一点红的封印；启封后活水涌出
  function drawWell(ctx) {
    const xf = LX(F.well), v = 0.2, s = LS(2) * (1 + 0.35 * v), x = xf * W.w, y = baseY(2, xf, v);
    const rx = 7 * s, ry = 2.6 * s, h = 4.5 * s;
    ctx.fillStyle = css([150, 138, 120], 2);
    ctx.beginPath(); ctx.moveTo(x - rx, y - h); ctx.lineTo(x - rx, y); ctx.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); ctx.lineTo(x + rx, y - h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([110, 100, 88], 2, 0.8); ctx.lineWidth = Math.max(0.5, 0.6 * s);
    ctx.beginPath(); for (let i = 1; i < 3; i++) { ctx.moveTo(x - rx, y - h * i / 3); ctx.lineTo(x + rx, y - h * i / 3); } ctx.stroke();
    ctx.fillStyle = css([176, 164, 144], 2, 1, 0.08);
    ctx.beginPath(); ctx.ellipse(x, y - h, rx, ry, 0, 0, TAU); ctx.fill();
    const sp = lv('sgSpring');
    if (sp < 0.98) {
      // 石盖与封印
      const lift = sp * 5 * s, a = 1 - sp;
      ctx.globalAlpha = a;
      ctx.fillStyle = css([132, 122, 108], 2);
      ctx.beginPath(); ctx.ellipse(x - sp * 4 * s, y - h - 1.2 * s - lift, rx * 0.86, ry * 0.9, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = U.rgba(186, 46, 40, 0.95 * a);
      ctx.beginPath(); ctx.arc(x - sp * 4 * s, y - h - 1.4 * s - lift, 1.3 * s, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (sp > 0.02) {
      ctx.fillStyle = rgba(W.shade([120, 170, 210], 0, 0.2), sp);
      ctx.beginPath(); ctx.ellipse(x, y - h, rx * 0.8, ry * 0.7, 0, 0, TAU); ctx.fill();
      // 涌出的水：几道弧
      ctx.strokeStyle = U.rgba(236, 246, 255, 0.7 * sp); ctx.lineWidth = Math.max(0.5, 0.7 * s); ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ph = (W.t * 0.9 + i / 5) % 1, hh = (3 + 3 * Math.sin(i * 1.7)) * s * sp, dx = (i - 2) * 1.6 * s;
        ctx.moveTo(x + dx * 0.3, y - h); ctx.quadraticCurveTo(x + dx * 0.6, y - h - hh * (1.2 - ph * 0.4), x + dx * (1 + ph * 0.4), y - h + 0.5 * s);
      }
      ctx.stroke();
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.dew, x, y - h - 2 * s, 12 * s, sp * (0.2 + 0.35 * nightK())); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    }
  }
  // 关锁的园（4:12）：后墙在地的轮廓线上，两侧的墙向前略张开，前墙低低的；右侧墙上有园门
  function wallPts() {
    const back = [], front = [];
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      const fb = lerp(F.wall0, F.wall1, u), ff = lerp(F.wall0 - 0.025, F.wall1 + 0.028, u);
      back.push([LX(fb) * W.w, baseY(2, LX(fb), 0.005)]);
      front.push([LX(ff) * W.w, baseY(2, LX(ff), 0.52)]);
    }
    return { back, front };
  }
  // 一段石墙（沿 pts，高由 h0 到 h1）：墙身、下半背光、两行交错的石缝、一道压顶石；春天墙头爬着绿藤
  function stoneBand(ctx, pts, h0, h1, tone, green) {
    const s = LS(2), n = pts.length - 1;
    const Hh = i => lerp(h0, h1, i / n);
    const topPath = () => { ctx.beginPath(); pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1] - Hh(i)); else ctx.moveTo(p[0], p[1] - Hh(i)); }); };
    topPath();
    for (let i = n; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + 1);
    ctx.closePath();
    ctx.fillStyle = css(tone, 2); ctx.fill();
    ctx.beginPath();
    pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1] - Hh(i) * 0.42); else ctx.moveTo(p[0], p[1] - Hh(i) * 0.42); });
    for (let i = n; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + 1);
    ctx.closePath();
    ctx.fillStyle = css(mix(tone, [52, 44, 38], 0.4), 2, 0.5); ctx.fill();
    // 石缝
    ctx.strokeStyle = css(mix(tone, [64, 54, 46], 0.55), 2, 0.6); ctx.lineWidth = Math.max(0.4, 0.45 * s);
    ctx.beginPath();
    pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1] - Hh(i) * 0.5); else ctx.moveTo(p[0], p[1] - Hh(i) * 0.5); });
    const step = 5.5 * s;
    let acc = 0;
    for (let i = 1; i <= n; i++) {
      const A = pts[i - 1], B = pts[i], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
      while (acc < L) {
        const u = acc / L, x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u), h = lerp(Hh(i - 1), Hh(i), u);
        ctx.moveTo(x, y - h * 0.5); ctx.lineTo(x, y - h * 0.04);
        const x2 = x + step * 0.5 * (B[0] - A[0]) / (L || 1), y2 = y + step * 0.5 * (B[1] - A[1]) / (L || 1);
        ctx.moveTo(x2, y2 - h * 0.94); ctx.lineTo(x2, y2 - h * 0.5);
        acc += step;
      }
      acc -= L;
    }
    ctx.stroke();
    // 压顶石
    topPath();
    ctx.strokeStyle = css(mix(tone, [255, 246, 226], 0.35), 2, 0.55 + 0.4 * dayA(), 0.1); ctx.lineWidth = Math.max(0.8, 1.7 * s);
    ctx.stroke();
    // 墙头的绿藤
    if (green > 0.02) {
      const G1 = new Path2D(), G2 = new Path2D();
      let acc2 = 0, k = 0;
      for (let i = 1; i <= n; i++) {
        const A = pts[i - 1], B = pts[i], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
        while (acc2 < L) {
          const u = acc2 / L, x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u) - lerp(Hh(i - 1), Hh(i), u);
          const r = (1.4 + 1.6 * hsh(k * 1.7)) * s * green;
          if (hsh(k * 3.3) < 0.72) { G1.moveTo(x + r, y); G1.ellipse(x, y - r * 0.2, r, r * 0.75, 0, 0, TAU); if (k % 2) { G2.moveTo(x + r * 0.5, y - r * 0.5); G2.ellipse(x, y - r * 0.5, r * 0.55, r * 0.4, 0, 0, TAU); } }
          if (hsh(k * 5.1) < 0.3) { const d = (2 + 4 * hsh(k)) * s * green; G1.moveTo(x + r * 0.4, y); G1.ellipse(x, y + d * 0.5, r * 0.45, d * 0.6, 0, 0, TAU); }
          acc2 += 4.2 * s; k++;
        }
        acc2 -= L;
      }
      ctx.fillStyle = css([62, 104, 52], 2); ctx.fill(G1);
      ctx.fillStyle = css([118, 160, 84], 2, 1, 0.06); ctx.fill(G2);
    }
  }
  function sideWall(ctx, b, f, hb, hf, tone, green) { stoneBand(ctx, [b, [lerp(b[0], f[0], 0.5), lerp(b[1], f[1], 0.5)], f], hb, hf, tone, green); }
  function drawWallBack(ctx) {
    const k = lv('sgWall');
    if (k < 0.01) return;
    const P = wallPts(), s = LS(2), h = 13 * s * k, gr = lv('sgLeaf') * k;
    stoneBand(ctx, P.back, h, h, [168, 154, 130], gr);
    sideWall(ctx, P.back[0], P.front[0], h, 6.5 * s * k * 1.18, [156, 142, 120], gr * 0.8);
  }
  function drawWallFront(ctx) {
    const k = lv('sgWall');
    if (k < 0.01) return;
    const P = wallPts(), s = LS(2), h = 13 * s * k, hf = 6.5 * s * k * 1.18, gr = lv('sgLeaf') * k;
    // 右墙与园门（门在右墙的后段）
    const b = P.back[P.back.length - 1], f = P.front[P.front.length - 1];
    const gA = 0.08, gB = 0.46;
    const at = u => [lerp(b[0], f[0], u), lerp(b[1], f[1], u), lerp(h, hf, u)];
    const g0 = at(gA), g1 = at(gB);
    sideWall(ctx, b, [g0[0], g0[1]], h, g0[2], [160, 146, 124], gr * 0.8);
    sideWall(ctx, [g1[0], g1[1]], f, g1[2], hf, [160, 146, 124], gr * 0.8);
    // 门柱与门
    const post = 2 * s;
    ctx.fillStyle = css([146, 132, 110], 2);
    ctx.fillRect(g0[0] - post / 2, g0[1] - g0[2] * 1.3, post, g0[2] * 1.3 + 1);
    ctx.fillRect(g1[0] - post / 2, g1[1] - g1[2] * 1.3, post, g1[2] * 1.3 + 1);
    const open = lv('sgGate');
    ctx.fillStyle = css([118, 86, 58], 2);
    ctx.beginPath();
    const u1 = lerp(gB, gA + 0.06, open);
    const d1 = at(u1);
    ctx.moveTo(g0[0], g0[1] - g0[2] * 1.05); ctx.lineTo(d1[0] + open * 3 * s, d1[1] - d1[2] * 1.05 - open * 2 * s);
    ctx.lineTo(d1[0] + open * 3 * s, d1[1] - open * 2 * s); ctx.lineTo(g0[0], g0[1]); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([80, 58, 40], 2, 0.7); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { const q = i / 4; ctx.moveTo(lerp(g0[0], d1[0] + open * 3 * s, q), lerp(g0[1] - g0[2] * 1.05, d1[1] - d1[2] * 1.05 - open * 2 * s, q)); ctx.lineTo(lerp(g0[0], d1[0] + open * 3 * s, q), lerp(g0[1], d1[1] - open * 2 * s, q)); }
    ctx.stroke();
    // 前墙：低低的一道，园里的百合看得见；溪水穿过的地方，墙下留一个拱形的涵洞
    const cr = streamGeom().cross;
    if (cr) {
      const cs = LS(2) * 1.26, ah = 2.6 * cs * k;
      const arch = (path, grow, open) => {
        const r = 3.6 * cs + grow;
        const c = Math.cos(cr.ang), sn = Math.sin(cr.ang);
        const T = (x, y) => [cr.x + x * c - y * sn, cr.y + 1 + x * sn + y * c];
        let q = T(-r, 2); path.moveTo(q[0], q[1]);
        q = T(-r, -ah); path.lineTo(q[0], q[1]);
        for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI; q = T(Math.cos(a) * r, -ah + Math.sin(a) * r); path.lineTo(q[0], q[1]); }
        q = T(r, 2); path.lineTo(q[0], q[1]);
        if (!open) path.closePath();
      };
      ctx.save();
      const clip = new Path2D();
      clip.rect(-10, -10, W.w + 20, W.h + 20);
      arch(clip, 0);
      ctx.clip(clip, 'evenodd');
      stoneBand(ctx, P.front, hf, hf, [174, 160, 136], gr * 0.6);
      ctx.restore();
      // 拱石
      const rim = new Path2D();
      arch(rim, 0.6 * cs, true);
      ctx.strokeStyle = css([132, 118, 98], 2, 0.9); ctx.lineWidth = Math.max(0.6, 1.1 * cs);
      ctx.stroke(rim);
    } else stoneBand(ctx, P.front, hf, hf, [174, 160, 136], gr * 0.6);
  }

  function drawGateGlow(ctx) {
    const open = lv('sgGate'), k = lv('sgWall');
    if (open < 0.05 || k < 0.01 || !SP) return;
    const P = wallPts(), s = LS(2), h = 13 * s * k;
    const b = P.back[P.back.length - 1], f = P.front[P.front.length - 1];
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, lerp(b[0], f[0], 0.27), lerp(b[1], f[1], 0.27) - h * 0.5, 14 * s, open * 0.35);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }

  // ── 静物的缓存：不动的布景先画在离屏画布上，光（时辰）、程度或屏幕变了才重画 ──
  const CACHE = {};
  let cacheSlots = 0;
  let BAKE = false;          // 正在画进缓存：风里的摇动一律为 0（摇动只在活画时加上）
  function lightKey() {
    const a = W.ambient || [0, 0, 0], h = W.haze || [0, 0, 0];
    return Math.round(W.daylight * 24) + ',' + ((a[0] / 8) | 0) + ',' + ((a[1] / 8) | 0) + ',' + ((a[2] / 8) | 0) + ',' + ((h[0] / 8) | 0) + ',' + ((h[1] / 8) | 0) + ',' + ((h[2] / 8) | 0);
  }
  const q40 = v => Math.round((v || 0) * 40);
  // 光在变（时辰流转）时，各块缓存轮流重画（每两帧至多一块，每块至少每 0.6 秒一次），免得一帧里全部重画
  function drawCached(ctx, id, key, box, fn) {
    if (!(box[2] > box[0] && box[3] > box[1])) return;
    const dpr = Math.min(2, W.dpr || 1);
    const dims = W.w + 'x' + W.h + '|' + dpr;
    const k = key + '|' + dims + '|' + lightKey();
    let c = CACHE[id];
    const bw = Math.max(1, Math.ceil((box[2] - box[0]) * dpr)), bh = Math.max(1, Math.ceil((box[3] - box[1]) * dpr));
    if (!c || c.key !== k) {
      const fresh = !c || c.dims !== dims || c.cv.width !== bw || c.cv.height !== bh;
      const lightOnly = c && c.key.split('|')[0] === key;
      const due = fresh || !lightOnly || W.t - c.t > 0.6 || W.t < c.t || ((W.frame | 0) % 10) === c.slot;
      if (due) {
        if (fresh) {
          let cv = null;
          try { cv = cnv(bw, bh); } catch (e) { cv = null; }
          if (!cv) { fn(ctx); return; }
          c = CACHE[id] = { cv, key: '', box: box.slice(), dims, t: -99, slot: ((cacheSlots++) * 2) % 10 };
        }
        const g = c.cv.getContext('2d');
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.clearRect(0, 0, bw, bh);
        g.setTransform(dpr, 0, 0, dpr, -box[0] * dpr, -box[1] * dpr);
        BAKE = true;
        try { fn(g); } finally { BAKE = false; }
        g.setTransform(1, 0, 0, 1, 0, 0);
        c.key = k; c.box = box.slice(); c.dims = dims; c.t = W.t;
      }
    }
    ctx.drawImage(c.cv, c.box[0], c.box[1], c.box[2] - c.box[0], c.box[3] - c.box[1]);
  }
  const calm = () => lv('gale') < 0.03;
  // 近地的一段（逻辑位置 f0..f1）上、自地的轮廓线往上 up 像素、往下到画面底
  function nearBox(f0, f1, up) {
    const x0 = Math.max(0, LX(f0) * W.w), x1 = Math.min(W.w, LX(f1) * W.w);
    let top = W.h;
    for (let i = 0; i <= 12; i++) top = Math.min(top, gY(2, lerp(x0, x1, i / 12) / W.w));
    return [Math.floor(x0), Math.floor(Math.max(0, top - up)), Math.ceil(x1), W.h];
  }
  function cachedNear(ctx) {
    const s = LS(2);
    // 园墙（后墙、左墙）与城
    drawCached(ctx, 'back', 'b' + q40(lv('sgWall')) + ',' + q40(lv('sgLeaf')), nearBox(F.wall0 - 0.05, 1.02, 60 * s), g => { drawWallBack(g); drawCity(g); });
    drawCityLamps(ctx);
    drawPalm(ctx);
    drawHouse(ctx);
    // 树与葡萄园
    const tk = 't' + q40(lv('sgLeaf')) + ',' + q40(lv('sgBlos')) + ',' + q40(lv('sgFig')) + ',' + q40(lv('sgApple')) + ',' + q40(lv('sgPom')) + ',' + q40(lv('sgPomFr')) + ',' + q40(lv('sgVine')) + ',' + q40(lv('sgGrape'));
    if (calm()) drawCached(ctx, 'trees', tk, nearBox(F.fig - 0.12, F.vine1 + 0.04, 120 * s), g => { drawNearTrees(g); drawVineyard(g); });
    else { drawNearTrees(ctx); drawVineyard(ctx); }
    drawWell(ctx);
    drawStream(ctx);
    // 野花、百合与荆棘
    const mk = 'm' + Math.round(lv('sgMeadow') * 250) + ',' + Math.round(lv('sgLily') * 30) + ',' + q40(lv('sgLily1')) + ',' + q40(lv('sgThorn'));
    if (calm()) drawCached(ctx, 'meadow', mk, nearBox(-0.12, 1.02, 30 * s), g => { drawMeadow(g); drawGarden(g); });
    else { drawMeadow(ctx); drawGarden(ctx); }
    drawLilyGlow(ctx);
    drawTrack(ctx);
    drawCached(ctx, 'front', 'f' + q40(lv('sgWall')) + ',' + q40(lv('sgLeaf')) + ',' + q40(lv('sgGate')), nearBox(F.wall0 - 0.05, F.wall1 + 0.06, 40 * s), g => drawWallFront(g));
    drawGateGlow(ctx);
  }

  // ════════════════════════════════════════════════════════════
  //  帐棚 · 她的家 · 耶路撒冷的城墙 · 海边的磐石
  // ════════════════════════════════════════════════════════════
  // 基达的帐棚（1:5）：黑山羊毛织的矮帐，三根柱子撑着下垂的顶
  function drawTent(ctx, f, w, k) {
    const s = LS(2), xf = LX(f), x = xf * W.w, g = gY(2, xf) + 1.5 * s, tw = w * s, th = 15.5 * s;
    ctx.globalAlpha = k;
    ctx.fillStyle = css([46, 40, 38], 2);
    ctx.beginPath();
    ctx.moveTo(x - tw / 2, g);
    ctx.lineTo(x - tw * 0.46, g - th * 0.66);
    ctx.quadraticCurveTo(x - tw * 0.36, g - th * 0.84, x - tw * 0.22, g - th);
    ctx.quadraticCurveTo(x - tw * 0.1, g - th * 0.8, x + tw * 0.02, g - th * 0.97);
    ctx.quadraticCurveTo(x + tw * 0.16, g - th * 0.82, x + tw * 0.28, g - th * 1.02);
    ctx.quadraticCurveTo(x + tw * 0.38, g - th * 0.84, x + tw * 0.47, g - th * 0.64);
    ctx.lineTo(x + tw / 2, g); ctx.closePath(); ctx.fill();
    // 毛织的条纹
    ctx.strokeStyle = css([86, 76, 68], 2, 0.5); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 1; i < 3; i++) { const y = g - th * (0.3 * i); ctx.moveTo(x - tw * 0.46, y); ctx.lineTo(x + tw * 0.46, y); }
    ctx.stroke();
    // 门口
    ctx.fillStyle = css([20, 16, 14], 2);
    ctx.fillRect(x - tw * 0.08, g - th * 0.62, tw * 0.16, th * 0.62);
    // 拉绳
    ctx.strokeStyle = css([120, 100, 80], 2, 0.6); ctx.lineWidth = Math.max(0.4, 0.45 * s);
    ctx.beginPath(); ctx.moveTo(x - tw * 0.22, g - th); ctx.lineTo(x - tw * 0.72, g + 0.5 * s); ctx.moveTo(x + tw * 0.28, g - th * 1.02); ctx.lineTo(x + tw * 0.78, g + 0.5 * s); ctx.stroke();
    // 夜里帐中的火
    const nk = nightK();
    if (nk > 0.2 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, x, g - th * 0.3, th * 0.9, k * nk * 0.5);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  // 她的家：平顶的小屋，门在左，门旁一扇格子窗（窗棂）
  function houseGeom() {
    const s = LS(2), xf = LX(F.house), x = xf * W.w, y = gY(2, xf) + 1.5 * s;
    return { s, x, y, w: 30 * s, h: 22 * s, dx: x - 7.5 * s, win: [x - 1 * s, y - 15 * s] };
  }
  function drawHouse(ctx) {
    const G = houseGeom(), { s, x, y, w, h } = G;
    const tone = [182, 164, 138];
    const d = litX() >= x ? 1 : -1;
    ctx.fillStyle = css(tone, 2);
    ctx.fillRect(x - w / 2, y - h, w, h);
    ctx.fillStyle = css(mix(tone, [40, 32, 28], 0.34), 2, 0.9);
    const sw = w * 0.22;
    ctx.fillRect(d > 0 ? x - w / 2 : x + w / 2 - sw, y - h, sw, h);
    ctx.fillStyle = css(mix(tone, [70, 58, 46], 0.3), 2);
    ctx.fillRect(x - w / 2 - 1.4 * s, y - h - 2 * s, w + 2.8 * s, 2.2 * s);
    // 门
    const dw = 5.4 * s, dh = 11 * s, door = lv('sgDoor');
    ctx.fillStyle = css([40, 30, 24], 2);
    ctx.fillRect(G.dx - dw / 2, y - dh, dw, dh);
    ctx.fillStyle = css([118, 88, 60], 2);
    const ow = dw * (1 - 0.8 * door);
    ctx.fillRect(G.dx - dw / 2, y - dh, ow, dh);
    // 窗棂
    const [wx, wy] = G.win, ww = 7 * s, wh = 6 * s;
    ctx.fillStyle = css([30, 24, 20], 2);
    ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
    // 灯
    const lamp = Math.max(lv('sgLamp') * Math.min(1, nightK() * 1.2 + 0.15), lv('sgWin'));
    if (lamp > 0.02) {
      const fl = 0.85 + 0.15 * Math.sin(W.t * 6 + 1.3);
      ctx.fillStyle = U.rgba(255, 186, 104, Math.min(1, lamp * fl));
      ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
    }
    if (door > 0.02) { ctx.fillStyle = U.rgba(255, 196, 120, Math.min(1, door * (0.5 + 0.5 * nightK()))); ctx.fillRect(G.dx - dw / 2 + ow, y - dh, dw - ow, dh); }
    ctx.strokeStyle = css([98, 76, 56], 2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { ctx.moveTo(wx - ww / 2 + ww * i / 4, wy - wh / 2); ctx.lineTo(wx - ww / 2 + ww * i / 4, wy + wh / 2); }
    for (let i = 1; i < 3; i++) { ctx.moveTo(wx - ww / 2, wy - wh / 2 + wh * i / 3); ctx.lineTo(wx + ww / 2, wy - wh / 2 + wh * i / 3); }
    ctx.stroke();
    // 迎光的边
    ctx.strokeStyle = css([255, 240, 214], 2, 0.42 * dayA(), 0.25);
    ctx.beginPath(); ctx.moveTo(x - w / 2 - 1.4 * s, y - h - 2 * s); ctx.lineTo(x + w / 2 + 1.4 * s, y - h - 2 * s); ctx.stroke();
    // 屋顶上的斑鸠（2:12）
    if (S.turtle === 'roof' && !FXL.some(e => e.type === 'turtles')) {
      drawDove(ctx, x + 4 * s, y - h - 2 * s, s * 0.95, -1, 0, true, [150, 132, 118], 1);
      drawDove(ctx, x + 8.5 * s, y - h - 2 * s, s * 0.95, -1, 0, true, [160, 140, 124], 1);
    }
  }
  // 耶路撒冷：城墙、城楼与城门；墙后露出屋顶
  function drawCity(ctx) {
    const s = LS(2), x0 = LX(F.city) * W.w, x1 = W.w + 12, gx = LX(F.cgate) * W.w;
    const tone = [196, 180, 150];
    const gAt = x => gY(2, clamp(x / W.w, 0, 1)) + 1.5 * s;
    // 墙后的屋顶
    ctx.fillStyle = css([170, 150, 124], 2);
    for (let i = 0; i < 7; i++) {
      const hx = lerp(x0 + 6 * s, x1, (i + 0.3) / 7), hw = (9 + 5 * hsh(i * 3.7)) * s, hh = (27 + 8 * hsh(i * 1.9)) * s;
      ctx.fillRect(hx - hw / 2, gAt(hx) - hh, hw, hh);
    }
    // 墙
    const wh = 20 * s;
    ctx.fillStyle = css(tone, 2);
    ctx.beginPath();
    ctx.moveTo(x0, gAt(x0));
    for (let x = x0; x <= x1; x += 4 * s) {
      const y = gAt(x) - wh, k = Math.floor((x - x0) / (4 * s)) % 2;
      ctx.lineTo(x, y - (k ? 2.4 * s : 0)); ctx.lineTo(x + 4 * s, y - (k ? 2.4 * s : 0));
    }
    ctx.lineTo(x1, gAt(x1)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([150, 134, 108], 2, 0.5); ctx.lineWidth = Math.max(0.4, 0.5 * s);
    ctx.beginPath();
    for (let i = 1; i < 4; i++) { ctx.moveTo(x0, gAt(x0) - wh * i / 4); ctx.lineTo(x1, gAt(x1) - wh * i / 4); }
    ctx.stroke();
    // 城楼与城门
    const tw = 18 * s, th = 32 * s, gy = gAt(gx);
    ctx.fillStyle = css(mix(tone, [120, 100, 80], 0.15), 2);
    ctx.fillRect(gx - tw / 2, gy - th, tw, th);
    ctx.fillStyle = css(mix(tone, [120, 100, 80], 0.15), 2);
    for (let i = 0; i < 4; i++) ctx.fillRect(gx - tw / 2 + i * tw / 3.5, gy - th - 3 * s, tw / 7, 3 * s);
    ctx.fillStyle = css([34, 26, 22], 2);
    ctx.beginPath();
    ctx.moveTo(gx - 4.5 * s, gy); ctx.lineTo(gx - 4.5 * s, gy - 10 * s); ctx.arc(gx, gy - 10 * s, 4.5 * s, Math.PI, 0); ctx.lineTo(gx + 4.5 * s, gy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = css([255, 240, 214], 2, 0.38 * dayA(), 0.25); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(gx - tw / 2, gy - th); ctx.lineTo(gx + tw / 2, gy - th); ctx.stroke();
  }
  // 城门口的火把（活的，不入缓存）
  function drawCityLamps(ctx) {
    const s = LS(2), gx = LX(F.cgate) * W.w, gy = gY(2, clamp(gx / W.w, 0, 1)) + 1.5 * s;
    const lamp = lv('sgLamp') * Math.min(1, nightK() * 1.3);
    if (lamp > 0.02 && SP) {
      ctx.globalCompositeOperation = 'lighter';
      for (const dx of [-7 * s, 7 * s]) {
        const fl = 0.8 + 0.2 * Math.sin(W.t * 9 + dx);
        glowAt(ctx, SP.lamp, gx + dx, gy - 13 * s, 16 * s, lamp * fl * 0.8);
        ctx.globalAlpha = lamp; ctx.fillStyle = 'rgb(255,214,140)';
        ctx.beginPath(); ctx.arc(gx + dx, gy - 13 * s, 1.1 * s, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 海边的磐石：烈焰燃在其上（8:6）——在近地左端下坡入海之处，大浪扑得到它
  function rockGeom() { const s = LS(2) * 1.12, xf = port() ? 0.4 : 0.466, x = xf * W.w, y = gY(2, xf) + 3 * s; return { s, x, y, top: y - 11 * s, xf }; }
  function drawBoulder(ctx) {
    const { s, x, y } = rockGeom();
    ctx.fillStyle = css([128, 120, 110], 2);
    ctx.beginPath();
    ctx.moveTo(x - 13 * s, y + 2 * s);
    ctx.quadraticCurveTo(x - 12 * s, y - 7 * s, x - 5 * s, y - 10.5 * s);
    ctx.quadraticCurveTo(x + 2 * s, y - 12.5 * s, x + 8 * s, y - 8 * s);
    ctx.quadraticCurveTo(x + 13 * s, y - 3 * s, x + 12 * s, y + 2 * s);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = css([84, 78, 72], 2, 0.5);
    ctx.beginPath(); ctx.moveTo(x + 2 * s, y - 11.5 * s); ctx.quadraticCurveTo(x + 12 * s, y - 5 * s, x + 12 * s, y + 2 * s); ctx.lineTo(x + 3 * s, y + 2 * s); ctx.quadraticCurveTo(x + 6 * s, y - 5 * s, x + 2 * s, y - 11.5 * s); ctx.fill();
    // 浪打湿的下半
    const wv = lv('sgWaves');
    if (wv > 0.05) {
      ctx.fillStyle = css([60, 64, 70], 2, 0.45 * Math.min(1, wv * 1.5));
      ctx.beginPath(); ctx.moveTo(x - 13 * s, y + 2 * s); ctx.quadraticCurveTo(x - 12.6 * s, y - 3.5 * s, x - 9 * s, y - 5 * s); ctx.quadraticCurveTo(x, y - 2 * s, x + 12.2 * s, y - 1 * s); ctx.lineTo(x + 12 * s, y + 2 * s); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = css([230, 220, 200], 2, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.8 * s);
    ctx.beginPath(); ctx.moveTo(x - 11 * s, y - 5 * s); ctx.quadraticCurveTo(x - 7 * s, y - 10 * s, x - 1 * s, y - 11.4 * s); ctx.stroke();
  }
  // 大浪一次一次扑上岸（8:7）：纯由时刻与 sgWaves 算出（装饰，不是状态）
  const SURGE_T = 2.6;
  function surge() {
    const k = smoothstep(0.2, 0.8, lv('sgWaves'));
    if (k < 0.01) return null;
    const T = W.t / SURGE_T, ph = T - Math.floor(T);
    const h = ph < 0.42 ? ease(ph / 0.42) : ph < 0.56 ? 1 : 1 - ease((ph - 0.56) / 0.44);
    const dip = ph > 0.38 && ph < 0.62 ? Math.sin(Math.PI * (ph - 0.38) / 0.24) : 0;
    const over = ph > 0.56 && ph < 0.96 ? Math.sin(Math.PI * (ph - 0.56) / 0.4) : 0;
    return { ph, h: h * k, dip: dip * k, over: over * k, k, n: Math.floor(T) };
  }
  // 扑上岸的浪：水面自海里漫上坡，浪峰带白沫，一直冲过磐石的脚，又退回去
  function drawSurge(ctx) {
    const S2 = surge();
    if (!S2 || S2.h < 0.02) return;
    const R = rockGeom(), s = R.s;
    const xT = lerp(R.x - W.w * 0.12, R.x - 3 * s, S2.h);
    const yT = gY(2, clamp(xT / W.w, 0, 1)) - (1 + 5 * S2.h) * s;
    const xL = xT - W.w * 0.2, span = xT - xL;
    const crestH = (3 + 7 * Math.sin(Math.PI * Math.min(1, S2.ph / 0.56))) * s * S2.k;
    const deep = W.shade([26, 58, 74], 0.1), mid = W.shade([58, 104, 124], 0.1, 0.05), thin = W.shade([120, 162, 178], 0.1, 0.08);
    // 水面：左边低平、带小浪，近浪头处隆起成浪峰
    const top = [];
    for (let i = 0; i <= 20; i++) {
      const u = i / 20, x = xL + span * u;
      const bump = Math.pow(Math.max(0, Math.sin(Math.PI * clamp((u - 0.5) / 0.5, 0, 1))), 1.3) * crestH;
      top.push([x, yT + (1 - u) * 5 * s - bump + Math.sin(u * 17 + W.t * 2.3) * 0.8 * s * (1 - u)]);
    }
    // 浪在近地坡面上的前缘：自浪尖弯弯地斜到画面下缘，边上一点一点起伏
    const edge = [];
    const xB = xT - W.w * 0.075;
    for (let i = 0; i <= 12; i++) {
      const v = i / 12, y = lerp(yT + 1.5 * s, W.h + 4, v);
      const x = xT + (xB - xT) * Math.pow(v, 0.75) + 5 * s * Math.sin(Math.PI * v) + Math.sin(v * 11 + W.t * 3.1) * 1.4 * s * (1 - v * 0.5);
      edge.push([x, y]);
    }
    ctx.beginPath();
    ctx.moveTo(xL, W.h + 4);
    for (const q of top) ctx.lineTo(q[0], q[1]);
    for (const q of edge) ctx.lineTo(q[0], q[1]);
    ctx.closePath();
    const g = ctx.createLinearGradient(xL, 0, xT, 0);
    g.addColorStop(0, rgba(deep, 0)); g.addColorStop(0.3, rgba(deep, 0.78)); g.addColorStop(0.75, rgba(mid, 0.9)); g.addColorStop(1, rgba(thin, 0.8));
    ctx.fillStyle = g; ctx.fill();
    // 白沫：浪峰上一道（先一道宽而淡的，再一道细而亮的），前缘一道断断续续的
    const fa = (0.7 + 0.3 * W.daylight) * Math.min(1, S2.h * 2.2);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const crest = () => { ctx.beginPath(); for (let i = 10; i < top.length; i++) { const q = top[i]; if (i === 10) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); } for (let i = 0; i < 4; i++) ctx.lineTo(edge[i][0], edge[i][1]); };
    crest(); ctx.strokeStyle = U.rgba(236, 244, 250, 0.35 * fa); ctx.lineWidth = Math.max(1.5, 4.5 * s); ctx.stroke();
    crest(); ctx.strokeStyle = U.rgba(246, 250, 252, 0.9 * fa); ctx.lineWidth = Math.max(0.8, 1.5 * s); ctx.stroke();
    ctx.beginPath(); for (let i = 3; i < edge.length; i++) { const q = edge[i]; if (i === 3) ctx.moveTo(q[0], q[1]); else ctx.lineTo(q[0], q[1]); }
    ctx.strokeStyle = U.rgba(236, 244, 250, 0.55 * fa); ctx.lineWidth = Math.max(0.6, 1.3 * s);
    ctx.setLineDash([7 * s, 3 * s, 2 * s, 4 * s]); ctx.lineDashOffset = -W.t * 8 * s; ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
    // 浪峰上的沫点
    ctx.fillStyle = U.rgba(244, 248, 252, 0.8 * fa);
    ctx.beginPath();
    for (let j = 0; j < 9; j++) { const i = 11 + Math.floor(hsh(j * 3.3 + S2.n) * 9), q = top[Math.min(top.length - 1, i)], r = (0.8 + 1.2 * hsh(j * 7.1)) * s; ctx.moveTo(q[0] + r, q[1] - 1.5 * s); ctx.arc(q[0], q[1] - 1.5 * s - hsh(j * 1.9) * 3 * s, r, 0, TAU); }
    ctx.fill();
    // 远一点的一道水纹
    ctx.strokeStyle = U.rgba(236, 244, 250, 0.3 * fa); ctx.lineWidth = Math.max(0.5, 0.9 * s);
    ctx.beginPath(); for (let i = 3; i < 11; i++) { const q = top[i]; if (i === 3) ctx.moveTo(q[0], q[1] + 3 * s); else ctx.lineTo(q[0], q[1] + 3 * s); } ctx.stroke();
    // 退浪时坡上留下一片湿亮
    if (S2.ph > 0.56) {
      ctx.globalCompositeOperation = 'lighter';
      sprites();
      if (SP) glowAt(ctx, SP.pale, R.x - 8 * s, R.y, 16 * s, 0.25 * S2.k * (1 - S2.h), 0.4);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
  }
  // 烈焰：几层火舌，自下而上由白黄到橙，到尖上透明；大浪扑来时低一低，随即更旺
  function drawFlame(ctx) {
    const k = lv('sgFlame');
    if (k < 0.01) return;
    sprites();
    const R = rockGeom(), s = R.s, x = R.x - 1 * s, y = R.top + 1 * s;
    const S2 = surge();
    const kick = S2 ? 1 - 0.4 * S2.dip + 0.38 * S2.over : 1;
    const h = 24 * s * (0.75 + 0.25 * k) * kick * (1 + 0.15 * lv('sgWaves'));
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.warm, x, y - h * 0.45, h * 2.4, k * (0.35 + 0.45 * nightK() + 0.2 * lv('storm')) * (0.8 + 0.3 * kick));
    glowAt(ctx, SP.gold, x, y - h * 0.4, h * 1.1, k * 0.5);
    ctx.globalCompositeOperation = 'source-over';
    const T4 = [[0, 1, 0.9], [-0.28, 0.72, 0.85], [0.26, 0.78, 0.85], [0.1, 0.56, 0.9], [-0.06, 0.42, 1]];
    const lean = -lv('gale') * 0.35 + W.wind * 0.1;
    for (let i = 0; i < T4.length; i++) {
      const q = T4[i];
      const f = 0.82 + 0.12 * Math.sin(W.t * 13 + i) + 0.08 * Math.sin(W.t * 23.7 + i * 2);
      const H = h * q[1] * f, w = h * 0.22 * q[1] * (i === 4 ? 0.8 : 1);
      const sx = x + q[0] * h * 0.5 + Math.sin(W.t * 6 + i * 3) * h * 0.05;
      const tipX = sx + lean * H * 0.5 + Math.sin(W.t * 8 + i) * w * 0.45;
      const g = ctx.createLinearGradient(sx, y, tipX, y - H);
      const a = k * q[2];
      if (i === 4) { g.addColorStop(0, U.rgba(255, 255, 240, a)); g.addColorStop(0.5, U.rgba(255, 246, 200, a * 0.9)); g.addColorStop(1, U.rgba(255, 230, 160, 0)); }
      else { g.addColorStop(0, U.rgba(255, 244, 196, a)); g.addColorStop(0.28, U.rgba(255, 200, 96, a * 0.95)); g.addColorStop(0.62, U.rgba(250, 120, 44, a * 0.8)); g.addColorStop(1, U.rgba(230, 70, 30, 0)); }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx - w, y);
      ctx.quadraticCurveTo(sx - w * 1.05 + lean * H * 0.2, y - H * 0.5, tipX, y - H);
      ctx.quadraticCurveTo(sx + w * 1.05 + lean * H * 0.2, y - H * 0.5, sx + w, y);
      ctx.quadraticCurveTo(sx, y + w * 0.3, sx - w, y);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, SP.gold, x, y - h * 0.18, h * 0.35, k * 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  中洲：磐石穴（2:14）· 所罗门的轿与烟柱（3:6–10）
  // ════════════════════════════════════════════════════════════
  // 磐石穴（2:14）：中洲上一座高高的陡岩，正面一道深的裂缝，缝下一处暗的石穴（隐密处）——鸽子就栖在那里
  const CLEFT_H = 55, CLEFT_W = 27;
  function cleftGeom() { const s = LS(1), x = MX.rock * W.w, y = gY(1, MX.rock) + 2 * s; return { s, x, y, cx: x + 0.1 * CLEFT_W * s, cy: y - 0.3 * CLEFT_H * s }; }
  function drawCleftRock(ctx) {
    const { s, x, y } = cleftGeom();
    const H = CLEFT_H * s, Wd = CLEFT_W * s;
    const P = (p) => [x + p[0] * Wd, y + p[1] * H];
    const path = (arr) => { ctx.beginPath(); arr.forEach((p, i) => { const q = P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.closePath(); };
    const pts = [[-1.15, 0.04], [-1.05, -0.2], [-0.93, -0.28], [-0.85, -0.5], [-0.67, -0.6], [-0.58, -0.8], [-0.38, -0.88], [-0.22, -1], [-0.04, -0.95], [0.1, -1.02], [0.28, -0.9], [0.44, -0.83], [0.55, -0.64], [0.74, -0.53], [0.86, -0.34], [1.04, -0.22], [1.2, 0.04]];
    path(pts); ctx.fillStyle = css([140, 128, 114], 1); ctx.fill();
    // 背光的一面（右）
    path([[0.1, -1.02], [0.28, -0.9], [0.44, -0.83], [0.55, -0.64], [0.74, -0.53], [0.86, -0.34], [1.04, -0.22], [1.2, 0.04], [0.42, 0.04], [0.5, -0.4], [0.3, -0.7]]);
    ctx.fillStyle = css([82, 74, 68], 1, 0.62); ctx.fill();
    // 几道层理
    ctx.strokeStyle = css([98, 88, 80], 1, 0.6); ctx.lineWidth = Math.max(0.4, 0.55 * s);
    ctx.beginPath();
    for (const [u, a0, a1] of [[-0.62, -0.62, -0.2], [-0.45, -0.86, -0.4], [-0.16, -1.02, -0.5], [-0.5, 0.36, 0.7], [-0.14, 0.62, 1.05]]) { const A = P([a0, u]), B = P([a1, u + 0.03]); ctx.moveTo(A[0], A[1]); ctx.quadraticCurveTo((A[0] + B[0]) / 2, A[1] - 0.03 * H, B[0], B[1]); }
    ctx.stroke();
    // 陡岩的裂缝：自上而下一道窄缝，到下半开成一处暗的石穴
    const deep = W.shade([18, 14, 14], 0.25);
    ctx.fillStyle = rgba(deep, 1);
    path([[0.02, -0.86], [0.13, -0.68], [0.16, -0.5], [0.28, -0.42], [0.36, -0.28], [0.3, -0.16], [0.1, -0.12], [-0.12, -0.16], [-0.18, -0.28], [-0.08, -0.42], [0.04, -0.5], [0.06, -0.68]]);
    ctx.fill();
    // 石穴口下沿一道亮的石边（鸽子站在上面）
    ctx.strokeStyle = css([236, 222, 196], 1, 0.3 + 0.3 * dayA(), 0.2); ctx.lineWidth = Math.max(0.6, 0.9 * s);
    ctx.beginPath(); { const A = P([-0.14, -0.15]), B = P([0.1, -0.1]), C2 = P([0.32, -0.15]); ctx.moveTo(A[0], A[1]); ctx.quadraticCurveTo(B[0], B[1] + 1, C2[0], C2[1]); } ctx.stroke();
    // 迎光的山脊
    ctx.strokeStyle = css([226, 214, 194], 1, 0.35 * dayA(), 0.2); ctx.lineWidth = Math.max(0.5, 0.7 * s);
    ctx.beginPath(); pts.slice(0, 10).forEach((p, i) => { const q = P(p); if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); }); ctx.stroke();
  }
  // 所罗门的轿：金的底、银的柱、紫色的坐垫与幔子，黎巴嫩木的杠（3:9–10）
  function litterX() {
    if (LIT) { const u = clamp((W.t - LIT.t0) / LIT.dur, 0, 1); return lerp(LIT.x0, LIT.x1, u); }
    return S.litX;
  }
  // 形状如烟柱（3:6）：自轿上升起一根柔而浓的香烟柱，越高越宽、越淡；夜里是暗的烟，天亮了才是淡白的
  function drawSmoke(ctx) {
    const k = lv('sgSmoke');
    if (k < 0.01 || !SP) return;
    const L = litterTop(), s = LS(1), bx = L[0], by = L[1] + 2 * s;
    const H = W.h * 0.26, dl = W.daylight;
    const n = 28;
    for (let i = 0; i < n; i++) {
      const q = ((i / n) + W.t * 0.035) % 1;
      const y = by - q * H, x = bx + Math.sin(q * 4.2 + W.t * 0.35 + i * 0.7) * (3 + 12 * q) * s + W.wind * q * 20 * s;
      const r = (10 + 32 * q) * s;
      const a = k * Math.min(1, q * 6 + 0.25) * Math.pow(1 - q, 1.3);
      glowAt(ctx, SP.smoke, x, y, r, a * 0.58 * (0.3 + 0.7 * dl));
      if (dl < 0.7) glowAt(ctx, SP.smokeD, x, y, r, a * 0.4 * (1 - dl / 0.7));
      glowAt(ctx, SP.puff, x - r * 0.2, y - r * 0.25, r * 0.55, a * 0.3 * (0.2 + 0.8 * W.daylight));
    }
    ctx.globalAlpha = 1;
  }
  // 轿的尺度（比人群略大，好当本句的焦点）
  const LITK = 2.4;
  function litterTop() { const s = LS(1) * LITK, lx = litterX(); return [lx * W.w, gY(1, lx) - 13.5 * s - 7 * s - 7 * s, s]; }
  function drawLitter(ctx) {
    const k = lv('sgLitter');
    if (k < 0.01) return;
    const s = LS(1) * LITK, lx = litterX(), x = lx * W.w, y = gY(1, lx) - 13.5 * s;
    const bw = 12 * s, bh = 7 * s;
    ctx.globalAlpha = k;
    // 杠
    ctx.strokeStyle = css([110, 80, 52], 1); ctx.lineWidth = Math.max(0.7, 1.2 * s);
    ctx.beginPath(); ctx.moveTo(x - bw * 1.35, y + 1 * s); ctx.lineTo(x + bw * 1.35, y + 1 * s); ctx.stroke();
    // 金的底
    ctx.fillStyle = css([214, 170, 72], 1, 1, 0.12);
    ctx.fillRect(x - bw / 2, y - 1.6 * s, bw, 2.6 * s);
    // 紫色的幔子
    ctx.fillStyle = css([110, 56, 116], 1);
    ctx.fillRect(x - bw * 0.42, y - bh - 1.6 * s, bw * 0.84, bh);
    ctx.fillStyle = css([140, 80, 146], 1, 0.7);
    ctx.fillRect(x - bw * 0.42, y - bh - 1.6 * s, bw * 0.84, bh * 0.22);
    // 银的柱
    ctx.fillStyle = css([214, 218, 226], 1, 1, 0.1);
    ctx.fillRect(x - bw / 2, y - bh - 2 * s, 1 * s, bh + 0.6 * s); ctx.fillRect(x + bw / 2 - 1 * s, y - bh - 2 * s, 1 * s, bh + 0.6 * s);
    // 顶
    ctx.fillStyle = css([226, 184, 84], 1, 1, 0.14);
    ctx.beginPath(); ctx.moveTo(x - bw * 0.62, y - bh - 1.8 * s); ctx.quadraticCurveTo(x, y - bh - 7 * s, x + bw * 0.62, y - bh - 1.8 * s); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // 头戴冠冕（3:11）：轿顶上方一只小小的金冠（一道金环，五个尖），有光
    const cr = lv('sgCrown') * k;
    if (cr > 0.01) {
      const cx = x, cy = y - bh - 9.5 * s, cw = 3.6 * s, ch = 2.2 * s;
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, cx, cy - ch * 0.4, 9 * s, cr * (0.38 + 0.1 * Math.sin(W.t * 1.6))); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = cr;
      ctx.fillStyle = css([246, 206, 96], 1, 1, 0.3);
      ctx.beginPath();
      ctx.moveTo(-cw + cx, cy);
      for (let i = 0; i <= 8; i++) { const u = i / 8, px = cx - cw + 2 * cw * u; ctx.lineTo(px, cy - ch * (i % 2 ? 0.55 : 1.25)); }
      ctx.lineTo(cx + cw, cy);
      ctx.quadraticCurveTo(cx, cy + ch * 0.55, cx - cw, cy);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = U.rgba(255, 244, 210, 0.8 * cr); ctx.lineWidth = Math.max(0.5, 0.35 * s);
      ctx.beginPath(); ctx.moveTo(cx - cw, cy); ctx.quadraticCurveTo(cx, cy + ch * 0.55, cx + cw, cy); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (SP) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.gold, x, y - bh - 3 * s, 12 * s, k * (0.25 + 0.2 * Math.sin(W.t * 1.3)));
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  鸽子 · 斑鸠 · 小狐狸
  // ════════════════════════════════════════════════════════════
  // 鸽子：面向 +x；flap 0..1 振翅相位；perched 栖着
  function drawDove(ctx, x, y, s, face, flap, perched, col, a) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(face * s, s);
    ctx.globalAlpha = a;
    ctx.fillStyle = css(col, 2, 1, 0.1);
    ctx.beginPath();
    ctx.ellipse(0, -2.3, 3.1, 1.75, perched ? -0.15 : 0, 0, TAU);
    ctx.moveTo(3.9, -3.6); ctx.arc(2.8, -3.6, 1.15, 0, TAU);
    ctx.moveTo(-2.4, -2.4); ctx.lineTo(-5.6, perched ? -1.2 : -2.1); ctx.lineTo(-5.4, perched ? -0.3 : -1.1); ctx.lineTo(-2.2, -1.4);
    ctx.fill();
    ctx.fillStyle = css([200, 140, 110], 2);
    ctx.fillRect(3.8, -3.8, 0.9, 0.5);
    ctx.fillStyle = css(mix(col, [255, 255, 255], 0.25), 2, 1, 0.15);
    ctx.beginPath();
    if (perched) ctx.ellipse(-0.4, -2.6, 2.4, 1, -0.2, 0, TAU);
    else {
      const w = Math.sin(flap * TAU);
      ctx.moveTo(0.8, -2.8); ctx.quadraticCurveTo(-0.5, -2.8 - 5.5 * w, -2.6, -3 - 6 * w); ctx.quadraticCurveTo(-1.6, -2.6, -1.2, -2.2); ctx.closePath();
    }
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function dovePerchXY() {
    if (S.dove === 'apple') { const b = appleBranch(); return [b[0], b[1], LS(2) * 1.6, 2]; }
    const c = cleftGeom(); return [c.cx, c.cy + 3.5 * LS(1), LS(1) * 1.7, 1];
  }
  function drawDoveAt(ctx, layer) {
    if (FXL.some(e => e.type === 'dove')) return;
    const p = dovePerchXY();
    if (p[3] !== layer) return;
    if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.white, p[0], p[1] - 2 * p[2], 9 * p[2], 0.3 + 0.4 * nightK()); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
    drawDove(ctx, p[0], p[1], p[2], -1, 0, true, [246, 244, 238], 1);
  }
  // 小狐狸：矮身、蓬松的尾、尖耳
  function drawFox(ctx, x, y, s, face, ph, a) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(face * s, s);
    ctx.globalAlpha = a;
    const col = css([176, 96, 50], 2), dark = css([96, 56, 36], 2);
    const bob = Math.abs(Math.sin(ph * TAU)) * 0.8;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.ellipse(0, -4.2 - bob, 4.6, 1.9, 0, 0, TAU);
    ctx.moveTo(4, -5 - bob); ctx.quadraticCurveTo(6.6, -6.6 - bob, 7.6, -5.2 - bob); ctx.lineTo(4.6, -3.6 - bob);
    ctx.moveTo(-4, -4.6 - bob); ctx.quadraticCurveTo(-7.5, -6.6 - bob, -9, -3.6 - bob); ctx.quadraticCurveTo(-6.5, -3 - bob, -4, -3.4 - bob);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(5.2, -6.2 - bob); ctx.lineTo(5.5, -8 - bob); ctx.lineTo(6.2, -6.4 - bob); ctx.fill();
    ctx.fillStyle = css([240, 230, 214], 2);
    ctx.beginPath(); ctx.arc(-8.7, -3.7 - bob, 0.8, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 0.9; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [hx, o] of [[3, 0], [-3, 0.5]]) {
      const sw = Math.sin((ph + o) * TAU) * 1.6;
      ctx.moveTo(hx, -3 - bob); ctx.lineTo(hx + sw, 0);
      ctx.moveTo(hx - 0.8, -3 - bob); ctx.lineTo(hx - 0.8 - sw, 0);
    }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const FOX_T = 10.2;
  function foxPath(i, t) {
    // 自右边钻进葡萄园，在葡萄树行间东窜西窜；弟兄们赶来，光也来了，它们便从园的右边逃出去
    const K = [
      [[0, 1.06, 0.1], [1.6, 0.74, 0.12], [3.2, 0.6, 0.2], [4.6, 0.68, 0.3], [6, 0.62, 0.16], [7.4, 0.7, 0.08], [9.4, 1.1, 0.1]],
      [[0.3, 1.08, 0.24], [2, 0.72, 0.3], [3.4, 0.62, 0.36], [4.9, 0.7, 0.22], [6.3, 0.65, 0.4], [7.7, 0.74, 0.3], [9.7, 1.12, 0.3]],
      [[0.6, 1.1, 0.36], [2.3, 0.7, 0.44], [3.8, 0.58, 0.3], [5.2, 0.64, 0.46], [6.6, 0.72, 0.38], [8, 0.76, 0.44], [10, 1.12, 0.46]],
    ][i];
    if (t <= K[0][0]) return null;
    for (let j = 1; j < K.length; j++) {
      if (t <= K[j][0]) {
        const u = ease((t - K[j - 1][0]) / (K[j][0] - K[j - 1][0]));
        return { f: lerp(K[j - 1][1], K[j][1], u), v: lerp(K[j - 1][2], K[j][2], u), face: K[j][1] >= K[j - 1][1] ? 1 : -1, sp: Math.sin(Math.PI * u) };
      }
    }
    return null;
  }

  // ════════════════════════════════════════════════════════════
  //  良人：一团行走的光（不画成人形，也不画成走兽；2:9「好像羚羊」只是比喻）
  //  光沿着「蹿山越岭」的弧线一跳一跳地来去，身后拖一道短短的光尘；站定时微微起伏，歇着时暗一些
  // ════════════════════════════════════════════════════════════
  const GZ_K = 0.62;
  const HOV = 16;              // 光心离地的高（× s）
  const Nr = (f, v) => ({ x: r3(LX(f)), l: 2, v: v || 0 });
  const Mi = x => ({ x, l: 1, v: 0 });
  const Fa = x => ({ x, l: 0, v: 0 });
  const Rg = x => ({ x, l: 3, v: 0 });
  const Win = () => ({ x: r3(LX(F.house)), l: 2, v: 0, win: 1 });     // 停在她家的窗棂外（2:9）
  function gzPt(p) {
    const xf = p.x, l = p.l;
    const s = GZ_K * LS(l) * (1 + 0.35 * (p.v || 0)) * (l === 3 ? 3.4 : l === 0 ? 1.5 : 1);
    if (p.win) { const G = houseGeom(); return { x: G.win[0] - 5 * G.s, y: G.win[1] + 1 * G.s + HOV * s, s }; }
    return { x: xf * W.w, y: baseY(l, xf, p.v || 0) + (l === 2 ? 1.5 * LS(2) : 0.5), s };
  }
  // 蹿山越岭：同一层上一跳一跳，层与层之间一大跃（越过海湾）
  function gzGo(b, pts, o) {
    o = o || {};
    const hops = [];
    let cur = { x: S.gz.x, l: S.gz.l, v: S.gz.v || 0, win: S.gz.win || 0 };
    let t = o.delay || 0, lastFace = S.gz.face;
    const STEP = [0.03, 0.032, 0.036, 0.024], DUR = [0.34, 0.38, 0.44, 0.3];
    for (const p of pts) {
      if (p.l === cur.l) {
        const n = Math.max(1, Math.ceil(Math.abs(p.x - cur.x) / (STEP[p.l] * (o.stride || 1)) - 0.01));
        for (let i = 0; i < n; i++) {
          const a = i === 0 ? cur : { x: lerp(cur.x, p.x, i / n), l: p.l, v: lerp(cur.v, p.v || 0, i / n) };
          const bb = { x: lerp(cur.x, p.x, (i + 1) / n), l: p.l, v: lerp(cur.v, p.v || 0, (i + 1) / n), win: i === n - 1 ? p.win || 0 : 0 };
          const dur = DUR[p.l] * (o.slow || 1);
          const fc = bb.x > a.x + 1e-4 ? 1 : bb.x < a.x - 1e-4 ? -1 : lastFace;
          lastFace = fc;
          hops.push({ a, b: bb, t0: t, t1: t + dur, face: fc });
          t += dur;
        }
      } else {
        const dur = (o.leap || 1.05) * (1 + 0.25 * Math.abs(p.l - cur.l));
        const fc = p.x > cur.x + 1e-4 ? 1 : p.x < cur.x - 1e-4 ? -1 : lastFace;
        lastFace = fc;
        hops.push({ a: cur, b: { x: p.x, l: p.l, v: p.v || 0, win: p.win || 0 }, t0: t, t1: t + dur, big: true, face: fc });
        t += dur;
      }
      cur = { x: p.x, l: p.l, v: p.v || 0, win: p.win || 0 };
    }
    S.gz = { x: r3(cur.x), l: cur.l, v: r3(cur.v), face: o.face || lastFace, pose: o.pose || 'stand' };
    if (cur.win) S.gz.win = 1;
    RUN = b.instant || !hops.length ? null : { t0: W.t, hops, dur: t, face: S.gz.face };
    if (!b.instant) {
      sfx(b, 'wings', { soft: true });
      // 到了：落脚处一圈柔光（装饰）
      FXL.push({ type: 'arrive', t0: W.t + t, dur: o.arriveDur || 1.6, big: !!o.arrive });
    }
    return t;
  }
  // 姿势：'stand'（站定，光微微起伏）、'rest'（歇着：光暗一些）、'look'（在窗外往里看，同站定）
  function gzPose(p, fc) { S.gz.pose = p; if (fc) S.gz.face = fc; }
  // 某一时刻光在哪里（t 缺省为当下；光尘的尾巴取稍早的时刻）
  function gzNow(at) {
    const vis = lv('sgGz');
    if (vis < 0.01) return null;
    const now = at == null ? W.t : at;
    if (RUN) {
      const t = now - RUN.t0;
      if (t < RUN.dur) {
        let h = RUN.hops[0];
        for (const q of RUN.hops) { h = q; if (t < q.t1) break; }
        if (t < h.t0) {
          const A = gzPt(h.a);
          return { x: A.x, y: A.y, s: A.s, face: h.face, mode: 0, ph: 0, lay: h.a.l, a: vis };
        }
        const u = clamp((t - h.t0) / (h.t1 - h.t0), 0, 1);
        const A = gzPt(h.a), B = gzPt(h.b);
        const e = h.big ? ease(u) : u;
        const x = lerp(A.x, B.x, e), s = lerp(A.s, B.s, e);
        const arc = h.big ? W.h * 0.06 + Math.abs(A.y - B.y) * 0.4 : 13 * Math.max(A.s, B.s);
        const y = lerp(A.y, B.y, h.big ? ease(u) : u) - Math.sin(Math.PI * u) * arc;
        const lay = h.big ? (u < 0.5 ? h.a.l : h.b.l) : h.b.l;
        return { x, y, s, face: h.face, mode: 1, ph: u, lay, a: vis, big: !!h.big, run: true };
      }
    }
    const P = gzPt(S.gz);
    const mode = S.gz.pose === 'rest' ? 3 : 0;
    return { x: P.x, y: P.y, s: P.s, face: S.gz.face, mode, ph: 0, lay: S.gz.l, a: vis };
  }
  // 寻常羚羊的身形（只用于山坡上不发光的小剪影）：面向 +x，原点在四蹄之间的地面；单位像素 / s（角高约 40）→ { legs, body, horn }（Path2D）
  function gazellePaths(g) {
    const { mode, ph } = g;
    const e = mode === 1 ? Math.sin(Math.PI * ph) : 0;
    const lie = mode === 3;
    const by = lie ? -7 : -18.5;
    const leg = (hx, hy, a1, a2, l1, l2, P) => {
      const kx = hx + Math.sin(a1) * l1, ky = hy + Math.cos(a1) * l1;
      const fx0 = kx + Math.sin(a2) * l2, fy = ky + Math.cos(a2) * l2;
      P.moveTo(hx, hy); P.lineTo(kx, ky); P.lineTo(fx0, fy);
    };
    const legs = new Path2D();
    if (lie) {
      legs.moveTo(6, -4); legs.lineTo(10, -1.5); legs.lineTo(4, -0.8);
      legs.moveTo(-6, -4); legs.lineTo(-2, -1); legs.lineTo(-8, -0.6);
    } else if (mode === 1) {
      leg(6, by + 3, lerp(0.25, 1.25, e), lerp(-0.5, 1.5, e), 7.5, 8.5, legs);
      leg(4.8, by + 3, lerp(0.1, 1.1, e), lerp(-0.7, 1.35, e), 7.5, 8.5, legs);
      leg(-6.5, by + 3, lerp(-0.3, -1.2, e), lerp(0.5, -1.45, e), 7.5, 8.5, legs);
      leg(-5.2, by + 3, lerp(-0.15, -1.05, e), lerp(0.7, -1.3, e), 7.5, 8.5, legs);
    } else {
      leg(6, by + 3, 0.05, 0, 7.5, 8.5, legs); leg(4.8, by + 3, -0.03, 0.02, 7.5, 8.5, legs);
      leg(-6.5, by + 3, -0.12, 0.14, 7.5, 8.5, legs); leg(-5.2, by + 3, -0.02, 0.08, 7.5, 8.5, legs);
    }
    const body = new Path2D();
    body.ellipse(0, by, 9.6, 4.4, 0, 0, TAU);
    body.moveTo(9, by + 1); body.ellipse(6.5, by + 0.6, 3.6, 3.8, 0, 0, TAU);          // 胸
    body.moveTo(-5, by); body.ellipse(-7, by - 0.3, 3.4, 4.2, 0, 0, TAU);              // 臀
    // 颈与头（吃草时低头）
    const graze = mode === 2;
    const hx = graze ? 13 : 12.4, hy = graze ? -6 : lie ? -19 : -30.5;
    const nb = [6.5, by - 2.2];
    body.moveTo(nb[0] - 2, nb[1]);
    body.quadraticCurveTo(nb[0] + 1.5, (nb[1] + hy) / 2 - 1, hx - 1.8, hy - 0.4);
    body.lineTo(hx - 0.2, hy + 1.8);
    body.quadraticCurveTo(nb[0] + 3.4, (nb[1] + hy) / 2 + 2, nb[0] + 2.4, nb[1] + 2.4);
    body.closePath();
    body.moveTo(hx + 3.4, hy); body.ellipse(hx + 0.6, hy + (graze ? 0.4 : 0.6), 3.4, 1.8, graze ? 1.1 : 0.42, 0, TAU);
    body.moveTo(-9.3, by - 1.2); body.lineTo(-11.2, by + 1.6); body.lineTo(-9.8, by + 0.6);   // 尾
    // 耳
    const ax = hx - 1.2, ay = hy - 1.6;
    const dx = graze ? 3 : 0, dy = graze ? 2.2 : 0;
    body.moveTo(ax - 0.4, ay + 0.6); body.quadraticCurveTo(ax - 3.4, ay - 0.6 + dy * 0.5, ax - 3.8 + dx * 0.6, ay - 0.1 + dy * 0.6); body.quadraticCurveTo(ax - 2.4, ay + 1.4, ax - 0.4, ay + 1.2);
    // 竖琴形的角
    const horn = new Path2D();
    horn.moveTo(ax, ay); horn.quadraticCurveTo(ax - 3.2 + dx, ay - 4 + dy, ax - 2 + dx * 1.6, ay - 8 + dy * 1.4); horn.quadraticCurveTo(ax - 1.4 + dx * 1.7, ay - 9.6 + dy * 1.5, ax - 0.4 + dx * 1.8, ay - 10 + dy * 1.6);
    horn.moveTo(ax + 0.8, ay + 0.2); horn.quadraticCurveTo(ax - 1.8 + dx, ay - 3.6 + dy, ax - 0.6 + dx * 1.6, ay - 7.6 + dy * 1.4); horn.quadraticCurveTo(ax + 0.2 + dx * 1.7, ay - 9.2 + dy * 1.5, ax + 1.2 + dx * 1.8, ay - 9.4 + dy * 1.6);
    return { legs, body, horn, pitch: mode === 1 ? lerp(-0.2, 0.2, ph) * (0.4 + 0.6 * e) : 0 };
  }
  function drawGz(ctx, layer) {
    const g = gzNow();
    if (!g || g.lay !== layer) return;
    sprites();
    if (!SP) return;
    const nk = nightK();
    const cx = g.x, cy = g.y - HOV * g.s;
    const rest = g.mode === 3;
    // 站定时光微微起伏；歇着时暗一些、慢一些
    const pulse = g.run ? 1 : rest ? 0.62 + 0.05 * Math.sin(W.t * 1.1) : 0.9 + 0.1 * Math.sin(W.t * 2.1);
    const A = g.a * pulse;
    ctx.globalCompositeOperation = 'lighter';
    // 身后的光尘：取稍早几个时刻的位置
    if (g.run) {
      for (let i = 1; i <= 7; i++) {
        const p = gzNow(W.t - i * 0.05);
        if (!p || p.lay !== layer) continue;
        glowAt(ctx, SP.gold, p.x, p.y - HOV * p.s, (7 - i * 0.6) * p.s, g.a * 0.5 * (1 - i / 8));
      }
    }
    // 在香草山上时，山顶另有一大片金光（8:14）
    const sp = layer === 3 && !g.run ? lv('sgSpice') : 0;
    if (sp > 0.02) {
      const br = 0.85 + 0.15 * Math.sin(W.t * 0.9);
      glowAt(ctx, SP.rose, cx, cy + 4 * g.s, M() * 0.24, g.a * sp * 0.24 * br, 0.7);
      glowAt(ctx, SP.gold, cx, cy, M() * 0.09, g.a * sp * 0.5 * br);
    }
    glowAt(ctx, SP.gold, cx, cy + 2 * g.s, 46 * g.s * (0.85 + 0.35 * nk), A * (0.3 + 0.4 * nk) * (layer === 3 ? 0.8 : 1), 1.1);
    glowAt(ctx, SP.warm, cx, cy + 3 * g.s, 22 * g.s, A * (0.22 + 0.2 * nk), 1.25);
    glowAt(ctx, SP.white, cx, cy, 15 * g.s, A * (0.55 + 0.25 * W.daylight), 1.2);
    glowAt(ctx, SP.gold, cx, cy, 7 * g.s, A * 0.9);
    ctx.globalCompositeOperation = 'source-over';
    // 光心：一点柔白（白天在亮处也看得见）
    ctx.globalAlpha = Math.min(1, A * 0.9);
    ctx.fillStyle = 'rgb(255,250,236)';
    ctx.beginPath(); ctx.ellipse(cx, cy, 3.4 * g.s, 4.2 * g.s, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  转瞬的事与粒子
  // ════════════════════════════════════════════════════════════
  function emit(p) { if (PT.length < 600) PT.push(Object.assign({ life: 0 }, p)); }
  function petals(dir, k) {
    k = k || 1;
    const t = TREES[1], xy = treeXY(t), H = treeH(t);
    for (let i = 0; i < 46 * k; i++) {
      emit({ x: xy[0] + (Math.random() - 0.5) * H * 0.7, y: xy[1] - H * (0.45 + Math.random() * 0.45), vx: dir * (40 + Math.random() * 90) * SU() * k, vy: -10 + Math.random() * 25,
        max: 3 + Math.random() * 3, c: Math.random() < 0.6 ? [252, 232, 236] : [240, 186, 204], s: (0.9 + Math.random() * 0.9) * LS(2) * 1.5, kind: 'petal', rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 6, pass: 'air' });
    }
  }
  // 春天：花瓣自右半边的天上飘过（2:12）——不经过左边的经文
  function skyPetals(n) {
    for (let i = 0; i < n; i++) {
      const x = W.w * (port() ? 0.3 + Math.random() * 0.75 : 0.52 + Math.random() * 0.52), y = W.h * (port() ? 0.36 + Math.random() * 0.3 : 0.12 + Math.random() * 0.4);
      emit({ x, y, vx: -(18 + Math.random() * 40) * SU(), vy: 4 + Math.random() * 14, max: 4 + Math.random() * 3,
        c: Math.random() < 0.5 ? [250, 206, 220] : Math.random() < 0.6 ? [238, 172, 196] : [255, 230, 236], s: (1.2 + Math.random() * 1.2) * LS(2) * 1.3, kind: 'petal', rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 5, pass: 'air' });
    }
  }
  function drawPT(ctx, pass) {
    for (const p of PT) {
      if (p.pass !== pass) continue;
      const u = p.life / p.max, a = p.kind === 'petal' ? Math.min(1, u * 8) * (1 - u * u * u) : Math.min(1, u * 5) * (1 - u);
      if (a <= 0.01) continue;
      if (p.kind === 'petal') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = a;
        ctx.fillStyle = rgba(W.shade(p.c, 0, 0.35), 1);
        ctx.beginPath(); ctx.ellipse(p.x, p.y, 1.4 * p.s, 0.8 * p.s, p.rot, 0, TAU); ctx.fill();
      } else if (p.kind === 'mist') {
        if (!SP) continue;
        ctx.globalCompositeOperation = 'source-over';
        glowAt(ctx, SP.puff, p.x, p.y, p.s * (1 + 2.2 * u), a * 0.75);
      } else if (p.kind === 'spray') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = Math.min(1, a * 1.6) * 0.9;
        ctx.fillStyle = 'rgb(240,246,250)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, TAU); ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = a * (p.alpha || 0.8);
        ctx.fillStyle = rgba(p.c, 1);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, TAU); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function stepPT(dt) {
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      p.life += dt;
      if (p.life >= p.max) { PT.splice(i, 1); continue; }
      if (p.kind === 'petal') { p.vx *= 1 - 0.3 * dt; p.vy += (12 - p.vy * 0.4) * dt; p.x += (p.vx + Math.sin(p.life * 3 + p.rot) * 12) * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
      else if (p.kind === 'spray') { p.vy += 160 * dt * SU(); p.x += p.vx * dt; p.y += p.vy * dt; }
      else if (p.kind === 'mist') { p.vy += 30 * dt * SU(); p.vx *= 1 - 0.8 * dt; p.x += (p.vx + W.wind * 8) * dt; p.y += p.vy * dt; }
      else { p.x += (p.vx + W.wind * 6) * dt; p.y += p.vy * dt; p.vx *= 1 - 0.2 * dt; }
    }
  }
  function drawFXL(ctx) {
    const t = W.t;
    for (const e of FXL) {
      if (t < e.t0) continue;
      const u = clamp((t - e.t0) / e.dur, 0, 1);
      if (e.type === 'dove') {
        // 鸽子自磐石穴飞出，落在苹果树上；身后一道白的光尘
        const A = e.from(), B = e.to();
        const cx = (A[0] + B[0]) / 2, cy = Math.min(A[1], B[1]) - W.h * 0.12;
        const at = uu => { const k = ease(uu); return [(1 - k) * (1 - k) * A[0] + 2 * (1 - k) * k * cx + k * k * B[0], (1 - k) * (1 - k) * A[1] + 2 * (1 - k) * k * cy + k * k * B[1], lerp(A[2], B[2], k)]; };
        const [x, y, s] = at(u);
        if (SP) {
          ctx.globalCompositeOperation = 'lighter';
          if (u < 0.97) for (let i = 1; i <= 8; i++) { const q = at(Math.max(0, u - i * 0.018)); glowAt(ctx, SP.white, q[0], q[1] - 2 * q[2], (3.2 - i * 0.25) * q[2], 0.45 * (1 - i / 9)); }
          glowAt(ctx, SP.white, x, y - 2 * s, 12 * s, 0.4 + 0.4 * nightK());
          ctx.globalCompositeOperation = 'source-over';
        }
        drawDove(ctx, x, y, s, B[0] >= A[0] ? 1 : -1, (t * 2.6) % 1, u > 0.97, [248, 246, 240], 1);
      } else if (e.type === 'turtles') {
        // 一对斑鸠自天空中间飞过，落在她家的屋顶上（飞时大，落下时与屋相称）
        const G = houseGeom();
        for (let i = 0; i < 2; i++) {
          const ui = clamp(u * 1.08 - i * 0.06, 0, 1), k = ease(ui);
          const ax = W.w * (port() ? 0.2 : 0.5), ay = W.h * (0.34 + i * 0.035);
          const mx = W.w * (port() ? 0.55 : 0.72), my = W.h * (0.22 + i * 0.03);
          const bx = G.x + (4 + i * 5.5) * G.s, by = G.y - G.h - 2 * G.s;
          const x = (1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mx + k * k * bx + Math.sin(ui * 9 + i) * W.w * 0.015 * (1 - k);
          const y = (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * my + k * k * by;
          const sc = G.s * lerp(2.5, 1.25, smoothstep(0.55, 1, ui));
          drawDove(ctx, x, y, sc, bx < ax ? -1 : 1, (t * 3.1 + i * 0.4) % 1, ui > 0.98, [150 + i * 10, 132 + i * 8, 118 + i * 6], 1);
        }
      } else if (e.type === 'foxes') {
        for (let i = 0; i < 3; i++) {
          const q = foxPath(i, t - e.t0);
          if (!q) continue;
          const xf = LX(q.f), s = LS(2) * (1 + 0.35 * q.v) * 1.45;
          const a = q.f > 1 ? 0 : q.f > 0.96 ? (1 - q.f) / 0.04 : 1;
          const x = xf * W.w, y = baseY(2, xf, q.v) + 1;
          // 脚下扬起的尘土
          if (SP && q.sp > 0.2 && a > 0.05) {
            for (let j = 0; j < 3; j++) {
              const ph = (t * 2.2 + j / 3 + i * 0.37) % 1;
              glowAt(ctx, SP.puff, x - q.face * (5 + ph * 12) * s, y - (1 + ph * 3) * s, (2 + ph * 4) * s, a * q.sp * 0.4 * (1 - ph) * dayA());
            }
            ctx.globalAlpha = 1;
          }
          drawFox(ctx, x, y, s, q.face, (t * 3.2 + i * 0.3) % 1, a);
        }
      } else if (e.type === 'spring') {
        // 日出的暖光自东（左）向西扫过全地，一片金色漫过近地
        if (!SP) continue;
        const bx = lerp(-0.2, 1.25, ease(u)) * W.w;
        const a = Math.sin(Math.PI * u);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, bx, W.h * 0.84, W.w * 0.42, a * 0.5, 0.42);
        glowAt(ctx, SP.warm, bx, W.h * 0.8, W.w * 0.22, a * 0.3, 0.5);
        glowAt(ctx, SP.gold, lerp(0.55, 1, u) * W.w, W.h * 0.62, W.w * 0.3, a * 0.18, 0.4);
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'crown') {
        // 冠冕戴上的一刻：轿顶上一圈金光
        if (!SP || lv('sgLitter') < 0.1) continue;
        const L = litterTop(), s = L[2];
        const a = Math.sin(Math.PI * u);
        ctx.globalCompositeOperation = 'lighter';
        glowAt(ctx, SP.gold, L[0], L[1] - 3 * s, 16 * s, a * 0.8);
        glowAt(ctx, SP.white, L[0], L[1] - 3 * s, 5 * s, a * 0.6);
        ctx.globalAlpha = a * 0.7; ctx.strokeStyle = 'rgb(255,236,190)'; ctx.lineWidth = Math.max(0.6, 0.4 * s);
        ctx.beginPath(); ctx.ellipse(L[0], L[1] - 3 * s, (4 + 6 * u) * s, (1.6 + 2.4 * u) * s, 0, 0, TAU); ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'voice') {
        // 她的声音：一圈一圈淡金的波纹自园中升起（8:13）
        if (!SP) continue;
        const h = headOf('bride', 0.9);
        ctx.globalCompositeOperation = 'lighter';
        const f = fig('bride'), dir = f ? f.facing : 1;
        for (let i = 0; i < 4; i++) {
          const q = (u * 2.2 + i / 4) % 1;
          ctx.globalAlpha = (1 - q) * q * 1.3 * Math.sin(Math.PI * u);
          ctx.strokeStyle = 'rgb(255,226,170)'; ctx.lineWidth = Math.max(0.6, 0.9 * SU());
          const r = (5 + q * 46) * SU(), cx = h[0] + dir * 3 * SU();
          ctx.beginPath(); ctx.arc(cx, h[1], r, dir > 0 ? -0.55 : Math.PI - 0.55, dir > 0 ? 0.55 : Math.PI + 0.55); ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
      } else if (e.type === 'dew') {
        // 头满了露水（5:2）：光的四围一粒一粒的露珠闪着
        const g = gzNow();
        if (g && SP) {
          ctx.globalCompositeOperation = 'lighter';
          const cx = g.x, cy = g.y - HOV * g.s;
          for (let i = 0; i < 9; i++) { const a = Math.sin(t * 5 + i * 2.1) * 0.5 + 0.5, ang = i * 0.7 + 0.3; glowAt(ctx, SP.dew, cx + Math.cos(ang) * 11 * g.s, cy + Math.sin(ang) * 9 * g.s, 3 * g.s, a * Math.sin(Math.PI * u)); }
          ctx.globalCompositeOperation = 'source-over';
        }
      } else if (e.type === 'arrive') {
        // 光落定之处一圈柔光
        const g = gzNow();
        if (g && SP && !g.run) {
          const a = Math.sin(Math.PI * u) * (e.big ? 0.8 : 0.4);
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, SP.gold, g.x, g.y - HOV * g.s, (30 + 30 * u) * g.s * (e.big ? 1.6 : 1), a * 0.5);
          if (!S.gz.win) {
            ctx.globalAlpha = a * 0.6; ctx.strokeStyle = 'rgb(255,232,180)'; ctx.lineWidth = Math.max(0.6, 0.8 * g.s);
            ctx.beginPath(); ctx.ellipse(g.x, g.y - 1, (6 + 26 * u) * g.s, (2 + 8 * u) * g.s, 0, 0, TAU); ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── 大水（8:7）：海上一道一道涌向岸的浪，冠上白沫 ──
  function drawWaves(ctx) {
    const k = lv('sgWaves');
    if (k < 0.01) return;
    const y0 = W.waterlineY(1) + 4, y1 = W.h + 6;
    const deep = W.shade([20, 46, 62], 0.1), crestC = W.shade([52, 92, 110], 0.1, 0.05);
    const fa = 0.55 * k * (0.5 + 0.5 * W.daylight) + 0.2 * k;
    // 横屏时经文在左下（x < 0.48、y > 0.55）：那里的白沫淡些；浪峰最高处靠近岸边的磐石（x ≈ 0.35–0.5）
    const boxX = port() ? -1 : W.w * 0.48, boxY = W.h * 0.55;
    const env = x => 0.5 + 0.5 * smoothstep(W.w * 0.08, W.w * 0.36, x) * (1 - 0.35 * smoothstep(W.w * 0.52, W.w * 0.7, x));
    const N = 5, xR = W.w + 10;     // 竖屏时中洲与近地之间也看得见海，浪一直画到右边
    for (let i = 0; i < N; i++) {
      const q = i / (N - 1), yb = lerp(y0 + 6, y1 - 10, q);
      const A = k * (0.016 + 0.042 * q) * W.h, wl = (0.2 + 0.14 * q) * W.w;
      const sp = (0.06 + 0.03 * q) * W.w;
      const off = W.t * sp + i * 97;
      const Y = x => { const ph = ((x - off) / wl) % 1, f = ph < 0 ? ph + 1 : ph; const c = Math.pow(Math.max(0, Math.sin(f * Math.PI)), 3); return yb - A * env(x) * (c * 1.6 - 0.3); };
      ctx.beginPath();
      ctx.moveTo(-10, y1);
      for (let x = -10; x <= xR; x += 6) ctx.lineTo(x, Y(x));
      ctx.lineTo(xR, y1); ctx.closePath();
      const g = ctx.createLinearGradient(0, yb - A * 1.6, 0, yb + A * 2);
      g.addColorStop(0, rgba(crestC, 0.9 * k)); g.addColorStop(1, rgba(deep, 0.85 * k));
      ctx.fillStyle = g; ctx.fill();
      const inBox = new Path2D(), outBox = new Path2D();
      let on = false, cur = null;
      for (let x = -10; x <= xR; x += 5) {
        const ph = ((x - off) / wl) % 1, f = ph < 0 ? ph + 1 : ph;
        const y = Y(x), box = x < boxX && y > boxY;
        if (f > 0.35 && f < 0.62) {
          const P = box ? inBox : outBox;
          if (!on || P !== cur) { P.moveTo(x, y); on = true; cur = P; } else P.lineTo(x, y);
        } else on = false;
      }
      ctx.lineWidth = Math.max(0.8, (1.2 + 2.4 * q) * SU());
      ctx.strokeStyle = 'rgba(236,244,250,' + fa.toFixed(3) + ')'; ctx.stroke(outBox);
      ctx.strokeStyle = 'rgba(236,244,250,' + (fa * 0.35).toFixed(3) + ')'; ctx.stroke(inBox);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  布景（本卷在场时才画）
  // ════════════════════════════════════════════════════════════
  const SCENE = {
    init() {},
    resize() {
      MODELS = null;
      for (const k in CACHE) delete CACHE[k];
      // 手机转了方向：近地的逻辑位置映到画面的方式变了——近地上的人、羊与良人的光一并挪到新的位置
      const p = port();
      if (lastPort !== null && p !== lastPort && isCur()) U.safe('song.remap', () => remapNear(lastPort, p));
      lastPort = p;
    },
    update(dt) {
      const t = W.t;
      if (RUN && t - RUN.t0 >= RUN.dur) RUN = null;
      if (LIT && t - LIT.t0 >= LIT.dur) LIT = null;
      for (let i = FXL.length - 1; i >= 0; i--) if (t - FXL[i].t0 > FXL[i].dur) FXL.splice(i, 1);
      stepPT(dt);
      if (!isCur()) { for (const k in CACHE) delete CACHE[k]; return; }     // 离场后放掉离屏画布
      if (W.replaying) return;
      // 光跳过时留下一点光尘
      if (RUN) {
        trailT -= dt;
        if (trailT <= 0) {
          trailT = 0.06;
          const g = gzNow();
          if (g && fx()) fx().sparkle(g.x - g.face * 3 * g.s, g.y - HOV * g.s, 1, [255, 234, 186], 5 * g.s, ['far', 'mid', 'near', 'sky'][g.lay]);
        }
      }
      // 春天：花瓣自天上飘过
      if (FXL.some(e => e.type === 'blossom' && t >= e.t0)) {
        blosAcc += 17 * dt;
        let n = 0; while (blosAcc >= 1) { blosAcc -= 1; n++; }
        if (n) skyPetals(n);
      } else blosAcc = 0;
      // 烈焰上升的火星
      const fl = lv('sgFlame');
      if (fl > 0.3) {
        emberAcc += fl * 14 * dt;
        const R = rockGeom();
        for (let i = 0; emberAcc >= 1 && i < 6; i++) {
          emberAcc -= 1;
          emit({ x: R.x - 1 * R.s + (Math.random() - 0.5) * 8 * R.s, y: R.top - 6 * R.s - Math.random() * 10 * R.s, vx: (W.wind * 10 - lv('gale') * 40 + (Math.random() - 0.5) * 16) * SU(), vy: -(34 + Math.random() * 46) * SU(),
            max: 1 + Math.random() * 1.2, c: Math.random() < 0.5 ? [255, 190, 90] : [255, 150, 60], s: (0.5 + Math.random() * 0.7) * SU(), kind: 'mote', alpha: 0.9, pass: 'air' });
        }
      } else emberAcc = 0;
      // 园中的香气（4:16）
      const fr = lv('sgFrag');
      if (fr > 0.05) {
        fragAcc += fr * 26 * dt;
        for (let i = 0; fragAcc >= 1 && i < 8; i++) {
          fragAcc -= 1;
          const xf = LX(lerp(0.22, 0.52, Math.random()));
          emit({ x: xf * W.w, y: baseY(2, xf, Math.random() * 0.3) - Math.random() * 40 * LS(2), vx: (W.wind * 30 + (Math.random() - 0.5) * 20 + gustDir() * 60 * lv('gale')) * SU(), vy: -(10 + Math.random() * 20) * SU(),
            max: 3 + Math.random() * 3, c: Math.random() < 0.5 ? [255, 226, 160] : [255, 200, 190], s: (0.8 + Math.random()) * SU(), kind: 'mote', alpha: 0.7, pass: 'air' });
        }
      } else fragAcc = 0;
      // 香草山上的金尘（8:14）
      const sp = lv('sgSpice');
      if (sp > 0.05) {
        spiceAcc += sp * 22 * dt;
        for (let i = 0; spiceAcc >= 1 && i < 8; i++) {
          spiceAcc -= 1;
          const xf = lerp(0.56, 1.02, Math.random());
          emit({ x: xf * W.w, y: rangeY(xf) + Math.random() * 10, vx: (Math.random() - 0.5) * 8, vy: -(6 + Math.random() * 14) * SU(), max: 4 + Math.random() * 3,
            c: Math.random() < 0.5 ? [255, 222, 160] : [255, 190, 170], s: (0.7 + Math.random() * 0.8) * SU(), kind: 'mote', alpha: 0.75, pass: 'sky' });
        }
      } else spiceAcc = 0;
      // 大水扑上岸、拍在磐石上：浪头到时一大团白的浪花自石脚迸起
      const S2 = surge();
      if (S2 && S2.k > 0.4) {
        if (S2.ph >= 0.4 && sprayN !== S2.n) {
          sprayN = S2.n;
          const R = rockGeom();
          for (let i = 0; i < 55 * S2.k; i++) {
            emit({ x: R.x - 14 * R.s + Math.random() * 18 * R.s, y: R.y - 2 * R.s - Math.random() * 5 * R.s, vx: (-30 + Math.random() * 90) * SU(), vy: -(110 + Math.random() * 210) * SU() * S2.k,
              max: 0.9 + Math.random() * 0.9, s: (1.1 + Math.random() * 1.9) * SU(), kind: 'spray', pass: 'air' });
          }
          for (let i = 0; i < 9; i++) {
            emit({ x: R.x - 12 * R.s + Math.random() * 14 * R.s, y: R.y - 4 * R.s - Math.random() * 8 * R.s, vx: (-10 + Math.random() * 40) * SU(), vy: -(40 + Math.random() * 80) * SU(),
              max: 1.2 + Math.random() * 0.8, s: (5 + Math.random() * 5) * SU(), kind: 'mist', pass: 'air' });
          }
          sfx({}, 'splash', { soft: true, x: 0.35 });
        }
      }
    },
    drawUnder(ctx, pass) {
      if (!isCur()) return;
      sprites();
      if (pass === 'sky') { drawRays(ctx); drawRange(ctx); drawGz(ctx, 3); drawPT(ctx, 'sky'); return; }
      if (pass === 'seaNear') { drawWaves(ctx); return; }
      if (pass === 'mid') {
        drawSmoke(ctx); drawCleftRock(ctx);
        const s = LS(1), top = Math.min(gY(1, 0.6), gY(1, 0.75), gY(1, 0.9)) - 60 * s;
        if (calm()) drawCached(ctx, 'mid', 'mt' + q40(lv('sgLeaf')) + ',' + q40(lv('sgBlos')), [Math.floor(W.w * 0.53), Math.floor(top), Math.ceil(W.w * 0.98), Math.ceil(W.waterlineY(1) + 4)], g => drawMidTrees(g));
        else drawMidTrees(ctx);
        return;
      }
      if (pass === 'near') {
        drawBoulder(ctx);
        const tk = lv('sgTents');
        if (tk > 0.01) { drawTent(ctx, F.tent1, 40, tk); drawTent(ctx, F.tent2, 34, tk); }
        cachedNear(ctx);
        return;
      }
      if (pass === 'air') { drawAir(ctx); return; }
    },
    draw(ctx, pass) {
      if (!isCur()) return;
      if (pass === 'far') drawGz(ctx, 0);
      else if (pass === 'mid') { drawLitter(ctx); drawDoveAt(ctx, 1); drawGz(ctx, 1); }
      else if (pass === 'near') { drawSurge(ctx); drawFlame(ctx); drawDoveAt(ctx, 2); drawGz(ctx, 2); }
    },
    reset() { RUN = null; LIT = null; FXL.length = 0; PT.length = 0; for (const k in CACHE) delete CACHE[k]; },
    restore() { RUN = null; LIT = null; FXL.length = 0; PT.length = 0; },
    // 看完与恢复是否一致（走查工具比较它）
    sig() { return { S: JSON.stringify(S) }; },
    pick(x, y, r) {
      if (!isCur()) return null;
      let best = null;
      const consider = (label, px, py) => { const d = Math.hypot(px - x, py - y); if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
      const g = gzNow();
      if (g && g.a > 0.5) consider('良人', g.x, g.y - HOV * g.s);
      for (const t of TREES) { const xy = treeXY(t), H = treeH(t); consider(t.label, xy[0], xy[1] - H * 0.55); }
      { const xf = LX((F.vine0 + F.vine1) / 2); consider('葡萄园', xf * W.w, baseY(2, xf, 0.15) - 14 * LS(2)); }
      if (lv('sgLily') > 0.3 || lv('sgLily1') > 0.5) { const xf = LX(0.37); consider('百合花', xf * W.w, baseY(2, xf, 0.14) - 10 * LS(2)); }
      if (lv('sgTents') > 0.5) { const xf = LX(F.tent1); consider('基达的帐棚', xf * W.w, gY(2, xf) - 12 * LS(2)); }
      if (lv('sgWall') > 0.5) { const xf = LX(F.wall0 + 0.04); consider('关锁的园', xf * W.w, gY(2, xf) - 10 * LS(2)); }
      { const xf = LX(F.well); consider('园中的泉', xf * W.w, baseY(2, xf, 0.2) - 8 * LS(2)); }
      { const G = houseGeom(); consider('窗棂', G.win[0], G.win[1]); }
      { const xf = LX(F.cgate); consider('耶路撒冷', xf * W.w, gY(2, xf) - 30 * LS(2)); }
      { const c = cleftGeom(); consider('磐石穴', c.cx, c.cy); }
      { const p = dovePerchXY(); consider('鸽子', p[0], p[1] - 3 * p[2]); }
      if (S.turtle === 'roof') { const G = houseGeom(); consider('斑鸠', G.x + 6 * G.s, G.y - G.h - 4 * G.s); }
      if (lv('sgLitter') > 0.5) { const L = litterTop(); consider('所罗门的轿', L[0], L[1] + 8 * L[2]); }
      if (lv('sgFlame') > 0.3) { const R = rockGeom(); consider('烈焰', R.x, R.top - 14 * R.s); }
      if (lv('sgStream') > 0.5) { const pts = streamPts(); consider('溪水', pts[4][0], pts[4][1]); }
      consider(lv('sgSpice') > 0.3 ? '香草山' : '黎巴嫩', PK.hermon * W.w, rangeY(PK.hermon) + 6);
      return best;
    },
  };
  // 竖屏 / 横屏之间，近地的逻辑位置 f 映到画面比例的方式不同（见 LX）
  let lastPort = null;
  function mapX(x, from, to) {
    const A = from ? [0.4, 0.6] : [0.5, 0.5], B = to ? [0.4, 0.6] : [0.5, 0.5];
    return B[0] + ((x - A[0]) / A[1]) * B[1];
  }
  function remapNear(from, to) {
    const c = C();
    const fix = q => { if (!q || q.layer !== 2) return; q.nx = mapX(q.nx, from, to); if (q.tx != null) q.tx = mapX(q.tx, from, to); };
    if (c.people) for (const q of c.people.values()) fix(q);
    if (c.crowds) for (const g of c.crowds.values()) for (const m of g.members) fix(m);
    if (S.gz.l === 2) S.gz.x = r3(mapX(S.gz.x, from, to));
    RUN = null;
    avoid([LX(0.16), LX(0.54)], [LX(0.76), 1]);
  }
  // 风向：北风（向左）、南风（向右）
  let GUST = -1;
  const gustDir = () => GUST;
  function drawWind(ctx, gale) {
    const dir = GUST, s = LS(2);
    const x0 = LX(0.08) * W.w, x1 = LX(0.72) * W.w, span = x1 - x0;
    const col = dir < 0 ? [226, 238, 255] : [255, 222, 164];
    ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(col, 1);
    for (let i = 0; i < 13; i++) {
      const sp = 0.22 + 0.08 * hsh(i * 3.7);
      const ph = (W.t * sp + hsh(i * 1.3)) % 1;
      const u = dir > 0 ? ph : 1 - ph;
      const len = (40 + 34 * hsh(i * 5.1)) * s;
      const xm = x0 - span * 0.1 + span * 1.2 * u;
      const g = gY(2, clamp(xm / W.w, 0, 1));
      const ym = g - (12 + 70 * hsh(i * 7.9)) * s;
      const a = gale * 0.75 * Math.sin(Math.PI * ph) * (0.6 + 0.4 * hsh(i * 2.2));
      if (a < 0.02) continue;
      const bend = (6 + 6 * hsh(i * 4.4)) * s * Math.sin(W.t * 1.4 + i);
      ctx.globalAlpha = a;
      ctx.lineWidth = Math.max(0.6, (0.7 + 0.8 * hsh(i * 6.6)) * s);
      ctx.beginPath();
      ctx.moveTo(xm - dir * len * 0.5, ym + bend * 0.3);
      ctx.bezierCurveTo(xm - dir * len * 0.15, ym - bend, xm + dir * len * 0.15, ym + bend, xm + dir * len * 0.5, ym - bend * 0.2);
      // 末端一个小小的卷
      ctx.quadraticCurveTo(xm + dir * len * 0.62, ym - bend * 0.2 - 4 * s, xm + dir * len * 0.54, ym - bend * 0.2 - 6 * s);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawAir(ctx) {
    // 你全然美丽，毫无瑕疵（4:7）：她周身柔白的光
    const gl = lv('sgGlow');
    if (gl > 0.01 && SP && has('bride')) {
      const h = headOf('bride', 0.5), s = LS(2);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.white, h[0], h[1], 40 * s, gl * 0.45);
      glowAt(ctx, SP.gold, h[0], h[1] - 4 * s, 18 * s, gl * 0.35);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    // 心上的印记（8:6）
    const se = lv('sgSeal');
    if (se > 0.01 && has('bride')) {
      const h = headOf('bride', 0.64), s = LS(2), f = fig('bride'), dx = (f ? f.facing : 1) * 1.6 * s;
      const x = h[0] + dx, y = h[1];
      if (SP) { ctx.globalCompositeOperation = 'lighter'; glowAt(ctx, SP.gold, x, y, 10 * s, se * (0.5 + 0.2 * Math.sin(W.t * 2))); ctx.globalCompositeOperation = 'source-over'; }
      ctx.globalAlpha = se;
      ctx.strokeStyle = 'rgb(255,222,150)'; ctx.lineWidth = Math.max(0.6, 0.7 * s);
      ctx.beginPath(); ctx.arc(x, y, 2.4 * s, 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgb(255,236,190)';
      ctx.beginPath(); ctx.arc(x, y, 0.9 * s, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // 夜里：窗与门的光晕；门开时门里的光照在门前的她身上
    const nk = nightK();
    if (SP && (lv('sgWin') > 0.02 || (lv('sgLamp') > 0.02 && nk > 0.1) || lv('sgDoor') > 0.02)) {
      const G = houseGeom(), door = lv('sgDoor');
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, SP.lamp, G.win[0], G.win[1], 20 * G.s, Math.max(lv('sgWin') * 0.7, lv('sgLamp') * nk * 0.6));
      glowAt(ctx, SP.warm, G.dx, G.y - 6 * G.s, 30 * G.s, door * (0.25 + 0.5 * nk));
      if (door > 0.2 && has('bride')) {
        const f = fig('bride');
        if (f && f._vis && Math.abs(f._x - G.dx) < 70 * G.s) {
          const near = 1 - Math.abs(f._x - G.dx) / (70 * G.s);
          glowAt(ctx, SP.warm, f._x, f._y - 16 * G.s, 26 * G.s, door * near * (0.2 + 0.45 * nk), 1.3);
          glowAt(ctx, SP.lamp, (f._x + G.dx) / 2, G.y, 30 * G.s, door * near * nk * 0.35, 0.3);
        }
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    // 夜里拿火把的人：脚下一片暖的光
    if (SP && nk > 0.15) {
      const c = C();
      ctx.globalCompositeOperation = 'lighter';
      const pool = p => {
        if (!p || p.prop !== 'torch' || !p._vis || p.isAnimal) return;
        const s = W.layerScale(p.layer == null ? 2 : p.layer) * 1.3, a = nk * Math.min(1, p.alpha == null ? 1 : p.alpha);
        glowAt(ctx, SP.lamp, p._x, p._y - 1 * s, 24 * s, a * 0.5, 0.38);
        glowAt(ctx, SP.warm, p._x, p._y - 16 * s, 16 * s, a * 0.22, 1.3);
      };
      if (c.people) for (const p of c.people.values()) pool(p);
      if (c.crowds) for (const g of c.crowds.values()) for (const m of g.members) pool(m);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
    // 北风、南风（4:16）：园子上空一缕一缕弯弯的风——北风清冷往左，南风温暖往右
    const gl2 = lv('gale');
    if (gl2 > 0.12 && lv('sgFrag') > 0.3) drawWind(ctx, gl2);
    // 转瞬的光与粒子
    drawFXL(ctx);
    drawPT(ctx, 'air');
  }

  // ════════════════════════════════════════════════════════════
  //  幕后布置：冬天，葡萄园与帐棚
  // ════════════════════════════════════════════════════════════
  function setup() {
    // 冬天：满天灰云、冷雨；地色枯黄，没有一朵花；树是光秃的（本卷自己画树，大地的树不长）；雪线低低地压到山腰
    W.set('bare', 0.55, true); W.set('bloom', 0, true); W.set('storm', 0.48, true); W.set('rain', 0.3, true); W.set('gale', 0.02, true);
    const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.9, land: 1, grass: 0.3, herbs: 0, trees: 0, lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1,
      sgSnow: 1, sgLeaf: 0, sgBlos: 0, sgFig: 0, sgApple: 0, sgPom: 0, sgPomFr: 0, sgVine: 0, sgGrape: 0, sgLily: 0, sgLily1: 0, sgThorn: 1, sgTrack: 0,
      sgTents: 1, sgWin: 0, sgLamp: 0, sgDoor: 0, sgSmoke: 0, sgLitter: 0, sgGlow: 0, sgWall: 0, sgGate: 0, sgSpring: 0, sgStream: 0, sgFalls: 0, sgFrag: 0,
      sgLeb: 0, sgRays: 0, sgSeal: 0, sgFlame: 0, sgWaves: 0, sgSpice: 0, sgGz: 0, sgMeadow: 0 };
    for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
    W.freeClock = false;
    const gx = W.w * LX(0.35);
    W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
    W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
    W.setOrigin('trees', W.w * 0.99, W.ridgeBaseY(2, W.w * 0.99));
    W.goTo(0.3, 0, true);
    const lx = W.w * 0.7, ly = W.ridgeBaseY(2, lx);
    W.setPop('fish', 70, W.w * 0.16, W.h * 0.8, true);
    W.setPop('whale', 1, W.w * 0.12, W.h * 0.78, true);
    W.setPop('bird', 14, W.w * 0.6, W.h * 0.3, true);
    W.setPop('cattle', 0, lx, ly, true);
    W.setPop('beast', 0, lx, ly, true);
    W.setPop('creeper', 0, lx, ly, true);       // 冬天没有蝴蝶
    W.setPop('human', 0, lx, ly, true);
    // 本卷的局部状态
    S = fresh();
    RUN = null; LIT = null; FXL.length = 0; PT.length = 0; GUST = -1;
    lastPort = port();
    MODELS = null;
    const c = C();
    c.clear({ fade: false });
    add('bride', { label: '书拉密女', sex: 'f', x: LX(0.66), facing: -1, pose: 'kneel', robe: ROBE.bride, accent: [226, 178, 156], hair: 'veil', glow: 0.35, prop: null });
    beast('kid1', { kind: 'kid', x: LX(0.61), label: '山羊羔', facing: -1, pose: 'graze', v: 0.06 });
    beast('kid2', { kind: 'kid', x: LX(0.7), label: '山羊羔', facing: -1, pose: 'graze', v: 0.03 });
    // 羊群在帐棚前、低处的近景里（不遮帐棚与牧人）；两个牧人在帐棚右边
    herd('flock', { kind: 'sheep', n: 7, x0: LX(0.01), x1: LX(0.1), label: '羊群', pose: 'graze' }).forEach((m, i) => { m.v = 0.3 + ((i * 0.618) % 1) * 0.25; });
    crowd('shepherds', { n: 2, x0: LX(0.13), x1: LX(0.16), label: '牧人' }, (m, i) => { man(ROBE.shepherd, 'staff')(m, i); m.v = 0; });
    herd('goats', { kind: 'goat', n: 6, x0: MX.goat0, x1: MX.goat1, layer: 1, label: '山羊群', pose: 'lie' });
    avoid([LX(0.16), LX(0.54)], [LX(0.76), 1]);
  }

  // ════════════════════════════════════════════════════════════
  //  话语
  //  每一句话的故事（经文与情节）约三十秒以内：下一句话要等这句的故事讲完才能说出。
  //  （经文一行显出 hold 秒，行与行之间约 1.3 秒。）
  // ════════════════════════════════════════════════════════════
  const STAGES = [
    // ── 1:8 只管跟随羊群的脚踪去：蹄印亮起，她领着山羊羔去到帐棚旁；晌午羊群歇卧 ─────
    {
      kind: 'cmd', utter: '只管跟随羊群的脚踪去', cmd: 'follow --tracks 羊群 && pasture 山羊羔 --near 帐棚', ref: '1:8',
      verse: [
        { text: '我心所爱的啊，求你告诉我，你在何处牧羊？晌午在何处使羊歇卧？<br>我何必在你同伴的羊群旁边好像蒙着脸的人呢？', ref: '雅歌 1:7', hold: 7.5 },
        { text: '你这女子中极美丽的，你若不知道，只管跟随羊群的脚踪去，<br>把你的山羊羔牧放在牧人帐棚的旁边。', ref: '雅歌 1:8', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            // 冬天还在：云低、冷雨不停（到 2:11 才一下子变了）
            pose('bride', 'stand'); face('bride', -1);
            W.goTo(0.47, 13, b.instant);
            sfx(b, 'bleat', { soft: true, x: 0.55 });
          }],
          [1.4, b => { W.set('sgTrack', 1, b.instant); sfx(b, 'chime', { soft: true }); }],
          [3.4, () => {
            follow('kid1', 'bride', 0.028); follow('kid2', 'bride', 0.05);
            walk('bride', LX(0.235), { speed: 0.019, pose: 'stand' });
          }],
          [7.5, b => { cpose('flock', 'lie'); cpose('shepherds', 'sit'); sfx(b, 'bleat', { soft: true, x: 0.55 }); }],
          [15, b => {
            follow('kid1', null); follow('kid2', null);
            walk('kid1', LX(0.195), { speed: 0.02, pose: 'graze' }); walk('kid2', LX(0.285), { speed: 0.02, pose: 'graze' });
            pose('bride', 'sit'); face('bride', -1);
            sparkleOn(b, 'bride', 10, [255, 230, 170], 0.3);
          }],
        ]);
      },
    },

    // ── 2:2 好像百合花在荆棘内：荆棘中开出第一朵百合；黄昏，她回家点灯 ─────────
    {
      kind: 'bless', utter: '我的佳偶在女子中，好像百合花在荆棘内', cmd: 'bloom 百合花 --among 荆棘', ref: '2:2',
      verse: [
        { text: '我是沙仑的玫瑰花，是谷中的百合花。', ref: '雅歌 2:1', hold: 5 },
        { text: '我的佳偶在女子中，好像百合花在荆棘内。', ref: '雅歌 2:2', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('sgTrack', 0, b.instant);
            pose('bride', 'stand');
            walk('bride', LX(0.355), { speed: 0.022, pose: 'stand' });
          }],
          [4.2, b => {
            W.set('sgLily1', 1, b.instant);
            pose('bride', 'kneel'); face('bride', 1);
            if (!b.instant && fx()) { const xf = LX(0.37); fx().ring(xf * W.w, baseY(2, xf, 0.14) - 8 * LS(2), [255, 250, 236], M() * 0.14, 2.2, 1.4); fx().sparkle(xf * W.w, baseY(2, xf, 0.14) - 10 * LS(2), 18, [255, 252, 240], 8 * SU(), 'air'); }
            sfx(b, 'harp');
          }],
          [7.2, b => { W.set('sgLily', 0.22, b.instant); sfx(b, 'chime', { soft: true }); }],
          [9.5, b => { W.goTo(0.745, 10, b.instant); W.set('rain', 0.34, b.instant); W.set('storm', 0.52, b.instant); }],
          [11.2, () => { pose('bride', 'stand'); walk('bride', LX(0.785), { speed: 0.03, pose: 'stand' }); }],
          [19.2, b => { W.set('sgLamp', 1, b.instant); rm('bride'); }],
        ]);
      },
    },

    // ── 2:10 起来，与我同去：夜里一团光蹿山越岭而来，停在窗棂外，窗子从外面亮起 ─────
    {
      kind: 'call', utter: '我的佳偶，我的美人，起来，与我同去！', cmd: 'leap --over 山岭 && peek 窗棂  # 起来，与我同去', ref: '2:10',
      verse: [
        { text: '听啊！是我良人的声音；看哪！他蹿山越岭而来。', ref: '雅歌 2:8', hold: 5.5 },
        { text: '我的良人好像羚羊，或像小鹿。<br>他站在我们墙壁后，从窗户往里观看，从窗棂往里窥探。', ref: '雅歌 2:9', hold: 7 },
        { text: '我良人对我说：我的佳偶，我的美人，起来，与我同去！', ref: '雅歌 2:10', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.205, 15, b.instant); W.set('rain', 0.24, b.instant); W.set('storm', 0.44, b.instant); W.set('clouds', 0.86, b.instant);
            S.gz = { x: PK.bether, l: 3, v: 0, face: -1, pose: 'stand' };
            W.set('sgGz', 1, b.instant);
            sfx(b, 'harp');
            if (!b.instant && fx()) fx().sparkle(PK.bether * W.w, rangeY(PK.bether) - 10, 24, [255, 236, 190], 10 * SU(), 'sky');
          }],
          // 光停在窗棂外：窗子从外面亮起来（2:9）
          [1.6, b => { gzGo(b, [Rg(0.845), Fa(0.8), Fa(0.74), Mi(0.72), Mi(0.62), Nr(0.57), Win()], { face: 1 }); }],
          [10.4, b => { W.set('sgWin', 1, b.instant); sfx(b, 'chime', { soft: true }); }],
          [15, b => {
            W.set('sgDoor', 1, b.instant);
            add('bride', { label: '书拉密女', sex: 'f', x: LX(0.786), facing: -1, pose: 'stand', robe: ROBE.bride, accent: [226, 178, 156], hair: 'veil', glow: 0.8, prop: null });
            sfx(b, 'gate', { soft: true });
          }],
          [15.3, b => { gzGo(b, [Nr(0.742)], { face: -1, slow: 1.3 }); }],
          [16.4, () => { walk('bride', LX(0.768), { speed: 0.012, pose: 'stand' }); face('bride', -1); gzPose('look', -1); }],
          [18.5, b => { W.set('sgWin', 0, b.instant); W.set('sgDoor', 0.25, b.instant); W.set('sgLamp', 0.3, b.instant); sparkleOn(b, 'bride', 14, [255, 236, 196], 0.7); }],
        ]);
      },
    },

    // ── 2:11 冬天已往，雨水止住过去了（本卷的签名之景）：日出，遍地百花开放 ─────────
    {
      kind: 'cmd', utter: '冬天已往，雨水止住过去了', cmd: 'season.set(春) && rm -rf 冬天 雨水', ref: '2:11',
      verse: [
        { text: '因为冬天已往，雨水止住过去了。', ref: '雅歌 2:11', hold: 5 },
        { text: '地上百花开放，百鸟鸣叫的时候已经来到；<br>斑鸠的声音在我们境内也听见了。', ref: '雅歌 2:12', hold: 7 },
        { text: '无花果树的果子渐渐成熟；葡萄树开花放香。<br>我的佳偶，我的美人，起来，与我同去！', ref: '雅歌 2:13', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.set('rain', 0, b.instant); W.set('storm', 0, b.instant); W.set('gale', 0, b.instant); W.set('clouds', 0.28, b.instant);
            W.goTo(0.345, 7, b.instant);
            W.set('sgSnow', 0.3, b.instant); W.set('sgLamp', 0, b.instant); W.set('sgDoor', 0, b.instant);
            glow('bride', 0.35);
            flash(b, { type: 'spring', dur: 6.5 });
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.18);
            sfx(b, 'harp');
          }],
          [1, b => {
            W.set('bare', 0, b.instant); W.set('grass', 1, b.instant); W.set('herbs', 1, b.instant);
            W.set('sgLeaf', 1, b.instant);
            W.set('sgFalls', 0.7, b.instant);          // 黎巴嫩的雪化了，流下几道细瀑
            W.setPop('creeper', 6, W.w * LX(0.35), W.ridgeBaseY(2, W.w * LX(0.35)), b.instant);
            if (!b.instant) W.flash = Math.max(W.flash || 0, 0.22);
            sfx(b, 'bird', { soft: true });
          }],
          [2.6, b => { W.set('bloom', 1, b.instant); W.set('sgLily', 1, b.instant); W.set('sgThorn', 0.25, b.instant); W.set('sgMeadow', 1, b.instant); }],
          [3, b => { if (!b.instant) FXL.push({ type: 'blossom', t0: W.t, dur: 6 }); }],
          [4, b => { W.set('sgBlos', 1, b.instant); sfx(b, 'bird'); }],
          [7.5, b => { if (!b.instant) petals(1, 0.5); }],
          [6.4, b => {
            W.setPop('bird', 44, W.w * LX(0.35), W.h * 0.5, b.instant);
            if (!b.instant) FXL.push({ type: 'turtles', t0: W.t, dur: 7 });
            S.turtle = 'roof';
            sfx(b, 'bird');
          }],
          [8.6, b => { sfx(b, 'dove'); }],
          [9, () => { walk('bride', LX(0.405), { speed: 0.028, pose: 'stand' }); }],
          [9.8, b => { gzGo(b, [Nr(0.62, 0.04), Nr(0.47, 0.1), Nr(0.335, 0.08)], { face: 1, delay: 0.4 }); }],
          [14.6, b => { W.set('sgVine', 1, b.instant); W.set('sgFig', 0.45, b.instant); W.set('sgFrag', 0.35, b.instant); sfx(b, 'bird', { soft: true }); }],
          [17.2, () => { pose('bride', 'gaze'); face('bride', -1); }],
          [20.5, b => { W.set('sgFrag', 0, b.instant); }],
        ]);
      },
    },

    // ── 2:14 我的鸽子啊，你在磐石穴中：鸽子飞出；小狐狸被赶出葡萄园；日影飞去，光转回比特山 ─────
    {
      kind: 'call', utter: '我的鸽子啊，你在磐石穴中', cmd: 'call 鸽子 --from 磐石穴 && catch 小狐狸', ref: '2:14',
      verse: [
        { text: '我的鸽子啊，你在磐石穴中，在陡岩的隐密处。<br>求你容我得见你的面貌，得听你的声音；因为你的声音柔和，你的面貌秀美。', ref: '雅歌 2:14', hold: 8 },
        { text: '要给我们擒拿狐狸，就是毁坏葡萄园的小狐狸，因为我们的葡萄正在开花。', ref: '雅歌 2:15', hold: 6.5 },
        { text: '我的良人哪，求你等到天起凉风、日影飞去的时候，<br>你要转回，好像羚羊，或像小鹿在比特山上。', ref: '雅歌 2:17', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            face('bride', -1); pose('bride', 'gaze');
            sfx(b, 'dove');
            if (!b.instant && fx()) { const g = cleftGeom(); fx().ring(g.cx, g.cy, [255, 250, 236], M() * 0.1, 1.8, 1.2); fx().sparkle(g.cx, g.cy, 10, [255, 252, 240], 6 * SU(), 'air'); }
          }],
          [1.2, b => {
            if (!b.instant) FXL.push({ type: 'dove', t0: W.t, dur: 4.6, from: () => { const g = cleftGeom(); return [g.cx, g.cy + 3.5 * LS(1), LS(1) * 1.7]; }, to: () => { const p = appleBranch(); return [p[0], p[1], LS(2) * 1.6]; } });
            S.dove = 'apple';
            sfx(b, 'wings', { soft: true });
          }],
          [6, b => { pose('bride', 'stand'); face('bride', -1); if (!b.instant && fx()) { const p = appleBranch(); fx().sparkle(p[0], p[1] - 3, 12, [255, 252, 240], 6 * SU(), 'air'); } }],
          // 小狐狸钻进葡萄园；她的弟兄们指着赶来
          [9.3, b => {
            if (!b.instant) FXL.push({ type: 'foxes', t0: W.t, dur: FOX_T });
            crowd('keepers', { n: 2, x0: LX(0.84), x1: LX(0.87), label: '同母的弟兄' }, man([ROBE.keeper, [100, 84, 70]]));
            cwalk('keepers', LX(0.7), LX(0.75), { speed: 0.03, pose: 'point' });
            face('bride', 1);
            sfx(b, 'crowd', { soft: true, x: 0.8 });
          }],
          [11.5, b => { gzGo(b, [Nr(0.52, 0.12), Nr(0.6, 0.22)], { face: 1 }); }],
          // 天起凉风、日影飞去：在 2:17 那一行之前到黄昏
          [11.8, b => { W.goTo(0.745, 5.4, b.instant); W.set('clouds', 0.36, b.instant); }],
          [15.2, () => { cwalk('keepers', LX(0.765), LX(0.79), { speed: 0.025, pose: 'stand' }); cface('keepers', -1); }],
          [17.3, b => { gzGo(b, [Nr(0.72, 0.06), Mi(0.74), Fa(0.82), Rg(PK.bether)], { face: -1, arrive: true, arriveDur: 2.4 }); sfx(b, 'harp', { soft: true }); }],
          [21, () => { pose('bride', 'gaze'); face('bride', 1); }],
        ]);
      },
    },

    // ── 3 夜里寻找；寻见了；黎明，旷野上来烟柱：所罗门的轿，头戴冠冕；锡安的众女子出城观看 ─────
    {
      kind: 'cmd', utter: '锡安的众女子啊，你们出去观看所罗门王！', cmd: 'open 城门 && watch 所罗门的轿 --crowned', ref: '3:11',
      verse: [
        { text: '城中巡逻看守的人遇见我；我问他们：你们看见我心所爱的没有？<br>我刚离开他们就遇见我心所爱的。', ref: '雅歌 3:3–4', hold: 7.5 },
        { text: '那从旷野上来、形状如烟柱、以没药和乳香并商人各样香粉薰的是谁呢？', ref: '雅歌 3:6', hold: 6.5 },
        { text: '锡安的众女子啊，你们出去观看所罗门王！<br>头戴冠冕，就是在他婚筵的日子、心中喜乐的时候，他母亲给他戴上的。', ref: '雅歌 3:11', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.02, 4.5, b.instant); W.set('sgLamp', 1, b.instant);
            crm('keepers'); crm('shepherds'); crm('flock'); rm('kid1'); rm('kid2');
            W.set('sgTents', 0, b.instant);
            glow('bride', 0.8);
          }],
          [0.6, () => { hold('bride', 'torch'); pose('bride', 'stand'); walk('bride', LX(0.875), { speed: 0.062, pose: 'stand' }); }],
          [1.2, () => {
            crowd('watch', { n: 2, x0: LX(0.905), x1: LX(0.96), label: '看守的人' }, man([ROBE.watch, [84, 76, 90]], 'torch'));
            cface('watch', -1);
          }],
          [4.6, b => { face('bride', 1); pose('bride', 'point'); sfx(b, 'crowd', { soft: true, x: 0.85 }); }],
          [5.2, b => { cpose('watch', 'point'); gzGo(b, [Fa(0.84), Mi(0.78), Nr(0.585)], { face: 1 }); }],
          [6.4, () => { pose('bride', 'stand'); walk('bride', LX(0.615), { speed: 0.05, pose: 'stand' }); face('bride', -1); }],
          // 黎明：旷野上来烟柱，所罗门的轿与勇士（3:6–8）
          [8.6, b => {
            W.goTo(0.275, 6.5, b.instant);
            crm('watch');
            W.set('sgSmoke', 1, b.instant); W.set('sgLitter', 1, b.instant); W.set('sgCrown', 0, b.instant);
            crowd('guard', { n: 8, x0: 0.5, x1: 0.565, layer: 1, label: '勇士' }, (m, i) => { man(GUARD)(m, i); m.accent = [226, 208, 176]; m.hairOpt = 'cloth'; });
            cwalk('guard', 0.6, 0.72, { speed: 0.0135, pose: 'stand' });
            S.litX = 0.66;
            LIT = b.instant ? null : { t0: W.t, dur: 9.5, x0: 0.533, x1: 0.66 };
            sfx(b, 'crowd', { soft: true, far: true });
          }],
          [12, b => { W.set('sgLamp', 0.2, b.instant); hold('bride', null); glow('bride', 0.35); }],
          [15, b => {
            W.set('sgLamp', 0, b.instant);
            crowd('daughters', { n: 5, x0: LX(0.92), x1: LX(0.95), label: '耶路撒冷的众女子' }, woman(DAUGHTER));
            cwalk('daughters', LX(0.82), LX(0.93), { speed: 0.026, pose: 'gaze' });
            cface('daughters', -1);
            sfx(b, 'crowd', { soft: true, x: 0.85 });
          }],
          // 头戴冠冕（3:11）：轿顶上戴上金冠，众女子举手观看
          [18.2, b => { W.set('sgCrown', 1, b.instant); cface('daughters', -1); cpose('daughters', 'raise'); if (!b.instant) FXL.push({ type: 'crown', t0: W.t, dur: 2.6 }); sfx(b, 'harp'); }],
        ]);
      },
    },

    // ── 4:7 你全然美丽，毫无瑕疵：园墙升起，关锁的园、封闭的泉；泉水涌出，溪水流下 ─────
    {
      kind: 'bless', utter: '我的佳偶，你全然美丽，毫无瑕疵！', cmd: 'lock 园 && seal 泉源  # 毫无瑕疵', ref: '4:7',
      verse: [
        { text: '我的佳偶，你全然美丽，毫无瑕疵！', ref: '雅歌 4:7', hold: 4.5 },
        { text: '我妹子，我新妇，乃是关锁的园，禁闭的井，封闭的泉源。<br>你园内所种的结了石榴，有佳美的果子，并凤仙花与哪哒树。', ref: '雅歌 4:12–13', hold: 8 },
        { text: '你是园中的泉，活水的井，从黎巴嫩流下来的溪水。', ref: '雅歌 4:15', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.37, 5, b.instant);
            W.set('sgGlow', 1, b.instant); glow('bride', 0.8);
            W.set('sgSmoke', 0, b.instant); W.set('sgLitter', 0, b.instant); W.set('sgCrown', 0, b.instant);
            crm('guard');
            cwalk('daughters', LX(0.95), LX(0.99), { speed: 0.03 });
            sparkleOn(b, 'bride', 24, [255, 250, 236], 0.55);
            if (!b.instant && fx()) { const h = headOf('bride', 0.55); fx().ring(h[0], h[1], [255, 250, 240], M() * 0.18, 2.2, 1.6); }
          }],
          [1.2, () => { walk('bride', LX(0.36), { speed: 0.028, pose: 'stand' }); }],
          [2.2, b => { gzGo(b, [Nr(0.575)], { face: -1 }); }],
          [4.2, () => { crm('daughters'); }],
          [5.8, b => { W.set('sgWall', 1, b.instant); W.set('sgGlow', 0.35, b.instant); sfx(b, 'build', { soft: true }); }],
          [8, b => { sfx(b, 'build', { soft: true }); face('bride', 1); }],
          [10, b => { W.set('sgPomFr', 1, b.instant); W.set('sgPom', 0.3, b.instant); }],
          [15.1, b => {
            W.set('sgSpring', 1, b.instant);
            sfx(b, 'splash'); sfx(b, 'seal', { soft: true });
            if (!b.instant && fx()) { const xf = LX(F.well); fx().sparkle(xf * W.w, baseY(2, xf, 0.2) - 8 * LS(2), 20, [220, 240, 255], 8 * SU(), 'air'); }
          }],
          [16, b => { W.set('sgStream', 1, b.instant); W.set('sgFalls', 1, b.instant); W.set('sgGlow', 0, b.instant); glow('bride', 0.35); }],
        ]);
      },
    },

    // ── 4:16 北风啊，兴起！南风啊，吹来！香气发出来；良人进入自己的园中（5:1）─────
    {
      kind: 'cmd', utter: '北风啊，兴起！南风啊，吹来！', cmd: 'wind --north --south | diffuse 香气', ref: '4:16',
      verse: [
        { text: '北风啊，兴起！南风啊，吹来！吹在我的园内，使其中的香气发出来。<br>愿我的良人进入自己园里，吃他佳美的果子。', ref: '雅歌 4:16', hold: 7.5 },
        { text: '我妹子，我新妇，我进了我的园中，采了我的没药和香料……', ref: '雅歌 5:1', hold: 5.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            GUST = -1;
            W.set('gale', 0.62, b.instant); W.set('clouds', 0.6, b.instant); W.set('sgFrag', 1, b.instant);
            W.goTo(0.45, 12, b.instant);
            if (!b.instant) petals(-1);
            sfx(b, 'wind');
          }],
          [3.6, b => { GUST = 1; if (!b.instant) petals(1); sfx(b, 'wind'); W.set('sgPom', 1, b.instant); }],
          [7.2, b => { W.set('gale', 0.02, b.instant); W.set('clouds', 0.42, b.instant); }],
          [8.8, b => { W.set('sgGate', 1, b.instant); sfx(b, 'gate', { soft: true }); face('bride', 1); }],
          [9.6, b => { gzGo(b, [Nr(0.535, 0.12), Nr(0.455, 0.12)], { face: -1, slow: 1.3 }); }],
          [12.5, b => { W.set('sgFrag', 0.25, b.instant); sfx(b, 'harp', { soft: true }); pose('bride', 'gaze'); }],
          [14.2, b => { W.set('sgGate', 0, b.instant); gzPose('rest'); }],
        ]);
      },
    },

    // ── 5:2 求你给我开门：夜里敲门；门开了，他已转身走了；「他的形状如黎巴嫩」 ─────
    {
      kind: 'call', utter: '我的鸽子，我的完全人，求你给我开门', cmd: 'knock --door 她的家  # 头满了露水', ref: '5:2',
      verse: [
        { text: '我身睡卧，我心却醒。……他敲门说：<br>我的妹子，我的佳偶，我的鸽子，我的完全人，求你给我开门；因我的头满了露水……', ref: '雅歌 5:2', hold: 8 },
        { text: '我给我的良人开了门；我的良人却已转身走了。……<br>我寻找他，竟寻不见；我呼叫他，他却不回答。', ref: '雅歌 5:6', hold: 7 },
        { text: '……他的形状如黎巴嫩，且佳美如香柏树。……他全然可爱。<br>耶路撒冷的众女子啊，这是我的良人；这是我的朋友。', ref: '雅歌 5:15–16', hold: 7.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.015, 7, b.instant); W.set('sgFrag', 0, b.instant); W.set('gale', 0, b.instant);
            W.set('sgGate', 1, b.instant);
            gzPose('stand'); glow('bride', 0.8);
            walk('bride', LX(0.785), { speed: 0.05, pose: 'stand' });
          }],
          [5.6, b => { W.set('sgLamp', 1, b.instant); W.set('sgGate', 0, b.instant); rm('bride'); }],
          [6, b => { gzGo(b, [Nr(0.535, 0.12), Nr(0.6), Nr(0.748)], { face: 1 }); }],
          [8.4, b => {
            if (!b.instant) FXL.push({ type: 'dew', t0: W.t, dur: 4 });
            sfx(b, 'gate', { soft: true });
            if (!b.instant && fx()) { const G = houseGeom(); fx().ring(G.dx, G.y - 6 * G.s, [255, 236, 200], M() * 0.05, 1.2, 1); }
          }],
          [9.4, b => { sfx(b, 'gate', { soft: true }); }],
          [10.4, b => { gzGo(b, [Nr(0.7, 0.04), Mi(0.76), Fa(0.8), Rg(0.86)], { face: -1 }); }],
          [11.4, b => {
            W.set('sgDoor', 1, b.instant);
            add('bride', { label: '书拉密女', sex: 'f', x: LX(0.786), facing: -1, pose: 'stand', robe: ROBE.bride, accent: [226, 178, 156], hair: 'veil', glow: 0.8, prop: 'torch' });
            sfx(b, 'gate', { soft: true });
          }],
          [13, () => { walk('bride', LX(0.64), { speed: 0.028, pose: 'raise' }); }],
          [18.6, b => {
            W.set('sgDoor', 0.2, b.instant); W.set('sgLeb', 1, b.instant);
            // 夜里出城的众女子：几个人拿着火把，脚下有光，看得见
            crowd('daughters', { n: 5, x0: LX(0.92), x1: LX(0.95), label: '耶路撒冷的众女子' }, (m, i, n) => { woman(DAUGHTER)(m, i, n); if (i % 2 === 0) { m.prop = 'torch'; m.propDefault = false; } m.glow = 0.3; });
            cwalk('daughters', LX(0.68), LX(0.76), { speed: 0.03, pose: 'stand' });
            cface('daughters', -1);
          }],
          [21.5, b => { pose('bride', 'point'); face('bride', 1); sfx(b, 'harp', { soft: true }); }],
          [24.5, b => { W.set('sgDoor', 0, b.instant); cpose('daughters', 'gaze'); }],
        ]);
      },
    },

    // ── 6:13 回来，回来，书拉密女：黎明如展开的旌旗；二人往葡萄园去（7:10–12）─────
    {
      kind: 'call', utter: '回来，回来，书拉密女', cmd: 'return 书拉密女 ×4 && goto 葡萄园 --at 黎明', ref: '6:13',
      verse: [
        { text: '那向外观看、如晨光发现、美丽如月亮、皎洁如日头、<br>威武如展开旌旗军队的是谁呢？', ref: '雅歌 6:10', hold: 6.5 },
        { text: '回来，回来，书拉密女；你回来，你回来，使我们得观看你。', ref: '雅歌 6:13', hold: 5.5 },
        { text: '我属我的良人，他也恋慕我。我的良人，来吧！你我可以往田间去……<br>我们早晨起来往葡萄园去，看看葡萄发芽开花没有，石榴放蕊没有。', ref: '雅歌 7:10–12', hold: 8.5 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.285, 9, b.instant); W.set('sgRays', 1, b.instant); W.set('sgLeb', 0, b.instant);
            W.set('sgLamp', 0, b.instant);
            for (const m of cmembers('daughters')) { m.prop = null; m.glow = 0.08; }
            sfx(b, 'harp');
          }],
          [3, () => { hold('bride', null); glow('bride', 0.35); pose('bride', 'gaze'); face('bride', -1); }],
          [7.8, b => {
            cpose('daughters', 'raise'); cface('daughters', -1);
            face('bride', 1); pose('bride', 'stand');
            W.set('sgGlow', 0.6, b.instant);
            sparkleOn(b, 'bride', 16, [255, 244, 220], 0.6);
          }],
          [9, b => { gzGo(b, [Fa(0.8), Mi(0.72), Nr(0.54, 0.06)], { face: 1 }); }],
          [14.6, b => {
            W.set('sgRays', 0.25, b.instant); W.set('sgGlow', 0, b.instant);
            face('bride', -1);
            walk('bride', LX(0.6), { speed: 0.012, pose: 'stand' });
            gzGo(b, [Nr(0.66, 0.08)], { face: -1, slow: 1.4, delay: 0.6 });
            cwalk('daughters', LX(0.93), LX(0.99), { speed: 0.03 });
          }],
          [17.5, b => { W.set('sgGrape', 1, b.instant); W.set('sgPom', 1, b.instant); sfx(b, 'bird', { soft: true }); }],
          [20.5, b => { crm('daughters'); W.set('sgRays', 0, b.instant); pose('bride', 'gaze'); face('bride', 1); }],
        ]);
      },
    },

    // ── 8:7 爱情，众水不能息灭：苹果树下，心上的印记；磐石上的烈焰；风暴与大水不能息灭 ─────
    {
      kind: 'promise', utter: '爱情，众水不能息灭，大水也不能淹没', cmd: 'seal --on 心 && flood.quench(烈焰)  // → false', ref: '8:7',
      verse: [
        { text: '那靠着良人从旷野上来的是谁呢？我在苹果树下叫醒你。', ref: '雅歌 8:5', hold: 5.5 },
        { text: '求你将我放在你心上如印记，带在你臂上如戳记。因为爱情如死之坚强，嫉恨如阴间之残忍；<br>所发的电光是火焰的电光，是耶和华的烈焰。', ref: '雅歌 8:6', hold: 8.5 },
        { text: '爱情，众水不能息灭，大水也不能淹没。<br>若有人拿家中所有的财宝要换爱情，就全被藐视。', ref: '雅歌 8:7', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.64, 6, b.instant);
            W.set('sgBlos', 0, b.instant); W.set('sgApple', 1, b.instant); W.set('sgGate', 1, b.instant);
            face('bride', -1);
            walk('bride', LX(0.335), { speed: 0.03, pose: 'stand' });
            gzGo(b, [Nr(0.54, 0.12), Nr(0.45, 0.12), Nr(0.27, 0.07)], { face: 1, delay: 0.5 });
            if (!b.instant) petals(-1);
          }],
          [6.8, b => {
            W.set('sgSeal', 1, b.instant); W.set('sgGate', 0, b.instant);
            gzPose('rest', 1); face('bride', -1); pose('bride', 'stand');
            sfx(b, 'seal');
            if (!b.instant && fx()) { const h = headOf('bride', 0.64); fx().ring(h[0], h[1], [255, 226, 160], M() * 0.08, 1.6, 1.4); }
          }],
          [8.6, b => { W.set('sgFlame', 1, b.instant); sfx(b, 'fire'); if (!b.instant && fx()) { const R = rockGeom(); fx().sparkle(R.x, R.top - 10 * R.s, 30, [255, 190, 110], 10 * SU(), 'air'); } }],
          [9.8, b => {
            W.set('storm', 0.85, b.instant); W.set('clouds', 0.9, b.instant); W.set('gale', 0.75, b.instant); W.set('rain', 0.5, b.instant);
            GUST = 1;
            sfx(b, 'wind');
          }],
          [11.2, b => { if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.3, near: true }); }],
          [12.6, b => { W.set('sgWaves', 1, b.instant); sfx(b, 'splash'); }],
          [14.4, b => { if (!b.instant && GS.weather && GS.weather.bolt) GS.weather.bolt({ x: 0.72 }); }],
          [17.2, b => { pose('bride', 'gaze'); face('bride', -1); sfx(b, 'harp', { low: true }); }],
          [21.5, b => {
            W.set('storm', 0.08, b.instant); W.set('gale', 0.02, b.instant); W.set('rain', 0, b.instant); W.set('clouds', 0.45, b.instant);
            W.set('sgWaves', 0.12, b.instant);
            W.goTo(0.735, 5, b.instant);
          }],
        ]);
      },
    },

    // ── 8:13 求你使我也得听见：她的声音自园中升起；「求你快来！」——光跃上香草山，日出 ─────
    {
      kind: 'call', utter: '同伴都要听你的声音，求你使我也得听见', cmd: 'listen 你的声音 && await 良人 --on 香草山', ref: '8:13',
      verse: [
        { text: '你这住在园中的，同伴都要听你的声音，求你使我也得听见。', ref: '雅歌 8:13', hold: 6 },
        { text: '我的良人哪，求你快来！如羚羊或小鹿在香草山上。', ref: '雅歌 8:14', hold: 7 },
      ],
      apply(c) {
        T(c, [
          [0, b => {
            W.goTo(0.29, 12, b.instant); W.set('sgSeal', 0.35, b.instant); W.set('sgWaves', 0, b.instant);
            crowd('daughters', { n: 5, x0: LX(0.07), x1: LX(0.17), label: '同伴' }, woman(DAUGHTER));
            cface('daughters', 1);
            cpose('daughters', 'stand');
            gzPose('stand', 1);
          }],
          [1.4, b => {
            pose('bride', 'raise'); face('bride', 1);
            if (!b.instant) FXL.push({ type: 'voice', t0: W.t, dur: 5.5 });
            sfx(b, 'harp', { soft: true });
          }],
          [4, () => { cpose('daughters', 'gaze'); }],
          [7.3, b => {
            gzGo(b, [Nr(0.45, 0.12), Nr(0.535, 0.12), Nr(0.585), Mi(0.68), Fa(0.76), Rg(PK.hermon)], { face: -1 });
            W.set('sgSpice', 1, b.instant);
            pose('bride', 'gaze');
          }],
          [15, b => { sfx(b, 'harp'); if (!b.instant && fx()) fx().sparkle(PK.hermon * W.w, rangeY(PK.hermon) - 8, 30, [255, 226, 170], 12 * SU(), 'sky'); }],
        ]);
      },
    },
  ];

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '雅歌', books: [22], title: '雅歌', sub: '雅歌 1 — 8', tint: [255, 210, 220], music: 'eden',
    outro: 20,
    intro: [
      { text: '耶路撒冷的众女子啊，我虽然黑，却是秀美，<br>如同基达的帐棚，好像所罗门的幔子。', ref: '雅歌 1:5', hold: 6 },
      { text: '……我同母的弟兄向我发怒，他们使我看守葡萄园；<br>我自己的葡萄园却没有看守。', ref: '雅歌 1:6', hold: 6 },
    ],
    setup, stages: STAGES, scene: SCENE,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '书拉密女': { text: '回来，回来，书拉密女；你回来，你回来，使我们得观看你。', ref: '雅歌 6:13' },
      '良人': { text: '我的良人好像羚羊，或像小鹿。他站在我们墙壁后，从窗户往里观看，从窗棂往里窥探。', ref: '雅歌 2:9' },
      '山羊羔': { text: '你若不知道，只管跟随羊群的脚踪去，把你的山羊羔牧放在牧人帐棚的旁边。', ref: '雅歌 1:8' },
      '羊群': { text: '我的良人下入自己园中，到香花畦，在园内牧放群羊，采百合花。', ref: '雅歌 6:2' },
      '牧人': { text: '我心所爱的啊，求你告诉我，你在何处牧羊？晌午在何处使羊歇卧？', ref: '雅歌 1:7' },
      '山羊群': { text: '我的佳偶，你甚美丽！你甚美丽！你的眼在帕子内好像鸽子眼。<br>你的头发如同山羊群卧在基列山旁。', ref: '雅歌 4:1' },
      '同母的弟兄': { text: '我同母的弟兄向我发怒，他们使我看守葡萄园；我自己的葡萄园却没有看守。', ref: '雅歌 1:6' },
      '看守的人': { text: '城中巡逻看守的人遇见我；我问他们：你们看见我心所爱的没有？', ref: '雅歌 3:3' },
      '勇士': { text: '看哪，是所罗门的轿；四围有六十个勇士，都是以色列中的勇士；<br>手都持刀，善于争战，腰间佩刀，防备夜间有惊慌。', ref: '雅歌 3:7–8' },
      '耶路撒冷的众女子': { text: '耶路撒冷的众女子啊，我指着羚羊或田野的母鹿嘱咐你们：<br>不要惊动、不要叫醒我所亲爱的，等他自己情愿。', ref: '雅歌 2:7' },
      '同伴': { text: '你这住在园中的，同伴都要听你的声音，求你使我也得听见。', ref: '雅歌 8:13' },
      '所罗门的轿': { text: '所罗门王用黎巴嫩木为自己制造一乘华轿。<br>轿柱是用银做的，轿底是用金做的；坐垫是紫色的，其中所铺的乃耶路撒冷众女子的爱情。', ref: '雅歌 3:9–10' },
      '苹果树': { text: '我的良人在男子中，如同苹果树在树林中。<br>我欢欢喜喜坐在他的荫下，尝他果子的滋味，觉得甘甜。', ref: '雅歌 2:3' },
      '无花果树': { text: '无花果树的果子渐渐成熟；葡萄树开花放香。', ref: '雅歌 2:13' },
      '石榴树': { text: '我下入核桃园，要看谷中青绿的植物，要看葡萄发芽没有，石榴开花没有。', ref: '雅歌 6:11' },
      '葡萄园': { text: '我自己的葡萄园在我面前。', ref: '雅歌 8:12' },
      '百合花': { text: '良人属我，我也属他；他在百合花中牧放群羊。', ref: '雅歌 2:16' },
      '基达的帐棚': { text: '耶路撒冷的众女子啊，我虽然黑，却是秀美，如同基达的帐棚，好像所罗门的幔子。', ref: '雅歌 1:5' },
      '关锁的园': { text: '我妹子，我新妇，乃是关锁的园，禁闭的井，封闭的泉源。', ref: '雅歌 4:12' },
      '园中的泉': { text: '你是园中的泉，活水的井，从黎巴嫩流下来的溪水。', ref: '雅歌 4:15' },
      '溪水': { text: '你是园中的泉，活水的井，从黎巴嫩流下来的溪水。', ref: '雅歌 4:15' },
      '窗棂': { text: '他站在我们墙壁后，从窗户往里观看，从窗棂往里窥探。', ref: '雅歌 2:9' },
      '耶路撒冷': { text: '我的佳偶啊，你美丽如得撒，秀美如耶路撒冷，威武如展开旌旗的军队。', ref: '雅歌 6:4' },
      '磐石穴': { text: '我的鸽子啊，你在磐石穴中，在陡岩的隐密处。', ref: '雅歌 2:14' },
      '鸽子': { text: '我的佳偶，你甚美丽！你甚美丽！你的眼好像鸽子眼。', ref: '雅歌 1:15' },
      '斑鸠': { text: '地上百花开放，百鸟鸣叫的时候已经来到；斑鸠的声音在我们境内也听见了。', ref: '雅歌 2:12' },
      '烈焰': { text: '所发的电光是火焰的电光，是耶和华的烈焰。', ref: '雅歌 8:6' },
      '黎巴嫩': { text: '我的新妇，求你与我一同离开黎巴嫩，与我一同离开黎巴嫩。<br>从亚玛拿顶，从示尼珥与黑门顶，从有狮子的洞，从有豹子的山往下观看。', ref: '雅歌 4:8' },
      '香草山': { text: '我的良人哪，求你快来！如羚羊或小鹿在香草山上。', ref: '雅歌 8:14' },
    },
  });
})(window.GS);
