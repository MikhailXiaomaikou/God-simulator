/* ─────────────────────────────────────────────────────────────
 * book.js —— 创世记全书：卷的登记、情节的时间线、各卷布景的总调度
 *
 * 第一卷「七日」来自 story.js。其后各卷（伊甸、该隐、洪水、巴别、亚伯拉罕、雅各、约瑟）
 * 各自在 js/book/*.js 里用 GS.book.act({...}) 登记：它们的话语接在 STAGES 后面，
 * 于是整部书仍是一条线——每一句话只成就一步，存档仍只是一个数字。
 *
 * 卷的定义：
 *   {
 *     id: 'eden', title: '伊甸', sub: '创世记 2:4 — 3:24', tint: [r,g,b], day: 8,
 *     setup(c),          // 进入本卷时布置世界（c.instant 恒为 true：在幕布之后瞬间完成）
 *     stages: [ ... ],   // 与 story.js 的 stage 同形：{ kind, utter, cmd, ref, verse:[{text,ref,hold}], apply(c), hold?, after? }
 *     scene: { init, resize, update(dt), drawUnder(ctx,pass), draw(ctx,pass), reset, restore, pick(x,y,r) }  // 本卷的布景
 *     outro: 秒,         // 本卷最后一句成就后，隔多久落幕进入下一卷（默认 16）
 *   }
 *
 * 情节时间线：GS.book.timeline(c, [[秒, fn], ...])
 *   话语成就后，世界里的事按时间先后发生（方舟造成、动物进舟、雨降下……）。
 *   恢复存档或下一句话提前成就时，未发生的会被立即补完（fn 收到 {instant:true}，且 W.replaying 为真），
 *   所以世界永远与"一步一步看完"时一致。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const { safe } = U;
  const STAGES = GS.story.STAGES;

  W.defineLevel('curtain', 'exp', 1.6);      // 卷与卷之间的幕布（黑）

  // ── 卷 ──────────────────────────────────────────────────────
  const ACTS = [];
  ACTS.push({
    id: 'seven', index: 0, title: '七日', sub: '创世记 1:1 — 2:3', tint: [255, 250, 240],
    first: 0, last: STAGES.length - 1, setup: null, outro: 30,
  });
  STAGES.forEach(s => { s.act = 0; });

  const CN_NUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

  function act(def) {
    const a = Object.assign({ outro: 16, tint: [255, 240, 210], day: 7 }, def);
    a.index = ACTS.length;
    a.first = STAGES.length;
    a.numeral = '卷' + CN_NUM[a.index];
    (def.stages || []).forEach(st => {
      st.act = a.index;
      st.index = STAGES.length;
      if (!st.tint) st.tint = a.tint;
      if (st.day == null) st.day = a.day;
      if (!st.kind) st.kind = 'cmd';
      STAGES.push(st);
    });
    a.last = STAGES.length - 1;
    ACTS.push(a);
    if (def.scene) addScene(def.scene, a);
    return a;
  }
  const actOf = stageIndex => ACTS[(STAGES[stageIndex] && STAGES[stageIndex].act) || 0];

  // ── 情节时间线 ──────────────────────────────────────────────
  // 以世界时间（W.t，随帧推进）计时，而非墙上时钟：卡顿或切走标签页时，情节与画面始终同步
  const pending = [];
  function timeline(c, beats) {
    beats = beats.slice().sort((a, b) => a[0] - b[0]);
    if ((c && c.instant) || W.replaying) {
      const prev = W.replaying;
      W.replaying = true;
      beats.forEach(b => safe('beat', () => b[1]({ instant: true })));
      W.replaying = prev;
      return;
    }
    beats.forEach(b => pending.push({ fn: b[1], done: false, at: W.t + Math.max(0, b[0]) / (W.fast || 1) }));
    pending.sort((a, b) => a.at - b.at);
  }
  function run(item, instant) {
    if (item.done) return;
    item.done = true;
    const i = pending.indexOf(item);
    if (i >= 0) pending.splice(i, 1);
    const prev = W.replaying;
    if (instant) W.replaying = true;
    safe('beat', () => item.fn({ instant: !!instant }));
    W.replaying = prev;
  }
  // 引擎自己的定时（落幕、卷首……）：同样按世界时间，但不随下一句话被"补完"
  const timers = [];
  function after(sec, fn) { const h = { at: W.t + Math.max(0, sec) / (W.fast || 1), fn }; timers.push(h); timers.sort((a, b) => a.at - b.at); return h; }
  function cancel(h) { const i = timers.indexOf(h); if (i >= 0) timers.splice(i, 1); }
  function tick() {
    let guard = 50;
    while (pending.length && pending[0].at <= W.t && guard--) run(pending[0], false);
    guard = 20;
    while (timers.length && timers[0].at <= W.t && guard--) { const t = timers.shift(); safe('timer', t.fn); }
  }
  // 把尚未发生的情节立即补完（按原先的先后）
  function flush() { let guard = 500; while (pending.length && guard--) run(pending[0], true); }
  const busy = () => pending.length > 0;

  // ── 各卷布景的总调度 ────────────────────────────────────────
  const scenes = [];
  let booted = false;
  function addScene(s, a) {
    s.act = a;
    scenes.push(s);
    if (booted) { safe('scene.init', () => s.init && s.init()); safe('scene.resize', () => s.resize && s.resize()); }
  }
  const each = (m, ...args) => { for (let i = 0; i < scenes.length; i++) { const s = scenes[i]; if (s[m]) safe('scene.' + (s.act && s.act.id) + '.' + m, () => s[m](...args)); } };

  // 在大地之后、生灵之前画（河流、祭坛、城……）
  GS.scenes = {
    init() { booted = true; each('init'); },
    resize() { each('resize'); },
    update(dt) { tick(); each('update', dt); },
    draw(ctx, pass) { each('drawUnder', ctx, pass); },
    reset() { each('reset'); flush(); },
    restore() { each('restore'); },
    pick(x, y, r) {
      let best = null;
      for (const s of scenes) {
        if (!s.pick) continue;
        const p = safe('scene.pick', () => s.pick(x, y, r));
        if (p && isFinite(p.d) && (!best || p.d < best.d)) best = p;
      }
      return best;
    },
  };
  // 在生灵之后、人之前画（方舟、塔、火、梯……）
  GS.scenesOver = {
    init() {}, resize() {}, update() {}, reset() {}, restore() {},
    draw(ctx, pass) {
      each('draw', ctx, pass);
      if (pass === 'top') drawCurtain(ctx);
    },
  };
  function drawCurtain(ctx) {
    const c = W.lv.curtain;
    if (c < 0.002) return;
    ctx.fillStyle = 'rgba(0,0,0,' + Math.min(1, c).toFixed(3) + ')';
    ctx.fillRect(-20, -20, W.w + 40, W.h + 40);
  }

  // 让生灵按世界此刻的目标"多退少补"（在幕布、暴雨、黑夜等遮掩之时调用：动物进方舟、出方舟……）
  function resync() {
    for (const m of ['land', 'sea', 'beasts', 'air']) safe(m + '.restore', () => GS[m] && GS[m].restore && GS[m].restore());
  }
  // 本卷是否正在进行（布景只在自己的卷里画）
  const current = id => ACTS[W.act] && ACTS[W.act].id === id;

  // 每一卷开始时，这些"卷内"的程度先回到默认，再由该卷的 setup 自行设定（前一卷的枯黄、花隐等不会误带过来）
  const ACT_DEFAULTS = { bare: 0, bloom: 1 };
  function resetActLevels() { for (const k in ACT_DEFAULTS) if (W.hasLevel(k)) W.set(k, ACT_DEFAULTS[k], true); }

  GS.book = { ACTS, act, actOf, timeline, flush, busy, after, cancel, resync, current, resetActLevels, ACT_DEFAULTS, CN_NUM, scenes };
})(window.GS);
