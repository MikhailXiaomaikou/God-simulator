/* ─────────────────────────────────────────────────────────────
 * music/nt2.js —— 新约各卷的乐曲（第二批）：使徒行传（五旬节 · 大马色 · 直到地极）与书信
 *   （罗马书 · 哥林多书 · 加拉太书 · 监狱书信 · 帖撒罗尼迦书 · 教牧书信 · 希伯来书 · 活石 · 神就是爱）
 *
 * 写法见 js/music/ot1.js 的开头（GS.audio.music(id, spec)；仍全在 A 上——整部圣经是一首连续的曲子；
 * 响度照那里的规矩：每组增益之和约 1.0–1.4，根音 0.35–0.5，越高越轻）。
 *
 * 本文件的做法与旧约各卷不同：新约各幕与乐曲同时写成，乐曲不知道各幕自己的程度叫什么——
 *   所以乐色跟着经文走。here(id) 读此刻正显示的那一行经文（旁白浮现时 GS.bus 发出的 'scripture'，
 *   只认本卷这一句话之内的；退而求其次是这一句话自己的 ref），得到书卷、章、节；每一卷把「书 · 章 : 节」
 *   映到一个光景（乐垫的一组），再叠上世界的天气（storm gale gloom）与昼夜。不论各幕怎样排列它们的话语，
 *   乐声总跟着正在讲的那段经文：风与火、众人的方言合成同一个声音、大马色路上的光与三天的黑暗、
 *   船与风暴、监里半夜的歌、爱的篇章、九样果子、锁链中的灯、主降临的号、信心的伟人一个个走过
 *   （希伯来书第十一章引回旧约各卷的乐色：该隐的弓弦、挪亚的水、亚伯拉罕的星、约瑟的乌德、红海的鼓、
 *   耶利哥的角）、「神就是爱」时人的主题（神造人那一日的第一条旋律）。
 *   · t：这一句话说出之后过了几秒（与情节同一个钟）；tv：这一行经文显示之后几秒——在一句之内分出前后。
 *   · cue(h, 名)：一句之内只奏一次的时刻（光、锁链脱落、神的号、九样果子、一块块活石……），
 *     由次要的一层（motif2，每秒左右查看一次）奏出；质地的疏密用 due(名, 最短, 最长) 自己计时。
 *   · 调式与乐句都跟着乐垫此刻最重的一组走（top）：乐垫、调式、乐句三者总是同一个光景。
 * 新约的温暖：多用笛（flute）、竖琴、弓弦的暖（warm）与无字的合唱；乐句比旧约略亲近，却仍稀疏。
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
  // 光景（{ 组: 分量 }，按写的先后为优先次序）→ stack 的次序；pre 在前（天气压过经文），post 在后
  const ord = (pre, s, post) => pre.concat(Object.keys(s).map(k => [k, s[k]]), post || []);

  // ── 此刻讲到哪里 ─────────────────────────────────────────
  // 经文出处：「使徒行传 2:1–4」「2:4」「哥林多前书 13:4」→ { bk, ch, v }
  function refOf(x) {
    if (typeof x !== 'string') return null;
    const m = /^\s*([^\d:：\s]*)\s*(\d+)\s*[:：]\s*(\d+)/.exec(x);
    return m ? { bk: m[1], ch: +m[2], v: +m[3] } : null;
  }
  // 这一出处是否属于本卷自己的书（书信常引旧约：「创世记 4:4」「约珥书 2:28」——那不是本卷的章节，不拿来查光景）
  function inAct(A, bk) {
    if (!bk || !A || !A.books) return true;
    const BK = GS.book && GS.book.BOOKS;
    if (!BK) return true;
    for (const n of A.books) { const b = BK[n - 1], nm = b && b.name; if (nm && (nm === bk || nm.indexOf(bk) >= 0 || bk.indexOf(nm) >= 0)) return true; }
    return false;
  }
  // 此刻正显示的那一行经文（只记本卷自己的书；引来的旧约经文不改变光景）
  let LINE = null;
  if (GS.bus && GS.bus.on) {
    GS.bus.on('scripture', line => {
      const r = line && refOf(line.ref), A = GS.book && GS.book.ACTS ? GS.book.ACTS[W.act | 0] : null;
      if (r && W && inAct(A, r.bk)) LINE = { r, st: W.stage | 0, act: W.act | 0, at: W.t || 0 };
    });
  }
  // here(id)：n 本卷已说出几句（0 = 第一句之前）· N 共几句 · end 已说完 · bk 书卷 · ch 章 · v 节
  //           · t 这一句说出之后几秒 · tv 这一行经文显示之后几秒 · st 全书的句序
  const HERE = {}, CUED = {};
  function here(id) {
    const B = GS.book, A = B && B.find ? B.find(id) : null, st = W ? W.stage | 0 : 0, now = (W && W.t) || 0, k = (W && W.fast) || 1;
    let h = HERE[id];
    if (!h || h.st !== st || h.A !== A) {
      h = HERE[id] = { A, st, t0: now, n: 0, N: 1, end: false, bk0: '', sref: null, bk: '', ch: 0, v: 0, t: 0, tv: 0 };
      for (const c in CUED) if (c.indexOf(st + ':') === 0) delete CUED[c];     // 重讲这一句时，一次性的时刻可以再奏
      if (A) {
        const S = GS.story && GS.story.STAGES, BK = B.BOOKS, b0 = BK && A.books ? BK[A.books[0] - 1] : null;
        h.N = max(1, A.last - A.first + 1);
        h.n = max(0, min(h.N, st - A.first));
        h.end = h.n >= h.N;
        h.bk0 = b0 && b0.name ? b0.name : '';
        const s = h.n > 0 && S ? S[A.first + h.n - 1] : null;
        if (s) {
          const rs = [s.ref].concat(Array.isArray(s.verse) ? s.verse.map(x => x && x.ref) : []);
          for (const x of rs) { const r = refOf(x); if (r && inAct(A, r.bk)) { h.sref = r; break; } }
        }
      }
    }
    const L = LINE && A && LINE.st === st && LINE.act === A.index ? LINE : null;
    const r = L ? L.r : h.sref;
    h.bk = r && r.bk ? r.bk : h.bk0;
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
  const POLL = [0.6, 1.0];            // 次要的一层每秒左右查看一次

  // ── 共用的乐器与乐句（都在乐声总线上、可舍的优先级）────────────
  // 应答的诗篇：I · IV · I，左右两班；minor：小调（监里半夜的歌）
  function psalm(a, g, minor) {
    const I = ['A3', minor ? 'C4' : 'Cs4', 'E4', 'A4'], IV = ['A3', 'D4', minor ? 'F4' : 'Fs4', 'A4'];
    a.choir(I, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.9, a: 0.8, s: 0.7, r: 1.6, pan: -0.3 });
    a.choir(IV, { gs: [1, 0.8, 0.7, 0.5], g: g * 0.85, a: 0.8, s: 0.6, r: 1.6, at: 2.2, pan: 0.3 });
    a.choir(I, { gs: [1, 0.8, 0.75, 0.55], g: g * 0.9, a: 0.9, s: 1.1, r: 2.8, at: 4.4, pan: 0 });
  }
  // 同一个声音：先是八度的齐唱，再张开成和弦
  function unison(a, g, p) {
    a.choir(['A3', 'A4'], { gs: [1, 0.7], g: g * 0.9, a: 0.9, s: 1.0, r: 1.4, pan: p * 0.3 });
    a.choir(['A3', 'E4', 'A4', 'Cs5'], { gs: [1, 0.8, 0.7, 0.45], g: g * 0.95, a: 1.0, s: 1.4, r: 2.6, at: 2.2, pan: 0 });
  }
  // 圣哉三呼（左、右、合）
  function holy(a, g) {
    [[0, -0.45], [1.7, 0.45], [3.4, 0]].forEach(([at, pn], i) => a.choir(i < 2 ? ['A3', 'E4', 'A4', 'Cs5'] : ['A3', 'E4', 'A4', 'Cs5', 'E5'],
      { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * (i < 2 ? 0.9 : 1.05), a: 0.5, s: i < 2 ? 0.5 : 1.3, r: i < 2 ? 1.4 : 3, at, pan: pn }));
  }
  // 远处的号角：一声五度（A3 → E4）
  function hornCall(a, g, p) {
    a.note({ f: 'A3', type: 'warm', lp: 1300, g: g * 1.05, a: 0.12, s: 0.3, r: 1.1, vib: [5, 0.004], pan: p, rev: 0.75 });
    a.note({ f: 'E4', type: 'warm', lp: 1700, g, a: 0.15, s: 0.9, r: 2.2, at: 0.55, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 神的号：两支号，三音的号令（帖前 4:16、林前 15:52）
  function trumpets(a, g, p) {
    [[0, 0.16], [0.24, 0.16], [0.5, 1.2]].forEach(([at, d], i) => ['A4', 'E5'].forEach((n, j) =>
      a.note({ f: n, type: 'warm', lp: 2600, g: g * (j ? 0.4 : 0.62) * (i === 2 ? 1.1 : 0.9), a: 0.03, s: d, r: 0.5, at,
        vib: i === 2 ? [5.2, 0.003] : null, pan: j ? p + 0.2 : p - 0.2, rev: 0.7 })));
  }
  // 羊角：先低，滑上五度
  function shofar(a, g, p, at) {
    at = at || 0;
    a.note({ f: 'A3', type: 'reed', lp: 1300, g: g * 0.7, a: 0.1, s: 0.35, r: 0.8, at, pan: p, rev: 0.75 });
    a.note({ f: 'A3', type: 'reed', lp: 1500, path: [[a.hz('E4'), 0.22]], g: g * 0.65, a: 0.12, s: 1.1, r: 1.8, at: at + 0.6, vib: [5, 0.004], pan: p, rev: 0.8 });
  }
  // 手鼓与串铃：'D' 鼓心 · 't' 鼓边（带铃）· 'j' 只摇串铃 · '.' 空拍
  function timbrel(a, g, p, pat, beat) {
    beat = beat || 0.19;
    const hits = [];
    let nj = 0;
    for (let i = 0; i < pat.length; i++) {
      const c = pat[i], at = i * beat;
      if (c === 'D') hits.push([at, 700, 95, g * 0.85, true]);
      else if (c === 't' || c === 'j') {
        if (c === 't') hits.push([at, 2600, 260, g * 0.4, false]);
        if (nj++ < 4) a.burst({ buf: 'white', f: 7200, q: 1.4, g: g * 0.3, a: 0.002, d: 0.09, at, pan: p, rev: 0.3 });
      }
    }
    if (hits.length) a.knocks(hits, { lp: 3200, pan: p, rev: 0.35 });
  }
  // 活水：一串下行的玻璃般的拨弦
  function flowing(a, g, sc) {
    const i0 = a.rint(8, 10), n = a.rint(5, 7), ns = [];
    for (let k = 0; k < n; k++) ns.push([a.deg(sc || 'maj', 'A4', i0 - k), k * 0.12, g * (1 - k * 0.07), 1.8]);
    a.strings(ns, { wave: 'sine', bright: 2, d: 1.8, pan: a.pan(), spread: 0.35, rev: 0.75 });
  }
  // 火舌：几声高处的、急促而不齐的短拨
  function flicker(a, g, sc) {
    const n = a.rint(4, 6), ns = [];
    for (let i = 0; i < n; i++) ns.push([a.deg(sc || 'lyd', 'A5', a.rint(0, 6)), i * a.rnd(0.05, 0.13), g * a.rnd(0.35, 0.7), 0.6]);
    a.strings(ns, { wave: 't', bright: 4, d: 0.6, pan: a.pan(), spread: 0.5, rev: 0.6 });
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
    a.strings(ns, { wave: 'sine', bright: 2, d: 2.4, pan: a.pan(), spread: 0.25, rev: 0.85 });
  }
  // 一道升起的琴（光、荣耀、复活）
  function rising(a, g, sc, base, n) {
    const ns = [];
    for (let i = 0; i < (n || 7); i++) ns.push([a.deg(sc || 'maj', base || 'A3', i), 0.1 + i * 0.16, g * (0.8 - i * 0.04), 3]);
    a.strings(ns, { wave: 'harp', bright: 5, d: 3, rev: 0.65, spread: 0.3 });
  }
  // 竖琴的一扫（书卷展开）
  function sweep(a, notes, g, p) {
    a.strings(notes.map((n, i) => [n, i * 0.075, g * 0.7 * (1 - i * 0.035), 2.6]), { wave: 'harp', bright: 5, d: 2.6, pan: p, spread: 0.3, rev: 0.6 });
  }
  // 风：一阵带通的气流，从一边吹到另一边（响起、过去）
  function gust(a, g, p) {
    a.burst({ buf: 'pink', ft: 'bandpass', f: a.rnd(240, 340), f2: a.rnd(900, 1300), sweep: 1.8, q: 0.8, g: g * 1.3, a: 0.9, s: 0.6, r: 1.8, pan: p, pan2: -p, rev: 0.55 });
  }
  // 众人的方言：同一句话的碎片，从四面八方来——却都在同一个调上（与巴别相反）；
  // k：0 各说各的 … 1 合为一声（碎片向中间聚拢，落到同一组音上）
  function voices(a, g, k) {
    const p = a.rnd(-1, 1) * 0.9 * (1 - k), n = a.rint(2, 4), one = k > 0.65, ns = [];
    const base = one ? 'A4' : a.pick(['A3', 'A4', 'A4', 'A5']);
    let i = one ? a.pick([0, 2]) : a.rint(0, base === 'A5' ? 2 : 4);
    if (Math.random() < 0.5) {
      let at = 0;
      for (let j = 0; j < n; j++) { ns.push([a.deg('maj', base, i), at, g * a.rnd(0.6, 0.9), 1.6]); at += a.rnd(0.14, 0.24); i += one ? 1 : a.pick([1, -1, 1, 2]); }
      a.strings(ns, { wave: 'harp', bright: 5, d: 1.6, pan: p, spread: 0, rev: 0.55 });
    } else {
      for (let j = 0; j < n; j++) { ns.push([a.deg('maj', base, i), a.rnd(0.16, 0.3)]); i += one ? 1 : a.pick([1, -1, 1, 2]); }
      a.pipe(ns, { g: g * 0.5, pan: p, bright: 4, breath: 0.3, vib: 7, rev: 0.55 });
    }
  }
  // 人的主题（整部作品第一条有起伏的旋律，神造人的那一日：A4 C#5 E5 F#5 E5 C#5 A4）：笛
  function theme(a, g, p, o) {
    o = o || {};
    const k = o.slow || 1;
    a.pipe([['A4', 0.45 * k], ['Cs5', 0.45 * k], ['E5', 0.45 * k], ['Fs5', 0.6 * k, 1.1], ['E5', 0.45 * k], ['Cs5', 0.45 * k], ['A4', 1.6 * k]],
      { g: g * (o.k || 0.5), pan: p, bright: 4, breath: 0.2, vib: 9, rev: 0.7, at: o.at || 0 });
  }
  // 「阿爸」：孩子的呼唤——一个下行的小三度，两回
  function abba(a, g, p) {
    a.pipe([['E5', 0.5], ['Cs5', 1.0], ['E5', 0.45, 0.8], ['Cs5', 1.4, 0.8]], { g: g * 0.45, pan: p, bright: 4, breath: 0.2, vib: 8, rev: 0.7 });
  }
  // 锁链脱落：一串金属的轻响，由密而疏往下落
  function chains(a, g, p) {
    let at = 0;
    for (let i = 0; i < 7; i++) {
      const f = a.deg('lyd', 'A5', 8 - i - (Math.random() < 0.3 ? 1 : 0)), pp = max(-0.9, min(0.9, p + a.rnd(-0.2, 0.2)));
      a.note({ f, g: g * (0.42 - i * 0.035), a: 0.002, d: 0.5, at, pan: pp, rev: 0.55 });
      a.note({ f: f * 2.76, g: g * 0.08, a: 0.002, d: 0.16, at, pan: pp, rev: 0.4 });
      at += 0.06 + i * 0.035;
    }
  }
  // 一声链环（锁在兵丁身上的链子：远远的、很轻）
  function clink(a, g, p) {
    const f = a.pick(['E6', 'Cs6', 'A5']);
    a.note({ f, g: g * 0.22, a: 0.002, d: 0.35, pan: p, rev: 0.5 });
    a.note({ f: a.hz(f) * 2.76, g: g * 0.05, a: 0.002, d: 0.12, pan: p, rev: 0.4 });
  }
  // 渔夫与水手的歌（6/8 的摇荡），混合利底亚
  const SHANTY = [
    [['E4', 0.3], ['A4', 0.3], ['A4', 0.15], ['B4', 0.15], ['Cs5', 0.3], ['B4', 0.3], ['A4', 0.3], ['G4', 0.3], ['E4', 0.9]],
    [['A4', 0.45], ['Cs5', 0.15], ['E5', 0.3], ['D5', 0.3], ['Cs5', 0.3], ['B4', 0.3], ['A4', 0.9]],
    [['Cs5', 0.3], ['B4', 0.15], ['A4', 0.15], ['G4', 0.3], ['A4', 0.3], ['B4', 0.3], ['E4', 0.3], ['A4', 1.0]],
  ];
  function shanty(a, g, p) { a.pipe(a.pick(SHANTY), { g: g * 0.5, pan: p, bright: 5, breath: 0.25, vib: 8, rev: 0.6 }); }
  // 两支交织的里拉（万事互相效力）：一上一下，彼此错开半拍，在中间相遇
  function weave(a, g) {
    const up = [], dn = [];
    for (let i = 0; i < 8; i++) {
      up.push([a.deg('ion', 'A3', i), i * 0.3, g * 0.55, 2.2]);
      dn.push([a.deg('ion', 'A4', 7 - i), i * 0.3 + 0.15, g * 0.45, 2.2]);
    }
    a.strings(up, { wave: 'harp', bright: 5, d: 2.2, pan: -0.35, spread: 0.1, rev: 0.6 });
    a.strings(dn, { wave: 'harp', bright: 5, d: 2.2, pan: 0.35, spread: 0.1, rev: 0.6 });
  }
  // 一块活石安放：石的叩声 + 一声亮起的拨弦（第 k 块，一级一级往上）
  function stone(a, g, p, k) {
    a.knocks([[0, 900, 150, g * 0.9, true], [0.09, 1800, 220, g * 0.3, false]], { lp: 2400, pan: p, rev: 0.45 });
    a.strings([[a.deg('ion', 'A3', k), 0.12, g * 0.6, 2.4]], { wave: 'harp', bright: 5, d: 2.4, pan: p, spread: 0, rev: 0.6 });
  }
  // 九样果子（仁爱 喜乐 和平 忍耐 恩慈 良善 信实 温柔 节制）：自低而高九声铃
  const FRUIT = ['A4', 'B4', 'Cs5', 'E5', 'Fs5', 'A5', 'B5', 'Cs6', 'E6'];
  function fruitBell(a, g, i) { a.bells([FRUIT[i]], 0, g * (0.7 - i * 0.03), 2.8, 0, { rev: 0.7 }); }
  // 创世记的「好」：正弦铃 A5 C#6 E6
  const good = (a, g) => a.bells(['A5', 'Cs6', 'E6'], 0.18, g * 0.8, 3);
  // 一句宁静的里拉（夜、灯下）
  const soft = (a, g, p, sc, base) => a.lyre(base || a.pick(['A3', 'A4']), a.rint(3, 4), g * 0.65, p, sc, { gap: 0.4 });

  // ══ 使徒行传 · 五旬节（1 — 7）══════════════════════════════
  // 楼上的等候（挂二、挂四：没有三音——应许还没有来）；升天、天开了（利底亚的光，高处的星般的正弦）；
  // 五旬节：一阵大风（低处的挂四，随风涌起的脉动，风声从一边吹到另一边）→ 舌头如火焰（A 大九 #11 的亮，
  // 高处一闪一闪的火舌）→ 众人各用自己的乡谈（无字的合唱张成一个大的六九和弦；碎片从四面八方来，
  // 却都在同一个调上——巴别的反面）→ 渐渐聚拢成同一个声音（八度与五度的齐唱）；
  // 凡物公用、擘饼、家家的灯（温暖的 A6/9，牧笛）；瘸腿的跳起来（混合利底亚的上行、手鼓）；
  // 司提反：看见天开了（利底亚）——众人用石头打他（爱奥利亚的暗，弓弦）——「他睡了」（回到等候的宁静）。
  const PC_SC = { wait: 'sus', heaven: 'lyd', wind: 'sus', fire: 'lyd', many: 'maj', one: 'maj', common: 'maj', martyr: 'aeol' };
  const PC_N = Object.keys(PC_SC);
  function pcScene(h) {
    const c = h.ch, v = h.v, t = h.t;
    if (!c || c < 1) return {};
    if (c === 1) return v >= 9 && v <= 11 ? { heaven: 1 } : {};
    if (c === 2) {
      if (v <= 2) return { fire: sm(9, 15, t), wind: 1 };                                   // 响声从天上下来，好像一阵大风
      if (v === 3) return { fire: 1 };                                                       // 舌头如火焰显现出来
      if (v === 4) return { many: sm(1, 6, h.tv), fire: 1 };                                 // 按着圣灵所赐的口才说起别国的话来
      if (v <= 13) return { one: max(sm(8.5, 11.5, v), sm(12, 24, t)), many: 1 };          // 各人听见门徒用他的乡谈……
      if (v <= 41) return { one: 1 };                                                        // 彼得的讲道、三千人受洗
      return { common: 1 };                                                                  // 凡物公用、擘饼
    }
    if (c === 3) return v <= 10 ? { common: 1 } : { one: 1 };
    if (c === 4) return v >= 32 ? { common: 1 } : { one: 1 };
    if (c === 5) return v >= 17 && v <= 26 ? { heaven: 1 } : v >= 12 && v <= 16 ? { common: 1 } : { one: 1 };
    if (c === 6) return v >= 15 ? { heaven: 1 } : v <= 7 ? { common: 1 } : {};
    if (c === 7) {
      if (v <= 54) return {};
      if (v <= 56) return { heaven: 1 };                                                     // 看见天开了
      if (v <= 58) return { martyr: 1 };
      if (v === 59) return { martyr: 1 };
      return { heaven: 0.45 * sm(2, 10, h.tv), martyr: 1 - sm(6, 16, h.tv) };               // 「主啊，不要将这罪归于他们」；他睡了
    }
    return {};
  }
  function pcG(lv) {
    const h = here('pentecost'), s = pcScene(h), gale = 0.8 * sm(0.25, 0.7, lv('gale'));
    const post = [['wind', gale], ['martyr', 0.7 * sm(0.35, 0.85, lv('gloom'))]];
    return stack(ord([], s, post), 'wait', PC_N);
  }
  music('pentecost', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1500, groups: {
      wait: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.2], ['B3', 'soft', 0.16, 0.3], ['D4', 's', 0.06, -0.35], ['E4', 's', 0.06, 0.4]],
      heaven: [['A1', 's', 0.3, 0], ['A2', 'over', 0.08, 0], ['E3', 's', 0.18, 0.1], ['Cs4', 'soft', 0.15, -0.25], ['E4', 's', 0.1, 0.3], ['Gs4', 's', 0.07, -0.35],
        ['Cs5', 's', 0.04, 0.45], ['Ds5', 's', 0.025, -0.5], ['A5', 's', 0.012, 0.55]],
      wind: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.12, -0.2], ['D3', 'soft', 0.24, 0.3], ['E3', 'soft', 0.21, -0.3], ['A3', 'soft', 0.06, 0.2], ['B3', 's', 0.09, 0.4]], pulse: [0.31, 0.42] },
      fire: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.27, -0.15], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.1, -0.35], ['Gs4', 's', 0.06, 0.4], ['B4', 's', 0.04, -0.45], ['Ds5', 's', 0.02, 0.5]],
      many: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.13, 0], ['E4', 'choir', 0.1, 0], ['Fs4', 'choir', 0.07, 0], ['B4', 'choir', 0.05, 0], ['Cs5', 'choir', 0.04, 0]],
      one: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.18, 0.1], ['A3', 'choir', 0.17, 0], ['E4', 'choir', 0.1, 0], ['A4', 'choir', 0.12, 0]],
      common: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.16, 0.3], ['Fs4', 'flute', 0.07, -0.35], ['B4', 's', 0.035, 0.45]],
      martyr: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'soft', 0.08, -0.15], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.16, 0.25], ['F3', 's', 0.08, 0.35]],
    } },
    mix(lv) {
      const g = pcG(lv);
      const lp = 1500 * (1 + 0.8 * g.heaven + 0.6 * g.fire + 0.35 * g.one + 0.3 * g.many + 0.15 * g.common) * (1 - 0.3 * g.martyr) * (1 - 0.08 * g.wind);
      return { g, lp, drone: 1 + 0.35 * g.wind - 0.15 * g.heaven, dlp: 1 + 0.25 * g.wind - 0.2 * g.martyr, tc: 1.8 };
    },
    scale(lv) { return PC_SC[top(pcG(lv))] || 'sus'; },
    motif(t, g, a) {
      const h = here('pentecost'), G = pcG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'heaven':                                                                        // 被取上升、天开了
          a.angelRun(g * 0.8);
          a.choir(['A3', 'E4', 'A4', 'Cs5'], { gs: [1, 0.8, 0.65, 0.45], g: g * 0.75, a: 1.2, s: 1.2, r: 2.8, at: 0.8, pan: -p * 0.5 });
          return [10, 14];
        case 'wind': gust(a, g, p); if (Math.random() < 0.5) a.bowed(a.pick(['A2', 'E2']), g * 0.55, -p); return [5, 8];
        case 'fire': a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'lyd', { gap: 0.2 }); return [8, 12];
        case 'many': voices(a, g, G.one / max(0.01, G.one + G.many)); return [3, 5];
        case 'one': unison(a, g, p); return [10, 14];                                         // 同心合意
        case 'common':
          if (h.ch === 3 && h.v <= 10) {                                                      // 瘸腿的跳起来，走着、跳着，赞美神
            a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'mixo', { gap: 0.14 });
            timbrel(a, g * 0.8, -p, 'D.tDjtD.', 0.2);
            return [7, 10];
          }
          if (a.night() > 0.5) { soft(a, g, p, 'maj'); return [14, 20]; }
          a.shepherd(g * 0.85, p); return [12, 18];
        case 'martyr': a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [12, 17];
        default:
          if (Math.random() < 0.5) a.ney(g * 0.9, p); else soft(a, g, p, 'sus', 'A3');
          return [15, 22];
      }
    },
    motif2(t, g, a) {
      const h = here('pentecost'), G = pcG(a.lv);
      if (G.wind > 0.4 && cue(h, 'wind')) { gust(a, g * 1.2, -0.7); gust(a, g * 0.9, 0.5); }                 // 忽然从天上有响声下来
      if (G.fire > 0.4 && cue(h, 'fire')) { flicker(a, g * 0.9, 'lyd'); a.bells(['A5', 'E6'], 0.3, g * 0.5, 2.2); }
      if (G.fire > 0.3 && due('pc.fire', 1.4, 3)) flicker(a, g * 0.45, 'lyd');                                 // 分开落在各人头上
      if (G.many > 0.2 && due('pc.many', 0.9, 2)) voices(a, g * 0.75, G.one / max(0.01, G.one + G.many));
      if (G.one > 0.6 && G.many > 0.05 && cue(h, 'one')) unison(a, g * 1.1, 0);                               // 合为同一个声音
      if (G.heaven > 0.4 && due('pc.glass', 3, 6)) a.glass(g * 0.45, 1);
      if (G.common > 0.5 && a.night() > 0.5 && due('pc.lamp', 2, 4)) a.ping(a.pick(['A4', 'E4', 'Cs5']), 0, g * 0.4, a.pan());   // 家家的灯
      return POLL;
    },
  });

  // ══ 使徒行传 · 大马色（8 — 12）══════════════════════════════
  // 旷野的路（挂留、车轮般缓慢的起伏，苇笛）；「看哪，这里有水」（清澈的 A 加九，流水）；
  // 逼迫、希律、监里的夜（弗里几亚，低处行军般的脉动）；大马色路上忽然四面发光（利底亚的极亮，乐垫在半秒之内亮起）
  // → 三天看不见（只剩低处的 A 小，低通合上）→ 鳞片脱落（大三度回来）；彼得在房顶上的异象（利底亚的闪烁，
  // 一块大布三次从天上缒下来：三道下行的玻璃）；圣灵降在外邦人身上（水与合唱）；天使来了：锁链脱落，铁门自己开了。
  const DM_SC = { road: 'sus', water: 'maj', threat: 'phryg', light: 'lyd', blind: 'aeol', sight: 'ion', vision: 'lyd' };
  const DM_N = Object.keys(DM_SC);
  function dmScene(h) {
    const c = h.ch, v = h.v, t = h.t;
    if (!c) return {};
    if (c <= 8) { if (c < 8) return {}; if (v <= 3) return { threat: 1 }; if (v <= 25) return { sight: 1 }; if (v <= 35) return {}; return { water: 1 }; }
    if (c === 9) {
      if (v <= 2) return { threat: 1 };
      if (v <= 7) return { blind: sm(14, 22, t), light: 1 };                                // 天上发光 → 睁开眼睛，竟不能看见什么
      if (v <= 9) return { blind: 1 };
      if (v <= 16) return { vision: 1 };                                                     // 亚拿尼亚：他是我所拣选的器皿
      if (v <= 18) return { sight: v === 18 ? max(sm(0.5, 4, h.tv), sm(2, 9, t)) : sm(4, 12, t), blind: 1 };   // 眼睛上好像有鳞立刻掉下来
      return { sight: 1 };
    }
    if (c === 10) return v <= 16 ? { vision: 1 } : v <= 43 ? { sight: 1 } : { water: 1 };
    if (c === 11) return { sight: 1 };
    if (c === 12) return v <= 6 ? { threat: 1 } : v <= 11 ? { vision: 1 } : v <= 19 ? { sight: 1 } : { water: 1 };
    return { sight: 1 };
  }
  function dmG(lv) {
    const h = here('damascus');
    return stack(ord([], dmScene(h), [['threat', 0.6 * sm(0.35, 0.85, lv('gloom'))]]), 'road', DM_N);
  }
  music('damascus', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      road: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.34, -0.2], ['B3', 'soft', 0.15, 0.3], ['D4', 's', 0.07, -0.35], ['A3', 'reed', 0.025, 0.2]], pulse: [0.62, 0.14] },
      water: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 's', 0.14, 0.3], ['Cs4', 'soft', 0.16, -0.3], ['E4', 's', 0.08, 0.4], ['A4', 's', 0.04, -0.5]],
      threat: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.08, -0.15], ['Bb2', 'soft', 0.08, -0.35], ['C3', 'soft', 0.3, 0.3], ['E3', 'soft', 0.2, -0.2], ['F3', 's', 0.09, 0.4], ['A3', 'soft', 0.05, 0.2]], pulse: [1.05, 0.25] },
      light: [['A1', 's', 0.2, 0], ['A2', 's', 0.24, 0], ['E3', 's', 0.2, -0.15], ['Cs4', 's', 0.14, 0.25], ['E4', 's', 0.11, -0.3], ['Gs4', 's', 0.08, 0.35],
        ['Ds5', 's', 0.045, -0.45], ['A5', 's', 0.02, 0.5], ['A3', 'over', 0.08, 0]],
      blind: [['A1', 's', 0.46, 0], ['E2', 'soft', 0.36, 0.1], ['C3', 'soft', 0.26, -0.25], ['E3', 'soft', 0.12, 0.2], ['G3', 's', 0.1, 0.3]],
      sight: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.18, 0.3], ['E4', 's', 0.1, -0.35], ['A4', 'flute', 0.045, 0.4], ['Cs5', 's', 0.02, -0.5]],
      vision: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 'soft', 0.13, -0.3], ['Ds4', 's', 0.045, 0.35], ['Gs4', 's', 0.06, -0.4], ['Cs5', 's', 0.03, 0.45]],
    } },
    mix(lv) {
      const g = dmG(lv), h = here('damascus');
      const lp = 1400 * (1 + 1.0 * g.light + 0.5 * g.vision + 0.35 * g.water + 0.25 * g.sight) * (1 - 0.45 * g.blind) * (1 - 0.22 * g.threat);
      const flash = h.ch === 9 && h.v >= 3 && h.v <= 7 && h.t < 5;                            // 忽然：乐垫在半秒之内亮起
      return { g, lp, drone: 1 + 0.25 * g.threat + 0.3 * g.light - 0.1 * g.sight, dlp: 1 - 0.3 * g.blind - 0.2 * g.threat + 0.2 * g.light, tc: flash ? 0.5 : 2 };
    },
    scale(lv) { return DM_SC[top(dmG(lv))] || 'sus'; },
    motif(t, g, a) {
      const G = dmG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'water': flowing(a, g); return [9, 13];
        case 'threat':
          a.bowed(a.pick(['A2', 'Bb2', 'C3']), g * 0.8, p);
          if (Math.random() < 0.4) a.knocks([[0, 300, 70, g * 1.2, true], [0.62, 300, 72, g * 0.9, true], [1.24, 300, 70, g * 1.1, true]], { lp: 700, pan: -p, rev: 0.6 });
          return [11, 16];
        case 'light': a.choir(['E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.8, 0.6, 0.4], g: g * 0.7, a: 0.4, s: 1.2, r: 2.6, pan: 0 }); a.glass(g * 0.6, 2); return [8, 12];
        case 'blind': if (Math.random() < 0.5) drops(a, g * 0.8, 'aeol'); return [16, 24];                     // 三天不能看见，也不吃也不喝
        case 'sight': a.lyre('A4', a.rint(4, 6), g * 0.85, p, 'ion'); return [11, 16];
        case 'vision': a.angelRun(g * 0.8); return [9, 13];
        default:                                                                              // 旷野的路、太监的车
          if (Math.random() < 0.55) a.ney(g * 0.95, p);
          else {
            const hits = [];
            for (let i = 0; i < 4; i++) hits.push([i * 0.62, 420, 88, g * 0.55, true], [i * 0.62 + 0.31, 900, 120, g * 0.25, false]);
            a.knocks(hits, { lp: 1000, pan: p, rev: 0.5 });
            a.lyre('A3', a.rint(3, 4), g * 0.6, -p, 'sus', { gap: 0.45 });
          }
          return [13, 19];
      }
    },
    motif2(t, g, a) {
      const h = here('damascus'), G = dmG(a.lv), c = h.ch, v = h.v;
      if (G.light > 0.5 && cue(h, 'flash')) {                                                   // 忽然从天上发光，四面照着他
        a.bells(['A5', 'Cs6', 'E6', 'Gs6'], 0.03, g * 0.75, 3.2);
        a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 0.9, a: 0.25, s: 1.6, r: 3, pan: 0 });
      }
      if (c === 9 && v >= 17 && v <= 18 && cue(h, 'scales')) drops(a, g * 0.9, 'maj');       // 鳞掉下来
      if (c === 10 && v >= 9 && v <= 16) for (let i = 0; i < 3; i++) if (h.t > 1 + 4.5 * i && cue(h, 'sheet' + i)) {   // 一块大布，一连三次
        const ns = [];
        for (let j = 0; j < 5; j++) ns.push([a.deg('lyd', 'A5', 6 - j), j * 0.14, g * (0.6 - j * 0.06), 2]);
        a.strings(ns, { wave: 'sine', bright: 2, d: 2, pan: 0.2 - 0.2 * i, spread: 0.2, rev: 0.8 });
        break;
      }
      if (c === 10 && v >= 44 && cue(h, 'gentiles')) psalm(a, g * 0.9);                        // 圣灵降在一切听道的人身上
      if (c === 12 && v >= 7 && v <= 10) {
        if (h.t > 1.5 && cue(h, 'chains')) chains(a, g, 0.1);                                    // 铁链从他手上脱落下来
        if (h.t > 7 && cue(h, 'gate')) {                                                          // 那门自己开了
          a.knocks([[0, 260, 62, g * 1.1, true]], { lp: 500, pan: 0.3, rev: 0.7 });
          a.choir(['A3', 'E4', 'A4'], { gs: [1, 0.8, 0.6], g: g * 0.6, a: 1.4, s: 0.8, r: 2.4, at: 0.3, pan: 0.2 });
        }
      }
      if (G.water > 0.5 && due('dm.water', 4, 7)) a.glass(g * 0.4, 1);
      if (G.vision > 0.5 && due('dm.vision', 1.2, 2.8)) a.starPing(g * 0.8);
      return POLL;
    },
  });

  // ══ 使徒行传 · 直到地极（13 — 28）════════════════════════════
  // 船与海（A6/9 随浪缓缓摇荡的脉动，水手的歌在混合利底亚上）；一城一城（混合利底亚，里拉与手鼓）；
  // 夜里的异象、主在夜间说话、天使站在旁边（利底亚的星空）；腓立比的监里：半夜唱诗（低处的 A 小七，小调的应答）
  // → 地大震动、锁链都松开了、禁卒一家欢喜（大调回来）；吕底亚的河边、马耳他的火、船上擘饼（温暖的 A 大，笛）；
  // 雅典：未识之神（利底亚、大理石般的偶次泛音）；米利都的离别、捆锁、审问（爱奥利亚，苇笛）；
  // 风暴与破船（弗里几亚，低处沉重起伏的脉动；世界的 storm 也推它）；罗马：放胆传讲，并没有人禁止（宽广的伊奥尼亚）。
  const JN_SC = { sail: 'mixo', town: 'mixo', night: 'lyd', jail: 'aeol', home: 'maj', athens: 'lyd', farewell: 'aeol', storm: 'phryg', rome: 'ion' };
  const JN_N = Object.keys(JN_SC);
  function jnScene(h) {
    const c = h.ch, v = h.v;
    if (!c) return {};
    if (c < 13) return { town: 1 };
    if (c === 13) return v <= 3 ? { night: 1 } : v <= 5 || v === 13 ? {} : { town: 1 };
    if (c <= 15) return { town: 1 };
    if (c === 16) {
      if (v <= 8) return { town: 1 };
      if (v <= 10) return { night: 1 };                                                      // 马其顿的异象
      if (v <= 12) return {};
      if (v <= 15) return { home: 1 };                                                       // 河边的吕底亚
      if (v <= 25) return { jail: 1 };                                                       // 半夜，保罗和西拉祷告唱诗
      if (v <= 28) return { home: sm(6, 14, h.t), jail: 1 };                                 // 地大震动，监门立刻全开
      return { home: 1 };                                                                    // 当信主耶稣；全家都欢喜
    }
    if (c === 17) return v <= 15 ? { town: 1 } : { athens: 1 };
    if (c === 18) return v <= 8 ? { town: 1 } : v <= 11 ? { night: 1 } : v <= 22 ? {} : { town: 1 };
    if (c === 19) return { town: 1 };
    if (c === 20) return v <= 6 || (v >= 13 && v <= 16) ? {} : v <= 12 ? { night: 1 } : { farewell: 1 };
    if (c === 21) return v <= 6 ? { farewell: 1 } : v <= 16 ? {} : { farewell: 1 };
    if (c <= 26) return c === 23 && v === 11 ? { night: 1 } : { farewell: 1 };
    if (c === 27) {
      if (v <= 12) return {};
      if (v <= 22) return { storm: 1 };
      if (v <= 26) return { night: 1 };                                                      // 天使站在我旁边：不要害怕
      if (v <= 32) return { storm: 1 };
      if (v <= 38) return { home: 1 };                                                       // 拿着饼，在众人面前祝谢了神
      return { home: max(sm(4, 14, h.t), v >= 44 ? 1 : 0), storm: 1 };                     // 船搁了浅……众人都得了救，上了岸
    }
    if (c === 28) return v <= 10 ? { home: 1 } : v <= 16 ? {} : { rome: 1 };
    return { town: 1 };
  }
  function jnG(lv, night) {
    const s = jnScene(here('journeys')), sto = sm(0.25, 0.7, lv('storm'));
    const pre = [], rest = [];
    for (const k in s) (k === 'town' || k === 'storm' ? rest : pre).push([k, s[k]]);     // 恩典的时刻压过天气；城与海让给风暴
    pre.push(['storm', max(sto, s.storm || 0)]);
    return stack(pre.concat(rest.filter(x => x[0] !== 'storm'), [['night', 0.55 * sm(0.45, 0.85, night)]]), 'sail', JN_N);
  }
  music('journeys', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      sail: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['Fs4', 's', 0.06, 0.4]], pulse: [0.14, 0.32] },
      town: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['A3', 'soft', 0.13, 0.25], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.06, -0.4], ['G4', 's', 0.04, 0.4]],
      night: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.15, -0.3], ['Gs4', 's', 0.06, 0.35], ['Ds5', 's', 0.028, -0.45]],
      jail: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.16, 0.25], ['G3', 's', 0.09, 0.35]],
      home: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'flute', 0.12, 0.3], ['E4', 's', 0.08, -0.35], ['Fs4', 's', 0.04, 0.4], ['A4', 's', 0.035, -0.45]],
      athens: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['E4', 's', 0.09, -0.3], ['Gs4', 's', 0.05, 0.35], ['Ds5', 's', 0.02, -0.45], ['A3', 'over', 0.06, 0]],
      farewell: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['C4', 'soft', 0.15, -0.3], ['E4', 's', 0.07, 0.35], ['F4', 's', 0.035, -0.4]],
      storm: { v: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.33, 0.1], ['A2', 'warm', 0.1, -0.15], ['Bb2', 'soft', 0.07, -0.3], ['C3', 'soft', 0.3, 0.3], ['E3', 'soft', 0.2, -0.2], ['F3', 's', 0.09, 0.35], ['A3', 'soft', 0.05, 0.2]], pulse: [0.3, 0.35] },
      rome: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 'soft', 0.16, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.05, -0.45], ['Cs5', 's', 0.025, 0.5]],
    } },
    mix(lv, night) {
      const g = jnG(lv, night);
      const lp = 1400 * (1 + 0.5 * g.night + 0.4 * g.athens + 0.45 * g.rome + 0.25 * g.home + 0.15 * g.sail) * (1 - 0.32 * g.storm) * (1 - 0.22 * g.jail) * (1 - 0.15 * g.farewell);
      return { g, lp, drone: 1 + 0.3 * g.storm + 0.15 * g.jail, dlp: 1 - 0.2 * g.jail + 0.2 * g.storm };
    },
    scale(lv, night) { return JN_SC[top(jnG(lv, night))] || 'mixo'; },
    motif(t, g, a) {
      const h = here('journeys'), G = jnG(a.lv, a.night()), k = top(G), p = a.pan();
      switch (k) {
        case 'town': a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'mixo'); if (Math.random() < 0.35) timbrel(a, g * 0.7, -p, 'D.t.D.tj', 0.2); return [12, 17];
        case 'night':
          if (h.ch === 27) { a.angelRun(g * 0.8); a.choir(['A3', 'E4', 'Cs5'], { gs: [1, 0.8, 0.5], g: g * 0.6, a: 1.2, s: 1, r: 2.4, at: 0.6, pan: -p * 0.5 }); return [10, 14]; }
          soft(a, g, p, 'lyd', 'A4'); return [13, 19];
        case 'jail': psalm(a, g, true); return [9, 13];                                      // 半夜，唱诗赞美神，众囚犯也侧耳而听
        case 'home':
          if (h.ch === 16 && h.v >= 26) { psalm(a, g); return [9, 13]; }                       // 他和全家都很喜乐
          if (h.ch === 28 && h.v <= 10) { a.lyre('A3', a.rint(3, 5), g * 0.7, p, 'maj', { gap: 0.36 }); return [12, 16]; }   // 马耳他的火
          if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.34 });
          return [11, 16];
        case 'athens': a.lyre('A4', a.rint(4, 5), g * 0.75, p, 'lyd', { gap: 0.3 }); return [12, 17];   // 我们生活、动作、存留，都在乎他
        case 'farewell': if (Math.random() < 0.6) a.ney(g, p); else a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.8, p); return [12, 18];
        case 'storm': a.bowed(a.pick(['A2', 'Bb2', 'C3']), g * 0.75, p); return [9, 13];     // 风暴本身就是音乐
        case 'rome':
          a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'ion');
          if (Math.random() < 0.4) hornCall(a, g * 0.8, -p);
          return [10, 14];
        default: if (Math.random() < 0.6) shanty(a, g, p); else flowing(a, g, 'mixo'); return [11, 16];
      }
    },
    motif2(t, g, a) {
      const h = here('journeys'), G = jnG(a.lv, a.night()), c = h.ch, v = h.v;
      if (c === 16 && v >= 26 && v <= 28) {
        if (cue(h, 'quake')) a.knocks([[0, 200, 50, g * 1.3, true], [0.35, 240, 55, g, true], [0.8, 220, 52, g * 0.8, true]], { lp: 420, pan: 0, rev: 0.7 });
        if (h.t > 2.5 && cue(h, 'chains')) chains(a, g, -0.1);                                 // 众囚犯的锁链也都松开了
      }
      if (c === 28 && v <= 6 && due('jn.fire', 2, 4)) flicker(a, g * 0.4, 'maj');             // 马耳他人生了火
      if (G.sail > 0.5 && due('jn.wave', 5, 9)) a.glass(g * 0.35, 1);
      if (G.night > 0.5 && due('jn.star', 1.2, 2.8)) a.starPing(g * 0.75);
      if (G.athens > 0.5 && due('jn.marble', 5, 9)) a.glass(g * 0.4, 1);
      if (G.rome > 0.5 && due('jn.rome', 4, 7)) a.ping(a.deg('ion', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan());
      return POLL;
    },
  });

  // ══ 罗马书 · 因信称义 ══════════════════════════════════════
  // 书信没有情节：每一句是一幅光的图景。罗马——京城的信：量度、论证，里拉与风琴般的偶次泛音。
  // 福音是神的大能（A 加九的光）；世人都犯了罪、亏缺了神的荣耀（每一盏灯都暗下去：低处的 A 小 b6）；
  // 白白地称义（A6 的温暖，笛上人的主题）；「罪的工价乃是死，惟有神的恩赐……乃是永生」（暗 → 光）；
  // 圣灵用说不出来的叹息（挂留，缓慢起伏的呼吸）；万事互相效力（两支里拉一上一下交织，在中间相遇）；
  // 什么都不能叫我们与神的爱隔绝（无字的合唱）；橄榄树与接上的枝子（多利亚的田园）；以善胜恶（暗 → 光）。
  const RM_SC = { gospel: 'maj', dim: 'aeol', grace: 'maj', spirit: 'sus', weave: 'ion', sure: 'maj', olive: 'dor' };
  const RM_N = Object.keys(RM_SC);
  function rmScene(h) {
    const c = h.ch, v = h.v, t = h.t;
    if (!c) return {};
    if (c === 1) return v >= 18 ? { dim: 1 } : {};
    if (c === 2) return { dim: 1 };
    if (c === 3) return v === 23 ? { grace: sm(14, 22, t), dim: 1 } : v <= 20 ? { dim: 1 } : { grace: 1 };
    if (c === 4) return {};
    if (c === 5) return v >= 12 && v <= 14 ? { dim: 1 } : { grace: 1 };
    if (c === 6) return v === 23 ? { grace: sm(10, 18, t), dim: 1 } : v >= 20 && v <= 22 ? { dim: 1 } : { grace: 1 };
    if (c === 7) return v >= 25 ? { grace: 1 } : { dim: 1 };
    if (c === 8) return v === 1 ? { grace: 1 } : v <= 27 ? { spirit: 1 } : v <= 30 ? { weave: 1 } : { sure: 1 };
    if (c === 9) return { olive: 1 };
    if (c === 10) return {};
    if (c === 11) return v >= 33 ? { sure: 1 } : { olive: 1 };
    if (c === 12) return v <= 2 ? {} : v <= 16 ? { weave: 1 } : v <= 20 ? { grace: 1 } : { grace: sm(10, 18, t), dim: 1 };
    if (c === 13) return v >= 11 ? {} : v >= 8 ? { grace: 1 } : { olive: 1 };
    if (c <= 15) return {};
    return { grace: 1 };
  }
  function rmG(lv) {
    const h = here('romans');
    return stack(ord([], rmScene(h), [['dim', 0.8 * sm(0.3, 0.8, lv('gloom'))]]), 'gospel', RM_N);
  }
  music('romans', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      gospel: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.08, 0.4], ['A4', 's', 0.04, -0.5]],
      dim: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'soft', 0.08, -0.15], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.19, 0.25], ['F3', 's', 0.1, 0.35], ['A3', 'soft', 0.06, -0.3]],
      grace: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.17, 0.3], ['Fs4', 'flute', 0.08, -0.35], ['A4', 's', 0.04, 0.45]],
      spirit: { v: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.15, 0.3], ['D4', 'soft', 0.09, -0.3], ['E4', 's', 0.06, 0.4]], pulse: [0.19, 0.42] },
      weave: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['Cs4', 'soft', 0.14, -0.3], ['Gs4', 's', 0.06, 0.35], ['B4', 's', 0.04, -0.4], ['A3', 'over', 0.06, 0]],
      sure: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.18, 0.1], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.11, 0], ['E4', 'choir', 0.11, 0], ['A4', 'choir', 0.08, 0]],
      olive: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['D4', 'soft', 0.08, -0.3], ['Fs4', 's', 0.06, 0.4]],
    } },
    mix(lv) {
      const g = rmG(lv);
      const lp = 1400 * (1 + 0.7 * g.sure + 0.4 * g.gospel + 0.35 * g.weave + 0.3 * g.grace + 0.1 * g.spirit) * (1 - 0.35 * g.dim);
      return { g, lp, drone: 1 + 0.15 * g.dim - 0.1 * g.sure, dlp: 1 - 0.2 * g.dim };
    },
    scale(lv) { return RM_SC[top(rmG(lv))] || 'maj'; },
    motif(t, g, a) {
      const G = rmG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'dim': a.bowed(a.pick(['A2', 'C3', 'E3', 'F3']), g * 0.85, p); return [13, 19];
        case 'grace': if (Math.random() < 0.45) theme(a, g, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.36 }); return [12, 18];
        case 'spirit': a.ney(g * 0.9, p); if (Math.random() < 0.5) gust(a, g * 0.5, -p); return [11, 16];   // 说不出来的叹息
        case 'weave': weave(a, g); return [9, 13];                                                 // 万事都互相效力
        case 'sure': unison(a, g, p); return [10, 14];
        case 'olive': if (Math.random() < 0.5) a.ney(g * 0.9, p); else a.shepherd(g * 0.85, p); return [13, 19];
        default: a.lyre('A4', a.rint(4, 6), g * 0.85, p, 'maj'); return [12, 17];
      }
    },
    motif2(t, g, a) {
      const h = here('romans'), G = rmG(a.lv);
      if (h.ch === 1 && h.v >= 16 && h.v <= 17 && cue(h, 'power')) good(a, g);                  // 这福音本是神的大能
      if (G.grace > 0.5 && G.dim > 0.05 && cue(h, 'gift')) a.bells(['E5', 'A5', 'Cs6'], 0.22, g * 0.7, 3);   // 暗中来的恩赐
      if (G.dim > 0.5 && due('rm.dim', 5, 9)) drops(a, g * 0.7, 'aeol');                       // 一盏一盏的灯暗下去
      if (G.grace > 0.5 && due('rm.grace', 5, 8)) a.glass(g * 0.4, 1);
      if (G.spirit > 0.5 && due('rm.spirit', 6, 10)) gust(a, g * 0.45, a.pan());
      if (G.sure > 0.5 && due('rm.sure', 3, 6)) a.glass(g * 0.45, 1);
      if (G.weave > 0.5 && due('rm.weave', 2, 4)) a.pluck(a.deg('ion', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan(), 0.6);
      return POLL;
    },
  });

  // ══ 哥林多书 · 爱 ══════════════════════════════════════════
  // 十字架的道理——在灭亡的人为愚拙，在得救的人却为神的大能（低处的多利亚，庄重）；
  // 你们是神的殿（风琴般的伊奥尼亚）；一个身子，许多肢体（合唱的许多声部合成一个和弦，光点一个个聚来）；
  // 爱是恒久忍耐……爱是永不止息（最温柔的 A6：笛上人的主题，竖琴）；复活——种的是必朽坏的，复活的是不朽坏的
  // （利底亚的光，号筒末次吹响）；瓦器里的宝贝（没有三音的土色，偶尔一粒玻璃的闪光）；
  // 若有人在基督里，他就是新造的人（利底亚）；「我的恩典够你用的」（软弱里只剩一支笛，然后温暖回来）。
  const CO_SC = { cross: 'dor', temple: 'ion', body: 'maj', love: 'maj', rise: 'lyd', clay: 'sus' };
  const CO_N = Object.keys(CO_SC);
  function coScene(h) {
    const c = h.ch, v = h.v, t = h.t, second = /后/.test(h.bk);
    if (!c) return {};
    if (!second) {
      if (c === 1) return { cross: 1 };
      if (c === 2) return v >= 9 ? { rise: 1 } : { cross: 1 };                               // 眼睛未曾看见……神为爱他的人所预备的
      if (c === 3) return {};
      if (c === 10 && v >= 16 && v <= 17) return { body: 1 };
      if (c === 11 && v >= 23) return { love: 1 };                                           // 你们每逢吃这饼、喝这杯
      if (c <= 11) return {};
      if (c === 12) return { body: 1 };
      if (c === 13) return { love: 1 };
      if (c === 14) return { body: 1 };
      if (c === 15) return v <= 11 ? { cross: 1 } : { rise: 1 };
      return { love: 1 };
    }
    if (c <= 3) return c === 3 && v >= 17 ? { rise: 1 } : { love: 1 };                      // 安慰；荣上加荣
    if (c === 4) return v === 6 ? { rise: 1 } : { clay: 1 };                                 // 叫光从黑暗里照出来的神；瓦器里的宝贝
    if (c === 5) return v >= 17 ? { rise: 1 } : { clay: 1 };                                 // 新造的人
    if (c <= 9) return { body: 1 };                                                          // 捐得乐意的人
    if (c <= 11) return { clay: 1 };
    if (c === 12) return v >= 9 ? { love: sm(10, 20, t), clay: 1 } : { clay: 1 };            // 我的能力是在人的软弱上显得完全
    return { love: 1 };
  }
  function coG(lv) {
    const h = here('corinth');
    return stack(ord([], coScene(h), [['cross', 0.6 * sm(0.35, 0.85, lv('gloom'))]]), 'temple', CO_N);
  }
  music('corinth', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      cross: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.3, 0.1], ['A2', 'warm', 0.12, -0.2], ['C3', 'soft', 0.25, 0.3], ['D3', 'soft', 0.15, -0.3], ['E3', 'soft', 0.1, 0.2], ['Fs3', 's', 0.07, 0.35]],
      temple: [['A1', 's', 0.28, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.13, 0.3], ['A2', 'over', 0.09, 0.1], ['E4', 's', 0.06, -0.4]],
      body: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.16, 0.15], ['A3', 'choir', 0.13, 0], ['Cs4', 'choir', 0.11, 0], ['E4', 'choir', 0.1, 0], ['Fs4', 'choir', 0.06, 0], ['B4', 'choir', 0.04, 0]],
      love: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'flute', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['Fs4', 's', 0.04, 0.4], ['A4', 's', 0.035, -0.45]],
      rise: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.27, -0.15], ['A3', 's', 0.15, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.1, 0.35], ['Gs4', 's', 0.05, -0.4],
        ['B4', 's', 0.035, 0.45], ['Ds5', 's', 0.02, -0.5], ['A3', 'over', 0.05, 0]],
      clay: [['A2', 's', 0.45, 0], ['E3', 'soft', 0.35, 0.2], ['B3', 'soft', 0.13, -0.3], ['E4', 's', 0.05, 0.35]],
    } },
    mix(lv) {
      const g = coG(lv);
      const lp = 1400 * (1 + 0.6 * g.rise + 0.35 * g.body + 0.3 * g.love + 0.25 * g.temple) * (1 - 0.27 * g.cross) * (1 - 0.2 * g.clay);
      return { g, lp, drone: 1 + 0.15 * g.cross - 0.1 * g.love, dlp: 1 - 0.15 * g.cross };
    },
    scale(lv) { return CO_SC[top(coG(lv))] || 'ion'; },
    motif(t, g, a) {
      const h = here('corinth'), G = coG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'cross': if (Math.random() < 0.6) a.bowed(a.pick(['A2', 'C3', 'D3', 'E3']), g * 0.85, p); else a.ney(g * 0.9, p); return [13, 19];
        case 'body': if (Math.random() < 0.5) psalm(a, g); else { gathering(a, g, 'maj'); a.lyre('A4', a.rint(3, 5), g * 0.7, -p, 'maj'); } return [10, 14];
        case 'love':                                                                         // 爱是恒久忍耐，又有恩慈
          if (Math.random() < 0.55) theme(a, g, p, { slow: 1.15 });
          else a.lyre('A4', a.rint(3, 5), g * 0.7, p, 'maj', { gap: 0.38 });
          return [11, 16];
        case 'rise':
          if (h.ch === 15 && h.v >= 51) { if (h.t > 10) trumpets(a, g, p); rising(a, g * 0.8, 'maj', 'A3', 7); return [9, 13]; }   // 号筒末次吹响
          rising(a, g, 'lyd', 'A3', 7); return [10, 14];
        case 'clay': if (Math.random() < 0.5) a.glass(g * 0.55, 1); else a.lyre('A3', 3, g * 0.6, p, 'sus', { gap: 0.5 }); return [14, 20];
        default: a.lyre(a.pick(['A3', 'A4']), a.rint(4, 6), g * 0.85, p, 'ion'); return [12, 17];
      }
    },
    motif2(t, g, a) {
      const h = here('corinth'), G = coG(a.lv);
      if (G.rise > 0.5 && /前/.test(h.bk) && h.ch === 15 && h.v >= 52 && cue(h, 'trump')) trumpets(a, g * 1.1, 0);   // 死啊，你得胜的权势在哪里？
      if (G.rise > 0.5 && due('co.rise', 4, 7)) a.glass(g * 0.45, 1);
      if (G.body > 0.5 && due('co.body', 6, 10)) gathering(a, g * 0.8, 'maj');                  // 肢体一个个联络
      if (G.clay > 0.5 && due('co.clay', 6, 10)) a.ping(a.pick(['E6', 'Cs6', 'A5']), 0, g * 0.35, a.pan());   // 宝贝的闪光
      if (G.love > 0.5 && due('co.love', 4, 7)) a.ping(a.pick(['A5', 'E5', 'Cs5']), 0, g * 0.35, a.pan());
      return POLL;
    },
  });

  // ══ 加拉太书 · 圣灵的果子 ══════════════════════════════════
  // 一幕园子。律法之下的轭（低处的多利亚，磨石般缓慢的脉动）；「我已经与基督同钉十字架……乃是基督在我里面活着」
  // （低音区的 A 大，弓弦的暖）；「阿爸，父！」（摇篮般的 A 大，笛上孩子的呼唤：一个下行的小三度）；
  // 基督释放了我们，叫我们得以自由（轭落下：锁链脱落，混合利底亚的跳跃、手鼓）；
  // 顺着圣灵而行、圣灵所结的果子（A6/9 的园子：九样果子，自低而高九声铃，一样一样亮起）；
  // 彼此担当重担；种的是什么，收的也是什么（田园的挂留，缓慢的收割的节律，牧笛）。
  const GA_SC = { yoke: 'dor', self: 'ion', abba: 'maj', free: 'mixo', garden: 'maj', harvest: 'dor' };
  const GA_N = Object.keys(GA_SC);
  function gaScene(h) {
    const c = h.ch, v = h.v, t = h.t;
    if (!c) return {};
    if (c === 1) return { self: 1 };
    if (c === 2) return v >= 19 ? { self: 1 } : v === 16 ? { self: sm(8, 16, t), yoke: 1 } : { yoke: 1 };
    if (c === 3) return v >= 25 ? {} : v >= 23 ? { yoke: 1 } : { self: 1 };            // 3:25「既然来到，就不在师傅的手下了」已不在轭下
    if (c === 4) return v >= 4 && v <= 7 ? { abba: 1 } : v >= 21 ? { free: 1 } : { yoke: 1 };
    if (c === 5) return v <= 1 ? { free: sm(2, 9, h.tv), yoke: 1 } : v <= 15 ? { free: 1 } : {};
    if (c === 6) return v <= 6 ? { abba: 1 } : v <= 10 ? { harvest: 1 } : v >= 14 && v <= 15 ? { self: 1 } : { abba: 1 };
    return {};
  }
  function gaG(lv) {
    const h = here('galatians');
    return stack(ord([], gaScene(h), [['harvest', 0.2 * sm(0.3, 0.9, lv('bloom'))]]), 'garden', GA_N);
  }
  music('galatians', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1500, groups: {
      yoke: { v: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'warm', 0.08, -0.15], ['C3', 'soft', 0.27, -0.3], ['D3', 'soft', 0.16, 0.3], ['E3', 'soft', 0.17, -0.2]], pulse: [0.45, 0.28] },
      self: [['A1', 's', 0.38, 0], ['E2', 'soft', 0.26, 0.1], ['A2', 'soft', 0.2, -0.2], ['Cs3', 'soft', 0.22, 0.3], ['E3', 'soft', 0.19, -0.3], ['A3', 'soft', 0.06, 0.2], ['A3', 'flute', 0.09, 0.35]],
      abba: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.16, 0.3], ['E4', 'flute', 0.08, -0.35], ['A4', 's', 0.04, 0.4]],
      free: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 'soft', 0.15, 0.25], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.1, 0.35], ['G4', 's', 0.045, -0.4], ['B4', 's', 0.03, 0.45]],
      garden: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.14, -0.3], ['Fs4', 's', 0.07, 0.4], ['E5', 's', 0.02, -0.5]],
      harvest: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, 0.2], ['B3', 'soft', 0.12, -0.2], ['D4', 'soft', 0.1, -0.3], ['Fs4', 's', 0.06, 0.35]], pulse: [0.5, 0.12] },
    } },
    mix(lv) {
      const g = gaG(lv);
      const lp = 1500 * (1 + 0.5 * g.free + 0.35 * g.garden + 0.3 * g.harvest + 0.25 * g.abba) * (1 - 0.27 * g.yoke) * (1 - 0.05 * g.self);
      return { g, lp, drone: 1 + 0.2 * g.yoke + 0.1 * g.self, dlp: 1 - 0.2 * g.yoke };
    },
    scale(lv) { return GA_SC[top(gaG(lv))] || 'maj'; },
    motif(t, g, a) {
      const G = gaG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'yoke':
          a.bowed(a.pick(['A2', 'C3', 'D3']), g * 0.8, p);
          a.knocks([[0, 380, 80, g * 0.6, true], [1.1, 380, 78, g * 0.5, true]], { lp: 800, pan: -p, rev: 0.5 });   // 磨石
          return [12, 17];
        case 'self': a.bowed(a.pick(['A2', 'Cs3', 'E3']), g * 0.8, p); if (Math.random() < 0.5) soft(a, g, -p, 'ion', 'A3'); return [13, 18];
        case 'abba': abba(a, g, p); if (Math.random() < 0.5) soft(a, g * 0.8, -p, 'maj', 'A4'); return [12, 17];   // 阿爸，父！
        case 'free': a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'mixo', { gap: 0.15 }); if (Math.random() < 0.5) timbrel(a, g * 0.75, -p, 'D.tjD.t.D', 0.19); return [9, 13];
        case 'harvest': a.shepherd(g * 0.9, p); return [12, 17];
        default: if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(4, 6), g * 0.8, p, 'maj', { gap: 0.3 }); return [11, 16];
      }
    },
    motif2(t, g, a) {
      const h = here('galatians'), G = gaG(a.lv);
      if (h.ch === 5 && h.v >= 22 && h.v <= 23) {                                               // 仁爱、喜乐、和平、忍耐、恩慈、良善、信实、温柔、节制
        for (let i = 0; i < 9; i++) if (h.t >= 1.8 + i * 2.2 && cue(h, 'fruit' + i)) { fruitBell(a, g, i); break; }
        return [0.3, 0.5];
      }
      if (G.free > 0.3 && G.yoke > 0.05 && cue(h, 'yoke')) chains(a, g, 0);                   // 轭落下
      if (G.garden > 0.5 && due('ga.bud', 3, 6)) a.pluck(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.45, a.pan(), 0.6);   // 园子里一朵一朵开
      if (G.harvest > 0.5 && due('ga.sheaf', 4, 7)) a.pluck(a.deg('dor', 'A4', a.rint(0, 6)), 0, g * 0.4, a.pan(), 0.5);
      if (G.abba > 0.5 && due('ga.abba', 6, 10)) a.glass(g * 0.35, 1);
      return POLL;
    },
  });

  // ══ 监狱书信 · 恩典（以弗所书 · 腓立比书 · 歌罗西书 · 腓利门书）═══
  // 罗马的囚室：一盏灯、一卷书、一条锁在兵丁身上的链子（低音区知足的 A 大，远远的一声链环）；
  // 以弗所书：你们得救是本乎恩（A6/9 的光，人的主题）；一个身体，一个圣灵（合唱）；神所赐的全副军装（混合利底亚的号角，
  // 军装一件一件亮起）；腓立比书：他本有神的形像，反倒虚己（往下，到低处）——所以神将他升为至高，万膝跪拜（合唱）；
  // 「你们要靠主常常喜乐」（手鼓与里拉）；出人意外的平安（静）；歌罗西书：万有也靠他而立（利底亚的浩大、众星）；
  // 腓利门书：不再是奴仆，乃是亲爱的兄弟（静，笛）。
  const PR_SC = { lamp: 'ion', grace: 'maj', armour: 'mixo', joy: 'maj', peace: 'maj', cosmos: 'lyd' };
  const PR_N = Object.keys(PR_SC);
  function prScene(h) {
    const c = h.ch, v = h.v, t = h.t, bk = h.bk;
    const phm = /利门/.test(bk) || bk === '门', php = !phm && /腓/.test(bk), col = /歌罗西/.test(bk) || bk === '西';
    if (!c) return {};
    if (phm) return { peace: 1 };
    if (col) return c === 1 && v >= 15 && v <= 20 ? { cosmos: 1 } : c === 3 && v >= 12 && v <= 17 ? { peace: 1 } : { grace: 1 };
    if (php) {
      if (c === 1) return { joy: 0.35 };
      if (c === 2) return v >= 6 && v <= 8 ? { cosmos: sm(12, 20, t) * (v === 6 ? 1 : 0), lamp: 1 } : v >= 9 && v <= 11 ? { cosmos: 1 } : { grace: 1 };
      if (c === 3) return v >= 20 ? { cosmos: 1 } : v >= 12 ? { armour: 1 } : { grace: 1 };     // 3:20「我们却是天上的国民」
      if (c === 4) return v <= 5 ? { joy: 1 } : v <= 9 ? { peace: 1 } : v === 13 ? { armour: 1 } : { joy: 1 };
      return { joy: 1 };
    }
    if (c === 1) return { grace: 1 };
    if (c === 2) return { grace: 1 };
    if (c === 3) return v >= 14 ? { cosmos: 1 } : { grace: 1 };
    if (c === 4) return v >= 4 && v <= 6 ? { cosmos: 1 } : { grace: 1 };
    if (c === 5) return { grace: 1 };
    if (c === 6) return v >= 10 ? { armour: 1 } : { peace: 1 };
    return { grace: 1 };
  }
  function prG(lv, night) {
    const h = here('prison');
    return stack(ord([], prScene(h), [['lamp', max(0.5 * sm(0.5, 0.9, night), 0.7 * sm(0.3, 0.8, lv('gloom')))]]), 'lamp', PR_N);
  }
  music('prison', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1300, groups: {
      lamp: [['A1', 's', 0.4, 0], ['E2', 'soft', 0.28, 0.1], ['A2', 'soft', 0.1, -0.15], ['Cs3', 'soft', 0.22, -0.3], ['E3', 'soft', 0.16, 0.25], ['A3', 's', 0.09, -0.35]],
      grace: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.15], ['Cs4', 'soft', 0.16, 0.3], ['Fs4', 's', 0.08, -0.35], ['B4', 's', 0.035, 0.45]],
      armour: [['A2', 's', 0.4, 0], ['E3', 'warm', 0.14, 0.15], ['A3', 'soft', 0.16, -0.25], ['Cs4', 'soft', 0.13, 0.3], ['E4', 's', 0.08, -0.35], ['A3', 'over', 0.06, 0], ['G4', 's', 0.03, 0.4]],
      joy: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 's', 0.14, 0.2], ['Cs4', 'soft', 0.15, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.05, -0.45], ['B4', 's', 0.03, 0.5]],
      peace: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.32, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 'flute', 0.06, 0.35], ['A4', 's', 0.03, -0.4]],
      cosmos: [['A1', 's', 0.3, 0], ['A2', 'over', 0.07, 0], ['E3', 's', 0.16, 0.1], ['A3', 'choir', 0.17, 0], ['E4', 'choir', 0.14, 0], ['Cs5', 'choir', 0.07, 0], ['Gs4', 's', 0.04, -0.45], ['Ds5', 's', 0.02, 0.5]],
    } },
    mix(lv, night) {
      const g = prG(lv, night);
      const lp = 1300 * (1 + 0.7 * g.cosmos + 0.45 * g.joy + 0.4 * g.armour + 0.35 * g.grace + 0.15 * g.peace) * (1 - 0.3 * g.lamp);
      return { g, lp, drone: 1 + 0.1 * g.lamp + 0.15 * g.cosmos, dlp: 1 - 0.1 * g.lamp };
    },
    scale(lv, night) { return PR_SC[top(prG(lv, night))] || 'ion'; },
    motif(t, g, a) {
      const h = here('prison'), G = prG(a.lv, a.night()), k = top(G), p = a.pan();
      switch (k) {
        case 'grace': if (Math.random() < 0.4) theme(a, g, p); else a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'maj', { gap: 0.32 }); return [12, 17];
        case 'armour': hornCall(a, g * 0.9, p); a.lyre('A4', a.rint(4, 6), g * 0.7, -p, 'mixo', { gap: 0.2 }); return [10, 14];
        case 'joy':                                                                              // 你们要靠主常常喜乐
          a.lyre('A4', a.rint(5, 7), g * 0.85, p, 'maj', { gap: 0.16 });
          if (Math.random() < 0.5) timbrel(a, g * 0.7, -p, 'D.tjD.tD', 0.2); else a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.8, 0.7, 0.5], g: g * 0.6, a: 0.6, s: 0.6, r: 1.6, at: 0.4, pan: -p });
          return [8, 12];
        case 'peace': a.pipe([['E5', 1.0], ['Cs5', 0.8], ['B4', 0.8], ['A4', 1.8]], { g: g * 0.42, pan: p, bright: 4, breath: 0.2, vib: 8, rev: 0.75 }); return [14, 20];
        case 'cosmos':
          if (h.ch === 2 && h.v >= 9) { psalm(a, g); return [10, 14]; }                           // 无不屈膝，无不口称耶稣基督为主
          a.angelRun(g * 0.8); a.choir(['A3', 'E4', 'Gs4', 'Cs5'], { gs: [1, 0.8, 0.5, 0.45], g: g * 0.7, a: 1.2, s: 1.2, r: 2.8, at: 0.5, pan: -p * 0.4 });
          return [10, 14];
        default:                                                                                // 灯下写信
          if (h.ch === 2 && h.v >= 6 && h.v <= 8) {                                              // 虚己：一道往下的琴，到低处
            const ns = [];
            for (let i = 0; i < 7; i++) ns.push([a.deg('ion', 'A4', 6 - i), i * 0.34, g * (0.7 - i * 0.04), 2.6]);
            a.strings(ns, { wave: 'harp', bright: 5, d: 2.6, pan: p, spread: 0.25, rev: 0.65 });
            return [11, 15];
          }
          if (Math.random() < 0.7) soft(a, g, p, 'ion', 'A3'); else a.bowed(a.pick(['A2', 'Cs3', 'E3']), g * 0.7, p);
          return [15, 21];
      }
    },
    motif2(t, g, a) {
      const h = here('prison'), G = prG(a.lv, a.night());
      if (G.armour > 0.5 && cue(h, 'armour')) {                                                  // 腰带、护心镜、鞋、盾牌、头盔、宝剑：一件一件亮起
        const ns = [];
        for (let i = 0; i < 6; i++) ns.push([a.deg('mixo', 'A4', i * 2), 0.5 + i * 0.6, g * (0.5 + i * 0.05), 2]);
        a.strings(ns, { wave: 'harp', bright: 6, d: 2, pan: 0, spread: 0.4, rev: 0.6 });
      }
      if (G.lamp > 0.5 && due('pr.clink', 8, 14)) clink(a, g, a.pan());                          // 为这福音带着锁链
      if (G.cosmos > 0.5 && due('pr.star', 0.8, 2)) a.starPing(g * 0.8);
      if (G.joy > 0.5 && due('pr.joy', 3, 5)) a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.4, a.pan());
      if (G.peace > 0.5 && due('pr.peace', 7, 11)) a.glass(g * 0.35, 1);
      if (G.grace > 0.5 && due('pr.grace', 6, 9)) a.glass(g * 0.35, 1);
      return POLL;
    },
  });

  // ══ 帖撒罗尼迦书 · 主必降临 ════════════════════════════════
  // 由夜到黎明的一幕。信心、爱心、盼望（温暖的 A 大）；睡了的人（夜的挂二，星在上面）；
  // 主必亲自从天降临，有呼叫的声音、天使长的声音、神的号吹响（东方的黎明：创世记第六日「甚好」的那个和弦，
  // 低通全开，两支号，合唱）；主的日子来到，好像夜间的贼一样（屏住气：低处没有三音的挂四）；
  // 你们都是光明之子（利底亚）；要常常喜乐，不住地祷告，凡事谢恩（三句应答的诗篇：喜乐 · 祷告 · 谢恩）；
  // 主是信实的；你们行善不可丧志（温暖的 A 大，牧笛）。
  const TH_SC = { vigil: 'lyd', thief: 'sus', hope: 'maj', light: 'lyd', joy: 'maj', advent: 'maj' };
  const TH_N = Object.keys(TH_SC);
  function thScene(h) {
    const c = h.ch, v = h.v, second = /后/.test(h.bk);
    if (!c) return {};
    if (!second) {
      if (c <= 3) return { hope: 1 };
      if (c === 4) return v <= 12 ? { hope: 1 } : v <= 15 ? { vigil: 1 } : { advent: v === 16 ? max(sm(0, 3, h.tv), sm(0, 3, h.t)) : 1, vigil: 1 };
      if (c === 5) return v <= 3 ? { thief: 1 } : v <= 11 ? { light: 1 } : v <= 22 ? { joy: 1 } : { hope: 1 };
      return { hope: 1 };
    }
    if (c === 1) return v >= 7 && v <= 10 ? { advent: 1 } : { hope: 1 };
    if (c === 2) return v <= 12 ? { thief: 1 } : { hope: 1 };
    return { hope: 1 };
  }
  function thG(lv, night) {
    const h = here('thess'), s = thScene(h);
    const post = [['vigil', 0.6 * sm(0.5, 0.9, night) * (s.advent ? 0 : 1)], ['thief', 0.6 * sm(0.35, 0.85, lv('gloom'))]];
    return stack(ord([], s, post), h.n === 0 ? 'vigil' : 'hope', TH_N);
  }
  music('thess', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1300, groups: {
      vigil: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['E4', 's', 0.07, -0.35], ['Gs4', 's', 0.035, 0.4]],
      thief: [['A1', 's', 0.42, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'soft', 0.1, -0.15], ['D3', 'soft', 0.2, -0.3], ['E3', 'soft', 0.19, 0.3], ['A3', 'soft', 0.07, 0.2], ['B3', 's', 0.08, -0.35]],
      hope: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['B4', 's', 0.035, 0.45]],
      light: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.14, 0.3], ['Gs4', 's', 0.06, -0.35], ['Ds5', 's', 0.025, 0.45]],
      joy: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.18, 0.15], ['A3', 'choir', 0.14, 0], ['Cs4', 'choir', 0.1, 0], ['E4', 'choir', 0.1, 0], ['A4', 'choir', 0.06, 0]],
      advent: [['A1', 's', 0.2, 0], ['E2', 's', 0.16, 0.1], ['A2', 's', 0.2, -0.1], ['Cs3', 's', 0.16, 0.2], ['E3', 's', 0.16, -0.25],
        ['B3', 't', 0.12, 0.3], ['Cs4', 't', 0.13, -0.35], ['E4', 't', 0.12, 0.4], ['Fs4', 't', 0.1, -0.45], ['A4', 't', 0.08, 0.5]],
    } },
    mix(lv, night) {
      const g = thG(lv, night);
      const lp = 1300 * (1 + 1.1 * g.advent + 0.5 * g.light + 0.45 * g.joy + 0.25 * g.hope) * (1 - 0.2 * g.thief) * (1 - 0.1 * g.vigil);
      return { g, lp, drone: 1 - 0.25 * g.advent + 0.1 * g.thief, dlp: 1 + 0.2 * g.advent - 0.15 * g.thief };
    },
    scale(lv, night) { return TH_SC[top(thG(lv, night))] || 'maj'; },
    motif(t, g, a) {
      const G = thG(a.lv, a.night()), k = top(G), p = a.pan();
      switch (k) {
        case 'vigil': soft(a, g, p, 'lyd', 'A3'); return [15, 22];                                // 睡了的人
        case 'thief': if (Math.random() < 0.5) a.bowed(a.pick(['A2', 'D3']), g * 0.6, p); return [16, 24];   // 夜间的贼
        case 'light': a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'lyd'); return [11, 15];
        case 'joy': psalm(a, g); return [10, 14];                                                  // 喜乐 · 祷告 · 谢恩
        case 'advent':
          if (here('thess').t > 10) trumpets(a, g * 0.9, p);
          a.strings(['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5', 'A5'].map((n, i) => [n, 1.4 + i * 0.2, g * (1 - i * 0.06), 3.2]), { bright: 5, d: 3.2, rev: 0.65, spread: 0.3 });
          return [9, 13];
        default: if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.34 }); return [12, 17];
      }
    },
    motif2(t, g, a) {
      const h = here('thess'), G = thG(a.lv, a.night());
      if (G.advent > 0.4 && cue(h, 'trump')) {                                                    // 天使长的声音，又有神的号吹响
        trumpets(a, g * 1.15, 0);
        a.choir(['A3', 'E4', 'A4', 'Cs5', 'E5'], { gs: [1, 0.85, 0.7, 0.5, 0.35], g: g * 1.0, a: 0.6, s: 1.6, r: 3.2, at: 1.6, pan: 0 });
        good(a, g * 0.9);
      }
      if (G.advent > 0.5 && due('th.dawn', 2, 4)) a.glass(g * 0.5, 2);
      if (G.vigil > 0.5 && due('th.star', 1, 2.5)) a.starPing(g * 0.8);
      if (G.light > 0.5 && due('th.lamp', 2, 4)) a.ping(a.pick(['A4', 'E5', 'Cs5', 'A5']), 0, g * 0.45, a.pan());   // 光明之子：灯一盏盏亮
      if (G.joy > 0.5 && due('th.joy', 3, 5)) a.ping(a.deg('maj', 'A5', a.rint(0, 5)), 0, g * 0.4, a.pan());
      return POLL;
    },
  });

  // ══ 教牧书信 · 美好的仗（提摩太前书 · 提摩太后书 · 提多书）══
  // 灯下的书房与书卷，还有路（多利亚：沉静、年老而有智慧的；里拉慢慢翻页）；
  // 神愿意万人得救；只有一位中保（A 大的光）；敬虔加上知足的心（空阔的五度：我们没有带什么到世上来）；
  // 为真道打那美好的仗（混合利底亚的号角、行军般的脉动）；圣经都是神所默示的（「默示」是神的气：
  // 缓缓呼吸的合唱，书卷展开的竖琴一扫，字一个个亮）；那美好的仗我已经打过了，当跑的路我已经跑尽了
  // （由多利亚转为宽广的伊奥尼亚：公义的冠冕是光，铃）；提多书：神救众人的恩典已经显明出来（黎明），重生的洗（流水）。
  const PA_SC = { study: 'dor', simple: 'sus', fight: 'mixo', breath: 'lyd', grace: 'maj', crown: 'ion' };
  const PA_N = Object.keys(PA_SC);
  function paScene(h) {
    const c = h.ch, v = h.v, bk = h.bk;
    const tit = /提多/.test(bk) || bk === '多', two = !tit && /后/.test(bk);
    if (!c) return {};
    if (tit) return (c === 2 && v >= 11) || (c === 3 && v >= 4 && v <= 7) ? { grace: 1 } : {};
    if (!two) {
      if (c === 1) return v >= 15 && v <= 17 ? { grace: 1 } : {};
      if (c === 2) return v <= 7 ? { grace: 1 } : {};
      if (c === 3) return v === 16 ? { grace: 1 } : {};
      if (c === 6) return v >= 6 && v <= 10 ? { simple: 1 } : v >= 11 && v <= 14 ? { fight: 1 } : v <= 16 ? { grace: 1 } : {};
      return {};
    }
    if (c === 1) return v >= 6 && v <= 10 ? { grace: 1 } : {};
    if (c === 2) return v >= 1 && v <= 6 ? { fight: 1 } : {};
    if (c === 3) return v >= 14 ? { breath: 1 } : {};
    if (c === 4) return v === 7 ? { crown: sm(6, 14, h.tv), fight: 1 } : v === 8 || v >= 17 ? { crown: 1 } : {};
    return {};
  }
  function paG(lv) {
    const h = here('pastoral');
    return stack(ord([], paScene(h), []), 'study', PA_N);
  }
  music('pastoral', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1300, groups: {
      study: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['C4', 'soft', 0.1, 0.3], ['D4', 'soft', 0.08, -0.3], ['Fs4', 's', 0.05, 0.4]],
      simple: [['A2', 's', 0.46, 0], ['E3', 'soft', 0.36, 0.2], ['A3', 's', 0.12, -0.25], ['E4', 's', 0.05, 0.35]],
      fight: { v: [['A1', 's', 0.22, 0], ['A2', 's', 0.3, 0], ['E3', 'warm', 0.16, 0.15], ['A3', 'soft', 0.17, -0.25], ['Cs4', 'soft', 0.14, 0.3], ['E4', 's', 0.08, -0.35]], pulse: [0.85, 0.18] },
      breath: { v: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.26, -0.15], ['Cs4', 'soft', 0.12, 0.3], ['A3', 'choir', 0.13, 0], ['E4', 'choir', 0.11, 0], ['A4', 's', 0.04, -0.4], ['A3', 'over', 0.05, 0]], breath: 0.11 },
      grace: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.15, 0.3], ['E4', 's', 0.08, -0.35], ['Gs4', 's', 0.04, 0.4]],
      crown: [['A2', 's', 0.36, 0], ['E3', 'soft', 0.27, -0.15], ['A3', 's', 0.15, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.1, 0.35], ['A4', 's', 0.06, -0.45], ['Cs5', 's', 0.035, 0.5], ['E5', 's', 0.02, -0.5]],
    } },
    mix(lv) {
      const g = paG(lv);
      const lp = 1300 * (1 + 0.55 * g.crown + 0.5 * g.breath + 0.4 * g.grace + 0.3 * g.fight) * (1 - 0.1 * g.study) * (1 - 0.1 * g.simple);
      return { g, lp, drone: 1 + 0.1 * g.fight - 0.1 * g.crown };
    },
    scale(lv) { return PA_SC[top(paG(lv))] || 'dor'; },
    motif(t, g, a) {
      const h = here('pastoral'), G = paG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'simple': soft(a, g * 0.9, p, 'sus', 'A3'); return [16, 24];
        case 'fight': hornCall(a, g * 0.9, p); a.lyre('A3', a.rint(4, 5), g * 0.65, -p, 'mixo', { gap: 0.24 }); return [10, 14];
        case 'breath': sweep(a, ['A3', 'E4', 'A4', 'Cs5', 'E5'], g, p); a.choir(['A3', 'E4', 'A4'], { gs: [1, 0.8, 0.6], g: g * 0.55, a: 1.4, s: 1, r: 2.6, at: 0.8, pan: -p * 0.4 }); return [10, 14];
        case 'grace':
          if (/提多/.test(h.bk) && h.ch === 3) { flowing(a, g); return [9, 13]; }                  // 重生的洗
          a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'maj'); return [12, 16];
        case 'crown': a.lyre('A4', a.rint(5, 6), g * 0.85, p, 'ion'); if (Math.random() < 0.5) hornCall(a, g * 0.6, -p); return [10, 14];
        default: if (Math.random() < 0.7) a.lyre('A3', a.rint(3, 5), g * 0.7, p, 'dor', { gap: 0.38 }); else a.ney(g * 0.85, p); return [14, 20];
      }
    },
    motif2(t, g, a) {
      const h = here('pastoral'), G = paG(a.lv);
      if (G.breath > 0.5 && cue(h, 'scroll')) sweep(a, ['A3', 'Cs4', 'E4', 'A4', 'Cs5', 'E5', 'A5'], g * 0.9, 0);   // 书卷展开
      if (G.breath > 0.5 && due('pa.word', 1.6, 3.2)) a.ping(a.deg('lyd', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan());   // 字一个个亮
      if (G.crown > 0.5 && cue(h, 'crown')) good(a, g);                                             // 公义的冠冕
      if (G.crown > 0.5 && due('pa.crown', 3, 6)) a.glass(g * 0.4, 1);
      if (G.study > 0.6 && a.night() > 0.4 && due('pa.lamp', 7, 12)) a.ping(a.pick(['A4', 'E4']), 0, g * 0.3, a.pan());
      if (G.grace > 0.5 && due('pa.grace', 5, 8)) a.glass(g * 0.4, 1);
      return POLL;
    },
  });

  // ══ 希伯来书 · 信心 ══════════════════════════════════════
  // 神藉着他儿子晓谕我们——他是神荣耀所发的光辉（宽广的伊奥尼亚，风琴的光）；伟大的大祭司、会幕（殿中的庄严，
  // 祭司袍边上的金铃）；幔子——又新又活的路（殿的颜色裂开成圣所的合唱：圣哉三呼）；
  // 第十一章：信心的伟人一个个走过，旧约各卷的乐色回来——诸世界是藉神的话造成的（伊甸的里拉）、亚伯（该隐的弓弦与低处的 A 小）、
  // 以诺被接去（天使的上行）、挪亚与方舟（水上缓缓起伏的利底亚）、亚伯拉罕出去（苇笛）、如天上的星（亚伯拉罕的星空）、
  // 以撒与雅各（牧笛、天梯）、约瑟（埃及的乌德与 Hijaz）、摩西与红海（米利暗的鼓）、耶利哥（羊角与号）、喇合（一支笛：朱红线）、
  // 大卫与众先知（号角、大卫的琴）、受苦的（弓弦）；如同云彩的见证人围着我们（大合唱，光点一个个聚来）；
  // 「我总不撇下你，也不丢弃你」（最近的温暖，人的主题）；「耶稣基督，昨日、今日、一直到永远，是一样的」——
  // 只剩下纯净的 A：八度与五度，从创世记第一句起就在响的那个音；创世记的「好」的铃。
  const HB_SC = { son: 'ion', priest: 'ion', holy: 'lyd', faith: 'maj', abel: 'min', stars: 'lyd', egypt: 'hijaz', sea: 'lyd', cloud: 'maj', near: 'maj', same: 'maj' };
  const HB_N = Object.keys(HB_SC);
  function hbScene(h) {
    const c = h.ch, v = h.v;
    if (!c) return {};
    if (c <= 2) return {};
    if (c <= 4) return c === 4 && v >= 14 ? { priest: 1 } : c === 4 && v >= 12 ? {} : { faith: 1 };
    if (c <= 9) return { priest: 1 };
    if (c === 10) return v >= 19 && v <= 22 ? { holy: max(sm(1, 8, h.t), v >= 20 ? sm(0, 3, h.tv) : 0), priest: 1 } : v >= 23 ? { faith: 1 } : { priest: 1 };
    if (c === 11) {
      if (v === 4) return { abel: 1 };
      if (v === 7) return { sea: 1 };
      if (v >= 11 && v <= 16) return { stars: 1 };
      if (v === 22 || (v >= 23 && v <= 26) || v === 28) return { egypt: 1 };
      if (v === 27) return { stars: 1 };
      if (v === 29) return { sea: 1 };
      if (v >= 35 && v <= 38) return { abel: 1 };
      if (v >= 39) return { cloud: 1 };
      return { faith: 1 };
    }
    if (c === 12) return v <= 3 || (v >= 22 && v <= 24) ? { cloud: 1 } : v >= 26 ? {} : { faith: 1 };
    if (c === 13) return v === 8 ? { same: 1 } : v >= 20 ? {} : { near: 1 };
    return { faith: 1 };
  }
  function hbG(lv) {
    const h = here('hebrews');
    return stack(ord([], hbScene(h), [['abel', 0.6 * sm(0.35, 0.85, lv('gloom'))]]), 'son', HB_N);
  }
  // 第十一章每一行经文出现时，那位伟人自己的一句（旧约的乐色）
  function hero(a, g, v) {
    const p = a.pan();
    if (v <= 2) a.lyre('A4', 4, g * 0.75, p, 'maj', { gap: 0.32 });
    else if (v === 3) a.lyre('A4', a.rint(5, 6), g * 0.9, p, 'maj');                                 // 诸世界是藉神的话造成的：伊甸的里拉
    else if (v === 4) a.bowed(a.pick(['A2', 'C3']), g * 0.9, p);                                      // 亚伯
    else if (v <= 6) a.angelRun(g * 0.85);                                                             // 以诺被接去
    else if (v === 7) { flowing(a, g * 0.9, 'lyd'); a.glass(g * 0.4, 2); }                            // 挪亚：水，然后是虹
    else if (v <= 10) a.ney(g, p);                                                                     // 亚伯拉罕出去，住在帐棚里
    else if (v <= 12) gathering(a, g, 'lyd');                                                          // 如同天上的星那样众多
    else if (v <= 16) a.lyre('A4', 4, g * 0.75, p, 'lyd', { gap: 0.36 });                             // 更美的家乡
    else if (v <= 19) a.ney(g * 0.9, p);                                                               // 摩利亚山
    else if (v === 20) a.shepherd(g * 0.9, p);                                                         // 以撒祝福
    else if (v === 21) { a.angelRun(g * 0.75); a.choir(['A3', 'E4', 'A4'], { gs: [1, 0.8, 0.6], g: g * 0.6, a: 1, s: 0.8, r: 2.2, at: 0.5, pan: -p * 0.5 }); }   // 雅各（天梯）
    else if (v <= 28) a.oud(g * 0.95, p);                                                              // 约瑟、摩西在埃及
    else if (v === 29) { timbrel(a, g * 0.9, p, 'D.tDjtD.D.tD', 0.2); a.choir(['A3', 'Cs4', 'E4', 'G4'], { gs: [1, 0.85, 0.7, 0.45], g: g * 0.6, a: 0.5, s: 0.8, r: 1.8, at: 1.2, pan: -p }); }   // 过红海：米利暗的鼓
    else if (v === 30) { shofar(a, g, p); shofar(a, g * 0.8, -p, 1.8); trumpets(a, g * 0.8, 0.1); }  // 耶利哥的城墙
    else if (v === 31) a.pipe([['E5', 1.2], ['Cs5', 0.6], ['A4', 1.8]], { g: g * 0.42, pan: p, bright: 4, breath: 0.2, vib: 8, rev: 0.7 });   // 喇合：朱红线
    else if (v <= 34) { hornCall(a, g * 0.9, p); a.lyre('A4', 5, g * 0.7, -p, 'ion', { gap: 0.2 }); }  // 基甸、巴拉、参孙……大卫、撒母耳
    else if (v <= 38) a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.85, p);                                // 受苦的
    else gathering(a, g, 'maj');                                                                        // 这些人都是因信得了美好的证据
  }
  music('hebrews', {
    weight: { drone: 0.6, pad: 0.95 },
    pad: { lp: 1400, groups: {
      son: [['A1', 's', 0.26, 0], ['A2', 's', 0.26, 0], ['E3', 's', 0.2, -0.15], ['Cs4', 'soft', 0.14, 0.25], ['E4', 's', 0.1, -0.3], ['A4', 's', 0.06, 0.35], ['Cs5', 's', 0.035, -0.45], ['E5', 's', 0.02, 0.5], ['A2', 'over', 0.07, 0]],
      priest: [['A1', 's', 0.28, 0], ['A2', 's', 0.3, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.13, 0.3], ['A2', 'over', 0.09, 0.1], ['E4', 's', 0.06, -0.4]],
      holy: [['A1', 's', 0.32, 0], ['A2', 'over', 0.08, 0], ['E3', 's', 0.16, 0.1], ['A3', 'choir', 0.19, 0], ['E4', 'choir', 0.16, 0], ['A4', 'choir', 0.12, 0], ['Cs5', 'choir', 0.08, 0], ['E5', 's', 0.03, -0.5], ['Gs5', 's', 0.012, 0.55]],
      faith: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.12, -0.3], ['E4', 's', 0.07, 0.4], ['A4', 's', 0.035, -0.5]],
      abel: [['A1', 's', 0.44, 0], ['E2', 'soft', 0.34, 0.1], ['C3', 'soft', 0.28, -0.3], ['E3', 'soft', 0.17, 0.25], ['G3', 's', 0.11, 0.35]],
      stars: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.33, 0.15], ['Cs4', 'soft', 0.17, -0.3], ['Gs4', 's', 0.065, 0.35], ['Ds5', 's', 0.032, -0.45]],
      egypt: [['A1', 's', 0.34, 0], ['A2', 'soft', 0.32, -0.1], ['E3', 'soft', 0.28, 0.2], ['Bb3', 's', 0.055, -0.4], ['D4', 'soft', 0.1, 0.35]],
      sea: { v: [['A1', 's', 0.3, 0], ['E2', 's', 0.2, 0.1], ['A2', 'over', 0.07, 0], ['E3', 'soft', 0.24, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['Ds4', 's', 0.05, 0.4], ['Gs4', 's', 0.04, -0.45]], pulse: [0.16, 0.3] },
      cloud: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.17, 0.15], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.11, 0], ['E4', 'choir', 0.11, 0], ['A4', 'choir', 0.07, 0], ['Cs5', 'choir', 0.03, 0]],
      near: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'flute', 0.14, 0.3], ['E4', 's', 0.08, -0.35], ['A4', 's', 0.035, 0.4]],
      same: [['A1', 's', 0.3, 0], ['A2', 's', 0.3, 0], ['E3', 's', 0.24, -0.2], ['A3', 's', 0.17, 0.25], ['E4', 's', 0.08, -0.3], ['A4', 's', 0.045, 0.35]],
    } },
    mix(lv) {
      const g = hbG(lv);
      const lp = 1400 * (1 + 0.6 * g.son + 0.9 * g.holy + 0.5 * g.cloud + 0.35 * g.stars + 0.3 * g.sea + 0.25 * g.faith + 0.2 * g.near + 0.3 * g.same + 0.1 * g.priest)
        * (1 - 0.35 * g.abel) * (1 - 0.2 * g.egypt);
      return { g, lp, drone: 1 + 0.2 * g.holy + 0.15 * g.abel + 0.1 * g.same, dlp: 1 - 0.2 * g.abel + 0.15 * g.holy, tc: 1.6 };
    },
    scale(lv) { return HB_SC[top(hbG(lv))] || 'ion'; },
    motif(t, g, a) {
      const h = here('hebrews'), G = hbG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'priest': if (Math.random() < 0.5) psalm(a, g); else a.lyre('A3', a.rint(4, 5), g * 0.8, p, 'ion'); return [11, 16];
        case 'holy': holy(a, g); return [13, 18];
        case 'faith': case 'abel': case 'stars': case 'egypt': case 'sea':
          if (h.ch === 11) {                                                                      // 每位伟人自己的一句由次要的一层在经文出现时奏出；这里只轻轻陪着
            if (k === 'abel') a.bowed(a.pick(['A2', 'C3']), g * 0.7, p); else if (k === 'egypt') a.oud(g * 0.7, p); else soft(a, g * 0.8, p, HB_SC[k], 'A4');
            return [12, 17];
          }
          if (k === 'faith') { a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'maj'); return [12, 17]; }
          if (k === 'abel') { a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.85, p); return [13, 18]; }
          a.lyre('A4', 4, g * 0.7, p, 'lyd'); return [12, 17];
        case 'cloud': psalm(a, g); return [10, 14];
        case 'near': if (h.t > 14 && Math.random() < 0.6) theme(a, g, p, { slow: 1.1 }); else soft(a, g, p, 'maj', 'A4'); return [12, 17];
        case 'same': a.lyre('A4', a.rint(5, 6), g * 0.85, p, 'maj'); return [12, 16];           // 从起初就在响的那一句
        default: rising(a, g * 0.9, 'ion', 'A3', 7); return [11, 15];                              // 神荣耀所发的光辉
      }
    },
    motif2(t, g, a) {
      const h = here('hebrews'), G = hbG(a.lv), c = h.ch, v = h.v;
      if (c === 11 && cue(h, 'v' + v)) hero(a, g, v);                                               // 每一位伟人出现的那一刻
      if (c === 10 && v >= 19 && v <= 22 && cue(h, 'veil')) {                                       // 幔子：又新又活的路
        a.burst({ buf: 'pink', ft: 'bandpass', f: 400, f2: 1800, sweep: 2.2, q: 0.7, g: g * 0.7, a: 0.6, s: 0.4, r: 1.6, pan: 0, rev: 0.7 });
        holy(a, g * 0.95);
      }
      if (c === 13 && v === 8 && cue(h, 'same')) good(a, g);                                        // 昨日、今日、一直到永远：创世记的「好」
      if (c === 13 && v >= 5 && v <= 6 && cue(h, 'near')) theme(a, g * 1.1, 0, { slow: 1.1 });     // 我总不撇下你，也不丢弃你
      if (c === 1 && v <= 3 && cue(h, 'son')) rising(a, g, 'ion', 'A3', 8);
      if (G.priest > 0.5 && due('hb.bells', 3, 6)) a.bells([a.pick(['A6', 'E6', 'Cs6'])], 0, g * 0.25, 1.2);   // 祭司袍边上的金铃
      if (G.stars > 0.5 && due('hb.star', 0.8, 2)) a.starPing(g * 0.85);
      if (G.cloud > 0.5 && due('hb.cloud', 5, 8)) gathering(a, g * 0.8, 'maj');                     // 如同云彩的见证人
      if (G.sea > 0.5 && due('hb.sea', 4, 7)) a.glass(g * 0.35, 1);
      if (G.son > 0.6 && due('hb.son', 5, 9)) a.glass(g * 0.4, 1);
      return POLL;
    },
  });

  // ══ 普通书信 · 活石（雅各书 · 彼得前书 · 彼得后书）═══════════
  // 各样美善的恩赐都是从上头、从众光之父那里降下来的（高处的 A 大九，玻璃般的光一粒粒落下）；
  // 行道、信心没有行为是死的（手里的活：混合利底亚，缓慢的劳作的脉动，敲击）；
  // 舌头就是火，能点着最大的树林（低处的弗里几亚，偶尔一点火星——克制）；你们亲近神，神就必亲近你们（温暖的 A 大，笛）；
  // 活泼的盼望、召你们出黑暗入奇妙光明、新天新地（利底亚的黎明）；
  // 你们来到主面前，也就像活石，被建造成为灵宫（风琴般的伊奥尼亚：一块一块的石头安放，每一块亮起一级）；
  // 主看一日如千年，千年如一日（深处与极高处，中间空着：挂二，慢慢的星）。
  const LS_SC = { lights: 'lyd', works: 'mixo', ember: 'phryg', near: 'maj', dawn: 'lyd', stones: 'ion', time: 'sus' };
  const LS_N = Object.keys(LS_SC);
  function lsScene(h) {
    const c = h.ch, v = h.v, t = h.t, bk = h.bk;
    const jas = /雅各/.test(bk) || bk === '雅', p2 = !jas && /后/.test(bk);
    if (!c) return {};
    if (jas) {
      if (c === 1) return v >= 16 && v <= 18 ? {} : v >= 19 ? { works: 1 } : { near: 1 };
      if (c === 2) return { works: 1 };
      if (c === 3) return v <= 12 ? { ember: 1 } : { near: 1 };
      if (c === 4) return v >= 7 && v <= 10 ? { near: 1 } : v >= 13 ? { time: 1 } : { ember: 1 };
      return v >= 7 && v <= 11 ? { time: 1 } : { near: 1 };
    }
    if (!p2) {
      if (c === 1) return v <= 9 ? { dawn: 1 } : v >= 23 ? { time: 1 } : {};
      if (c === 2) return v <= 8 ? { stones: 1 } : v <= 10 ? { dawn: sm(6, 14, t), ember: 1 } : { near: 1 };
      if (c === 3) return { near: 1 };
      if (c === 4) return v >= 12 && v <= 13 ? { ember: 1 } : { near: 1 };
      return v >= 6 && v <= 7 ? { near: 1 } : v === 8 ? { ember: 1 } : {};
    }
    if (c === 1) return v >= 19 ? { dawn: 1 } : {};
    if (c === 2) return { ember: 1 };
    return v >= 10 && v <= 12 ? { ember: 1 } : v >= 13 ? { dawn: 1 } : { time: 1 };
  }
  function lsG(lv) {
    const h = here('livingstone');
    return stack(ord([], lsScene(h), [['ember', 0.6 * sm(0.35, 0.85, lv('gloom'))]]), 'lights', LS_N);
  }
  music('livingstone', {
    weight: { drone: 0.55, pad: 0.95 },
    pad: { lp: 1400, groups: {
      lights: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.3, -0.2], ['B3', 's', 0.12, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.08, 0.35], ['Gs4', 's', 0.045, -0.4], ['Cs5', 's', 0.02, 0.5]],
      works: { v: [['A2', 's', 0.44, 0], ['E3', 'soft', 0.33, -0.2], ['B3', 'soft', 0.12, 0.3], ['D4', 'soft', 0.1, -0.3], ['G4', 's', 0.035, 0.4]], pulse: [0.95, 0.16] },
      ember: [['A1', 's', 0.43, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'soft', 0.06, -0.15], ['C3', 'soft', 0.26, -0.3], ['E3', 'soft', 0.19, 0.25], ['A3', 'soft', 0.06, 0.3], ['Bb3', 's', 0.05, -0.35]],
      near: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, 0.2], ['Cs4', 'flute', 0.14, -0.3], ['E4', 's', 0.08, 0.35], ['A4', 's', 0.035, -0.4]],
      dawn: [['A2', 's', 0.38, 0], ['E3', 'soft', 0.28, -0.15], ['A3', 's', 0.15, 0.2], ['Cs4', 'soft', 0.14, -0.3], ['E4', 's', 0.1, 0.35], ['Gs4', 's', 0.045, -0.4], ['B4', 's', 0.03, 0.45], ['Ds5', 's', 0.018, -0.5]],
      stones: [['A1', 's', 0.28, 0], ['A2', 's', 0.28, 0], ['E3', 'soft', 0.27, -0.2], ['Cs4', 'soft', 0.13, 0.3], ['A2', 'over', 0.09, 0.1], ['E4', 's', 0.06, -0.4]],
      time: [['A1', 's', 0.34, 0], ['A2', 's', 0.2, 0], ['E3', 'soft', 0.28, 0.15], ['B3', 'soft', 0.13, -0.3], ['Fs4', 's', 0.05, 0.35], ['E5', 's', 0.015, -0.45]],
    } },
    mix(lv) {
      const g = lsG(lv);
      const lp = 1400 * (1 + 0.6 * g.dawn + 0.45 * g.lights + 0.3 * g.stones + 0.2 * g.near + 0.1 * g.time) * (1 - 0.27 * g.ember) * (1 - 0.1 * g.works);
      return { g, lp, drone: 1 + 0.15 * g.ember + 0.1 * g.time, dlp: 1 - 0.15 * g.ember };
    },
    scale(lv) { return LS_SC[top(lsG(lv))] || 'lyd'; },
    motif(t, g, a) {
      const G = lsG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'works':
          a.lyre('A3', a.rint(4, 5), g * 0.75, p, 'mixo', { gap: 0.26 });
          a.knocks([[0, 1200, 160, g * 0.5, false], [0.52, 1200, 160, g * 0.45, false], [1.04, 1100, 150, g * 0.5, false]], { lp: 3000, pan: -p, rev: 0.4 });
          return [11, 15];
        case 'ember': a.bowed(a.pick(['A2', 'Bb2', 'C3']), g * 0.8, p); return [12, 17];
        case 'near': if (Math.random() < 0.35) theme(a, g, p); else soft(a, g, p, 'maj', 'A4'); return [13, 18];
        case 'dawn': rising(a, g, 'lyd', 'A3', 7); return [10, 14];
        case 'stones': stone(a, g, p, a.rint(0, 6)); stone(a, g * 0.85, -p, a.rint(3, 9)); return [9, 13];
        case 'time': soft(a, g * 0.8, p, 'sus', 'A3'); return [16, 24];
        default:                                                                                    // 从上头、从众光之父那里降下来
          { const ns = []; for (let i = 0; i < 5; i++) ns.push([a.deg('lyd', 'A5', 8 - i * 2), i * 0.35, g * (0.6 - i * 0.05), 2.4]); a.strings(ns, { wave: 'sine', bright: 2, d: 2.4, pan: p, spread: 0.3, rev: 0.8 }); }
          a.lyre('A4', 4, g * 0.65, -p, 'lyd', { gap: 0.34 });
          return [11, 15];
      }
    },
    motif2(t, g, a) {
      const h = here('livingstone'), G = lsG(a.lv);
      if (G.stones > 0.5) for (let i = 0; i < 6; i++) if (h.t >= 1.5 + i * 2.6 && cue(h, 'stone' + i)) { stone(a, g, (i % 2 ? 0.35 : -0.35), i); break; }   // 一块一块活石
      if (G.dawn > 0.5 && G.ember > 0.05 && cue(h, 'light')) { a.bells(['A5', 'Cs6', 'E6', 'Gs6'], 0.12, g * 0.7, 3); }   // 出黑暗入奇妙光明
      if (G.lights > 0.5 && due('ls.gift', 2, 4)) a.ping(a.deg('lyd', 'A5', a.rint(2, 8)), 0, g * 0.4, a.pan());
      if (G.dawn > 0.5 && due('ls.dawn', 4, 7)) a.glass(g * 0.45, 1);
      if (G.time > 0.5 && due('ls.time', 3, 6)) a.starPing(g * 0.7);
      if (G.ember > 0.5 && due('ls.spark', 5, 9)) flicker(a, g * 0.25, 'phryg');                     // 一点火星（克制）
      return POLL;
    },
  });

  // ══ 普通书信 · 神就是爱（约翰一书 · 约翰二书 · 约翰三书 · 犹大书）══
  // 温暖的光，人们聚在一起（A 加九，牧笛，光点一个个聚来）；神就是光，在他毫无黑暗（利底亚）；
  // 我们得称为神的儿女（摇篮般的 A6，笛）；神就是爱——人的主题（神造人那一日的第一条旋律）在笛上清清楚楚地响一回，
  // 乐垫是无字的合唱里最暖的 A 大；爱里没有惧怕，完全的爱把惧怕除去（低处的 A 小退去，爱回来）；
  // 约翰二书、三书：在爱里、在真理中行；犹大书：保守自己常在神的爱中——末了颂赞「那能保守你们不失脚……」
  // （大合唱与铃，低通全开：荣耀、威严、能力、权柄，都归与他，从万古以前并现今，直到永永远远。阿们）。
  const GL_SC = { walk: 'maj', light: 'lyd', children: 'maj', love: 'maj', fear: 'aeol', glory: 'maj' };
  const GL_N = Object.keys(GL_SC);
  function glScene(h) {
    const c = h.ch, v = h.v, bk = h.bk;
    const jude = /犹大/.test(bk) || bk === '犹', j2 = /二/.test(bk), j3 = /三/.test(bk);
    if (!c) return {};
    if (jude) return v >= 24 ? { glory: 1 } : v >= 20 ? { love: 1 } : {};
    if (j2) return { love: 0.6 };
    if (j3) return {};
    if (c === 1) return v >= 5 && v <= 7 ? { light: 1 } : v >= 8 ? { children: 1 } : {};
    if (c === 2) return v >= 8 && v <= 11 ? { light: 1 } : {};
    if (c === 3) return v <= 3 ? { children: 1 } : v >= 16 && v <= 18 ? { love: 1 } : {};
    if (c === 4) return v === 18 ? { love: sm(8, 16, h.tv), fear: 1 } : v >= 7 ? { love: 1 } : {};
    if (c === 5) return v <= 3 ? { love: 1 } : { light: 1 };
    return { love: 1 };
  }
  function glG(lv) {
    const h = here('godislove');
    return stack(ord([], glScene(h), [['fear', 0.6 * sm(0.35, 0.85, lv('gloom'))]]), 'walk', GL_N);
  }
  music('godislove', {
    weight: { drone: 0.5, pad: 1 },
    pad: { lp: 1500, groups: {
      walk: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.32, -0.2], ['B3', 'soft', 0.14, 0.3], ['Cs4', 'soft', 0.13, -0.3], ['E4', 's', 0.07, 0.4]],
      light: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.28, 0.15], ['B3', 's', 0.12, -0.3], ['Cs4', 'soft', 0.14, 0.3], ['E4', 's', 0.09, -0.35], ['Gs4', 's', 0.05, 0.4], ['Ds5', 's', 0.02, -0.45]],
      children: [['A2', 's', 0.42, 0], ['E3', 'soft', 0.3, -0.2], ['Cs4', 'flute', 0.14, 0.3], ['Fs4', 's', 0.06, -0.35], ['A4', 's', 0.04, 0.4]],
      love: [['A2', 's', 0.4, 0], ['E3', 'soft', 0.24, -0.15], ['Cs4', 'soft', 0.1, 0.3], ['A3', 'choir', 0.12, 0], ['Cs4', 'choir', 0.1, 0], ['E4', 'choir', 0.1, 0], ['B4', 's', 0.03, 0.45]],
      fear: [['A1', 's', 0.43, 0], ['E2', 'soft', 0.32, 0.1], ['A2', 'soft', 0.08, -0.15], ['C3', 'soft', 0.27, -0.3], ['E3', 'soft', 0.15, 0.25], ['F3', 's', 0.07, 0.35]],
      glory: [['A1', 's', 0.24, 0], ['A2', 's', 0.24, 0], ['E3', 's', 0.18, -0.15], ['A3', 'choir', 0.15, 0], ['Cs4', 'choir', 0.12, 0], ['E4', 'choir', 0.12, 0], ['A4', 'choir', 0.09, 0], ['Cs5', 's', 0.04, 0.45], ['E5', 's', 0.025, -0.5]],
    } },
    mix(lv) {
      const g = glG(lv);
      const lp = 1500 * (1 + 0.8 * g.glory + 0.5 * g.light + 0.35 * g.love + 0.2 * g.children + 0.1 * g.walk) * (1 - 0.3 * g.fear);
      return { g, lp, drone: 1 + 0.15 * g.fear - 0.15 * g.glory, dlp: 1 - 0.2 * g.fear + 0.1 * g.glory };
    },
    scale(lv) { return GL_SC[top(glG(lv))] || 'maj'; },
    motif(t, g, a) {
      const h = here('godislove'), G = glG(a.lv), k = top(G), p = a.pan();
      switch (k) {
        case 'light': a.lyre('A4', a.rint(4, 5), g * 0.8, p, 'lyd'); return [11, 15];
        case 'children': abba(a, g * 0.9, p); if (Math.random() < 0.5) soft(a, g * 0.8, -p, 'maj', 'A4'); return [13, 18];
        case 'love':
          if (h.t > 14 && Math.random() < 0.6) theme(a, g, p, { slow: 1.1 });
          else a.choir(['A3', 'Cs4', 'E4', 'A4'], { gs: [1, 0.85, 0.7, 0.5], g: g * 0.7, a: 1.2, s: 1.2, r: 2.8, pan: p * 0.4 });
          return [11, 15];
        case 'fear': a.bowed(a.pick(['A2', 'C3', 'E3']), g * 0.8, p); return [13, 18];
        case 'glory': psalm(a, g); rising(a, g * 0.8, 'maj', 'A3', 8); return [9, 13];
        default: if (Math.random() < 0.5) a.shepherd(g * 0.85, p); else a.lyre('A4', a.rint(3, 5), g * 0.75, p, 'maj', { gap: 0.32 }); return [12, 17];
      }
    },
    motif2(t, g, a) {
      const h = here('godislove'), G = glG(a.lv);
      if (G.love > 0.5 && cue(h, 'love')) { theme(a, g * 1.15, 0, { slow: 1.1, at: G.fear > 0.05 ? 0 : 0.8 }); if (G.fear > 0.05) a.glass(g * 0.5, 2); }   // 神就是爱
      if (G.glory > 0.5 && cue(h, 'glory')) { good(a, g); unison(a, g, 0); }                       // 荣耀、威严、能力、权柄都归与他
      if (G.glory > 0.5 && due('gl.glory', 2, 4)) a.glass(g * 0.45, 2);
      if (G.walk > 0.5 && due('gl.gather', 7, 11)) gathering(a, g * 0.8, 'maj');                  // 人们聚在一起
      if (G.light > 0.5 && due('gl.light', 2, 4)) a.ping(a.deg('lyd', 'A5', a.rint(0, 6)), 0, g * 0.4, a.pan());
      if (G.love > 0.5 && due('gl.love', 5, 8)) a.glass(g * 0.35, 1);
      return POLL;
    },
  });
})(window.GS);
