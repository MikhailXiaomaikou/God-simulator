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
 * 七日之后（其后各卷，W.act ≥ 1）：七息之后的底鸣只在第一卷里退去；每进入新的一卷，已调准的 A 以较轻的声量回来，
 *         外加这一卷自己的乐垫与稀疏的乐句——仍是 A 上的同一首曲子：
 *         伊甸 明亮的 A 加九与里拉（堕落后没有三音）· 该隐 低处的 A 小、弓弦的长音（求告主名后大三度回来）
 *         · 洪水 忧伤 → 暴风雨（雨、风、雷的声床）→ 水退后的清澈，虹是高处的微光 · 巴别 同一的节律 → 变乱成各自的调
 *         · 亚伯拉罕 旷野的苇笛、星夜的利底亚 · 雅各 牧笛、天梯上无字的合唱 · 约瑟 乌德与 Hijaz，末了归于纯净的 A 大；
 *         全书终了（再一次 rest），乐声缓缓归于安息，只剩世界自己的声音与日落时的「甚好」。
 *         话语按种类（护理 · 发问 · 审判 · 应许 · 呼唤 · 新名 · 命令 · 赐福）各有按住之声与成就的手势；
 *         情节里的音效由 sfx(name, {soft, far, low, size, x}) 奏出（竖琴、风、建造、哀哭、雷、火、封、众人、水花、羊、门、雨、鸽、骆驼、笑、天使、众星……）。
 * 旧约其余各卷：每一卷的乐曲写在 js/music/*.js 里，用 GS.audio.music(id, spec) 登记（乐垫各组、随本卷程度的混音、音阶、乐句），
 *         不必再改本文件；登记过的一卷与创世记各卷走同一条路（actId · padMix · scaleNow · generateAct · ACT_MUS），
 *         声床到需要时才建。仍然全在 A 上——整部旧约是一首连续的曲子。说明见 js/music/ot1.js 的开头。
 *         新的音效：羊角（shofar）、银号、狮吼、鼓（手鼓与串铃）、钹、里拉、战车、窑匠的轮、甩石的机弦、铁锤与砧、小铃、海浪、
 *         地震、倒塌、刀剑、箭、行军、呐喊、蝗群、冰雹、旋风、鲸、笛、歌唱、瓦器破碎、书卷、书写、锁链、心跳、骨节相碰、
 *         微小的声音、鹰、磨、斧、银钱、马蹄……（见 SFX 与 SFX_ALIAS）。
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
  Object.assign(F, {                                   // 其后各卷用到的音（仍在 A 上：小三度、b6、#4、Hijaz 的 b2）
    D2: 73.42, Bb2: 116.54, C3: 130.81, D3: 146.83, F3: 174.61, Fs3: 185, G3: 196, Bb3: 233.08, C4: 261.63,
    Ds4: 311.13, F4: 349.23, G4: 392, Gs4: 415.3, C5: 523.25, D5: 587.33, Ds5: 622.25, Gs5: 830.61,
  });
  const PENT = [0, 2, 4, 7, 9];                       // A 大调五声：A B C# E F#
  const pent = (base, i) => base * Math.pow(2, (PENT[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5)) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rint = (a, b) => Math.floor(rnd(a, b + 1));
  const fin = v => typeof v === 'number' && isFinite(v);
  // 音阶（自 A 起的半音）：各卷各有其色彩，却始终在 A 上——一首连续的曲子
  const SC = {
    maj: [0, 2, 4, 7, 9],                // 大调五声（伊甸、牧场、应许）
    min: [0, 3, 5, 7, 10],               // 小调五声（该隐：田间的暗）
    grief: [0, 2, 3, 7, 9],              // 多利亚五声（洪水之前的忧伤）
    sus: [0, 2, 5, 7, 9],                // 没有三音（堕落之后：悬而未决）
    lyd: [0, 2, 4, 6, 7, 11],            // 利底亚（旷野的星空：#4 的惊奇）
    hijaz: [0, 1, 4, 5, 7, 8, 10],       // Hijaz（埃及：b2 与增二度）
    // 旧约其余各卷（七声的调式，仍自 A 起）
    ion: [0, 2, 4, 5, 7, 9, 11],         // 伊奥尼亚（殿中的庄严：完整的 A 大调）
    mixo: [0, 2, 4, 5, 7, 9, 10],        // 混合利底亚（士师的号角：古老、粗粝的大调）
    dor: [0, 2, 3, 5, 7, 9, 10],         // 多利亚（山地的民歌：小调里一个明亮的六度）
    aeol: [0, 2, 3, 5, 7, 8, 10],        // 爱奥利亚（哀歌：b6 的叹息）
    phryg: [0, 1, 3, 5, 7, 8, 10],       // 弗里几亚（欺压、围城：b2 的阴影）
  };
  // 音名 → 频率：F 表里有的直接取；否则按 'A4' 'Cs5' 'C#3' 'Bb2' 的写法以 A4 = 440 平均律算出；数字即 Hz
  const NOTE_OFF = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  function hz(x) {
    if (typeof x === 'number') return x;
    if (typeof x !== 'string') return NaN;
    if (typeof F[x] === 'number') return F[x];
    const m = /^([A-Ga-g])(s|#|b)?(-?\d)$/.exec(x.trim());
    if (!m) return NaN;
    const s = NOTE_OFF[m[1].toUpperCase()] + (m[2] === 's' || m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12 * (+m[3] - 4);
    return 440 * Math.pow(2, s / 12);
  }
  const scaleOf = x => (Array.isArray(x) && x.length ? x : typeof x === 'string' && SC[x] ? SC[x] : null);
  const deg = (sc, base, i) => base * Math.pow(2, (sc[((i % sc.length) + sc.length) % sc.length] + 12 * Math.floor(i / sc.length)) / 12);
  const semi = (base, s) => base * Math.pow(2, s / 12);
  const lvl = k => { const v = W.lv[k]; return fin(v) ? v : 0; };      // 他卷定义的程度（可能尚不存在）
  const lvlOr = (k, d) => { const v = W.lv[k]; return fin(v) ? v : d; };
  // 当前的卷
  const ACT_IDS = ['eden', 'cain', 'flood', 'babel', 'abraham', 'jacob', 'joseph'];
  // 本幕尚无自己的乐垫时，借用它指定的那一幕（act.music）的乐色
  function actId() {
    const A = GS.book && GS.book.ACTS, a = A && A[W.act | 0];
    if (!a || !a.id) return (W.act | 0) > 0 ? ACT_IDS[Math.min(ACT_IDS.length, W.act | 0) - 1] : 'seven';
    if (a.id === 'seven' || PAD[a.id] || ACT_MUS[a.id]) return a.id;
    return a.music && (PAD[a.music] || ACT_MUS[a.music]) ? a.music : 'abraham';
  }
  const bookLen = () => (GS.story && GS.story.STAGES ? GS.story.STAGES.length : 1e9);
  // 此刻的音阶（随卷、随卷中的光景而变）
  function scaleNow() {
    const id = actId();
    if (MUS[id] && MUS[id].scale) return regScale(MUS[id]);  // 登记过的一卷：由它自己的 scale(lvl, night) 决定
    switch (id) {
      case 'eden': return lvlOr('edenGlow', 1) < 0.5 ? SC.sus : SC.maj;
      case 'cain': return Math.max(lvl('cainCall'), lvl('cainWalk'), lvl('cainComfort')) > 0.5 ? SC.maj : SC.min;
      case 'flood': return lvl('rainbow') > 0.2 || lvl('ararat') > 0.5 || lvl('flGrace') > 0.5 ? SC.maj : SC.grief;
      case 'abraham': return lvl('abDark') > 0.5 ? SC.min : (W.night || 0) > 0.5 || lvl('abStars') > 0.3 ? SC.lyd : SC.maj;
      case 'joseph': return lvl('jsEgypt') > 0.5 && lvl('jsPromise') < 0.5 && lvl('jsGoshen') < 0.5 ? SC.hijaz : SC.maj;
      default: return SC.maj;
    }
  }
  // 此刻和弦的三音：C#（大）或 C（小）
  const thirdNow = () => (scaleNow().indexOf(4) >= 0 ? 4 : scaleNow().indexOf(3) >= 0 ? 3 : 5);

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
  function dove(at, pan, g, bus) {
    const pr = bus ? 1 : 0;
    note({ f: F.E5 * 0.5, path: [[F.Cs5 * 0.5, 0.35]], g, a: 0.08, s: 0.15, r: 0.25, lp: 900, at, pan, rev: 0.35, bus: bus || 'amb', prio: pr });
    note({ f: F.E5 * 0.5, path: [[F.Cs5 * 0.5, 0.5]], g: g * 0.8, a: 0.08, s: 0.25, r: 0.3, lp: 900, at: (at || 0) + 0.7, pan, rev: 0.35, bus: bus || 'amb', prio: pr });
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
  function cow(at, pan, g, far, bus) {
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
    v.out(env, bus || 'amb', pan, far ? 0.5 : 0.3);
    v.play(t, end);
  }
  // 羊：锯齿 220Hz，6Hz 颤音，共振峰 800 / 1200Hz，0.6s
  function sheep(at, pan, g, far, bus, fr) {
    if (!(g > 0)) return;
    const v = voice(1);
    if (!v) return;
    const t = T() + (at || 0) + 0.02, f = fr || rnd(210, 236);
    const o = v.o(PW.reed, f);
    v.lfo(6, f * 0.035, o.frequency);
    const f1 = v.f('bandpass', 800, 4), f2 = v.f('bandpass', 1200, 5), lp = v.f('lowpass', far ? 1600 : 3000, 0.7), env = v.g(0);
    o.connect(f1); o.connect(f2); f1.connect(lp); f2.connect(lp); lp.connect(env);
    const end = swell(env.gain, t, 0.06, g, 0.4, 0.2);
    v.out(env, bus || 'amb', pan, far ? 0.5 : 0.3);
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

  // ── 其后各卷的乐器：一个声部里排程多个音（省声部、省节点）────────
  // 弦（竖琴 / 里拉 / 乌德）：ns = [[f, at, g, d?], ...]；每根弦各有一道渐暗的低通——拨弦的亮在前、暗在后；
  // 低弦在左、高弦在右（像站在琴前听）
  function strings(ns, o) {
    o = o || {};
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const sum = v.g(1), wv = o.wave || PW.harp, d0 = o.d || 2.4, br = o.bright || 6;
    let end = t;
    for (const n of ns) {
      const f = n[0], g = n[2], d = n[3] || d0;
      if (!fin(f) || !fin(g) || g <= 0) continue;
      const t0 = t + Math.max(0, n[1] || 0);
      const osc = v.o(wv, f);
      osc.detune.value = rnd(-3, 3);
      if (o.bend) { osc.frequency.setValueAtTime(f * 0.982, t0); osc.frequency.setTargetAtTime(f, t0, 0.035); }  // 乌德的指滑
      const f1 = Math.min(15000, f * br), lp = v.f('lowpass', f1, 0.6);
      lp.frequency.setValueAtTime(f1, t0);
      lp.frequency.exponentialRampToValueAtTime(Math.max(120, f * 1.4), t0 + d * 0.7);
      const g0 = v.g(0);
      osc.connect(lp); lp.connect(g0);
      if (hasPan && o.spread !== 0) {
        const pn = v.p(clamp((o.pan || 0) + (o.spread == null ? 0.3 : o.spread) * Math.log2(f / 440), -0.9, 0.9));
        g0.connect(pn); pn.connect(sum);
      } else g0.connect(sum);
      end = Math.max(end, perc(g0.gain, t0, o.a || 0.004, g, d));
    }
    if (!v.s.length) { v.play(t, t); return; }
    v.out(sum, o.bus || 'evt', hasPan && o.spread !== 0 ? null : o.pan, o.rev == null ? 0.5 : o.rev);
    v.play(t, end);
  }

  // 笛（牧笛 / 苇笛）：一口气吹完的一句——音高逐音排程，起音带"气"，颤音迟到
  // ns = [[f, dur, acc?], ...]；o: { g, at, pan, breath, bend, vib, vibHz, bright, bus, rev, prio }
  function pipe(ns, o) {
    o = o || {};
    if (!ns || !ns.length) return;
    const v = voice(o.prio == null ? 0 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02, g = o.g || 0.03, bright = o.bright || 4;
    const f0 = ns[0][0];
    const osc = v.o(PW.flute, f0), lp = v.f('lowpass', Math.min(12000, f0 * bright), 0.6), env = v.g(0), mix = v.g(1);
    osc.connect(lp); lp.connect(env); env.connect(mix);
    const vl = v.o('sine', o.vibHz || rnd(4.6, 5.4)), vg = v.g(0);
    vl.connect(vg); vg.connect(osc.detune);
    const n = v.nz('pink'), bp = v.f('bandpass', Math.min(12000, f0 * 2), 1.1), bg = v.g(0);
    n.connect(bp); bp.connect(bg); bg.connect(mix);
    const br = (o.breath == null ? 0.35 : o.breath) * g;
    let tt = t, prev = f0, last = 1;
    env.gain.setValueAtTime(0, t); bg.gain.setValueAtTime(0, t); vg.gain.setValueAtTime(0, t);
    ns.forEach(([f, dur, acc], i) => {
      const fr = osc.frequency, a = acc == null ? 1 : acc;
      if (i === 0) fr.setValueAtTime(o.bend ? f * 0.955 : f, tt); else fr.setValueAtTime(prev, tt);
      fr.setTargetAtTime(f, tt, o.bend ? 0.06 : 0.018);
      lp.frequency.setValueAtTime(Math.min(12000, f * bright), tt);
      bp.frequency.setValueAtTime(Math.min(12000, f * 2), tt);
      env.gain.setTargetAtTime(g * a, tt, i === 0 ? 0.05 : 0.03);
      vg.gain.setTargetAtTime(0, tt, 0.02);
      vg.gain.setTargetAtTime(o.vib == null ? 11 : o.vib, tt + Math.min(0.3, dur * 0.45), 0.15);  // 颤音（音分）迟到
      bg.gain.setTargetAtTime(br * 1.6 * a, tt, 0.008);                                         // 起音的"气"
      bg.gain.setTargetAtTime(br * 0.55 * a, tt + 0.04, 0.07);
      prev = f; tt += Math.max(0.05, dur); last = a;
    });
    const rel = 0.4;
    env.gain.setTargetAtTime(0, tt, rel / 4);
    bg.gain.setTargetAtTime(0, tt, rel / 4);
    const end = tail(env.gain, tt, g * last, rel / 4, tt + rel);
    tail(bg.gain, tt, br * 0.55 * last, rel / 4, tt + rel);
    v.out(mix, o.bus || 'mus', o.pan, o.rev == null ? 0.55 : o.rev);
    v.play(t, end);
  }

  // 合唱（天使、天梯）：成对微失谐的锯齿经三个共振峰（'aw' 元音）——没有面孔的人声
  function choirInto(v, fs, gs, o) {
    o = o || {};
    const sum = v.g(1), vib = v.o('sine', o.vibHz || 5.1), vg = v.g(o.vib == null ? 9 : o.vib);
    vib.connect(vg);
    fs.forEach((f, i) => [-1, 1].forEach(s => {
      const x = v.o('sawtooth', f);
      x.detune.value = s * rnd(4, 8);
      vg.connect(x.detune);
      const xg = v.g((gs ? gs[i] : 1) * 0.5), pn = v.p(clamp(s * (0.15 + 0.12 * i), -0.85, 0.85));
      x.connect(xg); xg.connect(pn); pn.connect(sum);
    }));
    const out = v.g(1);
    [[o.f1 || 650, 3.2, 1], [o.f2 || 1080, 4.5, 0.5], [o.f3 || 2750, 6, 0.16]].forEach(([f, q, g]) => {
      const bp = v.f('bandpass', f, q), gg = v.g(g);
      sum.connect(bp); bp.connect(gg); gg.connect(out);
    });
    const body = v.f('lowpass', 420, 0.7), bg = v.g(0.12);
    sum.connect(body); body.connect(bg); bg.connect(out);
    return out;
  }
  function choir(fs, o) {
    o = o || {};
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02;
    const src = choirInto(v, fs, o.gs, o), g = v.g(0);
    src.connect(g);
    const end = swell(g.gain, t, o.a || 1.2, o.g || 0.05, o.s || 1.5, o.r || 3);
    v.out(g, o.bus || 'evt', o.pan, o.rev == null ? 0.7 : o.rev);
    v.play(t, end);
  }

  // 敲击（锤、凿、放石头）：一个噪声源 + 一个正弦，逐次排程其滤波、音高与包络
  // hits = [[at, fNoise, fBody, g, heavy], ...]
  function knocks(hits, o) {
    o = o || {};
    if (!hits.length) return;
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const n = v.nz('white'), bp = v.f('bandpass', 1500, o.q || 2.4), ng = v.g(0);
    n.connect(bp); bp.connect(ng);
    const s = v.o('sine', 200), sg = v.g(0);
    s.connect(sg);
    const lp = v.f('lowpass', o.lp || 7000, 0.6);
    ng.connect(lp); sg.connect(lp);
    let end = t;
    for (const [at, fn, fb, g, heavy] of hits) {
      const tt = t + Math.max(0, at);
      bp.frequency.setValueAtTime(fn, tt);
      ng.gain.setValueAtTime(0, tt);
      ng.gain.linearRampToValueAtTime(g, tt + 0.0015);
      ng.gain.setTargetAtTime(0, tt + 0.0015, heavy ? 0.028 : 0.013);
      s.frequency.setValueAtTime(fb * 1.6, tt);
      s.frequency.exponentialRampToValueAtTime(fb, tt + 0.035);
      sg.gain.setValueAtTime(0, tt);
      sg.gain.linearRampToValueAtTime(g * (heavy ? 1.5 : 0.8), tt + 0.003);
      sg.gain.setTargetAtTime(0, tt + 0.003, heavy ? 0.075 : 0.035);
      end = Math.max(end, tt + (heavy ? 0.7 : 0.35));
    }
    v.out(lp, o.bus || 'evt', o.pan, o.rev == null ? 0.3 : o.rev);
    v.play(t, end);
  }

  // 人声（哀哭、笑）：声门般的波形经两个共振峰，外加一缕低处的身躯与气声；音高逐句排程
  // ph = [[at, dur, f0, f1, g], ...]（每一句从 f0 滑到 f1，先起后落）
  function vox(ph, o) {
    o = o || {};
    if (!ph.length) return;
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02;
    const osc = v.o(PW.reed, ph[0][2]);
    if (o.vib !== 0) { const vl = v.o('sine', o.vibHz || 5.3), vg = v.g(o.vib == null ? 16 : o.vib); vl.connect(vg); vg.connect(osc.detune); }
    const F1 = v.f('bandpass', o.F1 || 420, o.q1 || 4), F2 = v.f('bandpass', o.F2 || 950, o.q2 || 6), low = v.f('lowpass', o.F1 || 420, 0.7);
    const g1 = v.g(1), g2 = v.g(0.45), g3 = v.g(0.3), env = v.g(0), mix = v.g(1);
    osc.connect(F1); osc.connect(F2); osc.connect(low);
    F1.connect(g1); F2.connect(g2); low.connect(g3); g1.connect(env); g2.connect(env); g3.connect(env); env.connect(mix);
    const n = v.nz('pink'), nb = v.f('bandpass', o.Fb || 1500, 0.9), ng = v.g(0);
    n.connect(nb); nb.connect(ng); ng.connect(mix);
    const brk = o.breath == null ? 0.5 : o.breath;
    let end = t;
    for (const [at, dur, fa, fb, g] of ph) {
      const tt = t + Math.max(0, at), a = Math.min(o.att || 0.07, dur * 0.3), r = Math.min(0.3, dur * 0.45);
      osc.frequency.setValueAtTime(fa, tt);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fb), tt + dur);
      env.gain.setValueAtTime(0, tt);
      env.gain.linearRampToValueAtTime(g, tt + a);
      env.gain.linearRampToValueAtTime(g * (o.sus == null ? 0.6 : o.sus), tt + dur - r);
      env.gain.linearRampToValueAtTime(0, tt + dur);
      ng.gain.setValueAtTime(0, tt);
      ng.gain.linearRampToValueAtTime(g * brk, tt + a * 0.6);
      ng.gain.linearRampToValueAtTime(g * brk * 0.25, tt + dur - r);
      ng.gain.linearRampToValueAtTime(0, tt + dur);
      end = Math.max(end, tt + dur);
    }
    v.out(mix, o.bus || 'evt', o.pan, o.rev == null ? 0.45 : o.rev);
    v.play(t, end + 0.05);
  }

  // 一阵风：带通噪声的中心先升后落，声像横过；可带一缕风哨
  function gust(o) {
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02, dur = o.dur || 4;
    const n = v.nz('pink'), bp = v.f('bandpass', o.f0, o.q || 1.1), g = v.g(0);
    n.connect(bp); bp.connect(g);
    bp.frequency.setValueAtTime(o.f0, t);
    bp.frequency.exponentialRampToValueAtTime(o.f1, t + dur * 0.45);
    bp.frequency.exponentialRampToValueAtTime(o.f0 * 0.85, t + dur);
    if (o.whistle) {
      const h = v.nz('white'), hb = v.f('bandpass', o.f1 * 1.5, 12), hg = v.g(o.whistle);
      hb.frequency.setValueAtTime(o.f0 * 1.5, t);
      hb.frequency.exponentialRampToValueAtTime(o.f1 * 1.6, t + dur * 0.5);
      hb.frequency.exponentialRampToValueAtTime(o.f0 * 1.3, t + dur);
      h.connect(hb); hb.connect(hg); hg.connect(g);
    }
    const end = swell(g.gain, t, dur * 0.42, o.g, dur * 0.08, dur * 0.5);
    let x = g;
    if (hasPan) {
      const pn = v.p(o.p0 || 0);
      pn.pan.setValueAtTime(clamp(o.p0 || 0, -1, 1), t);
      pn.pan.linearRampToValueAtTime(clamp(o.p1 || 0, -1, 1), end);
      g.connect(pn); x = pn;
    }
    v.out(x, o.bus || 'evt', null, o.rev == null ? 0.3 : o.rev);
    v.play(t, end);
  }

  // 雷的滚动：褐噪声低通（渐暗）+ 不规则的起伏
  function roll(o) {
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02;
    const n = v.nz('brown'), lp = v.f('lowpass', o.f0 || 320, 0.8), am = v.g(0.6), g = v.g(0);
    lp.frequency.setValueAtTime(o.f0 || 320, t);
    lp.frequency.exponentialRampToValueAtTime(o.f1 || 90, t + (o.a || 0.1) + (o.s || 0.3) + (o.r || 4) * 0.8);
    v.nlfo(o.rate || 0.03, o.depth || 0.55, am.gain);
    n.connect(lp); lp.connect(am); am.connect(g);
    const end = swell(g.gain, t, o.a || 0.08, o.g, o.s || 0.3, o.r || 4);
    v.out(g, o.bus || 'evt', o.pan, o.rev == null ? 0.5 : o.rev);
    v.play(t, end);
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

    // ── 其后各卷的世界之声 ──────────────────────────────────
    // 雨：左右两股去相关的白噪声作雨幕的嘶声，粉红噪声作水幕的身躯，稀疏起伏的高频作一颗颗雨点
    beds.rain = new Bed((v, out) => {
      const hp = v.f('highpass', 700, 0.5), lp = v.f('lowpass', 6500, 0.5), hiss = v.g(0.5);
      [-0.6, 0.6].forEach(p => { const n = v.nzd('white'), pn = v.p(p); n.connect(pn); pn.connect(hp); });
      hp.connect(lp); lp.connect(hiss); hiss.connect(out);
      const b = v.nzd('pink'), blp = v.f('lowpass', 1300, 0.6), body = v.g(0.75);
      v.nlfo(0.004, 0.3, body.gain);                              // 雨势一阵一阵
      b.connect(blp); blp.connect(body); body.connect(out);
      const d = v.nzd('white'), bp = v.f('bandpass', 3400, 0.9), vca = v.g(0), m = v.nz('brown', 0.7), sh = v.ws(sparseCurve());
      const dg = v.g(1.1), dp = v.p(0.15);
      m.connect(sh); sh.connect(vca.gain);                        // 雨点：随机起伏只取其峰
      d.connect(bp); bp.connect(vca); vca.connect(dg); dg.connect(dp); dp.connect(out);
      v.c.lp = ctl(lp.frequency, 6500);
    }, amb);
    // 暴风雨：深处的滚动（褐噪声低通）、狂风（带通，声像摇摆）、一缕呼啸的风哨
    beds.storm = new Bed((v, out) => {
      const r = v.nzd('brown'), rlp = v.f('lowpass', 110, 0.8), rg = v.g(0.9);
      v.nlfo(0.008, 0.6, rg.gain);
      r.connect(rlp); rlp.connect(rg); rg.connect(out);
      const w = v.nzd('pink'), wbp = v.f('bandpass', 420, 0.8), wg = v.g(0.6), wp = v.p(0);
      v.nlfo(0.005, 0.65, wg.gain);
      if (hasPan) v.lfo(0.045, 0.55, wp.pan);
      w.connect(wbp); wbp.connect(wg); wg.connect(wp); wp.connect(out);
      const h = v.nzd('white'), hbp = v.f('bandpass', 620, 14), hg = v.g(0.05);
      v.lfo(0.06, 110, hbp.frequency); v.nlfo(0.01, 0.07, hg.gain);
      h.connect(hbp); hbp.connect(hg); hg.connect(out);
      v.c.f = ctl(wbp.frequency, 420);
    }, amb);
    // 虹：高处 A 大九和弦的微光——每个音都有一个差 4.5 音分的影子（慢慢的拍），各自起伏
    beds.bow = new Bed((v, out) => {
      [[F.A5, 0.3, -0.5], [F.Cs6, 0.24, 0.35], [F.E6, 0.22, -0.2], [F.A6, 0.13, 0.55], [F.B6, 0.06, -0.6]].forEach(([f, g, p]) => {
        const tg = v.g(0.6), pn = v.p(p);
        v.lfo(rnd(0.12, 0.3), 0.35, tg.gain);
        [0, 4.5].forEach(dc => { const o = v.o('sine', f); o.detune.value = dc + rnd(-1, 1); const og = v.g(g * (dc ? 0.6 : 1)); o.connect(og); og.connect(tg); });
        tg.connect(pn); pn.connect(out);
      });
    }, mus);
    // 天梯上的天使：无字的合唱（A 大和弦），缓缓涌起
    beds.choir = new Bed((v, out) => {
      const src = choirInto(v, [F.A3, F.E4, F.A4, F.Cs5, F.E5], [1, 0.8, 0.7, 0.5, 0.32], { vib: 8 });
      const am = v.g(0.8);
      v.nlfo(0.004, 0.35, am.gain);
      src.connect(am); am.connect(out);
    }, mus);
    // 巴别的工程：同一的言语、同一的节律——A3 八分音般的脉动，E4 以其半应和，A2 两拍一沉（平滑的锯齿作包络：拨奏般的脉冲）
    beds.work = new Bed((v, out) => {
      const lp = v.f('lowpass', 1500, 0.6);
      [[F.A3, 2.2, 0.5, -0.3], [F.E4, 1.1, 0.34, 0.35], [F.A2, 0.55, 0.5, 0]].forEach(([f, rate, g, pan]) => {
        const o = v.o('triangle', f), am = v.g(0.5), og = v.g(g), pn = v.p(pan);
        v.lfo(rate, 0.5, am.gain, PW.ratchet);
        o.connect(am); am.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(out);
    }, mus);
    // 各卷的乐垫
    for (const id of PAD_IDS) if (PAD[id]) beds['pad_' + id] = padBed(PAD[id]);   // 创世记各卷 + 登记过的各卷（到需要时才建）
  }

  // ── 各卷的乐垫：每卷一个声床，内分几组声部，组与组之间交叉淡变（随卷中的光景）──
  // 声部：[f, 波形('s' 正弦 | 't' 三角 | PW 之名), 增益, 声像, 失谐(音分)]
  const PAD = {
    // 伊甸：明亮的 A 加九；堕落之后没有三音（A E B D）——悬而未决
    eden: { lp: 1900, groups: {
      bright: [[F.A2, 's', 0.5, -0.1], [F.E3, 'soft', 0.42, 0.15], [F.A3, 'soft', 0.24, -0.3, -4], [F.Cs4, 'soft', 0.22, 0.35], [F.E4, 's', 0.15, -0.4], [F.B4, 's', 0.07, 0.5]],
      fallen: [[F.A2, 's', 0.5, 0.1], [F.E3, 'soft', 0.4, -0.15], [F.B3, 'soft', 0.17, -0.3], [F.D4, 'soft', 0.16, 0.3]],
    } },
    // 该隐：低处的 A 小七（A E C G）；求告耶和华的名、以诺与神同行之后，大三度回来
    cain: { lp: 800, groups: {
      dark: [[F.A1, 's', 0.5, 0], [F.E2, 'soft', 0.4, 0.1], [F.C3, 'soft', 0.3, -0.3], [F.E3, 'soft', 0.16, 0.25], [F.G3, 's', 0.12, 0.35]],
      hope: [[F.A2, 's', 0.42, 0], [F.E3, 'soft', 0.34, 0.2], [F.Cs4, 'soft', 0.19, -0.3], [F.E4, 's', 0.09, 0.4]],
    } },
    // 洪水：忧伤（A 小 b6）→ 暴风雨里只剩低处的挂四 → 水退之后清澈开阔的 A 加九
    flood: { lp: 900, groups: {
      grief: [[F.A1, 's', 0.5, 0], [F.E2, 'soft', 0.38, 0.1], [F.C3, 'soft', 0.22, -0.3], [F.F3, 's', 0.1, 0.35]],
      storm: [[F.A1, 'soft', 0.5, 0], [F.D2, 'soft', 0.28, -0.2], [F.E2, 'soft', 0.32, 0.2]],
      clear: [[F.A2, 's', 0.42, 0], [F.E3, 'soft', 0.34, -0.2], [F.B3, 's', 0.15, 0.35], [F.Cs4, 'soft', 0.19, -0.35], [F.E4, 's', 0.11, 0.4], [F.A4, 's', 0.055, -0.5]],
    } },
    // 巴别：开阔的挂二 → 同一的言语（八度的齐声）→ 变乱（Bb、D#、F 的裂缝）
    babel: { lp: 1300, groups: {
      calm: [[F.A2, 's', 0.42, 0], [F.E3, 'soft', 0.36, -0.2], [F.B3, 'soft', 0.17, 0.3], [F.E4, 's', 0.09, -0.4]],
      one: [[F.A2, 's', 0.45, 0], [F.A3, 'soft', 0.28, -0.15, -3], [F.A3, 'soft', 0.28, 0.15, 3], [F.E4, 'soft', 0.18, 0.3]],
      broken: [[F.A2, 's', 0.34, 0], [F.Bb2, 'soft', 0.1, -0.5], [F.E3, 'soft', 0.24, 0.4], [F.Ds4, 's', 0.06, -0.3], [F.F4, 's', 0.045, 0.5]],
    } },
    // 亚伯拉罕：旷野的白昼（挂二，开阔）；星空之夜（A 大七 #11——利底亚的惊奇）；惊人的大黑暗
    abraham: { lp: 1500, groups: {
      day: [[F.A2, 's', 0.45, 0], [F.E3, 'soft', 0.37, -0.15], [F.B3, 'soft', 0.2, 0.3], [F.E4, 's', 0.11, -0.35], [F.Fs4, 's', 0.05, 0.45]],
      night: [[F.A2, 's', 0.42, 0], [F.E3, 'soft', 0.33, 0.15], [F.Cs4, 'soft', 0.17, -0.3], [F.Gs4, 's', 0.065, 0.35], [F.Ds5, 's', 0.032, -0.45]],
      dark: [[F.A1, 's', 0.4, 0], [F.E2, 'soft', 0.3, 0.1], [F.C3, 's', 0.13, -0.2]],
    } },
    // 雅各：牧场的 A6（A C# E F#）；夜里挂二；示剑的黑暗
    jacob: { lp: 1500, groups: {
      day: [[F.A2, 's', 0.45, 0], [F.E3, 'soft', 0.35, -0.2], [F.Cs4, 'soft', 0.2, 0.3], [F.Fs4, 's', 0.09, -0.4]],
      night: [[F.A2, 's', 0.42, 0], [F.E3, 'soft', 0.32, 0.2], [F.B3, 'soft', 0.19, -0.3], [F.E4, 's', 0.11, 0.35]],
      shadow: [[F.A1, 's', 0.45, 0], [F.E2, 'soft', 0.3, 0.1], [F.C3, 'soft', 0.16, -0.25]],
    } },
    // 约瑟：迦南的牧场 → 埃及（A 的低音持续，Bb 与 D 的 Hijaz 色彩）→ 歌珊（Bb 淡去）→ 平安（纯净的 A 大）
    joseph: { lp: 1500, groups: {
      canaan: [[F.A2, 's', 0.45, 0], [F.E3, 'soft', 0.35, -0.2], [F.Cs4, 'soft', 0.2, 0.3], [F.Fs4, 's', 0.09, -0.4]],
      egypt: [[F.A1, 's', 0.34, 0], [F.A2, 'soft', 0.32, -0.1], [F.E3, 'soft', 0.28, 0.2], [F.Bb3, 's', 0.055, -0.4], [F.D4, 'soft', 0.1, 0.35]],
      goshen: [[F.A1, 's', 0.34, 0], [F.A2, 'soft', 0.32, -0.1], [F.E3, 'soft', 0.28, 0.2], [F.Cs4, 'soft', 0.13, -0.35], [F.D4, 's', 0.05, 0.4]],
      peace: [[F.A2, 's', 0.45, 0], [F.E3, 'soft', 0.36, -0.2], [F.A3, 'soft', 0.25, 0.25], [F.Cs4, 'soft', 0.21, -0.35], [F.E4, 's', 0.13, 0.4]],
    } },
  };
  // 各卷的分量：底鸣（造物主之声，比第一卷轻）与乐垫
  const ACT_MUS = {
    eden: { drone: 0.5, pad: 1 }, cain: { drone: 0.75, pad: 0.95 }, flood: { drone: 0.7, pad: 0.95 }, babel: { drone: 0.5, pad: 0.9 },
    abraham: { drone: 0.6, pad: 0.95 }, jacob: { drone: 0.5, pad: 0.95 }, joseph: { drone: 0.55, pad: 1 },
  };
  // 一组可以是声部的数组，也可以是 { v: 声部, pulse: [Hz, 深度], breath: Hz }（登记的各卷用）；
  // 声部的波形还可以是 'choir'：同组所有 'choir' 声部合成一个无字的合唱（成对的锯齿经元音共振峰）
  const NATIVE = { sine: 1, triangle: 1, sawtooth: 1, square: 1 };
  const CHOIR_MK = 4.5;                                       // 合唱经共振峰后变轻：补回来，与正弦声部同一响度（离线测得）
  function padBed(spec) {
    return new Bed((v, out) => {
      const lp = v.f('lowpass', spec.lp, 0.5);
      v.c.lp = ctl(lp.frequency, spec.lp);
      v.c.g = {};
      let gi = 0;
      for (const name in spec.groups) {
        const G = Array.isArray(spec.groups[name]) ? { v: spec.groups[name] } : spec.groups[name];
        const gg = v.g(0), br = v.g(0.8);
        v.lfo(fin(G.breath) ? G.breath : 0.043 + 0.021 * gi, 0.2, br.gain);   // 每组各有一口缓慢的呼吸（乘在组的增益之后：组静默时它也静默）
        let head = gg;
        if (G.pulse && fin(G.pulse[0]) && fin(G.pulse[1])) {                  // 脉动：软锯齿的起伏（窑匠的轮、围城的鼓……）
          const d = clamp(G.pulse[1], 0, 1), pu = v.g(1 - d / 2);
          v.lfo(G.pulse[0], d / 2, pu.gain, PW.ratchet);
          gg.connect(pu); head = pu;
        }
        head.connect(br); br.connect(lp);
        v.c.g[name] = ctl(gg.gain, 0);
        const ch = [];
        for (const [f, wv, g, pan, det] of G.v || []) {
          if (!fin(f) || !fin(g) || g <= 0) continue;
          if (wv === 'choir') { ch.push([f, g]); continue; }
          const o = v.o(wv === 's' ? 'sine' : wv === 't' ? 'triangle' : PW[wv] || (NATIVE[wv] ? wv : PW.soft), f);
          o.detune.value = det != null ? det : rnd(-3, 3);
          const og = v.g(g);
          o.connect(og);
          if (pan && hasPan) { const pn = v.p(pan); og.connect(pn); pn.connect(gg); } else og.connect(gg);
        }
        if (ch.length) {
          const src = choirInto(v, ch.map(c => c[0]), ch.map(c => c[1]), { vib: 7, vibHz: rnd(4.6, 5.4) }), mk = v.g(CHOIR_MK);
          src.connect(mk); mk.connect(gg);
        }
        gi++;
      }
      lp.connect(out);
    }, () => N.bus.mus.in);
  }
  // 乐垫各组的分量与低通（随本卷的程度）
  function padMix(id, night) {
    switch (id) {
      case 'eden': {
        const b = smoothstep(0.25, 0.85, clamp(lvlOr('edenGlow', 1), 0, 1));
        return { g: { bright: b, fallen: 1 - b }, lp: lerp(850, 1900, b) };
      }
      case 'cain': {
        const h = clamp(Math.max(lvl('cainCall'), lvl('cainWalk'), lvl('cainComfort') * 0.8, lvl('cainTaken')), 0, 1);
        const d = clamp(Math.max(lvl('cainDark'), lvl('cainBlood')), 0, 1);
        return { g: { dark: 1 - h * 0.85, hope: h }, lp: lerp(800, 1400, h) * (1 - 0.5 * d) };
      }
      case 'flood': {
        const s = clamp(lvl('storm'), 0, 1);
        const cl = clamp(Math.max(smoothstep(0.45, 0.9, lvl('ararat')), lvl('rainbow'), 0.5 * lvl('flGrace')), 0, 1) * (1 - s);
        return { g: { storm: s, clear: cl, grief: Math.max(0, 1 - s - cl) }, lp: s > 0.5 ? lerp(900, 520, s) : lerp(900, 2200, cl) };
      }
      case 'babel': {
        const one = clamp(lvl('babelOne'), 0, 1), br = (1 - one) * clamp(lvl('babelShaft'), 0, 1);
        return { g: { one, broken: br, calm: Math.max(0, 1 - one - br) }, lp: 1300 - 400 * br };
      }
      case 'abraham': {
        const dk = clamp(lvl('abDark'), 0, 1), nk = Math.max(smoothstep(0.3, 0.8, night), clamp(lvl('abStars'), 0, 1)) * (1 - dk);
        return { g: { day: (1 - nk) * (1 - dk), night: nk, dark: dk }, lp: lerp(1500, 2400, nk) * (1 - 0.7 * dk) };
      }
      case 'jacob': {
        const sh = clamp(lvl('jbShadow'), 0, 1), nk = smoothstep(0.3, 0.8, night);
        return { g: { day: (1 - nk) * (1 - sh), night: nk * (1 - sh), shadow: sh }, lp: lerp(1500, 1100, nk) * (1 - 0.45 * sh) };
      }
      case 'joseph': {
        const pc = clamp(lvl('jsPromise'), 0, 1), e = clamp(lvl('jsEgypt'), 0, 1), gs = clamp(lvl('jsGoshen'), 0, 1);
        return { g: { canaan: (1 - e) * (1 - pc), egypt: e * (1 - gs) * (1 - pc), goshen: e * gs * (1 - pc), peace: pc },
          lp: lerp(1500, 900, clamp(lvl('jsFamine'), 0, 1)) * (1 + 0.3 * clamp(lvl('jsWith'), 0, 1)) };
      }
    }
    return null;
  }

  // ── 其后各卷的乐曲：登记表 ─────────────────────────────────
  // js/music/*.js 用 GS.audio.music(id, spec) 登记一卷的乐曲（在 init 之前或之后都可以），不必再改本文件：
  //   spec = {
  //     pad:   { lp, night?, groups: { 组名: [[音名|Hz, 波形, 增益, 声像, 失谐?], ...] | { v: [...], pulse: [Hz, 深度], breath: Hz } } },
  //     mix:   (lvl, night, x) => ({ g: { 组名: 0..1 }, lp, drone?, dlp?, pad?, tc? }),   // 每 0.1 秒；Σg > 1 时按比例缩小
  //     weight:{ drone, pad },                                                             // 同 ACT_MUS
  //     scale: 'maj' | [半音...] | (lvl, night, x) => SC 的键名或半音数组,
  //     motif: (t, g, api) => 下一句的间隔（秒 | [min, max] | 不返回则取 gap） | 借用的创世记一卷之名（'cain'…）,
  //     motif2:(t, g, api) => 间隔（次要的一层，可无）, gap: [min, max], gap2: [min, max],
  //     coda:  秒（只对全书的末一卷有意义：末一句之后乐声再留多久才归于安息）,
  //   }
  //   波形：'s' 正弦 · 't' 三角 · PW 之名（soft warm reed over voice flute harp oud drone grit）· 'sawtooth' 等 · 'choir'（合唱）
  //   lvl(k)：本卷的程度（未定义为 0）；x = { clamp, lerp, smoothstep, lvOr, W }；api 见下面的 MAPI。
  const MUS = {};
  const PAD_IDS = ACT_IDS.slice();
  const MX = { clamp, lerp, smoothstep, sm: smoothstep, lvOr: lvlOr, W };
  const pair = (x, d) => (Array.isArray(x) && fin(x[0]) && fin(x[1]) ? [Math.min(x[0], x[1]), Math.max(x[0], x[1])] : d);
  function music(id, spec) {
    id = String(id == null ? '' : id).trim();
    if (!id || id === 'seven' || !spec || typeof spec !== 'object') return false;
    const R = {
      mix: typeof spec.mix === 'function' ? spec.mix : null,
      scale: typeof spec.scale === 'function' ? spec.scale : scaleOf(spec.scale) ? (() => spec.scale) : null,
      motif: typeof spec.motif === 'function' || typeof spec.motif === 'string' ? spec.motif : null,
      motif2: typeof spec.motif2 === 'function' || typeof spec.motif2 === 'string' ? spec.motif2 : null,
      id, gap: pair(spec.gap, [12, 20]), gap2: pair(spec.gap2, [4, 8]), coda: fin(spec.coda) ? clamp(spec.coda, 0, 120) : 0, bad: {},
    };
    const P = spec.pad;
    if (P && P.groups && typeof P.groups === 'object') {
      const groups = {};
      let n = 0;
      for (const name in P.groups) {
        const src = P.groups[name], G = Array.isArray(src) ? { v: src } : Object.assign({}, src);
        G.v = (Array.isArray(G.v) ? G.v : []).map(x => {
          const f = Array.isArray(x) ? hz(x[0]) : NaN;
          if (!fin(f) || f < 16 || f > 12000) { err('music ' + id, 'bad note ' + JSON.stringify(x)); return null; }
          return [f, x[1] || 's', fin(x[2]) ? clamp(x[2], 0, 1) : 0.1, fin(x[3]) ? clamp(x[3], -1, 1) : 0, fin(x[4]) ? x[4] : null];
        }).filter(Boolean);
        groups[name] = G;
        n += G.v.length;
      }
      if (n) {
        const old = beds['pad_' + id];
        if (old) old.stop();
        PAD[id] = { lp: fin(P.lp) ? P.lp : 1500, night: fin(P.night) ? clamp(P.night, 0, 1) : 0.25, groups };
        if (PAD_IDS.indexOf(id) < 0) PAD_IDS.push(id);
        if (N) beds['pad_' + id] = padBed(PAD[id]);           // 已 init：立即登记声床（仍要到需要时才建）
      }
    }
    const w = spec.weight || {};
    ACT_MUS[id] = { drone: fin(w.drone) ? clamp(w.drone, 0, 1.2) : 0.55, pad: fin(w.pad) ? clamp(w.pad, 0, 1.2) : 0.95 };
    MUS[id] = R;
    return true;
  }
  // 登记的一卷出错时只记一次（不让错误刷屏），并退回无害的默认
  function regErr(R, k, e) { if (!R.bad[k]) { R.bad[k] = 1; err('music ' + R.id + '.' + k, e); } }
  function regMix(id, night) {
    const R = MUS[id];
    if (!R || !R.mix) return null;
    let m = null;
    try { m = R.mix(lvl, night, MX); } catch (e) { regErr(R, 'mix', e); return null; }
    if (!m || typeof m !== 'object') return null;
    const g = {}, src = m.g || {};
    let sum = 0;
    for (const k in src) { const x = fin(src[k]) ? clamp(src[k], 0, 1) : 0; g[k] = x; sum += x; }
    if (sum > 1) for (const k in g) g[k] /= sum;            // 组与组相加不超过一个整组：与创世记的乐垫同一响度
    return { g, lp: fin(m.lp) ? m.lp : PAD[id] ? PAD[id].lp : 1500, drone: fin(m.drone) ? clamp(m.drone, 0, 1.5) : 1,
      dlp: fin(m.dlp) ? clamp(m.dlp, 0.3, 2) : null, pad: fin(m.pad) ? clamp(m.pad, 0, 1.3) : 1, tc: fin(m.tc) ? clamp(m.tc, 0.2, 8) : 2.2 };
  }
  function regScale(R) {
    let s = null;
    try { s = R.scale(lvl, W.night || 0, MX); } catch (e) { regErr(R, 'scale', e); }
    return scaleOf(s) || SC.maj;
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
      harp: wave([1, 0.42, 0.24, 0.13, 0.08, 0.05, 0.03, 0.02]),  // 竖琴 / 里拉的弦（经渐暗的低通）
      flute: wave([1, 0.14, 0.06, 0.025]),                       // 牧笛：近乎正弦，一点点二次谐波
      oud: wave([1, 0.72, 0.5, 0.4, 0.3, 0.22, 0.16, 0.12, 0.09, 0.06]), // 乌德：更亮、更多泛音的拨弦
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
    for (const k of ['pluck', 'star', 'whale', 'moo', 'bleat', 'theme', 'themeCheck', 'song', 'm1', 'm2']) nx[k] = t + rnd(3, 10);
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
  let actNow = 0, lastAct = -1, endAt = -1;
  // 按住言说时，世界（与乐声）让开多少：越庄重的话，让得越多
  const DEEP_DUCK = { human: 1, behold: 1, holy: 1, judge: 1, name: 1 };
  function tick(dt) {
    const t = T(), lv = W.lv, st = W.stage | 0, nst = NST();
    const night = W.night || 0, dayF = W.dayFactor == null ? 1 : W.dayFactor;
    const holding = !!(W.ritual && W.ritual.holding);
    if (st !== lastStage) { if (st !== nst - 1) breathN = 0; lastStage = st; }
    const hk = hold ? hold.kind : '';
    bedBuilt = false;

    // 卷：七日之后，造物主之声以每卷自己的色彩回来（比第一卷轻）；全书终了，缓缓归于安息
    const act = W.act | 0, later = act >= 1, id = later ? actId() : 'seven', AM = ACT_MUS[id] || null;
    if (act !== lastAct) { lastAct = act; nx.m1 = t + rnd(5, 9); nx.m2 = t + rnd(6, 12); }
    // 全书讲完（末一句成就之后）：乐声归于安息；登记的末一卷可以带一段尾声（spec.coda 秒）再退去
    const ended = st >= bookLen();
    if (!ended) endAt = -1; else if (endAt < 0) endAt = t;
    const coda = later && MUS[id] ? MUS[id].coda : 0;
    const am = later && (!ended || t - endAt < coda) ? 1 : 0;
    actNow += (am - actNow) * (1 - Math.exp(-dt / (am ? 2.5 : 7)));
    if (!am && actNow < 0.002) actNow = 0;

    // 造物主之声（第一卷）：七息里渐渐退去，安息之后（约 20 秒）止息；声床随之拆除
    const div = later ? 0 : st >= nst ? 0 : st === nst - 1 ? Math.max(0.3, 1 - 0.1 * breathN) : 1;
    if (divNow < 0) divNow = div;
    divNow += (div - divNow) * (1 - Math.exp(-dt / (st >= nst ? 6 : 2)));
    if (divNow < 0.002 && div === 0) divNow = 0;
    const thin = st >= nst - 1 ? 0.3 : 1;                 // 圣日之后：和声变薄
    const deepDuck = !!DEEP_DUCK[hk];
    // 卷与卷之间落下幕布时，世界的声音也随之低下去
    const curtain = clamp((lv.curtain || 0), 0, 1);
    const duck = (holding ? (deepDuck ? 0.4 : 0.7) : 1) * (1 - 0.6 * curtain);
    set(C.duckA, duck, holding ? 0.35 : 1.4);
    set(C.duckM, (holding ? (deepDuck ? 0.5 : later ? 0.72 : 1) : 1) * (1 - 0.5 * curtain), holding ? 0.5 : 1.6);
    set(C.rev, 0.5 + 0.5 * (lv.vault || 0), 2.5);      // 穹苍张开，空间变大

    const rain = clamp(lvl('rain'), 0, 1), storm = clamp(lvl('storm'), 0, 1), sea = clamp(lvl('flSea'), 0, 1);
    const dry = clamp(Math.max(lvl('jsFamine'), lvl('abDrought'), lvl('jbDrought')), 0, 1);

    // 登记过的一卷：本拍的混音（底鸣与乐垫共用）
    const RM = later && MUS[id] && MUS[id].mix ? regMix(id, night) : null;
    // 底鸣：第一卷随日子调准；其后各卷是已调准的 A，轻一些，随卷的色彩开合
    const dl = later ? actNow * (AM ? AM.drone : 0.5) * (RM ? RM.drone : 1) : divNow;
    const d = beds.drone.want(lv.deep * LV.drone * dl, later ? 0.6 : st >= nst ? 0.3 : 2);
    if (d) {
      const ch = stageChaos(st), tuned = ch === 55;
      const dk = RM && RM.dlp != null ? RM.dlp : id === 'cain' ? 0.8 : id === 'flood' ? 1 + 0.6 * storm : lvl('abDark') > 0.3 ? 0.75 : 1;
      set(d.c.chaos, ch, 3); set(d.c.ochaos, ch, 3); set(d.c.sub, stageSub(st), 2.7);
      set(d.c.lp, lerp(170, 95, night) * dk, 2); set(d.c.olp, lerp(520, 300, night) * dk, 2);
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

    // 各卷的乐垫：只有当前的一卷在响，前一卷的缓缓散去
    for (let i = 0; i < PAD_IDS.length; i++) {
      const k = PAD_IDS[i], b = beds['pad_' + k];
      if (!b) continue;
      const on = later && k === id;
      const x = b.want(on ? actNow * LV.pad * (AM ? AM.pad : 1) * (RM ? RM.pad : 1) : 0, on ? 2.5 : 2);
      if (x && on && x.c.g) {
        const m = MUS[k] && MUS[k].mix ? RM : padMix(k, night);
        if (m) {
          for (const g in x.c.g) set(x.c.g[g], m.g[g] || 0, m.tc || 2.2);
          const nl = fin(PAD[k].night) ? PAD[k].night : k === 'abraham' ? 0 : 0.25;   // 夜里低通合上多少
          set(x.c.lp, clamp(m.lp * (1 - nl * night), 200, 6000), 2);
        }
      }
    }
    // 巴别的工程节律：同一的言语时忙碌，变乱时戛然而止
    const one = clamp(lvl('babelOne'), 0, 1);
    const busy = id === 'babel' ? clamp(lvl('babelWork'), 0, 1) * (0.35 + 0.65 * one) * (1 - clamp(lvl('babelShaft'), 0, 1) * (1 - one)) : 0;
    beds.work.want(busy * LV.work * actNow, busy > 0.05 ? 2 : 0.45);
    // 天梯上的天使（雅各）
    beds.choir.want(id === 'jacob' ? clamp(lvl('jbLadder'), 0, 1) * LV.choir * Math.max(0.3, actNow) : 0, 2.5);
    // 雨、暴风雨、虹（世界的程度，哪一卷定义都可以）
    const rn = beds.rain.want(rain * LV.rain, 1.2);
    if (rn) set(rn.c.lp, 3600 + 3200 * rain, 1.5);
    const sm = beds.storm.want(storm * LV.storm, 1.5);
    beds.bow.want(clamp(lvl('rainbow'), 0, 1) * LV.bow * (1 - 0.7 * storm), 3);

    // 海（洪水时海浪汹涌）
    const w = beds.water.want(lv.deep * LV.water * (1 - 0.45 * night) * (1 + 0.8 * sea), 2);
    if (w) {
      set(w.c.foam, 0.3 + 0.7 * (lv.land || 0) + 0.2 * Math.abs(W.wind || 0) + 0.8 * sea, 2);
      set(w.c.lp, 480 + 200 * (lv.land || 0) + 450 * sea, 3);
      if (w.c.pan) set(w.c.pan, -0.35 * (lv.land || 0), 3);
    }
    const sp = W.spirit;
    const over = sp && sp.y > W.horizonY && W.isSea(sp.x, sp.y) ? 1 : 0;
    const stir = lv.deep * over * clamp(((sp && sp.speed) || 0) / 700, 0, 1);
    const s = beds.stir.want(stir * LV.stir, stir > 0.02 ? 0.12 : 0.5);
    if (s) { if (s.c.pan) set(s.c.pan, panX(sp.x), 0.15); set(s.c.f, 520 + 500 * W.seaDepth(sp.y), 0.3); }
    // 风（神叫风吹地、暴风、旱年的干风都让它更响）
    const blow = Math.max(storm * 0.6, lvl('flWind') * 0.8, dry * 0.35);
    const gust = Math.min(1, Math.abs(W.wind || 0) + blow);
    const wd = beds.wind.want((lv.vault || 0) * LV.wind * (0.12 + 0.88 * Math.pow(gust, 1.6)) * (1 - 0.4 * night * (1 - blow)), 0.8);
    if (wd) { set(wd.c.f, 280 + 700 * gust, 0.8); set(wd.c.wf, 700 + 900 * gust, 0.8); if (wd.c.pan) set(wd.c.pan, clamp(W.wind || 0, -1, 1) * 0.6, 1); }
    if (sm) set(sm.c.f, 300 + 450 * storm + 250 * gust, 1);
    // 叶（大雨盖过叶声；旱年叶稀）
    const leaf = (lv.trees || 0) * (0.25 + 0.75 * gust) * LV.leaves * (1 - 0.7 * dry) * (1 - 0.8 * rain);
    beds.leaves.want(leaf, 1.2);
    // 夜虫（言说时、雨里都安静下来）
    const cr = beds.crickets.want(W.popN('creeper') > 0 ? smoothstep(0.35, 0.8, night) * LV.cricket * (holding ? 0.15 : 1) * (1 - rain) : 0, 1.5);
    if (cr) scheduleCrickets(cr, t);

    generate(dt, t, st, nst, night, dayF, holding, rain);
    if (later && am) generateAct(t, id, night, dayF, holding);
  }

  // 生成的事件：大地的拨弦、星的轻鸣、鸟、鲸、气泡、啃草、远处的牛羊、人的主题
  function generate(dt, t, st, nst, night, dayF, holding, rain) {
    const lv = W.lv, calm = (holding ? 0.1 : 1) * (1 - 0.85 * (rain || 0)), q = W.quality < 0.75 ? 0.6 : 1;
    const rested = st >= nst, later = (W.act | 0) >= 1;
    const day = smoothstep(0.35, 0.8, dayF) * (1 - night);
    // 地的拨弦（第三日起，每 6–14 秒一个五声音）
    if (t >= nx.pluck) {
      nx.pluck = t + (rested ? rnd(9, 20) : rnd(6, 14));
      // 其后各卷：拨弦随本卷的音阶（埃及的 Hijaz、该隐的小调……）
      if ((lv.grass || 0) > 0.5 && !holding && calm > 0.5) pluck(later ? deg(scaleNow(), F.A3, rint(0, 8)) : pent(F.A3, rint(0, 8)), rnd(0, 0.1), LV.pluck * (0.6 + 0.4 * day), rnd(0.05, 0.75), 0.9, 'amb');
    }
    // 星的轻鸣（夜里，每 2–5 秒）
    // 「你向天观看，数算众星」：数不过来的星，轻鸣也更密
    if (t >= nx.star) {
      const many = clamp(lvl('abStars'), 0, 1);
      nx.star = t + rnd(2, 5) / (1 + 2 * many);
      if ((lv.stars || 0) > 0.5 && night > 0.45 && !holding && calm > 0.5) ping(later ? deg(scaleNow(), F.A5, rint(0, 7)) : pent(F.A5, rint(0, 7)), rnd(0, 0.1), LV.star * night * (1 + 0.4 * many), rnd(-0.8, 0.8), 'amb');
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

  // ── 其后各卷的乐句（稀疏；言说时、幕布落下时都静候）─────────────
  // 里拉：本卷音阶上的一句，多为级进，偶有跳进与回转；末音更长
  function lyre(base, n, g, pan, sc, o) {
    o = o || {};
    sc = sc || scaleNow();
    const L = sc.length, ns = [];
    let dir = Math.random() < 0.5 ? 1 : -1, i = rint(0, L - 1) + (dir < 0 ? L : 0), at = 0;
    for (let k = 0; k < n; k++) {
      const last = k === n - 1;
      ns.push([deg(sc, base, i), at, g * rnd(0.8, 1) * (last ? 1.1 : 1), last ? 3.6 : 2.6]);
      at += (o.gap || rnd(0.24, 0.34)) * (k === n - 2 ? 1.5 : 1);
      i += dir * (Math.random() < 0.8 ? 1 : 2);
      if (Math.random() < 0.18) dir = -dir;
    }
    strings(ns, { bus: 'mus', prio: 0, pan, rev: 0.6, bright: o.bright || 5, d: 2.8, wave: o.wave });
  }
  // 牧笛：大调五声上的一句（附点的节奏），收在 A 或 E
  const RHY = [[0.25, 0.25, 0.5], [0.375, 0.125, 0.5], [0.5, 0.25, 0.25], [0.25, 0.5, 0.25, 0.75]];
  function shepherd(g, pan) {
    const n = rint(4, 7), ns = [], beat = rnd(0.42, 0.52), r = RHY[rint(0, RHY.length - 1)];
    let i = rint(5, 8);
    for (let k = 0; k < n; k++) {
      const last = k === n - 1;
      ns.push([deg(SC.maj, F.A3, last ? (Math.random() < 0.6 ? 5 : 8) : i), (last ? 1.4 : r[k % r.length] * 2) * beat, k % 2 ? 0.85 : 1]);
      i = clamp(i + (Math.random() < 0.7 ? (Math.random() < 0.5 ? 1 : -1) : (Math.random() < 0.5 ? 2 : -2)), 4, 11);
    }
    pipe(ns, { g: g * 0.5, pan, bright: 5, breath: 0.2, vib: 9, bus: 'mus', rev: 0.6 });
  }
  // 苇笛（旷野）：缓慢、滑入的长音，多是下行，收在 A 或 E
  function ney(g, pan) {
    const sc = scaleNow(), L = sc.length, n = rint(3, 5), ns = [];
    let i = L + rint(0, L - 1);
    for (let k = 0; k < n; k++) {
      const last = k === n - 1;
      ns.push([last ? (Math.random() < 0.5 ? F.A4 : F.E4) : deg(sc, F.A3, i), last ? rnd(1.6, 2.2) : rnd(0.7, 1.3), 1 - k * 0.06]);
      i += Math.random() < 0.65 ? -1 : 1;
    }
    pipe(ns, { g: g * 0.5, pan, bend: true, bright: 3, breath: 0.45, vib: 14, vibHz: 4.8, bus: 'mus', rev: 0.7 });
  }
  // 乌德（埃及）：Hijaz 上的一串拨弦——b2 与增二度，指滑入音，落在 A 或 E
  function oud(g, pan) {
    const n = rint(5, 8), ns = [], beat = rnd(0.17, 0.22), pat = [1, 1, 2, 1, 1, 2, 2, 4];
    let i = rint(0, 4), at = 0;
    for (let k = 0; k < n; k++) {
      const last = k === n - 1;
      ns.push([last ? (Math.random() < 0.6 ? F.A3 : F.E3) : deg(SC.hijaz, F.A3, i), at, g * (k % 2 ? 0.75 : 1) * rnd(0.85, 1), last ? 1.6 : 0.9]);
      at += pat[k % pat.length] * beat;
      i = clamp(i + (Math.random() < 0.72 ? (Math.random() < 0.55 ? -1 : 1) : (Math.random() < 0.5 ? 2 : -2)), -2, 9);
    }
    strings(ns, { wave: PW.oud, bend: true, bright: 9, d: 0.9, bus: 'mus', prio: 0, pan, rev: 0.4, spread: 0.15 });
  }
  // 弓弦的长音（该隐、忧伤、示剑的黑暗）
  function bowed(f, g, pan) {
    note({ f, type: PW.warm, lp: Math.min(1400, f * 4), g, a: 2.2, s: 1.4, r: 4, vib: [4.6, 0.0035], pan, bus: 'mus', rev: 0.6, prio: 0 });
    if (Math.random() < 0.4) note({ f: f * 1.5, type: PW.warm, lp: Math.min(1600, f * 5), g: g * 0.45, a: 2.6, s: 0.8, r: 3.5, at: 1.2, vib: [4.3, 0.003], pan: -pan, bus: 'mus', rev: 0.6, prio: 0 });
  }
  // 水晶般的高音（水退之后、虹）
  function glass(g, n) {
    n = n || rint(1, 3);
    for (let k = 0; k < n; k++) {
      const f = deg(SC.maj, F.A5, rint(0, 5)), at = k * rnd(0.6, 1.0), p = rnd(-0.7, 0.7);
      note({ f, g, a: 0.004, d: rnd(2.5, 3.5), at, pan: p, rev: 0.8, bus: 'mus', prio: 0 });
      note({ f: f * 2.76, g: g * 0.08, a: 0.003, d: 0.5, at, pan: p, bus: 'mus', prio: 0 });
    }
  }
  // 变乱的口音：同一句话的碎片，各在各的调上（另一种"语言"），散在左右
  const TONGUES = [1, 3, 6, 8, 10, 11, 2, 5];
  function tongues(g) {
    const base = semi(F.A4, TONGUES[rint(0, TONGUES.length - 1)] - (Math.random() < 0.5 ? 12 : 0));
    const n = rint(2, 3), p = rnd(-0.9, 0.9), ns = [];
    let i = rint(0, 4), at = 0;
    if (Math.random() < 0.5) {
      for (let k = 0; k < n; k++) { ns.push([deg(SC.maj, base, i), at, g * rnd(0.7, 1)]); at += rnd(0.12, 0.22); i += Math.random() < 0.5 ? 1 : -1; }
      strings(ns, { bus: 'mus', prio: 0, pan: p, spread: 0, d: 1.6, bright: 5, rev: 0.55 });
    } else {
      for (let k = 0; k < n; k++) { ns.push([deg(SC.maj, base, i), rnd(0.15, 0.3)]); i += Math.random() < 0.5 ? 1 : -1; }
      pipe(ns, { g: g * 0.5, pan: p, bright: 4, breath: 0.3, vib: 6, bus: 'mus', rev: 0.55 });
    }
  }
  // 天梯：天使上去下来——一串上行或下行的玻璃音
  function angelRun(g) {
    const up = Math.random() < 0.5, n = rint(4, 6), i0 = up ? rint(0, 2) : rint(6, 8), ns = [];
    for (let k = 0; k < n; k++) ns.push([deg(SC.maj, F.A5, up ? i0 + k : i0 - k), k * 0.13, g * (0.7 + 0.3 * (up ? k / n : 1 - k / n)), 2.2]);
    strings(ns, { wave: 'sine', bright: 2, d: 2.2, bus: 'mus', prio: 0, pan: up ? -0.2 : 0.2, spread: 0.2, rev: 0.8 });
  }
  // 数不过来的星：利底亚音阶上的一声玻璃
  function starPing(g) {
    const f = deg(SC.lyd, F.A5, rint(0, 11)), p = rnd(-0.85, 0.85);
    note({ f, g: g * rnd(0.5, 0.9), a: 0.002, d: rnd(1.4, 2.4), pan: p, rev: 0.85, bus: 'mus', prio: 0 });
    note({ f: f * 2.76, g: g * 0.06, a: 0.002, d: 0.3, pan: p, bus: 'mus', prio: 0 });
  }
  // 创世记各卷的乐句（登记过的一卷也可以借用：motif: 'cain'……）；返回下一句的间隔
  function genesisMotif(id, g, night, pan) {
    let gap = rnd(12, 20);
    switch (id) {
      case 'eden': {
        const fallen = lvlOr('edenGlow', 1) < 0.5;
        lyre(fallen ? F.A3 : F.A4, fallen ? 3 : rint(4, 6), g * (fallen ? 0.8 : 1), pan());
        gap = fallen ? rnd(20, 32) : rnd(11, 18);
        break;
      }
      case 'cain': {
        if (scaleNow() === SC.maj) { shepherd(g * 0.85, pan()); gap = rnd(18, 28); }
        else { bowed([F.A2, F.C3, F.E3, F.D3, F.G3][rint(0, 4)], g * 0.9, pan()); gap = rnd(15, 26); }
        break;
      }
      case 'flood': {
        if (lvl('storm') > 0.35) gap = rnd(6, 10);                  // 暴风雨本身就是音乐
        else if (scaleNow() === SC.maj) { glass(g * 0.8); gap = rnd(8, 14); }
        else { bowed([F.A2, F.C3, F.E3, F.F3][rint(0, 3)], g * 0.85, pan()); gap = rnd(16, 26); }
        break;
      }
      case 'babel': {
        const br = (1 - lvl('babelOne')) * lvl('babelShaft');
        if (br > 0.3) { tongues(g); gap = rnd(1.4, 3.4); }          // 变乱：各说各的
        else if (lvl('babelWork') > 0.3) gap = rnd(8, 12);          // 工程的节律由声床奏出
        else { lyre(lvl('babelAge') > 0.2 ? F.A3 : F.A4, rint(3, 5), g * 0.8, pan()); gap = rnd(15, 26); }
        break;
      }
      case 'abraham': {
        if (lvl('abDark') > 0.5) gap = rnd(10, 16);
        else if (night > 0.5 || lvl('abStars') > 0.3) { lyre(F.A4, rint(3, 5), g * 0.75, pan(), SC.lyd); gap = rnd(16, 24); }
        else { ney(g, pan()); gap = rnd(15, 25); }
        break;
      }
      case 'jacob': {
        if (lvl('jbShadow') > 0.5) { bowed([F.A2, F.C3, F.E3][rint(0, 2)], g * 0.85, pan()); gap = rnd(16, 24); }
        else if (night > 0.5) { lyre(F.A3, rint(3, 5), g * 0.8, pan()); gap = rnd(18, 26); }
        else { shepherd(g, pan()); gap = rnd(14, 22); }
        break;
      }
      case 'joseph': {
        if (lvl('jsPromise') > 0.5) { lyre(F.A4, rint(3, 5), g * 0.7, pan(), SC.maj); gap = rnd(18, 26); }
        else if (scaleNow() === SC.hijaz) { oud(g, pan()); gap = rnd(12, 20) * (1 + lvl('jsFamine')); }
        else { shepherd(g, pan()); gap = rnd(14, 22); }
        break;
      }
    }
    return gap;
  }
  // 次要的一层：数不过来的星、天梯上的天使、虹下的玻璃音
  function genesisMotif2(id, g) {
    let gap = rnd(4, 8);
    if (id === 'abraham' && lvl('abStars') > 0.3) { starPing(g); gap = rnd(0.8, 2.2) / (0.5 + lvl('abStars')); }
    else if (id === 'jacob' && lvl('jbLadder') > 0.4) { angelRun(g * 0.8); gap = rnd(4, 7); }
    else if (lvl('rainbow') > 0.4) { glass(g * 0.6, 1); gap = rnd(6, 10); }
    return gap;
  }
  // 登记过的一卷：它自己的乐句（出错只记一次，照常排下一句）
  const gapOf = (r, d) => (fin(r) ? Math.max(0.3, r) : Array.isArray(r) && fin(r[0]) && fin(r[1]) ? rnd(r[0], r[1]) : rnd(d[0], d[1]));
  function regMotif(R, t, g, night, pan, second) {
    const fn = second ? R.motif2 : R.motif;
    if (typeof fn === 'string') return second ? genesisMotif2(fn, g) : genesisMotif(fn, g, night, pan);
    if (typeof fn !== 'function') return second ? genesisMotif2(typeof R.motif === 'string' ? R.motif : '', g) : rnd(R.gap[0], R.gap[1]);
    let r;
    try { r = fn(t, g, MAPI); } catch (e) { flush(); regErr(R, second ? 'motif2' : 'motif', e); }
    return gapOf(r, second ? R.gap2 : R.gap);
  }
  function generateAct(t, id, night, dayF, holding) {
    if (holding || actNow < 0.5 || (W.lv.curtain || 0) > 0.15) return;
    const g = LV.motif * actNow, pan = () => rnd(-0.6, 0.7), R = MUS[id];
    if (t >= nx.m1) {
      nx.m1 = t + 15;                                      // 乐句里若出错，也不每拍重试
      nx.m1 = t + (R ? regMotif(R, t, g, night, pan, false) : genesisMotif(id, g, night, pan));
    }
    if (t >= nx.m2) {
      nx.m2 = t + 6;
      nx.m2 = t + (R ? regMotif(R, t, g, night, pan, true) : genesisMotif2(id, g));
    }
  }
  // 给登记的乐句用的乐器与工具：音名可用 F 表的写法（'A3' 'Cs4' 'Bb2'）；一律在乐声总线上、可舍的优先级
  const waveOf = x => (typeof x !== 'string' ? x : x === 's' ? 'sine' : x === 't' ? 'triangle' : PW && PW[x] ? PW[x] : NATIVE[x] ? x : PW ? PW.soft : 'sine');
  const mus0 = o => {
    const r = Object.assign({ bus: 'mus', prio: 0 }, o || {});
    if (r.type != null) r.type = waveOf(r.type);
    if (r.wave != null) r.wave = waveOf(r.wave);
    if (Array.isArray(r.types)) r.types = r.types.map(waveOf);
    return r;
  };
  const MAPI = {
    F, SC, hz, deg: (sc, base, i) => deg(scaleOf(sc) || scaleNow(), hz(base), i), semi: (b, s) => semi(hz(b), s), rnd, rint,
    pick: a => a[rint(0, a.length - 1)], lv: lvl, lvOr: lvlOr, W, clamp, lerp, smoothstep,
    night: () => W.night || 0, scale: () => scaleNow(), third: () => thirdNow(), pan: () => rnd(-0.6, 0.7),
    lyre: (base, n, g, pan, sc, o) => lyre(hz(base), n, g, pan, scaleOf(sc) || undefined, o),
    shepherd: (g, pan) => shepherd(g, pan), ney: (g, pan) => ney(g, pan), oud: (g, pan) => oud(g, pan),
    bowed: (f, g, pan) => bowed(hz(f), g, pan), glass: (g, n) => glass(g, n), angelRun: g => angelRun(g), starPing: g => starPing(g), tongues: g => tongues(g),
    strings: (ns, o) => strings(ns.map(n => [hz(n[0]), n[1], n[2], n[3]]), mus0(o)),
    pipe: (ns, o) => pipe(ns.map(n => [hz(n[0]), n[1], n[2]]), mus0(o)),
    choir: (fs, o) => choir(fs.map(hz), mus0(o)),
    note: o => note(Object.assign(mus0(o), { f: hz(o && o.f) })),
    chord: (fs, o) => chord(fs.map(hz), mus0(o)),
    bells: (fs, gap, g, d, at, o) => bells(fs.map(hz), gap, g, d, at, mus0(o)),
    pluck: (f, at, g, pan, d) => pluck(hz(f), at, g, pan, d, 'mus'),
    ping: (f, at, g, pan) => ping(hz(f), at, g, pan, 'mus'),
    knocks: (hits, o) => knocks(hits, mus0(o)),
    burst: o => burst(mus0(o)),
    motif: (id, g) => genesisMotif(id, g, W.night || 0, () => rnd(-0.6, 0.7)),   // 借一段创世记的乐句（返回它的间隔）
    sfx: (name, o) => GS.audio.sfx(name, o),
  };

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
    // ── 其后各卷的话语 ──
    // 护理（'act'，神的作为）：温暖的低垫（带本卷的三音）与一缕高处的恩光，底下一口气息
    providence(h) {
      const lp = h.f('lowpass', 260, 0.7), g = h.g(0);
      [[F.A2, 'sine', 0.7, 0], [F.E3, 'triangle', 0.3, -0.25], [semi(F.A3, thirdNow()), PW.soft, 0.22, 0.3]].forEach(([f, ty, gg, p]) => {
        const o = h.o(ty, f); o.detune.value = rnd(-3, 3);
        const og = h.g(gg), pn = h.p(p);
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(g); g.connect(h.out);
      const hi = h.g(0), sh = h.g(0.7);
      h.lfo(0.3, 0.3, sh.gain);
      [[F.A5, 1, -0.35], [F.E6, 0.6, 0.35]].forEach(([f, gg, p]) => {
        const o = h.o('sine', f); o.detune.value = rnd(-4, 4);
        const og = h.g(gg), pn = h.p(p);
        o.connect(og); og.connect(pn); pn.connect(sh);
      });
      sh.connect(hi); hi.connect(h.out);
      const n = h.nz('pink'), bp = h.f('bandpass', 900, 0.8), am = h.g(0.8), ng = h.g(0);
      h.lfo(0.22, 0.25, am.gain);
      n.connect(bp); bp.connect(am); am.connect(ng); ng.connect(h.out);
      return c => { to(lp.frequency, 260 + 1000 * c, 0.12); to(g.gain, 0.13 * Math.pow(c, 1.2), 0.12); to(hi.gain, 0.012 * c * c, 0.2); to(ng.gain, 0.12 * c, 0.12); };
    },
    // 发问（「你在哪里？」）：没有三音的挂留（A E B D），上方一缕悬着的 E5 在后半浮现；气息的滤波随充盈上扬
    ask(h) {
      const lp = h.f('lowpass', 320, 0.7), g = h.g(0);
      [[F.A2, 'sine', 0.7, 0], [F.E3, 'triangle', 0.3, -0.25], [F.B3, PW.soft, 0.24, 0.3], [F.D4, PW.soft, 0.16, -0.35]].forEach(([f, ty, gg, p]) => {
        const o = h.o(ty, f); o.detune.value = rnd(-3, 3);
        const og = h.g(gg), pn = h.p(p);
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(g); g.connect(h.out);
      const q = h.o('sine', F.E5), qt = h.g(0.7), qg = h.g(0), qp = h.p(0.3);
      h.lfo(0.4, 0.3, qt.gain);
      q.connect(qt); qt.connect(qg); qg.connect(qp); qp.connect(h.out);
      const n = h.nz('pink'), bp = h.f('bandpass', 600, 1.2), ng = h.g(0);
      n.connect(bp); bp.connect(ng); ng.connect(h.out);
      return c => {
        to(lp.frequency, 320 + 1300 * c, 0.12); to(g.gain, 0.13 * Math.pow(c, 1.2), 0.12);
        to(qg.gain, 0.018 * smoothstep(0.35, 0.9, c), 0.2); to(bp.frequency, 600 + 1800 * c, 0.15); to(ng.gain, 0.12 * c, 0.12);
      };
    },
    // 审判：庄重而低——轻的地鸣、A1 的低吟、小三度的阴影，每 2.2 秒一声低沉的钟（不是暴力）
    judge(h) {
      const r = rumble(h, 36, 90, 0.24, 0.2);
      const o = h.o(PW.grit, F.A1), lp = h.f('lowpass', 110, 0.7), hum = h.g(0);
      o.connect(lp); lp.connect(hum); hum.connect(h.out);
      const m3 = h.o('sine', F.C3), e2 = h.o('sine', F.E2), mg = h.g(0), eg = h.g(0);
      m3.connect(mg); e2.connect(eg); mg.connect(h.out); eg.connect(h.out);
      h.toll = T() + 0.5;
      return c => {
        r(c); to(lp.frequency, 110 + 190 * c, 0.12); to(hum.gain, 0.055 * Math.pow(c, 1.5), 0.1);
        to(mg.gain, 0.022 * c, 0.2); to(eg.gain, 0.04 * c, 0.2);
        const t = T();
        if (h.toll < t) h.toll = t + 0.05;
        while (h.toll < t + 0.3) { tollBell(F.A1, 0.03 + 0.05 * c, 5, h.toll - t, 0, h.out, 0.55); h.toll += 2.2; }
      };
    },
    // 应许：温暖、金色、上升——A 大和弦的音自低而高一个个亮起（亮起时一声金色的轻鸣），低通随之打开
    promise(h) {
      const lp = h.f('lowpass', 500, 0.7), g = h.g(1);
      const fs = [F.A2, F.E3, F.A3, F.Cs4, F.E4, F.A4, F.Cs5, F.E5], G = [0.07, 0.05, 0.045, 0.04, 0.033, 0.026, 0.019, 0.014];
      const gs = fs.map((f, i) => {
        const o = h.o(i < 3 ? 'sine' : PW.soft, f); o.detune.value = rnd(-3, 3);
        const og = h.g(0), pn = h.p(((i % 2) ? 1 : -1) * (0.08 + 0.07 * i));
        o.connect(og); og.connect(pn); pn.connect(lp);
        return og;
      });
      lp.connect(g); g.connect(h.out);
      const n = h.nz('pink'), bp = h.f('bandpass', 1200, 0.8), ng = h.g(0);
      n.connect(bp); bp.connect(ng); ng.connect(h.out);
      h.lit = 0;
      return c => {
        to(lp.frequency, 500 + 2200 * c, 0.15);
        const on = Math.min(fs.length, Math.floor(1 + c * 8.5)), k0 = 0.4 + 0.6 * smoothstep(0, 0.3, c);
        for (let i = 0; i < fs.length; i++) to(gs[i].gain, i < on ? G[i] * k0 : 0, i < on ? 0.35 : 0.2);
        for (let k = Math.max(h.lit, 3); k < on; k++) ping(fs[k] * 2, 0, 0.02, ((k % 2) ? 1 : -1) * 0.45, 'rit');
        if (on > h.lit) h.lit = on;
        to(ng.gain, 0.06 * c, 0.15);
      };
    },
    // 呼唤（「亚伯拉罕！」）：清亮的号角般的长音 E4 与 A3，一呼一吸般的起伏；远处有回声
    call(h) {
      const lp = h.f('lowpass', 700, 0.7), pulse = h.g(0.78), g = h.g(0);
      h.lfo(0.6, 0.22, pulse.gain);
      [[F.E4, 0.5, 0.2, 2], [F.A3, 0.42, -0.2, -2], [F.A4, 0.12, 0.05, 1]].forEach(([f, gg, p, dc], i) => {
        const o = h.o(i < 2 ? PW.warm : 'sine', f); o.detune.value = dc;
        h.lfo(4.8 + i * 0.3, 4, o.detune);
        const og = h.g(gg), pn = h.p(p);
        o.connect(og); og.connect(pn); pn.connect(lp);
      });
      lp.connect(pulse); pulse.connect(g); g.connect(h.out);
      const echo = h.g(0.9);
      h.out.connect(echo); echo.connect(N.revIn);                       // 呼唤在远处回响（随言说的总音量一同收去）
      return c => { to(lp.frequency, 700 + 1600 * c, 0.12); to(g.gain, 0.2 * Math.pow(c, 1.1), 0.1); };
    },
    // 新名（亚伯兰→亚伯拉罕、雅各→以色列）：玻璃般的微粒越聚越密，钟一般的 A 音一层层亮起
    rename(h) {
      const cr = crackler(h, 2600, 7200, 3.2, 0);
      const gs = [[F.A2, 0.08, 0], [F.A4, 0.04, -0.3], [F.E5, 0.028, 0.3], [F.A5, 0.018, -0.15], [F.Cs6, 0.012, 0.4]].map(([f, gg, p], i) => {
        const o = h.o('sine', f); o.detune.value = rnd(-3, 3);
        const tr = h.g(0.75), og = h.g(0), pn = h.p(p);
        if (i) h.lfo(rnd(0.2, 0.5), 0.25, tr.gain);
        o.connect(tr); tr.connect(og); og.connect(pn); pn.connect(h.out);
        return [og, gg, i];
      });
      return c => { cr(4 + 40 * c * c, 0.06 + 0.1 * c); gs.forEach(([og, gg, i]) => to(og.gain, gg * smoothstep(i * 0.12, i * 0.12 + 0.45, c), 0.15)); };
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
    if (idx >= NST()) return LATE_HOLD[kind] || 'word';  // 七日之后各卷的话语：按话语的种类
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

  // ── 其后各卷：话语的种类 → 按住时的声音 ──
  const LATE_HOLD = { act: 'providence', ask: 'ask', judge: 'judge', promise: 'promise', call: 'call', name: 'rename', cmd: 'word' };
  // ── 其后各卷：成就的手势（按话语的种类，带本卷的色彩）──
  const FUL_LATE = {
    // 护理：一口暖和弦（本卷的三音），上面几声竖琴
    act() {
      chord([F.A2, F.E3, semi(F.A3, thirdNow()), F.A3], { gs: [0.1, 0.07, 0.05, 0.035], a: 0.8, s: 0.8, r: 3.5, rev: 0.5, spread: 0.3 });
      harp({ soft: true, at: 0.35 });
      harpJustPlayed();
    },
    // 发问：挂留的和弦不解决，最上面一声 E5 在末尾向上一扬（F#5）——问句的语调；一口上扬的空气
    ask() {
      chord([F.A2, F.E3, F.B3, F.D4], { gs: [0.1, 0.07, 0.05, 0.04], a: 0.6, s: 1.2, r: 3.5, rev: 0.6, spread: 0.4 });
      note({ f: F.E5, path: [[F.E5, 0.9], [F.Fs5, 0.35]], g: 0.03, a: 0.3, s: 1.2, r: 2.5, rev: 0.7, pan: 0.2, prio: 2 });
      burst({ buf: 'pink', f: 500, f2: 2200, sweep: 2, q: 0.8, g: 0.05, a: 0.8, s: 0.3, r: 1.5, rev: 0.4, pan: -0.2, pan2: 0.3 });
    },
    // 审判：一声低沉的钟，A 小和弦在低处涌起又沉下；一口闷住的地声（不是雷，不是暴力）
    judge() {
      tollBell(F.A1, 0.1, 7, 0.05, 0, 'evt', 0.6);
      chord([F.A1, F.E2, F.C3], { gs: [0.11, 0.075, 0.045], a: 0.9, s: 1, r: 5, rev: 0.5, at: 0.1 });
      burst({ buf: 'brown', ft: 'lowpass', f: 220, q: 0.7, g: 0.16, a: 0.4, s: 0.6, r: 2.5, rev: 0.3 });
    },
    // 应许：金色的上行琶音，温暖的 A 大和弦，末了三声金铃
    promise() {
      strings([F.A3, F.Cs4, F.E4, F.A4, F.Cs5, F.E5, F.A5].map((f, i) => [f, 0.15 + i * 0.13, 0.042 * (1 - i * 0.05), 3]), { d: 3, bright: 5, rev: 0.6, prio: 2 });
      chord([F.A2, F.E3, F.A3, F.Cs4, F.E4], { gs: [0.09, 0.07, 0.055, 0.045, 0.035], a: 1.5, s: 2.5, r: 5, spread: 0.5, rev: 0.55, at: 0.2,
        types: ['sine', 'sine', 'triangle', 'triangle', 'triangle'] });
      bells([F.A5, F.Cs6, F.E6], 0.18, 0.045, 3, 1.1);
      harpJustPlayed();
    },
    // 呼唤：两声号角般的呼——E4，再 A4 长长地；远处回响
    call() {
      note({ f: F.E4, type: PW.warm, lp: 1800, g: 0.07, a: 0.08, s: 0.35, r: 1.4, rev: 0.8, vib: [5, 0.004], pan: -0.1, prio: 2 });
      note({ f: F.A4, type: PW.warm, lp: 2000, g: 0.065, a: 0.1, s: 1.1, r: 2.8, at: 0.75, rev: 0.85, vib: [5, 0.004], pan: 0.1, prio: 2 });
      note({ f: F.A3, type: PW.warm, lp: 900, g: 0.045, a: 0.3, s: 1.4, r: 3, at: 0.7, rev: 0.6, prio: 2 });
      note({ f: F.A2, g: 0.07, a: 0.5, s: 1.5, r: 3.5, rev: 0.4, prio: 2 });
    },
    // 新名：微粒聚拢，然后钟声组成一个 A 大和弦
    name() {
      grains({ buf: 'white', n: 40, dur: 2.2, f0: 2500, f1: 7000, len: 0.018, q: 2.8, g: 0.07, spread: 0.9, rev: 0.45, prio: 2 });
      bells([F.A4, F.Cs5, F.E5, F.A5], 0.15, 0.06, 3.5, 2.0);
      chord([F.A2, F.E3, F.A3, F.Cs4], { gs: [0.09, 0.07, 0.05, 0.04], a: 1.2, s: 2, r: 4.5, at: 1.6, spread: 0.4, rev: 0.55 });
      harpJustPlayed();
    },
    // 赐福：本卷音阶上的一阵轻拨，底下一口温暖的和弦
    bless() {
      const sc = scaleNow();
      for (let i = 0; i < 10; i++) pluck(deg(sc, F.A5, rint(0, sc.length + 1)), 0.3 + i * 0.2, 0.03, rnd(-0.9, 0.9), 0.6);
      chord([F.A2, F.E3, semi(F.A3, thirdNow())], { gs: [0.08, 0.06, 0.04], a: 1, s: 1.5, r: 4, rev: 0.5, spread: 0.3 });
      harpJustPlayed();
    },
    // 命令：与第一卷同一口开阔的五度，稍轻
    cmd() { chord([F.A1, F.E2, F.A2, F.E3], { gs: [0.13, 0.095, 0.07, 0.035], a: 0.5, s: 0.5, r: 3.5, rev: 0.45 }); },
    behold() { bells([F.A5, F.Cs6, F.E6], 0.16, 0.06, 2.8); chord([F.A2, F.E3, F.A3, F.Cs4], { gs: [0.08, 0.06, 0.045, 0.035], a: 1.2, s: 2, r: 5, spread: 0.5, rev: 0.55 }); },
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

  // ── 其后各卷的音效：GS.audio.sfx(name, { soft, far, low, size, x }) ──────
  // 选项 → 响度、声像、远近（x：像素，或 0..1 的比例）
  function sopt(o, defPan) {
    o = o && typeof o === 'object' ? o : {};
    const soft = !!o.soft, far = !!o.far, low = !!o.low;
    let pan = fin(defPan) ? defPan : 0;
    if (fin(o.x)) pan = o.x > 1.5 ? panX(o.x) : clamp(o.x * 2 - 1, -1, 1) * 0.8;
    else if (fin(o.pan)) pan = clamp(o.pan, -1, 1);
    return { soft, far, low, pan, k: (soft ? 0.6 : 1) * (far ? 0.55 : 1) * (fin(o.gain) ? clamp(o.gain, 0, 2) : 1),
      size: fin(o.size) ? clamp(o.size, 0.1, 8) : 1, at: fin(o.at) ? clamp(o.at, 0, 10) : 0 };
  }
  const landPan = () => rnd(0.1, 0.5);                   // 故事多在右边的陆地上发生

  // 竖琴：恩典与启示——最常听见的一声，所以每次都不同：上行、下行、滚奏的和弦、一声叹息、回音形；音阶随本卷
  let lastHarp = '';
  const HARP_SHAPES = ['up', 'down', 'roll', 'sigh', 'turn', 'up', 'roll'];
  function harp(o) {
    const s = sopt(o, rnd(-0.3, 0.3)), sc = scaleNow(), L = sc.length, th = thirdNow();
    let shape = HARP_SHAPES[rint(0, HARP_SHAPES.length - 1)];
    if (shape === lastHarp) shape = HARP_SHAPES[(HARP_SHAPES.indexOf(shape) + 1 + rint(0, 3)) % HARP_SHAPES.length];
    lastHarp = shape;
    const base = s.low ? F.A2 : (s.soft || Math.random() < 0.55) ? F.A4 : F.A3;
    const g = 0.042 * s.k, sp = rnd(0.1, 0.15), ns = [];
    let i = rint(0, L - 1), at = 0;
    switch (shape) {
      case 'up': {
        const n = s.soft ? rint(3, 4) : rint(4, 6);
        for (let k = 0; k < n; k++) { ns.push([deg(sc, base, i), at, g * rnd(0.85, 1) * (k === n - 1 ? 1.15 : 1), k === n - 1 ? 3.4 : 2.4]); at += sp * (1 + k * 0.08); i += Math.random() < 0.8 ? 1 : 2; }
        break;
      }
      case 'down': {
        i += L + rint(0, 2);
        const n = s.soft ? 3 : rint(4, 5);
        for (let k = 0; k < n; k++) { ns.push([deg(sc, base, i), at, g * rnd(0.85, 1), k === n - 1 ? 3.2 : 2.4]); at += sp * 1.1; i -= 1; }
        break;
      }
      case 'roll': [0, th, 7, 12, 12 + th].slice(0, s.soft ? 3 : rint(4, 5)).forEach((st, k) => ns.push([semi(base, st), k * rnd(0.045, 0.07), g * (1 - k * 0.08), 3.2])); break;
      case 'sigh': ns.push([deg(sc, base, i + 1), 0, g * 1.05, 1.8], [deg(sc, base, i), 0.42, g * 0.9, 3.4]); break;
      default: [0, 1, 2, 1, 0].forEach((d, k) => ns.push([deg(sc, base, i + d), k * sp, g * (k === 2 ? 1.1 : 0.9), k === 4 ? 3.2 : 2]));
    }
    strings(ns, { at: s.at, d: 2.6, bright: s.far ? 3.5 : 6, rev: s.far ? 0.8 : 0.55, pan: s.pan, spread: 0.3, prio: 1 });
  }
  // 风：一阵（low：低处的、不祥的风）
  function windSfx(o) {
    const s = sopt(o), dir = Math.random() < 0.5 ? 1 : -1;
    if (s.low) gust({ f0: 130, f1: 360, q: 1.2, g: 0.24 * s.k, dur: rnd(4.5, 6), p0: -0.5 * dir, p1: 0.5 * dir, rev: 0.45, at: s.at });
    else gust({ f0: rnd(280, 360), f1: rnd(850, 1100), q: 1.1, g: 0.22 * s.k, dur: rnd(3.5, 5), whistle: s.soft ? 0 : 0.05, p0: -0.65 * dir, p1: 0.65 * dir, rev: 0.3, at: s.at });
  }
  // 建造：锤声（木）或放石头（先一声刮擦，再一声沉的）
  function buildSfx(o) {
    const s = sopt(o, landPan()), heavy = Math.random() < 0.3, scrape = heavy && !s.soft;
    const n = s.soft ? rint(2, 3) : rint(3, 5), gap = rnd(0.34, 0.48), hits = [];
    if (scrape) burst({ buf: 'pink', f: 950, f2: 420, sweep: 0.35, q: 1.3, g: 0.03 * s.k, a: 0.06, d: 0.3, pan: s.pan, rev: 0.25, at: s.at });
    let at = scrape ? 0.32 : 0;
    for (let i = 0; i < n; i++) {
      hits.push([at, heavy ? rnd(650, 1050) : rnd(1500, 2600), heavy ? rnd(85, 115) : rnd(170, 270), (heavy ? 0.055 : 0.04) * s.k * rnd(0.75, 1), heavy]);
      at += gap * rnd(0.88, 1.12);
    }
    knocks(hits, { lp: s.far ? 2000 : 7000, pan: s.pan, rev: s.far ? 0.6 : 0.3, at: s.at });
  }
  // 哀哭：低低的哼唱般的叹息，一句比一句低（D→C#、C#→B、B→A；小调里 D→C）；low 是男声
  function weepSfx(o) {
    const s = sopt(o, landPan()), k = s.low ? 0.5 : 1, minor = thirdNow() === 3;
    const P = minor ? [[F.D4, F.C4], [F.C4, F.B3], [F.B3, F.A3]] : [[F.D4, F.Cs4], [F.Cs4, F.B3], [F.B3, F.A3]];
    const n = s.soft ? 2 : 3, ph = [];
    let at = 0;
    for (let i = 0; i < n; i++) {
      const dur = i === n - 1 ? 1.5 : rnd(0.95, 1.15);
      ph.push([at, dur, P[i][0] * k, P[i][1] * k, 0.032 * s.k * (1 - i * 0.12)]);
      at += dur + rnd(0.25, 0.4);
    }
    vox(ph, { F1: s.low ? 330 : 420, F2: s.low ? 820 : 960, q1: 4, q2: 6, vib: 18, breath: 0.6, sus: 0.55, att: 0.09, rev: 0.55, pan: s.pan, at: s.at });
  }
  // 雷：近处有一声裂响与碎响，然后滚动；far 只有远处的滚动；low+far 是一声深沉的单音（远处的、神的雷）
  function thunderSfx(o) {
    const s = sopt(o, rnd(-0.4, 0.4));
    if (s.low && s.far) {
      const k = s.soft ? 0.65 : 1;
      note({ f: F.A1, type: PW.soft, lp: 260, g: 0.07 * k, a: 0.5, s: 0.9, r: 3.8, rev: 0.6, prio: 2, at: s.at });
      note({ f: F.A0, g: 0.055 * k, a: 0.7, s: 0.7, r: 3.2, prio: 1, at: s.at });
      note({ f: F.E2, g: 0.018 * k, a: 0.8, s: 0.5, r: 3, rev: 0.6, at: s.at });
      burst({ buf: 'brown', ft: 'lowpass', f: 140, q: 0.7, g: 0.09 * k, a: 0.6, s: 0.6, r: 3, rev: 0.4, at: s.at });
      return;
    }
    const k = s.k, at = s.at + (s.far ? rnd(0.1, 0.4) : 0);
    if (!s.far) {
      burst({ buf: 'white', ft: 'highpass', f: 900, q: 0.5, g: 0.06 * k, a: 0.002, d: 0.35, at, pan: s.pan, rev: 0.6, prio: 2 });
      grains({ buf: 'white', n: 8, dur: 0.5, f0: 400, f1: 2400, len: 0.05, q: 1.2, g: 0.05 * k, at: at + 0.02, spread: 0.5, pan: s.pan, rev: 0.5 });
      note({ f: 50, path: [[34, 1.6]], g: 0.065 * k, a: 0.02, d: 2.2, at, prio: 1 });
    }
    roll({ f0: s.far ? 150 : 320, f1: s.far ? 70 : 90, g: (s.far ? 0.5 : 0.42) * k, a: s.far ? 0.5 : 0.06, s: 0.3, r: s.far ? 3.8 : 4.2,
      at: at + (s.far ? 0 : 0.05), pan: s.pan, rev: 0.5, depth: 0.6, prio: 2 });
  }
  // 坛上的火：火焰的身躯（低通的褐噪声）、一口"呼"、噼啪的火星
  function fireSfx(o) {
    const s = sopt(o, landPan()), k = s.k;
    burst({ buf: 'brown', ft: 'lowpass', f: 420, q: 0.7, g: 0.085 * k, a: 0.7, s: 2.6, r: 2.2, pan: s.pan, rev: 0.3, am: [0.7, 0.25], at: s.at });
    burst({ buf: 'pink', f: 900, f2: 1600, sweep: 1.2, q: 0.9, g: 0.03 * k, a: 0.4, s: 2, r: 2.2, pan: s.pan, rev: 0.3, at: s.at });
    grains({ buf: 'white', n: s.soft ? 16 : 30, dur: 4.6, f0: 1100, f1: 4200, len: 0.01, q: 1.6, g: 0.05 * k, spread: 0.25, pan: s.pan, rev: 0.25, at: s.at + 0.2 });
    if (!s.soft) grains({ buf: 'pink', n: 8, dur: 4, f0: 350, f1: 900, len: 0.03, q: 1.3, g: 0.04 * k, spread: 0.2, pan: s.pan, rev: 0.3, at: s.at + 0.5 });
  }
  // 封（关门、立约、封洞）：一声闷住的合上，低沉的钟，A 的五度在底下留一会儿
  function sealSfx(o) {
    const s = sopt(o), k = s.k;
    note({ f: 72, path: [[44, 0.3]], g: 0.13 * k, a: 0.004, d: 0.7, prio: 2, at: s.at });
    burst({ buf: 'brown', ft: 'lowpass', f: 300, q: 0.7, g: 0.2 * k, a: 0.004, d: 0.55, rev: 0.4, at: s.at });
    burst({ buf: 'white', f: 900, q: 2, g: 0.03 * k, a: 0.002, d: 0.08, at: s.at });
    tollBell(F.A1, 0.08 * k, 7, s.at + 0.03, 0, 'evt', 0.7);
    tollBell(F.A2, 0.045 * k, 5.5, s.at + 0.06, 0.1, 'evt', 0.7);
    chord([F.A1, F.E2, F.A2], { gs: [0.045 * k, 0.035 * k, 0.025 * k], a: 0.8, s: 1, r: 4, at: s.at + 0.2, rev: 0.6 });
  }
  // 众人的低语：几个声门般的声音（语调缓缓游移、音节一开一合）经元音的共振峰，外加一层气声
  function crowdSfx(o) {
    const s = sopt(o, landPan()), k = s.k, dur = s.soft ? 3 : 4.5;
    const v = voice(1);
    if (!v) return;
    const t = T() + s.at + 0.02, sum = v.g(1), nv = s.soft ? 3 : 5;
    for (let i = 0; i < nv; i++) {
      const f = rnd(100, 240), osc = v.o(PW.reed, f), am = v.g(0.3), pn = v.p(clamp(s.pan + rnd(-0.6, 0.6), -0.9, 0.9));
      v.nlfo(0.02, f * 0.25, osc.frequency);                   // 语调
      v.nlfo(rnd(0.025, 0.04), 1.2, am.gain);                  // 音节
      osc.connect(am); am.connect(pn); pn.connect(sum);
    }
    const out = v.g(1);
    [[560, 2.2, 1], [1250, 3, 0.55], [2600, 4, 0.15]].forEach(([f, q, g]) => { const bp = v.f('bandpass', f, q), gg = v.g(g); sum.connect(bp); bp.connect(gg); gg.connect(out); });
    const n = v.nz('pink'), nb = v.f('bandpass', 900, 0.8), na = v.g(0.35);
    v.nlfo(0.035, 0.9, na.gain);
    n.connect(nb); nb.connect(na); na.connect(out);
    const env = v.g(0);
    out.connect(env);
    const end = swell(env.gain, t, 0.9, 0.075 * k, Math.max(0.3, dur - 2.3), 1.4);
    v.out(env, 'evt', null, 0.35);
    v.play(t, end);
  }
  // 水花（size：0.4 是河边的一捧，3–4 是方舟落在山上）
  function splashSfx(o) {
    const s = sopt(o, rnd(-0.2, 0.4)), z = s.size, zz = Math.min(z, 4), k = s.k;
    burst({ buf: 'white', f: rnd(1000, 2200), q: 0.7, g: (0.035 + 0.035 * Math.sqrt(zz)) * k, a: 0.004, d: 0.15 + 0.12 * zz, pan: s.pan, rev: 0.3, at: s.at });
    if (z >= 1.5) {
      const b = Math.min(1, z / 4);
      note({ f: 95, path: [[42, 0.35]], g: 0.1 * b * k, a: 0.006, d: 0.5, pan: s.pan, at: s.at });
      burst({ buf: 'pink', ft: 'lowpass', f: 1200, f2: 300, sweep: 1.4, q: 0.6, g: 0.18 * b * k, a: 0.02, s: 0.2, r: 1.4, pan: s.pan, rev: 0.35, at: s.at });
    }
    grains({ buf: 'white', n: Math.round(4 + 5 * zz), dur: 0.4 + 0.25 * zz, f0: 1800, f1: 4200, len: 0.012, q: 5, g: 0.05 * k, at: s.at + 0.08, pan: s.pan, spread: 0.4, rev: 0.3 });
  }
  // 羊（有时是山羊，更高更颤）
  function bleatSfx(o) {
    const s = sopt(o, landPan()), goat = Math.random() < 0.35;
    sheep(s.at, s.pan, 0.07 * s.k, s.far, 'evt', goat ? rnd(290, 330) : null);
    if (!s.soft && Math.random() < 0.6) sheep(s.at + rnd(0.6, 1.2), clamp(s.pan + rnd(-0.25, 0.25), -1, 1), 0.045 * s.k, true, 'evt');
  }
  // 沉重的门：木轴的"咯吱"（黏滑的摩擦），然后一声闷响
  function gateSfx(o) {
    const s = sopt(o, landPan()), k = s.k, v = voice(1);
    if (v) {
      const t = T() + s.at + 0.02, f = rnd(58, 70), osc = v.o(PW.reed, f);
      osc.frequency.setValueAtTime(f, t); osc.frequency.linearRampToValueAtTime(f * 1.18, t + 0.9);
      v.nlfo(0.05, f * 0.1, osc.frequency);
      const am = v.g(0.55);
      v.lfo(rnd(16, 24), 0.45, am.gain, PW.ratchet);
      const bp = v.f('bandpass', 520, 2.5), lp = v.f('lowpass', 1800, 0.7), g = v.g(0);
      osc.connect(am); am.connect(bp); bp.connect(lp); lp.connect(g);
      const end = swell(g.gain, t, 0.25, 0.12 * k, 0.45, 0.3);
      v.out(g, 'evt', s.pan, 0.35);
      v.play(t, end);
    }
    const at = s.at + 1.0;
    note({ f: 66, path: [[40, 0.25]], g: 0.07 * k, a: 0.004, d: 0.6, at, pan: s.pan, prio: 2 });
    burst({ buf: 'brown', ft: 'lowpass', f: 320, q: 0.7, g: 0.13 * k, a: 0.004, d: 0.5, at, pan: s.pan, rev: 0.5 });
    burst({ buf: 'white', f: 750, q: 2.5, g: 0.045 * k, a: 0.002, d: 0.1, at, pan: s.pan });
  }
  // 一阵雨（持续的雨由 W.lv.rain 的声床奏出）
  function rainSfx(o) {
    const s = sopt(o), k = s.k;
    burst({ buf: 'white', ft: 'highpass', f: 900, q: 0.5, g: 0.075 * k, a: 1.4, s: 1.8, r: 2.6, pan: -0.3, pan2: 0.3, rev: 0.25, at: s.at });
    burst({ buf: 'pink', ft: 'lowpass', f: 1400, q: 0.6, g: 0.1 * k, a: 1.4, s: 1.8, r: 2.6, rev: 0.2, at: s.at });
    grains({ buf: 'white', n: 50, dur: 4.5, f0: 2500, f1: 6500, len: 0.006, q: 3, g: 0.06 * k, spread: 0.9, rev: 0.2, at: s.at + 0.3 });
  }
  // 鸽子：一阵扑翅，然后两声「咕—咕」
  function doveSfx(o) {
    const s = sopt(o, rnd(-0.3, 0.3)), k = s.k;
    if (!s.soft) burst({ buf: 'white', f: 1400, q: 1, g: 0.04 * k, a: 0.05, s: 0.25, r: 0.3, am: [14, 0.6], pan: s.pan, rev: 0.3, at: s.at });
    dove(s.at + 0.45, s.pan, 0.06 * k, 'evt');
  }
  // 骆驼（与驴）：喉中咕噜的低吼，常带几声驼铃
  function camelSfx(o, donkey) {
    const s = sopt(o, landPan()), k = s.k;
    const grumble = (at, f, dur, g) => {
      const v = voice(1);
      if (!v) return;
      const t = T() + at + 0.02, osc = v.o(PW.reed, f);
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.linearRampToValueAtTime(f * 1.28, t + dur * 0.25);
      osc.frequency.linearRampToValueAtTime(f * 0.8, t + dur);
      const am = v.g(0.5);
      v.lfo(rnd(22, 30), 0.5, am.gain);
      const f1 = v.f('bandpass', donkey ? 700 : 380, 3), f2 = v.f('bandpass', donkey ? 1400 : 850, 4), lp = v.f('lowpass', 1700, 0.7), g0 = v.g(0);
      osc.connect(am); am.connect(f1); am.connect(f2); f1.connect(lp); f2.connect(lp); lp.connect(g0);
      const end = swell(g0.gain, t, 0.1, g, Math.max(0.1, dur - 0.5), 0.4);
      v.out(g0, 'evt', s.pan, s.far ? 0.5 : 0.3);
      v.play(t, end);
    };
    grumble(s.at, donkey ? rnd(170, 210) : rnd(80, 105), rnd(0.9, 1.3), 0.13 * k);
    if (Math.random() < 0.5) grumble(s.at + rnd(1.2, 1.6), donkey ? rnd(150, 180) : rnd(75, 95), rnd(0.6, 0.9), 0.09 * k);
    if (!donkey && Math.random() < 0.65) {
      const n = rint(3, 5);
      for (let i = 0; i < n; i++) {
        const f = pent(F.A6, rint(0, 3)), at = s.at + 0.2 + i * rnd(0.2, 0.32);
        note({ f, g: 0.012 * k, a: 0.002, d: 0.6, at, pan: s.pan, rev: 0.45, prio: 0 });
        note({ f: f * 2.72, g: 0.003 * k, a: 0.002, d: 0.2, at, pan: s.pan, prio: 0 });
      }
    }
  }
  // 笑（撒拉、以撒——「神使我喜笑」）：几声轻轻的「哈」，与一串温暖的轻拨一同落下
  function laughSfx(o) {
    const s = sopt(o, landPan()), k = s.k, base = s.low ? 200 : rnd(380, 420), n = rint(5, 7), ph = [], ns = [];
    let at = 0;
    for (let i = 0; i < n; i++) {
      const f = base * (1.06 - i * 0.03);
      ph.push([at, 0.1, f, f * 0.93, 0.045 * k * (1 - i * 0.1)]);
      ns.push([deg(SC.maj, F.A5, 4 - i), at + 0.02, 0.02 * k * (1 - i * 0.08), 0.8]);
      at += 0.155 - i * 0.004;
    }
    vox(ph, { F1: s.low ? 650 : 820, F2: s.low ? 1100 : 1300, q1: 3, q2: 5, vib: 0, breath: 0.9, sus: 0.3, att: 0.012, rev: 0.4, pan: s.pan, at: s.at });
    strings(ns, { wave: 'triangle', bright: 3, d: 0.8, rev: 0.5, pan: s.pan, spread: 0.2, prio: 0, at: s.at });
  }
  // 天使：无字的合唱（A 大和弦）与高处的几声微光
  function angelSfx(o) {
    const s = sopt(o), k = s.k;
    choir([F.A3, F.Cs4, F.E4, F.A4, F.E5], { gs: [1, 0.8, 0.75, 0.6, 0.35], g: 0.065 * k, a: 1.4, s: 1.8, r: 3.4, rev: 0.8, at: s.at, pan: s.pan });
    for (let i = 0; i < 4; i++) ping(pent(F.A6, rint(0, 5)), s.at + 0.5 + i * rnd(0.3, 0.5), 0.018 * k, rnd(-0.7, 0.7), 'evt');
    note({ f: F.E6, g: 0.01 * k, a: 1, s: 1, r: 2.5, trem: [5.5, 0.5], rev: 0.8, at: s.at + 0.5 });
  }
  // 众星：玻璃般的轻鸣，散在天上（夜里用利底亚音阶）
  function starsSfx(o) {
    const s = sopt(o), k = s.k, sc = lvl('abStars') > 0.2 || (W.night || 0) > 0.5 ? SC.lyd : SC.maj, n = s.soft ? 4 : rint(6, 9);
    for (let i = 0; i < n; i++) {
      const f = deg(sc, F.A5, rint(0, sc.length * 2)), at = s.at + rnd(0, 2.4), p = rnd(-0.85, 0.85);
      note({ f, g: 0.034 * k * rnd(0.6, 1), a: 0.002, d: rnd(1.2, 2.2), at, pan: p, rev: 0.85, prio: 1 });
      note({ f: f * 2.76, g: 0.004 * k, a: 0.002, d: 0.3, at, pan: p, prio: 0 });
    }
  }
  // 乌鸦：两声粗哑的「呱」
  function ravenSfx(o) {
    const s = sopt(o, rnd(-0.5, 0.5));
    for (let i = 0; i < 2; i++) note({ f: rnd(640, 720), type: PW.reed, path: [[rnd(480, 540), 0.22]], lp: 2400, trem: [34, 0.5], g: 0.035 * s.k, a: 0.01, s: 0.08, r: 0.14, at: s.at + i * 0.42, pan: s.pan, rev: 0.4 });
  }
  // ── 旧约其余各卷的音效 ──────────────────────────────────────
  // 金属：一组非谐的正弦分音，各自衰减（钹、铃、砧、刀剑、锁链、银钱共用）；ps = [[f, g, d, dt?], ...]
  function metal(ps, o) {
    o = o || {};
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015, sum = v.g(1);
    let end = t;
    for (const [f, g, d, dt] of ps) {
      if (!fin(f) || !fin(g) || g <= 0 || f > 16000) continue;
      const x = v.o('sine', f), xg = v.g(0);
      x.detune.value = rnd(-6, 6);
      x.connect(xg); xg.connect(sum);
      end = Math.max(end, perc(xg.gain, t + Math.max(0, dt || 0), o.a || 0.002, g, d));
    }
    if (!v.s.length) { v.play(t, t); return; }
    v.out(sum, o.bus || 'evt', o.pan, o.rev == null ? 0.5 : o.rev);
    v.play(t, end);
  }
  // 一串击打的包络（不跳变：每一下从上一下衰减到的值接起）；list = [[t, peak, tc], ...]，返回最后归零的时刻
  function strikes(p, list, a) {
    a = a || 0.0015;
    list.sort((x, y) => x[0] - y[0]);
    let cur = 0, ct = -1, ctc = 1, last = 0;
    for (const [tn, pk, tc] of list) {
      const v0 = ct < 0 ? 0 : cur * Math.exp(-Math.max(0, tn - ct) / ctc);
      p.setValueAtTime(v0, tn);
      p.linearRampToValueAtTime(pk, tn + a);
      p.setTargetAtTime(0, tn + a, tc);
      cur = pk; ct = tn + a; ctc = tc; last = Math.max(last, ct + tc * 7);
    }
    return last;
  }
  // 铜管 / 角：簧片般的声源经"随响度打开"的低通（越响越亮）与一个鼻音的共振峰，外加气声与唇的颤动
  // ph = [[at, dur, fa, fb, g, fc?, glide?], ...]：音高 fa → fb（在 dur×glide 处）→ fc（句末）；逐句排程，句与句不重叠
  function brass(ph, o) {
    o = o || {};
    if (!ph.length) return;
    const v = voice(o.prio == null ? 1 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.02, br = o.bright || 5;
    const osc = v.o(o.wave || PW.reed, ph[0][2]);
    const vl = v.o('sine', o.vibHz || rnd(4.8, 5.6)), vg = v.g(o.vib == null ? 6 : o.vib);
    vl.connect(vg); vg.connect(osc.detune);
    const lp = v.f('lowpass', ph[0][2] * 2, 0.8), bp = v.f('bandpass', o.F1 || 1100, o.q1 || 2.2), gb = v.g(o.nasal == null ? 0.5 : o.nasal);
    const env = v.g(0), mix = v.g(1);
    osc.connect(lp); lp.connect(env); lp.connect(bp); bp.connect(gb); gb.connect(env);
    let x = env;
    if (o.buzz) { const am = v.g(1 - o.buzz[1] / 2); v.lfo(o.buzz[0], o.buzz[1] / 2, am.gain); env.connect(am); x = am; }
    x.connect(mix);
    const n = v.nz('pink'), nb = v.f('bandpass', o.Fb || 1600, 1), ng = v.g(0);
    n.connect(nb); nb.connect(ng); ng.connect(mix);
    const bk = o.breath == null ? 0.25 : o.breath;
    let end = t;
    for (const p of ph) {
      const [at, dur, fa, fb, g] = p, fc = p[5] || fb, gl = clamp(p[6] || 0.25, 0.05, 0.95);
      if (!fin(fa) || !fin(fb) || !fin(g) || !(dur > 0.03)) continue;
      const tt = t + Math.max(0, at), a = Math.min(o.att || 0.06, dur * 0.3), r = Math.min(o.rel || 0.2, dur * 0.35), fr = osc.frequency;
      fr.setValueAtTime(fa, tt);
      fr.exponentialRampToValueAtTime(fb, tt + dur * gl);
      fr.exponentialRampToValueAtTime(fc, tt + dur);
      lp.frequency.setValueAtTime(fa * 1.3, tt);
      lp.frequency.linearRampToValueAtTime(Math.min(9000, fb * br), tt + a * 1.6);
      lp.frequency.linearRampToValueAtTime(Math.min(9000, fc * br * 0.8), tt + dur - r);
      lp.frequency.linearRampToValueAtTime(fc * 1.3, tt + dur);
      env.gain.setValueAtTime(0, tt);
      env.gain.linearRampToValueAtTime(g, tt + a);
      env.gain.linearRampToValueAtTime(g * (o.sus == null ? 0.85 : o.sus), tt + dur - r);
      env.gain.linearRampToValueAtTime(0, tt + dur);
      ng.gain.setValueAtTime(0, tt);
      ng.gain.linearRampToValueAtTime(g * bk * 1.8, tt + a * 0.5);
      ng.gain.linearRampToValueAtTime(g * bk * 0.5, tt + a * 2);
      ng.gain.linearRampToValueAtTime(0, tt + dur);
      end = Math.max(end, tt + dur);
    }
    v.out(mix, o.bus || 'evt', o.pan, o.rev == null ? 0.55 : o.rev);
    v.play(t, end + 0.05);
  }
  // 羊角（shofar）：气息很重、带着唇的颤动；先低，跃上五度，末了还往上一扬。
  // 长声 tekiah · 三声 shevarim · 急促的九声 teruah（轮着来）；size 2–3 是几支角一同吹（约书亚记、士师记）
  let hornTurn = 0;
  function hornSfx(o) {
    const s = sopt(o, landPan()), k = s.k * (s.far ? 0.75 : 1), n = clamp(Math.round(s.size), 1, 3);
    const kind = ['tekiah', 'shevarim', 'tekiah', 'teruah'][hornTurn++ % 4];
    const lo = F.A3, hi = F.E4, g = 0.035 * k;
    let ph;
    if (kind === 'teruah') {
      ph = [];
      for (let i = 0; i < 9; i++) ph.push([i * 0.15, 0.115, hi * 0.95, hi, g * 0.8, hi, 0.35]);
      ph.push([1.42, s.soft ? 0.7 : 1.1, hi * 0.96, hi, g, hi * 1.025, 0.2]);
    } else if (kind === 'shevarim') ph = [0, 0.64, 1.28].map(at => [at, 0.52, lo * 0.97, hi, g * 0.9, hi * 1.01, 0.3]);
    else ph = [[0, 0.3, lo * 0.93, lo, g * 0.75, lo, 0.4], [0.33, s.soft ? 1.3 : 1.9, hi * 0.985, hi, g, hi * 1.03, 0.15]];
    for (let i = 0; i < n; i++) {
      const det = [1, 1.012, 0.991][i], pan = clamp(s.pan + [0, 0.25, -0.25][i], -0.9, 0.9);
      brass(ph.map(p => [p[0], p[1], p[2] * det, p[3] * det, p[4] * (i ? 0.7 : 1), p[5] * det, p[6]]), {
        at: s.at + i * 0.13, pan, bright: s.far ? 3.4 : 5.5, F1: 1250, q1: 2.5, nasal: 0.6, buzz: [rnd(26, 32), 0.24], breath: 0.4, Fb: 1500,
        att: 0.07, rel: 0.18, vib: 5, rev: s.far ? 0.8 : 0.55, prio: i ? 0 : 1 });
    }
  }
  // 银号：一对明亮的号（民数记 10:2），五度相和；长声，或"吹出大声"的急促几声（10:5）
  function trumpetSfx(o) {
    const s = sopt(o, rnd(-0.2, 0.4)), k = s.k * (s.far ? 0.75 : 1), g = 0.026 * k, alarm = !s.soft && Math.random() < 0.4;
    const line = (lo, hi) => (alarm
      ? [[0, 0.19, lo * 0.98, lo, g * 0.85, lo, 0.2], [0.25, 0.19, lo * 0.98, lo, g * 0.8, lo, 0.2], [0.5, 0.19, lo * 0.98, lo, g * 0.8, lo, 0.2], [0.76, 1.3, hi * 0.985, hi, g, hi, 0.1]]
      : [[0, 0.5, lo * 0.97, lo, g * 0.9, lo, 0.12], [0.56, s.soft ? 1 : 1.6, hi * 0.985, hi, g, hi * 1.004, 0.1]]);
    const opt = { wave: 'sawtooth', bright: s.far ? 4 : 7, F1: 1500, q1: 2, nasal: 0.35, breath: 0.1, Fb: 2600, att: 0.035, rel: 0.12, vib: 4, rev: s.far ? 0.75 : 0.5 };
    brass(line(F.A4, F.E5), Object.assign({ at: s.at, pan: clamp(s.pan + 0.15, -0.9, 0.9), prio: 1 }, opt));
    brass(line(F.E4, F.A4).map(p => (p[4] *= 0.75, p)), Object.assign({ at: s.at + 0.012, pan: clamp(s.pan - 0.15, -0.9, 0.9), prio: 0 }, opt));
  }
  // 狮子：远处低沉的一声吼（喉中的颤动，先扬后抑），随后几声渐短渐弱的低哼
  function lionSfx(o) {
    const s = sopt(o, landPan()), k = s.k * (s.far ? 0.8 : 1), v = voice(1);
    if (!v) return;
    const t = T() + s.at + 0.02, f = rnd(92, 108);
    const osc = v.o(PW.grit, f), am = v.g(0.6), lp = v.f('lowpass', s.far ? 520 : 900, 0.8), env = v.g(0);
    v.lfo(rnd(19, 25), 0.4, am.gain, PW.ratchet);
    const n = v.nz('brown'), nlp = v.f('lowpass', 420, 0.7), ng = v.g(0), mix = v.g(1);
    osc.connect(am); am.connect(lp); lp.connect(env); env.connect(mix);
    n.connect(nlp); nlp.connect(ng); ng.connect(mix);
    const ph = [[0, rnd(1.7, 2.2), 1]], m = s.soft ? 2 : rint(3, 4);
    let at = ph[0][1] + rnd(0.35, 0.5);
    for (let i = 0; i < m; i++) { const d = 0.5 - i * 0.06; ph.push([at, d, 0.62 - i * 0.12]); at += d + rnd(0.22, 0.32); }
    let end = t;
    for (const [a0, dur, amp] of ph) {
      const tt = t + a0, g = 0.1 * k * amp, first = a0 === 0;
      osc.frequency.setValueAtTime(f * (first ? 0.75 : 0.95), tt);
      osc.frequency.exponentialRampToValueAtTime(f * (first ? 1.3 : 1.05), tt + dur * (first ? 0.35 : 0.3));
      osc.frequency.exponentialRampToValueAtTime(f * (first ? 0.62 : 0.7), tt + dur);
      env.gain.setValueAtTime(0, tt);
      env.gain.linearRampToValueAtTime(g, tt + dur * (first ? 0.3 : 0.2));
      env.gain.linearRampToValueAtTime(0, tt + dur);
      ng.gain.setValueAtTime(0, tt);
      ng.gain.linearRampToValueAtTime(g * 1.1, tt + dur * 0.3);
      ng.gain.linearRampToValueAtTime(0, tt + dur);
      end = tt + dur;
    }
    v.out(mix, 'evt', s.pan, s.far ? 0.7 : 0.45);
    v.play(t, end + 0.05);
  }
  // 串铃：高处的一簇金属声，每一击后再抖两下；hits = [[at, 强弱], ...]
  function jingles(hits, g, o) {
    o = o || {};
    if (!hits.length) return;
    const v = voice(o.prio == null ? 0 : o.prio);
    if (!v) return;
    const t = T() + (o.at || 0) + 0.015;
    const n = v.nz('white'), hp = v.f('highpass', 4800, 0.7), bp = v.f('bandpass', o.f || 7400, 1.6), env = v.g(0);
    n.connect(hp); hp.connect(bp); bp.connect(env);
    const list = [];
    for (const [at, acc] of hits) {
      const tt = t + Math.max(0, at), a = g * (acc == null ? 1 : acc);
      list.push([tt, a, 0.035], [tt + 0.022, a * 0.55, 0.05], [tt + 0.05, a * 0.3, 0.08]);
    }
    const end = strikes(env.gain, list);
    v.out(env, o.bus || 'evt', o.pan, o.rev == null ? 0.35 : o.rev);
    v.play(t, end);
  }
  // 鼓（手鼓，米利暗、耶弗他的女儿拿着鼓跳舞）：6/8 的舞步——咚 · 嗒 咚 · 嗒 | 咚 · 嗒 咚 嗒嗒 | 咚；每一下都带着串铃
  function timbrelSfx(o) {
    const s = sopt(o, landPan()), k = s.k, beat = rnd(0.19, 0.23);
    const P = [[0, 1], [2, 0.5], [3, 0.8], [5, 0.5], [6, 1], [8, 0.5], [9, 0.8], [10, 0.45], [11, 0.5], [12, 1]];
    const n = s.soft ? 5 : P.length, hits = [], jt = [];
    for (let i = 0; i < n; i++) {
      const [st, acc] = P[i], at = st * beat + rnd(-0.008, 0.008), heavy = acc >= 0.8;
      hits.push([Math.max(0, at), heavy ? rnd(260, 340) : rnd(1400, 2000), heavy ? rnd(95, 112) : rnd(270, 320), (heavy ? 0.05 : 0.04) * acc * k, heavy]);
      jt.push([Math.max(0, at), heavy ? 0.9 : 0.6]);
    }
    knocks(hits, { q: 1.3, lp: s.far ? 2500 : 6000, pan: s.pan, rev: 0.35, at: s.at });
    jingles(jt, 0.05 * k, { pan: s.pan, at: s.at, rev: s.far ? 0.6 : 0.35 });
  }
  // 钹（殿中敲钹，代上 15:19）：一声"嚓"，然后一片慢慢散开的金属的光
  function cymbalSfx(o) {
    const s = sopt(o, rnd(-0.3, 0.3)), k = s.k, d = s.soft ? 1.3 : 2.4;
    burst({ buf: 'white', ft: 'highpass', f: 2800, q: 0.5, g: (s.soft ? 0.03 : 0.05) * k, a: 0.002, d, pan: s.pan, rev: 0.5, at: s.at });
    burst({ buf: 'white', f: 6500, q: 1.1, g: 0.04 * k, a: 0.001, d: 0.45, pan: s.pan, at: s.at });
    const P = [[430, 0.5], [615, 0.45], [1170, 0.35], [1635, 0.3], [2330, 0.25], [3310, 0.18], [4480, 0.12], [5870, 0.08]];
    metal(P.map(([f, g]) => [f * rnd(0.98, 1.02), g * 0.02 * k, d * rnd(0.6, 1)]), { pan: s.pan, rev: 0.55, at: s.at });
  }
  // 小铃（大祭司袍上的金铃、马的铃铛，亚 14:20）：几颗高处的小铃，叮叮当当
  function bellSfx(o) {
    const s = sopt(o, rnd(-0.3, 0.3)), k = s.k, n = s.soft ? 2 : rint(3, 6), base = s.low ? F.A5 : F.A6;
    let at = s.at;
    for (let i = 0; i < n; i++) {
      const f = pent(base, rint(0, 4)) * rnd(0.997, 1.003);
      metal([[f, 0.022 * k, 1.4], [f * 2.76, 0.007 * k, 0.5], [f * 5.4, 0.0025 * k, 0.22]], { at, pan: clamp(s.pan + rnd(-0.2, 0.2), -0.9, 0.9), rev: 0.5, prio: i ? 0 : 1 });
      at += rnd(0.09, 0.22) * (i % 3 === 2 ? 2 : 1);
    }
  }
  // 里拉（大卫的琴）：先一扫（低音弦与和弦），再一句短短的歌，落在 A 或 E；比竖琴暗、近
  function lyreSfx(o) {
    const s = sopt(o, rnd(0.1, 0.4)), sc = scaleNow(), L = sc.length, g = 0.042 * s.k, base = s.low ? F.A2 : F.A3, th = thirdNow(), ns = [];
    [0, 7, 12, 12 + th].forEach((st, i) => ns.push([semi(base, st), i * 0.035, g * (0.9 - i * 0.08), 2.8]));
    const n = s.soft ? 3 : rint(4, 6), R = [0.3, 0.15, 0.15, 0.3, 0.45];
    let at = 0.55, i = L + rint(0, 2);
    for (let j = 0; j < n; j++) {
      const last = j === n - 1, f = last ? (Math.random() < 0.6 ? semi(base, 12) : semi(base, 19)) : deg(sc, base, i);
      ns.push([f, at, g * (last ? 1 : 0.85), last ? 3 : 2]);
      at += R[j % R.length] * 1.4;
      i += Math.random() < 0.6 ? -1 : 1;
    }
    strings(ns, { wave: PW.harp, bright: 4.5, d: 2.4, pan: s.pan, spread: 0.2, rev: 0.45, prio: 1, at: s.at });
  }
  // 马蹄：四拍的奔跑（一步四下），先近后远；o: { at, dur, g, pan, far, prio }
  function hooves(o) {
    const hits = [], stride = rnd(0.34, 0.4), n = Math.max(2, Math.floor(o.dur / stride));
    for (let i = 0; i < n; i++) {
      const e = Math.sin(Math.PI * (i + 0.5) / n);
      [[0, 1], [0.055, 0.65], [0.13, 0.85], [0.19, 0.55]].forEach(([d, a]) =>
        hits.push([Math.max(0, i * stride + d + rnd(-0.008, 0.008)), rnd(900, 1400), rnd(120, 150), o.g * a * (0.3 + 0.7 * e), false]));
    }
    hits.sort((x, y) => x[0] - y[0]);
    knocks(hits, { q: 2, lp: o.far ? 1400 : 3200, pan: o.pan, rev: 0.35, at: o.at, prio: o.prio });
  }
  function hoovesSfx(o) {
    const s = sopt(o, landPan());
    hooves({ at: s.at, dur: s.soft ? 2 : 3.2, g: 0.05 * s.k, pan: s.pan, far: s.far });
    if (!s.soft && Math.random() < 0.5) snort(s.at + rnd(2.2, 2.8), s.pan, 0.07 * s.k);
  }
  // 战车：车轮的隆隆（褐噪声按车轮的颠簸起伏）、车身的咔嗒、奔马的蹄声；从一边驶来，从另一边远去
  function chariotSfx(o) {
    const s = sopt(o), k = s.k, dur = s.soft ? 3 : rnd(3.8, 4.8);
    const dir = s.pan > 0.1 ? -1 : s.pan < -0.1 ? 1 : Math.random() < 0.5 ? 1 : -1;
    const p0 = clamp(s.pan - 0.6 * dir, -0.9, 0.9), p1 = clamp(s.pan + 0.6 * dir, -0.9, 0.9);
    const v = voice(1);
    if (v) {
      const t = T() + s.at + 0.02;
      const n = v.nz('brown'), lp = v.f('lowpass', 200, 0.8), am = v.g(0.65), g = v.g(0);
      v.lfo(rnd(5.5, 7), 0.35, am.gain, PW.ratchet);
      n.connect(lp); lp.connect(am); am.connect(g);
      const r = v.nz('pink'), bp = v.f('bandpass', 700, 1.6), ram = v.g(0.5), rg = v.g(0.35);
      v.lfo(rnd(11, 14), 0.5, ram.gain, PW.ratchet);
      r.connect(bp); bp.connect(ram); ram.connect(rg); rg.connect(g);
      lp.frequency.setValueAtTime(180, t);
      lp.frequency.linearRampToValueAtTime(460, t + dur * 0.5);
      lp.frequency.linearRampToValueAtTime(190, t + dur);
      const end = swell(g.gain, t, dur * 0.45, 0.2 * k, dur * 0.1, dur * 0.45);
      const pn = v.p(p0);
      if (hasPan) { pn.pan.setValueAtTime(p0, t); pn.pan.linearRampToValueAtTime(p1, end); }
      g.connect(pn);
      v.out(pn, 'evt', null, s.far ? 0.6 : 0.35);
      v.play(t, end);
    }
    hooves({ at: s.at + 0.15, dur: dur * 0.85, g: 0.045 * k, pan: (p0 + p1) / 2, far: s.far, prio: 0 });
  }
  // 窑匠的轮：石轮低低的嗡（约 A1），每转一圈起伏一次；泥在手下"嘶"地转；脚踢轮盘，木声轻轻一下
  function wheelSfx(o) {
    const s = sopt(o, landPan()), k = s.k, dur = s.soft ? 3.2 : 4.8, rot = rnd(1.15, 1.45);
    const v = voice(1);
    if (v) {
      const t = T() + s.at + 0.02, f = F.A1 * rnd(0.99, 1.01);
      const hum = v.o(PW.soft, f), hg = v.g(0.3);
      hum.frequency.setValueAtTime(f * 0.82, t); hum.frequency.setTargetAtTime(f, t, 0.6);   // 越转越快，音也升上来
      const n = v.nz('pink'), bp = v.f('bandpass', 880, 1.4), ng = v.g(0.75), nm = v.g(0.6), am = v.g(0.65);
      v.lfo(rot, 0.3, am.gain); v.lfo(rot, 0.4, nm.gain);
      hum.connect(hg); hg.connect(am); n.connect(bp); bp.connect(ng); ng.connect(nm); nm.connect(am);
      const lp = v.f('lowpass', 1400, 0.6), env = v.g(0);
      am.connect(lp); lp.connect(env);
      const end = swell(env.gain, t, 0.9, 0.2 * k, Math.max(0.2, dur - 2.2), 1.3);
      v.out(env, 'evt', s.pan, 0.3);
      v.play(t, end);
    }
    const kicks = [], kp = rnd(1.1, 1.4);
    for (let a = 0.2; a < dur - 1; a += kp) kicks.push([a, rnd(450, 600), rnd(95, 115), 0.035 * k, true]);
    knocks(kicks, { lp: 1600, pan: s.pan, rev: 0.3, at: s.at, prio: 0 });
  }
  // 机弦（大卫的甩石）：甩几圈，一圈比一圈快（呼、呼、呼）；啪的放开，石子呼啸飞去，远处一声闷响
  function slingSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 2 : 3, dir = s.pan > 0 ? -1 : 1;
    let at = 0, per = 0.42;
    for (let i = 0; i < n; i++) {
      burst({ buf: 'pink', f: 500, f2: 1500, sweep: per * 0.5, q: 1.4, g: 0.065 * k * (0.7 + 0.3 * i / n), a: per * 0.35, s: 0, r: per * 0.45,
        pan: s.pan, pan2: clamp(s.pan + 0.15, -1, 1), at: s.at + at, rev: 0.2, prio: i ? 0 : 1 });
      at += per; per *= 0.8;
    }
    burst({ buf: 'white', ft: 'highpass', f: 2200, q: 0.6, g: 0.05 * k, a: 0.001, d: 0.06, pan: s.pan, at: s.at + at });
    burst({ buf: 'white', f: 3200, f2: 1400, sweep: 0.7, q: 9, g: 0.065 * k, a: 0.02, s: 0.2, r: 0.5, pan: s.pan, pan2: clamp(s.pan + 0.8 * dir, -1, 1), at: s.at + at + 0.02, rev: 0.3 });
    if (!s.soft) knocks([[at + 1.0, 420, 80, 0.05 * k, true]], { lp: 1200, pan: clamp(s.pan + 0.8 * dir, -1, 1), rev: 0.5, at: s.at, prio: 0 });
  }
  // 铁锤与砧（铁匠、「我的话岂不像能打碎磐石的大锤么」）：金属的一声"当"，锤子在砧上轻轻弹一下
  function hammerSfx(o) {
    const s = sopt(o, landPan()), k = s.k * (s.far ? 0.7 : 1), n = s.soft ? 2 : rint(3, 4), gap = rnd(0.42, 0.55), f0 = rnd(1150, 1300);
    for (let i = 0; i < n; i++) {
      const at = s.at + i * gap * rnd(0.95, 1.05), f = f0 * rnd(0.99, 1.01), acc = i === n - 1 ? 1.1 : 1;
      metal([[f, 0.03 * k * acc, 0.9], [f * 2.41, 0.018 * k * acc, 0.55], [f * 3.93, 0.01 * k, 0.3], [f * 5.33, 0.006 * k, 0.2], [f * 0.5, 0.012 * k, 0.35],
        [f, 0.008 * k, 0.3, 0.13], [f * 2.41, 0.005 * k, 0.2, 0.13]], { at, pan: s.pan, rev: s.far ? 0.7 : 0.4, prio: i ? 0 : 1 });
      burst({ buf: 'white', f: 3000, q: 1, g: 0.05 * k, a: 0.001, d: 0.04, at, pan: s.pan, prio: 0 });
    }
  }
  // 海浪：浪涌起（低通打开的粉红噪声），碎开（宽带的白噪声），退去时沙沙的泡沫；海在左边；size 越大浪越高越沉
  function waveSfx(o) {
    const s = sopt(o, rnd(-0.75, -0.35)), z = clamp(s.size, 0.3, 4), k = s.k, up = 1.1 + 0.45 * z;
    burst({ buf: 'pink', ft: 'lowpass', f: 300, f2: 1300 + 250 * z, sweep: up, q: 0.6, g: (0.07 + 0.04 * z) * k, a: up, s: 0.2, r: 2.2 + 0.4 * z, pan: s.pan, rev: 0.35, at: s.at });
    burst({ buf: 'white', f: 1800, q: 0.5, g: (0.045 + 0.018 * z) * k, a: 0.08, d: 1.2 + 0.3 * z, pan: s.pan, pan2: clamp(s.pan + 0.3, -1, 1), rev: 0.3, at: s.at + up });
    burst({ buf: 'white', f: 4200, f2: 2600, sweep: 3, q: 0.9, g: 0.028 * k, a: 0.3, s: 0.2, r: 2.8, pan: clamp(s.pan + 0.15, -1, 1), rev: 0.25, at: s.at + up + 0.2 });
    if (z >= 1.5) note({ f: 70, path: [[40, 0.8]], g: 0.06 * k * Math.min(1, z / 3), a: 0.05, d: 1.2, at: s.at + up, pan: s.pan });
  }
  // 地震：深处的滚动与震颤，小喇叭上也听得见的抖动，碎石落下
  function quakeSfx(o) {
    const s = sopt(o), k = s.k, dur = s.soft ? 2.5 : rnd(3.5, 4.5);
    roll({ f0: 110, f1: 45, g: 0.42 * k, a: 0.5, s: dur - 1.5, r: 2.2, rate: 0.09, depth: 0.7, pan: s.pan, rev: 0.3, at: s.at, prio: 2 });
    burst({ buf: 'pink', f: 230, q: 0.9, g: 0.1 * k, a: 0.5, s: dur - 1.5, r: 1.8, am: [7.5, 0.5], pan: s.pan, rev: 0.3, at: s.at });
    grains({ buf: 'white', n: s.soft ? 8 : 18, dur: dur * 0.8, f0: 500, f1: 2400, len: 0.04, q: 1.4, g: 0.035 * k, at: s.at + 0.4, pan: s.pan, spread: 0.7, rev: 0.3 });
  }
  // 倒塌（城墙塌陷、大衮庙倒塌）：一声闷响、滚落的石头、尘土；size 越大越久
  function collapseSfx(o) {
    const s = sopt(o, landPan()), k = s.k, z = clamp(s.size, 0.5, 3), hits = [];
    roll({ f0: 420, f1: 80, g: 0.4 * k, a: 0.04, s: 0.5 * z, r: 3, pan: s.pan, rev: 0.5, depth: 0.5, at: s.at, prio: 2 });
    note({ f: 64, path: [[34, 1.2]], g: 0.1 * k, a: 0.01, d: 1.8, at: s.at, pan: s.pan, prio: 1 });
    const nh = Math.round(5 + 3 * z);
    for (let i = 0; i < nh; i++) hits.push([rnd(0, 1.2 * z), rnd(500, 1100), rnd(70, 120), 0.05 * k * rnd(0.5, 1), true]);
    hits.sort((a, b) => a[0] - b[0]);
    knocks(hits, { lp: 2400, pan: s.pan, rev: 0.45, at: s.at });
    grains({ buf: 'white', n: Math.round(16 * z), dur: 1.4 * z, f0: 400, f1: 2600, len: 0.05, q: 1.3, g: 0.05 * k, at: s.at + 0.05, pan: s.pan, spread: 0.6, rev: 0.35 });
  }
  // 刀剑：一挥（嘶），一碰（当——金属的光，很快散去）
  function swordSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 1 : rint(2, 3);
    let at = s.at;
    for (let i = 0; i < n; i++) {
      const p = clamp(s.pan + rnd(-0.2, 0.2), -0.9, 0.9), f = rnd(1700, 2300);
      burst({ buf: 'white', f: 2400, f2: 5200, sweep: 0.14, q: 2, g: 0.028 * k, a: 0.03, d: 0.14, pan: p, at, prio: 0 });
      metal([[f, 0.016 * k, 0.8], [f * 1.47, 0.011 * k, 0.6], [f * 2.09, 0.008 * k, 0.45], [f * 2.83, 0.005 * k, 0.3], [f * 0.53, 0.008 * k, 0.4]], { at: at + 0.12, pan: p, rev: 0.45, prio: i ? 0 : 1 });
      burst({ buf: 'white', f: 3200, q: 1, g: 0.045 * k, a: 0.001, d: 0.05, pan: p, at: at + 0.12, prio: 0 });
      at += rnd(0.35, 0.55);
    }
  }
  // 箭：弓弦一响，箭呼啸而过，远处一声钉住
  function arrowSfx(o) {
    const s = sopt(o, landPan()), k = s.k, dir = s.pan > 0 ? -1 : 1, p1 = clamp(s.pan + 0.9 * dir, -1, 1);
    note({ f: rnd(105, 125), type: 'triangle', path: [[95, 0.25]], g: 0.07 * k, a: 0.002, d: 0.4, pan: s.pan, rev: 0.3, at: s.at });
    burst({ buf: 'white', f: 2800, f2: 1500, sweep: 0.6, q: 5, g: 0.07 * k, a: 0.04, s: 0.1, r: 0.45, pan: s.pan, pan2: p1, rev: 0.3, at: s.at + 0.04 });
    if (!s.soft) knocks([[0.75, 900, 160, 0.035 * k, false]], { pan: p1, rev: 0.4, at: s.at, prio: 0 });
  }
  // 行军（大军、众人的脚步）：一步一步的闷响，渐近又渐远，底下一层衣甲与尘土
  function marchSfx(o) {
    const s = sopt(o, landPan()), k = s.k, dur = s.soft ? 3 : 4.6, beat = rnd(0.5, 0.56), hits = [];
    for (let a = 0; a < dur; a += beat) {
      const e = Math.sin(Math.PI * Math.min(1, (a + beat / 2) / dur));
      for (let j = 0; j < 3; j++) hits.push([a + rnd(0, 0.06), rnd(240, 480), rnd(65, 85), 0.045 * k * (0.35 + 0.65 * e) * rnd(0.6, 1), j === 0]);
    }
    hits.sort((x, y) => x[0] - y[0]);
    knocks(hits, { q: 0.9, lp: s.far ? 900 : 1700, pan: s.pan, rev: 0.4, at: s.at });
    burst({ buf: 'pink', f: 380, q: 0.7, g: 0.05 * k, a: 1, s: Math.max(0.2, dur - 2.2), r: 1.2, pan: s.pan, rev: 0.3, at: s.at });
  }
  // 呐喊（耶利哥城下「百姓便大声呼喊」）：许多声音一齐上扬——「哈——！」
  function shoutSfx(o) {
    const s = sopt(o, landPan()), k = s.k, v = voice(2);
    if (!v) return;
    const t = T() + s.at + 0.02, dur = s.soft ? 1.1 : 1.7, sum = v.g(1), nv = s.soft ? 4 : 7;
    for (let i = 0; i < nv; i++) {
      const f = rnd(150, 290), osc = v.o(PW.reed, f), og = v.g(1 / Math.sqrt(nv)), pn = v.p(clamp(s.pan + rnd(-0.6, 0.6), -0.9, 0.9)), d0 = rnd(0, 0.08);
      osc.frequency.setValueAtTime(f * 0.85, t + d0);
      osc.frequency.exponentialRampToValueAtTime(f * 1.18, t + d0 + 0.3);
      osc.frequency.exponentialRampToValueAtTime(f * 1.02, t + dur);
      osc.connect(og); og.connect(pn); pn.connect(sum);
    }
    const out = v.g(1);
    [[720, 2.4, 1], [1220, 3, 0.6], [2600, 4, 0.18]].forEach(([f, q, g]) => { const bp = v.f('bandpass', f, q), gg = v.g(g); sum.connect(bp); bp.connect(gg); gg.connect(out); });
    const n = v.nz('pink'), nb = v.f('bandpass', 1100, 0.8), na = v.g(0.5);
    n.connect(nb); nb.connect(na); na.connect(out);
    const env = v.g(0);
    out.connect(env);
    const end = swell(env.gain, t, 0.12, 0.1 * k, dur - 0.5, 0.7);
    v.out(env, 'evt', null, 0.5);
    v.play(t, end);
  }
  // 蝗虫 / 蝇群：许多振翅的嗡声（成群的锯齿，各自游移）经带通，一阵涌来又过去
  function swarmSfx(o) {
    const s = sopt(o), k = s.k, v = voice(1);
    if (!v) return;
    const t = T() + s.at + 0.02, dur = s.soft ? 3.5 : 5.5, sum = v.g(1);
    for (let i = 0; i < 6; i++) {
      const f = rnd(150, 240), x = v.o('sawtooth', f), xg = v.g(0.16);
      v.nlfo(rnd(0.3, 0.6), f * 0.06, x.frequency);
      x.connect(xg); xg.connect(sum);
    }
    const bp = v.f('bandpass', 1100, 0.7), hp = v.f('highpass', 280, 0.6), am = v.g(0.75);
    v.lfo(rnd(26, 34), 0.25, am.gain);
    sum.connect(bp); bp.connect(hp); hp.connect(am);
    const n = v.nz('pink'), nb = v.f('bandpass', 3200, 0.9), ng = v.g(0.35);
    n.connect(nb); nb.connect(ng); ng.connect(am);
    const env = v.g(0), pn = v.p(0);
    am.connect(env); env.connect(pn);
    const end = swell(env.gain, t, dur * 0.4, 0.09 * k, dur * 0.2, dur * 0.4);
    if (hasPan) { pn.pan.setValueAtTime(clamp(s.pan - 0.6, -1, 1), t); pn.pan.linearRampToValueAtTime(clamp(s.pan + 0.6, -1, 1), end); }
    v.out(pn, 'evt', null, 0.3);
    v.play(t, end);
  }
  // 冰雹：一片坚硬的碎响，间有沉的落地声
  function hailSfx(o) {
    const s = sopt(o), k = s.k, dur = s.soft ? 2.5 : 4;
    grains({ buf: 'white', n: s.soft ? 30 : 60, dur, f0: 1800, f1: 5000, len: 0.012, q: 4, g: 0.07 * k, spread: 0.9, rev: 0.2, at: s.at });
    grains({ buf: 'pink', n: s.soft ? 12 : 25, dur, f0: 250, f1: 700, len: 0.03, q: 1.2, g: 0.06 * k, spread: 0.8, rev: 0.25, at: s.at + 0.2 });
    burst({ buf: 'white', ft: 'highpass', f: 1500, q: 0.5, g: 0.035 * k, a: 1, s: Math.max(0.2, dur - 2.5), r: 1.5, rev: 0.2, at: s.at });
  }
  // 旋风（以利亚乘旋风升天、以西结所见北方的旋风、耶和华从旋风中回答约伯）：一股绕着人转的风，带着呼啸
  function whirlSfx(o) {
    const s = sopt(o), k = s.k, v = voice(1);
    if (!v) return;
    const t = T() + s.at + 0.02, dur = s.soft ? 4 : 6;
    const n = v.nz('pink'), bp = v.f('bandpass', 320, 1.3), am = v.g(0.7), g = v.g(0), pn = v.p(s.pan);
    bp.frequency.setValueAtTime(260, t); bp.frequency.exponentialRampToValueAtTime(900, t + dur * 0.5); bp.frequency.exponentialRampToValueAtTime(300, t + dur);
    v.nlfo(0.02, 0.5, am.gain);
    const h = v.nz('white'), hb = v.f('bandpass', 900, 13), hg = v.g(0.06);
    hb.frequency.setValueAtTime(800, t); hb.frequency.exponentialRampToValueAtTime(1700, t + dur * 0.5); hb.frequency.exponentialRampToValueAtTime(750, t + dur);
    n.connect(bp); bp.connect(am); h.connect(hb); hb.connect(hg); hg.connect(am); am.connect(g); g.connect(pn);
    if (hasPan) v.lfo(rnd(0.3, 0.45), 0.75, pn.pan);
    const end = swell(g.gain, t, dur * 0.35, 0.24 * k, dur * 0.3, dur * 0.35);
    v.out(pn, 'evt', null, 0.4);
    v.play(t, end);
  }
  // 笛（牧笛 / 苇笛）：本卷音阶上的一句，落在 A 或 E
  function pipeSfx(o) {
    const s = sopt(o, landPan()), sc = scaleNow(), L = sc.length, n = s.soft ? 3 : rint(4, 6), ns = [], beat = rnd(0.28, 0.36);
    let i = L + rint(0, L - 1);
    for (let j = 0; j < n; j++) {
      const last = j === n - 1;
      ns.push([last ? (Math.random() < 0.6 ? F.A4 : F.E4) : deg(sc, F.A3, i), last ? 1.2 : beat * (j % 3 === 2 ? 2 : 1), j % 2 ? 0.85 : 1]);
      i += Math.random() < 0.6 ? -1 : 1;
    }
    pipe(ns, { g: 0.025 * s.k, pan: s.pan, bright: 4, breath: 0.35, vib: 10, bus: 'evt', rev: 0.5, prio: 1, at: s.at });
  }
  // 歌唱（利未人的诗班、百姓的赞美）：三个和弦的应答——I · IV · I（小调里 i · iv · i），无字的人声
  function singSfx(o) {
    const s = sopt(o, rnd(-0.2, 0.3)), k = s.k, minor = thirdNow() === 3, g = 0.05 * k, b = s.low ? 0.5 : 1;
    const I = [F.A3, minor ? F.C4 : F.Cs4, F.E4, F.A4].map(f => f * b), IV = [F.A3, F.D4, minor ? F.F4 : F.Fs4, F.A4].map(f => f * b);
    choir(I, { gs: [1, 0.8, 0.75, 0.5], g, a: 0.45, s: 0.7, r: 1.1, at: s.at, pan: s.pan, rev: 0.6, prio: 1 });
    if (!s.soft) choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.95, a: 0.5, s: 0.6, r: 1.2, at: s.at + 1.5, pan: s.pan, rev: 0.6, prio: 1 });
    choir(I, { gs: [1, 0.8, 0.75, 0.55], g, a: 0.6, s: 1.2, r: 2.6, at: s.at + (s.soft ? 1.4 : 3.0), pan: s.pan, rev: 0.65, prio: 1 });
  }
  // 瓦器破碎（基甸的瓶子、耶利米打碎的瓦瓶）：一声脆裂，陶的短鸣，碎片散落
  function shatterSfx(o) {
    const s = sopt(o, landPan()), k = s.k, z = clamp(s.size, 0.5, 3);
    burst({ buf: 'white', f: 2400, q: 0.7, g: 0.12 * k, a: 0.001, d: 0.12, pan: s.pan, at: s.at });
    knocks([[0, 1800, 260, 0.05 * k, false]], { pan: s.pan, at: s.at, prio: 0 });
    metal([[rnd(1900, 2300), 0.012 * k, 0.25], [rnd(3100, 3500), 0.01 * k, 0.18], [rnd(4700, 5300), 0.008 * k, 0.12]], { pan: s.pan, at: s.at, rev: 0.3, prio: 0 });
    grains({ buf: 'white', n: Math.round(10 + 8 * z), dur: 0.5 + 0.3 * z, f0: 2000, f1: 6000, len: 0.015, q: 3, g: 0.08 * k, at: s.at + 0.04, pan: s.pan, spread: 0.5, rev: 0.3 });
  }
  // 书卷：羊皮卷展开的沙沙
  function scrollSfx(o) {
    const s = sopt(o, rnd(-0.1, 0.4)), k = s.k;
    grains({ buf: 'pink', n: 14, dur: 1.1, f0: 1500, f1: 4500, len: 0.05, q: 1.1, g: 0.07 * k, pan: s.pan, spread: 0.25, at: s.at, rev: 0.2 });
    burst({ buf: 'white', f: 3000, f2: 1800, sweep: 1, q: 0.8, g: 0.025 * k, a: 0.3, s: 0.3, r: 0.5, pan: s.pan, at: s.at, rev: 0.2 });
  }
  // 书写：笔尖在卷上、刀笔在版上一阵一阵的细响
  function writeSfx(o) {
    const s = sopt(o, rnd(0.1, 0.4)), k = s.k, n = s.soft ? 3 : 5;
    for (let i = 0; i < n; i++) grains({ buf: 'white', n: rint(5, 9), dur: rnd(0.35, 0.6), f0: 2500, f1: 5500, len: 0.02, q: 2.2, g: 0.07 * k, pan: s.pan, spread: 0.08, at: s.at + i * 0.7, rev: 0.15, prio: i ? 0 : 1 });
  }
  // 锁链（铜链、被掳）：几声金属的碰撞，拖在地上
  function chainsSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 4 : 8, ps = [];
    let at = 0;
    for (let i = 0; i < n; i++) {
      const f = rnd(2200, 3600), g = 0.021 * k * rnd(0.5, 1);
      ps.push([f, g, 0.25, at], [f * 1.7, g * 0.5, 0.15, at]);
      at += rnd(0.06, 0.16) + (i === 3 ? 0.35 : 0);
    }
    metal(ps, { pan: s.pan, rev: 0.35, at: s.at });
    grains({ buf: 'white', n: n * 2, dur: at, f0: 3000, f1: 7000, len: 0.01, q: 3, g: 0.045 * k, pan: s.pan, spread: 0.2, at: s.at, rev: 0.25, prio: 0 });
  }
  // 心跳（low：更慢）
  function heartSfx(o) {
    const s = sopt(o), k = s.k, n = s.soft ? 3 : 5, per = s.low ? 1.1 : 0.9;
    for (let i = 0; i < n; i++) {
      thump(s.at + i * per, 50, 0.22 * k * (1 - i * 0.1), 'evt');
      thump(s.at + i * per + 0.25, 45, 0.15 * k * (1 - i * 0.1), 'evt');
    }
  }
  // 骨节相碰（以西结书 37:7「有响声，有地震，骨与骨互相联络」）：干木般的碎响，越来越密
  function rattleSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 10 : 22, hits = [];
    for (let i = 0; i < n; i++) { const x = Math.sqrt(Math.random()); hits.push([x * 1.8, rnd(1200, 2600), rnd(300, 600), 0.025 * k * rnd(0.5, 1), false]); }
    hits.sort((a, b) => a[0] - b[0]);
    knocks(hits, { q: 3, lp: 5000, pan: s.pan, rev: 0.35, at: s.at });
  }
  // 微小的声音（以利亚在何烈山）：风、地震、火之后，一缕几乎听不见的气息与一个很高很轻的音
  function whisperSfx(o) {
    const s = sopt(o), k = s.k;
    burst({ buf: 'pink', f: 1200, f2: 800, sweep: 3, q: 1.2, g: 0.017 * k, a: 1.2, s: 1, r: 2, pan: s.pan, rev: 0.7, at: s.at });
    note({ f: F.A5, g: 0.008 * k, a: 1.5, s: 1, r: 2.5, vib: [4.5, 0.002], pan: s.pan, rev: 0.8, at: s.at + 0.4 });
    note({ f: F.E6, g: 0.004 * k, a: 1.8, s: 0.8, r: 2.5, pan: -s.pan, rev: 0.8, at: s.at + 0.9, prio: 0 });
  }
  // 鹰：高处一两声尖利的长鸣（「他们必如鹰展翅上腾」）
  function eagleSfx(o) {
    const s = sopt(o, rnd(-0.4, 0.5)), k = s.k, n = s.soft ? 1 : 2;
    for (let i = 0; i < n; i++) {
      const f = rnd(1900, 2300);
      note({ f, type: PW.reed, path: [[f * 1.12, 0.08], [f * 0.72, 0.5]], lp: 4200, trem: [38, 0.35], g: 0.026 * k * (1 - i * 0.3), a: 0.02, s: 0.15, r: 0.35, at: s.at + i * 0.75, pan: s.pan, rev: 0.6 });
    }
  }
  // 磨（推磨的参孙、「推磨的声音止息」）：石磨沉重地一圈一圈转，间有碾碎的细响
  function millSfx(o) {
    const s = sopt(o, landPan()), k = s.k, dur = s.soft ? 3 : 4.5, rot = rnd(0.7, 0.95);
    burst({ buf: 'brown', ft: 'lowpass', f: 340, q: 0.7, g: 0.14 * k, a: 0.6, s: dur - 1.6, r: 1, am: [rot, 0.35], pan: s.pan, rev: 0.3, at: s.at });
    burst({ buf: 'pink', f: 190, q: 2.6, g: 0.11 * k, a: 0.6, s: dur - 1.6, r: 1, am: [rot, 0.4], pan: s.pan, rev: 0.3, at: s.at });
    grains({ buf: 'white', n: Math.round(dur * 6), dur: dur - 0.6, f0: 900, f1: 2600, len: 0.02, q: 1.6, g: 0.025 * k, at: s.at + 0.3, pan: s.pan, spread: 0.15, rev: 0.25, prio: 0 });
  }
  // 斧子（砍伐香柏、以利沙的斧头）：木头上沉沉的几下
  function axeSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 2 : rint(3, 4), gap = rnd(0.55, 0.7), hits = [];
    for (let i = 0; i < n; i++) hits.push([i * gap * rnd(0.95, 1.05), rnd(700, 1000), rnd(140, 180), 0.06 * k, true]);
    knocks(hits, { q: 1.6, lp: s.far ? 2000 : 5000, pan: s.pan, rev: 0.35, at: s.at });
    for (const h of hits) burst({ buf: 'white', f: 2500, q: 1.5, g: 0.02 * k, a: 0.001, d: 0.05, at: s.at + h[0], pan: s.pan, prio: 0 });
  }
  // 银钱（十七舍客勒、银柜）：几枚银子落下、相碰
  function coinsSfx(o) {
    const s = sopt(o, landPan()), k = s.k, n = s.soft ? 3 : 6, ps = [];
    let at = 0;
    for (let i = 0; i < n; i++) {
      const f = rnd(3800, 5200), g = 0.021 * k * rnd(0.6, 1);
      ps.push([f, g, 0.35, at], [f * 1.48, g * 0.5, 0.22, at], [f * 2.3, g * 0.28, 0.12, at]);
      at += rnd(0.07, 0.14);
    }
    metal(ps, { pan: s.pan, rev: 0.3, at: s.at });
  }
  // 未知的名字：一声温和的铃（由名字定音高），从不报错
  function chimeSfx(o, name) {
    const s = sopt(o), str = String(name || '');
    let h = 7;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    bells([pent(F.A5, h % 5), pent(F.A5, 2 + ((h >>> 3) % 4))], 0.14, 0.028 * s.k, 2.2, s.at, { prio: 1 });
  }
  const SFX = {
    harp, wind: windSfx, build: buildSfx, weep: weepSfx, thunder: thunderSfx, fire: fireSfx, seal: sealSfx, crowd: crowdSfx,
    splash: splashSfx, bleat: bleatSfx, gate: gateSfx, rain: rainSfx, dove: doveSfx, camel: o => camelSfx(o, false), donkey: o => camelSfx(o, true),
    laugh: laughSfx, angel: angelSfx, stars: starsSfx, raven: ravenSfx, chime: chimeSfx,
    cow: o => { const s = sopt(o, landPan()); cow(s.at, s.pan, 0.1 * s.k, s.far, 'evt'); },
    bird: o => { const s = sopt(o, rnd(-0.6, 0.6)); birdPhrase(s.at, s.pan, 0.07 * s.k); },
    wings: o => { const s = sopt(o, rnd(-0.5, 0.5)); burst({ buf: 'white', f: 1500, q: 1, g: 0.08 * s.k, a: 0.1, s: 0.3, r: 0.5, am: [15, 0.6], pan: s.pan, pan2: -s.pan, rev: 0.3, at: s.at }); },
    // 旧约其余各卷
    horn: hornSfx, trumpet: trumpetSfx, lion: lionSfx, timbrel: timbrelSfx, cymbal: cymbalSfx, bell: bellSfx, lyre: lyreSfx,
    chariot: chariotSfx, hooves: hoovesSfx, wheel: wheelSfx, sling: slingSfx, hammer: hammerSfx, wave: waveSfx,
    quake: quakeSfx, collapse: collapseSfx, sword: swordSfx, arrow: arrowSfx, march: marchSfx, shout: shoutSfx,
    swarm: swarmSfx, hail: hailSfx, whirlwind: whirlSfx, pipe: pipeSfx, sing: singSfx,
    shatter: shatterSfx, scroll: scrollSfx, write: writeSfx, chains: chainsSfx, heart: heartSfx, rattle: rattleSfx,
    whisper: whisperSfx, eagle: eagleSfx, mill: millSfx, axe: axeSfx, coins: coinsSfx,
    whale: o => { const s = sopt(o, rnd(-0.8, -0.3)); whaleSong(s.at, s.pan, 0.09 * s.k, 'evt'); },
  };
  const SFX_ALIAS = {
    grace: 'harp', stone: 'build', stones: 'build', chisel: 'build', brick: 'build', bricks: 'build',
    cry: 'weep', lament: 'weep', mourn: 'weep', sob: 'weep', storm: 'thunder', lightning: 'thunder',
    flame: 'fire', altar: 'fire', sacrifice: 'fire', burn: 'fire', door: 'gate', close: 'seal', covenant: 'seal', shut: 'seal',
    people: 'crowd', murmur: 'crowd', voices: 'crowd', water: 'splash', river: 'splash', well: 'splash', spring: 'splash',
    sheep: 'bleat', goat: 'bleat', lamb: 'bleat', ram: 'bleat', flock: 'bleat', ox: 'cow', cattle: 'cow', herd: 'cow',
    choir: 'angel', angels: 'angel', ladder: 'angel', star: 'stars', ping: 'stars', twinkle: 'stars', shower: 'rain',
    gust: 'wind', breeze: 'wind', crow: 'raven', wing: 'wings', flutter: 'wings', ass: 'donkey', caravan: 'camel',
    // 旧约其余各卷
    shofar: 'horn', ramshorn: 'horn', rams_horn: 'horn', horns: 'horn', blast: 'horn', jubilee: 'horn',
    trumpets: 'trumpet', alarm: 'trumpet', roar: 'lion', lions: 'lion',
    tambourine: 'timbrel', tabret: 'timbrel', timbrels: 'timbrel', drum: 'timbrel', drums: 'timbrel', dance: 'timbrel', dancing: 'timbrel',
    cymbals: 'cymbal', gong: 'cymbal', bells: 'bell', jingle: 'bell', kinnor: 'lyre', lyres: 'lyre', psaltery: 'lyre',
    chariots: 'chariot', horse: 'hooves', horses: 'hooves', gallop: 'hooves', hoof: 'hooves', cavalry: 'hooves', rider: 'hooves', riders: 'hooves',
    wheels: 'wheel', potter: 'wheel', slingstone: 'sling', slings: 'sling',
    anvil: 'hammer', smith: 'hammer', blacksmith: 'hammer', forge: 'hammer', hammers: 'hammer',
    waves: 'wave', sea: 'wave', surf: 'wave', billows: 'wave', breakers: 'wave', tide: 'wave', ocean: 'wave',
    earthquake: 'quake', tremble: 'quake', shake: 'quake', rumble: 'quake', crumble: 'collapse', topple: 'collapse', rubble: 'collapse', landslide: 'collapse',
    clash: 'sword', swords: 'sword', battle: 'sword', war: 'sword', spear: 'sword', shield: 'sword', arrows: 'arrow', archer: 'arrow',
    army: 'march', troops: 'march', soldiers: 'march', feet: 'march', footsteps: 'march', marching: 'march', cheer: 'shout', shouting: 'shout', battlecry: 'shout',
    locust: 'swarm', locusts: 'swarm', flies: 'swarm', fly: 'swarm', bees: 'swarm', hornet: 'swarm', hornets: 'swarm', gnats: 'swarm', lice: 'swarm', insects: 'swarm',
    hailstones: 'hail', tornado: 'whirlwind', tempest: 'whirlwind', whirl: 'whirlwind', fish: 'whale', leviathan: 'whale', bigfish: 'whale',
    flute: 'pipe', pipes: 'pipe', piping: 'pipe', reed: 'pipe', shepherd: 'pipe',
    song: 'sing', singers: 'sing', singing: 'sing', hymn: 'sing', praise: 'sing', psalm: 'sing', chant: 'sing', levites: 'sing',
    break: 'shatter', smash: 'shatter', jar: 'shatter', jars: 'shatter', pot: 'shatter', pottery: 'shatter', shards: 'shatter', crack: 'shatter',
    book: 'scroll', scrolls: 'scroll', parchment: 'scroll', letter: 'scroll', page: 'scroll', unroll: 'scroll', pen: 'write', inscribe: 'write', writing: 'write',
    chain: 'chains', fetters: 'chains', shackles: 'chains', bonds: 'chains', heartbeat: 'heart', pulse: 'heart',
    bones: 'rattle', shaking: 'rattle', clatter: 'rattle', still: 'whisper', stillvoice: 'whisper', hush: 'whisper', breath: 'wind',
    hawk: 'eagle', falcon: 'eagle', vulture: 'eagle', grind: 'mill', grinding: 'mill', millstone: 'mill', millstones: 'mill',
    chop: 'axe', timber: 'axe', woodcut: 'axe', coin: 'coins', silver: 'coins', money: 'coins', shekel: 'coins', shekels: 'coins', gold: 'coins',
    torch: 'fire', torches: 'fire', furnace: 'fire', oven: 'fire', kiln: 'fire', blaze: 'fire', burning: 'fire',
  };
  // 每个名字的最短间隔（秒）：同一声不会叠成一团
  const SFX_GAP = { harp: 0.3, wind: 0.8, build: 0.25, weep: 1.5, thunder: 0.9, fire: 1, seal: 0.8, crowd: 1.2, splash: 0.12, bleat: 0.6,
    gate: 0.8, rain: 1.5, dove: 1, camel: 0.8, donkey: 0.8, laugh: 1, angel: 2, stars: 0.6, cow: 1, bird: 0.4, raven: 0.8, wings: 0.4, chime: 0.3,
    horn: 0.6, trumpet: 0.8, lion: 2, timbrel: 1.5, cymbal: 0.5, bell: 0.4, lyre: 0.8, chariot: 1.5, hooves: 1, wheel: 2, sling: 1, hammer: 0.8,
    wave: 1.2, quake: 2, collapse: 1.5, sword: 0.5, arrow: 0.3, march: 2, shout: 1.2, swarm: 2, hail: 2, whirlwind: 2, whale: 3, pipe: 1.5,
    sing: 2, shatter: 0.4, scroll: 1, write: 1.5, chains: 1, heart: 2, rattle: 1.2, whisper: 2, eagle: 1, mill: 2, axe: 1, coins: 1 };
  const sfxLast = {};
  let lastName = -1e9;
  // 成就的手势里已有竖琴般的一句：紧接着（情节第 0 拍）再来的竖琴便不叠上去
  function harpJustPlayed() { if (AC) sfxLast.harp = T(); }

  // ── 声床的电平（混音在此校准）────────────────────────────
  const LV = {
    drone: 0.028, light: 0.035, air: 0.037, earth: 0.02, human: 0.032, sunset: 0.024,
    water: 0.13, stir: 0.04, wind: 0.5, leaves: 0.42, cricket: 0.03,
    pluck: 0.03, star: 0.03, bird: 0.025, whale: 0.035, bubble: 0.03, graze: 0.02, herd: 0.05, theme: 0.02,
    // 其后各卷
    pad: 0.034, work: 0.018, choir: 0.02, motif: 0.035, rain: 0.11, storm: 0.25, bow: 0.012,
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
      const late = (index | 0) >= NST();                  // 七日之后各卷的话语
      if (kind === 'refrain') FUL_KIND.refrain();
      else if (fn) fn();
      else if (late && FUL_LATE[kind]) FUL_LATE[kind]();
      else if (FUL_KIND[kind]) FUL_KIND[kind]();
      else if (kind !== 'rest') (late ? FUL_LATE.cmd : FUL_KIND.cmd)();
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
      } else if ((W.act | 0) >= 1) {
        // 其后各卷：人与地的名字聚成——比安息后的名字亮一些；末了一两声本卷音阶上的铃（接连的名字更轻）
        const t = T(), light = t - lastName < 0.8;
        lastName = t;
        const h = String(ch || '').charCodeAt(0) || 0, sc = scaleNow();
        grains({ buf: 'white', n: light ? 10 : 18, dur: light ? 0.9 : 1.4, f0: 2800, f1: 6500, len: 0.018, q: 2.6, g: light ? 0.04 : 0.055, rev: 0.45, prio: 1 });
        note({ f: deg(sc, F.A5, h % sc.length), g: light ? 0.022 : 0.032, a: 0.01, d: 2.2, at: light ? 0.9 : 1.4, rev: 0.6, pan: 0.15, prio: 1 });
        if (!light) note({ f: deg(sc, F.A4, (h >> 2) % sc.length), g: 0.024, a: 0.01, d: 2.6, at: 1.55, rev: 0.6, pan: -0.15, prio: 1 });
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
    // 其后各卷的音效（见上面的 SFX）：未 init / 静音时为空操作；未知的名字只是一声温和的铃
    sfx: api('sfx', (name, opts) => {
      if (muted || hidden || !N) return;
      let key = String(name == null ? '' : name).toLowerCase().trim();
      if (Object.prototype.hasOwnProperty.call(SFX_ALIAS, key)) key = SFX_ALIAS[key];
      const fn = Object.prototype.hasOwnProperty.call(SFX, key) ? SFX[key] : null;
      const gate = fn ? key : 'chime', t = T();
      if (t - (sfxLast[gate] == null ? -1e9 : sfxLast[gate]) < (SFX_GAP[gate] || 0.2)) return;
      sfxLast[gate] = t;
      (fn || chimeSfx)(opts && typeof opts === 'object' ? opts : {}, key);
    }),
    // 登记一卷的乐曲（js/music/*.js）：见上面「其后各卷的乐曲：登记表」；init 之前、之后都可以调用
    music(id, spec) {
      try { return music(id, spec); } catch (e) { err('music', e); return false; }
    },
    hz,                                                    // 音名 → Hz（'A3' 'Cs4' 'Bb2' 'C#5'）
    _dbg: () => ({ ctx: AC, out: N && N.out, sum: N && N.sum, live, errs: errs.slice(), hold: hold ? hold.hk : null,
      beds: Object.keys(beds).filter(k => beds[k].x), breathN, LV, divine: divNow, act: actId(), actNow, scale: scaleNow().join(','), sfx: Object.keys(SFX),
      alias: Object.assign({}, SFX_ALIAS), music: Object.keys(MUS), padIds: PAD_IDS.slice(),
      pads: PAD_IDS.filter(k => beds['pad_' + k] && beds['pad_' + k].x).map(k => {
        const x = beds['pad_' + k].x, g = {};
        for (const n in x.c.g) g[n] = +x.c.g[n].v.toFixed(3);
        return { id: k, level: +(x.L.v || 0).toFixed(4), lp: Math.round(x.c.lp.v), g };
      }),
      drone: beds.drone && beds.drone.x ? [beds.drone.x.c.chaos.v, beds.drone.x.c.sub.v] : null }),
    _t: { note, burst, grains, tollBell, bells, chord, whaleSong, birdPhrase, gull, cow, sheep, dove,     // 测试用：直接调用配方
      strings, pipe, choir, knocks, vox, gust, roll, harp, lyre, shepherd, ney, oud, bowed, glass, tongues, angelRun, starPing, SFX, HOLD, FUL_LATE,
      MUS, MAPI, PAD, regMix, regScale,
      tick: dt => { if (AC) tick(dt); }, offline: () => { resumeAt = 1e15; } },   // 离线渲染测试：直接推动一拍 / 视离线的环境为"在响" 
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
