/* ─────────────────────────────────────────────────────────────
 * book/babel.js —— 卷「巴别」：创世记 10:1 — 11:32
 *
 * 洪水以后，挪亚三个儿子的后裔在地上分为邦国（列国之名如微光飘散，各归其地）；
 * 天下人往东迁移，在示拿地遇见一片平原——那时天下人的口音、言语都是一样
 * （同一种字从说者飞向听者，连成一道金色的线）；作砖、烧窑、拿石漆当灰泥，
 * 城与塔一层一层升起，塔顶要通天（一座巨大的剪影）；
 * 耶和华降临，要看看世人所建造的城和塔——一道光自天而降；
 * 「我们下去，在那里变乱他们的口音」——同一的字碎成万种文字，彼此不通；
 * 众人分散在全地上，塔停工未完，那城名叫巴别；
 * 闪的后代一代一代如季节经过，到他拉；他拉带着亚伯兰、撒莱、罗得出了迦勒底的吾珥，
 * 走到哈兰，就住在那里；他拉死在哈兰。
 *
 * 神在这一卷里说话很少：11:6–7 用神自己的话；末一句借神后来对亚伯兰说的话（15:7「我是耶和华，曾领你出了迦勒底的吾珥」）；
 * 其余是经文里描述神作为、或神所看见的短句（kind 'act'）——造砖、造塔的话是人自己说的，只在经文里出现，不由神口说出。
 * 布景：示拿平原上的城与塔（中丘层）、砖窑与晒砖场与石漆坑（近岸层）、吾珥与哈兰（中丘层两端）。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;
  const fx = () => GS.fx, cast = () => GS.cast, T = GS.book.timeline, au = () => GS.audio, ui = () => GS.ui;
  const ACT = 'babel';
  const cur = () => GS.book.current(ACT);
  const M = () => Math.min(W.w, W.h);
  const groundY = (layer, x) => (GS.land && GS.land.groundY ? GS.land.groundY(layer, x) : W.ridgeY(layer, x));
  const narrow = () => (W.w < 600 ? 1.15 : 1);
  const hmid = () => 34 * W.layerScale(1) * narrow();     // 中丘层上一个人的身高（像素）
  const hnear = () => 34 * W.layerScale(2) * narrow();    // 近岸层上一个人的身高
  const safe = U.safe;
  const say = (lines, delay) => { if (!W.replaying) safe('babel.narrate', () => ui().narrate(lines, { replace: false, delay: delay || 0 })); };
  const sfx = (name, o) => { if (W.replaying) return; const a = au(); if (a && a.sfx) safe('babel.sfx', () => a.sfx(name, o || {})); };

  // ── 本卷的程度（恢复时由 W.snapAll 对齐）────────────────────
  W.defineLevel('babelTower', 'lin', 0.032);   // 塔已建成的高度（占设计高度的比例；永远到不了 1）
  W.defineLevel('babelCity', 'lin', 0.06);     // 城：房屋与城墙
  W.defineLevel('babelYard', 'exp', 0.5);      // 砖窑、晒砖场、石漆坑
  W.defineLevel('babelWork', 'exp', 0.9);      // 工程的活动（窑火、塔上的工人、吊杆）
  W.defineLevel('babelOne', 'exp', 0.5);       // 同一的言语（众人之间的金线）
  W.defineLevel('babelShaft', 'exp', 0.45);    // 耶和华降临：自天而降的光
  W.defineLevel('babelAge', 'exp', 0.12);      // 岁月：塔与城的风化
  W.defineLevel('babelNations', 'exp', 0.35);  // 列国之名
  W.defineLevel('babelUr', 'exp', 0.3);        // 迦勒底的吾珥
  W.defineLevel('babelHaran', 'exp', 0.3);     // 哈兰（地名）
  const MY_LEVELS = ['babelTower', 'babelCity', 'babelYard', 'babelWork', 'babelOne', 'babelShaft', 'babelAge', 'babelNations', 'babelUr', 'babelHaran'];

  // ── 本卷的状态（只在 setup / apply / 情节里设定，恢复时可重演）──
  function fresh() {
    return {
      speech: 'none',      // 'none' | 'one'（同一的言语）| 'many'（变乱之后）| 'scatter'（分散）
      natT0: -1e9,         // 列国之名开始飘散的时刻（瞬间重演 = 早已散定）
      shaftT0: -1e9,       // 降临之光开始降下的时刻
      manyT0: -1e9,        // 口音变乱的时刻（此后八九秒，塔上的人各说各的）
      gens: [],            // 家谱之名 [{ name, x, t0 }]（仅在观看时出现）
      cairns: [],          // 石堆（坟）[{ x, t0 }]
    };
  }
  let S = fresh();

  // ── 颜色 ────────────────────────────────────────────────────
  const BRICK = [188, 130, 88], BRICK_OLD = [150, 126, 106], RAMP = [222, 182, 132], HOLE = [56, 36, 28], WOOD = [72, 54, 40];
  const MUD = [178, 144, 106], MUD_OLD = [140, 124, 108], WHITE = [214, 196, 166], KILN = [150, 100, 72], TENT = [66, 52, 46];
  const TRUNK = [92, 70, 50], FROND = [66, 96, 58], STONE = [150, 140, 126];
  const ROBE = { sem: [118, 98, 80], ham: [142, 94, 64], jap: [96, 104, 124], folk: null, nimrod: [120, 64, 48] };
  const TINT = [240, 200, 150];

  // ════════════════════════════════════════════════════════════
  //  文字：同一的言语，与变乱之后的万种文字（程序生成的字形，预渲染成图集）
  // ════════════════════════════════════════════════════════════
  const SCRIPT_RGB = [
    [255, 236, 190],  // 0 同一的言语：金白
    [255, 150, 118],  // 1 楔形
    [118, 222, 208],  // 2 如尼
    [196, 164, 255],  // 3 连笔
    [255, 206, 108],  // 4 悬笔
    [150, 230, 138],  // 5 方字
    [138, 190, 255],  // 6 圈点
    [255, 144, 196],  // 7 笔画
    [232, 232, 150],  // 8 回旋
  ];
  const NS = SCRIPT_RGB.length, NV = 6, CELL = 48;
  let atlas = null;
  function wedge(g, x, y, a, s) {
    const c = Math.cos(a), sn = Math.sin(a);
    const P = (p, q) => [x + p * c - q * sn, y + p * sn + q * c];
    const p1 = P(-0.35 * s, -0.45 * s), p2 = P(-0.35 * s, 0.45 * s), p3 = P(0.3 * s, 0);
    g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.lineTo(p3[0], p3[1]); g.closePath(); g.fill();
    const t1 = P(0.1 * s, 0), t2 = P(1.25 * s, 0);
    g.beginPath(); g.moveTo(t1[0], t1[1]); g.lineTo(t2[0], t2[1]); g.stroke();
  }
  function drawScript(g, s, r, k) {
    const R = (a, b) => a + r() * (b - a);
    const L = (x1, y1, x2, y2) => { g.moveTo(x1 * k, y1 * k); g.lineTo(x2 * k, y2 * k); };
    const dot = (x, y, rr) => { g.moveTo(x * k + rr * k, y * k); g.arc(x * k, y * k, rr * k, 0, TAU); };
    switch (s) {
      case 0: {   // 同一的言语：一竖为干，顶上一道回钩，旁点一点——字字同源
        g.beginPath();
        L(0, -0.82, 0, 0.86);
        g.moveTo(0, -0.82 * k); g.quadraticCurveTo(0.62 * k, -0.9 * k, 0.5 * k, -0.36 * k);
        const kind = Math.floor(r() * 3);
        if (kind === 0) { g.moveTo(0, 0.25 * k); g.quadraticCurveTo(-0.55 * k, 0.3 * k, -0.5 * k, 0.8 * k); }
        else if (kind === 1) { g.moveTo(0, 0.05 * k); g.quadraticCurveTo(0.5 * k, 0.12 * k, 0.55 * k, 0.6 * k); }
        else { L(-0.42, 0.42, 0.3, 0.42); }
        g.stroke();
        g.beginPath(); dot(-0.46, -0.3, 0.12); g.fill();
        break;
      }
      case 1: {   // 楔形
        const n = 2 + Math.floor(r() * 3), vert = r() < 0.45;
        for (let i = 0; i < n; i++) {
          const t = -0.66 + 1.32 * (i / (n - 1));
          const ang = vert ? (r() < 0.75 ? Math.PI / 2 : 0) : (r() < 0.75 ? 0 : Math.PI / 2);
          const x = vert ? R(-0.3, 0.1) : t - 0.2, y = vert ? t - 0.2 : R(-0.35, 0.35);
          wedge(g, x * k, y * k, ang, k * 0.36);
        }
        break;
      }
      case 2: {   // 如尼：一竿与斜枝
        g.beginPath();
        L(0, -0.88, 0, 0.88);
        const n = 1 + Math.floor(r() * 2);
        for (let i = 0; i < n; i++) {
          const y0 = R(-0.8, 0.1), d = r() < 0.5 ? -1 : 1;
          L(0, y0, d * 0.58, y0 + R(0.25, 0.55));
          if (r() < 0.4) L(0, y0 + 0.5, -d * 0.5, y0 + 0.2);
        }
        g.stroke();
        break;
      }
      case 3: {   // 连笔：一道起伏的线，一个圈，几点
        g.beginPath();
        g.moveTo(-0.9 * k, 0.3 * k);
        g.bezierCurveTo(-0.5 * k, 0.4 * k, -0.4 * k, R(-0.7, -0.3) * k, -0.05 * k, -0.1 * k);
        g.bezierCurveTo(0.2 * k, 0.2 * k, 0.05 * k, 0.5 * k, -0.15 * k, 0.32 * k);
        g.quadraticCurveTo(0.45 * k, R(0.0, 0.3) * k, 0.9 * k, 0.2 * k);
        g.stroke();
        g.beginPath(); dot(R(-0.5, 0.5), -0.62, 0.09); if (r() < 0.6) dot(R(-0.4, 0.4), 0.72, 0.08); g.fill();
        break;
      }
      case 4: {   // 悬笔：顶上一横，垂一竖，挂一钩
        g.beginPath();
        L(-0.9, -0.62, 0.9, -0.62);
        const xs = r() < 0.5 ? 0.45 : -0.45;
        L(xs, -0.62, xs, 0.86);
        g.moveTo(-xs * 0.3 * k, -0.62 * k);
        g.quadraticCurveTo(-xs * 1.9 * k, -0.1 * k, -xs * 0.4 * k, 0.2 * k);
        g.quadraticCurveTo(xs * 0.4 * k, 0.45 * k, -xs * 0.8 * k, 0.78 * k);
        g.stroke();
        break;
      }
      case 5: {   // 方字：方正的折笔
        g.beginPath();
        const top = r() < 0.8, bot = r() < 0.5, left = r() < 0.35;
        if (top) L(-0.7, -0.7, 0.66, -0.7);
        L(0.66, -0.7, 0.66, 0.82);
        if (bot) L(-0.7, 0.82, 0.66, 0.82);
        if (left || !top) L(-0.7, -0.7, -0.7, 0.2);
        L(-0.7, -0.7, -0.8, -0.45);
        if (r() < 0.5) L(-0.2, -0.2, -0.2, 0.5);
        g.stroke();
        break;
      }
      case 6: {   // 圈点
        g.beginPath();
        const cy = R(-0.3, 0.0);
        g.moveTo(0.42 * k, cy * k); g.arc(0, cy * k, 0.42 * k, 0, TAU);
        if (r() < 0.7) L(0, cy + 0.42, 0, 0.88); else L(0.42, cy, 0.85, cy);
        g.stroke();
        g.beginPath(); dot(0.66, R(-0.7, 0.7), 0.1); if (r() < 0.5) dot(-0.66, R(-0.7, 0.7), 0.1); g.fill();
        break;
      }
      case 7: {   // 笔画：横、竖、撇、点
        g.beginPath();
        L(-0.78, -0.34, 0.78, -0.42);
        if (r() < 0.8) L(-0.04, -0.88, 0.02, 0.86);
        g.moveTo(-0.06 * k, 0.02 * k); g.quadraticCurveTo(-0.3 * k, 0.5 * k, -0.74 * k, 0.76 * k);
        if (r() < 0.7) L(0.32, 0.18, 0.62, 0.52);
        if (r() < 0.4) L(-0.6, 0.15, 0.55, 0.12);
        g.stroke();
        break;
      }
      default: {  // 回旋
        g.beginPath();
        const turns = R(1.5, 2.4), dir = r() < 0.5 ? 1 : -1;
        for (let i = 0; i <= 40; i++) {
          const t = i / 40, a = dir * t * turns * TAU, rr = (0.1 + 0.78 * t) * k;
          const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
          if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.stroke();
      }
    }
  }
  function buildAtlas() {
    if (atlas) return atlas;
    const c = document.createElement('canvas');
    c.width = CELL * NV; c.height = CELL * NS;
    const g = c.getContext('2d');
    for (let s = 0; s < NS; s++) {
      const col = SCRIPT_RGB[s];
      for (let v = 0; v < NV; v++) {
        const r = U.mulberry32(9001 + s * 97 + v * 13);
        g.save();
        g.translate(v * CELL + CELL / 2, s * CELL + CELL / 2);
        g.strokeStyle = g.fillStyle = U.rgb(col[0], col[1], col[2]);
        g.lineWidth = 2.8; g.lineCap = 'round'; g.lineJoin = 'round';
        g.shadowColor = U.rgba(col[0], col[1], col[2], 0.95); g.shadowBlur = 6;
        drawScript(g, s, r, CELL * 0.3);
        g.restore();
      }
    }
    return (atlas = c);
  }

  // ── 预渲染：光晕、烟、降临之光、文字 ───────────────────────
  const SPR = {};
  function glowSprite(key, rgb, inner) {
    if (SPR[key]) return SPR[key];
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, U.rgba(rgb[0], rgb[1], rgb[2], 1));
    gr.addColorStop(inner || 0.28, U.rgba(rgb[0], rgb[1], rgb[2], 0.38));
    gr.addColorStop(1, U.rgba(rgb[0], rgb[1], rgb[2], 0));
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (SPR[key] = c);
  }
  function shaftSprite() {
    if (SPR.shaft) return SPR.shaft;
    const w = 64, h = 256, c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), img = g.createImageData(w, h), d = img.data;
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const vy = Math.min(1, v / 0.06) * (v > 0.7 ? Math.pow(Math.max(0, 1 - (v - 0.7) / 0.3), 1.7) : 1) * (0.75 + 0.25 * (1 - v));
      for (let x = 0; x < w; x++) {
        const hx = ((x + 0.5) / w) * 2 - 1;
        const a = vy * (Math.exp(-hx * hx * 5.5) * 0.7 + Math.exp(-hx * hx * 42) * 0.3);
        const i = (y * w + x) * 4;
        d[i] = 255; d[i + 1] = 245; d[i + 2] = 224; d[i + 3] = Math.round(255 * clamp(a, 0, 1));
      }
    }
    g.putImageData(img, 0, 0);
    return (SPR.shaft = c);
  }
  const FONT = '"GS Kai", "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "Noto Serif CJK SC", serif';
  const TXT = new Map();
  function textSprite(str, px, rgb) {
    const dpr = Math.min(2, W.dpr || 1), key = str + '|' + px + '|' + dpr + '|' + rgb.join(',');
    let s = TXT.get(key);
    if (s) return s;
    if (TXT.size > 160) TXT.clear();
    const c = document.createElement('canvas'), g = c.getContext('2d');
    const font = Math.round(px * dpr) + 'px ' + FONT;
    g.font = font;
    const tw = Math.ceil(g.measureText(str).width) + Math.ceil(18 * dpr);
    c.width = Math.max(4, tw); c.height = Math.ceil(px * 2 * dpr);
    g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = 'rgba(14, 9, 5, 0.75)'; g.shadowBlur = 5 * dpr;
    g.fillStyle = U.rgb(rgb[0], rgb[1], rgb[2]);
    g.fillText(str, c.width / 2, c.height / 2);
    g.shadowColor = U.rgba(rgb[0], rgb[1], rgb[2], 0.55); g.shadowBlur = 9 * dpr;
    g.fillText(str, c.width / 2, c.height / 2);
    s = { c, w: c.width / dpr, h: c.height / dpr };
    TXT.set(key, s);
    return s;
  }
  function loadFonts() {
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load('20px "GS Kai"', '巴别闪含雅弗').then(() => TXT.clear()).catch(() => {});
        if (document.fonts.ready) document.fonts.ready.then(() => TXT.clear()).catch(() => {});
      }
    } catch (e) { /* 老浏览器：用系统字 */ }
  }

  // ════════════════════════════════════════════════════════════
  //  列国之名（创 10）
  //  三族之名从三个儿子头上升起，先直上，再飘向各自的一方的天上（雅弗：靠海的一边；闪：中天；含：右边的天）。
  //  横屏时左边的天有朝阳、左边的海上有经文，所以名字都落在画面右边三分之二的高天上（那里天色深，字看得清）。
  //  一族接一族（10:2–5 雅弗、10:6–20 含、10:21–31 闪），同时可见的约十二个；每族留下两个名，其余渐隐。
  //  落点用拒绝采样排开（任两名的中心至少相距 1.3 × 字宽 × 字数），不叠在一起；左边海上的一片留给经文。
  // ════════════════════════════════════════════════════════════
  const FAM = {
    jap: { names: ['歌篾', '玛各', '玛代', '土巴', '米设', '提拉', '基提', '雅完', '他施'], keep: 2, src: 0.53, win: [0.4, 4.2], rgb: [214, 228, 255] },
    ham: { names: ['古实', '弗', '宁录', '西巴', '非利士', '西顿', '麦西', '迦南'], keep: 2, src: 0.72, win: [4.4, 8.4], rgb: [255, 214, 178] },
    sem: { names: ['以拦', '亚法撒', '路德', '亚兰', '法勒', '约坍', '亚述', '希伯'], keep: 2, src: 0.61, win: [8.6, 12.4], rgb: [244, 236, 204] },
  };
  const NAT_LIFE = 5;   // 渐隐之名的一生（秒）
  const NATIONS = [];
  (function nations() {
    const r = U.mulberry32(1011);
    for (const fam of ['jap', 'ham', 'sem']) {
      const F = FAM[fam], n = F.names.length;
      F.names.forEach((name, i) => {
        NATIONS.push({ name, fam, keep: i >= n - F.keep, src: F.src + (r() - 0.5) * 0.03, rgb: F.rgb,
          delay: lerp(F.win[0], F.win[1], i / (n - 1)), seed: r() * TAU, dx: 0, dy: 0 });
      });
    }
  })();
  const natPx = () => Math.round(clamp(15.5 * W.unit, 12, 20));
  function layoutNations() {
    const hy = (W.horizonY || W.h * 0.6) / W.h, tall = W.w / W.h <= 0.75;
    const box = (x0, y0, x1, y1) => [x0, y0, x1, Math.max(y0 + 0.08, y1)];
    const B = tall ? {
      jap: box(0.04, 0.34, 0.46, hy - 0.05),
      sem: box(0.3, 0.36, 0.72, hy - 0.06),
      ham: box(0.56, 0.35, 0.97, hy - 0.04),
    } : {
      jap: box(0.34, 0.11, 0.55, hy - 0.16),
      sem: box(0.56, 0.12, 0.77, hy - 0.14),
      ham: box(0.78, 0.12, 0.97, hy - 0.12),
    };
    const r = U.mulberry32(1013), px = natPx(), placed = [];
    const order = NATIONS.filter(n => n.keep).concat(NATIONS.filter(n => !n.keep));   // 留下的名先占好位置
    for (const n of order) {
      const b = B[n.fam], L = n.name.length;
      let best = null, bestS = -1;
      for (let k = 0; k < 90 && bestS < 1; k++) {
        const x = lerp(b[0], b[2], r()) * W.w, y = lerp(b[1], b[3], r()) * W.h;
        let s = 1e9;   // 与已放好的名之间最近的归一化距离（≥ 1 即互不相碰）
        for (const q of placed) s = Math.min(s, Math.hypot((x - q.x) / (px * (0.65 * (L + q.L) + 0.7)), (y - q.y) / (px * 1.9)));
        if (s > bestS) { bestS = s; best = [x, y]; }
      }
      n.dx = best[0]; n.dy = best[1];
      placed.push({ x: n.dx, y: n.dy, L });
    }
  }

  // ════════════════════════════════════════════════════════════
  //  布局：城、吾珥、哈兰（x 以画面比例存，尺寸以"人高"为单位——随屏幕缩放）
  // ════════════════════════════════════════════════════════════
  const TOWER_X = 0.72, N_TIER = 8, PLINTH = 0.035;
  const CITY_X = [0.585, 0.87], CITY_WIDE = [0.5, 0.965], UR_X = [0.497, 0.579], HARAN_X = [0.878, 0.995];
  const KILNS = [0.535, 0.598], STACK_X = 0.567, PIT_X = 0.482, BRICKS_X = [0.628, 0.752];
  let LAY = null;
  function houses(seed, x0, x1, opt) {
    const r = U.mulberry32(seed), hm = hmid(), out = [];
    for (let row = 0; row < 2; row++) {
      let x = x0 * W.w + r() * hm * 0.6;
      while (x < x1 * W.w) {
        const w = hm * (opt.w0 + r() * (opt.w1 - opt.w0)) * (row ? 1 : 0.9);
        const h = hm * (opt.h0 + r() * (opt.h1 - opt.h0)) * (row ? 1 : 1.12);
        out.push({ xf: (x + w / 2) / W.w, wk: w / hm, hk: h / hm, row, th: r() * 0.82, ruin: r(), door: r() < 0.6, win: r() < 0.75, dx: r() });
        x += w * (0.55 + r() * 0.6);
      }
    }
    return out;
  }
  function layout() {
    if (!W.w || !W.h) return;
    LAY = {
      w: W.w, h: W.h,
      city: houses(71, CITY_WIDE[0], CITY_WIDE[1], { w0: 1.0, w1: 2.1, h0: 1.05, h1: 1.7 }).map(hs => Object.assign(hs, { outer: hs.xf < CITY_X[0] || hs.xf > CITY_X[1] })),
      ur: houses(83, UR_X[0], UR_X[1], { w0: 0.9, w1: 1.6, h0: 0.9, h1: 1.35 }),
      haran: houses(97, HARAN_X[0] + 0.02, HARAN_X[1], { w0: 0.9, w1: 1.5, h0: 0.85, h1: 1.3 }),
    };
    layoutNations();
  }
  const lay = () => { if (!LAY || LAY.w !== W.w || LAY.h !== W.h) layout(); return LAY; };

  // 塔的尺度
  const TIERS = (function () {
    const hs = [];
    for (let i = 0; i < N_TIER; i++) hs.push(1 - i * 0.055);
    const sum = hs.reduce((a, b) => a + b, 0);
    let f = PLINTH;
    return hs.map((h, i) => { const th = (1 - PLINTH) * h / sum; const t = { i, f0: f, f1: f + th }; f += th; return t; });
  })();
  const wAt = (B, f) => B * (1 - 0.74 * f);
  function towerDims() {
    const cx = TOWER_X * W.w, Hf = W.h * 0.6, B = Math.min(W.w * 0.3, Hf * 0.62);
    let gy = 0;
    for (let k = -4; k <= 4; k++) gy = Math.max(gy, groundY(1, cx + k * B * 0.125));
    return { cx, Hf, B, gy, top: gy - W.lv.babelTower * Hf };
  }

  // ════════════════════════════════════════════════════════════
  //  众人的话语（字的粒子）
  // ════════════════════════════════════════════════════════════
  const SPEAK = ['bb:folk', 'bb:mold', 'bb:city'];
  const glyphs = [];
  const GLYPH_MAX = 440;
  let emitAcc = 0, buildT = 3, dustT = 0;
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  const sidOf = m => 1 + (hashStr(m.id || '') % (NS - 1));   // 变乱之后，各人自己的文字
  const gsz = layer => (layer === 1 ? 17 : 24) * Math.max(0.62, W.unit);
  function liveMembers(gids) {
    const out = [], C = GS.cast && GS.cast.crowds;
    if (!C) return out;
    for (const gid of gids) {
      const g = C.get(gid);
      if (!g) continue;
      for (const m of g.members) if (!m.dying && m.alpha > 0.55 && !(m.delay > 0)) out.push(m);
    }
    return out;
  }
  function headOf(m) {
    // 人物模块在上一帧画出时记下了脚下的位置与身高；没有时按比例估计
    if (m._vis && isFinite(m._x) && isFinite(m._y) && isFinite(m._h) && m._h > 0) return [m._x, m._y - m._h * 1.06];
    const x = m.nx * W.w;
    const h = 34 * W.layerScale(m.layer) * (m.age === 'child' ? 0.62 : 1) * (m.scale || 1) * narrow();
    return [x, groundY(m.layer, x) - h * 1.08];
  }
  function shard(x, y, s) {
    const a = rand(0, TAU), sp = rand(40, 170) * Math.max(0.6, W.unit);
    let vx = Math.cos(a) * sp;
    if (x < W.w * 0.56 && vx < 0) vx *= -0.6;   // 不往左边海上的经文里飞
    glyphs.push({ mode: 'shard', x, y, vx, vy: Math.sin(a) * sp - 40 * W.unit, grav: 30 * W.unit, drag: 1.1,
      rot: rand(-0.6, 0.6), vr: rand(-3, 3), t: 0, dur: rand(2, 3.4), s, v: U.randInt(0, NV - 1), size: gsz(2) * rand(1, 1.35) });
  }
  // 塔上的人：坡道上走着的、塔顶砌砖的、脚手架上的（与 drawTower 里画他们的位置一致）
  function towerSpots() {
    const lv = W.lv.babelTower, out = [];
    if (lv < 0.05) return out;
    const d = towerDims(), { cx, Hf, B, gy } = d, un = W.unit, built = lv * Hf, fh = hmid() * 0.34;
    for (const t of TIERS) {
      if (t.f1 * Hf > built) break;
      const yb = gy - t.f0 * Hf, yt = gy - t.f1 * Hf, wb = wAt(B, t.f0), wt = wb * 0.955, th = yb - yt, rt = th * 0.2, dir = t.i % 2 === 0 ? 1 : -1;
      const half = y => lerp(wb, wt, (yb - y) / th) / 2 - 2 * un;
      const C = [cx + dir * half(yt), yt], D = [cx - dir * half(yb - rt), yb - rt];
      for (const s of [0.15, 0.4, 0.65, 0.9]) out.push([lerp(D[0], C[0], s), lerp(D[1], C[1], s) - fh * 1.1]);
    }
    const topY = gy - built, wTop = wAt(B, clamp(lv, 0, 1)) * 0.97, tierH = Hf * 0.12 * clamp(lv * 2.6, 0.45, 1);
    for (const f of [-0.46, -0.3, -0.15, 0, 0.15, 0.3, 0.48]) out.push([cx + f * wTop, topY - fh * 1.1]);
    for (const f of [-0.46, -0.2, 0.06, 0.3, 0.48]) out.push([cx + f * wTop, topY - tierH * 0.4]);
    return out;
  }
  // 塔上的字：各人一种文字，飘向塔四围空旷的天
  function towerGlyph(p, i, cx, burst) {
    const un = Math.max(0.6, W.unit), side = p[0] < cx ? -1 : 1, up = p[1] < W.h * 0.25 ? 0.35 : 1;   // 塔顶的字多往两旁飘，不飘出画面顶上
    glyphs.push({ mode: 'shard', x: p[0], y: p[1], vx: side * rand(burst ? 14 : 12, burst ? 60 : 42) * un / Math.sqrt(up), vy: -rand(burst ? 24 : 14, burst ? 70 : 34) * un * up,
      grav: -5 * un * up, drag: 0.45, rot: rand(-0.4, 0.4), vr: rand(-1, 1), t: 0, dur: burst ? rand(3, 5) : rand(2.4, 3.6),
      s: 1 + (i % (NS - 1)), v: U.randInt(0, NV - 1), size: gsz(2) * (burst ? 1.6 : 1.35) * rand(0.85, 1.1) });
  }
  // 「变乱他们的口音」：空中同一的字与那道金线，一齐碎成万种文字——塔上、窑边，处处都是
  function shatter() {
    const old = glyphs.splice(0, glyphs.length);
    for (const g of old) for (let k = 0; k < 3; k++) shard(g.x, g.y, 1 + U.randInt(0, NS - 2));
    for (const line of threadLines()) {
      for (let i = 1; i < line.length; i++) {
        const a = line[i - 1], b = line[i], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (16 * Math.max(0.6, W.unit))));
        for (let j = 0; j < n; j++) { const t = j / n; shard(lerp(a[0], b[0], t), lerp(a[1], b[1], t), 1 + U.randInt(0, NS - 2)); }
      }
    }
    for (const m of liveMembers(SPEAK)) { const h = headOf(m); for (let k = 0; k < 2; k++) shard(h[0], h[1], sidOf(m)); }
    const cx = TOWER_X * W.w;
    towerSpots().forEach((p, i) => { for (let k = 0; k < 2; k++) towerGlyph(p, i, cx, true); });
    if (glyphs.length > GLYPH_MAX) glyphs.splice(0, glyphs.length - GLYPH_MAX);
  }
  // 变乱之后的八九秒里，塔上的人仍在说，各说各的
  let towerAcc = 0;
  function emitTower(dt) {
    const age = W.t - S.manyT0;
    if (age < 0 || age > 9.5) return;
    const spots = towerSpots();
    if (!spots.length) return;
    towerAcc += dt * 8 * (age < 7 ? 1 : 1 - (age - 7) / 2.5);
    const cx = TOWER_X * W.w;
    let guard = 6;
    while (towerAcc >= 1 && guard-- > 0 && glyphs.length < GLYPH_MAX) { towerAcc -= 1; const i = U.randInt(0, spots.length - 1); towerGlyph(spots[i], i, cx, false); }
    if (towerAcc > 2) towerAcc = 0;
  }
  function emit(dt) {
    if (S.speech === 'none' || W.replaying || W.ritual.holding) return;
    if (S.speech === 'many') emitTower(dt);
    const ms = liveMembers(SPEAK);
    if (!ms.length) return;
    const mode = S.speech;
    const rate = mode === 'one' ? 1.4 + 5.5 * W.lv.babelOne : mode === 'many' ? 3.4 : 2.6;
    emitAcc += dt * rate * Math.min(1.2, 0.3 + ms.length / 14);
    let guard = 6;
    while (emitAcc >= 1 && guard-- > 0 && glyphs.length < GLYPH_MAX) {
      emitAcc -= 1;
      const m = U.pick(ms), h = headOf(m), un = Math.max(0.6, W.unit);
      if (mode === 'one') {
        // 说给近旁的人听：同一种字循着一道弧，从说者飞到听者
        let o = null;
        for (let k = 0; k < 6 && !o; k++) { const c = U.pick(ms); if (c !== m && c.layer === m.layer && Math.abs(c.nx - m.nx) < 0.2) o = c; }
        const tg = o ? headOf(o) : [h[0] + rand(-60, 60) * un, h[1] - rand(16, 36) * un];
        glyphs.push({ mode: 'arc', sx: h[0], sy: h[1], tx: tg[0], ty: tg[1], hy: rand(18, 46) * un * (m.layer === 1 ? 0.65 : 1), x: h[0], y: h[1],
          t: 0, dur: rand(1.5, 2.3), s: 0, v: U.randInt(0, NV - 1), size: gsz(m.layer) * (0.9 + 0.25 * W.lv.babelOne), rot: 0 });
      } else if (mode === 'many') {
        // 各说各的：字一出口便散了，到不了旁人那里
        glyphs.push({ mode: 'drift', x: h[0], y: h[1], vx: rand(-20, 20) * un, vy: -rand(22, 40) * un, grav: 30 * un, drag: 1.2,
          rot: rand(-0.3, 0.3), vr: rand(-1.4, 1.4), t: 0, dur: rand(0.9, 1.5), s: sidOf(m), v: U.randInt(0, NV - 1), size: gsz(m.layer) });
      } else if (m.tx != null) {
        // 分散：各人的文字随着各人远去
        glyphs.push({ mode: 'drift', x: h[0], y: h[1], vx: -(m.facing || 1) * rand(4, 14) * un, vy: -rand(8, 20) * un, grav: 0, drag: 0.7,
          rot: 0, vr: rand(-0.5, 0.5), t: 0, dur: rand(1.3, 2.1), s: sidOf(m), v: U.randInt(0, NV - 1), size: gsz(m.layer) * 0.9 });
      }
    }
    if (emitAcc > 2) emitAcc = 0;
  }
  function stepGlyphs(dt) {
    for (let i = glyphs.length - 1; i >= 0; i--) {
      const g = glyphs[i];
      g.t += dt;
      if (g.t >= g.dur) { glyphs.splice(i, 1); continue; }
      if (g.mode === 'arc') {
        const e = U.easeInOut(g.t / g.dur);
        const mx = (g.sx + g.tx) / 2, my = Math.min(g.sy, g.ty) - g.hy;
        const a = 1 - e;
        g.x = a * a * g.sx + 2 * a * e * mx + e * e * g.tx;
        g.y = a * a * g.sy + 2 * a * e * my + e * e * g.ty;
      } else {
        const k = Math.exp(-g.drag * dt);
        g.vx *= k; g.vy = g.vy * k + g.grav * dt;
        g.x += g.vx * dt; g.y += g.vy * dt;
        g.rot += g.vr * dt;
      }
    }
  }
  // 同一的言语：近岸众人之间、中丘众人之间，各有一道金线
  function threadLines() {
    const out = [];
    for (const gids of [['bb:folk', 'bb:mold'], ['bb:city']]) {
      const ms = liveMembers(gids);
      if (ms.length < 2) continue;
      ms.sort((a, b) => a.nx - b.nx);
      out.push(ms.map((m, i) => { const h = headOf(m); return [h[0], h[1] - 9 * W.unit * (m.layer === 1 ? 0.6 : 1) - 3 * W.unit * Math.sin(W.t * 1.3 + i * 1.7)]; }));
    }
    return out;
  }

  // ════════════════════════════════════════════════════════════
  //  绘制
  // ════════════════════════════════════════════════════════════
  const lit = c => [Math.min(255, c[0] * 1.24 + 22), Math.min(255, c[1] * 1.2 + 18), Math.min(255, c[2] * 1.16 + 14)];
  const dim = (c, k) => [c[0] * k, c[1] * k, c[2] * k];
  const rimAlpha = () => (0.22 + 0.5 * W.dayFactor) * (1 - 0.6 * W.night);

  // ── 降临之光（天幕上：塔在光中成为剪影）──
  function drawShaft(ctx) {
    const k = W.lv.babelShaft;
    if (k < 0.01) return;
    const d = towerDims();
    const e = U.easeInOut(clamp((W.t - S.shaftT0) / 3.4, 0, 1));
    const top = -W.h * 0.08, bottom = lerp(W.h * 0.05, d.gy + 10 * W.unit, e);
    const len = bottom - top;
    if (len < 4) return;
    const w = Math.max(W.w * 0.15, d.B * 0.9);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = clamp(k * 0.62 * (0.9 + 0.1 * Math.sin(W.t * 1.3)), 0, 1);
    ctx.drawImage(shaftSprite(), d.cx - w / 2, top, w, len);
    ctx.globalAlpha = clamp(k * 0.4, 0, 1);
    ctx.drawImage(shaftSprite(), d.cx - w * 0.18, top, w * 0.36, len);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 塔 ──
  function drawTower(ctx) {
    const lv = W.lv.babelTower;
    if (lv < 0.002) return;
    const d = towerDims(), { cx, Hf, B, gy } = d, un = W.unit, hm = hmid();
    const depth = 0.38, age = W.lv.babelAge, work = W.lv.babelWork;
    const built = lv * Hf, topY = gy - built;
    const base = U.mixRGB(BRICK, BRICK_OLD, age * 0.75);
    const sunL = W.sun.x < cx;
    const cLit = W.shadeCSS(lit(base), depth, null, 0.06), cDark = W.shadeCSS(dim(base, 0.62), depth), cMid = W.shadeCSS(base, depth);
    const gr = ctx.createLinearGradient(cx - B * 0.6, 0, cx + B * 0.6, 0);
    gr.addColorStop(0, sunL ? cLit : cDark); gr.addColorStop(0.5, cMid); gr.addColorStop(1, sunL ? cDark : cLit);
    const rimC = W.shadeCSS(lit(lit(base)), depth, rimAlpha(), 0.15);
    const holeC = W.shadeCSS(HOLE, depth * 0.8);

    ctx.save();
    ctx.beginPath(); ctx.rect(cx - B, topY, B * 2, gy + 30 * un - topY); ctx.clip();
    // 台基
    const pw = B * 1.18, ph = PLINTH * Hf;
    ctx.fillStyle = gr;
    ctx.beginPath();
    ctx.moveTo(cx - pw / 2, gy + 16 * un); ctx.lineTo(cx - pw / 2 + 2 * un, gy - ph); ctx.lineTo(cx + pw / 2 - 2 * un, gy - ph); ctx.lineTo(cx + pw / 2, gy + 16 * un);
    ctx.closePath(); ctx.fill();
    // 各层
    const shown = [];
    ctx.beginPath();
    for (const t of TIERS) {
      if (t.f0 * Hf >= built) break;
      const yb = gy - t.f0 * Hf, yt = gy - t.f1 * Hf, wb = wAt(B, t.f0), wt = wb * 0.955;
      ctx.moveTo(cx - wb / 2, yb + 1); ctx.lineTo(cx - wt / 2, yt); ctx.lineTo(cx + wt / 2, yt); ctx.lineTo(cx + wb / 2, yb + 1); ctx.closePath();
      shown.push({ t, yb, yt, wb, wt, th: yb - yt, full: t.f1 * Hf <= built });
    }
    ctx.fill();
    // 砖的层理
    ctx.strokeStyle = W.shadeCSS(dim(base, 0.5), depth, 0.18);
    ctx.lineWidth = Math.max(0.5, 0.6 * un);
    ctx.beginPath();
    for (const s of shown) {
      for (let q = 1; q < 4; q++) {
        const y = s.yb - s.th * q / 4, hw = lerp(s.wb, s.wt, q / 4) / 2;
        ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y);
      }
    }
    ctx.stroke();
    // 拱门：每层一列
    ctx.fillStyle = holeC;
    ctx.beginPath();
    for (const s of shown) {
      const ah = Math.min(s.th * 0.42, hm * 1.05), aw = Math.max(1.2, Math.min(ah * 0.5, hm * 0.42));
      const yb = s.yb - s.th * 0.1, w = lerp(s.wb, s.wt, 0.3) * 0.84;
      const n = Math.max(2, Math.floor(w / (aw * 2.5)));
      for (let j = 0; j < n; j++) {
        const x = cx - w / 2 + (j + 0.5) * (w / n);
        ctx.moveTo(x - aw / 2, yb); ctx.lineTo(x - aw / 2, yb - ah + aw / 2);
        ctx.arc(x, yb - ah + aw / 2, aw / 2, Math.PI, 0);
        ctx.lineTo(x + aw / 2, yb); ctx.closePath();
      }
    }
    ctx.fill();
    // 盘旋而上的坡道（逐层折返）
    const rampC = W.shadeCSS(RAMP, depth, null, 0.04);
    const pts = [];
    ctx.fillStyle = rampC;
    ctx.beginPath();
    for (const s of shown) {
      const rt = s.th * 0.2, dir = s.t.i % 2 === 0 ? 1 : -1;
      const half = y => lerp(s.wb, s.wt, (s.yb - y) / s.th) / 2 - 2 * un;
      const A = [cx - dir * half(s.yb), s.yb], Bq = [cx + dir * half(s.yt + rt), s.yt + rt], C = [cx + dir * half(s.yt), s.yt], D = [cx - dir * half(s.yb - rt), s.yb - rt];
      ctx.moveTo(A[0], A[1]); ctx.lineTo(Bq[0], Bq[1]); ctx.lineTo(C[0], C[1]); ctx.lineTo(D[0], D[1]); ctx.closePath();
      pts.push({ A, Bq, C, D, full: s.full, i: s.t.i });
    }
    ctx.fill();
    ctx.strokeStyle = W.shadeCSS(dim(base, 0.42), depth, 0.8);
    ctx.lineWidth = Math.max(0.8, 1.3 * un);
    ctx.beginPath();
    for (const p of pts) { ctx.moveTo(p.A[0], p.A[1]); ctx.lineTo(p.Bq[0], p.Bq[1]); }
    ctx.stroke();
    // 正面的大阶梯（台基直上第一层）
    if (shown.length) {
      const s0 = shown[0], sw0 = B * 0.1, sw1 = B * 0.075, y0 = gy - ph, y1 = s0.yt;
      ctx.fillStyle = W.shadeCSS(RAMP, depth, null, 0.02);
      ctx.beginPath(); ctx.moveTo(cx - sw0 / 2, y0 + 1); ctx.lineTo(cx - sw1 / 2, y1); ctx.lineTo(cx + sw1 / 2, y1); ctx.lineTo(cx + sw0 / 2, y0 + 1); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = W.shadeCSS(dim(RAMP, 0.55), depth, 0.5);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.beginPath();
      const step = Math.max(2, 2.6 * un);
      for (let y = y0 - step; y > y1; y -= step) { const f = (y0 - y) / (y0 - y1), hw = lerp(sw0, sw1, f) / 2; ctx.moveTo(cx - hw, y); ctx.lineTo(cx + hw, y); }
      ctx.stroke();
    }
    // 迎光的边与各层的台沿
    ctx.strokeStyle = rimC;
    ctx.lineWidth = Math.max(0.8, 1.4 * un);
    ctx.beginPath();
    const sd = sunL ? -1 : 1;
    ctx.moveTo(cx + sd * pw / 2, gy + 4 * un); ctx.lineTo(cx + sd * (pw / 2 - 2 * un), gy - ph); ctx.lineTo(cx + sd * (pw / 2 - 2 * un) * 0.6, gy - ph);
    for (const s of shown) { ctx.moveTo(cx + sd * s.wb / 2, s.yb); ctx.lineTo(cx + sd * s.wt / 2, s.yt); ctx.lineTo(cx - sd * s.wt / 2 * 0.2, s.yt); }
    ctx.stroke();
    ctx.restore();

    // 未完工的塔顶：参差的砖、脚手架、吊杆
    const ftop = clamp(lv, 0, 1), wTop = wAt(B, ftop) * 0.97;
    const tierH = Hf * 0.12 * clamp(lv * 2.6, 0.45, 1);
    const r = U.mulberry32(4242 + Math.floor(lv * 40));
    ctx.fillStyle = gr;
    ctx.beginPath();
    const nb = Math.max(4, Math.floor(wTop / (5 * un)));
    for (let j = 0; j < nb; j++) {
      const hgt = r() * (3 + 3 * age) * un, x = cx - wTop / 2 + j * (wTop / nb);
      if (r() < 0.75) ctx.rect(x, topY - hgt, wTop / nb * 0.92, hgt + 1);
    }
    ctx.fill();
    const sc = 1 - age;
    if (sc > 0.02) {
      ctx.globalAlpha = sc;
      ctx.strokeStyle = W.shadeCSS(WOOD, depth);
      ctx.lineWidth = Math.max(0.7, 1.1 * un);
      ctx.beginPath();
      const xs = [-0.46, -0.2, 0.06, 0.3, 0.48].map(f => cx + f * wTop);
      const y0 = topY + tierH * 0.45, y1 = topY - tierH * (0.5 + 0.15 * work);
      xs.forEach(x => { ctx.moveTo(x, y0); ctx.lineTo(x, y1); });
      for (const yy of [topY - tierH * 0.22, topY + tierH * 0.18]) { ctx.moveTo(xs[0], yy); ctx.lineTo(xs[xs.length - 1], yy); }
      for (let j = 0; j < xs.length - 1; j += 2) { ctx.moveTo(xs[j], topY + tierH * 0.18); ctx.lineTo(xs[j + 1], topY - tierH * 0.22); }
      // 吊杆
      const px = cx + wTop * 0.18, py = topY - tierH * 1.15, bx = cx - wTop * 0.5, by = topY - tierH * 1.0;
      ctx.moveTo(px, topY); ctx.lineTo(px, py); ctx.lineTo(bx, by);
      ctx.stroke();
      const ly = by + tierH * (0.5 + 0.35 * Math.sin(W.t * 0.45) * work);
      ctx.lineWidth = Math.max(0.5, 0.6 * un);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, ly); ctx.stroke();
      ctx.fillStyle = W.shadeCSS(BRICK, depth);
      ctx.fillRect(bx - 3 * un, ly, 6 * un, 3.2 * un);
      ctx.globalAlpha = 1;
    }
    // 塔上的工人：沿坡道上下，顶上的在砌砖
    if (work > 0.03) {
      const fh = hm * 0.34, fw = fh * 0.3;
      ctx.globalAlpha = clamp(work, 0, 1);
      ctx.fillStyle = W.shadeCSS([58, 42, 32], depth);
      ctx.beginPath();
      for (const p of pts) {
        if (!p.full) continue;
        for (let j = 0; j < 2; j++) {
          const s = U.fract(W.t * 0.016 * (j ? 1 : -0.8) + j * 0.5 + p.i * 0.31);
          const x = lerp(p.D[0], p.C[0], s), y = lerp(p.D[1], p.C[1], s);
          ctx.rect(x - fw / 2, y - fh, fw, fh * 0.8);
          ctx.moveTo(x + fw * 0.45, y - fh * 1.08); ctx.arc(x, y - fh * 1.08, fw * 0.45, 0, TAU);
        }
      }
      for (let j = 0; j < 3; j++) {
        const x = cx + (-0.3 + j * 0.3) * wTop, bob = Math.abs(Math.sin(W.t * 3.2 + j * 1.9)) * fh * 0.18 * work;
        ctx.rect(x - fw / 2, topY - fh + bob, fw, fh * 0.8 - bob);
        ctx.moveTo(x + fw * 0.45, topY - fh * 1.08 + bob); ctx.arc(x, topY - fh * 1.08 + bob, fw * 0.45, 0, TAU);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // ── 城：房屋（后排 / 前排）与城墙 ──
  function drawHouses(ctx, list, row, k, o) {
    if (k <= 0.001) return;
    const hm = hmid(), depth = row ? 0.45 : 0.52, age = o.age || 0;
    const body = W.shadeCSS(U.mixRGB(o.rgb, MUD_OLD, age * 0.6), depth), rim = W.shadeCSS(lit(o.rgb), depth, rimAlpha(), 0.1), hole = W.shadeCSS(HOLE, depth);
    const sunL = W.sun.x < W.w * 0.5;
    const R = [];
    for (const hs of list) {
      if (hs.row !== row) continue;
      const v = o.grow ? clamp((k - hs.th) / 0.14, 0, 1) : 1;
      if (v <= 0) continue;
      const x = hs.xf * W.w, w = hs.wk * hm;
      if (o.skip && Math.abs(x - o.skip[0]) < o.skip[1] + w * 0.5) continue;
      const g = groundY(1, x) + (row ? 0.05 : -0.2) * hm;
      // 岁月：城的外围归于尘土（后来的吾珥、哈兰立在那里），城心只剩残垣
      const h = hs.hk * hm * U.easeOut(v) * (hs.outer ? 1 - age : 1 - age * hs.ruin * 0.5);
      if (h < 0.5) continue;
      R.push([x - w / 2, g - h, w, h + 3 * W.unit, hs]);
    }
    if (!R.length) return;
    ctx.globalAlpha = o.alpha == null ? 1 : o.alpha;
    ctx.fillStyle = body;
    ctx.beginPath();
    for (const q of R) ctx.rect(q[0], q[1], q[2], q[3]);
    ctx.fill();
    ctx.fillStyle = hole;
    ctx.beginPath();
    for (const q of R) {
      const hs = q[4];
      if (hs.door && q[3] > hm * 0.5) { const dw = Math.max(1, hm * 0.16), dh = Math.min(q[3] * 0.45, hm * 0.42); ctx.rect(q[0] + q[2] * (0.25 + 0.5 * hs.dx) - dw / 2, q[1] + q[3] - 3 * W.unit - dh, dw, dh); }
    }
    ctx.fill();
    ctx.strokeStyle = rim;
    ctx.lineWidth = Math.max(0.6, 1 * W.unit);
    ctx.beginPath();
    for (const q of R) { const ex = sunL ? q[0] : q[0] + q[2]; ctx.moveTo(ex, q[1] + q[3] * 0.7); ctx.lineTo(ex, q[1]); ctx.lineTo(q[0] + q[2] * 0.5, q[1]); }
    ctx.stroke();
    // 夜里的灯火（有人居住的城）
    if (o.lights && W.night > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = U.rgba(255, 196, 120, 0.85 * W.night * (o.alpha == null ? 1 : o.alpha));
      ctx.beginPath();
      for (const q of R) {
        const hs = q[4];
        if (!hs.win || q[3] < hm * 0.5) continue;
        const s = Math.max(1, hm * 0.1);
        ctx.rect(q[0] + q[2] * (0.72 - 0.4 * hs.dx), q[1] + q[3] * 0.3, s, s);
      }
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }
  function drawWall(ctx, k, age) {
    const v = clamp((k - 0.45) / 0.4, 0, 1);
    if (v <= 0) return;
    const hm = hmid(), un = W.unit;
    const x0 = CITY_X[0] * W.w, x1 = CITY_X[1] * W.w;
    const wh = hm * 0.62 * U.easeOut(v), cren = Math.max(2, hm * 0.2);
    const col = W.shadeCSS(U.mixRGB(MUD, MUD_OLD, age * 0.6), 0.42);
    ctx.fillStyle = col;
    ctx.beginPath();
    let x = x0, i = 0;
    while (x < x1) {
      const seg = cren * 2, xe = Math.min(x1, x + seg);
      const broken = age > 0.05 && U.hash1(i * 7 + 3) < age * 0.3;
      const g0 = groundY(1, x) + hm * 0.1, h = broken ? wh * 0.35 : wh;
      ctx.rect(x, g0 - h, xe - x + 0.5, h + 4 * un);
      if (!broken) ctx.rect(x, g0 - h - cren * 0.6, cren, cren * 0.6 + 1);
      x = xe; i++;
    }
    // 两座城门楼
    for (const f of [0.605, 0.845]) {
      const gx = f * W.w, g0 = groundY(1, gx) + hm * 0.1, tw = hm * 0.75, th = wh * 1.55;
      ctx.rect(gx - tw / 2, g0 - th, tw, th + 4 * un);
    }
    ctx.fill();
    ctx.fillStyle = W.shadeCSS(HOLE, 0.42);
    ctx.beginPath();
    for (const f of [0.605, 0.845]) {
      const gx = f * W.w, g0 = groundY(1, gx) + hm * 0.1, gw = hm * 0.26, gh = wh * 0.8;
      ctx.moveTo(gx - gw / 2, g0 + 1); ctx.lineTo(gx - gw / 2, g0 - gh + gw / 2); ctx.arc(gx, g0 - gh + gw / 2, gw / 2, Math.PI, 0); ctx.lineTo(gx + gw / 2, g0 + 1); ctx.closePath();
    }
    ctx.fill();
  }
  function palm(ctx, x, gy, H, lean, a) {
    ctx.globalAlpha = a;
    ctx.strokeStyle = W.shadeCSS(TRUNK, 0.45);
    ctx.lineWidth = Math.max(0.8, H * 0.05);
    const tx = x + lean * H * 0.3, ty = gy - H;
    ctx.beginPath(); ctx.moveTo(x, gy); ctx.quadraticCurveTo(x + lean * H * 0.05, gy - H * 0.55, tx, ty); ctx.stroke();
    ctx.strokeStyle = W.shadeCSS(FROND, 0.45);
    ctx.lineWidth = Math.max(0.8, H * 0.045);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a0 = -Math.PI / 2 + (i - 3) * 0.52 + Math.sin(W.t * 0.8 + i) * 0.04 + W.wind * 0.08;
      const L = H * (0.42 + 0.08 * (i % 2));
      const ex = tx + Math.cos(a0) * L, ey = ty + Math.sin(a0) * L * 0.5 + L * 0.45;
      ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a0) * L * 0.6, ty + Math.sin(a0) * L * 0.8, ex, ey);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  function tent(ctx, x, w, h, a) {
    const gy = groundY(1, x) + hmid() * 0.06;
    ctx.globalAlpha = a;
    ctx.fillStyle = W.shadeCSS(TENT, 0.42);
    ctx.beginPath();
    ctx.moveTo(x - w / 2, gy + 2); ctx.lineTo(x - w * 0.42, gy - h * 0.7);
    ctx.quadraticCurveTo(x - w * 0.2, gy - h * 1.05, x, gy - h * 0.9); ctx.quadraticCurveTo(x + w * 0.2, gy - h * 1.05, x + w * 0.42, gy - h * 0.7);
    ctx.lineTo(x + w / 2, gy + 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = W.shadeCSS(HOLE, 0.3);
    ctx.fillRect(x - w * 0.08, gy - h * 0.5, w * 0.16, h * 0.5 + 1);
    if (W.night > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * W.night * 0.8;
      const s = h * 1.4;
      ctx.drawImage(glowSprite('lamp', [255, 190, 110]), x - s / 2, gy - h * 0.25 - s / 2, s, s);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
  }

  // ── 近岸：砖窑、晒砖场、砖垛、石漆坑 ──
  function drawYard(ctx) {
    const k = W.lv.babelYard;
    if (k < 0.01) return;
    const hn = hnear(), un = W.unit, fire = clamp(W.lv.babelWork * k, 0, 1);
    // 石漆坑
    {
      const x = PIT_X * W.w, gy = groundY(2, x) + hn * 0.2, rx = hn * 0.85, ry = hn * 0.13;
      ctx.globalAlpha = k;
      ctx.fillStyle = W.shadeCSS([30, 23, 20], 0);
      ctx.beginPath(); ctx.ellipse(x, gy, rx, ry, 0, 0, TAU); ctx.fill();
      const t = W.t * 0.6;
      ctx.strokeStyle = U.rgba(150 + 70 * Math.sin(t), 140 + 70 * Math.sin(t + 2.1), 190 + 60 * Math.sin(t + 4.2), 0.22 * (0.3 + 0.7 * W.daylight));
      ctx.lineWidth = Math.max(0.6, 1.1 * un);
      ctx.beginPath(); ctx.ellipse(x - rx * 0.12, gy - ry * 0.2, rx * 0.6, ry * 0.45, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // 晒砖：一排排摊在地上的砖坯（近处的大，远处的小）
    {
      const x0 = BRICKS_X[0] * W.w, x1 = BRICKS_X[1] * W.w;
      const cA = W.shadeCSS([184, 118, 78], 0), cB = W.shadeCSS([204, 142, 96], 0);
      const pathA = new Path2D(), pathB = new Path2D();
      for (let r = 0; r < 3; r++) {
        const sc = 1 + r * 0.14, bw = hn * 0.17 * sc, bh = hn * 0.055 * sc, sp = hn * 0.27 * sc;
        const n = Math.floor((x1 - x0) / sp), show = Math.floor(n * clamp(k * 1.25 - r * 0.12, 0, 1));
        for (let i = 0; i < show; i++) {
          const x = x0 + i * sp + (r % 2) * sp * 0.4, y = groundY(2, x) + hn * (0.1 + r * 0.14);
          ((i + r) % 3 ? pathA : pathB).rect(x, y, bw, bh);
        }
      }
      ctx.fillStyle = cA; ctx.fill(pathA);
      ctx.fillStyle = cB; ctx.fill(pathB);
    }
    // 砖垛
    {
      const x = STACK_X * W.w, gy = groundY(2, x) + 1, bw = hn * 0.2, bh = hn * 0.08, rows = Math.round(4 * clamp(k * 1.2, 0, 1));
      ctx.fillStyle = W.shadeCSS([190, 126, 84], 0);
      ctx.beginPath();
      for (let j = 0; j < rows; j++) for (let i = 0; i < 4 - j; i++) ctx.rect(x - (4 - j) * bw * 0.55 + i * bw * 1.1, gy - (j + 1) * bh * 1.08, bw, bh);
      ctx.fill();
    }
    // 砖窑
    for (let i = 0; i < KILNS.length; i++) {
      const x = KILNS[i] * W.w, gy = groundY(2, x);
      const kh = hn * 1.15 * U.easeOut(k), kw = hn * 1.35;
      if (kh < 1) continue;
      ctx.fillStyle = W.shadeCSS(KILN, 0);
      ctx.beginPath();
      ctx.moveTo(x - kw / 2, gy + 3);
      ctx.bezierCurveTo(x - kw * 0.54, gy - kh * 0.72, x - kw * 0.26, gy - kh, x - kw * 0.1, gy - kh);
      ctx.lineTo(x + kw * 0.1, gy - kh);
      ctx.bezierCurveTo(x + kw * 0.26, gy - kh, x + kw * 0.54, gy - kh * 0.72, x + kw / 2, gy + 3);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = W.shadeCSS(lit(KILN), 0, rimAlpha() * 0.8, 0.1);
      ctx.lineWidth = Math.max(0.6, 1.1 * un);
      ctx.stroke();
      // 窑口的火
      const fl = fire * (0.78 + 0.22 * Math.sin(W.t * 9 + i * 2) * Math.sin(W.t * 5.3 + i));
      const mw = kw * 0.3, mh = kh * 0.44;
      ctx.fillStyle = U.rgb(lerp(34, 255, fl), lerp(22, 150, fl), lerp(18, 60, fl));
      ctx.beginPath();
      ctx.moveTo(x - mw / 2, gy + 1); ctx.lineTo(x - mw / 2, gy - mh + mw / 2); ctx.arc(x, gy - mh + mw / 2, mw / 2, Math.PI, 0); ctx.lineTo(x + mw / 2, gy + 1); ctx.closePath();
      ctx.fill();
      if (fl > 0.02) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = clamp(fl * (0.3 + 0.45 * W.night + 0.2 * W.dusk), 0, 1);
        const s = kw * 1.9;
        ctx.drawImage(glowSprite('fire', [255, 140, 60]), x - s / 2, gy - mh * 0.45 - s / 2, s, s);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        // 烟
        const sm = glowSprite('smoke', [200, 196, 190], 0.5);
        for (let j = 0; j < 7; j++) {
          const s2 = U.fract(W.t * 0.07 + j / 7 + i * 0.37);
          const sx = x + Math.sin(s2 * 3 + j + i) * 5 * un + (W.wind * 0.8 + 0.4) * s2 * 40 * un, sy = gy - kh - s2 * hn * 3.6;
          const r2 = hn * (0.18 + s2 * 0.55);
          ctx.globalAlpha = clamp(fire * (1 - s2) * Math.min(1, s2 * 6) * 0.3 * (0.35 + 0.65 * W.daylight), 0, 1);
          ctx.drawImage(sm, sx - r2, sy - r2, r2 * 2, r2 * 2);
        }
        ctx.globalAlpha = 1;
      }
    }
  }

  // ── 石堆（坟）：哈兰死在吾珥；他拉死在哈兰 ──
  function drawCairns(ctx) {
    if (!S.cairns.length) return;
    const hn = hnear();
    for (const c of S.cairns) {
      const a = clamp((W.t - c.t0) / 2, 0, 1);
      if (a <= 0) continue;
      const x = c.x * W.w, gy = groundY(2, x) + 1, s = hn * 0.13;
      ctx.globalAlpha = a;
      ctx.fillStyle = W.shadeCSS(STONE, 0);
      ctx.beginPath();
      ctx.ellipse(x - s * 0.9, gy - s * 0.5, s, s * 0.6, 0, 0, TAU);
      ctx.ellipse(x + s * 0.9, gy - s * 0.55, s * 0.95, s * 0.62, 0, 0, TAU);
      ctx.ellipse(x, gy - s * 1.45, s * 0.9, s * 0.55, 0, 0, TAU);
      ctx.ellipse(x + s * 0.1, gy - s * 2.2, s * 0.55, s * 0.4, 0, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = a * (0.18 + 0.35 * W.night + 0.1 * Math.sin(W.t * 1.1 + c.x * 20));
      const g = hn * 1.1;
      ctx.drawImage(glowSprite('soul', [255, 236, 200]), x - g / 2, gy - s * 2.4 - g / 2, g, g);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }
  }

  // ── 空中：金线、话语的字、列国之名、家谱之名、降临时的光尘 ──
  function drawThread(ctx) {
    const k = W.lv.babelOne;
    if (k < 0.02) return;
    const lines = threadLines();
    if (!lines.length) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = U.rgba(255, 228, 170, (pass ? 0.42 : 0.1) * k * (0.85 + 0.15 * Math.sin(W.t * 2)));
      ctx.lineWidth = (pass ? 1.3 : 5) * Math.max(0.7, W.unit);
      ctx.beginPath();
      for (const L of lines) {
        ctx.moveTo(L[0][0], L[0][1]);
        for (let i = 1; i < L.length - 1; i++) ctx.quadraticCurveTo(L[i][0], L[i][1], (L[i][0] + L[i + 1][0]) / 2, (L[i][1] + L[i + 1][1]) / 2);
        ctx.lineTo(L[L.length - 1][0], L[L.length - 1][1]);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function drawGlyphs(ctx) {
    if (!glyphs.length) return;
    const A = buildAtlas();
    // 白昼里用覆盖（字在亮天上仍看得清），夜里用叠光
    const add = W.night > 0.45;
    ctx.globalCompositeOperation = add ? 'lighter' : 'source-over';
    // 同一的言语：字后面拖着一缕淡淡的弧
    ctx.strokeStyle = add ? 'rgba(255, 232, 186, 0.13)' : 'rgba(255, 238, 200, 0.3)';
    ctx.lineWidth = Math.max(0.6, 0.9 * W.unit);
    ctx.beginPath();
    for (const g of glyphs) {
      if (g.mode !== 'arc') continue;
      const e = U.easeInOut(g.t / g.dur), mx = (g.sx + g.tx) / 2, my = Math.min(g.sy, g.ty) - g.hy;
      const e0 = Math.max(0, e - 0.35);
      for (let j = 0; j <= 6; j++) {
        const q = lerp(e0, e, j / 6), a = 1 - q;
        const x = a * a * g.sx + 2 * a * q * mx + q * q * g.tx, y = a * a * g.sy + 2 * a * q * my + q * q * g.ty;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    for (const g of glyphs) {
      const e = g.t / g.dur;
      const a = Math.min(1, g.t / 0.16) * (e > 0.62 ? 1 - (e - 0.62) / 0.38 : 1) * (g.mode === 'arc' ? 0.9 : 0.95);
      if (a <= 0.01) continue;
      ctx.globalAlpha = a;
      const sz = g.size;
      if (g.rot) {
        ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.rot);
        ctx.drawImage(A, g.v * CELL, g.s * CELL, CELL, CELL, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      } else ctx.drawImage(A, g.v * CELL, g.s * CELL, CELL, CELL, g.x - sz / 2, g.y - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // 名与名不相叠：按固定的次序一个个放，后放的若与先放的相碰，就沿纵向推开
  // （dir：-1 向上；0 各自远离）；推开的多少随横向相叠的程度平滑地增减——名字飘过彼此时不会跳
  const LB = [];
  function lbl(i) { return LB[i] || (LB[i] = { x: 0, y: 0, tw: 0, th: 0, a: 0, sp: null }); }
  function unclutter(m, dir) {
    const g = Math.max(2, 3 * W.unit);
    for (let i = 1; i < m; i++) {
      const P = LB[i];
      for (let it = 0; it < 4; it++) {
        let moved = false;
        for (let j = 0; j < i; j++) {
          const Q = LB[j];
          if (Q.a < 0.04) continue;
          const ox = (P.tw + Q.tw) * 0.5 + g - Math.abs(P.x - Q.x);
          if (ox <= 0) continue;
          const H = (P.th + Q.th) * 0.5 + g * 0.5;
          const d = dir || (P.y >= Q.y ? 1 : -1);
          const need = d > 0 ? Q.y + H - P.y : P.y - (Q.y - H);
          if (need <= 0.25) continue;
          P.y += d * need * U.smoothstep(0, 2 * g, ox);
          moved = true;
        }
        if (!moved) break;
      }
    }
  }
  function drawLabels(ctx, m) {
    for (let i = 0; i < m; i++) {
      const L = LB[i];
      if (L.a <= 0.004) continue;
      ctx.globalAlpha = clamp(L.a, 0, 1);
      ctx.drawImage(L.sp.c, L.x - L.sp.w / 2, L.y - L.sp.h / 2, L.sp.w, L.sp.h);
    }
    ctx.globalAlpha = 1;
  }
  // 次序：留下的名先放（它们最后停在那里），渐隐的名后放
  const NAT_ORDER = [];
  function drawNations(ctx) {
    const k = W.lv.babelNations;
    if (k < 0.01) return;
    if (!lay()) return;
    const px = natPx(), hn = hnear();
    if (!NAT_ORDER.length) for (const keep of [true, false]) for (const n of NATIONS) if (n.keep === keep) NAT_ORDER.push(n);
    let m = 0;
    for (const n of NAT_ORDER) {
      const age = W.t - S.natT0 - n.delay;
      if (age <= 0) continue;
      if (!n.keep && age >= NAT_LIFE) continue;
      const born = clamp(age / 0.9, 0, 1);
      const t = U.easeInOut(clamp(age / (n.keep ? 5 : 4), 0, 1)), u = 1 - t;
      // 自父亲头上升起：先直上（y 走得早），再横飘到自己的一方（x 走得晚）——不从左边海上的经文里穿过
      const sx = n.src * W.w, sy = groundY(2, sx) - hn * 1.3;
      const x = sx + t * t * (n.dx - sx) + Math.sin(W.t * 0.3 + n.seed) * 4 * W.unit * t;
      const y = sy + (1 - u * u) * (n.dy - sy) + Math.cos(W.t * 0.23 + n.seed) * 3 * W.unit * t;
      const a = n.keep ? 0.62 + 0.33 * u : (0.95 - 0.2 * t) * clamp((NAT_LIFE - age) / 1.3, 0, 1);
      const sp = textSprite(n.name, px, n.rgb), L = lbl(m++);
      L.x = x; L.y = y; L.sp = sp; L.tw = Math.max(px, sp.w - 16); L.th = px * 1.1; L.a = k * born * a;
    }
    unclutter(m, 0);
    drawLabels(ctx, m);
  }
  function drawGens(ctx) {
    if (!S.gens.length) return;
    const px = Math.round(clamp(16 * W.unit, 12, 20)), hn = hnear();
    let m = 0;
    // 新的一代先放（正在他头上），先前各代的名若与之相碰，就往上让开
    for (let gi = S.gens.length - 1; gi >= 0; gi--) {
      const g = S.gens[gi];
      const age = W.t - g.t0;
      if (age < 0 || age > 13) continue;
      const a = clamp(age / 0.9, 0, 1) * (age > 4.5 ? clamp(1 - (age - 4.5) / 8, 0, 1) : 1);
      if (a <= 0.01) continue;
      const x = g.x * W.w, gy = groundY(2, x), y = gy - hn * 1.75 - age * 2.2 * W.unit;
      // 先祖的微光：一代人如一盏灯，亮起，又隐去
      const fade = clamp(1 - (age - 1.5) / 3, 0, 1) * clamp(age / 0.6, 0, 1);
      if (fade > 0.01) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = fade * (0.35 + 0.35 * W.night);
        const s = hn * 2.2;
        ctx.drawImage(glowSprite('soul', [255, 236, 200]), x - s / 2, gy - hn * 0.6 - s / 2, s, s);
        ctx.globalCompositeOperation = 'source-over';
      }
      const sp = textSprite(g.name, px, [255, 234, 190]), L = lbl(m++);
      L.x = x; L.y = y; L.sp = sp; L.tw = Math.max(px, sp.w - 16); L.th = px * 1.1; L.a = a;
    }
    ctx.globalAlpha = 1;
    unclutter(m, -1);
    drawLabels(ctx, m);
  }
  function drawDescent(ctx) {
    const k = W.lv.babelShaft;
    if (k < 0.01) return;
    const d = towerDims(), e = U.easeInOut(clamp((W.t - S.shaftT0) / 3.4, 0, 1));
    ctx.globalCompositeOperation = 'lighter';
    const gs = d.B * 1.3;
    ctx.globalAlpha = clamp(k * e * 0.3, 0, 1);
    ctx.drawImage(glowSprite('gold', [255, 232, 186]), d.cx - gs / 2, d.top - gs / 2, gs, gs);
    ctx.fillStyle = 'rgb(255, 244, 222)';
    const bottom = lerp(0, d.gy, e);
    for (let i = 0; i < 28; i++) {
      const s = U.fract(W.t * 0.05 + i * 0.618);
      const y = s * d.gy;
      if (y > bottom) continue;
      const x = d.cx + (U.hash1(i * 13 + 5) - 0.5) * d.B * 0.7 + Math.sin(W.t * 0.7 + i) * 6 * W.unit;
      ctx.globalAlpha = clamp(k * Math.sin(Math.PI * s) * 0.7, 0, 1);
      const z = (1 + (i % 3) * 0.5) * Math.max(0.7, W.unit);
      ctx.fillRect(x - z / 2, y - z / 2, z, z);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 中丘层：城（后排）→ 塔 → 城（前排、城墙）→ 吾珥 → 哈兰 ──
  function drawMid(ctx) {
    const L = lay();
    if (!L) return;
    const city = W.lv.babelCity, age = W.lv.babelAge;
    const d = towerDims(), skip = [d.cx, W.lv.babelTower > 0.01 ? wAt(d.B, 0) * 0.52 : 0];
    drawHouses(ctx, L.city, 0, city, { rgb: MUD, grow: true, age });
    drawTower(ctx);
    drawHouses(ctx, L.city, 1, city, { rgb: MUD, grow: true, age, skip });
    drawWall(ctx, city, age);
    const ur = W.lv.babelUr, hr = W.lv.babelHaran, hm = hmid();
    if (ur > 0.01) {
      palm(ctx, 0.503 * W.w, groundY(1, 0.503 * W.w) + 1, hm * 2.3, -0.4, ur);
      drawHouses(ctx, L.ur, 0, 1, { rgb: WHITE, alpha: ur, lights: true });
      drawHouses(ctx, L.ur, 1, 1, { rgb: WHITE, alpha: ur, lights: true });
      palm(ctx, 0.572 * W.w, groundY(1, 0.572 * W.w) + 1, hm * 2.0, 0.3, ur);
    }
    if (hr > 0.01) {
      drawHouses(ctx, L.haran, 0, 1, { rgb: WHITE, alpha: hr, lights: true });
      palm(ctx, 0.935 * W.w, groundY(1, 0.935 * W.w) + 1, hm * 2.2, -0.3, hr);
      drawHouses(ctx, L.haran, 1, 1, { rgb: WHITE, alpha: hr, lights: true });
      for (const f of [0.878, 0.905]) tent(ctx, f * W.w, hm * 1.5, hm * 0.72, hr);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  每帧
  // ════════════════════════════════════════════════════════════
  function update(dt) {
    if (!cur()) { if (glyphs.length) glyphs.length = 0; return; }
    stepGlyphs(dt);
    emit(dt);
    if (W.replaying) return;
    // 塔在长高时，顶上扬起砖尘
    if (W.lv.babelTower < W.lt.babelTower - 0.002 && W.lv.babelWork > 0.3) {
      dustT -= dt;
      if (dustT <= 0) {
        dustT = 0.35;
        const d = towerDims(), w = wAt(d.B, W.lv.babelTower);
        safe('babel.dust', () => fx().dust(d.cx + rand(-0.4, 0.4) * w, d.top + 2, 5, [224, 188, 148], w * 0.25));
      }
    }
    // 敲打之声（工程进行时）
    if (W.lv.babelWork > 0.6 && W.lv.babelTower > 0.05) {
      buildT -= dt;
      if (buildT <= 0) { buildT = rand(3.5, 6.5); sfx('build', { soft: true }); }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  情节助手
  // ════════════════════════════════════════════════════════════
  const GENS = ['闪', '亚法撒', '沙拉', '希伯', '法勒', '拉吴', '西鹿', '拿鹤', '他拉'];
  const genX = k => 0.9 - k * 0.05;
  const genId = k => (k === GENS.length - 1 ? 'terah' : 'bb:g' + k);
  function spiritRing(c) { if (!c.instant) safe('babel.ring', () => fx().ring(c.x, c.y, TINT, M() * 0.28, 1.8, 1.5)); }
  // 地上的走兽绕开主要人物与布景所在的几段（W.beastAvoid：近岸层上宽度比例的区间；每卷开始时引擎会清空）
  const avoid = (...rs) => { W.beastAvoid = rs; };
  function animal(id, o) {
    const C = cast();
    if (!C || !C.animal) return null;
    return safe('babel.animal', () => C.animal(id, o));
  }

  // ════════════════════════════════════════════════════════════
  //  登记本卷
  // ════════════════════════════════════════════════════════════
  GS.book.act({
    id: ACT, title: '巴别', sub: '创世记 10:1 — 11:32', tint: TINT,
    intro: [{ text: '挪亚的儿子闪、含、雅弗的后代记在下面。<br>洪水以后，他们都生了儿子。', ref: '创世记 10:1', hold: 6 }],
    outro: 34,
    // 书成之后，按住本卷的人与物，显出它的经文
    behold: {
      '巴别塔': { text: '他们说：「来吧！我们要建造一座城和一座塔，塔顶通天，<br>为要传扬我们的名，免得我们分散在全地上。」', ref: '创世记 11:4' },
      '巴别城': { text: '因为耶和华在那里变乱天下人的言语，使众人分散在全地上，<br>所以那城名叫巴别。', ref: '创世记 11:9' },
      '巴别城（荒）': { text: '于是耶和华使他们从那里分散在全地上；<br>他们就停工，不造那城了。', ref: '创世记 11:8' },
      '砖窑': { text: '他们彼此商量说：「来吧！我们要作砖，把砖烧透了。」<br>他们就拿砖当石头，又拿石漆当灰泥。', ref: '创世记 11:3' },
      '石漆坑': { text: '他们彼此商量说：「来吧！我们要作砖，把砖烧透了。」<br>他们就拿砖当石头，又拿石漆当灰泥。', ref: '创世记 11:3' },
      '示拿的百姓': { text: '那时，天下人的口音、言语都是一样。', ref: '创世记 11:1' },
      '雅弗的后裔': { text: '这些人的后裔将各国的地土、海岛分开居住，<br>各随各的方言、宗族立国。', ref: '创世记 10:5' },
      '含的后裔': { text: '这些都是挪亚三个儿子的宗族，各随他们的支派立国。<br>洪水以后，他们在地上分为邦国。', ref: '创世记 10:32' },
      '闪的后裔': { text: '这些都是挪亚三个儿子的宗族，各随他们的支派立国。<br>洪水以后，他们在地上分为邦国。', ref: '创世记 10:32' },
      '宁录': { text: '古实又生宁录，他为世上英雄之首。', ref: '创世记 10:8' },
      '希伯': { text: '希伯活到三十四岁，生了法勒。', ref: '创世记 11:16' },
      '他拉': { text: '他拉共活了二百零五岁，就死在哈兰。', ref: '创世记 11:32' },
      '亚伯兰': { text: '他拉活到七十岁，生了亚伯兰、拿鹤、哈兰。', ref: '创世记 11:26' },
      '拿鹤': { text: '他拉活到七十岁，生了亚伯兰、拿鹤、哈兰。', ref: '创世记 11:26' },
      '撒莱': { text: '撒莱不生育，没有孩子。', ref: '创世记 11:30' },
      '罗得': { text: '他拉的后代记在下面。<br>他拉生亚伯兰、拿鹤、哈兰；哈兰生罗得。', ref: '创世记 11:27' },
      '迦勒底的吾珥': { text: '耶和华又对他说：「我是耶和华，曾领你出了迦勒底的吾珥，<br>为要将这地赐你为业。」', ref: '创世记 15:7' },
      '哈兰': { text: '他们走到哈兰，就住在那里。', ref: '创世记 11:31' },
    },
    setup() {
      // 示拿的平原：干燥的土地
      GS.W.set('bare', 0.3, true); GS.W.set('bloom', 0.3, true);
      S = fresh();
      glyphs.length = 0; emitAcc = 0; towerAcc = 0;
      avoid([0.49, 0.7]);
      const L = { deep: 1, light: 1, gather: 1, dayNight: 1, vault: 1, clouds: 1, land: 1, grass: 1, herbs: 1, trees: 0.24,
        lights: 1, moon: 1, stars: 1, life: 1, good: 0, sabbath: 0, given: 1 };
      for (const k in L) if (W.hasLevel(k)) W.set(k, L[k], true);
      for (const k of MY_LEVELS) W.set(k, 0, true);
      // 示拿是一片平原：树只在最西边（画面右缘）留下一棵幼小的
      const gx = W.w * 0.66, tx = W.w * 0.995;
      W.setOrigin('grass', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('herbs', gx, W.ridgeBaseY(2, gx));
      W.setOrigin('trees', tx, W.ridgeBaseY(2, tx));
      W.freeClock = false;
      W.goTo(0.33, 0, true);
      const lx = W.w * 0.78, ly = W.ridgeBaseY(2, lx);
      W.setPop('fish', 140, W.w * 0.15, W.h * 0.8, true);
      W.setPop('whale', 3, W.w * 0.12, W.h * 0.78, true);
      W.setPop('bird', 40, W.w * 0.6, W.h * 0.3, true);
      W.setPop('cattle', 5, lx, ly, true);
      W.setPop('beast', 3, lx, ly, true);
      W.setPop('creeper', 24, lx, ly, true);
      W.setPop('human', 0, lx, ly, true);
      cast().clear({ fade: false });
      cast().add('japheth', { label: '雅弗', x: 0.53, facing: -1, robe: ROBE.jap, from: 'none' });
      cast().add('shem', { label: '闪', x: 0.6, facing: 1, robe: ROBE.sem, from: 'none' });
      cast().add('ham', { label: '含', x: 0.66, facing: 1, robe: ROBE.ham, from: 'none' });
      layout();
    },
    stages: [
      // ── 10:1–32 列国 ──────────────────────────────────────
      {
        kind: 'act', utter: '他们在地上分为邦国', cmd: 'fork 挪亚 → 闪 · 含 · 雅弗 --spread 邦国', ref: '10:32',
        verse: [
          { text: '这些人的后裔将各国的地土、海岛分开居住，<br>各随各的方言、宗族立国。', ref: '创世记 10:5', hold: 6.5 },
          { text: '这些都是挪亚三个儿子的宗族，各随他们的支派立国。<br>洪水以后，他们在地上分为邦国。', ref: '创世记 10:32', hold: 7 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.4, 12, b.instant);
              W.set('babelNations', 1, b.instant);
              S.natT0 = b.instant ? -1e9 : W.t;
              avoid([0.44, 0.75]);
              cast().crowd('bb:jap', { n: 6, x0: 0.47, x1: 0.56, layer: 2, label: '雅弗的后裔', robe: ROBE.jap });
              cast().crowd('bb:ham', { n: 6, x0: 0.62, x1: 0.72, layer: 2, label: '含的后裔', robe: ROBE.ham });
              cast().crowd('bb:sem', { n: 7, x0: 0.55, x1: 0.7, layer: 1, label: '闪的后裔', robe: ROBE.sem });
              if (!b.instant) {
                for (const id of ['japheth', 'shem', 'ham']) {
                  const p = cast().get(id);
                  if (p) fx().ring(p.nx * W.w, groundY(2, p.nx * W.w) - hnear() * 0.6, [255, 232, 196], M() * 0.18, 2.2, 1.5);
                }
                sfx('crowd', { soft: true });
              }
            }],
            [4.2, b => {
              avoid([0.4, 0.52], [0.58, 0.66], [0.78, 0.99]);
              cast().crowdWalk('bb:jap', 0.42, 0.5);
              cast().walk('japheth', 0.48, { pose: 'point' });
              cast().crowdWalk('bb:ham', 0.8, 0.97);
              cast().walk('ham', 0.8, { pose: 'stand' });
              cast().crowdWalk('bb:sem', 0.76, 0.97);
              cast().walk('shem', 0.62, { pose: 'stand' });
              if (!b.instant) sfx('wind', { soft: true });
            }],
          ]);
        },
      },

      // ── 10:8–10 · 11:1–2 示拿平原 ──────────────────────────
      {
        kind: 'act', utter: '在示拿地遇见一片平原', cmd: 'mv 天下人 --east 示拿平原  # lang = 一', ref: '11:2',
        verse: [
          { text: '古实又生宁录，他为世上英雄之首。', ref: '创世记 10:8', hold: 4.5 },
          { text: '他国的起头是巴别、以力、亚甲、甲尼，都在示拿地。', ref: '创世记 10:10', hold: 5.5 },
          { text: '他们往东边迁移的时候，<br>在示拿地遇见一片平原，就住在那里。', ref: '创世记 11:2', hold: 6 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.goTo(0.48, 14, b.instant);
              W.set('babelNations', 0, b.instant);
              for (const id of ['shem', 'ham', 'japheth']) cast().remove(id);
              for (const g of ['bb:jap', 'bb:ham', 'bb:sem']) cast().removeCrowd(g);
              // 他们自西而来，往东迁移（东在画面左边）
              cast().add('nimrod', { label: '宁录', x: 1.04, layer: 2, robe: ROBE.nimrod, from: 'none', facing: -1 });
              cast().walk('nimrod', 0.69, { pose: 'point', speed: 0.04 });
              cast().crowd('bb:folk', { n: 9, x0: 1.05, x1: 1.32, layer: 2, label: '示拿的百姓', from: 'none' });
              cast().crowd('bb:mold', { n: 6, x0: 1.08, x1: 1.36, layer: 2, label: '示拿的百姓', from: 'none' });
              cast().crowd('bb:city', { n: 10, x0: 1.03, x1: 1.3, layer: 1, label: '示拿的百姓', from: 'none' });
              cast().crowdWalk('bb:folk', 0.6, 0.8);
              cast().crowdWalk('bb:mold', 0.5, 0.63);
              cast().crowdWalk('bb:city', 0.6, 0.88);
              avoid([0.47, 0.84]);
              S.speech = 'one';
              W.set('babelOne', 0.35, b.instant);
              if (!b.instant) sfx('crowd', { soft: true });
            }],
          ]);
        },
      },

      // ── 11:1–3 同一的言语；作砖、烧砖、石漆 ────────────────
      //    说出的是神所看见的：天下人的口音、言语都是一样（金线大亮）；作砖、造塔的是人自己
      {
        kind: 'act', utter: '天下人的口音、言语都是一样', cmd: 'locale -a | wc -l  # → 1', ref: '11:1–3',
        verse: [
          { text: '那时，天下人的口音、言语都是一样。', ref: '创世记 11:1', hold: 5 },
          { text: '他们彼此商量说：「来吧！我们要作砖，把砖烧透了。」<br>他们就拿砖当石头，又拿石漆当灰泥。', ref: '创世记 11:3', hold: 8 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.set('babelOne', 0.75, b.instant);
              W.goTo(0.55, 14, b.instant);
              if (!b.instant) sfx('crowd', { soft: true });
            }],
            [5, b => {
              avoid([0.45, 0.82]);
              W.set('babelYard', 1, b.instant);
              W.set('babelWork', 1, b.instant);
              cast().crowdWalk('bb:mold', 0.5, 0.63, { pose: 'kneel' });
              cast().crowdWalk('bb:folk', 0.6, 0.77, { pose: 'carry' });
              if (!b.instant) {
                for (const f of KILNS) fx().dust(f * W.w, groundY(2, f * W.w), 24, [214, 170, 130], hnear() * 0.6);
                sfx('fire');
              }
            }],
            [7.6, b => {
              W.set('babelTower', 0.13, b.instant);
              W.set('babelCity', 0.22, b.instant);
              cast().crowdWalk('bb:city', 0.6, 0.86, { pose: 'carry' });
              if (!b.instant) sfx('build');
            }],
          ]);
        },
      },

      // ── 11:4–5 城和塔；耶和华降临 ─────────────────────────
      //    人说「塔顶通天」，城与塔一层层升起；神降临要看看——一道光自天而降
      {
        kind: 'act', utter: '耶和华降临，要看看世人所建造的城和塔', cmd: 'watch 城 塔 --descend  # 为要传扬我们的名', ref: '11:4–5',
        verse: [
          { text: '他们说：「来吧！我们要建造一座城和一座塔，塔顶通天，<br>为要传扬我们的名，免得我们分散在全地上。」', ref: '创世记 11:4', hold: 8.5 },
          { text: '耶和华降临，要看看世人所建造的城和塔。', ref: '创世记 11:5', hold: 5 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              avoid([0.45, 0.86]);
              W.goTo(0.61, 18, b.instant);
              W.set('babelYard', 1, b.instant);
              W.set('babelWork', 1, b.instant);
              W.set('babelTower', 0.58, b.instant);
              W.set('babelCity', 1, b.instant);
              cast().pose('nimrod', 'raise');
              if (!b.instant) sfx('build');
            }],
            [5, () => { cast().crowdWalk('bb:folk', 0.64, 0.84, { pose: 'carry' }); }],
            [9, b => {
              // 耶和华降临：光自天而降，落在塔上（造塔的人还不知道，仍在搬砖）
              S.shaftT0 = b.instant ? -1e9 : W.t;
              W.set('babelShaft', 1, b.instant);
              if (!b.instant) sfx('harp', { soft: true });
            }],
            [11, b => { cast().crowdWalk('bb:folk', 0.57, 0.76, { pose: 'carry' }); if (!b.instant) sfx('build'); }],
            [15, () => { cast().crowdWalk('bb:city', 0.62, 0.85, { pose: 'carry' }); cast().pose('nimrod', 'point'); }],
          ]);
        },
      },

      // ── 11:6 看哪，一样的人民 ─────────────────────────────
      {
        kind: 'judge', utter: '看哪，他们成为一样的人民', cmd: 'review 城 塔  # 一样的人民，一样的言语', ref: '11:6', hold: 3,
        verse: [
          { text: '耶和华说：「看哪，他们成为一样的人民，都是一样的言语，<br>如今既作起这事来，以后他们所要作的事就没有不成就的了。', ref: '创世记 11:6', hold: 8.5 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.set('babelShaft', 1, b.instant);   // 光已在上一句降下（11:5）
              W.goTo(0.665, 12, b.instant);
              if (!b.instant) sfx('harp', { soft: true });
            }],
            [2.4, b => {
              W.set('babelOne', 1, b.instant);
              W.set('babelTower', 0.86, b.instant);
              W.set('babelWork', 1, b.instant);
              cast().pose('nimrod', 'raise');
            }],
          ]);
        },
      },

      // ── 11:7 变乱口音 ─────────────────────────────────────
      {
        kind: 'cmd', utter: '我们下去，在那里变乱他们的口音', cmd: 'i18n --confuse 口音  # 使他们的言语彼此不通', ref: '11:7', hold: 3.6,
        verse: [
          { text: '「我们下去，在那里变乱他们的口音，<br>使他们的言语彼此不通。」', ref: '创世记 11:7', hold: 7 },
        ],
        apply(c) {
          T(c, [
            [0, b => {
              W.set('babelOne', 0, b.instant);
              W.set('babelWork', 0.22, b.instant);
              W.set('babelShaft', 1, b.instant);
              W.goTo(0.715, 10, b.instant);
              S.speech = 'many';
              S.manyT0 = b.instant ? -1e9 : W.t;
              if (!b.instant) {
                shatter();
                const d = towerDims();
                fx().ring(d.cx, d.top, [255, 238, 206], M() * 0.95, 2.8, 2.2);
                fx().ring(d.cx, d.top, [255, 190, 150], M() * 0.55, 2.0, 1.4);
                W.flash = 0.55;
                W.shake = 0.7;
                sfx('wind');
              }
            }],
            [0.9, b => {
              cast().crowdWalk('bb:folk', 0.57, 0.8, { pose: 'point' });
              cast().crowdWalk('bb:mold', 0.5, 0.64, { pose: 'raise' });
              cast().crowdWalk('bb:city', 0.6, 0.87, { pose: 'stand' });
              cast().pose('nimrod', 'stand');
              if (!b.instant) sfx('crowd');
            }],
            [3.5, b => { W.set('babelShaft', 0.5, b.instant); }],
          ]);
        },
      },

      // ── 11:8–9 分散；那城名叫巴别 ─────────────────────────
      {
        kind: 'act', utter: '耶和华使他们从那里分散在全地上', cmd: 'abort build 巴别塔 && scatter --all-earth', ref: '11:8',
        verse: [
          { text: '于是耶和华使他们从那里分散在全地上；<br>他们就停工，不造那城了。', ref: '创世记 11:8', hold: 6.5 },
          { text: '因为耶和华在那里变乱天下人的言语，使众人分散在全地上，<br>所以那城名叫巴别。', ref: '创世记 11:9', hold: 8 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              W.set('babelWork', 0, b.instant);
              W.set('babelShaft', 0, b.instant);
              W.set('babelOne', 0, b.instant);
              W.goTo(0.75, 16, b.instant);
              S.speech = 'scatter';
              avoid([0.45, 0.78]);
              for (const g of SPEAK) cast().scatter(g);
              cast().walk('nimrod', 1.12, { speed: 0.03 });
              if (!b.instant) sfx('wind', { soft: true });
            }],
            [5, b => {
              if (b.instant) return;
              // 那城的名，由塔上的砖尘聚成
              const d = towerDims(), size = M() * 0.12;
              const nx = clamp(d.cx - d.B * 0.95 - size * 0.6, size * 1.3, W.w - size * 1.3), ny = W.horizonY * 0.5;
              fx().nameStr('巴别', nx, ny, size, [236, 180, 126], () => {
                const f = Math.random() * W.lv.babelTower;
                return [d.cx + (Math.random() - 0.5) * wAt(d.B, f) * 0.9, d.gy - f * d.Hf, [226, 170, 120]];
              }, { hold: 4 });
              if (au() && au().nameChime) safe('babel.chime', () => au().nameChime('巴'));
            }],
            [8, () => { cast().remove('nimrod'); }],
            [11, () => { S.speech = 'none'; }],
          ]);
        },
      },

      // ── 11:10–26 闪的后代 ─────────────────────────────────
      {
        kind: 'act', utter: '闪的后代记在下面', cmd: 'git log --first-parent 闪..他拉', ref: '11:10',
        verse: [
          { text: '闪的后代记在下面。<br>……闪一百岁生了亚法撒。', ref: '创世记 11:10', hold: 6 },
        ],
        apply(c) {
          spiritRing(c);
          const beats = [
            [0, b => {
              W.passDay(28, b.instant);
              W.set('babelAge', 1, b.instant);
              W.set('babelYard', 0, b.instant);
              W.set('babelWork', 0, b.instant);
              S.speech = 'none';
              avoid();
              for (const g of SPEAK) cast().removeCrowd(g);   // 分散的人若还在路上，也在夜色里隐去
              cast().remove('nimrod');
            }],
            [12, b => { W.set('babelUr', 1, b.instant); }],
            [10.4, () => say([{ text: '希伯活到三十四岁，生了法勒。', ref: '创世记 11:16', hold: 4.5 }])],
            [21.4, () => say([{ text: '他拉活到七十岁，生了亚伯兰、拿鹤、哈兰。', ref: '创世记 11:26', hold: 5.5 }])],
            [22.6, () => {
              avoid([0.4, 0.61]);
              cast().add('haran', { label: '哈兰', x: 0.465, facing: 1, robe: [112, 96, 84], from: 'light', glow: 0.45 });
              cast().add('abram', { label: '亚伯兰', x: 0.535, facing: -1, robe: [128, 100, 76], from: 'light', glow: 0.5 });
              cast().add('nahor', { label: '拿鹤', x: 0.567, facing: -1, robe: [104, 90, 96], from: 'light', glow: 0.45 });
            }],
            [25.5, () => {
              cast().add('lot', { label: '罗得', age: 'child', x: 0.44, facing: 1, robe: [120, 104, 88], from: 'light', glow: 0.45 });
              say([{ text: '他拉的后代记在下面。<br>他拉生亚伯兰、拿鹤、哈兰；哈兰生罗得。', ref: '创世记 11:27', hold: 5.5 }]);
            }],
          ];
          // 一代一代如季节经过：子出现在父的东边（左），父渐渐隐去
          GENS.forEach((name, k) => {
            const t = 1.2 + k * 2.4, x = genX(k), id = genId(k);
            beats.push([t, b => {
              if (k < GENS.length - 1) avoid([x - 0.05, x + 0.05]); else avoid([0.46, 0.55]);
              cast().add(id, { label: name, x, facing: -1, robe: k % 2 ? [124, 104, 86] : [112, 98, 92], from: 'light', glow: 0.55, age: k === GENS.length - 1 ? 'elder' : 'adult', prop: k === GENS.length - 1 ? 'staff' : undefined });
              if (!b.instant) {
                S.gens.push({ name, x, t0: W.t });
                fx().sparkle(x * W.w, groundY(2, x * W.w) - hnear() * 0.6, 14, [255, 236, 200], 10, 'near');
              }
            }]);
            if (k < GENS.length - 1) beats.push([t + 1.5, () => { cast().remove(id); }]);
          });
          T(c, beats);
        },
      },

      // ── 11:27–32 他拉出了吾珥，到哈兰 ────────────────────
      {
        kind: 'call', utter: '我是耶和华，曾领你出了迦勒底的吾珥', cmd: 'mv 他拉家 吾珥 → 哈兰  # 迦南: pending', ref: '15:7',
        verse: [
          { text: '哈兰死在他的本地迦勒底的吾珥，在他父亲他拉之先。', ref: '创世记 11:28', hold: 5.5 },
          { text: '撒莱不生育，没有孩子。', ref: '创世记 11:30', hold: 4 },
        ],
        apply(c) {
          spiritRing(c);
          T(c, [
            [0, b => {
              avoid([0.4, 0.62]);
              W.goTo(0.52, 9, b.instant);
              W.set('babelUr', 1, b.instant);
              cast().pose('haran', 'lie');
              cast().face('terah', 'haran');
              cast().pose('terah', 'bow');
            }],
            [3, b => {
              const p = cast().get('haran');
              const x = p ? p.nx : 0.465;
              cast().remove('haran');
              S.cairns.push({ x, t0: b.instant ? -1e9 : W.t });
              if (!b.instant) { fx().sparkle(x * W.w, groundY(2, x * W.w) - hnear() * 0.3, 18, [255, 236, 206], 12, 'near'); sfx('weep', { soft: true }); }
              cast().pose('terah', 'stand');
              cast().walk('lot', 0.49, { pose: 'stand', speed: 0.02 });
            }],
            [4.5, () => {
              cast().add('sarai', { label: '撒莱', sex: 'f', x: 0.552, facing: -1, robe: [150, 112, 100], from: 'fade', glow: 0.35 });
              cast().walk('nahor', 0.59, { pose: 'stand', speed: 0.02 });
            }],
            [8, b => {
              // 他拉带着亚伯兰、撒莱、罗得往西去（画面右边）；拿鹤留在吾珥
              cast().walk('terah', 0.83, { speed: 0.026 });
              cast().walk('abram', 0.858, { speed: 0.026 });
              cast().walk('sarai', 0.88, { speed: 0.026 });
              cast().walk('lot', 0.806, { speed: 0.026 });
              cast().face('nahor', 1);
              avoid([0.4, 0.62], [0.76, 0.92]);
              W.set('babelHaran', 1, b.instant);
              animal('bb:donkey', { kind: 'donkey', x: 0.51, layer: 2, follow: 'abram' });
              animal('bb:sheep1', { kind: 'sheep', x: 0.47, layer: 2, follow: 'lot' });
              animal('bb:sheep2', { kind: 'sheep', x: 0.455, layer: 2, follow: 'lot' });
              say([{ text: '他拉带着他儿子亚伯兰和他孙子哈兰的儿子罗得，并他儿妇亚伯兰的妻子撒莱，<br>出了迦勒底的吾珥，要往迦南地去；他们走到哈兰，就住在那里。', ref: '创世记 11:31', hold: 9 }]);
            }],
            [12, b => { W.goTo(0.738, 16, b.instant); }],
            [21, () => {
              // 慢的机器上脚步可能落后于情节：他拉此刻必须已在哈兰
              const p = cast().get('terah');
              if (p && Math.abs(p.nx - 0.83) > 0.03) cast().place('terah', 0.83);
              cast().pose('terah', 'sit'); cast().pose('sarai', 'sit');
            }],
            [23.5, b => {
              cast().pose('terah', 'lie');
              cast().face('abram', 'terah');
              cast().pose('abram', 'kneel', { weep: true });
              say([{ text: '他拉共活了二百零五岁，就死在哈兰。', ref: '创世记 11:32', hold: 6.5 }]);
              if (!b.instant) sfx('weep', { soft: true });
            }],
            [26.5, b => {
              const x = 0.83;
              cast().remove('terah');
              S.cairns.push({ x, t0: b.instant ? -1e9 : W.t });
              if (!b.instant) fx().sparkle(x * W.w, groundY(2, x * W.w) - hnear() * 0.3, 26, [255, 238, 210], 14, 'near');
            }],
            [29, () => {
              // 亚伯兰起来，面向西方——迦南还在前头
              cast().pose('abram', 'stand', { weep: false });
              cast().face('abram', 1);
              cast().pose('sarai', 'stand');
              cast().face('sarai', 1);
            }],
          ]);
        },
      },
    ],

    scene: {
      init() { layout(); loadFonts(); },
      resize() { layout(); glyphs.length = 0; },
      update,
      drawUnder(ctx, pass) {
        if (!cur()) return;
        if (pass === 'sky') drawShaft(ctx);
        else if (pass === 'mid') drawMid(ctx);
        else if (pass === 'near') { drawYard(ctx); drawCairns(ctx); }
      },
      draw(ctx, pass) {
        if (!cur() || pass !== 'air') return;
        drawDescent(ctx);
        drawThread(ctx);
        drawGlyphs(ctx);
        drawNations(ctx);
        drawGens(ctx);
      },
      reset() { glyphs.length = 0; },
      restore() { glyphs.length = 0; emitAcc = 0; layout(); },
      pick(x, y, r) {
        if (!cur()) return null;
        let best = null;
        const put = (label, px, py, d) => { if (d < r && (!best || d < best.d)) best = { label, x: px, y: py, d }; };
        const hm = hmid(), hn = hnear();
        const lv = W.lv.babelTower;
        if (lv > 0.03) {
          const d = towerDims();
          if (y > d.top - 12 && y < d.gy + 4) {
            const f = clamp((d.gy - y) / d.Hf, 0, 1), hw = wAt(d.B, f) / 2;
            put('巴别塔', d.cx, d.top - 6, Math.max(r * 0.55, Math.abs(x - d.cx) - hw));
          }
        }
        if (W.lv.babelCity > 0.2 && x > CITY_X[0] * W.w && x < CITY_X[1] * W.w) {
          const gy = groundY(1, x);
          if (y > gy - hm * 1.8 && y < gy + hm * 0.5) put(W.lv.babelAge > 0.5 ? '巴别城（荒）' : '巴别城', x, gy - hm * 1.9, r * 0.7);
        }
        if (W.lv.babelYard > 0.3) {
          for (const f of KILNS) { const kx = f * W.w, gy = groundY(2, kx); put('砖窑', kx, gy - hn * 1.3, Math.hypot(x - kx, y - (gy - hn * 0.55))); }
          const px = PIT_X * W.w, py = groundY(2, px) + hn * 0.2;
          put('石漆坑', px, py - hn * 0.4, Math.hypot(x - px, (y - py) * 2));
        }
        if (W.lv.babelUr > 0.5 && x > UR_X[0] * W.w && x < UR_X[1] * W.w) { const gy = groundY(1, x); if (Math.abs(y - (gy - hm * 0.6)) < hm * 1.4) put('迦勒底的吾珥', x, gy - hm * 1.8, r * 0.7); }
        if (W.lv.babelHaran > 0.5 && x > HARAN_X[0] * W.w && x < HARAN_X[1] * W.w) { const gy = groundY(1, x); if (Math.abs(y - (gy - hm * 0.6)) < hm * 1.4) put('哈兰', x, gy - hm * 1.8, r * 0.7); }
        return best;
      },
    },
  });
})(window.GS);
