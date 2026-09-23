/* ─────────────────────────────────────────────────────────────
 * fx.js —— 灵与光的效果：神的灵、迸发、涟漪、粒子、万物之名
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, rand, TAU } = U;

  const parts = [];        // 通用粒子
  const rings = [];        // 扩散的光环
  const names = [];        // 聚散的名字
  const bursts = [];       // 光的迸发
  const trail = [];        // 灵的余光
  const MAXP = 2400;

  // ── 粒子 ────────────────────────────────────────────────────
  // p: {x,y,vx,vy,life,max,size,c:[r,g,b],a,drag,grav,pass,tx,ty,home,twinkle}
  function add(p) {
    if (parts.length >= MAXP) parts.shift();
    p.life = 0;
    p.drag = p.drag == null ? 1.2 : p.drag;
    p.grav = p.grav || 0;
    p.a = p.a == null ? 1 : p.a;
    p.pass = p.pass || 'top';
    p.seed = Math.random() * TAU;
    parts.push(p);
    return p;
  }

  // 光的迸发（要有光）：自灵处膨胀，扫过全地
  function burst(x, y, opts) {
    opts = opts || {};
    bursts.push({ x, y, t: 0, dur: opts.dur || 1.5, c: opts.c || [255, 250, 235], strength: opts.strength || 0.95 });
    const n = opts.motes == null ? 160 : opts.motes;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, s = rand(80, 900) * W.unit;
      add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, max: rand(1.0, 2.6), size: rand(1, 2.6),
        c: opts.c || [255, 244, 214], drag: 1.6 });
    }
  }
  // 扩散的光环
  function ring(x, y, c, maxR, dur, width) {
    rings.push({ x, y, t: 0, dur: dur || 1.6, maxR: maxR || Math.hypot(W.w, W.h) * 0.5, c: c || [255, 244, 220], width: width || 2 });
  }
  // 升腾的尘土（生灵自地而出）
  function dust(x, y, n, c, spread) {
    for (let i = 0; i < (n || 20); i++) {
      add({ x: x + rand(-1, 1) * (spread || 14), y: y + rand(-3, 3), vx: rand(-30, 30), vy: rand(-70, -15), max: rand(0.8, 2.0),
        size: rand(1, 2.4), c: c || [226, 196, 150], drag: 1.8, grav: 18, a: 0.75, pass: 'near' });
    }
  }
  // 闪光的微尘（生命的火花）
  function sparkle(x, y, n, c, spread, pass) {
    for (let i = 0; i < (n || 16); i++) {
      const a = Math.random() * TAU, s = rand(10, 90);
      add({ x: x + rand(-1, 1) * (spread || 6), y: y + rand(-1, 1) * (spread || 6), vx: Math.cos(a) * s, vy: Math.sin(a) * s - 20,
        max: rand(0.7, 1.8), size: rand(0.8, 2.2), c: c || [220, 240, 255], drag: 2.2, twinkle: true, pass: pass || 'top' });
    }
  }
  // 自一点撒出、飞向各自归宿的光点（众星归位 / 种子落地）
  function sow(x, y, targets, c, opts) {
    opts = opts || {};
    for (let i = 0; i < targets.length; i++) {
      const tg = targets[i];
      add({ x, y, vx: 0, vy: 0, tx: tg[0], ty: tg[1], home: true, delay: (opts.stagger || 0.6) * Math.random(),
        max: opts.dur || rand(2.2, 3.4), size: tg[2] || rand(1, 2.2), c: c || [255, 248, 230], drag: 0, pass: opts.pass || 'sky',
        arc: rand(-0.35, 0.35) });
    }
  }

  // ── 名字：万物以其自身的质料聚成其名（聚—驻—散）───────────
  const glyphCache = {};
  const FONT = '"Songti SC", "STSong", "Noto Serif CJK SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif';
  function glyphPoints(ch) {
    if (glyphCache[ch]) return glyphCache[ch];
    const S = 240;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const g = c.getContext('2d');
    g.font = '900 200px ' + FONT;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#fff';
    g.fillText(ch, S / 2, S / 2 + 8);
    const data = g.getImageData(0, 0, S, S).data;
    const pts = [];
    for (let y = 2; y < S; y += 3)
      for (let x = 2; x < S; x += 3)
        if (data[(y * S + x) * 4 + 3] > 120) pts.push([(x - S / 2) / 200, (y - S / 2) / 200]);
    glyphCache[ch] = pts;
    return pts;
  }
  const NAME_GATHER = 1.7, NAME_HOLD = 2.8, NAME_FADE = 2.0;
  // srcFn() → [x, y] 或 [x, y, rgb]（逐粒指定颜色：万物各以其质料）
  // opts: { delay, dark（以黑暗为质料）, hold（驻留秒数）, step（取点稀疏度 1=全部） }
  function name(ch, cx, cy, size, c, srcFn, opts) {
    opts = opts || {};
    // 小字取点更疏，免得微尘挤成一团（取点网格在 200px 字号下间距 3px）
    const spacing = (3 * size) / 200;
    const all = glyphPoints(ch), step = opts.step || Math.max(1, Math.round(Math.pow(2.3 / Math.max(0.3, spacing), 2)));
    const pts = [];
    for (let i = 0; i < all.length; i += step) {
      const [ox, oy] = all[i];
      const s = srcFn();
      pts.push({ tx: cx + ox * size, ty: cy + oy * size, sx: s[0], sy: s[1], c: s[2] || null, seed: Math.random() * TAU });
    }
    names.push({ born: W.t + (opts.delay || 0), c, dark: !!opts.dark, hold: opts.hold || NAME_HOLD, dot: opts.dot || 2.4, pts });
    return NAME_GATHER + (opts.hold || NAME_HOLD) + NAME_FADE + (opts.delay || 0);
  }
  name.DURATION = NAME_GATHER + NAME_HOLD + NAME_FADE;
  // 一串字（如「头一日」）：逐字排开，同时聚成
  function nameStr(str, cx, cy, size, c, srcFn, opts) {
    const chars = Array.from(str), gap = size * 1.08;
    const x0 = cx - (gap * (chars.length - 1)) / 2;
    let d = 0;
    chars.forEach((ch, i) => { d = Math.max(d, name(ch, x0 + i * gap, cy, size, c, srcFn, Object.assign({}, opts, { delay: (opts && opts.delay || 0) + i * 0.12 }))); });
    return d;
  }

  // ── 你的星座（又造众星时灵划过的轨迹）与「甚好」之星 ─────────
  let constellation = null;   // [[nx, ny], ...]
  let goodStar = null;        // [nx, ny]
  let trace = [];             // 言说撒星时，灵在天上留下的意念（像素点）
  function setConstellation(pts) { constellation = pts && pts.length ? pts : null; }
  function setGoodStar(p) { goodStar = p; }
  function setTrace(pts) { trace = pts || []; }
  function starAlpha() {
    const n = clamp(W.night * 1.25 + W.dusk * 0.35, 0, 1);
    return W.lv.stars * n;
  }
  function flare(ctx, x, y, r, c, a) {
    ctx.fillStyle = U.rgba(c[0], c[1], c[2], a);
    ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, TAU); ctx.fill();
    ctx.fillStyle = U.rgba(c[0], c[1], c[2], a * 0.45);
    ctx.fillRect(x - r * 3.2, y - 0.5, r * 6.4, 1);
    ctx.fillRect(x - 0.5, y - r * 3.2, 1, r * 6.4);
    ctx.fillStyle = U.rgba(c[0], c[1], c[2], a * 0.12);
    ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, TAU); ctx.fill();
  }
  function drawHeavens(ctx) {
    const A = starAlpha();
    ctx.globalCompositeOperation = 'lighter';
    if (constellation && A > 0.01) {
      // 星座的连线：只在深夜隐约可见，像一张星图
      ctx.strokeStyle = U.rgba(200, 215, 255, 0.07 * A);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < constellation.length; i++) {
        const X = constellation[i][0] * W.w, Y = constellation[i][1] * W.h;
        if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      for (let i = 0; i < constellation.length; i++) {
        const X = constellation[i][0] * W.w, Y = constellation[i][1] * W.h;
        const tw = 0.75 + 0.25 * Math.sin(W.t * (1.3 + (i % 5) * 0.37) + i * 2.1);
        flare(ctx, X, Y, 1.5 + (i % 3) * 0.35, [244, 247, 255], A * tw);
      }
    }
    if (goodStar) {
      // 甚好之星：黄昏时第一个亮起，最亮
      const g = clamp(W.lv.stars * (W.night * 1.4 + W.dusk * 0.9), 0, 1) * clamp(W.lv.good * 3, 0, 1);
      if (g > 0.01) {
        const X = goodStar[0] * W.w, Y = goodStar[1] * W.h;
        flare(ctx, X, Y, 2.4, [255, 231, 163], g * (0.85 + 0.15 * Math.sin(W.t * 1.7)));
      }
    }
    if (trace.length > 1) {
      ctx.strokeStyle = 'rgba(244, 247, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      trace.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 更新 ────────────────────────────────────────────────────
  function update(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.delay > 0) { p.delay -= dt; continue; }
      p.life += dt;
      if (p.life >= p.max) { parts.splice(i, 1); continue; }
      if (p.home) {
        // 以弧线飞向归宿，最后几成停驻并渐隐（交给天幕上的星）
        const e = U.easeInOut(clamp(p.life / (p.max * 0.7), 0, 1));
        if (p.ox == null) { p.ox = p.x; p.oy = p.y; }
        const mx = (p.ox + p.tx) / 2 + (p.ty - p.oy) * p.arc, my = (p.oy + p.ty) / 2 - (p.tx - p.ox) * p.arc;
        const a = lerp(p.ox, mx, e), b = lerp(mx, p.tx, e);
        const c = lerp(p.oy, my, e), d = lerp(my, p.ty, e);
        p.x = lerp(a, b, e); p.y = lerp(c, d, e);
        continue;
      }
      const k = Math.exp(-p.drag * dt);
      p.vx *= k; p.vy = p.vy * k + p.grav * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t >= rings[i].dur) rings.splice(i, 1); }
    for (let i = bursts.length - 1; i >= 0; i--) { bursts[i].t += dt; if (bursts[i].t >= bursts[i].dur) bursts.splice(i, 1); }

    // 灵的余光：运行时洒下几粒微光
    const sp = W.spirit;
    if (sp.speed > 40 && Math.random() < Math.min(0.9, sp.speed / 900)) {
      trail.push({ x: sp.x + rand(-6, 6), y: sp.y + rand(-6, 6), life: 0, max: rand(0.8, 1.6), s: rand(0.8, 1.8) });
    }
    for (let i = trail.length - 1; i >= 0; i--) { trail[i].life += dt; trail[i].y -= dt * 8; if (trail[i].life > trail[i].max) trail.splice(i, 1); }
    if (trail.length > 120) trail.splice(0, trail.length - 120);
  }

  // ── 绘制 ────────────────────────────────────────────────────
  function drawParts(ctx, pass) {
    let any = false;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.pass !== pass || p.delay > 0) continue;
      if (!any) { ctx.globalCompositeOperation = 'lighter'; any = true; }
      const e = p.life / p.max;
      let a = p.home ? Math.min(1, p.life * 3) * (e > 0.7 ? 1 - (e - 0.7) / 0.3 : 1) : (1 - e) * (1 - e);
      if (p.twinkle) a *= 0.6 + 0.4 * Math.sin(W.t * 18 + p.seed * 5);
      a *= p.a;
      if (a <= 0.01) continue;
      ctx.fillStyle = U.rgba(p.c[0], p.c[1], p.c[2], a);
      const s = p.size;
      ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    }
    if (any) ctx.globalCompositeOperation = 'source-over';
  }

  function drawNames(ctx) {
    if (!names.length) return;
    for (let ni = names.length - 1; ni >= 0; ni--) {
      const nm = names[ni];
      const age = W.t - nm.born;
      if (age < 0) continue;
      const HOLD = nm.hold;
      if (age > NAME_GATHER + HOLD + NAME_FADE) { names.splice(ni, 1); continue; }
      ctx.globalCompositeOperation = nm.dark ? 'source-over' : 'lighter';
      const c = nm.c, pts = nm.pts, dot = nm.dot, hd = dot / 2;
      for (let k = 0; k < pts.length; k++) {
        const p = pts[k];
        let X, Y, A;
        if (age < NAME_GATHER) {                         // 聚：自其疆域而来
          const e = age / NAME_GATHER;
          const q = 1 - Math.pow(1 - e, 3);
          X = p.sx + (p.tx - p.sx) * q;
          Y = p.sy + (p.ty - p.sy) * q;
          A = e * 0.8;
        } else if (age < NAME_GATHER + HOLD) {           // 驻：微微呼吸、闪烁
          X = p.tx + Math.sin(W.t * 2.1 + p.seed) * 0.8;
          Y = p.ty + Math.cos(W.t * 1.7 + p.seed * 2) * 0.8;
          A = 0.65 + 0.3 * Math.sin(W.t * 3 + p.seed * 3);
        } else {                                          // 散：轻扬而去，归于世界
          const e = (age - NAME_GATHER - HOLD) / NAME_FADE;
          if (p.c) {                                      // 各归其所：回到来处
            const q = e * e * (3 - 2 * e);
            X = p.tx + (p.sx - p.tx) * q;
            Y = p.ty + (p.sy - p.ty) * q;
          } else {
            X = p.tx + Math.sin(p.seed) * 70 * e * e;
            Y = p.ty - 50 * e * e + Math.cos(p.seed * 2) * 24 * e;
          }
          A = (1 - e) * (1 - e) * 0.8;
        }
        const cc = p.c || c;
        if (nm.dark) {
          // 暗的质料：墨色的尘，带一丝冷光的边
          ctx.fillStyle = U.rgba(58, 74, 112, A * 0.55);
          ctx.fillRect(X - hd - 0.8, Y - hd - 0.8, dot + 1.6, dot + 1.6);
          ctx.fillStyle = U.rgba(cc[0], cc[1], cc[2], Math.min(1, A * 1.15));
          ctx.fillRect(X - hd, Y - hd, dot, dot);
        } else {
          ctx.fillStyle = U.rgba(cc[0], cc[1], cc[2], A);
          ctx.fillRect(X - hd, Y - hd, dot, dot);
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawSpirit(ctx) {
    const sp = W.spirit, R = W.ritual;
    const ch = R.holding ? R.charge : 0;
    const x = sp.x, y = sp.y;
    ctx.globalCompositeOperation = 'lighter';
    // 余光
    for (let i = 0; i < trail.length; i++) {
      const p = trail[i], e = p.life / p.max;
      ctx.fillStyle = U.rgba(200, 225, 255, (1 - e) * 0.5);
      ctx.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
    }
    // 光晕：言说时更亮、更凝聚
    const rad = (120 + ch * 50) * Math.max(0.6, W.unit) * (1 - 0.12 * W.lv.given);
    const breath = 0.92 + 0.08 * Math.sin(W.t * 1.3);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const tint = R.tint || [255, 250, 235];
    g.addColorStop(0, U.rgba(lerp(220, tint[0], ch), lerp(235, tint[1], ch), lerp(255, tint[2], ch), (0.85 + ch * 0.15) * breath));
    g.addColorStop(0.18 - ch * 0.06, U.rgba(150, 195, 255, 0.42 + ch * 0.2));
    g.addColorStop(1, 'rgba(40, 80, 160, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TAU);
    ctx.fill();
    // 言说之环：随充盈度渐满
    if (ch > 0.001) {
      const r0 = 34 * Math.max(0.7, W.unit);
      ctx.lineCap = 'round';
      ctx.strokeStyle = U.rgba(255, 246, 226, 0.16);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x, y, r0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = U.rgba(tint[0], tint[1], tint[2], 0.35 + 0.5 * ch);
      ctx.lineWidth = 1.6 + ch * 1.4;
      ctx.beginPath(); ctx.arc(x, y, r0, -Math.PI / 2, -Math.PI / 2 + ch * TAU); ctx.stroke();
      // 被吸入的微光
      const n = 3 + (ch * 9) | 0;
      for (let i = 0; i < n; i++) {
        const a = W.t * 0.7 + i * (TAU / n) + Math.sin(W.t * 2 + i) * 0.3;
        const d = r0 * (1.6 + ((W.t * 0.9 + i * 0.37) % 1) * -0.9 + 1.2);
        ctx.fillStyle = U.rgba(255, 244, 220, 0.3 + ch * 0.4);
        ctx.fillRect(x + Math.cos(a) * d - 1, y + Math.sin(a) * d - 1, 2, 2);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawBursts(ctx) {
    for (let i = 0; i < bursts.length; i++) {
      const b = bursts[i];
      const p = b.t / b.dur;
      const maxR = Math.hypot(W.w, W.h) * 1.1;
      const R = Math.max(1, (1 - Math.pow(1 - p, 3)) * maxR);
      const a = Math.pow(1 - p, 0.6) * b.strength;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, R);
      g.addColorStop(0, U.rgba(b.c[0], b.c[1], b.c[2], a));
      g.addColorStop(0.6, U.rgba(220, 235, 255, a * 0.5));
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W.w, W.h);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  function drawRings(ctx) {
    if (!rings.length) return;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      const p = r.t / r.dur;
      const R = U.easeOut(p) * r.maxR;
      ctx.strokeStyle = U.rgba(r.c[0], r.c[1], r.c[2], (1 - p) * (1 - p) * 0.55);
      ctx.lineWidth = r.width * (1 + p * 3);
      ctx.beginPath();
      ctx.arc(r.x, r.y, Math.max(1, R), 0, TAU);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // 「甚好」：整个世界染上一层温暖的金辉
  function drawGood(ctx) {
    const g = W.lv.good;
    if (g < 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    const grd = ctx.createRadialGradient(W.w * 0.5, W.h * 0.55, 0, W.w * 0.5, W.h * 0.55, Math.hypot(W.w, W.h) * 0.6);
    grd.addColorStop(0, U.rgba(255, 214, 150, 0.16 * g));
    grd.addColorStop(1, U.rgba(255, 190, 120, 0.05 * g));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W.w, W.h);
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawFlash(ctx) {
    if (W.flash <= 0.01) return;
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = U.rgba(255, 248, 232, W.flash * W.flash * 0.35);
    ctx.fillRect(0, 0, W.w, W.h);
    ctx.globalCompositeOperation = 'source-over';
  }

  function draw(ctx, pass) {
    if (pass === 'top') {
      drawGood(ctx);
      drawParts(ctx, 'top');
      drawNames(ctx);
      drawRings(ctx);
      drawSpirit(ctx);
      drawBursts(ctx);
      drawFlash(ctx);
    } else {
      if (pass === 'sky') drawHeavens(ctx);
      drawParts(ctx, pass);
    }
  }

  function reset() { parts.length = 0; rings.length = 0; names.length = 0; bursts.length = 0; trail.length = 0; trace = []; constellation = null; goodStar = null; }

  GS.fx = { init() {}, resize() {}, update, draw, reset, add, burst, ring, dust, sparkle, sow, name, nameStr, glyphPoints,
    setConstellation, setGoodStar, setTrace, getConstellation: () => constellation,
    get busyNames() { return names.length; } };
})(window.GS);
