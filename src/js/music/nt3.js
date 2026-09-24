/* ─────────────────────────────────────────────────────────────
 * music/nt3.js —— 新约各卷的乐曲（第三批）：启示录——宝座 · 羔羊 · 新天新地（整部圣经的末一卷）
 *
 * 写法见 js/music/ot1.js 的开头（GS.audio.music(id, spec)；全在 A 上——整部圣经是一首连续的曲子；
 * 响度照那里的规矩：每组增益之和约 1.0–1.4，根音 0.35–0.5，越高越轻）。做法同 js/music/nt2.js：
 *   乐色跟着正在讲的经文走——here(id) 读此刻显示的那一行经文（GS.bus 的 'scripture'，只认启示录自己的；
 *   引来的以赛亚书、以西结书、但以理书……不改变光景），退而求其次是这一句话自己的 ref，得到「章 : 节」；
 *   每一幕把章节映到乐垫的一组（光景）。配不上的一句沿用本幕上一句的光景。调式与乐句都跟着乐垫此刻最重的一组走；
 *   一句之内只奏一次的时刻用 cue（号声、七灯、虹、圣哉、羔羊、新歌、龙被摔下、琴声断绝、哈利路亚、珍珠门、
 *   生命树、「来！」、末了的「阿们」），cue 之后主乐句让开几秒；质地的疏密用 due。以 '_' 起头的键不是乐垫的组，
 *   而是光景的修饰：_hush（天上寂静约有二刻）、_silent（琴声不再听见）、_bright（骑白马的）。
 *
 * 宝座（1 — 5）：拔摩海岛（挂留，海浪般缓慢的起伏，苇笛）→ 号筒般的大声音、七个金灯台、人子的光（利底亚）
 *   → 七教会的书信（混合利底亚，灯下；每一封信末了「凡有耳的，就应当听」是同一句笛；「看哪，我站在门外叩门」——
 *   门开了，一个在低通里打开的暖和弦）→ 天上的门开了、宝座、虹（利底亚上去又下来的一道弧）、玻璃海、四活物
 *   「圣哉！圣哉！圣哉！」（伊奥尼亚，无字的合唱，风琴般的偶次泛音）→ 七印封严的书卷，没有配展开的，约翰大哭
 *   （爱奥利亚，叹息的笛）→ 羔羊（圣子的主题：前半是小调——「像是被杀过的」，后半回到大调——得胜）
 *   → 新歌、千千万万的天使、一切被造之物（合唱与众琴，从高处的玻璃到低处的弓弦；末了「阿们」）。
 * 羔羊（6 — 20）：七印（弗里几亚的低处，马蹄般的脉动；四匹马是四阵颜色不同的风）→ 穿白衣的大群人
 *   （利底亚的合唱；「神也必擦去他们一切的眼泪」：两滴眼泪，然后平安）→ 天上寂静约有二刻（乐声几乎全停）
 *   → 七号（混合利底亚：一支比一支高的号）→ 第七号「世上的国成了我主和主基督的国」（哈利路亚）
 *   → 身披日头的妇人、十二星的冠冕（利底亚的星光）与烟一般的大龙（弗里几亚的低音与三全音的阴影），
 *   米迦勒争战，龙被摔下去（低音一路坠落，光回来）→ 「在主里而死的人有福了……息了自己的劳苦」（慢慢的摇篮曲）
 *   → 巴比伦大城倾倒了（爱奥利亚；琴声唱到一半便断了——此后乐句全停）→ 「哈利路亚！」羔羊的婚筵
 *   （伊奥尼亚的大合唱，手鼓与琴的舞）→ 骑白马的「诚信真实」（号角与上行的琴）→ 白色的大宝座、案卷展开
 *   （挂留的庄严，低处的钟）→ 死亡和阴间被扔在火湖里（低音退去，高处一个空五度）。
 * 新天新地（21 — 22，全书的末一幕）：海也不再有了、圣城从天而降（利底亚：一长串从最高处降下的光）
 *   → 神的帐幕在人间，不再有眼泪（圣子的主题、平安的 A6/9 合唱）→ 「看哪，我将一切都更新了」（伊奥尼亚：
 *   创世记「好」的三声铃，三个八度的琴一口气升上去，造物主的 A 回来；「我是阿拉法，我是俄梅戛」——最低的 A 与最高的 A）
 *   → 圣城（碧玉、精金、十二个珍珠的门：十二声珍珠般的铃；羔羊为城的灯）→ 生命水的河、生命树
 *   （伊甸回来了：伊甸的 A 加九与伊甸的里拉，十二样果子）→ 「是了，我必快来！」「阿们！主耶稣啊，我愿你来！」
 *   （大调的合唱，笛的呼唤与应答；末一句「愿主耶稣的恩惠常与众圣徒同在」：圣子的主题升上八度，变格的「阿们」）。
 *   spec.coda：末一句之后乐声一直留着，直到「新约 · 终」写在天上；audio 在第一个终章之后约十三秒让它退去，
 *   第二个终章「圣经 · 六十六卷 · 终」是变格的「阿们」（IV → I 与创世记「好」的三声铃），由它收尾，归于安息。
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  if (!GS || !GS.audio || !GS.audio.music) return;
  const music = GS.audio.music, W = GS.W;
  const cl = x => (x > 1 ? 1 : x > 0 ? x : 0);
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const max = Math.max, min = Math.min;
  // 按优先次序分配：前面的组先取（分量 × 余下的），最后剩下的归底组；和恒为 1；all：本卷所有的组（未分到的记 0）
  function stack(order, base, all) {
    const g = {};
    if (all) for (const k of all) g[k] = 0;
    let rem = 1;
    for (const [k, w] of order) { const x = cl(w) * rem; g[k] = (g[k] || 0) + x; rem -= x; }
    g[base] = (g[base] || 0) + rem;
    return g;
  }
  // 此刻最重的一组
  function top(g) { let k = '', v = -1; for (const n in g) if (g[n] > v) { v = g[n]; k = n; } return k; }
  // 光景 → stack 的次序（'_' 起头的是修饰，不是组）；post 在后（天气只取经文余下的）
  const ord = (s, post) => Object.keys(s).filter(k => k[0] !== '_').map(k => [k, s[k]]).concat(post || []);

  // ── 此刻讲到哪里 ─────────────────────────────────────────
  // 经文出处：「启示录 21:5」「21:5」「21:3–4」→ { bk, ch, v }
  function refOf(x) {
    if (typeof x !== 'string') return null;
    const m = /^\s*([^\d:：\s]*)\s*(\d+)\s*[:：]\s*(\d+)/.exec(x);
    return m ? { bk: m[1], ch: +m[2], v: +m[3] } : null;
  }
  // 这一出处是否属于本卷自己的书（启示录常引旧约——那不是本卷的章节，不拿来查光景）
  function inAct(A, bk) {
    if (!bk || !A || !A.books) return true;
    const BK = GS.book && GS.book.BOOKS;
    if (!BK) return true;
    for (const n of A.books) { const b = BK[n - 1], nm = b && b.name; if (nm && (nm === bk || nm.indexOf(bk) >= 0 || bk.indexOf(nm) >= 0)) return true; }
    return false;
  }
  let LINE = null;
  if (GS.bus && GS.bus.on) {
    GS.bus.on('scripture', line => {
      const r = line && refOf(line.ref), A = GS.book && GS.book.ACTS ? GS.book.ACTS[W.act | 0] : null;
      if (r && W && inAct(A, r.bk)) LINE = { r, st: W.stage | 0, act: W.act | 0, at: W.t || 0 };
    });
  }
  // here(id)：n 本卷已说出几句（0 = 第一句之前）· N 共几句 · end 已说完 · ch 章 · v 节
  //           · t 这一句说出之后几秒 · tv 这一行经文显示之后几秒 · st 全书的句序
  const HERE = {}, CUED = {};
  function here(id) {
    const B = GS.book, A = B && B.find ? B.find(id) : null, st = W ? W.stage | 0 : 0, now = (W && W.t) || 0, k = (W && W.fast) || 1;
    let h = HERE[id];
    if (!h || h.st !== st || h.A !== A) {
      h = HERE[id] = { A, st, t0: now, n: 0, N: 1, end: false, sref: null, ch: 0, v: 0, t: 0, tv: 0 };
      for (const c in CUED) if (c.indexOf(st + ':') === 0) delete CUED[c];     // 重讲这一句时，一次性的时刻可以再奏
      if (A) {
        const S = GS.story && GS.story.STAGES;
        h.N = max(1, A.last - A.first + 1);
        h.n = max(0, min(h.N, st - A.first));
        h.end = h.n >= h.N;
        const s = h.n > 0 && S ? S[A.first + h.n - 1] : null;
        if (s) {
          const rs = [s.ref].concat(Array.isArray(s.verse) ? s.verse.map(x => x && x.ref) : s.verse && s.verse.ref ? [s.verse.ref] : []);
          for (const x of rs) { const r = refOf(x); if (r && inAct(A, r.bk)) { h.sref = r; break; } }
        }
      }
    }
    const L = LINE && A && LINE.st === st && LINE.act === A.index ? LINE : null;
    const r = L ? L.r : h.sref;
    h.ch = r ? r.ch : 0;
    h.v = r ? r.v : 0;
    h.t = (now - h.t0) * k;
    h.tv = L ? (now - L.at) * k : h.t;
    return h;
  }
  // 一句之内只奏一次
  function cue(h, tag) { const c = h.st + ':' + tag; if (CUED[c]) return false; CUED[c] = 1; return true; }
  // 质地的疏密：距上一次至少 lo … hi 秒（世界时间）
  const DUE = {};
  function due(key, lo, hi) {
    const now = (W && W.t) || 0, k = (W && W.fast) || 1;
    if (now < (DUE[key] || 0) && now > (DUE[key] || 0) - 60) return false;
    DUE[key] = now + (lo + Math.random() * (hi - lo)) / k;
    return true;
  }
  // cue 之后，主乐句让开几秒
  const QUIET = {};
  const hushFor = (id, sec) => { QUIET[id] = ((W && W.t) || 0) + sec / ((W && W.fast) || 1); };
  const quiet = id => { const now = (W && W.t) || 0, q = QUIET[id] || 0; return now < q && now > q - 60; };
  const POLL = [0.6, 1.0];            // 次要的一层每秒左右查看一次
  // 光景：配得上的经文给出它的光景；配不上的一句沿用本幕上一句的（往回重讲时不沿用）
  const MEM = {};
  function sceneOf(id, h, fn) {
    const s = h.ch ? fn(h) : null;
    if (h.n === 0) { MEM[id] = null; return s || {}; }
    if (s) { MEM[id] = { st: h.st, s }; return s; }
    const m = MEM[id];
    return m && m.st < h.st ? m.s : {};
  }
  function stateOf(id, fn, post, base, names) {
    const h = here(id), s = sceneOf(id, h, fn);
    return { h, s, g: stack(ord(s, post), base, names) };
  }

  // ── 共用的乐器与乐句（都在乐声总线上、可舍的优先级）────────────
  // 应答的诗篇：I · IV · I，左右两班
  function psalm(a, g, minor) {
    const I = ['A3', minor ? 'C4' : 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', minor ? 'F4' : 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.9, a: 0.8, s: 0.7, r: 1.6, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.8, s: 0.6, r: 1.6, at: 2.2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.9, a: 0.9, s: 1.1, r: 2.8, at: 4.4, pan: 0 });
  }
  // 圣哉三呼（左、右、合）
  function holy(a, g) {
    [[0, -0.45], [1.7, 0.45], [3.4, 0]].forEach(([at, pn], i) => a.choir(i < 2 ? ['A3', 'E4', 'A4', 'Cs5'] : ['A3', 'E4', 'A4', 'Cs5', 'E5'],
      { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * (i < 2 ? 0.9 : 1.05), a: 0.5, s: i < 2 ? 0.5 : 1.3, r: i < 2 ? 1.4 : 3, at, pan: pn }));
  }
  // 阿们：IV → I
  function amen(a, g, at0) {
    a.choir(['A3', 'D4', 'Fs4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.75, a: 0.9, s: 0.8, r: 1.6, at: at0 || 0, pan: -0.2 });
    a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.8, a: 1, s: 1.4, r: 3, at: (at0 || 0) + 2.3, pan: 0.15 });
  }
  // 平安：A6/9 的合唱慢慢涨起来
  function shalom(a, g, at0) {
    a.choir(['A3', 'E4', 'Fs4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.6, 0.5, 0.35], g: g * 0.85, a: 1.8, s: 1.8, r: 3.6, at: at0 || 0, pan: 0 });
  }
  // 圣子的主题（神造人那一日人的主题：A4 C#5 E5 F#5 E5 C#5 A4——道成了肉身，神就唱人的歌）
  //   kind：'maj' · 'slain'（前半小调：像是被杀过的；后半回到大调：得胜）· 'up'（升上八度）；wave：'flute' | 'harp' | 'glass'
  const TH = { maj: ['A4', 'Cs5', 'E5', 'Fs5', 'E5', 'Cs5', 'A4'], slain: ['A4', 'C5', 'E5', 'F5', 'E5', 'Cs5', 'A4'], up: ['A4', 'Cs5', 'E5', 'Fs5', 'E5', 'Cs5', 'E5', 'A5'] };
  function theme(a, g, p, o) {
    o = o || {};
    const ns = TH[o.kind || 'maj'], L = ns.length, beat = o.beat || 0.5, at0 = o.at || 0;
    const dur = i => (i === L - 1 ? 3.2 : i === 3 ? 1.3 : 1) * beat;
    if ((o.wave || 'flute') === 'flute') {
      a.pipe(ns.map((n, i) => [n, dur(i), i === 3 ? 1.08 : 1]), { g: g * (o.k || 0.5), pan: p, bright: 4, breath: 0.2, vib: 9, rev: 0.7, at: at0 });
      return;
    }
    let tt = 0;
    const st = ns.map((n, i) => { const x = [n, tt, g * (i === 3 ? 0.8 : 0.66), 2.6]; tt += dur(i); return x; });
    a.strings(st, { wave: o.wave === 'glass' ? 's' : 'harp', bright: o.wave === 'glass' ? 2 : 5, d: 2.6, pan: p, spread: 0.2, rev: 0.78, at: at0 });
  }
  // 号筒般的大声音（启 1:10、4:1）：两支号，八度与五度——短 · 短 · 长
  function trumpetVoice(a, g, p, o) {
    o = o || {};
    const at0 = o.at || 0, lp = o.lp || 2400;
    [[0, 0.16], [0.26, 0.16], [0.54, o.long || 1.4]].forEach(([at, d], i) => {
      const last = i === 2;
      a.note({ f: last ? 'E5' : 'A4', type: 'warm', lp, g: g * (last ? 0.6 : 0.48), a: 0.03, s: d, r: last ? 1.2 : 0.3, at: at0 + at, vib: last ? [5.2, 0.003] : null, pan: p - 0.15, rev: 0.75 });
      a.note({ f: last ? 'A4' : 'E4', type: 'warm', lp: lp * 0.8, g: g * (last ? 0.4 : 0.32), a: 0.035, s: d, r: last ? 1.2 : 0.3, at: at0 + at + 0.012, pan: p + 0.15, rev: 0.75 });
    });
  }
  // 我是阿拉法，我是俄梅戛：最低的 A 与最高的 A 一同响起，其间的 A 一个个亮起来
  function alphaOmega(a, g, at0) {
    const o = at0 || 0;
    a.note({ f: 'A1', type: 's', g: g * 0.5, a: 1.6, s: 2.4, r: 3.6, at: o, pan: 0, rev: 0.4 });
    a.note({ f: 'A2', type: 'warm', lp: 700, g: g * 0.5, a: 1.4, s: 2.6, r: 3.6, at: o, pan: -0.15, rev: 0.7 });
    a.note({ f: 'A5', type: 's', g: g * 0.3, a: 1.4, s: 2.6, r: 3.6, at: o, pan: 0.2, rev: 0.85, vib: [4.4, 0.0015] });
    a.strings(['A3', 'A4', 'E5', 'A5', 'A6'].map((n, i) => [n, 1.8 + i * 0.22, g * (0.55 - i * 0.06), 3.4]), { wave: 's', bright: 2, d: 3.4, spread: 0.35, rev: 0.82, at: o });
  }
  // 一道升起的琴（光、荣耀、更新）
  function rising(a, g, sc, base, n, at0, step) {
    const ns = [];
    for (let i = 0; i < (n || 7); i++) ns.push([a.deg(sc || 'maj', base || 'A3', i), 0.1 + i * (step || 0.16), g * (0.8 - i * min(0.04, 0.5 / (n || 7))), 3]);
    a.strings(ns, { wave: 'harp', bright: 5, d: 3, rev: 0.65, spread: 0.3, at: at0 || 0 });
  }
  // 远方的光点一个个聚来：左右交替，声像越来越靠中间
  function gathering(a, g, sc) {
    const n = a.rint(5, 7);
    for (let k = 0; k < n; k++) {
      const side = k % 2 ? 1 : -1, pan = side * (0.9 - k * (0.8 / n));
      a.ping(a.deg(sc || 'maj', 'A5', a.rint(0, 6)), k * a.rnd(0.35, 0.55), g * (0.35 + 0.08 * k), pan);
    }
  }
  // 眼泪：两三滴很慢的下行的玻璃
  function drops(a, g, sc) {
    const i0 = a.rint(7, 9), n = a.rint(2, 3), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'aeol', 'A4', i0 - k), k * a.rnd(0.7, 1.1), g * (0.85 - k * 0.12), 2.4]);
    a.strings(ns, { wave: 's', bright: 2, d: 2.4, pan: a.pan(), spread: 0.25, rev: 0.85 });
  }
  // 一串下行的玻璃般的拨弦（水）
  function flowing(a, g, sc, base) {
    const i0 = a.rint(8, 10), n = a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', base || 'A4', i0 - k), k * 0.12, g * (1 - k * 0.07), 1.8]);
    a.strings(ns, { wave: 's', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 叹息：一口气的下行（约翰大哭；「哀哉！哀哉！这大城」）
  const SIGHS = [
    [['E4', 1.1], ['D4', 0.6], ['C4', 1.3], ['B3', 0.7], ['A3', 2.2]],
    [['C4', 0.9], ['B3', 0.5], ['A3', 1.2], ['G3', 0.6], ['A3', 2]],
    [['F4', 1], ['E4', 0.7], ['D4', 0.6], ['C4', 1.1], ['B3', 0.6], ['A3', 2.2]],
  ];
  const sigh = (a, g, p) => a.pipe(a.pick(SIGHS), { g: g * 0.5, pan: p, bend: true, bright: 3, breath: 0.4, vib: 15, vibHz: 5, rev: 0.72 });
  // 钟：非谐的分音
  function toll(a, f, g, p) {
    const F0 = a.hz(f);
    [[1, 1, 7], [2.76, 0.4, 4.2], [5.4, 0.18, 2.4], [8.93, 0.07, 1.4]].forEach(([k, gg, d]) => a.note({ f: F0 * k, g: g * gg, a: 0.006, d, pan: p, rev: 0.75 }));
  }
  // 竖琴的一扫（书卷展开）
  function sweep(a, notes, g, p, at0) {
    a.strings(notes.map((n, i) => [n, i * 0.075, g * 0.7 * (1 - i * 0.035), 2.6]), { wave: 'harp', bright: 5, d: 2.6, pan: p, spread: 0.3, rev: 0.6, at: at0 || 0 });
  }
  // 创世记的「好」：正弦铃 A5 C#6 E6
  const good = (a, g, at0) => a.bells(['A5', 'Cs6', 'E6'], 0.18, g * 0.8, 3, at0 || 0);
  // 一句宁静的里拉
  const soft = (a, g, p, sc, base) => a.lyre(base || a.pick(['A3', 'A4']), a.rint(3, 4), g * 0.65, p, sc, { gap: 0.4 });
  // 一盏小灯的火苗：一声暖的拨弦
  const flame = (a, g) => a.pluck(a.pick(['A4', 'Cs5', 'E5', 'A5']), 0, g * 0.35, a.pan(), 1.4);
  // 一串珍珠般的铃（一个声部里排好）：ns = [音名, ...]，每声相隔 gap 秒
  function pearlBells(a, g, ns, gap, at0) {
    a.strings(ns.map((n, i) => [n, i * gap, g, 3]), { wave: 's', bright: 1.5, d: 3, spread: 0.45, rev: 0.8, at: at0 || 0 });
    a.strings(ns.map((n, i) => [a.hz(n) * 2.76, i * gap, g * 0.07, 0.5]), { wave: 's', bright: 1.5, d: 0.5, spread: 0.45, rev: 0.5, at: at0 || 0 });
  }

  // ══ 启示录 · 宝座（1 — 5）══════════════════════════════════
  const TR_SC = { patmos: 'sus', light: 'lyd', letters: 'mixo', heaven: 'ion', sealed: 'aeol', lamb: 'maj', song: 'maj' };
  const TR_N = Object.keys(TR_SC);
  function trScene(h) {
    const c = h.ch, v = h.v;
    if (c === 1) return v <= 6 || (v >= 9 && v <= 11) ? { patmos: 1 } : { light: 1 };   // 1:7–8 驾云降临、阿拉法；1:12 起七灯台与人子
    if (c === 2 || c === 3) return { letters: 1 };
    if (c === 4) return { heaven: 1 };
    if (c === 5) return v <= 4 ? { sealed: 1 } : v <= 8 ? { lamb: 1 } : { song: 1 };
    return null;
  }
  const TR = lv => stateOf('throne', trScene, [['sealed', 0.6 * sm(0.4, 0.9, lv('gloom'))]], 'patmos', TR_N);
  let heavenTurn = 0;
  music('throne', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      patmos: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.15, 0.3], ['D4', 'soft', 0.1, -0.3], ['E4', 's', 0.06, 0.4]], pulse: [0.1, 0.22] },
      light: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.26, 0.15], ['A3', 'over', 0.07, 0], ['Cs4', 'soft', 0.14, -0.3], ['Gs4', 's', 0.07, 0.35],
        ['B4', 's', 0.045, -0.4], ['Ds5', 's', 0.028, 0.45], ['E5', 's', 0.022, -0.5]],
      letters: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['G3', 'soft', 0.11, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 'flute', 0.07, 0.35], ['B4', 's', 0.03, -0.4]],
      heaven: [['A1', 's', 0.26, 0], ['A2', 's', 0.24, 0], ['E3', 'soft', 0.2, -0.15], ['A2', 'over', 0.06, 0], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.12, 0],
        ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.08, 0], ['E5', 's', 0.03, 0.45]],
      sealed: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['C3', 'soft', 0.24, -0.3], ['E3', 'soft', 0.13, 0.25], ['F3', 's', 0.07, 0.35]],
      lamb: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['Fs4', 'flute', 0.07, -0.35], ['A4', 's', 0.05, 0.4], ['E5', 's', 0.025, -0.45]],
      song: [['A1', 's', 0.2, 0], ['A2', 's', 0.24, 0], ['E3', 's', 0.18, -0.15], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.12, 0], ['E4', 'choir', 0.12, 0],
        ['A4', 'choir', 0.09, 0], ['Cs5', 's', 0.04, 0.45], ['E5', 's', 0.025, -0.5]],
    } },
    mix(lv) {
      const { g } = TR(lv);
      const lp = 1400 * (1 + 0.9 * g.light + 0.25 * g.letters + 1.0 * g.heaven + 0.45 * g.lamb + 1.1 * g.song) * (1 - 0.3 * g.sealed) * (1 - 0.1 * g.patmos);
      return { g, lp, drone: 1 + 0.2 * g.sealed - 0.15 * g.song, dlp: 1 - 0.2 * g.sealed + 0.15 * g.heaven };
    },
    scale(lv) { return TR_SC[top(TR(lv).g)] || 'maj'; },
    motif(t, g, a) {
      const { g: G } = TR(a.lv), k = top(G), p = a.pan();
      if (quiet('throne')) return [3, 5];
      switch (k) {
        case 'patmos':                                                             // 拔摩海岛：苇笛，或一道浪般的低琴
          if (Math.random() < 0.6) a.ney(g * 0.9, p);
          else a.strings(['A2', 'E3', 'B3', 'D4', 'E4', 'D4', 'B3', 'E3'].map((n, i) => [n, i * 0.2, g * (0.35 + 0.25 * Math.sin(Math.PI * i / 7)), 2.6]),
            { wave: 'harp', bright: 3, d: 2.6, pan: p, spread: 0.25, rev: 0.7 });
          return [14, 20];
        case 'light': a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'lyd', { gap: 0.26 }); return [11, 15];
        case 'letters':                                                            // 「凡有耳的，就应当听」——每一封信都是同一句笛
          if (Math.random() < 0.5) a.pipe([['E4', 0.35], ['A4', 0.35], ['B4', 0.5], ['G4', 0.4], ['A4', 1.4]], { g: g * 0.5, pan: p, bright: 4, breath: 0.25, vib: 9, rev: 0.65 });
          else soft(a, g, p, 'mixo');
          return [12, 17];
        case 'heaven': {
          const turn = heavenTurn++ % 3;
          if (turn === 0) holy(a, g * 0.9);
          else if (turn === 1) ['A3', 'E4', 'A4', 'Cs5'].forEach((n, i) => a.choir([n], { g: g * 0.5, a: 0.9, s: 3.6 - i * 0.7, r: 2.6, at: i * 0.75, pan: [-0.6, 0.6, -0.3, 0.3][i] }));  // 四活物
          else a.lyre('A4', a.rint(5, 6), g * 0.7, p, 'ion', { gap: 0.24 });   // 二十四位长老的琴
          return [10, 14];
        }
        case 'sealed': sigh(a, g, p); return [12, 18];                                               // 约翰大哭
        case 'lamb': theme(a, g, p, { kind: 'slain', beat: 0.55 }); return [13, 17];
        default:                                                                                    // 新歌
          if (Math.random() < 0.5) psalm(a, g);
          else { a.lyre('A3', a.rint(5, 7), g * 0.7, -0.35, 'maj', { gap: 0.22 }); a.lyre('A4', a.rint(4, 6), g * 0.6, 0.35, 'maj', { gap: 0.3 }); }
          return [9, 13];
      }
    },
    motif2(t, g, a) {
      const { h, g: G } = TR(a.lv), c = h.ch, v = h.v, tv = h.tv, id = 'throne';
      const fire = (tag, sec, fn, hold) => { if (tv >= sec && cue(h, tag)) { fn(); hushFor(id, hold || 7); } };
      if (c === 1 && v >= 7 && v <= 8) fire('alpha', 1, () => alphaOmega(a, g));                     // 我是阿拉法，我是俄梅戛
      if (c === 1 && v >= 10 && v <= 11) fire('voice', 0.8, () => trumpetVoice(a, g, 0.25));          // 大声音如吹号
      if (c === 1 && v >= 12 && v <= 16) fire('lamps', 1.2, () => {                                  // 七个金灯台
        a.strings(['A4', 'Cs5', 'E5', 'Fs5', 'A5', 'Cs6', 'E6'].map((n, i) => [n, i * 0.42, g * 0.42, 2.4]), { wave: 't', bright: 3, d: 2.4, spread: 0.55, rev: 0.75 });
      });
      if (c === 1 && v >= 17) fire('fear', 1, () => {                                               // 「不要惧怕！我是首先的，我是末后的」
        a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 'soft', g: g * 0.3, a: 1.6, s: 1.8, r: 3.4, lp: 400, lp2: 2200, lpT: 3, spread: 0.35, rev: 0.7 });
        a.note({ f: 'Cs5', g: g * 0.3, a: 0.004, d: 3, at: 1.8, pan: 0.2, rev: 0.85 });
      });
      if (c === 3 && v === 20) fire('door', 2.6, () => {                                             // 叩门之后：门开了，灯在里面，一同坐席
        a.chord(['A3', 'Cs4', 'E4', 'Fs4', 'A4'], { type: 'soft', g: g * 0.28, a: 0.9, s: 1.4, r: 2.8, lp: 260, lp2: 3200, lpT: 2.2, spread: 0.35, rev: 0.7 });
        a.pipe([['E5', 0.5], ['Cs5', 0.5], ['B4', 0.45], ['A4', 1.4]], { g: g * 0.42, pan: 0.2, bright: 4, breath: 0.2, vib: 8, rev: 0.7, at: 1.6 });
      });
      if (c === 4 && v <= 1) fire('open', 0.8, () => { trumpetVoice(a, g * 0.9, 0); rising(a, g * 0.7, 'ion', 'A3', 8, 2); });   // 天上有门开了：「你上到这里来」
      if (c === 4 && v >= 2 && v <= 3) fire('bow', 1.2, () => {                                      // 宝座，虹如同绿宝石
        const ns = [];
        for (let i = 0; i < 7; i++) ns.push([a.deg('lyd', 'A4', i), i * 0.13, g * (0.42 + 0.05 * i), 2.8]);
        for (let i = 1; i < 7; i++) ns.push([a.deg('lyd', 'A4', 6 - i), (6 + i) * 0.13, g * (0.72 - 0.06 * i), 2.8]);
        a.strings(ns, { wave: 'harp', bright: 5, d: 2.8, spread: 0.6, rev: 0.78 });
      });
      if (c === 4 && v >= 8 && v <= 9) fire('holy', 0.8, () => holy(a, g * 1.1), 8);                // 圣哉！圣哉！圣哉！
      if (c === 4 && v >= 10) fire('worthy', 1.2, () => psalm(a, g), 8);                             // 你是配得荣耀、尊贵、权柄的
      if (c === 5 && v >= 5 && v <= 8) fire('lamb', 1.5, () => theme(a, g * 1.1, 0, { kind: 'slain', beat: 0.58 }), 9);   // 羔羊，像是被杀过的
      if (c === 5 && v >= 9 && v <= 13) fire('song', 1, () => { psalm(a, g); rising(a, g * 0.75, 'maj', 'A3', 8, 2.2); }, 9);   // 新歌
      if (c === 5 && v >= 14) fire('amen', 1, () => amen(a, g), 7);                                  // 四活物就说：「阿们！」
      // 质地
      if (G.light > 0.5 && due('tr.lamp', 2.5, 4.5)) a.ping(a.pick(['A5', 'Cs6', 'E6', 'Gs5']), 0, g * 0.38, a.pan());   // 金灯台的光
      if (G.heaven > 0.5 && due('tr.glass', 3, 5)) a.glass(g * 0.45, 1);                                                     // 玻璃海
      if (G.patmos > 0.5 && a.night() > 0.5 && due('tr.star', 2, 4)) a.starPing(g * 0.7);
      if (G.letters > 0.5 && due('tr.flame', 5, 8)) flame(a, g);                                                              // 灯台的火苗
      if (G.song > 0.5 && due('tr.every', 9, 14)) { gathering(a, g * 0.8, 'maj'); if (Math.random() < 0.5) a.bowed('A2', g * 0.4, -0.3); }  // 一切被造之物
      return POLL;
    },
  });

  // ══ 启示录 · 羔羊（6 — 20）══════════════════════════════════
  const LB_SC = { seals: 'phryg', robes: 'lyd', trumpet: 'mixo', dragon: 'phryg', woman: 'lyd', babylon: 'aeol', alleluia: 'ion', white: 'sus' };
  const LB_N = Object.keys(LB_SC);
  function lbScene(h) {
    const c = h.ch, v = h.v, tv = h.tv;
    switch (c) {
      case 6: return v >= 9 && v <= 11 ? { robes: 0.7, seals: 1 } : { seals: 1 };               // 祭坛底下的灵魂：「还要安息片时」
      case 7: return v <= 3 ? { robes: 0.5, _hush: 0.4 } : v <= 8 ? { robes: 0.7 } : { robes: 1 };   // 执掌四方的风；受印的；穿白衣的大群人
      case 8: return v <= 1 ? { white: 1, _hush: 1 } : v <= 5 ? { robes: 0.6, _hush: 0.45 } : { trumpet: 1 };   // 天上寂静约有二刻；香与祈祷；七号
      case 9: return { seals: 1 };
      case 10: return { trumpet: 1 };
      case 11: return v >= 15 ? { alleluia: 1 } : { trumpet: 1 };                              // 第七号：世上的国成了我主和主基督的国
      case 12:
        if (v <= 2 || v === 5 || v === 6 || (v >= 10 && v <= 12)) return { woman: 1 };         // 身披日头的妇人；男孩子被提到神宝座那里；「救恩……现在都来到了」
        if (v <= 4) return { dragon: 1 };
        if (v <= 9) return { woman: v === 9 ? sm(3, 11, tv) : 0, dragon: 1 };                   // 米迦勒争战；大龙被摔下去
        return { woman: 0.5, dragon: 1 };
      case 13: return { dragon: 1 };
      case 14:
        if (v <= 5) return { robes: 1 };                                                        // 羔羊站在锡安山，弹琴的所弹的琴声，新歌
        if (v <= 7) return { trumpet: 1 };
        if (v === 8) return { babylon: 1 };
        if (v === 13) return { robes: 1 };                                                      // 在主里而死的人有福了
        return { seals: 1 };
      case 15: return v <= 4 ? { robes: 1 } : { white: 1 };                                    // 摩西的歌和羔羊的歌；殿中充满了烟
      case 16: return v === 17 ? { white: 1 } : { seals: 1 };                                   // 「成了！」
      case 17: return v === 14 ? { alleluia: 0.7, babylon: 1 } : { babylon: 1 };               // 羔羊必胜过他们
      case 18:
        if (v <= 1) return { woman: 0.5, babylon: 1 };                                          // 地就因他的荣耀发光
        if (v === 20) return { alleluia: 0.4, babylon: 1 };
        return v >= 21 ? { babylon: 1, _silent: 1 } : { babylon: 1 };                           // 大磨石扔在海里；琴声……决不能再听见
      case 19: return v <= 10 ? { alleluia: 1 } : v <= 16 ? { trumpet: 1, _bright: 1 } : { trumpet: 0.6, dragon: 1 };   // 哈利路亚；骑白马的；兽被擒拿
      case 20:
        if (v <= 3) return { dragon: 1 - sm(3, 12, tv), white: 1 };                              // 那龙被捆绑一千年
        if (v <= 6) return { robes: 1 };
        if (v <= 10) return { dragon: v === 10 ? 1 - sm(3, 12, tv) : 1, white: 1 };
        return { white: 1 };                                                                    // 白色的大宝座；案卷展开；死亡和阴间
      default: return c >= 21 ? { white: 1 } : null;
    }
  }
  const LB = lv => stateOf('lamb', lbScene, [['seals', 0.6 * sm(0.3, 0.8, max(lv('storm'), lv('gale')))], ['dragon', 0.5 * sm(0.4, 0.9, lv('gloom'))]], 'white', LB_N);
  // 四匹马：四阵颜色不同的风横过天空（白 · 红 · 黑 · 灰），底下一声低沉的角
  const HORSE = [[1900, 'A3'], [1000, 'A2'], [520, 'A2'], [1300, 'E3']];
  function horseman(a, g, p, k) {
    const [f, n] = HORSE[((k | 0) % 4 + 4) % 4];
    a.burst({ buf: 'pink', f: f * 0.5, f2: f, sweep: 1.6, q: 1.1, g: g * 1.2, a: 1.0, s: 0.5, r: 1.8, pan: -p, pan2: p, rev: 0.5 });
    a.note({ f: n, type: 'warm', lp: 900, path: [[a.semi(n, 1), 0.5], [a.hz(n), 0.6]], g: g * 0.55, a: 0.3, s: 1.2, r: 1.8, at: 0.5, pan: p * 0.5, rev: 0.7 });
  }
  // 天使吹号（第 k 号）：远处一支号，一声比一声高
  function trumpetCall(a, g, p, k) {
    const base = ['A3', 'B3', 'Cs4', 'D4', 'E4', 'Fs4', 'A4'][min(6, max(0, k | 0))];
    a.note({ f: base, type: 'warm', lp: 1600, g: g * 0.55, a: 0.08, s: 0.25, r: 0.6, pan: p, rev: 0.8 });
    a.note({ f: a.semi(base, 7), type: 'warm', lp: 2000, g: g * 0.6, a: 0.1, s: 1.1, r: 1.8, at: 0.45, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 大龙：烟与红黑的光——低处弓弦的弗里几亚，一口烟似的低风
  function smoke(a, g, p) {
    a.bowed(a.pick(['A2', 'Bb2', 'E2']), g * 0.8, p);
    a.burst({ buf: 'brown', ft: 'lowpass', f: 260, f2: 140, sweep: 3, q: 0.7, g: g * 1.6, a: 1.6, s: 0.8, r: 2.4, pan: p, rev: 0.5 });
  }
  // 哈利路亚！（四个音节：I · I · IV · I）
  function alleluia(a, g, p) {
    const I = ['A3', 'E4', 'A4', 'Cs5'], IV = ['A3', 'D4', 'Fs4', 'A4'], G = [1, 0.85, 0.7, 0.5];
    [[0, I, 0.22, 0.25], [0.5, I, 0.22, 0.25], [1.0, IV, 0.6, 0.5], [2.1, I, 1.6, 2.6]].forEach(([at, ch, s, r], i) =>
      a.choir(ch, { gs: G, g: g * (i === 3 ? 0.95 : 0.8), a: i === 3 ? 0.3 : 0.12, s, r, at, pan: (p || 0) * 0.3 }));
  }
  // 羔羊的婚筵：手鼓与串铃（6/8 的舞步），一串快的琴
  function feast(a, g, p) {
    const beat = a.rnd(0.19, 0.23);
    const P = [[0, 1], [2, 0.5], [3, 0.8], [5, 0.5], [6, 1], [8, 0.5], [9, 0.8], [10, 0.45], [11, 0.5], [12, 1]];
    a.knocks(P.map(([st, acc]) => {
      const heavy = acc >= 0.8;
      return [st * beat + a.rnd(-0.006, 0.006), heavy ? a.rnd(260, 340) : a.rnd(1400, 2000), heavy ? a.rnd(95, 112) : a.rnd(270, 320), g * 0.8 * (heavy ? 1.1 : 0.85) * acc, heavy];
    }), { q: 1.3, lp: 5000, pan: p, rev: 0.4 });
    a.lyre('A4', a.rint(6, 8), g * 0.75, -p, 'ion', { gap: 0.2 });
  }
  let trumpN = 0;
  const LB_GAIN = 1.25;               // 本幕的乐句多在低处、也更稀：每一句略响一点，整幕的响度与别的幕相当
  music('lamb', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1500, groups: {
      seals: { v: [['A1', 's', 0.36, 0], ['E2', 'soft', 0.26, 0.1], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.28, 0.3], ['E3', 'soft', 0.22, -0.2], ['A3', 'soft', 0.1, 0.25],
        ['F3', 's', 0.05, 0.4]], pulse: [0.8, 0.28] },
      robes: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.24, 0.15], ['A3', 'choir', 0.13, 0], ['Cs4', 'choir', 0.1, 0], ['E4', 'choir', 0.1, 0], ['Gs4', 's', 0.05, -0.35],
        ['Ds5', 's', 0.025, 0.45], ['Fs5', 's', 0.02, -0.5]],
      trumpet: [['A1', 's', 0.2, 0], ['A2', 's', 0.24, 0], ['E3', 'warm', 0.2, -0.15], ['A3', 'warm', 0.13, 0.2], ['Cs4', 'soft', 0.16, -0.3], ['E4', 'soft', 0.13, 0.35],
        ['A4', 's', 0.04, -0.2], ['G4', 's', 0.03, -0.4]],
      dragon: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['Bb2', 'soft', 0.18, -0.3], ['E3', 'soft', 0.17, 0.2], ['Ds3', 'soft', 0.1, 0.35], ['A2', 'reed', 0.035, -0.15]], pulse: [0.35, 0.35] },
      woman: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['Ds4', 's', 0.045, 0.35], ['Gs4', 's', 0.05, -0.4], ['E5', 's', 0.025, 0.5]],
      babylon: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.28, 0.1], ['C3', 'soft', 0.26, -0.3], ['E3', 'soft', 0.18, 0.25], ['A3', 'soft', 0.08, -0.2], ['F3', 's', 0.07, 0.35], ['G3', 's', 0.04, -0.4]],
      alleluia: [['A1', 's', 0.22, 0], ['A2', 's', 0.22, 0], ['E3', 's', 0.16, -0.15], ['A2', 'over', 0.06, 0], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.12, 0],
        ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.09, 0], ['Cs5', 's', 0.035, 0.45], ['E5', 's', 0.025, -0.5]],
      white: [['A1', 's', 0.24, 0], ['A2', 's', 0.22, 0], ['E3', 'soft', 0.28, -0.15], ['A2', 'over', 0.07, 0], ['B3', 'soft', 0.16, 0.3], ['D4', 'soft', 0.13, -0.3], ['E4', 's', 0.08, 0.35], ['A4', 's', 0.03, -0.4]],
    } },
    mix(lv) {
      const { g, s } = LB(lv), hush = cl(s._hush || 0), sil = s._silent ? 1 : 0, br = s._bright ? 1 : 0;
      const lp = 1500 * (1 + 0.7 * g.robes + 0.4 * g.trumpet + 0.6 * g.woman + 0.9 * g.alleluia + 0.3 * g.white + 0.5 * br)
        * (1 - 0.2 * g.seals) * (1 - 0.3 * g.dragon) * (1 - 0.2 * g.babylon) * (1 - 0.5 * hush) * (1 - 0.3 * sil);
      return { g, lp, pad: (1 - 0.72 * hush) * (1 - 0.4 * sil), tc: hush > 0.5 || sil ? 4 : 2.2,
        drone: (1 + 0.25 * g.dragon + 0.15 * g.seals - 0.2 * g.alleluia) * (1 - 0.6 * hush), dlp: 1 - 0.25 * g.dragon - 0.15 * g.seals + 0.15 * g.alleluia };
    },
    scale(lv) { const { g, s } = LB(lv); return (s._hush || 0) > 0.5 ? 'sus' : LB_SC[top(g)] || 'sus'; },
    motif(t, g, a) {
      const { h, s, g: G } = LB(a.lv), k = top(G), p = a.pan();
      g *= LB_GAIN;
      if ((s._hush || 0) > 0.5 || s._silent) return [6, 9];                                 // 天上寂静；琴声不再听见
      if (quiet('lamb')) return [3, 5];
      switch (k) {
        case 'seals': if (Math.random() < 0.55) horseman(a, g * 0.8, p, a.rint(0, 3)); else a.bowed(a.pick(['A2', 'Bb2', 'E2']), g * 0.75, p); return [11, 16];
        case 'robes':                                                                         // 大群人：应答的诗篇，或从四方聚来的光
          if (Math.random() < 0.5) psalm(a, g * 0.9);
          else { gathering(a, g * 0.8, 'lyd'); a.choir(['A3', 'E4', 'Gs4', 'Cs5'], { gs: [1, 0.8, 0.6, 0.45], g: g * 0.6, a: 1.2, s: 1.2, r: 2.8, at: 1, pan: 0 }); }
          return [11, 15];
        case 'trumpet': trumpetCall(a, g * 0.85, p, a.rint(0, 6)); return [10, 14];
        case 'dragon': smoke(a, g, p); return [13, 18];
        case 'woman': a.lyre('A5', a.rint(4, 5), g * 0.6, p, 'lyd', { gap: 0.26 }); return [11, 15];
        case 'babylon': if (h.ch >= 18) sigh(a, g * 0.8, p); else a.lyre('A3', a.rint(3, 5), g * 0.7, p, 'aeol', { gap: 0.4 }); return [14, 19];   // 「哀哉！哀哉！这大城」
        case 'alleluia': alleluia(a, g, p); return [10, 13];
        default:                                                                              // 白色的大宝座
          if (Math.random() < 0.5) toll(a, 'A2', g * 0.6, p);
          else a.choir(['A2', 'E3', 'B3', 'E4'], { gs: [1, 0.85, 0.6, 0.45], g: g * 0.6, a: 1.4, s: 1.4, r: 3, pan: p * 0.3 });
          return [13, 18];
      }
    },
    motif2(t, g, a) {
      const { h, s, g: G } = LB(a.lv), c = h.ch, v = h.v, tv = h.tv, id = 'lamb';
      g *= LB_GAIN;
      if (h.n === 0) trumpN = 0;
      const fire = (tag, sec, fn, hold) => { if (tv >= sec && cue(h, tag)) { fn(); hushFor(id, hold || 7); } };
      if (c === 6 && v <= 8) fire('horse', 1.2, () => horseman(a, g, a.pan(), (v - 1) >> 1));                       // 白马 · 红马 · 黑马 · 灰色马
      if (c === 7 && v >= 9 && v <= 12) fire('robes', 1, () => { gathering(a, g, 'lyd'); psalm(a, g); }, 9);         // 大群人拿着棕树枝：救恩归与……
      if (c === 7 && v >= 13) fire('tears', 1.5, () => { drops(a, g, 'aeol'); shalom(a, g, 3); }, 9);               // 神也必擦去他们一切的眼泪
      if ((c === 8 && v >= 6) || c === 9 || (c === 11 && v <= 14)) fire('trump', 0.8, () => trumpetCall(a, g, a.pan(), trumpN++));   // 七号
      if (c === 11 && v >= 15) fire('kingdom', 0.8, () => { trumpetCall(a, g, 0, 6); alleluia(a, g, 0); rising(a, g * 0.7, 'ion', 'A3', 8, 3); }, 9);
      if (c === 12 && v <= 2) fire('crown', 1.2, () => pearlBells(a, g * 0.34, [0, 2, 4, 5, 3, 1, 2, 4, 5, 6, 3, 0].map(i => a.deg('lyd', 'A5', i)), 0.2));   // 十二星的冠冕
      if (c === 12 && v >= 7 && v <= 8) fire('war', 1, () => trumpetVoice(a, g * 0.9, -0.2, { low: 1 }));           // 米迦勒同他的使者与龙争战
      if (c === 12 && v === 9) fire('fall', 1.5, () => {                                                            // 大龙被摔在地上：低音一路坠落，光回来
        a.note({ f: 'E3', type: 'warm', lp: 900, path: [[a.hz('Bb2'), 0.6], [a.hz('A2'), 0.5], [a.hz('E2'), 0.7], [a.hz('A1'), 0.9]], g: g * 0.6, a: 0.2, s: 2.6, r: 2.2, pan: 0, rev: 0.6 });
        rising(a, g * 0.7, 'lyd', 'A4', 6, 3.4);
      }, 9);
      if (c === 12 && v >= 10 && v <= 12) fire('salvation', 1, () => psalm(a, g), 8);
      if (c === 14 && v <= 5) fire('zion', 1, () => { a.lyre('A3', 7, g * 0.7, -0.35, 'maj', { gap: 0.2 }); a.lyre('A4', 6, g * 0.6, 0.35, 'maj', { gap: 0.28 }); psalm(a, g * 0.9); }, 9);
      if (c === 14 && v === 13) fire('rest', 1.5, () => theme(a, g * 0.9, 0.1, { beat: 0.64 }), 10);               // 息了自己的劳苦：一支很慢的摇篮曲
      if (c === 15 && v <= 4) fire('moses', 1, () => { psalm(a, g); rising(a, g * 0.6, 'maj', 'A3', 8, 2.4); }, 9); // 摩西的歌和羔羊的歌
      if (c === 16 && v === 17) fire('done', 1, () => a.chord(['A2', 'E3', 'A3', 'Cs4', 'E4'], { type: 's', g: g * 0.34, a: 1.2, s: 2.6, r: 4, spread: 0.35, rev: 0.8 }), 8);   // 「成了！」
      if ((c === 18 && v >= 2 && v <= 3) || (c === 14 && v === 8)) fire('fallen', 0.8, () => {                    // 巴比伦大城倾倒了
        toll(a, 'A1', g * 0.9, 0.2);
        a.chord(['A2', 'C3', 'E3', 'F3'], { type: 'soft', g: g * 0.3, a: 0.1, s: 0.8, r: 3, lp: 1200, lp2: 300, lpT: 3, spread: 0.3, rev: 0.7 });
      }, 8);
      if (c === 18 && v >= 21) fire('cease', 1.5, () => {                                                            // 琴声唱到一半便断了
        const ns = [], n = a.rint(3, 4);
        let i = a.rint(7, 9);
        for (let k = 0; k < n; k++) { ns.push([a.deg('aeol', 'A3', i), k * 0.3, g * 0.7, k === n - 1 ? 0.25 : 1.6]); i -= 1; }
        a.strings(ns, { wave: 'harp', bright: 5, d: 1.6, pan: 0.2, spread: 0.2, rev: 0.4 });
      }, 30);
      if (c === 19 && v <= 6) fire('hallel', 0.8, () => { alleluia(a, g * 1.1, 0); rising(a, g * 0.7, 'ion', 'A3', 8, 3); }, 8);   // 哈利路亚！主我们的神、全能者作王了
      if (c === 19 && v >= 7 && v <= 9) fire('feast', 1, () => feast(a, g, 0.3), 8);                                // 羔羊的婚娶
      if (c === 19 && v >= 11 && v <= 16) fire('rider', 1, () => { trumpetVoice(a, g, 0, { lp: 2800 }); rising(a, g * 0.7, 'mixo', 'A3', 8, 1.8); }, 8);   // 骑白马的：诚信真实
      if (c === 20 && v >= 11 && v <= 13) fire('books', 1, () => { toll(a, 'A2', g * 0.7, 0); sweep(a, ['A3', 'B3', 'D4', 'E4', 'A4', 'B4', 'D5', 'E5'], g, 0.2, 1.4); }, 8);   // 案卷展开了
      if (c === 20 && v >= 14) fire('death', 1, () => {                                                              // 死亡和阴间也被扔在火湖里
        a.note({ f: 'A1', type: 'warm', lp: 300, g: g * 0.7, a: 0.05, s: 0.6, r: 3.5, pan: 0, rev: 0.5 });
        a.chord(['A4', 'E5', 'A5'], { type: 's', g: g * 0.3, a: 2.2, s: 2, r: 3.5, at: 1.6, spread: 0.4, rev: 0.85 });
      }, 8);
      // 质地
      if ((s._hush || 0) > 0.5 || s._silent) return POLL;
      if (G.robes > 0.5 && due('lb.glass', 3, 5)) a.glass(g * 0.4, 1);
      if (G.woman > 0.5 && due('lb.star', 1.5, 3)) a.starPing(g * 0.8);                     // 日头、月亮、十二星
      if (G.alleluia > 0.5 && due('lb.bell', 3, 5)) a.ping(a.deg('ion', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan());
      if (G.seals > 0.5 && (a.lv('gale') > 0.3 || a.lv('storm') > 0.3) && due('lb.gust', 5, 8)) horseman(a, g * 0.6, a.pan(), a.rint(0, 3));
      return POLL;
    },
  });

  // ══ 启示录 · 新天新地（21 — 22）——整部圣经的末一幕 ════════════════
  const NC_SC = { new: 'lyd', dwell: 'maj', renew: 'ion', city: 'lyd', river: 'maj', come: 'maj' };
  const NC_N = Object.keys(NC_SC);
  function ncScene(h) {
    const c = h.ch, v = h.v;
    if (c === 21) return v <= 2 ? { new: 1 } : v <= 4 ? { dwell: 1 } : v <= 8 ? { renew: 1 } : { city: 1 };
    if (c === 22) return v <= 5 ? { river: 1 } : { come: 1 };
    if (c === 20) return { new: 1 };
    return null;
  }
  const NC = lv => stateOf('newcreation', ncScene, [], 'new', NC_N);
  music('newcreation', {
    weight: { drone: 0.6, pad: 1 },
    coda: 110,                     // 末一句之后乐声一直留着，直到第一个终章（「新约 · 终」）写在天上，再过约十三秒才退去（见 audio 的 FIN_HOLD）
    pad: { lp: 1600, groups: {
      new: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, -0.15], ['B3', 's', 0.13, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Ds4', 's', 0.045, 0.35],
        ['Gs4', 's', 0.05, -0.4], ['Cs5', 's', 0.03, 0.45], ['E5', 's', 0.02, -0.5]],
      dwell: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.28, -0.2], ['Cs4', 'soft', 0.14, 0.3], ['A3', 'choir', 0.1, 0], ['Cs4', 'choir', 0.08, 0], ['E4', 'choir', 0.08, 0],
        ['Fs4', 's', 0.05, -0.35], ['B4', 's', 0.03, 0.4]],
      renew: [['A1', 's', 0.24, 0], ['A2', 's', 0.24, 0], ['E3', 'soft', 0.22, -0.15], ['A3', 's', 0.12, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.09, 0.35],
        ['A4', 's', 0.06, -0.4], ['Cs5', 's', 0.035, 0.45], ['E5', 's', 0.025, -0.5], ['A3', 'over', 0.05, 0]],
      city: [['A1', 's', 0.22, 0], ['A2', 's', 0.22, 0], ['E3', 'soft', 0.22, -0.15], ['A2', 'over', 0.08, 0], ['E3', 'over', 0.05, 0.2], ['Cs4', 'soft', 0.13, -0.3],
        ['Gs4', 's', 0.06, 0.35], ['B4', 's', 0.04, -0.4], ['Ds5', 's', 0.025, 0.45], ['E5', 's', 0.025, -0.5]],
      river: [['A2', 's', 0.42, -0.1], ['E3', 'soft', 0.34, 0.15], ['A3', 'soft', 0.2, -0.3, -4], ['Cs4', 'soft', 0.18, 0.35], ['E4', 's', 0.12, -0.4], ['B4', 's', 0.06, 0.5]],
      come: [['A1', 's', 0.2, 0], ['A2', 's', 0.24, 0], ['E3', 's', 0.18, -0.15], ['A3', 'choir', 0.14, 0], ['Cs4', 'choir', 0.11, 0], ['E4', 'choir', 0.11, 0],
        ['A4', 'choir', 0.08, 0], ['Fs4', 's', 0.04, 0.4], ['B4', 's', 0.03, -0.45], ['E5', 's', 0.02, 0.5]],
    } },
    mix(lv) {
      const { g, h } = NC(lv);
      const lp = 1600 * (1 + 0.5 * g.new + 0.45 * g.dwell + 1.0 * g.renew + 0.8 * g.city + 0.45 * g.river + 0.75 * g.come) * (h.end ? 1.1 : 1);
      return { g, lp, drone: 1 + 0.3 * g.renew + 0.15 * g.come, dlp: 1 + 0.25 * g.renew + 0.1 * g.come };
    },
    scale(lv) { return NC_SC[top(NC(lv).g)] || 'maj'; },
    motif(t, g, a) {
      const { h, g: G } = NC(a.lv), k = top(G), p = a.pan();
      if (quiet('newcreation')) return [3, 5];
      switch (k) {
        case 'new': a.lyre('A4', a.rint(4, 5), g * 0.75, p, 'lyd', { gap: 0.3 }); return [12, 16];
        case 'dwell': if (Math.random() < 0.5) theme(a, g, p); else shalom(a, g); return [13, 17];
        case 'renew': rising(a, g * 0.75, 'ion', a.pick(['A3', 'A4']), 7); return [11, 15];
        case 'city': a.lyre('A5', a.rint(4, 6), g * 0.6, p, 'lyd', { gap: 0.22 }); return [11, 15];
        case 'river': a.motif('eden', g); if (Math.random() < 0.4) flowing(a, g * 0.8, 'maj'); return [12, 17];   // 伊甸回来了：伊甸的里拉
        default:
          if (h.end) {                                                                        // 全书讲完：乐句更稀、更轻，让尾声与终章的和弦说话
            if (Math.random() < 0.5) theme(a, g * 0.8, p, { kind: 'up', wave: 'glass', beat: 0.6 }); else shalom(a, g * 0.8);
            return [18, 26];
          }
          if (Math.random() < 0.5) psalm(a, g); else a.lyre('A4', a.rint(4, 6), g * 0.75, p, 'maj', { gap: 0.3 });
          return [11, 15];
      }
    },
    motif2(t, g, a) {
      const { h, g: G } = NC(a.lv), c = h.ch, v = h.v, tv = h.tv, id = 'newcreation';
      const fire = (tag, sec, fn, hold) => { if (tv >= sec && cue(h, tag)) { fn(); hushFor(id, hold || 7); } };
      if (c === 21 && v === 1) fire('sky', 1, () => {                                               // 新天新地；海也不再有了：玻璃般的平原
        rising(a, g * 0.6, 'lyd', 'A4', 6, 0, 0.22);
        a.note({ f: 'A2', type: 'soft', lp: 700, g: g * 0.45, a: 1.6, s: 1.6, r: 3.4, pan: 0, rev: 0.6 });
      });
      if (c === 21 && v === 2) fire('descend', 1, () => {                                           // 圣城从天而降，就如新妇妆饰整齐
        const ns = [];
        for (let i = 0; i < 12; i++) ns.push([a.deg('lyd', 'A4', 11 - i), i * 0.2, g * (0.3 + 0.03 * i), 2.8]);
        a.strings(ns, { wave: 's', bright: 2, d: 2.8, spread: 0.4, rev: 0.85 });
        a.note({ f: 'A2', type: 'soft', lp: 800, g: g * 0.5, a: 1.4, s: 1.6, r: 3.4, at: 2.2, pan: 0, rev: 0.6 });
      }, 8);
      if (c === 21 && v === 3) fire('dwell', 1.2, () => theme(a, g * 1.1, 0, { beat: 0.55 }), 9);    // 神的帐幕在人间：圣子的主题
      if (c === 21 && v === 4) fire('tears', 1.2, () => { drops(a, g, 'aeol'); shalom(a, g, 3); }, 9);   // 不再有眼泪
      if (c === 21 && v === 5) fire('renew', 0.8, () => {                                           // 看哪，我将一切都更新了
        good(a, g);
        rising(a, g * 0.8, 'ion', 'A2', 15, 0.8, 0.12);
        a.note({ f: 'A1', type: 's', g: g * 0.55, a: 2, s: 3, r: 4, pan: 0, rev: 0.5 });
        a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.8, a: 1.4, s: 2, r: 3.6, at: 2.6, pan: 0 });
      }, 10);
      if (c === 21 && v >= 6 && v <= 7) fire('alpha', 1, () => alphaOmega(a, g), 8);               // 我是阿拉法，我是俄梅戛；我是初，我是终
      if (c === 21 && v >= 10 && v <= 11) fire('glory', 1, () => { a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.85, a: 1.2, s: 1.6, r: 3.2, pan: 0 }); a.glass(g * 0.5, 3); }, 8);
      if (c === 21 && v >= 18 && v <= 21) fire('pearls', 1, () => pearlBells(a, g * 0.36, [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0].map(i => a.deg('maj', 'A5', i)), 0.32), 9);   // 十二个门是十二颗珍珠
      if (c === 21 && v >= 22 && v <= 23) fire('lamp', 1, () => theme(a, g, 0, { wave: 'glass', beat: 0.5 }), 9);   // 羔羊为城的灯
      if (c === 21 && v >= 24) fire('nations', 1, () => gathering(a, g, 'lyd'));                  // 列国要在城的光里行走
      if (c === 22 && v === 1) fire('river', 0.8, () => { flowing(a, g, 'maj'); flowing(a, g * 0.8, 'maj', 'A5'); });   // 生命水的河，明亮如水晶
      if (c === 22 && v === 2) fire('tree', 1, () => {                                             // 生命树，十二样果子，每月都结果子
        a.strings([0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5].map((d, i) => [a.deg('maj', 'A4', d), i * 0.26, g * 0.5, 1.8]), { wave: 'harp', bright: 4, d: 1.8, spread: 0.3, rev: 0.6 });
      }, 8);
      if (c === 22 && v >= 3 && v <= 5) fire('face', 1, () => { shalom(a, g); a.glass(g * 0.45, 2); }, 8);   // 以后再没有咒诅；要见他的面；不再有黑夜
      if (c === 22 && (v === 7 || v === 12 || v === 20)) fire('quickly', 1, () => { trumpetVoice(a, g * 0.75, 0, { lp: 2600, long: 1.2 }); good(a, g * 0.8, 1.8); }, 8);   // 看哪，我必快来！
      if (c === 22 && v === 13) fire('alpha', 1, () => alphaOmega(a, g), 8);
      if (c === 22 && v === 16) fire('star', 1, () => { a.starPing(g); a.starPing(g * 0.8); a.glass(g * 0.4, 2); });   // 明亮的晨星
      if (c === 22 && v === 17) fire('come', 1, () => {                                            // 圣灵和新妇都说：「来！」
        a.pipe([['E5', 0.4], ['A4', 1.3]], { g: g * 0.5, pan: 0.3, bright: 4, breath: 0.25, vib: 9, rev: 0.75 });
        a.choir(['A3', 'E4', 'A4', 'Cs5'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.7, a: 0.9, s: 1.2, r: 2.6, at: 1.9, pan: -0.15 });
      }, 8);
      if (c === 22 && v === 20) fire('amen20', 3.5, () => amen(a, g * 0.9), 8);                  // 阿们！主耶稣啊，我愿你来！
      if (c === 22 && v >= 21) fire('grace', 1.5, () => { theme(a, g, 0, { kind: 'up', wave: 'harp', beat: 0.55 }); amen(a, g, 5.5); }, 14);   // 愿主耶稣的恩惠常与众圣徒同在。阿们！
      // 质地
      if (G.new > 0.5 && due('nc.glass', 3, 6)) a.glass(g * 0.4, 1);                            // 玻璃般的平原
      if (G.renew > 0.5 && due('nc.glass', 2, 4)) a.glass(g * 0.45, 1);
      if (G.city > 0.5 && due('nc.gem', 2, 4)) a.ping(a.deg('lyd', 'A5', a.rint(0, 8)), 0, g * 0.38, a.pan());   // 宝石的光
      if (G.river > 0.5 && due('nc.water', 6, 9)) flowing(a, g * 0.7, 'maj');
      if (G.dwell > 0.5 && due('nc.lamp', 5, 8)) flame(a, g);
      if (G.come > 0.5 && !h.end && due('nc.bell', 4, 7)) a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.35, a.pan());
      return POLL;
    },
  });
})(window.GS);
