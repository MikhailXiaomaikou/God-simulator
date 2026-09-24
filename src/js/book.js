/* ─────────────────────────────────────────────────────────────
 * book.js —— 旧约全书：书与幕的登记、情节的时间线、各幕布景的总调度
 *
 * 圣经六十六卷：旧约三十九卷，从创世记到玛拉基书；新约二十七卷，从马太福音到启示录——讲成一条线上的许多「幕」（act）：
 * 第一幕「七日」来自 story.js；其后每一幕各在 js/book/*.js 里用 GS.book.act({...}) 登记，
 * 按 src/index.html 里的先后接在 STAGES 后面——每一句话只成就一步，存档仍只是一个数字。
 * 一卷书可分几幕（出埃及记：摩西、十灾、红海、西奈），几卷书也可合为一幕（十二小先知）。
 *
 * 幕的定义：
 *   {
 *     id: 'eden', title: '伊甸', sub: '创世记 2:4 — 3:24', tint: [r,g,b], day: 8,
 *     book: '创世记', books: [1],       // 所属之书的名（顶上显示）与卷序（1 … 39；几卷合为一幕时列出全部）
 *     music: 'joseph',                 // 可选：借用哪一幕的乐色（声音模块尚未为本幕另写乐垫时）
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

  // ── 旧约三十九卷 ────────────────────────────────────────────
  // [书名, 简称, 章数, 类]
  const BOOKS = [
    ['创世记', '创', 50, 0], ['出埃及记', '出', 40, 0], ['利未记', '利', 27, 0], ['民数记', '民', 36, 0], ['申命记', '申', 34, 0],
    ['约书亚记', '书', 24, 1], ['士师记', '士', 21, 1], ['路得记', '得', 4, 1], ['撒母耳记上', '撒上', 31, 1], ['撒母耳记下', '撒下', 24, 1],
    ['列王纪上', '王上', 22, 1], ['列王纪下', '王下', 25, 1], ['历代志上', '代上', 29, 1], ['历代志下', '代下', 36, 1], ['以斯拉记', '拉', 10, 1],
    ['尼希米记', '尼', 13, 1], ['以斯帖记', '斯', 10, 1],
    ['约伯记', '伯', 42, 2], ['诗篇', '诗', 150, 2], ['箴言', '箴', 31, 2], ['传道书', '传', 12, 2], ['雅歌', '歌', 8, 2],
    ['以赛亚书', '赛', 66, 3], ['耶利米书', '耶', 52, 3], ['耶利米哀歌', '哀', 5, 3], ['以西结书', '结', 48, 3], ['但以理书', '但', 12, 3],
    ['何西阿书', '何', 14, 4], ['约珥书', '珥', 3, 4], ['阿摩司书', '摩', 9, 4], ['俄巴底亚书', '俄', 1, 4], ['约拿书', '拿', 4, 4],
    ['弥迦书', '弥', 7, 4], ['那鸿书', '鸿', 3, 4], ['哈巴谷书', '哈', 3, 4], ['西番雅书', '番', 3, 4], ['哈该书', '该', 2, 4],
    ['撒迦利亚书', '亚', 14, 4], ['玛拉基书', '玛', 4, 4],
    // 新约二十七卷
    ['马太福音', '太', 28, 5], ['马可福音', '可', 16, 5], ['路加福音', '路', 24, 5], ['约翰福音', '约', 21, 5],
    ['使徒行传', '徒', 28, 6],
    ['罗马书', '罗', 16, 7], ['哥林多前书', '林前', 16, 7], ['哥林多后书', '林后', 13, 7], ['加拉太书', '加', 6, 7], ['以弗所书', '弗', 6, 7],
    ['腓立比书', '腓', 4, 7], ['歌罗西书', '西', 4, 7], ['帖撒罗尼迦前书', '帖前', 5, 7], ['帖撒罗尼迦后书', '帖后', 3, 7], ['提摩太前书', '提前', 6, 7],
    ['提摩太后书', '提后', 4, 7], ['提多书', '多', 3, 7], ['腓利门书', '门', 1, 7],
    ['希伯来书', '来', 13, 8], ['雅各书', '雅', 5, 8], ['彼得前书', '彼前', 5, 8], ['彼得后书', '彼后', 3, 8], ['约翰一书', '约一', 5, 8],
    ['约翰二书', '约二', 1, 8], ['约翰三书', '约三', 1, 8], ['犹大书', '犹', 1, 8],
    ['启示录', '启', 22, 9],
  ].map((b, i) => ({ n: i + 1, name: b[0], abbr: b[1], chapters: b[2], group: b[3], t: i < 39 ? 0 : 1 }));
  const GROUPS = ['律法书', '历史书', '诗歌智慧书', '大先知书', '小先知书', '福音书', '历史书', '保罗书信', '普通书信', '预言书'];
  // 两约：旧约三十九卷（1 … 39），新约二十七卷（40 … 66）；卷序在各约之内从「第一卷」数起
  const TESTAMENTS = [{ name: '旧约', first: 1, last: 39 }, { name: '新约', first: 40, last: 66 }];
  const testamentOf = n => (n > 39 ? 1 : 0);

  // 中文数字（1 … 199）
  const DIG = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  function cn(n) {
    n = n | 0;
    if (n < 10) return DIG[n];
    if (n < 20) return '十' + (n % 10 ? DIG[n % 10] : '');
    if (n < 100) return DIG[(n / 10) | 0] + '十' + (n % 10 ? DIG[n % 10] : '');
    const r = n % 100;
    return DIG[(n / 100) | 0] + '百' + (r ? (r < 10 ? '零' + DIG[r] : r < 20 ? '一' + cn(r) : cn(r)) : '');
  }
  const CN_NUM = Array.from({ length: 60 }, (_, i) => cn(i + 1));
  // 「第二卷」「第十三—十四卷」「第二十八—三十三卷」；新约：「新约第一—四卷」「新约第十—十二、十八卷」
  function bookOrdinal(nums) {
    if (!nums || !nums.length) return '';
    const t = testamentOf(Math.min(...nums)), base = TESTAMENTS[t].first - 1;
    const ns = Array.from(new Set(nums)).sort((x, y) => x - y).map(n => n - base);
    const runs = [];
    for (const n of ns) { const r = runs[runs.length - 1]; if (r && n === r[1] + 1) r[1] = n; else runs.push([n, n]); }
    const body = runs.map(r => (r[0] === r[1] ? cn(r[0]) : cn(r[0]) + '—' + cn(r[1]))).join('、');
    return (t ? '新约' : '') + '第' + body + '卷';
  }

  // ── 幕 ──────────────────────────────────────────────────────
  const ACTS = [];
  ACTS.push({
    id: 'seven', index: 0, title: '七日', sub: '创世记 1:1 — 2:3', tint: [255, 250, 240],
    book: '创世记', books: [1], numeral: '创世记', testament: 0,
    first: 0, last: STAGES.length - 1, setup: null, outro: 30,
  });
  STAGES.forEach(s => { s.act = 0; });

  function act(def) {
    const a = Object.assign({ outro: 16, tint: [255, 240, 210], day: 7 }, def);
    a.index = ACTS.length;
    a.first = STAGES.length;
    const prev = ACTS[ACTS.length - 1];
    if (!a.book) a.book = def.books && BOOKS[def.books[0] - 1] ? BOOKS[def.books[0] - 1].name : prev.book;
    if (!a.books || !a.books.length) {
      const bk = BOOKS.find(b => b.name === a.book);
      a.books = bk ? [bk.n] : prev.books.slice();
    }
    a.numeral = a.book;
    a.ordinal = bookOrdinal(a.books);
    a.testament = testamentOf(Math.min(...a.books));
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
  // 丢弃一切未发生的情节与计时（恢复存档 / 跳转时）
  function reset() { pending.length = 0; timers.length = 0; }
  function tick() {
    let guard = 50;
    while (pending.length && pending[0].at <= W.t && guard--) run(pending[0], false);
    guard = 20;
    while (timers.length && timers[0].at <= W.t && guard--) { const t = timers.shift(); safe('timer', t.fn); }
  }
  // 把尚未发生的情节立即补完（按原先的先后）
  function flush() {
    if (!pending.length) return;
    // 先让正走在路上的人走到（与瞬间重演一致），再补完未发生的情节
    safe('flush.settle', () => GS.cast && GS.cast.restore && GS.cast.restore());
    let guard = 500;
    while (pending.length && guard--) run(pending[0], true);
  }
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
  // 每帧的更新与绘制只交给此刻这一幕（离场之后再给几秒，让它收拾自己）——幕再多，也不拖慢一帧
  const GRACE = 8;
  function eachLive(m, dt, ...args) {
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      const cur = s.act && s.act.index === W.act;
      if (cur) s._grace = GRACE;
      else if (!(s._grace > 0)) continue;
      else if (m === 'update') s._grace -= dt || 0;
      if (s[m]) safe('scene.' + (s.act && s.act.id) + '.' + m, () => s[m](...args));
    }
  }
  function eachCur(m, ...args) {
    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      if (!(s.act && s.act.index === W.act) || !s[m]) continue;
      safe('scene.' + s.act.id + '.' + m, () => s[m](...args));
    }
  }

  // 在大地之后、生灵之前画（河流、祭坛、城……）
  GS.scenes = {
    init() { booted = true; each('init'); },
    resize() { each('resize'); },
    update(dt) { tick(); eachLive('update', dt, dt); },
    draw(ctx, pass) { eachCur('drawUnder', ctx, pass); },
    reset() { each('reset'); flush(); },
    restore() { each('restore'); },
    pick(x, y, r) {
      let best = null;
      for (const s of scenes) {
        if (!s.pick || !(s.act && s.act.index === W.act)) continue;
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
      eachCur('draw', ctx, pass);
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
  // 本幕是否正在进行（布景只在自己的幕里画）
  const current = id => ACTS[W.act] && ACTS[W.act].id === id;
  const find = id => ACTS.find(a => a.id === id) || null;
  // 这一幕是否开启一卷新书（前一幕属于别的书）
  const opensBook = a => !!(a && a.index > 0 && ACTS[a.index - 1] && ACTS[a.index - 1].book !== a.book);
  const closesBook = a => !!(a && (a.index === ACTS.length - 1 || (ACTS[a.index + 1] && ACTS[a.index + 1].book !== a.book)));
  // 这一幕是否开启新约（前一幕属于旧约）
  const opensTestament = a => !!(a && a.index > 0 && ACTS[a.index - 1] && (ACTS[a.index - 1].testament || 0) !== (a.testament || 0));

  // 每一卷开始时，这些"卷内"的程度先回到默认，再由该卷的 setup 自行设定（前一卷的枯黄、花隐等不会误带过来）
  const ACT_DEFAULTS = { bare: 0, bloom: 1, rain: 0, storm: 0, gale: 0, hail: 0, gloom: 0 };
  function resetActLevels() { for (const k in ACT_DEFAULTS) if (W.hasLevel(k)) W.set(k, ACT_DEFAULTS[k], true); W.beastAvoid = []; W.weatherExclude = []; }

  GS.book = { ACTS, BOOKS, GROUPS, TESTAMENTS, testamentOf, opensTestament, act, actOf, find, opensBook, closesBook, bookOrdinal, cn, timeline, flush, busy, after, cancel, reset, resync, current, resetActLevels, ACT_DEFAULTS, CN_NUM, scenes };
})(window.GS);
