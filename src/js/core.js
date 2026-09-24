/* ─────────────────────────────────────────────────────────────
 * core.js —— 太初之道：命名空间、数学、噪声、随机、事件
 * 所有脚本都是经典 <script>（可直接双击 src/index.html 于 file:// 运行），
 * 通过全局 window.GS 共享。
 * ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';
  const GS = (window.GS = window.GS || {});

  const TAU = Math.PI * 2;

  // ── 数学 ─────────────────────────────────────────────────────
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, x) => (b === a ? 0 : (x - a) / (b - a));
  const smoothstep = (e0, e1, x) => {
    const t = clamp((x - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeIn = t => t * t * t;
  // 与帧率无关的指数趋近：rate 越大越快（每秒趋近 1-e^-rate）
  const approach = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));
  const fract = x => x - Math.floor(x);
  const wrap = (x, a, b) => a + ((((x - a) % (b - a)) + (b - a)) % (b - a));

  // ── 随机 ─────────────────────────────────────────────────────
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const chance = p => Math.random() < p;
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  // ── 噪声（值噪声，平滑，确定性）──────────────────────────────
  // 一维哈希：[0,256) 内沿用最初的公式（大地的轮廓由它确定，保持不变）；
  // 其余输入改用 32 位整数运算——旧公式的大整数相乘超出双精度，会退化成常数
  function hash1(n) {
    n |= 0;
    if (n >= 0 && n < 256) {
      n = (n << 13) ^ n;
      return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0) * 0.5 + 0.5;
    }
    let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  // 二维哈希：全程 32 位整数运算（Math.imul），任何输入都均匀
  function hash2(x, y) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function noise1(x) {
    const i = Math.floor(x), f = x - i;
    const u = f * f * (3 - 2 * f);
    return lerp(hash1(i), hash1(i + 1), u) * 2 - 1;          // -1..1
  }
  function noise2(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    const a = hash2(ix, iy), b = hash2(ix + 1, iy);
    const c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1);
    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy) * 2 - 1; // -1..1
  }
  function fbm1(x, oct = 4) {
    let s = 0, a = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) { s += a * noise1(x * f + i * 17.3); n += a; a *= 0.5; f *= 2.03; }
    return s / n;
  }
  function fbm2(x, y, oct = 4) {
    let s = 0, a = 0.5, f = 1, n = 0;
    for (let i = 0; i < oct; i++) { s += a * noise2(x * f + i * 17.3, y * f - i * 9.1); n += a; a *= 0.5; f *= 2.03; }
    return s / n;
  }

  // ── 颜色 ─────────────────────────────────────────────────────
  const rgb = (r, g, b) => 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';
  const rgba = (r, g, b, a) =>
    'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + (a < 0 ? 0 : a > 1 ? 1 : a).toFixed(3) + ')';
  const mixRGB = (c1, c2, t) => [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
  const hexRGB = hex => {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  // ── 事件 ─────────────────────────────────────────────────────
  const listeners = {};
  const bus = {
    on(evt, fn) { (listeners[evt] = listeners[evt] || []).push(fn); },
    off(evt, fn) { const l = listeners[evt]; if (l) { const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); } },
    emit(evt, payload) {
      const l = listeners[evt];
      if (!l) return;
      for (let i = 0; i < l.length; i++) {
        try { l[i](payload); } catch (e) { console.error('[GS.bus]', evt, e); }
      }
    },
  };

  // ── 安全调用：一个模块出错不应让整个世界停摆 ──────────────────
  const warned = {};
  function safe(label, fn) {
    try { return fn(); } catch (e) {
      if (!warned[label]) { warned[label] = true; console.error('[GS] ' + label, e); }
    }
  }

  GS.util = {
    TAU, clamp, lerp, invLerp, smoothstep, easeInOut, easeOut, easeIn, approach, fract, wrap,
    mulberry32, rand, randInt, pick, chance, gauss,
    hash1, hash2, noise1, noise2, fbm1, fbm2,
    rgb, rgba, mixRGB, hexRGB,
    safe,
  };
  GS.bus = bus;
  GS.version = '2.0.0';
})();
