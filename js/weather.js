/* ─────────────────────────────────────────────────────────────
 * weather.js —— 天气：雨、暴风的天、冰雹、闪电、遍地的黑暗
 *
 * 各幕只需设定程度，这里便画出来（洪水一幕有它自己的一整套天象，这里在那一幕里让开）：
 *   W.set('rain', 0..1)    雨（声音模块也据此下雨）
 *   W.set('storm', 0..1)   乌云压下来，日月隐去，海也暗了；storm > 0.6 且下着雨时自会打闪
 *   W.set('gale', 0..1)    大风：云走得快，雨斜着落，海上起白浪
 *   W.set('hail', 0..1)    冰雹（出 9:23–24）：白色的雹粒夹在雨里，打在地上溅起
 *   W.set('gloom', 0..1)   遍地的黑暗（出 10:22）：整个世界沉入近乎全黑；各幕自己的光画在其上
 *   GS.weather.bolt()      立刻打一道闪电（西奈山、迦密山……）；瞬间重演时不打
 *   W.weatherExclude = [[x0, x1], …]   画面比例的横向区间：雨、冰雹、遍地的黑暗在这里让开（歌珊地，出 9:26、10:23）；每幕开始时清空
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, safe } = U;
  const TAU = Math.PI * 2;

  W.defineLevel('rain', 'exp', 0.45);
  W.defineLevel('storm', 'exp', 0.3);
  W.defineLevel('gale', 'exp', 0.5);
  W.defineLevel('hail', 'exp', 0.6);
  W.defineLevel('gloom', 'exp', 0.35);

  const hsh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  const uu = () => Math.max(0.35, W.unit || 1);
  const M = () => Math.min(W.w, W.h);
  const rgba = (c, a) => U.rgba(c[0], c[1], c[2], a);
  // 洪水一幕自己画天象
  const off = () => !!(GS.book && GS.book.current && GS.book.current('flood'));
  const S = { clock: 0, bolt: null, nextBolt: 0 };

  let CLOUD = null, CLOUD2 = null, CLOUD_P = null, CLOUD2_P = null, GLOW = null;
  function makeClouds(seed, n, light, ch) {
    try {
      const cw = 512;
      ch = ch || 170;
      const c = document.createElement('canvas'); c.width = cw; c.height = ch;
      const g = c.getContext('2d');
      const r = U.mulberry32(seed);
      for (let k = 0; k < n; k++) {
        const x = r() * cw, y = ch * (0.12 + 0.78 * Math.pow(r(), 0.85));
        const rad = (0.05 + 0.11 * r()) * cw * (0.6 + 0.7 * (y / ch));
        const lit = r() < 0.5;
        const v = lit ? light + 40 * r() : 18 + 22 * r();
        const a = lit ? 0.22 + 0.2 * r() : 0.3 + 0.26 * r();
        const oy = lit ? -rad * 0.28 : 0;
        const sy = ch > 200 ? 0.4 : 0.5;
        for (const ox of [-cw, 0, cw]) {
          g.save();
          g.translate(x + ox, y + oy);
          g.scale(1, sy);
          const gr = g.createRadialGradient(0, 0, 0, 0, 0, rad);
          gr.addColorStop(0, U.rgba(v, v + 3, v + 9, a));
          gr.addColorStop(0.45, U.rgba(v, v + 3, v + 9, a * 0.6));
          gr.addColorStop(1, U.rgba(v, v + 3, v + 9, 0));
          g.fillStyle = gr;
          g.beginPath(); g.arc(0, 0, rad, 0, TAU); g.fill();
          g.restore();
        }
      }
      g.globalCompositeOperation = 'destination-in';
      const fade = g.createLinearGradient(0, 0, 0, ch);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(0.12, 'rgba(0,0,0,1)');
      fade.addColorStop(0.7, 'rgba(0,0,0,1)'); fade.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = fade; g.fillRect(0, 0, cw, ch);
      g.globalCompositeOperation = 'source-over';
      return c;
    } catch (e) { return null; }
  }
  function glowSprite() {
    if (GLOW) return GLOW;
    try {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(210,220,255,0.9)'); gr.addColorStop(0.4, 'rgba(180,196,255,0.3)'); gr.addColorStop(1, 'rgba(160,180,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      GLOW = c;
    } catch (e) { GLOW = null; }
    return GLOW;
  }

  // ── 乌云压下的天（'seaFar' 层：在一切陆地之后）────────────────
  function drawStormSky(ctx) {
    const s = W.lv.storm;
    if (s < 0.01) return;
    const hz = W.horizonY, day = W.daylight;
    const top = U.mixRGB([6, 8, 14], [52, 58, 68], day), mid = U.mixRGB([12, 14, 22], [96, 102, 112], day);
    const g = ctx.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, rgba(top, 0.93 * s));
    g.addColorStop(1, rgba(mid, 0.78 * s));
    ctx.fillStyle = g;
    ctx.fillRect(-20, -20, W.w + 40, hz + 21);
    for (const b of [W.sun, W.moon]) {
      if (!b || b.y > hz + 0.02 * W.h) continue;
      const R = 0.34 * M();
      const gv = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, R);
      gv.addColorStop(0, rgba(top, 0.92 * s));
      gv.addColorStop(0.35, rgba(top, 0.7 * s));
      gv.addColorStop(1, rgba(top, 0));
      ctx.fillStyle = gv;
      ctx.fillRect(b.x - R, b.y - R, 2 * R, 2 * R);
    }
    const port = W.w < W.h * 0.9;
    if (port) {
      if (!CLOUD_P) CLOUD_P = makeClouds(4242, 260, 150, 420);
      if (!CLOUD2_P) CLOUD2_P = makeClouds(917, 170, 120, 420);
    } else {
      if (!CLOUD) CLOUD = makeClouds(4242, 110, 150);
      if (!CLOUD2) CLOUD2 = makeClouds(917, 70, 120);
    }
    const C1 = port ? CLOUD_P : CLOUD, C2 = port ? CLOUD2_P : CLOUD2;
    const speed = (10 + 55 * W.lv.gale + 18 * s) * uu();
    const off1 = ((S.clock * speed) % W.w + W.w) % W.w, off2 = ((S.clock * speed * 0.55) % W.w + W.w) % W.w;
    const ca = s * (0.45 + 0.55 * day) + 0.15 * s;
    if (C2) {
      ctx.globalAlpha = clamp(ca * 0.8, 0, 1);
      ctx.drawImage(C2, -off2, hz * 0.18, W.w, hz * 0.85);
      ctx.drawImage(C2, W.w - off2, hz * 0.18, W.w, hz * 0.85);
    }
    if (C1) {
      ctx.globalAlpha = clamp(ca, 0, 1);
      ctx.drawImage(C1, -off1, -hz * 0.05, W.w, hz * 0.8);
      ctx.drawImage(C1, W.w - off1, -hz * 0.05, W.w, hz * 0.8);
    }
    ctx.globalAlpha = 1;
    if (W.night > 0.02) { ctx.fillStyle = U.rgba(2, 3, 7, 0.6 * W.night * s); ctx.fillRect(-20, -20, W.w + 40, hz + 21); }
    const g2 = ctx.createLinearGradient(0, hz, 0, W.h);
    g2.addColorStop(0, rgba(U.mixRGB([8, 12, 18], [70, 78, 90], day), 0.6 * s));
    g2.addColorStop(1, rgba([6, 10, 16], 0.45 * s));
    ctx.fillStyle = g2;
    ctx.fillRect(-20, hz, W.w + 40, W.h - hz + 20);
    for (const b of [W.sun, W.moon]) {
      if (!b || b.y > hz) continue;
      const gw = 0.16 * W.w;
      const gg = ctx.createLinearGradient(b.x - gw, 0, b.x + gw, 0);
      gg.addColorStop(0, 'rgba(6,10,16,0)');
      gg.addColorStop(0.5, rgba([6, 10, 16], 0.55 * s));
      gg.addColorStop(1, 'rgba(6,10,16,0)');
      ctx.fillStyle = gg;
      ctx.fillRect(b.x - gw, hz, 2 * gw, W.h - hz + 20);
    }
    // 远处的雨幕
    const r = W.lv.rain;
    if (r > 0.02) {
      const slant = (0.05 + 0.08 * W.lv.gale) * W.w;
      const gc = ctx.createLinearGradient(0, 0.2 * W.h, 0, hz);
      const rc = U.mixRGB([40, 46, 58], [150, 158, 172], day);
      gc.addColorStop(0, rgba(rc, 0));
      gc.addColorStop(0.35, rgba(rc, 0.09 * r));
      gc.addColorStop(1, rgba(rc, 0.035 * r));
      ctx.fillStyle = gc;
      for (const kw of [1, 0.66, 0.36]) {
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const cx = (((hsh(k + 3.7) * 1.3 + S.clock * 0.006 * (1 + W.lv.gale)) % 1.3) - 0.15) * W.w;
          const top2 = (0.2 + 0.1 * hsh(k * 2.1)) * W.h + (1 - kw) * 0.04 * W.h, w = (0.05 + 0.06 * hsh(k * 5.3)) * W.w * kw;
          ctx.moveTo(cx - w / 2, top2); ctx.lineTo(cx + w / 2, top2); ctx.lineTo(cx + w / 2 + slant, hz + 2); ctx.lineTo(cx - w / 2 + slant, hz + 2); ctx.closePath();
        }
        ctx.fill();
      }
    }
  }

  // ── 闪电 ────────────────────────────────────────────────────
  function bolt(o) {
    if (W.replaying || W.reduced || off()) return;
    o = o || {};
    const x0 = (o.x != null ? o.x : 0.08 + 0.84 * Math.random()) * W.w, y0 = (0.06 + 0.14 * Math.random()) * W.h;
    const y1 = o.y != null ? o.y * W.h : W.horizonY + (Math.random() * 0.07 - 0.03) * W.h;
    const pts = [x0, y0];
    let x = x0, y = y0;
    while (y < y1) { y += (0.025 + 0.035 * Math.random()) * W.h; x += (Math.random() * 0.07 - 0.035) * W.w; pts.push(x, Math.min(y, y1)); }
    const br = [];
    const k = 2 * (1 + Math.floor(Math.random() * Math.max(1, pts.length / 2 - 2)));
    let bx = pts[k] || x0, by = pts[k + 1] || y0;
    br.push(bx, by);
    const dir = Math.random() < 0.5 ? -1 : 1;
    for (let i = 0; i < 3; i++) { bx += dir * (0.02 + 0.03 * Math.random()) * W.w; by += (0.02 + 0.03 * Math.random()) * W.h; br.push(bx, by); }
    S.bolt = { pts, br, t0: S.clock, dur: 0.42 };
    W.flash = Math.max(W.flash || 0, 0.28 + 0.3 * Math.random());
    const d = o.near ? 0.15 : 0.4 + 1.4 * Math.random();
    const t0 = W.t;
    GS.book.after(d, () => { if (W.t - t0 < 5) safe('weather.thunder', () => GS.audio.sfx && GS.audio.sfx('thunder', { far: d > 1.2 })); });
  }
  function drawBolt(ctx) {
    const B = S.bolt;
    if (!B) return;
    const age = S.clock - B.t0;
    if (age > B.dur || age < 0) { S.bolt = null; return; }
    let a = 1 - age / B.dur;
    if (age > 0.08 && age < 0.16) a *= 0.35;
    const line = pts => { ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); };
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineJoin = 'round';
    ctx.beginPath(); line(B.pts); line(B.br);
    ctx.strokeStyle = U.rgba(150, 170, 255, 0.18 * a); ctx.lineWidth = 7 * uu(); ctx.stroke();
    ctx.strokeStyle = U.rgba(236, 240, 255, 0.95 * a); ctx.lineWidth = 1.6 * uu(); ctx.stroke();
    const sp = glowSprite();
    if (sp) { ctx.globalAlpha = 0.35 * a; ctx.drawImage(sp, B.pts[0] - 0.2 * W.w, B.pts[1] - 0.12 * W.h, 0.4 * W.w, 0.24 * W.h); ctx.globalAlpha = 1; }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── 海上的白浪与雨点 ────────────────────────────────────────
  const BAND = { seaFar: [0, 1], seaMid: [1, 2], seaNear: [2, 3] };
  function bandRange(pass) {
    const hz = W.horizonY;
    const a = W.waterlineY ? W.waterlineY(0) : hz + 0.05 * W.h, b = W.waterlineY ? W.waterlineY(1) : hz + 0.15 * W.h;
    if (pass === 'seaFar') return [hz, a];
    if (pass === 'seaMid') return [a, b];
    return [b, W.h];
  }
  function drawSea(ctx, pass) {
    const k = Math.max(W.lv.gale * 0.8, W.lv.storm * 0.6), rn = W.lv.rain;
    if (k < 0.03 && rn < 0.05) return;
    const r = bandRange(pass), y0 = r[0], y1 = r[1];
    if (!(y1 - y0 > 2)) return;
    const q = W.quality || 1, lit = 0.35 + 0.65 * W.daylight;
    if (k >= 0.03) {
      const N = Math.round((pass === 'seaNear' ? 80 : pass === 'seaMid' ? 44 : 30) * q * (0.4 + 0.6 * k));
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const yn = Math.pow(hsh(i * 1.71 + BAND[pass][0] * 50), 1.2), y = y0 + (y1 - y0) * yn, s = W.seaScale ? W.seaScale(y) : 1;
        const x = ((hsh(i * 3.9) * W.w * 1.2 + S.clock * (18 + 30 * hsh(i * 2.2)) * s * (1 + W.lv.gale)) % (W.w * 1.2)) - W.w * 0.1;
        const len = (10 + 18 * hsh(i * 6.6)) * s * (0.6 + 0.8 * k);
        ctx.moveTo(x - len / 2, y);
        ctx.quadraticCurveTo(x, y - 2.2 * s, x + len / 2, y);
      }
      ctx.strokeStyle = W.shadeCSS([236, 242, 248], 0.1, 0.3 * k * lit);
      ctx.lineWidth = Math.max(0.8, 1.2 * uu() * (pass === 'seaNear' ? 1 : 0.7));
      ctx.stroke();
    }
    if (rn > 0.05) {
      ctx.beginPath();
      const n2 = Math.round((pass === 'seaNear' ? 60 : 30) * q * rn);
      for (let i = 0; i < n2; i++) {
        const ph = S.clock * 2.4 + hsh(i * 4.4);
        const cyc = Math.floor(ph), f = ph - cyc;
        const x = hsh(i * 7.7 + cyc * 13.1) * W.w, y = y0 + (y1 - y0) * hsh(i * 3.1 + cyc * 5.9);
        const s = W.seaScale ? W.seaScale(y) : 1;
        const rr = (1 + 5 * f) * s;
        ctx.moveTo(x + rr, y);
        ctx.ellipse(x, y, rr, rr * 0.3, 0, 0, TAU);
      }
      ctx.strokeStyle = W.shadeCSS([236, 242, 248], 0.2, 0.18 * rn * lit);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  // 让开的区间（画面比例，已排序合并）
  function spared() {
    const r = W.weatherExclude;
    if (!r || !r.length) return null;
    const out = [];
    for (const q of r) if (q && isFinite(q[0]) && isFinite(q[1])) out.push([Math.min(q[0], q[1]), Math.max(q[0], q[1])]);
    out.sort((a, b) => a[0] - b[0]);
    return out.length ? out : null;
  }
  const inSpared = (sp, x) => { if (!sp) return false; const f = x / W.w; for (const q of sp) if (f >= q[0] && f <= q[1]) return true; return false; };

  // ── 雨与冰雹（'air' 层：在一切之前）─────────────────────────
  function drawRain(ctx) {
    const r = W.lv.rain, hl = W.lv.hail;
    if (r < 0.01 && hl < 0.01) return;
    const q = W.quality || 1, u = uu();
    const slant = 0.16 + 0.3 * W.lv.gale + 0.1 * (W.wind || 0);
    const day = W.daylight;
    const sp = spared();
    if (r >= 0.01) {
      const col = U.mixRGB([110, 122, 150], [206, 214, 228], day);
      for (let layer = 0; layer < 2; layer++) {
        const n = Math.round((layer ? 140 : 200) * q * r) + 6;
        const len = (layer ? 26 : 15) * u, sp = (layer ? 1250 : 820) * u;
        const H = W.h + len;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const hx = hsh(i * 1.37 + layer * 91), hy = hsh(i * 7.91 + layer * 37), hs = 0.8 + 0.4 * hsh(i * 3.17 + layer);
          const yy = hy * H + S.clock * sp * hs;
          const y = (yy % H) - len;
          const x = ((hx * W.w * 1.3 + slant * yy) % (W.w * 1.3)) - W.w * 0.15;
          if (sp && inSpared(sp, x)) continue;
          ctx.moveTo(x, y); ctx.lineTo(x + slant * len, y + len);
        }
        ctx.strokeStyle = rgba(col, (layer ? 0.3 : 0.2) * r * (0.6 + 0.4 * day) + 0.25 * (W.flash || 0));
        ctx.lineWidth = (layer ? 1.2 : 0.8) * Math.max(0.8, u);
        ctx.stroke();
      }
    }
    if (hl >= 0.01) {
      // 冰雹：白色的粒，比雨慢，落到地上一闪
      const n = Math.round(160 * q * hl) + 4, sp = 520 * u, H = W.h + 10;
      ctx.fillStyle = U.rgba(236, 242, 250, 0.75 * hl * (0.55 + 0.45 * day) + 0.2 * (W.flash || 0));
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const hx = hsh(i * 2.13 + 7), hy = hsh(i * 5.37 + 3), hs = 0.8 + 0.4 * hsh(i * 1.9);
        const yy = hy * H + S.clock * sp * hs;
        const y = (yy % H) - 5;
        const x = ((hx * W.w * 1.2 + slant * 0.5 * yy) % (W.w * 1.2)) - W.w * 0.1;
        if (sp && inSpared(sp, x)) continue;
        const rr = (1.1 + 1.3 * hsh(i * 4.1)) * u;
        ctx.moveTo(x + rr, y); ctx.arc(x, y, rr, 0, TAU);
      }
      ctx.fill();
    }
  }

  // ── 遍地的黑暗 ──────────────────────────────────────────────
  function drawGloom(ctx) {
    const g = W.lv.gloom;
    if (g < 0.005) return;
    const a = clamp(0.94 * g, 0, 0.97), sp = spared();
    if (!sp) { ctx.fillStyle = U.rgba(2, 2, 5, a); ctx.fillRect(-20, -20, W.w + 40, W.h + 40); return; }
    // 让开的区间里有光（「惟有以色列人家中都有亮光」）：边缘柔和地过渡（沿横向取样，区间贴边、相近都不出错）
    const gr = ctx.createLinearGradient(0, 0, W.w, 0), soft = 0.035, N = 96;
    for (let i = 0; i <= N; i++) {
      const f = i / N;
      let d = 1;
      for (const q of sp) d = Math.min(d, f < q[0] ? q[0] - f : f > q[1] ? f - q[1] : 0);
      gr.addColorStop(f, U.rgba(2, 2, 5, a * Math.min(1, d / soft)));
    }
    ctx.fillStyle = gr;
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
  }

  GS.weather = {
    init() {}, resize() { CLOUD_P = CLOUD2_P = null; }, reset() {}, restore() { S.bolt = null; },
    update(dt) {
      S.clock += dt * (W.fast || 1);
      if (off()) return;
      if (W.lv.storm > 0.6 && W.lv.rain > 0.3 && W.lt.storm > 0.6 && !W.reduced) {
        if (S.clock > S.nextBolt) {
          S.nextBolt = S.clock + (2.2 + 4.3 * Math.random()) / Math.max(0.5, W.lv.storm);
          bolt();
        }
      } else S.nextBolt = Math.max(S.nextBolt, S.clock + 1.5);
    },
    draw(ctx, pass) {
      if (off()) return;
      if (pass === 'seaFar') { drawStormSky(ctx); drawBolt(ctx); }
      if (pass === 'seaFar' || pass === 'seaMid' || pass === 'seaNear') drawSea(ctx, pass);
      else if (pass === 'air') { drawRain(ctx); drawGloom(ctx); }
    },
    pick() { return null; },
    bolt,
  };
})(window.GS);
