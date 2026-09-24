/* ─────────────────────────────────────────────────────────────
 * book/sinai.js —— 出埃及记 · 西奈（出埃及记 19 — 40）
 *
 * 出埃及第三个月，以色列人在西奈的旷野、在山下安营（右边的远处，一座花岗岩的大山）。
 * 「我如鹰将你们背在翅膀上」——一只光的鹰自海上（埃及的方向）飞来，盘过营地，落在山顶；
 * 百姓自洁、洗衣服，山的四围定了界限（一列白石，一道微光的线）；一夜过去，第三天早晨——
 * 雷轰、闪电、密云、角声甚大；全山冒烟如烧窑，耶和华在火中降于山上，遍山震动（本卷的第一幅图）；
 * 十条诫：两块光的法版在云前显出，字一行一行写上去；百姓远远站立，摩西挨近幽暗；
 * 典章与使者（一道光的字流自山顶流到摩西；一位发光的使者站在路上）；
 * 山下的坛与十二根柱子，长老们看见「脚下仿佛有平铺的蓝宝石」，摩西进入云中四十昼夜，山顶如烈火；
 * 山上指示的样式（帐幕、约柜与基路伯、桌子、坛、洗濯盆、灯台——金色的线在夜空里画出）；
 * 圣衣的胸牌、香坛；两块法版降到山顶摩西手中；金牛犊（营中假的金光）——法版摔碎，牛犊焚烧；
 * 会幕与云柱；磐石穴中——荣耀经过，手遮掩，只见其背（本卷的第二幅图）；
 * 「耶和华，耶和华，是有怜悯有恩典的神」——名在云上显出；摩西面皮发光；
 * 甘心乐意的礼物、比撒列的巧工；正月初一日帐幕立起——云彩遮盖会幕，耶和华的荣光充满了帐幕；
 * 夜间云中有火（全卷的末一幅图）。
 *
 * 画面的方位：右边远处 = 西奈山（在远山之前、中丘之后）；近地 = 以色列的营，中间一片空地后来立起帐幕；
 * 中丘 = 营的远处、山的边界、营外的会幕；左边 = 海（埃及的方向，鹰从那边来）。
 * God 从不画成形像：只有光、云、火、声音、荣耀。一切情节都可瞬间重演（恢复存档 / 提前言说）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU, smoothstep } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio;
  const ACT = 'sinai';
  const cur = () => GS.book.current(ACT);
  const safe = U.safe;
  const sfx = (name, o) => { if (W.replaying) return; const a = au(); if (a && a.sfx) safe('sinai.sfx', () => a.sfx(name, o || {})); };

  // ── 本卷的程度（缓动的量；恢复存档时由 W.snapAll 对齐）──────────
  const LEVELS = {
    snCloud: ['exp', 0.4],     // 山上的密云
    snSmoke: ['exp', 0.45],    // 山的烟气上腾，如烧窑一般
    snFire: ['exp', 0.6],      // 山顶的火（19:18；24:17 形状如烈火）
    snQuake: ['exp', 0.9],     // 遍山大大地震动
    snBound: ['lin', 0.2],     // 山四围的界限（白石一块一块亮起）
    snClimb: ['lin', 0.15],    // 山上的摩西：山脚 0 → 山顶 1
    snTab: ['exp', 0.6],       // 光的法版（天上）
    snTabDown: ['lin', 0.15],  // 法版降到山顶摩西手中
    snPave: ['exp', 0.5],      // 脚下仿佛有平铺的蓝宝石（24:10）
    snAltar: ['lin', 0.1],     // 山下的坛与十二根柱子（24:4）
    snAltarF: ['exp', 0.5],    // 坛上的火（金牛犊之后熄了）
    snAltarA: ['exp', 0.4],    // 坛与柱子整个的显隐（帐幕立起之前隐去）
    snPattern: ['exp', 0.5],   // 山上指示的样式
    snGems: ['exp', 0.6],      // 胸牌上的十二块宝石
    snCalf: ['exp', 0.8],      // 金牛犊
    snCalfFire: ['exp', 0.9],  // 用火焚烧牛犊
    snMeet: ['exp', 0.6],      // 营外的会幕
    snPillarM: ['exp', 0.45],  // 云柱降在会幕门前
    snCleft: ['exp', 0.7],     // 磐石穴
    snHand: ['exp', 1.4],      // 用我的手遮掩你
    snName: ['exp', 0.4],      // 宣告耶和华的名（山顶的余辉）
    snShine: ['exp', 0.6],     // 摩西的面皮发光
    snGifts: ['exp', 0.5],     // 甘心乐意的礼物
    snParts: ['lin', 0.12],    // 做成的物件（柜、桌子、灯台、坛、洗濯盆、板、幔子）
    snRaise: ['lin', 0.068],   // 帐幕立起来
    snColumn: ['exp', 0.35],   // 云彩遮盖会幕（日间云，夜间火）
    snGlory: ['exp', 0.45],    // 耶和华的荣光充满了帐幕
    snFires: ['exp', 0.5],     // 营中的火（夜里）
  };
  for (const k in LEVELS) W.defineLevel(k, LEVELS[k][0], LEVELS[k][1]);
  const MY_LEVELS = Object.keys(LEVELS);

  // ── 本卷的状态（只在 setup / apply / 情节里设定，重演时一样）───
  function fresh() {
    return {
      eagleT0: -1e9, streamT0: -1e9, passT0: -1e9, shatterT0: -1e9, goldT0: -1e9, litT0: -1e9, patGlowT0: -1e9,
      writeT: new Array(10).fill(-1e9), tabN: 0,       // 十条诫：已写上几条、各自开始写的时刻
      patT: new Array(8).fill(-1e9), patN: 0,          // 样式：已显出几件
      lampLit: 0, incense: 0,
      tabs: 'none',      // 石版在谁手里：'none' | 'mosesM'（山上）| 'moses'（营中）| 'broken'
      tabsNew: 0,        // 第二次的石版（34 章）
      mPos: 'ridge',     // 山上的摩西站在哪里：'ridge' 山脊 | 'meet' 会幕门前 | 'cleft' 磐石穴
      calf: 'none',      // 'none' | 'idol' | 'burnt'
      shards: 0, shardX: 0.72,
    };
  }
  let S = fresh();

  // ── 颜色 ────────────────────────────────────────────────────
  const GRAN = [[198, 128, 96], [156, 100, 80], [104, 76, 68]];   // 西奈的花岗岩：上浅下深
  const TENT = [64, 52, 46], TENT_HI = [102, 84, 68], TENT_M = [150, 132, 108];
  const LINEN = [240, 234, 218], BRONZE = [178, 122, 66], SILVER = [214, 218, 226], GOLD = [238, 196, 98];
  const BLUE = [58, 84, 170], PURPLE = [122, 62, 134], SCARLET = [196, 46, 54], RAMRED = [156, 60, 50], TACHASH = [120, 102, 90], GOATHAIR = [60, 50, 46];
  const STONE = [168, 160, 146], ROCK = [132, 122, 110];
  const WARM = [255, 200, 130], FIRE = [255, 150, 70], SAPH = [74, 112, 214];
  const TINT = [255, 226, 176];
  const ROBE = {
    moses: [112, 98, 132], aaron: [150, 118, 92], priest: [60, 84, 158], joshua: [108, 118, 86],
    bezalel: [156, 112, 72], oholiab: [84, 108, 142], elder: [132, 112, 96],
  };
  const DM = 0.4;   // 西奈山的纵深（在远山与中丘之间）

  // ════════════════════════════════════════════════════════════
  //  小工具
  // ════════════════════════════════════════════════════════════
  const DEP = l => (W.LAYERS[l] ? W.LAYERS[l].depth : 0);
  const css = (rgb, d, a, ex) => W.shadeCSS(rgb, d, a, ex);
  const gY = (l, xf) => {
    const x = xf * W.w, Ld = GS.land;
    let y = Ld && Ld.groundY ? Ld.groundY(l, x) : W.ridgeY(l, x);
    if (!isFinite(y)) y = W.ridgeY(l, x);
    return y;
  };
  // 一个人在某层上的身高（与人物模块一致）
  const hp = l => 34 * W.layerScale(l) * (W.w < 600 ? 1.4 : 1) * ([1.1, 1.2, 1.3][l] || 1);
  const SU = () => Math.max(0.6, W.unit);
  const M = () => Math.min(W.w, W.h);
  const nightK = () => clamp(W.night * 1.15 + W.dusk * 0.35, 0, 1);
  const litX = () => (W.night > 0.55 && W.lv.moon > 0.3 ? W.moon.x : W.core.x);
  const fieldY = (xf, v) => { const g = gY(2, xf); return g + v * Math.max(0, W.h - g); };
  const RT = [];
  (function () { const r = U.mulberry32(1940); for (let i = 0; i < 1024; i++) RT.push(r()); })();
  const rt = i => RT[((i % 1024) + 1024) % 1024];
  const q8 = v => Math.round(v / 8) * 8;

  // ── 人物（皆经人物模块）─────────────────────────────────────
  const C = () => cast();
  const fig = id => { const c = C(); return c && c.get ? c.get(id) : null; };
  function add(id, o) {
    const c = C();
    if (!c) return null;
    const had = !!fig(id);
    const p = c.add(id, o);
    if (had && o.x != null) c.place(id, o.x, o.layer);
    return p;
  }
  function walk(id, x, o) { if (fig(id)) C().walk(id, x, o); }
  function pose(id, p) { if (fig(id)) C().pose(id, p); }
  function face(id, d) { if (fig(id)) C().face(id, d); }
  function rm(id) { if (fig(id)) C().remove(id); }
  function attach(id, fn) { const c = C(); if (c && c.attach && fig(id)) c.attach(id, fn || null); }
  const hasCrowd = g => { const c = C(); return !!(c && c.crowds && c.crowds.has && c.crowds.has(g)); };
  function crowdWalk(g, a, b, o) { if (hasCrowd(g)) C().crowdWalk(g, a, b, o); }
  function crowdPose(g, p) { if (hasCrowd(g)) C().crowdPose(g, p); }
  function crowdFace(g, d) { const c = C(); if (!hasCrowd(g)) return; c.crowds.get(g).members.forEach(m => { m.facing = d; if (W.replaying) m.fd = d; }); }
  function uncrowd(g) { if (hasCrowd(g)) C().removeCrowd(g); }
  function avoid(...rs) { W.beastAvoid = rs.map(r => [clamp(Math.min(r[0], r[1]), 0, 1), clamp(Math.max(r[0], r[1]), 0, 1)]); }
  const lv = (name, v, b) => W.set(name, v, !!(b && b.instant));

  // ── 角声（shofar）：声音模块的羊角（19:13 角声拖长；19:19 渐渐地高而又高）──
  function horn(k) {
    const kk = clamp(k || 0, 0, 1);
    sfx('horn', { soft: kk < 0.5, size: 0.6 + 0.6 * kk });
  }

  // ════════════════════════════════════════════════════════════
  //  布局：一切以画面比例记下（横屏 / 竖屏各一套）
  // ════════════════════════════════════════════════════════════
  function fractions(port) {
    return port ? {
      mcx: 0.7, mhw: 0.4, mtop: 0.37, mbase: 0.628,
      campL: [0.37, 0.5], campR: [0.965, 1.05], midT: [0.5, 0.82], folk: [0.42, 0.62], home: 0.68, aaron: 0.6, foot: 0.84, up: 0.9,
      altar: 0.87, pil: [0.72, 0.98], calf: 0.56, court: [0.43, 0.93], tent: [0.6, 0.85], meet: 0.9, angel: 0.92,
      parts: [0.44, 0.94], shore: [0.39, 0.47], eld: [0.8, 0.96], gift: 0.66, flock: [0.335, 0.385],
      tab: { cx: 0.285, y0: 0.3, y1: 0.56, w: 0.22, gap: 0.02 },
      pat: { x0: 0.05, x1: 0.66, y0: 0.32, y1: 0.57 },
    } : {
      mcx: 0.775, mhw: 0.3, mtop: 0.19, mbase: 0.63,
      campL: [0.42, 0.55], campR: [0.96, 1.04], midT: [0.5, 0.78], folk: [0.47, 0.64], home: 0.7, aaron: 0.66, foot: 0.8, up: 0.86,
      altar: 0.87, pil: [0.82, 0.955], calf: 0.6, court: [0.555, 0.81], tent: [0.64, 0.77], meet: 0.905, angel: 0.9,
      parts: [0.55, 0.83], shore: [0.41, 0.48], eld: [0.8, 0.94], gift: 0.68, flock: [0.358, 0.412],
      tab: { cx: 0.585, y0: 0.085, y1: 0.43, w: 0.1, gap: 0.012 },
      pat: { x0: 0.3, x1: 0.7, y0: 0.08, y1: 0.45 },
    };
  }
  const port = () => W.w < W.h * 0.9;
  let F = fractions(false);

  // ── 西奈山的形（归一化；山顶 k = 1）：大山的身上立着几座花岗岩的峰（圆顶、陡壁、锯齿），峰间是 V 形的谷 ──
  const MT = (function () {
    const r = U.mulberry32(1919), N = 241, pts = [];
    const pk = (u, c, h, w, p) => h * Math.pow(Math.max(0, 1 - Math.abs(u - c) / w), p);
    const ridged = x => { const n = 1 - Math.abs(U.noise1(x)); return n * n * n; };
    for (let i = 0; i < N; i++) {
      const u = -1 + (2 * i) / (N - 1);
      const body = 0.5 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u + 0.02) / 0.98, 1.7)), 1.2);
      let k = Math.max(body,
        pk(u, 0.04, 1.0, 0.46, 0.92),
        pk(u, -0.3, 0.76, 0.34, 0.9),
        pk(u, 0.4, 0.62, 0.32, 0.95),
        pk(u, -0.64, 0.44, 0.3, 1.0),
        pk(u, 0.74, 0.38, 0.3, 1.0));
      const env = clamp(k * 1.6, 0, 1);
      k += env * (0.07 * (ridged(u * 7 + 3.1) - 0.3) + 0.032 * (ridged(u * 19 + 8.7) - 0.3) + 0.012 * U.noise1(u * 53 + 2.2));
      k *= smoothstep(1, 0.8, Math.abs(u));
      pts.push([u, Math.max(0, k)]);
    }
    let si = 0;
    for (let i = 1; i < N; i++) if (pts[i][1] > pts[si][1]) si = i;
    const sk = pts[si][1];
    for (const p of pts) p[1] /= sk;
    const smooth = (w) => pts.map((p, i) => { let s = 0; for (let j = -w; j <= w; j++) s += pts[clamp(i + j, 0, N - 1)][1]; return s / (2 * w + 1); });
    const sm = smooth(4);       // 山上的人走的路
    const sm2 = smooth(2);      // 明暗面的坡向
    const su = pts[si][0];
    // 沟壑：自山脊的谷与一些随意的点，向山脚放射而下
    const gul = [];
    const starts = [];
    for (let i = 3; i < N - 3; i++) if (pts[i][1] < pts[i - 2][1] && pts[i][1] < pts[i + 2][1] && pts[i][1] > 0.15) starts.push(i);
    for (let g = 0; g < 26; g++) starts.push(Math.round(r() * (N - 1)));
    for (const i0 of starts) {
      const k0 = pts[i0][1];
      if (k0 < 0.16) continue;
      const line = [];
      let u = pts[i0][0], k = k0 - 0.012;
      const n = 3 + Math.floor(r() * 3);
      for (let j = 0; j <= n; j++) { line.push([u, k]); u += (u - su) * 0.06 + 0.012 + (r() - 0.5) * 0.03; k -= (0.1 + 0.14 * r()) * k0; if (k < 0.04) break; }
      if (line.length > 1) gul.push(line);
    }
    // 岩层：细短的斜纹
    const ledges = [];
    for (let g = 0; g < 110; g++) {
      const u = -0.92 + 1.84 * r(), i0 = Math.round(((u + 1) / 2) * (N - 1)), k0 = pts[i0][1];
      if (k0 < 0.1) continue;
      ledges.push([u, k0 * (0.12 + 0.8 * r()), 0.01 + 0.035 * r(), (r() - 0.5) * 0.9]);
    }
    return { N, pts, sm, sm2, si, su, gul, ledges };
  })();
  // 扇面的底：自山脊向山脚放射，并略向东北斜
  const baseU = u => u + (u - MT.su) * 0.45 + 0.1;
  const kAt = (u, arr) => {
    const f = clamp((u + 1) / 2, 0, 1) * (MT.N - 1), i = Math.min(MT.N - 2, Math.floor(f));
    const a = arr ? arr[i] : MT.pts[i][1], b = arr ? arr[i + 1] : MT.pts[i + 1][1];
    return lerp(a, b, f - i);
  };
  const U_FOOT = 0.66, U_CLEFT = 0.27;

  // 山的明暗（预渲染）：[光自左, 光自右] 两张——背光的扇面、沟壑、岩层，略加模糊，如水墨的皴
  function buildMasks(m) {
    m.mask = null;
    try {
      const x0 = Math.floor(m.X(-1.02)), x1 = Math.ceil(m.X(1.02)), y0 = Math.floor(m.top - 8), y1 = Math.ceil(m.base + 0.05 * W.h);
      const k = Math.min(1.5, W.dpr || 1), w = x1 - x0, h = y1 - y0;
      if (!(w > 4 && h > 4)) return;
      const out = [];
      for (const dir of [1, -1]) {
        const c = canvas(w * k, h * k), g = c.getContext('2d');
        g.scale(k, k); g.translate(-x0, -y0);
        g.save();
        g.clip(m.body);
        try { g.filter = 'blur(' + (1.4 * Math.max(0.6, W.unit)).toFixed(1) + 'px)'; } catch (e) { /* 无滤镜 */ }
        const yb = m.base + 0.05 * W.h;
        for (let i = 0; i < MT.N - 1; i++) {
          const a = MT.pts[i], b = MT.pts[i + 1];
          const slope = (MT.sm2[i + 1] - MT.sm2[i]) / (b[0] - a[0]);
          const s = clamp(-dir * slope * 0.55, 0, 1);
          if (s < 0.05) continue;
          g.fillStyle = 'rgba(22,12,16,' + (0.72 * s).toFixed(3) + ')';
          g.beginPath();
          g.moveTo(m.X(a[0]) - 0.4, m.Y(a[0], a[1]) - 2); g.lineTo(m.X(b[0]) + 0.4, m.Y(b[0], b[1]) - 2);
          g.lineTo(m.X(baseU(b[0])) + 0.4, yb); g.lineTo(m.X(baseU(a[0])) - 0.4, yb); g.closePath();
          g.fill();
        }
        g.filter = 'none';
        g.lineCap = 'round'; g.lineJoin = 'round';
        g.strokeStyle = 'rgba(24,12,14,0.5)'; g.lineWidth = Math.max(0.8, 1.6 * W.unit); g.stroke(m.gul);
        g.strokeStyle = 'rgba(24,12,14,0.3)'; g.lineWidth = Math.max(0.6, 1.0 * W.unit); g.stroke(m.led);
        // 背光的一侧整体再暗一些（大的体积感）
        const gx = g.createLinearGradient(m.X(-1), 0, m.X(1), 0);
        gx.addColorStop(0, dir > 0 ? 'rgba(20,10,14,0)' : 'rgba(20,10,14,0.28)');
        gx.addColorStop(1, dir > 0 ? 'rgba(20,10,14,0.28)' : 'rgba(20,10,14,0)');
        g.fillStyle = gx; g.fillRect(x0, y0, w, h);
        g.restore();
        out.push({ c, x0, y0, w, h });
      }
      m.mask = out;
    } catch (e) { m.mask = null; }
  }

  let L = null;
  function layout() {
    F = fractions(port());
    const cx = F.mcx * W.w, HW = F.mhw * W.w, top = F.mtop * W.h, base = F.mbase * W.h, hz = W.horizonY + 0.004 * W.h;
    const H = base - top;
    const bot = u => lerp(hz, base, smoothstep(-1, -0.3, u));
    const X = u => cx + u * HW;
    const Y = (u, k) => bot(u) - k * H;
    const m = { cx, HW, top, base, H, X, Y, bot };
    m.sx = X(MT.su); m.sy = Y(MT.su, 1);
    // 山身
    const body = new Path2D();
    MT.pts.forEach((p, i) => { const x = X(p[0]), y = Y(p[0], p[1]); if (i) body.lineTo(x, y); else body.moveTo(x, y); });
    body.lineTo(X(1) + 2, base + 0.03 * W.h); body.lineTo(X(-1) - 2, bot(-1) + 0.01 * W.h); body.closePath();
    m.body = body;
    const gul = new Path2D();
    for (const g of MT.gul) g.forEach((q, i) => { const x = X(q[0]), y = Y(q[0], q[1]); if (i) gul.lineTo(x, y); else gul.moveTo(x, y); });
    m.gul = gul;
    const led = new Path2D();
    for (const q of MT.ledges) { const x = X(q[0]), y = Y(q[0], q[1]), w = q[2] * HW; led.moveTo(x - w, y + q[3] * w * 0.3); led.lineTo(x + w, y - q[3] * w * 0.3); }
    m.led = led;
    // 迎光的山脊：面向左（坡向右升）与面向右
    const rimL = new Path2D(), rimR = new Path2D();
    for (let i = 1; i < MT.N; i++) {
      const a = MT.pts[i - 1], b = MT.pts[i];
      const P = MT.sm2[i] >= MT.sm2[i - 1] ? rimL : rimR;
      P.moveTo(X(a[0]), Y(a[0], a[1])); P.lineTo(X(b[0]), Y(b[0], b[1]));
    }
    m.rimL = rimL; m.rimR = rimR;
    buildMasks(m);
    // 磐石穴（33:22）：主峰东北坡上的一道裂缝
    const ck = kAt(U_CLEFT) - 0.14;
    m.cleft = [X(U_CLEFT), Y(U_CLEFT, ck)];
    L = { w: W.w, h: W.h, m };
    // 营中的帐棚（近地、中丘）
    const r = U.mulberry32(2019);
    L.tentsN = [];
    const nL = port() ? 4 : 6;
    for (let i = 0; i < nL; i++) L.tentsN.push({ x: lerp(F.campL[0], F.campL[1], (i + 0.2 + 0.6 * r()) / nL), w: 1.5 + 0.7 * r(), h: 0.72 + 0.2 * r(), v: 0.02 + 0.1 * r(), s: r(), fire: i % 2 === 0 });
    for (let i = 0; i < 2; i++) L.tentsN.push({ x: lerp(F.campR[0], F.campR[1], (i + 0.3) / 2), w: 1.5 + 0.6 * r(), h: 0.72 + 0.2 * r(), v: 0.02 + 0.06 * r(), s: r(), fire: i === 0 });
    L.tentsN.sort((a, b) => a.v - b.v);
    L.tentsM = [];
    const nM = port() ? 11 : 16;
    for (let i = 0; i < nM; i++) L.tentsM.push({ x: lerp(F.midT[0], F.midT[1], (i + 0.15 + 0.7 * r()) / nM), w: 1.4 + 0.8 * r(), h: 0.7 + 0.25 * r(), s: r(), fire: r() < 0.45 });
    // 界限的白石（中丘上，山脚之前）
    L.bound = [];
    const nb = port() ? 11 : 17;
    for (let i = 0; i < nb; i++) L.bound.push({ x: lerp(port() ? 0.55 : 0.53, 0.99, i / (nb - 1)) + (r() - 0.5) * 0.01, s: 0.8 + 0.4 * r() });
  }
  const lay = () => { if (!L || L.w !== W.w || L.h !== W.h) layout(); return L; };

  // 山上的摩西站在哪里（脚下的像素位置）
  function mPt() {
    const l = lay(), m = l.m;
    if (S.mPos === 'meet') { const x = F.meet * W.w - hp(1) * 0.75; return [x, gY(1, x / W.w)]; }
    if (S.mPos === 'cleft') return [m.cleft[0], m.cleft[1]];
    const u = lerp(U_FOOT, MT.su + 0.004, clamp(W.lv.snClimb, 0, 1));
    return [m.X(u), m.Y(u, kAt(u, MT.sm) * 0.995 + 0.004)];
  }
  function mosesM(b, o) {
    o = o || {};
    const p = mPt();
    add('mosesM', Object.assign({ label: '摩西', sex: 'm', age: 'elder', layer: 1, x: p[0] / W.w, robe: ROBE.moses, glow: 0.55, prop: 'staff', from: b.instant ? 'none' : 'fade' }, o));
    attach('mosesM', () => mPt());
  }

  // ════════════════════════════════════════════════════════════
  //  预渲染的精灵：光晕、云团
  // ════════════════════════════════════════════════════════════
  const SPR = {};
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
  function glowSpr(key, rgb, inner) {
    if (SPR[key]) return SPR[key];
    const c = canvas(64, 64), g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 1));
    gr.addColorStop(inner || 0.3, U.rgba(rgb[0], rgb[1], rgb[2], 0.36));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (SPR[key] = c);
  }
  // 云团：按颜色（量化）缓存；上缘稍亮
  const PUFF = new Map();
  function puff(rgb) {
    const r = q8(rgb[0]), g0 = q8(rgb[1]), b = q8(rgb[2]), key = r + ',' + g0 + ',' + b;
    let c = PUFF.get(key);
    if (c) return c;
    if (PUFF.size > 90) PUFF.clear();
    c = canvas(64, 64);
    const g = c.getContext('2d'), gr = g.createRadialGradient(30, 28, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(Math.min(255, r + 18), Math.min(255, g0 + 18), Math.min(255, b + 18), 0.95));
    gr.addColorStop(0.45, U.rgba(r, g0, b, 0.7));
    gr.addColorStop(0.8, U.rgba(r, g0, b, 0.22));
    gr.addColorStop(1, U.rgba(r, g0, b, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    PUFF.set(key, c);
    return c;
  }
  // 云的滚团：边缘较实，上亮下暗（立体）；按颜色缓存
  const BILLOW = new Map();
  function billow(rgb) {
    const r = q8(rgb[0]), g0 = q8(rgb[1]), b = q8(rgb[2]), key = r + ',' + g0 + ',' + b;
    let c = BILLOW.get(key);
    if (c) return c;
    if (BILLOW.size > 60) BILLOW.clear();
    c = canvas(96, 96);
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(48, 48, 0, 48, 48, 48);
    gr.addColorStop(0, U.rgba(r, g0, b, 1)); gr.addColorStop(0.62, U.rgba(r, g0, b, 0.96)); gr.addColorStop(0.82, U.rgba(r, g0, b, 0.5)); gr.addColorStop(1, U.rgba(r, g0, b, 0));
    g.fillStyle = gr; g.fillRect(0, 0, 96, 96);
    g.globalCompositeOperation = 'source-atop';
    const sh = g.createLinearGradient(0, 10, 0, 90);
    sh.addColorStop(0, 'rgba(255,255,255,0.14)'); sh.addColorStop(0.5, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.28)');
    g.fillStyle = sh; g.fillRect(0, 0, 96, 96);
    BILLOW.set(key, c);
    return c;
  }
  // 一圈细的光环（角声的波）：白里带一点蓝，像声音在空气里荡开
  function ringSpr() {
    if (SPR.ring) return SPR.ring;
    const c = canvas(160, 160), g = c.getContext('2d'), gr = g.createRadialGradient(80, 80, 0, 80, 80, 80);
    gr.addColorStop(0, 'rgba(226,236,255,0)'); gr.addColorStop(0.86, 'rgba(226,236,255,0)'); gr.addColorStop(0.935, 'rgba(236,244,255,1)'); gr.addColorStop(1, 'rgba(226,236,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 160, 160);
    return (SPR.ring = c);
  }
  function beamSpr() {
    if (SPR.beam) return SPR.beam;
    const w = 32, h = 128, c = canvas(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1), vy = Math.min(1, v / 0.1) * Math.min(1, (1 - v) / 0.25);
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1, a = vy * (Math.exp(-hx * hx * 4) * 0.7 + Math.exp(-hx * hx * 30) * 0.3), i = (y * w + x) * 4;
        d[i] = 255; d[i + 1] = 238; d[i + 2] = 200; d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return (SPR.beam = c);
  }
  // 一团光晕：只在这一笔里用 a 作透明度，画完还原（不把透明度漏给后面的线条）
  function glowAt(ctx, spr, x, y, r, a) {
    if (a <= 0.004 || !spr || !(r > 0)) return;
    const ga = ctx.globalAlpha;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = ga;
  }
  // 火舌（坛上、牛犊、营火、山顶、云中的火）
  // 火舌的精灵：一条上尖下圆的舌，自下而上由白而金而赤而透明（预渲染，略加模糊）
  function flameSpr() {
    if (SPR.flame) return SPR.flame;
    const w = 48, h = 128, c = canvas(w, h), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, h, 0, 0);
    gr.addColorStop(0, 'rgba(255,250,226,1)');
    gr.addColorStop(0.22, 'rgba(255,214,120,0.95)');
    gr.addColorStop(0.55, 'rgba(255,128,44,0.75)');
    gr.addColorStop(0.85, 'rgba(210,60,24,0.3)');
    gr.addColorStop(1, 'rgba(160,30,10,0)');
    try { g.filter = 'blur(2px)'; } catch (e) { /* */ }
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(w / 2, 4);
    g.bezierCurveTo(w * 0.62, h * 0.3, w * 0.9, h * 0.55, w * 0.86, h * 0.78);
    g.bezierCurveTo(w * 0.82, h * 0.96, w * 0.18, h * 0.96, w * 0.14, h * 0.78);
    g.bezierCurveTo(w * 0.1, h * 0.55, w * 0.38, h * 0.3, w / 2, 4);
    g.fill();
    return (SPR.flame = c);
  }
  // 一簇火：几条火舌摇曳（坛上、牛犊、营火、山顶）
  function flame(ctx, x, y, h, a, seed) {
    if (a < 0.01 || h < 0.5) return;
    const t = W.t, sp = flameSpr();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('fire', FIRE, 0.25), x, y - h * 0.35, h * 1.5, a * 0.5);
    const n = 3;
    for (let i = 0; i < n; i++) {
      const ph = seed * 7.3 + i * 2.1;
      const fl = 0.78 + 0.16 * Math.sin(t * (8 + i * 2.3) + ph) + 0.08 * Math.sin(t * 17.3 + ph * 3);
      const hh = h * (i === 1 ? 1 : 0.72) * fl, ww = hh * 0.42;
      const ox = (i - 1) * h * 0.2, sway = Math.sin(t * 2.7 + ph) * 0.18;
      ctx.save();
      ctx.globalAlpha = Math.min(1, a * (i === 1 ? 1 : 0.8));
      ctx.translate(x + ox, y); ctx.transform(1, 0, sway, 1, 0, 0);
      ctx.drawImage(sp, -ww / 2, -hh, ww, hh * 1.04);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  西奈山
  // ════════════════════════════════════════════════════════════
  function quakeJ() {
    const q = W.lv.snQuake;
    if (q < 0.02) return [0, 0];
    return [Math.sin(W.t * 37) * 1.8 * q * SU() + Math.sin(W.t * 61) * 0.8 * q, Math.sin(W.t * 29 + 1) * 1.2 * q * SU()];
  }
  function drawMount(ctx) {
    const m = lay().m, j = quakeJ();
    ctx.save();
    ctx.translate(j[0], j[1]);
    const g = ctx.createLinearGradient(0, m.top, 0, m.base);
    g.addColorStop(0, css(GRAN[0], DM)); g.addColorStop(0.5, css(GRAN[1], DM)); g.addColorStop(1, css(GRAN[2], DM + 0.08));
    ctx.fillStyle = g;
    ctx.fill(m.body);
    const fromLeft = litX() < m.sx;
    const day = W.daylight;
    // 明暗（预渲染的皴）
    const mk = m.mask && m.mask[fromLeft ? 0 : 1];
    if (mk) { ctx.globalAlpha = 0.45 + 0.55 * clamp(day * 1.2, 0, 1); ctx.drawImage(mk.c, mk.x0, mk.y0, mk.w, mk.h); ctx.globalAlpha = 1; }
    ctx.save();
    ctx.clip(m.body);
    // 沟壑迎光的一边
    ctx.save();
    ctx.translate((fromLeft ? -1.2 : 1.2) * SU(), 0);
    ctx.strokeStyle = css([240, 200, 166], DM, 0.22 * (0.2 + 0.8 * day), 0.1); ctx.lineWidth = Math.max(0.6, 0.9 * SU());
    ctx.stroke(m.gul);
    ctx.restore();
    // 山脚的雾（大气的厚度）
    const hz = W.haze, gh = ctx.createLinearGradient(0, m.top + m.H * 0.5, 0, m.base);
    gh.addColorStop(0, U.rgba(hz[0], hz[1], hz[2], 0));
    gh.addColorStop(1, U.rgba(hz[0], hz[1], hz[2], 0.38));
    ctx.fillStyle = gh;
    ctx.fillRect(m.X(-1.05), m.top + m.H * 0.5, m.HW * 2.2, m.H * 0.6);
    // 暴风的天下，山是黑的
    const st = W.lv.storm;
    if (st > 0.01) { ctx.fillStyle = U.rgba(14, 12, 20, 0.5 * st); ctx.fill(m.body); }
    // 山顶的火光照在岩上
    const fire = Math.max(W.lv.snFire, W.lv.snName * 0.6);
    if (fire > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      const fl = 0.85 + 0.15 * Math.sin(W.t * 7.3) * Math.sin(W.t * 3.1);
      glowAt(ctx, glowSpr('fireRock', [255, 110, 50], 0.2), m.sx, m.sy + m.H * 0.1, m.HW * 0.6, fire * 0.42 * fl * (0.5 + 0.5 * Math.max(nightK() * 0.6, st)));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 闪电照亮全山
    if (W.flash > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.min(1, W.flash * 0.55);
      ctx.fillStyle = 'rgb(140,150,200)';
      ctx.fill(m.body);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 迎光的山脊
    ctx.strokeStyle = css([255, 220, 184], DM, 0.6 * (0.15 + 0.85 * day) * (1 - 0.7 * st), 0.3);
    ctx.lineWidth = Math.max(0.7, 1.3 * SU());
    ctx.stroke(fromLeft ? m.rimL : m.rimR);
    // 山顶的火照亮上坡的岩脊：一道暖的边光，离火越远越淡
    if (fire > 0.02) {
      const rg = ctx.createRadialGradient(m.sx, m.sy, 0, m.sx, m.sy, m.HW * 0.6);
      rg.addColorStop(0, U.rgba(255, 190, 110, 0.9 * fire));
      rg.addColorStop(0.45, U.rgba(255, 140, 70, 0.4 * fire));
      rg.addColorStop(1, 'rgba(255,120,60,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = rg; ctx.lineWidth = Math.max(1, 2 * SU());
      ctx.stroke(m.rimL); ctx.stroke(m.rimR);
      ctx.lineWidth = Math.max(0.8, 1.2 * SU());
      ctx.stroke(m.gul);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // 蓝宝石的铺地（24:10）：贴着云的底边一道薄薄的、明净的蓝，如同天色（画在云之后，正在云的下缘）
  function drawPave(ctx) {
    const a = W.lv.snPave;
    if (a < 0.01) return;
    const m = lay().m, cx = m.sx + m.HW * 0.03, cy = m.sy + m.H * 0.12, rx = m.HW * 0.55, ry = Math.max(5, W.h * 0.026);
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(1, ry / rx);
    // 中间明净如天，向外化入透明（没有深色的边）
    const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    gr.addColorStop(0, U.rgba(176, 212, 255, 0.9 * a));
    gr.addColorStop(0.35, U.rgba(110, 160, 250, 0.72 * a));
    gr.addColorStop(0.7, U.rgba(90, 140, 240, 0.3 * a));
    gr.addColorStop(1, U.rgba(90, 140, 240, 0));
    ctx.fillStyle = gr;
    ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'lighter';
    const hi = ctx.createRadialGradient(-rx * 0.1, 0, 0, -rx * 0.1, 0, rx * 0.55);
    hi.addColorStop(0, U.rgba(210, 232, 255, 0.4 * a)); hi.addColorStop(1, U.rgba(210, 232, 255, 0));
    ctx.fillStyle = hi;
    ctx.beginPath(); ctx.arc(-rx * 0.1, 0, rx * 0.55, 0, TAU); ctx.fill();
    ctx.restore();
    // 如同天色明净：点点柔和的晶光
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const sp = glowSpr('paveSpark', [226, 240, 255], 0.3);
    for (let i = 0; i < 26; i++) {
      const ux = (rt(i * 3 + 400) - 0.5) * 1.8, uy = (rt(i * 3 + 401) - 0.5) * 1.3;
      if (ux * ux + uy * uy > 0.85) continue;
      const tw = 0.5 + 0.5 * Math.sin(W.t * (1.5 + rt(i + 50) * 2.5) + i);
      glowAt(ctx, sp, cx + ux * rx, cy + uy * ry, (2.5 + 2.5 * rt(i + 90)) * SU(), a * 0.9 * tw);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // 山顶的火（19:18 耶和华在火中降于山上；24:17 形状如烈火）
  // 火冠的高（像素）：随火的程度长高，但不顶进画面上方的按钮一带
  const fireH = (m, f) => Math.max(8, Math.min(m.H * 0.42, m.sy - W.h * 0.05)) * (0.45 + 0.55 * f);
  function drawSummitFire(ctx) {
    const f = W.lv.snFire;
    if (f < 0.01) return;
    const m = lay().m, j = quakeJ(), x = m.sx + j[0], y = m.sy + j[1];
    const R = m.HW * 0.6;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.82 + 0.18 * Math.sin(W.t * 5.3) * Math.sin(W.t * 2.2 + 1);
    glowAt(ctx, glowSpr('sumFire', [255, 110, 44], 0.2), x, y - R * 0.12, R * 0.9, f * 0.3 * fl);
    glowAt(ctx, glowSpr('sumMid', [255, 160, 80], 0.2), x, y - R * 0.1, R * 0.4, f * 0.2 * fl);
    // 火舌：山顶整个在火里——每条火舌的根都在岩脊上（坡上的也是），顶都往上够到峰顶之上，
    // 合起来是一座倒 V 的火，把峰包住（不像蜡泪往下挂）；中间最高，随风略向西（左）斜
    const sp = flameSpr(), hmax = fireH(m, f);
    const cw = m.HW * 0.1, lean = 0.08 + 0.2 * W.lv.gale;
    for (const t of FT) {
      const u = MT.su + (t.p * cw) / m.HW, xx = m.X(u) + j[0], ap = Math.abs(t.p);
      const yy = m.Y(u, kAt(u)) + m.H * 0.012 + j[1];
      const flk = 0.76 + 0.16 * Math.sin(W.t * t.sp + t.ph) + 0.08 * Math.sin(W.t * 13.1 + t.ph * 2.3);
      const topY = y - hmax * t.h * (1 - 0.72 * Math.pow(ap, 1.2)) * flk;
      const h1 = Math.max(4, yy - topY), w1 = Math.min(h1, hmax * 0.8) * t.w;
      ctx.save();
      ctx.globalAlpha = Math.min(1, f * (0.26 + 0.3 * (1 - ap)));
      ctx.translate(xx, yy); ctx.transform(1, 0, lean + Math.sin(W.t * t.sw + t.ph) * 0.14, 1, 0, 0);
      ctx.drawImage(sp, -w1 / 2, -h1, w1, h1 * 1.04);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 火舌的参数（固定的随机：位置、高矮、摇曳的快慢）；外面的先画，中间的在上
  const FT = (function () {
    const r = U.mulberry32(4219), a = [];
    const n = 16;
    for (let i = 0; i < n; i++) a.push({ p: clamp(((i + 0.5) / n) * 2 - 1 + (r() - 0.5) * 0.09, -1, 1), h: 0.7 + 0.3 * r(), ph: r() * TAU, sp: 4.2 + 4.5 * r(), sw: 1.2 + 1.4 * r(), w: 0.26 + 0.12 * r(), b: r() });
    a.sort((p, q) => Math.abs(q.p) - Math.abs(p.p));
    return a;
  })();

  // 山上的密云：暴风时乌黑，内里有火与闪电；平时是明亮的荣耀之云。云压在山顶上，把山顶裹住
  const CAP = (function () {
    const r = U.mulberry32(77), a = [];
    for (let i = 0; i < 26; i++) a.push({ dx: (r() - 0.5) * 2, dy: (r() - 0.6) * 1.3, s: 0.38 + 0.62 * r(), ph: r() * TAU, sp: 0.05 + 0.09 * r() });
    a.sort((p, q) => p.dy - q.dy);
    return a;
  })();
  function cloudCol(dark, depth) {
    const st = clamp(W.lv.storm * 1.25 + dark, 0, 1);
    const base = U.mixRGB([224, 226, 236], [34, 30, 38], st);
    return W.shade(base, depth, 0.06);
  }
  function drawCap(ctx) {
    const c = W.lv.snCloud;
    if (c < 0.01) return;
    const m = lay().m, R = m.HW * (port() ? 0.66 : 0.62), cx = m.sx + m.HW * 0.03, cy = m.sy - m.H * 0.01;
    const fire = W.lv.snFire, st = W.lv.storm;
    const mk = st > 0.3 ? billow : puff;
    const spT = mk(cloudCol(-0.06, 0.28)), spB = mk(cloudCol(0.16, 0.28));
    const warm = fire > 0.02 ? puff(W.shade([255, 128, 64], 0.2, 0.4)) : null;
    const lit = st > 0.3 ? puff(W.shade([150, 150, 164], 0.25, 0.2)) : null;
    const fl = 0.75 + 0.25 * Math.sin(W.t * 4.1) * Math.sin(W.t * 1.7 + 2);
    for (let i = 0; i < CAP.length; i++) {
      const p = CAP[i];
      const x = cx + p.dx * R * (0.78 + 0.22 * c) + Math.sin(W.t * p.sp + p.ph) * R * 0.07;
      const y = cy + p.dy * R * (p.dy < 0 ? 0.3 : 0.46) * (0.75 + 0.25 * c) + Math.cos(W.t * p.sp * 0.8 + p.ph) * R * 0.03;
      const s = R * p.s * (0.7 + 0.3 * c) * (p.dy < -0.3 ? 0.75 : 1);
      ctx.globalAlpha = Math.min(1, c * (st > 0.3 ? 0.78 + 0.22 * p.s : 0.5 + 0.25 * p.s));
      ctx.drawImage(p.dy > 0.05 ? spB : spT, x - s, y - s * 0.6, s * 2, s * 1.2);
      // 云的上缘受天光，下腹被山顶的火照红
      if (lit && p.dy < -0.25) { ctx.globalAlpha = c * st * 0.35; ctx.drawImage(lit, x - s * 0.8, y - s * 0.72, s * 1.6, s * 0.8); }
      if (warm && p.dy > -0.2) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(1, c * fire * fl * 0.42 * (0.5 + p.dy));
        ctx.drawImage(warm, x - s * 0.85, y - s * 0.2, s * 1.7, s * 0.8);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    if (fire > 0.02) glowAt(ctx, glowSpr('capFire', [255, 100, 44], 0.25), cx, m.sy - m.H * 0.02, R * 1.1, c * fire * 0.3 * fl);
    // 闪电在云里亮起
    if (W.flash > 0.02) glowAt(ctx, glowSpr('capFlash', [196, 206, 255], 0.3), cx + Math.sin(W.t * 13) * R * 0.3, cy - R * 0.1, R * 1.3, c * W.flash * 1.1);
    // 荣耀之云：边上一圈金光
    if (W.lv.storm < 0.4) glowAt(ctx, glowSpr('capGold', [255, 226, 160], 0.35), cx, cy, R * 1.0, c * (1 - W.lv.storm * 2.5) * (0.12 + 0.3 * nightK()));
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  // 冒烟如烧窑（19:18）：山顶上一股粗大的烟柱，先直直上腾，再被风吹向西边（左）的天；
  // 烟的底下被火照红，上缘受天光。画在 'air' 层（遍地黑暗之上），不随 W.shade 一同暗下去
  const SMK = (function () {
    const r = U.mulberry32(1918), a = [];
    for (let i = 0; i < 36; i++) a.push({ o: i / 36 + (r() - 0.5) * 0.014, s: 0.78 + 0.44 * r(), sw: r() * TAU, lx: (r() - 0.5), g: 0.85 + 0.3 * r() });
    return a;
  })();
  const SMK_ORD = [];
  function drawSmoke(ctx) {
    const s = W.lv.snSmoke;
    if (s < 0.01) return;
    const m = lay().m, pt = port();
    const y0 = m.sy - fireH(m, Math.max(0.3, W.lv.snFire)) * 0.45;
    const rise = clamp(y0 - W.h * 0.06, m.H * 0.1, m.H * 0.45), drift = (pt ? 0.62 : 0.52) * W.w * (0.85 + 0.3 * W.lv.gale);
    // 画在远景一层（火在它前面）：遍地的黑暗随后会压暗它，先按比例提亮
    const day = clamp(W.daylight * 1.2, 0, 1), lum = Math.min(1.9, (0.55 + 0.45 * day) / (1 - 0.9 * clamp(W.lv.gloom, 0, 0.9))), st = W.lv.storm;
    const bodyC = [118, 106, 102].map(v => Math.min(255, Math.round(v * lum)));
    const hiC = U.mixRGB([200, 192, 188], [160, 162, 176], st).map(v => Math.min(255, Math.round(v * lum)));
    const body = billow(bodyC), hi = puff(hiC), warmS = puff([255, 136, 64]);
    const fireK = W.lv.snFire;
    // 由老到新：老的（高而远）在后，新的（贴着山顶）在前
    SMK_ORD.length = 0;
    for (let i = 0; i < SMK.length; i++) SMK_ORD.push([U.fract(W.t * 0.03 + SMK[i].o), i]);
    SMK_ORD.sort((p, q) => q[0] - p[0]);
    for (const [ph, i] of SMK_ORD) {
      const P = SMK[i];
      const up = U.easeOut(Math.min(1, ph / 0.42));                       // 先上腾
      const w = smoothstep(0.12, 1, ph);                                    // 再西飘
      const y = y0 - up * rise - w * m.H * 0.1 + Math.sin(ph * 5 + P.sw) * m.H * 0.02;
      const x = m.sx + P.lx * m.HW * 0.1 * (1 - w) - Math.pow(w, 1.15) * drift * P.g + Math.sin(ph * 6 + P.sw) * m.HW * 0.05 * ph;
      const r = (0.07 + 0.34 * Math.sqrt(ph)) * m.HW * P.s * (pt ? 0.9 : 1);
      const a = s * Math.min(1, ph * 5) * Math.pow(1 - ph, 1.3) * 0.85;
      if (a < 0.01) continue;
      ctx.globalAlpha = Math.min(1, a);
      ctx.drawImage(body, x - r, y - r * 0.8, r * 2, r * 1.6);
      // 上缘受天光（与闪电）
      if (a > 0.06) {
        ctx.globalAlpha = Math.min(1, a * (0.38 + 0.5 * (W.flash || 0)));
        ctx.drawImage(hi, x - r * 0.78, y - r * 0.92, r * 1.56, r * 0.86);
      }
      // 底下被火照红
      const warm = fireK * Math.pow(Math.max(0, 1 - ph * 1.6), 1.2);
      if (warm > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = Math.min(1, a * warm * 0.5);
        ctx.drawImage(warmS, x - r * 0.8, y - r * 0.12, r * 1.6, r * 0.9);
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.globalAlpha = 1;
  }
  // 角声（视觉）：自山顶荡开的一圈细的光；每一声只一圈，至多两圈同在
  const WAVES = [];
  const WAVE_DUR = 1.5;
  function wave(k, delay) {
    WAVES.push({ t0: W.t + (delay || 0), k: k == null ? 1 : k });
    if (WAVES.length > 2) WAVES.splice(0, WAVES.length - 2);
  }
  function drawWaves(ctx) {
    if (!WAVES.length) return;
    const m = lay().m, sp = ringSpr();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = WAVES.length - 1; i >= 0; i--) {
      const w = WAVES[i], age = W.t - w.t0;
      if (age > WAVE_DUR || age < -1) { WAVES.splice(i, 1); continue; }
      if (age < 0) continue;
      const e = age / WAVE_DUR, R = m.HW * (0.18 + 0.95 * U.easeOut(e)), a = Math.pow(1 - e, 1.5) * Math.min(1, e * 8) * w.k;
      ctx.globalAlpha = Math.min(0.2, 0.2 * a);
      ctx.drawImage(sp, m.sx - R, m.sy - m.H * 0.04 - R * 0.6, R * 2, R * 1.2);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 闪电（本卷自画：自云中劈向山坡或横过天空）：中点位移的折线（约 65 点），根粗梢细，一闪再闪
  const BOLTS = [];
  function zig(x0, y0, x1, y1, levels, rough) {
    let P = [[x0, y0], [x1, y1]], d = Math.hypot(x1 - x0, y1 - y0) * rough;
    for (let l = 0; l < levels; l++) {
      const Q = [P[0]];
      for (let i = 1; i < P.length; i++) {
        const a = P[i - 1], b = P[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, off = rand(-1, 1) * d;
        Q.push([(a[0] + b[0]) / 2 - (dy / len) * off, (a[1] + b[1]) / 2 + (dx / len) * off], b);
      }
      P = Q; d *= 0.55;
    }
    return P;
  }
  function spawnBolt() {
    const m = lay().m, yMin = W.h * 0.14;
    const sx = m.sx + rand(-0.4, 0.4) * m.HW, sy = Math.max(yMin, m.sy + rand(-0.06, 0.04) * m.H);
    const toGround = Math.random() < 0.6;
    const u = toGround ? rand(-0.75, 0.8) : 0;
    let ex = toGround ? m.X(u) : sx + rand(-0.6, 0.6) * m.HW;
    let ey = toGround ? Math.min(m.base - W.h * 0.02, m.Y(u, kAt(u)) + m.H * rand(0.02, 0.2)) : m.sy - rand(0.12, 0.35) * m.H;
    ey = Math.max(yMin, ey);
    ex = clamp(ex, W.w * 0.02, W.w * 0.99);
    const pts = zig(sx, sy, ex, ey, 6, 0.16);
    const br = [];
    const nb = 1 + (Math.random() < 0.6 ? 1 : 0);
    for (let q = 0; q < nb; q++) {
      const k = Math.floor(rand(0.2, 0.6) * pts.length), p0 = pts[k], d = Math.random() < 0.5 ? -1 : 1;
      const len = Math.hypot(ex - sx, ey - sy) * rand(0.2, 0.38);
      const bx = p0[0] + d * len * rand(0.4, 0.8), by = Math.max(yMin, p0[1] + len * rand(0.4, 0.8) * (toGround ? 1 : 0.5));
      br.push(zig(p0[0], p0[1], bx, by, 4, 0.2));
    }
    // 一闪再闪：两三次回击
    const st = [0, rand(0.07, 0.11)];
    if (Math.random() < 0.6) st.push(rand(0.17, 0.24));
    BOLTS.push({ pts, br, t0: W.t, st, ground: toGround });
    W.flash = Math.max(W.flash || 0, rand(0.28, 0.5));
    const dl = rand(0.1, 0.9), t0 = W.t;
    GS.book.after(dl, () => { if (W.t - t0 < 4 && cur()) sfx('thunder', { far: dl > 0.6 }); });
  }
  // 一条折线：根粗梢细（分成几段，逐段收细）
  function taper(ctx, P, w0, w1, col) {
    const n = P.length, seg = 8;
    ctx.strokeStyle = col;
    for (let s0 = 0; s0 < n - 1; s0 += seg) {
      const s1 = Math.min(n - 1, s0 + seg);
      ctx.lineWidth = lerp(w0, w1, (s0 + s1) / 2 / (n - 1));
      ctx.beginPath(); ctx.moveTo(P[s0][0], P[s0][1]);
      for (let i = s0 + 1; i <= s1; i++) ctx.lineTo(P[i][0], P[i][1]);
      ctx.stroke();
    }
  }
  function drawBolts(ctx) {
    if (!BOLTS.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const su = SU();
    for (let i = BOLTS.length - 1; i >= 0; i--) {
      const B = BOLTS[i], age = W.t - B.t0;
      if (age > 0.6 || age < 0) { BOLTS.splice(i, 1); continue; }
      let a = 0;
      for (const s of B.st) if (age >= s) a = Math.max(a, Math.exp(-(age - s) * 16));
      a = Math.max(a, age < B.st[B.st.length - 1] + 0.1 ? 0.18 : 0) * (1 - smoothstep(0.35, 0.6, age));
      if (a < 0.01) continue;
      taper(ctx, B.pts, 9 * su, 3 * su, U.rgba(150, 168, 255, 0.2 * a));
      taper(ctx, B.pts, 2.6 * su, 0.8 * su, U.rgba(242, 246, 255, 0.95 * a));
      for (const P of B.br) {
        taper(ctx, P, 5 * su, 2 * su, U.rgba(150, 168, 255, 0.14 * a));
        taper(ctx, P, 1.3 * su, 0.5 * su, U.rgba(236, 240, 255, 0.7 * a));
      }
      const e = B.pts[B.pts.length - 1];
      if (B.ground) glowAt(ctx, glowSpr('boltEnd', [210, 220, 255], 0.2), e[0], e[1], 36 * su, a * 0.75);
      glowAt(ctx, glowSpr('boltStart', [200, 212, 255], 0.25), B.pts[0][0], B.pts[0][1], 60 * su, a * 0.4);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 遍地黑暗之上，山顶的火仍然照亮（'air' 层：在 weather 的 gloom 之后）
  function drawAirFire(ctx) {
    const g = W.lv.gloom, f = W.lv.snFire;
    if (g < 0.02 || f < 0.02) return;
    const m = lay().m;
    ctx.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(W.t * 5.3) * Math.sin(W.t * 2.2 + 1);
    glowAt(ctx, glowSpr('airFire', [255, 130, 60], 0.22), m.sx, m.sy, m.HW * 0.7, f * g * 1.3 * fl);
    glowAt(ctx, glowSpr('airCore', [255, 236, 190], 0.3), m.sx, m.sy - m.H * 0.02, m.HW * 0.22, f * g * 1.6 * fl);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  营：帐棚、营火、界限、羊群
  // ════════════════════════════════════════════════════════════
  function tentShape(ctx, x, gy, w, h, col, colHi, s) {
    // 山羊毛的黑帐棚：低而宽，三根支杆撑起的两个尖
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, gy);
    ctx.lineTo(x - w * 0.42, gy - h * 0.55);
    ctx.quadraticCurveTo(x - w * 0.3, gy - h * 0.92, x - w * 0.18, gy - h);
    ctx.quadraticCurveTo(x - w * 0.02, gy - h * 0.8, x + w * 0.1, gy - h * 0.95);
    ctx.quadraticCurveTo(x + w * 0.28, gy - h * 0.86, x + w * 0.42, gy - h * 0.55);
    ctx.lineTo(x + w * 0.5, gy);
    ctx.closePath();
    ctx.fill();
    // 门：一块掀起的帘，里面暗
    ctx.fillStyle = 'rgba(12,8,6,0.55)';
    ctx.beginPath();
    const dx = x - w * (0.12 - 0.2 * s);
    ctx.moveTo(dx - w * 0.08, gy); ctx.lineTo(dx - w * 0.05, gy - h * 0.62); ctx.lineTo(dx + w * 0.07, gy - h * 0.6); ctx.lineTo(dx + w * 0.1, gy); ctx.closePath();
    ctx.fill();
    // 织纹的横条
    ctx.strokeStyle = colHi; ctx.lineWidth = Math.max(0.5, h * 0.05);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.4, gy - h * 0.5); ctx.quadraticCurveTo(x, gy - h * 0.62, x + w * 0.4, gy - h * 0.5);
    ctx.stroke();
  }
  function drawTents(ctx, layer) {
    const l = lay(), H = hp(layer), list = layer === 2 ? l.tentsN : l.tentsM, d = DEP(layer);
    const col = css(TENT, d), hi = css(TENT_HI, d, 0.8);
    for (const t of list) {
      if (layer === 2 && W.lv.snRaise > 0.01 && t.x > F.court[0] - 0.02 && t.x < F.court[1] + 0.02) continue;
      const x = t.x * W.w, gy = layer === 2 ? fieldY(t.x, t.v) : gY(1, t.x);
      const k = layer === 2 ? 1 + t.v * 0.35 : 1;
      tentShape(ctx, x, gy + 1, H * t.w * k, H * t.h * k, col, hi, t.s);
    }
  }
  // 营火：夜里帐棚前的一点火
  function drawCampFires(ctx, layer) {
    const k = W.lv.snFires * clamp(W.night * 1.3 + W.dusk * 0.4, 0, 1);
    if (k < 0.02) return;
    const l = lay(), H = hp(layer), list = layer === 2 ? l.tentsN : l.tentsM;
    for (let i = 0; i < list.length; i++) {
      const t = list[i];
      if (!t.fire) continue;
      if (layer === 2 && W.lv.snRaise > 0.01 && t.x > F.court[0] - 0.02 && t.x < F.court[1] + 0.02) continue;
      const x = (t.x + (layer === 2 ? 0.022 : 0.012)) * W.w, gy = layer === 2 ? fieldY(t.x, t.v + 0.08) : gY(1, t.x + 0.012);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, glowSpr('camp', [255, 170, 90], 0.2), x, gy - H * 0.1, H * 1.4, k * 0.4);
      ctx.globalCompositeOperation = 'source-over';
      flame(ctx, x, gy, H * 0.22, k * 0.9, i * 1.3 + layer);
    }
    ctx.globalAlpha = 1;
  }
  // 山四围的界限（19:12）：中丘上的一列白石，夜里微微发光，石与石之间一道细的光线
  function drawBound(ctx) {
    const b = W.lv.snBound;
    if (b < 0.01) return;
    const l = lay(), H = hp(1), n = l.bound.length, d = DEP(1);
    const pts = [];
    const Z = 1.8;   // 白石要看得见：比一个人的脚踝高
    for (let i = 0; i < n; i++) {
      const s = l.bound[i], k = clamp(b * n - i, 0, 1);
      if (k <= 0) break;
      const x = s.x * W.w, y = gY(1, s.x) + 1, z = s.s * Z;
      pts.push([x, y - H * 0.1 * z]);
      ctx.fillStyle = css(STONE, d, k, 0.08);
      ctx.beginPath(); ctx.ellipse(x, y - H * 0.02 * z, H * 0.11 * z, H * 0.12 * z, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = css([248, 244, 232], d, k * 0.85, 0.3);
      ctx.beginPath(); ctx.ellipse(x - H * 0.025 * z, y - H * 0.09 * z, H * 0.05 * z, H * 0.028 * z, 0, 0, TAU); ctx.fill();
    }
    if (pts.length > 1) {
      const glow = 0.35 + 0.35 * nightK() + 0.3 * W.lv.snQuake;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 230, 176, clamp(glow * b, 0, 0.75));
      ctx.lineWidth = Math.max(0.8, 1.1 * SU());
      ctx.beginPath();
      pts.forEach((p, i) => { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); });
      ctx.stroke();
      const gs = glowSpr('bnd', [255, 230, 180], 0.25);
      for (const p of pts) glowAt(ctx, gs, p[0], p[1], H * 0.42, glow * b * 0.55);
      // 界限正在定下时：一点亮光沿着石线往山那边走
      if (b < 0.999) { const p = pts[pts.length - 1]; glowAt(ctx, gs, p[0], p[1], H * 1.1, 0.9); }
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  光的鹰（19:4）
  // ════════════════════════════════════════════════════════════
  const EAGLE_DUR = 12.5;
  function eaglePath(e) {
    const m = lay().m, pt = port();
    const P0 = pt ? [-0.16 * W.w, 0.42 * W.h] : [-0.1 * W.w, 0.26 * W.h];
    const P1 = pt ? [0.3 * W.w, 0.64 * W.h] : [0.34 * W.w, 0.56 * W.h];
    const P2 = pt ? [0.58 * W.w, 0.44 * W.h] : [0.6 * W.w, 0.3 * W.h];
    const P3 = [m.sx, m.sy - (pt ? 0.05 : 0.07) * W.h];
    const u = 1 - e, a = u * u * u, b = 3 * u * u * e, c = 3 * u * e * e, d = e * e * e;
    const x = a * P0[0] + b * P1[0] + c * P2[0] + d * P3[0], y = a * P0[1] + b * P1[1] + c * P2[1] + d * P3[1];
    const tx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * e * (P2[0] - P1[0]) + 3 * e * e * (P3[0] - P2[0]);
    const ty = 3 * u * u * (P1[1] - P0[1]) + 6 * u * e * (P2[1] - P1[1]) + 3 * e * e * (P3[1] - P2[1]);
    return [x, y, Math.atan2(ty, tx)];
  }
  const eagleE = age => { const f = clamp(age / EAGLE_DUR, 0, 1); return U.easeInOut(f) * 0.55 + f * 0.45; };
  // 展翅的鹰（自下仰望）：宽大的双翼，翼尖分开的长羽，扇形的尾；身是光
  function drawEagle(ctx) {
    const age = W.t - S.eagleT0;
    if (age < 0 || age > EAGLE_DUR + 2.5) return;
    const e = eagleE(age);
    const [x, y, ang] = eaglePath(e);
    const a = Math.min(1, age / 1.2) * (age > EAGLE_DUR ? Math.max(0, 1 - (age - EAGLE_DUR) / 2.5) : 1);
    const span = (port() ? 0.34 : 0.15) * W.w * (1 - 0.45 * smoothstep(0.7, 1, e));
    const beat = age < 5 ? 1 : age < 9 ? 0.35 : 0.7;               // 先振翅，后滑翔，将到山顶时再振几下
    const lift = Math.sin(age * 2.3) * 0.55 * beat;
    const dir = Math.cos(ang) >= 0 ? 1 : -1, s = span / 2;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('eagle', [255, 226, 170], 0.18), x, y, span * 0.8, a * 0.6);
    ctx.globalAlpha = clamp(a * 0.6, 0, 1);      // 鹰身整体再淡一层（光的鹰，不是实的鸟）
    ctx.translate(x, y);
    ctx.rotate(clamp(ang * dir, -0.6, 0.6) * 0.35 * dir);
    const fillC = U.rgba(255, 232, 190, 0.5 * a), edgeC = U.rgba(255, 250, 232, 0.95 * a);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1, s * 0.018);
    for (const side of [-1, 1]) {
      const L1 = lift * (1 - 0.1 * side);
      const wx = side * s * 0.5, wy = -s * (0.2 + 0.36 * L1);        // 腕
      const tx = side * s, ty = -s * (0.1 + 0.7 * L1);               // 翼尖
      ctx.beginPath();
      ctx.moveTo(side * s * 0.07, -s * 0.08);
      ctx.quadraticCurveTo(side * s * 0.26, -s * (0.2 + 0.2 * L1), wx, wy);
      ctx.quadraticCurveTo(side * s * 0.78, ty - s * 0.08, tx, ty);
      // 长羽（手指）
      for (let f = 0; f < 5; f++) {
        const k = f / 4, fx = tx - side * s * (0.02 + 0.13 * k), fy = ty + s * (0.02 + 0.14 * k);
        ctx.lineTo(fx + side * s * 0.1, fy + s * 0.03);
        ctx.lineTo(fx - side * s * 0.02, fy + s * 0.06);
      }
      ctx.quadraticCurveTo(side * s * 0.52, wy + s * 0.34, side * s * 0.34, s * (0.16 - 0.12 * L1));
      ctx.quadraticCurveTo(side * s * 0.18, s * 0.2, side * s * 0.06, s * 0.12);
      ctx.closePath();
      ctx.fillStyle = fillC; ctx.fill();
      ctx.strokeStyle = edgeC; ctx.stroke();
      // 翼上的羽纹
      ctx.strokeStyle = U.rgba(255, 244, 214, 0.45 * a);
      ctx.beginPath();
      for (let f = 0; f < 4; f++) { const k = (f + 1) / 5; ctx.moveTo(side * s * (0.12 + 0.1 * k), -s * 0.02); ctx.lineTo(lerp(side * s * 0.2, tx - side * s * 0.1, k), lerp(s * 0.05, ty + s * 0.12, k)); }
      ctx.stroke();
      ctx.lineWidth = Math.max(1, s * 0.018);
    }
    // 尾
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, s * 0.16); ctx.lineTo(-s * 0.13, s * 0.4); ctx.quadraticCurveTo(0, s * 0.46, s * 0.13, s * 0.4); ctx.lineTo(s * 0.05, s * 0.16); ctx.closePath();
    ctx.fillStyle = fillC; ctx.fill(); ctx.strokeStyle = edgeC; ctx.stroke();
    // 身、头、喙（朝飞去的方向）
    ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.075, s * 0.2, 0, 0, TAU);
    ctx.fillStyle = U.rgba(255, 240, 210, 0.75 * a); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(dir * s * 0.02, -s * 0.2, s * 0.058, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(dir * s * 0.06, -s * 0.22); ctx.lineTo(dir * s * 0.12, -s * 0.19); ctx.lineTo(dir * s * 0.06, -s * 0.17); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  两块光的法版（20:1–17）：字一行一行写上（直行，自右而左）
  // ════════════════════════════════════════════════════════════
  const WORDS = ['除了我以外你不可有别的神', '不可为自己雕刻偶像', '不可妄称耶和华你神的名', '当记念安息日守为圣日', '当孝敬父母',
    '不可杀人', '不可奸淫', '不可偷盗', '不可作假见证陷害人', '不可贪恋人的房屋'];
  const FONT = '"GS Kai", "GS Brush", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  let fontsReady = 0;
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('24px "GS Kai"', WORDS.join('')).then(() => { fontsReady++; TXT.clear(); }).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => { fontsReady++; TXT.clear(); }).catch(() => {});
      }
    } catch (e) { /* 老浏览器：用系统字 */ }
  }
  const TXT = new Map();
  function tabGeom() {
    const T0 = F.tab, tw = T0.w * W.w, th = (T0.y1 - T0.y0) * W.h, gap = T0.gap * W.w, cx = T0.cx * W.w;
    const arch = tw * 0.32;
    return { tw, th, arch, y0: T0.y0 * W.h, cy: (T0.y0 + T0.y1) / 2 * W.h, cx,
      xs: [cx + gap / 2, cx - gap / 2 - tw],           // [右版的左缘, 左版的左缘]
      pad: tw * 0.1 };
  }
  function tabPath(ctx, x, y, w, h, arch) {
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + arch);
    ctx.bezierCurveTo(x, y - arch * 0.28, x + w, y - arch * 0.28, x + w, y + arch);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }
  // 一块版上的字（预渲染）：side 0 = 右版（一至五），1 = 左版（六至十）
  function tabText(side, G) {
    const dpr = Math.min(2, W.dpr || 1), key = side + '|' + Math.round(G.tw) + '|' + Math.round(G.th) + '|' + dpr;
    let c = TXT.get(key);
    if (c) return c;
    c = canvas(G.tw * dpr, G.th * dpr);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    const colW = (G.tw - 2 * G.pad) / 5, top = G.arch * 0.75 + G.pad * 0.4, avail = G.th - top - G.pad * 0.8;
    const fs = Math.max(6, Math.min(colW * 0.8, avail / 12.2));
    g.font = Math.round(fs) + 'px ' + FONT;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const ends = [];
    for (let j = 0; j < 5; j++) {
      const word = WORDS[side * 5 + j], x = G.tw - G.pad - (j + 0.5) * colW;
      const chars = Array.from(word), step = Math.min(fs * 1.02, avail / chars.length);
      ends.push(top + chars.length * step + fs * 0.2);
      chars.forEach((ch, i) => {
        const y = top + (i + 0.5) * step;
        g.shadowColor = 'rgba(255,190,110,0.9)'; g.shadowBlur = fs * 0.5;
        g.fillStyle = 'rgba(255,236,196,1)';
        g.fillText(ch, x, y);
        g.shadowBlur = 0;
        g.fillStyle = 'rgba(255,252,240,1)';
        g.fillText(ch, x, y);
      });
    }
    c._colW = colW; c._top = top; c._fs = fs; c._ends = ends;
    if (TXT.size > 12) TXT.clear();
    TXT.set(key, c);
    return c;
  }
  // 法版的去处：天上 → 山顶摩西的手中
  function handPt(id) {
    const p = fig(id);
    if (!p || !(p._h > 0)) return null;
    return [p._x + (p.facing || 1) * p._h * 0.17, p._y - p._h * 0.56, p._h];
  }
  function drawTablets(ctx) {
    const a0 = W.lv.snTab;
    if (a0 < 0.01) return;
    const G = tabGeom(), d = clamp(W.lv.snTabDown, 0, 1);
    let sc = 1, dx = 0, dy = 0;
    if (d > 0) {
      const hpt = handPt('mosesM') || [lay().m.sx, lay().m.sy - 10, hp(1)];
      const e = U.easeInOut(d);
      const endS = (hpt[2] * 0.22) / G.th;
      sc = lerp(1, endS, e);
      dx = lerp(0, hpt[0] - G.cx, e);
      dy = lerp(0, hpt[1] - G.cy, e);
    }
    const a = a0 * (1 - smoothstep(0.86, 1, d));
    if (a < 0.01) return;
    ctx.save();
    ctx.translate(G.cx + dx, G.cy + dy); ctx.scale(sc, sc); ctx.translate(-G.cx, -G.cy);
    // 身后的光
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('tabGlow', [255, 214, 160], 0.3), G.cx, G.cy, G.th * 1.05, a * 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const lw = Math.max(1, 1.6 * SU());
    for (let side = 0; side < 2; side++) {
      const x = G.xs[side], y = G.y0;
      const gr = ctx.createLinearGradient(x, y, x, y + G.th);
      gr.addColorStop(0, U.rgba(250, 244, 228, 0.42 * a));
      gr.addColorStop(0.5, U.rgba(206, 218, 250, 0.3 * a));
      gr.addColorStop(1, U.rgba(150, 172, 236, 0.24 * a));
      tabPath(ctx, x, y, G.tw, G.th, G.arch);
      ctx.fillStyle = gr; ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 200, 120, 0.22 * a); ctx.lineWidth = lw * 5; ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = U.rgba(255, 234, 186, 0.95 * a); ctx.lineWidth = lw;
      ctx.stroke();
      // 字：每一行按写下的时刻自上而下显出
      const txt = tabText(side, G), dpr = txt.width / G.tw;
      for (let j = 0; j < 5; j++) {
        const i = side * 5 + j;
        if (i >= S.tabN) continue;
        const f = clamp((W.t - S.writeT[i]) / 2.4, 0, 1);
        if (f <= 0) continue;
        const cx0 = G.tw - G.pad - (j + 1) * txt._colW, cw = txt._colW, end = Math.min(G.th, txt._ends[j]);
        const hh = f < 1 ? txt._top + f * (end - txt._top) : G.th;
        ctx.globalAlpha = a;
        ctx.drawImage(txt, cx0 * dpr, 0, cw * dpr, hh * dpr, x + cx0, y, cw, hh);
        if (f < 1) {
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, glowSpr('pen', [255, 240, 200], 0.2), x + cx0 + cw / 2, y + hh - txt._fs * 0.35, txt._fs * 1.5, a);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  // 手中的石版（小）：摩西拿着；新的石版写上字时有一道金光
  function drawHeld(ctx, id, depth) {
    const hpt = handPt(id);
    if (!hpt) return;
    const p = fig(id);
    const al = p ? clamp(p.alpha == null ? 1 : p.alpha, 0, 1) : 1;
    if (al < 0.02) return;
    const h = hpt[2] * 0.24, w = h * 0.62, x = hpt[0], y = hpt[1];
    ctx.globalAlpha = al;
    for (let k = 0; k < 2; k++) {
      const xx = x - w * 0.62 + k * w * 0.5, yy = y - h * 0.55 + k * 1;
      tabPath(ctx, xx, yy, w, h, w * 0.32);
      ctx.fillStyle = css(k ? [200, 192, 178] : [182, 174, 160], depth);
      ctx.fill();
      ctx.strokeStyle = css([96, 88, 80], depth, 0.8); ctx.lineWidth = Math.max(0.5, h * 0.04); ctx.stroke();
      const lit = Math.max(0.35 * nightK() + 0.25, clamp(1 - (W.t - S.litT0) / 8, 0, 1));
      ctx.strokeStyle = U.rgba(255, 220, 150, lit * 0.8);
      ctx.lineWidth = Math.max(0.5, h * 0.035);
      ctx.beginPath();
      for (let c = 0; c < 4; c++) { const cxl = xx + w * (0.2 + c * 0.2); ctx.moveTo(cxl, yy + h * 0.3); ctx.lineTo(cxl, yy + h * 0.88); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  山上指示的样式（25–31）：金线画出的帐幕与器具
  // ════════════════════════════════════════════════════════════
  // 每件：盒 [x0,y0,x1,y1]（占样式区域的比例）与折线（盒内 0..1）
  function arcPts(cx, cy, rx, ry, a0, a1, n) { const out = []; for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return out; }
  const PAT = [
    { id: 'tent', box: [0.64, 0.02, 1.0, 0.5], lines: (function () {
      const L0 = [[[0, 1], [0, 0.28], [1, 0.28], [1, 1], [0, 1]], [[0, 0.28], [0.08, 0.1], [1.0, 0.1], [1, 0.28]]];
      for (let i = 1; i < 10; i++) L0.push([[i / 10, 0.3], [i / 10, 1]]);
      L0.push([[0, 0.62], [1, 0.62]]);
      const loops = []; for (let i = 0; i <= 12; i++) loops.push([i / 12, 0.28 + (i % 2 ? 0.05 : 0)]);
      L0.push(loops);
      L0.push([[0.32, 0.3], [0.32, 1]]);
      return L0;
    })() },
    { id: 'ark', box: [0.24, 0.1, 0.62, 0.55], lines: [
      [[0.18, 1], [0.18, 0.6], [0.82, 0.6], [0.82, 1], [0.18, 1]],
      [[0.14, 0.6], [0.86, 0.6]],
      [[0.0, 0.82], [1.0, 0.82]],
      // 二基路伯：跪在施恩座两头，翅膀高张，相遇于中间
      [[0.2, 0.6], [0.22, 0.42], [0.26, 0.36], [0.3, 0.42], [0.32, 0.6]],
      [[0.8, 0.6], [0.78, 0.42], [0.74, 0.36], [0.7, 0.42], [0.68, 0.6]],
      [[0.26, 0.38], [0.3, 0.12], [0.42, 0.02], [0.5, 0.08]],
      [[0.74, 0.38], [0.7, 0.12], [0.58, 0.02], [0.5, 0.08]],
      [[0.26, 0.42], [0.36, 0.26], [0.47, 0.2]],
      [[0.74, 0.42], [0.64, 0.26], [0.53, 0.2]],
    ] },
    { id: 'table', box: [0.26, 0.64, 0.44, 0.98], lines: [
      [[0.05, 0.45], [0.95, 0.45]], [[0.12, 0.45], [0.12, 1]], [[0.88, 0.45], [0.88, 1]], [[0.12, 0.75], [0.88, 0.75]],
      [[0.2, 0.44], [0.2, 0.1], [0.42, 0.1], [0.42, 0.44]], [[0.2, 0.22], [0.42, 0.22]], [[0.2, 0.33], [0.42, 0.33]],
      [[0.58, 0.44], [0.58, 0.1], [0.8, 0.1], [0.8, 0.44]], [[0.58, 0.22], [0.8, 0.22]], [[0.58, 0.33], [0.8, 0.33]],
    ] },
    { id: 'altar', box: [0.66, 0.6, 0.85, 0.98], lines: [
      [[0.1, 1], [0.1, 0.3], [0.9, 0.3], [0.9, 1], [0.1, 1]],
      [[0.1, 0.3], [0.04, 0.12], [0.18, 0.3]], [[0.9, 0.3], [0.96, 0.12], [0.82, 0.3]],
      [[0.1, 0.62], [0.9, 0.62]], [[0.1, 0.62], [0.3, 1]], [[0.3, 0.62], [0.5, 1]], [[0.5, 0.62], [0.7, 1]], [[0.7, 0.62], [0.9, 1]],
    ] },
    { id: 'laver', box: [0.87, 0.66, 1.0, 0.98], lines: [
      arcPts(0.5, 0.2, 0.46, 0.22, 0, Math.PI, 12), [[0.04, 0.2], [0.96, 0.2]], [[0.5, 0.42], [0.5, 0.86]], [[0.2, 1], [0.5, 0.86], [0.8, 1]],
    ] },
    { id: 'lamp', box: [0.0, 0.06, 0.22, 0.6], lines: (function () {
      const L0 = [[[0.5, 0.1], [0.5, 0.94]], [[0.24, 1], [0.5, 0.92], [0.76, 1]]];
      for (let k = 1; k <= 3; k++) {
        const w = 0.14 * k;
        L0.push(arcPts(0.5, 0.1, w, 0.13 * k + 0.12, 0, Math.PI, 10).map(q => [q[0], Math.min(q[1], 0.1 + 0.13 * k + 0.12)]));
      }
      for (let k = 0; k < 7; k++) { const x = 0.5 + (k - 3) * 0.14; L0.push([[x - 0.035, 0.1], [x, 0.06], [x + 0.035, 0.1]]); }
      return L0;
    })() },
    { id: 'gems', box: [0.02, 0.64, 0.18, 0.98], lines: [[[0.1, 0.02], [0.9, 0.02], [0.9, 0.98], [0.1, 0.98], [0.1, 0.02]], [[0.1, 0.02], [0.3, -0.12]], [[0.9, 0.02], [0.7, -0.12]]] },
    { id: 'incense', box: [0.48, 0.66, 0.62, 0.98], lines: [
      [[0.25, 1], [0.25, 0.45], [0.75, 0.45], [0.75, 1], [0.25, 1]], [[0.25, 0.45], [0.2, 0.33], [0.3, 0.45]], [[0.75, 0.45], [0.8, 0.33], [0.7, 0.45]], [[0.2, 0.52], [0.8, 0.52]],
    ] },
  ];
  const GEMS = [[224, 62, 72], [236, 188, 96], [200, 44, 64], [70, 184, 112], [64, 106, 224], [232, 238, 255],
    [232, 142, 66], [196, 170, 146], [156, 96, 210], [112, 206, 204], [206, 126, 96], [120, 176, 122]];
  function patRect() {
    const P0 = F.pat;
    return [P0.x0 * W.w, P0.y0 * W.h, P0.x1 * W.w, P0.y1 * W.h];
  }
  function drawPolyPart(ctx, pts, map, f) {
    // 画出折线的前 f（按长度）
    let len = 0;
    const P = pts.map(map);
    for (let i = 1; i < P.length; i++) len += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
    let left = len * f;
    ctx.moveTo(P[0][0], P[0][1]);
    for (let i = 1; i < P.length && left > 0; i++) {
      const sl = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      if (sl <= left) { ctx.lineTo(P[i][0], P[i][1]); left -= sl; }
      else { const k = left / sl; ctx.lineTo(lerp(P[i - 1][0], P[i][0], k), lerp(P[i - 1][1], P[i][1], k)); left = 0; }
    }
  }
  function drawPattern(ctx) {
    const a0 = W.lv.snPattern;
    if (a0 < 0.01) return;
    const R = patRect(), rw = R[2] - R[0], rh = R[3] - R[1];
    const pulse = clamp(1 - (W.t - S.patGlowT0) / 5, 0, 1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('patGlow', [255, 210, 150], 0.35), (R[0] + R[2]) / 2, (R[1] + R[3]) / 2, Math.max(rw, rh) * 0.65, a0 * (0.14 + 0.2 * pulse));
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let k = 0; k < Math.min(S.patN, PAT.length); k++) {
      const P = PAT[k], f = clamp((W.t - S.patT[k]) / 3.2, 0, 1);
      if (f <= 0) continue;
      const bx = R[0] + (P.box[0] + P.box[2]) / 2 * rw, by = R[1] + (P.box[1] + P.box[3]) / 2 * rh, rr = Math.max((P.box[2] - P.box[0]) * rw, (P.box[3] - P.box[1]) * rh) * 0.75;
      glowAt(ctx, glowSpr('patPiece', [255, 204, 130], 0.3), bx, by, rr, a0 * f * 0.22);
    }
    for (let pass = 0; pass < 2; pass++) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = pass ? U.rgba(255, 236, 190, 0.78 * a0) : U.rgba(255, 184, 100, (0.12 + 0.08 * pulse) * a0);
      ctx.lineWidth = pass ? Math.max(1, 1.7 * SU()) : Math.max(3, 6 * SU());
      ctx.beginPath();
      for (let k = 0; k < PAT.length; k++) {
        if (k >= S.patN) break;
        const P = PAT[k];
        const f = clamp((W.t - S.patT[k]) / 3.2, 0, 1);
        if (f <= 0) continue;
        const bx = R[0] + P.box[0] * rw, by = R[1] + P.box[1] * rh, bw = (P.box[2] - P.box[0]) * rw, bh = (P.box[3] - P.box[1]) * rh;
        const map = q => [bx + q[0] * bw, by + q[1] * bh];
        const n = P.lines.length;
        for (let i = 0; i < n; i++) {
          const fi = clamp(f * n - i * 0.6, 0, 1);
          if (fi <= 0) continue;
          drawPolyPart(ctx, P.lines[i], map, fi);
        }
      }
      ctx.stroke();
    }
    // 灯台的七盏灯（27:20 使灯常常点着）
    const iLamp = 5, Pl = PAT[5];
    if (S.patN > iLamp && S.lampLit) {
      const bx = R[0] + Pl.box[0] * rw, by = R[1] + Pl.box[1] * rh, bw = (Pl.box[2] - Pl.box[0]) * rw, bh = (Pl.box[3] - Pl.box[1]) * rh;
      for (let k = 0; k < 7; k++) {
        const x = bx + (0.5 + (k - 3) * 0.14) * bw, y = by + 0.05 * bh;
        const fl = 0.8 + 0.2 * Math.sin(W.t * 8 + k * 1.3);
        glowAt(ctx, glowSpr('lampF', [255, 200, 110], 0.25), x, y, bw * 0.12, a0 * fl);
      }
    }
    // 胸牌的十二块宝石（28:17–21）
    const g = W.lv.snGems;
    if (g > 0.01 && S.patN > 6) {
      const Pg = PAT[6], bx = R[0] + Pg.box[0] * rw, by = R[1] + Pg.box[1] * rh, bw = (Pg.box[2] - Pg.box[0]) * rw, bh = (Pg.box[3] - Pg.box[1]) * rh;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
        const k = r * 3 + c, col = GEMS[k];
        const x = bx + (0.27 + c * 0.23) * bw, y = by + (0.15 + r * 0.23) * bh;
        const tw = 0.75 + 0.25 * Math.sin(W.t * 2.2 + k);
        glowAt(ctx, glowSpr('gem' + k, col, 0.35), x, y, Math.min(bw, bh) * 0.16, g * a0 * tw);
      }
    }
    // 香坛上的烟（30:7–8）
    ctx.globalAlpha = 1;
    if (S.incense && S.patN > 7) {
      const Pi = PAT[7], bx = R[0] + Pi.box[0] * rw, by = R[1] + Pi.box[1] * rh, bw = (Pi.box[2] - Pi.box[0]) * rw, bh = (Pi.box[3] - Pi.box[1]) * rh;
      ctx.lineWidth = Math.max(1, 2 * SU());
      for (let i = 0; i < 18; i++) {
        const t0 = i / 18, t1 = (i + 1) / 18;
        const X0 = bx + bw * (0.5 + 0.22 * t0 * Math.sin(t0 * 6 - W.t * 1.3)), Y0 = by + bh * 0.4 - t0 * bh * 1.25;
        const X1 = bx + bw * (0.5 + 0.22 * t1 * Math.sin(t1 * 6 - W.t * 1.3)), Y1 = by + bh * 0.4 - t1 * bh * 1.25;
        ctx.strokeStyle = U.rgba(255, 236, 214, 0.5 * a0 * (1 - t0));
        ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(X1, Y1); ctx.stroke();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  山下的坛与十二根柱子（24:4）
  // ════════════════════════════════════════════════════════════
  function drawAltarPillars(ctx) {
    const a = W.lv.snAltar, A = clamp(W.lv.snAltarA, 0, 1);
    if (a < 0.01 || A < 0.01) return;
    const H = hp(2), n = 12;
    ctx.globalAlpha = A;
    const items = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1), x = lerp(F.pil[0], F.pil[1], f), v = 0.03 + 0.1 * Math.sin(f * Math.PI) * (i % 2 ? 0.6 : 1);
      items.push({ i, x, v, k: clamp(a * (n + 1) - i, 0, 1) });
    }
    items.sort((p, q) => p.v - q.v);
    for (const it of items) {
      if (it.k <= 0) continue;
      const x = it.x * W.w, gy = fieldY(it.x, it.v), s = 1 + it.v * 0.35, h = H * (0.8 + 0.18 * rt(it.i + 300)) * s * it.k, w = H * 0.16 * s;
      ctx.fillStyle = css(STONE, 0);
      ctx.beginPath();
      ctx.moveTo(x - w / 2, gy); ctx.lineTo(x - w * 0.46, gy - h + w * 0.3); ctx.quadraticCurveTo(x, gy - h - w * 0.2, x + w * 0.46, gy - h + w * 0.3); ctx.lineTo(x + w / 2, gy); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = css([100, 94, 86], 0, 0.5);
      const sd = litX() > x ? -1 : 1;
      ctx.fillRect(x + (sd > 0 ? 0 : -w / 2), gy - h + w * 0.3, w / 2, h - w * 0.3);
    }
    // 坛：未凿的石头垒成
    const ax = F.altar * W.w, gy = fieldY(F.altar, 0.1), aw = H * 0.9;
    const ak = clamp(a * 1.6, 0, 1);
    ctx.fillStyle = css(ROCK, 0, ak);
    ctx.beginPath();
    for (let i = 0; i < 9; i++) {
      const row = i < 4 ? 0 : i < 7 ? 1 : 2, col = row === 0 ? i : row === 1 ? i - 4 : i - 7, nrow = [4, 3, 2][row];
      const x = ax + (col - (nrow - 1) / 2) * aw * 0.24, y = gy - aw * (0.08 + row * 0.15), r = aw * 0.13;
      ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.8, 0, 0, TAU);
    }
    ctx.fill();
    // 燔祭的火与烟（金牛犊之后熄了）
    const fire = clamp((a - 0.85) / 0.15, 0, 1) * clamp(W.lv.snAltarF, 0, 1) * A;
    if (fire > 0.01) {
      flame(ctx, ax, gy - aw * 0.42, H * 0.45, fire, 11);
      for (let i = 0; i < 6; i++) {
        const ph = U.fract(W.t * 0.08 + i / 6), y = gy - aw * 0.5 - ph * H * 3.2, x = ax + Math.sin(ph * 5 + i) * H * 0.2 + ph * H * 0.8;
        const r = H * (0.15 + 0.4 * ph);
        ctx.globalAlpha = fire * 0.35 * (1 - ph);
        ctx.drawImage(puff(W.shade([200, 196, 190], 0.1)), x - r, y - r, r * 2, r * 2);
      }
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  金牛犊（32:4）；摔碎的法版（32:19）
  // ════════════════════════════════════════════════════════════
  const CALF_PED = 0.45, CALF_S = 1.0, CALF_DIR = -1;   // 石座的高、牛犊的大小（人的身高为 1）；头朝左边拜它的众人
  function drawCalf(ctx) {
    const a = W.lv.snCalf, fire = W.lv.snCalfFire;
    const ash = S.calf === 'burnt' ? 1 : 0;
    const H = hp(2), x = F.calf * W.w, gy = fieldY(F.calf, 0.06), ph = H * CALF_PED, pw = H * 0.46;
    if (ash && a < 0.5) {
      ctx.fillStyle = css([60, 56, 52], 0, 0.7);
      ctx.beginPath(); ctx.ellipse(x, gy - H * 0.02, H * 0.4, H * 0.07, 0, 0, TAU); ctx.fill();
    }
    if (a < 0.01 && fire < 0.01) return;
    // 石座：垒高的一块方石
    const pa = Math.max(a, ash);
    ctx.fillStyle = css(ROCK, 0, pa);
    ctx.fillRect(x - pw, gy - ph, pw * 2, ph);
    ctx.fillStyle = css([90, 84, 76], 0, 0.6 * pa);
    ctx.fillRect(x - pw, gy - H * 0.09, pw * 2, H * 0.09);
    ctx.fillStyle = css([70, 64, 60], 0, 0.35 * pa);
    ctx.fillRect(x + (litX() > x ? -pw : 0), gy - ph, pw, ph);
    ctx.fillStyle = css([176, 168, 154], 0, 0.8 * pa, 0.1);
    ctx.fillRect(x - pw * 1.06, gy - ph - H * 0.02, pw * 2.12, H * 0.045);
    if (a > 0.01) {
      const by = gy - ph - H * 0.01, s = H * CALF_S;
      ctx.save();
      // 假的金光（浓而病的黄）
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, glowSpr('calfHalo', [236, 186, 70], 0.25), x, by - s * 0.65, s * 1.9, a * (0.6 + 0.15 * nightK()));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = a;
      ctx.translate(x, by); ctx.scale(CALF_DIR, 1);
      const gg = ctx.createLinearGradient(0, -s * 1.0, 0, 0);
      gg.addColorStop(0, css([255, 222, 128], 0, 1, 0.35)); gg.addColorStop(0.55, css([228, 170, 70], 0, 1, 0.25)); gg.addColorStop(1, css([176, 118, 40], 0, 1, 0.15));
      ctx.fillStyle = gg;
      // 身：背略拱，腹略收
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.66);
      ctx.bezierCurveTo(-s * 0.46, -s * 0.86, s * 0.2, -s * 0.9, s * 0.42, -s * 0.8);
      ctx.bezierCurveTo(s * 0.54, -s * 0.74, s * 0.52, -s * 0.52, s * 0.4, -s * 0.46);
      ctx.bezierCurveTo(s * 0.1, -s * 0.4, -s * 0.3, -s * 0.42, -s * 0.46, -s * 0.48);
      ctx.closePath(); ctx.fill();
      // 腿（上粗下细）
      ctx.beginPath();
      for (const lx of [-0.38, -0.24, 0.24, 0.37]) {
        const x0 = lx * s;
        ctx.moveTo(x0 - s * 0.055, -s * 0.52); ctx.lineTo(x0 + s * 0.055, -s * 0.52); ctx.lineTo(x0 + s * 0.035, 0); ctx.lineTo(x0 - s * 0.035, 0); ctx.closePath();
      }
      ctx.fill();
      // 颈与头
      ctx.beginPath();
      ctx.moveTo(s * 0.3, -s * 0.82); ctx.quadraticCurveTo(s * 0.46, -s * 1.02, s * 0.6, -s * 1.08); ctx.lineTo(s * 0.76, -s * 1.02);
      ctx.quadraticCurveTo(s * 0.84, -s * 0.92, s * 0.78, -s * 0.84); ctx.lineTo(s * 0.62, -s * 0.8); ctx.quadraticCurveTo(s * 0.5, -s * 0.62, s * 0.4, -s * 0.52); ctx.closePath(); ctx.fill();
      // 角与尾
      ctx.strokeStyle = css([255, 228, 150], 0, 1, 0.35); ctx.lineWidth = Math.max(0.9, s * 0.04); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s * 0.6, -s * 1.07); ctx.quadraticCurveTo(s * 0.52, -s * 1.24, s * 0.64, -s * 1.28);
      ctx.moveTo(s * 0.68, -s * 1.06); ctx.quadraticCurveTo(s * 0.74, -s * 1.22, s * 0.86, -s * 1.2); ctx.stroke();
      ctx.lineWidth = Math.max(0.7, s * 0.025);
      ctx.beginPath(); ctx.moveTo(-s * 0.48, -s * 0.7); ctx.quadraticCurveTo(-s * 0.62, -s * 0.52, -s * 0.57, -s * 0.28); ctx.stroke();
      // 背上的高光与一道滑过的亮光
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = U.rgba(255, 240, 190, 0.45 * a); ctx.lineWidth = Math.max(0.8, s * 0.03);
      ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.8); ctx.bezierCurveTo(-s * 0.2, -s * 0.88, s * 0.14, -s * 0.88, s * 0.34, -s * 0.82); ctx.stroke();
      const sw = U.fract(W.t * 0.18);
      ctx.fillStyle = U.rgba(255, 246, 210, 0.55 * a * Math.sin(sw * Math.PI));
      ctx.beginPath(); ctx.ellipse(lerp(-0.5, 0.6, sw) * s, -s * 0.66, s * 0.05, s * 0.2, 0.3, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (fire > 0.01) for (let i = -1; i <= 1; i++) flame(ctx, x + i * H * 0.3, gy - ph, H * (1.25 - Math.abs(i) * 0.3), fire, 20 + i);
  }
  function drawShards(ctx) {
    if (!S.shards) return;
    const H = hp(2), x0 = S.shardX * W.w;
    for (let i = 0; i < 9; i++) {
      const xf = S.shardX + (rt(i + 500) - 0.5) * 0.05, x = xf * W.w, gy = fieldY(xf, 0.05 + rt(i + 520) * 0.12);
      const s = H * (0.05 + 0.06 * rt(i + 540)), rot = rt(i + 560) * TAU;
      ctx.save(); ctx.translate(x, gy - s * 0.3); ctx.rotate(rot);
      ctx.fillStyle = css([190, 182, 168], 0);
      ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(-s * 0.2, -s * 0.8); ctx.lineTo(s, -s * 0.2); ctx.lineTo(s * 0.4, s * 0.5); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    const age = W.t - S.shatterT0;
    if (age >= 0 && age < 3) {
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, glowSpr('shatter', [255, 230, 180], 0.2), x0, fieldY(S.shardX, 0.08) - H * 0.3, H * 2.2 * (0.6 + age * 0.3), (1 - age / 3) * 0.8);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  会幕与云柱（33:7–11）；磐石穴与经过的荣耀（33:18–23）
  // ════════════════════════════════════════════════════════════
  function drawMeet(ctx) {
    const a = W.lv.snMeet;
    if (a < 0.01) return;
    const H = hp(1), x = F.meet * W.w, gy = gY(1, F.meet) + 1, d = DEP(1);
    ctx.globalAlpha = a;
    tentShape(ctx, x, gy, H * 1.9, H * 1.05, css(TENT_M, d), css([196, 178, 150], d, 0.8), 0.1);
    ctx.globalAlpha = 1;
  }
  // 云柱：从天上降下（bottom 随程度下降）；上端在天上渐渐显出（不从画面顶上截断）；夜里云中有火
  function column(ctx, x, yTop, yBot, w, a, fireK, seed) {
    if (a < 0.01 || yBot <= yTop) return;
    const hgt = yBot - yTop, n = Math.max(8, Math.round(hgt / (w * 0.45))), fadeH = W.h * 0.15;
    const col = W.shade(U.mixRGB([244, 242, 246], [206, 204, 214], 0.3), 0.15, 0.25);
    const sp = puff(col);
    const P = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1), ph = W.t * 0.35 + i * 1.7 + seed;
      const y = yBot - f * hgt, xx = x + Math.sin(ph * 0.5) * w * 0.06 + Math.sin(f * 3 + W.t * 0.15) * w * 0.05;
      const r = w * (0.7 + 0.1 * Math.sin(ph) + (f > 0.7 ? (f - 0.7) * 1.2 : 0));
      const top = smoothstep(0, 1, clamp((y - yTop) / fadeH, 0, 1));
      P.push([xx, y, r, f, top]);
      ctx.globalAlpha = Math.min(1, a * (0.62 - 0.3 * Math.max(0, f - 0.7)) * top);
      ctx.drawImage(sp, xx - r, y - r * 0.8, r * 2, r * 1.6);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('colGold', [255, 236, 190], 0.35), x, yBot - w * 0.3, w * 2, a * (0.18 + 0.12 * nightK()));
    if (fireK > 0.02) {
      // 夜间，云中有火（40:38）：云团自里面被照暖（下半更盛），里面几条缓缓的火舌
      const fl = 0.85 + 0.15 * Math.sin(W.t * 2.3 + seed);
      const warm = puff([255, 150, 70]);
      for (const q of P) {
        const k = a * fireK * (0.34 + 0.14 * Math.sin(W.t * 1.7 + q[3] * 9 + seed)) * (1 - 0.55 * q[3]) * q[4] * fl;
        if (k < 0.01) continue;
        ctx.globalAlpha = Math.min(1, k);
        ctx.drawImage(warm, q[0] - q[2] * 0.75, q[1] - q[2] * 0.6, q[2] * 1.5, q[2] * 1.2);
      }
      // 几条又高又柔的火舌，都从云柱的根上（帐幕的顶上）升起，在云里慢慢摇
      const fsp = flameSpr(), fmax = Math.max(0, yBot - yTop - fadeH * 0.7);
      for (let k = 0; k < 5; k++) {
        const fh = Math.min(fmax, hgt * (0.3 + 0.08 * k)) * (0.86 + 0.14 * Math.sin(W.t * (0.9 + 0.23 * k) + k * 2.1 + seed)), fw = w * (0.5 + 0.12 * (k % 3));
        if (fh < 4) continue;
        ctx.save();
        ctx.globalAlpha = Math.min(1, a * fireK * (0.17 - 0.02 * k));
        ctx.translate(x + (k - 2) * w * 0.11 + Math.sin(W.t * 0.5 + k * 1.9 + seed) * w * 0.07, yBot - w * 0.05);
        ctx.transform(1, 0, Math.sin(W.t * 0.7 + k * 1.3) * 0.06, 1, 0, 0);
        ctx.drawImage(fsp, -fw / 2, -fh, fw, fh);
        ctx.restore();
      }
      // 火的光落在底下（帐幕的顶上）
      glowAt(ctx, glowSpr('colFire', [255, 140, 60], 0.25), x, yBot, w * 2.2, a * fireK * 0.36 * fl);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawPillarM(ctx) {
    const a = W.lv.snPillarM;
    if (a < 0.01) return;
    const H = hp(1), x = F.meet * W.w + H * 0.25, gy = gY(1, F.meet) - H * 0.2, yTop = W.h * 0.08;
    const bot = lerp(yTop, gy, clamp(a * 1.1, 0, 1));
    column(ctx, x, yTop, bot, Math.max(H * 1.8, 0.03 * W.w), a, W.night * 0.8, 3.1);
  }
  function drawCleft(ctx) {
    const c = W.lv.snCleft, h = W.lv.snHand;
    const m = lay().m, x = m.cleft[0], y = m.cleft[1], H = hp(1);
    if (c > 0.01) {
      ctx.fillStyle = css([26, 18, 20], DM, 0.85 * c);
      ctx.beginPath();
      ctx.moveTo(x - H * 0.22, y + H * 0.06);
      ctx.lineTo(x - H * 0.3, y - H * 0.5); ctx.lineTo(x - H * 0.14, y - H * 1.05); ctx.lineTo(x - H * 0.06, y - H * 1.4);
      ctx.lineTo(x + H * 0.08, y - H * 1.02); ctx.lineTo(x + H * 0.26, y - H * 0.55); ctx.lineTo(x + H * 0.24, y + H * 0.06);
      ctx.closePath(); ctx.fill();
    }
    if (h > 0.01) {
      // 神的手遮掩（只是一片温柔的暗，边上一线金光）
      const R = m.HW * 0.2;
      ctx.save();
      ctx.translate(x, y - H * 0.6); ctx.scale(1, 1.25);
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      gr.addColorStop(0, U.rgba(10, 8, 14, 0.7 * h)); gr.addColorStop(0.55, U.rgba(10, 8, 14, 0.45 * h)); gr.addColorStop(1, U.rgba(10, 8, 14, 0));
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }
  const PASS_DUR = 6.5;
  // 荣耀经过（33:22）：一团极亮而柔的光，自西南越过山面、经过磐石穴，往东北去；身后拖着金色的余光
  function drawPassing(ctx) {
    const age = W.t - S.passT0;
    if (age < 0 || age > PASS_DUR + 12) return;
    const m = lay().m, c = m.cleft;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const pathP = e => [lerp(m.X(-0.95), m.X(1.2), e), lerp(c[1] - m.H * 0.22, c[1] - m.H * 0.32, e) - Math.sin(e * Math.PI) * m.H * 0.1];
    if (age < PASS_DUR + 1.5) {
      const e = U.easeInOut(clamp(age / PASS_DUR, 0, 1)), a = Math.sin(clamp(age / (PASS_DUR + 1.5), 0, 1) * Math.PI);
      for (let k = 7; k >= 0; k--) {
        const ek = Math.max(0, e - k * 0.035), p = pathP(ek), ak = a * (1 - k / 8);
        glowAt(ctx, glowSpr('passTrail', [255, 214, 150], 0.3), p[0], p[1], m.HW * (0.5 - k * 0.03), ak * 0.35);
      }
      const p = pathP(e);
      ctx.save();
      ctx.translate(p[0], p[1]); ctx.scale(1.9, 0.8);
      glowAt(ctx, glowSpr('passWide', [255, 226, 170], 0.3), 0, 0, m.HW * 0.55, a * 0.6);
      glowAt(ctx, glowSpr('passCore', [255, 250, 236], 0.35), 0, 0, m.HW * 0.2, a * 0.85);
      ctx.restore();
      ctx.globalAlpha = 1;
      // 几道光芒
      const bs = beamSpr();
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI + W.t * 0.2 + 0.26;
        ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang);
        ctx.globalAlpha = a * 0.28;
        ctx.drawImage(bs, -m.HW * 0.035, -m.HW * 0.7, m.HW * 0.07, m.HW * 1.4);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 36; i++) {
        const f = rt(i + 800), q = pathP(Math.max(0, e - f * 0.3));
        const xx = q[0] + (rt(i + 840) - 0.5) * m.HW * 0.5, yy = q[1] + (rt(i + 860) - 0.5) * m.H * 0.4;
        ctx.fillStyle = U.rgba(255, 238, 200, a * (1 - f) * 0.8);
        const sz = (1 + 2 * rt(i + 880)) * SU();
        ctx.fillRect(xx - sz / 2, yy - sz / 2, sz, sz);
      }
    }
    // 只见其背：光过去之后，东北的天边一片渐退的暖光
    if (age > PASS_DUR * 0.75) {
      const b = clamp((age - PASS_DUR * 0.75) / 2, 0, 1) * clamp(1 - (age - PASS_DUR - 2) / 9, 0, 1);
      if (b > 0.01) {
        const x0 = m.X(0.55), gr = ctx.createLinearGradient(x0, 0, W.w + 20, 0);
        gr.addColorStop(0, 'rgba(255,206,140,0)'); gr.addColorStop(1, U.rgba(255, 206, 140, 0.32 * b));
        ctx.fillStyle = gr;
        ctx.fillRect(x0, m.top - m.H * 0.4, W.w + 20 - x0, m.H * 1.3);
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  礼物与做成的物件（35–39）；帐幕立起（40）
  // ════════════════════════════════════════════════════════════
  const PARTS = [
    { id: 'boards', f: 0.02, v: 0.34, t0: 0.06, gone: 0.28 },
    { id: 'rolls', f: 0.2, v: 0.46, t0: 0.18, gone: 0.52 },
    { id: 'ark', f: 0.38, v: 0.38, t0: 0.32, gone: 0.62 },
    { id: 'table', f: 0.52, v: 0.46, t0: 0.46, gone: 0.63 },
    { id: 'lamp', f: 0.64, v: 0.36, t0: 0.58, gone: 0.65 },
    { id: 'altar', f: 0.8, v: 0.44, t0: 0.72, gone: 0.95 },
    { id: 'laver', f: 0.97, v: 0.36, t0: 0.86, gone: 0.97 },
  ];
  function drawGifts(ctx) {
    const a = W.lv.snGifts;
    if (a < 0.01) return;
    const H = hp(2), x = F.gift * W.w, gy = fieldY(F.gift, 0.3);
    ctx.globalAlpha = a;
    const cols = [GOLD, SILVER, BRONZE, BLUE, PURPLE, SCARLET, LINEN];
    for (let i = 0; i < 16; i++) {
      const xx = x + (rt(i + 600) - 0.5) * H * 1.3 * (1 - (i / 16) * 0.5), yy = gy - (i / 16) * H * 0.4 - rt(i + 620) * H * 0.08;
      const c = cols[i % cols.length], r = H * (0.07 + 0.05 * rt(i + 640));
      ctx.fillStyle = css(c, 0, 1, 0.1);
      ctx.beginPath(); ctx.ellipse(xx, yy, r * 1.4, r, 0, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) {
      const tw = Math.max(0, Math.sin(W.t * (1.3 + rt(i + 660)) + i * 2));
      glowAt(ctx, glowSpr('glint', [255, 240, 200], 0.15), x + (rt(i + 680) - 0.5) * H * 1.1, gy - rt(i + 690) * H * 0.4, H * 0.25, a * tw * 0.9);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function drawPartsLaid(ctx) {
    const pa = W.lv.snParts, r = W.lv.snRaise;
    if (pa < 0.01) return;
    const H = hp(2);
    for (const P of PARTS) {
      const k = clamp((pa - P.t0) / 0.1, 0, 1) * (1 - clamp((r - P.gone + 0.05) / 0.05, 0, 1));
      if (k <= 0.01) continue;
      const xf = lerp(F.parts[0], F.parts[1], P.f), x = xf * W.w, gy = fieldY(xf, P.v), s = H * (1 + P.v * 0.35);
      ctx.globalAlpha = k;
      switch (P.id) {
        case 'boards':
          for (let i = 0; i < 6; i++) { ctx.fillStyle = css(i % 2 ? GOLD : [214, 170, 80], 0, 1, 0.08); ctx.fillRect(x - s * 0.45, gy - s * 0.06 * (i + 1), s * 0.9, s * 0.055); }
          break;
        case 'rolls': {
          const cs = [BLUE, PURPLE, SCARLET, LINEN];
          for (let i = 0; i < 4; i++) { ctx.fillStyle = css(cs[i], 0, 1, 0.05); ctx.beginPath(); ctx.ellipse(x - s * 0.3 + i * s * 0.2, gy - s * 0.09, s * 0.09, s * 0.09, 0, 0, TAU); ctx.fill(); }
          ctx.fillStyle = css([140, 120, 110], 0); ctx.fillRect(x - s * 0.42, gy - s * 0.2, s * 0.84, s * 0.03);
          break;
        }
        case 'ark':
          ctx.fillStyle = css(GOLD, 0, 1, 0.2);
          ctx.fillRect(x - s * 0.24, gy - s * 0.26, s * 0.48, s * 0.26);
          ctx.fillStyle = css([252, 222, 140], 0, 1, 0.3);
          ctx.fillRect(x - s * 0.27, gy - s * 0.3, s * 0.54, s * 0.05);
          ctx.strokeStyle = css([200, 150, 60], 0); ctx.lineWidth = Math.max(0.8, s * 0.025);
          ctx.beginPath(); ctx.moveTo(x - s * 0.45, gy - s * 0.12); ctx.lineTo(x + s * 0.45, gy - s * 0.12);
          ctx.moveTo(x - s * 0.2, gy - s * 0.3); ctx.quadraticCurveTo(x - s * 0.12, gy - s * 0.52, x - s * 0.02, gy - s * 0.42);
          ctx.moveTo(x + s * 0.2, gy - s * 0.3); ctx.quadraticCurveTo(x + s * 0.12, gy - s * 0.52, x + s * 0.02, gy - s * 0.42);
          ctx.stroke();
          ctx.globalCompositeOperation = 'lighter';
          glowAt(ctx, glowSpr('arkG', [255, 220, 150], 0.25), x, gy - s * 0.3, s * 0.6, k * 0.35);
          ctx.globalCompositeOperation = 'source-over';
          break;
        case 'table':
          ctx.fillStyle = css(GOLD, 0, 1, 0.12);
          ctx.fillRect(x - s * 0.22, gy - s * 0.28, s * 0.44, s * 0.04);
          ctx.fillRect(x - s * 0.19, gy - s * 0.25, s * 0.035, s * 0.25); ctx.fillRect(x + s * 0.155, gy - s * 0.25, s * 0.035, s * 0.25);
          ctx.fillStyle = css([226, 204, 160], 0);
          for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) ctx.fillRect(x - s * 0.15 + i * s * 0.17, gy - s * 0.31 - j * s * 0.035, s * 0.13, s * 0.03);
          break;
        case 'lamp': {
          ctx.strokeStyle = css(GOLD, 0, 1, 0.2); ctx.lineWidth = Math.max(0.9, s * 0.028); ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy - s * 0.62); ctx.moveTo(x - s * 0.1, gy); ctx.lineTo(x + s * 0.1, gy);
          for (let b = 1; b <= 3; b++) { const w = s * 0.07 * b; ctx.moveTo(x - w, gy - s * 0.62); ctx.quadraticCurveTo(x - w, gy - s * (0.62 - 0.1 * b - 0.08), x, gy - s * (0.62 - 0.1 * b - 0.1)); ctx.quadraticCurveTo(x + w, gy - s * (0.62 - 0.1 * b - 0.08), x + w, gy - s * 0.62); }
          ctx.stroke();
          break;
        }
        case 'altar':
          ctx.fillStyle = css(BRONZE, 0, 1, 0.05);
          ctx.fillRect(x - s * 0.26, gy - s * 0.32, s * 0.52, s * 0.32);
          ctx.fillStyle = css([140, 92, 50], 0);
          ctx.fillRect(x - s * 0.26, gy - s * 0.18, s * 0.52, s * 0.04);
          ctx.beginPath(); ctx.moveTo(x - s * 0.26, gy - s * 0.32); ctx.lineTo(x - s * 0.3, gy - s * 0.4); ctx.lineTo(x - s * 0.2, gy - s * 0.32); ctx.moveTo(x + s * 0.26, gy - s * 0.32); ctx.lineTo(x + s * 0.3, gy - s * 0.4); ctx.lineTo(x + s * 0.2, gy - s * 0.32); ctx.fill();
          break;
        case 'laver':
          ctx.fillStyle = css(BRONZE, 0, 1, 0.1);
          ctx.beginPath(); ctx.ellipse(x, gy - s * 0.26, s * 0.18, s * 0.08, 0, 0, Math.PI); ctx.fill();
          ctx.fillRect(x - s * 0.03, gy - s * 0.24, s * 0.06, s * 0.2);
          ctx.beginPath(); ctx.ellipse(x, gy - s * 0.02, s * 0.12, s * 0.03, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = U.rgba(200, 220, 240, 0.6 * k); ctx.fillRect(x - s * 0.16, gy - s * 0.27, s * 0.32, s * 0.012);
          break;
      }
    }
    ctx.globalAlpha = 1;
  }
  // 帐幕（侧面）：院子的细麻帷子与柱子在前，帐幕在后（上半露出帷子之上）
  function tabGeomT() {
    const H = hp(2), port0 = port();
    const c0 = F.court[0] * W.w, c1 = F.court[1] * W.w, t0 = F.tent[0] * W.w, t1 = F.tent[1] * W.w;
    const tentH = Math.min(H * 2, (t1 - t0) * (port0 ? 0.66 : 0.56)), fenceH = H * 0.98;
    return { H, c0, c1, t0, t1, tentH, fenceH };
  }
  function drawTabernacle(ctx) {
    const r = W.lv.snRaise;
    if (r < 0.005) return;
    const G = tabGeomT(), H = G.H, back = H * 0.16;   // 帐幕在院子里稍远：底边略高
    const yb = gY(2, (G.t0 + G.t1) / 2 / W.w) - back;   // 帐幕的底：一条平线
    const gyAt = () => yb;
    const nB = 14, step = (r - 0.06) / 0.24;
    const glory = W.lv.snGlory, gl = 0.3 * glory;
    const t0 = G.t0, t1 = G.t1, L0 = t1 - t0, top = yb - G.tentH;
    const dX = L0 * 0.13, dY = G.tentH * 0.16;              // 纵深：后缘向左上退——看得见东头（门）与顶
    const fromL = litX() < (t0 + t1) / 2;
    const fr = fromL ? 0 : 0.06, en = fromL ? 0.1 : -0.1;   // 正面、东头的明暗（随光的方向）
    // 银座（带卯的座）
    const nS = clamp(Math.floor((r / 0.08) * nB), 0, nB);
    for (let i = 0; i < nS; i++) {
      const x = lerp(t0, t1, (i + 0.5) / nB);
      ctx.fillStyle = css(SILVER, 0, 1, 0.15 + gl);
      ctx.fillRect(x - H * 0.06, yb - H * 0.07, H * 0.12, H * 0.07);
    }
    // 板（包金的皂荚木）
    const nb = clamp(Math.floor(step * nB), 0, nB);
    for (let i = 0; i < nb; i++) {
      const x0 = lerp(t0, t1, i / nB), x1 = lerp(t0, t1, (i + 1) / nB);
      ctx.fillStyle = css(i % 2 ? GOLD : [222, 178, 86], 0, 1, 0.1 + gl);
      ctx.fillRect(x0 + 0.5, top, x1 - x0 - 1, G.tentH - H * 0.06);
    }
    // 闩
    const bars = clamp((r - 0.28) / 0.06, 0, 1);
    if (bars > 0) {
      ctx.strokeStyle = css([252, 216, 120], 0, bars, 0.2); ctx.lineWidth = Math.max(0.8, H * 0.03);
      ctx.beginPath();
      for (const f of [0.3, 0.55, 0.8]) { const y = yb - G.tentH * f; ctx.moveTo(t0, y); ctx.lineTo(lerp(t0, t1, bars), y); }
      ctx.stroke();
    }
    const cov = clamp((r - 0.34) / 0.18, 0, 1), door = clamp((r - 0.5) / 0.06, 0, 1);
    const eq = k => [t0 - dX * k, -dY * k];                // 东头上的一点：k = 0 前角 → 1 后角
    // 东头（门）：先是里面的暗，挂上门帘（蓝色、紫色、朱红色线，细麻），上面是折过来的山羊毛（26:9）
    const endK = Math.max(clamp(cov * 5, 0, 1), nb >= nB ? 0.001 : 0);
    if (endK > 0.001) {
      ctx.globalAlpha = endK;
      ctx.fillStyle = css([34, 26, 24], 0, 0.9, 0.02 + gl);
      ctx.beginPath(); ctx.moveTo(t0, top); ctx.lineTo(t0 - dX, top - dY); ctx.lineTo(t0 - dX, yb - dY); ctx.lineTo(t0, yb); ctx.closePath(); ctx.fill();
      if (door > 0) {
        const cs = [BLUE, PURPLE, SCARLET, LINEN];
        for (let k = 0; k < 4; k++) {
          const a = eq(k / 4), b = eq((k + 1) / 4), yTop = top + G.tentH * 0.1;
          ctx.fillStyle = css(cs[k], 0, door, 0.12 + en + gl);
          ctx.beginPath();
          ctx.moveTo(a[0], yTop + a[1]); ctx.lineTo(b[0], yTop + b[1]);
          ctx.lineTo(b[0], lerp(yTop, yb, door) + b[1]); ctx.lineTo(a[0], lerp(yTop, yb, door) + a[1]);
          ctx.closePath(); ctx.fill();
        }
      }
      if (cov > 0) {
        ctx.fillStyle = css(GOATHAIR, 0, 1, en + gl);
        ctx.beginPath(); ctx.moveTo(t0 + H * 0.01, top - H * 0.01); ctx.lineTo(t0 - dX, top - dY - H * 0.01);
        ctx.lineTo(t0 - dX, top - dY + G.tentH * 0.12);
        ctx.quadraticCurveTo(t0 - dX * 0.5, top - dY * 0.5 + G.tentH * 0.18, t0 + H * 0.01, top + G.tentH * 0.12);
        ctx.closePath(); ctx.fill();
      }
      // 五根包金的柱子
      ctx.strokeStyle = css(GOLD, 0, 0.9, 0.12 + en + gl); ctx.lineWidth = Math.max(0.7, H * 0.022);
      ctx.beginPath();
      for (let k = 0; k <= 4; k++) { const q = eq(k / 4); ctx.moveTo(q[0], yb + q[1]); ctx.lineTo(q[0], top + q[1] + (cov > 0 ? G.tentH * 0.12 : 0)); }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // 罩棚与顶盖：山羊毛的幔子（最长，垂到板的下段，下缘一幅一幅成弧）、染红的公羊皮、海狗皮（在最上）。
    // 自东（左）往西盖过去；顶在各板之间微微下垂；正面有几道柔软的褶
    if (cov > 0) {
      const xe = lerp(t0, t1, cov), sag = H * 0.035, hem = yb - G.tentH * 0.15;
      const sup = [t0];
      for (let k = 1; k < 6; k++) { const xx = t0 + (L0 * k) / 6; if (xx < xe - 2) sup.push(xx); }
      sup.push(xe);
      const edge = P => { P.moveTo(t0, top); for (let i = 1; i < sup.length; i++) P.quadraticCurveTo((sup[i - 1] + sup[i]) / 2, top + sag * 2, sup[i], top); };
      const skirt = (yh, amp, n, x1) => {
        const P = new Path2D();
        edge(P);
        P.quadraticCurveTo(x1 + (x1 - xe) * 0.3, top + (yh - top) * 0.25, x1, yh);
        const xa0 = t0 - H * 0.02;
        for (let i = n; i > 0; i--) { const xa = lerp(xa0, x1, i / n), xb = lerp(xa0, x1, (i - 1) / n); P.quadraticCurveTo((xa + xb) / 2, yh + amp, xb, yh); }
        P.closePath();
        return P;
      };
      const nGoat = Math.max(2, Math.round((xe - t0) / (L0 / 11)));          // 十一幅山羊毛的幔子
      const goat = skirt(hem, H * 0.06, nGoat, xe + H * 0.03);
      const ram = skirt(top + G.tentH * 0.5, H * 0.03, Math.max(2, Math.round(nGoat / 2)), xe + H * 0.02);
      const tach = skirt(top + G.tentH * 0.44, H * 0.025, Math.max(2, Math.round(nGoat / 3)), xe + H * 0.015);
      ctx.fillStyle = css(GOATHAIR, 0, 1, fr + gl); ctx.fill(goat);
      ctx.fillStyle = css(RAMRED, 0, 1, fr + gl); ctx.fill(ram);
      ctx.fillStyle = css(TACHASH, 0, 1, fr + 0.03 + gl); ctx.fill(tach);
      // 褶：横向明暗相间的柔带；上受天光，下渐暗
      ctx.save();
      ctx.clip(goat);
      const fg = ctx.createLinearGradient(t0, 0, t1, 0), nF = 7;
      for (let i = 0; i <= nF * 2; i++) fg.addColorStop(clamp(i / (nF * 2) + (rt(i + 960) - 0.5) * 0.045, 0, 1), i % 2 ? U.rgba(255, 236, 214, 0.04 + 0.05 * rt(i + 990)) : U.rgba(8, 4, 2, 0.1 + 0.1 * rt(i + 980)));
      ctx.fillStyle = fg; ctx.fillRect(t0 - H * 0.1, top - H * 0.05, xe - t0 + H * 0.2, hem - top + H * 0.15);
      const vg = ctx.createLinearGradient(0, top, 0, hem + H * 0.06);
      vg.addColorStop(0, 'rgba(255,236,210,0.16)'); vg.addColorStop(0.3, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(6,4,2,0.3)');
      ctx.fillStyle = vg; ctx.fillRect(t0 - H * 0.1, top - H * 0.05, xe - t0 + H * 0.2, hem - top + H * 0.15);
      ctx.restore();
      // 顶：一窄条（看得见顶上的皮），前缘在各板之间下垂；横过顶的暗线是底下的板
      const roof = new Path2D();
      edge(roof);
      roof.lineTo(xe - dX, top - dY); roof.lineTo(t0 - dX, top - dY); roof.closePath();
      ctx.fillStyle = css(TACHASH, 0, 1, 0.12 + gl); ctx.fill(roof);
      ctx.strokeStyle = css([70, 58, 52], 0, 0.35); ctx.lineWidth = Math.max(0.5, H * 0.012);
      ctx.beginPath();
      for (let i = 1; i < sup.length - 1; i++) { ctx.moveTo(sup[i], top); ctx.lineTo(sup[i] - dX, top - dY); }
      ctx.stroke();
      const rimP = new Path2D(); edge(rimP);
      ctx.strokeStyle = css([226, 214, 196], 0, 0.55, 0.1 + gl); ctx.lineWidth = Math.max(0.6, H * 0.018);
      ctx.stroke(rimP);
    }
    // 门内的灯光（在东头的门帘后面）
    const lampK = clamp((r - 0.64) / 0.04, 0, 1);
    if (lampK > 0 && door > 0) {
      const q = eq(0.5);
      ctx.globalCompositeOperation = 'lighter';
      glowAt(ctx, glowSpr('door', [255, 210, 130], 0.25), q[0], yb + q[1] - G.tentH * 0.35, H * 0.8, lampK * (0.2 + 0.35 * nightK() + 0.45 * glory));
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 院中燔祭坛的烟
    const smoke = clamp((r - 0.92) / 0.08, 0, 1);
    if (smoke > 0) {
      const ax = lerp(G.c0, G.t0, 0.55), gy = gY(2, ax / W.w);
      flame(ctx, ax, gy - G.fenceH * 0.92, H * 0.25, smoke * 0.8, 31);
      for (let i = 0; i < 7; i++) {
        const ph = U.fract(W.t * 0.07 + i / 7), y = gy - G.fenceH - ph * H * 3.5, x = ax + Math.sin(ph * 5 + i) * H * 0.2 + ph * H * 0.9;
        const rr = H * (0.16 + 0.42 * ph);
        ctx.globalAlpha = smoke * 0.35 * (1 - ph);
        ctx.drawImage(puff(W.shade([214, 210, 204], 0.1)), x - rr, y - rr, rr * 2, rr * 2);
      }
      ctx.globalAlpha = 1;
    }
    // 荣光：帐幕里里外外的金光
    if (glory > 0.01) {
      ctx.globalCompositeOperation = 'lighter';
      const cx = (G.t0 + G.t1) / 2, cy = gyAt(cx) - G.tentH * 0.55;
      const pul = 0.9 + 0.1 * Math.sin(W.t * 1.3);
      glowAt(ctx, glowSpr('glory', [255, 224, 160], 0.35), cx, cy, (G.t1 - G.t0) * 1.15, glory * 0.5 * pul);
      glowAt(ctx, glowSpr('gloryCore', [255, 248, 226], 0.3), cx, cy - G.tentH * 0.2, (G.t1 - G.t0) * 0.5, glory * 0.3 * pul);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
    // 院子：柱子（铜座、银钩银杆）与细麻的帷子，门帘在东（左）边
    const nP = port() ? 11 : 15;
    const posts = clamp((r - 0.64) / 0.14, 0, 1), hang = clamp((r - 0.76) / 0.14, 0, 1), gate = clamp((r - 0.88) / 0.05, 0, 1);
    const px = i => lerp(G.c0, G.c1, i / (nP - 1));
    const gateA = 2, gateB = 5;
    if (hang > 0) {
      const lastX = lerp(G.c0, G.c1, hang);
      for (let i = 0; i < nP - 1; i++) {
        const x0 = px(i), x1 = Math.min(px(i + 1), lastX);
        if (x1 <= x0) break;
        const isGate = i >= gateA && i < gateB;
        if (isGate && gate < 0.01) continue;
        const gy0 = gY(2, x0 / W.w), gy1 = gY(2, x1 / W.w), top0 = gy0 - G.fenceH * 0.94, top1 = gy1 - G.fenceH * 0.94;
        if (isGate) {
          const cs = [BLUE, PURPLE, SCARLET, LINEN];
          for (let s = 0; s < 4; s++) {
            const ya = lerp(top0, gy0 - H * 0.05, s / 4), yb = lerp(top0, gy0 - H * 0.05, (s + 1) / 4);
            ctx.fillStyle = css(cs[s], 0, gate, 0.08 + 0.25 * glory);
            ctx.beginPath(); ctx.moveTo(x0, ya); ctx.lineTo(x1, ya + (top1 - top0)); ctx.lineTo(x1, yb + (top1 - top0)); ctx.lineTo(x0, yb); ctx.closePath(); ctx.fill();
          }
        } else {
          ctx.fillStyle = css(LINEN, 0, 1, 0.12 + glory * (0.35 + 0.45 * clamp(W.night * 1.2, 0, 1)));
          ctx.beginPath(); ctx.moveTo(x0, top0); ctx.lineTo(x1, top1); ctx.lineTo(x1, gy1 - H * 0.05); ctx.lineTo(x0, gy0 - H * 0.05); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = css([200, 194, 180], 0, 0.5); ctx.lineWidth = Math.max(0.5, H * 0.012);
          ctx.beginPath();
          for (let f = 1; f < 4; f++) { const xx = lerp(x0, x1, f / 4); ctx.moveTo(xx, lerp(top0, top1, f / 4) + 1); ctx.lineTo(xx, lerp(gy0, gy1, f / 4) - H * 0.06); }
          ctx.stroke();
        }
      }
    }
    const np = Math.floor(posts * nP + 1e-6);
    for (let i = 0; i < np; i++) {
      const x = px(i), gy = gY(2, x / W.w);
      ctx.fillStyle = css([110, 84, 60], 0);
      ctx.fillRect(x - H * 0.025, gy - G.fenceH, H * 0.05, G.fenceH);
      ctx.fillStyle = css(BRONZE, 0, 1, 0.05);
      ctx.fillRect(x - H * 0.045, gy - H * 0.07, H * 0.09, H * 0.07);
      ctx.fillStyle = css(SILVER, 0, 1, 0.25);
      ctx.fillRect(x - H * 0.04, gy - G.fenceH - H * 0.03, H * 0.08, H * 0.04);
    }
    if (np > 1) {
      ctx.strokeStyle = css(SILVER, 0, 0.8, 0.2); ctx.lineWidth = Math.max(0.6, H * 0.018);
      ctx.beginPath(); ctx.moveTo(px(0), gY(2, px(0) / W.w) - G.fenceH); ctx.lineTo(px(np - 1), gY(2, px(np - 1) / W.w) - G.fenceH); ctx.stroke();
    }
    // 荣光充满帐幕：整个院子由里面透出暖光（夜里更显）
    if (glory > 0.01) {
      const nk = clamp(W.night * 1.2, 0, 1), cx = (G.t0 + G.t1) / 2, cy = yb - G.tentH * 0.45;
      ctx.globalCompositeOperation = 'lighter';
      const pul = 0.9 + 0.1 * Math.sin(W.t * 1.3);
      glowAt(ctx, glowSpr('gloryCourt', [255, 206, 130], 0.3), cx, cy, (G.c1 - G.c0) * 0.62, glory * (0.16 + 0.26 * nk) * pul);
      glowAt(ctx, glowSpr('gloryTent', [255, 236, 190], 0.35), cx, cy - G.tentH * 0.1, (G.t1 - G.t0) * 0.7, glory * (0.2 + 0.22 * nk) * pul);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }
  // 云彩遮盖会幕（40:34–38）：由山上移到帐幕之上
  function drawColumn(ctx) {
    const a = W.lv.snColumn;
    if (a < 0.01) return;
    const G = tabGeomT(), x = (G.t0 + G.t1) / 2, gy = gY(2, x / W.w) - G.H * 0.16 - G.tentH;
    const yTop = W.h * 0.08, bot = lerp(yTop, gy + G.H * 0.2, clamp(a * 1.12, 0, 1));
    column(ctx, x, yTop, bot, Math.max(G.H * 1.4, (G.t1 - G.t0) * 0.62), a, clamp(W.night * 1.2, 0, 1), 7.7);
  }

  // 摩西的面皮发光（34:29）
  function drawShine(ctx) {
    const s = W.lv.snShine;
    if (s < 0.01) return;
    const p = fig('moses');
    if (!p || !(p._h > 0) || (p.alpha != null && p.alpha < 0.05)) return;
    const x = p._x, y = p._y - p._h * 0.9, R = p._h * 0.7;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    glowAt(ctx, glowSpr('shine', [255, 236, 190], 0.25), x, y, R, s * 0.9);
    ctx.globalAlpha = clamp(s * 0.9, 0, 1);
    ctx.strokeStyle = U.rgba(255, 238, 200, 0.55 * s);
    ctx.lineWidth = Math.max(0.6, p._h * 0.02);
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + W.t * 0.15, r0 = p._h * 0.12, r1 = p._h * (0.3 + 0.12 * Math.sin(W.t * 2 + i * 1.7));
      ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  每帧：天象的节拍（闪电、角声、震动）与点缀的粒子（皆不入状态）
  // ════════════════════════════════════════════════════════════
  let boltT = 1, hornT = 2, shakeT = 1, streamAcc = 0, eagleAcc = 0, eagleDone = -1, buildT = 1, goldAcc = 0, lastBound = 0, emberAcc = 0, calfAcc = 0;
  // 山顶飞起的火星（纯点缀，不入状态）：小圆的光点
  const EMB = [];
  function updEmbers(dt) {
    const su = SU();
    for (let i = EMB.length - 1; i >= 0; i--) {
      const e = EMB[i];
      e.life += dt;
      if (e.life >= e.max) { EMB.splice(i, 1); continue; }
      if (e.home) {
        if (e.ox == null) { e.ox = e.x; e.oy = e.y; }
        const q = U.easeInOut(clamp(e.life / (e.max * 0.7), 0, 1));
        const mx = (e.ox + e.tx) / 2 + (e.ty - e.oy) * e.arc, my = (e.oy + e.ty) / 2 - (e.tx - e.ox) * e.arc;
        e.x = lerp(lerp(e.ox, mx, q), lerp(mx, e.tx, q), q); e.y = lerp(lerp(e.oy, my, q), lerp(my, e.ty, q), q);
        continue;
      }
      const k = Math.exp(-0.6 * dt);
      e.vx *= k; e.vy = e.vy * k - 8 * su * dt;
      e.x += e.vx * dt; e.y += e.vy * dt;
    }
  }
  function drawEmbers(ctx) {
    if (!EMB.length) return;
    // 火势：山顶的火小下去，火星随之淡去；白日的晴天里只剩一点点（夜里、密云与幽暗里才亮）
    const fire = smoothstep(0.3, 0.75, W.lv.snFire);
    const dark = clamp(Math.max(nightK(), W.lv.storm * 0.95, W.lv.gloom * 1.6), 0, 1);
    const K = fire * (0.22 + 0.78 * dark);
    const sp = glowSpr('ember', [255, 176, 96], 0.3);
    ctx.globalCompositeOperation = 'lighter';
    const spH = glowSpr('streamMote', [255, 228, 170], 0.3);
    for (const e of EMB) {
      const q = e.life / e.max;
      if (e.home) {
        const a = Math.min(1, e.life * 3) * (q > 0.7 ? 1 - (q - 0.7) / 0.3 : 1) * (0.55 + 0.45 * dark);
        if (a < 0.01) continue;
        glowAt(ctx, spH, e.x, e.y, e.r * 3.4, a * 0.5);
        ctx.globalAlpha = Math.min(1, a * 0.9);
        ctx.fillStyle = 'rgb(255,236,190)';
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, TAU); ctx.fill();
        continue;
      }
      const tw = 0.65 + 0.35 * Math.sin(W.t * 17 + e.ph);
      const a = K * (1 - q) * (1 - q) * tw;
      if (a < 0.01) continue;
      glowAt(ctx, sp, e.x, e.y, e.r * 3.2, a * 0.55);
      ctx.globalAlpha = Math.min(1, a);
      ctx.fillStyle = 'rgb(255,' + e.g + ',110)';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (1 - 0.4 * q), 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  function update(dt) {
    if (!cur()) return;
    if (W.replaying) return;
    const m = lay().m, q = W.lv.snQuake;
    if (q > 0.5 && W.lt.snQuake > 0.5 && !W.reduced) {
      boltT -= dt;
      if (boltT <= 0) {
        boltT = rand(1.2, 3.4) / Math.max(0.6, q);
        safe('sinai.bolt', spawnBolt);
      }
      shakeT -= dt;
      if (shakeT <= 0) {
        shakeT = rand(0.7, 1.8);
        W.shake = Math.max(W.shake || 0, 0.3 + 0.4 * q);
        const xf = rand(0.56, 0.98);
        safe('sinai.dust', () => fx().dust(xf * W.w, gY(1, xf), 8, [196, 168, 140], hp(1) * 0.8, 'mid'));
      }
      if (q > 0.8) {
        hornT -= dt;
        if (hornT <= 0) {
          hornT = rand(4.5, 7);
          horn(q);
          wave(0.7 + 0.3 * q);
        }
      }
    }
    // 鹰的光尾；落在山顶化作光
    const ea = W.t - S.eagleT0;
    if (ea >= 0 && ea < EAGLE_DUR) {
      eagleAcc += dt * 26;
      const p = eaglePath(eagleE(ea));
      while (eagleAcc >= 1) {
        eagleAcc -= 1;
        safe('sinai.eagleMote', () => fx().add({ x: p[0] + rand(-8, 8), y: p[1] + rand(-4, 4), vx: rand(-12, 12), vy: rand(4, 20), max: rand(1.2, 2.4), size: rand(0.8, 1.8), c: [255, 232, 190], drag: 1.2, pass: 'air', twinkle: true }));
      }
    } else if (ea >= EAGLE_DUR && eagleDone !== S.eagleT0) {
      eagleDone = S.eagleT0;
      safe('sinai.eagleEnd', () => fx().sparkle(m.sx, m.sy - 0.08 * W.h, 40, [255, 236, 200], 24, 'air'));
      wave(0.7);
      sfx('harp', { soft: true });
    }
    // 典章的字流：自山顶流到摩西（21–23）
    const sa = W.t - S.streamT0;
    if (sa >= 0 && sa < 10) {
      const p = fig('moses');
      if (p && p._h > 0) {
        streamAcc += dt * 16;
        while (streamAcc >= 1) {
          streamAcc -= 1;
          // 典章的字流：小圆的金光点（本卷自己画），沿弧线流到摩西
          if (EMB.length >= 150) EMB.shift();
          EMB.push({ home: true, x: m.sx + rand(-10, 10), y: m.sy - m.H * 0.02, tx: p._x + rand(-4, 4), ty: p._y - p._h * 0.8, arc: rand(-0.25, 0.1),
            life: 0, max: rand(2.6, 3.6), r: rand(0.8, 1.4) * SU(), ph: rand(0, TAU) });
        }
      }
    }
    // 山顶的火：火星一串一串往上飞，随风向西（本卷自己画成小圆的光点，不是方的像素；
    // 白日里淡，火小下去便随着淡去，不留在白天的天上）
    const fk = W.lv.snFire;
    updEmbers(dt);
    if (fk > 0.4 && !W.reduced) {
      emberAcc += dt * 16 * fk;
      const su = SU();
      while (emberAcc >= 1) {
        emberAcc -= 1;
        if (EMB.length >= 150) EMB.shift();
        EMB.push({ x: m.sx + rand(-1, 1) * m.HW * 0.07, y: m.sy - m.H * rand(0, 0.06), vx: (rand(-30, 12) - 30 * W.lv.gale) * su, vy: -rand(45, 110) * su,
          life: 0, max: rand(1.1, 2.1), r: rand(0.9, 1.7) * su, g: Math.round(rand(150, 210)), ph: rand(0, TAU) });
      }
    }
    // 金牛犊上升起的假的金光点
    if (S.calf === 'idol' && W.lv.snCalf > 0.5) {
      calfAcc += dt * 3;
      const H2 = hp(2), cx = F.calf * W.w, cy = fieldY(F.calf, 0.06) - H2 * (CALF_PED + 0.5 * CALF_S);
      while (calfAcc >= 1) {
        calfAcc -= 1;
        safe('sinai.calfMote', () => fx().add({ x: cx + rand(-0.5, 0.5) * H2, y: cy + rand(-0.3, 0.3) * H2, vx: rand(-6, 6), vy: -rand(14, 30) * SU(), drag: 0.4, max: rand(1.6, 2.6), size: rand(1, 1.8), c: [255, 212, 110], pass: 'air', twinkle: true }));
      }
    }
    // 金环（32:2–3）：自众人流向亚伦的火
    const ga = W.t - S.goldT0;
    if (ga >= 0 && ga < 4.5) {
      goldAcc += dt * 14;
      const tx = F.calf * W.w, ty = fieldY(F.calf, 0.06) - hp(2) * CALF_PED;
      while (goldAcc >= 1) {
        goldAcc -= 1;
        const xf = rand(F.calf - 0.15, F.calf - 0.05);
        safe('sinai.gold', () => fx().add({ x: xf * W.w, y: fieldY(xf, 0.05) - hp(2) * 0.8, tx, ty, home: true, arc: rand(-0.3, 0.3), max: rand(1.4, 2.2), size: rand(0.9, 1.6), c: [255, 214, 120], pass: 'air' }));
      }
    }
    // 界限的石头一块一块亮起
    const nb = lay().bound.length, bi = Math.floor(W.lv.snBound * nb);
    if (bi > lastBound && W.lv.snBound < 0.999) {
      const s = lay().bound[Math.min(nb - 1, bi - 1)];
      safe('sinai.bnd', () => fx().sparkle(s.x * W.w, gY(1, s.x) - hp(1) * 0.15, 5, [255, 236, 200], 5, 'mid'));
      if (bi % 3 === 0) sfx('stone', { soft: true });
    }
    lastBound = bi;
    // 造作的声音
    const building = (W.lv.snParts < W.lt.snParts - 0.01) || (W.lv.snRaise < W.lt.snRaise - 0.01) || (W.lv.snAltar < W.lt.snAltar - 0.01);
    if (building) {
      buildT -= dt;
      if (buildT <= 0) { buildT = rand(1.4, 2.6); sfx('build', { soft: true }); }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  function spiritRing(c) { if (!c.instant) safe('sinai.ring', () => fx().ring(c.x, c.y, TINT, M() * 0.28, 1.8, 1.5)); }
  // 写下第 i 条诫
  function write(i, b) {
    S.tabN = Math.max(S.tabN, i + 1);
    S.writeT[i] = b.instant ? -1e9 : W.t;
    if (!b.instant) sfx('chime', { soft: true });
  }
  function pat(k, b) {
    S.patN = Math.max(S.patN, k + 1);
    S.patT[k] = b.instant ? -1e9 : W.t;
    if (!b.instant) sfx('harp', { soft: true });
  }
  // 近处的摩西往山那边走去、隐没；山脊上的摩西从山脚出现并上山
  function upBeats(t0, to, o) {
    o = o || {};
    return [
      [t0, b => { walk('moses', F.up, { speed: 0.05, pose: 'stand' }); if (o.joshua) walk('joshua', F.up - 0.03, { speed: 0.05 }); }],
      [t0 + (o.walk || 2.6), b => {
        rm('moses'); if (o.joshua) rm('joshua');
        S.mPos = 'ridge';
        W.set('snClimb', 0, true);
        mosesM(b, { pose: 'walk', facing: -1 });
        lv('snClimb', to, b);
      }],
    ];
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, book: '出埃及记', books: [2], title: '西奈', sub: '出埃及记 19 — 40', tint: TINT, music: 'babel',
    intro: [
      { text: '以色列人出埃及地以后，满了三个月的那一天，<br>就来到西奈的旷野。', ref: '出埃及记 19:1', hold: 6 },
      { text: '他们离了利非订，来到西奈的旷野，<br>就在那里的山下安营。', ref: '出埃及记 19:2', hold: 5.5 },
    ],
    outro: 18,
    behold: {
      '西奈山': { text: '西奈全山冒烟，因为耶和华在火中降于山上。<br>山的烟气上腾，如烧窑一般，遍山大大地震动。', ref: '出埃及记 19:18' },
      '以色列人的营': { text: '他们离了利非订，来到西奈的旷野，<br>就在那里的山下安营。', ref: '出埃及记 19:2' },
      '以色列人': { text: '百姓都同声回答说：「凡耶和华所说的，我们都要遵行。」', ref: '出埃及记 19:8' },
      '摩西': { text: '耶和华与摩西面对面说话，好像人与朋友说话一般。', ref: '出埃及记 33:11' },
      '亚伦': { text: '「你要从以色列人中，使你的哥哥亚伦和他的儿子……<br>一同就近你，给我供祭司的职分。」', ref: '出埃及记 28:1' },
      '约书亚': { text: '摩西和他的帮手约书亚起来，上了神的山。', ref: '出埃及记 24:13' },
      '界限': { text: '「你要在山的四围给百姓定界限，说：『你们当谨慎，不可上山去，也不可摸山的边界……』」', ref: '出埃及记 19:12' },
      '法版': { text: '是神的工作，字是神写的，刻在版上。', ref: '出埃及记 32:16' },
      '使者': { text: '「看哪，我差遣使者在你前面，在路上保护你，<br>领你到我所预备的地方去。」', ref: '出埃及记 23:20' },
      '坛': { text: '摩西将耶和华的命令都写上。清早起来，在山下筑一座坛，<br>按以色列十二支派立十二根柱子。', ref: '出埃及记 24:4' },
      '十二根柱子': { text: '摩西将耶和华的命令都写上。清早起来，在山下筑一座坛，<br>按以色列十二支派立十二根柱子。', ref: '出埃及记 24:4' },
      '以色列的长老': { text: '他的手不加害在以色列的尊者身上。<br>他们观看神；他们又吃又喝。', ref: '出埃及记 24:11' },
      '蓝宝石': { text: '他们看见以色列的神，他脚下仿佛有平铺的蓝宝石，<br>如同天色明净。', ref: '出埃及记 24:10' },
      '样式': { text: '「要谨慎做这些物件，都要照着在山上指示你的样式。」', ref: '出埃及记 25:40' },
      '金牛犊': { text: '他们就说：「以色列啊，这是领你出埃及地的神。」', ref: '出埃及记 32:4' },
      '会幕': { text: '摩西素常将帐棚支搭在营外，离营却远，他称这帐棚为会幕。', ref: '出埃及记 33:7' },
      '云柱': { text: '众百姓看见云柱立在会幕门前，<br>就都起来，各人在自己帐棚的门口下拜。', ref: '出埃及记 33:10' },
      '磐石穴': { text: '「我的荣耀经过的时候，我必将你放在磐石穴中，<br>用我的手遮掩你，等我过去……」', ref: '出埃及记 33:22' },
      '比撒列': { text: '「我也以我的灵充满了他，使他有智慧，有聪明，<br>有知识，能做各样的工……」', ref: '出埃及记 31:3' },
      '亚何利亚伯': { text: '「我分派但支派中、亚希撒抹的儿子亚何利亚伯与他同工。」', ref: '出埃及记 31:6' },
      '礼物': { text: '「百姓为耶和华吩咐使用之工所拿来的，富富有余。」', ref: '出埃及记 36:5' },
      '约柜': { text: '「我要在那里与你相会，又要从法柜施恩座上二基路伯中间，<br>和你说我所要吩咐你传给以色列人的一切事。」', ref: '出埃及记 25:22' },
      '帐幕': { text: '当时，云彩遮盖会幕，耶和华的荣光就充满了帐幕。', ref: '出埃及记 40:34' },
      '云彩': { text: '日间，耶和华的云彩是在帐幕以上；夜间，云中有火，<br>在以色列全家的眼前。', ref: '出埃及记 40:38' },
      '羊群': { text: '「……遍山都不可有人，在山根也不可叫羊群牛群吃草。」', ref: '出埃及记 34:3' },
    },
    setup() {
      S = fresh();
      layout();
      // 西奈的旷野：地干而少草，花隐去
      W.set('bare', 0.78, true); W.set('bloom', 0.08, true);
      const Lv = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 0.45, land: 1, grass: 0.55, herbs: 0.3, trees: 0.14,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in Lv) if (W.hasLevel(k)) W.set(k, Lv[k], true);
      for (const k of MY_LEVELS) W.set(k, 0, true);
      W.set('snAltarF', 1, true); W.set('snAltarA', 1, true);
      const gx = W.w * 0.97, tx = W.w * 0.995;
      W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
      W.freeClock = false;
      W.goTo(0.34, 0, true);
      const lx = W.w * 0.9, ly = W.ridgeBaseY(2, lx);
      W.setPop('fish', 120, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 2, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 18, W.w * 0.6, W.h * 0.3, true);
      W.setPop('cattle', 0, lx, ly, true);
      W.setPop('beast', 0, lx, ly, true);
      W.setPop('creeper', 8, lx, ly, true);
      W.setPop('human', 0, lx, ly, true);
      avoid([0.36, 1]);
      W.set('snFires', 1, true);
      const c = cast();
      c.clear({ fade: false });
      add('moses', { label: '摩西', sex: 'm', age: 'elder', x: F.home, facing: 1, robe: ROBE.moses, prop: 'staff', glow: 0.35, from: 'none' });
      add('aaron', { label: '亚伦', sex: 'm', age: 'elder', x: F.aaron, facing: 1, robe: ROBE.aaron, from: 'none' });
      c.crowd('sn:folk', { n: port() ? 10 : 14, x0: F.folk[0], x1: F.folk[1], layer: 2, label: '以色列人', from: 'none' });
      c.crowd('sn:mid', { n: port() ? 8 : 12, x0: F.midT[0], x1: F.midT[1], layer: 1, label: '以色列人', from: 'none' });
      // 羊群：静静地在营的西头（海边）吃草，不自己走进人群里（34:3 在山根也不可叫羊群牛群吃草）
      if (c.herd) safe('sinai.herd', () => c.herd('sn:flock', { kind: 'sheep', n: port() ? 3 : 5, x0: F.flock[0], x1: F.flock[1], layer: 2, label: '羊群', from: 'none', pose: 'graze', mill: false }));
    },
    stages: [
      // ── 19:1–8 如鹰将你们背在翅膀上 ─────────────────────────
      {
        kind: 'promise', utter: '我如鹰将你们背在翅膀上，带来归我', cmd: 'airlift 以色列 --wings 鹰 --to 西奈  # 带来归我', ref: '19:4',
        verse: [
          { text: '摩西到神那里，耶和华从山上呼唤他说：<br>「……我向埃及人所行的事，你们都看见了，<br>且看见我如鹰将你们背在翅膀上，带来归我。」', ref: '出埃及记 19:3–4', hold: 8 },
          { text: '「如今你们若实在听从我的话，遵守我的约，就要在万民中作属我的子民……<br>你们要归我作祭司的国度，为圣洁的国民。」', ref: '出埃及记 19:5–6', hold: 8 },
          { text: '百姓都同声回答说：「凡耶和华所说的，我们都要遵行。」', ref: '出埃及记 19:8', hold: 5.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => { W.goTo(0.4, 10, b.instant); sfx('wind', { soft: true }); }],
            ...upBeats(0.2, 0.5),
            [2.5, b => { S.eagleT0 = b.instant ? -1e9 : W.t; sfx('wings'); }],
            [6, () => { crowdPose('sn:folk', 'gaze'); crowdFace('sn:folk', -1); pose('aaron', 'gaze'); }],
            [6.8, () => { pose('mosesM', 'raise'); }],
            [15, b => { pose('mosesM', 'walk'); face('mosesM', 1); lv('snClimb', 0, b); }],
            [19.6, b => {
              rm('mosesM');
              add('moses', { label: '摩西', sex: 'm', age: 'elder', x: F.foot + 0.02, facing: -1, robe: ROBE.moses, prop: 'staff', glow: 0.35, from: b.instant ? 'none' : 'fade' });
              walk('moses', F.home, { speed: 0.035, pose: 'raise' });
              crowdWalk('sn:folk', F.folk[0] + 0.04, F.folk[1] + 0.03, { pose: 'stand' });
            }],
            [22, b => { crowdPose('sn:folk', 'raise'); crowdPose('sn:mid', 'raise'); pose('aaron', 'raise'); if (!b.instant) sfx('crowd'); }],
          ]);
        },
      },

      // ── 19:10–15 自洁、洗衣服、定界限；夜 ───────────────────
      {
        kind: 'cmd', utter: '到第三天要预备好了', cmd: 'fence 西奈山 && wash --all 衣服 --until day3', ref: '19:11',
        verse: [
          { text: '耶和华又对摩西说：「你往百姓那里去，<br>叫他们今天明天自洁，又叫他们洗衣服。」', ref: '出埃及记 19:10', hold: 6.5 },
          { text: '「你要在山的四围给百姓定界限，说：<br>『你们当谨慎，不可上山去，也不可摸山的边界……』」', ref: '出埃及记 19:12', hold: 7.5 },
          { text: '摩西下山往百姓那里去，叫他们自洁，他们就洗衣服。', ref: '出埃及记 19:14', hold: 5.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, () => { crowdPose('sn:folk', 'stand'); crowdPose('sn:mid', 'stand'); pose('aaron', 'stand'); face('moses', 1); pose('moses', 'point'); }],
            [7.8, b => { lv('snBound', 1, b); }],
            [11, () => { crowdWalk('sn:folk', F.shore[0], F.shore[1], { pose: 'kneel' }); pose('moses', 'stand'); }],
            [16.6, b => {
              if (!b.instant) { for (let i = 0; i < 6; i++) { const xf = lerp(F.shore[0], F.shore[1], i / 5); safe('sinai.wash', () => fx().sparkle(xf * W.w, fieldY(xf, 0.08), 6, [210, 230, 255], 10, 'near')); } sfx('water', { soft: true }); }
            }],
            [18, b => { W.goTo(0.82, 6, b.instant); }],
            [20, b => { crowdWalk('sn:folk', F.folk[0], F.folk[1], { pose: 'sit' }); crowdPose('sn:mid', 'sit'); pose('aaron', 'sit'); lv('snFires', 1, b); }],
            [24, b => { W.goTo(0.24, 8, b.instant); pose('moses', 'pray'); }],
          ]);
        },
      },

      // ── 19:16–20 第三天早晨：雷轰、闪电、密云、角声；全山冒烟，遍山震动 ──
      {
        kind: 'promise', utter: '我要在密云中临到你那里', cmd: 'deploy 密云 --fire --shofar=loud  # 遍山震动', ref: '19:9',
        verse: [
          { text: '到了第三天早晨，在山上有雷轰、闪电，和密云，<br>并且角声甚大，营中的百姓尽都发颤。', ref: '出埃及记 19:16', hold: 7.5 },
          { text: '西奈全山冒烟，因为耶和华在火中降于山上。<br>山的烟气上腾，如烧窑一般，遍山大大地震动。', ref: '出埃及记 19:18', hold: 8 },
          { text: '角声渐渐地高而又高，摩西就说话，神有声音答应他。<br>耶和华降临在西奈山顶上，耶和华召摩西上山顶，摩西就上去。', ref: '出埃及记 19:19–20', hold: 8 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.3, 2.5, b.instant);
              W.set('storm', 0.85, b.instant); W.set('gale', 0.3, b.instant);
              lv('snCloud', 1, b); lv('snQuake', 0.45, b);
              W.set('gloom', 0.3, b.instant);
              W.setPop('bird', 0, null, null, b.instant);     // 鸟都躲开了
              if (!b.instant) safe('sinai.bolt0', spawnBolt);
            }],
            [1.5, b => { if (!b.instant) { horn(0.3); wave(0.6); } }],
            [3, () => { crowdPose('sn:folk', 'kneel'); crowdPose('sn:mid', 'kneel'); pose('aaron', 'kneel'); pose('moses', 'stand'); }],
            [5.5, () => {
              walk('moses', F.foot - 0.02, { speed: 0.035, pose: 'raise' });
              crowdWalk('sn:folk', F.folk[0] + 0.1, Math.min(F.foot - 0.05, F.folk[1] + 0.1), { pose: 'stand' });
              walk('aaron', F.foot - 0.06, { speed: 0.035, pose: 'stand' });
            }],
            [8.8, b => {
              lv('snSmoke', 1, b); lv('snFire', 1, b); lv('snQuake', 1, b); lv('snFires', 0, b);
              if (!b.instant) { W.shake = 1; sfx('fire'); horn(0.6); }
            }],
            [12, () => { crowdPose('sn:folk', 'kneel'); crowdPose('sn:mid', 'kneel'); pose('aaron', 'bow'); }],
            [17, b => { if (!b.instant) { horn(1); wave(1); } }],
            ...upBeats(17.5, 0.7, { walk: 2.4 }),
            [25, () => { pose('mosesM', 'raise'); }],
          ]);
        },
      },

      // ── 20:1–7 十诫（一）：两块光的法版显出 ───────────────────
      {
        kind: 'name', utter: '我是耶和华你的神', cmd: 'whoami  # 耶和华你的神', ref: '20:2',
        verse: [
          { text: '神吩咐这一切的话说：<br>「我是耶和华你的神，曾将你从埃及地为奴之家领出来。」', ref: '出埃及记 20:1–2', hold: 6.5 },
          { text: '「除了我以外，你不可有别的神。」', ref: '出埃及记 20:3', hold: 4.5 },
          { text: '「不可为自己雕刻偶像……<br>不可跪拜那些像，也不可事奉它……」', ref: '出埃及记 20:4–5', hold: 6 },
          { text: '「不可妄称耶和华你神的名……」', ref: '出埃及记 20:7', hold: 5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              lv('snTab', 1, b); W.set('storm', 0.72, b.instant); lv('snQuake', 0.62, b); lv('snSmoke', 0.7, b); W.set('gloom', 0.2, b.instant);
              pose('mosesM', 'raise'); face('mosesM', -1);
              if (!b.instant) sfx('seal');
            }],
            [2.5, b => write(0, b)],
            [12.5, b => write(1, b)],
            [19.5, b => write(2, b)],
          ]);
        },
      },

      // ── 20:8–21 十诫（二）：安息日；百姓远远地站立，摩西挨近幽暗 ──
      {
        kind: 'cmd', utter: '当记念安息日，守为圣日', cmd: 'cron "0 0 * * 6" 安息  # 守为圣日', ref: '20:8',
        verse: [
          { text: '「六日要劳碌做你一切的工，但第七日是向耶和华你神当守的安息日……<br>因为六日之内，耶和华造天、地、海，和其中的万物，第七日便安息。」', ref: '出埃及记 20:9–11', hold: 8.5 },
          { text: '「当孝敬父母……不可杀人。不可奸淫。不可偷盗。<br>不可作假见证陷害人。不可贪恋人的房屋……」', ref: '出埃及记 20:12–17', hold: 8 },
          { text: '众百姓见雷轰、闪电、角声、山上冒烟，就都发颤，远远地站立……<br>于是百姓远远地站立；摩西就挨近神所在的幽暗之中。', ref: '出埃及记 20:18–21', hold: 8.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0.6, b => write(3, b)],
            [9.8, b => write(4, b)], [11, b => write(5, b)], [12.2, b => write(6, b)], [13.4, b => write(7, b)], [14.6, b => write(8, b)], [15.8, b => write(9, b)],
            [19.1, b => {
              crowdWalk('sn:folk', F.folk[0] - 0.02, F.folk[1] - 0.04, { pose: 'stand' });
              crowdFace('sn:folk', 1);
              walk('aaron', F.aaron, { speed: 0.035, pose: 'stand' });
              lv('snQuake', 0.3, b); W.set('gloom', 0.1, b.instant);
            }],
            [21, b => { pose('mosesM', 'walk'); face('mosesM', -1); lv('snClimb', 1, b); }],
            [24.5, b => { rm('mosesM'); lv('snTab', 0.3, b); W.set('storm', 0.5, b.instant); }],
          ]);
        },
      },

      // ── 21–23 典章；使者在你前面 ──────────────────────────────
      {
        kind: 'promise', utter: '我差遣使者在你前面，在路上保护你', cmd: 'spawn 使者 --before 你 --guard 路上', ref: '23:20',
        verse: [
          { text: '「你在百姓面前所要立的典章是这样：」', ref: '出埃及记 21:1', hold: 4.5 },
          { text: '「不可亏负寄居的，也不可欺压他，<br>因为你们在埃及地也作过寄居的。」', ref: '出埃及记 22:21', hold: 6.5 },
          { text: '「看哪，我差遣使者在你前面，在路上保护你，<br>领你到我所预备的地方去。」', ref: '出埃及记 23:20', hold: 6.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.set('storm', 0.1, b.instant); W.set('gale', 0, b.instant); W.set('gloom', 0, b.instant);
              lv('snSmoke', 0, b); lv('snQuake', 0, b); lv('snFire', 0.2, b); lv('snCloud', 0.75, b); lv('snTab', 0, b);
              W.setPop('bird', 14, W.w * 0.3, W.h * 0.3, b.instant);
              W.goTo(0.46, 10, b.instant);
              add('moses', { label: '摩西', sex: 'm', age: 'elder', x: F.up, facing: -1, robe: ROBE.moses, prop: 'staff', glow: 0.35, from: b.instant ? 'none' : 'fade' });
              walk('moses', F.home + 0.03, { speed: 0.03, pose: 'stand' });
              S.streamT0 = b.instant ? -1e9 : W.t + 0.5;
            }],
            [6, () => { crowdWalk('sn:folk', F.folk[0] + 0.03, F.folk[1] + 0.02, { pose: 'stand' }); crowdPose('sn:mid', 'stand'); pose('aaron', 'stand'); }],
            [9, () => { pose('moses', 'raise'); }],
            [13.6, b => {
              add('angel', { label: '使者', sex: 'm', age: 'adult', x: F.angel, facing: -1, glow: 1, angel: true, from: b.instant ? 'none' : 'light' });
              if (!b.instant) sfx('angel');
            }],
            [16, () => { crowdFace('sn:folk', 1); crowdPose('sn:folk', 'gaze'); face('moses', 1); pose('moses', 'stand'); }],
          ]);
        },
      },

      // ── 24 立约：坛与十二根柱子；蓝宝石；摩西进入云中四十昼夜 ──────
      {
        kind: 'call', utter: '你上山到我这里来，住在这里', cmd: 'ssh 摩西@山顶 --stay 40d40n', ref: '24:12',
        verse: [
          { text: '摩西将耶和华的命令都写上。清早起来，在山下筑一座坛，<br>按以色列十二支派立十二根柱子。', ref: '出埃及记 24:4', hold: 7 },
          { text: '他们看见以色列的神，他脚下仿佛有平铺的蓝宝石，<br>如同天色明净。', ref: '出埃及记 24:10', hold: 6.5 },
          { text: '耶和华的荣耀在山顶上，在以色列人眼前，形状如烈火。<br>摩西进入云中上山，在山上四十昼夜。', ref: '出埃及记 24:17–18', hold: 8 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              rm('angel');
              W.goTo(0.3, 6, b.instant);
              walk('moses', F.pil[0] - 0.04, { speed: 0.035, pose: 'stand' });
              crowdPose('sn:folk', 'stand');
            }],
            [1.5, b => { lv('snAltar', 1, b); pose('moses', 'point'); if (!b.instant) sfx('stone'); }],
            [8.3, b => {
              if (C().crowd) C().crowd('sn:elders', { n: port() ? 5 : 7, x0: F.eld[0], x1: F.eld[1], layer: 1, label: '以色列的长老', robe: ROBE.elder, from: b.instant ? 'none' : 'fade', pose: 'stand', mill: false });
              lv('snPave', 1, b); if (!b.instant) sfx('harp');
            }],
            [12.5, () => { crowdPose('sn:elders', 'kneel'); crowdPose('sn:folk', 'kneel'); }],
            [16.1, b => {
              lv('snPave', 0, b);
              add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: F.pil[0] - 0.07, facing: 1, robe: ROBE.joshua, from: b.instant ? 'none' : 'fade' });
              lv('snCloud', 1, b); lv('snFire', 1, b); lv('snFires', 1, b);
              W.goTo(0.9, 7, b.instant);
            }],
            ...upBeats(16.3, 1, { joshua: true, walk: 2.4 }),
            [23, () => { uncrowd('sn:elders'); crowdPose('sn:folk', 'sit'); crowdPose('sn:mid', 'sit'); }],
            [27, () => { rm('mosesM'); }],
          ]);
        },
      },

      // ── 25–27 山上指示的样式 ─────────────────────────────────
      {
        kind: 'cmd', utter: '又当为我造圣所，使我可以住在他们中间', cmd: 'git init 圣所 --template 山上的样式', ref: '25:8',
        verse: [
          { text: '「制造帐幕和其中的一切器具都要照我所指示你的样式。」', ref: '出埃及记 25:9', hold: 5.5 },
          { text: '「我要在那里与你相会，又要从法柜施恩座上二基路伯中间，<br>和你说我所要吩咐你传给以色列人的一切事。」', ref: '出埃及记 25:22', hold: 8 },
          { text: '「要照着在山上指示你的样式立起帐幕。」', ref: '出埃及记 26:30', hold: 4.5 },
          { text: '「你要吩咐以色列人，把那为点灯捣成的清橄榄油拿来给你，<br>使灯常常点着。」', ref: '出埃及记 27:20', hold: 6.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => { lv('snPattern', 1, b); W.goTo(0.98, 10, b.instant); lv('snFire', 0.6, b); }],
            [0.5, b => pat(0, b)],
            [6.8, b => pat(1, b)],
            [11, b => pat(2, b)],
            [16.1, b => pat(3, b)],
            [18.5, b => pat(4, b)],
            [21.9, b => pat(5, b)],
            [24.5, b => { S.lampLit = 1; if (!b.instant) sfx('chime'); }],
          ]);
        },
      },

      // ── 28–31 圣衣、会幕的荣耀、香；两块法版交给摩西 ──────────────
      {
        kind: 'promise', utter: '我要住在以色列人中间，作他们的神', cmd: 'chmod +holy 会幕 && echo "住在他们中间"', ref: '29:45',
        verse: [
          { text: '「你要给你哥哥亚伦做圣衣为荣耀，为华美。」', ref: '出埃及记 28:2', hold: 5 },
          { text: '「我要在那里与以色列人相会，会幕就要因我的荣耀成为圣。」', ref: '出埃及记 29:43', hold: 5.5 },
          { text: '「黄昏点灯的时候，他要在耶和华面前烧这香，<br>作为世世代代常烧的香。」', ref: '出埃及记 30:8', hold: 6 },
          { text: '耶和华在西奈山和摩西说完了话，就把两块法版交给他，<br>是神用指头写的石版。', ref: '出埃及记 31:18', hold: 7.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0.5, b => { pat(6, b); lv('snGems', 1, b); }],
            [6.3, b => { S.patGlowT0 = b.instant ? -1e9 : W.t; if (!b.instant) sfx('harp', { soft: true }); }],
            [13.1, b => { pat(7, b); S.incense = 1; }],
            [20.4, b => {
              lv('snPattern', 0, b); lv('snTab', 1, b); lv('snFire', 0.2, b);
              W.goTo(0.27, 8, b.instant);
              S.mPos = 'ridge'; W.set('snClimb', 1, true);
              mosesM(b, { pose: 'raise', facing: -1, glow: 0.8 });
            }],
            [21.5, b => { lv('snTabDown', 1, b); }],
            [27.8, b => { S.tabs = 'mosesM'; lv('snTab', 0, b); pose('mosesM', 'carry'); lv('snFire', 0.3, b); }],
          ]);
        },
      },

      // ── 32 金牛犊；摩西为百姓求；法版摔碎 ───────────────────────
      {
        kind: 'judge', utter: '他们快快偏离了我所吩咐的道', cmd: 'git diff 所吩咐的道 HEAD  # 快快偏离', ref: '32:8',
        verse: [
          { text: '百姓见摩西迟延不下山，就大家聚集到亚伦那里，对他说：<br>「起来！为我们做神像，可以在我们前面引路……」', ref: '出埃及记 32:1', hold: 6 },
          { text: '亚伦……铸了一只牛犊，用雕刻的器具做成。<br>他们就说：「以色列啊，这是领你出埃及地的神。」', ref: '出埃及记 32:4', hold: 6 },
          { text: '摩西便恳求耶和华他的神说：「……求你转意，不发你的烈怒……<br>求你记念你的仆人亚伯拉罕、以撒、以色列……」<br>于是耶和华后悔，不把所说的祸降与他的百姓。', ref: '出埃及记 32:11–14', hold: 8 },
          { text: '摩西挨近营前就看见牛犊，又看见人跳舞，便发烈怒，<br>把两块版扔在山下摔碎了。', ref: '出埃及记 32:19', hold: 6.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.42, 8, b.instant);
              W.set('snTabDown', 0, true);
              lv('snCloud', 0.55, b); lv('snFire', 0, b); lv('snFires', 0, b); lv('snAltarF', 0, b);
              // 众人聚在牛犊的左边（留出一片空地），亚伦在右边
              crowdWalk('sn:folk', F.calf - 0.15, F.calf - 0.05, { pose: 'stand' });
              crowdPose('sn:mid', 'stand');
              walk('aaron', F.calf + 0.05, { speed: 0.035, pose: 'stand' });
              avoid([0.36, 1]);
            }],
            [3, b => { S.goldT0 = b.instant ? -1e9 : W.t; pose('aaron', 'point'); face('aaron', -1); if (!b.instant) sfx('fire'); }],
            [7.8, b => {
              S.calf = 'idol'; lv('snCalf', 1, b);
              crowdPose('sn:folk', 'raise'); crowdFace('sn:folk', 1); crowdPose('sn:mid', 'raise'); pose('aaron', 'raise');
              if (!b.instant) { sfx('chime'); sfx('crowd'); }
            }],
            // 32:11–13 摩西在山上为百姓恳求
            [8.6, () => { pose('mosesM', 'pray'); face('mosesM', -1); }],
            [20, b => { pose('mosesM', 'carry'); face('mosesM', 1); lv('snClimb', 0, b); }],
            [22, b => {
              rm('mosesM');
              S.tabs = 'moses';
              add('moses', { label: '摩西', sex: 'm', age: 'elder', x: F.up + 0.02, facing: -1, robe: ROBE.moses, prop: null, glow: 0.35, from: b.instant ? 'none' : 'fade', pose: 'carry' });
              const sp = Math.max(0.05, Math.abs(F.up + 0.02 - F.calf - 0.13) / 3);
              walk('moses', F.calf + 0.13, { speed: sp, pose: 'carry' });
              add('joshua', { label: '约书亚', sex: 'm', age: 'adult', x: F.up + 0.05, facing: -1, robe: ROBE.joshua, from: b.instant ? 'none' : 'fade' });
              walk('joshua', F.calf + 0.17, { speed: sp, pose: 'stand' });
            }],
            [25.3, b => {
              S.tabs = 'broken'; S.shards = 1; S.shardX = F.calf + 0.11;
              S.shatterT0 = b.instant ? -1e9 : W.t;
              pose('moses', 'raise');
              crowdPose('sn:folk', 'stand'); pose('aaron', 'stand');
              if (!b.instant) {
                W.shake = 1;
                sfx('stone'); sfx('thunder', { soft: true });
                const x = S.shardX * W.w, y = fieldY(S.shardX, 0.08) - hp(2) * 0.4;
                for (let i = 0; i < 28; i++) { const a = rand(-Math.PI, 0), s = rand(60, 220) * SU(); safe('sinai.shard', () => fx().add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, max: rand(0.8, 1.6), size: rand(1, 2.6), c: [230, 224, 210], drag: 2, grav: 260, pass: 'air' })); }
                safe('sinai.shardSp', () => fx().sparkle(x, y, 30, [255, 236, 200], 20, 'air'));
              }
            }],
            [27, b => { lv('snCalfFire', 1, b); pose('moses', 'point'); crowdPose('sn:folk', 'kneel'); crowdPose('sn:mid', 'kneel'); pose('aaron', 'bow'); if (!b.instant) sfx('fire'); }],
            [29.5, b => { lv('snCalf', 0, b); lv('snCalfFire', 0, b); S.calf = 'burnt'; }],
          ]);
        },
      },

      // ── 33 会幕与云柱；磐石穴中，荣耀经过 ──────────────────────
      {
        kind: 'promise', utter: '我要显我一切的恩慈，在你面前经过', cmd: 'sudo pass --by 摩西 --cover 手  # 只见背', ref: '33:19',
        verse: [
          { text: '摩西进会幕的时候，云柱降下来，立在会幕的门前……<br>耶和华与摩西面对面说话，好像人与朋友说话一般。', ref: '出埃及记 33:9–11', hold: 7.5 },
          { text: '摩西说：「求你显出你的荣耀给我看。」', ref: '出埃及记 33:18', hold: 4.5 },
          { text: '「我的荣耀经过的时候，我必将你放在磐石穴中，<br>用我的手遮掩你，等我过去……」', ref: '出埃及记 33:22', hold: 6 },
          { text: '「然后我要将我的手收回，你就得见我的背，<br>却不得见我的面。」', ref: '出埃及记 33:23', hold: 5.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              lv('snMeet', 1, b); W.goTo(0.52, 8, b.instant);
              walk('moses', F.up, { speed: 0.05, pose: 'stand' });
              rm('joshua');
              crowdWalk('sn:folk', F.folk[0], F.folk[1], { pose: 'stand' });
              crowdPose('sn:mid', 'stand'); walk('aaron', F.aaron, { speed: 0.035, pose: 'stand' });
            }],
            [3, b => { rm('moses'); S.mPos = 'meet'; mosesM(b, { pose: 'stand', facing: 1 }); }],
            [4, b => { lv('snPillarM', 1, b); if (!b.instant) sfx('wind', { soft: true }); }],
            [6, () => { crowdPose('sn:folk', 'kneel'); crowdPose('sn:mid', 'kneel'); pose('aaron', 'kneel'); crowdFace('sn:folk', 1); }],
            [8.8, () => { pose('mosesM', 'pray'); }],
            [11, b => { lv('snPillarM', 0, b); rm('mosesM'); }],
            [12.5, b => {
              S.mPos = 'cleft'; lv('snCleft', 1, b);
              mosesM(b, { pose: 'kneel', facing: -1 });
              W.goTo(0.66, 10, b.instant);
              crowdPose('sn:folk', 'stand'); crowdPose('sn:mid', 'stand'); pose('aaron', 'stand');
            }],
            [15, b => { lv('snHand', 1, b); }],
            [16, b => { S.passT0 = b.instant ? -1e9 : W.t; if (!b.instant) { sfx('angel'); sfx('harp'); } }],
            [22.4, b => { lv('snHand', 0, b); pose('mosesM', 'gaze'); face('mosesM', 1); }],
          ]);
        },
      },

      // ── 34 新的石版；宣告耶和华的名；摩西的面皮发光 ───────────────
      {
        kind: 'name', utter: '耶和华，耶和华，是有怜悯有恩典的神', cmd: 'man 耶和华  # 有怜悯有恩典，不轻易发怒', ref: '34:6',
        verse: [
          { text: '摩西就凿出两块石版，和先前的一样。清晨起来，<br>照耶和华所吩咐的上西奈山去，手里拿着两块石版。', ref: '出埃及记 34:4', hold: 7.5 },
          { text: '「……不轻易发怒，并有丰盛的慈爱和诚实，为千万人存留慈爱，<br>赦免罪孽、过犯，和罪恶……」摩西急忙伏地下拜。', ref: '出埃及记 34:6–8', hold: 8 },
          { text: '摩西手里拿着两块法版下西奈山的时候，<br>不知道自己的面皮因耶和华和他说话就发了光。', ref: '出埃及记 34:29', hold: 7.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => { W.goTo(0.27, 6, b.instant); rm('mosesM'); lv('snCleft', 0, b); lv('snMeet', 0, b); }],
            [1.5, b => {
              S.mPos = 'ridge'; W.set('snClimb', 0, true);
              S.tabs = 'mosesM'; S.tabsNew = 1;
              mosesM(b, { pose: 'carry', facing: -1 });
              lv('snClimb', 1, b);
            }],
            [3, b => { lv('snCloud', 1, b); }],
            [8.8, b => {
              lv('snName', 1, b);
              if (!b.instant) {
                const m = lay().m, size = Math.min(W.w * (port() ? 0.14 : 0.07), W.h * 0.1), cy = Math.max(m.sy - m.H * (port() ? 0.3 : 0.42), port() ? W.h * 0.3 : W.h * 0.1) + size * 0.5;
                safe('sinai.name', () => fx().nameStr('耶和华', m.sx - (port() ? m.HW * 0.2 : 0), cy, size, [255, 232, 180], () => [m.sx + rand(-1, 1) * m.HW * 0.5, m.sy + rand(-0.3, 0.1) * m.H], { hold: 5 }));
                sfx('angel');
              }
            }],
            [10.5, () => { pose('mosesM', 'fall'); }],
            [13, b => { S.litT0 = b.instant ? -1e9 : W.t; }],
            [18.1, b => { lv('snName', 0.2, b); lv('snCloud', 0.5, b); pose('mosesM', 'carry'); face('mosesM', 1); lv('snClimb', 0.4, b); }],
            [23.6, b => {
              rm('mosesM'); S.tabs = 'moses';
              add('moses', { label: '摩西', sex: 'm', age: 'elder', x: F.up + 0.02, facing: -1, robe: ROBE.moses, prop: null, glow: 1, from: b.instant ? 'none' : 'fade', pose: 'carry' });
              walk('moses', F.home + 0.04, { speed: 0.04, pose: 'carry' });
              lv('snShine', 1, b);
            }],
            [24.5, () => { crowdWalk('sn:folk', F.folk[0] - 0.03, F.folk[0] + 0.1, { pose: 'stand' }); crowdFace('sn:folk', 1); walk('aaron', F.home - 0.05, { speed: 0.03, pose: 'stand' }); }],
          ]);
        },
      },

      // ── 35–39 甘心乐意的礼物；比撒列的巧工 ───────────────────
      {
        kind: 'act', utter: '耶和华使他们的心满有智慧', cmd: 'make 帐幕 -j 甘心乐意', ref: '35:35',
        verse: [
          { text: '以色列人，无论男女，凡甘心乐意献礼物给耶和华的，<br>都将礼物拿来，做耶和华藉摩西所吩咐的一切工。', ref: '出埃及记 35:29', hold: 7 },
          { text: '「百姓为耶和华吩咐使用之工所拿来的，富富有余。」', ref: '出埃及记 36:5', hold: 5 },
          { text: '比撒列用皂荚木做柜，长二肘半，宽一肘半，高一肘半……<br>他用皂荚木做燔祭坛，是四方的……', ref: '出埃及记 37:1–38:1', hold: 6.5 },
          { text: '耶和华怎样吩咐的，他们就怎样做了。<br>摩西看见一切的工都做成了，就给他们祝福。', ref: '出埃及记 39:43', hold: 6.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.44, 8, b.instant);
              lv('snShine', 0.3, b); S.tabs = 'none'; S.shards = 0; S.calf = 'none';
              lv('snGifts', 1, b); lv('snCloud', 0.45, b); lv('snAltarA', 0, b);
              pose('moses', 'stand');
              crowdWalk('sn:folk', F.gift - 0.1, F.gift + 0.06, { pose: 'carry' });
              crowdPose('sn:mid', 'stand');
              add('bezalel', { label: '比撒列', sex: 'm', age: 'adult', x: F.parts[0] + 0.06, facing: 1, robe: ROBE.bezalel, from: b.instant ? 'none' : 'fade', v: 0.2 });
              add('oholiab', { label: '亚何利亚伯', sex: 'm', age: 'adult', x: F.parts[0] + 0.13, facing: -1, robe: ROBE.oholiab, from: b.instant ? 'none' : 'fade', v: 0.22 });
            }],
            [4, b => { lv('snParts', 1, b); pose('bezalel', 'kneel'); pose('oholiab', 'kneel'); }],
            [8.3, () => { crowdPose('sn:folk', 'stand'); pose('moses', 'point'); }],
            [14.6, () => { pose('bezalel', 'stand'); face('bezalel', 1); }],
            [22.4, b => { pose('moses', 'raise'); pose('oholiab', 'bow'); pose('bezalel', 'bow'); crowdPose('sn:folk', 'kneel'); if (!b.instant) sfx('harp'); }],
          ]);
        },
      },

      // ── 40 帐幕立起；云彩遮盖会幕，荣光充满帐幕 ─────────────────
      {
        kind: 'cmd', utter: '正月初一日，你要立起帐幕', cmd: 'mount 荣光 /会幕  # 云彩遮盖', ref: '40:2',
        verse: [
          { text: '第二年正月初一日，帐幕就立起来。<br>摩西立起帐幕，安上带卯的座，立上板，穿上闩，立起柱子。', ref: '出埃及记 40:17–18', hold: 7 },
          { text: '在帐幕和坛的四围立了院帷，把院子的门帘挂上。<br>这样，摩西就完了工。', ref: '出埃及记 40:33', hold: 6 },
          { text: '当时，云彩遮盖会幕，耶和华的荣光就充满了帐幕。', ref: '出埃及记 40:34', hold: 6 },
          { text: '日间，耶和华的云彩是在帐幕以上；夜间，云中有火，<br>在以色列全家的眼前。在他们所行的路上都是这样。', ref: '出埃及记 40:38', hold: 7.5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              lv('snRaise', 1, b); lv('snGifts', 0, b); lv('snShine', 0.25, b);
              W.goTo(0.5, 10, b.instant);
              // 众人退到西边，让摩西与新立的祭司亚伦站在院门前、看得清楚（竖屏太窄：他们站到众人前面一点）
              const c0 = Math.max(F.flock[1] + 0.01, F.folk[0] - 0.06);
              crowdWalk('sn:folk', c0, Math.max(c0 + 0.055, F.court[0] - 0.08), { pose: 'stand' });
              if (port()) { add('moses', { v: 0.2 }); add('aaron', { v: 0.26 }); }
              walk('moses', F.court[0] - 0.015, { speed: 0.04, pose: 'point' });
              walk('aaron', F.court[0] - 0.045, { speed: 0.035, pose: 'stand' });
              walk('bezalel', F.court[1] + 0.03, { speed: 0.04, pose: 'stand' });
              walk('oholiab', F.court[1] + 0.06, { speed: 0.04, pose: 'stand' });
            }],
            [9, b => {
              add('aaron', { robe: ROBE.priest, accent: GOLD, glow: 0.7 });
              if (!b.instant) {
                const p = fig('aaron');
                if (p && p._h > 0) safe('sinai.robe', () => fx().sparkle(p._x, p._y - p._h * 0.6, 26, [255, 230, 170], p._h * 0.4, 'air'));
                sfx('chime', { soft: true });
              }
            }],
            [15.6, () => { crowdFace('sn:folk', 1); pose('moses', 'stand'); face('bezalel', -1); face('oholiab', -1); }],
            [16.5, b => { lv('snCloud', 0.08, b); lv('snColumn', 1, b); if (!b.instant) sfx('wind', { soft: true }); }],
            [22.9, b => {
              lv('snGlory', 1, b);
              pose('moses', 'bow'); pose('aaron', 'bow'); crowdPose('sn:folk', 'kneel'); crowdPose('sn:mid', 'kneel'); pose('bezalel', 'kneel'); pose('oholiab', 'kneel');
              if (!b.instant) sfx('angel');
            }],
            [26, b => { W.goTo(0.96, 9, b.instant); lv('snFires', 1, b); }],
            [28.5, () => { crowdPose('sn:folk', 'kneel'); pose('moses', 'gaze'); pose('aaron', 'kneel'); }],
          ]);
        },
      },
    ],

    scene: {
      init() { layout(); loadFonts(); },
      resize() { layout(); TXT.clear(); },
      update,
      drawUnder(ctx, pass) {
        if (!cur()) return;
        if (pass === 'far') drawMount(ctx);
        else if (pass === 'mid') { drawTents(ctx, 1); drawMeet(ctx); drawBound(ctx); drawCampFires(ctx, 1); }
        else if (pass === 'near') {
          drawTents(ctx, 2);
          drawTabernacle(ctx);
          drawAltarPillars(ctx);
          drawCalf(ctx);
          drawShards(ctx);
          drawCampFires(ctx, 2);
        }
      },
      draw(ctx, pass) {
        if (!cur()) return;
        if (pass === 'far') {
          drawCleft(ctx);
          drawCap(ctx);
          drawPave(ctx);
          drawSmoke(ctx);
          drawSummitFire(ctx);
          drawWaves(ctx);
          drawPassing(ctx);
        } else if (pass === 'mid') {
          drawPillarM(ctx);
        } else if (pass === 'seaNear') {
          if (S.tabs === 'mosesM') drawHeld(ctx, 'mosesM', DEP(1));
        } else if (pass === 'near') {
          drawColumn(ctx);
        } else if (pass === 'air') {
          drawAirFire(ctx);
          drawEmbers(ctx);
          drawBolts(ctx);
          if (S.tabs === 'moses') drawHeld(ctx, 'moses', 0);
          drawShine(ctx);
          drawGifts(ctx);
          drawPartsLaid(ctx);
          drawTablets(ctx);
          drawPattern(ctx);
          drawEagle(ctx);
        }
      },
      reset() { WAVES.length = 0; BOLTS.length = 0; EMB.length = 0; },
      restore() { WAVES.length = 0; BOLTS.length = 0; EMB.length = 0; layout(); lastBound = Math.floor(W.lv.snBound * lay().bound.length); eagleDone = S.eagleT0; },
      sig() {
        return { tabs: S.tabs, tabN: S.tabN, tabsNew: S.tabsNew, pat: S.patN, lamp: S.lampLit, inc: S.incense, calf: S.calf, shards: S.shards, mPos: S.mPos };
      },
      pick(x, y, r) {
        if (!cur()) return null;
        let best = null;
        const put = (label, px, py, d) => { if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
        const l = lay(), m = l.m, H2 = hp(2), H1 = hp(1);
        // 法版（天上）
        if (W.lv.snTab > 0.3 && W.lv.snTabDown < 0.5) {
          const G = tabGeom();
          if (x > G.xs[1] && x < G.xs[0] + G.tw && y > G.y0 && y < G.y0 + G.th) put('法版', G.cx, G.y0 + G.th + W.h * 0.03 + 24, r * 0.4);
        }
        if (W.lv.snPattern > 0.3) {
          const R = patRect();
          if (x > R[0] && x < R[2] && y > R[1] && y < R[3]) put('样式', (R[0] + R[2]) / 2, R[3] + W.h * 0.03 + 24, r * 0.6);
        }
        if (W.lv.snPave > 0.3) put('蓝宝石', m.sx, m.sy - m.H * 0.08, Math.hypot(x - m.sx, (y - m.sy + m.H * 0.05) * 3));
        if (W.lv.snCleft > 0.3) put('磐石穴', m.cleft[0], m.cleft[1] - H1 * 1.5, Math.hypot(x - m.cleft[0], y - m.cleft[1] + H1 * 0.5));
        // 帐幕与云
        if (W.lv.snRaise > 0.3) {
          const G = tabGeomT();
          if (x > G.c0 && x < G.c1 && y > gY(2, x / W.w) - G.tentH - G.H * 0.3 && y < gY(2, x / W.w) + 4) put('帐幕', (G.t0 + G.t1) / 2, gY(2, (G.t0 + G.t1) / 2 / W.w) - G.tentH - G.H * 0.3, r * 0.5);
          if (W.lv.snColumn > 0.4 && Math.abs(x - (G.t0 + G.t1) / 2) < G.H * 1.2 && y < gY(2, x / W.w) - G.tentH - G.H * 0.4) put('云彩', (G.t0 + G.t1) / 2, y, r * 0.7);
        }
        if (W.lv.snMeet > 0.3) {
          const mx = F.meet * W.w, my = gY(1, F.meet);
          put('会幕', mx, my - H1 * 1.3, Math.hypot(x - mx, y - my + H1 * 0.5));
          if (W.lv.snPillarM > 0.4 && Math.abs(x - mx) < H1 && y < my - H1) put('云柱', mx, y, r * 0.7);
        }
        if (W.lv.snCalf > 0.3) { const cx = F.calf * W.w, cy = fieldY(F.calf, 0.06) - H2 * 0.45; put('金牛犊', cx, cy - H2 * 0.4, Math.hypot(x - cx, y - cy)); }
        if (S.tabs === 'broken' && S.shards) { const sx = S.shardX * W.w, sy = fieldY(S.shardX, 0.1); put('法版', sx, sy - H2 * 0.3, Math.hypot(x - sx, y - sy)); }
        if (W.lv.snAltar > 0.3 && W.lv.snAltarA > 0.5) {
          const ax = F.altar * W.w, ay = fieldY(F.altar, 0.1) - H2 * 0.2;
          put('坛', ax, ay - H2 * 0.5, Math.hypot(x - ax, y - ay));
          if (x > F.pil[0] * W.w && x < F.pil[1] * W.w) { const py = gY(2, x / W.w) - H2 * 0.5; if (Math.abs(y - py) < H2 * 0.6) put('十二根柱子', x, py - H2 * 0.6, r * 0.75); }
        }
        if (W.lv.snGifts > 0.3) { const gx = F.gift * W.w, gy = fieldY(F.gift, 0.3); put('礼物', gx, gy - H2 * 0.5, Math.hypot(x - gx, y - gy + H2 * 0.2)); }
        if (W.lv.snParts > 0.2 && W.lv.snRaise < 0.6) { const ax = lerp(F.parts[0], F.parts[1], 0.38) * W.w, ay = fieldY(lerp(F.parts[0], F.parts[1], 0.38), 0.38); put('约柜', ax, ay - H2 * 0.5, Math.hypot(x - ax, y - ay + H2 * 0.15)); }
        if (W.lv.snBound > 0.5 && x > 0.53 * W.w) { const by = gY(1, x / W.w); if (Math.abs(y - by) < H1 * 0.4) put('界限', x, by - H1 * 0.6, r * 0.8); }
        // 营（帐棚）
        for (const t of l.tentsN) { const tx = t.x * W.w, ty = fieldY(t.x, t.v); if (Math.abs(x - tx) < H2 * t.w * 0.5 && y > ty - H2 * t.h && y < ty + 2) put('以色列人的营', tx, ty - H2 * t.h - 4, r * 0.85); }
        // 山
        // 山：名字写在灵所在的山腰（不压在山顶的火、云与名字上）
        if (x > m.X(-0.9) && x < m.X(0.95)) {
          const u = (x - m.cx) / m.HW, ry = m.Y(u, kAt(u));
          if (y > ry - 6 && y < m.base) put('西奈山', x, Math.max(W.h * 0.13 + 24, Math.min(m.base - 4, ry + m.H * 0.35)), r * 0.9);
        }
        return best;
      },
    },
  });
})(window.GS);
