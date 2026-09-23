/* ─────────────────────────────────────────────────────────────
 * sea.js —— 水中的生命（创 1:20–22）
 *
 *   鱼：   自上方透视俯看的海面之下。三四个鱼群（紧密的小银鱼、松散的条纹鱼），
 *          外加一两只独行的蝠鲼。boids 在"海面平面"上运动（x 随透视缩放，y 另有前缩），
 *          邻域以网格检索。深色细长的身影按水深着色，转身时侧腹闪一下银光；
 *          偶尔跃出水面（短抛物线 + 溅起的涟漪）；黄昏浮上水面点出圆涟漪；
 *          有了生命之光以后，夜里拖着青色的荧光尾迹。
 *   大鱼： 两头成鲸与一头幼鲸（幼鲸随母）。巡游（水下剪影 + 露出的深色脊背）→
 *          每 25–40 秒喷气（白雾）→ 罕见地跃出（翻滚的抛物弧，巨大的水花）→ 举尾下潜。
 *          灵在鲸上方静悬两秒，它便跃出。夜里偶有鲸歌。
 *   灵：   缓缓掠过水面 → 鱼聚成缓转的鱼球；急掠 → 四散；言说 → 停住，面向灵。
 *
 *   对外：标准模块接口 + whaleSpots()（海鸥据此绕着喷气的鲸盘旋）
 *   事件：'splash' {x, y, size} · 'whale' {type:'spout'|'breach'|'song', x, y}
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, TAU } = U;

  // ── 小工具 ──────────────────────────────────────────────────
  const c01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
  const sstep = (a, b, x) => { const t = c01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const rnd = (a, b) => a + Math.random() * (b - a);
  const hex = U.hexRGB;
  const fxOK = () => GS.fx && typeof GS.fx.add === 'function';
  const emit = (e, p) => { try { GS.bus.emit(e, p); } catch (err) { /* 听者的错不该让海停摆 */ } };
  function angDiff(a, b) { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; else if (d < -Math.PI) d += TAU; return d; }
  const css = (c, a) => U.rgba(c[0], c[1], c[2], a);
  const BANDS = ['seaFar', 'seaMid', 'seaNear'];
  const BAND_I = { seaFar: 0, seaMid: 1, seaNear: 2 };

  // ── 色板 ────────────────────────────────────────────────────
  const FISH_DARK = [[8, 20, 32], [16, 30, 44]];       // 银鱼的背 / 条纹鱼的背（俯看时是暗的）
  const SILVER = hex('#CFE3F0'), STRIPE = hex('#7F9DB0'), RAY = hex('#1C2F3E');
  const WHALE = hex('#1a2a3a'), BELLY = hex('#6E8FA0'), BIO = hex('#6FF2DC');
  const MIST = [238, 244, 250], FOAM = [236, 244, 252], SPIRIT_C = [150, 195, 255];

  // ── 海面的透视 ──────────────────────────────────────────────
  // 世界单位 = 画面底部（最近处）的像素。屏幕位移 = 世界位移 × s（横）/ × s·fz（纵，前缩）
  let SB = 1;                                      // 窄屏（竖屏手机）上略放大
  const depthAt = y => c01((y - W.horizonY) / Math.max(1, W.h - W.horizonY));
  const scaleAt = y => (0.12 + 0.88 * depthAt(y)) * W.unit * SB;
  const fzOf = D => 0.22 + 0.5 * D;
  const bandOf = y => (y < W.waterlineY(0) ? 0 : y < W.waterlineY(1) ? 1 : 2);

  // ── 海的遮罩：按列缓存三层地表；另以粗网格求出相连的水域 ────────
  const MASK = { step: 4, n: 0, r: null, wl: [0, 0, 0], land: -1, w: 0, h: 0, frame: -99 };
  const BAS = { cell: 12, cols: 0, rows: 0, lab: null, big: 0, sizes: [0], cells: null, bayTop: null };
  function buildMask() {
    const n = Math.max(2, Math.ceil(W.w / MASK.step) + 2);
    if (!MASK.r || MASK.r.length < n * 3) MASK.r = new Float32Array(n * 3);
    MASK.n = n;
    for (let l = 0; l < 3; l++) MASK.wl[l] = W.waterlineY(l);
    for (let i = 0; i < n; i++) {
      const x = Math.min(W.w, i * MASK.step);
      for (let l = 0; l < 3; l++) MASK.r[i * 3 + l] = W.ridgeY(l, x);
    }
    MASK.land = W.lv.land; MASK.w = W.w; MASK.h = W.h; MASK.frame = W.frame;
    buildBasins();
  }
  function seaAt(x, y) {
    if (!(y > W.horizonY + 0.5) || y >= W.h - 1 || !(x >= 0) || x > W.w) return false;
    let i = Math.round(x / MASK.step);
    if (i >= MASK.n) i = MASK.n - 1;
    const b = i * 3, R = MASK.r, L = MASK.wl;
    if (!R) return false;
    if (y >= R[b] && y <= L[0]) return false;
    if (y >= R[b + 1] && y <= L[1]) return false;
    if (y >= R[b + 2] && y <= L[2]) return false;
    return true;
  }
  // 开阔的水：中心与四周都是海（rx 为横向屏幕像素）
  function openAt(x, y, rx) {
    const ry = rx * fzOf(depthAt(y));
    return seaAt(x, y) && seaAt(x - rx, y) && seaAt(x + rx, y) && seaAt(x, y - ry) && seaAt(x, y + ry) &&
      seaAt(x - rx * 0.7, y - ry * 0.7) && seaAt(x + rx * 0.7, y - ry * 0.7);
  }
  // 相连的水域（泛洪标号）：鱼群与鲸只在自己所在的水域里挑去处
  function buildBasins() {
    const c = BAS.cell, top = W.horizonY + 1;
    const cols = Math.max(1, Math.ceil(W.w / c)), rows = Math.max(1, Math.ceil((W.h - top) / c));
    BAS.cols = cols; BAS.rows = rows;
    const n = cols * rows;
    if (!BAS.lab || BAS.lab.length < n) { BAS.lab = new Int16Array(n); BAS.cells = new Int32Array(n); }
    const lab = BAS.lab, q = BAS.cells;
    for (let i = 0; i < n; i++) lab[i] = seaAt(Math.min(W.w - 1, (i % cols + 0.5) * c), Math.min(W.h - 2, top + ((i / cols | 0) + 0.5) * c)) ? -1 : 0;
    BAS.sizes = [0];
    let id = 0, bigN = 0;
    for (let i = 0; i < n; i++) {
      if (lab[i] !== -1) continue;
      id++;
      if (id > 30000) break;
      let h = 0, t = 0; q[t++] = i; lab[i] = id; let cnt = 0;
      while (h < t) {
        const k = q[h++]; cnt++;
        const cx = k % cols, cy = (k / cols) | 0;
        if (cx > 0 && lab[k - 1] === -1) { lab[k - 1] = id; q[t++] = k - 1; }
        if (cx < cols - 1 && lab[k + 1] === -1) { lab[k + 1] = id; q[t++] = k + 1; }
        if (cy > 0 && lab[k - cols] === -1) { lab[k - cols] = id; q[t++] = k - cols; }
        if (cy < rows - 1 && lab[k + cols] === -1) { lab[k + cols] = id; q[t++] = k + cols; }
      }
      BAS.sizes[id] = cnt;
      if (cnt > bigN) { bigN = cnt; BAS.big = id; }
    }
    if (!id) BAS.big = 0;
    // 开阔的海湾：自画面底部向上、一路是海的那一段（不被近岸遮住）
    if (!BAS.bayTop || BAS.bayTop.length < cols) BAS.bayTop = new Float32Array(cols);
    for (let cx = 0; cx < cols; cx++) {
      let r = rows - 1;
      while (r >= 0 && lab[r * cols + cx] > 0) r--;
      BAS.bayTop[cx] = r >= rows - 1 ? 1e9 : top + (r + 1) * c;
    }
  }
  function inBay(x, y) {
    if (!BAS.bayTop) return true;
    const cx = Math.floor(x / BAS.cell);
    if (cx < 0 || cx >= BAS.cols) return false;
    return y >= BAS.bayTop[cx];
  }
  function basinAt(x, y) {
    if (!BAS.lab) return 0;
    const cx = Math.floor(x / BAS.cell), cy = Math.floor((y - W.horizonY - 1) / BAS.cell);
    if (cx < 0 || cy < 0 || cx >= BAS.cols || cy >= BAS.rows) return 0;
    return BAS.lab[cy * BAS.cols + cx] || 0;
  }
  // 在某水域里、某深度带中随机取一处海（margin：世界单位的开阔半径）
  function randSea(d0, d1, basin, margin, x0, x1, bay) {
    const hz = W.horizonY, span = W.h - hz;
    const xa = x0 == null ? W.w * 0.02 : x0, xb = x1 == null ? W.w * 0.98 : x1;
    for (let k = 0; k < 90; k++) {
      const D = rnd(d0, d1), y = hz + D * span, x = rnd(xa, xb);
      if (basin && basinAt(x, y) !== basin) continue;
      if (bay !== false && !inBay(x, y)) continue;
      if (margin ? openAt(x, y, margin * scaleAt(y)) : seaAt(x, y)) return [x, y];
    }
    return null;
  }
  // 离 (x, y) 最近的一处海
  function nearestSea(x, y, margin) {
    if (margin ? openAt(x, y, margin * scaleAt(y)) : seaAt(x, y)) return [x, y];
    for (let r = 10; r < Math.max(W.w, W.h); r += 14) {
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * TAU, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.6;
        if (margin ? openAt(px, py, margin * scaleAt(py)) : seaAt(px, py)) return [px, py];
      }
    }
    return null;
  }

  // ════════════════════════════════════════════════════════════
  //  鱼
  // ════════════════════════════════════════════════════════════
  //   len/wid 世界单位 · R 邻域 · sep 分离距 · v 速度（世界单位/秒）
  const FK = [
    { cn: '鱼', len: 10, wid: 2.5, R: 30, sep: 7, vmin: 15, vmax: 44, wA: 1.3, wC: 1.2, wS: 1.8, wander: 10, beat: 2.6 },
    { cn: '鱼', len: 15, wid: 3.8, R: 46, sep: 15, vmin: 10, vmax: 30, wA: 0.55, wC: 0.45, wS: 1.4, wander: 14, beat: 1.8 },
    { cn: '蝠鲼', len: 26, wid: 40, R: 0, sep: 0, vmin: 8, vmax: 16, wA: 0, wC: 0, wS: 0, wander: 3, beat: 0.35 },
  ];
  // 每个鱼群的深度带（在哪片水里游）
  const SCH_D = [[0.42, 0.94], [0.2, 0.62], [0.3, 0.9], [0.22, 0.9]];
  // 第 i 条鱼属于哪一类、哪一群（70 → 140 时，原有的群长大，另添一群小银鱼与第二只蝠鲼）
  function fishSlot(i) {
    if (i === 6 || i === 77) return [2, -1];
    if (i < 70) { const m = i % 7; return m < 3 ? [0, 0] : m < 5 ? [1, 2] : [0, 1]; }
    const m = i % 5; return m < 2 ? [0, 3] : m < 3 ? [1, 2] : m < 4 ? [0, 0] : [0, 1];
  }
  const FISH = [];
  const SCH = [];
  function school(i) {
    if (!SCH[i]) SCH[i] = { i, tx: W.w * 0.2, ty: W.h * 0.8, wt: 0, orbit: null, cx: 0, cy: 0, n: 0, basin: 0, chk: 0 };
    return SCH[i];
  }
  function makeFish(i, x, y, instant) {
    const sl = fishSlot(i), K = FK[sl[0]];
    const hd = rnd(0, TAU), v = rnd(K.vmin, K.vmax);
    return {
      i, k: sl[0], sc: sl[1], x, y, vx: Math.cos(hd) * v, vy: Math.sin(hd) * v, hd, av: 0,
      len: K.len * rnd(0.85, 1.18), wid: K.wid * rnd(0.9, 1.1), ph: rnd(0, TAU),
      sub: rnd(0.25, 0.85), subB: rnd(0.25, 0.85), born: instant ? -99 : W.t, a: instant ? 1 : 0,
      flick: 0, flickAt: 0, panic: 0, ball: 0, ax: 0, ay: 0, vmin0: null, orb: rnd(0.35, 1), leap: null, seed: Math.random(),
      D: 0.5, s: 1, fz: 0.5, band: 2, tr: new Float32Array(12), trH: 0, trN: 0, trT: 0, wx: x, wy: y,
    };
  }

  // 邻域网格
  let gHead = new Int32Array(1), gNext = new Int32Array(1), gCols = 1, gRows = 1, gSize = 48;
  function buildGrid() {
    const N = FISH.length;
    gSize = Math.max(16, 48 * W.unit * SB);
    gCols = Math.max(1, Math.ceil(W.w / gSize) + 1);
    gRows = Math.max(1, Math.ceil((W.h - W.horizonY) / gSize) + 1);
    const n = gCols * gRows;
    if (gHead.length < n) gHead = new Int32Array(n);
    if (gNext.length < N) gNext = new Int32Array(Math.max(N, 16));
    gHead.fill(-1, 0, n);
    const hz = W.horizonY;
    for (let i = 0; i < N; i++) {
      const f = FISH[i];
      const cx = clamp((f.x / gSize) | 0, 0, gCols - 1), cy = clamp(((f.y - hz) / gSize) | 0, 0, gRows - 1);
      const c = cy * gCols + cx;
      gNext[i] = gHead[c]; gHead[c] = i;
    }
  }

  // 灵的情形（每帧一次）
  const SPC = { over: false, bx: 0, by: 0, slow: false, fast: false, listen: false, R: 140, near: 0 };
  function spiritContext() {
    const sp = W.spirit;
    const u = Math.max(0.6, W.unit);
    SPC.R = 140 * u;
    SPC.over = sp.y > W.horizonY + 3 && seaAt(sp.x, sp.y);
    SPC.bx = sp.x;
    SPC.by = Math.min(W.h - 4, sp.y + W.h * 0.018);
    if (!seaAt(SPC.bx, SPC.by)) SPC.by = sp.y;
    SPC.slow = sp.speed < 300;
    SPC.fast = sp.speed > 1150;
    const awe = W.lt.good >= 1 && W.lv.good < 0.985;
    SPC.listen = !!(W.ritual && W.ritual.holding) || awe;
  }

  let leapT = 3, dimpleAcc = 0;
  function updateFish(dt) {
    const N = FISH.length;
    if (!N) return;
    const hz = W.horizonY, span = Math.max(1, W.h - hz), un = W.unit * SB;
    const wl0 = W.waterlineY(0), wl1 = W.waterlineY(1);
    for (let i = 0; i < N; i++) {
      const f = FISH[i];
      f.D = c01((f.y - hz) / span); f.s = (0.12 + 0.88 * f.D) * un; f.fz = fzOf(f.D);
      f.band = f.y < wl0 ? 0 : f.y < wl1 ? 1 : 2;
    }
    buildGrid();
    // 鱼群的中心、去处
    for (const S of SCH) { if (S) { S.cx = 0; S.cy = 0; S.n = 0; } }
    for (let i = 0; i < N; i++) { const f = FISH[i]; if (f.sc < 0) continue; const S = school(f.sc); S.cx += f.x; S.cy += f.y; S.n++; }
    for (const S of SCH) {
      if (!S || !S.n) continue;
      S.cx /= S.n; S.cy /= S.n;
      S.chk -= dt;
      if (S.chk <= 0) { S.chk = 1; const b = basinAt(S.cx, S.cy); if (b) S.basin = b; }
      S.wt -= dt;
      const s = scaleAt(S.cy);
      if (S.wt <= 0 || Math.hypot(S.tx - S.cx, (S.ty - S.cy) / fzOf(depthAt(S.cy))) < 30 * s) newWaypoint(S);
      if (S.orbit && W.t > S.orbit.until) S.orbit = null;
    }

    const q = W.quality || 1, cap = q < 0.75 ? 7 : 12, stride = q < 0.75 ? 3 : 2, dts = dt * stride;
    const sp = W.spirit, lis = SPC.listen, t = W.t;
    const sunK = W.daylight;
    for (let idx = 0; idx < N; idx++) {
      const f = FISH[idx], K = FK[f.k];
      // 出现：自水中的闪光渐显
      if (f.a < 1) f.a = Math.min(1, f.a + dt / 1.3);
      if (f.flick > 0) f.flick = Math.max(0, f.flick - dt * 2.6);
      if (f.flickAt && t >= f.flickAt) { f.flick = 1; f.flickAt = 0; }
      // 荧光尾迹的采样
      f.trT -= dt;
      if (f.trT <= 0) {
        f.trT = 0.11;
        f.trH = (f.trH + 1) % 6; f.tr[f.trH * 2] = f.x; f.tr[f.trH * 2 + 1] = f.y; if (f.trN < 6) f.trN++;
      }
      if (f.leap) { updateLeap(f, dt); continue; }
      const is = 1 / f.s, isz = 1 / (f.s * f.fz);
      let ax = 0, ay = 0;
      let vmax = K.vmax, vmin = K.vmin;
      if (f.panic > 0) { f.panic -= dt; vmax *= 2.4; vmin *= 1.6; }
      // 群体的转向隔帧计算（交错），其余时候沿用上一次的结果
      const think = ((idx + W.frame) % stride) === 0 || f.panic > 1.3;
      if (!think) { ax = f.ax; ay = f.ay; vmin = f.vmin0 != null ? f.vmin0 : vmin; }
      else {

      if (lis) {
        // 言说：停住，面向灵
        const dx = (sp.x - f.x) * is, dy = (Math.max(sp.y, hz) - f.y) * isz;
        const d = Math.hypot(dx, dy) + 1e-3;
        const tv = 2.2;
        ax += ((dx / d) * tv - f.vx) * 2.4;
        ay += ((dy / d) * tv - f.vy) * 2.4;
        vmin = 0;
        f.ball = Math.max(0, f.ball - dts);
      } else {
        // boids
        if (f.k !== 2) {
          const R2 = K.R * K.R, sep = K.sep;
          let n = 0, avx = 0, avy = 0, cx = 0, cy = 0, sx = 0, sy = 0;
          const gx = clamp((f.x / gSize) | 0, 0, gCols - 1), gy = clamp(((f.y - hz) / gSize) | 0, 0, gRows - 1);
          const y0 = Math.max(0, gy - 1), y1 = Math.min(gRows - 1, gy + 1), x0 = Math.max(0, gx - 1), x1 = Math.min(gCols - 1, gx + 1);
          outer:
          for (let yy = y0; yy <= y1; yy++) {
            for (let xx = x0; xx <= x1; xx++) {
              for (let j = gHead[yy * gCols + xx]; j >= 0; j = gNext[j]) {
                if (j === idx) continue;
                const o = FISH[j];
                if (o.leap) continue;
                const dx = (o.x - f.x) * is, dy = (o.y - f.y) * isz;
                const d2 = dx * dx + dy * dy;
                if (d2 > R2) continue;
                if (d2 < sep * sep) {
                  const d = Math.sqrt(d2) + 1e-3, k = (sep - d) / (sep * d);
                  sx -= dx * k; sy -= dy * k;
                }
                if (o.sc === f.sc) {
                  n++; avx += o.vx; avy += o.vy; cx += dx; cy += dy;
                  if (n >= cap) break outer;
                }
              }
            }
          }
          const coh = f.panic > 0 ? 0.15 : 1, bw = 1 - 0.75 * f.ball;
          if (n > 0) {
            avx /= n; avy /= n; cx /= n; cy /= n;
            ax += (avx - f.vx) * K.wA * 1.3 * bw;
            ay += (avy - f.vy) * K.wA * 1.3 * bw;
            ax += cx * K.wC * 1.5 * coh * bw;
            ay += cy * K.wC * 1.5 * coh * bw;
          }
          ax += sx * K.wS * 55; ay += sy * K.wS * 55;
          // 鱼群的去处；新生的鱼先绕着生处游一圈
          const S = f.sc >= 0 ? SCH[f.sc] : null;
          if (S) {
            if (S.orbit) {
              const ox = (f.x - S.orbit.x) * is, oy = (f.y - S.orbit.y) * isz;
              const r = Math.hypot(ox, oy) + 1e-3, rr = 18 + 34 * f.orb;
              const tvx = (-oy / r) * 26 - (ox / r) * (r - rr) * 0.8, tvy = (ox / r) * 26 - (oy / r) * (r - rr) * 0.8;
              ax += (tvx - f.vx) * 1.6; ay += (tvy - f.vy) * 1.6;
            } else {
              const dx = (S.tx - f.x) * is, dy = (S.ty - f.y) * isz;
              const d = Math.hypot(dx, dy) + 1e-3, k = d > 140 ? 16 : 8;
              ax += (dx / d) * k * bw; ay += (dy / d) * k * bw;
            }
          }
        }
        // 漫游
        const wa = U.noise1(t * 0.23 + f.seed * 97) * Math.PI * 2;
        ax += Math.cos(wa) * K.wander; ay += Math.sin(wa) * K.wander;
        // 灵
        if (SPC.over) {
          const dxs = f.x - SPC.bx, dys = f.y - SPC.by, ds = Math.hypot(dxs, dys);
          if (SPC.fast && ds < SPC.R * 1.35) {
            if (f.panic <= 0.3) {
              const ex = dxs * is, ey = dys * isz, e = Math.hypot(ex, ey) + 1e-3;
              f.vx += (ex / e) * 70; f.vy += (ey / e) * 70;
              if (Math.random() < 0.6) f.flick = 1;
            }
            f.panic = 1.5; f.ball = 0;
          }
          const want = SPC.slow && f.panic <= 0 && ds < (f.ball > 0.2 ? SPC.R * 1.5 : SPC.R) ? 1 : 0;
          f.ball = U.approach(f.ball, want, want ? 1.4 : 0.9, dts);
        } else f.ball = U.approach(f.ball, 0, 0.9, dts);
        if (f.ball > 0.01) {
          // 鱼球：在灵的下方缓缓转动
          const ox = (f.x - SPC.bx) * is, oy = (f.y - SPC.by) * isz;
          const r = Math.hypot(ox, oy) + 1e-3, rr = 4 + 26 * f.orb * f.orb;
          const tsp = f.k === 2 ? 10 : 15;
          const tvx = (-oy / r) * tsp - (ox / r) * (r - rr) * 1.2, tvy = (ox / r) * tsp - (oy / r) * (r - rr) * 1.2;
          ax += (tvx - f.vx) * 2.6 * f.ball; ay += (tvy - f.vy) * 2.6 * f.ball;
          vmin *= 1 - 0.6 * f.ball;
        }
      }
      f.ax = ax; f.ay = ay; f.vmin0 = vmin;
      }
      // 岸：前方探路，遇地则转
      const hd0 = Math.atan2(f.vy, f.vx);
      const la = (f.k === 2 ? 30 : 12) + Math.hypot(f.vx, f.vy) * 0.6;
      const px = f.x + Math.cos(hd0) * la * f.s, py = f.y + Math.sin(hd0) * la * f.s * f.fz;
      if (!seaAt(px, py) || f.D < 0.1) {
        const aL = hd0 - 0.8, aR = hd0 + 0.8;
        const okL = seaAt(f.x + Math.cos(aL) * la * f.s, f.y + Math.sin(aL) * la * f.s * f.fz);
        const okR = seaAt(f.x + Math.cos(aR) * la * f.s, f.y + Math.sin(aR) * la * f.s * f.fz);
        const turn = okL && !okR ? -1 : okR && !okL ? 1 : (f.seed < 0.5 ? -1 : 1);
        const pa = hd0 + turn * Math.PI / 2;
        ax += Math.cos(pa) * 90; ay += Math.sin(pa) * 90;
        if (!okL && !okR) { ax -= Math.cos(hd0) * 60; ay -= Math.sin(hd0) * 60; }
      }
      if (f.D < 0.12) ay += 40;
      // 积分
      f.vx += ax * dt; f.vy += ay * dt;
      let v = Math.hypot(f.vx, f.vy);
      if (v > vmax) { f.vx *= vmax / v; f.vy *= vmax / v; v = vmax; }
      else if (v < vmin && v > 1e-4) { f.vx *= vmin / v; f.vy *= vmin / v; v = vmin; }
      else if (v <= 1e-4 && vmin > 0) { f.vx = Math.cos(f.hd) * vmin; f.vy = Math.sin(f.hd) * vmin; v = vmin; }
      const nx = f.x + f.vx * f.s * dt, ny = f.y + f.vy * f.s * f.fz * dt;
      if (seaAt(nx, ny)) { f.x = nx; f.y = ny; }
      else if (!seaAt(f.x, f.y)) {
        // 不慎落在岸上（地升起、视口改变）：向最近的水游去
        const p = nearestSea(f.x, f.y, 0);
        if (p) { f.x = lerp(f.x, p[0], Math.min(1, dt * 3)); f.y = lerp(f.y, p[1], Math.min(1, dt * 3)); }
      } else { f.vx *= -0.5; f.vy *= -0.5; }
      // 朝向：平滑地转；急转时侧腹闪银光
      const th = v > 0.5 ? Math.atan2(f.vy, f.vx) : f.hd;
      const dA = angDiff(f.hd, th), maxT = (f.k === 2 ? 1.2 : 5.5) * dt;
      const turnA = clamp(dA, -maxT, maxT);
      f.hd += turnA;
      f.av = turnA / Math.max(dt, 1e-3);
      if (f.k !== 2 && ((Math.abs(f.av) > 3.2 && Math.random() < dt * 3) || Math.random() < dt * 0.07)) f.flick = Math.max(f.flick, 0.9);
      f.ph += dt * TAU * K.beat * (0.6 + v / K.vmax * (lis ? 0.3 : 1)) * (f.panic > 0 ? 1.8 : 1);
      // 深浅：黄昏浮上水面
      const subT = SPC.listen ? Math.min(f.subB, 0.35) : W.dusk > 0.28 ? 0.06 + f.subB * 0.14 : f.ball > 0.3 ? 0.2 + f.subB * 0.3 : f.subB;
      f.sub = U.approach(f.sub, subT, 0.5, dt);
    }

    // 跃出水面：不时有一条鱼跃起
    leapT -= dt;
    if (leapT <= 0) {
      leapT = rnd(2.2, 6.5) / (0.35 + 0.65 * sunK) / Math.min(1.6, 0.5 + N / 80);
      if (!SPC.listen && W.lv.light > 0.5) {
        for (let k = 0; k < 6; k++) {
          const f = FISH[(Math.random() * N) | 0];
          if (!f || f.k === 2 || f.leap || f.a < 1 || f.D < 0.3 || f.ball > 0.3) continue;
          startLeap(f); break;
        }
      }
    }
    // 黄昏：鱼浮起，在水面点出圆涟漪；夜里（有了生命之光）涟漪泛着荧光
    const bio = W.lv.life * sstep(0.4, 0.85, W.night);
    const rate = (W.dusk * 3.2 + bio * 0.9) * Math.min(1, N / 50);
    dimpleAcc += rate * dt;
    while (dimpleAcc >= 1) {
      dimpleAcc -= 1;
      const f = FISH[(Math.random() * N) | 0];
      if (!f || f.leap || f.a < 1 || f.sub > 0.45 || f.D < 0.18) continue;
      const hx = f.x + Math.cos(f.hd) * f.len * 0.45 * f.s, hy = f.y + Math.sin(f.hd) * f.len * 0.45 * f.s * f.fz;
      addRipple(hx, hy, 1.2, f.k === 1 ? 13 : 9, rnd(1.1, 1.7), W.dusk > bio ? 0 : 1, f.band, 0.9);
    }
  }

  function newWaypoint(S) {
    const d = SCH_D[S.i] || [0.25, 0.9];
    const p = randSea(d[0], d[1], S.basin || BAS.big, 10) || randSea(0.15, 0.95, S.basin || BAS.big, 0) || null;
    if (p) { S.tx = p[0]; S.ty = p[1]; }
    S.wt = rnd(9, 18);
  }

  // ── 跃出水面 ────────────────────────────────────────────────
  function startLeap(f) {
    const big = f.k === 1;
    f.leap = { t: 0, dur: rnd(0.5, 0.75) * (big ? 1.25 : 1), H: rnd(10, 18) * (big ? 1.5 : 1), x0: f.x, y0: f.y, dir: Math.cos(f.hd) >= 0 ? 1 : -1, out: false };
    const v = Math.hypot(f.vx, f.vy) + 1e-3, vt = FK[f.k].vmax * 1.2;
    f.vx *= vt / v; f.vy *= vt / v;
    splash(f.x, f.y, big ? 0.45 : 0.3, f.band, big ? 7 : 5);
  }
  function updateLeap(f, dt) {
    const L = f.leap;
    L.t += dt / L.dur;
    f.x += f.vx * f.s * dt; f.y += f.vy * f.s * f.fz * dt;
    if (!seaAt(f.x, f.y)) { f.x -= f.vx * f.s * dt; f.y -= f.vy * f.s * f.fz * dt; }
    if (L.t >= 1) {
      splash(f.x, f.y, f.k === 1 ? 0.5 : 0.35, f.band, f.k === 1 ? 9 : 6);
      f.leap = null; f.sub = 0.15; f.flick = 1;
    }
  }

  // ════════════════════════════════════════════════════════════
  //  涟漪 · 水花 · 喷气
  // ════════════════════════════════════════════════════════════
  // kind：0 光的涟漪 · 1 荧光 · 2 泡沫（填充） · 3 鲸歌（极淡的光环）
  const RIP = [];
  function addRipple(x, y, r0, r1, dur, kind, band, a, delay) {
    if (RIP.length > 90) RIP.shift();
    RIP.push({ x, y, r0, r1, dur, kind, band, a: a == null ? 1 : a, t: -(delay || 0), s: scaleAt(y), fz: fzOf(depthAt(y)) });
  }
  function splash(x, y, size, band, drops) {
    const s = scaleAt(y);
    addRipple(x, y, 1.5 * size, 10 + 14 * size, 1.1 + size * 0.5, 0, band, 0.85);
    if (size > 0.4) addRipple(x, y, 1, 6 + 9 * size, 0.9 + size * 0.4, 0, band, 0.6, 0.25);
    if (size > 1) {
      addRipple(x, y, 4, 18 + 22 * size, 2.2 + size * 0.4, 0, band, 0.7, 0.5);
      addRipple(x, y, 0.3 * size * 22, 0.55 * size * 24, 3.6, 2, band, 0.55);
    }
    const n = Math.round((drops || 6) * (W.quality || 1));
    if (fxOK() && n > 0) {
      const lit = W.shade(FOAM, 0.1, 0.25);
      const ps = Math.max(0.6, s * 1.25);
      for (let i = 0; i < n; i++) {
        const a = rnd(-1, 1);
        const big = size > 1;
        GS.fx.add({ x: x + a * (big ? 14 : 3) * s * size, y: y - (big ? rnd(0, 6) * s : 0), vx: a * rnd(20, 70) * s * Math.sqrt(size), vy: -rnd(50, big ? 200 : 150) * s * Math.sqrt(size + 0.2),
          grav: 420 * s, drag: 0.4, max: rnd(0.45, 0.95) * (0.8 + size * 0.2), size: rnd(big ? 0.35 : 0.5, big ? 0.95 : 1.2) * ps,
          c: lit, a: big ? 0.6 : 0.8, pass: BANDS[band] });
      }
    }
    emit('splash', { x, y, size });
  }
  // 喷气的白雾（离屏预绘的柔光团，拉伸成雾柱）
  let PUFF = null;
  function makePuff() {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,0.9)');
      gr.addColorStop(0.45, 'rgba(255,255,255,0.45)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      PUFF = c;
    } catch (e) { PUFF = null; }
  }
  const PLUME = [];
  function spout(x, y, s, band, k) {
    k = k || 1;
    PLUME.push({ x, y, s, band, t: 0, dur: 2.6 * (0.7 + 0.3 * k), H: 58 * k, Wd: 16 * k, dx: rnd(-0.5, 0.5) });
    if (PLUME.length > 8) PLUME.shift();
    const n = Math.round(26 * k * (W.quality || 1));
    if (fxOK()) {
      const lit = W.shade(MIST, 0.15, 0.3);
      const ps = Math.max(0.7, s * 1.5);
      for (let i = 0; i < n; i++) {
        GS.fx.add({ x: x + rnd(-2, 2) * s, y: y - rnd(0, 4) * s, vx: rnd(-16, 16) * s + (W.wind || 0) * 18 * s, vy: -rnd(70, 165) * s * k,
          grav: 38 * s, drag: 1.4, max: rnd(1.1, 2.3), size: rnd(0.4, 0.9) * ps, c: lit, a: 0.2, pass: BANDS[band] });
      }
    }
  }
  function updateFx(dt) {
    for (let i = RIP.length - 1; i >= 0; i--) { const r = RIP[i]; r.t += dt; if (r.t >= r.dur) RIP.splice(i, 1); }
    for (let i = PLUME.length - 1; i >= 0; i--) { const p = PLUME[i]; p.t += dt; if (p.t >= p.dur) PLUME.splice(i, 1); }
  }

  // ════════════════════════════════════════════════════════════
  //  大鱼（鲸）
  // ════════════════════════════════════════════════════════════
  //   role 0 母鲸（海湾）· 1 远鲸（地平线附近的远海）· 2 幼鲸（随母）
  const WHALES = [];
  const WLEN = [200, 215, 90];
  function habitatD(role) { return role === 1 ? [0.03, 0.17] : [0.2, 0.6]; }
  function makeWhale(role, x, y, instant) {
    const hd = Math.random() < 0.5 ? rnd(-0.35, 0.35) : Math.PI + rnd(-0.35, 0.35);
    return {
      role, x, y, hd, v: 10, L: WLEN[role] * rnd(0.94, 1.06),
      st: 'under', T: 0, dur: instant ? rnd(3, 16) : 2, a: instant ? 1 : 0, born: instant ? -99 : W.t,
      surf: 0, rollT: 0, roll: 0, rollN: 0, arch: 0, fluke: 0, hover: 0, stuck: 0, lastD: 1e9,
      tx: x, ty: y, wt: 0, nextBreach: W.t + rnd(60, 120) * (role === 1 ? 1.6 : 1),
      nextSong: W.t + rnd(12, 40), lastSpout: -99, spX: x, spY: y, basin: 0,
      bx: x, by: y, bdir: 1, bT: 0, sp1: false, sp2: false, fade: 1, relocate: 0, queue: [], vis: 1,
    };
  }
  function whaleScale(w) { return scaleAt(w.y); }
  function setSt(w, st, dur) {
    w.st = st; w.T = 0; w.dur = dur;
    if (st === 'surf') { w.rollT = 0; w.rollN = 0; }
    if (st === 'breach') {
      w.bx = w.x; w.by = w.y; w.bdir = Math.cos(w.hd) >= 0 ? 1 : -1; w.sp1 = false; w.sp2 = false;
      emit('whale', { type: 'breach', x: w.x, y: w.y });
    }
    // 母鲸的一举一动，幼鲸迟 0.6 秒跟着做
    if (w.role === 0) {
      const c = WHALES[2];
      if (c && (st === 'surf' || st === 'dive' || st === 'breach')) c.queue.push({ at: W.t + 0.6, st, dur });
    }
  }
  function whaleWaypoint(w) {
    const d = habitatD(w.role);
    const b = w.basin || BAS.big;
    const s = whaleScale(w);
    // 鲸多沿着横向游（剪影最美），偶尔换一换远近
    let p = null;
    for (let k = 0; k < 6 && !p; k++) {
      const q = randSea(d[0], d[1], b, w.L * 0.45, null, null);
      if (!q) break;
      const dx = (q[0] - w.x) / s, dy = (q[1] - w.y) / (s * fzOf(depthAt(w.y)));
      if (Math.abs(dy) < Math.abs(dx) * 0.7 + 40 || k === 5) p = q;
    }
    if (p) { w.tx = p[0]; w.ty = p[1]; }
    w.wt = rnd(20, 40);
  }
  function openForWhale(w) { return openAt(w.x, w.y, w.L * 0.42 * whaleScale(w)); }

  function updateWhales(dt) {
    const sp = W.spirit;
    for (let i = 0; i < WHALES.length; i++) {
      const w = WHALES[i];
      w.T += dt;
      if (w.a < 1) w.a = Math.min(1, w.a + dt / 1.6);
      const s = whaleScale(w), D = depthAt(w.y), fz = fzOf(D);
      w.basin = basinAt(w.x, w.y) || w.basin;
      // 幼鲸：执行母鲸的动作队列
      if (w.role === 2 && w.queue.length && W.t >= w.queue[0].at) {
        const q = w.queue.shift();
        if (w.st !== 'breach' && (q.st !== 'breach' || openForWhale(w))) setSt(w, q.st, q.dur * (q.st === 'breach' ? 0.85 : 1));
      }
      // ── 状态 ──
      const lis = SPC.listen;
      switch (w.st) {
        case 'under': {
          w.surf = U.approach(w.surf, 0, 2, dt);
          if (w.role !== 2 && w.T > w.dur && !lis && w.relocate <= 0) {
            if (W.t > w.nextBreach && openForWhale(w) && Math.abs(Math.sin(w.hd)) < 0.7 && W.lv.light > 0.5) { w.nextBreach = W.t + rnd(70, 130) * (w.role === 1 ? 1.7 : 1); setSt(w, 'breach', 3.4); }
            else if (openForWhale(w) && Math.abs(Math.sin(w.hd)) < 0.72) setSt(w, 'surf', rnd(8, 10.5));
            else w.dur = w.T + 2;
          }
          break;
        }
        case 'surf': {
          w.surf = U.approach(w.surf, w.T < w.dur - 0.8 ? 1 : 0, 2.2, dt);
          // 每 ~3 秒一次换气：头先出水（喷气），脊背随后滚过水面
          const period = 3.1;
          const k = Math.floor(w.T / period);
          w.roll = (w.T % period) / period;
          if (k !== w.rollN - 1 && w.roll > 0.06) {
            w.rollN = k + 1;
            const big = k === 0;
            const bxh = w.x + Math.cos(w.hd) * w.L * 0.3 * s, byh = w.y + Math.sin(w.hd) * w.L * 0.3 * s * fz;
            const kk = (w.role === 2 ? 0.5 : 1) * (big ? 1 : 0.6);
            spout(bxh, byh - 2 * s, s, bandOf(w.y), kk);
            w.lastSpout = W.t; w.spX = bxh; w.spY = byh;
            // 每次浮上水面的第一口气才出声（其后几口只是轻轻的雾）
            if (big) emit('whale', { type: 'spout', x: bxh, y: byh, big: w.role !== 2 });
          }
          if (w.T >= w.dur) setSt(w, 'dive', 3.6);
          break;
        }
        case 'dive': {
          w.surf = U.approach(w.surf, w.T < 2.4 ? 1 : 0, 2.5, dt);
          const p = w.T / w.dur;
          w.arch = Math.sin(Math.PI * c01(p / 0.6));
          w.fluke = Math.sin(Math.PI * c01((p - 0.32) / 0.68));
          if (p > 0.62 && !w.drip && fxOK()) {
            w.drip = true;
            const tx = w.x - Math.cos(w.hd) * w.L * 0.47 * s, ty = w.y - Math.sin(w.hd) * w.L * 0.47 * s * fz;
            const lit = W.shade(FOAM, 0.1, 0.2);
            for (let k = 0; k < 7; k++) { const q = rnd(-1, 1); GS.fx.add({ x: tx + q * w.L * 0.15 * s, y: ty - w.L * (0.17 - 0.03 * q * q) * s * w.fluke, vx: rnd(-4, 4) * s, vy: rnd(0, 15) * s, grav: 260 * s, drag: 0.3, max: rnd(0.4, 0.8), size: Math.max(0.5, s * 0.8), c: lit, a: 0.45, pass: BANDS[bandOf(w.y)] }); }
          }
          if (w.T >= w.dur) {
            w.arch = 0; w.fluke = 0; w.drip = false;
            addRipple(w.x - Math.cos(w.hd) * w.L * 0.45 * s, w.y - Math.sin(w.hd) * w.L * 0.45 * s * fz, 3, 26, 2.4, 0, bandOf(w.y), 0.6);
            setSt(w, 'under', rnd(17, 28));
          }
          break;
        }
        case 'breach': {
          const p = w.T / w.dur;
          w.surf = 0;
          if (!w.sp1 && p > 0.05) { w.sp1 = true; splash(w.bx, w.by, 1.6 * w.L / 200, bandOf(w.by), 60); }
          if (!w.sp2 && p > 0.8) {
            w.sp2 = true;
            const ex = w.bx + w.bdir * w.L * 0.3 * s;
            splash(ex, w.by, 2.4 * w.L / 200, bandOf(w.by), 110);
          }
          if (w.T >= w.dur) {
            w.x = w.bx + w.bdir * w.L * 0.3 * s;
            if (!seaAt(w.x, w.y)) w.x = w.bx;
            setSt(w, 'under', rnd(6, 10));
          }
          break;
        }
      }
      // ── 游动（跃出时位置由弧线决定）──
      if (w.st !== 'breach') {
        let tx, ty, vt;
        if (w.role === 2 && WHALES[0]) {
          // 幼鲸：在母鲸身侧稍后
          const m = WHALES[0], ms = whaleScale(m), mfz = fzOf(depthAt(m.y));
          const ca = Math.cos(m.hd), sa = Math.sin(m.hd);
          const la = -m.L * 0.34, lb = m.L * 0.3;
          tx = m.x + (la * ca - lb * sa) * ms; ty = m.y + (la * sa + lb * ca) * ms * mfz;
          if (!seaAt(tx, ty)) { tx = m.x - ca * m.L * 0.55 * ms; ty = m.y - sa * m.L * 0.55 * ms * mfz; }
          const dd = Math.hypot((tx - w.x) / s, (ty - w.y) / (s * fz));
          vt = clamp(dd * 0.35, 0, 26);
          if (dd < 20) { w.hd += clamp(angDiff(w.hd, m.hd), -0.5 * dt, 0.5 * dt); }
        } else {
          w.wt -= dt;
          const dd = Math.hypot((w.tx - w.x) / s, (w.ty - w.y) / (s * fz));
          if (w.wt <= 0 || dd < 40) whaleWaypoint(w);
          tx = w.tx; ty = w.ty;
          vt = w.st === 'dive' ? 7 : w.st === 'surf' ? 9 : 12;
          // 卡住：久无进展则另选去处；再不行就沉入深处，到开阔的水里再浮现
          if (dd < w.lastD - 0.5) { w.lastD = dd; w.stuck = 0; } else w.stuck += dt;
          if (w.stuck > 14) { w.stuck = 0; w.lastD = 1e9; whaleWaypoint(w); w.relocate += 1; }
        }
        if (lis) vt = 1.5;
        if (w.relocate >= 2 && w.st === 'under') {
          w.fade = Math.max(0, w.fade - dt / 2);
          if (w.fade <= 0) {
            const d = habitatD(w.role);
            const p = randSea(d[0], d[1], BAS.big, w.L * 0.45) || randSea(d[0], d[1], BAS.big, 0);
            if (p) { w.x = p[0]; w.y = p[1]; w.tx = p[0]; w.ty = p[1]; w.basin = basinAt(p[0], p[1]); }
            w.relocate = 0; w.stuck = 0; w.lastD = 1e9;
          }
        } else w.fade = Math.min(1, w.fade + dt / 2);
        // 转向
        const s2 = whaleScale(w), fz2 = fzOf(depthAt(w.y));
        let want = Math.atan2((ty - w.y) / (s2 * fz2), (tx - w.x) / s2);
        if (lis) want = Math.atan2((Math.max(sp.y, W.horizonY) - w.y) / (s2 * fz2), (sp.x - w.x) / s2);
        // 前方探路
        const ahead = w.L * 0.75;
        const px = w.x + Math.cos(w.hd) * ahead * s2, py = w.y + Math.sin(w.hd) * ahead * s2 * fz2;
        let turnRate = w.st === 'surf' ? 0.12 : 0.28;
        if (!seaAt(px, py) && w.relocate < 2) {
          const l = seaAt(w.x + Math.cos(w.hd - 0.9) * ahead * s2, w.y + Math.sin(w.hd - 0.9) * ahead * s2 * fz2);
          want = w.hd + (l ? -1.2 : 1.2);
          turnRate = 0.6;
        }
        w.hd += clamp(angDiff(w.hd, want), -turnRate * dt, turnRate * dt);
        w.v = U.approach(w.v, vt, 0.6, dt);
        const nx = w.x + Math.cos(w.hd) * w.v * s2 * dt, ny = w.y + Math.sin(w.hd) * w.v * s2 * fz2 * dt;
        if (seaAt(nx, ny) || w.relocate >= 2 || !seaAt(w.x, w.y)) {
          w.x = clamp(nx, 2, W.w - 2);
          w.y = clamp(ny, W.horizonY + 2, W.h - 2);
        } else w.v *= 0.5;
      }
      // ── 灵在鲸上方静悬两秒 → 跃出 ──
      const rS = Math.max(26, w.L * 0.42 * s);
      const dsp = Math.hypot(sp.x - w.x, (sp.y + W.h * 0.018) - w.y);
      if (!lis && sp.speed < 70 && dsp < rS && w.st !== 'breach' && w.role !== 2 && w.a >= 1) {
        w.hover += dt;
        if (w.hover >= 2 && seaAt(w.x, w.y) && w.fade > 0.9) { w.hover = -4; w.nextBreach = W.t + rnd(60, 110); setSt(w, 'breach', 3.4); }
      } else if (w.hover > 0) w.hover = Math.max(0, w.hover - dt * 2);
      else if (w.hover < 0) w.hover = Math.min(0, w.hover + dt);
      // ── 夜里的鲸歌 ──
      if (w.role !== 2 && W.night > 0.55 && W.t > w.nextSong) {
        w.nextSong = W.t + rnd(38, 75);
        emit('whale', { type: 'song', x: w.x, y: w.y });
        addRipple(w.x, w.y, w.L * 0.2, w.L * 1.1, 6, 3, bandOf(w.y), 1);
        addRipple(w.x, w.y, w.L * 0.1, w.L * 0.8, 5, 3, bandOf(w.y), 0.7, 1.4);
      } else if (W.night < 0.3 && W.t > w.nextSong) w.nextSong = W.t + rnd(10, 30);
      // 在海里时可见；（深潜转移时）不在海里便隐去
      w.vis = U.approach(w.vis, seaAt(w.x, w.y) ? 1 : 0, 3, dt);
    }
  }

  // ════════════════════════════════════════════════════════════
  //  数量的同步与出现
  // ════════════════════════════════════════════════════════════
  let fishAcc = 0, whaleNext = 0;
  function spawnPoint(kind, spread) {
    const p = W.pop[kind];
    if (!p) return null;
    const px = isFinite(p.x) ? p.x : W.w * 0.2, py = isFinite(p.y) ? p.y : W.h * 0.8;
    const s = scaleAt(py), fz = fzOf(depthAt(py));
    for (let k = 0; k < 10; k++) {
      const a = rnd(0, TAU), r = Math.sqrt(Math.random()) * spread;
      const x = px + Math.cos(a) * r * s, y = py + Math.sin(a) * r * s * fz;
      if (seaAt(x, y) && depthAt(y) > 0.08) return [x, y];
    }
    return nearestSea(px, Math.max(py, W.horizonY + (W.h - W.horizonY) * 0.12), 0);
  }
  function scatterFish(i) {
    const sl = fishSlot(i);
    const d = sl[1] >= 0 ? SCH_D[sl[1]] : [0.3, 0.9];
    // 同一群的鱼聚在一处
    const S = sl[1] >= 0 ? school(sl[1]) : null;
    if (S && S.n > 0 && S.home) {
      for (let k = 0; k < 8; k++) {
        const s = scaleAt(S.home[1]);
        const x = S.home[0] + rnd(-1, 1) * 45 * s, y = S.home[1] + rnd(-1, 1) * 45 * s * fzOf(depthAt(S.home[1]));
        if (seaAt(x, y) && depthAt(y) > 0.1) return [x, y];
      }
    }
    const p = randSea(d[0], d[1], BAS.big, 8) || randSea(0.15, 0.95, 0, 0) || [W.w * 0.15, W.h * 0.85];
    if (S) { S.home = p; S.n = Math.max(S.n, 1); }
    return p;
  }
  function syncPop(dt) {
    // 鱼
    const nF = Math.max(0, W.popN('fish') | 0);
    const pf = W.pop.fish;
    if (FISH.length > nF) FISH.length = nF;
    if (FISH.length < nF) {
      if (pf && pf.instant) {
        for (const S of SCH) if (S) { S.home = null; S.n = 0; }
        while (FISH.length < nF) { const i = FISH.length; const p = scatterFish(i); FISH.push(makeFish(i, p[0], p[1], true)); }
        for (const S of SCH) if (S) { S.home = null; newWaypoint(S); }
      } else {
        fishAcc += dt * 26;
        let made = 0;
        while (fishAcc >= 1 && FISH.length < nF) {
          fishAcc -= 1;
          const i = FISH.length;
          const p = spawnPoint('fish', 36);
          if (!p) break;
          const f = makeFish(i, p[0], p[1], false);
          FISH.push(f);
          made++;
          if (f.sc >= 0) {
            const S = school(f.sc);
            if (!S.n) { S.tx = p[0]; S.ty = p[1]; S.wt = rnd(9, 14); }
            S.orbit = { x: pf ? pf.x : p[0], y: pf ? pf.y : p[1], until: W.t + 5 };
            if (!seaAt(S.orbit.x, S.orbit.y)) { S.orbit.x = p[0]; S.orbit.y = p[1]; }
          }
          if (fxOK()) GS.fx.sparkle(p[0], p[1], 3, SILVER, 5 * scaleAt(p[1]) + 2, BANDS[bandOf(p[1])]);
        }
        if (FISH.length >= nF) fishAcc = 0;
      }
    }
    // 鲸
    const nW = Math.min(3, Math.max(0, W.popN('whale') | 0));
    const pw = W.pop.whale;
    if (WHALES.length > nW) WHALES.length = nW;
    if (WHALES.length < nW) {
      if (pw && pw.instant) {
        while (WHALES.length < nW) {
          const r = WHALES.length;
          let p;
          if (r === 2 && WHALES[0]) p = nearestSea(WHALES[0].x - 30, WHALES[0].y + 6, 0) || [WHALES[0].x, WHALES[0].y];
          else { const d = habitatD(r); p = randSea(d[0], d[1], BAS.big, WLEN[r] * 0.45) || randSea(d[0], d[1], 0, 0) || [W.w * 0.2, W.h * 0.75]; }
          const w = makeWhale(r, p[0], p[1], true);
          WHALES.push(w);
          whaleWaypoint(w);
        }
      } else if (W.t >= whaleNext) {
        const r = WHALES.length;
        whaleNext = W.t + 2.6;
        let p = null, w;
        if (r === 0) {
          // 第一条大鱼自灵下方的海中跃出
          p = spawnPoint('whale', 10) || [W.w * 0.2, W.h * 0.75];
          w = makeWhale(0, p[0], p[1], false);
          w.a = 0.35;
          WHALES.push(w);
          whaleWaypoint(w);
          if (openAt(p[0], p[1], w.L * 0.25 * scaleAt(p[1]))) setSt(w, 'breach', 3.4);
          else setSt(w, 'surf', 7);
          w.nextBreach = W.t + rnd(70, 120);
        } else if (r === 1) {
          // 远处地平线上另有一头，只喷水
          const d = habitatD(1);
          p = randSea(d[0], d[1], BAS.big, WLEN[1] * 0.45) || randSea(d[0], d[1], 0, 0) || [W.w * 0.3, W.horizonY + 8];
          w = makeWhale(1, p[0], p[1], false);
          WHALES.push(w);
          whaleWaypoint(w);
          setSt(w, 'under', 1.2);
        } else {
          // 幼鲸：在母鲸身旁出现；母鲸再次跃出
          const m = WHALES[0];
          p = m ? (nearestSea(m.x - 30 * scaleAt(m.y), m.y + 4, 0) || [m.x, m.y]) : spawnPoint('whale', 20) || [W.w * 0.2, W.h * 0.75];
          w = makeWhale(2, p[0], p[1], false);
          if (m) w.hd = m.hd;
          WHALES.push(w);
          if (m && m.st !== 'breach' && openForWhale(m)) setSt(m, 'breach', 3.4);
          else setSt(w, 'surf', 6);
        }
        if (fxOK() && p) GS.fx.sparkle(p[0], p[1], 26, [170, 240, 255], 16 * scaleAt(p[1]) + 6, BANDS[bandOf(p[1])]);
      }
    }
  }

  // ════════════════════════════════════════════════════════════
  //  绘制
  // ════════════════════════════════════════════════════════════
  // 纺锤形鱼身（a：头 +0.5 → 尾 −0.5；b：半宽的比例）
  const FT = [[0.5, 0], [0.3, 0.82], [0.02, 0.92], [-0.32, 0.32], [-0.57, 0.95], [-0.48, 0],
    [-0.57, -0.95], [-0.32, -0.32], [0.02, -0.92], [0.3, -0.82]];
  const FT_S = [[0.5, 0], [0.12, 0.9], [-0.42, 0.25], [-0.56, 0.8], [-0.5, 0], [-0.56, -0.8], [-0.42, -0.25], [0.12, -0.9]];
  // 蝠鲼（俯看的菱形，翼尖随扇动）
  const RT = [[0.5, 0.1], [0.44, 0.17], [0.28, 0.32], [0.04, 0.5], [-0.14, 0.36], [-0.3, 0.14], [-0.38, 0.04],
    [-0.38, -0.04], [-0.3, -0.14], [-0.14, -0.36], [0.04, -0.5], [0.28, -0.32], [0.44, -0.17], [0.5, -0.1], [0.45, 0]];

  function fishPath(ctx, f, T, flat) {
    const s = f.s, c = Math.cos(f.hd), sn = Math.sin(f.hd), fz = flat ? f.fz : 1;
    const len = f.len, hw = f.wid * 0.5;
    const amp = len * (0.07 + 0.05 * c01(Math.abs(f.av) / 3));
    for (let k = 0; k < T.length; k++) {
      const a = T[k][0], tl = 0.5 - a;
      const off = amp * Math.sin(f.ph - a * 5) * tl * tl * 1.6;
      const la = a * len, lb = T[k][1] * hw + off;
      const X = f.x + s * (la * c - lb * sn), Y = f.y + s * fz * (la * sn + lb * c);
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.closePath();
  }
  function rayPath(ctx, f) {
    const s = f.s, c = Math.cos(f.hd), sn = Math.sin(f.hd), fz = f.fz;
    const flap = Math.sin(f.ph), len = f.len, hw = f.wid * 0.5;
    for (let k = 0; k < RT.length; k++) {
      const b0 = RT[k][1], tipK = Math.abs(b0) / 0.5;
      const a = RT[k][0] - 0.07 * flap * tipK * tipK;
      const b = b0 * (0.88 + 0.12 * Math.cos(f.ph)) ;
      const la = a * len, lb = b * hw * 2 * 0.5;
      const X = f.x + s * (la * c - lb * sn), Y = f.y + s * fz * (la * sn + lb * c);
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.closePath();
    // 细长的尾
    const tw = Math.sin(f.ph * 0.7) * 0.06;
    const a0 = -0.38 * len, a1 = -1.1 * len;
    ctx.moveTo(f.x + s * (a0 * c), f.y + s * fz * (a0 * sn));
    const bx = tw * len;
    ctx.lineTo(f.x + s * (a1 * c - bx * sn), f.y + s * fz * (a1 * sn + bx * c));
    ctx.lineTo(f.x + s * ((a0 - 1) * c + 0.4 * sn), f.y + s * fz * ((a0 - 1) * sn - 0.4 * c));
    ctx.closePath();
  }

  const BK = new Uint8Array(512), BI = new Uint16Array(512);
  const FC = { frame: -1, band: [[], [], []], ray: ['', '', ''], silver: '', lit: [0, 0, 0], light: 0 };
  const ALV = [0.18, 0.32, 0.48, 0.66];
  function frameColors() {
    if (FC.frame === W.frame) return FC;
    FC.frame = W.frame;
    const hzD = [0.6, 0.38, 0.12];
    for (let b = 0; b < 3; b++) {
      const arr = FC.band[b];
      for (let k = 0; k < 2; k++) {
        const c = W.shade(FISH_DARK[k], hzD[b] * 0.6);
        for (let l = 0; l < ALV.length; l++) arr[k * 4 + l] = css(c, ALV[l]);
      }
      FC.ray[b] = W.shadeCSS(RAY, hzD[b] * 0.5, 0.5);
    }
    FC.lit = W.shade(SILVER, 0, 0.35);
    FC.light = c01(W.daylight * 1.1);
    FC.whale = W.shade(WHALE, 0);
    FC.belly = W.shade(BELLY, 0, 0.1);
    const df = W.dayFactor, dusk = W.dusk;
    let rim = U.mixRGB([168, 190, 240], [255, 244, 222], df);
    rim = U.mixRGB(rim, [255, 178, 110], dusk * 0.8);
    FC.rim = rim;
    FC.rimA = (0.18 + 0.5 * W.daylight) * (W.lv.light);
    FC.bio = W.lv.life * sstep(0.4, 0.85, W.night);
    FC.spirit = sstep(0.45, 0.9, W.night) * W.lv.light;
    return FC;
  }

  const P1 = [], P2 = [];
  function drawFish(ctx, band, C) {
    const N = FISH.length;
    if (!N) return;
    const q = W.quality || 1;
    // 1) 夜里的荧光尾迹
    if (C.bio > 0.02) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        let any = false;
        const m = pass === 0 ? 6 : 3;
        for (let i = 0; i < N; i++) {
          const f = FISH[i];
          if (f.band !== band || f.trN < 2 || f.leap || f.a < 0.3) continue;
          if (q < 0.75 && (i & 1)) continue;
          ctx.moveTo(f.x, f.y);
          for (let k = 0; k < Math.min(m, f.trN); k++) {
            const h = ((f.trH - k) % 6 + 6) % 6;
            ctx.lineTo(f.tr[h * 2], f.tr[h * 2 + 1]);
          }
          any = true;
        }
        if (any) {
          ctx.strokeStyle = css(BIO, C.bio * (pass === 0 ? 0.1 : 0.2));
          ctx.lineWidth = Math.max(0.7, W.unit * SB * (pass === 0 ? 0.9 : 1.3));
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // 2) 鱼身：按类 × 透明度分桶，各合成一条路径
    const cols = C.band[band];
    let nb = 0;
    for (let i = 0; i < N; i++) {
      const f = FISH[i];
      if (f.band !== band || f.k === 2 || f.leap) continue;
      const e = (0.74 - 0.46 * f.sub) * f.a * sstep(0.06, 0.3, f.D);
      if (e < 0.06) continue;
      BK[nb] = f.k * 4 + (e < 0.2 ? 0 : e < 0.33 ? 1 : e < 0.48 ? 2 : 3);
      BI[nb++] = i;
    }
    for (let key = 0; key < 8; key++) {
      let any = false;
      for (let j = 0; j < nb; j++) {
        if (BK[j] !== key) continue;
        if (!any) { ctx.beginPath(); any = true; }
        const f = FISH[BI[j]];
        fishPath(ctx, f, f.s * f.len < 5 || q < 0.75 ? FT_S : FT, true);
      }
      if (any) { ctx.fillStyle = cols[key]; ctx.fill(); }
    }
    // 蝠鲼
    for (let i = 0; i < N; i++) {
      const f = FISH[i];
      if (f.band !== band || f.k !== 2) continue;
      const e = (0.7 - 0.4 * f.sub) * f.a * sstep(0.06, 0.3, f.D);
      if (e < 0.04) continue;
      ctx.globalAlpha = e;
      ctx.beginPath(); rayPath(ctx, f);
      ctx.fillStyle = C.ray[band]; ctx.fill();
      ctx.globalAlpha = 1;
    }
    // 3) 银光一闪（转身时侧腹映光）；夜里靠近灵的鱼映着灵的光
    const light = C.light;
    if (light > 0.05 || C.spirit > 0.05) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      const sp = W.spirit, Rg = 170 * Math.max(0.6, W.unit);
      for (let lvl = 0; lvl < 2; lvl++) {
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < N; i++) {
          const f = FISH[i];
          if (f.band !== band || f.k === 2 || f.leap) continue;
          let fl = f.flick * light;
          if (C.spirit > 0.05) {
            const d = Math.abs(f.x - sp.x) + Math.abs(f.y - sp.y);
            if (d < Rg) fl = Math.max(fl, (1 - d / Rg) * C.spirit * 0.8);
          }
          if (fl < 0.12) continue;
          if ((fl > 0.55 ? 1 : 0) !== lvl) continue;
          const s = f.s, c = Math.cos(f.hd), sn = Math.sin(f.hd), side = f.av > 0 ? 1 : -1, hw = f.wid * 0.3 * side;
          ctx.moveTo(f.x + s * (0.3 * f.len * c - hw * sn), f.y + s * f.fz * (0.3 * f.len * sn + hw * c));
          ctx.lineTo(f.x + s * (-0.14 * f.len * c - hw * sn), f.y + s * f.fz * (-0.14 * f.len * sn + hw * c));
          any = true;
        }
        if (any) {
          const L = C.lit;
          const nightMix = C.spirit;
          const col = U.mixRGB(L, SPIRIT_C, nightMix * 0.7);
          ctx.strokeStyle = css(col, lvl ? 0.55 : 0.28);
          ctx.lineWidth = Math.max(0.7, W.unit * SB * 0.9);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  // 跃出水面的鱼：侧影在画面平面里，沿抛物线翻转
  function drawLeaps(ctx, band, C) {
    const lit = W.shade(U.mixRGB(FISH_DARK[0], SILVER, 0.55), 0, 0.2);
    for (let i = 0; i < FISH.length; i++) {
      const f = FISH[i];
      if (!f.leap || f.band !== band) continue;
      const L = f.leap, t = c01(L.t), s = f.s;
      const hgt = L.H * s * 4 * t * (1 - t);
      const vxs = f.vx * s, vys = f.vy * s * f.fz - L.H * s * 4 * (1 - 2 * t) / L.dur;
      const ang = Math.atan2(vys, vxs);
      const c = Math.cos(ang), sn = Math.sin(ang), len = f.len * s * 1.05, hw = f.wid * 0.62 * s;
      const cx = f.x, cy = f.y - hgt;
      ctx.beginPath();
      for (let k = 0; k < FT.length; k++) {
        const a = FT[k][0] * len, b = FT[k][1] * hw;
        const X = cx + a * c - b * sn, Y = cy + a * sn + b * c;
        if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.closePath();
      ctx.fillStyle = css(lit, 0.92);
      ctx.fill();
      // 背上一道暗线
      ctx.beginPath();
      ctx.moveTo(cx + 0.4 * len * c + hw * 0.5 * sn, cy + 0.4 * len * sn - hw * 0.5 * c);
      ctx.lineTo(cx - 0.3 * len * c + hw * 0.3 * sn, cy - 0.3 * len * sn - hw * 0.3 * c);
      ctx.strokeStyle = W.shadeCSS(FISH_DARK[0], 0.1, 0.8);
      ctx.lineWidth = Math.max(0.7, hw * 0.7);
      ctx.stroke();
    }
  }

  // ── 鲸的轮廓 ──
  // 俯看（a：头 +0.5 → 尾 −0.5；b：半宽，以身长计）
  const WB = [[0.5, 0], [0.47, 0.05], [0.4, 0.085], [0.28, 0.1], [0.12, 0.105], [-0.05, 0.094], [-0.2, 0.068], [-0.32, 0.04], [-0.41, 0.02],
    [-0.45, 0.05], [-0.5, 0.13], [-0.55, 0.17], [-0.56, 0.14], [-0.52, 0.05], [-0.53, 0]];
  // 侧看的脊线（高出水面的高度，以身长计）
  const TOP = [[0.5, 0.0], [0.46, 0.03], [0.38, 0.055], [0.26, 0.072], [0.12, 0.08], [-0.02, 0.078], [-0.12, 0.072], [-0.16, 0.085], [-0.2, 0.094], [-0.23, 0.066], [-0.32, 0.046], [-0.42, 0.024], [-0.47, 0.01]];
  // 侧影（跃出时）：上缘与下缘
  const SIDE_T = [[0.5, 0.005], [0.47, 0.045], [0.38, 0.08], [0.24, 0.1], [0.08, 0.105], [-0.08, 0.09], [-0.15, 0.1], [-0.19, 0.12], [-0.22, 0.078], [-0.33, 0.045], [-0.43, 0.02]];
  const SIDE_B = [[-0.43, -0.02], [-0.33, -0.042], [-0.2, -0.075], [-0.02, -0.11], [0.16, -0.115], [0.32, -0.09], [0.44, -0.045], [0.5, -0.01]];

  function whaleTopPath(ctx, w, s, fz, scaleK, noFins) {
    const c = Math.cos(w.hd), sn = Math.sin(w.hd), L = w.L * scaleK;
    const n = WB.length;
    const flk = 1 + 0.08 * Math.sin(W.t * 1.4 + w.L);
    for (let k = 0; k < n; k++) {
      const a = WB[k][0] * L, b = WB[k][1] * L * (k > 8 ? flk : 1);
      const X = w.x + s * (a * c - b * sn), Y = w.y + s * fz * (a * sn + b * c);
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    for (let k = n - 2; k >= 1; k--) {
      const a = WB[k][0] * L, b = -WB[k][1] * L * (k > 8 ? flk : 1);
      ctx.lineTo(w.x + s * (a * c - b * sn), w.y + s * fz * (a * sn + b * c));
    }
    ctx.closePath();
    if (noFins) return;
    // 长长的胸鳍（座头鲸），向后掠
    const sw = Math.sin(W.t * 0.8 + w.L) * 0.02;
    for (let side = -1; side <= 1; side += 2) {
      for (let k = 0; k < 4; k++) {
        const a = FIN[k][0] * L + (k === 1 || k === 2 ? sw * L : 0), b = FIN[k][1] * L * side;
        const X = w.x + s * (a * c - b * sn), Y = w.y + s * fz * (a * sn + b * c);
        if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
      }
      ctx.closePath();
    }
  }
  const FIN = [[0.25, 0.085], [0.03, 0.2], [0.0, 0.185], [0.17, 0.08]];
  // 露出水面的脊背：沿身轴取点，高出水面 e(a)
  function exposure(w, a) {
    if (w.st === 'surf' || (w.st === 'dive' && w.T < 2.8)) {
      let e;
      if (w.st === 'surf') {
        const ac = lerp(0.62, -0.62, w.roll);
        const x = (a - ac) / 0.34;
        e = Math.max(0, 1 - x * x) * 0.9 + (a > -0.25 && a < 0.35 ? 0.18 : 0);
      } else {
        // 下潜：背高高拱起，拱峰自前向后移
        const p = w.T / w.dur;
        const ac = lerp(0.2, -0.5, c01(p / 0.62));
        const x = (a - ac) / 0.4;
        e = Math.max(0, 1 - x * x) * (0.7 + 1.1 * w.arch);
      }
      return e * w.surf;
    }
    return 0;
  }
  function drawWhaleUnder(ctx, w, C) {
    const s = whaleScale(w), D = depthAt(w.y), fz = fzOf(D);
    const vis = w.a * w.fade * w.vis;
    if (vis < 0.02) return;
    const deep = w.st === 'under' ? 1 : 0.4;
    const hazeK = sstep(0.0, 0.25, D);
    const col = W.shade(WHALE, (1 - D) * 0.35);
    // 柔边：先画略大的一层淡影
    ctx.beginPath(); whaleTopPath(ctx, w, s, fz, 1.1);
    ctx.fillStyle = css(col, (0.1 + 0.08 * (1 - deep)) * vis * hazeK);
    ctx.fill();
    ctx.beginPath(); whaleTopPath(ctx, w, s, fz, 1);
    ctx.fillStyle = css(col, (0.22 + 0.24 * (1 - deep)) * vis * hazeK);
    ctx.fill();
    // 夜里：生命之光在它周身隐隐发亮
    if (C.bio > 0.03) {
      ctx.globalCompositeOperation = 'lighter';
      const pulse = 0.7 + 0.3 * Math.sin(W.t * 0.9 + w.L);
      ctx.beginPath(); whaleTopPath(ctx, w, s, fz, 1.18, true);
      ctx.fillStyle = css(BIO, C.bio * 0.05 * vis * pulse);
      ctx.fill();
      ctx.beginPath(); whaleTopPath(ctx, w, s, fz, 1, true);
      ctx.strokeStyle = css(BIO, C.bio * 0.13 * vis * pulse);
      ctx.lineWidth = Math.max(0.8, s * 1.2);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  const WBX = new Float64Array(16), WBY = new Float64Array(16), WTY = new Float64Array(16);
  function drawWhaleBack(ctx, w, C) {
    if (w.surf < 0.01 || w.st === 'breach' || w.st === 'under') return;
    const vis = w.a * w.fade * w.vis;
    if (vis < 0.02) return;
    const s = whaleScale(w), D = depthAt(w.y), fz = fzOf(D);
    const c = Math.cos(w.hd), sn = Math.sin(w.hd), L = w.L;
    const n = TOP.length;
    const bx = WBX, by = WBY, ty = WTY;
    let any = false;
    for (let k = 0; k < n; k++) {
      const a = TOP[k][0];
      const e = TOP[k][1] * L * exposure(w, a) * s;
      const X = w.x + s * (a * L * c), Y = w.y + s * fz * (a * L * sn);
      bx[k] = X; by[k] = Y; ty[k] = Y - e;
      if (e > 0.4) any = true;
    }
    const col = W.shade(WHALE, (1 - D) * 0.3);
    if (any) {
      ctx.beginPath();
      ctx.moveTo(bx[0], by[0]);
      for (let k = 0; k < n; k++) ctx.lineTo(bx[k], ty[k]);
      for (let k = n - 1; k >= 0; k--) ctx.lineTo(bx[k], by[k] + fz * s * L * 0.012);
      ctx.closePath();
      ctx.fillStyle = css(col, 0.95 * vis);
      ctx.fill();
      // 迎光的一道描边
      ctx.beginPath();
      let started = false;
      for (let k = 0; k < n; k++) {
        if (by[k] - ty[k] < 0.5) { started = false; continue; }
        if (!started) { ctx.moveTo(bx[k], ty[k]); started = true; } else ctx.lineTo(bx[k], ty[k]);
      }
      ctx.strokeStyle = css(C.rim, C.rimA * 0.55 * vis);
      ctx.lineWidth = Math.max(0.6, s * 0.9);
      ctx.stroke();
      // 水线：脊背两端出水处的一点白沫
      let k0 = -1, k1 = -1;
      for (let k = 0; k < n; k++) if (by[k] - ty[k] > 0.6) { if (k0 < 0) k0 = k; k1 = k; }
      if (k0 >= 0) {
        ctx.fillStyle = css(W.shade(FOAM, 0.1, 0.25), 0.22 * vis * (0.3 + 0.7 * W.daylight));
        ctx.beginPath();
        const rx = Math.max(1, 0.04 * L * s), ry = Math.max(0.5, rx * fz * 0.5);
        ctx.ellipse(bx[k0], by[k0], rx, ry, 0, 0, TAU);
        ctx.moveTo(bx[k1] + rx * 0.8, by[k1]);
        ctx.ellipse(bx[k1], by[k1], rx * 0.8, ry, 0, 0, TAU);
        ctx.fill();
      }
    }
    // 下潜时举起的尾鳍
    if (w.st === 'dive' && w.fluke > 0.02) {
      const tk = -0.46;
      const X = w.x + s * (tk * L * c), Y = w.y + s * fz * (tk * L * sn);
      const hf = w.fluke * 0.2 * L * s;
      const wf = 0.19 * L * s * (0.62 + 0.38 * Math.abs(sn));
      const tilt = c * 0.18;
      const st = 0.018 * L * s;
      ctx.beginPath();
      ctx.moveTo(X - st * 1.5, Y);
      ctx.quadraticCurveTo(X - st, Y - hf * 0.35, X - st * 0.6, Y - hf * 0.62);
      ctx.quadraticCurveTo(X - wf * 0.55, Y - hf * 0.6 - tilt * wf, X - wf, Y - hf * 1.02 - tilt * wf);
      ctx.quadraticCurveTo(X - wf * 0.55, Y - hf * 0.95, X - wf * 0.2, Y - hf * 0.96);
      ctx.quadraticCurveTo(X - wf * 0.06, Y - hf * 0.95, X, Y - hf * 0.86);
      ctx.quadraticCurveTo(X + wf * 0.06, Y - hf * 0.95, X + wf * 0.2, Y - hf * 0.96);
      ctx.quadraticCurveTo(X + wf * 0.55, Y - hf * 0.95, X + wf, Y - hf * 1.02 + tilt * wf);
      ctx.quadraticCurveTo(X + wf * 0.55, Y - hf * 0.6 + tilt * wf, X + st * 0.6, Y - hf * 0.62);
      ctx.quadraticCurveTo(X + st, Y - hf * 0.35, X + st * 1.5, Y);
      ctx.closePath();
      ctx.fillStyle = css(col, 0.96 * vis);
      ctx.fill();
      // 远去时看见尾鳍浅色的腹面
      const pale = Math.max(0, -sn) * 0.85;
      if (pale > 0.05) {
        ctx.beginPath();
        ctx.moveTo(X, Y - hf * 0.7);
        ctx.quadraticCurveTo(X - wf * 0.5, Y - hf * 0.66, X - wf * 0.9, Y - hf * 1.0 - tilt * wf);
        ctx.quadraticCurveTo(X - wf * 0.45, Y - hf * 0.9, X, Y - hf * 0.84);
        ctx.quadraticCurveTo(X + wf * 0.45, Y - hf * 0.9, X + wf * 0.9, Y - hf * 1.0 + tilt * wf);
        ctx.quadraticCurveTo(X + wf * 0.5, Y - hf * 0.66, X, Y - hf * 0.7);
        ctx.fillStyle = css(C.belly, pale * vis * 0.8);
        ctx.fill();
      }
      ctx.strokeStyle = css(C.rim, C.rimA * 0.6 * vis);
      ctx.lineWidth = Math.max(0.6, s);
      ctx.stroke();
    }
  }
  // 跃出：侧影沿抛物弧翻滚；水下的部分只剩淡影
  function sidePath(ctx, cx, cy, ux, uy, px, py, L, roll) {
    const n1 = SIDE_T.length, n2 = SIDE_B.length;
    const topK = 1 - 0.25 * Math.sin(roll);
    for (let k = 0; k < n1; k++) {
      const a = SIDE_T[k][0] * L, v = SIDE_T[k][1] * L * topK;
      const X = cx + a * ux + v * px, Y = cy + a * uy + v * py;
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    // 尾鳍：翻滚时渐渐看见其宽
    const fw = (0.03 + 0.13 * Math.abs(Math.sin(roll + 0.6))) * L;
    const fa = -0.52 * L;
    ctx.lineTo(cx + fa * ux + fw * px, cy + fa * uy + fw * py);
    ctx.lineTo(cx + (fa + 0.035 * L) * ux, cy + (fa + 0.035 * L) * uy);
    ctx.lineTo(cx + fa * ux - fw * px, cy + fa * uy - fw * py);
    for (let k = 0; k < n2; k++) {
      const a = SIDE_B[k][0] * L, v = SIDE_B[k][1] * L;
      ctx.lineTo(cx + a * ux + v * px, cy + a * uy + v * py);
    }
    ctx.closePath();
  }
  function breachGeom(w) {
    const s = scaleAt(w.by), L = w.L * s, p = c01(w.T / w.dur);
    const h = (-0.52 + 2.7 * p * (1 - p)) * L;
    const phi = p < 0.42 ? lerp(1.32, 1.02, U.easeOut(p / 0.42)) : lerp(1.02, 0.12, U.easeInOut((p - 0.42) / 0.58));
    const cx = w.bx + w.bdir * L * (0.1 * p + 0.22 * sstep(0.35, 1, p)), cy = w.by - h;
    const ux = w.bdir * Math.cos(phi), uy = -Math.sin(phi);
    const px = -w.bdir * Math.sin(phi), py = -Math.cos(phi);
    const roll = Math.PI * 0.9 * sstep(0.3, 0.9, p);
    return { s, L, cx, cy, ux, uy, px, py, roll, p };
  }
  function drawBreachBody(ctx, w, g, C, a) {
    const col = W.shade(WHALE, (1 - depthAt(w.by)) * 0.25);
    ctx.beginPath(); sidePath(ctx, g.cx, g.cy, g.ux, g.uy, g.px, g.py, g.L, g.roll);
    ctx.fillStyle = css(col, a);
    ctx.fill();
    // 浅色的腹：翻滚时越来越多地朝向我们
    const bk = 0.2 + 0.8 * Math.sin(g.roll * 0.9);
    ctx.beginPath();
    const n2 = SIDE_B.length;
    for (let k = 0; k < n2; k++) {
      const aa = SIDE_B[k][0] * g.L, v = SIDE_B[k][1] * g.L;
      const X = g.cx + aa * g.ux + v * g.px, Y = g.cy + aa * g.uy + v * g.py;
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    for (let k = n2 - 1; k >= 0; k--) {
      const aa = SIDE_B[k][0] * g.L, v = SIDE_B[k][1] * g.L * (1 - 0.5 * bk);
      ctx.lineTo(g.cx + aa * g.ux + v * g.px, g.cy + aa * g.uy + v * g.py);
    }
    ctx.closePath();
    ctx.fillStyle = css(U.mixRGB(col, C.belly, 0.45 + 0.4 * bk), a);
    ctx.fill();
    // 长长的白色胸鳍，随翻滚摆开
    const fa = Math.sin(g.roll + 0.4);
    const r0 = 0.25 * g.L, len = 0.28 * g.L;
    const bx = g.cx + r0 * g.ux - 0.07 * g.L * g.px, by = g.cy + r0 * g.uy - 0.07 * g.L * g.py;
    const dx = -0.55 * g.ux - (0.6 + 0.4 * fa) * g.px, dy = -0.55 * g.uy - (0.6 + 0.4 * fa) * g.py;
    const dl = Math.hypot(dx, dy) || 1;
    const ex = bx + (dx / dl) * len, ey = by + (dy / dl) * len;
    const nx = -(dy / dl) * 0.026 * g.L, ny = (dx / dl) * 0.026 * g.L;
    ctx.beginPath();
    ctx.moveTo(bx + nx, by + ny);
    ctx.quadraticCurveTo((bx + ex) / 2 + nx * 1.4, (by + ey) / 2 + ny * 1.4, ex, ey);
    ctx.quadraticCurveTo((bx + ex) / 2 - nx * 0.6, (by + ey) / 2 - ny * 0.6, bx - nx, by - ny);
    ctx.closePath();
    ctx.fillStyle = css(U.mixRGB(C.belly, col, 0.2), a);
    ctx.fill();
    // 描光
    ctx.beginPath();
    for (let k = 0; k < SIDE_T.length; k++) {
      const aa = SIDE_T[k][0] * g.L, v = SIDE_T[k][1] * g.L * (1 - 0.25 * Math.sin(g.roll));
      const X = g.cx + aa * g.ux + v * g.px, Y = g.cy + aa * g.uy + v * g.py;
      if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
    }
    ctx.strokeStyle = css(C.rim, C.rimA * a);
    ctx.lineWidth = Math.max(0.8, g.s * 1.4);
    ctx.stroke();
  }
  function drawBreach(ctx, w, C) {
    const vis = w.a * w.fade;
    if (vis < 0.02) return;
    const g = breachGeom(w);
    const top = g.cy - g.L * 1.2, bottom = g.cy + g.L * 1.2;
    // 水面以上：完整
    ctx.save();
    ctx.beginPath(); ctx.rect(g.cx - g.L * 1.3, top, g.L * 2.6, Math.max(0, w.by - top)); ctx.clip();
    drawBreachBody(ctx, w, g, C, 0.97 * vis);
    ctx.restore();
    // 水面以下：淡影
    ctx.save();
    ctx.beginPath(); ctx.rect(g.cx - g.L * 1.3, w.by, g.L * 2.6, Math.max(0, bottom - w.by)); ctx.clip();
    ctx.globalAlpha = 0.28;
    drawBreachBody(ctx, w, g, C, vis);
    ctx.globalAlpha = 1;
    ctx.restore();
    // 出水处的白沫
    const fo = W.shade(FOAM, 0.1, 0.25);
    const k = Math.sin(Math.PI * c01(g.p / 0.95));
    if (k > 0.02) {
      const wx = g.cx, rx = g.L * 0.16 * (0.5 + k), ry = rx * fzOf(depthAt(w.by)) * 0.9;
      ctx.beginPath();
      ctx.ellipse(wx, w.by, rx, Math.max(0.5, ry), 0, 0, TAU);
      ctx.fillStyle = css(fo, 0.16 * k * vis * (0.4 + 0.6 * W.daylight));
      ctx.fill();
    }
  }

  function drawRipples(ctx, band, C) {
    if (!RIP.length) return;
    const lightC = W.shade([250, 246, 236], 0.05, 0.45);
    const dayK = 0.3 + 0.7 * W.daylight;
    for (let i = 0; i < RIP.length; i++) {
      const r = RIP[i];
      if (r.band !== band || r.t < 0) continue;
      const p = r.t / r.dur, e = U.easeOut(p);
      const R = (r.r0 + (r.r1 - r.r0) * e) * r.s;
      if (R < 0.4) continue;
      const fade = (1 - p) * (1 - p);
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, R, Math.max(0.3, R * r.fz * 0.85), 0, 0, TAU);
      if (r.kind === 2) {
        ctx.fillStyle = css(W.shade(FOAM, 0.1, 0.2), 0.14 * fade * r.a * dayK);
        ctx.fill();
        continue;
      }
      if (r.kind === 1 || r.kind === 3) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = r.kind === 1 ? css(BIO, 0.5 * fade * r.a * C.bio) : css([190, 225, 240], 0.1 * fade * r.a * (0.4 + 0.6 * C.bio));
      } else {
        ctx.strokeStyle = css(lightC, 0.5 * fade * r.a * dayK);
      }
      ctx.lineWidth = Math.max(0.6, r.s * (r.kind === 3 ? 2 : 1.1));
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  function drawPlumes(ctx, band) {
    if (!PUFF || !PLUME.length) return;
    const dayK = 0.25 + 0.75 * W.daylight;
    for (let i = 0; i < PLUME.length; i++) {
      const p = PLUME[i];
      if (p.band !== band) continue;
      const e = p.t / p.dur;
      const grow = U.easeOut(c01(p.t / 0.55));
      const H = p.H * p.s * grow * (1 + e * 0.3), Wd = p.Wd * p.s * (0.5 + 1.3 * e);
      const a = Math.pow(1 - e, 1.6) * 0.5 * dayK;
      if (a < 0.01 || H < 0.5) continue;
      const drift = ((W.wind || 0) * 14 + p.dx * 10) * p.s * e;
      ctx.globalAlpha = a;
      // 自下而上三团，由窄而宽
      ctx.drawImage(PUFF, p.x - Wd * 0.3 + drift * 0.2, p.y - H * 0.5, Wd * 0.6, H * 0.55);
      ctx.drawImage(PUFF, p.x - Wd * 0.55 + drift * 0.6, p.y - H * 0.85, Wd * 1.1, H * 0.55);
      ctx.drawImage(PUFF, p.x - Wd * 0.8 + drift, p.y - H * 1.15, Wd * 1.6, H * 0.6);
      ctx.globalAlpha = 1;
    }
  }

  function draw(ctx, pass) {
    const band = BAND_I[pass];
    if (band == null || !ready) return;
    if (!FISH.length && !WHALES.length && !RIP.length && !PLUME.length) return;
    const C = frameColors();
    for (let i = 0; i < WHALES.length; i++) {
      const w = WHALES[i];
      if (w.st !== 'breach' && bandOf(w.y) === band) drawWhaleUnder(ctx, w, C);
    }
    drawFish(ctx, band, C);
    for (let i = 0; i < WHALES.length; i++) {
      const w = WHALES[i];
      if (w.st !== 'breach' && bandOf(w.y) === band) drawWhaleBack(ctx, w, C);
    }
    drawRipples(ctx, band, C);
    for (let i = 0; i < WHALES.length; i++) {
      const w = WHALES[i];
      if (w.st === 'breach' && bandOf(w.by) === band) drawBreach(ctx, w, C);
    }
    drawLeaps(ctx, band, C);
    drawPlumes(ctx, band);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ════════════════════════════════════════════════════════════
  //  生命周期
  // ════════════════════════════════════════════════════════════
  let ready = false, lastW = 0, lastH = 0;
  function computeSB() { const u = Math.max(0.3, W.unit || 1); SB = u < 0.75 ? 1 + (0.75 - u) * 0.7 : 1; }
  function resize() {
    if (!(W.w > 4 && W.h > 4)) { ready = false; return; }
    computeSB();
    const ow = lastW, oh = lastH, ohz = oh * (W.HZ || 0.6);
    buildMask();
    ready = true;
    // 保留生灵：按比例迁到新的尺寸，再放回水里
    if (ow > 4 && oh > 4 && (ow !== W.w || oh !== W.h)) {
      const remap = (x, y) => {
        const D = c01((y - ohz) / Math.max(1, oh - ohz));
        return [x / ow * W.w, W.horizonY + D * (W.h - W.horizonY)];
      };
      for (const f of FISH) {
        const p = remap(f.x, f.y); f.x = p[0]; f.y = p[1]; f.leap = null; f.trN = 0;
        if (!seaAt(f.x, f.y)) { const q = nearestSea(f.x, f.y, 0) || scatterFish(f.i); f.x = q[0]; f.y = q[1]; }
      }
      for (const w of WHALES) {
        const p = remap(w.x, w.y); w.x = p[0]; w.y = p[1];
        const b = remap(w.bx, w.by); w.bx = b[0]; w.by = b[1];
        if (!seaAt(w.x, w.y)) { const q = nearestSea(w.x, w.y, 0); if (q) { w.x = q[0]; w.y = q[1]; } }
        w.wt = 0;
      }
      for (const S of SCH) if (S) S.wt = 0;
      RIP.length = 0; PLUME.length = 0;
    }
    lastW = W.w; lastH = W.h;
  }
  function init() {
    makePuff();
    GS.bus.on('bless', e => U.safe('sea.bless', () => {
      if (!e) return;
      const r = e.r || 100;
      for (const f of FISH) {
        const d = Math.hypot(f.x - e.x, f.y - e.y);
        if (d < r) f.flickAt = W.t + (d / r) * 0.9 + Math.random() * 0.2;
      }
    }));
    GS.bus.on('fulfill', e => U.safe('sea.fulfill', () => {
      const st = e && e.stage;
      if (!st) return;
      // 赐福（滋生繁多）：光环扫过的鱼一一闪光
      if (st.kind === 'bless' || st.kind === 'behold') {
        const R = Math.hypot(W.w, W.h);
        for (const f of FISH) f.flickAt = W.t + (Math.hypot(f.x - e.x, f.y - e.y) / R) * 3 + Math.random() * 0.3;
      }
    }));
  }
  function update(dt) {
    if (!ready || W.w !== lastW || W.h !== lastH) { resize(); if (!ready) return; }
    if (!(dt > 0)) return;
    dt = Math.min(dt, 0.05);
    // 地在升起时，海的遮罩随之更新（节流）
    if (MASK.land !== W.lv.land && W.frame - MASK.frame >= 6) buildMask();
    spiritContext();
    syncPop(dt);
    updateFish(dt);
    updateWhales(dt);
    updateFx(dt);
  }
  function reset() {
    FISH.length = 0; WHALES.length = 0; SCH.length = 0; RIP.length = 0; PLUME.length = 0;
    fishAcc = 0; whaleNext = 0; leapT = 3; dimpleAcc = 0;
  }
  function restore() {
    if (!ready || W.w !== lastW || W.h !== lastH) resize();
    buildMask();
    RIP.length = 0; PLUME.length = 0;
    // 存档恢复：一切即刻完整
    const nF = W.popN('fish') | 0, nW = Math.min(3, W.popN('whale') | 0);
    if (FISH.length > nF) FISH.length = nF;
    if (WHALES.length > nW) WHALES.length = nW;
    for (const f of FISH) { f.a = 1; f.born = -99; f.leap = null; }
    for (const w of WHALES) { w.a = 1; w.fade = 1; if (w.st === 'breach') setSt(w, 'under', 4); }
    if (W.pop.fish) W.pop.fish.instant = true;
    if (W.pop.whale) W.pop.whale.instant = true;
    spiritContext();
    syncPop(0.016);
  }

  function pick(x, y, r) {
    let best = null;
    for (const w of WHALES) {
      if (w.a < 0.8 || w.fade < 0.8 || w.vis < 0.5) continue;
      let cx = w.x, cy = w.y;
      const s = whaleScale(w);
      if (w.st === 'breach') { const g = breachGeom(w); cx = g.cx; cy = g.cy; }
      const d = Math.max(0, Math.hypot(cx - x, cy - y) - w.L * s * 0.3);
      if (d < r && (!best || d < best.d)) best = { label: '鲸', x: cx, y: cy - Math.max(8, w.L * s * (w.st === 'breach' ? 0.35 : 0.08)), d };
    }
    for (const f of FISH) {
      if (f.a < 0.8) continue;
      const hgt = f.leap ? f.leap.H * f.s * 4 * f.leap.t * (1 - f.leap.t) : 0;
      const d = Math.max(0, Math.hypot(f.x - x, f.y - hgt - y) - f.len * f.s * 0.4);
      if (d < r && (!best || d < best.d)) best = { label: FK[f.k].cn, x: f.x, y: f.y - hgt - Math.max(4, f.len * f.s * 0.4), d };
    }
    return best;
  }

  // 海鸥据此绕着喷气的鲸盘旋
  function whaleSpots() {
    const out = [];
    for (const w of WHALES) {
      if (w.a < 0.5) continue;
      out.push({ x: w.x, y: w.y, spoutT: w.lastSpout, spX: w.spX, spY: w.spY, st: w.st, L: w.L * whaleScale(w), role: w.role });
    }
    return out;
  }

  GS.sea = {
    init, resize, update, draw, reset, restore, pick, whaleSpots,
    isSea: (x, y) => (ready ? seaAt(x, y) : W.isSea(x, y)),
    get debug() {
      return { fish: FISH.length, whales: WHALES.map(w => w.st + ':' + w.role + '@' + (w.x | 0) + ',' + (w.y | 0)), ripples: RIP.length, basins: BAS.sizes.length - 1, big: BAS.big,
        schools: SCH.filter(Boolean).map(S => S.n) };
    },
    _fish: FISH, _whales: WHALES, _setSt: setSt,
  };
})(window.GS);
