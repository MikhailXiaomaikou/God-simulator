/* ─────────────────────────────────────────────────────────────
 * main.js —— 运行：输入、言说的仪式、每帧的世界、存档
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W, bus = GS.bus;
  const { clamp, safe } = U;
  const STAGES = GS.story.STAGES;
  const SAVE_KEY = 'godsim.v2';

  // 绘制次序：由远及近。每个模块在每一"层"画属于它的东西。
  const PASSES = ['sky', 'seaFar', 'far', 'seaMid', 'mid', 'seaNear', 'near', 'air', 'top'];
  const MODS = ['land', 'sea', 'beasts', 'air', 'fx'];

  const skyCanvas = document.getElementById('sky');
  const canvas = document.getElementById('world');
  const ctx = canvas.getContext('2d');

  // ── 参数 ────────────────────────────────────────────────────
  const params = new URLSearchParams(location.search + '&' + location.hash.replace(/^#/, ''));
  W.fast = clamp(parseFloat(params.get('fast')) || 1, 0.1, 20);
  W.quality = params.get('q') ? clamp(parseFloat(params.get('q')) || 1, 0.5, 1) : 1;
  const LOCK_Q = params.has('q');           // 指定画质时不再自动降级（截图 / 测试用）

  // ── 状态 ────────────────────────────────────────────────────
  const S = {
    mode: 'title',          // 'title' | 'play' | 'rest'（安息之后）
    holding: false, holdSrc: '', charge: 0, need: 1,
    cooldown: 0,
    muted: false,
    restartArmed: 0,
    lastT: 0,
    perf: { acc: 0, n: 0, slow: 0 },
    started: false,
  };

  // ── 存档 ────────────────────────────────────────────────────
  function load() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ stage: W.stage, day: currentDay(), muted: S.muted, v: 2 })); } catch (e) { /* 隐私模式 */ }
  }
  function clearSave() {
    try { const s = load(); localStorage.setItem(SAVE_KEY, JSON.stringify({ stage: 0, day: 0, muted: s ? s.muted : false, v: 2 })); } catch (e) { /* */ }
  }

  // ── 日的记号 ────────────────────────────────────────────────
  function currentDay() { return W.stage < STAGES.length ? STAGES[W.stage].day : 7; }
  function sealedDays() {
    let n = 0;
    for (let i = 0; i < W.stage; i++) if (STAGES[i].evening) n++;
    if (W.stage >= STAGES.length) n = 7;
    return n;
  }
  function refreshHUD() {
    W.day = currentDay();
    GS.ui.setDays(W.day, sealedDays(), W.stage >= STAGES.length);
    GS.ui.renderLedger(STAGES, W.stage);
  }

  // ── 布局 ────────────────────────────────────────────────────
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W.resize(w, h, dpr);
    safe('sky.resize', () => GS.sky.resize(skyCanvas, w, h, dpr));
    for (const m of MODS) safe(m + '.resize', () => GS[m].resize());
  }

  // ── 话语成就 ────────────────────────────────────────────────
  function fulfill() {
    const st = STAGES[W.stage];
    if (!st) return;
    const x = W.spirit.x, y = W.spirit.y;
    W.hurryClock();
    safe('stage.apply', () => st.apply({ instant: false, x, y }));
    W.stage++;
    W.shake = 1;
    GS.ui.narrate(st.verse);
    safe('audio.fulfill', () => GS.audio.fulfill(st.day, st.index));
    bus.emit('fulfill', { stage: st, x, y });
    refreshHUD();
    save();

    if (st.index === 0) enterPlay();
    if (st.final) enterRest();
  }

  function enterPlay() {
    S.mode = 'play';
    GS.ui.hideTitle();
    GS.ui.showDays(true);
    GS.ui.showTools(true);
  }

  function enterRest() {
    S.mode = 'rest';
    W.freeClock = true;
    setTimeout(() => { GS.ui.finale(true); safe('audio.finale', () => GS.audio.finale()); }, 9500 / W.fast);
    setTimeout(() => GS.ui.finale(false), 19000 / W.fast);
    setTimeout(() => GS.ui.hint('按住画面，为所经过之处赐福', 6), 21000 / W.fast);
  }

  // 恢复到第 n 句话语之后的世界（瞬间，无动画）
  function restore(n) {
    n = clamp(n | 0, 0, STAGES.length);
    for (let i = 0; i < n; i++) safe('restore ' + i, () => STAGES[i].apply({ instant: true, x: W.w * 0.72, y: W.h * 0.55 }));
    W.snapAll();
    W.stage = n;
    for (const m of MODS) safe(m + '.restore', () => GS[m].restore && GS[m].restore());
    refreshHUD();
    if (n > 0) {
      enterPlay();
      if (n >= STAGES.length) { S.mode = 'rest'; W.freeClock = true; }
      const nx = STAGES[n];
      setTimeout(() => {
        if (nx) GS.ui.hint(GS.ui.DAY_NAME[nx.day] + ' · 按住画面，继续言说', 5);
        else GS.ui.hint('安息 · 按住画面，为所经过之处赐福', 5);
      }, 1800 / W.fast);
    }
  }

  // ── 言说的把持与松开 ────────────────────────────────────────
  function holdStart(src) {
    initAudio();
    if (S.holding || S.cooldown > 0) return;
    if (GS.ui.panelOpen()) return;
    if (S.mode === 'title') {
      const sv = load();
      if (sv && sv.stage > 0) { beginContinue(sv); return; }
    }
    S.holding = true;
    S.holdSrc = src;
    S.charge = 0;
    const st = STAGES[W.stage];
    if (st) {
      const len = Array.from(st.utter).length;
      S.need = (0.45 + len * 0.1) / W.fast;
      W.ritual.text = st.utter;
      W.ritual.tint = st.tint;
      GS.ui.utterBegin(st.utter, st.tint);
      safe('audio.chargeStart', () => GS.audio.chargeStart(st.day));
    } else {
      // 安息之后：按住为所经之处赐福
      S.need = 1.1 / W.fast;
      W.ritual.text = '';
      W.ritual.tint = [255, 236, 200];
      safe('audio.chargeStart', () => GS.audio.chargeStart(7, true));
    }
    W.ritual.holding = true;
    GS.ui.hideHint();
    if (S.mode === 'title') GS.ui.dimTitle(true);
  }

  function holdEnd(src) {
    if (!S.holding || src !== S.holdSrc) return;
    S.holding = false;
    W.ritual.holding = false;
    const full = S.charge >= 1;
    W.ritual.charge = 0;
    if (W.stage < STAGES.length) {
      if (full) {
        GS.ui.utterFulfill();
        safe('audio.chargeEnd', () => GS.audio.chargeEnd(true));
        S.cooldown = 0.9;
        fulfill();
      } else {
        GS.ui.utterCancel();
        if (S.mode === 'title') GS.ui.dimTitle(false);
        safe('audio.chargeEnd', () => GS.audio.chargeEnd(false));
        if (W.stage === 0 || S.charge < 0.25) GS.ui.hint('按住不放，直到话语说完', 2.8);
      }
    } else {
      safe('audio.chargeEnd', () => GS.audio.chargeEnd(full));
      if (S.charge > 0.45) bless(W.spirit.x, W.spirit.y, S.charge);
    }
    S.charge = 0;
  }

  function cancelHold() { if (S.holding) holdEnd(S.holdSrc); }

  function bless(x, y, power) {
    GS.fx.ring(x, y, [255, 232, 190], Math.min(W.w, W.h) * (0.25 + 0.35 * power), 2.2, 2);
    GS.fx.sparkle(x, y, 40, [255, 240, 210], 30);
    bus.emit('bless', { x, y, r: Math.min(W.w, W.h) * (0.25 + 0.35 * power) });
    safe('audio.bless', () => GS.audio.bless());
  }

  function beginContinue(sv) {
    restore(sv.stage);
  }

  function newCreation() {
    clearSave();
    location.replace(location.pathname);   // 最干净的重新创世：回到起初
  }

  // ── 声音 ────────────────────────────────────────────────────
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
    const d = document;
    try {
      if (!d.fullscreenElement && !d.webkitFullscreenElement) {
        (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen).call(d.documentElement);
      } else {
        (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      }
    } catch (e) { /* 不支持 */ }
  }

  // ── 输入 ────────────────────────────────────────────────────
  function moveTo(x, y) {
    const sp = W.spirit;
    sp.tx = x; sp.ty = y;
    sp.guided = true;
    sp.lastInput = W.t;
  }
  window.addEventListener('pointermove', e => moveTo(e.clientX, e.clientY), { passive: true });
  window.addEventListener('pointerdown', e => {
    if (e.target.closest && e.target.closest('button, #ledger, #help')) return;
    if (e.pointerType !== 'mouse') moveTo(e.clientX, e.clientY);
    if (e.button != null && e.button > 0) return;
    holdStart('pointer');
  });
  window.addEventListener('pointerup', () => holdEnd('pointer'));
  window.addEventListener('pointercancel', () => holdEnd('pointer'));
  window.addEventListener('contextmenu', e => e.preventDefault());
  window.addEventListener('blur', cancelHold);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelHold();
    safe('audio.visibility', () => GS.audio.visibility && GS.audio.visibility(!document.hidden));
  });
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (!e.repeat) holdStart('key');
      return;
    }
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.code) {
      case 'KeyL': initAudio(); GS.ui.toggleLedger(); break;
      case 'KeyM': toggleMute(); break;
      case 'KeyF': toggleFull(); break;
      case 'KeyH': case 'Slash': GS.ui.toggleHelp(); break;
      case 'Escape': GS.ui.toggleLedger(false); GS.ui.toggleHelp(false); break;
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
  });
  window.addEventListener('resize', resize);

  function wireButtons() {
    const el = GS.ui.el;
    const stop = b => {
      b.addEventListener('pointerdown', e => e.stopPropagation());
    };
    [el.bLedger, el.bSound, el.bFull, el.bHelp].forEach(stop);
    el.bLedger.addEventListener('click', () => GS.ui.toggleLedger());
    el.bSound.addEventListener('click', toggleMute);
    el.bFull.addEventListener('click', toggleFull);
    el.bHelp.addEventListener('click', () => GS.ui.toggleHelp());
    el.help.addEventListener('click', () => GS.ui.toggleHelp(false));
    el.ledger.addEventListener('click', e => {
      const t = e.target;
      if (t && t.dataset && t.dataset.act === 'restart') newCreation();
    });
  }

  // ── 每帧 ────────────────────────────────────────────────────
  function updateSpirit(dt) {
    const sp = W.spirit;
    // 久未受引领（或尚在标题）时，灵自行盘旋于水面之上
    const idle = !sp.guided || (W.t - (sp.lastInput || 0) > 40 && !S.holding);
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
    if (S.cooldown > 0) S.cooldown -= dt;
    if (S.restartArmed > 0) S.restartArmed -= dt;
    if (!S.holding) return;
    S.charge = Math.min(1, S.charge + dt / S.need);
    W.ritual.charge = S.charge;
    GS.ui.utterProgress(S.charge);
    safe('audio.charge', () => GS.audio.charge(S.charge));
  }

  function updateTags() {
    if (S.mode !== 'rest' || S.holding) { GS.ui.tag(''); return; }
    const sp = W.spirit;
    if (sp.speed > 600) return;
    let best = null;
    for (const m of ['beasts', 'air', 'sea']) {
      const r = safe(m + '.pick', () => GS[m].pick && GS[m].pick(sp.x, sp.y, 60 * Math.max(0.7, W.unit)));
      if (r && (!best || r.d < best.d)) best = r;
    }
    if (best) GS.ui.tag(best.label, best.x, best.y - 12);
    else GS.ui.tag('');
  }

  function adaptQuality(dt) {
    if (LOCK_Q || document.hidden) return;
    const P = S.perf;
    P.acc += dt; P.n++;
    if (P.acc > 2) {
      const avg = P.acc / P.n;
      if (avg > 0.028 && W.quality > 0.5) { W.quality = Math.max(0.5, W.quality - 0.25); safe('sky.quality', () => GS.sky.resize(skyCanvas, W.w, W.h, W.dpr)); }
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
    for (const m of MODS) safe(m + '.update', () => GS[m].update(dt));
    safe('audio.update', () => GS.audio.update(dt));

    // 大地震颤：言说时渐强，成就时一震
    const tremor = S.holding ? S.charge * S.charge * 2.4 : W.shake * W.shake * 6;
    W.jx = tremor > 0.01 ? Math.sin(W.t * 91.3) * tremor : 0;
    W.jy = tremor > 0.01 ? Math.cos(W.t * 77.7) * tremor : 0;

    safe('sky.render', () => GS.sky.render());

    ctx.save();
    ctx.clearRect(0, 0, W.w, W.h);
    ctx.translate(W.jx, W.jy);
    for (const p of PASSES) {
      if (p === 'top') { ctx.translate(-W.jx, -W.jy); }
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
    safe('sky.init', () => GS.sky.init(skyCanvas));
    for (const m of MODS) safe(m + '.init', () => GS[m].init());
    resize();

    const sv = load();
    S.muted = !!(sv && sv.muted);
    GS.ui.setSoundButton(S.muted);
    bus.on('scripture', () => safe('audio.bell', () => GS.audio.bell()));

    const jump = params.get('stage');
    if (jump != null) {
      restore(parseInt(jump, 10) || 0);
      if ((parseInt(jump, 10) || 0) === 0) GS.ui.showTitle(null);
    } else {
      GS.ui.showTitle(sv && sv.stage > 0 ? sv : null, newCreation, () => beginContinue(sv));
    }
    refreshHUD();
    requestAnimationFrame(frame);
  }

  // 调试 / 自动化测试用
  GS.debug = {
    next() {
      if (W.stage >= STAGES.length) return false;
      initAudio();
      const st = STAGES[W.stage];
      W.ritual.tint = st.tint;
      GS.ui.utterBegin(st.utter, st.tint); GS.ui.utterProgress(1); GS.ui.utterFulfill();
      fulfill();
      return true;
    },
    jump: n => { restore(n); },
    state: () => ({ stage: W.stage, day: W.day, mode: S.mode, lv: Object.assign({}, W.lv), tod: W.tod, quality: W.quality }),
    S,
  };
  GS.main = { restore, fulfill, newCreation, PASSES, MODS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.GS);
