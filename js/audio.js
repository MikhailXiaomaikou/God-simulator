/* ─────────────────────────────────────────────────────────────
 * audio.js —— 声音：一首在 A 调上持续生长的曲子（WebAudio，零素材）
 *
 * 原则一 · 话语为混沌调音：渊的底鸣起初走音（36Hz 与 54.5Hz，拍频可闻），
 *         头一晚调到 54.8，第二晚调准 55；旱地升起时 36Hz 落为 A0 27.5Hz——混沌的摇晃渐渐止息。
 * 原则二 · 和声的累积：每一日为同一个和弦添一层——
 *         起初 底鸣 · 一 光垫 A3+E4 · 二 空气 B3、上层之水、混响张开 · 三 地 C#3 与生长的拨弦
 *         · 四 光垫的低通随日升落、夜里星的轻鸣 · 五 鸟歌、鲸歌、气泡 · 六 人的双音 A3+C#4、夜虫、啃草声
 *         第七日把层一层层拿走；七息之后造物主的底鸣永远退去，只剩世界自己的声音；
 *         安息的世界里，唯有日落时分还有一缕「甚好」的和弦。
 * 言说：每一日的按住有它自己的声音；充盈度只推动音量与滤波的开合，从不推动音高。
 * 七日之后（其后各卷）：底鸣不再回来；言说用「话语」之声，世界的声音照常。
 *
 * 链路：声部 → 各声部总线（干 + 送混响）→ 卷积混响（程序生成 2.8s 立体声衰减噪声）
 *       → 压缩 → 主音量 0.55 → 限幅 → 静音/可见 → 输出
 * 轻量：噪声缓冲全局共用；一切包络用 AudioParam 排程；一次性声部结束即断开；同时发声数有上限；
 *       世界驱动的参数每 0.1 秒才更新一次。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { clamp, lerp, smoothstep } = U;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  // 七日的终点：第一卷「七日」最后一句之后（其后各卷的话语接在 STAGES 后面，造物主的底鸣不再回来）
  const NST = () => (GS.book && GS.book.ACTS && GS.book.ACTS[0] ? GS.book.ACTS[0].last + 1
    : GS.story && GS.story.STAGES ? GS.story.STAGES.length : 28);
  const PUNCT = /[，。、；：！？「」『』（）…—,.;:!?\s]/;

  // ── 音高（A 调）──────────────────────────────────────────
  const F = {
    A0: 27.5, A1: 55, E2: 82.41, A2: 110, B2: 123.47, Cs3: 138.59, E3: 164.81, A3: 220, B3: 246.94,
    Cs4: 277.18, D4: 293.66, E4: 329.63, Fs4: 369.99, Gs4: 415.3, A4: 440, B4: 493.88, Cs5: 554.37,
    E5: 659.25, Fs5: 739.99, A5: 880, B5: 987.77, Cs6: 1108.73, E6: 1318.51, Fs6: 1479.98, A6: 1760,
    B6: 1975.53, Cs7: 2217.46, E7: 2637.02, A7: 3520,
  };
  const PENT = [0, 2, 4, 7, 9];                       // A 大调五声：A B C# E F#
  const pent = (base, i) => base * Math.pow(2, (PENT[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5)) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rint = (a, b) => Math.floor(rnd(a, b + 1));
  const fin = v => typeof v === 'number' && isFinite(v);

  // ── 状态 ────────────────────────────────────────────────
  let AC = null, N = null, NB = null, PW = null;
  let muted = false, hidden = false, live = 0, lastTick = -1, tickDt = 0.1, resumeAt = -1e9, suspT = 0;
  let hold = null, breathN = 0, lastStage = -1, lastCharge = 0, lastChargeAt = 0, divNow = -1;
  let hasPan = false, unlocked = false, gestureHooked = false;
  const errs = [];
  const beds = {};
  const nx = {};                                       // 生成事件的下一时刻
  const C = {};                                        // 全局受控参数
  const TICK = 0.1;

  function err(label, e) { if (errs.length < 30) errs.push(label + ': ' + ((e && e.message) || e)); }
  const T = () => AC.currentTime;
  const running = () => AC && (AC.state === 'running' || performance.now() - resumeAt < 700);

  // 平滑地趋向 v（指数趋近；tc 为时间常数）
  function to(param, v, tc, at) {
    if (!param || !fin(v)) return;
    param.setTargetAtTime(v, at == null ? AC.currentTime : at, Math.max(0.004, tc || 0.1));
  }
  // 受控参数：目标真正改变时才写入，避免时间线堆满事件
  const ctl = (param, v0) => ({ p: param, v: v0 == null ? NaN : v0 });
  function set(c, v, tc) {
    if (!c || !fin(v)) return;
    if (Math.abs(v - c.v) <= 1e-6 + Math.abs(c.v) * 0.003) return;
    c.v = v;
    to(c.p, v, tc);
  }

  // ── 节点工厂 ────────────────────────────────────────────
  function gain(v) { const g = AC.createGain(); g.gain.value = v; return g; }
  function filt(type, f, q) {
    const b = AC.createBiquadFilter();
    b.type = type; b.frequency.value = f; b.Q.value = q == null ? 0.707 : q;
    return b;
  }
  function osc(type, f) {
    const o = AC.createOscillator();
    if (typeof type === 'string') o.type = type; else o.setPeriodicWave(type);
    o.frequency.value = f;
    return o;
  }
  function noiseSrc(kind, rate) {
    const s = AC.createBufferSource();
    if (!NB[kind]) NB[kind] = noiseBuffer(kind);          // 按需生成（平时已在后台预先备好）
    s.buffer = NB[kind];
    s.loop = true;
    if (rate) s.playbackRate.value = rate;
    return s;
  }
  // 稀疏化曲线：把缓慢的随机起伏变成一阵一阵的"沙、沙沙"（叶声、碎石声的颗粒）
  let SPARSE = null;
  function sparseCurve() {
    if (SPARSE) return SPARSE;
    const n = 1024, c = new Float32Array(n), th = 0.12;
    for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; c[i] = x > th ? Math.pow((x - th) / (1 - th), 1.7) * 2.2 : 0; }
    return (SPARSE = c);
  }
  function panner(p) {
    if (hasPan) { const s = AC.createStereoPanner(); s.pan.value = clamp(fin(p) ? p : 0, -1, 1); return s; }
    return gain(1);
  }
  const panX = x => clamp((x / Math.max(1, W.w)) * 2 - 1, -1, 1) * 0.8;
  const busIn = b => (b && b.connect ? b : (N.bus[b] || N.bus.evt).in);

  // 一组节点（一次性声部 / 常驻声床 / 言说之声共用）
  function Voice() { this.n = []; this.s = []; this.c = {}; }
  Voice.prototype = {
    g(v) { const x = gain(v); this.n.push(x); return x; },
    f(type, fr, q) { const x = filt(type, fr, q); this.n.push(x); return x; },
    o(type, fr) { const x = osc(type, fr); this.n.push(x); this.s.push(x); return x; },
    nz(kind, rate) { const x = noiseSrc(kind, rate); this.n.push(x); this.s.push(x); return x; },
    // 常驻声床用的噪声：播放速率缓缓漂移（±2.5%），循环的缓冲便不会被耳朵认出"同一段又来了"
    nzd(kind) {
      const x = this.nz(kind, 1);
      this.lfo(rnd(0.021, 0.047), 0.025, x.playbackRate);
      return x;
    },
    p(pan) { const x = panner(pan); this.n.push(x); return x; },
    ws(curve) { const x = AC.createWaveShaper(); x.curve = curve; this.n.push(x); return x; },
    // 低频振荡：rate Hz、深度 depth，加到 param 上
    lfo(rate, depth, param, type) {
      if (!param) return null;
      const l = this.o(type || 'sine', rate), g = this.g(depth);
      l.connect(g); g.connect(param);
      return l;
    },
    // 随机的缓慢起伏：褐噪声放慢播放（带宽约 150×rate Hz）——比正弦 LFO 自然，不耗 JS
    //   深度 depth 约为起伏的峰值（褐噪声 RMS 0.3，接到参数上时左右声道混为一，约 ±0.21 RMS）
    nlfo(rate, depth, param) {
      if (!param) return null;
      const s = this.nz('brown', rate), g = this.g(depth);
      s.connect(g); g.connect(param);
      return s;
    },
    out(node, bus, pan, rev) {
      let x = node;
      if (pan != null && pan !== 0 && hasPan) { const p = this.p(pan); x.connect(p); x = p; }
      x.connect(busIn(bus));
      if (rev) { const s = this.g(rev); x.connect(s); s.connect(N.revIn); }
      return x;
    },
    startAll(t) {
      for (let i = 0; i < this.s.length; i++) {
        const s = this.s[i];
        if (s.buffer) s.start(t, Math.random() * s.buffer.duration * 0.9); else s.start(t);
      }
    },
    kill() {
      for (let i = 0; i < this.s.length; i++) { try { this.s[i].stop(); } catch (e) { /* 已停 */ } }
      for (let i = 0; i < this.n.length; i++) { try { this.n[i].disconnect(); } catch (e) { /* */ } }
      this.s.length = 0; this.n.length = 0;
    },
    // 一次性：t0 开始，t1 停止，停后自行断开
    play(t0, t1) {
      const s = this.s, n = this.n, k = pend.indexOf(this);
      if (k >= 0) pend.splice(k, 1);
      if (!s.length) { live--; return; }
      this.startAll(t0);
      for (let i = 0; i < s.length; i++) s[i].stop(t1);
      let done = false;
      s[0].onended = () => {
        if (done) return;
        done = true;
        for (let i = 0; i < n.length; i++) { try { n[i].disconnect(); } catch (e) { /* */ } }
        live--;
      };
    },
  };

  // 同时发声数的上限：prio 0 可舍（环境点缀）· 1 一般 · 2 必需
  function voice(prio) {
    if (!AC || hidden || !running()) return null;
    const lowQ = W.quality < 0.75, base = lowQ ? 30 : 44;
    const cap = prio >= 2 ? (lowQ ? 46 : 64) : prio === 1 ? base : base * 0.6;
    if (live >= cap) return null;
    live++;
    const v = new Voice();
    pend.push(v);
    return v;
  }
  // 建到一半出错的声部：拆掉并归还名额（不让计数泄漏）
  const pend = [];
  function flush() {
    while (pend.length) { const v = pend.pop(); try { v.kill(); } catch (e) { /* */ } live--; }
  }

  // ── 包络 ────────────────────────────────────────────────
  // 指数衰减的尾巴在停下前 25ms 接一段线性归零（接点取指数曲线在该处的精确值，不跳变）——
  // 声部停下时恰为 0，低音也不会"咔"一声
  function tail(p, t0, peak, tc, end) {
    const tf = Math.max(t0, end - 0.025);
    p.setValueAtTime(peak * Math.exp(-(tf - t0) / tc), tf);
    p.linearRampToValueAtTime(0, end);
    return end + 0.02;
  }
  function perc(p, t, a, peak, d) {                     // a 秒升起，d 秒指数衰减
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(peak, t + a);
    p.setTargetAtTime(0, t + a, d / 5);
    return tail(p, t + a, peak, d / 5, t + a + d);
  }
  function swell(p, t, a, peak, s, r) {                 // 缓起 · 持续 · 缓收
    p.setValueAtTime(0, t);
    p.linearRampToValueAtTime(peak, t + a);
    if (s > 0) p.setValueAtTime(peak, t + a + s);
    p.setTargetAtTime(0, t + a + s, r / 4);
    return tail(p, t + a + s, peak, r / 4, t + a + s + r);
  }
  function envelope(g, t, o) {
    return o.d ? perc(g.gain, t, o.a || 0.006, o.g, o.d) : swell(g.gain, t, o.a == null ? 0.4 : o.a, o.g, o.s || 0, o.r || 2);
  }

  // ── 一个音 ──────────────────────────────────────────────
  // o: { f, type|wave, g, a, d | s+r, at, det(音分), path:[[f, 秒], ...], vib:[Hz, 比例], trem:[Hz, 深度],
  //      lp, lp2, lpT, pan, pan2, bus, rev, prio }
  function note(o) {
    if (!fin(o.f) || !fin(o.g) || o.g <= 0) return;
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const src = v.o(o.type || 'sine', o.f);
    if (o.det) src.detune.value = o.det;
    if (o.path) {
      src.frequency.setValueAtTime(o.f, t);
      let tt = t;
      for (const [f2, dt] of o.path) { tt += dt; src.frequency.exponentialRampToValueAtTime(Math.max(1, f2), tt); }
    }
    if (o.vib) v.lfo(o.vib[0], o.f * o.vib[1], src.frequency);
    let x = src;
    if (o.lp) {
      const fl = v.f('lowpass', o.lp, 0.6);
      if (o.lp2) { fl.frequency.setValueAtTime(o.lp, t); fl.frequency.exponentialRampToValueAtTime(o.lp2, t + (o.lpT || 3)); }
      x.connect(fl); x = fl;
    }
    const g = v.g(0);
    x.connect(g); x = g;
    if (o.trem) {
      const tg = v.g(1 - o.trem[1] / 2);
      v.lfo(o.trem[0], o.trem[1] / 2, tg.gain);
      x.connect(tg); x = tg;
    }
    const end = envelope(g, t, o);
    if (o.pan2 != null && hasPan) {
      const p = v.p(o.pan || 0);
      p.pan.setValueAtTime(clamp(o.pan || 0, -1, 1), t);
      p.pan.linearRampToValueAtTime(clamp(o.pan2, -1, 1), end);
      x.connect(p); x = p;
      v.out(x, o.bus || 'evt', null, o.rev);
    } else v.out(x, o.bus || 'evt', o.pan, o.rev);
    v.play(t, end);
  }

  // 一阵噪声：o: { buf, ft, f, q, f2, sweep, g, a, d | s+r, at, pan, pan2, bus, rev, rate, hp, prio }
  function burst(o) {
    if (!fin(o.g) || o.g <= 0) return;
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const src = v.nz(o.buf || 'white', o.rate);
    const fl = v.f(o.ft || 'bandpass', o.f || 1000, o.q == null ? 0.8 : o.q);
    if (o.f2) { fl.frequency.setValueAtTime(o.f, t); fl.frequency.exponentialRampToValueAtTime(o.f2, t + (o.sweep || o.d || 1)); }
    let x = fl;
    src.connect(fl);
    if (o.hp) { const h = v.f('highpass', o.hp, 0.6); x.connect(h); x = h; }
    const g = v.g(0);
    x.connect(g); x = g;
    if (o.am) { const am = v.g(1 - o.am[1]); v.lfo(o.am[0], o.am[1], am.gain); x.connect(am); x = am; }
    const end = envelope(g, t, o);
    if (o.pan2 != null && hasPan) {
      const p = v.p(o.pan || 0);
      p.pan.setValueAtTime(clamp(o.pan || 0, -1, 1), t);
      p.pan.linearRampToValueAtTime(clamp(o.pan2, -1, 1), end);
      x.connect(p);
      v.out(p, o.bus || 'evt', null, o.rev);
    } else v.out(x, o.bus || 'evt', o.pan, o.rev);
    v.play(t, end);
  }

  // 一串颗粒（一个噪声源 + 排程的包络、滤波、声像）：名字聚成、水花溅落、闪烁
  function grains(o) {
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const src = v.nz(o.buf || 'white');
    const fl = v.f('bandpass', o.f0, o.q || 2.5), g = v.g(0);
    src.connect(fl); fl.connect(g);
    const p = hasPan ? v.p(0) : null;          // 每颗粒子各有其声像
    let x = g;
    if (p) { g.connect(p); x = p; }
    const len = o.len || 0.02;
    let tt = t;
    for (let i = 0; i < o.n; i++) {
      tt = t + (o.dur * i) / o.n + rnd(0, o.dur / o.n);
      fl.frequency.setValueAtTime(rnd(o.f0, o.f1), tt);
      if (p) p.pan.setValueAtTime(clamp(rnd(-1, 1) * (o.spread == null ? 0.7 : o.spread) + (o.pan || 0), -1, 1), tt);
      g.gain.setValueAtTime(0, tt);
      g.gain.linearRampToValueAtTime(o.g * rnd(0.5, 1), tt + Math.min(0.004, len * 0.3));
      g.gain.setTargetAtTime(0, tt + Math.min(0.004, len * 0.3), len / 3);
    }
    v.out(x, o.bus || 'evt', null, o.rev);
    v.play(t, tt + len * 2 + 0.1);
  }

  // 低沉的非谐钟（叠句）：110Hz 基音，分音 ×2.76 ×5.40 ×8.93
  function tollBell(f, g, d, at, pan, bus, rev) {
    const v = voice(2);
    if (!v) return;
    const t = T() + (at || 0) + 0.015;
    const sum = v.g(1);
    const P = [1, 2.76, 5.4, 8.93], R = [1, 0.5, 0.25, 0.12], D = [1, 0.62, 0.4, 0.26];
    let end = t;
    for (let i = 0; i < 4; i++) {
      const o = v.o('sine', f * P[i]);
      o.detune.value = rnd(-4, 4);
      const og = v.g(0);
      o.connect(og); og.connect(sum);
      end = Math.max(end, perc(og.gain, t, 0.004 + i * 0.001, g * R[i], d * D[i]));
    }
    v.out(sum, bus || 'rit', pan, rev == null ? 0.5 : rev);
    v.play(t, end);
  }

  // 正弦铃（「好」的动机）
  function bells(fs, gap, g, d, at, o) {
    o = o || {};
    // 铃不颤音：只有极轻的一丝（约 2 音分），外加一道微失谐的影子与很快消失的高分音——是玻璃，不是玩具
    fs.forEach((f, i) => {
      const t = (at || 0) + i * gap, pan = (i - (fs.length - 1) / 2) * 0.25;
      note({ f, g, a: 0.005, d, at: t, vib: [4.3, o.vib == null ? 0.0012 : o.vib], pan,
        rev: o.rev == null ? 0.55 : o.rev, bus: o.bus, prio: o.prio == null ? 2 : o.prio });
      note({ f, det: 3.5, g: g * 0.35, a: 0.005, d: d * 0.8, at: t, pan: -pan, rev: o.rev == null ? 0.55 : o.rev, bus: o.bus, prio: 0 });
      note({ f: f * 2.76, g: g * 0.07, a: 0.003, d: d * 0.18, at: t, pan, bus: o.bus, prio: 0 });
    });
  }

  // 和弦
  function chord(fs, o) {
    const n = fs.length;
    fs.forEach((f, i) => note({
      f, g: o.gs ? o.gs[i] : o.g, type: o.types ? o.types[i] : o.type, a: o.a, s: o.s, r: o.r, d: o.d,
      det: rnd(-1, 1) * (o.det || 0), at: (o.at || 0) + (o.strum || 0) * i, lp: o.lp, lp2: o.lp2, lpT: o.lpT,
      // 低音居中，越高的声部越向两侧交错展开
      pan: o.spread && n > 1 ? o.spread * (i % 2 ? 1 : -1) * (0.3 + 0.7 * i / (n - 1)) : o.pan, rev: o.rev, bus: o.bus, prio: o.prio == null ? 2 : o.prio,
    }));
  }

  // ── 生灵的声音 ──────────────────────────────────────────
  // 鸟：FM 鸣啭；载波在 A 五声（1760–3520Hz），调制比 1.5，调制深度在每个音内 200→0
  function birdPhrase(at, pan, g) {
    if (!(g > 0)) return;
    const v = voice(0);
    if (!v) return;
    const t0 = T() + (at || 0) + 0.02;
    const car = v.o('sine', 2000), mod = v.o('sine', 3000), mg = v.g(0), env = v.g(0);
    mod.connect(mg); mg.connect(car.frequency); car.connect(env);
    const n = rint(3, 6), species = Math.random();
    let t = t0;
    const base = species < 0.5 ? rint(0, 3) : rint(2, 6);
    for (let i = 0; i < n; i++) {
      const f = pent(F.A6, base + rint(-1, 2) + (species < 0.5 ? 0 : (i % 2)));
      const d = rnd(0.08, 0.15);
      const bend = species < 0.33 ? rnd(1.05, 1.18) : species < 0.66 ? rnd(0.85, 0.95) : 1;
      car.frequency.setValueAtTime(f, t);
      car.frequency.linearRampToValueAtTime(f * bend, t + d);
      mod.frequency.setValueAtTime(f * 1.5, t);
      mg.gain.setValueAtTime(200 + f * 0.05, t);
      mg.gain.linearRampToValueAtTime(0, t + d);
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(g * rnd(0.6, 1), t + 0.012);
      env.gain.setTargetAtTime(0, t + d * 0.6, d * 0.18);
      t += d + rnd(0.03, 0.09);
    }
    v.out(env, 'amb', pan, 0.22);
    v.play(t0, t + 0.2);
  }
  // 海鸥：远处的「kiaow」——富泛音的簧音，先扬后抑，经低通与一点粗糙的颤动；两三声，一声比一声轻
  function gull(at, pan, g) {
    const k = rint(2, 3), f0 = rnd(560, 660);
    for (let i = 0; i < k; i++) {
      const f = f0 * rnd(0.97, 1.04);
      note({ f, type: PW.reed, path: [[f * 1.24, 0.06], [f * 0.8, 0.22]], trem: [31, 0.35], lp: 2400, g: g * 0.5 * (1 - i * 0.2), a: 0.02, s: 0.1, r: 0.16,
        at: (at || 0) + i * rnd(0.36, 0.48), pan, rev: 0.45, bus: 'amb', prio: 0 });
    }
  }
  // 斑鸠：低柔的两声「咕—咕」
  function dove(at, pan, g) {
    note({ f: F.E5 * 0.5, path: [[F.Cs5 * 0.5, 0.35]], g, a: 0.08, s: 0.15, r: 0.25, lp: 900, at, pan, rev: 0.35, bus: 'amb', prio: 0 });
    note({ f: F.E5 * 0.5, path: [[F.Cs5 * 0.5, 0.5]], g: g * 0.8, a: 0.08, s: 0.25, r: 0.3, lp: 900, at: (at || 0) + 0.7, pan, rev: 0.35, bus: 'amb', prio: 0 });
  }
  // 鲸歌：正弦 90→60→75Hz 的滑音，0.3Hz ±8Hz 颤音，经 800Hz 低通，上方五度叠一声
  function whaleSong(at, pan, g, bus) {
    if (!(g > 0)) return;
    const v = voice(1);
    if (!v) return;
    const t = T() + (at || 0) + 0.02;
    const shapes = [[90, 60, 75], [70, 118, 84], [82, 64, 96, 72]];
    const sh = shapes[rint(0, shapes.length - 1)], dur = rnd(3.4, 4.6), seg = dur / (sh.length - 1);
    const lp = v.f('lowpass', 800, 0.9), env = v.g(0);
    for (const mul of [1, 1.5]) {
      const o = v.o(PW.warm, sh[0] * mul);
      o.frequency.setValueAtTime(sh[0] * mul, t);
      for (let i = 1; i < sh.length; i++) o.frequency.exponentialRampToValueAtTime(sh[i] * mul, t + seg * i);
      v.lfo(0.3, 8 * mul, o.frequency);
      const og = v.g(mul === 1 ? 1 : 0.55);
      o.connect(og); og.connect(lp);
    }
    lp.connect(env);
    const end = swell(env.gain, t, dur * 0.25, g, dur * 0.45, dur * 0.4);
    v.out(env, bus || 'amb', pan, 0.8);
    v.play(t, end);
  }
  // 牛：锯齿 110→98Hz 经 500 / 900Hz 共振峰，1.2s
  function cow(at, pan, g, far) {
    if (!(g > 0)) return;
    const v = voice(1);
    if (!v) return;
    const t = T() + (at || 0) + 0.02, f = rnd(104, 116);
    const o = v.o(PW.reed, f);
    o.frequency.setValueAtTime(f, t);
    o.frequency.linearRampToValueAtTime(f * 0.89, t + 1.2);
    const f1 = v.f('bandpass', 500, 4), f2 = v.f('bandpass', 900, 5), lp = v.f('lowpass', far ? 1100 : 2200, 0.7), env = v.g(0);
    o.connect(f1); o.connect(f2); f1.connect(lp); f2.connect(lp); lp.connect(env);
    const end = swell(env.gain, t, 0.18, g, 0.65, 0.45);
    v.out(env, 'amb', pan, far ? 0.5 : 0.3);
    v.play(t, end);
  }
  // 羊：锯齿 220Hz，6Hz 颤音，共振峰 800 / 1200Hz，0.6s
  function sheep(at, pan, g, far) {
    if (!(g > 0)) return;
    const v = voice(1);
    if (!v) return;
    const t = T() + (at || 0) + 0.02, f = rnd(210, 236);
    const o = v.o(PW.reed, f);
    v.lfo(6, f * 0.035, o.frequency);
    const f1 = v.f('bandpass', 800, 4), f2 = v.f('bandpass', 1200, 5), lp = v.f('lowpass', far ? 1600 : 3000, 0.7), env = v.g(0);
    o.connect(f1); o.connect(f2); f1.connect(lp); f2.connect(lp); lp.connect(env);
    const end = swell(env.gain, t, 0.06, g, 0.4, 0.2);
    v.out(env, 'amb', pan, far ? 0.5 : 0.3);
    v.play(t, end);
  }
  // 远处的狮子：噪声 + 70Hz 锯齿，经 300Hz 低通，1.5s 的涌起
  function lion(at, pan, g) {
    note({ f: 70, type: PW.reed, path: [[58, 1.5]], lp: 300, g: g * 0.7, a: 0.5, s: 0.4, r: 0.8, at, pan, rev: 0.5, bus: 'amb' });
    burst({ buf: 'brown', ft: 'lowpass', f: 300, q: 0.7, g: g * 0.8, a: 0.5, s: 0.4, r: 0.8, at, pan, rev: 0.5, bus: 'amb' });
  }
  // 马的响鼻：0.3s 的噪声，1kHz
  function snort(at, pan, g) { burst({ buf: 'white', f: 1000, q: 1.2, g, a: 0.02, d: 0.3, at, pan, rev: 0.25, bus: 'amb' }); }
  // 气泡：正弦 400→1200Hz，40ms
  function bubble(at, pan, g, bus) {
    const f = rnd(320, 620);
    note({ f, path: [[f * rnd(2.4, 3.2), 0.04]], g, a: 0.004, d: 0.07, at, pan, rev: 0.25, bus: bus || 'amb', prio: 0 });
  }
  // 心跳：成对的低沉闷响（lub · dub）
  // 心跳：成对的低沉闷响（lub · dub）；外加一声很短的"叩"（330Hz 附近），小喇叭上也有心跳
  function thump(at, f, g, dest) {
    note({ f: f * 1.35, path: [[f * 0.8, 0.12]], g, a: 0.008, d: 0.22, at, bus: dest, prio: 1 });
    note({ f: f * 2.7, path: [[f * 1.6, 0.1]], g: g * 0.3, a: 0.006, d: 0.12, at, bus: dest, prio: 0 });
    burst({ buf: 'pink', f: 330, q: 1.3, g: g * 0.55, a: 0.004, d: 0.075, at, bus: dest, prio: 0 });
  }
  // 木：正弦 + 4 倍分音（树木的木声）
  function wood(f, at, g, pan) {
    note({ f, g, a: 0.004, d: 0.8, at, pan, rev: 0.4 });
    note({ f: f * 4, g: g * 0.3, a: 0.003, d: 0.25, at, pan, rev: 0.3, prio: 0 });
  }
  // 拨弦（三角波，A 五声）
  function pluck(f, at, g, pan, d, bus) { note({ f, type: 'triangle', g, a: 0.006, d: d || 0.5, at, pan, rev: 0.45, bus, prio: bus === 'amb' ? 0 : 1 }); }
  // 星的轻鸣
  function ping(f, at, g, pan, bus) { note({ f, g, a: 0.002, d: 1.5, at, pan, rev: 0.8, bus, prio: bus === 'amb' ? 0 : 1 }); }
  // 人的主题：A4 C#5 E5 F#5 E5 C#5 A4（整部作品第一条有起伏的旋律）
  function humanTheme(at, g, bus) {
    [F.A4, F.Cs5, F.E5, F.Fs5, F.E5, F.Cs5, F.A4].forEach((f, i) =>
      note({ f, type: 'triangle', g: g * (i === 3 ? 1.1 : 1), a: 0.03, s: 0.2, r: 1.2, at: (at || 0) + i * 0.45, rev: 0.85, pan: 0.15, bus, prio: 1 }));
  }
  // 水花
  function splash(x, y, size, at) {
    const near = W.seaDepth ? W.seaDepth(y) : 0.5, s = clamp(size || 1, 0.2, 8);
    burst({ buf: 'white', f: rnd(900, 2400) * (0.7 + 0.5 * near), q: 0.7, g: (0.03 + 0.04 * Math.sqrt(s)) * (0.35 + 0.65 * near),
      a: 0.004, d: 0.12 + 0.06 * s, at, pan: panX(x), rev: 0.25, bus: 'amb', prio: 0 });
  }

  // ── 常驻声床：按需建立、静默久了便拆除 ─────────────────
  function Bed(build, dest) { this.build = build; this.dest = dest; this.x = null; this.idle = 0; }
  let bedBuilt = false;                                 // 每一拍至多新建一个声床，免得卡顿
  Bed.prototype.want = function (lvl, tc) {
    if (lvl > 0.0004) {
      if (!this.x) { if (bedBuilt || this.broken) return null; bedBuilt = true; this.start(); if (!this.x) return null; }
      this.idle = 0;
      set(this.x.L, lvl, tc);
    } else if (this.x) {
      set(this.x.L, 0, tc);
      this.idle += tickDt;
      if (this.idle > Math.max(2.5, tc * 5)) this.stop();
    }
    return this.x;
  };
  Bed.prototype.start = function () {
    if (this.broken) return;
    const v = new Voice();
    try {
      const lvl = v.g(0);
      v.L = ctl(lvl.gain, 0);
      this.build(v, lvl);
      lvl.connect(this.dest());
      v.startAll(T());
      this.x = v;
    } catch (e) {                                        // 建不起来的声床：拆掉，不再重试
      err('bed', e); v.kill(); this.broken = true; this.x = null;
    }
  };
  Bed.prototype.stop = function () { if (this.x) { this.x.kill(); this.x = null; } };

  function stageChaos(st) { return st <= 4 ? 54.5 : st <= 7 ? 54.8 : 55; }
  function stageSub(st) { return st >= 9 ? 27.5 : 36; }

  function makeBeds() {
    const divine = () => N.divine, amb = () => N.bus.amb.in, mus = () => N.bus.mus.in;
    // 渊的底鸣：走音的 54.5 与真 A 55 相拍，36Hz 与之不谐；随日子调准
    beds.drone = new Bed((v, out) => {
      const st = W.stage | 0, ch0 = stageChaos(st), tuned = ch0 === 55;
      const lp = v.f('lowpass', 170, 0.8), am = v.g(1);
      v.lfo(0.05, 0.28, am.gain);
      const chaos = v.o(PW.drone, ch0), truth = v.o(PW.soft, 55), sub = v.o(PW.soft, stageSub(st));
      const gc = v.g(0.5), gt = v.g(0.34), gs = v.g(0.55);
      chaos.connect(gc); truth.connect(gt); sub.connect(gs);
      gc.connect(lp); gt.connect(lp); gs.connect(lp);
      lp.connect(am); am.connect(out);
      // 泛音层（2、3、4、6、8 次）：同样走音、同样被调准。第 n 泛音的拍频是 n×0.5Hz——
      // 混沌在高处滚得更快；手机与笔记本的小喇叭也由它听见这声底鸣
      const oc = v.o(PW.over, ch0), ot = v.o(PW.over, 55), goc = v.g(1), got = v.g(0.8);
      const olp = v.f('lowpass', 520, 0.5), og = v.g(0.3);
      oc.connect(goc); ot.connect(got); goc.connect(olp); got.connect(olp); olp.connect(og); og.connect(am);
      v.c.chaos = ctl(chaos.frequency, ch0); v.c.ochaos = ctl(oc.frequency, ch0);
      v.c.sub = ctl(sub.frequency, stageSub(st)); v.c.lp = ctl(lp.frequency, 170); v.c.olp = ctl(olp.frequency, 520);
      // 调准之后，走音的声部与真 A 合而为一：参照的 55Hz 淡出（免得两个同频声部相位相消）
      v.c.truth = ctl(gt.gain, 0.34); v.c.otruth = ctl(got.gain, 0.8);
      if (tuned) { gt.gain.value = 0; v.c.truth.v = 0; got.gain.value = 0; v.c.otruth.v = 0; }
    }, divine);
    // 光垫：A3 + E4，成对微失谐，左右展开；第四日起低通随日升落
    beds.light = new Bed((v, out) => {
      const lp = v.f('lowpass', 1500, 0.5), am = v.g(1);
      v.lfo(0.07, 0.3, am.gain);
      [[F.A3, -3, -0.35, 0.5], [F.A3, 3.5, 0.35, 0.5], [F.E4, -2.5, 0.25, 0.36], [F.E4, 3, -0.25, 0.36]].forEach(([f, d, p, g]) => {
        const o = v.o(PW.soft, f); o.detune.value = d;
        const og = v.g(g), pn = v.p(p);
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(am); am.connect(out);
      v.c.lp = ctl(lp.frequency, 1500);
    }, divine);
    // 空气：B3，淡淡的高处气声；上层之水：350Hz 带通噪声，0.2Hz 起伏
    beds.air = new Bed((v, out) => {
      const b = v.o(PW.soft, F.B3), gb = v.g(0.55), pb = v.p(-0.2);
      b.connect(gb); gb.connect(pb); pb.connect(out);
      const n = v.nzd('pink'), bp = v.f('bandpass', 350, 1.2), am = v.g(0.6), gn = v.g(1.6);
      v.lfo(0.2, 0.3, am.gain); v.nlfo(0.004, 0.35, am.gain);
      n.connect(bp); bp.connect(am); am.connect(gn); gn.connect(out);
      const h = v.nzd('white'), hp = v.f('highpass', 5200, 0.5), gh = v.g(0.035);
      v.nlfo(0.002, 0.03, gh.gain);
      h.connect(hp); hp.connect(gh); gh.connect(out);
    }, divine);
    // 地：C#3——大三度进入，和声有了根基
    beds.earth = new Bed((v, out) => {
      const o = v.o(PW.soft, F.Cs3), lp = v.f('lowpass', 700, 0.5), am = v.g(1), pn = v.p(0.3);
      v.lfo(0.09, 0.25, am.gain);
      o.connect(lp); lp.connect(am); am.connect(pn); pn.connect(out);
    }, divine);
    // 人：A3 + C#4 的双音（形像），F#4 淡淡地
    beds.human = new Bed((v, out) => {
      const am = v.g(1);
      v.lfo(0.11, 0.3, am.gain);
      [[F.A3, 'sine', 0.55, -0.15], [F.Cs4, 'sine', 0.42, 0.15], [F.Cs4, 'triangle', 0.1, 0.15], [F.Fs4, 'sine', 0.18, 0.4]].forEach(([f, ty, g, p]) => {
        const o = v.o(ty, f); o.detune.value = rnd(-2, 2);
        const og = v.g(g), pn = v.p(p);
        o.connect(og); og.connect(pn); pn.connect(am);
      });
      am.connect(out);
    }, divine);
    // 安息的日落：一缕完整的「甚好」和弦
    // 重心在中高声部（金色的那一半），低音只作根基——海与风会盖住低处
    beds.sunset = new Bed((v, out) => {
      const lp = v.f('lowpass', 1800, 0.5);
      const G = [0.22, 0.2, 0.34, 0.34, 0.34, 0.3, 0.32, 0.3, 0.26, 0.24];
      [F.A1, F.E2, F.A2, F.Cs3, F.E3, F.B3, F.Cs4, F.E4, F.Fs4, F.A4].forEach((f, i) => {
        const o = v.o(i < 5 ? 'sine' : 'triangle', f); o.detune.value = rnd(-3, 3);
        const og = v.g(G[i]), pn = v.p(((i % 2) ? 1 : -1) * (0.1 + 0.06 * i));
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      const am = v.g(1);
      v.lfo(0.06, 0.25, am.gain);
      lp.connect(am); am.connect(out);
    }, mus);
    // 海：浪身（粉红噪声低通，缓涌）+ 浪沫（带通嘶声，随涌起伏）
    // 浪：一道慢涌（正弦，约 14 秒）加上不规则的起伏（放慢的褐噪声）——海从不按拍子呼吸
    beds.water = new Bed((v, out) => {
      const pn = v.p(0);
      const n1 = v.nzd('pink'), lp = v.f('lowpass', 480, 0.6), sw = v.g(0.72), body = v.g(1);
      v.lfo(0.071, 0.2, sw.gain); v.nlfo(0.0016, 0.55, sw.gain);
      n1.connect(lp); lp.connect(sw); sw.connect(body); body.connect(pn);
      const n2 = v.nzd('white'), bp = v.f('bandpass', 2300, 0.6), fo = v.g(0.35), foam = v.g(0.3);
      v.lfo(0.071, 0.2, fo.gain); v.nlfo(0.0016, 0.4, fo.gain); v.nlfo(0.012, 0.16, fo.gain);
      n2.connect(bp); bp.connect(fo); fo.connect(foam); foam.connect(pn);
      pn.connect(out);
      v.c.foam = ctl(foam.gain, 0.3); v.c.lp = ctl(lp.frequency, 480);
      if (hasPan) v.c.pan = ctl(pn.pan, 0);
    }, amb);
    // 灵在水面上运行：随灵的速度而起的水声
    beds.stir = new Bed((v, out) => {
      const n = v.nzd('white'), bp = v.f('bandpass', 620, 0.7), pn = v.p(0), ch = v.g(0.8);
      v.nlfo(0.03, 0.45, ch.gain);                         // 水被搅动：一阵一阵，不是一条平平的嘶声
      n.connect(bp); bp.connect(ch); ch.connect(pn); pn.connect(out);
      if (hasPan) v.c.pan = ctl(pn.pan, 0);
      v.c.f = ctl(bp.frequency, 620);
    }, amb);
    // 风：带通噪声，中心随阵风移动，声像随风向；自身也有一阵一阵的起伏
    beds.wind = new Bed((v, out) => {
      const n = v.nzd('pink'), bp = v.f('bandpass', 400, 0.9), pn = v.p(0), gust = v.g(0.8);
      v.nlfo(0.0035, 0.5, gust.gain);
      n.connect(bp); bp.connect(gust);
      const n2 = v.nzd('white'), wh = v.f('bandpass', 900, 9), gw = v.g(0.06);
      n2.connect(wh); wh.connect(gw); gw.connect(gust);
      gust.connect(pn); pn.connect(out);
      v.c.f = ctl(bp.frequency, 400); v.c.wf = ctl(wh.frequency, 900);
      if (hasPan) v.c.pan = ctl(pn.pan, 0);
    }, amb);
    // 叶的沙沙：高频噪声经"稀疏的随机起伏"开合——一簇一簇的沙、沙沙，而不是一条嘶声（陆地在右）
    beds.leaves = new Bed((v, out) => {
      const n = v.nzd('white'), bp = v.f('bandpass', 3600, 0.55), hp = v.f('highpass', 1400, 0.6), pn = v.p(0.45);
      n.connect(bp); bp.connect(hp);
      const vca = v.g(0), m = v.nz('brown', 0.13), sh = v.ws(sparseCurve());
      m.connect(sh); sh.connect(vca.gain);                 // 颗粒：约 20Hz 带宽的随机起伏，只取其峰
      const body = v.g(0.12), gust = v.g(0.72);
      v.nlfo(0.0025, 0.55, gust.gain);                     // 阵风：十几秒一涌
      hp.connect(vca); hp.connect(body);
      vca.connect(gust); body.connect(gust); gust.connect(pn); pn.connect(out);
    }, amb);
    // 夜虫：4.2kHz 正弦，每 0.6s 一组三个 30Hz 脉冲
    beds.crickets = new Bed((v, out) => {
      v.cr = [[4200, 0.6, -0.1], [4580, 0.66, 0.55], [3920, 0.71, 0.25]].map(([f, per, p]) => {
        const o = v.o('sine', f), g = v.g(0), pn = v.p(p);
        o.connect(g); g.connect(pn); pn.connect(out);
        return { g, per, next: 0, amp: rnd(0.7, 1) };
      });
    }, amb);
  }

  function scheduleCrickets(v, t) {
    const hz = Math.max(0.35, tickDt + 0.25);             // 帧率很低时也不断拍
    for (const c of v.cr) {
      if (c.next < t) c.next = t + Math.random() * c.per;
      while (c.next < t + hz) {
        const t0 = c.next;
        if (Math.random() < 0.9) {
          for (let k = 0; k < 3; k++) {
            const tk = t0 + k / 30;
            c.g.gain.setValueAtTime(0, tk);
            c.g.gain.linearRampToValueAtTime(c.amp, tk + 0.005);
            c.g.gain.linearRampToValueAtTime(0, tk + 0.019);
          }
        }
        c.next += c.per * rnd(0.95, 1.05) + (Math.random() < 0.04 ? rnd(1, 3.5) : 0);
      }
    }
  }

  // ── 缓冲：噪声（白 / 粉红 / 褐）与混响的脉冲响应 ────────
  // 快速的 xorshift 随机数（生成缓冲时比 Math.random 快得多）
  let seed = (Math.random() * 4294967295) >>> 0 || 1;
  function nrand() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 2147483648 - 1; }
  // 起初备一段短的（手势里要快）；稍后在后台换成长的（互不成整数倍），声床的循环便听不出
  const NOISE_SEC = { white: 1.7, pink: 2.6, brown: 2.1 };
  const LONG_SEC = { white: 4.3, pink: 5.9, brown: 3.7 };
  function fillNoise(buf, ch, kind) {
    const len = buf.length, M = Math.floor(buf.sampleRate * 0.05);
    const x = new Float32Array(len + M);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, br = 0;
    for (let i = 0; i < len + M; i++) {
      const w = nrand();
      if (kind === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        x[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362; b6 = w * 0.115926;
      } else if (kind === 'brown') {
        br = (br + 0.02 * w) / 1.02; x[i] = br;
      } else x[i] = w;
    }
    // 首尾等功率交叠：循环无缝
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = x[i];
    for (let i = 0; i < M; i++) { const k = i / M; d[i] = x[i] * Math.sqrt(k) + x[len + i] * Math.sqrt(1 - k); }
    let mean = 0; for (let i = 0; i < len; i++) mean += d[i]; mean /= len;
    let ss = 0; for (let i = 0; i < len; i++) { d[i] -= mean; ss += d[i] * d[i]; }
    const k = 0.3 / Math.max(1e-6, Math.sqrt(ss / len));
    for (let i = 0; i < len; i++) d[i] *= k;
  }
  function noiseBuffer(kind, sec) {
    const buf = AC.createBuffer(2, Math.floor(AC.sampleRate * (sec || NOISE_SEC[kind] || 2)), AC.sampleRate);
    fillNoise(buf, 0, kind); fillNoise(buf, 1, kind);
    return buf;
  }
  // 后台分片：每片只做一个声道（约 5ms），做完才换上
  function longNoiseSteps(kind) {
    let buf = null;
    return [
      () => { buf = AC.createBuffer(2, Math.floor(AC.sampleRate * LONG_SEC[kind]), AC.sampleRate); fillNoise(buf, 0, kind); },
      () => { if (buf) { fillNoise(buf, 1, kind); NB[kind] = buf; } },
    ];
  }
  function impulse(sec, decay) {
    const rate = AC.sampleRate, len = Math.floor(rate * sec), pre = Math.floor(rate * 0.012);
    const buf = AC.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let lp = 0;
      // 包络 (1-t)^decay 每 64 个采样精确计算一次，其间线性插值
      for (let i0 = pre; i0 < len; i0 += 64) {
        const e0 = Math.pow(1 - i0 / len, decay), i1 = Math.min(len, i0 + 64), e1 = Math.pow(1 - i1 / len, decay);
        for (let i = i0; i < i1; i++) {
          const t = i / len, k = 0.9 - 0.72 * t;           // 尾巴越往后越暗
          lp += k * (nrand() - lp);
          d[i] = lp * (e0 + (e1 - e0) * ((i - i0) / 64));
        }
      }
      // 几道早期反射
      for (let r = 0; r < 7; r++) {
        const at = pre + Math.floor(rate * rnd(0.004, 0.07));
        if (at < len) d[at] += (Math.random() < 0.5 ? -1 : 1) * rnd(0.25, 0.6) * (1 - r / 9);
      }
    }
    return buf;
  }
  function wave(h) {
    if (!AC.createPeriodicWave) return 'triangle';
    const re = new Float32Array(h.length + 1), im = new Float32Array(h.length + 1);
    for (let i = 0; i < h.length; i++) im[i + 1] = h[i];
    return AC.createPeriodicWave(re, im);
  }

  // ── 建立 ────────────────────────────────────────────────
  function build() {
    AC = new Ctx();
    hasPan = typeof AC.createStereoPanner === 'function';
    NB = { white: noiseBuffer('white'), brown: noiseBuffer('brown') };
    PW = {
      soft: wave([1, 0.25, 0.1, 0.05, 0.025]),
      drone: wave([1, 0.55, 0.25, 0.12, 0.06]),
      warm: wave([1, 0.5, 0.3, 0.2, 0.12, 0.07]),
      reed: wave([1, 0.7, 0.5, 0.36, 0.27, 0.2, 0.15, 0.11, 0.08, 0.06]),
      over: wave([0, 0.5, 0.42, 0.36, 0, 0.2, 0, 0.11]),        // 只有 2、3、4、6、8 次泛音（避开不谐的 5、7）
      voice: wave([1, 0.46, 0.3, 0.17, 0.1, 0.06, 0.035]),      // 灵的哼鸣：有身躯的 A3，小喇叭也听得见
      grit: wave([1, 0.62, 0.45, 0.33, 0.25, 0.19, 0.14, 0.1, 0.07, 0.05]), // 低吼（经低通随充盈打开）
      ratchet: wave([1, 0.45, 0.25, 0.14, 0.07]),                // 只有五个谐波的锯齿（作 LFO 用：无跳变）
    };
    const sum = gain(1);
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 6; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    const master = gain(0.55);
    const lim = AC.createDynamicsCompressor();
    lim.threshold.value = -3; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0.002; lim.release.value = 0.12;
    const out = gain(muted || hidden ? 0 : 1);
    sum.connect(comp); comp.connect(master); master.connect(lim); lim.connect(out); out.connect(AC.destination);
    const revIn = gain(1), conv = AC.createConvolver(), revOut = gain(0.5);
    revIn.connect(conv); conv.connect(revOut); revOut.connect(sum);
    const mkBus = send => {
      const inp = gain(1), duck = gain(1), s = gain(send);
      inp.connect(duck); duck.connect(sum); duck.connect(s); s.connect(revIn);
      return { in: inp, duck, send: s };
    };
    N = { sum, comp, master, lim, out, revIn, conv, revOut, bus: { amb: mkBus(0.2), mus: mkBus(0.5), rit: mkBus(0.28), evt: mkBus(0.42) } };
    N.divine = gain(1); N.divine.connect(N.bus.mus.in);
    C.duckA = ctl(N.bus.amb.duck.gain, 1); C.duckM = ctl(N.bus.mus.duck.gain, 1);
    C.rev = ctl(revOut.gain, 0.5);
    C.out = ctl(out.gain, muted || hidden ? 0 : 1);
    makeBeds();
    const t = T();
    for (const k of ['pluck', 'star', 'whale', 'moo', 'bleat', 'theme', 'themeCheck', 'song']) nx[k] = t + rnd(3, 10);
    nx.whale = t + rnd(20, 50); nx.theme = t + 20;
    lastStage = W.stage | 0;
    // 其余的缓冲在手势之后分几步于后台备好，免得第一次按下时卡顿
    const later = [].concat(
      NB.pink ? [] : longNoiseSteps('pink'),
      [() => { N.conv.buffer = impulse(2.8, 3.5); }],
      longNoiseSteps('white'),
      longNoiseSteps('brown'),
    );
    const step = () => { const f = later.shift(); if (!f) return; try { f(); } catch (e) { err('build', e); } setTimeout(step, 45); };
    setTimeout(step, 60);
  }

  function resume() {
    if (!AC || AC.state === 'running' || AC.state === 'closed') return;
    resumeAt = performance.now();
    try { const p = AC.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* */ }
  }
  // iOS：在手势里放一个无声的缓冲，解开声音
  function unlock() {
    if (!AC || unlocked) return;
    try {
      const b = AC.createBuffer(1, 1, 22050), s = AC.createBufferSource();
      s.buffer = b; s.connect(AC.destination); s.start(0);
      s.onended = () => { try { s.disconnect(); } catch (e) { /* */ } };
      unlocked = AC.state === 'running';
    } catch (e) { /* */ }
  }
  function hookGestures() {
    if (gestureHooked) return;
    gestureHooked = true;
    const f = () => { if (AC && AC.state !== 'running' && !muted && !hidden) { resume(); unlock(); } };
    ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'].forEach(ev => {
      try { window.addEventListener(ev, f, { capture: true, passive: true }); } catch (e) { /* */ }
    });
  }
  function applyOut() {
    if (!AC) return;
    const off = muted || hidden;
    set(C.out, off ? 0 : 1, off ? 0.03 : 0.3);
    clearTimeout(suspT);
    if (off) suspT = setTimeout(() => { if ((muted || hidden) && AC.state === 'running') { try { AC.suspend().catch(() => {}); } catch (e) { /* */ } } }, 700);
    else resume();
  }

  // ── 每 0.1 秒：世界驱动的声床与生成的音乐 ──────────────
  function tick(dt) {
    const t = T(), lv = W.lv, st = W.stage | 0, nst = NST();
    const night = W.night || 0, dayF = W.dayFactor == null ? 1 : W.dayFactor;
    const holding = !!(W.ritual && W.ritual.holding);
    if (st !== lastStage) { if (st !== nst - 1) breathN = 0; lastStage = st; }
    const hk = hold ? hold.kind : '';
    bedBuilt = false;

    // 造物主之声：七息里渐渐退去，安息之后（约 20 秒）永远止息；声床随之拆除
    const div = st >= nst ? 0 : st === nst - 1 ? Math.max(0.3, 1 - 0.1 * breathN) : 1;
    if (divNow < 0) divNow = div;
    divNow += (div - divNow) * (1 - Math.exp(-dt / (st >= nst ? 6 : 2)));
    if (divNow < 0.002 && div === 0) divNow = 0;
    const thin = st >= nst - 1 ? 0.3 : 1;                 // 圣日之后：和声变薄
    const deepDuck = hk === 'human' || hk === 'behold' || hk === 'holy';
    // 卷与卷之间落下幕布时，世界的声音也随之低下去
    const curtain = clamp((lv.curtain || 0), 0, 1);
    const duck = (holding ? (deepDuck ? 0.4 : 0.7) : 1) * (1 - 0.6 * curtain);
    set(C.duckA, duck, holding ? 0.35 : 1.4);
    set(C.duckM, (holding && deepDuck ? 0.5 : 1) * (1 - 0.5 * curtain), holding ? 0.5 : 1.6);
    set(C.rev, 0.5 + 0.5 * (lv.vault || 0), 2.5);      // 穹苍张开，空间变大

    // 底鸣
    const d = beds.drone.want(lv.deep * LV.drone * divNow, st >= nst ? 0.3 : 2);
    if (d) {
      const ch = stageChaos(st), tuned = ch === 55;
      set(d.c.chaos, ch, 3); set(d.c.ochaos, ch, 3); set(d.c.sub, stageSub(st), 2.7);
      set(d.c.lp, lerp(170, 95, night), 2); set(d.c.olp, lerp(520, 300, night), 2);
      set(d.c.truth, tuned ? 0 : 0.34, 5); set(d.c.otruth, tuned ? 0 : 0.8, 5);
    }
    // 光垫（第四日起低通随日：夜 600Hz，正午 2400Hz）
    const lp = beds.light.want(lv.light * LV.light * (1 - 0.3 * night) * divNow, st >= nst ? 0.3 : 2);
    if (lp) set(lp.c.lp, lerp(1500, lerp(600, 2400, dayF), lv.lights || 0), 2);
    beds.air.want((lv.vault || 0) * LV.air * thin * divNow, 3);
    beds.earth.want((lv.land || 0) * LV.earth * thin * divNow, 3);
    beds.human.want((W.popN('human') > 0 ? 1 : 0) * LV.human * thin * divNow, 4);
    // 安息的世界（七日之后的自由时辰，及全书终了之后）：日落时一缕「甚好」
    const eve = st >= nst && W.freeClock ? (W.dusk || 0) * smoothstep(0.55, 0.62, W.tod || 0) : 0;
    beds.sunset.want(eve * LV.sunset, 3);

    // 海
    const w = beds.water.want(lv.deep * LV.water * (1 - 0.45 * night), 2);
    if (w) {
      set(w.c.foam, 0.3 + 0.7 * (lv.land || 0) + 0.2 * Math.abs(W.wind || 0), 2);
      set(w.c.lp, 480 + 200 * (lv.land || 0), 3);
      if (w.c.pan) set(w.c.pan, -0.35 * (lv.land || 0), 3);
    }
    const sp = W.spirit;
    const over = sp && sp.y > W.horizonY && W.isSea(sp.x, sp.y) ? 1 : 0;
    const stir = lv.deep * over * clamp(((sp && sp.speed) || 0) / 700, 0, 1);
    const s = beds.stir.want(stir * LV.stir, stir > 0.02 ? 0.12 : 0.5);
    if (s) { if (s.c.pan) set(s.c.pan, panX(sp.x), 0.15); set(s.c.f, 520 + 500 * W.seaDepth(sp.y), 0.3); }
    // 风
    const gust = Math.min(1, Math.abs(W.wind || 0));
    const wd = beds.wind.want((lv.vault || 0) * LV.wind * (0.12 + 0.88 * Math.pow(gust, 1.6)) * (1 - 0.4 * night), 0.8);
    if (wd) { set(wd.c.f, 280 + 700 * gust, 0.8); set(wd.c.wf, 700 + 900 * gust, 0.8); if (wd.c.pan) set(wd.c.pan, clamp(W.wind || 0, -1, 1) * 0.6, 1); }
    // 叶
    const leaf = (lv.trees || 0) * (0.25 + 0.75 * gust) * LV.leaves;
    beds.leaves.want(leaf, 1.2);
    // 夜虫（言说时也安静下来）
    const cr = beds.crickets.want(W.popN('creeper') > 0 ? smoothstep(0.35, 0.8, night) * LV.cricket * (holding ? 0.15 : 1) : 0, 1.5);
    if (cr) scheduleCrickets(cr, t);

    generate(dt, t, st, nst, night, dayF, holding);
  }

  // 生成的事件：大地的拨弦、星的轻鸣、鸟、鲸、气泡、啃草、远处的牛羊、人的主题
  function generate(dt, t, st, nst, night, dayF, holding) {
    const lv = W.lv, calm = holding ? 0.1 : 1, q = W.quality < 0.75 ? 0.6 : 1;
    const rested = st >= nst;
    const day = smoothstep(0.35, 0.8, dayF) * (1 - night);
    // 地的拨弦（第三日起，每 6–14 秒一个五声音）
    if (t >= nx.pluck) {
      nx.pluck = t + (rested ? rnd(9, 20) : rnd(6, 14));
      if ((lv.grass || 0) > 0.5 && !holding) pluck(pent(F.A3, rint(0, 8)), rnd(0, 0.1), LV.pluck * (0.6 + 0.4 * day), rnd(0.05, 0.75), 0.9, 'amb');
    }
    // 星的轻鸣（夜里，每 2–5 秒）
    if (t >= nx.star) {
      nx.star = t + rnd(2, 5);
      if ((lv.stars || 0) > 0.5 && night > 0.45 && !holding) ping(pent(F.A5, rint(0, 7)), rnd(0, 0.1), LV.star * night, rnd(-0.8, 0.8), 'amb');
    }
    // 鸟：白日与黎明的合唱
    const nB = W.popN('bird');
    if (nB > 0) {
      const tod = W.tod || 0;
      const chorus = 1 + 1.8 * Math.exp(-Math.pow((tod - 0.28) / 0.045, 2)) + 0.7 * Math.exp(-Math.pow((tod - 0.7) / 0.05, 2));
      const act = day * chorus * calm * q;
      const rate = Math.min(1, nB / 40) * 0.75 * act;
      if (Math.random() < rate * dt) birdPhrase(rnd(0, 0.1), rnd(-0.85, 0.85), LV.bird * rnd(0.5, 1));
      if (Math.random() < 0.05 * act * dt) gull(rnd(0, 0.1), rnd(-0.9, -0.3), LV.bird * 1.2);
      if (Math.random() < 0.025 * act * dt) dove(rnd(0, 0.1), rnd(0.2, 0.8), LV.bird * 1.6);
    }
    // 鲸歌：夜里每 60–120 秒（海若已自己唱起——'whale' 事件——便由它唱）
    if (t >= nx.whale) {
      nx.whale = t + rnd(60, 120);
      if (W.popN('whale') > 0 && night > 0.5 && !holding && t - (nx.busSong || -1e9) > 90) { whaleSong(0, rnd(-0.8, -0.2), LV.whale); nx.song = t + 20; }
    }
    // 气泡
    if ((lv.life || 0) > 0.3 && Math.random() < 0.3 * lv.life * calm * q * dt) bubble(rnd(0, 0.1), rnd(-0.85, -0.1), LV.bubble);
    // 牲畜：白日里啃草的轻响，远处偶尔的牛羊
    const nC = W.popN('cattle');
    if (nC > 0 && day > 0.4) {
      if (Math.random() < 0.35 * calm * q * dt) {
        const p = rnd(0.25, 0.8), k = rint(2, 4), at = rnd(0, 0.1);
        for (let i = 0; i < k; i++) burst({ buf: 'white', f: rnd(2200, 3400), q: 1.5, g: LV.graze * rnd(0.6, 1), a: 0.002, d: 0.03, at: at + i * rnd(0.12, 0.2), pan: p, bus: 'amb', prio: 0 });
      }
      if (t >= nx.moo) { nx.moo = t + rnd(40, 100); if (!holding) cow(0, rnd(0.2, 0.8), LV.herd, true); }
      if (t >= nx.bleat) { nx.bleat = t + rnd(50, 120); if (!holding) sheep(0, rnd(0.2, 0.8), LV.herd * 0.7, true); }
    }
    // 灵经过人身边时，人的主题轻轻哼起
    if (t >= nx.themeCheck) {
      nx.themeCheck = t + 0.5;
      if (t >= nx.theme && W.popN('human') > 0 && !holding && GS.beasts && GS.beasts.pick) {
        const sp = W.spirit, p = GS.beasts.pick(sp.x, sp.y, 90 * Math.max(0.6, W.unit || 1));
        if (p && p.label === '人' && sp.speed < 400) { humanTheme(0, LV.theme, 'amb'); nx.theme = t + 40; }
      }
    }
  }

  // ── 言说之声 ────────────────────────────────────────────
  // 每种按住的声音：build(h) 建立节点，返回 set(c)；充盈度只推动音量与滤波
  // 地鸣：褐噪声低通 f0→f1 + 一层中频的"身躯"（粉红噪声 240→520Hz 带通）——
  // 耳机里是大地的低吼，手机与笔记本的小喇叭上也听得见它在滚动；起伏是不规则的（放慢的褐噪声）
  function rumble(h, f0, f1, k, mid) {
    const n = h.nz('brown'), lp = h.f('lowpass', f0, 0.9), roll = h.g(1), g = h.g(0);
    h.lfo(0.23, 0.2, roll.gain); h.nlfo(0.018, 0.45, roll.gain);
    n.connect(lp); lp.connect(roll); roll.connect(g); g.connect(h.out);
    const m = h.nz('pink'), bp = h.f('bandpass', 240, 0.9), gm = h.g(mid == null ? 0.42 : mid);
    m.connect(bp); bp.connect(gm); gm.connect(roll);
    return c => {
      const e = Math.pow(c, 1.5);
      to(lp.frequency, f0 + (f1 - f0) * c, 0.1); to(bp.frequency, 240 + 280 * c, 0.15); to(g.gain, k * e, 0.1);
    };
  }
  // 碎裂声：一个噪声源 + 排程的颗粒（泊松分布）——石的碎裂、土的崩落；返回 (每秒颗数, 响度) => 排程
  function crackler(h, f0, f1, q, pan) {
    const n = h.nz('white'), bp = h.f('bandpass', (f0 + f1) / 2, q), g = h.g(0), pn = h.p(pan || 0);
    n.connect(bp); bp.connect(g); g.connect(pn); pn.connect(h.out);
    let next = T() + 0.05;
    return (rate, amp) => {
      const t = T(), hz = t + 0.25;
      if (next < t) next = t + 0.01;
      if (!(rate > 0.05) || !(amp > 0)) { next = Math.max(next, t + 0.05); return; }
      while (next < hz) {
        bp.frequency.setValueAtTime(rnd(f0, f1), next);
        if (pn.pan) pn.pan.setValueAtTime(clamp((pan || 0) + rnd(-0.7, 0.7), -1, 1), next);
        g.gain.setValueAtTime(0, next);
        g.gain.linearRampToValueAtTime(amp * rnd(0.25, 1), next + 0.0025);
        g.gain.setTargetAtTime(0, next + 0.0025, rnd(0.006, 0.03));
        next += Math.max(0.012, -Math.log(1 - Math.random()) / rate);
      }
    };
  }
  function tone(h, type, f, pan) {
    const o = h.o(type, f), g = h.g(0);
    o.connect(g);
    if (pan && hasPan) { const p = h.p(pan); g.connect(p); p.connect(h.out); } else g.connect(h.out);
    return g;
  }
  function heartbeats(h, hearts) {
    h.hb = hearts.map(x => Object.assign({ next: T() + 0.25 + (x.off || 0) }, x));
    return (c, bpmOf) => {
      const t = T();
      for (const hb of h.hb) {
        if (hb.next < t) hb.next = t + 0.05;
        while (hb.next < t + 0.3) {
          const lvl = hb.g * (0.3 + 0.7 * c);
          thump(hb.next - t, hb.f, lvl, h.out);
          thump(hb.next - t + 0.25, hb.f * 0.9, lvl * 0.7, h.out);
          hb.next += (60 / bpmOf(c)) * (hb.mul || 1);
        }
      }
    };
  }
  const HOLD = {
    // 起初：只有一口气——白噪声经低通 200→900Hz，与 A0 的低吟
    breath(h) {
      const n = h.nz('white'), lp = h.f('lowpass', 200, 0.7), am = h.g(1), g = h.g(0);
      h.lfo(0.22, 0.35, am.gain);
      n.connect(lp); lp.connect(am); am.connect(g); g.connect(h.out);
      const s = tone(h, PW.soft, F.A0), s2 = tone(h, 'sine', F.A1);
      return c => { to(lp.frequency, 200 + 700 * c, 0.08); to(g.gain, 0.26 * c * c, 0.08); to(s.gain, 0.15 * c, 0.15); to(s2.gain, 0.06 * c, 0.15); };
    },
    // 第一日：雷声般的地鸣与 55Hz 的低吼（富泛音的 A1 经低通，随充盈 140→480Hz 打开：越说越沉，不越高）
    thunder(h) {
      const r = rumble(h, 60, 220, 0.46);
      const o = h.o(PW.grit, F.A1), lp = h.f('lowpass', 140, 0.7), hum = h.g(0);
      o.connect(lp); lp.connect(hum); hum.connect(h.out);
      return c => { r(c); to(lp.frequency, 140 + 340 * c, 0.12); to(hum.gain, 0.085 * Math.pow(c, 1.5), 0.1); };
    },
    // 第二日：地鸣变轻，风升起（带通 200→1200Hz）
    wind(h) {
      const r = rumble(h, 50, 140, 0.3, 0.3);
      const n = h.nz('pink'), bp = h.f('bandpass', 200, 1.5), gust = h.g(1), g = h.g(0), pn = h.p(0);
      h.lfo(0.31, 0.35, gust.gain);
      if (hasPan) h.lfo(0.09, 0.6, pn.pan);
      n.connect(bp); bp.connect(gust); gust.connect(g); g.connect(pn); pn.connect(h.out);
      return c => { r(c); to(bp.frequency, 200 + 1000 * c, 0.1); to(g.gain, 0.55 * c, 0.1); };
    },
    // 第三日：地壳的研磨（低通 40→120Hz + A0 + 带通的碾磨）
    // 研磨：170Hz 的碾磨与 480Hz 的刮擦（同一个锯齿起伏），石的碎裂随充盈越来越密
    grind(h, k) {
      k = k || 1;
      const r = rumble(h, 40, 120, 0.54 * k, 0.36), a0 = tone(h, PW.soft, F.A0);
      const n = h.nz('pink'), bp = h.f('bandpass', 170, 3), bp2 = h.f('bandpass', 480, 1.6), am = h.g(0.5), g = h.g(0), g2 = h.g(0.45);
      h.lfo(5.3, 0.45, am.gain, PW.ratchet); h.nlfo(0.03, 0.4, am.gain);   // 软锯齿：有棘轮般的碾动，却没有竖直的跳变
      n.connect(bp); bp.connect(am); n.connect(bp2); bp2.connect(g2); g2.connect(am); am.connect(g); g.connect(h.out);
      const cr = crackler(h, 900, 3400, 1.4, 0.15);
      return c => {
        r(c); to(a0.gain, 0.12 * c * k, 0.1); to(g.gain, 0.66 * Math.pow(c, 1.5) * k, 0.1); to(bp.frequency, 140 + 90 * c, 0.2);
        cr(3 + 22 * c * c * k, 0.34 * c * k);
      };
    },
    names3(h) { return HOLD.grind(h, 0.55); },
    // 草：研磨柔化为沙沙（粉红噪声 3kHz 带通）与低低的嗡声
    rustle(h, woody) {
      const r = rumble(h, 50, 90, 0.25, 0.25);
      const n = h.nz('pink'), bp = h.f('bandpass', 2000, 0.8), fl = h.g(0.7), g = h.g(0), pn = h.p(0.3);
      h.lfo(7.7, 0.18, fl.gain); h.lfo(11.3, 0.12, fl.gain); h.lfo(0.4, 0.15, fl.gain);
      n.connect(bp); bp.connect(fl); fl.connect(g); g.connect(pn); pn.connect(h.out);
      const hum = tone(h, PW.soft, F.A1);
      let wg = null, wlp = null;
      if (woody) {
        wlp = h.f('lowpass', 200, 1.2); wg = h.g(0);
        const o1 = h.o('triangle', F.A2), o2 = h.o('triangle', F.E3);
        o1.connect(wlp); o2.connect(wlp); wlp.connect(wg); wg.connect(h.out);
      }
      return c => {
        r(c); to(bp.frequency, 2000 + 1500 * c, 0.15); to(g.gain, 0.55 * c, 0.1); to(hum.gain, 0.08 * c, 0.15);
        if (wg) { to(wlp.frequency, 200 + 700 * c, 0.15); to(wg.gain, 0.05 * c, 0.15); }
      };
    },
    growth(h) { return HOLD.rustle(h, true); },
    // 第四日：无声的光——A 的六个分音随充盈度渐次亮起，各自缓缓漂移
    shimmer(h) {
      const G = [0.085, 0.068, 0.058, 0.048, 0.037, 0.03];
      const gs = G.map((_, i) => {
        const o = h.o('sine', F.A3 * (i + 1)); o.detune.value = rnd(-4, 4);
        const am = h.g(0.8), g = h.g(0), pn = h.p((i % 2 ? 1 : -1) * 0.12 * (i + 1));
        h.lfo(rnd(0.1, 0.3), 0.3, am.gain);
        o.connect(am); am.connect(g); g.connect(pn); pn.connect(h.out);
        return g;
      });
      return c => gs.forEach((g, i) => to(g.gain, G[i] * smoothstep(i / 10, i / 10 + 0.45, c), 0.12));
    },
    // 月：清冷的微光 C#5 E5 A5 与潮的起伏
    moon(h) {
      const fs = [F.Cs5, F.E5, F.A5], G = [0.026, 0.022, 0.015];
      const gs = fs.map((f, i) => { const g = tone(h, 'sine', f, (i - 1) * 0.3); return g; });
      const n = h.nz('pink'), lp = h.f('lowpass', 400, 0.7), am = h.g(0.5), g = h.g(0);
      h.lfo(0.1, 0.45, am.gain);
      n.connect(lp); lp.connect(am); am.connect(g); g.connect(h.out);
      return c => { gs.forEach((x, i) => to(x.gain, G[i] * smoothstep(i * 0.15, i * 0.15 + 0.5, c), 0.12)); to(g.gain, 0.3 * c, 0.12); };
    },
    // 众星：高处的低语，随灵移动的快慢起伏
    // 灵在天上每划过一段（与 main 记下星的归宿同一个步长），便有一声星的轻鸣：高低即音高，左右即声像
    stars(h) {
      const n = h.nz('white'), hp = h.f('highpass', 4200, 0.6), g = h.g(0), pn = h.p(0);
      n.connect(hp); hp.connect(g); g.connect(pn); pn.connect(h.out);
      const p1 = tone(h, 'sine', F.A6, -0.3), p2 = tone(h, 'sine', F.E7, 0.3);
      h.lx = null; h.ly = null; h.pts = 0;
      return c => {
        const s = W.spirit;
        const sp = clamp(((s && s.speed) || 0) / 500, 0, 1);
        to(g.gain, 0.24 * c * (0.25 + 0.75 * sp), 0.1);
        if (pn.pan && s) to(pn.pan, panX(s.x), 0.1);
        to(p1.gain, 0.011 * c, 0.2); to(p2.gain, 0.007 * c, 0.2);
        if (s && fin(s.x) && fin(s.y) && s.y < W.horizonY - 10 && h.pts < 40) {
          const step = 26 * Math.max(0.6, W.unit || 1);
          if (h.lx == null || Math.hypot(s.x - h.lx, s.y - h.ly) > step) {
            h.lx = s.x; h.ly = s.y; h.pts++;
            const k = Math.round(clamp(1 - s.y / Math.max(1, W.horizonY), 0, 1) * 10);
            ping(pent(F.A4, k), 0, 0.028 + 0.02 * c, panX(s.x), h.out);
          }
        }
      };
    },
    // 第五日（鱼）：水下听见的地鸣，气泡随充盈度越来越密
    underwater(h) {
      const n = h.nz('brown'), lp = h.f('lowpass', 400, 0.8), g = h.g(0);
      n.connect(lp); lp.connect(g); g.connect(h.out);
      const m = h.nz('pink'), mlp = h.f('lowpass', 650, 0.7), mg = h.g(0), wash = h.g(0.7);
      h.nlfo(0.012, 0.45, wash.gain);                     // 水下听见的、闷住的潮涌
      m.connect(mlp); mlp.connect(wash); wash.connect(mg); mg.connect(h.out);
      h.bub = T();
      return c => {
        to(g.gain, 0.36 * Math.pow(c, 1.5), 0.1); to(mg.gain, 0.2 * Math.pow(c, 1.5), 0.1);
        const t = T(), rate = 1 + 11 * c;
        if (h.bub < t) h.bub = t;
        while (h.bub < t + 0.15) { bubble(h.bub - t, rnd(-0.8, 0.8), 0.03 + 0.03 * c, h.out); h.bub += rnd(0.5, 1.5) / rate; }
      };
    },
    // 第五日（鸟）：风与翅膀的扑动（12–18Hz 调幅）
    flutter(h) {
      const n = h.nz('white'), bp = h.f('bandpass', 1500, 1), am = h.g(0.5), g = h.g(0);
      const l = h.lfo(12, 0.5, am.gain);
      n.connect(bp); bp.connect(am); am.connect(g); g.connect(h.out);
      const w = h.nz('pink'), wb = h.f('bandpass', 600, 1.2), wg = h.g(0);
      w.connect(wb); wb.connect(wg); wg.connect(h.out);
      return c => { to(g.gain, 0.6 * c, 0.1); if (l) to(l.frequency, 12 + 6 * c, 0.2); to(wg.gain, 0.35 * c, 0.1); };
    },
    // 赐福之垫：五个锯齿声部（A2 E3 A3 C#4 E4），±6 音分，经低通
    bless(h) {
      const lp = h.f('lowpass', 600, 0.8), g = h.g(0);
      [F.A2, F.E3, F.A3, F.Cs4, F.E4].forEach((f, i) => [-6, 6].forEach(dc => {
        const o = h.o('sawtooth', f); o.detune.value = dc + rnd(-1.5, 1.5);
        const og = h.g(i < 2 ? 0.8 : 0.6), pn = h.p(dc < 0 ? -0.35 : 0.35);
        o.connect(og); og.connect(pn); pn.connect(lp);
      }));
      lp.connect(g); g.connect(h.out);
      return c => { to(lp.frequency, 600 + 800 * c, 0.15); to(g.gain, 0.07 * c, 0.12); };
    },
    // 第六日（活物）：大地的起伏，底下渐渐有了心跳（50→72bpm）
    heave(h) {
      const r = rumble(h, 40, 100, 0.54, 0.4);
      const hb = heartbeats(h, [{ f: 52, g: 0.3 }]);
      const cr = crackler(h, 500, 1600, 1.2, 0.3);        // 尘土从地里拱起：零星的土粒
      return c => { r(c); hb(c, x => 50 + 22 * x); cr(1 + 8 * c, 0.07 * c); };
    },
    // 造人：世界屏息；灵自己的声音——有身躯的 A3 哼鸣（小喇叭也听得见），带 0.2Hz 的呼吸与一缕气息；
    // 两颗心，约 60bpm，略错开
    human(h) {
      const v1 = h.g(0), sw = h.g(0.85);
      const o = h.o(PW.voice, F.A3), o2 = h.o('sine', F.A2), lp = h.f('lowpass', 1100, 0.6);
      o.detune.value = -2;
      h.lfo(0.2, 0.15, sw.gain);
      const g2 = h.g(0.3);
      o.connect(lp); lp.connect(sw); o2.connect(g2); g2.connect(sw); sw.connect(v1); v1.connect(h.out);
      const n = h.nz('pink'), bp = h.f('bandpass', 850, 0.8), br = h.g(0), ba = h.g(0.5);
      h.lfo(0.2, 0.5, ba.gain);                           // 气息随同一口呼吸起伏
      n.connect(bp); bp.connect(ba); ba.connect(br); br.connect(h.out);
      const hb = heartbeats(h, [{ f: 50, g: 0.27 }, { f: 46, g: 0.18, off: 0.37, mul: 0.97 }]);
      return c => { to(v1.gain, 0.062 * smoothstep(0, 0.35, c), 0.2); to(br.gain, 0.05 * c, 0.2); hb(c, () => 60); };
    },
    // 甚好：每一日的音依次亮起，堆成一个和弦
    behold(h) {
      const fs = [F.A1, F.E2, F.A2, F.Cs3, F.E3, F.B3, F.Cs4, F.E4, F.Fs4, F.A4];
      const G = [0.08, 0.063, 0.054, 0.045, 0.04, 0.027, 0.027, 0.023, 0.02, 0.02];
      const gs = fs.map((f, i) => tone(h, i < 5 ? 'sine' : 'triangle', f, ((i % 2) ? 1 : -1) * (0.08 + 0.06 * i)));
      h.lit = 0;
      return c => {
        const n = Math.min(fs.length, Math.floor(c * 11));
        for (let i = 0; i < fs.length; i++) to(gs[i].gain, i < n ? G[i] : 0, i < n ? 0.4 : 0.2);
        for (let k = h.lit; k < n; k++) ping(fs[k] * (fs[k] < 300 ? 8 : 4), 0, 0.035, ((k % 2) ? 1 : -1) * 0.5, 'rit');
        if (n > h.lit) h.lit = n;
      };
    },
    // 圣日：赐福之垫渐渐变薄，只剩 A；金色的 A4 / A5 亮起
    holy(h) {
      const lp = h.f('lowpass', 1200, 0.7), g = h.g(0);
      const fs = [F.A2, F.E3, F.A3, F.Cs4, F.E4], TH = [null, [0.45, 0.75], null, [0.15, 0.45], [0.3, 0.6]];
      const vs = fs.map((f, i) => {
        const o = h.o('sawtooth', f); o.detune.value = rnd(-5, 5);
        const og = h.g(0.7), pn = h.p((i % 2 ? 1 : -1) * 0.3);
        o.connect(og); og.connect(pn); pn.connect(lp);
        return og;
      });
      lp.connect(g); g.connect(h.out);
      const g1 = tone(h, 'sine', F.A4, -0.1), g2 = tone(h, 'sine', F.A5, 0.1);
      return c => {
        to(lp.frequency, 1200 - 700 * c, 0.2);
        to(g.gain, 0.075 * smoothstep(0, 0.25, c), 0.15);
        vs.forEach((og, i) => { if (TH[i]) to(og.gain, 0.7 * (1 - smoothstep(TH[i][0], TH[i][1], c)), 0.2); });
        to(g1.gain, 0.09 * c * c, 0.2); to(g2.gain, 0.032 * c * c, 0.2);
      };
    },
    // 叠句「有晚上，有早晨」：每浮现一字，敲一声低沉的钟；底下是黄昏的空气
    refrain(h) {
      const n = h.nz('brown'), lp = h.f('lowpass', 260, 0.7), g = h.g(0);
      n.connect(lp); lp.connect(g); g.connect(h.out);
      return c => to(g.gain, 0.2 * c, 0.15);
    },
    // 七日之后：神对人说话——温暖的低音垫随充盈度打开，底下一口气息
    word(h) {
      const lp = h.f('lowpass', 300, 0.7), g = h.g(0);
      [[F.A2, 'sine', 0.8, 0], [F.E3, 'triangle', 0.35, -0.25], [F.A3, 'triangle', 0.25, 0.25]].forEach(([f, ty, gg, p]) => {
        const o = h.o(ty, f); o.detune.value = rnd(-3, 3);
        const og = h.g(gg), pn = h.p(p);
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(g); g.connect(h.out);
      const n = h.nz('pink'), bp = h.f('bandpass', 700, 0.8), am = h.g(0.8), ng = h.g(0);
      h.lfo(0.25, 0.25, am.gain);
      n.connect(bp); bp.connect(am); am.connect(ng); ng.connect(h.out);
      return c => { to(lp.frequency, 300 + 1100 * c, 0.12); to(g.gain, 0.16 * Math.pow(c, 1.2), 0.12); to(ng.gain, 0.18 * c, 0.12); };
    },
    // 安息后的观看：温暖的金色低吟
    sabbath(h) {
      const gs = [[F.A4, 0.035, -0.2], [F.E5, 0.022, 0.2], [F.A5, 0.012, 0]].map(([f, g, p]) => [tone(h, 'sine', f, p), g]);
      const n = h.nz('pink'), lp = h.f('lowpass', 900, 0.7), ng = h.g(0);
      n.connect(lp); lp.connect(ng); ng.connect(h.out);
      return c => { gs.forEach(([x, g]) => to(x.gain, g * c, 0.15)); to(ng.gain, 0.08 * c, 0.15); };
    },
  };

  function holdKindFor(day, kind) {
    switch (kind) {
      case 'first': return 'breath';
      case 'refrain': case 'bless': case 'human': case 'stars': case 'behold': case 'holy': case 'sabbath': return kind;
      case 'rest': return null;
    }
    const idx = W.stage | 0;
    if (idx >= NST()) return 'word';                    // 七日之后各卷的话语
    const byIdx = { 5: 'wind', 6: 'wind', 8: 'grind', 9: 'names3', 10: 'rustle', 11: 'growth', 13: 'shimmer', 14: 'moon', 17: 'underwater', 18: 'flutter', 21: 'heave' };
    const st = GS.story && GS.story.STAGES && GS.story.STAGES[idx];
    if (st && st.day === day && byIdx[idx]) return byIdx[idx];
    return ['breath', 'thunder', 'wind', 'grind', 'shimmer', 'underwater', 'heave', 'sabbath'][clamp(day | 0, 0, 7)];
  }

  function releaseHold(ok) {
    const h = hold;
    if (!h) return;
    hold = null;
    const t = T(), rel = ok ? 0.5 : 0.3;
    const p = h.out.gain;
    // 在此刻"握住"当前的值再放开（淡入未完时松手也不跳变）；不支持的浏览器退而取 .value
    try {
      if (p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(t);
      else { p.cancelScheduledValues(t); p.setValueAtTime(p.value, t); }
    } catch (e) { /* */ }
    p.setTargetAtTime(0, t, rel / 3);
    setTimeout(() => h.kill(), (rel * 2.5 + 0.25) * 1000);
  }

  // ── 成就：每一句话语的和声色彩 ─────────────────────────
  const FUL = {
    // 起初：一声低沉的落下（45→28Hz），然后渊的底鸣缓缓浮起
    0() {
      note({ f: 45, path: [[28, 2.5]], g: 0.32, a: 0.02, d: 3, prio: 2 });
      note({ f: 90, path: [[56, 2.5]], g: 0.1, a: 0.02, d: 2.4, prio: 2 });
      note({ f: 180, path: [[112, 2.5]], g: 0.03, a: 0.03, d: 1.6, prio: 2 });          // 小喇叭上的那一声"咚"
      burst({ buf: 'brown', ft: 'lowpass', f: 300, q: 0.7, g: 0.25, a: 0.05, s: 0.3, r: 2.2, rev: 0.3 });
      // 渊面的一口深水：闷住的水声缓缓合上
      burst({ buf: 'pink', ft: 'lowpass', f: 1100, f2: 260, sweep: 2.8, q: 0.6, g: 0.12, a: 0.12, s: 0.4, r: 2.6, rev: 0.45 });
    },
    // 要有光：A1/E2/A2/E3 和弦，高处的微光，一阵风扫过
    1() {
      chord([F.A1, F.E2, F.A2, F.E3], { gs: [0.17, 0.13, 0.09, 0.06], a: 0.45, s: 0.2, r: 4.5, rev: 0.4 });
      [880, 1320, 1760, 2640].forEach((f, i) => note({ f, det: rnd(-3, 3), g: 0.022, a: 0.3, s: 0.2, r: 5, pan: (i - 1.5) * 0.4, rev: 0.7, prio: 2 }));
      burst({ buf: 'pink', f: 1800, f2: 300, sweep: 1.4, q: 0.8, g: 0.3, a: 0.1, s: 0.3, r: 1.2, pan: -0.5, pan2: 0.5, rev: 0.3 });
    },
    // 光暗分开：220Hz 一分为二，一个升到 440（右），一个降到 110（左）
    2() {
      note({ f: F.A3, path: [[F.A4, 2.2]], g: 0.085, a: 0.25, s: 1.8, r: 2.5, pan: 0.05, pan2: 0.45, rev: 0.5, prio: 2 });
      note({ f: F.A3, path: [[F.A2, 2.2]], g: 0.11, a: 0.25, s: 1.8, r: 2.5, pan: -0.05, pan2: -0.45, rev: 0.5, prio: 2 });
    },
    // 昼夜已立：一口温暖的低音
    3() { chord([F.A1, F.E2], { gs: [0.11, 0.075], a: 1, s: 0.5, r: 3, rev: 0.4 }); },
    // 穹苍：A1 E2 B2——B 作为空气之音进入和声；高处的气声涌起
    5() {
      chord([F.A1, F.E2, F.B2], { gs: [0.12, 0.09, 0.065], a: 1, s: 4, r: 3, rev: 0.5 });
      burst({ buf: 'white', ft: 'highpass', f: 2000, q: 0.5, g: 0.06, a: 2.5, s: 0, r: 2.5, rev: 0.5, pan: -0.3, pan2: 0.3 });
    },
    // 称穹苍为天：高远的空气
    6() {
      burst({ buf: 'pink', f: 900, q: 0.5, g: 0.18, a: 1.2, s: 0.5, r: 2.5, rev: 0.5 });
      note({ f: F.B3, g: 0.05, a: 0.8, s: 1, r: 3, rev: 0.6 });
    },
    // 旱地：研磨的褐噪声涌起，水珠溅落，A1 E2 A2 C#3——C# 进入，和声有了根基
    8() {
      burst({ buf: 'brown', ft: 'lowpass', f: 300, q: 0.9, g: 0.45, a: 1, s: 1, r: 1.5, am: [4.1, 0.3] });
      grains({ buf: 'white', n: 30, dur: 3, f0: 800, f1: 2500, len: 0.06, q: 1.4, g: 0.1, spread: 0.85, at: 0.4, rev: 0.25 });
      chord([F.A1, F.E2, F.A2, F.Cs3], { gs: [0.12, 0.085, 0.065, 0.055], a: 1.2, s: 3, r: 5, at: 2.2, rev: 0.45 });
    },
    // 海 / 地的名字已由 nameChime 奏出；成就本身只是一口潮声
    9() { burst({ buf: 'pink', ft: 'lowpass', f: 500, q: 0.6, g: 0.18, a: 0.8, s: 0.4, r: 2, rev: 0.3, pan: -0.4 }); },
    // 青草：沙沙声随绿色的前锋左→右扫过；五声的拨弦一路攀升，止于 A add9
    10() {
      const sx = GS.W.origin && GS.W.origin.grass ? panX(GS.W.origin.grass.x) : 0.3;
      burst({ buf: 'pink', f: 3000, q: 0.8, g: 0.3, a: 1, s: 2, r: 1.5, pan: sx - 0.5, pan2: 1, rev: 0.25 });
      [F.A3, F.B3, F.Cs4, F.E4, F.Fs4, F.A4, F.B4, F.Cs5, F.E5].forEach((f, i) => pluck(f, 0.3 + i * 0.12, 0.11, clamp(sx - 0.3 + i * 0.1, -0.9, 0.9), 0.5));
      chord([F.A3, F.Cs4, F.E4, F.B4], { type: 'triangle', g: 0.045, a: 0.8, s: 2.5, r: 3, at: 1.4, spread: 0.4, rev: 0.55 });
    },
    // 树木：一棵一棵，木声 300ms 一个，大树低、小树高
    11() {
      const seq = [0, 4, 2, 6, 3, 7, 5, 8];
      const sx = GS.W.origin && GS.W.origin.trees ? panX(GS.W.origin.trees.x) : 0.3;
      seq.forEach((k, i) => wood(pent(F.A2, k), 0.2 + i * 0.3, 0.16, clamp(sx + (i % 2 ? 0.2 : -0.2), -0.9, 0.9)));
    },
    // 光体：分音一齐亮起，然后收拢到 A3+E4+A4；一阵温热的涌起
    13() {
      for (let k = 1; k <= 6; k++) note({ f: F.A3 * k, det: rnd(-4, 4), g: 0.05 / Math.sqrt(k), a: 0.4, s: 0.1, r: 0.7, pan: (k % 2 ? -1 : 1) * 0.1 * k, rev: 0.5, prio: 2 });
      chord([F.A3, F.E4, F.A4], { gs: [0.065, 0.05, 0.036], a: 0.6, s: 5, r: 3, at: 0.5, spread: 0.3, rev: 0.55 });
      burst({ buf: 'brown', ft: 'lowpass', f: 500, q: 0.6, g: 0.25, a: 1.6, s: 0.6, r: 2, rev: 0.3 });
    },
    // 月：玻璃琴般的 E5 + B5，5Hz 的轻颤
    14() {
      note({ f: F.E5, g: 0.1, a: 0.35, d: 6, vib: [5, 0.0017], pan: 0.3, rev: 0.7, prio: 2 });
      note({ f: F.B5, g: 0.06, a: 0.35, d: 6, vib: [5, 0.0017], pan: 0.45, rev: 0.7, prio: 2 });
    },
    // 众星：你画下的星座依次点亮——高低即音高，左右即声像；然后满天的星一齐轻鸣
    15() {
      const pts = (GS.fx && GS.fx.getConstellation && GS.fx.getConstellation()) || [];
      const hz = W.HZ || 0.6;
      pts.slice(0, 24).forEach((p, i) => {
        const k = Math.round(clamp(1 - p[1] / hz, 0, 1) * 10);
        ping(pent(F.A4, k), 3.1 + i * 0.2, 0.07, clamp(p[0] * 2 - 1, -1, 1) * 0.8);
      });
      chord([F.E7, F.A7], { gs: [0.012, 0.009], a: 2, s: 2, r: 4, at: 3.4 + pts.length * 0.12, spread: 0.6, rev: 0.8 });
    },
    // 鱼与大鱼：闪烁的细响，然后第一声鲸歌，与跃出水面的浪花
    17() {
      grains({ buf: 'white', n: 16, dur: 1.4, f0: 4000, f1: 8000, len: 0.015, q: 3, g: 0.08, spread: 0.6, pan: -0.3, rev: 0.4 });
      whaleSong(1.2, -0.4, 0.15, 'evt');
      burst({ buf: 'white', f: 1500, q: 0.6, g: 0.15, a: 0.01, d: 0.8, at: 4.2, pan: -0.45, rev: 0.4 });
    },
    // 雀鸟：翅膀的一阵扑动，然后最初的歌
    18() {
      burst({ buf: 'white', f: 1500, q: 1, g: 0.35, a: 0.2, s: 0.5, r: 1, am: [16, 0.6], pan: -0.6, pan2: 0.6, rev: 0.3 });
      [1.0, 1.7, 2.5, 3.3].forEach((at, i) => birdPhrase(at, (i % 2 ? 1 : -1) * rnd(0.2, 0.7), 0.1));
      gull(2.2, -0.6, 0.06);
    },
    // 赐福（第五日）：光环经过之处，每一个生灵轻轻一拨
    19() { for (let i = 0; i < 14; i++) pluck(pent(F.A5, rint(0, 6)), 0.3 + i * rnd(0.15, 0.25), 0.08, rnd(-0.9, 0.9), 0.6); },
    // 活物：尘土扬起，最初的声音——牛、羊、远处的狮子、马的响鼻
    21() {
      burst({ buf: 'white', f: 600, f2: 200, sweep: 2, q: 0.9, g: 0.25, a: 0.3, s: 0.8, r: 1.2, pan: 0.3, rev: 0.3 });
      cow(1.0, 0.35, 0.13); sheep(1.8, 0.6, 0.075); lion(2.6, 0.75, 0.18); snort(3.4, 0.2, 0.12);
    },
    // 造人：一口长长的呼气；灵的 A3 分成两个声音——A3 与 C#4，形像的双音
    22() {
      burst({ buf: 'white', f: 1000, f2: 400, sweep: 2.5, q: 0.8, g: 0.3, a: 0.5, s: 1, r: 1.5, rev: 0.35 });
      note({ f: F.A3, g: 0.09, a: 1, s: 4, r: 3, at: 0.8, pan: -0.15, rev: 0.5, prio: 2 });
      note({ f: F.Cs4, g: 0.07, a: 1.2, s: 3.8, r: 3, at: 0.8, pan: 0.15, rev: 0.5, prio: 2 });
      note({ f: F.Cs4, type: 'triangle', g: 0.02, a: 1.2, s: 3.8, r: 3, at: 0.8, pan: 0.15, rev: 0.5 });
    },
    // 赐福（第六日）：人的主题——第一条有起伏的旋律
    23() {
      for (let i = 0; i < 10; i++) pluck(pent(F.A5, rint(0, 6)), 0.3 + i * rnd(0.15, 0.25), 0.06, rnd(-0.9, 0.9), 0.6);
      humanTheme(1.3, 0.07);
    },
    // 甚好：金色的绽放（和弦本身由 good(true) 奏出）
    24() {
      for (let k = 2; k <= 8; k += 2) note({ f: F.A3 * k, det: rnd(-4, 4), g: 0.02, a: 0.5, s: 0.3, r: 3, pan: (k % 4 ? -1 : 1) * 0.4, rev: 0.7 });
      note({ f: F.A1, g: 0.2, a: 0.03, d: 2.5, prio: 2 });
    },
    // 圣日：一周的动机一齐轻轻响起，然后归于纯净的 A 大三和弦；「好」横跨三个八度
    26() {
      note({ f: 880, g: 0.02, a: 0.3, s: 0.3, r: 2, rev: 0.6 });                          // 光
      note({ f: F.B3, g: 0.03, a: 0.5, s: 0.5, r: 2, rev: 0.6 });                         // 空气
      burst({ buf: 'pink', ft: 'lowpass', f: 500, g: 0.15, a: 0.8, s: 0.3, r: 1.5, pan: -0.5 }); // 海
      note({ f: F.A1, g: 0.2, a: 0.08, d: 1.5 });                                          // 地
      pluck(F.E5, 0.4, 0.05, 0.4, 0.6);                                                     // 生长
      ping(F.A6, 0.7, 0.03, -0.5);                                                          // 星
      birdPhrase(0.9, 0.6, 0.05);                                                           // 鸟
      note({ f: F.A3, g: 0.04, a: 0.6, s: 0.6, r: 2 }); note({ f: F.Cs4, g: 0.03, a: 0.6, s: 0.6, r: 2 }); // 人
      chord([F.A2, F.E3, F.A3, F.Cs4, F.E4, F.A4], { gs: [0.12, 0.09, 0.07, 0.055, 0.045, 0.035], a: 2, s: 6, r: 8, at: 1.8, spread: 0.5, rev: 0.6,
        types: ['sine', 'sine', 'sine', 'triangle', 'triangle', 'triangle'] });
      bells([F.A4, F.Cs5, F.E5], 0.22, 0.06, 3.2, 4.2);
      bells([F.A5, F.Cs6, F.E6], 0.18, 0.05, 2.8, 5.0);
      bells([F.A6, F.Cs7, F.E7], 0.14, 0.03, 2.4, 5.7);
    },
    // 第七日的最后一息：一个很轻的「好」，此后造物主不再出声
    27() { bells([F.A5, F.Cs6, F.E6], 0.2, 0.01, 3.5, 0.6); },
  };
  const FUL_KIND = {
    refrain() { tollBell(55, 0.13, 6, 0.1, 0, 'evt', 0.6); tollBell(110, 0.055, 4.5, 0.1, 0, 'evt', 0.6); },
    cmd() { chord([F.A1, F.E2, F.A2, F.E3], { gs: [0.15, 0.11, 0.08, 0.04], a: 0.5, s: 0.5, r: 3.5, rev: 0.45 }); },
    bless() { for (let i = 0; i < 10; i++) pluck(pent(F.A5, rint(0, 6)), 0.3 + i * 0.2, 0.03, rnd(-0.9, 0.9), 0.6); },
  };

  // 名字的音（聚成的一刻）
  const NAME_TONE = {
    '昼': at => { note({ f: F.E5, g: 0.1, a: 0.02, d: 3, at, rev: 0.5 }); note({ f: F.E6, type: 'triangle', g: 0.03, a: 0.02, d: 3, at, rev: 0.5 }); },
    '夜': at => note({ f: F.A3, g: 0.12, a: 0.3, d: 4, at, trem: [0.5, 0.4], rev: 0.55 }),
    '天': at => { note({ f: F.B4, g: 0.08, a: 0.05, d: 3.5, at, pan: -0.2, rev: 0.6 }); note({ f: F.E5, g: 0.07, a: 0.05, d: 3.5, at, pan: 0.2, rev: 0.6 }); },
    '海': at => { burst({ buf: 'pink', f: 500, q: 0.8, g: 0.35, a: 0.6, s: 0.6, r: 2, at, pan: -0.5, rev: 0.4 }); note({ f: F.A2, g: 0.12, a: 0.3, s: 0.5, r: 2.5, at, pan: -0.3, rev: 0.4 }); },
    '地': at => { note({ f: F.A1, g: 0.25, a: 0.08, d: 1.5, at, prio: 2 }); note({ f: F.E3, type: 'triangle', g: 0.08, a: 0.05, d: 2.5, at, pan: 0.3, rev: 0.4 }); },
    '圣': at => chord([F.A4, F.Cs5, F.E5, F.A5], { gs: [0.05, 0.04, 0.035, 0.025], a: 0.8, s: 1.5, r: 4, at, spread: 0.5, rev: 0.7 }),
  };

  // 安息之后的观看：每一物各有它的动机，外加一圈金色的光之音
  const BEHOLD = {
    sea: () => { whaleSong(0.2, -0.4, 0.08, 'evt'); bubble(0.1, -0.5, 0.06, 'evt'); bubble(0.4, -0.3, 0.05, 'evt'); },
    bird: () => birdPhrase(0.15, rnd(-0.4, 0.4), 0.08),
    cattle: () => (Math.random() < 0.5 ? cow(0.2, 0.3, 0.14, true) : sheep(0.2, 0.3, 0.09, true)),
    beast: () => (Math.random() < 0.5 ? lion(0.2, 0.3, 0.18) : snort(0.2, 0.3, 0.15)),
    creep: () => { for (let i = 0; i < 3; i++) note({ f: 4200, g: 0.02, a: 0.004, d: 0.05, at: 0.2 + i * 0.12, pan: 0.3, prio: 1 }); },
    human: () => { note({ f: F.A3, g: 0.07, a: 0.6, s: 1.5, r: 2.5, pan: -0.15, rev: 0.5 }); note({ f: F.Cs4, g: 0.055, a: 0.7, s: 1.4, r: 2.5, pan: 0.15, rev: 0.5 }); },
    tree: () => [F.A2, F.E3, F.A3].forEach((f, i) => wood(f, 0.15 + i * 0.3, 0.12, 0.3)),
    grass: () => [F.A4, F.B4, F.Cs5, F.E5].forEach((f, i) => pluck(f, 0.1 + i * 0.12, 0.07, 0.3, 0.5)),
    waters: () => { burst({ buf: 'pink', ft: 'lowpass', f: 500, g: 0.25, a: 0.8, s: 0.3, r: 2, pan: -0.4, rev: 0.4 }); note({ f: F.A2, g: 0.09, a: 0.4, s: 0.3, r: 2.2, pan: -0.3 }); },
    sky: () => { note({ f: F.B3, g: 0.06, a: 0.6, s: 0.6, r: 2.5, rev: 0.6 }); burst({ buf: 'white', ft: 'highpass', f: 2500, g: 0.05, a: 1, s: 0, r: 1.5, rev: 0.5 }); },
    sun: () => { for (let k = 1; k <= 5; k++) note({ f: F.A3 * k, g: 0.04 / Math.sqrt(k), a: 0.5, s: 0.4, r: 2, pan: (k % 2 ? -1 : 1) * 0.1 * k, rev: 0.5 }); },
    moon: () => { note({ f: F.E5, g: 0.07, a: 0.3, d: 4.5, vib: [5, 0.0017], pan: 0.3, rev: 0.7 }); note({ f: F.B5, g: 0.04, a: 0.3, d: 4.5, vib: [5, 0.0017], pan: 0.4, rev: 0.7 }); },
    stars: () => { for (let i = 0; i < 5; i++) ping(pent(F.A5, rint(0, 7)), 0.1 + i * 0.18, 0.05, rnd(-0.7, 0.7)); },
    light: () => [880, 1320, 1760].forEach((f, i) => note({ f, g: 0.025, a: 0.2, s: 0.2, r: 2.5, pan: (i - 1) * 0.4, rev: 0.7 })),
  };

  // ── 声床的电平（混音在此校准）────────────────────────────
  const LV = {
    drone: 0.028, light: 0.035, air: 0.037, earth: 0.02, human: 0.032, sunset: 0.024,
    water: 0.13, stir: 0.04, wind: 0.5, leaves: 0.42, cricket: 0.03,
    pluck: 0.03, star: 0.03, bird: 0.025, whale: 0.035, bubble: 0.03, graze: 0.02, herd: 0.05, theme: 0.02,
  };

  // ── 对外的接口：未 init / 静音 / 无 WebAudio 时都是安全的空操作 ──
  function api(label, fn) {
    return function () {
      if (!AC) return;
      try { return fn.apply(null, arguments); } catch (e) { err(label, e); flush(); }
    };
  }

  GS.audio = {
    init() {
      if (!Ctx) return;
      try {
        if (!AC) build();
        hookGestures();
        if (!muted && !hidden) resume();
        unlock();
      } catch (e) { err('init', e); }
    },
    setMuted(m) {
      m = !!m;
      if (m === muted) return;
      muted = m;
      try { applyOut(); } catch (e) { err('setMuted', e); }
    },
    visibility(vis) {
      const h = !vis;
      if (h === hidden) return;
      hidden = h;
      try { applyOut(); } catch (e) { err('visibility', e); }
    },
    // 以音频时钟计时（与画面帧率无关；声音挂起时自然停住）
    update: api('update', () => {
      if (hidden || AC.state !== 'running') return;
      const t = T();
      if (lastTick < 0 || t < lastTick) lastTick = t - TICK;
      if (t - lastTick < TICK) return;
      tickDt = Math.min(t - lastTick, 0.5);
      lastTick = t;
      tick(tickDt);
    }),
    chargeStart: api('chargeStart', (day, kind) => {
      if (hold) releaseHold(false);
      const k = holdKindFor(day, kind);
      if (!k || !HOLD[k]) return;
      const h = new Voice();
      h.kind = kind === 'first' ? 'first' : kind; h.hk = k; h.c = 0; h.shown = 0; h.day = day;
      h.chars = (GS.story && GS.story.STAGES && GS.story.STAGES[W.stage | 0] ? Array.from(GS.story.STAGES[W.stage | 0].utter || '') : []);
      h.out = h.g(0);
      h.out.connect(N.bus.rit.in);
      h.set = HOLD[k](h) || (() => {});
      const t = T();
      h.out.gain.setValueAtTime(0, t);
      h.out.gain.linearRampToValueAtTime(1, t + 0.12);
      h.startAll(t);
      hold = h;
      lastCharge = -1;
      h.set(0.001);
    }),
    charge: api('charge', (c, shown) => {
      const h = hold;
      if (!h || !fin(c)) return;
      c = clamp(c, 0, 1);
      h.c = c;
      // 叠句：每一个新浮现的字，一声钟
      if (h.hk === 'refrain' && fin(shown) && shown > h.shown) {
        let k = 0;
        for (let i = h.shown; i < shown; i++) {
          const ch = h.chars[i];
          if (ch && PUNCT.test(ch)) continue;
          const last = i === h.chars.length - 1;
          tollBell(F.A2, last ? 0.11 : 0.09, last ? 5 : 4, k * 0.05, (i / Math.max(1, h.chars.length - 1) - 0.5) * 0.5, 'rit', 0.55);
          if (last) tollBell(F.A1, 0.07, 5, 0.05, 0, 'rit', 0.55);
          k++;
        }
        h.shown = shown;
      }
      const now = performance.now();
      if (Math.abs(c - lastCharge) > 0.004 || now - lastChargeAt > 50) {
        lastCharge = c; lastChargeAt = now;
        h.set(c);
      }
    }),
    chargeEnd: api('chargeEnd', fulfilled => {
      const h = hold;
      if (!h) return;
      releaseHold(!!fulfilled);
      // 话未说完：一口下落的气息
      if (!fulfilled && h.c > 0.04) {
        burst({ buf: 'pink', f: 1100, f2: 220, sweep: 0.9, q: 0.9, g: 0.08 + 0.2 * h.c, a: 0.03, d: 0.9, rev: 0.35, bus: 'rit', prio: 2 });
      }
    }),
    fulfill: api('fulfill', (day, index, kind) => {
      const st = GS.story && GS.story.STAGES ? GS.story.STAGES[index] : null;
      const fn = st && st.kind === kind && FUL[index] ? FUL[index] : null;
      if (kind === 'refrain') FUL_KIND.refrain();
      else if (fn) fn();
      else if (FUL_KIND[kind]) FUL_KIND[kind]();
      else if (kind !== 'rest') FUL_KIND.cmd();
    }),
    // 经文浮现：极轻的一点微光
    bell: api('bell', () => {
      const pair = [[F.E6, F.A6], [F.Cs6, F.Fs6], [F.A5, F.E6], [F.B5, F.Fs6]][rint(0, 3)];
      const p = rnd(-0.4, 0.4);
      note({ f: pair[0], g: 0.01, a: 0.004, d: 3, pan: p, rev: 0.75, prio: 0 });
      note({ f: pair[1], g: 0.0055, a: 0.004, d: 2.4, at: 0.09, pan: -p, rev: 0.75, prio: 0 });
    }),
    // 「神看着是好的」：A5 → C#6 → E6；「甚好」：整周的和弦，动机先低八度缓奏，再原调
    good: api('good', big => {
      if (!big) { bells([F.A5, F.Cs6, F.E6], 0.16, 0.08, 2.8); return; }
      chord([F.A1, F.E2, F.A2, F.Cs3, F.E3, F.B3, F.Cs4, F.E4, F.Fs4, F.A4], {
        gs: [0.095, 0.072, 0.06, 0.05, 0.042, 0.029, 0.027, 0.024, 0.021, 0.019],
        types: ['sine', 'sine', 'sine', 'sine', 'sine', 'triangle', 'triangle', 'triangle', 'triangle', 'triangle'],
        a: 1.2, s: 6, r: 8, spread: 0.6, rev: 0.55, det: 3,
      });
      bells([F.A4, F.Cs5, F.E5], 0.32, 0.08, 3.5, 0.8);
      bells([F.A5, F.Cs6, F.E6], 0.16, 0.07, 2.8, 2.6);
    }),
    // 名字聚成：细碎的颗粒，聚成的一刻奏出它的音
    nameChime: api('nameChime', ch => {
      const tone = NAME_TONE[ch];
      if (tone) {
        const dark = ch === '夜';
        grains({ buf: 'white', n: 30, dur: 1.7, f0: dark ? 1400 : 3000, f1: dark ? 2800 : 6000, len: 0.02, q: 2.5, g: dark ? 0.1 : 0.07, rev: 0.4, prio: 1 });
        tone(1.7);
      } else {
        // 安息之后，生灵被灵认出时的名字：更短、更轻
        const h = String(ch || '').charCodeAt(0) || 0;
        grains({ buf: 'white', n: 8, dur: 0.8, f0: 3500, f1: 6500, len: 0.018, q: 2.5, g: 0.04, rev: 0.4, prio: 0 });
        note({ f: pent(F.A5, h % 8), g: 0.03, a: 0.01, d: 1.6, at: 0.8, rev: 0.6, prio: 0 });
      }
    }),
    // 晚上来临：一口温暖的暮色和弦，低通缓缓合上
    daySeal: api('daySeal', day => {
      const fs = [F.A2, F.E3];
      if (day >= 2) fs.push(F.B3);
      if (day >= 3) fs.push(F.Cs4);
      if (day >= 6) fs.push(F.Fs4);
      chord(fs, { type: PW.soft, g: 0.04, a: 3, s: 2, r: 7, lp: 1400, lp2: 280, lpT: 10, spread: 0.4, rev: 0.55 });
    }),
    // 黎明：A 的泛音自下而上次第亮起（光是升起，不是滑音），一口渐亮的空气，和这一日的和弦
    dawn: api('dawn', day => {
      [F.A3, F.E4, F.A4, F.Cs5, F.E5].forEach((f, i) => note({ f, g: 0.032 * (1 - i * 0.13), det: rnd(-3, 3), a: 1.3, s: 0.8, r: 3.2,
        at: i * 0.34, pan: (i - 2) * 0.17, rev: 0.65, prio: 2 }));
      burst({ buf: 'pink', f: 420, f2: 2400, sweep: 3.2, q: 0.7, g: 0.05, a: 1.6, s: 0.6, r: 2.4, pan: -0.4, pan2: 0.3, rev: 0.5, prio: 1 });
      let fs = [F.A3, F.E4];
      if (day === 2) fs = [F.A3, F.B3, F.E4];
      else if (day >= 3) fs = [F.A3, F.Cs4, F.E4];
      if (day >= 6) fs = [F.A3, F.Cs4, F.E4, F.A4];
      chord(fs, { type: 'triangle', g: 0.038, a: 2, s: 1.5, r: 4, at: 0.6, spread: 0.45, rev: 0.6 });
      if (day === 3) [F.A4, F.Cs5, F.E5].forEach((f, i) => pluck(f, 2.4 + i * 0.22, 0.06, 0.2 + i * 0.2, 0.7));
      if (day === 4) for (let k = 1; k <= 6; k++) note({ f: F.A3 * k, g: 0.03 / Math.sqrt(k), a: 1.5, s: 0.5, r: 2.5, at: 1, pan: (k % 2 ? -1 : 1) * 0.1 * k, rev: 0.6 });
      if (day === 5) { for (let i = 0; i < 5; i++) birdPhrase(1 + i * 0.6, rnd(-0.8, 0.8), 0.06); gull(2, -0.6, 0.05); }
    }),
    // 赐福之垫绽放：低通 800→2000Hz，6 秒里缓缓散去
    bless: api('bless', () => {
      const v = voice(2);
      if (!v) return;
      const t = T() + 0.02;
      const lp = v.f('lowpass', 800, 0.8), g = v.g(0);
      lp.frequency.setValueAtTime(800, t);
      lp.frequency.exponentialRampToValueAtTime(2000, t + 1);
      lp.frequency.setTargetAtTime(500, t + 1.2, 2);
      [F.A2, F.E3, F.A3, F.Cs4, F.E4].forEach((f, i) => [-6, 6].forEach(dc => {
        const o = v.o('sawtooth', f); o.detune.value = dc + rnd(-1.5, 1.5);
        const og = v.g(i < 2 ? 0.8 : 0.6), pn = v.p(dc < 0 ? -0.4 : 0.4);
        o.connect(og); og.connect(pn); pn.connect(lp);
      }));
      lp.connect(g);
      const end = swell(g.gain, t, 0.8, 0.07, 0.4, 6);
      v.out(g, 'evt', null, 0.5);
      v.play(t, end);
    }),
    behold: api('behold', kind => {
      const fn = BEHOLD[kind];
      if (fn) fn();
      bells([F.A5, F.E6], 0.12, 0.035, 2.4, 0, { prio: 1 });
    }),
    // 第七日：静止的一息——一个很轻的音，沿 A 大调音阶一息一息升起
    breath: api('breath', i => {
      breathN = clamp(i | 0, 0, 7);
      const SC = [F.A3, F.B3, F.Cs4, F.D4, F.E4, F.Fs4, F.Gs4];
      const f = SC[clamp((i | 0) - 1, 0, 6)];
      note({ f, g: 0.045, a: 1.2, s: 0.3, r: 2.6, rev: 0.65, prio: 2 });
      burst({ buf: 'pink', f: 900, q: 0.7, g: 0.05, a: 0.8, s: 0.2, r: 1.5, rev: 0.4, prio: 1 });
    }),
    // 造物主的底鸣永远退去（约 20 秒）
    rest: api('rest', () => { breathN = 0; }),
    // 终幕：纯净的 A 大三和弦
    finale: api('finale', () => {
      chord([F.A2, F.E3, F.A3, F.Cs4, F.E4, F.A4], {
        gs: [0.09, 0.07, 0.055, 0.045, 0.038, 0.03], types: ['sine', 'sine', 'sine', 'triangle', 'triangle', 'triangle'],
        a: 3, s: 5, r: 9, spread: 0.7, rev: 0.65, strum: 0.35,
      });
    }),
    _dbg: () => ({ ctx: AC, out: N && N.out, sum: N && N.sum, live, errs: errs.slice(), hold: hold ? hold.hk : null,
      beds: Object.keys(beds).filter(k => beds[k].x), breathN, LV, divine: divNow,
      drone: beds.drone && beds.drone.x ? [beds.drone.x.c.chaos.v, beds.drone.x.c.sub.v] : null }),
    _t: { note, burst, grains, tollBell, bells, chord, whaleSong, birdPhrase, gull, cow, sheep, dove },     // 测试用：直接调用配方
  };

  // 他处发出的声音事件
  if (GS.bus) {
    GS.bus.on('whale', e => {
      if (!AC || !e) return;
      try {
        const t = T(), pan = panX(e.x || 0);
        if (e.type === 'song') { nx.busSong = t; if (t >= (nx.song || 0)) { nx.song = t + 15; whaleSong(0, pan, LV.whale); } }
        else if (e.type === 'breach') {
          burst({ buf: 'white', f: 1500, q: 0.6, g: 0.03, a: 0.01, d: 0.6, at: 0.2, pan, rev: 0.35, bus: 'amb', prio: 0 });
          burst({ buf: 'white', f: 1500, q: 0.6, g: 0.055, a: 0.01, d: 0.9, at: 1.5, pan, rev: 0.4, bus: 'amb', prio: 0 });
          note({ f: 62, path: [[40, 0.6]], g: 0.07, a: 0.01, d: 0.8, at: 1.5, pan, bus: 'amb', prio: 0 });
        } else if (e.type === 'spout') {
          burst({ buf: 'pink', f: 1100, q: 0.7, g: 0.035, a: 0.05, d: 0.7, pan, rev: 0.3, bus: 'amb', prio: 0 });
        }
      } catch (er) { err('whale', er); flush(); }
    });
    let lastSplash = 0;
    GS.bus.on('splash', e => {
      if (!AC || !e) return;
      try {
        const t = T();
        if (t - lastSplash < 0.07) return;
        lastSplash = t;
        splash(e.x || 0, e.y || W.h, e.size || 1, 0);
      } catch (er) { err('splash', er); flush(); }
    });
  }
})(window.GS);
