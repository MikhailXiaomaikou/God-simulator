/* ─────────────────────────────────────────────────────────────
 * air.js —— 空中的飞鸟，各从其类（创 1:20–22）
 *
 *   燕子（雨燕）：成群的 boids，另带伪深度 z——越远越小、越朦胧（远群画在天幕层，
 *                 近群画在万物之前）；「m」形折线的翅，4–7 Hz 振翅与滑翔交替；
 *                 鸟群不时受一次转向的脉冲，像椋鸟群那样翻卷。
 *   海鸥：        白色，四到六只，在海湾上空缓缓滑翔盘旋；鲸喷气时，飞去绕着它转。
 *   雀鸟：        几只小鸣禽，在树冠与草地之间短距跳飞、啄食。
 *   鹰：          一两只，在大地上空高高地盘旋，很少振翅。
 *   出现：        自光中迸出（于成就之处），先绕着神的灵飞两圈，再散入天空各归其群。
 *   昼夜：        日落时飞回树冠栖息（无树可栖便滑向远海，没入地平线），海鸥落在水上；
 *                 黎明时散开。
 *   灵：          缓行 → 鸟在它周围 60–90px 处环绕；急掠 → 鸟群炸开；言说 → 悬停，面向灵。
 *
 *   对外：标准模块接口（init / resize / update / draw / reset / restore / pick）
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;

  // ── 小工具 ──────────────────────────────────────────────────
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hex = U.hexRGB;
  const fxOK = () => GS.fx && typeof GS.fx.add === 'function';
  const css = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const uu = () => Math.max(0.3, W.unit || 1);
  // 窄屏（竖屏手机）上略放大，免得小得看不清
  const cu = () => { const u = uu(); return u < 0.75 ? u * (1 + (0.75 - u) * 0.6) : u; };
  const L_PASS = ['far', 'mid', 'near'];
  const LAYER_K = [0.32, 0.58, 1.0];
  const LAYER_Z = [0.8, 0.45, 0.12];

  // ── 色板 ────────────────────────────────────────────────────
  const SWIFT = hex('#10141A'), GULL = hex('#F0F4F8'), GULL_TIP = [44, 48, 56], GULL_BACK = [168, 178, 190];
  const SONG = [44, 36, 30], SONG_BREAST = [132, 92, 62], EAGLE = [40, 30, 23], EAGLE_HEAD = [222, 214, 196];
  const RIM_DAY = [255, 244, 222], RIM_WARM = [255, 178, 110], RIM_NIGHT = [168, 190, 240];

  // ── 类别 ────────────────────────────────────────────────────
  //   0 燕子 · 1 海鸥 · 2 雀鸟 · 3 鹰
  const KIND_CN = ['燕子', '海鸥', '雀鸟', '鹰'];
  const GULL_I = [2, 9, 17, 31, 42, 50];
  const SONG_I = [4, 12, 20, 24, 29, 36, 45, 52];
  const EAGLE_I = [7, 38];
  function kindOf(i) {
    if (GULL_I.indexOf(i) >= 0) return 1;
    if (SONG_I.indexOf(i) >= 0) return 2;
    if (EAGLE_I.indexOf(i) >= 0) return 3;
    return 0;
  }
  // 燕群：0 近群（万物之前）· 1 远群（天幕层）· 2 中远群（赐福之后）
  const FLOCK_Z = [[0.06, 0.34], [0.62, 0.9], [0.5, 0.72]];
  function flockOf(i) { return i < 26 ? (i % 3 === 0 ? 1 : 0) : (i % 2 === 0 ? 2 : 0); }

  const B = [];               // 所有的鸟
  const FL = [];              // 燕群的聚处
  let ready = false, lastW = 0, lastH = 0, spawnAcc = 0;
  let roostOn = false, roostCheck = 0, whaleCheck = 0;

  function flock(i) {
    if (!FL[i]) {
      FL[i] = { i, cx: W.w * rnd(0.25, 0.75), cy: W.h * rnd(0.2, 0.4), seed: rnd(0, 100), pulse: rnd(12, 22), kx: 0, ky: 0, n: 0, mx: 0, my: 0 };
    }
    return FL[i];
  }

  function sizeK(z) { return cu() * (1 - 0.62 * z); }
  function makeBird(i, x, y, instant) {
    const k = kindOf(i);
    const b = {
      i, k, x, y, vx: rnd(-1, 1) * 60, vy: rnd(-1, 1) * 30, z: 0.2, face: Math.random() < 0.5 ? -1 : 1,
      ph: rnd(0, TAU), flap: 1, glideT: rnd(0.5, 2), gliding: false, a: instant ? 1 : 0,
      mode: 'free', orbA: 0, orbAcc: 0, orbR: rnd(60, 90), orbDir: 1, panic: 0, circ: 0,
      fl: k === 0 ? flockOf(i) : -1, seed: Math.random(), wake: 0,
      // 海鸥 / 鹰：盘旋
      cx: x, cy: y, tcx: x, tcy: y, R: 80, ang: rnd(0, TAU), om: 0.4, ct: 0, wz: 0.3, whale: -1,
      // 雀鸟
      layer: 2, st: 'perch', T: 0, dur: 0, x0: x, y0: y, tx: x, ty: y, arc: 0, peck: 0,
      // 栖息
      perch: null, pass: 'air', span: 1, hover: 0,
    };
    if (k === 0) { const r = FLOCK_Z[b.fl]; b.z = rnd(r[0], r[1]); b.zt = b.z; }
    else if (k === 1) { b.z = 0.4; b.om = rnd(0.28, 0.42) * (Math.random() < 0.5 ? -1 : 1); b.R = rnd(60, 120); }
    else if (k === 3) { b.z = rnd(0.26, 0.36); b.om = rnd(0.16, 0.24) * (Math.random() < 0.5 ? -1 : 1); b.R = rnd(90, 150); }
    else b.z = 0.12;
    return b;
  }

  // ── 天地的位置 ──────────────────────────────────────────────
  function gY(layer, x) {
    const L = GS.land;
    let y = L && L.groundY ? L.groundY(layer, x) : W.ridgeY(layer, x);
    if (!isFinite(y)) y = W.ridgeY(layer, x);
    return y;
  }
  const isSea = (x, y) => (GS.sea && GS.sea.isSea ? GS.sea.isSea(x, y) : W.isSea(x, y));
  const SKB = [0, 0];
  function skyBand(z) {
    // 近处的鸟可以飞得低一些；远处的贴着地平线
    const top = W.h * 0.08, bot = W.horizonY - W.h * lerp(0.1, 0.03, z);
    SKB[0] = top; SKB[1] = Math.max(top + 20, bot);
    return SKB;
  }
  // 海鸥盘旋的中心：先在海面上取一处（远近不一），再升到它上空；远近决定伪深度 z
  const SC = [0, 0, 0];
  function seaCenter() {
    for (let k = 0; k < 40; k++) {
      const D = rnd(0.1, 0.72), x = rnd(0.03, 0.6) * W.w, ys = W.horizonY + D * (W.h - W.horizonY);
      if (isSea(x, ys) && isSea(x, ys + (W.h - ys) * 0.25)) {
        const z = clamp(0.9 - D * 1.05, 0.14, 0.85);
        SC[0] = x; SC[1] = ys - rnd(0.05, 0.15) * W.h * (1 - 0.62 * z); SC[2] = z;
        return SC;
      }
    }
    SC[0] = W.w * 0.2; SC[1] = W.horizonY - W.h * 0.02; SC[2] = 0.7;
    return SC;
  }
  function landCenter() {
    const sp = W.landSpan ? W.landSpan(1, 4) || W.landSpan(2, 4) : null;
    const x0 = sp ? sp[0] : W.w * 0.55, x1 = sp ? sp[1] : W.w * 0.95;
    return [rnd(x0 + (x1 - x0) * 0.15, x1 - (x1 - x0) * 0.1), W.h * rnd(0.13, 0.3)];
  }
  function treeSpot() {
    const L = GS.land;
    const P = L && L.perches ? L.perches() : null;
    if (P && P.length) {
      for (let k = 0; k < 8; k++) {
        const p = P[(Math.random() * P.length) | 0];
        if (p && p.layer >= 1 && isFinite(p.x) && isFinite(p.y)) return { x: p.x + rnd(-3, 3) * cu(), y: p.y, layer: p.layer };
      }
    }
    const T = L && L.treeSpots ? L.treeSpots() : null;
    if (T && T.length) {
      for (let k = 0; k < 8; k++) {
        const t = T[(Math.random() * T.length) | 0];
        if (t && t.layer >= 1 && t.grown > 0.85) return { x: t.x + rnd(-0.3, 0.3) * t.w, y: t.top + rnd(0.1, 0.35) * (t.y - t.top), layer: t.layer };
      }
    }
    return null;
  }
  function groundSpot() {
    if (!W.hasLandBase || W.lv.land < 0.9) return null;
    for (let k = 0; k < 10; k++) {
      const x = W.randomLandX(2, W.h * 0.02);
      if (x < 8 || x > W.w - 8) continue;
      const g = gY(2, x);
      if (!(g < W.h - 10)) continue;
      return { x, y: g + rnd(0.02, 0.3) * (W.h - g), layer: 2, ground: true };
    }
    return null;
  }

  // ════════════════════════════════════════════════════════════
  //  更新
  // ════════════════════════════════════════════════════════════
  const SP = { slow: false, fast: false, listen: false, R: 200 };
  const ST = new Float64Array(4);          // 转向的暂存（免得每帧每只鸟都新建数组）
  function spiritCtx() {
    const sp = W.spirit;
    SP.R = 210 * Math.max(0.6, uu());
    SP.slow = sp.speed < 280;
    SP.fast = sp.speed > 1100;
    const awe = W.lt.good >= 1 && W.lv.good < 0.985;
    SP.listen = !!(W.ritual && W.ritual.holding) || awe;
  }

  function updateRoost(dt) {
    roostCheck -= dt;
    if (roostCheck > 0) return;
    roostCheck = 0.25;
    const el = W.sun ? W.sun.elev : 1;
    const want = W.lv.dayNight > 0.5 && (roostOn ? el < 0.13 : el < 0.07);
    if (want === roostOn) return;
    roostOn = want;
    if (want) assignRoosts();
    else {
      // 黎明：次第散开
      for (const b of B) {
        if (b.mode === 'perched' || b.mode === 'toRoost' || b.mode === 'float' || b.mode === 'toFloat' || b.mode === 'away') {
          b.wake = W.t + rnd(0.1, 2.8);
        }
      }
    }
  }
  function assignRoosts(only) {
    const L = GS.land;
    const P = (L && L.perches ? L.perches() : []) || [];
    const perches = [];
    for (const p of P) if (p && p.layer >= 1 && isFinite(p.x) && isFinite(p.y)) perches.push(p);
    const used = new Uint8Array(perches.length);
    // 已有栖枝的鸟保留它的枝
    if (only) {
      for (const o of B) {
        if (o === only || !o.perch || o.k === 1) continue;
        for (let j = 0; j < perches.length; j++) if (!used[j] && Math.abs(perches[j].x - o.perch.x) < 4 && Math.abs(perches[j].y - o.perch.y) < 4) { used[j] = 1; break; }
      }
    }
    for (const b of B) {
      if (only && b !== only) continue;
      if (b.mode === 'born' || b.mode === 'orbitS') continue;
      b.wake = 0;
      if (b.k === 1) {
        // 海鸥：落在水上
        let spot = null;
        for (let k = 0; k < 30 && !spot; k++) {
          const x = rnd(0.04, 0.5) * W.w, D = rnd(0.3, 0.8), y = W.horizonY + D * (W.h - W.horizonY);
          if (isSea(x, y) && isSea(x - 20, y) && isSea(x + 20, y)) spot = { x, y };
        }
        if (spot) { b.perch = spot; b.mode = 'toFloat'; } else { b.mode = 'away'; b.perch = null; }
        continue;
      }
      if (b.k === 2 && b.st === 'perch' && b.layer >= 1 && !b.ground) { b.mode = 'perched'; b.perch = { x: b.x, y: b.y, layer: b.layer }; continue; }
      if (!perches.length) { b.mode = 'away'; b.perch = null; continue; }
      // 最近的空枝
      let best = -1, bd = 1e18;
      for (let j = 0; j < perches.length; j++) {
        if (used[j]) continue;
        const d = (perches[j].x - b.x) * (perches[j].x - b.x) + (perches[j].y - b.y) * (perches[j].y - b.y);
        if (d < bd) { bd = d; best = j; }
      }
      if (best < 0) best = (Math.random() * perches.length) | 0;
      else used[best] = 1;
      const p = perches[best];
      b.perch = { x: p.x + rnd(-2, 2) * cu(), y: p.y, layer: p.layer };
      b.mode = 'toRoost';
    }
  }

  function updateSwifts(dt) {
    // 各群的聚处沿平滑的噪声漂移；不时一记转向的脉冲，群形翻卷
    for (const F of FL) {
      if (!F) continue;
      F.n = 0; F.mx = 0; F.my = 0;
      const zr = FLOCK_Z[F.i] || [0.3, 0.6], zm = (zr[0] + zr[1]) / 2;
      const band = skyBand(zm);
      const t = W.t * 0.035;
      F.cx = W.w * (0.5 + 0.42 * U.noise1(t + F.seed)) + F.kx;
      F.cy = lerp(band[0], band[1], 0.5 + 0.48 * U.noise1(t * 1.3 + F.seed * 3.1)) + F.ky;
      F.kx *= Math.exp(-dt * 0.3); F.ky *= Math.exp(-dt * 0.3);
      F.pulse -= dt;
      if (F.pulse <= 0) { F.pulse = rnd(14, 24); F.kx = rnd(-1, 1) * W.w * 0.25; F.ky = rnd(-1, 1) * W.h * 0.08; F.swirl = rnd(0.8, 2.2) * (Math.random() < 0.5 ? -1 : 1); F.swT = 3; }
      if (F.swT > 0) F.swT -= dt;
    }
    for (const b of B) { if (b.k === 0 && b.mode === 'free' && b.a > 0.2) { const F = FL[b.fl]; if (F) { F.n++; F.mx += b.x; F.my += b.y; } } }
    for (const F of FL) if (F && F.n) { F.mx /= F.n; F.my /= F.n; }
  }

  function steerFree(b, dt) {
    // 燕子：群聚
    const sc = sizeK(b.z), F = FL[b.fl];
    let ax = 0, ay = 0;
    const R = 80 * sc, R2 = R * R, sep = 13 * sc, sep2 = sep * sep;
    let n = 0, avx = 0, avy = 0, cx = 0, cy = 0, sx = 0, sy = 0;
    for (let j = 0; j < B.length; j++) {
      const o = B[j];
      if (o === b || o.k !== 0 || o.fl !== b.fl || o.mode !== 'free') continue;
      const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 > R2) continue;
      if (d2 < sep2) { const d = Math.sqrt(d2) + 1e-3; sx -= dx / d * (sep - d); sy -= dy / d * (sep - d); }
      n++; avx += o.vx; avy += o.vy; cx += dx; cy += dy;
      if (n > 10) break;
    }
    const coh = b.panic > 0 ? 0.1 : 1;
    if (n) {
      ax += (avx / n - b.vx) * 1.4; ay += (avy / n - b.vy) * 1.4;
      ax += (cx / n) * 1.3 * coh; ay += (cy / n) * 1.3 * coh;
    }
    ax += sx * 9; ay += sy * 9;
    if (F) {
      const dx = F.cx - b.x, dy = F.cy - b.y, d = Math.hypot(dx, dy) + 1e-3;
      const k = Math.min(1, d / (260 * sc)) * 90 * sc;
      ax += dx / d * k; ay += dy / d * k;
      if (F.swT > 0 && F.n) {
        // 翻卷：绕群心打一个旋
        const ox = b.x - F.mx, oy = b.y - F.my;
        ax += -oy * F.swirl * 0.9; ay += ox * F.swirl * 0.9;
      }
    }
    const wa = U.noise1(W.t * 0.4 + b.seed * 50) * Math.PI;
    ax += Math.cos(wa) * 30 * sc; ay += Math.sin(wa) * 18 * sc;
    const band = skyBand(b.z);
    if (b.y < band[0]) ay += (band[0] - b.y) * 3;
    if (b.y > band[1]) ay -= (b.y - band[1]) * 3;
    if (b.x < -20) ax += 120 * sc; if (b.x > W.w + 20) ax -= 120 * sc;
    b.z = U.approach(b.z, b.zt, 0.2, dt);
    ST[0] = ax; ST[1] = ay; ST[2] = 230 * sc; ST[3] = 95 * sc; return ST;
  }

  function steerGull(b, dt) {
    // 海鸥：绕一个中心滑翔盘旋；中心缓缓漂移，或去到喷气的鲸上空
    b.ct -= dt;
    if (b.whale >= 0 && b.ct <= 0) b.whale = -1;
    if (b.ct <= 0) { const c = seaCenter(); b.tcx = c[0]; b.tcy = c[1]; b.zc = c[2]; b.ct = rnd(14, 28); b.R = rnd(60, 120); }
    b.cx = U.approach(b.cx, b.tcx, 0.25, dt);
    b.cy = U.approach(b.cy, b.tcy, 0.25, dt);
    b.z = U.approach(b.z, clamp(b.whale >= 0 ? b.wz : (b.zc == null ? 0.5 : b.zc), 0.08, 0.95), 0.4, dt);
    const sc = sizeK(b.z);
    b.ang += b.om * dt * (1 + 0.2 * Math.sin(W.t * 0.3 + b.seed * 9));
    const R = b.R * sc;
    const tx = b.cx + Math.cos(b.ang) * R, ty = b.cy + Math.sin(b.ang) * R * 0.34 + Math.sin(W.t * 0.7 + b.seed * 20) * 6 * sc;
    ST[0] = (tx - b.x) * 2.2 - b.vx * 1.2; ST[1] = (ty - b.y) * 2.2 - b.vy * 1.2; ST[2] = 160 * sc; ST[3] = 0; return ST;
  }
  function steerEagle(b, dt) {
    b.ct -= dt;
    if (b.ct <= 0) { const c = landCenter(); b.tcx = c[0]; b.tcy = c[1]; b.ct = rnd(25, 45); }
    b.cx = U.approach(b.cx, b.tcx, 0.08, dt);
    b.cy = U.approach(b.cy, b.tcy, 0.08, dt);
    const sc = sizeK(b.z);
    b.ang += b.om * dt;
    const R = b.R * sc;
    const tx = b.cx + Math.cos(b.ang) * R, ty = b.cy + Math.sin(b.ang) * R * 0.4;
    ST[0] = (tx - b.x) * 1.6 - b.vx * 1.0; ST[1] = (ty - b.y) * 1.6 - b.vy * 1.0; ST[2] = 130 * sc; ST[3] = 0; return ST;
  }

  // 雀鸟：树与草之间短距跳飞
  function songPlan(b) {
    const fromTree = !b.ground;
    let tg = null;
    if (Math.random() < (fromTree ? 0.4 : 0.75)) tg = treeSpot();
    if (!tg) tg = groundSpot() || treeSpot();
    if (!tg) { b.st = 'hoverFly'; b.T = 0; b.dur = rnd(2, 4); return; }
    b.st = 'fly'; b.T = 0; b.x0 = b.x; b.y0 = b.y; b.tx = tg.x; b.ty = tg.y;
    b.l0 = b.layer; b.layer = tg.layer; b.ground = !!tg.ground;
    const d = Math.hypot(b.tx - b.x0, b.ty - b.y0);
    b.dur = clamp(d / (150 * cu()), 0.5, 3.2);
    b.arc = Math.min(60 * cu(), d * 0.35) + 10 * cu();
    b.face = b.tx >= b.x0 ? 1 : -1;
  }
  function updateSong(b, dt) {
    b.T += dt;
    const u = cu();
    if (b.st === 'fly' || b.st === 'hoverFly') {
      if (b.st === 'hoverFly') {
        const band = skyBand(0.2);
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.vx = U.approach(b.vx, Math.sin(W.t * 0.5 + b.seed * 9) * 60 * u, 1, dt);
        b.vy = U.approach(b.vy, (clamp(b.y, band[0], band[1]) - b.y) * 0.8, 1, dt);
        if (b.T > b.dur) songPlan(b);
        b.flap = 1;
        return;
      }
      const p = c01(b.T / b.dur);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const nx = lerp(b.x0, b.tx, e), ny = lerp(b.y0, b.ty, e) - Math.sin(Math.PI * p) * b.arc + Math.sin(p * 18) * 2 * u * Math.sin(Math.PI * p);
      b.vx = (nx - b.x) / Math.max(dt, 1e-3); b.vy = (ny - b.y) / Math.max(dt, 1e-3);
      b.x = nx; b.y = ny;
      // 波状飞行：一阵振翅，一阵收翅
      b.flap = Math.sin(p * 11) > -0.3 ? 1 : 0;
      if (p >= 1) { b.st = b.ground ? 'ground' : 'perch'; b.T = 0; b.dur = b.ground ? rnd(3, 8) : rnd(3, 11); b.hopT = rnd(0.3, 1); b.flap = 0; }
      return;
    }
    b.flap = 0;
    if (b.st === 'ground') {
      // 跳两下，低头啄食
      b.hopT -= dt;
      if (b.hop > 0) {
        b.hop = Math.max(0, b.hop - dt / 0.22);
        b.x += b.hvx * dt;
        b.hy = -Math.sin(Math.PI * (1 - b.hop)) * 4 * u;
      } else b.hy = 0;
      if (b.hopT <= 0 && !SP.listen) {
        if (Math.random() < 0.55) {
          b.hop = 1; b.hvx = b.face * rnd(12, 28) * u;
          if (Math.random() < 0.25) b.face = -b.face;
          const g = gY(2, b.x + b.hvx * 0.22);
          if (!(g < b.y + 2)) b.hvx = 0;
        } else b.peck = 0.5;
        b.hopT = rnd(0.35, 1.1);
      }
      if (b.peck > 0) b.peck = Math.max(0, b.peck - dt);
    } else if (Math.random() < dt * 0.25 && !SP.listen) b.face = -b.face;
    if (b.T > b.dur && !SP.listen && !roostOn) songPlan(b);
  }

  function updateBirds(dt) {
    const sp = W.spirit, lis = SP.listen;
    updateSwifts(dt);
    for (let i = 0; i < B.length; i++) {
      const b = B[i];
      if (b.a < 1 && b.mode !== 'away') b.a = Math.min(1, b.a + dt / 0.5);
      b.T = b.T || 0;
      // 黎明醒来
      if (b.wake && W.t >= b.wake) {
        b.wake = 0;
        if (b.mode === 'away') {
          b.mode = 'free'; b.z = 0.98; b.a = 0; b.x = rnd(0.05, 0.4) * W.w; b.y = W.horizonY - W.h * 0.02; b.vx = rnd(-20, 20); b.vy = -rnd(10, 30);
          if (b.k === 2) { b.st = 'hoverFly'; b.T = 0; b.dur = rnd(2, 4); b.layer = 2; b.ground = false; }
          if (b.k === 1 || b.k === 3) { b.cx = b.x; b.cy = b.y; b.ct = 0; }
        }
        else if (b.mode !== 'free') {
          b.mode = 'free';
          b.vy = -rnd(60, 120) * cu(); b.vx = rnd(-1, 1) * 80 * cu();
          if (b.k === 2) { b.st = 'perch'; b.T = 0; b.dur = rnd(0.5, 3); if (b.perch) { b.layer = b.perch.layer; b.ground = false; } }
        }
        if (b.k === 0) { const r = FLOCK_Z[b.fl]; b.zt = rnd(r[0], r[1]); }
        b.perch = null;
      }
      let ax = 0, ay = 0, vmax = 200, vmin = 0;
      const u = cu();
      switch (b.mode) {
        case 'orbitS': {
          // 初生：绕着神的灵飞两圈
          const dx = b.x - sp.x, dy = b.y - sp.y, r = Math.hypot(dx, dy) + 1e-3;
          const rr = b.orbR * Math.max(0.6, uu());
          const om = 2.4 * b.orbDir;
          const tvx = -dy / r * om * rr - dx / r * (r - rr) * 4 + sp.vx * 0.8, tvy = dx / r * om * rr - dy / r * (r - rr) * 4 + sp.vy * 0.8;
          ax = (tvx - b.vx) * 7; ay = (tvy - b.vy) * 7; vmax = 620 * u;
          const a = Math.atan2(dy, dx);
          b.orbAcc += Math.abs(angDiff(b.orbA, a)); b.orbA = a;
          b.z = U.approach(b.z, 0.1, 1, dt);
          if (b.orbAcc > TAU * 2) release(b);
          break;
        }
        case 'toRoost': case 'toFloat': {
          const p = b.perch;
          if (!p) { b.mode = 'free'; break; }
          const tz = b.k === 1 ? 0.3 : LAYER_Z[p.layer] || 0.2;
          b.z = U.approach(b.z, tz, 0.9, dt);
          const dx = p.x - b.x, dy = p.y - b.y, d = Math.hypot(dx, dy) + 1e-3;
          const vt = Math.min(d * 2.2, (b.k === 3 ? 260 : 320) * u);
          ax = (dx / d * vt - b.vx) * 4; ay = (dy / d * vt - b.vy) * 4; vmax = 340 * u;
          if (d < 2.5 * u + 1) {
            b.x = p.x; b.y = p.y; b.vx = 0; b.vy = 0;
            b.mode = b.mode === 'toFloat' ? 'float' : 'perched';
            if (b.k === 2) { b.st = 'perch'; b.layer = p.layer; b.ground = false; }
            if (b.mode === 'float' && GS.bus) GS.bus.emit('splash', { x: p.x, y: p.y, size: 0.15 });
          }
          break;
        }
        case 'perched': case 'float': {
          b.vx = 0; b.vy = 0;
          if (b.mode === 'float' && b.perch) {
            b.x = b.perch.x + Math.sin(W.t * 0.13 + b.seed * 10) * 4 * u;
            b.y = b.perch.y + Math.sin(W.t * 1.3 + b.seed * 6) * 0.6 * u;
          }
          if (lis) b.face = sp.x >= b.x ? 1 : -1;
          else if (Math.random() < dt * 0.08) b.face = -b.face;
          break;
        }
        case 'away': {
          // 无枝可栖：滑向远海，没入地平线
          b.z = U.approach(b.z, 1, 0.35, dt);
          const tx = W.w * 0.15, ty = W.horizonY - W.h * 0.015;
          ax = (tx - b.x) * 0.5 - b.vx * 0.8; ay = (ty - b.y) * 0.6 - b.vy * 0.8; vmax = 120 * u;
          if (b.z > 0.9) b.a = Math.max(0, b.a - dt / 1.5);
          break;
        }
        default: {
          if (b.k === 2) { updateSong(b, dt); songReact(b, dt); continue; }
          let r;
          if (b.k === 0) r = steerFree(b, dt);
          else if (b.k === 1) r = steerGull(b, dt);
          else r = steerEagle(b, dt);
          ax = r[0]; ay = r[1]; vmax = r[2]; vmin = r[3];
        }
      }
      // ── 灵 ──
      const flying = b.mode === 'free' || b.mode === 'orbitS';
      if (flying && b.mode === 'free') {
        const dx = b.x - sp.x, dy = b.y - sp.y, d = Math.hypot(dx, dy) + 1e-3;
        if (lis) {
          // 言说：悬停，面向灵
          ax = -b.vx * 3; ay = -b.vy * 3 + Math.sin(W.t * 2 + b.seed * 10) * 8;
          vmin = 0;
          b.face = sp.x >= b.x ? 1 : -1;
          b.hover = 1;
        } else {
          b.hover = Math.max(0, b.hover - dt);
          if (SP.fast && d < SP.R * 1.2 && b.panic <= 0.5) {
            b.vx += dx / d * 320 * u; b.vy += dy / d * 260 * u;
            b.panic = 1.5; b.circ = 0;
          }
          const want = SP.slow && b.panic <= 0 && d < (b.circ > 0.3 ? SP.R * 1.5 : SP.R) && b.k !== 3 ? 1 : 0;
          b.circ = U.approach(b.circ, want, want ? 1.2 : 0.8, dt);
          if (b.circ > 0.01) {
            const rr = (60 + 30 * b.seed) * Math.max(0.6, uu());
            const om = 1.35 * (b.seed < 0.5 ? 1 : -1) * (b.k === 1 ? 0.6 : 1);
            const tvx = -dy / d * om * rr - dx / d * (d - rr) * 3.4 + sp.vx * 0.5, tvy = dx / d * om * rr - dy / d * (d - rr) * 3.4 + sp.vy * 0.5;
            ax = lerp(ax, (tvx - b.vx) * 4, b.circ); ay = lerp(ay, (tvy - b.vy) * 4, b.circ);
            vmax = Math.max(vmax, 300 * u * b.circ);
            if (b.k === 0) b.z = U.approach(b.z, Math.min(b.zt, 0.3), 0.6 * b.circ, dt);
          }
        }
        if (b.panic > 0) { b.panic -= dt; vmax *= 2; ax *= 0.3; ay *= 0.3; }
      }
      b.vx += ax * dt; b.vy += ay * dt;
      let v = Math.hypot(b.vx, b.vy);
      if (v > vmax) { b.vx *= vmax / v; b.vy *= vmax / v; v = vmax; }
      else if (vmin > 0 && v < vmin && v > 1e-3) { b.vx *= vmin / v; b.vy *= vmin / v; v = vmin; }
      if (b.mode !== 'perched' && b.mode !== 'float') { b.x += b.vx * dt; b.y += b.vy * dt; }
      if (!isFinite(b.x) || !isFinite(b.y)) { b.x = W.w * 0.5; b.y = W.h * 0.3; b.vx = 0; b.vy = 0; }
      if (Math.abs(b.vx) > 8 && b.hover <= 0) b.face = b.vx > 0 ? 1 : -1;
      flapUpdate(b, dt, v);
    }
  }
  function songReact(b, dt) {
    // 雀鸟：言说时停在原处面向灵；急掠时从地上惊起
    const sp = W.spirit;
    if (SP.listen) { b.face = sp.x >= b.x ? 1 : -1; b.peck = 0; }
    else if (SP.fast && b.st !== 'fly' && Math.hypot(b.x - sp.x, b.y - sp.y) < SP.R) songPlan(b);
    flapUpdate(b, dt, Math.hypot(b.vx, b.vy));
  }
  function flapUpdate(b, dt, v) {
    // 振翅与滑翔交替
    let fr;
    if (b.k === 0) fr = 6.5; else if (b.k === 1) fr = 2.8; else if (b.k === 2) fr = 12; else fr = 2.2;
    if (b.mode === 'perched' || b.mode === 'float' || (b.k === 2 && (b.st === 'perch' || b.st === 'ground'))) { b.flap = 0; b.gliding = true; return; }
    if (b.k !== 2) {
      b.glideT -= dt;
      if (b.glideT <= 0) {
        b.gliding = !b.gliding;
        if (b.k === 0) b.glideT = b.gliding ? rnd(0.4, 1.3) : rnd(0.6, 1.6);
        else if (b.k === 1) b.glideT = b.gliding ? rnd(2.5, 6) : rnd(0.8, 1.8);
        else b.glideT = b.gliding ? rnd(7, 15) : rnd(0.9, 1.4);
      }
      const need = b.mode === 'orbitS' || b.mode === 'toRoost' || b.panic > 0 || b.hover > 0 || b.vy < -40 * cu();
      b.flap = U.approach(b.flap, b.gliding && !need ? 0 : 1, 6, dt);
    }
    if (b.hover > 0) fr *= b.k === 0 ? 1.2 : 1.4;
    b.ph += dt * TAU * fr * (0.3 + 0.7 * b.flap);
  }
  function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU; return d; }
  function release(b) {
    b.mode = 'free';
    if (b.k === 0) { const r = FLOCK_Z[b.fl]; b.zt = rnd(r[0], r[1]); b.vx += rnd(-1, 1) * 100; b.vy -= 60; }
    else if (b.k === 1) { const c = seaCenter(); b.cx = b.x; b.cy = b.y; b.tcx = c[0]; b.tcy = c[1]; b.zc = c[2]; b.ct = rnd(14, 24); b.ang = Math.atan2(b.y - c[1], b.x - c[0]); }
    else if (b.k === 3) { const c = landCenter(); b.cx = b.x; b.cy = b.y; b.tcx = c[0]; b.tcy = c[1]; b.ct = rnd(25, 40); }
    else { songPlan(b); }
    if (roostOn) assignRoosts(b);
  }

  // 海鸥盘旋于喷气的鲸
  function watchWhales(dt) {
    whaleCheck -= dt;
    if (whaleCheck > 0) return;
    whaleCheck = 0.4;
    if (!GS.sea || !GS.sea.whaleSpots || roostOn) return;
    const ws = GS.sea.whaleSpots();
    if (!ws || !ws.length) return;
    for (let j = 0; j < ws.length; j++) {
      const w = ws[j];
      if (!(W.t - w.spoutT < 0.5) || !isFinite(w.spX)) continue;
      // 最近的两三只海鸥飞去
      const gulls = B.filter(b => b.k === 1 && b.mode === 'free' && b.whale !== j);
      gulls.sort((p, q) => Math.hypot(p.x - w.spX, p.y - w.spY) - Math.hypot(q.x - w.spX, q.y - w.spY));
      const n = Math.min(gulls.length, w.role === 1 ? 2 : 3);
      const D = c01((w.spY - W.horizonY) / Math.max(1, W.h - W.horizonY));
      for (let k = 0; k < n; k++) {
        const g = gulls[k];
        g.whale = j; g.ct = rnd(12, 20);
        g.wz = clamp(1 - D * 1.4, 0.15, 0.95);
        const sc = Math.max(0.2, 1 - 0.62 * g.wz);
        g.tcx = w.spX; g.tcy = w.spY - (40 + 30 * Math.random()) * cu() * sc;
        g.R = rnd(40, 70);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  数量的同步与出现
  // ════════════════════════════════════════════════════════════
  function scatterBird(b) {
    // 存档恢复：各在其位，完整无缺
    const u = cu();
    if (b.k === 0) {
      const F = flock(b.fl), zr = FLOCK_Z[b.fl], z = (zr[0] + zr[1]) / 2, band = skyBand(z);
      if (!F.placed) { F.placed = true; F.px = W.w * rnd(0.2, 0.8); F.py = lerp(band[0], band[1], rnd(0.3, 0.7)); }
      b.x = F.px + rnd(-60, 60) * u; b.y = F.py + rnd(-30, 30) * u;
      b.vx = rnd(0.6, 1) * 120 * u; b.vy = rnd(-20, 20);
    } else if (b.k === 1) {
      const c = seaCenter(); b.cx = b.tcx = c[0]; b.cy = b.tcy = c[1]; b.zc = b.z = c[2]; b.ct = rnd(10, 25);
      b.x = c[0] + Math.cos(b.ang) * b.R * u; b.y = c[1] + Math.sin(b.ang) * b.R * 0.34 * u;
    } else if (b.k === 3) {
      const c = landCenter(); b.cx = b.tcx = c[0]; b.cy = b.tcy = c[1]; b.ct = rnd(20, 40);
      b.x = c[0] + Math.cos(b.ang) * b.R * u; b.y = c[1] + Math.sin(b.ang) * b.R * 0.4 * u;
    } else {
      const s = treeSpot() || groundSpot();
      if (s) { b.x = s.x; b.y = s.y; b.layer = s.layer; b.ground = !!s.ground; b.st = s.ground ? 'ground' : 'perch'; b.T = 0; b.dur = rnd(1, 9); b.hopT = 1; }
      else { b.x = W.w * rnd(0.3, 0.7); b.y = W.h * 0.3; b.st = 'hoverFly'; b.T = 0; b.dur = 3; }
    }
    b.mode = 'free';
  }
  function syncPop(dt) {
    const n = Math.max(0, W.popN('bird') | 0);
    const pb = W.pop.bird;
    if (B.length > n) B.length = n;
    if (B.length >= n) { spawnAcc = 0; return; }
    if (pb && pb.instant) {
      for (const F of FL) if (F) F.placed = false;
      while (B.length < n) {
        const b = makeBird(B.length, 0, 0, true);
        flock(b.fl < 0 ? 0 : b.fl);
        scatterBird(b);
        B.push(b);
      }
      if (roostOn) assignRoosts();
      return;
    }
    spawnAcc += dt * 18;
    const sp = W.spirit;
    while (spawnAcc >= 1 && B.length < n) {
      spawnAcc -= 1;
      const x = pb && isFinite(pb.x) ? pb.x : sp.x, y = pb && isFinite(pb.y) ? pb.y : sp.y;
      const b = makeBird(B.length, x + rnd(-6, 6), y + rnd(-6, 6), false);
      if (b.fl >= 0) flock(b.fl);
      // 自光中迸出，先绕着灵飞两圈
      const a = rnd(0, TAU), s = rnd(120, 260) * cu();
      b.vx = Math.cos(a) * s; b.vy = Math.sin(a) * s;
      b.mode = 'orbitS'; b.orbAcc = 0; b.orbA = Math.atan2(b.y - sp.y, b.x - sp.x); b.orbDir = 1;
      b.z = 0.1; b.a = 0;
      B.push(b);
      if (fxOK()) GS.fx.sparkle(b.x, b.y, 6, [255, 252, 240], 8, 'air');
    }
  }

  // ════════════════════════════════════════════════════════════
  //  绘制
  // ════════════════════════════════════════════════════════════
  const DC = { frame: -1, swift: [], rim: [255, 255, 255], rimA: 0 };
  function colors() {
    if (DC.frame >= 0 && W.frame - DC.frame < 3 && W.frame >= DC.frame) return DC;
    DC.frame = W.frame;
    for (let k = 0; k < 4; k++) DC.swift[k] = W.shadeCSS(SWIFT, [0.08, 0.32, 0.55, 0.78][k]);
    let rim = U.mixRGB(RIM_NIGHT, RIM_DAY, W.dayFactor);
    rim = U.mixRGB(rim, RIM_WARM, W.dusk * 0.8);
    DC.rim = rim;
    DC.rimA = (0.15 + 0.45 * W.daylight) * W.lv.light;
    return DC;
  }
  function passOf(b) {
    if (b.a <= 0.01) return null;
    if (b.mode === 'float') return b.perch ? ['seaFar', 'seaMid', 'seaNear'][b.perch.y < W.waterlineY(0) ? 0 : b.perch.y < W.waterlineY(1) ? 1 : 2] : null;
    if (b.mode === 'perched') return b.perch ? L_PASS[b.perch.layer] || 'near' : 'near';
    if (b.mode === 'toRoost' && b.perch) {
      const d = Math.hypot(b.perch.x - b.x, b.perch.y - b.y);
      if (d < 40 * cu()) return L_PASS[b.perch.layer] || 'near';
    }
    if (b.k === 2) {
      if (b.st === 'perch' || b.st === 'ground') return L_PASS[b.layer] || 'near';
      if (b.st === 'fly' && b.layer === 1 && b.l0 === 1) return 'mid';
      return 'air';
    }
    if (b.mode === 'orbitS') return 'air';
    if (b.k === 3) return 'sky';
    return b.z > 0.55 ? 'sky' : 'air';
  }

  // 「m」形的翅：一笔折线（燕子）
  function mWing(ctx, b, S) {
    const w = b.flap > 0.02 ? Math.sin(b.ph) * b.flap + 0.18 * (1 - b.flap) : 0.18;
    const sweep = S * (0.1 + 0.16 * (1 - b.flap)) * b.face;
    const tilt = clamp(b.vy / (Math.abs(b.vx) + 60), -0.6, 0.6) * 0.35 * b.face;
    const x = b.x, y = b.y;
    const tipY = -w * S * 0.36 + S * 0.04, elY = -w * S * 0.12 - S * 0.07;
    const c = 1 - tilt * tilt * 0.5, s = tilt;          // 小角度近似
    let px = -S * 0.5 - sweep, py = tipY;
    ctx.moveTo(x + px * c - py * s, y + px * s + py * c);
    px = -S * 0.2 - sweep * 0.4; py = elY;
    const ax = x + px * c - py * s, ay = y + px * s + py * c;
    ctx.quadraticCurveTo(ax, ay, x, y);
    px = S * 0.2 - sweep * 0.4;
    const bx = x + px * c - py * s, by = y + px * s + py * c;
    px = S * 0.5 - sweep; py = tipY;
    ctx.quadraticCurveTo(bx, by, x + px * c - py * s, y + px * s + py * c);
  }
  // 近处的燕子：镰刀形的翅（前缘外凸、后缘内凹，翼尖尖细），一笔填满；短短的身子与叉尾
  function scythe(ctx, b, S) {
    const w = b.flap > 0.02 ? Math.sin(b.ph) * b.flap + 0.18 * (1 - b.flap) : 0.18;
    const sweep = S * (0.1 + 0.18 * (1 - b.flap)), f = b.face;
    const tilt = clamp(b.vy / (Math.abs(b.vx) + 60), -0.6, 0.6) * 0.35 * f;
    const c = 1 - tilt * tilt * 0.5, s = tilt;
    const x = b.x, y = b.y;
    const P = (px, py) => { GX = x + px * c - py * s; GY = y + px * s + py * c; };
    const tipY = -w * S * 0.36 + S * 0.05, elY = -w * S * 0.13 - S * 0.06;
    for (let side = -1; side <= 1; side += 2) {
      P(side * S * 0.05, -S * 0.02); ctx.moveTo(GX, GY);
      P(side * S * 0.24 - sweep * 0.35 * f, elY - S * 0.05); const ax = GX, ay = GY;
      P(side * S * 0.52 - sweep * f, tipY); const tx = GX, ty = GY;
      ctx.quadraticCurveTo(ax, ay, tx, ty);
      P(side * S * 0.22 - sweep * 0.55 * f, elY + S * 0.06); const bx = GX, by = GY;
      P(-f * S * 0.04, S * 0.035);
      ctx.quadraticCurveTo(bx, by, GX, GY);
      ctx.closePath();
    }
    // 身子（沿飞行方向的短梭）与叉尾
    P(f * S * 0.13, -S * 0.005); ctx.moveTo(GX, GY);
    P(f * S * 0.02, -S * 0.035); ctx.lineTo(GX, GY);
    P(-f * S * 0.12, -S * 0.01); ctx.lineTo(GX, GY);
    P(-f * S * 0.2, -S * 0.03); ctx.lineTo(GX, GY);
    P(-f * S * 0.15, S * 0.005); ctx.lineTo(GX, GY);
    P(-f * S * 0.2, S * 0.03); ctx.lineTo(GX, GY);
    P(-f * S * 0.1, S * 0.02); ctx.lineTo(GX, GY);
    P(f * S * 0.03, S * 0.03); ctx.lineTo(GX, GY);
    ctx.closePath();
  }
  let GX = 0, GY = 0;
  // 海鸥：白色的弯翅（二次曲线围成的翼面），翼尖深色
  const GP = new Float64Array(18);
  function drawGull(ctx, b, C) {
    const S = 24 * sizeK(b.z) * (0.9 + 0.2 * b.seed);
    const w = b.flap > 0.02 ? Math.sin(b.ph) * b.flap * 0.9 + 0.3 * (1 - b.flap) : 0.3;
    const x = b.x, y = b.y;
    const hz = b.z * 0.8;
    const body = W.shade(GULL, hz, 0.12), back = W.shade(GULL_BACK, hz, 0.1), tip = W.shade(GULL_TIP, hz);
    const tilt = clamp(b.vy / (Math.abs(b.vx) + 50), -0.5, 0.5) * 0.3 * b.face;
    const c = Math.cos(tilt), s = Math.sin(tilt);
    ctx.globalAlpha = b.a;
    for (let side = -1; side <= 1; side += 2) {
      const ex = side * S * 0.22, ey = -S * (0.08 + 0.2 * w);
      const tx = side * S * 0.52 - b.face * S * 0.06, ty = -S * (0.02 + 0.34 * w) + S * 0.06;
      const G = GP;
      G[0] = side * S * 0.03; G[1] = -S * 0.02; G[2] = ex * 0.5; G[3] = ey - S * 0.06; G[4] = ex; G[5] = ey;
      G[6] = (ex + tx) * 0.5; G[7] = (ey + ty) * 0.5 - S * 0.03; G[8] = tx; G[9] = ty;
      G[10] = (ex + tx) * 0.5 + side * S * 0.01; G[11] = (ey + ty) * 0.5 + S * 0.04; G[12] = ex; G[13] = ey + S * 0.07;
      G[14] = ex * 0.5; G[15] = S * 0.03; G[16] = side * S * 0.03; G[17] = S * 0.03;
      for (let k = 0; k < 18; k += 2) { const px = G[k], py = G[k + 1]; G[k] = x + px * c - py * s; G[k + 1] = y + px * s + py * c; }
      ctx.beginPath();
      ctx.moveTo(G[0], G[1]);
      ctx.quadraticCurveTo(G[2], G[3], G[4], G[5]);
      ctx.quadraticCurveTo(G[6], G[7], G[8], G[9]);
      ctx.quadraticCurveTo(G[10], G[11], G[12], G[13]);
      ctx.quadraticCurveTo(G[14], G[15], G[16], G[17]);
      ctx.closePath();
      ctx.fillStyle = css(w > 0.5 ? back : body, 1);
      ctx.fill();
      // 翼尖
      ctx.beginPath();
      ctx.moveTo(G[8], G[9]);
      const k = 0.3;
      ctx.lineTo(lerp(G[8], G[6], k), lerp(G[9], G[7], k));
      ctx.lineTo(lerp(G[8], G[10], k * 1.4), lerp(G[9], G[11], k * 1.4));
      ctx.closePath();
      ctx.fillStyle = css(tip, 1);
      ctx.fill();
    }
    // 身与头
    ctx.beginPath();
    ctx.ellipse(x + b.face * S * 0.02, y + S * 0.01, S * 0.09, S * 0.04, tilt, 0, TAU);
    ctx.fillStyle = css(body, 1);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + b.face * S * 0.1, y - S * 0.005, S * 0.032, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 浮在水上的海鸥
  function drawFloatGull(ctx, b) {
    const D = c01((b.y - W.horizonY) / Math.max(1, W.h - W.horizonY));
    const S = 10 * (0.12 + 0.88 * D) * cu() * 1.6;
    const body = W.shade(GULL, (1 - D) * 0.4, 0.1), tip = W.shade(GULL_TIP, (1 - D) * 0.4);
    const x = b.x, y = b.y, f = b.face;
    ctx.globalAlpha = b.a;
    ctx.beginPath();
    ctx.moveTo(x - f * S * 0.5, y - S * 0.12);
    ctx.quadraticCurveTo(x - f * S * 0.1, y - S * 0.32, x + f * S * 0.3, y - S * 0.2);
    ctx.quadraticCurveTo(x + f * S * 0.4, y, x, y + S * 0.03);
    ctx.quadraticCurveTo(x - f * S * 0.35, y + S * 0.02, x - f * S * 0.5, y - S * 0.12);
    ctx.fillStyle = css(body, 1); ctx.fill();
    ctx.beginPath(); ctx.arc(x + f * S * 0.32, y - S * 0.33, S * 0.12, 0, TAU); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - f * S * 0.5, y - S * 0.12); ctx.lineTo(x - f * S * 0.22, y - S * 0.2); ctx.lineTo(x - f * S * 0.25, y - S * 0.1); ctx.closePath();
    ctx.fillStyle = css(tip, 1); ctx.fill();
    // 水上一道细光
    ctx.beginPath(); ctx.moveTo(x - S * 0.55, y + S * 0.06); ctx.lineTo(x + S * 0.5, y + S * 0.06);
    ctx.strokeStyle = css(W.shade([250, 246, 236], 0.1, 0.4), 0.35 * (0.3 + 0.7 * W.daylight));
    ctx.lineWidth = Math.max(0.6, S * 0.06); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 鹰：自下方远望的剪影——平直宽阔的翅，指状上翘的翼尖，小小的头，扇形的尾；盘旋时微微倾侧
  function drawEagle(ctx, b, C) {
    const S = 50 * sizeK(b.z);
    const x = b.x, y = b.y;
    const col = W.shade(EAGLE, b.z * 0.55), under = W.shade([96, 74, 54], b.z * 0.55);
    const span = 0.78 + 0.22 * Math.abs(Math.cos(b.ang));
    const bank = Math.cos(b.ang) * 0.24 * Math.sign(b.om || 1) + clamp(b.vy / 200, -0.2, 0.2);
    const flap = b.flap > 0.02 ? Math.sin(b.ph) * b.flap : 0;
    const dih = S * (0.035 + 0.09 * flap);
    const c = Math.cos(bank), s = Math.sin(bank);
    ctx.globalAlpha = b.a;
    ctx.beginPath();
    const P = (px, py, first) => { const X = x + px * c - py * s, Y = y + px * s + py * c; if (first) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); };
    for (let sd = -1; sd <= 1; sd += 2) {
      const sp = S * 0.5 * span;
      P(sd * S * 0.02, -S * 0.03, true);
      P(sd * sp * 0.35, -S * 0.045 - dih * 0.35);            // 前缘
      P(sd * sp * 0.78, -S * 0.05 - dih * 0.8);
      // 指状的初级飞羽（五指，上翘）
      P(sd * sp * 0.9, -S * 0.07 - dih);
      P(sd * sp * 0.97, -S * 0.062 - dih * 1.05);
      P(sd * sp * 0.92, -S * 0.045 - dih);
      P(sd * sp * 1.0, -S * 0.04 - dih * 1.02);
      P(sd * sp * 0.93, -S * 0.022 - dih * 0.95);
      P(sd * sp * 0.98, -S * 0.012 - dih * 0.95);
      P(sd * sp * 0.88, S * 0.004 - dih * 0.9);
      // 后缘：次级飞羽鼓出
      P(sd * sp * 0.6, S * 0.05 - dih * 0.6);
      P(sd * sp * 0.3, S * 0.065 - dih * 0.3);
      P(sd * S * 0.05, S * 0.05);
      ctx.closePath();
    }
    // 头
    P(-S * 0.028, -S * 0.03, true); P(-S * 0.018, -S * 0.075); P(S * 0.018, -S * 0.075); P(S * 0.028, -S * 0.03); ctx.closePath();
    // 扇形的尾
    P(-S * 0.035, S * 0.04, true); P(-S * 0.06, S * 0.13); P(S * 0.06, S * 0.13); P(S * 0.035, S * 0.04); ctx.closePath();
    ctx.fillStyle = css(col, 1);
    ctx.fill();
    // 翼下一道稍浅的覆羽带
    ctx.beginPath();
    for (let sd = -1; sd <= 1; sd += 2) {
      const sp = S * 0.5 * span;
      P(sd * S * 0.05, -S * 0.012, true);
      P(sd * sp * 0.72, -S * 0.03 - dih * 0.72);
      P(sd * sp * 0.7, -S * 0.012 - dih * 0.7);
      P(sd * S * 0.05, S * 0.006);
      ctx.closePath();
    }
    ctx.fillStyle = css(under, 0.55);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  // 小鸟（栖着 / 在地上 / 飞）
  function drawSmall(ctx, b, C, dark) {
    const lk = b.k === 2 || b.mode === 'perched' ? (LAYER_K[(b.perch ? b.perch.layer : b.layer)] || 1) : 1;
    let S = (b.k === 2 ? 8.6 : 6.6) * cu() * (b.mode === 'perched' || (b.k === 2 && b.st !== 'fly' && b.st !== 'hoverFly') ? Math.max(0.55, lk) : 1 - 0.55 * b.z);
    if (b.k === 3) S *= 1.7;
    const layer = b.perch ? b.perch.layer : b.layer;
    const depth = W.LAYERS && W.LAYERS[layer] ? W.LAYERS[layer].depth : 0;
    const col = W.shade(dark ? SWIFT : SONG, depth * 0.8);
    const x = b.x, y = b.y + (b.hy || 0), f = b.face;
    ctx.globalAlpha = b.a;
    const flyingNow = b.k === 2 ? (b.st === 'fly' || b.st === 'hoverFly') : false;
    if (flyingNow) {
      // 飞：身体 + 扑动的翅
      ctx.beginPath();
      ctx.ellipse(x, y, S * 0.42, S * 0.2, clamp(b.vy / (Math.abs(b.vx) + 40), -0.6, 0.6) * f, 0, TAU);
      ctx.fillStyle = css(col, 1); ctx.fill();
      const w = b.flap ? Math.sin(b.ph) : -0.2;
      ctx.beginPath();
      ctx.moveTo(x - f * S * 0.1, y - S * 0.05);
      ctx.quadraticCurveTo(x - f * S * 0.25, y - S * (0.2 + 0.5 * w), x - f * S * 0.5, y - S * 0.7 * w);
      ctx.moveTo(x - f * S * 0.1, y - S * 0.05);
      ctx.quadraticCurveTo(x + f * S * 0.05, y - S * (0.2 + 0.4 * w), x + f * S * 0.12, y - S * 0.55 * w);
      ctx.strokeStyle = css(col, 1); ctx.lineWidth = Math.max(0.8, S * 0.14); ctx.lineCap = 'round'; ctx.stroke();
      ctx.globalAlpha = 1;
      return;
    }
    // 栖：圆身、头、尾、喙
    const peck = b.peck > 0 ? Math.sin((0.5 - b.peck) / 0.5 * Math.PI) : 0;
    const tail = Math.sin(W.t * 3 + b.seed * 20) > 0.97 ? 0.25 : 0;
    ctx.beginPath();
    ctx.ellipse(x, y - S * 0.28, S * 0.38, S * 0.26, -0.25 * f, 0, TAU);
    const hx = x + f * S * (0.3 + 0.08 * peck), hy = y - S * (0.52 - 0.35 * peck);
    ctx.moveTo(hx + S * 0.17, hy);
    ctx.arc(hx, hy, S * 0.17, 0, TAU);
    // 尾
    ctx.moveTo(x - f * S * 0.25, y - S * 0.35);
    ctx.lineTo(x - f * S * 0.7, y - S * (0.28 + tail));
    ctx.lineTo(x - f * S * 0.66, y - S * (0.16 + tail));
    ctx.lineTo(x - f * S * 0.2, y - S * 0.18);
    ctx.closePath();
    // 喙
    ctx.moveTo(hx + f * S * 0.14, hy - S * 0.04);
    ctx.lineTo(hx + f * S * 0.34, hy + S * 0.02);
    ctx.lineTo(hx + f * S * 0.13, hy + S * 0.06);
    ctx.closePath();
    ctx.fillStyle = css(col, 1);
    ctx.fill();
    // 雀鸟的暖色胸
    if (!dark) {
      ctx.beginPath();
      ctx.ellipse(x + f * S * 0.16, y - S * 0.25, S * 0.15, S * 0.12, -0.3 * f, 0, TAU);
      ctx.fillStyle = css(W.shade(SONG_BREAST, depth * 0.8), 0.75);
      ctx.fill();
    }
    // 细细的描光（迎光的背）
    if (C.rimA > 0.05) {
      ctx.beginPath();
      ctx.arc(x, y - S * 0.28, S * 0.36, -Math.PI * 0.85, -Math.PI * 0.2);
      ctx.strokeStyle = css(C.rim, C.rimA * 0.7);
      ctx.lineWidth = Math.max(0.6, S * 0.08);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function drawFading(ctx, b, pass) {
    // 渐显的燕子：单独画（带透明度）
    const S = 12 * sizeK(b.z) * (0.9 + 0.2 * b.seed);
    ctx.beginPath();
    mWing(ctx, b, S);
    ctx.strokeStyle = W.shadeCSS(SWIFT, b.z * 0.78, b.a);
    ctx.lineWidth = Math.max(0.9, S * 0.13);
    ctx.stroke();
  }

  let passFrame = -1;
  function draw(ctx, pass) {
    if (!ready || !B.length) return;
    if (pass !== 'sky' && pass !== 'air' && pass !== 'mid' && pass !== 'near' && pass !== 'far' && pass[0] !== 's') return;
    if (passFrame !== W.frame) { passFrame = W.frame; for (let i = 0; i < B.length; i++) B[i].pass = passOf(B[i]); }
    const C = colors();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (pass === 'sky' || pass === 'air') {
      // 燕群（整群合一笔）
      // 近而大的画成镰刀形的实心翅（一笔填满），远而小的仍是一笔「m」
      for (let bk = 0; bk < 4; bk++) {
        for (let solid = 0; solid < 2; solid++) {
          ctx.beginPath();
          let any = false, lw = 0, n = 0;
          for (let i = 0; i < B.length; i++) {
            const b = B[i];
            if (b.k !== 0 || b.a < 1 || b.mode === 'perched' || b.mode === 'float' || b.pass !== pass) continue;
            const z = b.z, k = z < 0.2 ? 0 : z < 0.45 ? 1 : z < 0.7 ? 2 : 3;
            if (k !== bk) continue;
            const S = 12 * sizeK(z) * (0.9 + 0.2 * b.seed);
            if ((S >= 8.5 ? 1 : 0) !== solid) continue;
            if (solid) scythe(ctx, b, S); else mWing(ctx, b, S);
            lw += S; n++; any = true;
          }
          if (!any) continue;
          if (solid) { ctx.fillStyle = C.swift[bk]; ctx.fill(); }
          else {
            ctx.strokeStyle = C.swift[bk];
            ctx.lineWidth = Math.max(0.9, (lw / n) * 0.13);
            ctx.stroke();
          }
        }
      }
      for (let i = 0; i < B.length; i++) {
        const b = B[i];
        if (b.pass !== pass) continue;
        if (b.k === 0 && b.a < 1 && b.mode !== 'perched') drawFading(ctx, b, pass);
        else if (b.k === 1 && b.mode !== 'float' && b.mode !== 'perched') drawGull(ctx, b, C);
        else if (b.k === 3 && b.mode !== 'perched') drawEagle(ctx, b, C);
        else if (b.k === 2 || b.mode === 'perched' || b.mode === 'toRoost') {
          if (b.k === 0 && b.mode === 'toRoost') continue;           // 已在燕群里画过
          drawSmall(ctx, b, C, b.k !== 2);
        }
      }
      return;
    }
    for (let i = 0; i < B.length; i++) {
      const b = B[i];
      if (b.pass !== pass) continue;
      if (b.mode === 'float') drawFloatGull(ctx, b);
      else if (b.k === 1 && b.mode === 'toFloat') drawGull(ctx, b, C);
      else if (b.k === 3 && b.mode !== 'perched') drawEagle(ctx, b, C);
      else if (b.k === 0 && b.mode === 'toRoost') { ctx.beginPath(); mWing(ctx, b, 12 * sizeK(b.z)); ctx.strokeStyle = C.swift[1]; ctx.lineWidth = Math.max(0.9, 12 * sizeK(b.z) * 0.13); ctx.stroke(); }
      else drawSmall(ctx, b, C, b.k !== 2);
    }
    ctx.globalAlpha = 1;
  }

  // ════════════════════════════════════════════════════════════
  //  生命周期
  // ════════════════════════════════════════════════════════════
  function resize() {
    if (!(W.w > 4 && W.h > 4)) { ready = false; return; }
    const ow = lastW, oh = lastH;
    if (ow > 4 && oh > 4 && (ow !== W.w || oh !== W.h)) {
      const kx = W.w / ow, ky = W.h / oh;
      for (const b of B) {
        b.x *= kx; b.y *= ky; b.cx *= kx; b.cy *= ky; b.tcx *= kx; b.tcy *= ky; b.tx *= kx; b.ty *= ky; b.x0 *= kx; b.y0 *= ky;
        b.ct = Math.min(b.ct, 1);
        if (b.perch) { b.perch = null; if (b.mode === 'perched' || b.mode === 'float' || b.mode === 'toRoost' || b.mode === 'toFloat') b.mode = 'free'; }
        if (b.k === 2 && b.st !== 'fly') { b.st = 'hoverFly'; b.T = 0; b.dur = 1; }
      }
      if (roostOn) assignRoosts();
    }
    lastW = W.w; lastH = W.h;
    ready = true;
  }
  function init() {}
  function update(dt) {
    if (!ready || W.w !== lastW || W.h !== lastH) { resize(); if (!ready) return; }
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.05);
    spiritCtx();
    syncPop(dt);
    if (!B.length) return;
    updateRoost(dt);
    watchWhales(dt);
    updateBirds(dt);
  }
  function reset() { B.length = 0; FL.length = 0; spawnAcc = 0; roostOn = false; roostCheck = 0; }
  function restore() {
    if (!ready || W.w !== lastW || W.h !== lastH) resize();
    const n = W.popN('bird') | 0;
    if (B.length > n) B.length = n;
    for (const b of B) { b.a = 1; if (b.mode === 'orbitS' || b.mode === 'born') scatterBird(b); }
    if (W.pop.bird) W.pop.bird.instant = true;
    roostOn = false; roostCheck = 0;
    spiritCtx();
    syncPop(0.016);
    // 若恢复时已是夜里，鸟即刻栖在枝上
    const el = W.sun ? W.sun.elev : 1;
    if (W.lv.dayNight > 0.5 && el < 0.07) {
      roostOn = true; assignRoosts();
      for (const b of B) if (b.perch && (b.mode === 'toRoost' || b.mode === 'toFloat')) { b.x = b.perch.x; b.y = b.perch.y; b.mode = b.mode === 'toFloat' ? 'float' : 'perched'; }
    }
  }
  function pick(x, y, r) {
    let best = null;
    for (const b of B) {
      if (b.a < 0.8 || b.mode === 'away') continue;
      const pass = passOf(b);
      if (!pass) continue;
      let S, top;
      if (b.k === 0) { S = 12 * sizeK(b.z); top = b.y - S * 0.3; }
      else if (b.k === 1) { S = b.mode === 'float' ? 10 : 24 * sizeK(b.z); top = b.y - S * 0.4; }
      else if (b.k === 3) { S = 46 * sizeK(b.z); top = b.y - S * 0.15; }
      else { S = 7 * cu(); top = b.y - S * 0.7; }
      const d = Math.max(0, Math.hypot(b.x - x, b.y - y) - S * 0.35);
      if (d < r && (!best || d < best.d)) best = { label: KIND_CN[b.k], x: b.x, y: top, d };
    }
    return best;
  }

  GS.air = {
    init, resize, update, draw, reset, restore, pick,
    get debug() {
      const m = {};
      for (const b of B) { const k = KIND_CN[b.k] + ':' + b.mode + (b.k === 2 ? '/' + b.st : ''); m[k] = (m[k] || 0) + 1; }
      return { n: B.length, roost: roostOn, modes: m };
    },
    _birds: B,
  };
})(window.GS);
