/* ─────────────────────────────────────────────────────────────
 * main.js —— 运行：输入、言说的仪式、每帧的世界、黎明、安息、存档
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W, bus = GS.bus;
  const { clamp, safe } = U;
  const STAGES = GS.story.STAGES;
  const ACTS = GS.book.ACTS;
  const SAVE_KEY = 'godsim.v2';
  const ORDINAL = ['', '头一日', '第二日', '第三日', '第四日', '第五日', '第六日'];

  // 绘制次序：由远及近。每个模块在每一"层"画属于它的东西。
  const PASSES = ['sky', 'seaFar', 'far', 'seaMid', 'mid', 'seaNear', 'near', 'air', 'top'];
  const MODS = ['land', 'weather', 'scenes', 'sea', 'beasts', 'scenesOver', 'cast', 'air', 'fx'];
  const LIVING = ['land', 'sea', 'beasts', 'air'];          // 按世界的目标"多退少补"的模块

  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');
  const skyCanvas = () => document.getElementById('sky');   // 天幕可能在 WebGL 失效时被替换

  // ── 参数 ────────────────────────────────────────────────────
  const params = new URLSearchParams(location.search + '&' + location.hash.replace(/^#/, ''));
  W.fast = clamp(parseFloat(params.get('fast')) || 1, 0.1, 20);
  W.quality = params.get('q') ? clamp(parseFloat(params.get('q')) || 1, 0.5, 1) : 1;
  const LOCK_Q = params.has('q');           // 指定画质时不再自动降级（截图 / 测试用）
  try { W.reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { W.reduced = false; }

  // ── 状态 ────────────────────────────────────────────────────
  const S = {
    mode: 'title',          // 'title' | 'play' | 'rest'（安息之后）
    holding: false, holdSrc: '', charge: 0, need: 1, kind: '',
    cooldown: 0,
    muted: false,
    restartArmed: 0,
    lastT: 0,
    perf: { acc: 0, n: 0 },
    choices: {},            // 每句话成就时的选择（归一化），存档用
    sealed: 0,              // 已在黎明封存的日数
    trail: [],              // 撒星时灵的轨迹
    breaths: 0, still: 0,   // 第七日：静止的息
    wasCycling: false,
    idle: 0,                // 距上次言说的秒数（用于轻声提醒）
    pendingHold: null,      // 余韵中按下、尚未松开的输入
    pointerType: 'mouse',
    keys: new Set(),
    transition: false,      // 卷与卷之间（幕布落下时）不可言说
  };

  // ── 存档 ────────────────────────────────────────────────────
  function load() {
    try {
      const sv = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!sv || typeof sv !== 'object' || !isFinite(sv.stage)) return null;       // 坏了的存档当作没有
      sv.stage = clamp(sv.stage | 0, 0, STAGES.length);
      if (!sv.choices || typeof sv.choices !== 'object' || Array.isArray(sv.choices)) sv.choices = {};
      sv.label = labelFor(sv.stage);                                                 // 进度名按句序重新算出
      sv.max = clamp(Math.max(sv.stage, isFinite(sv.max) ? sv.max | 0 : 0), 0, STAGES.length);
      return sv;
    } catch (e) { return null; }
  }
  function save() {
    try {
      S.max = Math.max(S.max || 0, W.stage);
      localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, stage: W.stage, max: S.max, day: currentDay(), label: labelFor(W.stage), muted: S.muted, choices: S.choices }));
    } catch (e) { /* 隐私模式：不存也无妨 */ }
  }
  function clearSave() {
    try { const s = load(); localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 2, stage: 0, max: s ? s.max || 0 : 0, day: 0, muted: s ? !!s.muted : false, choices: {} })); } catch (e) { /* */ }
  }

  // ── 日的记号 ────────────────────────────────────────────────
  const stageNow = () => STAGES[W.stage];
  const isRestStage = () => !!(stageNow() && stageNow().kind === 'rest');
  function currentDay() { return W.stage < STAGES.length ? STAGES[W.stage].day : 7; }
  function goods() {
    const g = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < W.stage; i++) if (STAGES[i].good) g[STAGES[i].day] += STAGES[i].good;
    return g;
  }
  // 进度的名字：第一幕里是「第几日」，其后是「书名 · 幕名」（按下一句所在之幕）
  function labelFor(n) {
    if (n >= STAGES.length) return '终';
    const st = STAGES[n], a = ACTS[st.act] || ACTS[0];
    if (a.index === 0) return GS.ui.DAY_NAME[st.day] || '起初';
    return a.book + ' · ' + a.title;
  }
  const progressLabel = () => labelFor(W.stage);
  function refreshHUD() {
    W.day = currentDay();
    GS.ui.setStage(W.act > 0 || W.stage > 8);
    const a = ACTS[W.act] || ACTS[0];
    if (a.index === 0) {
      GS.ui.setAct(null);
      if (S.mode !== 'title') GS.ui.showDays(true);
      GS.ui.setDays(W.day, S.sealed, W.stage > ACTS[0].last, goods(), S.mode === 'play' && isRestStage() ? S.breaths : null);
    } else GS.ui.setAct(a);
    GS.ui.renderLedger(STAGES, W.stage, ACTS);
    GS.ui.renderToc(ACTS, W.stage, Math.max(S.max || 0, W.stage), S.mode);
  }

  // ── 布局 ────────────────────────────────────────────────────
  function resize() {
    const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W.resize(w, h, dpr);
    safe('sky.resize', () => GS.sky.resize(skyCanvas(), w, h, dpr));
    for (const m of MODS) safe(m + '.resize', () => GS[m].resize());
  }

  // ── 言说的时长与震颤 ────────────────────────────────────────
  function holdTime(st) {
    if (st.hold) return st.hold;
    const n = Array.from(st.utter).length;
    if (st.kind === 'refrain') return 0.42 * n;            // 叠句：一字一钟
    if (st.kind === 'bless') return 0.8 + 0.15 * n;        // 赐福：更缓
    return 0.55 + 0.11 * n;
  }
  // 每一日的言说有它自己的分量：第三日最沉（地壳升起），第四日无声的光，第六日以后越来越轻
  function shakeAmp(st) {
    if (!st) return 0;
    switch (st.kind) {
      case 'first': case 'stars': case 'human': case 'behold': case 'holy': case 'rest': return 0;
      case 'refrain': return 0.5;
      case 'bless': return 0.4;
    }
    return [0, 2.2, 2.2, 3.0, 0.3, 0.8, 1.4, 0][st.day] || 0;
  }

  // ── 话语成就 ────────────────────────────────────────────────
  function fulfill() {
    const st = stageNow();
    if (!st) return;
    const x = W.spirit.x, y = W.spirit.y;
    GS.book.flush();                                     // 上一句话里尚未发生的事，先让它发生完
    if (W.pull) { W.clock += W.pull; W.pull = 0; }      // 被言说拉近的黄昏就此成真
    W.hurryClock();
    let choice = null;
    safe('stage.apply', () => { choice = st.apply({ instant: false, x, y, trail: S.trail.slice() }); });
    if (choice) S.choices[st.index] = choice;
    W.stage++;
    S.trail = [];
    safe('fx.trace', () => GS.fx.setTrace([]));
    W.shake = shakeAmp(st) > 0 ? 1 : 0;
    GS.ui.narrate(st.verse);
    safe('audio.fulfill', () => GS.audio.fulfill(Math.min(st.day, 7), st.index, st.kind));
    bus.emit('fulfill', { stage: st, x, y });
    if (S.pointerType !== 'mouse' && navigator.vibrate) { try { navigator.vibrate([30, 40, 60]); } catch (e) { /* */ } }
    S.idle = 0;
    refreshHUD();
    save();

    if (st.index === 0) enterPlay();
    if (st.kind === 'holy') {
      S.breaths = 0; S.still = 0;
      setTimeout(() => {
        if (isRestStage()) GS.ui.hint('第七日 —— 不必再说。放手，静候。', 8);
        refreshHUD();
      }, 9000 / W.fast);
    }
    const a = ACTS[st.act] || ACTS[0];
    if (st.index === a.last) {
      if (a.index === ACTS.length - 1) enterRest();                 // 旧约终
      else {
        const next = ACTS[a.index + 1];
        if (a.index === 0) actOneFinale();                          // 七日圆满：安息
        // 创世记五十章讲完：先在天上写下「创世记 · 终」，再落幕进入出埃及记
        const fin = a.index > 0 && a.book === '创世记' && next.book !== a.book
          ? { title: '创世记', sub: '全书五十章 · 终', foot: spokenUpTo(a.last) + ' 句话　—　下一卷：' + next.book } : null;
        scheduleAct(next, a.outro, fin);
      }
    }
  }
  const spokenUpTo = last => STAGES.slice(0, last + 1).filter(s => s.utter).length;

  // 七日的终幕：「安息」
  function actOneFinale() {
    safe('audio.rest', () => GS.audio.rest());       // 第七日：自起初就在的低鸣落下（后面各卷的乐声由 audio 按卷重新带起）
    // 经文（2:2–3）说完了，「安息」才写在天上（最多再等二十秒）
    let waited = 0;
    const show = () => {
      if (GS.ui.narrating() && waited++ < 20) { GS.book.after(1, show); return; }
      GS.ui.finale(true, { title: '安息', sub: '天地万物都造齐了', foot: '7 日 · 27 句话 · 0 个 bug' });
      safe('audio.finale', () => GS.audio.finale());
      GS.book.after(11, () => GS.ui.finale(false));
    };
    GS.book.after(13, show);
  }

  // 落幕，布置下一卷，卷名浮现，启幕（按世界时间计，慢设备上也与情节同步）
  function scheduleAct(next, delay, fin) {
    S.transition = true;
    const after = GS.book.after;
    let waited = 0;
    // 末一句话的故事与经文都尽了，幕才落下（最多再等一分钟）
    const fall = () => {
      if ((GS.book.busy() || GS.ui.narrating()) && waited++ < 60) { after(1, fall); return; }
      after(waited ? 3 : 0, fin ? bookEnd : drop);
    };
    after(delay, fall);
    // 一卷书讲完：书名以毛笔写在天上，停一会儿，再落幕
    function bookEnd() {
      GS.ui.finale(true, fin);
      safe('audio.finale', () => GS.audio.finale());
      after(11, () => { GS.ui.finale(false); after(2, drop); });
    }
    function drop() {
      W.set('curtain', 1);
      after(2.4, () => {
        GS.book.flush();
        GS.ui.clearNarration();
        safe('fx.clear', () => GS.fx.clearTransient());
        enterAct(next);
        GS.ui.actCard(next, true);
        refreshHUD();
        save();
        after(3.2, () => W.set('curtain', 0));
        after(6.2, () => {
          GS.ui.actCard(next, false);
          S.transition = false;
          if (next.intro) GS.ui.narrate(next.intro, { delay: 0.6 });
          else after(1.5, () => GS.ui.hint('按住 · 言说', 4));
        });
      });
    }
  }

  // 进入一卷：瞬间布置它的世界，再让万物按新的目标多退少补
  function enterAct(a) {
    W.act = a.index;
    if (a.index > 0) { W.freeClock = false; }
    const prev = W.replaying;
    W.replaying = true;
    GS.book.resetActLevels();
    if (a.setup) safe('act.setup ' + a.id, () => a.setup({ instant: true }));
    W.replaying = prev;
    W.snapAll();
    for (const m of LIVING) safe(m + '.restore', () => GS[m].restore && GS[m].restore());
  }

  function enterPlay() {
    S.mode = 'play';
    GS.ui.hideTitle();
    GS.ui.showDays(true);
    GS.ui.showTools(true);
  }

  // 全书终：世界从此自行运转
  function enterRest() {
    S.mode = 'rest';
    W.freeClock = true;
    safe('audio.rest', () => GS.audio.rest());
    refreshHUD();
    const spoken = STAGES.filter(s => s.utter).length;
    const outro = (ACTS[ACTS.length - 1] && ACTS[ACTS.length - 1].outro) || 16;
    // 末一句的故事与经文都尽了，终章才写在天上（最多再等一分钟）
    let waited = 0;
    const show = () => {
      if ((GS.book.busy() || GS.ui.narrating()) && waited++ < 60) { GS.book.after(1, show); return; }
      GS.ui.finale(true, { title: '旧约', sub: '三十九卷 · 终', foot: spoken + ' 句话 · 0 个 bug　—　God is the first vibecoder.' });
      safe('audio.finale', () => GS.audio.finale());
      GS.book.after(13, () => GS.ui.finale(false));
      GS.book.after(16, () => GS.ui.hint('灵经过之处，万物显出其名；按住，观看它被造时的话', 7));
    };
    GS.book.after(outro, show);
  }

  // 黎明：一日圆满——日数由晨光（前三日）或星光（后三日）写在地平线上
  function onDawn() {
    let d = 0, ev = null;
    for (let i = W.stage - 1; i >= 0; i--) if (STAGES[i].evening) { d = STAGES[i].day; ev = STAGES[i]; break; }
    if (!d || d <= S.sealed) return;
    S.sealed = d;
    refreshHUD();
    const M = Math.min(W.w, W.h);
    const size = M * 0.075, cy = W.horizonY - M * 0.1;
    if (d <= 3) {
      GS.fx.nameStr(ORDINAL[d], W.w / 2, cy, size, [255, 222, 180],
        () => [W.sun.x + U.rand(-1, 1) * W.w * 0.3, W.horizonY - U.rand(0, 1) * M * 0.05], { dot: 1.8 });
    } else {
      GS.fx.nameStr(ORDINAL[d], W.w / 2, cy, size, [236, 240, 255],
        () => [U.rand(0, W.w), U.rand(0, W.horizonY * 0.6)], { dot: 1.8 });
    }
    safe('audio.dawn', () => GS.audio.dawn(d));
    bus.emit('dawn', { day: d });
    if (ev && ev.after) GS.ui.narrate(ev.after, { delay: 5 });
  }

  // 恢复到第 n 句话语之后的世界（瞬间，无动画）
  function restore(n, choices) {
    n = clamp(n | 0, 0, STAGES.length);
    // 清去当前世界里尚未发生的情节、计时与幕布（中途跳转时，旧世界的计时不能落到新世界上）
    GS.book.reset();
    S.transition = false; S.holding = false; S.pendingHold = null;
    W.set('curtain', 0, true);
    GS.ui.clearNarration(); GS.ui.actCard(null, false); GS.ui.finale(false);
    S.choices = choices && typeof choices === 'object' && !Array.isArray(choices) ? choices : {};
    for (const k in W.pop) W.pop[k].n = 0;         // 生灵的数目由各句话重新定下
    W.replaying = true;
    W.act = 0;
    // 若停在某卷的开端（上一卷已完、幕已落下），这一卷也算已进入
    const lastAct = n >= STAGES.length ? ACTS.length - 1 : STAGES[n].act;
    for (let i = 0; i <= Math.min(n, STAGES.length - 1); i++) {
      const st = STAGES[i];
      const a = ACTS[st.act];
      if (a.index > 0 && i === a.first && a.index <= lastAct) {
        W.act = a.index; W.freeClock = false;
        GS.book.resetActLevels();
        if (a.setup) safe('act.setup ' + a.id, () => a.setup({ instant: true }));
      }
      if (i >= n) break;
      safe('restore ' + i, () => {
        const r = st.apply({ instant: true, x: W.w * 0.72, y: W.h * 0.55, choice: S.choices[i] || null, trail: [] });
        if (r && !S.choices[i]) S.choices[i] = r;
      });
    }
    W.replaying = false;
    W.snapAll();
    W.stage = n;
    S.sealed = 0;
    for (let i = 0; i < n; i++) if (STAGES[i].evening) S.sealed = STAGES[i].day;
    if (n >= STAGES.length) S.sealed = 7;
    for (const m of MODS) safe(m + '.restore', () => GS[m].restore && GS[m].restore());
    if (n > 0) {
      enterPlay();
      if (n >= STAGES.length) { S.mode = 'rest'; W.freeClock = true; safe('audio.rest', () => GS.audio.rest()); }
      else if (W.act === 0) W.freeClock = n > ACTS[0].last;
      const nx = STAGES[n];
      // 接续：先重温上一句的经文（或本卷的开篇），再轻声提醒
      const a = ACTS[W.act];
      const recap = a && a.index > 0 && n === a.first && a.intro ? a.intro.slice(0, 2)
        : (STAGES[n - 1] && STAGES[n - 1].verse ? STAGES[n - 1].verse.slice(-1) : null);
      if (recap && nx) GS.ui.narrate(recap, { delay: 1.2 });
      setTimeout(() => {
        if (nx && nx.kind === 'rest') GS.ui.hint('第七日 —— 不必再说。放手，静候。', 8);
        else if (nx && nx.act === 0) GS.ui.hint(GS.ui.DAY_NAME[nx.day] + ' · 按住画面，继续言说', 5);
        else if (nx) GS.ui.hint(progressLabel() + ' · 按住画面，继续言说', 5);
        else GS.ui.hint('按住画面，观看万物被造时的话', 6);
      }, 1800 / W.fast);
    }
    refreshHUD();
  }

  // ── 言说的把持与松开 ────────────────────────────────────────
  function holdStart(src) {
    initAudio();
    S.still = 0;
    if (S.holding) return;
    if (S.cooldown > 0) { S.pendingHold = src; return; }   // 刚成就的余韵中按下：余韵一过便开始言说
    if (GS.ui.panelOpen()) return;
    if (S.transition) {                                    // 幕布之间，静候新的一卷（末一句的故事还在讲时，先静听）
      GS.ui.hint(GS.ui.narrating() || GS.book.busy() ? '经文未完 · 静听' : '静候 · 下一幕将至', 2.5);
      safe('fx.ring', () => GS.fx.ring(W.spirit.x, W.spirit.y, [220, 230, 255], 46 * Math.max(0.7, W.unit), 0.9, 1));
      return;
    }
    if (S.mode === 'title') {
      const sv = load();
      if (sv && sv.stage > 0) { restore(sv.stage, sv.choices); return; }
    }
    const st = stageNow();
    if (st && st.kind === 'rest') {                 // 第七日：不再言说
      GS.ui.hint('第七日 —— 不必再说。放手，静候。', 4);
      return;
    }
    // 上一句话的故事尚在展开：第一次按下只提醒静听；六秒内再按，才是有意越过
    if (S.mode === 'play' && st && (GS.ui.narrating() || GS.book.busy())) {
      if (!S.skipArmed || W.t - S.skipArmed > 6) {
        S.skipArmed = W.t;
        GS.ui.hint(GS.ui.narrating() ? '经文未完 · 静听；再按住便继续' : '故事未完 · 静看；再按住便继续', 3);
        safe('fx.ring', () => GS.fx.ring(W.spirit.x, W.spirit.y, [220, 230, 255], 46 * Math.max(0.7, W.unit), 0.9, 1));
        return;
      }
    }
    S.skipArmed = 0;
    if (st && st.kind === 'stars') GS.ui.hint('言说时，引灵划过天空', 3);
    S.holding = true;
    S.holdSrc = src;
    S.charge = 0;
    if (st) {
      S.kind = st.kind;
      S.need = holdTime(st) / W.fast;
      W.ritual.text = st.utter;
      W.ritual.tint = st.tint;
      W.ritual.kind = st.kind;
      GS.ui.utterBegin(st.utter, st.tint, st.kind);
      safe('audio.chargeStart', () => GS.audio.chargeStart(Math.min(st.day, 7), st.kind));
      if (st.kind === 'stars') { S.trail = []; }
    } else {
      // 安息之后：按住观看
      S.kind = 'sabbath';
      W.ritual.kind = 'sabbath';
      S.need = 1.2 / W.fast;
      W.ritual.text = '';
      W.ritual.tint = [255, 236, 200];
      safe('audio.chargeStart', () => GS.audio.chargeStart(7, 'sabbath'));
    }
    W.ritual.holding = true;
    GS.ui.hideHint();
    if (S.mode === 'title') GS.ui.dimTitle(true);
  }

  function holdEnd(src) {
    if (S.pendingHold === src) S.pendingHold = null;
    if (!S.holding || src !== S.holdSrc) return;
    S.holding = false;
    W.ritual.holding = false;
    const full = S.charge >= 1;
    W.ritual.charge = 0;
    if (W.stage < STAGES.length) {
      if (full) {
        GS.ui.utterFulfill();
        safe('audio.chargeEnd', () => GS.audio.chargeEnd(true));
        S.cooldown = 1.0;
        fulfill();
      } else {
        GS.ui.utterCancel();
        if (S.mode === 'title') GS.ui.dimTitle(false);
        safe('audio.chargeEnd', () => GS.audio.chargeEnd(false));
        S.trail = [];
        safe('fx.trace', () => GS.fx.setTrace([]));
        if (W.stage <= 2 || S.charge < 0.25) GS.ui.hint('按住不放，直到话语说完', 2.8);
      }
    } else {
      safe('audio.chargeEnd', () => GS.audio.chargeEnd(full));
      if (S.charge > 0.45) behold(W.spirit.x, W.spirit.y, S.charge);
    }
    S.charge = 0;
  }

  function cancelHold() { if (S.holding) holdEnd(S.holdSrc); }

  // 安息之后的「观看」：灵所在之物显出它被造时的话，并受一圈祝福的光
  function pickAt(x, y, r, mods) {
    let best = null;
    for (const m of mods || ['cast', 'beasts', 'air', 'sea', 'scenes', 'land']) {
      const p = safe(m + '.pick', () => GS[m].pick && GS[m].pick(x, y, r));
      if (p && isFinite(p.d) && (!best || p.d < best.d)) { best = p; best.mod = m; }
    }
    return best;
  }
  function behold(x, y, power) {
    const p = pickAt(x, y, 70 * Math.max(0.7, W.unit));
    const b = GS.story.beholdAt(x, y, p ? p.label : null, p ? p.mod : null, p);
    const r = Math.min(W.w, W.h) * (0.22 + 0.3 * power);
    GS.fx.ring(x, y, [255, 232, 190], r, 2.2, 2);
    GS.fx.sparkle(x, y, 36, [255, 240, 210], 26);
    bus.emit('bless', { x, y, r });
    if (b && b.verse) GS.ui.narrate([b.verse]);
    safe('audio.behold', () => GS.audio.behold(b.kind));
  }

  // 目录：跳到任何一幕的开端（上帝可以随意翻到任何一页）
  function jumpTo(n) {
    n = clamp(n | 0, 0, STAGES.length - 1);
    GS.ui.toggleToc(false);
    // 回到「起初」：真正的重新创世（后来各幕的世界不能留在渊面上）；最远到过哪里仍记着
    if (n === 0) { clearSave(); location.replace(location.pathname); return; }
    const keep = {};
    for (const k in S.choices) if (+k < n) keep[k] = S.choices[k];
    restore(n, keep);
    if (n === 0) {
      S.mode = 'title';
      GS.ui.showDays(false); GS.ui.setAct(null); GS.ui.showTools(false);
      GS.ui.showTitle(null, newCreation, () => {}, openToc);
    }
    save();
    refreshHUD();
  }
  function openToc() { initAudio(); refreshHUD(); GS.ui.toggleToc(true); }

  function newCreation() {
    clearSave();
    location.replace(location.pathname);   // 最干净的重新创世：回到起初
  }

  // ── 声音 / 全屏 / 留影 ──────────────────────────────────────
  function initAudio() {
    safe('audio.init', () => { GS.audio.init(); GS.audio.setMuted(S.muted); });
  }
  function toggleMute() {
    S.muted = !S.muted;
    initAudio();
    safe('audio.setMuted', () => GS.audio.setMuted(S.muted));
    GS.ui.setSoundButton(S.muted);
    save();
  }
  function toggleFull() {
    const d = document, de = d.documentElement;
    try {
      if (!d.fullscreenElement && !d.webkitFullscreenElement) (de.requestFullscreen || de.webkitRequestFullscreen).call(de);
      else (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } catch (e) { /* 不支持 */ }
  }
  // 留影：把天幕与世界合成一张图（须在同一任务里先画天幕，WebGL 的缓冲才可读）
  function snapshot() {
    try {
      const c = document.createElement('canvas');
      c.width = canvas.width; c.height = canvas.height;
      const g = c.getContext('2d');
      g.fillStyle = '#000'; g.fillRect(0, 0, c.width, c.height);
      safe('sky.render', () => GS.sky.render());
      try { g.drawImage(skyCanvas(), 0, 0, c.width, c.height); } catch (e) { /* */ }
      g.drawImage(canvas, 0, 0);
      const k = c.width / W.w;
      g.scale(k, k);
      g.font = '15px "GS Kai", "Kaiti SC", "STKaiti", "Songti SC", serif';
      g.textAlign = 'right';
      g.fillStyle = 'rgba(250,246,236,0.72)';
      g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 4;
      const label = progressLabel();
      g.fillText('旧约 · God Simulator · ' + label, W.w - 18, W.h - 16);
      c.toBlob(b => {
        if (!b) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = '旧约-' + label.replace(/\s*·\s*/g, '-') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      }, 'image/png');
      GS.ui.hint('已留影', 2);
    } catch (e) { GS.ui.hint('此处无法留影', 2); }
  }

  // ── 输入 ────────────────────────────────────────────────────
  let lastMX = -1, lastMY = -1;
  function moveTo(x, y) {
    const sp = W.spirit;
    sp.tx = clamp(x, 0, W.w); sp.ty = clamp(y, 0, W.h);
    sp.guided = true;
    sp.lastInput = W.t;
    if (Math.abs(x - lastMX) + Math.abs(y - lastMY) > 3) { S.still = 0; lastMX = x; lastMY = y; }
  }
  // 触屏时灵悬在指尖上方，手指不会遮住它
  const touchLift = e => (e.pointerType === 'touch' ? 56 : 0);
  window.addEventListener('pointermove', e => { S.pointerType = e.pointerType || 'mouse'; moveTo(e.clientX, e.clientY - touchLift(e)); }, { passive: true });
  window.addEventListener('pointerdown', e => {
    S.pointerType = e.pointerType || 'mouse';
    if (e.target.closest && e.target.closest('button, #ledger, #help, #toc')) return;
    // 面板开着时，点世界即合上面板
    if (GS.ui.panelOpen()) { GS.ui.toggleLedger(false); GS.ui.toggleHelp(false); GS.ui.toggleToc(false); return; }
    moveTo(e.clientX, e.clientY - touchLift(e));
    // 灵若已飘远（久未移动时它会自行盘旋），按下时回到指下：话语在所指之处成就
    const sp = W.spirit;
    if (Math.hypot(sp.x - sp.tx, sp.y - sp.ty) > 150) { sp.x = sp.tx; sp.y = sp.ty; }
    if (e.button != null && e.button > 0) return;
    holdStart('pointer');
  });
  window.addEventListener('pointerup', () => holdEnd('pointer'));
  window.addEventListener('pointercancel', () => holdEnd('pointer'));
  document.addEventListener('pointerleave', () => holdEnd('pointer'));
  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('blur', () => { cancelHold(); S.keys.clear(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelHold();
    safe('audio.visibility', () => GS.audio.visibility && GS.audio.visibility(!document.hidden));
  });
  const MOVE_KEYS = { ArrowLeft: 1, ArrowRight: 1, ArrowUp: 1, ArrowDown: 1, KeyA: 1, KeyD: 1, KeyW: 1, KeyS: 1 };
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      if (e.target.closest && e.target.closest('button') && e.target.matches && e.target.matches(':focus-visible')) return;
      if (document.activeElement && document.activeElement.blur && document.activeElement.closest && document.activeElement.closest('button')) document.activeElement.blur();
      e.preventDefault();
      if (!e.repeat) holdStart('key');
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (MOVE_KEYS[e.code]) { S.keys.add(e.code); S.still = 0; e.preventDefault(); return; }
    if (e.repeat) return;
    S.still = 0;
    switch (e.code) {
      case 'KeyL': initAudio(); GS.ui.toggleToc(false); GS.ui.toggleLedger(); break;
      case 'KeyB': initAudio(); GS.ui.toggleLedger(false); refreshHUD(); GS.ui.toggleToc(); break;
      case 'KeyM': toggleMute(); break;
      case 'KeyF': toggleFull(); break;
      case 'KeyP': snapshot(); break;
      case 'KeyH': case 'Slash': GS.ui.toggleHelp(); break;
      case 'Escape': GS.ui.toggleLedger(false); GS.ui.toggleHelp(false); GS.ui.toggleToc(false); break;
      case 'KeyR':
        if (S.mode === 'rest') {
          if (S.restartArmed > 0) newCreation();
          else { S.restartArmed = 3; GS.ui.hint('再按一次 R —— 重新创世', 3); }
        }
        break;
    }
  });
  window.addEventListener('keyup', e => {
    if (e.code === 'Space' || e.code === 'Enter') holdEnd('key');
    S.keys.delete(e.code);
  });
  window.addEventListener('resize', resize);

  function wireButtons() {
    const el = GS.ui.el;
    // 按钮不夺焦点：否则之后空格会去"点"按钮，而不是言说
    const stop = b => b && b.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); });
    [el.bLedger, el.bToc, el.bSound, el.bFull, el.bHelp, el.bShot].forEach(stop);
    el.bLedger.addEventListener('click', () => { initAudio(); GS.ui.toggleToc(false); GS.ui.toggleLedger(); });
    if (el.bToc) el.bToc.addEventListener('click', () => { initAudio(); GS.ui.toggleLedger(false); refreshHUD(); GS.ui.toggleToc(); });
    if (el.toc) el.toc.addEventListener('click', e => {
      const b = e.target && e.target.closest ? e.target.closest('[data-stage]') : null;
      if (!b) return;
      const n = parseInt(b.dataset.stage, 10) || 0, cur = ACTS[W.act];
      // 点的是此刻所在的这一幕：只合上目录，不从头来过
      if (S.mode === 'play' && cur && n === cur.first && W.stage >= cur.first && W.stage <= cur.last + 1 && n > 0) { GS.ui.toggleToc(false); return; }
      jumpTo(n);
    });
    el.bSound.addEventListener('click', toggleMute);
    el.bFull.addEventListener('click', toggleFull);
    el.bHelp.addEventListener('click', () => GS.ui.toggleHelp());
    if (el.bShot) el.bShot.addEventListener('click', snapshot);
    el.help.addEventListener('click', () => GS.ui.toggleHelp(false));
    let restartAt = 0;
    el.ledger.addEventListener('click', e => {
      const t = e.target;
      if (!(t && t.dataset && t.dataset.act === 'restart')) return;
      if (Date.now() - restartAt < 3500) { newCreation(); return; }
      restartAt = Date.now();
      t.textContent = '再点一次 · 重新创世';
    });
  }

  // ── 每帧 ────────────────────────────────────────────────────
  function updateSpirit(dt) {
    const sp = W.spirit;
    // 键盘也能引领神的灵
    if (S.keys.size) {
      const v = 340 * dt;
      let dx = 0, dy = 0;
      if (S.keys.has('ArrowLeft') || S.keys.has('KeyA')) dx -= v;
      if (S.keys.has('ArrowRight') || S.keys.has('KeyD')) dx += v;
      if (S.keys.has('ArrowUp') || S.keys.has('KeyW')) dy -= v;
      if (S.keys.has('ArrowDown') || S.keys.has('KeyS')) dy += v;
      if (!sp.guided) { sp.tx = sp.x; sp.ty = sp.y; }
      moveTo(clamp(sp.tx + dx, 24, W.w - 24), clamp(sp.ty + dy, 24, W.h - 24));
    }
    // 久未受引领（或尚在标题）时，灵自行盘旋于水面之上；第七日静候时则缓缓安歇
    const idle = !sp.guided || (W.t - (sp.lastInput || 0) > 45 && !S.holding && !isRestStage());
    if (idle) {
      const t = W.t;
      sp.tx = W.w / 2 + Math.cos(t * 0.23) * W.w * 0.22 + Math.cos(t * 0.07) * W.w * 0.06;
      sp.ty = W.h * 0.5 + Math.sin(t * 0.19) * W.h * 0.12 + Math.sin(t * 0.11) * W.h * 0.04;
    }
    const k = 1 - Math.exp(-dt * (idle ? 1.2 : 5.5));
    const nx = sp.x + (sp.tx - sp.x) * k, ny = sp.y + (sp.ty - sp.y) * k;
    sp.vx = (nx - sp.x) / Math.max(dt, 1e-3);
    sp.vy = (ny - sp.y) / Math.max(dt, 1e-3);
    sp.speed = Math.hypot(sp.vx, sp.vy);
    sp.x = nx; sp.y = ny;
  }

  function updateRitual(dt) {
    if (S.cooldown > 0) {
      S.cooldown -= dt;
      if (S.cooldown <= 0 && S.pendingHold) { const src = S.pendingHold; S.pendingHold = null; holdStart(src); }
    }
    if (S.restartArmed > 0) S.restartArmed -= dt;

    // 叠句：按住的力量把黄昏拉近；松手未满则回到白昼
    const pullTarget = S.holding && S.kind === 'refrain' ? S.charge * 0.12 : 0;
    W.pull = U.approach(W.pull, pullTarget, S.holding ? 2.5 : 1.5, dt);
    if (Math.abs(W.pull) < 1e-4 && !pullTarget) W.pull = 0;

    if (!S.holding) return;
    S.charge = Math.min(1, S.charge + dt / S.need);
    W.ritual.charge = S.charge;
    const shown = GS.ui.utterProgress(S.charge);
    safe('audio.charge', () => GS.audio.charge(S.charge, shown));

    // 撒星：灵在天上划过的轨迹即是星的归宿
    if (S.kind === 'stars') {
      const sp = W.spirit, tr = S.trail;
      if (sp.y < W.horizonY - 10 && tr.length < 40) {
        const last = tr[tr.length - 1];
        if (!last || Math.hypot(sp.x - last[0], sp.y - last[1]) > 26 * Math.max(0.6, W.unit)) {
          tr.push([sp.x, sp.y]);
          safe('fx.trace', () => GS.fx.setTrace(tr));
        }
      }
    }
  }

  // 第七日：静止即安息。每静四秒为一息，七息而毕；一动，未完的那一息便散去
  function updateRest(dt) {
    if (S.mode !== 'play' || !isRestStage()) return;
    if (GS.ui.panelOpen()) return;
    S.still += dt * W.fast;
    if (S.still >= 4) {
      S.still = 0;
      S.breaths++;
      safe('audio.breath', () => GS.audio.breath(S.breaths));
      refreshHUD();
      if (S.breaths >= 7) { S.breaths = 0; GS.ui.hideHint(); fulfill(); }
    }
  }

  // 轻声提醒：久无言说时
  function updateIdle(dt) {
    GS.ui.setUnfolding(S.mode === 'play' && !S.transition && (GS.ui.narrating() || GS.book.busy()));
    if (S.mode !== 'play' || S.holding || isRestStage() || S.transition) { S.idle = 0; return; }
    if (GS.ui.narrating() || GS.ui.panelOpen() || GS.book.busy()) { S.idle = 0; return; }
    S.idle += dt;
    // 故事一静下来便轻声提醒（开头几句更快），之后隔一阵再提醒
    const lim = W.stage <= 4 ? 4 : 12;
    if (S.idle > lim) { S.idle = -28; GS.ui.hint(W.stage <= 1 ? '再按住 · 说出下一句' : '按住 · 言说', 4); }
  }

  function updateTags() {
    // 全书终了后万物显名；七日之后的各卷里，只让人物与布景显名（好认出谁是谁，不添杂音）
    if ((S.mode !== 'rest' && W.act < 1) || S.holding || S.transition) { GS.ui.tag(''); return; }
    const sp = W.spirit;
    if (sp.speed > 600) { GS.ui.tag(''); return; }
    const best = pickAt(sp.x, sp.y, 60 * Math.max(0.7, W.unit), S.mode === 'rest' ? null : ['cast', 'scenes']);
    if (best) GS.ui.tag(best.label, best.x, best.y - 12);
    else GS.ui.tag('');
  }

  function adaptQuality(dt) {
    if (LOCK_Q || document.hidden) return;
    const P = S.perf;
    P.acc += dt; P.n++;
    if (P.acc > 2.5) {
      const avg = P.acc / P.n;
      if (avg > 0.026 && W.quality > 0.5) {
        W.quality = Math.max(0.5, W.quality - 0.25);
        safe('sky.quality', () => GS.sky.resize(skyCanvas(), W.w, W.h, W.dpr));
      }
      P.acc = 0; P.n = 0;
    }
  }

  function frame(now) {
    const t = now / 1000;
    let dt = S.lastT ? t - S.lastT : 0.016;
    S.lastT = t;
    dt = clamp(dt, 0, 0.05);

    updateSpirit(dt);
    updateRitual(dt);
    W.update(dt);
    // 黎明：日出的一刻（或这一轮昼夜被催促结束时）
    if (W.cycling && S.prevTod != null && S.prevTod < 0.25 && W.tod >= 0.25 && W.tod < 0.5) safe('dawn', onDawn);
    if (S.wasCycling && !W.cycling) safe('dawn', onDawn);
    S.wasCycling = W.cycling;
    S.prevTod = W.tod;
    updateRest(dt);
    updateIdle(dt);
    for (const m of MODS) safe(m + '.update', () => GS[m].update(dt));
    safe('audio.update', () => GS.audio.update(dt));

    // 大地震颤：言说时渐强，成就时一震（减弱动效时几乎不动）
    const st = stageNow();
    const amp = shakeAmp(S.holding ? st : null) || 0;
    let tremor = S.holding ? S.charge * S.charge * amp : W.shake * W.shake * 5;
    if (W.reduced) { tremor *= 0.2; W.flash = Math.min(W.flash, 0.35); }
    W.jx = tremor > 0.01 ? Math.sin(W.t * 91.3) * tremor : 0;
    W.jy = tremor > 0.01 ? Math.cos(W.t * 77.7) * tremor : 0;

    if (GS.debug.noDraw) { requestAnimationFrame(frame); return; }     // 测试：只推进世界，不画
    safe('sky.render', () => GS.sky.render());

    ctx.save();
    ctx.clearRect(0, 0, W.w, W.h);
    ctx.translate(W.jx, W.jy);
    for (const p of PASSES) {
      if (p === 'top') ctx.translate(-W.jx, -W.jy);
      for (const m of MODS) safe(m + '.draw.' + p, () => GS[m].draw(ctx, p));
    }
    ctx.restore();

    updateTags();
    adaptQuality(dt);
    requestAnimationFrame(frame);
  }

  // ── 启动 ────────────────────────────────────────────────────
  function boot() {
    GS.ui.init();
    wireButtons();
    safe('sky.init', () => GS.sky.init(skyCanvas()));
    for (const m of MODS) safe(m + '.init', () => GS[m].init());
    resize();

    const sv = load();
    S.muted = !!(sv && sv.muted);
    S.max = sv ? sv.max || sv.stage || 0 : 0;
    GS.ui.setSoundButton(S.muted);
    bus.on('scripture', line => {
      safe('audio.bell', () => GS.audio.bell());
      // 「神看着是好的」——好的动机；「甚好」——完整的和弦
      if (/甚好/.test(line.text)) setTimeout(() => safe('audio.good', () => GS.audio.good(true)), 700);
      else if (/是好的/.test(line.text)) setTimeout(() => safe('audio.good', () => GS.audio.good(false)), 700);
    });

    const jump = params.get('stage');
    if (jump != null) {
      const n = parseInt(jump, 10) || 0;
      restore(n, sv && sv.stage === n ? sv.choices : null);
      if (n === 0) GS.ui.showTitle(null, newCreation, () => {}, openToc);
    } else {
      GS.ui.showTitle(sv && sv.stage > 0 ? sv : null, newCreation, () => restore(sv.stage, sv.choices), openToc);
    }
    refreshHUD();
    requestAnimationFrame(frame);
  }

  // 调试 / 自动化测试用
  GS.debug = {
    next() {
      if (W.stage >= STAGES.length) return false;
      initAudio();
      const st = stageNow();
      W.ritual.tint = st.tint;
      if (st.utter) { GS.ui.utterBegin(st.utter, st.tint, st.kind); GS.ui.utterProgress(1); GS.ui.utterFulfill(); }
      fulfill();
      return true;
    },
    jump: n => { restore(n); },
    jumpTo: n => jumpTo(n),
    noDraw: false,
    dawn: () => onDawn(),
    state: () => ({ stage: W.stage, day: W.day, mode: S.mode, sealed: S.sealed, breaths: S.breaths, lv: Object.assign({}, W.lv), tod: W.tod, quality: W.quality }),
    S,
  };
  GS.main = { restore, fulfill, newCreation, snapshot, labelFor, jumpTo, PASSES, MODS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.GS);
